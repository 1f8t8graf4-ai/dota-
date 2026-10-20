#!/usr/bin/env python3
"""13.9.40: субтитры и фразы — по настоящему голосу.
Время каждого слова — scenes/<id>/wt.json ({v:1,w:[[t0,t1,слово]]}, время сцены, из распознавания речи).
Строки субтитров (subs[i][2], у немецких сцен — [4]) сопоставляются словам wt по всей сцене
(LCS по нормализованным словам, слово wt берётся только рядом со строкой: ±4 с), затем:
  начало строки = первое найденное слово − 0,05 с, конец = последнее + 0,2 с, без наезда на следующую;
  найдено меньше половины слов — строка сдвигается на сдвиг соседей;
  фразы ph[].a/b — так же, по своим словам;
  сдвиг больше 1,5 с не вносится — печатается списком на ручную проверку.
Индексы строк не меняются (ctx-*.json, «Мои слова» не ломаются).
Запуск из корня репо:  python3 tools/sub_sync.py [--dry] [сцены…]   (wt.json — из ../scenes)
Потом: python3 tools/rebuild_all_data.py; python3 tools/check_data.py"""
import json, os, re, sys, statistics

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCN = os.path.join(os.path.dirname(root), 'scenes')
DRY = '--dry' in sys.argv
ONLY = [a for a in sys.argv[1:] if not a.startswith('--')]
LEAD, TAIL, MAXSH, WIN = 0.05, 0.2, 1.5, 4.0
TOK = re.compile(r"[a-zà-öø-ÿß0-9]+(?:'[a-zà-öø-ÿß]+)*")


def toks(t):
    t = str(t or '').lower().replace('’', "'")
    t = re.sub(r'\([^)]*\)', ' ', t)   # «(auf Jiddisch)» и пометки
    return TOK.findall(t)


def norm(w):
    w = w.lower().replace('’', "'")
    return re.sub(r"[^a-zà-öø-ÿß0-9']", '', w).strip("'")


def lcs(A, B, ok):
    """A, B — списки (ключ, ...); ok(i,j) — можно ли сопоставить. Возвращает пары (i,j)."""
    n, m = len(A), len(B)
    prev = [0] * (m + 1)
    back = []
    for i in range(n):
        cur = [0] * (m + 1)
        bi = bytearray(m + 1)
        ai = A[i][0]
        for j in range(m):
            if ai == B[j][0] and ok(i, j):
                cur[j + 1] = prev[j] + 1; bi[j + 1] = 1
            elif prev[j + 1] >= cur[j]:
                cur[j + 1] = prev[j + 1]; bi[j + 1] = 2
            else:
                cur[j + 1] = cur[j]; bi[j + 1] = 3
        back.append(bi)
        prev = cur
    i, j, out = n, m, []
    while i > 0 and j > 0:
        b = back[i - 1][j]
        if b == 1:
            out.append((i - 1, j - 1)); i -= 1; j -= 1
        elif b == 2:
            i -= 1
        else:
            j -= 1
    return out[::-1]


def pct(L, p):
    if not L:
        return float('nan')
    L = sorted(L)
    return L[min(len(L) - 1, int(round(p / 100 * (len(L) - 1))))]


def main():
    path = os.path.join(root, 'data', 'scenes.json')
    D = json.load(open(path, encoding='utf-8'))
    review, tot_b, tot_a = [], [], []
    for s in D['SCENES']:
        if ONLY and s['id'] not in ONLY:
            continue
        wp = os.path.join(SCN, s['id'], 'wt.json')
        if not os.path.exists(wp):
            print(s['id'], '— нет wt.json, пропуск'); continue
        W = [(norm(w[2]), float(w[0]), float(w[1])) for w in json.load(open(wp, encoding='utf-8'))['w'] if norm(w[2])]
        col = 4 if s.get('lang') == 'de' else 2
        subs = s['subs']
        A = []   # (слово, номер строки)
        for k, r in enumerate(subs):
            for t in toks(r[col] if len(r) > col else ''):
                A.append((norm(t), k))
        pairs = lcs(A, W, lambda i, j: subs[A[i][1]][0] - WIN <= W[j][1] <= subs[A[i][1]][1] + WIN)
        hit = {}
        for i, j in pairs:
            hit.setdefault(A[i][1], []).append(W[j])
        nw = {}
        for k in range(len(subs)):
            nw[k] = sum(1 for a in A if a[1] == k)
        new = {}
        for k, r in enumerate(subs):
            h = hit.get(k, [])
            if nw[k] and len(h) * 2 >= nw[k]:
                new[k] = [h[0][1] - LEAD, h[-1][2] + TAIL]
        # строки без голоса — сдвиг соседей
        sh = {k: new[k][0] - subs[k][0] for k in new}
        keys = sorted(sh)
        for k, r in enumerate(subs):
            if k in new:
                continue
            nb = [sh[x] for x in keys if abs(x - k) <= 3]
            d = statistics.median(nb) if nb else 0.0
            new[k] = [r[0] + d, r[1] + d]
        # большие сдвиги — не вносим
        for k, r in enumerate(subs):
            if abs(new[k][0] - r[0]) > MAXSH:
                review.append((s['id'], k, round(new[k][0] - r[0], 2), r[col][:60] if len(r) > col else ''))
                new[k] = [r[0], r[1]]
        # порядок строк не меняем: если голос переставил соседей — обе строки как были
        ch = True
        while ch:
            ch = False
            for k in range(1, len(subs)):
                if subs[k][0] >= subs[k - 1][0] and new[k][0] < new[k - 1][0] - 1e-6:
                    for x in (k - 1, k):
                        if new[x] != [subs[x][0], subs[x][1]]:
                            review.append((s['id'], x, 'порядок', subs[x][col][:60] if len(subs[x]) > col else ''))
                            new[x] = [subs[x][0], subs[x][1]]; ch = True
        # до / после: где голос начинается относительно строки
        before = [hit[k][0][1] - subs[k][0] for k in hit if nw[k] and len(hit[k]) * 2 >= nw[k]]
        after = [hit[k][0][1] - new[k][0] for k in hit if nw[k] and len(hit[k]) * 2 >= nw[k]]
        # без наезда, порядок
        order = sorted(range(len(subs)), key=lambda k: new[k][0])
        for a_, b_ in zip(order, order[1:]):
            if new[a_][1] > new[b_][0] - 0.02:
                new[a_][1] = max(new[a_][0] + 0.3, new[b_][0] - 0.02)
        for k, r in enumerate(subs):
            r[0], r[1] = round(new[k][0], 2), round(max(new[k][1], new[k][0] + 0.3), 2)
        # фразы
        nph = nphm = 0
        for p in s['parts']:
            for f in p['ph']:
                t = toks(f.get('de') if s.get('lang') == 'de' else f.get('en'))
                if not t:
                    continue
                nph += 1
                fa, fb = f['a'], f['b']
                Wn = [w for w in W if fa - WIN <= w[1] <= fb + WIN]
                pr = lcs([(norm(x),) for x in t], Wn, lambda i, j: True)
                if len(pr) * 2 < len(t):
                    continue
                a = Wn[pr[0][1]][1] - LEAD
                b = Wn[pr[-1][1]][2] + TAIL
                if abs(a - fa) > MAXSH or abs(b - fb) > MAXSH + 1:
                    review.append((s['id'], 'фраза', round(a - fa, 2), (f.get('de') if s.get('lang') == 'de' else f.get('en'))[:60]))
                    continue
                f['a'], f['b'] = round(a, 2), round(max(b, a + 0.4), 2)
                nphm += 1
        ok_b = sum(1 for x in before if abs(x) <= 0.15) / max(1, len(before))
        ok_a = sum(1 for x in after if abs(x) <= 0.15) / max(1, len(after))
        tot_b += before; tot_a += after
        print(f"{s['id']:24s} строк {len(subs):3d}, по голосу {len(before):3d} | до: p10 {pct(before,10):+.2f} p50 {pct(before,50):+.2f} p90 {pct(before,90):+.2f} в ±0,15 {ok_b:4.0%} | после в ±0,15 {ok_a:4.0%} | фразы {nphm}/{nph}")
    ok_b = sum(1 for x in tot_b if abs(x) <= 0.15) / max(1, len(tot_b))
    ok_a = sum(1 for x in tot_a if abs(x) <= 0.15) / max(1, len(tot_a))
    print(f'ВСЕГО строк по голосу {len(tot_b)}: в ±0,15 с было {ok_b:.0%}, стало {ok_a:.0%}')
    if review:
        print('\nНа ручную проверку (сдвиг > 1,5 с — не внесено):')
        for x in review:
            print('  ', *x)
    if not DRY:
        json.dump(D, open(path, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
        print('записано: data/scenes.json')


if __name__ == '__main__':
    main()
