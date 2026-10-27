# Ролики для TikTok «Дормен — гостям отеля» (27.10) — по двум примерам, которые прислал Андрей.
# Все реплики — настоящие, из ульты Дормена (Hotel Guest): он запирает героя в отеле «Баронесса» и говорит именно ему.
# Это связный монолог к одному герою, поэтому ульта в начале тут к месту (в прошлом ролике Дормен ↔ Талон был обычный разговор — не к месту).
# Два вида (поле mode в json):
#   mini  — как «ok just posting my favourite doorman voicelines now»: чёрный фон, подпись сверху, две карточки
#           (Дормен в рамке слева, гость справа), под Дорменом — волна голоса и текущее слово; от нас — перевод фразы ниже.
#   guest — как португальский ролик с Рэм: ульта Дормена → гость на весь экран, имя гостя от руки сверху,
#           Дормен наклейкой над бумагой, на рваной бумаге — по 1–3 слова крупно (текущее жёлтым), ниже — перевод фразы.
# Время слов — по голосу (tools/wt_vosk.py, нужна модель Vosk: --model) или готовое поле w у реплики.
#   python3 tools/tt_guest.py tools/tt/<ролик>.json --media <папка с артами и mp3> --fonts <папка со шрифтами> [--model <vosk>] [--out <папка>]
# Шрифты (Google Fonts, OFL): Oswald[wght].ttf, Caveat[wght].ttf, PlayfairDisplay[wght].ttf; без них — Inter.
# Выход: <out>/<id>.mp4 (1080×1920, 30 к/с, −14 LUFS) и <id>.jpg — кадр для обложки.
import argparse, json, math, os, re, subprocess, sys, tempfile
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from tt_make import lufs, run  # noqa: E402

W, H, FPS = 1080, 1920, 30
MARK = (255, 210, 63)
CREAM = (244, 236, 220)
SAFE_R = 900      # правее — кнопки TikTok
SAFE_B = 1530     # ниже — подпись TikTok
GAP = 0.55        # пауза между репликами, с
FONTS = {}


def fnt(kind, size, fdir):
    # kind: osw (узкий заглавный), hand (от руки), serif (засечки), ui / uib / uii (Inter)
    k = (kind, int(size))
    if k in FONTS:
        return FONTS[k]
    var = {'osw': ('Oswald[wght].ttf', b'Bold'), 'hand': ('Caveat[wght].ttf', b'Bold'),
           'serif': ('PlayfairDisplay[wght].ttf', b'Bold')}
    inter = {'ui': 'Inter-SemiBold.otf', 'uib': 'Inter-Black.otf', 'uii': 'Inter-MediumItalic.otf', 'osw': 'Inter-Black.otf',
             'hand': 'Inter-BoldItalic.otf', 'serif': 'Inter-Bold.otf'}
    f = None
    if kind in var and fdir and os.path.exists(os.path.join(fdir, var[kind][0])):
        f = ImageFont.truetype(os.path.join(fdir, var[kind][0]), int(size))
        try:
            f.set_variation_by_name(var[kind][1])
        except Exception:
            pass
    if f is None:
        f = ImageFont.truetype(os.path.join('/usr/share/fonts/opentype/inter', inter[kind]), int(size))
    FONTS[k] = f
    return f


def ease(x):
    x = max(0.0, min(1.0, x))
    return x * x * (3 - 2 * x)


def back(x):
    x = max(0.0, min(1.0, x))
    c = 1.70158
    return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2


# ---------- текст ----------
def sents(s):
    s = re.sub(r'\s+', ' ', s.strip())
    return [p for p in re.split(r'(?<=[.!?…])\s+', s) if p]


def ru_clean(s):
    return re.sub(r'\[([^\]]+)\]', lambda m: '(' + m.group(1).lower() + ')', s)


def word_sent(words):
    # номер предложения у каждого слова (по знаку в конце слова)
    out, k = [], 0
    for w in words:
        out.append(k)
        if re.search(r'[.!?…]$', w.rstrip('"”’\'')):
            k += 1
    return out


def chunks(words, maxw=3, maxc=15):
    # кусочки по 1–3 слова: рвём после знаков, не длиннее maxc букв
    C, cur = [], []
    for i, w in enumerate(words):
        n = sum(len(words[j]) for j in cur) + len(w)
        if cur and (len(cur) >= maxw or n > maxc):
            C.append(cur)
            cur = []
        cur.append(i)
        if re.search(r'[,.!?;:…—-]$', w):
            C.append(cur)
            cur = []
    if cur:
        C.append(cur)
    return C


def wrap(s, f, maxw):
    out, cur = [], ''
    for w in s.split():
        t = (cur + ' ' + w).strip()
        if cur and f.getlength(t) > maxw:
            out.append(cur)
            cur = w
        else:
            cur = t
    if cur:
        out.append(cur)
    return out


def text_img(s, f, fill, stroke=0, sfill=(0, 0, 0)):
    b = f.getbbox(s, stroke_width=stroke)
    im = Image.new('RGBA', (b[2] - b[0] + 8, b[3] - b[1] + 8), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((4 - b[0], 4 - b[1]), s, font=f, fill=fill, stroke_width=stroke, stroke_fill=sfill)
    return im


def paste_c(dst, im, cx, y, a=1.0):
    if a <= 0:
        return
    if a < 1:
        im = im.copy()
        im.putalpha(im.getchannel('A').point(lambda v: int(v * a)))
    dst.alpha_composite(im, (int(cx - im.width / 2), int(y)))


# ---------- картинки ----------
def load_crop(path, crop, size):
    im = Image.open(path).convert('RGBA')
    x, y, w, h = crop
    bg = Image.new('RGBA', im.size, (28, 26, 30, 255))
    bg.alpha_composite(im)
    return bg.crop((x, y, x + w, y + h)).resize(size, Image.LANCZOS)


def circle(im, d, border=12, col=(255, 255, 255)):
    im = im.resize((d, d), Image.LANCZOS)
    m = Image.new('L', (d * 4, d * 4), 0)
    ImageDraw.Draw(m).ellipse((0, 0, d * 4 - 1, d * 4 - 1), fill=255)
    m = m.resize((d, d), Image.LANCZOS)
    out = Image.new('RGBA', (d + border * 2 + 40, d + border * 2 + 40), (0, 0, 0, 0))
    sh = Image.new('L', out.size, 0)
    ImageDraw.Draw(sh).ellipse((20 + 6, 20 + 14, 20 + d + border * 2 + 6, 20 + d + border * 2 + 14), fill=150)
    out.putalpha(sh.filter(ImageFilter.GaussianBlur(10)))
    ring = Image.new('RGBA', out.size, (0, 0, 0, 0))
    ImageDraw.Draw(ring).ellipse((20, 20, 20 + d + border * 2, 20 + d + border * 2), fill=col + (255,))
    out.alpha_composite(ring)
    face = Image.new('RGBA', (d, d), (0, 0, 0, 0))
    face.paste(im, (0, 0), m)
    out.alpha_composite(face, (20 + border, 20 + border))
    return out


def torn(w, h, seed, rgb):
    # рваная бумага цветом rgb: волокно по краю, зерно, тень
    r = np.random.default_rng(seed)
    pad = 40
    cw, ch = w + pad * 2, h + pad * 2
    xs = np.arange(0, w + 1, 7)

    def edge(amp):
        y = np.cumsum(r.normal(0, amp * .35, len(xs)))
        y -= np.linspace(y[0], y[-1], len(xs))
        return y / (np.abs(y).max() + 1e-9) * amp * .7 + r.uniform(-amp * .3, amp * .3, len(xs))
    top, bot = edge(10), edge(10)
    poly = [(pad + x, pad + t) for x, t in zip(xs, top)] + [(pad + x, pad + h + b) for x, b in zip(xs[::-1], bot[::-1])]
    out = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
    sh = Image.new('L', (cw, ch), 0)
    ImageDraw.Draw(sh).polygon([(x + 6, y + 14) for x, y in poly], fill=170)
    out.putalpha(sh.filter(ImageFilter.GaussianBlur(14)))
    m = Image.new('L', (cw, ch), 0)
    ImageDraw.Draw(m).polygon(poly, fill=255)
    inner = Image.new('L', (cw, ch), 0)
    jit = r.uniform(3, 7, len(xs))
    pin = [(pad + x, pad + t + j) for x, t, j in zip(xs, top, jit)] + [(pad + x, pad + h + b - j) for x, b, j in zip(xs[::-1], bot[::-1], jit[::-1])]
    ImageDraw.Draw(inner).polygon(pin, fill=255)
    g = r.normal(0, 7, (ch, cw)).astype(np.float32)
    g = np.asarray(Image.fromarray(np.clip(g + 128, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(.7)), np.float32) - 128
    base = np.zeros((ch, cw, 3), np.float32) + np.array(rgb, np.float32)
    base *= (1 - .12 * np.linspace(0, 1, ch))[:, None, None]
    base += g[..., None]
    fib = np.zeros((ch, cw, 3), np.float32) + np.array([236, 226, 206], np.float32) + g[..., None] * .4
    ia = np.asarray(inner, np.float32)[..., None] / 255
    rgbim = fib * (1 - ia) + base * ia
    pap = Image.fromarray(np.clip(rgbim, 0, 255).astype(np.uint8)).convert('RGBA')
    pap.putalpha(m)
    out.alpha_composite(pap)
    return out, pad


# ---------- звук ----------
def env(path, rate=100):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True).stdout
    x = np.frombuffer(raw, '<i2').astype(np.float32) / 32768
    k = 16000 // rate
    n = len(x) // k
    e = np.sqrt((x[:n * k].reshape(n, k) ** 2).mean(1))
    return e / (e.max() + 1e-9), len(x) / 16000


def build_audio(spec, media, tl, total, wk):
    # голоса по местам + звук ульты; сухо, −14 LUFS
    ins, fl = [], []
    k = 0
    for L in tl:
        ins += ['-i', os.path.join(media, L['a'])]
        fl.append(f'[{k}:a]aresample=48000,pan=stereo|c0=c0|c1=c0,adelay={int(L["t0"] * 1000)}|{int(L["t0"] * 1000)}[v{k}]')
        k += 1
    sfx = spec.get('sfx') or []
    for s in sfx:
        ins += ['-i', os.path.join(media, s['a'])]
        fl.append(f'[{k}:a]aresample=48000,aformat=channel_layouts=stereo,volume={s.get("gain", 0.8)},adelay={int(s["t"] * 1000)}|{int(s["t"] * 1000)}[v{k}]')
        k += 1
    mix = ''.join(f'[v{i}]' for i in range(k))
    fl.append(f'{mix}amix=inputs={k}:normalize=0:duration=longest,apad,atrim=0:{total:.2f}[m]')
    raw = os.path.join(wk, 'mix.wav')
    run(['ffmpeg', '-v', 'error', '-y'] + ins + ['-filter_complex', ';'.join(fl), '-map', '[m]', '-ar', '48000', raw])
    g = -14 - lufs(raw)
    out = os.path.join(wk, 'mix14.wav')
    run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', f'volume={g:.2f}dB,alimiter=limit=0.89:level=false', out])
    return out


# ---------- разметка реплик ----------
def timeline(spec, media, model):
    tl, t = [], spec.get('intro', 0.0)
    for L in spec['lines']:
        p = os.path.join(media, L['a'])
        if 'w' not in L:
            from wt_vosk import align
            L['w'], q = align(model, p, L['en'])
            print('  %s: распознано %d%% слов' % (L['a'], round(q * 100)))
        e, dur = env(p)
        words = [w[2] for w in L['w']]
        en_s, ru_s = sents(L['en']), sents(ru_clean(L['ru']))
        ws = word_sent(words)
        nS = max(ws) + 1
        if len(ru_s) != nS:   # не совпало число предложений — перевод целиком
            ru_s = [ru_clean(L['ru'])]
            ws = [0] * len(words)
        tl.append(dict(L, t0=t, dur=dur, env=e, words=words, ws=ws, ru_s=ru_s, ch=chunks(words)))
        t += dur + GAP
    return tl, t - GAP


def at(tl, t):
    for L in tl:
        if L['t0'] - 0.05 <= t < L['t0'] + L['dur'] + GAP:
            return L
    return None


def cur_word(L, t):
    lt = t - L['t0']
    i = -1
    for k, (a, b, w) in enumerate(L['w']):
        if lt >= a - 0.04:
            i = k
    return i, lt


# ---------- вид mini ----------
class Mini:
    def __init__(self, spec, media, fdir, tl):
        self.s, self.m, self.fd, self.tl = spec, media, fdir, tl
        self.cw, self.chh = 420, 546
        sp = spec['speaker']
        self.left = load_crop(os.path.join(media, sp['art']), sp['crop'], (self.cw, self.chh))
        fr = Image.new('RGBA', (self.cw + 24, self.chh + 24), (237, 226, 204, 255))
        fr.alpha_composite(self.left, (12, 12))
        self.left = fr
        self.right = {}
        for L in tl:
            to = L['to']
            if to['art'] not in self.right:
                self.right[to['art']] = load_crop(os.path.join(media, to['art']), to['crop'], (self.cw + 24, self.chh + 24))
        f = fnt('ui', 46, fdir)
        self.cap = [text_img(s, f, (255, 255, 255)) for s in wrap(spec['title'], f, 900)]
        self.wm = text_img('@languagegamesbot', fnt('ui', 30, fdir), (120, 116, 110))

    def frame(self, t):
        im = Image.new('RGBA', (W, H), (0, 0, 0, 255))
        y = 300
        for c in self.cap:
            paste_c(im, c, W / 2, y)
            y += 62
        lx, rx, ty = 70, W - 70 - (self.cw + 24), 480
        im.alpha_composite(self.left, (lx, ty))
        L = at(self.tl, t) or self.tl[0]
        r = self.right[L['to']['art']]
        a = ease((t - L['t0'] + 0.15) / 0.25) if L is not self.tl[0] else 1
        if a < 1:
            r = r.copy()
            r.putalpha(r.getchannel('A').point(lambda v: int(v * a)))
        im.alpha_composite(r, (rx, ty + int((1 - a) * 18)))
        # волна под Дорменом
        cx, wy = lx + (self.cw + 24) / 2, ty + self.chh + 24 + 60
        d = ImageDraw.Draw(im)
        half = 190
        d.line((cx - half, wy, cx + half, wy), fill=(150, 146, 140), width=3)
        lt = t - L['t0']
        e = L['env']
        if 0 <= lt <= L['dur']:
            for k in range(-38, 39):
                j = int((lt + k * 0.012) * 100)
                if 0 <= j < len(e):
                    hgt = 3 + e[j] * 26 * (1 - abs(k) / 40)
                    xx = cx + k * 5
                    d.line((xx, wy - hgt, xx, wy + hgt), fill=(225, 222, 216), width=3)
        # текущее слово (засечки) и перевод фразы
        i, _ = cur_word(L, t)
        if i >= 0 and lt <= L['dur'] + 0.2:
            w = L['words'][i]
            fw = fnt('serif', 62, self.fd)
            wi = text_img(w, fw, (255, 255, 255))
            pop = back(min(1, (lt - L['w'][i][0] + 0.04) / 0.16))
            if pop < 1:
                wi = wi.resize((max(1, int(wi.width * (0.86 + 0.14 * pop))), max(1, int(wi.height * (0.86 + 0.14 * pop)))), Image.LANCZOS)
            paste_c(im, wi, cx, wy + 34 + (1 - pop) * 6)
            ru = L['ru_s'][min(L['ws'][i], len(L['ru_s']) - 1)]
            fr_ = fnt('uii', 36, self.fd)
            yy = wy + 150
            for s in wrap(ru, fr_, 880):
                paste_c(im, text_img(s, fr_, (176, 170, 160)), W / 2, yy)
                yy += 50
        im.alpha_composite(self.wm, (70, 1470))
        return im


# ---------- вид guest ----------
class Guest:
    def __init__(self, spec, media, fdir, tl):
        self.s, self.m, self.fd, self.tl = spec, media, fdir, tl
        self.bg = {}
        for L in tl:
            to = L['to']
            if to['art'] not in self.bg:
                b = load_crop(os.path.join(media, to['art']), to['crop'], (int(W * 1.1), int(H * 1.1)))
                arr = np.asarray(b.convert('RGB'), np.float32)
                yy, xx = np.mgrid[0:b.height, 0:b.width]
                v = 1 - 0.55 * (((xx / b.width - .5) * 1.5) ** 2 + ((yy / b.height - .45) * 1.2) ** 2)
                arr = arr * np.clip(v, .25, 1)[..., None] * .82
                self.bg[to['art']] = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).convert('RGBA')
        sp = spec['speaker']
        face = load_crop(os.path.join(media, sp['art']), sp['face'], (300, 300))
        self.stk = circle(face, 210, 12)
        self.dfull = load_crop(os.path.join(media, sp['art']), sp['crop_hook'], (W, int(W * sp['crop_hook'][3] / sp['crop_hook'][2])))
        self.dfull = self.dfull.resize((W, H), Image.LANCZOS) if self.dfull.height < H else self.dfull
        self.pw, self.ph = 860, 400
        self.paper, self.pad = torn(self.pw, self.ph, 7, (112, 34, 38))
        self.px, self.py = 30, SAFE_B - self.ph - 20
        self.names = {}
        for L in tl:
            nm = L['to']['name']
            if nm not in self.names:
                ni = text_img(nm, fnt('hand', 190, fdir), CREAM, 3, (40, 20, 20))
                self.names[nm] = ni.rotate(4, resample=Image.BICUBIC, expand=True)
        self.sub = text_img(spec.get('sub', 'гость отеля «Баронесса»'), fnt('ui', 34, fdir), (236, 226, 206))
        self.wm = text_img('@languagegamesbot', fnt('ui', 30, fdir), (236, 226, 206, 170))
        self.ult = spec.get('ult', 1.9)

    def hook(self, t):
        # 0..ult: Дормен влетает, кастует ульту — вспышка, и мы «внутри отеля»
        im = Image.new('RGBA', (W, H), (14, 8, 10, 255))
        x = int(-W * (1 - back(t / 0.55)))
        im.alpha_composite(self.dfull, (x, 0))
        im.alpha_composite(Image.new('RGBA', (W, H), (10, 4, 6, 90)))
        f = fnt('osw', 132, self.fd)
        for j, s in enumerate(self.s.get('hook', ['ДОРМЕН', 'ЗАПЕР ГОСТЯ']) ):
            tt = t - 0.25 - j * 0.18
            if tt > 0:
                ti = text_img(s, f, MARK if j == len(self.s.get('hook', [])) - 1 else CREAM, 6, (20, 8, 8))
                paste_c(im, ti, W / 2, 1120 + j * 160 + (1 - back(tt / 0.3)) * 50, min(1, tt / 0.15))
        fl = max(0.0, 1 - abs(t - (self.ult - 0.25)) / 0.25)
        if fl > 0:
            im.alpha_composite(Image.new('RGBA', (W, H), (255, 236, 200, int(255 * fl))))
        return im

    def frame(self, t):
        if t < self.ult:
            return self.hook(t)
        L = at(self.tl, t) or (self.tl[-1] if t > self.tl[-1]['t0'] else self.tl[0])
        lt = t - L['t0']
        # фон: медленный наезд
        b = self.bg[L['to']['art']]
        z = 1.0 + 0.06 * min(1, (t - self.ult) / 30)
        bw, bh = int(W * z), int(H * z)
        bb = b.resize((bw, bh), Image.BILINEAR) if z < 1.099 else b
        im = Image.new('RGBA', (W, H), (0, 0, 0, 255))
        im.alpha_composite(bb.crop(((bw - W) // 2, (bh - H) // 3, (bw - W) // 2 + W, (bh - H) // 3 + H)))
        fl = max(0.0, 1 - (t - (self.ult - 0.25)) / 0.45)
        # имя гостя от руки и подпись
        nm = self.names[L['to']['name']]
        ka = back(min(1, (t - self.ult) / 0.4))
        paste_c(im, nm, W / 2 - 40, 150 + (1 - ka) * -40, min(1, (t - self.ult) / 0.2))
        paste_c(im, self.sub, W / 2 - 40, 150 + nm.height - 10, min(1, (t - self.ult - .2) / 0.3))
        # бумага
        im.alpha_composite(self.paper, (self.px - self.pad, self.py - self.pad))
        # наклейка Дормена: качается в такт голосу
        j = int(max(0, lt) * 100)
        e = L['env'][j] if 0 <= j < len(L['env']) and 0 <= lt <= L['dur'] else 0
        sc = 1 + 0.05 * e
        st = self.stk.resize((int(self.stk.width * sc), int(self.stk.height * sc)), Image.BILINEAR).rotate(-6 + 4 * e, resample=Image.BICUBIC)
        im.alpha_composite(st, (self.px - 10, self.py - st.height + 70))
        # слова: кусочек 1–3 слова
        i, _ = cur_word(L, t)
        if i >= 0 and lt <= L['dur'] + GAP:
            ci = next(k for k, c in enumerate(L['ch']) if i in c)
            c = L['ch'][ci]
            c0 = L['w'][c[0]][0]
            pop = back(min(1, (lt - c0 + 0.04) / 0.14))
            f = fnt('osw', 116, self.fd)
            parts = [L['words'][k].upper() for k in c]
            widths = [f.getlength(p) for p in parts]
            sp_ = f.getlength(' ')
            tot = sum(widths) + sp_ * (len(parts) - 1)
            sz = 116 if tot < self.pw - 80 else int(116 * (self.pw - 80) / tot)
            f = fnt('osw', sz, self.fd)
            widths = [f.getlength(p) for p in parts]
            sp_ = f.getlength(' ')
            tot = sum(widths) + sp_ * (len(parts) - 1)
            line = Image.new('RGBA', (int(tot) + 40, int(sz * 1.5)), (0, 0, 0, 0))
            d = ImageDraw.Draw(line)
            x = 20
            for k, p, w_ in zip(c, parts, widths):
                d.text((x, 0), p, font=f, fill=MARK if k == i else CREAM, stroke_width=4, stroke_fill=(60, 14, 18))
                x += w_ + sp_
            if pop < 1:
                line = line.resize((max(1, int(line.width * (0.85 + 0.15 * pop))), max(1, int(line.height * (0.85 + 0.15 * pop)))), Image.LANCZOS)
            paste_c(im, line, self.px + self.pw / 2 + 40, self.py + 52 + (1 - pop) * 10)
            ru = L['ru_s'][min(L['ws'][i], len(L['ru_s']) - 1)]
            fr_ = fnt('uii', 35, self.fd)
            yy = self.py + 62 + sz * 1.25
            for s in wrap(ru, fr_, self.pw - 90)[:4]:
                paste_c(im, text_img(s, fr_, (236, 222, 200)), self.px + self.pw / 2 + 40, yy)
                yy += 45
        last = self.tl[-1]
        te = t - (last['t0'] + last['dur'] + 0.25)
        if te > 0:   # конец: куда идти
            a = min(1, te / 0.25)
            paste_c(im, text_img('ВСЕ РЕПЛИКИ С ПЕРЕВОДОМ —', fnt('osw', 58, self.fd), CREAM), self.px + self.pw / 2 + 40, self.py + 90, a)
            e2 = text_img('@LANGUAGEGAMESBOT', fnt('osw', 92, self.fd), MARK, 4, (60, 14, 18))
            paste_c(im, e2, self.px + self.pw / 2 + 40, self.py + 175 + (1 - back(te / 0.35)) * 30, a)
        im.alpha_composite(self.wm, (self.px + 30, self.py + self.ph + 6))
        if fl > 0:
            im.alpha_composite(Image.new('RGBA', (W, H), (255, 236, 200, int(255 * fl))))
        return im


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('spec')
    ap.add_argument('--media', required=True)
    ap.add_argument('--fonts')
    ap.add_argument('--model')
    ap.add_argument('--out', default='.')
    a = ap.parse_args()
    spec = json.load(open(a.spec, encoding='utf8'))
    if spec['mode'] == 'guest':
        spec.setdefault('intro', spec.get('ult', 1.9) + 0.25)
    tl, end = timeline(spec, a.media, a.model)
    total = end + spec.get('outro', 1.4)
    wk = tempfile.mkdtemp(prefix='ttg_')
    aud = build_audio(spec, a.media, tl, total, wk)
    R = (Mini if spec['mode'] == 'mini' else Guest)(spec, a.media, a.fonts, tl)
    os.makedirs(a.out, exist_ok=True)
    out = os.path.join(a.out, spec['id'] + '.mp4')
    n = int(total * FPS)
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                          '-i', aud, '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p',
                          '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
    cover = spec.get('cover_t', total * 0.4)
    for k in range(n):
        fr = R.frame(k / FPS).convert('RGB')
        if abs(k / FPS - cover) < 0.5 / FPS:
            fr.save(os.path.join(a.out, spec['id'] + '.jpg'), quality=88)
        p.stdin.write(fr.tobytes())
    p.stdin.close()
    p.wait()
    json.dump([{k: L[k] for k in ('a', 'en', 'w')} for L in tl], open(os.path.join(a.out, spec['id'] + '-wt.json'), 'w'), ensure_ascii=False)
    print(out, '%.1f с, %.1f LUFS' % (total, lufs(out)))


if __name__ == '__main__':
    main()
