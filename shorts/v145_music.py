#!/usr/bin/env python3
"""v14.5: мрачный андерскор кодом (кредиты ElevenLabs не нужны) — out/<ep>/timeline.json → music/<ep без -ru>-pulse.wav
  • пульс-сердце 80 BPM: мягкая низкая бочка «тук-тук» (вторая тише через 0,24 с), без щелчков;
  • тёмный басовый пэд: Dm → B♭ → Gm → A по 4 такта, пилы из 6 гармоник с медленно «дышащим» тембром, саб на корне;
  • тиканье часов — только в паузах диктора (≥ 0,25 с), по восьмым той же сетки 80 BPM, «тик»/«так» по очереди.
Уровень под голосом ставит audio.py (BED8['v145m'] = −18 LU). python3 v145_music.py v145m-ru"""
import json, os, sys
import numpy as np, soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__)); SR = 44100; BPM = 80; BEAT = 60 / BPM
CH = [(36.71, [73.42, 110.0, 174.61]), (29.14, [58.27, 87.31, 146.83]), (49.0, [98.0, 116.54, 146.83]), (55.0, [110.0, 138.59, 164.81])]  # Dm, B♭, Gm, A


def thump(n, f0, f1, tau, amp):
    t = np.arange(n) / SR; ph = 2 * np.pi * np.cumsum(f1 + (f0 - f1) * np.exp(-t / .035)) / SR
    return amp * np.sin(ph) * np.exp(-t / tau) * np.minimum(1, t / .004)


def main(ep):
    T = json.load(open(os.path.join(HERE, 'out', ep, 'timeline.json'))); dur = T['dur'] + 1.0; N = int(dur * SR); t = np.arange(N) / SR
    x = np.zeros(N)
    # сердце
    lub, dub = thump(int(.5 * SR), 95, 48, .17, 1.0), thump(int(.45 * SR), 90, 46, .13, .62)
    for k in range(int(dur / BEAT) + 1):
        for s, h in ((k * BEAT, lub), (k * BEAT + .24, dub)):
            i = int(s * SR); j = min(N, i + len(h))
            if i < N: x[i:j] += h[:j - i]
    x = np.tanh(1.4 * x) / np.tanh(1.4)
    # пэд
    bar = 4 * BEAT; pad = np.zeros(N); sub = np.zeros(N)
    breath = .55 + .45 * np.sin(2 * np.pi * t / 9.0 - 1.2)          # медленное «дыхание» тембра
    for ci in range(int(dur / (4 * bar)) + 1):
        root, notes = CH[ci % 4]; a0 = ci * 4 * bar; a1 = a0 + 4 * bar
        i0, i1 = int(max(0, a0 - .6) * SR), min(N, int((a1 + .6) * SR))
        if i0 >= N: break
        tt = t[i0:i1]; env = np.clip((tt - (a0 - .6)) / 1.2, 0, 1) * np.clip(((a1 + .6) - tt) / 1.2, 0, 1)
        for f in notes:
            for d in (-.0025, .0025):
                for h in range(1, 7):
                    pad[i0:i1] += env * np.sin(2 * np.pi * f * (1 + d) * h * tt + h * 1.7) / h * (breath[i0:i1] ** (h - 1) if h > 1 else 1)
        sub[i0:i1] += env * np.sin(2 * np.pi * root * tt)
    pad = pad / (np.max(np.abs(pad)) or 1) * .32; sub = sub / (np.max(np.abs(sub)) or 1) * .3
    # тиканье в паузах
    tick = np.zeros(N); rng = np.random.default_rng(7)
    W = [w for s in T['sent'] for w in s['words']]
    gaps = [(0.0, W[0]['a'])] + [(a['b'], b['a']) for a, b in zip(W, W[1:])] + [(W[-1]['b'], T['dur'])]
    for g0, g1 in gaps:
        if g1 - g0 < .2: continue
        k = int(np.ceil(g0 / (BEAT / 2)))
        while k * BEAT / 2 < g1 - .05:
            s = k * BEAT / 2; n = int(.05 * SR); tt = np.arange(n) / SR; f = 3400 if k % 2 else 2500
            h = (np.sin(2 * np.pi * f * tt) * .6 + rng.standard_normal(n) * .4) * np.exp(-tt / .006) * .35
            i = int(s * SR); j = min(N, i + n); tick[i:j] += h[:j - i]; k += 1
    m = x * .9 + pad + sub + tick
    fade = np.clip((T['dur'] + .8 - t) / 1.0, 0, 1) * np.clip(t / .3, 0, 1); m *= fade
    m = m / (np.max(np.abs(m)) or 1) * .9
    st = np.stack([m, np.roll(m, int(.0007 * SR)) * .97 + pad * .05], 1).astype(np.float32)   # чуть шире в стерео
    f = os.path.join(HERE, 'music', ep.rsplit('-', 1)[0] + '-pulse.wav'); sf.write(f, st, SR)
    print('музыка →', f, round(dur, 1), 'с; пауз с тиканьем:', sum(1 for g0, g1 in gaps if g1 - g0 >= .2))


if __name__ == '__main__':
    main(sys.argv[1])
