#!/usr/bin/env python3
"""QA субтитров: слово на экране совпадает с голосом?
Для 5 случайных слов клипа: в оригинале берём RMS в окне слова [a,b] и в окне [a-0.3,a-0.1]
(до слова). Если в окне слова голос есть, а окно 'до слова' тише — субтитр не отстаёт.
Отставание оцениваем поиском фронта голоса: первые 30 мс-кадры окна слова, где RMS
превышает floor+6дБ; сдвиг фронта от a должен быть ≤0,15 с."""
import json, sys, subprocess
import numpy as np

def pcm(mp4):
    return subprocess.run(['ffmpeg', '-v', 'error', '-i', mp4, '-ac', '1', '-ar', '16000',
                           '-f', 's16le', '-'], capture_output=True).stdout

def check(clip, words_json, t0, n=5):
    x = np.frombuffer(pcm(clip), '<i2').astype(float) / 32768
    ws = [(w, a, b) for w, a, b in json.load(open(words_json))
          if t0 + 0.3 <= a <= t0 + 55]
    rng = np.random.RandomState(7)
    picks = rng.choice(len(ws), size=min(n, len(ws)), replace=False)
    flo = np.percentile(20 * np.log10(np.sqrt(np.convolve(x ** 2, np.ones(160) / 160, 'same') + 1e-9) + 1e-9), 20)
    out, worst = [], 0.0
    for i in picks:
        w, a, b = ws[i]
        if b - a > 1.5 or b - a < 0.08:
            continue
        a -= t0
        k = int(a * 16000)
        if k >= len(x) - 160:
            continue  # слово за краем клипа
        win = x[k:k + max(160, min(int((b - a) * 16000), len(x) - k))]
        rms = np.sqrt(np.convolve(win ** 2, np.ones(480) / 480, 'same') + 1e-9)
        db = 20 * np.log10(rms + 1e-9)
        onset = next((j / 16000 for j, v in enumerate(db) if v > flo + 6), None)
        lag = onset if onset is not None else 0.30  # голос так и не поднялся внутри слова
        worst = max(worst, lag)
        out.append((w, round(lag, 2)))
    return out, worst

if __name__ == '__main__':
    clip, wj, t0 = sys.argv[1], sys.argv[2], float(sys.argv[3])
    out, worst = check(clip, wj, t0)
    for w, lag in out:
        mark = 'OK ' if lag <= 0.15 else 'ЗАПАЗДЫВАЕТ'
        print(f'  {mark} {w:15s} фронт голоса через {lag:.2f} с после начала слова')
    print(f'  худшее: {worst:.2f} с → {"ПРОЙДЕНО (≤0,15)" if worst <= 0.15 else "НЕ ПРОЙДЕНО"}')
