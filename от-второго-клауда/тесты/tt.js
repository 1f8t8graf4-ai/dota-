// 13.9.69 (П8, «по системе TikTok»): задания по 3 за раз + «Ещё 3», эпизод длиннее минуты — частями ≤ 1 мин; ph|pc
// A — повторение на сегодня (renderDaily): порции по 3, ошибка — первой в следующей порции, «Хватит», «Ещё раз» в тренировке
// B — «Мои слова» (renderMyWordsQuiz) · C — повторение сцены (renderScQuiz 'rev') · D — финал сцены · E — дуэль · F — части эпизода в плеере
const {open}=require('./st');const {chromium}=require('playwright');
const dev=process.argv[2]||'ph';
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify({admin:true,flags:{}}));};
const base={onboarded:true,introV:1,gold:900,lvl:'b',fx:false,tourV:1,scSubChosen:1,autoSc:false,age18:true,snd:false,unl:1,scPause:'off',scPauseV:1};
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
const shot=(p,n)=>p.screenshot({path:`${__dirname}/tt-${dev}-${n}.png`});
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const [vp,touch]=dev==='ph'?[{width:390,height:844},true]:[{width:1440,height:900},false];
  const {page,errs}=await open({browser:b,touch,uid:876754050,ctx:{viewport:vp},wait:2500,init:seed,initArg:[base]});
  const ev=(f,a)=>page.evaluate(f,a),W=ms=>page.waitForTimeout(ms);
  // общий решатель заданий повторения: карточка «Ещё учу / Знаю», кубики (верный порядок — те же токены scBuildTiles), «что значит» (моё слово — mywHere, фраза — f.ru)
  await ev(()=>{window.__solve=(want,pool)=>{const $=s=>document.querySelector(s),txt=s=>(($(s)||{}).textContent||'').trim();
    const ph=()=>pool.map(id=>{const [sid,fid]=id.split('|'),s=scOf(sid);return {s,f:s.parts.flatMap(p=>p.ph).find(x=>x.id===fid)};});
    const T=o=>o.s.lang==='de'?o.f.de:scT(o.f);
    if($('.sc-result'))return {k:'end'};
    if($('#dln'))return {k:'fbwait'};
    const meta=txt('.dl-q .sc-meta');
    if($('#rcYes')){window.__curT=$('.n-ren').innerText.trim();(want==='wrong'?$('#rcNo'):$('#rcYes')).click();return {k:want==='wrong'?'card-no':'card-yes',meta};}
    if(/Собери|Послушай и собери/.test(meta)){const h=$('.dl-q h2'),ru=h&&h.childNodes[0]&&h.childNodes[0].nodeType===3?h.childNodes[0].textContent.trim():'';
      const c=ph().find(o=>ru?o.f.ru===ru:T(o)===window.__curT);if(!c)return {k:'build?',meta,ru};const E=/выражение/.test(meta)?scExpr(c.f,T(c)):null;
      let tk=scBuildTiles(E?E.x:T(c),c.f,[],c.s.lang==='de').tk;if(want==='wrong')tk=tk.slice().reverse();
      const put=()=>tk.forEach(w=>{const t=[...document.querySelectorAll('#scbpool .sc-tile:not(.used)')].find(x=>x.textContent===w);t&&t.click();});
      put();$('#scbchk').click();if(want==='wrong'&&!$('#dln')){put();$('#scbchk').click();}
      window.__curT=null;return {k:'build',meta,fid:c.f.id};}
    if(/что значит/.test(meta)){const h=$('.dl-q h2').childNodes[0].textContent.trim(),o=[...document.querySelectorAll('.sc-opt')];
      const it=Object.values(store.myw).find(x=>x.w===h);let R;if(it)R=mywHere(it);else{const c=ph().find(x=>T(x)===h);R=c&&c.f.ru;}
      const b=want==='wrong'?o.find(x=>x.dataset.v!==R):o.find(x=>x.dataset.v===R);if(!b)return {k:'opt?',meta,h,R};b.click();return {k:it?'word':'pmean',meta,w:h};}
    return {k:'?',meta};};});
  const next=()=>ev(()=>{const n=document.querySelector('#dln');if(n)n.click();});

  // ---------- A. повторение на сегодня: 6 фраз + 3 слова = 9 → порции 3 · 3 · 3 · 2 (две ошибки уходят в следующую порцию) ----------
  const PH=await ev(()=>{const now=Date.now(),out=[];let j=0;for(const id of ['american-psycho','wolf-of-wall-street']){const s=scOf(id),P=scP(id);P.got=P.got||{};P.w[0]=1;
      scAct(s.parts[0].ph).filter(f=>{const n=dNorm(scT(f)).split(' ').length;return n>=2&&n<=7;}).slice(0,3).forEach(f=>{P.got[f.id]=now;P.m[f.id]=2;P.r[f.id]=[1,now-100000+(j++)*1000];out.push(id+'|'+f.id);});}
    scSave();store.myw={};const add=(k,w,ru,sid,pi,a,d)=>{const s=scOf(sid),r=s&&s.subs.find(z=>Math.abs(z[0]-a)<0.06);store.myw[k]={k,w,ru,de:'',sid,pi,line:r?r[2]:'',lineRu:r?r[3]:'',a,at:now,lvl:0,st:1,due:now-100000+d,tags:[]};};
    add('wolf-of-wall-street|clients','clients','клиенты','wolf-of-wall-street',0,21,1);add('american-psycho|tan','tan','загар','american-psycho',0,20.34,2);add('american-psycho|occasionally','occasionally','иногда','american-psycho',0,36.82,3);
    store.revDone=null;save();return out;});
  ok('A: посеяно 6 фраз (2–7 слов) и 3 слова',PH.length===6,PH);
  await ev(()=>renderDaily());await W(900);
  const portion=async(plan,tag)=>{const log=[];let segs=null;for(let g=0;g<30;g++){
      if(segs===null)segs=await ev(()=>document.querySelectorAll('.sc-segs i').length);
      const k=log.filter(x=>!/card/.test(x.k)).length,want=plan[log.length]||'right';
      const r=await ev(([w,p])=>window.__solve(w,p),[want,PH]);if(r.k==='end')break;log.push(r);if(/\?/.test(r.k)){ok(tag+': задание распознано',false,r);break;}
      await W(r.k.startsWith('card')?450:250);if(!r.k.startsWith('card')){await next();await W(450);}}
    const e=await ev(()=>({big:(document.querySelector('.sc-big')||{}).textContent,sub:(document.querySelector('.sc-result .sc-sub')||{}).textContent||'',more:(document.querySelector('#dlmore')||{}).textContent||'',h2:(document.querySelector('#dlh2')||{}).textContent||'',h3:(document.querySelector('#dlh3')||{}).textContent||''}));
    return {segs,log,e};};
  // порция 1: фраза 1 — «Ещё учу» (ошибка), слово — верно, фраза 2 — «Знаю» + кубики
  let r1=await portion(['wrong','right','right','right'],'A1');
  ok('A1: в порции 3 задания (сегменты), первая — карточка «Повторение · 1 из 3»',r1.segs===3&&/1 из 3/.test(r1.log[0].meta),{segs:r1.segs,m:r1.log[0]&&r1.log[0].meta});
  ok('A1: итог 2 / 3, «Осталось ещё 7 — по три за раз», «Ещё 3 →» и «Хватит»',r1.e.big==='2 / 3'&&/Осталось ещё 7 — по три за раз/.test(r1.e.sub)&&/Ещё 3/.test(r1.e.more)&&r1.e.h2==='Хватит',r1.e);
  await shot(page,'1-more');
  const sr=await ev(p=>{const [sid,fid]=p.split('|'),r=scP(sid).r[fid];return {st:r&&r[0],h:r&&Math.round((r[1]-Date.now())/36e5),rd:store.revDone===dayKey(new Date())};},PH[0]);
  ok('A1: «Ещё учу» — фраза вернётся завтра (шаг 1 → 0); заход ещё не засчитан — порции остались (13.9.71, ревью П8 п.2)',sr.st===0&&sr.h>=23&&sr.h<=24&&!sr.rd,sr);
  await ev(()=>document.querySelector('#dlmore').click());await W(800);
  // порция 2: первой — ошибка из прошлой порции, сразу кубиками (без карточки); слово 2 — ошибка
  const p2=await ev(()=>({segs:document.querySelectorAll('.sc-segs i').length,card:!!document.querySelector('#rcYes'),meta:(document.querySelector('.dl-q .sc-meta')||{}).textContent||'',h2:((document.querySelector('.dl-q h2')||{}).textContent||'').slice(0,80)}));
  const ru0=await ev(p=>{const [sid,fid]=p.split('|');return scOf(sid).parts.flatMap(x=>x.ph).find(x=>x.id===fid).ru;},PH[0]);
  ok('A2: ошибка — первой в следующей порции, сразу кубиками (без карточки)',p2.segs===3&&!p2.card&&/Собери/.test(p2.meta)&&p2.h2.startsWith(ru0),{...p2,ru0});
  let r2=await portion(['right','wrong','right','right'],'A2');
  ok('A2: итог, «Осталось ещё 5», «Ещё 3 →»',/Осталось ещё 5/.test(r2.e.sub)&&/Ещё 3/.test(r2.e.more),r2.e);
  const sr2=await ev(p=>{const [sid,fid]=p.split('|'),r=scP(sid).r[fid];return {st:r&&r[0],h:r&&Math.round((r[1]-Date.now())/36e5),rd:store.revDone===dayKey(new Date())};},PH[0]);
  ok('A2: повтор после ошибки верно — фраза так и остаётся на завтра (шаг 0), не уходит дальше (13.9.71, ревью П8 п.1)',sr2.st===0&&sr2.h>=23&&sr2.h<=24&&!sr2.rd,sr2);
  await ev(()=>document.querySelector('#dlmore').click());await W(800);
  let r3=await portion(['right','right','right','right'],'A3');
  ok('A3: первой — слово с ошибкой, «Осталось ещё 2», «Ещё 2 →»',r3.log[0]&&r3.log[0].k==='word'&&/Осталось ещё 2/.test(r3.e.sub)&&/Ещё 2/.test(r3.e.more),{first:r3.log[0],e:r3.e});
  await ev(()=>document.querySelector('#dlmore').click());await W(800);
  let r4=await portion(['right','right','right','right'],'A4');
  ok('A4: порций больше нет — заход повторения засчитан (13.9.71, ревью П8 п.2)',await ev(()=>store.revDone===dayKey(new Date())));
  ok('A4: последняя порция — 2 задания, «2 / 2», без «Ещё», «На главную»',r4.segs===2&&r4.e.big==='2 / 2'&&!r4.e.more&&r4.e.h2==='На главную'&&!/Осталось/.test(r4.e.sub),{segs:r4.segs,e:r4.e});
  const total=[r1,r2,r3,r4].reduce((a,r)=>a+r.log.filter(x=>!/card/.test(x.k)||x.k==='card-no').length,0);
  ok('A: всего ответов 11 = 9 + 2 повтора ошибок',total===11,String(total));
  await ev(()=>document.querySelector('#dlh2').click());await W(700);
  ok('A: «На главную» → Главная',await ev(()=>screen==='home'&&store.tab==='learn'),await ev(()=>screen+'/'+store.tab));

  // тренировка (o.train): 4 слова → 3 + 1, в конце «Ещё раз» — снова 3 из всех четырёх; «Хватит» посередине — назад
  await ev(()=>{const now=Date.now(),add=(k,w,ru)=>{store.myw[k]={k,w,ru,de:'',sid:'american-psycho',pi:0,line:'',lineRu:'',a:0,at:now,lvl:0,st:1,due:now+9e8,tags:[]};};
    add('x|hello','hello','привет');add('x|money','money','деньги');save();
    window.__trL=()=>Object.values(store.myw).slice(0,4).map(it=>({k:'w',it,due:it.due}));window.__back=0;
    renderDaily(window.__trL(),{train:true,nosrs:true,title:'Тренировка · Тест',back:()=>{window.__back++;renderTab('learn');}});});await W(700);
  let t1=await portion([],'T1');
  ok('тренировка: 3 задания, «Ещё 1 →» и «Хватит»',t1.segs===3&&/Ещё 1/.test(t1.e.more)&&t1.e.h2==='Хватит',{segs:t1.segs,e:t1.e});
  await ev(()=>document.querySelector('#dlmore').click());await W(700);
  let t2=await portion([],'T2');
  ok('тренировка: последняя — 1 задание, «Ещё раз» и «Назад в словарь»',t2.segs===1&&/Ещё раз/.test(t2.e.h3)&&t2.e.h2==='Назад в словарь',{segs:t2.segs,e:t2.e});
  await ev(()=>document.querySelector('#dlh3').click());await W(700);
  ok('тренировка: «Ещё раз» — снова порция из 3 (из всех четырёх)',await ev(()=>document.querySelectorAll('.sc-segs i').length)===3);
  let t3=await portion([],'T3');await ev(()=>document.querySelector('#dlh2').click());await W(600);
  ok('тренировка: «Хватит» → назад (o.back)',await ev(()=>window.__back===1&&screen==='home'),await ev(()=>window.__back+'/'+screen));

  // ---------- B. «Мои слова»: 5 слов → 3 + 2 ----------
  await ev(()=>{Object.values(store.myw).forEach((it,j)=>{if(j>=5)delete store.myw[it.k];});save();renderMyWordsQuiz();});await W(900);
  const myStep=async want=>ev(w=>{const h=document.querySelector('.sc-q h2');if(!h)return 'none';const t=h.childNodes[0].textContent.trim(),it=Object.values(store.myw).find(x=>x.w===t),R=mywHere(it),o=[...document.querySelectorAll('.sc-opt')];
    const b=w==='wrong'?o.find(x=>x.dataset.v!==R):o.find(x=>x.dataset.v===R);b.click();const n=document.querySelector('#mqn');n&&n.click();return 'ok';},want);
  const bs=await ev(()=>({segs:document.querySelectorAll('.sc-segs i').length,opts:document.querySelectorAll('.sc-opt').length,pairs:!!document.querySelector('.sw-pairs')}));
  ok('B: «Мои слова» — 3 задания «что значит», без пар',bs.segs===3&&bs.opts>=3&&!bs.pairs,bs);
  for(let k=0;k<3;k++){await myStep(k===0?'wrong':'right');await W(450);}
  const be=await ev(()=>({big:(document.querySelector('.sc-big')||{}).textContent,sub:(document.querySelector('.sc-result .sc-sub')||{}).textContent||'',m:(document.querySelector('#mqm')||{}).textContent||'',b:(document.querySelector('#mqb')||{}).textContent||''}));
  ok('B: итог 2 / 3, «Ещё 2 слова — по три за раз», «Ещё 2 →» и «Хватит»',be.big==='2 / 3'&&/Ещё 2 слова — по три за раз/.test(be.sub)&&/Ещё 2/.test(be.m)&&be.b==='Хватит',be);
  await shot(page,'2-words');
  await ev(()=>document.querySelector('#mqm').click());await W(700);
  ok('B: «Ещё 2» — 2 задания',await ev(()=>document.querySelectorAll('.sc-segs i').length)===2);
  for(let k=0;k<2;k++){await myStep('right');await W(450);}
  const be2=await ev(()=>({m:!!document.querySelector('#mqm'),a:(document.querySelector('#mqa')||{}).textContent||'',b:(document.querySelector('#mqb')||{}).textContent||''}));
  ok('B: в конце — «Ещё раз» и «К моим словам», без «Ещё N»',!be2.m&&be2.a==='Ещё раз'&&be2.b==='К моим словам',be2);

  // ---------- C. повторение сцены: 5 фраз пора → 3 + 3 (ошибка — первой во второй порции) ----------
  const SID='american-psycho';
  const CF=await ev(sid=>{const s=scOf(sid),P=scP(sid),now=Date.now();P.r={};P.m={};P.done=s.parts.map((_,i)=>i);
    const L=s.parts.flatMap(p=>scAct(p.ph)).filter(f=>{const n=dNorm(scT(f)).split(' ').length;return n>=2&&n<=7;}).slice(0,5);L.forEach(f=>{P.r[f.id]=[2,now-1000];P.m[f.id]=3;});scSave();
    REVC={sid:null,q:[],go:null};window.__plans=[];const o=scQuizPlan;window.__oPlan=o;
    scQuizPlan=function(){const C=o.apply(this,arguments);C.Q.forEach(q=>q.type='build');window.__plans.push(C.Q.map(q=>({id:q.f.id,re:!!q.re})));return C;};   // тип — «собери», чтобы отвечать наверняка
    return L.map(f=>f.id);},SID);
  ok('C: посеяно 5 фраз к повторению',CF.length===5,CF);
  const scAns=async want=>ev(([w,sid])=>{const $=s=>document.querySelector(s),pl=window.__plans[window.__plans.length-1];
    if($('#scnx')&&!$('#scnx').hidden&&$('.sc-fb')){$('#scnx').click();return 'next';}
    if(!$('#scbans'))return 'none';const k=window.__qn||0,s=scOf(sid),f=s.parts.flatMap(p=>p.ph).find(x=>x.id===pl[k].id),E=document.querySelector('.sc-expr')?scExpr(f,scT(f)):null;
    let tk=scBuildTiles(E?E.x:scT(f),f,[],false).tk;if(w==='wrong')tk=tk.slice().reverse();
    const put=()=>tk.forEach(t=>{const b=[...document.querySelectorAll('#scbpool .sc-tile:not(.used)')].find(x=>x.textContent===t);b&&b.click();});
    put();$('#scbchk').click();if(w==='wrong'&&!$('.sc-fb')){put();$('#scbchk').click();}window.__qn=k+1;return 'answered';},[want,SID]);
  const runRev=async plan=>{await ev(()=>{window.__qn=0;});for(let k=0,g=0;k<plan.length&&g<20;g++){const r=await scAns(plan[k]);await W(450);if(r==='answered')k++;if(r==='none')break;}
    for(let g=0;g<4;g++){const r=await ev(()=>{const n=document.querySelector('#scnx');if(n&&!n.hidden){n.click();return 1;}return 0;});await W(500);if(!r)break;}
    return ev(()=>({more:(document.querySelector('#scmore')||{}).textContent||'',res:!!document.querySelector('.sc-result,#scmore,#scpath,#scrp')}));};
  await ev(sid=>renderScQuiz(sid,'rev'),SID);await W(900);
  const c1p=await ev(()=>window.__plans[0]);
  ok('C1: в порции 3 фразы из 5',c1p&&c1p.length===3,c1p);
  const c1=await runRev(['wrong','right','right']);
  const wrongId=c1p[0].id;
  const st1=await ev(([sid,fid,ids])=>{const P=scP(sid);return {w:P.r[fid],ok:ids.map(i=>P.r[i]&&P.r[i][0]),now:Date.now()};},[SID,wrongId,c1p.slice(1).map(x=>x.id)]);
  ok('C1: «Ещё 3 · осталось 3 →» (ошибка + 2 непройденных)',/Ещё 3 · осталось 3/.test(c1.more),c1);
  ok('C1: ошибка — повторение завтра (шаг 2 → 1), а не выпадает из расписания',st1.w&&st1.w[0]===1&&Math.round((st1.w[1]-st1.now)/36e5)>=23,st1);
  ok('C1: верные — шаг 2 → 3',st1.ok.every(x=>x===3),st1.ok);
  await shot(page,'3-rev');
  await ev(()=>document.querySelector('#scmore').click());await W(900);
  const c2p=await ev(()=>window.__plans[1]);
  ok('C2: вторая порция — 3, первой ошибка из первой (повтор)',c2p&&c2p.length===3&&c2p[0].id===wrongId&&c2p[0].re,c2p);
  const c2=await runRev(['right','right','right']);
  const st2=await ev(([sid,fid])=>{const P=scP(sid);return {w:P.r[fid],due:scDue(scOf(sid)).length,left:scRevLeft(sid)};},[SID,wrongId]);
  ok('C2: всё повторено — «Ещё» нет, осталось 0; повтор ошибки верно — остаётся на завтра, шаг 1 (13.9.71, ревью П8 п.1)',!c2.more&&st2.due===0&&st2.left===0&&st2.w&&st2.w[0]===1&&Math.round((st2.w[1]-Date.now())/36e5)>=23,{c2,st2});
  const c3=await ev(([sid,fid])=>{REVC={sid,q:[{f:scOf(sid).parts.flatMap(p=>p.ph).find(x=>x.id===fid),type:'build',re:true}],go:null};const C=window.__oPlan(sid,'rev');return {n:C.list.length,q:REVC.q.length};},[SID,wrongId]);
  ok('C3: новый заход в повторение (не «Ещё») — с чистого листа',c3.n===0&&c3.q===0,c3);
  await ev(()=>{scQuizPlan=window.__oPlan;});

  // ---------- D. финал сцены — 3 фразы · E. дуэль — 3 вопроса ----------
  const d=await ev(sid=>{let n=-1;const o=renderScQuiz;renderScQuiz=function(id,i){n=i&&i.list?i.list.length:-2;renderScQuiz=o;};scBossStart(sid);renderScQuiz=o;return n;},SID);
  ok('D: финал сцены — 3 фразы (было 8)',d===3,String(d));
  const e=await ev(()=>SCENES.filter(s=>!s.age&&s.kind!=='clip').map(s=>{const qs=kvMakeQs(s,0);return [s.id,qs.length,qs.map(q=>q.t).join(',')];}));
  ok('E: дуэль — по 3 вопроса во всех сценах',e.every(x=>x[1]===3||x[1]===scAct(scOf(x[0]).parts.flatMap(p=>p.ph)).filter(f=>f.b>f.a).length),e.filter(x=>x[1]!==3));
  ok('E: в дуэли все три вида (на слух, что значит, вставь слово) хоть где-то',['listen','mean','gap'].every(t=>e.some(x=>x[2].split(',').includes(t))));

  // ---------- F. эпизод длиннее минуты — частями ----------
  const cuts=await ev(()=>{const out=[];for(const s of SCENES)s.parts.forEach((p,i)=>{const C=epCuts(s,i),pts=[p.a,...C,p.b],L=pts.slice(1).map((x,k)=>x-pts[k]);out.push({id:s.id,i,d:p.b-p.a,n:C.length+1,max:Math.max(...L),min:Math.min(...L)});});return out;});
  const longs=cuts.filter(x=>x.d>66);
  ok('F: все эпизоды > 66 с поделены, части ≤ 66 с и ≥ 12 с',longs.length>20&&longs.every(x=>x.n>1&&x.max<=66.5&&x.min>=12),longs.filter(x=>!(x.n>1&&x.max<=66.5&&x.min>=12)));
  ok('F: эпизоды ≤ 66 с не делятся',cuts.filter(x=>x.d<=66).every(x=>x.n===1));
  const F={sid:'wolf-of-wall-street',i:5};
  const fc=await ev(({sid,i})=>{const s=scOf(sid);return {cuts:epCuts(s,i),a:s.parts[i].a,b:s.parts[i].b};},F);
  ok('F: «Волк» эп. 6 — 2 части',fc.cuts.length===1,fc);
  const C0=fc.cuts[0]-fc.a;
  await ev(({sid,i})=>{const P=scP(sid);P.done=[0,1,2,3,4];P.w={0:1,1:1,2:1,3:1,4:1};delete (P.pt||{})[i];scSave();renderScene(sid);},F);await W(700);
  const row=await ev(()=>[...document.querySelectorAll('.n-ep')].map(x=>x.innerText.replace(/\s+/g,' ')).find(t=>/Эпизод 6/.test(t))||'');
  ok('F: на странице сцены у эпизода — «2 части»',/2 части/.test(row),row);
  await ev(({sid,i})=>renderScEp(sid,i),F);await W(900);
  const chip0=await ev(()=>(document.querySelector('#scPt')||{}).textContent||'');
  ok('F: в шапке эпизода — «2 части по минуте»',chip0==='2 части по минуте',chip0);
  await ev(()=>document.querySelector('#scplay').click());await W(1200);
  const tl=await ev(()=>({m:document.querySelectorAll('.n-tlc').length}));
  ok('F: на шкале — отметка конца части',tl.m===1,tl);
  await ev(c=>{SV.currentTime=c-1.3;},C0);await W(2600);
  const br=await ev(({sid,i})=>({card:!!document.querySelector('.sc-part'),txt:(document.querySelector('.sc-part')||{}).textContent||'',paused:SV.paused,t:SV.currentTime,pt:(scP(sid).pt||{})[i],chip:(document.querySelector('#scPt')||{}).textContent||''}),F);
  ok('F: дошли до конца части — пауза и карточка «Часть 1 из 2 · готово · Дальше · часть 2»',br.card&&br.paused&&/Часть 1 из 2/.test(br.txt)&&/Дальше · часть 2/.test(br.txt)&&br.pt===1&&Math.abs(br.t-C0)<0.6&&br.chip==='часть 1 из 2',br);
  await shot(page,'4-part');
  const inV=await ev(()=>{const a=document.querySelector('.sc-part').getBoundingClientRect(),v=SW.getBoundingClientRect();return a.left>=v.left-1&&a.right<=v.right+1&&a.top>=v.top-1&&a.bottom<=v.bottom+1&&a.width>v.width*.8;});
  ok('F: карточка части — поверх видео',inV);
  await ev(()=>document.querySelector('.sc-part').click());await W(1200);
  const go=await ev(()=>({card:!!document.querySelector('.sc-part'),paused:SV.paused,t:SV.currentTime,chip:(document.querySelector('#scPt')||{}).textContent||''}));
  ok('F: тап — карточка ушла, видео идёт дальше, в шапке «часть 2 из 2»',!go.card&&!go.paused&&go.t>C0+0.3&&go.chip==='часть 2 из 2',go);
  // карточка уходит и если запустить кнопкой плеера: ещё раз доводим до разреза в новом заходе
  await ev(()=>{SV.pause();});await ev(({sid,i})=>{delete (scP(sid).pt||{})[i];scSave();renderScEp(sid,i);},F);await W(900);
  await ev(()=>document.querySelector('#scplay').click());await W(800);await ev(c=>{SV.currentTime=c-1.3;},C0);await W(2600);
  const br2=await ev(()=>!!document.querySelector('.sc-part')&&SV.paused);await ev(()=>scPP());await W(900);
  ok('F: запустили кнопкой плеера — карточка части тоже уходит',br2&&await ev(()=>!document.querySelector('.sc-part')&&!SV.paused),String(br2));
  // перемотка через разрез разрыв не даёт
  await ev(()=>{SV.pause();});await ev(({sid,i})=>renderScEp(sid,i),F);await W(900);
  await ev(()=>document.querySelector('#scplay').click());await W(800);
  const from=await ev(()=>SV.currentTime);
  ok('F: недосмотренный эпизод — со следующей части',from>=C0-0.4&&from<C0+1.5,{from,C0});
  await ev(c=>{SV.currentTime=c-6;},C0);await W(900);await ev(c=>{SV.currentTime=c+4;},C0);await W(1500);
  ok('F: перемотка через разрез — без паузы',await ev(()=>!document.querySelector('.sc-part')&&!SV.paused));
  // досмотрел эпизод — «часть» стирается
  await ev(({sid,i})=>{const p=scOf(sid).parts[i];SV.currentTime=p.b-p.a-1.2;},F);await W(3200);
  const fin=await ev(({sid,i})=>({w:!!scP(sid).w[i],pt:(scP(sid).pt||{})[i]}),F);
  ok('F: досмотрел — эпизод досмотрен, номер части стёрт',fin.w&&fin.pt===undefined,fin);
  // режиссёрская версия — без разрывов
  await ev(({sid})=>renderDirCut(sid,5),F);await W(1200);await ev(c=>{if(SV.paused)SV.play();SV.currentTime=c-1.3;},C0);await W(2600);
  ok('F: режиссёрская версия — без разрывов',await ev(()=>!document.querySelector('.sc-part')&&!SV.paused));
  await ev(()=>{SC_DIR=false;renderTab('learn');});await W(500);
  // эпизод без частей — без отметок и без «частей»
  await ev(()=>renderScEp('american-psycho',0));await W(900);
  ok('F: короткий эпизод — без «частей» и отметок',await ev(()=>!document.querySelector('#scPt')&&!document.querySelector('.n-tlc')));
  await ev(()=>renderTab('learn'));await W(400);
  ok('консоль чистая',!errs.length,errs.slice(0,5).join(' | '));
  console.log(fails?`ИТОГ: ${fails} FAIL`:'ИТОГ: всё PASS');await b.close();})();
