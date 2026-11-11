#!/usr/bin/env python3
"""Переходы против референсов (11.11): склейки (резкая смена между соседними кадрами), сколько времени что-то движется
(moving, %), сколько времени картинка сдвигается вбок (pan, %: камера едет или предметы въезжают).
new_med — слишком чувствительна к движению, для «раз в сколько секунд новая картинка» брать new_every из ref_measure.py.
python3 ref_cuts.py <имя>=<путь> …  → строка JSON на ролик (cut_t — время склеек)."""
import json, subprocess, sys
import numpy as np


def gray(path, w, h, fps=None):
    vf = (f'fps={fps},' if fps else '') + f'scale={w}:{h}:flags=area'
    p = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-vf', vf, '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], capture_output=True, check=True)
    return np.frombuffer(p.stdout, np.uint8).reshape(-1, h, w).astype(np.float32)


def rate(path):
    r = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=r_frame_rate', '-of', 'csv=p=0', path], capture_output=True, text=True).stdout.strip()
    a, b = r.split('/'); return float(a) / float(b)


def analyse(path):
    fps = rate(path)
    pr = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', path], capture_output=True, text=True).stdout.strip().split(',')
    port = int(pr[1]) > int(pr[0])
    W, H = (36, 64) if port else (64, 36)
    Y = gray(path, W, H)                                   # все кадры
    n = len(Y); dur = n / fps
    d1 = np.abs(np.diff(Y, axis=0)).mean(axis=(1, 2))     # соседние кадры
    # склейка: резкий скачок на одном кадре, рядом тихо
    cuts = []
    for i in range(len(d1)):
        lo, hi = max(0, i - 4), min(len(d1), i + 5)
        nb = np.concatenate([d1[lo:i], d1[i + 1:hi]])
        if d1[i] >= 14 and d1[i] >= 3.5 * (np.median(nb) if len(nb) else 0) + 2:
            if not cuts or (i - cuts[-1]) / fps > .25: cuts.append(i)
    # новая картинка: кадр ушёл от опорного больше чем на T (склейкой или движением)
    Y4 = Y[::max(1, int(round(fps / 8)))]; step = len(Y) / max(1, len(Y4)) / fps   # ~8 к/с
    ev = []; ref = Y4[0]
    for k in range(1, len(Y4)):
        if np.abs(Y4[k] - ref).mean() > 26:
            ev.append(k * step); ref = Y4[k]
    iv = np.diff([0.0] + ev + [dur]) if ev else np.array([dur])
    # движется ли что-то; едет ли камера вбок (фазовая корреляция, кадры через 0,2 с)
    moving = float(np.mean(d1 > .6))
    Wp, Hp = (90, 160) if port else (160, 90)
    G = gray(path, Wp, Hp, 5)
    win = np.outer(np.hanning(Hp), np.hanning(Wp)).astype(np.float32)
    pan = 0; tot = 0
    for a, b in zip(G[:-1], G[1:]):
        if np.abs(a - b).mean() < .5: tot += 1; continue
        F1 = np.fft.fft2((a - a.mean()) * win); F2 = np.fft.fft2((b - b.mean()) * win)
        R = F1 * np.conj(F2); R /= np.abs(R) + 1e-6
        r = np.abs(np.fft.ifft2(R)); y, x = np.unravel_index(np.argmax(r), r.shape)
        dy = y if y <= Hp // 2 else y - Hp; dx = x if x <= Wp // 2 else x - Wp
        if r.max() > .12 and (abs(dx) + abs(dy)) >= 1: pan += 1
        tot += 1
    return dict(dur=round(dur, 1), cuts=len(cuts), cut_every=round(dur / max(1, len(cuts)), 1),
                new_med=round(float(np.median(iv)), 2), new_p25=round(float(np.percentile(iv, 25)), 2), new_p75=round(float(np.percentile(iv, 75)), 2),
                new_count=len(ev), moving=round(moving * 100), pan=round(pan / max(1, tot) * 100),
                cut_t=[round(c / fps, 1) for c in cuts][:40])


if __name__ == '__main__':
    for arg in sys.argv[1:]:
        name, path = arg.split('=', 1)
        r = dict(name=name); r.update(analyse(path)); print(json.dumps(r, ensure_ascii=False), flush=True)
