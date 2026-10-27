# Ролик для TikTok «реплики героя на рваной бумаге» (27.10, по ролику из TikTok, который прислал Андрей:
# Дормен закидывает Айви в отель и болтает). Записывать футажи не нужно, всё собирается из того, что уже есть:
#   - в начале — ульта (2 с вместо геймплея): экран в цвет героя, вспышка, тряска, печать «УЛЬТА», настоящий звук ульты из игры;
#   - дальше живой герой (его петля из Flow) на фоне его места (кадр петли без героя — фон с карточки от Зетки);
#   - в углу — круглая живая иконка того, про кого он говорит; на реплике-убийстве она краснеет и гаснет;
#   - снизу — рваная бумага: слова появляются по одному точно по голосу (время слов — распознавание mp3),
#     ключевое слово — жёлтым маркером, перевод сразу, после реплики — плашка «что значит»;
#   - в конце — бумага с @languagegamesbot.
# Диалог (поле heroes, у реплик by/to): говорит один — он на экране на своём месте, второй — в кружке;
# сменился говорящий — новая панель заезжает косым срезом, как в комиксе; на бумаге ярлык «кто говорит».
# Герой без живой петли — поле art вместо video: арт дышит и чуть плывёт.
# Нет времени слов (w) — по длине слов внутри голоса (хуже: лучше распознать, см. ТЗ Зетке).
# Звук: голос + эхо места (чуть-чуть) + еле слышный фон места, проседает под голос (amb_make.py) + шорох бумаги; −14 LUFS.
#   python3 tools/tt_lines.py tools/tt/<ролик>.json [--out <папка>] [--media <папка>] [--amb <папка из amb_make.py>]
# --media — папка, где искать видео и картинки по имени файла (если их нет — качаются по ссылке из json).
# Выход: <out>/<id>.mp4 — 1080×1920, 30 к/с; и <out>/<id>.jpg — кадр-обложка.
import argparse, json, math, os, shutil, subprocess, sys, tempfile
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from tt_make import lufs, run, speech  # noqa: E402

W, H, FPS = 1080, 1920, 30
INK = (26, 22, 18)
INK2 = (92, 80, 66)
MARK = (255, 210, 63)
PAPER_X, PAPER_Y, PW = 495, 1050, 900   # центр бумаги по x (левее центра — справа кнопки TikTok), верх (низ ≤ 1530: ниже подпись TikTok), ширина
HERO_Y = 200


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


PAPER_MAX = 1530   # низ бумаги: ниже — подпись и кнопки TikTok


def layout(ln, top=58):
    # раскладка реплики на бумаге; длинная реплика — шрифт мельче, чтобы низ бумаги не ушёл под подпись TikTok
    for fs in (74, 66, 60):   # не помещается и так — бумага поднимается выше (наезжает на героя)
        L = layout1(ln, top, fs)
        if PAPER_Y + L['ph'] <= PAPER_MAX:
            break
    return L


def layout1(ln, top, fs):
    # слова (по строкам, по центру), перевод, плашка «что значит»
    fe = font('black', fs)
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
    y = top
    pos = []
    for row in rows:
        tw = sum(fe.getlength(w) for w in row) + sp * (len(row) - 1)
        x = (PW - tw) / 2
        for w in row:
            lw = fe.getlength(w)
            pos.append((w, x, y, lw))
            x += lw + sp
        y += round(fs * 1.22)
    rs = 44 if fs >= 74 else 40
    fr = font('bi', rs)
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
    y = yr + round(rs * 1.27) * len(ru_rows)
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
    return dict(words=pos, ru=ru_rows, yr=yr, yn=yn, note=note, ph=int(y + 46), fs=fs, rs=rs)


def is_kw(w, kws):
    c = ''.join(ch for ch in w.lower() if ch.isalnum())
    return any(c == ''.join(ch for ch in k.lower() if ch.isalnum()) for k in kws)


def paper_frame(L, t, base, pad):
    # бумага реплики в момент t: слова по голосу, маркер, перевод, плашка
    im = base.copy()
    d = ImageDraw.Draw(im, 'RGBA')
    ox, oy = pad, pad
    fs, rs = L['lay']['fs'], L['lay']['rs']
    fe = font('black', fs)
    for j, (w, x, y, lw) in enumerate(L['lay']['words']):
        a, b, key = L['W'][j][1], L['W'][j][2], L['W'][j][3]
        if t < a:
            continue
        if key:
            p = ease((t - a) / .22)
            d.rounded_rectangle([ox + x - 8, oy + y + fs * .08, ox + x - 8 + (lw + 16) * p, oy + y + fs * 1.08], 10, fill=MARK + (235,))
    for j, (w, x, y, lw) in enumerate(L['lay']['words']):
        a = L['W'][j][1]
        if t < a:
            continue
        k = t - a
        if k < .16:
            s = 1.32 - .32 * ease(k / .16)
            f2 = font('black', fs * s)
            ti = text_img(w, f2, INK + (255,))
            cx, cy = ox + x + lw / 2, oy + y + fs * .6
            im.alpha_composite(fade(ti, .4 + .6 * k / .16), (int(cx - ti.width / 2), int(cy - ti.height / 2)))
        else:
            d.text((ox + x, oy + y), w, font=fe, fill=INK + (255,))
    k = t - L['t0']
    if k > -.05:
        al = int(255 * ease((k + .05) / .3))
        fr = font('bi', rs)
        for i, row in enumerate(L['lay']['ru']):
            tw = fr.getlength(row)
            d.text((ox + (PW - tw) / 2, oy + L['lay']['yr'] + i * round(rs * 1.27)), row, font=fr, fill=INK2 + (al,))
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


# ---------- герои: живая петля или арт ----------
class Art:
    # герой без петли: арт дышит и чуть плывёт (пока Андрей не сделал ролик во Flow)
    def __init__(self, path, crop, size):
        x, y, w, h = crop
        self.size = size
        self.big = Image.open(path).convert('RGB').crop((x, y, x + w, y + h)).resize((int(size[0] * 1.08), int(size[1] * 1.08)), Image.LANCZOS)
        self.i = 0

    def next(self):
        t = self.i / FPS
        self.i += 1
        s = 1 - .025 * (1 + math.sin(2 * math.pi * t / 4.6)) / 2
        bw, bh = self.big.size
        cw, ch = bw * s, bh * s
        ox = (bw - cw) / 2 + 6 * math.sin(2 * math.pi * t / 9)
        oy = (bh - ch) / 2 + 5 * math.sin(2 * math.pi * t / 7)
        return self.big.resize(self.size, Image.BILINEAR, box=(ox, oy, ox + cw, oy + ch))


def source(h, box, size, base_dir, mdir, wk, dur):
    if h.get('video'):
        return Frames(media(h['video'], base_dir, mdir, wk), box, size, dur)
    if h.get('art'):
        return Art(media(h['art'], base_dir, mdir, wk), box, size)
    sys.exit('у героя ' + h['name'] + ' нет ни video, ни art')


def norm(spec):
    # старый вид (один герой + partner) → общий: heroes + by/to у каждой реплики
    if 'heroes' not in spec:
        H = {'main': dict(name=spec['hero'], color=spec.get('accent', '#8FCB4F'), video=spec.get('video'), art=spec.get('art'),
                          crop=spec['crop'], bg=spec['bg'])}
        P = spec.get('partner')
        if P:
            H['partner'] = dict(name=P['name'], color=P['color'], video=P.get('video'), art=P.get('art'), face=P['face'])
        for ln in spec['lines']:
            ln.setdefault('by', 'main')
            if ln.get('about') and P:
                ln.setdefault('to', 'partner')
        spec['heroes'] = H
        spec.setdefault('title', spec['hero'])
    else:
        ks = list(spec['heroes'])
        for ln in spec['lines']:
            if 'to' not in ln and len(ks) == 2:
                ln['to'] = ks[1] if ln['by'] == ks[0] else ks[0]
    if spec.get('ult'):
        spec['ult'].setdefault('by', spec['lines'][0]['by'])
    return spec


# ---------- сборка ----------
def build(spec, base_dir, out, mdir, amb):
    spec = norm(spec)
    os.makedirs(out, exist_ok=True)
    wk = tempfile.mkdtemp(prefix='ttl_')
    HS = spec['heroes']
    for h in HS.values():
        h['rgb'] = hexrgb(h.get('color', '#8FCB4F'))
    adir = spec['audio'] if os.path.isabs(spec['audio']) else os.path.join(base_dir, spec['audio'])
    ult = spec.get('ult')
    speakers = []
    for ln in spec['lines']:
        if ln['by'] not in speakers:
            speakers.append(ln['by'])
    dialog = len(speakers) > 1
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
        if 'w' not in ln:   # нет времени слов — по длине слова внутри голоса (хуже; лучше распознать)
            s0, s1, _ = speech(os.path.join(adir, ln['a']))
            wt = [len(''.join(c for c in w if c.isalnum())) + 2 for w in words]
            a, ln['w'] = s0, []
            for x in wt:
                b = a + (s1 - s0) * x / sum(wt)
                ln['w'].append([round(a - s0, 2), round(b - s0, 2)])
                a = b
        if len(words) != len(ln['w']):
            sys.exit('слов %d, а времени %d: %s' % (len(words), len(ln['w']), ln['en']))
        lay = layout(ln, 86 if dialog else 58)
        Wt = [(w, t + a, t + b, is_kw(w, ln.get('kw', []))) for w, (a, b) in zip(words, ln['w'])]
        end = t + ln['w'][-1][1]
        hold = spec.get('hold', 1.25) + .02 * len(ln['ru']) + (.35 if ln.get('note') else 0)
        LS.append(dict(ln=ln, lay=lay, W=Wt, t0=t, end=end, pin=t - .32, note=ln.get('note'),
                       by=ln['by'], to=ln.get('to'), kill=ln.get('kill')))
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
        if dialog:   # ярлык «кто говорит» в углу бумаги
            hh = HS[L['by']]
            tg = text_img(hh['name'].upper(), font('black', 28), (20, 16, 12, 255))
            d = ImageDraw.Draw(L['base'])
            x0, y0 = L['pad'] + 34, L['pad'] + 22
            d.rounded_rectangle([x0, y0, x0 + tg.width + 28, y0 + tg.height + 14], 16, fill=hh['rgb'] + (255,))
            L['base'].alpha_composite(tg, (x0 + 14, y0 + 7))
    ep = paper_base(300, 99)
    # кто на экране: смена говорящего — смена панели
    SW = [(0.0, ult['by'] if ult else LS[0]['by'])]
    for L in LS:
        if L['by'] != SW[-1][1]:
            SW.append((L['pin'], L['by']))
    # иконка: тот, к кому/про кого реплика; появляется с первой реплики подряд про него
    for i, L in enumerate(LS):
        L['ic_t'] = LS[i - 1]['ic_t'] if i and LS[i - 1]['to'] == L['to'] else L['pin']
    DEAD = {L['to']: L['W'][-1][1] for L in LS if L['kill'] and L['to']}
    # --- картинка ---
    MAIN = {}
    for k in speakers + ([ult['by']] if ult else []):
        if k in MAIN:
            continue
        h = HS[k]
        HH = int(round(h['crop'][3] * W / h['crop'][2] / 2)) * 2
        bgi = Image.open(media(h['bg'], base_dir, mdir, wk)).convert('RGB').resize((W, H), Image.LANCZOS)
        bgi = Image.blend(bgi, Image.new('RGB', (W, H), (0, 0, 0)), .28)
        m = np.ones((HH, W), np.float32)
        xr, yr = np.arange(W), np.arange(HH)
        m *= np.clip(np.minimum(xr, W - 1 - xr) / 80, 0, 1)[None, :]
        m *= np.clip(yr / 40, 0, 1)[:, None] * np.clip((HH - 1 - yr) / 260, 0, 1)[:, None]
        MAIN[k] = dict(src=source(h, h['crop'], (W, HH), base_dir, mdir, wk, DUR), HH=HH,
                       bg=bgi.resize((int(W * 1.07), int(H * 1.07)), Image.LANCZOS),
                       mask=Image.fromarray((m ** 1.4 * 255).astype(np.uint8)))
    PS = 210
    ICON = {}
    for L in LS:
        k = L['to']
        if k and k not in ICON and HS[k].get('face'):
            ICON[k] = source(HS[k], HS[k]['face'], (PS, PS), base_dir, mdir, wk, DUR)
    cm = circle_mask(PS)
    NAMEI = {k: text_img(h['name'].upper(), font('black', 50), (255, 255, 255, 255), 5, (0, 0, 0)) for k, h in HS.items()}
    LBL = {k: text_img(h['name'], font('bold', 30), (255, 255, 255, 255), 4, (0, 0, 0)) for k, h in HS.items()}
    sub = spec.get('about')
    first_to = next((L['pin'] for L in LS if L['to']), None)
    sub_t = .9 if dialog else first_to
    st = stsub = None
    if ult:
        st = text_img(ult['stamp'], font('bki', 190), HS[ult['by']]['rgb'] + (255,), 12, (12, 10, 8)).rotate(8, resample=Image.BICUBIC, expand=True)
        if ult.get('sub'):
            stsub = text_img(ult['sub'], font('bi', 48), (255, 255, 255, 255), 5, (0, 0, 0))
    kill_ts = sorted(DEAD.values())
    enc = subprocess.Popen(['ffmpeg', '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS),
                            '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-profile:v', 'high',
                            '-pix_fmt', 'yuv420p', os.path.join(wk, 'v.mp4')], stdin=subprocess.PIPE)
    N = int(DUR * FPS)
    cover = None
    for fi in range(N):
        t = fi / FPS
        hf = {k: M['src'].next() for k, M in MAIN.items()}
        icf = {k: s.next() for k, s in ICON.items()}
        sx = sy = 0.0
        for t0, a in [(HIT if ult else -9, 22)] + [(x, 12) for x in kill_ts]:
            k = t - t0
            if 0 <= k < .6:
                sx += a * math.sin(k * 75) * math.exp(-k * 6)
                sy += a * .6 * math.cos(k * 61) * math.exp(-k * 6)

        def panel(k):
            M = MAIN[k]
            ox = (M['bg'].width - W) / 2 + 22 * math.sin(2 * math.pi * t / 14)
            oy = (M['bg'].height - H) / 2 + 26 * math.sin(2 * math.pi * t / 17)
            fr = M['bg'].crop((int(ox), int(oy), int(ox) + W, int(oy) + H)).convert('RGBA')
            f = hf[k]
            s = 1.0
            if ult and k == ult['by']:
                s = 1 + .16 * math.exp(-(t - HIT) * 6) if t >= HIT else 1.16
            if s > 1.002:
                hw, hh = int(W * s), int(M['HH'] * s)
                f = f.resize((hw, hh), Image.BILINEAR).crop(((hw - W) // 2, (hh - M['HH']) // 2, (hw - W) // 2 + W, (hh - M['HH']) // 2 + M['HH']))
            fr.paste(f, (int(sx), int(HERO_Y + sy)), M['mask'])
            return fr
        si = max(i for i, (t0, _) in enumerate(SW) if t >= t0)
        spk = SW[si][1]
        q = (t - SW[si][0]) / .34 if si else 1
        fr = panel(spk)
        if q < 1:   # новая панель заезжает косым срезом поверх старой, по срезу — полоса цвета говорящего
            old = panel(SW[si - 1][1])
            e = ease(q)
            xb = W + 300 - (W + 600) * e
            msk = Image.new('L', (W, H), 0)
            ImageDraw.Draw(msk).polygon([(xb + 260, 0), (W + 400, 0), (W + 400, H), (xb - 260, H)], fill=255)
            fr = Image.composite(fr, old, msk)
            ImageDraw.Draw(fr).line([(xb + 260, 0), (xb - 260, H)], fill=HS[spk]['rgb'] + (255,), width=14)
        # ульта: экран в цвет героя, ударная волна, вспышка, печать
        if ult and t < 2.6:
            acc = HS[ult['by']]['rgb']
            if t < .9:
                g = .5 * (1 - ease((t - .1) / .8)) if t > .1 else .5
                fr = Image.blend(fr, Image.new('RGBA', (W, H), acc + (255,)), g * .42)
            k = t - HIT
            if 0 <= k < .55:
                ov = Image.new('RGBA', (W, H), (0, 0, 0, 0))
                rr = 80 + 900 * ease(k / .55)
                cx, cy = W / 2, HERO_Y + MAIN[ult['by']]['HH'] * .42
                ImageDraw.Draw(ov).ellipse([cx - rr, cy - rr, cx + rr, cy + rr], outline=acc + (int(230 * (1 - k / .55)),),
                                           width=int(26 * (1 - k / .55)) + 2)
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
        # шапка: кто говорит (меняется вместе с панелью) и о чём
        if t > .9:
            a = ease((t - .9) / .35)
            if q < 1:
                fr.alpha_composite(fade(NAMEI[SW[si - 1][1]], 1 - ease(q * 1.6)), (56, 170))
                fr.alpha_composite(fade(NAMEI[spk], ease(q)), (int(56 + 50 * (1 - ease(q))), 170))
            else:
                fr.alpha_composite(fade(NAMEI[spk], a), (int(56 - 40 * (1 - a)), 170))
            if sub and sub_t is not None and t > sub_t:
                a2 = ease((t - sub_t) / .35)
                si_ = text_img(sub, font('bi', 40), HS[spk]['rgb'] + (255,), 4, (0, 0, 0))
                fr.alpha_composite(fade(si_, a2), (int(58 - 40 * (1 - a2)), 170 + NAMEI[spk].height + 6))
        # живая иконка того, к кому / про кого реплика
        ci = None
        for i, L in enumerate(LS):
            if t >= L['pin']:
                ci = i
        if ci is not None and t < ENDT + .3 and LS[ci]['to'] in ICON:
            L = LS[ci]
            k_ = L['to']
            p = back((t - L['ic_t']) / .35)
            ic = icf[k_].convert('RGBA')
            ring = HS[k_]['rgb']
            dt = DEAD.get(k_)
            dead = dt is not None and t > dt
            if dead:
                k = t - dt
                ic = Image.blend(ic, ic.convert('L').convert('RGBA'), min(1, k / .35))
                ic = Image.blend(ic, Image.new('RGBA', (PS, PS), (200, 30, 30, 255)), .45 * math.exp(-k / .25))
                ring = (220, 50, 50)
            ic.putalpha(cm)
            n = PS + 16
            bub = Image.new('RGBA', (n, n), (0, 0, 0, 0))
            ImageDraw.Draw(bub).ellipse([0, 0, n - 1, n - 1], fill=ring + (255,))
            bub.alpha_composite(ic, (8, 8))
            if dead:
                Lx = 70 * ease((t - dt) / .2)
                bd = ImageDraw.Draw(bub)
                c = n / 2
                bd.line([c - Lx, c - Lx, c + Lx, c + Lx], fill=(230, 40, 40, 255), width=16)
                bd.line([c + Lx, c - Lx, c - Lx, c + Lx], fill=(230, 40, 40, 255), width=16)
            sc = max(.05, p)
            if abs(sc - 1) > .002:
                bub = bub.resize((max(1, int(n * sc)), max(1, int(n * sc))), Image.BICUBIC)
            jx = 14 * math.sin((t - dt) * 70) * math.exp(-(t - dt) * 7) if dt is not None and 0 <= t - dt < .5 else 0
            cx, cy = 912, 312
            fr.alpha_composite(bub, (int(cx - bub.width / 2 + jx), int(cy - bub.height / 2)))
            if p > .6:
                fr.alpha_composite(fade(LBL[k_], min(1, (p - .6) / .4)), (int(cx - LBL[k_].width / 2), int(cy + n / 2 + 4)))
        # бумага: текущая въезжает снизу, прошлая улетает влево
        papers = []
        if t >= ENDT:
            if LS:
                papers.append((len(LS) - 1, None))
            papers.append(('end', ENDT))
        elif ci is not None:
            if ci > 0:
                papers.append((ci - 1, None))
            papers.append((ci, LS[ci]['pin']))
        for idx, pin in papers:
            if idx == 'end':
                im = end_paper(E, t, ep[0], ep[1], ENDT + .2)
                ang, tin, outk, pad, py = -.8, ENDT, None, ep[1], PAPER_Y
            else:
                L = LS[idx]
                im = paper_frame(L, t, L['base'], L['pad'])
                ang, tin, pad = L['ang'], L['pin'], L['pad']
                py = min(PAPER_Y, PAPER_MAX - L['lay']['ph'])
                nxt = LS[idx + 1]['pin'] if idx + 1 < len(LS) else ENDT
                outk = t - nxt
            dx = dy = 0.0
            ra = ang
            k = t - tin
            if k < .32:
                qq = ease(k / .32)
                dy = (1 - qq) * 520
                ra = ang + (1 - qq) * 7
            if outk is not None and outk >= 0:
                if outk > .3:
                    continue
                qq = ease(outk / .3)
                dx, dy, ra = -qq * 1100, -qq * 60, ang - qq * 14
            rim = im.rotate(ra, resample=Image.BICUBIC, expand=True)
            x = PAPER_X - rim.width / 2 + dx + sx * .4
            y = py - (rim.height - im.height) / 2 - pad + dy
            fr.alpha_composite(rim, (int(x), int(y)))
        rgb = fr.convert('RGB')
        enc.stdin.write(rgb.tobytes())
        if cover is None and len(LS) > 1 and t >= LS[1]['end'] + .2:
            cover = rgb
    enc.stdin.close()
    enc.wait()
    for s in [M['src'] for M in MAIN.values()] + list(ICON.values()):
        if isinstance(s, Frames):
            s.p.kill()
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
