// 13.9.67: Versus — повторный вход по своей ссылке посреди боя: продолжает со следующего вопроса, ставка не списывается второй раз. node dvs2.js
const {open,initData}=require('./st');const {chromium}=require('playwright');let fails=0;
const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':JSON.stringify(d));};
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));};
const base={onboarded:true,introV:1,unl:1,gold:300,lvl:'b',snd:false,fx:false,wtapHint:1,look:'nd',lookV:2};
(async()=>{const b=await chromium.launch();
  const mk=(uid,name)=>open({browser:b,worker:true,uid,name,initData:initData(uid,name),wait:2300,init:seed,initArg:[base]});
  const A=await mk(111,'Аня'),B=await mk(222,'Боря');
  await A.page.evaluate(()=>{renderGameScreen('deadlock');dvSheet({bet:0});});await A.page.waitForTimeout(300);await A.page.click('#dvGo');await A.page.waitForTimeout(1200);
  const code=await A.page.evaluate(()=>KV.code);await B.page.evaluate(c=>kvJoin(c),code);await B.page.waitForTimeout(1400);await B.page.click('#dvIn');
  await A.page.waitForSelector('#dvxPan[data-r="0"] .dvx-ask',{timeout:9000});
  // Аня отвечает на первый вопрос, закрывает бой и снова открывает свою ссылку
  const q0=await A.page.evaluate(()=>KV.room.qs[0]);
  if(q0.t==='build'){const used=new Set();for(const w of q0.tk){const k=await A.page.evaluate(([w,u])=>{const b=[...document.querySelectorAll('#scbpool .sc-tile:not([disabled])')].find(x=>x.textContent===w&&!u.includes(x.dataset.k));return b?b.dataset.k:null;},[w,[...used]]);used.add(k);await A.page.click(`#scbpool .sc-tile[data-k="${k}"]`);}await A.page.click('#dvChk');}
  await A.page.waitForTimeout(800);
  await A.page.evaluate(()=>{KV=null;dvClose();});await A.page.waitForTimeout(200);
  await A.page.evaluate(c=>kvJoin(c),code);await A.page.waitForTimeout(1500);
  await A.page.waitForSelector('#dvxPan .dvx-ask',{timeout:9000});
  const r=await A.page.evaluate(()=>({k:KV.k,r:document.querySelector('#dvxPan').dataset.r,t:KV.room.qs[KV.k].t}));
  ok('вернулся по своей ссылке — продолжает со 2-го вопроса',r.k===1&&r.r==='1',r);
  ok('бой без ставки — билеты не тронуты',await A.page.evaluate(()=>store.gold)===300);
  ok('консоль чистая',A.errs.length+B.errs.length===0,A.errs.concat(B.errs).slice(0,4));
  console.log(fails?'FAILS '+fails:'ALL PASS');await b.close();process.exit(fails?1:0);})();
