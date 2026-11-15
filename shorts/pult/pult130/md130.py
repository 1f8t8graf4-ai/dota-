#!/usr/bin/env python3
"""bob130.json → BOB_130_TRANSITIONS_FOR_CLAUDE.md (тот же список, что в пульте, — для другого Claude)."""
import json
R = json.load(open('bob130.json', encoding='utf-8'))
TITLE = {'cola': 'ОТКРОЙ ГЛАЗА на Coca-Cola', 'starbucks': 'Что вы знаете о Starbucks', 'santa': 'ИГРЫ РАЗУМА: Сатана Клаус',
         'google': 'ОТКРОЙ ГЛАЗА на Google', 'apple': 'ОТКРОЙ ГЛАЗА на Apple', 'insta': 'Что вы знаете об Instagram',
         'davinci': 'Что вы знаете о Леонардо Да Винчи', 'wot': 'Что вы знаете о World of Tanks', 'mdk': 'MDK: СПАСЕТ МИР',
         'tinder': 'Что вы знаете о Tinder', 'madonna': 'Что вы знаете о Мадонне', 'sobolev': 'Что вы знаете о Николае Соболеве',
         'hovan': 'Что вы знаете о Хованском'}
DIFF = {'E': '🟢 ИЗИ', 'M': '🟡 СРЕДНЕ', 'H': '🔴 ЗАЁБ'}
def tc(t): m = int(t // 60); return f'{m}:{t - 60 * m:04.1f}'
L = ['# 130 приёмов Боба — список для Claude', '',
     'Тот же список, что в пульте https://claude.ai/artifact/6zC9afRinD6tGydLhVQetA (исходник — `bob130.json`).',
     'Текст — Gemini (15.11), таймкоды сверены с кадрами всех 13 роликов: каждый кусок показывает то, что описано.',
     'Клип приёма — `bob_fx_clips/fx_NNN.mp4` в странице пульта (`Artifact read`, `path`), в git видео нет — чужое.',
     'Отметки Андрея — база страницы, коллекция `fx` (doc id = номер); 🔥 ниже — из списка, в пульте его можно снять.', '']
cur = None; n = 0
for r in R:
    if r['v'] != cur:
        cur = r['v']; n += 1; L += [f"## {n}. {TITLE[cur]} (#{r['id']}–#{int(r['id']) + 9:03d})", '']
    head = f"**#{r['id']}** · {tc(r['a'])}–{tc(r['b'])} · [{' + '.join(r['tags'])}] **{r['n']}** — {r['s']}/10 · {DIFF[r['d']]}"
    if r['hot']: head += ' · 🔥 ХОЧУ'
    if r['x']: head += f" · 🧪 {r['x']}"
    L += [head, f"- Что в кадре: {r['w']}", f"- Техника кода: {r['tech']}", f"- Применение у нас: {r['ours']}",
          f"- Клип: `bob_fx_clips/fx_{r['id']}.mp4`", '']
open('BOB_130_TRANSITIONS_FOR_CLAUDE.md', 'w', encoding='utf-8').write('\n'.join(L))
print('ok', len(L))
