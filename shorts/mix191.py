#!/usr/bin/env python3
"""v19.1 (17.11): звук выпуска 2 — голос + звуки + «Кашелот» (инструментал; в git не кладём — путь аргументом).
Трек: тихое интро 0–21 с, грув 22–65, брейк 66–75 (ложится под «WS-23»), грув 76–109, тихий хвост 110+. Такт 2,74 с.
Чтобы конец ролика (доска, 1924) не попал в тихий хвост трека, на 82,5 с ролика трек прыгает на 4 такта назад — ровно в долю, наплыв 0,3 с.
  python3 mix191.py v191y-ru|v191s-ru <трек.mp3> [смещение=22.2]   → out/<ролик>/snd/mix.wav"""
import json, os, subprocess, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
import v165_sound as VS
from v180_sound import sfx_track, final
SR, BAR = 48000, 2.7429


def dec(track):
    b = subprocess.run(['ffmpeg', '-v', 'error', '-i', track, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(b, np.float32).reshape(-1, 2).astype(np.float64)


def bed(track, dur, off, tail, jump=82.5, back=4):
    s = dec(track); n = int(dur * SR); x = np.zeros((n, 2)); j = int(jump * SR); xf = int(.3 * SR)
    a = s[int(off * SR):int(off * SR) + j + xf]; x[:len(a)] = a[:n]
    src2 = int((off + jump - back * BAR) * SR); b = s[src2:src2 + (n - j)]
    w = np.linspace(0, 1, xf)[:, None]; x[j:j + xf] = a[j:j + xf] * (1 - w) + b[:xf] * w; x[j + xf:j + len(b)] = b[xf:]
    f = int(.03 * SR); x[:f] *= np.linspace(0, 1, f)[:, None]; m = int(tail * SR); x[-m:] *= np.linspace(1, 0, m)[:, None]
    return x


if __name__ == '__main__':
    ep, track = sys.argv[1:3]; off = float(sys.argv[3]) if len(sys.argv) > 3 else 22.2
    o = os.path.join(HERE, 'out', ep); od = os.path.join(o, 'snd'); os.makedirs(od, exist_ok=True)
    T = json.load(open(os.path.join(o, 'timeline.json'))); dur = np.ceil(T['dur'] * 30) / 30
    sw = os.path.join(od, 'sfx.wav'); VS.wav(sfx_track(json.load(open(os.path.join(o, 'cues.json'))), dur), sw)
    bw = os.path.join(od, 'bed.wav'); VS.wav(bed(track, dur, off, .25 if ep.startswith('v191s') else 1.4), bw)
    final(os.path.join(o, 'voice.wav'), sw, bw, os.path.join(od, 'mix.wav'), dur)
