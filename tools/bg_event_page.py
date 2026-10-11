# Страница «Фоны с событием» (Artifact на claude.ai, Андрей копирует промты с телефона): python3 tools/bg_event_page.py фоны-промты-СОБЫТИЕ.json <выход.html>
# Данные — из tools/bg_event.py (сначала python3 tools/bg_event.py). Версия 2: строка «Что поменял» (поле why), отметки «Готово» — ключ bgev-done-v2. Опубликовано: https://claude.ai/artifact/UPEaiK2PJzF9crBfGQeK13 — обновлять публикацией того же файла / этого url.
import json,sys,os
src=sys.argv[1];out=sys.argv[2]
d=json.load(open(src,encoding='utf-8'))
data=json.dumps(d['items'],ensure_ascii=False).replace('</','<\\/')
HTML=r'''<title>Фоны с событием</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600&family=Golos+Text:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap">
<style>
/* Лист съёмки (shot list) для Veo: карточка = один ролик; полоса 8 с показывает, где спокойно, где событие, где «после» */
:root{
  --bg:#EEF0EE;--card:#FFFFFF;--ink:#1A1D21;--mute:#5D646C;--line:#D6DAD8;
  --calm:#8FA7B8;--event:#D9822B;--after:#B9C2C7;--accent:#1E5E86;--ok:#2F8A57;--okbg:#E3F3E9;
  --f-disp:'Oswald','Arial Narrow',Arial,sans-serif;--f-body:'Golos Text',system-ui,-apple-system,'Segoe UI',sans-serif;--f-mono:'JetBrains Mono',ui-monospace,Menlo,Consolas,monospace;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --bg:#111417;--card:#1A1E22;--ink:#E8EAE6;--mute:#9AA3AA;--line:#2C3237;
  --calm:#4F6B7E;--event:#F0A043;--after:#3A444B;--accent:#79B8E3;--ok:#5FC88A;--okbg:#17301F;color-scheme:dark}}
:root[data-theme="dark"]{
  --bg:#111417;--card:#1A1E22;--ink:#E8EAE6;--mute:#9AA3AA;--line:#2C3237;
  --calm:#4F6B7E;--event:#F0A043;--after:#3A444B;--accent:#79B8E3;--ok:#5FC88A;--okbg:#17301F;color-scheme:dark}
body{background:var(--bg);color:var(--ink);font:15px/1.5 var(--f-body);}
.wrap{max-width:860px;margin:0 auto;padding-inline:16px;padding-block:20px 60px;display:flex;flex-direction:column;gap:14px}
h1{margin:0;font:600 30px/1.1 var(--f-disp);letter-spacing:.01em;text-wrap:balance}
.lead{margin:0;color:var(--mute);max-width:62ch}
.how{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 14px}
.how summary{cursor:pointer;font-weight:700;list-style:none;display:flex;justify-content:space-between;gap:10px}
.how summary::-webkit-details-marker{display:none}
.how summary::after{content:'▾';color:var(--mute)}.how[open] summary::after{content:'▴'}
.how ul{margin:10px 0 0;padding-left:18px;display:flex;flex-direction:column;gap:6px;color:var(--ink)}
.how li{max-width:70ch}
.legend{display:flex;flex-wrap:wrap;gap:12px;font-size:13px;color:var(--mute)}
.legend i{display:inline-block;width:14px;height:8px;border-radius:2px;margin-right:6px;vertical-align:middle}
.bar{background:var(--bg);padding-block:8px;display:flex;flex-direction:column;gap:8px;border-bottom:1px solid var(--line)}
@media (min-width:700px){.bar{position:sticky;top:env(safe-area-inset-top,0px);z-index:5}}
.prog{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--mute)}
.prog b{font:600 18px var(--f-disp);color:var(--ink);font-variant-numeric:tabular-nums}
.meter{flex:1;height:6px;border-radius:3px;background:var(--line);overflow:hidden}.meter i{display:block;height:100%;background:var(--ok);width:0;transition:width .3s}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:99px;padding:5px 11px;font:500 13px var(--f-body);cursor:pointer}
.chip[aria-pressed="true"]{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.chip.hide{margin-left:auto}
.list{display:flex;flex-direction:column;gap:12px}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px;display:flex;flex-direction:column;gap:10px}
.card.done{border-color:var(--ok)}
.top{display:grid;grid-template-columns:auto minmax(0,1fr);gap:4px 12px;align-items:start}
.no{font:600 26px/1 var(--f-disp);color:var(--mute);min-width:2ch;font-variant-numeric:tabular-nums;padding-top:2px}
.card.done .no{color:var(--ok)}
.ttl{display:flex;flex-direction:column;gap:2px;min-width:0}
.grp{font:600 11px var(--f-body);letter-spacing:.12em;text-transform:uppercase;color:var(--accent)}
.ttl h2{margin:0;font:600 18px/1.25 var(--f-body);text-wrap:balance}
.kind{display:inline-block;margin-left:6px;padding:1px 7px;border-radius:5px;font:600 11px var(--f-body);vertical-align:2px;background:var(--bg);color:var(--mute);border:1px solid var(--line)}
.fn{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:13px;color:var(--mute)}
.fn code{font:500 13px var(--f-mono);color:var(--ink);background:var(--bg);padding:2px 6px;border-radius:5px;border:1px solid var(--line)}
.tl{display:flex;height:22px;border-radius:6px;overflow:hidden;font:600 10.5px var(--f-body);letter-spacing:.04em;text-transform:uppercase}
.tl span{display:flex;align-items:center;justify-content:center;white-space:nowrap;overflow:hidden;color:#fff;min-width:0}
.tl .s0{background:var(--calm)}.tl .s1{background:var(--event)}.tl .s2{background:var(--after);color:var(--ink)}
.ticks{display:flex;justify-content:space-between;font:400 10.5px var(--f-mono);color:var(--mute);margin-top:-6px;font-variant-numeric:tabular-nums}
dl{margin:0;display:grid;grid-template-columns:auto minmax(0,1fr);gap:6px 12px}
dt{font:600 12px var(--f-body);color:var(--mute);padding-top:2px;white-space:nowrap}
dd{margin:0;max-width:70ch}
dd.ev{font-weight:600}
.loop{font-size:13px;color:var(--mute)}
dd.why{font-size:14px;color:var(--ink);border-left:3px solid var(--accent);padding-left:9px}
.acts{display:flex;gap:8px;flex-wrap:wrap}
.btn{border:0;border-radius:10px;padding:11px 16px;font:700 14.5px var(--f-body);cursor:pointer;background:var(--accent);color:var(--card)}
.btn.ghost{background:transparent;color:var(--ink);border:1px solid var(--line)}
.btn.okb[aria-pressed="true"]{background:var(--okbg);color:var(--ok);border-color:var(--ok)}
.btn.small{padding:4px 9px;font-size:12px;border-radius:7px}
.btn:focus-visible,.chip:focus-visible,summary:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.pr{display:none;width:100%;box-sizing:border-box;min-height:220px;resize:vertical;border:1px solid var(--line);border-radius:10px;background:var(--bg);color:var(--ink);font:400 12.5px/1.55 var(--f-mono);padding:10px}
.card.show .pr{display:block}
.toast{position:fixed;left:50%;bottom:calc(18px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);background:var(--ink);color:var(--bg);padding:10px 16px;border-radius:10px;font-weight:600;opacity:0;transition:opacity .2s;pointer-events:none;z-index:9}
.toast.on{opacity:1}
.empty{color:var(--mute);text-align:center;padding:30px 0}
@media (max-width:480px){h1{font-size:26px}.acts .btn{flex:1}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
</style>
<div class="wrap">
  <header style="display:flex;flex-direction:column;gap:8px">
    <h1>Фоны с событием</h1>
    <p class="lead">37 роликов для Veo: 4 секунды спокойно, на 4-й — одно резкое событие из сюжета, дальше «после». <b>Версия 2:</b> все 37 переписаны заново по кадрам сцен — в каждой карточке «Что поменял». Скопируй промт, вставь во Flow, отметь «Готово».</p>
  </header>
  <details class="how" id="how" open>
    <summary>Как прогонять</summary>
    <ul>
      <li>Google Flow → Veo 3.1 → Text to Video, <b>9:16</b>, <b>8 с</b>. Промт копируй целиком.</li>
      <li>Разметка <code>[00:00-00:04]</code> внутри промта — не ошибка: так Veo 3.1 понимает, что и в какую секунду происходит.</li>
      <li>Событие вышло не ровно на 4-й секунде — не страшно, найду сам.</li>
      <li>Вышла склейка (сменился кадр, камера поехала) — перегенерируй тот же промт, не дописывай.</li>
      <li>«I can't generate that video» — убери одну «острую» деталь (револьвер, таблетки, топор, сигарету) и прогони ещё раз.</li>
      <li>Для тех, где «петля сама»: можно сделать картинку по первой части промта (до слова Timeline), потом Frames to Video — эту картинку и в начало, и в конец. Тогда ролик точно вернётся к началу.</li>
      <li>Два файла переименованы (поменялось место): «сопрано мотель» → <code>сопрано хасиды.mp4</code>, «бб дверь» → <code>бб спальня.mp4</code>.</li>
      <li>Готовое клади в репо scenes → <code>claude/субтитры/фоны/</code> под именем из карточки. Дальше я сам: петля, событие реже (на Главной раз в ~12 с), в приложение.</li>
    </ul>
  </details>
  <div class="legend"><span><i style="background:var(--calm)"></i>спокойно</span><span><i style="background:var(--event)"></i>событие</span><span><i style="background:var(--after)"></i>после</span></div>
  <div class="bar">
    <div class="prog"><span>Готово <b id="nDone">0</b> из <b id="nAll">0</b></span><span class="meter"><i id="meter"></i></span></div>
    <div class="chips" id="chips"></div>
  </div>
  <div class="list" id="list"></div>
  <p class="empty" id="empty" hidden>Здесь пусто — всё отмечено готовым. Нажми «Показать готовые».</p>
</div>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<script type="application/json" id="data">__DATA__</script>
<script>
(function(){
  const ITEMS=JSON.parse(document.getElementById('data').textContent);
  const KEY='bgev-done-v2',KH='bgev-how';
  const load=k=>{try{return JSON.parse(localStorage.getItem(k)||'null');}catch(e){return null;}};
  const store=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}};
  const done=new Set(load(KEY)||[]);let grp='Все',hideDone=false;
  const how=document.getElementById('how');if(load(KH)===false)how.open=false;how.addEventListener('toggle',()=>store(KH,how.open));
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const segs=p=>{const re=/\[(\d\d):(\d\d)-(\d\d):(\d\d)\]/g;const out=[];let m;while((m=re.exec(p)))out.push([+m[1]*60+ +m[2],+m[3]*60+ +m[4]]);return out;};
  const LBL=['спокойно','событие','после'];
  function timeline(p){const S=segs(p),T=S.length?S[S.length-1][1]:8;
    return '<div class="tl" aria-label="Что происходит по секундам">'+S.map(([a,b],i)=>{const k=Math.min(i,2);return `<span class="s${k}" style="width:${(b-a)/T*100}%">${b-a>=1?LBL[k]:''}</span>`;}).join('')+'</div>'
      +'<div class="ticks">'+Array.from({length:T+1},(_,i)=>`<span>${i}</span>`).join('')+'</div>';}
  const groups=['Все',...[...new Set(ITEMS.map(x=>x.grp))]];
  function chips(){const c=document.getElementById('chips');
    c.innerHTML=groups.map(g=>`<button class="chip" data-g="${esc(g)}" aria-pressed="${g===grp}">${esc(g)}</button>`).join('')+`<button class="chip hide" id="hd" aria-pressed="${hideDone}">Скрыть готовые</button>`;
    c.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{grp=b.dataset.g;render();});
    document.getElementById('hd').onclick=()=>{hideDone=!hideDone;render();};}
  function render(){chips();const L=ITEMS.filter(x=>(grp==='Все'||x.grp===grp)&&!(hideDone&&done.has(x.n)));
    document.getElementById('list').innerHTML=L.map(x=>`<article class="card${done.has(x.n)?' done':''}" id="c${x.n}">
      <div class="top"><span class="no">${x.n}</span><div class="ttl"><span class="grp">${esc(x.grp)}</span><h2>${esc(x.title)}<span class="kind">${x.kind==='main'?'главный фон':'фон сцены'}</span></h2></div></div>
      <div class="fn">Назови файл: <code>${esc(x.file)}</code><button class="btn ghost small" data-cpn="${x.n}">Скопировать имя</button></div>
      ${timeline(x.prompt)}
      <dl><dt>В кадре</dt><dd>${esc(x.ru)}</dd><dt>Событие</dt><dd class="ev">${esc(x.ev)}</dd>${x.why?`<dt>Что поменял</dt><dd class="why">${esc(x.why)}</dd>`:''}<dt>Петля</dt><dd class="loop">${esc(x.loopRu)}</dd></dl>
      <div class="acts"><button class="btn" data-cp="${x.n}">Скопировать промт</button><button class="btn ghost" data-sh="${x.n}">Текст промта</button><button class="btn ghost okb" data-ok="${x.n}" aria-pressed="${done.has(x.n)}">${done.has(x.n)?'✓ Готово':'Готово'}</button></div>
      <textarea class="pr" id="p${x.n}" readonly aria-label="Промт ${x.n}">${esc(x.prompt)}</textarea></article>`).join('');
    document.getElementById('empty').hidden=L.length>0;
    document.getElementById('nDone').textContent=done.size;document.getElementById('nAll').textContent=ITEMS.length;document.getElementById('meter').style.width=(done.size/ITEMS.length*100)+'%';
    bind();}
  let tt=0;function toast(t){const e=document.getElementById('toast');e.textContent=t;e.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('on'),1600);}
  function copy(text,ta,okMsg){
    const fb=()=>{if(ta){const card=ta.closest('.card');card.classList.add('show');ta.focus();ta.select();ta.setSelectionRange(0,ta.value.length);}toast('Выделил текст — нажми «Скопировать»');};
    try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(()=>toast(okMsg),fb);return;}}catch(e){}fb();}
  function bind(){
    document.querySelectorAll('[data-cp]').forEach(b=>b.onclick=()=>{const x=ITEMS.find(i=>i.n===+b.dataset.cp);copy(x.prompt,document.getElementById('p'+x.n),`Промт ${x.n} скопирован`);});
    document.querySelectorAll('[data-cpn]').forEach(b=>b.onclick=()=>{const x=ITEMS.find(i=>i.n===+b.dataset.cpn);copy(x.file,null,'Имя скопировано: '+x.file);});
    document.querySelectorAll('[data-sh]').forEach(b=>b.onclick=()=>{const c=document.getElementById('c'+b.dataset.sh);c.classList.toggle('show');b.textContent=c.classList.contains('show')?'Скрыть текст':'Текст промта';});
    document.querySelectorAll('[data-ok]').forEach(b=>b.onclick=()=>{const n=+b.dataset.ok;if(done.has(n))done.delete(n);else done.add(n);store(KEY,[...done]);
      if(hideDone&&done.has(n)){render();toast('Отмечено: '+n);return;}const c=document.getElementById('c'+n);c.classList.toggle('done',done.has(n));b.setAttribute('aria-pressed',done.has(n));b.textContent=done.has(n)?'✓ Готово':'Готово';
      document.getElementById('nDone').textContent=done.size;document.getElementById('meter').style.width=(done.size/ITEMS.length*100)+'%';});}
  render();
})();
</script>
'''
open(out,'w',encoding='utf-8').write(HTML.replace('__DATA__',data))
print(out,os.path.getsize(out)//1024,'КБ')
