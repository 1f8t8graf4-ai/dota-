#!/usr/bin/env python3
"""v16.4 (12–13.11, ночь): музыка шортса под новый голос — тот же трек v9 (music/nics-raw.mp3, Eleven Music, уже оплачен), по тактам.
Андрей: «убери все артефакты в звуке». Что было не так в v16.1–v16.3 (v161_music.render):
  - такты клеились с наложением (кусок начинался на 10 мс раньше и кончался на 20 мс позже, подъём 10 мс) — на стыках «двоение» и щелчки;
  - синтетические хэты в начале — шумовые всплески с острым краем (тиканье);
  - при длинном ролике трек начинался заново с первого такта посреди ролика (заметный «перезапуск»).
Теперь: стык — линейный кроссфейд 30 мс ровно на границе такта (соседние такты трека совпадают — шва нет), хэтов нет,
повтор — с 4-го такта (бас уже играет). Опорные точки — из timeline.json (dragE, b0, endT), как в ep/v164.js и audio.py.
  шортс: грув → подъём → удар трека на «выкупил» → провал на «Признайтесь», сердце → удар трека на появлении доски → грув
  под голосом доски → на «Так… о чём это я?» грув стихает за 0,25 с, под неловкой паузой — тихий провал трека → конец (петля).
python3 v164_music.py v164a-ru [v164b-ru]   → music/<ep без -ru>-pulse.wav"""
import json, math, os, sys
import numpy as np, soundfile as sf
import v161_music as vm

HERE = os.path.dirname(os.path.abspath(__file__)); SR = vm.SR; BAR, D, HIT = vm.BAR, vm.D, vm.HIT
XF = .03   # кроссфейд на стыке, с


def render(x, plan, N):
    """plan: (начало в треке, конец в треке, куда, громкость, подъём). Каждый кусок — с хвостами по XF/2 за границами, края — линейные
    (сумма соседних = 1: одинаковый материал на стыке складывается без провала и без всплеска)."""
    y = np.zeros((N, 2)); h = int(XF / 2 * SR)
    for a, e, at, g, fd in plan:
        i0 = int(a * SR) - h; seg = x[max(0, i0):int(e * SR) + h].copy() * g
        n = 2 * h; seg[:n] *= np.linspace(0, 1, n)[:, None]; seg[-n:] *= np.linspace(1, 0, n)[:, None]
        if fd > XF: m = int(fd * SR); seg[:m] *= np.linspace(0, 1, m)[:, None] ** .5
        j = int(at * SR) - h
        if j < 0: seg = seg[-j:]; j = 0
        if j < N: y[j:j + len(seg)] += seg[:N - j]
    return y


def grooves(plan, t0, t1, b0=4, g=.9):
    t, b = t0, b0
    while t < t1 - .05:
        e = min(BAR, t1 - t); plan.append((D + b * BAR, D + b * BAR + e, t, g, 0)); t += BAR; b = b + 1 if b < 16 else 4


def shorts(T):
    dur = T['dur']; N = int((dur + 1) * SR); x = vm.load(os.path.join(HERE, 'music', 'nics-raw.mp3'))
    slam = vm.word(T, 'выкупил') - .02; nb = round((slam - 6.6) / BAR); g0 = slam - nb * BAR
    bars = list(range(0, 17)); k = 4
    while len(bars) < nb - 3: bars.append(k); k = k + 1 if k < 16 else 4
    bars += [17, 18, 19]; assert len(bars) == nb, (len(bars), nb)
    b0, endT = T['b0'], T['endT']; q1 = next(s for s in T['sent'] if s['scene'] == 'tail')['words'][0]['a']
    m = math.floor((vm.word(T, 'признайтесь') - .1 - slam) / BAR); brk = slam + m * BAR
    plan = [(D - g0, D, 0.0, 1.55, .25)] + [(D + b * BAR, D + (b + 1) * BAR, g0 + j * BAR, 1.0, 0) for j, b in enumerate(bars)]
    plan += [(D + b * BAR, D + (b + 1) * BAR, slam + b * BAR, 1.0, 0) for b in range(m)]
    L = b0 - .6 - brk; plan.append((max(D + 21 * BAR, HIT - L), HIT - .05, brk, 1.0, .05))   # провал трека кончается его ударом на доске
    y = render(x, plan, N); i = int(b0 * SR); y[i:] = 0
    lub, dub = vm.thump(int(.5 * SR), 90, 46, .16, .22), vm.thump(int(.45 * SR), 85, 44, .12, .14)
    tt = brk + .1
    while tt < b0 - .7:
        for s0, hh in ((tt, lub), (tt + .26, dub)):
            j = int(s0 * SR); y[j:j + len(hh)] += hh[:, None][:N - j]
        tt += 60 / 70
    p2 = [(HIT - .02, HIT + BAR, b0 - .02, 1.0, 0)]; grooves(p2, b0 - .02 + BAR, q1 + .3)
    z = render(x, p2, N); f = int(.25 * SR); j = int(q1 * SR); z[j:j + f] *= np.linspace(1, 0, f)[:, None]; z[j + f:] = 0
    y += z
    y += render(x, [(D + 21 * BAR, D + 21 * BAR + (dur - q1) + .3, q1 + .1, .4, .35)], N)   # неловкая пауза — тихий провал, не тишина
    f = int(.12 * SR); e = int(dur * SR); y[e - f:e] *= np.linspace(1, 0, f)[:, None]; y[e:] = 0
    return y, f'грув с {g0:.2f}, удар «выкупил» {slam:.2f}, провал {brk:.2f}, удар на доске {b0:.2f}, стихает {q1:.2f}, конец {dur:.2f}'


def main(ep):
    T = json.load(open(os.path.join(HERE, 'out', ep, 'timeline.json')))
    y, info = shorts(T)
    y = y / (np.max(np.abs(y)) or 1) * .9
    out = os.path.join(HERE, 'music', ep.rsplit('-', 1)[0] + '-pulse.wav'); sf.write(out, y.astype(np.float32), SR)
    print(ep, info, f'длина {len(y) / SR:.1f} с →', os.path.relpath(out, HERE))


if __name__ == '__main__':
    for ep in sys.argv[1:]: main(ep)
