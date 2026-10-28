// Заглушка Panorama для проверки скрипта Restless без игры (0.9.1).
// HUD: корень Hud → верхняя панель (ванильная), субтитры, скорость, меню по Esc (наши файлы со скриптом).
// Как в игре: скрипт файла запускается раньше, чем панель вставлена в HUD, — он должен дождаться, а не выключиться.
// Второй прогон: меню по Esc — чужое (ванильная копия без скрипта) — кнопку всё равно ставит скрипт из субтитров/скорости.
// node mod/tools/mock_panorama.js mod/restless-probe/panorama <ванильный hud_escape_menu.xml>
const fs=require('fs'),vm=require('vm'),path=require('path');
const dir=process.argv[2]||'mod/restless-probe/panorama', escXml=process.argv[3];
const src=fs.readFileSync(path.join(dir,'scripts/restless.js'),'utf8');
function P(type,id,attrs){const p={type,paneltype:type,id:id||'',attrs:attrs||{},ch:[],par:null,style:{},ev:{},hittest:true,text:(attrs&&attrs.text)||'',valid:true,
 cls:new Set(((attrs&&attrs.class)||'').split(/\s+/).filter(Boolean)),
 actualxoffset:0,actualyoffset:0,actuallayoutwidth:0,actuallayoutheight:0,actualuiscale_x:1,actualuiscale_y:1,
 GetParent(){return this.par},IsValid(){return this.valid},GetChildCount(){return this.ch.length},GetChild(i){return this.ch[i]},
 FindChildTraverse(i){for(const c of this.ch){if(c.id===i)return c;const r=c.FindChildTraverse(i);if(r)return r}return null},
 FindChildrenWithClassTraverse(k,a=[]){for(const c of this.ch){if(c.cls.has(k))a.push(c);c.FindChildrenWithClassTraverse(k,a)}return a},
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
let sched=[];const msgs=[];const props=[];
function run(ctxp){const $={GetContextPanel:()=>ctxp,CreatePanel:(t,par,id,pr)=>{const p=add(par,P(t,id,pr||{}));props.push(pr||{});return p},
 Msg:m=>msgs.push(m),Schedule:(d,f)=>sched.push(f),
 // как в игре: {i:имя} ищется в переменных панели и выше
 Localize:(s,p)=>s.replace(/\{[ids]:(\w+)\}/g,(m,k)=>{for(let q=p;q;q=q.par)if(q.dv&&k in q.dv)return String(q.dv[k]);return m}),
 DispatchEvent:(e,a)=>{if(e==='ExternalBrowserGoToURL')msgs.push('URL '+a)}};
 vm.runInNewContext(src,{$,SteamOverlayAPI:{OpenURL:u=>msgs.push('URL '+u)},Date,Math,String});return $}
const tick=(n=1)=>{for(let i=0;i<n;i++){const s=sched;sched=[];s.forEach(f=>f())}};
let fail=0;const ok=(c,t)=>{console.log((c?'PASS ':'FAIL ')+t);if(!c)fail++};
// HUD
const L=f=>fs.readFileSync(path.join(dir,'layout/'+f),'utf8');
ok(!fs.existsSync(path.join(dir,'layout/citadel_hud_top_bar.xml')),'верхнюю панель не подменяем (её меняют QoL Lock, QoL Lite)');
['hud_escape_menu.xml','citadel_hud_subtitles.xml','hud_movement_speed.xml'].forEach(f=>ok(/restless\.vjs_c/.test(L(f)),'скрипт подключён: '+f));
const hud=P('CitadelHud','Hud');
const top=add(hud,P('CitadelHudTopBar','TopBar'));const topCtx=top;
// игроки верхней панели: CitadelHudTopBarPlayer → StatusRow → UltimateStatus → UltimateStatusBG
const players=[];for(let i=0;i<4;i++){const pl=add(topCtx,P('CitadelHudTopBarPlayer','TopBarPlayer'+i));const sr=add(pl,P('Panel','StatusRow'));
 const us=add(sr,P('Panel','UltimateStatus',{class:'UltimateStatus'}));add(us,P('Panel','UltimateStatusBG',{class:'UltimateStatusBG'}));players.push(pl)}
// панели созданы, но ещё не вставлены в HUD — скрипты уже запускаются
const subs=P('CitadelHudSubtitles','HudSubtitles');parse(L('citadel_hud_subtitles.xml'),subs);
const ms=P('CitadelHudMovementSpeed','MovementSpeedPanel');parse(L('hud_movement_speed.xml'),ms);
const em=P('CitadelHudEscapeMenu','EscapeMenu');const menu=parse(L('hud_escape_menu.xml'),em);
run(subs.ch[0]);run(ms.ch[0]);run(menu);
tick(6);
ok(!msgs.some(m=>/запущен в HUD/.test(m))&&!msgs.some(m=>/не HUD/.test(m)),'панели ещё не в HUD — скрипт ждёт, не выключается');
ok(sched.length===3,'все три копии продолжают ждать: '+sched.length);
add(hud,subs);add(hud,ms);add(hud,em);
tick(3);
const owners=msgs.filter(m=>/запущен в HUD/.test(m));
ok(owners.length===3,'вставили в HUD — скрипт запустился во всех трёх: '+owners.join(' | '));
const F=i=>hud.FindChildTraverse(i);
ok(hud.FindChildrenWithClassTraverse('SettingsRow').filter(r=>r.id==='RestlessRow').length===1,'кнопка одна, хотя скриптов три');
const btn=F('RestlessMenuBtn'),row=btn.par,sub=row.par;
ok(sub.id==='SubOptions','кнопка — в столбике под «Сменить героя»');
const order=sub.ch.map(c=>c.id||[...c.cls].join('.')||c.type);
ok(order.indexOf('RestlessRow')===order.indexOf('FeedbackRow')+1&&sub.ch[order.indexOf('RestlessRow')+1].FindChildTraverse('settings'),'порядок: Отзыв игрока → RESTLESS → Настройки ('+order.join(', ')+')');
ok(btn.cls.has('nav_menu_item')&&btn.cls.has('minor')&&!Object.keys(btn.style).length,'класс как у кнопок игры, без своих стилей');
const bl=btn.ch[0];ok(bl.text==='RESTLESS'&&bl.cls.has('menuButtonLabel')&&!Object.keys(bl.style).length,'подпись RESTLESS тем же шрифтом');
const mark=F('RestlessMark');ok(mark&&mark.par===hud&&mark.style.visibility==='visible'&&/RESTLESS 0\.9\.1 · работает · кнопка в Esc/.test(mark.text),'надпись: «'+(mark&&mark.text)+'»');
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
 pl.dv={ult_cooldown:51};tick(6);const t9=pl.FindChildTraverse('RestlessUltTxt');ok(t9&&t9.text==='51','новый игрок в верхней панели — число и у него');}
// хозяин пропал — подхватывает вторая копия
const own=hud.GetAttributeString('RESTLESS_OWN','');hud.at.RESTLESS_OWN='zzz:'+(Date.now()-5000);tick(3);
ok(hud.GetAttributeString('RESTLESS_OWN','').split(':')[0]!=='zzz','хозяин пропал — другая копия подхватила');
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
