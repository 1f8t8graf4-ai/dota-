// 13.9.6 — фон в профиле: «В профиль» в Коллекции, карточка игрока, «назад» из Коллекции, дуэль на фонах (воркер-стенд 8788).
// Запуск: NODE_PATH=/opt/node-tools/node_modules node pf.js [ph|pc]   (сайт на 8080, stand2.mjs на 8788, фоны — в ./cache)
const {open,initData}=require('./st');const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const dev=process.argv[2]==='pc'?'pc':'ph',vp=dev==='pc'?{width:1440,height:900}:{width:390,height:844};
const SH=process.env.SHOTS||path.join(__dirname,'shots-pf');fs.mkdirSync(SH,{recursive:true});
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d||'');};
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));};
const base={onboarded:true,introV:1,gold:300,lvl:'b',tourV:1,scSubChosen:1,autoSc:false,fx:true};
// получить фоны: сцена Волка целиком (её фон) + весь Волк и весь Дуров (главные фоны)
const earn=(P,L)=>P.evaluate(L=>{store.seg=store.seg||{};store.showRw=store.showRw||{};
  L.forEach(id=>{const s=scOf(id);store.seg[id]={t:Date.now(),gold:0};store.showRw[showOf(s)]={t:Date.now()};});save();},L);
const shot=(P,n)=>P.screenshot({path:path.join(SH,`${dev}-${n}.png`)});
const pfRead=G=>G.evaluate(()=>{const o=document.querySelector('.pfv');if(!o)return null;const c=o.querySelector('.pfv-card');
  return {name:o.querySelector('.pfv-who b').textContent,me:!!o.querySelector('.pfv-who small'),has:c.classList.contains('has'),film:c.classList.contains('film'),tag:(o.querySelector('.pbg-tag')||{}).textContent||'',
    st:[...o.querySelectorAll('.pfv-st div')].map(d=>d.querySelector('b').textContent+' '+d.querySelector('span').textContent)};});
const pfClose=async G=>{await G.evaluate(()=>onBack());await G.waitForTimeout(350);return G.evaluate(()=>!document.querySelector('.pfv'));};
(async()=>{const b=await chromium.launch();
  const A=await open({browser:b,worker:true,uid:111,name:'Аня',initData:initData(111,'Аня'),wait:2500,ctx:{viewport:vp},init:seed,initArg:[base]});
  const P=A.page;await earn(P,['wolf-of-wall-street','durov-tucker']);
  const H=await P.evaluate(()=>({wolf:'h:'+showOf(scOf('wolf-of-wall-street')),durov:'h:'+showOf(scOf('durov-tucker'))}));
  // 1. профиль без фона — зовёт в Коллекцию
  await P.evaluate(()=>renderTab('profile'));await P.waitForTimeout(500);
  let r=await P.evaluate(()=>({pbg:!!document.querySelector('.phead.pbg'),ask:(document.querySelector('#pcSet')||{}).textContent||''}));
  ok('профиль без фона: обычная шапка + «Поставь фон из Коллекции»',!r.pbg&&/Коллекции/.test(r.ask),JSON.stringify(r));
  await shot(P,'1-profile-empty');
  // 2. «Поставь фон» → Коллекция, вкладка «Фоны»
  await P.click('#pcSet');await P.waitForTimeout(500);
  r=await P.evaluate(()=>({scr:screen,tab:store.collTab,n:document.querySelectorAll('.coll [data-bgk]').length}));
  ok('кнопка ведёт в Коллекцию → Фоны',r.scr==='coll'&&r.tab==='bg'&&r.n>0,JSON.stringify(r));
  // 3. главный фон Волка → просмотр → «В профиль»
  await P.click(`.coll [data-bgk="${H.wolf}"]`);await P.waitForSelector('.bgvw',{timeout:3000});await P.waitForTimeout(400);
  r=await P.evaluate(()=>[...document.querySelectorAll('.bgvw-set')].map(x=>x.dataset.to+':'+x.textContent));
  ok('в просмотре две кнопки: «На Главную» и «В профиль»',r.length===2&&/На Главную/.test(r[0])&&/В профиль/.test(r[1]),JSON.stringify(r));
  await P.click('.bgvw-set[data-to="profBg"]');await P.waitForTimeout(300);
  r=await P.evaluate(()=>({pb:store.profBg,t:document.querySelector('.bgvw-set[data-to="profBg"]').textContent,home:store.appBg||''}));
  ok('«В профиль» ставит фон (и не трогает Главную)',r.pb===H.wolf&&/✓ В профиле/.test(r.t)&&r.home==='',JSON.stringify(r));
  await shot(P,'2-bgview');
  await P.click('.bgvw-x');await P.waitForTimeout(400);
  r=await P.evaluate(k=>{const t=document.querySelector(`.coll [data-bgk="${CSS.escape(k)}"]`);return {pf:t.classList.contains('pf'),before:getComputedStyle(t,'::before').content};},H.wolf);
  ok('плитка в Коллекции помечена «в профиле»',r.pf&&/в профиле/.test(r.before),JSON.stringify(r));
  await shot(P,'3-coll');
  // 4. «назад» из Коллекции — в профиль (откуда пришли), карточка на главном фоне; событие фона — на 6-й секунде файла
  const EV=G=>G.evaluate(()=>{const s=scOf('wolf-of-wall-street');s.filmbgev=6;s.bgev=6;});await EV(P);
  await P.click('#bBtn');await P.waitForTimeout(1600);
  const ct=await P.evaluate(()=>{const v=document.querySelector('.phead .pc-bg video');return v?v.currentTime:-1;});
  ok('профиль: ролик стартует перед событием — событие через ~2.5 с после открытия',ct>4.4&&ct<6.2,'currentTime '+ct.toFixed(2)+' (событие на 6.0)');
  r=await P.evaluate(()=>{const h=document.querySelector('.phead');const v=h&&h.querySelector('.pc-bg video');
    return {tab:store.tab,scr:screen,pbg:h&&h.classList.contains('pbg'),film:h&&h.classList.contains('film'),tag:(h.querySelector('.pbg-tag')||{}).textContent||'',img:h.querySelector('.pc-bg').style.backgroundImage.slice(0,80),vid:!!v,vok:!!(v&&v.classList.contains('on'))};});
  ok('«назад» из Коллекции вернул в Профиль',r.tab==='profile'&&r.scr==='home',JSON.stringify(r));
  ok('профиль — карточка на главном фоне: золото + «Весь фильм»',r.pbg&&r.film&&/Весь фильм/i.test(r.tag)&&/film-bgp/.test(r.img),JSON.stringify(r));
  ok('живой фон: видео в карточке играет',r.vid&&r.vok,JSON.stringify(r));
  await shot(P,'4-profile-film');
  // 5. «Сменить фон» → фон сцены; системная «назад» из Коллекции — тоже в профиль
  await P.click('#pcChg');await P.waitForTimeout(500);
  await P.click('.coll [data-bgk="wolf-of-wall-street"]');await P.waitForSelector('.bgvw');await P.waitForTimeout(300);
  await P.click('.bgvw-set[data-to="profBg"]');await P.waitForTimeout(200);
  await P.evaluate(()=>onBack());await P.waitForTimeout(300);   // закрыть просмотр
  await P.evaluate(()=>onBack());await P.waitForTimeout(1500);  // из Коллекции
  r=await P.evaluate(()=>{const h=document.querySelector('.phead');return {tab:store.tab,pb:store.profBg,pbg:h.classList.contains('pbg'),film:h.classList.contains('film'),tag:(h.querySelector('.pbg-tag')||{}).textContent||''};});
  ok('фон сцены в профиле: без золота, «Сцена · фильм»; системная «назад» → Профиль',r.tab==='profile'&&r.pb==='wolf-of-wall-street'&&r.pbg&&!r.film&&/Сцена/.test(r.tag),JSON.stringify(r));
  await shot(P,'5-profile-scene');
  // 6. убрать из профиля
  await P.evaluate(()=>renderCollection('bg','wolf-of-wall-street'));await P.waitForSelector('.bgvw');await P.waitForTimeout(400);
  await P.click('.bgvw-set[data-to="profBg"]');await P.waitForTimeout(200);
  r=await P.evaluate(()=>({pb:store.profBg,t:document.querySelector('.bgvw-set[data-to="profBg"]').textContent}));
  ok('повторное нажатие убирает фон из профиля',r.pb===''&&/В профиль/.test(r.t)&&!/✓/.test(r.t),JSON.stringify(r));
  await P.evaluate(()=>{document.querySelector('.bgvw')._close();});await P.waitForTimeout(300);
  // 7. не полученный фон в профиль не попадает (подделанный ключ)
  r=await P.evaluate(()=>{store.profBg='titanic-boat';save();renderTab('profile');return !!document.querySelector('.phead.pbg');});
  ok('фон, которого нет у игрока, в профиле не показывается',!r);
  // 8. дуэль: Аня с главным фоном Волка, Боря — сначала без фона
  await P.evaluate(k=>{store.profBg=k;save();},H.wolf);
  const B=await open({browser:b,worker:true,uid:222,name:'Боря',initData:initData(222,'Боря'),wait:2500,ctx:{viewport:vp},init:seed,initArg:[base]});
  const Q=B.page;await EV(Q);
  await P.evaluate(()=>kvSheet('wolf-of-wall-street',0));await P.waitForTimeout(500);await P.click('#kvGo');await P.waitForTimeout(1500);
  const code=await P.evaluate(()=>KV&&KV.code);ok('комната создана',!!code,code);
  r=await P.evaluate(()=>({pl:!!document.querySelector('.kv-lobby>.kvp.inv.has.film'),cap:(document.querySelector('.kvp-cap')||{}).textContent||'',bg:KV.room.A.bg}));
  ok('ожидание: «Так тебя увидит друг» на своём фоне; фон ушёл в комнату',r.pl&&/увидит друг/.test(r.cap)&&r.bg===H.wolf,JSON.stringify(r));
  await shot(P,'6-lobby');
  await P.click('.kv-lobby>.kvp.inv');await P.waitForTimeout(500);r=await pfRead(P);
  ok('ожидание: нажал на себя — «Так тебя видят друзья в дуэли», цифры',r&&r.me&&r.has&&r.film&&r.st.length===4&&/^2 сцены пройдены/.test(r.st[0])&&/^4 фона получено/.test(r.st[2]),JSON.stringify(r));
  await shot(P,'6b-me');ok('«назад» закрывает профиль',await pfClose(P));
  await Q.evaluate(c=>kvJoin(c),code);await Q.waitForTimeout(1800);
  r=await Q.evaluate(()=>{const p=document.querySelector('.kv-lobby>.kvp.inv'),v=p&&p.querySelector('video');return {pl:!!p,has:p&&p.classList.contains('has'),name:p&&p.querySelector('.kvp-who>b').textContent,tag:p&&(p.querySelector('.pbg-tag')||{}).textContent,img:p&&p.querySelector('.kvp-bg').style.backgroundImage.slice(0,90),ct:v?+v.currentTime.toFixed(2):-1};});
  ok('приглашение: ролик пригласившего стартует перед событием',r.ct>3.5&&r.ct<7,'currentTime '+r.ct);
  ok('приглашение: друг видит Аню на её главном фоне',r.pl&&r.has&&r.name==='Аня'&&/Весь фильм/i.test(r.tag||'')&&/film-bgp/.test(r.img||''),JSON.stringify(r));
  await shot(Q,'7-invite');
  r=await Q.evaluate(()=>({pf:KV.room.A.pf,chip:(document.querySelector('.kv-lobby>.kvp .kvp-pv')||{}).textContent||''}));
  ok('в комнате — цифры профиля Ани, на плашке «Профиль ›»',r.pf&&r.pf.sc===2&&r.pf.bg===4&&/Профиль/.test(r.chip),JSON.stringify(r));
  await Q.click('.kv-lobby>.kvp.inv');await Q.waitForTimeout(500);r=await pfRead(Q);
  ok('приглашение: нажал на Аню — её профиль на её фоне',r&&!r.me&&r.name==='Аня'&&r.has&&/Весь фильм/i.test(r.tag)&&r.st.length===4,JSON.stringify(r));
  await shot(Q,'7b-anya');ok('«назад» закрывает профиль, приглашение на месте',await pfClose(Q)&&await Q.evaluate(()=>!!document.querySelector('#kvIn')));
  await Q.click('#kvIn');
  await Promise.all([P.waitForSelector('.kv-vs',{timeout:15000}),Q.waitForSelector('.kv-vs',{timeout:15000})]);await P.waitForTimeout(700);
  const vs=G=>G.evaluate(()=>{const t=document.querySelector('.kv-vs>.kvp.top'),bo=document.querySelector('.kv-vs>.kvp.bot'),cs=e=>getComputedStyle(e);
    const vt=e=>{const v=e&&e.querySelector('video');return v?+v.currentTime.toFixed(2):-1;};
    return {top:t&&t.querySelector('.kvp-who>b').textContent,topHas:t&&t.classList.contains('has'),bot:bo&&bo.querySelector('.kvp-who>b').textContent,botHas:bo&&bo.classList.contains('has'),ctTop:vt(t),ctBot:vt(bo),
      fixed:cs(document.querySelector('.kv-vs')).position,num:(document.querySelector('#kvN')||{}).textContent,pot:!!document.querySelector('#kvPot'),w:innerWidth,sw:document.documentElement.scrollWidth};});
  const va=await vs(P),vb=await vs(Q);
  ok('отсчёт у Ани: Боря сверху (без фона), она снизу на своём фоне',va.top==='Боря'&&!va.topHas&&va.bot==='Ты'&&va.botHas&&va.fixed==='fixed',JSON.stringify(va));
  ok('отсчёт у Бори: Аня сверху на своём фоне, он снизу без фона',vb.top==='Аня'&&vb.topHas&&vb.bot==='Ты'&&!vb.botHas,JSON.stringify(vb));
  ok('отсчёт: банк и цифра на месте, без горизонтальной прокрутки',va.pot&&/^[123]$/.test(va.num||'')&&va.sw<=va.w,JSON.stringify(va));
  ok('отсчёт: ролики стартуют перед событием — событие во время 3-2-1',va.ctBot>3.5&&va.ctBot<7&&vb.ctTop>3.5&&vb.ctTop<7,`у Ани свой ${va.ctBot}, у Бори Анин ${vb.ctTop} (событие на 6.0)`);
  await shot(P,'8-vs-a');await shot(Q,'8-vs-b');
  await Promise.all([P.waitForSelector('.kv-q',{timeout:15000}),Q.waitForSelector('.kv-q',{timeout:15000})]);
  async function play(G,right){for(let i=0;i<24;i++){const st=await G.evaluate(()=>({q:!!document.querySelector('.kv-o button:not([disabled])'),end:!!document.querySelector('.kv-end'),wait:!!document.querySelector('.kv-waitb'),k:KV&&KV.k,n:KV&&KV.room.qs.length}));
      if(st.end||st.wait||st.k>=st.n)return;if(!st.q){await G.waitForTimeout(300);continue;}
      await G.evaluate(r=>{const q=KV.room.qs[KV.k],bs=[...document.querySelectorAll('.kv-o button')];(bs.find(x=>(x.dataset.v===q.right)===r)||bs[0]).click();},right);await G.waitForTimeout(1600);}}
  await Promise.all([play(P,true),play(Q,false)]);
  await P.waitForSelector('.kv-end',{timeout:20000});await Q.waitForSelector('.kv-end',{timeout:20000});
  await P.evaluate(()=>document.querySelectorAll('.stl').forEach(x=>x.click()));await P.waitForTimeout(800);
  r=await P.evaluate(()=>{const p=document.querySelector('.kv-end>.kvp.win');return {pl:!!p,has:p&&p.classList.contains('has'),name:p&&p.querySelector('.kvp-who>b').textContent};});
  ok('победа: Аня видит себя на своём фоне',r.pl&&r.has&&r.name==='Ты',JSON.stringify(r));
  await shot(P,'9-end-win');
  r=await Q.evaluate(()=>{const p=document.querySelector('.kv-end>.kvp.win');return {pl:!!p,name:p&&p.querySelector('.kvp-who>b').textContent};});
  ok('поражение: Боря видит победителя Аню на её фоне',r.pl&&r.name==='Аня',JSON.stringify(r));
  await shot(Q,'9-end-lose');
  await Q.click('.kv-end>.kvp.win');await Q.waitForTimeout(500);r=await pfRead(Q);
  ok('итог у Бори: нажал на победителя — профиль Ани',r&&r.name==='Аня'&&r.has,JSON.stringify(r));await pfClose(Q);
  r=await P.evaluate(()=>{const b=document.querySelector('.kv-pfb');return b?b.textContent:'';});
  ok('итог у Ани: кнопка «Боря · профиль»',/Боря · профиль/.test(r),r);
  await P.click('.kv-pfb');await P.waitForTimeout(500);r=await pfRead(P);
  ok('профиль Бори без фона: карточка без видео, цифры',r&&r.name==='Боря'&&!r.has&&r.st.length===4,JSON.stringify(r));
  await shot(P,'9b-borya');await pfClose(P);
  // 9. реванш: у Бори тоже фон (сцена Волка) — оба на своих фонах
  await earn(Q,['wolf-of-wall-street']);await Q.evaluate(()=>{store.profBg='wolf-of-wall-street';save();});
  await Q.evaluate(()=>{KV=null;kvSheet('wolf-of-wall-street',0);});await Q.waitForTimeout(500);await Q.click('#kvGo');await Q.waitForTimeout(1500);
  const code2=await Q.evaluate(()=>KV&&KV.code);await P.evaluate(c=>{KV=null;kvJoin(c);},code2);await P.waitForTimeout(1800);await P.click('#kvIn');
  await Promise.all([P.waitForSelector('.kv-vs',{timeout:15000}),Q.waitForSelector('.kv-vs',{timeout:15000})]);await P.waitForTimeout(900);
  const v2=await vs(Q);
  ok('реванш: оба на своих фонах',v2.top==='Аня'&&v2.topHas&&v2.bot==='Ты'&&v2.botHas,JSON.stringify(v2));
  await shot(Q,'10-vs-both');
  await P.evaluate(()=>kvLeave());await Q.waitForTimeout(2500);
  // 9б. своя карточка в профиле — нажал → как тебя видят друзья
  await P.evaluate(()=>{KV=null;renderTab('profile');});await P.waitForTimeout(600);
  await P.mouse.click(...await P.evaluate(()=>{const r=document.querySelector('.phead.pbg').getBoundingClientRect();return [r.left+r.width*.3,r.top+r.height*.45];}));await P.waitForTimeout(500);
  r=await pfRead(P);ok('профиль: нажал на свою карточку — как тебя видят друзья',r&&r.me&&r.has,JSON.stringify(r));await pfClose(P);
  await P.click('#pcChg');await P.waitForTimeout(400);r=await P.evaluate(()=>({scr:screen,pfv:!!document.querySelector('.pfv')}));
  ok('«Сменить фон» открывает Коллекцию, а не профиль',r.scr==='coll'&&!r.pfv,JSON.stringify(r));
  // 10. без анимаций — отсчёт без «въезда», всё на месте
  r=await P.evaluate(()=>{store.fx=false;applyFx();renderTab('profile');const h=document.querySelector('.phead');return {pbg:h.classList.contains('pbg'),an:getComputedStyle(h,'::after').animationName};});
  ok('без анимаций профиль на месте, блик выключен',r.pbg&&(r.an==='none'||!r.an),JSON.stringify(r));
  ok('ошибок в консоли нет',A.errs.length+B.errs.length===0,A.errs.concat(B.errs).slice(0,6).join('\n'));
  console.log(fails?`ИТОГ: ${fails} FAIL`:'ИТОГ: всё PASS');
  await b.close();})();
