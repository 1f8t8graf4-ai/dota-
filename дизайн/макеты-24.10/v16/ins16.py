# v16: вкладка «Уже готово» над макетами (в шаблоне уже v13–v15). python3 v16/ins16.py → python3 build.py --pub
import os, sys
S = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(S, '..', 'glavnaya-dd.tpl.html')
t = open(P, encoding='utf8').read()
if 'id="ptab"' in t:
    sys.exit('v16 уже вставлена — откати шаблон из git и запусти снова')
css = open(os.path.join(S, 'done.css'), encoding='utf8').read()
js = open(os.path.join(S, 'done.js'), encoding='utf8').read()
def R(a, b):
    global t
    assert a in t, 'нет: ' + a[:90]
    t = t.replace(a, b, 1)
i = t.index('</style>'); t = t[:i] + css + '\n' + t[i:]
R('<div class="vers" id="grp"></div>', '<div class="pt" id="ptab"></div>\n  <div class="vers" id="grp"></div>')
R(' <div class="stage">', ' <section class="done" id="done" hidden></section>\n <div class="stage">')
m = 'addEventListener(\'resize\',fit);fit();'
R(m, js + '\n' + m)
R("mount(start||V.find(x=>x.g===curG));", "mount(start||V.find(x=>x.g===curG));\nif((location.hash||'')==='#done')dnTab('d');")
R("const VERS=[['v15','27.10 · ночь · твои ответы',[", "const VERS=[['v15','27.10 · ночь · твои ответы',[['h9','Главная · ждёт выбора (из v9)'],['x10','Магазин, Коллекция, вкладки · 2 (из v10)'],")
R('v13 … v1 — нажми, чтобы сравнить', 'v14 … v1 — нажми на версию, она раскроется')
R('<title>Макеты v15</title>', '<title>Макеты v16</title>')
R('<h1>v15 — по твоим ответам в макетах</h1>', '<h1>Макеты v15 и вкладка «Уже готово»</h1>')
R('<p class="lead">Открыта v15 — переделал', '<p class="lead"><b>Новое — вкладка «Уже готово»:</b> что уже в приложении, что ты одобрил за все версии и что ждёт твоего выбора, с кнопками к макетам. Главная и Магазин с Коллекцией — первыми кнопками ниже. В v15 переделал')
open(P, 'w', encoding='utf8', newline='\n').write(t)
print('ok', len(t))
