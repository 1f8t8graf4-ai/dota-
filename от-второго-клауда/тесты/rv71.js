// 13.9.71, ревью П8 п.4: дуэль по сцене — свой вызов со своего аккаунта. node rv71.js ph|pc (стенд воркера stand2.mjs, порт 8788)
// Клиент не узнал себя (в Telegram нет initDataUnsafe.user) и показал «Тебя зовут на дуэль» → «Принять»: сервер не пускает того же игрока
// второй раз и отдаёт комнату без B → тост «с одного аккаунта играть против себя нельзя» и лобби хозяина, а не «я — B». Потом друг заходит — всё как обычно.
const {open,initData}=require('./st');const {chromium}=require('playwright');
const dev=process.argv[2]||'ph';let fails=0;
const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));};
const base={onboarded:true,introV:1,unl:1,gold:300,lvl:'b',tourV:1,scSubChosen:1,autoSc:false,snd:false,fx:false,wtapHint:1,look:'nd',lookV:2};
const vp=dev==='pc'?{width:1440,height:900}:{width:390,height:844};
(async()=>{const b=await chromium.launch();
  const mk=(uid,name)=>open({browser:b,worker:true,uid,name,initData:initData(uid,name),platform:dev==='pc'?'tdesktop':'ios',ctx:{viewport:vp},wait:2300,init:seed,initArg:[base]});
  const A=await mk(731,'Аня'),B=await mk(742,'Боря');const errs=[];[A,B].forEach(P=>P.page.on('pageerror',e=>errs.push(String(e))));
  const code=await A.page.evaluate(async()=>{const s=scOf('wolf-of-wall-street');const r=await kvNet({a:'create',fx:'pick',bg:'',pf:myPub(),room:{sid:s.id,ep:0,mode:'race',bet:0,qs:kvMakeQs(s,0)}});return r.ok?r.v.code:null;});
  ok('комната дуэли по сцене создана',!!code,code);
  await A.page.evaluate(()=>{window.__T=[];new MutationObserver(m=>m.forEach(x=>x.addedNodes.forEach(n=>{if(n.classList&&n.classList.contains('toast'))window.__T.push(n.textContent);}))).observe(document.body,{childList:true});});
  // клиент не узнал себя: на время входа у Telegram «нет» пользователя
  await A.page.evaluate(c=>{window.__u=TG.initDataUnsafe.user;TG.initDataUnsafe.user=null;KV=null;kvJoin(c);},code);await A.page.waitForTimeout(1500);
  const inv=await A.page.evaluate(()=>!!document.querySelector('#kvIn'));
  ok('показано «Тебя зовут на дуэль» с «Принять»',inv);
  await A.page.evaluate(()=>{TG.initDataUnsafe.user=window.__u;});
  if(inv){await A.page.click('#kvIn');await A.page.waitForTimeout(1500);}
  const r=await A.page.evaluate(()=>({role:KV&&KV.role,guest:KV&&KV.guest,B:!!(KV&&KV.room&&KV.room.B),t:(window.__T||[]).join(' | '),cd:!!document.querySelector('.kv-vs,#kvPot')}));
  ok('«Принять» на своей комнате: «против себя нельзя», я — хозяин (A), второго игрока нет, боя нет',r.role==='A'&&!r.guest&&!r.B&&/против себя нельзя/.test(r.t)&&!r.cd,r);
  // друг заходит — как обычно
  await B.page.evaluate(c=>kvJoin(c),code);await B.page.waitForTimeout(1500);
  const binv=await B.page.evaluate(()=>!!document.querySelector('#kvIn'));if(binv)await B.page.click('#kvIn');await B.page.waitForTimeout(1500);
  const rb=await B.page.evaluate(()=>({role:KV&&KV.role,B:!!(KV&&KV.room&&KV.room.B)}));
  ok('друг принял вызов — он B, в комнате двое',binv&&rb.role==='B'&&rb.B,rb);
  ok('консоль чистая',!errs.length,errs.slice(0,3));
  console.log(fails?`FAILS: ${fails}`:'ALL PASS');await b.close();process.exit(fails?1:0);
})().catch(e=>{console.error(e);process.exit(2);});
