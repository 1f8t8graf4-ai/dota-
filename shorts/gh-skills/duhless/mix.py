"""Сведение по правилам lemo-opuscar «Spy Titles» §7:
- фоли синтезом по событиям кадра (бумага, металл, плёнка) — функции из mix.py демо spy-titles (MIT) и core/audio/sfx.py;
- голос «через плёнку»: полоса 220–5200 Гц, мягкое насыщение, лёгкая детонация, шипение только под голосом;
- музыка приседает ~7 дБ под голосом; стоп-время — настоящая тишина; лимитер перед громкостью.
Громкость −14 LUFS доводит ffmpeg-skill (loudness.py) при сборке.
Запуск: LIB=~/lemo-opuscar $LIB/.venv/bin/python mix.py <голос.wav>  →  out/mix.wav
"""
import sys, os, json
LIB = os.environ.get('LIB', os.path.expanduser('~/lemo-opuscar'))
sys.path.insert(0, LIB)
import numpy as np, soundfile as sf, soxr
from scipy.ndimage import uniform_filter1d
from core.audio.sfx import SR, t_, env_exp, bp, lp, hp, add, limit, compress, whoosh, thump, pop, ding

HERE = os.path.dirname(os.path.abspath(__file__))
ev = json.load(open(os.path.join(HERE, 'events.json')))
VO = 1.5
DUR = ev['dur']; N = int((DUR + .2) * SR)
rng = np.random.default_rng(36)
fol = np.zeros((N, 2)); vox = np.zeros((N, 2))
def nz(d): return rng.standard_normal(int(round(d * SR)))
def n1(x, p=1.0): m = np.abs(x).max(); return x * p / m if m > 0 else x
def env_ad(d, a, tau): tt = t_(d); return np.minimum(1, tt / max(a, 1e-4)) * np.exp(-np.maximum(0, tt - a) / tau)

# ── бумага (демо) ──
def paper_slide(): d = .24; x = bp(nz(d), 1200, 6000) * env_ad(d, .16, .04); return n1(x) * .5
def paper_whoosh(): d = .42; x = bp(nz(d), 500, 5000) * np.sin(np.pi * t_(d) / d) ** 2; return n1(x) * .55
def card_slap():
    d = .14; tt = t_(d)
    return n1(np.sin(2 * np.pi * 95 * tt) * env_exp(d, .025) * .9 + bp(nz(d), 700, 4500) * env_exp(d, .012) * 1.1) * .8
def scissor():
    out = np.zeros(int(.3 * SR))
    for k, f in enumerate([4200, 3600]):
        d = .12; tt = t_(d); x = hp(nz(d), 3000) * env_exp(d, .004) + np.sin(2 * np.pi * f * tt) * env_exp(d, .02) * .5
        s = int(k * .075 * SR); out[s:s + len(x)] += x
    return n1(out) * .7
def step(): d = .08; tt = t_(d); return n1(bp(nz(d), 300, 3000) * env_exp(d, .012) + np.sin(2 * np.pi * 120 * tt) * env_exp(d, .015) * .6) * .45
def shatter():
    d = .9; tt = t_(d); x = bp(nz(d), 600, 7000) * (np.abs(np.sin(tt * 90 + 3 * np.sin(tt * 23))) ** 3) * env_ad(d, .02, .35)
    return n1(x + whoosh(d) * .5) * .8
# ── металл, стекло, перо (по образцу демо) ──
def metal(d, parts, tau):
    tt = t_(d); return sum(a * np.sin(2 * np.pi * f * tt + rng.random() * 6) * env_exp(d, tau * (1 + .3 * rng.random())) for f, a in parts)
def chain(): d = .35; return n1(hp(nz(d), 2500) * env_exp(d, .006) + metal(d, [(3100, .5), (4700, .3), (2200, .4)], .05)) * .6
def clink(): d = .9; return n1(metal(d, [(2637, .6), (3951, .4), (5274, .3), (6640, .15)], .28)) * .55   # бокал: верхние гармоники
def latch(): d = .22; tt = t_(d); return n1(bp(nz(d), 1500, 7000) * env_exp(d, .006) + metal(d, [(1850, .6), (2900, .4)], .03) + np.sin(2 * np.pi * 140 * tt) * env_exp(d, .02) * .7) * .75
def pen(d=.5):   # скрип пера: шум в полосе с дрожью штриха
    tt = t_(d); trem = .55 + .45 * np.sin(2 * np.pi * 17 * tt + 2 * np.sin(2 * np.pi * 3.3 * tt))
    return n1(bp(nz(d), 2200, 7500) * trem * env_ad(d, .03, .3)) * .35
def tape_click(): d = .05; return n1(hp(nz(d), 1500) * env_exp(d, .004)) * .4

FX = {'paper_slide': paper_slide, 'paper_whoosh': paper_whoosh, 'card_slap': card_slap, 'scissor': scissor, 'step': step,
      'shatter': shatter, 'chain': chain, 'clink': clink, 'latch': latch, 'pen': pen, 'pop': lambda: n1(pop()) * .5,
      'ding': lambda: n1(ding()) * .4, 'tape_click': tape_click}
for e in ev['ev']:
    f = FX.get(e['type'])
    if f: add(fol, f(), e['t'], e.get('g', 1.0) * .8, (rng.random() - .5) * .5)

# ── голос «через плёнку» ──
vpath = sys.argv[1]
v, sr = sf.read(vpath, always_2d=True); v = v.mean(1)
if sr != SR: v = soxr.resample(v, sr, SR)
v = bp(v, 220, 5200, 2)
v = np.tanh(v * 2.2) / np.tanh(2.2)                                   # мягкое насыщение
tt = np.arange(len(v)) / SR; idx = np.clip(tt + .0009 * np.sin(2 * np.pi * .7 * tt), 0, tt[-1]) * SR
v = np.interp(idx, np.arange(len(v)), v)                              # лёгкая детонация (wow)
v = compress(v, .2, 3.2)
env = uniform_filter1d(np.abs(v), int(.05 * SR)); hiss = hp(rng.standard_normal(len(v)), 4000) * .004 * np.clip(env * 8, 0, 1)
v = v + hiss
add(vox, n1(v, .85), VO, 1.0, 0)

# ── музыка: −7 дБ под голосом, плавно ──
m, msr = sf.read(os.path.join(HERE, 'out', 'score.wav'), always_2d=True)
mus = np.zeros((N, 2)); mus[:min(N, len(m))] = m[:N]
ve = uniform_filter1d(np.abs(vox).mean(1), int(.12 * SR))
talk = np.clip(ve / (np.percentile(ve[ve > 1e-4], 50) + 1e-9), 0, 1)
duck = 10 ** (-7 * uniform_filter1d(talk, int(.15 * SR)) / 20)
mus *= duck[:, None]

# ── стоп-время: настоящий ноль (кроме щелчка плёнки) ──
stop = next(e['t'] for e in ev['ev'] if e['type'] == 'silence'); title = next(e['t'] for e in ev['ev'] if e['type'] == 'title')
shat = next(e['t'] for e in ev['ev'] if e['type'] == 'shatter')
a, b = int((stop + .02) * SR), int((shat - .02) * SR)
for buf in (fol, mus):
    buf[a:b] = 0

mix = vox * 1.0 + mus * .55 + fol * .7
mix = np.stack([limit(mix[:, c], .89) for c in range(2)], 1)   # limit() в sfx.py одномерный
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix[:int(DUR * SR)].astype(np.float32), SR)
print('mix.wav', round(DUR, 2), 's, peak', round(float(np.abs(mix).max()), 3))
