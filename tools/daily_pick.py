#!/usr/bin/env python3
"""13.9.17: «Фраза дня» от бота — подбор фраз → data/daily.json ({DAILY:[{sid,pi,n,film,en,ru,use,clip}]}).
Короткие активные фразы английских сцен (без 18+), 2–9 слов, по очереди из разных сцен.
Ролики режет tools/daily_cut.py → ../scenes/_daily/NNN.mp4 (потом tools/r2_up.py _daily).
Запуск из корня репо: python3 tools/daily_pick.py [сколько=60]"""
import json, os, sys, re, random
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
N = int(sys.argv[1]) if len(sys.argv) > 1 else 60
S = json.load(open(os.path.join(root, 'data', 'scenes.json'), encoding='utf-8'))['SCENES']
T = json.load(open(os.path.join(root, 'data', 'topics.json'), encoding='utf-8'))['TOPICS']
GOOD = {'общение', 'эмоции', 'ссоры', 'работа', 'деньги', 'свидание', 'знакомство', 'быт', 'кафе и магазин', 'телефон и планы', 'здоровье'}
by = []
for s in S:
    if s.get('lang') == 'de' or s.get('age'):
        continue
    L = []
    for pi, p in enumerate(s['parts']):
        for n, f in enumerate(p['ph']):
            if f.get('passive') or not f.get('use') or not f.get('ru'):
                continue
            w = re.findall(r"[A-Za-z']+", f['en'])
            d = f['b'] - f['a']
            if not (2 <= len(w) <= 9) or not (0.6 <= d <= 6.5):
                continue
            tp = set(T.get(f"{s['id']}|{f['en']}", []))
            score = len(tp & GOOD) * 2 - abs(len(w) - 5) * 0.3 + (1 if f.get('fact') else 0)
            L.append((score, pi, n, f))
    L.sort(key=lambda x: -x[0])
    if L:
        by.append((s, L[:4]))
random.Random(13917).shuffle(by)
out, k = [], 0
while len(out) < N and any(L for _, L in by):
    for s, L in by:
        if L and len(out) < N:
            _, pi, n, f = L.pop(0)
            out.append({'sid': s['id'], 'pi': pi, 'n': n, 'film': s.get('show') or s.get('title'), 'en': f['en'], 'ru': f['ru'],
                        'use': f['use'], 'clip': 'scenes/_daily/%s_%d_%d.mp4' % (s['id'], pi, n)})
json.dump({'DAILY': out}, open(os.path.join(root, 'data', 'daily.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print('фраз:', len(out), 'сцен:', len({x['sid'] for x in out}))
for x in out[:12]:
    print(x['clip'].split('/')[-1], x['sid'], '|', x['en'], '—', x['ru'])
