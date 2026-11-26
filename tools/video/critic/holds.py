#!/usr/bin/env python3
"""Стоп-кадры: где картинка стоит дольше 3 одинаковых кадров подряд (правило «не больше 3»).

  python3 tools/video/critic/holds.py ролик.mp4            # список мест и итог
  python3 tools/video/critic/holds.py ролик.mp4 --max 3 --thr 0.15 --json

Кадры сравниваются в сером 160 px по ширине: средняя разница яркости меньше --thr (из 255) —
кадры считаются одинаковыми. Выход 1, если есть стоп больше --max кадров.
Короткий «держим кадр на ударе» по замыслу — допустим: смотри глазами, это подсказка, а не приговор.
"""
import argparse, json, subprocess, sys
import numpy as np


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('video')
    ap.add_argument('--max', type=int, default=3)
    ap.add_argument('--thr', type=float, default=0.15)
    ap.add_argument('--json', action='store_true')
    a = ap.parse_args()
    pr = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=r_frame_rate',
                         '-of', 'csv=p=0', a.video], capture_output=True, text=True).stdout.strip().strip(',')
    n, d = (pr.split('/') + ['1'])[:2]
    fps = float(n) / float(d or 1)
    W, H = 160, 284
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-nostdin', '-i', a.video, '-vf', f'scale={W}:{H},format=gray',
                          '-f', 'rawvideo', '-'], capture_output=True).stdout
    f = np.frombuffer(raw, np.uint8)
    f = f[:len(f) // (W * H) * W * H].reshape(-1, H, W).astype(np.int16)
    diff = np.abs(np.diff(f, axis=0)).mean((1, 2))
    same = diff < a.thr
    runs, i = [], 0
    while i < len(same):
        if same[i]:
            j = i
            while j < len(same) and same[j]:
                j += 1
            if j - i + 1 > a.max:
                runs.append({'t0': round(i / fps, 2), 't1': round(j / fps, 2), 'frames': j - i + 1})
            i = j
        else:
            i += 1
    tot = sum(r['frames'] for r in runs) / fps
    if a.json:
        print(json.dumps({'fps': fps, 'holds': runs, 'held_s': round(tot, 2)}, ensure_ascii=False))
    else:
        for r in runs:
            print(f"  стоит {r['t0']:.2f}–{r['t1']:.2f} c  ({r['frames']} кадров)")
        print(f'стоп-кадров больше {a.max}: {len(runs)}, всего {tot:.1f} c из {len(f) / fps:.1f} c')
    sys.exit(1 if runs else 0)


if __name__ == '__main__':
    main()
