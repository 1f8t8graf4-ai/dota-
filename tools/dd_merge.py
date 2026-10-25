#!/usr/bin/env python3
# 25.10 — вливает реплики Z.ai (data/games-new.json из ветки zai/dd-lines) в data/games.json.
#   python3 tools/dd_merge.py <games-new.json>        → data/games.json (потом tools/rebuild_all_data.py)
# Что делает:
# - новые герои (Doorman, Seven, Deadman Danny, Victor) — в список героев, пока без роликов: в приложении их не видно,
#   пока у них нет живого портрета (правило 13.9.63: диалог виден, только если у всех его героев есть ролик);
# - новые диалоги — в конец списка диалогов каждого участника (номера старых диалогов не меняются: по ним комнаты Versus,
#   sid = dd:deadlock:<герой>:<номер>), повторы по тексту не добавляются;
# - фразы героя (15 лучших, у Дормена — все) — поле phr: [{en, ru, tag, use, a}];
# - у каждого героя: icon — вертикальный арт (icon-<id>.png), mini — голова 128×128 (mini/<id>.png) — оба в R2;
# - ролики: venator-2 / rat-king-2 (петли 25.10) и fx — где лицо по ширине кадра.
import json, sys

D = 'scenes/games/deadlock/'
VID = {'venator': ('venator-2.mp4', 0.60), 'rat-king': ('rat-king-2.mp4', 0.45)}
# правки переводов Z.ai (кальки): английский текст → русский
RU = {
    "We do this on my time, ya crumbum.": "Всё будет, когда я скажу, мелюзга.",
    "Who's exterminating who now!": "Ну и кто теперь кого травит!",
    "Picked the wrong fight!": "Не с тем связался!",
}

def main():
    new = json.load(open(sys.argv[1], encoding='utf-8'))
    p = 'data/games.json'
    G = json.load(open(p, encoding='utf-8'))
    gm = G['GAMES']['deadlock']
    H = gm['heroes']
    by_name = {h['name']: h for h in H}
    by_id = {h['id']: h for h in H}
    for hid, nh in new['heroes'].items():
        if hid not in by_id:
            h = {'id': hid, 'name': nh['name'], 'role': '', 'dialogs': []}
            H.append(h); by_id[hid] = h; by_name[h['name']] = h
    for h in H:
        h['icon'] = D + 'icon-' + h['id'] + '.png'
        h['mini'] = D + 'mini/' + h['id'] + '.png'
        if h['id'] in VID:
            h['img'] = D + VID[h['id']][0]; h['fx'] = VID[h['id']][1]
        nh = new['heroes'].get(h['id'])
        if nh:
            h['phr'] = [{k: x[k] for k in ('en', 'ru', 'tag', 'use', 'a') if k in x} for x in nh['lines']]
            for x in h['phr']: x['ru'] = RU.get(x['en'], x['ru'])
    added = 0
    for d in new['dialogs']:
        names = []
        for l in d['lines']:
            if l['s'] not in names: names.append(l['s'])
        key = '|'.join(l['en'] for l in d['lines'])
        for l in d['lines']: l['ru'] = RU.get(l['en'], l['ru'])
        dd = {k: d[k] for k in ('ctx', 'about', 'use', 'lines', 'vocab') if k in d}
        for n in names:
            h = by_name.get(n)
            if not h: print('нет героя', n); continue
            if any('|'.join(l['en'] for l in x['lines']) == key for x in h['dialogs']): continue
            h['dialogs'].append(dd); added += 1
    json.dump(G, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    open(p, 'a', encoding='utf-8').write('\n')
    print('героев', len(H), '· диалогов добавлено (по героям)', added, '· фраз', sum(len(h.get('phr', [])) for h in H))

if __name__ == '__main__':
    main()
