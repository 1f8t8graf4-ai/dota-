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
const GO={6:async page=>{await page.evaluate(()=>renderTab('learn'));},
  7:async page=>{await page.evaluate(()=>{store.kinoCat='film';store.kinoLang='en';renderTab('kino');});},
  8:async page=>{await page.evaluate(()=>{store.admPlayer=true;const P=scP('wolf-of-wall-street');P.done=[0];P.st=P.st||{};P.st[0]=3;scSave();renderScene('wolf-of-wall-street');});},
  9:async page=>{await page.evaluate(()=>{store.scPause='off';renderScEp('wolf-of-wall-street',0);});await page.waitForTimeout(1500);
    await page.evaluate(async()=>{SV.muted=true;await SV.play().catch(()=>{});SV.currentTime=22.6;});await page.waitForTimeout(1500);await page.evaluate(()=>SV.pause());
    const w=page.locator('.sc-subs .sline:not(.s2) .sw').nth(1);if(await w.count())await w.click();},
  10:async page=>{await page.evaluate(()=>{const P=scP('wolf-of-wall-street');P.w[1]=1;scSave();renderScQuiz('wolf-of-wall-street',1);});await page.waitForTimeout(900);
    await page.evaluate(()=>{const t=[...document.querySelectorAll('#scbpool .sc-tile')].slice(0,2);t.forEach(x=>x.click());});},
  11:async page=>{await page.evaluate(()=>{const P=scP('wolf-of-wall-street');P.w[0]=1;scSave();renderScQuiz('wolf-of-wall-street',0);});await page.waitForTimeout(900);
    for(let k=0;k<30;k++){if(await page.evaluate(()=>!!document.querySelector('.n-done')))break;
      await page.evaluate(()=>{const ok=x=>x&&x.offsetParent!==null;const opt=[...document.querySelectorAll('.sc-opt')].find(ok);if(opt){opt.click();return;}const no=document.querySelector('#scLno');if(ok(no)){no.click();return;}
        const T=[...document.querySelectorAll('#scbpool .sc-tile')].filter(x=>ok(x)&&!x.disabled&&!x.classList.contains('used'));T.forEach(x=>x.click());const c=document.querySelector('#scbchk');if(ok(c))c.click();});
      await page.waitForTimeout(350);await page.evaluate(()=>{const n=document.querySelector('#scnx');if(n&&n.offsetParent!==null)n.click();});await page.waitForTimeout(400);}
    await page.waitForTimeout(1500);},
  12:async page=>{await page.evaluate(()=>{const s=scOf('wolf-of-wall-street'),P=scP(s.id);P.r=P.r||{};scAct(s.parts[0].ph).forEach(f=>{P.got=P.got||{};P.got[f.id]=Date.now()-864e5;P.m[f.id]=1;P.r[f.id]=[1,Date.now()-1];});scSave();renderDaily();});},
  14:async page=>{await page.evaluate(()=>renderTab('profile'));},
  15:async page=>{await page.evaluate(()=>renderPaywall('rev'));},
  1:async page=>{await page.evaluate(()=>{ONB=null;renderOnb(0);});},
  2:async page=>{await page.evaluate(()=>{ONB=null;renderOnb(1);});},
  3:async page=>{await page.evaluate(()=>{ONB=null;renderOnb(2);});},
  4:async page=>{await page.evaluate(()=>{ONB=null;renderOnb(3);});},
  5:async page=>{await page.evaluate(()=>{ONB=null;renderOnb(4);});}};
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
