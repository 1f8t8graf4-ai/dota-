#!/usr/bin/env python3
"""v23.0 (21.11): пролог фильма «Что вы знаете о никотине?» — черновой таймлайн БЕЗ голоса (Андрей: «добро на интро, на голос — нет»).
Темп — как у Макса в главах 1–5: длина слова = 0,043 + 0,128 с на слог (подогнано по 978 словам его записи; слоги — гласные,
у EN/DE — группы гласных), между словами 0,08 с, после запятой +0,18 с, после тире +0,26 с, между фразами 0,34 с. Текст — вариант 2 (выбор Андрея), RU / EN / DE.
Когда будет голос, слова заменить распознанными — картинка привязана к номерам слов (ANCH в ep/v230/10-text.js) и подстроится сама.
Последний кадр пролога — кадр главы 1 за 1/30 с до её кадра 0: dur = целое число кадров, dur = время кадра 0 главы 1.
  python3 v230_tl.py → tl/v230y-ru.json, tl/v230y-en.json, tl/v230y-de.json"""
import json, math, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
TXT = {
    'ru': ['Что вы знаете о никотине?',
           'За сто лет он менял форму пять раз — от сигарет до белых пакетиков.',
           'Менялись упаковка, вкус и обещания — но не суть.',
           'Начнём с самого знакомого…'],
    'en': ['What do you know about nicotine?',
           'Over a century, it changed shape five times — from cigarettes to white pouches.',
           'The packaging, the flavors, and the promises changed — the hook never did.',
           'Let’s start with the one you know best…'],
    'de': ['Was wisst ihr über Nikotin?',
           'In hundert Jahren hat es fünfmal die Form gewechselt – von Zigaretten bis zu weißen Beuteln.',
           'Verpackung, Geschmack und Versprechen änderten sich – der Kern blieb.',
           'Fangen wir mit dem an, das jeder kennt…'],
}
LEAD, GAP, SENT, COMMA, DASH, TAIL = .4, .08, .34, .18, .26, .58   # TAIL — нырок камеры после последнего слова (кадр 0 главы 1)


def words(text):
    out = []
    for tok in text.split():
        if tok in ('—', '–'):
            if out: out[-1]['dash'] = True
            continue
        out.append({'d': tok})
    return out


def syl(word, lang):   # слоги: RU — гласные; EN/DE — группы гласных (у EN немая «e» на конце не считается)
    w = word.lower()
    if lang == 'ru': return max(1, len(re.findall(r'[аеёиоуыэюя]', w)))
    w = re.sub(r'[^a-zäöüß]', '', w); n = len(re.findall(r'[aeiouyäöü]+', w))
    if lang == 'en' and w.endswith('e') and not w.endswith('le') and n > 1: n -= 1
    return max(1, n)


def build(lang):
    t, sent = LEAD, []
    for i, text in enumerate(TXT[lang]):
        W = words(text); a0 = t
        for j, w in enumerate(W):
            d = .043 + .128 * syl(w['d'], lang) + (.18 if w['d'][-1] in '?.!…' else 0)
            w['a'], w['b'] = round(t, 3), round(t + d, 3)
            dash = w.pop('dash', False)
            if dash: w['d'] += '—'   # тире — к слову: субтитр на нём кончается (buildChunks)
            t += d + GAP + (COMMA if w['d'][-1] in ',:;' else 0) + (DASH if dash else 0)
        for w in W: w['c'] = ''
        sent.append({'i': i, 'scene': f's{i + 1}', 'a': round(a0, 3), 'b': W[-1]['b'], 'text': text, 'words': W})
        t = W[-1]['b'] + SENT
    N = math.ceil((sent[-1]['b'] + TAIL) * 30)
    return {'ep': f'v230y-{lang}', 'lang': lang, 'dur': round(N / 30, 6), 'fps': 30, 'voice': 'none', 'natural': True, 'draft': True,
            'endT': round(N / 30, 6), 'frames': N, 'sent': sent}


if __name__ == '__main__':
    for lang in TXT:
        T = build(lang); p = os.path.join(HERE, 'tl', f'v230y-{lang}.json')
        json.dump(T, open(p, 'w'), ensure_ascii=False, indent=1)
        print(f"{p}: {T['dur']:.3f} с, {T['frames']} кадров; фразы " + ', '.join(f"{s['a']:.2f}–{s['b']:.2f}" for s in T['sent']))
