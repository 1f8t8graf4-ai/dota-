# -*- coding: utf-8 -*-
"""
Сборка data/games-new.json (ТЗ-ZAI-реплики-25.10):
12 диалогов + фразы 9 героев + полный ульт-набор Дормена.
Аудио: сырой кэш (md5(url)) -> mono 80k -> ветка heroes-voice/<hero>/<hero>-<NN>.mp3
a в json = будущий ключ R2 scenes/games/deadlock/v/<hero>-<NN>.mp3 (заливает Клауд).
"""
import json, os, re, sys, hashlib, subprocess
sys.path.insert(0, '/home/z/my-project/scripts')
from dd_data_dialogs import DIALOGS
from dd_data_phrases import PHRASES
from dd_data_doorman import RU_LIST

REPO = '/home/z/my-project/dota-repo'
DLG = '/home/z/my-project/dd-lines-work'
RAW = os.path.join(DLG, 'raw')
SLUGS = ['venator', 'rat-king', 'rem', 'grey-talon', 'celeste',
         'doorman', 'seven', 'deadman-danny', 'victor']
NAME = {'venator': 'Venator', 'rat-king': 'Rat King', 'rem': 'Rem',
        'grey-talon': 'Grey Talon', 'celeste': 'Celeste', 'doorman': 'Doorman',
        'seven': 'Seven', 'deadman-danny': 'Deadman Danny', 'victor': 'Victor'}
DISP2SLUG = {v: k for k, v in NAME.items()}
UA = ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

def wiki_url(file):
    return 'https://cdn.deadlock.wiki/' + file

def raw_path(url):
    return os.path.join(RAW, hashlib.md5(url.encode()).hexdigest()[:16] + '.mp3')

def ensure_raw(url):
    p = raw_path(url)
    if os.path.exists(p) and os.path.getsize(p) > 0:
        return p
    import urllib.request
    for i in range(3):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=90) as r, open(p + '.tmp', 'wb') as f:
                f.write(r.read())
            os.rename(p + '.tmp', p)
            return p
        except Exception as e:
            err = e
    raise RuntimeError('не качается %s: %r' % (url, err))

def transcode(src, dest):
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        return
    r = subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', src,
                        '-ac', '1', '-b:a', '80k', dest], capture_output=True, timeout=120)
    if r.returncode != 0:
        raise RuntimeError('ffmpeg: ' + r.stderr.decode('utf-8', 'replace')[-200:])

def norm_key(s):
    return re.sub(r"[^a-z0-9]", '', s.lower())

def main():
    # индексы: парные реплики (диалоги) и дампы героев
    pairs = json.load(open(os.path.join(DLG, 'pairs.json')))
    dumps = {s: json.load(open('%s/data/dd-lines/%s.json' % (REPO, s))) for s in SLUGS}
    spec = json.load(open(os.path.join(DLG, 'doorman-special.json')))
    assert len(spec) == len(RU_LIST), 'Дормен: %d против %d переводов' % (len(spec), len(RU_LIST))

    # --- план аудио: hero -> [(url, wiki_file)] уникально, с назначением NN
    plan = {s: [] for s in SLUGS}
    used = {s: set() for s in SLUGS}
    def take(hero, url, wf):
        if url in used[hero]:
            return
        used[hero].add(url)
        plan[hero].append((url, wf))

    # диалоги: реплика -> url по (en, speaker) в pairs.json
    def pair_url(spk_slug, en):
        for p in pairs:
            for t in p['turns']:
                if t['s'] == spk_slug and t['en'] == en:
                    return t['url'], t['file']
        return None

    missing = []
    for d in DIALOGS:
        for spk, en, ru in d['lines']:
            hero = DISP2SLUG[spk]
            hit = pair_url(hero, en)
            if not hit:  # запасной поиск в дампе героя
                cands = [e for e in dumps[hero] if e['en'] == en]
                if cands:
                    hit = (cands[0]['url'], cands[0]['file'])
            if not hit:
                missing.append(('dialog', hero, en))
                continue
            take(hero, hit[0], hit[1])

    # фразы героев
    phrase_en = {s: set() for s in SLUGS}
    for hero, items in PHRASES.items():
        for en, ru, tag, use in items:
            phrase_en[hero].add(en)
            cands = [e for e in dumps[hero] if e['en'] == en and e['file'].rsplit('_', 1)[0]]
            if not cands:
                # запасной поиск по нормализации
                cands = [e for e in dumps[hero] if norm_key(e['en']) == norm_key(en)]
            if not cands:
                missing.append(('phrase', hero, en))
                continue
            take(hero, wiki_url(cands[0]['file']), cands[0]['file'])

    # спец-набор Дормена
    for e in spec:
        take('doorman', wiki_url(e['file']), e['file'])

    if missing:
        print('НЕ НАЙДЕНО:')
        for m in missing:
            print('  ', m)
        sys.exit(2)

    # --- пережим и нумерация
    num = {}
    for hero in SLUGS:
        outdir = os.path.join(REPO, 'heroes-voice', hero)
        os.makedirs(outdir, exist_ok=True)
        for i, (url, wf) in enumerate(plan[hero], 1):
            nn = '%02d' % i
            num[(hero, url)] = nn
            dest = os.path.join(outdir, '%s-%s.mp3' % (hero, nn))
            try:
                transcode(ensure_raw(url), dest)
            except Exception as ex:
                print('ОШИБКА аудио %s-%s: %r' % (hero, nn, ex))
                sys.exit(3)

    def a_of(hero, url):
        return 'scenes/games/deadlock/v/%s-%s.mp3' % (hero, num[(hero, url)])

    # --- сборка json
    dialogs_out = []
    for d in DIALOGS:
        lines = []
        for spk, en, ru in d['lines']:
            hero = DISP2SLUG[spk]
            hit = pair_url(hero, en)
            if not hit:
                cands = [e for e in dumps[hero] if e['en'] == en]
                hit = (cands[0]['url'], cands[0]['file'])
            lines.append({'s': spk, 'en': en, 'ru': ru, 'a': a_of(hero, hit[0])})
        dialogs_out.append({'ctx': d['ctx'], 'about': d['about'], 'use': d['use'],
                            'hook': d['hook'], 'hook_why': d['why'],
                            'lines': lines,
                            'vocab': [{'w': w, 'r': r} for w, r in d['vocab']]})

    heroes_out = {}
    for hero in SLUGS:
        items = []
        for en, ru, tag, use in PHRASES[hero]:
            cands = [e for e in dumps[hero] if e['en'] == en] or \
                    [e for e in dumps[hero] if norm_key(e['en']) == norm_key(en)]
            items.append({'en': en, 'ru': ru, 'tag': tag, 'use': use, 'a': a_of(hero, wiki_url(cands[0]['file']))})
        if hero == 'doorman':
            for e, ru in zip(spec, RU_LIST):
                u = wiki_url(e['file'])
                if u in used['doorman'] and ('doorman', u) in num:
                    wc = len(re.findall(r"[A-Za-z']+", e['en']))
                    items.append({'en': e['en'], 'ru': ru, 'tag': 'ult',
                                  'use': 2 if wc > 14 else 3, 'a': a_of(hero, u)})
        heroes_out[hero] = {'name': NAME[hero], 'lines': items}

    out = {
        '_note': 'Часть Б по ТЗ-ZAI-реплики-25.10 (ZAI, 25.10). Только новое: 12 диалогов между девяткой '
                 '+ по 10-15 фраз на героя + полный ульт/портье-набор Дормена (tag:"ult"). '
                 'mp3 лежат в ветке heroes-voice/<hero>/, ключ a = куда Клауд зальёт в R2. '
                 'Переводы ZAI, мат как в оригинале.',
        'dialogs': dialogs_out,
        'heroes': heroes_out,
    }
    json.dump(out, open(os.path.join(REPO, 'data/games-new.json'), 'w', encoding='utf-8'),
              ensure_ascii=False, indent=1)
    # сводка
    n_dl = sum(len(d['lines']) for d in dialogs_out)
    print('диалогов: %d, реплик в них: %d' % (len(dialogs_out), n_dl))
    for hero in SLUGS:
        n = len(heroes_out[hero]['lines'])
        n_ult = sum(1 for x in heroes_out[hero]['lines'] if x.get('tag') == 'ult')
        print('  %-13s фраз: %3d%s' % (hero, n, (' (из них ult: %d)' % n_ult) if n_ult else ''))
    sz = sum(os.path.getsize(os.path.join(r, f))
             for r, _, fs in os.walk(os.path.join(REPO, 'heroes-voice')) for f in fs)
    print('аудио всего: %.1f МБ' % (sz / 1048576))

if __name__ == '__main__':
    main()
