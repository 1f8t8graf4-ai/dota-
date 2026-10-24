// 13.9.70: Versus по отзыву 24.10. node dv70.js ph|pc (стенд воркера stand2.mjs, порт 8788)
// Шторка: у диалога описание по-русски и число реплик, диалог выбран сам (тот, что меньше играли), после игры — другой.
// Свою ссылку открыл сам — «Это твой вызов», лобби хозяина; клиент не узнал себя, нажал «Принять» — сервер вернул комнату без второго → понятное сообщение, не бой.
// Арена: половины встык (50.5 %), у шва нет тёмной колонны, лицо ближе к внешнему краю. Скрины — shots/dv70-<устройство>-N.png.
const {open,initData}=require('./st');const {chromium}=require('playwright');const fs=require('fs');
const dev=process.argv[2]||'ph';let fails=0;
const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));};
const base={onboarded:true,introV:1,unl:1,gold:300,lvl:'b',tourV:1,scSubChosen:1,autoSc:false,snd:false,fx:true,wtapHint:1,look:'nd',lookV:2};
const vp=dev==='pc'?{width:1440,height:900}:{width:390,height:844};
if(!fs.existsSync(__dirname+'/shots'))fs.mkdirSync(__dirname+'/shots');
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});
  const mk=(uid,name,gold)=>open({browser:b,worker:true,uid,name,initData:initData(uid,name),platform:dev==='pc'?'tdesktop':'ios',ctx:{viewport:vp},wait:2300,init:seed,initArg:[Object.assign({},base,{gold})]});
  const A=await mk(711,'Аня',300),B=await mk(722,'Боря',300);
  const errs=[];[A,B].forEach(P=>P.page.on('pageerror',e=>errs.push(String(e))));
  const shot=async(P,n)=>{await P.waitForTimeout(350);await P.screenshot({path:`${__dirname}/shots/dv70-${dev}-${n}.png`});};
  const toast=P=>P.evaluate(()=>(window.__T||[]).join(' | '));
  const watchT=P=>P.evaluate(()=>{window.__T=[];new MutationObserver(m=>m.forEach(x=>x.addedNodes.forEach(n=>{if(n.classList&&n.classList.contains('toast'))window.__T.push(n.textContent);}))).observe(document.body,{childList:true});});
  // 1. шторка: описание и выбор сам
  await A.page.evaluate(()=>renderGameScreen('deadlock'));await A.page.waitForTimeout(700);
  await A.page.click('#gmRoot .dv-cta');await A.page.waitForTimeout(500);
  let r=await A.page.evaluate(()=>[...document.querySelectorAll('.dv-dlgs button')].map(x=>({on:x.classList.contains('on'),b:(x.querySelector('b')||{}).textContent,s:(x.querySelector('small')||{}).textContent,em:(x.querySelector('em')||{}).textContent})));
  ok('шторка: у каждого диалога — заголовок, описание по-русски (не английская реплика), число реплик',r.length===3&&r.every(x=>x.b&&x.s&&/[а-яё]/i.test(x.s)&&x.s.length>40&&/реплик/.test(x.em||'')),r);
  ok('диалог выбран сам (первый — никто не играл)',r.filter(x=>x.on).length===1&&r[0].on,r.map(x=>x.on));
  const lbl=await A.page.evaluate(()=>[...document.querySelectorAll('.dv-sheet .kv-lbl')].map(x=>x.textContent).join(' / '));
  ok('подпись «выбран сам — можно сменить»',/выбран сам/.test(lbl),lbl);
  await shot(A.page,1);
  await A.page.click('#dvGo');await A.page.waitForTimeout(1300);
  const code=await A.page.evaluate(()=>KV&&KV.code);
  r=await A.page.evaluate(()=>store.dvPlay);
  ok('сыгранный диалог записан (store.dvPlay)',r&&Object.values(r).reduce((a,b)=>a+b,0)===1,r);
  // 2. свою ссылку открыл сам
  await watchT(A.page);
  await A.page.evaluate(c=>{KV=null;dvClose();kvJoin(c);},code);await A.page.waitForTimeout(1600);
  r=await A.page.evaluate(()=>({role:KV&&KV.role,lobby:!!document.querySelector('#dvx .dvx-lob.wt'),inv:!!document.querySelector('#dvIn')}));
  const t1=await toast(A.page);
  ok('свою ссылку открыл сам: «Это твой вызов», лобби хозяина, без «Принять вызов»',r.role==='A'&&r.lobby&&!r.inv&&/твой вызов/.test(t1),{r,t1});
  // клиент не узнал себя (другой id в комнате) → «Принять» → сервер вернул комнату без второго игрока
  await A.page.evaluate(c=>{const R=JSON.parse(JSON.stringify(KV.room));R.A.id='tg-other';KV=null;dvClose();dvJoin(c,R);},code);await A.page.waitForTimeout(500);
  const inv=await A.page.evaluate(()=>!!document.querySelector('#dvIn'));
  if(inv){await A.page.click('#dvIn');await A.page.waitForTimeout(1500);}
  r=await A.page.evaluate(()=>({role:KV&&KV.role,lobby:!!document.querySelector('#dvx .dvx-lob.wt'),cd:!!document.querySelector('#dvN')}));
  const t2=await toast(A.page);
  ok('«Принять» на своей же комнате: сообщение, лобби хозяина, боя нет',inv&&r.role==='A'&&r.lobby&&!r.cd&&/против себя нельзя/.test(t2),{inv,r,t2});
  // 3. друг заходит — бой идёт как обычно
  await B.page.evaluate(c=>kvJoin(c),code);await B.page.waitForTimeout(1500);await B.page.click('#dvIn');
  await Promise.all([A.page.waitForSelector('#dvN',{timeout:8000}),B.page.waitForSelector('#dvN',{timeout:8000})]);
  ok('после этого друг заходит — отсчёт у обоих',true);
  await A.page.waitForSelector('#dvChk,.dvx-o button',{timeout:9000});await A.page.waitForTimeout(900);
  r=await A.page.evaluate(()=>{const W=document.querySelector('#dvxStage').getBoundingClientRect();return [...document.querySelectorAll('#dvxStage .dvx-p')].map(p=>{const pr=p.getBoundingClientRect(),v=p.querySelector('video');let face=null;
    if(v&&v.videoWidth){const vr=v.getBoundingClientRect(),s=Math.max(vr.width/v.videoWidth,vr.height/v.videoHeight),w=Math.min(1,vr.width/(v.videoWidth*s)),x=parseFloat(v.style.objectPosition)/100,f=+v.dataset.fx,left=x*(1-w);face=(f-left)/w;if(p.classList.contains('lf'))face=1-face;}
    return {side:p.dataset.side,w:+(pr.width/W.width).toFixed(3),face:face==null?null:+face.toFixed(2)};});});
  ok('портреты встык: каждый ~50 % ширины',r.every(p=>p.w>0.49&&p.w<0.53),r);
  ok('лицо ближе к внешнему краю: слева < 0.5 окна, справа > 0.5 (или видео ещё грузится)',r.every(p=>p.face==null||(p.side==='lf'?p.face<0.5:p.face>0.5)),r);
  const g=await A.page.evaluate(()=>{const p=document.querySelector('#dvxStage .dvx-p.lf');return getComputedStyle(p,'::after').backgroundImage;});
  ok('у шва лёгкая тень, а не чёрная колонна (градиент с 90 %, до .3)',/90%/.test(g)&&/0\.3\)/.test(g),g.slice(0,140));
  await shot(A.page,2);await shot(B.page,3);
  // 4. новая шторка — уже другой диалог
  await A.page.evaluate(()=>{dvBack&&dvBack();});await A.page.waitForTimeout(600);
  await A.page.evaluate(()=>{KV=null;dvClose();scCloseSheet&&scCloseSheet();renderGameScreen('deadlock');});await A.page.waitForTimeout(700);
  await A.page.click('#gmRoot .dv-cta');await A.page.waitForTimeout(500);
  r=await A.page.evaluate(()=>[...document.querySelectorAll('.dv-dlgs button')].map(x=>({on:x.classList.contains('on'),em:(x.querySelector('em')||{}).textContent})));
  ok('в следующий раз выбран другой диалог, у сыгранного — «играли 1»',!r[0].on&&r.some(x=>x.on)&&/играли 1/.test(r[0].em),r);
  await shot(A.page,4);
  ok('консоль чистая',!errs.length,errs.slice(0,3));
  console.log(fails?`FAILS: ${fails}`:'ALL PASS');await b.close();process.exit(fails?1:0);
})().catch(e=>{console.error(e);process.exit(2);});
