# -*- coding: utf-8 -*-
# Инвентарь слов реплик (для задачи ctx): уникальные слова + частоты + примеры реплик.
# Слова из games.json (main) + games-new.json (ветка zai/dd-lines, чтение через git show).
import json, re, subprocess, sys, io
from collections import Counter

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

new_raw = subprocess.run(['git', 'show', 'origin/zai/dd-lines:data/games-new.json'],
                         capture_output=True, text=True, encoding='utf-8').stdout
lines = {}  # a -> en

def walk(o):
    if isinstance(o, dict):
        if 'a' in o and isinstance(o.get('a'), str) and 'deadlock' in o['a'] and o.get('en'):
            lines[o['a']] = o['en']
        for v in o.values():
            walk(v)
    elif isinstance(o, list):
        for x in o:
            walk(x)

walk(json.loads(new_raw))
walk(json.load(open('data/games.json', encoding='utf-8')))
print('реплик:', len(lines))

def words(en):
    out = []
    for w in en.split():
        for part in w.split('-'):
            part = re.sub(r"[^A-Za-z'’]+", '', part).replace('’', "'").lower()
            if part:
                out.append(part)
    return out

cnt = Counter()
where = {}
for a, en in lines.items():
    for w in set(words(en)):
        cnt[w] += 1
        where.setdefault(w, en)
print('уникальных слов:', len(cnt))
print('--- частые (>=8):')
for w, c in cnt.most_common():
    if c >= 8:
        print('%4d %-16s | %s' % (c, w, where[w][:60]))
print('--- редкие (1-2 раза):', sum(1 for c in cnt.values() if c <= 2))
json.dump(dict(lines=lines, cnt=dict(cnt.most_common())), open('ctx-inventory.json', 'w'), ensure_ascii=False, indent=0)
