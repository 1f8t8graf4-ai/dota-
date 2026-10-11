// 13.9.1: Кинотека на весь экран — заголовок раздела → окно, листание, живой момент только у текущего, выход всеми способами; ph|pc
// 13.9.4: «‹» на странице фильма и сцены — настоящим кликом
const {open}=require('./st');const {chromium}=require('playwright');
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify({admin:true,flags:{}}));};
const bb=()=>{window.__bb=[];const W=window.Telegram&&Telegram.WebApp;if(W)W.BackButton={show(){window.__bb.push(1);},hide(){window.__bb.push(0);},onClick(){},offClick(){}};};
const dev=process.argv[2]||'ph';
const base={onboarded:true,introV:1,gold:900,lvl:'b',fx:true,tourV:1,scSubChosen:1,autoSc:false,age18:true,dictVar:'kino',dlDemo:false,snd:false};
const shot=(p,n)=>p.screenshot({path:`${__dirname}/kf-${dev}-${n}.png`});
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const [vp,touch]=dev==='ph'?[{width:390,height:844},true]:[{width:1440,height:900},false];
  const {page,ctx,errs}=await open({browser:b,touch,uid:876754050,ctx:{viewport:vp},wait:2500,init:seed,initArg:[base]});await ctx.addInitScript(bb);await page.reload();await page.waitForTimeout(2500);
  const ev=(f,a)=>page.evaluate(f,a);
  await ev(()=>{const now=Date.now();let n=0;for(const [id,pi,k] of [['wolf-of-wall-street',0,5],['american-psycho',0,4],['clavicular-impaulsive',0,3]]){const s=scOf(id),P=scP(id);P.got=P.got||{};P.w[pi]=1;scAct(s.parts[pi].ph).slice(0,k).forEach(f=>{n++;P.got[f.id]=now-n*6e4;P.m[f.id]=1;P.r[f.id]=[1,now+864e5];});}scSave();});
  await ev(()=>{DX.seg='ph';renderTab('dict');});await page.waitForFunction(()=>window.DL&&document.querySelector('#dlStage'),null,{timeout:15000});await page.waitForTimeout(1500);
  let r=await ev(()=>[...document.querySelectorAll('[data-kfs]')].map(b=>b.dataset.kfs+':'+b.textContent.trim()));ok('заголовки разделов — кнопки',r.length>=2,r);
  await shot(page,'1-home');
  await ev(()=>{window.__bb=[];});await page.click('[data-kfs="film"]');await page.waitForTimeout(1600);
  r=await ev(()=>({ov:!!document.querySelector('.kno.knf'),n:(document.querySelector('.knf-num')||{}).textContent,sl:document.querySelectorAll('.knf-s').length,films:DL.films().filter(x=>x.kind==='film').length,bb:window.__bb.slice(-1)[0],tab:getComputedStyle(document.querySelector('#tabbar')).opacity}));
  ok('окно раздела открылось, «1 / N», кнопка «назад» показана, таббар спрятан',r.ov&&r.n==='1 / '+r.films&&r.sl===r.films&&r.bb===1&&r.tab==='0',r);
  await page.waitForTimeout(900);
  r=await ev(()=>[...document.querySelectorAll('.knf-s')].map(s=>s.querySelectorAll('video').length));ok('живой момент — только у первого слайда',r[0]===1&&r.slice(1).every(x=>!x),r);
  await shot(page,'2-full');
  // листнуть
  if(dev==='ph')await ev(()=>{const pg=document.querySelector('.knf-pg');pg.scrollTo({left:pg.clientWidth,behavior:'instant'});});else await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(1700);
  r=await ev(()=>({n:document.querySelector('.knf-num').textContent,v:[...document.querySelectorAll('.knf-s')].map(s=>s.querySelectorAll('video').length),dot:[...document.querySelectorAll('.knf-dots button')].findIndex(d=>d.classList.contains('on'))}));
  ok('второй фильм: «2 / N», видео переехало, точка',r.n.startsWith('2 /')&&r.v[1]===1&&!r.v[0]&&r.dot===1,r);
  await shot(page,'3-next');
  // точка → последний
  await ev(()=>{const d=[...document.querySelectorAll('.knf-dots button')];d[d.length-1].click();});await page.waitForTimeout(1500);
  r=await ev(()=>document.querySelector('.knf-num').textContent);ok('точка → последний фильм',/^(\d+) \/ \1$/.test(r),r);
  // «Открыть» → страница фильма
  const name=await ev(()=>{const i=+document.querySelector('.knf-num').textContent.split(' / ')[0]-1;return DL.films().filter(x=>x.kind==='film')[i].k;});
  await ev(()=>{const i=+document.querySelector('.knf-num').textContent.split(' / ')[0]-1;document.querySelectorAll('.knf-s')[i].querySelector('[data-fo]').click();});await page.waitForTimeout(1600);
  r=await ev(()=>({ov:!!document.querySelector('.knf'),lvl:document.querySelector('#dlStage').dataset.lvl,show:DL.S.show,bb:window.__bb.slice(-1)[0]}));ok('«Открыть» → страница фильма, окно закрыто',!r.ov&&r.lvl==='film'&&r.show===name&&r.bb===1,r);
  await shot(page,'4-film');
  // 13.9.4: выход «‹» настоящим кликом (раньше тест жал DL.back() напрямую): сцена → фильм → главная
  await page.locator('#dlStage .kf-sr[data-sid]').first().click();await page.waitForTimeout(1300);
  r=await ev(()=>({lvl:document.querySelector('#dlStage').dataset.lvl,bb:window.__bb.slice(-1)[0]}));ok('сцена открылась',r.lvl==='scene'&&r.bb===1,r);
  await page.click('#dlStage .dl-crumb [data-up]');await page.waitForTimeout(1300);
  r=await ev(()=>document.querySelector('#dlStage').dataset.lvl);ok('«‹» в сцене → фильм',r==='film',r);
  await page.click('#dlStage .dl-crumb [data-up]');await page.waitForTimeout(1300);
  r=await ev(()=>({lvl:document.querySelector('#dlStage').dataset.lvl,bb:window.__bb.slice(-1)[0]}));ok('«‹» в фильме → главная, «назад» Телеграма спрятана',r.lvl==='home'&&r.bb===0,r);
  // выход: ✕
  await page.click('[data-kfs="film"]');await page.waitForTimeout(1000);await page.click('.knf-x');await page.waitForTimeout(700);
  r=await ev(()=>({ov:!!document.querySelector('.knf'),bb:window.__bb.slice(-1)[0],lvl:document.querySelector('#dlStage').dataset.lvl}));ok('✕ закрывает, кнопка «назад» снова спрятана (главная)',!r.ov&&r.bb===0&&r.lvl==='home',r);
  // выход: «назад» (системная / Телеграм)
  await page.click('[data-kfs="film"]');await page.waitForTimeout(900);await ev(()=>onBack());await page.waitForTimeout(700);
  r=await ev(()=>({ov:!!document.querySelector('.knf'),lvl:document.querySelector('#dlStage').dataset.lvl}));ok('«назад» закрывает окно, словарь на месте',!r.ov&&r.lvl==='home',r);
  // выход: Esc (ПК) / свайп вниз (телефон)
  await page.click('[data-kfs="film"]');await page.waitForTimeout(900);
  if(dev==='ph')await ev(()=>{const o=document.querySelector('.knf'),mk=(t,y)=>new TouchEvent(t,{bubbles:true,touches:t==='touchend'?[]:[new Touch({identifier:1,target:o,clientX:200,clientY:y})],changedTouches:[new Touch({identifier:1,target:o,clientX:200,clientY:y})]});o.dispatchEvent(mk('touchstart',200));o.dispatchEvent(mk('touchmove',300));o.dispatchEvent(mk('touchend',380));});
  else await page.keyboard.press('Escape');
  await page.waitForTimeout(700);r=await ev(()=>!!document.querySelector('.knf'));ok(dev==='ph'?'свайп вниз закрывает':'Esc закрывает',!r);
  // интервью — без 4K, обложка размыта
  const hasIv=await ev(()=>!!document.querySelector('[data-kfs="interview"]'));
  if(hasIv){await page.click('[data-kfs="interview"]');await page.waitForTimeout(1500);r=await ev(()=>({bd:document.querySelectorAll('.knf-s.bd').length,n:document.querySelector('.knf-num').textContent}));ok('интервью — фон из обложки',r.bd===0,r);await shot(page,'5-interview');await page.click('.knf-x');await page.waitForTimeout(600);}
  // «Смотреть» → страница сцены
  await page.click('[data-kfs="film"]');await page.waitForTimeout(900);await page.click('.knf-s [data-fw]');await page.waitForTimeout(1500);
  r=await ev(()=>({ov:!!document.querySelector('.knf'),screen}));ok('«Смотреть» → сцена',!r.ov&&r.screen==='scene',r);
  // без анимаций
  await ev(()=>{store.fx=false;DX.seg='ph';renderTab('dict');});await page.waitForTimeout(1200);await page.click('[data-kfs="film"]');await page.waitForTimeout(700);
  r=await ev(()=>!!document.querySelector('.knf-s'));ok('без анимаций открывается',r);await page.click('.knf-x');await page.waitForTimeout(300);
  ok('консоль чистая',!errs.length,errs.slice(0,5).join(' | '));
  console.log(fails?`ИТОГ: ${fails} FAIL`:'ИТОГ: всё PASS');await b.close();})();
