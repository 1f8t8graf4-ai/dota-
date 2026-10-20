// 13.9.39 (P2, экран 9): плеер «Нового» по макету — метки фраз на шкале, караоке в субтитрах (слова загораются по wt.json),
// круг от пальца по слову, окошко слова шторкой (.wsh): уровень чипом, строка «почему так», «🔊 Слово» + «☆ В мои слова» жёлтым, без «Понятно».
// «Как было» — ничего этого нет.  node ndplay.js ph|pc
const {open}=require('./st');const {chromium}=require('playwright');
const dev=process.argv[2]||'ph';
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify({admin:true,flags:{}}));};
const base={onboarded:true,introV:1,look:'nd',lookV:2,unl:1,snd:false,lvl:'b',cefr:'B1',tourV:1,scSubChosen:1,autoSc:false,wtapHint:1,scPause:'off',fx:true};
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const pc=dev==='pc';
  const {page:P,errs}=await open({browser:b,touch:!pc,uid:876754050,ndDefault:true,ctx:{viewport:pc?{width:1440,height:900}:{width:390,height:844},colorScheme:'light'},wait:2500,init:seed,initArg:[base]});
  await P.evaluate(()=>renderScEp('wolf-of-wall-street',0));await P.waitForTimeout(1500);
  let r=await P.evaluate(()=>{const s=scOf('wolf-of-wall-street'),p=s.parts[0],n=scAct(p.ph).filter(f=>f.a>=p.a&&f.a<=p.b).length;
    return {n,m:document.querySelectorAll('.n-tlw .n-tlm').length,ndt:document.body.dataset.ndt,inW:!!document.querySelector('.n-tlw #scsk')};});
  ok('шкала: перемотка внутри обёртки, жёлтых меток столько же, сколько фраз эпизода; эпизод тёмный',r.inW&&r.m===r.n&&r.m>0&&r.ndt==='dark',r);
  // караоке: играем с начала строки — сначала загорается часть слов, к концу строки — все
  await P.evaluate(async()=>{await wtLoad('wolf-of-wall-street');SV.muted=true;await SV.play().catch(()=>{});});
  const row=await P.evaluate(()=>{const L=SV._loc.filter(x=>String(x[2]).split(/\s+/).length>=5);return L[1]||L[0];});
  await P.evaluate(t=>{SV.currentTime=t+0.05;},row[0]);await P.waitForTimeout(500);
  r=await P.evaluate(()=>{const b=document.querySelector('.sc-subs');return {kara:b.classList.contains('kara'),on:b.querySelectorAll('.sw.kk-on').length,all:b.querySelectorAll('.sline:not(.s2) .sw').length,t:SV.currentTime};});
  const early=r;await P.evaluate(t=>{SV.currentTime=t;},row[1]-0.45);await P.waitForTimeout(250);   // 13.9.40: строки теперь кончаются вместе с голосом — проверяем чуть раньше конца
  r=await P.evaluate(()=>{const b=document.querySelector('.sc-subs');return {on:b.querySelectorAll('.sw.kk-on').length,all:b.querySelectorAll('.sline:not(.s2) .sw').length,op:getComputedStyle(b.querySelector('.sline:not(.s2) .sw')).opacity};});
  ok('караоке: в начале строки горит часть слов, к концу — все',early.kara&&early.on<early.all&&r.on===r.all&&r.all>=5,{early,r,row:row.slice(0,3)});
  await P.evaluate(()=>SV.pause());await P.waitForTimeout(300);
  // тап по слову: круг от пальца и шторка
  const w=P.locator('.sc-subs .sline:not(.s2) .sw').nth(1);await w.click();await P.waitForTimeout(120);
  const ring=await P.evaluate(()=>!!document.querySelector('.sc-v .n-tapr'));await P.waitForTimeout(800);if(pc)ok('тап по слову — круг от пальца',ring);
  if(pc){r=await P.evaluate(()=>{const p=document.querySelector('.sc-wpop');return p?{t:p.textContent.slice(0,60),vis:getComputedStyle(p).display!=='none'}:null;});
    ok('ПК: тап по слову — окошко слова в видео',!!r&&r.vis,r);await P.screenshot({path:__dirname+'/shots/ndplay-pc-word.png'});}
  else{
  r=await P.evaluate(()=>{const p=document.querySelector('.kw-pop.on');if(!p)return null;const B=[...p.querySelectorAll('.kwp-b button')].filter(x=>getComputedStyle(x).display!=='none');
    return {sheet:p.classList.contains('sheet'),chip:!!p.querySelector('.kwp-w .n-chip'),wx:(p.querySelector('.n-wx')||{}).textContent||'',btn:B.map(x=>x.dataset.x),save:getComputedStyle(p.querySelector('[data-x="save"]')).backgroundColor,bg:getComputedStyle(p).backgroundColor,
      L:Math.round(p.getBoundingClientRect().left),R:Math.round(innerWidth-p.getBoundingClientRect().right)};});
  ok('тап по слову — круг от пальца',ring);
  ok('окошко слова — шторка с отступами 8, уровень чипом, строка «почему так», «Слово» и «В мои слова» (жёлтая), без «Понятно»',
    r&&r.sheet&&r.L>=6&&r.R>=6&&!!r.wx&&r.chip&&!r.btn.includes('ok')&&r.btn.includes('save')&&/255, 210, 63/.test(r.save),r);await P.screenshot({path:__dirname+'/shots/ndplay-ph-word.png'});}
  // «Как было» — ничего из этого
  await P.evaluate(()=>{wpClose&&wpClose();store.look='';save();renderScEp('wolf-of-wall-street',0);});await P.waitForTimeout(1200);
  r=await P.evaluate(()=>({m:document.querySelectorAll('.n-tlm').length,w:!!document.querySelector('.n-tlw')}));
  ok('«Как было» — меток и обёртки шкалы нет',!r.m&&!r.w,r);
  ok('консоль чистая',!errs.length,errs.slice(0,4).join(' | '));
  console.log(fails?`ИТОГ ${dev}: ${fails} FAIL`:`ИТОГ ${dev}: всё PASS`);await b.close();})();
