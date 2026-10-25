// 25.10: Versus и дуэль «во весь рост» с новыми петлями героев (venator-2 / rat-king-2), мини-иконки, фразы героя (реплики Z.ai).
// Стенд: сайт 8080 + воркер stand2.mjs (8788). node vs25.js ph|pc → shots/vs25-<устройство>-<экран>.png
const {open,initData}=require('./st');const {chromium}=require('playwright');const fs=require('fs');
const dev=process.argv[2]||'ph';let fails=0;
const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));};
const base={onboarded:true,introV:1,unl:1,gold:300,lvl:'b',tourV:1,scSubChosen:1,autoSc:false,snd:false,fx:true,wtapHint:1,look:'nd',lookV:2};
const vp=dev==='pc'?{width:1440,height:900}:{width:390,height:844};
if(!fs.existsSync(__dirname+'/shots'))fs.mkdirSync(__dirname+'/shots');
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});
  const mk=(uid,name)=>open({browser:b,worker:true,uid,name,initData:initData(uid,name),platform:dev==='pc'?'tdesktop':'ios',ctx:{viewport:vp},wait:2300,init:seed,initArg:[Object.assign({},base)]});
  const A=await mk(111,'Аня'),B=await mk(222,'Боря');
  const shot=async(P,n,w=400)=>{await P.waitForTimeout(w);await P.screenshot({path:`${__dirname}/shots/vs25-${dev}-${n}.png`});};
  const vids=P=>P.evaluate(()=>[...document.querySelectorAll('video')].filter(v=>v.isConnected).map(v=>({src:v.getAttribute('src').split('/').pop(),rs:v.readyState,t:+v.currentTime.toFixed(1),op:v.style.objectPosition})));
  // 1. экран игры: карточки героев с мини-иконками
  await A.page.evaluate(()=>renderGameScreen('deadlock'));await A.page.waitForTimeout(900);
  let r=await A.page.evaluate(()=>({cards:[...document.querySelectorAll('#gmRoot .gm-card')].map(c=>({n:c.querySelector('b').textContent,mini:!!c.querySelector('.gm-mini')})),img:gmHero('venator').img}));
  ok('экран игры: Венатор и Крыса, у карточек мини-иконки, ролики — новые петли',r.cards.length===2&&r.cards.every(c=>c.mini)&&/venator-2/.test(r.img),r);
  await shot(A.page,'1-game');
  await A.page.evaluate(()=>{store.gmView='list';});await A.page.evaluate(()=>{$('#gmRoot').innerHTML=gmHTML();gmBind();});await shot(A.page,'1b-list');
  await A.page.evaluate(()=>{store.gmView='grid';$('#gmRoot').innerHTML=gmHTML();gmBind();});
  // 2. страница героя: диалоги «vs» с мини-иконками + фразы героя
  await A.page.click('#gmRoot [data-h="venator"]');await A.page.waitForTimeout(500);
  r=await A.page.evaluate(()=>({dl:document.querySelectorAll('.gm-dlg').length,vs:document.querySelectorAll('.gm-dlg .gm-vs .gm-mini').length,ph:document.querySelectorAll('.gm-ph').length,voice:document.querySelectorAll('.gm-ph .dd-voice').length,more:(document.querySelector('.gm-phm')||{}).textContent}));
  ok('герой: 3 живых диалога с мини-иконками, 8 фраз с голосом и «Ещё 7»',r.dl===3&&r.vs===6&&r.ph===8&&r.voice===8&&/Ещё 7/.test(r.more||''),r);
  await shot(A.page,'2-hero');
  await A.page.evaluate(()=>document.querySelector('.gm-phr').scrollIntoView({block:'start'}));await shot(A.page,'3-phr');
  await A.page.click('.gm-phm');await A.page.waitForTimeout(300);
  ok('«Ещё» — все 15 фраз',await A.page.evaluate(()=>document.querySelectorAll('.gm-ph').length)===15);
  // 3. дуэль во весь рост — новые ролики, кадр под лицо
  await A.page.evaluate(()=>window.scrollTo(0,0));await A.page.click('.gm-dlg[data-d="0"]');await A.page.waitForTimeout(2500);
  for(let k=0;k<3;k++){await A.page.click('#ddxSub');await A.page.waitForTimeout(450);}
  const dv=await vids(A.page);
  ok('дуэль во весь рост: оба новых ролика играют',dv.length===2&&dv.every(v=>/-2\.mp4/.test(v.src)&&v.rs>=2&&v.t>0),dv);
  await shot(A.page,'4-ddx',1200);
  await A.page.evaluate(()=>ddxClose());await A.page.waitForTimeout(300);
  // 4. Versus: шторка с мини-иконками
  await A.page.click('[data-back]');await A.page.waitForTimeout(300);
  await A.page.click('#gmRoot .dv-cta');await A.page.waitForTimeout(500);
  r=await A.page.evaluate(()=>[...document.querySelectorAll('.dv-sides .dv-ic')].map(x=>x.className+' '+/mini/.test(x.style.backgroundImage)));
  ok('шторка Versus: у героев мини-иконки',r.length===2&&r.every(x=>/mn true/.test(x)),r);
  await shot(A.page,'5-sheet');
  await A.page.click('.kv-bets button[data-b="50"]');await A.page.click('#dvGo');await A.page.waitForTimeout(1400);
  const code=await A.page.evaluate(()=>KV.code);
  await B.page.evaluate(c=>kvJoin(c),code);await B.page.waitForTimeout(1600);await shot(B.page,'6-invite',900);
  await B.page.click('#dvIn');
  await Promise.all([A.page.waitForSelector('#dvN',{timeout:8000}),B.page.waitForSelector('#dvN',{timeout:8000})]);
  await shot(A.page,'7-vs',200);
  await Promise.all([A.page.waitForSelector('#dvxPan .dvx-ask',{timeout:9000}),B.page.waitForSelector('#dvxPan .dvx-ask',{timeout:9000})]);
  await A.page.waitForTimeout(1500);
  const av=await vids(A.page);
  ok('арена: оба новых ролика играют, лицо подогнано',av.length===2&&av.every(v=>/-2\.mp4/.test(v.src)&&v.rs>=2&&v.op),av);
  r=await A.page.evaluate(()=>document.querySelectorAll('#dvxStage .dvx-nm .gm-mini').length);
  ok('арена: у имён героев мини-иконки',r===2,r);
  await shot(A.page,'8-arena');
  async function play(P,plan){for(let k=0;k<3;k++){await P.waitForFunction(kk=>KV&&KV.k===kk&&document.querySelector(`#dvxPan[data-r="${kk}"] .dvx-ask`),k,{timeout:9000});
      const t=await P.evaluate(()=>KV.room.qs[KV.k].t),right=plan[k];
      if(t==='build'){const q=await P.evaluate(()=>KV.room.qs[KV.k]);const order=right?q.tk:[...q.tk].reverse();const used=new Set();
        for(const w of order){const idx=await P.evaluate(([w,used])=>{const b=[...document.querySelectorAll('#scbpool .sc-tile:not([disabled])')].find(x=>x.textContent===w&&!used.includes(x.dataset.k));return b?b.dataset.k:null;},[w,[...used]]);
          if(idx==null)break;used.add(idx);await P.click(`#scbpool .sc-tile[data-k="${idx}"]`);await P.waitForTimeout(60);}
        await P.click('#dvChk');}
      else await P.evaluate(([right])=>{const q=KV.room.qs[KV.k],bs=[...document.querySelectorAll('#dvxPan .dvx-o button')];(bs.find(x=>(x.dataset.v===q.right)===right)||bs[0]).click();},[right]);
      await P.waitForTimeout(300);if(k===1&&plan.tag==='A')await shot(P,'9-hit',350);}}
  const pa=[true,true,true];pa.tag='A';
  await Promise.all([play(A.page,pa),play(B.page,[true,false,true])]);
  await Promise.all([A.page.waitForSelector('#dvx .dvx-end',{timeout:20000}),B.page.waitForSelector('#dvx .dvx-end',{timeout:20000})]);
  await A.page.waitForTimeout(3800);await A.page.evaluate(()=>{const s=document.querySelector('.stl');if(s)s.remove();});await shot(A.page,'10-win');
  await B.page.waitForTimeout(3800);await B.page.evaluate(()=>{const s=document.querySelector('.stl');if(s)s.remove();});await shot(B.page,'11-lose');
  const er=[...A.errs,...B.errs].filter(e=>!/posthog|Failed to load/i.test(e));
  ok('консоль без ошибок',!er.length,er.slice(0,4));
  console.log(fails?`FAIL ${fails}`:'ALL PASS');await b.close();process.exit(fails?1:0);})().catch(e=>{console.error(e);process.exit(1);});
