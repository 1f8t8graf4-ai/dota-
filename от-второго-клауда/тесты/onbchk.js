// 24.10 (П4, Андрей: «добавь перевод слов в конце, чтобы чел понимал, знал или нет, и мог честно сказать „не знал“ — тогда лвл понижался бы»
// + «чуть более разнообразно, чем просто свайпы»): тест уровня первого запуска —
// 1) на 6-й и 13-й карточке «выбери перевод из 3» (+ «Не знаю»): один верный, варианты разные, без общего корня; верный зеленеет, неверный — красный;
// 2) после 15 карточек — «Проверь себя»: слова, на которые сказал «знаю» (самые трудные, до 6), перевод под пылью, «Знал / Не знал»,
//    «Дальше» — когда ответил на все; «Не знал» — запись в seq «не знаю», уровень сверху меняется сразу; выдуманные «знаю» — строкой «такого слова нет»;
// 3) итог — уровень и за что: знаю N из M, не знал K, перевод, выдуманные, грамматика; ни одного «знаю» — без «Проверь себя»;
// 4) «Пропустить» посреди теста — уровень по уже данным ответам; ПК — клавиши 1–3 / 0, кнопки в окне; ничего не вылезает вбок; консоль чистая.
// Запуск: node onbchk.js ph|pc   (сайт — python3 -m http.server в корне, порт ST_PORT или 8080)
const {open}=require('./st');const {chromium}=require('playwright');const fs=require('fs');
const dev=process.argv[2]||'ph',PC=dev==='pc';
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
const init=([st])=>{if(!sessionStorage.getItem('__seeded')){sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify({admin:true,flags:{}}));}
  window.__bb=[];const W=window.Telegram&&Telegram.WebApp;if(W&&W.BackButton){W.BackButton.show=()=>__bb.push('show');W.BackButton.hide=()=>__bb.push('hide');}};
const base={onboarded:true,introV:1,gold:900,lvl:'b',tourV:1,scSubChosen:1,snd:false,look:'nd',lookV:2,unl:1,wtapHint:1};
const VP=PC?{width:1280,height:720}:{width:390,height:844};
(async()=>{const b=await chromium.launch();if(!fs.existsSync(__dirname+'/shots'))fs.mkdirSync(__dirname+'/shots');
  const mk=async(st,scheme)=>open({browser:b,uid:876754050,name:'Андрей',platform:PC?'tdesktop':'ios',touch:!PC,ndDefault:true,ctx:{viewport:VP,colorScheme:scheme||'light'},wait:2500,init,initArg:[Object.assign({},base,st)]});
  const shot=(P,n)=>P.screenshot({path:`${__dirname}/shots/onbchk-${dev}-${n}.png`});
  // вёрстка: ничего не шире окна; кнопки шага — в окне (кроме верхней строки)
  const lay=P=>P.evaluate(()=>{const W=innerWidth,H=innerHeight,wide=[...document.querySelectorAll('.onb *')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.right>W+1||r.left<-1);}).map(e=>e.className||e.tagName).slice(0,4);
    const out=[...document.querySelectorAll('.onb button')].filter(x=>x.offsetParent&&!x.closest('.onb-top')).filter(x=>{const q=x.getBoundingClientRect();return q.bottom>H+1||q.top<0;}).map(x=>x.textContent.trim().slice(0,18));
    return {wide,out,sx:document.documentElement.scrollWidth>W+1||document.body.scrollWidth>W+1};});
  const st=P=>P.evaluate(()=>{const T=ONB&&ONB.lt;return T?{ph:T.ph,i:T.i,b:T.b}:null;});
  const card=P=>P.evaluate(()=>{const c=document.querySelector('#onbCard');if(!c)return null;const T=ONB.lt;
    return {ch:c.classList.contains('ch'),fake:T.fakeAt.includes(T.i),i:T.i,w:(c.querySelector('b')||{}).textContent,art:!!c.querySelector('.art'),
      opts:[...document.querySelectorAll('.onb-chs .onb-o')].map(x=>[x.textContent.trim(),x.dataset.ok,x.dataset.n])};});
  // пройти карточки: f(c) → 'yes' | 'no' | 'ok' | 'bad' | 'dk' | 'key1'…
  const runCards=async(P,f,wt=140)=>{const seen=[];for(let k=0;k<20;k++){const s=await st(P);if(!s||s.ph!=='w')break;const c=await card(P);if(!c){await P.waitForTimeout(200);continue;}seen.push(c);
      const a=f(c);
      if(c.ch){if(a.startsWith('key')){await P.keyboard.press(a.slice(3));}else{const sel=a==='ok'?'.onb-chs .onb-o[data-ok="1"]':a==='dk'?'.onb-chs .onb-dk':'.onb-chs .onb-o[data-ok="0"]:not(.onb-dk)';await P.click(sel);}
        await P.waitForTimeout(120);c.after=await P.evaluate(()=>[...document.querySelectorAll('.onb-chs .onb-o')].map(x=>x.className));await P.waitForTimeout(1500);}
      else{await P.click(a==='yes'?'#onbYes':'#onbNo');await P.waitForTimeout(wt);}}
    return seen;};
  const start=async(P,lang)=>{await P.evaluate(l=>{ONB=null;renderOnb(0);ONB.lang=l;renderOnb(1);},lang);await P.waitForTimeout(700);await P.click('#onbGo');await P.waitForTimeout(500);};

  // ===== 1. English: всё «знаю», выдуманные — «учу», первый выбор — верно, второй — ошибка
  const A=await mk({fx:false}),P=A.page;await start(P,'en');
  let chN=0;const seen=await runCards(P,c=>c.ch?(chN++===0?'ok':'bad'):c.fake?'no':'yes');
  const chs=seen.filter(x=>x.ch);
  ok('15 карточек, «выбери перевод» — на 6-й и 13-й',seen.length===15&&chs.map(x=>x.i).join()==='5,12',seen.map(x=>x.i+(x.ch?'c':x.fake?'f':'')).join(' '));
  ok('«выбери перевод»: 3 варианта + «Не знаю», верный один, варианты разные',chs.every(c=>c.opts.length===4&&c.opts.filter(o=>o[1]==='1').length===1&&new Set(c.opts.slice(0,3).map(o=>o[0])).size===3&&c.opts[3][0]==='Не знаю'),chs.map(c=>c.w+': '+c.opts.map(o=>o[0]+(o[1]==='1'?'✓':'')).join(' / ')));
  ok('верный ответ — зелёный; ошибка — красный, верный показан зелёным',/\bok\b/.test(chs[0].after.find((x,j)=>chs[0].opts[j][1]==='1'))&&chs[1].after.some(x=>/\bbad\b/.test(x))&&/\bok\b/.test(chs[1].after.find((x,j)=>chs[1].opts[j][1]==='1')),chs.map(c=>c.after));
  let r=await P.evaluate(()=>({ph:ONB.lt.ph,rows:[...document.querySelectorAll('.onb-cr[data-j]')].map(x=>{const j=+x.dataset.j;return [ONB.lt.seq[j][0],x.querySelector('b').textContent,x.querySelector('.n-sp')?x.querySelector('.n-sp').classList.contains('open'):null];}),
    go:document.querySelector('#onbGo').disabled,lv:(document.querySelector('#onbCkL')||{}).textContent,est:ltEstimate({seq:ONB.lt.seq,fk:ONB.lt.fk,ckA:{},gok:[]}),fk:document.querySelectorAll('.onb-cr.fk').length}));
  ok('после карточек — «Проверь себя»: 6 самых трудных «знаю», перевод под пылью, «Дальше» неактивна, уровень по словам сверху',r.ph==='chk'&&r.rows.length===6&&r.rows.every((x,j,a)=>!j||a[j-1][0]>=x[0])&&r.rows.every(x=>x[2]===false)&&r.go&&r.lv===r.est&&!r.fk,r);
  await shot(P,'1-check');let L=await lay(P);ok('«Проверь себя»: ничего не вылезает, кнопки в окне',!L.wide.length&&!L.out.length&&!L.sx,L);
  await P.click('.onb-cr[data-j] .n-sp');await P.waitForTimeout(200);
  r=await P.evaluate(()=>({open:document.querySelector('.onb-cr[data-j] .n-sp').classList.contains('open'),go:document.querySelector('#onbGo').disabled}));
  ok('тап по пыли — перевод виден, «Дальше» ещё неактивна',r.open&&r.go,r);
  const lv0=r.lv;for(const x of await P.$$('.onb-cr[data-j] .onb-cb .y'))await x.click();await P.waitForTimeout(150);
  r=await P.evaluate(()=>({go:document.querySelector('#onbGo').disabled,lv:document.querySelector('#onbCkL').textContent,open:[...document.querySelectorAll('.onb-cr[data-j] .n-sp')].every(x=>x.classList.contains('open'))}));
  ok('«Знал» на всех — «Дальше» активна, уровень тот же, переводы открылись',!r.go&&r.open&&r.lv===(await P.evaluate(()=>ltEstimate({seq:ONB.lt.seq,fk:ONB.lt.fk,ckA:{},gok:[]}))),r);
  const before=await P.evaluate(()=>CEFR.indexOf(document.querySelector('#onbCkL').textContent));
  for(const x of await P.$$('.onb-cr[data-j] .onb-cb .n'))await x.click();await P.waitForTimeout(250);
  r=await P.evaluate(()=>({lv:CEFR.indexOf(document.querySelector('#onbCkL').textContent),flip:ONB.lt.ck.every(j=>ONB.lt.seq[j][1]===false),nk:Object.values(ONB.lt.ckA).filter(v=>v===false).length,go:document.querySelector('#onbGo').disabled,cls:[...document.querySelectorAll('.onb-cr[data-j]')].every(x=>x.classList.contains('n'))}));
  ok('«Не знал» на всех — уровень сверху ниже на глазах, записи стали «не знаю»',r.lv<before&&r.flip&&r.nk===6&&!r.go&&r.cls,{before,...r});
  await shot(P,'2-check-no');
  await P.click('#onbGo');await P.waitForTimeout(400);ok('«Дальше» — грамматика',(await st(P)).ph==='g');
  for(let k=0;k<4;k++){await P.click('.onb-opts .onb-o[data-ok="1"]');await P.waitForTimeout(800);}
  r=await P.evaluate(()=>{const T=ONB.lt,U=JSON.parse(JSON.stringify(T));U.ck.forEach(j=>U.seq[j][1]=true);U.ckA={};
    return {ph:T.ph,c:ONB.cefr,lv:(document.querySelector('#onbLv b')||{}).textContent,why:[...document.querySelectorAll('.onb-why span')].map(x=>x.textContent),m:[...document.querySelectorAll('.onb-why b.m')].map(x=>x.textContent),honest:ltEstimate(U)};});
  ok('итог: уровень цветом и за что — «знаю 10 из 10», «не знал 6», «перевод 1 из 2», «выдуманные не попался», «грамматика 4 из 4»',r.ph==='res'&&r.lv===r.c&&r.why.join('|')==='знаю 10 из 10|не знал 6|перевод 1 из 2|выдуманные не попался|грамматика 4 из 4'&&r.m.join()==='6,1 из 2',r);
  ok('честное «не знал» понизило итог',CEFR_I(r.c)<CEFR_I(r.honest),{c:r.c,без_не_знал:r.honest});
  await shot(P,'3-result');L=await lay(P);ok('итог: ничего не вылезает, кнопки в окне',!L.wide.length&&!L.out.length&&!L.sx,L);
  // «назад» из «Проверь себя» / итога — к началу теста, уровень считается заново
  await P.evaluate(()=>onbBack());await P.waitForTimeout(300);await P.click('#onbGo');await P.waitForTimeout(400);
  r=await P.evaluate(()=>({ph:ONB.lt.ph,i:ONB.lt.i,c:ONB.cefr,ck:ONB.lt.ck}));ok('«назад» и снова тест — с нуля, старый уровень сброшен',r.ph==='w'&&r.i===0&&r.c===null&&r.ck===null,r);

  // ===== 2. Deutsch, с анимациями: выдуманные «знаю», остальное через раз; ПК — клавиши
  const B=await mk({fx:true},'dark'),Q=B.page;await start(Q,'de');
  let n2=0;const s2=await runCards(Q,c=>c.ch?(PC?'key'+(c.opts.findIndex(o=>o[1]==='1')+1):'ok'):c.fake?'yes':(n2++%2?'yes':'no'),520);
  const c2=s2.filter(x=>x.ch),arts=await Q.evaluate(ws=>ws.map(w=>LT_W.de.flat().some(x=>/^(der|die|das) /.test(x[0])&&x[0].slice(4)===w)),c2.map(c=>c.w));
  ok('немецкий: «выбери перевод» дважды (15 карточек), у существительных — артикль цветом, все ответы верные',s2.length===15&&c2.length===2&&c2.every((c,j)=>c.art===arts[j])&&c2.every(c=>c.after.some((x,j)=>c.opts[j][1]==='1'&&/\bok\b/.test(x))),c2.map(c=>[c.w,c.art,c.opts.map(o=>o[0])]));
  if(PC)ok('ПК: «1 / 2 / 3» — выбрать вариант',c2.length===2&&c2.every(c=>c.after.some(x=>/\bok\b/.test(x))));
  r=await Q.evaluate(()=>({ph:ONB.lt.ph,fk:[...document.querySelectorAll('.onb-cr.fk')].map(x=>x.textContent),fkArt:document.querySelectorAll('.onb-cr.fk .art').length,rows:document.querySelectorAll('.onb-cr[data-j]').length,art:document.querySelectorAll('.onb-cr[data-j] .art').length,bb:__bb.slice(-1)[0]}));
  ok('«Проверь себя»: выдуманные «знаю» — одной строкой «таких слов нет», с артиклем цветом',r.ph==='chk'&&r.fk.length===1&&/таких слов нет/.test(r.fk[0])&&(r.fk[0].match(/·/g)||[]).length===2&&r.fkArt===2&&r.rows>=1,r);
  await Q.waitForTimeout(700);await shot(Q,'4-check-de-dark');L=await lay(Q);ok('тёмная тема: ничего не вылезает, кнопки в окне',!L.wide.length&&!L.out.length&&!L.sx,L);
  // одно «не знал» с анимацией — без ошибок; Enter — «Дальше» на ПК
  const rows2=await Q.$$('.onb-cr[data-j]');for(let k=0;k<rows2.length;k++)await (await rows2[k].$(k?'.onb-cb .y':'.onb-cb .n')).click();await Q.waitForTimeout(800);
  if(PC){await Q.keyboard.press('Enter');}else await Q.click('#onbGo');await Q.waitForTimeout(500);
  ok('«Дальше» (на ПК — Enter) — грамматика',(await st(Q)).ph==='g');
  for(let k=0;k<4;k++){await Q.click('.onb-opts .onb-o');await Q.waitForTimeout(1100);}
  r=await Q.evaluate(()=>[...document.querySelectorAll('.onb-why span')].map(x=>x.textContent));
  ok('итог: «выдуманные попался 3», «не знал 1»',r.includes('выдуманные попался 3')&&r.includes('не знал 1'),r);
  await Q.waitForTimeout(900);await shot(Q,'5-result-de-dark');

  // ===== 3. ни одного «знаю» — сразу грамматика, без «Проверь себя»; на карточках выбора кнопка «назад» Telegram спрятана
  const C=await mk({fx:false}),R=C.page;await start(R,'en');
  await runCards(R,c=>c.ch?'dk':'no');r=await R.evaluate(()=>({ph:ONB.lt.ph,ck:ONB.lt.ck,b:ONB.lt.b,seq:ONB.lt.seq.map(x=>x[1]?1:0).join('')}));
  ok('ни одного «знаю» — «Проверь себя» нет, сразу грамматика; «Не знаю» в выборе = не знает',r.ph==='g'&&r.ck.length===0&&r.b===0&&/^0+$/.test(r.seq),r);
  await R.evaluate(()=>{ONB=null;renderOnb(1);});await R.waitForTimeout(400);await R.click('#onbGo');await R.waitForTimeout(300);
  for(let k=0;k<5;k++){await R.click('#onbNo');await R.waitForTimeout(140);}
  r=await R.evaluate(()=>({ch:document.querySelector('#onbCard').classList.contains('ch'),bb:__bb.slice(-1)[0]}));
  ok('на карточке «выбери перевод» «‹ Назад» Telegram спрятана (палец задевал)',r.ch&&r.bb==='hide',r);
  await shot(R,'6-choice');L=await lay(R);ok('«выбери перевод»: ничего не вылезает, кнопки в окне',!L.wide.length&&!L.out.length&&!L.sx,L);

  // ===== 4. «Пропустить» посреди теста (новичок) — уровень по уже данным ответам, сразу эпизод
  const D=await mk({fx:false,onboarded:false}),S=D.page;await S.waitForTimeout(500);
  await S.evaluate(()=>{ONB=null;renderOnb(0);ONB.lang='en';ONB.goal='work';renderOnb(1);});await S.waitForTimeout(500);await S.click('#onbGo');await S.waitForTimeout(400);
  for(let k=0;k<5;k++){await S.click('#onbYes');await S.waitForTimeout(150);}
  const exp=await S.evaluate(()=>ltEstimate(ONB.lt));await S.click('#onbSkip');await S.waitForTimeout(1600);
  r=await S.evaluate(()=>({scr:screen,c:store.cefr,on:store.onboarded}));ok('«Пропустить» после 5 карточек — уровень по ответам, сразу эпизод',r.scr==='scep'&&r.on&&r.c===exp,{exp,...r});

  // ===== 5. варианты «выбери перевод» для всех слов EN и DE: один верный, разные, свои — без общего корня
  r=await P.evaluate(()=>{const bad=[];for(const lg of ['en','de'])LT_W[lg].forEach((band,bi)=>band.forEach(w=>{for(let k=0;k<6;k++){const o=onbChOpts(lg,bi,w);const t=o.map(x=>x[0]);
      if(o.length!==3||o.filter(x=>x[1]).length!==1||o.find(x=>x[1])[0]!==w[1]||new Set(t).size!==3||o.some(x=>!x[1]&&ruStems(x[0]).some(s=>ruStems(w[1]).includes(s))))bad.push(lg+' '+w[0]+': '+t.join(' / '));}}));return bad;});
  ok('варианты для всех 80 слов: 3, верный один, без повторов и общего корня',!r.length,r.slice(0,5));
  // оценка: выбор весит больше свайпа; «не знал» тянет вниз
  r=await P.evaluate(()=>{const s=[[2,true],[3,false],[2,true],[3,true],[4,false],[3,true]];const sw=CEFR.indexOf(ltEstimate({seq:s,fk:0,gok:[]}));
    const ch=CEFR.indexOf(ltEstimate({seq:s.map((x,j)=>j===3?[3,true,1.5]:x),fk:0,gok:[]}));
    const nk=CEFR.indexOf(ltEstimate({seq:s.map((x,j)=>j===0||j===2?[x[0],false]:x),fk:0,ckA:{0:false,2:false},gok:[]}));return {sw,ch,nk};});   // «не знал» = запись «не знаю» + штраф
  ok('оценка: «не знал» тянет вниз, выбор перевода не ломает старую формулу',r.nk<r.sw&&r.ch>=r.sw,r);
  ok('консоль чистая',![...A.errs,...B.errs,...C.errs,...D.errs].length,[...A.errs,...B.errs,...C.errs,...D.errs].slice(0,5));
  console.log(fails?`ИТОГ onbchk ${dev}: FAIL ${fails}`:`ИТОГ onbchk ${dev}: всё PASS`);await b.close();process.exit(fails?1:0);})();
function CEFR_I(c){return ['A1','A2','B1','B2','C1'].indexOf(c);}
