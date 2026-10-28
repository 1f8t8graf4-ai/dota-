/* ================= v19 · «Играть» понятнее, Deadlock без комиксов, «Почитать · Послушать», «Против кого стоишь» (28.10) =================
   Андрей на v18: «кнопка «Играть» сочно выглядит, но непонятно, что значит „играть“; Deadlock выглядел неплохо — как последняя игра»;
   «убери комиксы — мы же говорили, они в героях (хотя тут тоже за ручку вести нужно)»; «Versus с другом — куда-то вниз»;
   «какой-то „что почитать / послушать“ — сюда же»; «советы: стоишь на линии против художницы — её стан можно заблокировать, забежав за стену».
   Художница — Вайолет (в файлах игры hero_artist): «Still Life» бьёт и станит, «пока она на тебя смотрит» — совет Андрея верный.
   В v18 «Играть» → Deadlock открывал старый экран из v8 (там и был список комиксов). Здесь — экран Deadlock из v15 (y5), переделанный. */

/* ---------- 1. Меню: пункт игр — двумя способами ---------- */
const Q9G=[{k:'deadlock',n:'Deadlock',s:'радар: 2 перехвата · Versus · 9 героев',bdg:'2',on:1},{k:'dota',n:'Dota 2',s:'скоро — появится тут сама'},{k:'ow',n:'Overwatch',s:'скоро'}];
function q9Menu(R,ctx,mode){R.className='scr q7 q7m q8m q9m';
 const DL=mode==='dl';
 const IT=[{b:'Продолжить',s:'Титаник · эпизод 2 «Я выживу» · 46 с',pr:1,why:'то, что ты начал'},
  DL?{b:'Deadlock',s:'последняя игра · радар: 2 перехвата',bdg:'2',why:'игра, в которую ты играл последним, — сразу внутрь; другие игры — «Все игры» внизу'}
    :{b:'Игры',s:'',gm:1,bdg:'2',why:'все игры списком — сколько бы их ни было'},
  {b:'Что посмотреть',s:'6 фильмов и сериалов · 2 интервью — лентой',why:'выбрать новое'}];
 const PW=['p_titanic','p_wolf','p_psycho','p_sopranos','p_taxi','p_bb','p_durov','p_clav','p_bunker'];
 const gms=`<span class="q9-gl">${[['DL',1],['D2',0],['OW',0]].map(([t,on])=>`<i class="${on?'on':''}">${t}</i>`).join('')}<em>Deadlock · скоро Dota 2 и Overwatch</em></span>`;
 R.innerHTML=`<div class="q7m-bg">
  <div class="q7m-l on" data-j="0">${vidHTML('titanic')}</div>
  <div class="q7m-l" data-j="1"><i class="img kb" style="background-image:url(${IMG.dl_cover})"></i>${q7Win()}${q7Hv('venator','q7m-hv')}</div>
  <div class="q7m-l" data-j="2"><div class="q7m-wall">${PW.concat(PW).map(k=>`<i class="img" style="background-image:url(${IMG[k]})"></i>`).join('')}</div></div>
  <div class="q7m-l" data-j="3"><i class="img kb" style="background-image:url(${IMG.bd_wolf})"></i><div class="q7m-rv">${["Trust me.","Have a seat, please.","I'll be fine.","Stress, maybe."].map((p,i)=>`<span style="animation-delay:${-i*1.7}s">${p}</span>`).join('')}</div></div>
  <div class="q7m-l q8-soon" data-j="5"><canvas class="q8-nz" width="86" height="188"></canvas><b>СКОРО</b></div>
 </div><i class="q7m-sh"></i><canvas class="fx"></canvas>${SB(0)}${q7Top()}
 <nav class="q7m-mn q8-mn" data-lv="0">${IT.map((it,j)=>`<button class="q7m-i${j?'':' on'}" data-j="${j}"><b>${it.b}${it.bdg?`<i class="bdg">${it.bdg}</i>`:''}</b>${it.gm?gms:`<small>${it.s}</small>`}${it.pr?'<i class="q7-pr"><i></i></i>':''}</button>`).join('')}
  <div class="q7m-mi"><button data-j="3">Повторить<em>17</em></button>${DL?'<button data-j="6">Все игры</button>':''}<button data-j="4">С друзьями</button></div></nav>
 <nav class="q7m-mn q8-gm" data-lv="1" hidden><button class="q8-bk">‹ Назад</button>${Q9G.map((g,i)=>`<button class="q7m-i${i?'':' on'}${g.on?'':' off'}" data-g="${i}"><b>${g.n}${g.bdg?`<i class="bdg">${g.bdg}</i>`:''}</b><small>${g.s}</small></button>`).join('')}</nav>
 <div class="q8-why" hidden>${IT.map(it=>`<span><b>${it.b}</b> — ${it.why}</span>`).join('')}<span><b>Повторить · ${DL?'Все игры · ':''}С друзьями</b> — раз в день, другие игры и с другом</span><button class="q8-ok">Понятно</button></div>
 ${q7TB(0)}<i class="hb"></i>`;
 vidStart(R);q7TopBind(R,ctx);q7TBBind(R,ctx);
 const fx=FX(ctx,$('.fx',R)),L=$$('.q7m-l',R),M=$('.q8-mn',R),G=$('.q8-gm',R);let cur=0,touched=false,lv=0;
 q8Noise(ctx,$('.q8-nz',R));
 const DU=Array.from({length:22},()=>({x:Math.random()*344,y:Math.random()*754,v:.1+Math.random()*.25,r:.6+Math.random()*1.3,a:Math.random()*6.28}));
 fx.ambient({step(g,k){for(const d of DU){d.y-=d.v*k;d.a+=.02*k;d.x+=Math.sin(d.a)*.2*k;if(d.y<-4){d.y=760;d.x=Math.random()*344}g.globalAlpha=.14+.16*Math.sin(d.a*2);g.fillStyle='#FFD98A';g.beginPath();g.arc(d.x,d.y,d.r,0,6.3);g.fill()}g.globalAlpha=1}});
 const layer=j=>L.forEach(l=>l.classList.toggle('on',+l.dataset.j===j));
 function sel(j){if(j>3||(lv===0&&j===cur))return;cur=j;layer(j);$$('.q7m-i',M).forEach(i=>i.classList.toggle('on',+i.dataset.j===j))}
 function selG(i){$$('.q7m-i',G).forEach(b=>b.classList.toggle('on',+b.dataset.g===i));layer(Q9G[i].on?1:5)}
 function level(n){lv=n;const a=n?M:G,b=n?G:M;an(a,[{opacity:1,transform:'none'},{opacity:0,transform:`translateX(${n?-40:40}px)`}],{d:200,e:EI,f:'forwards'});
  ctx.t(()=>{a.hidden=true;b.hidden=false;b.getAnimations().forEach(x=>x.cancel());$$('.q7m-i,.q8-bk',b).forEach((x,i)=>an(x,[{opacity:0,transform:`rotate(-1.4deg) translateX(${n?60:-60}px)`},{opacity:1,transform:'rotate(-1.4deg)'}],{sp:SPs,dl:i*70}));if(n)selG(0);else{cur=-1;sel(1)}},200)}
 const back=()=>{$$('.q8-mn,.q8-gm,.q7-top',R).forEach((x,i)=>{x.getAnimations().forEach(a=>a.cancel());an(x,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:i*60})})};
 function pop(el){an(el,[{scale:'1'},{scale:'.95'},{scale:'1.05'},{scale:'1'}],{d:320,e:EO});const r=rel(el,R);fx.burst(r.x+50,r.y+r.h/2,{n:18,c:['#FFD23F','#fff'],v:3.4,g:0,s:2,l:30})}
 const hub=el=>g11Over(R,ctx,(pv,cc,cl)=>q9Hub(pv,cc,{onBack:cl}),null,el);
 function enter(j,el){touched=true;sel(j);pop(el);
  ctx.t(()=>{if(j===0){$$('.q8-mn,.q7-top',R).forEach((x,i)=>an(x,[{opacity:1},{opacity:0,transform:'translateY(18px)'}],{d:220,dl:i*30,e:EI,f:'forwards'}));m7Play(R,ctx,el,back)}
   else if(j===1){if(DL)hub(el);else level(1)}else if(j===6)level(1);else if(j===2)w4Feed(R,ctx,0,el);
   else toast(R,j===3?'🔁 Повторение: 17 фраз, по 3 за раз':'⚔️ Дуэль по сцене — ссылкой другу в Telegram')},j===1&&!DL?120:j===6?120:j<3?300:80)}
 $$('.q7m-i',M).forEach(b=>{ctx.on(b,'pointerenter',e=>{if(e.pointerType==='mouse'){touched=true;sel(+b.dataset.j)}});ctx.on(b,'click',()=>enter(+b.dataset.j,b))});
 $$('.q7m-mi button',M).forEach(b=>{ctx.on(b,'pointerenter',e=>{if(e.pointerType==='mouse'&&b.dataset.j==='3'){touched=true;sel(3)}});ctx.on(b,'click',()=>enter(+b.dataset.j,b))});
 $$('.q7m-i',G).forEach(b=>{const i=+b.dataset.g;ctx.on(b,'pointerenter',e=>{if(e.pointerType==='mouse')selG(i)});
  ctx.on(b,'click',()=>{selG(i);pop(b);if(Q9G[i].on)ctx.t(()=>hub(b),260);else toast(R,`🎮 ${Q9G[i].n} — скоро, появится здесь`)})});
 ctx.on($('.q8-bk',R),'click',()=>level(0));
 ctx.on(R,'pointerdown',()=>{touched=true},{capture:true});
 $$('.q7m-i',M).forEach((b,i)=>an(b,[{opacity:0,transform:'rotate(-1.4deg) translateX(-60px)'},{opacity:1,transform:'rotate(-1.4deg)'}],{sp:SPs,dl:160+i*90}));
 an($('.q7m-mi',M),[{opacity:0},{opacity:1}],{d:500,dl:520});
 let seen=false;try{seen=localStorage.getItem('q9-why-'+mode)==='1'}catch(e){}
 const W=$('.q8-why',R);if(!seen)ctx.t(()=>{W.hidden=false;an(W,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{sp:SPs})},900);
 ctx.on($('.q8-ok',R),'click',()=>{try{localStorage.setItem('q9-why-'+mode,'1')}catch(e){}an(W,[{opacity:1},{opacity:0}],{d:200,f:'forwards'});ctx.t(()=>W.hidden=true,200)});
 let k=0;const cyc=()=>{if(touched||lv)return;k=(k+1)%3;sel(k);ctx.t(cyc,k===0?4200:2700)};ctx.t(cyc,3800)}

/* ---------- 2. Deadlock внутри v2: без плитки комиксов, Versus внизу ---------- */
// советы против героев — из описаний способностей в файлах игры (SteamDatabase/GameTracking-Deadlock, citadel_heroes_english):
// слова способности оставляем по-английски — заодно учишь, как их зовут в игре
const Q9MU=[
 {k:'violet',n:'Вайолет',c:'#C86BD8',ab:'Still Life',abr:'натюрморт',t:'Бьёт и в конце станит, <b>пока смотрит на тебя</b>. Забеги за стену — набросок не дорисуется.',src:'«as long as you are looking at them»'},
 {k:'warden',n:'Уорден',c:'#5B8DEF',ab:'Lock Down',abr:'запереть',t:'Повесил проклятие — <b>сразу уходи с места</b>. Не сдвинулся вовремя — урон и не двигаешься.',src:'«if they don\'t move away… within the escape time»'},
 {k:'geist',n:'Леди Гайст',c:'#E0566B',ab:'Life Drain',abr:'высасывание жизни',t:'Тянет твоё здоровье, <b>пока видит и ты рядом</b>. Зайди за угол или отбеги — связь рвётся.',src:'«must be in line of sight and within max range»'},
 {k:'vindicta',n:'Виндикта',c:'#7FB069',ab:'Stake',abr:'кол',t:'Цепь держит у места, <b>где упал кол</b>. Не стой рядом с ним — дальше длины цепи не уйдёшь.',src:'«tethers enemies to the location where the stake lands»'}];
const Q9RD=[
 {k:'violet',t:'История Вайолет',s:'2 мин · 5 слов · с переводом',en:'Violet <u data-r="переехала">immigrated</u> to The Cursed Apple when she was 12, and while there was a certain amount of <u data-r="культурный шок">culture shock</u>, she quickly fell in love with the <u data-r="жизнь, яркость">vibrance</u> of the city. First, a <u data-r="полная стипендия">full ride</u> to art school… However Violet has not been able shake her <u data-r="страх, что жизнь — впустую">existential dread</u> of dying a failure.',
  ru:'Вайолет переехала в Проклятое Яблоко в 12 лет, и, хоть без культурного шока не обошлось, быстро влюбилась в жизнь этого города. Сначала — полная стипендия в художественной школе… Но Вайолет так и не избавилась от страха умереть неудачницей.'},
 {k:'patch',t:'Разбор патча 26.10',s:'что поменяли · 8 слов из патча',go:'patch'},
 {k:'venator',t:'Кто такой Венатор',s:'1 мин · слова: stir, call on, show your face',go:'hero'}];
const Q9LS=[
 {t:'Венатор — все реплики подряд',s:'4 мин · как подкаст · по-английски с субтитрами',k:'venator'},
 {t:'Севен ↔ Венатор — разговор из игры',s:'1 мин · настоящий диалог',k:'seven'},
 {t:'Дормен — отель «Баронесса»',s:'2 мин · реплики гостям',k:'doorman'}];
const q9Mono=(h,cl)=>`<i class="q9-mono${cl?' '+cl:''}" style="--c:${h.c}">${h.n[0]}</i>`;
function q9Hub(R,ctx,o){o=o||{};R.className='scr y5 y5hub q9hub';
 const nb=o.newbie!==false;
 R.innerHTML=`${SB(0)}<div class="y5sc">
  <div class="y5hh">${cns12()}<i class="sh"></i><button class="y5bk" aria-label="Назад">${ic('back')}</button>
   <div class="tx">${neon11('DEADLOCK','hh')}<span>Голоса героев · по-английски</span></div></div>
  <div class="y5now">
   <button data-go="check"><span class="pr">${hic12('venator','y5s')}${hic12('rat','y5s')}</span><span class="t"><b>Глава ждёт проверки</b><small>«Проповедь свинца» · 3 вопроса</small></span><em>Проверить</em></button></div>
  <div class="y5sec q9-sec"><b>Герои</b><small>нажми — его комиксы, фразы, Versus</small></div>
  ${nb?`<div class="q9-coach" hidden><b>Начни с героя</b><span>У каждого героя внутри — его комиксы (разговоры из игры), интересные фразы и Versus за него. Венатор — первый.</span><button class="q9-cok">Понятно</button></div>`:''}
  <div class="y5hg"></div>
  <div class="y5tiles q9-tiles">
   <button data-go="radar" class="tl rd"><span class="art"><canvas class="y5mini"></canvas></span><span class="lb"><b>Радар</b><small>2 перехвата</small></span><i class="bd">2</i></button>
   <button data-go="read" class="tl q9-rd"><span class="art"><i class="pg"></i><i class="pg b"></i><span class="ln">${'<i></i>'.repeat(6)}</span></span><span class="lb"><b>Почитать</b><small>истории · патчи</small></span></button>
   <button data-go="listen" class="tl ln q9-ls"><span class="art"><video muted loop playsinline data-hv="hv_rat3" poster="${IMG.hv_rat3}"></video><span class="eq">${eqBars(12)}</span></span><span class="lb"><b>Послушать</b><small>как подкаст</small></span></button></div>
  <div class="y5sec q9-sec"><b>Против кого стоишь</b><small>коротко — как не попасться</small></div>
  <div class="q9-mu">${Q9MU.map((h,i)=>`<button data-mu="${i}">${q9Mono(h)}<span class="tx"><small>${h.n} · <em>${h.ab}</em> — ${h.abr}</small><span>${h.t}</span></span></button>`).join('')}</div>
  <p class="q9-mux">Все герои — в Restless: на линии против кого, что купить, как играть. ${ic('chev')}</p>
  <button class="q9-vs" data-go="vs"><span class="pr">${hic12('venator','y5s')}<b>VS</b>${hic12('rat','y5s')}</span><span class="t"><b>Versus с другом</b><small>3 раунда · Боря звал 2 ч назад</small></span><em>Позвать</em></button>
 </div><i class="hb"></i>`;
 const c=ctx;playV12(R);cnsOn12(c,R);const ne=$('.g11-ne.hh',R);neonOn11(c,ne,260);neonLife11(c,ne);y5sonarMini(c,$('.y5mini',R));
 const G=y5grid(R,c,{size:o.size||'s'});
 $$('.y5now>button,.q9-sec,.y5tiles>.tl,.q9-mu>button,.q9-vs',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:380+Math.min(i,10)*55}));
 // новичка ведём за руку: первый раз — подсветка Венатора и одна подсказка, потом не показываем
 let seen=false;try{seen=localStorage.getItem('q9-coach')==='1'}catch(e){}
 const CO=$('.q9-coach',R),ven=()=>$('.y5hc[data-k="venator"]',R);
 if(CO&&!seen)c.t(()=>{CO.hidden=false;an(CO,[{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{sp:SPs});const v=ven();if(v)v.classList.add('q9-glow')},1300);
 const coachOff=()=>{if(!CO||CO.hidden)return;try{localStorage.setItem('q9-coach','1')}catch(e){}an(CO,[{opacity:1},{opacity:0}],{d:200,f:'forwards'});c.t(()=>CO.hidden=true,200);const v=ven();if(v)v.classList.remove('q9-glow')};
 let touched=false;c.on(R,'pointerdown',()=>{touched=true},{capture:true});
 c.on(R,'click',e=>{const t=e.target;if(t.closest('.y5bk')){o.onBack?o.onBack():toast(R,'← назад в меню');return}
  if(t.closest('.q9-cok')){coachOff();return}
  const s=t.closest('[data-s]');if(s){G.resort(s.dataset.s);return}
  if(t.closest('.y5vw')){y5viewSheet(R,c,G);return}
  const h=t.closest('.y5hc');if(h){coachOff();an(h,[{transform:'scale(.95)'},{transform:'none'}],{sp:SPb});if(!H12[h.dataset.k].v){toast(R,`${H12[h.dataset.k].ru}: живой портрет ещё делаем`);return}g11Over(R,c,(pv,cc,cl)=>y5Hero(pv,cc,h.dataset.k,{onBack:cl}),null,h);return}
  const m=t.closest('[data-mu]');if(m){q9Tip(R,c,Q9MU[+m.dataset.mu],m);return}
  if(t.closest('.q9-mux')){toast(R,'🧭 Restless — сайт и мод: 1f8t8graf4-ai.github.io/dota-/restless');return}
  const g=t.closest('[data-go]');if(!g)return;an(g,[{transform:'scale(.96)'},{transform:'none'}],{sp:SPb});const go=g.dataset.go;
  if(go==='radar')g11Over(R,c,(pv,cc,cl)=>y5RadarA(pv,cc,{onBack:cl}),null,g);
  else if(go==='vs')g11Over(R,c,(pv,cc,cl)=>y5Vs(pv,cc,{onBack:cl}),null,g);
  else if(go==='listen')q9Listen(R,c,g);
  else if(go==='read')q9Read(R,c,g);
  else if(go==='check')g11Over(R,c,(pv,cc,cl)=>comic12(pv,cc,'who',{start:'check',onBack:cl}),null,g)});
 if(o.demo)c.t(()=>{if(touched)return;$('.y5sc',R).scrollTo({top:520,behavior:'smooth'});c.t(()=>{if(!touched)q9Tip(R,c,Q9MU[0],$('[data-mu="0"]',R))},1700)},4200);
 return G}

/* шторка совета: способность по-английски, что делать, откуда взято */
function q9Tip(R,ctx,h,from){let s=$('.q9-tip',R);if(s)s.remove();s=document.createElement('div');s.className='q9-tip';
 s.innerHTML=`<i class="dm"></i><div class="sh"><i class="gr"></i><div class="hd">${q9Mono(h,'big')}<div><small>НА ЛИНИИ ПРОТИВ</small><b>${h.n}</b></div></div>
  <div class="ab"><b>${h.ab}</b><span>«${h.abr}»</span></div><p>${h.t}</p>
  <div class="wd"><small>СЛОВА</small>${h.ab.split(' ').map(w=>`<span><b>${w.toLowerCase()}</b></span>`).join('')}<span class="tr">${h.abr}</span></div>
  <p class="src">Из описания способности в игре: ${h.src}</p>
  <button class="ok">Понятно</button></div>`;
 R.appendChild(s);const sh=$('.sh',s);an(sh,[{transform:'translateY(100%)'},{transform:'none'}],{sp:SPs});an($('.dm',s),[{opacity:0},{opacity:1}],{d:220});
 const close=()=>{const z=an(sh,[{transform:'none'},{transform:'translateY(100%)'}],{d:220,e:EI,f:'forwards'});an($('.dm',s),[{opacity:1},{opacity:0}],{d:220,f:'forwards'});const f=()=>s.remove();if(z)z.onfinish=f;else f()};
 ctx.on($('.dm',s),'click',close);ctx.on($('.ok',s),'click',close)}

/* «Почитать»: список; история героя — по-английски, слова нажимаются, перевод — под пылью */
function q9Read(R,ctx,from){g11Over(R,ctx,(pv,c,cl)=>{pv.className='scr y5 q9pg';
 pv.innerHTML=`${SB(0)}<div class="y5sc"><div class="y5top"><button class="y5bk" aria-label="Назад">${ic('back')}</button><b>Почитать</b><span>${Q9RD.length}</span></div>
  <div class="q9-list">${Q9RD.map((r,i)=>`<button data-i="${i}">${r.k==='patch'?`<i class="q9-mono" style="--c:#FFD23F">P</i>`:hic12(r.k==='violet'?'venator':r.k,'y5s')}<span class="t"><b>${r.t}</b><small>${r.s}</small></span>${ic('chev')}</button>`).join('')}</div>
  <article class="q9-art" hidden></article></div><i class="hb"></i>`;
 const A=$('.q9-art',pv);let touched=false;c.on(pv,'pointerdown',()=>{touched=true},{capture:true});
 function open(i){const r=Q9RD[i];if(!r.en){toast(pv,r.go==='patch'?'📰 Разбор патча — как пост в канале (вариант «Канал»)':'🎙 Венатор — его карточка в «Героях»');return}
  A.hidden=false;A.innerHTML=`<h3>${r.t}</h3><p class="en">${r.en}</p><p class="q9-hint">Нажми на подчёркнутое слово — перевод. Весь перевод — ниже, под пылью.</p><p class="ru"><span class="dust">${r.ru}</span></p>`;
  an(A,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{sp:SPs});$('.y5sc',pv).scrollTo({top:A.offsetTop-60,behavior:'smooth'})}
 c.on(pv,'click',e=>{const t=e.target;if(t.closest('.y5bk')){cl();return}
  const u=t.closest('u[data-r]');if(u){$$('u.on',A).forEach(x=>x!==u&&x.classList.remove('on'));u.classList.toggle('on');return}
  const d=t.closest('.dust');if(d){d.classList.add('open');return}
  const b=t.closest('.q9-list>button');if(b)open(+b.dataset.i)});
 $$('.q9-list>button',pv).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:120+i*60}));
 c.t(()=>{if(!touched){open(0);c.t(()=>{if(!touched){const u=$$('u[data-r]',A)[2];if(u)u.classList.add('on')}},1400)}},1500)},null,from)}

/* «Послушать»: подборки — нажал, и пошли реплики подряд (экран «Реплики» из v15) */
function q9Listen(R,ctx,from){g11Over(R,ctx,(pv,c,cl)=>{pv.className='scr y5 q9pg';
 pv.innerHTML=`${SB(0)}<div class="y5sc"><div class="y5top"><button class="y5bk" aria-label="Назад">${ic('back')}</button><b>Послушать</b><span>${Q9LS.length}</span></div>
  <div class="q9-list">${Q9LS.map((r,i)=>`<button data-i="${i}">${hic12(r.k,'y5s')}<span class="t"><b>${r.t}</b><small>${r.s}</small></span><em>${ic('play')}</em></button>`).join('')}</div>
  <p class="q9-hint">Как подкаст: можно убрать телефон — реплики идут сами, перевод на экране.</p></div><i class="hb"></i>`;
 c.on(pv,'click',e=>{const t=e.target;if(t.closest('.y5bk')){cl();return}const b=t.closest('.q9-list>button');if(b)g11Over(pv,c,(p2,c2,cl2)=>y5Lines(p2,c2,{onBack:cl2}),null,b)});
 $$('.q9-list>button',pv).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:120+i*60}))},null,from)}

V.push({g:'h19',id:'h19d',n:'Меню · «Deadlock» — последняя игра',
 idea:'Твоя мысль: вместо непонятного «Играть» — сразу игра, в которую ты играл последним: «DEADLOCK · радар: 2 перехвата». Одно нажатие — и ты внутри. Остальные игры — мелко внизу «Все игры» (тем же шрифтом выезжает список: Deadlock, Dota 2 и Overwatch — «скоро»). Когда начнёшь играть в другую — пункт сам станет ей.',
 moves:['наведение мышью на «Deadlock» — фон меню становится Deadlock (живой Венатор)','«Все игры» → пункты уезжают влево, выезжает список игр; «‹ Назад» — обратно','первый раз — одна подсказка «что тут что», «Понятно» — и больше её нет'],
 from:'Твой ответ на v18: «„Играть“ сочно, но непонятно, что значит; Deadlock выглядел неплохо — как ласт игра, но не уверен».',
 minus:'Пока игра одна, «Все игры» почти пустые. Новичку, который ещё ни во что не играл, пункт покажет Deadlock — как самую живую.',
 mount(R,ctx){q9Menu(R,ctx,'dl')}});
V.push({g:'h19',id:'h19g',n:'Меню · «Игры» — со значками игр',
 idea:'Второй способ: пункт называется просто «Игры», а под ним — значки игр (DL горит, D2 и OW — серые «скоро») и строка «Deadlock · скоро Dota 2 и Overwatch». Сразу понятно, что внутри список игр. Нажал — тем же шрифтом список.',
 moves:['значки игр под пунктом — горит та, что есть','«Игры» → список игр тем же шрифтом','у игры «скоро» — шум телевизора вместо фона'],
 from:'Твой вопрос: «как-то по-другому назвать можно — не совсем понятно, что значит „играть“».',
 minus:'Два нажатия до Deadlock (как в v18). Зато ничего не надо объяснять.',
 mount(R,ctx){q9Menu(R,ctx,'games')}});
V.push({g:'h19',id:'h19h',n:'Deadlock внутри — без комиксов, Versus внизу',
 idea:'Как в v15, но по твоим словам: плитки «Комиксы» больше нет — комиксы в карточке героя (нажал на Венатора — его разговоры, фразы, Versus за него). Новичка ведём за руку: первый раз Венатор подсвечен и одна подсказка «Начни с героя». Ниже — «Радар · Почитать · Послушать», потом «Против кого стоишь» (коротко, как не попасться: Вайолет — забеги за стену; это твой совет, он верный — в описании её способности «пока смотрит на тебя»). Versus с другом — в самом низу одной строкой.',
 moves:['первый раз — Венатор светится, подсказка «Начни с героя» → «Понятно» или тап по любому герою, и её нет','«Против кого стоишь» → шторка: способность по-английски, перевод, что делать, откуда взято','«Почитать» → история Вайолет по-английски, слова нажимаются, весь перевод — под пылью','«Послушать» → подборки: реплики подряд, как подкаст'],
 from:'Твои слова к v18: «убери комиксы, они должны быть в героях, хотя тут тоже за ручку вести нужно; Versus с другом — куда-то вниз; что почитать / послушать — сюда же» и совет про художницу.',
 minus:'Советы есть пока к 4 героям — остальных Зетка соберёт из описаний способностей. Значки героев в советах — буквы, иконки из игры вставим.',
 mount(R,ctx){q9Hub(R,ctx,{demo:true})}});
