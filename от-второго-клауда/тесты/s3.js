// полный прогон: вкладки, экраны и все сцены (страница, эпизод, проверка до итога, все фразы) — телефон и ПК
const {open}=require('./st');const {chromium}=require('playwright');
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));};
const base={onboarded:true,introV:1,gold:900,lvl:'b',fx:false,tourV:1,scSubChosen:1,autoSc:false,age18:true};
async function answerAll(page,max=40){for(let i=0;i<max;i++){const r=await page.evaluate(()=>{
  if(document.querySelector('.sc-result'))return 'end';
  const c=x=>{const e=document.querySelector(x);if(e&&!e.hidden&&!e.disabled&&e.offsetParent!==null){e.click();return true;}return false;};
  if(c('#scnx')||c('#dln'))return 'next';
  if(c('#scLno'))return 'a';if(c('#scgno'))return 'a';
  const o=document.querySelector('.sc-opt:not([disabled])');if(o){o.click();return 'a';}
  const pool=[...document.querySelectorAll('#scbpool button:not([disabled])')];if(pool.length){pool.forEach(b=>b.click());if(c('#scbchk'))return 'a';}
  if(c('#scbchk'))return 'a';
  return 'none';});
  if(r==='end')return 'end';if(r==='none'){await page.waitForTimeout(500);const again=await page.evaluate(()=>!!document.querySelector('.sc-q'));if(!again)return 'left';}
  await page.waitForTimeout(r==='next'?350:900);}return 'max';}
(async()=>{const b=await chromium.launch();
  for(const [nm,vp,touch] of [['ph',{width:390,height:844},true],['pc',{width:1440,height:900},false]].filter(x=>!process.argv[2]||x[0]===process.argv[2])){
    const {page,errs,ctx}=await open({browser:b,touch,ctx:{viewport:vp},wait:2500,init:seed,initArg:[base]});
    const log=[];const mark=async k=>{if(errs.length){log.push(k+': '+errs.splice(0).join(' || '));}};
    for(const [k,f] of [['learn',()=>renderTab('learn')],['kino',()=>renderTab('kino')],['dict',()=>renderTab('dict')],['games',()=>renderTab('games')],['profile',()=>renderTab('profile')],['settings',()=>renderSettings()],['shop',()=>renderShop()],['coll',()=>renderCollection()],['search',()=>renderSearch('money')],['daily',()=>renderDaily()],['mywords',()=>renderMyWords()],['admin',()=>renderAdmin()],['dota',()=>renderDotaWorld()],['cs',()=>renderCSWorld()],['spy',()=>renderTab('spy')],['arena',()=>renderTab('arena')],['intro',()=>{INTRO=null;renderIntro(0);}]]){
      try{await page.evaluate(f);}catch(e){log.push(k+' THROW '+e.message.split('\n')[0]);}await page.waitForTimeout(500);await mark(k);}
    if(nm==='ph')await page.screenshot({path:'s3-learn.png'});
    const ids=await page.evaluate(()=>SCENES.map(s=>s.id));let ends=0;
    for(const id of ids){
      for(const [k,f] of [['scene',i=>renderScene(i)],['ep',i=>renderScEp(i,0,{free:true})],['sum',i=>renderSceneSum(i)]]){try{await page.evaluate(f,id);}catch(e){log.push(id+' '+k+' THROW '+e.message.split('\n')[0]);}await page.waitForTimeout(350);await mark(id+' '+k);}
      try{await page.evaluate(i=>renderScQuiz(i,0),id);await page.waitForTimeout(700);const r=await answerAll(page);if(r==='end')ends++;else log.push(id+' quiz: '+r+' '+(await page.evaluate(()=>(document.querySelector('.sc-meta')||{}).textContent||document.body.innerText.slice(0,80))));}catch(e){log.push(id+' quiz THROW '+e.message.split('\n')[0]);}
      await mark(id+' quiz');}
    console.log(nm,'сцен:',ids.length,'проверок до итога:',ends);console.log(log.length?log.join('\n'):'ошибок нет');
    await ctx.close();}
  await b.close();})();
