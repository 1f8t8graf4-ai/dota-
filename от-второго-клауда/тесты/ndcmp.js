// P2 (ТЗ-13.9.32): приёмка «бок о бок с макетом». node ndcmp.js <N> [light|dark] [ph|pc] → shots/cmp-N-<тема>[-pc].png
// слева — экран N из дизайн/макеты-13.9.24.html (.cell N .ph), справа — приложение в «Новом» на 390×844 (или ПК 1440×900 — только приложение)
const {open}=require('./st');const {chromium}=require('playwright');const path=require('path'),fs=require('fs');
const N=+(process.argv[2]||6),TH=process.argv[3]||'light',DEV=process.argv[4]||'ph';
const MK='file://'+path.resolve(__dirname,'../../дизайн/макеты-13.9.24.html');
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify({admin:true,flags:{}}));};
// игрок как в макете: уровень B1, цель — работа, серия 3, в сцене «Волк» досмотрен первый эпизод
const base={onboarded:true,introV:1,gold:900,lvl:'b',cefr:'B1',goalWhy:'work',goal:20,fx:true,tourV:1,scSubChosen:1,snd:false,look:'nd',lookV:2,
  scLast:{id:'wolf-of-wall-street',i:1},streak:3,lastDay:new Date().toDateString()};
// как открыть экран N в приложении
const GO={6:async page=>{await page.evaluate(()=>renderTab('learn'));}};
fs.mkdirSync(path.join(__dirname,'shots'),{recursive:true});
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});
  const pc=DEV==='pc',vp=pc?{width:1440,height:900}:{width:390,height:844};
  // макет
  const mc=await b.newContext({viewport:{width:1400,height:1000},deviceScaleFactor:2,colorScheme:TH});const mp=await mc.newPage();
  await mp.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.continue()).catch(()=>{});
  await mp.goto(MK);await mp.evaluate(t=>{document.documentElement.dataset.theme=t;},TH);await mp.waitForTimeout(2600);
  const cell=mp.locator('.cell').nth(N-1).locator('.ph');await cell.scrollIntoViewIfNeeded();await mp.waitForTimeout(400);
  const mk=await cell.screenshot();await mc.close();
  // приложение
  const {page,errs,ctx}=await open({browser:b,touch:!pc,uid:876754050,name:'Андрей',ndDefault:true,ctx:{viewport:vp,deviceScaleFactor:2,colorScheme:TH},wait:2500,init:seed,initArg:[base]});
  await (GO[N]||(async()=>{}))(page);await page.waitForTimeout(2200);
  const ap=await page.screenshot();
  if(pc){fs.writeFileSync(path.join(__dirname,`shots/cmp-${N}-${TH}-pc.png`),ap);}
  else{const cp=await b.newPage({viewport:{width:900,height:900},deviceScaleFactor:1});
    await cp.setContent(`<body style="margin:0;background:${TH==='dark'?'#060607':'#E8E7E1'};display:flex;gap:24px;padding:24px;align-items:flex-start;font:600 14px system-ui;color:${TH==='dark'?'#aaa':'#555'}">
      <figure style="margin:0"><img src="data:image/png;base64,${mk.toString('base64')}" style="height:844px;display:block"><figcaption>макет · экран ${N}</figcaption></figure>
      <figure style="margin:0"><img src="data:image/png;base64,${ap.toString('base64')}" style="height:844px;display:block;border-radius:28px"><figcaption>приложение 390×844</figcaption></figure></body>`);
    await cp.waitForTimeout(300);await cp.screenshot({path:path.join(__dirname,`shots/cmp-${N}-${TH}.png`),fullPage:true});}
  console.log('ok',N,TH,DEV,errs.length?'ОШИБКИ: '+errs.slice(0,3).join(' | '):'консоль чистая');await b.close();})();
