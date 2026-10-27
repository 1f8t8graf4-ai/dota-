# сборка v18: в glavnaya-dd.tpl.html (там уже v13–v17) — свежие v17/q7.css, q7.js (правки цифр), v18/q8.css, q8.js, свежий v16/done.js; v18 — первой
# python3 v18/ins18.py   (повторно не вставит)  →  python3 build.py --pub
# пока правишь: git checkout -- glavnaya-dd.tpl.html && python3 v18/ins18.py && python3 build.py --pub
import os, subprocess, sys
S = os.path.dirname(os.path.abspath(__file__))
D = os.path.join(S, '..')
P = os.path.join(D, 'glavnaya-dd.tpl.html')
t = open(P, encoding='utf8').read()
if "g:'h18'" in t:
    sys.exit('v18 уже вставлена — откати шаблон из git (git checkout -- glavnaya-dd.tpl.html) и запусти снова')
def R(a, b):
    global t
    assert a in t, 'нет: ' + a[:90]
    t = t.replace(a, b, 1)
def fresh(rel):
    old = subprocess.run(['git', 'show', 'HEAD:./' + rel], cwd=D, capture_output=True, text=True).stdout.strip()
    new = open(os.path.join(D, rel), encoding='utf8').read().strip()
    if old and old != new: R(old, new)
for f in ['v16/done.js', 'v17/q7.css', 'v17/q7.js']: fresh(f)
css = open(os.path.join(S, 'q8.css'), encoding='utf8').read()
js = open(os.path.join(S, 'q8.js'), encoding='utf8').read()
i = t.index('</style>'); t = t[:i] + css + '\n' + t[i:]
m = '/* ================= каркас страницы ================= */'
i = t.index(m); t = t[:i] + js + '\n' + t[i:]
R("const GN={", "const GN={h18:'Главная v18',")
R("const VERS=[", "const VERS=[['v18','28.10 · Меню v2 и Каналы',[['h18','Главная · 2'],['h17','Главная v17']]],\n ")
R("let CTX=null,curV=null,curG='h17';", "let CTX=null,curV=null,curG='h18';")
t = t.replace("localStorage.getItem('kd17')", "localStorage.getItem('kd18')").replace("localStorage.setItem('kd17',v.id)", "localStorage.setItem('kd18',v.id)")
R('<title>Макеты v17</title>', '<title>Макеты v18</title>')
R('<h1>v17 — главная под микс: Меню, Афиша, Две двери</h1>', '<h1>v18 — Меню v2 и Каналы</h1>')
i = t.index('<p class="lead">'); j = t.index('</p>', i)
t = t[:i] + '<p class="lead"><b>По твоим ответам на v17.</b> «Меню» — оставил с тем же шрифтом, пункты теперь понятные: «Продолжить» · «Играть» (все игры внутри списком — сколько бы их ни было) · «Что посмотреть»; «Афишу» убрал. Вместо «Двух дверей» — «Каналы»: каждый фильм и каждая игра — канал на весь экран, листаешь вверх-вниз. Цифры в сторис и в профиле поправил. «Динамическая» — это только цвет, стала настройкой темы. В «Уже готово» — сайт Restless и мод 0.9.' + t[j:]
open(P, 'w', encoding='utf8', newline='\n').write(t)
print('ok', len(t))
