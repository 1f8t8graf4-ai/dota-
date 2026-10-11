// 13.8.5: «Фразы» цитатами — как у Андрея (реальный прогресс, ~12 фраз) и демо; телефон и ПК
const {open}=require('./st');const {chromium}=require('playwright');
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify({admin:true,flags:{}}));};
const dev=process.argv[2]||'ph',mode=process.argv[3]||'real';
const base={onboarded:true,introV:1,gold:900,lvl:'b',fx:true,tourV:1,scSubChosen:1,autoSc:false,age18:true,dictVar:'kino',dlDemo:mode==='demo',knView:'list'};
(async()=>{const b=await chromium.launch();const [vp,touch]=dev==='ph'?[{width:390,height:844},true]:[{width:1440,height:900},false];
  const {page,errs}=await open({browser:b,touch,uid:876754050,ctx:{viewport:vp},wait:2500,init:seed,initArg:[base]});
  if(mode==='real')await page.evaluate(()=>{const now=Date.now();let n=0;
    for(const [id,pi,k] of [['american-psycho',0,3],['clavicular-impaulsive',0,4],['wolf-of-wall-street',0,3],['taxi-driver-lonely',1,2]]){const s=scOf(id),P=scP(id);P.got=P.got||{};P.w[pi]=1;
      scAct(s.parts[pi].ph).slice(0,k).forEach((f,i)=>{n++;P.got[f.id]=now-n*60000;P.m[f.id]=n%5===0?3:1;if(n%4===0)P.r[f.id]=[1,now-1000];else P.r[f.id]=[1,now+864e5*2];});}
    scSave();});
  await page.evaluate(()=>renderTab('dict'));await page.waitForTimeout(1500);await page.evaluate(()=>{DL.S.sid=null;DL.S.show=null;renderTab('dict');});await page.waitForTimeout(1500);
  await page.screenshot({path:`kn5-${dev}-${mode}-1.png`});
  await page.evaluate(()=>{document.body.scrollTop=520;});await page.waitForTimeout(700);await page.screenshot({path:`kn5-${dev}-${mode}-2.png`});
  await page.evaluate(()=>{document.body.scrollTop=0;});
  const r=await page.evaluate(()=>({rows:document.querySelectorAll('.kq').length,thumbs:document.querySelectorAll('.kr-t').length,adm:getComputedStyle(document.querySelector('.dl-adm')).position,sw:document.documentElement.scrollWidth}));
  // сцена и поиск — те же строки
  await page.evaluate(()=>DL.open({sid:'american-psycho'}));await page.waitForTimeout(1500);await page.evaluate(()=>{document.body.scrollTop=420;});await page.waitForTimeout(600);await page.screenshot({path:`kn5-${dev}-${mode}-3scene.png`});
  const sc=await page.evaluate(()=>({rows:document.querySelectorAll('.kn-ep .kq').length,lock:document.querySelectorAll('.kn-ep .kq.lock').length}));
  await page.evaluate(()=>{DL.S.flt=true;Object.assign(DL.KN,{tp:'работа',q:'',st:'',tone:'',film:''});DL.render(1);});await page.waitForTimeout(1500);await page.screenshot({path:`kn5-${dev}-${mode}-4flt.png`});
  const fl=await page.evaluate(()=>document.querySelectorAll('#knRes .kq').length);
  // открыть фразу из списка
  await page.evaluate(()=>{DL.S.flt=false;Object.assign(DL.KN,{tp:''});DL.S.sid=null;DL.S.show=null;DL.render(-1);});await page.waitForTimeout(1200);
  await page.click('.kq:not(.lock)');await page.waitForTimeout(1200);const op=await page.evaluate(()=>!!document.querySelector('.kno'));
  console.log(dev,mode,JSON.stringify(r),'сцена',JSON.stringify(sc),'поиск',fl,'карта открылась',op,'ошибки:',errs.join(' | ')||'нет');
  await b.close();})();
