# сборка v20: в glavnaya-dd.tpl.html (там уже v13–v19) — свежие v16/done.js и v19/q9.js, v20/z20.css, z20.js; v20 — первой,
# вкладки «Макеты · Итог · Вопросы · Уже готово»
# python3 v20/ins20.py   (повторно не вставит)  →  python3 build.py --pub
# пока правишь: git checkout -- glavnaya-dd.tpl.html && python3 v20/ins20.py && python3 build.py --pub
import os, subprocess, sys
S = os.path.dirname(os.path.abspath(__file__))
D = os.path.join(S, '..')
P = os.path.join(D, 'glavnaya-dd.tpl.html')
t = open(P, encoding='utf8').read()
if "id=\"zq\"" in t:
    sys.exit('v20 уже вставлена — откати шаблон из git (git checkout -- glavnaya-dd.tpl.html) и запусти снова')
def R(a, b):
    global t
    assert a in t, 'нет: ' + a[:90]
    t = t.replace(a, b, 1)
def fresh(rel):
    old = subprocess.run(['git', 'show', 'HEAD:./' + rel], cwd=D, capture_output=True, text=True).stdout.strip()
    new = open(os.path.join(D, rel), encoding='utf8').read().strip()
    if old and old != new: R(old, new)
for f in ['v16/done.js', 'v19/q9.js']: fresh(f)
css = open(os.path.join(S, 'z20.css'), encoding='utf8').read()
js = open(os.path.join(S, 'z20.js'), encoding='utf8').read()
i = t.index('</style>'); t = t[:i] + css + '\n' + t[i:]
m = '/* ================= каркас страницы ================= */'
i = t.index(m); t = t[:i] + js + '\n' + t[i:]
GROUPS = [('z1', 'Главная', 3), ('z2', 'Deadlock', 5), ('z3', 'Радар', 3), ('z4', 'Реплики героев', 4), ('z5', 'Комикс', 4), ('z6', 'Versus', 2),
          ('z7', 'Сцена · путь', 4), ('z8', 'Обучение', 8), ('z9', 'Настройки и админка', 2), ('z10', 'Канал и бот', 4), ('z11', 'Restless', 2), ('z12', 'Ролики TikTok', 2)]
R("const GN={", "const GN={" + ''.join("%s:'%s · итог',"% (g, n) for g, n, _ in GROUPS))
R("const VERS=[", "const VERS=[['v20','28.10 · всё в одном — по разделам, что ты одобрил',[" + ','.join("['%s','%s · %d']" % (g, n, k) for g, n, k in GROUPS) + "]],\n ")
R("let CTX=null,curV=null,curG='h19';", "let CTX=null,curV=null,curG='z1';")
t = t.replace("localStorage.getItem('kd19')", "localStorage.getItem('kd20')").replace("localStorage.setItem('kd19',v.id)", "localStorage.setItem('kd20',v.id)")
R('v14 … v1 — нажми на версию, она раскроется', 'v19 … v1 — нажми на версию, она раскроется')
R('<title>Макеты v19</title>', '<title>Макеты v20</title>')
R('<h1>v19 — игры в меню, Deadlock без комиксов</h1>', '<h1>v20 — всё в одном</h1>')
i = t.index('<p class="lead">'); j = t.index('</p>', i)
t = t[:i] + ('<p class="lead"><b>Ничего не потерялось:</b> v17–v19 трогали только главную, а радар, реплики, комикс и обучение лежали в v9–v15. '
             'Теперь всё в одном месте — 12 разделов приложения, в каждом то, что ты одобрил (твои слова — в «Откуда идея»). '
             'Вернул сонар, «кто про кого», реплики как в TikTok, углублённое обучение. Новое — «Сегодня в Deadlock» (чем заняться, как в приложении). '
             'Вкладки сверху: <b>«Итог»</b> — что будет в приложении и в каком виде + что решили в каждой версии; <b>«Вопросы»</b> — все открытые вопросы, отвечай кнопкой.') + t[j:]
R('<section class="done" id="done" hidden></section>', '<section class="done" id="done" hidden></section>\n <section class="done" id="zsum" hidden></section>\n <section class="done" id="zq" hidden></section>')
# вкладки: m — макеты, i — итог, q — вопросы, d — уже готово
a = t.index('function dnTab(p){'); b = t.index("addEventListener('hashchange'", a); b = t.index('\n', b) + 1
t = t[:a] + '''function dnTab(p){const m=p==='m';$$('#ptab button').forEach(b=>b.classList.toggle('on',b.dataset.p===p));
 ['#grp','#vars','.stage'].forEach(s=>{const e=$(s);if(e)e.hidden=!m});
 [['d','#done',dnRender],['i','#zsum',zSumRender],['q','#zq',zqRender]].forEach(([k,s,f])=>{const e=$(s);if(e){e.hidden=p!==k;if(p===k)f()}});
 if(!m){try{if(CTX)CTX.kill();hush();if(AUcur){AUcur.pause();AUcur=null}}catch(e){}try{S13.stopLine()}catch(e){}}else if(curV&&!CTX.alive)mount(curV);
 try{history.replaceState(null,'',m?(curV?'#'+curV.id:location.pathname):'#'+({d:'done',i:'itog',q:'voprosy'})[p])}catch(e){}}
const PTH={'#done':'d','#itog':'i','#voprosy':'q'};
$('#ptab').innerHTML=`<button data-p="m" class="on">Макеты</button><button data-p="i">Итог</button><button data-p="q">Вопросы<b class="zq-b">${Z20Q.length}</b></button><button data-p="d">Уже готово<b>${DN_APP.length}</b></button>`;
$$('#ptab button').forEach(b=>b.onclick=()=>dnTab(b.dataset.p));
addEventListener('hashchange',()=>{const p=PTH[location.hash];if(p)dnTab(p)});
''' + t[b:]
R("if((location.hash||'')==='#done')dnTab('d');", "if(PTH[location.hash||''])dnTab(PTH[location.hash]);\nsetTimeout(()=>{try{zqRender();$('#zq').hidden=!$('#ptab [data-p=\"q\"]').classList.contains('on')}catch(e){}},1800);")
R('<h2 class="dn-h">Сегодня, 28.10 — вне приложения', '<h2 class="dn-h">Сегодня, 28.10 — вне приложения')
open(P, 'w', encoding='utf8', newline='\n').write(t)
print('ok', len(t))
