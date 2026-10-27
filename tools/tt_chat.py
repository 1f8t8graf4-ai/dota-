# Ролик для TikTok «переписка героев» (27.10, ночь). Андрей про ролик Дормен ↔ Грей Талон в формате «рваной бумаги»:
# «по-другому сделай, как-то не нравится; и это же не ульта его — диалог обычный»; при этом «голос Дормена в TikTok был супер».
# Поэтому тут без ульты и без бумаги — как переписка в мессенджере:
#   - 0–1,6 с — крючок: оба героя въезжают с краёв, по центру крупно «о чём» (поле hook или about);
#   - дальше сверху шапка чата: два героя в кружках, говорящий светится своим цветом;
#   - реплики — пузыри: первый говорящий слева, второй справа. Вся фраза видна сразу, слова загораются по голосу
#     (текущее — жёлтым), ключевые слова подчёркнуты цветом героя, перевод — сразу, как пошёл голос;
#     после реплики под пузырём — плашка «что значит». Старые пузыри уезжают вверх, как в чате;
#   - в конце — @languagegamesbot.
# Голос — как в прошлом ролике Дормена (ему зашёл): сухой, капля эха места, фон места на 28 дБ тише голоса, проседает под голос.
#   python3 tools/tt_chat.py tools/tt/<ролик>.json [--out <папка>] [--media <папка>] [--amb <папка из amb_make.py>]
# Тот же json, что у tt_lines.py (heroes: name, color, art|video, crop, face, bg; lines: by, a, en, ru, kw, note; end). Ульту (ult) не берёт.
import argparse, json, math, os, shutil, subprocess, sys, tempfile
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from tt_make import lufs, run, speech  # noqa: E402
from tt_lines import (W, H, FPS, MARK, font, text_img, fade, ease, back, hexrgb, media, Frames, circle_mask, source, norm)  # noqa: E402

BG = (14, 15, 19)
X0, X1 = 64, 900          # пузыри — только здесь: справа кнопки TikTok
TOP, BOT = 470, 1480      # область чата: ниже — подпись TikTok; новые пузыри — снизу, как в мессенджере
AV = 168                  # кружок героя в шапке
EN_F, RU_F, NM_F = 60, 40, 30
BW = 820                  # ширина пузыря (макс.)


def wrap(words, f, maxw):
    sp = f.getlength(' ')
    lines, cur, w = [], [], 0
    for i, wd in enumerate(words):
        lw = f.getlength(wd)
        if cur and w + sp + lw > maxw:
            lines.append(cur)
            cur, w = [], 0
        cur.append(i)
        w += (sp if len(cur) > 1 else 0) + lw
    if cur:
        lines.append(cur)
    return lines


def wrap_text(s, f, maxw):
    ws = s.split()
    return [' '.join(ws[i] for i in ln) for ln in wrap(ws, f, maxw)]


def is_kw(w, kws):
    n = ''.join(c for c in w.lower() if c.isalnum() or c == "'")
    return any(n == ''.join(c for c in k.lower() if c.isalnum() or c == "'") for k in kws)


class Bubble:
    # пузырь реплики: размеры считаются один раз, слова рисуются каждый кадр (загораются по голосу)
    def __init__(self, L, hero, side):
        self.L, self.h, self.side = L, hero, side
        self.fe, self.fr, self.fn = font('black', EN_F), font('bi', RU_F), font('black', NM_F)
        words = L['words']
        self.lines = wrap(words, self.fe, BW - 64)
        self.ru = wrap_text(L['ru'], self.fr, BW - 64)
        lh, rh = int(EN_F * 1.22), int(RU_F * 1.3)
        wmax = max(sum(self.fe.getlength(words[i]) for i in ln) + self.fe.getlength(' ') * (len(ln) - 1) for ln in self.lines)
        wmax = max(wmax, max(self.fr.getlength(s) for s in self.ru), self.fn.getlength(hero['name'].upper()) + 10)
        self.w = int(min(BW, wmax + 64))
        self.h_en = len(self.lines) * lh
        self.hh = 30 + NM_F + 12 + self.h_en + 14 + len(self.ru) * rh + 26
        self.lh, self.rh = lh, rh
        self.note = None
        if L.get('note'):
            f = font('bold', 30)
            self.note = (L['note'], f, int(f.getlength(L['note'])) + 40)
        self.total = self.hh + (66 if self.note else 0)
        self.iw = max(self.w, self.note[2] if self.note else 0)

    def draw(self, t):
        L, h = self.L, self.h
        im = Image.new('RGBA', (self.iw + 20, self.total + 20), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        col = h['rgb']
        ox = 0 if self.side == 0 else self.iw - self.w
        # тело пузыря: тёмное, с полосой цвета героя у края говорящего
        d.rounded_rectangle([10 + ox, 10, 10 + ox + self.w, 10 + self.hh], 38, fill=(22, 24, 30, 232))
        if self.side == 0:
            d.rounded_rectangle([10, 10, 24, 10 + self.hh], 7, fill=col + (255,))
        else:
            d.rounded_rectangle([ox + self.w - 4, 10, ox + self.w + 10, 10 + self.hh], 7, fill=col + (255,))
        x, y = 46 + ox, 36
        d.text((x, y), h['name'].upper(), font=self.fn, fill=col + (255,))
        y += NM_F + 12
        words = L['words']
        sp = self.fe.getlength(' ')
        for ln in self.lines:
            xx = x
            for i in ln:
                w, a, b, kw = L['W'][i]
                lw = self.fe.getlength(w)
                if t >= b:
                    c = (255, 255, 255, 255)
                elif t >= a - .03:
                    c = MARK + (255,)
                else:
                    c = (255, 255, 255, 105)
                d.text((xx, y), w, font=self.fe, fill=c)
                if kw:
                    d.rounded_rectangle([xx, y + EN_F + 4, xx + lw, y + EN_F + 10], 3, fill=col + (230 if t >= a else 120,))
                xx += lw + sp
            y += self.lh
        y += 14
        ra = max(0, min(1, (t - L['t0'] + .1) / .35))
        for s in self.ru:
            d.text((x, y), s, font=self.fr, fill=(214, 206, 192, int(235 * ra)))
            y += self.rh
        if self.note and t >= L['end'] + .15:
            k = ease((t - L['end'] - .15) / .3)
            s, f, nw = self.note
            nx = 10 if self.side == 0 else 10 + self.iw - nw
            ny = 10 + self.hh + 14 + (1 - k) * 12
            d.rounded_rectangle([nx, ny, nx + nw, ny + 50], 25, fill=MARK + (int(255 * k),))
            d.text((nx + 20, ny + 9), s, font=f, fill=(22, 18, 10, int(255 * k)))
        return im


def build(spec, base_dir, out, mdir, amb):
    spec = norm(spec)
    os.makedirs(out, exist_ok=True)
    wk = tempfile.mkdtemp(prefix='ttc_')
    HS = spec['heroes']
    for hh in HS.values():
        hh['rgb'] = hexrgb(hh.get('color', '#8FCB4F'))
    adir = spec['audio'] if os.path.isabs(spec['audio']) else os.path.join(base_dir, spec['audio'])
    order = []
    for ln in spec['lines']:
        if ln['by'] not in order:
            order.append(ln['by'])
    for k in HS:
        if k not in order:
            order.append(k)
    SIDE = {order[0]: 0, order[1] if len(order) > 1 else order[0]: 1}
    # --- время: крючок, потом реплики подряд ---
    HOOK = 1.6
    t = HOOK + .35
    VO, SX, LS = [], [], []
    pop = os.path.join(HERE, '..', 'snd', 'kino', 'tap.mp3')
    for ln in spec['lines']:
        words = ln['en'].replace("'", '’').split()
        if 'w' not in ln:   # нет времени слов — по длине слова внутри голоса
            s0, s1, _ = speech(os.path.join(adir, ln['a']))
            wt = [len(''.join(c for c in w if c.isalnum())) + 2 for w in words]
            a, ln['w'] = s0, []
            for x in wt:
                b = a + (s1 - s0) * x / sum(wt)
                ln['w'].append([round(a, 2), round(b, 2)])
                a = b
        L = dict(by=ln['by'], ru=ln['ru'], note=ln.get('note'), words=words, t0=t, pin=t - .3)
        L['W'] = [(w, t + a, t + b, is_kw(w, ln.get('kw', []))) for w, (a, b) in zip(words, ln['w'])]
        L['end'] = t + ln['w'][-1][1]
        LS.append(L)
        VO.append((os.path.join(adir, ln['a']), t))
        SX.append((pop, t - .3, -14))
        t = L['end'] + 1.0 + .018 * len(ln['ru']) + (.4 if ln.get('note') else 0)
    ENDT = t
    DUR = ENDT + 2.6
    for L in LS:
        L['B'] = Bubble(L, HS[L['by']], SIDE.get(L['by'], 0))
    # --- картинка: фон — места обоих героев, слева и справа, мягко; шапка — кружки ---
    def bgimg(k):
        im = Image.open(media(HS[k]['bg'], base_dir, mdir, wk)).convert('RGB')
        s = max(W / im.width, H / im.height)
        im = im.resize((int(im.width * s) + 1, int(im.height * s) + 1), Image.LANCZOS)
        return im.crop(((im.width - W) // 2, (im.height - H) // 2, (im.width - W) // 2 + W, (im.height - H) // 2 + H))
    b0, b1 = bgimg(order[0]), bgimg(order[1] if len(order) > 1 else order[0])
    gm = Image.fromarray((np.clip((np.arange(W) - W * .3) / (W * .4), 0, 1)[None, :].repeat(H, 0) * 255).astype(np.uint8))
    bgc = Image.composite(b1, b0, gm).filter(ImageFilter.GaussianBlur(18))
    bgc = Image.blend(bgc, Image.new('RGB', (W, H), BG), .62)
    vg = Image.new('L', (W, H), 0)
    ImageDraw.Draw(vg).rectangle([0, 0, W, H], fill=0)
    yy = np.linspace(0, 1, H)[:, None].repeat(W, 1)
    shade = Image.fromarray((np.clip(.25 + .55 * np.abs(yy - .45) * 1.6, 0, .85) * 255).astype(np.uint8))
    bgc = Image.composite(Image.new('RGB', (W, H), (8, 9, 12)), bgc, shade)
    BGI = bgc.resize((int(W * 1.06), int(H * 1.06)), Image.LANCZOS)
    def artbg(k):
        h = HS[k]
        im = Image.open(media(h['art'], base_dir, mdir, wk)).convert('RGB') if h.get('art') else bgimg(k)
        s = max(W * 1.08 / im.width, H * 1.08 / im.height)
        im = im.resize((int(im.width * s) + 1, int(im.height * s) + 1), Image.LANCZOS)
        fx = h.get('face', [im.width / 2 / s, 0, 0, 0])
        cx = min(max(int((fx[0] + fx[2] / 2) * s - W * 1.08 / 2), 0), im.width - int(W * 1.08))
        im = im.crop((cx, 0, cx + int(W * 1.08), int(H * 1.08))).filter(ImageFilter.GaussianBlur(3))
        return Image.blend(im, Image.new('RGB', im.size, BG), .6)
    ABG = {k: artbg(k) for k in order[:2]}
    SPK = [(0.0, LS[0]['by'])]
    for L in LS:
        if L['by'] != SPK[-1][1]:
            SPK.append((L['pin'], L['by']))
    FACE = {k: source(HS[k], HS[k]['face'], (AV, AV), base_dir, mdir, wk, DUR) for k in order[:2]}
    cm = circle_mask(AV)
    NAME = {k: text_img(HS[k]['name'], font('black', 34), (255, 255, 255, 255)) for k in order[:2]}
    hook = spec.get('hook') or spec.get('about', '')
    HK = [text_img(s, font('black', 78), (255, 255, 255, 255), 6, (0, 0, 0)) for s in wrap_text(hook, font('black', 78), 860)]
    sub = text_img(hook, font('bold', 30), (220, 212, 198, 255))
    E = spec.get('end', {})
    END = [text_img(E.get('top', 'Настоящий диалог из игры — с переводом'), font('bold', 36), (220, 212, 198, 255)),
           text_img(E.get('big', '@languagegamesbot'), font('black', 82), MARK + (255,)),
           text_img(E.get('sub', 'учи английский по играм и кино'), font('bold', 34), (200, 192, 178, 255))]
    AVX = {order[0]: 300, (order[1] if len(order) > 1 else order[0]): 780}
    # говорит ли герой сейчас (для свечения кружка)
    def speaking(k, t):
        for L in LS:
            if L['by'] == k and L['t0'] - .05 <= t <= L['end'] + .1:
                return 1 - abs(math.sin(t * 9.5)) * .35
        return 0
    enc = subprocess.Popen(['ffmpeg', '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                            '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', os.path.join(wk, 'v.mp4')], stdin=subprocess.PIPE)
    cover, scroll = None, 0.0
    N = int(DUR * FPS)
    for fi in range(N):
        t = fi / FPS
        # фон медленно плывёт
        ox = 32 + 20 * math.sin(t / 5.2)
        oy = 40 + 26 * math.sin(t / 7.1)
        cur = [k for ts, k in SPK if ts <= t][-1] if t >= HOOK else None
        if cur is None:
            fr = BGI.crop((int(ox), int(oy), int(ox) + W, int(oy) + H))
        else:
            i = max(j for j, (ts, k) in enumerate(SPK) if ts <= t)
            a = ABG[cur].crop((int(ox), int(oy), int(ox) + W, int(oy) + H))
            kf = (t - SPK[i][0]) / .5 if i else (t - HOOK) / .5
            if kf < 1:
                prev = BGI if i == 0 else ABG[SPK[i - 1][1]]
                a = Image.blend(prev.crop((int(ox), int(oy), int(ox) + W, int(oy) + H)), a, ease(kf))
            fr = a
        fr = fr.convert('RGBA')
        d = ImageDraw.Draw(fr)
        faces = {k: FACE[k].next() for k in FACE}
        # --- шапка / крючок ---
        hk = ease(min(1, max(0, (t - HOOK + .25) / .45)))   # 0 — крючок, 1 — шапка
        for k in order[:2]:
            side = 0 if AVX[k] < W / 2 else 1
            enter = back(min(1, t / .55))
            big = AV * (1.25 - .25 * hk)
            cx = AVX[k] + (1 - enter) * (-420 if side == 0 else 420)
            cy = 760 - (760 - 250) * hk
            sp = speaking(k, t) if hk >= 1 else 0
            if sp:
                rr = big / 2 + 14 + 6 * sp
                glow = Image.new('RGBA', (int(rr * 2 + 40), int(rr * 2 + 40)), (0, 0, 0, 0))
                ImageDraw.Draw(glow).ellipse([20, 20, 20 + rr * 2, 20 + rr * 2], fill=HS[k]['rgb'] + (int(150 * sp),))
                glow = glow.filter(ImageFilter.GaussianBlur(14))
                fr.alpha_composite(glow, (int(cx - rr - 20), int(cy - rr - 20)))
            ring = int(big) + 14
            d.ellipse([cx - ring / 2, cy - ring / 2, cx + ring / 2, cy + ring / 2], fill=HS[k]['rgb'] + (255,))
            fa = faces[k].resize((int(big), int(big)), Image.BILINEAR)
            fr.paste(fa, (int(cx - big / 2), int(cy - big / 2)), cm.resize((int(big), int(big))))
            nm = NAME[k]
            fr.alpha_composite(fade(nm, .55 + .45 * (1 if sp or hk < 1 else .6)), (int(cx - nm.width / 2), int(cy + big / 2 + 14)))
        if hk < 1:   # крючок крупно по центру
            a = min(1, t / .3) * (1 - hk)
            yh = 1060 - sum(i.height for i in HK) / 2
            for im in HK:
                fr.alpha_composite(fade(im, a), (int(W / 2 - im.width / 2), int(yh)))
                yh += im.height + 10
        else:
            fr.alpha_composite(fade(sub, .85), (int(W / 2 - sub.width / 2), 400))
            d.line([(X0, 452), (X1 + 40, 452)], fill=(255, 255, 255, 30), width=2)
        # --- пузыри ---
        vis = [L for L in LS if t >= L['pin']]
        if vis and t < ENDT + .2:
            ys, y = [], 0
            for L in vis:
                ys.append(y)
                y += L['B'].total + 22
            scroll += (y - scroll) * .2 if scroll else y
            for L, y0 in zip(vis, ys):
                B = L['B']
                yy0 = BOT - scroll + y0
                if yy0 + B.total < TOP - 120:
                    continue
                im = B.draw(t)
                k = (t - L['pin']) / .4
                if k < 1:
                    s = .78 + .22 * back(k)
                    im2 = im.resize((max(1, int(im.width * s)), max(1, int(im.height * s))), Image.BILINEAR)
                    im2 = fade(im2, min(1, k * 2.2))
                else:
                    im2, s = im, 1
                # тает у верхнего края чата
                top_a = min(1, max(0, (yy0 - (TOP - 60)) / 160))
                if top_a < 1:
                    im2 = fade(im2, top_a)
                x = X0 - 10 if B.side == 0 else X1 - B.iw - 10
                if s != 1:
                    x += (im.width - im2.width) * (0 if B.side == 0 else 1)
                fr.alpha_composite(im2, (int(x), int(yy0 - 10)))
        # --- конец ---
        if t >= ENDT:
            k = ease((t - ENDT) / .5)
            dk = Image.new('RGBA', (W, H), (8, 9, 12, int(200 * k)))
            fr.alpha_composite(dk)
            yh = 860
            for i, im in enumerate(END):
                kk = ease((t - ENDT - .15 * i) / .45)
                fr.alpha_composite(fade(im, kk), (int(W / 2 - im.width / 2), int(yh + (1 - kk) * 30)))
                yh += im.height + 26
        rgb = fr.convert('RGB')
        enc.stdin.write(rgb.tobytes())
        if cover is None and len(LS) > 1 and t >= LS[1]['end'] + .3:
            cover = rgb
    enc.stdin.close()
    enc.wait()
    for s in FACE.values():
        if isinstance(s, Frames):
            s.p.kill()
    # --- звук: голос + капля эха места, фон места под голос, «тык» на каждый пузырь ---
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
    gb = (Lv - 28) - lufs(bed)
    mix = (f"[0:a]asplit=2[vd][vr];[1:a]aformat=channel_layouts=stereo[irs];[vr][irs]afir=gtype=gn,volume=0.12,lowpass=f=5200[vrv];"
           f"[vd][vrv]amix=inputs=2:normalize=0[voc];[voc]asplit=2[voc1][sc];"
           f"[2:a]volume={gb:.2f}dB,aformat=channel_layouts=stereo,atrim=0:{DUR:.2f},afade=t=in:d=0.8,afade=t=out:st={DUR - .9:.2f}:d=0.9[bd];"
           f"[bd][sc]sidechaincompress=threshold=0.02:ratio=5:attack=20:release=500[bdd];"
           f"[voc1][bdd][3:a]amix=inputs=3:normalize=0,atrim=0:{DUR:.2f}[o]")
    run(['ffmpeg', '-y', '-v', 'error', '-i', 'vo.wav', '-i', ir, '-stream_loop', '-1', '-i', bed, '-i', 'sx.wav',
         '-filter_complex', mix, '-map', '[o]', '-c:a', 'pcm_s16le', 'mix.wav'], cwd=wk)
    g = -14 - lufs(os.path.join(wk, 'mix.wav'))
    dst = os.path.join(os.path.abspath(out), spec['id'] + '-chat.mp4')
    run(['ffmpeg', '-y', '-v', 'error', '-i', 'v.mp4', '-i', 'mix.wav', '-filter_complex',
         f'[1:a]volume={g:.2f}dB,alimiter=limit=0.89:level=disabled[a]', '-map', '0:v', '-map', '[a]',
         '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', dst], cwd=wk)
    if cover is not None:
        cover.save(os.path.join(os.path.abspath(out), spec['id'] + '-chat.jpg'), quality=90)
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
