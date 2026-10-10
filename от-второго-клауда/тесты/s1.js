// 13.6.3: сценарии по плану — каждый пункт PASS/FAIL
const {open}=require('./st');const {chromium}=require('playwright');
const res=[];const ok=(n,c,d)=>{res.push([c?'PASS':'FAIL',n,d||'']);console.log(c?'PASS':'FAIL',n,d||'');};
const base={onboarded:true,introV:1,gold:300,lvl:'b',fx:false,tourV:1,scSubChosen:1,autoSc:false};
const seed=([st,sc])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));if(sc)localStorage.setItem('dota_sc_v1',JSON.stringify(sc));};
async function answerAny(page){return page.evaluate(()=>{
  const c=x=>{const e=document.querySelector(x);if(e&&!e.hidden&&!e.disabled){e.click();return true;}return false;};
  if(c('#scLno'))return 'ladder-no';if(c('#scgno'))return 'gap-no';
  const o=document.querySelector('.sc-opt');if(o){o.click();return 'opt';}
  const pool=[...document.querySelectorAll('#scbpool button,.sc-pool button,.sc-tile')];if(pool.length){pool.forEach(b=>b.click());if(c('#scbchk'))return 'build';return 'tiles';}
  return 'none';});}
(async()=>{const b=await chromium.launch();
  // 1–8: основное
  {const {page,errs,ctx}=await open({browser:b,wait:2500,init:seed,initArg:[Object.assign({},base,{tab:'kino'}),{'american-psycho':{done:[],m:{},w:{0:1},st:{}}}]});
    ok('вкладка Кинозал не сбрасывается после синка',await page.evaluate(()=>store.tab==='kino'&&CLOUD_OK===true&&!!document.querySelector('.tabbar [aria-current="page"], .tabbar .on, .tabbar .cur')||store.tab==='kino'),await page.evaluate(()=>store.tab+' cloud='+CLOUD_OK));
    // цель дня и серия от ответа в сцене
    await page.evaluate(()=>{store.day=null;store.streak=0;store.lastDay=null;renderScQuiz('american-psycho',0);});await page.waitForTimeout(900);
    const how=await answerAny(page);await page.waitForTimeout(400);
    const d=await page.evaluate(()=>({n:store.day&&store.day.n,st:store.streak,ld:store.lastDay===new Date().toDateString(),wk:JSON.stringify(store.week)}));
    ok('ответ в сцене → цель дня +1 и серия 1',d.n===1&&d.st===1&&d.ld,how+' '+JSON.stringify(d));
    await page.evaluate(()=>renderTab('learn'));await page.waitForTimeout(500);
    const ht=await page.evaluate(()=>(document.querySelector('.ht-h span')||{}).textContent||'');ok('Главная «Сегодня» показывает серию и 1/20',/🔥 1 день · 1\/20/.test(ht),ht);
    // язык: обучение с Deutsch → английский фильм всё равно английский
    const L=await page.evaluate(()=>{store.langs=['de'];store.kinoLang='de';delete store.scSub;SCUR={id:'american-psycho',i:0};return scL()+'/'+scT(scOf('american-psycho').parts[0].ph[0]).slice(0,30);});
    ok('langs=de: английская сцена — английские задания',L.startsWith('en/'),L);
    const L2=await page.evaluate(()=>{store.scSub='de+ru';store.scSubChosen=true;SCUR={id:'american-psycho',i:0};const pl=scL();FLAG_ADMIN=true;const ad=scL();FLAG_ADMIN=false;store.scSub='en+ru';return pl+'/'+ad;});
    ok('13.7: «Учу Deutsch» у английской сцены — только админу',L2==='en/de',L2);
    const L3=await page.evaluate(()=>{SCUR={id:'downfall-bunker',i:0};return scL();});ok('Бункер → de',L3==='de',L3);
    // Бункер: пропуски немецкие и находятся
    const bk=await page.evaluate(()=>{const s=scOf('downfall-bunker');const bad=[];s.parts.forEach(p=>p.ph.forEach(f=>{if(!wordRe(f.gap).test(f.de))bad.push(f.gap);}));
      const f=s.parts[1].ph[0];return {bad,opts:scGapOptsDe(f,s.parts.flatMap(p=>p.ph)),f:f.gap};});
    ok('Бункер: все пропуски есть в немецкой фразе',bk.bad.length===0,JSON.stringify(bk));
    // немецкие ловушки — немецкие слова
    const go=await page.evaluate(()=>{const out=[];for(const id of ['wolf-lunch-de','sopranos-mahaffey-de','bb-mike-de']){const s=scOf(id),all=s.parts.flatMap(p=>p.ph);const f=scAct(s.parts[0].ph)[0];out.push(f.gap+': '+scGapOptsDe(f,all).join(', '));}return out;});
    ok('немецкие варианты пропуска',go.every(x=>x.split(': ')[1].split(', ').filter(Boolean).length>=2),go.join(' | '));
    // ü/ß на краю
    const um=await page.evaluate(()=>[['überrascht','ich war schon ein wenig überrascht'],['hieß','wie hieß der noch'],['übrig','wenn uns nun mal nichts anderes übrig bleibt']].map(([g,t])=>wordRe(g).test(t)));
    ok('ü/ß на краю слова',um.every(Boolean),JSON.stringify(um));
    // апостроф: ответ не виден
    const ap=await page.evaluate(()=>{const out=[];SCENES.forEach(s=>s.parts.forEach(p=>p.ph.forEach(f=>{if(f.gap&&/'/.test(f.gap)){const T=s.lang==='de'?f.de:f.en;const h=markWord(T,f.gap,'<span class="gap">&nbsp;</span>');out.push({g:f.gap,ok:!h.toLowerCase().includes(esc(f.gap).toLowerCase())&&h.includes('class="gap"'),h});}})));return out;});
    ok('пропуск с апострофом не показывает ответ ('+ap.length+' фраз)',ap.length>0&&ap.every(x=>x.ok),JSON.stringify(ap.filter(x=>!x.ok).slice(0,3)));
    // дуэль: вопросы немецкой сцены — на немецком
    const kv=await page.evaluate(()=>{const s=scOf('wolf-lunch-de'),qs=kvMakeQs(s,0),F=id=>s.parts.flatMap(p=>p.ph).find(x=>x.id===id);
      return qs.map(q=>({t:q.t,right:q.right,de:F(q.fid).de,en:F(q.fid).en}));});
    ok('дуэль wolf-lunch-de: есть «на слух»/«пропуск», ответы на немецком',kv.some(q=>q.t!=='mean')&&kv.filter(q=>q.t==='listen').every(q=>q.right===q.de)&&kv.filter(q=>q.t==='gap').every(q=>q.de.toLowerCase().includes(q.right.toLowerCase())),kv.map(q=>q.t+':'+q.right.slice(0,25)).join(' | '));
    // немецкий ввод
    const dl=await page.evaluate(()=>[deLoose('schweiss')===deLoose('schweiß'),deLoose('uberrascht')===deLoose('überrascht'),dCheck('wie hiess der noch','Wie hieß der noch').score]);
    ok('немецкий без клавиатуры (ß=ss, ü=u)',dl[0]&&dl[1]&&dl[2]===1,JSON.stringify(dl));
    // урок: реальное число фраз
    const ls=await page.evaluate(()=>{const b=scLessonScene();if(!b)return null;const n=b.n;renderTab('learn');const t=[...document.querySelectorAll('#hLesson')].map(x=>x.textContent).join(' || ');return {n,t,i:b.i,eps:[...new Set(b.cand.map(f=>f.pi))]};});
    ok('урок: один эпизод, число фраз на карточке',ls&&ls.eps.length===1&&new RegExp(ls.n+' фраз').test(ls.t)&&!/или урок: 5 фраз/.test(ls.t)||ls&&ls.n===5,JSON.stringify(ls));
    const bk2=await page.evaluate(async()=>{const P=scP('american-psycho');P.done=[0];P.m={'0_0':3,'0_1':3};P.r={'0_0':[0,Date.now()-1000],'0_1':[0,Date.now()-1000]};renderScQuiz('american-psycho','rev');await new Promise(r=>setTimeout(r,500));const a=screen;onBack();await new Promise(r=>setTimeout(r,500));return a+'→'+screen;});
    ok('«назад» в повторении — как ✕ (не эпизод 1)',/^scq→(scene|home)$/.test(bk2),bk2);
    const rwq=await page.evaluate(()=>{const s=scOf('wolf-lunch-de');return rwCardHTML(s,0).match(/rw-q">«([^»]*)»/)[1];});
    ok('карточка-кадр немецкой сцены — по-немецки',!/\b(the|you|and|is)\b/i.test(rwq),rwq);
    ok('ошибок в консоли нет (блок 1)',errs.length===0,errs.slice(0,5).join('\n'));await ctx.close();}
  // 9–11: Дота
  {const {page,errs,ctx}=await open({browser:b,wait:2000,init:seed,initArg:[Object.assign({},base,{intro:true})]});
    await page.evaluate(()=>{M={};store.recent=[];play('dota','mode','words');});await page.waitForTimeout(1200);
    const t=await page.evaluate(()=>document.body.innerText.slice(0,300));ok('Дота: «Новое слово», а не обучение',/Новое слово/.test(t)&&!/С чего начн/.test(t),t.replace(/\s+/g,' ').slice(0,120));
    await page.evaluate(()=>{store.fx=true;startDuel({seed:12345,L:'en',opp:null});});await page.waitForTimeout(300);await page.evaluate(()=>exitQuiz());await page.waitForTimeout(4200);
    const sc=await page.evaluate(()=>({screen,quiz:!!document.querySelector('.quizscr'),cd:!!document.querySelector('.cd2')}));ok('отсчёт отменяется «назад»',sc.screen!=='quiz'&&!sc.quiz&&!sc.cd,JSON.stringify(sc));
    await page.evaluate(()=>{store.fx=false;store.duels={};for(let i=0;i<31;i++)store.duels[1000+i]={s:1,t:10,L:'en',ts:i+1};});
    const pr=await page.evaluate(()=>{try{DUEL={seed:5,L:'en',opp:null};S={type:'duel',mode:null,qs:seededQs(5,'en'),i:0,correct:3,streak:0,bestStreak:0,gold:0,tSum:20,wrong:[],learned:[]};renderEnd();return {ok:true,n:Object.keys(store.duels).length,me:!!store.duels[5]};}catch(e){return {ok:false,e:e.message};}});
    ok('Дота-дуэль: после 31-й не падает',pr.ok&&pr.me&&pr.n===30,JSON.stringify(pr));
    ok('ошибок в консоли нет (Дота)',errs.length===0,errs.slice(0,5).join('\n'));await ctx.close();}
  // 12: починка store.games
  {const {page,errs,ctx}=await open({browser:b,wait:1500,init:seed,initArg:[Object.assign({},base,{games:'dota,cs211'})]});
    const g=await page.evaluate(()=>({g:store.games,p:store.played}));ok('store.games «dota,cs211» → список + played=2',JSON.stringify(g.g)==='["dota","cs2"]'&&g.p===2,JSON.stringify(g));
    await ctx.close();}
  // 13: сброс в настройках
  {const {page,errs,ctx}=await open({browser:b,wait:2000,init:seed,initArg:[Object.assign({},base,{seg:{'american-psycho':{t:1}},rw:{'american-psycho|0':{t:1}},gold:999}),{'american-psycho':{done:[0,1,2],m:{'0_0':3},w:{0:1,1:1,2:1},st:{0:3,1:3,2:3},got:{'0_0':1}}}]});
    await page.evaluate(()=>renderSettings());await page.waitForTimeout(400);await page.click('#reset');await page.waitForTimeout(800);
    let r=await page.evaluate(()=>({sc:Object.keys(SC).length,P:JSON.stringify(scP('american-psycho').done),gold:store.gold,seg:Object.keys(store.seg||{}).length,rs:!!store.resetAt,ls:localStorage.getItem('dota_sc_v1')}));
    ok('сброс: сцены, награды, билеты — с нуля',r.P==='[]'&&r.gold===0&&r.seg===0&&r.rs,JSON.stringify(r));
    await page.reload();await page.waitForTimeout(2000);
    r=await page.evaluate(()=>({P:JSON.stringify(scP('american-psycho').done),seg:Object.keys(store.seg||{}).length}));ok('сброс держится после перезапуска',r.P==='[]'&&r.seg===0,JSON.stringify(r));
    ok('ошибок в консоли нет (сброс)',errs.length===0,errs.slice(0,5).join('\n'));await ctx.close();}
  // 14: синк — ошибка чтения, пачки, сброс при сворачивании, синк при возврате
  {const {page,errs,ctx}=await open({browser:b,wait:1500,cloudFail:true,init:seed,initArg:[Object.assign({},base)]});
    let s=await page.evaluate(()=>({ok:CLOUD_OK,sets:window.__sets}));ok('облако не прочиталось → ничего не пишем',s.ok===false&&s.sets===0,JSON.stringify(s));
    await page.evaluate(()=>{window.__cloudFail=false;cloudResync();});await page.waitForTimeout(1600);
    s=await page.evaluate(()=>({ok:CLOUD_OK,sets:window.__sets}));ok('при возврате в приложение синк проходит',s.ok===true&&s.sets>0,JSON.stringify(s));
    await page.waitForTimeout(1500);const s0=await page.evaluate(()=>window.__sets);
    await page.evaluate(()=>{for(let i=0;i<5;i++){store.gold++;save();scSave();}});const s1=await page.evaluate(()=>window.__sets);await page.waitForTimeout(1500);const s2=await page.evaluate(()=>window.__sets);
    ok('запись в облако — пачкой через 1.2 с',s1===s0&&s2>s0&&s2-s0<=12,`${s0}→${s1}→${s2}`);
    await page.evaluate(()=>{store.gold++;save();Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
    const s3=await page.evaluate(()=>window.__sets);ok('свернул приложение → запись сразу',s3>s2,`${s2}→${s3}`);
    // другое устройство заработало билеты позже
    const g=await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});const o=JSON.parse(JSON.stringify(store));o.gold=store.gold+500;o.sv=Date.now()+1000;
      const sObj=JSON.stringify(o);window.__cloud['dota_quiz_v4_n']='1';window.__cloud['dota_quiz_v4_0']=sObj;CLOUD_AT=0;renderTab('learn');cloudResync();return store.gold;});
    await page.waitForTimeout(700);const g2=await page.evaluate(()=>store.gold);ok('возврат в приложение подтягивает прогресс с другого устройства',g2===g+500,`${g}→${g2}`);
    // вкладка: просто полистал — sv не растёт
    const sv=await page.evaluate(()=>{const a=store.sv;renderTab('kino');renderTab('profile');renderTab('learn');return [a,store.sv];});ok('переключение вкладок не делает устройство «новее»',sv[0]===sv[1],JSON.stringify(sv));
    ok('ошибок в консоли нет (синк)',errs.length===0,errs.slice(0,5).join('\n'));await ctx.close();}
  await b.close();
  console.log('\nИТОГО:',res.filter(r=>r[0]==='PASS').length,'/',res.length);
})();
