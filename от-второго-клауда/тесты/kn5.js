// 13.9.3: скрины «как у Андрея» (реальный прогресс, ~14 фраз и 5 слов) или демо: Кинотека на весь экран, фильм, сцена,
// «Мои фразы и слова» во всех 4 вариантах (Лента, Разговорник, Переписка, Альбомы), чат, альбом с плеером; телефон и ПК
const {open}=require('./st');const {chromium}=require('playwright');
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify({admin:true,flags:{}}));};
const dev=process.argv[2]||'ph',mode=process.argv[3]||'real';
const base={onboarded:true,introV:1,gold:900,lvl:'b',fx:true,tourV:1,scSubChosen:1,autoSc:false,age18:true,dictVar:'kino',dlDemo:mode==='demo',snd:false};
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const [vp,touch]=dev==='ph'?[{width:390,height:844},true]:[{width:1440,height:900},false];
  const {page,errs}=await open({browser:b,touch,uid:876754050,ctx:{viewport:vp},wait:2500,init:seed,initArg:[base]});
  const shot=async n=>{await page.waitForTimeout(900);await page.screenshot({path:`kn5-${dev}-${mode}-${n}.png`});};
  const ev=(f,a)=>page.evaluate(f,a);const click=async s=>{const l=page.locator(s).first();await l.scrollIntoViewIfNeeded();await l.click();};
  if(mode==='real')await ev(()=>{const now=Date.now();let n=0;
    for(const [id,pi,k] of [['wolf-of-wall-street',0,6],['american-psycho',0,4],['clavicular-impaulsive',0,3],['taxi-driver-lonely',1,2]]){const s=scOf(id),P=scP(id);P.got=P.got||{};P.w[pi]=1;
      scAct(s.parts[pi].ph).slice(0,k).forEach(f=>{n++;P.got[f.id]=now-n*6e4;P.m[f.id]=n%5===0?3:1;P.r[f.id]=n%4===0?[1,now-1000]:[1,now+864e5*2];});}
    scSave();store.myw={};[['wolf-of-wall-street',21,'clients','клиенты',['работа']],['wolf-of-wall-street',4.96,'function','работать, функционировать'],['american-psycho',20.34,'tan','загар'],['american-psycho',36.82,'occasionally','иногда']].forEach(([sid,a,w,ru,tags],i)=>{
      const r=scOf(sid).subs.find(z=>Math.abs(z[0]-a)<0.06);store.myw[sid+'|'+w]={k:sid+'|'+w,w,ru,de:'',sid,pi:0,line:r?r[2]:'',lineRu:r?r[3]:'',a,at:now-i*1000,lvl:0,st:i%3,due:i%2?now-1000:now+864e5*(i+1),tags:tags||[]};});
    store.myw['own|deadline']={k:'own|deadline',w:'deadline',ru:'срок сдачи',de:'',sid:'own',pi:0,line:'',lineRu:'',a:0,at:now-9000,lvl:0,st:1,due:now+864e5*2,own:true,tags:['работа']};save();});
  await ev(()=>{DX.seg='ph';renderTab('dict');});await page.waitForFunction(()=>window.DL&&document.querySelector('#dlStage'),null,{timeout:15000});await page.waitForTimeout(1500);
  await ev(()=>{DL.S.sid=null;DL.S.show=null;DL.render(0);});await shot('01-kino');
  await click('[data-kfs="film"]');await page.waitForTimeout(1200);await shot('02-full');
  await ev(()=>{const pg=document.querySelector('.knf-pg');pg.scrollTo({left:pg.clientWidth,behavior:'instant'});});await page.waitForTimeout(1500);await shot('03-full-next');
  await click('.knf-x');await page.waitForTimeout(600);
  await ev(()=>DL.open({show:'Американский психопат',sid:null}));await page.waitForTimeout(1500);await shot('04-film');
  for(const [v,n] of [['feed','05-feed'],['book','06-book'],['chat','07-chat'],['album','09-album']]){await ev(v=>{DL.S.sid=null;DL.S.show=null;DX.seg='my';store.knMyKind='ph';store.knMyV=v;DL.KN.my.tag=null;renderTab('dict');},v);await page.waitForTimeout(1300);await shot(n);
    if(v==='chat'){await click('.kmc-r');await page.waitForTimeout(900);await click('[data-vp]');await page.waitForTimeout(1300);await shot('08-chat-page');await ev(()=>DL.back());}
    if(v==='album'){await ev(()=>{const b=[...document.querySelectorAll('.kma-c')].find(x=>/Волк/.test(x.textContent));b&&b.click();});await page.waitForTimeout(1000);await click('[data-aplay]');await page.waitForTimeout(1500);await shot('10-album-page');}}
  await ev(()=>{store.knMyKind='w';store.knMyV='chat';DL.KN.my.tag=null;DL.render(0);});await page.waitForTimeout(1000);await shot('11-words-chat');
  const r=await ev(()=>({sw:document.documentElement.scrollWidth}));
  console.log(dev,mode,JSON.stringify(r),'ошибки:',errs.join(' | ')||'нет');
  await b.close();})();
