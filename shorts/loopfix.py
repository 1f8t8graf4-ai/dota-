#!/usr/bin/env python3
"""v23.6 (23.11): шортсы — музыка без «удара» в начале петли. Андрей: «в начале варианта ruhig … громкий Кашалот».
Причина: голос начинается через 0,15–0,3 с после кадра 0, до первого слова подложка играет без проседания (на 8–10 дБ громче, чем под голосом),
а в конце шортса она тихая (последняя фраза, дыра в конце такта) — на петле звучит как удар громкой музыки. В спокойной версии басы те же — глухой «бум».
Фикс: до первого слова подложка — на том же уровне, что сразу под голосом, к началу слова — плавно к прежней огибающей.
  fix_start(b, voice, sr)               — массив подложки (n, 2) → исправленный (встроено в v200/v210/v220/v225_sound.py и l10n/dub.sound для шортсов)
  python3 loopfix.py [-f] <ролик> […]  — уже собранные шортсы (-f — пересвести, даже если подложка уже исправлена): snd/bed.wav, mix.wav (M.final), final.mp4; спокойная версия — заново v235_calm.py
  python3 loopfix.py --check <ролик> […] — проверка: подложка до первого слова не громче, чем под ним, больше чем на 1,5 дБ"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, '..', 'tools'))


def _mono(x): return x if x.ndim == 1 else x.mean(1)


def onset(v, sr, thr_db=-40.):   # начало первого слова: первые 10 мс громче thr_db от пика речи
    v = _mono(v); hop = int(.01 * sr); n = len(v) // hop
    if n == 0: return None
    e = np.sqrt((v[:n * hop].reshape(n, hop) ** 2).mean(1)); ref = np.percentile(e[e > 1e-5], 90) if (e > 1e-5).any() else 0
    k = np.nonzero(e > ref * 10 ** (thr_db / 20))[0] if ref else []
    return k[0] * hop / sr if len(k) else None


def levels(b, v, sr):   # (уровень подложки до первого слова, уровень сразу под ним), дБ
    t0 = onset(v, sr)
    if t0 is None or t0 < .03: return None, None, t0
    rms = lambda a, c: 20 * np.log10(np.sqrt((_mono(b)[int(a * sr):int(c * sr)] ** 2).mean()) + 1e-12)
    return rms(0, t0), rms(t0 + .15, t0 + 1.15), t0


def fix_start(b, v, sr, tol=1.0):
    pre, under, t0 = levels(b, v, sr)
    if pre is None or t0 > 2.5 or pre - under <= tol: return b if pre is None else loop_in(b, sr, t0)
    g = 10 ** ((under - pre) / 20); k0, k1 = int((t0 - .02) * sr), int((t0 + .15) * sr)
    env = np.ones(len(b)); env[:k0] = g; u = np.linspace(0, 1, k1 - k0); env[k0:k1] = g + (1 - g) * (.5 - .5 * np.cos(np.pi * u))
    b = b * (env[:, None] if b.ndim == 2 else env)
    return loop_in(b, sr, t0)


def loop_in(b, sr, t0):   # петля: конец шортса тише начала (последняя фраза, хвост) — музыка в начале поднимается от уровня конца, без ступеньки
    m = _mono(b); r = lambda a, c: 20 * np.log10(np.sqrt((m[int(a * sr):int(c * sr)] ** 2).mean()) + 1e-12)
    end, beg = r(len(m) / sr - .3, len(m) / sr), r(0, .15)
    if beg - end <= 3: return b
    k = int(min(.25, max(.12, t0)) * sr); g = 10 ** ((end - beg) / 20); u = np.linspace(0, 1, k)
    env = np.ones(len(b)); env[:k] = g + (1 - g) * (.5 - .5 * np.cos(np.pi * u))
    return b * (env[:, None] if b.ndim == 2 else env)


def refix(ep, force=False):
    import mix193 as M, v165_sound as VS, tt_audio
    o = os.path.join(HERE, 'out', ep); od = os.path.join(o, 'snd'); bw = os.path.join(od, 'bed.wav')
    T = json.load(open(os.path.join(o, 'timeline.json'))); dur = np.ceil(T.get('vo_dur', T['dur']) * 30) / 30
    b = M.dec(bw); v = M.dec(os.path.join(o, 'voice.wav')); pre, under, t0 = levels(b, v, M.SR)
    if not force and (pre is None or pre - under <= 1.0): print(ep, 'без правки:', pre and f'{pre - under:+.1f} дБ'); return False
    VS.wav(fix_start(b, v, M.SR), bw); mw = os.path.join(od, 'mix.wav'); M.final(os.path.join(o, 'voice.wav'), os.path.join(od, 'sfx.wav'), bw, mw, dur)
    fin = os.path.join(o, 'final.mp4'); src = fin + '.pre.mp4'; os.replace(fin, src)   # картинка — из готового final.mp4 (у некоторых шортсов он склеен из кусков)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', src, '-i', mw, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
                    '-t', f'{dur:.4f}', '-movflags', '+faststart', fin], check=True); os.remove(src)
    print(ep, f'до первого слова было {(pre or 0) - (under or 0):+.1f} дБ к уровню под голосом → 0', tt_audio.report(mw)); return True


def check(ep):
    import mix193 as M
    o = os.path.join(HERE, 'out', ep); res = []
    for f in ('bed.wav', 'bed_calm.wav'):
        p = os.path.join(o, 'snd', f)
        if not os.path.exists(p): continue
        pre, under, t0 = levels(M.dec(p), M.dec(os.path.join(o, 'voice.wav')), M.SR)
        if pre is not None: res.append(f'{f} {pre - under:+.1f} дБ' + (' ✗' if pre - under > 1.5 else ' ✓'))
    print(ep.ljust(13), ' · '.join(res)); return all('✓' in r for r in res)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == '--check': sys.exit(0 if all([check(e) for e in a[1:]]) else 1)
    f = '-f' in a
    for e in a:
        if e != '-f': refix(e, f)
