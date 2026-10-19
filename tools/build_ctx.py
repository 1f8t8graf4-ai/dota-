#!/usr/bin/env python3
"""13.9.16 (13.9.35 — поле g, грамматика; 4-й элемент строки): значение слов в каждой реплике + выражения → data/ctx-en.json, data/ctx-de.json.
Вход — папка с <сцена>.jsonl (по строке на реплику s.subs: {"k":индекс,"t":оригинал,"w":{слово:значение},"x":[[выражение,значение,пояснение]]}).
Запуск из корня репо:  python3 tools/build_ctx.py <папка>   (потом — python3 tools/rebuild_all_data.py)
Сцены без файла остаются как были (берутся из уже собранного ctx-*.json)."""
import json, os, sys, glob
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = sys.argv[1] if len(sys.argv) > 1 else '.'
S = json.load(open(os.path.join(root, 'data', 'scenes.json'), encoding='utf-8'))['SCENES']
out = {}
for L in ('en', 'de'):
    p = os.path.join(root, 'data', f'ctx-{L}.json')
    out[L] = json.load(open(p, encoding='utf-8'))[f'CTX_{L.upper()}'] if os.path.exists(p) else {}
bad = 0
for s in S:
    f = os.path.join(src, s['id'] + '.jsonl')
    if not os.path.exists(f):
        continue
    L = 'de' if s.get('lang') == 'de' else 'en'
    rows = [json.loads(x) for x in open(f, encoding='utf-8') if x.strip()]
    by = {r['k']: r for r in rows}
    arr = []
    for k, r in enumerate(s['subs']):
        o = (r[4] if L == 'de' else r[2]) or ''
        e = by.get(k)
        if not e or e.get('t') != o:
            bad += 1
            arr.append(None)
            continue
        w = {str(a).lower(): str(b) for a, b in (e.get('w') or {}).items() if a}   # 13.9.35: пустое значение — слово внутри выражения
        x = [[str(z[0]), str(z[1] if len(z) > 1 else ''), str(z[2] if len(z) > 2 else '')] for z in (e.get('x') or []) if z and z[0]]
        g = {str(a).lower(): str(b) for a, b in (e.get('g') or {}).items() if a and b}
        arr.append([o, w, x, g] if g else [o, w, x])
    out[L][s['id']] = arr
for L in ('en', 'de'):
    json.dump({f'CTX_{L.upper()}': out[L]}, open(os.path.join(root, 'data', f'ctx-{L}.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print(f'ctx-{L}.json: сцен {len(out[L])}, реплик {sum(len(v) for v in out[L].values())}')
if bad:
    print('не совпало / нет строки:', bad)
