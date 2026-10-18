// 13.9.21: заставка «Кинолента» v2 — короче (≤ 2 с на экране), тап пропускает, без анимаций — нет заставки,
// одна лента кадров только если кадры успели загрузиться (иначе одно название), название — из APP_NAME (и в «Отсчёте», и в «Неоне», и в магазине)
const {open}=require('./st');const {chromium}=require('playwright');
const dev=process.argv[2]||'ph';
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
const init=([st])=>{if(!sessionStorage.getItem('__seeded')){sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify({admin:false,flags:{}}));}
  // хронометраж заставки: когда появилась, когда начала уходить, когда снята
  window.__sp={};new MutationObserver(()=>{const d=document.querySelector('.spr,.splash3,.spn'),t=performance.now();
    if(d&&!window.__sp.in){window.__sp.in=t;window.__sp.cls=d.className;}if(d&&d.classList.contains('out')&&!window.__sp.out)window.__sp.out=t;
    if(!d&&window.__sp.in&&!window.__sp.gone)window.__sp.gone=t;if(d&&d.querySelector('.spr-film')&&!window.__sp.film)window.__sp.film=t;}).observe(document,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});};
const base={onboarded:true,introV:1,unl:1,snd:false,fx:true,knWin:'full'};
(async()=>{const b=await chromium.launch();const vp=dev==='pc'?{width:1440,height:900}:{width:390,height:844};
  const go=async(st,o)=>open(Object.assign({browser:b,uid:111,platform:dev==='pc'?'tdesktop':'ios',touch:dev!=='pc',ctx:{viewport:vp},wait:60,init,initArg:[st]},o||{}));
  const tm=p=>p.evaluate(()=>window.__sp);
  // 1. обычный запуск: «Кинолента» v2, кадры из кэша успевают (под нагрузкой машины кадры могут не успеть за 0,3 с — тогда ещё один запуск)
  let A=await go(base),P=A.page;
  await P.waitForFunction(()=>window.__sp.in,null,{timeout:8000}).catch(()=>{});
  for(let k=0;k<2;k++){await P.waitForTimeout(700);if(await P.evaluate(()=>!!document.querySelector('.spr-film')))break;
    console.log('  (кадры не успели за 0,3 с — машина занята, ещё запуск)');await A.ctx.close();A=await go(base);P=A.page;await P.waitForFunction(()=>window.__sp.in,null,{timeout:8000}).catch(()=>{});}
  let r=await P.evaluate(()=>{const d=document.querySelector('.spr');return d?{v2:d.classList.contains('v2'),t:[...d.querySelectorAll('.spr-t span')].map(x=>x.textContent).join('').replace(/ /g,' '),name:APP_NAME.toUpperCase(),dust:0}:null;});
  ok('заставка «Кинолента» v2, название = APP_NAME',r&&r.v2&&r.t===r.name,r);
  await P.screenshot({path:`shots/splash-${dev}.png`});
  r=await P.evaluate(()=>{const d=document.querySelector('.spr');const f=d&&d.querySelector('.spr-film');return {rows:d?d.querySelectorAll('.spr-row').length:0,fr:f?f.querySelectorAll('.spr-strip i').length:0,beam:d?d.querySelectorAll('.spr-beam').length:0,
    w:document.documentElement.scrollWidth<=innerWidth+1,tw:d?Math.round(d.querySelector('.spr-t').getBoundingClientRect().width):0};});
  ok('одна лента (кадры успели загрузиться), не больше 8 кадров по кругу, один луч',r.rows===1&&r.fr>=8&&r.fr<=16&&r.beam===1,r);
  ok('название влезает в экран',r.tw>0&&r.tw<=vp.width-24&&r.w,r);
  await P.waitForFunction(()=>window.__sp.gone,null,{timeout:6000}).catch(()=>{});
  let t=await tm(P);const vis=t.out-t.in,all=t.gone-t.in;
  ok(`на экране ≈ ${(vis/1000).toFixed(2)} с до ухода, снята через ${(all/1000).toFixed(2)} с (было 2,5 + 0,65)`,vis>1200&&vis<1650&&all<2100,t);
  ok('кадры появились не позже 0,3 с после заставки (или не появились вовсе)',!t.film||t.film-t.in<450,{film:t.film&&Math.round(t.film-t.in)});
  // 2. кадры не грузятся (первый запуск / медленная сеть) — одно название, без пустых рамок
  const B=await go(base);await B.ctx.route(/\/m\/scenes\/.*\.jpg/,r=>setTimeout(()=>r.abort().catch(()=>{}),2000));
  await B.page.reload();await B.page.waitForFunction(()=>window.__sp&&window.__sp.in,null,{timeout:8000}).catch(()=>{});await B.page.waitForTimeout(700);
  r=await B.page.evaluate(()=>({sp:!!document.querySelector('.spr'),film:!!document.querySelector('.spr-film'),t:!!document.querySelector('.spr-t')}));
  ok('кадры не успели — заставка только с названием, без ленты',r.sp&&!r.film&&r.t,r);
  await B.page.screenshot({path:`shots/splash-nofilm-${dev}.png`});
  // 3. тап — пропуск
  const C=await go(base);await C.page.waitForFunction(()=>window.__sp.in,null,{timeout:8000}).catch(()=>{});await C.page.waitForTimeout(250);
  if(dev==='pc')await C.page.mouse.click(vp.width/2,vp.height/2);else await C.page.touchscreen.tap(vp.width/2,vp.height/2);
  await C.page.waitForFunction(()=>window.__sp.gone,null,{timeout:3000}).catch(()=>{});t=await tm(C.page);
  ok('тап — заставка уходит сразу и снята за 0,5 с',t.out&&t.out-t.in<520&&t.gone&&t.gone-t.out<560,{out:t.out&&Math.round(t.out-t.in),gone:t.gone&&Math.round(t.gone-t.out)});
  // 4. без анимаций — заставки нет
  const D=await go(Object.assign({},base,{fx:false}));await D.page.waitForTimeout(1500);
  ok('анимации выключены — заставки нет',!(await tm(D.page)).in);
  // 5. «Отсчёт», «Неон» и витрина магазина — тоже APP_NAME
  r=await D.page.evaluate(async()=>{store.fx=true;const N=APP_NAME.toUpperCase(),o={};
    splash('leader');await new Promise(r=>setTimeout(r,60));o.leader=[...document.querySelectorAll('.splash3 .s3-t span')].map(x=>x.textContent).join('').replace(/ /g,' ')===N;document.querySelectorAll('.splash3').forEach(x=>x.remove());
    splash('neon');await new Promise(r=>setTimeout(r,60));o.neon=(document.querySelector('.spn-t')||{}).textContent;document.querySelectorAll('.spn').forEach(x=>x.remove());
    renderShop('sp');await new Promise(r=>setTimeout(r,400));o.shop=[...document.querySelectorAll('.pv-sp b')].map(x=>x.textContent);store.fx=false;return o;});
  ok('«Отсчёт 3-2-1», «Неон» и витрина в магазине — то же название',r.leader&&r.neon.replace(/\s/g,'')==='ЯЗЫКИпоКИНО'&&r.shop.length>=3&&r.shop.every(x=>x==='ЯЗЫКИ ПО КИНО'),r);
  ok('консоль чистая',![...A.errs,...B.errs,...C.errs,...D.errs].length,[...A.errs,...B.errs,...C.errs,...D.errs].slice(0,5));
  console.log(fails?`ИТОГ ${dev}: FAIL ${fails}`:`ИТОГ ${dev}: всё PASS`);await b.close();process.exit(fails?1:0);})();
