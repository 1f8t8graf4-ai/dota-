// 13.9.20: слова в строках словаря нажимаются — то же окошко, что в видео («так в этой реплике», выражение, «Подробнее»);
// тап мимо слов — окно фразы; пунктир — только у выражения и важных слов; на ПК — рука и подсветка; подсказка один раз за всё время.
// Везде: сцена (фразы и «Все реплики»), поиск Кинотеки, «Мои фразы и слова», окно фразы (и у немецкой фразы); ph|pc
const {open}=require('./st');const {chromium}=require('playwright');
const dev=process.argv[2]||'ph';
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify({admin:false,flags:{}}));};
const base={onboarded:true,introV:1,unl:1,gold:900,lvl:'b',fx:true,tourV:1,scSubChosen:1,autoSc:false,age18:true,snd:false,knWin:'full'};
const fill=()=>{const now=Date.now();let n=0;for(const [id,pi] of [['wolf-of-wall-street',0],['wolf-of-wall-street',1],['american-psycho',0],['wolf-lunch-de',0]]){const s=scOf(id),P=scP(id);P.got=P.got||{};P.w[pi]=1;
  scAct(s.parts[pi].ph).forEach(f=>{n++;P.got[f.id]=now-n*6e4;P.m[f.id]=1;P.r[f.id]=[1,now+864e5];});}scSave();};
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const [vp,touch]=dev==='ph'?[{width:390,height:844},true]:[{width:1440,height:900},false];
  const start=async()=>{const o=await open({browser:b,touch,uid:111,ctx:{viewport:vp},wait:2500,init:seed,initArg:[base]});await o.page.evaluate(fill);return o;};
  let {page,errs}=await start();
  const ev=(f,a)=>page.evaluate(f,a);const click=async s=>{const l=page.locator(s).first();await l.scrollIntoViewIfNeeded();await l.click();};
  const shot=async n=>{await page.waitForTimeout(500);await page.screenshot({path:`${__dirname}/wtap-${dev}-${n}.png`});};
  const pop=()=>ev(()=>{const p=document.querySelector('.kw-pop.on');return {pop:!!p,w:p&&(p.querySelector('.kwp-w')||{}).textContent,t:p&&(p.querySelector('.kwp-t')||{}).textContent,here:!!(p&&p.querySelector('.kwp-here')),
    sheet:!!(p&&p.classList.contains('sheet')),txt:p?p.textContent:'',win:!!document.querySelector('.kno'),hint:!!document.querySelector('.kn-wh'),wh:store.wtapHint||0,sw:document.documentElement.scrollWidth,iw:innerWidth};});
  const popX=async()=>{await ev(()=>{const b=document.querySelector('.kw-pop.on [data-x="ok"]');if(b)b.click();});await page.waitForTimeout(400);};
  const winX=async()=>{await ev(()=>{const x=document.querySelector('.kno2 .kn2-x');if(x)x.click();});await page.waitForTimeout(900);};
  const scene=async sid=>{await ev(sid=>{DX.seg='kino';if(window.DL)DL.S.flt=false;renderTab('dict');},sid);await page.waitForFunction(()=>window.DL&&document.querySelector('#dlStage'),null,{timeout:15000});
    await ev(sid=>DL.open({sid}),sid);await page.waitForTimeout(1300);};
  // ---------- сцена: эпизоды свёрнуты — подсказки нет; раскрыл — подсказка над фразами, слова с пунктиром только у важных ----------
  await scene('wolf-of-wall-street');
  let r=await ev(()=>({hint:!!document.querySelector('.kn-wh'),open:document.querySelectorAll('.kn-ep[open]').length}));
  ok('сцена, эпизоды свёрнуты — подсказки нет',!r.hint&&!r.open,r);
  await click('.kn-ep summary .kn-ex');await page.waitForTimeout(900);
  r=await ev(()=>{const d=document.querySelector('.kn-ep[open]'),h=d&&d.querySelector('.kn-wh'),L=d&&d.querySelector('.kq-l'),sw=d?d.querySelectorAll('.kq:not(.lock) .kq-en .sw').length:0,u=d?d.querySelectorAll('.kq:not(.lock) .kq-en .sw.u').length:0;
    return {hint:!!h,before:!!(h&&h.nextElementSibling===L),txt:h&&h.textContent.trim(),x:!!(h&&h.querySelector('button')),sw,u,lockSw:document.querySelectorAll('.kq.lock .sw').length,ru:d?d.querySelectorAll('.kq-ru .sw').length:0,
      sw0:document.documentElement.scrollWidth,iw:innerWidth};});
  ok('раскрыл эпизод — подсказка «Нажми на слово…» с ✕ над фразами',r.hint&&r.before&&/Нажми на слово — покажу, что оно значит тут/.test(r.txt||'')&&r.x,r);
  ok('оригинал — словами, перевод — текстом, у закрытых слов нет; пунктир — только у важных (меньше трети слов)',r.sw>10&&!r.ru&&!r.lockSw&&r.u>0&&r.u<r.sw/3&&r.sw0<=r.iw,r);
  await shot('1-hint');
  // ---------- тап по слову: окошко как в видео, окно фразы не открылось, подсказка ушла навсегда ----------
  const wq='.kn-ep[open] .kq:not(.lock) .kq-en .sw.u';const w0=await page.locator(wq).first().textContent();
  await click(wq);await page.waitForTimeout(700);r=await pop();
  ok('тап по слову — окошко слова («так в этой реплике»), окно фразы не открылось',r.pop&&!r.win&&(r.w||'').toLowerCase()===w0.toLowerCase().replace(/[’`]/g,"'")&&r.here&&r.t&&r.sheet===(dev==='ph'),r);
  ok('после первого нажатия подсказка ушла, флаг сохранён',!r.hint&&r.wh>0,r);
  r=await ev(()=>({on:!!document.querySelector('.kq .sw.on'),more:!!document.querySelector('.kw-pop.on .kwp-mb')}));ok('нажатое слово подсвечено, «Подробнее ▾» есть',r.on&&r.more,r);
  await shot('2-word');
  await popX();r=await pop();ok('«Понятно» — окошко закрылось',!r.pop,r);
  // ---------- мимо слов (перевод) — окно фразы, как было ----------
  await click('.kn-ep[open] .kq:not(.lock) .kq-ru');await page.waitForTimeout(1300);r=await pop();ok('тап по переводу — окно фразы',r.win&&!r.pop,r);
  // в окне фразы слова нажимаются, как раньше
  await click('.kno2 .kn2-en .sw');await page.waitForTimeout(700);r=await pop();ok('в окне фразы слово — окошко слова поверх окна',r.pop&&r.win,r);await popX();await winX();
  // ---------- ПК: рука и подсветка при наведении ----------
  if(dev==='pc'){const l=page.locator('.kn-ep[open] .kq:not(.lock) .kq-en .sw').nth(1);await l.scrollIntoViewIfNeeded();
    const bg0=await l.evaluate(e=>getComputedStyle(e).backgroundColor);await l.hover();await page.waitForTimeout(350);
    r=await l.evaluate(e=>({cur:getComputedStyle(e).cursor,bg:getComputedStyle(e).backgroundColor}));
    ok('ПК: у слова рука, при наведении — подсветка, окошко само не выскакивает',r.cur==='pointer'&&r.bg!==bg0&&!(await pop()).pop,Object.assign(r,{bg0}));
    await shot('3-hover');}
  // ---------- «Все реплики»: слова — окошко реплики, пунктир у слов фраз ----------
  await click('[data-klt="all"]');await page.waitForTimeout(900);
  if(!await ev(()=>!!document.querySelector('.kn-ep[open]'))){await click('.kn-ep summary .kn-ex');await page.waitForTimeout(800);}
  r=await ev(()=>({ln:document.querySelectorAll('.kn-ep[open] .kl-ln[data-r]').length,sw:document.querySelectorAll('.kn-ep[open] .kl-ln[data-r] .kl-t b .sw').length,u:document.querySelectorAll('.kn-ep[open] .kl-ln[data-r] .sw.u').length,ru:document.querySelectorAll('.kl-t span .sw').length}));
  ok('«Все реплики»: слова реплик нажимаются, пунктир — у слов из фраз, перевод — текстом',r.ln>3&&r.sw>20&&r.u>0&&r.u<r.sw/3&&!r.ru,r);
  await click('.kn-ep[open] .kl-ln[data-r] .kl-t b .sw.u');await page.waitForTimeout(700);r=await pop();ok('слово в реплике — окошко (что значит тут / выражение)',r.pop&&!r.win&&(r.here||/Тут это часть выражения/.test(r.txt)),r);await shot('4-lines');await popX();
  await click('[data-klt="ph"]');await page.waitForTimeout(600);
  // ---------- немецкая фраза: в строке и в окне слова нажимаются, «Во фразе» — по-немецки ----------
  await scene('wolf-lunch-de');if(!await ev(()=>!!document.querySelector('.kn-ep[open]'))){await click('.kn-ep summary .kn-ex');await page.waitForTimeout(800);}
  const dq='.kn-ep[open] .kq:not(.lock) .kq-en .sw';r=await ev(q=>{const w=document.querySelector(q),c=w&&DL.find(w.closest('.kq').dataset.c);return {n:document.querySelectorAll(q).length,de:c&&c.f.de,en:c&&c.f.en};},dq);
  await click(dq);await page.waitForTimeout(700);let p=await pop();
  ok('немецкая фраза в строке: слово — окошко, «Во фразе» — по-немецки, не по-английски',r.n>3&&p.pop&&!p.win&&p.txt.includes(r.de)&&!p.txt.includes(r.en),{r,t:p.txt.slice(0,240)});await popX();
  await click('.kn-ep[open] .kq:not(.lock) .kq-ru');await page.waitForTimeout(1300);
  r=await ev(()=>({sw:document.querySelectorAll('.kno2 .kn2-en .sw,.kno2 .kn2-en .kw').length,kk:document.querySelectorAll('.kno2 .kn2-en .kk').length}));
  await click('.kno2 .kn2-en .sw');await page.waitForTimeout(700);p=await pop();
  ok('немецкая фраза в окне: слова нажимаются (раньше были простым текстом)',r.sw>2&&!r.kk&&p.pop&&p.t,{r,p:{w:p.w,t:p.t}});await popX();
  await click('.kn6-acts [data-v="hear"]');await page.waitForTimeout(2000);
  r=await ev(()=>({on:document.querySelectorAll('.kno2 .kn2-en .kk-on').length,play:!!document.querySelector('.kno2 .kn2-en.kk-play')}));ok('немецкая фраза: «Послушать» — слова загораются, как раньше',r.on>0&&r.play,r);await winX();
  // ---------- поиск Кинотеки ----------
  await ev(()=>{DX.seg='kino';DX.lang='en';DL.S.flt=false;DL.open({show:null,sid:null});});await page.waitForTimeout(900);await click('.kn-sf');await page.waitForTimeout(900);
  await page.fill('#knQ','client');await page.waitForTimeout(900);
  r=await ev(()=>({kq:document.querySelectorAll('#knRes .kq:not(.lock) .kq-en .sw').length}));ok('поиск: в найденных фразах слова нажимаются',r.kq>0,r);
  await click('#knRes .kq:not(.lock) .kq-en .sw');await page.waitForTimeout(700);r=await pop();ok('поиск: слово — окошко, не окно фразы',r.pop&&!r.win,r);await popX();
  await click('#knRes .kq:not(.lock) .kq-ru');await page.waitForTimeout(1200);r=await pop();ok('поиск: перевод — окно фразы',r.win,r);await winX();
  // ---------- «Мои фразы и слова» ----------
  await ev(()=>{DX.seg='my';store.knMyKind='ph';store.knMyV='cards';renderTab('dict');});await page.waitForTimeout(1500);
  await click('.km6-c summary');await page.waitForTimeout(800);
  r=await ev(()=>({sw:document.querySelectorAll('.km6-c[open] .kq .kq-en .sw').length}));ok('«Мои»: в строках фраз слова нажимаются',r.sw>5,r);
  await click('.km6-c[open] .kq .kq-en .sw');await page.waitForTimeout(700);r=await pop();ok('«Мои»: слово — окошко, не окно фразы',r.pop&&!r.win&&r.here,r);await shot('5-my');await popX();
  await click('.km6-c[open] .kq .kq-ru');await page.waitForTimeout(1200);r=await pop();ok('«Мои»: перевод — окно фразы',r.win,r);await winX();
  r=await ev(()=>({sw:document.documentElement.scrollWidth,iw:innerWidth}));ok('ничего не вылезает вбок',r.sw<=r.iw,r);
  // ---------- подсказка — один раз за всё время ----------
  await page.reload();await page.waitForTimeout(2500);await scene('wolf-of-wall-street');await click('.kn-ep summary .kn-ex');await page.waitForTimeout(900);
  r=await ev(()=>({hint:!!document.querySelector('.kn-wh'),wh:store.wtapHint||0}));ok('после перезапуска подсказки нет',!r.hint&&r.wh>0,r);
  ok('консоль чистая',!errs.length,errs.slice(0,5));
  // ---------- новый игрок: ✕ убирает подсказку навсегда ----------
  ({page,errs}=await start());
  await scene('american-psycho');await click('.kn-ep summary .kn-ex');await page.waitForTimeout(900);
  r=await ev(()=>!!document.querySelector('.kn-wh'));ok('новый игрок: подсказка есть',r,r);
  await click('.kn-wh button');await page.waitForTimeout(400);r=await ev(()=>({hint:!!document.querySelector('.kn-wh'),wh:store.wtapHint||0,win:!!document.querySelector('.kno')}));
  ok('✕ — подсказка ушла, окно фразы не открылось, флаг сохранён',!r.hint&&r.wh>0&&!r.win,r);
  await page.reload();await page.waitForTimeout(2500);await scene('american-psycho');await click('.kn-ep summary .kn-ex');await page.waitForTimeout(900);
  r=await ev(()=>!!document.querySelector('.kn-wh'));ok('после ✕ и перезапуска подсказки нет',!r,r);
  ok('консоль чистая (2)',!errs.length,errs.slice(0,5));
  console.log(fails?`ИТОГ ${dev}: FAIL ${fails}`:`ИТОГ ${dev}: всё PASS`);await b.close();process.exit(fails?1:0);})();
