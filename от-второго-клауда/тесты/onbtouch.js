// 13.9.38 (Андрей с iPhone: «свайпать нельзя»): тест уровня и «Потяни» — настоящими касаниями (CDP Input.dispatchTouchEvent)
// демо-карточка на вступлении смахивается и начинает тест; карточки — длинный, короткий быстрый и кривой (с уходом вниз) смах;
// медленный короткий — отскакивает; Telegram не закрывает свайпом вниз во время теста и снова закрывает после; «Потяни» тянется пальцем.
const {open}=require('./st');const {chromium}=require('playwright');
const init=([st])=>{if(!sessionStorage.getItem('__seeded')){sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify({admin:true,flags:{}}));}
  window.__vs=[];const W=window.Telegram&&Telegram.WebApp;if(W){W.disableVerticalSwipes=()=>__vs.push('off');W.enableVerticalSwipes=()=>__vs.push('on');}
  window.__bb=[];if(W&&W.BackButton){W.BackButton.show=()=>__bb.push('show');W.BackButton.hide=()=>__bb.push('hide');}};
const base={onboarded:true,introV:1,gold:900,lvl:'b',fx:true,tourV:1,scSubChosen:1,snd:false,look:'nd',lookV:2,unl:1};
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
(async()=>{const b=await chromium.launch();
  const {page,errs,ctx}=await open({browser:b,touch:true,uid:876754050,ndDefault:true,ctx:{viewport:{width:390,height:844},colorScheme:'dark'},wait:2500,init,initArg:[base]});
  const ev=(f,a)=>page.evaluate(f,a),cdp=await ctx.newCDPSession(page);
  const swipe=async(x0,y0,x1,y1,steps,dt)=>{await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x0,y:y0}]});
    for(let i=1;i<=steps;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x0+(x1-x0)*i/steps,y:y0+(y1-y0)*i/steps}]});if(dt)await page.waitForTimeout(dt);}
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});};
  const mid=async sel=>{const r=await page.locator(sel).boundingBox();return [r.x+r.width/2,r.y+r.height/2];};
  await ev(()=>{ONB=null;renderOnb(1);});await page.waitForTimeout(900);
  let r=await ev(()=>({ph:ONB&&ONB.lt&&ONB.lt.ph,vs:__vs.slice(-1)[0],ta:getComputedStyle(document.querySelector('.onb-dc.c')).touchAction}));
  ok('вступление: Telegram не закрывается свайпом вниз, демо-карточка без прокрутки (touch-action none)',r.ph==='intro'&&r.vs==='off'&&r.ta==='none',r);
  await page.screenshot({path:`${__dirname}/shots/onbtouch-1-intro.png`});
  let [x,y]=await mid('.onb-dc.c');await swipe(x,y,x+160,y+10,8,16);await page.waitForTimeout(700);
  r=await ev(()=>({ph:ONB.lt.ph,card:!!document.querySelector('#onbCard')}));ok('смах демо-карточки вправо — начался тест',r.ph==='w'&&r.card,r);
  const I=()=>ev(()=>ONB.lt.i);
  r=await ev(()=>({bb:__bb.slice(-1)[0],dbg:(document.querySelector('#onbDbg')||{}).textContent||''}));
  ok('13.9.40: на карточках «‹ Назад» Telegram спрятана, у админа строка отладки касаний',r.bb==='hide'&&/касаний \d+/.test(r.dbg),r);
  [x,y]=await mid('#onbCard');await swipe(x,y,x+170,y,10,12);await page.waitForTimeout(700);ok('длинный смах вправо — следующая карточка',await I()===1,await I());
  [x,y]=await mid('#onbCard');await swipe(x,y,x-60,y,2,0);await page.waitForTimeout(700);ok('короткий быстрый смах влево (60 px) — засчитан',await I()===2,await I());
  [x,y]=await mid('#onbCard');await swipe(x,y,x+120,y+70,9,14);await page.waitForTimeout(700);ok('кривой смах с уходом вниз (как большим пальцем) — засчитан',await I()===3,await I());
  r=await ev(()=>({dbg:document.querySelector('#onbDbg').textContent,td:ONB_TD}));ok('13.9.40: касания идут через touch-события (движения считаются, отмен нет)',r.td.s>=4&&r.td.m>=20&&r.td.c===0,r);
  [x,y]=await mid('#onbCard');await swipe(x,y,x+35,y,7,60);await page.waitForTimeout(800);
  r=await ev(()=>({i:ONB.lt.i,tr:document.querySelector('#onbCard').style.transform}));ok('медленный короткий — карточка вернулась, не засчитан',r.i===3&&(!r.tr||r.tr==='none'),r);
  await page.screenshot({path:`${__dirname}/shots/onbtouch-2-card.png`});
  await ev(()=>onbQuit());await page.waitForTimeout(900);
  r=await ev(()=>({vs:__vs.slice(-1)[0],scr:document.body.dataset.scr||screen}));ok('ушёл из теста — Telegram снова закрывается свайпом',r.vs==='on',r);
  // «Потяни, чтобы начать» пальцем
  await ev(()=>{window.__ep=null;const o=renderScEp;renderScEp=function(id,i){window.__ep=[id,i];return o.apply(this,arguments);};renderTab('learn');});await page.waitForTimeout(1500);
  const kb=await page.locator('#ndPull .ndpull-k').boundingBox(),pb=await page.locator('#ndPull').boundingBox();
  await ev(()=>{__vs.length=0;});await swipe(kb.x+kb.width/2,kb.y+kb.height/2,pb.x+pb.width-12,kb.y+kb.height/2+8,12,14);await page.waitForTimeout(900);
  r=await ev(()=>__vs.slice(-3));ok('13.9.40: во время «Потяни» Telegram не закрывается свайпом, потом — снова',r.includes('off')&&r[r.length-1]==='on',r);
  ok('«Потяни» пальцем до конца — эпизод',!!(await ev(()=>window.__ep)),await ev(()=>window.__ep));
  ok('консоль чистая',!errs.length,errs.slice(0,5).join(' | '));
  console.log(fails?`ИТОГ: ${fails} FAIL`:'ИТОГ: всё PASS');await b.close();})();
