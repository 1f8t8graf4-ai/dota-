# ищет спокойные отрезки в эпизодах: без склеек, мало движения, не тёмные
import subprocess, numpy as np, json, os, sys, glob
D = os.environ.get('BGF', os.getcwd())  # рабочая папка: vid/<сцена>__NN.mp4, сюда же пишутся json, out/, loops/
W, H, FPS, WIN = 96, 54, 5, 4.0
def frames(p):
    cmd = ['ffmpeg', '-v', 'error', '-i', p, '-vf', f'fps={FPS},scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'gray', '-']
    b = subprocess.run(cmd, capture_output=True).stdout
    return np.frombuffer(b, np.uint8).reshape(-1, H, W).astype(np.float32)
res = {}
for p in sorted(glob.glob(D + '/vid/*.mp4')):
    name = os.path.basename(p)[:-4]
    F = frames(p)
    if len(F) < FPS * WIN + 2: continue
    # полосы: строки, тёмные во всём ролике
    rows = F.mean(axis=(0, 2)); keep = np.where(rows > 16)[0]
    t0, t1 = (keep[0], keep[-1] + 1) if len(keep) else (0, H)
    G = F[:, t0:t1]
    d = np.abs(np.diff(G, axis=0)).mean(axis=(1, 2))          # движение между кадрами
    cut = d > max(18, np.median(d) * 6)
    n = int(FPS * WIN); out = []
    for i in range(0, len(d) - n, 2):
        if cut[i:i + n].any(): continue
        seg = G[i:i + n + 1]
        br, ct = seg.mean(), seg.std()
        if br < 28 or ct < 18: continue                        # слишком тёмно / плоско
        mot = d[i:i + n].mean()
        out.append(dict(t=round(i / FPS, 1), mot=round(float(mot), 2), br=round(float(br)), ct=round(float(ct)), bar=[int(t0), int(t1)]))
    res[name] = dict(dur=round(len(F) / FPS, 1), win=out)
    print(name, len(F) / FPS, len(out), file=sys.stderr)
json.dump(res, open(D + '/calm.json', 'w'))
