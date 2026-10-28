/* ================= v15 · канал ================= */
/* 1. Посты (Андрей: «все 3 норм, но везде переборщил; рофл-новость — мем, картинки лучше всего; мем — супер, в стиле Позднякова;
   новости норм, но хз самое важное вот так выносить»). Правило v15: рофл → картинка-мем и одна строка; обычная новость — коротко, без блока
   «главное»; мелочь — одной строкой. Канал смотрится лентой, как в Telegram. */
function y5meme(){return `<span class="y5mm"><span class="r a"><span class="tx"><small>VALVE</small><b>Ослабили Бабу</b><em>щит 100 → 90</em></span><span class="ar dn">▼</span></span>
 <span class="r b"><span class="tx"><small>БАБА</small><b>58 % побед</b><em>на высоких рангах</em></span><svg class="gr" viewBox="0 0 100 40"><path d="M2 34 L22 30 L40 31 L58 22 L76 16 L98 4" fill="none" stroke="#5fd38a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 34 L22 30 L40 31 L58 22 L76 16 L98 4 L98 40 L2 40Z" fill="rgba(95,211,138,.16)"/></svg></span></span>`}
function y5Posts(R,ctx){R.className='scr y5 y5tg';
 const re=(a)=>`<span class="rx">${a.map(([e,n])=>`<span>${e} ${n}</span>`).join('')}</span>`;
 R.innerHTML=`${SB(0)}<div class="y5tg-hd"><button class="y5bk" aria-label="Назад">${ic('back')}</button><span class="av">R</span><span><b>Restless · Deadlock</b><small>2 418 подписчиков</small></span></div>
  <div class="y5tg-ls">
   <div class="d">Сегодня</div>
   <div class="y5po"><span class="tp">МЕМ · рофл-новость</span>${y5meme()}<p>⚡️ Бабу понерфили — она стала сильнее. Valve, понерфите меня так же.</p><p class="y5pw"><b>nerf</b> — ослабить</p><span class="ft">${re([['😂',214],['🔥',96],['🤡',41]])}<small>9:12</small></span></div>
   <div class="y5po"><span class="tp">НОВОСТЬ · обычная</span><p><b>Патч 14–22 октября</b></p><p>Дэнни усилили: здоровье 680 → 730, урон пули 12 → 15. Был 38 % побед, сейчас 51 %.<br>Бабу ослабили — щит 100 → 90.<br>Два новых героя: Харроу и Вайолет.</p><button class="lk">Разбор: найди своего героя ›</button><span class="ft">${re([['👍',158],['🔥',33]])}<small>9:40</small></span></div>
   <div class="y5po sm"><span class="tp">МЕЛОЧЬ · одной строкой</span><p>🔧 Обновили тестовый сервер. Патчноута нет — разберём, когда выкатят.</p><span class="ft"><small>14:05</small></span></div></div>
  <div class="y5tg-in"><span>${ic('send5')}</span><b>Обсудить</b></div><i class="hb"></i>`;
 $$('.y5po,.y5tg-ls .d',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:200+i*160}));
 const mm=$('.y5mm',R);ctx.t(()=>{an($('.r.b .gr path',mm),[{strokeDasharray:'0 200'},{strokeDasharray:'200 0'}],{d:900,e:EO})},700);
 ctx.on(R,'click',e=>{const t=e.target;if(t.closest('.y5bk')){toast(R,'← назад');return}if(t.closest('.lk')){toast(R,'Откроется разбор патча');return}const r=t.closest('.rx>span');if(r){an(r,[{transform:'scale(1.25)'},{transform:'none'}],{sp:SPb})}})}

/* 2. Разбор патча v15 (Андрей: «получше оформи, не совсем приятный интерфейс»). Без коробок «главное за 30 секунд»:
   сверху — фильтры-счётчики «▲1 ▼1 ✦2 ✓4», «Мои герои» — аватарками. Изменение — строка; нажал — раскрывается «было → стало» и «что это значит». */
function y5Patch(R,ctx){let my=['doorman','victor','danny'],f='all';R.className='scr y5 y5pt';
 const cnt=t=>C14CH.filter(c=>c.t===t).length;
 const row=(c,i)=>{const T=C14T[c.t];return `<div class="y5pr2 t-${c.t}" data-i="${i}" style="--tc:${T[2]}"><button class="h">${C14AV(c.k)}<span class="t"><b>${c.h}</b><small>${c.d} · ${T[1].toLowerCase()}</small></span><i class="mk">${T[0]}</i></button>
  <div class="bd"><div class="in"><div class="y5tb">${c.rows.map(r=>`<span class="n">${r[0]}</span><span class="o">${r[1]}</span><span class="a">→</span><span class="v">${r[2]}</span>`).join('')}</div>
   ${c.win?`<p class="wr">Побед: <s>${c.win[0]}</s> → <b>${c.win[1]}</b></p>`:''}<p class="yo">${c.you}</p>${c.w?`<span class="wd"><b>${c.w[0]}</b> — ${c.w[1]}</span>`:''}</div></div></div>`};
 const paint=()=>{const L=C14CH.map((c,i)=>[c,i]).filter(([c])=>f==='all'||c.t===f),M=L.filter(([c])=>my.includes(c.k)),O=L.filter(([c])=>!my.includes(c.k));
  $('.y5pt-ls',R).innerHTML=(M.length?`<div class="y5pt-h">Твои герои · ${M.length}</div>${M.map(([c,i])=>row(c,i)).join('')}`:'')+(O.length?`<div class="y5pt-h">${M.length?'Остальное':'Все изменения'} · ${O.length}</div>${O.map(([c,i])=>row(c,i)).join('')}`:'');
  $$('.y5pt-ls>*',R).forEach((x,j)=>an(x,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{d:280,dl:j*30,e:EO}))};
 R.innerHTML=`${SB(0)}<div class="y5sc"><div class="y5pt-top"><button class="y5bk" aria-label="Назад">${ic('back')}</button><small>DEADLOCK · ПАТЧ</small><b>14–22 октября</b><span>8 изменений · по 598 тыс. матчей</span></div>
  <div class="y5pt-me"><span class="l">Мои герои</span><span class="av">${my.map(k=>C14AV(k)).join('')}<button class="ad">+</button></span></div>
  <div class="y5pt-f"><button data-f="all" class="on">Все</button>${['buff','nerf','new','fix'].map(t=>`<button data-f="${t}" style="--tc:${C14T[t][2]}"><i>${C14T[t][0]}</i>${cnt(t)}</button>`).join('')}</div>
  <div class="y5pt-ls"></div></div><i class="hb"></i>`;
 paint();let touched=false;ctx.on(R,'pointerdown',e=>{if(e.isTrusted)touched=true},{capture:true});
 const open=el=>{const was=el.classList.contains('op');$$('.y5pr2.op',R).forEach(x=>x.classList.remove('op'));if(!was)el.classList.add('op')};
 ctx.on(R,'click',e=>{const t=e.target;if(t.closest('.y5bk')){toast(R,'← назад в канал');return}
  const b=t.closest('[data-f]');if(b){f=b.dataset.f;$$('[data-f]',R).forEach(x=>x.classList.toggle('on',x===b));paint();return}
  if(t.closest('.ad')){toast(R,'Выбери героев — их изменения будут сверху');return}
  const h=t.closest('.y5pr2 .h');if(h)open(h.parentElement)});
 ctx.t(()=>{if(!touched){const x=$('.y5pr2',R);if(x)open(x)}},1400);ctx.t(()=>{if(!touched){const b=$('[data-f="new"]',R);b.click()}},4200);ctx.t(()=>{if(!touched){$('[data-f="all"]',R).click();const x=$$('.y5pr2',R)[3];if(x)open(x)}},6600)}

/* 3. Карта v15 (Андрей: «смотреть и сверху, и на изменённые места в самой игре; отмечай кемпы, объекты — можно скрыть»).
   Сверху ↔ «Под углом» (камера как в игре), слои вкл/выкл, шторка «было / стало». Изменённое место — «Как в игре»: кадр из игры (даст Зетка). */
const Y5MO={camp:{n:'Кемпы',c:'#9BE15D',P:[[70,92,'s'],[230,92,'s'],[96,206,'m'],[204,206,'m'],[150,118,'l'],[150,184,'l'],[44,150,'m'],[256,150,'m']]},
 boss:{n:'Боссы',c:'#ff6b5b',P:[[150,150,'b']]},guard:{n:'Стражи',c:'#8ab4ff',P:[[150,236,'g'],[150,64,'g'],[84,246,'g'],[216,54,'g'],[216,246,'g'],[84,54,'g']]},
 urn:{n:'Урна',c:'#FFD23F',P:[[110,150,'u'],[190,150,'u']]},shop:{n:'Магазины',c:'#d9b8ff',P:[[150,268,'$'],[150,32,'$']]}};
function y5mapSVG(nw){const ln=(d,c)=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="9" stroke-linecap="round" opacity=".55"/><path d="${d}" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="1" stroke-dasharray="3 5"/>`;
 return `<svg viewBox="0 0 300 300"><rect width="300" height="300" rx="18" fill="${nw?'#16211b':'#1a1c1b'}"/>
  <g fill="rgba(255,255,255,.05)">${Array.from({length:46},(_,i)=>`<rect x="${(i*53)%286+4}" y="${(i*97)%286+4}" width="${12+(i*7)%20}" height="${9+(i*11)%16}" rx="2"/>`).join('')}</g>
  ${ln('M150 286 L150 14','#c46a5a')}${ln('M150 286 C52 238 40 92 150 14','#5a8fc4')}${ln('M150 286 C248 238 260 92 150 14','#7ac45a')}
  ${nw?`<path d="M74 150 L226 150" stroke="#FFD23F" stroke-width="6" stroke-linecap="round" opacity=".8"/><circle cx="150" cy="150" r="18" fill="none" stroke="#FFD23F" stroke-width="2.5" stroke-dasharray="4 3"/>`:`<rect x="84" y="140" width="40" height="20" rx="4" fill="#2c2d2a"/><rect x="176" y="140" width="40" height="20" rx="4" fill="#2c2d2a"/>`}
  <circle cx="150" cy="284" r="12" fill="#5a8fc4"/><circle cx="150" cy="16" r="12" fill="#c46a5a"/></svg>`}
function y5mk(t,[x,y,s]){const M=Y5MO[t];return `<i class="y5mk2 t-${t} s-${s}" style="left:${(x/3).toFixed(2)}%;top:${(y/3).toFixed(2)}%;--mc:${M.c}">${t==='boss'?'☠':t==='shop'?'$':t==='urn'?'◆':''}</i>`}
function y5Map(R,ctx){let x=.5,tilt=false,on=new Set(['camp','boss','guard','urn']);R.className='scr y5 y5mp';
 R.innerHTML=`${SB(0)}<div class="y5sc"><div class="y5pt-top"><button class="y5bk" aria-label="Назад">${ic('back')}</button><small>DEADLOCK · КАРТА</small><b>Было / стало</b><span>Патч 14.10 · пример, карту в нём не меняли</span></div>
  <div class="y5mp-v"><button data-v="top" class="on">Сверху</button><button data-v="tilt">Под углом, как в игре</button></div>
  <div class="y5mp-w"><div class="y5mp-cam"><div class="y5mp-m"><div class="ly a">${y5mapSVG(0)}</div><div class="ly b">${y5mapSVG(1)}</div><div class="mks"></div>
   <button class="chg" style="left:50%;top:50%"><i></i></button></div></div><span class="tag l">БЫЛО</span><span class="tag r">СТАЛО</span><i class="hn"><i></i></i></div>
  <div class="y5mp-ly">${Object.entries(Y5MO).map(([k,m])=>`<button data-l="${k}" style="--mc:${m.c}"><i></i>${m.n}</button>`).join('')}</div>
  <button class="y5mp-cg"><span class="ph">${ic('cam5')}<small>кадр из игры</small></span><span class="t"><b>Середина: новый мост через центр</b><small>Было: два здания. Стало: проход прямо к боссу. Нажми — как это выглядит в игре.</small></span></button></div><i class="hb"></i>`;
 const W=$('.y5mp-w',R),B=$('.ly.b',R),cam=$('.y5mp-cam',R),mk=$('.mks',R);
 const paint=()=>{mk.innerHTML=[...on].map(t=>Y5MO[t].P.map(p=>y5mk(t,p)).join('')).join('');$$('[data-l]',R).forEach(b=>b.classList.toggle('on',on.has(b.dataset.l)))};
 const setX=v=>{x=clamp(v,0,1);B.style.clipPath=`inset(0 0 0 ${(x*100).toFixed(1)}%)`;$('.hn',R).style.left=(x*100).toFixed(1)+'%'};
 const setT=v=>{tilt=v;cam.classList.toggle('tilt',v);$$('[data-v]',R).forEach(b=>b.classList.toggle('on',(b.dataset.v==='tilt')===v))};
 paint();setX(.5);let touched=false;ctx.on(R,'pointerdown',e=>{if(e.isTrusted)touched=true},{capture:true});
 drag(ctx,W,{start(){},move(dx){const r=W.getBoundingClientRect();setX(x0+dx*SCALE/r.width)},tap(){}});let x0=.5;ctx.on(W,'pointerdown',()=>{x0=x});ctx.on(W,'touchstart',()=>{x0=x},{passive:true});
 ctx.on(R,'click',e=>{const t=e.target;if(t.closest('.y5bk')){toast(R,'← назад');return}
  const v=t.closest('[data-v]');if(v){setT(v.dataset.v==='tilt');return}
  const l=t.closest('[data-l]');if(l){const k=l.dataset.l;on.has(k)?on.delete(k):on.add(k);paint();an(l,[{transform:'scale(.92)'},{transform:'none'}],{sp:SPb});return}
  if(t.closest('.y5mp-cg,.chg')){toast(R,'Кадр из игры этого места — даст Зетка (ТЗ v15, п. 3)')}});
 // без касания: шторка ходит, потом камера наклоняется, слой «Кемпы» выключается и включается
 let d=1,auto=true;ctx.loop((n,dt)=>{if(touched||!auto)return;let v=x+d*dt*.00028;if(v>.85||v<.15)d=-d;setX(v)});
 ctx.t(()=>{if(!touched){auto=false;setX(.5);setT(true)}},3600);ctx.t(()=>{if(!touched){const b=$('[data-l="camp"]',R);b.click()}},5600);ctx.t(()=>{if(!touched){$('[data-l="camp"]',R).click();setT(false);auto=true}},7600)}

/* 4. Бот 24/7 (Андрей: «если много изменений — бот сам делает красивый разбор, если мелкие или фиксы — микро-новость,
   как в Доте пишут „обновили тестовый сервер“»). Чат админа с ботом: два черновика разной величины. */
function y5Bot(R,ctx){R.className='scr y5 y5tg y5bt';
 R.innerHTML=`${SB(0)}<div class="y5tg-hd"><button class="y5bk" aria-label="Назад">${ic('back')}</button><span class="av b">${ic('radar')}</span><span><b>Restless · бот</b><small>следит за Deadlock каждый час</small></span></div>
  <div class="y5tg-ls">
   <div class="d">Сегодня</div>
   <div class="y5bm in"><p><b>Нашёл: патч 14.10</b> — 12 изменений героев и 3 предмета.</p><p class="rl">Больше трёх изменений → готовлю <b>разбор</b>.</p>
    <div class="cv"><span class="ct">${C14AV('danny')}${C14AV('doorman')}${C14AV('victor')}<em>+9</em></span><b>Разбор патча 14.10</b><small>▲ 1 · ▼ 1 · ✦ 3 · ✓ 3 · найди своего героя</small></div>
    <div class="bt"><button class="pri">В канал</button><button>Короче</button><button>Пропустить</button></div></div>
   <div class="y5bm in"><p><b>Нашёл: обновили тестовый сервер</b> — без описания.</p><p class="rl">Изменений не видно → <b>короткая новость</b>.</p>
    <div class="mn">🔧 Обновили тестовый сервер. Патчноута нет — разберём, когда выкатят.</div>
    <div class="bt"><button class="pri">В канал</button><button>Пропустить</button></div></div>
   <div class="y5bm in"><p><b>Нашёл: в файлах игры поменяли текст двух предметов.</b></p><p class="rl">1–2 изменения → <b>микро-новость</b> со ссылкой на файл.</p>
    <div class="mn">Tech Overflow и Reinforcing Casings теперь срабатывают по любым героям, не только по вражеским.</div>
    <div class="bt"><button class="pri">В канал</button><button>Пропустить</button></div></div></div><i class="hb"></i>`;
 $$('.y5bm,.y5tg-ls .d',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:250+i*420}));
 ctx.on(R,'click',e=>{const b=e.target.closest('.bt button');if(e.target.closest('.y5bk')){toast(R,'← назад');return}if(!b)return;const m=b.closest('.y5bm');
  if(b.classList.contains('pri')){m.classList.add('sent');$('.bt',m).innerHTML='<span class="ok">✓ Ушло в канал</span>';an(m,[{transform:'scale(.98)'},{transform:'none'}],{sp:SPb})}
  else{if(b.textContent==='Пропустить'){const z=an(m,[{opacity:1},{opacity:0,transform:'translateX(40px)'}],{d:260,f:'forwards'});if(z)z.onfinish=()=>m.remove()}else toast(R,'Сделаю короче — пришлю ещё раз')}})}
