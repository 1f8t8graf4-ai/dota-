#!/usr/bin/env python3
"""Звук «Твоими глазами» v6 (27.11): голос васяна + голос Макса из фильма + «Кашалот» + звуки событий (синтез), −14 LUFS.
  python3 pov10/mix.py pov10 <папка голосов> <кашалот.mp3> <выход.wav> [--nomusic]
В папке: pov10.wav, pov10.plan.json (dlx8/plan.mjs pov10 pov10), max.wav (голос Макса из my-skills — в публичные репо не класть).
Музыка по сюжету: переговорная — глухо, «Вниз» — дроп, туалет — бас через стену, больница — тихо, цитата Макса — тишина,
«рушится» — обрыв, звонок — гудки и тишина, ночь — клуб, «провал» — обрыв, реанимация — монитор, финал — только дождь."""
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

def sniff():
    y = np.zeros(int(.7 * SR))
    for t0, d in [(0, .16), (.24, .22)]:
        n = int(d * SR); x = fft_filt(rng.standard_normal(n), 1800, 7000); e = np.sin(np.pi * np.arange(n) / n) ** 1.5; j = int(t0 * SR); y[j:j + n] += x * e
    return .5 * y / np.abs(y).max()
def siren(d, a=.08):
    t = np.arange(int(d * SR)) / SR; f = 760 + 220 * np.sin(2 * np.pi * t / 1.1); ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(ph) + .4 * np.sin(2 * ph) + .2 * np.sin(3 * ph); y = fft_filt(y, 400, 3500); y *= np.minimum(1, t / .3) * np.minimum(1, (d - t) / .4); return a * y / np.abs(y).max()
def steps(d, rate=3.2, a=.25):
    y = np.zeros(int(d * SR)); t = 0.0
    while t < d - .2:
        s = thud(a) ; s = fft_filt(s, 120, 3000); j = int(t * SR); n = min(len(s), len(y) - j); y[j:j + n] += s[:n]; t += 1 / rate * (.9 + .2 * rng.random())
    return y
def honk(a=.35):
    t = np.arange(int(.42 * SR)) / SR; f = np.where(t < .2, 420, 520) * (1 + .02 * np.sin(2 * np.pi * 28 * t))
    ph = 2 * np.pi * np.cumsum(f) / SR; y = np.sign(np.sin(ph)) * .5 + np.sin(ph); y = fft_filt(y, 300, 4000) * np.minimum(1, t / .02) * np.minimum(1, (.42 - t) / .05); return a * y / np.abs(y).max()
def zipper(d=.5):
    y = np.zeros(int(d * SR)); n = int(d * 60)
    for k in range(n):
        j = int(k / n * (len(y) - 300)); y[j:j + 300] += fft_filt(rng.standard_normal(300), 2500, 9000) * np.exp(-np.arange(300) / 40)
    return .2 * y / np.abs(y).max()
def flutter(d=1.0, a=.18):
    t = np.arange(int(d * SR)) / SR; x = fft_filt(rng.standard_normal(len(t)), 150, 1800); e = (np.sin(2 * np.pi * 13 * t) > .3) * np.exp(-t / .5)
    return a * x * e / (np.abs(x).max() + 1e-9)
def beep(f=1046, d=.12, a=.12):
    t = np.arange(int(d * SR)) / SR; return a * np.sin(2 * np.pi * f * t) * np.minimum(1, t / .005) * np.minimum(1, (d - t) / .01)
def rainn(d, a=.06):
    x = fft_filt(rng.standard_normal(int(d * SR)), 600, 9000); x /= np.abs(x).max() + 1e-9; y = x * a
    for k in range(int(d * 30)):
        j = int(rng.random() * (len(y) - 600)); y[j:j + 600] += fft_filt(rng.standard_normal(600), 2000, 9000) * np.exp(-np.arange(600) / 70) * a * 2.5 * rng.random()
    return y
def crowd(d, a=.05):
    t = np.arange(int(d * SR)) / SR; x = fft_filt(rng.standard_normal(len(t)), 250, 2600); x *= .6 + .4 * np.sin(2 * np.pi * 1.7 * t + 3 * np.sin(2 * np.pi * .4 * t)); return a * x / np.abs(x).max()
def chirp(a=.05):
    t = np.arange(int(.18 * SR)) / SR; f = 3200 + 1500 * np.sin(2 * np.pi * 9 * t); return a * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / .18)
def pad(d, a=.05):
    t = np.arange(int(d * SR)) / SR; y = sum(np.sin(2 * np.pi * f * t) for f in [220, 277.2, 329.6, 440]) / 4
    return a * y * np.minimum(1, t / 1.2) * np.minimum(1, (d - t) / 1.2)
def idx(s, f=0):
    for i in range(f, len(W)):
        if W[i]['w'].lower().strip('«»"').strip('.,:;!?…—').startswith(s): return i
    raise SystemExit('нет слова ' + s)
SH = P['shots']; sa = lambda w, n=0: [s['a'] for s in SH if s['w'] == w][n]; sb = lambda w, n=-1: [s['b'] for s in SH if s['w'] == w][n]
MQ = P['maxq']

mix = np.zeros((N, 2), np.float32)
# ---------- голос ----------
v = gain_to(st(load(f'{D}/{key}.wav', ch=1)[:, 0]), -16.0); put(mix, v, 0)
venv = np.zeros(N); e = np.sqrt(np.convolve(v[:, 0] ** 2, np.ones(1440) / 1440, 'same')); n = min(len(e), N); venv[:n] = e[:n]
mq = gain_to(st(load(f'{D}/max.wav', ch=1)[:, 0]), -15.0); a_ = np.abs(mq[:, 0]); on = int(np.argmax(a_ > a_.max() * .06)); mq = mq[max(0, on - int(.03 * SR)):]; mq = room(mq, .22)
put(mix, mq, MQ['a']); e = np.sqrt(np.convolve(mq[:, 0] ** 2, np.ones(1440) / 1440, 'same')); j = int(MQ['a'] * SR); n = min(len(e), N - j); venv[j:j + n] = np.maximum(venv[j:j + n], e[:n])
thr = np.percentile(venv[venv > 1e-4], 30); act = np.clip(venv / thr, 0, 1); duck = np.zeros(N); s = 0.0
aa, ar = 1 - np.exp(-1 / (.015 * SR)), 1 - np.exp(-1 / (.25 * SR))
for k in range(N): x = act[k]; s += (x - s) * (aa if x > s else ar); duck[k] = s

# ---------- музыка ----------
T_DOWN = sa('p_lift'); T_WC = sa('p_wc'); T_YU = sa('p_yulia'); T_EYES = sa('p_yulia', 1); T_CAR = sa('p_car'); T_ST = sa('p_station')
T_CRASH = wa(idx('рушится')); T_PH_OFF = wa(idx('экран')); T_NIGHT = sa('p_night'); T_FAIL = wa(idx('провал')); T_MORN = sa('p_morning')
music = np.zeros((N, 2), np.float32); KL = -16.5
if not NOMUS:
    k = gain_to(load(KAS, 21.03 - T_DOWN, DUR + 1), KL); n = min(len(k), N); music[:n] = k[:n]   # дроп ровно на «Вниз»
    lpf = env_at([0, T_DOWN - .05, T_DOWN, T_WC - .05, T_WC + .05, T_YU - .05, T_YU + .05, T_EYES, T_EYES + .3, T_CAR, T_CAR + .3, T_CRASH, DUR],
                 [1100, 1100, 18000, 18000, 260, 260, 18000, 18000, 1500, 1500, 900, 900, 900], N)
    music = lp1(music, lpf).astype(np.float32)
    g = env_at([0, T_DOWN - .05, T_DOWN, T_WC - .05, T_WC + .05, T_YU - .05, T_YU + .05, T_EYES, T_EYES + .3, T_CAR, T_CAR + .3, T_ST, T_ST + .3, MQ['a'] - .3, MQ['a'] - .05, MQ['b'] + .3, MQ['b'] + .8, T_CRASH - .02, T_CRASH, DUR],
               [.75, .75, 1.0, 1.0, 1.7, 1.7, 1.0, 1.0, .65, .65, .55, .55, .6, .6, 0, 0, .45, .45, 0, 0], N)
    # ночь: клуб снова, обрыв на «провал»
    g += env_at([0, T_NIGHT - .02, T_NIGHT, T_FAIL - .02, T_FAIL, DUR], [0, 0, .9, .9, 0, 0], N)
    music *= g[:, None]
    # второй акт: глухой пульс «Кашалота» после обрыва
    k2 = gain_to(load(KAS, 21.03 + 40, DUR), KL - 5); k2 = lp1(k2, 320).astype(np.float32); n = min(len(k2), N)
    g2 = env_at([0, T_CRASH + 1.6, T_CRASH + 2.6, T_PH_OFF - .3, T_PH_OFF + .2, DUR], [0, 0, 1, 1, 0, 0], N); music[:n] += k2[:n] * g2[:n, None]
    fo = int(.5 * SR); music[-fo:] *= np.linspace(1, 0, fo)[:, None]
    KD = 5.0; mix += music * (10 ** (-KD * duck / 20))[:, None]

# ---------- переходы ----------
for s_ in SH[1:]:
    tin = s_['tin']; a = s_['a']
    if tin in ('whip', 'whipv'): put(mix, whoosh(.3) * .13, a - .17)
    elif tin in ('dive', 'push'): put(mix, whoosh(.45, 150, 2500) * .14, a - .4); put(mix, boom(.9, 60, 32, .28), a)
    elif tin == 'flash': put(mix, boom(.8, 90, 40, .28), a); put(mix, shutter() * .5, a)
# ---------- события ----------
put(mix, boom(1.3, 70, 32, .55), T_DOWN)                                   # дроп
put(mix, ding(1318, .1), sb('p_lift') - .25); put(mix, ding(1046, .08), sb('p_lift') - .05)
put(mix, crowd(sb('p_entry') - sa('p_tver'), .04), sa('p_tver'))           # улица и толпа у входа
put(mix, click(.2, 1200, .3), sa('p_entry') + .4)
for nm, i0, i1 in [('ручкой', 'тянешься', 'ручкой'), ('вадима', 'вадима', 'вадима')]:
    t0 = wb(idx(i1)) - .2 if nm == 'ручкой' else wa(idx(i0)); put(mix, scratch(.7), t0)
fl = lambda t: .35 + .65 * (((t + T_WC) * 7.3) % 1 >= .12); put(mix, hum(T_YU - T_WC, .035, fl), T_WC)
put(mix, sniff(), wa(idx('и', 82)) - .05)
put(mix, beep(1800, .08, .08), sa('p_action') + .05)                         # REC
put(mix, siren(sb('p_run') - wa(idx('мигалки')) + .3, .07), wa(idx('мигалки')))
put(mix, steps(sb('p_run') - sa('p_run'), 3.4, .22), sa('p_run'))
put(mix, wind(sb('p_car') - T_CAR, .03), T_CAR)
put(mix, honk(.3), wb(idx('клоуна')) - .1)
put(mix, boom(1.6, 55, 26, .6), T_CRASH); put(mix, glasscrack() * .8, T_CRASH + .05); put(mix, glasscrack() * .5, T_CRASH + .45)
put(mix, thud(.45), wa(idx('полигон'))); put(mix, scratch(.4), wa(idx('твоя')))
put(mix, boom(1.0, 70, 34, .45), wa(idx('уволены')))
put(mix, thud(.6), sa('p_empty', 3) + .05)                                 # сумка денег на пол
put(mix, ringback(wa(idx('экран')) - wa(idx('гудки')) + .2), wa(idx('гудки')) - .05)
put(mix, click(.12, 900, .3), T_PH_OFF + .1)
put(mix, fft_filt(boom(1.2, 90, 40, .5), 20, 600), wa(idx('хлопок')) - .05); put(mix, flutter(1.2, .16), wa(idx('хлопок')) + .15)
put(mix, zipper(.45), sa('p_bag') + .2)
put(mix, hum(sb('p_bag', 1) - sa('p_bag'), .02), sa('p_bag'))
t = T_NIGHT
while t < T_FAIL: put(mix, thud(.25), t); t += 60 / 105.5
put(mix, boom(1.0, 50, 26, .4), T_FAIL)
for k_ in range(5): put(mix, chirp(.04), T_MORN + .3 + k_ * .35 + .1 * rng.random())
tI = sa('p_icu'); tL = wa(idx('опоздал')) + .2; put(mix, hum(sb('p_icu') - tI, .02), tI); t = tI + .2
while t < tL: put(mix, beep(1046, .1, .07), t); t += .85
put(mix, pad(sb('p_give') - sa('p_give') + 1, .035), sa('p_give'))
put(mix, thud(.4), sa('p_give') + .55)
put(mix, rainn(DUR - sa('p_alone'), .05), sa('p_alone'))
put(mix, heart(.35), wa(idx('тишина')) + .1)

mix = np.tanh(mix * .98) / np.tanh(.98)
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', 'loudnorm=I=-14:TP=-1.0:LRA=9', '-ar', str(SR), OUT],
               input=mix.astype(np.float32).tobytes(), check=True)
print('готово', OUT, round(DUR, 2), 'с', 'без музыки' if NOMUS else '')
