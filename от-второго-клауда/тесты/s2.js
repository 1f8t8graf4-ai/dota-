// дуэль двумя игроками на стенде воркера: немецкая сцена, ставка 25, банк — сразу
const {open,initData}=require('./st');const {chromium}=require('playwright');
const ok=(n,c,d)=>console.log(c?'PASS':'FAIL',n,d||'');
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));};
const base={onboarded:true,introV:1,gold:300,lvl:'b',tourV:1,scSubChosen:1,autoSc:false};
(async()=>{const b=await chromium.launch();
  const A=await open({browser:b,worker:true,uid:111,name:'Аня',initData:initData(111,'Аня'),wait:2500,init:seed,initArg:[Object.assign({},base,{fx:true})]});
  const B=await open({browser:b,worker:true,uid:222,name:'Боря',initData:initData(222,'Боря'),wait:2500,init:seed,initArg:[Object.assign({},base,{fx:false})]});
  await A.page.evaluate(()=>kvSheet('wolf-lunch-de',0));await A.page.waitForTimeout(500);
  await A.page.click('#kvGo');await A.page.waitForTimeout(1200);
  const code=await A.page.evaluate(()=>KV&&KV.code);ok('комната создана',!!code,code);
  await B.page.evaluate(c=>kvJoin(c),code);await B.page.waitForTimeout(1200);await B.page.click('#kvIn');
  await Promise.all([A.page.waitForSelector('.kv-q',{timeout:15000}),B.page.waitForSelector('.kv-q',{timeout:15000})]);
  const texts=[];
  async function play(P,right){for(let i=0;i<20;i++){const st=await P.evaluate(()=>({k:KV&&KV.k,n:KV&&KV.room.qs.length,q:!!document.querySelector('.kv-o button:not([disabled])'),end:!!document.querySelector('.kv-end'),wait:!!document.querySelector('.kv-waitb')}));
      if(st.end||st.wait||st.k>=st.n)return;if(!st.q){await P.waitForTimeout(300);continue;}
      const t=await P.evaluate(r=>{const q=KV.room.qs[KV.k],qt=(document.querySelector('.kv-qt')||{}).textContent||'',bs=[...document.querySelectorAll('.kv-o button')];const btn=bs.find(x=>(x.dataset.v===q.right)===r)||bs[0];btn.click();return q.t+': '+qt+' → '+btn.dataset.v;},right);
      texts.push(t);await P.waitForTimeout(1700);}}
  await Promise.all([play(A.page,true),play(B.page,false)]);
  console.log(texts.slice(0,6).join('\n'));
  const deOK=texts.filter(t=>/^(gap|mean):/.test(t)).every(t=>!/\b(the|you|is|and|what)\b/i.test(t.split('→')[0].split(': ')[1]||''));
  ok('вопросы на немецком',deOK&&texts.length>=8,texts.length+' ответов');
  await A.page.waitForSelector('.kv-end',{timeout:20000});
  const ga=await A.page.evaluate(()=>({gold:store.gold,steal:!!document.querySelector('.stl'),title:(document.querySelector('.kv-end b')||{}).textContent}));
  ok('победитель: банк начислен сразу, анимация ещё идёт',ga.gold===325,JSON.stringify(ga));
  await B.page.waitForSelector('.kv-end',{timeout:20000});await B.page.waitForTimeout(500);
  const gb=await B.page.evaluate(()=>({gold:store.gold,title:(document.querySelector('.kv-end b')||{}).textContent}));
  ok('проигравший: −25, текст без рода',gb.gold===275&&/Аня — (точнее|быстрее)/.test(gb.title),JSON.stringify(gb));
  await A.page.waitForTimeout(5000);const ga2=await A.page.evaluate(()=>store.gold);ok('после анимации банк не задвоился',ga2===325,String(ga2));
  ok('ошибок нет',A.errs.length+B.errs.length===0,A.errs.concat(B.errs).slice(0,5).join('\n'));
  await b.close();})();
