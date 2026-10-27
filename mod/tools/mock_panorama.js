// Заглушка Panorama: панели, стили, события. Гоняем скрипт в меню и в HUD.
const fs=require('fs'),vm=require('vm');
const src=fs.readFileSync(process.argv[2],'utf8');
let seq=0;
function P(type,id){const p={type,id:id||'',ch:[],par:null,style:{},ev:{},hittest:true,text:'',valid:true,
 GetParent(){return this.par},IsValid(){return this.valid},
 FindChildTraverse(i){for(const c of this.ch){if(c.id===i)return c;const r=c.FindChildTraverse(i);if(r)return r}return null},
 SetPanelEvent(e,f){this.ev[e]=f},SetImage(u){this.img=u},
 RemoveAndDeleteChildren(){this.ch.forEach(c=>c.valid=false);this.ch=[]}};return p}
function add(par,p){p.par=par;par.ch.push(p);return p}
const shared={};let sched=[];const msgs=[];
function run(ctxp){const $={GetContextPanel:()=>ctxp,CreatePanel:(t,par,id)=>add(par,P(t,id)),Msg:m=>msgs.push(m),Schedule:(d,f)=>sched.push(f)};
 vm.runInNewContext(src,{$,GameUI:{CustomUIConfig:()=>shared},SteamOverlayAPI:{OpenURL:u=>msgs.push('URL '+u)}});}
// меню по Esc в укрытии/матче (hud_escape_menu): у него есть EscapeBackground
const menuTop=P('Panel','MenuTop'),db=add(menuTop,P('CitadelHudEscapeMenu'));add(db,P('Panel','EscapeBackground'));const btn=add(db,P('Button','RestlessMenuBtn'));
run(db);
// HUD
const hudTop=P('Panel','HudTop'),bar=add(hudTop,P('CitadelHudTopBar'));add(bar,P('Label','GameTime'));const mark=add(bar,P('Label','RestlessMark'));
run(hudTop.ch[0]);
const tick=()=>{const s=sched;sched=[];s.forEach(f=>f())};tick();
const card=hudTop.FindChildTraverse('RestlessProbeHud');
const all=(p,a=[])=>{a.push(p);p.ch.forEach(c=>all(c,a));return a};
const texts=p=>all(p).filter(x=>x.text).map(x=>x.text);
console.log('кнопка:',!!btn.ev.onactivate,'| HUD плашка:',!!card,card&&card.style.visibility,'| надпись:',mark.style.visibility,mark.text);
btn.ev.onactivate();
const ov=db.FindChildTraverse('RestlessSettings'),win=ov.FindChildTraverse('RestlessWin');
console.log('окно:',ov.style.visibility,'| тексты:',texts(win).join(' / '));
// клик по первой строке (плашка) и второй (надпись)
const rows=win.ch.filter(c=>c.type==='Button'&&c.style.width==='100%');
rows[0].ev.onactivate();
let w2=db.FindChildTraverse('RestlessWin');let r2=w2.ch.filter(c=>c.type==='Button'&&c.style.width==='100%');r2[1].ev.onactivate();
tick();
console.log('после выкл: настройки',JSON.stringify(shared.__restless),'| HUD плашка:',card.style.visibility,'| надпись:',mark.style.visibility);
// язык English
w2=db.FindChildTraverse('RestlessWin');const pills=all(w2).filter(c=>c.type==='Button'&&c.style.borderRadius==='16px');pills[1].ev.onactivate();
tick();w2=db.FindChildTraverse('RestlessWin');
console.log('EN окно:',texts(w2).slice(0,6).join(' / '),'| HUD надпись:',mark.text);
// бот и закрыть
const btns=all(w2).filter(c=>c.type==='Button'&&c.style.borderRadius==='8px');btns[0].ev.onactivate();btns[1].ev.onactivate();
console.log('закрыто:',ov.style.visibility,'| сообщения:',msgs.join(' | '));
// повторное открытие
btn.ev.onactivate();console.log('снова открыто:',ov.style.visibility,'| окон:',db.ch.filter(c=>c.id==='RestlessSettings').length);
