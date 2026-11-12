#!/usr/bin/env python3
"""v16.3 (12.11): музыка двух версий — тот же трек v9 (music/nics-raw.mp3, Eleven Music, уже оплачен), функции v161_music.py.
  v163-ru  (шортс): как ролик v16.2 — грув, удар на «выкупил», провал на «Признайтесь», сердце под финалом; провал трека кончается
           ударом ровно на появлении доски (пар рассеивается); под строками доски — грув; на «Так… о чём это я?» грув обрывается,
           под неловкой паузой — тихий провал; на вжухе — конец (петля начинается заново с вступления трека).
  v163f-ru (глава фильма): грув до конца «Старый план сработал идеально», на отъезде на доску — удар трека, грув, затухание.
python3 v163_music.py v163-ru v163f-ru  → music/<ep без -ru>-pulse.wav"""
import json, math, os, sys
import numpy as np, soundfile as sf
import v161_music as vm

HERE = os.path.dirname(os.path.abspath(__file__)); SR = vm.SR; BAR, D, HIT = vm.BAR, vm.D, vm.HIT
END = dict(b0=.62, l1=1.5, l2=4.1, l3=6.0, stamp=7.55, q1=8.6, q2=10.05, whip=10.8, end=11.2)   # как в ep/v163.js
FILM_FB0 = .75                                                                                     # отъезд на доску — от «идеально»


def grooves(plan, t0, t1, b0=4, g=.9):
    """грув трека по тактам с t0 до t1 (такты с b0)"""
    t, b = t0, b0
    while t < t1:
        e = min(BAR, t1 - t)
        plan.append((D + b * BAR - .01, D + b * BAR + e + .02, t - .01, g, .01)); t += BAR; b += 1


def shorts(T):
    dur = T['dur']; N = int((dur + 1) * SR); x = vm.load(os.path.join(HERE, 'music', 'nics-raw.mp3')); rng = np.random.default_rng(16)
    dragE = T['sent'][-1]['words'][-1]['b']; K = {k: dragE + v for k, v in END.items()}
    g0, slam, brk, plan = vm.plan_main(dict(T, dur=K['b0'] - .6))     # провал трека кончается его ударом ровно на K['b0']
    y = vm.render(x, plan, N); vm.hats(y, g0, rng)
    lub, dub = vm.thump(int(.5 * SR), 90, 46, .16, .22), vm.thump(int(.45 * SR), 85, 44, .12, .14)
    tt = brk + .1
    while tt < K['b0'] - .7:
        for s0, h in ((tt, lub), (tt + .26, dub)):
            i = int(s0 * SR); y[i:i + len(h)] += h[:, None][:N - i]
        tt += 60 / 70
    i = int(K['b0'] * SR); y[i:] = 0                                    # дальше — доска
    p2 = [(HIT - .02, HIT + BAR, K['b0'] - .02, 1.0, .02)]; grooves(p2, K['b0'] - .02 + BAR, K['q1'] + .2)
    z = vm.render(x, p2, N); f = int(.18 * SR); i = int(K['q1'] * SR); z[i:i + f] *= np.linspace(1, 0, f)[:, None]; z[i + f:] = 0
    y += z
    y += vm.render(x, [(D + 21 * BAR, D + 21 * BAR + (K['end'] - K['q1']) + .2, K['q1'] + .1, .4, .3)], N)   # неловкая пауза — тихий провал
    f = int(.1 * SR); e = int(dur * SR); y[e - f:e] *= np.linspace(1, 0, f)[:, None]; y[e:] = 0
    return y, f'грув с {g0:.2f}, удар «выкупил» {slam:.2f}, провал {brk:.2f}, удар на доске {K["b0"]:.2f}, обрыв {K["q1"]:.2f}, конец {dur:.2f}'


def film(T):
    dur = T['dur']; N = int((dur + 1) * SR); x = vm.load(os.path.join(HERE, 'music', 'nics-raw.mp3')); rng = np.random.default_rng(16)
    slam = vm.word(T, 'выкупил') - .02; nb = round((slam - 6.6) / BAR); g0 = slam - nb * BAR
    bars = list(range(0, 17)) + list(range(17 - (nb - 20), 17)) + [17, 18, 19]; assert len(bars) == nb, (len(bars), nb)
    fb0 = vm.word(T, 'идеально') + FILM_FB0
    plan = [(D - g0, D, 0.0, 1.55, .25)] + [(D + b * BAR - .01, D + (b + 1) * BAR + .02, g0 + j * BAR - .01, 1.0, .01) for j, b in enumerate(bars)]
    grooves(plan, slam, fb0, b0=0, g=1.0)                               # после «выкупил» — грув до отъезда на доску
    plan.append((HIT - .02, HIT + 2 * BAR, fb0 - .02, 1.0, .02))        # отъезд на доску — удар трека
    y = vm.render(x, plan, N); vm.hats(y, g0, rng)
    f = int(1.4 * SR); e = int(dur * SR); y[e - f:e] *= np.linspace(1, 0, f)[:, None]; y[e:] = 0
    return y, f'грув с {g0:.2f}, удар «выкупил» {slam:.2f}, удар на доске {fb0:.2f}, затухание до {dur:.2f}'


def main(ep):
    T = json.load(open(os.path.join(HERE, 'out', ep, 'timeline.json')))
    y, info = (film if ep.startswith('v163f') else shorts)(T)
    y = y / (np.max(np.abs(y)) or 1) * .9
    out = os.path.join(HERE, 'music', ep.rsplit('-', 1)[0] + '-pulse.wav'); sf.write(out, y.astype(np.float32), SR)
    print(ep, info, f'длина {len(y) / SR:.1f} с →', os.path.relpath(out, HERE))


if __name__ == '__main__':
    for ep in sys.argv[1:]: main(ep)
