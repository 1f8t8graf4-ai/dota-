#!/usr/bin/env python3
"""Векторизация рук из кадров референса Google («ОТКРОЙ ГЛАЗА», 0:32–0:42,5).
Каждый слой — маска по цвету → контуры OpenCV → многоугольники (Path2D) + линейный градиент, подобранный по пикселям слоя.
python3 hand_vec.py → hands.json, check.png (оригинал | вектор)
"""
import cv2, json, numpy as np

FR = 'f25/%03d.png'          # кадры 25 к/с, 001 = 32,00 с
fr = lambda t: cv2.imread(FR % (int(round((t - 32.0) * 25)) + 1))


def hsv_split(roi):
    h = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV).astype(int)
    b, g, r = [roi[..., i].astype(int) for i in range(3)]
    return h[..., 0], h[..., 1], h[..., 2], r, g, b


def clean(m, k=2, mn=60):
    m = m.astype(np.uint8) * 255
    if k: m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((k, k), np.uint8)); m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((k + 1, k + 1), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(m, 8)
    out = np.zeros_like(m)
    for i in range(1, n):
        if st[i, cv2.CC_STAT_AREA] >= mn: out[lab == i] = 255
    return out


def largest(m):
    n, lab, st, _ = cv2.connectedComponentsWithStats(m, 8)
    if n <= 1: return m
    i = 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA])); return np.where(lab == i, 255, 0).astype(np.uint8)


def paths(m, eps=.7):
    """контур с подпиксельной гладкостью: маска ×4, размытие, порог, контур, упрощение, обратно /4"""
    U = 4
    up = cv2.resize(m, None, fx=U, fy=U, interpolation=cv2.INTER_LINEAR)
    up = cv2.GaussianBlur(up, (0, 0), 3.2)
    _, up = cv2.threshold(up, 127, 255, cv2.THRESH_BINARY)
    cs, hier = cv2.findContours(up, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    out = []
    for c in cs:
        if cv2.contourArea(c) < 12 * U * U: continue
        a = cv2.approxPolyDP(c, eps * U * .9, True).reshape(-1, 2)
        if len(a) >= 3: out.append(a.astype(float) / U + (.5 / U - .5))
    return out


def grad(roi, m):
    """линейный градиент цвета слоя: RGB = a + b·x + c·y по пикселям маски → две точки и два цвета"""
    ys, xs = np.nonzero(m)
    if len(xs) < 30:
        c = roi[ys, xs].mean(0) if len(xs) else np.zeros(3); return {'c': '#%02x%02x%02x' % tuple(int(v) for v in c[::-1])}
    A = np.c_[np.ones(len(xs)), xs, ys]; col = roi[ys, xs][:, ::-1].astype(float)
    k, *_ = np.linalg.lstsq(A, col, rcond=None)
    L = k[1:] @ np.array([.3, .59, .11])          # направление роста яркости
    n = np.hypot(*L)
    if n < 1e-3: c = col.mean(0); return {'c': '#%02x%02x%02x' % tuple(int(v) for v in c)}
    d = L / n; p = xs * d[0] + ys * d[1]; p0, p1 = np.percentile(p, 2), np.percentile(p, 98)
    cx, cy = xs.mean(), ys.mean(); pc = cx * d[0] + cy * d[1]
    P0 = (cx + (p0 - pc) * d[0], cy + (p0 - pc) * d[1]); P1 = (cx + (p1 - pc) * d[0], cy + (p1 - pc) * d[1])
    ev = lambda P: np.clip(k[0] + k[1] * P[0] + k[2] * P[1], 0, 255)
    hx = lambda c: '#%02x%02x%02x' % tuple(int(round(v)) for v in c)
    return {'g': [round(P0[0], 1), round(P0[1], 1), round(P1[0], 1), round(P1[1], 1)], 'c0': hx(ev(P0)), 'c1': hx(ev(P1))}


def kmeans_split(roi, m, k):
    ys, xs = np.nonzero(m); px = roi[ys, xs].astype(np.float32)
    crit = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 40, .3)
    _, lab, cen = cv2.kmeans(px, k, None, crit, 4, cv2.KMEANS_PP_CENTERS)
    order = np.argsort(cen.sum(1))                  # от тёмного к светлому
    out = []
    for j in order:
        mm = np.zeros(m.shape, np.uint8); sel = lab.ravel() == j; mm[ys[sel], xs[sel]] = 255; out.append((mm, cen[j]))
    return out


def sleeve_ext(m, y0, y1, yto, side='both'):
    """боковые края рукава в строках y0..y1 → общее направление руки (средний наклон) → параллельное продолжение до yto (рука уходит за кадр)"""
    rows = [y for y in range(y0, y1) if m[y].any()]
    L_ = np.array([[y, np.nonzero(m[y])[0].min()] for y in rows], float); R_ = np.array([[y, np.nonzero(m[y])[0].max()] for y in rows], float)
    bl, br = np.polyfit(L_[:, 0], L_[:, 1], 1)[0], np.polyfit(R_[:, 0], R_[:, 1], 1)[0]
    b = float(np.clip({'both': (bl + br) / 2, 'left': bl, 'right': br}[side], -.6, .6))
    e = 0 if yto < rows[0] else -1                       # край, от которого продолжаем
    ye = L_[e, 0]; xl, xr = L_[e, 1] - .5, R_[e, 1] + .5
    yA = ye + (3 if yto < ye else -3)
    q = [[xl + b * (yA - ye), yA], [xr + b * (yA - ye), yA], [xr + b * (yto - ye), yto], [xl + b * (yto - ye), yto]]
    return [[round(float(x), 1), round(float(y), 1)] for x, y in q]


def layer(name, roi, m, eps=.7, solid=None, gm=None):
    L = {'name': name, 'paths': [[[round(x, 1), round(y, 1)] for x, y in p] for p in paths(m, eps)]}
    L.update({'c': solid} if solid else grad(roi, m if gm is None else gm)); return L


def hand2():
    """рука №2 (36,5 с): кисть с перстнями поверх стопки, белая гранёная манжета, терракотовый рукав"""
    t = 36.5; im = fr(t); X0, Y0, X1, Y1 = 1080, 440, 1500, 1080
    roi = im[Y0:Y1, X0:X1]; H, S, V, R, G, B = hsv_split(roi); yy = np.arange(roi.shape[0])[:, None] + 0 * H
    sleeve = clean((H <= 12) & (S >= 110) & (V >= 150) & (yy >= 470), 3)
    sleeve = largest(sleeve)
    stop = np.argwhere(sleeve.any(1)).min()                        # верх рукава
    skinA = (H >= 9) & (H <= 23) & (S >= 55) & (S <= 185) & (V >= 140)
    gold = clean((H >= 14) & (H <= 28) & (S >= 150) & (V >= 170) & (yy < stop - 120), 1, 20)
    teal = clean((H >= 75) & (H <= 100) & (S >= 90) & (V >= 120), 1, 8)
    nail = clean(((H <= 9) | (H >= 170)) & (S >= 110) & (V >= 150) & (yy < stop - 60), 1, 20)
    skin = clean(skinA & (yy < stop), 2)
    body = largest(clean((skin > 0) | (gold > 0) | (teal > 0) | (nail > 0), 0))
    body = cv2.morphologyEx(body, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    wb = np.argwhere(body[:stop].any(1)).max()                     # низ запястья
    # манжета: холодный белый → серо-голубой (бумага тёплая: R − B ≥ 3), от кончиков «юбочки» до рукава
    cand = clean((S <= 48) & (V >= 115) & ((B - R) >= -1) & (yy > wb - 36) & (yy <= stop + 4), 3)   # верх «зубцов» манжеты — на 33 px выше запястья; выше — полоска стопки
    core = largest(cv2.erode(cand, np.ones((9, 9), np.uint8)))       # эрозия рвёт тонкую связь с углом стопки
    cuff = cv2.bitwise_and(cv2.dilate(core, np.ones((11, 11), np.uint8)), cand)
    cuff = cv2.morphologyEx(cuff, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    # боковые края манжеты — прямые по её чистой нижней половине (там нет бумаги), продолжаем вверх; что левее/правее — угол стопки
    rows = [y for y in range(stop - 45, stop - 4) if cuff[y].any()]
    if len(rows) > 10:
        L_ = np.array([[y, np.nonzero(cuff[y])[0].min()] for y in rows], float); R_ = np.array([[y, np.nonzero(cuff[y])[0].max()] for y in rows], float)
        kl = np.polyfit(L_[:, 0], L_[:, 1], 1); kr = np.polyfit(R_[:, 0], R_[:, 1], 1)
        xx = np.arange(roi.shape[1])[None, :] + 0 * yy
        cuff[(xx < np.polyval(kl, yy) - 2) | (xx > np.polyval(kr, yy) + 2)] = 0
        cuff = largest(cuff)
    xs = np.nonzero(body[max(wb - 6, 0):wb + 1].any(0))[0]              # ширина запястья у манжеты
    under = np.zeros_like(body); under[wb - 12:stop + 2, xs.min() + 2:xs.max() - 1] = 255
    body = cv2.bitwise_or(body, under)   # кожа под манжетой — без щелей
    # тени на коже: тёмный кластер внутри кожи
    sk = cv2.bitwise_and(skin, cv2.erode(body, np.ones((3, 3), np.uint8)))
    (dk, _), (mid, _), (lt, _) = kmeans_split(roi, sk, 3)
    cuffSh = clean(((B - R) >= 6) & (V <= 205) & (cuff > 0), 2)   # серо-голубая тень манжеты справа/снизу
    near = cv2.dilate(gold, np.ones((15, 15), np.uint8)) > 0
    redDot = clean(((H <= 13) | (H >= 170)) & (S >= 100) & (V >= 140) & near & ~(gold > 0), 1, 4)
    nail = cv2.bitwise_and(nail, cv2.bitwise_not(redDot))
    Ls = [layer('sleeve', roi, sleeve, 1.0), layer('skin', roi, body, .7), layer('skinShadow', roi, clean(dk, 2, 40), .8), layer('skinLight', roi, clean(lt, 2, 40), .8),
          layer('nails', roi, nail, .6), layer('ringGold', roi, gold, .6), layer('ringStone', roi, teal, .5), layer('ringSeal', roi, redDot, .5),
          layer('cuff', roi, cuff, .8)]   # тень манжеты — её градиентом
    Ls[0]['paths'].append(sleeve_ext(sleeve, roi.shape[0] - 40, roi.shape[0], 1500))
    return {'t': t, 'box': [X0, Y0, X1, Y1], 'layers': Ls}, roi


def hand1(t, X0, Y0, X1, Y1, open_):
    """рука №1: тёмно-серый рукав, светлая манжета, кисть; open_ — поза без стопки (35,1 с)"""
    im = fr(t); roi = im[Y0:Y1, X0:X1]; H, S, V, R, G, B = hsv_split(roi); yy = np.arange(roi.shape[0])[:, None] + 0 * H
    sleeve = largest(clean((H >= 92) & (H <= 112) & (S >= 60) & (V >= 70) & (V <= 160) & (yy < 160), 2))
    sb = np.argwhere(sleeve.any(1)).max()
    skin = clean((H >= 8) & (H <= 24) & (S >= 50) & (S <= 190) & (V >= 140) & (yy > sb), 2)
    skin = largest(skin); skin = cv2.morphologyEx(skin, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    st = np.argwhere(skin.any(1)).min()
    cuff = largest(clean((S <= 40) & (V >= 150) & (yy > sb - 4) & (yy < st + 30), 2))
    (dk, _), (mid, _), (lt, _) = kmeans_split(roi, cv2.erode(skin, np.ones((3, 3), np.uint8)), 3)
    xs = np.nonzero(skin[st:st + 30].any(0))[0]
    under = np.zeros_like(skin); under[max(sb - 2, 0):st + 4, xs.min():xs.max() + 1] = 255
    skinF = cv2.bitwise_or(skin, cv2.bitwise_and(under, cv2.dilate(cuff, np.ones((7, 7), np.uint8))))
    vext = lambda m: m
    if not open_:
        # пальцы под стопкой: продлеваем кожу вниз по столбцам на 70 px только там, где была бумага, — стопка смещается относительно руки, а среза не видно
        pap = ((V >= 185) & (S <= 75) & ((B - R) <= 4)).astype(np.uint8) * 255
        pap = cv2.dilate(cv2.morphologyEx(pap, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8)), np.ones((5, 5), np.uint8))
        K = np.ones((70, 1), np.uint8)
        def vext(m):
            e = cv2.bitwise_and(cv2.dilate(m, K, anchor=(0, 69)), pap); e[:200] = 0
            return cv2.bitwise_or(m, e)
    dkm, ltm = clean(dk, 2, 40), clean(lt, 2, 40)
    Ls = [layer('sleeve', roi, sleeve, 1.0), layer('skin', roi, vext(skinF), .7, gm=skinF),
          layer('skinShadow', roi, vext(dkm), .8, gm=dkm), layer('skinLight', roi, vext(ltm), .8, gm=ltm), layer('cuff', roi, cuff, .8)]
    Ls[0]['paths'].append(sleeve_ext(sleeve, 0, 66 if open_ else 40, -900, 'left' if open_ else 'both'))
    return {'t': t, 'box': [X0, Y0, X1, Y1], 'layers': Ls, 'open': open_}, roi


def draw(L, shape):
    """растеризация векторных слоёв (для проверки рядом с оригиналом)"""
    out = np.full(shape + (3,), 40, np.uint8)
    for l in L['layers']:
        m = np.zeros(shape, np.uint8)
        for p in l['paths']: cv2.fillPoly(m, [np.array(p, np.int32)], 255)   # без дыр: для проверки хватает
        if 'c' in l: col = np.array([int(l['c'][i:i + 2], 16) for i in (5, 3, 1)], float); img = np.ones(shape + (3,)) * col
        else:
            x0, y0, x1, y1 = l['g']; d = np.array([x1 - x0, y1 - y0]); n2 = max(d @ d, 1e-6)
            yy, xx = np.mgrid[0:shape[0], 0:shape[1]]; u = np.clip(((xx - x0) * d[0] + (yy - y0) * d[1]) / n2, 0, 1)[..., None]
            c0 = np.array([int(l['c0'][i:i + 2], 16) for i in (5, 3, 1)], float); c1 = np.array([int(l['c1'][i:i + 2], 16) for i in (5, 3, 1)], float)
            img = c0 + (c1 - c0) * u
        out[m > 0] = img[m > 0].astype(np.uint8)
    return out


if __name__ == '__main__':
    h2, r2 = hand2()
    h1, r1 = hand1(33.5, 250, 0, 600, 520, False)
    h1o, r1o = hand1(35.16, 380, 0, 820, 520, True)
    json.dump({'hand1': h1, 'hand1open': h1o, 'hand2': h2}, open('hands.json', 'w'))
    rows = []
    for H_, r in ((h1, r1), (h1o, r1o), (h2, r2)):
        v = draw(H_, r.shape[:2]); a = np.hstack([r, v]); s = 520 / a.shape[0]; rows.append(cv2.resize(a, (int(a.shape[1] * s), 520)))
    cv2.imwrite('check.png', np.hstack(rows))
    for k, H_ in (('hand1', h1), ('hand1open', h1o), ('hand2', h2)):
        print(k, [(l['name'], len(l['paths']), sum(len(p) for p in l['paths'])) for l in H_['layers']])
