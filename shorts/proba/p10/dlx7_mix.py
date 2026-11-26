# «Духless» EN · звук «Вещи на столе» (dlx7, 26.11), без голоса.
# 0–15,56 с: «Кашалот» с дропа (21,03 с трека = 0,2 с ролика), каждая вещь падает на долю — удар, бумага, пластик, стекло;
# к концу клуба музыка глохнет фильтром и обрывается щелчком → 06:00: тишина, гул комнаты, низкие струнные,
# два штампа, гудки в трубке, автоответчик, короткие гудки → финал: литавра на падении карточки, луч, медь на разрезе SOUL / LESS,
# в конце нарастание в петлю (снова дроп «Кашалота»). Сэмплы VSCO 2 CE (CC0) из lemo-opuscar, остальное — синтез. Итог −14 LUFS, пик ≤ −1 дБ.
# Запуск: ~/lemo-opuscar/.venv/bin/python dlx7_mix.py <кашалот.mp3> <выход.wav>
import sys, os, subprocess, numpy as np
LEMO = os.environ.get('LEMO', os.path.expanduser('~/lemo-opuscar'))
sys.path.insert(0, LEMO + '/core/audio')
import sfx as X
import sampler as S
from scipy.signal import butter, sosfilt
SR = 48000; L = 28.5; N = int(L * SR)
KAS, OUT = sys.argv[1:3]
BEAT, T0, DROP = 60 / 105.47, .2, 21.03
tb = lambda n: T0 + n * BEAT
P1E, P2E, PCE, SPL = tb(27), 22.3, 24.9, 25.75
rng = np.random.default_rng(27)

def load(p, ss, d):
    a = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(ss), '-t', str(d), '-i', p, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout, np.float32)
    return a.reshape(-1, 2).copy()
def lufs(x):
    p = subprocess.run(['ffmpeg', '-hide_banner', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', 'ebur128', '-f', 'null', '-'], input=x.astype(np.float32).tobytes(), capture_output=True)
    for l in p.stderr.decode().splitlines()[::-1]:
        if l.strip().startswith('I:'): return float(l.split()[1])
    return -70.0
def gain_to(x, tgt): return x * 10 ** ((tgt - lufs(x)) / 20)
def put(buf, x, at, g=1.0, pan=0.0):
    i = int(round(at * SR))
    if x.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4); x = np.stack([x * l * 1.414, x * r * 1.414], 1)
    if i < 0: x = x[-i:]; i = 0
    n = min(len(x), len(buf) - i)
    if n > 0: buf[i:i + n] += x[:n] * g
def ramp(n, a, b): return np.linspace(a, b, n, dtype=np.float32)[:, None]
def tt(d): return np.arange(int(d * SR)) / SR

mus = np.zeros((N, 2), np.float32)
fx = np.zeros((N, 2), np.float32)

# ---- 1. «Кашалот»: с 0 (дроп на 0,2 с), глохнет 14,2 → 15,4, обрыв на 15,56 ----
k = load(KAS, DROP - T0, P1E + .05); k = gain_to(k, -14.0)
n = int(P1E * SR); k = k[:n]
tk = np.arange(len(k)) / SR
# фильтр, который закрывается: блоками по 20 мс, частота среза 9000 → 260 Гц
m0, m1 = tb(24.6), P1E - .1
out = k.copy(); blk = int(.02 * SR)
zi = None
for a in range(int(m0 * SR), len(k), blk):
    t0 = a / SR; fc = 9000 * (260 / 9000) ** np.clip((t0 - m0) / (m1 - m0), 0, 1)
    sos = butter(2, fc, 'low', fs=SR, output='sos')
    seg = k[a:a + blk]; out[a:a + blk] = sosfilt(sos, seg, axis=0)
xf = int(.03 * SR); a0 = int(m0 * SR); out[a0:a0 + xf] = k[a0:a0 + xf] * ramp(xf, 1, 0) + out[a0:a0 + xf] * ramp(xf, 0, 1)
out *= np.where(tk > m0, 1 + .25 * np.clip((tk - m0) / .6, 0, 1), 1)[:, None].astype(np.float32)   # глухая — громче, чтобы не провалилась
f = int(.008 * SR); out[-f:] *= ramp(f, 1, 0)
put(mus, out, 0)

# ---- 2. звуки вещей ----
def paper(v=1.0, d=.18):
    o = X.bp(X.noise(d), 600, 7000) * X.env_exp(d, .035); return o * v
def slap(v=1.0): o = X.thump(1.0, 62) * .9; p = paper(1.0); o = o.copy(); o[:len(p)] += p; return o * v
def mixs(*xs):
    n = max(len(x) for x in xs); o = np.zeros(n)
    for x in xs: o[:len(x)] += x
    return o
def glass(v=1.0): return mixs(X.thump(1.0, 55) * .8, ringing([(2350, .22), (3480, .14), (5120, .08)], .9, .25)) * v
def ringing(f0s, d=.9, tau=.22):
    t_ = tt(d); return sum(np.sin(2 * np.pi * f * t_) * np.exp(-t_ / tau) * a for f, a in f0s)
def squeak(d=.22):
    t_ = tt(d); fq = 1500 + 600 * np.sin(np.pi * t_ / d); return (X.bp(X.noise(d), 1200, 5000) * .45 + np.sin(2 * np.pi * np.cumsum(fq) / SR) * .06) * np.sin(np.pi * t_ / d)
def scratch(d):
    t_ = tt(d); n0 = X.bp(X.noise(d), 1800, 7000); m = .5 + .5 * np.abs(np.sin(2 * np.pi * 6.5 * t_ + np.sin(2 * np.pi * 2.1 * t_)))
    return n0 * m * np.minimum(1, t_ / .02) * np.minimum(1, (d - t_) / .05) * .45
def flip(): o = X.click(1.5) * .6; p = X.bp(X.noise(.05), 2000, 8000) * X.env_exp(.05, .01) * .5; o = o.copy(); o[:len(p)] += p; return o
def stamp(): o = X.thump(1.0, 74).copy(); p = X.bp(X.noise(.14), 250, 2600) * X.env_exp(.14, .03); o[:len(p)] += p * .9; return o
def tone(fs, d, edge=.008):
    t_ = tt(d); s = sum(np.sin(2 * np.pi * f * t_) for f in fs) / len(fs); return s * np.minimum(1, np.minimum(t_, d - t_) / edge)
def phone(x): return X.bp(x, 350, 3200) * .9
def hit(v=1.0):
    t_ = tt(1.2); fq = 30 + 70 * np.exp(-t_ / .07); s = np.sin(2 * np.pi * np.cumsum(fq) / SR) * np.exp(-t_ / .35) * np.minimum(1, t_ / .002)
    p = X.bp(X.noise(.25), 800, 9000) * X.env_exp(.25, .05) * .35; s[:len(p)] += p; return s * v
def riser(d):
    t_ = tt(d); n0 = X.noise(d); o = np.zeros_like(n0)
    for a in range(0, len(n0), 2400):
        fc = 300 + 7000 * (a / len(n0)) ** 2; o[a:a + 2400] = X.bp(n0[a:a + 2400], fc * .7, fc * 1.3)
    return o * (t_ / d) ** 2.2
def sizzle(d):
    t_ = tt(d); return X.hp(X.noise(d), 4000) * np.sin(np.pi * t_ / d) * .5 + np.sin(2 * np.pi * np.cumsum(3000 + 4000 * t_ / d) / SR) * .05 * np.sin(np.pi * t_ / d)

# письмо и папка (удар на дроп)
put(fx, slap(1.0), tb(0) - .005, .95); put(fx, hit(.8), tb(0) - .005, .6)
# маркер: два круга
put(fx, squeak(.24), tb(3), .45, .1); put(fx, squeak(.2), tb(3) + .22, .4, .15)
# проезды камеры
for a, b in [(tb(2.6), tb(3.2)), (tb(5.6), tb(6.05)), (tb(7.6), tb(8.05)), (tb(9.6), tb(10.05)), (tb(13.6), tb(14.05)), (tb(15.4), tb(15.9)), (tb(17.6), tb(18.05))]:
    d = b - a + .1; put(fx, X.whoosh(d), a - .05, .42, rng.uniform(-.4, .4))
put(fx, paper(1.2, .22), tb(6), .7, .3); put(fx, X.thump(.6, 90), tb(6), .45, .3)        # фото
put(fx, X.clack(1.1), tb(8), .5, -.3); put(fx, X.click(2.2) * .5, tb(8) + .05, .4, -.3)  # пропуск
put(fx, slap(.9), tb(10), .8)                                                            # договор
put(fx, X.clack(1.6), tb(11), .55, .2); put(fx, X.click(1.8) * .5, tb(11) + .09, .35, .2)  # ручка
put(fx, scratch(tb(12) + .45 - tb(11) - .1), tb(11) + .1, .55, .15)                       # подпись
put(fx, X.thump(.9, 66), tb(14), .8, -.2); put(fx, paper(.6, .25), tb(14), .5, -.2)       # конверт
put(fx, X.clack(.8), tb(15), .55, -.15)                                                   # часы
for t0 in [9.30, 9.44, 9.57, 9.69, 9.80, 9.91, 10.02]: put(fx, flip(), t0, .55, -.1)
put(fx, glass(1.0), tb(18), .85, .25); put(fx, hit(.7), tb(18), .55)                       # бутылка
put(fx, X.pop(1.0) if hasattr(X, 'pop') else X.click(.6), tb(18.5) - .32, .7, -.2)          # хлопок пробки (до падения)
put(fx, X.thump(.5, 140), tb(18.5), .35, -.2)
put(fx, paper(.8), tb(19), .5, -.3); put(fx, ringing([(4200, .18), (6100, .1)], .5, .06), tb(20), .5, .1); put(fx, X.thump(.5, 110), tb(20), .4)  # чек, карта
put(fx, paper(.8), tb(21), .5, .35)
for j, n0 in enumerate([22, 23, 24]): put(fx, hit(1.0 - .15 * j), tb(n0) - .005, .8)
# обрыв: щелчок выключателя
put(fx, X.click(.9) * 1.1, P1E, .8)

# ---- 3. 06:00 ----
room = X.lp(X.noise(P2E - P1E + .5), 300) * .02 + X.lp(X.noise(P2E - P1E + .5), 90) * .03
put(fx, room * np.minimum(1, tt(len(room) / SR) / .3), P1E)
put(fx, X.whoosh(.5) * .6, 16.85, .5); put(fx, paper(.7, .3), 17.0, .5)
put(fx, stamp(), 17.55, 1.0); put(fx, X.click(.8) * .5, 18.9, .35); put(fx, stamp(), 19.15, 1.0)
put(fx, X.click(.8) * .5, 20.0, .35)
put(fx, phone(tone([425], .8)), 20.08, .3, .2); put(fx, phone(tone([1000], .32)), 20.9, .26, .2)    # Вадим: гудок → автоответчик
put(fx, X.click(.8) * .5, 21.15, .3)
put(fx, phone(tone([425], .75)), 21.2, .3, .2)
for j in range(3): put(fx, phone(tone([425], .16)), 21.98 + j * .3, .28, .2)                       # Юля: короткие гудки
put(fx, hit(.5), 23.6, .5)

# ---- 4. оркестр: 15,9 → конец ----
S.seed(7)
ev = []
s0 = 15.9
for p, ins, v, pan in [('D2', 'contrabass', .5, 0), ('D3', 'cellos', .5, -.25), ('A3', 'cellos', .45, .25)]:
    ev.append(dict(t=0, inst=ins, pitch=p, dur=PCE + .4 - s0, vel=v, pan=pan, attack=2.2))
ev += [dict(t=1.6, inst='violas', pitch='F4', dur=PCE - s0 - 1.2, vel=.38, pan=.3, attack=2.0), dict(t=4.0, inst='violins', pitch='A4', dur=PCE - s0 - 3.6, vel=.36, pan=-.3, attack=2.0)]
ev += [dict(t=6.4, inst='violins', pitch='Bb4', dur=2.2, vel=.36, pan=.3, attack=1.2)]   # «You didn't win the city»: си-бемоль — горечь
cut = SPL - s0; land = PCE + .4 - s0
ev += [dict(t=land - .01, inst='timpani', pitch='D2', dur=2.0, vel=.85, pan=0, gain=1.2)]
ev += [dict(t=cut, inst='horn', pitch=p, dur=2.2, vel=.95, pan=pn, gain=1.2) for p, pn in [('D4', -.2), ('F4', .1), ('A4', .25)]]
ev += [dict(t=cut, inst='trombone', pitch='D3', dur=2.4, vel=.95, pan=0, gain=1.1), dict(t=cut, inst='tuba', pitch='D2', dur=2.4, vel=.9, pan=0)]
ev += [dict(t=cut - .01, inst='timpani', pitch='D2', dur=2.5, vel=1.0, pan=0, gain=1.4)]
for p, ins, pan in [('D3', 'cellos', -.3), ('A3', 'cellos', .2), ('F4', 'violas', .3), ('D5', 'violins', -.3)]:
    ev.append(dict(t=cut + .3, inst=ins, pitch=p, dur=L - SPL - .2, vel=.55, pan=pan, attack=.6))
orch = S.render(ev, L - s0 + .5, master=False)
orch = S.room(orch, size=.6, mix=.3)
orch = gain_to(orch, -16.0)
put(mus, orch, s0)

# ---- 5. финал ----
put(fx, hit(1.0), PCE + .4, .8); put(fx, X.thump(1.0, 48), PCE + .4, .6)
put(fx, sizzle(.4), SPL - .34, .5)
put(fx, ringing([(1880, .2), (2820, .12), (4410, .07)], 1.6, .4), SPL, .6)     # «шинг» разреза
put(fx, riser(1.0), L - 1.0, .55)                                               # в петлю

# ---- сведение ----
mix = mus + fx
for ch in range(2): mix[:, ch] = X.limit(mix[:, ch], .9)
mix = gain_to(mix, -14.0)
for ch in range(2): mix[:, ch] = X.limit(mix[:, ch], .89)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', 'pcm_s16le', OUT], input=mix.astype(np.float32).tobytes(), check=True)
print('готово', OUT, 'LUFS', round(lufs(mix), 1), 'пик', round(20 * np.log10(np.abs(mix).max() + 1e-9), 1))
