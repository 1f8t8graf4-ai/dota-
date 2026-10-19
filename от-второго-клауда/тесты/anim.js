// 13.9.33 (P0.2, Андрей: «анимаций нет»): на каждом экране «Нового» после перехода есть появление (хоть одна анимация 150–450 мс);
// с «меньше движения» в системе (reducedMotion:'reduce') появление есть, а долгих и бесконечных (Ken Burns, туман…) нет;
// с выключенными «Анимациями» в Настройках — анимаций 0. Плюс: шторка растёт из точки нажатия.
const {open}=require('./st');const {chromium}=require('playwright');
const dev=process.argv[2]||'ph';
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
const init=([st,fl])=>{if(!sessionStorage.getItem('__seeded')){sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify(fl));}};
const base={onboarded:true,introV:1,unl:1,snd:false,fx:true,knWin:'sheet',wtapHint:1,lvl:'b',tourV:1,scSubChosen:1,autoSc:false,look:'nd',lookV:2};
const SCR=[['Сегодня',()=>renderTab('learn')],['Кино',()=>renderTab('kino')],['Словарь',()=>renderTab('dict')],['Профиль',()=>renderTab('profile')],
  ['Сцена',()=>renderScene('wolf-of-wall-street')],['Эпизод',()=>renderScEp('wolf-of-wall-street',0)],['Проверка',()=>renderScQuiz('wolf-of-wall-street',0)],['Настройки',()=>renderSettings()]];
(async()=>{const b=await chromium.launch();const vp=dev==='pc'?{width:1440,height:900}:{width:390,height:844};
  const go=async(st,rm)=>{const A=await open({browser:b,uid:111,name:'Андрей',platform:dev==='pc'?'tdesktop':'ios',touch:dev!=='pc',ctx:{viewport:vp,reducedMotion:rm?'reduce':'no-preference'},wait:2200,init,initArg:[st,{admin:true,flags:{}}]});
    await A.page.evaluate(()=>{const s=scOf('wolf-of-wall-street'),P=scP(s.id);P.w[0]=1;P.done=[0];P.st=P.st||{};P.st[0]=3;scSave();store.scLast={id:s.id,i:1};save();});return A;};
  // снимок анимаций через 60 мс после перехода: длительности (CSS и WAAPI) и бесконечные
  const probe=async(P,f)=>{await P.evaluate(f);await P.waitForTimeout(60);return P.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running'||a.playState==='pending').map(a=>{const t=a.effect.getTiming();
    return {n:a.animationName||a.constructor.name,d:+t.duration||0,inf:t.iterations===Infinity,dl:+t.delay||0};}));};
  const run=async(tag,st,rm,check)=>{const A=await go(st,rm),P=A.page;const bad=[];
    await P.evaluate(()=>renderTab('learn'));await P.waitForTimeout(900);
    for(const [n,f] of SCR){const L=await probe(P,f);await P.waitForTimeout(600);
      // через 0,6 с: что реально идёт (задержка прошла) — долгие и бесконечные (наезды, туман) при «меньше движения» должны быть сняты
      const L2=await P.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running'&&(a.currentTime||0)>(+a.effect.getTiming().delay||0)).map(a=>{const t=a.effect.getTiming();return {n:a.animationName||a.constructor.name,d:+t.duration||0,inf:t.iterations===Infinity};}));
      const r=check(L,L2);if(r)bad.push(n+': '+r);await P.waitForTimeout(200);}
    await A.ctx.close();return {bad,errs:A.errs};};
  // 1. обычный режим: появление 150–450 мс на каждом экране
  let r=await run('norm',base,false,L=>L.some(a=>a.d>=150&&a.d<=450)?'':'нет появления '+JSON.stringify(L.slice(0,6)));
  ok(`${dev}: на каждом экране «Нового» есть появление 150–450 мс`,!r.bad.length,r.bad);ok(`${dev}: консоль чистая (обычный)`,!r.errs.length,r.errs.slice(0,3));
  // 2. «меньше движения»: появление есть, долгих и бесконечных — нет
  r=await run('rm',base,true,(L,L2)=>{const big=L2.filter(a=>a.n!=='CSSTransition'&&(a.inf||a.d>900));   /* переходы (кольцо цели заполняется 1,2 с) — не «большое движение» */return !L.some(a=>a.d>=100&&a.d<=450)?'нет появления '+JSON.stringify(L.slice(0,6)):big.length?'большое движение '+JSON.stringify(big.slice(0,4)):'';});
  ok(`${dev}: «меньше движения» — появление есть, наездов и бесконечных нет`,!r.bad.length,r.bad);
  // 3. «Анимации» выкл. — ничего не двигается
  r=await run('off',Object.assign({},base,{fx:false}),false,L=>{const live=L.filter(a=>a.d>1);return live.length?'анимации '+JSON.stringify(live.slice(0,4)):'';});
  ok(`${dev}: «Анимации» выкл. — 0 анимаций`,!r.bad.length,r.bad);
  // 4. шторка растёт из точки нажатия: «⚔️ Дуэль» на странице сцены → .sc-sheetwrap, у карточки — анимация с transform от точки
  {const A=await go(base,false),P=A.page;await P.evaluate(()=>renderScene('wolf-of-wall-street'));await P.waitForTimeout(900);
    const res=await P.evaluate(async()=>{const x=innerWidth*.8,y=innerHeight*.3;document.dispatchEvent(new PointerEvent('pointerdown',{clientX:x,clientY:y,bubbles:true}));
      const w=document.createElement('div');w.className='sc-sheetwrap';w.innerHTML='<div class="sc-sheet" style="width:300px;height:200px;background:#fff"></div>';document.body.appendChild(w);
      await new Promise(r=>setTimeout(r,30));const A=w.firstElementChild.getAnimations(),a=A.find(x=>/translate\(/.test(JSON.stringify(x.effect.getKeyframes()[0])));const kf=a&&a.effect.getKeyframes();w.remove();
      return {has:!!a,n:A.length,from:kf&&kf[0].transform,d:a&&a.effect.getTiming().duration};});
    ok(`${dev}: шторка растёт из точки нажатия (пружина ~360 мс)`,res.has&&res.n===1&&/translate\((-?[\d.]+)px, ?(-?[\d.]+)px\) scale/.test(res.from||'')&&res.d>=300&&res.d<=420,res);
    await A.ctx.close();}
  console.log(fails?`ИТОГ anim ${dev}: FAIL ${fails}`:`ИТОГ anim ${dev}: всё PASS`);await b.close();process.exit(fails?1:0);})();
