#!/usr/bin/env python3
"""Проверка разметки «что учить» — learn/<сцена>.jsonl (ТЗ — learn/ТЗ.md).

python3 tools/check_learn.py            — все файлы learn/*.jsonl
python3 tools/check_learn.py <сцена>…   — только эти
Выход 1, если есть ошибки. Предупреждения — подумать, но не обязательно.
"""
import json, re, sys, glob, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KINDS = {'смысл', 'звук', 'написание', 'буквально', 'значение'}
BAD_RU = re.compile(r'[;/()\[\]]|[A-Za-z]')


def scenes():
    d = json.load(open(os.path.join(ROOT, 'data/scenes.json'), encoding='utf-8'))
    L = d['SCENES'] if isinstance(d, dict) else d
    out = {}
    for s in L:
        for i, p in enumerate(s['parts']):
            for j, f in enumerate(p.get('ph', [])):
                out[f"{s['id']}#{i+1}.{j+1}"] = (s, f)
    return out


def norm(t):
    return re.sub(r'\s+', ' ', t.replace('’', "'").replace('‘', "'")).strip().lower()


def found(x, text):
    x, text = norm(x).rstrip('?.!,'), norm(text)
    return re.search(r"(?<![a-zäöüß'])" + re.escape(x) + r"(?![a-zäöüß])", text) is not None


def stems(t):
    return {w[:4] for w in re.findall(r'[а-яё]+', t.lower()) if len(w) >= 4}


def check(fn, PH):
    E, Wn = [], []
    seen = set()
    sid = os.path.basename(fn)[:-6]
    n_items = 0
    for ln, raw in enumerate(open(fn, encoding='utf-8'), 1):
        if not raw.strip():
            continue
        at = f'{os.path.basename(fn)}:{ln}'
        try:
            o = json.loads(raw)
        except Exception as e:
            E.append(f'{at}: не JSON ({e})')
            continue
        pid = o.get('id', '')
        if pid in seen:
            E.append(f'{at}: {pid} второй раз')
        seen.add(pid)
        if pid not in PH:
            E.append(f'{at}: нет такой фразы {pid}')
            continue
        s, f = PH[pid]
        text = f.get('de') if s.get('lang') == 'de' else f['en']
        L = o.get('L')
        if not isinstance(L, list):
            E.append(f'{at}: {pid} — нет списка L')
            continue
        if not L and not o.get('skip'):
            E.append(f'{at}: {pid} — L пустой, напиши skip: почему нечего учить')
        if len(L) > 2:
            E.append(f'{at}: {pid} — больше 2 пунктов')
        for it in L:
            n_items += 1
            x, ru, d, t = it.get('x', ''), it.get('ru', ''), it.get('d', []), it.get('t')
            tag = f'{at}: {pid} «{x}»'
            if t not in ('w', 'p'):
                E.append(f'{tag} — t должно быть w или p')
            if not x or not found(x, text):
                E.append(f'{tag} — x нет во фразе дословно')
            if t == 'w' and len(x.split()) > 1:
                E.append(f'{tag} — слово (w) из одного слова; несколько — это p')
            if t == 'p' and len(x.split()) > 6:
                Wn.append(f'{tag} — длинновато для фразы ({len(x.split())} слов)')
            if not ru or BAD_RU.search(ru):
                E.append(f'{tag} — ru пустой или со скобками/«;»/латиницей: «{ru}»')
            if len(ru) > 28:
                Wn.append(f'{tag} — ru длинный ({len(ru)} симв.)')
            if not isinstance(d, list) or len(d) != 3:
                E.append(f'{tag} — нужно ровно 3 неверных варианта')
                continue
            opts = [ru.lower()]
            kinds = []
            for z in d:
                if not (isinstance(z, list) and len(z) == 3):
                    E.append(f'{tag} — вариант должен быть [текст, вид, почему]')
                    continue
                v, k, why = z
                kinds.append(k)
                if k not in KINDS:
                    E.append(f'{tag} — вид «{k}» не из {sorted(KINDS)}')
                if not v or BAD_RU.search(v):
                    E.append(f'{tag} — вариант со скобками/«;»/латиницей: «{v}»')
                if v.lower() in opts:
                    E.append(f'{tag} — вариант повторяется или равен ответу: «{v}»')
                opts.append(v.lower())
                if not why or len(why) > 80:
                    E.append(f'{tag} — «почему» пустое или длиннее 80: «{why}»')
                a = stems(ru)
                if a and len(stems(v) & a) / len(a) >= 0.67:
                    Wn.append(f'{tag} — «{v}» почти тот же корень, что ответ «{ru}» — точно неверный?')
                if not (0.4 <= (len(v) + 1) / (len(ru) + 1) <= 2.6):
                    Wn.append(f'{tag} — «{v}» сильно другой длины, чем ответ')
            if t == 'p' and 'буквально' not in kinds and 'значение' not in kinds:
                Wn.append(f'{tag} — у фразы нет ловушки «буквально» или «значение»')
            if t == 'w' and not ({'звук', 'написание', 'значение'} & set(kinds)):
                Wn.append(f'{tag} — у слова нет похожего по звуку/написанию или другого значения')
    want = [k for k in PH if k.split('#')[0] == sid]
    miss = [k for k in want if k not in seen]
    if miss:
        E.append(f'{os.path.basename(fn)}: нет строк для {len(miss)} фраз: {", ".join(miss[:6])}{"…" if len(miss) > 6 else ""}')
    return E, Wn, len(seen), n_items


def main():
    PH = scenes()
    args = sys.argv[1:]
    files = [os.path.join(ROOT, 'learn', a + '.jsonl') for a in args] if args else sorted(glob.glob(os.path.join(ROOT, 'learn', '*.jsonl')))
    allE = 0
    for fn in files:
        if not os.path.exists(fn):
            print(f'нет файла {fn}')
            allE += 1
            continue
        E, Wn, n, k = check(fn, PH)
        print(f'== {os.path.basename(fn)}: фраз {n}, что учить {k}, ошибок {len(E)}, предупреждений {len(Wn)}')
        for e in E:
            print('  ОШИБКА', e)
        for w in Wn:
            print('  внимание', w)
        allE += len(E)
    sys.exit(1 if allE else 0)


if __name__ == '__main__':
    main()
