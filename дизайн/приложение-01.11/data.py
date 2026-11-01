#!/usr/bin/env python3
"""Данные приложения из макетов: 4 фильма пути (Титаник, Волк, Сопрано, Во все тяжкие) —
фразы, субтитры со значениями «тут», время слов; видео — эпизоды, которые можно посмотреть в тесте.
python3 data.py <папка вывода>  → <папка>/data.js и <папка>/v/*.mp4 (+ .webm для проверки в Chromium)"""
import json, os, subprocess, sys
R = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
O = sys.argv[1] if len(sys.argv) > 1 else '/home/user/work/appm/pub'
B = 'https://dota.1f8t8graf4.workers.dev/m/scenes'
S = json.load(open(R + '/data/scenes.json')); S = S['SCENES'] if isinstance(S, dict) else S
CE = json.load(open(R + '/data/ctx-en.json')); CE = CE.get('CTX_EN', CE)
# ключ пути в макетах → сцена и эпизоды с видео
FILMS = {'titanic': ('titanic-boat', [0, 1]), 'wolf': ('wolf-of-wall-street', [2]),
         'sopranos': ('sopranos-s01e01', [1]), 'bb': ('breaking-bad-gus', [1])}
def get(url):
    r = subprocess.run(['curl', '-sfL', '--max-time', '180', url], capture_output=True)
    if r.returncode: raise Exception('curl %d %s' % (r.returncode, url))
    return r.stdout
def ff(*a): subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', *a], check=True)
os.makedirs(O + '/v', exist_ok=True)
out = {}
for key, (sid, play) in FILMS.items():
    s = [x for x in S if x['id'] == sid][0]
    ctx = CE.get(sid, [])
    try: wt = json.loads(get(f'{B}/{sid}/wt.json'))['w']
    except Exception: wt = []
    parts = []
    for i, p in enumerate(s['parts']):
        n = f'{i + 1:02d}'
        ph = []
        for j, f in enumerate(p.get('ph', [])):
            if f.get('passive'): continue
            kw = (f.get('kw') or [[None, None, None]])[0]
            ph.append({'j': j, 'en': f['en'], 'ru': f['ru'], 'a': round(f['a'] - p['a'], 2), 'b': round(f['b'] - p['a'], 2),
                       'use': f.get('use', ''), 'trap': (f.get('trap') or [])[:3], 'x': f.get('x', ''), 'gap': f.get('gap', ''),
                       'kw': [kw[0], kw[2]] if kw and kw[0] else None})
        pt = {'t': p['t'], 'd': round(p['b'] - p['a']), 'fact': p.get('fact', ''), 'ph': ph}
        if i in play:
            vf = f'{O}/v/{sid}-{n}.mp4'
            if not os.path.exists(vf):
                raw = f'/tmp/{sid}-{n}.mp4'
                if not os.path.exists(raw): open(raw, 'wb').write(get(f'{B}/{sid}/{n}.mp4'))
                ff('-i', raw, '-vf', 'scale=-2:480', '-c:v', 'libx264', '-preset', 'slow', '-crf', '28', '-profile:v', 'high',
                   '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '80k', '-ac', '2', '-movflags', '+faststart', vf)
            wb = vf[:-4] + '.webm'
            if not os.path.exists(wb):
                ff('-i', vf, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '42', '-deadline', 'realtime', '-cpu-used', '8', '-c:a', 'libopus', '-b:a', '64k', wb)
            pj = f'{O}/v/{sid}-{n}.jpg'
            if not os.path.exists(pj): ff('-ss', '1.2', '-i', vf, '-frames:v', '1', '-vf', 'scale=-2:360', '-q:v', '5', pj)
            pt['video'] = f'v/{sid}-{n}.mp4'; pt['poster'] = f'v/{sid}-{n}.jpg'
            subs = []
            for k, x in enumerate(s['subs']):
                if x[1] <= p['a'] or x[0] >= p['b']: continue
                c = ctx[k] if k < len(ctx) else None
                subs.append({'a': round(x[0] - p['a'], 2), 'b': round(x[1] - p['a'], 2), 'en': x[2], 'ru': x[3],
                             'here': (c[1] if c else {}), 'xp': (c[2] if c else []), 'g': (c[3] if c and len(c) > 3 else {})})
            pt['subs'] = subs
            pt['wt'] = [[round(w[0] - p['a'], 2), round(w[1] - p['a'], 2), w[2]] for w in wt if p['a'] <= w[0] < p['b']]
        parts.append(pt)
    out[key] = {'sid': sid, 't': s['title'].replace('⁠', ''), 'ep': s.get('ep', ''), 'parts': parts}
open(O + '/data.js', 'w').write('window.APPD=' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n')
tot = sum(os.path.getsize(O + '/v/' + f) for f in os.listdir(O + '/v') if f.endswith(('.mp4', '.jpg')))
print('фильмов', len(out), 'data.js', os.path.getsize(O + '/data.js') // 1024, 'КБ; видео mp4+jpg', tot // 1024, 'КБ')
