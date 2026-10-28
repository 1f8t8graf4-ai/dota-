# -*- coding: utf-8 -*-
# Задача gloss: все слова из реплик героев, которых нет в data/glossary.json (GLOSS_EN)
# -> data/gloss-dd.json = {"GLOSS_EN": {"слово": "перевод"}}.
# Формы как в тексте (shooting, rats); 1-2 значения через «;»; имена — «(имя)»;
# междометия — «(междометие)». Значения берутся из контекстной базы ctx, при возможности
# обобщаются до словарного перевода.
import json, re, subprocess, sys, io, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from dd_ctx_base import BASE, NAMES, GRAM, EXPRESSIONS

new_raw = subprocess.run(['git', 'show', 'origin/zai/dd-lines:data/games-new.json'],
                         capture_output=True, text=True, encoding='utf-8').stdout
lines = []
def walk(o):
    if isinstance(o, dict):
        if isinstance(o.get('a'), str) and 'deadlock' in o['a'] and o.get('en'):
            lines.append(o['en'])
        for v in o.values():
            walk(v)
    elif isinstance(o, list):
        for x in o:
            walk(x)
walk(json.loads(new_raw))
walk(json.load(open('data/games.json', encoding='utf-8')))

gloss = json.load(open('data/glossary.json', encoding='utf-8'))['GLOSS_EN']

INTERJ = {'ah', 'oh', 'uh', 'huh', 'ho', 'yeah', 'yes', 'no', 'alas', 'hello', 'hey', 'okay', 'rr', 'ah'}
SLANG_EQ = {  # птичий сленг и искажения героев -> словарная форма уже есть/нет
 "'cause": 'потому что', 'cause': 'потому что', 'ain\'t': 'разве есть; просторечное отрицание',
 'gonna': 'собираюсь', 'wanna': 'хочу', 'gotta': 'надо', 'dunno': 'не знаю',
 'kinda': 'типа', 'outta': 'прочь', 'lotta': 'куча', 'typa': 'тип',
 "enjoyin'": 'нравится', "lookin'": 'смотрится', "gettin'": 'получаешь', "havin'": 'получается',
 "playin'": 'играю', "pushin'": 'испытываю', "somethin'": 'что-нибудь', "nothin'": 'ничто',
 'venatah': 'Венатор, акцент героев', 'ya': 'ты', 'pal': 'дружище', 'buddy': 'дружище',
 'gal': 'девчонка', 'crumbum': 'фантик; ничтожество', 'tchotchkes': 'безделушки',
 'flooped': 'обмякло', 'mr': 'мистер', 'ms': 'миссис', 'miss': 'мисс',
}

out, missing = {}, []
for en in lines:
    for w in en.split():
        for part in w.split('-'):
            p = re.sub(r"[^A-Za-z'’]+", '', part).replace('’', "'").lower()
            if not p:
                continue
            if p in gloss or p in out:
                continue
            if p in NAMES:
                out[p] = '(имя)'
                continue
            if p in INTERJ:
                out[p] = '(междометие)'
                continue
            if p in SLANG_EQ:
                out[p] = SLANG_EQ[p]
                continue
            v = BASE.get(p)
            if v and v != '—':
                out[p] = v
            elif p in GRAM:
                out[p] = '(' + GRAM[p].split(',')[0].split(' ')[0] + ')'
            else:
                missing.append(p)

json.dump({'GLOSS_EN': out}, open('data/gloss-dd.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('слов без перевода в glossary:', sum(1 for w in out), '| добавлено:', len(out))
print('не нашлось значения:', len(missing), missing[:20])
# 20 самых частых из добавленных
from collections import Counter
cnt = Counter()
for en in lines:
    for w in en.split():
        for part in w.split('-'):
            p = re.sub(r"[^A-Za-z'’]+", '', part).replace('’', "'").lower()
            if p in out:
                cnt[p] += 1
print('топ-20 частых добавленных:', [w for w, _ in cnt.most_common(20)])
