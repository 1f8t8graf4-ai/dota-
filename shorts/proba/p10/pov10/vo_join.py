#!/usr/bin/env python3
"""«Твоими глазами» v6 (27.11): склейка голоса — pov6a (до «прорывает:») + место под голос Макса из фильма + pov6b.
  VO=<папка> python3 vo_join.py <голос Макса.wav>  →  <папка>/pov10.wav + pov10.words.json (поле maxq — где звучит Макс)
Голос Макса — my-skills (приватный), в публичные репо не класть."""
import json, os, subprocess, sys
import numpy as np, soundfile as sf
D = os.environ['VO']; SR = 44100
def mono(p):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).copy()
A = mono(f'{D}/pov6a.wav'); B = mono(f'{D}/pov6b.wav'); M = mono(sys.argv[1])
a = np.abs(M); on = int(np.argmax(a > a.max() * .06)); off = len(M) - int(np.argmax(a[::-1] > a.max() * .06))
Lm = (off - on) / SR
WA = json.load(open(f'{D}/pov6a.words.json'))['words']; WB = json.load(open(f'{D}/pov6b.words.json'))['words']
ta = WA[-1]['b'] + .32                       # пауза после «прорывает:»
tb = ta + Lm + .38                          # пауза после Макса
n = int(tb * SR); y = np.zeros(n + len(B), np.float32)
y[:min(len(A), int(ta * SR))] = A[:min(len(A), int(ta * SR))]
y[n:n + len(B)] = B
W = WA + [{'a': round(w['a'] + tb, 3), 'b': round(w['b'] + tb, 3), 'w': w['w']} for w in WB]
sf.write(f'{D}/pov10.wav', y, SR)
json.dump({'dur': round(len(y) / SR, 3), 'words': W, 'maxq': {'a': round(ta, 3), 'b': round(ta + Lm, 3), 'on': round(on / SR, 3)}, 'nA': len(WA)},
          open(f'{D}/pov10.words.json', 'w'), ensure_ascii=False, indent=0)
print('длина', round(len(y) / SR, 2), 'с; Макс', round(ta, 2), '–', round(ta + Lm, 2), '; слов', len(W))
