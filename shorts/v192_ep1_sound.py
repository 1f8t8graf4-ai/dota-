#!/usr/bin/env python3
"""v19.2 (17.11): звук мостика выпуска 1 (v170e) — после v192_ep1_voice.py (голос уже выровнен и без длинных пауз).
  — музыка (трек v9, 112,5 BPM): провалы на вставках закрыты тем же грувом на 4, 8 и 2 такта раньше; новое — тихий кусок трека
    на 94,2–95,5 с (там общий звук проседал на 10 дБ — «странная пауза» на 1:35) тоже закрыт; наплывы — равной мощности (без провала на стыке);
  — хвост без «техно-бита»: последние 2 с музыка уходит;
  — голос — как есть (выравнивание доозвучки — в v192_ep1_voice.py).
python3 v192_ep1_sound.py   → out/v170e-ru/mix192.wav (берёт voice.wav, music18.wav, cues.json, timeline.json)"""
import json, os, sys
import numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
import v18_mix as M
import v165_sound as V
O = os.path.join(HERE, 'out', 'v170e-ru'); BAR = 4 * 60 / 112.5
PATCH = [(86.2, 86.2 + 4 * BAR, 4 * BAR), (94.4, 96.0, 8 * BAR), (100.5, 100.5 + 2 * BAR, 2 * BAR)]   # (с, по, на сколько тактов раньше взять)


def patch(y, sr, a, b, shift, xf=.25):
    n0, n1, d, f = int(a * sr), int(b * sr), int(shift * sr), int(xf * sr)
    seg = y[n0 - d:n1 - d].copy(); w = np.ones(len(seg)); u = np.linspace(0, 1, f); w[:f] = np.sin(u * np.pi / 2); w[-f:] = np.cos(u * np.pi / 2)
    w = w[:, None] if y.ndim > 1 else w
    y[n0:n1] = y[n0:n1] * np.sqrt(np.clip(1 - w ** 2, 0, 1)) + seg * w   # равная мощность: стык без провала


def main():
    T = json.load(open(os.path.join(O, 'timeline.json'))); dur = T['dur']
    assert 'cut192' in T, 'сначала v192_ep1_voice.py (в таймлайне нет cut192)'
    m, sr = sf.read(os.path.join(O, 'music18.wav'), dtype='float64')
    for a, b, s in PATCH: patch(m, sr, a, b, s)
    f0 = int((dur - 2.0) * sr); m[f0:] *= np.linspace(1, 0, len(m) - f0)[:, None]
    mw = os.path.join(O, 'music192.wav'); sf.write(mw, m.astype(np.float32), sr)
    sw = os.path.join(O, 'sfx192.wav'); V.wav(M.sfx_track(json.load(open(os.path.join(O, 'cues.json'))), dur), sw)
    M.final(os.path.join(O, 'voice.wav'), sw, mw, os.path.join(O, 'mix192.wav'), dur)


if __name__ == '__main__':
    main()
