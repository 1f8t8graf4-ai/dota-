#!/usr/bin/env python3
"""Пульт 195 приёмов Боба — простым текстом для Gemini (без путей к файлам и кода).
  python3 pult_txt.py → ПУЛЬТ-195-для-Gemini.txt"""
import json, os
H = os.path.dirname(os.path.abspath(__file__))
L = json.load(open(os.path.join(H, 'bob195.json')))
V = [('cola', 'ОТКРОЙ ГЛАЗА на Coca-Cola'), ('starbucks', 'Что вы знаете о Starbucks'), ('santa', 'ИГРЫ РАЗУМА: Сатана Клаус'),
     ('google', 'ОТКРОЙ ГЛАЗА на Google'), ('apple', 'ОТКРОЙ ГЛАЗА на Apple'), ('insta', 'Что вы знаете об Instagram'),
     ('davinci', 'Что вы знаете о Леонардо Да Винчи'), ('wot', 'Что вы знаете о World of Tanks'), ('mdk', 'MDK: СПАСЕТ МИР'),
     ('tinder', 'Что вы знаете о Tinder'), ('madonna', 'Что вы знаете о Мадонне'), ('sobolev', 'Что вы знаете о Николае Соболеве'),
     ('hovan', 'Что вы знаете о Хованском')]
D = {'E': 'легко', 'M': 'средне', 'H': 'сложно'}
mm = lambda s: f'{int(s // 60)}:{s % 60:04.1f}'
out = ['ПУЛЬТ: 195 ПРИЁМОВ БОБА — СПИСОК ДЛЯ GEMINI', '',
       'Что это:', '- 13 роликов «Знакомьтесь, Боб», в каждом 15 приёмов.',
       '- Номер приёма (#001…#195) — то, что пишем в раскадровке в колонке «приём».',
       '- По каждому приёму:', '  - ролик и время в нём;', '  - тип: ПЕРЕХОД / АНИМАЦИЯ / ХУД. ЭЛЕМЕНТ;',
       '  - оценка 1–10 и сложность для Claude (легко / средне);', '  - что в кадре;', '  - как это сделать в коде;', '  - где это пригодилось бы у нас.',
       '- 🔥 — пометка «хочу» из первого списка.', '- ⚠ — поправка Claude: описание расходилось с роликом.',
       '- Клипов здесь нет, только описания. Смотреть приём глазами — в пульте у Андрея.', '']
for k, name in V:
    xs = sorted([x for x in L if x['v'] == k], key=lambda x: int(x['id']))
    out += ['=' * 70, f'{name.upper()}  (#{xs[0]["id"]}–#{xs[9]["id"]}, #{xs[10]["id"]}–#{xs[-1]["id"]})', '=' * 70, '']
    for x in xs:
        out.append(f'#{x["id"]} · {mm(x["a"])}–{mm(x["b"])} · {" + ".join(x["tags"])} · {x["s"]}/10 · {D.get(x["d"], x["d"])}{" · 🔥" if x.get("hot") else ""}')
        out.append(f'   {x["n"]}')
        out.append(f'   Что в кадре: {x["w"]}')
        if x.get('tech'): out.append(f'   Как сделать: {x["tech"]}')
        if x.get('ours'): out.append(f'   У нас: {x["ours"]}')
        if x.get('x'): out.append(f'   ⚠ {x["x"]}')
        out.append('')
open(os.path.join(H, 'ПУЛЬТ-195-для-Gemini.txt'), 'w').write('\n'.join(out))
print(len(L), 'приёмов,', len(out), 'строк')
