#!/usr/bin/env python3
"""Сборка приложения из макетов: берёт собранные макеты (дизайн/макеты-24.10/pub/index.html —
сначала `python3 build.py --pub` там) и дописывает оболочку приложения.
python3 build.py [папка вывода]  →  <папка>/index.html (+ ссылка a/ на картинки макетов; data.js и v/ — из data.py)"""
import os, sys
H = os.path.dirname(os.path.abspath(__file__))
M = os.path.join(H, '..', 'макеты-24.10', 'pub')
O = sys.argv[1] if len(sys.argv) > 1 else '/home/user/work/appm/pub'
os.makedirs(O, exist_ok=True)
src = open(os.path.join(M, 'index.html'), encoding='utf8').read()
css = open(os.path.join(H, 'app.css'), encoding='utf8').read()
js = open(os.path.join(H, 'app.js'), encoding='utf8').read()
head = ('<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">'
        '<meta name="theme-color" content="#08090c"><title>Языки по кино — приложение</title>')
src = src.replace('<title>Макеты v22</title>', '', 1)
# своя оболочка: стиль в конец <head>, данные и скрипт — после скрипта макетов
src = head + src
i = src.rfind('</script>')
src = src[:i + 9] + f'\n<style>{css}</style>\n<script src="data.js"></script>\n<script>{js}</script>\n' + src[i + 9:]
open(os.path.join(O, 'index.html'), 'w', encoding='utf8').write(src)
a = os.path.join(O, 'a')
if not os.path.exists(a): os.symlink(os.path.abspath(os.path.join(M, 'a')), a)
print('собрано', os.path.join(O, 'index.html'), os.path.getsize(os.path.join(O, 'index.html')) // 1024, 'КБ')
