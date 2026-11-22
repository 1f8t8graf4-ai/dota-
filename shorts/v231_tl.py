#!/usr/bin/env python3
"""v23.1–v23.2 (22.11): черновые таймлайны двух прологов БЕЗ голоса (как v230_tl.py — темп Макса по слогам).
  A — v231y (v23.2): «Что вы знаете о никотине? / За сто лет он менял форму пять раз: / Сигареты. «Джул». Айкос. Одноразки. Снюс. /
            Менялись упаковка, вкус и обещания — но не суть. / Начнём с самого знакомого…» (v23.1 — текст v23.0 без списка)
  B — v232y: «Сигареты. «Джул». Одноразки. Айкос. Снюс. / И каждый раз — «способ бросить». / Угадаете, кто стоит за всеми пятью? /
            Начнём с самого знакомого…» (титул «Что вы знаете о никотине?» — на экране с первого кадра, вслух не читается)
Когда будет голос — слова заменить распознанными (картинка привязана к номерам слов: ANCH в ep/v231/10-text.js).
  python3 v231_tl.py → tl/v231y-ru.json, tl/v232y-ru.json (EN/DE — после выбора варианта)"""
import json, math, os
import v230_tl as T

HERE = os.path.dirname(os.path.abspath(__file__))
TXT = {
    # v23.2 (22.11): A + строка-список из B (Андрей: «берём А, просто добавь показ айтемов твоей фразой»); порядок — как карточки на доске: 1924 · 1979 · 2014 · 2020 · 2022
    'v231y': {'ru': ['Что вы знаете о никотине?', 'За сто лет он менял форму пять раз:', 'Сигареты. «Джул». Айкос. Одноразки. Снюс.',
                     'Менялись упаковка, вкус и обещания — но не суть.', 'Начнём с самого знакомого…'],
              'en': ['What do you know about nicotine?', 'Over a century, it changed shape five times:', 'Cigarettes. JUUL. IQOS. Disposables. Pouches.',
                     'The packaging, the flavors, and the promises changed — the hook never did.', 'Let’s start with the one you know best…'],
              'de': ['Was wisst ihr über Nikotin?', 'In hundert Jahren hat es fünfmal die Form gewechselt:', 'Zigaretten. JUUL. IQOS. Einweg-Vapes. Nikotinbeutel.',
                     'Verpackung, Geschmack und Versprechen änderten sich – der Kern blieb.', 'Fangen wir mit dem an, das jeder kennt…']},
    'v232y': {'ru': ['Сигареты. «Джул». Одноразки. Айкос. Снюс.', 'И каждый раз — «способ бросить».', 'Угадаете, кто стоит за всеми пятью?', 'Начнём с самого знакомого…'],
              'en': ['Cigarettes. JUUL. Disposables. IQOS. Pouches.', 'And every time — “a way to quit.”', 'Can you guess who’s behind all five?', 'Let’s start with the one you know best…'],
              'de': ['Zigaretten. JUUL. Einweg-Vapes. IQOS. Nikotinbeutel.', 'Und jedes Mal – „ein Weg zum Aufhören“.', 'Ratet mal, wer hinter allen fünf steckt?', 'Fangen wir mit dem an, das jeder kennt…']},
}
LEAD = {'v231y': .4, 'v232y': .25}   # B: первый предмет падает уже на первом кадре


def build(ep, lang):
    T.TXT[lang] = TXT[ep][lang]; T.LEAD = LEAD[ep]
    R = T.build(lang); R['ep'] = f'{ep}-{lang}'; return R


if __name__ == '__main__':
    import sys
    for ep in TXT:
        if ep == 'v231y' and '--draft' not in sys.argv: continue   # v23.3: у A таймлайн по голосу — v233_tl.py
        for lang in ('ru',):
            R = build(ep, lang); p = os.path.join(HERE, 'tl', f'{ep}-{lang}.json'); json.dump(R, open(p, 'w'), ensure_ascii=False, indent=1)
            print(f"{p}: {R['dur']:.3f} с, {R['frames']} кадров; фразы " + ', '.join(f"{s['a']:.2f}–{s['b']:.2f}" for s in R['sent']))
