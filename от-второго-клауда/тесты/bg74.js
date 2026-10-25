// 13.9.74 (П18): фоны по сезонам — «фильмам — 1 фон, сериалам — на каждый сезон». node bg74.js ph|pc
// Сезон — из начала ep («S04E09 · …»), ключ — h:<сериал>|S04, награда — за все сцены сезона; «весь сериал» новым не выдаётся, у кого был — остаётся.
// Новые ролики — scenes/_bg/<ключ bg-prompts, «:» → «-»>.mp4; показываются, только когда в tools/bg-status.json "ok":1; иначе — обложка / прежний film-bg.mp4.
const {open}=require('./st');const {chromium}=require('playwright');const fs=require('fs');
const dev=process.argv[2]||'ph';let fails=0;
const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
const seed=([st])=>{if(sessionStorage.getItem('__seeded'))return;sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));};
const base={onboarded:true,introV:1,unl:1,gold:300,lvl:'b',tourV:1,scSubChosen:1,autoSc:false,snd:false,fx:false,wtapHint:1,look:'nd',lookV:2};
const vp=dev==='pc'?{width:1440,height:900}:{width:390,height:844};
if(!fs.existsSync(__dirname+'/shots'))fs.mkdirSync(__dirname+'/shots');
(async()=>{const b=await chromium.launch();
  const mk=async(st,status)=>{const P=await open({browser:b,uid:4242,name:'Игрок',platform:dev==='pc'?'tdesktop':'ios',ctx:{viewport:vp},wait:300,init:seed,initArg:[Object.assign({},base,st||{})]});
    await P.ctx.route(/\/tools\/bg-status\.json/,r=>status?r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(status)}):r.fulfill({status:404,body:''}));
    await P.page.reload();await P.page.waitForTimeout(4400);return P;};
  // 1. без статуса: сезоны, ключи, награды
  const A=await mk({},null),pg=A.page;
  let r=await pg.evaluate(()=>({sop:showSeasons('Клан Сопрано'),sopDe:showSeasons('Die Sopranos'),bb:showSeasons('Во все тяжкие'),bbDe:showSeasons('Breaking Bad'),wolf:showSeasons('Волк с Уолл-стрит'),
    arc:seasonOf(scOf('sopranos-arc')),film:seasonOf(scOf('wolf-of-wall-street')),keys:bgKeysOf('Клан Сопрано'),fk:bgKeysOf('Волк с Уолл-стрит')}));
  ok('сезоны из ep: Сопрано S01·S04, немецкие S01·S06, ВВТ S01·S02·S04, немецкий BB S04·S05, у фильма — нет',r.sop.join()==='S01,S04'&&r.sopDe.join()==='S01,S06'&&r.bb.join()==='S01,S02,S04'&&r.bbDe.join()==='S04,S05'&&!r.wolf.length&&r.arc==='S01'&&r.film==='',r);
  ok('Коллекция у сериала: фоны сезонов, без «весь сериал»; у фильма — главный фон',r.keys[0]==='h:Клан Сопрано|S01'&&r.keys[1]==='h:Клан Сопрано|S04'&&!r.keys.includes('h:Клан Сопрано')&&r.fk[0]==='h:Волк с Уолл-стрит',r);
  r=await pg.evaluate(()=>{const b=bgInfo('h:Клан Сопрано|S04'),a=bgInfo('h:Клан Сопрано|S01');return {b:{got:b.got,name:b.name,sub:b.sub,live:b.live,vid:b.vid,how:b.how,film:b.film,season:b.season},how1:a.how};});
  ok('фон сезона: «Клан Сопрано · сезон 4», не получен, без ролика (статуса нет), как получить — «Пройди сцену …»',!r.b.got&&r.b.name==='Клан Сопрано · сезон 4'&&r.b.sub==='Главный фон · сезон 4'&&!r.b.live&&!r.b.vid.length&&r.b.film&&r.b.season==='S04'&&/Пройди сцену/.test(r.b.how),r);
  ok('сезон из двух сцен: «пройдено 0 из 2»',/1-го сезона «Клан Сопрано» — пройдено 0 из 2/.test(r.how1),r.how1);
  // пройти сезон 4 (одна сцена — Ральф): награда за сезон, «весь сериал» не выдаётся
  r=await pg.evaluate(()=>{const s=scOf('sopranos-ralph');const P=scP(s.id);s.parts.forEach((p,i)=>{if(!P.done.includes(i))P.done.push(i);});scSave&&scSave();
    const html=rwEndHTML(s,s.parts.length-1,true);return {k:Object.keys(store.seasonRw||{}),show:!!(store.showRw||{})['Клан Сопрано'],t:/сезон 4 — пройден/.test(html),bgc:/data-bgc="h:Клан Сопрано\|S04"/.test(html),got:bgInfo('h:Клан Сопрано|S04').got};});
  ok('прошёл сезон 4: в итоге «сезон 4 — пройден» и «Смотреть» фон сезона, store.seasonRw, «весь сериал» — нет',r.k.join()==='h:Клан Сопрано|S04'&&!r.show&&r.t&&r.bgc&&r.got,r);
  r=await pg.evaluate(()=>{const s=scOf('sopranos-s01e01');const P=scP(s.id);s.parts.forEach((p,i)=>{if(!P.done.includes(i))P.done.push(i);});const z=seasonGive(s);return {z,how:bgInfo('h:Клан Сопрано|S01').how};});
  ok('сезон 1: одна сцена из двух — награды нет, «пройдено 1 из 2»',r.z===false&&/пройдено 1 из 2/.test(r.how),r);
  r=await pg.evaluate(()=>{['sopranos-arc'].forEach(id=>{const s=scOf(id),P=scP(id);s.parts.forEach((p,i)=>{if(!P.done.includes(i))P.done.push(i);});});const z=seasonGive(scOf('sopranos-arc'));return {z,show:showGive(scOf('sopranos-arc')),all:showDone('Клан Сопрано')};});
  ok('весь сезон 1 — фон сезона; сериал пройден целиком, но «весь сериал» не выдаётся',r.z==='h:Клан Сопрано|S01'&&r.show===false&&r.all,r);
  // Коллекция
  await pg.evaluate(()=>renderCollection('bg'));await pg.waitForTimeout(500);
  r=await pg.evaluate(()=>{const t=[...document.querySelectorAll('.bgw-i')].filter(x=>/^h:Клан Сопрано/.test(x.dataset.bgk)).map(x=>[x.dataset.bgk,x.querySelector('.bgw-t').textContent,x.classList.contains('lock')]);
    return {t,foot:(document.querySelector('.rwc-n')||{}).textContent||''};});
  ok('Коллекция: «Фон сезона · Сезон 1 / Сезон 4», оба получены; внизу — про сезоны',r.t.length===2&&r.t[0][1]==='Фон сезонаСезон 1'&&r.t[1][1]==='Фон сезонаСезон 4'&&r.t.every(x=>!x[2])&&/у сериала — фон каждого сезона/.test(r.foot),r);
  await pg.screenshot({path:`${__dirname}/shots/bg74-${dev}-coll.png`});
  await pg.click('.bgw-i[data-bgk="h:Клан Сопрано|S04"]');await pg.waitForTimeout(500);
  r=await pg.evaluate(()=>({v:!!document.querySelector('.bgvw'),t:(document.querySelector('.bgvw-t')||{}).textContent||''}));
  ok('тап — просмотр фона на весь экран',r.v&&/сезон 4/.test(r.t),r);
  await pg.click('.bgvw-set[data-to="profBg"]');await pg.waitForTimeout(200);
  r=await pg.evaluate(()=>({pb:store.profBg,tag:bgTagHTML(profBg())}));
  ok('фон сезона — в профиль: подпись «🏆 Сезон 4 · Клан Сопрано · сезон 4»',r.pb==='h:Клан Сопрано|S04'&&/Сезон 4/.test(r.tag)&&/Клан Сопрано · сезон 4/.test(r.tag),r);
  // синк: сезоны — объединение
  r=await pg.evaluate(()=>{const o=storeMerge({seasonRw:{'h:Во все тяжкие|S02':{t:1}},sv:(store.sv||0)+9},store.sv||0);return Object.keys(o.seasonRw||{}).sort();});
  ok('синк: фоны сезонов с двух устройств — объединяются',r.join()==='h:Во все тяжкие|S02,h:Клан Сопрано|S01,h:Клан Сопрано|S04',r);
  // уже выданный «весь сериал» остаётся
  r=await pg.evaluate(()=>{store.showRw=Object.assign({},store.showRw,{'Во все тяжкие':{t:1}});return {k:bgKeysOf('Во все тяжкие').slice(0,4),got:bgInfo('h:Во все тяжкие').got};});
  ok('у кого был «весь сериал» — он остаётся в Коллекции рядом с сезонами',r.k[0]==='h:Во все тяжкие'&&r.k[1]==='h:Во все тяжкие|S01'&&r.got,r);
  ok('консоль чистая (без статуса)',!A.errs.length,A.errs.slice(0,3));
  // 2. статус роликов: ok — показываем, без ok — нет
  const B=await mk({seasonRw:{'h:Клан Сопрано|S04':{t:1}},showRw:{'Волк с Уолл-стрит':{t:1}}},{'season:sopranos:S04':{file:'scenes/_bg/season-sopranos-S04.mp4',date:'2026-10-25',ok:1},'film:wolf':{file:'scenes/_bg/film-wolf.mp4',date:'2026-10-25'},'person:durov':{file:'../evil.mp4',ok:1}});
  r=await B.page.evaluate(()=>{const s=bgInfo('h:Клан Сопрано|S04'),w=bgInfo('h:Волк с Уолл-стрит'),d=bgInfo('h:Павел Дуров'),sd=bgInfo('h:Die Sopranos|S01');return {st:Object.keys(BGST),s:{live:s.live,vid:s.vid,img0:s.img[0]},w:{vid:w.vid},d:d.vid,sd:sd.vid};});
  ok('сезон с "ok":1 — живой ролик scenes/_bg/season-sopranos-S04.mp4 и превью …p.jpg',r.s.live&&r.s.vid.length===1&&/\/m\/scenes\/_bg\/season-sopranos-S04\.mp4$/.test(r.s.vid[0])&&/season-sopranos-S04p\.jpg$/.test(r.s.img0),r);
  ok('фильм без "ok" — прежний film-bg.mp4, нового ролика нет',r.w.vid.length&&r.w.vid.every(u=>!/_bg\//.test(u))&&/film-bg\.mp4$/.test(r.w.vid[0]),r.w);
  ok('кривой путь в статусе — берём путь по ключу (scenes/_bg/person-durov.mp4); у немецкой S01 без статуса — без ролика',/\/scenes\/_bg\/person-durov\.mp4$/.test(r.d[0])&&!r.d.some(u=>/evil/.test(u))&&!r.sd.length,r);
  r=await B.page.evaluate(()=>{BGST['film:wolf'].ok=1;const w=bgInfo('h:Волк с Уолл-стрит');return w.vid;});
  ok('фильм с "ok":1 — новый ролик первым, прежний film-bg.mp4 — запасным',/\/scenes\/_bg\/film-wolf\.mp4$/.test(r[0])&&/film-bg\.mp4$/.test(r[1]),r);
  ok('консоль чистая (со статусом)',!B.errs.length,B.errs.slice(0,3));
  console.log(fails?`FAILS: ${fails}`:'ALL PASS');await b.close();process.exit(fails?1:0);
})().catch(e=>{console.error(e);process.exit(2);});
