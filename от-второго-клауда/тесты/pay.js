// 13.9.30: премиум за звёзды — node pay.js ph|pc (нужен stand2.mjs на 8788 с подменой Telegram)
// Режимы из админки (выкл / функции / сцены), ограничения (повторение раз в день, «Мои слова» > 50, режиссёрская версия, сцены),
// пробные 7 дней, оплата месяца (счёт → платёж через вебхук → премиум включился), отмена продления, статистика, «выкл» — всё как раньше.
const {open,initData}=require('./st');const {chromium}=require('playwright');const fs=require('fs');
const dev=process.argv[2]||'ph';
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
const init=([st,fl])=>{if(!sessionStorage.getItem('__seeded')){sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify(fl));}};
const base={onboarded:true,introV:1,unl:1,snd:false,fx:false,wtapHint:1,lvl:'b',tourV:1,scSubChosen:1,autoSc:false,lookV:2};
const hook=u=>fetch('http://127.0.0.1:8788/webhook',{method:'POST',headers:{'content-type':'application/json','X-Telegram-Bot-Api-Secret-Token':'sec'},body:JSON.stringify(u)});
(async()=>{const b=await chromium.launch();const vp=dev==='pc'?{width:1440,height:900}:{width:390,height:844};
  if(!fs.existsSync(__dirname+'/shots'))fs.mkdirSync(__dirname+'/shots');
  const go=async(uid,admin,st)=>{const nm=admin?'Андрей':'Игрок '+uid;const X=await open({browser:b,uid,name:nm,initData:initData(uid,nm),worker:true,platform:dev==='pc'?'tdesktop':'ios',touch:dev!=='pc',ctx:{viewport:vp,colorScheme:'dark'},wait:3600,init,initArg:[Object.assign({},base,st||{}),{admin,flags:{}}]});
    await X.page.evaluate(()=>{const s=scOf('wolf-of-wall-street'),P=scP(s.id);P.got=P.got||{};P.w[0]=1;P.done=[0];P.st=P.st||{};P.st[0]=3;P.r=P.r||{};
      scAct(s.parts[0].ph).forEach(f=>{P.got[f.id]=Date.now()-864e5;P.m[f.id]=1;P.r[f.id]=[1,Date.now()-1];});scSave();save();});return X;};
  const A=await go(876754050,true);const AP=A.page;
  // 1. админка → «Премиум»: режим «Выкл», статистика пустая; включить «Функции»
  await AP.evaluate(()=>renderAdmin('prem'));await AP.waitForTimeout(1500);
  let r=await AP.evaluate(()=>({on:(document.querySelector('#pmM .on')||{}).dataset,st:[...document.querySelectorAll('#pmS .ad2-stats b')].map(x=>x.textContent)}));
  ok('админка → «Премиум»: режим «Выкл», статистика 0 / 0 / 0 ⭐',r.on&&r.on.m==='off'&&r.st.join('|')==='0|0|0 ⭐',r);
  await AP.screenshot({path:`${__dirname}/shots/pay-${dev}-admin.png`});
  await AP.click('#pmM [data-m="feat"]');await AP.waitForTimeout(1200);
  ok('админ включил «Функции»',await AP.evaluate(()=>premMode()==='feat'&&document.querySelector('#pmM .on').dataset.m==='feat'));
  // 2. игрок: строка «Премиум» в Профиле, ограничения
  const P=await go(222,false);const PP=P.page;
  r=await PP.evaluate(()=>({m:premMode(),has:premHas()}));ok('игрок видит режим «Функции», премиума нет',r.m==='feat'&&!r.has,r);
  await PP.evaluate(()=>renderTab('profile'));await PP.waitForTimeout(700);ok('Профиль: строка «Премиум»',await PP.evaluate(()=>!!document.querySelector('#pfPrem')));
  await PP.evaluate(()=>{store.revDone=dayKey(new Date());save();renderDaily();});await PP.waitForTimeout(800);
  r=await PP.evaluate(()=>({scr:screen,why:(document.querySelector('.pw-why')||{}).textContent||''}));ok('второе повторение за день → экран премиума с причиной',r.scr==='prem'&&/Повторение/.test(r.why),r);
  await PP.screenshot({path:`${__dirname}/shots/pay-${dev}-wall.png`,fullPage:true});
  await PP.click('#pwX');await PP.waitForTimeout(500);ok('✕ — назад на Главную',await PP.evaluate(()=>screen!=='prem'));
  await PP.evaluate(()=>renderDirCut('wolf-of-wall-street'));await PP.waitForTimeout(600);
  r=await PP.evaluate(()=>({scr:screen,why:(document.querySelector('.pw-why')||{}).textContent||''}));ok('режиссёрская версия → премиум',r.scr==='prem'&&/Режиссёрская/.test(r.why),r);
  await PP.evaluate(()=>onBack());await PP.waitForTimeout(600);ok('«назад» Телеграма — к сцене',await PP.evaluate(()=>screen==='scene'));
  r=await PP.evaluate(()=>{store.myw={};for(let i=0;i<50;i++){const k='own|w'+i;store.myw[k]={k,w:'w'+i,ru:'x',sid:'own',pi:0,at:Date.now(),st:0,due:Date.now()+864e5};}save();const added=mywToggle('wolf-of-wall-street',0,'client',null,{ru:'клиент'});return {added,n:Object.keys(store.myw).length};});
  await PP.waitForTimeout(500);ok('51-е слово в «Мои слова» — не добавилось, шторка «это в премиуме»',r.added===false&&r.n===50&&await PP.evaluate(()=>!!document.querySelector('.pwa.on')),r);
  await PP.screenshot({path:`${__dirname}/shots/pay-${dev}-ask.png`});
  await PP.click('.pwa [data-x="no"]');await PP.waitForTimeout(400);ok('«Не сейчас» — шторка ушла',await PP.evaluate(()=>!document.querySelector('.pwa')));
  ok('подсказки пока за билеты',await PP.evaluate(()=>!premHas()));
  // пробные 7 дней
  await PP.evaluate(()=>renderPaywall(null,()=>renderTab('profile')));await PP.waitForTimeout(500);
  r=await PP.evaluate(()=>({tr:!!document.querySelector('#pwTrial'),tl:document.querySelectorAll('.pw-tl>div').length,pl:[...document.querySelectorAll('.pw-pl span')].map(x=>x.textContent)}));
  ok('экран: «Попробовать 7 дней», шкала «сегодня → через 7 дней», тарифы 1500 ⭐ и 250 ⭐',r.tr&&r.tl===2&&r.pl.join('|')==='1500 ⭐|250 ⭐',r);
  await PP.click('#pwTrial');await PP.waitForTimeout(1200);
  r=await PP.evaluate(()=>({has:premHas(),plan:premC().plan,card:document.querySelector('.pw-card small').textContent,tr:!!document.querySelector('#pwTrial')}));
  ok('пробные дни включились: премиум есть, «Пробные дни до …», второй раз не предлагают',r.has&&r.plan==='trial'&&/Пробные дни до/.test(r.card)&&!r.tr,r);
  await PP.evaluate(()=>renderDaily());await PP.waitForTimeout(700);ok('с премиумом повторение открывается',await PP.evaluate(()=>screen!=='prem'));
  r=await PP.evaluate(()=>{store.myw=store.myw||{};return mywToggle('wolf-of-wall-street',0,'client',null,{ru:'клиент'});});ok('и 51-е слово добавляется',r===true);
  // 3. оплата месяца: счёт → платёж (вебхук) → премиум до конца подписки; отмена продления
  const Q=await go(333,false);const QP=Q.page;await QP.evaluate(()=>{Telegram.WebApp.openInvoice=(u,cb)=>{window.__inv={u,cb};};renderPaywall(null,()=>renderTab('profile'));});await QP.waitForTimeout(500);
  await QP.click('.pw-pl[data-p="m"]');await QP.waitForTimeout(200);
  r=await QP.evaluate(()=>document.querySelector('#pwBuy').textContent);ok('выбрал месяц — кнопка «… за 250»',/250 [⭐★]/.test(r),r);
  await QP.click('#pwBuy');await QP.waitForTimeout(800);const inv=await QP.evaluate(()=>window.__inv&&window.__inv.u);
  const pay=inv&&decodeURIComponent((inv.split('p=')[1]||''));ok('открылся счёт Telegram на месяц',/^prem:333:m:\d+$/.test(pay),inv);
  const tgc=await (await fetch('http://127.0.0.1:8788/__tg')).json();const ci=tgc.filter(c=>c[0]==='createInvoiceLink').pop();
  ok('счёт: звёзды, 250, подписка на 30 дней',ci&&ci[1].currency==='XTR'&&ci[1].prices[0].amount===250&&ci[1].subscription_period===2592000);
  await hook({update_id:91,pre_checkout_query:{id:'q9',from:{id:333},currency:'XTR',total_amount:250,invoice_payload:pay}});
  const exp=Math.floor(Date.now()/1000)+30*86400;
  await hook({update_id:92,message:{message_id:1,chat:{id:333,type:'private'},from:{id:333,first_name:'Игрок'},successful_payment:{currency:'XTR',total_amount:250,invoice_payload:pay,telegram_payment_charge_id:'chUI',subscription_expiration_date:exp,is_recurring:true,is_first_recurring:true}}});
  await QP.evaluate(()=>window.__inv.cb('paid'));await QP.waitForTimeout(2500);
  r=await QP.evaluate(()=>({has:premHas(),plan:premC().plan,rec:premC().rec,card:document.querySelector('.pw-card small').textContent,recRow:!!document.querySelector('#pwRec')}));
  ok('после оплаты: «Премиум до …», план месяц, продление включено',r.has&&r.plan==='m'&&r.rec&&/Премиум до/.test(r.card)&&r.recRow,r);
  await QP.screenshot({path:`${__dirname}/shots/pay-${dev}-has.png`,fullPage:true});
  await QP.click('#pwRec');await QP.waitForTimeout(1200);r=await QP.evaluate(()=>({rec:premC().rec,has:premHas(),b:document.querySelector('#pwRec').textContent}));
  const ed=(await (await fetch('http://127.0.0.1:8788/__tg')).json()).filter(c=>c[0]==='editUserStarSubscription').pop();
  ok('«Отменить» продление: Telegram получил отмену, премиум до конца месяца, кнопка «Включить»',!r.rec&&r.has&&r.b==='Включить'&&ed&&ed[1].is_canceled===true,r);
  // 4. режим «Функции и сцены»: сложная сцена — премиум, бесплатная — открыта
  await AP.evaluate(()=>renderAdmin('prem'));await AP.waitForTimeout(1200);await AP.click('#pmM [data-m="scenes"]');await AP.waitForTimeout(1200);
  const Z=await go(444,false);const ZP=Z.page;
  r=await ZP.evaluate(()=>{const s=SCENES.find(x=>!premFree(x)&&!ageLock(x)),f=SCENES.find(x=>premFree(x));const g1=scGate(s.id);const scr=screen,why=(document.querySelector('.pw-why')||{}).textContent||'';renderTab('learn');return {id:s.id,g1,scr,why,g2:scGate(f.id),m:premMode()};});
  ok('режим «сцены»: сложная сцена → премиум, лёгкая — открыта',r.m==='scenes'&&r.g1===true&&r.scr==='prem'&&/сцена/.test(r.why)&&r.g2===false,r);
  // 5. статистика у админа
  await AP.evaluate(()=>renderAdmin('prem'));await AP.waitForTimeout(1500);
  r=await AP.evaluate(()=>({st:[...document.querySelectorAll('#pmS .ad2-stats b')].map(x=>x.textContent),pays:document.querySelectorAll('#pmS .ad2-pay').length}));
  ok('статистика: с премиумом 2, платят 1, 250 ⭐ за 30 дней, 1 платёж',r.st.join('|')==='2|1|250 ⭐'&&r.pays===1,r);
  // 6. «Выкл» — всё как раньше: ограничений и строки «Премиум» у игрока нет
  await AP.click('#pmM [data-m="off"]');await AP.waitForTimeout(1200);
  const O=await go(555,false);const OP=O.page;
  r=await OP.evaluate(()=>{store.revDone=dayKey(new Date());renderDaily();const s1=screen;const s=SCENES.find(x=>!premFree(x)&&!ageLock(x));const g=scGate(s.id);renderTab('profile');return {m:premMode(),s1,g,row:!!document.querySelector('#pfPrem')};});
  ok('«Выкл»: повторение и сцены открыты, строки «Премиум» у игрока нет',r.m==='off'&&r.s1!=='prem'&&r.g===false&&!r.row,r);
  // 7. в «Новом» экран премиума — по макету, тема как у Telegram
  await AP.evaluate(()=>{store.look='nd';save();renderPaywall(null,()=>renderTab('profile'));});await AP.waitForTimeout(700);
  r=await AP.evaluate(()=>({ndt:document.body.dataset.ndt,sys:ndDark()?'dark':'light',nd:!!document.querySelector('.n-pw'),pl:document.querySelectorAll('.n-pw .pw-pl').length,w:document.documentElement.scrollWidth<=innerWidth+1,test:!!document.querySelector('#pwTest')}));
  ok('в «Новом» экран премиума как в макете (13.9.40): по теме Telegram, тарифы строками, ничего не вылезает, у админа — «тест за 1 ⭐»',r.nd&&r.ndt===r.sys&&r.pl===2&&r.w&&r.test,r);
  await AP.screenshot({path:`${__dirname}/shots/pay-${dev}-nd.png`,fullPage:true});
  const errs=[...A.errs,...P.errs,...Q.errs,...Z.errs,...O.errs];ok('консоль чистая',!errs.length,errs.slice(0,5));
  console.log(fails?`ИТОГ ${dev}: FAIL ${fails}`:`ИТОГ ${dev}: всё PASS`);await b.close();process.exit(fails?1:0);})();
