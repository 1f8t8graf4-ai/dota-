#!/usr/bin/env python3
"""Звуки из Openverse (CC0 / CC BY) → sfx/<id>/ + sfx/LICENSES.json.

  python3 tools/video/sfx_fetch.py latch "door latch" 3          # 3 звука в sfx/latch/
  python3 tools/video/sfx_fetch.py pop "bubble pop" 4 --max 1.2   # не длиннее 1,2 с
  python3 tools/video/sfx_fetch.py --list                         # что уже лежит и чьё

- Без ключа: 100 запросов в минуту и 1000 в день на весь адрес облака.
- Только cc0 и by. У CC BY подпись — в описание ролика (строка attribution в LICENSES.json).
- Файл кладётся как есть (mp3 превью Freesound ~48 кГц). Длинные (--max) и битые пропускаются.
- Повтор того же звука (по id Openverse) не качается второй раз.
- После скачивания — проверка tools/video/sfx_check.py (тишина по краям, клиппинг, шум, LUFS).
"""
import argparse, json, os, re, sys, time, urllib.parse, urllib.request

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SFX = os.path.join(ROOT, 'sfx')
LIC = os.path.join(SFX, 'LICENSES.json')
API = 'https://api.openverse.org/v1/audio/'
UA = 'sfx-fetch/1.0 (+https://openverse.org)'  # без личных данных


def get(url, raw=False):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    for i in range(4):
        try:
            with urllib.request.urlopen(req, timeout=20) as r:
                b = r.read()
                return b if raw else json.loads(b)
        except urllib.error.HTTPError as e:
            if e.code == 429:
                ra = int(e.headers.get('Retry-After') or 0)
                if ra > 60:  # дневной лимит адреса облака кончился
                    raise RuntimeError(f'Openverse: лимит на сегодня, снова через {ra // 3600} ч {ra % 3600 // 60} мин') from e
                time.sleep(max(ra, 10)); continue
            if e.code == 401:
                raise RuntimeError('Openverse 401: без ключа page_size не больше 20') from e
            raise
        except (urllib.error.URLError, TimeoutError) as e:
            print('  сеть:', e, file=sys.stderr); time.sleep(2 ** i)
    raise RuntimeError('не скачалось: ' + url)


def load_lic():
    if os.path.exists(LIC):
        with open(LIC, encoding='utf8') as f:
            return json.load(f)
    return {}


def save_lic(d):
    os.makedirs(SFX, exist_ok=True)
    with open(LIC, 'w', encoding='utf8') as f:
        json.dump(dict(sorted(d.items())), f, ensure_ascii=False, indent=1)
        f.write('\n')


def slug(s):
    s = re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')
    return s[:40] or 'sfx'


def fetch(sid, query, n, maxdur, lic):
    seen = {v['ov_id'] for v in lic.values()}
    q = urllib.parse.urlencode({'q': query, 'license': 'cc0,by', 'page_size': 20,
                                'mature': 'false'})
    res = get(API + '?' + q).get('results', [])
    d = os.path.join(SFX, sid)
    os.makedirs(d, exist_ok=True)
    got = 0
    for r in res:
        if got >= n:
            break
        if r['id'] in seen or r.get('license') not in ('cc0', 'by'):
            continue
        dur = (r.get('duration') or 0) / 1000
        if maxdur and (not dur or dur > maxdur):
            continue
        ext = (r.get('filetype') or 'mp3').lower()
        if ext not in ('mp3', 'wav', 'ogg', 'flac'):
            continue
        k = sum(1 for f in os.listdir(d)) + 1
        name = f'{sid}-{k:02d}-{slug(r.get("title") or "")}.{ext}'
        try:
            b = get(r['url'], raw=True)
        except Exception as e:
            print('  пропуск', r['id'], e); continue
        if len(b) < 1000:
            continue
        with open(os.path.join(d, name), 'wb') as f:
            f.write(b)
        rel = f'{sid}/{name}'
        lic[rel] = {'ov_id': r['id'], 'title': r.get('title'), 'creator': r.get('creator'),
                    'license': r['license'], 'license_version': r.get('license_version'),
                    'license_url': r.get('license_url'), 'source': r.get('foreign_landing_url'),
                    'attribution': r.get('attribution'), 'duration_s': dur, 'query': query}
        got += 1
        print(f'  {rel}  {dur:.2f} c  {r["license"]}  {r.get("creator")}')
        time.sleep(0.7)
    return got


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('id', nargs='?', help='папка в sfx/ (latch, pop, swish…)')
    ap.add_argument('query', nargs='?', help='что искать (по-английски)')
    ap.add_argument('n', nargs='?', type=int, default=3)
    ap.add_argument('--max', type=float, default=3.0, help='максимум секунд (0 — без лимита)')
    ap.add_argument('--list', action='store_true')
    a = ap.parse_args()
    lic = load_lic()
    if a.list:
        for k, v in lic.items():
            print(f'{k}  {v["license"]}  {v["creator"]}')
        return
    if not a.id or not a.query:
        ap.error('нужны id и query')
    got = fetch(a.id, a.query, a.n, a.max, lic)
    save_lic(lic)
    print(f'скачано {got}, всего в LICENSES.json {len(lic)}')
    if got < a.n:
        sys.exit(2)


if __name__ == '__main__':
    main()
