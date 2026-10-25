#!/usr/bin/env python3
# 25.10 — петля для живого портрета героя Deadlock (Flow «Кадры в видео»: первый и последний кадр = арт 16:9).
# В приложении портрет крутится по кругу (<video loop>), конец файла должен незаметно переходить в начало.
#   python3 tools/hero_loop.py <ролик.mp4> <выход.mp4> [--fade 0.4] [--w 1280] [--crf 20] [--map]
# 1. Начало и конец: пара самых похожих кадров — начало в первые 0.5 с, конец в последних 40 % ролика (Flow часто
#    приходит к арту чуть раньше конца, а последние кадры стоят или плывут; первый кадр бывает рывком) — режу по ним.
# 2. Шов: конец ≈ начало — режу без наплыва; иначе хвост наплывом в голову (--fade, 0.4 с): выход = [S+fade … E−fade]
#    + наплыв([E−fade … E] → [S … S+fade]); последний кадр выхода переходит в первый, как соседние кадры ролика.
#    Ping-pong (вперёд-назад) не делаю никогда — видно, что движение пошло задом.
# 3. Печатаю: разницу на шве и обычный шаг между кадрами (0–255, серый 64×36). Шов не больше обычных шагов ролика — не видно.
#    «Почти не двигается» — ролик стоит картинкой, генерить заново.
# --map — карта движения <выход>m.jpg: кадр серым, красным — где что-то двигалось. Так видно, ожила ли каждая крыса,
#    птица и т. п. из промта (если на месте крысы нет красного — она простояла картинкой).
# Выход: H.264 high, CRF 20, без звука, faststart, ширина ≤ 1280 (16:9 → 1280×720), + превью <выход>p.jpg.
import sys, json, subprocess, argparse
import numpy as np

def probe(p):
    j = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-count_frames',
        '-show_entries', 'stream=width,height,r_frame_rate,nb_read_frames', '-of', 'json', p],
        capture_output=True, text=True).stdout)['streams'][0]
    a, b = j['r_frame_rate'].split('/')
    return j['width'], j['height'], float(a) / float(b), int(j['nb_read_frames'])

def frames(p, w, h):
    raw = subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-i', p, '-vf', f'scale={w}:{h},format=gray',
        '-vsync', '0', '-f', 'rawvideo', '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, h, w).astype(np.float32)

def dif(a, b): return float(np.abs(a - b).mean())

def stats(F):
    st = [dif(F[i], F[i + 1]) for i in range(len(F) - 1)]
    return float(np.median(st)) if st else 0.0, dif(F[-1], F[0])

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('src'); ap.add_argument('out')
    ap.add_argument('--fade', type=float, default=0.4)
    ap.add_argument('--w', type=int, default=1280)
    ap.add_argument('--crf', type=int, default=20)
    ap.add_argument('--map', action='store_true')
    a = ap.parse_args()
    W, H, fps, N = probe(a.src)
    F = frames(a.src, 64, 36)
    N = len(F)
    step, _ = stats(F)
    # начало S — в первые 0.5 с (первый кадр бывает вспышкой/рывком), конец E — в последних 40 %: пара самых похожих кадров
    ss = range(0, max(1, min(int(fps * 0.5), N // 10)))
    ee = range(max(int(N * 0.6), 1), N)
    P = {(i, j): dif(F[i], F[j]) for i in ss for j in ee}
    dmin = min(P.values())
    S, E = max((k for k, v in P.items() if v <= dmin + max(0.3, step * 0.5)), key=lambda k: k[1] - k[0])  # из почти лучших — петля длиннее
    dE = P[(S, E)]
    hard = dE <= max(1.5, step * 1.5)
    fd = 0 if hard else max(2, round(a.fade * fps))
    if not hard and E - S - 2 * fd < fps * 2: fd = max(2, int((E - S - fps * 2) // 2))
    sw = min(a.w, W) // 2 * 2
    sc = f'scale={sw}:-2:flags=lanczos,format=yuv420p'
    if hard:
        fc = f'[0:v]trim=start_frame={S}:end_frame={E},setpts=PTS-STARTPTS,{sc}[o]'
    else:
        fc = (f'[0:v]split=3[x][y][z];'
              f'[x]trim=start_frame={S + fd}:end_frame={E - fd},setpts=PTS-STARTPTS[A];'
              f'[y]trim=start_frame={E - fd}:end_frame={E},setpts=PTS-STARTPTS[B];'
              f'[z]trim=start_frame={S}:end_frame={S + fd},setpts=PTS-STARTPTS[C];'
              f'[B][C]xfade=transition=fade:duration={fd / fps:.4f}:offset=0[BC];'
              f'[A][BC]concat=n=2:v=1:a=0,{sc}[o]')
    subprocess.run(['ffmpeg', '-nostdin', '-y', '-v', 'error', '-i', a.src, '-filter_complex', fc, '-map', '[o]', '-an',
        '-c:v', 'libx264', '-preset', 'slow', '-profile:v', 'high', '-crf', str(a.crf), '-movflags', '+faststart', a.out], check=True)
    base = a.out.rsplit('.', 1)[0]
    subprocess.run(['ffmpeg', '-nostdin', '-y', '-v', 'error', '-i', a.out, '-frames:v', '1', '-q:v', '3', base + 'p.jpg'], check=True)
    G = frames(a.out, 64, 36)
    st2, seam = stats(G)
    gs = [dif(G[i], G[i + 1]) for i in range(len(G) - 1)]
    top = float(np.percentile(gs, 95))  # шов не должен выделяться среди шагов самого ролика (вспышка выстрела — тоже шаг)
    ok = seam <= max(2.0, st2 * 2, top * 1.2)
    mv = float(np.std(G, axis=0).mean())
    print(f'вход: {W}×{H}, {N} кадров, {fps:g} к/с · петля: кадры {S}–{E} ({S / fps:.2f}–{E / fps:.2f} с), отличие конца от начала {dE:.2f}')
    print(f'выход: {a.out} · {len(G)} кадров ({len(G) / fps:.2f} с) · {"без наплыва" if hard else f"наплыв {fd} кадров"}')
    print(f'шов {seam:.2f} при обычном шаге {st2:.2f} (резкие шаги ролика до {top:.2f}) — {"не видно ✓" if ok else "ВИДНО — смотри глазами, попробуй --fade 0.6"}')
    if mv < 1.2: print(f'ВНИМАНИЕ: почти не двигается (движение {mv:.2f}) — ролик стоит картинкой')
    if a.map:
        M = frames(a.out, 320, 180)
        s = np.std(M, axis=0)
        s = np.clip(s / max(np.percentile(s, 99.5), 1e-3), 0, 1)
        g = M[0] * 0.55
        rgb = np.stack([np.clip(g + s * 255, 0, 255), g * (1 - s * 0.6), g * (1 - s * 0.6)], -1).astype(np.uint8)
        subprocess.run(['ffmpeg', '-nostdin', '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '320x180',
            '-i', '-', '-vf', 'scale=960:540:flags=neighbor', '-q:v', '3', base + 'm.jpg'], input=rgb.tobytes(), check=True)
        print(f'карта движения: {base}m.jpg')
    sys.exit(0 if ok else 2)

if __name__ == '__main__':
    main()
