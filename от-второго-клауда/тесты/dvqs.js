// 13.9.67: образцы вопросов Versus по всем живым диалогам (по 3 раза) — посмотреть глазами, что собирает dvMakeQs. node dvqs.js
const {open}=require('./st');const {chromium}=require('playwright');
const seed=([st])=>{if(!sessionStorage.getItem('__seeded')){sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));}};
(async()=>{const b=await chromium.launch();const A=await open({browser:b,uid:111,name:'Аня',wait:2200,init:seed,initArg:[{onboarded:true,introV:1,unl:1,look:'nd',lookV:2}]});
  const r=await A.page.evaluate(()=>{const out=[];dvDialogs().forEach(D=>{for(let n=0;n<3;n++){const qs=dvMakeQs(D.d,[D.A.name,D.B.name]);out.push(D.d.ctx+' | '+qs.map(q=>q.t==='build'?`BUILD[${q.ex?'ex '+q.ex.ru:''}] ${q.en} → ${q.tk.join(' ')} + ${q.pool.filter(w=>!q.tk.includes(w)).join(',')}`:q.t==='mean'?`MEAN «${q.w}» ${q.opts.join(' / ')} (=${q.right})`:`HEAR ${q.opts.join(' | ')}`).join('\n   '));}});return out;});
  console.log(r.join('\n'));console.log(A.errs.join('\n'));await b.close();})();
