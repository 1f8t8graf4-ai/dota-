// 13.9.4: слово в субтитрах эпизода — без дубля «выражение = вся фраза»; настоящее выражение — как раньше; ph|pc
const {open}=require('./st');const {chromium}=require('playwright');
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify({admin:true,flags:{}}));};
const dev=process.argv[2]||'ph';
const base={onboarded:true,introV:1,gold:900,lvl:'b',fx:true,tourV:1,scSubChosen:1,autoSc:false,age18:true,dictVar:'kino',dlDemo:false,snd:false,scPause:'off'};
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const [vp,touch]=dev==='ph'?[{width:390,height:844},true]:[{width:1440,height:900},false];
  const {page,errs}=await open({browser:b,touch,uid:876754050,ctx:{viewport:vp},wait:2500,init:seed,initArg:[base]});
  const ev=(f,a)=>page.evaluate(f,a);
  await ev(()=>{const s=scOf('wolf-of-wall-street'),P=scP(s.id);P.w[0]=1;scSave();renderScEp('wolf-of-wall-street',0);});await page.waitForTimeout(2500);
  // время, когда на экране именно эта строка субтитров (строки перекрываются — берём первую подходящую, как scTick)
  const at=async txt=>{await ev(txt=>{const L=SV._loc,x=L.find(r=>r[2].includes(txt));let t=x[0]+0.2;for(;t<x[1]+0.25;t+=0.05)if(L.find(r=>t>=r[0]+SUB_LAG&&t<=r[1]+0.25)===x)break;SV.pause();SV.currentTime=t;},txt);await page.waitForTimeout(700);await ev(()=>{try{scTick();}catch(e){}});await page.waitForTimeout(300);};
  const pop=async word=>{const l=page.locator('.sc-subs .sw.in-ph',{hasText:word}).first();if(dev==='ph')await l.tap();else await l.click();await page.waitForTimeout(700);
    return ev(()=>{const p0=document.querySelector('.kw-pop.on')||document.querySelector('.sc-wpop');if(!p0)return null;const p=p0.cloneNode(true);p.classList.add('mo');p.querySelectorAll('.kwp-wi').forEach(x=>x.remove());document.body.appendChild(p);const s=p.innerText.replace(/\s+/g,' ').slice(0,900);p.remove();return s;});};   // 13.9.13: «подробнее о слове» (.kwp-wi) — не считаем
  // «Name of the game.» — «выражение» почти вся фраза (The name of the game)
  await at('Name of the game');let r=await ev(()=>[...document.querySelectorAll('.sc-subs .sw.in-ph')].map(x=>x.textContent));ok('строка «Name of the game» — слова подчёркнуты',r.length>=3,r);
  let t=await pop('game');ok('«game»: без «часть выражения», фраза один раз',!!t&&!/часть выражения/i.test(t)&&(t.match(/Name of the game/gi)||[]).length<=1&&/(Во фразе|Вся реплика)/i.test(t),t);
  await page.screenshot({path:`${__dirname}/sub-${dev}-1-whole.png`});
  await ev(()=>{try{kwHide(0);}catch(e){}const w=document.querySelector('.sc-wpop');w&&w.remove();});await page.waitForTimeout(300);
  // «Fuck the clients.» — настоящее выражение «Fuck + кто-то» — блок остаётся
  await at('Fuck the clients');t=await pop('Fuck');ok('«Fuck»: «часть выражения» есть (настоящее выражение)',!!t&&/часть выражения/i.test(t),t);
  await page.screenshot({path:`${__dirname}/sub-${dev}-2-part.png`});
  ok('консоль чистая',!errs.length,errs.slice(0,5).join(' | '));
  console.log(fails?`ИТОГ: ${fails} FAIL`:'ИТОГ: всё PASS');await b.close();})();
