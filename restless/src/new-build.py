#!/usr/bin/env python3
"""Собирает новый сайт Restless (restless/new/index.html) из готового restless/index.html (движок: загрузка, кэш,
разбор матча, коуч, патчи) + новый вид src/nw.css и новые страницы src/nw.js. Старые страницы остаются в коде,
но не используются: route() — из nw.js. Запуск из корня репо: python3 restless/src/new-build.py"""
import os, re, shutil
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # restless/
S = os.path.join(R, 'src')
src = open(os.path.join(R, 'index.html'), encoding='utf-8').read()

# замок разработки (первый <script>) — тот же, status.json на уровень выше
g0 = src.index('<script>'); g1 = src.index('</script>', g0) + len('</script>')
gate = src[g0:g1]
assert 'dev-gate' in gate, 'не нашёл замок'
gate = gate.replace("fetch('status.json", "fetch('../status.json")

# движок: всё после data.js
k = src.index('<script src="data.js"></script>')
eng = src[k:].replace('<script src="data.js"></script>', '<script src="../data.js"></script>', 1)
anchor = "window.addEventListener('hashchange', route);"
assert eng.count(anchor) == 1
nwjs = open(os.path.join(S, 'nw.js'), encoding='utf-8').read()
eng = eng.replace(anchor, nwjs.strip() + '\n' + anchor)

css = open(os.path.join(S, 'nw.css'), encoding='utf-8').read()
for f in ('lg6.css', 'lg7.css', 'lg8.css'):  # разбор коуча и карточка задания
    css += '\n' + open(os.path.join(S, f), encoding='utf-8').read()

head = '''<!doctype html>
<html lang="ru"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Restless — статистика Deadlock</title>
<meta name="description" content="Restless — статистика Deadlock: профиль игрока, разбор каждого матча, герои и сборки, лидеры, лайв-матч, патчи по-русски.">
<meta name="theme-color" content="#0d0e11">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Oswald:wght@500;600&display=swap">
<style>
''' + css + '''
</style></head><body>
<header class="nh"><div class="nh-in"><a class="nh-lg" href="#home">RESTLESS</a>
<nav class="nh-nav" id="nnav" aria-label="Разделы"><a href="#home" data-k="home">Игрок</a><a href="#heroes" data-k="heroes">Герои</a><a href="#lb" data-k="lb">Лидеры</a><a href="#live" data-k="live">Лайв-матч</a><a href="#upd" data-k="upd">Патчи</a></nav>
<form class="nh-s" id="nsf" autocomplete="off" role="search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input id="nsq" placeholder="Ник, ссылка Steam или ID" aria-label="Найти игрока"><div class="nh-dd hide" id="nsd"></div></form>
<a class="nh-me hide" id="nme" href="#home"></a></div></header>
<div id="nstub" aria-hidden="true"><form class="srch" id="sf"><input id="sq"><div id="sd" class="hide"></div></form><button id="stg" type="button"></button><a id="me"></a><nav id="tabs"></nav></div>
<main id="v"></main>
'''
out = head + gate + '\n' + eng
os.makedirs(os.path.join(R, 'new'), exist_ok=True)
open(os.path.join(R, 'new', 'index.html'), 'w', encoding='utf-8').write(out)
shutil.copy(os.path.join(R, 'upd-ru.json'), os.path.join(R, 'new', 'upd-ru.json'))
print('готово: restless/new/index.html,', out.count('\n') + 1, 'строк')
