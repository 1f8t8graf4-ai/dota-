#!/usr/bin/env python3
"""Проверка звуков до того, как их кто-то слушал.

  python3 tools/video/sfx_check.py sfx/latch/*.mp3          # таблица + вердикт
  python3 tools/video/sfx_check.py sfx/ --json              # вся библиотека, JSON
  python3 tools/video/sfx_check.py mix.wav --long           # длинный файл (голос, музыка, микс)

Что меряет у каждого файла:
- длина звука (без тишины по краям) и сколько тишины в начале и в конце;
- пик (dBFS) и клиппинг — сколько сэмплов упёрлось в потолок;
- шумовой пол — уровень тишины по краям (нет тишины — «—»);
- громкость LUFS (ffmpeg ebur128; у звука короче 0,4 с — максимум за 400 мс);
- центр спектра, доля гула (< 150 Гц) и шипа (> 6 кГц) — идея sfx-candidates.py из motion-video-kit.
Вердикт:
- BAD — клиппинг, нет звука вовсе, тишина в начале > 0,25 с (звук встанет не в кадр);
- WARN — гул > 50 %, шип > 40 %, громкий шумовой пол (> −45 dBFS), слишком тихо (< −35 LUFS), длинный (> 2 с) для удара.
Код выхода 1, если есть BAD.
"""
import argparse, json, os, re, subprocess, sys
import numpy as np

SR = 48000
EXT = ('.mp3', '.wav', '.ogg', '.flac', '.m4a', '.aac')


def decode(f, keep=False):
    """Без -ac: ffmpeg при сведении в моно поднимает на 3 дБ, при разведении в стерео — опускает."""
    ch = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=channels',
                         '-of', 'csv=p=0', f], capture_output=True, text=True).stdout.strip().strip(',').split(',')[0]
    ch = int(ch) if ch.isdigit() else 1
    p = subprocess.run(['ffmpeg', '-v', 'error', '-nostdin', '-i', f, '-map', '0:a:0', '-ar', str(SR),
                        '-f', 'f32le', '-'], capture_output=True)
    y = np.frombuffer(p.stdout, np.float32)
    y = y[:len(y) // ch * ch].reshape(-1, ch)
    return y if keep else y.mean(1)


def lufs(f):
    p = subprocess.run(['ffmpeg', '-nostats', '-nostdin', '-i', f, '-af', 'ebur128=framelog=verbose',
                       '-f', 'null', '-'], capture_output=True, text=True)
    I = re.findall(r'^\s*I:\s+(-?[\d.]+|-inf) LUFS', p.stderr, re.M)
    M = [float(x) for x in re.findall(r' M:\s*(-?[\d.]+)', p.stderr)]
    i = float(I[-1]) if I and I[-1] != '-inf' else -99.0
    return i, (max(M) if M else -99.0)


def db(x):
    return 20 * np.log10(max(float(x), 1e-9))


def measure(f, long=False):
    Y = decode(f, keep=True)
    y = Y.mean(1) if len(Y) else np.zeros(0, np.float32)
    if not len(y):
        return {'file': f, 'verdict': 'BAD', 'why': ['не читается']}
    w = 2400  # 50 мс
    n = len(y) // w
    rms = np.sqrt((y[:n * w].reshape(n, w) ** 2).mean(1) + 1e-12) if n else np.array([np.abs(y).max()])
    pk = np.abs(Y).max()
    gate = max(pk * 10 ** (-40 / 20), 10 ** (-60 / 20))
    act = np.where(np.abs(y) > gate)[0]
    if not len(act):
        return {'file': f, 'verdict': 'BAD', 'why': ['тишина']}
    lead, tail = act[0] / SR, (len(y) - act[-1]) / SR
    dur = (act[-1] - act[0]) / SR
    clip = int((np.abs(Y) >= 0.999).any(1).sum())
    out = np.concatenate([y[:max(act[0] - 240, 0)], y[act[-1] + 240:]])  # только тишина по краям
    floor = db(np.sqrt((out ** 2).mean())) if len(out) > SR * 0.05 else None
    F = np.abs(np.fft.rfft(y[act[0]:act[-1] + 1])) ** 2
    fr = np.fft.rfftfreq(act[-1] - act[0] + 1, 1 / SR)
    tot = F.sum() + 1e-12
    cen, lo, hi = (F * fr).sum() / tot, F[fr < 150].sum() / tot, F[fr > 6000].sum() / tot
    I, Mmax = lufs(f)
    L = I if dur >= 0.4 and I > -70 else (Mmax if Mmax > -70 else db(rms.max()) - 0.7)  # короткий — по самому громкому окну
    bad, warn = [], []
    if clip > 2: bad.append(f'клиппинг {clip}')
    if not long and lead > 0.25: bad.append(f'тишина в начале {lead:.2f} c')
    if lo > .5 and not long: warn.append('гул')
    if hi > .4 and not long: warn.append('шип')
    if floor is not None and floor > -45 and not long: warn.append(f'шум {floor:.0f} dBFS')
    if L < -35: warn.append('тихо')
    if not long and dur > 2: warn.append('длинный')
    return {'file': f, 'dur': round(dur, 3), 'lead': round(lead, 3), 'tail': round(tail, 3),
            'peak_db': round(db(pk), 1), 'clip': clip, 'floor_db': None if floor is None else round(floor, 1), 'lufs': round(L, 1),
            'centroid': int(cen), 'low': round(lo, 2), 'high': round(hi, 2),
            'verdict': 'BAD' if bad else ('WARN' if warn else 'OK'), 'why': bad + warn}


def files(args):
    for a in args:
        if os.path.isdir(a):
            for r, _, fs in os.walk(a):
                for x in sorted(fs):
                    if x.lower().endswith(EXT):
                        yield os.path.join(r, x)
        else:
            yield a


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('paths', nargs='+')
    ap.add_argument('--json', action='store_true')
    ap.add_argument('--long', action='store_true', help='голос / музыка / микс: тишина и длина не ошибка')
    a = ap.parse_args()
    out = [measure(f, a.long) for f in files(a.paths)]
    if a.json:
        print(json.dumps(out, ensure_ascii=False, indent=1))
    else:
        for r in out:
            if 'dur' not in r:
                print(f"BAD  {r['file']}  {', '.join(r['why'])}"); continue
            print(f"{r['verdict']:<4} {r['file']}  {r['dur']:.2f}c  нач {r['lead']:.2f}  кон {r['tail']:.2f}  "
                  f"пик {r['peak_db']}  шум {r['floor_db'] if r['floor_db'] is not None else '—'}  {r['lufs']} LUFS  {r['centroid']} Гц"
                  + (f"  — {', '.join(r['why'])}" if r['why'] else ''))
    sys.exit(1 if any(r['verdict'] == 'BAD' for r in out) else 0)


if __name__ == '__main__':
    main()
