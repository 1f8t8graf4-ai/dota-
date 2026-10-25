# -*- coding: utf-8 -*-
"""
Скачивает арты ВСЕХ героев deadlock.wiki (Category:Heroes).
На каждого героя: Render (полный арт), portrait, card, vertical, select_background.
Папки: download/deadlock-heroes/все-герои/NN-<Page>/ , файлы <slug>-<type>.png
Порядок NN = порядок героев в tools/bg-prompts.json (Kлаудов порядок промтов),
лишние/новые герои — в конце с пометкой.
Инкрементно: если <slug>-full.png уже скачан — герой пропускается.
UA обязателен (иначе 403).
"""
import json, os, re, sys, time, shutil
import urllib.request, urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE = 'https://deadlock.wiki/api.php'
UA = ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
OUT = '/home/z/my-project/download/deadlock-heroes/все-герои'
REPO_JSON = '/home/z/my-project/dota-repo/tools/bg-prompts.json'

RU_NAMES = {
    'venator': 'Венатор', 'rat-king': 'Крысиный король', 'rem': 'Рем',
    'grey-talon': 'Грей Талон', 'celeste': 'Селеста', 'abrams': 'Абрамс',
    'apollo': 'Аполлон', 'baba': 'Баба Яга', 'bebop': 'Бебоп', 'billy': 'Билли',
    'calico': 'Калико', 'doorman': 'Дормен (The Doorman)', 'drifter': 'Дрифтер',
    'dynamo': 'Динамо', 'graves': 'Грейвс', 'haze': 'Хейз', 'holliday': 'Холлидей',
    'infernus': 'Инфернус', 'ivy': 'Айви', 'kelvin': 'Кельвин',
    'lady-geist': 'Леди Гейст', 'lash': 'Лэш', 'mcginnis': 'Макгиннис',
    'mina': 'Мина', 'mirage': 'Мираж', 'mo-krill': 'Мо и Крилл', 'paige': 'Пейдж',
    'paradox': 'Парадокс', 'pocket': 'Покет', 'seven': 'Севен', 'shiv': 'Шив',
    'silver': 'Сильвер', 'sinclair': 'Синклер', 'victor': 'Виктор',
    'vindicta': 'Виндикта', 'viscous': 'Вискоус', 'vyper': 'Вайпер',
    'warden': 'Уорден', 'wraith': 'Рейф', 'yamato': 'Ямато',
}

def api(params, tries=3):
    params = dict(params)
    params['format'] = 'json'
    url = BASE + '?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    last = None
    for i in range(tries):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.loads(r.read().decode('utf-8'))
        except Exception as e:
            last = e
            time.sleep(2 + i * 2)
    raise last

def download(url, dest, tries=3):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    last = None
    for i in range(tries):
        try:
            with urllib.request.urlopen(req, timeout=120) as r, open(dest, 'wb') as f:
                while True:
                    chunk = r.read(65536)
                    if not chunk:
                        break
                    f.write(chunk)
            return os.path.getsize(dest)
        except Exception as e:
            last = e
            time.sleep(2 + i * 2)
            if os.path.exists(dest):
                os.remove(dest)
    raise last

def norm(s):
    return re.sub(r'[^a-z0-9]', '', str(s).lower())

def page_images(page):
    imgs = api({'action': 'parse', 'page': page, 'prop': 'images'})
    return imgs.get('parse', {}).get('images', []) or []

def pick(files, page):
    """возвращает [(typ, filename|None)]"""
    pl = page.lower()
    nl = norm(page)
    def find(pred):
        for f in files:
            fl = f.lower().replace('file:', '')
            if pred(fl):
                return f
        return None
    return [
        ('full',      find(lambda f: nl in norm(f) and 'render' in f)),
        ('card',      find(lambda f: 'card' in f and nl in norm(f))),
        ('vertical',  find(lambda f: 'vertical' in f and nl in norm(f))),
        ('portrait',  find(lambda f: f == (pl.replace(' ', '_') + '.png'))),
        ('select-bg', find(lambda f: 'select' in f and 'background' in f and nl in norm(f))),
    ]

def main():
    d = json.load(open(REPO_JSON, encoding='utf-8'))
    heroes = [it for it in d['items'] if it.get('kind') == 'hero']
    known = []
    for it in heroes:
        slug = it.get('hero')
        m = re.search(r'deadlock\.wiki\s*→\s*([^→]+?)\s*→', it.get('art') or '')
        known.append((slug, m.group(1).strip() if m else ''))

    cat = api({'action': 'query', 'list': 'categorymembers',
               'cmtitle': 'Category:Heroes', 'cmtype': 'page', 'cmlimit': 500})
    members = [m['title'] for m in cat['query']['categorymembers']]
    print('Category:Heroes — %d страниц' % len(members))

    def resolve(slug, guess):
        g = norm(guess) or norm(slug.replace('-', ''))
        p = None
        for t in members:
            if norm(t) == g:
                p = t
                break
        if p is None:
            for t in members:
                if norm(t) == norm(slug.replace('-', '')):
                    p = t
                    break
        if p is None:
            p = guess
        # если на странице нет нужных артов — ищем страницу-содержащую (Doorman→The Doorman)
        try:
            files = page_images(p)
        except Exception:
            files = []
        if not any(fn for _, fn in pick(files, p)):
            for t in members:
                if norm(t) != norm(p) and norm(p) in norm(t):
                    try:
                        f2 = page_images(t)
                    except Exception:
                        continue
                    if any(fn for _, fn in pick(f2, t)):
                        print('  ! %s: артов нет на «%s», беру «%s»' % (slug, p, t))
                        p = t
                        break
        return p

    tasks, used = [], set()
    for i, (slug, guess) in enumerate(known, 1):
        p = resolve(slug, guess)
        tasks.append((i, slug, p))
        used.add(norm(p))
    extra = [t for t in members if norm(t) not in used]
    for j, t in enumerate(extra, len(tasks) + 1):
        tasks.append((j, norm(t).lower(), t))

    os.makedirs(OUT, exist_ok=True)
    manifest = []

    def job(t):
        NN, slug, page = t
        folder = os.path.join(OUT, '%02d-%s' % (NN, page.replace(' ', '_')))
        # инкремент: уже скачан full — пропускаем
        if os.path.isdir(folder):
            have = [f for f in os.listdir(folder)
                    if f.startswith(slug + '-') and f.endswith('.png')
                    and os.path.getsize(os.path.join(folder, f)) > 0]
            if any(f.endswith('-full.png') for f in have):
                got = []
                for f in have:
                    typ = f[len(slug) + 1:-4]
                    got.append((typ, f, os.path.getsize(os.path.join(folder, f))))
                return (NN, slug, page, got, ['уже скачано'], folder)
        try:
            files = page_images(page)
        except Exception as e:
            return (NN, slug, page, [], ['ОШИБКА api.parse: %s' % e], folder)
        wanted = pick(files, page)
        got, note = [], []
        for typ, fname in wanted:
            if not fname:
                note.append('нет ' + typ)
                continue
            fclean = fname.replace('file:', '')
            params = {'action': 'query', 'titles': 'File:' + fclean,
                      'prop': 'imageinfo', 'iiprop': 'url|size', 'formatversion': 2}
            if typ in ('select-bg', 'card', 'vertical', 'portrait'):
                params['iiurlwidth'] = 1600 if typ == 'select-bg' else 1000
            try:
                info = api(params)
                pg = info['query']['pages'][0]
                ii = pg.get('imageinfo', [{}])[0]
                url = ii.get('thumburl') or ii.get('url')
                if not url:
                    note.append('нет url ' + typ)
                    continue
                os.makedirs(folder, exist_ok=True)
                dest = os.path.join(folder, '%s-%s.png' % (slug, typ))
                size = download(url, dest)
                got.append((typ, os.path.basename(dest), size))
            except Exception as e:
                note.append('ОШИБКА %s: %s' % (typ, e))
        return (NN, slug, page, got, note, folder)

    results = []
    with ThreadPoolExecutor(max_workers=5) as ex:
        futs = {ex.submit(job, t): t for t in tasks}
        for fu in as_completed(futs):
            r = fu.result()
            results.append(r)
            NN, slug, page, got, note, _ = r
            sz = sum(g[2] for g in got)
            print('%02d %-14s %-16s %d файлов, %.1f МБ %s' % (
                NN, slug, page, len(got), sz / 1048576.0,
                ('| ' + '; '.join(note)) if note else ''))

    results.sort(key=lambda r: r[0])
    # выбрасываем мусор: служебные страницы без артов и дубли
    manifest = []
    for r in results:
        NN, slug, page, got, note, folder = r
        is_known = NN <= len(known)
        if not got and not is_known:
            if os.path.isdir(folder) and not os.listdir(folder):
                os.rmdir(folder)
            continue
        manifest.append(r)

    total = sum(g[2] for r in manifest for g in r[3])
    nfiles = sum(len(r[3]) for r in manifest)
    lines = ['АРТЫ ГЕРОЕВ deadlock.wiki — %d героев, %d файлов, %.1f МБ' % (
        len(manifest), nfiles, total / 1048576.0), '']
    for NN, slug, page, got, note, _ in manifest:
        ru = RU_NAMES.get(slug, '')
        mark = '' if NN <= len(known) else '  [нет в bg-prompts — новый/тест-герой]'
        lines.append('%02d. %s%s (wiki: %s)%s' % (
            NN, slug, (' — ' + ru) if ru else '', page, mark))
        for typ, fn, size in got:
            lines.append('     %-10s %s (%.2f МБ)' % (typ, fn, size / 1048576.0))
        if note:
            lines.append('     ! ' + '; '.join(note))
    lines.append('')
    lines.append('ДЛЯ ГЕНЕРАЦИИ ВИДЕО БРАТЬ <slug>-full.png (полный арт в полный рост)')
    open(os.path.join(OUT, 'СПИСОК-героев.txt'), 'w', encoding='utf-8').write('\n'.join(lines))
    print('\nИТОГ: %d героев, %d файлов, %.1f МБ' % (len(manifest), nfiles, total / 1048576.0))

    zero = []
    for root, _, fs in os.walk(OUT):
        for f in fs:
            p = os.path.join(root, f)
            if os.path.getsize(p) == 0:
                zero.append(p)
    if zero:
        print('НУЛЕВЫЕ ФАЙЛЫ:', *zero, sep='\n  ')
        sys.exit(2)
    print('OK')

if __name__ == '__main__':
    main()
