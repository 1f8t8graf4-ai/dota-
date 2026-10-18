// 13.9.20: цвет шапки Telegram = цвет верха страницы (на ПК шапку Telegram Desktop не убрать — она должна сливаться со страницей).
// На каждом экране: цвет, отданный в setHeaderColor, совпадает с пикселями верхних строк по всей ширине (±3); плашка .topfade — того же цвета.
// ph — телефон без полного экрана (шапка Telegram есть), phfs — телефон в полном экране (сверху плашка под кнопками Telegram), pc — 1440
const {open}=require('./st');const {chromium}=require('playwright');
const dev=process.argv[2]||'pc';
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
const init=([st,fs])=>{if(!sessionStorage.getItem('__seeded')){sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify({admin:false,flags:{}}));}
  const W=window.Telegram&&Telegram.WebApp;if(!W)return;W.setHeaderColor=c=>{window.__hc=c;};W.setBackgroundColor=c=>{window.__bc=c;};W.setBottomBarColor=c=>{window.__bbc=c;};
  if(fs){W.isFullscreen=true;W.safeAreaInset={top:47,bottom:34};W.contentSafeAreaInset={top:46};}};
const base={onboarded:true,introV:1,unl:1,snd:false,fx:false,knWin:'full'};
(async()=>{const b=await chromium.launch();const vp=dev==='pc'?{width:1440,height:900}:{width:390,height:844};
  const {page,errs}=await open({browser:b,uid:111,platform:dev==='pc'?'tdesktop':'ios',touch:dev!=='pc',ctx:{viewport:vp},wait:2500,init,initArg:[base,dev==='phfs']});
  await page.evaluate(()=>{const s=scOf('wolf-of-wall-street'),P=scP(s.id);P.got=P.got||{};P.w[0]=1;P.done=[0];scAct(s.parts[0].ph).forEach(f=>{P.got[f.id]=Date.now();P.m[f.id]=1;});scSave();});
  // пиксели верха: скрин полосы 0..14 px, разбор PNG прямо в браузере (canvas) — без лишних модулей
  // шов с шапкой — строки 0 и 3 (ниже уже содержимое: на ПК карточка профиля начинается с 10-й строки); ys/xs — где мерить
  const topPx=async(ys,xs)=>{ys=ys||[0,3];xs=xs||[.01,.25,.5,.75,.99];const h=Math.max(...ys)+2,buf=await page.screenshot({clip:{x:0,y:0,width:vp.width,height:h}});
    return page.evaluate(async([b64,ys,xs])=>{const im=new Image();im.src='data:image/png;base64,'+b64;await im.decode();const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);
      const out=[];for(const y of ys)for(const f of xs){const d=x.getImageData(Math.min(im.width-1,Math.round(im.width*f)),y,1,1).data;out.push([d[0],d[1],d[2]]);}return out;},[buf.toString('base64'),ys,xs]);};
  const hx=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
  const S=[['Главная',()=>renderTab('learn')],['Кинозал',()=>renderTab('kino')],['Словарь',()=>renderTab('dict')],['Профиль',()=>renderTab('profile')],['Настройки',()=>renderSettings()],
    ['Сцена «Волк»',()=>renderScene('wolf-of-wall-street')],['Сцена «Психопат» (светлая тема)',()=>renderScene('american-psycho')],['Сцена «Таксист»',()=>renderScene('taxi-driver-lonely')],['Сцена «Титаник»',()=>renderScene('titanic-boat')],
    ['Эпизод',()=>renderScEp('wolf-of-wall-street',1)],['Коллекция',()=>renderCollection('bg')],['Магазин',()=>renderShop()],
    ['Главная с фоном из Коллекции',()=>{store.appBg='h:Волк с Уолл-стрит';store.showRw=store.showRw||{};store.showRw['Волк с Уолл-стрит']={t:Date.now()};save();renderTab('learn');}]];
  for(const [n,f] of S){await page.evaluate(f);await page.waitForTimeout(1600);await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(250);
    const st=await page.evaluate(()=>({hc:window.__hc,bc:window.__bc,bbc:window.__bbc,tf:(()=>{const t=document.querySelector('.topfade');return t?{h:t.getBoundingClientRect().height,bg:getComputedStyle(t).backgroundImage}:null;})()}));
    if(!st.hc||!/^#[0-9a-f]{6}$/i.test(st.hc)){ok(n+': цвет шапки отдан',false,st);continue;}
    const want=hx(st.hc),px=await topPx(),d=Math.max(...px.map(p=>Math.max(...p.map((v,i)=>Math.abs(v-want[i])))));
    ok(`${n}: шапка ${st.hc} = верх страницы (Δ ${d})`,d<=3&&st.bc===st.hc,{bc:st.bc,px:px.slice(0,5).map(p=>'#'+p.map(v=>v.toString(16).padStart(2,'0')).join('')).join(' ')});
    // полный экран: под плашкой (.topfade) у краёв — тот же цвет, без светлой полосы
    if(dev==='phfs'&&st.tf&&st.tf.h>20){const y=Math.round(st.tf.h)+6,q=await topPx([y],[.006,.994]),d2=Math.max(...q.map(p=>Math.max(...p.map((v,i)=>Math.abs(v-want[i])))));
      ok(`${n}: под плашкой (y ${y}) тот же цвет (Δ ${d2})`,d2<=3,q.map(p=>'#'+p.map(v=>v.toString(16).padStart(2,'0')).join('')).join(' '));}}
  if(dev==='phfs'){const t=await page.evaluate(()=>{const e=document.querySelector('.topfade');return e?Math.round(e.getBoundingClientRect().height):0;});ok('полный экран: плашка под кнопками Telegram есть и того же цвета (проверено выше)',t>=80,t);}
  // мир игр (Дота) — шапка по цвету фона этого мира
  await page.evaluate(()=>{try{renderDotaWorld();}catch(e){}});await page.waitForTimeout(1200);
  const g=await page.evaluate(()=>({hc:window.__hc,body:getComputedStyle(document.body).backgroundColor}));
  ok('Дота: шапка = фон мира',!!g.hc&&('#'+(g.body.match(/\d+/g)||[]).slice(0,3).map(v=>(+v).toString(16).padStart(2,'0')).join(''))===g.hc.toLowerCase(),g);
  ok('консоль чистая',!errs.length,errs.slice(0,5));
  console.log(fails?`ИТОГ ${dev}: FAIL ${fails}`:`ИТОГ ${dev}: всё PASS`);await b.close();process.exit(fails?1:0);})();
