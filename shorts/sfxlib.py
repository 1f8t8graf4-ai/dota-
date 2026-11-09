# Звуки по событиям (v6, 09.11): всё синтезом — чужих прав нет. Имя → моно-массив 48 кГц, пик ≈ 0.9.
#   Вызов: snd(name, rng) — имена совпадают с cue() в v6.js (pop, pin, stamp, type, thud, zoom, swish, ding, cheer …).
#   Переходы: tr_<вид> → см. TR. Неизвестное имя → None (молча пропускаем).
import numpy as np

SR = 48000


def _t(d):
    return np.arange(int(d * SR)) / SR


def _env(n, a=.003, r=None, sh=4.0):
    t = np.arange(n) / SR
    e = 1 - np.exp(-t / max(a, 1e-4))
    if r is not None:
        e *= np.exp(-t * sh / r)
    return e


def _lp(x, hi=None, lo=None):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); g = np.ones_like(f)
    if hi: g *= 1 / np.sqrt(1 + (f / hi) ** 4)
    if lo: g *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1)) ** 4)
    return np.fft.irfft(X * g, len(x))


def _norm(x, p=.9):
    m = np.max(np.abs(x)) or 1
    return x / m * p


def _sweep(f0, f1, d, kind='exp'):
    t = _t(d)
    f = f0 * (f1 / f0) ** (t / d) if kind == 'exp' else f0 + (f1 - f0) * t / d
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def _noise(d, rng):
    return rng.standard_normal(int(d * SR))


def pop(rng):
    d = .09; t = _t(d)
    x = _sweep(1100, 280, d) * np.exp(-t * 45) + _lp(_noise(d, rng), lo=2000) * np.exp(-t * 300) * .3
    return _norm(x)


def pin(rng):
    d = .25; t = _t(d)
    x = _lp(_noise(d, rng), lo=1500) * np.exp(-t * 400) * .6 + (np.sin(2 * np.pi * 2400 * t) + .6 * np.sin(2 * np.pi * 3710 * t)) * np.exp(-t * 22) * .35
    return _norm(x)


def thud(rng):
    d = .35; t = _t(d)
    x = _sweep(130, 45, d) * np.exp(-t * 14) + _lp(_noise(d, rng), hi=600) * np.exp(-t * 30) * .5
    return _norm(x)


def stamp(rng):
    d = .45; t = _t(d)
    x = _sweep(160, 50, d) * np.exp(-t * 16) * .9 + _lp(_noise(d, rng), hi=3000, lo=300) * np.exp(-t * 18) * .7
    return _norm(x)


def hit(rng):
    d = .5; t = _t(d)
    x = _sweep(150, 40, d) * np.exp(-t * 9) + _lp(_noise(d, rng), hi=5000, lo=800) * np.exp(-t * 22) * .4
    return _norm(x)


def type_(rng):  # машинка: 9 щелчков за ~0.5 с и звоночек
    d = .62; x = np.zeros(int(d * SR))
    for i in range(9):
        s = int((i * .055 + rng.random() * .01) * SR); n = int(.012 * SR)
        x[s:s + n] += _lp(rng.standard_normal(n), hi=6000, lo=1200) * np.exp(-np.arange(n) / SR * 400) * (.7 + .3 * rng.random())
    return _norm(x, .7)


def swish(rng):
    d = .22; t = _t(d)
    e = np.sin(np.pi * t / d) ** 2
    return _norm(_lp(_noise(d, rng), hi=6000, lo=900) * e)


def zoom(rng):  # влёт внутрь предмета: нарастающий шум + тон вверх
    d = .8; t = _t(d)
    e = (t / d) ** 2 * np.exp(-np.maximum(0, t - d * .85) * 40)
    x = _lp(_noise(d, rng), hi=4000, lo=300) * e + _sweep(180, 900, d) * e * .25
    return _norm(x)


def zoomout(rng):
    return _norm(zoom(rng)[::-1])


def morph(rng):
    d = .4; t = _t(d)
    f = 320 * (3.2 ** (t / d)) * (1 + .04 * np.sin(2 * np.pi * 18 * t))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / d) + .3 * np.sin(2 * np.pi * np.cumsum(f * 2) / SR) * np.sin(np.pi * t / d)
    return _norm(x, .75)


def shing(rng):
    d = 1.0; t = _t(d)
    x = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * k) for f, k in ((2350, 4), (3510, 6), (5230, 9))) * .5
    x += _lp(_noise(d, rng), lo=3000) * np.exp(-t * 12) * np.minimum(1, t / .05) * .5
    return _norm(x, .7)


def puff(rng):
    d = .7; t = _t(d)
    return _norm(_lp(_noise(d, rng), hi=1600, lo=150) * np.sin(np.pi * t / d) ** 1.5, .7)


def ding(rng):
    d = 1.4; t = _t(d)
    x = sum(a * np.sin(2 * np.pi * 880 * r * t) * np.exp(-t * k) for a, r, k in ((1, 1, 3), (.5, 2.76, 5), (.25, 5.4, 8)))
    return _norm(x, .6)


def count(rng):  # табло: быстрые щелчки
    d = 1.2; x = np.zeros(int(d * SR))
    for i in range(22):
        s = int(i / 22 * d * SR); n = int(.008 * SR)
        x[s:s + n] += np.sin(2 * np.pi * 2600 * np.arange(n) / SR) * np.exp(-np.arange(n) / SR * 500)
    return _norm(x, .5)


def roll(rng):
    d = .7; t = _t(d)
    return _norm(_lp(_noise(d, rng), hi=500) * (1 + .5 * np.sin(2 * np.pi * 14 * t)) * np.sin(np.pi * t / d), .7)


def cheer(rng):  # «ура» маленьких тлей: писк с вибрато
    d = 1.1; x = np.zeros(int(d * SR))
    for i in range(16):
        st = rng.random() * .4; dd = .25 + rng.random() * .4; t = _t(dd); f0 = 700 + rng.random() * 700
        f = f0 * (1 + .3 * t / dd) * (1 + .03 * np.sin(2 * np.pi * (6 + rng.random() * 4) * t))
        y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / dd) * .3
        s = int(st * SR); x[s:s + len(y)] += y[:len(x) - s]
    return _norm(x, .6)


def dun(rng):  # «дун-дун» — драма
    d = 1.3; x = np.zeros(int(d * SR))
    for st, f in ((0, 73.4), (.32, 69.3)):
        t = _t(.9); y = sum(np.sin(2 * np.pi * f * k * t) / k for k in range(1, 7)) * np.exp(-t * 3) * np.minimum(1, t / .01)
        s = int(st * SR); x[s:s + len(y)] += _lp(y, hi=900)[:len(x) - s]
    return _norm(x, .9)


def marker(rng):
    d = .5; x = np.zeros(int(d * SR))
    for st in (0, .22):
        t = _t(.16); y = np.sin(2 * np.pi * np.cumsum(2200 + 900 * np.sin(2 * np.pi * 9 * t)) / SR) * np.sin(np.pi * t / .16) * .4 + _lp(rng.standard_normal(len(t)), lo=2500) * .2 * np.sin(np.pi * t / .16)
        s = int(st * SR); x[s:s + len(y)] += y
    return _norm(x, .5)


def flutter(rng):
    d = .9; t = _t(d)
    return _norm(_lp(_noise(d, rng), hi=2500, lo=200) * (.5 + .5 * np.sin(2 * np.pi * 32 * t)) * np.sin(np.pi * t / d), .6)


def cowbell(rng):
    d = .5; t = _t(d)
    x = (np.sign(np.sin(2 * np.pi * 562 * t)) + np.sign(np.sin(2 * np.pi * 845 * t))) * np.exp(-t * 9)
    return _norm(_lp(x, hi=4000, lo=300), .6)


def drip(rng):
    d = .15; t = _t(d)
    up = np.concatenate([_sweep(500, 1400, .04, 'lin'), np.zeros(len(t) - int(.04 * SR))])
    return _norm(up * np.exp(-t * 30) + np.sin(2 * np.pi * 1300 * t) * np.exp(-t * 40) * .5, .6)


def slurp(rng):
    d = .7; t = _t(d)
    x = _lp(_noise(d, rng), hi=1800, lo=300) * (.5 + .5 * np.sign(np.sin(2 * np.pi * 11 * t))) * np.sin(np.pi * t / d)
    return _norm(x, .6)


def click(rng):
    d = .2; x = np.zeros(int(d * SR))
    for st in (0, .1):
        n = int(.01 * SR); s = int(st * SR); x[s:s + n] += _lp(rng.standard_normal(n), lo=1500) * np.exp(-np.arange(n) / SR * 600)
    return _norm(x, .6)


def chomp(rng):
    d = .3; x = np.zeros(int(d * SR))
    for i in range(7):
        n = int(.025 * SR); s = int((i * .035) * SR); x[s:s + n] += _lp(rng.standard_normal(n), hi=3000, lo=400) * np.exp(-np.arange(n) / SR * 120)
    return _norm(x, .8)


def zap(rng):
    d = .6; t = _t(d)
    saw = 2 * ((t * 90) % 1) - 1
    x = _lp(saw, hi=2000) * (.6 + .4 * np.sign(np.sin(2 * np.pi * 17 * t))) + _lp(_noise(d, rng), lo=3000) * (rng.random(len(t)) < .02) * 2
    return _norm(x * np.minimum(1, (d - t) / .1), .6)


def freeze(rng):
    d = .4; t = _t(d)
    return _norm(_lp(_noise(d, rng), lo=4000) * np.exp(-t * 10) + _sweep(1800, 600, d) * np.exp(-t * 8) * .4, .6)


def draw(rng):
    d = 1.0; t = _t(d)
    am = np.abs(np.sin(2 * np.pi * (5 + 3 * np.sin(2 * np.pi * .7 * t)) * t))
    return _norm(_lp(_noise(d, rng), hi=5000, lo=1500) * am * np.minimum(1, t / .05) * np.minimum(1, (d - t) / .1), .4)


def clock(rng):
    d = 2.6; x = np.zeros(int(d * SR))
    for i in range(10):
        n = int(.015 * SR); s = int(i * .26 * SR); f = 1700 if i % 2 else 1300
        x[s:s + n] += np.sin(2 * np.pi * f * np.arange(n) / SR) * np.exp(-np.arange(n) / SR * 300)
    return _norm(x, .5)


def flip(rng):
    d = .3; t = _t(d)
    return _norm(_lp(_noise(d, rng), hi=5000, lo=800) * np.exp(-((t - .08) / .05) ** 2), .6)


FN = {'pop': pop, 'pin': pin, 'thud': thud, 'stamp': stamp, 'hit': hit, 'type': type_, 'swish': swish, 'zoom': zoom, 'zoomout': zoomout,
      'morph': morph, 'shing': shing, 'puff': puff, 'ding': ding, 'count': count, 'roll': roll, 'cheer': cheer, 'dun': dun, 'marker': marker,
      'flutter': flutter, 'cowbell': cowbell, 'drip': drip, 'slurp': slurp, 'click': click, 'chomp': chomp, 'zap': zap, 'freeze': freeze,
      'draw': draw, 'clock': clock, 'flip': flip, 'tick': None, 'whoosh': None}
# переход → звук (None — без звука; 'kino:whoosh' — из ../snd/kino)
TR = {'thru': 'zoom', 'into': 'zoomout', 'out': 'swish', 'zc': 'zoom', 'whip': 'swish', 'whipL': 'swish', 'whipU': 'swish', 'whipD': 'swish',
      'band': 'swish', 'slide': 'kino:whoosh', 'slideL': 'kino:whoosh', 'slideU': 'kino:whoosh', 'slideD': 'kino:whoosh', 'flip': 'flip',
      'drop': 'thud', 'push': 'kino:whoosh', 'fade': None, 'cut': None}
# громкость по умолчанию (умножается на gain из cue)
GAIN = {'pop': .32, 'pin': .4, 'thud': .55, 'stamp': .7, 'hit': .55, 'type': .35, 'swish': .3, 'zoom': .32, 'zoomout': .3, 'morph': .35,
        'shing': .32, 'puff': .4, 'ding': .3, 'count': .3, 'roll': .4, 'cheer': .45, 'dun': .8, 'marker': .35, 'flutter': .35, 'cowbell': .4,
        'drip': .4, 'slurp': .4, 'click': .45, 'chomp': .5, 'zap': .35, 'freeze': .4, 'draw': .3, 'clock': .3, 'flip': .4, 'tick': .3, 'whoosh': .25}
_cache = {}


def snd(name, rng):
    """→ (массив, громкость) или (None, 0). Имя 'kino:x' и None-функции — из ../snd/kino (загружает audio.py)."""
    f = FN.get(name)
    if f is None:
        return None, GAIN.get(name, 0)
    if name not in _cache:
        _cache[name] = [f(np.random.default_rng(i * 7 + 1)) for i in range(3)]  # 3 варианта — повторы не звучат одинаково
    return _cache[name][int(rng.integers(0, 3))], GAIN.get(name, .3)
