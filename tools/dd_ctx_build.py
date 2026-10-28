# -*- coding: utf-8 -*-
# Сборка data/dd-ctx.json (задача ctx): [en, {слово: значение}, [[выражение, перевод, пояснение]], {грамматика}]
# Значения — из tools/dd_ctx_base.py (BASE/NAMES/GRAM/EXPRESSIONS/OVERRIDES).
# Проверка: у каждого слова реплики есть ключ; значения без латиницы/скобок/;, не длиннее 25.
import json, re, subprocess, sys, io, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from dd_ctx_base import BASE, NAMES, GRAM, EXPRESSIONS, OVERRIDES

new_raw = subprocess.run(['git', 'show', 'origin/zai/dd-lines:data/games-new.json'],
                         capture_output=True, text=True, encoding='utf-8').stdout
lines = {}
def walk(o):
    if isinstance(o, dict):
        if isinstance(o.get('a'), str) and 'deadlock' in o['a'] and o.get('en'):
            lines[o['a']] = o['en']
        for v in o.values():
            walk(v)
    elif isinstance(o, list):
        for x in o:
            walk(x)
walk(json.loads(new_raw))
walk(json.load(open('data/games.json', encoding='utf-8')))
print('реплик:', len(lines))

def norm_word(w):
    w = w.replace('’', "'").lower()
    return re.sub(r"[^a-z'']", '', w)

def words_of(en):
    out = []
    for w in en.split():
        for part in w.split('-'):
            p = norm_word(part)
            if p:
                out.append(p)
    return out

def find_expr(en_lower, phrase):
    ph = phrase.replace("'", "'")
    i = en_lower.find(ph)
    return i >= 0

out, missing = {}, set()
for a, en in sorted(lines.items()):
    ws = words_of(en)
    meanings, gram = {}, {}
    en_low = en.lower().replace('’', "'")
    exprs = []
    blanked = set()
    for ph, (ru, note) in EXPRESSIONS.items():
        if find_expr(en_low, ph):
            i = en_low.find(ph)
            exprs.append([en[i:i + len(ph)], ru, note])
            for w in words_of(ph):
                blanked.add(w)
    for w in ws:
        if w in blanked and w not in OVERRIDES.get(a, {}):
            meanings[w] = ''
            continue
        v = OVERRIDES.get(a, {}).get(w)
        if v is None and w in NAMES:
            v = NAMES[w][0]
        if v is None:
            v = BASE.get(w)
        if v is None:
            missing.add(w)
            v = '?'
        meanings[w] = v
        if w in GRAM:
            gram[w] = GRAM[w]
        elif w in NAMES:
            gram[w] = NAMES[w][1]
        elif v == '—':
            gram.setdefault(w, 'служебное слово')
    out[a] = [en, meanings, exprs, gram]

bad = []
for a, (en, m, e, g) in out.items():
    for w, v in m.items():
        if len(v) > 25 or '[' in v or '(' in v or ';' in v or '/' in v or re.search(r'[A-Za-z]', v) and v != '—':
            bad.append((a, w, v))
json.dump(out, open('data/dd-ctx.json', 'w', encoding='utf-8'), ensure_ascii=False)
print('готово: %d реплик, выражений: %d' % (len(out), sum(len(v[2]) for v in out.values())))
print('слов без значения:', len(missing), sorted(missing)[:40])
print('значений с нарушениями:', len(bad), bad[:10])
