#!/usr/bin/env python3
"""130 моментов Боба: данные + нарезка + превью.
python3 make_clips.py [--only 001,002] [--no-cut] [--crf 18] [--out out]
"""
import json, os, subprocess, sys, importlib.util, math
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
REF = '/tmp/claude-0/-home-user-mein-deutsch/bf28a988-a9ef-5d0c-968e-5904c7d80ec8/scratchpad/ref'
VIDS = ['santa', 'cola', 'google', 'insta', 'apple', 'starbucks', 'davinci', 'wot', 'mdk', 'tinder', 'madonna', 'sobolev', 'hovan']
VNAME = {'santa': 'Сатана Клаус', 'cola': 'Coca-Cola', 'google': 'Google', 'insta': 'Instagram', 'apple': 'Apple',
         'starbucks': 'Starbucks', 'davinci': 'Леонардо Да Винчи', 'wot': 'World of Tanks', 'mdk': 'MDK',
         'tinder': 'Tinder', 'madonna': 'Мадонна', 'sobolev': 'Соболев', 'hovan': 'Хованский'}
FPS = {'santa': 25, 'cola': 30, 'google': 25, 'insta': 30, 'apple': 25, 'starbucks': 25, 'davinci': 25,
       'wot': 25, 'mdk': 25, 'tinder': 30, 'madonna': 30, 'sobolev': 30, 'hovan': 30}
PAD = 0.3

args = sys.argv[1:]
def opt(name, default=None):
    if name in args:
        i = args.index(name)
        return args[i + 1]
    return default
OUT = os.path.join(HERE, opt('--out', 'out'))
CRF = opt('--crf', '18')
ONLY = set(opt('--only', '').split(',')) - {''}
NOCUT = '--no-cut' in args

spec = importlib.util.spec_from_file_location('rate', os.path.join(HERE, 'rate.py'))
rate = importlib.util.module_from_spec(spec); spec.loader.exec_module(rate)
R = rate.R

motion = json.load(open(os.path.join(HERE, 'motion.json')))

rows = []
for line in open(os.path.join(HERE, 'notes.txt'), encoding='utf-8'):
    line = line.rstrip('\n')
    if not line.strip() or line.startswith('#'):
        continue
    v, a, b, k, n, w = line.split('|', 5)
    key = f'{v}@{float(a):.1f}'
    if key not in R:
        continue
    sc, d, why, ours, want = R[key]
    rows.append(dict(v=v, a=float(a), b=float(b), k=k, n=n, w=w, s=sc, d=d, why=why, ours=ours, want=want))

rows.sort(key=lambda r: (VIDS.index(r['v']), r['a']))
assert len(rows) == 130, len(rows)

def tc(t):
    m = int(t // 60); s = t - 60 * m
    return f'{m}:{s:04.1f}'

for i, r in enumerate(rows, 1):
    fps = FPS[r['v']]
    dur = motion[r['v']]['dur']
    f0 = max(0, round((r['a'] - PAD) * fps))           # первый кадр клипа (номер кадра в исходнике)
    f1 = min(int(dur * fps), round((r['b'] + PAD) * fps))
    r.update(id=f'{i:03d}', vn=VNAME[r['v']], fps=fps, f0=f0, nf=f1 - f0,
             t0=f0 / fps, tc=f"{tc(r['a'])}–{tc(r['b'])}",
             ca=round(r['a'] - f0 / fps, 3), cb=round(r['b'] - f0 / fps, 3),
             file=f'bob_fx_clips/fx_{i:03d}.mp4')

os.makedirs(os.path.join(OUT, 'bob_fx_clips'), exist_ok=True)
os.makedirs(os.path.join(OUT, 'th'), exist_ok=True)

def cut(r):
    if ONLY and r['id'] not in ONLY:
        return r['id'], 'skip'
    src = os.path.join(REF, r['v'] + '.mp4')
    dst = os.path.join(OUT, r['file'])
    seek = max(0.0, (r['f0'] - 0.5) / r['fps'])
    cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', f'{seek:.4f}', '-i', src, '-map', '0:v:0',
           '-frames:v', str(r['nf']), '-c:v', 'libx264', '-crf', CRF, '-preset', 'fast',
           '-pix_fmt', 'yuv420p', '-g', '12', '-fps_mode', 'cfr', '-r', str(r['fps']),
           '-an', '-movflags', '+faststart', dst]
    subprocess.run(cmd, check=True)
    # превью — кадр на 55 % «ядра» момента
    tt = r['ca'] + 0.55 * (r['cb'] - r['ca'])
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{tt:.3f}', '-i', dst, '-frames:v', '1',
                    '-vf', 'scale=192:108', '-q:v', '3', os.path.join(OUT, 'th', r['id'] + '.jpg')], check=True)
    return r['id'], 'ok'

if not NOCUT:
    with ThreadPoolExecutor(4) as ex:
        for rid, st in ex.map(cut, rows):
            if st == 'ok':
                print(rid, end=' ', flush=True)
    print()

# проверка: длина и размер
tot = 0
for r in rows:
    p = os.path.join(OUT, r['file'])
    if not os.path.exists(p):
        continue
    o = subprocess.run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v:0',
                        '-show_entries', 'stream=nb_read_frames,duration', '-of', 'csv=p=0', p],
                       capture_output=True, text=True).stdout.strip().split(',')
    r['dur'] = round(float(o[0]), 3); r['frames'] = int(o[1])
    r['kb'] = os.path.getsize(p) // 1024
    tot += r['kb']
print('всего МБ', round(tot / 1024, 1))

# спрайт превью 10×13
if not NOCUT and not ONLY:
    lst = os.path.join(OUT, 'th', 'list.txt')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', '1', '-start_number', '1', '-i', os.path.join(OUT, 'th', '%03d.jpg'),
                    '-vf', 'tile=10x13', '-frames:v', '1', '-q:v', '4', os.path.join(OUT, 'thumbs.jpg')],
                   check=True, cwd=OUT)

keep = ['id', 'v', 'vn', 'k', 'n', 'w', 's', 'd', 'why', 'ours', 'want', 'a', 'b', 'tc', 'fps', 'ca', 'cb', 'file', 'dur', 'frames', 'kb']
json.dump([{k: r.get(k) for k in keep} for r in rows], open(os.path.join(OUT, 'fx130.json'), 'w', encoding='utf-8'),
          ensure_ascii=False, indent=0)
print('json ok')
