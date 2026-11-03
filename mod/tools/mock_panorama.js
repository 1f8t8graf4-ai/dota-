// Заглушка Panorama для проверки скрипта Restless без игры (0.13: + связь с программой, профили, старая плашка; 0.14: замер нагрузки VIS).
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
 SetPanelEvent(e,f){this.ev[e]=f},SetImage(u){this.img=u},BHasClass(c){return this.cls.has(c)},AddClass(c){this.cls.add(c)},RemoveClass(c){this.cls.delete(c)},
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
let sched=[];const msgs=[];const props=[];let CLOCK=Date.now();const FD={now:()=>CLOCK};const acts=[];
function run(ctxp){const $={GetContextPanel:()=>ctxp,CreatePanel:(t,par,id,pr)=>{const p=add(par,P(t,id,pr||{}));props.push(pr||{});return p},
 Msg:m=>msgs.push(m),Schedule:(d,f)=>sched.push(f),
 // как в игре: {i:имя} ищется в переменных панели и выше
 Localize:(s,p)=>s.replace(/\{[ids]:(\w+)\}/g,(m,k)=>{for(let q=p;q;q=q.par)if(q.dv&&k in q.dv)return String(q.dv[k]);return m}),
 DispatchEvent:(e,a)=>{if(e==='ExternalBrowserGoToURL')msgs.push('URL '+a);if(e==='Activated')acts.push(a);if(e==='DismissAllContextMenus')cards.splice(0).forEach(c=>c.DeleteAsync())}};
 vm.runInNewContext(src,{$,SteamOverlayAPI:{OpenURL:u=>msgs.push('URL '+u)},Date:FD,Math,String});return $}
const cards=[];
const tick=(n=1)=>{for(let i=0;i<n;i++){CLOCK+=250;const s=sched;sched=[];s.forEach(f=>f());if(typeof onAct==='function')onAct()}};
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
ok(sub.id==='SubOptions','кнопка — в столбике под «Сменить героя»');
const order=sub.ch.map(c=>c.id||[...c.cls].join('.')||c.type);
ok(order.indexOf('RestlessRow')===order.indexOf('FeedbackRow')+1&&sub.ch[order.indexOf('RestlessRow')+1].FindChildTraverse('settings'),'порядок: Отзыв игрока → RESTLESS → Настройки ('+order.join(', ')+')');
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
btn.ev.onactivate();
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
 ok(/Лагеря на миникарте: 5 · сейчас живы: 3/.test(tx),'лагеря: всего и живы (neutral_spawn не считаем)');
 ok(msgs.some(m=>/\[Restless\] видит: Души: 7,250/.test(m)),'то же в консоль при открытии окна');}
// переключатели
const btns=all(win).filter(x=>x.type==='Button'&&x.style.width==='104px');
btns[1].ev.onactivate();tick(1);
ok(mark.style.visibility==='collapse'&&btns[1].ch[0].text==='ВЫКЛ','надпись выключена — пропала');
btns[1].ev.onactivate();tick(1);ok(mark.style.visibility==='visible','включил — вернулась');
// язык
const pills=all(win).filter(x=>x.type==='Button'&&x.style.borderRadius==='17px');pills[1].ev.onactivate();tick(1);
ok(texts().includes('Ult cooldown in the top bar')&&/running/.test(mark.text),'английский: окно и надпись');
pills[0].ev.onactivate();
// закрытия
shade.ev.onactivate();ok(win.style.visibility==='collapse','клик мимо окна закрывает');
btn.ev.onactivate();all(win).find(x=>x.type==='Button'&&x.style.width==='44px').ev.onactivate();ok(win.style.visibility==='collapse','× закрывает');
btn.ev.onactivate();em.cls.delete('ShowEscapeMenu');tick(1);ok(win.style.visibility==='collapse','меню закрыли (Esc) — окно закрылось само');
em.cls.add('ShowEscapeMenu');btn.ev.onactivate();ok(F('RestlessWindow')===win&&win.style.visibility==='visible','открылось снова, окно то же');
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
const ub=all(win).filter(x=>x.type==='Button'&&x.style.width==='104px')[0];ub.ev.onactivate();tick(1);
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
 btn.ev.onactivate();const lb=all(win).filter(x=>x.type==='Button'&&x.style.width==='104px')[2];ok(!!lb,'в окне — переключатель «Связь с программой»');
 ok(texts().some(t=>/^Программа: отправлено \d+ · игроков 12 · с ID 11 · с героем 12$/.test(t)),'в «Что видит мод» — строка связи: '+texts().find(t=>/^Программа/.test(t)));
 lb.ev.onactivate();const n2=q().n;tick(80);ok(q().n===n2,'связь выключена — не шлём');lb.ev.onactivate();btn.ev.onactivate();em.cls.delete('ShowEscapeMenu');}
// нагрузка: обычный матч, меню и окно закрыты — сколько панелей в секунду перебирает мод (0.13: 1867 в секунду — весь HUD ~7 раз; 0.14: панели помним)
{tick(40);VIS=0;tick(40);const vps=Math.round(VIS/10),tot=all(hud).length;
 console.log('нагрузка: перебор '+vps+' панелей в секунду (всего в HUD заглушки '+tot+')');
 ok(vps<tot,'в матче мод перебирает меньше одного HUD в секунду: '+vps+' < '+tot+' (0.13 — 1867)');}
// 0.15: напоминания о событиях по часам матча
{const gt=add(hud,P('Label','GameTime',{text:'1:44'}));const E=()=>F('RestlessEvt');
 tick(8);ok(!E()||E().style.visibility==='collapse','1:44 — до малых лагерей 16 с, напоминания ещё нет');
 gt.text='1:50';tick(4);ok(E()&&E().style.visibility==='visible'&&E().text==='Через 10 с: малые лагеря','1:50 — «'+(E()&&E().text)+'»');
 gt.text='2:02';tick(4);ok(E().style.visibility==='visible'&&E().text==='Появились: малые лагеря','2:02 — «'+E().text+'»');
 gt.text='4:47';tick(4);ok(E().text==='Через 13 с: средние лагеря · ящики в тоннелях и на Колокольне','4:47 — «'+E().text+'»');
 gt.text='2:30';tick(4);ok(E().style.visibility==='collapse','2:30 — между событиями пусто');
 gt.text='1:50';tick(40);VIS=0;tick(40);const vps=Math.round(VIS/10);ok(vps<all(hud).length,'с часами матча нагрузка та же: '+vps+' панелей в секунду');
 hud.SetAttributeString('RESTLESS_EVT','0');gt.text='1:51';tick(4);ok(E().style.visibility==='collapse','выключил напоминания — пропали');hud.SetAttributeString('RESTLESS_EVT','1');}
// 0.17: функции из наборов Lite / Medium
{const W=()=>F('RestlessWindow'),A0=()=>all(W());
 // набор Lite по умолчанию: ранги, средний ранг, лагеря — вкл; Medium-функции выкл
 em.cls.add('ShowEscapeMenu');btn.ev.onactivate();tick(1);
 const pp=all(win).filter(x=>x.type==='Button'&&x.style.borderRadius==='16px');ok(pp.length===2&&pp[0].ch[0].text==='Lite'&&pp[0].style.backgroundColor==='#ffc83d','набор: Lite выбран по умолчанию');
 ok(texts().includes('Ранги игроков')&&texts().includes('Таймеры лагерей')&&texts().includes('Пропавшие враги'),'новые переключатели в окне');
 const tg=all(win).filter(x=>x.type==='Button'&&x.style.width==='104px');ok(tg.length===12,'переключателей 12: '+tg.length);
 shade.ev.onactivate();em.cls.delete('ShowEscapeMenu');tick(12);
 // ранги: значок под портретом у кого есть ID (11 из 12 — из профилей и account_id)
 const RI=TP.map(p=>p.FindChildTraverse('RestlessRank'));
 ok(RI.filter(x=>x&&x.style.visibility==='visible').length===11&&RI[0].par.id==='HeroImageArea'&&RI[0].img==='https://api.deadlock-api.com/v1/players/930626915/rank/image','ранги: 11 значков под портретами, картинка по ID: '+(RI[0]&&RI[0].img));
 ok(!RI[2]||RI[2].style.visibility!=='visible','у кого ID нет — значка нет');
 const lr=F('RestlessLrk');ok(lr&&lr.style.visibility==='visible'&&/rank\/image\?account_ids=930626915,/.test(F('RestlessLrkF').img)&&/account_ids=111222333,/.test(F('RestlessLrkE').img),'средний ранг: свои и враги — '+F('RestlessLrkF').img.slice(-40));
 // лагеря: метка погасла — отсчёт возрождения
 const gt=F('GameTime');gt.text='9:00';const c0=F('camp0'),c1=F('camp1'),c4=F('camp4');Object.assign(c0,{actualxoffset:100,actualyoffset:200,actuallayoutwidth:24,actuallayoutheight:24});
 tick(8);c0.cls.delete('active');c1.cls.delete('active');tick(8);
 const lb0=c0.par.ch.find(x=>x.type==='Label'&&x.text==='1:25');ok(lb0&&lb0.style.visibility==='visible'&&lb0.style.x==='90px'&&lb0.style.y==='203px','малый лагерь убит — «1:25» над меткой ('+(lb0&&lb0.style.x+','+lb0.style.y)+')');
 ok(c1.par.ch.some(x=>x.type==='Label'&&x.text==='4:50'),'средний — «4:50»');
 gt.text='9:30';tick(8);ok(lb0.text==='0:55','через 30 с — «0:55»');
 c0.cls.add('active');tick(8);ok(lb0.style.visibility==='collapse','лагерь вернулся — отсчёта нет');
 gt.text='10:40';tick(8);ok(c1.par.ch.some(x=>x.type==='Label'&&x.text==='3:10'&&x.style.visibility==='visible'),'средний через 100 с — «3:10»');
 ok(!c4.par.ch.some(x=>x.type==='Label'&&x.text==='?'),'неизвестный лагерь (vault) — без таймера');
 c4.cls.delete('active');tick(8);
 // Medium: пропавшие враги, здоровье, «в бою», незащищённые души
 const ga=add(hud,P('CitadelHudGameAnnouncements','CitadelHudGameAnnouncements'));const dgc=add(hud,P('Panel','hudDeathGoldContainer'));const dg=add(dgc,P('Label','hudDeathGoldLabel',{text:'0'}));
 em.cls.add('ShowEscapeMenu');btn.ev.onactivate();pp[1].ev.onactivate();tick(1);ok(pp[1].style.backgroundColor==='#ffc83d'&&hud.GetAttributeString('RESTLESS_MISS','')==='1','набор Medium включил пропавших врагов и остальное');shade.ev.onactivate();em.cls.delete('ShowEscapeMenu');
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
 ga.cls.add('gInCombat');tick(4);
 const cb=F('RestlessCmb');ok(cb&&cb.style.visibility==='visible'&&cb.text==='В БОЮ','«В БОЮ», пока игра держит gInCombat');
 ga.cls.delete('gInCombat');tick(2);ok(cb.text==='ВНЕ БОЯ','вышел из боя — «ВНЕ БОЯ»');tick(12);ok(cb.style.visibility==='collapse','через 2 с — пусто');
 dg.text='1,250';tick(4);
 const un=F('RestlessUns');ok(un&&un.style.visibility==='visible'&&un.text==='Незащищённые души: 1,250','незащищённые души крупно: «'+(un&&un.text)+'»');
 dg.text='0';tick(2);ok(un.style.visibility==='collapse','0 — пусто');dg.text='300';
 // укрытие: всё прячем
 top.cls.add('InHideout');tick(8);
 ok([F('RestlessLrk'),cb,un,MS(6),RI[0]].every(x=>x.style.visibility==='collapse')&&!c1.par.ch.some(x=>x.type==='Label'&&x.style.visibility==='visible'),'в укрытии всё новое спрятано');
 top.cls.delete('InHideout');tick(8);
 // нагрузка со всеми функциями
 tick(40);VIS=0;tick(40);const vps=Math.round(VIS/10);console.log('нагрузка 0.17 (Medium): '+vps+' панелей в секунду');ok(vps<all(hud).length,'Medium: нагрузка меньше одного HUD в секунду: '+vps);
 // Lite обратно
 em.cls.add('ShowEscapeMenu');btn.ev.onactivate();pp[0].ev.onactivate();tick(2);shade.ev.onactivate();em.cls.delete('ShowEscapeMenu');tick(8);
 ok(MS(6).style.visibility==='collapse'&&cb.style.visibility==='collapse','набор Lite — Medium-функции выключены и спрятаны');}
// 0.18: КД ульты над героем в мире, лагерь сам запоминает время
{const wp=add(hud,P('Panel','WorldPanels'));const OV=[];
 ['Андрей','Rat','E1','крип'].forEach((n,i)=>{const w=add(wp,P('Panel','',{class:'WindowRoot'}));add(w,P('Label','name',{text:n}));const us=add(w,P('Panel','UnitStatus'));const ih=add(us,P('Panel','InfoHealthContainer'));const ip=add(ih,P('Panel','',{class:'unit_info_panel'}));OV.push(add(ip,P('Panel','unit_info_bg')))});
 const U=i=>OV[i].FindChildTraverse('RestlessUltW');
 TP[0].dv.ult_cooldown=42;TP[5].dv.ult_cooldown=0;TP[6].dv.ult_cooldown=118;
 // ульта в верхней панели у TP — нужны UltimateStatus внутри их панелей
 TP.forEach(p=>{if(!p.FindChildTraverse('UltimateStatus')){const sr=add(p,P('Panel','StatusRow'));const us=add(sr,P('Panel','UltimateStatus',{class:'UltimateStatus'}));add(us,P('Panel','UltimateStatusBG',{class:'UltimateStatusBG'}))}});
 tick(80);
 ok(U(0)&&U(0).style.visibility==='visible'&&U(0).text==='42','над героем: «42» на месте значка ульты ('+(U(0)&&U(0).text)+')');
 ok(!U(1)||U(1).style.visibility==='collapse','ульта готова (0) — пусто');
 ok(U(2)&&U(2).text==='118'&&U(2).style.fontSize==='11px','3 цифры — мельче');
 ok(!U(3),'крип (нет такого игрока) — ничего');
 TP[0].dv.ult_cooldown=41;tick(2);ok(U(0).text==='41','секунды идут');
 hud.SetAttributeString('RESTLESS_ULTW','0');tick(4);ok(U(0).style.visibility==='collapse','выключил — пропало');hud.SetAttributeString('RESTLESS_ULTW','1');tick(4);
 // лагерь: метка вернулась через 2:00 — дальше отсчёт с 2:00
 const gt=F('GameTime'),c3=F('camp3');gt.text='20:00';tick(8);c3.cls.add('active');tick(8);c3.cls.delete('active');tick(8);
 gt.text='22:00';tick(4);c3.cls.add('active');tick(8);
 ok(hud.GetAttributeString('RESTLESS_CRS_neutral_weak','')==='120','малый лагерь вернулся через 2:00 — запомнили 120 с');
 c3.cls.delete('active');tick(8);ok(c3.par.ch.some(x=>x.type==='Label'&&x.text==='2:00'&&x.style.visibility==='visible'),'следующий раз отсчёт с 2:00');
 gt.text='24:10';tick(4);c3.cls.add('active');tick(8);ok(hud.GetAttributeString('RESTLESS_CRS_neutral_weak','')==='120','вернулся позже (2:10) — оставили короче');
 tick(40);VIS=0;tick(40);const vps=Math.round(VIS/10);console.log('нагрузка 0.18: '+vps+' панелей в секунду');ok(vps<all(hud).length,'с ультой над героями нагрузка меньше одного HUD: '+vps);}
// бот
F('RestlessSiteBtn').ev.onactivate();ok(msgs.includes('URL https://1f8t8graf4-ai.github.io/dota-/restless/'),'кнопка «Мой Restless» открывает сайт');
F('RestlessBotBtn').ev.onactivate();ok(msgs.includes('URL https://t.me/languagegamesbot'),'кнопка бота открывает ссылку');
// не HUD (окно настроек игры: там тоже есть субтитры) — ничего не создаёт
const pop=P('Panel','Popups');const ps=add(pop,P('CitadelHudSubtitles','x'));parse(L('citadel_hud_subtitles.xml'),ps);run(ps.ch[0]);tick(5);
ok(!all(pop).some(x=>/^Restless/.test(x.id)),'в окне настроек игры (не HUD) скрипт ничего не создаёт');
// второй прогон: меню по Esc — чужое (другой мод победил), скрипт — только в субтитрах и скорости
{const hud2=P('CitadelHud','Hud');const em2=add(hud2,P('CitadelHudEscapeMenu','EscapeMenu'));parse(fs.readFileSync(escXml,'utf8'),em2);
 const ms2=add(hud2,P('CitadelHudMovementSpeed','m'));parse(L('hud_movement_speed.xml'),ms2);run(ms2.ch[0]);tick(3);
 const b2=hud2.FindChildTraverse('RestlessMenuBtn');ok(b2&&b2.par.par.id==='SubOptions','чужое меню по Esc — кнопку ставит скрипт из файла скорости');}
console.log('\nконсоль:',msgs.filter(m=>m.startsWith('[Restless]')).join(' | '));
console.log(fail?`\nКРАСНЫХ: ${fail}`:'\nвсё PASS');process.exit(fail?1:0);
