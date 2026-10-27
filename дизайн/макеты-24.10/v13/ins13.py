# сборка v13: в glavnaya-dd.tpl.html (там уже v12) вставляет v13/*.css и v13/*.js, v13 — первой версией на странице
# python ins13.py   (повторно не вставит: проверяет, что v13 ещё нет)  →  потом python ../build.py (или --pub)
import os, re, sys
S = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(S, '..', 'glavnaya-dd.tpl.html')
t = open(P, encoding='utf8').read()
if "g13:'Игры v13'" in t:
    sys.exit('v13 уже вставлена — откати шаблон из git (git checkout -- glavnaya-dd.tpl.html) и запусти снова')
css = '\n'.join(open(os.path.join(S, f), encoding='utf8').read() for f in ['v13.css', 'p13.css'])
js = '\n'.join(open(os.path.join(S, f), encoding='utf8').read() for f in ['a13.js', 'b13.js', 'c13.js', 'e13.js', 'p13.js', 'l13.js', 's13.js', 'd13.js'])
def R(a, b):
    global t
    assert a in t, 'нет: ' + a[:90]
    t = t.replace(a, b, 1)
i = t.index('</style>'); t = t[:i] + css + '\n' + t[i:]
m = '/* ================= каркас страницы ================= */'
i = t.index(m); t = t[:i] + js + '\n' + t[i:]
# вкладка «Игры» v12 открывает Deadlock, который ей дали (v13 — новый вид изнутри)
R("ctx.t(()=>g12Hub(R,ctx,cd,{onClose(){hub=false}}),140)", "ctx.t(()=>(o.hub||g12Hub)(R,ctx,cd,{onClose(){hub=false}}),140)")
R("const GN={g12:'Игры v12',", "const GN={g13:'Игры v13',k13:'Комикс v13',l13:'Обучение v13',s13:'Настройки v13',g12:'Игры v12',")
R("const VERS=[['v12','отзыв на v11 · 26.10',",
  "const VERS=[['v13','отзыв на v12 · 26.10',[['g13','Игры · 10'],['k13','Комикс · выбор главы · 2'],['l13','Обучение · 5'],['s13','Настройки · 2']]],\n ['v12','отзыв на v11 · 26.10',")
R("Прошлые версии<small>v11 … v1 — нажми, чтобы сравнить</small>", "Прошлые версии<small>v12 … v1 — нажми, чтобы сравнить</small>")
for k, v in [('games-tab', 'g13t'), ('hub', 'g13h'), ('radar-3d', 'g13r'), ('comic', 'k13a'), ('versus', 'g13v'), ('herobg', 'g13f'), ('learn-deep', 'l13d'), ('set-user', 's13u'), ('set-adm', 's13a')]:
    R(f"'{k}':[", f"'{k}':[['v13','{v}'],")
R("let CTX=null,curV=null,curG='g12';", "let CTX=null,curV=null,curG='g13';")
R("localStorage.getItem('kd13')", "localStorage.getItem('kd14')")
# 27.10: комикс листался сам каждые 3,4 с и обрывал длинные реплики (4,4–4,8 с) — теперь ждёт, пока договорит, плюс 1,6 с прочитать
R("if(i<CM12.length)ctx.t(auto,3400)};ctx.t(auto,4200)}", "if(i<CM12.length)ctx.t(auto,Math.max(3400,(DUR11[(CM12[i]||{}).a]||2.4)*1000+1600))};ctx.t(auto,900+(DUR11[(CM12[0]||{}).a]||2.4)*1000+1600)}")
R("localStorage.setItem('kd13',v.id)", "localStorage.setItem('kd14',v.id)")
t = re.sub(r'<h1>.*?</h1>', '<h1>v13 — твой отзыв на v12</h1>', t, count=1, flags=re.S)
t = re.sub(r'<p class="lead">.*?</p>', '<p class="lead">Открыта v13: Deadlock изнутри без «VS» на входе, герои маленькими иконками на живой локации, радар с модельками мест (цвета v12 один в один), Versus — v10 один в один и починенный, плюс сравнение с v10 шторкой; реплики с ультой и звуком; «кто про кого» со сменой места; выбор главы комикса; обучение — карточки вместо кадров, награды за уровень героя, советы нейронок по одному; настройки в виде Главной. Под телефоном кнопки «v13 · v12 · …» — тот же экран в другой версии. Звук включается после первого касания.</p>', t, count=1, flags=re.S)
R('<title>Макеты v12</title>', '<title>Макеты v13</title>')
open(P, 'w', encoding='utf8', newline='\n').write(t)
print('ok', len(t))
