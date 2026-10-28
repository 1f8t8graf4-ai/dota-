# сборка v17: в glavnaya-dd.tpl.html (там уже v13–v16) вставляет v17/q7.css и q7.js, свежий v16/done.js; v17 — первой на странице
# python3 v17/ins17.py   (повторно не вставит)  →  python3 build.py --pub
# пока правишь: git checkout -- glavnaya-dd.tpl.html && python3 v17/ins17.py && python3 build.py --pub
import os, subprocess, sys
S = os.path.dirname(os.path.abspath(__file__))
D = os.path.join(S, '..')
P = os.path.join(D, 'glavnaya-dd.tpl.html')
t = open(P, encoding='utf8').read()
if "g:'h17'" in t:
    sys.exit('v17 уже вставлена — откати шаблон из git (git checkout -- glavnaya-dd.tpl.html) и запусти снова')
def R(a, b):
    global t
    assert a in t, 'нет: ' + a[:90]
    t = t.replace(a, b, 1)
# вкладка «Уже готово»: старый done.js (как в git) → свежий
old = subprocess.run(['git', 'show', 'HEAD:./v16/done.js'], cwd=D, capture_output=True, text=True).stdout
new = open(os.path.join(D, 'v16', 'done.js'), encoding='utf8').read()
if old.strip() and old.strip() != new.strip():
    R(old.strip(), new.strip())
css = open(os.path.join(S, 'q7.css'), encoding='utf8').read()
js = open(os.path.join(S, 'q7.js'), encoding='utf8').read()
i = t.index('</style>'); t = t[:i] + css + '\n' + t[i:]
m = '/* ================= каркас страницы ================= */'
i = t.index(m); t = t[:i] + js + '\n' + t[i:]
R("const GN={", "const GN={h17:'Главная v17',")
R("const VERS=[", "const VERS=[['v17','28.10 · главная под микс',[['h17','Главная · 3 · под микс'],['h9','Главная v9 · как было']]],\n ")
R("let CTX=null,curV=null,curG='d15';", "let CTX=null,curV=null,curG='h17';")
t = t.replace("localStorage.getItem('kd15')", "localStorage.getItem('kd17')").replace("localStorage.setItem('kd15',v.id)", "localStorage.setItem('kd17',v.id)")
R('<title>Макеты v16</title>', '<title>Макеты v17</title>')
R('<h1>Макеты v15 и вкладка «Уже готово»</h1>', '<h1>v17 — главная под микс: Меню, Афиша, Две двери</h1>')
i = t.index('<p class="lead">'); j = t.index('</p>', i)
t = t[:i] + '<p class="lead"><b>Новое — главная заново, три варианта под микс кино + Deadlock:</b> «Меню» (как меню Deadlock по Esc), «Афиша» (фильмы, сериалы, интервью и главы комикса в одной сетке) и мой «Две двери» (кино сверху, Deadlock снизу, шов тянется). Во всех трёх аватарка слева сверху — это профиль: живой фон из Коллекции, уровень, полка наград, Коллекция и Магазин. Вкладка «Уже готово» обновлена по твоим ответам. Прошлые версии — ниже.' + t[j:]
open(P, 'w', encoding='utf8', newline='\n').write(t)
print('ok', len(t))
