#!/usr/bin/env python3
"""Звук роликов «Духless» RU (27.11): голос + «Кашалот» + звуки по событиям кадра (синтез), −14 LUFS.
  python3 mix.py <ролик> <папка голосов> <кашалот.mp3> <выход.wav> [--nomusic]
План (кадры, переходы, время цитаты, время слов) — <папка>/<ролик>.plan.json (plan.mjs).
Логика по стилям:
  dina, nonstop — музыка с дропа всё время, под голосом проседает;
  pov — в туалете музыка «через стену» (низы), на цитате Макса — тишина;
  g1 реализм — бас клуба за стеной до двери, дальше раскрывается; в начале — голос Макса;
  g2 Династия — серое утро без музыки (ветер, гудки), перемотка, дроп на «Москва 2012»;
  g3 нуар — музыка глухо, тикают часы, дрон густеет на полигоне;
  g4 35 мм — клуб орёт до «А внутри — ничего», дальше тишина и пульс 52."""
import json, subprocess, sys
import numpy as np, soundfile as sf
SR = 48000
key, D, KAS, OUT = sys.argv[1:5]; NOMUS = '--nomusic' in sys.argv
P = json.load(open(f'{D}/{key}.plan.json')); DUR = P['dur']; N = int(DUR * SR); W = P['words']
wa = lambda i: W[i]['a']; wb = lambda i: W[i]['b']
rng = np.random.default_rng(7)
def load(p, ss=0.0, dur=None, ch=2):
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(ss), '-i', p] + (['-t', str(dur)] if dur else []) + ['-ac', str(ch), '-ar', str(SR), '-f', 'f32le', '-']
    a = np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32)
    return a.reshape(-1, ch).copy()
def lufs(x):
    p = subprocess.run(['ffmpeg', '-hide_banner', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', 'ebur128', '-f', 'null', '-'], input=x.astype(np.float32).tobytes(), capture_output=True)
    for l in p.stderr.decode().splitlines()[::-1]:
        if l.strip().startswith('I:'): return float(l.split()[1])
    return -70.0
def gain_to(x, t): return x * 10 ** ((t - lufs(x)) / 20)
def st(y): return np.stack([y, y], 1) if y.ndim == 1 else y
def put(mix, y, t, g=1.0):
    y = st(y); i = int(t * SR)
    if i < 0: y = y[-i:]; i = 0
    n = min(len(y), len(mix) - i)
    if n > 0: mix[i:i + n] += y[:n] * g
def fft_filt(x, lo=0, hi=1e9):
    X = np.fft.rfft(x, axis=0); f = np.fft.rfftfreq(len(x), 1 / SR); m = ((f >= lo) & (f <= hi)).astype(float)
    if x.ndim > 1: m = m[:, None]
    return np.fft.irfft(X * m, len(x), axis=0)
def lp1(x, fc):  # плавный ФНЧ (1-й порядок) по массиву, можно менять частоту во времени
    fc = np.broadcast_to(np.asarray(fc, float), (len(x),)); a = 1 - np.exp(-2 * np.pi * fc / SR); y = np.empty_like(x); s = np.zeros(x.shape[1])
    for k in range(len(x)): s += a[k] * (x[k] - s); y[k] = s
    return y
def env_at(times, vals, n):  # кусочно-линейная огибающая
    t = np.arange(n) / SR; return np.interp(t, times, vals)

# ---------- звуки (синтез) ----------
def whoosh(d=.32, lo=400, hi=5000):
    m = int(d * SR); x = rng.standard_normal(m); X = np.fft.rfft(x); fq = np.fft.rfftfreq(m, 1 / SR); out = np.zeros(m); seg = 10; ln = m // seg
    for j in range(seg):
        cen = lo * ((hi / lo) ** (j / (seg - 1))); w = np.exp(-.5 * ((np.log(fq + 1) - np.log(cen)) / .5) ** 2)
        y = np.fft.irfft(X * w, m); out[j * ln:(j + 1) * ln] = y[j * ln:(j + 1) * ln]
    u = np.linspace(0, 1, m); out *= np.sin(np.pi * np.clip(u / .7, 0, 1) * .5) * np.clip((1 - u) / .3, 0, 1)
    return out / (np.abs(out).max() + 1e-9)
def boom(d=1.2, f0=72, f1=36, a=1.0):
    t = np.arange(int(d * SR)) / SR; fr = f1 + (f0 - f1) * np.exp(-t / .16); y = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t / .38) * np.minimum(1, t / .004)
    cl = fft_filt(rng.standard_normal(len(t)) * np.exp(-t / .01), 200, 4000); return a * (y + .4 * cl / (np.abs(cl).max() + 1e-9))
def click(d=.12, f=2600, a=.5):
    t = np.arange(int(d * SR)) / SR; y = fft_filt(rng.standard_normal(len(t)), 2500, 9000) * np.exp(-t / .004) + .6 * np.sin(2 * np.pi * f * t) * np.exp(-t / .02)
    return a * y / (np.abs(y).max() + 1e-9)
def shutter():
    y = np.zeros(int(.16 * SR)); a = click(.06, 3200, .5); b = click(.08, 2100, .4); y[:len(a)] += a; j = int(.045 * SR); y[j:j + len(b)] += b[:len(y) - j]; return y
def pop():
    t = np.arange(int(.8 * SR)) / SR; th = np.sin(2 * np.pi * np.cumsum(260 + 500 * np.exp(-t / .006)) / SR) * np.exp(-t / .018)
    fz = fft_filt(rng.standard_normal(len(t)), 3500, 11000) * np.minimum(1, t / .03) * np.exp(-t / .3) * (.6 + .4 * rng.random(len(t))); y = th + .35 * fz; return .55 * y / np.abs(y).max()
def ding(f=1568, a=.12):
    t = np.arange(int(.6 * SR)) / SR; y = (np.sin(2 * np.pi * f * t) + .5 * np.sin(2 * np.pi * f * 1.5 * t)) * np.exp(-t / .18) * np.minimum(1, t / .003); return a * y / np.abs(y).max()
def scratch(d):
    t = np.arange(int(d * SR)) / SR; x = fft_filt(rng.standard_normal(len(t)), 1800, 7000)
    e = np.abs(np.sin(2 * np.pi * 7.5 * t + 2 * np.sin(2 * np.pi * 2.1 * t))) ** 1.5 * np.minimum(1, t / .03) * np.minimum(1, (d - t) / .05); y = x * e; return .09 * y / (np.abs(y).max() + 1e-9)
def thud(a=.5):
    t = np.arange(int(.35 * SR)) / SR; y = np.sin(2 * np.pi * np.cumsum(60 + 90 * np.exp(-t / .02)) / SR) * np.exp(-t / .07) + .3 * fft_filt(rng.standard_normal(len(t)), 300, 2500) * np.exp(-t / .015)
    return a * y / np.abs(y).max()
def heart(a=.6):
    y = np.zeros(int(.6 * SR)); b = thud(a); y[:len(b)] += b; j = int(.22 * SR); c = thud(a * .7); y[j:j + len(c)] += c[:len(y) - j]; return fft_filt(y, 20, 400)
def hum(d, a=.05, flick=None):
    t = np.arange(int(d * SR)) / SR; y = (np.sin(2 * np.pi * 100 * t) + .5 * np.sin(2 * np.pi * 200 * t) + .25 * np.sin(2 * np.pi * 300 * t)) * a
    y += fft_filt(rng.standard_normal(len(t)), 2000, 8000) * a * .25
    if flick is not None: y *= flick(t)
    return y
def ringback(d):  # гудок 425 Гц: 0,8 с звук, 3,2 с тишина
    t = np.arange(int(d * SR)) / SR; on = (t % 4.0) < .8; y = np.sin(2 * np.pi * 425 * t) * on * .09
    k = int(.01 * SR); return fft_filt(y, 300, 3400) * np.convolve(on.astype(float), np.ones(k) / k, 'same')
def wind(d, a=.05):
    x = fft_filt(rng.standard_normal(int(d * SR)), 80, 900); t = np.arange(len(x)) / SR; x *= .6 + .4 * np.sin(2 * np.pi * .17 * t + 1); return a * x / (np.abs(x).max() + 1e-9)
def tape(d):
    t = np.arange(int(d * SR)) / SR; f = 900 + 700 * np.sin(2 * np.pi * 3 * t) + 400 * t
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * .25 + fft_filt(rng.standard_normal(len(t)), 1500, 6000) * .5; y *= np.minimum(1, t / .05) * np.minimum(1, (d - t) / .08); return .12 * y / np.abs(y).max()
def crackle(d):
    y = np.zeros(int(d * SR))
    for k in range(int(d * 24)):
        j = int(rng.random() * (len(y) - 400)); y[j:j + 400] += fft_filt(rng.standard_normal(400), 2000, 9000) * np.exp(-np.arange(400) / 60) * (.4 + rng.random())
    return .18 * y / (np.abs(y).max() + 1e-9)
def glasscrack():
    y = np.zeros(int(.9 * SR))
    for k in range(18):
        j = int(rng.random() * .5 * SR); n = int(.05 * SR); seg = fft_filt(rng.standard_normal(n), 3000, 12000) * np.exp(-np.arange(n) / (n / 6)); y[j:j + n] += seg * (1 - j / len(y))
    return .5 * y / np.abs(y).max()
def drone(d, a=.12):
    t = np.arange(int(d * SR)) / SR; y = sum(np.sin(2 * np.pi * f * t + ph) for f, ph in [(41.2, 0), (55, 1), (61.7, 2), (82.4, .5)]) / 4
    y *= np.minimum(1, t / 1.5) * np.minimum(1, (d - t) / .6); return a * y
def room(y, mix=.25, dec=.35):  # короткая комната (кафель)
    n = int(dec * SR); ir = rng.standard_normal(n) * np.exp(-np.arange(n) / (n / 5)); ir = fft_filt(ir, 300, 6000); ir /= np.abs(ir).sum() / 8
    L = len(y) + n; F = np.fft.rfft(ir, L)
    wet = np.stack([np.fft.irfft(np.fft.rfft(y[:, c], L) * F, L)[:len(y)] for c in range(y.shape[1])], 1); return y * (1 - mix) + wet * mix

mix = np.zeros((N, 2), np.float32)
# ---------- голос ----------
v = gain_to(st(load(f'{D}/{key}.wav', ch=1)[:, 0]), -16.0); V0 = P.get('voff', 0) or 0
put(mix, v, V0)
venv = np.zeros(N); e = np.sqrt(np.convolve(v[:, 0] ** 2, np.ones(1440) / 1440, 'same')); i0 = int(V0 * SR); n = min(len(e), N - i0); venv[i0:i0 + n] = e[:n]
if key in ('pov', 'g1'):
    mq = gain_to(st(load(f'{D}/{"max" if key == "pov" else "max2"}.wav', ch=1)[:, 0]), -15.5); mq = room(mq, .28 if key == 'pov' else .2)
    if key == 'pov':  # у первой цитаты в начале файла тишина и вдох — режем по громкости
        a = np.abs(mq[:, 0]); on = np.argmax(a > a.max() * .08); mq = mq[max(0, on - int(.05 * SR)):]
    put(mix, mq, P['qa']); e = np.sqrt(np.convolve(mq[:, 0] ** 2, np.ones(1440) / 1440, 'same')); j = int(P['qa'] * SR); n = min(len(e), N - j); venv[j:j + n] = np.maximum(venv[j:j + n], e[:n])
thr = np.percentile(venv[venv > 1e-4], 30) if (venv > 1e-4).any() else 1e-3; act = np.clip(venv / thr, 0, 1); duck = np.zeros(N); s = 0.0
aa, ar = 1 - np.exp(-1 / (.015 * SR)), 1 - np.exp(-1 / (.25 * SR))
for k in range(N): x = act[k]; s += (x - s) * (aa if x > s else ar); duck[k] = s

# ---------- музыка ----------
SH = P['shots']; sa = lambda w, n=0: [s['a'] for s in SH if s['w'] == w][n]
def kas(start_t, ss=21.03, L=None):
    L = L or (DUR - start_t + .5); return load(KAS, ss, L)
music = np.zeros((N, 2), np.float32); KL = -16.5
if not NOMUS:
    if key in ('dina', 'nonstop', 'pov', 'g1', 'g3', 'g4'):
        k = gain_to(kas(0), KL); n = min(len(k), N); music[:n] = k[:n]
        g = np.ones(N)
        if key == 'pov':
            t1 = sa('toilet'); lp_f = env_at([0, t1 - .05, t1 + .05, DUR], [18000, 18000, 260, 260], N); music = lp1(music, lp_f).astype(np.float32)
            q = P['qa']; g *= env_at([0, q - .25, q - .02, DUR], [1, 1, 0, 0], N)
            g *= env_at([0, t1 - .1, t1 + .1, DUR], [1, 1, 1.6, 1.6], N)
        if key == 'g1':  # бас за стеной до толпы
            t1 = sa('crowd'); lp_f = env_at([0, t1 - .15, t1 + .1, DUR], [240, 240, 18000, 18000], N); music = lp1(music, lp_f).astype(np.float32)
            g *= env_at([0, P['qa'] + 1.5, P['qa'] + 2.0, t1, t1 + .1, DUR], [.0, .0, 1.3, 1.3, 1, 1], N)
        if key == 'g3':
            music = lp1(music, 900).astype(np.float32); g *= .8
        if key == 'g4':
            t1 = wa(10) - .06; g *= env_at([0, t1 - .03, t1, DUR], [1.15, 1.15, 0, 0], N)
            tl = [s for s in SH if s['w'] == 'club'][-1]; g += env_at([0, tl['a'], tl['a'] + .02, tl['b'] - .02, tl['b'], DUR], [0, 0, 1.1, 1.1, 0, 0], N)
        music *= g[:, None]
    if key == 'g2':  # серое утро → перемотка → дроп на «Москва 2012»
        t1 = [s['a'] for s in SH if s['tin'] == 'flash'][0]; k = gain_to(kas(t1, 21.03 - .05), KL); n = min(len(k), N - int(t1 * SR)); music[int(t1 * SR):int(t1 * SR) + n] = k[:n]
        pre = gain_to(load(KAS, 21.03 + 30, t1), KL - 7); pre = lp1(pre, 500).astype(np.float32); n = min(len(pre), N); music[:n] += pre[:n] * env_at([0, t1 - 2.4, t1 - 2.2, t1], [1, 1, 0, 0], N)[:n, None]
    fo = int(.5 * SR); music[-fo:] *= np.linspace(1, 0, fo)[:, None]
    KD = 5.0; mix += music * (10 ** (-KD * duck / 20))[:, None]

# ---------- звуки событий ----------
for s in SH[1:]:
    tin = s['tin']; a = s['a']
    if tin in ('whip', 'whipv'): put(mix, whoosh(.3) * .14, a - .17)
    elif tin in ('dive', 'push'): put(mix, whoosh(.45, 150, 2500) * .16, a - .4); put(mix, boom(.9, 60, 32, .35), a)
    elif tin == 'flash': put(mix, boom(.8, 90, 40, .3), a); put(mix, shutter() * .6, a)
    elif tin == 'cut' and key == 'g4': put(mix, shutter() * .5, a)
def zeros_cues(i0, i1, ie):
    for j in range(6): put(mix, ding(1200 + 120 * j, .07), wa(i0) + (wb(i1) - .05 - wa(i0)) * j / 5)
    put(mix, boom(1.0, 80, 38, .45), wa(ie))
def flashes(a, b, every=.45):
    t = a + .15
    while t < b - .1: put(mix, shutter() * .35, t); t += every * (.7 + .6 * rng.random())
if key == 'dina':
    put(mix, boom(1.2, 80, 36, .5), wa(2) - .06); zeros_cues(16, 19, 21); put(mix, pop(), wa(28) + .05)
    gs = [s for s in SH if s['w'] == 'girls'][0]; flashes(gs['a'], gs['b'])
    put(mix, scratch(.75), wa(45)); put(mix, boom(1.1, 75, 36, .5), wa(55) - .04); put(mix, whoosh(.25, 2000, 8000) * .12, wa(59))
    put(mix, boom(1.2, 70, 34, .5), wa(63)); put(mix, click(.2, 1800, .35), wa(63) - .02)
if key == 'pov':
    put(mix, click(.2, 1200, .3), wa(36)); put(mix, boom(1.0, 80, 38, .3), wa(36) + .1)
    for j in range(16): put(mix, click(.05, 3000, .12), wa(50) + (wb(52) - wa(50)) * j / 15)
    put(mix, boom(1.2, 70, 34, .55), wa(53))
    t1 = sa('toilet'); q = P['qa']
    fl = lambda t: .35 + .65 * (((t + t1) * 7.3) % 1 >= .12)
    put(mix, hum(q - t1, .04, fl), t1)
    put(mix, whoosh(.5, 200, 1800) * .1, wa(63))
if key == 'nonstop':
    put(mix, scratch(wb(21) - wa(19)), wa(19))
    for j in range(5): put(mix, ding(1500 + 90 * j, .06), wa(27) + (wb(29) - wa(27)) * j / 4)
    for j in range(3): put(mix, whoosh(.5, 300, 1200) * .08, sa('street') + .2 + j * .45)
    put(mix, click(.2, 1200, .3), sa('entry') + .05); put(mix, boom(1.1, 75, 36, .5), wa(45) - .04)
if key == 'g1':
    t1 = sa('toilet', 1); t2 = sa('stl'); fl = lambda t: .35 + .65 * (((t + t1) * 7.3) % 1 >= .12)
    put(mix, hum(t2 - t1, .045, fl), t1); put(mix, thud(.35), wa(10) + .2); put(mix, click(.08, 2200, .2), wa(10) + .22)
    for s in [s for s in SH if s['w'] == 'door']:
        tt = s['a']
        while tt < s['b']: put(mix, thud(.2), tt); tt += 60 / 105.5
    put(mix, thud(.6), sa('crowd') - .05); put(mix, click(.2, 1200, .3), sa('entry') + .1)
    put(mix, ding(1700, .06), wa(37) - .05); put(mix, thud(.55), wa(57) + .62)
if key == 'g2':
    put(mix, wind(sa('numbg') - .1, .06), 0); ph = sa('phone'); pb = [s['b'] for s in SH if s['w'] == 'phone'][0]
    put(mix, ringback(.9), ph + .05); put(mix, click(.15, 900, .3), ph + .9)
    for j, i in enumerate([23, 24, 25]): put(mix, boom(.9, 80, 38, .4), wa(i) - .03)
    rw = [s for s in SH if s['w'] == 'city'][1]; put(mix, tape(rw['b'] - rw['a']), rw['a'])
    put(mix, boom(1.3, 75, 34, .55), wa(33) - .1); zeros_cues(44, 45, 47)
    gs = [s for s in SH if s['w'] == 'girls'][0]; flashes(gs['a'], gs['b'])
    put(mix, glasscrack() * .8, wa(61)); put(mix, glasscrack() * .6, wa(64)); put(mix, scratch(.4), wa(74)); put(mix, glasscrack() * .7, wa(77))
if key == 'g3':
    t = 0.3
    while t < DUR - 1: put(mix, click(.05, 4200, .05), t); t += 1.0
    put(mix, scratch(wb(24) - wa(20)), wa(20)); put(mix, thud(.35), wa(38) + .05); put(mix, pop(), wa(42))
    put(mix, drone(DUR - wa(57) + .5, .16), wa(57) - .3); put(mix, boom(1.6, 55, 28, .6), wa(65))
if key == 'g4':
    put(mix, ding(2600, .1), wa(8) + .05)
    t = wa(10)
    while t < DUR - .5: put(mix, heart(.5), t); t += 60 / 52
    put(mix, crackle(DUR), 0)

mix = np.tanh(mix * .98) / np.tanh(.98)
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', 'loudnorm=I=-14:TP=-1.0:LRA=7', '-ar', str(SR), OUT],
               input=mix.astype(np.float32).tobytes(), check=True)
print('готово', OUT, round(DUR, 2), 'с', 'без музыки' if NOMUS else '')
