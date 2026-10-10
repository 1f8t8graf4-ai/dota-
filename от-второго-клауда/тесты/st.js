// стенд 13.6.3: локальный сайт (8080) + мок медиа из кэша + фейковый Telegram (CloudStorage в памяти) + воркер-стенд (8788)
const {chromium}=require('playwright');const fs=require('fs'),path=require('path'),crypto=require('crypto');
const C=path.join(__dirname,'cache');
const types={mp4:'video/webm',jpg:'image/jpeg',png:'image/png',m4a:'audio/mp4',srt:'text/plain',json:'application/json'};
function initData(id,name,token='123:TEST'){const p=new URLSearchParams();p.set('auth_date',String(Math.floor(Date.now()/1000)));p.set('user',JSON.stringify({id,first_name:name}));
  const dcs=[...p.entries()].map(([k,v])=>k+'='+v).sort().join('\n');const secret=crypto.createHmac('sha256','WebAppData').update(token).digest();
  p.set('hash',crypto.createHmac('sha256',secret).update(dcs).digest('hex'));return p.toString();}
// фейковый Telegram.WebApp — до загрузки приложения
function fakeTG(o){return `(()=>{const ev={};window.__cloud=${JSON.stringify(o.cloud||{})};window.__cloudFail=${o.cloudFail?'true':'false'};window.__sets=0;window.__gets=0;
 const CS={getItem(k,cb){window.__gets++;setTimeout(()=>{if(window.__cloudFail)return cb('NETWORK',null);cb(null,window.__cloud[k]==null?'':window.__cloud[k]);},15);},
  getItems(ks,cb){window.__gets++;setTimeout(()=>{if(window.__cloudFail)return cb('NETWORK',null);const r={};ks.forEach(k=>r[k]=window.__cloud[k]==null?'':window.__cloud[k]);cb(null,r);},15);},
  setItem(k,v,cb){window.__sets++;window.__cloud[k]=v;cb&&cb(null,true);},removeItem(k,cb){delete window.__cloud[k];cb&&cb(null,true);}};
 const noop=()=>{};
 window.Telegram={WebApp:{platform:'${o.platform||'ios'}',version:'8.0',initData:${JSON.stringify(o.initData||'')},initDataUnsafe:{user:{id:${o.uid||111},first_name:${JSON.stringify(o.name||'Тест')}}},isExpanded:true,isFullscreen:false,safeAreaInset:{},contentSafeAreaInset:{},
  ready:noop,expand:noop,close:noop,onEvent(e,f){(ev[e]=ev[e]||[]).push(f);},offEvent:noop,isVersionAtLeast:()=>true,setHeaderColor:noop,setBackgroundColor:noop,setBottomBarColor:noop,enableVerticalSwipes:noop,disableVerticalSwipes:noop,
  requestFullscreen:noop,exitFullscreen:noop,enableClosingConfirmation:noop,disableClosingConfirmation:noop,showConfirm(t,cb){cb(true);},showAlert(t,cb){cb&&cb();},openTelegramLink:noop,openLink:noop,
  BackButton:{show:noop,hide:noop,onClick:noop,offClick:noop},MainButton:{show:noop,hide:noop,setText:noop,onClick:noop,offClick:noop},
  HapticFeedback:{impactOccurred:noop,notificationOccurred:noop,selectionChanged:noop},CloudStorage:CS,__fire(e,a){(ev[e]||[]).forEach(f=>f(a));}}};})();`;}
async function open(o={}){const b=o.browser||await chromium.launch();
  const ctx=await b.newContext(Object.assign({viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:!!o.touch,isMobile:!!o.touch},o.ctx||{}));
  await ctx.route('https://telegram.org/**',r=>r.fulfill({status:200,contentType:'application/javascript',body:''}));
  await ctx.route('https://1f8t8graf4-ai.github.io/scenes/**',async r=>{const u=new URL(r.request().url());const rel=decodeURIComponent(u.pathname.replace(/^\/scenes\//,''));
    const f=path.join(C,rel.replace(/\//g,'__'));if(!fs.existsSync(f))return r.fulfill({status:404,body:'nf'});const buf=fs.readFileSync(f),ext=rel.split('.').pop(),ct=types[ext]||'application/octet-stream';
    const rg=r.request().headers()['range'];if(rg){const m=/bytes=(\d+)-(\d*)/.exec(rg);const a=+m[1],e=m[2]?Math.min(+m[2],buf.length-1):buf.length-1;
      return r.fulfill({status:206,headers:{'content-type':ct,'accept-ranges':'bytes','content-range':`bytes ${a}-${e}/${buf.length}`},body:buf.subarray(a,e+1)});}
    r.fulfill({status:200,headers:{'content-type':ct,'accept-ranges':'bytes'},body:buf});});
  await ctx.route(/https:\/\/(cdn\.cloudflare\.steamstatic\.com|unpkg\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)\//,r=>r.fulfill({status:404,body:''}));
  await ctx.route('https://dota.1f8t8graf4.workers.dev/**',async r=>{if(!o.worker)return r.fulfill({status:503,body:''});const u=new URL(r.request().url());
    try{const res=await fetch('http://127.0.0.1:8788'+u.pathname+u.search,{method:r.request().method(),headers:r.request().headers(),body:r.request().method()==='POST'?r.request().postData():undefined});
      r.fulfill({status:res.status,headers:{'content-type':res.headers.get('content-type')||'application/json','access-control-allow-origin':'*'},body:await res.text()});}catch(e){r.fulfill({status:502,body:''});}});
  if(o.tg!==false)await ctx.addInitScript(fakeTG(o));
  if(o.init)await ctx.addInitScript(o.init,o.initArg);
  const page=await ctx.newPage();const errs=[];page.on('dialog',d=>d.accept());page.on('pageerror',e=>errs.push('ERR '+e.message+' @ '+(e.stack||'').split('\n').slice(1,3).join(' | ')));
  page.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource|ERR_|net::/.test(m.text()))errs.push('CON '+m.text());});
  await page.goto('http://127.0.0.1:8080/'+(o.q||''));await page.waitForTimeout(o.wait||1500);return {b,ctx,page,errs};}
module.exports={open,initData};
