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
const base={onboarded:true,introV:1,unl:1,snd:false,fx:true,knWin:'sheet',wtapHint:1,lvl:'b',tourV:1,scSubChosen:1,autoSc:false,look:'nd',lookV:2};
(async()=>{const b=await chromium.launch();const vp=dev==='pc'?{width:1440,height:900}:{width:390,height:844};
  if(!fs.existsSync(__dirname+'/shots'))fs.mkdirSync(__dirname+'/shots');
  const go=async(st,fl,scheme,ndDefault)=>{const A=await open({browser:b,uid:111,ndDefault,name:'Андрей',platform:dev==='pc'?'tdesktop':'ios',touch:dev!=='pc',ctx:{viewport:vp,colorScheme:scheme||'light'},wait:2200,init,initArg:[st,fl]});
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
  r=await P.evaluate(()=>({hi:(document.querySelector('.n-hello b')||{}).textContent||'',ring:!!document.querySelector('#hDay.n-ring'),plan:(document.querySelector('.n-hero h3')||{}).textContent||'',lvl:(document.querySelector('.n-hero .n-chip')||{}).textContent||'',
    pull:!!document.querySelector('#ndPull'),font:!!document.getElementById('lkf-nd'),css:document.body.classList.contains('ndc'),shelves:document.querySelectorAll('.n-today .hposter,.n-today .hchips,.n-today .hsec').length,pod:!!document.querySelector('.n-today .n-row[data-go="pod"]'),next:!!document.querySelector('.n-today .n-row[data-go="next"]'),old:!!document.querySelector('.hh,#hCont,.ndp')}));
  ok('«Сегодня» по макету (13.9.37): приветствие по имени, кольцо цели, «Эпизод «Фугази»», уровень B2, «Потяни», шрифт и nd.css; строки «Фраза дня» и «Смотреть дальше»; полок и старого кадра нет',/Андрей/.test(r.hi)&&r.ring&&/Фугази/.test(r.plan)&&r.lvl==='B2'&&r.pull&&r.font&&r.css&&!r.shelves&&r.pod&&r.next&&!r.old,r);
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
  r=await st(P);ok('эпизод — в виде «Новый», с плеером всегда тёмный (шапка Telegram #0f0f11)',r.look==='nd'&&r.ndt==='dark'&&r.hc==='#0f0f11',r);
  // 2. остальные экраны
  const SCR=[['2-kino',()=>renderTab('kino')],['3-dict',()=>renderTab('dict')],['4-prof',()=>renderTab('profile')],['5-scene',()=>renderScene('wolf-of-wall-street')],['7-quiz',()=>renderScQuiz('wolf-of-wall-street',0)]];
  const bad=[];for(const [n,f] of SCR){await P.evaluate(f);await P.waitForTimeout(n==='3-dict'?2600:1300);r=await st(P);if(r.look!=='nd'||r.ndt!=='light'||!r.w)bad.push(n+' '+JSON.stringify(r));await shot(P,`light-${dev}-${n}`);}
  ok('Кино, Словарь, Профиль, сцена, проверка — в «Новом», ничего не вылезает',!bad.length,bad);
  // «Кино» по макету (13.9.39): поиск, сегмент разделов с едущей плашкой, уровни, сетка постеров с меткой уровня и полоской
  await P.evaluate(()=>{store.kinoCat='film';store.kinoLang='en';store.kinoLv='all';renderTab('kino');});await P.waitForTimeout(900);
  const kq=()=>P.evaluate(()=>({po:document.querySelectorAll('.n-kino .n-po').length,lv:[...document.querySelectorAll('.n-kino .n-po .n-chip')].map(x=>x.textContent),
    seg:[...document.querySelectorAll('.n-sg button')].map(x=>x.textContent+(x.classList.contains('on')?'*':'')).join('|'),pill:(document.querySelector('.n-sg i')||{}).style?.transform||'',
    lbl:(document.querySelector('.n-lbl span')||{}).textContent||'',old:document.querySelectorAll('.kposter,.kgrid').length,sr:!!document.querySelector('.n-srch'),kl:document.querySelectorAll('.n-kl button').length}));
  r=await kq();
  ok('Кино: поиск, сегмент «Фильмы* | Сериалы | Интервью», постеры с меткой уровня, язык EN/DE, старой сетки нет',r.sr&&/^Фильмы\*\|Сериалы\|Интервью/.test(r.seg)&&r.po>=3&&r.lv.every(x=>/^[ABC][12]$/.test(x))&&r.kl===2&&!r.old,r);
  const nFilm=r.po;await P.click('.n-sg button[data-cat="series"]');await P.waitForTimeout(700);r=await kq();
  ok('Кино: «Сериалы» — плашка уехала, сетка сменилась, вкладка не перерисована целиком',/Сериалы\*/.test(r.seg)&&/translateX\(100%\)/.test(r.pill)&&r.po>=2,r);
  await P.evaluate(()=>{store.cefr='B1';store.kinoLv='';renderTab('kino');});await P.waitForTimeout(700);r=await kq();
  const meLbl=r.lbl,meN=r.po;await P.evaluate(()=>{const b=[...document.querySelectorAll('.n-lv [data-lv]')].find(x=>x.dataset.lv!=='all');b&&b.click();});await P.waitForTimeout(500);r=await kq();
  ok('Кино: «Для твоего уровня» → тап по уровню — только этот уровень',/твоего/.test(meLbl)&&/^Уровень [ABC][12]$/.test(r.lbl)&&r.po<=meN,{meLbl,meN,r});
  await P.click('.n-lv [data-lv="all"]');await P.waitForTimeout(500);r=await kq();ok('Кино: «Все уровни»',r.lbl==='Все уровни'&&r.po>=meN,r);
  await P.click('.n-sg button[data-cat="film"]');await P.waitForTimeout(500);
  await P.evaluate(()=>{window.__sc=null;const o=renderScene;renderScene=function(id){window.__sc=id;return o.apply(this,arguments);};});
  await P.click('.n-kino .n-po[data-sc]');await P.waitForTimeout(900);r=await P.evaluate(()=>({sc:window.__sc,scr:document.body.dataset.scr}));
  ok('Кино: тап по постеру — страница сцены',!!r.sc&&r.scr==='scene',r);
  await P.evaluate(()=>renderTab('kino'));await P.waitForTimeout(600);await P.click('.n-kl [data-kl="de"]');await P.waitForTimeout(800);
  r=await P.evaluate(()=>({kl:store.kinoLang,de:[...document.querySelectorAll('.n-kino .n-po')].every(b=>{const s=b.dataset.sc?scOf(b.dataset.sc):SCENES.find(x=>x.show===b.dataset.show);return s&&s.lang==='de';}),n:document.querySelectorAll('.n-kino .n-po').length}));
  ok('Кино: DE — только немецкие сцены',r.kl==='de'&&r.de&&r.n>0,r);
  await P.evaluate(()=>{store.kinoLang='en';store.kinoCat='film';store.kinoLv='';save();});
  // страница сцены по макету (13.9.39): кадр во всю ширину, «‹», метки, одна кнопка, эпизоды строками; закрытые — под дымкой, не открываются
  await P.evaluate(()=>{store.admPlayer=true;renderScene('wolf-of-wall-street');});await P.waitForTimeout(1000);
  r=await P.evaluate(()=>{const h=document.querySelector('.n-shero').getBoundingClientRect();return {hero:h.left<=1&&h.right>=innerWidth-1||innerWidth>=700,
    btn:(document.querySelector('#scgo')||{}).textContent||'',eps:document.querySelectorAll('.n-ep[data-i]').length,lock:document.querySelectorAll('.n-ep.lock[data-i]').length,cur:document.querySelectorAll('.n-ep.cur').length,
    boss:!!document.querySelector('#scBoss'),old:document.querySelectorAll('.pn,.sc-ban,.sc-top').length,lst:document.querySelectorAll('.n-lst>button').length};});
  ok('Сцена: кадр во всю ширину, «▶ Смотреть эпизод 2 · Фугази», 6 эпизодов (текущий обведён, 4 под дымкой), финал, список ниже, старой разметки нет',r.hero&&/Смотреть эпизод 2 · Фугази/.test(r.btn)&&r.eps===6&&r.cur===1&&r.lock===4&&r.boss&&!r.old&&r.lst>=1,r);
  await P.evaluate(()=>{window.__ep=null;});await P.click('.n-ep.lock[data-i="3"]');await P.waitForTimeout(500);
  r=await P.evaluate(()=>({ep:window.__ep,shk:document.querySelector('.n-ep[data-i="3"]').classList.contains('shk')}));
  ok('Сцена: закрытый эпизод не открывается — строка трясётся',!r.ep&&r.shk,r);
  await P.click('#scgo');await P.waitForTimeout(900);r=await P.evaluate(()=>window.__ep);
  ok('Сцена: кнопка — эпизод 2',r&&r[1]===1,r);
  await P.evaluate(()=>renderScene('wolf-of-wall-street'));await P.waitForTimeout(700);await P.click('#scb');await P.waitForTimeout(700);
  ok('Сцена: «‹» — в «Кино»',await P.evaluate(()=>!!document.querySelector('.n-kino')));
  await P.evaluate(()=>{store.admPlayer=false;renderShow('Клан Сопрано');});await P.waitForTimeout(900);
  r=await P.evaluate(()=>({rows:document.querySelectorAll('.n-show .n-ep[data-sc]').length,btn:!!document.querySelector('.n-show #shGo'),old:document.querySelectorAll('.sh-hero,.kposter').length}));
  ok('Сериал: как сцена — кадр, кнопка, сцены строками',r.rows>=3&&r.btn&&!r.old,r);
  await P.click('.n-show .n-ep[data-sc]');await P.waitForTimeout(900);ok('Сериал: тап по строке — сцена',await P.evaluate(()=>document.body.dataset.scr==='scene'));
  // 3. Профиль: карточка, 4 цифры, строки; «Игры» → игры; тап по карточке — «как тебя видят друзья»
  await P.evaluate(()=>renderTab('profile'));await P.waitForTimeout(1500);
  r=await P.evaluate(()=>({card:!!document.querySelector('.ndpc'),n:[...document.querySelectorAll('.ndst b')].map(x=>x.textContent),rows:[...document.querySelectorAll('.ndl-r b')].map(x=>x.textContent),old:!!document.querySelector('.phead')}));
  ok('Профиль: карточка, 4 цифры (эпизоды 1, фразы 6), строки Премиум · Коллекция · Билеты · Достижения · Настройки · Как пользоваться · Админ-панель · Вернуть старый дизайн',r.card&&r.n[0]==='1'&&r.n[1]==='6'&&r.rows.join('|')==='Премиум|Коллекция|Билеты|Достижения|Настройки|Как пользоваться|Админ-панель|Вернуть старый дизайн'&&!r.old,r);
  await P.click('#ndPc .ndpc-n');await P.waitForTimeout(600);
  ok('тап по карточке — «как тебя видят друзья»',await P.evaluate(()=>!!document.querySelector('.pfv')));
  await P.keyboard.press('Escape');await P.waitForTimeout(500);await P.evaluate(()=>document.querySelectorAll('.pfv').forEach(x=>x.remove()));
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
  ok('Настройки: Новый* / Как было',r.join('|')==='Новый*|Как было',r);
  await P.click('[data-seg="look"] [data-v="cur"]');await P.evaluate(()=>renderTab('learn'));await P.waitForTimeout(900);
  r=await st(P);r.hh=await P.evaluate(()=>!!document.querySelector('.hh #hCont')&&!document.querySelector('.n-today'));
  ok('«Как было» — откат: вида нет, вкладки «Главная · Кинозал · Словарь · Профиль», Главная прежняя',!r.look&&!r.nd&&r.tabs.join('|')==='Главная|Кинозал|Словарь|Профиль'&&r.hh,r);
  await P.evaluate(()=>renderTab('profile'));await P.waitForTimeout(500);
  ok('«Как было»: Профиль прежний',await P.evaluate(()=>!!document.querySelector('.phead')&&!document.querySelector('.ndpc')));
  // 6. тёмная тема с запуска, скрины; без анимаций
  const D=await go(Object.assign({},base,{fx:false}),{admin:true,flags:{}},'dark'),Q=D.page;
  await Q.evaluate(()=>renderTab('learn'));await Q.waitForTimeout(1200);
  r=await st(Q);r.anim=await Q.evaluate(()=>getComputedStyle(document.querySelector('.n-bgi')).animationName+'|'+getComputedStyle(document.querySelector('.ndpull-k')).animationName);
  ok('тёмный с запуска; «без анимаций» — кадр и ручка стоят',r.look==='nd'&&r.ndt==='dark'&&r.hc==='#0f0f11'&&r.anim==='none|none',r);
  await Q.evaluate(()=>{store.fx=true;save();applyFx();renderTab('learn');});await Q.waitForTimeout(1200);await shot(Q,`dark-${dev}-1-today`);
  for(const [n,f] of [['2-kino',()=>renderTab('kino')],['4-prof',()=>renderTab('profile')],['6-ep',()=>renderScEp('wolf-of-wall-street',1)]]){await Q.evaluate(f);await Q.waitForTimeout(1400);
    if(n==='6-ep')await Q.evaluate(()=>{const v=document.querySelector('video');if(v){try{v.pause();v.currentTime=21;}catch(e){}}});await shot(Q,`dark-${dev}-${n}`);}
  // 6б. админ, который «Новый» ещё не видел (старый выбор «Свет»): включается «Новый» сам, один раз; потом «Как было» держится
  const F=await go(Object.assign({},base,{look:'svet',lookV:undefined}),{admin:true,flags:{}},'light',true);
  await F.page.evaluate(()=>renderTab('learn'));await F.page.waitForTimeout(900);
  r=await st(F.page);r.lv=await F.page.evaluate(()=>[store.look,store.lookV]);
  ok('админ впервые: «Новый» включился сам',r.look==='nd'&&r.lv[0]==='nd'&&r.lv[1]===2,r);
  await F.page.evaluate(()=>{store.look='';save();renderTab('learn');});await F.page.waitForTimeout(600);
  r=await st(F.page);ok('после «Как было» — остаётся старый вид',!r.look,r);
  // сцена: метки, кнопка, эпизоды строками; плеер в эпизоде — тёмный даже при светлом Telegram
  await P.evaluate(()=>{store.look='nd';save();renderScene('wolf-of-wall-street');});await P.waitForTimeout(1200);
  r=await P.evaluate(()=>({chips:[...document.querySelectorAll('.n-st .n-chip')].map(x=>x.textContent),rows:[...document.querySelectorAll('.n-eps .n-ep[data-i]')].map(x=>Math.round(x.getBoundingClientRect().left)),go:!!document.querySelector('#scgo')}));
  ok('сцена (13.9.39): метки «B2 · Фильм · 2013 · 6 эпизодов», эпизоды строками ровно друг под другом',r.chips[0]==='B2'&&/Фильм · 2013/.test(r.chips[1])&&/6 эпизод/.test(r.chips[2])&&r.go&&r.rows.length===6&&new Set(r.rows).size===1,r);
  await P.evaluate(()=>renderScEp('wolf-of-wall-street',1));await P.waitForTimeout(1300);
  r=await st(P);r.more=await P.evaluate(()=>{const m=document.querySelector('#scMore');return m?getComputedStyle(m).display:'нет';});
  ok('эпизод: тёмный при светлом Telegram, меню «⋯» плеера спрятано',r.look==='nd'&&r.ndt==='dark'&&r.more==='none',r);
  // 6в. остальные экраны: Настройки, Поиск, Повторение, «Все фразы сцены» — в виде (светлом); Коллекция, Магазин — тёмные витрины; игры — без вида
  await P.evaluate(()=>{store.look='nd';save();});
  const SEC=[['Настройки',()=>renderSettings(),'light'],['Поиск',()=>renderSearch(),'light'],['Повторение',()=>renderDaily(),'light'],['Все фразы',()=>renderSceneSum('wolf-of-wall-street'),'light'],['Коллекция',()=>renderCollection('bg'),'dark'],['Магазин',()=>renderShop(),'dark']];
  const bad2=[];for(const [n,f,t] of SEC){await P.evaluate(f);await P.waitForTimeout(900);const q=await st(P);if(q.look!=='nd'||q.ndt!==t||!q.w)bad2.push(n+' '+JSON.stringify(q));}
  ok('Настройки, Поиск, Повторение, «Все фразы» — в «Новом» (светлом); Коллекция и Магазин — тёмные',!bad2.length,bad2);
  // 6г. первый запуск «Нового»: 5 экранов; немецкий, тест уровня (выдуманные слова снижают оценку), уровень руками, сразу эпизод
  const O=await go({snd:false,fx:false,look:'nd',lookV:2},{admin:true,flags:{}},'light');const OP=O.page;
  await OP.evaluate(()=>{localStorage.removeItem('dota_sc_v1');location.reload();});await OP.waitForTimeout(2600);
  r=await OP.evaluate(()=>({scr:screen,dots:document.querySelectorAll('.onb-dots i').length,go:document.querySelector('#onbGo').disabled,tab:getComputedStyle(document.querySelector('#tabbar')).opacity}));
  ok('первый запуск: экран «Зачем тебе …?», 5 точек, «Дальше» неактивна, вкладок не видно',r.scr==='onb'&&r.dots===5&&r.go&&r.tab==='0',r);
  await OP.click('.onb-lg button[data-l="de"]');await OP.click('.onb-o[data-g="move"]');
  r=await OP.evaluate(()=>({h:document.querySelector('.onb-h').textContent,go:document.querySelector('#onbGo').disabled}));
  ok('Deutsch + цель: заголовок «немецкий», «Дальше» активна',/немецк/.test(r.h)&&!r.go,r);
  await OP.click('#onbGo');await OP.waitForTimeout(300);await OP.click('#onbGo');await OP.waitForTimeout(300);
  const seen=[];for(let i=0;i<15;i++){const w=await OP.evaluate(()=>{const c=document.querySelector('.onb-card:not(.nx)');return c?[c.querySelector('b').textContent,c.querySelector('.art')?c.querySelector('.art').className:'',ONB.lt.fakeAt.includes(ONB.lt.i)?1:0]:null;});if(!w)break;seen.push(w);
    await OP.click(w[2]||i%2?'#onbYes':'#onbNo');await OP.waitForTimeout(80);}
  const fakes=seen.filter(x=>x[2]).length,arts=seen.filter(x=>/a-(der|die|das)/.test(x[1])).length;
  ok('15 карточек, среди них выдуманные слова, у существительных артикль цветом',seen.length===15&&fakes>=2&&arts>=3,{n:seen.length,fakes,arts});
  r=await OP.evaluate(()=>({gram:!!document.querySelector('.onb-q'),txt:document.querySelector('.onb-q')&&document.querySelector('.onb-q').textContent}));
  ok('потом грамматика (немецкая)',r.gram&&/[äöüßA-Za-z]/.test(r.txt),r);
  for(let i=0;i<4;i++){await OP.click('.onb-opts .onb-o');await OP.waitForTimeout(1100);}
  r=await OP.evaluate(()=>({c:ONB.cefr,lv:!!document.querySelector('#onbLv'),grid:document.querySelectorAll('.onb-grid button').length,est:CEFR.indexOf(ltEstimate({seq:[[3,1],[4,0],[3,1],[4,1],[4,0],[3,1]],fk:0,gok:[]})),estF:CEFR.indexOf(ltEstimate({seq:[[3,1],[4,0],[3,1],[4,1],[4,0],[3,1]],fk:3,gok:[]}))}));
  ok('итог: уровень цветом и сетка A1–C1; «знаю» на выдуманные слова снижает оценку',r.lv&&r.grid===5&&/^[ABC][12]$/.test(r.c)&&r.estF<r.est,r);
  await OP.click('.onb-grid button[data-c="A2"]');r=await OP.evaluate(()=>[ONB.cefr,document.querySelector('#onbLv b').textContent]);
  ok('уровень можно выбрать руками',r[0]==='A2'&&r[1]==='A2',r);
  await OP.click('#onbGo');await OP.waitForTimeout(300);await OP.click('[data-m="5"]');await OP.click('#onbGo');await OP.waitForTimeout(400);
  r=await OP.evaluate(()=>({hw:document.querySelector('.onb-hw')&&document.querySelector('.onb-hw').textContent,bub:!!document.querySelector('.onb-bub')}));
  ok('«Привет, Андрей!» почерком и фраза дня от бота',/Андрей/.test(r.hw)&&r.bub,r);
  await OP.click('#onbGo');await OP.waitForTimeout(1500);
  r=await OP.evaluate(()=>({scr:screen,sid:SCUR&&SCUR.id,lang:SCUR&&scLang(scOf(SCUR.id)),st:[store.onboarded,store.cefr,store.lvl,store.goal,store.goalWhy,store.langs&&store.langs[0],store.kinoLang]}));
  ok('«Настраиваем» → сразу эпизод немецкой сцены; сохранено: A2, новичок, цель 10, «переезд», Deutsch',r.scr==='scep'&&r.lang==='de'&&r.st[0]&&r.st[1]==='A2'&&r.st[2]==='a'&&r.st[3]===10&&r.st[4]==='move'&&r.st[5]==='de'&&r.st[6]==='de',r);
  // 6д. выйти можно отовсюду: первый запуск — «Пропустить» (новичок → сразу сцена) / «Закрыть» (повтор из Настроек → Настройки); Профиль — «Вернуть старый дизайн»
  const U=await go({snd:false,fx:false,look:'nd',lookV:2},{admin:true,flags:{}},'light');const UP=U.page;
  await UP.evaluate(()=>{localStorage.removeItem('dota_sc_v1');location.reload();});await UP.waitForTimeout(2600);
  r=await UP.evaluate(()=>({scr:screen,sk:(document.querySelector('#onbSkip')||{}).textContent,bk:getComputedStyle(document.querySelector('#onbB')).visibility}));
  ok('первый запуск: «Пропустить» вверху, «назад» на первом шаге нет',r.scr==='onb'&&r.sk==='Пропустить'&&r.bk==='hidden',r);
  await UP.click('#onbSkip');await UP.waitForTimeout(1500);r=await UP.evaluate(()=>({scr:screen,on:store.onboarded,c:store.cefr}));
  ok('«Пропустить» — сразу эпизод, первый запуск засчитан',r.scr==='scep'&&r.on,r);
  await UP.evaluate(()=>renderSettings());await UP.waitForTimeout(600);await UP.click('#onbAgain');await UP.waitForTimeout(500);
  r=await UP.evaluate(()=>({sk:(document.querySelector('#onbSkip')||{}).textContent,bk:getComputedStyle(document.querySelector('#onbB')).visibility}));
  ok('повтор из Настроек: «Закрыть» и «назад» есть с первого шага',r.sk==='Закрыть'&&r.bk==='visible',r);
  await UP.click('#onbB');await UP.waitForTimeout(500);ok('«назад» на первом шаге → Настройки',await UP.evaluate(()=>screen==='settings'));
  await UP.click('#onbAgain');await UP.waitForTimeout(400);await UP.click('.onb-o[data-g="travel"]');await UP.click('#onbGo');await UP.waitForTimeout(300);await UP.click('#onbSkip');await UP.waitForTimeout(500);
  ok('«Закрыть» со второго шага → Настройки',await UP.evaluate(()=>screen==='settings'));
  await UP.evaluate(()=>renderTab('profile'));await UP.waitForTimeout(700);await UP.click('#pfLook');await UP.waitForTimeout(700);r=await st(UP);
  ok('Профиль → «Вернуть старый дизайн» — сразу прежний вид',!r.look&&!r.nd&&r.tabs.includes('Кинозал'),r);
  // словарь: метки уровня у фраз (A1–C1) и артикль цветом у немецких слов
  await P.evaluate(()=>{store.look='nd';store.myw=Object.assign({},store.myw,{'wolf-lunch-de|der kunde':{k:'wolf-lunch-de|der kunde',w:'der Kunde',ru:'клиент',sid:'wolf-lunch-de',pi:0,st:1,due:Date.now()+864e5,a:0,at:Date.now()}});save();renderTab('dict');});await P.waitForTimeout(2600);
  await P.evaluate(()=>DL.open({sid:'wolf-of-wall-street'}));await P.waitForTimeout(1200);await P.evaluate(()=>{const d=document.querySelector('details.kn-ep');if(d)d.open=true;});await P.waitForTimeout(500);
  r=await P.evaluate(()=>[...document.querySelectorAll('.kq2:not(.lock) .kq-lv')].map(x=>[x.textContent,getComputedStyle(x).display]));
  ok('словарь в «Новом»: у фраз метка уровня A1–C1',r.length>0&&r.every(x=>/^[ABC][12]$/.test(x[0])&&x[1]!=='none'),r.slice(0,4));
  r=await P.evaluate(()=>{wlvLoad();return lvTag('der Kunde','de')+'|'+lvTag('How on Earth did you get a reservation there?','en');});
  ok('у немецкого существительного — артикль цветом, у фразы — уровень по самому редкому слову',/a-der">der</.test(r)&&/>B[12]</.test(r),r);
  // 7. не-админ: вида нет, вкладки игр нет (13.9.43)
  const N=await go(base,{admin:false,flags:{}},'light');await N.page.evaluate(()=>renderTab('learn'));await N.page.waitForTimeout(900);
  r=await st(N.page);ok('не-админ: «Новый» не включается, вкладки прежние',!r.look&&!r.nd&&!r.tabs.includes('Игры')&&r.tabs[0]==='Главная',r);
  ok('консоль чистая',![...A.errs,...D.errs,...N.errs,...F.errs,...O.errs,...U.errs].length,[...A.errs,...D.errs,...N.errs,...F.errs,...O.errs,...U.errs].slice(0,5));
  console.log(fails?`ИТОГ ${dev}: FAIL ${fails}`:`ИТОГ ${dev}: всё PASS`);await b.close();process.exit(fails?1:0);})();
