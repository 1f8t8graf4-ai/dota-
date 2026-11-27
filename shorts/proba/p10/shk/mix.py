#!/usr/bin/env python3
"""«Акула» RU (27.11): звук тестового ролика — голос + подложка (синтез, тёмный пульс) + звуки событий по словам.
  python3 mix.py <папка с shk.wav и shk.words.json> <выход.wav> [--nomusic]
Как у референса: под голосом всё время музыка, в паузах она на ~5 дБ тише голоса, под голосом проседает; итог −14 LUFS."""
import json, subprocess, sys
import numpy as np, soundfile as sf

SR = 48000
D, OUT = sys.argv[1:3]; NOMUS = '--nomusic' in sys.argv
J = json.load(open(f'{D}/shk.words.json')); Wd = J['words']; DUR = J['dur'] + .15; N = int(DUR * SR)
wa = lambda i: Wd[i]['a']; wb = lambda i: Wd[i]['b']
rng = np.random.default_rng(11)

def lufs(x):
    p = subprocess.run(['ffmpeg', '-hide_banner', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', 'ebur128', '-f', 'null', '-'], input=x.astype(np.float32).tobytes(), capture_output=True)
    for l in p.stderr.decode().splitlines()[::-1]:
        if l.strip().startswith('I:'): return float(l.split()[1])
    return -70.0
def st(y): return np.stack([y, y], 1) if y.ndim == 1 else y
def put(mix, y, t, g=1.0, pan=0.0):
    y = st(y) * np.array([1 - max(0, pan), 1 + min(0, pan)]); i = int(t * SR)
    if i < 0: y = y[-i:]; i = 0
    n = min(len(y), len(mix) - i)
    if n > 0: mix[i:i + n] += y[:n] * g
def bp(x, lo=0, hi=1e9):
    X = np.fft.rfft(x, axis=0); f = np.fft.rfftfreq(len(x), 1 / SR); m = ((f >= lo) & (f <= hi)).astype(float)
    return np.fft.irfft(X * (m[:, None] if x.ndim > 1 else m), len(x), axis=0)
def nz(d): return rng.standard_normal(int(d * SR))
def tt(d): return np.arange(int(d * SR)) / SR
def norm(y, a=1.0): return a * y / (np.abs(y).max() + 1e-9)

# ---------- звуки ----------
def whoosh(d=.35, lo=200, hi=3000, a=.5):
    m = int(d * SR); x = rng.standard_normal(m); X = np.fft.rfft(x); fq = np.fft.rfftfreq(m, 1 / SR); out = np.zeros(m); seg = 10; ln = m // seg
    for j in range(seg):
        cen = lo * ((hi / lo) ** (j / (seg - 1))); w = np.exp(-.5 * ((np.log(fq + 1) - np.log(cen)) / .5) ** 2)
        out[j * ln:(j + 1) * ln] = np.fft.irfft(X * w, m)[j * ln:(j + 1) * ln]
    u = np.linspace(0, 1, m); out *= np.sin(np.pi * np.clip(u / .7, 0, 1) * .5) * np.clip((1 - u) / .3, 0, 1)
    return norm(out, a)
def thud(a=.6, f=60):
    t = tt(.4); y = np.sin(2 * np.pi * np.cumsum(f + 90 * np.exp(-t / .02)) / SR) * np.exp(-t / .08) + .3 * bp(nz(.4), 200, 2000) * np.exp(-t / .015)
    return norm(y, a)
def boom(d=1.4, f0=70, f1=34, a=.9):
    t = tt(d); fr = f1 + (f0 - f1) * np.exp(-t / .18); y = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t / .45) * np.minimum(1, t / .004)
    return norm(y + .3 * bp(nz(d) * np.exp(-t / .02), 150, 3000), a)
def punch(a=.9):
    t = tt(.5); body = np.sin(2 * np.pi * np.cumsum(55 + 140 * np.exp(-t / .015)) / SR) * np.exp(-t / .09)
    crack = bp(nz(.5), 900, 6000) * np.exp(-t / .012); wet = bp(nz(.5), 100, 900) * np.exp(-t / .12) * .5
    return norm(body + .7 * crack + wet, a)
def splash(d=.5, a=.4):
    t = tt(d); y = bp(nz(d), 700, 9000) * (np.exp(-t / .08) + .3 * np.exp(-t / .25)) * np.minimum(1, t / .01)
    return norm(y, a)
def stamp(a=.35):
    t = tt(.25); y = bp(nz(.25), 300, 4000) * np.exp(-t / .02) + .7 * np.sin(2 * np.pi * 120 * t) * np.exp(-t / .05); return norm(y, a)
def ping(f=880, a=.18):
    t = tt(.9); y = (np.sin(2 * np.pi * f * t) + .4 * np.sin(2 * np.pi * f * 2.01 * t)) * np.exp(-t / .25) * np.minimum(1, t / .004); return norm(y, a)
def heart(a=.6):
    y = np.zeros(int(.6 * SR)); b = thud(a, 48); y[:len(b)] += b; j = int(.2 * SR); c = thud(a * .7, 48); y[j:j + len(c)] += c[:len(y) - j]; return bp(y, 20, 300)
def sonar(a=.22):
    t = tt(1.0); y = np.sin(2 * np.pi * 220 * t) * np.exp(-t / .3) * np.minimum(1, t / .01); return norm(bp(y + .2 * np.sin(2 * np.pi * 330 * t) * np.exp(-t / .2), 100, 1500), a)
def creak(d=.6, a=.18):
    t = tt(d); f = 140 + 60 * np.sin(2 * np.pi * 9 * t); y = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * (.5 + .5 * np.sin(2 * np.pi * 23 * t))
    return norm(bp(y, 300, 3000) * np.minimum(1, t / .05) * np.minimum(1, (d - t) / .1), a)
def tick(a=.12):
    t = tt(.05); return norm(bp(nz(.05), 2500, 9000) * np.exp(-t / .004) + .5 * np.sin(2 * np.pi * 3100 * t) * np.exp(-t / .01), a)
def tone(f1, f2, d=.16, a=.08):
    t = tt(d); return a * (np.sin(2 * np.pi * f1 * t) + np.sin(2 * np.pi * f2 * t)) / 2 * np.minimum(1, t / .005) * np.minimum(1, (d - t) / .01)
def ringback(d, a=.08):
    t = tt(d); on = (t % 3.0) < 1.0; return bp(np.sin(2 * np.pi * 425 * t) * on * a, 300, 3400)
def siren(d, a=.05):
    t = tt(d); f = 760 + 220 * np.sin(2 * np.pi * .55 * t); y = np.sin(2 * np.pi * np.cumsum(f) / SR); return bp(y, 400, 2500) * a * np.minimum(1, t / 1.0)
def surf(d, a=.12):   # прибой: волна каждые ~4,5 с
    t = tt(d); x = bp(nz(d), 150, 3500); e = .35 + .65 * np.clip(np.sin(2 * np.pi * t / 4.5) ** 4, 0, 1); return norm(x * e, a)
def underwater(d, a=.1):
    t = tt(d); x = bp(nz(d), 40, 420); x *= .6 + .4 * np.sin(2 * np.pi * .21 * t) ** 2; return norm(x, a)

# ---------- голос ----------
v, vsr = sf.read(f'{D}/shk.wav')
if v.ndim > 1: v = v.mean(1)
v = np.interp(np.arange(int(len(v) * SR / vsr)) / SR, np.arange(len(v)) / vsr, v)
v = bp(v, 85, 12000)
# лёгкий компрессор: выравниваем громкость по 20-мс окнам
w = int(.02 * SR); e = np.sqrt(np.convolve(v ** 2, np.ones(w) / w, 'same')) + 1e-5; g = np.clip((.12 / e) ** .45, .5, 2.2); g = np.convolve(g, np.ones(w * 3) / (w * 3), 'same'); v = v * g
V = np.zeros((N, 2)); V[:min(N, len(v))] = st(v[:N])
venv = np.convolve(np.abs(v), np.ones(int(.12 * SR)) / int(.12 * SR), 'same'); venv = venv / (np.percentile(venv, 95) + 1e-9)
venv = np.clip(np.pad(venv, (0, max(0, N - len(venv))))[:N], 0, 1)

# ---------- подложка: тёмный пульс 96 BPM ----------
def bed():
    t = np.arange(N) / SR; B = 60 / 96
    dr = sum(np.sin(2 * np.pi * f * t + ph) * a for f, ph, a in [(41.2, 0, 1), (61.7, 1, .5), (82.4, 2, .35)]) / 1.8
    # напряжение: растёт к удару, после «она уходит» тише, с кровью снова
    T = [0, wa(9), wa(91), wa(118), wa(120), wa(130), wa(173), DUR]; Vv = [.55, .7, 1.0, .9, .45, .8, 1.0, 1.0]
    ten = np.interp(t, T, Vv)
    kick = np.zeros(N); kk = thud(.9, 42)
    for k in range(int(DUR / B) + 1):
        tb = k * B
        if tb > wa(118) and tb < wa(130) and k % 2: continue
        i = int(tb * SR); n = min(len(kk), N - i)
        if n > 0: kick[i:i + n] += kk[:n] * (1 if k % 4 == 0 else .55)
    pad = bp(nz(DUR)[:N], 300, 900) * .25 * (.5 + .5 * np.sin(2 * np.pi * t / (B * 8)) ** 2)
    hat = np.zeros(N)
    for k in range(int(DUR / (B / 2)) + 1):
        tb = k * B / 2 + B / 4
        if tb < wa(29) or (wa(118) < tb < wa(130)): continue
        h = tick(.05); i = int(tb * SR); n = min(len(h), N - i)
        if n > 0: hat[i:i + n] += h[:n]
    y = (dr * .55 + kick * .8 + pad + hat * .6) * ten
    y[:int(.02 * SR)] *= np.linspace(0, 1, int(.02 * SR))
    return st(bp(y, 30, 6000))
M = np.zeros((N, 2)) if NOMUS else bed()

# ---------- звуки событий ----------
F = np.zeros((N, 2))
put(F, underwater(wa(120)), 0, .9); put(F, surf(DUR - wa(120)), wa(120), .8)
put(F, thud(.9, 50), wa(9) - .02, 1.0); put(F, boom(1.0, 60, 30, .6), wa(9), .8)
put(F, whoosh(1.4, 60, 500, .5), wa(17) - .1, .9)
put(F, whoosh(.3, 400, 4000, .35), wa(23) - .05)
for k in range(7): put(F, splash(.4, .3), wa(29) + .15 + k * .42, .8, pan=(-.3 if k % 2 else .3))
put(F, stamp(), wa(31))
for k in range(4): put(F, sonar(.2), wa(39) + k * .65)
put(F, whoosh(2.0, 40, 300, .45), wa(46))
put(F, whoosh(.3, 400, 4000, .35), wa(49) - .05)
for k in range(int((wa(115) - wa(57)) / .85)): put(F, heart(.55), wa(57) + k * .85, .7)
put(F, whoosh(1.6, 50, 400, .4), wa(61))
put(F, ping(1046, .12), wa(65) + .1)
put(F, whoosh(.3, 400, 4000, .35), wa(71) - .05); put(F, stamp(), wa(75))
for k in range(3): put(F, whoosh(.9, 80, 900, .3), wa(79) + k * 1.0, pan=(-.4 if k % 2 else .4))
put(F, boom(1.4, 80, 32, .9), wa(91) - .05); put(F, whoosh(1.2, 80, 1200, .4), wa(91))
put(F, stamp(), wa(99)); put(F, ping(784, .12), wa(106)); put(F, ping(784, .12), wa(110)); put(F, stamp(), wa(112) + .2)
put(F, punch(1.0), wa(115) - .02); put(F, punch(1.0), wa(116) + .05); put(F, whoosh(.8, 60, 900, .5), wa(118))
put(F, whoosh(.3, 400, 4000, .35), wa(120) - .05)
put(F, thud(.8, 45), wa(128) + .32); put(F, bp(nz(.4), 500, 5000) * np.exp(-tt(.4) / .06) * .25, wa(128) + .34)
for k in range(int((wa(137) - wa(130)) / .5)): put(F, heart(.7), wa(130) + k * .5, .8)
put(F, boom(1.6, 55, 28, .8), wa(137)); put(F, stamp(), wa(146))
put(F, creak(.7, .2), wa(158)); put(F, creak(.5, .16), wa(158) + .8)
for k in range(5): put(F, tick(.1), wa(163) + k * .5)
for k, (f1, f2) in enumerate([(697, 1209), (697, 1209), (697, 1336)]): put(F, tone(f1, f2), wa(165) + .05 + k * .2)
put(F, ringback(wa(168) - wa(165) - .7), wa(165) + .7); put(F, siren(DUR - wa(168)), wa(168), .9)
for k in range(28): put(F, tick(.09), wa(170) + 1.4 * (k / 28) ** .7)
put(F, whoosh(.3, 400, 4000, .35), wa(170) - .05)
for k in range(int((DUR - wa(173)) / .95)): put(F, heart(.75), wa(173) + k * .95, .9)
put(F, whoosh(2.5, 40, 200, .5), wa(177)); put(F, boom(1.2, 50, 30, .5), wa(186))

# ---------- сведение ----------
def lv(x, t): return x * 10 ** ((t - lufs(x)) / 20) if np.abs(x).max() > 0 else x
Vn = lv(V, -16.0); Fn = lv(F, -27.0)
if not NOMUS:
    Mn = lv(M, -23.5); duck = 10 ** ((-6.0 * np.convolve(venv, np.ones(int(.15 * SR)) / int(.15 * SR), 'same')) / 20); Mn = Mn * duck[:, None]
else: Mn = M
mix = Vn + Fn + Mn
tail = int(.12 * SR); mix[-tail:] *= np.linspace(1, 0, tail)[:, None]
mix = lv(mix, -14.0)
if np.abs(mix).max() > .89:   # пики ударов — лимитером, а не общей громкостью
    r = subprocess.run(['ffmpeg', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', 'alimiter=limit=0.89:attack=3:release=80:level=disabled', '-f', 'f32le', '-'],
                       input=mix.astype(np.float32).tobytes(), capture_output=True, check=True)
    mix = np.frombuffer(r.stdout, np.float32).reshape(-1, 2)[:N].copy()
sf.write(OUT, mix.astype(np.float32), SR, subtype='PCM_24')
print(OUT, 'LUFS', round(lufs(mix), 1), 'пик', round(20 * np.log10(np.abs(mix).max()), 1), 'дБ')
