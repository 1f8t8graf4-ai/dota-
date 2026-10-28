const {chromium}=require('playwright');const {execFileSync}=require('child_process');
const W=process.argv[2]||'pc',O=process.argv[3],ID=process.argv[4]||'930626915',MID=process.argv[5]||'125424790',SK=process.argv[6]||'labs';
const col=u=>{let h=0;for(const c of u)h=(h*31+c.charCodeAt(0))>>>0;return `hsl(${h%360},45%,38%)`};
(async()=>{const b=await chromium.launch();const vp=W==='ph'?{width:390,height:844}:{width:1440,height:900};
 const p=await b.newPage({viewport:vp});const errs=[];p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
 const svg=(u,w,h)=>{const n=decodeURIComponent(u.split('/').pop().split('?')[0]).replace(/\.(webp|png|svg)$/,'');return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="${col(n)}"/></svg>`};
 await p.route('https://api.deadlock-api.com/**',async r=>{const u=r.request().url();try{const out=execFileSync('curl',['-sS','-m','90',u],{maxBuffer:256<<20});r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:out})}catch(e){r.fulfill({status:502,body:'x'})}});
 await p.route('https://assets-bucket.deadlock-api.com/**',r=>r.fulfill({status:200,contentType:'image/svg+xml',body:svg(r.request().url(),64,64)}));
 await p.route(/avatars|fonts\./,r=>r.abort());
 await p.addInitScript(s=>{try{localStorage.setItem('rl-skin',s)}catch(e){}},SK);
 await p.goto(`http://localhost:${process.env.PORT||8095}/restless/?id=${ID}#m/${MID}`);await p.waitForFunction(()=>!document.querySelector('#v .load'),null,{timeout:150000}).catch(()=>{});await p.waitForTimeout(800);
 console.log((await p.evaluate(()=>document.querySelector('#v').innerText.slice(0,1500))).replace(/\n+/g,' | '));
 if(await p.$('#mt')){await p.$eval('#mt',e=>{e.value=1200;e.dispatchEvent(new Event('input'))});await p.waitForTimeout(400);console.log('dots:',await p.$$eval('#mmap .hd',L=>L.map(e=>e.style.left.slice(0,5)+','+e.style.top.slice(0,5)).join(' ')))}
 await p.screenshot({path:`${O}/${SK}-${W}-match.png`,fullPage:true});
 console.log('вбок:',await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));
 console.log('ERRORS:',errs.filter(e=>!/Failed to load resource|ERR_FAILED/.test(e)).join('\n')||'нет');await b.close()})();
