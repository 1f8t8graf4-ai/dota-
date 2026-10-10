/* =====================================================================================
   13.7 — ВАРИАНТЫ СЛОВАРЯ (лаборатория, видит только админ)
   Грузится из app.js по требованию (dlLoad), когда админ выбрал вариант: Профиль → Админка → «Словарь — варианты».
   Все варианты работают на настоящих данных: фильм → сцена → карты эпизодов, карта открывается «в руку» (DL.inspect).
   «Демо» — часть карт как будто собрана (чтобы видеть все состояния: закрыта / новая / пора повторить / выучена).
   Вариант = DL.reg({id,n,from,d,sw, home(F), film(sh), scene(s), card(c,i), bg, after(st,lvl), trans}).
   Победивший вариант потом переносится в app.js/main.css как обычный словарь.
   ===================================================================================== */
(function(){'use strict';
const DL=window.DL={V:[],S:{show:null,sid:null},seen:{}};
const V=DL.V,S=DL.S;
DL.reg=o=>{V.push(o);return o;};
const RN=[null,'com','rare','epic','leg'],RT={com:'Обычная',rare:'Редкая',epic:'Эпическая',leg:'Легендарная'};
DL.RN=RN;DL.RT=RT;
const demo=DL.demo=()=>store.dlDemo!==false;
const hs=DL.hs=t=>{let h=2166136261;t=String(t);for(let i=0;i<t.length;i++)h=Math.imul(h^t.charCodeAt(i),16777619);return h>>>0;};
const th=DL.th=s=>DX_TH[s.theme]||'#F5C451';
const NN=i=>String(i+1).padStart(2,'0');
DL.art=(s,pi)=>`url('${assetUrl(scKey(s,NN(pi)+'-k.jpg'))}'),url('${assetUrl(scEpKey(s,pi,'jpg'))}')`;
DL.art2=(s,pi)=>`url('${assetUrl(scEpKey(s,pi,'jpg'))}'),url('${assetUrl(scKey(s,NN(pi)+'-k.jpg'))}')`;
DL.poster=s=>`url('${scCover(s,'poster.jpg')}'),url('${scCover(s,'cover.jpg')}')`;
DL.cover=s=>`url('${scCover(s,'cover.jpg')}')`;
DL.film=s=>dictFilm(s);
// состояние карты: настоящее или демо (детерминированно по id — каждый раз одинаково)
function cst(c){const {s,f}=c,rar=dcRar(s,f);
  if(!demo()){const P=scP(s.id),g=(P.got||{})[f.id],r=P.r[f.id];return {got:!!g,m:Math.min(3,P.m[f.id]||0),due:!!(g&&r&&r[1]<=Date.now()),nw:!!(g&&Date.now()-g<3*864e5),rar};}
  const h=hs(s.id+'|'+f.id),q=h%100,got=c.pi===0?q<88:c.pi===1?q<70:q<46;
  return {got,m:got?(h>>>7)%4:0,due:got&&(h>>>11)%6===0,nw:got&&(h>>>15)%7===0,rar};}
DL.cards=s=>dictCards(s).map((c,i)=>Object.assign(c,cst(c),{k:s.id+'|'+c.f.id,n:i+1}));
DL.eps=s=>{const C=DL.cards(s);return s.parts.map((p,pi)=>({p,pi,c:C.filter(c=>c.pi===pi)})).filter(e=>e.c.length);};
DL.cnt=L=>{let g=0,t=0;L.forEach(s=>DL.cards(s).forEach(c=>{t++;if(c.got)g++;}));return [g,t];};
DL.films=()=>dxShows().map(sh=>{const [g,t]=DL.cnt(sh.L);return Object.assign(sh,{s0:sh.L[0],g,t,full:t>0&&g===t,nw:sh.L.some(s=>DL.cards(s).some(c=>c.nw))});});
DL.find=k=>{const [sid,fid]=String(k).split('|'),s=scOf(sid);return s?DL.cards(s).find(c=>c.f.id===fid):null;};
DL.T=f=>dxT(f);
DL.use=f=>f.use||f.tip||'';
// вырез из кадра у каждой карты свой — чтобы карты одного эпизода не были одинаковыми
DL.crop=c=>{const h=hs(c.k);return `--bz:${(1.05+(h%30)/100).toFixed(2)};--bx:${20+(h>>>5)%60}%;--by:${25+(h>>>9)%50}%`;};
DL.mp=m=>[0,1,2].map(k=>`<i class="${k<m?'on':''}"></i>`).join('');
// стандартная карта (у каждого варианта своё оформление через .v-ID .dlc)
DL.cardHTML=(c,i,o)=>{o=o||{};const {s,f,pi}=c,cls=`dlc dlt r-${RN[c.rar]}${c.got?'':' lock'}${c.m>=3?' mx':''}${c.due?' due':''}${c.nw?' new':''}${o.cls?' '+o.cls:''}`;
  const art=`<span class="dlc-art" style="background-image:${(c.n%2?DL.art:DL.art2)(s,pi)}"></span>`;
  if(!c.got)return `<button class="${cls}" data-c="${c.k}" style="--d:${i};--c:${th(s)};${DL.crop(c)}">${art}<span class="dlc-q">?</span><span class="dlc-lk">Эпизод ${pi+1}</span></button>`;
  return `<button class="${cls}" data-c="${c.k}" style="--d:${i};--c:${th(s)};${DL.crop(c)}">${art}<i class="dlc-gem" title="${RT[RN[c.rar]]}"></i><span class="dlc-mana">${c.m}</span>
    <b class="dlc-en">${esc(DL.T(f))}</b><span class="dlc-ru">${esc(f.ru)}</span><span class="dlc-src">${esc(DL.film(s))} · эп. ${pi+1}</span><span class="dlc-m">${DL.mp(c.m)}</span>
    <i class="dlc-foil"></i>${c.nw?'<i class="dlc-new">NEW</i>':''}${c.due?'<i class="dlc-due" title="Пора повторить">⏳</i>':''}</button>`;};
DL.cur=()=>V.find(v=>v.id===store.dictVar)||V[0];
const later=DL.later=(f,ms)=>{const t=setTimeout(()=>{if($('#dlRoot')||$('.dli')||$('.dlp'))f();},ms);DL._t.push(t);return t;};
DL._t=[];
DL.clean=()=>{DL._t.forEach(clearTimeout);DL._t=[];try{DL.stopVids();}catch(e){}document.querySelectorAll('.dli,.dlp,.dlx').forEach(x=>x.remove());if(DL._v){try{DL._v.pause();}catch(e){}DL._v=null;}document.body.classList.remove('dx-open');};
// звук редкости
DL.chime=r=>{if(!store.snd||store.labSnd==='off')return;try{
  if(r>=4){[523,659,784,1047,1319].forEach((f,i)=>osc('sine',f,i*.06,.8,.02,{att:.005,lp:3600}));noise(0,.7,.014,{type:'bandpass',f:500,fTo:3200,q:.5});osc('sine',131,0,.9,.03,{lp:500});}
  else if(r===3){[587,880,1175,1568].forEach((f,i)=>osc('triangle',f,i*.07,.55,.016,{att:.005,lp:3000}));noise(0,.4,.01,{type:'bandpass',f:900,fTo:2400,q:.6});}
  else if(r===2){osc('sine',988,0,.4,.02,{att:.004});osc('sine',1480,.07,.4,.014,{att:.004});}
  else sfx('unlock');}catch(e){}};
// частицы по редкости
if(window.FX_PACKS){Object.assign(FX_PACKS,{
  dl_com:{c:['#FFFFFF','#E8E2D0','#CFC6B0'],sh:['dot','spark']},
  dl_rare:{c:['#4DA8FF','#9ED0FF','#FFFFFF','#2E7BFF'],sh:['spark','dot','star']},
  dl_epic:{c:['#B57CFF','#E2C4FF','#FF7AD9','#7B4DFF'],sh:['spark','star','dot']},
  dl_leg:{c:['#FF9A2E','#FFD27A','#FFF1C4','#FF6A00'],sh:['ember','spark','star']}});}
DL.burst=(el,r,k)=>{if(!fxOK()||!el)return;const p='dl_'+RN[r||1];fxAt(el,{pack:p,n:Math.round((r>=4?60:r===3?42:r===2?28:16)*(k||1)),v:r>=4?9:r===3?7.5:6,life:r>=4?80:56});};

/* ---------- корень: панель админа, шапка, сцена варианта ---------- */
DL.mount=root=>{const v=DL.cur();if(!v){root.innerHTML='';return;}DL.root=root;
  root.className=`dl-root v-${v.id}`;
  const i=V.indexOf(v);
  root.innerHTML=`<div class="dl-bgl">${v.bg||''}</div>
    <div class="dl-adm"><button class="dl-ab" data-dv="-1" aria-label="Предыдущий">${ui('back')}</button><span class="dl-an"><b>${esc(v.n)}</b><small>${esc(v.from)} · ${i+1} из ${V.length}</small></span><button class="dl-ab" data-dv="1" aria-label="Следующий">${ui('fwd')}</button>
      <button class="dl-demo${demo()?' on':''}" id="dlDemo" title="Демо-прогресс">${demo()?'Демо':'Мой'}</button><button class="dl-ab dl-set" id="dlSet" aria-label="Все варианты">☰</button></div>
    <div class="dl-top"><div class="dl-ttl">${v.titleHTML||`<h1>${esc(v.title||'Словарь')}</h1>`}<small>${esc(v.sub||'Коллекция фраз из кино')}</small></div><div class="dl-cnt" id="dlCnt"></div></div>
    <div class="dl-stage" id="dlStage"></div>`;
  root.querySelectorAll('[data-dv]').forEach(b=>b.onclick=()=>{sfx('tap');haptic('sel');const n=(V.indexOf(DL.cur())+ +b.dataset.dv+V.length)%V.length;store.dictVar=V[n].id;save();DL.clean();DL.mount(root);});
  $('#dlDemo').onclick=()=>{sfx('tap');store.dlDemo=!demo();save();DL.mount(root);};
  $('#dlSet').onclick=()=>{sfx('tap');dlMenu();};
  if(v.enter&&!DL.seen[v.id]){DL.seen[v.id]=1;try{v.enter(root);}catch(e){}}
  DL.render(0);};
DL.lang=()=>{const nL=l=>dictScenes().filter(s=>dxL(s)===l).reduce((a,s)=>a+dictCards(s).length,0);
  return `<div class="dl-lang"><button data-dl="en" class="${DX.lang!=='de'?'on':''}">${FLAG.en} English <i>${nL('en')}</i></button><button data-dl="de" class="${DX.lang==='de'?'on':''}">${FLAG.de} Deutsch <i>${nL('de')}</i></button></div>`;};
DL.crumb=(em,b)=>`<div class="dl-crumb"><button class="dl-up" data-up aria-label="Назад">${ui('back')}</button><span><em>${esc(em)}</em><b>${esc(b)}</b></span></div>`;
DL.bar=(g,t)=>`<i class="dl-pb"><i style="width:${t?g/t*100:0}%"></i></i>`;
DL.lvl=()=>S.sid?'scene':S.show?'film':'home';
DL.render=dir=>{const st=$('#dlStage');if(!st)return;const v=DL.cur();
  {const s0=S.sid?scOf(S.sid):S.show?dictScenes().find(x=>dictFilm(x)===S.show):null;if(s0)DX.lang=dxL(s0);}
  const F=DL.films();if(S.show&&!F.some(x=>x.k===S.show)){S.show=null;S.sid=null;}
  const [g,t]=DL.cnt(dxScenes()),cn=$('#dlCnt');if(cn)cn.innerHTML=`<b>${g}</b><span> / ${t}</span>`;
  const lvl=DL.lvl();let html='';
  try{if(lvl==='scene'){const s=scOf(S.sid);html=v.scene(s,F.find(x=>x.k===dictFilm(s)));}
    else if(lvl==='film'){html=v.film(F.find(x=>x.k===S.show),F);}
    else html=v.home(F);}catch(e){html=`<div class="dl-err">Ошибка варианта: ${esc(e.message)}</div>`;console.error(e);}
  const go=()=>{DL.stopVids&&DL.stopVids(st);st.innerHTML=html;st.dataset.lvl=lvl;DL.bind(st,lvl);try{backBtn(lvl!=='home');}catch(e){}
    if(v.after)try{v.after(st,lvl,dir);}catch(e){console.error(e);}
    if(dir&&!v.noAnim&&fxOK())st.querySelectorAll('[data-c],[data-show],[data-sid]').forEach((c,i)=>{if(i<24)c.animate([{opacity:0,transform:'translateY(18px) scale(.94)'},{opacity:1,transform:'none'}],{duration:460,delay:40+i*32,easing:EZ.out,fill:'backwards'});});};
  if(dir&&v.trans&&fxOK())v.trans(st,dir,go);else go();
  if(dir)window.scrollTo({top:0,behavior:'smooth'});};
DL.open=(o,dir)=>{Object.assign(S,o);if(S.show&&!S.sid){const sh=DL.films().find(x=>x.k===S.show);if(sh&&sh.L.length===1&&DL.cur().skip1!==false)S.sid=sh.L[0].id;}DL.render(dir==null?1:dir);};
DL.back=()=>{const o=$('.dli');if(o&&o._close){o._close();return true;}if(!$('#dlRoot'))return false;
  if(S.sid){const sh=DL.films().find(x=>x.k===S.show);S.sid=null;if(!sh||sh.L.length<2||DL.cur().skip1===false&&!S.show)S.show=null;DL.render(-1);return true;}
  if(S.show){S.show=null;DL.render(-1);return true;}return false;};
// клики по стандартным элементам: [data-show] фильм, [data-sid] сцена, [data-c] карта, [data-up] назад, [data-dl] язык
DL.bind=(st,lvl)=>{const root=DL.root;
  root.querySelectorAll('[data-dl]').forEach(b=>b.onclick=()=>{if(DX.lang===b.dataset.dl)return;sfx('tap');DX.lang=b.dataset.dl;S.show=null;S.sid=null;root.querySelectorAll('[data-dl]').forEach(x=>x.classList.toggle('on',x===b));DL.render(DX.lang==='de'?1:-1);});
  st.querySelectorAll('[data-up]').forEach(b=>b.onclick=e=>{e.stopPropagation();sfx('tap');DL.back();});
  st.querySelectorAll('[data-show]:not([data-own])').forEach(b=>b.onclick=()=>{sfx('tap');haptic('sel');DL.open({show:b.dataset.show,sid:null});});
  st.querySelectorAll('[data-sid]:not([data-own])').forEach(b=>b.onclick=()=>{sfx('tap');haptic('sel');DL.open({sid:b.dataset.sid});});
  st.querySelectorAll('[data-c]:not([data-own])').forEach(b=>b.onclick=()=>DL.tap(b));
  if(!DL.cur().noTilt)DL.tiltAll(st);};
DL.tap=(b,o)=>{const c=DL.find(b.dataset.c);if(!c)return;
  if(!c.got){haptic('err');sfx('nope');b.animate([{transform:'translateX(0)'},{transform:'translateX(-7px) rotate(-1.5deg)'},{transform:'translateX(7px) rotate(1.5deg)'},{transform:'translateX(0)'}],{duration:300});toast(`🔒 Пройди эпизод ${c.pi+1} «${c.p.t}» — карта откроется`);return;}
  sfx('tap');haptic('light');const v=DL.cur();if(v.preTap&&fxOK()){v.preTap(b,c,()=>DL.inspect(b,c,o));return;}DL.inspect(b,c,o);};
// наклон карт к пальцу/мыши + блик (одна делегированная подписка на всю сцену)
DL.tiltAll=st=>{if(st._tilt)return;st._tilt=1;let cur=null;
  const set=(el,e)=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;if(x<0||x>1||y<0||y>1)return off();
    el.style.setProperty('--rx',((.5-y)*14).toFixed(1)+'deg');el.style.setProperty('--ry',((x-.5)*16).toFixed(1)+'deg');el.style.setProperty('--mx',(x*100).toFixed(0)+'%');el.style.setProperty('--my',(y*100).toFixed(0)+'%');el.classList.add('hov');};
  const off=()=>{if(cur){cur.classList.remove('hov');cur.style.removeProperty('--rx');cur.style.removeProperty('--ry');}cur=null;};
  st.addEventListener('pointermove',e=>{const el=e.target.closest&&e.target.closest('.dlt:not(.lock)');if(el!==cur){off();cur=el;}if(el)set(el,e);});
  st.addEventListener('pointerleave',off);st.addEventListener('pointercancel',off);st.addEventListener('pointerup',e=>{if(e.pointerType!=='mouse')setTimeout(off,120);});};

/* ---------- карта «в руке»: вылетает из сетки, крутится пальцем, переворачивается, играет момент ---------- */
DL.faceHTML=c=>{const {s,f,pi}=c;return `<div class="dli-f"><span class="dli-art"><i style="background-image:${DL.art(s,pi)}"></i></span><i class="dlc-gem"></i><span class="dlc-mana">${c.m}</span>
  <span class="dli-rar">${RT[RN[c.rar]]}</span><b class="dli-en">${esc(DL.T(f))}</b><span class="dli-ru">${esc(f.ru)}</span><span class="dli-src">${esc(DL.film(s))} · ${esc(s.sub||'')} · эп. ${pi+1}</span><span class="dlc-m">${DL.mp(c.m)}</span><i class="dli-holo"></i><i class="dli-glare"></i></div>`;};
// «большая» карта = та же карта из сетки, увеличенная (zoom) — как будто взял её в руку
DL.bigFace=(v,c)=>`<div class="dli-f dli-big"><div class="dli-z">${v.card?v.card(c,0):DL.cardHTML(c,0,{cls:v.big})}</div><i class="dli-holo"></i><i class="dli-glare"></i></div>`;
DL.backHTML=c=>{const {s,f,pi}=c,use=DL.use(f),lx=f.lx,kw=(f.kw||[]).slice(0,4),fact=f.fact&&(demo()||ADM_OPEN()||scP(s.id).done.includes(pi))?f.fact:'';
  return `<div class="dli-b"><b class="dli-bt">${esc(DL.T(f))}</b>${use?`<span class="dli-bh">Когда пригодится</span><p>${esc(use)}</p>`:''}
    ${lx&&lx[0]?`<span class="dli-bh">Пример из жизни</span><p><b>${esc(lx[0])}</b><small>${esc(lx[1]||'')}</small></p>`:''}
    ${kw.length?`<span class="dli-bh">Слова</span><div class="dli-kw">${kw.map(k=>`<i><b>${esc(k[1]||k[0])}</b> ${esc(k[2]||'')}</i>`).join('')}</div>`:''}
    ${fact?`<span class="dli-bh">💡 Интересный факт</span><p class="dli-fact">${esc(fact)}</p>`:''}<i class="dli-glare"></i></div>`;};
DL.inspect=(src,c,o)=>{o=o||{};DL.clean();const v=DL.cur(),{s,f,p,pi}=c,r=c.rar;
  const ov=document.createElement('div');ov.className=`dli v-${v.id} r-${RN[r]}${c.m>=3?' mx':''}`;ov.style.setProperty('--c',th(s));
  ov.innerHTML=`<div class="dli-dim"></div><div class="dli-rays"></div>
    <div class="dli-wrap"><div class="dli-card"><div class="dli-in">${v.face?v.face(c):v.big?DL.bigFace(v,c):DL.faceHTML(c)}${(v.backF||DL.backHTML)(c)}</div></div>
      <div class="dli-acts"><button data-a="play">${SI.play} Момент</button><button data-a="flip">↻ Оборот</button><button data-a="ep">Эпизод →</button></div>
      <small class="dli-tip">Тяни — крутится · тап — перевернуть</small></div><button class="dli-x" aria-label="Закрыть">${ui('close')}</button>`;
  FXROOT().appendChild(ov);document.body.classList.add('dx-open');
  const card=ov.querySelector('.dli-card'),inn=ov.querySelector('.dli-in');
  {const z=ov.querySelector('.dli-z'),k=z&&z.firstElementChild;if(k)z.style.zoom=Math.min(card.offsetWidth/(k.offsetWidth||160),card.offsetHeight/(k.offsetHeight||224)).toFixed(3);}
  let ry=0,rx=0,flip=0,drag=null,moved=false,raf=0,closing=false;
  const put=()=>{inn.style.transform=`rotateX(${rx}deg) rotateY(${ry+flip}deg)`;const a=((ry+flip)%360+360)%360;ov.classList.toggle('flipd',a>90&&a<270);
    ov.style.setProperty('--gx',(50+ry*1.6).toFixed(0)+'%');ov.style.setProperty('--gy',(50-rx*2.2).toFixed(0)+'%');};
  const ease=()=>{cancelAnimationFrame(raf);const st=()=>{ry*=.86;rx*=.86;put();if(Math.abs(ry)+Math.abs(rx)>.3)raf=requestAnimationFrame(st);else{ry=rx=0;put();}};raf=requestAnimationFrame(st);};
  card.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,ry,rx};moved=false;try{card.setPointerCapture(e.pointerId);}catch(x){}cancelAnimationFrame(raf);});
  card.addEventListener('pointermove',e=>{if(!drag){if(e.pointerType==='mouse'){const R=card.getBoundingClientRect();ry=((e.clientX-R.left)/R.width-.5)*18;rx=-((e.clientY-R.top)/R.height-.5)*14;put();}return;}
    const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>6)moved=true;ry=drag.ry+dx*.6;rx=Math.max(-25,Math.min(25,drag.rx-dy*.35));put();});
  const up=()=>{if(!drag)return;drag=null;if(!moved){doFlip();return;}
    if(Math.abs(ry)>80){flip+=ry>0?180:-180;ry=0;sfx('page');}ease();};
  card.addEventListener('pointerup',up);card.addEventListener('pointercancel',up);
  card.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'&&!drag)ease();});
  const doFlip=()=>{flip+=180;sfx('page');haptic('light');inn.animate([{transform:`rotateX(${rx}deg) rotateY(${ry+flip-180}deg) scale(1)`},{transform:`rotateX(${rx}deg) rotateY(${ry+flip-70}deg) scale(1.06)`,offset:.6},{transform:`rotateX(${rx}deg) rotateY(${ry+flip}deg) scale(1)`}],{duration:520,easing:EZ.out});put();};
  // появление: из клетки сетки — к центру, с подлётом и вспышкой по редкости
  const R0=src&&src.getBoundingClientRect?src.getBoundingClientRect():null,R=card.getBoundingClientRect();
  if(fxOK()){ov.querySelector('.dli-dim').animate([{opacity:0},{opacity:1}],{duration:320,fill:'backwards'});
    if(R0&&R0.width){const sx=R0.width/R.width,sy=R0.height/R.height,tx=R0.left+R0.width/2-(R.left+R.width/2),ty=R0.top+R0.height/2-(R.top+R.height/2);
      card.animate([{transform:`translate(${tx}px,${ty}px) scale(${sx},${sy}) rotateY(0deg)`},{transform:`translate(0,-14px) scale(1.04) rotateY(${r>=3?'-370':'-12'}deg)`,offset:.62},{transform:'none'}],{duration:r>=3?980:720,easing:SPRING});
      src.style.visibility='hidden';}
    else card.animate([{transform:'translateY(60px) scale(.6)',opacity:0},{transform:'none',opacity:1}],{duration:600,easing:SPRING});
    ov.querySelectorAll('.dli-acts,.dli-tip,.dli-x').forEach((x,i)=>x.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:340,delay:380+i*70,easing:EZ.out,fill:'backwards'}));
    later(()=>{DL.burst(card,r);DL.chime(r);if(r>=4){haptic('medium');fxRain(30,{pack:'dl_leg'});}},r>=3?560:300);}
  else DL.chime(r);
  if(v.onOpen)try{v.onOpen(ov,c);}catch(e){}
  // момент из сцены — прямо в окне арта
  const art=ov.querySelector('.dli-art');let vid=null;
  const play=()=>{if(flip%360)doFlip();if(vid){vid.remove();vid=null;DL._v=null;try{musDuck(false);}catch(e){}return;}
    const a=Math.max(0,f.a-p.a-0.25),b=f.b-p.a+0.3;vid=document.createElement('video');vid.className='dli-vid';vid.setAttribute('playsinline','');vid.setAttribute('webkit-playsinline','');vid.preload='auto';
    vid.src=assetUrl(scEpKey(s,pi,'mp4'))+'#t='+a.toFixed(2);vid.volume=store.scVol==null?1:store.scVol;if(art)art.appendChild(vid);DL._v=vid;try{musDuck(true);}catch(e){}
    vid.addEventListener('loadedmetadata',()=>{if(vid&&(vid.currentTime<a-.1||vid.currentTime>b))try{vid.currentTime=a;}catch(e){}},{once:true});
    vid.addEventListener('timeupdate',()=>{if(vid&&vid.currentTime>=b){vid.pause();}});
    const pr=vid.play();if(pr&&pr.catch)pr.catch(()=>{});};
  const close=ov._close=()=>{if(closing)return;closing=true;if(vid)try{vid.pause();}catch(e){}try{musDuck(false);}catch(e){}document.body.classList.remove('dx-open');
    const R1=src&&src.isConnected?src.getBoundingClientRect():null,ok=fxOK()&&R1&&R1.width&&R1.bottom>0&&R1.top<innerHeight;
    ov.querySelectorAll('.dli-acts,.dli-tip,.dli-x,.dli-rays').forEach(x=>x.animate([{opacity:1},{opacity:0}],{duration:160,fill:'forwards'}));
    ov.querySelector('.dli-dim').animate([{opacity:1},{opacity:0}],{duration:360,fill:'forwards'});
    const fin=()=>{ov.remove();if(src)src.style.visibility='';if(src&&fxOK())src.animate([{transform:'scale(1.06)'},{transform:'scale(.97)'},{transform:'none'}],{duration:320,easing:EZ.out});};
    if(ok){const R=card.getBoundingClientRect(),sx=R1.width/R.width,sy=R1.height/R.height,tx=R1.left+R1.width/2-(R.left+R.width/2),ty=R1.top+R1.height/2-(R.top+R.height/2);
      inn.style.transform='none';card.animate([{transform:'none'},{transform:`translate(${tx}px,${ty}px) scale(${sx},${sy})`}],{duration:380,easing:EZ.in,fill:'forwards'}).onfinish=fin;}
    else{card.animate([{opacity:1},{opacity:0,transform:'scale(.9)'}],{duration:220,fill:'forwards'}).onfinish=fin;}};
  ov.querySelector('.dli-dim').onclick=close;ov.querySelector('.dli-x').onclick=()=>{sfx('tap');close();};
  ov.querySelector('[data-a="play"]').onclick=()=>{play();};
  ov.querySelector('[data-a="flip"]').onclick=()=>doFlip();
  ov.querySelector('[data-a="ep"]').onclick=()=>{sfx('tap');close();setTimeout(()=>renderScEp(s.id,pi),200);};
  const k=e=>{if(e.key==='Escape'){document.removeEventListener('keydown',k);close();}};document.addEventListener('keydown',k);
  return ov;};

/* ---------- вспомогалки для вариантов ---------- */
DL.kindName=k=>({film:'Фильмы',series:'Сериалы',interview:'Интервью'})[k]||k;
DL.groups=F=>['film','series','interview'].map(k=>({k,L:F.filter(x=>x.kind===k)})).filter(x=>x.L.length);
DL.pct=(g,t)=>t?Math.round(g/t*100):0;
DL.ep=(n)=>`${n} ${plural(n,['эпизод','эпизода','эпизодов'])}`;
DL.sc=(n)=>`${n} ${plural(n,['сцена','сцены','сцен'])}`;
DL.kart=(n)=>`${n} ${plural(n,['карта','карты','карт'])}`;
// живое видео-превью (без звука, по кругу): для «галереи» и «кино»
DL.loopVid=(el,s,pi,f,p)=>{if(!el||el.querySelector('video'))return;const v=document.createElement('video');v.muted=true;v.defaultMuted=true;v.setAttribute('muted','');v.setAttribute('playsinline','');v.setAttribute('webkit-playsinline','');v.loop=false;v.preload='auto';
  const a=f?Math.max(0,f.a-p.a-.4):1,b=f?f.b-p.a+.6:a+6;v.src=assetUrl(scEpKey(s,pi,'mp4'))+'#t='+a.toFixed(2);v.className='dl-lv';el.appendChild(v);
  v.addEventListener('timeupdate',()=>{if(v.currentTime>=b)try{v.currentTime=a;}catch(e){}});v.addEventListener('playing',()=>v.classList.add('on'));
  v.addEventListener('error',()=>v.remove());const pr=v.play();if(pr&&pr.catch)pr.catch(()=>{});return v;};
DL.stopVids=el=>{(el||document).querySelectorAll('video.dl-lv').forEach(v=>{try{v.pause();v.removeAttribute('src');v.load();}catch(e){}v.remove();});};

/* ---------- раздел в админке ---------- */
DL.admin=box=>{const cur=store.dictVar||'cur';
  box.innerHTML=`<p class="ad2-note">${FLAG_ADMIN?'Нажми вариант — словарь сразу откроется в нём. Выбор — только на этом устройстве. В самом словаре сверху ‹ › — листать варианты, ☰ — вернуться сюда.':'Это тест: так может выглядеть Словарь. Нажми вариант — Словарь откроется в нём. Сверху ‹ › — листать, ☰ — назад к списку. «Демо» — карты как будто уже собраны. Скажи, какой зашёл больше всего.'}</p>
    <div class="dla-demo"><span>Карты в вариантах</span><div class="dla-sg"><button data-dm="1" class="${demo()?'on':''}">Демо</button><button data-dm="0" class="${demo()?'':'on'}">Мой прогресс</button></div></div>
    <h3 class="ad2-h">Экран словаря</h3>
    <div class="dla-list"><button class="dla-it${cur==='cur'?' on':''}" data-dv="cur"><i class="dla-sw" style="background:linear-gradient(135deg,#1b1e28,#2c2f3a)">📖</i><span><b>Текущий (как у игроков)</b><small>Словарь 13.6 — без изменений</small></span></button>
      ${V.map((v,i)=>`<button class="dla-it${cur===v.id?' on':''}" data-dv="${v.id}"><i class="dla-sw" style="background:${v.sw}">${v.ic||''}</i><span><b>${i+1}. ${esc(v.n)}</b><small><em>${esc(v.from)}</em> — ${esc(v.d)}</small></span></button>`).join('')}</div>
    <h3 class="ad2-h">Пак новых карт после эпизода</h3><p class="ad2-note">На настоящих картах. Нажми — проиграется. Текущий пак — «Как сейчас».</p>
    <div class="dla-list">${(DL.PK||[]).map(k=>`<button class="dla-it" data-pk="${k.id}"><i class="dla-sw" style="background:${k.sw}">${k.ic||'▶'}</i><span><b>${esc(k.n)}</b><small><em>${esc(k.from)}</em> — ${esc(k.d)}</small></span><i class="ad2-play">${SI.play}</i></button>`).join('')}</div>`;
  box.querySelectorAll('[data-dm]').forEach(b=>b.onclick=()=>{sfx('tap');store.dlDemo=b.dataset.dm==='1';save();DL.admin(box);});
  box.querySelectorAll('[data-dv]').forEach(b=>b.onclick=()=>{sfx('tap');haptic('sel');store.dictVar=b.dataset.dv==='cur'?null:b.dataset.dv;save();S.show=null;S.sid=null;DX.seg='ph';renderTab('dict');});
  box.querySelectorAll('[data-pk]').forEach(b=>b.onclick=()=>{sfx('tap');const k=DL.PK.find(x=>x.id===b.dataset.pk);if(k)try{k.run(DL.packCards());}catch(e){toast('Не получилось: '+e.message);}});};

/* ---------- карты для демо-пака: 5 настоящих карт, хотя бы одна редкая+ ---------- */
DL.packCards=n=>{n=n||5;const all=dictScenes().filter(s=>!ageLock(s)).flatMap(s=>DL.cards(s));if(!all.length)return [];
  const pick=[],seed=Date.now();const by=r=>all.filter(c=>c.rar===r);
  const top=by(4).length&&Math.random()<.5?by(4):by(3).length?by(3):by(2);if(top.length)pick.push(top[Math.floor(Math.random()*top.length)]);
  while(pick.length<n&&pick.length<all.length){const c=all[Math.floor(Math.random()*all.length)];if(!pick.includes(c))pick.push(c);}
  return pick.sort(()=>Math.random()-.5).map(c=>Object.assign({},c,{got:true}));};
})();

/* =====================================================================================
   ВАРИАНТЫ
   ===================================================================================== */
(function(){'use strict';const D=DL,S=D.S,th=D.th,RN=D.RN;
const motes=D.motes=(n,cls)=>Array.from({length:n},(_,i)=>{const h=D.hs(cls+i);return `<i class="${cls}" style="left:${h%100}%;top:${(h>>>7)%100}%;--t:${7+(h>>>3)%9}s;--dl:-${(h>>>5)%9}s;--s:${(.5+((h>>>9)%10)/10).toFixed(2)}"></i>`;}).join('');
const E=t=>esc(t);
const cardsHTML=(L,cls)=>L.map((c,i)=>D.cardHTML(c,i,{cls})).join('');
const epsHTML=(s,head,cls)=>D.eps(s).map(e=>`${head(e)}<div class="dl-grid">${cardsHTML(e.c,cls)}</div>`).join('');
// раздача: карты прилетают из точки (колода, проектор…)
D.deal=(st,x,y,o)=>{if(!fxOK())return;o=o||{};const L=[...st.querySelectorAll('[data-c]')].slice(0,30);let k=0;
  L.forEach((el,i)=>{const r=el.getBoundingClientRect();if(r.top>innerHeight+40)return;const dx=x-(r.left+r.width/2),dy=y-(r.top+r.height/2),rot=(D.hs(el.dataset.c)%40)-20;
    el.animate([{transform:`translate(${dx}px,${dy}px) rotate(${rot}deg) scale(${o.s0||.5})`,opacity:0},{opacity:1,offset:.15},{transform:'none',opacity:1}],{duration:o.d||620,delay:(o.dl||80)+k*(o.gap||55),easing:SPRING,fill:'backwards'});
    D.later(()=>sfx('tick'),(o.dl||80)+k*(o.gap||55)+200);k++;});};

/* ---------- 1. Книга коллекции (Hearthstone) ---------- */
const BK={sid:null,pg:0,n:1,step:1};
const bkTwo=()=>innerWidth>=860;
const bkTabs=F=>`<div class="bk-tabs">${F.map(sh=>`<button class="bk-tab${sh.k===S.show?' on':''}" data-show="${E(sh.k)}" style="--c:${th(sh.s0)}" title="${E(sh.k)}"><i style="background-image:${D.poster(sh.s0)}"></i><small>${sh.g}/${sh.t}</small></button>`).join('')}</div>`;
function bkPages(s){const C=D.cards(s),per=bkTwo()?4:6,P=[];for(let i=0;i<C.length;i+=per)P.push(C.slice(i,i+per));return P.length?P:[[]];}
function bkPg(s,P,i){if(i>=P.length)return `<div class="bk-pg bk-blank"><span class="bk-orn">❦</span><span class="bk-no">${i+1}</span></div>`;const L=P[i],c0=L[0];
  return `<div class="bk-pg">${i===0?`<div class="bk-ch"><em>Глава · ${E(D.film(s))}</em><b>${E(s.sub||s.title)}</b></div>`:`<div class="bk-rh">${E(s.sub||s.title)}${c0?` · эп. ${c0.pi+1}`:''}</div>`}
    <div class="bk-cards">${L.map((c,j)=>D.cardHTML(c,j,{cls:'hs'})).join('')}</div><span class="bk-no">${i+1}</span></div>`;}
const bkSpread=(s,P,pg)=>bkPg(s,P,pg)+(bkTwo()?bkPg(s,P,pg+1):'');
D.reg({id:'book',big:'hs',n:'Книга коллекции',from:'Hearthstone',ic:'📖',sw:'linear-gradient(135deg,#6b3a1c,#2a160a)',
  d:'Кожаная книга на столе под лампой. Закладки — фильмы, страница — сцена, карты как в HS (камень редкости, кристалл), страницы листаются в 3D.',
  bg:`<div class="bk-lamp"></div>${motes(18,'dl-dust')}`,title:'Книга коллекции',
  home(F){return `${D.lang()}<div class="bk">${bkTabs(F)}<div class="bk-book" id="bkBook"><div class="bk-page"><div class="bk-pg bk-toc"><div class="bk-ch"><em>Словарь</em><b>Содержание</b></div>
    ${D.groups(F).map(g=>`<h4>${D.kindName(g.k)}</h4>${g.L.map(sh=>`<button class="bk-row" data-show="${E(sh.k)}"><span class="bk-th" style="background-image:${D.poster(sh.s0)}"></span><b>${E(sh.k)}</b><i class="bk-dots"></i><em>${sh.g}/${sh.t}</em></button>`).join('')}`).join('')}</div></div></div></div>`;},
  film(sh,F){return `${D.crumb(D.kindName(sh.kind),sh.k)}<div class="bk">${bkTabs(F)}<div class="bk-book"><div class="bk-page"><div class="bk-pg bk-toc"><div class="bk-ch"><em>${E(sh.k)}</em><b>Главы</b></div>
    ${sh.L.map((s,i)=>{const [g,t]=D.cnt([s]);return `<button class="bk-row" data-sid="${s.id}"><span class="bk-th" style="background-image:${D.cover(s)}"></span><b>${['I','II','III','IV','V','VI'][i]||i+1}. ${E(s.sub||s.title)}</b><i class="bk-dots"></i><em>${g}/${t}</em></button>`;}).join('')}</div></div></div></div>`;},
  scene(s,sh){const F=D.films();S.show=dictFilm(s);const P=bkPages(s);if(BK.sid!==s.id){BK.sid=s.id;BK.pg=0;}BK.n=P.length;BK.step=bkTwo()?2:1;if(BK.pg>=P.length)BK.pg=0;
    return `${D.crumb(dictFilm(s),s.sub||s.title)}<div class="bk">${bkTabs(F)}<div class="bk-book" id="bkBook"><div class="bk-page" id="bkPage">${bkSpread(s,P,BK.pg)}</div></div>
      <div class="bk-foot"><button class="bk-nav" data-bk="-1">${ui('back')}</button><span class="bk-rib" id="bkRib"></span><button class="bk-nav" data-bk="1">${ui('fwd')}</button></div></div>`;},
  after(st,lvl){
    if(lvl==='home'&&!D.seen.bkOpen&&fxOK()){D.seen.bkOpen=1;const b=st.querySelector('.bk-book');if(b){const cv=document.createElement('div');cv.className='bk-cover';cv.innerHTML='<b>Словарь</b><small>коллекция фраз из кино</small>';b.appendChild(cv);
      sfx('whoosh');cv.animate([{transform:'perspective(1400px) rotateY(0deg)'},{transform:'perspective(1400px) rotateY(-12deg)',offset:.25},{transform:'perspective(1400px) rotateY(-172deg)',opacity:1,offset:.92},{transform:'perspective(1400px) rotateY(-180deg)',opacity:0}],{duration:1300,delay:250,easing:'cubic-bezier(.5,0,.3,1)',fill:'both'}).onfinish=()=>cv.remove();D.later(()=>sfx('page'),700);}}
    const tab=st.querySelector('.bk-tab.on');if(tab)tab.scrollIntoView({inline:'center',block:'nearest'});
    if(lvl!=='scene')return;const s=scOf(S.sid),P=bkPages(s);
    const rib=()=>{const r=$('#bkRib'),[g,t]=D.cnt([s]);if(r)r.innerHTML=`<b>${E(dictFilm(s))}</b> · ${g} / ${t} · стр. ${BK.pg+1}${BK.step>1&&BK.pg+1<P.length?'–'+(BK.pg+2):''} из ${P.length}`;
      st.querySelectorAll('[data-bk]').forEach(b=>b.disabled=+b.dataset.bk<0?BK.pg<=0:BK.pg+BK.step>=P.length);};rib();
    const turn=dir=>{const np=BK.pg+dir*BK.step;if(np<0||np>=P.length){const b=$('#bkBook');if(b)b.animate([{transform:'none'},{transform:`translateX(${-dir*8}px)`},{transform:'none'}],{duration:260});return;}
      const page=$('#bkPage');if(!page)return;const old=page.innerHTML;BK.pg=np;const nw=bkSpread(s,P,np);sfx('page');haptic('light');
      if(!fxOK()){page.innerHTML=nw;D.bind(st,'scene');rib();return;}
      const two=bkTwo(),W=page.offsetWidth,H=page.offsetHeight,L0=page.offsetLeft,T0=page.offsetTop,half=two?W/2:W,fwd=dir>0,book=$('#bkBook');
      const tmp=document.createElement('div');tmp.innerHTML=old;const tmpN=document.createElement('div');tmpN.innerHTML=nw;const O=[...tmp.children].map(x=>x.outerHTML),N=[...tmpN.children].map(x=>x.outerHTML);
      // лист: лицо и оборот. ПК (разворот): вперёд — правая страница ложится налево, назад — левая направо. Телефон: вперёд — старая уходит влево, назад — новая приходит слева
      let face,back,org,k0,k1,left=L0;
      if(two){if(fwd){face=O[1];back=N[0];org='0 50%';k0=0;k1=-180;left=L0+half;}else{face=O[0];back=N[1];org='100% 50%';k0=0;k1=180;}}
      else if(fwd){face=old;back='';org='0 50%';k0=0;k1=-180;}else{face=nw;back='';org='0 50%';k0=-180;k1=0;}
      const leaf=document.createElement('div');leaf.className='bk-leaf';leaf.innerHTML=`<div class="bk-lf bk-page">${face}</div><div class="bk-lf bk-lb bk-page">${back}</div><i class="bk-shade"></i>`;
      Object.assign(leaf.style,{left:left+'px',top:T0+'px',width:half+'px',height:H+'px',transformOrigin:org});
      let keep=null;if(two){keep=document.createElement('div');keep.className='bk-keep bk-page';keep.innerHTML=fwd?O[0]:O[1];Object.assign(keep.style,{left:(L0+(fwd?0:half))+'px',top:T0+'px',width:half+'px',height:H+'px'});book.appendChild(keep);}
      book.appendChild(leaf);page.innerHTML=(!two&&!fwd)?old:nw;
      const a=leaf.animate([{transform:`perspective(1600px) rotateY(${k0}deg)`},{transform:`perspective(1600px) rotateY(${k1}deg)`}],{duration:720,easing:'cubic-bezier(.45,.05,.25,1)',fill:'forwards'});
      leaf.querySelector('.bk-shade').animate([{opacity:0},{opacity:.55,offset:.5},{opacity:0}],{duration:720});
      if(keep)setTimeout(()=>keep.remove(),360);
      a.onfinish=()=>{leaf.remove();if(keep)keep.remove();page.innerHTML=nw;D.bind(st,'scene');if(fxOK())page.querySelectorAll('.dlc').forEach((c,i)=>c.animate([{transform:'translateY(-6px)',opacity:.6},{transform:'none',opacity:1}],{duration:300,delay:i*30,easing:EZ.out}));};
      rib();};
    st.querySelectorAll('[data-bk]').forEach(b=>b.onclick=()=>turn(+b.dataset.bk));
    const bk=$('#bkBook');let x0=null;bk.addEventListener('touchstart',e=>{x0=e.touches[0].clientX;},{passive:true});
    bk.addEventListener('touchend',e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>55)turn(dx<0?1:-1);},{passive:true});},
  trans(st,dir,go){const b=$('#bkBook');if(!b||dir<0){go();return;}const r=b.getBoundingClientRect();go();
    for(let i=0;i<3;i++){const l=document.createElement('div');l.className='dlx bk-riffle';Object.assign(l.style,{left:(r.left+r.width/2)+'px',top:r.top+'px',width:(r.width/2-8)+'px',height:r.height+'px'});document.body.appendChild(l);
      l.animate([{transform:'perspective(1600px) rotateY(0deg)'},{transform:'perspective(1600px) rotateY(-180deg)'}],{duration:420,delay:i*110,easing:'cubic-bezier(.5,0,.3,1)',fill:'both'}).onfinish=()=>l.remove();D.later(()=>sfx('page'),i*110);}}
});

/* ---------- 2. Таверна (Hearthstone) ---------- */
D.reg({id:'tavern',big:'hs',n:'Таверна',from:'Hearthstone',ic:'🔥',sw:'radial-gradient(circle at 30% 80%,#ff8a2a,#5a2a10 55%,#1d0f07)',
  d:'Каменный зал, огонь камина, искры. Фильмы — сундуки (трясутся, если внутри новые карты), крышка открывается со светом, карты раздаются на стол.',
  bg:`<div class="tv-fire"></div>${motes(16,'tv-ember')}`,title:'Таверна',sub:'Сундуки с фразами',
  home(F){return `${D.lang()}${D.groups(F).map(g=>`<h3 class="tv-sign"><span>${D.kindName(g.k)}</span></h3><div class="tv-shelf">${g.L.map(sh=>`<button class="tv-chest${sh.nw?' nw':''}${sh.full?' full':''}" data-show="${E(sh.k)}" data-own style="--c:${th(sh.s0)}">
      <span class="tv-box"><span class="tv-light"></span><span class="tv-lid"></span><span class="tv-front"><i class="tv-med" style="background-image:${D.poster(sh.s0)}"></i><i class="tv-lock"></i></span></span><b>${E(sh.k)}</b><small>${sh.g} / ${sh.t}</small></button>`).join('')}</div>`).join('')}`;},
  film(sh){return `${D.crumb(D.kindName(sh.kind),sh.k)}<div class="tv-table">${sh.L.map(s=>{const [g,t]=D.cnt([s]);return `<button class="tv-deck" data-sid="${s.id}" style="--c:${th(s)};--cv:${D.cover(s)}"><span class="tv-stack"><i></i><i></i><i class="tv-top"></i></span><b>${E(s.sub||s.title)}</b><small>${E(s.ep||'')} · ${g}/${t}</small></button>`;}).join('')}</div>`;},
  scene(s){return `${D.crumb(dictFilm(s),s.sub||s.title)}<div class="tv-table tv-cards">${epsHTML(s,e=>`<h4 class="tv-plank">Эпизод ${e.pi+1} · ${E(e.p.t)}</h4>`,'hs')}</div>`;},
  after(st,lvl,dir){
    st.querySelectorAll('.tv-chest').forEach(b=>b.onclick=()=>{if(b.classList.contains('open'))return;b.classList.add('open');sfx('unlock');haptic('medium');
      if(fxOK()){const r=b.querySelector('.tv-box').getBoundingClientRect();fxEmit(r.left+r.width/2,r.top+r.height*.3,{pack:'fire',n:34,v:6,a:-Math.PI/2,spread:1.4});}
      D.later(()=>D.open({show:b.dataset.show,sid:null}),fxOK()?720:0);});
    if(lvl==='scene'&&dir>0)D.deal(st,innerWidth/2,innerHeight*.12,{s0:.4});},
  noAnim:false
});

/* ---------- 3. Кинохранилище ---------- */
D.reg({id:'vault',n:'Кинохранилище',from:'наш кино-вайб в духе HS',ic:'🎞',sw:'linear-gradient(160deg,#16313a,#0a1418 60%),#0a1418',
  d:'Архив студии: стеллажи с коробками плёнки, неон «АРХИВ». Открыл коробку — бобина крутится и разматывается в плёнку, кадры с субтитрами — это карты.',
  bg:`<div class="va-beam"></div>${motes(20,'dl-dust va-d')}`,title:'Кинохранилище',sub:'Архив плёнок с фразами',
  home(F){return `${D.lang()}<div class="va-neon"><span>А</span>Р<span>Х</span>ИВ</div>${D.groups(F).map(g=>`<h3 class="va-lbl">${D.kindName(g.k)}</h3><div class="va-shelf">${g.L.map(sh=>`<button class="va-can" data-show="${E(sh.k)}" data-own style="--p:${D.pct(sh.g,sh.t)};--c:${th(sh.s0)}">
      <span class="va-tin"><span class="va-reel"></span><span class="va-lid"><i class="va-ring"></i><i class="va-pst" style="background-image:${D.poster(sh.s0)}"></i></span></span><span class="va-tape">${E(sh.k)}</span><small>${sh.g} / ${sh.t}</small></button>`).join('')}</div>`).join('')}`;},
  film(sh){return `${D.crumb(D.kindName(sh.kind),sh.k)}<div class="va-reels">${sh.L.map((s,i)=>{const [g,t]=D.cnt([s]);return `<button class="va-rl" data-sid="${s.id}" style="--c:${th(s)}"><span class="va-spin"></span><span><em>Бобина ${i+1}</em><b>${E(s.sub||s.title)}</b><small>${D.ep(s.parts.length)} · ${g}/${t}</small></span></button>`;}).join('')}</div>`;},
  scene(s){return `${D.crumb(dictFilm(s),s.sub||s.title)}<div class="va-strip" id="vaStrip">${D.eps(s).map(e=>`<div class="va-lead"><i>${e.pi+1}</i><b>${E(e.p.t)}</b><small>${e.c.filter(c=>c.got).length} / ${e.c.length}</small></div>${e.c.map(c=>`<button class="va-fr${c.got?'':' lock'} r-${RN[c.rar]}${c.m>=3?' mx':''}" data-c="${c.k}" style="--c:${th(s)}">
      <span class="va-img"><i style="background-image:${(c.n%2?D.art:D.art2)(s,c.pi)};${D.crop(c)}"></i>${c.got?`<span class="va-sub">${E(D.T(c.f))}</span>`:'<span class="va-nd">не проявлено</span>'}${c.nw?'<em class="va-new">NEW</em>':''}</span>
      <span class="va-meta"><em>КАДР ${String(c.n).padStart(3,'0')}${c.got?` · ${D.RT[RN[c.rar]].toUpperCase()}`:''}</em>${c.got?`<span>${E(c.f.ru)}</span>`:`<span>Посмотри эпизод ${c.pi+1}</span>`}${c.got?`<i class="va-m">${D.mp(c.m)}</i>`:''}</span></button>`).join('')}`).join('')}</div>`;},
  after(st,lvl,dir){
    st.querySelectorAll('.va-can').forEach(b=>b.onclick=()=>{if(b.classList.contains('open'))return;b.classList.add('open');sfx('reel');haptic('medium');D.later(()=>sfx('reel'),260);D.later(()=>D.open({show:b.dataset.show,sid:null}),fxOK()?820:0);});
    if(lvl==='scene'&&dir>0&&fxOK()){const sp=$('#vaStrip');if(sp){sp.animate([{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0% 0)'}],{duration:1300,easing:'cubic-bezier(.3,.6,.2,1)'});for(let i=0;i<6;i++)D.later(()=>sfx('reel'),i*180);}}},
  noAnim:true
});

/* ---------- 4. Сеты (дополнения Hearthstone) ---------- */
D.reg({id:'sets',big:'st',n:'Сеты',from:'наборы-дополнения HS',ic:'💠',sw:'radial-gradient(circle at 50% 40%,#5b4bff,#1b1440 70%)',
  d:'Каждая сцена — набор со своей эмблемой и кольцом прогресса; собрал всё — эмблема золотая. Внутри карты по редкости: сначала легендарки.',
  bg:`<div class="st-sky"></div>${motes(30,'st-star')}`,title:'Наборы',sub:'Собери каждую сцену целиком',
  home(F){return `${D.lang()}${F.map(sh=>`<h3 class="st-film"><span>${E(sh.k)}</span><em>${sh.g} / ${sh.t}</em></h3><div class="st-grid">${sh.L.map(s=>{const [g,t]=D.cnt([s]);return `<button class="st-set${g===t&&t?' full':''}" data-sid="${s.id}" style="--pp:${D.pct(g,t)};--c:${th(s)}">
      <span class="st-emb"><span class="st-ring"></span><span class="st-hex"><i style="background-image:${D.cover(s)}"></i></span>${g===t&&t?'<i class="st-crown">★</i>':''}</span><b>${E(s.sub||s.title)}</b><small>${g} / ${t}</small></button>`;}).join('')}</div>`).join('')}`;},
  film(sh){return this.home([sh]);},
  scene(s){const C=D.cards(s),[g,t]=D.cnt([s]),R=[4,3,2,1].map(r=>({r,L:C.filter(c=>c.rar===r)})).filter(x=>x.L.length);
    return `${D.crumb(dictFilm(s),'Набор')}<div class="st-head${g===t&&t?' full':''}" style="--pp:${D.pct(g,t)};--c:${th(s)}"><span class="st-emb big"><span class="st-ring"></span><span class="st-hex"><i style="background-image:${D.cover(s)}"></i></span></span>
      <div><em>${E(dictFilm(s))}</em><b>${E(s.sub||s.title)}</b><span class="st-num"><b>${g}</b> / ${t} карт · ${D.pct(g,t)}%</span>${g===t&&t?'<span class="st-gold">Набор собран</span>':`<small>До золотой эмблемы — ${t-g} ${plural(t-g,['карта','карты','карт'])}</small>`}</div></div>
      ${R.map(x=>`<h4 class="st-rh r-${RN[x.r]}"><i></i>${D.RT[RN[x.r]]} <em>${x.L.filter(c=>c.got).length}/${x.L.length}</em></h4><div class="dl-grid">${x.L.map((c,i)=>D.cardHTML(c,i,{cls:'st'})).join('')}</div>`).join('')}`;},
  after(st,lvl,dir){if(lvl==='scene'&&fxOK()){const h=st.querySelector('.st-head .st-emb');if(h)D.later(()=>{fxAt(h,{n:24,v:5,pack:st.querySelector('.st-head.full')?'dl_leg':'dl_rare'});},900);}},
  skip1:true
});
})();

(function(){'use strict';const D=DL,S=D.S,th=D.th,RN=D.RN,E=t=>esc(t);
const epsHTML=(s,head,cls)=>D.eps(s).map(e=>`${head(e)}<div class="dl-grid">${e.c.map((c,i)=>D.cardHTML(c,i,{cls})).join('')}</div>`).join('');
const pickPh=s=>{const L=s.parts.flatMap((p,pi)=>scAct(p.ph).map(f=>({f,p,pi})));return L.length?L[D.hs(s.id+new Date().getHours())%L.length]:null;};
const live=(el,s)=>{const x=pickPh(s);if(x&&el)D.loopVid(el,s,x.pi,x.f,x.p);};

/* ---------- 5. Галерея живых портретов ---------- */
D.reg({id:'gallery',big:'gl',n:'Галерея живых портретов',from:'выбор героя в HS + Gwent',ic:'🎭',sw:'linear-gradient(160deg,#3a2a1a,#0b0806)',
  d:'Фильмы — высокие портреты в ряд. Центральный оживает (кусок сцены без звука), остальные в тени. Собрал всё — золотая рамка. Карты как в Gwent, выученные «живые».',
  bg:`<div class="gl-bg" id="glBg"></div>`,title:'Галерея',sub:'Живые портреты фильмов',
  home(F){return `${D.lang()}<div class="gl-row" id="glRow">${F.map((sh,i)=>`<button class="gl-p${sh.full?' full':''}" data-show="${E(sh.k)}" data-own data-i="${i}" data-ls="${sh.s0.id}" style="--c:${th(sh.s0)}"><span class="gl-frame"><span class="gl-img" style="background-image:${D.poster(sh.s0)}"></span><span class="gl-live"></span><i class="gl-sh"></i></span>
      <span class="gl-name"><b>${E(sh.k)}</b><small>${D.kindName(sh.kind)} · ${sh.g} / ${sh.t}</small>${D.bar(sh.g,sh.t)}</span></button>`).join('')}</div><p class="gl-hint">Листай — портрет оживает · нажми на центральный</p>`;},
  film(sh){return `${D.crumb(D.kindName(sh.kind),sh.k)}<div class="gl-hero" style="--c:${th(sh.s0)}"><span class="gl-img" style="background-image:${D.cover(sh.s0)}"></span><span class="gl-live" data-ls="${sh.s0.id}"></span><div class="gl-ht"><b>${E(sh.k)}</b><small>${sh.g} / ${sh.t} карт · ${D.sc(sh.L.length)}</small></div></div>
    <div class="gl-scl">${sh.L.map(s=>{const [g,t]=D.cnt([s]);return `<button class="gl-sc" data-sid="${s.id}" style="--c:${th(s)}"><span class="gl-th" style="background-image:${D.cover(s)}"></span><span><b>${E(s.sub||s.title)}</b><small>${E(s.ep||'')} · ${g}/${t}</small></span></button>`;}).join('')}</div>`;},
  scene(s){return `${D.crumb(dictFilm(s),s.sub||s.title)}<div class="gl-hero sm" style="--c:${th(s)}"><span class="gl-img" style="background-image:${D.cover(s)}"></span><span class="gl-live" data-ls="${s.id}"></span></div>${epsHTML(s,e=>`<h4 class="gl-eh">Эпизод ${e.pi+1} · ${E(e.p.t)}</h4>`,'gl')}`;},
  after(st,lvl){const bg=$('#glBg');
    if(lvl!=='home'){const el=st.querySelector('.gl-live[data-ls]');if(el)live(el,scOf(el.dataset.ls));if(bg)bg.style.backgroundImage=D.cover(scOf(S.sid||(st.querySelector('[data-ls]')||{}).dataset.ls)||SCENES[0]);return;}
    const row=$('#glRow');if(!row)return;const ps=[...row.querySelectorAll('.gl-p')];let cur=-1,t=0;
    const pick=()=>{const R=row.getBoundingClientRect(),cx=R.left+R.width/2;let best=0,bd=1e9;ps.forEach((p,i)=>{const r=p.getBoundingClientRect(),d=Math.abs(r.left+r.width/2-cx);if(d<bd){bd=d;best=i;}});
      if(best===cur)return;cur=best;ps.forEach((p,i)=>p.classList.toggle('cur',i===best));D.stopVids(row);sfx('tick');haptic('sel');
      const p=ps[best],s=scOf(p.dataset.ls);if(bg)bg.style.backgroundImage=D.poster(s);clearTimeout(t);t=setTimeout(()=>{if(p.classList.contains('cur'))live(p.querySelector('.gl-live'),s);},450);};
    row.addEventListener('scroll',()=>{cancelAnimationFrame(row._r);row._r=requestAnimationFrame(pick);},{passive:true});
    ps.forEach((p,i)=>p.onclick=()=>{if(i!==cur){p.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});return;}
      sfx('reward');haptic('medium');p.classList.add('zgo');if(fxOK())fxAt(p,{pack:'cine',n:26,v:6});D.later(()=>D.open({show:p.dataset.show,sid:null}),fxOK()?520:0);});
    requestAnimationFrame(()=>{const f=ps[0];if(f){row.scrollLeft=0;pick();}});}
});

/* ---------- 6. Карусель (Marvel Snap) ---------- */
const SN={k:null,sid:null,i:0};
const snCard=(c,i)=>{const {s,f,pi}=c,art=(c.n%2?D.art:D.art2)(s,pi);
  if(!c.got)return `<button class="sn-c dlt lock" data-c="${c.k}" data-own style="--c:${th(s)}"><span class="sn-frame"><span class="sn-art" style="background-image:${art}"></span></span><b class="sn-q">?</b><small class="sn-lk">Эпизод ${pi+1}</small></button>`;
  return `<button class="sn-c dlt r-${RN[c.rar]}${c.m>=3?' mx':''}" data-c="${c.k}" data-own style="--c:${th(s)}"><span class="sn-pop" style="background-image:${art}"></span><span class="sn-frame"><span class="sn-art" style="background-image:${art}"></span><i class="sn-ink"></i></span>
    <i class="sn-cost">${c.m}</i><i class="sn-pow">${['','I','II','III','IV'][c.rar]}</i><b class="sn-en">${E(D.T(f))}</b><span class="sn-ru">${E(f.ru)}</span>${c.nw?'<i class="sn-new">NEW</i>':''}<i class="dlc-foil"></i></button>`;};
D.reg({id:'snap',big:'sn',card:snCard,n:'Карусель',from:'Marvel Snap',ic:'🌀',sw:'linear-gradient(135deg,#ff3d7f,#7b2cff 50%,#00d4ff)',noTilt:true,noAnim:true,
  d:'Карты в полный рост листаются свайпом с 3D-поворотом, арт вылезает из рамки, фон перекрашивается под карту. Сверху — фильмы и сцены кружками.',
  bg:`<div class="sn-bg"><i></i><i></i><i></i></div>`,title:'Коллекция',sub:'Листай карты свайпом',
  home(F){if(!F.some(x=>x.k===SN.k)){SN.k=F[0]&&F[0].k;SN.sid=null;SN.i=0;}const sh=F.find(x=>x.k===SN.k);if(!sh)return D.lang();
    const L=(SN.sid?sh.L.filter(s=>s.id===SN.sid):sh.L).flatMap(s=>D.cards(s));if(SN.i>=L.length)SN.i=0;
    return `${D.lang()}<div class="sn-films">${F.map(x=>`<button class="sn-fc${x.k===SN.k?' on':''}" data-snk="${E(x.k)}" style="--c:${th(x.s0)}"><i style="background-image:${D.poster(x.s0)}"></i><small>${E(x.k)}</small></button>`).join('')}</div>
      ${sh.L.length>1?`<div class="sn-scs"><button data-sns="" class="${SN.sid?'':'on'}">Все сцены</button>${sh.L.map(s=>`<button data-sns="${s.id}" class="${SN.sid===s.id?'on':''}">${E(s.sub||s.title)}</button>`).join('')}</div>`:''}
      <div class="sn-car" id="snCar">${L.map((c,i)=>snCard(c,i)).join('')}</div>
      <div class="sn-ctl"><button class="sn-ar" data-snd="-1">${ui('back')}</button><span id="snNum"></span><button class="sn-ar" data-snd="1">${ui('fwd')}</button></div>`;},
  film(sh){SN.k=sh.k;S.show=null;S.sid=null;return this.home(D.films());},
  scene(s){SN.k=dictFilm(s);SN.sid=null;SN.i=0;S.show=null;S.sid=null;return this.home(D.films());},
  after(st){const car=$('#snCar');if(!car)return;const cs=[...car.querySelectorAll('.sn-c')],n=cs.length;let drag=null;const root=D.root;
    const place=(off,anim)=>{const W=cs[0]?cs[0].offsetWidth:200;cs.forEach((c,j)=>{const d=j-SN.i-(off||0),a=Math.abs(d);
        c.style.transition=anim?'transform .55s cubic-bezier(.2,.9,.25,1.05),opacity .4s,filter .4s':'none';
        c.style.transform=`translate(-50%,0) translateX(${d*W*.62}px) translateZ(${-a*90}px) rotateY(${-Math.max(-2,Math.min(2,d))*26}deg) scale(${1-Math.min(a,3)*.08})`;
        c.style.zIndex=100-Math.round(a*10);c.style.opacity=a>2.6?0:1;c.style.filter=a>.5?`brightness(${Math.max(.45,1-a*.25)})`:'none';
        const pop=c.querySelector('.sn-pop,.sn-art');if(pop)c.style.setProperty('--px',(d*-18).toFixed(1)+'px');});
      const c=cs[SN.i];if(c){const col=getComputedStyle(c).getPropertyValue('--c');root.style.setProperty('--snc',col);const k=D.find(c.dataset.c);root.style.setProperty('--snr',k&&k.got?['','#888','#4DA8FF','#B57CFF','#FF9A2E'][k.rar]:'#333');}
      const nm=$('#snNum');if(nm)nm.textContent=n?`${SN.i+1} / ${n}`:'Нет карт';};
    const go=i=>{i=Math.max(0,Math.min(n-1,i));if(i!==SN.i){SN.i=i;sfx('tick');haptic('sel');}place(0,true);};
    place(0,false);requestAnimationFrame(()=>place(0,false));
    car.addEventListener('pointerdown',e=>{drag={x:e.clientX,t:e.target.closest('.sn-c'),m:false};try{car.setPointerCapture(e.pointerId);}catch(x){}});
    car.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x;if(Math.abs(dx)>6)drag.m=true;if(drag.m){const W=cs[0]?cs[0].offsetWidth*.62:150;place(-dx/W,false);}});
    const up=e=>{if(!drag)return;const d=drag;drag=null;const dx=e.clientX-d.x;
      if(!d.m){if(d.t){const j=cs.indexOf(d.t);if(j===SN.i)D.tap(d.t);else go(j);}else place(0,true);return;}
      const W=cs[0]?cs[0].offsetWidth*.62:150;go(Math.round(SN.i-dx/W));};
    car.addEventListener('pointerup',up);car.addEventListener('pointercancel',()=>{drag=null;place(0,true);});
    st.querySelectorAll('[data-snd]').forEach(b=>b.onclick=()=>go(SN.i+ +b.dataset.snd));
    st.querySelectorAll('[data-snk]').forEach(b=>b.onclick=()=>{sfx('tap');SN.k=b.dataset.snk;SN.sid=null;SN.i=0;D.render(1);});
    st.querySelectorAll('[data-sns]').forEach(b=>b.onclick=()=>{sfx('tap');SN.sid=b.dataset.sns||null;SN.i=0;D.render(1);});
    if(!window._snKey){window._snKey=1;document.addEventListener('keydown',e=>{if(!$('#snCar')||$('.dli'))return;if(e.key==='ArrowRight')$('[data-snd="1"]').click();if(e.key==='ArrowLeft')$('[data-snd="-1"]').click();});}
    const fc=st.querySelector('.sn-fc.on');if(fc)fc.scrollIntoView({inline:'center',block:'nearest'});
    if(fxOK())cs.forEach((c,j)=>{if(Math.abs(j-SN.i)<3)c.animate([{opacity:0,translate:'0 40px'},{opacity:1,translate:'0 0'}],{duration:520,delay:Math.abs(j-SN.i)*90,easing:EZ.out,fill:'backwards'});});}
});

/* ---------- 7. Pokémon TCG Pocket ---------- */
const pqCard=(c,i)=>{const {s,f,pi}=c,art=(c.n%2?D.art:D.art2)(s,pi),no=String(c.n).padStart(3,'0');
  if(!c.got)return `<button class="pq dlt lock" data-c="${c.k}" style="--d:${i}"><span class="pq-no">${no}</span><span class="pq-ep">Эпизод ${pi+1}</span></button>`;
  return `<button class="pq dlt r-${RN[c.rar]}${c.m>=3?' mx':''}" data-c="${c.k}" style="--d:${i};--c:${th(s)}"><span class="pq-top"><b>${E(D.T(f))}</b></span><span class="pq-art"><i style="background-image:${art};${D.crop(c)}"></i></span>
    <span class="pq-ru">${E(f.ru)}</span><span class="pq-ft"><i class="pq-dia">${c.rar>=4?'★':'◆'.repeat(c.rar)}</i><em>${no}</em></span>${c.nw?'<i class="pq-new">NEW</i>':''}<i class="pq-holo"></i></button>`;};
D.reg({id:'pocket',big:'pq',card:pqCard,n:'Карманный альбом',from:'Pokémon TCG Pocket',ic:'💎',sw:'linear-gradient(160deg,#f4f7fc,#cfdcf0)',
  d:'Светлый чистый альбом. Фильмы — бустеры с фольгой, карты с голографией за пальцем, редкость ромбами ◆◆◆, закрытые — серые места с номером. Кнопка «Открыть пак» — разрезать пальцем.',
  bg:`<div class="pq-bgl"><i></i><i></i></div>`,title:'Мои карты',sub:'Альбом наборов',
  home(F){return `${D.lang()}<div class="pq-packs">${F.map(sh=>`<button class="pq-pack" data-show="${E(sh.k)}" style="--c:${th(sh.s0)}"><span class="pq-pq"><i class="pq-pa" style="background-image:${D.poster(sh.s0)}"></i><i class="pq-pf"></i><b>${E(sh.k)}</b></span><span class="pq-pt"><b>${sh.g}</b>/${sh.t}</span>${D.bar(sh.g,sh.t)}</button>`).join('')}</div>`;},
  film(sh){return `${D.crumb(D.kindName(sh.kind),sh.k)}<div class="pq-packs">${sh.L.map(s=>{const [g,t]=D.cnt([s]);return `<button class="pq-pack" data-sid="${s.id}" style="--c:${th(s)}"><span class="pq-pq"><i class="pq-pa" style="background-image:${D.cover(s)}"></i><i class="pq-pf"></i><b>${E(s.sub||s.title)}</b></span><span class="pq-pt"><b>${g}</b>/${t}</span>${D.bar(g,t)}</button>`;}).join('')}</div>`;},
  scene(s){const [g,t]=D.cnt([s]);return `${D.crumb(dictFilm(s),s.sub||s.title)}<div class="pq-head" style="--c:${th(s)}"><i style="background-image:${D.cover(s)}"></i><span><b>${g} / ${t}</b><small>карт собрано</small>${D.bar(g,t)}</span><button class="pq-open" id="pqOpen">Открыть пак</button></div>
    ${D.eps(s).map(e=>`<h4 class="pq-eh">Эпизод ${e.pi+1} · ${E(e.p.t)}</h4><div class="pq-grid">${e.c.map((c,i)=>pqCard(c,i)).join('')}</div>`).join('')}`;},
  after(st,lvl){const b=$('#pqOpen');if(b)b.onclick=()=>{sfx('tap');const s=scOf(S.sid),L=D.cards(s).filter(c=>c.got).sort(()=>Math.random()-.5).slice(0,5).map(c=>Object.assign({},c));const k=(D.PK||[]).find(x=>x.id==='cut');if(k&&L.length)k.run(L);else toast('Нет карт');};}
});

/* ---------- 8. Видеопрокат (VHS) ---------- */
const vhCol=s=>['#111','#e9e4d8','#b3121b',th(s),'#1b2a6b'][D.hs(s.id)%5];
const vhCard=(c,i)=>{const {s,f,pi}=c,art=(c.n%2?D.art:D.art2)(s,pi);
  if(!c.got)return `<button class="vh dlt lock" data-c="${c.k}"><span class="vh-gap">НЕТ<br>В НАЛИЧИИ</span><small>кассета ${pi+1}</small></button>`;
  return `<button class="vh dlt r-${RN[c.rar]}${c.m>=3?' mx':''}" data-c="${c.k}" style="--c:${th(s)}"><span class="vh-cv"><i style="background-image:${art};${D.crop(c)}"></i><span class="vh-tt">${E(D.T(f))}</span></span>
    <span class="vh-ru">${E(f.ru)}</span><span class="vh-st">${'★'.repeat(c.m)}${'☆'.repeat(3-c.m)}<em>${['','','HIT','СУПЕРХИТ','КУЛЬТ'][c.rar]}</em></span>${c.nw?'<i class="vh-new">NEW</i>':''}${c.due?'<i class="vh-due">ВЕРНИ<br>КАССЕТУ</i>':''}</button>`;};
D.vhShelf=F=>`<div class="vh-sign">ВИДЕО<b>ПРОКАТ</b></div>${D.groups(F).map(g=>`<div class="vh-rack"><span class="vh-tag">${D.kindName(g.k)}</span><div class="vh-shelf">${g.L.map(sh=>`<button class="vh-sp${sh.nw?' nw':''}" data-show="${E(sh.k)}" data-own style="--c:${th(sh.s0)};--sb:${vhCol(sh.s0)};--sf:${vhCol(sh.s0)==='#e9e4d8'?'#161616':'#fff'};--hh:${150+D.hs(sh.k)%40}px"><i class="vh-sp-p" style="background-image:${D.poster(sh.s0)}"></i><b>${E(sh.k)}</b><em>${sh.g}/${sh.t}</em>${sh.nw?'<i class="vh-n">NEW</i>':''}</button>`).join('')}</div></div>`).join('')}`;
D.vhInsert=(btn,go)=>{if(!fxOK()){go();return;}const r=btn.getBoundingClientRect(),sh=D.films().find(x=>x.k===btn.dataset.show);if(!sh){go();return;}
  const W=Math.min(innerWidth*.62,260),H=W*1.5,o=document.createElement('div');o.className='dlx vh-ov';
  o.innerHTML=`<div class="vh-fly" style="background-image:${D.poster(sh.s0)}"><i class="vh-shine"></i></div><div class="vh-vcr"><i class="vh-slot"></i><span>PLAY ▶</span><em class="vh-led">00:00</em></div><div class="vh-noise"><b>▶ PLAY</b></div>`;document.body.appendChild(o);
  const fl=o.querySelector('.vh-fly'),cx=innerWidth/2,cy=innerHeight*.42;sfx('whoosh');haptic('light');
  fl.style.width=W+'px';fl.style.height=H+'px';
  const a=fl.animate([{transform:`translate(${r.left+r.width/2-W/2}px,${r.top+r.height/2-H/2}px) scale(${r.width/W},${r.height/H}) rotateY(80deg)`},{transform:`translate(${cx-W/2}px,${cy-H/2}px) scale(1.04) rotateY(-8deg)`,offset:.7},{transform:`translate(${cx-W/2}px,${cy-H/2}px) scale(1) rotateY(0deg)`}],{duration:700,easing:EZ.out,fill:'forwards'});
  const vcr=o.querySelector('.vh-vcr');vcr.animate([{transform:'translate(-50%,120%)'},{transform:'translate(-50%,0)'}],{duration:500,delay:350,easing:EZ.out,fill:'both'});
  let done=false;const fin=()=>{if(done)return;done=true;go();o.animate([{opacity:1},{opacity:0}],{duration:300,fill:'forwards'}).onfinish=()=>o.remove();};
  o.onclick=fin;
  a.onfinish=()=>{if(done)return;const vr=vcr.getBoundingClientRect();sfx('reel');
    fl.animate([{transform:`translate(${cx-W/2}px,${cy-H/2}px) scale(1)`},{transform:`translate(${vr.left+vr.width/2-W/2}px,${vr.top+18-H/2}px) scale(.42,.08)`,opacity:.9}],{duration:520,delay:200,easing:EZ.in,fill:'forwards'}).onfinish=()=>{
      if(done)return;haptic('medium');const n=o.querySelector('.vh-noise');n.style.display='grid';sfx('tick');
      n.animate([{opacity:0},{opacity:1,offset:.15},{opacity:1,offset:.8},{opacity:0}],{duration:650,fill:'forwards'});setTimeout(fin,420);};};};
D.reg({id:'vhs',big:'vh',card:vhCard,n:'Видеопрокат',from:'Blockbuster 90-х / VHS',ic:'📼',sw:'linear-gradient(160deg,#2a0f3a,#0d0614 60%),#0d0614',
  d:'Полки с кассетами (корешки, NEW, неон «ВИДЕОПРОКАТ»). Кассета выезжает, разворачивается обложкой, уходит в видик — помехи, PLAY. Карты — обложки кассет, «Пора повторить» = «Верни кассету».',
  bg:`<div class="vh-floor"></div>`,title:'Видеопрокат',sub:'Твоя полка фраз',
  home(F){return `${D.lang()}${D.vhShelf(F)}`;},
  film(sh){return `${D.crumb(D.kindName(sh.kind),sh.k)}<div class="vh-tapes">${sh.L.map((s,i)=>{const [g,t]=D.cnt([s]);return `<button class="vh-tape" data-sid="${s.id}" style="--c:${th(s)}"><span class="vh-lbl"><em>КАССЕТА ${i+1} · SP</em><b>${E(s.sub||s.title)}</b><small>${g}/${t} фраз</small></span><i class="vh-reels"><i></i><i></i></i></button>`;}).join('')}</div>`;},
  scene(s){const [g,t]=D.cnt([s]);return `${D.crumb(dictFilm(s),s.sub||s.title)}<div class="vh-osd"><span><i class="vh-rec"></i>PLAY ▶</span><span>SP</span><span>${g}/${t}</span></div>
    ${D.eps(s).map(e=>`<h4 class="vh-eh"><span>СТОРОНА ${String.fromCharCode(65+e.pi)}</span>${E(e.p.t)}</h4><div class="dl-grid vh-grid">${e.c.map((c,i)=>vhCard(c,i)).join('')}</div>`).join('')}`;},
  after(st,lvl){st.querySelectorAll('.vh-sp').forEach(b=>b.onclick=()=>{if(b.classList.contains('out'))return;b.classList.add('out');D.vhInsert(b,()=>D.open({show:b.dataset.show,sid:null}));});
    if(lvl==='scene'&&fxOK()){const o=st.querySelector('.vh-osd');if(o)o.animate([{opacity:0,filter:'blur(6px)'},{opacity:1,filter:'none'}],{duration:500});}}
});

/* ---------- 9. Слэбы (Topps Chrome / PSA) ---------- */
const GR=[['RAW',''],['8','NM-MT'],['9','MINT'],['10','GEM MT']],PAR=['','Base','Refractor','Purple Refractor','Gold Refractor'],SER=['','','','/99','/50'];
const slCard=(c,i)=>{const {s,f,pi}=c,art=(c.n%2?D.art:D.art2)(s,pi),no=String(c.n).padStart(2,'0');
  if(!c.got)return `<button class="sl dlt lock" data-c="${c.k}"><span class="sl-sleeve"><b>?</b><small>Эпизод ${pi+1}</small></span></button>`;
  const raw=c.m===0;
  return `<button class="sl dlt r-${RN[c.rar]}${raw?' raw':''}${c.m>=3?' gem':''}" data-c="${c.k}" style="--c:${th(s)}">${raw?'':`<span class="sl-lab"><span class="sl-l1"><b>2026 KINO CHROME</b><em>${E(dictFilm(s))}</em><small>#${no} ${PAR[c.rar]}</small></span><span class="sl-gr"><small>${GR[c.m][1]}</small><b>${GR[c.m][0]}</b></span></span>`}
    <span class="sl-win"><span class="sl-card"><span class="sl-art" style="background-image:${art}"></span><span class="sl-nm"><b>${E(D.T(f))}</b><small>${E(f.ru)}</small></span>${SER[c.rar]?`<em class="sl-ser">${String(1+D.hs(c.k)%40).padStart(2,'0')}${SER[c.rar]}</em>`:''}<i class="sl-ref"></i></span></span>${raw?'<i class="sl-rawt">RAW · сдай в грейдинг: выучи</i>':''}</button>`;};
D.snCard=snCard;D.slCard=slCard;
D.reg({id:'slab',big:'sl',card:slCard,n:'Хром-слэбы',from:'Topps Chrome / грейдинг PSA',ic:'💿',sw:'linear-gradient(135deg,#d9dde3,#8a96a6 40%,#2b313a)',
  d:'Взрослые коллекционные карточки: хром-рефракторы переливаются за пальцем, выученная фраза — в пластиковом слэбе с оценкой (GEM MT 10 = выучено), редкие — с номером «07/50».',
  bg:`<div class="sl-bgl"></div>`,title:'Kino Chrome',sub:'Грейдинг твоих фраз',
  home(F){return `${D.lang()}<div class="sl-boxes">${F.map(sh=>`<button class="sl-box" data-show="${E(sh.k)}" style="--c:${th(sh.s0)}"><span class="sl-bx"><i class="sl-bxa" style="background-image:${D.poster(sh.s0)}"></i><span class="sl-bxt"><em>2026</em><b>KINO<br>CHROME</b><small>${E(sh.k)}</small></span><i class="sl-bxf"></i></span><small>Hobby box · ${sh.g}/${sh.t}</small></button>`).join('')}</div>`;},
  film(sh){return `${D.crumb(D.kindName(sh.kind),sh.k)}<div class="sl-boxes">${sh.L.map(s=>{const [g,t]=D.cnt([s]);return `<button class="sl-box" data-sid="${s.id}" style="--c:${th(s)}"><span class="sl-bx"><i class="sl-bxa" style="background-image:${D.cover(s)}"></i><span class="sl-bxt"><em>SERIES</em><b>${E(s.sub||s.title)}</b></span><i class="sl-bxf"></i></span><small>${g}/${t}</small></button>`;}).join('')}</div>`;},
  scene(s){const C=D.cards(s),n10=C.filter(c=>c.got&&c.m>=3).length;return `${D.crumb(dictFilm(s),s.sub||s.title)}<div class="sl-pop"><b>${n10}</b><span>GEM MT 10<small>в этой сцене</small></span><b>${C.filter(c=>c.got).length}</b><span>карт<small>из ${C.length}</small></span></div>
    ${D.eps(s).map(e=>`<h4 class="sl-eh">Эпизод ${e.pi+1} · ${E(e.p.t)}</h4><div class="sl-grid">${e.c.map((c,i)=>slCard(c,i)).join('')}</div>`).join('')}`;}
});

/* ---------- 10. Винил ---------- */
const VN={i:0};
D.reg({id:'vinyl',n:'Пластинки',from:'музыкальный магазин, винил',ic:'💽',sw:'radial-gradient(circle,#222 0 18%,#c33 19% 30%,#111 31%)',noTilt:true,
  d:'Ящик с пластинками: листаешь конверты пальцем. Сцена — пластинка на проигрывателе, фразы — треки: нажал — пластинка крутится и звучит фраза из сцены.',
  bg:`<div class="vn-bgl"></div>`,title:'Пластинки',sub:'Твои фразы — треки',
  home(F){if(VN.i>=F.length)VN.i=0;return `${D.lang()}<div class="vn-crate" id="vnCrate"><div class="vn-stack">${F.map((sh,i)=>`<button class="vn-sl" data-show="${E(sh.k)}" data-own data-i="${i}" style="--c:${th(sh.s0)};background-image:${D.poster(sh.s0)}"><span class="vn-tt"><b>${E(sh.k)}</b><small>${sh.g} / ${sh.t} треков</small></span>${sh.full?'<i class="vn-gold">GOLD</i>':''}</button>`).join('')}</div><div class="vn-box"><span>${D.kindName('film')} · ${D.kindName('series')} · ${D.kindName('interview')}</span></div></div>
    <div class="vn-nav"><button data-vn="-1" aria-label="Назад">▲</button><span id="vnN"></span><button data-vn="1" aria-label="Дальше">▼</button></div>`;},
  film(sh){return `${D.crumb(D.kindName(sh.kind),sh.k)}<div class="vn-lps">${sh.L.map((s,i)=>{const [g,t]=D.cnt([s]);return `<button class="vn-lp" data-sid="${s.id}" style="--c:${th(s)}"><span class="vn-mini" style="--lab:${D.cover(s)}"></span><span><em>LP ${i+1}</em><b>${E(s.sub||s.title)}</b><small>${g}/${t} треков</small></span></button>`;}).join('')}</div>`;},
  scene(s){let n=0;return `${D.crumb(dictFilm(s),s.sub||s.title)}<div class="vn-deck"><div class="vn-plat"><div class="vn-rec" id="vnRec"><i class="vn-lab" style="background-image:${D.cover(s)}"></i></div></div><i class="vn-arm" id="vnArm"></i></div>
    ${D.eps(s).map(e=>{const L=String.fromCharCode(65+e.pi);return `<h4 class="vn-sh">Сторона ${L} · ${E(e.p.t)}</h4><div class="vn-tl">${e.c.map((c,j)=>{const d=Math.max(1,Math.round(c.f.b-c.f.a));
      return c.got?`<div class="vn-tr r-${RN[c.rar]}" data-k="${c.k}"><button class="vn-pl" data-play="${c.k}" aria-label="Играть">${SI.play}</button><span class="vn-tn">${L}${j+1}</span><span class="vn-tx"><b>${E(D.T(c.f))}</b><small>${E(c.f.ru)}</small></span><em>0:${String(d).padStart(2,'0')}</em><button class="vn-cd" data-c="${c.k}" aria-label="Карта">◫</button></div>`
        :`<div class="vn-tr lock"><span class="vn-pl">🔒</span><span class="vn-tn">${L}${j+1}</span><span class="vn-tx"><b>Скрытый трек</b><small>Посмотри эпизод ${e.pi+1}</small></span><em>–:––</em></div>`;}).join('')}</div>`;}).join('')}`;},
  after(st,lvl,dir){
    if(lvl==='home'){const sl=[...st.querySelectorAll('.vn-sl')],N=sl.length;
      const place=an=>{sl.forEach((b,j)=>{const d=j-VN.i;b.style.transition=an?'transform .5s cubic-bezier(.2,.9,.3,1.1),opacity .4s':'none';
          b.style.transform=d<0?`translateY(${60+(-d)*6}%) rotateX(-72deg)`:`translateY(${-d*7}%) translateZ(${-d*24}px) scale(${1-d*.04})`;b.style.zIndex=d<0?200+j:100-d;b.style.opacity=d<-3||d>6?0:1;b.classList.toggle('cur',d===0);});
        const n=$('#vnN');if(n)n.textContent=`${VN.i+1} / ${N}`;};
      const go=i=>{i=Math.max(0,Math.min(N-1,i));if(i===VN.i)return;VN.i=i;sfx('page');haptic('sel');place(true);};place(false);
      st.querySelectorAll('[data-vn]').forEach(b=>b.onclick=()=>go(VN.i+ +b.dataset.vn));
      sl.forEach((b,j)=>b.onclick=()=>{if(j!==VN.i){go(j);return;}sfx('reward');b.classList.add('pull');D.later(()=>D.open({show:b.dataset.show,sid:null}),fxOK()?480:0);});
      const cr=$('#vnCrate');let y0=null;cr.addEventListener('touchstart',e=>{y0=e.touches[0].clientY;},{passive:true});cr.addEventListener('touchend',e=>{if(y0==null)return;const dy=e.changedTouches[0].clientY-y0;y0=null;if(Math.abs(dy)>40)go(VN.i+(dy<0?1:-1));},{passive:true});
      cr.addEventListener('wheel',e=>{e.preventDefault();if(cr._w)return;cr._w=1;setTimeout(()=>cr._w=0,260);go(VN.i+(e.deltaY>0?1:-1));},{passive:false});return;}
    if(lvl!=='scene')return;const rec=$('#vnRec'),arm=$('#vnArm');let tm=0;
    st.querySelectorAll('[data-play]').forEach(b=>b.onclick=()=>{const c=D.find(b.dataset.play);if(!c)return;const tr=b.closest('.vn-tr');
      st.querySelectorAll('.vn-tr.on').forEach(x=>x.classList.remove('on'));const a=Math.max(0,c.f.a-c.p.a-.15),e=c.f.b-c.p.a+.2;
      playSeg(assetUrl(scEpKey(c.s,c.pi,'mp4')),a,e,tr);rec.classList.add('spin');arm.classList.add('on');sfx('tick');clearInterval(tm);
      tm=setInterval(()=>{if(!st.querySelector('.vn-tr.on')||!st.isConnected){clearInterval(tm);rec.classList.remove('spin');arm.classList.remove('on');}},150);});
    if(dir>0&&fxOK()&&rec)rec.animate([{transform:'translateX(120%) rotate(-200deg)'},{transform:'none'}],{duration:900,easing:EZ.out});}
});
})();

(function(){'use strict';const D=DL,S=D.S,th=D.th,RN=D.RN,E=t=>esc(t);
const ROM=n=>['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV'][n-1]||n;
const rot=(k,a)=>((D.hs(k)%(a*20))/10-a).toFixed(1);
const no=c=>String(c.n).padStart(3,'0');
const pickPh=s=>{const L=s.parts.flatMap((p,pi)=>scAct(p.ph).map(f=>({f,p,pi})));return L.length?L[D.hs(s.id+new Date().getHours())%L.length]:null;};

/* ---------- 11. Музей ---------- */
const msV=c=>{const {s,f,pi}=c;
  if(!c.got)return `<button class="ms-v lock" data-c="${c.k}"><span class="ms-case"><em>Экспонат<br>готовится</em></span><span class="ms-ped"></span><span class="ms-plq"><small>Эпизод ${pi+1}</small></span></button>`;
  return `<button class="ms-v dlt r-${RN[c.rar]}${c.m>=3?' mx':''}" data-c="${c.k}" style="--c:${th(s)};--sp:${(D.hs(c.k)%5)}"><span class="ms-cone"></span><span class="ms-case"><span class="ms-item"><i style="background-image:${(c.n%2?D.art:D.art2)(s,pi)}"></i></span><i class="ms-glass"></i></span><span class="ms-ped"></span>
    <span class="ms-plq"><b>${E(D.T(f))}</b><small>${E(f.ru)}</small><em>${D.RT[RN[c.rar]]} · экспонат ${no(c)}</em></span></button>`;};
D.reg({id:'museum',n:'Музей',from:'музей / витрины под стеклом',ic:'🏛',sw:'radial-gradient(ellipse at 50% 0%,#6a1a1a,#1a0606 70%)',
  d:'Тёмный зал. Фильмы — картины в золотых рамах с лампами. В сцене — витрины: над каждой зажигается свет, внутри медленно вращается карта, под ней латунная табличка.',
  bg:`<div class="ms-wallbg"></div><div class="ms-floor"></div>`,title:'Музей фраз',sub:'Постоянная экспозиция',
  home(F){return `${D.lang()}<div class="ms-wall">${F.map((sh,i)=>`<button class="ms-art${sh.full?' full':''}" data-show="${E(sh.k)}" style="--c:${th(sh.s0)}"><span class="ms-lamp"></span><span class="ms-fr"><i style="background-image:${D.poster(sh.s0)}"></i></span><span class="ms-pl"><em>Зал ${ROM(i+1)}</em><b>${E(sh.k)}</b><small>${sh.g} из ${sh.t} экспонатов</small></span></button>`).join('')}</div>`;},
  film(sh){return `${D.crumb(D.kindName(sh.kind),sh.k)}<div class="ms-wall wide">${sh.L.map((s,i)=>{const [g,t]=D.cnt([s]);return `<button class="ms-art" data-sid="${s.id}" style="--c:${th(s)}"><span class="ms-lamp"></span><span class="ms-fr"><i style="background-image:${D.cover(s)}"></i></span><span class="ms-pl"><em>Крыло ${ROM(i+1)}</em><b>${E(s.sub||s.title)}</b><small>${g} из ${t}</small></span></button>`;}).join('')}</div>`;},
  scene(s){return `${D.crumb(dictFilm(s),s.sub||s.title)}${D.eps(s).map(e=>`<h4 class="ms-eh"><span>Зал ${e.pi+1}</span>${E(e.p.t)}</h4><div class="ms-row">${e.c.map(msV).join('')}</div>`).join('')}`;},
  after(st,lvl){if(lvl!=='scene')return;const L=[...st.querySelectorAll('.ms-v:not(.lock)')];if(!fxOK()||!('IntersectionObserver' in window)){L.forEach(x=>x.classList.add('lit'));return;}let q=0;
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){io.unobserve(e.target);const el=e.target;setTimeout(()=>{el.classList.add('lit');if(q++<6)sfx('tick');},(q%4)*140+120);}}),{threshold:.35});L.forEach(x=>io.observe(x));}
});

/* ---------- 12. Досье (нуар) ---------- */
const red=t=>String(t).split(/\s+/).map(w=>`<i style="width:${Math.max(2,Math.min(9,w.length))*.62}em"></i>`).join(' ');
const nrNote=c=>{const {s,f,pi}=c;
  if(!c.got)return `<button class="nr-n lock" data-c="${c.k}" style="--r:${rot(c.k,4)}deg"><i class="nr-pin"></i><b class="nr-red">${red(D.T(f))}</b><em class="nr-sec">СЕКРЕТНО · эп. ${pi+1}</em></button>`;
  return `<button class="nr-n dlt r-${RN[c.rar]}${c.m>=3?' mx':''}" data-c="${c.k}" style="--r:${rot(c.k,4)}deg"><i class="nr-pin"></i><b>${E(D.T(f))}</b><span>${E(f.ru)}</span>${c.rar>=3?'<em class="nr-key">КЛЮЧЕВАЯ УЛИКА</em>':''}${c.due?'<em class="nr-due">ПЕРЕПРОВЕРИТЬ</em>':''}${c.m>=3?'<em class="nr-ok">ДОКАЗАНО</em>':''}</button>`;};
const nrStrings=st=>{const b=$('#nrBoard'),svg=$('#nrStr');if(!b||!svg)return;const R=b.getBoundingClientRect();svg.setAttribute('viewBox',`0 0 ${R.width} ${b.scrollHeight}`);svg.style.height=b.scrollHeight+'px';let h='';
  const pt=el=>{const p=el.querySelector('.nr-pin'),r=(p||el).getBoundingClientRect();return [r.left+r.width/2-R.left,r.top+r.height/2-R.top];};
  b.querySelectorAll('.nr-cl').forEach(cl=>{const pol=cl.querySelector('.nr-pol');if(!pol)return;const [x1,y1]=pt(pol);cl.querySelectorAll('.nr-n:not(.lock)').forEach((n,i)=>{const [x2,y2]=pt(n),mx=(x1+x2)/2,my=Math.max(y1,y2)+30+Math.abs(x2-x1)*.08;
    h+=`<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" style="--l:${Math.round(Math.hypot(x2-x1,y2-y1)*1.3)};--dl:${i*90}ms"/>`;});});
  svg.innerHTML=h;if(fxOK())svg.querySelectorAll('path').forEach((p,i)=>{const l=+p.style.getPropertyValue('--l')||300;p.style.strokeDasharray=l;p.animate([{strokeDashoffset:l},{strokeDashoffset:0}],{duration:900,delay:i*90,easing:'ease-out',fill:'backwards'});});};
D.reg({id:'noir',n:'Досье',from:'Disco Elysium / нуар-детектив',ic:'🕵',sw:'radial-gradient(circle at 40% 40%,#b08a5a,#5a3e22 60%,#2a1c0e)',
  d:'Пробковая доска: полароиды эпизодов, фразы — записки на машинке, красные нитки от кадра к уликам. Закрытые — закрашены чёрным «СЕКРЕТНО». Фильмы — папки «ДЕЛО №».',
  bg:`<div class="nr-smoke"></div>`,title:'Досье',sub:'Улики из фильмов',
  home(F){return `${D.lang()}<div class="nr-files">${F.map((sh,i)=>`<button class="nr-f" data-show="${E(sh.k)}" style="--r:${rot(sh.k,3)}deg"><span class="nr-tab">ДЕЛО № ${String(i+1).padStart(3,'0')}</span><span class="nr-body"><i class="nr-ph" style="background-image:${D.poster(sh.s0)}"></i><i class="nr-clip"></i><b>${E(sh.k)}</b><small>${D.kindName(sh.kind)}</small><span class="nr-cnt">Улик: ${sh.g} / ${sh.t}</span><em class="nr-stamp${sh.full?' ok':''}">${sh.full?'РАСКРЫТО':'В РАБОТЕ'}</em></span></button>`).join('')}</div>`;},
  film(sh){return `${D.crumb(D.kindName(sh.kind),sh.k)}<div class="nr-files">${sh.L.map((s,i)=>{const [g,t]=D.cnt([s]);return `<button class="nr-f" data-sid="${s.id}" style="--r:${rot(s.id,3)}deg"><span class="nr-tab">ЭПИЗОД ДЕЛА ${i+1}</span><span class="nr-body"><i class="nr-ph" style="background-image:${D.cover(s)}"></i><i class="nr-clip"></i><b>${E(s.sub||s.title)}</b><span class="nr-cnt">Улик: ${g} / ${t}</span></span></button>`;}).join('')}</div>`;},
  scene(s){return `${D.crumb(dictFilm(s),s.sub||s.title)}<div class="nr-board" id="nrBoard"><svg class="nr-str" id="nrStr" preserveAspectRatio="none"></svg>${D.eps(s).map(e=>`<div class="nr-cl"><div class="nr-pol" style="--r:${rot(s.id+e.pi,5)}deg"><i class="nr-pin"></i><span class="nr-img" style="background-image:${D.art(s,e.pi)}"></span><b>Эпизод ${e.pi+1}</b><small>${E(e.p.t)}</small></div><div class="nr-notes">${e.c.map(nrNote).join('')}</div></div>`).join('')}</div>`;},
  after(st,lvl){if(lvl!=='scene')return;requestAnimationFrame(()=>nrStrings(st));setTimeout(()=>nrStrings(st),400);const b=$('#nrBoard');if(b&&window.ResizeObserver&&!b._ro){b._ro=new ResizeObserver(()=>nrStrings(st));b._ro.observe(b);}}
});

/* ---------- 13. Persona 5 ---------- */
const ransom=t=>[...t].map((ch,i)=>{const h=D.hs(t+i);return ch===' '?'<i class="p5-sp"></i>':`<span class="p5-l p5-l${h%4}" style="--r:${(h%16)-8}deg">${E(ch)}</span>`;}).join('');
const p5Card=(c,i)=>{const {s,f,pi}=c;
  if(!c.got)return `<button class="p5 dlt lock" data-c="${c.k}" style="--r:${rot(c.k,3)}deg"><span class="p5-q">?</span><small>ЭПИЗОД ${pi+1}</small></button>`;
  return `<button class="p5 dlt r-${RN[c.rar]}${c.m>=3?' mx':''}" data-c="${c.k}" style="--r:${rot(c.k,3)}deg;--c:${th(s)}"><span class="p5-art"><i style="background-image:${(c.n%2?D.art:D.art2)(s,pi)};${D.crop(c)}"></i></span><b class="p5-en">${E(D.T(f))}</b><span class="p5-ru">${E(f.ru)}</span><em class="p5-rk">${['','C','B','A','S'][c.rar]}</em><span class="p5-m">${'★'.repeat(c.m)}</span>${c.nw?'<i class="p5-new">NEW!</i>':''}</button>`;};
D.reg({id:'persona',big:'p5',card:p5Card,n:'Persona 5',from:'Persona 5 (Atlus)',ic:'🎭',sw:'linear-gradient(135deg,#e60012 0 50%,#111 50%)',
  d:'Красно-чёрная графика: косые плашки вылетают по очереди, буквы как из вырезок журнала, переходы — красный росчерк через весь экран. Самое «тиктоковое».',
  bg:`<div class="p5-bgl"><i></i><i></i></div>`,titleHTML:`<h1 class="p5-title">${ransom('СЛОВАРЬ')}</h1>`,sub:'Take your phrases!',
  home(F){return `${D.lang()}<div class="p5-list">${F.map((sh,i)=>`<button class="p5-it" data-show="${E(sh.k)}" style="--i:${i}"><span class="p5-cut" style="background-image:${D.poster(sh.s0)}"></span><span class="p5-tx"><b>${E(sh.k)}</b><small>${D.kindName(sh.kind)} · ${sh.g}/${sh.t}</small></span><span class="p5-pc">${D.pct(sh.g,sh.t)}<small>%</small></span></button>`).join('')}</div>`;},
  film(sh){return `${D.crumb(D.kindName(sh.kind),sh.k)}<div class="p5-list">${sh.L.map((s,i)=>{const [g,t]=D.cnt([s]);return `<button class="p5-it" data-sid="${s.id}" style="--i:${i}"><span class="p5-cut" style="background-image:${D.cover(s)}"></span><span class="p5-tx"><b>${E(s.sub||s.title)}</b><small>${g}/${t}</small></span><span class="p5-pc">${D.pct(g,t)}<small>%</small></span></button>`;}).join('')}</div>`;},
  scene(s){return `${D.crumb(dictFilm(s),s.sub||s.title)}${D.eps(s).map(e=>`<h4 class="p5-eh"><span>EP.${e.pi+1}</span>${E(e.p.t)}</h4><div class="dl-grid p5-grid">${e.c.map(p5Card).join('')}</div>`).join('')}`;},
  trans(st,dir,go){const w=document.createElement('div');w.className='dlx p5-wipe';w.innerHTML='<i></i><i></i><b>'+(dir>0?'GO!':'BACK')+'</b>';document.body.appendChild(w);sfx('whoosh');haptic('light');
    w.animate([{transform:'translateX(-130%)'},{transform:'translateX(0)',offset:.42},{transform:'translateX(0)',offset:.58},{transform:'translateX(130%)'}],{duration:640,easing:'cubic-bezier(.75,0,.25,1)'}).onfinish=()=>w.remove();setTimeout(go,290);},
  noAnim:true,after(st){if(fxOK())st.querySelectorAll('.p5').forEach((c,i)=>{if(i<16)c.animate([{opacity:0,transform:`translateX(${i%2?60:-60}px) rotate(${i%2?12:-12}deg) scale(.8)`},{opacity:1,transform:'none'}],{duration:420,delay:200+i*45,easing:SPRING,fill:'backwards'});});}
});

/* ---------- 14. Альбом наклеек ---------- */
const skCard=(c,i)=>{const {s,f,pi}=c,art=(c.n%2?D.art:D.art2)(s,pi);
  if(!c.got)return `<button class="sk lock" data-c="${c.k}"><span class="sk-slot"><i style="background-image:${art}"></i><b>${no(c)}</b><small>эпизод ${pi+1}</small></span></button>`;
  return `<button class="sk dlt r-${RN[c.rar]}${c.nw?' nw':''}${c.m>=3?' mx':''}" data-c="${c.k}" style="--r:${rot(c.k,2)}deg;--c:${th(s)}"><span class="sk-st"><span class="sk-img"><i style="background-image:${art};${D.crop(c)}"></i></span><b>${E(D.T(f))}</b><small>${E(f.ru)}</small><em class="sk-no">${no(c)}</em><i class="sk-gl"></i><i class="sk-peel"></i></span></button>`;};
D.reg({id:'stickers',big:'sk',card:skCard,n:'Альбом наклеек',from:'Panini',ic:'⭐',sw:'linear-gradient(160deg,#ffe9b0,#ff8a5a 60%,#e8452a)',
  d:'Бумажный альбом: пустые места с номером и силуэтом, собранные фразы — глянцевые наклейки с загнутым уголком; новые прилетают и прилипают. Нажал — наклейка отклеивается в руку.',
  bg:`<div class="sk-bgl"></div>`,title:'Альбом',sub:'Собери все наклейки',
  home(F){return `${D.lang()}<div class="sk-albums">${F.map(sh=>`<button class="sk-al" data-show="${E(sh.k)}" style="--c:${th(sh.s0)}"><span class="sk-cov"><i style="background-image:${D.poster(sh.s0)}"></i><em>Официальный<br>альбом наклеек</em><b>${E(sh.k)}</b></span><span class="sk-cnt"><b>${sh.g}</b> / ${sh.t} наклеек</span></button>`).join('')}</div>`;},
  film(sh){return `${D.crumb(D.kindName(sh.kind),sh.k)}<div class="sk-albums">${sh.L.map(s=>{const [g,t]=D.cnt([s]);return `<button class="sk-al" data-sid="${s.id}" style="--c:${th(s)}"><span class="sk-cov"><i style="background-image:${D.cover(s)}"></i><em>Страницы</em><b>${E(s.sub||s.title)}</b></span><span class="sk-cnt"><b>${g}</b> / ${t}</span></button>`;}).join('')}</div>`;},
  scene(s){const [g,t]=D.cnt([s]);return `${D.crumb(dictFilm(s),s.sub||s.title)}<div class="sk-page" style="--c:${th(s)}"><div class="sk-band"><b>${E(s.sub||s.title)}</b><span>${g} / ${t}</span></div>
    ${D.eps(s).map(e=>`<h4 class="sk-eh">Эпизод ${e.pi+1} · ${E(e.p.t)}</h4><div class="sk-grid">${e.c.map(skCard).join('')}</div>`).join('')}</div>`;},
  after(st,lvl){if(lvl!=='scene'||!fxOK())return;st.querySelectorAll('.sk.nw').forEach((el,i)=>{const s=el.querySelector('.sk-st');if(!s)return;
      s.animate([{transform:'translate(-40px,-90px) rotate(-16deg) scale(1.35)',opacity:0,boxShadow:'0 30px 40px rgba(0,0,0,.35)'},{transform:'translate(0,0) rotate(2deg) scale(.94,1.04)',opacity:1,offset:.7},{transform:'none',opacity:1}],{duration:700,delay:400+i*220,easing:EZ.out,fill:'backwards'});
      D.later(()=>{sfx('tap');fxAt(el,{n:10,v:3,pack:'dl_com'});},400+i*220+480);});},
  preTap(b,c,go){const s=b.querySelector('.sk-st');if(!s){go();return;}sfx('page');s.animate([{transform:'none'},{transform:'rotate3d(1,-1,0,22deg) translate(-3px,-8px) scale(1.04)'}],{duration:220,easing:EZ.out,fill:'forwards'}).onfinish=()=>{go();setTimeout(()=>s.getAnimations().forEach(a=>a.cancel()),400);};}
});

/* ---------- 15. Кино-минимализм (Apple TV / Mubi) + живой арт (Runeterra) ---------- */
const cnCard=(c,i)=>{const {s,f,pi}=c;
  if(!c.got)return `<button class="cn dlt lock" data-c="${c.k}"><span class="cn-a" style="background-image:${D.art(s,pi)}"></span><span class="cn-lk">🔒 Эпизод ${pi+1}</span></button>`;
  return `<button class="cn dlt r-${RN[c.rar]}${c.m>=3?' mx':''}" data-c="${c.k}" style="--c:${th(s)}"><span class="cn-a" style="background-image:${(c.n%2?D.art:D.art2)(s,pi)}"></span><span class="cn-v"></span><span class="cn-t"><b>${E(D.T(f))}</b><small>${E(f.ru)}</small></span><span class="cn-m">${D.mp(c.m)}</span></button>`;};
const cnHead=(s,title,meta)=>`<div class="cn-head" style="--bg:${D.cover(s)}"><span class="cn-hbg"></span><span class="cn-live" data-ls="${s.id}"></span><span class="cn-ht"><em>${E(meta)}</em><b>${E(title)}</b></span></div>`;
D.reg({id:'cinema',card:cnCard,n:'Кинотека',from:'Apple TV / Mubi + Runeterra',ic:'🎬',sw:'linear-gradient(160deg,#2a2a30,#08080a)',noAnim:false,
  d:'Взрослый кино-минимализм: большие постеры, размытый фон под фильм, крупная типографика. Постер плавно превращается в шапку (общий переход), карты — кадры 16:9 с фразой как субтитр, на ПК при наведении оживают.',
  bg:`<div class="cn-bg" id="cnBg"></div>`,title:'Кинотека',sub:'Фразы, которые ты собрал',
  home(F){const h=F.find(x=>x.nw)||F[0];if(!h)return D.lang();const ph=pickPh(h.s0);
    return `${D.lang()}<button class="cn-hero" data-show="${E(h.k)}" style="--bg:${D.cover(h.s0)}"><span class="cn-hbg"></span><span class="cn-live" data-ls="${h.s0.id}"></span><span class="cn-ht"><em>${D.kindName(h.kind)} · ${D.sc(h.L.length)}</em><b>${E(h.k)}</b>${ph?`<i>«${E(DL.T(ph.f))}»</i>`:''}<small>${h.g} из ${h.t} карт</small><span class="cn-btn">${SI.play} Смотреть коллекцию</span></span></button>
      ${D.groups(F).map(g=>`<h3 class="cn-h">${D.kindName(g.k)}</h3><div class="cn-row">${g.L.map(sh=>`<button class="cn-p" data-show="${E(sh.k)}" data-ps="${sh.s0.id}"><span class="cn-pi" style="background-image:${D.poster(sh.s0)}"></span><b>${E(sh.k)}</b><small>${sh.g} / ${sh.t}</small>${D.bar(sh.g,sh.t)}</button>`).join('')}</div>`).join('')}`;},
  film(sh){return `${D.crumb(D.kindName(sh.kind),sh.k)}${cnHead(sh.s0,sh.k,`${D.kindName(sh.kind)} · ${sh.g} из ${sh.t} карт`)}${sh.L.map(s=>{const C=D.cards(s);return `<button class="cn-sh" data-sid="${s.id}"><b>${E(s.sub||s.title)}</b><span>${C.filter(c=>c.got).length}/${C.length} ›</span></button><div class="cn-row cn-cards">${C.slice(0,12).map(cnCard).join('')}</div>`;}).join('')}`;},
  scene(s){const [g,t]=D.cnt([s]);return `${D.crumb(dictFilm(s),s.sub||s.title)}${cnHead(s,s.sub||s.title,`${dictFilm(s)} · ${g} из ${t}`)}${D.eps(s).map(e=>`<h3 class="cn-h">Эпизод ${e.pi+1} · ${E(e.p.t)}</h3><div class="cn-grid">${e.c.map(cnCard).join('')}</div>`).join('')}`;},
  trans(st,dir,go){if(document.startViewTransition&&dir>0){const t=document.querySelector('.cn-p.vt,.cn-hero.vt');if(t){document.startViewTransition(()=>go());return;}}go();},
  after(st,lvl){const bg=$('#cnBg'),setBg=s=>{if(bg&&s)bg.style.backgroundImage=D.cover(s);};
    st.querySelectorAll('.cn-p,.cn-hero').forEach(p=>{p.addEventListener('pointerdown',()=>{st.querySelectorAll('.vt').forEach(x=>{x.classList.remove('vt');x.style.viewTransitionName='';});p.classList.add('vt');const i=p.querySelector('.cn-pi,.cn-hbg');if(i)i.style.viewTransitionName='cnhero';});
      p.addEventListener('pointerenter',()=>setBg(scOf(p.dataset.ps||(p.querySelector('[data-ls]')||{dataset:{}}).dataset.ls)));});
    const lv=st.querySelector('.cn-live[data-ls]');if(lv){const s=scOf(lv.dataset.ls);setBg(s);const x=pickPh(s);if(x)setTimeout(()=>{if(lv.isConnected)D.loopVid(lv,s,x.pi,x.f,x.p);},700);}
    if(matchMedia('(hover:hover)').matches)st.querySelectorAll('.cn:not(.lock)').forEach(el=>{let t=0;el.addEventListener('pointerenter',()=>{t=setTimeout(()=>{const c=D.find(el.dataset.c);if(c)D.loopVid(el.querySelector('.cn-v'),c.s,c.pi,c.f,c.p);},650);});el.addEventListener('pointerleave',()=>{clearTimeout(t);D.stopVids(el);});});}
});

/* ---------- 16. Balatro: сочность ---------- */
const SUIT={neutral:['♠','k'],casual:['♥','r'],formal:['♦','r'],rude:['♣','k']},ED=['','','Foil','Holo','Polychrome'];
const blCard=(c,i)=>{const {s,f,pi}=c,su=SUIT[scTag(f)[1]]||SUIT.neutral;
  if(!c.got)return `<button class="bl lock" data-c="${c.k}" style="--d:${i}"><span class="bl-back"></span><small>эп. ${pi+1}</small></button>`;
  return `<button class="bl dlt r-${RN[c.rar]}${c.m>=3?' mx':''}" data-c="${c.k}" style="--d:${i};--c:${th(s)}"><span class="bl-cr ${su[1]}"><b>${c.m||'A'}</b><i>${su[0]}</i></span><span class="bl-art"><i style="background-image:${(c.n%2?D.art:D.art2)(s,pi)};${D.crop(c)}"></i></span><b class="bl-en">${E(D.T(f))}</b><span class="bl-ru">${E(f.ru)}</span>${ED[c.rar]?`<em class="bl-ed">${ED[c.rar]}</em>`:''}<span class="bl-cr bl-cr2 ${su[1]}"><b>${c.m||'A'}</b><i>${su[0]}</i></span><i class="bl-shine"></i></button>`;};
D.reg({id:'balatro',big:'bl',card:blCard,n:'Сочность',from:'Balatro',ic:'🃏',sw:'conic-gradient(#1e5a4c,#9c2a2a,#1e3a5a,#6a2a6a,#1e5a4c)',
  d:'Пиксельный шрифт, крутящийся фон как на ЭЛТ. Карты — игральные, постоянно покачиваются; нажал — сплющилась, дрогнула, вылетели фишки и множитель. «Дорого» без арта — на движении и отклике.',
  bg:`<div class="bl-sw"></div><div class="bl-crt"></div>`,title:'СЛОВАРЬ',sub:'Фишки × множитель',
  home(F){return `${D.lang()}<div class="bl-decks">${F.map((sh,i)=>`<button class="bl-deck" data-show="${E(sh.k)}" style="--d:${i};--c:${th(sh.s0)}"><span class="bl-dk"><i></i><i></i><i class="bl-top" style="background-image:${D.poster(sh.s0)}"></i></span><b>${E(sh.k)}</b><span class="bl-chips"><em class="bl-ch">${sh.g}</em><i>×</i><em class="bl-mu">${sh.t}</em></span></button>`).join('')}</div>`;},
  film(sh){return `${D.crumb(D.kindName(sh.kind),sh.k)}<div class="bl-decks">${sh.L.map((s,i)=>{const [g,t]=D.cnt([s]);return `<button class="bl-deck" data-sid="${s.id}" style="--d:${i};--c:${th(s)}"><span class="bl-dk"><i></i><i></i><i class="bl-top" style="background-image:${D.cover(s)}"></i></span><b>${E(s.sub||s.title)}</b><span class="bl-chips"><em class="bl-ch">${g}</em><i>×</i><em class="bl-mu">${t}</em></span></button>`;}).join('')}</div>`;},
  scene(s){return `${D.crumb(dictFilm(s),s.sub||s.title)}${D.eps(s).map(e=>`<h4 class="bl-eh"><span>Блайнд ${e.pi+1}</span>${E(e.p.t)}</h4><div class="bl-grid">${e.c.map(blCard).join('')}</div>`).join('')}`;},
  preTap(b,c,go){const ch=10*(c.rar+1),mu=c.m+1;b.animate([{transform:'scale(1)'},{transform:'scale(1.18,.86) rotate(-3deg)'},{transform:'scale(.92,1.1) rotate(3deg)'},{transform:'scale(1.04) rotate(-1deg)'},{transform:'scale(1)'}],{duration:340,easing:'ease-out'});
    const r=b.getBoundingClientRect(),p=document.createElement('div');p.className='dlx bl-pop';p.innerHTML=`<em class="bl-ch">+${ch}</em><i>×</i><em class="bl-mu">${mu}</em>`;p.style.left=(r.left+r.width/2)+'px';p.style.top=(r.top+10)+'px';document.body.appendChild(p);
    p.animate([{transform:'translate(-50%,0) scale(.4)',opacity:0},{transform:'translate(-50%,-40px) scale(1.25) rotate(-6deg)',opacity:1,offset:.3},{transform:'translate(-50%,-56px) scale(1) rotate(3deg)',opacity:1,offset:.75},{transform:'translate(-50%,-80px) scale(.9)',opacity:0}],{duration:900,easing:'ease-out'}).onfinish=()=>p.remove();
    fxAt(b,{n:14,v:5,pack:c.rar>=3?'dl_epic':'dl_rare'});sfx('tick');setTimeout(()=>sfx('good'),120);document.documentElement.animate([{transform:'translate(0,0)'},{transform:'translate(-3px,2px)'},{transform:'translate(3px,-2px)'},{transform:'translate(0,0)'}],{duration:160});setTimeout(go,300);}
});

/* ---------- 17. Кино-коллекционер (сочетание: прокат → кино-шапка → карты Snap, выученные — в слэбе, пак — разрезать) ---------- */
const clCard=(c,i)=>c.got&&c.m>=3?D.slCard(c,i):D.snCard(c,i).replace(' data-own','');
D.reg({id:'collector',big:'cl',card:clCard,n:'Кино-коллекционер',from:'моё сочетание: VHS + Apple TV + Snap + Topps + Pocket',ic:'🏆',sw:'linear-gradient(135deg,#ff3da5,#2de2e6 50%,#ffd27a)',
  d:'Моё любимое: фильмы на полке видеопроката → шапка как в Apple TV → карты в полный рост как в Snap (арт вылезает из рамки), выученные — в слэбе с оценкой 10, пак после эпизода — разрезать пальцем.',
  bg:`<div class="vh-floor"></div><div class="cn-bg" id="cnBg"></div>`,title:'Коллекция',sub:'Кино-коллекционер',
  home(F){return `${D.lang()}${D.vhShelf(F)}`;},
  film(sh){return `${D.crumb(D.kindName(sh.kind),sh.k)}${cnHead(sh.s0,sh.k,`${D.kindName(sh.kind)} · ${sh.g} из ${sh.t} карт`)}<div class="vh-tapes">${sh.L.map((s,i)=>{const [g,t]=D.cnt([s]);return `<button class="vh-tape" data-sid="${s.id}" style="--c:${th(s)}"><span class="vh-lbl"><em>КАССЕТА ${i+1}</em><b>${E(s.sub||s.title)}</b><small>${g}/${t}</small></span><i class="vh-reels"><i></i><i></i></i></button>`;}).join('')}</div>`;},
  scene(s){const [g,t]=D.cnt([s]);return `${D.crumb(dictFilm(s),s.sub||s.title)}${cnHead(s,s.sub||s.title,`${dictFilm(s)} · ${g} из ${t}`)}<button class="pq-open cl-open" id="clOpen">Открыть пак ✂</button>${D.eps(s).map(e=>`<h3 class="cn-h">Эпизод ${e.pi+1} · ${E(e.p.t)}</h3><div class="cl-grid">${e.c.map(clCard).join('')}</div>`).join('')}`;},
  after(st,lvl){st.querySelectorAll('.vh-sp').forEach(b=>b.onclick=()=>{if(b.classList.contains('out'))return;b.classList.add('out');D.vhInsert(b,()=>D.open({show:b.dataset.show,sid:null}));});
    const lv=st.querySelector('.cn-live[data-ls]');if(lv){const s=scOf(lv.dataset.ls),bg=$('#cnBg');if(bg)bg.style.backgroundImage=D.cover(s);const x=pickPh(s);if(x)setTimeout(()=>{if(lv.isConnected)D.loopVid(lv,s,x.pi,x.f,x.p);},700);}
    const ob=$('#clOpen');if(ob)ob.onclick=()=>{sfx('tap');const L=D.cards(scOf(S.sid)).filter(c=>c.got).sort(()=>Math.random()-.5).slice(0,5).map(c=>Object.assign({},c));const k=(D.PK||[]).find(x=>x.id==='cut');if(k&&L.length)k.run(L);};}
});
})();

/* =====================================================================================
   ПАКИ НОВЫХ КАРТ — 6 вариантов (админ → «Словарь — варианты» → ▶). Настоящие карты, демо (в словарь не пишут).
   ===================================================================================== */
(function(){'use strict';const D=DL,th=D.th,RN=D.RN,E=t=>esc(t);
const best=L=>L.reduce((a,c)=>Math.max(a,c.rar),1);
const PKO=(cls,html)=>{D.clean();const o=document.createElement('div');o.className='dlp '+cls;o.innerHTML=html+`<button class="dlp-x" aria-label="Закрыть">${ui('close')}</button>`;FXROOT().appendChild(o);document.body.classList.add('dx-open');
  o._close=()=>{if(o._c)return;o._c=true;document.body.classList.remove('dx-open');o.animate([{opacity:1},{opacity:0}],{duration:280,fill:'forwards'}).onfinish=()=>o.remove();};
  o.querySelector('.dlp-x').onclick=e=>{e.stopPropagation();sfx('tap');o._close();};o.animate([{opacity:0},{opacity:1}],{duration:260});return o;};
const pc=c=>`<div class="pc r-${RN[c.rar]}${c.m>=3?' mx':''}" style="--c:${th(c.s)}"><div class="pc-s"><div class="pc-in"><div class="pc-back"><i>🎬</i></div>${D.faceHTML(c)}</div></div></div>`;
const size=(el,w)=>{el.style.width=w+'px';el.style.height=(w*1.4)+'px';const s=el.querySelector('.pc-s');if(s)s.style.transform=`scale(${w/300})`;};
const flip=(el,c,slow)=>{const inn=el.querySelector('.pc-in');el.classList.add('open');inn.animate([{transform:'rotateY(180deg) scale(1)'},{transform:'rotateY(90deg) scale(1.12)',offset:.5},{transform:'rotateY(0deg) scale(1)'}],{duration:slow?720:460,easing:EZ.out,fill:'forwards'});
  D.later(()=>{D.burst(el,c.rar);D.chime(c.rar);if(c.rar>=4){haptic('heavy');fxRain(26,{pack:'dl_leg'});D.shake();}else if(c.rar>=3)haptic('medium');},slow?330:200);};
D.shake=()=>{if(fxOK())document.documentElement.animate([{transform:'none'},{transform:'translate(-5px,3px)'},{transform:'translate(5px,-3px)'},{transform:'translate(-3px,-2px)'},{transform:'none'}],{duration:260});};
const doneBtn=(o,L,onDone)=>{const b=document.createElement('button');b.className='dlp-done';b.textContent='Готово';o.appendChild(b);b.animate([{opacity:0,transform:'translate(-50%,20px)'},{opacity:1,transform:'translate(-50%,0)'}],{duration:360,easing:EZ.out,fill:'backwards'});
  b.onclick=e=>{e.stopPropagation();sfx('tap');if(onDone)onDone();else o._close();};};
const summary=(o,L)=>{const w=Math.min(innerWidth*.17,110),r=document.createElement('div');r.className='dlp-sum';r.innerHTML=L.map(pc).join('');o.appendChild(r);
  [...r.children].forEach((el,i)=>{size(el,w);el.querySelector('.pc-in').style.transform='none';el.animate([{opacity:0,transform:'translateY(30px) scale(.8)'},{opacity:1,transform:'none'}],{duration:420,delay:i*70,easing:SPRING,fill:'backwards'});});};

// 1. Hearthstone: пак в центр → взрыв → 5 карт рубашкой, светятся цветом редкости → переворачиваешь сам
function pkHS(L){const W=innerWidth,H=innerHeight,cw=Math.min(W*.27,150),b=best(L),s0=L[0].s;
  const o=PKO('pk-hs',`<div class="pkh-light"></div><div class="pkh-ring"></div><div class="pkh-pack r-${RN[b]}" style="--art:${D.poster(s0)}"><i class="pkh-foil"></i><b>${E(dictFilm(s0))}</b><small>5 карт</small></div>${L.map(pc).join('')}<div class="dlp-tip">Нажми на пак</div>`);
  const pack=o.querySelector('.pkh-pack'),cs=[...o.querySelectorAll('.pc')],tip=o.querySelector('.dlp-tip'),P=[[.5,.27],[.2,.47],[.8,.47],[.33,.71],[.67,.71]];
  cs.forEach((e,i)=>{size(e,cw);e.style.left=(P[i][0]*W-cw/2)+'px';e.style.top=(P[i][1]*H-cw*.7)+'px';e.style.visibility='hidden';});
  pack.animate([{transform:'translate(-50%,-50%) translateY(45vh) rotate(-10deg)',opacity:0},{transform:'translate(-50%,-50%)',opacity:1}],{duration:760,easing:SPRING,fill:'backwards'});sfx('whoosh');
  let st=0,n=0;
  pack.onclick=()=>{if(st)return;st=1;tip.textContent='';haptic('medium');pack.classList.add('shake');if(b>=3)pack.classList.add('glow');sfx('reel');
    D.later(()=>{const r=pack.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;pack.classList.remove('shake');
      pack.animate([{transform:'translate(-50%,-50%) scale(1)',opacity:1},{transform:'translate(-50%,-50%) scale(1.5)',opacity:0}],{duration:360,easing:EZ.out,fill:'forwards'});
      const fl=document.createElement('i');fl.className='dlp-flash r-'+RN[b];o.appendChild(fl);fl.animate([{opacity:0},{opacity:.95,offset:.15},{opacity:0}],{duration:700,fill:'forwards'});
      fxEmit(cx,cy,{pack:'dl_'+RN[b],n:70,v:10,life:70});sfx('reward');D.shake();
      cs.forEach((e,i)=>{e.style.visibility='';const er=e.getBoundingClientRect();e.classList.add('glow');
        e.animate([{transform:`translate(${cx-er.left-er.width/2}px,${cy-er.top-er.height/2}px) scale(.2) rotate(${(i-2)*20}deg)`},{transform:'none'}],{duration:760,delay:80+i*60,easing:SPRING,fill:'backwards'});});
      D.later(()=>{st=2;tip.textContent='Переворачивай карты';},900);},b>=4?1500:b>=3?1100:700);};
  cs.forEach((e,i)=>e.onclick=()=>{if(st<2||e.classList.contains('open'))return;e.classList.remove('glow');flip(e,L[i],L[i].rar>=3);
    if(++n===cs.length){tip.textContent='';D.later(()=>doneBtn(o,L,()=>{cs.forEach((el,k)=>el.animate([{transform:'none',opacity:1},{transform:'translateY(60vh) rotate(20deg) scale(.4)',opacity:0}],{duration:520,delay:k*60,easing:EZ.in,fill:'forwards'}));D.later(()=>o._close(),700);}),800);}});}

// 2. Pokémon Pocket: провести пальцем по линии — верх пака отрезается; карты стопкой, смахиваешь по одной
function pkCut(L){const W=innerWidth,s0=L[0].s,cw=Math.min(W*.66,290);
  const o=PKO('pk-cut',`<div class="pkc-pack" style="--art:${D.poster(s0)};--c:${th(s0)}"><div class="pkc-top"></div><div class="pkc-body"><i class="pkc-art"></i><i class="pkc-foil"></i><b>${E(dictFilm(s0))}</b><small>5 карт</small></div><div class="pkc-line"><i class="pkc-cut"></i><i class="pkc-hand">☝</i></div></div><div class="pkc-stack"></div><div class="dlp-tip">Проведи пальцем по линии</div>`);
  const pack=o.querySelector('.pkc-pack'),line=o.querySelector('.pkc-line'),cut=o.querySelector('.pkc-cut'),tip=o.querySelector('.dlp-tip'),stk=o.querySelector('.pkc-stack');
  pack.animate([{transform:'translate(-50%,-50%) translateY(30px) scale(.9)',opacity:0},{transform:'translate(-50%,-50%)',opacity:1}],{duration:600,easing:SPRING,fill:'backwards'});
  let st=0,x0=null,top=0;
  const doCut=()=>{if(st)return;st=1;tip.textContent='';sfx('whoosh');haptic('medium');cut.style.width='100%';o.querySelector('.pkc-hand').remove();
    const t=o.querySelector('.pkc-top');t.animate([{transform:'none'},{transform:'translate(60px,-140px) rotate(28deg)',opacity:0}],{duration:700,easing:EZ.out,fill:'forwards'});
    D.later(()=>{pack.animate([{transform:'translate(-50%,-50%)',opacity:1},{transform:'translate(-50%,-50%) translateY(55vh)',opacity:.2}],{duration:620,easing:EZ.in,fill:'forwards'});
      stk.innerHTML=L.slice().reverse().map(pc).join('');const els=[...stk.children].reverse();els.forEach((e,i)=>{size(e,cw);e.querySelector('.pc-in').style.transform='none';e.style.zIndex=10-i;e.style.transform=`translate(-50%,-50%) translate(${i*3}px,${i*4}px) rotate(${i?(i%2?2:-2):0}deg)`;});
      stk.animate([{transform:'translateY(40vh)',opacity:0},{transform:'none',opacity:1}],{duration:700,easing:SPRING,fill:'backwards'});
      D.later(()=>{st=2;tip.textContent='Смахни карту';D.chime(L[0].rar);D.burst(els[0],L[0].rar,.6);bindStack(els);},700);},350);};
  const bindStack=els=>{let d=null;
    const cur=()=>els[top];
    stk.addEventListener('pointerdown',e=>{if(st!==2||!cur())return;d={x:e.clientX,y:e.clientY};try{stk.setPointerCapture(e.pointerId);}catch(x){}});
    stk.addEventListener('pointermove',e=>{if(!d||!cur())return;const dx=e.clientX-d.x;cur().style.transform=`translate(-50%,-50%) translateX(${dx}px) rotate(${dx/14}deg)`;});
    stk.addEventListener('pointerup',e=>{if(!d||!cur())return;const dx=e.clientX-d.x;d=null;const el=cur();
      if(Math.abs(dx)<60&&Math.abs(dx)>6){el.style.transition='transform .3s';el.style.transform='translate(-50%,-50%)';setTimeout(()=>el.style.transition='',320);return;}
      const dir=dx<0?-1:1;el.animate([{transform:el.style.transform||'translate(-50%,-50%)'},{transform:`translate(-50%,-50%) translateX(${dir*innerWidth}px) rotate(${dir*30}deg)`}],{duration:380,easing:EZ.in,fill:'forwards'});sfx('whoosh');
      top++;const nx=cur();if(nx){nx.style.transition='transform .35s cubic-bezier(.2,.9,.3,1.2)';nx.style.transform='translate(-50%,-50%)';D.later(()=>{D.chime(L[top].rar);D.burst(nx,L[top].rar,.7);if(L[top].rar>=4)D.shake();},220);}
      else{st=3;tip.textContent='';D.later(()=>{summary(o,L);doneBtn(o,L);},400);}});};
  line.addEventListener('pointerdown',e=>{x0=e.clientX;try{line.setPointerCapture(e.pointerId);}catch(x){}});
  line.addEventListener('pointermove',e=>{if(x0==null||st)return;const r=line.getBoundingClientRect(),p=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));cut.style.width=(p*100)+'%';if(Math.abs(e.clientX-x0)>r.width*.6)doCut();});
  line.addEventListener('pointerup',()=>{if(st)return;x0=null;cut.style.width='0';});
  line.addEventListener('click',()=>{if(!st)doCut();});}

// 3. Genshin: падающая звезда, цвет хвоста заранее выдаёт лучшую редкость; карты показываются по одной
function pkStar(L){const W=innerWidth,H=innerHeight,b=best(L),col=['','#9ec8ff','#9ec8ff','#d7a8ff','#ffd27a'][b];let st=0,k=0;
  const stars=Array.from({length:60},(_,i)=>{const h=D.hs('s'+i);return `<i style="left:${h%100}%;top:${(h>>>7)%100}%;--t:${2+(h>>>3)%5}s"></i>`;}).join('');
  const o=PKO('pk-star',`<div class="pks-sky">${stars}</div><div class="dlp-tip">Нажми, чтобы загадать</div><div class="pks-show"></div>`);const tip=o.querySelector('.dlp-tip'),show=o.querySelector('.pks-show');
  o.onclick=e=>{if(e.target.closest('.dlp-x,.dlp-done'))return;
    if(st===0){st=1;tip.textContent='';sfx('whoosh');const m=document.createElement('i');m.className='pks-met';m.style.setProperty('--col',col);o.appendChild(m);
      const x0=W+60,y0=-80,x1=W/2,y1=H*.42,ang=Math.atan2(y1-y0,x1-x0)*180/Math.PI;m.style.setProperty('--a',ang+'deg');
      m.animate([{transform:`translate(${x0}px,${y0}px) rotate(${ang}deg) scaleX(.3)`,opacity:0},{opacity:1,offset:.15},{transform:`translate(${x1}px,${y1}px) rotate(${ang}deg) scaleX(1)`,opacity:1}],{duration:b>=4?1500:1100,easing:'cubic-bezier(.55,0,.85,.4)',fill:'forwards'}).onfinish=()=>{
        m.remove();const fl=document.createElement('i');fl.className='dlp-flash r-'+RN[b];o.appendChild(fl);fl.animate([{opacity:0},{opacity:1,offset:.1},{opacity:0}],{duration:900,fill:'forwards'});
        fxEmit(x1,y1,{pack:'dl_'+RN[b],n:80,v:11,life:80});D.chime(b);D.shake();haptic('heavy');D.later(()=>{st=2;next();},500);};return;}
    if(st===2)next();};
  const next=()=>{if(k>=L.length){st=3;show.innerHTML='';tip.textContent='';summary(o,L);doneBtn(o,L);return;}const c=L[k++],w=Math.min(W*.66,300);
    show.innerHTML=`<div class="pks-card r-${RN[c.rar]}">${pc(c)}<b class="pks-name">${E(D.T(c.f))}</b><span class="pks-st">${'★'.repeat([0,3,3,4,5][c.rar])}</span></div>`;show.style.setProperty('--col',['','#9ec8ff','#9ec8ff','#d7a8ff','#ffd27a'][c.rar]);
    const el=show.querySelector('.pc');size(el,w);el.querySelector('.pc-in').style.transform='none';
    show.firstChild.animate([{transform:'translateX(60vw)',opacity:0},{transform:'none',opacity:1}],{duration:560,easing:EZ.out});
    show.querySelector('.pks-name').animate([{transform:'translateX(-40px)',opacity:0},{transform:'none',opacity:1}],{duration:500,delay:250,easing:EZ.out,fill:'backwards'});
    show.querySelectorAll('.pks-st').forEach(s=>s.animate([{opacity:0,letterSpacing:'14px'},{opacity:1,letterSpacing:'2px'}],{duration:600,delay:400,easing:EZ.out,fill:'backwards'}));
    D.later(()=>{D.chime(c.rar);D.burst(el,c.rar,.8);},300);tip.textContent=k<L.length?'Нажми — дальше':'Нажми';};}

// 4. Star Drop (Brawl Stars): тапаешь — капля меняет цвет на всё более редкий
function pkDrop(L){const b=best(L),TN=['','Обычная','Редкая','Эпическая','Легендарная'];let t=1,st=0,taps=0;
  const o=PKO('pk-drop',`<div class="pkd-rays"></div><button class="pkd-gem t1"><i></i></button><b class="pkd-lab">${TN[1]}</b><div class="dlp-tip">Тапай!</div>`);
  const g=o.querySelector('.pkd-gem'),lab=o.querySelector('.pkd-lab'),tip=o.querySelector('.dlp-tip');
  g.animate([{transform:'translate(-50%,-50%) scale(0) rotate(-30deg)'},{transform:'translate(-50%,-50%) scale(1)'}],{duration:700,easing:SPRING,fill:'backwards'});
  g.onclick=()=>{if(st)return;taps++;g.animate([{transform:'translate(-50%,-50%) scale(1)'},{transform:'translate(-50%,-50%) scale(1.25,.8)'},{transform:'translate(-50%,-50%) scale(.9,1.12)'},{transform:'translate(-50%,-50%) scale(1)'}],{duration:340,easing:'ease-out'});sfx('tick');haptic('light');
    if(t<b&&taps<=3){D.later(()=>{t++;g.className='pkd-gem t'+t;lab.textContent=TN[t];lab.className='pkd-lab t'+t;lab.animate([{transform:'scale(1.6)',opacity:0},{transform:'scale(1)',opacity:1}],{duration:420,easing:SPRING});fxAt(g,{pack:'dl_'+RN[t],n:30+t*8,v:7});D.chime(t);if(t>=3)D.shake();o.dataset.t=t;},180);return;}
    if(b===1&&taps<2)return;
    st=1;tip.textContent='';D.later(()=>{const r=g.getBoundingClientRect();g.animate([{transform:'translate(-50%,-50%) scale(1)'},{transform:'translate(-50%,-50%) scale(1.6)',opacity:0}],{duration:420,easing:EZ.out,fill:'forwards'});lab.remove();
      const fl=document.createElement('i');fl.className='dlp-flash r-'+RN[b];o.appendChild(fl);fl.animate([{opacity:0},{opacity:.9,offset:.15},{opacity:0}],{duration:700,fill:'forwards'});
      fxEmit(r.left+r.width/2,r.top+r.height/2,{pack:'dl_'+RN[b],n:80,v:11});sfx('reward');D.shake();
      const bi=L.findIndex(c=>c.rar===b),B=L[bi],rest=L.filter((_,i)=>i!==bi),w=Math.min(innerWidth*.62,280),bx=document.createElement('div');bx.className='pkd-best';bx.innerHTML=pc(B);o.appendChild(bx);
      const el=bx.firstChild;size(el,w);D.later(()=>flip(el,B,true),250);D.later(()=>{summary(o,rest);[...o.querySelectorAll('.dlp-sum .pc')].forEach((e,i)=>e.querySelector('.pc-in').animate([{transform:'rotateY(180deg)'},{transform:'none'}],{duration:400,delay:200+i*120,fill:'backwards'}));doneBtn(o,L);},1100);},250);};}

// 5. EA FC walkout: прожекторы, по шагам — фильм → сцена → редкость → карта выходит
function pkWalk(L){const bi=L.reduce((a,c,i)=>c.rar>L[a].rar?i:a,0),B=L[bi],s=B.s,rest=L.filter((_,i)=>i!==bi);let k=0,tm=0;
  const o=PKO('pk-walk r-'+RN[B.rar],`<div class="pkw-st"><i class="pkw-b1"></i><i class="pkw-b2"></i><i class="pkw-smoke"></i></div><div class="pkw-step"></div><div class="dlp-tip">Нажми — дальше</div>`);
  const box=o.querySelector('.pkw-step'),tip=o.querySelector('.dlp-tip');
  const S=[()=>`<div class="pkw-flag" style="background-image:${D.poster(s)}"></div><b class="pkw-t">${E(dictFilm(s))}</b>`,()=>`<em class="pkw-e">Сцена</em><b class="pkw-t">${E(s.sub||s.title)}</b><small class="pkw-s">эпизод ${B.pi+1} · ${E(B.p.t)}</small>`,
    ()=>`<b class="pkw-rar r-${RN[B.rar]}">${D.RT[RN[B.rar]]}</b>`,()=>`<div class="pkw-card">${pc(B)}</div>`];
  const step=()=>{clearTimeout(tm);if(k>=S.length){tip.textContent='';box.innerHTML='';summary(o,rest);[...o.querySelectorAll('.dlp-sum .pc')].forEach((e,i)=>e.querySelector('.pc-in').animate([{transform:'rotateY(180deg)'},{transform:'none'}],{duration:400,delay:200+i*120,fill:'backwards'}));
      const big=document.createElement('div');big.className='pkw-final';big.innerHTML=pc(B);o.appendChild(big);size(big.firstChild,Math.min(innerWidth*.5,230));big.querySelector('.pc-in').style.transform='none';doneBtn(o,L);return;}
    const i=k++;box.innerHTML=S[i]();box.firstElementChild.animate([{opacity:0,transform:'translateY(40px) scale(.9)'},{opacity:1,transform:'none'}],{duration:600,easing:EZ.out});sfx(i<3?'whoosh':'reward');haptic(i===3?'heavy':'light');
    if(i===2){fxAt(box,{pack:'dl_'+RN[B.rar],n:40+B.rar*12,v:9});if(B.rar>=3){D.shake();fxRain(20,{pack:'dl_'+RN[B.rar]});}D.chime(B.rar);}
    if(i===3){const el=box.querySelector('.pc');size(el,Math.min(innerWidth*.64,290));el.animate([{transform:'translateY(60vh) scale(.6)'},{transform:'translateY(-10px) scale(1.04)',offset:.75},{transform:'none'}],{duration:1200,easing:EZ.out,fill:'backwards'});D.later(()=>flip(el,B,true),900);}
    tm=setTimeout(()=>{if(o.isConnected&&!o._c)step();},i===3?2600:1700);};
  o.onclick=e=>{if(e.target.closest('.dlp-x,.dlp-done'))return;if(k<=S.length)step();};D.later(step,500);}

D.PK=[
  {id:'now',n:'Как сейчас',from:'словарь 13.2',ic:'📦',sw:'linear-gradient(135deg,#2a2f3a,#13151d)',d:'Пак падает, рвётся, карты сами переворачиваются и улетают в «Словарь».',run(L){L.forEach(c=>DICT_NEW.push({sid:c.s.id,fid:c.f.id}));dictFly({demo:true});}},
  {id:'hs',n:'Пак Hearthstone',from:'Hearthstone',ic:'🃏',sw:'radial-gradient(circle,#ffb347,#6a3a10 60%,#1d0f07)',d:'Нажал пак — трясётся (легендарка светится сквозь него), взрыв, 5 карт рубашкой светятся цветом редкости, переворачиваешь сам по одной.',run:pkHS},
  {id:'cut',n:'Разрезать пак',from:'Pokémon TCG Pocket',ic:'✂',sw:'linear-gradient(160deg,#f4f7fc,#9ec8ff)',d:'Проводишь пальцем по линии — верх пака отлетает, карты стопкой, смахиваешь по одной, в конце — все пять.',run:pkCut},
  {id:'star',n:'Падающая звезда',from:'Genshin Impact',ic:'🌠',sw:'radial-gradient(circle at 70% 20%,#ffd27a,#3a2c9a 40%,#08061a)',d:'Звезда летит — цвет хвоста заранее выдаёт лучшую карту (синий / фиолетовый / золотой), вспышка, карты выходят по одной со звёздами.',run:pkStar},
  {id:'drop',n:'Капля редкости',from:'Brawl Stars (Star Drop)',ic:'💎',sw:'radial-gradient(circle,#ff9a2e,#b57cff 50%,#1b1440)',d:'Тапаешь каплю — она меняет цвет: обычная → редкая → эпическая → легендарная. Лопается — лучшая карта крупно.',run:pkDrop},
  {id:'walk',n:'Выход на поле',from:'EA FC (walkout)',ic:'🏟',sw:'linear-gradient(180deg,#0b1a2a,#1e3a5a 60%,#ffd27a)',d:'Прожекторы, дым. По шагам: фильм → сцена → редкость → карта выходит из-под света. Можно тапать, чтобы быстрее.',run:pkWalk}];
})();
