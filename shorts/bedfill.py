#!/usr/bin/env python3
"""v22.6 (22.11): музыка играет всегда (Андрей: «музыка должна играть всегда, просто где-то тише, где-то громче»).
У грува Кашалота (подложка «Льда», глав 2–5) в конце каждого такта ~0,5 с почти тишины (−45…−50 дБ) — под голосом это слышно как «музыка пропала».
fill(x) заливает эти дыры звуком самого трека: гармоническая часть (медиана спектра по времени за 1,2 с — ударные не проходят, аккорд такта держится
через паузу) пересинтезируется ровным «пэдом» и подмешивается тем сильнее, чем тише грув в этот момент. Тональность не угадываем — это тот же трек.
  python3 bedfill.py <вход.wav> <выход.wav>   (проверка: уровень по 0,1 с до и после)"""
import sys
import numpy as np, soundfile as sf

N, HOP = 4096, 1024


def stft(x):
    w = np.hanning(N); n = 1 + (len(x) - N) // HOP if len(x) >= N else 1
    x = np.pad(x, (0, max(0, (n - 1) * HOP + N - len(x))))
    return np.stack([np.fft.rfft(x[i * HOP:i * HOP + N] * w) for i in range(n)], 1)


def istft(S, n):
    w = np.hanning(N); out = np.zeros(n + N); ws = np.zeros(n + N)
    for i in range(S.shape[1]):
        out[i * HOP:i * HOP + N] += np.fft.irfft(S[:, i], N) * w; ws[i * HOP:i * HOP + N] += w * w
    return (out / np.maximum(ws, .5 * ws.max()))[:n]   # у краёв окна почти нулевые — без деления на ноль


def tmedian(M, k):   # медиана по времени окном k кадров (по полосам, чтобы не съесть память)
    h = k // 2; P = np.pad(M, ((0, 0), (h, h)), mode='edge'); out = np.empty_like(M)
    for i in range(M.shape[1]): out[:, i] = np.median(P[:, i:i + k], 1)
    return out


def env(x, sr, w=.05):   # огибающая уровня, сглаженная
    hop = int(w * sr); e = np.sqrt(np.convolve(x ** 2, np.ones(hop) / hop, 'same') + 1e-12); return e


def fill(x, sr, pad_db=-10., gap_db=9., seed=226):
    """x — стерео (n, 2). Возвращает грув + «пэд»; в дырах пэд громче на gap_db."""
    rng = np.random.default_rng(seed); n = len(x); m = x.mean(1)
    S = stft(m); M = np.abs(S); fr = np.fft.rfftfreq(N, 1 / sr)
    H = tmedian(M, int(round(1.2 * sr / HOP)) | 1)                                     # гармоника, держится через паузу
    tilt = 1 / (1 + (fr / 2600) ** 4) * (1 - 1 / (1 + (fr / 70) ** 4))                  # без верха (тарелки) и без самого низа (бочка)
    Hs = H ** 1.6; Hs *= H.sum(0, keepdims=True) / (Hs.sum(0, keepdims=True) + 1e-9)        # пики (ноты) острее, шум тише
    k = np.arange(M.shape[0])[:, None]; adv = 2 * np.pi * k * HOP / N                        # фаза идёт ровно — каждая полоса тянет ноту, а не шипит
    out = []
    for ch in range(2):
        ph = np.exp(1j * (2 * np.pi * rng.random((M.shape[0], 1)) + adv * np.arange(M.shape[1])[None, :])); out.append(istft(Hs * tilt[:, None] * ph, n))
    pad = np.stack(out, 1); pad /= np.sqrt(np.mean(pad ** 2)) + 1e-9
    e = env(m, sr); ref = np.percentile(e, 70); hole = np.clip((20 * np.log10(ref / e) - 6) / 10, 0, 1)   # 0 — грув на месте, 1 — дыра (−16 дБ и тише)
    hole = np.convolve(hole, np.ones(int(.06 * sr)) / int(.06 * sr), 'same')
    g = ref * 10 ** (pad_db / 20) * 10 ** (gap_db * hole / 20)
    return x + pad * g[:, None]


def report(x, sr, tag):
    m = x.mean(1); w = int(.1 * sr); L = np.array([20 * np.log10(np.sqrt(np.mean(m[i:i + w] ** 2)) + 1e-9) for i in range(0, len(m) - w, w)])
    ref = np.median(L); holes = (L < ref - 12).sum()
    print(f'{tag}: медиана {ref:.1f} дБ, окон по 0,1 с тише медианы на 12 дБ: {holes} из {len(L)}, минимум {L.min():.1f}')


if __name__ == '__main__':
    x, sr = sf.read(sys.argv[1], dtype='float64'); report(x, sr, 'было'); y = fill(x, sr); report(y, sr, 'стало'); sf.write(sys.argv[2], y, sr, subtype='PCM_16')
