// 13.9.4: «Мои фразы и слова» — 2 вида (Альбомы, Разговорник): шапка, шторка вида, фразы и слова, «‹» настоящим кликом,
// плеер, тренировка, поиск, окошко слова без дубля объяснения; ph|pc [album,book]
const {open}=require('./st');const {chromium}=require('playwright');
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify({admin:true,flags:{}}));};
const bb=()=>{window.__bb=[];const W=window.Telegram&&Telegram.WebApp;if(W)W.BackButton={show(){window.__bb.push(1);},hide(){window.__bb.push(0);},onClick(){},offClick(){}};};
const dev=process.argv[2]||'ph',only=(process.argv[3]||'album,book').split(',');
const base={onboarded:true,introV:1,gold:900,lvl:'b',fx:true,tourV:1,scSubChosen:1,autoSc:false,age18:true,dictVar:'kino',dlDemo:false,snd:false};
const shot=(p,n)=>p.screenshot({path:`${__dirname}/km-${dev}-${n}.png`});
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const [vp,touch]=dev==='ph'?[{width:390,height:844},true]:[{width:1440,height:900},false];
  const {page,ctx,errs}=await open({browser:b,touch,uid:876754050,ctx:{viewport:vp},wait:2500,init:seed,initArg:[base]});await ctx.addInitScript(bb);await page.reload();await page.waitForTimeout(2500);
  const ev=(f,a)=>page.evaluate(f,a);const click=async s=>{const l=page.locator(s).first();await l.scrollIntoViewIfNeeded();await l.click();};
  const bbLast=()=>ev(()=>window.__bb.slice(-1)[0]);
  await ev(()=>{const now=Date.now();let n=0;
    for(const [id,pi,k] of [['wolf-of-wall-street',0,6],['american-psycho',0,4],['clavicular-impaulsive',0,3],['taxi-driver-lonely',1,2]]){const s=scOf(id),P=scP(id);P.got=P.got||{};P.w[pi]=1;
      scAct(s.parts[pi].ph).slice(0,k).forEach(f=>{n++;P.got[f.id]=now-n*6e4;P.m[f.id]=n%5===0?3:1;P.r[f.id]=n%4===0?[1,now-1000]:[1,now+864e5*2];});}
    scSave();store.myw={};const add=(k,w,ru,sid,pi,a,st,due,tags)=>{const s=scOf(sid),r=s&&s.subs.find(z=>Math.abs(z[0]-a)<0.06);store.myw[k]={k,w,ru,de:'',sid,pi,line:r?r[2]:'',lineRu:r?r[3]:'',a,at:now-st*1000,lvl:0,st,due,tags:tags||[]};};
    add('wolf-of-wall-street|clients','clients','клиенты','wolf-of-wall-street',0,21,1,now-1000,['работа']);add('wolf-of-wall-street|function','function','работать','wolf-of-wall-street',0,4.96,0,now+864e5*3);
    add('american-psycho|tan','tan','загар','american-psycho',0,20.34,2,now+864e5,['внешность']);add('american-psycho|occasionally','occasionally','иногда','american-psycho',0,36.82,0,now-5000);
    store.myw['own|deadline']={k:'own|deadline',w:'deadline',ru:'срок сдачи',de:'',sid:'own',pi:0,line:'',lineRu:'',a:0,at:now-9e4,lvl:0,st:1,due:now+864e5*2,own:true,tags:['работа']};save();});
  // старый вид из 13.9.2–13.9.3 («Лента») → открываются Альбомы
  await ev(()=>{DX.seg='my';store.knMyKind='ph';store.knMyV='feed';renderTab('dict');});await page.waitForFunction(()=>window.DL&&document.querySelector('#dlStage'),null,{timeout:15000});await page.waitForTimeout(1500);
  let r=await ev(()=>({lvl:$('#dlStage').dataset.lvl,sw:[...document.querySelectorAll('.km-sw button')].map(b=>b.textContent.replace(/\s+/g,' ').trim()),vp:(document.querySelector('[data-mvp]')||{}).textContent,album:!!document.querySelector('.kma-c'),sw2:document.documentElement.scrollWidth,iw:innerWidth}));
  ok('старая «Лента» → Альбомы; шапка «Фразы | Слова», пилюля «Альбомы»',r.lvl==='my'&&r.sw.length===2&&/Альбомы/.test(r.vp)&&r.album&&r.sw2<=r.iw,r);
  await shot(page,'0-album-list');
  // шторка вида: 2 вида, переключение настоящими кликами
  await click('[data-mvp]');await page.waitForTimeout(600);r=await ev(()=>[...document.querySelectorAll('.km-vl [data-vv]')].map(b=>b.dataset.vv));ok('шторка вида: Альбомы, Разговорник',r.join()==='album,book',r);await shot(page,'0-sheet');
  await click('.km-vl [data-vv="book"]');await page.waitForTimeout(1200);r=await ev(()=>({b:!!document.querySelector('.kmb'),vp:document.querySelector('[data-mvp]').textContent,st:store.knMyV}));ok('выбрал «Разговорник»',r.b&&/Разговорник/.test(r.vp)&&r.st==='book',r);
  await click('[data-mvp]');await page.waitForTimeout(600);await click('.km-vl [data-vv="album"]');await page.waitForTimeout(1200);r=await ev(()=>!!document.querySelector('.kma-c'));ok('обратно «Альбомы»',r);
  if(only.includes('album')){
    r=await ev(()=>({h:[...document.querySelectorAll('.km-h')].map(x=>x.textContent),c:document.querySelectorAll('.kma-c').length,bb:window.__bb.slice(-1)[0]}));ok('Альбомы: подборки, фильмы, темы; «назад» Телеграма спрятана',r.c>5&&r.h.length>=2&&r.bb===0,r);
    await page.locator('.kma-c',{hasText:'Волк'}).first().click();await page.waitForTimeout(1300);
    r=await ev(()=>({t:document.querySelectorAll('.kma-t').length,d:(document.querySelector('.kma-ht>small')||{}).textContent,up:!!document.querySelector('.kma-hd [data-mup]'),bb:window.__bb.slice(-1)[0]}));ok('альбом фильма: треки, длительность, «‹», «назад» Телеграма показана',r.t>3&&/:/.test(r.d)&&r.up&&r.bb===1,r);
    // ВЫХОД: настоящий клик по «‹» (13.9.3: не работал)
    await page.click('.kma-hd [data-mup]');await page.waitForTimeout(1100);
    r=await ev(()=>({list:document.querySelectorAll('.kma-c').length,page:!!document.querySelector('.kma-tl'),tag:DL.KN.my.tag,bb:window.__bb.slice(-1)[0]}));ok('«‹» на странице альбома → список альбомов, «назад» Телеграма спрятана',r.list>0&&!r.page&&!r.tag&&r.bb===0,r);
    // выход «назад» Телеграма / системной
    await page.locator('.kma-c',{hasText:'Волк'}).first().click();await page.waitForTimeout(1100);await ev(()=>onBack());await page.waitForTimeout(1000);
    r=await ev(()=>({list:document.querySelectorAll('.kma-c').length,page:!!document.querySelector('.kma-tl')}));ok('«назад» Телеграма → список альбомов',r.list>0&&!r.page,r);
    await page.locator('.kma-c',{hasText:'Волк'}).first().click();await page.waitForTimeout(1300);
    await click('[data-aplay]');await page.waitForTimeout(1500);
    r=await ev(()=>{const v=document.querySelector('video.ka-v');return {bar:!!document.querySelector('#kaBar'),on:(document.querySelector('.kma-t.on')||{dataset:{}}).dataset.ti,p:v&&!v.paused};});r.vis=await ev(()=>{const b=document.querySelector('#kaBar').getBoundingClientRect();return b.top>0&&b.bottom<=innerHeight;});ok('«Слушать»: мини-плеер на экране, первый трек играет',r.bar&&r.vis&&r.on==='0'&&r.p,r);
    await shot(page,'1-album-page');
    let nx='0';for(let k=0;k<24&&nx==='0';k++){await page.waitForTimeout(500);nx=await ev(()=>(document.querySelector('.kma-t.on')||{dataset:{}}).dataset.ti);}ok('сам перешёл к следующему треку',nx==='1',nx);
    // «‹» при играющем плеере: музыка играет дальше (как в Apple Music)
    await page.click('.kma-hd [data-mup]');await page.waitForTimeout(900);r=await ev(()=>({list:document.querySelectorAll('.kma-c').length,bar:!!document.querySelector('#kaBar'),p:!document.querySelector('video.ka-v').paused}));ok('«‹» при музыке → список, музыка играет дальше',r.list>0&&r.bar&&r.p,r);await shot(page,'2-album-list-playing');
    await ev(()=>document.querySelector('#kaBar [data-kp]').click());await page.waitForTimeout(300);r=await ev(()=>document.querySelector('video.ka-v').paused);ok('⏯ — пауза',r);
    // окно фразы → слово: без дубля объяснения (собранная фраза, где «выражение» = вся фраза, — как «Usually I do the best…» у Андрея)
    const fk=await ev(()=>{for(const s of SCENES){const P=scP(s.id);for(const p of s.parts)for(const f of p.ph)if((P.got||{})[f.id]&&idWhole(phIdiom(f),f)&&kwWrap(f,scT(f)).includes('class="sw"'))return {film:dictFilm(s),k:s.id+'|'+f.id,en:f.en};}return null;});
    ok('есть собранная фраза, где «выражение» = вся фраза',!!fk,fk);
    await page.locator('.kma-c',{hasText:fk.film}).first().click();await page.waitForTimeout(1200);
    const ti=await ev(k=>[...document.querySelectorAll('.kma-t')].findIndex(t=>t.dataset.tk===k),fk.k);
    await click(`[data-to="${ti}"]`);await page.waitForTimeout(1500);
    r=await ev(()=>!!document.querySelector('.kno2'));ok('трек → окно фразы',r);
    await page.locator('.kno2 .kn2-en .sw').first().click();await page.waitForTimeout(700);
    r=await ev(()=>{const p=document.querySelector('.kw-pop.on');return p?{t:p.innerText.replace(/\s+/g,' ').slice(0,160),dup:/Тут это часть выражения/i.test(p.innerText),inph:/Во фразе/i.test(p.innerText)}:null;});
    ok('слово в открытой фразе: без «Тут это часть выражения» и без «Во фразе»',r&&!r.dup&&!r.inph,r);await shot(page,'3-word-pop');
    await ev(()=>kwHide(0));await page.waitForTimeout(300);await page.keyboard.press('Escape');await page.waitForTimeout(800);
    await click('[data-atr]');await page.waitForTimeout(1200);r=await ev(()=>!!document.querySelector('.dl-q'));ok('«Тренировать» альбом',r);await click('#dlx');await page.waitForTimeout(1500);
    r=await ev(()=>!!document.querySelector('.kma-tl'));ok('после тренировки — снова альбом',r);
    await page.click('.kma-hd [data-mup]');await page.waitForTimeout(900);
    // слова
    await click('[data-mk="w"]');await page.waitForTimeout(1200);r=await ev(()=>({c:document.querySelectorAll('.kma-c').length,fab:!!document.querySelector('.km-fab')}));ok('слова в Альбомах + кнопка «＋»',r.c>2&&r.fab,r);
    await click('.kma-c');await page.waitForTimeout(1100);await page.click('.kma-hd [data-mup]');await page.waitForTimeout(900);r=await ev(()=>({list:document.querySelectorAll('.kma-c').length,page:!!document.querySelector('.kma-tl')}));ok('слова: «‹» → список',r.list>0&&!r.page,r);
    await click('[data-mk="ph"]');await page.waitForTimeout(900);}
  if(only.includes('book')){
    await click('[data-mvp]');await page.waitForTimeout(600);await click('.km-vl [data-vv="book"]');await page.waitForTimeout(1300);await shot(page,'4-book');
    r=await ev(()=>({due:!!document.querySelector('.kmb-due'),ch:[...document.querySelectorAll('.kmb-h .kmb-ht b')].map(x=>x.textContent),rows:document.querySelectorAll('.kmb .kq').length,rail:document.querySelectorAll('.kmb-rail button').length,bb:window.__bb.slice(-1)[0]}));
    ok('Разговорник: «Повторить сегодня», главы, указатель; «назад» Телеграма спрятана',r.due&&r.ch.length>=2&&r.rows>5&&r.rail===r.ch.length&&r.bb===0,r);
    const last=r.ch.length-1;await ev(i=>document.querySelectorAll(innerWidth>=900?'.kmb-toc [data-bj]':'.kmb-rail [data-bj]')[i].click(),last);await page.waitForTimeout(1200);
    r=await ev(i=>{const h=document.querySelector('#kmbc-'+i).getBoundingClientRect();return {top:Math.round(h.top),y:Math.round(scrollY)};},last);ok('указатель → глава у верха',r.top<160&&r.y>50,r);await shot(page,'5-book-jump');
    await ev(()=>scrollTo(0,0));await page.waitForTimeout(400);
    await click('.kmb .kq:not(.lock)');await page.waitForTimeout(1500);r=await ev(()=>!!document.querySelector('.kno2'));ok('фраза → окно',r);
    await page.click('.kno2 .kn2-x');await page.waitForTimeout(800);r=await ev(()=>!document.querySelector('.kno2'));ok('окно закрылось',r);
    await click('[data-btr]');await page.waitForTimeout(1200);r=await ev(()=>!!document.querySelector('.dl-q'));ok('«Тренировать» главу',r);await click('#dlx');await page.waitForTimeout(1500);
    await click('[data-mk="w"]');await page.waitForTimeout(1200);r=await ev(()=>({ch:[...document.querySelectorAll('.kmb-h .kmb-ht b')].map(x=>x.textContent),rows:document.querySelectorAll('.kqw').length}));ok('слова по алфавиту',r.ch.join()===[...r.ch].sort().join()&&r.rows===5,r);await shot(page,'6-book-words');
    await click('.kqw');await page.waitForTimeout(1300);r=await ev(()=>(document.querySelector('.kn2-word')||{}).textContent);ok('слово → окно',!!r,r);await page.keyboard.press('Escape');await page.waitForTimeout(600);
    await click('[data-mk="ph"]');await page.waitForTimeout(800);}
  // окошко слова: логика idWhole на всех фразах (настоящее выражение внутри фразы — как раньше)
  r=await ev(()=>{const all=[];SCENES.forEach(s=>s.parts.forEach(p=>p.ph.forEach(f=>{const id=phIdiom(f);if(id)all.push([f,id]);})));
    const whole=all.filter(([f,id])=>idWhole(id,f)),part=all.filter(([f,id])=>!idWhole(id,f));
    const pop=(f,w)=>{const host=document.createElement('div'),el=document.createElement('i');el.className='sw';el.textContent=w;host.appendChild(el);document.body.appendChild(host);wordShow(el,f,true);const t=KWP.innerText;kwHide(0);host.remove();return t;};
    const [fw,iw]=whole[0],[fp,ip]=part.find(([f,id])=>id.words.some(w=>phNorm(f.en).split(' ').includes(w)))||[];
    const tw=pop(fw,iw.words[0]),tp=fp?pop(fp,ip.words.find(w=>phNorm(fp.en).split(' ').includes(w))):'';
    return {n:all.length,whole:whole.length,part:part.length,wDup:/Тут это часть выражения/i.test(tw),wIn:/Во фразе/i.test(tw),pDup:/Тут это часть выражения/i.test(tp),pIn:/Во фразе/i.test(tp),
      blkW:/Во фразе/i.test(phBlock(fw))&&!/часть выражения/.test(phBlock(fw)),blkP:fp?/часть выражения/.test(phBlock(fp)):false,ex:fp&&(ip.head+' ⊂ '+fp.en)};});
  ok('окошко слова: «выражение» = вся фраза — только «Во фразе»; настоящее выражение — как раньше',r.whole>300&&r.part>100&&!r.wDup&&r.wIn&&r.pDup&&r.pIn&&r.blkW&&r.blkP,r);
  // поиск
  await click('[data-msr]');await page.waitForTimeout(700);await page.fill('#kmQ','client');await page.waitForTimeout(800);
  r=await ev(()=>document.querySelectorAll('#kmBody .kq').length);ok('поиск',r>0,String(r));await ev(()=>onBack());await page.waitForTimeout(700);r=await ev(()=>!document.querySelector('#kmQ'));ok('«назад» закрывает поиск',r);
  // уход со словаря глушит звук
  await ev(()=>{store.knMyV='album';DL.KN.my.tag=null;DL.render(0);});await page.waitForTimeout(900);await page.locator('.kma-c',{hasText:'Волк'}).first().click();await page.waitForTimeout(900);await click('[data-aplay]');await page.waitForTimeout(1200);
  await ev(()=>renderTab('learn'));await page.waitForTimeout(800);
  r=await ev(()=>({v:[...document.querySelectorAll('video')].filter(v=>!v.paused).length,bar:!!document.querySelector('#kaBar')}));ok('ушёл со словаря — звук и плеер убраны',r.v===0&&!r.bar,r);
  // без анимаций
  await ev(()=>{store.fx=false;DX.seg='my';store.knMyV='book';renderTab('dict');});await page.waitForTimeout(1200);r=await ev(()=>!!document.querySelector('.kmb'));ok('без анимаций рисуется',r);
  ok('консоль чистая',!errs.length,errs.slice(0,5).join(' | '));
  console.log(fails?`ИТОГ: ${fails} FAIL`:'ИТОГ: всё PASS');await b.close();})();
