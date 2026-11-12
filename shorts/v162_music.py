#!/usr/bin/env python3
"""v16.2 (11.11): музыка концовок — тот же трек v9 (music/nics-raw.mp3, уже оплачен), функции v161_music.py.
  v162a-ru — концовка A: удар трека на появлении доски (карточка уже в кадре), грув до конца, затухание
  v162t-ru — склейка «ролик + хвост B»: музыка ролика (music/v162-pulse.wav, v161_music.py v162-ru) + под хвостом тихий провал трека —
             неловкая пауза не в тишине; на петле музыка ролика начинается с начала
python3 v162_music.py v162a-ru | v162t-ru  → music/<ep без -ru>-pulse.wav"""
import json, os, sys
import numpy as np, soundfile as sf
import v161_music as vm

HERE = os.path.dirname(os.path.abspath(__file__)); SR = vm.SR


def main(ep):
    T = json.load(open(os.path.join(HERE, 'out', ep, 'timeline.json'))); dur = T['dur']; N = int((dur + 1) * SR)
    x = vm.load(os.path.join(HERE, 'music', 'nics-raw.mp3'))
    if ep.startswith('v162a'):
        W = [w for s in T['sent'] for w in s['words']]; s0 = W[0]['a'] - .4
        plan = [(vm.HIT - .02, vm.HIT + vm.BAR, s0 - .02, 1.0, .02)]
        tt, b = s0 - .02 + vm.BAR, 4
        while tt < dur + .3:
            plan.append((vm.D + b * vm.BAR - .01, vm.D + (b + 1) * vm.BAR + .02, tt - .01, .9, .01)); tt += vm.BAR; b += 1
        y = vm.render(x, plan, N); info = f'доска {s0:.2f}, грув до {dur:.2f}'
        f = int(1.2 * SR); y[int(dur * SR) - f:int(dur * SR)] *= np.linspace(1, 0, f)[:, None]; y[int(dur * SR):] = 0
        y = y / (np.max(np.abs(y)) or 1) * .9
    else:   # музыка ролика — тот же план, что v161_music.py v162-ru (тот же масштаб), дальше — хвост
        M = json.load(open(os.path.join(HERE, 'out', 'v162-ru', 'timeline.json'))); dm = M['dur']; T0 = T['tail0']
        g0, slam, brk, plan = vm.plan_main(M); rng = np.random.default_rng(16)
        lub, dub = vm.thump(int(.5 * SR), 90, 46, .16, .22), vm.thump(int(.45 * SR), 85, 44, .12, .14)
        y = vm.render(x, plan, N); vm.hats(y, g0, rng)
        tt = brk + .1
        while tt < dm - .4:
            for s0, h in ((tt, lub), (tt + .26, dub)):
                i = int(s0 * SR); y[i:i + len(h)] += h[:, None][:N - i]
            tt += 60 / 70
        dragE = M['sent'][-1]['words'][-1]['b']; h = vm.thump(int(.9 * SR), 70, 34, .3, .5); i = int((dragE + 1.25) * SR); y[i:i + len(h)] += h[:, None][:N - i]
        f = int(1.2 * SR); y[int(dm * SR) - f:int(dm * SR)] *= np.linspace(1, 0, f)[:, None]; y[int(dm * SR):] = 0
        y += vm.render(x, [(vm.D + 21 * vm.BAR, vm.D + 21 * vm.BAR + (dur - T0) + .3, T0 + .08, .4, .35)], N)   # неловкая пауза — тихий провал трека
        f = int(.12 * SR); y[int(dur * SR) - f:int(dur * SR)] *= np.linspace(1, 0, f)[:, None]; y[int(dur * SR):] = 0
        y = y / (np.max(np.abs(y)) or 1) * .9
        info = f'ролик до {T0:.2f} (как v162-ru), под хвостом тихий провал трека до {dur:.2f}'
    out = os.path.join(HERE, 'music', ep.rsplit('-', 1)[0] + '-pulse.wav'); sf.write(out, y.astype(np.float32), SR)
    print(ep, info, f'длина {len(y) / SR:.1f} с →', os.path.relpath(out, HERE))


if __name__ == '__main__':
    for ep in sys.argv[1:]: main(ep)
