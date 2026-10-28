# сборка v21 поверх шаблона с v20: python3 v21/ins21.py → python3 build.py --pub   (повторно не вставит)
import os, sys
S = os.path.dirname(os.path.abspath(__file__)); P = os.path.join(S, '..', 'glavnaya-dd.tpl.html')
t = open(P, encoding='utf8').read()
if "id:'z21r'" in t: sys.exit('v21 уже вставлена — git checkout -- glavnaya-dd.tpl.html и снова')
def R(a, b):
    global t
    assert a in t, 'нет: ' + a[:80]; t = t.replace(a, b, 1)
i = t.index('</style>'); t = t[:i] + open(os.path.join(S, 'z21.css'), encoding='utf8').read() + t[i:]
m = '/* ================= каркас страницы ================= */'
i = t.index(m); t = t[:i] + open(os.path.join(S, 'z21.js'), encoding='utf8').read() + '\n' + t[i:]
R("const GN={", "const GN={y21:'По заметкам к v20',")
R("const VERS=[", "const VERS=[['v21','29.10 · по твоим заметкам к v20',[['y21','Радар, название, профиль · 3']]],\n ")
R("let CTX=null,curV=null,curG='z1';", "let CTX=null,curV=null,curG='y21';")
t = t.replace("localStorage.getItem('kd20')", "localStorage.getItem('kd21')").replace("localStorage.setItem('kd20',v.id)", "localStorage.setItem('kd21',v.id)")
R('<title>Макеты v20</title>', '<title>Макеты v21</title>')
R('<h1>v20 — всё в одном</h1>', '<h1>v21 — по твоим заметкам к v20</h1>')
R('v19 … v1 — нажми на версию, она раскроется', 'v20 … v1 — нажми на версию, она раскроется')
open(P, 'w', encoding='utf8', newline='\n').write(t); print('ok', len(t))
