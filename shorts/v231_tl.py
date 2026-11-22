#!/usr/bin/env python3
"""v23.1 (22.11): черновые таймлайны двух прологов БЕЗ голоса (как v230_tl.py — темп Макса по слогам).
  A — v231y: текст v23.0 (ТЗ Gemini, вариант 2): «Что вы знаете о никотине? / За сто лет он менял форму пять раз — от сигарет до белых пакетиков. /
            Менялись упаковка, вкус и обещания — но не суть. / Начнём с самого знакомого…»
  B — v232y: «Сигареты. «Джул». Одноразки. Айкос. Снюс. / И каждый раз — «способ бросить». / Угадаете, кто стоит за всеми пятью? /
            Начнём с самого знакомого…» (титул «Что вы знаете о никотине?» — на экране с первого кадра, вслух не читается)
Когда будет голос — слова заменить распознанными (картинка привязана к номерам слов: ANCH в ep/v231/10-text.js).
  python3 v231_tl.py → tl/v231y-ru.json, tl/v232y-ru.json (EN/DE — после выбора варианта)"""
import json, math, os
import v230_tl as T

HERE = os.path.dirname(os.path.abspath(__file__))
TXT = {
    'v231y': {'ru': T.TXT['ru'], 'en': T.TXT['en'], 'de': T.TXT['de']},
    'v232y': {'ru': ['Сигареты. «Джул». Одноразки. Айкос. Снюс.', 'И каждый раз — «способ бросить».', 'Угадаете, кто стоит за всеми пятью?', 'Начнём с самого знакомого…'],
              'en': ['Cigarettes. JUUL. Disposables. IQOS. Pouches.', 'And every time — “a way to quit.”', 'Can you guess who’s behind all five?', 'Let’s start with the one you know best…'],
              'de': ['Zigaretten. JUUL. Einweg-Vapes. IQOS. Nikotinbeutel.', 'Und jedes Mal – „ein Weg zum Aufhören“.', 'Ratet mal, wer hinter allen fünf steckt?', 'Fangen wir mit dem an, das jeder kennt…']},
}
LEAD = {'v231y': .4, 'v232y': .25}   # B: первый предмет падает уже на первом кадре


def build(ep, lang):
    T.TXT[lang] = TXT[ep][lang]; T.LEAD = LEAD[ep]
    R = T.build(lang); R['ep'] = f'{ep}-{lang}'; return R


if __name__ == '__main__':
    for ep in TXT:
        for lang in ('ru',):
            R = build(ep, lang); p = os.path.join(HERE, 'tl', f'{ep}-{lang}.json'); json.dump(R, open(p, 'w'), ensure_ascii=False, indent=1)
            print(f"{p}: {R['dur']:.3f} с, {R['frames']} кадров; фразы " + ', '.join(f"{s['a']:.2f}–{s['b']:.2f}" for s in R['sent']))
