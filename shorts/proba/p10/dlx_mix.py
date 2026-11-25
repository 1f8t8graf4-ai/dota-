# «Духless» EN · звук теста (25.11): «Кобальт» 0–5,0 → обрыв 0,25 с → удар (синтез) → «Кашалот» с дропа + голос, свист на склейках.
# python3 -I dlx_mix.py <кобальт.mp3> <кашалот.mp3> <голос.wav> <выход.wav> [начало голоса=5.25] [дроп кашалота=19.5] [длина=15.6] [склейки через запятую] [звуки: stamp@10.9,click@17.2,ding@15.1,scratch@9.9:0.6]
# «Кашалот»: дроп — сильная доля с басом на 21,03 с; с 19,5 под первыми секундами голоса была дыра (бас молчит 20,1–21,0).
import sys, os, subprocess, numpy as np
SR = 48000
def load(p, ss=0.0, dur=None):
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(ss), '-i', p] + (['-t', str(dur)] if dur else []) + ['-ac', '2', '-ar', str(SR), '-f', 'f32le', '-']
    a = np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32)
    return a.reshape(-1, 2).copy()
def lufs(x):
    p = subprocess.run(['ffmpeg', '-hide_banner', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', 'ebur128', '-f', 'null', '-'], input=x.astype(np.float32).tobytes(), capture_output=True)
    for l in p.stderr.decode().splitlines()[::-1]:
        if l.strip().startswith('I:'): return float(l.split()[1])
    return -70.0
def gain_to(x, target): return x * 10 ** ((target - lufs(x)) / 20)
cob, kas, voi, out = sys.argv[1:5]
V0 = float(sys.argv[5]) if len(sys.argv) > 5 else 5.25
K0 = float(sys.argv[6]) if len(sys.argv) > 6 else 19.5
L = float(sys.argv[7]) if len(sys.argv) > 7 else 15.6
CUTS = [float(v) for v in sys.argv[8].split(',')] if len(sys.argv) > 8 else []
N = int(L * SR); mix = np.zeros((N, 2), np.float32); t = np.arange(N) / SR
rng = np.random.default_rng(5)
# 1) «Кобальт» до 5,0 с, обрез 20 мс
c = gain_to(load(cob, 0, 5.0), -13.0); n = min(len(c), int(5.0 * SR)); c = c[:n]
f = int(0.02 * SR); c[-f:] *= np.linspace(1, 0, f)[:, None]; mix[:n] += c
# 2) голос
v = load(voi); v = gain_to(v, -14.0); i0 = int(V0 * SR); n = min(len(v), N - i0); mix[i0:i0 + n] += v[:n]
# огибающая голоса для приседания музыки
env = np.zeros(N); e = np.sqrt(np.convolve((v[:n, 0] ** 2), np.ones(int(0.03 * SR)) / int(0.03 * SR), 'same')); env[i0:i0 + n] = e
thr = np.percentile(e[e > 1e-4], 30) if (e > 1e-4).any() else 1e-3; act = np.clip(env / thr, 0, 1)
sm = np.zeros(N); a_at, a_rl = 1 - np.exp(-1 / (0.015 * SR)), 1 - np.exp(-1 / (0.25 * SR)); s = 0.0
for k in range(N):
    x = act[k]; s += (x - s) * (a_at if x > s else a_rl); sm[k] = s
# 3) «Кашалот» с дропа, под голосом −4,5 дБ
KL = float(os.environ.get('KL', -17.5)); KD = float(os.environ.get('KD', 4.5))   # громкость «Кашалота» и приседание под голосом
k = load(kas, K0, L - V0 + 0.5); k = gain_to(k, KL); n = min(len(k), N - i0); kk = k[:n] * (10 ** (-KD * sm[i0:i0 + n] / 20))[:, None]
fo = int(0.45 * SR); kk[-fo:] *= np.linspace(1, 0, fo)[:, None]; fi = int(0.004 * SR); kk[:fi] *= np.linspace(0, 1, fi)[:, None]; mix[i0:i0 + n] += kk
# 4) удар на V0: саб-свип 72 → 36 Гц + щелчок
d = 1.3; tt = np.arange(int(d * SR)) / SR; fr = 36 + 36 * np.exp(-tt / 0.18); ph = 2 * np.pi * np.cumsum(fr) / SR
boom = np.sin(ph) * np.exp(-tt / 0.42) * np.minimum(1, tt / 0.004)
cl = rng.standard_normal(len(tt)) * np.exp(-tt / 0.012); cl = np.convolve(cl, np.ones(24) / 24, 'same')
b = 0.85 * boom + 0.5 * cl; mix[i0:i0 + len(b)] += np.stack([b, b], 1)
# 5) свист на склейках: шум в полосе, центр 500 → 4000 Гц
def whoosh(dur=0.3):
    m = int(dur * SR); x = rng.standard_normal(m); X = np.fft.rfft(x); fq = np.fft.rfftfreq(m, 1 / SR)
    out = np.zeros(m); seg = 8; ln = m // seg
    for j in range(seg):
        cen = 500 * (8 ** (j / (seg - 1))); w = np.exp(-0.5 * ((np.log(fq + 1) - np.log(cen)) / 0.5) ** 2)
        y = np.fft.irfft(X * w, m); out[j * ln:(j + 1) * ln] = y[j * ln:(j + 1) * ln]
    envw = np.sin(np.pi * np.clip(np.linspace(0, 1, m) / 0.65, 0, 1) * 0.5) * np.clip((1 - np.linspace(0, 1, m)) / 0.35, 0, 1)
    out = out * envw; return out / (np.abs(out).max() + 1e-9)
for cu in CUTS:
    w = whoosh() * 0.16; j = int((cu - 0.14) * SR); n = min(len(w), N - j)
    if j >= 0: mix[j:j + n] += np.stack([w[:n] * 0.9, w[:n]], 1)
# 6) звуки событий (синтез): штамп, щелчок защёлки, уведомление, ручка по бумаге
def bp(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); return np.fft.irfft(X * ((f >= lo) & (f <= hi)), len(x))
def sfx(name, dur):
    if name == 'stamp':
        m = int(.45 * SR); tt = np.arange(m) / SR; fr = 50 + 70 * np.exp(-tt / .03)
        y = .9 * np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-tt / .09) + .5 * bp(rng.standard_normal(m), 900, 3500) * np.exp(-tt / .025)
        return .55 * y / (np.abs(y).max() + 1e-9)
    if name == 'click':
        m = int(.3 * SR); tt = np.arange(m) / SR
        y = bp(rng.standard_normal(m), 3000, 9000) * np.exp(-tt / .006) * 1.2 + .6 * np.sin(2 * np.pi * 2300 * tt) * np.exp(-tt / .035) + .8 * np.sin(2 * np.pi * 170 * tt) * np.exp(-tt / .05)
        d = int(.055 * SR); y2 = np.zeros(m); y2[d:] = .7 * y[:m - d]; y = y + y2
        return .5 * y / (np.abs(y).max() + 1e-9)
    if name == 'ding':
        m = int(.5 * SR); tt = np.arange(m) / SR
        y = (np.sin(2 * np.pi * 1568 * tt) + .6 * np.sin(2 * np.pi * 2093 * tt) * (tt > .07)) * np.exp(-tt / .16) * np.minimum(1, tt / .003)
        return .13 * y / (np.abs(y).max() + 1e-9)
    if name == 'swish':
        y = whoosh(.28); return .12 * y
    if name == 'pop':
        m = int(.9 * SR); tt = np.arange(m) / SR
        th = np.sin(2 * np.pi * np.cumsum(260 + 500 * np.exp(-tt / .006)) / SR) * np.exp(-tt / .018)
        fz = bp(rng.standard_normal(m), 3500, 11000) * np.minimum(1, tt / .04) * np.exp(-tt / .35) * (.6 + .4 * rng.random(m))
        y = th + .35 * fz; return .5 * y / (np.abs(y).max() + 1e-9)
    if name == 'scratch':
        m = int(dur * SR); tt = np.arange(m) / SR; x = bp(rng.standard_normal(m), 1800, 7000)
        envs = np.abs(np.sin(2 * np.pi * 7.5 * tt + 2 * np.sin(2 * np.pi * 2.1 * tt))) ** 1.5 * np.minimum(1, tt / .03) * np.minimum(1, (dur - tt) / .05)
        y = x * envs; return .07 * y / (np.abs(y).max() + 1e-9)
    return np.zeros(1)
for spec in (sys.argv[9].split(',') if len(sys.argv) > 9 and sys.argv[9] else []):
    nm, rest = spec.split('@'); tq, _, du = rest.partition(':'); y = sfx(nm, float(du or .5)); j = int(float(tq) * SR); n = min(len(y), N - j)
    if j >= 0 and n > 0: mix[j:j + n] += np.stack([y[:n], y[:n]], 1)
mix = np.tanh(mix * 0.98) / np.tanh(0.98)
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', 'loudnorm=I=-13:TP=-1.0:LRA=4', '-ar', str(SR), out], input=mix.astype(np.float32).tobytes(), check=True)
print('готово', out, f'{L:.2f} с, голос с {V0} с, дроп «Кашалота» {K0} с, склеек {len(CUTS)}')
