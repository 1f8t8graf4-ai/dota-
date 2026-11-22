#!/usr/bin/env python3
"""v23.1 (22.11): звук двух прологов (v231y — A, v232y — B) без голоса — как v230_sound.py (гул сцены, «тук-тук» капли, удар баса,
молния кольца, в конце — такты 1–2 музыки главы 1 из-под фильтра), события — из cues.json ролика.
   python3 v231_sound.py v231y-ru [styk 8]   → out/<ролик>/snd/mix.wav, final.mp4 (и styk.mp4 — пролог + первые 8 с главы 1)"""
import json, os, sys
import numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
import v230_sound as V, tt_audio, subprocess
from v180_sound import sfx_track
SR = V.SR


def build(ep):
    o = os.path.join(HERE, 'out', ep); od = os.path.join(o, 'snd'); os.makedirs(od, exist_ok=True)
    T = json.load(open(os.path.join(o, 'timeline.json'))); TE = T['dur']; n = int(round(TE * SR))
    C = json.load(open(os.path.join(o, 'cues.json')))
    fl = next(c[0] for c in C if c[1] == 'drop') + .03
    K = {'TE': TE, 'crack': fl - .5, 'flare': fl, 'grow': [c[0] for c in C if c[1] == 'plop'][-1] + .04}
    buf = np.zeros((n + SR, 2))
    V.put(buf, V.drone(n, K), 0, .2)
    for t0, nm, g0, pan in C:
        if nm == 'hb': V.put(buf, V.thump(92, 46, .32, .11), t0, .5 * g0); V.put(buf, .55 * V.thump(80, 44, .3, .1), t0 + .19, .5 * g0); V.put(buf, V.click(.003), t0, .07 * g0)
        elif nm == 'drop': V.put(buf, V.thump(120, 31, 1.8, .75), t0, .75); V.put(buf, V.click(.02, .3), t0, .16)
        elif nm == 'zip':
            te = next(c[0] for c in C if c[1] == 'zipend'); z = V.zipper(te - t0); V.put(buf, z, t0, .3, -.1); V.put(buf, V.click(.006, .6), te, .45)
    sfx = sfx_track([c for c in C if c[1] not in ('hb', 'drop', 'zip', 'zipend')], TE + 1); buf[:len(sfx)] += 1.7 * sfx[:len(buf)]
    x = np.tanh(buf[:n] * 1.4) / 1.4
    x += V.preroll(n, K)
    f = int(.003 * SR); x[-f:] *= np.linspace(1, 0, f)[:, None]
    mw = os.path.join(od, 'mix.wav'); sf.write(mw, x.astype(np.float32), SR, subtype='PCM_16')
    print(os.path.basename(mw), tt_audio.report(mw), 'пик %.2f' % np.abs(x).max())
    fin = os.path.join(o, 'final.mp4')
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', os.path.join(o, 'video.mp4'), '-i', mw, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', fin], check=True)
    return o, TE, mw


if __name__ == '__main__':
    ep = sys.argv[1]; o, TE, mw = build(ep)
    if len(sys.argv) > 2 and sys.argv[2] == 'styk': V.styk(o, TE, mw, int(sys.argv[3]) if len(sys.argv) > 3 else 8)
