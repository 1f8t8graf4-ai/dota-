#!/usr/bin/env python3
"""Пересобрать data/all-data.js из всех data/*.json (нужно после ЛЮБОЙ правки JSON).
Запуск из корня репо:  python3 tools/rebuild_all_data.py"""
import json, glob, os
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = os.path.join(root, 'data', 'all-data.js')
d = {}
# старые ключи из all-data.js (на случай, если какого-то JSON нет в репо)
if os.path.exists(out):
    t = open(out, encoding='utf-8').read()
    d.update(json.loads(t[t.index('{'):t.rindex('}') + 1]))
for p in sorted(glob.glob(os.path.join(root, 'data', '*.json'))):
    d.update(json.load(open(p, encoding='utf-8')))
open(out, 'w', encoding='utf-8').write('/* Все данные одним файлом — для запуска index.html двойным кликом. */\nwindow.__DATA_ALL=' + json.dumps(d, ensure_ascii=False, separators=(',', ':')) + ';\n')
print('all-data.js:', len(d), 'ключей')
