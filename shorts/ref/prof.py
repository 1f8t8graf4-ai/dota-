#!/usr/bin/env python3
"""Плавность ролика в цифрах (16.11). Сравнивает наш ролик с референсом Боба по движению кадра.
  python3 ref/prof.py <наш.mp4> [--ref $BOB_REF/cola.mp4] [--from 0 --to 21] [--png /tmp/graph.png]
Считает разницу соседних кадров (уменьшенных, в сером):
  стоит      — кадр почти не меняется (< 0,15). У Колы 6 %, у v18.4 — 18 %. Цель ≤ 8 %.
  паузы      — куски «стоит» дольше 0,5 с. У Колы 2 на 74 с, у v18.4 — 11 (8 с). Цель — 0 на пробе.
  рывкость   — насколько резко меняется скорость от кадра к кадру. У Колы 0,80, у v18.4 — 1,21. Цель ≤ 0,90.
--png — график скорости по времени (сверху наш, снизу референс): ступеньки и провалы до нуля = «старт-стоп»."""
import argparse, subprocess
import numpy as np
from PIL import Image, ImageDraw

FPS = 30


def speeds(f, a=None, b=None):
    w, h = map(int, subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', f],
                                   capture_output=True, text=True, check=True).stdout.strip().split(','))
    W, H = (192, 108) if w > h else (108, 192)
    cmd = ['ffmpeg', '-v', 'error']
    if a is not None: cmd += ['-ss', str(a)]
    cmd += ['-i', f]
    if b is not None: cmd += ['-t', str(b - (a or 0))]
    cmd += ['-vf', f'fps={FPS},scale={W}:{H},format=gray', '-f', 'rawvideo', '-']
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    x = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)
    return np.abs(np.diff(x, axis=0)).mean(axis=(1, 2))


def report(name, d):
    st = d < .15; n = len(d); runs = []; i = 0
    while i < n:
        if st[i]:
            j = i
            while j < n and st[j]: j += 1
            if j - i >= 15: runs.append((round(i / FPS, 2), round((j - i) / FPS, 2)))
            i = j
        else: i += 1
    mov = d[1:] > .5; jerk = float(np.abs(np.diff(d))[mov].mean()) if mov.any() else 0
    print(f'{name}: {n / FPS:.1f} с')
    print(f'  стоит       {st.mean() * 100:5.1f} %   (цель ≤ 8 %)')
    print(f'  паузы ≥0,5с {len(runs)}  ({sum(r[1] for r in runs):.1f} с) {runs[:12]}')
    print(f'  рывкость    {jerk:5.2f}     (цель ≤ 0,90)')
    print(f'  скорость    {float(d[d >= .15].mean()) if (d >= .15).any() else 0:5.2f}     (у Колы ≈ 4,6)')
    return dict(stoit=st.mean(), pauz=len(runs), jerk=jerk)


def graph(rows, png):
    Wd, Hr = 1600, 260; img = Image.new('RGB', (Wd, Hr * len(rows) + 10), '#111'); g = ImageDraw.Draw(img)
    for k, (name, d) in enumerate(rows):
        y0 = k * Hr + 10; n = len(d); top = 16.0
        g.text((8, y0), name, fill='#ddd')
        g.line([(0, y0 + Hr - 20 - .15 / top * (Hr - 40)), (Wd, y0 + Hr - 20 - .15 / top * (Hr - 40))], fill='#844', width=1)
        pts = [(i / max(1, n - 1) * Wd, y0 + Hr - 20 - min(d[i], top) / top * (Hr - 40)) for i in range(n)]
        g.line(pts, fill='#7dd3fc' if k == 0 else '#fbbf24', width=2)
        for s in range(0, int(n / FPS) + 1, 5):
            x = s * FPS / max(1, n - 1) * Wd; g.line([(x, y0 + Hr - 20), (x, y0 + Hr - 14)], fill='#777'); g.text((x + 2, y0 + Hr - 16), f'{s}с', fill='#777')
    img.save(png); print('график:', png)


if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('video'); ap.add_argument('--ref'); ap.add_argument('--from', dest='a', type=float)
    ap.add_argument('--to', dest='b', type=float); ap.add_argument('--png'); o = ap.parse_args()
    d = speeds(o.video, o.a, o.b); rows = [('наш', d)]; report('наш', d)
    if o.ref:
        r = speeds(o.ref); rows.append(('референс', r)); report('референс', r)
    if o.png: graph(rows, o.png)
