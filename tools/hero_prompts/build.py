import re, html, json, sys
import os
D=os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, D)
from tasks import T
GTB='Variant B (flight) — use instead of the timeline above if you want the owl to fly: Around second 1, the green spirit owl behind his right shoulder spreads its wings and lifts off from its place in the air; from second 1 to second 6 it flies one wide slow circle across the upper part of the frame above his head, clearly visible every moment of the way, never leaving the frame, never multiplying; around second 6 it glides back to exactly its starting place behind his right shoulder and folds its wings. His face stays stern as drawn the whole time.'
COV='Animate this exact image: the Deadlock key art «City Never Sleeps». Locked camera, no zoom, no pan. The big lettering «CITY NEVER SLEEPS» and every letter shape stays perfectly static, sharp and readable: no letter moves, warps, changes or is redrawn. Only these things move, gently: the windows of the dark skyscrapers behind the lettering light up one by one in warm yellow and some go dark again; a soft searchlight beam sweeps slowly across the grey sky behind the buildings and back; inside the letters, the tiny lamps and neon signs of the little painted streets glow and blink softly. The six hero cards at the bottom stay in their places with the same frames; each hero only breathes and blinks once at a different moment; nothing else on the cards moves. Everything returns to the first frame at the end, so it loops seamlessly. No new objects, no text changes, no camera movement.'
P=os.path.join(D,'hero-prompts.html')
s=open(P,encoding='utf8').read()
arts={m.group(1):re.sub(r'^<article class="c[^"]*"','<article class="c"',m.group(0)) for m in re.finditer(r'<article class="c[^"]*" data-k="([a-z0-9-]+)".*?</article>',s,re.S) if m.group(1)!='dl-cover'}
head=s[:s.find('<div class="w">')]
BGJ={x['key'].split(':')[-1]:x for x in json.load(open(''+os.path.join(D,'..')+'/bg-prompts.json'))['items']}
def fresh(k,a):
    x=BGJ.get(k) or BGJ.get('hero:deadlock:'+k)
    if not x or not x.get('animate'):return a
    a=re.sub(r'<p class="pr">.*?</p>','<p class="pr">'+html.escape(x['animate'])+'</p>',a,count=1,flags=re.S)
    if x.get('animate_alt'): # запасной промт — второй блок с кнопкой (кнопка копирует текст над собой)
        i=a.find('</div>',a.find('<div class="bt">'))+6
        a=a[:i]+'<p class="alt">Запасной — для Flow / Veo, если Gemini откажет</p><p class="pr">'+html.escape(x['animate_alt'])+'</p><div class="bt"><button class="cp" data-c="p">Скопировать запасной</button></div>'+a[i:]
    return a
arts={k:fresh(k,v) for k,v in arts.items()}
neg=re.search(r'const NEG=(".*?");',s).group(1)
# общий негатив героев — из bg-prompts.json (раньше запускали bg_prompts2.py подпроцессом — падало на Windows)
neg=json.dumps(next(x['neg'] for x in BGJ.values() if x.get('kind')=='hero'),ensure_ascii=False) or neg
# статус героя: что даёт оживление
NOW=[('victor','Реплики есть · сразу откроет 3 диалога с Крысиным королём'),
     ('seven','Реплики есть · сразу откроет 2 диалога: с Венатором и с Крысой'),
     ('celeste','Реплики есть · 2 диалога: с Грей Талоном и Севеном'),
     ('deadmandanny','Реплики есть (15 фраз) · диалогов пока нет')]
REDO=[('rem','По ролику v11 (26.10): «всё отлично, но подушка падает с головы». Теперь подушка прибита к верхнему краю кадра, как крюк к потолку: не падает, не съезжает, не выскальзывает из лапы; качается только сам Рэм под ней. Зелёный свет свечи и тёмный фон — как были. 27.10: свет свечи горит с первого кадра — не «включается» и не разгорается в начале.'),
     ('grey-talon','По ролику v11 (26.10): сова «застывала» на середине и в конце пыталась заговорить. Теперь крылья ходят в одном медленном ритме весь ролик, без пауз; клюв всё время закрыт, голова совы не поворачивается и не смотрит на зрителя.'),
     ('doorman','Gemini отказал второй раз, и без имён: он узнаёт сам арт, текстом это не обойти. Делай в Flow (labs.google/flow → «Кадры в видео», модель Veo), там свои правила: первый промт или запасной под ним — он короче. Откажет и Flow — сделаю Дормену живой портрет кодом из арта (ключи и полы кафтана качаются, блик), без нейросети. 27.10: по запасному промту вышло, но плащ двигался слишком сильно — теперь полы кафтана почти стоят (чуть качнутся на 2-й и 5-й секунде).'),
     ('rat-king','По ролику v11 (26.10): живот раздувался, морда «радовалась». Причина — общий кусок шаблона «грудь поднимается с дыханием», модель раздула живот. Для Крысы его убрал: тело неподвижно, как статуя, живот не меняет размер, выражение морды как на арте в каждом кадре. По v12 (27.10): хвост чуть двигается, но заметно — кончик хвоста слева медленно покачивается на 4-й и 6-й секунде, сам хвост лежит на трубе. Ролик, что уже в игре, не трогаем.')]
DONE=[('venator','Готово: петля из твоего ролика лежит в R2 (venator-2.mp4)')]
used={k for k,_ in NOW+REDO+DONE}
LATER=[(k,'Реплики ещё не готовы — задача Зетке «Интересные фразы остальных 35 героев»') for k in arts if k not in used]
def card(k,note,cls):
    a=re.sub(r'<p class="why">.*?</p>','',arts[k],count=1,flags=re.S)
    a=a.replace('<article class="c"','<article class="c '+cls+'"',1)
    return a.replace('</header>','</header><p class="why">'+html.escape(note)+'</p>',1)
def panel(id,L,cls,intro):
    return f'<section class="pn" id="p-{id}" hidden><p class="pi">{intro}</p><div class="g2">'+''.join(card(k,n,cls) for k,n in L)+'</div></section>'
tabs=[('now','Нужно сейчас',len(NOW)),('redo','Переделать',len(REDO)),('later','Потом',len(LATER)),('done','Готово',len(DONE)),('games','Другие игры',0),('zai','Задачи Зетке',len(T))]
tb=''.join(f'<button class="tb" data-t="{i}">{n}<small>{c or ""}</small></button>' for i,n,c in tabs)
tasks=''.join(f'''<article class="tk" data-k="{x['nm']}"><header><h3><span>{i+1}</span>{html.escape(x['title'])}</h3><label class="dn"><input type="checkbox"> отдал</label></header>
<p class="why">{html.escape(x['why'])}</p><p class="tm">у Зетки ≈ {x['hours']} · ветка {x['br']}</p>
<pre class="tx">{html.escape(x['text'])}</pre><div class="bt"><button class="cpt">Скопировать задачу</button></div></article>''' for i,x in enumerate(T))
css='''
.tabs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px;position:sticky;top:0;z-index:5;background:var(--bg);padding-block:8px}
.tabs::-webkit-scrollbar{display:none}
.tb{flex:none;display:flex;gap:6px;align-items:center;background:var(--card);color:var(--fg);border:1px solid var(--line);border-radius:999px;padding:9px 14px}
.tb small{font:600 11px/1 var(--f-b);color:var(--mut)} .tb.on{background:var(--acc);color:var(--card);border-color:var(--acc)} .tb.on small{color:var(--card);opacity:.8}
.pi{margin:0 0 12px;color:var(--mut);max-width:70ch}
.alt{margin:10px 0 0;font:600 12px/1.3 var(--f-b);color:var(--mut);text-transform:uppercase;letter-spacing:.04em}
.why{margin:0;font-size:13px;line-height:1.4;padding:7px 10px;border-radius:9px;background:var(--bg)}
.c.now .why{background:color-mix(in srgb,var(--acc) 14%,var(--card))} .c.redo .why{background:color-mix(in srgb,#E2902A 18%,var(--card))} .c.dn2 .why{background:color-mix(in srgb,var(--ok) 16%,var(--card))}
.tk{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px 16px;display:grid;gap:8px;min-width:0}
.tk.done{border-color:var(--ok);opacity:.7}
.tk h3{margin:0;font:700 17px/1.3 var(--f-b);display:flex;gap:10px;align-items:baseline}
.tk h3 span{flex:none;display:inline-grid;place-items:center;width:28px;height:28px;border-radius:50%;background:var(--acc);color:var(--card);font-size:14px}
.tm{margin:0;font-size:12px;color:var(--mut)}
.tx{margin:0;font:12px/1.5 var(--f-m);white-space:pre-wrap;overflow-wrap:anywhere;max-height:14em;overflow:auto;background:var(--bg);border-radius:9px;padding:10px 12px}
[hidden]{display:none!important}
.gl{display:grid;gap:14px}
.empty{background:var(--card);border:1px dashed var(--line);border-radius:14px;padding:22px;color:var(--mut)}
'''
lead='''<h1>Промты героев Deadlock</h1>
<div class="lead"><p>Сверху вкладки: кого оживлять прямо сейчас, кого переделать, кто потом. Последняя вкладка — задачи для Зетки, по одной.</p></div>
<div class="box"><b>Как генерить</b><ul>
<li>Нажми на кадр 16:9 — откроется в полном размере, сохрани.</li>
<li>Flow → «Кадры в видео»: этот кадр первым (и последним, если есть такое поле), 8 секунд.</li>
<li>Скопируй промт; негатив — в поле негатива, если оно есть.</li>
<li>Flow выдаёт обычное видео, не петлёй, — так и надо: кидай сырой ролик Claude, петлю он склеит сам и проверит шов.</li>
<li>В каждом промте каждая крыса, птица и вещь описана отдельно, со своим местом — так они не пропадают и не сливаются.</li></ul>
<b>Негатив (общий)</b><div class="neg">'''+html.escape(json.loads(neg))+'''</div><div class="bt"><button class="cp g" data-c="n">Скопировать негатив</button></div></div>
<nav class="tabs">'''+tb+'''</nav>
<div class="bar" id="qb"><input id="q" type="search" placeholder="Найти героя"><span class="cnt" id="cnt"></span></div>'''
body=(panel('now',NOW,'now','Реплики и диалоги для этих героев уже есть — как только оживишь, они сразу появятся в игре. Сверху — кто откроет больше диалогов с уже живыми Венатором и Крысой.')
 +panel('redo',REDO,'redo','Уже оживляли, но вышло не так. Промт поправлен по твоему разбору.')
 +panel('later',LATER,'later','Промты готовы, но реплик ещё нет — оживлять после «Нужно сейчас».')
 +panel('done',DONE,'dn2','Готово и лежит в R2.')
 +'<section class="pn" id="p-games" hidden><p class="pi">Обложка Deadlock «City Never Sleeps». Мой совет: не оживлять в Veo — буквы почти всегда «плывут». Живость сделаю кодом (окна загораются, луч прожектора, блик по буквам). Промт ниже — если всё же захочешь попробовать.</p><article class="c" data-k="dl-cover"><div class="bd"><header><h2>Deadlock · обложка</h2><label class="dn"><input type="checkbox"> готово</label></header><p class="pr">'+html.escape(COV)+'</p><div class="bt"><button class="cp" data-c="p">Скопировать</button></div></div></article><div class="empty">Когда добавим следующую игру, её герои появятся здесь такими же карточками.</div></section>'
 +'<section class="pn" id="p-zai" hidden><p class="pi">Отдавай по одной. Каждая — целиком: правила, что сделать, формат, как проверить. Отдал — поставь галочку. Порядок: сверху самые нужные.</p><div class="gl">'+tasks+'</div></section>')
js='''<script>
const NEG='''+neg+''';
const ls={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const C=[...document.querySelectorAll('.c')],K=[...document.querySelectorAll('.tk')];
function cnt(){const p=document.querySelector('.pn:not([hidden])'),L=p?[...p.querySelectorAll('.c')]:[];document.getElementById('cnt').textContent=L.length?'готово '+L.filter(c=>c.classList.contains('done')).length+' из '+L.length:''}
C.forEach(c=>{const k=c.dataset.k,cb=c.querySelector('input');if(ls.get('hp-'+k)==='1'){cb.checked=true;c.classList.add('done')}
 cb.addEventListener('change',()=>{c.classList.toggle('done',cb.checked);ls.set('hp-'+k,cb.checked?'1':'0');cnt()})});
K.forEach(c=>{const k=c.dataset.k,cb=c.querySelector('input');if(ls.get('zt-'+k)==='1'){cb.checked=true;c.classList.add('done')}
 cb.addEventListener('change',()=>{c.classList.toggle('done',cb.checked);ls.set('zt-'+k,cb.checked?'1':'0')})});
function tab(t){document.querySelectorAll('.tb').forEach(b=>b.classList.toggle('on',b.dataset.t===t));document.querySelectorAll('.pn').forEach(p=>p.hidden=p.id!=='p-'+t);
 document.getElementById('qb').hidden=(t==='zai'||t==='games');ls.set('hp-tab',t);cnt()}
document.querySelectorAll('.tb').forEach(b=>b.onclick=()=>tab(b.dataset.t));tab(ls.get('hp-tab')||'now');
function copy(t,b,el){const old=b.textContent,ok=()=>{b.textContent='Скопировано';b.classList.add('ok');setTimeout(()=>{b.textContent=old;b.classList.remove('ok')},1400)};
 const sel=()=>{const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Выделено — скопируй'};
 if(navigator.clipboard)navigator.clipboard.writeText(t).then(ok,sel);else sel()}
document.addEventListener('click',e=>{const b=e.target.closest('.cp,.cpt');if(!b)return;
 if(b.classList.contains('cpt')){const el=b.closest('.tk').querySelector('.tx');return copy(el.textContent,b,el)}
 if(b.dataset.c==='n')return copy(NEG,b,document.querySelector('.neg'));const el=b.closest('.bt').previousElementSibling;copy(el.textContent,b,el)});
document.getElementById('q').addEventListener('input',e=>{const v=e.target.value.trim().toLowerCase();C.forEach(c=>c.hidden=!!v&&!c.querySelector('h2').textContent.toLowerCase().includes(v)&&!c.dataset.k.includes(v))});
</script>'''
head=head if '.tabs{display:flex;gap:6px' in head else head.replace('</style>',css+'</style>',1)
out=head+'<div class="w">'+lead+body+'</div>\n'+js
out=re.sub(r'<details class="alt">.*?</details>','',out,flags=re.S)
out=re.sub(r'(<article class="c[^"]*" data-k="grey-talon".*?<div class="bt">.*?</div>)',lambda m:m.group(1)+'<details class="alt"><summary>Вариант Б — сова облетает круг</summary><p class="pr">'+html.escape(GTB)+'</p><div class="bt"><button class="cp" data-c="p">Скопировать вариант Б</button></div></details>',out,count=1,flags=re.S)
open(P,'w',encoding='utf8').write(out)
print(len(out), len(NOW),len(REDO),len(LATER),len(DONE),len(T))
