#!/usr/bin/env python3
"""Кадры v16.2 для пульта v16.3: 960 px, JPEG. python3 frames163.py"""
import io, os, subprocess
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
SH = '/home/user/dota-/shorts/out'
M = f'{SH}/v162-ru/v162_16x9_master.mp4'
A = f'{SH}/v162a-ru/v162a_16x9_master.mp4'
B = '/home/user/wdyk/deliver162/v16.2_B_TikTok_petlya_16x9.mp4'
SHOTS = {  # имя: (файл, секунда, рамка в 1920×1080 или None)
    'whip': (M, 0.0, None), 'lamps': (M, 1.5, (0, 0, 1280, 720)), 'fruit1': (M, 7.6, None), 'fruit2': (M, 8.4, None),
    'mango': (M, 8.6, None), 'mol': (M, 9.5, None), 'fact': (M, 13.5, None), 'camel': (M, 16.5, None),
    'jump': (M, 25.4, None), 'tube': (M, 27.5, None), 'tags': (M, 30.5, None), 'lab': (M, 33.5, None),
    'softtag': (M, 37.5, None), 'card': (M, 40.5, None), 'gavel': (M, 44.5, None), 'map': (M, 53.5, None),
    'stud': (M, 57.5, None), 'disp': (M, 62.5, None), 'salt': (M, 63.5, None), 'teens': (M, 70.5, None),
    'plates': (M, 75.5, None), 'dark': (M, 84.5, None), 'zoom': (M, 87.4, None), 'cloud': (M, 88.5, None),
    'board': (A, 1.2, None), 'tail': (B, 90.6, None),
}
tot = 0
for k, (f, t, box) in SHOTS.items():
    png = subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(t), '-i', f, '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'],
                         capture_output=True, check=True).stdout
    im = Image.open(io.BytesIO(png)).convert('RGB')
    if box: im = im.crop(box)
    im = im.resize((960, 540), Image.LANCZOS)
    p = os.path.join(HERE, 'img', k + '.jpg'); im.save(p, quality=72, optimize=True, progressive=True); tot += os.path.getsize(p)
print(len(SHOTS), 'кадров,', tot // 1024, 'КБ')
