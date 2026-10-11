// 13.8.7: скрины «как у Андрея» (реальный прогресс, ~12 фраз и 5 слов) или демо: Кинотека, фильм, сцена, «Мои фразы» во всех 4 видах,
// подборка, «смотреть подряд», «Мои слова», открытое слово; телефон и ПК
const {open}=require('./st');const {chromium}=require('playwright');
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify({admin:true,flags:{}}));};
const dev=process.argv[2]||'ph',mode=process.argv[3]||'real';
const base={onboarded:true,introV:1,gold:900,lvl:'b',fx:true,tourV:1,scSubChosen:1,autoSc:false,age18:true,dictVar:'kino',dlDemo:mode==='demo',snd:false};
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const [vp,touch]=dev==='ph'?[{width:390,height:844},true]:[{width:1440,height:900},false];
  const {page,errs}=await open({browser:b,touch,uid:876754050,ctx:{viewport:vp},wait:2500,init:seed,initArg:[base]});
  const shot=async n=>{await page.waitForTimeout(800);await page.screenshot({path:`kn5-${dev}-${mode}-${n}.png`});};
  const click=async s=>{const l=page.locator(s).first();await l.scrollIntoViewIfNeeded();await l.click();};
  if(mode==='real')await page.evaluate(()=>{const now=Date.now();let n=0;
    for(const [id,pi,k] of [['american-psycho',0,3],['clavicular-impaulsive',0,4],['wolf-of-wall-street',0,3],['taxi-driver-lonely',1,2]]){const s=scOf(id),P=scP(id);P.got=P.got||{};P.w[pi]=1;
      scAct(s.parts[pi].ph).slice(0,k).forEach((f,i)=>{n++;P.got[f.id]=now-n*60000;P.m[f.id]=n%5===0?3:1;if(n%4===0)P.r[f.id]=[1,now-1000];else P.r[f.id]=[1,now+864e5*2];});}
    scSave();
    store.myw={};[['wolf-of-wall-street',21,'clients','клиенты',['работа']],['wolf-of-wall-street',4.96,'function','работать, функционировать'],['american-psycho',20.34,'tan','загар'],['american-psycho',36.82,'occasionally','иногда']].forEach(([sid,a,w,ru,tags],i)=>{
      const r=scOf(sid).subs.find(z=>Math.abs(z[0]-a)<0.06);store.myw[sid+'|'+w]={k:sid+'|'+w,w,ru,de:'',sid,pi:0,line:r?r[2]:'',lineRu:r?r[3]:'',a,at:now-i*1000,lvl:0,st:i%3,due:i%2?now-1000:now+864e5*(i+1),tags:tags||[]};});
    store.myw['own|deadline']={k:'own|deadline',w:'deadline',ru:'срок сдачи',de:'',sid:'own',pi:0,line:'',lineRu:'',a:0,at:now-9000,lvl:0,st:1,due:now+864e5*2,own:true,tags:['работа']};save();});
  await page.evaluate(()=>renderTab('dict'));await page.waitForFunction(()=>window.DL&&document.querySelector('#dlStage'),null,{timeout:15000});await page.waitForTimeout(1200);
  await page.evaluate(()=>{DX.seg='ph';DL.S.sid=null;DL.S.show=null;renderTab('dict');});await shot('1-kino');
  await page.evaluate(()=>DL.open({show:'Американский психопат',sid:null}));await page.waitForTimeout(1500);await shot('2-film');
  await page.evaluate(()=>DL.open({sid:'american-psycho'}));await page.waitForTimeout(1200);await click('.kn-ep summary .kn-ex');await page.waitForTimeout(600);await page.evaluate(()=>{document.body.scrollTop=380;});await shot('3-scene');
  await page.evaluate(()=>{DL.S.sid=null;DL.S.show=null;DX.seg='my';store.knMyKind='ph';renderTab('dict');});
  for(const v of ['tiles','lists','stories','toc']){await page.evaluate(v=>{store.knMyV=v;DL.render(0);},v);await shot('4-my-'+v);}
  await page.evaluate(()=>{store.knMyV='tiles';DL.KN.my.tag='★all';DL.render(0);});await shot('5-tag');
  await click('.kmp-play');await page.waitForTimeout(1600);await shot('6-auto');await page.evaluate(()=>DL.back());await page.waitForTimeout(500);
  await page.evaluate(()=>{DL.KN.my.tag=null;store.knMyKind='w';DL.render(0);});await shot('7-words');
  await page.evaluate(()=>{DL.KN.my.tag='★all';DL.render(0);});await page.waitForTimeout(600);await click('.kqw');await page.waitForTimeout(1600);await shot('8-word');
  const r=await page.evaluate(()=>({w:(document.querySelector('.kn2-word')||{}).textContent,sw:document.documentElement.scrollWidth}));
  console.log(dev,mode,JSON.stringify(r),'ошибки:',errs.join(' | ')||'нет');
  await b.close();})();
