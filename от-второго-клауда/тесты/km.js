// 13.9.7: «Мои фразы и слова» — два вида на пробу. Общее: поиск всегда виден (фразы и слова вместе), итог, «Повторить сегодня», ☰ / ▦.
// А «Карточки»: «По фильмам · По темам», карточка как эпизод Кинотеки, раскрыл — «Тренировать», сцены и эпизоды, строки; ▶ на кадре — «подряд».
// Б «Постеры»: чипы тем, сетка постеров, тап — страница фильма (шапка + эпизоды), «‹» настоящим кликом и «назад» Телеграма.
// 13.9.8 — окно фразы: само ничего не играет; «🔊 Послушать» (звук, слова фразы загораются) · «▶ Смотреть» (видео под кнопками) · «🐢»;
// «Подробнее» строкой, факт свёрнут, статус внизу; «▶ подряд» играет само; ph|pc
const {open}=require('./st');const {chromium}=require('playwright');
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify({admin:true,flags:{}}));};
const bb=()=>{window.__bb=[];const W=window.Telegram&&Telegram.WebApp;if(W)W.BackButton={show(){window.__bb.push(1);},hide(){window.__bb.push(0);},onClick(){},offClick(){}};};
const dev=process.argv[2]||'ph';
const base={onboarded:true,introV:1,gold:900,lvl:'b',fx:true,tourV:1,scSubChosen:1,autoSc:false,age18:true,dictVar:'kino',dlDemo:false,snd:false,knWin:'full'};   // окно на весь экран (полэкрана — sheet.js)
const shot=(p,n)=>p.screenshot({path:`${__dirname}/km-${dev}-${n}.png`});
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const [vp,touch]=dev==='ph'?[{width:390,height:844},true]:[{width:1440,height:900},false];
  const {page,ctx,errs}=await open({browser:b,touch,uid:876754050,ctx:{viewport:vp},wait:2500,init:seed,initArg:[base]});await ctx.addInitScript(bb);await page.reload();await page.waitForTimeout(2500);
  const ev=(f,a)=>page.evaluate(f,a);const click=async s=>{const l=page.locator(s).first();await l.scrollIntoViewIfNeeded();await l.click();};
  await ev(()=>{const now=Date.now();let n=0;
    for(const [id,pi,k] of [['wolf-of-wall-street',0,6],['wolf-of-wall-street',1,3],['wolf-swiss-bank',0,3],['american-psycho',0,4],['clavicular-impaulsive',0,3],['taxi-driver-lonely',1,2]]){const s=scOf(id),P=scP(id);P.got=P.got||{};P.w[pi]=1;
      scAct(s.parts[pi].ph).slice(0,k).forEach(f=>{n++;P.got[f.id]=now-n*6e4;P.m[f.id]=n%5===0?3:1;P.r[f.id]=n%4===0?[1,now-1000]:[1,now+864e5*2];});}
    scSave();store.myw={};const add=(k,w,ru,sid,pi,a,st,due,tags)=>{const s=scOf(sid),r=s&&s.subs.find(z=>Math.abs(z[0]-a)<0.06);store.myw[k]={k,w,ru,de:'',sid,pi,line:r?r[2]:'',lineRu:r?r[3]:'',a,at:now-st*1000,lvl:0,st,due,tags:tags||[]};};
    add('wolf-of-wall-street|clients','clients','клиенты','wolf-of-wall-street',0,21,1,now-1000,['работа']);add('wolf-of-wall-street|function','function','работать','wolf-of-wall-street',0,4.96,0,now+864e5*3);
    add('american-psycho|tan','tan','загар','american-psycho',0,20.34,2,now+864e5,['внешность']);add('american-psycho|occasionally','occasionally','иногда','american-psycho',0,36.82,0,now-5000);
    store.myw['own|deadline']={k:'own|deadline',w:'deadline',ru:'срок сдачи',de:'',sid:'own',pi:0,line:'',lineRu:'',a:0,at:now-9e4,lvl:0,st:1,due:now+864e5*2,own:true,tags:['работа']};save();});
  // фразы и фильмы, как их считает приложение (для сверки с экраном)
  const truth=()=>ev(()=>{const C=dxScenes().flatMap(s=>DL.cards(s)).filter(c=>c.got),F={};C.forEach(c=>{const k=dictFilm(c.s);F[k]=(F[k]||0)+1;});return {n:C.length,F};});
  // старый выбор вида (13.9.2–13.9.4: book/album/…) → «Карточки»
  await ev(()=>{DX.seg='my';store.knMyKind='ph';store.knMyV='book';store.knMyBy='';renderTab('dict');});await page.waitForFunction(()=>window.DL&&document.querySelector('#dlStage'),null,{timeout:15000});await page.waitForTimeout(1500);
  const T=await truth();   // DL грузится с первым заходом в словарь
  let r=await ev(()=>({lvl:$('#dlStage').dataset.lvl,cards:!!document.querySelector('#kmBody.km6-cards'),vw:(document.querySelector('.km6-vw .on')||{}).dataset,by:(document.querySelector('.km6-by .on')||{}).dataset,
    q:!!document.querySelector('#kmQ'),srBtn:!!document.querySelector('[data-msr]'),old:document.querySelectorAll('.km5-tl,.km5-all,.km5-tg,#kaBar,.ka-v,.kma-c').length,sum:(document.querySelector('.km6-sum')||{}).textContent,
    due:!!document.querySelector('.kmb-due'),bb:window.__bb.slice(-1)[0],sw:document.documentElement.scrollWidth,iw:innerWidth}));
  ok('старое «book» → Карточки, «По фильмам»; поиск виден сразу (без 🔍); итог, «Повторить сегодня»; 13.9.5 убрано; «назад» спрятана',
    r.lvl==='my'&&r.cards&&r.vw&&r.vw.mv==='cards'&&r.by&&r.by.mby==='film'&&r.q&&!r.srBtn&&!r.old&&new RegExp('^'+T.n+' фраз').test(r.sum||'')&&r.due&&r.bb===0&&r.sw<=r.iw,r);
  await shot(page,'1-cards');
  // карточки = фильмы; число — сколько фраз; все свёрнуты; первый — где собирал последним (Волк)
  r=await ev(()=>({c:[...document.querySelectorAll('.km6-c')].map(d=>[d.querySelector('.kn-ex b').textContent.trim(),+d.querySelector('.kn-en b').textContent,d.open]),lbl:document.querySelector('.km6-c .kn-ex em').textContent}));
  ok('карточки по фильмам: столько, сколько фильмов, числа совпадают, все свёрнуты, Волк первым',r.c.length===Object.keys(T.F).length&&r.c.every(([k,n,o])=>T.F[k]===n&&!o)&&r.c[0][0]==='Волк с Уолл-стрит'&&/^Фильм/.test(r.lbl),r);
  // раскрыл — «Тренировать», «▶ подряд», сцены (у Волка их 2), эпизоды, строки
  await click('.km6-c summary');await page.waitForTimeout(700);
  r=await ev(()=>{const d=document.querySelector('.km6-c[open]');return d?{tr:!!d.querySelector('[data-mtr]'),pl:!!d.querySelector('.km6-ta [data-mpl]'),scn:[...d.querySelectorAll('.km6-scn em')].map(x=>x.textContent),sub:[...d.querySelectorAll('.km6-sub')].map(x=>x.innerText.replace(/\s+/g,' ')),rows:d.querySelectorAll('.kq[data-c]').length,n:+d.querySelector('.kn-en b').textContent}:null;});
  ok('карточка раскрылась: «Тренировать», «▶ подряд», «Сцена 1 / Сцена 2», эпизоды, все фразы',r&&r.tr&&r.pl&&r.scn.join()==='Сцена 1,Сцена 2'&&r.sub.length===3&&/Эпизод 1/i.test(r.sub[0])&&r.rows===r.n&&r.n===12,r);await shot(page,'2-card-open');
  // строка → окно (13.9.8): листание по фразам карточки; само ничего не играет, видео свёрнуто
  await click('.km6-c[open] .kq[data-c]');await page.waitForTimeout(1500);
  const wst=()=>ev(()=>{const v=document.querySelector('.kno2 video'),w=document.querySelector('.kn6-vw');return {play:!!(v&&!v.paused),vsrc:v&&v.getAttribute('src'),vw:!!(w&&w.classList.contains('on')),
    kp:!!document.querySelector('.kn2-en.kk-play'),on:document.querySelectorAll('.kn2-en .kk-on').length,wh:w?Math.round(w.getBoundingClientRect().height):0,pg:(document.querySelector('.kn2-pg')||{}).textContent};});
  r=await ev(()=>({o:!!document.querySelector('.kno2'),more:document.querySelector('.kn5-more').hidden,acts:[...document.querySelectorAll('.kn6-acts button')].map(b=>b.dataset.v),mb:!!document.querySelector('.kn2-b>.kn6-mb'),
    src:(document.querySelector('.kn6-src')||{}).textContent,ft:(document.querySelector('.kn6-ft .kn6-st')||{}).textContent,bb:window.__bb.slice(-1)[0]}));Object.assign(r,await wst());
  ok('строка → окно: «1 / 12», «Послушать · Смотреть · 🐢», «Подробнее» строкой, «фильм · эп.» сверху, статус внизу; само не играет, видео свёрнуто, «назад» показана',
    r.o&&/^1 \/ 12/.test(r.pg||'')&&r.more===true&&r.acts.join()==='hear,watch,slow'&&r.mb&&/эп\. \d/.test(r.src||'')&&/^(новая|учишь|пора|выучено)/.test(r.ft||'')&&!r.play&&!r.vsrc&&!r.vw&&r.wh<5&&r.bb===1,r);await shot(page,'3-window');
  await page.click('.kn6-acts [data-v="hear"]');await page.waitForTimeout(2000);r=await wst();
  ok('«Послушать» — играет звук, видео свёрнуто, слова фразы загораются',r.play&&!r.vw&&r.wh<5&&r.kp&&r.on>0,r);
  await page.click('.kn6-acts [data-v="watch"]');await page.waitForTimeout(1600);r=await wst();
  ok('«Смотреть» — видео раскрылось под кнопками и играет',r.play&&r.vw&&r.wh>100,r);await shot(page,'3b-watch');
  await page.click('.kn6-mb');await page.waitForTimeout(500);
  r=await ev(()=>({use:!!document.querySelector('.kn5-more .ph-use'),inside:!!document.querySelector('.kn5-more .kn2-st,.kn5-more .kn2-src,.kn5-more .kn6-st'),fact:!!document.querySelector('.kn5-more .ph-fact')}));
  ok('«Подробнее»: «Когда пригодится»; статуса, источника и открытого факта внутри нет',r.use&&!r.inside&&!r.fact,r);
  await ev(()=>document.querySelector('.kn2-nv.nx').click());await page.waitForTimeout(1300);r=await wst();
  ok('листнул — видео так и раскрыто, само не играет, «2 / 12»',r.vw&&!r.play&&/^2 \/ 12$/.test(r.pg||''),r);
  await page.click('.kno2 .kn2-x');await page.waitForTimeout(800);r=await ev(()=>({o:!!document.querySelector('.kno2'),bb:window.__bb.slice(-1)[0]}));ok('окно закрылось ×, «назад» снова спрятана',!r.o&&r.bb===0,r);
  // ▶ на кадре другой карточки — «подряд», карточка не раскрывается
  await page.locator('.km6-c').nth(1).locator('.kn-ew').click();await page.waitForTimeout(1500);
  r=await ev(()=>({auto:!!document.querySelector('.kno2.auto'),at:(document.querySelector('.kn2-at')||{}).textContent,open:document.querySelectorAll('.km6-c')[1].open,t:document.querySelectorAll('.km6-c')[1].querySelector('.kn-ex b').textContent.trim()}));Object.assign(r,await wst());
  ok('▶ на кадре — «смотреть подряд» этой карточки (играет само, видео раскрыто), сама карточка не раскрылась',r.auto&&r.at===r.t&&r.open===false&&r.play&&r.vw,r);await page.keyboard.press('Escape');await page.waitForTimeout(800);
  // открытые карточки помнятся при перерисовке; свернул — свернулась
  await ev(()=>DL.render(0));await page.waitForTimeout(700);r=await ev(()=>[...document.querySelectorAll('.km6-c')].map(d=>d.open));ok('после перерисовки открыта та же карточка',r[0]===true&&r.slice(1).every(x=>!x),r);
  await click('.km6-c[open] summary');await page.waitForTimeout(400);r=await ev(()=>document.querySelectorAll('.km6-c[open]').length);ok('карточка свернулась',r===0,String(r));
  // «Тренировать» карточки → без самопроверки → назад в «Мои», вид тот же
  await click('.km6-c summary');await page.waitForTimeout(500);await click('.km6-c[open] [data-mtr]');await page.waitForTimeout(1200);
  r=await ev(()=>({q:!!document.querySelector('.dl-q'),self:/Вспомни по-|Не вспомнил|Знал/.test(document.body.innerText),h:(document.querySelector('.page-head .title,.dl-q .sc-meta')||{}).textContent}));ok('«Тренировать» карточки — кубики/диктант, без самопроверки',r.q&&!r.self,r);
  await click('#dlx');await page.waitForTimeout(1500);r=await ev(()=>({lvl:($('#dlStage')||{dataset:{}}).dataset.lvl,cards:!!document.querySelector('#kmBody.km6-cards')}));ok('после тренировки — снова «Мои», карточки',r.lvl==='my'&&r.cards,r);
  // «По темам»: карточки тем, разные кадры, выбор помнится
  await click('[data-mby="topic"]');await page.waitForTimeout(800);
  r=await ev(()=>({n:document.querySelectorAll('.km6-c').length,lbl:[...document.querySelectorAll('.km6-c .kn-ex em')].every(x=>/^Тема/.test(x.textContent)),img:new Set([...document.querySelectorAll('.km6-c .kn-et')].map(x=>x.style.backgroundImage)).size,by:store.knMyBy}));
  ok('«По темам»: карточки тем, кадры разные, выбор сохранён',r.n>=3&&r.lbl&&r.img>=3&&r.by==='topic',r);await shot(page,'4-topics');
  await ev(()=>DL.render(0));await page.waitForTimeout(600);r=await ev(()=>(document.querySelector('.km6-by .on')||{dataset:{}}).dataset.mby);ok('«По темам» держится после перерисовки',r==='topic',r);
  // Б «Постеры»
  await click('[data-mv="posters"]');await page.waitForTimeout(1000);
  r=await ev(()=>({p:[...document.querySelectorAll('.km6-p')].map(x=>x.querySelector('b').textContent.trim()),chips:document.querySelectorAll('.km6-tps button').length,all:(document.querySelector('.km6-tps .on')||{}).textContent,v:store.knMyV}));
  ok('▦ → постеры своих фильмов, чипы тем («Все» выбран), выбор сохранён',r.p.length===Object.keys(T.F).length&&r.p.every(k=>T.F[k])&&r.chips>=4&&r.all==='Все'&&r.v==='posters',r);await shot(page,'5-posters');
  await page.locator('.km6-tps button').nth(1).click();await page.waitForTimeout(700);
  r=await ev(()=>{const on=document.querySelector('.km6-tps .on');return {chip:+on.querySelector('i').textContent,sum:[...document.querySelectorAll('.km6-p small')].reduce((a,x)=>a+parseInt(x.textContent),0)};});
  ok('чип темы: на постерах — фразы этой темы',r.chip>0&&r.sum===r.chip,r);await shot(page,'6-chip');
  // постер (с фильтром темы) → страница: шапка, тема снимается крестиком
  await click('.km6-p');await page.waitForTimeout(1000);r=await ev(()=>({sh:!!document.querySelector('.km6-sh'),tpx:!!document.querySelector('.km6-tpx'),bb:window.__bb.slice(-1)[0]}));
  ok('постер → страница фильма, тема-фильтр видна чипом, «назад» показана',r.sh&&r.tpx&&r.bb===1,r);
  await click('.km6-tpx');await page.waitForTimeout(700);r=await ev(()=>({tpx:!!document.querySelector('.km6-tpx'),sh:!!document.querySelector('.km6-sh')}));ok('✕ на теме — страница того же фильма без фильтра',!r.tpx&&r.sh,r);
  await page.click('.km6-cr [data-mup]');await page.waitForTimeout(900);
  r=await ev(()=>({g:!!document.querySelector('.km6-g'),sh:!!document.querySelector('.km6-sh'),all:(document.querySelector('.km6-tps .on')||{}).textContent,bb:window.__bb.slice(-1)[0]}));
  ok('«‹» (настоящий клик) → сетка постеров, тема сброшена, «назад» спрятана',r.g&&!r.sh&&r.all==='Все'&&r.bb===0,r);
  // Волк → страница как сцена Кинотеки: 2 сцены, 3 эпизода, свёрнуты; эпизод раскрылся — свои фразы; листание — по всему фильму
  await page.locator('.km6-p',{hasText:'Волк'}).first().click();await page.waitForTimeout(1000);
  r=await ev(()=>({h:(document.querySelector('.km6-sh .kn-hn')||{}).textContent,scn:document.querySelectorAll('.km6-scn.big').length,eps:[...document.querySelectorAll('.km6-e')].map(d=>[+d.querySelector('.kn-en b').textContent,d.open]),tr:!!document.querySelector('.km6-sh [data-mtr]'),pl:!!document.querySelector('.km6-sh .kn-hw[data-mpl]')}));
  ok('страница Волка: шапка (кадр ▶, «Тренировать»), 2 сцены, 3 эпизода 6/3/3, все свёрнуты',r.h==='Волк с Уолл-стрит'&&r.scn===2&&r.eps.map(x=>x[0]).join()==='6,3,3'&&r.eps.every(x=>!x[1])&&r.tr&&r.pl,r);await shot(page,'7-film');
  await click('.km6-e summary');await page.waitForTimeout(700);r=await ev(()=>{const d=document.querySelector('.km6-e[open]');return d?d.querySelectorAll('.kq[data-c]').length:0;});ok('эпизод раскрылся — 6 своих фраз',r===6,String(r));await shot(page,'8-film-ep');
  await click('.km6-e[open] .kq[data-c]');await page.waitForTimeout(1400);r=await ev(()=>(document.querySelector('.kn2-pg')||{}).textContent);ok('окно с страницы фильма листает весь фильм: «1 / 12»',/^1 \/ 12/.test(r||''),r);
  await page.keyboard.press('Escape');await page.waitForTimeout(800);
  await ev(()=>onBack());await page.waitForTimeout(900);r=await ev(()=>({g:!!document.querySelector('.km6-g'),sh:!!document.querySelector('.km6-sh')}));ok('«назад» Телеграма со страницы → сетка',r.g&&!r.sh,r);
  // поиск — фразы и слова вместе
  await page.fill('#kmQ','client');await page.waitForTimeout(800);
  r=await ev(()=>({sec:[...document.querySelectorAll('.km6-sr .km5-h')].map(x=>x.firstChild.textContent.trim()),ph:document.querySelectorAll('.km6-sr .kq[data-c]').length,w:document.querySelectorAll('.km6-sr .kqw').length,x:!document.querySelector('[data-mqx]').hidden}));
  ok('поиск «client»: разделы «Фразы» и «Слова», ✕ видна',r.sec.join()==='Фразы,Слова'&&r.ph>0&&r.w>0&&r.x,r);await shot(page,'9-search');
  await page.fill('#kmQ','работ');await page.waitForTimeout(800);r=await ev(()=>document.querySelectorAll('.km6-sr .kq[data-c]').length);ok('поиск по теме («работ») находит фразы',r>3,String(r));
  await page.click('[data-mqx]');await page.waitForTimeout(700);r=await ev(()=>({q:document.querySelector('#kmQ').value,g:!!document.querySelector('.km6-g'),x:document.querySelector('[data-mqx]').hidden}));ok('✕ очищает поиск — снова постеры',r.q===''&&r.g&&r.x,r);
  // слова: постеры + «Добавлено мной»; карточки по фильмам и темам; окно слова
  await click('[data-mk="w"]');await page.waitForTimeout(1100);
  r=await ev(()=>({p:[...document.querySelectorAll('.km6-p b')].map(x=>x.textContent.trim()),own:!!document.querySelector('.km6-own'),fab:!!document.querySelector('.km-fab')}));
  ok('слова, постеры: Волк, Психопат и «Добавлено мной» последним, «＋»',r.p.join()==='Волк с Уолл-стрит,Американский психопат,Добавлено мной'&&r.own&&r.fab,r);await shot(page,'10-words-posters');
  await click('[data-mv="cards"]');await page.waitForTimeout(900);
  r=await ev(()=>[...document.querySelectorAll('.km6-c')].map(d=>d.querySelector('.kn-ex b').textContent.trim()+':'+d.querySelector('.kn-en b').textContent));
  ok('слова, карточки «По темам»: свой #работа — в «Работе»',r.some(x=>/Работа:([2-9])/.test(x)),r);
  await click('[data-mby="film"]');await page.waitForTimeout(700);
  r=await ev(()=>[...document.querySelectorAll('.km6-c')].map(d=>d.querySelector('.kn-ex b').textContent.trim()));ok('слова, «По фильмам»: «Добавлено мной» — последней',r[r.length-1]==='Добавлено мной'&&r.length===3,r);await shot(page,'11-words-cards');
  await click('.km6-c summary');await page.waitForTimeout(600);await click('.km6-c[open] .kqw');await page.waitForTimeout(1300);
  r=await ev(()=>({w:(document.querySelector('.kn2-word')||{}).textContent,more:document.querySelector('.kn5-more').hidden,del:!!document.querySelector('.kn5-more .kn2-del'),acts:[...document.querySelectorAll('.kn6-acts button')].map(b=>b.dataset.v)}));Object.assign(r,await wst());
  ok('слово → окно: «🔊 Слово · ▶ Смотреть», само не играет, «Убрать» спрятано под «Подробнее»',!!r.w&&r.more===true&&r.del&&r.acts.join()==='word,watch'&&!r.play&&!r.vw,r);await page.keyboard.press('Escape');await page.waitForTimeout(600);
  await click('[data-mk="ph"]');await page.waitForTimeout(800);
  // «✦ Интересный факт» — свёрнут, нажал — виден (фраза с фактом; админ видит факты)
  const fx=await ev(()=>{const c=dxScenes().flatMap(s=>DL.cards(s)).find(c=>c.got&&c.f.fact);return c&&c.k;});
  if(fx){await ev(k=>{const q=document.querySelector(`.kq[data-c="${k}"]`);q.closest('details').open=true;},fx);await page.waitForTimeout(400);await click(`.kq[data-c="${fx}"]`);await page.waitForTimeout(1300);
    if(await ev(()=>document.querySelector('.kn5-more').hidden))await page.click('.kn6-mb');await page.waitForTimeout(400);
    const f0=await ev(()=>({b:!!document.querySelector('.kn6-fact button'),h:(document.querySelector('.kn6-fact p')||{}).hidden}));await page.click('.kn6-fact button');await page.waitForTimeout(400);
    r=await ev(()=>({h:document.querySelector('.kn6-fact p').hidden,ex:document.querySelector('.kn6-fact button').getAttribute('aria-expanded'),t:document.querySelector('.kn6-fact p').textContent.length}));
    ok('«✦ Интересный факт» свёрнут, нажал — раскрылся',f0.b&&f0.h===true&&r.h===false&&r.ex==='true'&&r.t>20,{f0,...r});await page.keyboard.press('Escape');await page.waitForTimeout(700);}
  else ok('есть собранная фраза с фактом',false,'нет');
  // окошко слова в окне фразы — без дубля объяснения (13.9.4)
  const fk=await ev(()=>{for(const s of SCENES){const P=scP(s.id);for(const p of s.parts)for(const f of p.ph)if((P.got||{})[f.id]&&idWhole(phIdiom(f),f)&&kwWrap(f,scT(f)).includes('class="sw"'))return s.id+'|'+f.id;}return null;});
  ok('есть собранная фраза, где «выражение» = вся фраза',!!fk,fk);
  await ev(()=>{document.querySelectorAll('.km6-c').forEach(d=>d.open=true);});await page.waitForTimeout(400);
  await click(`.km6-c .kq[data-c="${fk}"]`);await page.waitForTimeout(1500);
  await page.locator('.kno2 .kn2-en .sw').first().click();await page.waitForTimeout(700);
  r=await ev(()=>{const p=document.querySelector('.kw-pop.on');return p?{dup:/Тут это часть выражения/i.test(p.innerText),inph:/Во фразе/i.test(p.innerText)}:null;});
  ok('слово в открытой фразе: без «Тут это часть выражения» и без «Во фразе»',r&&!r.dup&&!r.inph,r);
  await ev(()=>kwHide(0));await page.waitForTimeout(300);await page.keyboard.press('Escape');await page.waitForTimeout(800);
  // логика idWhole на всех фразах (настоящее выражение внутри фразы — как раньше)
  r=await ev(()=>{const all=[];SCENES.forEach(s=>s.parts.forEach(p=>p.ph.forEach(f=>{const id=phIdiom(f);if(id)all.push([f,id]);})));
    const whole=all.filter(([f,id])=>idWhole(id,f)),part=all.filter(([f,id])=>!idWhole(id,f));
    const pop=(f,w)=>{const host=document.createElement('div'),el=document.createElement('i');el.className='sw';el.textContent=w;host.appendChild(el);document.body.appendChild(host);wordShow(el,f,true);const t=KWP.innerText;kwHide(0);host.remove();return t;};
    const [fw,iw]=whole[0],[fp,ip]=part.find(([f,id])=>id.words.some(w=>phNorm(f.en).split(' ').includes(w)))||[];
    const tw=pop(fw,iw.words[0]),tp=fp?pop(fp,ip.words.find(w=>phNorm(fp.en).split(' ').includes(w))):'';
    return {whole:whole.length,part:part.length,wDup:/Тут это часть выражения/i.test(tw),wIn:/Во фразе/i.test(tw),pDup:/Тут это часть выражения/i.test(tp),pIn:/Во фразе/i.test(tp)};});
  ok('окошко слова: «выражение» = вся фраза — только «Во фразе»; настоящее выражение — как раньше',r.whole>300&&r.part>100&&!r.wDup&&r.wIn&&r.pDup&&r.pIn,r);
  // уход со словаря — видео не играет
  await ev(()=>renderTab('learn'));await page.waitForTimeout(800);
  r=await ev(()=>[...document.querySelectorAll('video')].filter(v=>!v.paused).length);ok('ушёл со словаря — ничего не играет',r===0,String(r));
  // без анимаций: оба вида рисуются, карточка раскрывается
  await ev(()=>{store.fx=false;DX.seg='my';store.knMyV='cards';renderTab('dict');});await page.waitForTimeout(1200);
  const was=await ev(()=>document.querySelectorAll('.km6-c[open]').length);await click('.km6-c summary');await page.waitForTimeout(300);
  r=await ev(()=>({on:document.querySelectorAll('.km6-c[open]').length,n:document.querySelectorAll('.km6-c').length}));ok('без анимаций: карточки рисуются и раскрываются',r.n>2&&r.on!==was,{was,...r});
  await click('[data-mv="posters"]');await page.waitForTimeout(500);r=await ev(()=>document.querySelectorAll('.km6-p').length);ok('без анимаций: постеры рисуются',r>2,String(r));
  ok('консоль чистая',!errs.length,errs.slice(0,5).join(' | '));
  console.log(fails?`ИТОГ: ${fails} FAIL`:'ИТОГ: всё PASS');await b.close();})();
