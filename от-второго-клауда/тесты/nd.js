// 13.9.24: редизайн «Новый» (рабочее название «Без субтитров»). Только админ, Настройки → «Дизайн (на пробу)» → «Новый»; откат — «Сейчас».
// Проверки: светлый/тёмный по теме Telegram (и смена темы на лету), шапка Telegram = фон вида; вкладки «Сегодня · Кино · Словарь · Профиль»
// (Игр нет — вход из Профиля); «Сегодня»: приветствие, кольцо цели, план на кадре, «Потяни, чтобы начать» (тап — не стартует, потянул — эпизод);
// метки уровня A1…C1 на постерах; Профиль: карточка, цифры, строки, «Игры» → игры; «Сейчас» — всё как было (подписи вкладок, Игры, Главная);
// не-админ — вида нет; без анимаций — без анимаций; ничего не вылезает вбок; консоль чистая. Скрины — shots/nd-<тема>-<устройство>-<экран>.png
const {open}=require('./st');const {chromium}=require('playwright');const fs=require('fs');
const dev=process.argv[2]||'ph';
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
const init=([st,fl])=>{if(!sessionStorage.getItem('__seeded')){sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify(fl));}
  const W=window.Telegram&&Telegram.WebApp;if(W){W.setHeaderColor=c=>{window.__hc=c;};W.setBackgroundColor=c=>{window.__bc=c;};}};
const base={onboarded:true,introV:1,unl:1,snd:false,fx:true,knWin:'sheet',wtapHint:1,lvl:'b',tourV:1,scSubChosen:1,autoSc:false,look:'nd'};
(async()=>{const b=await chromium.launch();const vp=dev==='pc'?{width:1440,height:900}:{width:390,height:844};
  if(!fs.existsSync(__dirname+'/shots'))fs.mkdirSync(__dirname+'/shots');
  const go=async(st,fl,scheme)=>{const A=await open({browser:b,uid:111,name:'Андрей',platform:dev==='pc'?'tdesktop':'ios',touch:dev!=='pc',ctx:{viewport:vp,colorScheme:scheme||'light'},wait:2200,init,initArg:[st,fl]});
    await A.page.evaluate(()=>{const s=scOf('wolf-of-wall-street'),P=scP(s.id);P.got=P.got||{};P.w[0]=1;P.done=[0];P.st=P.st||{};P.st[0]=3;P.r=P.r||{};
      scAct(s.parts[0].ph).forEach(f=>{P.got[f.id]=Date.now()-864e5;P.m[f.id]=1;P.r[f.id]=[1,Date.now()-1];});scSave();store.scLast={id:s.id,i:1};save();});
    return A;};
  const shot=async(P,n)=>{await P.evaluate(()=>{window.scrollTo(0,0);document.querySelectorAll('.toast').forEach(t=>t.remove());});await P.waitForTimeout(250);await P.screenshot({path:`${__dirname}/shots/nd-${n}.png`});};
  const st=P=>P.evaluate(()=>({look:document.body.dataset.look||'',ndt:document.body.dataset.ndt||'',nd:document.body.classList.contains('nd'),hc:(window.__hc||'').toLowerCase(),w:document.documentElement.scrollWidth<=innerWidth+1,
    tabs:[...document.querySelectorAll('#tabbar button')].filter(x=>getComputedStyle(x).display!=='none').map(x=>x.textContent.trim())}));
  // 1. светлая тема (Telegram светлый)
  const A=await go(base,{admin:true,flags:{}},'light'),P=A.page;
  await P.evaluate(()=>renderTab('learn'));await P.waitForTimeout(1200);
  let r=await st(P);
  ok('светлый «Новый»: вид nd, тема light, шапка Telegram #f4f3ef, вкладки «Сегодня · Кино · Словарь · Профиль», ничего не вылезает',r.look==='nd'&&r.ndt==='light'&&r.hc==='#f4f3ef'&&r.tabs.join('|')==='Сегодня|Кино|Словарь|Профиль'&&r.w,r);
  r=await P.evaluate(()=>({hi:(document.querySelector('.ndh-t b')||{}).textContent||'',ring:!!document.querySelector('#hDay.ndring'),plan:(document.querySelector('.ndp-t')||{}).textContent||'',lvl:(document.querySelector('.ndp .lvc')||{}).textContent||'',
    pull:!!document.querySelector('#ndPull'),font:!!document.getElementById('lkf-nd'),posters:document.querySelectorAll('.hposter .lvc').length,lvcVis:(()=>{const e=document.querySelector('.hposter .lvc');return e&&getComputedStyle(e).display;})(),old:!!document.querySelector('.hh,#hCont')}));
  ok('«Сегодня»: приветствие по имени, кольцо цели, «Эпизод «Фугази»», уровень B2, «Потяни», шрифт подключён, метки уровня на постерах, старого кадра нет',/Андрей/.test(r.hi)&&r.ring&&/Фугази/.test(r.plan)&&r.lvl==='B2'&&r.pull&&r.font&&r.posters>3&&r.lvcVis&&r.lvcVis!=='none'&&!r.old,r);
  await shot(P,`light-${dev}-1-today`);
  // «Потяни»: тап — не стартует (ручка подпрыгивает), потянул на 40 % — возвращается, до конца — эпизод
  await P.evaluate(()=>{window.__ep=null;const o=renderScEp;renderScEp=function(id,i){window.__ep=[id,i];return o.apply(this,arguments);};});
  const box=await P.locator('#ndPull').boundingBox();const k=await P.locator('.ndpull-k').boundingBox();
  const y=k.y+k.height/2,x0=k.x+k.width/2;
  await P.mouse.click(x0,y);await P.waitForTimeout(400);
  r=await P.evaluate(()=>({ep:window.__ep,nudge:document.querySelector('#ndPull').classList.contains('nudge')}));
  ok('тап по «Потяни» не запускает, ручка подпрыгивает',!r.ep&&r.nudge,r);
  await P.mouse.move(x0,y);await P.mouse.down();await P.mouse.move(x0+box.width*.35,y,{steps:6});await P.mouse.up();await P.waitForTimeout(700);
  r=await P.evaluate(()=>({ep:window.__ep,tr:document.querySelector('.ndpull-k').style.transform}));
  ok('потянул на треть — не запускает, ручка вернулась',!r.ep&&!r.tr,r);
  await P.mouse.move(x0,y);await P.mouse.down();await P.mouse.move(box.x+box.width-10,y,{steps:10});await P.mouse.up();await P.waitForTimeout(900);
  r=await P.evaluate(()=>({ep:window.__ep,scr:document.body.dataset.scr}));
  ok('потянул до конца — открылся эпизод 2 «Волка»',r.ep&&r.ep[0]==='wolf-of-wall-street'&&r.ep[1]===1,r);
  r=await st(P);ok('эпизод — в виде «Новый», шапка Telegram светлая',r.look==='nd'&&r.ndt==='light'&&r.hc==='#f4f3ef',r);
  // 2. остальные экраны
  const SCR=[['2-kino',()=>renderTab('kino')],['3-dict',()=>renderTab('dict')],['4-prof',()=>renderTab('profile')],['5-scene',()=>renderScene('wolf-of-wall-street')],['7-quiz',()=>renderScQuiz('wolf-of-wall-street',0)]];
  const bad=[];for(const [n,f] of SCR){await P.evaluate(f);await P.waitForTimeout(n==='3-dict'?2600:1300);r=await st(P);if(r.look!=='nd'||r.ndt!=='light'||!r.w)bad.push(n+' '+JSON.stringify(r));await shot(P,`light-${dev}-${n}`);}
  ok('Кино, Словарь, Профиль, сцена, проверка — в «Новом», ничего не вылезает',!bad.length,bad);
  r=await P.evaluate(()=>{renderTab('kino');return {k:document.querySelectorAll('.kposter .lvc').length,vis:(()=>{const e=document.querySelector('.kposter .lvc');return e&&getComputedStyle(e).display;})()};});
  ok('Кино: метки уровня на постерах',r.k>3&&r.vis&&r.vis!=='none',r);
  // 3. Профиль: карточка, 4 цифры, строки; «Игры» → игры; тап по карточке — «как тебя видят друзья»
  await P.evaluate(()=>renderTab('profile'));await P.waitForTimeout(1500);
  r=await P.evaluate(()=>({card:!!document.querySelector('.ndpc'),n:[...document.querySelectorAll('.ndst b')].map(x=>x.textContent),rows:[...document.querySelectorAll('.ndl-r b')].map(x=>x.textContent),old:!!document.querySelector('.phead')}));
  ok('Профиль: карточка, 4 цифры (эпизоды 1, фразы 6), строки Коллекция · Игры · Билеты · Достижения · Настройки · Как пользоваться · Админ-панель',r.card&&r.n[0]==='1'&&r.n[1]==='6'&&r.rows.join('|')==='Коллекция|Игры|Билеты|Достижения|Настройки|Как пользоваться|Админ-панель'&&!r.old,r);
  await P.click('#ndPc .ndpc-n');await P.waitForTimeout(600);
  ok('тап по карточке — «как тебя видят друзья»',await P.evaluate(()=>!!document.querySelector('.pfv')));
  await P.keyboard.press('Escape');await P.waitForTimeout(500);await P.evaluate(()=>document.querySelectorAll('.pfv').forEach(x=>x.remove()));
  await P.click('#pfGames');await P.waitForTimeout(1000);
  r=await st(P);r.tab=await P.evaluate(()=>store.tab);
  ok('«Игры» из Профиля → вкладка игр (там обычный вид), в капсуле вкладок «Игр» нет',r.tab==='games'&&!r.look&&r.nd&&!r.tabs.includes('Игры'),r);
  await P.evaluate(()=>renderTab('profile'));await P.waitForTimeout(500);
  await P.click('#pfColl');await P.waitForTimeout(800);ok('«Коллекция» из Профиля',await P.evaluate(()=>screen==='coll'));
  // 4. смена темы Telegram на лету → тёмный
  await P.evaluate(()=>{Telegram.WebApp.colorScheme='dark';renderTab('learn');});await P.waitForTimeout(600);
  r=await st(P);ok('Telegram тёмный (colorScheme) — тёмный «Новый», шапка #0f0f11',r.ndt==='dark'&&r.hc==='#0f0f11',r);
  await P.evaluate(()=>{Telegram.WebApp.colorScheme='light';Telegram.WebApp.__fire('themeChanged');});await P.waitForTimeout(300);
  r=await st(P);ok('themeChanged → снова светлый без перезахода',r.ndt==='light'&&r.hc==='#f4f3ef',r);
  // 5. Настройки: «Новый» в переключателе; «Сейчас» — откат: подписи вкладок, Игры, Главная — как были
  await P.evaluate(()=>renderSettings());await P.waitForTimeout(600);
  r=await P.evaluate(()=>[...document.querySelectorAll('[data-seg="look"] button')].map(x=>x.textContent+(x.getAttribute('aria-pressed')==='true'?'*':'')));
  ok('Настройки: Сейчас / Новый* / Свет / Ночь / Журнал',r.join('|')==='Сейчас|Новый*|Свет|Ночь|Журнал',r);
  await P.click('[data-seg="look"] [data-v="cur"]');await P.evaluate(()=>renderTab('learn'));await P.waitForTimeout(900);
  r=await st(P);r.hh=await P.evaluate(()=>!!document.querySelector('.hh #hCont')&&!document.querySelector('.ndp'));
  ok('«Сейчас» — откат: вида нет, вкладки «Главная · Кинозал · Словарь · Игры · Профиль», Главная прежняя',!r.look&&!r.nd&&r.tabs.join('|')==='Главная|Кинозал|Словарь|Игры|Профиль'&&r.hh,r);
  await P.evaluate(()=>renderTab('profile'));await P.waitForTimeout(500);
  ok('«Сейчас»: Профиль прежний',await P.evaluate(()=>!!document.querySelector('.phead')&&!document.querySelector('.ndpc')));
  // 6. тёмная тема с запуска, скрины; без анимаций
  const D=await go(Object.assign({},base,{fx:false}),{admin:true,flags:{}},'dark'),Q=D.page;
  await Q.evaluate(()=>renderTab('learn'));await Q.waitForTimeout(1200);
  r=await st(Q);r.anim=await Q.evaluate(()=>getComputedStyle(document.querySelector('.ndp-img')).animationName+'|'+getComputedStyle(document.querySelector('.ndpull-k')).animationName);
  ok('тёмный с запуска; «без анимаций» — кадр и ручка стоят',r.look==='nd'&&r.ndt==='dark'&&r.hc==='#0f0f11'&&r.anim==='none|none',r);
  await Q.evaluate(()=>{store.fx=true;save();applyFx();renderTab('learn');});await Q.waitForTimeout(1200);await shot(Q,`dark-${dev}-1-today`);
  for(const [n,f] of [['2-kino',()=>renderTab('kino')],['4-prof',()=>renderTab('profile')],['6-ep',()=>renderScEp('wolf-of-wall-street',1)]]){await Q.evaluate(f);await Q.waitForTimeout(1400);
    if(n==='6-ep')await Q.evaluate(()=>{const v=document.querySelector('video');if(v){try{v.pause();v.currentTime=21;}catch(e){}}});await shot(Q,`dark-${dev}-${n}`);}
  // 7. не-админ: вида нет, «Игры» на месте
  const N=await go(base,{admin:false,flags:{}},'light');await N.page.evaluate(()=>renderTab('learn'));await N.page.waitForTimeout(900);
  r=await st(N.page);ok('не-админ: «Новый» не включается, вкладки прежние',!r.look&&!r.nd&&r.tabs.includes('Игры')&&r.tabs[0]==='Главная',r);
  ok('консоль чистая',![...A.errs,...D.errs,...N.errs].length,[...A.errs,...D.errs,...N.errs].slice(0,5));
  console.log(fails?`ИТОГ ${dev}: FAIL ${fails}`:`ИТОГ ${dev}: всё PASS`);await b.close();process.exit(fails?1:0);})();
