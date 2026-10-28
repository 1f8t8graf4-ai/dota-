# Фон-эмбиент под реплики героев (26.10, Андрей: «чтобы не просто фраза, а что-то на фоне — легенькое, еле слышное, лишь бы не пустота»).
# Синтез с нуля (numpy + ffmpeg), с фиксированным зерном: пересборка даёт те же файлы; права — наши (как snd/ из tools/sfx_make.py).
#   python3 tools/amb_make.py [--out <папка>] [имена…]
# Что выходит (48 кГц, стерео, wav; громкость — тихая, около −40 LUFS; ставит её на место сборщик ролика tools/tt_make.py):
#   amb-<место>.wav  — петля 30 с, конец переходит в начало без шва: sewer (туннели Крысы), cathedral (собор Венатора),
#                      city (ночной город), forest (лес Талона), dream (сон Рэма);
#   ir-<место>.wav   — «эхо» места для голоса (импульсная характеристика для свёртки: afir в ffmpeg);
#   ab-<вид>.wav     — звук абилки для макетов и пробных роликов: rat (глухой вжух и удар), holy (звонкий вжух и удар).
#                      В приложении будут настоящие звуки игры (их собирает Зетка, ТЗ-ZAI-v12-26.10.md).
import argparse, os, wave
import numpy as np

SR = 48000
LOOP = 30.0   # длина петли, с
XF = 3.0      # наплыв конца на начало, с


def rng(name):
    return np.random.default_rng(sum(map(ord, name)) * 7919)


def brown(r, n):
    w = r.standard_normal(n)
    b = np.cumsum(w)
    # убираем уход в сторону: вычитаем скользящее среднее
    k = 4800
    b = b - np.convolve(b, np.ones(k) / k, mode='same')
    return b / (np.abs(b).max() + 1e-9)


def pink(r, n):
    w = np.fft.rfft(r.standard_normal(n))
    f = np.fft.rfftfreq(n, 1 / SR)
    f[0] = 1
    p = np.fft.irfft(w / np.sqrt(f), n)
    return p / (np.abs(p).max() + 1e-9)


def band(x, lo, hi):
    # полосовой фильтр через FFT (мягкие края, без звона)
    n = len(x)
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(n, 1 / SR)
    m = np.ones_like(f)
    if lo:
        m *= 1 / (1 + (lo / np.maximum(f, 1)) ** 4)
    if hi:
        m *= 1 / (1 + (f / hi) ** 4)
    return np.fft.irfft(X * m, n)


def env(n, a, d):
    # огибающая: атака a и затухание d (с), экспонента
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / max(d, 1e-4))
    return e


def conv(x, ir):
    n = len(x) + len(ir) - 1
    N = 1 << (n - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, N) * np.fft.rfft(ir, N), N)[:n]


def impulse(sec, decay, dark, seed):
    # «эхо» места: затухающий шум, высокие гаснут быстрее (dark — частота среза в конце)
    r = np.random.default_rng(seed)
    n = int(sec * SR)
    t = np.arange(n) / SR
    out = []
    for ch in range(2):
        w = r.standard_normal(n) * np.exp(-t * decay)
        lo = band(w, 0, dark)          # тёмная часть тянется дольше
        hi = band(w, dark, 0) * np.exp(-t * decay * 2.5)
        x = lo + hi
        x[: int(.004 * SR)] *= np.linspace(0, 1, int(.004 * SR))
        out.append(x)
    ir = np.stack(out, 1)
    return ir / np.sqrt((ir ** 2).sum() / 2)


def place(buf, snd, at, pan=0.0, gain=1.0):
    # кладём моно-звук в стерео-буфер с панорамой (-1 … 1)
    i = int(at * SR)
    j = min(len(buf), i + len(snd))
    if i >= len(buf):
        return
    l, rr = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[i:j, 0] += snd[: j - i] * l * gain
    buf[i:j, 1] += snd[: j - i] * rr * gain


def drip(r):
    # капля: короткий тон с падением высоты
    n = int(.16 * SR)
    t = np.arange(n) / SR
    f0 = r.uniform(900, 1700)
    f = f0 * np.exp(-t * 9)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * env(n, .002, .03)


def bell(f0):
    n = int(5 * SR)
    t = np.arange(n) / SR
    x = sum(a * np.sin(2 * np.pi * f0 * m * t) * np.exp(-t / d) for m, a, d in [(1, 1, 2.4), (2.01, .45, 1.6), (2.76, .3, 1.1), (5.4, .12, .6)])
    return x * env(n, .004, 99)


def stereo(m, width=0.0, r=None):
    # моно → стерео; width — сдвиг копии на долю миллисекунды для ширины
    if not width:
        return np.stack([m, m], 1)
    d = int(width * SR)
    return np.stack([m, np.concatenate([np.zeros(d), m[:-d]])], 1)


def make(name):
    r = rng(name)
    n = int((LOOP + XF) * SR)
    t = np.arange(n) / SR
    b = np.zeros((n, 2))
    if name == 'sewer':
        # гул туннеля, вода течёт вдали, капли то тут, то там, редко — далёкий стук трубы
        b += stereo(band(brown(r, n), 30, 260) * (0.8 + 0.2 * np.sin(2 * np.pi * t / 11)), .0007) * .55
        b += stereo(band(pink(r, n), 500, 1800) * (0.6 + 0.4 * np.sin(2 * np.pi * t / 7.3 + 1)), .0011) * .05
        at = 0.4
        while at < LOOP + XF - .3:
            place(b, drip(r), at, r.uniform(-.8, .8), r.uniform(.06, .16))
            at += r.uniform(.6, 2.2)
        for at in r.uniform(3, LOOP - 2, 3):
            k = band(r.standard_normal(int(.5 * SR)), 180, 900) * env(int(.5 * SR), .003, .09)
            place(b, k, at, r.uniform(-.6, .6), .18)
        ir = impulse(1.8, 2.4, 1500, 11)
    elif name == 'cathedral':
        # орган тихо держит аккорд (дышит), далёкий колокол, воздух большого зала
        for f, a in [(55, .5), (110, .35), (164.8, .22), (220, .16), (329.6, .07)]:
            ph = r.uniform(0, 6.28)
            x = np.sin(2 * np.pi * f * t + ph) + .25 * np.sin(2 * np.pi * 2 * f * t + ph)
            x *= a * (0.75 + 0.25 * np.sin(2 * np.pi * t / r.uniform(7, 13) + ph))
            b += stereo(x, .0006 * (f % 3))
        b += stereo(band(pink(r, n), 200, 2500), .0009) * .05
        for at in np.arange(4.0, LOOP, 9.5):
            place(b, bell(r.choice([196, 220, 246.9])), at, r.uniform(-.4, .4), .16)
        ir = impulse(4.2, 1.1, 2200, 12)
    elif name == 'city':
        # ночной город: гул улиц, мелкий дождь, редкий далёкий проезд машины
        b += stereo(band(brown(r, n), 25, 220), .0008) * .5
        b += stereo(band(pink(r, n), 2500, 9000) * .9 + band(pink(r, n), 700, 2500) * .3, .0013) * .05
        for at in r.uniform(2, LOOP - 6, 3):
            m = int(5 * SR)
            w = band(r.standard_normal(m), 120, 900) * np.sin(np.linspace(0, np.pi, m)) ** 2
            place(b, w, at, r.uniform(-.7, .7), .12)
        ir = impulse(1.0, 4.5, 2600, 13)
    elif name == 'forest':
        # лес: ветер в листве накатывает и стихает, ровный низ
        g = 0.6 + 0.4 * np.sin(2 * np.pi * t / 9.7) * np.sin(2 * np.pi * t / 4.1 + 1)
        b += stereo(band(pink(r, n), 400, 5000) * g, .0012) * .07
        b += stereo(band(brown(r, n), 30, 200), .0007) * .3
        ir = impulse(1.2, 3.6, 3000, 14)
    elif name == 'dream':
        # сон: мягкий аккорд из чистых тонов, медленно плывёт, тихое мерцание сверху
        for f in [196, 246.9, 293.7, 392]:
            ph = r.uniform(0, 6.28)
            x = np.sin(2 * np.pi * f * t + .8 * np.sin(2 * np.pi * t / 12 + ph)) * (0.6 + 0.4 * np.sin(2 * np.pi * t / r.uniform(6, 10) + ph))
            b += stereo(x * .1, .0008)
        b += stereo(band(pink(r, n), 5000, 12000), .0013) * .02
        ir = impulse(3.0, 1.6, 3500, 15)
    else:
        raise SystemExit('нет такого места: ' + name)
    # мягко: всё через «эхо» места, чтобы фон был в том же пространстве, что голос
    wet = np.stack([conv(b[:, c], ir[:, c])[:n] for c in range(2)], 1)
    wet *= np.abs(b).max() / (np.abs(wet).max() + 1e-9)
    b = b * .55 + wet * .45
    # петля: последние XF секунд наплывом на начало
    m = int(XF * SR)
    L = int(LOOP * SR)
    out = b[:L].copy()
    fade = np.sin(np.linspace(0, np.pi / 2, m))[:, None]
    out[:m] = out[:m] * fade + b[L:L + m] * np.cos(np.linspace(0, np.pi / 2, m))[:, None]
    # тихо: RMS около −42 dBFS (≈ −40 LUFS) — громкость под голос ставит tools/tt_make.py
    rms = np.sqrt((out ** 2).mean())
    out *= 10 ** (-42 / 20) / (rms + 1e-12)
    return out, ir


def abil(kind):
    # звук абилки: вжух шумом вверх и низкий удар (пример; в приложении — настоящий из игры)
    r = rng('ab-' + kind)
    n = int(1.3 * SR)
    t = np.arange(n) / SR
    w = r.standard_normal(n)
    lo, hi = (250, 1600) if kind == 'rat' else (500, 4200)
    sweep = np.zeros(n)
    seg = int(.04 * SR)
    for i in range(0, int(.5 * SR), seg):
        f = lo * (hi / lo) ** (i / (.5 * SR))
        sweep[i:i + seg] = band(w[i:i + seg * 2], f * .7, f * 1.4)[:len(sweep[i:i + seg])]
    sweep *= np.minimum(1, t / .06) * np.exp(-np.maximum(0, t - .35) * 9)
    f = (95 if kind == 'rat' else 75) * np.exp(-np.maximum(0, t - .38) * 4) + 32
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.where(t > .38, np.exp(-(t - .38) * 6), 0)
    x = sweep * .6 + boom * .9
    if kind != 'rat':
        x += np.sin(2 * np.pi * 1320 * t) * np.where(t > .38, np.exp(-(t - .38) * 3) * .12, 0)
    x = stereo(x / np.abs(x).max() * .89, .0004)
    return x


def save(p, x):
    x = np.clip(x, -1, 1)
    with wave.open(p, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype('<i2').tobytes())


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', default='amb')
    ap.add_argument('names', nargs='*', default=['sewer', 'cathedral', 'city', 'forest', 'dream'])
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    for nm in a.names:
        x, ir = make(nm)
        save(os.path.join(a.out, f'amb-{nm}.wav'), x)
        save(os.path.join(a.out, f'ir-{nm}.wav'), ir / np.abs(ir).max() * .9)
        print('amb', nm, f'{len(x) / SR:.0f} с')
    for k in ('rat', 'holy'):
        save(os.path.join(a.out, f'ab-{k}.wav'), abil(k))
    print('готово:', a.out)
