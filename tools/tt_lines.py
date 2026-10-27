# Ролик для TikTok «реплики героя на рваной бумаге» (27.10, по ролику из TikTok, который прислал Андрей:
# Дормен закидывает Айви в отель и болтает). Записывать футажи не нужно, всё собирается из того, что уже есть:
#   - в начале — ульта (2 с вместо геймплея): экран в цвет героя, вспышка, тряска, печать «УЛЬТА», настоящий звук ульты из игры;
#   - дальше живой герой (его петля из Flow) на фоне его места (кадр петли без героя — фон с карточки от Зетки);
#   - в углу — круглая живая иконка того, про кого он говорит; на реплике-убийстве она краснеет и гаснет;
#   - снизу — рваная бумага: слова появляются по одному точно по голосу (время слов — распознавание mp3),
#     ключевое слово — жёлтым маркером, перевод сразу, после реплики — плашка «что значит»;
#   - в конце — бумага с @languagegamesbot.
# Звук: голос + эхо места (чуть-чуть) + еле слышный фон места, проседает под голос (amb_make.py) + шорох бумаги; −14 LUFS.
#   python3 tools/tt_lines.py tools/tt/<ролик>.json [--out <папка>] [--media <папка>] [--amb <папка из amb_make.py>]
# --media — папка, где искать видео и картинки по имени файла (если их нет — качаются по ссылке из json).
# Выход: <out>/<id>.mp4 — 1080×1920, 30 к/с; и <out>/<id>.jpg — кадр-обложка.
import argparse, json, math, os, shutil, subprocess, sys, tempfile
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from tt_make import lufs, run  # noqa: E402

W, H, FPS = 1080, 1920, 30
INK = (26, 22, 18)
INK2 = (92, 80, 66)
MARK = (255, 210, 63)
PAPER_X, PAPER_Y, PW = 495, 1130, 900   # центр бумаги по x (левее центра — справа кнопки TikTok), верх, ширина
HERO_Y = 228


# ---------- шрифты ----------
FONT_DIRS = ['/usr/share/fonts/opentype/inter', os.path.join(os.environ.get('WINDIR', r'C:\Windows'), 'Fonts')]
FONT_NAMES = {'black': ['Inter-Black.otf', 'seguibl.ttf'], 'bold': ['Inter-Bold.otf', 'segoeuib.ttf'],
              'bi': ['Inter-BoldItalic.otf', 'segoeuiz.ttf'], 'bki': ['Inter-BlackItalic.otf', 'seguibli.ttf']}
_FC = {}


def font(kind, size):
    k = (kind, int(size))
    if k not in _FC:
        for d in FONT_DIRS:
            for n in FONT_NAMES[kind]:
                if os.path.exists(os.path.join(d, n)):
                    _FC[k] = ImageFont.truetype(os.path.join(d, n), int(size))
                    break
            if k in _FC:
                break
        else:
            sys.exit('нет шрифта ' + kind + ' (Inter или Segoe UI)')
    return _FC[k]


def text_img(s, f, fill, stroke=0, sfill=(0, 0, 0)):
    b = f.getbbox(s, stroke_width=stroke)
    im = Image.new('RGBA', (b[2] - b[0] + 4, b[3] - b[1] + 4), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((2 - b[0], 2 - b[1]), s, font=f, fill=fill, stroke_width=stroke, stroke_fill=sfill)
    return im


def fade(im, a):
    if a >= .999:
        return im
    im = im.copy()
    im.putalpha(im.getchannel('A').point(lambda v: int(v * max(0, a))))
    return im


def ease(x):
    x = min(1, max(0, x))
    return 1 - (1 - x) ** 3


def back(x):  # с перелётом
    x = min(1, max(0, x))
    c = 1.9
    return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2


def hexrgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


# ---------- медиа ----------
def media(ref, base, mdir, wk):
    nm = os.path.basename(ref.split('?')[0])
    if mdir and os.path.exists(os.path.join(mdir, nm)):
        return os.path.join(mdir, nm)
    if ref.startswith('http'):
        import urllib.request
        q = urllib.request.Request(ref, headers={'User-Agent': 'Mozilla/5.0'})  # без UA Cloudflare отвечает 403
        p = os.path.join(wk, nm)
        open(p, 'wb').write(urllib.request.urlopen(q).read())
        return p
    p = ref if os.path.isabs(ref) else os.path.join(base, ref)
    if not os.path.exists(p):
        sys.exit('нет файла: ' + p + ' (положи его в --media)')
    return p


class Frames:
    # кадры петли по кругу: вырез, масштаб, 30 к/с — по одному из ffmpeg
    def __init__(self, path, crop, size, dur):
        x, y, w, h = crop
        self.w, self.h = size
        self.p = subprocess.Popen(['ffmpeg', '-v', 'error', '-stream_loop', '-1', '-i', path, '-t', f'{dur + 1:.2f}',
                                   '-vf', f'fps={FPS},crop={w}:{h}:{x}:{y},scale={size[0]}:{size[1]}:flags=lanczos',
                                   '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
        self.last = None

    def next(self):
        b = self.p.stdout.read(self.w * self.h * 3)
        if len(b) == self.w * self.h * 3:
            self.last = Image.frombytes('RGB', (self.w, self.h), b)
        return self.last


# ---------- бумага ----------
def torn_edge(r, n, amp):
    y = np.cumsum(r.normal(0, amp * .35, n))
    y -= np.linspace(y[0], y[-1], n)
    y = y / (np.abs(y).max() + 1e-9) * amp * .7 + r.uniform(-amp * .3, amp * .3, n)
    return y


def paper_base(ph, seed):
    # рваная бумага: кремовая, с волокном по краю, зерном и тенью; поле 40 px под тень
    r = np.random.default_rng(seed)
    pad = 40
    cw, chh = PW + pad * 2, ph + pad * 2
    xs = np.arange(0, PW + 1, 7)
    top = torn_edge(r, len(xs), 9)
    bot = torn_edge(r, len(xs), 9)

    def poly(inset):
        p = [(pad + x, pad + inset + t) for x, t in zip(xs, top)]
        p += [(pad + x, pad + ph - inset + b) for x, b in zip(xs[::-1], bot[::-1])]
        return p
    shadow = Image.new('L', (cw, chh), 0)
    ImageDraw.Draw(shadow).polygon([(x + 6, y + 12) for x, y in poly(0)], fill=150)
    shadow = shadow.filter(ImageFilter.GaussianBlur(14))
    im = Image.new('RGBA', (cw, chh), (0, 0, 0, 0))
    im.putalpha(shadow)
    fib = Image.new('L', (cw, chh), 0)
    ImageDraw.Draw(fib).polygon(poly(0), fill=255)
    body = Image.new('L', (cw, chh), 0)
    jit = r.uniform(2, 6, len(xs))
    pb = [(pad + x, pad + 5 + t + j) for x, t, j in zip(xs, top, jit)]
    pb += [(pad + x, pad + ph - 5 + b - j) for x, b, j in zip(xs[::-1], bot[::-1], jit[::-1])]
    ImageDraw.Draw(body).polygon(pb, fill=255)
    noise = (r.normal(0, 5, (chh, cw)) + np.array([0])).astype(np.float32)
    grain = Image.fromarray(np.clip(noise + 128, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(.6))
    g = np.asarray(grain, np.float32) - 128
    cream = np.zeros((chh, cw, 3), np.float32) + np.array([239, 230, 211], np.float32)
    yy = np.linspace(0, 1, chh)[:, None]
    cream *= (1 - .05 * yy)[..., None]   # чуть темнее книзу
    cream += g[..., None]
    white = np.zeros((chh, cw, 3), np.float32) + np.array([252, 249, 242], np.float32) + g[..., None] * .5
    fa = np.asarray(fib, np.float32)[..., None] / 255
    ba = np.asarray(body, np.float32)[..., None] / 255
    rgb = white * (1 - ba) + cream * ba
    pap = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)).convert('RGBA')
    pap.putalpha(fib)
    im.alpha_composite(pap)
    return im, pad


def layout(ln):
    # раскладка реплики на бумаге: слова (по строкам, по центру), перевод, плашка «что значит»
    fe = font('black', 74)
    words = ln['en'].replace("'", '’').split()
    maxw = PW - 150
    sp = fe.getlength(' ')
    rows, cur, cw = [], [], 0
    for w in words:
        lw = fe.getlength(w)
        if cur and cw + sp + lw > maxw:
            rows.append(cur)
            cur, cw = [], 0
        cw += (sp if cur else 0) + lw
        cur.append(w)
    rows.append(cur)
    y = 58
    pos = []
    for row in rows:
        tw = sum(fe.getlength(w) for w in row) + sp * (len(row) - 1)
        x = (PW - tw) / 2
        for w in row:
            lw = fe.getlength(w)
            pos.append((w, x, y, lw))
            x += lw + sp
        y += 90
    fr = font('bi', 44)
    ru_rows, cur = [], ''
    for w in ln['ru'].split():
        t = (cur + ' ' + w).strip()
        if cur and fr.getlength(t) > maxw:
            ru_rows.append(cur)
            cur = w
        else:
            cur = t
    ru_rows.append(cur)
    yr = y + 14
    y = yr + 56 * len(ru_rows)
    yn, note = None, []
    if ln.get('note'):
        fn = font('bold', 32)
        cur = ''
        for w in ln['note'].split():
            t = (cur + ' ' + w).strip()
            if cur and fn.getlength(t) > maxw - 40:
                note.append(cur)
                cur = w
            else:
                cur = t
        note.append(cur)
        yn = y + 22
        y = yn + 14 + 42 * len(note)
    return dict(words=pos, ru=ru_rows, yr=yr, yn=yn, note=note, ph=int(y + 46))


def is_kw(w, kws):
    c = ''.join(ch for ch in w.lower() if ch.isalnum())
    return any(c == ''.join(ch for ch in k.lower() if ch.isalnum()) for k in kws)


def paper_frame(L, t, base, pad):
    # бумага реплики в момент t: слова по голосу, маркер, перевод, плашка
    im = base.copy()
    d = ImageDraw.Draw(im, 'RGBA')
    ox, oy = pad, pad
    fe = font('black', 74)
    for j, (w, x, y, lw) in enumerate(L['lay']['words']):
        a, b, key = L['W'][j][1], L['W'][j][2], L['W'][j][3]
        if t < a:
            continue
        if key:
            p = ease((t - a) / .22)
            d.rounded_rectangle([ox + x - 8, oy + y + 6, ox + x - 8 + (lw + 16) * p, oy + y + 80], 10, fill=MARK + (235,))
    for j, (w, x, y, lw) in enumerate(L['lay']['words']):
        a = L['W'][j][1]
        if t < a:
            continue
        k = t - a
        if k < .16:
            s = 1.32 - .32 * ease(k / .16)
            f2 = font('black', 74 * s)
            ti = text_img(w, f2, INK + (255,))
            cx, cy = ox + x + lw / 2, oy + y + 44
            im.alpha_composite(fade(ti, .4 + .6 * k / .16), (int(cx - ti.width / 2), int(cy - ti.height / 2)))
        else:
            d.text((ox + x, oy + y), w, font=fe, fill=INK + (255,))
    k = t - L['t0']
    if k > -.05:
        al = int(255 * ease((k + .05) / .3))
        fr = font('bi', 44)
        for i, row in enumerate(L['lay']['ru']):
            tw = fr.getlength(row)
            d.text((ox + (PW - tw) / 2, oy + L['lay']['yr'] + i * 56), row, font=fr, fill=INK2 + (al,))
    if L['lay']['yn'] is not None and t > L['end'] + .1:
        p = back((t - L['end'] - .1) / .3)
        fn = font('bold', 32)
        NL = L['lay']['note']
        bw = max(fn.getlength(r) for r in NL) + 44
        bh = 14 + 42 * len(NL)
        cx, cy = ox + PW / 2, oy + L['lay']['yn'] + bh / 2
        chip = Image.new('RGBA', (int(bw) + 2, bh), (0, 0, 0, 0))
        cd = ImageDraw.Draw(chip)
        cd.rounded_rectangle([0, 0, bw, bh - 1], 24, fill=(30, 26, 22, 255))
        for i, r in enumerate(NL):
            cd.text(((bw - fn.getlength(r)) / 2, 6 + 42 * i), r, font=fn, fill=MARK + (255,))
        if p < .999:
            sw = max(1, int(chip.width * max(.05, p)))
            chip = chip.resize((sw, max(1, int(bh * max(.05, p)))), Image.BICUBIC)
        im.alpha_composite(chip, (int(cx - chip.width / 2), int(cy - chip.height / 2)))
    return im


def end_paper(E, t, base, pad, t0):
    im = base.copy()
    d = ImageDraw.Draw(im, 'RGBA')
    k = t - t0
    rows = [(E.get('top', '').upper(), font('bold', 34), INK2, 0.0), (E.get('big', ''), font('black', 70), INK, .15),
            (E.get('sub', ''), font('bi', 40), INK2, .35)]
    y = 64
    for s, f, c, dl in rows:
        if s:
            a = int(255 * ease((k - dl) / .3))
            tw = f.getlength(s)
            d.text((pad + (PW - tw) / 2, pad + y), s, font=f, fill=c + (max(0, a),))
        y += {34: 62, 70: 98, 40: 60}[f.size]
    return im


def circle_mask(n):
    m = Image.new('L', (n * 4, n * 4), 0)
    ImageDraw.Draw(m).ellipse([0, 0, n * 4 - 1, n * 4 - 1], fill=255)
    return m.resize((n, n), Image.LANCZOS)


# ---------- сборка ----------
def build(spec, base_dir, out, mdir, amb):
    os.makedirs(out, exist_ok=True)
    wk = tempfile.mkdtemp(prefix='ttl_')
    acc = hexrgb(spec.get('accent', '#8FCB4F'))
    adir = spec['audio'] if os.path.isabs(spec['audio']) else os.path.join(base_dir, spec['audio'])
    vid = media(spec['video'], base_dir, mdir, wk)
    bgp = media(spec['bg'], base_dir, mdir, wk)
    P = spec.get('partner')
    ult = spec.get('ult')
    # --- время ---
    VO, SX = [], []
    HIT = .05
    t = .85 if ult else .5
    if ult:
        SX.append((os.path.join(adir, ult['sx']), HIT, 0))
    page = os.path.join(HERE, '..', 'snd', 'kino', 'page.mp3')
    LS = []
    for ln in spec['lines']:
        words = ln['en'].replace("'", '’').split()
        if len(words) != len(ln['w']):
            sys.exit('слов %d, а времени %d: %s' % (len(words), len(ln['w']), ln['en']))
        lay = layout(ln)
        Wt = [(w, t + a, t + b, is_kw(w, ln.get('kw', []))) for w, (a, b) in zip(words, ln['w'])]
        end = t + ln['w'][-1][1]
        hold = 1.25 + .02 * len(ln['ru']) + (.35 if ln.get('note') else 0)
        L = dict(ln=ln, lay=lay, W=Wt, t0=t, end=end, pin=t - .32, note=ln.get('note'),
                 about=ln.get('about'), kill=ln.get('kill'), ult=ln.get('ult'))
        LS.append(L)
        VO.append((os.path.join(adir, ln['a']), t))
        SX.append((page, t - .32, -9))
        t = end + hold + .32
    E = spec.get('end')
    ENDT = t - .32
    SX.append((page, ENDT, -9))
    DUR = t + 2.4
    for i, L in enumerate(LS):
        L['base'], L['pad'] = paper_base(L['lay']['ph'], 11 + i * 7)
        L['ang'] = (-1.6, 1.3, -1.1, 1.7, -1.4, 1.0)[i % 6]
    ep = paper_base(300, 99)
    # --- картинка ---
    HH = int(round(spec['crop'][3] * W / spec['crop'][2] / 2)) * 2
    hero = Frames(vid, spec['crop'], (W, HH), DUR)
    PS = 210
    pfr = Frames(media(P['video'], base_dir, mdir, wk), P['face'], (PS, PS), DUR) if P else None
    pcol = hexrgb(P['color']) if P else acc
    cm = circle_mask(PS)
    bgi = Image.open(bgp).convert('RGB').resize((W, H), Image.LANCZOS)
    bgi = Image.blend(bgi, Image.new('RGB', (W, H), (0, 0, 0)), .28)
    BW, BH = int(W * 1.07), int(H * 1.07)
    bgi = bgi.resize((BW, BH), Image.LANCZOS)
    # маска героя: края и низ растворяются в фоне
    m = np.ones((HH, W), np.float32)
    xr = np.arange(W)
    m *= np.clip(np.minimum(xr, W - 1 - xr) / 80, 0, 1)[None, :]
    yr = np.arange(HH)
    m *= np.clip(yr / 40, 0, 1)[:, None] * np.clip((HH - 1 - yr) / 260, 0, 1)[:, None]
    hmask = Image.fromarray((m ** 1.4 * 255).astype(np.uint8))
    hdr = text_img(spec['hero'].upper(), font('black', 50), (255, 255, 255, 255), 5, (0, 0, 0))
    hab = text_img(spec.get('about', ''), font('bi', 40), acc + (255,), 4, (0, 0, 0)) if spec.get('about') else None
    pname = text_img(P['name'], font('bold', 30), (255, 255, 255, 255), 4, (0, 0, 0)) if P else None
    st = ult and text_img(ult['stamp'], font('bki', 190), acc + (255,), 12, (12, 10, 8))
    if st:
        st = st.rotate(8, resample=Image.BICUBIC, expand=True)
    stsub = ult and ult.get('sub') and text_img(ult['sub'], font('bi', 48), (255, 255, 255, 255), 5, (0, 0, 0))
    first_about = next((L['pin'] for L in LS if L['about']), None)
    kill = next((L for L in LS if L['kill']), None)
    kill_t = kill['W'][-1][1] if kill else None
    enc = subprocess.Popen(['ffmpeg', '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS),
                            '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-profile:v', 'high',
                            '-pix_fmt', 'yuv420p', os.path.join(wk, 'v.mp4')], stdin=subprocess.PIPE)
    N = int(DUR * FPS)
    cover = None
    for fi in range(N):
        t = fi / FPS
        # тряска: ульта и убийство
        sx = sy = 0.0
        for t0, a in ((HIT if ult else -9, 22), (kill_t if kill_t else -9, 12)):
            k = t - t0
            if 0 <= k < .6:
                sx += a * math.sin(k * 75) * math.exp(-k * 6)
                sy += a * .6 * math.cos(k * 61) * math.exp(-k * 6)
        ox = (BW - W) / 2 + 22 * math.sin(2 * math.pi * t / 14)
        oy = (BH - H) / 2 + 26 * math.sin(2 * math.pi * t / 17)
        fr = bgi.crop((int(ox), int(oy), int(ox) + W, int(oy) + H)).convert('RGBA')
        # герой
        hf = hero.next()
        s = 1.0
        if ult and t >= HIT:
            s = 1 + .16 * math.exp(-(t - HIT) * 6)
        elif ult:
            s = 1.16
        if s > 1.002:
            hw, hh = int(W * s), int(HH * s)
            hf = hf.resize((hw, hh), Image.BILINEAR).crop(((hw - W) // 2, (hh - HH) // 2, (hw - W) // 2 + W, (hh - HH) // 2 + HH))
        fr.paste(hf, (int(sx), int(HERO_Y + sy)), hmask)
        # ульта: экран в цвет героя, ударная волна, вспышка, печать
        if ult and t < 2.6:
            if t < .9:
                g = .5 * (1 - ease((t - .1) / .8)) if t > .1 else .5
                fr = Image.blend(fr, Image.new('RGBA', (W, H), acc + (255,)), g * .42)
            k = t - HIT
            if 0 <= k < .55:
                ov = Image.new('RGBA', (W, H), (0, 0, 0, 0))
                od = ImageDraw.Draw(ov)
                rr = 80 + 900 * ease(k / .55)
                cx, cy = W / 2, HERO_Y + HH * .42
                od.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], outline=acc + (int(230 * (1 - k / .55)),), width=int(26 * (1 - k / .55)) + 2)
                fr.alpha_composite(ov)
            if st and t < 1.75:
                p = min(1, (t + .02) / .15)
                sc = 1.6 - .6 * ease(p)
                a = 1 if t < 1.4 else max(0, 1 - (t - 1.4) / .35)
                im = st.resize((int(st.width * sc), int(st.height * sc)), Image.BILINEAR) if sc > 1.001 else st
                fr.alpha_composite(fade(im, a * min(1, .3 + p)), (int(W / 2 - im.width / 2 + sx), int(640 - im.height / 2 + sy)))
                if stsub and k > .25:
                    fr.alpha_composite(fade(stsub, a * ease((k - .25) / .25)), (int(W / 2 - stsub.width / 2), 790))
            if 0 <= k < .45:
                fr = Image.blend(fr, Image.new('RGBA', (W, H), (255, 252, 240, 255)), .7 * math.exp(-k / .07))
        # шапка: кто говорит и про кого
        if t > .9:
            a = ease((t - .9) / .35)
            fr.alpha_composite(fade(hdr, a), (int(56 - 40 * (1 - a)), 170))
            if hab and first_about is not None and t > first_about:
                a2 = ease((t - first_about) / .35)
                fr.alpha_composite(fade(hab, a2), (int(58 - 40 * (1 - a2)), 170 + hdr.height + 6))
        # живая иконка того, про кого речь
        if pfr is not None:
            pf = pfr.next()
            if first_about is not None and t > first_about:
                p = back((t - first_about) / .35)
                dead = kill_t is not None and t > kill_t
                ic = pf.convert('RGBA')
                ring = pcol
                if dead:
                    k = t - kill_t
                    gray = pf.convert('L').convert('RGBA')
                    ic = Image.blend(ic, gray, min(1, k / .35))
                    ic = Image.blend(ic, Image.new('RGBA', (PS, PS), (200, 30, 30, 255)), .45 * math.exp(-k / .25))
                    ring = (220, 50, 50)
                ic.putalpha(cm)
                n = PS + 16
                bub = Image.new('RGBA', (n, n), (0, 0, 0, 0))
                bd = ImageDraw.Draw(bub)
                bd.ellipse([0, 0, n - 1, n - 1], fill=ring + (255,))
                bub.alpha_composite(ic, (8, 8))
                if dead:
                    k = t - kill_t
                    q = ease(k / .2)
                    bd = ImageDraw.Draw(bub)
                    c = n / 2
                    L1 = 70 * q
                    bd.line([c - L1, c - L1, c + L1, c + L1], fill=(230, 40, 40, 255), width=16)
                    bd.line([c + L1, c - L1, c - L1, c + L1], fill=(230, 40, 40, 255), width=16)
                sc = max(.05, p)
                if abs(sc - 1) > .002:
                    bub = bub.resize((max(1, int(n * sc)), max(1, int(n * sc))), Image.BICUBIC)
                jx = 0
                if kill_t is not None and 0 <= t - kill_t < .5:
                    jx = 14 * math.sin((t - kill_t) * 70) * math.exp(-(t - kill_t) * 7)
                cx, cy = 912, 312
                fr.alpha_composite(bub, (int(cx - bub.width / 2 + jx), int(cy - bub.height / 2)))
                if p > .6:
                    fr.alpha_composite(fade(pname, min(1, (p - .6) / .4)), (int(cx - pname.width / 2), int(cy + n / 2 + 4)))
        # бумага: текущая въезжает снизу, прошлая улетает влево
        cur = None
        for i, L in enumerate(LS):
            if t >= L['pin']:
                cur = i
        papers = []
        if t >= ENDT:
            papers.append(('end', ENDT))
            if LS:
                papers.insert(0, (len(LS) - 1, None))
        elif cur is not None:
            if cur > 0:
                papers.append((cur - 1, None))
            papers.append((cur, LS[cur]['pin']))
        for idx, pin in papers:
            if idx == 'end':
                im = end_paper(E, t, ep[0], ep[1], ENDT + .2)
                ang, tin, outk = -.8, ENDT, None
            else:
                L = LS[idx]
                im = paper_frame(L, t, L['base'], L['pad'])
                ang, tin = L['ang'], L['pin']
                nxt = LS[idx + 1]['pin'] if idx + 1 < len(LS) else ENDT
                outk = t - nxt
            dx = dy = 0.0
            ra = ang
            k = t - tin
            if k < .32:
                q = ease(k / .32)
                dy = (1 - q) * 520
                ra = ang + (1 - q) * 7
            if outk is not None and outk >= 0:
                if outk > .3:
                    continue
                q = ease(outk / .3)
                dx = -q * 1100
                ra = ang - q * 14
                dy = -q * 60
            rim = im.rotate(ra, resample=Image.BICUBIC, expand=True)
            x = PAPER_X - rim.width / 2 + dx + sx * .4
            y = PAPER_Y - (rim.height - im.height) / 2 - (L['pad'] if idx != 'end' else ep[1]) + dy
            fr.alpha_composite(rim, (int(x), int(y)))
        rgb = fr.convert('RGB')
        enc.stdin.write(rgb.tobytes())
        if LS and cover is None and len(LS) > 1 and t >= LS[1]['end'] + .2:
            cover = rgb
    enc.stdin.close()
    enc.wait()
    hero.p.kill()
    if pfr:
        pfr.p.kill()
    # --- звук: голос (+ капля эха), фон места под голос, звуки ---
    ins, fl = [], []
    for i, (p, at) in enumerate(VO):
        ins += ['-i', p]
        ms = int(at * 1000)
        fl.append(f'[{i}:a]aresample=48000,aformat=channel_layouts=stereo,adelay={ms}|{ms}[v{i}]')
    fl.append(''.join(f'[v{i}]' for i in range(len(VO))) + f'amix=inputs={len(VO)}:normalize=0,apad,atrim=0:{DUR:.2f}[o]')
    run(['ffmpeg', '-y', '-v', 'error', *ins, '-filter_complex', ';'.join(fl), '-map', '[o]', '-c:a', 'pcm_s16le', 'vo.wav'], cwd=wk)
    ins, fl = [], []
    for i, (p, at, db) in enumerate(SX):
        ins += ['-i', os.path.abspath(p)]
        ms = int(max(0, at) * 1000)
        fl.append(f'[{i}:a]aresample=48000,aformat=channel_layouts=stereo,volume={db}dB,adelay={ms}|{ms}[s{i}]')
    fl.append(''.join(f'[s{i}]' for i in range(len(SX))) + f'amix=inputs={len(SX)}:normalize=0,apad,atrim=0:{DUR:.2f}[o]')
    run(['ffmpeg', '-y', '-v', 'error', *ins, '-filter_complex', ';'.join(fl), '-map', '[o]', '-c:a', 'pcm_s16le', 'sx.wav'], cwd=wk)
    Lv = lufs(os.path.join(wk, 'vo.wav'))
    place = spec.get('amb', 'city')
    bed, ir = os.path.join(amb, f'amb-{place}.wav'), os.path.join(amb, f'ir-{place}.wav')
    gb = (Lv - 26) - lufs(bed)   # фон — на 26 дБ тише голоса: еле слышно, лишь бы не пустота
    mix = (f"[0:a]asplit=2[vd][vr];[1:a]aformat=channel_layouts=stereo[irs];[vr][irs]afir=gtype=gn,volume=0.18,lowpass=f=5200[vrv];"
           f"[vd][vrv]amix=inputs=2:normalize=0[voc];[voc]asplit=2[voc1][sc];"
           f"[2:a]volume={gb:.2f}dB,aformat=channel_layouts=stereo,atrim=0:{DUR:.2f},afade=t=in:d=0.8,afade=t=out:st={DUR - .9:.2f}:d=0.9[bd];"
           f"[bd][sc]sidechaincompress=threshold=0.02:ratio=5:attack=20:release=500[bdd];"
           f"[voc1][bdd][3:a]amix=inputs=3:normalize=0,atrim=0:{DUR:.2f}[o]")
    run(['ffmpeg', '-y', '-v', 'error', '-i', 'vo.wav', '-i', ir, '-stream_loop', '-1', '-i', bed, '-i', 'sx.wav',
         '-filter_complex', mix, '-map', '[o]', '-c:a', 'pcm_s16le', 'mix.wav'], cwd=wk)
    g = -14 - lufs(os.path.join(wk, 'mix.wav'))
    dst = os.path.join(os.path.abspath(out), spec['id'] + '.mp4')
    run(['ffmpeg', '-y', '-v', 'error', '-i', 'v.mp4', '-i', 'mix.wav', '-filter_complex',
         f'[1:a]volume={g:.2f}dB,alimiter=limit=0.89:level=disabled[a]', '-map', '0:v', '-map', '[a]',
         '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', dst], cwd=wk)
    if cover is not None:
        cover.save(os.path.join(os.path.abspath(out), spec['id'] + '.jpg'), quality=90)
    shutil.rmtree(wk, ignore_errors=True)
    return dst, DUR, round(lufs(dst), 1)


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('spec')
    ap.add_argument('--out', default='tt-out')
    ap.add_argument('--media')
    ap.add_argument('--amb')
    a = ap.parse_args()
    spec = json.load(open(a.spec, encoding='utf8'))
    amb = a.amb
    if not amb:
        amb = tempfile.mkdtemp(prefix='amb_')
        run([sys.executable, os.path.join(HERE, 'amb_make.py'), '--out', amb])
    dst, dur, L = build(spec, os.path.dirname(os.path.abspath(a.spec)), a.out, a.media, amb)
    print(f'{dur:.1f} с · {L} LUFS · {dst}')
