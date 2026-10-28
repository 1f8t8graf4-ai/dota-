# сборка v15: в glavnaya-dd.tpl.html (там уже v13 и v14) вставляет v15/*.css и v15/*.js, v15 — первой версией на странице
# python3 v15/ins15.py   (повторно не вставит)  →  python3 build.py --pub
# пока правишь v15: git checkout -- glavnaya-dd.tpl.html && python3 v15/ins15.py && python3 build.py --pub
import os, re, sys
S = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(S, '..', 'glavnaya-dd.tpl.html')
t = open(P, encoding='utf8').read()
if "d15:'Deadlock v15'" in t:
    sys.exit('v15 уже вставлена — откати шаблон из git (git checkout -- glavnaya-dd.tpl.html) и запусти снова')
CSS = ['y5.css', 'y5c.css', 'y5e.css']
JS = ['y5a.js', 'y5l.js', 'y5r.js', 'y5k.js', 'y5c.js', 'y5x.js', 'y5e.js', 'd15.js']
css = '\n'.join(open(os.path.join(S, f), encoding='utf8').read() for f in CSS if os.path.exists(os.path.join(S, f)))
js = '\n'.join(open(os.path.join(S, f), encoding='utf8').read() for f in JS if os.path.exists(os.path.join(S, f)))
def R(a, b):
    global t
    assert a in t, 'нет: ' + a[:90]
    t = t.replace(a, b, 1)
i = t.index('</style>'); t = t[:i] + css + '\n' + t[i:]
m = '/* ================= каркас страницы ================= */'
i = t.index(m); t = t[:i] + js + '\n' + t[i:]
GROUPS = [('d15', 'Deadlock v15', 'Deadlock · 4'), ('r15', 'Радар v15', 'Радар · 5 вариантов'), ('k15', 'Комикс v15', 'Герой и главы · 1'),
          ('x15', 'Restless v15', 'Restless · разбор матчей · 3'), ('c15', 'Канал v15', 'Канал, разбор, ролик · 5'), ('l15', 'Обучение v15', 'Обучение · 5'), ('m15', 'Мод v15', 'Мод · 2'), ('s15', 'Настройки v15', 'Настройки · 2')]
have = set(re.findall(r"g:'([a-z0-9]+)'", js))
GROUPS = [g for g in GROUPS if g[0] in have]
R("const GN={", "const GN={" + ''.join(f"{k}:'{n}'," for k, n, _ in GROUPS))
R("const VERS=[", "const VERS=[['v15','27.10 · ночь · твои ответы',[" + ','.join(f"['{k}','{s}']" for k, _, s in GROUPS) + "]],\n ")
for k, v in [('hub', 'd15h'), ('herobg', 'd15f'), ('versus', 'd15v'), ('radar-3d', 'r15a'), ('comic', 'k15h'), ('learn-deep', 'l15d'), ('set-user', 's15u'), ('set-adm', 's15a')]:
    if f"id:'{v}'" in js and f"'{k}':[" in t:
        R(f"'{k}':[", f"'{k}':[['v15','{v}'],")
R("function ttk13(R,ctx){\n const L=[", "function ttk13(R,ctx,LX){\n const L=LX||[")
R("let CTX=null,curV=null,curG='c14';", "let CTX=null,curV=null,curG='d15';")
R("localStorage.getItem('kd14')", "localStorage.getItem('kd15')")
R("localStorage.setItem('kd14',v.id)", "localStorage.setItem('kd15',v.id)")
t = re.sub(r'<h1>.*?</h1>', '<h1>v15 — по твоим ответам в макетах</h1>', t, count=1, flags=re.S)
t = re.sub(r'<p class="lead">.*?</p>', '<p class="lead">Открыта v15 — переделал по 28 твоим ответам в полях «Твоё мнение». Deadlock: вход без дубля радара, герои с сортировкой и тремя размерами, реплики без эха с режимом без звука, компактный Versus со способностью героя, 5 вариантов радара. Дальше — канал, обучение, мод и настройки. Прошлые версии — ниже. Поле «Твоё мнение» под каждым вариантом — как раньше. Звук включается после первого касания.</p>', t, count=1, flags=re.S)
R('<title>Макеты v13</title>', '<title>Макеты v15</title>')
open(P, 'w', encoding='utf8', newline='\n').write(t)
print('ok', len(t), [g[0] for g in GROUPS])
