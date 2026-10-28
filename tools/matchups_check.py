#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Проверка data/matchups.json (задача mu): у каждого совета цитата q должна быть
# дословно в сыром тексте ключа key из локализации игры.
# Локализация: game/citadel/resource/localization/citadel_heroes/citadel_heroes_english.txt
# (SteamDatabase/GameTracking-Deadlock); если файла нет рядом — скачивается.
#   python3 tools/matchups_check.py [путь-к-citadel_heroes_english.txt]
import json, os, re, sys, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')
LOC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'matchups_citadel_heroes_english.txt')
URL = ('https://raw.githubusercontent.com/SteamDatabase/GameTracking-Deadlock/master/'
       'game/citadel/resource/localization/citadel_heroes/citadel_heroes_english.txt')

if not os.path.exists(LOC):
    print('скачиваю локализацию…')
    req = urllib.request.Request(URL, headers={'User-Agent': 'Mozilla/5.0'})
    open(LOC, 'wb').write(urllib.request.urlopen(req, timeout=120).read())

s = open(LOC, encoding='utf-8-sig').read()
kv = {}
for m in re.finditer(r'"([A-Za-z_0-9]+)"\s+"((?:[^"\\]|\\.)*)"', s):
    kv[m.group(1)] = m.group(2)

mu = json.load(open(os.path.join(ROOT, 'data', 'matchups.json'), encoding='utf-8'))
bad, tips, heroes = [], 0, 0
for code, h in mu.items():
    heroes += 1
    for t in h.get('tips', []):
        tips += 1
        raw = kv.get(t['key'])
        if raw is None:
            bad.append('%s: нет ключа %s' % (code, t['key']))
        elif t['q'] not in raw:
            bad.append('%s/%s: цитата не дословная' % (code, t['ab']))
    if not (1 <= len(h.get('tips', [])) <= 3):
        bad.append('%s: советов %d (нужно 1-3)' % (code, len(h.get('tips', []))))
print('героев: %d, советов: %d' % (heroes, tips))
if bad:
    print('ОШИБКИ:')
    for b in bad:
        print(' !', b)
    sys.exit(1)
print('все цитаты дословные, по 1-3 совета на героя ✓')
