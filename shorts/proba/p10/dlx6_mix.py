# «Духless» EN · звук варианта Gemini (dlx6g, 26.11), без голоса.
# «Кобальт» на карусели → треск стекла → «Кашалот» глухо за стеной → дроп на 8,8 с (спутник) →
# клуб: снаружи музыка за дверью, внутри — полная → 31,0 с глитч и плёнка останавливается → тишина, часы, гудки →
# 39,4 с струнные (ре минор), на разрезе 41,15 с — медь и литавры → в конце снова «Кобальт» (петля).
# Звуки — синтез и сэмплы VSCO 2 CE (CC0) из lemo-opuscar. Итог −14 LUFS, пик ≤ −1 дБ.
# Запуск: ~/lemo-opuscar/.venv/bin/python dlx6_mix.py <кобальт.mp3> <кашалот.mp3> <выход.wav>
import sys, os, subprocess, numpy as np
LEMO = os.environ.get('LEMO', os.path.expanduser('~/lemo-opuscar'))
sys.path.insert(0, LEMO + '/core/audio')
import sfx as X
import sampler as S
from scipy.signal import butter, sosfilt
SR = 48000; L = 48.0; N = int(L * SR)
COB, KAS, OUT = sys.argv[1:4]
KST, DROP, BEAT = 8.8, 21.03, 60 / 105.47
rng = np.random.default_rng(26)

def load(p, ss, d):
    a = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(ss), '-t', str(d), '-i', p, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout, np.float32)
    return a.reshape(-1, 2).copy()
def lufs(x):
    p = subprocess.run(['ffmpeg', '-hide_banner', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', 'ebur128', '-f', 'null', '-'], input=x.astype(np.float32).tobytes(), capture_output=True)
    for l in p.stderr.decode().splitlines()[::-1]:
        if l.strip().startswith('I:'): return float(l.split()[1])
    return -70.0
def gain_to(x, tgt): return x * 10 ** ((tgt - lufs(x)) / 20)
def sos(kind, f): return butter(4, f, kind, fs=SR, output='sos')
def filt(x, kind, f): return sosfilt(sos(kind, f), x, axis=0).astype(np.float32)
def put(buf, x, at, g=1.0, pan=0.0):
    i = int(round(at * SR))
    if x.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4); x = np.stack([x * l * 1.414, x * r * 1.414], 1)
    if i < 0: x = x[-i:]; i = 0
    n = min(len(x), len(buf) - i)
    if n > 0: buf[i:i + n] += x[:n] * g
def ramp(n, a, b): return np.linspace(a, b, n, dtype=np.float32)[:, None]
def tt(d): return np.arange(int(d * SR)) / SR

mus = np.zeros((N, 2), np.float32)   # музыка
fx = np.zeros((N, 2), np.float32)    # звуки событий

# ---- 1. «Кобальт» на карусели, обрыв на трещине ----
c = load(COB, 0, 4.1); c = gain_to(c, -14.0); n = int(4.05 * SR); c = c[:n]; c[-int(.012 * SR):] *= ramp(int(.012 * SR), 1, 0)
put(mus, c, 0)

# ---- 2. «Кашалот»: глухо с 4,66, дроп на 8,8, клуб снаружи — за дверью, обрыв на 31,0 ----
k0 = 4.66; ks = DROP - (KST - k0); k = load(KAS, ks, 31.6 - k0); k = gain_to(k, -14.5)
muff = filt(k, 'low', 380) * 1.0
tk = k0 + np.arange(len(k)) / SR
w = np.clip((tk - 8.55) / .25, 0, 1)                              # глухо → полно к дропу
w = np.where(tk >= 23.0, 1 - np.clip((tk - 23.0) / .35, 0, 1) + np.clip((tk - 25.75) / .3, 0, 1), w)   # снаружи клуба — за дверью
w = np.clip(w, 0, 1)[:, None].astype(np.float32)
km = muff * (1 - w) + k * w
km *= np.where(tk < KST, .55, 1.0)[:, None].astype(np.float32)
# обрыв на 31,0: глитч (повтор кусочка) + плёнка останавливается
cut = int((31.0 - k0) * SR); seg = km[cut - int(.06 * SR):cut].copy()
stut = np.concatenate([seg[:int(.045 * SR)]] * 4)
d = .42; pos = np.cumsum(np.linspace(1, 0, int(d * SR)) ** 1.6); src = km[cut:cut + int(d * SR) + 10]
stop = np.stack([np.interp(pos, np.arange(len(src)), src[:, ch]) for ch in range(2)], 1).astype(np.float32) * ramp(len(pos), 1, 0)
km = km[:cut]; km[:int(.004 * SR)] *= ramp(int(.004 * SR), 0, 1)
put(mus, km, k0); put(mus, stut * .9, 31.0 - .02); put(mus, stop * .8, 31.0 + len(stut) / SR - .02)

# ---- 3. оркестр: 39,4–48 ----
S.seed(7)
ev = []
for p, v, pan in [('D2', .55, 0), ('D3', .6, -.3), ('A3', .55, .25)]:
    ev.append(dict(t=39.4 - 39.4, inst='cellos' if p != 'D2' else 'contrabass', pitch=p, dur=6.2, vel=v, pan=pan, attack=1.6))
ev += [dict(t=0.6, inst='violas', pitch='F4', dur=5.6, vel=.5, pan=.3, attack=1.4), dict(t=1.0, inst='violins', pitch='A4', dur=5.2, vel=.48, pan=-.35, attack=1.6)]
cutT = 41.15 - 39.4
ev += [dict(t=cutT, inst='horn', pitch=p, dur=1.6, vel=.95, pan=pn, gain=1.2) for p, pn in [('D4', -.2), ('F4', .1), ('A4', .25)]]
ev += [dict(t=cutT, inst='trombone', pitch='D3', dur=1.8, vel=.95, pan=0, gain=1.1), dict(t=cutT, inst='tuba', pitch='D2', dur=1.8, vel=.9, pan=0)]
ev += [dict(t=cutT - .01, inst='timpani', pitch='D2', dur=2.5, vel=1.0, pan=0, gain=1.4)]
# «Would you keep the money —» → B♭; «or walk away?» → A (без разрешения — в петлю)
for t0, ch, d0 in [(45.75 - 39.4, [('Bb2', 'cellos'), ('F3', 'cellos'), ('D4', 'violas'), ('Bb4', 'violins')], .9), (46.6 - 39.4, [('A2', 'cellos'), ('E3', 'cellos'), ('C#4', 'violas'), ('A4', 'violins')], 1.5)]:
    for p, ins in ch: ev.append(dict(t=t0, inst=ins, pitch=p, dur=d0, vel=.62, pan=rng.uniform(-.4, .4), attack=.25))
orch = S.render(ev, L - 39.4 + .5, master=False)
orch = S.room(orch, size=.6, mix=.28)
orch = gain_to(orch, -15.0)
put(mus, orch, 39.4)

# ---- 4. петля: «Кобальт» снова поднимается из глухого ----
c2 = load(COB, 0, .66); c2 = filt(gain_to(load(COB, 0, 4.0), -14.0)[:len(c2)], 'low', 900) * ramp(len(c2), 0, .7)
put(mus, c2, 47.34)

# ---- 5. звуки событий ----
def glass_crack():
    o = np.zeros(int(.5 * SR))
    for j in range(9):
        a = int((j * .03 + rng.uniform(0, .02)) * SR); b = X.hp(X.noise(.03), 2500) * X.env_exp(.03, .006) * rng.uniform(.4, 1)
        o[a:a + len(b)] += b
    o[:len(X.click(1.6))] += X.click(1.6) * 1.2
    return o
def shatter():
    o = np.zeros(int(1.4 * SR)); n0 = X.hp(X.noise(1.0), 2200) * X.env_exp(1.0, .18); o[:len(n0)] += n0 * .7
    for j in range(46):
        a = int(rng.uniform(0, .75) ** 1.6 * SR); f = rng.uniform(2400, 7800); dd = rng.uniform(.05, .26); t_ = tt(dd)
        p = np.sin(2 * np.pi * f * t_) * np.exp(-t_ / (dd / 4)) * rng.uniform(.15, .45); o[a:a + len(p)] += p
    th = X.thump(.8, 58); o[:len(th)] += th * .7
    return o
def slam(v=1.0):
    t_ = tt(.9); f = 34 + 52 * np.exp(-t_ / .09); s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t_ / .3) * np.minimum(1, t_ / .003)
    s[:len(X.click(.7))] += X.click(.7) * .5
    return s * v
def riser(d):
    t_ = tt(d); n0 = X.noise(d); o = np.zeros_like(n0)
    for a in range(0, len(n0), 2400):
        fc = 300 + 7000 * (a / len(n0)) ** 2; o[a:a + 2400] = X.bp(n0[a:a + 2400], fc * .7, fc * 1.3)
    return o * (t_ / d) ** 2
def ping(f=2200, d=.12): t_ = tt(d); return np.sin(2 * np.pi * f * t_) * np.exp(-t_ / .03)
def scratch(d):
    t_ = tt(d); n0 = X.bp(X.noise(d), 1800, 6500); m = .5 + .5 * np.abs(np.sin(2 * np.pi * 7 * t_ + np.sin(2 * np.pi * 2.3 * t_)))
    return n0 * m * np.minimum(1, t_ / .02) * np.minimum(1, (d - t_) / .05) * .5
def squeak(d=.2):
    t_ = tt(d); f = 1400 + 500 * np.sin(np.pi * t_ / d); return (X.bp(X.noise(d), 900, 4000) * .5 + np.sin(2 * np.pi * np.cumsum(f) / SR) * .08) * np.sin(np.pi * t_ / d)
def stamp(): o = X.thump(1.0, 72); p = X.bp(X.noise(.12), 300, 2500) * X.env_exp(.12, .03); o = o.copy(); o[:len(p)] += p * .8; return o
def car():
    d = 1.8; t_ = tt(d); f = 70 + 25 * np.tanh((t_ - .9) * -3); s = np.sin(2 * np.pi * np.cumsum(f) / SR) * .35 + X.lp(X.noise(d), 500) * .9
    return s * np.exp(-((t_ - .9) / .45) ** 2)
def tone(fs, d): t_ = tt(d); s = sum(np.sin(2 * np.pi * f * t_) for f in fs) / len(fs); e = np.minimum(1, np.minimum(t_, d - t_) / .01); return s * e
def tick(): return X.click(1.9) * .35

put(fx, glass_crack(), 4.05, .9); put(fx, shatter(), 4.42, .85)
for t0 in (4.72, 6.3, 8.02): put(fx, slam(), t0, .95)
put(fx, X.ding(.5) if hasattr(X, 'ding') else ping(), 7.22, .35)
put(fx, riser(.9), 7.9, .5); put(fx, slam(1.1), KST, .9); put(fx, X.whoosh(.4), 8.55, .55)
for t0 in (9.3, 10.5): put(fx, ping(2100), t0, .18, .4)
put(fx, X.whoosh(.35), 11.95, .4); put(fx, X.thump(.6, 90), 12.95, .35)
for j in range(3): put(fx, X.click(1.2) * .5, 13.0 + j * .23, .5, -.2 + j * .2)
put(fx, scratch(.9), 13.3, .45, .2); put(fx, squeak(.32), 14.35, .35, -.1)
put(fx, X.whoosh(.4), 15.82, .5); put(fx, slam(.8), 16.0, .55)
for j in range(26):
    t0 = 16.55 + 1.3 * (1 - (1 - j / 26) ** 2); put(fx, tick(), t0, .55, .2)
put(fx, X.ding(.6), 17.86, .3)
put(fx, X.whoosh(.5), 18.3, .5); put(fx, X.clack(1.3), 19.9, .35, .3)
for j in range(4): put(fx, tick() * .5, 20.2 + j * .5, .5, .25)
put(fx, X.whoosh(.35), 22.83, .55); put(fx, car(), 23.0, .55, -.5)
put(fx, X.clack(1.1), 24.45, .4, .2); put(fx, X.whoosh(.5), 25.65, .45)
t0 = KST + np.ceil((26.0 - KST) / BEAT) * BEAT
for j in range(10): put(fx, X.whoosh(.25), t0 + j * BEAT * 2 - .1, .22, (-1) ** j * .5)
# 06:00
room_ = X.lp(X.noise(8.6), 400) * .012
put(fx, room_, 31.0)
for j in range(8): put(fx, tick() * .8, 31.45 + j, .6, .3)
put(fx, stamp(), 32.55, .9)
for i in range(3):
    for dd in (0, .12): put(fx, squeak(.2), 34.25 + i * .22 + dd, .35, -.3 + i * .3)
put(fx, X.whoosh(.3), 35.68, .35)
put(fx, tone([440, 480], .9), 35.95, .16); put(fx, tone([1000], .26), 36.9, .2)
put(fx, tone([440, 480], .9), 37.35, .16)
for j in range(3): put(fx, tone([480, 620], .25), 38.3 + j * .5, .14)
put(fx, X.whoosh(.5), 40.8, .55); put(fx, riser(.35) * .6, 40.8, .5)
put(fx, X.whoosh(.35), 47.3, .5)

# ---- сведение ----
mix = mus + fx
for ch in range(2): mix[:, ch] = X.limit(mix[:, ch], .9)
mix = gain_to(mix, -14.0)
for ch in range(2): mix[:, ch] = X.limit(mix[:, ch], .89)
f = int(.01 * SR); mix[-f:] *= ramp(f, 1, 0)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', 'pcm_s16le', OUT], input=mix.astype(np.float32).tobytes(), check=True)
print('готово', OUT, 'LUFS', round(lufs(mix), 1), 'пик', round(20 * np.log10(np.abs(mix).max() + 1e-9), 1))
