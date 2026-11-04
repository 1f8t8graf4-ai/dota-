#!/usr/bin/env python3
"""Restless мод 0.22: слои мини-карты одной картинкой (вместо 670 панелей — 3 картинки, FPS).
Позиции — BXD из mod/.../restless.js (deadlock-api /v1/assets/map, ×1000 от размера мини-карты).
Выход: restless/mm/c.png (обычные ящики), t.png (крепкие), g.png (золотые статуи), 820×820 ×2.
Значки нарисованы здесь (не из игры): ящик — доска с перекрестьем, крепкий — с железными уголками, статуя — золотой силуэт."""
import re, os
from PIL import Image, ImageDraw, ImageFilter
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS = os.path.join(ROOT, 'mod/restless-probe/panorama/scripts/restless.js')
OUT = os.path.join(ROOT, 'restless/mm')
S = 2            # картинка ×2 к слою 820 px — чётче
W = 820 * S
SS = 4           # сглаживание значка

def crate(z, tough=False):
    n = z * SS; im = Image.new('RGBA', (n, n), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    pad = int(n * .08); r = int(n * .14); lw = max(2, int(n * .1))
    wood = (196, 140, 78, 255) if not tough else (150, 102, 58, 255)
    edge = (60, 36, 16, 255)
    d.rounded_rectangle([pad, pad, n - pad, n - pad], r, fill=wood, outline=edge, width=lw)
    d.line([pad + lw, pad + lw, n - pad - lw, n - pad - lw], fill=edge, width=lw)
    d.line([pad + lw, n - pad - lw, n - pad - lw, pad + lw], fill=edge, width=lw)
    if tough:
        c = (205, 210, 220, 255); q = int(n * .3)
        for (x, y, sx, sy) in [(pad, pad, 1, 1), (n - pad, pad, -1, 1), (pad, n - pad, 1, -1), (n - pad, n - pad, -1, -1)]:
            d.polygon([(x, y), (x + sx * q, y), (x, y + sy * q)], fill=c, outline=edge)
    return im

def statue(z):
    n = z * SS; im = Image.new('RGBA', (n, n), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    g = (255, 200, 61, 255); e = (90, 60, 0, 255); lw = max(2, int(n * .08))
    cx = n / 2
    d.ellipse([cx - n * .17, n * .06, cx + n * .17, n * .38], fill=g, outline=e, width=lw)          # голова
    d.polygon([(cx - n * .3, n * .82), (cx - n * .2, n * .4), (cx + n * .2, n * .4), (cx + n * .3, n * .82)], fill=g, outline=e)  # тело
    d.rectangle([n * .12, n * .8, n * .88, n * .94], fill=g, outline=e, width=lw)                   # постамент
    return im

def glow(icon):
    a = icon.split()[3].filter(ImageFilter.GaussianBlur(icon.size[0] * .08))
    sh = Image.new('RGBA', icon.size, (0, 0, 0, 0)); sh.putalpha(a.point(lambda v: min(255, int(v * 1.2))))
    out = Image.new('RGBA', icon.size, (0, 0, 0, 0)); out.alpha_composite(sh); out.alpha_composite(icon); return out

def main():
    s = open(JS, encoding='utf-8').read()
    m = re.search(r"var BXD = \{ c: '([^']*)', t: '([^']*)', g: '([^']*)'", s)
    data = dict(zip('ctg', m.groups()))
    os.makedirs(OUT, exist_ok=True)
    spec = {'c': (9, lambda z: crate(z)), 't': (13, lambda z: crate(z, True)), 'g': (13, statue)}
    for k, (z, fn) in spec.items():
        zz = z * S
        ic = glow(fn(zz)).resize((zz, zz), Image.LANCZOS)
        im = Image.new('RGBA', (W, W), (0, 0, 0, 0)); n = 0
        for p in data[k].split(';'):
            a = p.split(',')
            if len(a) < 2: continue
            x = round(int(a[0]) / 1000 * W - zz / 2); y = round(int(a[1]) / 1000 * W - zz / 2)
            im.alpha_composite(ic, (max(0, min(W - zz, x)), max(0, min(W - zz, y)))); n += 1
        im.save(os.path.join(OUT, k + '.png'), optimize=True)
        ic.resize((zz * 3, zz * 3), Image.NEAREST).save(os.path.join(OUT, k + '-icon.png'))
        print(k, n, os.path.getsize(os.path.join(OUT, k + '.png')))

if __name__ == '__main__':
    main()
