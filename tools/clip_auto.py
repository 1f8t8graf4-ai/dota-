#!/usr/bin/env python3
"""Нарезчик длинного видео на вертикальные клипы (ТЗ-ZAI-18.11, задание 1).

  python3 tools/clip_auto.py <видео> <папка> [--n 10] [--lang en|ru] [--frames 01.mp4:3,12]
                             [--min 25] [--max 60]

Что делает:
  1) речь -> слова со временем (Vosk small, кэш слов в <папка>/words.json);
  2) куски 25–60 с: начало — начало фразы, конец — конец фразы, внутри куска
     нет паузы дольше 0,8 с; рейтинг — плотность речи, громкие места
     (смех/крик по громкости), вопрос → ответ, чистые границы;
  3) кадр 9:16 (центр по лицу, нет лица — центр кадра); камера двигается
     плавно (0,6 с) и не чаще раза в 3 с;
  4) субтитры по словам крупно: слово по центру, ключевые — жёлтым,
     низ субтитров не ниже Y 1500 (при 1080x1920);
  5) звук −14 LUFS, пик ≤ −1,5 dBFS (проверка: tools/tt_audio.py report);
  6) выход: 01.mp4, 02.mp4… + список.md (начало–конец, первая фраза,
     почему выбран кусок, сколько слов).

Видео и модели в git не кладутся: модель качается в ~/.cache/vosk/.
"""
import argparse, json, os, re, subprocess, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import wt_vosk  # pcm() → s16le 16k mono

VOSK_BASE = 'https://alphacephei.com/vosk/models/'
MODELS = {'en': 'vosk-model-small-en-us-0.15.zip', 'ru': 'vosk-model-small-ru-0.22.zip'}
CACHE = os.path.expanduser('~/.cache/vosk')

# ── параметры качества (ТЗ) ────────────────────────────────
MIN_LEN, MAX_LEN = 25.0, 60.0     # длина куска, с
MAX_GAP = 0.8                     # пауза внутри куска, с — больше нельзя
SHIFT_EVERY = 3.0                 # камера: не чаще раза в 3 с
SHIFT_EASE = 0.6                  # длительность плавного перехода, с
SHIFT_TOL = 0.06                  # сдвиг, если лицо ушло на 6 % ширины кадра
SUB_CENTER_Y = 1430               # центр субтитров (низ ≤ 1500)
SUB_MAX_W = 980                   # слово не шире 980 px
ACCENT = 'H003FD4FF'               # жёлтый ключевых слов (ASS, BGR: RGB FFD43F)
Q_EN = r'what|why|how|do|does|did|can|could|will|would|is|are|was|were|who|when|where'
Q_RU = r'что|почему|зачем|как|когда|кто|где|можно|нужно|правда|а знаете'
STOP = set('''the a an and or but so if then than that this these those of to in on at for with by from as is are was
were be been being it its it's i you he she they we me him her them my your our their there here not no yes do does
did done have has had will would can could should may might must just about into over under out up down и в во не на
что как да нет же бы а но или вот так там тут этот эта эти мой твой его её их really actually very just like know
'''.split())

LANG = 'en'

# ───────────────────────── модель ──────────────────────────
def model_path(lang):
    name = MODELS[lang]
    d = os.path.join(CACHE, name[:-4])
    if os.path.isdir(d) and os.path.exists(os.path.join(d, 'am/final.mdl')):
        return d
    os.makedirs(CACHE, exist_ok=True)
    z = os.path.join(CACHE, name)
    if not os.path.exists(z) or os.path.getsize(z) < 1000:
        print(f'качаю модель {name}…')
        subprocess.run(['curl', '-sL', '-o', z, VOSK_BASE + name], check=True)
    subprocess.run(['unzip', '-o', '-q', z, '-d', CACHE], check=True)
    return d

def recognize_free(pcm_bytes):
    """Свободное распознавание: все слова со временем начала/конца."""
    from vosk import Model, KaldiRecognizer, SetLogLevel
    SetLogLevel(-1)
    model = Model(model_path(LANG))
    rec = KaldiRecognizer(model, 16000)
    rec.SetWords(True)
    out = []
    for i in range(0, len(pcm_bytes), 8000):
        if rec.AcceptWaveform(pcm_bytes[i:i + 8000]):
            out += json.loads(rec.Result()).get('result', [])
    out += json.loads(rec.FinalResult()).get('result', [])
    return [(r['word'], round(r['start'], 2), round(r['end'], 2))
            for r in out if r.get('word') and r['word'] != '[unk]']

# ───────────────────── фразы, раны, куски ──────────────────
def phrases(words):
    """Фраза = цепочка слов без паузы ≥ MAX_GAP."""
    out = []
    for w, a, b in words:
        if out and a - out[-1]['end'] < MAX_GAP:
            out[-1]['end'] = b
            out[-1]['text'].append(w)
        else:
            out.append(dict(start=a, end=b, text=[w]))
    for p in out:
        p['text'] = ' '.join(p['text'])
        p['q'] = bool(re.match(r'^\s*(%s)\b' % (Q_EN if LANG == 'en' else Q_RU),
                               p['text'].lower()))
    return out

def runs_of(ph):
    rs, cur = [], []
    for p in ph:
        if cur and p['start'] - cur[-1]['end'] >= MAX_GAP:
            rs.append(cur)
            cur = []
        cur.append(p)
    if cur:
        rs.append(cur)
    return rs

def rms_db(pcm_bytes):
    import numpy as np
    x = np.frombuffer(pcm_bytes, '<i2').astype(float) / 32768
    k = 1600  # 0,1 с на кадр профиля
    n = len(x) // k
    e = np.sqrt((x[:n * k].reshape(n, k) ** 2).mean(axis=1) + 1e-12)
    return 20 * np.log10(e + 1e-9)

def rate(a, b, ph_in, words, db):
    """Рейтинг куска (a, b): плотность речи, громкие места, вопрос→ответ."""
    import numpy as np
    nwords = sum(1 for w, wa, wb in words if wa < b and wb > a)
    dur = b - a
    dens = nwords / max(1e-6, dur)
    i0, i1 = int(a * 10), int(b * 10)
    seg_db = db[max(0, i0):i1 + 1]
    p90 = float(np.percentile(db, 90)) if len(db) else -40.0
    loud = float(np.mean(seg_db > p90 + 3)) if len(seg_db) else 0.0
    qa = sum(1 for p in ph_in if p['q'] and a + 2 < p['end'] < b - 1)
    score = dens + loud * 3.0 + qa * 0.6
    why = [f'плотность речи {dens:.1f} сл/с',
           f'громкие места: {loud * 100:.0f}% времени',
           f'вопросов с ответом внутри: {qa}']
    return score, why

def silence_cuts(run, db):
    """Провалы громкости внутри рана: [(время, длительность)] — Vosk паузы не показывает,
    а резать куски надо по паузам (речь идёт сплошняком с музыкой в фоне)."""
    import numpy as np
    a, b = run[0]['start'], run[-1]['end']
    flo = float(np.percentile(db, 20)) if len(db) else -40.0
    seg = db[max(0, int(a * 10)):int(b * 10) + 1]
    below, cuts, k = seg < flo + 4, [], 0
    while k < len(below):
        if below[k]:
            j = k
            while j < len(below) and below[j]:
                j += 1
            d = (j - k) / 10.0
            if d >= 0.3:
                cuts.append((a + (k + (j - k) / 2.0) / 10.0, d))
            k = j
        else:
            k += 1
    return cuts

def build_candidates(ph, db, words):
    """Все куски 25–60 с: границы — фразы и провалы громкости; внутри куска нет
    паузы дольше 0,8 с (раны рвутся на hard-резах, длинный ран режется по мягким)."""
    out = []
    for run in runs_of(ph):
        cuts = silence_cuts(run, db)
        hard = [t for t, d in cuts if d >= MAX_GAP]
        soft = sorted(t for t, d in cuts if d < MAX_GAP)
        # рвём ран по паузам ≥0,8 с (внутри куска таких быть не может)
        subs, cur = [], []
        for p in run:
            if cur and any(t >= cur[-1]['end'] and t <= p['start'] for t in hard):
                subs.append(cur)
                cur = []
            cur.append(p)
        if cur:
            subs.append(cur)
        for sub in subs:
            if sub[-1]['end'] - sub[0]['start'] < MIN_LEN:
                continue
            s0, s1 = sub[0]['start'], sub[-1]['end']
            # границы: начало фраз + мягкие провалы + конец подрана
            bounds = sorted(set([s0] + [p['start'] for p in sub if s0 < p['start'] < s1]
                                + [t for t in soft if s0 < t < s1] + [s1]))
            for i in range(len(bounds)):
                for j in range(i + 1, len(bounds)):
                    a, b = bounds[i], bounds[j]
                    dur = b - a
                    if dur > MAX_LEN:
                        break
                    if dur >= MIN_LEN:
                        s, why = rate(a, b, ph, words, db)
                        why.append('обе границы по паузам' if (a in soft or a == s0 or a == s1)
                                   and (b in soft or b == s0 or b == s1) else 'стык в потоке речи')
                        first_p = next(p for p in sub if p['end'] > a)
                        out.append(dict(a=round(a, 2), b=round(b, 2), score=s, why=why,
                                        first=first_p['text']))
    return out

# ─────────────────────── кадр 9:16 ─────────────────────────
def face_anchors(mp4, t0, t1):
    """Центр лица раз в 0,5 с (haar); нет лица — центр кадра."""
    import cv2
    cap = cv2.VideoCapture(mp4)
    W = cap.get(cv2.CAP_PROP_FRAME_WIDTH)
    cas = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    anchors, t = [], t0
    while t <= t1:
        cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000)
        ok, fr = cap.read()
        if ok:
            small = cv2.resize(fr, (640, int(640 * fr.shape[0] / fr.shape[1])))
            g = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
            faces = cas.detectMultiScale(g, 1.15, 5, minSize=(48, 48))
            if len(faces):
                big = max(faces, key=lambda f: f[2] * f[3])
                fx = (big[0] + big[2] / 2) / small.shape[1] * W
            else:
                fx = W / 2
            anchors.append([t, fx])
        t += 0.5
    cap.release()
    return anchors, W

def smooth_x(anchors, W):
    """Держим текущий x; двигаемся, если лицо ушло на SHIFT_TOL и прошло ≥3 с."""
    tol = W * SHIFT_TOL
    out, cur_x, last = [], anchors[0][1], anchors[0][0]
    for t, x in anchors:
        if abs(x - cur_x) > tol and t - last >= SHIFT_EVERY:
            cur_x, last = x, t
        out.append([t, cur_x])
    return out

def crop_expr(smoothed, cw, src_w):
    """ffmpeg-выражение x(t): якоря ступенчатые, переход — линейный за 0,6 с."""
    xs = []
    for t, xc in smoothed:
        x = max(0.0, min(xc - cw / 2.0, src_w - cw))
        if xs and abs(xs[-1][1] - x) < 1.0:
            continue
        xs.append([t, x])
    if not xs:
        return '0'
    expr = '%.1f' % xs[-1][1]
    for k in range(len(xs) - 2, -1, -1):
        t, x = xs[k]
        nt, nx = xs[k + 1]
        blend = ('(%.1f+(%.1f-%.1f)*min(1,max(0,(t-%.2f)/%.2f)))'
                 % (x, nx, x, nt - SHIFT_EASE, SHIFT_EASE))
        expr = 'if(lt(t,%.2f),%s,%s)' % (nt, blend, expr)
    return 'max(0,min(%s,%.0f))' % (expr, src_w - cw)

# ────────────────────── субтитры ASS ───────────────────────
def ass_escape(s):
    return s.replace('\\', '\\\\').replace('{', '\\{').replace('}', '\\}')

def at(t):
    """Секунды → время ASS (H:MM:SS.CS)."""
    t = max(0.0, t)
    cs = int(round(t * 100))
    return '%d:%02d:%02d.%02d' % (cs // 360000, cs // 6000 % 60, cs // 100 % 60, cs % 100)

def build_ass(words, t0):
    """Слово-за-словом крупно; ключевые — цветом; низ ≤ y1500."""
    keys, last_end = set(), -9.0
    for k, (w, a, b) in enumerate(words):
        lw = w.lower().strip('.,!?";:')
        if len(lw) >= 6 and lw not in STOP and a - last_end >= 1.2:
            keys.add(k)
            last_end = b
    hdr = ('[Script Info]\nScriptType: v4.00+\nPlayResX: 1080\nPlayResY: 1920\n\n'
           '[V4+ Styles]\n'
           'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, '
           'BackColour, Bold, Italic, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, '
           'MarginV, Encoding\n'
           'Style: Word,Montserrat,110,&H00FFFFFF,&H00FFFFFF,&H00101010,&H80000000,-1,0,1,7,3,5,'
           '60,60,10,1\n\n[Events]\n'
           'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n')
    ev = []
    for k, (w, a, b) in enumerate(words):
        a, b = max(0.0, a - t0), max(0.0, b - t0)
        if b - a < 0.12:
            b = a + 0.12
        text = ass_escape(w.strip())
        fs = 110
        est = int(fs * 0.62 * len(text))
        if est > SUB_MAX_W:
            fs = max(54, int(fs * SUB_MAX_W / est))
        col = '\\c&%s&' % ACCENT if k in keys else ''
        ev.append('Dialogue: 0,%s,%s,Word,,0,0,0,,{\\fs%d\\b1%s\\pos(540,%d)}%s'
                  % (at(a), at(b + 0.06), fs, col, SUB_CENTER_Y, text))
    return hdr + '\n'.join(ev) + '\n'

# ─────────────────────── сборка клипа ──────────────────────
def ensure_font():
    """libass не берёт вариативные шрифты — создаём статический Montserrat-700."""
    fd = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tt_demo_fonts')
    stat = os.path.join(fd, 'Montserrat-700.ttf')
    var = os.path.join(fd, 'Montserrat[wght].ttf')
    if not os.path.exists(stat) and os.path.exists(var):
        try:
            import subprocess as sp
            sp.run([sys.executable, '-m', 'fontTools.varLib.instancer', var, 'wght=700',
                    '-o', stat], capture_output=True, check=True)
        except Exception as e:
            print('fontTools не осилил вариативный шрифт — субтитры уйдут в системный фолбэк:', e)
    return fd

def snap_starts(wseg, a, b, pcmb):
    """Подтягиваем старт каждого слова к фактическому фронту голоса (Vosk местами
    ставит слово раньше на 0,2–0,4 с). Поиск фронта в окне [−0,1; +0,45] с от claimed start."""
    import numpy as np
    sr = 16000
    x = np.frombuffer(pcmb, '<i2').astype(float) / 32768
    seg = x[int(a * sr):int(b * sr)]
    if len(seg) < sr:
        return wseg
    k = 480  # 30 мс — та же мера, что в qa_subs_sync (окно RMS, порог p20+6 дБ)
    rms = np.sqrt(np.convolve(seg ** 2, np.ones(k) / k, 'same') + 1e-9)
    db = 20 * np.log10(rms + 1e-9)
    flo = float(np.percentile(db, 20))
    out, prev_rel = [], 0.0
    for w, wa, wb in wseg:
        rel = wa - a
        if rel < 0:
            rel = 0.0
        i0 = max(0, int(rel * sr))
        i1 = min(len(db) - 1, int((rel + 0.45) * sr))
        new_rel = rel
        if db[i0] <= flo + 6:  # в момент claimed-старта голоса нет — слово стоит раньше
            for j in range(i0, i1 + 1):
                if db[j] > flo + 6:
                    new_rel = max(0.0, j / sr - 0.02)
                    break
        new_rel = min(max(new_rel, prev_rel), max(prev_rel, wb - a - 0.06))
        prev_rel = new_rel
        out.append((w, a + new_rel, a + new_rel + (wb - wa)))
    return out

def onset_lags(clip_mp4, wseg, a):
    """QA-мера на ГОТОВОМ клипе: для каждого слова — на сколько фронт голоса позже старта слова."""
    import numpy as np
    sr = 16000
    x = np.frombuffer(wt_vosk.pcm(clip_mp4), '<i2').astype(float) / 32768
    k = 480
    rms = np.sqrt(np.convolve(x ** 2, np.ones(k) / k, 'same') + 1e-9)
    db = 20 * np.log10(rms + 1e-9)
    flo = float(np.percentile(db, 20))
    lags = []
    for w, wa, wb in wseg:
        rel = max(0.0, wa - a)
        if wb - wa > 1.5 or wb - wa < 0.08:
            lags.append((w, 0.0))
            continue
        i0 = max(0, int(rel * sr))
        i1 = min(len(db) - 1, int((rel + 0.45) * sr))
        if db[i0] > flo + 6:
            lags.append((w, 0.0))
            continue
        onset = None
        for j in range(i0, i1 + 1):
            if db[j] > flo + 6:
                onset = j / sr
                break
        lags.append((w, (onset - rel) if onset is not None else 0.45))
    return lags

def verify_and_fix(clip_mp4, a, wseg, tmpd):
    """Второй проход: замер фронта голоса на ГОТОВОМ клипе; слова, стоящие раньше голоса
    больше чем на 0,15 с, сдвигаем; затем запекаем субтитры (один раз) поверх базы."""
    lags = onset_lags(clip_mp4, wseg, a)
    worst = max((l for _, l in lags), default=0.0)
    fixed, prev_rel = [], 0.0
    for (w, wa, wb), (w2, lag) in zip(wseg, lags):
        if lag > 0.45:
            continue  # фантомное слово: голоса в его окне нет вообще — не показываем
        rel = max(0.0, wa - a)
        if lag > 0.15:
            rel = max(0.0, wa - a + lag - 0.02)
        rel = min(max(rel, prev_rel), max(prev_rel, wb - a - 0.06))
        prev_rel = rel
        fixed.append((w, a + rel, a + rel + (wb - wa)))
    fdir = ensure_font()
    ass = os.path.join(tmpd, 'subs_fix.ass')
    open(ass, 'w').write(build_ass(fixed, a))
    tmp2 = os.path.join(tmpd, 'fix.mp4')
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', clip_mp4,
                    '-vf', f'ass={ass}:fontsdir={fdir}', '-c:v', 'libx264',
                    '-preset', 'superfast', '-crf', '25', '-c:a', 'copy',
                    '-movflags', '+faststart', tmp2], check=True)
    os.replace(tmp2, clip_mp4)
    return fixed, worst

def render(mp4, a, b, words, out_mp4, tmpd, pcmb):
    wseg = [(w, x, y) for w, x, y in words if x >= a - 0.2 and y <= b + 0.2]
    wseg = snap_starts(wseg, a, b, pcmb)
    anchors, W = face_anchors(mp4, a, b)
    ih = int(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'stream=height',
                             '-of', 'csv=p=0', mp4], capture_output=True, text=True)
             .stdout.splitlines()[0])
    cw = int(round(W * 9 / 32.0)) * 2   # 9/16 ширины, чётное
    xexpr = crop_expr(smooth_x(anchors, W), cw, W)
    vf = (f"crop=w={cw}:h={ih}:x='{xexpr}':y=0,"
          f'scale=1080:1920:flags=lanczos,fps=30')
    af_pre = ('silenceremove=start_periods=1:start_silence=0.15:start_threshold=-50dB,'
              'areverse,silenceremove=start_periods=1:start_silence=0.15:start_threshold=-50dB,'
              'areverse,loudnorm=I=-14:TP=-1.5:LRA=11')
    # «воздух» −60 дБ под весь клип: нет цифровой тишины, как у примеров tt_audio
    fc = ('[0:a]%s[v];anoisesrc=colour=brown:sample_rate=48000:amplitude=0.018[n];'
          '[v][n]amix=inputs=2:duration=first:normalize=0[aout]' % af_pre)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-ss', str(a), '-to', str(b), '-i', mp4,
                    '-vf', vf, '-filter_complex', fc, '-map', '0:v', '-map', '[aout]',
                    '-c:v', 'libx264', '-preset', 'superfast', '-crf', '25',
                    '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', out_mp4],
                   check=True)
    # второй проход: замер на готовом клипе + запекание субтитров с выверенными временами
    wseg, worst = verify_and_fix(out_mp4, a, wseg, tmpd)
    json.dump([[w, round(x, 2), round(y, 2)] for w, x, y in wseg],
              open(os.path.join(os.path.dirname(out_mp4),
                                os.path.basename(out_mp4)[:-4] + '.subs.json'), 'w'),
              ensure_ascii=False)
    return wseg

def build_words(video, lang):
    """Два прохода: свободное распознавание даёт текст, wt_vosk.align уточняет времена слов
    (распознавание с грамматикой из тех же слов — точнее на 0,1–1 с на отдельных словах)."""
    free = recognize_free(wt_vosk.pcm(video))
    if not free:
        return []
    text = ' '.join(w for w, a, b in free)
    words = [(w, a, b) for w, a, b in free]
    try:
        al, hit = wt_vosk.align(model_path(lang), video, text)
        if hit > 0.5 and len(al) >= 0.6 * len(words):
            words = [(w, a, max(a + 0.06, b)) for a, b, w in al]
            print(f'выравнивание по тексту: совпадений {hit * 100:.0f}% — времена уточнены')
        else:
            print(f'выравнивание слабое ({hit * 100:.0f}%) — оставляю времена свободного прохода')
    except Exception as e:
        print('align упал, оставляю свободный проход:', e)
    return [(w, a, b) for w, a, b in words if b > a]

# ─────────────────────────── main ──────────────────────────
def main():
    global LANG, MIN_LEN, MAX_LEN
    ap = argparse.ArgumentParser()
    ap.add_argument('video')
    ap.add_argument('out')
    ap.add_argument('--n', type=int, default=10)
    ap.add_argument('--lang', default='en', choices=['en', 'ru'])
    ap.add_argument('--frames', default='', help='01.mp4:3,12 — PNG-кадры на проверку')
    ap.add_argument('--min', type=float, default=MIN_LEN)
    ap.add_argument('--max', type=float, default=MAX_LEN)
    ap.add_argument('--words-only', action='store_true',
                    help='только распознать и сохранить words.json (без сборки клипов)')
    A = ap.parse_args()
    LANG = A.lang
    MIN_LEN, MAX_LEN = A.min, A.max
    os.makedirs(A.out, exist_ok=True)
    tmpd = os.path.join(A.out, '.tmp')
    os.makedirs(tmpd, exist_ok=True)

    cache = os.path.join(A.out, 'words.json')
    if os.path.exists(cache):
        words = [tuple(x) for x in json.load(open(cache))]
        print('слова из кэша:', len(words))
    else:
        print('распознаю речь (Vosk small %s, 2 прохода)…' % LANG)
        words = build_words(A.video, LANG)
        json.dump(words, open(cache, 'w'), ensure_ascii=False)
        print('слов:', len(words))
    if not words:
        raise SystemExit('речь не найдена')
    if A.words_only:
        print('words.json готов:', cache)
        return

    pcmb = wt_vosk.pcm(A.video)
    db = rms_db(pcmb)
    ph = phrases(words)
    cands = build_candidates(ph, db, words)
    cands.sort(key=lambda c: -c['score'])
    picked = []
    for c in cands:
        if any(min(c['b'], p['b']) - max(c['a'], p['a']) > 5 for p in picked):
            continue
        picked.append(c)
        if len(picked) >= A.n:
            break
    picked.sort(key=lambda c: c['a'])

    lines = ['# Нарезки — ' + os.path.basename(A.video), '']
    for i, c in enumerate(picked, 1):
        out = os.path.join(A.out, '%02d.mp4' % i)
        print('%02d  %.0f–%.0fs  score %.1f' % (i, c['a'], c['b'], c['score']))
        wseg = [(w, x, y) for w, x, y in words
                if c['a'] - 0.2 <= x and y <= c['b'] + 0.2]
        if os.path.exists(out) and os.path.getsize(out) > 200_000:
            print('    уже есть — рендер пропущен')
        else:
            if os.path.exists(out):
                os.remove(out)  # оборванный от прошлого запуска
            render(A.video, c['a'], c['b'], words, out, tmpd, pcmb)
        lines += ['## %02d.mp4 — %.0f–%.0fs (%.0f с)' % (i, c['a'], c['b'], c['b'] - c['a']),
                  '- первая фраза: «%s»' % ' '.join(c['first'].split()[:10]),
                  '- почему выбран: ' + '; '.join(c['why']),
                  '- слов в субтитрах: %d' % len(wseg), '']
    open(os.path.join(A.out, 'список.md'), 'w').write('\n'.join(lines))

    for spec in [s for s in A.frames.split(',') if s]:
        f, ts = spec.split(':')
        for t in ts.split('|'):
            subprocess.run(['ffmpeg', '-y', '-v', 'error', '-ss', t, '-i', os.path.join(A.out, f),
                            '-frames:v', '1',
                            os.path.join(A.out, '%s-t%s.png' % (f[:-4], t))], check=True)
    print('готово:', A.out)

if __name__ == '__main__':
    main()
