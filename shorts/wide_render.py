#!/usr/bin/env python3
"""23.11: глава фильма в 16:9 (2560×1440) — тот же код рисовки, ep/wide.js (WIDE=1).
Куски по 12 с → out/<ролик>/wparts/pK.mp4 → out/<ролик>/video_w.mp4 (вертикальный video.mp4 не трогаем).
EN/DE глав 1–2 — время кадров по кривой tmap.json (как в l10n/dub.py render). Звук не нужен: фильм берёт голос и звуки глав.
  python3 wide_render.py <ролик> [<ролик> …]   (прерванный рендер продолжает с места: wparts/pK.done)"""
import json, os, re, subprocess, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
BUNDLE = {'v210': 'ep/v210/00-core.js ep/v200/05-kit.js ep/v200/12-cam.js ep/v200/15-props.js ep/v210/[1-9]*.js',
          'v220': 'ep/v220/00-core.js ep/v200/05-kit.js ep/v200/12-cam.js ep/v200/15-props.js ep/v220/[1-9]*.js',
          'v200': 'ep/v200/*.js', 'v191': 'ep/v191/*.js'}


def bundle(b):
    cmds = []
    if b == 'v231': cmds.append(re.search(r'cat [^>]*> ep/v231\.js', open(os.path.join(HERE, 'v231_render.sh')).read()).group(0))
    if b == 'v191': cmds.append(f"cat {BUNDLE['v200']} > ep/v200.js")
    if b in BUNDLE: cmds.append(f'cat {BUNDLE[b]} > ep/{b}.js.wtmp && mv ep/{b}.js.wtmp ep/{b}.js')
    for c in cmds: subprocess.run(c, shell=True, cwd=HERE, check=True)
    js = f'ep/{b}.js'; subprocess.run(['node', '-e', f"new Function(require('fs').readFileSync('{js}','utf8'))"], cwd=HERE, check=True)


def render(ep):
    o = os.path.join(HERE, 'out', ep); d = os.path.join(o, 'wparts'); os.makedirs(d, exist_ok=True)
    tl = os.path.join(o, 'timeline.json')
    if not os.path.exists(tl): subprocess.run(['cp', os.path.join(HERE, 'tl', ep + '.json'), tl], check=True)
    T = json.load(open(tl)); dur = np.ceil(T.get('vo_dur', T['dur']) * 30) / 30; n = int(np.ceil(dur / 12))
    bundle(ep[:4])
    env = dict(os.environ, WIDE='1'); env.setdefault('NODE_PATH', subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True).stdout.strip())
    TM = json.load(open(os.path.join(o, 'tmap.json'))) if T.get('warp') else None
    for k in range(n):
        if os.path.exists(os.path.join(d, f'p{k}.done')): continue
        a, b = k * 12, min((k + 1) * 12, dur); e2 = dict(env, OUTF=f'wparts/p{k}.mp4')
        if TM: f = os.path.join(d, f'tmap{k}.json'); json.dump(TM[k * 360:(k + 1) * 360], open(f, 'w')); e2['TMAP'] = f
        else: e2['RANGE'] = f'{a}-{b}'
        subprocess.run(['node', 'capture.mjs', ep, 'video', '30', '3'], cwd=HERE, env=e2, check=True)
        open(os.path.join(d, f'p{k}.done'), 'w').close()
    open(os.path.join(d, 'list.txt'), 'w').write(''.join(f"file 'p{k}.mp4'\n" for k in range(n)))
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', os.path.join(d, 'list.txt'), '-c', 'copy', os.path.join(o, 'video_w.mp4')], check=True)
    print(ep, 'video_w.mp4 готов')


if __name__ == '__main__':
    for ep in sys.argv[1:]: render(ep)
