// Заглушка Panorama для проверки скрипта без игры.
// Разбирает настоящую разметку меню (hud_escape_menu.xml) и верхней панели HUD, запускает скрипт в обоих,
// жмёт кнопки. Меню и HUD — разные экраны с общим корнем (атрибуты корня — общие, как в игре).
// node mod/tools/mock_panorama.js mod/restless-probe/panorama
const fs=require('fs'),vm=require('vm'),path=require('path');
const dir=process.argv[2]||'mod/restless-probe/panorama';
const src=fs.readFileSync(path.join(dir,'scripts/restless.js'),'utf8');
function P(type,id,attrs){return{type,id:id||'',attrs:attrs||{},ch:[],par:null,style:{},ev:{},hittest:true,text:(attrs&&attrs.text)||'',valid:true,cls:new Set(),
 GetParent(){return this.par},IsValid(){return this.valid},
 FindChildTraverse(i){for(const c of this.ch){if(c.id===i)return c;const r=c.FindChildTraverse(i);if(r)return r}return null},
 SetPanelEvent(e,f){this.ev[e]=f},SetImage(u){this.img=u},BHasClass(c){return this.cls.has(c)},
 SetAttributeString(k,v){(this.at||(this.at={}))[k]=String(v)},GetAttributeString(k,d){return this.at&&k in this.at?this.at[k]:d},
 RemoveAndDeleteChildren(){this.ch.forEach(c=>c.valid=false);this.ch=[]}}}
function add(par,p){p.par=par;par.ch.push(p);return p}
// мини-разбор XML: теги, атрибуты, вложенность
function parse(xml,top){
 xml=xml.replace(/<!--[\s\S]*?-->/g,'');const re=/<(\/?)([\w]+)([^>]*?)(\/?)>/g;let m,st=[top];
 while((m=re.exec(xml))){const[,close,tag,rest,self]=m;if(['root','styles','scripts','include'].includes(tag))continue;
  if(close){st.pop();continue}
  const at={};rest.replace(/([\w-]+)="([^"]*)"/g,(_,k,v)=>{at[k]=v.replace(/&amp;/g,'&').replace(/&apos;/g,"'")});
  const p=add(st[st.length-1],P(tag,at.id,at));if(at.style&&/visibility:\s*collapse/.test(at.style))p.style.visibility='collapse';
  if(!self)st.push(p)}
 return top.ch[0]}
const ROOT=P('Panel','Root');let sched=[];const msgs=[];
function run(ctxp){const $={GetContextPanel:()=>ctxp,CreatePanel:(t,par,id)=>add(par,P(t,id)),Msg:m=>msgs.push(m),Schedule:(d,f)=>sched.push(f)};
 vm.runInNewContext(src,{$,SteamOverlayAPI:{OpenURL:u=>msgs.push('URL '+u)}});return $}
const tick=()=>{const s=sched;sched=[];s.forEach(f=>f())};
let fail=0;const ok=(c,t)=>{console.log((c?'PASS ':'FAIL ')+t);if(!c)fail++};
// HUD
const hudWrap=add(ROOT,P('Panel','Hud'));const bar=parse(fs.readFileSync(path.join(dir,'layout/citadel_hud_top_bar.xml'),'utf8'),hudWrap);
add(bar,P('Label','GameTime'));
run(bar);tick();
const mark=bar.FindChildTraverse('RestlessMark'),card=ROOT.FindChildTraverse('RestlessProbeHud');
ok(card&&card.style.visibility==='visible','HUD: плашка видна');
ok(mark.style.visibility==='visible'&&/RESTLESS 0\.7 · работает$/.test(mark.text),'HUD: надпись «'+mark.text+'»');
// меню
const escWrap=add(ROOT,P('Panel','EscapeMenu'));const menu=parse(fs.readFileSync(path.join(dir,'layout/hud_escape_menu.xml'),'utf8'),escWrap);
escWrap.cls.add('ShowEscapeMenu');
const $m=run(menu);
const F=i=>menu.FindChildTraverse(i);
const win=F('RestlessWindow'),shade=F('RestlessShade'),btn=F('RestlessMenuBtn');
ok(btn&&btn.par.par.id==='SubOptions'&&btn.par.par.ch[0]===btn.par,'кнопка — первой строкой в SubOptions');
ok(F('changehero').attrs.style.includes('margin-bottom: 350px'),'«Сменить героя» поднята над кнопкой');
ok(win.par===menu&&menu.ch[menu.ch.length-1]===win&&menu.ch[menu.ch.length-2]===shade,'окно и подложка — последними в меню (поверх всего)');
ok(/horizontal-align: center; vertical-align: center/.test(win.attrs.style)&&win.attrs.hittest==='true','окно по центру и ловит клики');
ok(/width: 100%; height: 100%/.test(shade.attrs.style),'подложка на весь экран');
ok(win.style.visibility==='collapse'&&shade.style.visibility==='collapse','до нажатия окно скрыто');
ok(typeof btn.ev.onactivate==='function','кнопка привязана');
btn.ev.onactivate();
ok(win.style.visibility==='visible'&&shade.style.visibility==='visible'&&$m.RestlessIsOpen(),'кнопка открывает окно и подложку');
ok(F('RestlessStatus').text.startsWith('HUD на связи'),'статус: «'+F('RestlessStatus').text+'»');
tick();
ok(/меню на связи/.test(mark.text),'HUD видит меню: «'+mark.text+'»');
// надпись выкл
F('RestlessMarkBtn').ev.onactivate();
ok(F('RestlessMarkL').text==='ВЫКЛ'&&F('RestlessMarkBtn').style.backgroundColor==='#ffffff14','переключатель надписи: ВЫКЛ');
tick();
ok(mark.style.visibility==='collapse','HUD спрятал надпись');
F('RestlessCardBtn').ev.onactivate();tick();
ok(card.style.visibility==='collapse','HUD спрятал плашку');
F('RestlessCardBtn').ev.onactivate();F('RestlessMarkBtn').ev.onactivate();tick();
ok(card.style.visibility==='visible'&&mark.style.visibility==='visible'&&F('RestlessMarkL').text==='ВКЛ','включил обратно — видно');
// язык
F('RestlessLangEn').ev.onactivate();tick();
ok(F('RestlessMarkT').text==='RESTLESS label'&&F('RestlessCloseL').text==='Close'&&F('RestlessLangEn').style.backgroundColor==='#ffc83d','окно на английском');
ok(/running/.test(mark.text),'HUD на английском: «'+mark.text+'»');
F('RestlessLangRu').ev.onactivate();
// закрытия: подложка, ×, «Закрыть», Esc (oncancel), меню закрылось
const reopen=()=>{btn.ev.onactivate();return win.style.visibility==='visible'};
F('RestlessShade').ev.onactivate();ok(win.style.visibility==='collapse'&&!$m.RestlessIsOpen(),'клик мимо окна закрывает');
ok(reopen(),'открылось снова');F('RestlessX').ev.onactivate();ok(win.style.visibility==='collapse','× закрывает');
reopen();F('RestlessClose').ev.onactivate();ok(win.style.visibility==='collapse','«Закрыть» закрывает');
reopen();ok(/\$\.RestlessIsOpen\(\)\) \{ \$\.RestlessClose\(\); \} else \{ CitadelResumePlaying\(\); \}/.test(menu.attrs.oncancel),'Esc: сначала закрывает окно, потом меню');
vm.runInNewContext(menu.attrs.oncancel,{$:$m,CitadelResumePlaying:()=>msgs.push('RESUME')});
ok(win.style.visibility==='collapse'&&!msgs.includes('RESUME'),'Esc при открытом окне — закрыл только окно');
vm.runInNewContext(menu.attrs.oncancel,{$:$m,CitadelResumePlaying:()=>msgs.push('RESUME')});
ok(msgs.includes('RESUME'),'Esc при закрытом окне — вернул в игру');
reopen();escWrap.cls.delete('ShowEscapeMenu');tick();
ok(win.style.visibility==='collapse','меню закрыли — окно закрылось само');
escWrap.cls.add('ShowEscapeMenu');
F('RestlessBot').ev.onactivate();ok(msgs.some(m=>m==='URL https://t.me/languagegamesbot'),'кнопка бота открывает ссылку');
console.log('\nконсоль:',msgs.filter(m=>m.startsWith('[Restless]')).join(' | '));
console.log(fail?`\nКРАСНЫХ: ${fail}`:'\nвсё PASS');process.exit(fail?1:0);
