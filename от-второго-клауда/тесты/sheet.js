// 13.9.11 — шторка (13.9.15: по умолчанию; store.knWin='full' — на весь экран); на телефоне «Смотреть» — окошко с моментом над шторкой (×).
// 13.9.9 — окно фразы не на весь экран: телефон — шторка снизу по высоте содержимого (словарь сверху под затемнением),
// тап мимо / свайп вниз / «назад» закрывают, маленький свайп — шторка возвращается, вбок — листание; ПК — карточка по центру.
// Запуск: NODE_PATH=/opt/node-tools/node_modules node sheet.js ph|pc   (сайт на 8080; медиа — ./cache)
const {open}=require('./st');const {chromium}=require('playwright');
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify({admin:true,flags:{}}));};
const dev=process.argv[2]||'ph';
const base={onboarded:true,introV:1,gold:900,lvl:'b',fx:true,tourV:1,scSubChosen:1,autoSc:false,age18:true,dictVar:'kino',dlDemo:false,snd:false,knWin:'sheet'};
const shot=(p,n)=>p.screenshot({path:`${__dirname}/sheet-${dev}-${n}.png`});
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const [vp,touch]=dev==='ph'?[{width:390,height:844},true]:[{width:1440,height:900},false];
  const {page,errs}=await open({browser:b,touch,uid:876754050,ctx:{viewport:vp},wait:2500,init:seed,initArg:[base]});
  const ev=(f,a)=>page.evaluate(f,a);const click=async s=>{const l=page.locator(s).first();await l.scrollIntoViewIfNeeded();await l.click();};
  await ev(()=>{const now=Date.now();let n=0;
    for(const [id,pi,k] of [['wolf-of-wall-street',0,6],['wolf-swiss-bank',0,3],['american-psycho',0,4]]){const s=scOf(id),P=scP(id);P.got=P.got||{};P.w[pi]=1;
      scAct(s.parts[pi].ph).slice(0,k).forEach(f=>{n++;P.got[f.id]=now-n*6e4;P.m[f.id]=1;P.r[f.id]=[1,now+864e5];});}scSave();save();});
  await ev(()=>{DX.seg='my';store.knMyKind='ph';store.knMyV='cards';store.knMyBy='film';renderTab('dict');});await page.waitForFunction(()=>window.DL&&document.querySelector('#dlStage'),null,{timeout:15000});await page.waitForTimeout(1500);
  const openRow=async()=>{if(!await ev(()=>!!document.querySelector('.km6-c[open]')))await click('.km6-c summary');await page.waitForTimeout(500);await click('.km6-c[open] .kq[data-c] .kq-ru');await page.waitForTimeout(1200);};
  const geo=()=>ev(()=>{const o=document.querySelector('.kno2'),k=o&&o.querySelector('.kn2'),r=k&&k.getBoundingClientRect(),x=o&&o.querySelector('.kn2-x').getBoundingClientRect(),bg=o&&o.querySelector('.kn2 .kn2-bg');
    const dim=o&&o.querySelector('.kno-dim').getBoundingClientRect();
    return o?{sheet:o.classList.contains('kn2s'),top:Math.round(r.top),bot:Math.round(r.bottom),h:Math.round(r.height),w:Math.round(r.width),cx:Math.round(r.left+r.width/2),cy:Math.round(r.top+r.height/2),
      xIn:x.top>=r.top&&x.bottom<=r.bottom&&x.right<=r.right+1,bgIn:!!bg,dim:[Math.round(dim.width),Math.round(dim.height)],vh:innerHeight,vw:innerWidth,pg:(o.querySelector('.kn2-pg')||{}).textContent||''}:null;});
  // жест пальцем: TouchEvent'ы на шторку (Chromium с hasTouch)
  const swipe=(dx,dy)=>ev(([dx,dy])=>new Promise(res=>{const el=document.querySelector('.kno2 .kn2'),r=el.getBoundingClientRect(),x0=r.left+r.width/2,y0=r.top+60,tg=el.querySelector('.kn2-b')||el;
    const T=(x,y)=>new Touch({identifier:7,target:tg,clientX:x,clientY:y});const fire=(type,t,list)=>tg.dispatchEvent(new TouchEvent(type,{touches:list?[t]:[],targetTouches:list?[t]:[],changedTouches:[t],bubbles:true,cancelable:true}));
    fire('touchstart',T(x0,y0),1);let i=0;const st=()=>{i++;fire('touchmove',T(x0+dx*i/6,y0+dy*i/6),1);if(i<6)setTimeout(st,16);else{fire('touchend',T(x0+dx,y0+dy),0);res();}};setTimeout(st,16);}),[dx,dy]);
  await openRow();let g=await geo();
  if(dev==='ph'){
    ok('телефон: окно — шторка, низ у края экрана, высота по содержимому (< 70 % экрана), сверху виден словарь',g&&g.sheet&&Math.abs(g.bot-g.vh)<=1&&g.h<g.vh*.7&&g.top>g.vh*.3,g);
    ok('кадр фильма — фон самой шторки, × внутри шторки, затемнение — на весь экран',g.bgIn&&g.xIn&&g.dim[0]===g.vw&&g.dim[1]===g.vh,g);
    await shot(page,'1-open');
    await ev(()=>document.querySelector('.kno2 [data-v="watch"]').click());await page.waitForTimeout(1600);let g2=await geo();
    const pp=await ev(()=>{const p=document.querySelector('.kno2 .kn2-pip.on'),r=p&&p.getBoundingClientRect(),k=document.querySelector('.kno2 .kn2').getBoundingClientRect(),v=p&&p.querySelector('video');
      return p?{top:Math.round(r.top),bot:Math.round(r.bottom),w:Math.round(r.width),sheetTop:Math.round(k.top),vid:!!v,play:!!v&&!v.paused,inSheet:!!document.querySelector('.kno2 .kn2 video')}:null;});
    ok('«Смотреть» — окошко с моментом над шторкой, видео в окошке и играет, шторка внизу и не наезжает на окошко',pp&&pp.vid&&!pp.inSheet&&pp.bot<=pp.sheetTop+2&&Math.abs(g2.bot-g2.vh)<=1,{pp,g2});
    await shot(page,'2-watch');
    await swipe(-140,4);await page.waitForTimeout(900);const pq=await ev(()=>!!document.querySelector('.kno2 .kn2-pip.on video'));ok('листание — окошко осталось, в нём следующий момент',pq);
    await ev(()=>document.querySelector('.kno2 .kn2-pipx').click());await page.waitForTimeout(500);
    const px=await ev(()=>({on:!!document.querySelector('.kno2 .kn2-pip.on'),open:!!document.querySelector('.kno2')}));ok('× у окошка — окошко убрано, шторка осталась',!px.on&&px.open,px);
    await swipe(140,4);await page.waitForTimeout(900);
    await swipe(-140,4);await page.waitForTimeout(900);let g3=await geo();ok('свайп вбок — следующая фраза',/^2 \//.test(g3.pg),g3.pg);
    await swipe(0,60);await page.waitForTimeout(700);g3=await geo();ok('маленький свайп вниз — шторка вернулась',g3&&Math.abs(g3.bot-g3.vh)<=1,g3);
    await swipe(0,190);await page.waitForTimeout(800);ok('свайп вниз — закрылась',!(await geo()));
    await openRow();await page.mouse.click(195,60);await page.waitForTimeout(700);ok('тап мимо шторки (по затемнению) — закрылась',!(await geo()));
    await openRow();await ev(()=>DL.back());await page.waitForTimeout(700);ok('«назад» — закрылась',!(await geo()));
  }else{
    ok('ПК: карточка по центру, не на весь экран',g&&Math.abs(g.cx-g.vw/2)<=2&&Math.abs(g.cy-g.vh/2)<=40&&g.w<=562&&g.h<g.vh*.86,g);
    ok('ПК: кадр фильма — фон карточки, × внутри',g.bgIn&&g.xIn,g);
    await shot(page,'1-open');
    await ev(()=>document.querySelector('.kno2 [data-v="watch"]').click());await page.waitForTimeout(1600);const g2=await geo();
    ok('ПК: «Смотреть» — карточка выросла и осталась по центру',g2.h>g.h+120&&Math.abs(g2.cy-g2.vh/2)<=40&&g2.h<=g2.vh*.87,{h0:g.h,h1:g2.h,cy:g2.cy});
    await shot(page,'2-watch');
    await page.keyboard.press('Escape');await page.waitForTimeout(700);ok('ПК: Esc — закрылась',!(await geo()));
  }
  // 13.9.15: по умолчанию (настройки нет) — полэкрана; «На весь экран» — store.knWin='full', как в 13.9.8
  const kind=()=>ev(()=>{const o=document.querySelector('.kno2');return o?{sheet:o.classList.contains('kn2s'),pip:!!o.querySelector('.kn2-pip')}:null;});
  await ev(()=>{delete store.knWin;});await openRow();const gd=await kind();
  ok('без настройки — шторка (полэкрана)',gd&&gd.sheet,gd);await ev(()=>document.querySelector('.kno2 .kn2-x').click());await page.waitForTimeout(500);
  await ev(()=>{store.knWin='full';});await openRow();const gf=await kind();
  ok('«На весь экран» — не шторка',gf&&!gf.sheet&&!gf.pip,gf);await ev(()=>document.querySelector('.kno2 .kn2-x').click());await page.waitForTimeout(500);await ev(()=>{store.knWin='sheet';});
  // «▶ подряд» в шторке (телефон): момент сразу в окошке сверху и играет сам
  if(dev==='ph'){await click('.km6-c [data-mpl]');await page.waitForTimeout(2200);
    const ga=await ev(()=>{const o=document.querySelector('.kno2'),p=o&&o.querySelector('.kn2-pip'),v=p&&p.querySelector('video');return o?{auto:o.classList.contains('auto'),sheet:o.classList.contains('kn2s'),pip:!!p&&p.classList.contains('on'),play:!!v&&!v.paused}:null;});
    ok('«▶ подряд» в шторке — момент в окошке сверху и играет сам',ga&&ga.auto&&ga.sheet&&ga.pip&&ga.play,ga);await ev(()=>document.querySelector('.kno2 .kn2-x').click());await page.waitForTimeout(500);}
  // без анимаций — открывается и закрывается так же
  await ev(()=>{store.fx=false;applyFx&&applyFx();});await openRow();g=await geo();ok('без анимаций — окно на месте',g&&(dev!=='ph'||Math.abs(g.bot-g.vh)<=1),g);
  await ev(()=>document.querySelector('.kno2 .kn2-x').click());await page.waitForTimeout(500);ok('× — закрылась',!(await geo()));
  ok('консоль без ошибок',!errs.length,errs.slice(0,3));
  console.log(fails?`ИТОГ: FAIL ${fails}`:'ИТОГ: всё PASS');await b.close();process.exit(fails?1:0);})().catch(e=>{console.error(e);process.exit(1);});
