// 13.8.4: новый словарь — «📖 Фразы» списком, Кинотека, сцена списком/карточками, «смотреть» по нажатию, ▶ в карте прячется, поиск без чипов
const {open}=require('./st');const {chromium}=require('playwright');
const ok=(n,c,d)=>console.log(c?'PASS':'FAIL',n,d||'');
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify({admin:true,flags:{}}));};
const base={onboarded:true,introV:1,gold:900,lvl:'b',fx:true,tourV:1,scSubChosen:1,autoSc:false,age18:true,dictVar:'kino',dlDemo:true};
const dev=process.argv[2]||'ph';
(async()=>{const b=await chromium.launch();
  const [vp,touch]=dev==='ph'?[{width:390,height:844},true]:[{width:1440,height:900},false];
  const {page,errs,ctx}=await open({browser:b,touch,uid:876754050,ctx:{viewport:vp},wait:2500,init:seed,initArg:[base]});
  const shot=async n=>{await page.waitForTimeout(900);await page.screenshot({path:`kn4-${dev}-${n}.png`});};
  const ev=f=>page.evaluate(f);
  await ev(()=>renderTab('dict'));await page.waitForTimeout(1800);
  let st=await ev(()=>({lvl:$('#dlStage').dataset.lvl,seg:[...document.querySelectorAll('.kn-seg button')].map(b=>b.textContent.trim()+(b.classList.contains('on')?'*':'')),rows:document.querySelectorAll('.kr').length,cards:document.querySelectorAll('.kc').length,lst:(document.querySelector('[data-lsdd]')||{}).textContent}));
  ok('главная словаря = список фраз',st.lvl==='home'&&st.rows>10&&!st.cards&&st.seg[0].endsWith('*'),JSON.stringify(st));
  await shot('1-list');
  await page.evaluate(()=>{document.body.scrollTop=900;});await shot('1b-list-scroll');await page.evaluate(()=>{document.body.scrollTop=0;});
  // фильтр статуса
  await page.click('[data-lsdd]');await page.waitForTimeout(600);await shot('1c-show-sheet');await page.click('[data-lsv="due"]');await page.waitForTimeout(700);
  st=await ev(()=>({rows:[...document.querySelectorAll('.kr')].map(r=>r.className)}));ok('чип «Повторить» — только повторить',st.rows.length>0&&st.rows.every(c=>/st-due/.test(c)),st.rows.length+'');
  await page.click('[data-lsdd]');await page.waitForTimeout(600);await page.click('[data-lsv=""]');await page.waitForTimeout(700);
  // «Ещё N фраз»
  const more=await ev(()=>!!document.querySelector('[data-exp]'));if(more){const n0=await ev(()=>document.querySelectorAll('.kr').length);await page.click('[data-exp]');await page.waitForTimeout(500);const n1=await ev(()=>document.querySelectorAll('.kr').length);ok('«Ещё N фраз» раскрывает',n1>n0,n0+'→'+n1);}
  // открыть фразу из списка → окно, ▶ спрятана, когда играет
  await page.click('.kr:not(.lock)');await page.waitForTimeout(1600);
  st=await ev(()=>{const p=document.querySelector('.knv-p'),v=document.querySelector('.kno video');return {open:!!document.querySelector('.kno'),pHidden:p&&p.hidden,pDisp:p&&getComputedStyle(p).display,playing:v&&!v.paused,t:v&&v.currentTime};});
  ok('карта из списка открылась, ▶ не висит',st.open&&(!st.playing||st.pDisp==='none'),JSON.stringify(st));
  await shot('2-open');
  await ev(()=>DL.back());await page.waitForTimeout(600);
  // Кинотека
  await page.click('[data-kseg="kino"]');await page.waitForTimeout(1500);
  st=await ev(()=>({hero:!!document.querySelector('.kn-hero'),p:document.querySelectorAll('.kn-p').length,kv:store.knView}));ok('Кинотека: витрина',st.hero&&st.p>3&&st.kv==='kino',JSON.stringify(st));
  await shot('3-kino');
  // фильм (Волк)
  await ev(()=>DL.open({show:'Волк с Уолл-стрит',sid:null}));await page.waitForTimeout(2200);
  st=await ev(()=>({lvl:$('#dlStage').dataset.lvl,w:document.querySelectorAll('.kf-sh [data-watch]').length,c:document.querySelectorAll('.kf-c[data-sid]').length,p:!!document.querySelector('.kf-p[data-watch]')}));
  ok('фильм: сцены — смотреть и «Фразы»',st.lvl==='film'&&st.w>=4&&st.c===2&&st.p,JSON.stringify(st));
  await shot('4-film');await page.evaluate(()=>{document.body.scrollTop=700;});await shot('4b-film-scroll');
  // «Фразы · N из M» → сцена списком
  await page.click('.kf-c[data-sid="wolf-swiss-bank"]');await page.waitForTimeout(1500);
  st=await ev(()=>({lvl:$('#dlStage').dataset.lvl,sid:DL.S.sid,rows:document.querySelectorAll('.kn-ep .kr').length,lock:document.querySelectorAll('.kn-ep .kr.lock').length,ew:document.querySelectorAll('.kn-ew').length,watch:!!document.querySelector('.kn-shw'),hf:!!document.querySelector('.kn-hf[data-show]')}));
  ok('сцена: фразы списком, ▶ у эпизодов, «Смотреть», ссылка на фильм',st.lvl==='scene'&&st.rows>5&&st.ew>=3&&st.watch&&st.hf,JSON.stringify(st));
  await shot('5-scene-list');
  await page.click('[data-kv="cards"]');await page.waitForTimeout(1200);
  st=await ev(()=>({kc:document.querySelectorAll('.kn-ep .kc').length,kr:document.querySelectorAll('.kn-ep .kr').length,on:store.knCards}));ok('«Карточки»',st.kc>5&&!st.kr&&st.on===true,JSON.stringify(st));
  await shot('6-scene-cards');
  await page.click('[data-kv="list"]');await page.waitForTimeout(800);
  // название фильма → страница фильма
  await page.click('.kn-hf');await page.waitForTimeout(1500);
  st=await ev(()=>({lvl:$('#dlStage').dataset.lvl,show:DL.S.show}));ok('название фильма → фильм',st.lvl==='film',JSON.stringify(st));
  // фильм с одной сценой — своя страница; назад из сцены — на фильм
  await ev(()=>DL.open({show:'Павел Дуров',sid:null}));await page.waitForTimeout(1500);
  st=await ev(()=>({lvl:$('#dlStage').dataset.lvl}));ok('фильм из одной сцены — страница фильма',st.lvl==='film',JSON.stringify(st));
  await page.click('.kf-c');await page.waitForTimeout(1200);await ev(()=>DL.back());await page.waitForTimeout(1200);
  st=await ev(()=>({lvl:$('#dlStage').dataset.lvl}));ok('назад из сцены → фильм',st.lvl==='film',JSON.stringify(st));
  await ev(()=>DL.back());await page.waitForTimeout(1200);st=await ev(()=>({lvl:$('#dlStage').dataset.lvl}));ok('назад из фильма → главная',st.lvl==='home',JSON.stringify(st));
  // поиск: без ряда чипов, тема — кнопкой
  await ev(()=>{store.knView='list';});await ev(()=>DL.render(0));await page.waitForTimeout(800);
  await page.click('.kn-fbt');await page.waitForTimeout(1200);
  st=await ev(()=>({chips:document.querySelectorAll('.kn-chips').length,dd:[...document.querySelectorAll('.kn-ddb')].map(b=>b.textContent.trim()),tiles:document.querySelectorAll('.kn-tt button').length}));
  ok('поиск: чипов тем нет, «Тема» — кнопкой, плитки на месте',!st.chips&&/Тема/.test(st.dd[0])&&st.tiles>5,JSON.stringify(st));
  await shot('7-flt');
  await page.click('.kn-tt button');await page.waitForTimeout(1200);
  st=await ev(()=>({rows:document.querySelectorAll('#knRes .kr').length,dd:document.querySelector('.kn-ddb').textContent.trim(),vsw:!!document.querySelector('#knRes [data-kv]')}));ok('тема выбрана: список, на кнопке — тема',st.rows>3&&st.vsw&&!/^Тема/.test(st.dd),JSON.stringify(st));
  await shot('8-flt-topic');
  await page.click('#knRes [data-kv="cards"]');await page.waitForTimeout(800);st=await ev(()=>({kc:document.querySelectorAll('#knRes .kc').length}));ok('карточками в поиске',st.kc>3,JSON.stringify(st));
  await page.click('#knRes [data-kv="list"]');await page.waitForTimeout(500);
  await page.click('.kn-ddb[data-dd="tp"]');await page.waitForTimeout(700);st=await ev(()=>document.querySelectorAll('.kn-ddl button').length);ok('шторка тем',st>5,String(st));await shot('9-tp-sheet');
  await ev(()=>{const w=document.querySelector('.kn-sheet');w&&w._close&&w._close();});await page.waitForTimeout(400);
  // смотреть: сцена из фильма, эпизод из сцены
  await ev(()=>{DL.S.flt=false;DL.open({show:'Волк с Уолл-стрит',sid:null});});await page.waitForTimeout(1500);
  await page.click('.kf-w[data-watch]');await page.waitForTimeout(1500);st=await ev(()=>({screen,h:(document.querySelector('.scn h1,.scn .title,h1')||{}).textContent}));ok('«▶ Смотреть» у сцены → страница сцены',/scene|scn/.test(st.screen)||!document.querySelector('#dlRoot'),JSON.stringify(st));
  await ev(()=>{renderTab('dict');});await page.waitForTimeout(1200);await ev(()=>DL.open({sid:'wolf-of-wall-street'}));await page.waitForTimeout(1200);
  await page.click('.kn-ew');await page.waitForTimeout(1800);st=await ev(()=>({screen,ep:SCUR&&SCUR.i,id:SCUR&&SCUR.id}));ok('▶ на эпизоде → эпизод',st.id==='wolf-of-wall-street'&&st.ep===0,JSON.stringify(st));
  // пустой словарь у нового игрока: «Мой прогресс» без фраз → Кинотека, а «Фразы» — пусто с кнопкой
  await ev(()=>{store.dlDemo=false;delete store.knView;DL.S.sid=null;DL.S.show=null;renderTab('dict');});await page.waitForTimeout(1500);
  st=await ev(()=>({kv:typeof store.knView,hero:!!document.querySelector('.kn-hero'),on:(document.querySelector('.kn-seg .on')||{}).textContent}));ok('новичок: сразу Кинотека',st.hero,JSON.stringify(st));
  await page.click('[data-kseg="list"]');await page.waitForTimeout(1000);st=await ev(()=>!!document.querySelector('.kn-lempty [data-kseg="kino"]'));ok('пустые «Фразы» — подсказка и кнопка в Кинотеку',st);await shot('10-empty');
  ok('консоль чистая',!errs.length,errs.slice(0,6).join('\n'));
  await b.close();})();
