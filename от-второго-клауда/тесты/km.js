// 13.9.2+: «Мои фразы и слова» — шапка, варианты (Лента, Разговорник, …), фразы и слова, тренировка, поиск; ph|pc
const {open}=require('./st');const {chromium}=require('playwright');
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify({admin:true,flags:{}}));};
const dev=process.argv[2]||'ph',only=(process.argv[3]||'feed,book').split(',');
const base={onboarded:true,introV:1,gold:900,lvl:'b',fx:true,tourV:1,scSubChosen:1,autoSc:false,age18:true,dictVar:'kino',dlDemo:false,snd:false};
const shot=(p,n)=>p.screenshot({path:`${__dirname}/km-${dev}-${n}.png`});
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const [vp,touch]=dev==='ph'?[{width:390,height:844},true]:[{width:1440,height:900},false];
  const {page,errs}=await open({browser:b,touch,uid:876754050,ctx:{viewport:vp},wait:2500,init:seed,initArg:[base]});
  const ev=(f,a)=>page.evaluate(f,a);const click=async s=>{const l=page.locator(s).first();await l.scrollIntoViewIfNeeded();await l.click();};
  await ev(()=>{const now=Date.now();let n=0;
    for(const [id,pi,k] of [['wolf-of-wall-street',0,6],['american-psycho',0,4],['clavicular-impaulsive',0,3],['taxi-driver-lonely',1,2]]){const s=scOf(id),P=scP(id);P.got=P.got||{};P.w[pi]=1;
      scAct(s.parts[pi].ph).slice(0,k).forEach(f=>{n++;P.got[f.id]=now-n*6e4;P.m[f.id]=n%5===0?3:1;P.r[f.id]=n%4===0?[1,now-1000]:[1,now+864e5*2];});}
    scSave();store.myw={};const add=(k,w,ru,sid,pi,a,st,due,tags)=>{const s=scOf(sid),r=s&&s.subs.find(z=>Math.abs(z[0]-a)<0.06);store.myw[k]={k,w,ru,de:'',sid,pi,line:r?r[2]:'',lineRu:r?r[3]:'',a,at:now-st*1000,lvl:0,st,due,tags:tags||[]};};
    add('wolf-of-wall-street|clients','clients','клиенты','wolf-of-wall-street',0,21,1,now-1000,['работа']);add('wolf-of-wall-street|function','function','работать','wolf-of-wall-street',0,4.96,0,now+864e5*3);
    add('american-psycho|tan','tan','загар','american-psycho',0,20.34,2,now+864e5,['внешность']);add('american-psycho|occasionally','occasionally','иногда','american-psycho',0,36.82,0,now-5000);
    store.myw['own|deadline']={k:'own|deadline',w:'deadline',ru:'срок сдачи',de:'',sid:'own',pi:0,line:'',lineRu:'',a:0,at:now-9e4,lvl:0,st:1,due:now+864e5*2,own:true,tags:['работа']};save();});
  await ev(()=>{DX.seg='my';store.knMyKind='ph';store.knMyV='feed';renderTab('dict');});await page.waitForFunction(()=>window.DL&&document.querySelector('#dlStage'),null,{timeout:15000});await page.waitForTimeout(1500);
  let r=await ev(()=>({lvl:$('#dlStage').dataset.lvl,sw:[...document.querySelectorAll('.km-sw button')].map(b=>b.textContent.replace(/\s+/g,' ').trim()),vp:(document.querySelector('[data-mvp]')||{}).textContent,sw2:document.documentElement.scrollWidth,iw:innerWidth}));
  ok('шапка: «Фразы | Слова», пилюля варианта, без лишнего',r.lvl==='my'&&r.sw.length===2&&/Лента/.test(r.vp)&&r.sw2<=r.iw,r);
  // шторка вариантов
  await click('[data-mvp]');await page.waitForTimeout(600);r=await ev(()=>[...document.querySelectorAll('.km-vl [data-vv]')].map(b=>b.dataset.vv));ok('шторка вариантов',r.length>=2,r);await shot(page,'0-sheet');
  await ev(()=>{const w=document.querySelector('.kn-sheet');w&&w._close&&w._close();});await page.waitForTimeout(400);
  if(only.includes('feed')){
    await page.waitForTimeout(1200);await shot(page,'1-feed');
    r=await ev(()=>{const fd=document.querySelector('.kmf'),v=document.querySelector('.kmf-vid'),s0=document.querySelector('.kmf-s');return {ch:document.querySelectorAll('.kmf-ch button').length,sl:document.querySelectorAll('.kmf-s[data-i]').length,tr:document.querySelectorAll('.kmf-tr').length,h:fd&&fd.clientHeight,vin:!!(v&&s0.contains(v)),muted:v&&v.muted,t:v&&+v.currentTime.toFixed(2),pageScroll:document.body.scrollHeight-innerHeight};});
    ok('Лента: чипы, слайды, «Проверь себя», видео в первом слайде без звука',r.ch>3&&r.sl>5&&r.tr>=1&&r.vin&&r.muted===true&&r.h>300,r);
    await page.waitForTimeout(1500);r=await ev(()=>({on:document.querySelectorAll('.kmf-s.cur .kmf-sub span.on').length,t:+document.querySelector('.kmf-vid').currentTime.toFixed(2)}));ok('момент играет, слова загораются',r.t>0.2,r);
    // листнуть вниз
    await ev(()=>{const fd=document.querySelector('.kmf');fd.scrollTo({top:fd.clientHeight,behavior:'instant'});});await page.waitForTimeout(1500);
    r=await ev(()=>{const cur=document.querySelector('.kmf-s.cur'),v=document.querySelector('.kmf-vid');return {i:cur&&cur.dataset.i,vin:!!(v&&cur&&cur.contains(v)),bg:cur&&cur.style.getPropertyValue('--fbg').slice(0,20)};});ok('листнул — второй слайд играет',r.i==='1'&&r.vin&&!!r.bg,r);
    await shot(page,'2-feed-next');
    // звук по тапу
    await ev(()=>{document.querySelector('.kmf-s.cur .kmf-v').click();});await page.waitForTimeout(500);r=await ev(()=>({m:document.querySelector('.kmf-vid').muted,snd:document.querySelector('.kmf').classList.contains('snd')}));ok('тап по видео — звук',r.m===false&&r.snd,r);
    // «Подробнее» → окно; закрыл — лента снова играет
    await ev(()=>document.querySelector('.kmf-s.cur [data-fo]').click());await page.waitForTimeout(1500);r=await ev(()=>!!document.querySelector('.kno2'));ok('«Подробнее» — окно фразы',r);await page.keyboard.press('Escape');await page.waitForTimeout(1500);
    r=await ev(()=>{const v=document.querySelector('.kmf-vid');return {p:v&&!v.paused,in:!!(v&&document.querySelector('.kmf-s.cur').contains(v))};});ok('закрыл окно — лента играет дальше',r.p&&r.in,r);
    // чип-тег
    await ev(()=>{const b=[...document.querySelectorAll('.kmf-ch button')].find(x=>!x.classList.contains('on')&&x.dataset.ft.startsWith('t:'));b.click();});await page.waitForTimeout(1200);
    r=await ev(()=>({on:(document.querySelector('.kmf-ch .on')||{}).textContent,sl:document.querySelectorAll('.kmf-s[data-i]').length}));ok('чип темы — лента по теме',r.sl>0&&!/^Все/.test(r.on),r);
    // «Проверь себя»
    await ev(()=>{const fd=document.querySelector('.kmf'),t=fd.querySelector('.kmf-tr');fd.scrollTo({top:t.offsetTop,behavior:'instant'});});await page.waitForTimeout(900);
    await ev(()=>document.querySelector('.kmf-s.cur [data-ftr]').click());await page.waitForTimeout(1200);r=await ev(()=>({q:!!document.querySelector('.dl-q'),meta:(document.querySelector('.sc-meta')||{}).textContent}));ok('«Тренировать» из ленты',r.q,r);
    await click('#dlx');await page.waitForTimeout(1500);r=await ev(()=>({lvl:($('#dlStage')||{dataset:{}}).dataset.lvl,v:!!document.querySelector('.kmf')}));ok('назад из тренировки — в ленту',r.lvl==='my'&&r.v,r);
    // слова в ленте
    await click('[data-mk="w"]');await page.waitForTimeout(1500);r=await ev(()=>({w:(document.querySelector('.kmf-s.cur .kmf-w')||{}).textContent,hw:[...document.querySelectorAll('.kmf-s.cur .kn2-hw')].map(x=>x.textContent),fab:!!document.querySelector('.km-fab')}));
    ok('слова в ленте: слово, подсветка в реплике, кнопка «＋»',!!r.w&&r.fab,r);await shot(page,'3-feed-words');
    await click('[data-mk="ph"]');await page.waitForTimeout(900);}
  if(only.includes('book')){
    await ev(()=>{store.knMyV='book';DL.render(0);});await page.waitForTimeout(1300);await shot(page,'4-book');
    r=await ev(()=>({due:!!document.querySelector('.kmb-due'),ch:[...document.querySelectorAll('.kmb-h .kmb-ht b')].map(x=>x.textContent),rows:document.querySelectorAll('.kmb .kq').length,rail:document.querySelectorAll('.kmb-rail button').length,ph:document.querySelectorAll('.kq').length}));
    ok('Разговорник: «Повторить сегодня», главы, указатель',r.due&&r.ch.length>=2&&r.rows>5&&r.rail===r.ch.length,r);
    const last=r.ch.length-1;await ev(i=>document.querySelectorAll(innerWidth>=900?'.kmb-toc [data-bj]':'.kmb-rail [data-bj]')[i].click(),last);await page.waitForTimeout(1200);
    r=await ev(i=>{const h=document.querySelector('#kmbc-'+i).getBoundingClientRect();return {top:Math.round(h.top),y:Math.round(scrollY)};},last);ok('указатель → глава у верха',r.top<160&&r.y>50,r);await shot(page,'5-book-jump');
    await ev(()=>scrollTo(0,0));await page.waitForTimeout(400);
    await click('.kmb .kq:not(.lock)');await page.waitForTimeout(1500);r=await ev(()=>!!document.querySelector('.kno2'));ok('фраза → окно',r);await page.keyboard.press('Escape');await page.waitForTimeout(700);
    await click('[data-btr]');await page.waitForTimeout(1200);r=await ev(()=>!!document.querySelector('.dl-q'));ok('«Тренировать» главу',r);await click('#dlx');await page.waitForTimeout(1500);
    await click('[data-mk="w"]');await page.waitForTimeout(1200);r=await ev(()=>({ch:[...document.querySelectorAll('.kmb-h .kmb-ht b')].map(x=>x.textContent),rows:document.querySelectorAll('.kqw').length}));ok('слова по алфавиту',r.ch.join()===[...r.ch].sort().join()&&r.rows===5,r);await shot(page,'6-book-words');
    await click('.kqw');await page.waitForTimeout(1300);r=await ev(()=>(document.querySelector('.kn2-word')||{}).textContent);ok('слово → окно',!!r,r);await page.keyboard.press('Escape');await page.waitForTimeout(600);
    await click('[data-mk="ph"]');await page.waitForTimeout(800);}
  // поиск
  await click('[data-msr]');await page.waitForTimeout(700);await page.fill('#kmQ','client');await page.waitForTimeout(800);
  r=await ev(()=>document.querySelectorAll('#kmBody .kq').length);ok('поиск',r>0,String(r));await ev(()=>DL.back());await page.waitForTimeout(700);r=await ev(()=>!document.querySelector('#kmQ'));ok('«назад» закрывает поиск',r);
  // уход со словаря глушит видео
  await ev(()=>{store.knMyV='feed';DL.render(0);});await page.waitForTimeout(1500);await ev(()=>renderTab('learn'));await page.waitForTimeout(800);
  r=await ev(()=>[...document.querySelectorAll('video')].filter(v=>!v.paused).length);ok('ушёл со словаря — видео не играет',r===0,String(r));
  // без анимаций
  await ev(()=>{store.fx=false;DX.seg='my';store.knMyV='book';renderTab('dict');});await page.waitForTimeout(1200);r=await ev(()=>!!document.querySelector('.kmb'));ok('без анимаций рисуется',r);
  ok('консоль чистая',!errs.length,errs.slice(0,5).join(' | '));
  console.log(fails?`ИТОГ: ${fails} FAIL`:'ИТОГ: всё PASS');await b.close();})();
