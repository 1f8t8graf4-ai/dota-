#!/usr/bin/env python3
"""13.9.35: проверка значений «что слово значит тут» в data/ctx-en.json и data/ctx-de.json.
Значение — как слово переводится в этой реплике: живым русским, 1–3 слова, без скобок и без списка через запятую.
Грамматика — в поле g (4-й элемент строки), непереводимое — «—», слово внутри выражения — пустое значение.
Ищет: скобки, запятые/«/»/«;», латиницу, длиннее 25 символов, пустые там, где у слова нет выражения.
Запуск из корня репо:  python3 tools/check_ctx.py [--all] [--json файл]   (--all — все находки, иначе первые 40)"""
import json, os, re, sys
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LAT = re.compile(r'[A-Za-zÄÖÜäöüß]')
def words_in(x):
    return set(w.lower() for w in re.findall(r"[A-Za-zÄÖÜäöüß'’]+", x))
def check(v, inx):
    v = str(v)
    if v == '':
        return None if inx else 'пусто, а выражения нет'
    if v == '—':
        return None
    if re.search(r'[()\[\]]', v): return 'скобки'
    if re.search(r'[,;/]', v): return 'список'
    if LAT.search(v): return 'латиница'
    if len(v) > 25: return 'длинно'
    return None
def main():
    out, total = [], 0
    for L in ('en', 'de'):
        D = json.load(open(os.path.join(root, 'data', f'ctx-{L}.json'), encoding='utf-8'))[f'CTX_{L.upper()}']
        for sid, rows in D.items():
            for k, r in enumerate(rows):
                if not r:
                    continue
                X = r[2] if len(r) > 2 else []
                xw = set()
                for z in X:
                    xw |= words_in(z[0])
                for w, v in (r[1] or {}).items():
                    total += 1
                    why = check(v, w.lower() in xw)
                    if why:
                        out.append({'sid': sid, 'k': k, 'w': w, 'v': v, 'why': why, 't': r[0]})
    by = {}
    for o in out:
        by[o['why']] = by.get(o['why'], 0) + 1
    print(f'значений: {total}, плохих: {len(out)}', ' · '.join(f'{a} {b}' for a, b in sorted(by.items(), key=lambda x: -x[1])))
    for o in (out if '--all' in sys.argv else out[:40]):
        print(f"{o['sid']}@{o['k']} {o['w']} = {o['v']}  [{o['why']}]")
    if '--json' in sys.argv:
        json.dump(out, open(sys.argv[sys.argv.index('--json') + 1], 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    sys.exit(1 if out else 0)
main()
