# сборка v12: в glavnaya-dd.tpl.html (там уже v11) вставляет v12/*.css и v12/*.js, v12 — первой версией на странице
# python ins12.py   (повторно не вставит: проверяет, что v12 ещё нет)  →  потом python ../build.py
import os, re, sys
S = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(S, '..', 'glavnaya-dd.tpl.html')
t = open(P, encoding='utf8').read()
if "g12:'Игры v12'" in t:
    sys.exit('v12 уже вставлена — правь v12/*.js и шаблон руками или откати шаблон из git')
css = open(os.path.join(S, 'v12.css'), encoding='utf8').read()
js = '\n'.join(open(os.path.join(S, f), encoding='utf8').read() for f in ['a12.js', 'b12.js', 'c12.js', 'd12.js'])
def R(a, b):
    global t
    assert a in t, 'нет: ' + a[:90]
    t = t.replace(a, b, 1)
i = t.index('</style>'); t = t[:i] + css + '\n' + t[i:]
m = '/* ================= каркас страницы ================= */'
i = t.index(m); t = t[:i] + js + '\n' + t[i:]
R("const GN={g11:'Игры v11',", "const GN={g12:'Игры v12',k12:'Комикс v12',l12:'Обучение v12',g11:'Игры v11',")
R("const VERS=[['v11','отзыв на v9 — заново на максимуме · 26.10',",
  "const VERS=[['v12','отзыв на v11 · 26.10',[['g12','Игры · 11'],['k12','Комикс · 3'],['l12','Обучение · 5']]],\n ['v11','26.10',")
R("Прошлые версии<small>v10 … v1 — нажми, чтобы сравнить</small>", "Прошлые версии<small>v11 … v1 — нажми, чтобы сравнить</small>")
# «тот же экран в других версиях»: v12 — первой
for k, v in [('games-tab', 'g12t'), ('hub', 'g12h'), ('radar-3d', 'g12r'), ('comic', 'k12a'), ('versus', 'g12v'), ('herobg', 'g12c'), ('learn-deep', 'l12d')]:
    R(f"'{k}':[", f"'{k}':[['v12','{v}'],")
R("let CTX=null,curV=null,curG='g11';", "let CTX=null,curV=null,curG='g12';")
R("localStorage.getItem('kd12')", "localStorage.getItem('kd13')")
R("localStorage.setItem('kd12',v.id)", "localStorage.setItem('kd13',v.id)")
t = re.sub(r'<h1>.*?</h1>', '<h1>v12 — твой отзыв на v11</h1>', t, count=1, flags=re.S)
t = re.sub(r'<p class="lead">.*?</p>', '<p class="lead">Открыта v12: игры (Deadlock отдельно от игр по кино, всё дедлоковское — внутри), герои на карточках, радар 3D, Versus по v10, реплики как в TikTok, звук с сопровождением, 3 комикса, обучение «хватит или ещё» и мнения нейронок — отметь, что берём. Прошлые версии — в «Прошлые версии», под телефоном кнопки «v12 · v11 · v10» — тот же экран в другой версии. Звук включается после первого касания.</p>', t, count=1, flags=re.S)
t = t.replace('<title>Макеты v11</title>', '<title>Макеты v12</title>')
open(P, 'w', encoding='utf8', newline='\n').write(t)
print('ok', len(t))
