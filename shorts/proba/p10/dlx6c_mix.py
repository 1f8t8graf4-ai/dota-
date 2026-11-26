# «Духless» EN · звук моего варианта (dlx6c, бумажный театр, 26.11), без голоса.
# «Кобальт» на карусели → театр: пиццикато струнных и кларнет (105,5 BPM, как «Кашалот») →
# у клуба музыка глухо за дверью, канат снимают на 23,2 с — дроп «Кашалота» → обрыв пластинкой на щите (33,8 с) →
# литавры, штамп, дверь падает → дождь, гудки, автоответчик, входящий звонок → струнные и рояль, бумага рвётся,
# занавес и короткие аплодисменты → «Кобальт» снова (петля). Сэмплы VSCO 2 CE (CC0) из lemo-opuscar. −14 LUFS.
# Запуск: ~/lemo-opuscar/.venv/bin/python dlx6c_mix.py <кобальт.mp3> <кашалот.mp3> <выход.wav>
import sys, os, subprocess, numpy as np
LEMO = os.environ.get('LEMO', os.path.expanduser('~/lemo-opuscar'))
sys.path.insert(0, LEMO + '/core/audio')
import sfx as X
import sampler as S
from scipy.signal import butter, sosfilt
SR = 48000; L = 55.0; N = int(L * SR)
COB, KAS, OUT = sys.argv[1:4]
DROP, BEAT, KD = 21.03, 60 / 105.47, 23.2     # дроп «Кашалота» встаёт на снятый канат
rng = np.random.default_rng(31)

def load(p, ss, d):
    a = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(ss), '-t', str(d), '-i', p, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout, np.float32)
    return a.reshape(-1, 2).copy()
def lufs(x):
    p = subprocess.run(['ffmpeg', '-hide_banner', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', 'ebur128', '-f', 'null', '-'], input=x.astype(np.float32).tobytes(), capture_output=True)
    for l in p.stderr.decode().splitlines()[::-1]:
        if l.strip().startswith('I:'): return float(l.split()[1])
    return -70.0
def gain_to(x, tgt): return x * 10 ** ((tgt - lufs(x)) / 20)
def filt(x, kind, f): return sosfilt(butter(4, f, kind, fs=SR, output='sos'), x, axis=0).astype(np.float32)
def put(buf, x, at, g=1.0, pan=0.0):
    i = int(round(at * SR))
    if x.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4); x = np.stack([x * l * 1.414, x * r * 1.414], 1)
    if i < 0: x = x[-i:]; i = 0
    n = min(len(x), len(buf) - i)
    if n > 0: buf[i:i + n] += x[:n] * g
def ramp(n, a, b): return np.linspace(a, b, n, dtype=np.float32)[:, None]
def tt(d): return np.arange(int(d * SR)) / SR

mus = np.zeros((N, 2), np.float32); fx = np.zeros((N, 2), np.float32)

# ---- «Кобальт» ----
c = gain_to(load(COB, 0, 4.1), -14.0); n = int(4.05 * SR); c = c[:n]; c[-int(.012 * SR):] *= ramp(int(.012 * SR), 1, 0); put(mus, c, 0)

# ---- театр: пиццикато 4,25–21,3 ----
S.seed(11)
B0 = 4.25; bars = 8
prog = [('D', ['D3', 'A3', 'D4', 'F4']), ('D', ['D3', 'A3', 'D4', 'F4']), ('Bb', ['Bb2', 'F3', 'D4', 'F4']), ('Bb', ['Bb2', 'F3', 'D4', 'F4']),
        ('G', ['G2', 'D3', 'Bb3', 'D4']), ('G', ['G2', 'D3', 'Bb3', 'D4']), ('A', ['A2', 'E3', 'C#4', 'E4']), ('A', ['A2', 'E3', 'C#4', 'E4'])]
mel = {2: [('A4', 0), ('Bb4', 1), ('A4', 1.5), ('F4', 2), ('E4', 3)], 3: [('D4', 0), ('F4', 1), ('A4', 2)],
       6: [('E4', 0), ('F4', 1), ('G4', 1.5), ('A4', 2), ('C#5', 3)], 7: [('D5', 0), ('A4', 2)]}
ev = []
for b in range(bars):
    t0 = b * 4 * BEAT; root = prog[b][1][0]; tones = prog[b][1]
    for k in (0, 2): ev.append(dict(t=t0 + k * BEAT, inst='cellos_pizz', pitch=root, dur=.4, vel=.85, pan=-.25))
    for k in (1.5, 3.5): ev.append(dict(t=t0 + k * BEAT, inst='violins_pizz', pitch=tones[2 + int(k) % 2], dur=.3, vel=.6, pan=.35))
    if b >= 2:
        for k in (1, 3): ev.append(dict(t=t0 + k * BEAT, inst='violas_pizz', pitch=tones[1], dur=.3, vel=.5, pan=.1))
    if b in mel:
        for p, k in mel[b]: ev.append(dict(t=t0 + k * BEAT, inst='clarinet_stac', pitch=p, dur=.35, vel=.62, pan=.0))
    if b % 2 == 0: ev.append(dict(t=t0, inst='timpani', pitch='D2' if root[0] in 'DA' else 'G2', dur=1.2, vel=.35, pan=0, gain=.8))
# пять нулей — колокольчики по одному (11,3 + i·0,2 + 0,25)
for i, p in enumerate(['A5', 'D6', 'E6', 'F6', 'G6', 'A6']): ev.append(dict(t=(11.3 if i == 0 else 11.55 + i * .2) + .25 - B0, inst='glockenspiel', pitch=p, dur=1.0, vel=.55, pan=-.4 + i * .16))
th = S.render(ev, 21.6 - B0, master=False); th = S.room(th, size=.35, mix=.18); th = gain_to(th, -16.5)
f = int(.5 * SR); th[-f:] *= ramp(f, 1, 0); put(mus, th, B0)

# ---- «Кашалот»: глухо с 21,3, дроп на 23,2, обрыв на 33,8 ----
k0 = 21.0; ks = DROP - (KD - k0); k = gain_to(load(KAS, ks, 34.4 - k0), -14.5)
muff = filt(k, 'low', 420); tk = k0 + np.arange(len(k)) / SR
w = np.clip((tk - (KD - .12)) / .12, 0, 1)[:, None].astype(np.float32)
km = muff * (1 - w) * .8 + k * w
km[:int(.6 * SR)] *= ramp(int(.6 * SR), 0, 1)
# активисты (29,3–33,8): музыка уходит за стену
wa = np.clip((tk - 29.0) / .5, 0, 1)[:, None].astype(np.float32); km = km * (1 - wa) + filt(km, 'low', 600) * wa * .6
cut = int((33.8 - k0) * SR); d = .5; pos = np.cumsum(np.linspace(1, 0, int(d * SR)) ** 1.4); src = km[cut:cut + int(d * SR) + 10]
stop = np.stack([np.interp(pos, np.arange(len(src)), src[:, ch]) for ch in range(2)], 1).astype(np.float32) * ramp(len(pos), 1, 0)
km = km[:cut]; put(mus, km, k0); put(mus, stop * .85, 33.8)

# ---- финал: струнные и рояль 47,6–55 ----
S.seed(5)
ev = []
for t0, chord, dur in [(0, ['D2', 'A2', 'D3', 'F3', 'A3'], 2.5), (2.4, ['F2', 'C3', 'F3', 'A3', 'C4'], 2.4), (4.7, ['Bb1', 'F2', 'Bb2', 'D3', 'F3'], 2.6)]:
    for j, p in enumerate(chord):
        ins = 'contrabass' if j == 0 else ('cellos' if j < 3 else 'violas')
        ev.append(dict(t=t0, inst=ins, pitch=p, dur=dur, vel=.55, pan=-.3 + j * .15, attack=.6))
for t0, p in [(.8, 'A4'), (1.6, 'D5'), (2.4, 'C5'), (3.2, 'A4'), (4.0, 'F4'), (4.8, 'D5'), (5.6, 'C5')]:
    ev.append(dict(t=t0, inst='upright', pitch=p, dur=1.2, vel=.45, pan=.2))
ev.append(dict(t=4.7, inst='violins', pitch='D5', dur=2.6, vel=.5, pan=-.2, attack=.9))
fin = S.render(ev, 55.4 - 47.6, master=False); fin = S.room(fin, size=.55, mix=.26); fin = gain_to(fin, -16.0)
f = int(.6 * SR); fin[-f:] *= ramp(f, 1, 0); put(mus, fin, 47.6)
c2 = filt(gain_to(load(COB, 0, 4.0), -14.0)[:int(.56 * SR)], 'low', 1200) * ramp(int(.56 * SR), 0, .8); put(mus, c2, 54.44)

# ---- звуки ----
def slam(v=1.0):
    t_ = tt(.9); fr = 34 + 52 * np.exp(-t_ / .09); s = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t_ / .3) * np.minimum(1, t_ / .003); s[:len(X.click(.7))] += X.click(.7) * .5; return s * v
def paper(d=.25, v=1.0):
    t_ = tt(d); return X.bp(X.noise(d), 1200, 7000) * np.sin(np.pi * t_ / d) ** 2 * (.6 + .4 * np.sin(2 * np.pi * 31 * t_)) * v
def scratch(d):
    t_ = tt(d); n0 = X.bp(X.noise(d), 1800, 6500); m = .5 + .5 * np.abs(np.sin(2 * np.pi * 7 * t_ + np.sin(2 * np.pi * 2.3 * t_))); return n0 * m * np.minimum(1, t_ / .02) * np.minimum(1, (d - t_) / .05) * .5
def stamp(): o = X.thump(1.0, 72).copy(); p = X.bp(X.noise(.12), 300, 2500) * X.env_exp(.12, .03); o[:len(p)] += p * .8; return o
def tone(fs, d): t_ = tt(d); s = sum(np.sin(2 * np.pi * fq * t_) for fq in fs) / len(fs); return s * np.minimum(1, np.minimum(t_, d - t_) / .01)
def tear(d=.7):
    t_ = tt(d); n0 = X.bp(X.noise(d), 600, 6000); g = np.zeros_like(t_)
    for j in range(60): a = int(rng.uniform(0, d - .02) * SR); g[a:a + int(.006 * SR)] += rng.uniform(.4, 1)
    from scipy.ndimage import uniform_filter1d
    return n0 * (uniform_filter1d(g, 200) * 6 + .15) * np.sin(np.pi * t_ / d) * .6
def scratch_rec():
    d = .45; t_ = tt(d); fr = 300 + 2200 * np.abs(np.sin(2 * np.pi * 3.2 * t_)); s = X.bp(X.noise(d), 400, 4000) * .6 + np.sin(2 * np.pi * np.cumsum(fr) / SR) * .15; return s * np.sin(np.pi * t_ / d)
def applause(d=1.4):
    o = np.zeros(int(d * SR))
    for j in range(260):
        a = int(rng.uniform(0, d - .05) * SR); cl = X.bp(X.noise(.03), rng.uniform(800, 1600), 4500) * X.env_exp(.03, .006) * rng.uniform(.3, 1); o[a:a + len(cl)] += cl
    return o * np.minimum(1, tt(d)[:len(o)] / .2) * np.minimum(1, (d - tt(d)[:len(o)]) / .5) * .35
def marimba_ring():
    o = np.zeros(int(1.6 * SR))
    for j, p in enumerate(['E5', 'G5', 'C6', 'G5', 'E5', 'G5', 'C6', 'G5']):
        x = S.note('marimba', p, .2, vel=.6); a = int(j * .14 * SR); o[a:a + len(x)] += x[:len(o) - a]
    return o
tick = lambda: X.click(1.9) * .35

put(fx, X.whoosh(.5), 3.85, .55); put(fx, slam(.9), 4.05, .7)
for t0 in (4.6, 6.9, 9.7, 11.6, 12.9, 15.7, 16.6, 17.8, 21.6, 22.5, 24.5, 26.4, 27.4, 29.6, 32.0, 34.3, 36.0, 38.0, 38.9, 40.6, 42.2, 43.6, 45.4, 46.8, 48.4, 50.7, 52.2):
    put(fx, paper(.22, .9), t0 - .02, .32, rng.uniform(-.3, .3))
put(fx, paper(.6), 6.35, .5); put(fx, X.whoosh(.6), 8.65, .45); put(fx, X.whoosh(.6), 14.85, .45)
put(fx, X.thump(.6, 80), 15.4, .5); put(fx, scratch(1.4), 17.6, .5, .2)
put(fx, X.whoosh(.6), 20.65, .45); put(fx, X.clack(1.1), 23.2, .4, .2)
put(fx, X.pop(.8) if hasattr(X, 'pop') else tick(), 24.35, .6)
put(fx, X.whoosh(.5), 26.25, .35); put(fx, X.whoosh(.6), 28.65, .45)
for j in range(14): put(fx, paper(.18, .6), 30.2 + j * .2 + rng.uniform(0, .1), .25, rng.uniform(-.7, .7))
put(fx, scratch_rec(), 33.72, .55); put(fx, X.thump(.8, 70), 34.0, .45)
put(fx, S.hit('timpani', 0, 1.0), 34.05, .9); put(fx, stamp(), 35.95, .9)
put(fx, X.whoosh(.6), 37.0, .4)
buzz = (np.sign(np.sin(2 * np.pi * 120 * tt(.45))) * .15 + X.bp(X.noise(.45), 100, 600) * .3) * (np.sin(2 * np.pi * 9 * tt(.45)) > 0); put(fx, buzz, 38.0, .35)
put(fx, slam(.9), 38.55, .7); put(fx, X.whoosh(.4), 38.9, .4); put(fx, X.thump(.5, 90), 39.4, .4)
rain = X.bp(X.noise(8.0), 1500, 9000) * .07 + X.lp(X.noise(8.0), 300) * .05
for j in range(160): a = int(rng.uniform(0, 7.9) * SR); dr = X.click(rng.uniform(1.2, 2.2)) * rng.uniform(.05, .2); rain[a:a + len(dr)] += dr[:len(rain) - a]
rain *= np.minimum(1, tt(8.0) / .6)[:len(rain)] * np.minimum(1, (8.0 - tt(8.0)[:len(rain)]) / .8)
put(fx, rain, 39.6, 1.0)
put(fx, tone([440, 480], 1.0), 41.0, .16); put(fx, tone([1000], .26), 42.15, .2)
put(fx, tone([440, 480], .85), 43.25, .16); put(fx, tone([1000], .26), 44.15, .2)
put(fx, marimba_ring(), 45.0, .55); put(fx, X.click(1.4) * .6, 45.42, .5)
put(fx, X.whoosh(.6), 47.05, .4); put(fx, paper(.5), 48.4, .55); put(fx, tear(), 50.6, .9)
put(fx, X.whoosh(1.1) * .8, 53.3, .6); put(fx, applause(), 53.6, .9)
put(fx, X.whoosh(.4), 54.4, .5)

mix = mus + fx
for ch in range(2): mix[:, ch] = X.limit(mix[:, ch], .9)
mix = gain_to(mix, -14.0)
for ch in range(2): mix[:, ch] = X.limit(mix[:, ch], .89)
f = int(.01 * SR); mix[-f:] *= ramp(f, 1, 0)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', 'pcm_s16le', OUT], input=mix.astype(np.float32).tobytes(), check=True)
print('готово', OUT, 'LUFS', round(lufs(mix), 1), 'пик', round(20 * np.log10(np.abs(mix).max() + 1e-9), 1))
