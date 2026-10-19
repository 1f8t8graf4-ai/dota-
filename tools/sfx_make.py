#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""13.9.21 — звуки приложения, синтез с нуля (numpy + ffmpeg). Лицензия результата — CC0 (snd/ЛИЦЕНЗИЯ.md).

Наборы:
  kino — «Кино» (по умолчанию): затвор, кадровая рамка, бумага, челеста, войлок, проектор, билеты.
  ios  — «Как в iPhone» (на выбор): короткий «ток» клавиатуры, тик колёсика, чистый колокольчик, мягкий двойной «бзз».
         В духе iOS, но не копии звуков Apple — всё синтезировано здесь.

Как звучит «дорого»: модальный синтез (затухающие негармоничные призвуки — молоточек, челеста, дерево, металл),
шум с фильтрами по спектру (плёнка, бумага, воздух), свёрточная реверберация с синтезированным импульсом.
Без щелчков на краях, громкость выровнена по RMS внутри своего класса, пик ≤ −3 dBFS.

Выход:
  snd/<набор>/<событие>.mp3 — послушать;
  js/sfx-<набор>.js         — те же mp3 в base64 (window.SFXD.<набор>), приложение грузит лениво только выбранный набор.
Проверки (каждый файл декодируется обратно): длина (интерфейс ≤ 0.4 с, ответы ≤ 0.8 с, награды ≤ 1.2 с),
размер ≤ 30 КБ, пик ≤ −1 dBFS, нет щелчка в конце, громкость в коридоре класса.

Запуск: python3 tools/sfx_make.py [--wav ПАПКА] [--page ФАЙЛ.html]
        --wav — ещё и wav без сжатия, для сравнения; --page — страница «послушать» со всеми звуками (для Андрея, артефакт)
"""
import base64, json, math, os, subprocess, sys
import numpy as np

SR = 44100
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EVENTS = ['tap', 'sel', 'whoosh', 'tick', 'hint', 'match', 'good', 'learn', 'nope', 'bad', 'win', 'lose',
          'announce', 'firstblood', 'roshan', 'reel', 'unlock', 'reward', 'page', 'coin']
# класс → (предел длины, целевая громкость RMS активной части, dBFS)
CLS = {'ui': (0.40, -27.0), 'res': (0.80, -23.0), 'big': (1.20, -21.0)}
KIND = {'tap': 'ui', 'sel': 'ui', 'whoosh': 'ui', 'tick': 'ui', 'hint': 'ui', 'page': 'ui', 'reel': 'ui', 'nope': 'ui', 'match': 'ui',
        'good': 'res', 'bad': 'res', 'learn': 'res', 'coin': 'res', 'announce': 'res', 'firstblood': 'res', 'roshan': 'res',
        'win': 'big', 'lose': 'big', 'reward': 'big', 'unlock': 'big'}
PEAK = 10 ** (-3 / 20)

# ---------------------------------------------------------------- примитивы
RNG = np.random.default_rng(1309)


def T(d):
    return np.arange(int(round(d * SR))) / SR


def buf(d):
    return np.zeros(int(round(d * SR)))


def mix(b, x, t0=0.0, g=1.0):
    i = int(round(t0 * SR))
    n = min(len(x), len(b) - i)
    if n > 0:
        b[i:i + n] += g * x[:n]
    return b


def soft_att(t, a):
    return np.clip(t / a, 0, 1) ** 2 if a > 0 else np.ones_like(t)


def noise(d, seed=None):
    r = np.random.default_rng(seed) if seed is not None else RNG
    return r.standard_normal(int(round(d * SR)))


def spec(x, fn):
    """фильтр по спектру (без фазовых сдвигов): fn(частоты) → множитель"""
    n = len(x)
    N = 1 << int(math.ceil(math.log2(max(2, n * 2))))
    X = np.fft.rfft(x, N)
    f = np.maximum(np.fft.rfftfreq(N, 1 / SR), 1e-3)
    return np.fft.irfft(X * fn(f), N)[:n]


def lp(fc, o=2):
    return lambda f: 1 / np.sqrt(1 + (f / fc) ** (2 * o))


def hp(fc, o=2):
    return lambda f: 1 / np.sqrt(1 + (fc / f) ** (2 * o))


def bp(fc, octv=1.0):
    s = octv / 2.355
    return lambda f: np.exp(-0.5 * (np.log2(f / fc) / s) ** 2)


def band(fc_lo, fc_hi, o=2):
    return lambda f: lp(fc_hi, o)(f) * hp(fc_lo, o)(f)


def endfade(y, ms=8):
    """мягкий конец куска — чтобы кусок, оборванный внутри общего буфера, не щёлкал"""
    n = min(len(y), int(ms / 1000 * SR))
    if n > 1:
        y = y.copy()
        y[-n:] *= np.cos(np.linspace(0, np.pi / 2, n)) ** 2
    return y


def modal(f0, parts, d, att=0.0012, seed=None):
    """затухающие синусы: parts=[(отношение частоты, громкость, время затухания с)]"""
    r = np.random.default_rng(seed) if seed is not None else RNG
    t = T(d)
    y = np.zeros_like(t)
    for ratio, amp, tau in parts:
        f = f0 * ratio
        if f >= SR * 0.45:
            continue
        y += amp * np.sin(2 * np.pi * f * t + r.random() * 2 * np.pi) * np.exp(-t / tau)
    return endfade(y * soft_att(t, att))


def svf_bp(x, fc, q=0.8):
    """полосовой фильтр с меняющейся частотой (state variable, TPT) — для «вжухов»"""
    y = np.zeros_like(x)
    ic1 = ic2 = 0.0
    k = 1 / q
    for i in range(len(x)):
        g = math.tan(math.pi * min(fc[i], SR * 0.45) / SR)
        a1 = 1 / (1 + g * (g + k))
        a2 = g * a1
        a3 = g * a2
        v3 = x[i] - ic2
        v1 = a1 * ic1 + a2 * v3
        v2 = ic2 + a2 * ic1 + a3 * v3
        ic1 = 2 * v1 - ic1
        ic2 = 2 * v2 - ic2
        y[i] = v1
    return y


def conv(a, b):
    n = len(a) + len(b) - 1
    N = 1 << int(math.ceil(math.log2(n)))
    return np.fft.irfft(np.fft.rfft(a, N) * np.fft.rfft(b, N), N)[:n]


def ir(rt=0.7, d=1.2, damp=0.28, pre=0.006, seed=11):
    """синтезированный импульс зала: шум с затуханием RT60, верха гаснут быстрее, ранние отражения"""
    t = T(d)
    n = noise(d, seed)
    lo = spec(n, lp(2200, 1))
    hi = n - lo
    y = lo * np.exp(-t * 6.91 / rt) + 0.7 * hi * np.exp(-t * 6.91 / (rt * damp))
    y = endfade(y * soft_att(t, 0.01), 30)
    y = np.concatenate([np.zeros(int(pre * SR)), y])
    for ms, g in ((7, .5), (13, .35), (19, .3), (29, .22), (41, .15)):
        i = int(ms / 1000 * SR)
        if i < len(y):
            y[i] += g * (1 if ms % 2 else -1)
    return y / np.sqrt(np.sum(y ** 2))


def verb(x, wet=0.18, **kw):
    w = conv(x, ir(**kw))[:len(x)]
    return x + wet * w * (np.sqrt(np.mean(x ** 2)) / max(1e-9, np.sqrt(np.mean(w ** 2))))


def click(d=0.004, fc=3200, octv=1.6, seed=None):
    """короткий щелчок: шум в полосе, затухание за d"""
    t = T(d * 4)
    n = spec(noise(d * 4, seed), bp(fc, octv))
    return n * np.exp(-t / d) * soft_att(t, 0.0003)


def thock(f=200, d=0.03, seed=None):
    """тело щелчка: низкий деревянный «ток»"""
    return modal(f, [(1, 1, d * .55), (2.57, .45, d * .25), (4.1, .2, d * .12)], d * 3, att=0.0008, seed=seed)


def celesta(f, d=0.6, bright=1.0, seed=None):
    """челеста / колокольчик: основной тон держится, призвуки бруска гаснут быстро"""
    return modal(f, [(1, 1, d * .42), (2.0, .16 * bright, d * .18), (2.756, .28 * bright, d * .12),
                     (5.404, .1 * bright, d * .05), (8.933, .04 * bright, d * .025)], d, att=0.0015, seed=seed)


def felt(f, d=0.25, seed=None):
    """войлочный молоточек по дереву (маримба): мягкий «тук»"""
    y = modal(f, [(1, 1, d * .28), (3.93, .25, d * .07), (9.2, .06, d * .02)], d, att=0.003, seed=seed)
    t = T(d)
    y += 0.25 * endfade(spec(noise(d, seed), lp(900, 2)) * np.exp(-t / 0.012) * soft_att(t, 0.001))
    return y


def metal(f, d=0.4, seed=None):
    """металл билета / монетки: негармоничные призвуки"""
    return modal(f, [(1, 1, d * .38), (2.32, .62, d * .2), (4.25, .42, d * .12), (6.63, .22, d * .07), (8.9, .1, d * .04)],
                 d, att=0.0006, seed=seed)


def glass(f, d=0.7, seed=None):
    """стеклянный звон: чистый, с биением соседних призвуков"""
    return modal(f, [(1, 1, d * .45), (1.003, .5, d * .45), (2.32, .18, d * .15), (4.0, .08, d * .06)], d, att=0.002, seed=seed)


def swish(d, f0, f1, q=0.9, curve=1.0, seed=None):
    """воздух / бумага: шум через полосу, которая едет от f0 к f1"""
    t = T(d)
    p = (t / d) ** curve
    fc = f0 * (f1 / f0) ** p
    y = svf_bp(noise(d, seed), fc, q)
    return y * np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.6


def crinkle(d, rate=260, fc=3500, seed=None):
    """бумага: частые крошечные трески (пуассоновский поток) + шорох"""
    r = np.random.default_rng(seed) if seed is not None else RNG
    y = buf(d)
    t = 0.0
    while True:
        t += r.exponential(1 / rate)
        if t >= d:
            break
        g = r.random() ** 2 * math.sin(math.pi * t / d) ** 1.2
        mix(y, click(0.0006 + r.random() * 0.0012, fc * (0.7 + r.random() * 0.8), 1.4, seed=int(r.integers(1 << 30))), t, g)
    return y


def sine_sweep(f0, f1, d, tau, att=0.001):
    t = T(d)
    f = f0 * (f1 / f0) ** np.clip(t / (d * .6), 0, 1)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return endfade(np.sin(ph) * np.exp(-t / tau) * soft_att(t, att))


def bell(f, d=0.5, h2=0.12, att=0.002):
    """«айфонный» колокольчик: почти чистый синус с лёгкой второй гармоникой"""
    t = T(d)
    return endfade((np.sin(2 * np.pi * f * t) + h2 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t / (d * .12))) * np.exp(-t / (d * .3)) * soft_att(t, att))


def buzz(f=150, d=0.045):
    """мягкий «бзз» как от вибромотора: синус с гармониками, огибающая-холмик"""
    t = T(d)
    y = np.sin(2 * np.pi * f * t) + .35 * np.sin(2 * np.pi * 2 * f * t) + .18 * np.sin(2 * np.pi * 3 * f * t)
    return spec(y * np.sin(np.pi * t / d) ** 2, lp(1400, 2))


NOTE = {n: 440 * 2 ** ((i - 9) / 12 + o - 4) for o in range(2, 9) for i, n in
        enumerate([f'{x}{o}' for x in ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']])}

# ---------------------------------------------------------------- набор «Кино»


def k_tap():
    b = buf(0.075)
    mix(b, click(0.0022, 3400, 1.8, seed=1), 0, 1.0)          # шторка затвора
    mix(b, thock(230, 0.024, seed=2), 0.0005, 0.55)           # мягкое тело
    mix(b, click(0.0014, 5200, 1.4, seed=3), 0.013, 0.32)     # возврат шторки
    return b


def k_sel():
    b = buf(0.12)
    mix(b, k_tap(), 0, 1.0)
    mix(b, click(0.0018, 4300, 1.6, seed=4), 0.048, 0.7)      # второй тик кадровой рамки — выше и тише
    mix(b, thock(300, 0.02, seed=5), 0.048, 0.35)
    return b


def k_whoosh():
    b = buf(0.24)
    mix(b, swish(0.22, 520, 2600, 0.7, 0.8, seed=6), 0.01, 1.0)
    mix(b, 0.25 * crinkle(0.2, 120, 4200, seed=7), 0.02)
    return b


def k_tick():
    b = buf(0.08)
    mix(b, modal(1180, [(1, 1, .02), (2.57, .4, .008), (4.1, .2, .004)], 0.08, att=0.0005, seed=8), 0, 0.9)
    mix(b, click(0.0012, 4800, 1.3, seed=9), 0, 0.6)
    return b


def k_hint():
    b = buf(0.3)
    mix(b, felt(NOTE['G5'], 0.28, seed=10), 0, 1.0)
    mix(b, celesta(NOTE['G6'], 0.25, 0.6, seed=11), 0.004, 0.18)
    return verb(b, 0.1, rt=0.35, d=0.4)


def k_match():
    b = buf(0.36)
    mix(b, celesta(NOTE['G6'], 0.34, 0.9, seed=12), 0, 1.0)
    mix(b, click(0.0012, 5000, 1.4, seed=13), 0, 0.25)
    return verb(b, 0.14, rt=0.45, d=0.5)


def k_good():
    b = buf(0.62)
    mix(b, k_tap(), 0, 0.45)
    mix(b, celesta(NOTE['E6'], 0.58, 1.0, seed=14), 0.012, 1.0)
    mix(b, celesta(NOTE['E7'], 0.3, 0.5, seed=15), 0.014, 0.12)
    return verb(b, 0.2, rt=0.55, d=0.7)


def k_learn():
    b = buf(0.78)
    mix(b, k_tap(), 0, 0.4)
    mix(b, celesta(NOTE['C6'], 0.6, 1.0, seed=16), 0.012, 0.9)
    mix(b, celesta(NOTE['G6'], 0.66, 1.0, seed=17), 0.095, 1.0)
    return verb(b, 0.22, rt=0.6, d=0.8)


def k_nope():
    b = buf(0.3)
    mix(b, felt(165, 0.26, seed=18), 0, 1.0)
    mix(b, spec(noise(0.03, 19), band(200, 1200, 2)) * np.exp(-T(0.03) / 0.006), 0, 0.25)
    return b


def k_bad():
    b = buf(0.42)
    mix(b, felt(160, 0.22, seed=20), 0, 1.0)
    mix(b, felt(124, 0.26, seed=21), 0.115, 0.95)
    return verb(b, 0.08, rt=0.3, d=0.4)


def k_win():
    b = buf(1.15)
    for i, n in enumerate(['C6', 'E6', 'G6', 'C7']):
        mix(b, celesta(NOTE[n], 0.95 - i * .08, 1.0, seed=30 + i), i * 0.07, 0.85 + i * .05)
    sh = endfade(spec(noise(0.9, 34), bp(7000, 1.2)) * np.exp(-T(0.9) / 0.28) * soft_att(T(0.9), 0.08), 40)
    mix(b, sh, 0.18, 0.035)
    mix(b, k_tap(), 0, 0.35)
    return verb(b, 0.3, rt=0.9, d=1.2)


def k_lose():
    b = buf(0.95)
    mix(b, felt(NOTE['G4'], 0.6, seed=35), 0, 1.0)
    mix(b, felt(NOTE['D4'], 0.75, seed=36), 0.15, 1.0)
    mix(b, celesta(NOTE['D5'], 0.5, 0.4, seed=37), 0.15, 0.08)
    return verb(b, 0.22, rt=0.7, d=1.0)


def k_announce():
    b = buf(0.75)
    mix(b, glass(NOTE['A6'], 0.72, seed=38), 0, 1.0)
    return verb(b, 0.24, rt=0.7, d=0.9)


def k_firstblood():
    b = buf(0.78)
    mix(b, glass(NOTE['C6'], 0.6, seed=39), 0, 0.9)
    mix(b, glass(NOTE['G6'], 0.66, seed=40), 0.085, 1.0)
    return verb(b, 0.22, rt=0.65, d=0.9)


def k_roshan():
    b = buf(0.62)
    mix(b, modal(72, [(1, 1, .22), (2.1, .45, .1), (3.3, .2, .05)], 0.6, att=0.005, seed=41), 0, 1.0)
    mix(b, spec(noise(0.08, 42), lp(500, 2)) * np.exp(-T(0.08) / 0.02), 0, 0.5)
    mix(b, felt(110, 0.3, seed=43), 0.003, 0.5)
    return verb(b, 0.12, rt=0.5, d=0.7)


def k_reel():
    d = 0.4
    b = buf(d)
    r = np.random.default_rng(44)
    t = 0.012
    i = 0
    while t < d - 0.04:   # грейфер проектора: 24 кадра в секунду
        g = math.sin(math.pi * t / d) ** 0.7
        mix(b, click(0.0016, 2600 + r.random() * 600, 1.5, seed=45 + i), t, g)
        mix(b, thock(140 + r.random() * 20, 0.016, seed=60 + i), t + 0.0004, 0.35 * g)
        t += 1 / 24 + (r.random() - .5) * 0.004
        i += 1
    hum = spec(noise(d, 70), bp(120, 0.8)) + 0.4 * np.sin(2 * np.pi * 48 * T(d))
    mix(b, hum * np.sin(np.pi * T(d) / d) ** 2, 0, 0.05)
    return b


def k_unlock():
    b = buf(1.05)
    mix(b, swish(0.16, 1500, 4800, 0.8, 1.0, seed=71), 0, 0.55)        # клапан конверта
    mix(b, 0.6 * crinkle(0.14, 220, 3800, seed=72), 0.0)
    mix(b, sine_sweep(620, 300, 0.05, 0.012), 0.13, 0.35)              # «поп»
    mix(b, celesta(NOTE['D6'], 0.7, 0.9, seed=73), 0.16, 0.9)
    mix(b, celesta(NOTE['A6'], 0.75, 0.9, seed=74), 0.24, 1.0)
    return verb(b, 0.26, rt=0.75, d=1.0)


def k_reward():
    b = buf(1.18)
    mix(b, swish(0.24, 700, 5200, 0.7, 0.9, seed=75), 0, 0.5)
    mix(b, 0.5 * crinkle(0.2, 200, 4000, seed=76), 0.01)
    for i, n in enumerate(['C6', 'E6', 'G6', 'C7']):                   # аккорд-вспышка, лёгкое арпеджио
        mix(b, celesta(NOTE[n], 0.95, 1.0, seed=77 + i), 0.17 + i * 0.016, 0.8)
    r = np.random.default_rng(81)
    for j in range(9):                                                 # искры
        mix(b, celesta(4200 + r.random() * 3000, 0.16, 0.3, seed=82 + j), 0.22 + r.random() * 0.5, 0.06 + r.random() * .05)
    return verb(b, 0.3, rt=0.95, d=1.3)


def k_page():
    b = buf(0.3)
    mix(b, crinkle(0.24, 300, 3600, seed=90), 0.0, 0.9)
    mix(b, swish(0.26, 2400, 900, 0.6, 1.0, seed=91), 0.01, 0.7)
    return b


def k_coin():
    b = buf(0.55)
    mix(b, metal(NOTE['C7'], 0.42, seed=92), 0, 1.0)
    mix(b, metal(NOTE['C7'] * 1.062, 0.4, seed=93), 0.07, 0.75)
    return verb(b, 0.12, rt=0.45, d=0.6)


# ---------------------------------------------------------------- набор «Как в iPhone»


def i_tap():
    b = buf(0.045)
    mix(b, click(0.0011, 1700, 1.6, seed=101), 0, 0.9)
    mix(b, modal(1250, [(1, 1, .006), (2.3, .3, .003)], 0.03, att=0.0003, seed=102), 0, 0.5)
    mix(b, modal(380, [(1, 1, .009)], 0.04, att=0.0006, seed=103), 0, 0.4)
    return b


def i_sel():
    b = buf(0.03)
    mix(b, click(0.0006, 5200, 1.2, seed=104), 0, 1.0)
    mix(b, modal(3600, [(1, 1, .003)], 0.02, att=0.0002, seed=105), 0, 0.4)
    return b


def i_whoosh():
    b = buf(0.22)
    mix(b, swish(0.2, 2600, 700, 0.9, 0.8, seed=106), 0.005, 1.0)
    return b


def i_tick():
    b = buf(0.03)
    mix(b, click(0.0007, 4200, 1.2, seed=107), 0, 1.0)
    mix(b, modal(2900, [(1, 1, .003)], 0.02, att=0.0002, seed=108), 0, 0.4)
    return b


def i_hint():
    b = buf(0.12)
    mix(b, sine_sweep(900, 520, 0.1, 0.022, 0.0008), 0, 1.0)
    mix(b, i_sel(), 0, 0.25)
    return b


def i_match():
    b = buf(0.3)
    mix(b, bell(NOTE['E7'], 0.3, 0.08), 0, 1.0)
    return verb(b, 0.06, rt=0.25, d=0.35)


def i_good():
    b = buf(0.6)
    mix(b, bell(NOTE['A5'], 0.45), 0, 0.85)
    mix(b, bell(NOTE['E6'], 0.5), 0.09, 1.0)
    return verb(b, 0.08, rt=0.3, d=0.45)


def i_learn():
    b = buf(0.75)
    for i, n in enumerate(['A5', 'E6', 'A6']):
        mix(b, bell(NOTE[n], 0.5), i * 0.085, 0.85 + i * .08)
    return verb(b, 0.08, rt=0.32, d=0.5)


def i_nope():
    b = buf(0.18)
    mix(b, buzz(150, 0.045), 0, 1.0)
    mix(b, buzz(150, 0.045), 0.075, 0.9)
    return b


def i_bad():
    b = buf(0.26)
    mix(b, buzz(128, 0.055), 0, 1.0)
    mix(b, buzz(118, 0.06), 0.09, 0.95)
    return b


def i_win():
    b = buf(0.95)
    for i, n in enumerate(['C6', 'E6', 'G6', 'C7']):
        mix(b, modal(NOTE[n], [(1, 1, .16), (4.0, .18, .03)], 0.6, att=0.0015, seed=110 + i), i * 0.075, 0.9)
    return verb(b, 0.12, rt=0.45, d=0.6)


def i_lose():
    b = buf(0.7)
    mix(b, bell(NOTE['E5'], 0.45, 0.06), 0, 1.0)
    mix(b, bell(NOTE['C5'], 0.55, 0.06), 0.13, 1.0)
    return verb(b, 0.08, rt=0.35, d=0.5)


def i_announce():
    b = buf(0.6)
    mix(b, bell(NOTE['D6'], 0.58, 0.1), 0, 1.0)
    return verb(b, 0.1, rt=0.4, d=0.5)


def i_firstblood():
    b = buf(0.65)
    mix(b, bell(NOTE['D6'], 0.45), 0, 0.9)
    mix(b, bell(NOTE['A6'], 0.5), 0.085, 1.0)
    return verb(b, 0.1, rt=0.4, d=0.5)


def i_roshan():
    b = buf(0.4)
    mix(b, sine_sweep(120, 70, 0.35, 0.09, 0.003), 0, 1.0)
    mix(b, i_tap(), 0, 0.3)
    return b


def i_reel():
    d = 0.38
    b = buf(d)
    ts = [0.0, 0.04, 0.075, 0.105, 0.135, 0.165, 0.2, 0.245, 0.3]   # колёсико разогналось и встало
    for j, t in enumerate(ts):
        mix(b, i_sel(), t, 0.55 + 0.45 * math.sin(math.pi * (j + .5) / len(ts)))
    return b


def i_unlock():
    b = buf(0.85)
    mix(b, i_tap(), 0, 0.9)
    mix(b, i_tap(), 0.05, 0.6)
    mix(b, sine_sweep(500, 980, 0.18, 0.08, 0.004), 0.08, 0.5)
    mix(b, bell(NOTE['E6'], 0.55), 0.14, 0.8)
    mix(b, bell(NOTE['B6'], 0.6), 0.21, 0.7)
    return verb(b, 0.1, rt=0.4, d=0.6)


def i_reward():
    b = buf(1.15)
    t = T(1.0)
    for n, g in (('C5', .55), ('E5', .5), ('G5', .45), ('C6', .4), ('E6', .3)):
        f = NOTE[n]
        mix(b, endfade((np.sin(2 * np.pi * f * t) + .08 * np.sin(4 * np.pi * f * t)) * soft_att(t, 0.06) * np.exp(-t / 0.32), 60), 0.0, g)
    r = np.random.default_rng(120)
    for j in range(7):
        mix(b, bell(3000 + r.random() * 2600, 0.18, 0.0), 0.12 + j * 0.07 + r.random() * .02, 0.12)
    return verb(b, 0.12, rt=0.5, d=0.7)


def i_page():
    b = buf(0.2)
    mix(b, swish(0.18, 3200, 1200, 0.8, 1.0, seed=121), 0.004, 1.0)
    return b


def i_coin():
    b = buf(0.45)
    mix(b, bell(NOTE['D7'], 0.32, 0.18), 0, 0.9)
    mix(b, bell(NOTE['G7'], 0.36, 0.12), 0.06, 1.0)
    mix(b, i_sel(), 0, 0.4)
    return verb(b, 0.08, rt=0.3, d=0.4)


SETS = {
    'kino': ('Кино', {e: globals()['k_' + e] for e in EVENTS}),
    'ios': ('Как в iPhone', {e: globals()['i_' + e] for e in EVENTS}),
}

# ---------------------------------------------------------------- сборка


def finish(x, kind):
    lim, target = CLS[kind]
    x = np.asarray(x, float)
    x = x - np.mean(x[: max(1, int(0.002 * SR))]) * 0          # без постоянной составляющей на старте
    # хвост: обрезать на пределе класса и где тише −70 дБ от пика
    pk = np.max(np.abs(x)) or 1
    env = np.abs(x) / pk
    last = len(x) - 1 - np.argmax(env[::-1] > 10 ** (-70 / 20))
    n = min(len(x), int(lim * SR) - int(0.01 * SR), last + int(0.02 * SR))
    x = x[:n].copy()
    fo = min(int(0.03 * SR), n // 3)                                  # мягко в ноль — без щелчка в конце
    x[-fo:] *= np.cos(np.linspace(0, np.pi / 2, fo)) ** 2
    fi = int(0.0008 * SR)
    x[:fi] *= np.sin(np.linspace(0, np.pi / 2, fi)) ** 2
    x[-1] = 0.0
    # громкость: RMS активной части (окна по 10 мс, громче −30 дБ от самого громкого окна)
    w = int(0.01 * SR)
    fr = np.array([np.sqrt(np.mean(x[i:i + w] ** 2)) for i in range(0, len(x) - w + 1, w)] or [np.sqrt(np.mean(x ** 2))])
    act = fr[fr > fr.max() * 10 ** (-30 / 20)]
    rms = np.sqrt(np.mean(act ** 2))
    x *= 10 ** (target / 20) / max(rms, 1e-9)
    pk = np.max(np.abs(x))
    if pk > PEAK:
        x *= PEAK / pk
    return x


def wav_bytes(x):
    import io
    import wave
    y = np.clip(np.round(x * 32767), -32768, 32767).astype('<i2').tobytes()
    b = io.BytesIO()
    with wave.open(b, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(y)
    return b.getvalue()


def to_mp3(x):
    p = subprocess.run(['ffmpeg', '-loglevel', 'error', '-f', 'wav', '-i', 'pipe:0', '-ac', '1', '-ar', str(SR),
                        '-codec:a', 'libmp3lame', '-b:a', '64k', '-f', 'mp3', 'pipe:1'], input=wav_bytes(x), capture_output=True, check=True)
    return p.stdout


def from_mp3(b):
    p = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', 'pipe:0', '-f', 'f32le', '-ac', '1', '-ar', str(SR), 'pipe:1'],
                       input=b, capture_output=True, check=True)
    return np.frombuffer(p.stdout, '<f4').astype(float)


def check(name, kind, mp3):
    """проверка того, что реально уедет в приложение: декодируем mp3 обратно"""
    lim, target = CLS[kind]
    y = from_mp3(mp3)
    pk = np.max(np.abs(y))
    on = np.nonzero(np.abs(y) > pk * 10 ** (-60 / 20))[0]
    dur = (on[-1] - on[0]) / SR if len(on) else 0
    e = on[-1] if len(on) else 0
    tail = np.sqrt(np.mean(y[max(0, e - int(0.001 * SR)):e + 1] ** 2)) / pk if len(on) else 0
    w = int(0.01 * SR)
    fr = np.array([np.sqrt(np.mean(y[i:i + w] ** 2)) for i in range(0, len(y) - w + 1, w)])
    act = fr[fr > fr.max() * 10 ** (-30 / 20)]
    rms = 20 * math.log10(max(1e-9, np.sqrt(np.mean(act ** 2))))
    err = []
    if dur > lim + 0.005:
        err.append(f'длина {dur:.3f} с > {lim}')
    if len(mp3) > 30 * 1024:
        err.append(f'размер {len(mp3)} Б > 30 КБ')
    if 20 * math.log10(pk) > -1:
        err.append(f'пик {20 * math.log10(pk):.1f} dBFS > −1')
    if tail > 0.03:
        err.append(f'щелчок в конце ({tail:.3f} от пика)')
    if abs(rms - target) > 3.5:
        err.append(f'громкость {rms:.1f} dBFS, а надо {target}±3.5')
    return {'dur': round(dur, 3), 'kb': round(len(mp3) / 1024, 1), 'peak': round(20 * math.log10(pk), 1), 'rms': round(rms, 1), 'err': err}


# ---------------------------------------------------------------- страница послушать (Андрею: python3 tools/sfx_make.py --page <файл.html>)
INFO = {  # событие → (название, где звучит, раздел)
    'tap': ('Нажатие', 'любая кнопка', 'ui'), 'sel': ('Выбор', 'выбрал вариант, переключатель', 'ui'),
    'whoosh': ('Переход', 'старт задания, смена экрана', 'ui'), 'tick': ('Тик', 'отсчёт, билеты летят в счётчик', 'ui'),
    'page': ('Листание', 'Кинотека, словарь, язык', 'ui'), 'reel': ('Эпизод досмотрен', 'итог просмотра — стрёкот проектора', 'ui'),
    'hint': ('Подсказка', 'открыл подсказку', 'ui'), 'match': ('Пара', 'пара сошлась в «Соедини пары»', 'ui'),
    'nope': ('Не то', 'лёгкая ошибка, лишний выбор', 'ui'),
    'good': ('Верно', 'верный ответ', 'res'), 'bad': ('Ошибка', 'неверный ответ', 'res'),
    'learn': ('Цель дня / ранг', 'выполнил цель дня, новый ранг', 'res'), 'coin': ('Билеты', 'начислены билеты', 'res'),
    'reward': ('Награда', 'кадр, карточка, фон', 'big'), 'unlock': ('Открыл', 'конверт с фактом, замок', 'big'),
    'win': ('Победа', 'итог, покупка, дуэль', 'big'), 'lose': ('Проигрыш', 'проиграл дуэль', 'big'),
    'announce': ('Объявление', 'крупная надпись в игре', 'game'), 'firstblood': ('First Blood', 'игра «Дота»', 'game'),
    'roshan': ('Рошан', 'игра «Дота»', 'game'),
}
SECT = [('ui', 'Интерфейс'), ('res', 'Ответы'), ('big', 'Награды'), ('game', 'Игры')]
PAGE = """<title>Звуки Языков по кино</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;1,600&display=swap">
<style>
:root{color-scheme:dark;--bg:#0b0b0d;--sf:#141417;--sf2:#1c1c20;--ln:rgba(243,235,221,.09);--tx:#F3EBDD;--mu:rgba(243,235,221,.58);--gd:#E9C46A;--gd2:#F3DA8C;--ios:#8FB8FF}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--tx);font:400 16px/1.5 'Golos Text',system-ui,-apple-system,'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased}
.wrap{max-width:860px;margin:0 auto;padding-inline:18px;padding-block:28px 64px}
.kick{margin:0;font:600 12px/1 'Golos Text',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--gd)}
h1{margin:10px 0 8px;font:600 clamp(30px,6vw,44px)/1.08 'Playfair Display',Georgia,serif;text-wrap:balance}
.lede{margin:0;max-width:62ch;color:var(--mu)}
.lede b{color:var(--tx);font-weight:600}
.bar{display:flex;flex-wrap:wrap;gap:8px;margin:20px 0 6px}
button{font:600 14px/1 'Golos Text',sans-serif;color:var(--tx);background:var(--sf2);border:1px solid var(--ln);border-radius:12px;padding:11px 14px;cursor:pointer;transition:background .15s,border-color .15s,transform .1s;-webkit-tap-highlight-color:transparent}
button:active{transform:scale(.97)}
@media (hover:hover){button:hover{border-color:rgba(243,235,221,.22)}}
button.k.on,button.k:focus-visible{background:rgba(233,196,106,.18);border-color:var(--gd)}
button.i.on,button.i:focus-visible{background:rgba(143,184,255,.16);border-color:var(--ios)}
button .dt{display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:8px;vertical-align:1px;background:var(--gd)}
button.i .dt{background:var(--ios)}
.st{margin:4px 0 0;min-height:22px;font-size:13px;color:var(--mu)}
h2{margin:34px 0 10px;font:600 22px/1.2 'Playfair Display',Georgia,serif}
.list{list-style:none;margin:0;padding:0;border-top:1px solid var(--ln)}
.row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px 14px;align-items:center;padding:12px 0;border-bottom:1px solid var(--ln)}
.what{min-width:0}
.what b{display:block;font-weight:600}
.what span{display:block;font-size:13.5px;color:var(--mu)}
.btns{display:flex;gap:8px}
.btns button{min-width:92px;padding:10px 12px}
.btns small{display:block;margin-top:5px;font:500 11.5px/1 'Golos Text',sans-serif;color:var(--mu);font-variant-numeric:tabular-nums}
.foot{margin-top:34px;font-size:13px;color:var(--mu);max-width:62ch}
@media (max-width:520px){.row{grid-template-columns:1fr}.btns button{flex:1}}
</style>
<main class="wrap">
  <p class="kick">Языки по кино · звуки 13.9.21</p>
  <h1>Звуки приложения</h1>
  <p class="lede"><b>«Кино»</b> — у всех по умолчанию: затвор, кадровая рамка, бумага, челеста, войлок, стрёкот проектора. <b>«Как в iPhone»</b> — на выбор, бесплатно в Магазине → Звуки. Всё сделано с нуля, чужих записей нет. Громкость как в приложении — тихо, поэтому телефон не на беззвучном.</p>
  <div class="bar"><button class="k" data-all="kino"><i class="dt"></i>Все «Кино» подряд</button><button class="i" data-all="ios"><i class="dt"></i>Все «iPhone» подряд</button><button data-cmp>⇄ Сравнить по очереди</button></div>
  <p class="st" id="st" aria-live="polite"></p>
  %ROWS%
  <p class="foot">Нажатие и выбор — самые короткие (меньше 0,15 с), чтобы не надоедали. Награды длиннее — до 1,2 с. Если какой-то звук бесит или не похож — напиши, какой, переделаю только его.</p>
</main>
<script>
const D=%DATA%;let AC=null,G=null,RUN=0;const B={};
const ctx=()=>{if(!AC){const C=window.AudioContext||window.webkitAudioContext;AC=new C();G=AC.createGain();G.gain.value=.47;G.connect(AC.destination);}if(AC.state==='suspended')AC.resume();return AC;};  // как в приложении: канал файлов sfxBus — 0.47, без компрессора
const ab=s=>{const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u.buffer;};
const dec=(s,e)=>B[s+e]||(B[s+e]=new Promise((ok,no)=>ctx().decodeAudioData(ab(D[s][e]),buf=>{const d=buf.getChannelData(0);let pk=0;for(let j=0;j<d.length;j++)pk=Math.max(pk,Math.abs(d[j]));const th=Math.max(1e-4,pk*.002);let i=0;while(i<d.length&&Math.abs(d[i])<th)i++;ok({buf,off:Math.max(0,i/buf.sampleRate-.001)});},no)));
const play=async(s,e,btn)=>{const a=ctx(),{buf,off}=await dec(s,e),src=a.createBufferSource();src.buffer=buf;src.connect(G);if(btn)btn.classList.add('on');
  return new Promise(r=>{src.onended=()=>{if(btn)btn.classList.remove('on');r();};src.start(0,off);});};
const wait=ms=>new Promise(r=>setTimeout(r,ms));const st=document.getElementById('st');
document.addEventListener('click',async ev=>{const b=ev.target.closest('button');if(!b)return;ctx();
  if(b.dataset.e){play(b.dataset.s,b.dataset.e,b).catch(()=>{st.textContent='Этот браузер не смог сыграть звук';});return;}
  const id=++RUN,E=[...document.querySelectorAll('.row')].map(r=>r.dataset.e);
  if(b.dataset.all){for(const e of E){if(id!==RUN)return;st.textContent=(b.dataset.all==='kino'?'Кино':'iPhone')+' · '+document.querySelector('.row[data-e="'+e+'"] b').textContent;await play(b.dataset.all,e,document.querySelector('[data-s="'+b.dataset.all+'"][data-e="'+e+'"]'));await wait(320);}st.textContent='';}
  if(b.dataset.cmp!==undefined){for(const e of E){for(const s of ['kino','ios']){if(id!==RUN)return;st.textContent=document.querySelector('.row[data-e="'+e+'"] b').textContent+' · '+(s==='kino'?'Кино':'iPhone');await play(s,e,document.querySelector('[data-s="'+s+'"][data-e="'+e+'"]'));await wait(260);}await wait(240);}st.textContent='';}});
</script>
"""


def write_page(path, data, report):
    rows = []
    for sk, sn in SECT:
        items = [e for e in EVENTS if INFO[e][2] == sk]
        li = ''.join(
            f'<li class="row" data-e="{e}"><div class="what"><b>{INFO[e][0]}</b><span>{INFO[e][1]}</span></div><div class="btns">'
            f'<button class="k" data-s="kino" data-e="{e}"><i class="dt"></i>Кино<small>{report["kino"][e]["dur"]:.2f} с</small></button>'
            f'<button class="i" data-s="ios" data-e="{e}"><i class="dt"></i>iPhone<small>{report["ios"][e]["dur"]:.2f} с</small></button></div></li>'
            for e in items)
        rows.append(f'<h2>{sn}</h2><ul class="list">{li}</ul>')
    html = PAGE.replace('%ROWS%', ''.join(rows)).replace('%DATA%', json.dumps(data, separators=(',', ':')))
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f'→ {path} {len(html) / 1024:.0f} КБ')


def main():
    wav_dir = None
    if '--wav' in sys.argv:
        wav_dir = sys.argv[sys.argv.index('--wav') + 1]
        os.makedirs(wav_dir, exist_ok=True)
    report = {}
    ALL = {}
    bad = 0
    for key, (title, fns) in SETS.items():
        out = os.path.join(ROOT, 'snd', key)
        os.makedirs(out, exist_ok=True)
        data = {}
        ALL[key] = data
        report[key] = {}
        for e in EVENTS:
            x = finish(fns[e](), KIND[e])
            mp3 = to_mp3(x)
            with open(os.path.join(out, e + '.mp3'), 'wb') as f:
                f.write(mp3)
            if wav_dir:
                with open(os.path.join(wav_dir, f'{key}-{e}.wav'), 'wb') as f:
                    f.write(wav_bytes(x))
            c = check(e, KIND[e], mp3)
            report[key][e] = c
            bad += len(c['err'])
            data[e] = base64.b64encode(mp3).decode()
            print(f"{key:4} {e:10} {KIND[e]:3} {c['dur']:.3f} с {c['kb']:5.1f} КБ пик {c['peak']:5.1f} RMS {c['rms']:6.1f}  {'; '.join(c['err']) or 'ok'}")
        js = (f'/* 13.9.21: звуки «{title}» — синтез tools/sfx_make.py, лицензия CC0 (snd/ЛИЦЕНЗИЯ.md). Файл собран скриптом — руками не править. */\n'
              f'(window.SFXD=window.SFXD||{{}}).{key}={json.dumps(data, ensure_ascii=False, separators=(",", ":"))};\n')
        with open(os.path.join(ROOT, 'js', f'sfx-{key}.js'), 'w', encoding='utf-8') as f:
            f.write(js)
        print(f'→ js/sfx-{key}.js {len(js) / 1024:.0f} КБ')
    with open(os.path.join(ROOT, 'snd', 'отчёт.json'), 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=1)
    if '--page' in sys.argv:
        write_page(sys.argv[sys.argv.index('--page') + 1], ALL, report)
    if bad:
        print(f'ОШИБОК: {bad}')
        sys.exit(1)
    print('всё в норме')


if __name__ == '__main__':
    main()
