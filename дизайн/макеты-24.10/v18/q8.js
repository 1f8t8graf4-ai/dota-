/* ================= v18 · Главная: «Меню» по ответам Андрея и «Каналы» вместо «Двух дверей» (28.10) =================
   Андрей на v17: «Меню» — «шрифт ахуенный, лучший», но «не понял, что значит Афиша», «зачем Смотреть, Deadlock, Афиша и С друзьями —
   почему ты поставил это? плюс у нас же куча игр будет — что ты будешь писать сюда?»; «Две двери» — «не нравится, придумай ещё»;
   «Афиша» — «до этого интереснее было». Шапка (аватарка → профиль, сторис, билеты) и вкладки — из v17 (q7Top, q7TB). */

/* ---------- 1. Меню v2: три дела + игры подменю ---------- */
const Q8G=[{k:'deadlock',n:'Deadlock',s:`Комикс «${Q7CH[0].t}» · 2 перехвата ждут`,bdg:'2',on:1},{k:'dota',n:'Dota 2',s:'скоро — появится тут сама'},{k:'ow',n:'Overwatch',s:'скоро'}];
function q8Menu(R,ctx){R.className='scr q7 q7m q8m';
 const IT=[{b:'Продолжить',s:'Титаник · эпизод 2 «Я выживу» · 46 с',pr:1,why:'то, что ты начал'},
  {b:'Играть',s:'Deadlock · ещё игры скоро',bdg:'2',why:'все игры — внутри списком'},
  {b:'Что посмотреть',s:'6 фильмов и сериалов · 2 интервью — лентой',why:'выбрать новое'}];
 const PW=['p_titanic','p_wolf','p_psycho','p_sopranos','p_taxi','p_bb','p_durov','p_clav','p_bunker'];
 R.innerHTML=`<div class="q7m-bg">
  <div class="q7m-l on" data-j="0">${vidHTML('titanic')}</div>
  <div class="q7m-l" data-j="1"><i class="img kb" style="background-image:url(${IMG.dl_cover})"></i>${q7Win()}${q7Hv('venator','q7m-hv')}</div>
  <div class="q7m-l" data-j="2"><div class="q7m-wall">${PW.concat(PW).map(k=>`<i class="img" style="background-image:url(${IMG[k]})"></i>`).join('')}</div></div>
  <div class="q7m-l" data-j="3"><i class="img kb" style="background-image:url(${IMG.bd_wolf})"></i><div class="q7m-rv">${["Trust me.","Have a seat, please.","I'll be fine.","Stress, maybe."].map((p,i)=>`<span style="animation-delay:${-i*1.7}s">${p}</span>`).join('')}</div></div>
  <div class="q7m-l q8-soon" data-j="5"><canvas class="q8-nz" width="86" height="188"></canvas><b>СКОРО</b></div>
 </div><i class="q7m-sh"></i><canvas class="fx"></canvas>${SB(0)}${q7Top()}
 <nav class="q7m-mn q8-mn" data-lv="0">${IT.map((it,j)=>`<button class="q7m-i${j?'':' on'}" data-j="${j}"><b>${it.b}${it.bdg?`<i class="bdg">${it.bdg}</i>`:''}</b><small>${it.s}</small>${it.pr?'<i class="q7-pr"><i></i></i>':''}</button>`).join('')}
  <div class="q7m-mi"><button data-j="3">Повторить<em>17</em></button><button data-j="4">С друзьями</button></div></nav>
 <nav class="q7m-mn q8-gm" data-lv="1" hidden><button class="q8-bk">‹ Назад</button>${Q8G.map((g,i)=>`<button class="q7m-i${i?'':' on'}${g.on?'':' off'}" data-g="${i}"><b>${g.n}${g.bdg?`<i class="bdg">${g.bdg}</i>`:''}</b><small>${g.s}</small></button>`).join('')}</nav>
 <div class="q8-why" hidden>${IT.map(it=>`<span><b>${it.b}</b> — ${it.why}</span>`).join('')}<span><b>Повторить · С друзьями</b> — раз в день и с другом</span><button class="q8-ok">Понятно</button></div>
 ${q7TB(0)}<i class="hb"></i>`;
 vidStart(R);q7TopBind(R,ctx);q7TBBind(R,ctx);
 const fx=FX(ctx,$('.fx',R)),L=$$('.q7m-l',R),M=$('.q8-mn',R),G=$('.q8-gm',R);let cur=0,touched=false,lv=0;
 q8Noise(ctx,$('.q8-nz',R));
 const DU=Array.from({length:22},()=>({x:Math.random()*344,y:Math.random()*754,v:.1+Math.random()*.25,r:.6+Math.random()*1.3,a:Math.random()*6.28}));
 fx.ambient({step(g,k){for(const d of DU){d.y-=d.v*k;d.a+=.02*k;d.x+=Math.sin(d.a)*.2*k;if(d.y<-4){d.y=760;d.x=Math.random()*344}g.globalAlpha=.14+.16*Math.sin(d.a*2);g.fillStyle='#FFD98A';g.beginPath();g.arc(d.x,d.y,d.r,0,6.3);g.fill()}g.globalAlpha=1}});
 const layer=j=>L.forEach(l=>l.classList.toggle('on',+l.dataset.j===j));
 function sel(j){if(j>3||(lv===0&&j===cur))return;cur=j;layer(j);$$('.q7m-i',M).forEach(i=>i.classList.toggle('on',+i.dataset.j===j))}
 function selG(i){$$('.q7m-i',G).forEach(b=>b.classList.toggle('on',+b.dataset.g===i));layer(Q8G[i].on?1:5)}
 // подменю игр: тот же шрифт, как вложенное меню Esc; игр станет больше — просто новые строки
 function level(n){lv=n;const a=n?M:G,b=n?G:M;an(a,[{opacity:1,transform:'none'},{opacity:0,transform:`translateX(${n?-40:40}px)`}],{d:200,e:EI,f:'forwards'});
  ctx.t(()=>{a.hidden=true;b.hidden=false;$$('.q7m-i,.q8-bk',b).forEach((x,i)=>an(x,[{opacity:0,transform:`rotate(-1.4deg) translateX(${n?60:-60}px)`},{opacity:1,transform:'rotate(-1.4deg)'}],{sp:SPs,dl:i*70}));if(n)selG(0);else{cur=-1;sel(1)}},200)}
 const back=()=>{$$('.q8-mn,.q8-gm,.q7-top',R).forEach((x,i)=>{x.getAnimations().forEach(a=>a.cancel());an(x,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:i*60})})};
 function pop(el){an(el,[{scale:'1'},{scale:'.95'},{scale:'1.05'},{scale:'1'}],{d:320,e:EO});const r=rel(el,R);fx.burst(r.x+50,r.y+r.h/2,{n:18,c:['#FFD23F','#fff'],v:3.4,g:0,s:2,l:30})}
 function enter(j,el){touched=true;sel(j);pop(el);
  ctx.t(()=>{if(j===0){$$('.q8-mn,.q7-top',R).forEach((x,i)=>an(x,[{opacity:1},{opacity:0,transform:'translateY(18px)'}],{d:220,dl:i*30,e:EI,f:'forwards'}));m7Play(R,ctx,el,back)}
   else if(j===1)level(1);else if(j===2)w4Feed(R,ctx,0,el);
   else toast(R,j===3?'🔁 Повторение: 17 фраз, по 3 за раз':'⚔️ Дуэль по сцене — ссылкой другу в Telegram')},j===1?120:j<3?300:80)}
 $$('.q7m-i',M).forEach(b=>{ctx.on(b,'pointerenter',e=>{if(e.pointerType==='mouse'){touched=true;sel(+b.dataset.j)}});ctx.on(b,'click',()=>enter(+b.dataset.j,b))});
 $$('.q7m-mi button',M).forEach(b=>{ctx.on(b,'pointerenter',e=>{if(e.pointerType==='mouse'&&b.dataset.j==='3'){touched=true;sel(3)}});ctx.on(b,'click',()=>enter(+b.dataset.j,b))});
 $$('.q7m-i',G).forEach(b=>{const i=+b.dataset.g;ctx.on(b,'pointerenter',e=>{if(e.pointerType==='mouse')selG(i)});
  ctx.on(b,'click',()=>{selG(i);pop(b);if(Q8G[i].on)ctx.t(()=>g8Hub(R,ctx,b,()=>{}),260);else toast(R,`🎮 ${Q8G[i].n} — скоро, появится здесь`)})});
 ctx.on($('.q8-bk',R),'click',()=>level(0));
 ctx.on(R,'pointerdown',()=>{touched=true},{capture:true});
 $$('.q7m-i',M).forEach((b,i)=>an(b,[{opacity:0,transform:'rotate(-1.4deg) translateX(-60px)'},{opacity:1,transform:'rotate(-1.4deg)'}],{sp:SPs,dl:160+i*90}));
 an($('.q7m-mi',M),[{opacity:0},{opacity:1}],{d:500,dl:520});
 // первый раз — одна строка «что тут что» (Андрей: «объясняй при первом взаимодействии»), потом не показываем
 let seen=false;try{seen=localStorage.getItem('q8-why')==='1'}catch(e){}
 const W=$('.q8-why',R);if(!seen)ctx.t(()=>{W.hidden=false;an(W,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{sp:SPs})},900);
 ctx.on($('.q8-ok',R),'click',()=>{try{localStorage.setItem('q8-why','1')}catch(e){}an(W,[{opacity:1},{opacity:0}],{d:200,f:'forwards'});ctx.t(()=>W.hidden=true,200)});
 let k=0;const cyc=()=>{if(touched||lv)return;k=(k+1)%3;sel(k);ctx.t(cyc,k===0?4200:2700)};ctx.t(cyc,3800)}

/* шум телевизора — для «скоро» и переключения каналов */
function q8Noise(ctx,cv,on){if(!cv)return null;const g=cv.getContext('2d'),W=cv.width,H=cv.height,img=g.createImageData(W,H);let live=true,t=0;
 const draw=()=>{if(!ctx.alive||!live)return;if(on&&!on())return requestAnimationFrame(draw);if(++t%2===0){const d=img.data;for(let i=0;i<d.length;i+=4){const v=Math.random()*255|0;d[i]=d[i+1]=d[i+2]=v;d[i+3]=255}g.putImageData(img,0,0)}requestAnimationFrame(draw)};
 requestAnimationFrame(draw);return {stop(){live=false}}}

/* ---------- 2. Каналы — свой вариант под микс: каждый фильм, сериал, игра и интервью — канал ---------- */
const Q8CH=[
 {c:'кино',k:'ПРОДОЛЖИТЬ · ЭП. 2 ИЗ 4',t:ffT(SC4[0]),ab:'Джек уговаривает Роуз сесть в шлюпку.',cta:'Смотреть дальше',bg:vidHTML('titanic'),go:'play'},
 {c:'игры',k:'DEADLOCK · КОМИКС · 2 ПЕРЕХВАТА',t:`<span class="q8-gt">Deadlock</span>`,ab:`Глава «${Q7CH[0].t}» — Венатор начинает.`,cta:'Играть',bg:()=>`<i class="img kb" style="background-image:url(${IMG.dl_cover})"></i>${q7Win()}${q7Hv('venator','q7m-hv')}`,go:'game'},
 {c:'кино',k:'ФИЛЬМ · 6 ЭПИЗОДОВ · ≈ 5 МИН',t:ffT(SC4[1]),ab:SC4[1].ab,cta:'Смотреть',bg:vidHTML('wolf'),go:'f1'},
 {c:'кино',k:'СЕРИАЛ · СЕЗОН 1',t:ffT(SC4[3]),ab:SC4[3].ab,cta:'Смотреть',bg:()=>`<i class="img kb" style="background-image:url(${IMG[SC4[3].img]})"></i>`,go:'f3'},
 {c:'интервью',k:'ИНТЕРВЬЮ · ТАКЕР КАРЛСОН',t:`<span class="q8-gt">Павел Дуров</span>`,ab:'Как он думает о свободе и о своей команде — живой английский.',cta:'Смотреть',bg:()=>`<i class="img kb" style="background-image:url(${IMG.c_durov})"></i>`,go:'iv'},
 {c:'',k:'ПОВТОРИТЬ · ≈ 4 МИН',t:`<span class="q8-gt">17 фраз</span>`,ab:'Из «Титаника», «Волка» и Deadlock — по три за раз.',cta:'Повторить',bg:()=>`<i class="img kb q8-dim" style="background-image:url(${IMG.bd_wolf})"></i><div class="q7m-rv">${["Trust me.","Have a seat, please.","I'll be fine.","Stress, maybe."].map((p,i)=>`<span style="animation-delay:${-i*1.7}s">${p}</span>`).join('')}</div>`,go:'rev'},
 {c:'игры',k:'ИГРА · СКОРО',t:`<span class="q8-gt">Dota 2</span>`,ab:'Новая игра — новый канал. Вкладок не прибавится.',cta:'Напомнить',bg:()=>`<canvas class="q8-nz" width="86" height="188"></canvas><b class="q8-sn">СКОРО</b>`,go:'soon'}];
function q8Ch(R,ctx){R.className='scr q7 q8c';
 const F=[['Все',''],['Кино','кино'],['Игры','игры'],['Интервью','интервью']];let fl='',L=Q8CH.map((x,i)=>i),ci=0,busy=false;
 R.innerHTML=`<div class="q8c-bg"></div><i class="q8c-sh"></i><canvas class="q8c-st" width="96" height="208"></canvas>${SB(0)}${q7Top()}
  <div class="q8c-f">${F.map((f,i)=>`<button class="${i?'':'on'}" data-f="${f[1]}">${f[0]}</button>`).join('')}</div>
  <div class="q8c-osd"><b>CH 01</b><span></span></div>
  <div class="q8c-rl"></div>
  <div class="q8c-tx"><small></small><div class="q8c-t"></div><p></p><button class="q8c-go">${ic('play')}<span></span></button></div>
  <div class="q8c-ud"><button data-d="-1" aria-label="Предыдущий канал">▲</button><button data-d="1" aria-label="Следующий канал">▼</button></div>
  <p class="q8c-hint">листай вверх-вниз — как каналы</p>${q7TB(0)}<i class="hb"></i>`;
 q7TopBind(R,ctx);q7TBBind(R,ctx);
 const bg=$('.q8c-bg',R),st=$('.q8c-st',R),osd=$('.q8c-osd',R),tx=$('.q8c-tx',R),rl=$('.q8c-rl',R);let nz=null,stOn=false;
 q8Noise(ctx,st,()=>stOn);
 const rail=()=>{rl.innerHTML=L.map((i,n)=>`<button class="${n===ci?'on':''}" data-n="${n}">${String(i+1).padStart(2,'0')}</button>`).join('');$$('button',rl).forEach(b=>ctx.on(b,'click',()=>jump(+b.dataset.n)))};
 function paint(first){const i=L[ci],c=Q8CH[i];
  bg.innerHTML=`<div class="q8c-l">${typeof c.bg==='function'?c.bg():c.bg}</div>`;vidStart(bg);if(nz)nz.stop();nz=q8Noise(ctx,$('.q8-nz',bg));
  $('b',osd).textContent='CH '+String(i+1).padStart(2,'0');$('span',osd).textContent=(c.c||'повторить').toUpperCase();
  $('small',tx).textContent=c.k;$('.q8c-t',tx).innerHTML=c.t;$('p',tx).textContent=c.ab;$('.q8c-go span',tx).textContent=c.cta;
  $$('button',rl).forEach((b,n)=>b.classList.toggle('on',n===ci));
  an(osd,[{opacity:0},{opacity:1,offset:.08},{opacity:1,offset:.8},{opacity:.55}],{d:2600,f:'forwards'});
  if(!first)an(tx,[{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:120})}
 function jump(n){if(busy||n===ci||n<0||n>=L.length)return;busy=true;ci=n;stOn=true;st.style.opacity='1';
  an(st,[{opacity:0},{opacity:.95,offset:.25},{opacity:.95,offset:.6},{opacity:0}],{d:380,f:'forwards'});
  ctx.t(()=>paint(),150);ctx.t(()=>{stOn=false;busy=false},400)}
 const step=d=>jump(Math.max(0,Math.min(L.length-1,ci+d)));
 $$('.q8c-ud button',R).forEach(b=>ctx.on(b,'click',()=>step(+b.dataset.d)));
 let wl=0;ctx.on(R,'wheel',e=>{if(e.target.closest('.q7-top,.q8c-f'))return;e.preventDefault();const t=performance.now();if(t-wl<420)return;wl=t;step(e.deltaY>0?1:-1)},{passive:false});
 ctx.on(document,'keydown',e=>{if(!ctx.alive)return;if(e.key==='ArrowDown')step(1);else if(e.key==='ArrowUp')step(-1)});
 let y0=null,x0=0;ctx.on(bg.parentNode,'pointerdown',e=>{if(e.target.closest('button,.q7-top'))return;y0=e.clientY;x0=e.clientX});
 ctx.on(R,'pointerup',e=>{if(y0==null)return;const dy=(e.clientY-y0)/SCALE,dx=Math.abs(e.clientX-x0)/SCALE;y0=null;if(Math.abs(dy)>50&&Math.abs(dy)>dx)step(dy<0?1:-1)});
 $$('.q8c-f button',R).forEach(b=>ctx.on(b,'click',()=>{fl=b.dataset.f;$$('.q8c-f button',R).forEach(x=>x.classList.toggle('on',x===b));
  const cur=L[ci];L=Q8CH.map((x,i)=>i).filter(i=>!fl||Q8CH[i].c===fl);ci=Math.max(0,L.indexOf(cur));rail();busy=false;
  stOn=true;an(st,[{opacity:0},{opacity:.9,offset:.3},{opacity:0}],{d:340,f:'forwards'});ctx.t(()=>{paint();stOn=false},140)}));
 const goEl=$('.q8c-go',R);
 ctx.on(goEl,'click',()=>{const c=Q8CH[L[ci]];an(goEl,[{transform:'scale(.92)'},{transform:'scale(1.05)'},{transform:'none'}],{d:300,e:EO});
  const back=()=>an(tx,[{opacity:0},{opacity:1}],{d:300});
  ctx.t(()=>{if(c.go==='play')m7Play(R,ctx,goEl,back);else if(c.go==='game')g8Hub(R,ctx,goEl,()=>{});else if(c.go==='f1')w4Full(R,ctx,SC4[1],goEl);else if(c.go==='f3')w4Full(R,ctx,SC4[3],goEl);
   else toast(R,{iv:'🎙 Интервью — как сцена: эпизоды по минуте',rev:'🔁 Повторение: 17 фраз, по 3 за раз',soon:'🔔 Скажу, когда Dota 2 появится'}[c.go])},220)});
 rail();paint(true);
 an(tx,[{opacity:0,transform:'translateY(20px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:200});an($('.q8c-rl',R),[{opacity:0,transform:'translateX(20px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:350});
 // первый раз канал сам переключится — показать, что листается
 let touched=false;ctx.on(R,'pointerdown',()=>{touched=true},{capture:true});ctx.t(()=>{if(!touched){step(1);ctx.t(()=>{if(!touched)step(-1)},1600)}},2600)}

V.push({g:'h18',id:'h18m',n:'Меню v2 — три дела, игры внутри',
 idea:'Твоё «Меню» с тем же шрифтом. Пунктов три, и у каждого своё дело: «Продолжить» — то, что ты начал (сразу эпизод); «Играть» — все игры: нажал — тем же шрифтом выезжает список игр, как вложенное меню в Esc (Deadlock, дальше Dota 2, Overwatch — «скоро»); «Что посмотреть» — выбрать новое, лентой как в TikTok. Мелко — то, что раз в день: «Повторить 17» и «С друзьями». Слово «Афиша» убрал.',
 moves:['первый раз внизу одна строка «что тут что» — «Понятно», и больше не показывается','«Играть» → пункты уезжают влево, выезжает список игр; «‹ Назад» — обратно','у игры «скоро» — шум телевизора вместо фона','пока не тронешь — сам перебирает три пункта, мышью — наведение меняет фон'],
 from:'Твой ответ на «Меню» (v17): «шрифт ахуенный… не понял, что значит Афиша… почему ты поставил это? у нас же куча игр будет — что будешь писать сюда?»',
 minus:'Чтобы зайти в Deadlock — два нажатия («Играть» → «Deadlock»). Зато когда игр будет пять, меню не растёт.',
 mount(R,ctx){q8Menu(R,ctx)}});
V.push({g:'h18',id:'h18c',n:'Каналы — мой вариант под микс',
 idea:'Вместо дверей — телевизор. Каждый фильм, сериал, игра и интервью — канал на весь экран: живой кадр, слева сверху номер «CH 02» шрифтом из «Меню», внизу — что это и одна кнопка. Листаешь вверх-вниз (на ПК — колесом и стрелками), между каналами — шум. Первый канал — то, что ты смотрел; «Повторить» — тоже канал. Новая игра — просто новый канал, вкладок не прибавится. Сверху — «Все · Кино · Игры · Интервью».',
 moves:['переключение — полсекунды шума и щелчок номера канала','справа — столбик номеров, тап — сразу туда','первый раз канал сам переключится вниз и обратно — показать, что листается','у Dota 2 «скоро» — канал со шумом и «СКОРО»'],
 from:'Твой ответ на «Две двери»: «не нравится, придумай ещё» и на v9: «свой дизайн, который подходит нам — у нас микс». Лента как в TikTok тебе нравилась — это она, но с номерами каналов.',
 minus:'Всё смотришь по одному: сразу пяти фильмов рядом не видно — для этого «Сцены».',
 mount(R,ctx){q8Ch(R,ctx)}});
