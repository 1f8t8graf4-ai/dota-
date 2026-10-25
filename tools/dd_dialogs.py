# -*- coding: utf-8 -*-
"""
Парсер диалогов (ТЗ-ZAI-реплики-25.10): по таблицам /Voice lines.
Один <tr> = ход говорящего: ячейка с героем (hero-link-wrapper) + его реплики
(inline-audio + audio-text). Таблица = кандидат в диалог.
Выход: dd-lines-work/dialogs/<slug>.json — группы ходов + фразы-кандидаты.
"""
import json, os, re, sys, time, html as H
import urllib.request, urllib.parse

BASE = 'https://deadlock.wiki/api.php'
UA = ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
OUT = '/home/z/my-project/dd-lines-work/dialogs'
HEROES = ['Venator', 'Rat King', 'Rem', 'Grey Talon', 'Celeste',
          'The Doorman', 'Seven', 'Deadman Danny', 'Victor']

def api(params, tries=4):
    params = dict(params, format='json', formatversion='2')
    url = BASE + '?' + urllib.parse.urlencode(params)
    last = None
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.loads(r.read().decode('utf-8'))
        except Exception as e:
            last = e
            time.sleep(2 + 2 * i)
    raise last

def clean(s):
    s = H.unescape(re.sub(r'<[^>]+>', '', s))
    s = s.replace('[edit]', '')
    return re.sub(r'\s+', ' ', s).strip()

def norm(s):
    return re.sub(r'[^a-z0-9]', '', str(s).lower())

SLUG = {'venator': 'venator', 'ratking': 'rat-king', 'rem': 'rem',
        'greytalon': 'grey-talon', 'celeste': 'celeste', 'thedoorman': 'doorman',
        'seven': 'seven', 'deadmandanny': 'deadman-danny', 'victor': 'victor'}

def parse(page):
    d = api({'action': 'parse', 'page': page, 'prop': 'text'})
    h = d['parse']['text']
    owner = page.split('/')[0]
    events = []
    for m in re.finditer(r'<h([23])[^>]*>(.*?)</h\1>|<tr>(.*?)</tr>', h, re.S):
        if m.group(1):
            hm = re.search(r'<span class="mw-headline"[^>]*>(.*?)</span>', m.group(2), re.S)
            t = re.sub(r'\[\s*edit\s*\]', '', clean(hm.group(1) if hm else m.group(2))).strip()
            events.append(('h' + m.group(1), t))
        else:
            events.append(('tr', m.group(3)))

    h2 = h3 = None
    groups = []          # диалоги-кандидаты
    cur = None           # текущая группа {sec, h3, turns}
    speakers = ['']      # стек говорящих по rowspan
    rows_left = 0

    def flush():
        nonlocal cur
        if cur and cur['turns']:
            groups.append(cur)
        cur = None

    for kind, val in events:
        if kind in ('h2', 'h3'):
            flush()
            if kind == 'h2':
                h2, h3 = val, None
                speakers = ['']
                rows_left = 0
            else:
                h3 = val
        else:
            row = val
            # заголовок таблицы -> новая группа
            if '<th' in row[:120]:
                flush()
                speakers = ['']
                rows_left = 0
                continue
            cells = re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', row, re.S)
            if not cells:
                continue
            # герой-ячейка?
            row_speaker = None
            rowspan = 1
            for c in cells:
                hm = re.search(r'hero-link-wrapper[^>]*>.*?title="([^"]+)"', c, re.S)
                if hm:
                    row_speaker = hm.group(1)
                    rm = re.search(r'rowspan="?(\d+)', c)
                    if rm:
                        rowspan = int(rm.group(1))
                    break
            if row_speaker:
                speakers = [row_speaker] + [''] * (rowspan - 1)
            spk = next((s for s in speakers if s), None) or owner
            if rows_left > 0:
                rows_left -= 1
            # реплики: (audio, text) по ячейкам
            pairs = []
            for c in cells:
                us = re.findall(r'data-url="([^"]+)"', c)
                ts = [clean(t) for t in re.findall(r'audio-text[^"]*"[^>]*>\s*<a[^>]*>(.*?)</a>', c, re.S)]
                ts = [t for t in ts if t]
                if not us:
                    continue
                for i, u in enumerate(us):
                    pairs.append((H.unescape(u), ts[i] if i < len(ts) else ''))
            if not pairs:
                continue
            if cur is None:
                cur = {'sec': (h2 or ''), 'sub': (h3 or ''), 'turns': []}
            for u, t in pairs:
                if t:
                    cur['turns'].append({'s': spk, 'en': t, 'url': u})
    flush()
    return groups

def main():
    os.makedirs(OUT, exist_ok=True)
    for hero in HEROES:
        try:
            groups = parse(hero + '/Voice lines')
        except Exception as e:
            print('[%s] ПРОВАЛ %r' % (hero, e))
            continue
        # группы с >=2 репликами и >=2 говорящими = кандидаты в диалоги;
        # группы одного героя — тоже сохранить (монологи партнёра)
        res = []
        for g in groups:
            spk = {t['s'] for t in g['turns']}
            if len(g['turns']) < 2:
                continue
            res.append({'sec': g['sec'], 'sub': g['sub'], 'n': len(g['turns']),
                        'who': sorted(spk), 'turns': g['turns']})
        slug = SLUG.get(norm(hero), norm(hero))
        jp = os.path.join(OUT, slug + '.json')
        json.dump(res, open(jp, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        multi = sum(1 for r in res if len(r['who']) > 1)
        print('[%s] групп: %d (с 2+ говорящими: %d) -> %s' % (hero, len(res), multi, jp))

if __name__ == '__main__':
    main()
