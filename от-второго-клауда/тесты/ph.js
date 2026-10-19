// 13.9.32: аналитика PostHog. Подменяем us.i.posthog.com (запросы пишем), библиотеку берём из cache/ph-array.js (иначе — из сети).
// Проверяем: грузится после старта, игрок = Telegram ID, экраны — $pageview «/экран», события ev() и премиум уходят,
// (браузер стенда — с обычным user-agent и navigator.webdriver=false: иначе PostHog считает его ботом и молчит)
// tgWebAppData (имя, ник, подпись) убрана из адреса и ни в один запрос не попала; без Telegram — ни одного запроса. ph|pc
const {open,initData}=require('./st');const {chromium}=require('playwright');const fs=require('fs'),path=require('path'),zlib=require('zlib');
const dev=process.argv[2]||'pc';
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));};
const base={onboarded:true,introV:1,gold:900,lvl:'b',fx:true,tourV:1,scSubChosen:1,snd:false};
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
const LIB=path.join(__dirname,'cache/ph-array.js');
async function run(b,o){const reqs=[];const {page,ctx,errs}=await open(Object.assign({browser:b,touch:dev==='ph',ctx:{userAgent:dev==='ph'?'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',viewport:dev==='ph'?{width:390,height:844}:{width:1440,height:900}},wait:400,init:seed,initArg:[base]},o));
  await ctx.route(/us-assets\.i\.posthog\.com\/static\/array\.js/,r=>fs.existsSync(LIB)?r.fulfill({status:200,contentType:'application/javascript',body:fs.readFileSync(LIB)}):r.continue());
  await ctx.route(/us-assets\.i\.posthog\.com\/(array|static)\/(?!array\.js)/,r=>r.fulfill({status:404,body:''}));
  await ctx.route(/us\.i\.posthog\.com\//,r=>{const q=r.request();let body=q.postDataBuffer()||Buffer.alloc(0),txt='';
    try{txt=(body[0]===0x1f&&body[1]===0x8b)?zlib.gunzipSync(body).toString():body.toString();if(/^data=/.test(txt))txt=Buffer.from(decodeURIComponent(txt.slice(5)),'base64').toString();}catch(e){txt=body.toString();}
    reqs.push({url:q.url(),txt});r.fulfill({status:200,contentType:'application/json',body:'{"status":1}'});});
  await ctx.addInitScript(()=>{try{Object.defineProperty(Navigator.prototype,'webdriver',{get:()=>false});Object.defineProperty(Navigator.prototype,'userAgentData',{get:()=>undefined});}catch(e){}});   // иначе PostHog видит робота (webdriver, бренд HeadlessChrome) и молчит
  await page.reload();return {page,ctx,errs,reqs};}
(async()=>{const b=await chromium.launch();
  const uid=555123,hash='#tgWebAppData='+encodeURIComponent('user='+encodeURIComponent(JSON.stringify({id:uid,first_name:'Секретное',username:'nick_secret'}))+'&auth_date=1&hash=deadbeef')+'&tgWebAppVersion=8.0&tgWebAppPlatform=tdesktop';
  const A=await run(b,{uid,name:'Секретное',initData:initData(uid,'Секретное'),q:hash});const p=A.page;
  ok('до 2,5 с PostHog не грузится',!(await p.evaluate(()=>!!(window.posthog&&window.posthog.__loaded))));
  await p.waitForTimeout(3500);
  ok('загрузился и вошёл',await p.evaluate(()=>!!(window.posthog&&window.posthog.__loaded&&PH.ok)));
  ok('игрок = Telegram ID',await p.evaluate(()=>window.posthog.get_distinct_id())===String(uid));
  ok('tgWebAppData убрана из адреса, остальное на месте',await p.evaluate(()=>!/tgWebAppData/.test(location.hash)&&/tgWebAppPlatform=tdesktop/.test(location.hash)),await p.evaluate(()=>location.hash));
  ok('Telegram initData цела',await p.evaluate(()=>!!Telegram.WebApp.initData));
  await p.evaluate(()=>renderTab('kino'));await p.waitForTimeout(300);await p.evaluate(()=>renderTab('kino'));await p.evaluate(()=>{ev('ep_quiz','wolf-of-wall-street');renderPaywall('rev');});await p.waitForTimeout(300);
  await p.evaluate(()=>renderTab('learn'));await p.waitForTimeout(6000);
  const all=A.reqs.map(r=>r.txt).join('\n');
  ok('запросы в PostHog ушли',A.reqs.length>0,A.reqs.length);
  ok('экран Кино — $pageview /home/kino (один раз)',(all.match(/"\$pathname":"\/home\/kino"/g)||[]).length===1,(all.match(/"\$pathname":"[^"]+"/g)||[]).slice(0,8));
  ok('событие ep_quiz со сценой',/"event":"ep_quiz"/.test(all)&&/wolf-of-wall-street/.test(all));
  ok('премиум: prem_view',/"event":"prem_view"/.test(all));
  ok('ни имени, ни ника, ни подписи',!/Секретное|nick_secret|deadbeef|tgWebAppData/.test(all+A.reqs.map(r=>r.url).join(' ')));
  ok('админ помечен только у админа',/"is_admin":false/.test(all));
  const e=A.errs.filter(x=>!/favicon|Failed to load/.test(x));ok('консоль чистая',e.length===0,e.slice(0,3));
  await A.ctx.close();
  // без Telegram-игрока — ничего
  const B=await run(b,{tg:false});await B.page.waitForTimeout(3500);
  ok('без Telegram — PostHog не грузится и запросов нет',!(await B.page.evaluate(()=>!!window.posthog))&&B.reqs.length===0,B.reqs.length);
  await b.close();console.log(fails?`FAILS: ${fails}`:'ALL PASS');process.exit(fails?1:0);})();
