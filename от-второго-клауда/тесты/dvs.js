// 13.9.67: Versus с другом по Deadlock — два игрока на стенде воркера (stand2.mjs, порт 8788). node dvs.js ph|pc
// Экран игры → «⚔️ Versus с другом» → шторка (сторона, диалог, ставка) → комната → друг по коду → отсчёт → 3 раунда (собери · что значит · на слух)
// → урон по полоскам → итог: K.O., банк ×2 победителю / −ставка проигравшему, таблица раундов, «Реванш» открывает шторку с тем же диалогом.
// Ещё: ничья — ставка вернулась; друг вышел посреди боя — победа; вышел до начала — бой отменён; «назад» закрывает арену; ничего не вылезает вбок; консоль чистая.
// Скрины — shots/dvs-<устройство>-N.png.
const {open,initData}=require('./st');const {chromium}=require('playwright');const fs=require('fs');
const dev=process.argv[2]||'ph';let fails=0;
const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));};
const base={onboarded:true,introV:1,unl:1,gold:300,lvl:'b',tourV:1,scSubChosen:1,autoSc:false,snd:false,fx:true,wtapHint:1,look:'nd',lookV:2};
const vp=dev==='pc'?{width:1440,height:900}:{width:390,height:844};
if(!fs.existsSync(__dirname+'/shots'))fs.mkdirSync(__dirname+'/shots');
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});
  const mk=(uid,name,gold)=>open({browser:b,worker:true,uid,name,initData:initData(uid,name),platform:dev==='pc'?'tdesktop':'ios',ctx:{viewport:vp},wait:2300,init:seed,initArg:[Object.assign({},base,{gold})]});
  let A=await mk(111,'Аня',300),B=await mk(222,'Боря',300);
  const shot=async(P,n)=>{await P.waitForTimeout(350);await P.screenshot({path:`${__dirname}/shots/dvs-${dev}-${n}.png`});};
  const wide=P=>P.evaluate(()=>{const W=innerWidth,bad=[];document.querySelectorAll('#dvx *').forEach(e=>{const r=e.getBoundingClientRect();if(r.width&&(r.right>W+1||r.left<-1)&&!e.closest('.dvx-p'))bad.push(e.className||e.tagName);});return bad.slice(0,5);});
  // 1. вход с экрана игры
  await A.page.evaluate(()=>renderGameScreen('deadlock'));await A.page.waitForTimeout(700);
  let r=await A.page.evaluate(()=>({cta:!!document.querySelector('#gmRoot .dv-cta'),dl:dvDialogs().length}));
  ok('на экране Deadlock есть кнопка «Versus с другом»',r.cta&&r.dl>=1,r);
  await A.page.click('#gmRoot .dv-cta');await A.page.waitForTimeout(500);
  r=await A.page.evaluate(()=>({sides:[...document.querySelectorAll('.dv-sides button')].map(x=>x.querySelector('b').textContent),dlgs:document.querySelectorAll('.dv-dlgs button').length,bets:[...document.querySelectorAll('.kv-bets button')].map(x=>x.dataset.b)}));
  ok('шторка: два героя, живые диалоги, ставки',r.sides.length===2&&r.dlgs===3&&r.bets.includes('50'),r);
  await shot(A.page,1);
  // герои-строки: на телефоне шторка не вылезает
  await A.page.click('.dv-sides button[data-side="1"]');await A.page.click('.kv-bets button[data-b="50"]');await A.page.waitForTimeout(200);
  const meHero=await A.page.evaluate(()=>document.querySelector('.dv-sides button.on b').textContent);
  await A.page.click('#dvGo');await A.page.waitForTimeout(1300);
  r=await A.page.evaluate(()=>({code:KV&&KV.code,dd:KV&&KV.dd,sid:KV&&KV.room.sid,n:KV&&KV.room.qs.length,ts:KV&&KV.room.qs.map(q=>q.t),hs:KV&&KV.room.qs[0].hs,lobby:!!document.querySelector('#dvx .dvx-lob.wt'),kv:!!document.querySelector('#dvx .kv')}));
  ok('комната создана: sid dd:, 3 вопроса — собери, что значит, на слух',r.code&&r.dd&&/^dd:deadlock:/.test(r.sid)&&r.n===3&&r.ts.join()==='build,mean,hear',r);
  ok('создатель играет за выбранного героя, лобби «Ждём друга»',r.hs&&r.hs[0]===meHero&&r.lobby&&r.kv,{meHero,hs:r.hs});
  const qs=await A.page.evaluate(()=>KV.room.qs);
  const q1=qs[0],q2=qs[1],q3=qs[2];
  ok('собери: кубики = слова реплики + 2 лишних, до 7 слов',q1.tk.length>=2&&q1.tk.length<=7&&q1.pool.length===q1.tk.length+2,{tk:q1.tk,pool:q1.pool});
  ok('что значит: 3 разных варианта, верный среди них, без скобок и «;»',q2.opts.length===3&&new Set(q2.opts).size===3&&q2.opts.includes(q2.right)&&q2.opts.every(o=>!/[;()]/.test(o)),{w:q2.w,opts:q2.opts});
  ok('на слух: 3 варианта, верный — реплика с голосом',q3.opts.length===3&&new Set(q3.opts).size===3&&q3.opts.includes(q3.right)&&!!q3.a,{en:q3.en,opts:q3.opts});
  await shot(A.page,2);
  // 2. друг по коду
  await B.page.evaluate(c=>kvJoin(c),r.code);await B.page.waitForTimeout(1500);
  r=await B.page.evaluate(()=>({inv:!!document.querySelector('#dvIn'),txt:(document.querySelector('#dvxPan')||{}).textContent||'',L:(document.querySelector('#dvxStage .dvx-p.lf b')||{}).textContent,R:(document.querySelector('#dvxStage .dvx-p.rt b')||{}).textContent,game:!!document.querySelector('#gmRoot')}));
  ok('друг: приглашение со ставкой, свой герой слева, герой Ани справа, под окном — экран игры',r.inv&&/Аня зовёт/.test(r.txt)&&/50/.test(r.txt)&&r.R===meHero&&r.L&&r.L!==meHero&&r.game,r);
  await shot(B.page,3);
  await B.page.click('#dvIn');
  await Promise.all([A.page.waitForSelector('#dvN',{timeout:8000}),B.page.waitForSelector('#dvN',{timeout:8000})]);
  r=await A.page.evaluate(()=>({gold:store.gold,vs:document.querySelector('#dvxStage').classList.contains('vs')}));
  ok('отсчёт у обоих, ставка списана на старте',r.gold===250,r);
  await shot(A.page,4);
  await Promise.all([A.page.waitForSelector('#dvxPan .dvx-ask',{timeout:8000}),B.page.waitForSelector('#dvxPan .dvx-ask',{timeout:8000})]);
  // 3. раунды: Аня всё верно, Боря — ошибается в «что значит»
  async function play(P,plan,tag){const log=[];for(let k=0;k<3;k++){await P.waitForFunction(kk=>KV&&KV.k===kk&&document.querySelector(`#dvxPan[data-r="${kk}"] .dvx-ask`),k,{timeout:9000});
      const t=await P.evaluate(()=>KV.room.qs[KV.k].t);const right=plan[k];
      if(t==='build'){const q=await P.evaluate(()=>KV.room.qs[KV.k]);
        if(k===0&&tag==='A'){await shot(P,5);}
        const order=right?q.tk:[...q.tk].reverse();const used=new Set();
        for(const w of order){const idx=await P.evaluate(([w,used])=>{const bs=[...document.querySelectorAll('#scbpool .sc-tile:not([disabled])')];const b=bs.find(x=>x.textContent===w&&!used.includes(x.dataset.k));return b?b.dataset.k:null;},[w,[...used]]);
          if(idx==null)break;used.add(idx);await P.click(`#scbpool .sc-tile[data-k="${idx}"]`);await P.waitForTimeout(60);}
        const dis=await P.evaluate(()=>document.querySelector('#dvChk').disabled);if(dis)log.push('chk-disabled');
        await P.click('#dvChk');}
      else{const q=await P.evaluate(()=>KV.room.qs[KV.k]);if(t==='hear'&&tag==='A')await shot(P,7);if(t==='mean'&&tag==='A')await shot(P,6);
        await P.evaluate(([right])=>{const q=KV.room.qs[KV.k],bs=[...document.querySelectorAll('#dvxPan .dvx-o button')];const b=bs.find(x=>(x.dataset.v===q.right)===right)||bs[0];b.click();},[right]);}
      await P.waitForTimeout(250);log.push(t+':'+(await P.evaluate(()=>((document.querySelector('#dvFb b')||{}).textContent||''))));}
    return log;}
  const [la,lb]=await Promise.all([play(A.page,[true,true,true],'A'),play(B.page,[true,false,true],'B')]);
  ok('Аня: 3 ответа, все верно',la.length===3&&la.every(x=>/Верно/.test(x)),la);
  ok('Боря: ошибка во втором раунде засчитана',/Мимо/.test(lb[1])&&/Верно/.test(lb[0]),lb);
  await Promise.all([A.page.waitForSelector('#dvx .dvx-end',{timeout:20000}),B.page.waitForSelector('#dvx .dvx-end',{timeout:20000})]);
  await A.page.waitForTimeout(400);
  const ea=await A.page.evaluate(()=>({gold:store.gold,title:document.querySelector('.dvx-end>b').textContent,ko:!!document.querySelector('#dvxStage .dvx-p.rt.ko'),rows:document.querySelectorAll('.dvx-end .kv-tbl tbody tr').length,hpR:document.querySelector('#dvHpR').style.transform,hpL:document.querySelector('#dvHpL').style.transform}));
  ok('Аня победила: банк ×2 сразу (300−50+100), K.O. у соперника, таблица из 3 раундов',ea.gold===350&&/Победа/.test(ea.title)&&ea.ko&&ea.rows===3,ea);
  ok('полоски: у проигравшего здоровья меньше',parseFloat(ea.hpR.replace(/[^\d.]/g,''))<parseFloat(ea.hpL.replace(/[^\d.]/g,'')),ea);
  await shot(A.page,8);
  const eb=await B.page.evaluate(()=>({gold:store.gold,title:document.querySelector('.dvx-end>b').textContent,ko:!!document.querySelector('#dvxStage .dvx-p.lf.ko')}));
  ok('Боря проиграл: −50, K.O. на своём герое, текст без рода',eb.gold===250&&/Побеждает Аня — больше верных/.test(eb.title)&&eb.ko,eb);
  await B.page.waitForTimeout(3500);await shot(B.page,9);
  ok('после анимации кражи банк не задвоился',await A.page.evaluate(()=>store.gold)===350);
  // 4. реванш
  await A.page.waitForTimeout(3500);
  await A.page.evaluate(()=>{const s=document.querySelector('.stl');if(s)s.remove();});
  await A.page.click('#dvAgain');await A.page.waitForTimeout(600);
  r=await A.page.evaluate(()=>({sheet:!!document.querySelector('.dv-sheet'),arena:!!document.getElementById('dvx'),side:(document.querySelector('.dv-sides button.on b')||{}).textContent,bet:(document.querySelector('.kv-bets button.on')||{}).dataset}));
  ok('«Реванш»: арена закрыта, шторка с тем же героем и ставкой',r.sheet&&!r.arena&&r.side===meHero&&r.bet&&r.bet.b==='50',r);
  await A.page.evaluate(()=>onBack());await A.page.waitForTimeout(300);
  ok('«назад» закрывает шторку',await A.page.evaluate(()=>!document.querySelector('.dv-sheet')&&!!document.querySelector('#gmRoot')));
  // 5. ничья: оба всё верно с одинаковым временем не выйдет — проверяем возврат ставки через «без ответов»: оба мимо
  await A.page.evaluate(()=>dvSheet({bet:25}));await A.page.waitForTimeout(300);await A.page.click('#dvGo');await A.page.waitForTimeout(1200);
  let code=await A.page.evaluate(()=>KV.code);await B.page.evaluate(c=>{if(window.KV)KV=null;dvClose();kvJoin(c);},code);await B.page.waitForTimeout(1400);await B.page.click('#dvIn');
  await Promise.all([A.page.waitForSelector('#dvxPan .dvx-ask',{timeout:9000}),B.page.waitForSelector('#dvxPan .dvx-ask',{timeout:9000})]);
  const g0=await Promise.all([A.page.evaluate(()=>store.gold),B.page.evaluate(()=>store.gold)]);
  await Promise.all([play(A.page,[false,false,false],'A2'),play(B.page,[false,false,false],'B2')]);
  await Promise.all([A.page.waitForSelector('#dvx .dvx-end',{timeout:20000}),B.page.waitForSelector('#dvx .dvx-end',{timeout:20000})]);await A.page.waitForTimeout(400);
  const d=await Promise.all([A.page.evaluate(()=>({g:store.gold,t:document.querySelector('.dvx-end>b').textContent,ko:document.querySelectorAll('.dvx-p.ko').length})),B.page.evaluate(()=>store.gold)]);
  ok('ничья (0:0): ставка вернулась обоим, K.O. нет',d[0].g===g0[0]+25&&d[1]===g0[1]+25&&/Ничья/.test(d[0].t)&&d[0].ko===0,{g0,d});
  // 6. друг вышел посреди боя — победа
  await A.page.evaluate(()=>{KV=null;dvClose();dvSheet({bet:0});});await A.page.waitForTimeout(300);await A.page.click('#dvGo');await A.page.waitForTimeout(1200);
  code=await A.page.evaluate(()=>KV.code);await B.page.evaluate(c=>{KV=null;dvClose();kvJoin(c);},code);await B.page.waitForTimeout(1400);await B.page.click('#dvIn');
  await Promise.all([A.page.waitForSelector('#dvxPan .dvx-ask',{timeout:9000}),B.page.waitForSelector('#dvxPan .dvx-ask',{timeout:9000})]);
  await B.page.evaluate(()=>onBack());await B.page.waitForTimeout(300);
  ok('«назад» в бою: арена закрыта, под ней экран игры',await B.page.evaluate(()=>!document.getElementById('dvx')&&!!document.querySelector('#gmRoot')&&KV===null));
  await A.page.waitForSelector('#dvx .dvx-end',{timeout:9000});
  ok('у Ани — победа: «Боря больше нет в бою»',await A.page.evaluate(()=>/больше нет в бою/.test(document.querySelector('.dvx-end>b').textContent)));
  // 7. вышел до начала — бой отменён
  await A.page.evaluate(()=>{KV=null;dvClose();dvSheet({bet:25});});await A.page.waitForTimeout(300);await A.page.click('#dvGo');await A.page.waitForTimeout(1000);
  code=await A.page.evaluate(()=>KV.code);const ga=await A.page.evaluate(()=>store.gold);await A.page.evaluate(()=>onBack());await A.page.waitForTimeout(600);
  await B.page.evaluate(c=>{KV=null;dvClose();kvJoin(c);},code);await B.page.waitForTimeout(1500);
  r=await B.page.evaluate(()=>({arena:!!document.getElementById('dvx'),toast:[...document.querySelectorAll('.toast')].map(t=>t.textContent).join('|')}));
  ok('хозяин закрыл комнату до начала — другу «Бой отменён», ставка у хозяина цела',!r.arena&&/отмен/.test(r.toast)&&await A.page.evaluate(()=>store.gold)===ga,r);
  // 8. вёрстка и консоль
  await A.page.evaluate(()=>{KV=null;dvClose();dvSheet({bet:0});});await A.page.waitForTimeout(300);await A.page.click('#dvGo');await A.page.waitForTimeout(1200);
  ok('ничего не вылезает вбок (лобби)',(await wide(A.page)).length===0,await wide(A.page));
  await A.page.evaluate(()=>onBack());await A.page.waitForTimeout(300);
  ok('консоль чистая',A.errs.length+B.errs.length===0,A.errs.concat(B.errs).slice(0,6).join('\n'));
  console.log(fails?`FAILS: ${fails}`:'ALL PASS');await b.close();process.exit(fails?1:0);})();
