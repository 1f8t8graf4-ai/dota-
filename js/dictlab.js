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
DL.clean=()=>{DL._t.forEach(clearTimeout);DL._t=[];try{DL.stopVids();}catch(e){}document.querySelectorAll('.dli,.dlp,.dlx,.kno,.kn-sheet').forEach(x=>x.remove());if(DL._v){try{DL._v.pause();}catch(e){}DL._v=null;}document.body.classList.remove('dx-open');};
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
  const go=()=>{DL.stopVids&&DL.stopVids(st);st.innerHTML=html;st.dataset.lvl=lvl;DL.bind(st,lvl);DL.bb();
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
    const tab=st.querySelector('.bk-tab.on');if(tab)DL.hcenter(tab);
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
    ps.forEach((p,i)=>p.onclick=()=>{if(i!==cur){DL.hcenter(p,true);return;}
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
    const fc=st.querySelector('.sn-fc.on');if(fc)DL.hcenter(fc);
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
  return `<button class="kq kq2 st-${k}" data-own data-c="${c.k}"><span class="kq-x"><b class="kq-en">${E(D.T(f))}</b><span class="kq-ru">${E(f.ru)}</span></span>${k==='due'?'<i class="kq-due" title="Пора повторить"></i>':''}</button>`;};
const rowsL=C=>`<div class="kq-l">${C.map(knRow).join('')}</div>`;   // фразы — всегда строками: «квадраты» (карточки) убраны в 13.8.7

/* ---------- шторка (подсказка, закрытая карта) ---------- */
function knSheet(html){document.querySelectorAll('.kn-sheet').forEach(x=>x.remove());const w=document.createElement('div');w.className='kn-sheet';
  w.innerHTML=`<div class="kn-sd"></div><div class="kn-sb" role="dialog">${html}</div>`;document.body.appendChild(w);
  if(fxOK()){w.querySelector('.kn-sd').animate([{opacity:0},{opacity:1}],{duration:220});w.querySelector('.kn-sb').animate([{transform:'translateY(40px)',opacity:0},{transform:'none',opacity:1}],{duration:380,easing:SPRING});}
  const close=w._close=()=>{if(w._c)return;w._c=1;const fin=()=>w.remove();if(!fxOK())return fin();w.querySelector('.kn-sd').animate([{opacity:1},{opacity:0}],{duration:200,fill:'forwards'});
    w.querySelector('.kn-sb').animate([{transform:'none',opacity:1},{transform:'translateY(30px)',opacity:0}],{duration:200,easing:EZ.in,fill:'forwards'}).onfinish=fin;};
  w.querySelector('.kn-sd').onclick=close;w.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>{sfx('tap');close();});return w;}
function knHelp(){sfx('tap');knSheet(`<b class="kn-sh2">Как устроен словарь</b>
  <p class="kn-sm"><b>«Кинотека»</b> — фильмы и сколько фраз из них ты собрал. Фильм → сцена → эпизод: нажми — увидишь фразы.</p>
  <p class="kn-sm"><b>«Мои фразы и слова»</b> — всё твоё: фразы, которые ты собрал (верно ответил в проверке после эпизода), и слова, которые сохранил сам. Подборки по темам и фильмам — внутри можно смотреть подряд и тренироваться.</p>
  <div class="kn-lg"><div><em class="kc-st st-new">Новая</em><p>Только что собрал. Ответь на неё верно в повторении три раза — и она выучена.</p></div>
    <div><em class="kc-st st-go">Учу · 1 из 3</em><p>Сколько раз ты уже ответил верно.</p></div>
    <div><em class="kc-st st-due">Повторить</em><p>В списке у такой фразы оранжевая точка — она ждёт в «Повторении» на Главной.</p></div>
    <div><em class="kc-st st-ok">✓ Выучено</em><p>Помнишь надолго. Иногда всплывёт в повторении, чтобы не забылось.</p></div>
    <div><em class="kc-st st-lock">Закрыта</em><p>Фраза из эпизода, который ты ещё не посмотрел, — в Кинотеке она под туманом.</p></div></div>
  <p class="kn-sm"><b>Нажми на фразу</b> — откроется момент из фильма, фраза загорается в такт речи, ниже — перевод и когда она пригодится. Листай вбок — следующая.</p>
  <p class="kn-sm"><b>Редкость</b> видно в открытой фразе по свечению вокруг момента: <i class="kn-rd r-rare"></i>синее — редкая (устойчивое выражение), <i class="kn-rd r-epic"></i>фиолетовое — эпическая (есть интересный факт), <i class="kn-rd r-leg"></i>золотое — легендарная.</p>
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
const kSt=(c,r)=>{const k=knSt(c)[0],nx=r&&r[1]&&r[1]>Date.now()?` Повторим ${inDays(r[1])}.`:'';
  return {new:'Новая фраза. Ответь на неё верно в повторении три раза — и она выучена.',go:`Учишь: ${c.m} из 3 верных ответов.${nx}`,due:'Пора повторить — фраза ждёт в «Повторении» на Главной.',ok:'Выучено. Иногда всплывёт в повторении, чтобы не забылось.'}[k]||'';};
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
const wStTxt=x=>mywLearned(x)?'Выучено. Иногда всплывёт в повторении, чтобы не забылось.':!x.due||x.due<=Date.now()?'Пора повторить — слово ждёт в «Повторении» на Главной.':`Учишь: ${Math.min(3,x.st||0)} из 3 верных ответов. Повторим ${mywWhen(x.due)}.`;
function knOpen(btn,c,o){o=o||{};DL.clean();
  const box=btn&&btn.closest('#knRes,.dl-stage')||document,L=[],AU=!!o.auto;
  if(o.L)L.push(...o.L);else{const seenK={};box.querySelectorAll('[data-c]').forEach(b=>{const x=D.find(b.dataset.c);if(x&&x.got&&!seenK[x.k]){seenK[x.k]=1;L.push(x);}});if(!seenK[c.k])L.unshift(c);}
  let ix=Math.max(0,L.findIndex(x=>x.k===c.k)),cur=null,v=null,raf=0,TT=[],SP=[],sub=null,hideT=0,autoT=0,held=false,dirty=false;
  const ov=document.createElement('div');ov.className='kno kno2'+(AU?' auto':'');
  ov.innerHTML=`<div class="kn2-bg"></div><div class="kno-dim"></div><div class="kn2" role="dialog" aria-label="${c.w?'Слово из фильма':'Фраза из фильма'}">${AU?`<div class="kn2-seg${L.length>30?' one':''}">${L.length>30?'<i><b></b></i>':L.map(()=>'<i><b></b></i>').join('')}</div>${o.title?`<span class="kn2-at">${E(o.title)}</span>`:''}`:''}<button class="kn2-x" aria-label="Закрыть">${ui('close')}</button><div class="kn2-in"></div></div>
    ${L.length>1?`<button class="kn2-nv pv" aria-label="Предыдущая">${ui('back')}</button><button class="kn2-nv nx" aria-label="Следующая">${ui('fwd')}</button>`:''}`;
  document.body.appendChild(ov);document.body.classList.add('dx-open');try{musDuck(true);}catch(e){}try{backBtn(true);}catch(e){}
  const card=ov.querySelector('.kn2'),inn=ov.querySelector('.kn2-in'),bgl=ov.querySelector('.kn2-bg'),segs=[...ov.querySelectorAll('.kn2-seg b')];
  const setSeg=k=>{if(!segs.length)return;if(segs.length===1){segs[0].style.transform=`scaleX(${((ix+k)/L.length).toFixed(4)})`;return;}segs.forEach((b,j)=>{b.style.transform=`scaleX(${j<ix?1:j>ix?0:k.toFixed(3)})`;});};
  const setBg=s=>{const u=s&&filmImg(s,innerWidth>=760?'bd.jpg':'bdm.jpg'),url=u?`url('${u}')`:s?D.cover(s):'radial-gradient(circle at 28% 22%,#5a4a32,#1a1612 55%,#0b0b0d)',old=bgl.lastElementChild;if(old&&old.dataset.u===url)return;
    const i=document.createElement('i');i.dataset.u=url;i.style.backgroundImage=url;bgl.appendChild(i);const rm=()=>[...bgl.children].forEach(x=>{if(x!==i)x.remove();});
    if(old&&fxOK())i.animate([{opacity:0},{opacity:1}],{duration:520,easing:'ease-out'}).onfinish=rm;else rm();};
  const mkV=()=>{if(!v){v=document.createElement('video');v.setAttribute('playsinline','');v.setAttribute('webkit-playsinline','');v.playsInline=true;v.preload='auto';}return v;};
  const stopV=()=>{cancelAnimationFrame(raf);raf=0;clearTimeout(hideT);clearTimeout(autoT);if(v){try{v.pause();}catch(e){}v.onplay=v.ontimeupdate=v.onloadedmetadata=v.onerror=v.onclick=null;}};
  const pgHTML=()=>L.length>1?`<span class="kn2-pg">${ix+1} из ${L.length}${AU?'':matchMedia('(hover:hover)').matches?' · ← →':' · листай вбок'}</span>`:'';
  const vBox=(W,hw)=>`<div class="kn2-v"><div class="kn2-sub" aria-hidden="true">${W.map((w,j)=>`<span${hw&&hw.has(j)?' class="kn2-hw"':''}>${E(w)}</span>`).join(' ')}</div><button class="knv-p kn2-p" aria-label="Смотреть момент" hidden>${SI.play}</button></div>`;
  const endAuto=()=>{const vb=inn.querySelector('.kn2-v')||inn,e=document.createElement('div');e.className='kn2-end';
    e.innerHTML=`<b>${o.title?E(o.title)+' — ':''}всё</b><span><button data-e="again">↺ Сначала</button><button data-e="x">Закрыть</button></span>`;vb.appendChild(e);
    if(fxOK())e.animate([{opacity:0,transform:'scale(.94)'},{opacity:1,transform:'none'}],{duration:360,easing:EZ.out});
    e.querySelector('[data-e="again"]').onclick=ev=>{ev.stopPropagation();sfx('tap');ix=0;fill(L[0],1);};e.querySelector('[data-e="x"]').onclick=ev=>{ev.stopPropagation();sfx('tap');close();};};
  const nextAuto=(c,ms)=>{clearTimeout(autoT);if(!AU||cur!==c)return;autoT=setTimeout(()=>{if(cur!==c||!ov.isConnected||held)return;if(ix>=L.length-1)endAuto();else go(1);},ms);};
  // момент: видео эпизода с a до b, слова субтитра загораются в такт речи (время слов — wt.json сцены; нет — равномерно)
  const vSetup=(c,f,W)=>{const {s,p}=c,vb=inn.querySelector('.kn2-v'),vv=mkV(),pb=vb.querySelector('.kn2-p');vb.prepend(vv);vv.poster=assetUrl(scEpKey(s,c.pi,'jpg'));
    sub=vb.querySelector('.kn2-sub');SP=[...sub.children];
    const a=Math.max(0,f.a-p.a-0.15),b=f.b-p.a+0.25;TT=kLin(f,W);
    wtLoad(s.id).then(R=>{if(cur!==c)return;const X=kFit(f,W,R);if(X)TT=X;});
    const paint=()=>{const t=vv.currentTime+p.a;SP.forEach((sp,j)=>{const x=TT[j]||[f.a,f.b];sp.classList.toggle('on',t>=x[0]-0.04);sp.classList.toggle('now',t>=x[0]-0.04&&t<x[1]+0.04);});if(AU)setSeg(Math.max(0,Math.min(1,(vv.currentTime-a)/Math.max(.3,b-a))));};
    const loop=()=>{raf=0;if(!ov.isConnected||cur!==c)return;paint();if(!vv.paused)raf=requestAnimationFrame(loop);};
    const play=slow=>{clearTimeout(hideT);clearTimeout(autoT);vv.playbackRate=slow?.75:1;try{if(Math.abs(vv.currentTime-a)>0.05)vv.currentTime=a;}catch(e){}SP.forEach(x=>x.classList.remove('on','now'));sub.classList.add('show');
      const pr=vv.play();if(pr&&pr.catch)pr.catch(()=>{pb.hidden=false;});pb.hidden=true;};
    const src=assetUrl(scEpKey(s,c.pi,'mp4'));if(vv.dataset.src!==src){vv.dataset.src=src;vv.src=src+'#t='+a.toFixed(2);}vv.volume=store.scVol==null?1:store.scVol;
    vv.onplay=()=>{if(!raf)raf=requestAnimationFrame(loop);};
    vv.ontimeupdate=()=>{if(cur!==c)return;if(vv.currentTime>=b&&!vv.paused){vv.pause();pb.hidden=false;SP.forEach(x=>{x.classList.add('on');x.classList.remove('now');});if(AU)setSeg(1);
      hideT=setTimeout(()=>{if(cur===c&&vv.paused)sub.classList.remove('show');},1100);nextAuto(c,1400);}};
    vv.onloadedmetadata=()=>{if(vv.currentTime<a-0.1||vv.currentTime>b)try{vv.currentTime=a;}catch(e){}};
    vv.onerror=()=>{pb.hidden=false;nextAuto(c,2500);};
    pb.onclick=e=>{e.stopPropagation();sfx('tap');held=false;play(false);};vv.onclick=()=>{if(vv.paused){held=false;play(false);}else{vv.pause();pb.hidden=false;clearTimeout(autoT);held=true;}};
    return play;};
  const fillPh=c=>{const {s,f,p,pi}=c,[k]=knSt(c),P=scP(s.id),rn=RN[c.rar],T=D.T(f),W=T.split(/\s+/).filter(Boolean);
    card.className='kn2 r-'+rn;
    inn.innerHTML=`${vBox(W)}
      <div class="kn2-b"><span class="kn2-src">${E(dictFilm(s))}${s.sub?' · '+E(s.sub):''} · эпизод ${pi+1}${c.rar>1?` · <i class="kn2-rr">${RT[rn].toLowerCase()} карта</i>`:''}</span>
        <b class="kn2-en">${s.lang==='de'?E(f.de||f.en):kwWrap(f,T)}</b><span class="kn2-ru">${E(f.ru)}</span>
        <div class="kn2-acts"><button data-v="re">${SI.play} Ещё раз</button><button data-v="slow">Медленнее</button><button data-v="ep">Эпизод ${ui('fwd')}</button></div>
        <p class="kn2-st st-${k}"><i class="kn2-dots" aria-hidden="true">${[1,2,3].map(n=>`<b class="${n<=Math.min(3,c.m)?'on':''}"></b>`).join('')}</i><span>${E(kSt(c,P.r[f.id]))}</span></p>
        ${phInfoHTML(f,{fact:D.demo()||ADM_OPEN()||P.done.includes(pi)})}${pgHTML()}</div>`;
    const play=vSetup(c,f,W);
    inn.querySelectorAll('[data-v]').forEach(x=>x.onclick=()=>{sfx('tap');const t=x.dataset.v;if(t==='ep'){close();setTimeout(()=>srOpen(s.id,pi,f.a),220);return;}held=false;play(t==='slow');});
    try{phBind(inn,f);}catch(e){}
    return play;};
  const fillW=c=>{const x=c.w,s=c.s,f=c.f,tg=x.tags||[],st=mywLearned(x)?'ok':!x.due||x.due<=Date.now()?'due':'go';
    let W=[],hw=null;if(f){W=String(f.en||'').split(/\s+/).filter(Boolean);const q=String(x.w).split(/\s+/).map(wtN).filter(Boolean);hw=new Set();
      for(let j=0;j<W.length&&q.length&&!hw.size;j++)if(q.every((w,i)=>W[j+i]&&wtEq(wtN(W[j+i]),w)))q.forEach((w,i)=>hw.add(j+i));}
    card.className='kn2 r-com kn2w'+(f?'':' nov');
    inn.innerHTML=`${f?vBox(W,hw):''}
      <div class="kn2-b"><span class="kn2-src">${s?`${E(dictFilm(s))}${s.sub?' · '+E(s.sub):''} · эпизод ${c.pi+1}`:'Своё слово — добавлено тобой'}</span>
        <b class="kn2-word">${E(x.w)}</b><span class="kn2-ru">${x.ru?E(x.ru):'<i class="kn2-no">перевод не добавлен</i>'}</span>
        ${c.line?`<p class="kn2-line">${markWord(c.line,x.w,'<mark>','</mark>')}${c.lineRu?`<small>${E(c.lineRu)}</small>`:''}</p>`:''}
        ${f?`<div class="kn2-acts"><button data-v="word">${SI.vol} Слово</button><button data-v="re">${SI.play} Реплика</button><button data-v="ep">Эпизод ${ui('fwd')}</button></div>`:''}
        ${x.ru?`<p class="kn2-st st-${st}"><i class="kn2-dots" aria-hidden="true">${[1,2,3].map(n=>`<b class="${n<=Math.min(3,x.st||0)?'on':''}"></b>`).join('')}</i><span>${E(wStTxt(x))}</span></p>`:''}
        ${tg.length?`<div class="kn2-tags">${tg.map(t=>`<i>#${E(t)}</i>`).join('')}</div>`:''}
        <button class="kn2-del" data-v="del">Убрать из моих слов</button>${pgHTML()}</div>`;
    const play=f?vSetup(c,f,W):null;
    inn.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{const t=b.dataset.v;sfx('tap');
      if(t==='ep'){close();setTimeout(()=>srOpen(s.id,c.pi,f.a),220);return;}
      if(t==='word'){held=true;clearTimeout(autoT);if(v)v.pause();wordPlay(s.id,x.w,f.a,f.b,b);return;}
      if(t==='del'){mywDel(x.k);save();toast('Убрал из «Моих слов»');haptic('ok');dirty=true;L.splice(ix,1);if(!L.length){close();return;}ix=ix%L.length;fill(L[ix],1);return;}
      held=false;if(play)play(false);});
    if(!f)nextAuto(c,2600);
    return play;};
  const fill=(c,dir)=>{stopV();cur=c;held=false;setBg(c.s);ov.style.setProperty('--c',c.s?th(c.s):'#F3EBDD');
    if(v&&v.parentNode)v.remove();
    const play=c.w?fillW(c):fillPh(c);card.scrollTop=0;setSeg(0);
    if(dir&&fxOK())inn.animate([{opacity:0,transform:`translateX(${dir*46}px)`},{opacity:1,transform:'none'}],{duration:340,easing:EZ.out});
    if(play)play(false);};
  const go=d=>{if(L.length<2)return;ix=(ix+d+L.length)%L.length;sfx('page');haptic('sel');try{kwHide(0);}catch(e){}
    if(!fxOK())return fill(L[ix],0);const an=inn.animate([{opacity:1,transform:'none'},{opacity:0,transform:`translateX(${-d*46}px)`}],{duration:150,easing:EZ.in,fill:'forwards'});an.onfinish=()=>{fill(L[ix],d);an.cancel();};};
  fill(L[ix]||c,0);
  // открытие: окно растёт из строки (кружка, плитки), фон проявляется
  const R=card.getBoundingClientRect(),zk=R.width/card.offsetWidth||1;
  const grow=(rr,back)=>{const sx=Math.max(.05,rr.width/R.width),sy=Math.max(.05,rr.height/R.height),tx=(rr.left-R.left)/zk,ty=(rr.top-R.top)/zk,fr=[{transform:`translate(${tx}px,${ty}px) scale(${sx},${sy})`,opacity:.4},{transform:'none',opacity:1}];
    card.style.transformOrigin='0 0';return card.animate(back?fr.reverse():fr,{duration:back?300:560,easing:back?EZ.in:SPRING,fill:back?'forwards':'none'});};
  if(fxOK()&&btn){grow(btn.getBoundingClientRect());[...inn.children].forEach((ch,i)=>ch.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{duration:420,delay:160+i*110,easing:EZ.out,fill:'backwards'}));
    btn.style.visibility='hidden';ov.querySelectorAll('.kn2-bg,.kno-dim').forEach(x=>x.animate([{opacity:0},{opacity:1}],{duration:420}));if(!c.w)setTimeout(()=>DL.burst(inn.querySelector('.kn2-v'),c.rar,.6),300);}
  const close=ov._close=()=>{if(ov._c)return;ov._c=true;stopV();cur=null;if(v){try{v.removeAttribute('src');v.load();}catch(e){}}try{musDuck(false);}catch(e){}try{kwHide(0);}catch(e){}document.removeEventListener('keydown',ek);document.body.classList.remove('dx-open');
    const it=L[ix],row=!dirty&&it&&box.querySelector(it.sel||`[data-c="${it.k}"]`),r1=row&&row.isConnected?row.getBoundingClientRect():null,back=fxOK()&&r1&&r1.width&&r1.bottom>0&&r1.top<innerHeight;
    if(back){inn.animate([{opacity:1},{opacity:0}],{duration:120,fill:'forwards'});grow(r1,true);}else card.animate([{opacity:1},{opacity:0,transform:'scale(.96)'}],{duration:200,easing:'ease-in',fill:'forwards'});
    ov.querySelectorAll('.kn2-bg,.kno-dim,.kn2-nv').forEach(x=>x.animate([{opacity:1},{opacity:0}],{duration:back?300:200,fill:'forwards'}));
    setTimeout(()=>{ov.remove();if(btn)btn.style.visibility='';if(dirty)DL.render(0);else DL.bb();},back?310:210);};
  const ek=e=>{if(e.key==='Escape')close();else if(e.key==='ArrowRight')go(1);else if(e.key==='ArrowLeft')go(-1);};document.addEventListener('keydown',ek);
  ov.querySelector('.kno-dim').onclick=close;ov.querySelector('.kn2-x').onclick=()=>{sfx('tap');close();};
  ov.querySelectorAll('.kn2-nv').forEach(b=>b.onclick=()=>{held=false;go(b.classList.contains('nx')?1:-1);});
  // тронул текст (слово, «Когда пригодится») — «подряд» ждёт, пока сам не листнёшь
  card.addEventListener('pointerdown',e=>{if(AU&&e.target.closest('.kn2-b')){held=true;clearTimeout(autoT);}},{capture:true});
  let x0=null,y0=null;card.addEventListener('touchstart',e=>{const t=e.touches[0];x0=t.clientX;y0=t.clientY;},{passive:true});
  card.addEventListener('touchend',e=>{if(x0==null)return;const t=e.changedTouches[0],dx=t.clientX-x0,dy=t.clientY-y0;x0=null;
    if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.4){held=false;go(dx<0?1:-1);return;}
    if(dy>110&&Math.abs(dy)>Math.abs(dx)*1.4&&card.scrollTop<=0)close();},{passive:true});
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
  if(!L.length)return `<div class="kn-empty">Ничего не нашлось<small>Попробуй другое слово или сбрось фильтры.</small><button class="kn-btn2" data-reset>Сбросить фильтры</button></div>`;
  const by=[],m={};L.forEach(c=>{const k=dictFilm(c.s);if(!m[k]){m[k]=[];by.push(k);}m[k].push(c);});
  return `<div class="kn-rh"><span><b>${title}</b><small>у тебя <b>${g}</b> из ${L.length}${L.length-g?` · ещё ${L.length-g} — под туманом, в непройденных эпизодах`:''}</small></span><button class="kn-reset" data-reset>Сбросить</button></div>${bar(g,L.length)}
    ${by.map(k=>{const C=m[k].map((c,i)=>[c,i]).sort((x,y)=>(y[0].got-x[0].got)||(x[1]-y[1])).map(x=>x[0]);return `<section class="kn-lg3"><button class="kn-gh kn-gh2" data-show="${E(k)}"><span class="kn-ght"><b>${E(k)}</b><small>${C.filter(c=>c.got).length} из ${C.length}</small></span><i class="kn-chev">${ui('fwd')}</i></button>${rowsL(C)}</section>`;}).join('')}`;}
// 13.8.4: тема — такой же кнопкой со списком, как статус/тон/фильм (было: ряд чипов сверху + те же темы плитками ниже)
const DD=[['tp','Тема','Все'],['st','Статус','Все'],['tone','Тон','Любой'],['film','Фильм','Все']];
const ddOpts=(k,F)=>k==='tp'?tpCnt(allCards()).map(x=>[x.k,`${x.ico} ${E(cap(x.k))} · ${x.g}/${x.t}`]):k==='st'?STF:k==='tone'?TONE:(F||DL.films()).map(sh=>[sh.k,E(sh.k)]);
function knDD(k){const d=DD.find(x=>x[0]===k),O=ddOpts(k);sfx('tap');
  const w=knSheet(`<b class="kn-sh2">${d[1]}</b><div class="kn-ddl"><button data-ddv="" class="${KN[k]?'':'on'}">${d[2]}</button>${O.map(([v,l])=>`<button data-ddv="${E(v)}" class="${KN[k]===v?'on':''}">${l}</button>`).join('')}</div>`);
  w.querySelectorAll('[data-ddv]').forEach(b=>b.onclick=()=>{sfx('sel');haptic('sel');KN[k]=b.dataset.ddv;w._close();DL.render(0);});}
function bindCards(st){st.querySelectorAll('.kc[data-c],.kcc[data-c],.kr[data-c],.kq[data-c]').forEach(b=>b.onclick=()=>{const c=D.find(b.dataset.c);if(!c)return;if(!c.got){knLock(b,c);return;}sfx('tap');haptic('light');knOpen(b,c);});}
function bindRes(st){const box=st.querySelector('#knRes');if(!box)return;bindCards(box);
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
function knfSlide(sh,i){const s0=sh.s0,bd=knBd(s0),q=knfQ(sh),nx=knfNext(sh),eps=sh.L.reduce((a,s)=>a+s.parts.length,0);
  return `<section class="knf-s${bd?' bd':''}" data-i="${i}" style="--c:${th(s0)};--bg:${bd||D.cover(s0)}"><span class="knf-bd"></span>
    <span class="knf-live" data-ls="${(q?q.s:s0).id}" data-pi="${q?q.pi:0}" data-fid="${q?q.f.id:''}"></span><span class="knf-gr"></span>
    <div class="knf-in"><span class="knf-p" style="background-image:${D.poster(s0)}"></span><div class="knf-t"><em>${KS[sh.kind]||''}${sh.kind==='film'&&s0.ep?' · '+E(s0.ep):''}</em>
      <h2>${E(sh.k).split(' ').map(w=>`<span>${w}</span>`).join(' ')}</h2>
      <small class="knf-c">Собрано <b>${sh.g}</b> из ${sh.t} ${plural(sh.t,['фразы','фраз','фраз'])} · ${D.sc(sh.L.length)} · ${D.ep(eps)}</small>${bar(sh.g,sh.t)}
      <div class="knf-b"><button class="kf-go" data-fw="${nx.id}">${SI.play} ${sh.g?'Смотреть дальше':'Смотреть'}</button><button class="knf-op" data-fo="${i}">Открыть ${ui('fwd')}</button></div></div></div></section>`;}
function knFull(kind,btn){DL.clean();const F=DL.films().filter(x=>x.kind===kind),n=F.length;if(!n)return;let cur=-1,vt=0,se=0,closing=false;
  const ov=document.createElement('div');ov.className='kno knf';
  ov.innerHTML=`<div class="knf-pg">${F.map(knfSlide).join('')}</div>
    <div class="knf-top"><span class="knf-ttl"><b>${D.kindName(kind)}</b><i class="knf-num">1 / ${n}</i></span><button class="knf-x" aria-label="Закрыть">${ui('close')}</button></div>
    ${n>1?`<div class="knf-dots">${F.map((sh,i)=>`<button data-i="${i}" aria-label="${E(sh.k)}"></button>`).join('')}</div><button class="knf-nv pv" aria-label="Предыдущий">${ui('back')}</button><button class="knf-nv nx" aria-label="Следующий">${ui('fwd')}</button>`:''}`;
  document.body.appendChild(ov);document.body.classList.add('dx-open');try{backBtn(true);}catch(e){}
  const pg=ov.querySelector('.knf-pg'),SL=[...ov.querySelectorAll('.knf-s')],num=ov.querySelector('.knf-num'),dots=[...ov.querySelectorAll('.knf-dots button')],W=()=>pg.clientWidth||innerWidth;
  const live=i=>{clearTimeout(vt);SL.forEach((s,j)=>{if(j!==i)D.stopVids(s);});
    vt=setTimeout(()=>{const lv=SL[i]&&SL[i].querySelector('.knf-live'),s=lv&&scOf(lv.dataset.ls),pi=lv?+lv.dataset.pi||0:0,p=s&&s.parts[pi],f=p&&(p.ph.find(x=>x.id===lv.dataset.fid)||scAct(p.ph)[0]);
      if(s&&p&&ov.isConnected&&!closing)D.loopVid(lv,s,pi,f,p);},fxOK()?600:200);};
  const setCur=(i,quiet)=>{if(i===cur)return;cur=i;num.textContent=`${i+1} / ${n}`;dots.forEach((d,j)=>d.classList.toggle('on',j===i));
    ov.querySelectorAll('.knf-nv').forEach(b=>b.disabled=b.classList.contains('pv')?i<=0:i>=n-1);
    if(!quiet){sfx('tick');haptic('sel');}live(i);
    if(fxOK())SL[i].querySelectorAll('.knf-p,.knf-t>*').forEach((x,k)=>x.animate([{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{duration:520,delay:60+k*70,easing:EZ.out,fill:'backwards'}));};
  // фон слегка отстаёт от слайда, пока листаешь
  const par=()=>{const x=pg.scrollLeft,w=W();SL.forEach(s=>{const d=s.offsetLeft-x;if(Math.abs(d)>w*1.3)return;const bd=s.querySelector('.knf-bd');if(bd)bd.style.transform=`translateX(${(-d*.3).toFixed(1)}px)`;});};
  pg.addEventListener('scroll',()=>{if(fxOK())par();clearTimeout(se);se=setTimeout(()=>setCur(Math.max(0,Math.min(n-1,Math.round(pg.scrollLeft/W())))),120);},{passive:true});
  const go=i=>{i=Math.max(0,Math.min(n-1,i));if(i===cur){if(fxOK())pg.animate([{transform:'none'},{transform:`translateX(${i<=0?14:-14}px)`},{transform:'none'}],{duration:260});return;}pg.scrollTo({left:i*W(),behavior:fxOK()?'smooth':'auto'});};
  // уйти из окна сразу (переход на другой экран): без анимации, кнопку «назад» выставит новый экран
  const kill=()=>{closing=true;clearTimeout(vt);document.removeEventListener('keydown',ek);D.stopVids(ov);ov.remove();document.body.classList.remove('dx-open');};
  const close=ov._close=()=>{if(closing)return;closing=true;clearTimeout(vt);document.removeEventListener('keydown',ek);document.body.classList.remove('dx-open');
    const fin=()=>{D.stopVids(ov);ov.remove();DL.bb();};if(!fxOK())return fin();
    ov.animate([{opacity:1,transform:'none'},{opacity:0,transform:'scale(.97)'}],{duration:240,easing:EZ.in,fill:'forwards'}).onfinish=fin;};
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
/* ---------- 13.8.7: «Мои фразы и слова» (Андрей: «фразы оставь только в „Мои“, дай смотреть по тегам; раздели на фразы и слова —
   переключатель, чтобы по ним тренироваться; по умолчанию — как меню с тегами; тупо список — не кайф; накинь 3–4 варианта»).
   Переключатель «Фразы / Слова»; по умолчанию — меню подборок: «Повторить сегодня», «Новые», «Все», темы, фильмы, «Выучено»
   (у слов — свои #теги и «Добавлено мной»). Вид меню — 4 варианта на выбор (store.knMyV): плитки-кадры, плейлисты (мозаика),
   истории (кружки — смотреть подряд), оглавление. Внутри подборки — «▶ Смотреть подряд» и «Тренировать» (повторение по подборке). ---------- */
const MYV=[['tiles','Плитки'],['lists','Плейлисты'],['stories','Истории'],['toc','Оглавление']];
const myV=()=>MYV.some(x=>x[0]===store.knMyV)?store.knMyV:'tiles';
const myKind=()=>store.knMyKind==='w'?'w':'ph';
KN.my={tag:null,q:'',all:0};
const wDue=x=>!!x.ru&&(!x.due||x.due<=Date.now());
const wFilm=x=>{const s=!x.own&&scOf(x.sid);return s?dictFilm(s):'';};
const myPh=()=>allCards().filter(c=>c.got);
const nPh=n=>`${n} ${plural(n,['фраза','фразы','фраз'])}`,nWd=n=>`${n} ${plural(n,['слово','слова','слов'])}`;
// кадр к фразе или слову: [сцена, эпизод]
const xSP=x=>x.f&&x.s?[x.s,x.pi]:x.own?null:(s=>s?[s,x.pi||0]:null)(scOf(x.sid));
const myCov=(t,n)=>{n=n||4;const out=[],seenF={},L=t.L,off=L.length?D.hs(t.k)%L.length:0;
  for(let pass=0;pass<2&&out.length<n;pass++)for(let j=0;j<L.length&&out.length<n;j++){const x=L[(j+off)%L.length],sp=xSP(x);if(!sp)continue;const k=sp[0].id+'|'+sp[1]+'|'+pass;if(seenF[k])continue;seenF[k]=1;
    out.push({u:(pass?D.art2:D.art)(sp[0],sp[1]),st:D.crop({k:(x.k||sp[0].id)+'|'+pass})});}
  return out;};
// цвет плитки — из спокойной «киношной» палитры (без кислотных), у каждой подборки свой
const PAL=['#7E3434','#2E4C80','#2B6E5E','#76502E','#583A7C','#86682A','#2D6380','#53622D','#7C3D5A','#46506A'];
const tcol=t=>t.hot?'#7A4A14':PAL[D.hs(t.k)%PAL.length];
// один кадр подборки: из разных кадров её фраз — по подборке (чтобы у соседних плиток и кружков были разные)
const myOne=t=>{const F=myCov(t,8);return F.length?F[D.hs(t.k+'#')%F.length]:null;};
function myTags(kind){const T=[],add=(k,n,ico,L,sec,o)=>{if(L.length)T.push(Object.assign({k,n,ico,L,sec},o||{}));};
  if(kind==='w'){const L=mywAll();
    add('★due','Повторить сегодня','⏰',L.filter(wDue),'pick',{hot:1,sub:'пора повторить'});
    add('★all','Все слова','⭐',L,'pick');
    add('★ok','Выучено','✓',L.filter(mywLearned),'pick');
    const tg={};L.forEach(x=>(x.tags||[]).forEach(t=>{(tg[t]=tg[t]||[]).push(x);}));
    Object.keys(tg).sort((a,b)=>tg[b].length-tg[a].length).forEach(t=>add('t:'+t,'#'+t,'🏷',tg[t],'tag'));
    add('★own','Добавлено мной','✍️',L.filter(x=>x.own),'tag');
    const fm={},fo=[];L.forEach(x=>{const k=wFilm(x);if(!k)return;if(!fm[k]){fm[k]=[];fo.push(k);}fm[k].push(x);});
    fo.forEach(k=>add('f:'+k,k,'🎬',fm[k],'film'));
    return T;}
  const L=myPh();
  add('★due','Повторить сегодня','⏰',L.filter(c=>c.due),'pick',{hot:1,sub:'пора повторить'});
  const nw=L.filter(c=>c.nw&&!c.due);if(nw.length<L.length)add('★new','Новые','✨',nw,'pick',{sub:'за 3 дня'});
  add('★all','Все фразы','🎞',L,'pick');
  add('★ok','Выучено','✓',L.filter(c=>c.m>=3&&!c.due),'pick');
  TOPICS_ALL.map(t=>[t,L.filter(c=>fTopics(c.f).includes(t))]).sort((a,b)=>b[1].length-a[1].length).forEach(([t,C])=>add('t:'+t,cap(t),TOPIC_ICO[t]||'💬',C,'topic'));
  const fm={},fo=[];L.slice().sort((a,b)=>lastGot(b.s)-lastGot(a.s)).forEach(c=>{const k=dictFilm(c.s);if(!fm[k]){fm[k]=[];fo.push(k);}});
  L.forEach(c=>fm[dictFilm(c.s)].push(c));fo.forEach(k=>add('f:'+k,k,'🎬',fm[k],'film'));
  return T;}
const MYSEC=W=>[['pick',''],['topic','Темы'],['tag','Твои теги'],['film',W?'Из каких фильмов':'Фильмы']];
const mosaic=(f,cls)=>`<span class="kml-cv n${Math.min(4,f.length)}${cls?' '+cls:''}">${f.slice(0,4).map(c=>`<i style="background-image:${c.u};${c.st}"></i>`).join('')}</span>`;
function myMenu(kind,T){const v=myV(),W=kind==='w',cnt=t=>W?nWd(t.L.length):nPh(t.L.length),secs=MYSEC(W);
  const each=fn=>secs.map(([sec,h])=>{const S=T.filter(t=>t.sec===sec);return S.length?fn(S,h,sec):'';}).join('');
  // 1. Плитки (как жанры в Spotify): цвет подборки, название сверху, кадр из фильма наклонён в углу; «Повторить сегодня» — во всю ширину
  if(v==='tiles')return each((S,h)=>`${h?`<h3 class="km-h">${h}</h3>`:''}<div class="kmt-grid">${S.map(t=>{const f=t.hot?null:myOne(t);
    return `<button class="kmt${t.hot?' hot':''}" data-mt="${E(t.k)}" style="--tc:${tcol(t)}"><span class="kmt-tx"><b>${E(t.n)}</b><small>${cnt(t)}${t.sub?' · '+t.sub:''}</small></span>${f?`<span class="kmt-f" style="background-image:${f.u}"></span>`:''}${t.hot?`<em class="kmt-n">${t.L.length}</em>`:''}</button>`;}).join('')}</div>`);
  // 2. Плейлисты: мозаика из 4 кадров, ▶ — смотреть подряд, подпись под обложкой
  if(v==='lists')return each((S,h)=>`${h?`<h3 class="km-h">${h}</h3>`:''}<div class="kml-grid">${S.map(t=>{const f=myCov(t,4);
    return `<button class="kml${t.hot?' hot':''}" data-mt="${E(t.k)}" style="--tc:${tcol(t)}"><span class="kml-a">${f.length?mosaic(f):`<span class="kml-cv n0"><i>${t.ico}</i></span>`}<span class="kml-pl" data-mplay="${E(t.k)}" role="button" aria-label="Смотреть подряд">${SI.play}</span></span><b>${E(t.n)}</b><small>${cnt(t)}</small></button>`;}).join('')}</div>`);
  // 3. Истории: кружки сверху (тап — сразу смотришь подряд), ниже — все фразы
  if(v==='stories'){const all=T.find(t=>t.k==='★all')||{L:[]};
    return `<div class="kms-row">${T.map(t=>{const f=myOne(t);return `<button class="kms${t.hot?' hot':''}" data-ms="${E(t.k)}"><span class="kms-r"><span class="kms-i"${f?` style="background-image:${f.u}"`:''}>${f?'':t.ico}</span></span><b>${E(t.n)}</b><small>${t.L.length}</small></button>`;}).join('')}</div>
      <p class="km-tip">Нажми на кружок — ${W?'слова идут':'фразы идут'} подряд, как истории. Нажми на ${W?'слово':'фразу'} — откроется ${W?'оно':'она'}.</p>
      <h3 class="km-h">${W?'Все слова':'Все фразы'}<small>${all.L.length}</small></h3>${myList(kind,all.L,KN.my.all?0:40)}`;}
  // 4. Оглавление: как в книге — главы, название, отточие, число
  const R=['I','II','III','IV'];let ch=0;
  return `<div class="kmo-toc">${each((S,h)=>`<h4><em>${R[ch++]||''}</em>${h||'Подборки'}</h4>${S.map(t=>`<button class="kmo${t.hot?' hot':''}" data-mt="${E(t.k)}"><span class="kmo-n">${E(t.n)}${t.sub?`<small>${t.sub}</small>`:''}</span><i class="kmo-ld"></i><span class="kmo-c">${t.L.length}</span></button>`).join('')}`)}</div>`;}
// строка-слово: слово и перевод, справа тихо — когда повторим
const wRow=x=>{const st=!x.ru?'':mywLearned(x)?'<em class="kw-st ok">выучено</em>':wDue(x)?'<em class="kw-st due">сегодня</em>':x.due?`<em class="kw-st">${E(mywWhen(x.due))}</em>`:'';
  return `<button class="kq kq2 kqw" data-own data-w="${E(x.k)}"><span class="kq-x"><b class="kq-en">${E(x.w)}</b><span class="kq-ru">${x.ru?E(x.ru):'<i>без перевода</i>'}</span></span>${st}</button>`;};
function myList(kind,L,lim){const W=kind==='w',by=[],m={};
  L.forEach(x=>{const k=W?(wFilm(x)||'Добавлено мной'):dictFilm(x.s);if(!m[k]){m[k]=[];by.push(k);}m[k].push(x);});
  let n=0;const out=[];
  for(const k of by){if(lim&&n>=lim)break;let C=m[k];if(lim&&n+C.length>lim)C=C.slice(0,lim-n);n+=C.length;
    out.push(`<section class="kn-lg3"><div class="kn-gh kn-gh2"><span class="kn-ght"><b>${E(k)}</b><small>${m[k].length}</small></span></div>${W?`<div class="kq-l">${C.map(wRow).join('')}</div>`:rowsL(C)}</section>`);}
  return out.join('')+(lim&&L.length>lim?`<button class="km-more" data-mall>Показать все · ${L.length}</button>`:'');}
function myPage(kind,t){const W=kind==='w',v=myV(),f=myCov(t,4),trN=W?t.L.filter(x=>x.ru).length:t.L.length,canPlay=!W||t.L.some(x=>xSP(x)),ban=v==='tiles';
  return `<div class="kmp v-${v}${ban?' ban':''}"${ban?` style="--tc:${tcol(t)}"`:''}>${ban&&f.length?`<span class="kmp-f" style="background-image:${f[0].u}"></span>`:''}
    <div class="kmp-h"><button class="dl-up" data-mup aria-label="Назад">${ui('back')}</button>${v==='lists'&&f.length?mosaic(f,'kmp-cv'):''}
      <span class="kmp-t"><em>${W?'Мои слова':'Мои фразы'}</em><b>${E(t.n)}</b><small>${W?nWd(t.L.length):nPh(t.L.length)}${t.sub?' · '+t.sub:''}</small></span></div>
    <div class="kmp-acts">${canPlay?`<button class="kmp-play" data-mplay="${E(t.k)}">${SI.play} ${W?'Слушать подряд':'Смотреть подряд'}</button>`:''}${trN?`<button class="kmp-tr" data-mtrain="${E(t.k)}">Тренировать <small>${Math.min(W?8:10,trN)}</small></button>`:''}</div></div>
    ${myList(kind,t.L)}`;}
function myBody(kind,T){const q=KN.my.q.toLowerCase();if(!q)return myMenu(kind,T);
  const W=kind==='w',L=W?mywAll().filter(x=>(x.w+' '+(x.ru||'')+' '+(x.tags||[]).join(' ')).toLowerCase().includes(q)):myPh().filter(c=>(c.f.en+' '+(c.f.de||'')+' '+c.f.ru).toLowerCase().includes(q));
  return L.length?`<h3 class="km-h">Нашлось<small>${W?nWd(L.length):nPh(L.length)}</small></h3>${myList(kind,L)}`:`<div class="kn-empty">Ничего не нашлось<small>Попробуй другое слово.</small></div>`;}
function myHTML(){const kind=myKind(),W=kind==='w',nP=myPh().length,nW=mywAll().length;
  const top=`${seg()}<div class="km-top"><div class="km-sw" role="tablist"><button data-mk="ph" class="${W?'':'on'}">Фразы <i>${nP}</i></button><button data-mk="w" class="${W?'on':''}">Слова <i>${nW}</i></button></div>${W&&nW?`<button class="km-add" data-madd>＋ Своё</button>`:''}</div>`;
  const T=myTags(kind),t=KN.my.tag&&T.find(x=>x.k===KN.my.tag);if(KN.my.tag&&!t)KN.my.tag=null;
  if(t)return top+myPage(kind,t);
  if(W?!nW:!nP)return top+(W?`<div class="km-empty"><b>Пока нет слов</b><span>Смотри эпизод и нажми на незнакомое слово в субтитрах → «☆ В мои слова». Или добавь своё — оно тоже придёт в повторение.</span><button class="kn-btn" data-madd>＋ Добавить своё слово</button></div>`
    :`<div class="km-empty"><b>Пока нет фраз</b><span>Фраза ложится сюда, когда ты верно ответил на неё в проверке после эпизода.</span><button class="kn-btn" data-kseg="kino">Открыть Кинотеку</button></div>`);
  return top+`<p class="km-exp">${W?'Слова, которые ты сохранил сам. Они приходят в повторение — завтра, через 3 дня, через неделю, пока не выучишь.':'Фразы, которые ты собрал в проверках после эпизодов. Открой подборку — смотри подряд или тренируйся.'}</p>
    <label class="km-q">${IC.q}<input id="kmQ" type="search" placeholder="${W?'Найти слово':'Найти фразу'}" value="${E(KN.my.q)}" autocomplete="off" enterkeyhint="search"></label>
    <div class="km-vv"><span>Вид</span>${MYV.map(([k,n])=>`<button data-mv="${k}" class="${myV()===k?'on':''}">${n}</button>`).join('')}</div>
    <div id="kmBody" class="km-b v-${myV()}">${myBody(kind,T)}</div>`;}
// слово → «карта» для открытого окна: момент — реплика, где оно прозвучало
function wCard(x){const s=!x.own&&scOf(x.sid)||null,p=s&&s.parts[x.pi]||null,r=s&&x.a?(s.subs||[]).find(z=>Math.abs(z[0]-x.a)<0.06):null,de=s&&s.lang==='de';
  const line=r?(de?(r[4]||r[2]):r[2]):x.line,lineRu=r?r[3]:x.lineRu;
  return {w:x,k:'w|'+x.k,sel:`[data-w="${CSS.escape(x.k)}"]`,got:true,s,p,pi:x.pi||0,rar:1,m:Math.min(3,x.st||0),line,lineRu,
    f:s&&p&&x.a?{id:'w|'+x.k,en:line||'',de:line||'',ru:lineRu||'',a:r?r[0]:x.a,b:r?r[1]:x.a+4}:null};}
function myPlay(b,t){const W=myKind()==='w',L=W?t.L.map(wCard):t.L.slice();if(!L.length)return;sfx('tap');haptic('light');knOpen(b,L[0],{L,auto:true,title:t.n});}
function myTrain(t){if(myKind()==='w'){renderMyWordsQuiz(t.L.filter(x=>x.ru),()=>renderTab('dict'));return;}
  const L=shuffle(t.L.slice()).slice(0,10).map(c=>{const r=scP(c.s.id).r[c.f.id];return {k:'ph',s:c.s,f:c.f,due:r?r[1]:0};});
  renderDaily(L,{train:true,nosrs:D.demo(),title:'Тренировка · '+t.n,back:()=>renderTab('dict')});}
function myAdd(){sfx('tap');const tags=[...new Set(mywAll().flatMap(x=>x.tags||[]))];
  const w=knSheet(`<b class="kn-sh2">Своё слово</b><p class="kn-sm">Слово или фраза, которую хочешь выучить. Придёт в повторение вместе с остальными.</p>
    <form class="km-form" autocomplete="off"><input name="w" placeholder="Слово или фраза (англ.)" required maxlength="60"><input name="ru" placeholder="Перевод" maxlength="80">
      <input name="tag" placeholder="#тег — например, работа" maxlength="24" list="kmTagL"><datalist id="kmTagL">${tags.map(t=>`<option value="${E(t)}">`).join('')}</datalist>
      <button class="kn-btn" type="submit">＋ В мои слова</button></form><button class="kn-btn2" data-x>Отмена</button>`);
  const F=w.querySelector('form');setTimeout(()=>{try{F.w.focus();}catch(e){}},300);
  F.onsubmit=e=>{e.preventDefault();const v=F.w.value.trim(),ru=F.ru.value.trim(),tg=F.tag.value.trim().replace(/^#/,'').toLowerCase();if(!v)return;
    store.myw=store.myw||{};const k=mywKey('own',v.toLowerCase());store.myw[k]={k,w:v,ru,de:'',sid:'own',pi:0,line:'',lineRu:'',a:0,at:Date.now(),lvl:0,st:0,due:Date.now()+36e5,own:true,tags:tg?[tg]:[]};
    save();sfx('good');haptic('ok');toast('⭐ Добавил в «Мои слова»');w._close();store.knMyKind='w';KN.my.q='';DL.render(0);};}
// появление: плитки, кружки, строки — каскадом
function myIn(el){if(!fxOK())return;let i=0;const A=(x,kf,o)=>{if(i<26)x.animate(kf,Object.assign({fill:'backwards',easing:EZ.out,delay:i*30},o));i++;};
  el.querySelectorAll('.kmt,.kml').forEach(x=>A(x,[{opacity:0,transform:'translateY(16px) scale(.94)'},{opacity:1,transform:'none'}],{duration:480,easing:SPRING}));
  el.querySelectorAll('.kms').forEach(x=>A(x,[{opacity:0,transform:'scale(.55)'},{opacity:1,transform:'none'}],{duration:520,easing:SPRING}));
  el.querySelectorAll('.kmo-toc h4,.kmo').forEach(x=>A(x,[{opacity:0,transform:'translateX(-10px)'},{opacity:1,transform:'none'}],{duration:360}));
  el.querySelectorAll('.kmp-h,.kmp-acts,.kq').forEach(x=>A(x,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:360}));}
function myBindBody(st){const kind=myKind(),tag=k=>myTags(kind).find(x=>x.k===k);
  st.querySelectorAll('[data-mt]').forEach(b=>b.onclick=()=>{sfx('tap');haptic('sel');KN.my.tag=b.dataset.mt;KN.my.all=0;DL.render(1);});
  st.querySelectorAll('[data-ms]').forEach(b=>b.onclick=()=>{const t=tag(b.dataset.ms);if(t)myPlay(b,t);});
  st.querySelectorAll('[data-mplay]').forEach(b=>b.onclick=e=>{e.stopPropagation();const t=tag(b.dataset.mplay);if(t)myPlay(b.closest('.kml')||b,t);});
  st.querySelectorAll('[data-mtrain]').forEach(b=>b.onclick=()=>{const t=tag(b.dataset.mtrain);if(!t)return;sfx('tap');haptic('medium');myTrain(t);});
  st.querySelectorAll('[data-mall]').forEach(b=>b.onclick=()=>{sfx('page');KN.my.all=1;const bd=st.querySelector('#kmBody');if(bd){const y=scrollY;bd.innerHTML=myBody(kind,myTags(kind));myBindBody(st);scrollTo(0,y);}});
  const rows=[...st.querySelectorAll('.kqw[data-w]')];
  rows.forEach(b=>b.onclick=()=>{const L=rows.map(r=>store.myw&&store.myw[r.dataset.w]).filter(Boolean).map(wCard),c=L.find(x=>x.w.k===b.dataset.w);if(!c)return;sfx('tap');haptic('light');knOpen(b,c,{L});});
  bindCards(st);}
function myBind(st){const kind=myKind();
  st.querySelectorAll('[data-mk]').forEach(b=>b.onclick=()=>{const k=b.dataset.mk;if(myKind()===k)return;sfx('tap');haptic('sel');store.knMyKind=k;KN.my.tag=null;KN.my.q='';KN.my.all=0;save();DL.render(k==='w'?1:-1);});
  st.querySelectorAll('[data-mv]').forEach(b=>b.onclick=()=>{if(myV()===b.dataset.mv)return;sfx('tap');haptic('sel');store.knMyV=b.dataset.mv;save();
    st.querySelectorAll('[data-mv]').forEach(x=>x.classList.toggle('on',x===b));const bd=st.querySelector('#kmBody');if(bd){bd.className='km-b v-'+myV();bd.innerHTML=myBody(kind,myTags(kind));myBindBody(st);myIn(bd);}});
  st.querySelectorAll('[data-madd]').forEach(b=>b.onclick=myAdd);
  st.querySelectorAll('[data-mup]').forEach(b=>b.onclick=e=>{e.stopPropagation();sfx('tap');DL.back();});
  const q=st.querySelector('#kmQ');if(q){let tm=0;q.oninput=()=>{clearTimeout(tm);tm=setTimeout(()=>{KN.my.q=q.value.trim();const bd=st.querySelector('#kmBody');if(bd){bd.innerHTML=myBody(kind,myTags(kind));myBindBody(st);}},200);};q.onkeydown=e=>{if(e.key==='Enter')q.blur();};}
  myBindBody(st);myIn(st);
  // ПК: мозаика плейлиста чуть наклоняется к мыши (как постеры на полке)
  if(matchMedia('(hover:hover)').matches)st.querySelectorAll('.kml').forEach(x=>x.classList.add('dlt'));}
D.reg({id:'kino',n:'Новый словарь',from:'Кинотека + «Мои фразы и слова»',ic:'🎞',sw:'linear-gradient(160deg,#2b2d33,#0b0b0d)',noAnim:true,my:true,flt:true,skip1:false,
  d:'«Кинотека» — фильмы и сколько фраз собрано; фильм → сцены строками → эпизод раскрывается → фразы строками; нажал на фразу — открывается красиво: момент крупно, фраза субтитром в такт речи, листаешь вбок. «Мои фразы и слова» — переключатель «Фразы / Слова», по умолчанию меню подборок (теги), внутри — «Смотреть подряд» и «Тренировать»; вид меню — 4 варианта на выбор.',
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
      <h3 class="kn-h kn-h2">Эпизоды<small>нажми, чтобы увидеть фразы</small></h3>
      ${D.eps(s).map(e=>{const h=e.c.filter(c=>c.got).length,k=s.id+'|'+e.pi,op=DXOPEN[k]!=null?DXOPEN[k]:s.parts.length===1;
        return `<details class="kn-ep" data-k="${k}"${op?' open':''}><summary><span class="kn-et" style="background-image:url('${assetUrl(scEpKey(s,e.pi,'jpg'))}')"><button class="kn-ew" data-wep="${k}" aria-label="Смотреть эпизод ${e.pi+1}">${SI.play}</button></span><span class="kn-ex"><em>Эпизод ${e.pi+1}</em><b>${E(e.p.t)}</b>${bar(h,e.c.length)}</span><span class="kn-en"><b>${h}</b>/${e.c.length}</span><i class="kn-chev">${ui('fwd')}</i></summary>${rowsL(e.c)}</details>`;}).join('')}
      ${L.length>1?`<div class="kn-nav">${n?`<button data-sid="${L[n-1].id}">${ui('back')}<span><em>Сцена ${n}</em><b>${E(L[n-1].sub||L[n-1].title)}</b></span></button>`:'<i></i>'}${n<L.length-1?`<button class="nx" data-sid="${L[n+1].id}"><span><em>Сцена ${n+2}</em><b>${E(L[n+1].sub||L[n+1].title)}</b></span>${ui('fwd')}</button>`:'<i></i>'}</div>`:''}`;},
  flt(F){
    return `${D.crumb('Словарь','Поиск и фильтры')}<label class="kn-fq">${IC.q}<input id="knQ" type="search" placeholder="Фраза, слово или перевод" value="${E(KN.q)}" autocomplete="off" enterkeyhint="search"></label>
      <div class="kn-dd">${DD.map(([k,l,all])=>{const o=ddOpts(k,F).find(x=>x[0]===KN[k]);return `<button class="kn-ddb${KN[k]?' on':''}" data-dd="${k}">${o?`<b>${k==='tp'?`${TOPIC_ICO[o[0]]||''} ${E(cap(o[0]))}`:o[1]}</b>`:`<span>${l}</span>`}<i>▾</i></button>`;}).join('')}</div>
      <div id="knRes">${knRes()}</div>`;},
  my(){return myHTML();},
  myBack(){if(KN.my.tag){KN.my.tag=null;DL.render(-1);return true;}if(KN.my.q){KN.my.q='';DL.render(0);return true;}return false;},
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
    st.querySelectorAll('.kn-ep').forEach(d=>d.addEventListener('toggle',()=>{DXOPEN[d.dataset.k]=d.open;if(!d.open)return;sfx('page');
      if(fxOK())d.querySelectorAll('.kq').forEach((c,i)=>c.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:340,delay:Math.min(i,12)*32,easing:EZ.out,fill:'backwards'}));}));
    if(lvl==='flt'){bindRes(st);st.querySelectorAll('[data-dd]').forEach(b=>b.onclick=()=>knDD(b.dataset.dd));
      const q=st.querySelector('#knQ');if(q){let t=0;q.oninput=()=>{clearTimeout(t);t=setTimeout(()=>{KN.q=q.value.trim();const r=st.querySelector('#knRes');if(r){r.innerHTML=knRes();bindRes(st);}},200);};
        q.onkeydown=e=>{if(e.key==='Enter')q.blur();};}}
    if(lvl==='my')myBind(st);else bindCards(st);}
});
{const V=DL.V;V.unshift(V.pop());}   // новый словарь — первым в списке
})();
