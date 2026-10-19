// 13.9.35: подсказка слова при наведении (ПК) — прячется при смене строки, внутри видео; пунктир только у выражения; значение «тут»: пусто → выражение, «—» → грамматика.  pc [1280|1920]
const {open}=require('./st');const {chromium}=require('playwright');
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify({admin:true,flags:{}}));};
const W=+(process.argv[3]||1280);
const base={onboarded:true,introV:1,gold:900,lvl:'b',fx:true,tourV:1,scSubChosen:1,autoSc:false,age18:true,snd:false,scPause:'off'};
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});
  const {page,errs}=await open({browser:b,touch:false,uid:876754050,ctx:{viewport:{width:W,height:Math.round(W*0.6)}},wait:2500,init:seed,initArg:[base]});
  const ev=(f,a)=>page.evaluate(f,a);
  await ev(()=>{const s=scOf('wolf-of-wall-street'),P=scP(s.id);P.w[0]=1;scSave();renderScEp('wolf-of-wall-street',0);});await page.waitForTimeout(2500);
  const at=async txt=>{await ev(txt=>{const L=SV._loc,x=L.find(r=>r[2].includes(txt));let t=x[0]+0.2;for(;t<x[1]+0.25;t+=0.05)if(L.find(r=>t>=r[0]+SUB_LAG&&t<=r[1]+0.25)===x)break;SV.pause();SV.currentTime=t;},txt);await page.waitForTimeout(700);await ev(()=>{try{scTick();}catch(e){}});await page.waitForTimeout(300);};
  const tipBox=()=>ev(()=>{const t=SW.querySelector('.sc-wtip.on'),V=SW.getBoundingClientRect();if(!t)return null;const r=t.getBoundingClientRect();return {txt:t.innerText,in:r.left>=V.left-1&&r.right<=V.right+1&&r.top>=V.top-1&&r.bottom<=V.bottom+1,lines:Math.round(r.height/16)};});
  // 1. наведение — подсказка внутри видео
  await at('Name of the game');
  const words=await page.locator('.sc-subs .sw').all();ok('в строке есть слова',words.length>=3,words.length);
  for(const k of [0,words.length-1]){await words[k].hover();await page.waitForTimeout(350);const t=await tipBox();ok(`подсказка у слова ${k} внутри видео`,!!t&&t.in,t);}
  await page.screenshot({path:`${__dirname}/wtip-pc${W}-1-hover.png`});
  // 2. сменилась строка — старой подсказки нет
  await at('Fuck the clients');let t=await ev(()=>{const t=SW.querySelector('.sc-wtip.on');return t?{txt:t.innerText,live:!!(t._el&&t._el.isConnected)}:null;});
  ok('строка сменилась — подсказки от старой строки нет',!t||(t.live&&!/name|game/i.test(t.txt)),t);   // мышь осталась на месте — может открыться подсказка нового слова под ней
  // мышь ушла с видео — тоже прячется
  const w2=page.locator('.sc-subs .sw').first();await w2.hover();await page.waitForTimeout(350);ok('новая подсказка появилась',!!(await tipBox()));
  await page.mouse.move(2,2);await page.waitForTimeout(300);ok('мышь ушла с видео — подсказки нет',!(await tipBox()));
  // 3. пунктир: «Wenn du wirklich in ernster Gefahr bist» — «выражение» = вся фраза, важные слова по одному → под строкой пунктира нет
  const ul=await ev(()=>{const s=scOf('bb-knocks-de'),f=s.parts[0].ph[0],keep=SCUR;SCUR={id:s.id,i:0};const row=s.subs.find(r=>/ernster Gefahr/.test(r[4]||r[2]))||[0,0,f.de];
    const h=swWrapPh(row[4]||row[2],f);SCUR=keep;const d=document.createElement('div');d.innerHTML=h;return {all:d.querySelectorAll('.sw').length,ph:[...d.querySelectorAll('.sw.in-ph')].map(x=>x.textContent)};});
  ok('«Wenn du wirklich…» — пунктира нет',ul.ph.length===0&&ul.all>=5,ul);
  // а у настоящего выражения («Fuck + кто-то») — только слова выражения
  const ul2=await ev(()=>[...document.querySelectorAll('.sc-subs .sw.in-ph')].map(x=>x.textContent));
  ok('«Fuck the clients» — пунктир только у выражения',ul2.length>=1&&ul2.length<=2,ul2);
  // 4. значение «тут»: пустое → выражение, «—» → грамматика
  const cx=await ev(async()=>{await cxLoad('de');const s=scOf('bb-knocks-de'),S=s.subs;const row=t=>S.find(r=>phNorm(cxOrig(s,r))===phNorm(t));
    const r1=row('Walt, ich hab es dir schon mal gesagt.'),r2=row('Wenn du wirklich in ernster Gefahr bist, dann gehen wir zur Polizei.');
    const m=w=>{const h=cxHit(s.id,{row:r1},w);return cxMain(h);},n=w=>cxMain(cxHit(s.id,{row:r2},w));
    return {mal:m('mal'),hab:m('hab'),schon:m('schon'),bist:n('bist'),gefahr:n('gefahr'),ok:!!r1&&!!r2};});
  ok('реплики найдены',cx.ok,cx);
  ok('«mal» (пусто) → значение выражения «schon mal»',cx.mal&&cx.mal.k==='x'&&/уже/.test(cx.mal.t)&&/schon mal/.test(cx.mal.l),cx.mal);
  ok('«hab» («—») → объяснение из g',cx.hab&&cx.hab.k==='dash'&&/gesagt/.test(cx.hab.t),cx.hab);
  ok('«bist» («—») → объяснение из g',cx.bist&&cx.bist.k==='dash'&&/sein/.test(cx.bist.t),cx.bist);
  ok('«schon» — значение тут',cx.schon&&cx.schon.k==='here'&&cx.schon.t==='уже',cx.schon);
  ok('«gefahr» — значение тут',cx.gefahr&&cx.gefahr.t==='опасности',cx.gefahr);
  // 5. окошко по клику — главное значение без скобок и списков
  await at('Name of the game');await page.locator('.sc-subs .sw').last().click();await page.waitForTimeout(600);
  const pop=await ev(()=>{const p=document.querySelector('.sc-wpop');if(!p)return null;const V=SW.getBoundingClientRect(),r=p.getBoundingClientRect();return {t:(p.querySelector('.t')||{}).textContent||'',in:r.bottom<=V.bottom+1&&r.top>=V.top-1};});
  ok('окошко по клику внутри видео',!!pop&&pop.in,pop);
  await page.screenshot({path:`${__dirname}/wtip-pc${W}-2-pop.png`});
  ok('консоль чистая',!errs.length,errs.slice(0,5).join(' | '));
  console.log(fails?`ИТОГ: ${fails} FAIL`:'ИТОГ: всё PASS');await b.close();})();
