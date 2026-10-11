// 13.9.5: «Мои фразы и слова» — один экран: «Повторить сегодня», темы-раскрывашки, внизу «Все», у строк #фильм → страница фильма,
// «‹» настоящим кликом, окно фразы с «Подробнее», окошко слова без дубля, слова по темам и A–Z, поиск; ph|pc
const {open}=require('./st');const {chromium}=require('playwright');
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify({admin:true,flags:{}}));};
const bb=()=>{window.__bb=[];const W=window.Telegram&&Telegram.WebApp;if(W)W.BackButton={show(){window.__bb.push(1);},hide(){window.__bb.push(0);},onClick(){},offClick(){}};};
const dev=process.argv[2]||'ph';
const base={onboarded:true,introV:1,gold:900,lvl:'b',fx:true,tourV:1,scSubChosen:1,autoSc:false,age18:true,dictVar:'kino',dlDemo:false,snd:false};
const shot=(p,n)=>p.screenshot({path:`${__dirname}/km-${dev}-${n}.png`});
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const [vp,touch]=dev==='ph'?[{width:390,height:844},true]:[{width:1440,height:900},false];
  const {page,ctx,errs}=await open({browser:b,touch,uid:876754050,ctx:{viewport:vp},wait:2500,init:seed,initArg:[base]});await ctx.addInitScript(bb);await page.reload();await page.waitForTimeout(2500);
  const ev=(f,a)=>page.evaluate(f,a);const click=async s=>{const l=page.locator(s).first();await l.scrollIntoViewIfNeeded();await l.click();};
  await ev(()=>{const now=Date.now();let n=0;
    for(const [id,pi,k] of [['wolf-of-wall-street',0,6],['american-psycho',0,4],['clavicular-impaulsive',0,3],['taxi-driver-lonely',1,2]]){const s=scOf(id),P=scP(id);P.got=P.got||{};P.w[pi]=1;
      scAct(s.parts[pi].ph).slice(0,k).forEach(f=>{n++;P.got[f.id]=now-n*6e4;P.m[f.id]=n%5===0?3:1;P.r[f.id]=n%4===0?[1,now-1000]:[1,now+864e5*2];});}
    scSave();store.myw={};const add=(k,w,ru,sid,pi,a,st,due,tags)=>{const s=scOf(sid),r=s&&s.subs.find(z=>Math.abs(z[0]-a)<0.06);store.myw[k]={k,w,ru,de:'',sid,pi,line:r?r[2]:'',lineRu:r?r[3]:'',a,at:now-st*1000,lvl:0,st,due,tags:tags||[]};};
    add('wolf-of-wall-street|clients','clients','клиенты','wolf-of-wall-street',0,21,1,now-1000,['работа']);add('wolf-of-wall-street|function','function','работать','wolf-of-wall-street',0,4.96,0,now+864e5*3);
    add('american-psycho|tan','tan','загар','american-psycho',0,20.34,2,now+864e5,['внешность']);add('american-psycho|occasionally','occasionally','иногда','american-psycho',0,36.82,0,now-5000);
    store.myw['own|deadline']={k:'own|deadline',w:'deadline',ru:'срок сдачи',de:'',sid:'own',pi:0,line:'',lineRu:'',a:0,at:now-9e4,lvl:0,st:1,due:now+864e5*2,own:true,tags:['работа']};save();});
  // старый выбор вида (13.9.2–13.9.4) больше ни на что не влияет
  await ev(()=>{DX.seg='my';store.knMyKind='ph';store.knMyV='book';renderTab('dict');});await page.waitForFunction(()=>window.DL&&document.querySelector('#dlStage'),null,{timeout:15000});await page.waitForTimeout(1500);
  let r=await ev(()=>({lvl:$('#dlStage').dataset.lvl,pill:!!document.querySelector('[data-mvp]'),old:document.querySelectorAll('.kma-c,.kmb-h,.kmb-rail,#kaBar,.ka-v').length,due:!!document.querySelector('.kmb-due'),
    topics:[...document.querySelectorAll('.km5-th b')].map(x=>x.textContent),all:document.querySelectorAll('.km5-all .km5-q').length,nPh:+document.querySelector('[data-mk="ph"] i').textContent,tags:document.querySelectorAll('.km5-all .km5-tg[data-tg]').length,bb:window.__bb.slice(-1)[0],sw2:document.documentElement.scrollWidth,iw:innerWidth}));
  ok('один экран: без пилюли вида и Альбомов/Разговорника; «Повторить сегодня», темы, «Все» с #фильм; «назад» Телеграма спрятана',
    r.lvl==='my'&&!r.pill&&!r.old&&r.due&&r.topics.length>=2&&r.all===r.nPh&&r.nPh>10&&r.tags===r.all&&r.bb===0&&r.sw2<=r.iw,r);
  await shot(page,'1-main');
  // темы — свёрнуты; нажал — раскрылись фразы, «Тренировать», «▶ подряд»; ещё раз — свернулись
  r=await ev(()=>document.querySelectorAll('.km5-t.on').length);ok('темы изначально свёрнуты',r===0,String(r));
  await click('.km5-th');await page.waitForTimeout(600);
  r=await ev(()=>{const t=document.querySelector('.km5-t.on');return t?{rows:t.querySelectorAll('.km5-q').length,n:+t.querySelector('.km5-th small').textContent,tr:!!t.querySelector('[data-mtr]'),pl:!!t.querySelector('[data-mpl]')}:null;});
  ok('тема раскрылась: фразы, «Тренировать», «▶ подряд»',r&&r.rows===r.n&&r.tr&&r.pl,r);await shot(page,'2-topic');
  // фраза из темы → окно, листание — по фразам темы
  await click('.km5-t.on .km5-q');await page.waitForTimeout(1500);
  r=await ev(()=>({o:!!document.querySelector('.kno2'),pg:(document.querySelector('.kn2-pg')||{}).textContent,more:document.querySelector('.kn5-more').hidden,src:!!document.querySelector('.kn5-more .kn2-src'),acts:[...document.querySelectorAll('.kn5-acts button')].map(b=>b.dataset.v)}));
  const nTopic=await ev(()=>+document.querySelector('.km5-t.on .km5-th small').textContent);
  ok('окно фразы: листание по теме, сразу видно только момент/фразу/перевод и «Ещё раз · 🐢 · Подробнее»',r.o&&r.pg&&r.pg.startsWith('1 / '+nTopic)&&r.more===true&&r.src&&r.acts.join()==='re,slow,more',r);
  await shot(page,'3-window');
  await page.click('.kn5-mb');await page.waitForTimeout(400);r=await ev(()=>({h:document.querySelector('.kn5-more').hidden,use:!!document.querySelector('.kn5-more .ph-use'),ep:!!document.querySelector('.kn5-more [data-v="ep"]')}));
  ok('«Подробнее» раскрывает источник, статус, «Когда пригодится», «Эпизод»',r.h===false&&r.ep,r);await shot(page,'4-window-more');
  if(nTopic>1){await ev(()=>document.querySelector('.kn2-nv.nx').click());await page.waitForTimeout(800);r=await ev(()=>document.querySelector('.kn5-more').hidden);ok('при листании «Подробнее» остаётся открытым',r===false,String(r));}
  await page.click('.kno2 .kn2-x');await page.waitForTimeout(800);r=await ev(()=>!document.querySelector('.kno2'));ok('окно закрылось ×',r);
  await click('.km5-t.on .km5-th');await page.waitForTimeout(400);r=await ev(()=>document.querySelectorAll('.km5-t.on').length);ok('тема свернулась',r===0,String(r));
  // «Тренировать» темы → кубики/диктант (без «Вспомни») → назад в «Мои»
  await click('.km5-th');await page.waitForTimeout(500);await click('.km5-t.on [data-mtr]');await page.waitForTimeout(1200);
  r=await ev(()=>({q:!!document.querySelector('.dl-q'),self:/Вспомни по-|Не вспомнил|Знал/.test(document.body.innerText),meta:(document.querySelector('.dl-q .sc-meta')||{}).textContent}));ok('«Тренировать» темы — без самопроверки',r.q&&!r.self,r);
  await click('#dlx');await page.waitForTimeout(1500);r=await ev(()=>($('#dlStage')||{dataset:{}}).dataset.lvl);ok('после тренировки — снова «Мои»',r==='my',r);
  // #фильм → страница фильма; выход «‹» настоящим кликом и «назад» Телеграма
  await page.locator('.km5-all .km5-tg[data-tg]').first().click();await page.waitForTimeout(1000);
  r=await ev(()=>({h:(document.querySelector('.km5-fh b')||{}).textContent,rows:document.querySelectorAll('.km5-fp .km5-q').length,tagVis:[...document.querySelectorAll('.km5-fp .km5-tg')].some(x=>x.offsetParent),up:!!document.querySelector('.km5-fh [data-mup]'),bb:window.__bb.slice(-1)[0]}));
  ok('#волк → страница фильма: 6 фраз, «Тренировать», «‹», «назад» Телеграма показана',r.h==='#волк'&&r.rows===6&&!r.tagVis&&r.up&&r.bb===1,r);await shot(page,'5-film');
  await page.click('.km5-fh [data-mup]');await page.waitForTimeout(900);r=await ev(()=>({main:!!document.querySelector('.km5-tl'),fh:!!document.querySelector('.km5-fh'),bb:window.__bb.slice(-1)[0]}));
  ok('«‹» → обратно на экран, «назад» Телеграма спрятана',r.main&&!r.fh&&r.bb===0,r);
  await page.locator('.km5-all .km5-tg[data-tg]').nth(7).click();await page.waitForTimeout(900);await ev(()=>onBack());await page.waitForTimeout(900);
  r=await ev(()=>({main:!!document.querySelector('.km5-tl'),fh:!!document.querySelector('.km5-fh')}));ok('«назад» Телеграма со страницы фильма → экран',r.main&&!r.fh,r);
  // окошко слова в окне фразы — без дубля объяснения (13.9.4)
  const fk=await ev(()=>{for(const s of SCENES){const P=scP(s.id);for(const p of s.parts)for(const f of p.ph)if((P.got||{})[f.id]&&idWhole(phIdiom(f),f)&&kwWrap(f,scT(f)).includes('class="sw"'))return s.id+'|'+f.id;}return null;});
  ok('есть собранная фраза, где «выражение» = вся фраза',!!fk,fk);
  await click(`.km5-all .kq[data-c="${fk}"]`);await page.waitForTimeout(1500);
  await page.locator('.kno2 .kn2-en .sw').first().click();await page.waitForTimeout(700);
  r=await ev(()=>{const p=document.querySelector('.kw-pop.on');return p?{dup:/Тут это часть выражения/i.test(p.innerText),inph:/Во фразе/i.test(p.innerText)}:null;});
  ok('слово в открытой фразе: без «Тут это часть выражения» и без «Во фразе»',r&&!r.dup&&!r.inph,r);
  await ev(()=>kwHide(0));await page.waitForTimeout(300);await page.keyboard.press('Escape');await page.waitForTimeout(800);
  // слова: темы (свой #работа — в теме «Работа»), «Все слова» по алфавиту, «＋»
  await click('[data-mk="w"]');await page.waitForTimeout(1200);
  r=await ev(()=>({topics:[...document.querySelectorAll('.km5-th')].map(x=>x.querySelector('b').textContent+':'+x.querySelector('small').textContent),all:[...document.querySelectorAll('.km5-all .kq-en')].map(x=>x.textContent),fab:!!document.querySelector('.km-fab'),own:[...document.querySelectorAll('.km5-all .km5-tg')].filter(x=>!x.dataset.tg).map(x=>x.textContent)}));
  ok('слова: темы, свой тег «работа» — в теме «Работа», «Все слова» по алфавиту, «＋»',r.topics.some(t=>/^Работа:2$/.test(t))&&r.all.join()===[...r.all].sort((a,b)=>a.localeCompare(b)).join()&&r.all.length===5&&r.fab&&r.own.join()==='#работа',r);await shot(page,'6-words');
  await click('.km5-all .kqw');await page.waitForTimeout(1300);r=await ev(()=>({w:(document.querySelector('.kn2-word')||{}).textContent,more:document.querySelector('.kn5-more').hidden,del:!!document.querySelector('.kn5-more .kn2-del')}));
  ok('слово → окно: «Убрать» спрятано под «Подробнее»',!!r.w&&r.more===true&&r.del,r);await page.keyboard.press('Escape');await page.waitForTimeout(600);
  await click('[data-mk="ph"]');await page.waitForTimeout(800);
  // поиск
  await click('[data-msr]');await page.waitForTimeout(700);await page.fill('#kmQ','client');await page.waitForTimeout(800);
  r=await ev(()=>({n:document.querySelectorAll('#kmBody .km5-q').length,tg:document.querySelectorAll('#kmBody .km5-tg').length}));ok('поиск: строки с #фильм',r.n>0&&r.tg===r.n,r);
  await ev(()=>onBack());await page.waitForTimeout(700);r=await ev(()=>!document.querySelector('#kmQ'));ok('«назад» закрывает поиск',r);
  // логика idWhole на всех фразах (настоящее выражение внутри фразы — как раньше)
  r=await ev(()=>{const all=[];SCENES.forEach(s=>s.parts.forEach(p=>p.ph.forEach(f=>{const id=phIdiom(f);if(id)all.push([f,id]);})));
    const whole=all.filter(([f,id])=>idWhole(id,f)),part=all.filter(([f,id])=>!idWhole(id,f));
    const pop=(f,w)=>{const host=document.createElement('div'),el=document.createElement('i');el.className='sw';el.textContent=w;host.appendChild(el);document.body.appendChild(host);wordShow(el,f,true);const t=KWP.innerText;kwHide(0);host.remove();return t;};
    const [fw,iw]=whole[0],[fp,ip]=part.find(([f,id])=>id.words.some(w=>phNorm(f.en).split(' ').includes(w)))||[];
    const tw=pop(fw,iw.words[0]),tp=fp?pop(fp,ip.words.find(w=>phNorm(fp.en).split(' ').includes(w))):'';
    return {whole:whole.length,part:part.length,wDup:/Тут это часть выражения/i.test(tw),wIn:/Во фразе/i.test(tw),pDup:/Тут это часть выражения/i.test(tp),pIn:/Во фразе/i.test(tp)};});
  ok('окошко слова: «выражение» = вся фраза — только «Во фразе»; настоящее выражение — как раньше',r.whole>300&&r.part>100&&!r.wDup&&r.wIn&&r.pDup&&r.pIn,r);
  // уход со словаря — видео не играет, мини-плеера нет
  await ev(()=>renderTab('learn'));await page.waitForTimeout(800);
  r=await ev(()=>({v:[...document.querySelectorAll('video')].filter(v=>!v.paused).length,bar:!!document.querySelector('#kaBar')}));ok('ушёл со словаря — ничего не играет, мини-плеера нет',r.v===0&&!r.bar,r);
  // без анимаций
  await ev(()=>{store.fx=false;DX.seg='my';renderTab('dict');});await page.waitForTimeout(1200);
  const was=await ev(()=>document.querySelectorAll('.km5-t.on').length);await click('.km5-th');await page.waitForTimeout(300);
  r=await ev(()=>({on:document.querySelectorAll('.km5-t.on').length,topics:document.querySelectorAll('.km5-th').length}));ok('без анимаций рисуется и тема раскрывается/сворачивается',r.topics>1&&r.on!==was,{was,...r});
  ok('консоль чистая',!errs.length,errs.slice(0,5).join(' | '));
  console.log(fails?`ИТОГ: ${fails} FAIL`:'ИТОГ: всё PASS');await b.close();})();
