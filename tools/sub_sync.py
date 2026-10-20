# 13.9.40: субтитры и фразы — по настоящему голосу (Андрей: «субтитры и голос не совпадают»).
# Время каждого слова — wt.json сцены (распознавание по файлам эпизодов, время сцены). Строки субтитров эпизода
# сопоставляются словам wt целиком (выравнивание как LCS, слово может сдвинуться не дальше чем на WIN с),
# начало строки = первое найденное слово − PRE, конец = последнее + POST. Строка, где найдено меньше половины слов, —
# сдвигается как соседи. Фразы ph[].a/b — тем же сдвигом (кусочно-линейно по началам и концам строк).
# Индексы строк не меняются (ctx-*.json, «Мои слова»). Сдвиг больше MAX — не вносится, печатается списком.
#   python3 tools/sub_sync.py <папка с <сцена>/wt.json> [--dry] [сцены…]
import json, re, sys, os, bisect

PRE, POST, WIN, MAX, MIND = 0.05, 0.15, 2.5, 1.5, 0.6
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
args = [a for a in sys.argv[1:] if not a.startswith('--')]
DRY = '--dry' in sys.argv
WTDIR, ONLY = args[0], set(args[1:])

def norm(w):   # как wtN в app.js
    w = str(w or '').lower().replace('’', "'").replace('`', "'")
    return re.sub(r"[^a-zß-öø-ÿ0-9']", '', w)
def toks(t): return [x for x in (norm(w) for w in re.split(r"[\s\-—/…]+|\.\.\.", str(t or '').replace('\n', ' '))) if x]
def lev1(a, b):   # отличаются не больше чем на одну букву
    if abs(len(a) - len(b)) > 1: return False
    if len(a) == len(b): return sum(x != y for x, y in zip(a, b)) <= 1
    if len(a) > len(b): a, b = b, a
    i = 0
    while i < len(a) and a[i] == b[i]: i += 1
    return a[i:] == b[i + 1:]
def same(a, b):
    if a == b or a.replace("'", '') == b.replace("'", ''): return True
    return len(a) >= 5 and len(b) >= 5 and lev1(a, b)
def q(a, p): a = sorted(a); return a[min(len(a) - 1, int(len(a) * p))] if a else float('nan')

def align(S, W):
    """S — [(слово, ожидаемое время)], W — [(t0,t1,слово)]; LCS с окном по времени. → {i: j}"""
    n, m = len(S), len(W)
    if not n or not m: return {}
    wt0 = [w[0] for w in W]
    cand = []
    for i, (w, t) in enumerate(S):
        lo, hi = bisect.bisect_left(wt0, t - WIN), bisect.bisect_right(wt0, t + WIN)
        cand.append([j for j in range(lo, hi) if same(w, W[j][2])])
    # DP по парам (i,j): L[i][j] — длина лучшей цепочки, заканчивающейся совпадением (i,j)
    best = {}   # (i,j) -> (len, prev)
    ends = []   # для каждой длины — минимальный j конца и сам ключ (как в LIS)
    for i in range(n):
        upd = []
        for j in sorted(cand[i], reverse=True):
            k = bisect.bisect_left([e[0] for e in ends], j)   # цепочки с концом < j
            prev = ends[k - 1][1] if k else None
            ln = k + 1
            best[(i, j)] = (ln, prev)
            upd.append((ln, j, (i, j)))
        for ln, j, key in upd:
            if ln - 1 < len(ends):
                if j < ends[ln - 1][0]: ends[ln - 1] = (j, key)
            else: ends.append((j, key))
    if not ends: return {}
    key, M = ends[-1][1], {}
    while key is not None:
        M[key[0]] = key[1]; key = best[key][1]
    return M

def measure(subs, W, parts, col):
    """как караоке в плеере (ndKaraSet): слова строки ищутся рядом с ней; → [голос − начало строки]"""
    out = []
    for p in parts:
        for r in subs:
            if not (p['a'] - 0.3 <= r[0] < p['b']): continue
            T = toks(r[col])
            if len(T) < 2: continue
            C = [w for w in W if r[0] - 0.5 <= w[0] <= r[1] + 0.3]; k = 0; hit = 0; first = None
            for n in T:
                for x in range(k, min(len(C), k + 4)):
                    if norm(C[x][2]) == n:
                        if first is None: first = C[x][0]
                        k = x + 1; hit += 1; break
            if hit * 2 >= len(T): out.append(first - r[0])
    return out

def warp(points):
    pts = sorted(set(points))
    xs = [p[0] for p in pts]
    def f(t):
        if not pts: return t
        k = bisect.bisect_left(xs, t)
        if k == 0: return t + (pts[0][1] - pts[0][0])
        if k >= len(pts): return t + (pts[-1][1] - pts[-1][0])
        (x0, y0), (x1, y1) = pts[k - 1], pts[k]
        if x1 == x0: return y0
        return y0 + (y1 - y0) * (t - x0) / (x1 - x0)
    return f

P = os.path.join(ROOT, 'data', 'scenes.json')
D = json.load(open(P, encoding='utf8'))
big, total = [], {'rows': 0, 'b': [], 'a': []}
for s in D['SCENES']:
    if ONLY and s['id'] not in ONLY: continue
    fn = os.path.join(WTDIR, s['id'], 'wt.json')
    if not os.path.exists(fn): print(s['id'], '— нет wt.json'); continue
    W = sorted(json.load(open(fn, encoding='utf8'))['w'])
    col = 4 if s.get('lang') == 'de' else 2
    subs = s['subs']
    st = {'rows': 0, 'miss': 0, 'b': measure(subs, W, s['parts'], col), 'a': []}
    for pi, p in enumerate(s['parts']):
        R = sorted((ri for ri, r in enumerate(subs) if p['a'] - 0.3 <= r[0] < p['b']), key=lambda ri: subs[ri][0])
        if not R: continue
        Wp = [w for w in W if p['a'] - 3 <= w[0] <= p['b'] + 3]
        S, own = [], []
        for ri in R:
            r, T = subs[ri], toks(subs[ri][col])
            for k, w in enumerate(T):
                S.append((w, r[0] + (r[1] - r[0]) * (k + .5) / max(1, len(T)))); own.append((ri, k, len(T)))
        M = align(S, Wp)
        hits = {}
        for i, j in M.items():
            ri, k, n = own[i]; hits.setdefault(ri, []).append((k, n, Wp[j]))
        new = {}
        for ri in R:
            r, h = subs[ri], hits.get(ri, [])
            n = len(toks(r[col]))
            st['rows'] += 1
            if n == 0 or len(h) * 2 < n or (n >= 3 and len(h) < 2): st['miss'] += 1; continue
            h.sort(key=lambda x: x[0])
            k0, _, w0 = h[0]; k1, _, w1 = h[-1]
            a = w0[0] - k0 * 0.22 - PRE
            b = w1[1] + (n - 1 - k1) * 0.22 + POST
            new[ri] = [a, b]
        # сдвиг больше MAX — не вносим (чаще всего распознавание спутало повтор слов), печатаем
        for ri in list(new):
            r = subs[ri]
            if abs(new[ri][0] - r[0]) > MAX:
                big.append(f"{s['id']}#{pi + 1} {r[0]:.2f}→{new[ri][0]:.2f}  {r[col]!r}"); del new[ri]
        # строки без совпадений — сдвиг как у соседей в пределах 6 с (между двумя — по времени); соседей нет — как есть
        anchors = sorted((subs[ri][0], new[ri][0] - subs[ri][0]) for ri in new)
        ts = [x[0] for x in anchors]
        for ri in R:
            if ri in new or not anchors: continue
            r = subs[ri]; k = bisect.bisect_left(ts, r[0])
            L = anchors[k - 1] if k > 0 and r[0] - anchors[k - 1][0] <= 6 else None
            Rn = anchors[k] if k < len(anchors) and anchors[k][0] - r[0] <= 6 else None
            if L and Rn: d = L[1] + (Rn[1] - L[1]) * (r[0] - L[0]) / max(0.01, Rn[0] - L[0])
            elif L or Rn: d = (L or Rn)[1]
            else: continue
            new[ri] = [r[0] + d, r[1] + d]
        # без наезда, не короче MIND, по порядку
        order = sorted(R, key=lambda ri: new.get(ri, subs[ri])[0])
        for x, ri in enumerate(order):
            a, b = new.get(ri, subs[ri][:2])
            nx = order[x + 1] if x + 1 < len(order) else None
            na = new.get(nx, subs[nx][:2])[0] if nx is not None else None
            b = max(b, a + MIND)
            if na is not None and b > na - 0.02: b = max(a + 0.3, na - 0.02)
            new[ri] = [round(max(p['a'], a), 2), round(b, 2)]
        # фразы — кусочно-линейно по старым → новым началам и концам строк
        pts = []
        for ri in R:
            o = subs[ri]
            pts += [(o[0], new[ri][0] + PRE), (o[1], new[ri][1] - POST)]
        f = warp(pts)
        for ph in p['ph']:
            a, b = f(ph['a']) - PRE, f(ph['b']) + POST
            if abs(a - ph['a']) > MAX: big.append(f"{s['id']}#{pi + 1} фраза {ph['a']:.2f}→{a:.2f} {ph.get('en','')!r}"); continue
            ph['a'], ph['b'] = round(max(p['a'], a), 2), round(min(p['b'], max(b, a + 0.5)), 2)
        for ri in R: subs[ri][0], subs[ri][1] = new[ri]
    st['a'] = measure(subs, W, s['parts'], col)
    print(f"{s['id']:24} строк {st['rows']:3} без голоса {st['miss']:3} | голос−строка ДО p10 {q(st['b'],.1):+.2f} p50 {q(st['b'],.5):+.2f} p90 {q(st['b'],.9):+.2f} ({len(st['b'])})"
          f" | ПОСЛЕ p10 {q(st['a'],.1):+.2f} p50 {q(st['a'],.5):+.2f} p90 {q(st['a'],.9):+.2f} ({len(st['a'])})")
    total['rows'] += st['rows']; total['b'] += st['b']; total['a'] += st['a']
ok = lambda L: sum(1 for x in L if abs(x) <= 0.15) / max(1, len(L))
print(f"ВСЕГО строк {total['rows']}: в пределах ±0,15 с ДО {ok(total['b']):.0%}, ПОСЛЕ {ok(total['a']):.0%}")
if big: print('\nНЕ ВНЕСЕНО (сдвиг больше %.1f с) — проверить руками:' % MAX); print('\n'.join(big))
if not DRY:
    s = json.dumps(D, ensure_ascii=False, separators=(',', ':'))
    open(P, 'w', encoding='utf8').write(s); print('\nзаписал', P, '→ теперь python3 tools/rebuild_all_data.py')
