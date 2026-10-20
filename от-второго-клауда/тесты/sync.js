// 13.9.40: субтитры и фразы по голосу (tools/sub_sync.py), SUB_LAG 0.05, караоке только при найденном голосе,
// метки фраз — точки над шкалой по длительности видео, разбор после эпизода из двух частей.  node sync.js ph|pc
const {open}=require('./st');const {chromium}=require('playwright');const {execSync}=require('child_process');
const dev=process.argv[2]||'ph';
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify({admin:true,flags:{}}));};
const base={onboarded:true,introV:1,look:'nd',lookV:2,unl:1,snd:false,lvl:'b',cefr:'B1',tourV:1,scSubChosen:1,autoSc:false,wtapHint:1,scPause:'off',fx:true};
(async()=>{
  // данные: строки уже стоят по голосу — повторный прогон ничего не сдвигает
  let out='';try{out=execSync('python3 tools/sub_sync.py --dry',{cwd:__dirname+'/../..',encoding:'utf8'});}catch(e){out=String(e.stdout||'');}
  const m=/было (\d+)%, стало (\d+)%/.exec(out);
  ok('данные: строк в ±0,15 с от голоса ≥ 95 % (sub_sync уже применён)',m&&+m[1]>=95,m&&m[0]);
  const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const pc=dev==='pc';
  const {page:P,errs}=await open({browser:b,touch:!pc,uid:876754050,ndDefault:true,ctx:{viewport:pc?{width:1440,height:900}:{width:390,height:844},colorScheme:'dark'},wait:2500,init:seed,initArg:[base]});
  await P.evaluate(()=>renderScEp('wolf-of-wall-street',0));await P.waitForTimeout(1500);
  let r=await P.evaluate(()=>SUB_LAG);ok('SUB_LAG = 0.05',r===0.05,r);
  // строка появляется через 0.06 с после своего начала
  await P.evaluate(async()=>{SV.muted=true;await SV.play().catch(()=>{});SV.pause();});
  const row=await P.evaluate(()=>{const L=SV._loc.filter(x=>String(x[2]).split(/\s+/).length>=4);return L[2]||L[0];});
  await P.evaluate(t=>{SV.currentTime=t+0.07;},row[0]);await P.waitForTimeout(400);
  r=await P.evaluate(()=>(document.querySelector('.sc-subs .sline:not(.s2)')||{}).textContent||'');
  ok('строка видна сразу после начала (без опоздания)',r.replace(/\s+/g,' ').trim().startsWith(String(row[2]).split(/\s+/)[0]),{r,row:row.slice(0,3)});
  // метки: точки над шкалой, место — по длительности видео
  await P.waitForFunction(()=>SV&&isFinite(SV.duration)&&SV.duration>1,null,{timeout:8000}).catch(()=>{});
  r=await P.evaluate(()=>{const s=scOf('wolf-of-wall-street'),p=s.parts[0],d=SV.duration,M=[...document.querySelectorAll('.n-tlm')],f=scAct(p.ph).filter(x=>(x.a-p.a)/d>=0&&(x.a-p.a)/d<=1)[0];
    const m=M[0],cs=m&&getComputedStyle(m),bar=document.querySelector('#scsk').getBoundingClientRect(),mr=m&&m.getBoundingClientRect();
    return {n:M.length,left:m&&parseFloat(m.style.left),want:f&&+((f.a-p.a)/d*100).toFixed(2),w:mr&&Math.round(mr.width),h:mr&&Math.round(mr.height),above:mr&&mr.bottom<=bar.top+bar.height/2+0.5,rad:cs&&cs.borderRadius};});
  ok('метки фраз — круглые точки над серединой шкалы',r.n>0&&r.w===r.h&&r.above&&/50%/.test(r.rad),r);
  ok('метка стоит на начале фразы по длительности видео',Math.abs(r.left-r.want)<0.05,r);
  // караоке: голос строки не найден — строка горит целиком, классов kara/kk-on нет
  r=await P.evaluate(()=>{WTD['wolf-of-wall-street']=[[0,0.1,'zzz']];const box=document.querySelector('.sc-subs');box.dataset.id='';SV.currentTime=SV.currentTime+0.001;return new Promise(z=>setTimeout(()=>z({kara:box.classList.contains('kara'),on:box.querySelectorAll('.kk-on').length,kw:box._kw}),400));});
  ok('голос строки не найден — без караоке, строка целиком',!r.kara&&!r.on&&!r.kw,r);
  // разбор после эпизода: 4 карточки сверху, «Все реплики» свёрнуты
  await P.evaluate(()=>{const s=scOf('wolf-of-wall-street');scP(s.id).w[0]=1;scSave();renderScEp(s.id,0);});await P.waitForTimeout(1500);
  r=await P.evaluate(()=>{const c=document.querySelectorAll('.rv2 .rv-c'),d=document.querySelector('.rv2 .rv-all');
    return {cards:c.length,head:(document.querySelector('.rv2 .rv-head b')||{}).textContent,tr:[...c].every(x=>x.querySelector('.rv-t>span').textContent.length>0),play:[...c].every(x=>x.querySelector('.rv-play')),
      open:d&&d.open,sum:d&&d.querySelector('summary').textContent,rows:d&&d.querySelectorAll('.rv-ln').length,go:!!document.querySelector('#epGoQ')};});
  ok('разбор: «Будут в заданиях · 4», 4 карточки с переводом и ▶',r.cards===4&&/Будут в заданиях · 4/.test(r.head)&&r.tr&&r.play,r);
  ok('разбор: «Все реплики эпизода · N» свёрнуты, внизу «К заданиям»',r.open===false&&/Все реплики эпизода · \d+/.test(r.sum)&&r.rows>4&&r.go,r);
  await P.click('.rv2 .rv-all summary');await P.waitForTimeout(300);
  r=await P.evaluate(()=>{const v=[...document.querySelectorAll('.rv2 .rv-all .rv-ln')].filter(x=>x.getBoundingClientRect().height>0);return {n:v.length,img:document.querySelectorAll('.rv2 .rv-all img').length};});
  ok('раскрыл — реплики строками без кадров',r.n>4&&!r.img,r);
  await P.screenshot({path:__dirname+'/shots/sync-'+dev+'-review.png',fullPage:false});
  await P.click('#epGoQ');await P.waitForTimeout(1200);
  r=await P.evaluate(()=>!!document.querySelector('.sc-q'));ok('«К заданиям» → проверка',r);
  ok('консоль чистая',!errs.length,errs.slice(0,4).join(' | '));
  await b.close();console.log(fails?`FAIL ${fails}`:'ALL PASS');process.exit(fails?1:0);})();
