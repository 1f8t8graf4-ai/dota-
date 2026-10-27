/* ================= v17 · Главная под микс: Меню, Афиша, Две двери (28.10) =================
   Андрей на v9 «Меню + Афиша»: «сделай меню и афишу (обе разные) и свой дизайн, который подходит нам, учитывая, что у нас микс».
   Общее у всех трёх: шапка — аватарка (→ профиль с полкой наград и фоном из Коллекции), кружки сторис, билеты (→ Магазин);
   вкладки — Главная · Сцены · Игры · Словарь (профиль — аватаркой, как решили в v10). */
const Q7CH=['venator','rat','rem','talon'].map(k=>{const h=HERO[k],c=(typeof CH13!=='undefined'&&CH13[k]&&CH13[k][0])||null;
 return {k,ru:h.ru,hc:h.c1,img:'vt_'+k,t:c?c.t:h.ru,ab:c?c.ab:h.role}});
const q7Win=()=>`<span class="g9-cv"><i class="bm"></i><i class="bm b"></i>${Array.from({length:14},(_,i)=>`<i class="w" style="left:${(7+(i*37)%86)}%;top:${(18+(i*23)%44)}%;animation-delay:${(-i*.83).toFixed(2)}s;animation-duration:${(2.6+(i%4)*.9).toFixed(1)}s"></i>`).join('')}<i class="fg"></i></span>`;
const q7Hv=(k,cl)=>`<video class="${cl}" muted loop playsinline autoplay preload="auto" data-v="hv_${k}" poster="${IMG['hv_'+k]}"></video>`;
function q7Top(){return `<div class="q7-top"><button class="q7-av" aria-label="Профиль"><b>А</b><span class="lv">${[1,2,3,4,5].map(k=>`<i class="${k<=3?'f':''}"></i>`).join('')}</span></button>
  <div class="q7-st">${[[ic('bell'),'новое',0,1],[ic('snd'),'фраза дня',2],['6','серия',3],['14','цель дня',1]].map(c=>`<button class="q7-sti${c[3]?' nw':''}" data-s="${c[2]}" title="${c[1]}"><span>${c[0]}</span></button>`).join('')}</div>
  <button class="q7-tk" aria-label="Магазин">${ic('ticket')}<b>300</b></button></div><div class="h1-sv" hidden></div>`}
function q7TopBind(R,ctx){
 const sv=$('.h1-sv',R),SL=[newsSlide(),...daySlides().slice(0,4)];let svc=null;
 const close=()=>{if(!svc)return;const c=svc;svc=null;$$('.q7-sti',R).forEach(b=>b.classList.add('seen'));
  const a=an(sv,[{opacity:1},{opacity:0,transform:'scale(.94)'}],{d:240,f:'forwards'});
  const fin=()=>{c.kill();sv.hidden=true;sv.classList.remove('on');sv.innerHTML='';sv.getAnimations().forEach(x=>x.cancel())};if(a)a.onfinish=fin;else fin()};
 $$('.q7-sti',R).forEach((b,j)=>{an(b,[{opacity:0,transform:'scale(.5)'},{opacity:1,transform:'none'}],{sp:SPb,dl:120+j*60});
  ctx.on(b,'click',()=>{if(svc)svc.kill();svc=sub(ctx);sv.hidden=false;sv.classList.add('on');an(sv,[{opacity:0,transform:'scale(.92)'},{opacity:1,transform:'none'}],{sp:SPs});stories(sv,svc,SL,+b.dataset.s,{R,end:close,x:close})})});
 const av=$('.q7-av',R);ctx.on(av,'click',()=>{an(av,[{transform:'scale(.9)'},{transform:'none'}],{sp:SPb});q7Prof(R,ctx,av)});
 const tk=$('.q7-tk',R);ctx.on(tk,'click',()=>{an(tk,[{transform:'scale(.92)'},{transform:'none'}],{sp:SPb});q7Ov(R,()=>w5Shop(R,ctx,tk))});
 an($('.q7-av',R),[{opacity:0,transform:'scale(.6)'},{opacity:1,transform:'none'}],{sp:SPb,dl:60});an(tk,[{opacity:0,transform:'translateX(16px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:200})}
// оверлеи Коллекции и Магазина — поверх профиля
function q7Ov(R,f){f();const o=$('.w5o',R);if(o)o.style.zIndex=95}
const q7TB=on=>`<nav class="q7-tb">${[['home','Главная'],['film','Сцены'],['game','Игры'],['dict','Словарь']].map(([k,n],i)=>`<a class="${i===on?'on':''}" data-tb="${k}"><svg viewBox="0 0 24 24">${TBI[k]}</svg><span>${n}</span></a>`).join('')}</nav>`;
function q7TBBind(R,ctx){$$('.q7-tb a',R).forEach(a=>ctx.on(a,'click',()=>{const k=a.dataset.tb;if(k==='home')return;an(a,[{transform:'scale(.9)'},{transform:'none'}],{sp:SPb});
 if(k==='game')g8Hub(R,ctx,a,()=>{});else toast(R,k==='film'?'🎬 Сцены — каталог фильмов (в этом макете — только Главная)':'📖 Словарь — в этом макете только Главная')}))}

/* профиль — шторка растёт из аватарки: фон из Коллекции (живой), уровень, полка наград, вход в Коллекцию и Магазин */
function q7Prof(R,ctx,from){let ov=$('.q7-pf',R);if(ov)ov.remove();ov=document.createElement('div');ov.className='q7-pf on';
 const BGS=[['vid','bank','Волк · Женева','фон сцены · редкий'],['img','bd_titanic','Титаник','фон фильма · за 100 %'],['img','bd_sopranos','Клан Сопрано','фон сезона 1']];let bi=0;
 const bgH=b=>b[0]==='vid'?vidHTML(b[1]):`<i class="img" style="background-image:url(${IMG[b[1]]})"></i>`;
 const CD=[['tk2','Я выживу','Эпическая','#B36BFF',-3],['wk4','Первый ключ','Легендарная','#FFC83D',2],['ak3','Визитки','Редкая','#4FA3FF',-1],['vt_venator','Венатор · ур. 3','Герой','#E0414F',3],['wk2','Фугази','Обычная','#8A8494',-2]];
 ov.innerHTML=`<i class="gr"></i><div class="q7-pfw"><div class="q7-pfbg">${bgH(BGS[0])}<i class="sh"></i><span class="tag">Фон из Коллекции · ${BGS[0][2]}</span></div><button class="q7-pfx" aria-label="Закрыть">${ic('x')}</button>
  <div class="q7-pfin"><div class="q7-pfh"><span class="av">А</span><div><b>Андрей</b><small>Средний · <em>62&nbsp;%</em> до&nbsp;«Выше среднего»</small><i class="q7-pr"><i></i></i></div></div>
   <div class="q7-pfs"><span><b>6</b>дней подряд</span><span><b>128</b>слов</span><span><b>41</b>фраза</span><span><b>7/37</b>наград</span></div>
   <div class="q7-pfc"><b>Полка наград</b><small>её видят друзья в дуэли</small></div>
   <div class="q7-shelf">${CD.map(c=>`<div class="q7-cd" style="--rc:${c[3]};--rt:${c[4]}deg" data-rt="${c[4]}"><i class="img" style="background-image:url(${IMG[c[0]]})"></i>${c[2]==='Легендарная'?'<i class="gl"></i>':''}<span><em>${c[2]}</em>${c[1]}</span></div>`).join('')}</div>
   <button class="q7-chg">Сменить фон — из Коллекции</button>
   <div class="q7-pfb"><button data-go="coll">Коллекция <em>7 из 37</em></button><button data-go="shop">Магазин <em>300 билетов</em></button><button class="w" data-go="set">Настройки <em>тема, звук, субтитры</em></button></div>
   <p class="q7-pfn">Аватарка стоит в одном углу на любой из трёх главных — что бы ни выбрал, профиль на месте.</p></div></div>`;
 R.appendChild(ov);vidStart(ov);
 const w=$('.q7-pfw',ov),gr=$('.gr',ov),r=rel(from,R),wr=rel(w,R);
 w.style.transformOrigin=`${(r.x-wr.x+r.w/2).toFixed(0)}px ${(r.y-wr.y+r.h/2).toFixed(0)}px`;
 an(w,[{transform:'scale(.1)',opacity:0},{transform:'none',opacity:1}],{sp:SPs});an(gr,[{opacity:0},{opacity:1}],{d:260});
 ctx.t(()=>{const p=$('.q7-pr i',ov);if(p)an(p,[{transform:'scaleX(0)'},{transform:'none'}],{d:900,e:EO})},260);
 $$('.q7-cd',ov).forEach((c,j)=>{const rt=+c.dataset.rt;an(c,[{opacity:0,transform:`translateY(26px) rotate(${rt+(j%2?9:-9)}deg)`},{opacity:1,transform:`rotate(${rt}deg)`}],{sp:SPb,dl:320+j*70})});
 let shut=false;const close=()=>{if(shut)return;shut=true;an(w,[{transform:'none',opacity:1},{transform:'scale(.1)',opacity:0}],{d:240,e:EI,f:'forwards'});an(gr,[{opacity:1},{opacity:0}],{d:240,f:'forwards'});ctx.t(()=>ov.remove(),250)};
 ctx.on($('.q7-pfx',ov),'click',close);ctx.on(gr,'click',close);
 // смахнуть вниз — закрыть (когда прокрутка в самом верху)
 const inn=$('.q7-pfin',ov);let y0=null;ctx.on(inn,'pointerdown',e=>{y0=inn.scrollTop<=0?e.clientY:null});
 ctx.on(inn,'pointerup',e=>{if(y0!=null&&(e.clientY-y0)/SCALE>90)close();y0=null});
 ctx.on($('.q7-chg',ov),'click',()=>{bi=(bi+1)%BGS.length;const b=BGS[bi],box=$('.q7-pfbg',ov),old=box.firstElementChild,tmp=document.createElement('div');tmp.innerHTML=bgH(b);const nw=tmp.firstElementChild;
  box.insertBefore(nw,old);vidStart(box);const a=an(old,[{opacity:1},{opacity:0}],{d:520,f:'forwards'});const fin=()=>old.remove();if(a)a.onfinish=fin;else fin();
  $('.tag',ov).textContent=`Фон из Коллекции · ${b[2]} · ${b[3]}`;an(nw,[{transform:'scale(1.06)'},{transform:'none'}],{d:900,e:EO})});
 $$('.q7-pfb [data-go]',ov).forEach(b=>ctx.on(b,'click',()=>{an(b,[{transform:'scale(.96)'},{transform:'none'}],{sp:SPb});const g=b.dataset.go;
  if(g==='coll')q7Ov(R,()=>w5Coll(R,ctx,b));else if(g==='shop')q7Ov(R,()=>w5Shop(R,ctx,b));else toast(R,'⚙️ Настройки — как в v13: папки, тема, пауза примером')}))}

/* ---------- 1. Меню — как меню Deadlock по Esc ---------- */
function q7Menu(R,ctx){R.className='scr q7 q7m';
 const IT=[{b:'Смотреть',s:'Титаник · эпизод 2 «Я выживу» · 46 с',pr:1},{b:'Deadlock',s:`Комикс «${Q7CH[0].t}» · 2 перехвата ждут`,bdg:'2'},{b:'Афиша',s:'6 фильмов и сериалов · 2 интервью · 4 главы Deadlock'}];
 const PW=['p_titanic','p_wolf','p_psycho','vt_venator','p_sopranos','p_taxi','vt_rat','p_bb','p_durov','vt_rem','p_clav','p_bunker'];
 R.innerHTML=`<div class="q7m-bg">
  <div class="q7m-l on" data-j="0">${vidHTML('titanic')}</div>
  <div class="q7m-l" data-j="1"><i class="img kb" style="background-image:url(${IMG.dl_cover})"></i>${q7Win()}${q7Hv('venator','q7m-hv')}</div>
  <div class="q7m-l" data-j="2"><div class="q7m-wall">${PW.concat(PW).map(k=>`<i class="img" style="background-image:url(${IMG[k]})"></i>`).join('')}</div></div>
  <div class="q7m-l" data-j="3"><i class="img kb" style="background-image:url(${IMG.bd_wolf})"></i><div class="q7m-rv">${["Trust me.","Have a seat, please.","I'll be fine.","Stress, maybe."].map((p,i)=>`<span style="animation-delay:${-i*1.7}s">${p}</span>`).join('')}</div></div>
 </div><i class="q7m-sh"></i><canvas class="fx"></canvas>${SB(0)}${q7Top()}
 <nav class="q7m-mn">${IT.map((it,j)=>`<button class="q7m-i${j?'':' on'}" data-j="${j}"><b>${it.b}${it.bdg?`<i class="bdg">${it.bdg}</i>`:''}</b><small>${it.s}</small>${it.pr?'<i class="q7-pr"><i></i></i>':''}</button>`).join('')}
  <div class="q7m-mi"><button data-j="3">Повторить<em>17</em></button><button data-j="4">С друзьями</button></div></nav>
 ${q7TB(0)}<i class="hb"></i>`;
 vidStart(R);q7TopBind(R,ctx);q7TBBind(R,ctx);
 const fx=FX(ctx,$('.fx',R)),L=$$('.q7m-l',R),I=$$('.q7m-i',R);let cur=0,touched=false;
 const DU=Array.from({length:22},()=>({x:Math.random()*344,y:Math.random()*754,v:.1+Math.random()*.25,r:.6+Math.random()*1.3,a:Math.random()*6.28}));
 fx.ambient({step(g,k){for(const d of DU){d.y-=d.v*k;d.a+=.02*k;d.x+=Math.sin(d.a)*.2*k;if(d.y<-4){d.y=760;d.x=Math.random()*344}g.globalAlpha=.14+.16*Math.sin(d.a*2);g.fillStyle='#FFD98A';g.beginPath();g.arc(d.x,d.y,d.r,0,6.3);g.fill()}g.globalAlpha=1}});
 function sel(j){if(j===cur||j>3)return;cur=j;L.forEach(l=>l.classList.toggle('on',+l.dataset.j===j));I.forEach(i=>i.classList.toggle('on',+i.dataset.j===j))}
 const back=()=>{$$('.q7m-mn,.q7-top',R).forEach((x,i)=>{x.getAnimations().forEach(a=>a.cancel());an(x,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:i*60})})};
 function enter(j,el){touched=true;sel(j);
  an(el,[{scale:'1'},{scale:'.95'},{scale:'1.05'},{scale:'1'}],{d:320,e:EO});
  const r=rel(el,R);fx.burst(r.x+50,r.y+r.h/2,{n:18,c:['#FFD23F','#fff'],v:3.4,g:0,s:2,l:30});
  ctx.t(()=>{if(j===0){$$('.q7m-mn,.q7-top',R).forEach((x,i)=>an(x,[{opacity:1},{opacity:0,transform:'translateY(18px)'}],{d:220,dl:i*30,e:EI,f:'forwards'}));m7Play(R,ctx,el,back)}
   else if(j===1)g8Hub(R,ctx,el,()=>{});else if(j===2)w4Feed(R,ctx,0,el);
   else toast(R,j===3?'🔁 Повторение: 17 фраз, по 3 за раз':'⚔️ Дуэль по сцене — ссылкой другу в Telegram')},j<3?300:80)}
 I.forEach(b=>{ctx.on(b,'pointerenter',e=>{if(e.pointerType==='mouse'){touched=true;sel(+b.dataset.j)}});ctx.on(b,'click',()=>enter(+b.dataset.j,b))});
 $$('.q7m-mi button',R).forEach(b=>{ctx.on(b,'pointerenter',e=>{if(e.pointerType==='mouse'&&b.dataset.j==='3'){touched=true;sel(3)}});ctx.on(b,'click',()=>enter(+b.dataset.j,b))});
 ctx.on(R,'pointerdown',()=>{touched=true},{capture:true});
 I.forEach((b,i)=>an(b,[{opacity:0,transform:'rotate(-1.4deg) translateX(-60px)'},{opacity:1,transform:'rotate(-1.4deg)'}],{sp:SPs,dl:160+i*90}));
 an($('.q7m-mi',R),[{opacity:0},{opacity:1}],{d:500,dl:520});
 // пока не тронешь — сам перебирает пункты (фон наплывает)
 let k=0;const cyc=()=>{if(touched)return;k=(k+1)%4;sel(k);ctx.t(cyc,k===0?4200:2700)};ctx.t(cyc,3800)}

/* ---------- 2. Афиша — кино, сериалы, интервью и главы Deadlock в одной сетке ---------- */
function q7Af(R,ctx){R.className='scr q7 q7a';
 const S=SC4,KN={titanic:'f',wolf:'f',psycho:'f',sopranos:'s',taxi:'f',bb:'s'},IV={durov:['p_durov','Павел Дуров','интервью · 3 части'],clav:['p_clav','Clavicular','интервью · 4 части']};
 const ORD=[['f',0],['d',0],['f',1],['s',3],['d',1],['f',2],['i','durov'],['s',5],['d',2],['f',4],['i','clav'],['d',3]];
 const card=([t,j])=>{if(t==='d'){const c=Q7CH[j];return `<button class="q7a-c dl" data-t="d" data-j="${j}" style="--hc:${c.hc}"><span class="pc"><i class="img" style="background-image:url(${IMG[c.img]})"></i><span class="tg">КОМИКС</span></span><b>${c.t}</b><small>${c.ru} · глава 1</small></button>`}
  if(t==='i'){const v=IV[j];return `<button class="q7a-c" data-t="i" data-j="${j}"><span class="pc"><i class="img" style="background-image:url(${IMG[v[0]]})"></i><span class="tg">ИНТЕРВЬЮ</span></span><b>${v[1]}</b><small>${v[2]}</small></button>`}
  const s=S[j];return `<button class="q7a-c" data-t="${t}" data-j="${j}"><span class="pc"><i class="img" style="background-image:url(${IMG['p_'+s.k]||IMG[s.img]})"></i><span class="tg">${t==='s'?'СЕРИАЛ':'ФИЛЬМ'}</span>${bars(s.lv)}</span><b>${s.t}</b><small>${s.eps.length} эп. · ≈ ${sc4Min(s)} мин</small></button>`};
 R.innerHTML=`${SB(0)}${q7Top()}<div class="q7a-sc">
  <button class="q7a-now">${vidHTML('titanic')}<i class="sh"></i><span class="tx"><small>СЕЙЧАС СМОТРИШЬ · ЭПИЗОД 2 ИЗ 4</small>${ffT(S[0])}<p>«Я выживу» — Джек уговаривает Роуз сесть в шлюпку.</p><span class="q7a-go"><b>${ic('play')}Смотреть</b><i class="q7-pr"><i></i></i></span></span></button>
  <div class="q7a-ch">${[['all','Всё'],['f','Фильмы'],['s','Сериалы'],['i','Интервью'],['d','Deadlock']].map(([k,n],i)=>`<button class="${i?'':'on'}${k==='d'?' dl':''}" data-f="${k}">${n}</button>`).join('')}</div>
  <div class="q7a-hd"><b>В афише</b><button class="all">все лентой ${ic('chev')}</button></div>
  <div class="q7a-gr">${ORD.map(card).join('')}</div>
  <button class="q7a-rv">${ic('rep')}<span>Повторить 17 фраз</span><small>≈ 4 мин</small>${ic('chev')}</button></div>
 ${q7TB(0)}<i class="hb"></i>`;
 vidStart(R);q7TopBind(R,ctx);q7TBBind(R,ctx);
 const now=$('.q7a-now',R),C=$$('.q7a-c',R),F=$$('.q7a-ch button',R);
 an(now,[{opacity:0,transform:'translateY(20px) scale(.97)'},{opacity:1,transform:'none'}],{sp:SPs,dl:80});
 C.forEach((c,i)=>an(c,[{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:240+i*45}));
 const back=()=>{now.getAnimations().forEach(a=>a.cancel());an(now,[{opacity:0,transform:'scale(.97)'},{opacity:1,transform:'none'}],{sp:SPs})};
 ctx.on(now,'click',()=>{an($('.q7a-go b',now),[{transform:'scale(.9)'},{transform:'scale(1.06)'},{transform:'none'}],{d:320,e:EO});ctx.t(()=>m7Play(R,ctx,now,back),240)});
 F.forEach(b=>ctx.on(b,'click',()=>{F.forEach(x=>x.classList.toggle('on',x===b));const f=b.dataset.f;let n=0;
  C.forEach(c=>{const on=f==='all'||c.dataset.t===f;if(on){const was=c.classList.contains('hid');c.classList.remove('hid');if(was||f!=='all')an(c,[{opacity:0,transform:'translateY(14px) scale(.96)'},{opacity:1,transform:'none'}],{sp:SPs,dl:n++*55})}else c.classList.add('hid')})}));
 C.forEach(c=>ctx.on(c,'click',()=>{an(c,[{transform:'scale(.95)'},{transform:'none'}],{sp:SPb});const t=c.dataset.t,j=c.dataset.j;
  if(t==='f'||t==='s')w4Full(R,ctx,S[+j],c);else if(t==='d'){const ch=Q7CH[+j];toast(R,`📖 ${ch.ru}: «${ch.t}» — глава комикса`);ctx.t(()=>g8Hub(R,ctx,c,()=>{}),700)}
  else toast(R,`🎙 ${IV[j][1]} — интервью, ${IV[j][2].split('· ')[1]}`)}));
 ctx.on($('.q7a-hd .all',R),'click',e=>w4Feed(R,ctx,0,e.currentTarget));
 ctx.on($('.q7a-rv',R),'click',e=>{an(e.currentTarget,[{transform:'scale(.97)'},{transform:'none'}],{sp:SPb});toast(R,'🔁 Повторение: 17 фраз, по 3 за раз')})}

/* ---------- 3. Две двери — кино сверху, Deadlock снизу; шов тянется ---------- */
function q7Dv(R,ctx){R.className='scr q7 q7d';
 const S=SC4,PS=[0,1,2,3,4,5];let fi=0,ci=0,s=52;
 try{const v=+localStorage.getItem('q7-s');if(v>=34&&v<=70)s=v}catch(e){}
 R.innerHTML=`${SB(0)}<div class="q7d-dr" style="--s:${s}%">
  <button class="q7d-a"><span class="q7d-bgA">${vidHTML('titanic')}</span><i class="sh"></i>
   <span class="q7d-col"><span class="q7d-ps">${PS.map(j=>`<i class="img${j?'':' on'}" data-j="${j}" style="background-image:url(${IMG['p_'+S[j].k]})"></i>`).join('')}</span>
   <div class="q7d-tx"><small>КИНО · ПРОДОЛЖИТЬ</small><span class="q7d-ft">${ffT(S[0])}</span><p>Эпизод 2 «Я выживу» · 46 с</p><span class="q7d-go">${ic('play')}Смотреть</span></div></span></button>
  <button class="q7d-b"><i class="img kb" style="background-image:url(${IMG.dl_cover})"></i>${q7Win()}${q7Hv('venator','hv')}<i class="sh"></i>
   <span class="q7d-col"><span class="q7d-hs">${Q7CH.map((c,j)=>`<i class="q7d-h${j?'':' on'}" data-j="${j}" style="background-image:url(${MINI(c.k)});--hc:${c.hc}"></i>`).join('')}</span>
   <div class="q7d-tx"><small>DEADLOCK · КОМИКС</small><div class="q7d-tt">${Q7CH[0].t}</div><p>${Q7CH[0].ru} · глава 1</p><span class="q7d-go">${ic('play')}Играть</span></div></span></button>
  <span class="q7d-bdg">2 перехвата</span><i class="q7d-gp"></i><button class="q7d-sm">${ic('rep')}Повторить <em>17</em></button></div>
  <p class="q7d-hint">тяни «Повторить» вверх или вниз — какую дверь больше</p>
  ${q7Top()}${q7TB(0)}<i class="hb"></i>`;
 vidStart(R);q7TopBind(R,ctx);q7TBBind(R,ctx);
 const dr=$('.q7d-dr',R),A=$('.q7d-a',R),B=$('.q7d-b',R),sm=$('.q7d-sm',R);let touched=false;
 const setS=v=>{s=Math.max(34,Math.min(70,v));dr.style.setProperty('--s',s.toFixed(2)+'%');dr.classList.toggle('lo',s>=60);dr.classList.toggle('hi',s<=42)};
 setS(s);
 const tw=(to,ms,cb)=>{const f0=s,t0=performance.now();const st=()=>{if(!ctx.alive)return;const k=Math.min(1,(performance.now()-t0)/ms),e=1-Math.pow(1-k,3);setS(f0+(to-f0)*e);if(k<1)requestAnimationFrame(st);else if(cb)cb()};requestAnimationFrame(st)};
 an(A,[{opacity:0,transform:'translateX(-40px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:80});an(B,[{opacity:0,transform:'translateX(40px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:180});
 an(sm,[{opacity:0,transform:'scale(.5)'},{opacity:1,transform:'none'}],{sp:SPb,dl:520});an($('.q7d-gp',R),[{opacity:0},{opacity:1},{opacity:.7}],{d:900,dl:400});
 // шов: тянется пальцем, прилипает к трём положениям; тап без движения — «Повторить»
 let y0=null,s0=0,moved=false;
 ctx.on(sm,'pointerdown',e=>{touched=true;y0=e.clientY;s0=s;moved=false;R.classList.add('drag');try{sm.setPointerCapture(e.pointerId)}catch(_){}e.preventDefault()});
 ctx.on(sm,'pointermove',e=>{if(y0==null)return;const dy=(e.clientY-y0)/SCALE;if(Math.abs(dy)>5)moved=true;if(moved)setS(s0+dy/dr.offsetHeight*100)});
 const up=()=>{if(y0==null)return;y0=null;R.classList.remove('drag');
  if(!moved){an(sm,[{transform:'scale(.92)'},{transform:'none'}],{sp:SPb});toast(R,'🔁 Повторение: 17 фраз, по 3 за раз');return}
  const to=[36,52,68].reduce((a,b)=>Math.abs(b-s)<Math.abs(a-s)?b:a);tw(to,260,()=>{try{localStorage.setItem('q7-s',String(to))}catch(_){}})};
 ctx.on(sm,'pointerup',up);ctx.on(sm,'pointercancel',up);
 // мини-постеры в кинодвери и мини-иконки героев в двери Deadlock — выбрать, что за дверью
 const fill=j=>{fi=j;const sc=S[j],bg=$('.q7d-bgA',A),tx=$('.q7d-tx',A);$$('.q7d-ps i',A).forEach(x=>x.classList.toggle('on',+x.dataset.j===j));
  bg.innerHTML=j===0?vidHTML('titanic'):`<i class="img kb" style="background-image:url(${IMG[sc.img]})"></i>`;vidStart(bg);an(bg,[{opacity:.2,transform:'scale(1.05)'},{opacity:1,transform:'none'}],{d:600,e:EO});
  $('small',tx).textContent=j===0?'КИНО · ПРОДОЛЖИТЬ':`КИНО · ${sc.eps.length} ЭПИЗОДА · ≈ ${sc4Min(sc)} МИН`;$('.q7d-ft',tx).innerHTML=ffT(sc);$('p',tx).textContent=j===0?'Эпизод 2 «Я выживу» · 46 с':sc.ab;
  an(tx,[{opacity:0,transform:'translateX(18px)'},{opacity:1,transform:'none'}],{sp:SPs})};
 const fillC=j=>{ci=j;const c=Q7CH[j],tx=$('.q7d-tx',B);$$('.q7d-hs i',B).forEach(x=>x.classList.toggle('on',+x.dataset.j===j));
  const v=$('video.hv',B);if(v){const has=['venator','rat'].includes(c.k);v.style.opacity=has?'':'0';if(has&&v.dataset.v!=='hv_'+c.k){v.dataset.v='hv_'+c.k;v.poster=IMG['hv_'+c.k];vidStart(B)}}
  $('.q7d-tt',tx).textContent=c.t;$('p',tx).textContent=`${c.ru} · глава 1`;an(tx,[{opacity:0,transform:'translateX(18px)'},{opacity:1,transform:'none'}],{sp:SPs})};
 const back=()=>{[A,B].forEach(x=>{x.getAnimations().forEach(a=>a.cancel());an(x,[{opacity:0},{opacity:1}],{d:400})})};
 ctx.on(A,'click',e=>{touched=true;const p=e.target.closest('.q7d-ps i');if(p){const j=+p.dataset.j;if(j!==fi){fill(j);return}}
  an($('.q7d-go',A),[{transform:'scale(.9)'},{transform:'scale(1.06)'},{transform:'none'}],{d:300,e:EO});
  if(fi===0)ctx.t(()=>m7Play(R,ctx,A,back),220);else ctx.t(()=>w4Full(R,ctx,S[fi],$('.q7d-go',A)),200)});
 ctx.on(B,'click',e=>{touched=true;const p=e.target.closest('.q7d-hs i');if(p){const j=+p.dataset.j;if(j!==ci){fillC(j);return}}
  an($('.q7d-go',B),[{transform:'scale(.9)'},{transform:'scale(1.06)'},{transform:'none'}],{d:300,e:EO});ctx.t(()=>g8Hub(R,ctx,B,()=>{}),220)});
 ctx.on(R,'pointerdown',()=>{touched=true},{capture:true});
 // первый раз шов сам качнётся — показать, что тянется
 ctx.t(()=>{if(touched)return;const b=s;tw(b+10,520,()=>ctx.t(()=>{if(!touched)tw(b,620)},260))},2200)}

V.push({g:'h17',id:'h17m',n:'Меню — как меню Deadlock',
 idea:'Как меню игры по Esc (твой скрин с Torfus Voice): крупные пункты капсом, выбранный — на жёлтом мазке. Пунктов три, кино и игра наравне: «Смотреть» (продолжить фильм), «Deadlock», «Афиша». Ниже мелко — «Повторить 17» и «С друзьями». Фон — то, что выбрано: живой кадр фильма, город Deadlock с живым Венатором, стена постеров и глав, реплики для повторения. Тап — сразу внутрь, без второго нажатия; мышью наведение меняет фон.',
 moves:['пока не тронешь — сам перебирает пункты, фон наплывает','у выбранного пункта мазок вытягивается слева направо','нажал — пункт вздрагивает, искры, сразу эпизод / Deadlock / лента «Что посмотреть»','аватарка слева сверху → профиль растёт из неё'],
 from:'Твой ответ на «Меню + Афиша» (v9): «сделай меню и афишу (обе разные) и какой-то свой дизайн, который подходит нам, учитывая, что у нас микс». Вид пунктов — как меню Deadlock.',
 minus:'Что посмотреть — за пунктом «Афиша»: сцены видно по нажатию или пока меню само перебирает.',
 mount(R,ctx){q7Menu(R,ctx)}});
V.push({g:'h17',id:'h17a',n:'Афиша — кино и главы Deadlock вместе',
 idea:'Сверху — что сейчас смотришь: живой кадр и одна «▶ Смотреть». Ниже — афиша: фильмы, сериалы, интервью и главы комикса Deadlock в одной сетке; глава — в рамке цвета героя с пометкой «КОМИКС». Чипы: Фильмы · Сериалы · Интервью · Deadlock. «Все лентой» — лента как в TikTok. «Повторить 17» — строкой внизу. Аватарка и билеты — в шапке.',
 moves:['чип — карточки другого раздела гаснут, свои въезжают по очереди','у главы Deadlock рамка героя и лёгкая штриховка комикса','тап по фильму — окно «Подробнее» растёт из постера, по главе — сразу в Deadlock'],
 from:'Твой ответ на «Меню + Афиша» (v9): меню и афишу — раздельно. Афиша — каталог на главной, но без «кучи лишнего» v7: одна кнопка, сетка, одна строка.',
 minus:'Длиннее меню: сетку надо листать. Зато всё, что можно посмотреть и почитать, — на одном экране.',
 mount(R,ctx){q7Af(R,ctx)}});
V.push({g:'h17',id:'h17d',n:'Две двери — мой вариант под микс',
 idea:'Микс — это две разные вещи: кино и игра. Экран и делится на две двери по диагонали: сверху кино (живой кадр, шрифт фильма, «▶ Смотреть», мини-постеры — выбрать другой фильм), снизу Deadlock (город, живой Венатор, «▶ Играть», мини-иконки героев — выбрать главу, перехваты). На шве — «Повторить 17». Шов тянется: смотришь больше кино — верхняя дверь больше, играешь чаще — нижняя. Запоминается.',
 moves:['двери въезжают с разных сторон, шов вспыхивает','шов тянется пальцем и прилипает к трём положениям','первый раз шов сам качнётся — показать, что тянется','мини-постер — фон и шрифт фильма меняются за дверью'],
 from:'Твой ответ на «Меню + Афиша» (v9): «какой-то ещё дизайн свой, который подходит нам, учитывая, что у нас микс».',
 minus:'Каталога на главной нет — только мини-постеры; весь список — во вкладке «Сцены».',
 mount(R,ctx){q7Dv(R,ctx)}});
