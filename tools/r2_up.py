#!/usr/bin/env python3
"""Заливка медиа сцен в Cloudflare R2 через воркер бота (13.9).

Файлы из клона репо scenes (по умолчанию ../scenes рядом с dota-) ложатся в R2 под ключами
scenes/<путь>, приложение берёт их по адресу https://dota.1f8t8graf4.workers.dev/m/scenes/<путь>.
Склад Андрея claude/ (и inbox/) НЕ заливается — он остаётся только в приватном репо scenes.

Ключ заливки — переменная окружения MEDIA_UP_KEY или файл (--key-file; по умолчанию <scenes>/.r2-key,
он лежит только в приватном репо scenes). В воркере хранится лишь SHA-256 ключа (MEDIA_UP_HASH).

  python3 tools/r2_up.py                        # залить всё новое и изменённое (сверка md5 = etag R2)
  python3 tools/r2_up.py titanic-boat _films    # только эти папки / файлы
  python3 tools/r2_up.py --dry                  # показать, что зальётся, ничего не меняя
  python3 tools/r2_up.py --check                # только сверка: всё ли на месте
  python3 tools/r2_up.py --prune                # ещё и удалить из R2 то, чего нет в папке (осторожно)
"""
import argparse, concurrent.futures as cf, hashlib, json, os, ssl, sys, time, urllib.error, urllib.parse, urllib.request

BASE = os.environ.get('MEDIA_BASE', 'https://dota.1f8t8graf4.workers.dev')
EXT = {'mp4', 'm4a', 'mp3', 'jpg', 'jpeg', 'png', 'webp', 'json', 'srt', 'vtt'}
SKIP = {'claude', 'inbox', '.git'}
CTX = ssl.create_default_context(cafile=os.environ.get('SSL_CERT_FILE') or None)


def mb(n):
    return f'{n / 1048576:.1f} МБ'


def req(method, path, key, body=None, headers=None, timeout=900):
    h = {'x-up': key, 'user-agent': 'r2_up/13.9', **(headers or {})}
    r = urllib.request.Request(BASE + path, data=body, method=method, headers=h)
    with urllib.request.urlopen(r, timeout=timeout, context=CTX) as resp:
        return resp.status, resp.read()


def remote_list(key, prefix='scenes/'):
    out, cur = {}, None
    while True:
        q = {'prefix': prefix, **({'cursor': cur} if cur else {})}
        try:
            st, b = req('GET', '/m-ls?' + urllib.parse.urlencode(q), key, timeout=60)
        except urllib.error.HTTPError as e:
            sys.exit({403: 'Ключ заливки не подошёл (403)',
                      503: 'R2 не подключён к воркеру: Settings → Bindings → R2 bucket kino-media под именем MEDIA (503)'}.get(
                e.code, f'Воркер ответил {e.code} — если 404/405, в Cloudflare ещё старый bot/worker.js (нужен 13.9+)'))
        j = json.loads(b)
        if not j.get('ok'):
            sys.exit(f'Список R2 не получен: {j}')
        for k, size, etag in j['files']:
            out[k] = (size, etag)
        cur = j.get('cursor')
        if not cur:
            return out


def local_files(root, only):
    root = os.path.abspath(root)
    starts = [os.path.normpath(os.path.join(root, x)) for x in only] or [root]
    seen = {}
    for st in starts:
        if os.path.isfile(st):
            walk = [(os.path.dirname(st), [], [os.path.basename(st)])]
        elif os.path.isdir(st):
            walk = os.walk(st)
        else:
            sys.exit(f'Нет такого пути: {st}')
        for d, dirs, files in walk:
            rel_d = os.path.relpath(d, root)
            dirs[:] = [x for x in dirs if x not in SKIP and not x.startswith('.')]
            if rel_d.split(os.sep)[0] in SKIP:
                continue
            for f in files:
                if f.startswith('.') or f.rsplit('.', 1)[-1].lower() not in EXT:
                    continue
                p = os.path.join(d, f)
                rel = os.path.relpath(p, root).replace(os.sep, '/')
                if rel.startswith('..'):
                    sys.exit(f'Путь вне папки scenes: {p}')
                seen['scenes/' + rel] = p
    return seen


CACHE_F = os.path.expanduser('~/.cache/r2_up_md5.json')   # md5 по (размер, время правки) — второй запуск не читает 2 ГБ заново
try:
    CACHE = json.load(open(CACHE_F, encoding='utf-8'))
except Exception:
    CACHE = {}


def md5(path):
    st = os.stat(path)
    sig = [st.st_size, st.st_mtime_ns]
    c = CACHE.get(path)
    if c and c[:2] == sig:
        return c[2]
    h = hashlib.md5()
    with open(path, 'rb') as f:
        for b in iter(lambda: f.read(1 << 20), b''):
            h.update(b)
    CACHE[path] = sig + [h.hexdigest()]
    return h.hexdigest()


def cache_save():
    try:
        os.makedirs(os.path.dirname(CACHE_F), exist_ok=True)
        json.dump(CACHE, open(CACHE_F, 'w', encoding='utf-8'))
    except Exception:
        pass


def put(key, k, path, digest):
    size = os.path.getsize(path)
    url = '/m/' + urllib.parse.quote(k, safe='/')
    for n in range(5):
        try:
            t = time.time()
            with open(path, 'rb') as f:
                st, b = req('PUT', url, key, body=f, headers={'content-length': str(size), 'x-md5': digest})
            j = json.loads(b)
            if j.get('ok') and j.get('size') == size and j.get('etag') == digest:
                return k, size, time.time() - t, None
            err = f'ответ {j}'
        except urllib.error.HTTPError as e:
            err = f'HTTP {e.code}: {e.read()[:200].decode("utf-8", "replace")}'
            if e.code in (403, 404, 405, 503):
                return k, size, 0, err   # ключ/привязка/маршрут — повтор не поможет
        except Exception as e:  # обрыв сети — повторить
            err = repr(e)
        time.sleep(2 ** (n + 1))
    return k, size, 0, err


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('only', nargs='*', help='папки/файлы внутри scenes (по умолчанию всё)')
    ap.add_argument('--scenes', default=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'scenes'))
    ap.add_argument('--key-file')
    ap.add_argument('--jobs', type=int, default=4)
    ap.add_argument('--dry', action='store_true')
    ap.add_argument('--check', action='store_true')
    ap.add_argument('--prune', action='store_true')
    a = ap.parse_args()

    key = os.environ.get('MEDIA_UP_KEY', '').strip()
    kf = a.key_file or os.path.join(a.scenes, '.r2-key')
    if not key and os.path.isfile(kf):
        key = open(kf, encoding='utf-8').read().strip()
    if not key:
        sys.exit('Нет ключа заливки: MEDIA_UP_KEY или --key-file (в приватном репо scenes — файл .r2-key)')

    loc = local_files(a.scenes, a.only)
    print(f'В папке: {len(loc)} файлов, {mb(sum(os.path.getsize(p) for p in loc.values()))}')
    rem = remote_list(key)
    print(f'В R2: {len(rem)} файлов, {mb(sum(s for s, _ in rem.values()))}')

    t0 = time.time()
    with cf.ThreadPoolExecutor(8) as ex:
        dig = dict(zip(loc, ex.map(md5, loc.values())))
    cache_save()
    todo =[k for k in sorted(loc) if rem.get(k) != (os.path.getsize(loc[k]), dig[k])]
    pre = tuple('scenes/' + x.strip('/') for x in a.only)
    extra = sorted(k for k in rem if k not in loc and (not pre or k.startswith(pre)))
    print(f'Залить: {len(todo)} ({mb(sum(os.path.getsize(loc[k]) for k in todo))}), лишних в R2: {len(extra)}  [md5 {time.time() - t0:.0f} с]')

    if a.check or a.dry:
        for k in todo[:50]:
            print('  ↑', k, '(нет в R2)' if k not in rem else '(отличается)')
        for k in extra[:50]:
            print('  ✕', k, '(есть в R2, нет в папке)')
        sys.exit(1 if a.check and todo else 0)

    fails, done, t0 = [], 0, time.time()
    big_first = sorted(todo, key=lambda k: -os.path.getsize(loc[k]))
    with cf.ThreadPoolExecutor(a.jobs) as ex:
        for k, size, dt, err in ex.map(lambda k: put(key, k, loc[k], dig[k]), big_first):
            if err:
                fails.append((k, err))
                print('  ✗', k, err, flush=True)
            else:
                done += size
                print(f'  ↑ {k}  {mb(size)}  {dt:.1f} с  · всего {mb(done)} за {time.time() - t0:.0f} с', flush=True)

    if a.prune and extra:
        for k in extra:
            st, b = req('DELETE', '/m/' + urllib.parse.quote(k, safe='/'), key, timeout=60)
            print('  ✕ удалён', k)

    rem = remote_list(key)
    bad = [k for k in loc if rem.get(k) != (os.path.getsize(loc[k]), dig[k])]
    print(f'Сверка: {len(loc) - len(bad)} из {len(loc)} на месте (размер и md5 совпали)' + (f', НЕ совпали: {len(bad)}' if bad else ' ✅'))
    for k in bad[:30]:
        print('  ≠', k)
    sys.exit(1 if bad or fails else 0)


if __name__ == '__main__':
    main()
