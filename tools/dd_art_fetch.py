#!/usr/bin/env python3
# Скачивает арт каждого героя Deadlock с deadlock.wiki (Gallery → файл *vertical*) в локальную папку
# арты-героев/<id>.png — полноразмерный исходник с CDN, чтобы Андрей не качал руками.
# Прогон: python tools/dd_art_fetch.py [hero_id ...]
import os, re, sys, urllib.parse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dd_voice_fetch import HERO_NAMES, wikitext, file_urls, http

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEST = os.path.join(ROOT, 'арты-героев')

def hero_art(name):
    g = wikitext(f'{name}/Gallery') or ''
    cands = re.findall(r'(?:File:)?([^\n|]*?[Vv]ertical[^\n|]*?\.(?:png|jpg|jpeg|webp))', g)
    if not cands:
        return None, None
    fn = cands[0].strip()
    url = file_urls([fn]).get(fn) or file_urls([fn]).get(fn.lower())
    return fn, url

if __name__ == '__main__':
    os.makedirs(DEST, exist_ok=True)
    heroes = [a for a in sys.argv[1:] if not a.startswith('-')] or sorted(HERO_NAMES)
    ok = bad = 0
    for hid in heroes:
        name = HERO_NAMES.get(hid)
        if not name:
            print('не знаю героя:', hid); bad += 1; continue
        try:
            fn, url = hero_art(name)
            if not url:
                print(f'  {name}: vertical-арта нет в Gallery'); bad += 1; continue
            ext = os.path.splitext(url)[1].lower() or '.png'
            dest = os.path.join(DEST, hid + ext)
            open(dest, 'wb').write(http(url, binary=True))
            kb = os.path.getsize(dest) // 1024
            print(f'  {name}: {fn} → арты-героев/{hid}{ext} ({kb} КБ)')
            ok += 1
        except Exception as e:
            print(f'  {name}: ОШИБКА {str(e)[:80]}'); bad += 1
    print(f'готово: {ok}, не скачалось: {bad}; папка: {DEST}')
