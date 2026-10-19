#!/usr/bin/env python3
"""Уровень слов A1–C1 по частотности (wordfreq) → data/wlv.json.
Нужен словарю в виде «Новый»: метка уровня у фразы (по самому редкому слову) и у слова в «Моих словах».
Слова — из реплик и фраз всех сцен (английские сцены — английский, немецкие — немецкий) и из словарика (glossary).
Полосы по месту слова в частотном списке форм (wordfreq top_n_list):
  ≤1000 — A1, ≤2500 — A2, ≤5000 — B1, ≤10000 — B2, дальше — C1.
Имена не храним: в словарике помечены «(имя)/(фамилия)», а слово, которого нет в частотном списке и которое в репликах
всегда с заглавной (и нет в словарике), считаем именем.
Запуск из корня репо:  pip install wordfreq; python3 tools/word_levels.py; python3 tools/rebuild_all_data.py
Новая сцена → прогнать заново."""
import json, os, re, sys
from collections import defaultdict
try:
    from wordfreq import top_n_list
except ImportError:
    sys.exit('нужен wordfreq: pip install wordfreq')
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
J = lambda p: json.load(open(os.path.join(root, 'data', p), encoding='utf-8'))
SC = J('scenes.json')['SCENES']
G = J('glossary.json')
GL = {'en': G.get('GLOSS_EN', {}), 'de': G.get('GLOSS_DE', {})}
TOK = re.compile(r"[A-Za-zÀ-ÖØ-öø-ÿß]+(?:['’][A-Za-zÀ-ÖØ-öø-ÿß]+)*")
BANDS = [(1000, 1), (2500, 2), (5000, 3), (10000, 4)]
NAME = re.compile(r'\((имя|фамилия|прозвище|город|название|марка)')


def band(r):
    for lim, b in BANDS:
        if r <= lim:
            return b
    return 5


def main():
    words = {'en': defaultdict(lambda: [0, 0]), 'de': defaultdict(lambda: [0, 0])}   # слово → [сколько раз с маленькой, с заглавной не в начале]

    def eat(lang, text):
        if not text:
            return
        for sent in re.split(r'(?<=[.!?…])\s+', str(text)):
            for i, m in enumerate(TOK.finditer(sent)):
                w = m.group(0).replace('’', "'")
                lo = w.lower()
                if w[0].isupper() and (i > 0 or lang == 'de'):
                    words[lang][lo][1] += 1
                elif w[0].islower():
                    words[lang][lo][0] += 1
                else:
                    words[lang][lo]   # первое слово предложения: ни то ни другое
    for s in SC:
        lang = 'de' if s.get('lang') == 'de' else 'en'
        col = 4 if lang == 'de' else 2
        for r in s.get('subs', []):
            if len(r) > col:
                eat(lang, r[col])
        for p in s.get('parts', []):
            for f in p.get('ph', []):
                eat(lang, f.get(lang))
                for k in f.get('kw') or []:
                    if k:
                        eat(lang, k[0])
                        if len(k) > 1:
                            eat(lang, k[1])
    for lang in ('en', 'de'):
        for k in GL[lang]:
            if ' ' not in k:
                words[lang][k.lower()]
    out = {}
    for lang in ('en', 'de'):
        top = top_n_list(lang, 50000)
        rank = {}
        for i, w in enumerate(top):
            rank.setdefault(w, i + 1)
        by = defaultdict(list)
        skipped = 0
        for w, (lo, up) in sorted(words[lang].items()):
            g = GL[lang].get(w, '')
            if g and NAME.search(g):
                skipped += 1
                continue
            r = rank.get(w)
            if r is None and w.endswith("'s"):
                r = rank.get(w[:-2])
            if r is None:
                if not g and up and not lo:
                    skipped += 1
                    continue
                r = 10 ** 6
            by[band(r)].append(w)
        out['WLV_' + lang.upper()] = {str(b): ' '.join(sorted(L)) for b, L in sorted(by.items())}
        print(lang, {b: len(L) for b, L in sorted(by.items())}, 'имён пропущено:', skipped)
    p = os.path.join(root, 'data', 'wlv.json')
    json.dump(out, open(p, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print('data/wlv.json:', os.path.getsize(p) // 1024, 'КБ')


if __name__ == '__main__':
    main()
