// 13.9.31: «lvTag is not defined» — dictlab.js грузится лениво и бывает новее app.js, который Telegram держит в памяти.
// Подсовываем app.js без lvTag (как 13.9.28; premNeed/premAsk/MYW_FREE в dictlab.js — тоже через typeof) — словарь должен открыться без «Ошибки варианта». ph|pc
const {open}=require('./st');const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const dev=process.argv[2]||'pc';
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify({admin:true,flags:{}}));};
const base={onboarded:true,introV:1,gold:900,lvl:'b',fx:true,tourV:1,scSubChosen:1,autoSc:false,snd:false,knWin:'full',look:'nd',lookV:2};
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
(async()=>{const b=await chromium.launch();const vp=dev==='ph'?{width:390,height:844}:{width:1440,height:900};
  const old=fs.readFileSync(path.join(__dirname,'../../js/app.js'),'utf8').replace('const lvTag=','const lvTag_gone=');
  ok('старый app.js собран (без lvTag)',!/const lvTag=/.test(old));
  const {page,ctx,errs}=await open({browser:b,touch:dev==='ph',uid:876754050,ctx:{viewport:vp},wait:2500,init:seed,initArg:[base]});
  await ctx.route(/127\.0\.0\.1:8080\/js\/app\.js/,r=>r.fulfill({status:200,contentType:'application/javascript',body:old}));
  await page.reload();await page.waitForTimeout(2500);
  ok('lvTag в странице нет',await page.evaluate(()=>typeof lvTag==='undefined'));
  await page.evaluate(()=>SCENES.forEach(s=>{try{admPass(s);}catch(e){}}));await page.waitForTimeout(400);
  await page.evaluate(()=>renderTab('dict'));await page.waitForTimeout(2500);
  const t1=await page.evaluate(()=>(document.querySelector('#dlRoot')||{}).innerText||'');
  ok('словарь открылся, нет «Ошибки варианта»',t1.length>40&&!/Ошибка варианта/.test(t1),t1.slice(0,80));
  await page.evaluate(()=>DL.open({sid:'wolf-of-wall-street'}));await page.waitForTimeout(1500);
  await page.evaluate(()=>{const d=document.querySelector('#dlRoot details.kn-ep');if(d)d.open=true;});await page.waitForTimeout(500);
  const t2=await page.evaluate(()=>({err:/Ошибка варианта/.test((document.querySelector('#dlRoot')||{}).innerText||''),rows:document.querySelectorAll('#dlRoot .kq2').length}));
  ok('сцена: строки фраз есть, без ошибки',!t2.err&&t2.rows>0,t2);
  const e=errs.filter(x=>!/favicon|Failed to load/.test(x));ok('консоль чистая',e.length===0,e.slice(0,3));
  await b.close();console.log(fails?`FAILS: ${fails}`:'ALL PASS');process.exit(fails?1:0);})();
