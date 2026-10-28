const {chromium}=require('playwright');const {execFileSync}=require('child_process');
(async()=>{const b=await chromium.launch();const errs=[];
 for(const [id,mid] of [['930626915','125424790'],['1840902834','']]){
  const p=await b.newPage({viewport:{width:1440,height:900}});p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/Failed to load|ERR_/.test(m.text()))errs.push(m.text())});
  await p.route('https://api.deadlock-api.com/**',async r=>{try{const out=execFileSync('curl',['-sS','-m','90',r.request().url()],{maxBuffer:256<<20});r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:out})}catch(e){r.fulfill({status:502,body:'x'})}});
  await p.route(/assets-bucket|avatars|fonts\./,r=>r.abort());
  await p.goto(`http://localhost:${process.env.PORT||8095}/restless/?id=${id}#home`);await p.waitForFunction(()=>!document.querySelector('#v .load'),null,{timeout:150000});await p.waitForTimeout(500);
  console.log(id,'ПРОФИЛЬ:',await p.$$eval('.ptags .tag',L=>L.map(e=>e.textContent+' ('+e.title+')').join(' | ')));
  let m=mid||await p.evaluate(()=>{const a=document.querySelector('a.mt');return a&&a.getAttribute('href').slice(3)});
  await p.goto(`http://localhost:${process.env.PORT||8095}/restless/?id=${id}#m/${m}`);await p.waitForFunction(()=>!document.querySelector('#v .load'),null,{timeout:150000});await p.waitForTimeout(500);
  console.log(id,'МАТЧ',m,':',await p.$$eval('.mh .ptags .tag',L=>L.map(e=>e.textContent+' ('+e.title+')').join(' | ')));
  await p.close()}
 console.log('ERR:',errs.join('\n')||'нет');await b.close()})();
