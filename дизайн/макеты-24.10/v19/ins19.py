# сборка v19: в glavnaya-dd.tpl.html (там уже v13–v18) — свежий v16/done.js, v19/q9.css, q9.js; v19 — первой
# python3 v19/ins19.py   (повторно не вставит)  →  python3 build.py --pub
# пока правишь: git checkout -- glavnaya-dd.tpl.html && python3 v19/ins19.py && python3 build.py --pub
import os, subprocess, sys
S = os.path.dirname(os.path.abspath(__file__))
D = os.path.join(S, '..')
P = os.path.join(D, 'glavnaya-dd.tpl.html')
t = open(P, encoding='utf8').read()
if "g:'h19'" in t:
    sys.exit('v19 уже вставлена — откати шаблон из git (git checkout -- glavnaya-dd.tpl.html) и запусти снова')
def R(a, b):
    global t
    assert a in t, 'нет: ' + a[:90]
    t = t.replace(a, b, 1)
def fresh(rel):
    old = subprocess.run(['git', 'show', 'HEAD:./' + rel], cwd=D, capture_output=True, text=True).stdout.strip()
    new = open(os.path.join(D, rel), encoding='utf8').read().strip()
    if old and old != new: R(old, new)
for f in ['v16/done.js']: fresh(f)
css = open(os.path.join(S, 'q9.css'), encoding='utf8').read()
js = open(os.path.join(S, 'q9.js'), encoding='utf8').read()
i = t.index('</style>'); t = t[:i] + css + '\n' + t[i:]
m = '/* ================= каркас страницы ================= */'
i = t.index(m); t = t[:i] + js + '\n' + t[i:]
R("const GN={", "const GN={h19:'Главная v19',")
R("const VERS=[", "const VERS=[['v19','28.10 · игры в меню, Deadlock без комиксов',[['h19','Главная · 3'],['h18','Главная v18']]],\n ")
R("let CTX=null,curV=null,curG='h18';", "let CTX=null,curV=null,curG='h19';")
t = t.replace("localStorage.getItem('kd18')", "localStorage.getItem('kd19')").replace("localStorage.setItem('kd18',v.id)", "localStorage.setItem('kd19',v.id)")
R('<title>Макеты v18</title>', '<title>Макеты v19</title>')
R('<h1>v18 — Меню v2 и Каналы</h1>', '<h1>v19 — игры в меню, Deadlock без комиксов</h1>')
i = t.index('<p class="lead">'); j = t.index('</p>', i)
t = t[:i] + '<p class="lead"><b>По твоим словам к v18.</b> Вместо непонятного «Играть» — два способа: «Deadlock» (последняя игра, сразу внутрь; другие — «Все игры» внизу) или «Игры» со значками игр. Deadlock внутри — без комиксов (они в карточке героя, новичку подсвечен Венатор), «Почитать · Послушать», «Против кого стоишь» (твой совет про художницу — Вайолет, он верный), Versus с другом — в самом низу. В «Уже готово» — мод 0.9.1 и ролики без тишины.' + t[j:]
open(P, 'w', encoding='utf8', newline='\n').write(t)
print('ok', len(t))
