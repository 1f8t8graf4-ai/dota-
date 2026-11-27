#!/usr/bin/env python3
"""Кадр из фильма → плоская «рисованная» фигура (27.11, «Твоими глазами»).
Сглаживание без размытия краёв → 5–8 плоских тонов (k-means в Lab) → гладкие границы пятен → вырез фигуры (GrabCut).
  python3 toon.py <кадр> <выход.png> --box x,y,w,h [--k 7] [--fg x,y,rx,ry] [--up 2] [--warm 0.06]
--box — прямоугольник, где стоит человек (для выреза); --fg — эллипс «точно человек» (голова), помогает выреза на светлом фоне.
Выход — PNG с прозрачным фоном. Нужен OpenCV (pip install opencv-python-headless numpy)."""
import argparse
import cv2
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument('src'); ap.add_argument('out')
ap.add_argument('--box', required=True)
ap.add_argument('--fg', action='append', default=[])
ap.add_argument('--bg', action='append', default=[])
ap.add_argument('--k', type=int, default=7)
ap.add_argument('--up', type=float, default=2)
ap.add_argument('--sig', type=float, default=2.2)
ap.add_argument('--warm', type=float, default=0.05)
ap.add_argument('--sat', type=float, default=1.12)
ap.add_argument('--nobg', action='store_true')
ap.add_argument('--poster', default='')       # палитра «тени→свет» через запятую, напр. 1c1512,8d5a43,c98f6e,efc3a2
ap.add_argument('--q', default='0.28,0.55,0.82')  # пороги по квантилям яркости внутри фигуры
ap.add_argument('--red', type=float, default=0)    # >0 — оставить красное (грим, губы) поверх палитры
a = ap.parse_args()

img = cv2.imread(a.src)
x, y, w, h = map(int, a.box.split(','))
pad = 20
X0, Y0 = max(0, x - pad), max(0, y - pad)
img = img[Y0:min(img.shape[0], y + h + pad), X0:min(img.shape[1], x + w + pad)]
img = cv2.resize(img, None, fx=a.up, fy=a.up, interpolation=cv2.INTER_CUBIC)
H, W = img.shape[:2]
s = a.up

# 1) вырез фигуры
mask = np.full((H, W), cv2.GC_PR_BGD, np.uint8)
bx, by = int((x - X0) * s), int((y - Y0) * s)
mask[by:by + int(h * s), bx:bx + int(w * s)] = cv2.GC_PR_FGD
for e in a.fg:
    ex, ey, rx, ry = map(int, e.split(','))
    cv2.ellipse(mask, (int((ex - X0) * s), int((ey - Y0) * s)), (int(rx * s), int(ry * s)), 0, 0, 360, cv2.GC_FGD, -1)
for e in a.bg:
    ex, ey, rx, ry = map(int, e.split(','))
    cv2.ellipse(mask, (int((ex - X0) * s), int((ey - Y0) * s)), (int(rx * s), int(ry * s)), 0, 0, 360, cv2.GC_BGD, -1)
if not a.nobg:
    bgm, fgm = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
    cv2.grabCut(img, mask, None, bgm, fgm, 6, cv2.GC_INIT_WITH_MASK)
    fg = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 1.0, 0.0).astype(np.float32)
else:
    fg = np.ones((H, W), np.float32)
# гладкий край выреза
fg = cv2.GaussianBlur(fg, (0, 0), 3 * s)
fg = np.clip((fg - 0.5) * 6 + 0.5, 0, 1)

# 2) сглаживание: пятна плоские, края резкие
sm = img.copy()
for _ in range(4):
    sm = cv2.bilateralFilter(sm, 9, 38, 7)
sm = cv2.pyrMeanShiftFiltering(sm, int(10 * s), 22)

if a.poster:
    pal = [np.array([int(c[4:6], 16), int(c[2:4], 16), int(c[0:2], 16)], np.float32) for c in a.poster.split(',')]
    Lc = cv2.cvtColor(sm, cv2.COLOR_BGR2LAB).astype(np.float32)
    Lm = cv2.GaussianBlur(Lc[:, :, 0], (0, 0), a.sig * s)
    qs = [float(v) for v in a.q.split(',')]
    th = np.quantile(Lm[fg > 0.5], qs)
    band = np.zeros((H, W), np.int32)
    for t in th:
        band += (Lm > t).astype(np.int32)
    masks = np.stack([cv2.GaussianBlur((band == k).astype(np.float32), (0, 0), a.sig * s) for k in range(len(pal))])
    lbl = masks.argmax(0)
    out = np.stack(pal)[lbl]
    if a.red > 0:
        A = cv2.GaussianBlur(Lc[:, :, 1], (0, 0), a.sig * s)
        rm = cv2.GaussianBlur(((A > 128 + a.red) & (fg > 0.5)).astype(np.float32), (0, 0), a.sig * s) > 0.5
        out[rm] = np.array([40, 40, 190], np.float32)
    out = cv2.resize(out, None, fx=2, fy=2, interpolation=cv2.INTER_NEAREST)
    out = cv2.GaussianBlur(out, (0, 0), 1.0)
    out = cv2.resize(out, (W, H), interpolation=cv2.INTER_AREA)
    cv2.imwrite(a.out, np.dstack([out, fg * 255]).clip(0, 255).astype(np.uint8))
    print(a.out, W, H, 'постер', len(pal)); raise SystemExit
# 3) тона: k-means в Lab
lab = cv2.cvtColor(sm, cv2.COLOR_BGR2LAB).astype(np.float32)
pts = lab.reshape(-1, 3)
sel = fg.reshape(-1) > 0.5
crit = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 60, 0.5)
_, _, centers = cv2.kmeans(pts[sel] if sel.sum() > 1000 else pts, a.k, None, crit, 4, cv2.KMEANS_PP_CENTERS)
d = ((pts[:, None, :] - centers[None, :, :]) ** 2).sum(-1)
lab_lbl = d.argmin(1).reshape(H, W)

# 4) гладкие границы пятен: размытые маски → argmax
sig = a.sig * s
masks = np.stack([cv2.GaussianBlur((lab_lbl == k).astype(np.float32), (0, 0), sig) for k in range(a.k)])
lbl = masks.argmax(0)

# 5) цвета пятен: чуть теплее и сочнее
cols = cv2.cvtColor(centers.reshape(1, -1, 3).astype(np.uint8), cv2.COLOR_LAB2BGR).reshape(-1, 3).astype(np.float32)
hsv = cv2.cvtColor(cols.reshape(1, -1, 3).astype(np.uint8), cv2.COLOR_BGR2HSV).reshape(-1, 3).astype(np.float32)
hsv[:, 1] = np.clip(hsv[:, 1] * a.sat, 0, 255)
cols = cv2.cvtColor(hsv.reshape(1, -1, 3).astype(np.uint8), cv2.COLOR_HSV2BGR).reshape(-1, 3).astype(np.float32)
cols[:, 2] = np.clip(cols[:, 2] * (1 + a.warm), 0, 255)
cols[:, 0] = np.clip(cols[:, 0] * (1 - a.warm * 0.6), 0, 255)
out = cols[lbl]

# 6) сглаживание краёв (рендер в 2× → вниз)
out = cv2.resize(out, None, fx=2, fy=2, interpolation=cv2.INTER_NEAREST)
out = cv2.GaussianBlur(out, (0, 0), 1.0)
out = cv2.resize(out, (W, H), interpolation=cv2.INTER_AREA)
rgba = np.dstack([out, fg * 255]).clip(0, 255).astype(np.uint8)
cv2.imwrite(a.out, rgba)
print(a.out, W, H, 'тонов', a.k)
