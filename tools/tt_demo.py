#!/usr/bin/env python3
"""Ролики без голоса: картинка кодом + субтитры фразами. 4 стиля.

  python3 tools/tt_demo.py <папка-выхода> [ролик …]       — ролики из tools/tt_demo_ru.py
  python3 tools/tt_demo.py <папка> <ролик> --frames 3,12   — только кадры PNG (на проверку)

Стили: stick (человечек на чёрном), dark (тёмная инфографика), flat (плоская история),
yellow (жёлтые карточки). Шрифты — tools/tt_demo_fonts (OFL).
"""
import math, os, random, subprocess, sys
from functools import lru_cache
from PIL import Image, ImageDraw, ImageFont

W, H, FPS = 1080, 1920, 30
VY, VH = 230, 1040            # зона картинки: y от VY, высота VH
CY = 1430                     # центр субтитров
SS = 2                        # картинку рисуем вдвое крупнее и сжимаем — гладкие края
FD = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tt_demo_fonts')
FONTS = {'hand': 'Caveat[wght].ttf', 'cond': 'Oswald[wght].ttf', 'sans': 'Rubik[wght].ttf',
         'wide': 'Unbounded[wght].ttf', 'mono': 'JetBrainsMono[wght].ttf'}


@lru_cache(None)
def F(kind, size, wght=700):
    f = ImageFont.truetype(os.path.join(FD, FONTS[kind]), int(size))
    try:
        ax = f.get_variation_axes()[0]
        f.set_variation_by_axes([max(ax['minimum'], min(ax['maximum'], wght))])
    except Exception:
        pass
    return f


def cl(v, a=0., b=1.): return max(a, min(b, v))
def eo(p): p = cl(p); return 1 - (1 - p) ** 3
def back(p): p = cl(p); c = 1.70158; return 1 + (c + 1) * (p - 1) ** 3 + c * (p - 1) ** 2
def lerp(a, b, p): return a + (b - a) * p
def hexc(h, a=255): h = h.lstrip('#'); return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)


class St:
    def __init__(s, **k): s.__dict__.update(k)


STYLES = {
    'stick': St(name='stick', bg=('#0b0b0d', '#0b0b0d'), fg='#f4f1ea', acc='#ffd84a', acc2='#ff5a4e', mute='#77777d',
                w=7, flat=False, out=None, cap=('hand', 88, 700), cap_col='#f4f1ea', cap_hl='#ffd84a', upper=False,
                shadow=False, boil=True, fig='stick', hud='hand', headfill='#0b0b0d'),
    'dark': St(name='dark', bg=('#05060a', '#121827'), fg='#eef1f7', acc='#ff3b3b', acc2='#64e3ff', mute='#6f788c',
               w=6, flat=False, out=None, cap=('cond', 78, 700), cap_col='#ffffff', cap_hl='#ff3b3b', upper=True,
               shadow=True, boil=False, fig='line', hud='mono', headfill='#0d111c'),
    'flat': St(name='flat', bg=('#0d1430', '#1d2a5c'), fg='#f5f7ff', acc='#ffc93c', acc2='#ff5a5f', mute='#7f8bb3',
               w=6, flat=True, out=None, cap=('sans', 68, 700), cap_col='#ffffff', cap_hl='#ffc93c', upper=False,
               shadow=True, boil=False, fig='flat', hud='plaque', headfill='#f2c6a0'),
    'yellow': St(name='yellow', bg=('#ffd23f', '#ffcb2e'), fg='#1a1a1a', acc='#e8463a', acc2='#3d6fe0', mute='#8a6d14',
                 w=7, flat=True, out='#1a1a1a', cap=('sans', 66, 700), cap_col='#1a1a1a', cap_hl='#e8463a', upper=False,
                 shadow=False, boil=False, fig='cute', hud='big', headfill='#ffffff'),
}


# ───────────────────────── фон ─────────────────────────
def make_bg(st):
    a = Image.new('RGB', (W, H), hexc(st.bg[0])[:3]); b = Image.new('RGB', (W, H), hexc(st.bg[1])[:3])
    im = Image.composite(b, a, Image.linear_gradient('L').resize((W, H)))
    d = ImageDraw.Draw(im, 'RGBA')
    r = random.Random(7)
    if st.name == 'dark':
        for x in range(0, W, 90): d.line([(x, 0), (x, H)], fill=(255, 255, 255, 7))
        for y in range(0, H, 90): d.line([(0, y), (W, y)], fill=(255, 255, 255, 7))
        d.ellipse((W / 2 - 520, VY + 120, W / 2 + 520, VY + 1000), fill=(255, 40, 40, 10))
    if st.name == 'flat':
        for _ in range(70):
            x, y = r.uniform(0, W), r.uniform(0, VY + VH * .6); s = r.choice((1.2, 1.6, 2.2))
            d.ellipse((x - s, y - s, x + s, y + s), fill=(255, 255, 255, r.randint(60, 160)))
    if st.name in ('dark', 'flat', 'stick'):
        rg = Image.radial_gradient('L').resize((W, H)).point(lambda v: int(cl((v - 90) / 165) * 150))
        im = Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), im, rg)
    return im


# ───────────────────────── рисование (в 2× размере) ─────────────────────────
class G:
    def __init__(s, st, t, z=1.):
        s.st = st; s.t = t; s.z = z
        s.im = Image.new('RGBA', (W * SS, VH * SS), (0, 0, 0, 0)); s.d = ImageDraw.Draw(s.im)
        s.seed = int(t * 6) + 1 if st.boil else 0

    def P(s, x, y):
        if s.seed:
            r = random.Random(hash((round(x), round(y), s.seed))); x += r.uniform(-2.3, 2.3); y += r.uniform(-2.3, 2.3)
        return (((x - 540) * s.z + 540) * SS, ((y - 520) * s.z + 520) * SS)

    def pie(s, x0, y0, x1, y1, a0, a1, col):
        A = s.P(x0, y0); B = s.P(x1, y1); s.d.pieslice((A[0], A[1], B[0], B[1]), a0, a1, fill=s.C(col))

    def C(s, c, a=255):
        if c is None: return None
        if isinstance(c, tuple): return c
        if not c.startswith('#'): c = getattr(s.st, c)
        return hexc(c, a)

    @property
    def O(s):  # цвет обводки фигур
        return s.st.out if s.st.flat else 'fg'

    def FL(s, c):  # заливка — только у плоских стилей
        return c if s.st.flat else None

    def line(s, pts, col='fg', w=None, a=255):
        w = (w or s.st.w) * SS * s.z; c = s.C(col, a); P = [s.P(*p) for p in pts]
        s.d.line(P, fill=c, width=max(1, int(w)), joint='curve')
        r = w / 2
        for (x, y) in (P[0], P[-1]): s.d.ellipse((x - r, y - r, x + r, y + r), fill=c)

    def circ(s, x, y, r, fill=None, out='fg', w=None, a=255):
        X, Y = s.P(x, y); R = r * SS * s.z
        s.d.ellipse((X - R, Y - R, X + R, Y + R), fill=s.C(fill, a) if fill else None,
                    outline=s.C(out, a) if out else None, width=int((w or s.st.w) * SS * s.z) if out else 0)

    def rect(s, x0, y0, x1, y1, fill=None, out='fg', w=None, rad=0, a=255):
        A = s.P(x0, y0); B = s.P(x1, y1)
        s.d.rounded_rectangle((min(A[0], B[0]), min(A[1], B[1]), max(A[0], B[0]), max(A[1], B[1])), radius=rad * SS * s.z,
                              fill=s.C(fill, a) if fill else None, outline=s.C(out, a) if out else None,
                              width=int((w or s.st.w) * SS * s.z) if out else 0)

    def poly(s, pts, fill=None, out='fg', w=None, a=255):
        if fill: s.d.polygon([s.P(*p) for p in pts], fill=s.C(fill, a))
        if out: s.line(list(pts) + [pts[0]], out, w, a)

    def text(s, x, y, txt, kind='sans', size=40, col='fg', wght=700, anchor='mm', a=255):
        s.d.text(s.P(x, y), txt, font=F(kind, size * SS * s.z, wght), fill=s.C(col, a), anchor=anchor)

    def arc(s, x, y, r, a0, a1, col='fg', w=None, a=255):
        X, Y = s.P(x, y); R = r * SS * s.z
        s.d.arc((X - R, Y - R, X + R, Y + R), a0, a1, fill=s.C(col, a), width=int((w or s.st.w) * SS * s.z))


# ───────────────────────── человек ─────────────────────────
def skel(x, y, k=1, pose='stand', arms='down'):
    if pose == 'sit':
        hip = (x, y - 95 * k); sh = (x - 6 * k, y - 200 * k); head = (x - 6 * k, y - 258 * k)
        legs = [[hip, (x + 72 * k, y - 95 * k), (x + 72 * k, y)], [hip, (x + 62 * k, y - 88 * k), (x + 56 * k, y)]]
    elif pose == 'push':
        head = (x + 150 * k, y - 78 * k); sh = (x + 100 * k, y - 66 * k); hip = (x - 45 * k, y - 46 * k)
        legs = [[hip, (x - 180 * k, y - 12 * k)], [hip, (x - 175 * k, y - 6 * k)]]
        a = [[sh, (x + 98 * k, y)], [sh, (x + 110 * k, y)]]
        return dict(head=head, hr=30 * k, body=[sh, hip], legs=legs, arms=a, hand=(x + 110 * k, y))
    elif pose == 'lie':
        head = (x - 150 * k, y - 34 * k); sh = (x - 95 * k, y - 30 * k); hip = (x + 20 * k, y - 26 * k)
        legs = [[hip, (x + 150 * k, y - 22 * k)], [hip, (x + 148 * k, y - 16 * k)]]
        a = [[sh, (x - 30 * k, y - 60 * k), (x - 80 * k, y - 80 * k)], [sh, (x - 20 * k, y - 22 * k)]]
        return dict(head=head, hr=32 * k, body=[sh, hip], legs=legs, arms=a, hand=(x - 80 * k, y - 80 * k))
    else:
        sw = 34 * k if pose == 'walk' else 26 * k
        hip = (x, y - 100 * k); sh = (x, y - 205 * k); head = (x, y - 262 * k)
        legs = [[hip, (x - sw, y)], [hip, (x + sw, y)]]
    sx, sy = sh
    A = {
        'down': [[sh, (sx - 38 * k, sy + 105 * k)], [sh, (sx + 38 * k, sy + 105 * k)]],
        'up': [[sh, (sx - 72 * k, sy - 95 * k)], [sh, (sx + 72 * k, sy - 95 * k)]],
        'reach': [[sh, (sx - 34 * k, sy + 104 * k)], [sh, (sx + 70 * k, sy + 26 * k), (sx + 136 * k, sy + 6 * k)]],
        'phone': [[sh, (sx - 18 * k, sy + 62 * k), (sx + 36 * k, sy + 46 * k)], [sh, (sx + 26 * k, sy + 72 * k), (sx + 46 * k, sy + 46 * k)]],
        'hips': [[sh, (sx - 62 * k, sy + 48 * k), (sx - 24 * k, sy + 98 * k)], [sh, (sx + 62 * k, sy + 48 * k), (sx + 24 * k, sy + 98 * k)]],
        'head': [[sh, (sx - 66 * k, sy - 10 * k), (sx - 26 * k, sy - 62 * k)], [sh, (sx + 66 * k, sy - 10 * k), (sx + 26 * k, sy - 62 * k)]],
        'give': [[sh, (sx - 34 * k, sy + 104 * k)], [sh, (sx + 80 * k, sy + 40 * k), (sx + 150 * k, sy + 40 * k)]],
        'wave': [[sh, (sx - 38 * k, sy + 105 * k)], [sh, (sx + 70 * k, sy - 30 * k), (sx + 96 * k, sy - 110 * k)]],
    }[arms]
    return dict(head=head, hr=34 * k, body=[sh, hip], legs=legs, arms=A, hand=A[1][-1])


def face(g, cx, cy, r, mood, col):
    for dx in (-.36, .36): g.circ(cx + dx * r, cy - .08 * r, max(2.5, .1 * r), fill=col, out=None)
    if mood == 'happy': g.arc(cx, cy + .02 * r, .42 * r, 25, 155, col, w=max(3, r * .1))
    elif mood == 'sad': g.arc(cx, cy + .62 * r, .32 * r, 205, 335, col, w=max(3, r * .1))
    elif mood == 'shock': g.circ(cx, cy + .36 * r, .14 * r, out=col, w=max(3, r * .08))
    elif mood == 'sleep':
        for dx in (-.36, .36): g.line([(cx + dx * r - .12 * r, cy - .08 * r), (cx + dx * r + .12 * r, cy - .08 * r)], col, max(3, r * .08))
    else: g.line([(cx - .2 * r, cy + .38 * r), (cx + .2 * r, cy + .38 * r)], col, w=max(3, r * .09))


def fig(g, x, y, k=1, pose='stand', arms='down', mood='ok', col=None, jacket=None, hair='#2a1d14', cap=None):
    """Человек: y — уровень пола. Вид — по стилю."""
    S = skel(x, y, k, pose, arms); st = g.st
    hx, hy = S['head']; hr = S['hr']
    if st.fig in ('stick', 'line'):
        c = col or 'fg'
        for L in S['legs'] + [S['body']] + S['arms']: g.line(L, c)
        g.circ(hx, hy, hr, fill=st.headfill, out=c)
        face(g, hx, hy, hr, mood, c)
    elif st.fig == 'flat':
        jk = jacket or '#e9a23b'
        for L in S['legs']: g.line(L, '#2b3352', 24 * k)
        g.line(S['body'], jk, 66 * k)
        for L in S['arms']: g.line(L, jk, 22 * k)
        for L in S['arms']: g.circ(L[-1][0], L[-1][1], 11 * k, fill='#f2c6a0', out=None)
        g.circ(hx, hy, hr + 2 * k, fill='#f2c6a0', out=None)
        g.pie(hx - hr - 3 * k, hy - hr - 4 * k, hx + hr + 3 * k, hy + hr, 180, 360, cap or hair)
        if cap: g.rect(hx - 6 * k, hy - 6 * k, hx + hr + 18 * k, hy + 2 * k, fill=cap, out=None, rad=4)
        face(g, hx, hy + 6 * k, hr * .9, mood, '#1f2440')
    else:  # cute
        jk = jacket or '#ffffff'
        for L in S['legs']: g.line(L, 'fg', 8 * k)
        (sx, sy), (px, py) = S['body']
        if pose in ('push', 'lie'): g.line(S['body'], 'fg', 48 * k); g.line(S['body'], jk, 34 * k)
        else: g.rect(sx - 38 * k, sy - 6 * k, px + 38 * k, py + 6 * k, fill=jk, out='fg', rad=18 * k)
        for L in S['arms']: g.line(L, 'fg', 8 * k)
        R = hr * 1.75
        g.circ(hx, hy - R * .35, R, fill='#ffffff', out='fg')
        face(g, hx, hy - R * .3, R * .85, mood, '#1a1a1a')
    return S


# ───────────────────────── значки ─────────────────────────
def phone(g, x, y, k=1, lines=(), glow=False, body=None):
    bw, bh = 66 * k, 120 * k
    g.rect(x - bw, y - bh, x + bw, y + bh, fill=g.FL(body or ('#232a45' if g.st.name == 'flat' else '#ffffff')), out=g.O, rad=18 * k)
    sc = '#cfe6ff' if glow else ('#0e1328' if g.st.name == 'flat' else None)
    if glow or g.st.flat:
        g.rect(x - bw + 10 * k, y - bh + 22 * k, x + bw - 10 * k, y + bh - 22 * k, fill=sc or '#f2f2f2', out=None, rad=8 * k, a=200 if glow else 255)
    elif not g.st.flat:
        g.rect(x - bw + 12 * k, y - bh + 24 * k, x + bw - 12 * k, y + bh - 24 * k, out=g.O, w=3, rad=6 * k)
    for i, (txt, c, sz) in enumerate(lines):
        g.text(x, y - 40 * k + i * 46 * k, txt, 'sans', sz * k, c)


def laptop(g, x, y, k=1, glow=True):
    g.rect(x - 130 * k, y - 170 * k, x + 130 * k, y - 10 * k, fill=g.FL('#232a45'), out=g.O, rad=10 * k)
    if glow: g.rect(x - 112 * k, y - 152 * k, x + 112 * k, y - 28 * k, fill=g.st.acc2, out=None, rad=4 * k, a=150)
    g.poly([(x - 160 * k, y), (x + 160 * k, y), (x + 130 * k, y - 12 * k), (x - 130 * k, y - 12 * k)], fill=g.FL('#9aa3c7'), out=g.O)


def bed(g, x, y, k=1):
    g.rect(x - 230 * k, y - 70 * k, x + 230 * k, y - 20 * k, fill=g.FL('#5b6bb5' if g.st.name == 'flat' else '#ffffff'), out=g.O, rad=12 * k)
    g.rect(x - 230 * k, y - 140 * k, x - 205 * k, y, fill=g.FL('#8a5a3c'), out=g.O, rad=6 * k)
    g.rect(x + 205 * k, y - 100 * k, x + 230 * k, y, fill=g.FL('#8a5a3c'), out=g.O, rad=6 * k)
    g.rect(x - 200 * k, y - 100 * k, x - 120 * k, y - 70 * k, fill=g.FL('#f5f7ff'), out=g.O, rad=14 * k)


def clock(g, x, y, r, hh=3, mm=0, col='fg'):
    g.circ(x, y, r, fill=g.FL('#ffffff' if g.st.name == 'yellow' else '#232a45'), out=col if not g.st.flat else (g.O or col))
    for i in range(12):
        a = i / 12 * 2 * math.pi
        g.line([(x + math.sin(a) * r * .8, y - math.cos(a) * r * .8), (x + math.sin(a) * r * .88, y - math.cos(a) * r * .88)], col, max(3, r * .04))
    am = mm / 60 * 2 * math.pi; ah = (hh % 12 + mm / 60) / 12 * 2 * math.pi
    g.line([(x, y), (x + math.sin(ah) * r * .5, y - math.cos(ah) * r * .5)], col, max(4, r * .07))
    g.line([(x, y), (x + math.sin(am) * r * .74, y - math.cos(am) * r * .74)], 'acc', max(3, r * .05))


def heart(g, x, y, k=1, fill='acc2', pulse=0.):
    s = k * (1 + .08 * pulse)
    pts = [(x + 16 * math.sin(t) ** 3 * 7 * s, y - (13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t)) * 7 * s)
           for t in [i / 60 * 2 * math.pi for i in range(60)]]
    g.poly(pts, fill=fill if g.st.flat else None, out=g.O if g.st.flat else fill, w=None)


def brain(g, x, y, k=1, fill='#f59ab5', glow=0.):
    w, h = 190 * k, 140 * k
    if glow:
        for i in range(14):
            a = i / 14 * 2 * math.pi; r0 = 175 * k; r1 = r0 + 40 * k * (.6 + .4 * glow)
            g.line([(x + math.cos(a) * r0, y + math.sin(a) * r0 * .8), (x + math.cos(a) * r1, y + math.sin(a) * r1 * .8)], 'acc', 6)
    for dx, dy, r in ((-.55, -.15, .55), (-.15, -.45, .55), (.3, -.4, .55), (.6, -.05, .5), (.35, .35, .5), (-.2, .38, .52), (-.6, .3, .45)):
        g.circ(x + dx * w * .8, y + dy * h * .8, r * h * .75, fill=g.FL(fill), out=None)
    if not g.st.flat or g.st.out:
        for dx, dy, r, a0, a1 in ((-.55, -.15, .55, 120, 300), (-.15, -.45, .55, 190, 350), (.3, -.4, .55, 200, 20), (.6, -.05, .5, 270, 90),
                                  (.35, .35, .5, 330, 150), (-.2, .38, .52, 20, 200), (-.6, .3, .45, 60, 250)):
            g.arc(x + dx * w * .8, y + dy * h * .8, r * h * .75, a0, a1, g.O or 'fg')
    g.line([(x, y - h * .55), (x + 10 * k, y - h * .15), (x - 8 * k, y + h * .2), (x + 4 * k, y + h * .5)], g.O or 'fg', 4)


def capsule(g, x, y, k=1, c1='acc2', c2='#ffffff', ang=-30):
    """Таблетка-капсула: две половинки."""
    a = math.radians(ang); ux, uy = math.cos(a), math.sin(a); L, R = 62 * k, 30 * k
    ow = (g.st.w if g.st.out else 0)
    if g.st.flat:
        if g.st.out: g.line([(x - ux * L, y - uy * L), (x + ux * L, y + uy * L)], g.st.out, (R + ow) * 2)
        g.line([(x - ux * L, y - uy * L), (x, y)], c1, R * 2)
        g.line([(x, y), (x + ux * L, y + uy * L)], c2, R * 2)
        if g.st.out: g.line([(x - uy * R, y + ux * R), (x + uy * R, y - ux * R)], g.st.out, 5)
    else:
        g.line([(x - ux * L, y - uy * L), (x + ux * L, y + uy * L)], c1, R * 2 + g.st.w * 2)
        g.line([(x - ux * L, y - uy * L), (x + ux * L, y + uy * L)], g.st.headfill, R * 2 - g.st.w)
        g.line([(x - uy * R, y + ux * R), (x + uy * R, y - ux * R)], c1, 5)


def tablet(g, x, y, r=46, fill='#9ad0ff', mark=None):
    g.circ(x, y, r, fill=g.FL(fill), out=g.O or 'fg')
    g.line([(x - r * .55, y), (x + r * .55, y)], g.O or 'fg', 5)
    if mark: g.text(x, y - r - 30, mark, 'sans', 34, 'acc')


def bag(g, x, y, k=1):
    g.rect(x - 52 * k, y - 66 * k, x + 52 * k, y + 66 * k, fill=g.FL('#e9eef8'), out=g.O or 'fg', rad=8 * k)
    g.line([(x - 52 * k, y - 44 * k), (x + 52 * k, y - 44 * k)], 'acc', 6)
    g.rect(x - 34 * k, y - 10 * k, x + 34 * k, y + 44 * k, fill='#ffffff', out=None, rad=10 * k, a=200)


def cup(g, x, y, k=1):
    g.poly([(x - 60 * k, y - 70 * k), (x + 60 * k, y - 70 * k), (x + 46 * k, y + 60 * k), (x - 46 * k, y + 60 * k)], fill=g.FL('#ffffff'), out=g.O or 'fg')
    g.arc(x + 62 * k, y - 10 * k, 30 * k, 270, 90, g.O or 'fg')
    for dx in (-22, 4, 30):
        g.line([(x + dx * k, y - 92 * k), (x + (dx - 10) * k, y - 112 * k), (x + dx * k, y - 132 * k)], 'mute', 4)


def liver(g, x, y, k=1):
    pts = [(x - 150 * k, y - 30 * k), (x - 60 * k, y - 80 * k), (x + 80 * k, y - 85 * k), (x + 150 * k, y - 60 * k),
           (x + 120 * k, y - 10 * k), (x + 20 * k, y + 50 * k), (x - 90 * k, y + 70 * k), (x - 150 * k, y + 30 * k)]
    g.poly(pts, fill=g.FL('#b5524a'), out=g.O or 'acc')


def drop(g, x, y, k=1, fill='acc2'):
    pts = [(x, y - 70 * k)] + [(x + math.sin(t) * 46 * k, y + 10 * k - math.cos(t) * 46 * k) for t in [math.pi * (.25 + i / 20 * 1.5) for i in range(21)]]
    g.poly(pts, fill=g.FL(fill) if g.st.flat else None, out=g.O or fill)


def bottle(g, x, y, k=1, fill='#9ad0ff'):
    g.rect(x - 34 * k, y - 60 * k, x + 34 * k, y + 90 * k, fill=g.FL(fill), out=g.O or 'fg', rad=14 * k)
    g.rect(x - 14 * k, y - 100 * k, x + 14 * k, y - 60 * k, fill=g.FL('#ffffff'), out=g.O or 'fg', rad=4 * k)


def thermo(g, x, y, k=1, lvl=.5, label=None):
    g.rect(x - 26 * k, y - 220 * k, x + 26 * k, y + 40 * k, fill=g.FL('#ffffff'), out=g.O or 'fg', rad=26 * k)
    g.circ(x, y + 60 * k, 46 * k, fill='acc2' if g.st.flat else None, out=g.O or 'fg')
    top = lerp(y + 30 * k, y - 205 * k, cl(lvl))
    g.rect(x - 12 * k, top, x + 12 * k, y + 50 * k, fill='acc2', out=None, rad=12 * k)
    if not g.st.flat: g.circ(x, y + 60 * k, 34 * k, fill='acc2', out=None)
    if label: g.text(x + 70 * k, top, label, 'sans', 54 * k, 'acc2', anchor='lm')


def calendar(g, x, y, k=1, marks=(), n=30, cols=6, title=None):
    cw, chh = 92 * k, 74 * k; rows = (n + cols - 1) // cols
    w2, h2 = cols * cw / 2, rows * chh / 2
    g.rect(x - w2 - 20 * k, y - h2 - 70 * k, x + w2 + 20 * k, y + h2 + 20 * k, fill=g.FL('#ffffff' if g.st.name == 'yellow' else '#232a45'), out=g.O or 'fg', rad=18 * k)
    g.rect(x - w2 - 20 * k, y - h2 - 70 * k, x + w2 + 20 * k, y - h2 - 10 * k, fill='acc2', out=None, rad=18 * k)
    if title: g.text(x, y - h2 - 40 * k, title, 'sans', 34 * k, '#ffffff')
    for i in range(n):
        cx = x - w2 + (i % cols + .5) * cw; cy = y - h2 + (i // cols + .5) * chh
        m = marks[i] if i < len(marks) else None
        if m == 'ok': g.circ(cx, cy, 22 * k, fill='#3ddc97' if g.st.flat else None, out=None if g.st.flat else '#3ddc97', w=5)
        elif m == 'x':
            g.line([(cx - 16 * k, cy - 16 * k), (cx + 16 * k, cy + 16 * k)], 'acc2', 6); g.line([(cx + 16 * k, cy - 16 * k), (cx - 16 * k, cy + 16 * k)], 'acc2', 6)
        else: g.circ(cx, cy, 6 * k, fill='mute', out=None)


def bigtxt(g, x, y, txt, size=200, col='acc', kind=None, pop=1.):
    kind = kind or {'stick': 'hand', 'dark': 'cond', 'flat': 'sans', 'yellow': 'wide'}[g.st.name]
    g.text(x, y, txt, kind, size * (0.6 + 0.4 * pop), col, a=int(255 * cl(pop * 1.4)))


def check(g, x, y, k=1, col='#3ddc97'):
    g.circ(x, y, 70 * k, fill=g.FL(col), out=None if g.st.flat else col)
    g.line([(x - 32 * k, y), (x - 8 * k, y + 26 * k), (x + 36 * k, y - 26 * k)], '#ffffff' if g.st.flat else col, 12 * k)


def cross(g, x, y, k=1, col='acc2'):
    g.circ(x, y, 70 * k, fill=g.FL(col) if g.st.flat else None, out=None if g.st.flat else col)
    c = '#ffffff' if g.st.flat else col
    g.line([(x - 28 * k, y - 28 * k), (x + 28 * k, y + 28 * k)], c, 12 * k); g.line([(x + 28 * k, y - 28 * k), (x - 28 * k, y + 28 * k)], c, 12 * k)


def door(g, x, y, k=1, open_=0.):
    g.rect(x - 90 * k, y - 330 * k, x + 90 * k, y, fill=g.FL('#8a5a3c'), out=g.O or 'fg', rad=6 * k)
    if open_: g.rect(x - 90 * k, y - 330 * k, x - 90 * k + 180 * k * (1 - open_ * .7), y, fill=g.FL('#5a3a26'), out=g.O or 'fg', rad=6 * k)
    g.circ(x + 60 * k, y - 160 * k, 9 * k, fill='acc', out=None)


def building(g, x, y, k=1, label=None):
    g.rect(x - 160 * k, y - 300 * k, x + 160 * k, y, fill=g.FL('#e9eef8'), out=g.O or 'fg', rad=8 * k)
    for r in range(3):
        for c in range(4):
            if not (r == 2 and c in (1, 2)):
                g.rect(x - 130 * k + c * 70 * k, y - 270 * k + r * 75 * k, x - 90 * k + c * 70 * k, y - 220 * k + r * 75 * k, fill=g.FL('#9ad0ff'), out=g.O or 'fg', w=3, rad=4)
    g.rect(x - 40 * k, y - 110 * k, x + 40 * k, y, fill=g.FL('#5b6bb5'), out=g.O or 'fg', rad=4)
    g.rect(x - 14 * k, y - 380 * k, x + 14 * k, y - 320 * k, fill='acc2', out=None); g.rect(x - 30 * k, y - 364 * k, x + 30 * k, y - 336 * k, fill='acc2', out=None)
    if label: g.text(x, y + 40 * k, label, 'sans', 34 * k, 'fg')


def bubble(g, x, y, w, h, txt, size=40, fill=None, col='fg', tail=-1):
    fill = fill or ('#ffffff' if g.st.name == 'yellow' else '#2b3a7a' if g.st.name == 'flat' else None)
    g.rect(x - w / 2, y - h / 2, x + w / 2, y + h / 2, fill=fill if g.st.flat else None, out=g.O or 'fg', rad=26)
    if tail: g.poly([(x + tail * w * .3, y + h / 2 - 2), (x + tail * w * .3 + 40 * tail, y + h / 2 - 2), (x + tail * w * .3 + 10 * tail, y + h / 2 + 34)],
                    fill=fill if g.st.flat else None, out=None)
    lines = txt.split('\n')
    for i, L in enumerate(lines):
        g.text(x, y + (i - (len(lines) - 1) / 2) * size * 1.25, L, 'sans', size, col)


def graph(g, x, y, w, h, kind, p=1., labels=None):
    """kind: peak | drop | wave | zero. p — сколько линии уже нарисовано."""
    base = y + h * .55
    g.line([(x, y), (x, y + h), (x + w, y + h)], 'mute', 4)
    for i in range(0, int(w), 34): g.line([(x + i, base), (x + i + 16, base)], 'mute', 3)
    def f(u):
        if kind == 'peak': return .55 - .5 * math.exp(-((u - .38) / .07) ** 2)
        if kind == 'drop':
            v = .55 - .5 * math.exp(-((u - .3) / .06) ** 2)
            if u > .34: v += .28 * math.exp(-((u - .55) / .15) ** 2) * (1 if u < .55 else 1)
            return v
        if kind == 'wave': return .95 - .85 * (u / .35 if u < .35 else math.exp(-(u - .35) * 4.5))
        if kind == 'zero': return .12 + .8 * (1 - math.exp(-u * 4.2))
        return .55
    n = 90; m = max(2, int(n * cl(p)))
    pts = [(x + w * i / n, y + h * f(i / n)) for i in range(m)]
    g.line(pts, 'acc', 9)
    g.circ(pts[-1][0], pts[-1][1], 12, fill='acc', out=None)
    for (u, v, txt, c) in (labels or ()):
        g.text(x + w * u, y + h * v, txt, 'sans', 36, c)


def ecg(g, x, y, w, t, fast=1., col='acc'):
    pts = []
    for i in range(121):
        u = i / 120; ph = (u * 3 * fast - t * fast * 1.2) % 1
        v = 0
        if .40 < ph < .44: v = -90
        elif .44 <= ph < .48: v = 60
        elif .48 <= ph < .52: v = -20
        pts.append((x + w * u, y + v))
    g.line(pts, col, 7)


def bars(g, x, y, n, lvl, col='acc'):
    for i in range(n):
        on = i < round(lvl * n)
        g.rect(x + i * 70, y - 120, x + i * 70 + 50, y, fill=col if on else None, out=None if on else 'mute', rad=8, w=4)


def card(g, x, y, w, h, head, body, size=58, stamp=0., stamp_txt='ЛОЖЬ'):
    fill = '#ffffff' if g.st.name == 'yellow' else '#151b2b' if g.st.name == 'dark' else '#22305f'
    g.rect(x - w / 2, y - h / 2, x + w / 2, y + h / 2, fill=fill if g.st.name != 'stick' else None, out=g.O or 'fg', rad=24, w=5)
    g.text(x, y - h / 2 + 60, head, 'mono', 40, 'acc')
    kind = {'stick': 'hand', 'dark': 'cond', 'flat': 'sans', 'yellow': 'sans'}[g.st.name]
    lines = wrap_words(body.split(), F(kind, size), w - 100)
    for i, L in enumerate(lines):
        g.text(x, y + 10 + (i - (len(lines) - 1) / 2) * size * 1.2, ' '.join(L), kind, size, 'fg')
    if stamp > 0:
        sc = .6 + .4 * back(stamp)
        lay = Image.new('RGBA', (int(560 * SS), int(220 * SS)), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
        c = hexc(g.st.acc2 if g.st.name != 'dark' else g.st.acc)
        d.rounded_rectangle((10 * SS, 10 * SS, 550 * SS, 210 * SS), radius=20 * SS, outline=c, width=12 * SS)
        d.text((280 * SS, 112 * SS), stamp_txt, font=F('cond' if g.st.name != 'stick' else 'hand', 140 * SS, 700), fill=c, anchor='mm')
        lay = lay.rotate(12, expand=True, resample=Image.BICUBIC)
        lay = lay.resize((int(lay.width * sc), int(lay.height * sc)), Image.BICUBIC)
        g.im.alpha_composite(lay, (int(x * SS - lay.width / 2), int((y + h * .18) * SS - lay.height / 2)))


def light(g, x, y, ang, col, a=60, L=900, wd=120):
    r = math.radians(ang)
    tip = (x, y); e1 = (x + math.sin(r) * L - math.cos(r) * wd, y + math.cos(r) * L + math.sin(r) * wd)
    e2 = (x + math.sin(r) * L + math.cos(r) * wd, y + math.cos(r) * L - math.sin(r) * wd)
    g.d.polygon([g.P(*tip), g.P(*e1), g.P(*e2)], fill=g.C(col, a))


def people(g, x, y, n=5, k=.55, gap=110, moods=None):
    for i in range(n):
        fig(g, x + (i - (n - 1) / 2) * gap, y, k, mood=(moods[i] if moods else 'ok'))


def step_head(g, x, y, n, title):
    kind = {'stick': 'hand', 'dark': 'cond', 'flat': 'sans', 'yellow': 'wide'}[g.st.name]
    g.text(x, y, f'Шаг {n}', kind, 120, 'acc')
    g.text(x, y + 110, title, kind, 66, 'fg')


def handle_card(g, x, y, txt='@languagegamesbot', sub='5 минут сцены вместо ленты'):
    g.rect(x - 360, y - 120, x + 360, y + 120, fill=g.FL('#ffffff'), out=g.O or 'acc', rad=36, w=6)
    g.text(x, y - 30, txt, 'sans', 60, 'acc' if not g.st.flat else '#1a1a1a')
    g.text(x, y + 50, sub, 'sans', 38, 'fg' if not g.st.flat else '#555555')


# ───────────────────────── субтитры и шапка ─────────────────────────
def wrap_words(words, font, maxw):
    lines, cur = [], []
    for w in words:
        test = ' '.join(cur + [w])
        if cur and font.getlength(test) > maxw: lines.append(cur); cur = [w]
        else: cur.append(w)
    if cur: lines.append(cur)
    return lines


def norm(w): return ''.join(ch for ch in w.lower() if ch.isalnum() or ch in '–-×%+')


def draw_caption(im, st, cap, hl, lt):
    if not cap: return
    kind, size, wght = st.cap
    txt = cap.upper() if st.upper else cap
    words = txt.split()
    font = F(kind, size, wght)
    lines = wrap_words(words, font, 860)
    if len(lines) > 3:
        size = int(size * .82); font = F(kind, size, wght); lines = wrap_words(words, font, 880)
    hls = set()
    for h in hl:
        for w in h.split(): hls.add(norm(w))
    lh = size * (1.12 if kind != 'hand' else 1.0)
    y0 = CY - (len(lines) - 1) * lh / 2
    lay = Image.new('RGBA', (W, 560), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    idx = 0; n = len(words)
    for li, L in enumerate(lines):
        tw = font.getlength(' '.join(L)); x = W / 2 - tw / 2; y = y0 + li * lh - (CY - 280)
        for w in L:
            ap = cl((lt - 0.05 - idx * min(.07, .6 / max(1, n))) / .12)
            if ap > 0:
                c = hexc(st.cap_hl if norm(w) in hls else st.cap_col, int(255 * ap))
                dy = (1 - eo(ap)) * 18
                if st.shadow: d.text((x + 4, y + 5 + dy), w, font=font, fill=(0, 0, 0, int(150 * ap)), anchor='lm')
                d.text((x, y + dy), w, font=font, fill=c, anchor='lm')
            x += font.getlength(w + ' '); idx += 1
    im.alpha_composite(lay, (0, int(CY - 280)))


def draw_hud(im, st, hud, lt, t):
    if not hud: return
    d = ImageDraw.Draw(im)
    a = int(255 * eo(lt / .25))
    if st.hud == 'mono':
        f = F('mono', 40, 700); x0 = 80; y0 = 150
        blink = (int(t * 2) % 2 == 0)
        d.ellipse((x0, y0 - 11, x0 + 22, y0 + 11), fill=hexc(st.acc, a if blink else 60))
        d.text((x0 + 42, y0), hud, font=f, fill=hexc(st.fg, a), anchor='lm')
        d.line([(x0, y0 + 40), (x0 + 42 + f.getlength(hud), y0 + 40)], fill=hexc(st.acc, a), width=3)
    elif st.hud == 'plaque':
        f = F('mono', 36, 600); tw = f.getlength(hud)
        x0, x1 = W / 2 - tw / 2 - 40, W / 2 + tw / 2 + 40
        d.rounded_rectangle((x0, 128, x1, 192), radius=6, outline=hexc('#c9a24a', a), width=3, fill=hexc('#0d1430', int(a * .7)))
        d.text((W / 2, 160), hud, font=f, fill=hexc('#e8d5a2', a), anchor='mm')
    elif st.hud == 'big':
        f = F('wide', 84, 700)
        d.text((80, 175), hud, font=f, fill=hexc(st.fg, a), anchor='lm')
        d.rectangle((80, 232, 80 + min(f.getlength(hud), 520), 242), fill=hexc(st.acc, a))
    elif st.hud == 'hand':
        f = F('hand', 70, 700)
        d.text((80, 170), hud, font=f, fill=hexc(st.acc, a), anchor='lm')


# ───────────────────────── сборка ролика ─────────────────────────
def beat_dur(b):
    if b.get('d'): return b['d']
    n = len(b['cap'].split())
    return max(2.2, .38 * n + 1.1)


def render(spec, out, frames=None):
    st = STYLES[spec['style']]; bg = make_bg(st).convert('RGBA')
    beats = spec['beats']; t = 0.
    for i, b in enumerate(beats):
        b['t0'] = t; b['dd'] = beat_dur(b) + (1.6 if i == len(beats) - 1 else 0); t += b['dd']
    total = t; N = int(total * FPS)
    cache = {}
    ff = None
    if frames is None:
        os.makedirs(os.path.dirname(out) or '.', exist_ok=True)
        ff = subprocess.Popen(['ffmpeg', '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS),
                               '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p',
                               '-movflags', '+faststart', out], stdin=subprocess.PIPE)
    want = range(N) if frames is None else [int(x * FPS) for x in frames]
    bi = 0
    for fi in want:
        tt = fi / FPS
        bi = max(i for i, b in enumerate(beats) if b['t0'] <= tt + 1e-9)
        b = beats[bi]; lt = tt - b['t0']; p = cl(lt / b['dd'])
        frame = bg.copy()
        live = st.boil or b.get('live')
        key = (bi,)
        if live or key not in cache:
            g = G(st, tt, b.get('z', 1.35))
            b['vis'](g, p, lt)
            lay = g.im.reduce(SS)
            if not live: cache = {key: lay}
        else:
            lay = cache[key]
        prev = beats[bi - 1] if bi else None
        cont = prev is not None and b.get('key') and prev.get('key') == b.get('key')
        a = 1. if cont else eo(lt / .3)
        if a < 1:
            al = lay.getchannel('A').point(lambda v, a=a: int(v * a)); lay = lay.copy(); lay.putalpha(al)
        frame.alpha_composite(lay, (0, VY + int((1 - a) * 46)))
        draw_hud(frame, st, b.get('hud', ''), lt if not (prev and prev.get('hud') == b.get('hud')) else 1, tt)
        draw_caption(frame, st, b['cap'], b.get('hl', ()), lt)
        if ff: ff.stdin.write(frame.convert('RGB').tobytes())
        else: frame.convert('RGB').save(out.replace('.mp4', f'-{fi:05d}.png'))
    if ff: ff.stdin.close(); ff.wait()
    return total


def _load():
    import importlib.util
    sp = importlib.util.spec_from_file_location('ttru', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tt_demo_ru.py'))
    m = importlib.util.module_from_spec(sp); sp.loader.exec_module(m)
    return m


def _run(name, out, fr):
    return render(_load().VIDEOS[name](), out, fr)


def main():
    import multiprocessing as mp
    m = _load()
    outd = sys.argv[1]; fr = None
    if '--frames' in sys.argv:
        i = sys.argv.index('--frames'); fr = [float(x) for x in sys.argv[i + 1].split(',')]; args = sys.argv[2:i] + sys.argv[i + 2:]
    else: args = sys.argv[2:]
    names = [a for a in args if a in m.VIDEOS] or list(m.VIDEOS)
    jobs = [(n, os.path.join(outd, f'{n}.mp4'), fr) for n in names]
    os.makedirs(outd, exist_ok=True)
    if fr or len(jobs) == 1:
        for j in jobs: print(j[1], round(_run(*j), 1), 'с')
    else:
        with mp.Pool(min(4, len(jobs))) as pool:
            for j, tot in zip(jobs, pool.starmap(_run, jobs)): print(j[1], round(tot, 1), 'с')


if __name__ == '__main__':
    main()
