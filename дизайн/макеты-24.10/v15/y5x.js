/* ================= v15 · Restless — разбор матчей Deadlock (как Ruiner для Доты) =================
   Андрей: «добавь разбор нашего проекта, пусть называется Restless или есть лучше? в плане не вижу хоть какого-то упоминания —
   а должны быть продвижения в эту сторону». Restless — общее имя всего, что про Deadlock: мод в игре, разбор матча, канал.
   Данные матча — открытые (deadlock-api.com: матч по ID, смерти и убийства с местом, деньги по минутам, предметы со временем). Тут — ПРИМЕР. */
const Y5M={h:'venator',win:true,len:'24:31',k:9,d:4,a:12,nw:'31,2k',
 dt:[[6.4,96,206],[12.2,112,150],[13.6,110,152],[15.1,108,148]],kl:[[4.2,150,236],[9.8,84,246],[18.6,150,150],[18.7,146,160],[18.9,156,144],[21.3,150,64]],
 it:[['Headshot Booster',3.1,2.8],['Extra Spirit',5.4,5.0],['Rapid Rounds',8.9,7.2],['Improved Spirit',14.2,10.5],['Titanic Magazine',19.8,17.9]],
 nwA:[0,2.1,4.4,6.8,9.6,12.1,14.0,16.9,20.3,23.6,27.4,31.2],nwB:[0,2.3,4.9,7.6,10.4,12.9,15.6,17.8,19.9,21.8,23.4,25.0],
 ep:[{t:'4:12',p:'Нижняя линия',r:'Первая кровь',v:'+1',m:4.2},{t:'13:36',p:'У урны',r:'Умер 3 раза за 3 минуты в одном месте',v:'−3',m:13.6,bad:1},{t:'18:40',p:'Мид-босс',r:'Драка 3 на 2 — забрал троих',v:'+3',m:18.7}]};
const Y5ML=[{h:'venator',win:true,t:'24:31',kda:'9 / 4 / 12',ago:'2 ч назад'},{h:'rat',win:false,t:'31:02',kda:'4 / 7 / 9',ago:'вчера'},{h:'venator',win:true,t:'27:45',kda:'12 / 3 / 6',ago:'вчера'},{h:'doorman',win:false,t:'22:10',kda:'2 / 6 / 11',ago:'2 дня назад'}];
const y5logo=()=>`<span class="y5rl"><svg viewBox="0 0 24 24"><path d="M15.5 4.5a8 8 0 1 0 4 12.2 7 7 0 1 1-4-12.2z" fill="currentColor"/><circle cx="17.5" cy="6.5" r="1.1" fill="currentColor"/><circle cx="20" cy="10" r=".8" fill="currentColor"/></svg><b>RESTLESS</b></span>`;
function y5Rest(R,ctx){R.className='scr y5 y5rs';
 R.innerHTML=`${SB(0)}<div class="y5sc"><div class="y5rs-hh"><i class="glow"></i>${y5logo()}<p>Разбор твоих матчей Deadlock</p></div>
  <div class="y5rs-in"><span class="f"><small>ID матча</small><b class="v">38 412 905</b><i class="cr"></i></span><button class="go">Разобрать</button></div>
  <button class="y5rs-st"><span class="y5sl">${ic('user')}</span>Войти через Steam</button>
  <div class="y5sec"><b>Последние матчи</b><small>Steam · Андрей</small></div>
  <div class="y5rs-ls">${Y5ML.map((m,i)=>`<button data-i="${i}" class="${m.win?'y5W':'y5L'}"><i class="bar"></i>${mini8(m.h)}<span class="t"><b>${m.win?'Победа':'Поражение'} · ${H12[m.h].n}</b><small>${m.kda} · ${m.t}</small></span><em>${m.ago}</em>${ic('chev')}</button>`).join('')}</div>
  <p class="y5rs-nt">Пример. Данные — открытый API матчей Deadlock: место смертей и убийств, деньги по минутам, когда что купил.</p></div><i class="hb"></i>`;
 $$('.y5rs-hh>*,.y5rs-in,.y5rs-st,.y5sec,.y5rs-ls>button',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:120+i*60}));
 let touched=false;ctx.on(R,'pointerdown',e=>{if(e.isTrusted)touched=true},{capture:true});
 const open=from=>g11Over(R,ctx,(pv,cc,cl)=>y5Match(pv,cc,{onBack:cl}),null,from);
 ctx.on(R,'click',e=>{const t=e.target;if(t.closest('.go')){open(t.closest('.go'));return}if(t.closest('.y5rs-st')){toast(R,'Вход через Steam — только чтобы найти твои матчи');return}
  const b=t.closest('.y5rs-ls>button');if(b){an(b,[{transform:'scale(.97)'},{transform:'none'}],{sp:SPb});if(b.dataset.i==='0')open(b);else toast(R,'В макете разобран только первый матч')}});
 ctx.t(()=>{if(!touched)open($('.y5rs-ls>button',R))},3200)}

function y5nwSVG(){const W=300,H=96,n=Y5M.nwA.length-1,mx=32,px=i=>8+i*(W-16)/n,py=v=>H-8-v/mx*(H-16);
 const path=A=>A.map((v,i)=>`${i?'L':'M'}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(' ');
 return `<svg class="nw" viewBox="0 0 ${W} ${H}"><path d="${path(Y5M.nwB)}" fill="none" stroke="#8FCB4F" stroke-width="2" opacity=".7" stroke-linejoin="round"/><path class="a" d="${path(Y5M.nwA)}" fill="none" stroke="#E8C277" stroke-width="2.6" stroke-linejoin="round"/>
  <circle cx="${px(n)}" cy="${py(Y5M.nwA[n])}" r="3.5" fill="#E8C277"/><text x="${px(n)-8}" y="${Math.max(12,py(Y5M.nwA[n])-6)}" text-anchor="end">31,2k</text><text x="${px(n)-4}" y="${py(Y5M.nwB[n])+14}" text-anchor="end" class="b">25,0k</text></svg>`}
function y5Match(R,ctx,o){o=o||{};let tab='main',tm=24.5,play=null;R.className='scr y5 y5mt';const h=H12[Y5M.h];R.style.setProperty('--ac',h.ac);
 R.innerHTML=`${SB(0)}<div class="y5sc"><div class="y5mt-hh">${loc13(Y5M.h)}<video muted loop playsinline data-hv="${h.v}" poster="${IMG[h.v]}" style="object-position:${h.pos}"></video><i class="dm"></i>
   <button class="y5bk" aria-label="Назад">${ic('back')}</button><span class="rl">${y5logo()}</span>
   <div class="tx"><small>ПОБЕДА · ${Y5M.len} · МАТЧ 38 412 905</small><b>${h.n}</b><span class="st"><span><b>${Y5M.k} / ${Y5M.d} / ${Y5M.a}</b><small>убил / умер / помог</small></span><span><b>${Y5M.nw}</b><small>душ к концу</small></span><span><b>2 / 6</b><small>место в команде</small></span></span></div></div>
  <div class="y5mt-tb"><button data-t="main" class="on">Главное</button><button data-t="map">Карта</button><button data-t="items">Предметы</button><button data-t="eps">Моменты</button></div>
  <div class="y5mt-bd"></div><p class="y5rs-nt">Пример на выдуманном матче — в приложении берётся настоящий по ID.</p></div><i class="hb"></i>`;
 playV12(R);const bd=$('.y5mt-bd',R);
 const main=()=>`<div class="y5in"><i class="bad">✕</i><span><b>Умирал 3 раза у урны</b><small>12–15 мин, одно и то же место — заходил туда один</small></span></div>
  <div class="y5in"><i class="mid">◷</i><span><b>Improved Spirit — на 3,7 мин позже</b><small>14:12, у топ-игроков на Венаторе — 10:30</small></span></div>
  <div class="y5in"><i class="ok">★</i><span><b>Лучшая драка — 18:40 у мид-босса</b><small>3 на 2, забрал троих — отсюда и победа</small></span></div>
  <div class="y5nwc"><span class="lg"><i class="a"></i>Ты <i class="b"></i>Соперник по линии</span>${y5nwSVG()}<span class="ax"><small>0</small><small>12 мин</small><small>24</small></span></div>`;
 const map=()=>`<div class="y5mt-mp"><div class="m">${y5mapSVG(1)}<div class="ev"></div></div><div class="sc"><button class="pl">${ic('play')}</button><span class="tr"><i class="f"></i><i class="h"></i></span><b class="tm"></b></div>
  <div class="lgd"><span><i class="k"></i>убил</span><span><i class="d"></i>умер</span></div></div>`;
 const items=()=>`<div class="y5it"><div class="hd"><span>Предмет</span><span>Ты</span><span>Топ-игроки</span></div>${Y5M.it.map(([n,a,b])=>{const df=a-b;return `<div class="r"><b>${n}</b><span>${a.toFixed(1).replace('.',',')} мин</span><span class="${df>2?'bad':df>.8?'mid':'ok'}">${b.toFixed(1).replace('.',',')} · ${df>0?'+':''}${df.toFixed(1).replace('.',',')}</span></div>`}).join('')}</div>
  <p class="y5mt-nt">Топ-игроки — средняя минута покупки у лучших 1 % на этом герое за неделю.</p>`;
 const eps=()=>`<div class="y5ep">${Y5M.ep.map((e,i)=>`<button data-m="${e.m}" class="${e.bad?'bad':''}"><b class="t">${e.t}</b><span><b>${e.r}</b><small>${e.p}</small></span><em>${e.v}</em>${ic('map11')}</button>`).join('')}</div>`;
 const paintMap=()=>{const ev=$('.ev',bd);if(!ev)return;ev.innerHTML=[...Y5M.kl.map(p=>['k',...p]),...Y5M.dt.map(p=>['d',...p])].filter(p=>p[1]<=tm).map(([t,m,x,y])=>`<i class="${t} ${tm-m<1.2?'nw':''}" style="left:${(x/3).toFixed(1)}%;top:${(y/3).toFixed(1)}%"></i>`).join('');
  const r=tm/24.5;$('.tr .f',bd).style.transform=`scaleX(${r})`;$('.tr .h',bd).style.left=(r*100).toFixed(1)+'%';$('.tm',bd).textContent=`${Math.floor(tm)}:${String(Math.round((tm%1)*60)).padStart(2,'0')}`};
 const run=()=>{if(play)play();tm=0;play=ctx.loop((n,dt)=>{tm=Math.min(24.5,tm+dt*.004);paintMap();if(tm>=24.5){play();play=null}})};
 const show=t=>{tab=t;$$('[data-t]',R).forEach(b=>b.classList.toggle('on',b.dataset.t===t));if(play){play();play=null}
  bd.innerHTML=t==='main'?main():t==='map'?map():t==='items'?items():eps();
  $$('.y5mt-bd>*,.y5it .r,.y5ep>button',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{d:300,dl:i*45,e:EO}));
  if(t==='main'){const a=$('.nw .a',bd);if(a)an(a,[{strokeDasharray:'0 600'},{strokeDasharray:'600 0'}],{d:1100,e:EO})}
  if(t==='map'){paintMap();const tr=$('.tr',bd);drag(ctx,tr,{move(dx){const r=tr.getBoundingClientRect();if(play){play();play=null}tm=clamp(t0+dx*SCALE/r.width*24.5,0,24.5);paintMap()},tap(e,sx){const r=tr.getBoundingClientRect();tm=clamp((sx-r.left)/r.width*24.5,0,24.5);paintMap()}});let t0=tm;ctx.on(tr,'pointerdown',()=>{t0=tm});ctx.on(tr,'touchstart',()=>{t0=tm},{passive:true})}};
 show('main');let touched=false;ctx.on(R,'pointerdown',e=>{if(e.isTrusted)touched=true},{capture:true});
 ctx.on(R,'click',e=>{const t=e.target;if(t.closest('.y5bk')){o.onBack?o.onBack():toast(R,'← к матчам');return}
  const b=t.closest('[data-t]');if(b){show(b.dataset.t);return}if(t.closest('.y5mt-mp .pl')){run();return}
  const m=t.closest('[data-m]');if(m){show('map');tm=+m.dataset.m+.3;paintMap();return}});
 ctx.t(()=>{if(!touched){show('map');run()}},3200);ctx.t(()=>{if(!touched)show('eps')},10200)}

/* Restless — что это и план: одно имя для всего, что про Deadlock, и что уже сделано / что дальше */
const Y5RP=[['ok','Макеты: канал, разбор патча, карта, мод, Restless','сегодня, v14–v15'],['ok','ТЗ Зетке: время слов, патчи, карта, сборки, FPS, данные матчей','сегодня'],
 ['wait','Проба мода на твоём ПК: ставится ли, что показывает верхняя панель','1 вечер · нужен ты'],['wait','Канал: бот присылает черновики тебе','нужен канал, бот и токен'],
 ['next','Restless: разбор матча по ID — первая рабочая версия','3–4 дня после «го»'],['next','Мод v1: ульты над иконками крупно, таймеры, FPS одной кнопкой','2–4 дня'],
 ['next','Сборки с винрейтом в моде и приложении','после отчёта Зетки'],['later','Restless+ — премиум вместе с языками, как HSReplay','после первых 100 игроков']];
const Y5RS={ok:['готово','#5fd38a'],wait:['ждёт тебя','#FFD23F'],next:['дальше','#8ab4ff'],later:['потом','rgba(243,239,231,.4)']};
function y5RestPlan(R,ctx){R.className='scr y5 y5rs y5rp';
 R.innerHTML=`${SB(0)}<div class="y5sc"><div class="y5rs-hh sm"><i class="glow"></i>${y5logo()}<p>Одно имя для всего, что про Deadlock</p></div>
  <div class="y5rp-g"><div><i>${ic('grid')}</i><b>Мод в игре</b><small>ульты, таймеры, FPS</small></div><div><i>${ic('radar')}</i><b>Разбор матча</b><small>карта, ошибки, предметы</small></div>
   <div><i>${ic('send5')}</i><b>Канал</b><small>патчи, мемы, сборки</small></div><div><i>${ic('wave13')}</i><b>Языки по кино</b><small>голоса героев, Versus</small></div></div>
  <div class="y5rp-pm"><b>Restless+</b><span>Премиум — один на всё: разбор всех матчей, сборки топов в моде, английский без лимитов.</span></div>
  <div class="y5sec"><b>План</b><small>что сделано и что дальше</small></div>
  <div class="y5rp-ls">${Y5RP.map(([s,t,w])=>`<div class="r s-${s}" style="--sc:${Y5RS[s][1]}"><i class="d"></i><span><b>${t}</b><small>${w}</small></span><em>${Y5RS[s][0]}</em></div>`).join('')}</div>
  <div class="y5sec"><b>Имя</b><small>Restless — лучшее, по-моему</small></div>
  <div class="y5rp-nm"><div class="on"><b>Restless</b><small>«неспящий» — как City Never Sleeps; короткое; перед релизом проверю, не занято ли (Steam, Discord, домен)</small></div><div><b>Insomnia</b><small>то же «не спит», но звучит как болезнь</small></div><div><b>Afterhours</b><small>«после закрытия» — про ночной город, длиннее</small></div></div></div><i class="hb"></i>`;
 $$('.y5rs-hh>*,.y5rp-g>div,.y5rp-pm,.y5sec,.y5rp-ls .r,.y5rp-nm>div',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:100+Math.min(i,16)*50}))}
