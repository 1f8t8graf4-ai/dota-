// 13.9.41 — «с душой» (дизайн/вдохновение-2.md): в «Новом» нет эмодзи (тонкие значки .ni), «пыль» на переводах — только где проверяешь себя (13.9.70: повторение; в разборе переводы открыты),
// тест уровня — два круглых значка, «Помнишь, ради чего начал?» в Профиле, флаг ndnew — «Новый» у игрока без «Как было».  node soul.js ph|pc
const {open}=require('./st');const {chromium}=require('playwright');
const dev=process.argv[2]||'ph',pc=dev==='pc';
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
const seed=([st,fl])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify(fl));};
const base={onboarded:true,introV:1,look:'nd',lookV:2,unl:1,snd:false,lvl:'b',cefr:'B1',goalWhy:'work',tourV:1,scSubChosen:1,autoSc:false,wtapHint:1,scPause:'off',fx:true,gold:900,streak:3,lastDay:new Date().toDateString()};
const EMO=`(()=>{const re=/\\p{Extended_Pictographic}/u,keep=/[★☆▶⏸↺↻✓✕✗←→↔↑↓©®™]/;const L=[];const tw=document.createTreeWalker(document.querySelector('#app'),NodeFilter.SHOW_TEXT);let n;
  while((n=tw.nextNode())){const p=n.parentElement;if(!p||p.closest('#dlRoot,.sc-subs,input,textarea,script,style')||!p.offsetParent)continue;for(const ch of n.data){if(re.test(ch)&&!keep.test(ch))L.push(ch);}}return L;})()`;
(async()=>{const b=await chromium.launch();const vp=pc?{width:1440,height:900}:{width:390,height:844};
  const A=await open({browser:b,touch:!pc,uid:876754050,ndDefault:true,ctx:{viewport:vp,colorScheme:'dark'},wait:2600,init:seed,initArg:[base,{admin:true,flags:{}}]}),P=A.page;
  const scr={'Сегодня':()=>renderTab('learn'),'Кино':()=>renderTab('kino'),'Сцена':()=>renderScene('wolf-of-wall-street'),'Профиль':()=>renderTab('profile'),'Настройки':()=>renderSettings(),
    'Коллекция':()=>renderCollection(),'Магазин':()=>renderShop()};
  for(const [n,f] of Object.entries(scr)){await P.evaluate(f);await P.waitForTimeout(900);const r=await P.evaluate(EMO);const ic=await P.evaluate(()=>document.querySelectorAll('#app .ni').length);
    ok(`${n}: ни одного эмодзи, есть тонкие значки`,!r.length&&(n==='Кино'||ic>0),{emoji:r.slice(0,8).join(' '),icons:ic});}
  let r=await P.evaluate(()=>{const w=document.querySelector('.n-why');return w&&w.textContent;});
  await P.evaluate(()=>renderTab('profile'));await P.waitForTimeout(700);
  r=await P.evaluate(()=>({why:(document.querySelector('.n-why')||{}).textContent||'',look:!!document.querySelector('#pfLook')}));
  ok('Профиль: «Помнишь, ради чего начал?» — Для работы; админу есть «Вернуть старый дизайн»',/ради чего/.test(r.why)&&/работы/.test(r.why)&&r.look,r);
  // 13.9.70: разбор — переводы открыты (пыль только там, где проверяешь себя: повторение, «Проверь себя»)
  await P.evaluate(()=>{const s=scOf('wolf-of-wall-street');scP(s.id).w[0]=1;scSave();renderScEp(s.id,0);});await P.waitForTimeout(1600);
  r=await P.evaluate(()=>({n:document.querySelectorAll('.rv2 .n-sp').length,tr:[...document.querySelectorAll('.rv2 .rv-c .rv-t span')].map(x=>x.textContent).filter(Boolean).length}));
  ok('разбор: переводы видны сразу, без «пыли»',r.n===0&&r.tr>=3,r);
  // повторение: перевод под пылью, тап — видно
  await P.evaluate(()=>{const s=scOf('wolf-of-wall-street'),P0=scP(s.id),f=scAct(s.parts[0].ph)[0];P0.done[0]=1;P0.r[f.id]=[1,Date.now()-1000];scSave();renderDaily();});await P.waitForTimeout(1400);
  r=await P.evaluate(()=>{const sp=document.querySelector('.n-rcard .n-sp');return sp&&{op:getComputedStyle(sp.querySelector('.n-spt')).opacity};});
  ok('повторение: перевод под «пылью» (текст скрыт)',r&&r.op==='0',r);
  await P.click('.n-rcard .n-sp');await P.waitForTimeout(700);
  r=await P.evaluate(()=>{const sp=document.querySelector('.n-rcard .n-sp');return {open:sp.classList.contains('open'),op:getComputedStyle(sp.querySelector('.n-spt')).opacity,pop:!!document.querySelector('.kw-pop.on,.sc-wpop')};});
  ok('тап по пыли — перевод виден, больше ничего не открылось',r.open&&r.op==='1'&&!r.pop,r);
  // тест уровня: два круглых значка
  await P.evaluate(()=>{ONB=null;renderOnb(1);});await P.waitForTimeout(800);await P.click('#onbGo');await P.waitForTimeout(900);
  r=await P.evaluate(()=>{const y=document.querySelector('#onbYes'),n=document.querySelector('#onbNo'),q=y.getBoundingClientRect();return {w:Math.round(q.width),h:Math.round(q.height),ni:!!y.querySelector('.ni')&&!!n.querySelector('.ni'),hint:(document.querySelector('.n-ynh')||{}).textContent};});
  ok('тест уровня: «знаю / учу» — круглые значки, не кнопки-меню',r.w<=72&&Math.abs(r.w-r.h)<2&&r.ni,r);
  await P.click('#onbYes');await P.waitForTimeout(700);r=await P.evaluate(()=>ONB.lt.i);ok('значок «знаю» работает',r===1,r);
  ok('консоль чистая (админ)',!A.errs.length,A.errs.slice(0,3).join(' | '));
  // игрок: без флага — «Как было», с флагом ndnew — «Новый», без «Вернуть старый дизайн»
  const pl={...base};delete pl.look;delete pl.lookV;
  const B=await open({browser:b,touch:!pc,uid:111222333,ctx:{viewport:vp,colorScheme:'dark'},wait:2600,init:seed,initArg:[pl,{admin:false,flags:{}}]});
  r=await B.page.evaluate(()=>({nd:ndOn(),look:document.body.dataset.look||''}));ok('игрок без флага — «Как было»',!r.nd&&!r.look,r);
  const C=await open({browser:b,touch:!pc,uid:111222334,ctx:{viewport:vp,colorScheme:'dark'},wait:2600,init:seed,initArg:[pl,{admin:false,flags:{ndnew:'on'}}]});
  await C.page.evaluate(()=>{FLAGS.ndnew='on';renderTab('profile');});await C.page.waitForTimeout(900);
  r=await C.page.evaluate(()=>({nd:ndOn(),look:document.body.dataset.look||'',old:!!document.querySelector('#pfLook'),why:!!document.querySelector('.n-why')}));
  ok('игрок с флагом ndnew — «Новый», «Вернуть старый дизайн» нет',r.nd&&r.look==='nd'&&!r.old&&r.why,r);
  ok('консоль чистая (игроки)',!B.errs.length&&!C.errs.length,[...B.errs,...C.errs].slice(0,3).join(' | '));
  await b.close();console.log(fails?`ИТОГ ${dev}: ${fails} FAIL`:`ИТОГ ${dev}: всё PASS`);process.exit(fails?1:0);})();
