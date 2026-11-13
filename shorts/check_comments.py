# ищет строки, где после «//» остался код (комментарий посреди строки съедает всё до конца строки): python3 check_comments.py ep/v165.js
import re, sys
for fn in sys.argv[1:]:
    for k, L in enumerate(open(fn, encoding='utf-8'), 1):
        if L.strip().startswith('//'): continue
        m = re.search(r"(?<![:'\"/])//(?!/)", L)
        if not m: continue
        tail = L[m.end():]
        if re.search(r"c\.\w+\(|\w+\(c[,)]|\);\s*$|;\s*\}\s*$|\bconst \w+ =|\bif \(", tail): print(fn, k, tail.strip()[:140])
print('проверено')
