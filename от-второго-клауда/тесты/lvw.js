// 13.9.71 (П10, Андрей: «лучше писать „начинающий“ и прочее, буквы — колхоз»): уровень игроку — словами, где мало места — полоски.
// «Сегодня» (строка под приветствием и чип плана), «Кино» (фильтр словами, уголок постера — полоски), сцена и сериал (чип словом),
// словарь (метка у строки — полоски, слово в подсказке), окошко слова и «Ещё в кино», повторение (чип), первый запуск:
// «Проверь себя», итог (слово крупно + «уточним по твоим ответам»), «выбрать самому» (полоски + слово), «Настраиваем».
// На каждом экране в видимом тексте нет букв A1…C1. Скрины — shots/lvw-<устройство>-<экран>.png.  node lvw.js ph|pc
const {open}=require('./st');const {chromium}=require('playwright');const fs=require('fs');
const dev=process.argv[2]||'ph',PC=dev==='pc';
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
const init=([st])=>{if(!sessionStorage.getItem('__seeded')){sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify({admin:true,flags:{}}));}};
const base={onboarded:true,introV:1,gold:900,lvl:'b',cefr:'B2',goalWhy:'work',tourV:1,scSubChosen:1,snd:false,fx:false,look:'nd',lookV:2,unl:1,wtapHint:1};
const VP=PC?{width:1280,height:800}:{width:390,height:844};
const W=['Начинающий','Базовый','Средний','Выше среднего','Продвинутый'];
(async()=>{const b=await chromium.launch();if(!fs.existsSync(__dirname+'/shots'))fs.mkdirSync(__dirname+'/shots');
  const {page:P,errs}=await open({browser:b,uid:876754050,name:'Андрей',platform:PC?'tdesktop':'ios',touch:!PC,ndDefault:true,ctx:{viewport:VP,colorScheme:'light'},wait:2500,init,initArg:[base]});
  const shot=n=>P.screenshot({path:`${__dirname}/shots/lvw-${dev}-${n}.png`});
  const letters=()=>P.evaluate(()=>{const t=(document.querySelector('#app')||document.body).innerText||'';const m=t.match(/(^|[^A-Za-z0-9])(A1|A2|B1|B2|C1)(?![A-Za-z0-9])/g);return m?m.map(x=>x.trim()):[];});
  const wide=()=>P.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1||document.body.scrollWidth>innerWidth+1);
  // 1. «Сегодня»
  await P.evaluate(()=>renderTab('learn'));await P.waitForTimeout(900);
  let r=await P.evaluate(()=>({sub:(document.querySelector('.n-hello span')||{}).textContent,chip:(document.querySelector('.n-hero .n-chip')||{}).textContent}));
  ok('«Сегодня»: под приветствием «Выше среднего · цель — работа», чип плана — словом',/^Выше среднего · цель/.test(r.sub||'')&&W.includes(r.chip),r);
  ok('«Сегодня»: в тексте нет A1…C1',!(await letters()).length,await letters());await shot('today');
  // 2. «Кино»
  await P.evaluate(()=>{store.kinoLv='all';renderTab('kino');});await P.waitForTimeout(900);
  r=await P.evaluate(()=>({lv:[...document.querySelectorAll('.n-lv .n-chip')].map(x=>x.textContent),bars:[...document.querySelectorAll('.n-pi .n-chip.lvbc')].map(x=>[x.querySelectorAll('i').length,x.querySelectorAll('i.on').length,x.title]),
    row:(()=>{const e=document.querySelector('.n-lv');if(!e)return null;const q=e.getBoundingClientRect();return {h:Math.round(q.height),sw:e.scrollWidth,w:e.clientWidth};})()}));
  ok('«Кино»: фильтр уровней — словами и «Все уровни»',r.lv.length>=2&&r.lv.slice(0,-1).every(x=>W.includes(x))&&r.lv[r.lv.length-1]==='Все уровни',r.lv);
  ok('«Кино»: уголок постера — 5 полосок, закрашено по уровню, слово в подсказке',r.bars.length>0&&r.bars.every(x=>x[0]===5&&x[1]>=1&&x[1]<=5&&W.includes(x[2])),r.bars.slice(0,4));
  ok('«Кино»: фильтр — одной строкой (листается вбок), страница вбок не едет',r.row&&r.row.h<=44&&!(await wide()),r.row);
  ok('«Кино»: в тексте нет A1…C1',!(await letters()).length,await letters());await shot('kino');
  r=await P.evaluate(()=>[...document.querySelectorAll('.n-kino .n-sg button')].map(x=>[x.textContent,x.scrollWidth<=x.clientWidth+1]));
  ok('«Кино»: подписи разделов целиком, не обрезаны',r.length>=2&&r.every(x=>x[1]),r);
  await P.evaluate(()=>{store.kinoLv='B1';renderTab('kino');});await P.waitForTimeout(600);
  r=await P.evaluate(()=>[...document.querySelectorAll('.n-lbl span')].map(x=>x.textContent)[0]);
  ok('«Кино»: выбран уровень — подпись «Уровень «Средний»»',r==='Уровень «Средний»',r);
  await P.evaluate(()=>{store.kinoLv='all';save();});
  // 3. Сцена и сериал
  await P.evaluate(()=>renderScene('wolf-of-wall-street'));await P.waitForTimeout(900);
  r=await P.evaluate(()=>(document.querySelector('.n-st .n-chips .n-chip')||{}).textContent);
  ok('сцена: чип уровня — словом',W.includes(r),r);ok('сцена: в тексте нет A1…C1',!(await letters()).length,await letters());await shot('scene');
  await P.evaluate(()=>renderShow('Клан Сопрано'));await P.waitForTimeout(900);
  r=await P.evaluate(()=>(document.querySelector('.n-st .n-chips .n-chip')||{}).textContent);
  ok('сериал: чип уровня — словом',W.includes(r),r);ok('сериал: в тексте нет A1…C1',!(await letters()).length,await letters());
  // 4. словарь: метка у строки — полоски, слово в подсказке
  r=await P.evaluate(async()=>{await wlvLoad();const h=lvTag('Nice tan, Mark','en');const d=document.createElement('div');d.innerHTML=h;const e=d.firstElementChild;return {cls:e.className,n:e.querySelectorAll('i').length,on:e.querySelectorAll('i.on').length,t:e.title,txt:e.textContent};});
  ok('словарь: метка — 5 полосок, без букв, слово в подсказке',/lvb/.test(r.cls)&&r.n===5&&r.on>=1&&W.includes(r.t)&&r.txt==='',r);
  await P.evaluate(()=>{const s=scOf('wolf-of-wall-street'),Q=scP(s.id);Q.w=Q.w||{};Q.done=Q.done||{};Q.got=Q.got||{};Q.w[0]=1;Q.done[0]=1;scAct(s.parts[0].ph).forEach(f=>Q.got[f.id]=Date.now());scSave();renderTab('dict');});await P.waitForTimeout(1600);
  await P.evaluate(()=>{DL.open({sid:'wolf-of-wall-street'});});await P.waitForTimeout(1200);
  await P.evaluate(()=>{const d=document.querySelector('#dlRoot details.kn-ep');if(d)d.open=true;});await P.waitForTimeout(500);
  r=await P.evaluate(()=>[...document.querySelectorAll('#dlRoot .kq2:not(.lock) .kq-lv')].map(e=>[e.className,e.querySelectorAll('i').length,e.textContent]).slice(0,6));
  ok('словарь: у открытых строк — полоски, без букв',r.length>0&&r.every(x=>x[2]===''&&(x[1]===5||/no|art/.test(x[0]))),r);
  ok('словарь: в тексте нет A1…C1',!(await letters()).length,await letters());await shot('dict');
  // 5. окошко слова и «Ещё в кино»
  r=await P.evaluate(()=>{const d=document.createElement('div');d.innerHTML='<div class="kwp-w"><b>business</b></div>';ndWpDeco(d,{word:'business',sid:'wolf-of-wall-street'});const c=d.querySelector('.n-chip');
    return {chip:c&&c.textContent,nw:(nwHTML('broker','wolf-of-wall-street')||'').replace(/<[^>]+>/g,'')};});
  ok('окошко слова: чип уровня — словом',W.includes(r.chip),r.chip);
  ok("«Подробнее»: «уровень слова — …» словом, без букв",/уровень слова — (начинающий|базовый|средний|выше среднего|продвинутый)/i.test(r.nw)&&!/\b(A1|A2|B1|B2|C1)\b/.test(r.nw),r.nw.slice(0,90));
  // 6. повторение: чип карточки
  await P.evaluate(()=>{const s=scOf('wolf-of-wall-street'),Q=scP(s.id),f=scAct(s.parts[0].ph)[0];Q.r=Q.r||{};Q.r[f.id]=[1,Date.now()-1000];scSave();renderDaily();});await P.waitForTimeout(1300);
  r=await P.evaluate(()=>(document.querySelector('.n-rcard .n-chip')||{}).textContent);
  ok('повторение: чип — «Уровень · учишь…» словом',r&&W.some(w=>r.startsWith(w+' · ')),r);
  ok('повторение: в тексте нет A1…C1',!(await letters()).length,await letters());await shot('rev');
  // 7. первый запуск: тест уровня → «Проверь себя» → итог → «выбрать самому» → «Настраиваем»
  await P.evaluate(()=>{ONB=null;renderOnb(0);ONB.lang='en';renderOnb(1);});await P.waitForTimeout(600);await P.click('#onbGo');await P.waitForTimeout(400);
  for(let k=0;k<20;k++){const s=await P.evaluate(()=>ONB&&ONB.lt&&ONB.lt.ph);if(s!=='w')break;
    const ch=await P.evaluate(()=>{const c=document.querySelector('#onbCard');return c&&c.classList.contains('ch');});
    if(ch){await P.click('.onb-chs .onb-o[data-ok="1"]');await P.waitForTimeout(1500);}else{await P.click('#onbYes');await P.waitForTimeout(150);}}
  r=await P.evaluate(()=>({ph:ONB.lt.ph,ckl:(document.querySelector('#onbCkL')||{}).textContent}));
  ok('«Проверь себя»: «уровень по словам» — словом',r.ph==='chk'&&W.includes(r.ckl),r);
  if(r.ph==='chk'){await P.evaluate(()=>{document.querySelectorAll('.onb-cr[data-j] .onb-cb button[data-a="0"]').forEach(b=>b.click());});await P.waitForTimeout(300);
    r=await P.evaluate(()=>(document.querySelector('#onbCkL')||{}).textContent);ok('«Не знал» на все — уровень по словам меняется, но словом',W.includes(r),r);
    await P.click('#onbGo');await P.waitForTimeout(400);}
  for(let k=0;k<6;k++){const s=await P.evaluate(()=>ONB.lt.ph);if(s!=='g')break;await P.click('.onb-opts .onb-o[data-ok="1"]');await P.waitForTimeout(800);}
  r=await P.evaluate(()=>{const L=document.querySelector('#onbLv');return L&&{b:(L.querySelector('b')||{}).textContent,sp:(L.querySelector('span')||{}).textContent,bars:L.querySelectorAll('.lvb>i').length,on:L.querySelectorAll('.lvb>i.on').length,w:Math.round(L.getBoundingClientRect().width)};});
  ok('итог: уровень словом крупно, над ним полоски, «уточним по твоим ответам»',r&&W.includes(r.b)&&r.bars===5&&r.on>=1&&/уточним/.test(r.sp),r);
  r=await P.evaluate(()=>[...document.querySelectorAll('.onb-grid button')].map(x=>[x.querySelectorAll('.lvb>i.on').length,(x.querySelector('small')||{}).textContent]));
  ok('«выбрать самому»: 5 кнопок — полоски 1…5 и слово',r.length===5&&r.every((x,k)=>x[0]===k+1&&x[1]===W[k]),r);
  ok('итог: в тексте нет A1…C1, вбок не едет',!(await letters()).length&&!(await wide()),await letters());await shot('onb-res');
  await P.click('.onb-grid button[data-c="C1"]');await P.waitForTimeout(300);
  r=await P.evaluate(()=>{const L=document.querySelector('#onbLv');return {b:(L.querySelector('b')||{}).textContent,sp:(L.querySelector('span')||{}).textContent,on:L.querySelectorAll('.lvb>i.on').length};});
  ok('выбрал сам — «Продвинутый», 5 полосок, «выбрал сам»',r.b==='Продвинутый'&&r.on===5&&/выбрал сам/.test(r.sp),r);await shot('onb-pick');
  await P.evaluate(()=>renderOnb(4));await P.waitForTimeout(500);
  r=await P.evaluate(()=>(document.querySelector('.onb')||document.body).innerText);
  ok('«Настраиваем»: «Уровень «Продвинутый» — подбираем сцены»',/Уровень «Продвинутый» — подбираем сцены/.test(r),r.slice(0,160));
  ok('консоль чистая',!errs.length,errs.slice(0,3));
  console.log(fails?`FAILS: ${fails}`:'ALL PASS');await b.close();process.exit(fails?1:0);
})().catch(e=>{console.error(e);process.exit(2);});
