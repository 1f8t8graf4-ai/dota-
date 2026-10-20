// 13.9.38: задание «Моё слово · что значит?» (Андрей: «дичь с заданиями» — у class два верных, варианты словарём, «▶ фильм» выдаёт ответ)
// ответ = значение «тут»; варианты — без значений этого же слова и без общего слова с ответом; без «;» и скобок; «▶ фильм» — после ответа;
// «Дальше» не наезжает на ответ. Плюс массовая проверка вариантов на словах всех сцен.  ph|pc [light|dark]
const {open}=require('./st');const {chromium}=require('playwright');
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify({admin:true,flags:{}}));};
const dev=process.argv[2]||'ph',TH=process.argv[3]||'dark';
const now=Date.now()-1000,L1='Late. Aerobics class. Sorry. Any messages?',L1r='Опаздываешь. — Аэробика. Извини.\nМне звонили?';
const W=(w,ru,line,lineRu,a)=>({k:'american-psycho|'+w,w,ru,de:'',sid:'american-psycho',pi:0,line,lineRu,a,at:now,lvl:0,st:0,due:now});
const myw={};[W('aerobics','аэробика',L1,L1r,30.28),W('class','занятие, тренировка (групповая)',L1,L1r,30.28),W('messages','сообщения',L1,L1r,30.28),W('tan','загар','Good morning, Hamilton. Nice tan.','Доброе утро, Гамильтон. Отличный загар.',20.34)].forEach(x=>myw[x.k]=x);
const base={onboarded:true,introV:1,gold:900,lvl:'b',fx:true,tourV:1,scSubChosen:1,autoSc:false,snd:false,look:'nd',lookV:2,myw,unl:1};
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
(async()=>{const b=await chromium.launch();const vp=dev==='pc'?{width:1440,height:900}:{width:390,height:844};
  const {page,errs}=await open({browser:b,touch:dev!=='pc',uid:876754050,ndDefault:true,ctx:{viewport:vp,colorScheme:TH},wait:2500,init:seed,initArg:[base]});
  const ev=(f,a)=>page.evaluate(f,a);
  await ev(()=>renderDaily());await page.waitForTimeout(1200);
  const seen={};
  for(let step=0;step<6;step++){
    const st=await ev(()=>{const h=document.querySelector('.dl-q h2'),m=document.querySelector('.dl-q .sc-meta');if(!m||!/Моё слово/.test(m.textContent))return null;
      const w=h.childNodes[0].textContent.trim(),it=Object.values(store.myw).find(x=>x.w===w);
      return {w,right:mywHere(it),own:[...mywOwn(it)],opts:[...document.querySelectorAll('.sc-opt')].map(x=>x.dataset.v),mom:!!document.querySelector('#dlmom:not([hidden])'),line:it.line};});
    if(!st)break;if(seen[st.w])break;seen[st.w]=1;
    const stems=v=>String(v).toLowerCase().replace(/ё/g,'е').split(/[^а-яa-z]+/).filter(t=>t.length>=4).map(t=>t.slice(0,Math.max(4,t.length-2)));
    const others=st.opts.filter(v=>v!==st.right),st0=new Set([...stems(st.right),...st.own.flatMap(stems)]);
    ok(`«${st.w}»: 4 варианта, один верный («${st.right}»)`,st.opts.length===4&&st.opts.filter(v=>v===st.right).length===1,st.opts);
    ok(`«${st.w}»: среди неверных нет значений этого же слова и общего слова с ответом`,others.every(v=>!st.own.includes(v.toLowerCase())&&!stems(v).some(t=>st0.has(t))),{others,own:st.own});
    ok(`«${st.w}»: варианты без «;», «/» и скобок`,st.opts.every(v=>!/[;()\/]/.test(v)),st.opts);
    ok(`«${st.w}»: «▶ фильм» до ответа спрятан`,!st.mom);
    if(st.w==='class')ok('«class» — ответ «занятие» (значение тут), а не словарное',st.right==='занятие',st.right);
    if(step===0)await page.screenshot({path:`${__dirname}/shots/myq-${dev}-${TH}-1-task.png`});
    // ответ — неверный, если можно (проверяем подсветку верного и разбор)
    await ev(r=>{const B=[...document.querySelectorAll('.sc-opt')];(B.find(x=>x.dataset.v!==r)||B[0]).click();},st.right);await page.waitForTimeout(500);
    const fb=await ev(()=>{const mb=document.querySelector('#dlmom'),n=document.querySelector('#dln'),ru=document.querySelector('#dlfb .sc-fb .ru')||document.querySelector('#dlfb .sc-fb .en');
      n&&n.scrollIntoView({block:'center'});const a=n.getBoundingClientRect(),c=ru.getBoundingClientRect();
      return {mom:!!(mb&&!mb.hidden),okv:(document.querySelector('.sc-opt.ok')||{}).dataset?.v,over:!(a.bottom<=c.top+1||a.top>=c.bottom-1),en:(document.querySelector('#dlfb .en')||{}).textContent};});
    ok(`«${st.w}»: после ответа — «▶ фильм», подсвечен верный, «Дальше» не наезжает на перевод`,fb.mom&&fb.okv===st.right&&!fb.over&&fb.en.includes(st.right),fb);
    if(step===0)await page.screenshot({path:`${__dirname}/shots/myq-${dev}-${TH}-2-answer.png`});
    const ln=await ev(()=>{const q=document.querySelector('.dl-q .qsm');return q?q.textContent:'';});
    await page.click('#dln');await page.waitForTimeout(700);
    const nl=await ev(()=>{const m=document.querySelector('.dl-q .sc-meta');return m&&/Моё слово/.test(m.textContent)&&document.querySelector('.dl-q .qsm')?document.querySelector('.dl-q .qsm').textContent:'';});
    if(nl&&ln)ok(`после «${st.w}» — слово из другой реплики (не подряд одна и та же)`,nl!==ln||Object.keys(seen).length>=3,{ln,nl});
  }
  ok('прошли задания со словами',Object.keys(seen).length>=3,Object.keys(seen));
  // массово: случайные слова всех сцен как «мои слова» — варианты по правилам
  const mass=await ev(async()=>{await cxLoad('en');await cxLoad('de');const bad=[],R=[];let n=0;
    const stems=v=>String(v).toLowerCase().replace(/ё/g,'е').split(/[^а-яa-z]+/).filter(t=>t.length>=4).map(t=>t.slice(0,Math.max(4,t.length-2)));
    for(const s of SCENES){const A=CX[wiLang(s.id)]&&CX[wiLang(s.id)][s.id];if(!A)continue;const subs=s.subs||[];
      for(let k=0;k<subs.length&&n<900;k+=3){const e=A[k];if(!e||!e[1])continue;const W=Object.keys(e[1]).filter(w=>e[1][w]&&e[1][w]!=='—'&&w.length>=4);if(!W.length)continue;
        const w=W[k%W.length],r=subs[k],pi=Math.max(0,s.parts.findIndex(p=>r[0]>=p.a&&r[0]<p.b));
        const it={k:s.id+'|'+w,w,ru:GLOSS[w]||e[1][w],sid:s.id,pi,line:r[2],lineRu:r[3],a:r[0]};n++;
        const right=mywHere(it),O=mywOpts(it),own=mywOwn(it),st0=new Set([...stems(right),...[...own].flatMap(stems)]),oth=O.filter(v=>v!==right);
        const why=O.filter(v=>v===right).length!==1?'нет/два верных':O.length<3?'мало вариантов':O.some(v=>/[;()\/]/.test(v))?'скобки/;':oth.some(v=>own.has(v.toLowerCase()))?'значение этого слова':oth.some(v=>stems(v).some(t=>st0.has(t)))?'общее слово':'';
        if(why)bad.push(s.id+'@'+k+' '+w+': '+why+' → '+O.join(' | '));else if(R.length<6)R.push(w+' — '+right+': '+O.join(' | '));}}
    return {n,bad:bad.slice(0,12),nb:bad.length,R};});
  ok(`массово: ${mass.n} слов из всех сцен — варианты по правилам (плохих ${mass.nb})`,mass.n>300&&mass.nb<=Math.round(mass.n*0.01),mass.bad);
  console.log('  примеры:',mass.R.join('\n           '));
  ok('консоль чистая',!errs.length,errs.slice(0,5).join(' | '));
  console.log(fails?`ИТОГ: ${fails} FAIL`:'ИТОГ: всё PASS');await b.close();})();
