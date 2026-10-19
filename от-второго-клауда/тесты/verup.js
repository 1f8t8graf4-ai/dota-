// 13.9.36: автообновление — version.txt ≠ APP_V → одна перезагрузка, только на вкладках; без петли; hash и initData на месте; ссылка-приглашение второй раз не открывается.  ph|pc
const {open,initData}=require('./st');const {chromium}=require('playwright');
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify({admin:true,flags:{}}));};
const dev=process.argv[2]||'pc';
const base={onboarded:true,introV:1,gold:900,lvl:'b',fx:true,tourV:1,scSubChosen:1,autoSc:false,snd:false};
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
(async()=>{const b=await chromium.launch();const [vp,touch]=dev==='ph'?[{width:390,height:844},true]:[{width:1440,height:900},false];
  const run=async(ver,o={})=>{const {page,errs,ctx}=await open(Object.assign({browser:b,touch,uid:876754050,initData:initData(876754050,'Андрей'),ctx:{viewport:vp},wait:1,q:'#tgWebAppPlatform=ios&tgWebAppVersion=8.0',init:seed,initArg:[base]},o.open||{}));
    let asked=0;await page.route('**/version.txt*',r=>{asked++;r.fulfill({status:200,contentType:'text/plain',body:ver==null?'':ver+'\n'});});
    const navs=[];page.on('framenavigated',f=>{if(f===page.mainFrame())navs.push(f.url());});
    return {page,errs,ctx,navs,asked:()=>asked};};
  const APP_V=await (async()=>{const r=await run(null);await r.page.waitForTimeout(1500);const v=await r.page.evaluate(()=>APP_V);await r.ctx.close();return v;})();
  // 1. та же версия — не перезагружаем
  {const r=await run(APP_V);await r.page.waitForTimeout(4000);ok('та же версия: version.txt спрошен',r.asked()>=1,r.asked());ok('та же версия: перезагрузки нет',r.navs.length===0,r.navs);await r.ctx.close();}
  // 2. новая версия на Главной — одна перезагрузка, hash на месте, initData есть, петли нет
  {const r=await run('99.9.1');await r.page.waitForTimeout(6000);
    const u=r.navs;ok('новая версия: одна перезагрузка',u.length===1&&/[?&]r=\d+/.test(u[0]),r.navs);
    ok('hash сохранён',/#tgWebAppPlatform=/.test(u[0]||''),u[0]);
    const st=await r.page.evaluate(()=>({init:!!(Telegram.WebApp.initData),mark:sessionStorage.getItem('__ver_r'),seed:!!sessionStorage.getItem('__seeded'),scr:screen}));
    ok('после перезагрузки initData есть',st.init,st);ok('метка версии стоит',st.mark==='99.9.1',st);
    await r.page.evaluate(()=>{VER.at=0;verCheck();});await r.page.waitForTimeout(3000);ok('второй раз на ту же версию не перезагружаем',r.navs.length===1,r.navs);
    await r.page.screenshot({path:`${__dirname}/verup-${dev}-home.png`});
    ok('консоль чистая',!r.errs.length,r.errs.slice(0,4).join(' | '));await r.ctx.close();}
  // 3. в эпизоде не перезагружаем; вернулись на вкладку — перезагрузка
  {const r=await run('99.9.2');await r.page.waitForTimeout(800);await r.page.evaluate(()=>renderScEp('wolf-of-wall-street',0));await r.page.waitForTimeout(6000);
    ok('в эпизоде перезагрузки нет',r.navs.length===0,r.navs);const w=await r.page.evaluate(()=>VER.want);ok('новая версия замечена',w==='99.9.2',w);
    await r.page.evaluate(()=>renderTab('learn'));await r.page.waitForTimeout(6500);ok('вернулся на вкладку — перезагрузка',r.navs.length===1,r.navs);await r.ctx.close();}
  // 4. открытое окно (момент из фильма) — ждём, пока закроют
  {const r=await run('99.9.3');await r.page.waitForTimeout(800);await r.page.evaluate(()=>{const s=scOf('wolf-of-wall-street');momOpen(s.id,0,s.parts[0].ph[0].a+0.05);});await r.page.waitForTimeout(5500);
    ok('открыт момент — перезагрузки нет',r.navs.length===0,r.navs);await r.page.evaluate(()=>{document.querySelectorAll('.momo').forEach(x=>x.remove());});await r.page.waitForTimeout(5000);ok('окно закрыли — перезагрузка',r.navs.length===1,r.navs);await r.ctx.close();}
  // 5. ссылка-приглашение (Фраза дня) после перезагрузки второй раз не открывается
  {const r=await run('99.9.4',{open:{q:'?tgWebAppStartParam=dp_wolf-of-wall-street_0_0#tgWebAppPlatform=ios'}});await r.page.waitForTimeout(800);
    await r.page.waitForTimeout(700);const s0=await r.page.evaluate(()=>START);
    await r.page.evaluate(()=>{document.querySelectorAll('.momo').forEach(x=>x.remove());});await r.page.waitForTimeout(6500);
    const s1=await r.page.evaluate(()=>({START,mo:!!document.querySelector('.momo')}));
    ok('после перезагрузки START пустой и момент не открылся',r.navs.length===1&&s1.START===''&&!s1.mo,{s0,s1,navs:r.navs.length});await r.ctx.close();}
  // 6. version.txt пустой или не тот формат — ничего не делаем
  {const r=await run('<html>');await r.page.waitForTimeout(4000);ok('мусор в version.txt — перезагрузки нет',r.navs.length===0,r.navs);await r.ctx.close();}
  console.log(fails?`ИТОГ: ${fails} FAIL`:'ИТОГ: всё PASS');await b.close();})();
