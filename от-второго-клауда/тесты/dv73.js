// 13.9.73 (П12): Versus — «Выбери перевод» через раз, варианты «на слух» похожи по звучанию, герой качается, реванш на другом диалоге.
// node dv73.js ph|pc (стенд воркера stand2.mjs, порт 8788)
// 1) вопросы: {tr:true} — второй раунд «Выбери перевод» (3 перевода, верный один, ru в вопросе пустой — старый клиент не покажет ответ);
//    {tr:false} — «Что значит?»; «на слух» — подмена похожим на звук словом, служебные слова не трогаем, «priest» → не «home».
// 2) бой: комната с переводом (store.dvQn нечётный), у друга — тот же вопрос, пузырь — английская реплика, варианты по-русски, разбор с переводом.
// 3) итог: опыт героя (10 за верный, победа +20), «ур. N», «новый уровень», у друга диалог тоже «сыгран», опыт сливается по максимуму.
// 4) реванш: шторка на другом диалоге (тот же герой и ставка), подпись «реванш — другой диалог», следующий бой — «Что значит?», «Ты · ур. 2» на арене.
const {open,initData}=require('./st');const {chromium}=require('playwright');const fs=require('fs');
const dev=process.argv[2]||'ph';let fails=0;
const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));};
const base={onboarded:true,introV:1,unl:1,gold:300,lvl:'b',tourV:1,scSubChosen:1,autoSc:false,snd:false,fx:false,wtapHint:1,look:'nd',lookV:2};
const vp=dev==='pc'?{width:1440,height:900}:{width:390,height:844};
if(!fs.existsSync(__dirname+'/shots'))fs.mkdirSync(__dirname+'/shots');
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});
  const mk=(uid,name,extra)=>open({browser:b,worker:true,uid,name,initData:initData(uid,name),platform:dev==='pc'?'tdesktop':'ios',ctx:{viewport:vp},wait:2300,init:seed,initArg:[Object.assign({},base,extra||{})]});
  const A=await mk(311,'Аня',{dvQn:1}),B=await mk(322,'Боря');const errs=[];[A,B].forEach(P=>P.page.on('pageerror',e=>errs.push(String(e))));
  const shot=async(P,n)=>{await P.waitForTimeout(300);await P.screenshot({path:`${__dirname}/shots/dv73-${dev}-${n}.png`});};
  // 1. вопросы
  let r=await A.page.evaluate(()=>{const D=dvDialogs(),out={tr:[],mean:[],hear:[]};
    D.forEach(x=>{for(let n=0;n<6;n++){const a=dvMakeQs(x.d,[x.A.name,x.B.name],{tr:true}),m=dvMakeQs(x.d,[x.A.name,x.B.name],{tr:false});
      out.tr.push(a.map(q=>q.t).join()+'|'+JSON.stringify({opts:a[1].opts,right:a[1].right,ru:a[1].ru,tru:a[1].tru,a:!!a[1].a,cy:a[1].opts.every(o=>/[а-яё]/i.test(o))}));
      out.mean.push(m.map(q=>q.t).join());
      [a[2],m[2]].forEach(q=>{if(q&&q.t==='hear')out.hear.push({right:q.right,opts:q.opts});});}});
    return out;});
  const tr=r.tr.map(s=>{const i=s.indexOf('|');return {ts:s.slice(0,i),q:JSON.parse(s.slice(i+1))};});
  ok('{tr:true}: второй раунд — «Выбери перевод» (собери · перевод · на слух)',tr.every(x=>x.ts==='build,tr,hear'),[...new Set(tr.map(x=>x.ts))]);
  ok('«Выбери перевод»: 3 разных перевода, верный один, по-русски, реплика с голосом',tr.every(x=>x.q.opts.length===3&&new Set(x.q.opts).size===3&&x.q.opts.filter(o=>o===x.q.right).length===1&&x.q.cy&&x.q.a),tr.slice(0,2).map(x=>x.q.opts));
  ok('в вопросе ru пустой (старый клиент не покажет ответ в пузыре), перевод — в tru',tr.every(x=>x.q.ru===''&&x.q.tru===x.q.right));
  ok('{tr:false}: второй раунд — «Что значит?»',r.mean.every(t=>t==='build,mean,hear'),[...new Set(r.mean)]);
  // на слух: неверный вариант = та же реплика, одно слово заменено похожим на звук
  const FN=new Set('from with into onto about after before until upon than that this these those what when where which while whose without within the a an to of and or in on at for is are was were be it i you he she we they me my your his her our their some any all very'.split(' '));
  const lev=(a,b)=>{const m=a.length,n=b.length;let p=Array.from({length:n+1},(_,j)=>j);for(let i=1;i<=m;i++){const c=[i];for(let j=1;j<=n;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c;}return p[n];};
  const suf=(a,b)=>{let k=0;while(k<a.length&&k<b.length&&a[a.length-1-k]===b[b.length-1-k])k++;return k;},pre=(a,b)=>{let k=0;while(k<a.length&&k<b.length&&a[k]===b[k])k++;return k;};
  let one=0,sound=0,fnHit=0,home=0,tot=0;const bad=[];
  r.hear.forEach(q=>q.opts.filter(o=>o!==q.right).forEach(o=>{tot++;const A1=q.right.split(/\s+/),B1=o.split(/\s+/);if(A1.length!==B1.length)return;
    const d=A1.map((w,i)=>[w,B1[i]]).filter(([x,y])=>x!==y);if(d.length!==1)return;one++;
    const [x,y]=d[0].map(w=>w.toLowerCase().replace(/[^a-z']/g,''));if(FN.has(x))fnHit++;if(x==='priest'&&y==='home')home++;
    if(suf(x,y)>=2||pre(x,y)>=2||lev(x,y)<=2)sound++;else bad.push(x+'→'+y);}));
  ok('«на слух»: почти всегда та же реплика с одним заменённым словом',one>=tot*0.9,{one,tot});
  ok('«на слух»: замена похожа на звук (общее окончание / начало или разница ≤ 2 буквы)',sound>=one*0.95,{sound,one,bad:bad.slice(0,6)});
  ok('«на слух»: служебные слова не подменяем, «priest» → не «home»',fnHit===0&&home===0,{fnHit,home});
  r=await A.page.evaluate(()=>{const L=store,keep={heroXP:store.heroXP,dvPlay:store.dvPlay};store.heroXP={'deadlock:venator':50};store.dvPlay={'rat-king:0':2};
    const o=storeMerge({heroXP:{'deadlock:venator':20,'deadlock:rat-king':40},dvPlay:{'rat-king:0':1,'rat-king:1':3},sv:(store.sv||0)+5},store.sv||0);store.heroXP=keep.heroXP;store.dvPlay=keep.dvPlay;return {hx:o.heroXP,dp:o.dvPlay};});
  ok('синк: опыт героев и сыгранные диалоги — больший по каждому ключу',r.hx['deadlock:venator']===50&&r.hx['deadlock:rat-king']===40&&r.dp['rat-king:0']===2&&r.dp['rat-king:1']===3,r);
  r=await A.page.evaluate(()=>[hxLv(0),hxLv(29),hxLv(30),hxLv(119),hxLv(120),hxLv(270),hxLv(480)]);
  ok('уровень героя: 0 → 1, 30 → 2, 120 → 3, 270 → 4, 480 → 5',r.join()==='1,1,2,2,3,4,5',r);
  // 2. бой с «Выбери перевод»
  await A.page.evaluate(()=>{renderGameScreen('deadlock');});await A.page.waitForTimeout(600);
  await A.page.click('#gmRoot .dv-cta');await A.page.waitForTimeout(500);
  r=await A.page.evaluate(()=>({sm:[...document.querySelectorAll('.dv-sides button small')].map(x=>x.textContent)}));
  ok('шторка: у героев — «ур. 1»',r.sm.length===2&&r.sm.every(t=>/ур\. 1/.test(t)),r);
  const meHero=await A.page.evaluate(()=>document.querySelector('.dv-sides button.on b').textContent);
  await A.page.click('#dvGo');await A.page.waitForTimeout(1300);
  r=await A.page.evaluate(()=>({code:KV&&KV.code,ts:KV&&KV.room.qs.map(q=>q.t),sid:KV&&KV.room.sid,qn:store.dvQn}));
  ok('комната: собери · выбери перевод · на слух (store.dvQn был нечётный), счётчик +1',r.ts&&r.ts.join()==='build,tr,hear'&&r.qn===2,r);
  const code=r.code,key=(/^dd:deadlock:([\w-]+:\d+)/.exec(r.sid)||[])[1];
  await B.page.evaluate(c=>kvJoin(c),code);await B.page.waitForTimeout(1500);await B.page.click('#dvIn');
  await Promise.all([A.page.waitForSelector('#dvxPan .dvx-ask',{timeout:9000}),B.page.waitForSelector('#dvxPan .dvx-ask',{timeout:9000})]);
  r=await B.page.evaluate(k=>({qs:KV.room.qs.map(q=>q.t).join(),dp:(store.dvPlay||{})[k]||0}),key);
  ok('у друга те же вопросы, его диалог тоже «сыгран» (для реванша)',r.qs==='build,tr,hear'&&r.dp===1,r);
  async function play(P,plan,tag){const log=[];for(let k=0;k<3;k++){await P.waitForFunction(kk=>KV&&KV.k===kk&&document.querySelector(`#dvxPan[data-r="${kk}"] .dvx-ask`),k,{timeout:9000});
      const t=await P.evaluate(()=>KV.room.qs[KV.k].t),right=plan[k];
      if(t==='build'){const q=await P.evaluate(()=>KV.room.qs[KV.k]);const order=right?q.tk:[...q.tk].reverse();const used=new Set();
        for(const w of order){const idx=await P.evaluate(([w,used])=>{const b=[...document.querySelectorAll('#scbpool .sc-tile:not([disabled])')].find(x=>x.textContent===w&&!used.includes(x.dataset.k));return b?b.dataset.k:null;},[w,[...used]]);if(idx==null)break;used.add(idx);await P.click(`#scbpool .sc-tile[data-k="${idx}"]`);await P.waitForTimeout(50);}
        await P.click('#dvChk');}
      else{if(t==='tr'&&tag==='A'){const u=await P.evaluate(()=>{const q=KV.room.qs[KV.k];return {bub:(document.querySelector('#dvxBub .dvx-b span')||{}).textContent,en:q.en,ask:document.querySelector('#dvxPan .dvx-ask').textContent,opts:[...document.querySelectorAll('#dvxPan .dvx-o button')].map(x=>x.textContent)};});
          ok('раунд «Выбери перевод»: в пузыре — английская реплика, вопрос «Выбери перевод», 3 варианта по-русски',u.bub===u.en&&/Выбери перевод/.test(u.ask)&&u.opts.length===3&&u.opts.every(o=>/[а-яё]/i.test(o)),u);await shot(P,1);}
        await P.evaluate(([right])=>{const q=KV.room.qs[KV.k],bs=[...document.querySelectorAll('#dvxPan .dvx-o button')];(bs.find(x=>(x.dataset.v===q.right)===right)||bs[0]).click();},[right]);}
      await P.waitForTimeout(250);
      if(t==='tr'&&tag==='A'){const f=await P.evaluate(()=>({fb:document.querySelector('#dvFb').textContent,tru:KV.room.qs[KV.k-1].tru,en:KV.room.qs[KV.k-1].en}));ok('разбор «Выбери перевод»: реплика и её перевод',f.fb.includes(f.en)&&f.fb.includes(f.tru)&&/Верно/.test(f.fb),f);}
      log.push(t+':'+(await P.evaluate(()=>((document.querySelector('#dvFb b')||{}).textContent||''))));}
    return log;}
  const [la,lb]=await Promise.all([play(A.page,[true,true,true],'A'),play(B.page,[true,false,true],'B')]);
  ok('Аня — 3 из 3, Боря — ошибка в переводе',la.every(x=>/Верно/.test(x))&&/Мимо/.test(lb[1]),{la,lb});
  await Promise.all([A.page.waitForSelector('#dvx .dvx-end',{timeout:20000}),B.page.waitForSelector('#dvx .dvx-end',{timeout:20000})]);await A.page.waitForTimeout(500);
  // 3. опыт героя
  const hidA=await A.page.evaluate(n=>(gmHeroesAll().find(h=>h.name===n)||{}).id,meHero);
  r=await A.page.evaluate(id=>({xp:(store.heroXP||{})['deadlock:'+id],box:(document.querySelector('.dvx-end .dvx-xp')||{}).textContent||'',up:!!document.querySelector('.dvx-end .dvx-xp.up'),tbl:[...document.querySelectorAll('.dvx-end .kv-tbl tbody tr td:first-child')].map(x=>x.textContent)}),hidA);
  ok('Аня: +50 опыта (3 верных + победа), ур. 2, «новый уровень»',r.xp===50&&/\+50 опыта/.test(r.box)&&/ур\. 2/.test(r.box)&&/новый уровень/.test(r.box)&&r.up,r);
  ok('таблица итога: раунд «Перевод»',r.tbl.join()==='Собери,Перевод,На слух',r.tbl);
  r=await B.page.evaluate(()=>{const id=(dvMe().me||{}).id;return {xp:(store.heroXP||{})['deadlock:'+id],box:(document.querySelector('.dvx-end .dvx-xp')||{}).textContent||''};});
  ok('Боря: +20 опыта (2 верных, поражение), ур. 1',r.xp===20&&/\+20 опыта/.test(r.box)&&/ур\. 1/.test(r.box),r);
  await shot(A.page,2);
  // 4. реванш — другой диалог
  await A.page.waitForTimeout(800);await A.page.evaluate(()=>{const s=document.querySelector('.stl');if(s)s.remove();});
  const lbl=await A.page.evaluate(()=>document.querySelector('#dvAgain').textContent);
  ok('кнопка «Реванш — другой диалог»',/Реванш — другой диалог/.test(lbl),lbl);
  await A.page.click('#dvAgain');await A.page.waitForTimeout(600);
  r=await A.page.evaluate(k=>{const D=dvDialogs(),on=[...document.querySelectorAll('.dv-dlgs button')].findIndex(x=>x.classList.contains('on'));const x=D[on];
    return {nk:x&&x.h.id+':'+x.i,k,side:(document.querySelector('.dv-sides button.on b')||{}).textContent,lv:(document.querySelector('.dv-sides button.on small')||{}).textContent,bet:(document.querySelector('.kv-bets button.on')||{}).dataset.b,note:[...document.querySelectorAll('.kv-lbl')].map(x=>x.textContent).join(' | ')};},key);
  ok('реванш: в шторке другой диалог, тот же герой, та же ставка, «реванш — другой диалог», у героя «ур. 2»',r.nk&&r.nk!==r.k&&r.side===meHero&&r.bet==='25'&&/реванш — другой диалог/.test(r.note)&&/ур\. 2/.test(r.lv),r);
  await shot(A.page,3);
  await A.page.click('#dvGo');await A.page.waitForTimeout(1300);
  r=await A.page.evaluate(()=>({ts:KV&&KV.room.qs.map(q=>q.t).join(),nm:(document.querySelector('#dvxStage .dvx-p.lf .dvx-nm small')||{}).textContent}));
  ok('следующий бой — «Что значит?» (через раз), на арене «Ты · ур. 2»',r.ts==='build,mean,hear'&&r.nm==='Ты · ур. 2',r);
  await A.page.evaluate(()=>dvBack());await A.page.waitForTimeout(300);
  const W=await A.page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1);ok('страница вбок не едет',W);
  ok('консоль чистая',!errs.length&&!A.errs.length&&!B.errs.length,errs.concat(A.errs,B.errs).slice(0,4));
  console.log(fails?`FAILS: ${fails}`:'ALL PASS');await b.close();process.exit(fails?1:0);
})().catch(e=>{console.error(e);process.exit(2);});
