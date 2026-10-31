# сборка v22 поверх шаблона с v21: python3 v22/ins22.py → python3 build.py --pub   (повторно не вставит)
import os, sys
S = os.path.dirname(os.path.abspath(__file__)); P = os.path.join(S, '..', 'glavnaya-dd.tpl.html')
t = open(P, encoding='utf8').read()
if "id:'z22m'" in t: sys.exit('v22 уже вставлена — git checkout -- glavnaya-dd.tpl.html и снова')
def R(a, b):
    global t
    assert a in t, 'нет: ' + a[:80]; t = t.replace(a, b, 1)
i = t.index('</style>'); t = t[:i] + open(os.path.join(S, 'z22.css'), encoding='utf8').read() + t[i:]
m = '/* ================= каркас страницы ================= */'
i = t.index(m); t = t[:i] + open(os.path.join(S, 'z22.js'), encoding='utf8').read() + '\n' + t[i:]
R("const GN={", "const GN={y22:'По заметкам к v21',")
R("const VERS=[", "const VERS=[['v22','31.10 · по твоим заметкам к v21',[['y22','Versus · 3, Меню, слова после сцены · 5']]],\n ")
R("let CTX=null,curV=null,curG='y21';", "let CTX=null,curV=null,curG='y22';")
t = t.replace("localStorage.getItem('kd21')", "localStorage.getItem('kd22')").replace("localStorage.setItem('kd21',v.id)", "localStorage.setItem('kd22',v.id)")
R('<title>Макеты v21</title>', '<title>Макеты v22</title>')
R('<h1>v21 — по твоим заметкам к v20</h1>', '<h1>v22 — по твоим заметкам к v21</h1>')
R('v20 … v1 — нажми на версию, она раскроется', 'v21 … v1 — нажми на версию, она раскроется')
open(P, 'w', encoding='utf8', newline='\n').write(t); print('ok', len(t))
