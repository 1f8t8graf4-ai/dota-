#!/usr/bin/env python3
"""v16 (11.11): ритмичная музыка под голос без новых генераций — трек v9 (music/nics-raw.mp3, Eleven Music, тёмный синтвейв 112 BPM,
уже оплачен) переставлен по тактам под тайминг v16 + немного кода (хэты во вступлении, сердце в провале).
  0 → «А знаете ли вы»: вступление трека (пульсация) + тихие хэты по сетке грува;
  грув с сильной доли за долю до «А знаете ли вы»; середина повторяется; подъём (такты 17–19) кончается ровно на «выкупил» —
  там грув заново с сильной доли (удар); провал на «…им дань. Признайтесь» — тише, но не тишина: низкое сердце;
  удар трека на доске YouTube, дальше грув до конца, затухание 1,2 с.
python3 v16_music.py [ep=v16f-ru] → music/v16f-pulse.wav (уровень под голосом ставит audio.py, BED8)"""
import json, os, subprocess, sys
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


def main(ep):
    T = json.load(open(os.path.join(HERE, 'out', ep, 'timeline.json'))); dur = T['dur']
    x = load(os.path.join(HERE, 'music', 'nics-raw.mp3'))
    slam = word(T, 'выкупил') - .02                        # сильная доля грува — ровно на «выкупил»
    g0 = slam - 35 * BAR                                    # начало грува (за долю до «А знаете ли вы»)
    brk = slam + 3 * BAR                                    # провал: «…им дань. Признайтесь…»
    hit = next(s['a'] for s in T['sent'] if s['scene'] == 's9') - .02   # удар — на доске YouTube
    bars = list(range(0, 17)) + list(range(2, 17)) + [17, 18, 19] + [0, 1, 2]   # 38 тактов грува
    plan = [(D - g0, D, 0.0, 1.55, .25)]                    # вступление
    for j, b in enumerate(bars):
        plan.append((D + b * BAR - .01, D + (b + 1) * BAR + .02, g0 + j * BAR - .01, 1.0, .01))
    sk = (HIT - D - 21 * BAR) - (hit - brk)                 # провал трека короче нашего? берём его хвост
    plan.append((D + 21 * BAR + max(0, sk), HIT, brk, 1.0, .05))
    plan.append((HIT - .02, HIT + BAR, hit - .02, 1.0, .02))   # удар
    t = hit - .02 + BAR; b = 4
    while t < dur + .6:
        plan.append((D + b * BAR - .01, D + (b + 1) * BAR + .02, t - .01, .9, .01)); t += BAR; b += 1
    N = int((dur + 1) * SR); y = np.zeros((N, 2))
    for a, e, at, g, fd in plan:
        seg = x[int(a * SR):int(e * SR)].copy() * g; n = int(fd * SR)
        if n: seg[:n] *= np.sqrt(np.linspace(0, 1, n))[:, None]
        m = int(.012 * SR); seg[-m:] *= np.sqrt(np.linspace(1, 0, m))[:, None]
        i = int(at * SR)
        if i < N: y[i:i + len(seg)] += seg[:N - i]
    rng = np.random.default_rng(16)
    # вступление: тихие хэты по сетке грува (восьмые), чтобы ритм был с первой секунды
    beat = BAR / 4
    hat = np.convolve(rng.standard_normal(int(.045 * SR)), [1, -1], 'same') * np.exp(-np.arange(int(.045 * SR)) / (SR * .009))
    k = 0
    while g0 - k * beat / 2 > .05:
        tt = g0 - k * beat / 2; i = int(tt * SR); v = .05 if k % 2 == 0 else .03
        y[i:i + len(hat), 0] += hat * v * .9; y[i:i + len(hat), 1] += hat * v * 1.1; k += 1
    # провал: низкое сердце 70 BPM — не тишина
    lub, dub = thump(int(.5 * SR), 90, 46, .16, .22), thump(int(.45 * SR), 85, 44, .12, .14)
    tt = brk + .1
    while tt < hit - .3:
        for s, h in ((tt, lub), (tt + .26, dub)):
            i = int(s * SR); y[i:i + len(h)] += h[:, None][:N - i]
        tt += 60 / 70
    f = int(1.2 * SR); y[int(dur * SR) - f:int(dur * SR)] *= np.linspace(1, 0, f)[:, None]; y[int(dur * SR):] = 0
    y = y / (np.max(np.abs(y)) or 1) * .9
    out = os.path.join(HERE, 'music', ep.rsplit('-', 1)[0] + '-pulse.wav'); sf.write(out, y.astype(np.float32), SR)
    print(ep, f'грув с {g0:.2f} с, удар на «выкупил» {slam:.2f}, провал {brk:.2f}, доска {hit:.2f}, длина {len(y) / SR:.1f} с → {os.path.relpath(out, HERE)}')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'v16f-ru')
