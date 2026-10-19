// 13.9.22: дизайн на пробу — виды «Свет», «Ночь», «Журнал» (только админ, store.look; Настройки → «Дизайн (на пробу)»).
// Для каждого вида: body[data-look] есть на Главной, в Кинозале, Словаре, на странице сцены, в эпизоде и проверке и нет в Профиле, Настройках, Повторении;
// цвет шапки Telegram = --top вида; ничего не вылезает вбок; на Главной нет «Новичок ?» и «или урок», строка «Повторить» видна (в обычном виде — нет) и ведёт в повторение;
// настройка переключает вид; у не-админа вида нет. Скрины — shots/look-<вид>-<устройство>-<экран>.png (FONTS=1 — с настоящими шрифтами Google)
const {open}=require('./st');const {chromium}=require('playwright');const fs=require('fs');
const dev=process.argv[2]||'ph';
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
const init=([st,fl])=>{if(!sessionStorage.getItem('__seeded')){sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify(fl));}
  const W=window.Telegram&&Telegram.WebApp;if(W){W.setHeaderColor=c=>{window.__hc=c;};W.setBackgroundColor=c=>{window.__bc=c;};}};
const base={onboarded:true,introV:1,unl:1,snd:false,fx:false,knWin:'sheet',wtapHint:1,lvl:'b',tourV:1,scSubChosen:1,autoSc:false};
const TOP={svet:'#f4f3f0',noch:'#111215',zhurnal:'#f1ece2'};
(async()=>{const b=await chromium.launch();const vp=dev==='pc'?{width:1440,height:900}:{width:390,height:844};
  if(!fs.existsSync(__dirname+'/shots'))fs.mkdirSync(__dirname+'/shots');
  const go=async(st,fl)=>{const A=await open({browser:b,uid:111,name:'Андрей',platform:dev==='pc'?'tdesktop':'ios',touch:dev!=='pc',ctx:{viewport:vp},wait:process.env.FONTS?300:2400,init,initArg:[st,fl]});
    if(process.env.FONTS){await A.ctx.route(/https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com)\//,r=>r.continue());await A.page.reload();await A.page.waitForTimeout(2600);}
    // прогресс: эпизод 1 «Волка» пройден, его фразы собраны и пора повторить — на Главной есть «Повторить»
    await A.page.evaluate(()=>{const s=scOf('wolf-of-wall-street'),P=scP(s.id);P.got=P.got||{};P.w[0]=1;P.done=[0];P.st=P.st||{};P.st[0]=3;P.r=P.r||{};
      scAct(s.parts[0].ph).forEach(f=>{P.got[f.id]=Date.now()-864e5;P.m[f.id]=1;P.r[f.id]=[1,Date.now()-1];});scSave();
      store.scLast={id:s.id,i:1};save();});   // на Главной во всех видах — тот же «Волк», эпизод 2
    return A;};
  const A=await go(base,{admin:true,flags:{}}),P=A.page;
  const st=()=>P.evaluate(()=>({look:document.body.dataset.look||'',hc:(window.__hc||'').toLowerCase(),w:document.documentElement.scrollWidth<=innerWidth+1,
    rev2:(()=>{const r=document.querySelector('.hrev2');return r?getComputedStyle(r).display:null;})(),hhrev:(()=>{const r=document.querySelector('.hh .hh-rev');return r?getComputedStyle(r).display:null;})()}));
  // 0. обычный вид (store.look не задан): строки под кадром нет, на кадре — «Повторить»; в шапке нет звания, ссылки «или урок» нет
  await P.evaluate(()=>renderTab('learn'));await P.waitForTimeout(900);
  let r=await P.evaluate(()=>({look:document.body.dataset.look||'',rank:!!document.querySelector('.thead .rankchip'),alt:!!document.querySelector('.hh-alt'),
    rev2:(()=>{const e=document.querySelector('.hrev2');return e?getComputedStyle(e).display:'нет';})(),hrev:!!document.querySelector('#hRev'),prof:null}));
  ok('обычный вид: без data-look, в шапке нет «Новичок ?», нет «или урок», «Повторить» — на кадре, строка под кадром скрыта',!r.look&&!r.rank&&!r.alt&&r.hrev&&r.rev2==='none',r);
  await P.evaluate(()=>renderTab('profile'));await P.waitForTimeout(700);
  ok('звание осталось в Профиле',await P.evaluate(()=>!!document.querySelector('.rankchip')));
  // 1. каждый вид — 6 экранов в охвате и 3 вне его
  const IN=[['1-glavnaya',()=>renderTab('learn')],['2-kinozal',()=>renderTab('kino')],['3-slovar',()=>renderTab('dict')],['4-scena',()=>renderScene('wolf-of-wall-street')],['5-epizod',()=>renderScEp('wolf-of-wall-street',0)],['6-proverka',()=>renderScQuiz('wolf-of-wall-street',0)]];
  const OUT=[['Профиль',()=>renderTab('profile')],['Настройки',()=>renderSettings()],['Повторение',()=>renderDaily()]];
  for(const L of ['svet','noch','zhurnal']){
    await P.evaluate(l=>{store.look=l;save();},L);
    const bad=[];
    for(const [n,f] of IN){await P.evaluate(f);await P.waitForTimeout(n==='3-slovar'?2600:1500);
      if(n==='5-epizod')await P.evaluate(()=>{const v=document.querySelector('video');if(v){try{v.pause();v.currentTime=21;}catch(e){}}});
      await P.evaluate(()=>window.scrollTo(0,0));await P.waitForTimeout(250);
      const s=await st();if(s.look!==L||s.hc!==TOP[L]||!s.w)bad.push(n+' '+JSON.stringify(s));
      if(n==='1-glavnaya'&&!(s.rev2==='flex'&&s.hhrev==='none'))bad.push('Главная: строка «Повторить» '+JSON.stringify(s));
      await P.screenshot({path:`${__dirname}/shots/look-${L}-${dev}-${n}.png`});}
    ok(`«${L}»: вид на 6 экранах, шапка Telegram ${TOP[L]}, ничего не вылезает вбок, на Главной — строка «Повторить» под кадром`,!bad.length,bad);
    const out=[];
    for(const [n,f] of OUT){await P.evaluate(f);await P.waitForTimeout(1000);const s=await st();if(s.look||s.hc===TOP[L])out.push(n+' '+JSON.stringify(s));}
    ok(`«${L}»: в Профиле, Настройках и Повторении — обычный вид`,!out.length,out);}
  // 2. строка «Повторить» ведёт в повторение
  await P.evaluate(()=>{store.look='svet';save();window.__dl=0;const o=renderDaily;renderDaily=function(){window.__dl++;return o.apply(this,arguments);};renderTab('learn');});await P.waitForTimeout(900);
  await P.click('.hrev2');await P.waitForTimeout(900);
  r=await P.evaluate(()=>({dl:window.__dl,look:document.body.dataset.look||''}));
  ok('строка «Повторить» → повторение (там обычный вид)',r.dl===1&&!r.look,r);
  // 3. Настройки → «Дизайн (на пробу)»: переключатель есть у админа, выбор сохраняется и включает вид
  await P.evaluate(()=>renderSettings());await P.waitForTimeout(700);
  r=await P.evaluate(()=>[...document.querySelectorAll('[data-seg="look"] button')].map(x=>x.textContent+(x.getAttribute('aria-pressed')==='true'?'*':'')));
  ok('Настройки: «Дизайн (на пробу)» — Сейчас / Свет / Ночь / Журнал, выбран «Свет»',r.join('|')==='Сейчас|Свет*|Ночь|Журнал',r);
  await P.click('[data-seg="look"] [data-v="noch"]');await P.evaluate(()=>renderTab('learn'));await P.waitForTimeout(900);
  r=await P.evaluate(()=>({look:document.body.dataset.look,st:store.look,loc:LOCAL_ONLY.includes('look'),font:!!document.getElementById('lkf-noch')}));
  ok('выбрал «Ночь» — вид включился, шрифт подключён, выбор только на этом устройстве',r.look==='noch'&&r.st==='noch'&&r.loc&&r.font,r);
  await P.evaluate(()=>renderSettings());await P.waitForTimeout(500);await P.click('[data-seg="look"] [data-v="cur"]');await P.evaluate(()=>renderTab('learn'));await P.waitForTimeout(900);
  r=await st();ok('«Сейчас» — обычный вид',!r.look&&r.rev2==='none',r);
  // 4. обычные экраны в «сейчас» — скрины для сравнения
  for(const [n,f] of IN){await P.evaluate(f);await P.waitForTimeout(n==='3-slovar'?2600:1500);if(n==='5-epizod')await P.evaluate(()=>{const v=document.querySelector('video');if(v){try{v.pause();v.currentTime=21;}catch(e){}}});
    await P.evaluate(()=>window.scrollTo(0,0));await P.waitForTimeout(250);await P.screenshot({path:`${__dirname}/shots/look-cur-${dev}-${n}.png`});}
  // 5. не-админ: store.look есть, а вида нет и переключателя в Настройках нет
  const B=await go(Object.assign({},base,{look:'svet'}),{admin:false,flags:{}});
  await B.page.evaluate(()=>renderTab('learn'));await B.page.waitForTimeout(900);
  r=await B.page.evaluate(()=>({look:document.body.dataset.look||'',rank:!!document.querySelector('.thead .rankchip')}));
  await B.page.evaluate(()=>renderSettings());await B.page.waitForTimeout(500);
  r.seg=await B.page.evaluate(()=>!!document.querySelector('[data-seg="look"]'));
  ok('не-админ: вида нет, переключателя нет, звания в шапке нет',!r.look&&!r.seg&&!r.rank,r);
  ok('консоль чистая',![...A.errs,...B.errs].length,[...A.errs,...B.errs].slice(0,5));
  console.log(fails?`ИТОГ ${dev}: FAIL ${fails}`:`ИТОГ ${dev}: всё PASS`);await b.close();process.exit(fails?1:0);})();
