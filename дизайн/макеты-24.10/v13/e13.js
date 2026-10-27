/* --- Реплики «как в TikTok» v13 (Андрей: «должна быть ульта со звуком и звуком ульты и т. д.»):
   у каждой реплики — свой момент: ульта (заряд → удар → голос), выход на бой (звон клинка), убийство (аккорд).
   Звуки событий в макете — синтез; в приложении — настоящие звуки абилок из игры (их собирает Зетка). --- */
const TT13={rat:[{a:'rk-king-here',en:'The rat king is here!',ru:'Крысиный король здесь!',tag:'Ульта',fx:'ult',kw:['king','король']},
  {a:'rk-priest-vs-king',en:"What's a priest gonna do to a king?!",ru:'И что поп сделает королю?!',tag:'Выход на бой',fx:'enter',kw:['gonna','= going to, собирается']},
  {a:'rk-took-down',en:'Took down the Venatah!',ru:'Уложил Венатора!',tag:'Убил Венатора',fx:'kill',kw:['took down','уложил, завалил']},
  {a:'rat-king-18',en:"Who's exterminating who now!",ru:'Ну и кто теперь кого травит?!',tag:'Убийство · игра слов',fx:'kill',kw:['exterminating','травить (крыс, тараканов)']}],
 venator:[{a:'ven-not-merciful',en:'The Lord is merciful... I am not.',ru:'Господь милосерден… а вот я — нет.',tag:'Ульта',fx:'ult',kw:['merciful','милосердный']},
  {a:'ven-evil-stirs',en:'Evil stirs in New York... and so the Vatican has called on me.',ru:'В Нью-Йорке пробуждается зло… и Ватикан призвал меня.',tag:'Выход на бой',fx:'enter',kw:['called on','призвал, позвал на помощь']},
  {a:'ven-evil-dies',en:'Evil dies today.',ru:'Зло сегодня умрёт.',tag:'Убийство',fx:'kill',kw:['evil','зло']}]};
const TTL13={ult:'УЛЬТА',enter:'ВЫХОД',kill:'УБИЛ'};
function tt13(R,ctx,o){o=o||{};let k=o.hero==='venator'?'venator':'rat',i=0,touched=false,busy=false;R.className='scr v8 tt13';
 S13.preload([...TT13.rat,...TT13.venator].map(x=>x.a));
 R.innerHTML=`${SB(0)}<div class="tt13-bg"></div><i class="tt13-vg"></i><i class="tt13-dk"></i>
  <div class="tt13-hd"><button class="bk">${ic('back')}</button><span><small>РЕПЛИКИ ГЕРОЕВ · КАК В TIKTOK</small><b class="nm"></b></span></div>
  <div class="tt13-tags"></div>
  <div class="tt13-stage"><span class="ring"><i class="r1"></i><i class="r2"></i></span><span class="fr"><video muted loop playsinline></video><i class="gl"></i></span><i class="wave"></i><b class="stamp"></b></div>
  <div class="tt13-cap"></div><div class="tt13-ru"></div><button class="tt13-kw" hidden></button>
  <div class="tt13-chips"></div>
  <div class="tt13-ft"><button class="pv">${ic('back')}</button><button class="pl">${ic('play')}<span>Ещё раз</span></button><button class="sv">${ic('star')}</button><button class="nx">${ic('chev')}</button></div>
  <i class="tt13-fl"></i><canvas class="fx"></canvas><i class="hb"></i>`;
 const stg=$('.tt13-stage',R),cap=$('.tt13-cap',R),ru=$('.tt13-ru',R),kw=$('.tt13-kw',R),fx=FX(ctx,$('.fx',R)),vid=$('.fr video',R);
 ctx.on(R,'pointerdown',()=>{touched=true},{capture:true});
 const L=()=>TT13[k];
 function paint(){const h=H12[k],x=L()[i];R.style.setProperty('--ac',h.ac);$('.tt13-bg',R).innerHTML=loc13(k);$('.tt13-hd .nm',R).textContent=h.n;
  if(vid.dataset.hv!==h.v){vid.dataset.hv=h.v;vid.poster=IMG[h.v];vid.style.objectPosition=h.pos;vid.src=vurl(h.v);const p=vid.play();if(p&&p.catch)p.catch(()=>{})}
  $('.tt13-tags',R).innerHTML=L().map((y,j)=>`<button class="${j===i?'on':''} t-${y.fx}" data-i="${j}">${y.tag}</button>`).join('');
  $('.tt13-chips',R).innerHTML=`${['rat','venator'].map(q=>`<button class="${q===k?'on':''}" data-h="${q}">${hic12(q)}${H12[q].n}</button>`).join('')}<button class="lk">${hic12('doorman')}Doorman</button><button class="lk">${hic12('seven')}Seven</button>`;
  cap.innerHTML='';ru.textContent='';kw.hidden=true;$('.stamp',stg).textContent='';stg.className='tt13-stage'}
 // момент реплики: ульта — заряд кольцом, удар, вспышка, тряска; выход — блик по рамке; убийство — красный удар
 async function play(){if(busy)return;busy=true;const x=L()[i],h=H12[k],W=x.en.split(' '),d=(DUR11[AU11[x.a]||x.a]||2.4)*1000;cap.innerHTML='';ru.textContent='';kw.hidden=true;stg.classList.add('go',x.fx);
  const st=$('.stamp',stg);st.textContent=TTL13[x.fx];const dk=$('.tt13-dk',R);
  if(x.fx==='ult'){an(dk,[{opacity:0},{opacity:.72}],{d:500,f:'forwards'});an($('.ring',stg),[{opacity:0,transform:'scale(.55) rotate(-90deg)'},{opacity:1,transform:'scale(1) rotate(0deg)'}],{d:860,e:'cubic-bezier(.5,0,.9,.6)'});
   an($('.fr',stg),[{transform:'scale(1)'},{transform:'scale(.94)'}],{d:860,e:'cubic-bezier(.5,0,.9,.6)',f:'forwards'})}
  else if(x.fx==='enter'){an($('.gl',stg),[{transform:'translateX(-130%) skewX(-18deg)'},{transform:'translateX(130%) skewX(-18deg)'}],{d:700,e:EIO})}
  else{an(dk,[{opacity:0},{opacity:.5,offset:.2},{opacity:.25}],{d:700,f:'forwards'})}
  const gap=S13.live()?S13.sfx(x.fx):(x.fx==='ult'?900:300);await ctx.wait(gap||300);if(!ctx.alive)return;
  // удар
  const r=rel($('.fr',stg),R);an($('.tt13-fl',R),[{opacity:0},{opacity:x.fx==='kill'?.4:.6,offset:.1},{opacity:0}],{d:520});shake($('.fr',stg),x.fx==='ult'?9:5,360);
  an($('.fr',stg),[{transform:'scale(1.08)'},{transform:'scale(1)'}],{sp:SPb,f:'forwards'});an($('.wave',stg),[{opacity:.9,transform:'translate(-50%,-50%) scale(.3)'},{opacity:0,transform:'translate(-50%,-50%) scale(2.6)'}],{d:700,e:EO});
  an(st,[{opacity:0,transform:'translate(-50%,-50%) scale(2.6) rotate(-14deg)'},{opacity:1,transform:'translate(-50%,-50%) scale(1) rotate(-9deg)',offset:.25},{opacity:1,transform:'translate(-50%,-50%) scale(1.02) rotate(-9deg)',offset:.75},{opacity:0,transform:'translate(-50%,-50%) scale(1.1) rotate(-9deg)'}],{d:1300,e:'linear'});
  fx.burst(r.x+r.w/2,r.y+r.h*.5,{n:x.fx==='ult'?70:40,c:x.fx==='kill'?['#FF4D5E','#fff','#7a0b16']:[h.ac,'#fff','#F6D488'],v:x.fx==='ult'?9:6,g:.06,s:2.6,l:50});
  an(dk,[{opacity:.72},{opacity:.2}],{d:900,f:'forwards',dl:300});
  stg.classList.add('say');say13(ctx,x.a,{echo:.3,end(){stg.classList.remove('say')}});
  // слова по одному, как в роликах
  const len=W.reduce((s,w)=>s+w.length+2,0);let t=120;W.forEach((w,j)=>{const ms=d*(w.length+2)/len;ctx.t(()=>{cap.innerHTML=`<span class="cw">${w}</span>`;an($('.cw',cap),[{transform:'scale(.55) rotate(-5deg)',opacity:0},{transform:'none',opacity:1}],{sp:SPb})},t);t+=ms});
  ctx.t(()=>{cap.innerHTML=`<span class="all">${x.en.replace(new RegExp('('+x.kw[0]+')','i'),'<u>$1</u>')}</span>`;ru.textContent=x.ru;an(ru,[{opacity:0},{opacity:1}],{d:400});
   kw.hidden=false;kw.innerHTML=`<b>${x.kw[0]}</b> — ${x.kw[1]}`;an(kw,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{sp:SPs});stg.classList.remove('go','ult','enter','kill');busy=false},t+260)}
 ctx.on($('.tt13-ft',R),'click',e=>{const b=e.target.closest('button');if(!b)return;an(b,[{transform:'scale(.9)'},{transform:'none'}],{sp:SPb});
  if(b.classList.contains('pl')){busy=false;play();return}if(b.classList.contains('sv')){b.classList.toggle('on');toast(R,b.classList.contains('on')?'В «Мои фразы» — уйдёт в повторение':'Убрал');return}
  const n=b.classList.contains('nx')?1:-1;i+=n;if(i<0||i>=L().length){k=k==='rat'?'venator':'rat';i=n>0?0:L().length-1}busy=false;paint();ctx.t(play,450)});
 ctx.on($('.tt13-tags',R),'click',e=>{const b=e.target.closest('[data-i]');if(!b)return;i=+b.dataset.i;busy=false;paint();ctx.t(play,350)});
 ctx.on($('.tt13-chips',R),'click',e=>{const b=e.target.closest('button');if(!b)return;if(b.classList.contains('lk')){toast(R,'Реплики этого героя ещё собирает Зетка');return}k=b.dataset.h;i=0;busy=false;paint();ctx.t(play,450)});
 ctx.on($('.tt13-hd .bk',R),'click',()=>{if(o.onBack)o.onBack();else toast(R,'← назад в Deadlock')});
 paint();ctx.t(play,900);
 const auto=()=>{if(touched)return;i++;if(i>=L().length){k=k==='rat'?'venator':'rat';i=0}busy=false;paint();ctx.t(play,400);ctx.t(auto,6800)};ctx.t(auto,7200)}

/* --- «Кто про кого» v13: говорит другой — меняется и место, как панель в комиксе (Андрей: «локации же будут меняться? про смену — как в комиксах»).
   Рисовать локации не надо: фон берём с живой карточки героя (это делает Зетка). --- */
const AB13=[{k:'rat',to:'venator',a:'rk-priest-vs-king',en:"What's a priest gonna do to a king?!",ru:'И что поп сделает королю?!',w:'Туннели'},
 {k:'venator',to:'rat',a:'ven-will-find',en:'I will find you.',ru:'Я тебя найду.',w:'Собор'},
 {k:'rat',to:'venator',a:'rk-took-down',en:'Took down the Venatah!',ru:'Уложил Венатора!',w:'Туннели'},
 {k:'venator',to:'rat',a:'ven-die-monster',en:'Die, monster!',ru:'Сдохни, тварь!',w:'Собор'}];
function ab13(R,ctx,o){o=o||{};let i=-1,touched=false;R.className='scr v8 ab13';S13.preload(AB13.map(x=>x.a));
 R.innerHTML=`${SB(0)}<div class="ab13-hd"><button class="bk">${ic('back')}</button><span><small>РЕПЛИКИ · КТО ПРО КОГО</small><b>Король и Венатор</b></span></div>
  <div class="ab13-pg"></div>
  <div class="ab13-cap"></div><div class="ab13-ru"></div>
  <p class="ab13-nt">${ic('comic13')}<span>Говорит другой — меняется и место, как панель в комиксе. Локации не рисуем: фон берём с живой карточки героя.</span></p>
  <div class="ab13-ft"><span class="dt13">${AB13.map(()=>'<i></i>').join('')}</span><button class="pl">${ic('play')}<span>Ещё раз</span></button><button class="nx">${ic('chev')}</button></div><canvas class="fx"></canvas><i class="hb"></i>`;
 const pg=$('.ab13-pg',R),cap=$('.ab13-cap',R),ru=$('.ab13-ru',R);ctx.on(R,'pointerdown',()=>{touched=true},{capture:true});
 function panel(x,dir){const h=H12[x.k],t=H12[x.to];const p=document.createElement('div');p.className='ab13-pn';p.innerHTML=`${loc13(x.k)}<i class="vg"></i>
   <span class="cb">${x.w.toUpperCase()} · ${x.k==='rat'?'КОРОЛЬ':'ВЕНАТОР'} ПРО ${x.to==='rat'?'КОРОЛЯ':'ВЕНАТОРА'}</span>
   <span class="ab13-sp"><video muted loop playsinline data-hv="${h.v}" poster="${IMG[h.v]}" style="object-position:${h.pos}"></video></span>
   <span class="to"><span class="c"><video muted loop playsinline data-hv="${t.v}" poster="${IMG[t.v]}" style="object-position:${t.pos}"></video></span><small>про ${x.to==='rat'?'Короля':'Венатора'}</small></span>`;
  pg.appendChild(p);playV12(p);const old=$$('.ab13-pn',pg).filter(q=>q!==p);
  // смена панели: новая заезжает косым срезом, старая уходит назад
  an(p,[{clipPath:dir>0?'polygon(100% 0,140% 0,120% 100%,80% 100%)':'polygon(-40% 0,0 0,20% 100%,-20% 100%)'},{clipPath:'polygon(-20% 0,140% 0,120% 100%,-40% 100%)'}],{d:620,e:EO});
  an($('.ab13-sp',p),[{transform:`translateX(${dir*40}px) scale(.9)`,opacity:0},{transform:'none',opacity:1}],{sp:SPs,dl:200});an($('.to',p),[{transform:'scale(.4)',opacity:0},{transform:'none',opacity:1}],{sp:SPb,dl:420});
  an($('.cb',p),[{transform:'translateY(-12px)',opacity:0},{transform:'none',opacity:1}],{sp:SPs,dl:300});
  old.forEach(q=>{const z=an(q,[{transform:'none',opacity:1},{transform:`translateX(${-dir*30}px) scale(.94)`,opacity:.0}],{d:620,e:EO,f:'forwards'});if(z)z.onfinish=()=>q.remove();else q.remove()})}
 function show(n){if(n>=AB13.length)n=0;const dir=n>i?1:-1;i=n;const x=AB13[n];panel(x,i%2?-1:1);
  $$('.ab13-ft .dt13 i',R).forEach((d,j)=>d.classList.toggle('on',j===n));cap.innerHTML='';ru.textContent='';
  ctx.t(()=>{const W=x.en.split(' '),d=(DUR11[x.a]||2.4)*1000,len=W.reduce((s,w)=>s+w.length+2,0);let t=0;say13(ctx,x.a,{echo:.28});
   W.forEach(w=>{const ms=d*(w.length+2)/len;ctx.t(()=>{cap.innerHTML=`<span class="cw">${w}</span>`;an($('.cw',cap),[{transform:'scale(.6)',opacity:0},{transform:'none',opacity:1}],{sp:SPb})},t);t+=ms});
   ctx.t(()=>{cap.innerHTML=`<span class="all">${x.en}</span>`;ru.textContent=x.ru;an(ru,[{opacity:0},{opacity:1}],{d:400})},t+200)},650)}
 ctx.on($('.ab13-ft',R),'click',e=>{const b=e.target.closest('button');if(!b)return;an(b,[{transform:'scale(.9)'},{transform:'none'}],{sp:SPb});if(b.classList.contains('nx'))show(i+1);else show(i)});
 ctx.on(pg,'click',()=>show(i+1));
 ctx.on($('.ab13-hd .bk',R),'click',()=>{if(o.onBack)o.onBack();else toast(R,'← назад в Deadlock')});
 ctx.t(()=>show(0),500);const auto=()=>{if(touched)return;show(i+1);ctx.t(auto,5200)};ctx.t(auto,5600)}

/* --- Звук реплики v13 (Андрей: «10 из 10, просто улучши»): добавил регуляторы фона и эха, по три реплики на героя, звук события перед каждой.
   В Versus фона нет — только голос и лёгкое эхо (там шум мешал). --- */
function sd13(R,ctx){R.className='scr v8 sd12 sd13';let k='venator',j=0,bv=.5,ec=.3,wet=true,pl=false;
 const L=()=>TT13[k].slice(0,3);S13.preload([...TT13.rat,...TT13.venator].map(x=>x.a));
 R.innerHTML=`${SB(0)}<div class="sd12-hd"><b>Звук реплик</b><small>голос + место + звук события</small></div>
  <div class="sd12-sg"><button class="on" data-k="venator">${hic12('venator')}Венатор · собор</button><button data-k="rat">${hic12('rat')}Король · туннели</button></div>
  <div class="sd13-ls"></div>
  <div class="sd13-cd"></div>
  <div class="sd13-sl"><label><span><b>Фон места</b><small class="bvt"></small></span><input type="range" min="0" max="100" value="50" class="bv"></label>
   <label><span><b>Эхо места</b><small class="ect"></small></span><input type="range" min="0" max="100" value="60" class="ec"></label></div>
  <div class="sd13-ab"><button class="dry">${ic('play')}Сухо</button><button class="wet pri">${ic('play')}С сопровождением</button></div>
  <p class="sd12-nt">Где будет: реплики героев, комиксы, «кто про кого», ролики для TikTok. В Versus — без фона: голос и лёгкое эхо. Звуки событий в макете — синтез, в приложении — из игры.</p><i class="hb"></i>`;
 const cd=$('.sd13-cd',R),bvt=$('.bvt',R),ect=$('.ect',R);
 const lbl=()=>{bvt.textContent=bv<.02?'выкл':bv<.35?'еле слышно':bv<.7?'тихо, под голосом':'заметно';ect.textContent=ec<.05?'сухо, как с вики':ec<.35?'чуть-чуть':ec<.65?'как в комнате':'как в соборе'};lbl();
 function paint(){const h=H12[k];$('.sd13-ls',R).innerHTML=L().map((x,n)=>`<button class="${n===j?'on':''}" data-j="${n}"><i class="t-${x.fx}">${x.tag}</i><span>${x.en}</span></button>`).join('');
  const x=L()[j];cd.innerHTML=`<span class="fr"><video muted loop playsinline data-hv="${h.v}" poster="${IMG[h.v]}" style="object-position:${h.pos}"></video></span><span class="tx"><b>${x.en}</b><small>${x.ru}</small><span class="eq">${eqBars(16)}</span></span>`;playV12(cd)}
 paint();$$('.sd13-ls button,.sd13-sl label,.sd13-ab button',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:100+i*50}));
 ctx.on($('.sd12-sg',R),'click',e=>{const b=e.target.closest('button');if(!b)return;k=b.dataset.k;j=0;$$('.sd12-sg button',R).forEach(x=>x.classList.toggle('on',x===b));S13.stop();paint()});
 ctx.on($('.sd13-ls',R),'click',e=>{const b=e.target.closest('[data-j]');if(!b)return;j=+b.dataset.j;paint();go(wet)});
 ctx.on($('.bv',R),'input',e=>{bv=e.target.value/100;lbl();S13.bedVol(bv)});ctx.on($('.ec',R),'input',e=>{ec=e.target.value/100*.5;lbl()});
 function go(w){wet=w;const x=L()[j];S13.stopLine();R.classList.add('pl');R.classList.toggle('dry',!w);cd.classList.add('say');
  if(w)S13.bed(k==='rat'?'sewer':'cathedral',bv);else S13.bedOff();
  ctx.t(()=>say13(ctx,x.a,{echo:w?ec:0,sfx:w?x.fx:null,end(){cd.classList.remove('say');R.classList.remove('pl');if(!w)return;ctx.t(()=>{if(!R.classList.contains('pl'))S13.bedOff()},2600)}}),w?500:60)}
 ctx.on($('.dry',R),'click',()=>go(false));ctx.on($('.wet',R),'click',()=>go(true));ctx.add(()=>S13.stop())}
