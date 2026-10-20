// 13.9.43 — игр нет (вкладки, функции, данные, старое store.tab='games'); фразы по пользе и цели: в проверку не попадает
// «только понимать» (мат) у цели «работа», попадает у цели «кино»; «Собери выражение» — по f.x; «С паузами» у всех; итог без звёзд.  node ph43.js ph|pc
const {open}=require('./st');const {chromium}=require('playwright');
const dev=process.argv[2]||'ph',pc=dev==='pc';
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
const seed=([st,fl])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify(fl));};
const base={onboarded:true,introV:1,look:'nd',lookV:2,unl:1,snd:false,lvl:'b',cefr:'B1',goalWhy:'work',scSubChosen:1,autoSc:false,wtapHint:1,scPause:'off',fx:false,gold:500,tab:'games'};
(async()=>{const b=await chromium.launch();const vp=pc?{width:1440,height:900}:{width:390,height:844};
  const A=await open({browser:b,touch:!pc,uid:876754050,ndDefault:true,ctx:{viewport:vp,colorScheme:'light'},wait:2600,init:seed,initArg:[base,{admin:true,flags:{}}]}),P=A.page;
  const req=[];P.on('request',q=>{if(/data\/(dota|words|lore-vocab|tips|spy)\.json|lore\.json/.test(q.url()))req.push(q.url());});
  let r=await P.evaluate(()=>({tab:store.tab,tabs:TABS.map(t=>t.id),g:['renderDotaWorld','renderCSWorld','startSession','renderQ','startDuel','renderSpyHub','renderTour','cgStart','gamesTabHTML','loadLore'].filter(n=>{try{return typeof eval(n)!=='undefined';}catch(e){return false;}}),
    d:['WORDS','TIPS','LORE_VOCAB','SPY_HEROES','HEROES'].filter(k=>window.__DATA&&window.__DATA[k]),flags:FLAG_SECTIONS.map(x=>x[0])}));
  ok('игр нет: вкладки, функции, данные, флаги; старое store.tab «games» → Главная',r.tab==='learn'&&r.tabs.join('|')==='learn|kino|dict|profile'&&!r.g.length&&!r.d.length&&r.flags.join('|')==='all|kino|kinolesson',r);
  r=await P.evaluate(()=>{renderTab('games');return {screen,tab:store.tab};});ok('renderTab(«games») → Главная',r.tab==='learn',r);
  ok('«С паузами» включены один раз у всех (было «без пауз»)',await P.evaluate(()=>store.scPause==='on'&&store.scPauseV===1));
  // разметка фраз
  r=await P.evaluate(()=>{const S=SCENES.flatMap(s=>s.parts.flatMap(p=>p.ph));return {n:S.length,u:S.filter(f=>f.u!=null).length,x:S.filter(f=>f.x).length,bad:S.filter(f=>f.x&&!(scOf(SCENES.find(s=>s.parts.some(p=>p.ph.includes(f))).id).lang==='de'?f.de:f.en).toLowerCase().includes(f.x.toLowerCase())).length};});
  ok('у всех фраз есть польза u, у большинства — выражение x, и x — дословно из фразы',r.u===r.n&&r.x>r.n*0.8&&!r.bad,r);
  r=await P.evaluate(()=>{const q=g=>{store.goalWhy=g;return phPick(scAct(scOf('wolf-of-wall-street').parts[0].ph),20).map(f=>f.en);};return {work:q('work'),films:q('films')};});
  ok('цель «работа»: «How the fuck else…» в задания не попадает вовсе; цель «кино»: допускается (после полезных)',!r.work.some(x=>/fuck else/.test(x))&&r.films.some(x=>/fuck else/.test(x)),r);
  r=await P.evaluate(()=>{store.goalWhy='work';let bad=[];SCENES.forEach(s=>s.parts.forEach((p,i)=>{const L=scQuizPlan(s.id,i).list,good=scAct(p.ph).filter(f=>phU(f)>=2).length;if(good>=2&&L.some(f=>phU(f)<2))bad.push(s.id+'#'+i);}));return bad;});
  ok('во всех эпизодах (где полезных ≥ 2) в проверке нет «только понимать»',!r.length,r);
  r=await P.evaluate(()=>{const f=SCENES.flatMap(s=>s.parts.flatMap(p=>p.ph)).find(f=>f.x&&f.x.split(' ').length>=2&&f.en&&f.x!==f.en&&f.en.toLowerCase().includes(f.x.toLowerCase()));const E=scExpr(f,f.en);return {x:f.x,e:E&&E.x};});
  ok('«Собери выражение» берёт размеченное x',r.e&&r.e.toLowerCase()===r.x.toLowerCase(),r);
  r=await P.evaluate(()=>{const fx=scWatchFX(scOf('wolf-of-wall-street').parts[0]);return {n:fx.length,sorted:fx.every((f,k)=>!k||fx[k-1].a<=f.a),u:fx.map(phU)};});
  ok('плашки — до 5 самых полезных, по времени',r.n>0&&r.n<=5&&r.sorted,r);
  // итог без звёзд
  r=await P.evaluate(()=>{const s=scOf('wolf-of-wall-street');mount(`<div class="scn"><div class="sc-q sc-card sc-result">${ndResultHTML({s,i:0,stars:2,boss:false,les:false,lastEp:false,got:3,gain:40,okF:3,n:4})}</div></div>`,'scnscr scq');
    const R=document.querySelector('.n-ring2');return {ring:!!R,txt:R&&R.innerText.replace(/\s+/g,' '),star:/★/.test(document.querySelector('.n-done').innerText)};});
  ok('итог в «Новом»: кольцо «3/4», без звёзд',r.ring&&/3\s*\/4/.test(r.txt)&&!r.star,r);
  r=await P.evaluate(()=>{const P0=scP('wolf-of-wall-street');P0.done=[0,1];P0.st={0:3,1:2};renderScene('wolf-of-wall-street');return {sc:[...document.querySelectorAll('.n-sc')].map(x=>x.className),star:[...document.querySelectorAll('.n-ep')].some(x=>/★/.test(x.innerText))};});
  ok('страница сцены: у пройденных — галочка (всё верно — зелёная), звёзд нет',r.sc.length===2&&/full/.test(r.sc[0])&&!/full/.test(r.sc[1])&&!r.star,r);
  ok('игровые данные никто не запрашивает',!req.length,req);
  ok('консоль чистая',!A.errs.length,A.errs.slice(0,5));
  console.log(fails?`ИТОГ ${dev}: FAIL ${fails}`:`ИТОГ ${dev}: всё PASS`);await b.close();process.exit(fails?1:0);})();
