# сборка v11: tpl10.html (страница v10) + v11/*.js, *.css → glavnaya-dd.tpl.html
# python3 ins11.py [группа_по_умолчанию]
import sys, os, re
S = os.path.dirname(os.path.abspath(__file__))
D = '/home/user/dota-/дизайн/макеты-24.10/'
t = open(S + '/tpl10.html', encoding='utf8').read()
ORDER_CSS = ['s11.css', 'g11.css', 'g11b.css', 'g11v.css', 'p11.css', 'l11.css', 'x11.css', 'page11.css']
ORDER_JS = ['s11.js', 'g11.js', 'g11b.js', 'g11v.js', 'p11.js', 'l11.js', 'x11.js']
css = '\n'.join(open(S + '/' + f, encoding='utf8').read() for f in ORDER_CSS if os.path.exists(S + '/' + f))
js = '\n'.join(open(S + '/' + f, encoding='utf8').read() for f in ORDER_JS if os.path.exists(S + '/' + f))
def R(a, b, n=1):
    global t
    assert a in t, 'нет: ' + a[:90]
    t = t.replace(a, b) if n == 0 else t.replace(a, b, 1)
# шрифт приложения (Manrope) — для настроек «как в приложении»
R('family=Inter:wght@400;500;600;700;800&', 'family=Inter:wght@400;500;600;700;800&family=Manrope:wght@500;600;700;800&')
i = t.index('</style>'); t = t[:i] + css + '\n' + t[i:]
m = '/* ================= каркас страницы ================= */'
i = t.index(m); t = t[:i] + js + '\n' + t[i:]
R("const GN={g10:", "const GN={g11:'Игры v11',p11:'Сцена · путь v11',l11:'Обучение v11',x11:'Дизайн v11',s11:'Настройки v11',g10:")
# версии: v11 открыта; прошлые — одной раскрывашкой «Прошлые версии»
a = t.index('const VERS=['); b = t.index("let CTX=null,curV=null,curG='g10';")
NEW = r"""const VERS=[['v11','отзыв на v9 — заново на максимуме · 26.10',[['g11','Игры · 8'],['p11','Сцена · путь · 4'],['l11','Обучение · 3'],['s11','Настройки · 3']]],
 ['v10','26.10',[['g10','Игры'],['p10','Сцена · путь'],['l10','Обучение'],['x10','Дизайн']]],
 ['v9','25.10',[['h9','Главная · 3 + v7'],['g8','Игры'],['p8','Сцена · путь'],['l8','Обучение'],['s9','Настройки'],['x8','Дизайн']]],
 ['v7','',[['p7','Сцена'],['k7','Комикс'],['x7','Дизайн']]],['v6','',[['h6','Главная'],['d3','ДД'],['k4','Комикс'],['x6','Дизайн']]],
 ['v5','',[['h4','Главная'],['x5','Дизайн']]],['v4','',[['x4','Дизайн']]],['v3','',[['h3','Главная'],['k3','Комикс'],['x3','Дизайн']]],
 ['v2','',[['h2','Главная'],['d2','ДД'],['o2','Запуск']]],['v1','',[['home','Главная'],['dd','ДД'],['ob','Запуск']]]];
const VDET=(v,open)=>`<details${open?' open':''}><summary>${v[0]}${open?'<span class="nw">новое</span>':''}<small>${v[1]}</small></summary><div class="bs">${v[2].map(b=>`<button data-g="${b[0]}">${b[1]}</button>`).join('')}</div></details>`;
$('#grp').innerHTML=VDET(VERS[0],1)+`<details class="olds"><summary>Прошлые версии<small>v10 … v1 — нажми, чтобы сравнить</small></summary><div class="ol">${VERS.slice(1).map(v=>VDET(v,0)).join('')}</div></details>`;
// «Как было»: тот же экран в прошлых версиях
const CMPV={'set-user':[['v11','s11u'],['v9','s9u']],'set-watch':[['v11','s11w'],['v9','s9u']],'set-adm':[['v11','s11a'],['v9','s9a']],
 'games-tab':[['v11','g11t'],['v10','g10a'],['v9','g8a']],'games-row':[['v11','g11c'],['v10','g10c'],['v9','g9c']],'hub':[['v11','g11h'],['v10','g10a'],['v9','g8a']],
 'radar-relief':[['v11','g11r'],['v10','g10r'],['v9','g8r'],['v7','r7']],'radar-3d':[['v11','g11d'],['v10','g10s'],['v9','g8r']],'comic':[['v11','g11k'],['v10','g10k'],['v9','g9k']],
 'versus':[['v11','g11v'],['v10','g10v'],['v9','g8v'],['v9 · сверху','g8w']],'herobg':[['v11','g11b'],['v10','g10b'],['v9','g9b']],
 'path-t':[['v11','p11t'],['v10','p10t'],['v9','p8t'],['v7','p7t']],'path-w':[['v11','p11w'],['v10','p10w'],['v9','p8w'],['v7','p7w']],'path-s':[['v11','p11s'],['v10','p10s'],['v9','p8s'],['v7','p7s']],'path-b':[['v11','p11b'],['v10','p10b'],['v9','p8b'],['v7','p7b']],
 'learn-check':[['v11','l11a'],['v10','l10a'],['v9','l8a']],'learn-after':[['v11','l11b'],['v10','l10b'],['v9','l8b']],'learn-deep':[['v11','l11d'],['v10','l10d']],
 'design':[['v10','x10a'],['v10 · 2','x10b'],['v8','x8a']]};
function cmpOf(id){for(const k in CMPV)if(CMPV[k].some(x=>x[1]===id))return CMPV[k];return null}
"""
t = t[:a] + NEW + t[b:]
R("let CTX=null,curV=null,curG='g10';", "let CTX=null,curV=null,curG='" + (sys.argv[1] if len(sys.argv) > 1 else 'g11') + "';")
R("mount(start||V.find(x=>x.g==='g10'));", "mount(start||V.find(x=>x.g===curG));")
R("function mount(v){if(CTX)CTX.kill();", "function mount(v){if(CTX)CTX.kill();try{hush();if(AUcur){AUcur.pause();AUcur=null}}catch(e){}")
R("localStorage.getItem('kd11')", "localStorage.getItem('kd12')")
R("localStorage.setItem('kd11',v.id)", "localStorage.setItem('kd12',v.id)")
# раскрыть и внешнюю раскрывашку, если активная кнопка — в прошлой версии
R("const gb=$('#grp button.on');if(gb){const d=gb.closest('details');if(d&&!d.open)d.open=true}",
  "const gb=$('#grp button.on');if(gb){let d=gb.closest('details');while(d){d.open=true;d=d.parentElement&&d.parentElement.closest('details')}}")
# «Как было» — над заметками
R("""function notes(v){const L=V.filter(x=>x.g===v.g),i=L.indexOf(v);
 $('#notes').innerHTML=`<h2>""", """function notes(v){const L=V.filter(x=>x.g===v.g),i=L.indexOf(v);const CM=cmpOf(v.id);
 $('#notes').innerHTML=`${CM?`<div class="cmp"><small>Тот же экран в других версиях</small><div>${CM.map(([n,id])=>`<button data-cmp="${id}" class="${id===v.id?'on':''}">${n}</button>`).join('')}</div></div>`:''}<h2>""")
R("""$$('#notes [data-n]').forEach(b=>b.onclick=()=>{const d=+b.dataset.n;if(!d)mount(v);else mount(L[(i+d+L.length)%L.length])})}""",
  """$$('#notes [data-n]').forEach(b=>b.onclick=()=>{const d=+b.dataset.n;if(!d)mount(v);else mount(L[(i+d+L.length)%L.length])});
 $$('#notes [data-cmp]').forEach(b=>b.onclick=()=>{const x=V.find(y=>y.id===b.dataset.cmp);if(x){mount(x);const dv=$('#devw');if(dv&&dv.getBoundingClientRect().top<0)dv.scrollIntoView({behavior:'smooth'})}})}""")
t = re.sub(r'<h1>.*?</h1>', '<h1>v11 — твой отзыв на v9, заново на максимуме</h1>', t, count=1, flags=re.S)
t = re.sub(r'<p class="lead">.*?</p>', '<p class="lead">Открыта v11. Прошлые версии — в «Прошлые версии». Под телефоном (на компьютере — справа) кнопки «v11 · v10 · v9» — тот же экран в другой версии, чтобы сравнить. Всё живое: тапай, смахивай; «↻ Ещё раз» — заново.</p>', t, count=1, flags=re.S)
t = t.replace('<title>Макеты v10</title>', '<title>Макеты v11</title>')
open(D + 'glavnaya-dd.tpl.html', 'w', encoding='utf8').write(t)
print('ok', len(t))
