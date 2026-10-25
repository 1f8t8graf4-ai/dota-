# -*- coding: utf-8 -*-
"""
Часть Б: реплики героев Deadlock с deadlock.wiki.

Страница <Hero>/Voice lines: строки таблиц с <span class="inline-audio" data-url=CDN mp3>
и текстом в .audio-text. Разделы h2 (cat), подразделы h3 (sub), герой-партнёр —
data-hero-name / hero-link-wrapper (учитывает rowspan).

Этапы на героя:
  1. parse страницы -> список реплик (text, url, cat, sub, with)
  2. скачать уникальные mp3 с cdn.deadlock.wiki (кэш по хэшу, потоки)
  3. пережать в mono ~80k (ffmpeg, параллельно), длительность ffprobe
  4. имена <slug>-<слова-из-реплики>.mp3 (латиница/дефисы, дедуп -2/-3)
  5. json: data/dd-lines/<slug>.json = [{en,cat,sub,file,a,with,sec}]
  6. --upload: залить папку героя в R2 scenes/games/deadlock/v/<slug>/ (audio/mpeg)

UA обязателен. Без ключей в репо. Переводы не пишутся.
"""
import json, os, re, sys, time, hashlib, subprocess, urllib.request, urllib.parse, html as H
from concurrent.futures import ThreadPoolExecutor, as_completed

REPO_JSON = '/home/z/my-project/dota-repo/tools/bg-prompts.json'

BASE = 'https://deadlock.wiki/api.php'
UA = ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
WORK = '/home/z/my-project/dd-lines-work'
RAW = os.path.join(WORK, 'raw')
R2_BASE = 'scenes/games/deadlock/v'
CF = '/home/z/my-project/scripts/.cf-token'
ACC = '30e726a49a27820ac532f8ab97954d0c'
BUCKET = 'kino-media'
WORKERS = 8

# h2 -> короткий cat;Navigation пропускается целиком
CAT = {
    'select': 'select', 'unselect': 'unselect', 'conversations': 'conversation',
    'abilities': 'ability', 'generic voice lines': 'generic',
    'generic pings': 'ping', 'hero-specific voice lines': 'hero-specific',
    'other characters': 'other', 'removed/unused voice lines': 'removed',
}
SKIP_CAT = {'navigation', 'references', 'notes'}

HERO_NAMES = {}   # norm(name) -> display name (заполняется из Category:Heroes)
SLUG_BY_TITLE = {}  # norm(wiki title) -> slug в стиле games.json (из bg-prompts.json)


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
    s = s.replace('[edit]', '').replace('[ edit]', '')
    return re.sub(r'\s+', ' ', s).strip()


def norm(s):
    return re.sub(r'[^a-z0-9]', '', str(s).lower())


def load_hero_names():
    global HERO_NAMES, SLUG_BY_TITLE
    if HERO_NAMES:
        return
    r = api({'action': 'query', 'list': 'categorymembers',
             'cmtitle': 'Category:Heroes', 'cmtype': 'page', 'cmlimit': 500})
    HERO_NAMES = {norm(t): t for t in (m['title'] for m in r['query']['categorymembers'])
                  if norm(t) not in ('heroes', 'heroesbyrelease')}
    try:
        src = json.load(open(REPO_JSON, encoding='utf-8'))
        for it in src['items']:
            if it.get('kind') == 'hero':
                SLUG_BY_TITLE[norm(it.get('title') or '')] = it['hero']
                SLUG_BY_TITLE[norm(it['hero'].replace('-', ' '))] = it['hero']
    except Exception:
        pass


def slug_of(display):
    s = SLUG_BY_TITLE.get(norm(display))
    if s:
        return s
    return norm(display) or 'unknown'


def parse_page(page, slug):
    """возвращает список реплик: dict(en, url, cat, sub, with) + список anom"""
    d = api({'action': 'parse', 'page': page, 'prop': 'text'})
    h = d['parse']['text']
    events = []
    for m in re.finditer(r'<h([23])[^>]*>(.*?)</h\1>|<tr>(.*?)</tr>', h, re.S):
        if m.group(1):
            level = int(m.group(1))
            inner = m.group(2)
            hm = re.search(r'<span class="mw-headline"[^>]*>(.*?)</span>', inner, re.S)
            title = re.sub(r'\[\s*edit\s*\]', '', clean(hm.group(1)) if hm else clean(inner)).strip()
            events.append(('h' + str(level), title))
        else:
            events.append(('tr', m.group(3)))

    lines, anom = [], []
    cat = sub = None
    pending_hero, pending_n = None, 0
    seen_urls = {}
    for kind, val in events:
        if kind == 'h2':
            cat_raw = val.strip().lower()
            cat = None if cat_raw in SKIP_CAT else CAT.get(cat_raw, norm(val)[:20] or 'misc')
            sub = None
            pending_hero, pending_n = None, 0
        elif kind == 'h3':
            sub = val.strip()
        elif cat is None:
            continue
        else:
            row = val
            urls = [H.unescape(u) for u in re.findall(r'data-url="([^"]+)"', row)]
            texts = [clean(t) for t in re.findall(r'audio-text[^"]*"[^>]*>\s*<a[^>]*>(.*?)</a>', row, re.S)]
            texts = [t for t in texts if t]
            hero_cell = None
            hm = re.search(r'hero-link-wrapper[^>]*>.*?title="([^"]+)"', row, re.S)
            if hm:
                hero_cell = hm.group(1)
            elif 'data-hero-name' in row:
                hm2 = re.search(r'data-hero-name="([^"]+)"', row)
                if hm2:
                    hero_cell = H.unescape(hm2.group(1)).replace('hero_', '').replace('_', ' ')
            if hero_cell and 'rowspan' in row[:200]:
                rm = re.search(r'rowspan="?(\d+)', row[:200])
                pending_hero, pending_n = hero_cell, (int(rm.group(1)) - 1 if rm else 0)
            eff_hero = hero_cell or pending_hero
            if pending_n > 0 and not hero_cell:
                pending_n -= 1
            if not urls:
                continue
            n = max(len(urls), len(texts))
            if len(urls) != len(texts):
                anom.append('url=%d text=%d: %s' % (len(urls), len(texts), (texts[0][:40] if texts else urls[0])))
            for i in range(n):
                if i >= len(urls) or i >= len(texts):
                    break
                url, text = urls[i], texts[i]
                if not url or not text:
                    continue
                self_slug = slug
                withs = []
                if eff_hero:
                    ws = slug_of(eff_hero)
                    if ws != self_slug:
                        withs = [ws]
                else:
                    low = text.lower()
                    for nn, disp in HERO_NAMES.items():
                        if len(nn) > 3 and re.search(r'\b' + re.escape(disp.lower()) + r'\b', low):
                            ws = slug_of(disp)
                            if ws != self_slug:
                                withs.append(ws)
                withs = sorted(set(withs))
                fn = url.rsplit('/', 1)[-1]
                lines.append({'en': text, 'url': url, 'cat': cat, 'sub': sub,
                              'with': withs, 'file': fn})
                seen_urls[url] = seen_urls.get(url, 0) + 1
    return lines, anom


def fetch_file(url, dest, tries=3):
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        return dest
    last = None
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=90) as r, open(dest + '.tmp', 'wb') as f:
                while True:
                    c = r.read(65536)
                    if not c:
                        break
                    f.write(c)
            os.rename(dest + '.tmp', dest)
            return dest
        except Exception as e:
            last = e
            time.sleep(1 + i)
            if os.path.exists(dest + '.tmp'):
                os.remove(dest + '.tmp')
    raise last


def transcode(src, dest):
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        return
    r = subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', src,
                        '-ac', '1', '-b:a', '80k', dest],
                       capture_output=True, timeout=120)
    if r.returncode != 0 or not os.path.exists(dest) or os.path.getsize(dest) == 0:
        raise RuntimeError('ffmpeg: ' + r.stderr.decode('utf-8', 'replace')[-200:])


def duration(path):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
                        '-of', 'csv=p=0', path], capture_output=True, timeout=60)
    try:
        return round(float(r.stdout.decode().strip()), 1)
    except Exception:
        return 0.0


def safe_words(text, slug, idx_map):
    t = text.lower().replace("'", '').replace('’', '')
    w = re.sub(r"[^a-z0-9]", ' ', t).split()
    stop = {'the', 'a', 'an', 'i', 'im', 'ive', 'you', 'to', 'of', 'and', 'is', 'it',
            'in', 'on', 'my', 'me', 'we', 'so', 'for', 'with', 'that', 'this', 'your'}
    pick = [x for x in w if x not in stop][:3] or w[:2] or ['line']
    base = slug + '-' + '-'.join(pick)[:30]
    base = re.sub(r'-+', '-', base).strip('-')
    n = idx_map.get(base, 0) + 1
    idx_map[base] = n
    return base if n == 1 else '%s-%d' % (base, n)


def r2_put(local, key, ctype='audio/mpeg', tries=4):
    with open(CF) as f:
        email, auth = [l.strip() for l in f if l.strip()]
    url = ('https://api.cloudflare.com/client/v4/accounts/%s/r2/buckets/%s/objects/%s'
           % (ACC, BUCKET, urllib.parse.quote(key, safe='')))
    data = open(local, 'rb').read()
    last = None
    for i in range(tries):
        req = urllib.request.Request(url, data=data, method='PUT', headers={
            'X-Auth-Email': email, 'X-Auth-Key': auth, 'Content-Type': ctype})
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                return r.status
        except Exception as e:
            last = e
            sc = getattr(e, 'code', 0)
            if sc in (401, 403) and sc != 429:
                raise  # ключ мёртв — ретраи не помогут
            time.sleep(2 + 3 * i)
    raise last


def upload_only(slug):
    """залить уже готового героя: json существует, mp3 в audio/<slug>/"""
    jp = '/home/z/my-project/dota-repo/data/dd-lines/%s.json' % slug
    entries = json.load(open(jp, encoding='utf-8'))
    outdir = os.path.join(WORK, 'audio', slug)
    files = [(os.path.join(outdir, e['a'].rsplit('/', 1)[1]), e['a']) for e in entries]
    files = [(f, k) for f, k in files if os.path.exists(f) and os.path.getsize(f) > 0]
    print('[%s] upload-only: %d файлов' % (slug, len(files)), flush=True)
    errs = []
    with ThreadPoolExecutor(4) as ex:
        futs = {ex.submit(r2_put, f, k): k for f, k in files}
        for fu in as_completed(futs):
            try:
                fu.result()
            except Exception as e:
                errs.append((futs[fu], str(e)))
    print('[%s] залито: %d (ошибок: %d)' % (slug, len(files) - len(errs), len(errs)), flush=True)
    for k, e in errs[:5]:
        print('   ', k, e, flush=True)
    return len(errs)


def process(hero_display, do_upload=False):
    os.makedirs(RAW, exist_ok=True)
    load_hero_names()
    slug = slug_of(hero_display)
    page = hero_display + '/Voice lines'
    print('[%s] страница: %s' % (hero_display, page), flush=True)
    lines, anom = parse_page(page, slug)
    if not lines:
        print('[%s] РЕПЛИК НЕ НАЙДЕНО' % hero_display)
        return 0, 0
    urls = sorted({l['url'] for l in lines})
    print('[%s] реплик: %d (уникальных аудио: %d) anom: %d' %
          (hero_display, len(lines), len(urls), len(anom)), flush=True)
    for a in anom[:5]:
        print('   !', a)

    # 1) скачивание
    def dl(u):
        hsh = hashlib.md5(u.encode()).hexdigest()[:16]
        dest = os.path.join(RAW, hsh + '.mp3')
        try:
            fetch_file(u, dest)
            return u, None
        except Exception as e:
            return u, str(e)
    bad = {}
    with ThreadPoolExecutor(WORKERS) as ex:
        for u, err in ex.map(dl, urls):
            if err:
                bad[u] = err
    print('[%s] скачано: %d, ошибок: %d' % (hero_display, len(urls) - len(bad), len(bad)), flush=True)

    # 2) имена + пережим + длительность
    outdir = os.path.join(WORK, 'audio', slug)
    os.makedirs(outdir, exist_ok=True)
    idx_map, entries, failed = {}, [], 0
    tasks = [(l, safe_words(l['en'], slug, idx_map)) for l in lines if l['url'] not in bad]
    def conv(t):
        l, name = t
        hsh = hashlib.md5(l['url'].encode()).hexdigest()[:16]
        src = os.path.join(RAW, hsh + '.mp3')
        dest = os.path.join(outdir, name + '.mp3')
        try:
            transcode(src, dest)
            return l, name, dest, None
        except Exception as e:
            return l, name, dest, str(e)
    with ThreadPoolExecutor(WORKERS) as ex:
        for l, name, dest, err in ex.map(conv, tasks):
            if err:
                failed += 1
                continue
            entries.append({'en': l['en'], 'cat': l['cat'], 'sub': l.get('sub'), 'file': l['file'],
                            'a': '%s/%s/%s.mp3' % (R2_BASE, slug, name),
                            'with': l['with'], 'sec': duration(dest), '_p': dest})
    for e in entries:
        e.pop('_p', None)
    # порядок как на странице: по url-порядку lines
    print('[%s] готово mp3: %d (не пережалось: %d)' % (hero_display, len(entries), failed), flush=True)

    os.makedirs('/home/z/my-project/dota-repo/data/dd-lines', exist_ok=True)
    jp = '/home/z/my-project/dota-repo/data/dd-lines/%s.json' % slug
    json.dump(entries, open(jp, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    total_sec = round(sum(e['sec'] for e in entries), 1)
    print('[%s] json: %s (%d реплик, %.1f сек звука)' % (hero_display, jp, len(entries), total_sec), flush=True)

    # 3) upload
    if do_upload:
        files = [(os.path.join(outdir, e['a'].rsplit('/', 1)[1]), e['a']) for e in entries]
        errs = 0
        with ThreadPoolExecutor(WORKERS) as ex:
            futs = {ex.submit(r2_put, f, k): k for f, k in files}
            for fu in as_completed(futs):
                try:
                    fu.result()
                except Exception as ex2:
                    errs += 1
                    print('   upload err %s: %s' % (futs[fu], ex2), flush=True)
        print('[%s] залито в R2: %d (ошибок: %d)' % (hero_display, len(files) - errs, errs), flush=True)
    return len(entries), len(bad) + failed


if __name__ == '__main__':
    do_up = '--upload' in sys.argv
    if '--upload-only' in sys.argv:
        i = sys.argv.index('--upload-only')
        sys.exit(1 if any(upload_only(s) for s in sys.argv[i + 1:]) else 0)
    heroes = []
    if '--list' in sys.argv:
        i = sys.argv.index('--list')
        heroes = [l.strip() for l in open(sys.argv[i + 1], encoding='utf-8') if l.strip()]
    heroes += [a for a in sys.argv[1:] if not a.startswith('--')]
    if not heroes:
        print('usage: dd_voice_fetch.py <Hero> [Hero2 ...] [--upload]')
        sys.exit(1)
    tot_l, tot_f = 0, 0
    for hd in heroes:
        try:
            n, f = process(hd, do_up)
            tot_l += n
            tot_f += f
        except Exception as e:
            print('[%s] ПРОВАЛ: %r' % (hd, e), flush=True)
            tot_f += 1
    print('ИТОГ: %d реплик, %d проблем' % (tot_l, tot_f))
