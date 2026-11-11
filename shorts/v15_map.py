#!/usr/bin/env python3
"""Точечная карта для v15: суша из Natural Earth 10m (npm world-atlas@2.0.2, land-10m.json, общественное достояние) → ep/v15-map.js.
python3 -I v15_map.py <путь к land-10m.json>
Две сетки точек: CA — побережье Калифорнии целиком, BAY — залив Сан-Франциско (UCSF и Стэнфорд). '1' — суша, '0' — вода.
Проекция — равнопромежуточная с поправкой cos(37,5°)."""
import json, math, os, sys
from PIL import Image, ImageDraw

REG = {  # имя: (долгота от, до, широта от, до, точек по ширине)
    'CA': (-125.2, -113.6, 32.2, 42.4, 150),
    'BAY': (-122.78, -121.72, 37.18, 38.02, 150),
}
PTS = {'ucsf': (37.7631, -122.4586), 'stanford': (37.4275, -122.1697), 'sf': (37.7793, -122.4193)}
K = math.cos(math.radians(37.5))


def arcs_of(topo):
    sc, tr = topo['transform']['scale'], topo['transform']['translate']
    out = []
    for a in topo['arcs']:
        x = y = 0; pts = []
        for dx, dy in a:
            x += dx; y += dy
            pts.append((x * sc[0] + tr[0], y * sc[1] + tr[1]))
        out.append(pts)
    return out


def ring(ix, A):
    pts = []
    for i in ix:
        seg = A[i] if i >= 0 else A[~i][::-1]
        pts.extend(seg if not pts else seg[1:])
    return pts


def main(path):
    topo = json.load(open(path))
    A = arcs_of(topo)
    polys = []
    for g in topo['objects']['land']['geometries']:
        P = g['arcs'] if g['type'] == 'MultiPolygon' else [g['arcs']]
        for poly in P:
            polys.append([ring(r, A) for r in poly])
    js = ['// Точки суши для v15 (Natural Earth 10m, world-atlas@2.0.2). Собрано: python3 -I v15_map.py land-10m.json', 'window.V15MAP = {']
    for name, (lo0, lo1, la0, la1, nx) in REG.items():
        W = 2400; sx = W / ((lo1 - lo0) * K); H = int((la1 - la0) * sx)
        im = Image.new('L', (W, H), 0); d = ImageDraw.Draw(im)
        prj = lambda lo, la: ((lo - lo0) * K * sx, (la1 - la) * sx)
        for poly in polys:
            ext = poly[0]
            if max(p[0] for p in ext) < lo0 - 1 or min(p[0] for p in ext) > lo1 + 1 or max(p[1] for p in ext) < la0 - 1 or min(p[1] for p in ext) > la1 + 1:
                continue
            for k, r in enumerate(poly):
                if len(r) > 2: d.polygon([prj(*p) for p in r], fill=0 if k else 255)
        step = W / nx; ny = int(H / step)
        rows = []
        for j in range(ny):
            y = int((j + .5) * step)
            rows.append(''.join('1' if im.getpixel((int((i + .5) * step), y)) > 127 else '0' for i in range(nx)))
        mk = {k: [round((lo - lo0) * K * sx / step - .5, 2), round((la1 - la) * sx / step - .5, 2)] for k, (la, lo) in PTS.items()}
        js.append(f"  {name}: {{ nx: {nx}, ny: {ny}, rows: {json.dumps(rows)}, at: {json.dumps(mk)}, deg: {round(step / sx / K, 5)} }},")
        print(name, nx, 'x', ny, 'суша:', sum(r.count('1') for r in rows), 'точек; метки:', mk)
    js.append('};')
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ep', 'v15-map.js')
    open(out, 'w').write('\n'.join(js) + '\n')
    print('→', out, os.path.getsize(out), 'байт')


if __name__ == '__main__':
    main(sys.argv[1])
