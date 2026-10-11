// 13.9.3: новый словарь — «Кинотека» (фильм → сцены строками → эпизод раскрывается → фразы строками; раздел на весь экран — kf.js)
// и «Мои фразы и слова» (переключатель «Фразы / Слова», 13.9.5 — один экран: темы, «Все», #фильм — подробно в km.js); ph|pc
const {open}=require('./st');const {chromium}=require('playwright');
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d||'');};
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify({admin:true,flags:{}}));};
const base={onboarded:true,introV:1,gold:900,lvl:'b',fx:true,tourV:1,scSubChosen:1,autoSc:false,age18:true,dictVar:'kino',dlDemo:true,snd:false};
const dev=process.argv[2]||'ph';
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});
  const [vp,touch]=dev==='ph'?[{width:390,height:844},true]:[{width:1440,height:900},false];
  const {page,errs}=await open({browser:b,touch,uid:876754050,ctx:{viewport:vp},wait:2500,init:seed,initArg:[base]});
  const shot=async n=>{await page.waitForTimeout(700);await page.screenshot({path:`kn4-${dev}-${n}.png`});};
  const ev=(f,a)=>page.evaluate(f,a);const click=async s=>{const l=page.locator(s).first();await l.scrollIntoViewIfNeeded();await l.click();};
  await ev(()=>renderTab('dict'));await page.waitForFunction(()=>window.DL&&document.querySelector('#dlStage'),null,{timeout:15000});await page.waitForTimeout(1500);
  let st=await ev(()=>({lvl:$('#dlStage').dataset.lvl,tabs:[...document.querySelectorAll('.kn-tabs button')].map(b=>b.textContent.trim()+(b.classList.contains('on')?'*':'')),hero:!!document.querySelector('.kn-hero'),p:document.querySelectorAll('.kn-p').length,rows:document.querySelectorAll('.kq').length}));
  ok('главная — Кинотека, вкладок две, фраз списком нет',st.lvl==='home'&&st.tabs.join()==='Кинотека*,Мои фразы и слова'&&st.hero&&st.p>3&&!st.rows,JSON.stringify(st));
  await shot('1-kino');
  // фильм: шапка + сцены строками, без «квадратов», цитаты и «Сложность/Польза»
  await ev(()=>DL.open({show:'Волк с Уолл-стрит',sid:null}));await page.waitForTimeout(2000);
  st=await ev(()=>({lvl:$('#dlStage').dataset.lvl,sr:document.querySelectorAll('.kf-sr[data-sid]').length,sq:document.querySelectorAll('.kcc,.kc,.kf-row').length,q:document.querySelectorAll('.kf-q,.kf-info').length,go:document.querySelectorAll('.kf-b button').length,p:!!document.querySelector('.kf-p[data-watch]')}));
  ok('фильм: сцены строками, одна кнопка, без квадратов',st.lvl==='film'&&st.sr===2&&!st.sq&&!st.q&&st.go===1&&st.p,JSON.stringify(st));
  await shot('2-film');
  // сцена: эпизоды свёрнуты; нажал — фразы строками
  await click('.kf-sr[data-sid="wolf-swiss-bank"]');await page.waitForTimeout(1500);
  st=await ev(()=>({lvl:$('#dlStage').dataset.lvl,sid:DL.S.sid,ep:document.querySelectorAll('.kn-ep').length,open:document.querySelectorAll('.kn-ep[open]').length,ew:document.querySelectorAll('.kn-ew').length,watch:!!document.querySelector('.kn-shw'),hf:!!document.querySelector('.kn-hf[data-show]'),kc:document.querySelectorAll('.kc').length}));
  ok('сцена: эпизоды свёрнуты, ▶ у эпизодов, «Смотреть», ссылка на фильм',st.lvl==='scene'&&st.ep>=3&&!st.open&&st.ew>=3&&st.watch&&st.hf&&!st.kc,JSON.stringify(st));
  await click('.kn-ep summary .kn-ex');await page.waitForTimeout(900);
  st=await ev(()=>({open:document.querySelectorAll('.kn-ep[open]').length,rows:document.querySelectorAll('.kn-ep[open] .kq').length}));ok('нажал на эпизод — фразы строками',st.open===1&&st.rows>0,JSON.stringify(st));
  await shot('3-scene');
  // фраза: окно, ▶ не висит, слова загораются
  await click('.kn-ep[open] .kq:not(.lock)');await page.waitForTimeout(1800);
  st=await ev(()=>{const p=document.querySelector('.knv-p'),v=document.querySelector('.kno video');return {open:!!document.querySelector('.kno2'),pDisp:p&&getComputedStyle(p).display,playing:v&&!v.paused,on:document.querySelectorAll('.kn2-sub span.on').length};});
  ok('фраза открылась, ▶ спрятана, пока играет',st.open&&(!st.playing||st.pDisp==='none'),JSON.stringify(st));
  await ev(()=>DL.back());await page.waitForTimeout(600);
  await click('.kn-hf');await page.waitForTimeout(1300);st=await ev(()=>$('#dlStage').dataset.lvl);ok('название фильма → фильм',st==='film',st);
  // фильм из одной сцены — своя страница; назад из сцены → фильм → главная
  await ev(()=>DL.open({show:'Павел Дуров',sid:null}));await page.waitForTimeout(1500);st=await ev(()=>$('#dlStage').dataset.lvl);ok('фильм из одной сцены — страница фильма',st==='film',st);
  await click('.kf-sr');await page.waitForTimeout(1200);await ev(()=>DL.back());await page.waitForTimeout(1200);st=await ev(()=>$('#dlStage').dataset.lvl);ok('назад из сцены → фильм',st==='film',st);
  await ev(()=>DL.back());await page.waitForTimeout(1200);st=await ev(()=>$('#dlStage').dataset.lvl);ok('назад из фильма → главная',st==='home',st);
  // поиск: без чипов, «Тема» — кнопкой, плитки тем
  await click('.kn-sf');await page.waitForTimeout(1200);
  st=await ev(()=>({chips:document.querySelectorAll('.kn-chips').length,dd:[...document.querySelectorAll('.kn-ddb')].map(b=>b.textContent.trim()),tiles:document.querySelectorAll('.kn-tt button').length}));
  ok('поиск: «Тема» кнопкой, плитки на месте',!st.chips&&/Тема/.test(st.dd[0])&&st.tiles>5,JSON.stringify(st));
  await click('.kn-tt button');await page.waitForTimeout(1200);st=await ev(()=>({kq:document.querySelectorAll('#knRes .kq').length,kc:document.querySelectorAll('#knRes .kc').length}));ok('тема: фразы строками',st.kq>3&&!st.kc,JSON.stringify(st));
  await shot('4-flt');
  // «Смотреть»: шапка фильма → сцена; ▶ эпизода → эпизод
  await ev(()=>{DL.S.flt=false;DL.open({show:'Волк с Уолл-стрит',sid:null});});await page.waitForTimeout(1500);
  await click('.kf-go[data-watch]');await page.waitForTimeout(1500);st=await ev(()=>({dict:!!document.querySelector('#dlRoot'),screen}));ok('«Смотреть дальше» → страница сцены',!st.dict,JSON.stringify(st));
  await ev(()=>renderTab('dict'));await page.waitForTimeout(1200);await ev(()=>DL.open({sid:'wolf-of-wall-street'}));await page.waitForTimeout(1200);
  await click('.kn-ew');await page.waitForTimeout(1800);st=await ev(()=>({ep:SCUR&&SCUR.i,id:SCUR&&SCUR.id}));ok('▶ на эпизоде → эпизод',st.id==='wolf-of-wall-street'&&st.ep===0,JSON.stringify(st));
  // ---------- «Мои фразы и слова» (демо): 13.9.7 — два вида, карточки / постеры (подробно — km.js) ----------
  await ev(()=>{DL.S.sid=null;DL.S.show=null;DX.seg='my';store.knMyKind='ph';store.knMyV='feed';renderTab('dict');});await page.waitForTimeout(1500);   // старый выбор вида ни на что не влияет
  st=await ev(()=>({lvl:$('#dlStage').dataset.lvl,sw:[...document.querySelectorAll('.km-sw button')].map(b=>b.textContent.replace(/\s+/g,' ').trim()+(b.classList.contains('on')?'*':'')),pill:!!document.querySelector('[data-mvp]'),vw:(document.querySelector('.km6-vw .on')||{dataset:{}}).dataset.mv,q:!!document.querySelector('#kmQ'),cards:document.querySelectorAll('.km6-c').length}));
  ok('«Мои»: «Фразы / Слова», вид ☰ карточки (старое «feed» → карточки), поиск виден, карточки фильмов',st.lvl==='my'&&/^Фразы \d+\*$/.test(st.sw[0])&&/^Слова/.test(st.sw[1])&&!st.pill&&st.vw==='cards'&&st.q&&st.cards>2,JSON.stringify(st));
  await shot('5-my');
  // тренировка темы и возврат
  await click('.km6-c summary');await page.waitForTimeout(600);await click('.km6-c[open] [data-mtr]');await page.waitForTimeout(1200);
  st=await ev(()=>({q:!!document.querySelector('.dl-q'),n:document.querySelectorAll('.sc-segs i').length}));ok('«Тренировать» карточку фильма — повторение по ней',st.q&&st.n>0&&st.n<=10,JSON.stringify(st));
  await click('#dlx');await page.waitForTimeout(1500);st=await ev(()=>!!document.querySelector('.km6-c'));ok('✕ в тренировке → обратно в «Мои»',st);
  // слова: окно со словом
  await ev(()=>{const now=Date.now(),s=scOf('wolf-of-wall-street'),r=s.subs.find(z=>z[0]>=21&&z[0]<22);store.myw={'wolf-of-wall-street|clients':{k:'wolf-of-wall-street|clients',w:'clients',ru:'клиенты',de:'',sid:'wolf-of-wall-street',pi:0,line:r[2],lineRu:r[3],a:r[0],at:now,lvl:0,st:1,due:now-1000,tags:['работа']}};save();});
  await click('[data-mk="w"]');await page.waitForTimeout(1200);
  st=await ev(()=>({on:(document.querySelector('.km-sw .on')||{}).textContent,rows:document.querySelectorAll('.kqw').length,fab:!!document.querySelector('.km-fab')}));ok('«Слова»: строки слов, кнопка «＋»',/Слова/.test(st.on)&&st.rows===1&&st.fab,JSON.stringify(st));
  await shot('8-words');
  await click('.km6-c summary');await page.waitForTimeout(500);await click('.km6-c[open] .kqw');await page.waitForTimeout(1600);
  st=await ev(()=>({w:(document.querySelector('.kn2-word')||{}).textContent,mark:(document.querySelector('.kn2-line mark')||{}).textContent,v:!!document.querySelector('.kno2 video')}));ok('слово открылось: момент, реплика, слово подсвечено',st.w==='clients'&&/clients/i.test(st.mark||'')&&st.v,JSON.stringify(st));
  await shot('9-word');await ev(()=>DL.back());await page.waitForTimeout(600);
  // новичок: пусто — понятные подсказки
  await ev(()=>{store.dlDemo=false;store.myw={};save();DL.KN.my.tag=null;store.knMyKind='ph';DL.render(0);});await page.waitForTimeout(1000);
  st=await ev(()=>({e:(document.querySelector('.km-empty b')||{}).textContent,k:!!document.querySelector('.km-empty [data-mkino]')}));ok('пустые «Мои фразы» — подсказка и кнопка в Кинотеку',st.e==='Пока нет фраз'&&st.k,JSON.stringify(st));
  await click('[data-mk="w"]');await page.waitForTimeout(800);st=await ev(()=>({e:(document.querySelector('.km-empty b')||{}).textContent,a:!!document.querySelector('.km-empty [data-madd]')}));ok('пустые «Мои слова» — «Добавить своё слово»',st.e==='Пока нет слов'&&st.a,JSON.stringify(st));
  await shot('10-empty');
  ok('консоль чистая',!errs.length,errs.slice(0,6).join('\n'));
  console.log(fails?`ИТОГ: ${fails} FAIL`:'ИТОГ: всё PASS');
  await b.close();})();
