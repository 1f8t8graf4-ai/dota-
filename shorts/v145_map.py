#!/usr/bin/env python3
"""Векторный силуэт залива Сан-Франциско для v14.5 (карта в белой рамке): суша Natural Earth 10m (world-atlas@2.0.2, land-10m.json),
обрезка по рамке (Сазерленд — Ходжман), упрощение (Рамер — Дуглас — Пекер) → ep/v145-map.js: путь SVG в координатах рамки и точки UCSF, Стэнфорд.
python3 -I v145_map.py <путь к land-10m.json>"""
import json, math, os, sys

FRAME = (-300, -360, 600, 660)          # внутренняя часть белой рамки в v14: x, y, ширина, высота
CENTER = (37.595, -122.31)               # между UCSF и Стэнфордом
LAT_SPAN = .84
PTS = {'ucsf': (37.7631, -122.4586), 'stanford': (37.4275, -122.1697), 'sf': (37.7793, -122.4193)}
K = math.cos(math.radians(37.5))


def arcs_of(topo):
    sc, tr = topo['transform']['scale'], topo['transform']['translate']; out = []
    for a in topo['arcs']:
        x = y = 0; p = []
        for dx, dy in a:
            x += dx; y += dy; p.append((x * sc[0] + tr[0], y * sc[1] + tr[1]))
        out.append(p)
    return out


def ring(ix, A):
    p = []
    for i in ix:
        s = A[i] if i >= 0 else A[~i][::-1]; p.extend(s if not p else s[1:])
    return p


def clip(poly, x0, y0, x1, y1):
    def cut(P, inside, inter):
        out = []
        for i in range(len(P)):
            a, b = P[i - 1], P[i]
            if inside(b):
                if not inside(a): out.append(inter(a, b))
                out.append(b)
            elif inside(a): out.append(inter(a, b))
        return out
    def ix(a, b, x): t = (x - a[0]) / (b[0] - a[0]); return (x, a[1] + t * (b[1] - a[1]))
    def iy(a, b, y): t = (y - a[1]) / (b[1] - a[1]); return (a[0] + t * (b[0] - a[0]), y)
    P = poly
    for inside, inter in ((lambda p: p[0] >= x0, lambda a, b: ix(a, b, x0)), (lambda p: p[0] <= x1, lambda a, b: ix(a, b, x1)),
                          (lambda p: p[1] >= y0, lambda a, b: iy(a, b, y0)), (lambda p: p[1] <= y1, lambda a, b: iy(a, b, y1))):
        if not P: break
        P = cut(P, inside, inter)
    return P


def rdp(P, eps):
    if len(P) < 3: return P
    a, b = P[0], P[-1]; dx, dy = b[0] - a[0], b[1] - a[1]; n = math.hypot(dx, dy) or 1e-9
    d = [abs(dy * (p[0] - a[0]) - dx * (p[1] - a[1])) / n for p in P[1:-1]]
    i = max(range(len(d)), key=d.__getitem__) + 1 if d else 0
    if d and d[i - 1] > eps: return rdp(P[:i + 1], eps)[:-1] + rdp(P[i:], eps)
    return [a, b]


def main(path):
    topo = json.load(open(path)); A = arcs_of(topo)
    x, y, w, h = FRAME; s = h / LAT_SPAN                       # пикселей на градус широты
    lon_span = w / s / K; la1 = CENTER[0] + LAT_SPAN / 2; lo0 = CENTER[1] - lon_span / 2
    prj = lambda lo, la: (x + (lo - lo0) * K * s, y + (la1 - la) * s)
    D = []
    for g in topo['objects']['land']['geometries']:
        for poly in (g['arcs'] if g['type'] == 'MultiPolygon' else [g['arcs']]):
            for k, r in enumerate(poly):
                pts = ring(r, A)
                if max(p[0] for p in pts) < lo0 - 1 or min(p[0] for p in pts) > lo0 + lon_span + 1 or max(p[1] for p in pts) < la1 - LAT_SPAN - 1 or min(p[1] for p in pts) > la1 + 1: continue
                P = clip([prj(*p) for p in pts], x - 2, y - 2, x + w + 2, y + h + 2)
                if len(P) < 3: continue
                m = max(range(len(P)), key=lambda i: math.hypot(P[i][0] - P[0][0], P[i][1] - P[0][1]))   # кольцо: делим на две ломаные
                P = rdp(P[:m + 1], .9)[:-1] + rdp(P[m:] + [P[0]], .9)
                if len(P) < 4: continue
                D.append('M' + 'L'.join(f'{px:.1f} {py:.1f}' for px, py in P[:-1]) + 'Z')
    mk = {k: [round(c, 1) for c in prj(lo, la)] for k, (la, lo) in PTS.items()}
    js = '// Силуэт залива Сан-Франциско для v14.5 (Natural Earth 10m, world-atlas@2.0.2). Собрано: python3 -I v145_map.py land-10m.json\n'
    js += 'window.V145MAP = ' + json.dumps({'land': ''.join(D), 'at': mk, 'deg': {'lat0': round(la1 - LAT_SPAN, 3), 'lat1': round(la1, 3), 'lon0': round(lo0, 3), 'lon1': round(lo0 + lon_span, 3)}}, ensure_ascii=False) + ';\n'
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ep', 'v145-map.js'); open(out, 'w').write(js)
    print('путей:', len(D), 'знаков:', len(js), 'точки:', mk, '→', out)


if __name__ == '__main__':
    main(sys.argv[1])
