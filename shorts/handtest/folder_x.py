#!/usr/bin/env python3
"""Левый край синей обложки ближней папки (6,0–8,7 с): первая длинная синяя серия в строках 260/330/400/470 → folderX.json [t, [x по строкам], медиана]."""
import cv2, numpy as np, json
res = []
for i in range(int(6.0 * 25) + 1, int(8.7 * 25) + 2):
    t = (i - 1) / 25; hsv = cv2.cvtColor(cv2.imread('f25/%03d.png' % i), cv2.COLOR_BGR2HSV).astype(int); xs = []
    for y in (260, 330, 400, 470):
        S, V, H = hsv[y, :, 1], hsv[y, :, 2], hsv[y, :, 0]
        run = np.convolve(((S > 200) & (V > 150) & (H > 98) & (H < 112)).astype(int), np.ones(24, int), 'valid'); idx = np.nonzero(run == 24)[0]
        xs.append(int(idx[0]) if len(idx) else None)
    v = [x for x in xs if x is not None]; res.append((round(t, 2), xs, int(np.median(v)) if v else None))
json.dump(res, open('folderX.json', 'w'))
