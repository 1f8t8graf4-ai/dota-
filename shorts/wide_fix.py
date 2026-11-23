#!/usr/bin/env python3
"""23.11: 16:9 — сглаживает «скачки боков»: при нырке в предмет центр кадра непрерывный, а бока резко меняются
(предмет закрыл вертикальный кадр — и заливка мира за ним стала на всю ширину, или сменился мир).
Находит такие кадры в out/<ролик>/wparts/pK.mp4 и за ±0,27 с плавно растворяет бока: до скачка → после (центр не трогает).
Кусок с правкой пережимается целиком (crf 18), потом video_w.mp4 склеивается заново.
  python3 wide_fix.py <ролик> [<ролик> …]   (повторно — уже правленные куски, wparts/pK.fixed, не трогает)"""
import os, subprocess, sys, json
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); W, H = 2560, 1440; CX0, CX1 = 875, 1685; NW = 8   # ±8 кадров
FF = os.environ.get('FFMPEG', 'ffmpeg')


def lowres(p, w=320, h=180):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vf', f'scale={w}:{h}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, h, w, 3).astype(np.float32)


def pops(p):
    fr = lowres(p); w = fr.shape[2]; c0, c1 = int(w * CX0 / W), int(w * CX1 / W)
    L = fr[:, :, :int(w * .25)].mean((1, 2)); R = fr[:, :, int(w * .75):].mean((1, 2)); C = fr[:, :, c0:c1].mean((1, 2))
    dS = np.maximum(np.abs(np.diff(L, axis=0)).max(1), np.abs(np.diff(R, axis=0)).max(1)); dC = np.abs(np.diff(C, axis=0)).max(1)
    return [i + 1 for i in range(len(dS)) if dS[i] > 14 and dS[i] > 2.5 * dC[i]], len(fr)


def frame_at(p, i):   # один кадр куска по номеру, в полном размере
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vf', f'select=eq(n\\,{i})', '-vsync', '0', '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(H, W, 3)


def fix_part(p, hits, n):
    wins = []   # близкие скачки — одним окном
    for i in sorted(hits):
        if wins and i - wins[-1][1] <= 2 * NW: wins[-1][1] = i
        else: wins.append([i, i])
    side = np.ones(W, bool); side[CX0:CX1] = False; plan = {}
    for a, b in wins:
        f0, f1 = max(0, a - NW), min(n - 1, b + NW - 1)
        pre, post = frame_at(p, a - 1)[:, side].astype(np.float32), frame_at(p, b)[:, side].astype(np.float32)
        for f in range(f0, f1 + 1):   # до скачка — живые бока → «после»; между скачками — «до» → «после»; после — «до» → живые бока
            k = (f - f0 + 1) / (f1 - f0 + 2); plan[f] = (pre if f >= a else None, post if f < b else None, k * k * (3 - 2 * k))
    tmp = p + '.tmp.mp4'; sz = W * H * 3
    dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', p, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
    enc = subprocess.Popen([FF, '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', '30', '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast',
                            '-crf', '18', '-pix_fmt', 'yuv420p', tmp], stdin=subprocess.PIPE)
    f = 0
    while True:
        buf = dec.stdout.read(sz)
        if len(buf) < sz: break
        if f in plan:
            fr = np.frombuffer(buf, np.uint8).reshape(H, W, 3).copy(); pre, post, k = plan[f]; live = fr[:, side].astype(np.float32)
            fr[:, side] = ((1 - k) * (live if pre is None else pre) + k * (live if post is None else post) + .5).astype(np.uint8); buf = fr.tobytes()
        enc.stdin.write(buf); f += 1
    dec.wait(); enc.stdin.close(); enc.wait()
    if f != n: raise SystemExit(f'{p}: кадров {f} ≠ {n}')
    os.replace(tmp, p); return wins


def fix(ep):
    d = os.path.join(HERE, 'out', ep, 'wparts'); ks = sorted(int(f[1:-4]) for f in os.listdir(d) if f.startswith('p') and f.endswith('.mp4') and '.tmp' not in f)
    rep = {}
    for k in ks:
        p = os.path.join(d, f'p{k}.mp4')
        if os.path.exists(p[:-4] + '.fixed'): continue
        hits, n = pops(p)
        hits = [i for i in hits if NW <= i <= n - NW]   # у края куска — не трогаем (там стыки кусков ровные)
        if hits: rep[k] = fix_part(p, hits, n); open(p[:-4] + '.fixed', 'w').write(json.dumps(rep[k]))
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', os.path.join(d, 'list.txt'), '-c', 'copy', os.path.join(HERE, 'out', ep, 'video_w.mp4')], check=True)
    print(ep, 'сглажено:', {k: [[a / 30 + k * 12, b / 30 + k * 12] for a, b in v] for k, v in rep.items()} or 'нечего')


if __name__ == '__main__':
    for ep in sys.argv[1:]: fix(ep)
