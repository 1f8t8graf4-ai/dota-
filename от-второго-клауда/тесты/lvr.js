// 13.9.72 (П10b): живой уровень — растёт и падает по ответам, как рейтинг. node lvr.js ph|pc
// Модель: старт — середина уровня; трудная фраза верно — вверх, лёгкая с ошибкой — вниз, лёгкая верно — почти ничего; без уровня — не считается.
// Видимый уровень меняется только за границей +0.08 и не чаще раза в 6 ответов: вырос — плашка «Твой уровень вырос: …», упал — тихо.
// Хуки: проверка эпизода, повторение, «Мои слова» (ответ с первой попытки — один вызов на задание), Versus (в коде dvAns).
// Профиль: «Твой уровень» словом, 5 полосок, «До «…» — N %», тап — как считается. Тест уровня — уровень заново.
const {open}=require('./st');const {chromium}=require('playwright');const fs=require('fs');
const dev=process.argv[2]||'ph',PC=dev==='pc';
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
const init=([st])=>{if(!sessionStorage.getItem('__seeded')){sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify({admin:true,flags:{}}));}};
const base={onboarded:true,introV:1,gold:900,lvl:'b',cefr:'B1',goalWhy:'work',tourV:1,scSubChosen:1,autoSc:false,snd:false,fx:false,look:'nd',lookV:2,unl:1,wtapHint:1};
const VP=PC?{width:1280,height:800}:{width:390,height:844};
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});if(!fs.existsSync(__dirname+'/shots'))fs.mkdirSync(__dirname+'/shots');
  const {page:P,errs}=await open({browser:b,uid:876754050,name:'Андрей',platform:PC?'tdesktop':'ios',touch:!PC,ndDefault:true,ctx:{viewport:VP,colorScheme:'light'},wait:2500,init,initArg:[base]});
  const shot=n=>P.screenshot({path:`${__dirname}/shots/lvr-${dev}-${n}.png`});
  await P.evaluate(async()=>{await wlvLoad();window.__T=[];new MutationObserver(m=>m.forEach(x=>x.addedNodes.forEach(n=>{if(n.classList&&n.classList.contains('toast'))window.__T.push(n.textContent);}))).observe(document.body,{childList:true});});
  // 1. модель
  let r=await P.evaluate(()=>{delete store.lvR;store.lvN=0;store.lvCh=0;const s0=lvR();
    store.lvR=3.5;lvRate(true,5,'mean');const up=store.lvR;store.lvR=3.5;lvRate(false,1,'mean');const dn=store.lvR;store.lvR=3.5;lvRate(true,1,'mean');const easy=store.lvR;
    store.lvR=3.5;const n0=store.lvN;lvRate(true,0,'mean');const none=[store.lvR,store.lvN-n0];
    store.lvR=3.5;lvRate(true,3,'listen');const lis=store.lvR;store.lvR=3.5;lvRate(true,3,'mean');const mean=store.lvR;
    return {s0,up,dn,easy,none,lis,mean};});
  ok('старт — середина уровня (Средний → 3.5)',r.s0===3.5,r.s0);
  ok('трудная фраза верно — вверх, лёгкая с ошибкой — вниз сильнее, лёгкая верно — почти ничего',r.up>3.53&&r.dn<3.42&&Math.abs(r.easy-3.5)<0.01,r);
  ok('у фразы без уровня — не считается',r.none[0]===3.5&&r.none[1]===0,r.none);
  ok('на слух труднее: верно «на слух» поднимает больше, чем «что значит»',r.lis>r.mean,{lis:r.lis,mean:r.mean});
  // 2. подъём с плашкой, без мигания назад
  r=await P.evaluate(()=>{window.__T=[];store.cefr='B1';store.lvR=3.97;store.lvN=40;store.lvCh=0;const tr=[];let k=0;
    while(store.cefr==='B1'&&k<40){lvRate(true,5,'mean');tr.push(store.lvR);k++;}
    const at=store.lvR,c1=store.cefr;for(let j=0;j<3;j++)lvRate(false,1,'mean');const back=[store.lvR,store.cefr];return {k,at,c1,back};});
  ok('вырос: «Средний» → «Выше среднего», когда ушёл за 4.08',r.c1==='B2'&&r.at>=4.08,r);
  ok('сразу после смены пара ошибок назад не роняет (≥ 6 ответов и −0.08)',r.back[1]==='B2',r.back);
  await P.waitForTimeout(1700);
  let t=await P.evaluate(()=>window.__T.join(' | '));
  ok('плашка «Твой уровень вырос: Выше среднего»',/Твой уровень вырос: Выше среднего/.test(t),t);
  // 3. спуск — тихо
  r=await P.evaluate(()=>{window.__T=[];store.cefr='B1';store.lvR=3.02;store.lvN=40;store.lvCh=0;let k=0;while(store.cefr==='B1'&&k<40){lvRate(false,1,'mean');k++;}return {c:store.cefr,lv:store.lvR,k};});
  await P.waitForTimeout(1700);t=await P.evaluate(()=>window.__T.join(' | '));
  ok('упал: «Средний» → «Базовый» за 2.92, без плашки',r.c==='A2'&&r.lv<2.92&&!/уровень/i.test(t),{r,t});
  // 4. хуки — один вызов на задание
  await P.evaluate(()=>{store.cefr='B1';store.lvR=3.5;store.lvN=0;store.lvCh=0;save();window.__LV=[];const f0=window.lvRate;window.lvRate=function(g,d,tp){window.__LV.push([!!g,d,tp]);return f0.apply(this,arguments);};});
  // 4а. проверка эпизода: отвечаю на первое задание как получится
  await P.evaluate(()=>{const s=scOf('wolf-of-wall-street'),Q=scP(s.id);Q.w=Q.w||{};Q.w[0]=1;scSave();renderScQuiz('wolf-of-wall-street',0);});await P.waitForTimeout(1500);
  const answerOne=async()=>{for(let k=0;k<14;k++){const st=await P.evaluate(()=>({opt:document.querySelectorAll('.sc-opt:not([disabled])').length,pool:document.querySelectorAll('#scbpool .sc-tile:not(.used)').length,chk:(()=>{const c=document.getElementById('scbchk');return c&&!c.hidden&&!c.disabled;})(),fb:!!document.querySelector('#scfb .sc-fb,#scfb .sc-sheet,.sc-sheet .sc-fb')||!!document.querySelector('#scnx')}));
      if(st.opt){await P.evaluate(()=>document.querySelector('.sc-opt:not([disabled])').click());return true;}
      if(st.chk){await P.evaluate(()=>document.getElementById('scbchk').click());await P.waitForTimeout(600);const again=await P.evaluate(()=>{const c=document.getElementById('scbchk');return !!(c&&!c.hidden&&document.querySelector('#scbpool .sc-tile:not(.used)'));});if(!again)return true;continue;}
      if(st.pool){await P.evaluate(()=>document.querySelector('#scbpool .sc-tile:not(.used)').click());await P.waitForTimeout(80);continue;}
      await P.waitForTimeout(300);}return false;};
  let did=await answerOne();await P.waitForTimeout(900);
  r=await P.evaluate(()=>window.__LV.slice());
  ok('проверка эпизода: ответил — один вызов, трудность по самому редкому слову',did&&r.length===1&&r[0][1]>=1&&r[0][1]<=5,{did,r});
  // 4б. повторение на сегодня: одно моё слово
  await P.evaluate(()=>{window.__LV=[];const now=Date.now(),s=scOf('wolf-of-wall-street'),row=s.subs.find(z=>/clients/i.test(z[2]));SCENES.forEach(x=>{const Q=scP(x.id);Q.r={};});scSave();
    store.myw={'wolf-of-wall-street|clients':{k:'wolf-of-wall-street|clients',w:'clients',ru:'клиенты',de:'',sid:'wolf-of-wall-street',pi:0,line:row?row[2]:'',lineRu:row?row[3]:'',a:row?row[0]:21,at:now,lvl:0,st:1,due:now-1000,tags:[]}};save();renderDaily();});
  await P.waitForTimeout(1600);
  const hasOpt=await P.evaluate(()=>document.querySelectorAll('.sc-opt').length);
  if(hasOpt)await P.evaluate(()=>document.querySelector('.sc-opt').click());await P.waitForTimeout(600);
  r=await P.evaluate(()=>window.__LV.slice());
  ok('повторение: слово «clients» — один вызов, «Средний» (B1 = 3), вид «что значит»',hasOpt&&r.length===1&&r[0][1]===3&&r[0][2]==='mean',{hasOpt,r});
  // 4в. «Мои слова»
  await P.evaluate(()=>{window.__LV=[];renderMyWordsQuiz(mywAll());});await P.waitForTimeout(1600);
  const hasO2=await P.evaluate(()=>document.querySelectorAll('.sc-opt').length);
  if(hasO2)await P.evaluate(()=>document.querySelector('.sc-opt').click());await P.waitForTimeout(500);
  r=await P.evaluate(()=>window.__LV.slice());
  ok('«Мои слова»: один вызов на ответ',hasO2&&r.length===1&&r[0][1]===3,{hasO2,r});
  r=await P.evaluate(()=>/lvRate\(ok,wlvText\(/.test(String(dvAns))&&/lvRate\(right&&!q\.soft/.test(String(renderScQuiz)));
  ok('Versus: мой ответ двигает уровень (dvAns → lvRate)',r);
  // 5. Профиль
  await P.evaluate(()=>{store.cefr='B1';store.lvR=3.4;save();renderTab('profile');});await P.waitForTimeout(1200);
  r=await P.evaluate(()=>{const e=document.querySelector('#pfLv');if(!e)return null;return {w:(e.querySelector('.n-lvr-h b')||{}).textContent,bars:e.querySelectorAll('.lvb>i').length,on:e.querySelectorAll('.lvb>i.on').length,s:(e.querySelector('.n-lvr-s')||{}).textContent,
    x:getComputedStyle(e.querySelector('.n-lvr-x')).display,bar:(e.querySelector('.n-lvr-bar i')||{}).style.width,wide:document.documentElement.scrollWidth>innerWidth+1};});
  ok('Профиль: «Твой уровень — Средний», 5 полосок (3 закрашены), «До уровня «Выше среднего» — 40 %», пояснение свёрнуто',r&&r.w==='Средний'&&r.bars===5&&r.on===3&&/До уровня «Выше среднего» — 40 %/.test(r.s)&&r.x==='none'&&r.bar==='40%'&&!r.wide,r);
  await P.evaluate(()=>document.querySelector('#pfLv').scrollIntoView({block:'center'}));await P.waitForTimeout(300);await shot('profile');
  await P.click('#pfLv');await P.waitForTimeout(300);
  r=await P.evaluate(()=>{const e=document.querySelector('#pfLv');return {x:getComputedStyle(e.querySelector('.n-lvr-x')).display,a:e.getAttribute('aria-expanded'),t:e.querySelector('.n-lvr-x').textContent};});
  ok('тап — как считается (ответы с первой попытки, тест заново)',r.x==='block'&&r.a==='true'&&/первой попытки/.test(r.t),r);await shot('profile-open');
  r=await P.evaluate(()=>{store.cefr='C1';store.lvR=5.6;renderTab('profile');const e=document.querySelector('#pfLv');return (e.querySelector('.n-lvr-s')||{}).textContent;});
  ok('Продвинутый: «Высший уровень — держи его ответами»',/Высший уровень/.test(r),r);
  // тёмная тема — скрин
  await P.evaluate(()=>{store.cefr='B2';store.lvR=4.72;Telegram.WebApp.colorScheme='dark';renderTab('profile');});await P.waitForTimeout(800);
  await P.evaluate(()=>document.querySelector('#pfLv').scrollIntoView({block:'center'}));await P.waitForTimeout(300);await shot('profile-dark');
  // 6. тест уровня — уровень заново
  r=await P.evaluate(()=>{store.lvR=5.2;store.lvN=77;store.lvCh=70;ONB={lang:'en',cefr:'A2',goal:'work',min:10,daily:true};onbFinish();return [store.cefr,store.lvR,store.lvN,store.lvCh];});
  ok('после теста уровня — заново: «Базовый», 2.5, счётчики с нуля',r[0]==='A2'&&r[1]===2.5&&r[2]===0&&r[3]===0,r);
  ok('консоль чистая',!errs.length,errs.slice(0,3));
  console.log(fails?`FAILS: ${fails}`:'ALL PASS');await b.close();process.exit(fails?1:0);
})().catch(e=>{console.error(e);process.exit(2);});
