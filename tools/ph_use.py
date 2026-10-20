#!/usr/bin/env python3
"""13.9.43: польза фразы и кому она — в data/scenes.json.
Вход: папка с <сцена>.jsonl, строка = {"id":"сцена#эпизод.фраза","u":0-3,"g":[work|travel|films|move|self],"x":"выражение","why":"…"}.
  u — 3 универсальная, 2 полезная (кому — g), 1 только понимать (мат, сленг), 0 бесполезная → passive.
  x — кусок фразы, который стоит запомнить («Собери выражение»), дословно из фразы.
Поля у фразы: u, g, x (x — только если найден во фразе и не длиннее 6 слов).
Запуск: python3 tools/ph_use.py <папка> [--dry]  → потом python3 tools/rebuild_all_data.py"""
import json, os, sys, glob, re
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = sys.argv[1]; dry = '--dry' in sys.argv
path = os.path.join(root, 'data', 'scenes.json')
D = json.load(open(path, encoding='utf-8'))
R = {}
for f in glob.glob(os.path.join(src, '*.jsonl')):
    for l in open(f, encoding='utf-8'):
        if l.strip():
            r = json.loads(l); R[r['id']] = r
n = {'set': 0, 'x': 0, 'x_drop': 0, 'passive': 0, 'miss': 0}
for s in D['SCENES']:
    de = s.get('lang') == 'de'
    for pi, p in enumerate(s['parts']):
        for k, f in enumerate(p['ph']):
            r = R.get(f"{s['id']}#{pi}.{k}")
            if not r: n['miss'] += 1; continue
            f['u'] = r['u']; f['g'] = r['g']; n['set'] += 1
            t = (f.get('de') if de else f.get('en')) or ''
            x = (r.get('x') or '').strip().rstrip('.!?,')
            f.pop('x', None)
            if x and x.lower() in t.lower() and len(x.split()) <= 6: f['x'] = x; n['x'] += 1
            elif x: n['x_drop'] += 1
            if r['u'] == 0 and not f.get('passive'): f['passive'] = True; n['passive'] += 1
print(n)
if not dry:
    json.dump(D, open(path, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
