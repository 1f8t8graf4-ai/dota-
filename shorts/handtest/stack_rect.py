#!/usr/bin/env python3
"""Стопка по кадрам: minAreaRect выпуклой оболочки бумаги → stack.json [t, [cx, cy, w, h, угол, площадь]]."""
import cv2, numpy as np, json
res = []
for i in range(1, 266):
    im = cv2.imread('f25/%03d.png' % i); hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV).astype(int)
    S, V = hsv[..., 1], hsv[..., 2]; B, G, R = [im[..., k].astype(int) for k in range(3)]
    pap = ((V >= 185) & (S <= 75) & ((B - R) <= 4)).astype(np.uint8) * 255
    pap = cv2.morphologyEx(pap, cv2.MORPH_CLOSE, np.ones((13, 13), np.uint8))
    n, lab, st, cen = cv2.connectedComponentsWithStats(pap, 8); t = (i - 1) / 25; best = None
    for k in range(1, n):
        if st[k, 4] > 40000 and st[k, 3] < 900 and (best is None or st[k, 4] > st[best, 4]): best = k
    if best is None: res.append([t, None]); continue
    pts = np.column_stack(np.nonzero(lab == best))[:, ::-1].astype(np.float32)
    (cx, cy), (w, h), ang = cv2.minAreaRect(cv2.convexHull(pts))
    if w > h: w, h, ang = h, w, ang - 90
    if ang < -45: ang += 90
    if ang > 45: ang -= 90
    res.append([t, [round(cx, 1), round(cy, 1), round(w, 1), round(h, 1), round(ang, 2), int(st[best, 4])]])
json.dump(res, open('stack.json', 'w'))
