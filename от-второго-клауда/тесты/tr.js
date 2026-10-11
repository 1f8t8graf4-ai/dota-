// 13.9.5: тренировка / повторение (renderDaily) — без самопроверок: фразы — диктант и кубики, слова — выбор из 4; ph|pc
const {open}=require('./st');const {chromium}=require('playwright');
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify({admin:true,flags:{}}));};
const dev=process.argv[2]||'ph';
const base={onboarded:true,introV:1,gold:900,lvl:'b',fx:true,tourV:1,scSubChosen:1,autoSc:false,age18:true,dictVar:'kino',dlDemo:false,snd:false};
const shot=(p,n)=>p.screenshot({path:`${__dirname}/tr-${dev}-${n}.png`});
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const [vp,touch]=dev==='ph'?[{width:390,height:844},true]:[{width:1440,height:900},false];
  const {page,errs}=await open({browser:b,touch,uid:876754050,ctx:{viewport:vp},wait:2500,init:seed,initArg:[base]});
  const ev=(f,a)=>page.evaluate(f,a);
  // повторение на сегодня: 6 фраз «Американского психопата» и «Волка» + 3 моих слова
  await ev(()=>{const now=Date.now();for(const [id,k] of [['american-psycho',3],['wolf-of-wall-street',3]]){const s=scOf(id),P=scP(id);P.got=P.got||{};P.w[0]=1;
      scAct(s.parts[0].ph).filter(f=>dNorm(scT(f)).split(' ').length>=2).slice(0,k).forEach((f,j)=>{P.got[f.id]=now-j*6e4;P.m[f.id]=2;P.r[f.id]=[1,now-1000];});}
    scSave();store.myw={};const add=(k,w,ru,sid,pi,a)=>{const s=scOf(sid),r=s&&s.subs.find(z=>Math.abs(z[0]-a)<0.06);store.myw[k]={k,w,ru,de:'',sid,pi,line:r?r[2]:'',lineRu:r?r[3]:'',a,at:now,lvl:0,st:1,due:now-1000,tags:[]};};
    add('wolf-of-wall-street|clients','clients','клиенты','wolf-of-wall-street',0,21);add('american-psycho|tan','tan','загар','american-psycho',0,20.34);add('american-psycho|occasionally','occasionally','иногда','american-psycho',0,36.82);save();});
  await ev(()=>renderDaily());await page.waitForTimeout(1200);
  const seen={};let builds=0,means=0,dicts=0,steps=0,wrongDone=false;
  for(;steps<20;steps++){
    const st=await ev(()=>{const m=(document.querySelector('.dl-q .sc-meta')||{}).textContent||'',h=(document.querySelector('.dl-q h2')||{}).innerText||'';return {m,h,res:!!document.querySelector('.sc-result'),self:/Вспомни по-|Показать ответ|Не вспомнил|Знал/.test(document.body.innerText)};});
    if(st.res)break;
    if(st.self){ok('нет самопроверки «Вспомни / Знал»',false,st.m);break;}
    seen[st.m]=(seen[st.m]||0)+1;
    if(/Собери фразу/.test(st.m)){builds++;
      if(builds===1)await shot(page,'1-build');
      // правильный порядок кубиков — те же токены, что у scBuildTiles (без перемешивания)
      const tk=await ev(()=>{const ru=document.querySelector('.dl-q h2').childNodes[0].textContent.trim();let f=null,s0=null;for(const s of SCENES)for(const p of s.parts)for(const x of p.ph)if(x.ru===ru){f=x;s0=s;}
        const de=s0.lang==='de',tgt=de?f.de:scT(f);return scBuildTiles(tgt,f,[],de).tk;});
      if(!wrongDone){   // сначала ошибка: кубики в обратном порядке → разметка и «Попытка 2 из 3», потом сброс
        for(const w of tk.slice().reverse()){await ev(w=>{const b=[...document.querySelectorAll('#scbpool .sc-tile:not(.used)')].find(x=>x.textContent===w);b&&b.click();},w);}
        await page.click('#scbchk');await page.waitForTimeout(400);
        const r=await ev(()=>({msg:(document.querySelector('#scbmsg')||{}).textContent,diff:!!document.querySelector('#scbdiff .sc-diff'),marks:document.querySelectorAll('#scbans .sc-tile.good,#scbans .sc-tile.bad').length}));
        ok('кубики: неверно → разметка, разбор, «Попытка 2 из 3»',/Попытка 2 из 3/.test(r.msg)&&r.diff&&r.marks>0,r);await shot(page,'2-build-wrong');
        await page.click('#scbrst');await page.waitForTimeout(200);wrongDone=true;}
      for(const w of tk){await ev(w=>{const b=[...document.querySelectorAll('#scbpool .sc-tile:not(.used)')].find(x=>x.textContent===w);b&&b.click();},w);}
      await page.click('#scbchk');await page.waitForTimeout(500);
      const r=await ev(()=>({fb:(document.querySelector('#dlfb .sc-fb .t')||{}).textContent,right:document.querySelector('#scbans').classList.contains('right')}));
      ok('кубики собраны верно → ответ принят',r.right&&!!r.fb,r);
    }else if(/что значит/.test(st.m)){means++;
      const r=await ev(()=>{const o=[...document.querySelectorAll('.sc-opt')];return {n:o.length,uniq:new Set(o.map(x=>x.dataset.v)).size};});ok('слово: 4 разных варианта',r.n===4&&r.uniq===4,r);
      if(means===1)await shot(page,'3-word');
      // первое слово — ошибёмся (вернётся ещё раз), остальные — верно
      await ev(first=>{const h=document.querySelector('.dl-q h2').childNodes[0].textContent.trim(),it=Object.values(store.myw).find(x=>x.w===h),o=[...document.querySelectorAll('.sc-opt')];
        (first?o.find(x=>x.dataset.v!==it.ru):o.find(x=>x.dataset.v===it.ru)).click();},means===1);await page.waitForTimeout(300);
    }else if(/Диктант/.test(st.m)){dicts++;   // диктант не меняли — просто отвечаем (неверно: вернётся ещё раз)
      await page.fill('#dlin','x');await page.click('#dlchk');await page.waitForTimeout(400);
    }else{ok('неизвестное задание',false,st.m);break;}
    await ev(()=>{const n=document.querySelector('#dln');n&&n.click();});await page.waitForTimeout(700);
  }
  const res=await ev(()=>({res:!!document.querySelector('.sc-result'),big:(document.querySelector('.sc-big')||{}).textContent}));
  ok('кубики были, выбор из 4 был, итог показан',builds>=1&&means>=3&&res.res,{builds,means,dicts,steps,seen,res});
  ok('ошибка в слове — слово вернулось ещё раз',means>=4,String(means));
  await shot(page,'4-end');
  ok('консоль чистая',!errs.length,errs.slice(0,5).join(' | '));
  console.log(fails?`ИТОГ: ${fails} FAIL`:'ИТОГ: всё PASS');await b.close();})();
