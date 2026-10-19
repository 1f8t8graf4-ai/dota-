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
const demo=DL.demo=()=>false;   // 13.9.13: словарь у всех — только настоящий прогресс
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
DL.cur=()=>V[0];   // 13.9.13: вариант один — «Кинотека + Мои фразы и слова»
const later=DL.later=(f,ms)=>{const t=setTimeout(()=>{if($('#dlRoot')||$('.dli')||$('.dlp'))f();},ms);DL._t.push(t);return t;};
DL._t=[];
DL.clean=()=>{DL._t.forEach(clearTimeout);DL._t=[];try{DL.stopVids();}catch(e){}try{DL.onStop&&DL.onStop('clean');}catch(e){}document.querySelectorAll('.dli,.dlp,.dlx,.kno,.kn-sheet').forEach(x=>x.remove());if(DL._v){try{DL._v.pause();}catch(e){}DL._v=null;}document.body.classList.remove('dx-open');};
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
    
    <div class="dl-top"><div class="dl-ttl">${v.titleHTML||`<h1>${esc(v.title||'Словарь')}</h1>`}<small>${esc(v.sub||'Коллекция фраз из кино')}</small></div><div class="dl-cnt" id="dlCnt"></div></div>
    <div class="dl-stage" id="dlStage"></div>`;
  if(v.enter&&!DL.seen[v.id]){DL.seen[v.id]=1;try{v.enter(root);}catch(e){}}
  DL.render(0);if(DL.whWatch)DL.whWatch(root);};
DL.lang=()=>{const nL=l=>dictScenes().filter(s=>dxL(s)===l).reduce((a,s)=>a+dictCards(s).length,0);
  return `<div class="dl-lang"><button data-dl="en" class="${DX.lang!=='de'?'on':''}">${FLAG.en} English <i>${nL('en')}</i></button><button data-dl="de" class="${DX.lang==='de'?'on':''}">${FLAG.de} Deutsch <i>${nL('de')}</i></button></div>`;};
DL.crumb=(em,b)=>`<div class="dl-crumb"><button class="dl-up" data-up aria-label="Назад">${ui('back')}</button><span><em>${esc(em)}</em><b>${esc(b)}</b></span></div>`;
// 13.8.4: прокрутить ряд так, чтобы элемент был по центру — только вбок; scrollIntoView({block:'nearest'}) уводил и всю страницу вниз
DL.hcenter=(el,smooth)=>{const row=el&&el.parentElement&&el.closest('.kn-row,.bk-tabs,.sn-fcs')||(el&&el.parentElement);if(!row)return;const er=el.getBoundingClientRect(),rr=row.getBoundingClientRect(),x=row.scrollLeft+(er.left-rr.left)-(rr.width-er.width)/2;try{row.scrollTo({left:Math.max(0,x),behavior:smooth?'smooth':'auto'});}catch(e){row.scrollLeft=Math.max(0,x);}};
DL.bar=(g,t)=>`<i class="dl-pb"><i style="width:${t?g/t*100:0}%"></i></i>`;
// 13.9.1: кнопка «назад» Телеграма по текущему уровню — после окон поверх словаря (Кинотека на весь экран, фраза) вернуть как было
DL.bb=()=>{if(!$('#dlRoot'))return;const v=DL.cur(),lvl=DL.lvl();try{backBtn(lvl!=='home'&&(lvl!=='my'||!!(v.myDeep&&v.myDeep())));}catch(e){}};
DL.lvl=()=>{const v=DL.cur();if(v.my&&DX.seg==='my')return 'my';if(v.flt&&S.flt)return 'flt';return S.sid?'scene':S.show?'film':'home';};   // 13.8: «Мои слова» и экран поиска — у вариантов, которые их умеют
DL.render=dir=>{const st=$('#dlStage');if(!st)return;const v=DL.cur();
  {const s0=S.sid?scOf(S.sid):S.show?dictScenes().find(x=>dictFilm(x)===S.show):null;if(s0)DX.lang=dxL(s0);}
  const F=DL.films();if(S.show&&!F.some(x=>x.k===S.show)){S.show=null;S.sid=null;}
  const [g,t]=DL.cnt(dxScenes()),cn=$('#dlCnt');if(cn)cn.innerHTML=`<b>${g}</b><span> / ${t}</span>`;
  const lvl=DL.lvl();let html='';
  try{if(lvl==='my')html=v.my(F);else if(lvl==='flt')html=v.flt(F);else if(lvl==='scene'){const s=scOf(S.sid);html=v.scene(s,F.find(x=>x.k===dictFilm(s)));}
    else if(lvl==='film'){html=v.film(F.find(x=>x.k===S.show),F);}
    else html=v.home(F);}catch(e){html=`<div class="dl-err">Ошибка варианта: ${esc(e.message)}</div>`;console.error(e);}
  const go=()=>{DL.stopVids&&DL.stopVids(st);try{DL.onStop&&DL.onStop('render',lvl);}catch(e){}st.innerHTML=html;st.dataset.lvl=lvl;DL.bind(st,lvl);DL.bb();
    if(v.after)try{v.after(st,lvl,dir);}catch(e){console.error(e);}
    if(dir&&!v.noAnim&&fxOK())st.querySelectorAll('[data-c],[data-show],[data-sid]').forEach((c,i)=>{if(i<24)c.animate([{opacity:0,transform:'translateY(18px) scale(.94)'},{opacity:1,transform:'none'}],{duration:460,delay:40+i*32,easing:EZ.out,fill:'backwards'});});};
  if(dir&&v.trans&&fxOK())v.trans(st,dir,go);else go();
  if(dir)window.scrollTo({top:0,behavior:'smooth'});};
DL.open=(o,dir)=>{if(o.sid&&o.show===undefined){const s=scOf(o.sid);if(s)o=Object.assign({show:dictFilm(s)},o);}S.flt=false;Object.assign(S,o);if(S.show&&!S.sid){const sh=DL.films().find(x=>x.k===S.show);if(sh&&sh.L.length===1&&DL.cur().skip1!==false)S.sid=sh.L[0].id;}DL.render(dir==null?1:dir);};
DL.back=()=>{const o=$('.dli,.kno');if(o&&o._close){o._close();return true;}{const w=$('.kn-sheet');if(w&&w._close){w._close();return true;}}if(!$('#dlRoot'))return false;
  if(DL.lvl()==='my'){const v=DL.cur();return !!(v.myBack&&v.myBack());}if(S.flt){S.flt=false;DL.render(-1);return true;}
  if(S.sid){const sh=DL.films().find(x=>x.k===S.show);S.sid=null;if(!sh||(sh.L.length<2&&DL.cur().skip1!==false))S.show=null;DL.render(-1);return true;}
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
  const play=()=>{if(flip%360)doFlip();if(vid){if(vid._host)vid._host.remove();vid.remove();vid=null;DL._v=null;try{musDuck(false);}catch(e){}return;}
    const a=Math.max(0,f.a-p.a-0.25),b=f.b-p.a+0.3;vid=document.createElement('video');vid.className='dli-vid';vid.setAttribute('playsinline','');vid.setAttribute('webkit-playsinline','');vid.preload='auto';
    vid.src=assetUrl(scEpKey(s,pi,'mp4'))+'#t='+a.toFixed(2);vid.volume=store.scVol==null?1:store.scVol;
    let host=art;if(!host){host=document.createElement('div');host.className='dli-mv';ov.appendChild(host);vid._host=host;if(fxOK())host.animate([{opacity:0,transform:'translate(-50%,-12px) scale(.96)'},{opacity:1,transform:'translateX(-50%)'}],{duration:280,easing:EZ.out});}host.appendChild(vid);DL._v=vid;try{musDuck(true);}catch(e){}
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
DL.loopVid=(el,s,pi,f,p,o)=>{if(!el||el.querySelector('video'))return;const v=document.createElement('video');v.muted=true;v.defaultMuted=true;v.setAttribute('muted','');v.setAttribute('playsinline','');v.setAttribute('webkit-playsinline','');v.loop=false;v.preload='auto';
  if(o&&o.cors)v.crossOrigin='anonymous';   // 13.9.10: кадр читаю в canvas (DL.unbar) — нужен CORS, воркер отдаёт медиа с Access-Control-Allow-Origin *
  const a=f?Math.max(0,f.a-p.a-.4):1,b=f?f.b-p.a+.6:a+6;v.src=assetUrl(scEpKey(s,pi,'mp4'))+'#t='+a.toFixed(2);v.className='dl-lv';el.appendChild(v);
  v.addEventListener('timeupdate',()=>{if(v.currentTime>=b)try{v.currentTime=a;}catch(e){}});v.addEventListener('playing',()=>v.classList.add('on'));
  v.addEventListener('error',()=>v.remove());const pr=v.play();if(pr&&pr.catch)pr.catch(()=>{});return v;};
DL.stopVids=el=>{(el||document).querySelectorAll('video.dl-lv').forEach(v=>{try{v.pause();v.removeAttribute('src');v.load();}catch(e){}v.remove();});};
// 13.9.10: у широких фильмов эпизод — 16:9 с чёрными полосами внутри кадра («Титаник», «Волк», «Таксист»): в карточке-окне
// полосы видно. Меряю их по кадру (строки почти чёрные сверху и снизу, беру меньшую сторону) и увеличиваю видео, чтобы их не было.
// Тёмный кадр (всё чёрное) не считается — жду следующий; кадр прочитать нельзя (нет CORS) — оставляю как есть. Пока не померил,
// видео прозрачное (класс ub — «готово»), чтобы полосы не мелькнули.
DL.unbar=v=>{let n=0,best=-1;
  const apply=t=>{const bx=v.parentElement,bw=bx&&bx.clientWidth,bh=bx&&bx.clientHeight,vw=v.videoWidth,vh=v.videoHeight;let k=1;
    if(t>.008&&bw&&bh&&vw&&vh){const s=Math.max(bw/vw,bh/vh),rh=vh*s,yc=(bh-rh)/2+Math.min(t+.006,.2)*rh;if(yc>0)k=(bh/2)/(bh/2-yc);}
    const first=!v.classList.contains('ub');if(first)v.style.transition='none';v.style.transform=k>1.005?`scale(${k.toFixed(3)})`:'';
    if(first){void v.offsetWidth;v.style.transition='';}v.classList.add('ub');};
  const meas=()=>{if(!v.isConnected)return;let t=-1;
    try{const W=24,H=200,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(v,0,0,W,H);const d=x.getImageData(0,0,W,H).data;
      const dark=y=>{let s=0,m=0;for(let i=0;i<W;i++){const k=(y*W+i)*4,l=.3*d[k]+.59*d[k+1]+.11*d[k+2];s+=l;if(l>m)m=l;}return s/W<14&&m<40;};
      let a=0;while(a<H&&dark(a))a++;let b=0;while(b<H&&dark(H-1-b))b++;if(a+b<H*.6)t=Math.min(a,b)/H;}
    catch(e){v.classList.add('ub');return;}
    if(t>=0&&(best<0||t<best)){best=t;apply(t);}
    if(++n<3)setTimeout(meas,n===1?900:2200);else v.classList.add('ub');};
  const go=()=>{if(v.requestVideoFrameCallback)v.requestVideoFrameCallback(()=>meas());else setTimeout(meas,150);};
  if(v.readyState>=2&&!v.paused)go();else v.addEventListener('playing',go,{once:true});};

})();

/* =====================================================================================
   13.8 — НОВЫЙ СЛОВАРЬ: витрина фильмов как в Кинотеке + карты текущего словаря, без золота.
   Поиск — отдельный экран: темы / статус / тон / фильм; несобранные фразы темы видны под туманом («1 из 19»).
   Карта открывается окном: момент из фильма крупно, понятный статус («Учу · 1 из 3», «Повторить»…), «Когда пригодится».
   ===================================================================================== */
(function(){'use strict';const D=DL,S=D.S,th=D.th,RN=D.RN,RT=D.RT,E=t=>esc(t);
const KN=D.KN={q:'',tp:'',st:'',tone:'',film:''};
const IC={q:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>',flt:'<svg viewBox="0 0 24 24"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>'};
const TONE=[['neutral','Нейтрально'],['casual','Разговорное'],['formal','Официально'],['rude','Грубо']];
const STF=[['got','Мои'],['no','Ещё нет'],['new','Новые'],['due','Повторить'],['ok','Выучено']];
const knSt=c=>!c.got?['lock','Закрыта']:c.due?['due','Повторить']:c.m>=3?['ok','Выучено']:c.m===0?['new','Новая']:['go',`Учу · ${c.m} из 3`];
const bar=(g,t)=>`<i class="kn-bar"><i style="width:${(t?g/t*100:0).toFixed(1)}%"></i></i>`;
const lastGot=s=>{const g=scP(s.id).got||{};let m=0;for(const k in g)if(g[k]>m)m=g[k];return m;};
const allCards=()=>dxScenes().flatMap(s=>D.cards(s));
const tpCnt=L=>TOPICS_ALL.map(k=>{const C=L.filter(c=>fTopics(c.f).includes(k));return {k,ico:TOPIC_ICO[k]||'💬',g:C.filter(c=>c.got).length,t:C.length};}).filter(x=>x.t);
const seen=(s,i)=>{const P=scP(s.id);return !!(P.w[i]||P.done.includes(i));};   // без админской поблажки epSeen — чтобы админ видел как игрок
const inDays=t=>{const n=Math.round((t-Date.now())/864e5);return n<=0?'сегодня':n===1?'завтра':`через ${n} ${plural(n,['день','дня','дней'])}`;};
const cap=t=>t?t[0].toUpperCase()+t.slice(1):t;
// 13.8.7 (Андрей: «фразы убрать, оставь только в „Мои фразы“; Кинотека сделана как надо»): две вкладки — «Кинотека» и «Мои фразы и слова»
const curSeg=()=>DX.seg==='my'?'my':'kino';
// 13.8.6 (Андрей: «опять колхоз — хочу в первую очередь просто фразы, а зашёл внутрь — супер красиво»): строка = фраза + перевод.
// Без кавычек цветом редкости, без статуса словами, «эп. 1 · 0:12» и кружка ▶ — всё это внутри, в открытой фразе.
// Единственный знак в списке — точка у фраз, которые пора повторить.
const LOCK='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
const knRow=c=>{const {s,f,pi}=c,[k]=knSt(c);
  if(!c.got)return `<button class="kq kq2 lock" data-own data-c="${c.k}"><span class="kq-x"><b class="kq-en">${E(fogTxt(D.T(f)))}</b><span class="kq-ru">${E(fogTxt(f.ru))}</span></span><em class="kq-lk">${LOCK}${seen(s,pi)?'ответь в проверке':'эпизод '+(pi+1)}</em></button>`;
  return `<button class="kq kq2 st-${k}" data-own data-c="${c.k}">${typeof lvTag==='function'?lvTag(D.T(f),s.lang==='de'?'de':'en'):''}<span class="kq-x"><b class="kq-en">${kqWrap(f,D.T(f))}</b><span class="kq-ru">${E(f.ru)}</span></span>${k==='due'?'<i class="kq-due" title="Пора повторить"></i>':''}</button>`;};
// 13.9.20 (Андрей: «в словаре слова не нажимаются, и не видно, что их можно нажать»): оригинал — словами, как субтитры в видео.
// Пунктир — как в видео (.in-ph): только у слов учебного выражения (~10 % слов); важные слова kw — без пунктира, их ~40 % — был бы перегруз.
const IDW=new WeakMap();
const idOf=f=>{if(IDW.has(f))return IDW.get(f);const id=phIdiom(f),r=id&&!idWhole(id,f)?id:null;IDW.set(f,r);return r;};
const kqWrap=(f,T)=>{const id=idOf(f);return id?swWrap(T).replace(/<i class="sw">([^<]+)<\/i>/g,(m,w)=>idHit(id,w.replace(/&#39;/g,"'"))?`<i class="sw u">${w}</i>`:m):swWrap(T);};
const rowsL=C=>`<div class="kq-l">${C.map(knRow).join('')}</div>`;   // фразы — всегда строками: «квадраты» (карточки) убраны в 13.8.7
// 13.9.16 (Андрей: «в словаре нет всех реплик — искал „nice tan“ и не нашёл»): все реплики эпизода — строками, слова нажимаются, ▶ — момент
const LT=()=>store.knLines==='all'?'all':'ph';
const epRows=(s,p)=>(s.subs||[]).filter(r=>r[0]>=p.a-0.3&&r[0]<p.b);
const rowT=(s,r)=>String((s.lang==='de'?r[4]||r[2]:r[2])||'').replace(/\n/g,' ');
const rowPi=(s,r)=>{const i=s.parts.findIndex(p=>r[0]>=p.a-0.3&&r[0]<p.b);return i<0?0:i;};
const lnSeen=(s,pi)=>ADM_OPEN()||seen(s,pi);
// 13.9.20: реплика словами (как momLine: сохранённые — со звёздочкой); пунктир — у слов выражения фразы, которая звучит в этой реплике,
// и только там, где она звучит (как swWrapPh в видео)
const SWR=/([A-Za-zÀ-ÖØ-öø-ÿ'’]+)/;
const lnLine=(s,r,pi)=>{const T=rowT(s,r),low=T.toLowerCase(),p=s.parts[pi],sp=[];
  if(p)p.ph.forEach(f=>{const id=f.a<r[1]+0.15&&f.b>r[0]-0.15&&idOf(f);if(!id)return;const ph=String(D.T(f)||'').replace(/[.!?…,]+$/,'').toLowerCase(),i=ph?low.indexOf(ph):-1;
    if(i>=0)sp.push([i,i+ph.length,id]);else if(ph&&phNorm(ph).includes(phNorm(T)))sp.push([0,T.length,id]);});
  let at=0;return T.split(SWR).map((x,k)=>{const a=at;at+=x.length;if(!(k%2))return E(x);const n=swNorm(x),u=sp.some(([b,e,id])=>a>=b&&a<e&&idHit(id,n));
    return `<i class="sw${u?' u':''}${mywHas(s.id,n)?' my':''}">${E(x)}</i>`;}).join('');};
const lnRow=(s,r,pi)=>lnSeen(s,pi)?`<div class="kl-ln" data-r="${s.id}|${s.subs.indexOf(r)}|${pi}"><button class="kl-p" aria-label="Посмотреть момент">${SI.play}</button><div class="kl-t"><b>${lnLine(s,r,pi)}</b><span>${E(String(r[3]||'').replace(/\n/g,' '))}</span></div></div>`
  :`<button class="kl-ln fog" data-wep="${s.id}|${pi}"><span class="kl-t"><b>${E(fogTxt(rowT(s,r)))}</b><span>${E(fogTxt(r[3]))}</span></span><em class="kq-lk">${LOCK}эпизод ${pi+1}</em></button>`;
function linesL(s,pi){const p=s.parts[pi],R=epRows(s,p);if(!R.length)return '<div class="kl-l"><p class="kl-no">В этом эпизоде нет реплик</p></div>';
  if(!lnSeen(s,pi))return `<div class="kl-l">${R.slice(0,3).map(r=>lnRow(s,r,pi)).join('')}<button class="kl-unl" data-wep="${s.id}|${pi}">${SI.play} Посмотри эпизод — реплики проявятся</button></div>`;
  return `<div class="kl-l">${R.map(r=>lnRow(s,r,pi)).join('')}</div>`;}
// поиск по всем репликам (оригинал и перевод); onlySeen — только из просмотренных эпизодов
function lnFind(q,onlySeen){q=lo(q).replace(/[’`]/g,"'").trim();if(q.length<2)return [];const out=[];
  dxScenes().forEach(s=>(s.subs||[]).forEach(r=>{const t=lo(rowT(s,r)+' '+(r[3]||'')).replace(/[’`]/g,"'").replace(/\s+/g,' ');if(!t.includes(q))return;const pi=rowPi(s,r);if(onlySeen&&!lnSeen(s,pi))return;out.push({s,r,pi});}));
  return out;}
function lnResHTML(H,max){if(!H.length)return '';const by=[],m={};H.slice(0,max||60).forEach(x=>{const k=dictFilm(x.s);if(!m[k]){m[k]=[];by.push(k);}m[k].push(x);});
  return `<section class="kl-res"><h3 class="kn-h">Реплики<small>${H.length}${H.length>(max||60)?` · показаны первые ${max||60}`:''}</small></h3>${by.map(k=>`<h4 class="km6-sub"><em>${E(k)}</em></h4><div class="kl-l">${m[k].map(x=>lnRow(x.s,x.r,x.pi)).join('')}</div>`).join('')}</section>`;}
function lnBind(root){if(!root||root._kl)return;root._kl=1;
  root.addEventListener('click',e=>{const ln=e.target.closest('.kl-ln[data-r]');if(!ln||!root.contains(ln))return;const [sid,k,pi]=ln.dataset.r.split('|'),s=scOf(sid),r=s&&s.subs[+k];if(!r)return;
    const w=e.target.closest('.sw');if(w){e.stopPropagation();sfx('tap');momWord(w,s,+pi,r);return;}
    if(e.target.closest('.kl-p')){e.stopPropagation();sfx('tap');haptic('light');momOpen(sid,+pi,r[0]);}});}
// 13.9.20: слово в строке фразы — то же окошко, что в видео (что значит тут, выражение, «Подробнее»); мимо слов — окно фразы, как было.
// Строка — <button> с onclick, поэтому перехват в фазе захвата: до строки событие не доходит.
document.addEventListener('click',e=>{const w=e.target.closest&&e.target.closest('.kq .sw');if(!w)return;const q=w.closest('.kq[data-c]');
  if(!q||q.classList.contains('lock')||!q.closest('#dlRoot'))return;const c=D.find(q.dataset.c);if(!c||!c.got)return;
  e.stopPropagation();e.preventDefault();sfx('tap');wtDone();wordShow(w,c.f,true);},true);
document.addEventListener('click',e=>{if(!store.wtapHint&&e.target.closest&&e.target.closest('#dlRoot .kl-ln[data-r] .sw'))wtDone();},true);
// один раз за всё время — подсказка над первым списком со словами; ✕ или первое нажатие на слово — больше не показываем
const WH_Q='.kq[data-c]:not(.lock),.kl-ln[data-r]';
function wtDone(){if(store.wtapHint)return;store.wtapHint=Date.now();save();document.querySelectorAll('.kn-wh').forEach(x=>x.remove());if(D._who){D._who.disconnect();D._who=null;}}
function whPlace(root){if(store.wtapHint||!root||!root.isConnected)return;const old=root.querySelector('.kn-wh');
  const row=[...root.querySelectorAll(WH_Q)].find(x=>x.querySelector('.sw')&&!x.closest('details:not([open])')&&x.getClientRects().length),box=row&&row.closest('.kq-l,.kl-l');   // закрытый <details>: у новых Chromium содержимое всё равно меряется
  if(!box){if(old)old.remove();return;}if(old&&old.nextElementSibling===box)return;if(old)old.remove();
  const h=document.createElement('div');h.className='kn-wh';h.innerHTML=`<span>Нажми на слово — покажу, что оно значит тут</span><button aria-label="Понятно">${ui('close')}</button>`;
  h.querySelector('button').onclick=e=>{e.stopPropagation();sfx('tap');wtDone();};box.parentNode.insertBefore(h,box);}
D.whWatch=root=>{if(store.wtapHint||!root)return;if(D._who)D._who.disconnect();let q=0;const go=()=>{q=0;whPlace(root);};
  D._who=new MutationObserver(()=>{if(!q)q=requestAnimationFrame(go);});D._who.observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['open']});go();};

/* ---------- шторка (подсказка, закрытая карта) ---------- */
function knSheet(html){document.querySelectorAll('.kn-sheet').forEach(x=>x.remove());const w=document.createElement('div');w.className='kn-sheet';
  w.innerHTML=`<div class="kn-sd"></div><div class="kn-sb" role="dialog">${html}</div>`;document.body.appendChild(w);
  if(fxOK()){w.querySelector('.kn-sd').animate([{opacity:0},{opacity:1}],{duration:220});w.querySelector('.kn-sb').animate([{transform:'translateY(40px)',opacity:0},{transform:'none',opacity:1}],{duration:380,easing:SPRING});}
  const close=w._close=()=>{if(w._c)return;w._c=1;const fin=()=>w.remove();if(!fxOK())return fin();w.querySelector('.kn-sd').animate([{opacity:1},{opacity:0}],{duration:200,fill:'forwards'});
    w.querySelector('.kn-sb').animate([{transform:'none',opacity:1},{transform:'translateY(30px)',opacity:0}],{duration:200,easing:EZ.in,fill:'forwards'}).onfinish=fin;};
  w.querySelector('.kn-sd').onclick=close;w.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>{sfx('tap');close();});return w;}
function knHelp(){sfx('tap');knSheet(`<b class="kn-sh2">Как устроен словарь</b>
  <p class="kn-sm"><b>«Кинотека»</b> — фильмы и сколько фраз из них ты собрал. Фильм → сцена → эпизод: нажми — увидишь фразы.</p>
  <p class="kn-sm"><b>«Мои фразы и слова»</b> — всё твоё: фразы, которые ты собрал (верно ответил в проверке после эпизода), и слова, которые сохранил сам. Поиск сверху ищет сразу по фразам и словам. Вид — справа сверху: <b>карточки</b> (по фильмам или по темам — нажми, раскроются фразы по эпизодам и «Тренировать») или <b>постеры</b> (нажми на постер — фразы фильма по эпизодам). Число — сколько у тебя, полоска — сколько уже выучено.</p>
  <div class="kn-lg"><div><em class="kc-st st-new">Новая</em><p>Только что собрал. Ответь на неё верно в повторении три раза — и она выучена.</p></div>
    <div><em class="kc-st st-go">Учу · 1 из 3</em><p>Сколько раз ты уже ответил верно.</p></div>
    <div><em class="kc-st st-due">Повторить</em><p>В списке у такой фразы оранжевая точка — она ждёт в «Повторении» на Главной.</p></div>
    <div><em class="kc-st st-ok">✓ Выучено</em><p>Помнишь надолго. Иногда всплывёт в повторении, чтобы не забылось.</p></div>
    <div><em class="kc-st st-lock">Закрыта</em><p>Фраза из эпизода, который ты ещё не посмотрел, — в Кинотеке она под туманом.</p></div></div>
  <p class="kn-sm"><b>Нажми на фразу</b> — откроется фраза с переводом. «🔊 Послушать» — как она звучит в фильме (слова загораются в такт), «▶ Смотреть» — сам момент. «Подробнее» — когда пригодится и интересный факт. Листай вбок — следующая.</p>
  <p class="kn-sm"><b>Редкость</b> видно в открытой фразе — подпись сверху и свечение вокруг видео: <i class="kn-rd r-rare"></i>синее — редкая (устойчивое выражение), <i class="kn-rd r-epic"></i>фиолетовое — эпическая (есть интересный факт), <i class="kn-rd r-leg"></i>золотое — легендарная.</p>
  <p class="kn-sm"><b>Слова</b> сохраняешь сам: нажми на слово в субтитрах → ☆. Они приходят в повторение, пока не выучишь.</p><button class="kn-btn" data-x>Понятно</button>`);}
function knLock(b,c){const {s,p,pi}=c,can=scEpOpen(s,pi),sn=seen(s,pi);haptic('err');sfx('nope');
  if(fxOK())b.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'none'}],{duration:280});
  const w=knSheet(`<span class="kn-sic">🔒</span><b class="kn-sh2">Фраза из эпизода ${pi+1}</b><p class="kn-sm">«${E(p.t)}» · ${E(dictFilm(s))}${s.sub?' · '+E(s.sub):''}</p>
    <p class="kn-sm">${sn?'Эпизод ты уже посмотрел. Ответь на эту фразу верно в проверке — и карта станет твоей.':'Посмотри эпизод — фраза проявится. Ответишь на неё верно в проверке — карта станет твоей.'}</p>
    ${can?`<button class="kn-btn" data-go>${sn?`К проверке эпизода ${pi+1} →`:`Смотреть эпизод ${pi+1} →`}</button>`:`<button class="kn-btn" data-sc>Открыть сцену →</button><p class="kn-sm">Эпизоды открываются по порядку — сначала эпизод ${pi}.</p>`}<button class="kn-btn2" data-x>Понятно</button>`);
  const go=w.querySelector('[data-go]'),sc=w.querySelector('[data-sc]');
  if(go)go.onclick=()=>{sfx('tap');w._close();if(scGate(s.id,pi))return;renderScEp(s.id,pi);};
  if(sc)sc.onclick=()=>{sfx('tap');w._close();if(scGate(s.id))return;renderScene(s.id);};}

/* ---------- 13.8.6: открытая фраза — «внутри красиво». Фон — кадр фильма (4K, размыт, медленно «дышит»), сверху момент
   из фильма крупно, фраза субтитром на видео — слова загораются в такт речи (время слов — wt.json сцены; нет файла — равномерно),
   ниже фраза крупно (слова нажимаются), перевод, статус одной фразой, «Когда пригодится». Свайп вбок / ‹ › / ← → — соседняя
   фраза того же списка; свайп вниз, ×, Esc, «назад» — закрыть (сворачивается обратно в строку). ---------- */
// 13.9.8 (Андрей: «перенеси „Учишь“ куда-то — после „Подробнее“ вываливается куча текста»): статус — коротко, тихой строкой внизу окна
const kSt2=(c,r)=>{const k=knSt(c)[0],nx=r&&r[1]&&r[1]>Date.now()?` · повтор ${inDays(r[1])}`:'';
  return {new:'новая',go:`учишь · ${c.m} из 3${nx}`,due:'пора повторить',ok:'выучено'}[k]||'';};
const kLin=(f,W)=>{const tot=W.reduce((a,w)=>a+w.length+1,0)||1;let t=f.a;return W.map(w=>{const d=Math.max(.12,(f.b-f.a)*(w.length+1)/tot),x=[t,t+d];t+=d;return x;});};
// время каждого слова фразы по распознанным словам сцены; нашлось меньше половины — равномерно (kLin)
const kFit=(f,W,T)=>{if(!T)return null;const C=T.filter(w=>w[0]>=f.a-0.8&&w[0]<=f.b+0.8);let q=0,hit=0;
  const R=W.map(w=>{const n=wtN(w);if(!n)return null;for(let j=q;j<Math.min(C.length,q+4);j++)if(wtEq(C[j][2],n)){q=j+1;hit++;return [C[j][0],C[j][1]];}return null;});
  if(hit<Math.ceil(W.length/2))return null;
  for(let j=0;j<R.length;j++)if(!R[j]){const a=R.slice(0,j).reverse().find(Boolean),b=R.slice(j+1).find(Boolean),t0=a?a[1]:b?b[0]-.3:f.a;R[j]=[t0,b?Math.max(t0+.05,b[0]):t0+.3];}
  return R;};
// 13.8.7: то же окно открывает и слово из «Моих слов» (момент — реплика, где оно прозвучало, слово подсвечено),
// и умеет «смотреть подряд» (o.auto): сверху полоски, как в историях, — момент доиграл, через секунду следующий.
// Видео — один и тот же элемент на всё окно: на iPhone звук разрешён элементу после первого нажатия, новый элемент
// при листании играть сам уже не смог бы.
const wSt2=x=>!x.ru?'':mywLearned(x)?'выучено':!x.due||x.due<=Date.now()?'пора повторить':`учишь · ${Math.min(3,x.st||0)} из 3 · повтор ${mywWhen(x.due)}`;
// 13.9.8: «караоке» на самой фразе — слова W ↔ её кусочки на экране (.sw / .kw; 13.9.20: у немецкой тоже — слова нажимаются) по смещению в тексте
const kkMap=(el,T,W)=>{const off=[];let pos=0;W.forEach(w=>{const i=T.indexOf(w,pos);if(i<0){off.push([-1,-1]);return;}off.push([i,i+w.length]);pos=i+w.length;});
  const items=[];let at=0;
  const walk=n=>{if(n.nodeType===3){at+=n.nodeValue.length;return;}if(n.nodeType!==1)return;
    if(n.matches('.sw,.kw,.kk')){const s=at,e=s+n.textContent.length,js=[];off.forEach(([x,y],j)=>{if(x<e&&y>s)js.push(j);});if(js.length)items.push({el:n,js});at=e;return;}
    n.childNodes.forEach(walk);};
  el.childNodes.forEach(walk);return {el,items};};
function knOpen(btn,c,o){o=o||{};DL.clean();
  const box=btn&&btn.closest('#knRes,.dl-stage')||document,L=[],AU=!!o.auto;
  if(o.L)L.push(...o.L);else{const seenK={};box.querySelectorAll('[data-c]').forEach(b=>{const x=D.find(b.dataset.c);if(x&&x.got&&!seenK[x.k]){seenK[x.k]=1;L.push(x);}});if(!seenK[c.k])L.unshift(c);}
  let ix=Math.max(0,L.findIndex(x=>x.k===c.k)),cur=null,v=null,raf=0,TT=[],sub=null,hideT=0,autoT=0,held=false,dirty=false,MORE=false,VW=AU;   // 13.9.5: MORE — открыто «Подробнее»; 13.9.8: VW — раскрыто видео (оба держатся при листании)
  // 13.9.9 (Андрей: «не в фулл скрин»): окно — шторка снизу по высоте содержимого (телефон) / карточка по центру (ПК);
  // словарь виден под затемнением, кадр фильма — фон самой шторки (.kn2-bg внутри .kn2), прокрутка — внутри (.kn2-sc)
  // 13.9.11: шторка — настройка (Настройки → «Окно фразы»). 13.9.15 (Андрей: «го»): по умолчанию — полэкрана; на весь экран — store.knWin='full'.
  // В шторке видео — окошком над ней (.kn2-pip), убирается ×
  const SM=store.knWin!=='full',SH=SM&&!matchMedia('(min-width:760px)').matches;
  const ov=document.createElement('div');ov.className='kno kno2'+(SM?' kn2s':'')+(AU?' auto':'');   // класс .sheet занят в main.css (шторка ответа в квизе) — у нас .kn2s
  const segH=AU?`<div class="kn2-seg${L.length>30?' one':''}">${L.length>30?'<i><b></b></i>':L.map(()=>'<i><b></b></i>').join('')}</div>${o.title?`<span class="kn2-at">${E(o.title)}</span>`:''}`:'';
  ov.innerHTML=(SM?`<div class="kno-dim"></div><div class="kn2-pip" aria-hidden="true"><button class="kn2-pipx" aria-label="Убрать видео">${ui('close')}</button></div><div class="kn2" role="dialog" aria-label="${c.w?'Слово из фильма':'Фраза из фильма'}"><div class="kn2-bg"></div><i class="kn2-grab" aria-hidden="true"></i>${segH}<button class="kn2-x" aria-label="Закрыть">${ui('close')}</button><div class="kn2-sc"><div class="kn2-in"></div></div></div>`
      :`<div class="kn2-bg"></div><div class="kno-dim"></div><div class="kn2" role="dialog" aria-label="${c.w?'Слово из фильма':'Фраза из фильма'}">${segH}<button class="kn2-x" aria-label="Закрыть">${ui('close')}</button><div class="kn2-in"></div></div>`)
    +`${L.length>1?`<button class="kn2-nv pv" aria-label="Предыдущая">${ui('back')}</button><button class="kn2-nv nx" aria-label="Следующая">${ui('fwd')}</button>`:''}`;
  document.body.appendChild(ov);document.body.classList.add('dx-open');try{musDuck(true);}catch(e){}try{backBtn(true);}catch(e){}
  const card=ov.querySelector('.kn2'),sc=ov.querySelector('.kn2-sc')||card,pip=SH?ov.querySelector('.kn2-pip'):null,inn=ov.querySelector('.kn2-in'),bgl=ov.querySelector('.kn2-bg'),dim=ov.querySelector('.kno-dim'),segs=[...ov.querySelectorAll('.kn2-seg b')];
  const setSeg=k=>{if(!segs.length)return;if(segs.length===1){segs[0].style.transform=`scaleX(${((ix+k)/L.length).toFixed(4)})`;return;}segs.forEach((b,j)=>{b.style.transform=`scaleX(${j<ix?1:j>ix?0:k.toFixed(3)})`;});};
  const setBg=s=>{const u=s&&filmImg(s,innerWidth>=760?'bd.jpg':'bdm.jpg'),url=u?`url('${u}')`:s?D.cover(s):'radial-gradient(circle at 28% 22%,#5a4a32,#1a1612 55%,#0b0b0d)',old=bgl.lastElementChild;if(old&&old.dataset.u===url)return;
    const i=document.createElement('i');i.dataset.u=url;i.style.backgroundImage=url;bgl.appendChild(i);const rm=()=>[...bgl.children].forEach(x=>{if(x!==i)x.remove();});
    if(old&&fxOK())i.animate([{opacity:0},{opacity:1}],{duration:520,easing:'ease-out'}).onfinish=rm;else rm();};
  const mkV=()=>{if(!v){v=document.createElement('video');v.setAttribute('playsinline','');v.setAttribute('webkit-playsinline','');v.playsInline=true;v.preload='auto';}return v;};
  const stopV=()=>{cancelAnimationFrame(raf);raf=0;clearTimeout(hideT);clearTimeout(autoT);if(v){try{v.pause();}catch(e){}v.onplay=v.ontimeupdate=v.onloadedmetadata=v.onerror=v.onclick=null;}};
  const pgHTML=()=>{if(L.length<2)return '';const h=!AU&&!KN.pgSeen;KN.pgSeen=true;   // 13.9.5: «листай вбок» — только первый раз за заход
    return `<span class="kn2-pg">${ix+1} / ${L.length}${h?(matchMedia('(hover:hover)').matches?' · ← →':' · листай вбок'):''}</span>`;};
  // 13.9.5 (Андрей: «не минималистично, всё должно появляться по мере необходимости»): сразу — момент, фраза, перевод; остальное — под «Подробнее»
  const moreBtn=()=>`<button class="kn5-mb kn6-mb" data-v="more" aria-expanded="${MORE}">Подробнее <i>▾</i></button>`;
  const moreBind=()=>{const b=inn.querySelector('[data-v="more"]'),m=inn.querySelector('.kn5-more');if(!b||!m)return;
    b.onclick=e=>{e.stopPropagation();sfx('tap');MORE=!MORE;b.setAttribute('aria-expanded',MORE);m.hidden=!MORE;
      if(MORE&&fxOK())m.animate([{opacity:0,transform:'translateY(-6px)'},{opacity:1,transform:'none'}],{duration:260,easing:EZ.out});};};
  // 13.9.8 (Андрей: «убери плеер, пока юзер не захочет посмотреть; он может и прослушать»; само — ничего): видео — в свёрнутой обёртке
  // под кнопками, не display:none (такое видео iPhone может не перемотать и не заиграть); src — только при первом нажатии
  const vBox=(W,hw)=>`<div class="kn6-vw${VW&&!pip?' on full':''}"><div class="kn6-vi"><div class="kn2-v">${W?`<div class="kn2-sub" aria-hidden="true">${W.map((w,j)=>`<span${hw&&hw.has(j)?' class="kn2-hw"':''}>${E(w)}</span>`).join(' ')}</div>`:''}<button class="knv-p kn2-p" aria-label="Смотреть момент" hidden>${SI.play}</button></div></div></div>`;
  // 13.9.11: в шторке на телефоне видео — окошком над шторкой (.kn2-pip), шторка становится ниже; × — убрать окошко
  const pipIn=()=>{if(!pip)return;const vi=inn.querySelector('.kn6-vi');if(!vi)return;[...pip.children].forEach(x=>{if(!x.classList.contains('kn2-pipx'))x.remove();});pip.appendChild(vi);
    if(!pip.classList.contains('on')){pip.classList.add('on');ov.classList.add('vw');if(fxOK())pip.animate([{opacity:0,transform:'translateY(-16px) scale(.96)'},{opacity:1,transform:'none'}],{duration:320,easing:EZ.out});}};
  const pipOut=()=>{if(!pip)return;VW=false;try{if(v)v.pause();}catch(e){}pip.classList.remove('on');ov.classList.remove('vw');[...pip.children].forEach(x=>{if(!x.classList.contains('kn2-pipx'))x.remove();});
    const w=inn.querySelector('.kn6-vw');if(w&&!w.querySelector('.kn6-vi')&&v){/* видео уехало вместе с окошком — следующая фраза соберёт своё */}};
  if(pip)pip.querySelector('.kn2-pipx').onclick=e=>{e.stopPropagation();sfx('tap');pipOut();};
  const openVW=()=>{VW=true;if(pip){pipIn();return;}const w=inn.querySelector('.kn6-vw');if(!w||w.classList.contains('on'))return;w.classList.add('on');setTimeout(()=>{if(w.isConnected)w.classList.add('full');},fxOK()?460:0);};
  const ftHTML=(k,m,stt)=>{const pg=pgHTML();if(!stt&&!pg)return '';
    return `<div class="kn6-ft">${stt?`<span class="kn6-st st-${k}"><i class="kn2-dots" aria-hidden="true">${[1,2,3].map(n=>`<b class="${n<=Math.min(3,m)?'on':''}"></b>`).join('')}</i>${E(stt)}</span>`:''}${pg}</div>`;};
  const factToggle=b=>{const p=b.nextElementSibling,on=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',on);p.hidden=!on;sfx(on?'unlock':'tap');
    if(on&&fxOK())p.animate([{opacity:0,transform:'translateY(-6px)'},{opacity:1,transform:'none'}],{duration:280,easing:EZ.out});};
  const endAuto=()=>{const vb=inn.querySelector('.kn2-v')||inn,e=document.createElement('div');e.className='kn2-end';
    e.innerHTML=`<b>${o.title?E(o.title)+' — ':''}всё</b><span><button data-e="again">↺ Сначала</button><button data-e="x">Закрыть</button></span>`;vb.appendChild(e);
    if(fxOK())e.animate([{opacity:0,transform:'scale(.94)'},{opacity:1,transform:'none'}],{duration:360,easing:EZ.out});
    e.querySelector('[data-e="again"]').onclick=ev=>{ev.stopPropagation();sfx('tap');ix=0;fill(L[0],1);};e.querySelector('[data-e="x"]').onclick=ev=>{ev.stopPropagation();sfx('tap');close();};};
  const nextAuto=(c,ms)=>{clearTimeout(autoT);if(!AU||cur!==c)return;autoT=setTimeout(()=>{if(cur!==c||!ov.isConnected||held)return;if(ix>=L.length-1)endAuto();else go(1);},ms);};
  // момент: видео эпизода с a до b; слова загораются в такт речи — у фразы в самой фразе (kk), у слова — в субтитре на видео
  // (время слов — wt.json сцены; нет — равномерно)
  const vSetup=(c,f,W,kk)=>{const {s,p}=c,vb=inn.querySelector('.kn2-v'),vv=mkV(),pb=vb.querySelector('.kn2-p');vb.prepend(vv);vv.poster=assetUrl(scEpKey(s,c.pi,'jpg'));
    sub=vb.querySelector('.kn2-sub');
    const K=kk?kk.items:[...(sub?sub.children:[])].map((el,j)=>({el,js:[j]})),cOn=kk?'kk-on':'on',cNow=kk?'kk-now':'now',host=kk?kk.el:sub,cPlay=kk?'kk-play':'show';
    const a=Math.max(0,f.a-p.a-0.15),b=f.b-p.a+0.25,src=assetUrl(scEpKey(s,c.pi,'mp4'));TT=kLin(f,W);
    wtLoad(s.id).then(R=>{if(cur!==c)return;const X=kFit(f,W,R);if(X)TT=X;});
    const tw=j=>TT[j]||[f.a,f.b];
    const paint=()=>{const t=vv.currentTime+p.a;K.forEach(k=>{k.el.classList.toggle(cOn,t>=tw(k.js[0])[0]-0.04);k.el.classList.toggle(cNow,k.js.some(j=>t>=tw(j)[0]-0.04&&t<tw(j)[1]+0.04));});if(AU)setSeg(Math.max(0,Math.min(1,(vv.currentTime-a)/Math.max(.3,b-a))));};
    const loop=()=>{raf=0;if(!ov.isConnected||cur!==c)return;paint();if(!vv.paused)raf=requestAnimationFrame(loop);};
    const play=slow=>{clearTimeout(hideT);clearTimeout(autoT);if(vv.dataset.src!==src){vv.dataset.src=src;vv.src=src+'#t='+a.toFixed(2);}vv.volume=store.scVol==null?1:store.scVol;
      vv.playbackRate=slow?.75:1;try{if(Math.abs(vv.currentTime-a)>0.05)vv.currentTime=a;}catch(e){}K.forEach(k=>k.el.classList.remove(cOn,cNow));if(host)host.classList.add(cPlay);
      const pr=vv.play();if(pr&&pr.catch)pr.catch(()=>{pb.hidden=false;});pb.hidden=true;};
    vv.onplay=()=>{if(!raf)raf=requestAnimationFrame(loop);};
    vv.ontimeupdate=()=>{if(cur!==c)return;if(vv.currentTime>=b&&!vv.paused){vv.pause();pb.hidden=false;K.forEach(k=>{k.el.classList.add(cOn);k.el.classList.remove(cNow);});if(AU)setSeg(1);
      hideT=setTimeout(()=>{if(cur===c&&vv.paused&&host)host.classList.remove(cPlay);},kk?700:1100);nextAuto(c,1400);}};
    vv.onloadedmetadata=()=>{if(vv.currentTime<a-0.1||vv.currentTime>b)try{vv.currentTime=a;}catch(e){}};
    vv.onerror=()=>{pb.hidden=false;nextAuto(c,2500);};
    pb.onclick=e=>{e.stopPropagation();sfx('tap');held=false;play(false);};vv.onclick=()=>{if(vv.paused){held=false;play(false);}else{vv.pause();pb.hidden=false;clearTimeout(autoT);held=true;}};
    return play;};
  // 13.9.8: сразу — «фильм · эп. N», фраза, перевод, «🔊 Послушать · ▶ Смотреть · 🐢»; под «Подробнее» — «Когда пригодится» и факт
  // (свёрнут, Андрей: «спрячь под скобкой»); статус — тихой строкой внизу рядом с «1 / 3». Само ничего не играет (кроме «▶ подряд»)
  const fillPh=c=>{const {s,f,pi}=c,[k]=knSt(c),P=scP(s.id),rn=RN[c.rar],T=D.T(f),W=T.split(/\s+/).filter(Boolean);
    const factOk=!!(f.fact&&(D.demo()||ADM_OPEN()||P.done.includes(pi))&&!(scL()==='de'&&!scIsDe()));
    card.className='kn2 kn6 r-'+rn;
    inn.innerHTML=`<div class="kn2-b"><span class="kn6-src">${E(dictFilm(s))} · эп. ${pi+1}${c.rar>1?` · <i class="kn6-rr" data-r="${rn}">${RT[rn].toLowerCase()}</i>`:''}</span>
        <b class="kn2-en">${kwWrap(f,T)}</b><span class="kn2-ru">${E(f.ru)}</span>
        <div class="kn2-acts kn5-acts kn6-acts"><button data-v="hear">${SI.vol} Послушать</button><button data-v="watch">${SI.play} Смотреть</button><button data-v="slow" aria-label="Медленнее" title="Медленнее">🐢</button></div>
        ${vBox(null)}${moreBtn()}
        <div class="kn5-more"${MORE?'':' hidden'}>${phInfoHTML(f,{})}${factOk?`<div class="kn6-fact"><button data-v="fact" aria-expanded="false">✦ Интересный факт <i>▾</i></button><p hidden>${E(f.fact)}</p></div>`:''}<button class="kn5-ep" data-v="ep">Эпизод в фильме ${ui('fwd')}</button></div>
        ${ftHTML(k,c.m,kSt2(c,P.r[f.id]))}</div>`;
    const play=vSetup(c,f,W,kkMap(inn.querySelector('.kn2-en'),T,W));
    inn.querySelectorAll('[data-v]:not([data-v="more"])').forEach(x=>x.onclick=()=>{const t=x.dataset.v;if(t==='fact'){factToggle(x);return;}sfx('tap');
      if(t==='ep'){close();setTimeout(()=>srOpen(s.id,pi,f.a),220);return;}
      held=false;if(t==='watch')openVW();play(t==='slow');});
    moreBind();try{phBind(inn,f);}catch(e){}
    return play;};
  const fillW=c=>{const x=c.w,s=c.s,f=c.f,tg=x.tags||[],st=mywLearned(x)?'ok':!x.due||x.due<=Date.now()?'due':'go';
    let W=[],hw=null;if(f){W=String(f.en||'').split(/\s+/).filter(Boolean);const q=String(x.w).split(/\s+/).map(wtN).filter(Boolean);hw=new Set();
      for(let j=0;j<W.length&&q.length&&!hw.size;j++)if(q.every((w,i)=>W[j+i]&&wtEq(wtN(W[j+i]),w)))q.forEach((w,i)=>hw.add(j+i));}
    card.className='kn2 kn6 r-com kn2w'+(f?'':' nov');
    inn.innerHTML=`<div class="kn2-b"><span class="kn6-src">${s?`${E(dictFilm(s))} · эп. ${c.pi+1}`:'Своё слово'}</span>
        <b class="kn2-word">${E(x.w)}</b><span class="kn2-ru">${x.ru?E(x.ru):'<i class="kn2-no">перевод не добавлен</i>'}</span>${s?wiHTML(x.w,wiLang(s.id)):''}
        ${c.line?`<p class="kn2-line">${markWord(c.line,x.w,'<mark>','</mark>')}${c.lineRu?`<small>${E(c.lineRu)}</small>`:''}</p>`:''}
        ${f?`<div class="kn2-acts kn5-acts kn6-acts"><button data-v="word">${SI.vol} Слово</button><button data-v="watch">${SI.play} Смотреть</button></div>${vBox(W,hw)}`:''}${moreBtn()}
        <div class="kn5-more"${MORE?'':' hidden'}>${tg.length?`<div class="kn2-tags">${tg.map(t=>`<i>#${E(t)}</i>`).join('')}</div>`:''}
          ${f?`<button class="kn5-ep" data-v="ep">Эпизод в фильме ${ui('fwd')}</button>`:''}<button class="kn2-del" data-v="del">Убрать из моих слов</button></div>
        ${ftHTML(st,Math.min(3,x.st||0),wSt2(x))}</div>`;
    if(s&&!WI[wiLang(s.id)])wiLoad(wiLang(s.id)).then(()=>{const r=inn.querySelector('.kn2-ru'),w=inn.querySelector('.kn2-word');if(r&&w&&w.textContent===x.w&&!inn.querySelector('.kwp-wi'))r.insertAdjacentHTML('afterend',wiHTML(x.w,wiLang(s.id)));});   // 13.9.13: подробнее о слове
    const play=f?vSetup(c,f,W,null):null;
    moreBind();inn.querySelectorAll('[data-v]:not([data-v="more"])').forEach(b=>b.onclick=()=>{const t=b.dataset.v;sfx('tap');
      if(t==='ep'){close();setTimeout(()=>srOpen(s.id,c.pi,f.a),220);return;}
      if(t==='word'){held=true;clearTimeout(autoT);if(v)v.pause();wordPlay(s.id,x.w,f.a,f.b,b);return;}
      if(t==='del'){mywDel(x.k);save();toast('Убрал из «Моих слов»');haptic('ok');dirty=true;L.splice(ix,1);if(!L.length){close();return;}ix=ix%L.length;fill(L[ix],1);return;}
      held=false;if(t==='watch')openVW();if(play)play(false);});
    if(!f)nextAuto(c,2600);
    return play;};
  const fill=(c,dir)=>{stopV();cur=c;held=false;setBg(c.s);ov.style.setProperty('--c',c.s?th(c.s):'#F3EBDD');
    if(v&&v.parentNode)v.remove();
    const play=c.w?fillW(c):fillPh(c);sc.scrollTop=0;setSeg(0);if(pip&&VW)pipIn();
    if(dir&&fxOK())inn.animate([{opacity:0,transform:`translateX(${dir*46}px)`},{opacity:1,transform:'none'}],{duration:340,easing:EZ.out});
    if(play&&AU)play(false);};   // 13.9.8: Андрей — «само ничего не играет»; «▶ подряд» — играет, его для этого и нажимают
  const go=d=>{if(L.length<2)return;ix=(ix+d+L.length)%L.length;sfx('page');haptic('sel');try{kwHide(0);}catch(e){}
    if(!fxOK())return fill(L[ix],0);const an=inn.animate([{opacity:1,transform:'none'},{opacity:0,transform:`translateX(${-d*46}px)`}],{duration:150,easing:EZ.in,fill:'forwards'});an.onfinish=()=>{fill(L[ix],d);an.cancel();};};
  fill(L[ix]||c,0);
  // открытие: на телефоне шторка выезжает снизу; на ПК карточка растёт из строки (кружка, плитки); затемнение проявляется
  const R=card.getBoundingClientRect(),zk=R.width/card.offsetWidth||1;
  const grow=(rr,back)=>{const sx=Math.max(.05,rr.width/R.width),sy=Math.max(.05,rr.height/R.height),tx=(rr.left-R.left)/zk,ty=(rr.top-R.top)/zk,fr=[{transform:`translate(${tx}px,${ty}px) scale(${sx},${sy})`,opacity:.4},{transform:'none',opacity:1}];
    card.style.transformOrigin='0 0';return card.animate(back?fr.reverse():fr,{duration:back?300:560,easing:back?EZ.in:SPRING,fill:back?'forwards':'none'});};
  if(fxOK()){
    if(SH)card.animate([{transform:'translateY(100%)'},{transform:'none'}],{duration:480,easing:SPRING});
    else if(btn){grow(btn.getBoundingClientRect());btn.style.visibility='hidden';}
    [...inn.querySelectorAll('.kn2-b>*')].forEach((ch,i)=>{if(i<9)ch.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{duration:420,delay:(SH?120:160)+i*60,easing:EZ.out,fill:'backwards'});});
    dim.animate([{opacity:0},{opacity:1}],{duration:SH?300:420});if(!SM)bgl.animate([{opacity:0},{opacity:1}],{duration:420});if(!c.w)setTimeout(()=>DL.burst(inn.querySelector('.kn2-en'),c.rar,.6),300);}
  const close=ov._close=()=>{if(ov._c)return;ov._c=true;stopV();cur=null;if(v){try{v.removeAttribute('src');v.load();}catch(e){}}try{musDuck(false);}catch(e){}try{kwHide(0);}catch(e){}document.removeEventListener('keydown',ek);document.body.classList.remove('dx-open');
    const it=L[ix],row=!SH&&!dirty&&it&&box.querySelector(it.sel||`[data-c="${it.k}"]`),r1=row&&row.isConnected?row.getBoundingClientRect():null,back=fxOK()&&r1&&r1.width&&r1.bottom>0&&r1.top<innerHeight;
    const sl=SH&&fxOK(),t0=sl?getComputedStyle(card).transform:'none';
    if(sl)card.animate([{transform:t0&&t0!=='none'?t0:'none'},{transform:'translateY(100%)'}],{duration:260,easing:EZ.in,fill:'forwards'});   // шторка уезжает вниз (и с того места, куда её дотянули пальцем)
    else if(back){inn.animate([{opacity:1},{opacity:0}],{duration:120,fill:'forwards'});grow(r1,true);}else card.animate([{opacity:1},{opacity:0,transform:'scale(.96)'}],{duration:200,easing:'ease-in',fill:'forwards'});
    ov.querySelectorAll(SM?'.kno-dim,.kn2-nv,.kn2-pip':'.kn2-bg,.kno-dim,.kn2-nv').forEach(x=>x.animate([{opacity:getComputedStyle(x).opacity},{opacity:0}],{duration:sl?260:back?300:200,fill:'forwards'}));
    setTimeout(()=>{ov.remove();if(btn)btn.style.visibility='';if(dirty)DL.render(0);else DL.bb();},sl?270:back?310:210);};
  const ek=e=>{if(e.key==='Escape')close();else if(e.key==='ArrowRight')go(1);else if(e.key==='ArrowLeft')go(-1);};document.addEventListener('keydown',ek);
  dim.onclick=close;ov.querySelector('.kn2-x').onclick=()=>{sfx('tap');close();};
  ov.querySelectorAll('.kn2-nv').forEach(b=>b.onclick=()=>{held=false;go(b.classList.contains('nx')?1:-1);});
  // тронул текст (слово, «Когда пригодится») — «подряд» ждёт, пока сам не листнёшь
  card.addEventListener('pointerdown',e=>{if(AU&&e.target.closest('.kn2-b')){held=true;clearTimeout(autoT);}},{capture:true});
  // свайп вбок — соседняя фраза; вниз — шторка едет за пальцем (если прокрутка внутри в самом верху), отпустил ниже 110 px — закрылась
  let x0=null,y0=null,drag=0,dragOk=false;
  card.addEventListener('touchstart',e=>{const t=e.touches[0];x0=t.clientX;y0=t.clientY;drag=0;dragOk=SH&&sc.scrollTop<=0;},{passive:true});
  card.addEventListener('touchmove',e=>{if(!dragOk||x0==null)return;const t=e.touches[0],dx=t.clientX-x0,dy=t.clientY-y0;
    if(!drag&&(Math.abs(dx)>Math.abs(dy)||dy<0)){if(Math.abs(dx)>8||dy<-8)dragOk=false;return;}
    if(dy>0){drag=dy;e.preventDefault();card.style.transform=`translateY(${dy}px)`;dim.style.opacity=String(Math.max(.2,1-dy/420));}},{passive:false});
  card.addEventListener('touchend',e=>{if(x0==null)return;const t=e.changedTouches[0],dx=t.clientX-x0,dy=t.clientY-y0;x0=null;
    if(drag){const d=drag;drag=0;if(d>110){close();return;}
      card.style.transform='';dim.style.opacity='';if(fxOK())card.animate([{transform:`translateY(${d}px)`},{transform:'none'}],{duration:260,easing:EZ.out});return;}
    if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.4){held=false;go(dx<0?1:-1);return;}
    if(!SH&&dy>110&&Math.abs(dy)>Math.abs(dx)*1.4&&sc.scrollTop<=0)close();},{passive:true});
  return ov;}

/* ---------- куски экранов ---------- */
const seg=()=>{const cs=curSeg(),b=(k,t)=>`<button data-kseg="${k}" class="${cs===k?'on':''}">${t}</button>`;   // 13.8.6: просто текст, без эмодзи и счётчиков
  return `<div class="kn-seg kn-tabs" role="tablist">${b('kino','Кинотека')}${b('my','Мои фразы и слова')}</div>`;};
function knHit(c){const f=c.f,q=KN.q.toLowerCase();
  if(KN.tp&&!fTopics(f).includes(KN.tp))return false;
  if(KN.tone&&scTag(f)[1]!==KN.tone)return false;
  if(KN.film&&dictFilm(c.s)!==KN.film)return false;
  const st=KN.st;if(st&&(st==='got'&&!c.got||st==='no'&&c.got||st==='new'&&!(c.got&&c.m===0&&!c.due)||st==='due'&&!c.due||st==='ok'&&!(c.got&&c.m>=3&&!c.due)))return false;
  if(q){const t=(f.en+' '+(f.de||'')+' '+f.ru+' '+(f.use||'')+' '+(f.kw||[]).map(k=>(k||[]).slice(0,3).join(' ')).join(' ')).toLowerCase();if(!t.includes(q))return false;}
  return true;}
function knRes(){const any=!!(KN.q||KN.tp||KN.st||KN.tone||KN.film);
  if(!any){const T=tpCnt(allCards());return `<h3 class="kn-h">Темы<small>выбери — увидишь все фразы на неё</small></h3><div class="kn-tt">${T.map(x=>`<button data-tpk="${E(x.k)}"><span class="kn-tti">${x.ico}</span><b>${E(x.k)}</b><small>у тебя ${x.g} из ${x.t}</small>${bar(x.g,x.t)}</button>`).join('')}</div>`;}
  const L=allCards().filter(knHit),g=L.filter(c=>c.got).length;
  const title=KN.tp?`${TOPIC_ICO[KN.tp]||''} ${E(KN.tp)}`:KN.q?`«${E(KN.q)}»`:'Найдено';
  const LN=KN.q&&!KN.tp&&!KN.st&&!KN.tone?lnFind(KN.q).filter(x=>!KN.film||dictFilm(x.s)===KN.film):[];   // 13.9.16: и по всем репликам
  if(!L.length&&!LN.length)return `<div class="kn-empty">Ничего не нашлось<small>Попробуй другое слово или сбрось фильтры.</small><button class="kn-btn2" data-reset>Сбросить фильтры</button></div>`;
  if(!L.length)return `<div class="kn-rh"><span><b>${title}</b><small>фраз нет — зато есть в репликах</small></span><button class="kn-reset" data-reset>Сбросить</button></div>${lnResHTML(LN)}`;
  const by=[],m={};L.forEach(c=>{const k=dictFilm(c.s);if(!m[k]){m[k]=[];by.push(k);}m[k].push(c);});
  return `<div class="kn-rh"><span><b>${title}</b><small>у тебя <b>${g}</b> из ${L.length}${L.length-g?` · ещё ${L.length-g} — под туманом, в непройденных эпизодах`:''}</small></span><button class="kn-reset" data-reset>Сбросить</button></div>${bar(g,L.length)}
    ${by.map(k=>{const C=m[k].map((c,i)=>[c,i]).sort((x,y)=>(y[0].got-x[0].got)||(x[1]-y[1])).map(x=>x[0]);return `<section class="kn-lg3"><button class="kn-gh kn-gh2" data-show="${E(k)}"><span class="kn-ght"><b>${E(k)}</b><small>${C.filter(c=>c.got).length} из ${C.length}</small></span><i class="kn-chev">${ui('fwd')}</i></button>${rowsL(C)}</section>`;}).join('')}${lnResHTML(LN)}`;}
// 13.8.4: тема — такой же кнопкой со списком, как статус/тон/фильм (было: ряд чипов сверху + те же темы плитками ниже)
const DD=[['tp','Тема','Все'],['st','Статус','Все'],['tone','Тон','Любой'],['film','Фильм','Все']];
const ddOpts=(k,F)=>k==='tp'?tpCnt(allCards()).map(x=>[x.k,`${x.ico} ${E(cap(x.k))} · ${x.g}/${x.t}`]):k==='st'?STF:k==='tone'?TONE:(F||DL.films()).map(sh=>[sh.k,E(sh.k)]);
function knDD(k){const d=DD.find(x=>x[0]===k),O=ddOpts(k);sfx('tap');
  const w=knSheet(`<b class="kn-sh2">${d[1]}</b><div class="kn-ddl"><button data-ddv="" class="${KN[k]?'':'on'}">${d[2]}</button>${O.map(([v,l])=>`<button data-ddv="${E(v)}" class="${KN[k]===v?'on':''}">${l}</button>`).join('')}</div>`);
  w.querySelectorAll('[data-ddv]').forEach(b=>b.onclick=()=>{sfx('sel');haptic('sel');KN[k]=b.dataset.ddv;w._close();DL.render(0);});}
function bindCards(st){st.querySelectorAll('.kc[data-c],.kcc[data-c],.kr[data-c],.kq[data-c]').forEach(b=>b.onclick=()=>{const c=D.find(b.dataset.c);if(!c)return;if(!c.got){knLock(b,c);return;}sfx('tap');haptic('light');knOpen(b,c);});}
function bindRes(st){const box=st.querySelector('#knRes');if(!box)return;bindCards(box);lnBind(box);box.querySelectorAll('.kl-ln[data-wep],.kl-unl[data-wep]').forEach(b=>b.onclick=e=>{e.stopPropagation();const [sid,i]=b.dataset.wep.split('|'),s=scOf(sid),pi=+i;if(!s)return;sfx('tap');if(!ADM_OPEN()&&!scEpOpen(s,pi)){haptic('err');toast(`Эпизоды по порядку — сначала эпизод ${pi}`);return;}if(scGate(sid,pi))return;renderScEp(sid,pi);});
  box.querySelectorAll('[data-tpk]').forEach(b=>b.onclick=()=>{sfx('tap');haptic('sel');KN.tp=b.dataset.tpk;DL.render(0);});
  box.querySelectorAll('[data-reset]').forEach(b=>b.onclick=()=>{sfx('tap');Object.assign(KN,{q:'',tp:'',st:'',tone:'',film:''});DL.render(0);});
  if(fxOK())box.querySelectorAll('.kc,.kq,.kn-tt button').forEach((c,i)=>{if(i<18)c.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'none'}],{duration:320,delay:i*24,easing:EZ.out,fill:'backwards'});});}

/* ---------- 13.8.2: фильм как в Кинотеке — картинки высокого разрешения, кино-карты, движение ---------- */
const knBd=s=>{const u=filmImg(s,innerWidth>=760?'bd.jpg':'bdm.jpg');return u?`url('${u}')`:'';};
const knPoster=s=>D.poster(s);
// полёт картинки: из одного места экрана в другое (постер с полки → в шапку фильма и обратно)
function knFly(r0,toEl,bg,o){o=o||{};if(!fxOK()||!toEl||!r0||!r0.width)return;const t=toEl.getBoundingClientRect();if(!t.width||t.bottom<0||t.top>innerHeight)return;
  const c=document.createElement('div');c.className='kn-fly';c.style.cssText=`left:${r0.left}px;top:${r0.top}px;width:${r0.width}px;height:${r0.height}px;background-image:${bg}`;
  FXROOT().appendChild(c);toEl.style.visibility='hidden';
  const dx=t.left+t.width/2-(r0.left+r0.width/2),dy=t.top+t.height/2-(r0.top+r0.height/2),sx=t.width/r0.width,sy=t.height/r0.height,d=o.d||640;
  let done=false;const fin=()=>{if(done)return;done=true;toEl.style.visibility='';c.animate([{opacity:1},{opacity:0}],{duration:180,fill:'forwards'}).onfinish=()=>c.remove();};
  c.animate([{transform:'none',boxShadow:'0 10px 20px rgba(0,0,0,.4)'},{transform:`translate(${dx*.55}px,${dy*.55-30}px) scale(${(1+sx)/2*1.06},${(1+sy)/2*1.06})`,boxShadow:'0 40px 80px rgba(0,0,0,.7)',offset:.55},{transform:`translate(${dx}px,${dy}px) scale(${sx},${sy})`,boxShadow:'0 18px 40px rgba(0,0,0,.6)'}],{duration:d,easing:EZ.out,fill:'forwards'}).onfinish=fin;
  setTimeout(fin,d+500);}
let PAR=null;
function knPar(hero){if(PAR){removeEventListener('scroll',PAR);PAR=null;}if(!hero||!fxOK())return;const bd=hero.querySelector('.kf-bd'),lv=hero.querySelector('.kf-live');
  PAR=()=>{if(!hero.isConnected){removeEventListener('scroll',PAR);PAR=null;return;}const y=Math.min(700,Math.max(0,scrollY));bd.style.transform=`translateY(${(y*.35).toFixed(1)}px) scale(1.04)`;if(lv)lv.style.transform=`translateY(${(y*.35).toFixed(1)}px)`;};
  addEventListener('scroll',PAR,{passive:true});}
function knCount(el){const n=+el.dataset.n;if(!n||!fxOK())return;const t0=performance.now(),d=900;el.textContent='0';
  const step=t=>{if(!el.isConnected)return;const k=Math.min(1,(t-t0)/d);el.textContent=Math.round(n*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(step);};requestAnimationFrame(step);}
/* ---------- 13.9.1: Кинотека на весь экран (Андрей: «нажал на „Фильмы / Сериалы / Интервью“ — как в первой версии на весь экран,
   листаешь, и дай выйти»). Слайд = фильм раздела: фон 4K, живой момент без звука (только у текущего слайда), постер, название,
   «Собрано N из M», «▶ Смотреть» / «Открыть ›». Листание — свайп вбок, точки, стрелки на ПК, ← →. Выход — ✕, свайп вниз, Esc, «назад». ---------- */
const KS={film:'Фильм',series:'Сериал',interview:'Интервью'};
const knfQ=sh=>sh.L.flatMap(s=>D.cards(s)).filter(c=>c.got).sort((a,b)=>(b.rar-a.rar)||(b.m-a.m))[0]||null;   // живой момент — самая редкая собранная фраза
const knfNext=sh=>sh.L.find(s=>scP(s.id).done.length<s.parts.length)||sh.L[0];
// 13.9.10 (Андрей: «кинотеку не передала на самый первый вариант — такая проблема и осталась»: кадр 16:9 растянут на весь
// вертикальный экран — видно одно плечо, мыло). Как в первой «Кинотеке» (вариант cinema): кадр — в карточке 16:9 (не режется),
// в ней живой момент, название курсивом и цитата; фон — тот же кадр, сильно размыт; ниже постер, «Собрано», кнопки
function knfSlide(sh,i){const s0=sh.s0,bd=knBd(s0),img=bd||D.cover(s0),q=knfQ(sh),nx=knfNext(sh),eps=sh.L.reduce((a,s)=>a+s.parts.length,0);
  return `<section class="knf-s knf2${bd?' bd':''}" data-i="${i}" style="--c:${th(s0)};--bg:${img}"><span class="knf-bd"><i></i></span><span class="knf-gr"></span>
    <div class="knf-in"><div class="knf-hero"><span class="knf-hi"></span><span class="knf-live" data-ls="${(q?q.s:s0).id}" data-pi="${q?q.pi:0}" data-fid="${q?q.f.id:''}"></span><span class="knf-hg"></span>
      <span class="knf-ht"><em>${KS[sh.kind]||''}${sh.kind==='film'&&s0.ep?' · '+E(s0.ep):''}</em><b>${E(sh.k)}</b>${q?`<i>«${E(D.T(q.f))}»</i>`:''}</span></div>
      <div class="knf-row"><span class="knf-p" style="background-image:${D.poster(s0)}"></span><div class="knf-t">
        <small class="knf-c">Собрано <b>${sh.g}</b> из ${sh.t} ${plural(sh.t,['фразы','фраз','фраз'])} · ${D.sc(sh.L.length)} · ${D.ep(eps)}</small>${bar(sh.g,sh.t)}
        <div class="knf-b"><button class="kf-go" data-fw="${nx.id}">${SI.play} ${sh.g?'Смотреть дальше':'Смотреть'}</button><button class="knf-op" data-fo="${i}">Открыть ${ui('fwd')}</button></div></div></div></div></section>`;}
function knFull(kind,btn){DL.clean();const F=DL.films().filter(x=>x.kind===kind),n=F.length;if(!n)return;let cur=-1,vt=0,se=0,closing=false;
  const ov=document.createElement('div');ov.className='kno knf';
  ov.innerHTML=`<div class="knf-pg">${F.map(knfSlide).join('')}</div>
    <div class="knf-top"><span class="knf-ttl"><b>${D.kindName(kind)}</b><i class="knf-num">1 / ${n}</i></span><button class="knf-x" aria-label="Закрыть">${ui('close')}</button></div>
    ${n>1?`<div class="knf-dots">${F.map((sh,i)=>`<button data-i="${i}" aria-label="${E(sh.k)}"></button>`).join('')}</div><button class="knf-nv pv" aria-label="Предыдущий">${ui('back')}</button><button class="knf-nv nx" aria-label="Следующий">${ui('fwd')}</button>`:''}`;
  document.body.appendChild(ov);document.body.classList.add('dx-open');try{backBtn(true);}catch(e){}
  const pg=ov.querySelector('.knf-pg'),SL=[...ov.querySelectorAll('.knf-s')],num=ov.querySelector('.knf-num'),dots=[...ov.querySelectorAll('.knf-dots button')],W=()=>pg.clientWidth||innerWidth;
  const live=i=>{clearTimeout(vt);SL.forEach((s,j)=>{if(j!==i)D.stopVids(s);});
    vt=setTimeout(()=>{const lv=SL[i]&&SL[i].querySelector('.knf-live'),s=lv&&scOf(lv.dataset.ls),pi=lv?+lv.dataset.pi||0:0,p=s&&s.parts[pi],f=p&&(p.ph.find(x=>x.id===lv.dataset.fid)||scAct(p.ph)[0]);
      if(s&&p&&ov.isConnected&&!closing){const v=D.loopVid(lv,s,pi,f,p,{cors:1});if(v)D.unbar(v);}},fxOK()?600:200);};
  const setCur=(i,quiet)=>{if(i===cur)return;cur=i;num.textContent=`${i+1} / ${n}`;dots.forEach((d,j)=>d.classList.toggle('on',j===i));
    ov.querySelectorAll('.knf-nv').forEach(b=>b.disabled=b.classList.contains('pv')?i<=0:i>=n-1);
    if(!quiet){sfx('tick');haptic('sel');}live(i);
    if(fxOK())SL[i].querySelectorAll('.knf-ht>*,.knf-p,.knf-t>*').forEach((x,k)=>x.animate([{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{duration:520,delay:60+k*70,easing:EZ.out,fill:'backwards'}));};
  // фон слегка отстаёт от слайда, пока листаешь
  const par=()=>{const x=pg.scrollLeft,w=W();SL.forEach(s=>{const d=s.offsetLeft-x;if(Math.abs(d)>w*1.3)return;const bd=s.querySelector('.knf-bd');if(bd)bd.style.transform=`translateX(${(-d*.3).toFixed(1)}px)`;});};
  pg.addEventListener('scroll',()=>{if(fxOK())par();clearTimeout(se);se=setTimeout(()=>setCur(Math.max(0,Math.min(n-1,Math.round(pg.scrollLeft/W())))),120);},{passive:true});
  const go=i=>{i=Math.max(0,Math.min(n-1,i));if(i===cur){if(fxOK())pg.animate([{transform:'none'},{transform:`translateX(${i<=0?14:-14}px)`},{transform:'none'}],{duration:260});return;}pg.scrollTo({left:i*W(),behavior:fxOK()?'smooth':'auto'});};
  // уйти из окна сразу (переход на другой экран): без анимации, кнопку «назад» выставит новый экран
  const kill=()=>{closing=true;clearTimeout(vt);document.removeEventListener('keydown',ek);D.stopVids(ov);ov.remove();document.body.classList.remove('dx-open');};
  const close=ov._close=()=>{if(closing)return;closing=true;clearTimeout(vt);document.removeEventListener('keydown',ek);document.body.classList.remove('dx-open');
    let done=false;const fin=()=>{if(done)return;done=true;D.stopVids(ov);ov.remove();DL.bb();};if(!fxOK())return fin();
    ov.animate([{opacity:1,transform:'none'},{opacity:0,transform:'scale(.97)'}],{duration:240,easing:EZ.in,fill:'forwards'}).onfinish=fin;setTimeout(fin,420);};   // 13.9.10: страховка — анимация на слабом устройстве может не успеть
  const ek=e=>{if(e.key==='Escape')close();else if(e.key==='ArrowRight')go(cur+1);else if(e.key==='ArrowLeft')go(cur-1);};document.addEventListener('keydown',ek);
  ov.querySelector('.knf-x').onclick=()=>{sfx('tap');close();};
  ov.querySelectorAll('.knf-nv').forEach(b=>b.onclick=()=>go(cur+(b.classList.contains('nx')?1:-1)));
  dots.forEach(d=>d.onclick=()=>go(+d.dataset.i));
  ov.querySelectorAll('[data-fw]').forEach(b=>b.onclick=()=>{const id=b.dataset.fw;sfx('tap');haptic('medium');kill();if(scGate(id))return;renderScene(id);});
  ov.querySelectorAll('[data-fo]').forEach(b=>b.onclick=()=>{const sh=F[+b.dataset.fo],p=SL[+b.dataset.fo].querySelector('.knf-p');sfx('tap');haptic('sel');
    if(p)S._from={r:p.getBoundingClientRect(),bg:p.style.backgroundImage};kill();DL.open({show:sh.k,sid:null});});
  // свайп вниз — выйти (окно едет за пальцем)
  let x0=null,y0=null;ov.addEventListener('touchstart',e=>{const t=e.touches[0];x0=t.clientX;y0=t.clientY;},{passive:true});
  ov.addEventListener('touchmove',e=>{if(y0==null||!fxOK())return;const t=e.touches[0],dy=t.clientY-y0,dx=t.clientX-x0;if(dy>0&&dy>Math.abs(dx)*1.3){pg.style.transform=`translateY(${(dy*.45).toFixed(1)}px) scale(${(1-Math.min(dy,300)/2400).toFixed(3)})`;pg.style.opacity=String((1-Math.min(dy,400)/900).toFixed(3));}},{passive:true});
  ov.addEventListener('touchend',e=>{if(y0==null)return;const t=e.changedTouches[0],dy=t.clientY-y0,dx=t.clientX-x0;y0=null;
    if(dy>110&&dy>Math.abs(dx)*1.3){close();return;}if(pg.style.transform){pg.animate([{transform:pg.style.transform,opacity:+pg.style.opacity||1},{transform:'none',opacity:1}],{duration:260,easing:EZ.out});pg.style.transform='';pg.style.opacity='';}},{passive:true});
  // появление: окно раскрывается из заголовка раздела
  if(fxOK()){const r=btn&&btn.getBoundingClientRect();ov.animate(r&&r.width?[{clipPath:`inset(${r.top.toFixed(0)}px ${(innerWidth-r.right).toFixed(0)}px ${(innerHeight-r.bottom).toFixed(0)}px ${r.left.toFixed(0)}px round 14px)`,opacity:.5},{clipPath:'inset(0px 0px 0px 0px round 0px)',opacity:1}]:[{opacity:0},{opacity:1}],{duration:560,easing:EZ.out});}
  setCur(0,true);return ov;}
function knMotion(st,lvl){const go=fxOK(),A=(el,kf,o)=>{if(go&&el)el.animate(kf,Object.assign({fill:'backwards',easing:EZ.out},o));};
  st.querySelectorAll('.kn-cnt[data-n]').forEach(knCount);
  if(lvl!=='film')knPar(null);
  if(lvl==='home'){
    st.querySelectorAll('.kn-p,.kn-hero').forEach(p=>p.addEventListener('pointerdown',()=>{const pi=p.querySelector('.kn-pi,.kn-hp');if(pi)S._from={r:pi.getBoundingClientRect(),bg:pi.style.backgroundImage};S._fk=p.dataset.show;},{passive:true}));
    A(st.querySelector('.kn-hero'),[{opacity:0,transform:'translateY(18px) scale(.97)',filter:'blur(8px)'},{opacity:1,transform:'none',filter:'blur(0px)'}],{duration:760});
    A(st.querySelector('.kn-hero .kn-hp'),[{opacity:0,transform:'translateY(30px) rotate(-6deg) scale(.9)'},{opacity:1,transform:'none'}],{duration:820,delay:180,easing:SPRING});
    st.querySelectorAll('.kn-row').forEach((row,ri)=>row.querySelectorAll('.kn-p').forEach((p,i)=>{if(i<8)A(p,[{opacity:0,transform:'perspective(800px) rotateY(-32deg) translateX(46px) scale(.92)'},{opacity:1,transform:'none'}],{duration:700,delay:200+ri*100+i*60,easing:SPRING});}));
    st.querySelectorAll('.kn-srch,.kn-seg,.kn-lang').forEach((x,i)=>A(x,[{opacity:0,transform:'translateY(-8px)'},{opacity:1,transform:'none'}],{duration:420,delay:i*50}));
    st.querySelectorAll('.kq-l .kq,.kn-lg3 .kc').forEach((r,i)=>{if(i<14)A(r,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:380,delay:100+i*28});});}
  if(lvl==='film'){const hero=st.querySelector('.kf'),kp=st.querySelector('.kf-p');
    if(S._from&&kp){scrollTo(0,0);knFly(S._from.r,kp,S._from.bg,{d:680});}S._from=null;S._fk=S.show;
    if(hero){A(hero.querySelector('.kf-bd'),[{opacity:0,transform:'scale(1.14)'},{opacity:1,transform:'scale(1.04)'}],{duration:1300});
      hero.querySelectorAll('.kf-t h2 span').forEach((w,i)=>A(w,[{opacity:0,transform:'translateY(.7em) rotateX(-50deg)',filter:'blur(6px)'},{opacity:1,transform:'none',filter:'blur(0px)'}],{duration:720,delay:280+i*90,easing:SPRING}));
      hero.querySelectorAll('.kf-t>em,.kf-n,.kf-t>.kn-bar,.kf-b').forEach((x,i)=>A(x,[{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'none'}],{duration:560,delay:460+i*90}));
      knPar(hero);}
    // 13.8.7: сцены строками — выезжают по одной
    st.querySelectorAll('.kn-h2,.kf-sr').forEach((x,i)=>A(x,[{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{duration:540,delay:560+i*80}));}
  if(lvl==='scene'){A(st.querySelector('.kn-sh'),[{opacity:0,transform:'translateY(-12px) scale(.98)'},{opacity:1,transform:'none'}],{duration:520});
    st.querySelectorAll('.kn-ep').forEach((e,i)=>A(e,[{opacity:0,transform:'translateY(20px)'},{opacity:1,transform:'none'}],{duration:500,delay:140+i*70}));
    st.querySelectorAll('.kn-ep[open] .kq').forEach((r,i)=>{if(i<16)A(r,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:380,delay:180+i*26});});}
  if(lvl==='flt')st.querySelectorAll('.kn-fq,.kn-chips,.kn-dd').forEach((x,i)=>A(x,[{opacity:0,transform:'translateY(-10px)'},{opacity:1,transform:'none'}],{duration:420,delay:i*60}));}

/* ---------- 13.8.4: «📖 Фразы» — собранные фразы списком, как в словаре: по фильмам, статус словами, ▶ — момент ---------- */
const srch=()=>`<div class="kn-tb"><div class="kn-sp"><button class="kn-sq" data-flt="q">${IC.q}<span>Найти фразу или слово</span></button><button class="kn-sf" data-flt="" aria-label="Фильтры" title="Фильтры">${IC.flt}</button></div></div>`;
// 13.8.6: язык фильмов — тихая кнопка в шапке справа («English ▾»), список — в шторке
const knLangN=l=>dictScenes().filter(s=>dxL(s)===l).reduce((a,s)=>{const C=D.cards(s);return [a[0]+C.filter(c=>c.got).length,a[1]+C.length];},[0,0]);
function knLgDD(){sfx('tap');const w=knSheet(`<b class="kn-sh2">Язык фильмов</b><p class="kn-sm">Словарь показывает фразы из фильмов на этом языке.</p><div class="kn-ddl">${[['en','English'],['de','Deutsch']].map(([l,t])=>{const [g,n]=knLangN(l);return `<button data-lgv="${l}" class="${(DX.lang==='de'?'de':'en')===l?'on':''}">${t} <i>${g} из ${n}</i></button>`;}).join('')}</div>`);
  w.querySelectorAll('[data-lgv]').forEach(b=>b.onclick=()=>{const l=b.dataset.lgv;w._close();if((DX.lang==='de'?'de':'en')===l)return;sfx('sel');haptic('sel');DX.lang=l;S.show=null;S.sid=null;S.flt=false;DL.render(l==='de'?1:-1);});}
/* ---------- 13.9.7: «Мои фразы и слова» — два вида на пробу (Андрей на 13.9.5: «тупо набор слов, нету разделения — типа такого»
   (карточки эпизодов в сцене Кинотеки); «хочу искать удобно, компактно видеть всё, что изучил, и красиво»; «сделай оба, затестить»).
   Общее: поиск всегда виден и ищет сразу по фразам и словам, итог одной строкой, «Повторить сегодня», переключатель вида ☰ / ▦.
   А «Карточки» (store.knMyV='cards'): «По фильмам · По темам» (store.knMyBy), группа = карточка как эпизод Кинотеки (кадр с ▶ —
   «подряд», название, полоска выученного, число), раскрыл — «Тренировать», фразы по эпизодам.
   Б «Постеры» ('posters'): чипы тем, сетка постеров; тап — страница фильма как сцена Кинотеки (шапка + эпизоды), только своё.
   Было: 13.9.5 — один экран (темы, внизу все, #фильм у строк); 13.9.2–13.9.4 — Лента / Разговорник / Переписка / Альбомы. ---------- */
const myKind=()=>store.knMyKind==='w'?'w':'ph';
const myV=()=>store.knMyV==='posters'?'posters':'cards';   // старые album/book/feed/chat → карточки
const myBy=()=>store.knMyBy==='topic'?'topic':'film';
KN.my={tag:null,q:'',tp:'',open:{}};
const OWN='#own';   // «фильм» своих слов (добавлены без сцены)
const wDue=x=>!!x.ru&&(!x.due||x.due<=Date.now());
const wFilm=x=>{const s=!x.own&&scOf(x.sid);return s?dictFilm(s):'';};
const myPh=()=>allCards().filter(c=>c.got);
const nPh=n=>`${n} ${plural(n,['фраза','фразы','фраз'])}`,nWd=n=>`${n} ${plural(n,['слово','слова','слов'])}`;
const gotAt=c=>((scP(c.s.id).got||{})[c.f.id])||0;   // когда собрал фразу (в демо — 0)
// у фразы и у слова одни вопросы: из какой сцены, выучено ли, пора ли повторить, когда добавлено (W — слово)
const itS=(x,W)=>W?(x.own?null:scOf(x.sid)||null):x.s;
const itFilm=(x,W)=>{const s=itS(x,W);return s?dictFilm(s):OWN;};
const isLrn=(x,W)=>W?mywLearned(x):!x.due&&x.m>=3;
const isDue=(x,W)=>W?wDue(x):!!x.due;
const atOf=(x,W)=>W?(x.at||0):gotAt(x);
const scIx=s=>{const i=s?SCENES.indexOf(s):-1;return i<0?1e4:i;};
const ordPh=(a,b)=>scIx(a.s)-scIx(b.s)||a.pi-b.pi||a.n-b.n;
const ordW=(a,b)=>scIx(itS(a,1))-scIx(itS(b,1))||(a.pi||0)-(b.pi||0)||(a.a||0)-(b.a||0)||String(a.w).localeCompare(String(b.w));
const kindOf=s=>!s?'own':['series','interview'].includes(s.kind)?s.kind:'film';
const lastIt=(L,W)=>L.reduce((a,x)=>itS(x,W)&&(!a||atOf(x,W)>atOf(a,W))?x:a,null);   // последнее добавленное (со сценой)
const epImg=(s,pi)=>`url('${assetUrl(scEpKey(s,pi||0,'jpg'))}')`;
// короткий тег фильма — для поиска («волк», «психопат», «clavicular»…)
const FTAG={'Волк с Уолл-стрит':'волк','Клан Сопрано':'сопрано','Американский психопат':'психопат','Таксист':'таксист','Бункер':'бункер','Титаник':'титаник',
  'Во все тяжкие':'вовсетяжкие','Павел Дуров':'дуров','Clavicular':'clavicular','The Wolf of Wall Street':'wolf','Die Sopranos':'sopranos','Breaking Bad':'breakingbad','Titanic':'titanic'};
const ftag=film=>'#'+(FTAG[film]||String(film||'').toLowerCase().replace(/[^a-zа-яёäöüß0-9]+/g,''));
// тема слова — от фразы эпизода, в чей момент оно прозвучало; иначе «разное». Своё слово — по своему #тегу
const wTopic=x=>{if(x.own){const t=(x.tags||[])[0];return t?(TOPIC_ICO[t]?t:'#'+t):'добавлено мной';}   // свой тег «работа» = тема «Работа»
  const s=scOf(x.sid),p=s&&s.parts[x.pi];if(!p||!x.a)return 'разное';
  const f=p.ph.find(f=>x.a>=f.a-0.4&&x.a<=f.b+0.4);return f?fTopics(f)[0]:'разное';};
// темы: фраза — во всех своих темах (так «💰 Деньги» покажет всё про деньги), слово — в одной; «разное» и свои — в конце
const itTopics=(x,W)=>W?[wTopic(x)]:fTopics(x.f);
const tpHit=(W,tp)=>tp?x=>itTopics(x,W).includes(tp):null;
const tpTail=k=>k==='разное'||k==='добавлено мной'||k[0]==='#';
const tpName=k=>k[0]==='#'?k:cap(k),tpIco=k=>TOPIC_ICO[k]||(k[0]==='#'?'🏷':k==='добавлено мной'?'✍️':k==='разное'?'🗂':'💬');
function myTopics(kind){const W=kind==='w',m={},o=[];
  (W?mywAll():myPh()).forEach(x=>itTopics(x,W).forEach(k=>{if(!m[k]){m[k]=[];o.push(k);}m[k].push(x);}));
  return o.sort((a,b)=>tpTail(a)-tpTail(b)||m[b].length-m[a].length).map(k=>({k,n:tpName(k),ico:tpIco(k),L:m[k].sort(W?ordW:ordPh)}));}
// фильмы: где собирал последним — выше, свои слова — в конце; hit — фильтр (тема)
function myFilms(kind,hit){const W=kind==='w',m={},o=[];
  (W?mywAll():myPh()).forEach(x=>{if(hit&&!hit(x))return;const k=itFilm(x,W);
    if(!m[k]){const s=itS(x,W);m[k]={k,kind:kindOf(s),s0:s?dictScenes().find(z=>dictFilm(z)===k)||s:null,L:[]};o.push(m[k]);}m[k].L.push(x);});
  o.forEach(g=>{g.L.sort(W?ordW:ordPh);g.at=g.L.reduce((a,x)=>Math.max(a,atOf(x,W)),0);g.lrn=g.L.filter(x=>isLrn(x,W)).length;g.due=g.L.filter(x=>isDue(x,W)).length;});
  return o.sort((a,b)=>(a.kind==='own')-(b.kind==='own')||b.at-a.at||scIx(a.s0)-scIx(b.s0));}
// внутри группы: в фильме — по эпизодам («Эпизод 2 · Название»; сцен несколько — «Визитки · эп. 2»), в теме и в поиске — по фильмам,
// у своих слов — по #тегу. Листание в окне идёт по порядку на экране
const scNo=s=>dictScenes().filter(z=>dictFilm(z)===dictFilm(s)).indexOf(s)+1;   // номер сцены в фильме
function mySubs(W,L,by){const m={},o=[],multi=by==='film'&&new Set(L.map(x=>{const s=itS(x,W);return s?s.id:'';})).size>1,sd={};
  L.forEach(x=>{const s=itS(x,W);let k,em,h='',scn=null;
    if(by!=='film'){k=s?dictFilm(s):OWN;em=s?dictFilm(s):'Добавлено мной';}
    else if(!s){const t=(x.tags||[])[0]||'';k='#'+t;em=t?'#'+t:'без тега';}
    else{const pi=x.pi||0,p=s.parts[pi];k=s.id+'|'+pi;em=`Эпизод ${pi+1}`;h=p?p.t:'';if(multi&&!sd[s.id]){sd[s.id]=1;scn={i:scNo(s),t:s.sub||s.title};}}
    if(!m[k]){m[k]={k,em,h,scn,L:[]};o.push(m[k]);}m[k].L.push(x);});
  return o;}
// строки: фраза — как в Кинотеке (фраза, перевод, точка «пора повторить»); слово — ещё и статус словами
const wRow=x=>{const st=!x.ru?'':mywLearned(x)?'<em class="kw-st ok">выучено</em>':wDue(x)?'<em class="kw-st due">сегодня</em>':x.due?`<em class="kw-st">${E(mywWhen(x.due))}</em>`:'';
  return `<button class="kq kq2 kqw" data-own data-w="${E(x.k)}">${typeof lvTag==='function'?lvTag(x.w,(scOf(x.sid)||{}).lang==='de'?'de':'en'):''}<span class="kq-x"><b class="kq-en">${E(x.w)}</b><span class="kq-ru">${x.ru?E(x.ru):'<i>без перевода</i>'}</span></span>${st}</button>`;};
const myRows=(kind,L)=>`<div class="kq-l">${L.map(kind==='w'?wRow:knRow).join('')}</div>`;
const scnHTML=(i,t,cls)=>`<h4 class="km6-scn${cls?' '+cls:''}"><em>Сцена ${i}</em><span>${E(t)}</span></h4>`;
const subHTML=(W,G)=>G.map(g=>`${g.scn?scnHTML(g.scn.i,g.scn.t):''}${G.length===1&&g.k==='#'?'':`<h4 class="km6-sub"><em>${E(g.em)}</em>${g.h?`<span>${E(g.h)}</span>`:''}</h4>`}${myRows(W?'w':'ph',g.L)}`).join('');
let SEC={};   // списки разделов текущего экрана: id → {n,L,w} — для «Тренировать», «▶ подряд», листания в окне
const sec=(id,n,L,W)=>{SEC[id]={n,L,w:!!W};return id;};
const trN=(W,L)=>W?Math.min(8,L.filter(x=>x.ru).length):Math.min(10,L.length);
const canPl=(W,L)=>W?L.some(x=>!x.own):L.length>0;
const myActs=(W,id,L)=>{const n=trN(W,L),pl=canPl(W,L);return n||pl?`<div class="km5-ta km6-ta">${n?`<button class="km5-tr" data-mtr="${id}">Тренировать <small>${n}</small></button>`:''}${pl?`<button class="km5-pl" data-mpl="${id}">${SI.play} подряд</button>`:''}</div>`:'';};
const dueEm=n=>n?` · <i class="km6-due">${n} повторить</i>`:'';
const OWNBG='radial-gradient(circle at 28% 22%,#5a4a32,#1a1612 55%,#0b0b0d)';
// сверху (оба вида): итог одной строкой и «Повторить сегодня»
function myHeadHTML(kind){const W=kind==='w',L=W?mywAll():myPh(),due=L.filter(x=>isDue(x,W)),lrn=L.filter(x=>isLrn(x,W)).length;sec('due','Повторить сегодня',due,W);
  return `<p class="km6-sum">${W?nWd(L.length):nPh(L.length)} · ${lrn} выучено</p>${due.length?`<button class="kmb-due km-in" data-mtr="due"><span><b>Повторить сегодня</b><small>${W?nWd(due.length):nPh(due.length)} ${plural(due.length,['ждёт','ждут','ждут'])} тебя</small></span><i>Начать ${ui('fwd')}</i></button>`:''}`;}
// вид А: карточка — разметка эпизода Кинотеки (кадр с ▶ «подряд», метка, название, полоска выученного, число, ›)
function myCardHTML(W,o){const G=mySubs(W,o.L,o.by),L=G.flatMap(g=>g.L),n=L.length,lrn=L.filter(x=>isLrn(x,W)).length,due=L.filter(x=>isDue(x,W)).length,op=!!KN.my.open[o.key];
  sec(o.id,o.n,L,W);
  return `<details class="kn-ep km6-c km-in" data-mo="${E(o.key)}" data-sec="${o.id}"${o.c?` style="--c:${o.c}"`:''}${op?' open':''}><summary>
    <span class="kn-et${o.img?'':' km6-ic'}"${o.img?` style="background-image:${o.img}"`:''}>${o.img?(canPl(W,L)?`<button class="kn-ew" data-mpl="${o.id}" aria-label="Смотреть подряд">${SI.play}</button>`:''):`<i>${o.ico}</i>`}</span>
    <span class="kn-ex"><em>${E(o.lbl)}${dueEm(due)}</em><b>${o.img&&o.ico?o.ico+' ':''}${E(o.n)}</b>${bar(lrn,n)}</span>
    <span class="kn-en"><b>${n}</b></span><i class="kn-chev">${ui('fwd')}</i></summary>
    <div class="km6-in">${myActs(W,o.id,L)}${subHTML(W,G)}</div></details>`;}
function myCardsHTML(kind){const W=kind==='w',by=myBy(),used=new Set();
  const G=by==='film'?myFilms(kind).map((g,i)=>{const own=g.k===OWN;return {key:`c|${kind}|f|${g.k}`,id:'c'+i,by:'film',L:g.L,n:own?'Добавлено мной':g.k,lbl:own?'Свои слова':KS[g.kind]||'',img:g.s0?D.cover(g.s0):'',ico:own?'✍️':'',c:g.s0?th(g.s0):''};})
    :myTopics(kind).map((g,i)=>{const C=g.L.filter(x=>itS(x,W)).sort((a,b)=>atOf(b,W)-atOf(a,W)),ek=x=>itS(x,W).id+'|'+(x.pi||0),x=C.find(y=>!used.has(ek(y)))||C[0],s=x&&itS(x,W);if(x)used.add(ek(x));
      return {key:`c|${kind}|t|${g.k}`,id:'c'+i,by:'topic',L:g.L,n:g.n,lbl:'Тема',img:s?epImg(s,x.pi):'',ico:g.ico};});
  return `${myHeadHTML(kind)}<div class="km6-by" role="tablist"><button data-mby="film" class="${by==='film'?'on':''}">По фильмам</button><button data-mby="topic" class="${by==='topic'?'on':''}">По темам</button></div>
    <div class="km6-cl">${G.map(o=>myCardHTML(W,o)).join('')}</div>`;}
// вид Б: чипы тем, постеры своих фильмов по разделам; тап — страница фильма
function myPostersHTML(kind){const W=kind==='w',T=myTopics(kind);if(KN.my.tp&&!T.some(g=>g.k===KN.my.tp))KN.my.tp='';
  const F=myFilms(kind,tpHit(W,KN.my.tp));
  const P=g=>{const n=g.L.length,own=g.k===OWN;return `<button class="kn-p km6-p dlt${own?' km6-own':''}" data-mf="${E(g.k)}"${g.s0?` style="--c:${th(g.s0)}"`:''}><span class="kn-pi"${own?'':` style="background-image:${knPoster(g.s0)}"`}>${own?'<i class="km6-oi">✍️</i>':''}${g.due?'<i class="km6-pd" title="Есть что повторить"></i>':''}<i class="kn-gl"></i></span><b>${own?'Добавлено мной':E(g.k)}</b><small>${W?nWd(n):nPh(n)}</small>${bar(g.lrn,n)}</button>`;};
  const S2=[['film','Фильмы'],['series','Сериалы'],['interview','Интервью'],['own','Свои слова']].map(([k,t])=>({t,L:F.filter(g=>g.kind===k)})).filter(x=>x.L.length);
  const chips=T.length>1?`<div class="km6-tps">${[['','Все',''],...T.map(g=>[g.k,`${g.ico} ${E(g.n)}`,g.L.length])].map(([k,t,n])=>`<button data-mch="${E(k)}" class="${KN.my.tp===k?'on':''}">${t}${n!==''?` <i>${n}</i>`:''}</button>`).join('')}</div>`:'';
  return `${myHeadHTML(kind)}${chips}${S2.map(x=>`<h3 class="kn-h">${x.t}<small>${x.L.length}</small></h3><div class="km6-g">${x.L.map(P).join('')}</div>`).join('')}`;}
// вид Б, страница фильма — как сцена Кинотеки: шапка (кадр с ▶, «N фраз · выучено», «Тренировать»), ниже эпизоды-раскрывашки, только своё
function myFilmHTML(kind,film){const W=kind==='w',tp=KN.my.tp,g=myFilms(kind,tpHit(W,tp)).find(x=>x.k===film);if(!g)return null;
  const own=film===OWN,name=own?'Добавлено мной':film,s0=g.s0,last=lastIt(g.L,W),sL=last&&itS(last,W);
  const EP=[],m={};g.L.forEach(x=>{const s=itS(x,W),k=s?s.id+'|'+(x.pi||0):'#'+((x.tags||[])[0]||'');if(!m[k]){m[k]={k,s,pi:x.pi||0,L:[]};EP.push(m[k]);}m[k].L.push(x);});
  const L=EP.flatMap(e=>e.L),one=EP.length===1,multi=new Set(EP.map(e=>e.s?e.s.id:'')).size>1;sec('f',name,L,W);
  let lastS=null;
  const eps=EP.map((e,i)=>{const id=sec('e'+i,name,e.L,W),n=e.L.length,lrn=e.L.filter(x=>isLrn(x,W)).length,due=e.L.filter(x=>isDue(x,W)).length,key=`b|${kind}|${e.k}`,op=KN.my.open[key]!=null?KN.my.open[key]:one,p=e.s&&e.s.parts[e.pi];
    let h='';if(multi&&e.s&&e.s!==lastS){lastS=e.s;h=scnHTML(scNo(e.s),e.s.sub||e.s.title,'big');}
    return h+`<details class="kn-ep km6-e km-in" data-mo="${E(key)}"${op?' open':''}><summary><span class="kn-et${e.s?'':' km6-ic'}"${e.s?` style="background-image:${epImg(e.s,e.pi)}"`:''}>${e.s?`<button class="kn-ew" data-mpl="${id}" aria-label="Смотреть подряд">${SI.play}</button>`:'<i>🏷</i>'}</span>
      <span class="kn-ex"><em>${e.s?'Эпизод '+(e.pi+1):'Свои слова'}${dueEm(due)}</em><b>${E(e.s?(p?p.t:''):(e.k==='#'?'без тега':e.k))}</b>${bar(lrn,n)}</span><span class="kn-en"><b>${n}</b></span><i class="kn-chev">${ui('fwd')}</i></summary>${myRows(kind,e.L)}</details>`;}).join('');
  return `<div class="dl-crumb km6-cr"><button class="dl-up" data-mup aria-label="Назад">${ui('back')}</button><span><em>Мои ${W?'слова':'фразы'}</em><b>${E(name)}</b></span></div>
    <div class="kn-sh km6-sh km-in" style="--c:${s0?th(s0):'#F3EBDD'};--bg:${sL?D.cover(sL):OWNBG}"><span class="kn-hbg"></span>
      ${sL?`<button class="kn-hp wide kn-hw" data-mpl="f" style="background-image:${D.cover(sL)}" aria-label="Смотреть подряд"><i>${SI.play}</i></button>`:'<span class="kn-hp wide km6-ic"><i>✍️</i></span>'}
      <span class="kn-ht"><em>${E(own?'Свои слова':KS[g.kind]||'')}</em><b class="kn-hn">${E(name)}</b><small>${W?nWd(L.length):nPh(L.length)} · ${g.lrn} выучено${g.due?` · ${g.due} повторить`:''}</small>${bar(g.lrn,L.length)}
        ${tp?`<button class="km6-tpx" data-mch="">${tpIco(tp)} ${E(tpName(tp))} <i>${ui('close')}</i></button>`:''}${myActs(W,'f',L)}</span></div>
    ${multi?'':`<h3 class="kn-h kn-h2">${own?'По тегам':'Эпизоды'}<small>нажми, чтобы увидеть ${W?'слова':'фразы'}</small></h3>`}
    <div data-sec="f">${eps}</div>`;}
// поиск — сразу по фразам и словам: текст, перевод, фильм, темы, «когда пригодится», #теги
const lo=t=>String(t||'').toLowerCase().replace(/ё/g,'е');
const phTxt=c=>{const f=c.f,film=dictFilm(c.s);return lo([D.T(f),f.en,f.de,f.ru,f.use,film,ftag(film),fTopics(f).join(' '),(f.kw||[]).map(k=>(k||[]).slice(0,3).join(' ')).join(' ')].join(' '));};
const wTxt=x=>{const film=wFilm(x);return lo([x.w,x.ru,(x.tags||[]).map(t=>'#'+t).join(' '),film,film&&ftag(film),x.line,x.lineRu,wTopic(x)].join(' '));};
function mySearch(kind){const q=lo(KN.my.q).trim(),P=myPh().filter(c=>phTxt(c).includes(q)).sort(ordPh),Wd=mywAll().filter(x=>wTxt(x).includes(q)).sort(ordW);
  if(!P.length&&!Wd.length&&!lnFind(KN.my.q,true).length)return `<div class="kn-empty">Ничего не нашлось<small>Ищу по фразам и словам, переводу, фильму и теме, а ещё по репликам просмотренных эпизодов — попробуй по-другому.</small></div>`;
  const part=(W,L0,id)=>{if(!L0.length)return '';const G=mySubs(W,L0,'topic'),L=G.flatMap(g=>g.L);sec(id,'Поиск',L,W);
    return `<section class="km6-sr" data-sec="${id}"><h3 class="km5-h">${W?'Слова':'Фразы'}<small>${L.length}</small></h3>${G.map(g=>`<h4 class="km6-sub"><em>${E(g.em)}</em></h4>${myRows(W?'w':'ph',g.L)}`).join('')}</section>`;};
  const a=part(false,P,'qp'),b=part(true,Wd,'qw'),ln=lnResHTML(lnFind(KN.my.q,true),40);return (kind==='w'?b+a:a+b)+ln;}
// слово → «карта» для открытого окна: момент — реплика, где оно прозвучало
function wCard(x){const s=!x.own&&scOf(x.sid)||null,p=s&&s.parts[x.pi]||null,r=s&&x.a?(s.subs||[]).find(z=>Math.abs(z[0]-x.a)<0.06):null,de=s&&s.lang==='de';
  const line=r?(de?(r[4]||r[2]):r[2]):x.line,lineRu=r?r[3]:x.lineRu;
  return {w:x,k:'w|'+x.k,sel:`[data-w="${CSS.escape(x.k)}"]`,got:true,s,p,pi:x.pi||0,rar:1,m:Math.min(3,x.st||0),line,lineRu,
    f:s&&p&&x.a?{id:'w|'+x.k,en:line||'',de:line||'',ru:lineRu||'',a:r?r[0]:x.a,b:r?r[1]:x.a+4}:null};}
function myPlay(b,t){const L=t.w?t.L.filter(x=>!x.own).map(wCard):t.L.slice();if(!L.length)return;sfx('tap');haptic('light');knOpen(b,L[0],{L,auto:true,title:t.n});}
function myTrain(t){if(t.w){renderMyWordsQuiz(t.L.filter(x=>x.ru),()=>renderTab('dict'));return;}
  const L=shuffle(t.L.slice()).slice(0,10).map(c=>{const r=scP(c.s.id).r[c.f.id];return {k:'ph',s:c.s,f:c.f,due:r?r[1]:0};});
  renderDaily(L,{train:true,nosrs:D.demo(),title:'Тренировка · '+t.n,back:()=>renderTab('dict')});}
function myAdd(){sfx('tap');const tags=[...new Set(mywAll().flatMap(x=>x.tags||[]))];
  const w=knSheet(`<b class="kn-sh2">Своё слово</b><p class="kn-sm">Слово или фраза, которую хочешь выучить. Придёт в повторение вместе с остальными.</p>
    <form class="km-form" autocomplete="off"><input name="w" placeholder="Слово или фраза (англ.)" required maxlength="60"><input name="ru" placeholder="Перевод" maxlength="80">
      <input name="tag" placeholder="#тег — например, работа" maxlength="24" list="kmTagL"><datalist id="kmTagL">${tags.map(t=>`<option value="${E(t)}">`).join('')}</datalist>
      <button class="kn-btn" type="submit">＋ В мои слова</button></form><button class="kn-btn2" data-x>Отмена</button>`);
  const F=w.querySelector('form');setTimeout(()=>{try{F.w.focus();}catch(e){}},300);
  F.onsubmit=e=>{e.preventDefault();const v=F.w.value.trim(),ru=F.ru.value.trim(),tg=F.tag.value.trim().replace(/^#/,'').toLowerCase();if(!v)return;
    store.myw=store.myw||{};if(typeof premNeed==='function'&&typeof premAsk==='function'&&premNeed('myw')&&Object.keys(store.myw).length>=(typeof MYW_FREE==='number'?MYW_FREE:50)){w._close();premAsk('myw');return;}   // 13.9.31: typeof — app.js может быть старее   // 13.9.30
    const k=mywKey('own',v.toLowerCase());store.myw[k]={k,w:v,ru,de:'',sid:'own',pi:0,line:'',lineRu:'',a:0,at:Date.now(),lvl:0,st:0,due:Date.now()+36e5,own:true,tags:tg?[tg]:[]};
    save();sfx('good');haptic('ok');toast('⭐ Добавил в «Мои слова»');w._close();store.knMyKind='w';KN.my.q='';DL.render(0);};}
const IV={cards:'<svg viewBox="0 0 24 24"><rect x="3.5" y="4" width="17" height="6.5" rx="2"/><rect x="3.5" y="13.5" width="17" height="6.5" rx="2"/></svg>',
  posters:'<svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="7" height="10" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="10" rx="1.6"/><path d="M3.5 17.5h7M13.5 17.5h7M3.5 20.5h4.5M13.5 20.5h4.5"/></svg>'};
function myHTML(){const kind=myKind(),W=kind==='w',nP=myPh().length,nW=mywAll().length,v=myV();
  return `${seg()}<div class="km-top2"><div class="km-sw" role="tablist"><button data-mk="ph" class="${W?'':'on'}">Фразы <i>${nP}</i></button><button data-mk="w" class="${W?'on':''}">Слова <i>${nW}</i></button></div>
      <span class="km6-vw" role="tablist" aria-label="Вид">${[['cards','Карточки'],['posters','Постеры']].map(([k,t])=>`<button data-mv="${k}" class="${v===k?'on':''}" aria-label="${t}" title="${t}">${IV[k]}</button>`).join('')}</span></div>
    ${nP||nW?`<label class="km-q km6-q">${IC.q}<input id="kmQ" type="search" placeholder="Найти фразу или слово" value="${E(KN.my.q)}" autocomplete="off" enterkeyhint="search"><button type="button" class="km6-qx" data-mqx aria-label="Очистить"${KN.my.q?'':' hidden'}>${ui('close')}</button></label>`:''}
    <div id="kmBody" class="km-b km6 km6-${v}">${myBodyHTML(kind)}</div>${W?'<button class="km-fab" data-madd aria-label="Своё слово">＋</button>':''}`;}
function myBodyHTML(kind){SEC={};const W=kind==='w';if(KN.my.q.trim())return mySearch(kind);
  if(W?!mywAll().length:!myPh().length)return W?`<div class="km-empty"><b>Пока нет слов</b><span>Смотри эпизод и нажми на незнакомое слово в субтитрах → «☆ В мои слова». Или добавь своё — оно тоже придёт в повторение.</span><button class="kn-btn" data-madd>＋ Добавить своё слово</button></div>`
    :`<div class="km-empty"><b>Пока нет фраз</b><span>Фраза ложится сюда, когда ты верно ответил на неё в проверке после эпизода.</span><button class="kn-btn" data-mkino>Открыть Кинотеку</button></div>`;
  if(myV()==='posters'){if(KN.my.tag&&KN.my.tag.startsWith('f:')){const h=myFilmHTML(kind,KN.my.tag.slice(2));if(h)return h;KN.my.tag=null;}return myPostersHTML(kind);}
  KN.my.tag=null;return myCardsHTML(kind);}
// появление — каскадом: строки и карточки (.km-in) снизу, постеры — как на полках Кинотеки
function myIn(el){if(!fxOK())return;let i=0;el.querySelectorAll('.km-in').forEach(x=>{if(i<24)x.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'none'}],{duration:380,delay:i*32,easing:EZ.out,fill:'backwards'});i++;});
  el.querySelectorAll('.km6-g').forEach((g,gi)=>g.querySelectorAll('.km6-p').forEach((p,j)=>{if(j<12)p.animate([{opacity:0,transform:'perspective(800px) rotateY(-28deg) translateY(16px) scale(.92)'},{opacity:1,transform:'none'}],{duration:640,delay:120+gi*90+j*55,easing:SPRING,fill:'backwards'});}));}
function myBindBody(st){const kind=myKind(),bd=st.querySelector('#kmBody');if(!bd)return;
  const rer=()=>{bd.innerHTML=myBodyHTML(kind);myBindBody(st);};
  // один обработчик на всё тело (тело перерисовывается при поиске, «По фильмам / По темам», чипах — onclick не задваивается)
  bd.onclick=e=>{const t=e.target,secOf=el=>{const sc=el.closest('[data-sec]');return sc&&SEC[sc.dataset.sec]||null;};
    const pl=t.closest('[data-mpl]');if(pl){e.preventDefault();e.stopPropagation();const S0=SEC[pl.dataset.mpl];if(S0)myPlay(pl,S0);return;}   // ▶ на кадре — внутри summary: карточку не раскрывать
    const tr=t.closest('[data-mtr]');if(tr){e.preventDefault();const S0=SEC[tr.dataset.mtr];if(!S0||!S0.L.length)return;sfx('tap');haptic('medium');myTrain(S0);return;}
    const up=t.closest('[data-mup]');if(up){e.stopPropagation();sfx('tap');DL.back();return;}   // 13.9.4: «‹» — настоящая кнопка
    const mf=t.closest('[data-mf]');if(mf){sfx('tap');haptic('sel');KN.my.tag='f:'+mf.dataset.mf;DL.render(1);return;}
    const ch=t.closest('[data-mch]');if(ch){const v=ch.dataset.mch;if(KN.my.tp===v)return;sfx('tap');haptic('sel');KN.my.tp=v;rer();return;}
    const by=t.closest('[data-mby]');if(by){const v=by.dataset.mby;if(myBy()===v)return;sfx('tap');haptic('sel');store.knMyBy=v;save();rer();return;}
    if(t.closest('[data-mkino]')){sfx('tap');haptic('sel');DX.seg='ph';KN.my.tag=null;S.flt=false;S.show=null;S.sid=null;DL.render(-1);return;}
    if(t.closest('[data-madd]')){myAdd();return;}
    const q=t.closest('.kq[data-c]');if(q){const c=D.find(q.dataset.c),sc=secOf(q),L=(sc&&!sc.w?sc.L:[c]).filter(Boolean);if(!c)return;sfx('tap');haptic('light');knOpen(q,c,{L});return;}
    const w=t.closest('.kqw[data-w]');if(w){const sc=secOf(w),L=(sc&&sc.w?sc.L:[]).filter(x=>x&&x.k).map(wCard),c=L.find(x=>x.w.k===w.dataset.w)||(store.myw&&store.myw[w.dataset.w]?wCard(store.myw[w.dataset.w]):null);if(!c)return;sfx('tap');haptic('light');knOpen(w,c,{L:L.length?L:[c]});return;}};
  // раскрывашки: открытые помнятся на заход; первое «toggle» у открытых при отрисовке — не нажатие
  const ini=new Set(bd.querySelectorAll('details[data-mo][open]'));
  bd.querySelectorAll('details[data-mo]').forEach(d=>d.addEventListener('toggle',()=>{if(ini.has(d)){ini.delete(d);if(d.open)return;}
    KN.my.open[d.dataset.mo]=d.open;if(!d.open){sfx('tap');return;}sfx('page');haptic('sel');
    if(fxOK())d.querySelectorAll('.km6-ta,.km6-sub,.kq').forEach((x,i)=>{if(i<16)x.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:300,delay:i*24,easing:EZ.out,fill:'backwards'});});}));
  myIn(bd);}
function myBind(st){const kind=myKind();
  st.querySelectorAll('[data-mk]').forEach(b=>b.onclick=()=>{const k=b.dataset.mk;if(myKind()===k)return;sfx('tap');haptic('sel');store.knMyKind=k;KN.my.tag=null;KN.my.tp='';save();DL.render(k==='w'?1:-1);});
  st.querySelectorAll('[data-mv]').forEach(b=>b.onclick=()=>{const v=b.dataset.mv;if(myV()===v)return;sfx('tap');haptic('sel');store.knMyV=v;KN.my.tag=null;save();DL.render(0);});
  st.querySelectorAll('.km-fab').forEach(b=>b.onclick=myAdd);
  const q=st.querySelector('#kmQ'),qx=st.querySelector('[data-mqx]');
  if(q){let tm=0;const upd=()=>{KN.my.q=q.value;if(qx)qx.hidden=!q.value;const bd=st.querySelector('#kmBody');if(bd){bd.innerHTML=myBodyHTML(kind);myBindBody(st);}DL.bb();};
    q.oninput=()=>{clearTimeout(tm);tm=setTimeout(upd,200);};q.onkeydown=e=>{if(e.key==='Enter')q.blur();};
    if(qx)qx.onclick=e=>{e.preventDefault();e.stopPropagation();sfx('tap');clearTimeout(tm);q.value='';upd();};}
  myBindBody(st);}
KN.stop=()=>{};   // 13.9.5: звука вне окна фразы в «Мои» больше нет (плеер «Альбомов» убран)
D.onStop=KN.stop;

D.reg({id:'kino',n:'Новый словарь',from:'Кинотека + «Мои фразы и слова»',ic:'🎞',sw:'linear-gradient(160deg,#2b2d33,#0b0b0d)',noAnim:true,my:true,flt:true,skip1:false,
  d:'«Кинотека» — фильмы и сколько фраз собрано; нажал на «Фильмы / Сериалы / Интервью» — раздел на весь экран, листаешь вбок; фильм → сцены строками → эпизод раскрывается → фразы строками; нажал на фразу — открывается красиво: момент крупно, фраза субтитром в такт речи. «Мои фразы и слова» — «Фразы / Слова», поиск сразу по фразам и словам, «Повторить сегодня»; два вида на пробу (☰ / ▦ справа сверху): карточки как эпизоды (по фильмам или по темам, раскрыл — фразы по эпизодам и «Тренировать») или постеры своих фильмов (тап — страница фильма с эпизодами).',
  bg:`<div class="kn-bg" id="knBg"></div>`,titleHTML:`<h1>Словарь <button class="kn-help" data-help aria-label="Как устроен словарь">?</button></h1>`,sub:'Фразы из фильмов',
  home(F){if(!F.length)return seg();let h=F[0],best=0;F.forEach(sh=>{const t=Math.max(0,...sh.L.map(lastGot));if(t>best){best=t;h=sh;}});
    const s0=h.L.slice().sort((a,b)=>lastGot(b)-lastGot(a))[0]||h.s0,bd=knBd(h.s0);
    return `${seg()}${srch()}
      <button class="kn-hero${bd?' bd':''}" data-show="${E(h.k)}" style="--c:${th(s0)};--bg:${bd||D.cover(s0)}"><span class="kn-hbg"></span><span class="kn-hp" style="background-image:${knPoster(h.s0)}"></span><span class="kn-ht"><em>${best?'Продолжить':D.kindName(h.kind)}</em><b>${E(h.k)}</b><small>Собрано <b class="kn-cnt" data-n="${h.g}">${h.g}</b> из ${h.t} ${plural(h.t,['фразы','фраз','фраз'])} · ${D.sc(h.L.length)}</small>${bar(h.g,h.t)}<span class="kn-go">Открыть →</span></span><i class="kn-shine"></i></button>
      ${D.groups(F).map(g=>`<h3 class="kn-h"><button class="kn-hb" data-kfs="${g.k}">${D.kindName(g.k)}<small>${g.L.length}</small><i class="kn-hbi">${ui('fwd')}</i></button></h3><div class="kn-row">${g.L.map(sh=>`<button class="kn-p dlt" data-show="${E(sh.k)}" style="--c:${th(sh.s0)}"><span class="kn-pi" style="background-image:${knPoster(sh.s0)}">${sh.full?'<i class="kn-done">✓</i>':''}<i class="kn-gl"></i></span><b>${E(sh.k)}</b><small>${sh.g} / ${sh.t}</small>${bar(sh.g,sh.t)}</button>`).join('')}</div>`).join('')}`;},
  // 13.8.7 (Андрей: «страница фильма чуть перегружена; в старом словаре разбивка лучше — нажал, чтобы увидеть»): шапка + сцены строками.
  // Убраны: цитата, «Все фразы», «Сложность / Польза», ряды кино-карт («квадраты»).
  film(sh){const s0=sh.s0,L=sh.L,bd=knBd(s0),meta=sh.kind==='film'&&s0.ep?E(s0.ep):D.kindName(sh.kind);
    const next=L.find(s=>{const P=scP(s.id);return P.done.length<s.parts.length;})||L[0];
    return `${D.crumb(D.kindName(sh.kind),sh.k)}
      <section class="kf kf2${bd?' bd':''}" style="--c:${th(s0)};--bg:${bd||D.cover(s0)}"><span class="kf-bd"></span><span class="kf-gr"></span>
        <div class="kf-in"><span class="kf-p" data-watch="${next.id}" role="button" aria-label="Смотреть" style="background-image:${knPoster(s0)}"></span><div class="kf-t"><em>${meta}</em><h2 data-watch="${next.id}">${E(sh.k).split(' ').map((w,i)=>`<span style="--i:${i}">${w}</span>`).join(' ')}</h2>
          <small class="kf-n">Собрано <b class="kn-cnt" data-n="${sh.g}">${sh.g}</b> из ${sh.t} ${plural(sh.t,['фразы','фраз','фраз'])}</small>${bar(sh.g,sh.t)}
          <div class="kf-b"><button class="kf-go" data-watch="${next.id}">${SI.play} ${sh.g?'Смотреть дальше':'Смотреть'}</button></div></div></div></section>
      <h3 class="kn-h kn-h2">${L.length>1?'Сцены':'Сцена'}<small>${L.length}</small></h3>
      <div class="kf-scl">${L.map((s,n)=>{const [g,t]=D.cnt([s]);return `<button class="kf-sr" data-sid="${s.id}" style="--c:${th(s)};--bg:${D.cover(s)}"><span class="kf-srbg"></span><span class="kf-srt"><em>${L.length>1?`Сцена ${n+1} · `:''}${D.ep(s.parts.length)}</em><b>${E(s.sub||s.title)}</b></span><span class="kf-srn"><span><b>${g}</b>/${t}</span>${bar(g,t)}</span><i class="kn-chev">${ui('fwd')}</i></button>`;}).join('')}</div>`;},
  // 13.8.7: в сцене эпизоды свёрнуты — нажал на эпизод, раскрылись фразы строками (без «квадратов»); один эпизод — сразу открыт
  scene(s,sh){const [g,t]=D.cnt([s]),L=sh?sh.L:[s],n=L.indexOf(s),P=scP(s.id),nx=s.parts.findIndex((p,i)=>!P.done.includes(i));
    return `${D.crumb(dictFilm(s),s.sub||s.title)}
      <div class="kn-sh" style="--c:${th(s)};--bg:${D.cover(s)}"><span class="kn-hbg"></span><button class="kn-hp wide kn-hw" data-watch="${s.id}" style="background-image:${D.cover(s)}" aria-label="Смотреть сцену"><i>${SI.play}</i></button>
        <span class="kn-ht"><button class="kn-hf" data-show="${E(dictFilm(s))}">${E(dictFilm(s))}${L.length>1?` · сцена ${n+1} из ${L.length}`:''} ${ui('fwd')}</button><b class="kn-hn" data-watch="${s.id}">${E(s.sub||s.title)}</b><small>Собрано ${g} из ${t} ${plural(t,['фразы','фраз','фраз'])}</small>${bar(g,t)}
          <button class="kf-go kn-shw" ${nx<0?`data-watch="${s.id}">${SI.play} Смотреть сцену`:`data-wep="${s.id}|${nx}">${SI.play} ${nx===0&&!P.w[0]?'Смотреть':`Смотреть дальше · эпизод ${nx+1}`}`}</button></span></div>
      <div class="kn-lt"><h3 class="kn-h kn-h2">Эпизоды</h3><div class="kn-ltg" role="tablist" aria-label="Что показать"><button data-klt="ph" class="${LT()==='ph'?'on':''}">Фразы</button><button data-klt="all" class="${LT()==='all'?'on':''}">Все реплики</button></div></div>
      ${D.eps(s).map(e=>{const h=e.c.filter(c=>c.got).length,k=s.id+'|'+e.pi,op=DXOPEN[k]!=null?DXOPEN[k]:s.parts.length===1;
        return `<details class="kn-ep" data-k="${k}"${op?' open':''}><summary><span class="kn-et" style="background-image:url('${assetUrl(scEpKey(s,e.pi,'jpg'))}')"><button class="kn-ew" data-wep="${k}" aria-label="Смотреть эпизод ${e.pi+1}">${SI.play}</button></span><span class="kn-ex"><em>Эпизод ${e.pi+1}</em><b>${E(e.p.t)}</b>${bar(h,e.c.length)}</span><span class="kn-en">${LT()==='all'?`<b>${epRows(s,e.p).length}</b> ${plural(epRows(s,e.p).length,['реплика','реплики','реплик'])}`:`<b>${h}</b>/${e.c.length}`}</span><i class="kn-chev">${ui('fwd')}</i></summary>${LT()==='all'?linesL(s,e.pi):rowsL(e.c)}</details>`;}).join('')}
      ${L.length>1?`<div class="kn-nav">${n?`<button data-sid="${L[n-1].id}">${ui('back')}<span><em>Сцена ${n}</em><b>${E(L[n-1].sub||L[n-1].title)}</b></span></button>`:'<i></i>'}${n<L.length-1?`<button class="nx" data-sid="${L[n+1].id}"><span><em>Сцена ${n+2}</em><b>${E(L[n+1].sub||L[n+1].title)}</b></span>${ui('fwd')}</button>`:'<i></i>'}</div>`:''}`;},
  flt(F){
    return `${D.crumb('Словарь','Поиск и фильтры')}<label class="kn-fq">${IC.q}<input id="knQ" type="search" placeholder="Фраза, слово или перевод" value="${E(KN.q)}" autocomplete="off" enterkeyhint="search"></label>
      <div class="kn-dd">${DD.map(([k,l,all])=>{const o=ddOpts(k,F).find(x=>x[0]===KN[k]);return `<button class="kn-ddb${KN[k]?' on':''}" data-dd="${k}">${o?`<b>${k==='tp'?`${TOPIC_ICO[o[0]]||''} ${E(cap(o[0]))}`:o[1]}</b>`:`<span>${l}</span>`}<i>▾</i></button>`;}).join('')}</div>
      <div id="knRes">${knRes()}</div>`;},
  my(){return myHTML();},
  myBack(){if(KN.my.tag){KN.my.tag=null;DL.render(-1);return true;}if(KN.my.q){KN.my.q='';DL.render(0);return true;}return false;},   // страница фильма (вид Б) → сетка; потом — очистить поиск
  myDeep(){return !!KN.my.tag;},
  trans(st,dir,go){const was=st.dataset.lvl;
    // назад из фильма: шапка «садится» обратно в постер на полке
    if(dir<0&&was==='film'){const p=st.querySelector('.kf-p'),k=S._fk;const r=p&&p.getBoundingClientRect(),bg=p&&p.style.backgroundImage;go();
      if(r&&r.width&&k){const t=[...st.querySelectorAll('.kn-p[data-show]')].find(x=>x.dataset.show===k);const ti=t&&t.querySelector('.kn-pi');if(ti){DL.hcenter(t);knFly(r,ti,bg,{d:520});}}return;}
    go();},
  after(st,lvl){const root=DL.root,bg=$('#knBg'),hero=st.querySelector('.kn-hero'),fk=S.show||(hero&&hero.dataset.show),sh=fk?DL.films().find(x=>x.k===fk):null,s0=S.sid?scOf(S.sid):sh?sh.s0:null;
    if(bg)bg.style.setProperty('--bg',s0?D.cover(s0):'none');
    const hp=root.querySelector('[data-help]');if(hp)hp.onclick=e=>{e.stopPropagation();knHelp();};
    // 13.8.6: шапка — «Словарь», под ним «Собрано N из M фраз», справа — язык фильмов тихой кнопкой (вместо флажков)
    {const [g,t]=D.cnt(dxScenes()),cn=$('#dlCnt'),sb=root.querySelector('.dl-ttl small');
      if(sb)sb.textContent=`Собрано ${g} из ${t} ${plural(t,['фразы','фраз','фраз'])}`;
      if(cn){cn.innerHTML=`<button class="kn-lgb" data-lgdd aria-label="Язык фильмов">${DX.lang==='de'?'Deutsch':'English'} <i>▾</i></button>`;cn.querySelector('[data-lgdd]').onclick=knLgDD;}}
    const SO={kino:0,my:1};
    st.querySelectorAll('[data-kseg]').forEach(b=>b.onclick=()=>{const k=b.dataset.kseg,was=curSeg();if(was===k)return;sfx('tap');haptic('sel');
      DX.seg=k==='my'?'my':'ph';KN.my.tag=null;S.flt=false;S.show=null;S.sid=null;DL.render(SO[k]>SO[was]?1:-1);});
    st.querySelectorAll('[data-wep]').forEach(b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();const [sid,i]=b.dataset.wep.split('|'),s=scOf(sid),pi=+i;if(!s)return;sfx('tap');haptic('medium');
      if(!ADM_OPEN()&&!scEpOpen(s,pi)){haptic('err');toast(`Эпизоды по порядку — сначала эпизод ${pi}`);return;}if(scGate(sid,pi))return;renderScEp(sid,pi);});
    st.querySelectorAll('[data-flt]').forEach(b=>b.onclick=()=>{sfx('tap');haptic('sel');S.flt=true;const q=b.dataset.flt==='q';DL.render(1);if(q)setTimeout(()=>{const i=$('#knQ');if(i)i.focus();},60);});
    st.querySelectorAll('[data-ffilm]').forEach(b=>b.onclick=e=>{e.stopPropagation();sfx('tap');haptic('sel');Object.assign(KN,{q:'',tp:'',st:'',tone:'',film:b.dataset.ffilm});S.flt=true;DL.render(1);});
    st.querySelectorAll('[data-watch]').forEach(b=>b.onclick=e=>{e.stopPropagation();sfx('tap');haptic('medium');const id=b.dataset.watch;if(scGate(id))return;renderScene(id);});
    st.querySelectorAll('[data-kfs]').forEach(b=>b.onclick=()=>{sfx('tap');haptic('medium');knFull(b.dataset.kfs,b);});   // 13.9.1: раздел на весь экран
    knMotion(st,lvl);
    st.querySelectorAll('.kn-tps [data-tp]').forEach(b=>b.onclick=()=>{sfx('tap');haptic('sel');Object.assign(KN,{q:'',st:'',tone:'',film:''});KN.tp=b.dataset.tp;S.flt=true;DL.render(1);});
    st.querySelectorAll('[data-klt]').forEach(b=>b.onclick=()=>{if(LT()===b.dataset.klt)return;sfx('tap');haptic('sel');store.knLines=b.dataset.klt;save();const y=window.scrollY;DL.render(0);setTimeout(()=>window.scrollTo(0,y),30);});   // 13.9.16
    lnBind(st);
    st.querySelectorAll('.kn-ep[data-k]').forEach(d=>d.addEventListener('toggle',()=>{DXOPEN[d.dataset.k]=d.open;if(!d.open)return;sfx('page');
      if(fxOK())d.querySelectorAll('.kq,.kl-ln').forEach((c,i)=>c.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:340,delay:Math.min(i,12)*32,easing:EZ.out,fill:'backwards'}));}));
    if(lvl==='flt'){bindRes(st);st.querySelectorAll('[data-dd]').forEach(b=>b.onclick=()=>knDD(b.dataset.dd));
      const q=st.querySelector('#knQ');if(q){let t=0;q.oninput=()=>{clearTimeout(t);t=setTimeout(()=>{KN.q=q.value.trim();const r=st.querySelector('#knRes');if(r){r.innerHTML=knRes();bindRes(st);}},200);};
        q.onkeydown=e=>{if(e.key==='Enter')q.blur();};}}
    if(lvl==='my')myBind(st);else bindCards(st);}
});

})();
