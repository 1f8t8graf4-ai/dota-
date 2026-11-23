#!/usr/bin/env python3
"""23.11: 16:9 — сглаживает «скачки боков»: при нырке в предмет центр кадра непрерывный, а бока резко меняются
(предмет закрыл вертикальный кадр — и заливка мира за ним стала на всю ширину, или сменился мир).
Ищет такие кадры во всей главе (куски out/<ролик>/wparts/pK.mp4 подряд) и за ±0,27 с плавно растворяет бока:
до скачка — живые бока → «после», после скачка — «до» → живые бока (центр не трогает). Глава → out/<ролик>/video_w.mp4.
  python3 wide_fix.py <ролик> [<ролик> …]   (WF_KEEP=1 — не удалять куски)"""
import os, subprocess, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); NW = 8   # ±8 кадров
W, H = [int(v) for v in os.environ.get('WF_SIZE', '1920x1080').split('x')]; Z = float(os.environ.get('WZ', '1.3'))   # 24.11: кадр 1920×1080, камера ×1,3 (как в ep/wide.js)
_s = Z * H / 1920; _ox = (W / _s - 1080) / 2; CX0, CX1 = round(_s * _ox), round(_s * (_ox + 1080))   # вертикальный кадр в пикселях широкого
FF = os.environ.get('FFMPEG', 'ffmpeg')


def src_args(d): return ['-f', 'concat', '-safe', '0', '-i', os.path.join(d, 'list.txt')]


def pops(d):
    w, h = 320, 180
    raw = subprocess.run(['ffmpeg', '-v', 'error', *src_args(d), '-vf', f'scale={w}:{h}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True, check=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, h, w, 3).astype(np.float32); c0, c1 = int(w * CX0 / W), int(w * CX1 / W)
    L = fr[:, :, :int(w * .25)].mean((1, 2)); R = fr[:, :, int(w * .75):].mean((1, 2)); C = fr[:, :, c0:c1].mean((1, 2))
    dS = np.maximum(np.abs(np.diff(L, axis=0)).max(1), np.abs(np.diff(R, axis=0)).max(1)); dC = np.abs(np.diff(C, axis=0)).max(1)
    return [i + 1 for i in range(len(dS)) if dS[i] > 14 and dS[i] > 2.5 * dC[i]], len(fr)


def windows(hits, n):
    wins = []
    for i in sorted(hits):
        if wins and i - wins[-1][1] <= 2 * NW: wins[-1][1] = i
        else: wins.append([i, i])
    return [(a, b, max(0, a - NW), min(n - 1, b + NW - 1)) for a, b in wins if a >= NW and b <= n - NW]   # у начала и конца главы — стыки, их ведёт wideSeam


def run(d, out, wins, n):
    side = np.ones(W, bool); side[CX0:CX1] = False; sz = W * H * 3
    dec = subprocess.Popen(['ffmpeg', '-v', 'error', *src_args(d), '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
    enc = subprocess.Popen([FF, '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', '30', '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast',
                            '-crf', '18', '-pix_fmt', 'yuv420p', out], stdin=subprocess.PIPE)
    wi, held, f = 0, [], 0
    while True:
        buf = dec.stdout.read(sz)
        if len(buf) < sz: break
        if wi < len(wins) and wins[wi][2] <= f <= wins[wi][3]:
            held.append(buf)
            if f == wins[wi][3]:   # окно набрано: «до» = кадр a−1, «после» = кадр b
                a, b, f0, f1 = wins[wi]; fr = lambda i: np.frombuffer(held[i - f0], np.uint8).reshape(H, W, 3)
                pre, post = fr(a - 1)[:, side].astype(np.float32), fr(b)[:, side].astype(np.float32)
                for i in range(f0, f1 + 1):
                    k = (i - f0 + 1) / (f1 - f0 + 2); k = k * k * (3 - 2 * k); x = fr(i).copy(); live = x[:, side].astype(np.float32)
                    x[:, side] = ((1 - k) * (live if i < a else pre) + k * (post if i < b else live) + .5).astype(np.uint8); enc.stdin.write(x.tobytes())
                held, wi = [], wi + 1
        else: enc.stdin.write(buf)
        f += 1
    dec.wait(); enc.stdin.close(); enc.wait()
    if f != n: raise SystemExit(f'{d}: кадров {f} ≠ {n}')


def fix(ep):
    d = os.path.join(HERE, 'out', ep, 'wparts'); out = os.path.join(HERE, 'out', ep, 'video_w.mp4')
    ks = sorted(int(f[1:-4]) for f in os.listdir(d) if f.startswith('p') and f.endswith('.mp4') and '.tmp' not in f)
    open(os.path.join(d, 'list.txt'), 'w').write(''.join(f"file 'p{k}.mp4'\n" for k in ks))
    hits, n = pops(d); wins = windows(hits, n)
    if wins: run(d, out, wins, n)
    else: subprocess.run(['ffmpeg', '-y', '-v', 'error', *src_args(d), '-c', 'copy', out], check=True)
    if os.environ.get('WF_KEEP') != '1':
        for k in ks: os.remove(os.path.join(d, f'p{k}.mp4'))
    print(ep, f'кадров {n}, сглажено окон: {len(wins)}', [f'{a / 30:.2f}–{b / 30:.2f} с' for a, b, *_ in wins])


if __name__ == '__main__':
    for ep in sys.argv[1:]: fix(ep)
