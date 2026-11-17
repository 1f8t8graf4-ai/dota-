#!/usr/bin/env python3
"""v19.1 (17.11): звук мостика выпуска 1 (v170e) по отзыву Андрея: «на вставках музыка должна приглушаться, а не уходить полностью».
  — музыка (трек v9, 112,5 BPM) в старом таймлайне проваливалась на вставках «Бумажная сигарета…» и «Но «Джул»…» — провалы заполнены
    тем же грувом на 4 и 2 такта раньше (ровно по долям, наплыв 0,25 с), под голосом она просто проседает сайдчейном;
  — хвост без «техно-бита»: последние 2 с музыка уходит;
  — вставка «Бумажная сигарета…» (доозвучка) была на 2–3 дБ ярче и громче основной записи — выровнена по полосам.
python3 v191_ep1_sound.py   → out/v170e-ru/mix191.wav (берёт voice.wav, music18.wav, cues.json)"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, '..', 'tools'))
import v18_mix as M
import v165_sound as V
O = os.path.join(HERE, 'out', 'v170e-ru'); BAR = 4 * 60 / 112.5


def patch(y, sr, a, b, shift, xf=.25):
    n0, n1, d, f = int(a * sr), int(b * sr), int(shift * sr), int(xf * sr)
    seg = y[n0 - d:n1 - d].copy(); w = np.ones(len(seg)); w[:f] = np.linspace(0, 1, f); w[-f:] = np.linspace(1, 0, f)
    w = w[:, None] if y.ndim > 1 else w
    y[n0:n1] = y[n0:n1] * (1 - w) + seg * w


def main():
    T = json.load(open(os.path.join(O, 'timeline.json'))); dur = T['dur']
    m, sr = sf.read(os.path.join(O, 'music18.wav'), dtype='float64')
    patch(m, sr, 86.2, 86.2 + 4 * BAR, 4 * BAR); patch(m, sr, 100.5, 100.5 + 2 * BAR, 2 * BAR)
    f0 = int((dur - 2.0) * sr); m[f0:] *= np.linspace(1, 0, len(m) - f0)[:, None]
    mw = os.path.join(O, 'music191.wav'); sf.write(mw, m.astype(np.float32), sr)
    v, vsr = sf.read(os.path.join(O, 'voice.wav'), dtype='float32')
    p1 = next(s for s in T['sent'] if s.get('scene') == 's8'); a, b = p1['a'] - .12, p1['b'] + .25
    seg = os.path.join(O, '_p1.wav'), os.path.join(O, '_p1f.wav'); sf.write(seg[0], v[int(a * vsr):int(b * vsr)], vsr)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', seg[0], '-af', 'volume=-2.3dB,bass=g=2.2:f=140,highshelf=g=-1.2:f=5000', seg[1]], check=True)
    q, _ = sf.read(seg[1], dtype='float32'); q = q[:int(b * vsr) - int(a * vsr)]; n = int(.04 * vsr); w = np.ones(len(q)); w[:n] = np.linspace(0, 1, n); w[-n:] = np.linspace(1, 0, n)
    v[int(a * vsr):int(a * vsr) + len(q)] = v[int(a * vsr):int(a * vsr) + len(q)] * (1 - w) + q * w
    vw = os.path.join(O, 'voice191.wav'); sf.write(vw, v, vsr); [os.remove(s) for s in seg]
    sw = os.path.join(O, 'sfx191.wav'); V.wav(M.sfx_track(json.load(open(os.path.join(O, 'cues.json'))), dur), sw)
    M.final(vw, sw, mw, os.path.join(O, 'mix191.wav'), dur)


if __name__ == '__main__':
    main()
