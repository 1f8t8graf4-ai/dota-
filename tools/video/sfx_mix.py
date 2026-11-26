#!/usr/bin/env python3
"""Сведение: голос + звуки по списку событий + музыка → −14 LUFS.

  python3 tools/video/sfx_mix.py --voice voice.wav --cues cues.json --out mix.wav
  python3 tools/video/sfx_mix.py --voice v.wav --cue latch@16.42:-4 --cue click@12.53 \\
          --music bed.wav --music-db -16 --dur 17.6 --out mix.wav --stems out/stems

cues.json — список событий: [{"t": 16.42, "id": "latch", "db": -4, "v": 1, "len": 0.6}, …]
  t   — секунда в ролике, где звук должен ударить (тишина в начале звука срезается сама);
  id  — папка в sfx/ (sfx/latch/*.mp3 …);
  db  — громкость относительно нормы (0 — норма, −6 — тише);
  v   — номер варианта (по умолчанию по кругу: одинаковые звуки не повторяются подряд);
  len — обрезать звук до N секунд (хвост гаснет за 30 мс).
--cue id@t[:db] — то же из командной строки.

Как сводит:
- каждый звук: срез тишины → норма −20 dBFS по самому громкому окну 50 мс → db события → на место;
- все звуки — в общую шину; шина приседает под голос (ffmpeg sidechaincompress: ratio 8,
  attack 5 мс, release 250 мс) — под речью звуки тише на 12–16 дБ, в паузах — как есть;
- музыка — своей шиной так же (ratio 6);
- голос + шины → loudnorm в два прохода (−14 LUFS, true peak −1 dBTP).
В конце пишет, на сколько дБ звуки реально приседали под голосом, итоговую громкость и пик.
"""
import argparse, glob, json, os, re, subprocess, sys, tempfile
import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SFX = os.path.join(ROOT, 'sfx')
SR = 48000
EXT = ('.mp3', '.wav', '.ogg', '.flac', '.m4a')


def dec(f, ch=1):
    """Без -ac: ffmpeg при сведении в моно поднимает на 3 дБ, при разведении в стерео — опускает."""
    n = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=channels',
                        '-of', 'csv=p=0', f], capture_output=True, text=True).stdout.strip().strip(',').split(',')[0]
    n = int(n) if n.isdigit() else 1
    p = subprocess.run(['ffmpeg', '-v', 'error', '-nostdin', '-i', f, '-map', '0:a:0', '-ar', str(SR),
                        '-f', 'f32le', '-'], capture_output=True)
    if p.returncode:
        sys.exit(f'не читается {f}: {p.stderr.decode()[:200]}')
    y = np.frombuffer(p.stdout, np.float32)
    y = y[:len(y) // n * n].reshape(-1, n)
    if ch == 1:
        return y.mean(1)
    return np.repeat(y, 2, 1) if n == 1 else y[:, :2]


def wav(f, y):
    y = np.atleast_2d(y.T).T if y.ndim == 1 else y
    subprocess.run(['ffmpeg', '-v', 'error', '-nostdin', '-y', '-f', 'f32le', '-ar', str(SR),
                    '-ac', str(y.shape[1]), '-i', '-', '-c:a', 'pcm_f32le', f],
                   input=np.ascontiguousarray(y, np.float32).tobytes(), check=True)


def db(x):
    return 20 * np.log10(max(float(x), 1e-9))


def parse_cue(s):
    m = re.fullmatch(r'([\w-]+)@([\d.]+)(?::(-?[\d.]+))?', s)
    if not m:
        sys.exit(f'--cue {s}: нужно id@секунда[:дБ]')
    return {'id': m[1], 't': float(m[2]), 'db': float(m[3] or 0)}


def clip_for(ev, used):
    fs = sorted(f for f in glob.glob(os.path.join(SFX, ev['id'], '*')) if f.lower().endswith(EXT))
    if not fs:
        return None, None
    k = ev.get('v')
    if k is None:
        k = used.get(ev['id'], 0); used[ev['id']] = k + 1
    f = fs[int(k) % len(fs)]
    y = dec(f)
    pk = np.abs(y).max() + 1e-9
    act = np.where(np.abs(y) > pk * 10 ** (-40 / 20))[0]
    y = y[act[0]:act[-1] + 1] if len(act) else y
    w = 2400
    n = max(len(y) // w, 1)
    loud = np.sqrt((y[:n * w].reshape(n, -1) ** 2).mean(1)).max() if len(y) >= w else np.sqrt((y ** 2).mean())
    y = y * (10 ** (-20 / 20) / max(loud, 1e-6)) * 10 ** (ev.get('db', 0) / 20)
    if ev.get('len'):
        y = y[:int(ev['len'] * SR)]
    fo = min(int(0.03 * SR), len(y))
    y = y.copy(); y[len(y) - fo:] *= np.linspace(1, 0, fo)
    fi = min(int(0.002 * SR), len(y)); y[:fi] *= np.linspace(0, 1, fi)
    return y, os.path.relpath(f, ROOT)


def measure(f):
    p = subprocess.run(['ffmpeg', '-nostats', '-nostdin', '-i', f, '-af', 'ebur128=peak=true', '-f', 'null', '-'],
                       capture_output=True, text=True).stderr
    I = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', p)[-1])
    tp = re.findall(r'Peak:\s+(-?[\d.]+|-inf) dBFS', p)
    return I, float(tp[-1]) if tp and tp[-1] != '-inf' else -99.0


def loudnorm(inp, out, I, TP):
    """Ровное усиление до I LUFS + лимитер пиков (без «качания» dynamic-режима loudnorm)."""
    i0, _ = measure(inp)
    g = I - i0
    lim = 10 ** ((TP - 0.6) / 20)  # запас на межсэмпловые пики
    for _ in range(3):
        af = f'volume={g:.2f}dB,alimiter=limit={lim:.4f}:attack=5:release=60:level=false,aresample=48000'
        subprocess.run(['ffmpeg', '-v', 'error', '-nostdin', '-y', '-i', inp, '-af', af, '-c:a', 'pcm_s24le', out],
                       check=True)
        i1, tp1 = measure(out)
        if abs(i1 - I) < 0.3:
            break
        g += I - i1
    return i1, tp1, 'gain+limiter'


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--voice', required=True)
    ap.add_argument('--cues', help='cues.json')
    ap.add_argument('--cue', action='append', default=[])
    ap.add_argument('--music')
    ap.add_argument('--music-db', type=float, default=-16, help='музыка относительно голоса, дБ')
    ap.add_argument('--dur', type=float, help='длина ролика, с (по умолчанию — по голосу)')
    ap.add_argument('--lufs', type=float, default=-14)
    ap.add_argument('--tp', type=float, default=-1)
    ap.add_argument('--duck', type=float, default=14, help='на сколько дБ звуки тише под речью (12–16)')
    ap.add_argument('--out', required=True)
    ap.add_argument('--stems', help='папка: sfx_dry.wav, sfx_duck.wav, music_duck.wav')
    a = ap.parse_args()

    ev = (json.load(open(a.cues, encoding='utf8')) if a.cues else []) + [parse_cue(c) for c in a.cue]
    v = dec(a.voice, 2)
    N = int((a.dur or len(v) / SR) * SR)
    v = np.pad(v, ((0, max(N - len(v), 0)), (0, 0)))[:N]
    bus = np.zeros(N, np.float32)
    used, log, miss = {}, [], []
    for e in sorted(ev, key=lambda e: e['t']):
        y, f = clip_for(e, used)
        if y is None:
            miss.append(e['id']); continue
        i = int(e['t'] * SR)
        j = min(i + len(y), N)
        if i < N:
            bus[i:j] += y[:j - i]
        log.append((e['t'], e['id'], f))
    # порог приседания подбирается по самой речи: звуки (или ровный шум, если под речью звуков нет)
    # сводим с голосом и двигаем порог, пока под речью они не станут тише ровно на --duck дБ
    w = 960
    k = N // w
    vr = np.sqrt((v[:k * w].mean(1).reshape(k, w) ** 2).mean(1))
    talk = vr > 10 ** (-40 / 20)
    calm = ~np.convolve(talk, np.ones(16), 'full')[:k].astype(bool)  # пауза — 0,3 с после конца речи
    tmp = tempfile.mkdtemp(prefix='sfxmix-')
    P = lambda n: os.path.join(tmp, n)
    wav(P('v.wav'), v)
    wav(P('s.wav'), np.stack([bus, bus], 1))
    wav(P('n.wav'), np.repeat(np.full((N, 1), 0.05, np.float32) * np.sign(np.random.default_rng(1).standard_normal((N, 1))), 2, 1))

    def sc_of(thr, ratio=8, att=5, rel=250):
        return f'sidechaincompress=threshold={thr:.6f}:ratio={ratio}:attack={att}:release={rel}:makeup=1'

    def duck_of(src, thr, mask):
        subprocess.run(['ffmpeg', '-v', 'error', '-nostdin', '-y', '-i', P('v.wav'), '-i', P(src),
                        '-filter_complex', f'[1:a][0:a]{sc_of(thr)}[o]', '-map', '[o]', '-c:a', 'pcm_f32le',
                        P('d_' + src)], check=True)
        dry = dec(P(src), 2)[:N, 0]
        wet = dec(P('d_' + src), 2)[:N, 0]
        dr = (dry[:k * w].reshape(k, w) ** 2).mean(1)
        wr = (wet[:k * w].reshape(k, w) ** 2).mean(1)
        m = mask & (dr > 1e-7)
        return (db(np.sqrt(wr[m].sum() / max(dr[m].sum(), 1e-12))) if m.any() else None), wet

    sp = db(np.median(vr[talk])) if talk.any() else -20
    thr_db = sp - a.duck / (1 - 1 / 8)
    src = 'n.wav'
    if duck_of('s.wav', 10 ** (thr_db / 20), talk)[0] is not None:
        src = 's.wav'  # звуки сами попадают под речь — подбираем по ним
    for _ in range(5):
        got, _w = duck_of(src, 10 ** (thr_db / 20), talk)
        if got is None or abs(-got - a.duck) < 0.5:
            break
        thr_db += (-got - a.duck) / (1 - 1 / 8)
    a.thr = 10 ** (thr_db / 20)
    sc = sc_of(a.thr)
    ins = ['-i', P('v.wav'), '-i', P('s.wav')]
    sc = f'sidechaincompress=threshold={a.thr}:ratio=8:attack=5:release=250:makeup=1'
    fc = f'[0:a]asplit=3[vm][vs1][vs2];[1:a][vs1]{sc}[sd]'
    mix = '[vm][sd]'
    n = 2
    if a.music:
        m = dec(a.music, 2)
        m = np.pad(m, ((0, max(N - len(m), 0)), (0, 0)))[:N]
        vr = np.sqrt((v ** 2).mean()) + 1e-9
        mr = np.sqrt((m ** 2).mean()) + 1e-9
        m = m * (vr / mr) * 10 ** (a.music_db / 20)
        wav(P('m.wav'), m)
        ins += ['-i', P('m.wav')]
        fc += f';[2:a][vs2]{sc_of(a.thr, 6, 10, 400)}[md]'
        mix += '[md]'; n = 3
    else:
        fc += ';[vs2]anullsink'
    fc += f';{mix}amix=inputs={n}:normalize=0:dropout_transition=0[o]'
    subprocess.run(['ffmpeg', '-v', 'error', '-nostdin', '-y', *ins, '-filter_complex', fc, '-map', '[o]',
                    '-c:a', 'pcm_f32le', P('pre.wav')], check=True)
    I, TP, kind = loudnorm(P('pre.wav'), a.out, a.lufs, a.tp)

    dry = bus
    duck_t, wet = duck_of('s.wav', a.thr, talk)
    duck_p, _ = duck_of('s.wav', a.thr, calm)
    if a.stems:
        os.makedirs(a.stems, exist_ok=True)
        wav(os.path.join(a.stems, 'sfx_dry.wav'), dry)
        wav(os.path.join(a.stems, 'sfx_duck.wav'), wet)
    for t, i_, f in log:
        print(f'  {t:6.2f}  {i_:<8} {f}')
    if miss:
        print('  нет в sfx/:', ', '.join(sorted(set(miss))))
    print(f'звуков: {len(log)}; под голосом шина тише на {-duck_t:.1f} дБ' if duck_t is not None else f'звуков: {len(log)}',
          f'; в паузах (0,3 с после речи) — на {-duck_p:.1f} дБ' if duck_p is not None else '')
    print(f'итог: {I:.1f} LUFS, true peak {TP:.1f} dBTP ({kind}) → {a.out}')
    sys.exit(2 if miss else 0)


if __name__ == '__main__':
    main()
