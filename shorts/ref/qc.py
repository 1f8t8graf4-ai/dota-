import subprocess, sys, numpy as np
v = sys.argv[1]; W, H = 108, 192
def frames(fps):
    b = subprocess.run(['ffmpeg', '-v', 'error', '-i', v, '-vf', f'fps={fps},scale={W}:{H},format=gray', '-f', 'rawvideo', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(b, np.uint8).reshape(-1, H, W).astype(np.float32)
f6 = frames(6); d = np.abs(np.diff(f6, axis=0)).mean(axis=(1, 2))
run = 0; out = []
for i, x in enumerate(d):
    run = run + 1 if x < .15 else 0
    if run == 6: out.append(round((i - 5) / 6, 2))
print('статика >=1 c:', out or 'нет')
f30 = frames(30); d30 = np.abs(np.diff(f30, axis=0)).mean(axis=(1, 2))
print('кадров', len(f30), 'шов 0↔последний:', round(float(np.abs(f30[0] - f30[-1]).mean()), 2))
top = np.argsort(-d30)[:12]; print('скачки:', [(round((i + 1) / 30, 2), round(float(d30[i]), 1)) for i in sorted(top)])
