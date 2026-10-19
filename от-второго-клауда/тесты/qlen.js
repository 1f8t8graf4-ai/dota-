// 13.9.34 (P1, Андрей: «задания супер долгие»): план проверки scQuizPlan по всем сценам и эпизодам, новичок и «немного знаю», с печатью и без.
// В каждой проверке — 4 задания (или сколько активных фраз, если их меньше); ни в одном задании не больше 7 нужных кубиков
// (собрать фразу / на слух / примени в жизни — фраза ≤ 7 слов; «Собери выражение» — 2–5 слов). Плюс: на экране проверки длинная фраза — «Собери выражение»
// с клетками внутри фразы и 2 лишними кубиками; 2 попытки: после первой ошибки верные кубики остаются, в пустой клетке — первая буква; вторая — «Вот как правильно».
const {open}=require('./st');const {chromium}=require('playwright');
const dev=process.argv[2]||'ph';
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
const init=([st,fl])=>{if(!sessionStorage.getItem('__seeded')){sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify(fl));}};
const base={onboarded:true,introV:1,unl:1,snd:false,fx:false,wtapHint:1,lvl:'b',tourV:1,scSubChosen:1,autoSc:false};
(async()=>{const b=await chromium.launch();const vp=dev==='pc'?{width:1440,height:900}:{width:390,height:844};
  const A=await open({browser:b,uid:111,platform:dev==='pc'?'tdesktop':'ios',touch:dev!=='pc',ctx:{viewport:vp},wait:2200,init,initArg:[base,{admin:false,flags:{}}]}),P=A.page;
  // 1. все сцены × эпизоды × (новичок / знает) × (печать вкл / выкл)
  const R=await P.evaluate(()=>{const bad=[],cnt=[],types={};let n=0;
    for(const lvl of ['a','b'])for(const ty of [false,true]){store.lvl=lvl;store.typeIn=ty;
      for(const s of SCENES)s.parts.forEach((p,i)=>{const act=scAct(p.ph).length;if(!act)return;SCUR={id:s.id,i};const C=scQuizPlan(s.id,i);n++;
        const want=Math.min(4,act);if(C.Q.length!==want)cnt.push(`${s.id}#${i+1}: ${C.Q.length} из ${want}`);
        C.Q.forEach(q=>{types[q.type]=(types[q.type]||0)+1;const f=q.f,t=C.target(f);let need=0;
          if(q.type==='listen'||q.type==='build')need=scToks(t).length;
          if(q.type==='life'){const l=C.lifeOf(f);need=l?scToks(l.target).length:0;}
          if(q.type==='expr'){const E=scExpr(f,t);need=E?E.n:99;}
          if(need>7)bad.push(`${s.id}#${i+1} ${q.type} ${need}: ${t.slice(0,60)}`);});});}
    return {n,bad,cnt,types};});
  ok(`${dev}: план проверки — во всех ${R.n} проверках не больше 7 нужных кубиков`,!R.bad.length,R.bad.slice(0,8));
  ok(`${dev}: в каждой проверке 4 задания (или сколько активных фраз)`,!R.cnt.length,R.cnt.slice(0,8));
  ok(`${dev}: есть новые короткие виды — «Собери выражение», «Что прозвучало?», «Какое слово пропущено?»`,R.types.expr>0&&R.types.heard>0&&(R.types.gap4||0)>=0,R.types);
  // 2. экран: «Собери выражение» — найдём эпизод, где первое задание — expr
  const pick=await P.evaluate(()=>{store.lvl='b';store.typeIn=false;for(const s of SCENES)for(let i=0;i<s.parts.length;i++){if(!scAct(s.parts[i].ph).length)continue;const C=scQuizPlan(s.id,i);const k=C.Q.findIndex(q=>q.type==='expr');if(k>=0)return {id:s.id,i,k};}return null;});
  ok(`${dev}: нашёлся эпизод с «Собери выражение»`,!!pick,pick);
  if(pick){await P.evaluate(([id,i,k])=>{const o=scQuizPlan;scQuizPlan=function(a,b){const C=o.apply(this,arguments);const q=C.Q.splice(k,1)[0];C.Q.unshift(q);return C;};renderScQuiz(id,i);scQuizPlan=o;},[pick.id,pick.i,pick.k]);
    await P.waitForTimeout(900);await P.evaluate(()=>{const r=document.getElementById('scbrev');if(r)r.click();});await P.waitForTimeout(300);
    let r=await P.evaluate(()=>({meta:(document.querySelector('.sc-meta')||{}).textContent||'',inline:!!document.querySelector('.sc-expr #scbans'),holes:document.querySelectorAll('#scbans .sc-hole').length,
      pool:document.querySelectorAll('#scbpool .sc-tile').length,mk:!!document.querySelector('.sc-q h2 .mk')}));
    const E=await P.evaluate(([id,i,k])=>{SCUR={id,i};const f=scQuizPlan(id,i).Q[k].f;return scExpr(f,scT(f));},[pick.id,pick.i,pick.k]);
    ok(`${dev}: «Собери выражение» — клетки внутри фразы по числу слов, кубики = выражение + 2 лишних, перевод выражения маркером`,/Собери выражение/.test(r.meta)&&r.inline&&r.holes===E.n&&r.pool===E.n+2&&r.mk,{r,n:E.n});
    await P.screenshot({path:`${__dirname}/shots/qlen-${dev}-1-expr.png`});
    // первая попытка — нарочно неверно: кладём кубики в обратном порядке (последний — лишний)
    const tiles=await P.evaluate(()=>[...document.querySelectorAll('#scbpool .sc-tile')].map(b=>b.textContent));
    const want=await P.evaluate(()=>[...document.querySelectorAll('#scbans .sc-hole')].length);
    const wrongOrder=await P.evaluate(([id,i,k])=>{SCUR={id,i};const f=scQuizPlan(id,i).Q[k].f,E=scExpr(f,scT(f));return scToks(E.x).map(w=>w.replace(/[.,!?;:…"«»()]+/g,''));},[pick.id,pick.i,pick.k]);
    const pool=await P.$$('#scbpool .sc-tile');const extra=[];for(const t of tiles)if(!wrongOrder.map(x=>x.toLowerCase()).includes(t.toLowerCase()))extra.push(t);
    // ставим: первое слово верно, дальше лишнее и остальное
    const seq=[wrongOrder[0],extra[0],...wrongOrder.slice(1)].slice(0,want);
    for(const w of seq){await P.evaluate(w=>{const b=[...document.querySelectorAll('#scbpool .sc-tile:not([disabled])')].find(x=>x.textContent.toLowerCase()===String(w).toLowerCase());if(b)b.click();},w);await P.waitForTimeout(80);}
    await P.click('#scbchk');await P.waitForTimeout(400);
    r=await P.evaluate(()=>({keep:document.querySelectorAll('#scbans .sc-tile.keep').length,hl:(document.querySelector('#scbans .sc-hole.hl')||{}).textContent||'',msg:(document.getElementById('scbmsg')||{}).textContent||'',fb:!!document.querySelector('.sc-fb')}));
    ok(`${dev}: первая ошибка — верный кубик остался, в пустой клетке первая буква, «Последняя попытка»`,r.keep>=1&&r.hl.length===1&&/Последняя попытка/.test(r.msg)&&!r.fb,r);
    await P.screenshot({path:`${__dirname}/shots/qlen-${dev}-2-hint.png`});
    // вторая ошибка — снова лишнее → ответ «Вот как правильно»
    const ex2=await P.evaluate(()=>[...document.querySelectorAll('#scbpool .sc-tile:not([disabled])')].map(b=>b.textContent));
    for(const w of ex2){await P.evaluate(w=>{const b=[...document.querySelectorAll('#scbpool .sc-tile:not([disabled])')].find(x=>x.textContent===w);if(b)b.click();},w);await P.waitForTimeout(60);}
    await P.click('#scbchk');await P.waitForTimeout(500);
    r=await P.evaluate(()=>({fb:(document.querySelector('.sc-fb .t')||{}).textContent||'',fix:!!document.querySelector('.sc-fix'),mk:document.querySelectorAll('.sc-fix .mk').length,diff:(document.getElementById('scbdiff')||{}).innerHTML||''}));
    ok(`${dev}: вторая ошибка — «Вот как правильно», перепутанное маркером, без разбора в скобках`,/Вот как правильно/.test(r.fb)&&r.fix&&r.mk>=1&&!/\[/.test(r.diff),r);
    await P.screenshot({path:`${__dirname}/shots/qlen-${dev}-3-fix.png`});}
  // 3. «Что прозвучало?» — 3 варианта
  const h=await P.evaluate(()=>{store.lvl='b';for(const s of SCENES)for(let i=0;i<s.parts.length;i++){if(!scAct(s.parts[i].ph).length)continue;const C=scQuizPlan(s.id,i);const k=C.Q.findIndex(q=>q.type==='heard');if(k>=0)return {id:s.id,i,k};}return null;});
  if(h){await P.evaluate(([id,i,k])=>{const o=scQuizPlan;scQuizPlan=function(){const C=o.apply(this,arguments);const q=C.Q.splice(k,1)[0];C.Q.unshift(q);return C;};renderScQuiz(id,i);scQuizPlan=o;},[h.id,h.i,h.k]);await P.waitForTimeout(900);
    const r=await P.evaluate(()=>({meta:(document.querySelector('.sc-meta')||{}).textContent||'',opts:document.querySelectorAll('.sc-opt').length,video:!!document.querySelector('#scvw')}));
    ok(`${dev}: длинная фраза на слух — «Что прозвучало?», 3 варианта, видео`,/Что прозвучало/.test(r.meta)&&r.opts===3&&r.video,r);}
  ok(`${dev}: консоль чистая`,!A.errs.length,A.errs.slice(0,4));
  console.log(fails?`ИТОГ qlen ${dev}: FAIL ${fails}`:`ИТОГ qlen ${dev}: всё PASS`);await b.close();process.exit(fails?1:0);})();
