#!/usr/bin/env python3
"""Как уезжает стол (3,8–6,4 с): фазовая корреляция линий древесины в полосе y 80–220 между соседними кадрами → tableD.json [t, dx, сумма, отклик]."""
import cv2, numpy as np, json
prev = None; D = 0; out = []
for i in range(int(3.8 * 25) + 1, int(6.4 * 25) + 2):
    t = (i - 1) / 25; im = cv2.imread('f25/%03d.png' % i, 0).astype(np.float32); s = im[80:220, :]
    hp = s - cv2.GaussianBlur(s, (0, 0), 6)
    if prev is not None:
        (dx, dy), r = cv2.phaseCorrelate(prev, hp, np.outer(np.hanning(hp.shape[0]), np.hanning(hp.shape[1])).astype(np.float32))
        D += dx; out.append((round(t, 2), round(dx, 1), round(D, 1), round(r, 3)))
    prev = hp
json.dump(out, open('tableD.json', 'w'))
