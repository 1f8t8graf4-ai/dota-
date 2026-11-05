#!/usr/bin/env python3
"""Restless: какие русские строки сайта ещё не переведены в restless/i18n/en.json.

Берёт русские куски из кода слоёв restless/src/lg*.js (строки в кавычках и куски шаблонов между ${…}),
приводит их так же, как движок перевода (lg32.js): числа → «#», делит по « · », « — », « / », «: », « | ».
Печатает то, чего нет в словаре. С --json — пустой словарь для заполнения (ключ → "").

  python3 tools/i18n_missing.py            # список
  python3 tools/i18n_missing.py --json > /tmp/todo.json
"""
import json, os, re, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SRC = os.path.join(ROOT, 'restless', 'src')
D = json.load(open(os.path.join(ROOT, 'restless', 'i18n', 'en.json'), encoding='utf-8'))
NUM = re.compile(r'[+−-]?\d(?:[\d.,:]|[\s  ](?=\d))*')
SPL = re.compile(r'\s·\s|\s—\s|\s/\s|:\s|\s\|\s')
CYR = re.compile('[А-Яа-яЁё]')
WILD = [re.compile('^' + re.escape(k).replace(r'\*', '([^А-Яа-яЁё]+?)') + '$') for k in D if '*' in k]


def known(p):
    if p in D or p.lower() in D:
        return True
    return any(w.match(p) for w in WILD)


miss = {}
for fn in sorted(os.listdir(SRC)):
    if not re.match(r'lg\d*\.js$', fn):
        continue
    s = open(os.path.join(SRC, fn), encoding='utf-8').read()
    s = re.sub(r'^\s*//.*$', '', s, flags=re.M)  # комментарии не переводим
    for m in re.finditer(r"'((?:[^'\\\n]|\\.)*)'|\"((?:[^\"\\\n]|\\.)*)\"|`((?:[^`\\]|\\.)*)`", s):
        t = m.group(1) or m.group(2) or m.group(3) or ''
        for part in re.split(r'\$\{[^}]*\}|<[^>]*>', t):
            part = part.strip()
            if not CYR.search(part) or len(part) > 240:
                continue
            k = NUM.sub('#', part)
            if known(k):
                continue
            for p in SPL.split(k):
                p = p.strip(' ·—:')
                if CYR.search(p) and not known(p):
                    miss.setdefault(p, fn)

if '--json' in sys.argv:
    json.dump({k: '' for k in miss}, sys.stdout, ensure_ascii=False, indent=0)
else:
    for k, f in sorted(miss.items(), key=lambda x: (x[1], x[0])):
        print(f'{f}\t{k}')
    print(f'\nне переведено: {len(miss)} · в словаре: {len(D)}', file=sys.stderr)
