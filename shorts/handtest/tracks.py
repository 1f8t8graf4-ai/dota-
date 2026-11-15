#!/usr/bin/env python3
"""Трек сцены «передача папки в архив» (референс Google 0:32–0:42,5) → test/tracks.json, 30 к/с, координаты референса (1920×1080).
Стопка, руки — по кадрам (meas.py, trackh.py), стол и архив — фазовая корреляция, камера 9:16 — пружина за стопкой."""
import json, math, numpy as np

FPS, DUR = 30, 10.5
T = np.arange(int(round(DUR * FPS)) + 1) / FPS

def pchip(ts, vs, t):
    ts = np.asarray(ts, float); vs = np.asarray(vs, float); h = np.diff(ts); d = np.diff(vs) / h
    m = np.zeros_like(vs)
    for i in range(1, len(vs) - 1):
        if d[i - 1] * d[i] > 0:
            w1, w2 = 2 * h[i] + h[i - 1], h[i] + 2 * h[i - 1]; m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i])
    m[0], m[-1] = d[0], d[-1]
    t = np.clip(np.asarray(t, float), ts[0], ts[-1]); i = np.clip(np.searchsorted(ts, t) - 1, 0, len(h) - 1)
    s = (t - ts[i]) / h[i]; h00, h10, h01, h11 = 2*s**3 - 3*s**2 + 1, s**3 - 2*s**2 + s, -2*s**3 + 3*s**2, s**3 - s**2
    return h00 * vs[i] + h10 * h[i] * m[i] + h01 * vs[i + 1] + h11 * h[i] * m[i + 1]

def smooth(v, sig):
    if sig <= 0: return v
    r = int(3 * sig); k = np.exp(-np.arange(-r, r + 1) ** 2 / (2 * sig * sig)); k /= k.sum()
    p = np.r_[np.full(r, v[0]), v, np.full(r, v[-1])]; return np.convolve(p, k, 'valid')

# ---------- стопка ----------
SK = [  # t, x, y, угол (° по часовой, непрерывно)
 (0.40, 2150, 497, 4), (0.48, 1930, 494, -48), (0.56, 1710, 491, -100), (0.64, 1490, 487, -152.1), (0.72, 1288.4, 481.9, -202.0),
 (0.80, 1112.8, 476.6, -241.5), (0.88, 975.0, 472.4, -274.5), (0.96, 868.9, 469.4, -299.0), (1.04, 787.4, 467.1, -318.1),
 (1.12, 724.1, 465.6, -333.1), (1.20, 674.8, 464.3, -343.7), (1.28, 636.3, 463.1, -354.9), (1.36, 606.5, 462.4, -361.0),
 (1.44, 581.4, 461.8, -366.7), (1.52, 564.8, 463.1, -370), (1.60, 556.9, 463.8, -373), (1.68, 548.5, 459.4, -374),
 (1.76, 543, 458.5, -375), (1.84, 544.7, 460.9, -374.5), (1.92, 541.9, 460.4, -373.5), (2.00, 534.6, 461.6, -372.5),
 (2.08, 516.0, 464.9, -371), (2.16, 468.9, 471.8, -366), (2.24, 437.7, 473.3, -362.5), (2.32, 426.2, 473.8, -361.3),
 (2.40, 421.4, 474.1, -361.2), (2.48, 420.3, 474.1, -361), (2.56, 422.9, 472.8, -360.5), (2.64, 430.8, 474.0, -360.2),
 (2.72, 448.6, 473.8, -361), (2.80, 485.3, 469.5, -362.5), (2.88, 569.7, 462, -366), (2.96, 709.4, 491.9, -369.5),
 (3.04, 883.2, 523.1, -371), (3.12, 1044.2, 562.4, -369.7), (3.20, 1160.7, 587.2, -367.8), (3.28, 1250.1, 606.4, -367.2),
 (3.36, 1322.5, 619.6, -366.4), (3.48, 1387.2, 634.6, -365.5), (3.60, 1423.5, 643.6, -365.0), (3.72, 1433.4, 645.8, -364.86),
 (3.84, 1434.7, 645.8, -364.83), (3.96, 1430.6, 645.7, -364.82), (4.08, 1423.9, 645.6, -364.85), (4.20, 1413.5, 645.5, -364.82),
 (4.32, 1399.3, 645.5, -364.8), (4.44, 1378.4, 645.6, -364.76), (4.56, 1351.0, 646.0, -364.75), (4.68, 1326.2, 645.7, -364.74),
 (4.80, 1291.6, 645.7, -364.75), (4.92, 1250.5, 645.6, -364.74), (5.04, 1199.9, 645.6, -364.71), (5.16, 1143.4, 645.6, -364.68),
 (5.28, 1078.7, 645.2, -364.57), (5.40, 1011.4, 644.85, -364.53), (5.52, 926.4, 644.65, -364.36), (5.64, 830.0, 643.6, -364.08),
 (5.76, 706.0, 642.7, -363.72), (5.88, 558.7, 641.5, -363.4), (6.00, 397.3, 639.55, -362.73), (6.12, 302.5, 636.5, -361.9),
 (6.24, 361.2, 632.75, -360.38), (6.36, 623.7, 628.1, -358.33), (6.48, 927.8, 623.4, -356.27), (6.60, 1120.6, 620.5, -354.95),
 (6.72, 1227.5, 619.45, -353.79), (6.84, 1316, 612, -353.4), (6.92, 1342, 608, -353.2), (7.00, 1360, 605, -353.0),
 (7.08, 1372, 603, -352.8), (7.16, 1378, 601, -352.6), (7.24, 1381, 600, -352.4), (7.32, 1381, 599, -352.2),
 (7.40, 1377, 598.5, -351.9), (7.56, 1366, 598, -351.4), (7.72, 1350, 597.5, -351.0), (7.96, 1324, 597, -350.6),
 (8.20, 1302, 597, -350.3), (8.60, 1300, 597, -350.3)]
sk = np.array(SK, float)
stx = smooth(pchip(sk[:, 0], sk[:, 1], T), 1.0); sty = smooth(pchip(sk[:, 0], sk[:, 2], T), 1.0); sta = smooth(pchip(sk[:, 0], sk[:, 3], T), 1.0)
stx[T < 0.40] = 2150 + (0.40 - T[T < 0.40]) * 2750; sta[T < 0.40] = 4

# ---------- мир: стол уезжает, архив въезжает ----------
D = json.load(open('tableD.json'))
Wk = [(3.80, 0.0)] + [(t, d) for t, dx, d, r in D if t <= 6.04]
FX = json.load(open('folderX.json'))
X_C0 = 4091.0
xc = {}
for t, xs, med in FX:
    if t >= 6.40 and xs[2] is not None and xs[3] is not None: xc[round(t, 2)] = (xs[2] + xs[3]) / 2
    elif t >= 6.40 and xs[0] is not None and xs[0] < 1800: xc[round(t, 2)] = xs[0] + 116
for t in np.arange(6.08, 6.39, 0.04): Wk.append((round(t, 2), -2869 + 1390 * math.exp(-1.87 * (t - 6.0))))
for t in sorted(xc):
    if t in (7.12, 7.60, 8.08): continue       # рука закрывает край обложки
    Wk.append((t, xc[t] - X_C0))
Wk.append((8.7, 1222 - X_C0)); Wk.append((10.6, 1222 - X_C0))
Wk.sort(); wk = np.array(Wk, float)
W = pchip(wk[:, 0], wk[:, 1], T); W[T < 3.8] = 0; W = smooth(W, 2.0)

# наклон камеры в конце (мир едет вниз), px референса
WY = [(8.60, 0), (8.64, 0), (8.76, 6), (8.88, 19), (9.00, 42), (9.12, 78), (9.24, 134), (9.36, 225), (9.48, 384), (9.60, 632),
      (9.72, 824), (9.84, 934), (9.96, 1000), (10.08, 1041), (10.20, 1068), (10.32, 1084), (10.44, 1092), (10.56, 1094)]
wy = np.array(WY, float); Wy = pchip(wy[:, 0], wy[:, 1], T); Wy[T < 8.6] = 0; Wy = smooth(Wy, 1.2)

# ---------- руки ----------
H1 = json.load(open('trk_h1.json')); H2 = json.load(open('trk_h2.json'))
def track(rows, t0, t1):
    return [(t, r[0], r[1], -r[2]) for t, r in rows if r and t0 <= t <= t1]
h1hold = [(1.10, -200, 255, 44), (1.20, -40, 253, 38), (1.24, 70, 256, 30), (1.32, 218, 255, 15)] + track(H1['hold'], 1.44, 2.96)
h1open = [(2.98, 574, 266, 2)] + track(H1['open'], 3.04, 3.60) + [(3.64, 515, 135, -4), (3.68, 440, 35, -2), (3.72, 365, -55, 0), (3.76, 325, -125, 0), (3.80, 295, -175, 0), (3.88, 230, -320, 0), (4.0, 160, -500, 0)]
h2 = [(3.16, 1830, 1130, 42), (3.22, 1730, 1040, 34), (3.28, 1645, 965, 27)] + track(H2['h2'], 3.36, 8.32) + [(8.40, 852, 1150, -30), (8.48, 792, 1268, -36), (8.56, 742, 1395, -40), (8.70, 690, 1600, -44)]
def curve(keys, sig_xy=1.0, sig_a=2.5):
    k = np.array(keys, float); return (smooth(pchip(k[:, 0], k[:, 1], T), sig_xy), smooth(pchip(k[:, 0], k[:, 2], T), sig_xy), smooth(pchip(k[:, 0], k[:, 3], T), sig_a), k[0, 0], k[-1, 0])
h1h, h1o, h2c = curve(h1hold), curve(h1open), curve(h2, 1.2, 3.0)

# подлёт руки №1 (1,08–1,47): раскрытая кисть (поза 35,16 с), совмещённая с позой «держит» по манжете и направлению руки
HJ = json.load(open('hands.json'))
def cuff_c(h):
    L = [l for l in h['layers'] if l['name'] == 'cuff'][0]; P = np.array(L['paths'][0], float); return P.mean(0)
def arm_a(h):
    q = np.array([l for l in h['layers'] if l['name'] == 'sleeve'][0]['paths'][-1], float)
    d = (q[2] + q[3]) / 2 - (q[0] + q[1]) / 2; return math.degrees(math.atan2(d[0], -d[1]))
bh = np.array([(HJ['hand1']['box'][2] - HJ['hand1']['box'][0]) / 2, 260.0]); bo = np.array([(HJ['hand1open']['box'][2] - HJ['hand1open']['box'][0]) / 2, 260.0])
ch, co, ah, ao = cuff_c(HJ['hand1']), cuff_c(HJ['hand1open']), arm_a(HJ['hand1']), arm_a(HJ['hand1open'])
rot = lambda a, v: np.array([v[0] * math.cos(math.radians(a)) - v[1] * math.sin(math.radians(a)), v[0] * math.sin(math.radians(a)) + v[1] * math.cos(math.radians(a))])
def to_open(x, y, a):
    cw = np.array([x, y]) + rot(a, ch - bh); ao2 = a + ah - ao; p = cw - rot(ao2, co - bo); return p[0], p[1], ao2
h1in_k = []
for t in np.arange(1.08, 1.505, 1 / FPS):
    i = int(round(t * FPS)); h1in_k.append((t,) + to_open(h1h[0][i], h1h[1][i], h1h[2][i]))
h1in = curve(h1in_k, 0, 0)
print('cuff hold', ch.round(1), 'open', co.round(1), 'arm', round(ah, 1), round(ao, 1))

# ---------- камера 9:16 (центр окна в координатах референса), S = 1.12 ----------
S = 1.12
def tgt(t, sx):
    if t < 1.40: return 560 + (sx - 560) * 0 if False else 560.0
    if t < 2.90: return sx + 30
    if t < 6.20: return sx
    xcv = X_C0 + float(np.interp(t, T, W)) + 120
    if t < 7.40: u = (t - 6.20) / 1.2; u = u * u * (3 - 2 * u); return sx * (1 - u) + xcv * u
    return xcv
I = np.array([tgt(t, x) for t, x in zip(T, stx)])
C = np.zeros_like(T); v = 0.0; C[0] = 690.0; w = 8.0; dt = 1 / FPS
for i in range(1, len(T)):
    for _ in range(8):  # подшаги
        h = dt / 8; a = w * w * (I[i] - C[i - 1] if _ == 0 else I[i] - c) - 2 * w * v
        c = (C[i - 1] if _ == 0 else c) + v * h; v += a * h
    C[i] = c

out = {'fps': FPS, 'dur': DUR, 'S': S, 'Cy': 560, 'XC0': X_C0, 'KY': 1.3,
       'stack': [[round(a, 2), round(b, 2), round(c, 3)] for a, b, c in zip(stx, sty, sta)],
       'W': [round(x, 2) for x in W], 'Wy': [round(x, 2) for x in Wy], 'C': [round(x, 2) for x in C],
       'h1hold': {'x': [round(x, 2) for x in h1h[0]], 'y': [round(x, 2) for x in h1h[1]], 'a': [round(x, 3) for x in h1h[2]], 't0': h1h[3], 't1': h1h[4]},
       'h1open': {'x': [round(x, 2) for x in h1o[0]], 'y': [round(x, 2) for x in h1o[1]], 'a': [round(x, 3) for x in h1o[2]], 't0': h1o[3], 't1': h1o[4]},
       'h1in': {'x': [round(x, 2) for x in h1in[0]], 'y': [round(x, 2) for x in h1in[1]], 'a': [round(x, 3) for x in h1in[2]], 't0': h1in[3], 't1': h1in[4]},
       'h2': {'x': [round(x, 2) for x in h2c[0]], 'y': [round(x, 2) for x in h2c[1]], 'a': [round(x, 3) for x in h2c[2]], 't0': h2c[3], 't1': h2c[4]}}
json.dump(out, open('test/tracks.json', 'w'))
for t in (0.5, 1.0, 1.5, 2.5, 3.0, 3.5, 4.5, 5.5, 6.2, 6.8, 7.5, 8.5, 9.5, 10.4):
    i = int(round(t * FPS)); print(f"{t:5.2f} stack=({stx[i]:.0f},{sty[i]:.0f},{sta[i]:.1f}) W={W[i]:.0f} Wy={Wy[i]:.0f} C={C[i]:.0f} I={I[i]:.0f} xC={X_C0+W[i]:.0f}")

# ---------- конец (8,6–10,5): стопка вылетает, в координатах кадра 1080×1920 ----------
P_K = [(8.60, 0), (8.92, 0), (9.00, .044), (9.08, .104), (9.16, .178), (9.24, .265), (9.32, .357), (9.40, .439), (9.48, .535), (9.56, .65),
       (9.60, .72), (9.68, .84), (9.76, .915), (9.84, .955), (9.92, .975), (10.00, .988), (10.08, .995), (10.16, .998), (10.30, 1), (10.6, 1)]
Q_K = [(8.60, 0), (8.95, 0), (9.04, .007), (9.12, .035), (9.20, .06), (9.28, .115), (9.36, .195), (9.44, .33), (9.52, .47), (9.60, .59), (9.68, .706),
       (9.76, .792), (9.84, .844), (9.92, .894), (10.00, .93), (10.08, .952), (10.16, .97), (10.24, .985), (10.32, .992), (10.40, .997), (10.5, 1), (10.6, 1)]
pk, qk = np.array(P_K), np.array(Q_K)
EP = np.clip(smooth(pchip(pk[:, 0], pk[:, 1], T), 1.0), 0, 1); EQ = np.clip(smooth(pchip(qk[:, 0], qk[:, 1], T), 1.0), 0, 1)
EP[T < 8.9] = 0; EQ[T < 8.93] = 0
out['endP'] = [round(x, 4) for x in EP]; out['endQ'] = [round(x, 4) for x in EQ]
json.dump(out, open('test/tracks.json', 'w'))
H = json.load(open('hands.json'))
open('test/data.js', 'w').write('window.HANDS=' + json.dumps(H, separators=(',', ':')) + ';\nwindow.TR=' + json.dumps(out, separators=(',', ':')) + ';\n')
print('data.js ok', round(len(open('test/data.js').read()) / 1024), 'KB')
