# -*- coding: utf-8 -*-
"""
Сборка диалогов между девяткой героев (ТЗ-ZAI-реплики-25.10).
Говорящий определяется по префиксу аудиофайла (кодовое имя героя на вики).
Диалог = непрерывный отрезок обмена между одной парой (оба из девятки).
Выход: dd-lines-work/pairs.json + человекочитаемый pairs.txt
"""
import json, os, re, glob

DLG = '/home/z/my-project/dd-lines-work/dialogs'
OUTJ = '/home/z/my-project/dd-lines-work/pairs.json'
OUTT = '/home/z/my-project/dd-lines-work/pairs.txt'

SET = ['venator', 'rat-king', 'rem', 'grey-talon', 'celeste',
       'doorman', 'seven', 'deadman-danny', 'victor']
NAME = {'venator': 'Venator', 'rat-king': 'Rat King', 'rem': 'Rem',
        'grey-talon': 'Grey Talon', 'celeste': 'Celeste', 'doorman': 'Doorman',
        'seven': 'Seven', 'deadman-danny': 'Danny', 'victor': 'Victor'}

# кодовый префикс на вики -> слаг (проверено по дампам)
PREFIX = {
    'Priest': 'venator', 'Ratking': 'rat-king', 'Rat King': 'rat-king',
    'Familiar': 'rem', 'Orion': 'grey-talon', 'Grey Talon': 'grey-talon',
    'Unicorn': 'celeste', 'Celeste': 'celeste', 'Doorman': 'doorman',
    'Gigawatt': 'seven', 'Seven': 'seven', 'Frank': 'victor', 'Victor': 'victor',
    'Danny': 'deadman-danny', 'Deadman': 'deadman-danny', 'Deadpack': 'deadman-danny',
}

def speaker_of(url, owner_prefix):
    fn = url.rsplit('/', 1)[-1]
    tok = fn.split('_')[0]
    if tok in PREFIX:
        return PREFIX[tok]
    return None

def main():
    pairs = []
    for f in sorted(glob.glob(DLG + '/*.json')):
        hero = f.split('/')[-1][:-5]
        for g in json.load(open(f)):
            # аннотируем говорящих
            turns = []
            for t in g['turns']:
                s = speaker_of(t['url'], hero)
                turns.append({'s': s, 'en': t['en'], 'file': t['url'].rsplit('/', 1)[-1], 'url': t['url']})
            # разбиваем на непрерывные прогоны одной пары
            run = []
            def flush():
                if len(run) >= 3:
                    sp = {t['s'] for t in run}
                    if len(sp) == 2 and sp <= set(SET):
                        pairs.append({'via': hero, 'sec': g['sec'], 'sub': g['sub'],
                                      'pair': sorted(sp), 'turns': list(run)})
            for t in turns:
                if t['s'] is None:
                    flush(); run = []; continue
                if run:
                    last_pair = {run[0]['s'], t['s']}
                    prev = {x['s'] for x in run}
                    if len(prev | last_pair) > 2:
                        flush(); run = []
                run.append(t)
            flush()
    # дедуп (одинаковый обмен может встретиться на страницах обоих героев)
    seen, uniq = set(), []
    for p in pairs:
        key = tuple(t['file'] for t in p['turns'])
        if key in seen:
            continue
        seen.add(key)
        uniq.append(p)
    json.dump(uniq, open(OUTJ, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    with open(OUTT, 'w', encoding='utf-8') as f:
        for i, p in enumerate(uniq, 1):
            f.write('=== #%d %s <-> %s | %s | %s | %d реплик\n' % (
                i, NAME[p['pair'][0]], NAME[p['pair'][1]], p['sec'], p['sub'], len(p['turns'])))
            for t in p['turns']:
                f.write('   %-9s| %s\n' % (NAME.get(t['s'], t['s'])[:9], t['en']))
            f.write('\n')
    from collections import Counter
    print('кандидатов-диалогов:', len(uniq))
    print('по парам:', Counter(tuple(sorted(p['pair'])) for p in uniq).most_common())

if __name__ == '__main__':
    main()
