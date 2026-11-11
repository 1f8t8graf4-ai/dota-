#!/usr/bin/env python3
"""v16.1 (11.11): музыка — тот же трек v9 (music/nics-raw.mp3, Eleven Music, уже оплачен), переставлен по тактам под новый тайминг.
Основной ролик (v161-ru): вступление трека + тихие хэты → грув с сильной доли за долю до «А знаете ли вы» → середина →
подъём (такты 17–19) кончается на «выкупил» (удар) → 2 такта грува → провал на «Признайтесь»: хвост провала трека + низкое
сердце 70 BPM до конца, глухой удар, когда кадр уходит в чёрное у красного диода; затухание.
Концовка (v161e1-ru, v161e2-ru): удар трека — на появлении доски, грув; на «Так… о чём это я?» грув обрывается,
под неловкой паузой — тихий провал трека (не тишина); на первом кадре — начало ролика (вступление трека), чтобы было видно, что ролик пошёл заново.
python3 v161_music.py [ep=v161-ru] → music/<ep без -ru>-pulse.wav (уровень под голосом ставит audio.py, BED8)"""
import json, math, os, subprocess, sys
import numpy as np, soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__)); SR = 48000
BAR = 4 * 60 / 112; D, HIT = 17.15, 68.57            # nics-raw: вход баса и удар после провала (замер mus_cut.py)


def load(f):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True)
    return np.frombuffer(r.stdout, np.float32).reshape(-1, 2).astype(np.float64)


def word(T, q, n=0):
    k = 0
    for s in T['sent']:
        for w in s['words']:
            if w['d'].lower().strip('«».,?!…:').startswith(q):
                if k == n: return w['a']
                k += 1
    raise SystemExit('нет слова ' + q)


def thump(n, f0, f1, tau, amp):
    t = np.arange(n) / SR; ph = 2 * np.pi * np.cumsum(f1 + (f0 - f1) * np.exp(-t / .035)) / SR
    return amp * np.sin(ph) * np.exp(-t / tau) * np.minimum(1, t / .004)


def render(x, plan, N):
    y = np.zeros((N, 2))
    for a, e, at, g, fd in plan:
        seg = x[int(a * SR):int(e * SR)].copy() * g; n = int(fd * SR)
        if n: seg[:n] *= np.sqrt(np.linspace(0, 1, n))[:, None]
        m = int(.012 * SR); seg[-m:] *= np.sqrt(np.linspace(1, 0, m))[:, None]
        i = int(at * SR)
        if 0 <= i < N: y[i:i + len(seg)] += seg[:N - i]
    return y


def hats(y, g0, rng):   # вступление: тихие хэты по сетке грува (восьмые), чтобы ритм был с первой секунды
    beat = BAR / 4; n = int(.045 * SR)
    hat = np.convolve(rng.standard_normal(n), [1, -1], 'same') * np.exp(-np.arange(n) / (SR * .009)); k = 0
    while g0 - k * beat / 2 > .05:
        tt = g0 - k * beat / 2; i = int(tt * SR); v = .05 if k % 2 == 0 else .03
        y[i:i + n, 0] += hat * v * .9; y[i:i + n, 1] += hat * v * 1.1; k += 1


def plan_main(T):
    slam = word(T, 'выкупил') - .02                          # сильная доля грува — ровно на «выкупил»
    nb = round((slam - 6.6) / BAR)                            # тактов до удара: грув стартует за долю до «А знаете ли вы» (6,85 с)
    g0 = slam - nb * BAR
    bars = list(range(0, 17)) + list(range(17 - (nb - 20), 17)) + [17, 18, 19]
    assert len(bars) == nb, (len(bars), nb)
    m = math.floor((word(T, 'признайтесь') - .1 - slam) / BAR); brk = slam + m * BAR
    plan = [(D - g0, D, 0.0, 1.55, .25)]
    plan += [(D + b * BAR - .01, D + (b + 1) * BAR + .02, g0 + j * BAR - .01, 1.0, .01) for j, b in enumerate(bars)]
    plan += [(D + b * BAR - .01, D + (b + 1) * BAR + .02, slam + b * BAR - .01, 1.0, .01) for b in range(m)]
    L = T['dur'] + .6 - brk                                   # провал трека — его хвост ровно до конца ролика
    plan.append((max(D + 21 * BAR, HIT - L), HIT - .05, brk, 1.0, .05))
    return g0, slam, brk, plan


def main(ep):
    T = json.load(open(os.path.join(HERE, 'out', ep, 'timeline.json'))); dur = T['dur']; N = int((dur + 1) * SR)
    x = load(os.path.join(HERE, 'music', 'nics-raw.mp3')); rng = np.random.default_rng(16)
    lub, dub = thump(int(.5 * SR), 90, 46, .16, .22), thump(int(.45 * SR), 85, 44, .12, .14)
    if 'e1' in ep or 'e2' in ep:
        W = [w for s in T['sent'] for w in s['words']]; e = W[-1]['b']
        s0 = W[0]['a'] - .4; q1 = e + .45; q2 = q1 + 1.45; whip = q2 + .75     # как keysEnd в ep/v161.js
        plan = [(HIT - .02, HIT + BAR, s0 - .02, 1.0, .02)]
        t, b = s0 - .02 + BAR, 4
        while t < q1 + .3:
            plan.append((D + b * BAR - .01, D + (b + 1) * BAR + .02, t - .01, .9, .01)); t += BAR; b += 1
        y = render(x, plan, N)
        i, f = int(q1 * SR), int(.18 * SR); y[i:i + f] *= np.linspace(1, 0, f)[:, None]; y[i + f:] = 0   # «о чём это я?» — музыка обрывается
        y += render(x, [(D + 21 * BAR, D + 21 * BAR + (whip + .42 - q1) + .3, q1 + .12, .4, .35)], N)   # неловкая пауза — не тишина: тихий провал трека
        Tm = json.load(open(os.path.join(HERE, 'out', 'v161-ru', 'timeline.json'))); g0 = plan_main(Tm)[0]
        st = whip + .42; y += render(x, [(D - g0, D - g0 + (dur - st) + .3, st, 1.55, .12)], N)   # первый кадр — начало ролика
        info = f'доска {s0:.2f}, обрыв {q1:.2f}, вжух {whip:.2f}, начало ролика {st:.2f}'
    else:
        g0, slam, brk, plan = plan_main(T)
        y = render(x, plan, N); hats(y, g0, rng)
        tt = brk + .1
        while tt < dur - .4:
            for s, h in ((tt, lub), (tt + .26, dub)):
                i = int(s * SR); y[i:i + len(h)] += h[:, None][:N - i]
            tt += 60 / 70
        drag = word(T, 'затянуться'); dragE = T['sent'][-1]['words'][-1]['b']; blk = dragE + 1.25   # кадр в чёрное (ep/v161.js: iris)
        h = thump(int(.9 * SR), 70, 34, .3, .5); i = int(blk * SR); y[i:i + len(h)] += h[:, None][:N - i]
        info = f'грув с {g0:.2f} с, удар на «выкупил» {slam:.2f}, провал {brk:.2f}, «затянуться» {drag:.2f}, чёрное {blk:.2f}'
    f = int(1.2 * SR); y[int(dur * SR) - f:int(dur * SR)] *= np.linspace(1, 0, f)[:, None]; y[int(dur * SR):] = 0
    y = y / (np.max(np.abs(y)) or 1) * .9
    out = os.path.join(HERE, 'music', ep.rsplit('-', 1)[0] + '-pulse.wav'); sf.write(out, y.astype(np.float32), SR)
    print(ep, info, f'длина {len(y) / SR:.1f} с →', os.path.relpath(out, HERE))


if __name__ == '__main__':
    for ep in (sys.argv[1:] or ['v161-ru']): main(ep)
