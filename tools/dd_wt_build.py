# -*- coding: utf-8 -*-
# Сборка data/dd-wt.json по задаче wt (tools/hero_prompts/tasks.py):
# слова берём из поля "en" реплики (как написано у нас), время — из распознавания (data/dd-wt-raw.json),
# сопоставление по порядку без регистра/знаков; не найденное слово — время поровну между соседями.
# Ключи — полные пути R2 (scenes/games/deadlock/v/*.mp3).
# Проверка: доля найденных слов по файлам (таблица <80%), последнее слово <= длины файла.
import json, os, re, subprocess, sys
from difflib import SequenceMatcher

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')

def norm(w):
    return re.sub(r"[^a-z0-9'’]+", '', w.lower()).replace('’', "'")

def texts():
    out = {}
    for src in ('games-main-tmp.json', 'data/games-new.json'):
        d = json.load(open(os.path.join(ROOT, src), encoding='utf-8'))
        def walk(o):
            if isinstance(o, dict):
                for k, v in o.items():
                    if k == 'a' and isinstance(v, str) and 'deadlock' in v:
                        en = o.get('en')
                        if en: out[v] = en
                    else: walk(v)
            elif isinstance(o, list):
                for x in o: walk(x)
        walk(d)
    return out

def align(en_words, tokens):
    # tokens: [[t0,t1,word],...] из распознавания
    E = [norm(w) for w in en_words]
    R = [norm(t[2]) for t in tokens]
    sm = SequenceMatcher(None, E, R, autojunk=False)
    times = [None] * len(E)
    matched = 0
    for bl in sm.get_matching_blocks():
        for k in range(bl.size):
            times[bl.a + k] = (tokens[bl.b + k][0], tokens[bl.b + k][1])
            matched += 1
    # дыры заполняем поровну между соседними найденными
    for i in range(len(E)):
        if times[i] is not None: continue
        prev_t = next((times[j][1] for j in range(i - 1, -1, -1) if times[j]), 0.0)
        nxt_i = next((j for j in range(i + 1, len(E)) if times[j]), None)
        nxt_t = tokens[-1][1] + 0.3 if nxt_i is None and tokens else times[nxt_i][0]
        if nxt_i is not None: nxt_t = times[nxt_i][0]
        n = 1
        while i + n < len(E) and times[i + n] is None: n += 1
        step = (nxt_t - prev_t) / (n + (1 if nxt_i is not None else 0))
        for k in range(n):
            t0 = prev_t + step * k
            times[i + k] = (round(t0, 2), round(t0 + step, 2))
    return times, matched, len(E)

_DUR = {}
def dur(path):
    if path in _DUR: return _DUR[path]
    import glob as _g
    hit = _g.glob(os.path.join(ROOT, 'heroes-voice', '*', os.path.basename(path)))
    if not hit:
        _DUR[path] = None
        return None
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', hit[0]],
                       capture_output=True, text=True)
    _DUR[path] = float(r.stdout.strip()) if r.stdout.strip() else None
    return _DUR[path]

def main():
    raw = json.load(open(os.path.join(ROOT, 'data', 'dd-wt-raw.json'), encoding='utf-8'))
    tx = texts()
    out, stats, table = {}, [], []
    for path, en in sorted(tx.items()):
        key = os.path.basename(path)[:-4]
        if key not in raw:
            table.append([path, 'нет распознавания', 0]); continue
        words = en.split()
        times, m, total = align(words, raw[key])
        frac = m / total if total else 1
        if frac < 0.8: table.append([path, f'{m}/{total}', round(frac * 100)])
        stats.append(frac)
        d = dur(path) or max(t[1] for t in times)
        rows = [[round(max(0, t0), 2), round(min(t1, d), 2), w] for (t0, t1), w in zip(times, words)]
        out[path] = rows
    json.dump(out, open(os.path.join(ROOT, 'data', 'dd-wt.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    avg = sum(stats) / len(stats) * 100 if stats else 0
    print(f'файлов: {len(out)}, средняя доля найденных слов: {avg:.1f}%, файлов <80%: {len(table)}')
    for row in table[:40]:
        print('  ', row)

if __name__ == '__main__':
    main()
