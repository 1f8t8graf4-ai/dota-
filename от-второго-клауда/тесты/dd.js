// 13.9.65: дуэль Deadlock «во весь рост». node dd.js ph|pc [light|dark]
// Кино → Игры → Deadlock → герой → диалог: окно поверх экрана, два видео-портрета на всю высоту (левый отражён, лица в кадре),
// реплика вылетает со стороны говорящего, говорящий светлее; перевод — панелью внизу; тап по экрану — дальше, тап по фразе — она снова активна;
// конец — лексика, «Ещё раз», «К диалогам»; «назад» Телеграма и ✕ закрывают; «Выборка» и «Рандом» живы; консоль чистая.
// Скрины — shots/dd-<устройство>-<тема>-N.png. Видео героев для стенда — cache/games__deadlock__*.mp4 (webm).
const {open}=require('./st');const {chromium}=require('playwright');const fs=require('fs');
const dev=process.argv[2]||'ph',scheme=process.argv[3]||'dark';
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
const init=([st])=>{if(!sessionStorage.getItem('__seeded')){sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));}};
const base={onboarded:true,introV:1,unl:1,snd:false,fx:true,wtapHint:1,lvl:'b',tourV:1,scSubChosen:1,autoSc:false,look:'nd',lookV:2};
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const vp=dev==='pc'?{width:1440,height:900}:{width:390,height:844};
  if(!fs.existsSync(__dirname+'/shots'))fs.mkdirSync(__dirname+'/shots');
  const A=await open({browser:b,uid:111,name:'Андрей',platform:dev==='pc'?'tdesktop':'ios',touch:dev!=='pc',ctx:{viewport:vp,colorScheme:scheme},wait:2200,init,initArg:[base]});
  const P=A.page;const shot=async n=>{await P.waitForTimeout(450);await P.screenshot({path:`${__dirname}/shots/dd-${dev}-${scheme}-${n}.png`});};
  const tap=async sel=>{const el=await P.$(sel);const bb=await el.boundingBox();if(dev==='pc')await P.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2);else await P.touchscreen.tap(bb.x+bb.width/2,bb.y+bb.height/2);};
  await P.evaluate(()=>renderGameScreen('deadlock'));await P.waitForTimeout(900);
  let r=await P.evaluate(()=>({heroes:[...document.querySelectorAll('#gmRoot [data-h]')].map(x=>x.dataset.h)}));
  ok('экран Deadlock: герои с живыми диалогами — Венатор и Крысиный король',r.heroes.includes('venator')&&r.heroes.includes('rat-king'),r);
  await tap('#gmRoot [data-h="venator"]');await P.waitForTimeout(500);
  r=await P.evaluate(()=>({n:document.querySelectorAll('#gmRoot [data-d]').length}));
  ok('у Венатора есть диалоги',r.n>0,r);
  // открыть первый (самый полезный) диалог
  await tap('#gmRoot [data-d="0"]');await P.waitForTimeout(1600);
  const geo=()=>P.evaluate(()=>{const w=document.getElementById('ddx');if(!w)return {open:false};
    const R=e=>{const b=e.getBoundingClientRect();return {x:Math.round(b.x),y:Math.round(b.y),w:Math.round(b.width),h:Math.round(b.height)};};
    const st=document.getElementById('ddxStage'),ps=[...w.querySelectorAll('.ddx-p')],vs=[...w.querySelectorAll('.ddx-pi video')];
    const bubs=[...w.querySelectorAll('.ddx-b')];const cur=w.querySelector('.ddx-b.sel');
    return {open:true,inBody:w.parentElement===document.body,stage:R(st),vh:innerHeight,vw:innerWidth,
      ports:ps.map(p=>({side:p.dataset.side,on:p.classList.contains('on'),r:{x:p.offsetLeft,w:p.offsetWidth,h:p.offsetHeight}})),   // без transform: говорящий намеренно чуть крупнее
      vids:vs.map(v=>({ready:v.readyState,w:v.videoWidth,paused:v.paused,op:v.style.objectPosition,tr:getComputedStyle(v).transform})),
      bubs:bubs.length,cur:cur?{side:cur.classList.contains('lf')?'lf':'rt',k:+cur.dataset.k,en:cur.querySelector('.ddx-en').textContent,r:R(cur)}:null,
      sw:document.getElementById('ddxSw').textContent,ru:document.getElementById('ddxRu').textContent,n:document.getElementById('ddxN').textContent,
      sub:R(document.getElementById('ddxSub')),tab:(()=>{const t=document.getElementById('tabbar');return t?getComputedStyle(t).display:'none';})(),
      wide:document.documentElement.scrollWidth<=innerWidth+1,line:DDX.d.lines[DDX.sel]};});
  r=await geo();
  ok('окно дуэли открыто поверх экрана (в body), вкладки спрятаны, ничего не вылезает вбок',r.open&&r.inBody&&r.tab==='none'&&r.wide,{inBody:r.inBody,tab:r.tab,wide:r.wide});
  ok('сцена дуэли — больше половины высоты экрана',r.stage.h>r.vh*.5,{stage:r.stage,vh:r.vh});
  ok('два портрета на всю высоту сцены: левый у левого края, правый у правого',r.ports.length===2&&r.ports.every(p=>p.r.h>=r.stage.h-2)&&r.ports[0].r.x===0&&r.ports[1].r.x+r.ports[1].r.w>=r.stage.w-1,r.ports);
  ok('оба портрета — видео, играют, кадр подогнан под лицо (object-position), левый отражён',r.vids.length===2&&r.vids.every(v=>v.ready>=2&&!v.paused&&/%/.test(v.op))&&/matrix\(-1/.test(r.vids[0].tr),r.vids);
  const side0=r.line.s==='Venator'?'lf':'rt';   // открыт диалог Венатора — он слева
  ok('первая реплика вылетела со стороны говорящего, он подсвечен, перевод внизу',r.bubs===1&&r.cur&&r.cur.side===side0&&r.ports.find(p=>p.side===side0).on&&r.ru===r.line.ru&&r.sw===r.line.s&&r.n==='1 / '+(await P.evaluate(()=>DDX.d.lines.length)),{cur:r.cur,sw:r.sw,ru:r.ru,n:r.n});
  ok('перевод — под сценой (панель внизу, не перекрывает портреты)',r.sub.y>=r.stage.y+r.stage.h-2&&r.sub.y+r.sub.h<=r.vh,{sub:r.sub,stage:r.stage});
  await shot(1);
  // дальше: тап по экрану (мимо пузыря)
  await P.evaluate(()=>{const s=document.getElementById('ddxStage');s.dispatchEvent(new MouseEvent('click',{bubbles:true}));});await P.waitForTimeout(600);
  r=await geo();const side1=r.line.s==='Venator'?'lf':'rt';
  ok('тап по экрану — следующая реплика с другой стороны, старая стала бледной, перевод сменился',r.bubs===2&&r.cur.k===1&&r.cur.side===side1&&side1!==side0&&r.ru===r.line.ru&&r.ports.find(p=>p.side===side1).on&&!r.ports.find(p=>p.side===side0).on,{cur:r.cur,ru:r.ru});
  await shot(2);
  // тап по старой фразе — она снова активна, её перевод внизу
  await tap('#ddxBubs .ddx-b[data-k="0"]');await P.waitForTimeout(500);
  r=await geo();
  ok('тап по старой фразе — она снова выбрана, её говорящий подсвечен и её перевод внизу, реплика не сменилась',r.cur&&r.cur.k===0&&r.ru===await P.evaluate(()=>DDX.d.lines[0].ru)&&r.ports.find(p=>p.side===side0).on&&r.n.startsWith('2 /'),{cur:r.cur,ru:r.ru,n:r.n});
  // до конца: на экране не больше 3 пузырей
  let maxB=0;for(let k=0;k<20;k++){const done=await P.evaluate(()=>!document.getElementById('ddxEnd').hidden);if(done)break;await tap('#ddxSub');await P.waitForTimeout(380);maxB=Math.max(maxB,(await geo()).bubs);}
  r=await P.evaluate(()=>({end:!document.getElementById('ddxEnd').hidden,sub:document.getElementById('ddxSub').hidden,voc:document.querySelectorAll('#ddxEnd .chip').length,vocN:(DDX.d.vocab||[]).length,again:!!document.getElementById('ddxAgain'),out:!!document.getElementById('ddxOut'),prog:document.getElementById('ddxProg').style.width}));
  ok('в конце: «Диалог пройден», лексика, «Ещё раз» и «К диалогам», прогресс 100 %, на экране не больше 3 фраз',r.end&&r.sub&&r.voc===r.vocN&&r.again&&r.out&&r.prog==='100%'&&maxB<=3,Object.assign(r,{maxB}));
  await shot(3);
  await tap('#ddxAgain');await P.waitForTimeout(700);
  r=await geo();ok('«Ещё раз» — диалог с начала',r.open&&r.bubs===1&&r.cur.k===0,{bubs:r.bubs,cur:r.cur});
  // «назад» Телеграма закрывает окно и возвращает к диалогам героя
  await P.evaluate(()=>onBack());await P.waitForTimeout(500);
  r=await P.evaluate(()=>({open:!!document.getElementById('ddx'),on:document.body.classList.contains('ddx-on'),list:document.querySelectorAll('#gmRoot [data-d]').length,scr:screen,vids:document.querySelectorAll('video').length}));
  ok('«назад» закрывает дуэль — снова список диалогов героя, видео выгружены',!r.open&&!r.on&&r.list>0&&r.scr==='show',r);
  // ✕ тоже закрывает; второй диалог — другой говорящий первым
  await tap('#gmRoot [data-d="1"]');await P.waitForTimeout(900);
  r=await geo();ok('второй диалог открывается',r.open&&r.bubs===1,{n:r.n});
  await tap('#ddxX');await P.waitForTimeout(400);
  r=await P.evaluate(()=>({open:!!document.getElementById('ddx'),list:document.querySelectorAll('#gmRoot [data-d]').length}));
  ok('✕ закрывает дуэль',!r.open&&r.list>0,r);
  // Крысиный король: тот же диалог, но он слева
  await P.evaluate(()=>{GM.hero=null;const r=document.getElementById('gmRoot');r.innerHTML=gmHTML();gmBind();});await P.waitForTimeout(300);
  await tap('#gmRoot [data-h="rat-king"]');await P.waitForTimeout(400);await tap('#gmRoot [data-d="0"]');await P.waitForTimeout(1400);
  r=await P.evaluate(()=>({lf:document.querySelector('.ddx-p.lf .ddx-nm').textContent,rt:document.querySelector('.ddx-p.rt .ddx-nm').textContent}));
  ok('у Крысиного короля он слева, Венатор справа',r.lf==='Rat King'&&r.rt==='Venator',r);
  await shot(4);
  // переход на другой экран убирает окно
  await P.evaluate(()=>renderTab('learn'));await P.waitForTimeout(500);
  r=await P.evaluate(()=>({open:!!document.getElementById('ddx'),on:document.body.classList.contains('ddx-on')}));
  ok('переход на вкладку убирает окно дуэли',!r.open&&!r.on,r);
  // «Выборка» и «Рандом» живы
  await P.evaluate(()=>renderGameScreen('deadlock'));await P.waitForTimeout(600);
  await tap('#gmRoot [data-gm="rnd"]');await P.waitForTimeout(400);
  r=await P.evaluate(()=>({bub:!!document.querySelector('#gmRoot .dd-bub')}));ok('«Рандом» показывает реплику',r.bub,r);
  await tap('#gmRoot [data-gm="pick"]');await P.waitForTimeout(400);
  await tap('#gmRoot [data-pick="venator"]');await P.waitForTimeout(300);await tap('#gmGo');await P.waitForTimeout(400);
  r=await P.evaluate(()=>({bubs:document.querySelectorAll('#gmRoot .dd-port .dd-bub').length}));ok('«Выборка» выдаёт порцию реплик',r.bubs>0,r);
  // без анимаций — окно тоже работает
  await P.evaluate(()=>{store.fx=false;document.body.classList.add('nofx');GM.mode='browse';GM.hero=gmHero('venator');const r=document.getElementById('gmRoot');r.innerHTML=gmHTML();gmBind();});await P.waitForTimeout(300);
  await tap('#gmRoot [data-d="0"]');await P.waitForTimeout(700);
  r=await geo();ok('без анимаций — окно открыто и реплика видна',r.open&&r.bubs===1,{bubs:r.bubs});
  await P.evaluate(()=>ddxClose());
  ok('консоль чистая',!A.errs.length,A.errs);
  console.log(fails?`ИТОГ: FAIL ${fails}`:'ИТОГ: всё PASS');await b.close();process.exit(fails?1:0);
})().catch(e=>{console.error(e);process.exit(2);});
