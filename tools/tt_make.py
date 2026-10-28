# Ролик для TikTok из реплик героя (26.10, Андрей: «как улучшить те видео в тиктоке, чтобы набиралась популярность»).
# Карточка героя (его живой ролик) в рамке на фоне того же ролика, размытого; звук абилки и вспышка на ульту;
# слова — крупно по одному в такт голосу; после реплики — вся фраза и перевод или пауза «угадай» и ответ.
# Два звука: сухо (как сейчас — один голос) и с фоном (эхо места на голосе, фон места еле слышно, под голос проседает, звук абилки).
#   python3 tools/tt_make.py tools/tt/<герой>.json [--out <папка>] [--amb <папка из amb_make.py>] [--font <файл.ttf>] [--bed-db -24]
# Выход: <out>/<id>-dry.mp4, <out>/<id>-wet.mp4 (1080×1920, 30 к/с, звук −14 LUFS — как любит TikTok).
# Фон и абилку собирает tools/amb_make.py (если --amb нет — запустит сам во временную папку).
import argparse, json, os, re, shutil, subprocess, sys, tempfile, wave
import numpy as np

W, H, FPS = 1080, 1920, 30
HERE = os.path.dirname(os.path.abspath(__file__))


def run(a, **k):
    r = subprocess.run(a, capture_output=True, text=True, encoding='utf8', errors='replace', **k)
    if r.returncode:
        sys.exit('ffmpeg упал:\n' + ' '.join(a)[:600] + '\n' + r.stderr[-2500:])
    return r


def lufs(p):
    r = run(['ffmpeg', '-hide_banner', '-nostats', '-i', p, '-af', 'ebur128', '-f', 'null', '-'])
    m = re.findall(r'I:\s+(-?[\d.]+) LUFS', r.stderr)
    return float(m[-1])


def speech(p):
    # где в файле реплики начинается и кончается голос (с): по огибающей громкости
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True)
    x = np.frombuffer(r.stdout, '<i2').astype(float) / 32768
    k = 160
    e = np.sqrt(np.convolve(x ** 2, np.ones(k) / k, 'same'))
    on = np.where(e > max(e.max() * .08, 1e-3))[0]
    return (on[0] / 16000, on[-1] / 16000, len(x) / 16000) if len(on) else (0, len(x) / 16000, len(x) / 16000)


def probe(p):
    r = run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', p])
    w, h = r.stdout.strip().split(',')[:2]
    return int(w), int(h)


def col(h, a=0):
    # #RRGGBB → ASS &HAABBGGRR
    h = h.lstrip('#')
    return '&H%02X%s%s%s' % (a, h[4:6], h[2:4], h[0:2])


def tm(s):
    s = max(0, s)
    return '%d:%02d:%05.2f' % (s // 3600, s % 3600 // 60, s % 60)


def font_files(arg):
    if arg:
        return [arg], os.path.splitext(os.path.basename(arg))[0]
    win = os.path.join(os.environ.get('WINDIR', r'C:\Windows'), 'Fonts')
    L = [os.path.join(win, f) for f in ('seguibl.ttf', 'seguibli.ttf', 'segoeuib.ttf', 'segoeuii.ttf')]
    if all(os.path.exists(f) for f in L[:2]):
        return L, 'Segoe UI Black'
    sys.exit('нет шрифта: передай --font <жирный .ttf с кириллицей> (например, Montserrat ExtraBold)')


def build(spec, out, amb, font, bed_db):
    os.makedirs(out, exist_ok=True)
    wk = tempfile.mkdtemp(prefix='tt_')
    fonts, fam = font_files(font)
    os.makedirs(os.path.join(wk, 'fonts'))
    for f in fonts:
        if os.path.exists(f):
            shutil.copy(f, os.path.join(wk, 'fonts'))
    vid = spec['video']
    if vid.startswith('http'):
        import urllib.request
        q = urllib.request.Request(vid, headers={'User-Agent': 'Mozilla/5.0'})  # без UA Cloudflare отвечает 403
        open(os.path.join(wk, 'src.mp4'), 'wb').write(urllib.request.urlopen(q).read())
        vid = os.path.join(wk, 'src.mp4')
    adir = spec['audio']
    ac = spec.get('accent', '#F2C14E')
    # --- раскладка по времени ---
    t = 0.0
    EV, VO, AB = [], [], []
    hd = spec['ru'].upper()
    for ln in spec['lines']:
        ln['en'] = ln['en'].replace("'", '’')  # типографский апостроф: прямой в курсиве даёт дырку («Who 's»)
    for i, ln in enumerate(spec['lines']):
        p = os.path.join(adir, ln['a'])
        s0, s1, dur = speech(p)
        if ln.get('abil'):
            AB.append(t + .05)
            t += .55
            EV.append(('flash', t - .2))
        VO.append((p, t))
        v0, v1 = t + s0, t + s1
        # слова по одному: время — по длине слова (голос внутри файла — от s0 до s1)
        ws = ln['en'].split()
        wt = [len(re.sub(r'[^\w]', '', w)) + 2 for w in ws]
        a = v0
        for j, w in enumerate(ws):
            b = a + (v1 - v0) * wt[j] / sum(wt)
            key = any(k.lower() in w.lower() for k in ln.get('kw', []))
            EV.append(('word', a, b if j < len(ws) - 1 else v1 + .25, w, key))
            a = b
        e = v1 + .3
        if ln.get('q'):
            EV.append(('quiz', e, e + 2.2, ln['q']))
            EV.append(('ans', e + 2.2, e + 4.4, ln['qa'], ln.get('qn', ''), ln['en'], ln['ru']))
            t = e + 4.6
        else:
            EV.append(('line', e, e + 1.9, ln['en'], ln['ru'], ln.get('tag', '')))
            t = e + 2.0
    EV.append(('end', t, t + 2.2, spec.get('end', '')))
    DUR = t + 2.2
    # --- текст (ASS): шапка, слова, фраза с переводом, вопрос с полоской, ответ, конец ---
    ass = [f'''[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Hd,{fam},44,{col(ac)},&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,8,0,1,0,0,8,40,40,176,1
Style: Wd,{fam},150,&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,0,1,0,0,100,100,0,0,1,9,4,5,110,110,0,1
Style: En,{fam},66,&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,0,0,0,0,100,100,0,0,1,6,3,5,120,120,0,1
Style: Ru,{fam},50,&H00C9E4F3,&H00FFFFFF,&H00000000,&H64000000,0,1,0,0,100,100,0,0,1,4,2,5,120,120,0,1
Style: Q,{fam},76,{col('#FFD23F')},&H00FFFFFF,&H00000000,&H64000000,0,0,0,0,100,100,0,0,1,7,3,5,110,110,0,1
Style: A,{fam},84,{col('#7CF0A6')},&H00FFFFFF,&H00000000,&H64000000,0,0,0,0,100,100,0,0,1,7,3,5,110,110,0,1
Style: Sm,{fam},40,&H00D8D8D8,&H00FFFFFF,&H00000000,&H64000000,0,0,0,0,100,100,1,0,1,3,2,5,120,120,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text''']
    D = lambda a, b, st, tx, ly=1: ass.append(f'Dialogue: {ly},{tm(a)},{tm(b)},{st},,0,0,0,,{tx}')
    D(0, DUR, 'Hd', hd + r'\N{\fs30\c&HCFCFCF&\fsp4}ЧТО ОН ГОВОРИТ · ЧАСТЬ 1')
    FL = []
    for e in EV:
        k = e[0]
        if k == 'flash':
            FL.append(e[1])
        elif k == 'word':
            _, a, b, w, key = e
            c = col('#FFD23F') if key else '&H00FFFFFF'
            D(a, b, 'Wd', r'{\pos(540,1470)\c' + c + r'\fscx62\fscy62\t(0,90,\fscx110\fscy110)\t(90,170,\fscx100\fscy100)\frz-3}' + w)
        elif k == 'line':
            _, a, b, en, ru, tag = e
            D(a, b, 'En', r'{\pos(540,1410)\fad(120,160)}' + en)
            D(a + .25, b, 'Ru', r'{\pos(540,1525)\fad(160,160)}' + ru)
            if tag:
                D(a, b, 'Sm', r'{\pos(540,1335)\c' + col(ac) + r'\fad(120,160)}' + tag.upper())
        elif k == 'quiz':
            _, a, b, q = e
            ms = int((b - a) * 1000)
            D(a, b, 'Q', r'{\pos(540,1420)\fad(100,80)\fscx80\fscy80\t(0,140,\fscx100\fscy100)}' + q)
            D(a, b, 'Sm', r'{\pos(540,1335)\fad(100,80)}ЗНАЕШЬ? ПИШИ В КОММЕНТЫ')
            # полоска-таймер: тает слева направо
            D(a, b, 'Sm', r'{\an4\pos(240,1525)\bord0\shad0\c&H30FFFFFF&\p1}m 0 0 l 600 0 600 14 0 14{\p0}', 2)
            D(a, b, 'Sm', r'{\an4\pos(240,1525)\bord0\shad0\c' + col('#FFD23F') + r'\p1\t(0,' + str(ms) + r',\fscx0)}m 0 0 l 600 0 600 14 0 14{\p0}', 3)
        elif k == 'ans':
            _, a, b, qa, qn, en, ru = e
            D(a, b, 'A', r'{\pos(540,1400)\fscx70\fscy70\t(0,120,\fscx106\fscy106)\t(120,200,\fscx100\fscy100)\fad(0,160)}' + qa)
            if qn:
                D(a + .2, b, 'Sm', r'{\pos(540,1490)\fad(160,160)}' + qn)
            D(a + .4, b, 'Ru', r'{\pos(540,1580)\fad(160,160)\fs44}' + en + ' — ' + ru)
        elif k == 'end':
            _, a, b, tx = e
            D(a, b, 'En', r'{\pos(540,1410)\fad(200,0)}' + tx.split('—')[0].strip())
            D(a + .2, b, 'Q', r'{\pos(540,1535)\fad(200,0)\fs64}' + (tx.split('—')[1].strip() if '—' in tx else ''))
    open(os.path.join(wk, 'subs.ass'), 'w', encoding='utf8').write('\n'.join(ass) + '\n')
    # --- видео (без звука): фон — тот же ролик, крупно и размыто; карточка в рамке парит; на ульту — вспышка и тряска ---
    cw, chh, cx, cy = spec['crop']
    CW = 760
    CH = round(CW * chh / cw / 2) * 2
    shk = '+'.join(f'if(between(t,{f:.2f},{f + .5:.2f}),11*sin((t-{f:.2f})*72)*exp(-(t-{f:.2f})*7),0)' for f in FL) or '0'
    flash = ''.join(f',fade=t=in:st={f - .02:.2f}:d=0.04:alpha=1,fade=t=out:st={f + .03:.2f}:d=0.25:alpha=1' for f in FL[:1])
    # фон — тот же ролик, но по центру — герой (а не тёмные края кадра): сдвиг кропа к центру карточки
    sw, sh = probe(vid)
    bx = max(0, min(round(sw * H / sh) - W, round((cx + cw / 2) / sw * sw * H / sh - W / 2)))
    vf = (f"[0:v]fps={FPS},split=2[a][b];"
          f"[a]scale=-2:{H},crop={W}:{H}:{bx}:0,gblur=sigma=28,eq=brightness=-0.06:saturation=1.35,vignette=PI/5[bg];"
          f"[b]crop={cw}:{chh}:{cx}:{cy},scale={CW}:{CH},pad={CW + 8}:{CH + 8}:4:4:color=0xC9A45A,pad={CW + 26}:{CH + 26}:9:9:color=0x0B0906[card];"
          f"[bg][card]overlay=x='(W-w)/2+{shk}':y='282+6*sin(2*PI*t/5)'[v1];"
          f"color=c=0xFFF3D6@0.38:s={W}x{H}:d={DUR:.2f},format=rgba{flash}[fl];"
          f"[v1][fl]overlay=enable='lt(t,{(FL[0] + .5) if FL else 0:.2f})'[v2];"
          f"[v2]ass=subs.ass:fontsdir=fonts,format=yuv420p[v]")
    run(['ffmpeg', '-y', '-v', 'error', '-stream_loop', '-1', '-i', os.path.abspath(vid), '-t', f'{DUR:.2f}',
         '-filter_complex', vf, '-map', '[v]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-profile:v', 'high',
         '-pix_fmt', 'yuv420p', '-an', 'v.mp4'], cwd=wk)
    # --- звук ---
    def voices(name):
        ins, fl = [], []
        for i, (p, at) in enumerate(VO):
            ins += ['-i', p]
            ms = int(at * 1000)
            fl.append(f'[{i}:a]aresample=48000,aformat=channel_layouts=stereo,adelay={ms}|{ms}[v{i}]')
        fl.append(''.join(f'[v{i}]' for i in range(len(VO))) + f'amix=inputs={len(VO)}:normalize=0,apad,atrim=0:{DUR:.2f}[o]')
        run(['ffmpeg', '-y', '-v', 'error', *ins, '-filter_complex', ';'.join(fl), '-map', '[o]', '-c:a', 'pcm_s16le', name], cwd=wk)
    voices('vo.wav')
    Lv = lufs(os.path.join(wk, 'vo.wav'))
    place = spec.get('amb', 'city')
    ab = spec.get('abil', 'rat')
    bed = os.path.join(amb, f'amb-{place}.wav')
    ir = os.path.join(amb, f'ir-{place}.wav')
    abw = os.path.join(amb, f'ab-{ab}.wav')
    Lb = lufs(bed)
    gb = (Lv + bed_db) - Lb  # фон — на bed_db (по умолчанию −24 дБ) тише голоса
    abd = '|'.join(str(int(a * 1000)) for a in AB[:1]) or '0'
    wet = (f"[0:a]asplit=2[vd][vr];[1:a]aformat=channel_layouts=stereo[irs];[vr][irs]afir=gtype=gn,volume=0.30,lowpass=f=5200[vrv];"
           f"[vd][vrv]amix=inputs=2:normalize=0[voc];[voc]asplit=2[voc1][sc];"
           f"[2:a]volume={gb:.2f}dB,aformat=channel_layouts=stereo,atrim=0:{DUR:.2f},afade=t=in:d=0.8,afade=t=out:st={DUR - .9:.2f}:d=0.9[bd];"
           f"[bd][sc]sidechaincompress=threshold=0.02:ratio=5:attack=20:release=500[bdd];"
           f"[3:a]aformat=channel_layouts=stereo,adelay={abd}|{abd},volume=-3dB[abs];"
           f"[voc1][bdd][abs]amix=inputs=3:normalize=0,atrim=0:{DUR:.2f}[o]")
    run(['ffmpeg', '-y', '-v', 'error', '-i', 'vo.wav', '-i', ir, '-stream_loop', '-1', '-i', bed, '-i', abw,
         '-filter_complex', wet, '-map', '[o]', '-c:a', 'pcm_s16le', 'wet.wav'], cwd=wk)
    res = {}
    for nm, src in (('dry', 'vo.wav'), ('wet', 'wet.wav')):
        L = lufs(os.path.join(wk, src))
        g = -14 - L
        dst = os.path.join(os.path.abspath(out), f"{spec['id']}-{nm}.mp4")
        run(['ffmpeg', '-y', '-v', 'error', '-i', 'v.mp4', '-i', src, '-filter_complex', f'[1:a]volume={g:.2f}dB,alimiter=limit=0.89:level=disabled[a]',
             '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', dst], cwd=wk)
        res[nm] = (dst, round(lufs(dst), 1))
    shutil.rmtree(wk, ignore_errors=True)
    return res, DUR, Lv, Lb, gb


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('spec')
    ap.add_argument('--out', default='tt-out')
    ap.add_argument('--amb')
    ap.add_argument('--font')
    ap.add_argument('--bed-db', type=float, default=-24)
    a = ap.parse_args()
    spec = json.load(open(a.spec, encoding='utf8'))
    base = os.path.dirname(os.path.abspath(a.spec))
    for k in ('video', 'audio'):
        if not os.path.isabs(spec[k]) and not spec[k].startswith('http'):
            spec[k] = os.path.normpath(os.path.join(base, spec[k]))
    amb = a.amb
    if not amb:
        amb = tempfile.mkdtemp(prefix='amb_')
        run([sys.executable, os.path.join(HERE, 'amb_make.py'), '--out', amb])
    res, dur, Lv, Lb, gb = build(spec, a.out, amb, a.font, a.bed_db)
    print(f'{dur:.1f} с · голос {Lv:.1f} LUFS · фон {Lb:.1f} → {Lb + gb:.1f} LUFS ({a.bed_db:+.0f} дБ к голосу)')
    for k, (p, l) in res.items():
        print(k, l, 'LUFS', p)
