#!/usr/bin/env python3
"""195 приёмов Боба (списки Gemini 15.11: 130 + ещё 65, сверены по кадрам): нарезка клипов + fx195.json.
python3 make_clips.py [--only 001,002] [--no-cut] [--crf 20] [--out out]
Исходник списка — bob195.json (id, ролик, a–b, теги, что в кадре, техника, применение, оценка, сложность, 🔥 из списка).
"""
import json, os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
REF = os.environ.get('BOB_REF', '/tmp/claude-0/-home-user-mein-deutsch/bf28a988-a9ef-5d0c-968e-5904c7d80ec8/scratchpad/ref')
VNAME = {'cola': 'Coca-Cola', 'starbucks': 'Starbucks', 'santa': 'Сатана Клаус', 'google': 'Google', 'apple': 'Apple',
         'insta': 'Instagram', 'davinci': 'Леонардо Да Винчи', 'wot': 'World of Tanks', 'mdk': 'MDK', 'tinder': 'Tinder',
         'madonna': 'Мадонна', 'sobolev': 'Соболев', 'hovan': 'Хованский'}
FPS = {'santa': 25, 'cola': 30, 'google': 25, 'insta': 30, 'apple': 25, 'starbucks': 25, 'davinci': 25,
       'wot': 25, 'mdk': 25, 'tinder': 30, 'madonna': 30, 'sobolev': 30, 'hovan': 30}
PAD = 0.3

args = sys.argv[1:]
def opt(name, default=None):
    return args[args.index(name) + 1] if name in args else default
OUT = os.path.join(HERE, opt('--out', 'out'))
CRF = opt('--crf', '20')
ONLY = set(opt('--only', '').split(',')) - {''}
NOCUT = '--no-cut' in args

rows = json.load(open(os.path.join(HERE, 'bob195.json'), encoding='utf-8'))
assert len(rows) == 195 and [r['id'] for r in rows] == [f'{i:03d}' for i in range(1, 196)]
DUR = {}
def vdur(v):
    if v not in DUR:
        DUR[v] = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0',
                                       os.path.join(REF, v + '.mp4')], capture_output=True, text=True).stdout)
    return DUR[v]
def tc(t):
    m = int(t // 60); return f'{m}:{t - 60 * m:04.1f}'
for r in rows:
    fps = FPS[r['v']]
    f0 = max(0, round((r['a'] - PAD) * fps))
    f1 = min(int(vdur(r['v']) * fps), round((r['b'] + PAD) * fps))
    r.update(vn=VNAME[r['v']], fps=fps, f0=f0, nf=f1 - f0, tc=f"{tc(r['a'])}–{tc(r['b'])}",
             ca=round(r['a'] - f0 / fps, 3), cb=round(r['b'] - f0 / fps, 3), file=f"bob_fx_clips/fx_{r['id']}.mp4")

os.makedirs(os.path.join(OUT, 'bob_fx_clips'), exist_ok=True)
def cut(r):
    if ONLY and r['id'] not in ONLY:
        return r['id'], 'skip'
    seek = max(0.0, (r['f0'] - 0.5) / r['fps'])
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{seek:.4f}', '-i', os.path.join(REF, r['v'] + '.mp4'), '-map', '0:v:0',
                    '-frames:v', str(r['nf']), '-c:v', 'libx264', '-crf', CRF, '-preset', 'slow', '-pix_fmt', 'yuv420p', '-g', '12',
                    '-fps_mode', 'cfr', '-r', str(r['fps']), '-an', '-movflags', '+faststart', os.path.join(OUT, r['file'])], check=True)
    return r['id'], 'ok'
if not NOCUT:
    with ThreadPoolExecutor(4) as ex:
        for rid, st in ex.map(cut, rows):
            if st == 'ok': print(rid, end=' ', flush=True)
    print()
tot = 0
for r in rows:
    p = os.path.join(OUT, r['file'])
    if not os.path.exists(p): continue
    o = subprocess.run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_frames,duration',
                        '-of', 'csv=p=0', p], capture_output=True, text=True).stdout.strip().split(',')
    r['dur'] = round(float(o[0]), 3); r['frames'] = int(o[1]); r['kb'] = os.path.getsize(p) // 1024; tot += r['kb']
print('всего МБ', round(tot / 1024, 1), 'самый большой КБ', max(r.get('kb', 0) for r in rows))
keep = ['id', 'v', 'vn', 'tags', 'n', 'w', 'tech', 'ours', 's', 'd', 'hot', 'x', 'a', 'b', 'tc', 'fps', 'ca', 'cb', 'file', 'dur', 'frames', 'kb']
json.dump([{k: r.get(k) for k in keep} for r in rows], open(os.path.join(OUT, 'fx195.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print('json ok')
