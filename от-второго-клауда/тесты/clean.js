// 13.9.42 — чистка: старого «Разбора» 9.2, заданий в видео, hero/dict, Гаврика, 3D-фона, проб «Свет/Ночь/Журнал», лаборатории и YouTube-теста нет;
// админка — 5 разделов; «Дизайн «Новый» — кому» в «Доступе»; урок — обычный эпизод; удалённые файлы никто не просит.  node clean.js ph|pc
const {open}=require('./st');const {chromium}=require('playwright');
const dev=process.argv[2]||'ph',pc=dev==='pc';
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
const seed=([st,fl])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify(fl));};
const base={onboarded:true,introV:1,look:'nd',lookV:2,unl:1,snd:false,lvl:'b',cefr:'B1',tourV:1,scSubChosen:1,autoSc:false,wtapHint:1,scPause:'off',fx:true,gold:500};
(async()=>{const b=await chromium.launch();const vp=pc?{width:1440,height:900}:{width:390,height:844};
  const A=await open({browser:b,touch:!pc,uid:876754050,ndDefault:true,ctx:{viewport:vp,colorScheme:'dark'},wait:2600,init:seed,initArg:[base,{admin:true,flags:{}}]}),P=A.page;
  const req=[];P.on('request',q=>{if(/bg3d|mascot|three\.min|bateman\.(png|glb)|youtube/.test(q.url()))req.push(q.url());});
  let r=await P.evaluate(()=>({g:['scVQ','scHint','scChip','scSecondPass','scPilot','renderScEpTask','scTaskAttach','gavGone','gavReact','renderYtTest','ytKill','renderWordQuiz','swBlock','labSub','LAB_SUB','ADM_ANIMS'].filter(n=>{try{return typeof eval(n)!=='undefined';}catch(e){return false;}}),
    w:['BG3D','MASCOT','THREE','YT'].filter(n=>window[n]),looks:Object.keys(LOOKS),bg:!!document.getElementById('bg3d')||!!document.getElementById('bgfade')}));
  ok('нет старых функций и глобалов (9.2, hero/dict, Гаврик, 3D, YouTube, лаборатория)',!r.g.length&&!r.w.length&&r.looks.join()==='nd'&&!r.bg,r);
  // эпизод: две вкладки, без «Разбора» и галки «Задания в видео»
  await P.evaluate(()=>renderScEp('wolf-of-wall-street',0));await P.waitForTimeout(1500);
  r=await P.evaluate(()=>({tabs:[...document.querySelectorAll('.ep-tabs button')].map(b=>b.dataset.tab),learn:!!document.querySelector('[data-pane="learn"],#epCard,#epVt'),pz:!!document.querySelector('.ep-pz'),go:!!document.querySelector('#epToLearn')}));
  ok('эпизод: «Смотри · Проверка», «Разбора» и «Задания в видео» нет',r.tabs.join()==='watch,test'&&!r.learn&&r.pz&&r.go,r);
  await P.click('.ep-tabs [data-tab="test"]');await P.waitForTimeout(1000);
  r=await P.evaluate(()=>!!document.querySelector('.sc-q'));ok('вкладка «Проверка» → задания',r);
  // урок на сегодня — обычный эпизод
  await P.evaluate(()=>{const s=scOf('wolf-of-wall-street'),Q=scP(s.id);Q.w[0]=1;scSave();startScLesson();});await P.waitForTimeout(1500);
  r=await P.evaluate(()=>({scr:document.body.dataset.scr,tabs:document.querySelectorAll('.ep-tabs button').length,id:SCUR&&SCUR.id}));
  ok('«Урок на сегодня» открывает эпизод (смотри → проверка)',r.scr==='scep'&&r.tabs===2&&!!r.id,r);
  // админка: 5 разделов
  await P.evaluate(()=>renderAdmin());await P.waitForTimeout(800);
  r=await P.evaluate(()=>[...document.querySelectorAll('.ad2-it[data-sec]')].map(b=>b.dataset.sec));
  ok('админка: Игроки · Статистика · Доступ · Премиум · Я как игрок',r.join()==='users,stats,flags,prem,player',r);
  for(const s of ['users','stats','flags','prem','player','check']){await P.evaluate(x=>renderAdmin(x),s);await P.waitForTimeout(500);
    const h=await P.evaluate(()=>({t:(document.querySelector('.ad2-head h1')||{}).textContent,w:document.documentElement.scrollWidth<=innerWidth+1}));
    ok(`раздел «${h.t}» открывается, ничего не вылезает вбок`,!!h.t&&h.w,h);}
  await P.evaluate(()=>renderAdmin('stats'));await P.waitForTimeout(600);
  r=await P.evaluate(()=>({fn:!!document.querySelector('#fnB'),er:!!document.querySelector('#erB'),clr:!!document.querySelector('#erClr')}));
  ok('«Статистика»: воронка и ошибки на одном экране',r.fn&&r.er&&r.clr,r);
  await P.evaluate(()=>renderAdmin('flags'));await P.waitForTimeout(600);
  r=await P.evaluate(()=>({acc:[...document.querySelectorAll('#ndAcc [data-nda]')].map(b=>b.dataset.nda),save:!!document.querySelector('#admSave')}));
  ok('«Доступ»: «Дизайн «Новый» — кому» (только мне / тестерам / всем)',r.acc.join()==='me,test,all'&&r.save,r);
  await P.click('#ndAcc [data-nda="test"]');await P.waitForTimeout(200);
  r=await P.evaluate(()=>!document.querySelector('#ndaIds').hidden);ok('«Тестерам» — поле для ID',r);
  await P.evaluate(()=>renderAdmin('player'));await P.waitForTimeout(500);await P.click('[data-sec="check"]');await P.waitForTimeout(500);
  r=await P.evaluate(()=>({t:(document.querySelector('.ad2-head h1')||{}).textContent,why:!!document.querySelector('#admWhy'),go:!!document.querySelector('#dkGo')}));
  ok('«Я как игрок» → «Проверка установки» с блоком «почему нет анимаций»',/Проверка/.test(r.t)&&r.why&&r.go,r);
  await P.evaluate(()=>{const b=document.querySelector('#bBtn');b.click();});await P.waitForTimeout(400);
  r=await P.evaluate(()=>ADM_SEC);ok('«‹» из раздела — в меню админки',r===null,r);
  // Настройки: «Дизайн» — Новый / Как было; старые пробы у админа — «Новый» сам
  await P.evaluate(()=>renderSettings());await P.waitForTimeout(600);
  r=await P.evaluate(()=>({seg:[...document.querySelectorAll('[data-seg="look"] button,[data-k="look"] button')].map(b=>b.textContent),t:/Свет|Журнал|Лаборатори/.test(document.querySelector('.screen').textContent)}));
  ok('Настройки: «Новый / Как было», без упоминаний проб и лаборатории',!r.t,r);
  await P.evaluate(()=>renderTab('learn'));await P.waitForTimeout(800);
  r=await P.evaluate(()=>!!document.querySelector('#hYt'));ok('на Главной нет «ТЕСТ · YouTube»',!r);
  ok('удалённые файлы никто не запрашивает',!req.length,req);
  ok('консоль чистая',!A.errs.length,A.errs.slice(0,4).join(' | '));
  // игрок со старым выбором пробы — обычный вид
  const B=await open({browser:b,touch:!pc,uid:111222333,ctx:{viewport:vp,colorScheme:'dark'},wait:2600,init:seed,initArg:[{...base,look:'svet',lookV:2},{admin:false,flags:{}}]});
  r=await B.page.evaluate(()=>({look:document.body.dataset.look||'',nd:ndOn()}));ok('игрок с «Свет» в памяти — обычный вид, без ошибок',!r.look&&!r.nd&&!B.errs.length,{...r,e:B.errs.slice(0,2)});
  await b.close();console.log(fails?`ИТОГ ${dev}: ${fails} FAIL`:`ИТОГ ${dev}: всё PASS`);process.exit(fails?1:0);})();
