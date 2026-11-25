# «Духless» EN · звук теста (25.11): «Кобальт» 0–5,0 → обрыв 0,25 с → удар (синтез) → «Кашалот» с дропа + голос, свист на склейках.
# python3 -I dlx_mix.py <кобальт.mp3> <кашалот.mp3> <голос.wav> <выход.wav> [начало голоса=5.25] [дроп кашалота=19.5] [длина=15.6] [склейки через запятую]
import sys, subprocess, numpy as np
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
k = load(kas, K0, L - V0 + 0.5); k = gain_to(k, -17.5); n = min(len(k), N - i0); kk = k[:n] * (10 ** (-4.5 * sm[i0:i0 + n] / 20))[:, None]
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
mix = np.tanh(mix * 0.98) / np.tanh(0.98)
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', 'loudnorm=I=-13:TP=-1.0:LRA=4', '-ar', str(SR), out], input=mix.astype(np.float32).tobytes(), check=True)
print('готово', out, f'{L:.2f} с, голос с {V0} с, дроп «Кашалота» {K0} с, склеек {len(CUTS)}')
