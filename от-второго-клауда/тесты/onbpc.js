// 13.9.33 (P0.1): первый запуск «Нового» на ПК с включённым 3D-фоном (store.bg3d=true) — как у Андрея: «как мне смахнуть на пк?», тёмный зал под светлой темой.
// Окна 1280×720, 1440×900, 1920×1080; тема Telegram светлая и тёмная. На каждом шаге: #bg3d не виден, у body нет has3d, контраст заголовка ≥ 4.5
// (цвет текста против пикселя под ним на скрине), кнопки шага — в окне без прокрутки. Тест уровня: текст для ПК, ← → двигают, Enter — «Начать тест»/«Дальше»,
// перетаскивание мышью на 150 px вправо = «знаю», курсор grab. Скрины — shots/onbpc-<тема>-<ширина>-<шаг>.png
const {open}=require('./st');const {chromium}=require('playwright');const fs=require('fs');
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
const init=([st,fl])=>{if(!sessionStorage.getItem('__seeded')){sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify(fl));}};
const base={onboarded:true,introV:1,unl:1,snd:false,fx:true,wtapHint:1,lvl:'b',tourV:1,scSubChosen:1,autoSc:false,look:'nd',lookV:2,bg3d:true};
const VPS=[[1280,720],[1440,900],[1920,1080]];
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
  if(!fs.existsSync(__dirname+'/shots'))fs.mkdirSync(__dirname+'/shots');
  // контраст: снимок области заголовка без текста (color: transparent) → цвет фона под ним; цвет текста — computed
  const contrast=async(P,sel)=>{if(!await P.locator(sel).count())return null;const box=await P.locator(sel).first().boundingBox({timeout:2000}).catch(()=>null);if(!box)return null;
    const col=await P.evaluate(s=>{const e=document.querySelector(s);const c=getComputedStyle(e).color;e.dataset.c0=e.style.color;e.style.setProperty('color','transparent','important');e.querySelectorAll('*').forEach(x=>x.style.setProperty('color','transparent','important'));return c;},sel);
    const png=await P.screenshot({clip:{x:box.x,y:box.y,width:Math.max(4,Math.min(box.width,600)),height:Math.max(4,box.height)}});
    const bg=await P.evaluate(async b64=>{const im=new Image();im.src='data:image/png;base64,'+b64;await im.decode();const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const g=c.getContext('2d');g.drawImage(im,0,0);
      const d=g.getImageData(0,0,c.width,c.height).data;let r=0,gg=0,bb=0,n=0;for(let i=0;i<d.length;i+=16){r+=d[i];gg+=d[i+1];bb+=d[i+2];n++;}return [r/n,gg/n,bb/n];},png.toString('base64'));
    await P.evaluate(s=>{const e=document.querySelector(s);e.style.removeProperty('color');e.querySelectorAll('*').forEach(x=>x.style.removeProperty('color'));},sel);
    const fg=col.match(/[\d.]+/g).slice(0,3).map(Number);
    const L=c=>{const f=v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);};return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2]);};
    const a=L(fg),z=L(bg);return Math.round(((Math.max(a,z)+.05)/(Math.min(a,z)+.05))*100)/100;};
  const state=P=>P.evaluate(()=>{const c=document.getElementById('bg3d'),r=c&&c.getBoundingClientRect();const vis=!!c&&getComputedStyle(c).display!=='none'&&getComputedStyle(c).visibility!=='hidden'&&r.width>0;
    const btns=[...document.querySelectorAll('.onb button')].filter(x=>x.offsetParent&&!x.closest('.onb-top'));
    const out=btns.filter(x=>{const q=x.getBoundingClientRect();return q.bottom>innerHeight+1||q.top<0||q.right>innerWidth+1;}).map(x=>x.textContent.trim().slice(0,20));
    return {bg3d:vis,has3d:document.body.classList.contains('has3d'),bgOn:!!(window.BG3D&&BG3D.on),out,scroll:Math.max(document.documentElement.scrollHeight,document.body.scrollHeight)-innerHeight,st:ONB&&ONB.st,ph:ONB&&ONB.lt&&ONB.lt.ph,i:ONB&&ONB.lt&&ONB.lt.i};});
  for(const scheme of ['light','dark'])for(const [w,h] of VPS){const tag=`${scheme}-${w}`;
    const A=await open({browser:b,uid:876754050,name:'Андрей',platform:'tdesktop',touch:false,ctx:{viewport:{width:w,height:h},colorScheme:scheme},wait:2600,init,initArg:[base,{admin:true,flags:{}}]}),P=A.page;
    await P.evaluate(s=>{Telegram.WebApp.colorScheme=s;window.__bgKeep=1;},scheme);
    await P.evaluate(()=>{ONB=null;renderOnb(0);});await P.waitForTimeout(900);
    const bad=[];const step=async n=>{await P.waitForTimeout(500);const s=await state(P);const k=await contrast(P,(await P.locator('.onb-h').count())?'.onb-h':'.onb-hw');
      if(s.bg3d||s.has3d||s.bgOn)bad.push(n+': 3D виден '+JSON.stringify(s));if(k!==null&&k<4.5)bad.push(n+': контраст '+k);if(k===null&&!/7-/.test(n))bad.push(n+': нет заголовка');if(s.out.length)bad.push(n+': кнопки за окном '+s.out.join(','));
      await P.screenshot({path:`${__dirname}/shots/onbpc-${tag}-${n}.png`});return s;};
    await step('0-goal');
    await P.click('.onb-opts button, [data-goal], .onb-goal button').catch(()=>{});
    await P.evaluate(()=>renderOnb(1));let s=await step('1-intro');
    const txt=await P.evaluate(()=>(document.querySelector('.onb-p')||{}).textContent||'');
    if(w===1440)ok(`${tag}: текст для ПК — «перетащи карточку вправо или нажми →»`,/перетащи/.test(txt)&&/→/.test(txt)&&!/смахни/.test(txt),txt);
    await P.keyboard.press('Enter');await P.waitForTimeout(400);s=await state(P);
    if(w===1440)ok(`${tag}: Enter — «Начать тест»`,s.ph==='w'&&s.i===0,s);
    if(s.ph!=='w'){await P.click('#onbGo');await P.waitForTimeout(400);}
    await step('2-card');
    if(w===1440){const cur=await P.evaluate(()=>getComputedStyle(document.querySelector('#onbCard')).cursor);ok(`${tag}: у карточки курсор grab`,cur==='grab',cur);}
    await P.keyboard.press('ArrowRight');await P.waitForTimeout(600);s=await state(P);const i1=s.i;
    await P.keyboard.press('ArrowLeft');await P.waitForTimeout(600);s=await state(P);
    if(w===1440)ok(`${tag}: → и ← двигают тест`,i1===1&&s.i===2,{i1,i2:s.i});
    // перетаскивание мышью на 150 px вправо (карточка 2 — не выдуманная)
    const before=await P.evaluate(()=>({n:ONB.lt.seq.length,fk:ONB.lt.fk}));
    const cb=await P.locator('#onbCard').boundingBox();const cx=cb.x+cb.width/2,cy=cb.y+cb.height/2;
    await P.mouse.move(cx,cy);await P.mouse.down();await P.mouse.move(cx+150,cy,{steps:10});await P.mouse.up();await P.waitForTimeout(700);
    const after=await P.evaluate(()=>({n:ONB.lt.seq.length,fk:ONB.lt.fk,last:ONB.lt.seq[ONB.lt.seq.length-1],i:ONB.lt.i}));
    if(w===1440)ok(`${tag}: перетащил мышью на 150 px вправо — «знаю»`,after.i===3&&(after.n===before.n+1&&after.last[1]===true||after.fk===before.fk+1),{before,after});
    while(await P.evaluate(()=>ONB.lt.ph==='w'))await P.evaluate(()=>{const b=document.getElementById('onbYes')||document.querySelector('.onb-chs .onb-o[data-ok="1"]');if(b)b.click();}),await P.waitForTimeout(380);   // 24.10 (П4): и «выбери перевод»
    // 24.10 (П4): «Проверь себя» — кнопки в окне; «Знал» мышью, потом Enter — «Дальше»
    if(await P.evaluate(()=>ONB.lt.ph==='chk')){await step('2b-check');for(const x of await P.$$('.onb-cr[data-j] .onb-cb .y'))await x.click();await P.keyboard.press('Enter');await P.waitForTimeout(500);
      if(w===1440)ok(`${tag}: «Проверь себя» — «Знал» мышью, Enter — «Дальше»`,await P.evaluate(()=>ONB.lt.ph==='g'));
      if(await P.evaluate(()=>ONB.lt.ph==='chk'))await P.evaluate(()=>document.getElementById('onbGo').click()),await P.waitForTimeout(400);}
    await step('3-grammar');
    while(await P.evaluate(()=>ONB.lt.ph==='g'))await P.evaluate(()=>{const b=document.querySelector('.onb-opts .onb-o');if(b)b.click();}),await P.waitForTimeout(1000);
    await step('4-level');
    await P.keyboard.press('Enter');await P.waitForTimeout(500);s=await state(P);
    if(w===1440)ok(`${tag}: Enter на уровне — «Дальше»`,s.st===2,s);
    if(s.st!==2)await P.evaluate(()=>renderOnb(2));
    await step('5-minutes');await P.evaluate(()=>renderOnb(3));await step('6-hello');await P.evaluate(()=>renderOnb(4));await step('7-setup');
    ok(`${tag}: на всех шагах 3D-зала нет, заголовок читается (≥ 4.5), кнопки в окне`,!bad.length,bad);
    ok(`${tag}: консоль чистая`,!A.errs.length,A.errs.slice(0,4));
    await A.ctx.close();}
  // 13.9.42: 3D-фон удалён совсем — ни в «Новом», ни в «Как было», строки в Настройках нет
  const A=await open({browser:b,uid:876754050,name:'Андрей',platform:'tdesktop',touch:false,ctx:{viewport:{width:1440,height:900}},wait:2600,init,initArg:[base,{admin:true,flags:{}}]}),P=A.page;
  let r;for(const lk of ['','nd']){await P.evaluate(l=>{store.look=l;save();renderSettings();},lk);await P.waitForTimeout(800);
    r=await P.evaluate(()=>({g:!!window.BG3D,c:!!document.getElementById('bg3d'),has3d:document.body.classList.contains('has3d'),row:/3D-фон/.test(document.querySelector('.screen').textContent)}));
    ok(`${lk||'Как было'}: 3D-фона нет совсем, строки «3D-фон» в Настройках нет`,!r.g&&!r.c&&!r.has3d&&!r.row,r);}
  await A.ctx.close();
  console.log(fails?`ИТОГ onbpc: FAIL ${fails}`:'ИТОГ onbpc: всё PASS');await b.close();process.exit(fails?1:0);})();
