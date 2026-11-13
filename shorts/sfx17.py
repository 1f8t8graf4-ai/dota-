# Библиотека «тяжёлых» звуков (13.11, правка Андрея: звук как у референсов — плотный, с басом), без новых трат:
# слои из уже оплаченных звуков ElevenLabs (sfx16/, sfx8/) + синтез (саб-удар, металлический звон, хвост помещения, затяжка, выдох).
# Пишет sfx17/*.mp3 (моно, 48 кГц). Детерминировано: те же файлы при каждом запуске.
#   python3 sfx17.py
import os, subprocess
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__)); SR = 48000; OUT = os.path.join(HERE, 'sfx17')
R = np.random.default_rng(17)


def load(rel):
    b = subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(HERE, rel), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(b, np.float32).astype(np.float64)


def save(name, x, peak=.89):
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    n = min(len(x) // 4, int(.004 * SR)); x[:n] *= np.linspace(0, 1, n); m = min(len(x) // 4, int(.04 * SR)); x[-m:] *= np.linspace(1, 0, m)
    os.makedirs(OUT, exist_ok=True)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'f64le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'libmp3lame', '-b:a', '192k', os.path.join(OUT, name + '.mp3')],
                   input=x.astype(np.float64).tobytes(), check=True)
    print(name, f'{len(x) / SR:.2f} с')


def band(x, lo=0, hi=SR / 2):   # полосовой фильтр через спектр
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); m = ((f >= lo) & (f <= hi)).astype(float)
    k = 40; m = np.convolve(m, np.ones(k) / k, 'same')   # мягкие края полосы
    return np.fft.irfft(X * m, len(x))


def tail(n, rt):   # хвост помещения: шум с экспоненциальным спадом, без верхов
    t = np.arange(n) / SR
    return band(R.standard_normal(n), 60, 5200) * np.exp(-t * 6.9 / rt) * (t > .008)


def conv(x, ir):
    n = len(x) + len(ir); N = 1 << (n - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, N) * np.fft.rfft(ir, N), N)[:n]


def mix(*parts):
    n = max(len(p) for _, p in parts); y = np.zeros(n)
    for g, p in parts: y[:len(p)] += g * p / (np.max(np.abs(p)) + 1e-9)
    return y


def wet(x, rt, amt):
    ir = tail(int(rt * SR * 1.2), rt); y = conv(x, ir); y = y / (np.max(np.abs(y)) + 1e-9)
    return mix((1, np.pad(x, (0, len(y) - len(x)))), (amt, y))


def sub(dur=2.0, f0=72, f1=31, tau=.5, click=.5):   # саб-удар: свип вниз + щелчок
    n = int(dur * SR); t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t / .11); ph = 2 * np.pi * np.cumsum(f) / SR
    s = (np.sin(ph) + .55 * np.sin(2 * ph) + .3 * np.sin(3 * ph)) * np.exp(-t / tau)   # обертоны 60–220 Гц — удар слышно и в телефоне
    body = band(R.standard_normal(n), 80, 260) * np.exp(-t / (tau * .45)) * .6
    c = band(R.standard_normal(n), 200, 3200) * np.exp(-t / .012) * click
    return np.tanh(2.2 * (s + body + c)) / np.tanh(2.2)


def ring(dur=2.2, base=1.0):   # металлический звон двери: негармонические обертоны с разным затуханием
    n = int(dur * SR); t = np.arange(n) / SR; y = np.zeros(n)
    for f, a, d in [(233, 1, 1.6), (361, .7, 1.2), (522, .55, .9), (707, .4, .7), (911, .3, .5), (1187, .22, .35), (1610, .14, .25)]:
        y += a * np.sin(2 * np.pi * f * base * t + R.uniform(0, 6.28)) * np.exp(-t / d) * (1 + .15 * np.sin(2 * np.pi * (1.3 + f / 900) * t))
    return y * (1 - np.exp(-t / .002))


def vape_inhale(dur=1.5):   # затяжка: поток воздуха + треск спирали, нарастает
    n = int(dur * SR); t = np.arange(n) / SR
    e = np.clip(t / .25, 0, 1) * np.clip((dur - t) / .22, 0, 1)
    air = band(R.standard_normal(n), 700, 3800) * e
    cr = np.zeros(n); idx = np.flatnonzero(R.random(n) < 260 / SR)
    for i in idx:
        L = int(R.uniform(.0015, .004) * SR); a = R.uniform(.3, 1)
        if i + L < n: cr[i:i + L] += a * R.standard_normal(L) * np.exp(-np.arange(L) / (L / 4))
    cr = band(cr, 2500, 11000) * np.clip(t / .5, 0, 1) * e
    draw = band(R.standard_normal(n), 160, 420) * e
    return mix((1, air), (.55, cr), (.35, draw))


def vape_exhale(dur=2.0):   # выдох пара: мягкий, объёмный, сверху вниз по тону
    n = int(dur * SR); t = np.arange(n) / SR
    e = np.clip(t / .12, 0, 1) * np.exp(-np.maximum(0, t - .25) / .55)
    hi = band(R.standard_normal(n), 300, 1600) * e; lo = band(R.standard_normal(n), 90, 420) * e
    return wet(mix((1, hi), (.6, lo)), .9, .35)


if __name__ == '__main__':
    t = np.arange(int(1.2 * SR)) / SR; thump = np.tanh(3 * band(R.standard_normal(len(t)), 110, 340) * np.exp(-t / .22))   # «тело» удара 110–340 Гц
    save('boom', wet(mix((1, sub(2.2, 110, 32, .5, .7)), (.9, thump)), 1.6, .25))
    st = load('sfx8/stamp.mp3'); save('stamp', wet(mix((1, st), (.5, sub(.9, 95, 44, .16, .9))), 1.3, .4))
    th = load('sfx8/thud.mp3'); save('thud', wet(mix((1, th), (.6, sub(.7, 80, 40, .14, .7))), .9, .25))
    im = load('sfx8/impact.mp3'); save('impact', wet(mix((1, im), (.5, sub(1.6, 90, 32, .4, .6)), (.8, thump)), 1.5, .3))
    va = load('sfx16/vault.mp3'); save('vault', wet(mix((1, va), (.55, sub(1.8, 66, 30, .45, .8)), (.4, ring(2.4))), 2.0, .45))
    vo = load('sfx16/vaultopen.mp3'); save('vaultopen', wet(mix((1, vo), (.25, ring(1.6, .8))), 1.8, .35))
    pa = load('sfx16/papers.mp3'); save('papers', mix((1, pa), (.35, band(pa, 120, 900))))
    dr = load('sfx16/drawer.mp3'); save('drawer', wet(mix((1, dr), (.5, sub(.5, 90, 50, .1, .5))), .8, .25))
    save('vape', vape_inhale(1.5))
    save('puff', vape_exhale(2.0))
