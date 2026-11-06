// Заглушка Panorama для проверки скрипта Restless без игры (0.13: + связь с программой, профили, старая плашка; 0.14: замер нагрузки VIS;
// 0.19: + память настроек — настоящая restless/store.html крутится тут же в vm, «перезапуск игры» — новый HUD с тем же localStorage).
// HUD: корень Hud → верхняя панель (ванильная), субтитры, скорость, меню по Esc (наши файлы со скриптом).
// Как в игре: скрипт файла запускается раньше, чем панель вставлена в HUD, — он должен дождаться, а не выключиться.
// Второй прогон: меню по Esc — чужое (ванильная копия без скрипта) — кнопку всё равно ставит скрипт из субтитров/скорости.
// node mod/tools/mock_panorama.js mod/restless-probe/panorama <ванильный hud_escape_menu.xml>
const fs=require('fs'),vm=require('vm'),path=require('path');
const dir=process.argv[2]||'mod/restless-probe/panorama', escXml=process.argv[3];
const src=fs.readFileSync(path.join(dir,'scripts/restless.js'),'utf8');
// VIS — сколько панелей перебрали поиски (FindChild…Traverse): мерило нагрузки мода, как у QoL Lite
var VIS=0;
function P(type,id,attrs){const p={type,paneltype:type,id:id||'',attrs:attrs||{},ch:[],par:null,style:{},ev:{},hittest:true,text:(attrs&&attrs.text)||'',valid:true,
 cls:new Set(((attrs&&attrs.class)||'').split(/\s+/).filter(Boolean)),
 actualxoffset:0,actualyoffset:0,actuallayoutwidth:0,actuallayoutheight:0,actualuiscale_x:1,actualuiscale_y:1,
 GetParent(){return this.par},IsValid(){return this.valid},GetChildCount(){return this.ch.length},GetChild(i){return this.ch[i]},
 FindChildTraverse(i){for(const c of this.ch){VIS++;if(c.id===i)return c;const r=c.FindChildTraverse(i);if(r)return r}return null},
 FindChildrenWithClassTraverse(k,a=[]){for(const c of this.ch){VIS++;if(c.cls.has(k))a.push(c);c.FindChildrenWithClassTraverse(k,a)}return a},
 SetPanelEvent(e,f){this.ev[e]=f},SetImage(u){this.img=u},SetURL(u){this.url=u;if(typeof onURL==='function')onURL(this,u)},BHasClass(c){return this.cls.has(c)},AddClass(c){this.cls.add(c)},RemoveClass(c){this.cls.delete(c)},
 SetAttributeString(k,v){(this.at||(this.at={}))[k]=String(v)},GetAttributeString(k,d){return this.at&&k in this.at?this.at[k]:d},
 MoveChildBefore(a,b){const i=this.ch.indexOf(a);this.ch.splice(i,1);this.ch.splice(this.ch.indexOf(b),0,a)},
 DeleteAsync(){this.valid=false;if(this.par)this.par.ch.splice(this.par.ch.indexOf(this),1)},
 RemoveAndDeleteChildren(){this.ch.forEach(c=>c.valid=false);this.ch=[]}};return p}
function add(par,p){p.par=par;par.ch.push(p);return p}
function parse(xml,top){
 xml=xml.replace(/<!--[\s\S]*?-->/g,'').replace(/<snippets>[\s\S]*?<\/snippets>/,'');const re=/<(\/?)([\w]+)([^>]*?)(\/?)>/g;let m,st=[top];
 while((m=re.exec(xml))){const[,close,tag,rest,self]=m;if(['root','styles','scripts','include'].includes(tag))continue;
  if(close){st.pop();continue}
  const at={};rest.replace(/([\w-]+)="([^"]*)"/g,(_,k,v)=>{at[k]=v.replace(/&amp;/g,'&').replace(/&apos;/g,"'")});
  const p=add(st[st.length-1],P(tag,at.id,at));if(!self)st.push(p)}
 return top.ch[top.ch.length-1]}
const UNH={},FIRE=[];let sched=[];const msgs=[];const props=[];let CLOCK=Date.now();const FD={now:()=>CLOCK};const acts=[];
function run(ctxp,code){const $={GetContextPanel:()=>ctxp,CreatePanel:(t,par,id,pr)=>{const p=add(par,P(t,id,pr||{}));props.push(pr||{});return p},
 Msg:m=>msgs.push(m),Schedule:(d,f)=>sched.push(f),RegisterEventHandler:(e,p,f)=>{(p.h||(p.h={}))[e]=f},
 RegisterForUnhandledEvent:(e,f)=>{(UNH[e]||(UNH[e]=[])).push(f)},
 // как в игре: {i:имя} ищется в переменных панели и выше
 Localize:(s,p)=>s.replace(/\{[ids]:(\w+)\}/g,(m,k)=>{for(let q=p;q;q=q.par)if(q.dv&&k in q.dv)return String(q.dv[k]);return m}),
 DispatchEvent:(e,a)=>{if(e==='ClientUI_FireOutput'){FIRE.push(a);(UNH[e]||[]).slice().forEach(f=>f(a))}if(e==='ExternalBrowserGoToURL')msgs.push('URL '+a);if(e==='Activated')acts.push(a);if(e==='DismissAllContextMenus')cards.splice(0).forEach(c=>c.DeleteAsync())}};
 vm.runInNewContext(code||src,{$,SteamOverlayAPI:{OpenURL:u=>msgs.push('URL '+u)},Date:FD,Math,String});return $}
const cards=[];
// страница store.html (браузер игры): отвечает заголовком на следующем такте; localStorage общий — переживает «перезапуск игры»
const LSO={},PAGES=new Map();let pageQ=[],PAGE_HOLD=false,PAGE_DOWN=false;
const STORE_JS=(fs.readFileSync(path.join(__dirname,'../../restless/store.html'),'utf8').match(/<script>([\s\S]*?)<\/script>/)||[])[1];
let PROG_TITLE=null;
global.BLD_URLS=[];global.onURL=(p,u)=>{if(/\/bld\.html\?h=/.test(u)){BLD_URLS.push(u);const h=decodeURIComponent((/h=([^&]+)/.exec(u)||[])[1]||'');pageQ.push(()=>{if(p.valid&&p.h&&p.h.HTMLTitle)p.h.HTMLTitle(p,'RL_BLD:'+(/^\d+$/.test(h)?h:65)+':449466')});return}if(/^http:\/\/127\.0\.0\.1:27515\/cfg\.html/.test(u)){if(PROG_TITLE)pageQ.push(()=>{if(p.valid&&p.h&&p.h.HTMLTitle)p.h.HTMLTitle(p,PROG_TITLE)});return}if(PAGE_DOWN)return;const i=u.indexOf('#'),base=i<0?u:u.slice(0,i),h=i<0?'':u.slice(i);let pg=PAGES.get(p);
 const fire=t=>pageQ.push(()=>{if(p.valid&&p.h&&p.h.HTMLTitle)p.h.HTMLTitle(p,t)});
 if(pg&&pg.base===base&&h){if(pg.loc.hash!==h){pg.loc.hash=h;pageQ.push(()=>pg.hc.forEach(f=>f()))}return}
 pg={base,loc:{hash:h},hc:[]};PAGES.set(p,pg);
 pageQ.push(()=>vm.runInNewContext(STORE_JS,{location:pg.loc,localStorage:{getItem:k=>k in LSO?LSO[k]:null,setItem:(k,v)=>{LSO[k]=String(v)}},
  document:{set title(t){fire(t)}},window:{addEventListener:(e,f)=>{if(e==='hashchange')pg.hc.push(f)}},Date:FD,JSON,String,encodeURIComponent,decodeURIComponent}))};
const LT=p=>p?all(p).filter(x=>x.type==='Label'&&x.style.visibility!=='collapse').map(x=>x.text).join(' '):'';
const UWSRC=fs.readFileSync(path.join(dir,'scripts/restless_uw.js'),'utf8');
const tick=(n=1)=>{for(let i=0;i<n;i++){CLOCK+=250;if(!PAGE_HOLD){const q=pageQ;pageQ=[];q.forEach(f=>f())}const s=sched;sched=[];s.forEach(f=>f());if(typeof onAct==='function')onAct()}};
let fail=0;const ok=(c,t)=>{console.log((c?'PASS ':'FAIL ')+t);if(!c)fail++};
// HUD
const L=f=>fs.readFileSync(path.join(dir,'layout/'+f),'utf8');
ok(!fs.existsSync(path.join(dir,'layout/citadel_hud_top_bar.xml')),'верхнюю панель не подменяем (её меняют QoL Lock, QoL Lite)');
['citadel_hud_subtitles.xml','hud_movement_speed.xml'].forEach(f=>ok(/restless\.vjs_c/.test(L(f)),'скрипт подключён: '+f));
ok(!fs.existsSync(path.join(dir,'layout/hud_escape_menu.xml')),'меню по Esc не подменяем (с 0.12): кнопку ставит скрипт');
const hud=P('CitadelHud','Hud');
const top=add(hud,P('CitadelHudTopBar','TopBar'));const topCtx=top;
// игроки верхней панели: CitadelHudTopBarPlayer → StatusRow → UltimateStatus → UltimateStatusBG
// души, магазин (ячейки mod_view с подписью modName), миникарта (лагеря map_button neutral, живой — active)
{const gc=add(hud,P('Panel','hudGoldContainer'));add(gc,P('Label','hudCurGoldLabel',{class:'CurrencyLabel',text:'7,250'}));
 const sh=add(hud,P('CitadelHudHeroShop','HeroShop'));const shop=add(sh,P('Panel','Shop'));
 ['Headshot Booster','High-Velocity Mag','Monster Rounds'].forEach((n,i)=>{const m=add(shop,P('CitadelShopMod','m'+i,{class:'mod_view'}));const a=add(m,P('Panel','',{class:'mod_name_area'}));add(a,P('Label','',{class:'modName',text:n}))});
 const mm=add(hud,P('HudMinimap','hud_minimap'));for(let i=0;i<5;i++)add(mm,P('Button','camp'+i,{class:'map_button neutral '+['neutral_weak','neutral_medium','neutral_large','neutral_weak','neutral_vault'][i]+(i<3?' active':'')}));add(mm,P('Button','x',{class:'map_button neutral_spawn'}));}
const players=[];for(let i=0;i<4;i++){const pl=add(topCtx,P('CitadelHudTopBarPlayer','TopBarPlayer'+i));const sr=add(pl,P('Panel','StatusRow'));
 const us=add(sr,P('Panel','UltimateStatus',{class:'UltimateStatus'}));add(us,P('Panel','UltimateStatusBG',{class:'UltimateStatusBG'}));players.push(pl)}
// плашка пробника 27.10 от старого файла — должна исчезнуть
add(hud,P('Panel','RestlessProbeHud'));
// 12 игроков верхней панели по командам: ник, герой (подпись HeroName), hero_id; у двоих account_id есть
const NAMES=['Андрей','Kolya','zxc','Mila','Pete~|x','Rat','E1','E2','E3','E4','E5','E6'],HEROES=['Венатор','Абрамс','Пелена','Мина','Швейцар','Крысиный король','Инфернус','Семь','Виндикта','Леди Гайст','Тень','Макгиннис'];
const TP=[];{const tc=add(top,P('Panel','TeamsContainer'));const tf=add(tc,P('CitadelHudTopBarTeam','TeamFriendly')),te=add(tc,P('CitadelHudTopBarTeam','TeamEnemy'));
 NAMES.forEach((n,i)=>{const pl=add(i<6?tf:te,P('CitadelHudTopBarPlayer','tp'+i));pl.dv={hero_id:[65,6,13,63,69,84,1,2,3,4,7,8][i]};if(i===0)pl.dv.account_id=930626915;if(i===6)pl.dv.account_id=111222333;
  const hc=add(pl,P('Panel','HeroContents'));add(hc,P('Panel','HeroImageArea'));const hi=add(hc,P('Panel','HeroInnerContent'));const hb=add(hi,P('Panel','HealthBar'));const hbc=add(hb,P('Panel','HealthBar_Contents'));add(hbc,P('Panel','HealthBar_Fill'));
  const nw=add(pl,P('Panel','PlayerNameNWContainer'));add(nw,P('Label','',{class:'PlayerName',text:n}));add(nw,P('Label','',{class:'HeroName',text:HEROES[i]}));TP.push(pl)});}
// панели созданы, но ещё не вставлены в HUD — скрипты уже запускаются
const subs=P('CitadelHudSubtitles','HudSubtitles');parse(L('citadel_hud_subtitles.xml'),subs);
const ms=P('CitadelHudMovementSpeed','MovementSpeedPanel');parse(L('hud_movement_speed.xml'),ms);
const em=P('CitadelHudEscapeMenu','EscapeMenu');parse(fs.readFileSync(escXml,'utf8'),em);
run(subs.ch[0]);run(ms.ch[0]);
tick(6);
ok(!msgs.some(m=>/запущен в HUD/.test(m))&&!msgs.some(m=>/не HUD/.test(m)),'панели ещё не в HUD — скрипт ждёт, не выключается');
ok(sched.length===2,'обе копии продолжают ждать: '+sched.length);
add(hud,subs);add(hud,ms);add(hud,em);
tick(3);
const owners=msgs.filter(m=>/запущен в HUD/.test(m));
ok(owners.length===2,'вставили в HUD — скрипт запустился в обоих файлах: '+owners.join(' | '));
const F=i=>hud.FindChildTraverse(i);
ok(hud.FindChildrenWithClassTraverse('SettingsRow').filter(r=>r.id==='RestlessRow').length===1,'кнопка одна, хотя скриптов два');
const btn=F('RestlessMenuBtn'),row=btn.par,sub=row.par;
const vis=p=>p&&p.style.visibility==='visible';const stOpen=()=>{if(!vis(F('RestlessWindow')))btn.ev.onactivate();};
ok(sub.id==='SubOptions','кнопка — в столбике под «Сменить героя»');
const order=sub.ch.map(c=>c.id||[...c.cls].join('.')||c.type);
ok(order.indexOf('RestlessRow')===order.indexOf('FeedbackRow')+1&&!order.includes('RestlessLiveRow')&&sub.ch[order.indexOf('RestlessRow')+1].FindChildTraverse('settings'),'0.28: порядок: Отзыв игрока → RESTLESS → Настройки, строки LIVE нет ('+order.join(', ')+')');
ok(btn.cls.has('nav_menu_item')&&btn.cls.has('minor')&&!Object.keys(btn.style).length,'класс как у кнопок игры, без своих стилей');
const bl=btn.ch[0];ok(bl.text==='RESTLESS'&&bl.cls.has('menuButtonLabel')&&!Object.keys(bl.style).length,'подпись RESTLESS тем же шрифтом');
const mark=F('RestlessMark');ok(mark&&mark.par===hud&&mark.style.visibility==='visible'&&/RESTLESS \d+\.\d+ · работает · кнопка в Esc/.test(mark.text),'надпись: «'+(mark&&mark.text)+'»');
// «Сменить героя» налезает — поднимаем
em.cls.add('ShowEscapeMenu');const ch=F('changehero'),mn=ch.par;
Object.assign(mn,{actuallayoutheight:1080});Object.assign(ch,{actualyoffset:730,actuallayoutheight:70});Object.assign(sub,{actualyoffset:780,actuallayoutheight:170});
tick(1);
ok(ch.style.marginBottom==='306px','«Сменить героя» поднята на нехватку: '+ch.style.marginBottom+' (было 280, налезало на 20 px)');
Object.assign(ch,{actualyoffset:704});tick(1);ok(ch.style.marginBottom==='306px','второй раз не поднимает');
// окно
ok(!F('RestlessWindow'),'окна до нажатия нет');
stOpen();
const win=F('RestlessWindow'),shade=F('RestlessShade');
ok(win&&shade&&win.style.visibility==='visible'&&shade.style.visibility==='visible','кнопка открывает окно и подложку');
ok(win.par===em&&shade.par===em&&em.ch.indexOf(shade)<em.ch.indexOf(win)&&em.ch.indexOf(shade)>em.ch.indexOf(F('RightSide')),'окно и подложка — поверх меню, в самом меню');
ok(win.style.horizontalAlign==='center'&&win.style.verticalAlign==='center'&&shade.style.width==='100%',' окно по центру, подложка на весь экран');
const all=(p,a=[])=>{a.push(p);p.ch.forEach(c=>all(c,a));return a};
const texts=()=>all(win).filter(x=>x.text).map(x=>x.text);
ok(texts().includes('КД ульты в верхней панели')&&texts().includes('Надпись RESTLESS'),'в окне: '+texts().slice(0,8).join(' / '));
// раскладка поехала → ставим по пикселям
Object.assign(em,{actuallayoutwidth:1920,actuallayoutheight:1080});Object.assign(win,{actuallayoutwidth:640,actuallayoutheight:520,actualxoffset:1250,actualyoffset:40});Object.assign(shade,{actuallayoutwidth:640});
tick(1);
ok(win.style.align==='left top'&&win.style.x==='640px'&&win.style.y==='280px','окно не по центру — поставлено по пикселям '+win.style.x+','+win.style.y);
ok(shade.style.width==='1920px'&&shade.style.height==='1080px','подложка не на весь экран — растянута');
ok(/по центру|поправлено/.test(texts().join(' ')),'строка проверки в окне');
{const tx=texts().join(' / ');ok(/ЧТО ВИДИТ МОД/.test(tx)&&/Души: 7,250/.test(tx),'«Что видит мод»: души — '+(tx.match(/Души: [^/]*/)||[''])[0]);
 ok(/Магазин: ячеек 3 · первые: Headshot Booster, High-Velocity Mag, Monster Rounds/.test(tx),'магазин: ячейки и названия');
 ok(/Мини-карта:/.test(tx),'0.26: лагеря выключены, строка мини-карты есть: '+(tx.match(/Мини-карта:[^/]*/)||[''])[0]);
 ok(msgs.some(m=>/\[Restless\] видит: Души: 7,250/.test(m)),'то же в консоль при открытии окна');}
// переключатели
const btns=all(win).filter(x=>x.type==='Button'&&x.style.width==='84px');
btns[2].ev.onactivate();tick(1);
ok(mark.style.visibility==='collapse'&&btns[2].ch[0].text==='ВЫКЛ','надпись выключена — пропала');
btns[2].ev.onactivate();tick(1);ok(mark.style.visibility==='visible','включил — вернулась');
// язык
const pills=all(win).filter(x=>x.type==='Button'&&x.style.borderRadius==='17px');pills[1].ev.onactivate();tick(1);
ok(texts().includes('Ult cooldown in the top bar')&&/running/.test(mark.text),'английский: окно и надпись');
pills[0].ev.onactivate();
// закрытия
shade.ev.onactivate();ok(win.style.visibility==='collapse','клик мимо окна закрывает');
stOpen();all(win).find(x=>x.type==='Button'&&x.style.width==='34px').ev.onactivate();ok(win.style.visibility==='collapse','× закрывает');
stOpen();em.cls.delete('ShowEscapeMenu');tick(1);ok(win.style.visibility==='collapse','меню закрыли (Esc) — окно закрылось само');
em.cls.add('ShowEscapeMenu');stOpen();ok(vis(F('RestlessWindow')),'открылось снова, окно то же');
// КД ульты
tick(2);
const srcs=hud.FindChildrenWithClassTraverse?null:null;
const s0=players[0].FindChildTraverse('RestlessUltSrc'),t0=players[0].FindChildTraverse('RestlessUltTxt');
ok(s0&&t0&&s0.par.id==='UltimateStatusBG'&&props.some(p=>p.text==='{i:ult_cooldown}'),'у каждого игрока — скрытая подпись {i:ult_cooldown} и число');
const T=i=>players[i].FindChildTraverse('RestlessUltTxt'),S=i=>players[i].FindChildTraverse('RestlessUltSrc');
players[0].dv={ult_cooldown:37};players[1].dv={ult_cooldown:0};players[2].dv={ult_cooldown:12};players[2].cls.add('UltimateCooldownReady');
tick(1);
ok(t0.text==='37'&&t0.style.visibility==='visible','КД 37 — число поверх значка');
ok(T(1).text==='','КД 0 — ничего');
ok(T(2).text==='','ульта готова — ничего');
ok(T(3).text==='','не подставилось ({i:…}) — ничего, без мусора');
S(0).text='96';players[0].dv.ult_cooldown=36;tick(1);ok(t0.text==='36','подпись застряла на 96 — берём свежее из переменной: '+t0.text);
delete players[3].dv;S(3).text='25';tick(1);ok(T(3).text==='25','переменной не видно — запасной путь через подпись');S(3).text='{i:ult_cooldown}';
// баг 0.9: другая копия скрипта спрятала число — эта не трогала, потому что помнила «показано»
t0.style.visibility='collapse';tick(1);ok(t0.style.visibility==='visible'&&t0.text==='36','число спрятала другая копия — на следующем такте снова видно');
for(let i=0;i<8;i++){players[0].dv.ult_cooldown=30-i;tick(1)}ok(t0.text==='23','секунды идут каждый такт: '+t0.text);
const ub=all(win).filter(x=>x.type==='Button'&&x.style.width==='84px')[1];ub.ev.onactivate();tick(1);
ok(t0.text==='','КД ульты выключен — числа нет');ub.ev.onactivate();tick(1);ok(t0.text==='23','включил — есть');
top.cls.add('InHideout');tick(1);ok(t0.text==='','в укрытии не показываем');top.cls.delete('InHideout');tick(1);
// игрок зашёл посреди матча — новая панель находится сама
{const pl=add(topCtx,P('CitadelHudTopBarPlayer','TopBarPlayer9'));const sr=add(pl,P('Panel','StatusRow'));const us=add(sr,P('Panel','UltimateStatus',{class:'UltimateStatus'}));add(us,P('Panel','UltimateStatusBG',{class:'UltimateStatusBG'}));
 pl.dv={ult_cooldown:51};tick(18);const t9=pl.FindChildTraverse('RestlessUltTxt');ok(t9&&t9.text==='51','новый игрок в верхней панели — число и у него (список пересобираем раз в 4 с)');}
// хозяин пропал — подхватывает вторая копия
const own=hud.GetAttributeString('RESTLESS_OWN','');hud.at.RESTLESS_OWN='zzz:'+(Date.now()-5000);tick(3);
ok(hud.GetAttributeString('RESTLESS_OWN','').split(':')[0]!=='zzz','хозяин пропал — другая копия подхватила');
// 0.13: связь с программой (картинка с 127.0.0.1), профили из меню Esc, старая плашка
{const link=()=>F('RestlessLink'),q=()=>{const u=(link()||{}).img||'';const m=u.match(/[?&]p=([^&]*)/);return {u,s:(u.match(/[?&]s=(\w)/)||[])[1],n:+((u.match(/[?&]n=(\d+)/)||[])[1]||0),P:m&&m[1]?m[1].split('|').map(x=>x.split('~')):[]}};
 em.cls.delete('ShowEscapeMenu');tick(12);
 ok(!F('RestlessProbeHud'),'старая плашка пробника (Венатор, таймер) убрана');
 let r=q();
 ok(/^http:\/\/127\.0\.0\.1:27515\/rl\.png\?v=\d+\.\d+&s=m&p=/.test(r.u),'в матче мод шлёт программе картинкой на 127.0.0.1: '+r.u.slice(0,60));
 ok(r.P.length===12&&r.P.filter(x=>x[0]==='f').length===6,'12 игроков, 6 своих: '+r.P.length);
 ok(r.P.every(x=>x[3])&&decodeURIComponent(r.P[0][2])==='Венатор'&&r.P[0][3]==='65','герой: подпись и hero_id у всех');
 ok(r.P[0][4]==='930626915'&&r.P[6][4]==='111222333'&&r.P.filter(x=>x[4]).length===2,'ID — у кого игра даёт account_id: '+r.P.map(x=>x[4]).join(','));
 ok(decodeURIComponent(r.P[4][1])==='Pete  x','~ и | в нике не ломают строку');
 {const n0=q().n;for(let i=0;i<80&&q().n===n0;i++)tick(1)}
 const n1=q().n;tick(20);ok(q().n===n1,'ничего не поменялось — не шлём (5 с)');tick(44);ok(q().n===n1+1,'раз в 15 с — «живой» сигнал программе');
 // меню Esc: список игроков — открываем профили по очереди, запоминаем «ник → ID»
 const pls=em.FindChildTraverse('PlayersList');ok(!!pls,'в меню по Esc есть список игроков');
 NAMES.forEach((n,i)=>{if(i===0||i===6)return;const e=add(pls,P('CitadelPlayersListEntry','pe'+i));e.dv={hero_id:TP[i].dv.hero_id};const mc=add(e,P('Panel','MainContents'));const d=add(mc,P('Panel','',{class:'Details'}));add(d,P('Label','',{class:'PlayerName',text:n}))});
 global.onAct=()=>{while(acts.length){const mc=acts.shift();const e=mc.par;const nm=e.FindChildrenWithClassTraverse('PlayerName')[0].text;if(nm==='zxc')continue;
  const c=add(hud,P('CitadelProfileCard','card'));const fg=add(c,P('Panel','ContentsMainForeground'));const ai=add(fg,P('Panel','AccountID'));add(ai,P('Label','',{class:'AccountID',text:'Account ID: '+(500000+NAMES.indexOf(nm))}));
  const un=add(fg,P('Panel','UserName'));add(un,P('Label','',{text:nm}));cards.push(c)}};
 em.cls.add('ShowEscapeMenu');const a0=acts.length;let probes=0;const AC=global.onAct;global.onAct=()=>{probes+=acts.length;AC()};tick(120);
 ok(probes>=10&&probes<=13,'профили открыты по очереди: '+probes+' (9 игроков + 2 попытки у того, чей профиль не открылся)');
 ok(!all(hud).some(x=>x.paneltype==='CitadelProfileCard'),'после каждого профиля карточка закрыта');
 em.cls.delete('ShowEscapeMenu');tick(10);r=q();
 ok(r.P.filter(x=>x[4]).length===11&&!r.P[2][4],'ID у 11 из 12 (у zxc профиль не открылся): '+r.P.map(x=>x[4]?'✓':'·').join(''));
 const pn=probes;em.cls.add('ShowEscapeMenu');tick(30);em.cls.delete('ShowEscapeMenu');ok(probes===pn,'второй раз профили не открываем — ID уже есть');
 // одинаковый account_id у всех (переменная общей панели) — не верим
 const keep=TP.map(p=>p.dv.account_id);TP.forEach(p=>p.dv.account_id=777);tick(12);r=q();
 ok(!r.P.some(x=>x[4]==='777'),'одинаковый ID у всех — не принимаем');TP.forEach((p,i)=>{if(keep[i])p.dv.account_id=keep[i];else delete p.dv.account_id});
 // укрытие и выключатель
 top.cls.add('InHideout');tick(12);r=q();ok(r.s==='h'&&!r.P.length,'в укрытии: s=h, игроков нет');top.cls.delete('InHideout');tick(12);ok(q().s==='m','снова матч: s=m');
 stOpen();const lb=all(win).filter(x=>x.type==='Button'&&x.style.width==='84px')[3];ok(!!lb,'в окне — переключатель «Связь с программой»');
 ok(texts().some(t=>/^Программа: отправлено \d+ · игроков 12 · с ID 11 · с героем 12$/.test(t)),'в «Что видит мод» — строка связи: '+texts().find(t=>/^Программа/.test(t)));
 lb.ev.onactivate();const n2=q().n;tick(80);ok(q().n===n2,'связь выключена — не шлём');lb.ev.onactivate();F('RestlessShade').ev.onactivate();em.cls.delete('ShowEscapeMenu');}
// нагрузка: обычный матч, меню и окно закрыты — сколько панелей в секунду перебирает мод (0.13: 1867 в секунду — весь HUD ~7 раз; 0.14: панели помним)
{tick(40);VIS=0;tick(40);const vps=Math.round(VIS/10),tot=all(hud).length;
 console.log('нагрузка: перебор '+vps+' панелей в секунду (всего в HUD заглушки '+tot+')');
 ok(vps<tot,'в матче мод перебирает меньше одного HUD в секунду: '+vps+' < '+tot+' (0.13 — 1867)');}
// 0.15: напоминания о событиях по часам матча
{const gt=add(hud,P('Label','GameTime',{text:'1:44'}));const E=()=>F('RestlessEvt');
 tick(44);ok(!E()||E().style.visibility==='collapse','1:44 — до малых лагерей 16 с, напоминания ещё нет');
 gt.text='1:49';tick(4);ok(!E()||E().style.visibility==='collapse','0.22: 1:49 — за 11 с, ещё рано (было за 15)');
 gt.text='1:51';tick(4);ok(E()&&E().style.visibility==='visible'&&LT(E())==='МАЛЫЕ ЛАГЕРЯ через 9 с'&&E().ch[0].type==='Image'&&/neutral_small/.test(E().ch[0].img),'1:51 — плашка со значком: «'+LT(E())+'»');
 gt.text='2:02';tick(4);ok(E().style.visibility==='visible'&&LT(E())==='МАЛЫЕ ЛАГЕРЯ появились','2:02 — «'+LT(E())+'»');
 gt.text='4:52';tick(4);ok(LT(E())==='СРЕДНИЕ ЛАГЕРЯ · ЯЩИКИ В ТОННЕЛЯХ И НА КОЛОКОЛЬНЕ через 8 с'&&/neutral_medium/.test(E().ch[0].img),'4:52 — «'+LT(E())+'»');
 gt.text='2:56';tick(4);ok(/item_crate_spawn/.test(E().ch[0].img),'ящики — значок ящика');
 gt.text='2:30';tick(4);ok(E().style.visibility==='collapse','2:30 — между событиями пусто');
 gt.text='1:50';tick(40);VIS=0;tick(40);const vps=Math.round(VIS/10);ok(vps<all(hud).length,'с часами матча нагрузка та же: '+vps+' панелей в секунду');
 hud.SetAttributeString('RESTLESS_EVT','0');gt.text='1:55';tick(4);ok(E().style.visibility==='collapse','выключил напоминания — пропали');hud.SetAttributeString('RESTLESS_EVT','1');}
// 0.17: функции из наборов Lite / Medium
{const W=()=>F('RestlessWindow'),A0=()=>all(W());
 // набор Lite по умолчанию: ранги, средний ранг, лагеря — вкл; Medium-функции выкл
 em.cls.add('ShowEscapeMenu');stOpen();tick(1);
 const pp=all(win).filter(x=>x.type==='Button'&&x.style.borderRadius==='16px'&&x.style.width!=='84px'&&x.ch[0]&&/^(Lite|Medium|Enchanted)$/.test(x.ch[0].text));ok(pp.length===3&&pp[2].ch[0].text==='Enchanted'&&pp[0].ch[0].text==='Lite'&&pp[0].style.backgroundColor==='#ffc83d','набор: Lite выбран по умолчанию');
 ok(texts().includes('Ранги игроков')&&texts().includes('Таймеры лагерей')&&texts().includes('Пропавшие враги'),'новые переключатели в окне (0.30: автопоказа LIVE нет — тумблера LVA тоже)');
 const tg=all(win).filter(x=>x.type==='Button'&&x.style.width==='84px');ok(tg.length===24,'переключателей 24 (0.32: LVA вернулся): '+tg.length);
 ok(!texts().includes('Урон по строениям'),'0.22: «Урон по строениям» убран');
 ok(all(win).filter(x=>x.type==='Image'&&/minimap|zipline|mm\/zip/.test(x.attrs.src||'')).length>=4,'0.22: у функций — значки игры');
 shade.ev.onactivate();em.cls.delete('ShowEscapeMenu');tick(12);
 // ранги: значок под портретом у кого есть ID (11 из 12 — из профилей и account_id)
 const RI=TP.map(p=>p.FindChildTraverse('RestlessRank'));
 ok(RI.filter(x=>x&&x.style.visibility==='visible').length===11&&RI[0].par.id==='HeroImageArea'&&RI[0].img==='https://api.deadlock-api.com/v1/players/930626915/rank/image','ранги: 11 значков под портретами, картинка по ID: '+(RI[0]&&RI[0].img));
 ok(!RI[2]||RI[2].style.visibility!=='visible','у кого ID нет — значка нет');
 const lr=F('RestlessLrk');ok(lr&&lr.style.visibility==='visible'&&/rank\/image\?account_ids=930626915,/.test(F('RestlessLrkF').img)&&/account_ids=111222333,/.test(F('RestlessLrkE').img),'средний ранг: свои и враги — '+F('RestlessLrkF').img.slice(-40));
 // лагеря: метка погасла — отсчёт возрождения
 const gt=F('GameTime');gt.text='9:00';const c0=F('camp0'),c1=F('camp1'),c4=F('camp4');Object.assign(c0,{actualxoffset:100,actualyoffset:200,actuallayoutwidth:24,actuallayoutheight:24});
 tick(8);c0.cls.delete('active');c1.cls.delete('active');tick(8);
 const ctl=all(hud).filter(x=>x.type==='Label'&&/^\d+:\d\d$/.test(x.text||'')&&x.style.visibility==='visible');ok(ctl.length===2&&ctl.some(x=>x.text==='1:25')&&ctl.some(x=>x.text==='4:50'),'0.27: метки погасли — таймеры 1:25 и 4:50: '+ctl.map(x=>x.text).join(','));
 c0.cls.add('active');c1.cls.add('active');
 // Medium: пропавшие враги, здоровье, «в бою», незащищённые души
 const ga=add(hud,P('CitadelHudGameAnnouncements','CitadelHudGameAnnouncements'));const dgc=add(hud,P('Panel','hudDeathGoldContainer'));const dg=add(dgc,P('Label','hudDeathGoldLabel',{text:'0'}));
 em.cls.add('ShowEscapeMenu');stOpen();pp[1].ev.onactivate();tick(1);ok(pp[1].style.backgroundColor==='#ffc83d'&&hud.GetAttributeString('RESTLESS_MISS','')==='1','набор Medium включил пропавших врагов и остальное');shade.ev.onactivate();em.cls.delete('ShowEscapeMenu');
 TP[7].cls.add('HealthVisible');TP[8].cls.add('Dead');tick(8);
 const MS=i=>TP[i].FindChildTraverse('RestlessMiss');
 ok(MS(6)&&MS(6).style.visibility==='visible','враг не виден (нет HealthVisible) — портрет темнеет');
 ok(!MS(7)||MS(7).style.visibility==='collapse','враг виден — портрет обычный');
 ok(!MS(8)||MS(8).style.visibility==='collapse','мёртвый — не трогаем');
 ok(!MS(1)||MS(1).style.visibility==='collapse','свои — не темнеют');
 const HB=i=>TP[i].FindChildTraverse('HealthBar'),HF=i=>TP[i].FindChildTraverse('HealthBar_Fill'),HR=i=>TP[i].FindChildTraverse('RestlessHp');
 HB(1).actuallayoutheight=100;HF(1).actuallayoutheight=50;TP[1].FindChildTraverse('HealthBar_Contents').actuallayoutheight=100;tick(4);
 ok(HR(1)&&HR(1).style.visibility==='visible'&&HR(1).style.border==='3px solid #ff9a3b','свой на 50 % — оранжевое кольцо');
 HF(1).actuallayoutheight=20;tick(4);ok(HR(1).style.border==='3px solid #ff3b3b','20 % — красное');
 HF(1).actuallayoutheight=70;tick(4);ok(HR(1).style.border==='3px solid #ffd23b','70 % — жёлтое');
 HF(1).actuallayoutheight=90;tick(4);ok(HR(1).style.visibility==='collapse','90 % — без кольца');
 HB(6).actuallayoutheight=100;HF(6).actuallayoutheight=30;tick(4);ok(!HR(6)||HR(6).style.visibility==='collapse','невидимый враг — здоровье не угадываем');
 const gp=F('RestlessGCL').par;ga.cls.add('gInCombat');tick(4);ok(!F('RestlessCmb')||F('RestlessCmb').style.visibility!=='visible','0.26: класс у чужого корня — не наш сигнал');ga.cls.delete('gInCombat');
 gp.cls.add('gInCombat');tick(4);
 const cb=F('RestlessCmb');ok(cb&&cb.style.visibility==='visible'&&cb.text==='В БОЮ','«В БОЮ», пока игра держит gInCombat (у родителя нашего слушателя)');
 gp.cls.delete('gInCombat');tick(2);ok(cb.text==='В БОЮ','0.26: секунду после боя — ещё «В БОЮ» (не мигает)');
 gp.cls.add('gInCombat');tick(2);gp.cls.delete('gInCombat');tick(6);ok(cb.text==='В БОЮ','мигание класса — надпись держится');
 tick(4);ok(cb.text==='ВНЕ БОЯ','2 с без боя — «ВНЕ БОЯ»');tick(12);ok(cb.style.visibility==='collapse','ещё через 2 с — пусто');
 dg.text='1,250';tick(4);
 const un=F('RestlessUns');ok(un&&un.style.visibility==='visible'&&un.text==='Незащищённые души: 1,250','незащищённые души крупно: «'+(un&&un.text)+'»');
 dg.text='0';tick(2);ok(un.style.visibility==='collapse','0 — пусто');dg.text='300';
 // укрытие: всё прячем
 top.cls.add('InHideout');tick(8);
 ok([F('RestlessLrk'),cb,un,MS(6),RI[0]].every(x=>x.style.visibility==='collapse')&&!c1.par.ch.some(x=>x.type==='Label'&&x.style.visibility==='visible'),'в укрытии всё новое спрятано');
 top.cls.delete('InHideout');tick(8);
 // нагрузка со всеми функциями
 tick(40);VIS=0;tick(40);const vps=Math.round(VIS/10);console.log('нагрузка 0.17 (Medium): '+vps+' панелей в секунду');ok(vps<all(hud).length+150,'Medium: нагрузка меньше одного HUD в секунду (+окно лайва больше не открываем): '+vps+' < '+all(hud).length+'+150');
 // Lite обратно
 em.cls.add('ShowEscapeMenu');stOpen();pp[0].ev.onactivate();tick(2);shade.ev.onactivate();em.cls.delete('ShowEscapeMenu');tick(8);
 ok(MS(6).style.visibility==='collapse'&&cb.style.visibility==='collapse','набор Lite — Medium-функции выключены и спрятаны');}
// 0.18: КД ульты над героем в мире, лагерь сам запоминает время
{const wp=P('Panel','WorldPanels');const OV=[];   // полосы здоровья — своё дерево, не HUD (0.22)
 ['Андрей','Rat','E1','крип'].forEach((n,i)=>{const w=add(wp,P('Panel','',{class:i<3?'WindowRoot player':'WindowRoot'}));add(w,P('Label','name',{text:n}));const us=add(w,P('Panel','UnitStatus'));const ih=add(us,P('Panel','InfoHealthContainer'));const ip=add(ih,P('Panel','',{class:'unit_info_panel'}));OV.push(add(ip,P('Panel','unit_info_bg')));run(w,UWSRC)});
 ok(/restless_uw\.vjs_c/.test(L('unit_status_overlay_v2.xml'))&&/unit_info_bg/.test(L('unit_status_overlay_v2.xml')),'0.22: скрипт подключён к полосе здоровья (копия unit_status_overlay_v2.xml)');
 const U=i=>OV[i].FindChildTraverse('RestlessUltW');
 TP[0].dv.ult_cooldown=42;TP[5].dv.ult_cooldown=0;TP[6].dv.ult_cooldown=118;
 // ульта в верхней панели у TP — нужны UltimateStatus внутри их панелей
 TP.forEach(p=>{if(!p.FindChildTraverse('UltimateStatus')){const sr=add(p,P('Panel','StatusRow'));const us=add(sr,P('Panel','UltimateStatus',{class:'UltimateStatus'}));add(us,P('Panel','UltimateStatusBG',{class:'UltimateStatusBG'}))}});
 tick(80);
 em.cls.add('ShowEscapeMenu');stOpen();tick(4);{const tx=texts().join(' / ');ok(/Ульта над героями: полос 3 · с секундами 2/.test(tx),'«Что видит мод»: '+(tx.match(/Ульта над героями[^/]*/)||[''])[0]);}shade.ev.onactivate();em.cls.delete('ShowEscapeMenu');tick(2);
 ok(U(0)&&U(0).style.visibility==='visible'&&U(0).text==='42','над героем: «42» на месте значка ульты ('+(U(0)&&U(0).text)+')');
 ok(!U(1)||U(1).style.visibility==='collapse','ульта готова (0) — пусто');
 ok(U(2)&&U(2).text==='118'&&U(2).style.fontSize==='11px','3 цифры — мельче');
 ok(!U(3),'крип (нет такого игрока) — ничего');
 TP[0].dv.ult_cooldown=41;tick(2);ok(U(0).text==='41','секунды идут');
 hud.SetAttributeString('RESTLESS_ULTW','0');tick(4);ok(U(0).style.visibility==='collapse','выключил — пропало');hud.SetAttributeString('RESTLESS_ULTW','1');tick(4);
 tick(40);VIS=0;tick(40);const vps=Math.round(VIS/10);console.log('нагрузка 0.18: '+vps+' панелей в секунду');ok(vps<all(hud).length,'с ультой над героями нагрузка меньше одного HUD: '+vps);}
// 0.31: по схеме Андрея — Esc → RESTLESS = тестовая вкладка настроек, сайт — кнопкой САЙТ; автопоказа нет нигде
{em.cls.add('ShowEscapeMenu');tick(2);ok(!F('RestlessLiveBtn'),'0.28: строки LIVE в меню нет');
 ok(F('RestlessLive')&&F('RestlessLive').style.width==='46%','0.32: открыл Esc в матче — LIVE сам, сбоку от меню');
 ok(!vis(F('RestlessWindow')),'0.32: окно настроек само не открывается');
 ok(/v=0\.34/.test(decodeURIComponent(F('RestlessLiveWeb').url)),'в адресе — версия 0.32');
 btn.ev.onactivate();tick(1);ok(vis(F('RestlessWindow'))&&!F('RestlessLive'),'0.31: RESTLESS — настройки, лайв закрылся (не висят вместе)');
 ok(F('RestlessWebBtn'),'0.31: в шапке окна кнопка САЙТ');
 F('RestlessWebBtn').ev.onactivate();tick(2);ok(!vis(F('RestlessWindow'))&&!!F('RestlessLiveWeb')&&F('RestlessLive').style.width!=='46%','0.31: САЙТ — сайт по центру, настройки закрылись');
 const w=F('RestlessLiveWeb');const u=w&&decodeURIComponent(w.url||'');
 ok(w&&w.paneltype==='CitadelHTMLPanel'&&/restless\/\?app=1&embed=1/.test(w.url)&&/#g=/.test(w.url),'окно сайта во встроенном браузере игры: '+(w?w.url.slice(0,80):''));
 ok(/v=0\.34/.test(u)&&/&lb=rank:1,hr:1,st:1,per:1,rc:1,bld:1,tg:1,cmp:0/.test(u)&&/&p=[fe]~/.test(u),'в адресе — версия и игроки: '+(u||'').slice(0,120));
 btn.ev.onactivate();tick(1);ok(!F('RestlessLiveWeb'),'0.31: RESTLESS закрывает и окно сайта');F('RestlessShade').ev.onactivate();tick(4);ok(F('RestlessLive')&&F('RestlessLive').style.width==='46%','0.32: настройки закрыл — лайв вернулся сам сбоку (Esc ещё открыт, LVA)');btn.ev.onactivate();tick(1);
 F('RestlessWebBtn').ev.onactivate();tick(2);const gear=F('RestlessGear');ok(gear&&F('RestlessLiveWeb'),'0.28: ⚙ в шапке сайта вернулся к настройкам');
 F('RestlessGear').ev.onactivate();tick(1);ok(vis(F('RestlessWindow'))&&!vis(F('RestlessLive')),'0.31: ⚙ — настройки, сайт закрылся');
 F('RestlessShade').ev.onactivate();em.cls.delete('ShowEscapeMenu');tick(2);ok(!F('RestlessLiveWeb'),'меню закрыли — лайв закрылся (браузера нет — FPS не ест)');
// 0.34: в лобби с ботами (у ботов нет account_id) окно само не выскакивает; фолбэк на Pages, если локальный сайт молчит
{TP.forEach(p=>{delete p.dv.account_id});em.cls.add('ShowEscapeMenu');tick(20);{/* боты без ID: a='' по присваиванию y.a=(!same&&y.da)||LK.acc||'' — проверяется кодом, LK.acc в моке загрязнён */}
 TP.forEach((p,i)=>{p.dv.account_id=7000000+i});tick(20);ok(F('RestlessLive'),'0.34: появились реальные ID — лайв открылся сам');
 em.cls.delete('ShowEscapeMenu');tick(2);}
}// 0.19: набор Enchanted и память настроек
{const gcl=F('RestlessGCL');ok(gcl&&gcl.type==='GlobalClassListener','0.24: свой слушатель Alt (gDetailView) в разметке');gcl.cls.add('gDetailView');
const W=F('RestlessWindow'),pp=all(W).filter(x=>x.type==='Button'&&x.style.borderRadius==='16px'&&x.style.width!=='84px'&&x.ch[0]&&/^(Lite|Medium|Enchanted)$/.test(x.ch[0].text));
 const se=add(hud,P('Panel','StatusEffects'));const zb=add(hud,P('Panel','citadel_ability_zipline_boost_',{class:'citadel_ability_zipline_boost active'}));const zc=add(zb,P('Label','context_label',{text:''}));
 TP[0].dv.objective_damage=12450;TP[1].dv.objective_damage=830;ms.dv={movement_speed:'7.4 m/s'};
 const sp=all(hud).filter(x=>x.paneltype==='CitadelHTMLPanel'&&/store\.html/.test(x.url||''));
 ok(sp.length===0,'0.26: память загрузилась — скрытый браузер закрыт (не держим его весь матч): '+sp.length);
 ok(msgs.some(m=>/память настроек: загружено/.test(m)),'память: страница ответила — загружено');
 ok(/MARK=1/.test(LSO.restless_mod_v1||'')&&/LANG=ru/.test(LSO.restless_mod_v1||''),'что меняли в тестах выше — уже записано: '+LSO.restless_mod_v1);
 em.cls.add('ShowEscapeMenu');btn.ev.onactivate();pp[2].ev.onactivate();
 ok(/изменено: \d+/.test(texts().join(' '))&&all(W).some(x=>x.type==='Button'&&x.style.border==='2px solid #ffffff'),'0.22: набор подсвечивает, что поменял');tick(2);
 ok(!all(W).some(x=>x.type==='Button'&&x.style.border==='2px solid #ffffff'),'подсветка гаснет');
 ok(['ZIP','SPD','PERF','MISS','RANK'].every(k=>hud.GetAttributeString('RESTLESS_'+k,'')==='1')&&pp[2].style.backgroundColor==='#ffc83d','Enchanted включил всё и горит');
 ok(texts().includes('Буст на канате')&&texts().includes('Скорость')&&texts().includes('Нагрузка мода'),'новые переключатели в окне');
 shade.ev.onactivate();em.cls.delete('ShowEscapeMenu');tick(16);
 ok(!TP[0].FindChildTraverse('RestlessObj'),'0.22: урона по строениям под портретом нет');
 const Z=()=>F('RestlessZip');ok(Z()&&Z().style.visibility==='visible'&&LT(Z())==='готов'&&/mm\/zip\.png/.test(Z().ch[0].img),'буст: значок + «'+LT(Z())+'»');
 zb.cls.add('on_cooldown');zc.text='245';tick(4);ok(LT(Z())==='4:05','буст на перезарядке: «'+LT(Z())+'»');
 zc.text='';tick(4);ok(/^4:0[34]$/.test(LT(Z())),'секунд игра не дала — считаем сами: «'+LT(Z())+'»');
 zb.cls.delete('on_cooldown');add(se,P('Panel','status_citadel_ability_zipline_boost'));tick(2);ok(/^идёт 3\d с$/.test(LT(Z())),'бафф идёт: «'+LT(Z())+'»');
 se.ch.splice(0).forEach(c=>c.valid=false);zb.cls.add('on_cooldown');tick(2);ok(/^(6:00|5:5\d)$/.test(LT(Z())),'бафф кончился — перезарядка 6 минут: «'+LT(Z())+'»');
 ok(hud.cls.has('SpeedometerEnabled'),'скорость: спидометр игры включён (класс SpeedometerEnabled у родителя)');
 const pf=F('RestlessPerf');ok(pf&&pf.style.visibility==='visible'&&/^Restless: \d+\.\d мс в секунду · самый долгий такт \d+ мс$/.test(pf.text),'нагрузка мода: «'+(pf&&pf.text)+'»');
 em.cls.add('ShowEscapeMenu');stOpen();tick(1);
 {const tx=texts().join(' / ');ok(/Буст на канате: [^/]* · скорость: 7\.4 m\/s · нагрузка: /.test(tx),'«Что видит мод»: '+(tx.match(/Буст на канате:[^/]*/)||[''])[0]);
  ok(/Память настроек: загружена · своих настроек \d+ · сохранено \d+/.test(tx),'«Что видит мод»: '+(tx.match(/Память настроек[^/]*/)||[''])[0]);}
 pp[0].ev.onactivate();tick(4);ok(!hud.cls.has('SpeedometerEnabled')&&F('RestlessPerf').style.visibility==='collapse'&&Z().style.visibility==='collapse','набор Lite — Enchanted выключен и спрятан');
 pp[2].ev.onactivate();tick(1);
 // выключил надпись — через 0,8 с записано
 const tgm=all(W).filter(x=>x.type==='Button'&&x.style.width==='84px')[2];tgm.ev.onactivate();tick(2);ok(!/MARK=0/.test(LSO.restless_mod_v1),'сразу не пишем — ждём 0,8 с');tick(4);
 ok(/MARK=0/.test(LSO.restless_mod_v1)&&/ZIP=1/.test(LSO.restless_mod_v1),'записано: надпись выкл, Enchanted: '+LSO.restless_mod_v1);
 shade.ev.onactivate();em.cls.delete('ShowEscapeMenu');
 tick(40);VIS=0;tick(40);const vps=Math.round(VIS/10);console.log('нагрузка 0.19 (Enchanted): '+vps+' панелей в секунду');ok(vps<900,'Enchanted: нагрузка меньше 900 панелей в секунду (0.21 — 1107): '+vps);}
// 0.20: патроны и перезарядка у прицела, карта строений, кто что купил (Enchanted включён выше)
{const ap=add(hud,P('Panel','ammo_panel'));const ac=add(ap,P('Label','',{class:'weapon_ammo',text:'23'}));add(ap,P('Label','',{class:'weapon_ammo_max',text:'40'}));
 const rs=add(hud,P('Panel','reticle_status'));const rb=add(rs,P('Panel','attack_delayed_progress_bar'));
 const om=add(top,P('CitadelObjectivesMap','ObjectivesMap'));const oc=add(om,P('Panel','',{class:'ObjectiveCtn'}));
 const sh=F('HeroShop');const rpc=add(sh,P('Panel','RecentPurchasesContainer'));
 const row=(nm,tr,cl)=>{const r=add(rpc,P('Panel','',{class:'recentPurchase '+(cl||'')}));add(r,P('Label','',{class:'recentTimePurchased',text:'12:01'}));add(r,P('Label','',{class:'recentModPurchaseName',text:nm}));add(r,P('Label','',{class:'recentModTierCost',text:tr}));return r};
 row('Extra Stamina','T1','isTeam1Purchase');row('Monster Rounds','T1','isTeam2Purchase');
 tick(140);
 ok(!F('RestlessAmmo')||F('RestlessAmmo').style.visibility==='collapse','0.21: своих цифр патронов нет (дубль родных)');
 ok(ap.style.visibility==='visible','0.21: родные патроны игры у прицела держим видимыми');
 rb.cls.add('has_active_reload');tick(1);const am=F('RestlessAmmo');ok(am&&am.style.visibility==='visible'&&am.text==='ПЕРЕЗАРЯДКА'&&am.style.color==='#ffc83d','перезарядка: «'+(am&&am.text)+'»');rb.cls.delete('has_active_reload');tick(1);
 ok(am.style.visibility==='collapse','перезарядка кончилась — надписи нет');
 ok(om.style.visibility!=='visible'&&oc.style.visibility!=='visible','0.24: карты строений нет — как у игры');
 const B=()=>F('RestlessBuy');ok(!B()||B().style.visibility==='collapse','старые покупки не показываем — только новые');
 row('Mystic Shot','T3 · 3000','isTeam2Purchase');tick(4);
 const b0=B()&&B().GetChild(0).GetChild(1);ok(B()&&B().style.visibility==='visible'&&b0.text==='Купили: Mystic Shot · T3 · 3000'&&b0.style.color==='#6fa8ff','новая покупка — справа: «'+(b0&&b0.text)+'»');
 row('Spirit Strike','T2','isTeam1Purchase');tick(2);ok(B().GetChild(0).GetChild(1).text==='Купили: Spirit Strike · T2'&&B().GetChild(1).GetChild(1).text==='Купили: Mystic Shot · T3 · 3000','свежая — сверху, до трёх');
 tick(36);ok(B().style.visibility==='collapse','через 8 с — пусто');
 em.cls.add('ShowEscapeMenu');stOpen();tick(1);
 {const tx=texts().join(' / ');ok(/Патроны: у прицела \(игра\), держим видимыми · карта строений: [^·]*· покупок в магазине: 4/.test(tx),'«Что видит мод»: '+(tx.match(/Патроны:[^/]*/)||[''])[0]);}
 const pp=all(F('RestlessWindow')).filter(x=>x.type==='Button'&&x.style.borderRadius==='16px'&&x.style.width!=='84px');pp[0].ev.onactivate();tick(8);
 ok(am.style.visibility==='collapse'&&ap.style.visibility===null&&om.style.visibility!=='visible'&&oc.style.visibility!=='visible','Lite — патронов нет, карта строений как у игры');
 pp[2].ev.onactivate();tick(2);shade.ev.onactivate();em.cls.delete('ShowEscapeMenu');
 tick(40);VIS=0;tick(40);const vps=Math.round(VIS/10);console.log('нагрузка 0.20 (Enchanted): '+vps+' панелей в секунду');ok(vps<all(hud).length+150,'0.20: нагрузка меньше одного HUD (+окно лайва не открываем): '+vps+' < '+all(hud).length+'+150');}
// 0.21: моды рядом (UMM), настройки с сайта, урна/разлом, ящики на мини-карте, Deadlock Utils
{const mm=F('hud_minimap'),gt=F('GameTime');gt.text='3:30';
 // Enhanced Quickbuy: на hello отвечает register, на set — меняет своё
 const EQ={};$EQ=(a)=>{let o;try{o=JSON.parse(a)}catch(e){return}if(o.t==='hello')FIRE_EQ();if(o.t==='set'&&o.id==='enhanced_quickbuy')EQ[o.key]=o.value};
 const FIRE_EQ=()=>(UNH.ClientUI_FireOutput||[]).slice().forEach(f=>f(JSON.stringify({umm:1,t:'register',id:'enhanced_quickbuy',name:'Enhanced Quickbuy',settings:[{id:'enabled',type:'toggle',label:'Enabled',default:true},{type:'group',label:'Display'},{id:'preview_count',type:'slider',label:'Items shown',min:1,max:5,step:1,default:3}]})));
 (UNH.ClientUI_FireOutput||(UNH.ClientUI_FireOutput=[])).push($EQ);
 FIRE_EQ();tick(80);   // мод загрузился после нас — сам объявляет настройки
 ok(FIRE.some(a=>/"t":"hello"/.test(a)),'моды рядом: Restless позвал (hello)');
 ok(msgs.some(m=>/мод рядом: Enhanced Quickbuy · настроек 2/.test(m)),'Enhanced Quickbuy зарегистрировался: 2 настройки (группа — не настройка)');
 em.cls.add('ShowEscapeMenu');stOpen();tick(1);
 {const tx=texts().join(' / ');ok(/МОДЫ РЯДОМ/.test(tx)&&/Enhanced Quickbuy/.test(tx)&&/Items shown/.test(tx),'в окне — «МОДЫ РЯДОМ» с его настройками');}
 const ub=all(F('RestlessWindow')).filter(x=>x.type==='Button'&&x.style.width==='92px');ok(ub.length===2,'две кнопки настроек мода: '+ub.length);
 ub[0].ev.onactivate();tick(1);ok(EQ.enabled===false,'выключил в окне — мод получил set enabled=false');
 ub[1].ev.onactivate();tick(1);ok(EQ.preview_count===4,'ползунок 3 → 4: '+EQ.preview_count);
 tick(6);ok(/U\.enhanced_quickbuy\.enabled=0/.test(LSO.restless_mod_v1)&&/U\.enhanced_quickbuy\.preview_count=4/.test(LSO.restless_mod_v1),'настройки мода записаны в нашу память: '+LSO.restless_mod_v1.slice(-70));
 shade.ev.onactivate();em.cls.delete('ShowEscapeMenu');
 // отчёт программе
 tick(10);const um=F('RestlessUm');ok(um&&/^http:\/\/127\.0\.0\.1:27515\/um\.png\?v=0\.34&c=/.test(um.img)&&/enhanced_quickbuy/.test(decodeURIComponent(um.img)),'программе: наши настройки и моды рядом (um.png)');
 // с сайта: надпись выкл и ползунок мода = 2
 PROG_TITLE='RL_SET:k9:'+encodeURIComponent('MARK=0;U.enhanced_quickbuy.preview_count=2;EVIL=1');tick(130);em.cls.add('ShowEscapeMenu');tick(130);em.cls.delete('ShowEscapeMenu');
 ok(hud.GetAttributeString('RESTLESS_MARK','')==='0'&&EQ.preview_count===2&&hud.GetAttributeString('RESTLESS_EVIL','')==='','с сайта: надпись выкл, мод получил 2, чужой ключ не принят');
 const before=FIRE.length;em.cls.add('ShowEscapeMenu');tick(130);em.cls.delete('ShowEscapeMenu');ok(!FIRE.slice(before).some(a=>/"t":"set"/.test(a)),'та же метка — второй раз не применяем');
 PROG_TITLE=null;hud.SetAttributeString('RESTLESS_MARK','1');
 // мод перезапустился (новый матч) — Restless сам отдаёт сохранённое
 EQ.enabled=true;FIRE_EQ();ok(EQ.enabled===false&&EQ.preview_count===2,'мод зарегистрировался заново — получил сохранённое');
 // урна, разлом, мост
 hud.SetAttributeString('RESTLESS_RIFT','1');gt.text='12:00';const cp=add(mm,P('Button','koth',{class:'map_button capture_point koth_warning'}));tick(8);
 const R=()=>F('RestlessRift'),RC=i=>R().ch[i];ok(R()&&/^откроется через 0:[12]\d$/.test(LT(RC(1)))&&/koth/.test(RC(1).ch[0].img)&&/soul_jar/.test(RC(0).ch[0].img),'разлом: koth_warning — точный отсчёт 20 с, у каждого значок: «'+(R()&&LT(R()))+'»');
 cp.cls.delete('koth_warning');const km=add(hud,P('Panel','KothCashInMeter',{class:'capturing'}));add(km,P('Label','KothCashInTeamLabel1',{text:'37'}));tick(90);
 ok(LT(RC(1))==='открыт · 37%','разлом идёт — с прогрессом: «'+LT(RC(1))+'»');
 const pb=add(mm,P('Button','pb',{class:'map_button player PlayerIsHoldingIdol enemy'}));tick(30);ok(LT(RC(0))==='несут враги'&&RC(0).ch[1].style.color==='#ff6b5b','урну несут враги (PlayerIsHoldingIdol): «'+LT(RC(0))+'»');
 pb.DeleteAsync();tick(30);ok(/^примерно через (5:0\d|4:5\d)$/.test(LT(RC(0))),'урну сдали — следующая примерно через 5:00: «'+LT(RC(0))+'»');
 ok(!/~/.test(LT(R())),'0.22: «~» нет (в игре он рисовался минусом)');
 add(mm,P('Button','bf',{class:'map_button powerup_spawn powerup_gun'}));tick(30);ok(LT(RC(2))==='на мосту','бафф на мосту: «'+LT(RC(2))+'»');
 F('RestlessGCL').cls.delete('gDetailView');tick(30);ok(LT(RC(2))==='на мосту'&&RC(0).style.visibility==='collapse','0.24: Alt отпущен — урна (до неё больше 2 мин) спрятана, бафф на мосту виден: «'+LT(R())+'»');
 F('RestlessGCL').cls.add('gDetailView');tick(30);ok(RC(0).style.visibility==='visible','0.24: Alt зажат — урна снова видна');
 hud.SetAttributeString('DeadlockUtils_Instancia','normal');tick(30);ok(R().style.visibility==='collapse','Deadlock Utils рядом — урну и разлом не дублируем');
 hud.SetAttributeString('DeadlockUtils_Instancia','');
 // ящики на мини-карте
 hud.SetAttributeString('RESTLESS_BOX','1');Object.assign(mm,{actuallayoutwidth:410,actuallayoutheight:410});tick(8);const bx=F('RestlessBoxes');
 const vis=()=>bx.ch.filter(x=>x.style.visibility!=='collapse');
 ok(bx&&bx.par===mm&&vis().length===2&&vis().every(x=>x.type==='Image')&&/restless\/mm\/t\.png/.test(vis()[0].img)&&/mm\/g\.png/.test(vis()[1].img)&&bx.style.preTransformScale2d==='0.5','0.22: ящики — 2 картинки (крепкие, статуи; обычные выкл.), масштаб под карту: '+vis().map(x=>x.img).join(' '));
 hud.SetAttributeString('RESTLESS_BXC','1');tick(8);ok(vis().length===3&&/mm\/c\.png/.test(vis()[2].img),'включил обычные — третья картинка');
 hud.SetAttributeString('RESTLESS_BXG','0');tick(8);ok(vis().length===2&&!vis().some(x=>/g\.png/.test(x.img)),'выключил статуи — их картинки нет');
 gt.text='2:00';tick(8);ok(bx.style.visibility==='collapse'&&F('RestlessBoxT')&&F('RestlessBoxT').text==='Ящики через 1:00','до 2:45 значков нет, над картой — «'+(F('RestlessBoxT')&&F('RestlessBoxT').text)+'»');
 hud.SetAttributeString('RESTLESS_BOXV','tm');gt.text='2:50';tick(8);ok(bx.style.visibility==='visible','0.26: режима «Время» нет — с 2:45 значки, даже если раньше выбрал «Время»');
 gt.text='3:05';tick(8);ok(bx.style.visibility==='visible','3:05 — значки на карте');gt.text='12:00';tick(8);ok(F('RestlessBoxT').style.visibility==='collapse','дальше отсчёта нет');
 hud.SetAttributeString('RESTLESS_BOXV','ico');hud.SetAttributeString('RESTLESS_BXC','0');hud.SetAttributeString('RESTLESS_BXG','1');tick(8);ok(bx.style.visibility==='visible','снова значки');
 VIS=0;tick(40);const vps=Math.round(VIS/10);console.log('нагрузка 0.21 (всё вкл.): '+vps+' панелей в секунду');ok(vps<all(hud).length,'0.21: нагрузка меньше одного HUD (точки ящиков не перебираем): '+vps+' < '+all(hud).length);}
// 0.25: Alt через родителя слушателя, активные предметы у прицела, меню песочницы в укрытии
{const gcl=F('RestlessGCL');gcl.cls.delete('gDetailView');gcl.par.cls.add('gDetailView');tick(4);
 hud.SetAttributeString('RESTLESS_ALTM','1');hud.SetAttributeString('RESTLESS_PERF','1');tick(4);const pf2=F('RestlessPerf');ok(pf2&&pf2.style.visibility==='visible','0.25: Alt у родителя слушателя (как ставит игра) — считается (нагрузка видна)');
 gcl.par.cls.delete('gDetailView');tick(40);ok(pf2.style.visibility==='collapse','отпустил Alt — нагрузка спрятана');gcl.par.cls.add('gDetailView');
 const am=add(hud,P('Panel','ActiveAbilitiesMenu'));
 const b1=add(am,P('Panel','upgrade_warp_stone_',{class:'ability_container'}));
 const b2=add(am,P('Panel','upgrade_magic_carpet_',{class:'ability_container'}));const cd2=add(b2,P('Label','',{class:'cooldown_timer'}));cd2.text='23';
 add(am,P('Panel','citadel_ability_zipline_boost_'));
 hud.SetAttributeString('RESTLESS_AIT','1');tick(20);const ar=F('RestlessAit');
 ok(ar&&ar.style.visibility==='visible'&&ar.ch.length===2,'0.29: у прицела 2 активных предмета (записи ability_container, буст каната не предмет): '+(ar&&ar.ch.length));
 ok(/items\/vitality\/warp_stone_psd/.test(ar.ch[0].ch[0].img)&&/items\/spirit\/magic_carpet_psd/.test(ar.ch[1].ch[0].img),'картинки из файлов игры: '+ar.ch.map(c=>c.ch[0].img.split('/').pop()).join(' '));
 ok(ar.ch[0].style.border.indexOf('#ffc83d')>=0&&ar.ch[0].ch[1].text===''&&ar.ch[1].ch[0].style.opacity==='0.38'&&ar.ch[1].ch[1].text==='23','готов — рамка, на КД (cooldown_timer «23») — тускло и «23»');
 cd2.text='';tick(4);ok(ar.ch[1].ch[0].style.opacity==='1'&&ar.ch[1].ch[1].text==='','перезарядился — ярко');
 em.cls.add('ShowEscapeMenu');stOpen();tick(4);{const tx=texts().join(' / ');ok(/Активные предметы: 2 \(✓ ✓\)/.test(tx),'«Что видит мод»: '+(tx.match(/Активные предметы:[^/]*/)||[''])[0]);}F('RestlessShade').ev.onactivate();em.cls.delete('ShowEscapeMenu');tick(2);
 b1.DeleteAsync();b2.DeleteAsync();add(am,P('Panel','item_slot_unknown_1'));add(am,P('Panel','item_slot_unknown_2'));tick(20);
 em.cls.add('ShowEscapeMenu');stOpen();tick(4);{const tx=texts().join(' / ');ok(/Активные предметы: 0 \[/.test(tx),'0.29: имена не совпали — «Что видит мод» покажет id детей: '+(tx.match(/Активные предметы:[^/]*/)||[''])[0]);}F('RestlessShade').ev.onactivate();em.cls.delete('ShowEscapeMenu');tick(2);
 hud.SetAttributeString('RESTLESS_AIT','0');tick(4);ok(ar.style.visibility==='collapse','выключил — пропали');
 hud.SetAttributeString('RESTLESS_SBX','1');const sb=add(hud,P('CitadelHudHeroTesting','',{class:'hud_hero_testing_root'}));top.cls.add('InHideout');tick(30); 
 ok(sb.style.visibility==='visible','0.25: в укрытии меню песочницы показано (как QoL Lite)');
 sb.cls.add('gShopOpen');tick(10);ok(sb.style.visibility===null,'открыт магазин — меню отдали игре');
 sb.cls.delete('gShopOpen');tick(10);hud.SetAttributeString('RESTLESS_SBX','0');tick(10);ok(sb.style.visibility===null,'выключил — как у игры');
 hud.SetAttributeString('RESTLESS_SBX','1');top.cls.delete('InHideout');tick(10);ok(sb.style.visibility===null,'в матче не трогаем');}
// 0.25: сборка одной кнопкой — в окне сборок игры кнопка «★ RESTLESS», номер лучшей сборки на своего героя — в поиск игры
{const tp0=all(top).find(x=>x.type==='CitadelHudTopBarPlayer'&&all(x).some(y=>y.cls&&y.cls.has('PlayerName')));tp0.cls.add('LocalPlayer');
 const shop=add(hud,P('Panel','BuildSelector'));const sc=add(shop,P('Panel','SearchContainer'));const sbx=add(sc,P('Panel','SearchBox'));const se=add(sbx,P('TextEntry','SearchTextEntry'));se.text='';const rb=add(sc,P('Panel','RefreshButton'));
 F('RestlessGCL').par.cls.add('gShopOpen');const a0=acts.length;tick(40);const bb=F('RestlessBldBtn');ok(bb&&bb.par===sc,'0.25: в окне сборок игры — кнопка «★ RESTLESS»: '+(bb&&bb.ch[0].text));
 ok(BLD_URLS.length>=1&&/restless\/bld\.html\?h=/.test(BLD_URLS[0]),'страница сборки спрошена по своему герою: '+(BLD_URLS[0]||'').split('/').pop());
 const OA=global.onAct,A1=[];global.onAct=()=>{while(acts.length)A1.push(acts.shift())};bb.ev.onactivate();tick(6);global.onAct=OA;ok(se.text==='449466'&&A1.includes(rb),'нажал — номер сборки в поиске игры и поиск запущен: «'+se.text+'»');}
// бот
F('RestlessSiteBtn').ev.onactivate();ok(msgs.includes('URL https://1f8t8graf4-ai.github.io/dota-/restless/'),'кнопка «Мой Restless» открывает сайт');
F('RestlessBotBtn').ev.onactivate();ok(msgs.includes('URL https://t.me/languagegamesbot'),'кнопка бота открывает ссылку');
// не HUD (окно настроек игры: там тоже есть субтитры) — ничего не создаёт
const pop=P('Panel','Popups');const ps=add(pop,P('CitadelHudSubtitles','x'));parse(L('citadel_hud_subtitles.xml'),ps);run(ps.ch[0]);tick(5);
ok(!all(pop).some(x=>/^Restless/.test(x.id)&&x.id!=='RestlessGCL'),'в окне настроек игры (не HUD) скрипт ничего не создаёт');
// второй прогон: меню по Esc — чужое (другой мод победил), скрипт — только в субтитрах и скорости
{const hud2=P('CitadelHud','Hud');const em2=add(hud2,P('CitadelHudEscapeMenu','EscapeMenu'));parse(fs.readFileSync(escXml,'utf8'),em2);
 const ms2=add(hud2,P('CitadelHudMovementSpeed','m'));parse(L('hud_movement_speed.xml'),ms2);run(ms2.ch[0]);tick(3);
 const b2=hud2.FindChildTraverse('RestlessMenuBtn');ok(b2&&b2.par.par.id==='SubOptions','чужое меню по Esc — кнопку ставит скрипт из файла скорости');}
// 0.19: перезапуск игры — новый HUD, тот же localStorage браузера игры
{subs.ch[0].valid=false;ms.ch[0].valid=false;
 const h3=P('CitadelHud','Hud');const s3=P('CitadelHudSubtitles','HudSubtitles');parse(L('citadel_hud_subtitles.xml'),s3);const e3=add(h3,P('CitadelHudEscapeMenu','EscapeMenu'));parse(fs.readFileSync(escXml,'utf8'),e3);
 add(h3,s3);run(s3.ch[0]);tick(8);
 const m3=h3.FindChildTraverse('RestlessMark');
 ok(h3.GetAttributeString('RESTLESS_MARK','')==='0'&&m3&&m3.style.visibility==='collapse','перезапуск: надпись выключена — так и осталась');
 ok(h3.GetAttributeString('RESTLESS_ZIP','')==='1'&&true,'перезапуск: Enchanted на месте');
 // страница грузится долго, а игрок уже нажал — его выбор не затираем
 const h4=P('CitadelHud','Hud');const s4=P('CitadelHudSubtitles','HudSubtitles');parse(L('citadel_hud_subtitles.xml'),s4);const e4=add(h4,P('CitadelHudEscapeMenu','EscapeMenu'));parse(fs.readFileSync(escXml,'utf8'),e4);
 s3.ch[0].valid=false;PAGE_HOLD=true;add(h4,s4);run(s4.ch[0]);tick(4);e4.cls.add('ShowEscapeMenu');tick(2);
 h4.FindChildTraverse('RestlessMenuBtn').ev.onactivate();const w4=h4.FindChildTraverse('RestlessWindow');
 const t4=all(w4).filter(x=>x.type==='Button'&&x.style.width==='84px')[2];ok(t4.ch[0].text==='ВКЛ','страница ещё не ответила — надпись по умолчанию ВКЛ');
 t4.ev.onactivate();t4.ev.onactivate();tick(1);ok(h4.GetAttributeString('RESTLESS_DIRTY','')==='MARK','нажатие до загрузки помечено');
 PAGE_HOLD=false;tick(8);
 ok(h4.GetAttributeString('RESTLESS_MARK','')==='1'&&h4.GetAttributeString('RESTLESS_ZIP','')==='1','загрузилось: надпись — как нажал (вкл), остальное — из памяти');
 ok(/MARK=1/.test(LSO.restless_mod_v1)&&h4.GetAttributeString('RESTLESS_DIRTY','')==='','и записано обратно: '+LSO.restless_mod_v1.slice(0,40));
 // страницы нет вовсе — работает как раньше, до выхода из игры
 const h5=P('CitadelHud','Hud');const s5=P('CitadelHudSubtitles','HudSubtitles');parse(L('citadel_hud_subtitles.xml'),s5);parse(fs.readFileSync(escXml,'utf8'),add(h5,P('CitadelHudEscapeMenu','EscapeMenu')));s4.ch[0].valid=false;PAGE_DOWN=true;add(h5,s5);run(s5.ch[0]);tick(260);
 ok(h5.FindChildTraverse('RestlessMark').style.visibility==='visible'&&msgs.filter(m=>/Restless\] .*ошибк|TypeError/.test(m)).length===0,'страница недоступна — мод работает, настройки по умолчанию, без ошибок');PAGE_DOWN=false;}
// 0.24: окно пати игры — линия «с пати» сама; полосы над героями рассказали о себе
{const pc=P('PopupJoinOrCreateParty','x');const dd=add(pc,P('DropDown','LanePreferenceSelector'));let sel='lanepreference_0',n=0;dd.GetSelected=()=>({id:sel});dd.SetSelected=v=>{sel=v;n++};
 run(pc,fs.readFileSync(path.join(dir,'scripts/restless_lane.js'),'utf8'));tick(6);ok(sel==='lanepreference_1'&&n===1,'0.24: окно пати — линия «с пати» выбрана сама, один раз');
 sel='lanepreference_0';tick(6);ok(sel==='lanepreference_0','сменил сам — не трогаем');
 ok(FIRE.some(a=>/"t":"uwhi"/.test(a)&&/player/.test(a)),'0.24: полосы над героями сообщают о себе (uwhi) — видно в «Что видит мод»');}
console.log('\nконсоль:',msgs.filter(m=>m.startsWith('[Restless]')).join(' | '));
console.log(fail?`\nКРАСНЫХ: ${fail}`:'\nвсё PASS');process.exit(fail?1:0);
