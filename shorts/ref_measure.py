#!/usr/bin/env python3
"""Замер роликов против референсов (11.11): смена картинки, заполненность кадра, цвет, громкость, речь (Vosk ru, локально, бесплатно).
python3 ref_measure.py <имя>=<путь> ...  → строка JSON на ролик; расшифровка с отметками времени — <имя>.txt в текущей папке.
  new_every — новая картинка раз в N с (за 0,5 с поменялось > 22 из 255 по яркости, как в замере 09.11); still — % времени кадр стоит;
  hard — резкие смены; busy — % кадра, где что-то нарисовано (блоки 10×10 с перепадом яркости, зерно уходит при уменьшении);
  colored — % цветных пикселей; luma — средняя яркость; I/LRA/maxM_I/floor — громкость (EBU R128);
  wps — слов в секунду; pauses/long — паузы в речи > 0,35 / > 0,8 с. Модель Vosk — VOSK_RU (по умолчанию /home/user/wdyk/models/vosk-ru)."""
import json, os, subprocess, sys, wave
import numpy as np

OUT = os.getcwd()
VOSK = os.environ.get('VOSK_RU', '/home/user/wdyk/models/vosk-ru')


def frames(path, fps, w, h):
    p = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-vf', f'fps={fps},scale={w}:{h}:flags=area', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                       capture_output=True, check=True)
    a = np.frombuffer(p.stdout, np.uint8)
    return a.reshape(-1, h, w, 3).astype(np.float32)


def visual(path, portrait):
    w, h = (54, 96) if portrait else (96, 54)
    F = frames(path, 4, w, h)
    Y = F @ np.array([.299, .587, .114], np.float32)
    d = np.abs(Y[2:] - Y[:-2]).mean(axis=(1, 2))           # разница за 0,5 с
    new = d > 22                                             # «новая картинка», как в замере 09.11
    ev = int(np.sum(new[1:] & ~new[:-1]) + (1 if new[0] else 0))
    dur = len(Y) / 4
    still = float(np.mean(d < 1.5))                           # кадр стоит
    cut = np.abs(Y[1:] - Y[:-1]).mean(axis=(1, 2))           # за 0,25 с
    hard = int(np.sum(cut > 30))
    # заполненность: доля блоков с деталями (после усреднения зерно уходит)
    W2, H2 = (180, 320) if portrait else (320, 180)
    G = frames(path, 1, W2, H2) @ np.array([.299, .587, .114], np.float32)
    gx = np.abs(np.diff(G, axis=2))[:, :-1, :]; gy = np.abs(np.diff(G, axis=1))[:, :, :-1]
    gm = np.maximum(gx, gy)
    b = 10; hh, ww = (gm.shape[1] // b) * b, (gm.shape[2] // b) * b
    blk = gm[:, :hh, :ww].reshape(len(gm), hh // b, b, ww // b, b).max(axis=(2, 4))
    busy = float(np.mean(blk > 9))
    # палитра: сколько оттенков занимает >3 % цветных пикселей
    C = frames(path, 0.5, 64, 36).reshape(-1, 3) / 255.
    mx, mn = C.max(1), C.min(1); s = (mx - mn) / (mx + 1e-6); v = mx
    hue = np.zeros(len(C)); r, g, bb = C[:, 0], C[:, 1], C[:, 2]; dd = mx - mn + 1e-6
    hue = np.where(mx == r, ((g - bb) / dd) % 6, np.where(mx == g, (bb - r) / dd + 2, (r - g) / dd + 4)) * 60
    col = (s > .25) & (v > .2)
    hist = np.histogram(hue[col], bins=12, range=(0, 360))[0] / max(1, col.sum())
    pal = int(np.sum(hist > .03)); colfrac = float(col.mean())
    luma = float(Y.mean())
    return dict(dur=round(dur, 1), new_every=round(dur / max(1, ev), 2), still=round(still * 100), hard=hard,
                busy=round(busy * 100), hues=pal, colored=round(colfrac * 100), luma=round(luma))


def loud(path):
    p = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', path, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True)
    I = LRA = None; M = []
    for ln in p.stderr.splitlines():
        if ' M:' in ln and ' S:' in ln:
            try: M.append(float(ln.split(' M:')[1].split()[0]))
            except Exception: pass
        if ln.strip().startswith('I:') and 'LUFS' in ln: I = float(ln.split()[1])
        if ln.strip().startswith('LRA:') and 'LU' in ln: LRA = float(ln.split()[1])
    M = np.array([m for m in M if m > -70]) if M else np.array([-70.])
    return dict(I=I, LRA=LRA, maxM_I=round(float(M.max() - I), 1) if I is not None else None, floor=round(float(np.percentile(M, 5)), 1))


def speech(path, name):
    from vosk import Model, KaldiRecognizer, SetLogLevel
    SetLogLevel(-1)
    m = speech.model = getattr(speech, 'model', None) or Model(VOSK)
    rec = KaldiRecognizer(m, 16000); rec.SetWords(True)
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], stdout=subprocess.PIPE)
    W = []
    while True:
        dta = p.stdout.read(32000)
        if not dta: break
        if rec.AcceptWaveform(dta): W += json.loads(rec.Result()).get('result', [])
    W += json.loads(rec.FinalResult()).get('result', [])
    if not W: return dict(wps=0, pauses=0, first=None)
    span = W[-1]['end'] - W[0]['start']
    gaps = [b['start'] - a['end'] for a, b in zip(W, W[1:])]
    txt = ' '.join(w['word'] for w in W)
    # строки по 2,5 с — чтобы было видно, что когда сказано
    lines, cur, t0 = [], [], W[0]['start']
    for w in W:
        if w['start'] - t0 > 5 and cur: lines.append(f"{t0:5.1f} {' '.join(cur)}"); cur, t0 = [], w['start']
        cur.append(w['word'])
    if cur: lines.append(f"{t0:5.1f} {' '.join(cur)}")
    open(os.path.join(OUT, name + '.txt'), 'w').write('\n'.join(lines) + '\n')
    return dict(wps=round(len(W) / span, 2), pauses=sum(1 for g in gaps if g > .35), long=sum(1 for g in gaps if g > .8),
                voice=round(span, 1), first=round(W[0]['start'], 2), words=len(W))


if __name__ == '__main__':
    for arg in sys.argv[1:]:
        name, path = arg.split('=', 1)
        pr = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', path], capture_output=True, text=True).stdout.strip().split(',')
        portrait = int(pr[1]) > int(pr[0])
        r = dict(name=name); r.update(visual(path, portrait)); r.update(loud(path))
        try: r.update(speech(path, name))
        except Exception as e: r['speech_err'] = str(e)[:80]
        print(json.dumps(r, ensure_ascii=False), flush=True)
