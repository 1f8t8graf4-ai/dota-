// Видео для Андрея: путь по «Новому» (Сегодня → Кино → Сцена → эпизод с караоке и словом → разбор с пылью → задание → итог → Профиль → тест уровня).
// node demo.js [dark|light] → shots/demo-<тема>.webm (390×844, x2). Касания видны кружком.
const {open}=require('./st');const {chromium}=require('playwright');const path=require('path'),fs=require('fs');
const TH=process.argv[2]||'dark',D=path.join(__dirname,'shots','vid');fs.mkdirSync(D,{recursive:true});
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify({admin:true,flags:{}}));};
const dot=()=>{addEventListener('DOMContentLoaded',()=>{const d=document.createElement('i');d.style.cssText='position:fixed;z-index:2147483647;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;background:rgba(255,255,255,.35);border:2px solid rgba(255,255,255,.85);pointer-events:none;opacity:0;transition:opacity .25s,transform .25s;left:-50px;top:-50px';document.documentElement.appendChild(d);
  const mv=e=>{d.style.left=e.clientX+'px';d.style.top=e.clientY+'px';};addEventListener('pointermove',mv,true);addEventListener('pointerdown',e=>{mv(e);d.style.opacity=1;d.style.transform='scale(.8)';},true);addEventListener('pointerup',()=>{d.style.opacity=0;d.style.transform='scale(1)';},true);});};
const base={onboarded:true,introV:1,look:'nd',lookV:2,unl:1,snd:false,lvl:'b',cefr:'B1',goalWhy:'work',goal:20,tourV:1,scSubChosen:1,autoSc:false,wtapHint:1,scPause:'off',fx:true,gold:900,streak:3,lastDay:new Date().toDateString(),scLast:{id:'wolf-of-wall-street',i:1}};
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});
  const {page:P,ctx}=await open({browser:b,touch:true,uid:876754050,name:'Андрей',ndDefault:true,ctx:{viewport:{width:390,height:844},deviceScaleFactor:2,colorScheme:TH,recordVideo:{dir:D,size:{width:780,height:1688}}},wait:2600,init:seed,initArg:[base]});
  await P.addInitScript(dot);await P.evaluate(dot);await P.evaluate(()=>document.dispatchEvent(new Event('DOMContentLoaded')));
  const w=ms=>P.waitForTimeout(ms),ev=(f,a)=>P.evaluate(f,a);
  const tap=async sel=>{const l=P.locator(sel).first();try{await l.hover({timeout:3000});await w(220);await l.click({timeout:3000});}catch(e){console.log('нет',sel);}};
  const scroll=async(dy,steps=20)=>{for(let i=0;i<steps;i++){await P.mouse.wheel(0,dy/steps);await w(25);}};
  await ev(()=>{const P=scP('wolf-of-wall-street');P.done=[0];P.st={0:3};P.w[0]=1;scSave();renderTab('learn');});await w(2600);
  // «Потяни»: ручку вправо — не до конца, чтобы показать отскок
  const k=await P.locator('#ndPull .ndpull-k').boundingBox({timeout:3000}).catch(()=>null);if(k){await P.mouse.move(k.x+k.width/2,k.y+k.height/2,{steps:8});await P.mouse.down();await P.mouse.move(k.x+120,k.y+k.height/2,{steps:20});await w(250);await P.mouse.up();await w(900);}
  await tap('.tabbar button[data-nav="kino"]');await w(2200);
  await tap('.n-pg .n-po');await w(2600);await scroll(380);await w(1200);await scroll(-380);await w(500);
  await ev(()=>renderScEp('wolf-of-wall-street',0));await w(1500);
  await ev(async()=>{SV.muted=true;await SV.play().catch(()=>{});SV.currentTime=10.2;});await w(4200);
  await ev(()=>SV.pause());await tap('.sc-subs .sline:not(.s2) .sw >> nth=2');await w(2600);
  await ev(()=>{try{wpClose();}catch(e){}});await w(400);
  await ev(()=>{const s=scOf('wolf-of-wall-street');renderScEp(s.id,0);});await w(1400);await ev(()=>document.querySelector('.rv2 .rv-head').scrollIntoView({block:'start'}));await w(1800);
  await tap('.rv2 .rv-c .n-sp');await w(1300);await tap('.rv2 .rv-c:nth-of-type(2) .n-sp:not(.open)');await w(1500);await P.keyboard.press('Escape');await ev(()=>{try{wpClose();}catch(e){}document.querySelectorAll('.kw-pop.on .kwp-x').forEach(x=>x.click());});await w(400);
  await tap('#epGoQ');await w(1600);
  // отвечаем верно: варианты — по тексту фраз эпизода, кубики — по порядку слов фразы / выражения
  const solve=()=>P.evaluate(()=>{const ok=x=>x&&x.offsetParent!==null,N=t=>String(t||'').toLowerCase().replace(/[^a-zа-яёäöüß' ]/gi,'').replace(/\s+/g,' ').trim();
    const s=scOf('wolf-of-wall-street'),F=scAct(s.parts[0].ph);const good=new Set();F.forEach(f=>{good.add(N(scT(f)));good.add(N(f.ru));if(f.gap)good.add(N(f.gap));});
    const O=[...document.querySelectorAll('.sc-opt')].filter(ok);if(O.length){const i=O.findIndex(o=>good.has(N(o.textContent)));return {t:'opt',i:Math.max(0,i)};}
    const T=[...document.querySelectorAll('#scbpool .sc-tile')].filter(x=>ok(x)&&!x.classList.contains('used'));if(T.length){
      const L=[];F.forEach(f=>{L.push(scToks(scT(f)));try{const E=scExpr(f,scT(f));if(E)L.push(scToks(E.x));}catch(e){}});
      const tw=T.map(x=>N(x.textContent));for(const toks of L){const need=toks.map(N);const used=new Set(),ks=[];let all=true;
        for(const w of need){const j=tw.findIndex((x,k)=>x===w&&!used.has(k));if(j<0){all=false;break;}used.add(j);ks.push(T[j].dataset.k);}
        if(all&&ks.length)return {t:'tile',ks};}return {t:'tile',ks:[]};}
    if(ok(document.querySelector('#scnx')))return {t:'nx'};return {t:''};});
  for(let i=0;i<16;i++){if(await ev(()=>!!document.querySelector('.n-done')))break;const st=await solve();
    if(st.t==='opt')await tap(`.sc-opt:visible >> nth=${st.i}`);
    else if(st.t==='tile'){for(const k of st.ks){await tap(`#scbpool .sc-tile[data-k="${k}"]`);await w(200);}await tap('#scbchk');}
    await w(1100);if(await ev(()=>{const n=document.querySelector('#scnx');return !!(n&&n.offsetParent!==null);}))await tap('#scnx');await w(700);}
  await w(3200);
  await ev(()=>renderTab('profile'));await w(2200);await scroll(420);await w(1500);await scroll(-420);await w(500);
  await ev(()=>{ONB=null;renderOnb(1);});await w(1500);await tap('#onbGo');await w(1200);
  for(const id of ['#onbYes','#onbNo','#onbYes','#onbYes']){await tap(id);await w(1100);}
  await w(800);
  const v=P.video();await ctx.close();const src=await v.path();const out=path.join(__dirname,'shots','demo-'+TH+'.webm');fs.renameSync(src,out);console.log(out);await b.close();})();
