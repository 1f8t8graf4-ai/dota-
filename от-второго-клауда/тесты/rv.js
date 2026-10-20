// 13.9.40 (Андрей: «после эпизода накидали приколов — раздели»): разбор после досмотра — сверху 4 карточки «по ним будут задания»,
// ниже «Все реплики эпизода» свёрнуты и раскрываются; ▶ у карточки играет кусок фразы; без рамок «★ Будет в заданиях» внутри строк.
// Плюс метки фраз на шкале — по длине видео. node rv.js ph|pc
const {open}=require('./st');const {chromium}=require('playwright');
const dev=process.argv[2]||'ph';
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
const init=([st])=>{if(!sessionStorage.getItem('__seeded')){sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify({admin:true,flags:{}}));}};
const base={onboarded:true,introV:1,unl:1,snd:false,fx:true,wtapHint:1,lvl:'b',tourV:1,scSubChosen:1,autoSc:false,look:'nd',lookV:2};
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const pc=dev==='pc';
  const {page:P,errs}=await open({browser:b,uid:876754050,touch:!pc,ndDefault:true,ctx:{viewport:pc?{width:1440,height:900}:{width:390,height:844},colorScheme:'dark'},wait:2500,init,initArg:[base]});
  await P.evaluate(()=>{const P=scP('wolf-of-wall-street');P.w[0]=1;scSave&&scSave();renderScEp('wolf-of-wall-street',0);});await P.waitForTimeout(1600);
  let r=await P.evaluate(()=>{const c=document.querySelectorAll('.rv-cd'),all=document.querySelector('details.rv-all');
    return {cards:c.length,ph:document.querySelectorAll('.rv-ph').length,open:all&&all.open,lines:all?all.querySelectorAll('.rv-ln').length:0,go:!!document.getElementById('epGoQ')};});
  ok('разбор: сверху карточки фраз (до 4), «Все реплики» свёрнуты, рамок внутри строк нет, кнопка «К заданиям»',r.cards>0&&r.cards<=4&&!r.ph&&r.open===false&&r.lines>5&&r.go,r);
  await P.screenshot({path:__dirname+`/shots/rv-${dev}-1.png`});
  await P.evaluate(()=>{window.__seg=null;const o=playSeg;playSeg=function(u,a,b2){window.__seg=[a,b2];return o.apply(this,arguments);};});
  await P.click('.rv-cd .rv-play');await P.waitForTimeout(300);
  r=await P.evaluate(()=>{const s=scOf('wolf-of-wall-street'),p=s.parts[0],f=scAct(p.ph).slice().sort((a,b)=>a.a-b.a)[0];return {seg:window.__seg,want:[f.a-p.a,f.b-p.a],cnt:document.getElementById('rvCnt').textContent};});
  ok('▶ у карточки — играет кусок этой фразы, счётчик «1 из N»',r.seg&&Math.abs(r.seg[0]-r.want[0])<0.2&&Math.abs(r.seg[1]-r.want[1])<0.3&&/^1 из/.test(r.cnt),r);
  await P.click('details.rv-all>summary');await P.waitForTimeout(300);
  r=await P.evaluate(()=>{const a=document.querySelector('details.rv-all');return {open:a.open,vis:a.querySelector('.rv-ln').getBoundingClientRect().height>0};});
  ok('«Все реплики» раскрываются',r.open&&r.vis,r);await P.screenshot({path:__dirname+`/shots/rv-${dev}-2.png`,fullPage:false});
  // метки на шкале — по длине видео
  await P.evaluate(()=>{const P=scP('titanic-boat');renderScEp('titanic-boat',0);});await P.waitForTimeout(1800);
  r=await P.evaluate(()=>{const s=scOf('titanic-boat'),p=s.parts[0],d=SV&&SV.duration,M=[...document.querySelectorAll('.n-tlm')].map(m=>parseFloat(m.style.left));
    const want=scAct(p.ph).map(f=>(f.a-p.a)/(d>1?d:p.b-p.a)*100).filter(x=>x>=0&&x<=100);return {d,M,want};});
  ok('метки фраз на шкале — по длине видео',r.M.length===r.want.length&&r.M.every((x,k)=>Math.abs(x-r.want[k])<0.6),r);
  ok('консоль чистая',!errs.length,errs.slice(0,4).join(' | '));
  console.log(fails?`ИТОГ ${dev}: ${fails} FAIL`:`ИТОГ ${dev}: всё PASS`);await b.close();})();
