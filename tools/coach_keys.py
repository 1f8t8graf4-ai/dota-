#!/usr/bin/env python3
"""Разовые проверки: какие русские шаблоны коуча (lg7/lg8/lg9/lg10/lg33) не покрыты словарём en.json.
Движок (lg32 t32x) не режет по пробелам — ключ нужен целиком, числа → «#»."""
import io, json, re, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

D = json.load(open('restless/i18n/en.json', encoding='utf-8'))
NUM = re.compile(r'#?[+−-]?\d(?:[\d.,:]|[\s  ](?=\d))*')
SPL = re.compile(r'\s·\s|\s—\s|\s/\s|:\s|\s\|\s')
WILD = [re.compile('^' + re.escape(k).replace(r'\*', '([^А-Яа-яЁё]+?)') + '$') for k in D if '*' in k]

def known(p):
    if p in D or p.lower() in D:
        return True
    return any(w.match(p) for w in WILD)

miss = {}
for path in ['restless/src/lg7.js', 'restless/src/lg8.js', 'restless/src/lg9.js', 'restless/src/lg10.js', 'restless/src/lg33.js']:
    s = open(path, encoding='utf-8').read()
    s = re.sub(r'^\s*//.*$', '', s, flags=re.M)
    for m in re.finditer(r'`((?:[^`\\]|\\.)*)`|\'((?:[^\'\\\n]|\\.)*)\'|"((?:[^"\\\n]|\\.)*)"', s):
        t = m.group(1) or m.group(2) or m.group(3) or ''
        for part in re.split(r'\$\{[^}]*\}|<[^>]*>', t):
            part = part.strip()
            if not re.search('[А-Яа-яЁё]', part) or len(part) > 240 or re.search(r'[;{}=]|//|=>', part):
                continue
            k = NUM.sub('#', part)
            if known(k):
                continue
            for p in SPL.split(k):
                p = p.strip(' ·—:')
                if re.search('[А-Яа-яЁё]', p) and not known(p):
                    miss.setdefault(p, path.split('/')[-1])

for k, f in sorted(miss.items()):
    print(f'{f}\t{k}')
print('ВСЕГО:', len(miss))
