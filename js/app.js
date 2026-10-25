/* z-ai-version: сборка Z.ai (ветка z-ai-version) — включается до всего остального кода */
window.ZAI_ON=true;
/* ================= иконки ================= */
const ICONS=window.__DATA.ICONS;
const svg=n=>`<svg viewBox="0 0 48 48" aria-hidden="true">${ICONS[n]||ICONS.scroll}</svg>`;
const UI={
 gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
 close:'<path d="M6 6l12 12M18 6L6 18"/>',
 back:'<path d="M15 18l-6-6 6-6"/>',
 fwd:'<path d="M9 18l6-6-6-6"/>',
 bulb:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z"/>',
 search:'<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
 coin:'<path d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5V10a2 2 0 0 0 0 4v2.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5V14a2 2 0 0 0 0-4z"/><path d="M14 6v12" stroke-dasharray="1.6 1.8"/>',
 check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
 speaker:'<path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>'
};
const ui=n=>`<svg class="ui" viewBox="0 0 24 24" aria-hidden="true">${UI[n]}</svg>`;
// 12.0: флажки картинкой — эмодзи-флаги на Windows (Telegram Desktop) превращаются в буквы «GB»/«DE»
const FLAG={en:'<svg class="flag" viewBox="0 0 60 30" aria-hidden="true"><clipPath id="fgb"><path d="M0 0v30h60V0z"/></clipPath><clipPath id="fgt"><path d="M30 15h30v15zv15H0zH0V0zV0h30z"/></clipPath><g clip-path="url(#fgb)"><path d="M0 0v30h60V0z" fill="#012169"/><path d="M0 0l60 30m0-30L0 30" stroke="#fff" stroke-width="6"/><path d="M0 0l60 30m0-30L0 30" clip-path="url(#fgt)" stroke="#C8102E" stroke-width="4"/><path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/><path d="M30 0v30M0 15h60" stroke="#C8102E" stroke-width="6"/></g></svg>',
  de:'<svg class="flag" viewBox="0 0 5 3" aria-hidden="true"><path d="M0 0h5v3H0z" fill="#000"/><path d="M0 1h5v2H0z" fill="#DD0000"/><path d="M0 2h5v1H0z" fill="#FFCE00"/></svg>'};
const BOX=`<span class="box"><svg viewBox="0 0 24 24">${UI.check}</svg></span>`;

/* ================= основы ================= */

/* ================= предметы ================= */
/* ================= скиллы: названия как фразы ================= */
/* ================= слова из имён героев ================= */

/* ================= фразы для общения ================= */
/* ================= слова для режима «Лор» (хай тир) =================
   [id, часть речи, перевод, английский: 'как показывать:формы через запятую', немецкий: то же, группа синонимов]
   Первая форма — словарная. Лор-тексты берутся из lore.json, слово ищется в тексте автоматически. */
/* ================= сноски: как запомнить и как сказать в жизни =================
   [как запомнить, пример EN, пример DE, перевод] или [.., перевод EN, перевод DE], если примеры разные */


/* ================= режимы, роли, языки ================= */
const APP_LINK='https://t.me/languagegamesbot/languagedota2';
const CDN='https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/';
const portrait=k=>`${CDN}heroes/${k}.png`;

/* ================= хранилище ================= */
const KEY='dota_quiz_v4',OLD_KEY='dota_deutsch_v3',MKEY='dota_m_v1';
const fresh=()=>({scLv:scLvNow(),v:5,onboarded:false,langs:['en'],roles:'all',gold:0,streak:0,lastDay:null,best:{},answered:0,correct:0,snd:true,fx:true,full:true,hideLearned:true,mistakes:[],duels:{},theme:'hud',znew:1,tab:'learn',path:'mix',games:['dota','cs2'],auto:false,goal:20,ach:{}});
function migrate(o){
  const f=fresh();
  ['gold','streak','lastDay','answered','correct','snd','fx'].forEach(k=>{if(o[k]!==undefined)f[k]=o[k];});
  if(o.lang==='de'||o.lang==='en')f.langs=[o.lang];
  return f;
}
// 12.6: сцену пересобрали из более длинного исходника — у эпизодов и фраз новые номера, время сдвинулось на dt.
// Переносим старый прогресс: сцены (dota_sc_v1, P.lv), награды, фон эпизода и «Мои слова» (store.scLv). Облачная копия — так же, при слиянии.
const SC_RELAY={'sopranos-s01e01':{v:2,dt:112.45,ep:[1,2],ph:{'0_0':'1_2','0_1':'1_4','0_2':'1_5','0_3':'1_6','0_4':'1_7','0_5':'1_9','0_6':'1_10','0_7':'1_11','0_8':'1_12','1_0':'2_0','1_1':'2_1','1_2':'2_2','1_3':'2_3','1_4':'2_4','1_5':'2_5'}}};
const scLvNow=()=>{const o={};for(const id in SC_RELAY)o[id]=SC_RELAY[id].v;return o;};
const relEp=(L,i)=>L.ep[+i]!=null?L.ep[+i]:+i;
function scRelay(id,p){const L=SC_RELAY[id];if(!L||!p||typeof p!=='object'||(p.lv||1)>=L.v)return p;
  const rk=(o,f)=>{const r={};for(const k in o||{})r[f(k)]=o[k];return r;},F=k=>L.ph[k]||k,E=i=>relEp(L,i);
  p.done=(p.done||[]).map(E);p.w=rk(p.w,E);if(p.st)p.st=rk(p.st,E);
  ['m','got','vq','rDone','r'].forEach(k=>{if(p[k])p[k]=rk(p[k],F);});p.lv=L.v;return p;}
function storeRelay(o){if(!o||typeof o!=='object')return o;o.scLv=Object.assign({},o.scLv);
  for(const id in SC_RELAY){const L=SC_RELAY[id];if((o.scLv[id]||1)>=L.v)continue;
    if(o.rw){const r={};for(const k in o.rw){const [a,b]=k.split('|');r[a===id&&b!=null?id+'|'+relEp(L,b):k]=o.rw[k];}o.rw=r;}
    if(typeof o.appBg==='string'&&o.appBg.indexOf('e:'+id+'|')===0)o.appBg='e:'+id+'|'+relEp(L,o.appBg.split('|')[1]);
    for(const k in o.myw||{}){const x=o.myw[k];if(x&&x.sid===id){x.pi=relEp(L,x.pi||0);if(x.a)x.a=Math.round((x.a+L.dt)*100)/100;}}
    o.scLv[id]=L.v;}
  return o;}
function normalize(s){storeRelay(s);
  const f=Object.assign(fresh(),s);
  if(!Array.isArray(f.langs)||!f.langs.length)f.langs=['en'];
  if(f.roles!=='all'&&(!Array.isArray(f.roles)||!f.roles.length))f.roles='all';
  if(!Array.isArray(f.mistakes))f.mistakes=[];
  f.mistakes=[];
  if(!f.best||typeof f.best!=='object')f.best={};
  if(!f.duels||typeof f.duels!=='object')f.duels={};
  if(!['hud','clean','light'].includes(f.theme))f.theme='hud';
  if(!f.ach||typeof f.ach!=='object')f.ach={};
  if(Array.isArray(f.langs)&&f.langs.length>1)f.langs=[f.langs[0]];
  if(!Array.isArray(f.recent))f.recent=[];
  if(f.subV!==3){f.subStyle='glass';f.subV=3;if(!['en+ru','en+de','de+ru','en','de','ru','off'].includes(f.scSub)||['en','de','ru'].includes(f.scSub))delete f.scSub;}
  if(typeof f.games==='string'||typeof f.games==='number'){const g=typeof f.games==='string'?['dota','cs2'].filter(x=>f.games.includes(x)):['dota','cs2'];
    f.played=Math.max(f.played||0,typeof f.games==='number'?f.games:f.games.length-g.join(',').length);f.games=g;}   // 13.6.3: счётчик игр дописывался к списку игр («dota,cs21»)
  if(!['learn','kino','dict','profile'].includes(f.tab))f.tab='learn';   // 13.6.3: раньше не знал kino/dict/games — после облачного синка выкидывало на Главную
  if(![10,20,30].includes(f.goal))f.goal=20;
  return f;
}
function load(){
  try{const s=JSON.parse(localStorage.getItem(KEY));if(s)return normalize(s);}catch(e){}
  try{const o=JSON.parse(localStorage.getItem(OLD_KEY));if(o)return migrate(o);}catch(e){}
  return fresh();
}
let store=load();
let M={};try{M=JSON.parse(localStorage.getItem(MKEY))||{};}catch(e){M={};}
// 12.1: облако Telegram держит ≤4096 символов на ключ — store пишем кусками (KEY_0…, KEY_n), с задержкой,
// и только после первой синхронизации (иначе телефон затёр бы свежий прогресс с ПК до того, как его прочитал)
const SV0=store.sv||0;let CLOUD_OK=false,CLOUD_T=0,CLOUD_ERR=false,CLOUD_BUSY=false,CLOUD_TRY=0,CLOUD_AT=0,SV_CORE=null;const CLOUD_Q={};
// 13.6.3: метка sv ставится, только если изменился прогресс, а не вкладка/звук/субтитры (LOCAL_ONLY): иначе устройство,
// где просто полистали вкладки, считалось «новее» и его билеты затирали заработанные на другом
function svCore(){try{const L=svCore._s||(svCore._s=new Set(LOCAL_ONLY.concat('sv')));return JSON.stringify(store,function(k,v){return this===store&&L.has(k)?undefined:v;});}catch(e){return String(Date.now());}}
function save(){
  const c=svCore();if(c!==SV_CORE){SV_CORE=c;store.sv=Date.now();}
  const s=JSON.stringify(store);
  try{localStorage.setItem(KEY,s);}catch(e){}
  if(CLOUD_OK)cloudQueue(KEY,s);
}
// 13.6.3: в облако — пачкой через 1.2 с (прогресс сцен раньше уходил целиком на каждый ответ), при сворачивании — сразу
function cloudQueue(key,s){if(!TG||!TG.CloudStorage)return;CLOUD_Q[key]=s;clearTimeout(CLOUD_T);CLOUD_T=setTimeout(cloudFlush,1200);}
function cloudFlush(){clearTimeout(CLOUD_T);CLOUD_T=0;for(const k of Object.keys(CLOUD_Q)){const s=CLOUD_Q[k];delete CLOUD_Q[k];cloudSaveChunked(k,s);if(k===KEY&&s.length<4000)try{TG.CloudStorage.setItem(KEY,s,()=>{});}catch(e){}}}
function saveM(){
  const s=JSON.stringify(M);
  try{localStorage.setItem(MKEY,s);}catch(e){}
  if(CLOUD_OK)cloudQueue(MKEY,s);
}

/* ================= Telegram ================= */
const TG=(window.Telegram&&window.Telegram.WebApp&&window.Telegram.WebApp.platform&&window.Telegram.WebApp.platform!=='unknown')?window.Telegram.WebApp:null;
let screen='home',PARAM_LANG='';
const canFull=()=>!!(TG&&typeof TG.requestFullscreen==='function'&&TG.isVersionAtLeast&&TG.isVersionAtLeast('8.0')&&TG.platform&&TG.platform!=='unknown');
if(TG&&TG.platform&&!/^(android|ios)/.test(TG.platform))document.documentElement.classList.add('tg-desk');
// 12.1: на iPhone громкость видео задаётся только кнопками телефона — ползунок прячем, остаётся «звук вкл/выкл»
if((TG&&TG.platform==='ios')||/iPhone|iPad|iPod/.test(navigator.userAgent))document.documentElement.classList.add('ios');
function setInsets(){
  if(!TG)return;
  const r=document.documentElement.style,sa=TG.safeAreaInset||{},ca=TG.contentSafeAreaInset||{};
  ['top','bottom','left','right'].forEach(k=>{
    if(typeof sa[k]==='number')r.setProperty('--tg-safe-area-inset-'+k,sa[k]+'px');
    if(typeof ca[k]==='number')r.setProperty('--tg-content-safe-area-inset-'+k,ca[k]+'px');
  });
}
if(TG&&TG.onEvent)['safeAreaChanged','contentSafeAreaChanged','fullscreenChanged'].forEach(e=>{try{TG.onEvent(e,setInsets);}catch(x){}});
if(TG&&TG.onEvent){try{TG.onEvent('fullscreenChanged',()=>{if(!TG.isFullscreen&&document.querySelector('.sc-pfs'))scExitFull();});}catch(e){}}
function applyFullscreen(){
  if(store.fullV!==1){store.full=true;store.fullV=1;try{save();}catch(e){}}
  if(!canFull())return;try{TG.expand();}catch(e){}
  const want=store.full!==false;try{if(want&&!TG.isFullscreen)TG.requestFullscreen();else if(!want&&TG.isFullscreen)TG.exitFullscreen();}catch(e){}
}
function cloudGet(key){
  return new Promise(res=>{
    try{if(!TG||!TG.CloudStorage)return res(null);TG.CloudStorage.getItem(key,(err,val)=>{if(err)CLOUD_ERR=true;res(err||!val?null:val);});}catch(e){CLOUD_ERR=true;res(null);}
  });
}
async function cloudLoadM(){
  const n=+(await cloudGet(MKEY+'_n'))||0;if(!n)return null;
  let s='';for(let i=0;i<n;i++){const p=await cloudGet(MKEY+'_'+i);if(p===null)return null;s+=p;}
  try{return JSON.parse(s);}catch(e){return null;}
}
// 13.9.20 (Андрей: «тёмная полоса сверху на ПК»): шапку Telegram (на ПК — с «← ⋮ ×») убрать нельзя — красим её в цвет верха страницы.
// Цвет — --top у body (верх страницы там ровный, без свечения и картинок), иначе фон body. Тот же цвет — фону под страницей и нижней полосе.
let TGHC='';
const hexOf=c=>{c=String(c||'').trim();if(/^#[0-9a-f]{6}$/i.test(c))return c.toLowerCase();if(/^#[0-9a-f]{3}$/i.test(c))return '#'+c.slice(1).replace(/./g,x=>x+x).toLowerCase();
  const m=/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+))?/.exec(c);if(!m||(m[4]!=null&&+m[4]<0.99))return '';return '#'+[m[1],m[2],m[3]].map(x=>(+x).toString(16).padStart(2,'0')).join('');};
function tgHead(){if(!TG||!document.body)return;let c='';try{const cs=getComputedStyle(document.body);c=hexOf(cs.getPropertyValue('--top'))||hexOf(cs.backgroundColor);}catch(e){}
  c=c||'#0b0b0d';if(c===TGHC)return;TGHC=c;try{TG.setHeaderColor(c);TG.setBackgroundColor(c);if(TG.setBottomBarColor)TG.setBottomBarColor(c);}catch(e){}}
// Вид «Новый» (body[data-look="nd"]): админу — Настройки → «Дизайн», игрокам — флаг ndnew. Шрифт грузится при первом включении.
// 13.9.42: пробы 13.9.22 «Свет / Ночь / Журнал» удалены.
const LOOKS={nd:{n:'Новый',f:'Manrope:wght@400;500;600;700;800&family=Lora:ital,wght@1,500;1,600&family=Caveat:wght@600;700'}};
function lookFont(k){const id='lkf-'+k;if(document.getElementById(id))return;const l=document.createElement('link');l.id=id;l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family='+LOOKS[k].f+'&display=swap';document.head.appendChild(l);}
function lookApply(cls){const b=document.body;if(!b)return;let k='';try{if(window.ZAI_ON){k='nd';if(store.lookV!==2||store.look!=='nd'){store.lookV=2;store.look='nd';save();}}else if(FLAG_ADMIN&&store.lookV!==2){store.lookV=2;store.look='nd';save();}k=k||(FLAG_ADMIN&&LOOKS[store.look]?store.look:(!FLAG_ADMIN&&ndAll()?'nd':''));}catch(e){}   // z-ai-version: вид Z.ai всегда
  // 13.9.26: «Новый» — на всех экранах, кроме игр (Дота, CS, «Шпион», турнир, карточная дуэль)
  const c=cls||'';
  const on=k==='nd';
  if(k==='nd'){ndCss();ndEmoWatch();}   // 13.9.37: стиль макета — лениво; 13.9.42: значки вместо эмодзи
  if(window.ZAI_ON)applyZNew();   // 13.9.59: «Кино 2.0» — новый вид (store.znew) поверх zai.css
  b.dataset.ndk=k==='nd'&&(ND_DARK.test(c)||/\bscnscr\b/.test(c)&&['scep','dircut'].includes(b.dataset.scr))?'1':'';   // витрины и плеер — всегда тёмные
  b.classList.toggle('nd',k==='nd');b.classList.toggle('zai',!!window.ZAI_ON);ndTabs(k==='nd');
  if(on){if(b.dataset.look!==k)b.dataset.look=k;lookFont(k);ndTheme();}else{if(b.dataset.look)delete b.dataset.look;delete b.dataset.ndt;}}
// 13.9.24 — редизайн «Новый» (рабочее название приложения «Без субтитров», макеты Germanize): светлый или тёмный — как тема Telegram
// (плеер всегда тёмный), вкладки «Сегодня · Кино · Словарь · Профиль» (игры — из Профиля), «Сегодня» — один план на кадре и «Потяни, чтобы начать».
// Только админ, Настройки → «Дизайн (на пробу)» → «Новый»; откат — «Сейчас».
const ND_DARK=/\b(admscr|collscr|shopscr)\b/;   // 13.9.40: премиум — по теме Telegram, как в макете (.cell 15)
// 13.9.42: «Новый» игрокам — флаг ndnew (админка → Доступ → «Дизайн «Новый» — кому»); у игрока «Как было» нет
const ndAll=()=>{try{return window.ZAI_ON||FLAGS.ndnew==='on';}catch(e){return window.ZAI_ON||false;}};
const ndOn=()=>{try{if(window.ZAI_ON)return true;return FLAG_ADMIN?(store.look==='nd'||store.lookV!==2):ndAll();}catch(e){return window.ZAI_ON||false;}};
function ndDark(){try{if(TG&&TG.colorScheme)return TG.colorScheme==='dark';}catch(e){}try{return matchMedia('(prefers-color-scheme: dark)').matches;}catch(e){return true;}}
function ndTheme(){const b=document.body;if(!b||b.dataset.look!=='nd')return;const t=ndDark()||b.dataset.ndk==='1'?'dark':'light';/* эпизод с плеером — всегда тёмный */if(b.dataset.ndt!==t){b.dataset.ndt=t;try{tgHead();}catch(e){}}}
try{if(window.matchMedia)matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>ndTheme());}catch(e){}
// 13.9.59 — «Кино 2.0» (styles/znew.css): новый вид поверх zai.css; по умолчанию включён (store.znew),
// выключатель — Настройки → «Оформление» и строка в Профиле. Без .znew на body — старый вид (zai.css как был).
function applyZNew(){if(!document.body)return;document.body.classList.toggle('znew',store.znew!==0);try{tgHead();}catch(e){}}
const ND_TABS={learn:['Сегодня','<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M8 3v4M16 3v4M4 10h16"/>'],kino:[window.ZAI_ON?'Сцены':'Кино','<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M7 5l2 4M12 5l2 4M17 5l2 4"/>'],
  dict:['Словарь','<path d="M6 4h11a1 1 0 0 1 1 1v15l-6-3-6 3V5a1 1 0 0 1 1-1z"/>'],games:['Игры','<path d="M6 12h4M8 10v4"/><circle cx="15.5" cy="11" r=".9"/><circle cx="17.5" cy="13" r=".9"/><path d="M7.5 6h9a5.5 5.5 0 0 1 5.4 6.6l-.7 3.4a3 3 0 0 1-5.2 1.4L14.6 16h-5.2l-1.4 1.4a3 3 0 0 1-5.2-1.4l-.7-3.4A5.5 5.5 0 0 1 7.5 6z"/>'],profile:['Профиль','<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>']};   // 13.9.37: значки из макета; 13.9.57: + Игры
let NDT=null;
function ndTabs(on){const nav=document.getElementById('tabbar');if(!nav||NDT===on)return;NDT=on;
  nav.querySelectorAll('button').forEach(b=>{const t=TABS.find(x=>x.id===b.dataset.nav);if(!t)return;const n=on&&ND_TABS[t.id];
    b.querySelector('svg').innerHTML=n?n[1]:t.ico;b.querySelector('span').textContent=n?n[0]:t.name;b.setAttribute('aria-label',n?n[0]:t.name);});}
// «Потяни, чтобы начать»: тянешь ручку вправо — дальше 70 % ширины и отпустил — старт; просто тап — ручка подпрыгивает (случайно не нажмёшь); Enter/пробел — старт

// ==== 13.9.42 — «с душой» (дизайн/вдохновение-2.md): ни одного эмодзи в «Новом» — тонкие линейные значки одного веса;
// перевод и подсказки — под «пылью» (тап — показать). Значки ставит ndDeEmoji: проходит по тексту экрана и шторок (MutationObserver),
// знакомый эмодзи → <svg class="ni">, незнакомый — убирает (одиночный в своём теге — точка). Словарь (#dlRoot), субтитры, поля ввода и игры не трогает.
const NI={tick:'<path d="M6 12.5l4 4L18 8"/>',fire:'<path d="M12 3c1 3.5 5 5.4 5 10a5 5 0 0 1-10 0c0-2.4 1.4-4 2.5-5 .3 1.8 1.2 2.8 2.5 3-.2-3-1-5.5 0-8z"/>',
  trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M9 20h6M10 17h4"/>',
  lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',unlock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/>',
  bulb:'<path d="M9.5 18h5M10.5 21h3M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>',
  crown:'<path d="M4 18h16M5 15 4 7l5 4 3-6 3 6 5-4-1 8z"/>',duel:'<path d="M4 4l10 10M20 4 10 14M6 15l3 3M18 15l-3 3M4 20l3-3M20 20l-3-3"/>',
  ticket:'<path d="M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4z"/><path d="M14 7v10" stroke-dasharray="2 2"/>',
  repeat:'<path d="M4 11a7 7 0 0 1 12-4.5L19 9M19 4v5h-5M20 13a7 7 0 0 1-12 4.5L5 15M5 20v-5h5"/>',
  book:'<path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v15H7.5A2.5 2.5 0 0 0 5 20.5zM5 20.5V5.5M9 7h6"/>',
  slow:'<path d="M4.5 17a8 8 0 1 1 15 0M12 13 8.5 9.5"/><circle cx="12" cy="13" r="1"/>',
  image:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M4 17l5-4.5 4 3.5 3-2.5 4 3.5"/>',
  film:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M7 5l2 4M12 5l2 4M17 5l2 4"/>',
  check:'<circle cx="12" cy="12" r="9"/><path d="M8 12.2l2.8 2.8L16 9.5"/>',chat:'<path d="M4 5h16v11H10l-5 4v-4H4z"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1-3.5 3.5-5.5 6.5-5.5s5.5 2 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5c2 .7 3 2.6 3.5 5"/>',
  share:'<path d="M12 15V3M8 7l4-4 4 4M5 13v7h14v-7"/>',game:'<path d="M7 8h10a4 4 0 0 1 4 4v2.5a2.5 2.5 0 0 1-4.3 1.7L15.5 15h-7l-1.2 1.2A2.5 2.5 0 0 1 3 14.5V12a4 4 0 0 1 4-4zM8 10.5v3M6.5 12h3"/><circle cx="15.5" cy="11" r=".6"/><circle cx="17.5" cy="13" r=".6"/>',
  phones:'<path d="M4 15v-3a8 8 0 0 1 16 0v3M4 15h3v5H4zM17 15h3v5h-3z"/>',cards:'<rect x="8" y="3" width="11" height="15" rx="2"/><path d="M5 7v12a2 2 0 0 0 2 2h9"/>',
  tv:'<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M8 21h8M9 3l3 3 3-3"/>',work:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M3 12.5h18"/>',
  home:'<path d="M4 11l8-7 8 7M6 9.5V20h12V9.5M10 20v-6h4v6"/>',gift:'<rect x="4" y="10" width="16" height="10" rx="1"/><path d="M3 7h18v3H3zM12 7v13M12 7C10 3 6.5 4 7.5 6.5M12 7c2-4 5.5-3 4.5-.5"/>',
  ear:'<path d="M7.5 9a4.5 4.5 0 1 1 9 0c0 3-3 4-3 7a3 3 0 0 1-5.5 1.6M10 9.5a2 2 0 0 1 4 0"/>',bag:'<path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2"/>',
  spark:'<path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6zM18.5 16l.6 1.9 1.9.6-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6z"/>',
  medal:'<circle cx="12" cy="15" r="5"/><path d="M9 3l3 7 3-7M12 13v4"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
  search:'<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.3-4.3"/>',speaker:'<path d="M4 9.5v5h3.5L12 18V6L7.5 9.5zM15.5 9.5a3.5 3.5 0 0 1 0 5M18 7a7 7 0 0 1 0 10"/>',
  mute:'<path d="M4 9.5v5h3.5L12 18V6L7.5 9.5zM16 10l4 4M20 10l-4 4"/>',star:'<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.9z"/>',
  coin:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v9M14.5 9.5h-3.2a1.6 1.6 0 0 0 0 3.2h1.4a1.6 1.6 0 0 1 0 3.2H9.5"/>',
  music:'<path d="M9 18V5.5l11-2V16"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  target:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8"/>',
  hand:'<path d="M8 13V6.5a1.5 1.5 0 0 1 3 0V11M11 11V4.5a1.5 1.5 0 0 1 3 0V11M14 11V6a1.5 1.5 0 0 1 3 0v7.5A7 7 0 0 1 10 20c-2.6 0-4-1.6-5.4-3.7L3 13.8a1.5 1.5 0 0 1 2.5-1.6L8 15"/>',
  plane:'<path d="M3 13l18-7.5-6.5 15-3.5-5.5zM11 15l4-4.5"/>',pen:'<path d="M4 20l4.5-1L19 8.5 15.5 5 5 15.5zM13.5 7l3.5 3.5"/>',
  mail:'<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3.5 7l8.5 6.5L20.5 7"/>',smile:'<circle cx="12" cy="12" r="8.5"/><path d="M8.5 14a4.5 4.5 0 0 0 7 0M9 9.5h.01M15 9.5h.01"/>',
  heart:'<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',bolt:'<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>',
  help:'<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.5a2.5 2.5 0 0 1 4.8 1c0 1.8-2.4 2-2.4 3.6M12 17h.01"/>',shield:'<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8-7.5 9.5-4.3-1.5-7.5-4.9-7.5-9.5V6z"/>',
  play:'<path d="M8 5.5v13l10.5-6.5z"/>',pause:'<path d="M8.5 5.5v13M15.5 5.5v13"/>',x:'<path d="M6 6l12 12M18 6 6 18"/>',
  wrench:'<path d="M14.5 6.5a4 4 0 0 0-5.3 5.3L4 17l3 3 5.2-5.2a4 4 0 0 0 5.3-5.3l-2.6 2.6-2.6-2.6z"/>',chart:'<path d="M4 20V4M4 20h16M8 16l4-5 3 3 5-7"/>',
  dot:'<circle cx="12" cy="12" r="2.2"/>',party:'<path d="M4 20l4-12 8 8zM14 4.5v2M19.5 10h-2M17.5 6.5l-1.5 1.5M10 3l.5 1.5"/>',
  puzzle:'<path d="M5 8h3.5a2 2 0 1 1 4 0H16v3.5a2 2 0 1 1 0 4V19H5z"/>',sos:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.5"/><path d="M6 6l3.5 3.5M14.5 14.5 18 18M18 6l-3.5 3.5M9.5 14.5 6 18"/>',
  magnet:'<path d="M6 4v7a6 6 0 0 0 12 0V4h-4v7a2 2 0 0 1-4 0V4zM6 7.5h4M14 7.5h4"/>',coffee:'<path d="M5 9h11v5a5 5 0 0 1-10 0zM16 10.5h1.5a2.5 2.5 0 0 1 0 5H15.5M8 3.5v2M11 3.5v2"/>',
  phone:'<path d="M5 4.5h3.5L10 9l-2 1.5a10.5 10.5 0 0 0 5.5 5.5L15 14l4.5 1.5V19a1.5 1.5 0 0 1-1.6 1.5C10.6 20 4 13.4 3.5 6.1A1.5 1.5 0 0 1 5 4.5z"/>'};
const niSVG=(n,c)=>`<svg class="ni${c?' '+c:''}" viewBox="0 0 24 24" aria-hidden="true">${NI[n]||NI.dot}</svg>`;
const NI_EM={'🔥':'fire','🏆':'trophy','🔒':'lock','🔓':'unlock','💡':'bulb','👑':'crown','⚔':'duel','🗡':'duel','🎟':'ticket','🔁':'repeat','📚':'book','📖':'book','📘':'book','🐢':'slow',
  '🖼':'image','🎞':'film','🎬':'film','📽':'film','✅':'check','💬':'chat','💭':'chat','🗣':'chat','👤':'user','👥':'users','🤝':'users','📤':'share','🎮':'game','👾':'game','🎧':'phones','🃏':'cards',
  '📺':'tv','💼':'work','🏠':'home','🎁':'gift','👂':'ear','🛍':'bag','✨':'spark','✦':'spark','🎖':'medal','🥈':'medal','⚙':'gear','🔧':'wrench','🛠':'wrench','🔍':'search',
  '🔊':'speaker','🔈':'speaker','🔇':'mute','⭐':'star','🪙':'coin','💰':'coin','💵':'coin','💎':'coin','♪':'music','🎵':'music','👀':'eye','🎯':'target','👋':'hand','👆':'hand','✈':'plane',
  '✍':'pen','🪶':'pen','✉':'mail','🙂':'smile','👍':'smile','👌':'smile','💘':'heart','⚡':'bolt','❓':'help','🛡':'shield','📈':'chart','🎉':'party','🧩':'puzzle','🆘':'sos',
  '🧲':'magnet','☕':'coffee','📞':'phone','📱':'phone','🏁':'target','⏯':'play','🎨':'pen','🧪':'spark','🐞':'help','🩺':'heart','😤':'smile','🌫':'dot','🤏':'hand','🗑':'x','📊':'chart'};
const NI_RE=/(?:\p{Extended_Pictographic}|[\u{1F1E6}-\u{1F1FF}]|[⭐⚔⚙✅✨✦⚡✈✉✍☕❓❌♪])️?‍?/gu, NI_KEEP=/^[★☆▶⏸↺↻✓✕✗←→↔↑↓©®™•‣]$/;
const NI_SKIP='#dlRoot,.sc-subs,input,textarea,script,style,svg,.ni,.n-emo,.kq,.fxcv,.kv-steal,.stl';
function ndEmoOK(){const b=document.body;return !!b&&b.dataset.look==='nd';}   // в играх data-look нет — их не трогаем
function ndDeEmoji(root){if(!root||!ndEmoOK())return;const tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),L=[];let n;
  while((n=tw.nextNode())){NI_RE.lastIndex=0;if(!NI_RE.test(n.data))continue;const p=n.parentElement;if(!p||p.closest(NI_SKIP))continue;L.push(n);}
  for(const t of L){const txt=t.data,p=t.parentElement,frag=document.createDocumentFragment();let last=0,m;NI_RE.lastIndex=0;
    const solo=txt.trim().replace(NI_RE,'')===''&&p.childNodes.length===1;
    while((m=NI_RE.exec(txt))){const ch=m[0].replace(/[\uFE0F\u200D]/g,'');if(NI_KEEP.test(ch)){if(ch!==m[0]){const pre=txt.slice(last,m.index);if(pre)frag.appendChild(document.createTextNode(pre));frag.appendChild(document.createTextNode(ch));last=m.index+m[0].length;}continue;}
      let pre=txt.slice(last,m.index);const name=NI_EM[ch]||(solo?'dot':'');
      if(pre)frag.appendChild(document.createTextNode(pre));
      if(name){const sp=document.createElement('span');sp.className='n-ic';sp.dataset.n=name;sp.innerHTML=niSVG(name);frag.appendChild(sp);}
      last=m.index+m[0].length;if(!name&&txt[last]===' ')last++;}
    if(!last)continue;frag.appendChild(document.createTextNode(txt.slice(last)));t.replaceWith(frag);}}
let NDEMO=null;
function ndEmoWatch(){if(NDEMO||!window.MutationObserver)return;let q=new Set(),raf=0;
  NDEMO=new MutationObserver(ms=>{if(!ndEmoOK())return;for(const m of ms){if(m.type==='characterData'){if(m.target.parentElement)q.add(m.target.parentElement);}else m.addedNodes.forEach(x=>{if(x.nodeType===1)q.add(x);else if(x.nodeType===3&&x.parentElement)q.add(x.parentElement);});}
    if(!raf)raf=requestAnimationFrame(()=>{raf=0;const L=[...q];q=new Set();L.forEach(x=>{if(x.isConnected)ndDeEmoji(x);});});});
  NDEMO.observe(document.body,{childList:true,subtree:true,characterData:true});}
const ndAccMode=()=>{const f=typeof FLAG_RAW!=='undefined'&&FLAG_RAW&&FLAG_RAW.ndnew;return !f?'me':f.st==='on'?'all':'test';};
async function ndAccSet(mode,allow){const raw=JSON.parse(JSON.stringify(FLAG_RAW||{}));allow=[...new Set((allow||[]).map(x=>String(x).replace(/\D/g,'')).filter(x=>x&&x!=='0'))];
  if(mode==='all')raw.ndnew={st:'on',allow:allow.length?allow:['0']};else if(mode==='test'){if(!allow.length){toast('Впиши ID тестеров');return false;}raw.ndnew={st:'hide',allow};}else delete raw.ndnew;
  try{const r=await flagsCall({a:'set',flags:raw});if(r&&r.ok){FLAG_RAW=r.v.raw||{};if(typeof ADM_DR!=='undefined'&&ADM_DR){if(FLAG_RAW.ndnew)ADM_DR.ndnew={st:FLAG_RAW.ndnew.st,allow:[...FLAG_RAW.ndnew.allow]};else delete ADM_DR.ndnew;}haptic('ok');return true;}
    toast((r&&r.msg)||'Не получилось — открой в Telegram');}catch(e){toast('Нет связи с сервером');}return false;}
// «пыль» (как спойлер в Telegram): текст спрятан мерцающими точками, тап — показать. Только в «Новом»; без «Новый» — обычный текст.
const ndSp=(html,c)=>ndOn()?`<span class="n-sp${c?' '+c:''}" role="button" tabindex="0" aria-label="Показать перевод"><span class="n-spt">${html}</span></span>`:html;
document.addEventListener('click',e=>{const sp=e.target.closest&&e.target.closest('.n-sp:not(.open)');if(!sp)return;e.preventDefault();e.stopPropagation();sp.classList.add('open');sp.removeAttribute('role');try{sfx('tap');haptic('sel');}catch(_){}},true);
document.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const sp=e.target.closest&&e.target.closest('.n-sp:not(.open)');if(sp){e.preventDefault();sp.click();}},true);
function ndPull(el,go){const k=el.querySelector('.ndpull-k'),f=el.querySelector('.ndpull-f');let x0=null,dx=0,max=1,done=false,buzz=false;
  const set=(v,anim)=>{el.classList.toggle('back',!!anim);k.style.transform=v?`translateX(${v}px)`:'';f.style.transform=`scaleX(${Math.min(1,(v+k.offsetWidth+8)/el.clientWidth)})`;el.style.setProperty('--pp',(v/max).toFixed(3));};
  const fire=()=>{if(done)return;done=true;el.classList.add('done');set(max);haptic('medium');sfx('whoosh');   // 13.9.39: как в Germanize — дотянул: полоса заливается, в ручке ✓, потом переход
    const sv=k.querySelector('svg');if(sv)sv.innerHTML='<path d="M5 12.5l4.5 4.5L19 7.5"/>';setTimeout(go,fxOK()?440:0);};
  el.addEventListener('pointerdown',e=>{if(done)return;x0=e.clientX;dx=0;buzz=false;max=Math.max(1,el.clientWidth-k.offsetWidth-8);el.classList.add('drag');el.classList.remove('nudge');tgVSwipes(true);try{el.setPointerCapture(e.pointerId);}catch(_){}});
  el.addEventListener('pointermove',e=>{if(x0==null)return;dx=Math.max(0,Math.min(max,e.clientX-x0));set(dx);if(!buzz&&dx>=max*.7){buzz=true;haptic('sel');}else if(buzz&&dx<max*.7)buzz=false;});
  const up=()=>{if(x0==null)return;x0=null;el.classList.remove('drag');tgVSwipes(false);if(dx>=max*.7)fire();else{set(0,true);if(dx<8){el.classList.remove('nudge');void el.offsetWidth;el.classList.add('nudge');haptic('light');}}dx=0;};
  el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);el.addEventListener('lostpointercapture',up);
  el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fire();}};}
// 13.9.49 (движения Germanize, п.2): главная кнопка — заливка и ✓ при нажатии, как у «Потяни» (движения.md: «кнопка «Смотреть» — заливка и ✓ при нажатии»); переход после вспышки
function nCta(el,go){if(!el||el._ncta)return;el._ncta=1;
  el.addEventListener('click',e=>{if(el.classList.contains('go')){e.preventDefault();return;}e.preventDefault();el.classList.add('go');haptic('medium');sfx('whoosh');setTimeout(go,fxOK()?460:0);});}
// 13.9.37 (ТЗ-13.9.32, P2 экран 6): «Сегодня» как в макете (дизайн/макеты-13.9.24.html, .cell 6). Стиль — styles/nd.css (лениво, ndCss), классы n-*.
// Шапка: буква в круге, «Добрый день, Андрей», «B1 · цель — работа», 🔥 и кольцо цели дня; план на кадре фильма с «Потяни»; строки «Фраза дня» и «Смотреть дальше»
function ndCss(){if(document.getElementById('ndcss'))return;const l=document.createElement('link');l.id='ndcss';l.rel='stylesheet';l.href='styles/nd.css?v='+APP_V;
  l.onload=l.onerror=()=>document.body.classList.add('ndc');document.head.appendChild(l);setTimeout(()=>document.body.classList.add('ndc'),3000);
  if(window.ZAI_ON&&!document.getElementById('zaicss')){const z=document.createElement('link');z.id='zaicss';z.rel='stylesheet';z.href='styles/zai.css?v='+APP_V;document.head.appendChild(z);}
  if(window.ZAI_ON&&!document.getElementById('znewcss')){const w=document.createElement('link');w.id='znewcss';w.rel='stylesheet';w.href='styles/znew.css?v='+APP_V;document.head.appendChild(w);}}
const ND_GOAL={work:'работа',travel:'путешествия',films:'кино без перевода',move:'переезд',self:'для себя'};
function ndNext(c){const sh=x=>x.show||x.title,ok=x=>x.kind!=='clip'&&flagOf('scene-'+x.id)==='on'&&!ageLock(x)&&scLang(x)===scLang(c.s)&&sh(x)!==sh(c.s);
  const todo=x=>{const P=scP(x.id);return x.parts.findIndex((p,k)=>!P.done.includes(k));},go=x=>{const P=scP(x.id);return P.done.length||Object.keys(P.w||{}).length?1:0;};
  const lv=CEFR.indexOf(store.cefr||'')+1||(store.lvl==='a'?2:3),L=SCENES.filter(x=>ok(x)&&todo(x)>=0).sort((a,b)=>go(b)-go(a)||Math.abs((a.lvl||3)-lv)-Math.abs((b.lvl||3)-lv));
  return L.length?{s:L[0],i:todo(L[0])}:null;}
function ndTodayHTML(){
  const c=continueScene(),s=c.s,p=s.parts[c.i],d=dayStat(),goal=store.goal||20,gp=Math.min(100,Math.round(d.n/goal*100)),st=streakNow(),n=dailyItems().length;
  const hr=new Date().getHours(),hi=hr<5?'Доброй ночи':hr<12?'Доброе утро':hr<18?'Добрый день':'Добрый вечер',nm=(userName()||'').trim().split(/\s+/)[0];
  const lv=store.cefr||(store.lvl==='a'?'A2':store.lvl==='b'?'B1':''),gw=ND_GOAL[store.goalWhy],sub=[lvW(lv),gw?'цель — '+gw:''].filter(Boolean).join(' · ')||'План на сегодня готов';
  const ok=d.n>=goal,risk=st>0&&store.lastDay!==new Date().toDateString(),bdi=filmImg(s,innerWidth>=1000?'bd.jpg':'bdm.jpg'),cf=cefrOf(s),mins=Math.max(2,Math.round((p.b-p.a)/60+2));
  const th=(x,i)=>`style="background-image:url('${assetUrl(scEpKey(x,i,'jpg'))}'),url('${assetUrl(scKey(x,'cover.jpg'))}')"`;
  const pod=phraseOfDay(),nx=ndNext(c);
  // 13.9.61: главный экран не пустует — плитки статистики (серия / фразы / эпизоды) и подпись секции
  const ph=dictCount()[0],eps=SCENES.reduce((a,x)=>a+((scP(x.id).done||[]).length),0);
  const rows=[
    pod?`<button class="n-row" data-go="pod"><div class="n-th" ${th(pod.s,pod.f.pi)}></div><div><small>Фраза дня</small><b>${esc(pod.s.lang==='de'?pod.f.de:scT(pod.f))} — ${esc(pod.f.ru)}</b></div><span class="n-cv">›</span></button>`:'',
    nx?`<button class="n-row" data-go="next" data-sc="${nx.s.id}" data-i="${nx.i}"><div class="n-th" ${th(nx.s,nx.i)}></div><div><small>Смотреть дальше</small><b>${esc(nx.s.show||nx.s.title)} · ${esc(nx.s.parts[nx.i].t)}</b></div><span class="n-cv">›</span></button>`:'',
    n?`<button class="n-row" data-go="rev"><div class="n-th" ${th(s,c.i)}></div><div><small>Повторить</small><b>Фразы и слова · ≈ ${Math.max(2,Math.round(n*0.4))} мин</b></div><span class="n-cnt">${n}</span></button>`:''
  ].filter(Boolean).join('');
  return `<div class="n-scr n-today">
    <div class="n-hello"><div class="n-ava">${esc((nm||'Я').charAt(0).toUpperCase())}</div><div><b>${hi}${nm?', '+esc(nm):''}</b><span>${esc(sub)}</span></div>
      <div class="n-fire${risk?' risk':''}"><i>🔥</i><i>${st}</i></div><button class="n-ring${ok?' ok':''}" id="hDay" aria-label="Цель дня" style="--p:${gp}"><svg viewBox="0 0 38 38"><circle class="bgc" cx="19" cy="19" r="15.9" pathLength="100"/><circle class="fg" cx="19" cy="19" r="15.9" pathLength="100"/></svg><b>${ok?'✓':Math.min(d.n,goal)}</b></button></div>
    <section class="n-hero" id="hHero" data-sc="${s.id}"><div class="n-bgi" style="background-image:${bdi?`url('${bdi}'),`:''}url('${assetUrl(scKey(s,'cover.jpg'))}')"></div>
      <div class="n-eb">${c.fresh?'Начни отсюда':c.next?'Следующая сцена':'План на сегодня'}</div>
      <h3>Эпизод <em>«${esc(p.t)}»</em>${n?` и ${n} ${plural(n,['повторение','повторения','повторений'])}`:''}</h3>
      <div class="n-meta"><span class="n-chip ${cf.toLowerCase()}">${lvW(cf)}</span><span class="n-t">≈ ${mins} мин</span><span class="n-t">${esc(s.show||s.title)}</span></div>
      <div class="n-pull" id="ndPull" role="button" tabindex="0" aria-label="Потяни, чтобы начать"><i class="ndpull-f"></i><span class="ndpull-t">Потяни, чтобы начать</span><i class="ndpull-k"><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></i></div>
    </section>
    <div class="n-stats" role="group" aria-label="Статистика"><div><b>🔥 ${st}</b><small>серия</small></div><div><b>${ph}</b><small>фраз выучено</small></div><div><b>${eps}</b><small>эпизодов</small></div></div>
    ${rows?`<div class="n-sechead">План на сегодня</div>${rows}`:''}
  </div>`;}
const ndYear=s=>{const m=String(s.ep||'').match(/(19|20)\d\d/);return m?m[0]:'';};
// 13.9.40 (ТЗ-13.9.32, P2 экран 11): итог эпизода как в макете (.cell 11) — звёзды выпрыгивают, «Эпизод пройден» маркером с ручками,
// кадр-награда переворачивается («КАДР» → кадр эпизода), «фраз в словарь» и «билетов» набегают, одна кнопка; ниже — факты-награды и «Что закрепили»
function ndResultHTML(o){const {s,i,stars,boss,les,lastEp,got,gain,okF,n}=o,p=s.parts[i],ep=!boss&&!les&&p,nx=!les&&!boss&&s.parts[i+1];
  const what=boss?'Финал':les?'Урок':'Эпизод';
  const btn=boss?`<button class="n-pbtn" id="scpath">К пути сцены</button>`:nx?`<button class="n-pbtn" id="scnext">Следующий эпизод</button>`:lastEp?`<button class="n-pbtn" id="scbossgo">👑 Финал сцены</button>`:`<button class="n-pbtn" id="scrp">Вернуться к эпизоду</button>`;
  const more=[boss?`<button id="scdir">🎬 Режиссёрская версия</button>`:'',(boss||lastEp)?`<button id="scsum">📚 Все фразы</button>`:'',ep&&(nx||lastEp)?`<button id="scrp">↺ Ещё раз эпизод</button>`:'',`<button id="scshare">📤 Позвать друга</button>`].filter(Boolean).join('');
  return `<div class="n-scr n-done">
    ${(()=>{const N=Math.max(1,n||0),k=Math.min(N,okF||0),C=2*Math.PI*44;   // 13.9.43: вместо трёх звёзд — кольцо «сколько верно с первой попытки»
      return `<div class="n-ring2${k>=N?' full':''}" data-k="${k}" data-n="${N}" style="--c:${C.toFixed(1)};--o:${(C*(1-k/N)).toFixed(1)}"><svg viewBox="0 0 100 100" aria-hidden="true"><circle class="bg" cx="50" cy="50" r="44"/><circle class="fg" cx="50" cy="50" r="44"/></svg><span><b>${k}<small>/${N}</small></b><em>${k>=N?'всё верно':'с первого раза'}</em></span></div>`;})()}
    <h3 class="n-h">${what} <em class="n-mk">пройден</em></h3>
    <p class="n-mute">${esc((s.title||'').replace(/⁠/g,''))}${ep?' · '+esc(p.t):''}</p>
    ${ep?`<div class="n-flip"><div class="n-fin"><div class="n-fc">КАДР</div><div class="n-bc" style="background-image:url('${rwKadr(s,i)}'),url('${assetUrl(scEpKey(s,i,'jpg'))}')">Кадр №${i+1}${(f0=>f0?` · «${esc(scT(f0))}»`:'')(phPick(scAct(p.ph),1)[0])}</div></div></div>`:''}
    <div class="n-gain"><div><b data-n="${got}">${got}</b><span>${plural(got,['фраза','фразы','фраз'])} в словарь</span></div><div><b data-n="${gain}">${gain}</b><span>${plural(gain,['билет','билета','билетов'])}</span></div></div>
    ${btn}<div class="n-more">${more}</div>
  </div>`;}
// итог эпизода в «Новом»: звёзды по одной со звоном и искрами, при 3★ — дождь конфетти; «8 / 8» набегает
function ndResultFX(stars){if(!fxOK())return;const R=document.querySelector('.n-ring2');
  if(R){R.classList.add('go');const b=R.querySelector('b'),k=+R.dataset.k,t0=performance.now()+300;b.firstChild.textContent='0';
    const step=t=>{if(!b.isConnected)return;const q=Math.max(0,Math.min(1,(t-t0)/900));b.firstChild.textContent=Math.round(k*(1-Math.pow(1-q,3)));if(q<1)requestAnimationFrame(step);else if(R.classList.contains('full')){fxAt(R,{n:16,v:4,life:40});sfx('learn');haptic('ok');}};requestAnimationFrame(step);}
  if(stars===3)setTimeout(()=>fxRain(46),1300);
  document.querySelectorAll('.n-gain b[data-n]').forEach((b,k)=>{const n=+b.dataset.n,t0=performance.now()+500+k*150;b.textContent='0';const step=t=>{if(!b.isConnected)return;const q=Math.max(0,Math.min(1,(t-t0)/900));b.textContent=Math.round(n*(1-Math.pow(1-q,3)));if(q<1)requestAnimationFrame(step);};requestAnimationFrame(step);});
  const big=document.querySelector('.sc-result .sc-big'),m=big&&/^(\d+) \/ (\d+)$/.exec(big.textContent.trim());
  if(m){const n=+m[1],t0=performance.now()+150;const step=t=>{if(!big.isConnected)return;const k=Math.max(0,Math.min(1,(t-t0)/800));big.textContent=Math.round(n*(1-Math.pow(1-k,3)))+' / '+m[2];if(k<1)requestAnimationFrame(step);};requestAnimationFrame(step);}}
// уровень сцены по CEFR (lvl 1–5 → A1…C1) — цветная метка, как у Germanize; видна только в «Новом»
const CEFR=['A1','A2','B1','B2','C1'];
// 13.9.71 (П10): игроку уровень — словами (Андрей: «буквы — колхоз»); буквы A1–C1 — только внутри (store.cefr, CEFR, цвета .l-a1…c1).
// Где места нет (строка словаря, уголок постера) — полоски, как сила сигнала: 1–5 полосок цвета уровня, слово — в подсказке
const LVW={A1:'Начинающий',A2:'Базовый',B1:'Средний',B2:'Выше среднего',C1:'Продвинутый'};
const lvW=c=>LVW[c]||'';
const onbLvP=c=>(c<'B1'?'Начнём со сцен попроще и с подсказками.':'Сцены — по твоему уровню, задания — обычной сложности.')+' Уровень дальше сам растёт и падает по твоим ответам.';
// 13.9.72 (П10b): живой уровень — растёт и падает по ответам, как рейтинг (Андрей: «чтобы уровень менялся по ответам, как рейтинг»).
// store.lvR — 1.0…5.99 (целая часть — уровень: 1 = A1 … 5 = C1); старт — середина уровня (store.cefr, иначе store.lvl), после теста уровня — заново.
// Ответ с первой попытки: трудность d = уровень фразы (самое редкое слово, wlvText) или слова (wlvWord) + поправка за вид задания (на слух труднее);
// ожидание p = σ(1.2·(lvR − d − 0.5) + 1.386) — фразы своего уровня решают в ~80 % случаев; lvR += K·(верно − p), K = 0.12 первые 30 ответов, потом 0.06.
// Видимый уровень store.cefr меняется, только когда lvR ушёл за границу больше чем на 0.08 и с прошлой смены было ≥ 6 ответов. Вырос — плашка, упал — тихо.
const LV_ADJ={listen:.5,heard:.3,hear:.3,lbuild:.5,dict:.6,build:.25,expr:.15,dexpr:.15};
const lvSeed=()=>{const c=CEFR.indexOf(store.cefr||'');return c>=0?c+1.5:store.lvl==='a'?2.5:3.5;};
const lvR=()=>typeof store.lvR==='number'&&store.lvR>=1?store.lvR:lvSeed();
function lvRate(good,d,t){if(!d)return;   // у фразы нет уровня (имена, своё слово) — не считаем
  try{const r=lvR(),p=1/(1+Math.exp(-(1.2*(r-d-(LV_ADJ[t]||0)-.5)+1.386))),n=store.lvN||0,v=Math.max(1,Math.min(5.99,r+(n<30?.12:.06)*((good?1:0)-p)));
    store.lvR=Math.round(v*1000)/1000;store.lvN=n+1;
    const cur=CEFR.indexOf(store.cefr||'')+1||Math.floor(lvSeed()),b=Math.floor(v);
    if(b!==cur&&(v>=cur+1.08||v<cur-.08)&&store.lvN-(store.lvCh||0)>=6){const now=CEFR[b-1],up=b>cur;store.cefr=now;store.lvCh=store.lvN;
      try{ph('capture','lv_change',{from:CEFR[cur-1],to:now});}catch(e){}
      if(up)setTimeout(()=>{toast('Твой уровень вырос: '+lvW(now));sfx('learn');haptic('ok');},1300);}
  }catch(e){}}
// прогресс внутри уровня (0…1) для Профиля: от начала видимого уровня до следующего
const lvProg=()=>{const c=CEFR.indexOf(store.cefr||'')+1||Math.floor(lvSeed());return Math.max(0,Math.min(1,lvR()-c));};
// строка «Твой уровень» в Профиле: слово, полоски, сколько до следующего; тап — как считается
function lvRowHTML(){const c=store.cefr||CEFR[Math.floor(lvSeed())-1],i=CEFR.indexOf(c),pr=Math.round(lvProg()*100),top=i>=CEFR.length-1;
  return `<button class="n-lvr anim l-${c.toLowerCase()}" id="pfLv" aria-expanded="false"><span class="n-lvr-h"><small>Твой уровень</small><b>${lvW(c)}</b></span>${lvBars(c)}
    <span class="n-lvr-bar" aria-hidden="true"><i style="width:${top?100:pr}%"></i></span>
    <small class="n-lvr-s">${top?'Высший уровень — держи его ответами':`До уровня «${lvW(CEFR[i+1])}» — ${pr} %`} · растёт и падает по ответам</small>
    <span class="n-lvr-x">Двигают ответы с первой попытки — в проверке эпизода, повторении, «Моих словах» и Versus. Трудная фраза верно — вверх, ошибка в лёгкой — вниз. Пройти тест заново — Настройки → «Пройти первый запуск заново».</span></button>`;}
const lvBarsIn=n=>[1,2,3,4,5].map(k=>`<i${k<=n?' class="on"':''}></i>`).join('');
const lvBars=(c,cls)=>{const n=CEFR.indexOf(c)+1;return n?`<i class="lvb l-${c.toLowerCase()}${cls?' '+cls:''}" title="${LVW[c]}" aria-label="Уровень: ${LVW[c]}">${lvBarsIn(n)}</i>`:'';};
const cefrOf=s=>CEFR[Math.max(1,Math.min(5,(s&&s.lvl)||3))-1];
const lvcHTML=(s,word)=>{const c=cefrOf(s);return word?`<span class="lvc l-${c.toLowerCase()}">${LVW[c]}</span>`:`<span class="lvc lvbc l-${c.toLowerCase()}" title="${LVW[c]}">${lvBarsIn(CEFR.indexOf(c)+1)}</span>`;};
function initTG(){
  if(!TG)return;
  try{TG.ready();TG.expand();}catch(e){}
  try{TG.onEvent('themeChanged',()=>ndTheme());}catch(e){}
  try{if(TG.enableVerticalSwipes)TG.enableVerticalSwipes();}catch(e){}
  tgHead();
  setInsets();
  ['safeAreaChanged','contentSafeAreaChanged','fullscreenChanged','viewportChanged'].forEach(ev=>{try{TG.onEvent(ev,setInsets);}catch(e){}});
  try{TG.BackButton.onClick(onBack);}catch(e){}
  applyFullscreen();setTimeout(applyFullscreen,500);
  // 13.0.2: по ссылке (дуэль, шпион, турнир) Telegram открывает приложение на полэкрана, а ранний expand() iOS может
  // проглотить, пока шторка выезжает. Первые 5 с дожимаем: повторы + если окно встало не развёрнутым — разворачиваем.
  const T0=Date.now(),exp=()=>{try{if(!TG.isExpanded)TG.expand();}catch(e){}};
  [150,400,900,1600,2600].forEach(t=>setTimeout(exp,t));
  try{TG.onEvent('viewportChanged',e=>{if(Date.now()-T0<5000&&(!e||e.isStateStable))exp();});}catch(e){}
  try{TG.onEvent('activated',exp);TG.onEvent('activated',cloudResync);TG.onEvent('deactivated',cloudFlush);}catch(e){}
  document.addEventListener('pointerdown',function once(){document.removeEventListener('pointerdown',once,true);if(store.full!==false&&canFull()&&!TG.isFullscreen)applyFullscreen();},true);
  cloudSync();
}
// 13.6.3: ошибка чтения (CLOUD_ERR) ≠ «в облаке пусто»: раньше при сбое сети старый прогресс заливался поверх свежего с другого устройства
function cloudLoad(key){return new Promise(res=>{try{if(!TG||!TG.CloudStorage)return res(null);
  TG.CloudStorage.getItem(key+'_n',(e,n)=>{if(e)CLOUD_ERR=true;n=+n;if(e||!n)return res(null);const ks=[...Array(n).keys()].map(i=>key+'_'+i);
    TG.CloudStorage.getItems(ks,(e2,v)=>{if(e2)CLOUD_ERR=true;if(e2||!v)return res(null);try{res(JSON.parse(ks.map(k=>v[k]||'').join('')));}catch(x){res(null);}});});}catch(e){CLOUD_ERR=true;res(null);}});}
// 12.1: синк телефон ↔ ПК. Раньше облачная копия бралась целиком, только если в ней больше ответов, — «Мои слова», награды,
// покупки и звёзды с другого устройства терялись. Теперь — слияние по полям; настройки экрана/звука остаются свои.
const LOCAL_ONLY=['dictVar','knWin','knLines','dlDemo','ssRev','subSz','subSame','introV','shopTab','hmOff','snd','fx','full','fullV','theme','znew','tab','subV','subStyle','scSub','scSubChosen','scVol','scMute','musVol','musAuto','vtask','scStopPh','bg3d','labSub','labSnd','labUi','tts','autoSpeak','srCat','kinoCat','kinoLang','kinoLv','dictV','dictVS','scLast','srRecent','admPlayer','scPause','scPauseV','scFill','tourV','tourPlayed','tourLang','collTab','knView','knCards','knMyV','knMyKind','knMyBy','look','lookV','premC'];
function storeMerge(c,base){storeRelay(c);const L=store,cNew=(c.sv||0)>(base==null?SV0:base),o=Object.assign({},cNew?L:c,cNew?c:L);
  const uni=k=>Object.assign({},c[k]||{},L[k]||{});
  o.myw=uni('myw');o.mywDel=uni('mywDel');for(const k in c.myw||{}){const a=(L.myw||{})[k],b=c.myw[k];if(a&&((b.st||0)>(a.st||0)||((b.st||0)===(a.st||0)&&(b.due||0)>(a.due||0))))o.myw[k]=b;}
  for(const k in o.mywDel)if(o.myw[k]&&(o.myw[k].at||0)<o.mywDel[k])delete o.myw[k];
  o.rw=uni('rw');for(const k in c.rw||{})if(L.rw&&L.rw[k]&&c.rw[k].t<L.rw[k].t)o.rw[k]=c.rw[k];
  ['scOwn','kvPaid','kvDone','ach','duels','goalsDone','seg','showRw','seasonRw','dirCut'].forEach(k=>{if((c[k]&&typeof c[k]==='object'&&!Array.isArray(c[k]))||(L[k]&&typeof L[k]==='object'&&!Array.isArray(L[k])))o[k]=uni(k);});
  if(c.shop||L.shop){const a=c.shop||{},b=L.shop||{};o.shop={own:Object.assign({},a.own||{},b.own||{}),use:Object.assign({},(cNew?b:a).use||{},(cNew?a:b).use||{})};}   // 13.2: покупки — объединение
  o.best=uni('best');for(const k in c.best||{})o.best[k]=Math.max(+c.best[k]||0,+(L.best||{})[k]||0);
  ['heroXP','dvPlay'].forEach(k=>{if(!c[k]&&!L[k])return;o[k]=uni(k);for(const x in c[k]||{})o[k][x]=Math.max(+c[k][x]||0,+(L[k]||{})[x]||0);});   // 13.9.73: опыт героев — больший
  ['answered','correct','bestStreak','played','reviews','perfect','goalsDone'].forEach(k=>o[k]=Math.max(+c[k]||0,+L[k]||0));
  LOCAL_ONLY.forEach(k=>{if(k in L)o[k]=L[k];else delete o[k];});
  return normalize(o);}
function scMergeIn(c){for(const id in c){const a=scP(id),b=scRelay(id,c[id]||{});
  a.done=[...new Set([...a.done,...(b.done||[])])];for(const k in b.m||{})a.m[k]=Math.max(a.m[k]||0,b.m[k]);Object.assign(a.w,b.w||{});
  a.got=Object.assign({},b.got||{},a.got||{});a.vq=Object.assign({},b.vq||{},a.vq||{});a.rDone=Object.assign({},b.rDone||{},a.rDone||{});
  if(b.st){a.st=a.st||{};for(const k in b.st)a.st[k]=Math.max(a.st[k]||0,b.st[k]);}
  if(b.boss)a.boss=Math.max(a.boss||0,b.boss);
  for(const k in b.r||{}){const x=a.r[k],y=b.r[k];if(!x||y[0]>x[0]||(y[0]===x[0]&&y[1]>x[1]))a.r[k]=y;}}}
async function cloudSync(){
  if(CLOUD_BUSY)return;CLOUD_BUSY=true;CLOUD_ERR=false;
  // 13.6.3: синк и при возврате в приложение (cloudResync): тогда «новее» сравнивается с последним своим изменением, а не с запуском
  const first=!CLOUD_OK,base=first?SV0:(store.sv||0),snap=()=>svCore()+JSON.stringify(SC),h0=first?'':snap();
  try{let c=await cloudLoad(KEY);if(!c){const v=await cloudGet(KEY);try{c=v&&JSON.parse(v);}catch(e){c=null;}}
    let more=true;
    if(c&&typeof c==='object'){
      if((store.resetAt||0)>(c.sv||0))more=false;   // в облаке — прогресс до сброса: не возвращаем его
      else if((c.resetAt||0)>(store.resetAt||0)&&(c.resetAt||0)>base){const keep={};LOCAL_ONLY.forEach(k=>{if(k in store)keep[k]=store[k];});store=normalize(Object.assign(c,keep));SC={};M={};RV={};}   // сброс был на другом устройстве
      else store=storeMerge(c,base);
    }else if(!store.answered){const o0=await cloudGet(OLD_KEY);let o=null;try{o=o0&&JSON.parse(o0);}catch(e){}if(o&&(o.answered||0)>0&&!store.onboarded)store=migrate(o);}
    if(more){const sc=await cloudLoad(SCK);if(sc)scMergeIn(sc);
      const cm=await cloudLoadM();if(cm)for(const k in cm)if((cm[k]||0)>(M[k]||0))M[k]=cm[k];
      const cr=await cloudLoad(RKEY);if(cr)for(const k in cr){const x=RV[k],y=cr[k];if(Array.isArray(y)&&(!x||y[0]>x[0]))RV[k]=y;}}
  }catch(e){}
  CLOUD_BUSY=false;
  if(CLOUD_ERR){if(first&&++CLOUD_TRY<=2)setTimeout(cloudSync,CLOUD_TRY*20000);return;}   // не прочиталось — поверх облака ничего не пишем; повтор (и при возврате в приложение)
  CLOUD_OK=true;CLOUD_AT=Date.now();save();scSave();saveM();saveRV();
  if((first||snap()!==h0)&&screen==='home'&&!document.querySelector('.dxo,.rwo,.dfly,.sc-sheetwrap,.bgvw,.pk,.srv,.stl,.kno,.kn-sheet,.dli,.dlp')&&!document.body.classList.contains('kw-open'))try{renderHome();}catch(e){}
}
// вернулся в приложение (телефон и ПК открыты оба): подтянуть сделанное на другом устройстве — только на вкладках, не посреди сцены
function cloudResync(){if(!TG||!TG.CloudStorage||CLOUD_BUSY)return;if(CLOUD_OK&&Date.now()-CLOUD_AT<60000)return;if(screen!=='home'&&screen!=='subtab')return;cloudSync();}
document.addEventListener('visibilitychange',()=>{if(document.hidden)cloudFlush();else cloudResync();});
window.addEventListener('pagehide',cloudFlush);
function backBtn(show){if(!TG)return;try{show?TG.BackButton.show():TG.BackButton.hide();}catch(e){}}
function haptic(t){
  try{
    if(TG&&TG.HapticFeedback){
      if(t==='ok')TG.HapticFeedback.notificationOccurred('success');
      else if(t==='err')TG.HapticFeedback.notificationOccurred('error');
      else if(t==='warn')TG.HapticFeedback.notificationOccurred('warning');
      else if(t==='sel')TG.HapticFeedback.selectionChanged();
      else TG.HapticFeedback.impactOccurred(t||'light');
      return;
    }
    if(navigator.vibrate)navigator.vibrate(t==='err'?[50,40,70]:t==='ok'?20:10);
  }catch(e){}
}
function userName(){try{const u=TG&&TG.initDataUnsafe&&TG.initDataUnsafe.user;return u?([u.first_name,u.last_name].filter(Boolean).join(' ')||u.username||''):'';}catch(e){return '';}}

/* ================= звук ================= */
let AC=null,MASTER=null,NOISE=null;
function ac(){
  if(!AC){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;AC=new C();MASTER=AC.createGain();MASTER.gain.value=.9;const cp=AC.createDynamicsCompressor();MASTER.connect(cp);cp.connect(AC.destination);}
  if(AC.state==='suspended')AC.resume();
  return AC;
}
function osc(type,f,t0,dur,vol,o){
  o=o||{};const a=ac();if(!a)return;
  const t=a.currentTime+t0,os=a.createOscillator(),g=a.createGain();
  os.type=type;os.frequency.setValueAtTime(f,t);
  if(o.to)os.frequency.exponentialRampToValueAtTime(o.to,t+dur);
  if(o.detune)os.detune.value=o.detune;
  let node=os;
  if(o.lp){const fl=a.createBiquadFilter();fl.type='lowpass';fl.frequency.setValueAtTime(o.lp,t);if(o.lpTo)fl.frequency.exponentialRampToValueAtTime(o.lpTo,t+dur);os.connect(fl);node=fl;}
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+(o.att||.01));g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  node.connect(g);g.connect(MASTER);os.start(t);os.stop(t+dur+.05);
}
function noise(t0,dur,vol,o){
  o=o||{};const a=ac();if(!a)return;
  if(!NOISE){const len=a.sampleRate;NOISE=a.createBuffer(1,len,a.sampleRate);const d=NOISE.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;}
  const t=a.currentTime+t0,s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();
  s.buffer=NOISE;f.type=o.type||'bandpass';f.frequency.setValueAtTime(o.f||1000,t);if(o.fTo)f.frequency.exponentialRampToValueAtTime(o.fTo,t+dur);f.Q.value=o.q||1;
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  s.connect(f);f.connect(g);g.connect(MASTER);s.start(t);s.stop(t+dur+.05);
}
// звуки 6.0: тихие и короткие, без «игровых» бипов. Навигация (тап, выбор, листание) — без звука, только вибрация.
// Звук есть только у результата: верно — мягкий «поп», неверно — глухой короткий тук, итог — две ноты.
// звуки «как в CS»: сухой клик интерфейса (шум + низкий тук), звонкий короткий пинг за верный ответ,
// двойной глухой «отказ» за ошибку, быстрая лесенка за победу. Всё короткое и негромкое.
const _clk=(t0,v)=>{noise(t0,.016,.05*(v||1),{type:'highpass',f:3200,q:.7});osc('sine',170,t0,.028,.022*(v||1),{to:90});};
const _ping=(f,t0,v)=>{osc('triangle',f,t0,.14,.03*(v||1),{lp:6000,att:.003});osc('sine',f*1.5,t0+.01,.18,.012*(v||1),{att:.003});};
const _deny=(t0)=>{osc('square',150,t0,.07,.018,{lp:650,att:.004});osc('square',150,t0+.09,.09,.018,{lp:650,att:.004});};
const SFX={
  tap:()=>_clk(0,.8),
  sel:()=>{_clk(0,.8);_clk(.045,.5);},
  whoosh:()=>noise(0,.11,.01,{type:'bandpass',f:900,fTo:2600,q:.6}),
  tick:()=>noise(0,.012,.035,{type:'highpass',f:4500,q:.7}),
  hint:()=>_clk(0,.6),match:()=>_ping(1568,0,.6),
  good:()=>{_clk(0,.7);_ping(1568,.012);},
  learn:()=>{_clk(0,.7);_ping(1568,.012);_ping(2093,.09,.8);},
  nope:()=>_deny(0),bad:()=>_deny(0),
  win:()=>{[1047,1319,1568].forEach((f,i)=>{_clk(i*.07,.5);_ping(f,i*.07,.7);});_ping(2093,.24,1);},
  lose:()=>osc('sawtooth',196,0,.26,.016,{lp:520,to:140}),
  announce:()=>_ping(1319,0,.7),firstblood:()=>{_ping(1047,0,.8);_ping(1568,.08,.8);},roshan:()=>_deny(0),
  // 12.5: киношные звуки — щелчок плёнки, открытие, награда; в словаре — тихий шорох страницы
  reel:()=>{for(let i=0;i<4;i++)noise(i*.05,.014,.035,{type:'highpass',f:2000,q:.8});osc('sine',110,0,.18,.012,{lp:400});},
  unlock:()=>{noise(0,.03,.04,{type:'bandpass',f:3000,q:2});osc('sine',1175,.03,.25,.018,{att:.004,lp:3000});osc('sine',1760,.09,.3,.012,{att:.004,lp:3000});},
  reward:()=>{noise(0,.35,.012,{type:'bandpass',f:800,fTo:4000,q:.5});[659,988,1319].forEach((f,i)=>osc('sine',f,.12+i*.09,.5,.016,{att:.006,lp:3200}));},
  page:()=>noise(0,.16,.018,{type:'bandpass',f:1800,fTo:900,q:.6}),
  // 13.9.21: звон билетов — вызывался (админ «+1000», билеты в счётчик), а звука не было
  coin:()=>{_ping(2093,0,.55);_ping(2637,.06,.45);}
};
const _soft2=(f,t0,dur,vol,type)=>osc(type||'sine',f,t0,dur,vol,{att:.008,lp:2600});
const _key=(t0,v)=>{noise(t0,.02,.07*(v||1),{type:'bandpass',f:2400,q:1.2});osc('square',95,t0,.025,.02*(v||1),{lp:900});};
const _bell=(t0)=>{osc('sine',2637,t0,.5,.03,{att:.002});osc('sine',3951,t0,.35,.012,{att:.002});};
const _proj=(t0,n)=>{for(let i=0;i<(n||3);i++)noise(t0+i*.045,.012,.04,{type:'highpass',f:1800,q:.8});};
const _bit=(f,t0,d,v)=>osc('square',f,t0,d||.06,.025*(v||1),{lp:4000,att:.001});
const SFXP={cs:{...SFX},
  soft:{tap:()=>{},sel:()=>{},whoosh:()=>{},tick:()=>{},hint:()=>{},match:()=>{},announce:()=>{},good:()=>{_soft2(880,0,.09,.022);_soft2(1320,.045,.12,.014);},learn:()=>{_soft2(784,0,.14,.02);_soft2(1175,.07,.2,.016);},
    nope:()=>_soft2(196,0,.08,.03,'triangle'),bad:()=>_soft2(170,0,.12,.035,'triangle'),win:()=>{_soft2(659,0,.22,.022);_soft2(988,.1,.32,.018);},lose:()=>_soft2(220,0,.24,.022,'triangle'),firstblood:()=>_soft2(659,0,.18,.018),roshan:()=>{}},
  typewriter:{tap:()=>_key(0,.8),sel:()=>{_key(0,.8);_key(.06,.6);},whoosh:()=>noise(0,.18,.02,{type:'bandpass',f:500,fTo:1500,q:.5}),tick:()=>_key(0,.5),hint:()=>_key(0,.6),match:()=>_bell(0),announce:()=>_bell(0),
    good:()=>{_key(0);_bell(.04);},learn:()=>{_key(0);_key(.07);_bell(.12);},nope:()=>{_key(0,1.2);_key(.05,1.2);},bad:()=>{_key(0,1.3);_key(.05,1.3);_key(.1,1.3);},win:()=>{[0,.06,.12,.18].forEach(x=>_key(x));_bell(.26);},lose:()=>osc('sawtooth',130,0,.3,.02,{lp:400}),firstblood:()=>_bell(0),roshan:()=>_key(0,1.4)},
  projector:{tap:()=>_proj(0,1),sel:()=>_proj(0,2),whoosh:()=>_proj(0,5),tick:()=>_proj(0,1),hint:()=>_proj(0,2),match:()=>_proj(0,3),announce:()=>{_proj(0,4);osc('sine',523,0,.4,.02,{lp:1800});},
    good:()=>{_proj(0,2);osc('sine',784,.03,.25,.025,{lp:2400});},learn:()=>{_proj(0,3);osc('sine',659,.03,.25,.02,{lp:2400});osc('sine',988,.12,.3,.02,{lp:2400});},nope:()=>osc('sine',150,0,.18,.03,{lp:500,to:110}),bad:()=>osc('sine',140,0,.25,.035,{lp:500,to:90}),
    win:()=>{_proj(0,6);[523,659,784,1047].forEach((f,i)=>osc('sine',f,.05+i*.09,.35,.02,{lp:2600}));},lose:()=>osc('sine',196,0,.5,.025,{lp:600,to:120}),firstblood:()=>_proj(0,4),roshan:()=>_proj(0,6)},
  arcade:{tap:()=>_bit(880,0,.03,.6),sel:()=>{_bit(880,0,.03,.6);_bit(1175,.035,.03,.6);},whoosh:()=>osc('square',300,0,.12,.02,{to:900,lp:3000}),tick:()=>_bit(1320,0,.02,.5),hint:()=>_bit(1047,0,.04,.6),match:()=>{_bit(1047,0);_bit(1568,.05);},announce:()=>{_bit(784,0);_bit(1047,.06);},
    good:()=>{_bit(1047,0);_bit(1568,.06,.09);},learn:()=>{[1047,1319,1568,2093].forEach((f,i)=>_bit(f,i*.05,.05));},nope:()=>{_bit(220,0,.08);_bit(196,.09,.1);},bad:()=>{_bit(196,0,.1);_bit(147,.11,.14);},
    win:()=>{[523,659,784,1047,1319].forEach((f,i)=>_bit(f,i*.07,.07));},lose:()=>{[392,330,262].forEach((f,i)=>_bit(f,i*.11,.12));},firstblood:()=>{_bit(784,0);_bit(1175,.07);},roshan:()=>_bit(110,0,.2)},
  off:{}};
function sfx(n,arg){if(!store.snd)return;try{SFX[n](arg);}catch(e){}}
/* ---- 13.9.21: звуки из файлов — «Кино» (по умолчанию) и «Как в iPhone». Файлы js/sfx-<набор>.js: mp3 в base64 (tools/sfx_make.py, CC0, snd/ЛИЦЕНЗИЯ.md).
   Грузится только выбранный набор, один раз, на первом касании (оно же разблокирует звук на iOS). Пока не готов — играет старый синтез «cs», тишины нет. ---- */
const SFX_EV=['tap','sel','whoosh','tick','hint','match','good','learn','nope','bad','win','lose','announce','firstblood','roshan','reel','unlock','reward','page','coin'];
const SFXF={kino:1,ios:1},SFXB={},SFXL={};
function sfxLoad(k){if(!SFXF[k])return Promise.resolve(null);if(SFXL[k])return SFXL[k];
  return SFXL[k]=new Promise(ok=>{
    const go=()=>{const D=window.SFXD&&window.SFXD[k],a=ac();if(!D||!a){delete SFXL[k];ok(null);return;}const B={};let n=0;
      const fin=()=>{if(++n<SFX_EV.length)return;SFXB[k]=B;ok(B);};
      SFX_EV.forEach(e=>{if(!D[e]){fin();return;}let ab;try{const s=atob(D[e]),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);ab=u.buffer;}catch(x){fin();return;}
        // mp3 начинается с тишины (задержка кодера ~25 мс) — играем с первого не-тихого сэмпла, иначе тап «опаздывает»
        const got=buf=>{const d=buf.getChannelData(0);let pk=0;for(let i=0;i<d.length;i++){const v=d[i]<0?-d[i]:d[i];if(v>pk)pk=v;}
          const th=Math.max(1e-4,pk*.002);let i=0;while(i<d.length&&Math.abs(d[i])<th)i++;B[e]={buf,off:Math.max(0,i/buf.sampleRate-.001)};fin();};
        try{const p=a.decodeAudioData(ab,got,()=>fin());if(p&&p.catch)p.catch(()=>{});}catch(x){fin();}});};
    if(window.SFXD&&window.SFXD[k]){go();return;}
    const s=document.createElement('script');s.src='js/sfx-'+k+'.js?v='+APP_V;s.onload=go;s.onerror=()=>{s.remove();delete SFXL[k];ok(null);};document.head.appendChild(s);});}
let SFXG=null;
const sfxBus=a=>{if(!SFXG||SFXG.context!==a){SFXG=a.createGain();SFXG.gain.value=.47;SFXG.connect(a.destination);}return SFXG;};
function sfxPlay(k,n){const B=SFXB[k],b=B&&B[n];if(!b)return false;const a=ac();if(!a)return false;
  try{const s=a.createBufferSource();s.buffer=b.buf;if(n==='tap'||n==='sel'||n==='tick')s.playbackRate.value=1+(Math.random()-.5)*.06;s.connect(sfxBus(a));s.start(0,b.off);return true;}catch(e){return false;}}
const sfxSet=k=>{const o={};SFX_EV.forEach(n=>{o[n]=x=>{if(sfxPlay(k,n))return;sfxLoad(k);const f=SFXP.cs[n];if(f)f(x);};});return o;};
SFXP.kino=sfxSet('kino');SFXP.ios=sfxSet('ios');
const sfxCur=()=>typeof shopUse==='function'?shopUse('snd'):'kino';
// набор целиком (для ▶ в магазине и админке): недостающее — из «cs»
const sfxPack=k=>Object.assign({},SFXP.cs,SFXP[k]||{});
document.addEventListener('pointerdown',function sfxWarm(){document.removeEventListener('pointerdown',sfxWarm,true);try{if(store.snd){ac();sfxLoad(sfxCur());}}catch(e){}},true);
/* ================= 7.0: лаборатория оформления (видит только админ) ================= */
// Варианты субтитров, звуков и интерфейса — переключаются в админ-панели, применяются только на этом устройстве.
// В админской лаборатории оставлены ровно 3 варианта каждого слоя.
// Много вариантов только мешает выбрать и раздувает CSS.
function labApply(){try{Object.assign(SFX,SFXP.cs,SFXP[sfxCur()]||{});}catch(e){}}   // звуки — набор из магазина (13.9.42: лаборатория удалена)


/* ================= утилиты ================= */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const app=$('#app');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const rnd=a=>a[Math.floor(Math.random()*a.length)];
function plural(n,f){const m10=n%10,m100=n%100;if(m10===1&&m100!==11)return f[0];if(m10>=2&&m10<=4&&(m100<12||m100>14))return f[1];return f[2];}
const fmt=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const toks=arr=>arr.map(p=>({t:p[0],g:!!p[1]}));
const accuracy=()=>store.answered?Math.round(store.correct/store.answered*100):null;
// 12.1: при любом переходе — убрать всё, что висит поверх экрана (карта словаря с видео, мини-плеер, поповеры слов),
// и остановить видео эпизода, если уходим со сцены. Раньше карта/видео могли остаться висеть над новым экраном.
function uiClean(cls){if(ONB_VS&&!/\bonbscr\b/.test(cls||''))tgVSwipes(false);   // 13.9.38: ушли с первого запуска — Telegram снова закрывается свайпом
try{if(!/\bscnscr\b/.test(cls||''))SC_DIR=false;}catch(e){}if(screen==='prem'&&!/\bpremscr\b/.test(cls||''))screen='home';   // 13.9.30: ушли с экрана премиума на экран, который сам screen не ставит (повторение) — «назад» не должен вести на премиум
  const scn=/\bscnscr\b/.test(cls||'');if(!scn)try{NAV_BACK=null;}catch(e){}
  try{if(document.getElementById('ddx'))ddxClose(true);}catch(e){}   // 13.9.65: дуэль во весь рост не висит над новым экраном
  try{if(document.getElementById('dvx'))dvClose();}catch(e){}   // 13.9.67: и бой Versus
  document.querySelectorAll('.pk,.dx-turn,.dx-shade,.cd2,.gatewrap,.sc-sheetwrap.poll,.sc-sheetwrap.unl,.pwa').forEach(o=>o.remove());   // 13.2: пак карт и лист словаря не висят над новым экраном; 13.6.3: и отсчёт 3-2-1
  document.querySelectorAll('.srv').forEach(o=>o.remove());   // 13.6: открытие покупки
  try{if(window.DL)DL.clean();}catch(e){}   // 13.7: варианты словаря — карта в руке, демо-пак
  document.querySelectorAll('.dxo,.rwo,.bgvw,.pfv').forEach(o=>{o._c=true;o.querySelectorAll('video').forEach(v=>{try{v.pause();v.removeAttribute('src');v.load();}catch(e){}});o.remove();});
  document.querySelectorAll('.pc-bg video,.kvp-bg video').forEach(v=>{try{v.pause();v.removeAttribute('src');v.load();}catch(e){}});   // 13.9.6: живой фон профиля / дуэли
  document.body.classList.remove('dx-open');try{if(KWP)KWP._resume=null;kwHide(0);}catch(e){}try{musDuck(false);}catch(e){}
  try{if(SCLIP&&!SCLIP.paused)SCLIP.pause();}catch(e){}
  if(!scn)try{if(SV)scStop();}catch(e){}}
function mount(html,cls){const tab=/\btabscr\b/.test(cls||'');uiClean(cls);try{if(!/\bscnscr\b/.test(cls||'')&&MUS)musStop();}catch(e){}document.body.classList.toggle('tabs-on',tab);try{document.body.classList.toggle('newb',newbie());}catch(e){}if(!tab)paintTabbar(null);try{lookApply(cls);}catch(e){}app.innerHTML=`<div class="screen ${cls||''}">${html}</div>`;window.scrollTo(0,0);try{ndDeEmoji(app);}catch(e){}try{if(!/\bscnscr\b/.test(cls||'')){delete document.body.dataset.scn;ambPause(true);}}catch(e){}document.querySelectorAll('.sctour,.ln-pop,.ln-tip').forEach(x=>x.remove());try{appBgApply();}catch(e){}
  try{let i=0;app.querySelectorAll('.anim').forEach(e=>e.style.setProperty('--ai',Math.min(i++,7)));}catch(e){}try{shopPvStop();setTimeout(hmSync,0);}catch(e){}tgHead();try{phScreen();}catch(e){}try{ndScreenIn(cls);}catch(e){}}
// 13.9.43: игр нет — мир всегда нейтральный (класс t-clean держит общий стиль 11.6)
function setWorld(){document.body.classList.toggle('no-tts',!store.tts);const b=document.body.classList;['hud','light','cs'].forEach(t=>b.remove('t-'+t));b.add('t-clean');document.body.dataset.world='neutral';tgHead();}
function applyFx(){
  document.body.classList.toggle('nofx',!store.fx);applySubPrefs();
  if(!document.body.dataset.world)setWorld('neutral');
  tgHead();
}
// 13.6: размер субтитров (S–XL) и «перевод того же размера» — на body, действует в любом плеере и в полном экране
const SUB_SZ=[['s','S'],['m','M'],['l','L'],['xl','XL']];
function applySubPrefs(){const b=document.body;if(!b)return;b.dataset.subsz=store.subSz||'m';b.dataset.subsame=store.subSame===false?'0':'1';}
function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),1900);}
const langBadge=L=>`<span class="lb${L==='de'?' de':''}">${L==='de'?'DE':'EN'}</span>`;
/* ================= эффекты ================= */
function center(el){const r=el.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2];}
function announce(text,cls){const d=document.createElement('div');d.className='announce'+(cls?' '+cls:'');d.textContent=text;document.body.appendChild(d);setTimeout(()=>d.remove(),1450);}
/* ================= иконки ================= */
function iconHTML(ic,size,o){
  o=o||{};
  const cls='slot'+(size?' '+size:'');
  const ov=(o.cd>0?`<i class="cd" style="--cd:${o.cd}%"></i>`:'')+(o.hk?`<i class="hk">${o.hk}</i>`:'')+(o.chg!==undefined&&o.chg!==''&&o.chg!==0?`<i class="chg">${o.chg}</i>`:'');
  if(ic&&ic.img)return `<div class="${cls} hasimg"><img src="${CDN}${ic.img}.png" alt="" loading="lazy" onerror="this.parentNode.classList.add('noimg')">${svg(ic.svg)}${ov}</div>`;
  return `<div class="${cls}">${svg(ic&&ic.svg)}${ov}</div>`;
}
/* ================= прогресс слов ================= */

/* ================= лор (хай тир) ================= */
const LET="A-Za-zÄÖÜäöüß'";
const reEsc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
// 13.6.3: слово целиком — и с ü/ß на краю (\b без флага u их не видит), и не внутри «you're». Текст режем ДО esc():
// раньше искали в уже экранированном («couldn't» → «couldn&#39;t» не находилось — в «впиши слово» ответ был виден)
const wordRe=(w,fl)=>new RegExp(`(^|[^${LET}’0-9])(${[].concat(w).filter(Boolean).map(x=>reEsc(String(x))).join('|')})(?=[^${LET}’0-9]|$)`,fl==null?'i':fl);
function markWord(text,w,open,close){text=String(text==null?'':text);const ws=[].concat(w).filter(Boolean);const m=ws.length?wordRe(ws).exec(text):null;if(!m)return esc(text);
  const i=m.index+m[1].length;return esc(text.slice(0,i))+(close==null?open:open+esc(m[2])+close)+esc(text.slice(i+m[2].length));}

/* ================= вопросы ================= */


/* ================= дуэль ================= */
// ссылки-приглашения открывают мини-апп сразу на весь экран (Telegram 8.0+: mode=fullscreen)
const fsLink=u=>/t\.me\//.test(u)&&!/mode=/.test(u)?u+(u.includes('?')?'&':'?')+'mode=fullscreen':u;
function shareLink(link,text){link=fsLink(link);
  const url=`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`;
  try{if(TG&&TG.openTelegramLink){TG.openTelegramLink(url);return;}}catch(e){}
  try{if(navigator.share){navigator.share({text:text+' '+link});return;}}catch(e){}
  try{navigator.clipboard.writeText(text+' '+link).then(()=>toast('Ссылка скопирована'),()=>toast(link));}catch(e){toast(link);}
}
/* ================= обучение 4.0: сноски, новые задания, повторение ================= */

/* ---- повторение выученного (интервалы 3, 7, 21, 60 дней) ---- */
const RKEY='dota_r_v1',R_DAYS=[3,7,21,60];
let RV={};try{RV=JSON.parse(localStorage.getItem(RKEY))||{};}catch(e){RV={};}
function saveRV(){const s=JSON.stringify(RV);try{localStorage.setItem(RKEY,s);}catch(e){}if(CLOUD_OK)cloudQueue(RKEY,s);}
function cloudSaveChunked(key,s){
  if(!TG||!TG.CloudStorage)return;
  try{const parts=[];for(let i=0;i<s.length;i+=3800)parts.push(s.slice(i,i+3800));
    parts.forEach((p,i)=>TG.CloudStorage.setItem(key+'_'+i,p,()=>{}));TG.CloudStorage.setItem(key+'_n',String(parts.length),()=>{});}catch(e){}
}

/* ---- цель дня и статистика ---- */
// 13.6.3: день — по местному времени (было UTC: в Москве «сегодня» начиналось в 3:00)
const dayKey=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const todayKey=()=>dayKey(new Date());
// серия дней: считается от любого ответа (раньше — только в конце игры в Доте); на экране — 0, если вчера не занимался
function dayTouch(){const t=new Date().toDateString(),y=new Date(Date.now()-864e5).toDateString();if(store.lastDay!==t){store.streak=store.lastDay===y?(store.streak||0)+1:1;store.lastDay=t;}}
const streakNow=()=>{const t=new Date().toDateString(),y=new Date(Date.now()-864e5).toDateString();return store.lastDay===t||store.lastDay===y?(store.streak||0):0;};
function dayStat(){if(!store.day||store.day.d!==todayKey())store.day={d:todayKey(),n:0,done:false};return store.day;}
// ответы по дням за последние две недели — для блока «Неделя» в профиле
function weekAdd(){const k=todayKey();store.week=store.week||{};store.week[k]=(store.week[k]||0)+1;const ks=Object.keys(store.week).sort();while(ks.length>14)delete store.week[ks.shift()];}
function weekHTML(){const W=store.week||{},days=[...Array(7)].map((_,i)=>{const d=new Date(Date.now()-(6-i)*864e5);const k=dayKey(d);return {d,n:W[k]||0};});
  const mx=Math.max(1,...days.map(x=>x.n)),sum=days.reduce((a,x)=>a+x.n,0),mine=typeof scMine==='function'?scMine():[],ok=mine.filter(x=>x.st>=3).length;
  const wd=['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
  return `<section class="wk card anim"><div class="wk-h"><b>Неделя</b><span>${sum} ${plural(sum,['ответ','ответа','ответов'])}</span></div>
    <div class="wk-bars">${days.map((x,i)=>`<div class="wk-c${i===6?' today':''}"><i style="height:${Math.round(x.n/mx*100)}%"></i><span>${wd[x.d.getDay()]}</span></div>`).join('')}</div>
    <div class="wk-f"><div><b>${mine.length}</b><span>фраз из кино</span></div><div><b>${ok}</b><span>держатся надолго</span></div><div><b>${streakNow()}</b><span>${plural(streakNow(),['день','дня','дней'])} подряд</span></div></div></section>`;}
// 13.6.3: цель дня, +200 и серия — от ответов везде: сцены, повторение, Дота (раньше только Дота — на Главной «0/20» не двигалось)
function countAnswer(){
  weekAdd();dayTouch();const d=dayStat();d.n++;
  const goal=store.goal||20;
  if(!d.done&&d.n>=goal){d.done=true;store.goalsDone=(store.goalsDone||0)+1;store.gold+=200;setTimeout(()=>{announce('Цель дня','learn');sfx('learn');toast('Цель дня выполнена: +200 билетов');},900);}
}

/* ================= сессия ================= */



/* ================= озвучка ================= */

/* ================= итоги ================= */

/* ================= слово дня ================= */
/* ================= словарь ================= */
/* ================= выбор языка и ролей ================= */
function langChoiceHTML(sel){
  // 13.6.3: «Оба сразу» убран — normalize всё равно оставлял один язык, выбор терялся после перезапуска
  const opts=[['en',['en'],'Английский','Фильмы, сериалы и игры в оригинале'],['de',['de'],'Немецкий','Живой немецкий с артиклями и примерами']];
  return `<div class="stack">${opts.map(([id,ls,n,d])=>`<button class="choice frame" data-lang="${id}" aria-pressed="${sel===id}"><span class="badges">${ls.map(langBadge).join('')}</span><span class="ct"><span class="cn">${n}</span><span class="cd">${d}</span></span>${BOX}</button>`).join('')}</div>`;
}
const langsToChoice=l=>l[0]||'en';
const choiceToLangs=c=>c==='both'?['en','de']:[c];
function bindLangChoice(set){
  $$('.choice[data-lang]').forEach(b=>b.onclick=()=>{set(b.dataset.lang);sfx('sel');haptic('sel');$$('.choice[data-lang]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));});
}
/* ================= онбординг ================= */
function startOnboarding(){renderStart();}   // 13.6: вместо старого (путь / игры / роли) — приветственное обучение
/* ================= настройки ================= */
function renderSettings(){
  screen='settings';backBtn(true);applyFx();if(store.subSame===undefined)store.subSame=true;if(store.autoSc===undefined)store.autoSc=true;if(store.daily===undefined)store.daily=true;if(store.vtask===undefined)store.vtask=true;
  const row=(k,n,d)=>`<button class="checkrow frame" data-t="${k}" aria-pressed="${!!store[k]}">${BOX}<span class="ct"><span class="cn">${n}</span>${d?`<span class="cd">${d}</span>`:''}</span></button>`;
  mount(`
    <div class="page-head"><button class="icon-btn" id="bBtn" aria-label="Назад">${ui('back')}</button><h1 class="title">Настройки</h1></div>
    <section class="set-sec"><h2>Оформление</h2>${segCtl('znew',[['1','✨ Новый'],['0','Старый']],store.znew===0?'0':'1')}<p class="hint-line" style="margin-top:6px;opacity:.7">«Новый» — «Кино 2.0»: тёплый янтарь, свет как в Telegram (крем днём, бархат ночью), живые анимации. «Старый» — вид до редизайна. Видно только тебе, на этом устройстве.</p>${FLAG_ADMIN?'<button class="btn ghost" id="onbAgain" style="margin-top:10px;width:100%">Пройти первый запуск заново</button>':''}</section>

    <section class="set-sec"><h2>Обучение</h2>
      <div class="stack">${row('tts','Озвучка слов','Голос устройства читает слова и фразы. На некоторых телефонах звучит как робот, поэтому по умолчанию выключено.')}
      ${row('autoSc','Само дальше','После верного ответа и на паузах в фильме — переход сам, кнопка заполняется. Тронул карточку или слово — ждёт тебя.')}
      ${row('wpopFull','Окошко слова — сразу всё','Нажал на слово — сразу объяснение, примеры и вся реплика. Выключено — коротко: что слово значит тут, остальное под «Подробнее».')}
      ${row('typeIn','Писать самому','В заданиях печатать слово или фразу с клавиатуры. Выключено — только кнопки и кубики.')}
      ${row('age18','Показывать сцены 18+','Откровенные интервью: секс, порно, таблетки. Включая, подтверждаешь, что тебе есть 18.')}</div>
      <p class="hint-line" style="margin-top:12px">Как смотреть сцены</p>
      ${segCtl('scPause',[['on','⏸ С паузами'],['off','▶ Без пауз']],scPauseOn()?'on':'off')}
      <p class="hint-line" style="margin-top:12px">Размер субтитров</p>
      ${segCtl('subSz',SUB_SZ,store.subSz||'m')}
      <div class="sub-prev" aria-hidden="true"><div class="sc-v" data-ss="glass"><div class="sc-subs"><div class="sline"><span class="en">I'll make him an offer he can't refuse.</span></div><div class="sline s2"><span class="tr">Я сделаю ему предложение, от которого он не сможет отказаться.</span></div></div></div></div>
      <div class="stack" style="margin-top:8px">${row('subSame','Перевод того же размера','Выключи — перевод будет чуть мельче оригинала.')}</div>
      <p class="hint-line" style="margin-top:12px">Окно фразы в словаре</p>${segCtl('knWin',[['sheet','Полэкрана'],['full','На весь экран']],store.knWin==='full'?'full':'sheet')}<p class="hint-line" style="margin-top:6px;opacity:.7">Полэкрана — словарь виден сверху, «▶ Смотреть» открывает окошко с моментом над шторкой.</p>
      <p class="hint-line" style="margin-top:12px">Уровень английского в кино</p>
      ${segCtl('lvl',[['a','Новичок'],['b','Знаю базу']],store.lvl||'a')}
      <button class="ht-alt" id="lvlTest" style="margin-top:8px">Пройти тест уровня ещё раз</button>
      <button class="ht-alt" id="introAgain" style="margin-top:8px">🎬 Как тут всё устроено — обучение</button>
      <p class="hint-line" style="margin-top:12px">Цель дня: сколько ответов в день</p>
      ${segCtl('goal',[['10','10'],['20','20'],['30','30']],String(store.goal||20))}
    </section>
    <section class="set-sec"><h2>Язык</h2>${langChoiceHTML(langsToChoice(store.langs))}</section>
    <section class="set-sec"><h2>Приложение</h2>
      <div class="stack">${row('snd','Звук','')}${row('fx','Анимации и эффекты','')}${canFull()?row('full','Полный экран',''):''}${row('remind','Напоминания о повторении','Бот напишет днём, когда фразы из сцен пора повторить. Не чаще раза в день.')}${row('daily','Фраза дня от бота','Раз в день — короткий момент из фильма с фразой и переводом прямо в чате. Работает, когда включены напоминания.')}${row('gav','Маскот в проверке','Радуется верным ответам, «рубит» выученные фразы, ставит «Снято!» после эпизода.')}</div>
    </section>
    <section class="set-sec"><button class="btn dark" id="reset" style="color:#F4907A">Сбросить прогресс</button></section>`,'settings');
  $('#bBtn').onclick=()=>{sfx('tap');renderHome();};
  bindSeg('goal',v=>{store.goal=+v;save();sfx('sel');});
  bindSeg('scPause',v=>{store.scPause=v;save();sfx('sel');});
  bindSeg('subSz',v=>{store.subSz=v;save();applySubPrefs();});
  bindSeg('znew',v=>{store.znew=+v;save();applyZNew();sfx('sel');haptic('sel');toast(v==='1'?'Новый вид ✨':'Старый вид');});   // 13.9.59: «Кино 2.0» / старый — сразу, без перезагрузки
  if($('#onbAgain'))$('#onbAgain').onclick=()=>{sfx('tap');ONB=null;renderOnb(0);};   // 13.9.28: посмотреть новый первый запуск
  bindSeg('knWin',v=>{store.knWin=v;save();});   // 13.9.11: окно фразы нового словаря — полэкрана (по умолчанию с 13.9.15) / на весь экран
  bindLangChoice(v=>{store.langs=choiceToLangs(v);save();});
  $$('.checkrow').forEach(b=>b.onclick=()=>{
    const k=b.dataset.t;store[k]=!store[k];save();b.setAttribute('aria-pressed',String(store[k]));sfx('sel');haptic('sel');
    if(k==='fx'||k==='subSame')applyFx();if(k==='full')applyFullscreen();if(k==='remind'||k==='daily')remindSync(true);
  });
  bindSeg('lvl',v=>{store.lvl=v;save();toast(v==='a'?'Режим новичка: задания с подсказками':'Обычная сложность');});
  if($('#lvlTest'))$('#lvlTest').onclick=()=>{sfx('tap');renderLevelTest(()=>renderSettings());};
  if($('#introAgain'))$('#introAgain').onclick=()=>{sfx('tap');INTRO=null;renderIntro(0);};
  $('#reset').onclick=()=>{
    // 13.6.3: раньше сбрасывались только store и M — сцены, звёзды, словарь и повторение оставались, а награды за сцены возвращались при запуске
    const doReset=()=>{const keep={};['snd','fx','full','fullV','kvUid','subSz','subSame'].forEach(k=>{if(store[k]!==undefined)keep[k]=store[k];});
      SC={};scSave();M={};saveM();RV={};saveRV();store=normalize(Object.assign(fresh(),keep));store.resetAt=Date.now();save();startOnboarding();};
    const txt='Сбросить весь прогресс: сцены, звёзды, словарь, награды, билеты и покупки? Начнёшь с нуля.';
    if(TG&&TG.showConfirm){try{TG.showConfirm(txt,ok=>{if(ok)doReset();});return;}catch(e){}}
    if(window.confirm(txt))doReset();
  };
}

/* ================= вкладки, заставка, профиль ================= */
const TABS=window.ZAI_ON?[
 {id:'learn',name:'Сегодня',ico:'<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M8 3v4M16 3v4M4 10h16"/>'},   // 13.9.61: «Сегодня» вернулась главной — словарь с нуля выглядел пустым
 {id:'kino',name:'Сцены',ico:'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M7 3l3 3M14 3l-3 3"/><path d="M10 10.5v5l4-2.5z"/>'},   // 13.9.66: Андрей — «Сцены» снова перед «Словарём» (Z.ai переставил в 13.9.61)
 {id:'dict',name:'Словарь',ico:'<path d="M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h9"/><path d="M9 8h5"/>'},
 {id:'profile',name:'Профиль',ico:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'}
]:[
 {id:'learn',name:'Главная',ico:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>'},
 {id:'kino',name:'Кинозал',ico:'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M7 3l3 3M14 3l-3 3"/><path d="M10 10.5v5l4-2.5z"/>'},
 {id:'dict',name:'Словарь',ico:'<path d="M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h9"/><path d="M9 8h5"/>'},
 {id:'profile',name:'Профиль',ico:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'}
];
let lastTabIdx=0;
function ensureTabbar(){
  if($('#tabbar'))return;
  const nav=document.createElement('nav');nav.id='tabbar';nav.className='tabbar';NDT=null;
  // 13.9.62: вкладки «Игры» больше нет — игры живут в «Кино» как раздел (как «Интервью»)
  nav.innerHTML=`<i class="tabind" id="tabind"></i>`+TABS.map(t=>`<button data-nav="${t.id}" aria-label="${t.name}"><svg viewBox="0 0 24 24">${t.ico}</svg><span>${t.name}</span></button>`).join('');
  document.body.appendChild(nav);
  nav.querySelectorAll('button').forEach(b=>b.onclick=()=>{
    if(store.tab===b.dataset.nav&&screen==='home'){window.scrollTo({top:0,behavior:'smooth'});return;}
    haptic('sel');sfx('tap');renderTab(b.dataset.nav);
  });
}
function paintTabbar(id){
  const nav=$('#tabbar');if(!nav)return;
  const i=TABS.findIndex(t=>t.id===id);
  nav.querySelectorAll('button').forEach((b,k)=>b.classList.toggle('on',k===i));
  const vis=[...nav.querySelectorAll('button')].filter(b=>getComputedStyle(b).display!=='none'),vi=vis.findIndex(b=>b.dataset.nav===id);   // 13.9.19: у новичка «Игр» нет — 4 вкладки
  const ind=$('#tabind');if(ind&&vi>=0)ind.style.transform=`translateX(${vi*100}%)`;
}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.querySelector('.sc-pfs')){e.preventDefault();e.stopPropagation();scExitFull();}},true);
function noCloseAsk(){try{if(TG&&TG.disableClosingConfirmation)TG.disableClosingConfirmation();}catch(e){}}
function renderTab(id){
  // 12.5: рубильник «тех. работы» — игрокам заглушка, админу всё как обычно
  if(flagOf('all')!=='on'){screen='home';ensureTabbar();mount(`<div class="mnt"><i>🎬</i><b>Кинотеатр временно обновляется</b><span>Меняем плёнку и чиним проектор. Загляни чуть позже — прогресс никуда не денется.</span></div>`,'tabscr');return;}
  id=id||store.tab||(window.ZAI_ON?'learn':'learn');
  if(id==='games')id='kino';   // 13.9.62: вкладки «Игры» нет — игры в «Кино» разделом (страховка от старого store.tab)
  if(!['learn','kino','dict','games','profile'].includes(id))id='learn';   // 13.9.61: фолбэк — «Сегодня»
  try{if(id==='kino'&&flagOf('kino')==='hide')id='learn';}catch(e){}
  const vis=id,sub=false;
  const idx=TABS.findIndex(t=>t.id===vis),dir=idx>lastTabIdx?'fr':idx<lastTabIdx?'fl':'';lastTabIdx=idx;
  if(store.tab!==vis){store.tab=vis;save();}
  noCloseAsk();musStop();MUSOFF=null;REVCHAIN=false;if(typeof SCUR!=='undefined')SCUR.id=null;scStop();
  try{if(TG&&TG.disableClosingConfirmation)TG.disableClosingConfirmation();}catch(e){}
  screen=sub?'subtab':'home';backBtn(sub);applyFx();ensureTabbar();delete document.body.dataset.world;
  const gated=vis==='kino'&&flagOf(vis)!=='on';
  let html=gated?`<h1 class="title anim">${TABS.find(t=>t.id===vis).name}</h1>`+gateHTML(vis):id==='learn'?learnTabHTML():id==='kino'?kinoTabHTML():id==='dict'?dictTabHTML():id==='games'?gamesTabHTML():profileTabHTML();
  mount(html,'tabscr '+dir);
  paintTabbar(vis);
  if(!gated)(id==='learn'?bindLearn:id==='kino'?bindKino:id==='dict'?bindDict:id==='games'?bindGames:bindProfile)();
  applyFlagsUI();
  $$('.tabscr .anim').forEach((el,i)=>el.style.animationDelay=Math.min(i,10)*55+'ms');
  if(id==='learn'||id==='profile')setTimeout(checkAch,400);
}
function renderHome(){renderTab(store.tab||'learn');}
function tgPhoto(){try{const u=TG&&TG.initDataUnsafe&&TG.initDataUnsafe.user;return u&&u.photo_url||'';}catch(e){return '';}}
function headHTML(){   // 13.9.22: плашки звания («Новичок ?») в шапке больше нет — звание в Профиле
  const name=userName()||'Игрок',photo=tgPhoto();
  return `<header class="thead anim"><div class="tava${photo?'':' mono'}"${photo?` style="background-image:url('${esc(photo)}')"`:''}>${photo?'':esc((name||'И').trim().charAt(0).toUpperCase())}</div>
    <div class="twho"><b>${esc(name)}</b></div>
    ${streakNow()?`<span class="streak" title="Дней подряд">🔥 ${streakNow()}</span>`:''}<span class="gold">${ui('coin')}${fmt(store.gold)}</span><button class="icon-btn" id="srchBtn" aria-label="Поиск" onclick="renderSearch()">${ui('search')}</button><button class="icon-btn" id="setBtn" aria-label="Настройки">${ui('gear')}</button></header>`;
}
function bindHead(){
  if($('#setBtn'))$('#setBtn').onclick=()=>{sfx('tap');renderSettings();};
  $$('.thead .gold').forEach(g=>{g.setAttribute('role','button');g.onclick=()=>{sfx('tap');haptic('sel');renderShop();};});
}

/* ---- Профиль и достижения ---- */
const ACH=[   // 13.9.43: игр больше нет — достижения за сцены
 {id:'first',n:'Первый дубль',d:'Пройди первый эпизод',ic:null,t:s=>s.eps>=1},
 {id:'goal',n:'Цель дня',d:'Выполни цель дня',ic:null,t:s=>s.goalsDone>=1},
 {id:'w10',n:'Первая десятка',d:'Собери 10 фраз',ic:null,t:s=>s.ph>=10},
 {id:'w50',n:'Полсотни',d:'Собери 50 фраз',ic:null,t:s=>s.ph>=50},
 {id:'w120',n:'Словарный запас',d:'Собери 120 фраз',ic:null,t:s=>s.ph>=120},
 {id:'scene',n:'Сцена целиком',d:'Пройди все эпизоды сцены',ic:null,t:s=>s.scenes>=1},
 {id:'w230',n:'Режиссёрская версия',d:'Пройди 5 сцен целиком',ic:null,t:s=>s.scenes>=5},
 {id:'streak3',n:'Три дня',d:'Занимайся 3 дня подряд',ic:null,t:s=>s.streak>=3},
 {id:'streak7',n:'Неделя',d:'Занимайся 7 дней подряд',ic:null,t:s=>s.streak>=7},
 {id:'duel',n:'Дуэлянт',d:'Победи друга в дуэли по сцене',ic:null,t:s=>s.duelWins>=1},
 {id:'review',n:'Не забыл',d:'Пройди повторение',ic:null,t:s=>s.reviews>=1}
];
function achStats(){
  const eps=SCENES.reduce((a,x)=>a+(scP(x.id).done||[]).length,0);
  return {eps,goalsDone:store.goalsDone||0,ph:dictCount()[0],scenes:Object.keys(store.seg||{}).length,streak:streakNow(),duelWins:store.kvWins||0,reviews:store.reviews||0};
}
function checkAch(){
  const s=achStats(),got=[];
  ACH.forEach(a=>{if(!store.ach[a.id]&&a.t(s)){store.ach[a.id]=Date.now();got.push(a);}});
  if(!got.length)return;
  save();
  const a=got[0];
  const d=document.createElement('div');d.className='achpop';
  d.innerHTML=`${iconHTML({img:a.ic,svg:'trophy'})}<span><small>Достижение</small><b>${esc(a.n)}</b><em>${esc(a.d)}</em></span>`;
  document.body.appendChild(d);sfx('learn');haptic('ok');setTimeout(()=>d.remove(),3400);
}
// 13.9.24 «Новый»: Профиль — карточка на своём фоне (нет фона — кадр последней сцены), 4 цифры набегают, дальше строки:
// Коллекция · Мои слова · Билеты · Достижения · Настройки · Как пользоваться · Админ-панель
function ndProfileHTML(){const name=userName()||'Игрок',photo=tgPhoto(),pb=profBg(),st=streakNow(),got=ACH.filter(a=>store.ach[a.id]).length;
  const eps=SCENES.reduce((a,x)=>a+(scP(x.id).done||[]).length,0),ph=dictCount()[0],mw=mywAll().length,bgs=(()=>{try{return collStat().bg;}catch(e){return 0;}})();
  const L=(store.scLast&&scOf(store.scLast.id))||continueScene().s,fi=L&&filmImg(L,innerWidth>=1000?'bd.jpg':'bdm.jpg'),fb=L?(fi?`url('${fi}'),`:'')+`url('${assetUrl(scKey(L,'cover.jpg'))}')`:'';
  const row=(id,ic,b,sm,x)=>`<button class="ndl-r" id="${id}"${x||''}><i>${ic}</i><span><b>${b}</b>${sm?`<small>${sm}</small>`:''}</span><em>${ui('fwd')}</em></button>`;
  const cnt=(n,l)=>`<div><b class="ndcnt" data-n="${n}">${n}</b><span>${l}</span></div>`;
  return `<section class="ndpc anim${pb?' pbg'+(pb.film?' film':''):''}" id="ndPc">${pb?`<div class="pc-bg" data-bgl="${esc(pb.k)}" data-lead="2.5" aria-hidden="true"></div>`:`<div class="ndpc-bg" style="${fb?`background-image:${fb}`:''}"></div>`}<i class="ndpc-sh"></i>
      <div class="ndpc-a${photo?'':' mono'}"${photo?` style="background-image:url('${esc(photo)}')"`:''}>${photo?'':esc((name||'И').trim().charAt(0).toUpperCase())}</div>
      <h2 class="ndpc-n">${esc(name)}</h2>
      <p class="ndpc-s">${st?`🔥 ${st} ${plural(st,['день','дня','дней'])} подряд`:'Серия начнётся с первого ответа'}${pb?` · фон «${esc(pb.name)}»`:''}</p>
      <button class="ndpc-bgb" id="pcChg">${pb?'Сменить фон':bgAnyGot()?'Поставить фон':'Фон — за пройденную сцену'}</button></section>
    <div class="ndst anim">${cnt(eps,plural(eps,['эпизод','эпизода','эпизодов']))}${cnt(ph,plural(ph,['фраза','фразы','фраз']))}${cnt(mw,plural(mw,['слово','слова','слов']))}${cnt(bgs,plural(bgs,['фон','фона','фонов']))}</div>
    ${lvRowHTML()}
    ${(()=>{const g=(typeof ONB_GOALS!=='undefined'?ONB_GOALS:[]).find(x=>x[0]===store.goalWhy);return g?`<div class="n-why anim">${niSVG('target')}<span><b>Помнишь, ради чего начал?</b><small>${esc(g[2])}. Каждая сцена — ещё шаг туда.</small></span></div>`:'';})()}
    <div class="ndl anim">
      ${premMode()!=='off'||FLAG_ADMIN?row('pfPrem','✦','Премиум',premHas()?`до ${premDate(premC().until)}`:premC().trialUsed?'повторение, подсказки, слова без лимита':'7 дней бесплатно'):''}
      ${row('pfColl','🏆','Коллекция','фоны, карточки, кадры')}
      ${mw?row('pfWords','⭐','Мои слова',`${mw} ${plural(mw,['слово','слова','слов'])}`):''}
      ${row('pfShop','🎟','Билеты',`${fmt(store.gold)} · магазин`)}
    </div>
    <details class="ndl ndach anim"><summary class="ndl-r"><i>🎖</i><span><b>Достижения</b><small>${got} из ${ACH.length}</small></span><em>${ui('fwd')}</em></summary>
      <div class="achs">${ACH.map(a=>`<button class="ach${store.ach[a.id]?' got':''}" data-a="${a.id}">${iconHTML({img:a.ic,svg:'trophy'})}<span>${esc(a.n)}</span></button>`).join('')}</div></details>
    <div class="ndl anim">
      ${row('setBtn','⚙️','Настройки','язык, субтитры, звук, дизайн')}
      ${row('helpBtn','❓','Как пользоваться','все функции коротко')}
      ${FLAG_ADMIN?row('admBtn','🛡','Админ-панель','игроки, доступ, проверка'):''}
      ${row('pfZnew',store.znew===0?'↺':'✨',store.znew===0?'Оформление: старое':'Оформление: новое ✨','тап — переключить «Новый/Старый»')}
    </div>
    <p class="foot">Версия ${APP_V}</p>`;}
function ndBindProfile(){bindProfileAdmin();bindHead();bgFill($('.ndpc'));
  {const b=$('#pfLv');if(b)b.onclick=()=>{sfx('tap');haptic('sel');b.setAttribute('aria-expanded',String(b.classList.toggle('open')));};}   // 13.9.72: как считается уровень — раскрывается по тапу
  $('#pcChg').onclick=e=>{e.stopPropagation();sfx('tap');haptic('sel');renderCollection('bg');};
  $('#ndPc').onclick=e=>{if(e.target.closest('button'))return;sfx('tap');pfView(meCard(),true);};
  $('#pfColl').onclick=()=>{sfx('tap');renderCollection();};
  if($('#pfWords'))$('#pfWords').onclick=()=>{sfx('tap');renderMyWords();};
  $('#pfShop').onclick=()=>{sfx('tap');renderShop();};
  $('#helpBtn').onclick=()=>{sfx('tap');renderHelp();};
  if($('#pfPrem'))$('#pfPrem').onclick=()=>{sfx('tap');haptic('sel');renderPaywall(null,()=>renderTab('profile'));};
  if($('#pfZnew'))$('#pfZnew').onclick=()=>{sfx('tap');haptic('sel');store.znew=store.znew===0?1:0;save();applyZNew();renderTab('profile');toast(store.znew?'Новый вид ✨':'Старый вид');};   // 13.9.59: переключение оформления в один тап
  $$('.ach').forEach(b=>b.onclick=()=>{const a=ACH.find(x=>x.id===b.dataset.a);sfx('sel');toast(`${a.n}: ${a.d}${store.ach[a.id]?'. Получено':''}`);});
  ndCount($$('.ndcnt'));}
// цифры набегают от 0 за 0.9 с, один раз (без анимаций — сразу итог)
function ndCount(els){if(!fxOK())return;els.forEach((el,i)=>{const n=+el.dataset.n||0;if(!n)return;const t0=performance.now()+120+i*90,D=900;el.textContent='0';
  const step=t=>{if(!el.isConnected)return;const k=Math.max(0,Math.min(1,(t-t0)/D)),e=1-Math.pow(1-k,3);el.textContent=Math.round(n*e);if(k<1)requestAnimationFrame(step);};requestAnimationFrame(step);});}
function profileTabHTML(){
  if(ndOn())return ndProfileHTML();
  const name=userName()||'Игрок',photo=tgPhoto(),acc=accuracy(),s=achStats(),ph=dictCount()[0],mw=mywAll().length;
  const got=ACH.filter(a=>store.ach[a.id]).length,due=dailyItems().length;
  const cell=(v,l)=>`<div><b>${v}</b><span>${l}</span></div>`;
  const adm=FLAG_ADMIN?`<button class="rowcard card anim" id="admBtn">${iconHTML({svg:'shield'})}<span><b>Админ-панель</b><small>Какие разделы видят игроки, тех. работы и тестеры</small></span><span class="go">›</span></button>`:'';
  const pb=profBg();   // 13.9.6: профиль — карточка игрока на своём фоне
  return `<section class="phead card anim${pb?' pbg'+(pb.film?' film':''):''}">${pb?`<div class="pc-bg" data-bgl="${esc(pb.k)}" data-lead="2.5" aria-hidden="true"></div><i class="pc-sh" aria-hidden="true"></i><div class="pc-top">${bgTagHTML(pb)}<button class="pc-chg" id="pcChg">Сменить фон</button></div>`:''}<div class="pava${photo?'':' mono'}"${photo?` style="background-image:url('${esc(photo)}')"`:''}>${photo?'':esc((name||'И').trim().charAt(0).toUpperCase())}</div>
      <b class="pn">${esc(name)}</b>${pb?'':profBgAskHTML()}</section>
    <div class="stats card anim">${cell(s.eps,plural(s.eps,['эпизод','эпизода','эпизодов']))}${cell(ph,plural(ph,['фраза','фразы','фраз']))}${cell(acc===null?'—':acc+'%','точность')}${cell(streakNow(),'дней подряд')}${cell(fmt(store.gold),'билетов')}${cell(mw,plural(mw,['моё слово','моих слова','моих слов']))}${cell(store.answered,'ответов')}</div>
    ${weekHTML()}
    <h2 class="sec2 anim">Достижения <span>${got} из ${ACH.length}</span></h2>
    <div class="achs anim">${ACH.map(a=>`<button class="ach${store.ach[a.id]?' got':''}" data-a="${a.id}">${iconHTML({img:a.ic,svg:'trophy'})}<span>${esc(a.n)}</span></button>`).join('')}</div>
    <div class="links card anim">
      <button class="lrow2" id="rev2" ${due?'':'disabled'}>${iconHTML({img:'items/refresher',svg:'star'},'sm')}<span><b>Повторение</b><small>${due?`${due} ${plural(due,['задание ждёт','задания ждут','заданий ждут'])}`:'пока нечего повторять'}</small></span><span class="go">›</span></button>
      <button class="lrow2" id="mw2">${iconHTML({svg:'book'},'sm')}<span><b>Мои слова</b><small>${mw?`${mw} ${plural(mw,['слово','слова','слов'])}`:'нажми на слово в субтитрах — «В мои слова»'}</small></span><span class="go">›</span></button>
      <button class="lrow2" id="coll2">${iconHTML({svg:'trophy'},'sm')}<span><b>Коллекция</b><small>фоны, карточки, кадры</small></span><span class="go">›</span></button>
      <button class="lrow2" id="helpBtn" onclick="renderHelp()">${iconHTML({svg:'book'},'sm')}<span><b>Как пользоваться</b><small>все функции коротко и по шагам</small></span><span class="go">›</span></button>
      ${premMode()!=='off'||FLAG_ADMIN?`<button class="lrow2" id="pfPrem">${iconHTML({svg:'star'},'sm')}<span><b>Премиум</b><small>${premHas()?`до ${premDate(premC().until)}`:'повторение, подсказки, слова без лимита'}</small></span><span class="go">›</span></button>`:''}
      <button class="lrow2" id="setBtn">${iconHTML({svg:'shield'},'sm')}<span><b>Настройки</b><small>язык, субтитры, оформление, звук</small></span><span class="go">›</span></button>
    </div>
    ${adm}
    <p class="foot">Версия ${APP_V}</p>`;
}
function bindProfileAdmin(){const b=$('#admBtn');if(b)b.onclick=()=>{sfx('tap');renderAdmin();};}
function bindProfile(){if(ndOn()){ndBindProfile();return;}bindProfileAdmin();if($('#pfPrem'))$('#pfPrem').onclick=()=>{sfx('tap');renderPaywall(null,()=>renderTab('profile'));};
  bindHead();bgFill($('.phead'));$$('#pcChg,#pcSet').forEach(b=>b.onclick=e=>{e.stopPropagation();sfx('tap');haptic('sel');renderCollection('bg');});
  {const c=$('.phead.pbg');if(c)c.onclick=e=>{if(e.target.closest('button'))return;pfView(meCard(),true);};}
  if(!$('#rev2').disabled)$('#rev2').onclick=()=>{haptic('medium');renderDaily();};
  $('#mw2').onclick=()=>{sfx('tap');renderMyWords();};$('#coll2').onclick=()=>{sfx('tap');renderCollection();};
  $$('.ach').forEach(b=>b.onclick=()=>{const a=ACH.find(x=>x.id===b.dataset.a);sfx('sel');toast(`${a.n}: ${a.d}${store.ach[a.id]?'. Получено':''}`);});
}

/* ---- заставка и отсчёт ---- */
function tgConfirm(text,cb){
  try{if(TG&&TG.showConfirm&&TG.isVersionAtLeast&&TG.isVersionAtLeast('6.2')){TG.showConfirm(text,ok=>{if(ok)cb();});return;}}catch(e){}
  if(window.confirm(text))cb();
}
const API='https://dota.1f8t8graf4.workers.dev';
function segCtl(name,opts,val){return `<div class="segctl" data-seg="${name}">${opts.map(([v,l])=>`<button data-v="${v}" aria-pressed="${String(v)===String(val)}">${l}</button>`).join('')}</div>`;}
function bindSeg(name,fn){$$(`[data-seg="${name}"] button`).forEach(b=>b.onclick=()=>{$$(`[data-seg="${name}"] button`).forEach(x=>x.setAttribute('aria-pressed',String(x===b)));sfx('sel');haptic('sel');fn(b.dataset.v);});}
const fmtLeft=ms=>{const h=Math.max(0,Math.floor(ms/36e5)),d=Math.floor(h/24);return d?`${d} д ${h%24} ч`:`${h} ч`;};
/* ================= кино: сцены из сериалов и фильмов ================= */
// Видео и картинки сцен лежат в хранилище по ключам scenes/<сцена>/<NN>.mp4|jpg и scenes/<сцена>/cover.jpg.
// Базовый адрес задаётся в index.html (window.ASSET_BASE): с 13.9 — Cloudflare R2 через воркер бота (/m/scenes/…).
const ASSET_BASE=(window.ASSET_BASE||window.SC_MEDIA||'https://dota.1f8t8graf4.workers.dev/m').replace(/\/$/,'');
// 13.8.2: страницу прокручивает body, а не окно (html,body{height:100%;overflow-x:hidden} — так по стандарту, и в Telegram тоже):
// window.scrollTo/scrollBy/scrollY ничего не делали — новые экраны открывались прокрученными, «наверх» не работало. Теперь они двигают и body.
(function(){try{const B=()=>document.body,ws=window.scrollTo.bind(window),wb=window.scrollBy.bind(window),o=(a,b)=>typeof a==='object'&&a?a:{left:a||0,top:b||0};
  window.scrollTo=function(a,b){ws(a,b);try{if(B())B().scrollTo(o(a,b));}catch(e){}};
  window.scrollBy=function(a,b){wb(a,b);try{if(B())B().scrollBy(o(a,b));}catch(e){}};
  const y=()=>Math.max(document.documentElement.scrollTop||0,(B()||{}).scrollTop||0);
  Object.defineProperty(window,'scrollY',{get:y,configurable:true});Object.defineProperty(window,'pageYOffset',{get:y,configurable:true});
  // и событие прокрутки — тем, кто слушает window (поповер слова и др.)
  document.addEventListener('scroll',e=>{if(e.target===document.body)window.dispatchEvent(new Event('scroll'));},{capture:true,passive:true});}catch(e){}})();
function assetUrl(key){const k=String(key||'');return /^(https?:\/\/|\.\/|\/)/i.test(k)?k:ASSET_BASE+'/'+k;}   // 13.9.51: «./» и «/» — своя статика приложения (обложки в img/scenes/…), без ASSET_BASE
const scCover=(s,file='cover.jpg')=>s&&s.coverUrl?assetUrl(s.coverUrl):assetUrl(scKey(s,file));
const scKey=(s,file)=>`scenes/${s.id}/${file}`;
const scEpKey=(s,i,ext)=>{const p=typeof i==='object'?i:s.parts[i];const fi=p&&p.vf!=null?p.vf:(typeof i==='object'?s.parts.indexOf(i):i);return scKey(s,String(fi+1).padStart(2,'0')+'.'+ext);};
const SCENES=window.__DATA.SCENES;
/* z-ai-version: короткие эпизоды — части длиннее ~70 с или 10 фраз режутся на куски по репликам; тот же видеофайл (p.vf = исходный индекс файла),
   фразы-копии; a/b — исходные абсолютные секунды, плеер и субтитры считают относительно них */
const ZAI_MAX_EP=10, ZAI_MAX_SEC=70, ZAI_MIN_SEC=8, ZAI_GAP=12, ZAI_TAIL=8;
const ZAI_CHUNK=false;   // 13.9.60: резка ВЫКЛЮЧЕНА (Клауд: у кусков 2+ видео/субтитры/паузы съезжали — время считают от p.a куска, а файл играет с начала исходной части; id фраз после резки ломали прогресс, награды и «Фразу дня»). Включать только после правок (а)–(е) из отчёта Клауда.
if(ZAI_CHUNK)(function zaiChunk(){
  for(const s of SCENES){
    if(s.kind==='clip'||!s.parts||!s.parts.length)continue;
    if(!s.parts.some(p=>(p.b-p.a)>ZAI_MAX_SEC||(p.ph||[]).length>ZAI_MAX_EP))continue;
    const np=[];
    s.parts.forEach((p,fi)=>{
      const ph=p.ph||[],dur=p.b-p.a;
      if(!ph.length||ph.length<=ZAI_MAX_EP&&dur<=ZAI_MAX_SEC){np.push(p);return;}
      const cuts=[];let cs=Math.max(p.a,(ph[0]?ph[0].a:p.a)-0.5),used=0;
      for(let k=0;k<ph.length;k++){
        const f=ph[k];
        if(used>0){
          const g=ph[k-1];
          if(f.a-g.b>ZAI_GAP){   // большая монтажная пауза — кусок кончается после прошлой реплики
            cuts.push({a:cs,b:Math.min(p.b,g.b+ZAI_TAIL)});cs=Math.max(0,f.a-0.6);used=0;
          }else if(used<ZAI_MAX_EP&&(f.b-cs)>ZAI_MAX_SEC){   // фраза не влезает в лимит — режем до неё
            cuts.push({a:cs,b:Math.min(p.b,Math.max(cs+ZAI_MIN_SEC,f.a-0.1))});cs=Math.max(0,f.a-0.6);used=0;
          }
        }
        used++;
        if(used>=ZAI_MAX_EP&&k<ph.length-1){
          const nxt=ph[k+1];
          cuts.push({a:cs,b:Math.min(p.b,nxt.a-0.1)});cs=Math.max(0,nxt.a-0.6);used=0;
        }
      }
      const lastB=ph.length?Math.min(p.b,(ph[ph.length-1].b||p.b)+8):p.b;   // без длинных монтажных хвостов
      cuts.push({a:cs,b:lastB,n:used});
      if(cuts.length>1&&cuts[cuts.length-1].n<2){const pr=cuts[cuts.length-2];cuts.pop();pr.b=lastB;}
      const n=cuts.length;
      cuts.forEach((c,k)=>np.push(Object.assign({},p,{t:p.t+(n>1?` · ч.${k+1}/${n}`:''),a:c.a,b:c.b,ph:ph.filter(f=>f.a>=c.a-0.05&&f.a<c.b).map(f=>Object.assign({},f)),vf:fi,chunk:n>1?`${k+1}/${n}`:null})));
    });
    s.parts=np;
  }
})();
SCENES.forEach(s=>s.parts.forEach((p,i)=>p.ph.forEach((f,j)=>{f.id=i+'_'+j;f.pi=i;f.sid=s.id;})));
const SC_DAYS=[1,3,7,21,60];
// повторение сразу по всем сценам: сколько фраз пора повторить и где
const scDueAll=()=>SCENES.map(s=>({s,n:scDue(s).length})).filter(x=>x.n>0).sort((a,b)=>b.n-a.n);
let REVCHAIN=false;
let REVC={sid:null,q:[],go:null};   // 13.9.69 (П8): повторение сцены порциями по 3 — ошибки переходят в следующую порцию («Ещё 3»)
function startRevChain(){const L=scDueAll();if(!L.length){toast('Сегодня повторять нечего');return;}sfx('tap');REVCHAIN=true;renderScQuiz(L[0].s.id,'rev');}
const scMine=()=>SCENES.flatMap(s=>{const P=scP(s.id);return s.parts.flatMap(p=>p.ph).filter(f=>!f.passive&&(P.m[f.id]||0)>0||P.r[f.id]).map(f=>({s,f,st:P.r[f.id]?P.r[f.id][0]:-1,m:P.m[f.id]||0}));});
// звук фразы прямо из фильма: берём кусок эпизода (тот же mp4) с её начала до конца
let SCLIP=null;
function scClip(id,fid,btn,onEnd){const s=scOf(id);if(!s)return;let pi=-1,f=null;s.parts.forEach((p,i)=>p.ph.forEach(x=>{if(x.id===fid){pi=i;f=x;}}));if(!f)return;
  const p=s.parts[pi],src=assetUrl(scEpKey(s,pi,'mp4')),st=Math.max(0,f.a-p.a-0.08),en=f.b-p.a+0.12;
  if(!SCLIP){SCLIP=document.createElement('video');SCLIP.playsInline=true;SCLIP.setAttribute('playsinline','');SCLIP.preload='auto';SCLIP.style.display='none';document.body.appendChild(SCLIP);}
  clearInterval(SCLIP._t);$$('.sc-say.on').forEach(x=>x.classList.remove('on'));if(btn)btn.classList.add('on');
  if(SCLIP.dataset.src!==src){SCLIP.src=src;SCLIP.dataset.src=src;}
  const go=()=>{const el=SCLIP,g=el._g=(el._g||0)+1;   // 13.9.69: два быстрых вызова — играет только последний (раньше лишний таймер жил вечно и после ухода с экрана сыпал ошибками)
    const start=()=>{if(SCLIP!==el||el._g!==g)return;clearInterval(el._t);const pr=el.play();if(pr&&pr.catch)pr.catch(()=>{});
      const t=el._t=setInterval(()=>{if(SCLIP!==el||el._g!==g){clearInterval(t);return;}if(el.currentTime>=en||el.ended){el.pause();clearInterval(t);if(btn)btn.classList.remove('on');if(onEnd)onEnd();}},30);};
    SCLIP.pause();if(Math.abs(SCLIP.currentTime-st)<0.03){start();return;}SCLIP.addEventListener('seeked',start,{once:true});try{SCLIP.currentTime=st;}catch(e){start();}};
  if(SCLIP.readyState>=1)go();else{SCLIP.addEventListener('loadedmetadata',go,{once:true});SCLIP.load();}
  haptic('sel');}
// где так можно говорить: грубо / разговорное / официально / нейтрально
function scTag(f){const x=(f.en||'')+' '+(f.de||'');
  if(/\b(fuck\w*|shit\w*|ass(hole)?|bitch|dick(head)?|pussy|goddamn|motherfuck\w*|puke)\b|Schei(ß|ss)|verdammt|Arsch|Schlampe|kotzen/i.test(x))return ['грубо','rude'];
  if(/\b(sufficient|circumstances|acquaintance|obligated|standpoint|assuming|indistinguishable|regularity|congratulations|impressive|reservation)\b|Umständen|erfolgt/i.test(x))return ['официально','formal'];
  if(/\b(gonna|wanna|gotta|dunno|ain't|yeah|kidding|guys?|okay|hey)\b|in'\b|'cause/i.test(x))return ['разговорное','casual'];
  return ['нейтрально','neutral'];}
/* ================= 7.9: субтитры клипа — из файлов автора ================= */
// Текст песни в код и данные НЕ вшивается. Автор сам кладёт файлы в папку клипа (репозиторий scenes):
//   <id клипа>/orig.srt — оригинал, <id клипа>/ru.srt — его перевод, <id клипа>/de.srt — немецкий (по желанию).
// При открытии клипа приложение читает их, показывает построчно и делает из строк задания.
// «О треке» (общая сводка и словарик сленга по отдельным словам) — из data/clipnotes.json, тоже по желанию.
function srtParse(txt){const ts=x=>{const m=/(\d+):(\d+):(\d+)[,.](\d+)/.exec(x);return m?(+m[1])*3600+(+m[2])*60+(+m[3])+(+m[4])/1000:0;};
  return String(txt||'').replace(/\r/g,'').split(/\n\s*\n/).map(b=>{const L=b.split('\n').filter(Boolean);const k=L.findIndex(l=>l.includes('-->'));if(k<0)return null;
    const [a,c]=L[k].split('-->');return [ts(a),ts(c),L.slice(k+1).join(' ').replace(/<[^>]+>/g,'').trim()];}).filter(x=>x&&x[2]);}
const CLIPLOAD={};let CLIPNOTES=null;
function clipLoad(s){if(CLIPLOAD[s.id])return CLIPLOAD[s.id];
  const get=f=>fetch(assetUrl(scKey(s,f)),{cache:'no-cache'}).then(r=>r.ok?r.text():null).catch(()=>null);
  const notes=CLIPNOTES?Promise.resolve(CLIPNOTES):fetch('data/clipnotes.json').then(r=>r.ok?r.json():{}).catch(()=>({})).then(j=>CLIPNOTES=j||{});
  return CLIPLOAD[s.id]=Promise.all([get('orig.srt'),get('ru.srt'),get('de.srt'),notes]).then(([o,r,d])=>{
    if(!o)return false;const O=srtParse(o),R=r?srtParse(r):[],D=d?srtParse(d):[];if(!O.length)return false;
    const near=(L,a)=>{let best='',bd=1.5;for(const x of L){const dd=Math.abs(x[0]-a);if(dd<bd){bd=dd;best=x[2];}}return best;};
    s.subs=O.map(([a,b,t])=>[a,b,t,near(R,a),near(D,a)]);
    const end=O[O.length-1][1]+1,p=s.parts[0]||(s.parts[0]={t:'Клип',a:0,b:end,ph:[]});p.a=0;p.b=Math.max(p.b||0,end);
    p.ph=s.subs.filter(x=>x[3]&&x[2].split(/\s+/).length>=3).map((x,j)=>({en:x[2],ru:x[3],de:x[4]||x[2],a:Math.max(0,x[0]-0.15),b:x[1]+0.15,note:'',gap:'',id:'0_'+j,pi:0}));
    s._srt=true;return true;});}
const clipNotesHTML=s=>{const n=CLIPNOTES&&CLIPNOTES[s.id];if(!n)return '';
  return `<div class="clip-notes sc-card"><b>О треке</b>${n.about?`<p>${esc(n.about)}</p>`:''}${(n.slang||[]).length?`<div class="cn-sl">${n.slang.map(x=>`<div><b>${esc(x[0])}</b><span>${esc(x[1])}</span></div>`).join('')}</div>`:''}</div>`;};
/* ================= 7.9.2: проверка установки (админка) ================= */
// Одной кнопкой проверяет, что всё залито: свежий код, темы, маскот и видео/обложки/музыка каждой сцены.
const APP_V='13.9.74';
// z-ai-version: короткие эпизоды, короткие задания, вкладки «Словарь · Сцены · Профиль», тема styles/zai.css (флаг — в начале файла)
// 13.9.21: название — в одном месте (заставки, витрина заставок в магазине). Переименуешь — поменяй ещё <title> в index.html и имя бота в BotFather
const APP_NAME='Языки по кино';
async function deployCheck(box){
  const head=u=>fetch(u,{method:'HEAD',cache:'no-store'}).then(r=>({ok:r.ok,len:+(r.headers.get('content-length')||0)})).catch(()=>({ok:false,len:0}));
  const rows=[];const add=(ok,name,hint)=>{rows.push({ok,name,hint});draw();};
  const draw=()=>{const bad=rows.filter(r=>!r.ok).length;box.innerHTML=`<div class="dk-sum ${bad?'bad':'ok'}">${bad?`Не хватает: ${bad}`:'Всё на месте ✅'} · проверено ${rows.length}</div>`+rows.map(r=>`<div class="dk-r ${r.ok?'ok':'bad'}"><b>${r.ok?'✅':'❌'}</b><span>${esc(r.name)}${!r.ok&&r.hint?`<small>${esc(r.hint)}</small>`:''}</span></div>`).join('');};
  box.innerHTML='<div class="dk-sum">Проверяю…</div>';
  add(true,`Код приложения: версия ${APP_V}`,'');
  let r=await head('data/topics.json');add(r.ok,'data/topics.json — темы фраз','Загрузи из архива папку data в корень основного репо');
  for(const s of SCENES.filter(x=>x.kind!=='clip')){
    const miss=[];for(let i=0;i<s.parts.length;i++){if(s.parts[i].vf!=null)continue;const nn=String(i+1).padStart(2,'0'),x=await head(assetUrl(scEpKey(s,i,'mp4')));if(!x.ok)miss.push(nn+'.mp4');const k=await head(assetUrl(scKey(s,nn+'-k.jpg')));if(!k.ok)miss.push(nn+'-k.jpg (кадр-награда)');}
    const cv=await head(assetUrl(scKey(s,'cover.jpg')));if(!cv.ok)miss.push('cover.jpg');
    const m=(s.music||[])[0];if(m){const x=await head(assetUrl(scKey(s,m.f)));if(!x.ok)miss.push(m.f);}
    for(const [on,L,t] of [[s.bgv,['bg.mp4','bgp.jpg'],'фон сцены'],[s.filmbg,['film-bg.mp4','film-bgp.jpg'],'главный фон']])if(on)for(const f of L){const x=await head(assetUrl(scKey(s,f)));if(!x.ok)miss.push(`${f} (${t})`);}   // 13.0: фоны-награды
    add(!miss.length,`Сцена «${s.title}» · ${s.sub||s.id}`,miss.length?`Нет в хранилище R2, папка ${s.id}/: ${miss.join(', ')} — залей: python3 tools/r2_up.py ${s.id}`:'');}
}
/* ================= 7.9.3: слова вместо зубрёжки фраз (пилот: Волк, эпизод 1) ================= */
// Данные — data/scenewords.json: по сцене и эпизоду ключевые слова [слово, перевод, по-немецки, формы] и словарик остальных слов.
// В субтитрах любое слово нажимается: перевод слова (или, если его нет в словарике, перевод всей реплики).
const SCW=(window.__DATA&&window.__DATA.SCENEWORDS)||{};
const swData=(sid,pi)=>(SCW[sid]&&SCW[sid][String(pi)])||null;
const swNorm=w=>String(w||'').toLowerCase().replace(/[’`]/g,"'").replace(/^[^a-zß-öø-ÿ']+|[^a-zß-öø-ÿ'.]+$/g,'').replace(/\.+$/,'');   // 13.9.16: все точки в конце (speech... ); 13.9.9: ß-ö (с ß), иначе weiß → wei и перевода нет
// 8.6: общий словарь всех слов всех сцен (data/glossary.json) — перевод есть у каждого слова в субтитрах
const GLOSS=(window.__DATA&&window.__DATA.GLOSS_EN)||{},GLOSS_DE=(window.__DATA&&window.__DATA.GLOSS_DE)||{};
// 13.9.13: подробнее о слове — что значит, какая форма, как употребляют, 1–2 примера (data/winfo-en.json / winfo-de.json, ~0.5 МБ).
// Грузится при первом нажатии на слово (или заранее, когда открыл эпизод / словарь); не загрузилось — окошко как раньше.
const WI={en:null,de:null,p:{}};
function wiLoad(L){if(WI[L])return Promise.resolve(WI[L]);if(WI.p[L])return WI.p[L];const K='WINFO_'+L.toUpperCase(),A=window.__DATA_ALL;
  if(A&&A[K]){WI[L]=A[K];return Promise.resolve(WI[L]);}
  return WI.p[L]=fetch('data/winfo-'+L+'.json?v='+APP_V).then(r=>r.json()).then(j=>WI[L]=j[K]||{}).catch(()=>{WI.p[L]=null;return null;});}
const wiLang=sid=>{const s=scOf(sid);return s&&s.lang==='de'?'de':'en';};
// 13.9.29: уровень слов A1–C1 по частотности (data/wlv.json из tools/word_levels.py) — метки в словаре «Нового»: у фразы — по самому редкому слову
const WLV={m:null,p:null};
function wlvLoad(){if(WLV.m)return Promise.resolve(WLV.m);if(WLV.p)return WLV.p;
  const mk=j=>{const m={en:new Map(),de:new Map()};for(const L of ['en','de']){const o=j['WLV_'+L.toUpperCase()]||{};for(const b in o)o[b].split(' ').forEach(w=>w&&m[L].set(w,+b));}return WLV.m=m;};
  const A=window.__DATA_ALL;if(A&&A.WLV_EN)return Promise.resolve(mk(A));
  return WLV.p=fetch('data/wlv.json?v='+APP_V).then(r=>r.json()).then(mk).catch(()=>{WLV.p=null;return null;});}
const wlvWord=(w,L)=>{if(!WLV.m||!w)return 0;const M=WLV.m[L==='de'?'de':'en'],n=String(w).toLowerCase().replace(/’/g,"'");return M.get(n)||M.get(n.replace(/'s$/,''))||0;};
const wlvText=(t,L)=>{let b=0;String(t||'').replace(/[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['’][A-Za-zÀ-ÖØ-öø-ÿ]+)*/g,w=>{b=Math.max(b,wlvWord(w,L));return w;});return b;};
// метка слева у строки словаря: немецкое существительное — артикль цветом, иначе уровень
const lvTag=(t,L)=>{if(!ndOn()||!WLV.m)return '';const a=L==='de'&&/^(der|die|das)\s/i.exec(String(t||''));
  if(a){const r=a[1].toLowerCase();return `<em class="kq-lv art a-${r}">${r}</em>`;}
  const b=wlvText(t,L);return b?`<em class="kq-lv lvb l-${CEFR[b-1].toLowerCase()}" title="${LVW[CEFR[b-1]]}" aria-label="Уровень: ${LVW[CEFR[b-1]]}">${lvBarsIn(b)}</em>`:'<em class="kq-lv no"></em>';};   // нет уровня (своё слово) — пустое место, чтобы строки стояли ровно
const wiGet=(w,L)=>{const D=WI[L];if(!D||!w)return null;const n=String(w).toLowerCase().replace(/’/g,"'"),b=n.replace(/'s$/,'');return D[n]||D[b]||D[n.replace(/'/g,'')]||null;};
const wiHTML=(w,L,w2)=>{const x=wiGet(w,L)||(w2?wiGet(w2,L):null);if(!x)return '';const [d,ex]=x;
  return `<div class="kwp-wi"><p>${esc(d)}</p>${(ex||[]).slice(0,2).map(e=>`<span class="kwp-wx"><b>${esc(e[0])}</b><small>${esc(e[1])}</small></span>`).join('')}</div>`;};
// 13.9.51 (Андрей: «почему нет вкладки „Подробнее“ для новых слов?»): у слова без winfo «Подробнее» не собиралось —
// блок оставался пустым. Теперь для таких слов собираем что есть: уровень слова (wlv.json), словарная форма с переводом
// из глоссария и 1–2 примера этого слова из других сцен (заголовок — фильм). Слово ищем целиком, без угадывания морфологии.
const NW_RE=w=>new RegExp('\\b'+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i');
// словарная форма: worried→worry, cared→care, called→call, worrying→worry, making→make, boys→boy — первый кандидат, что есть в глоссарии/уровнях
function nwBase(n,L){const G=L==='de'?GLOSS_DE:GLOSS,ok=b=>G[b]||wlvWord(b,L)?b:null,cands=[];
  if(/ied$/.test(n))cands.push(n.slice(0,-3)+'y');
  else if(/ed$/.test(n))cands.push(n.slice(0,-1),n.slice(0,-2)+'e',n.slice(0,-2));
  else if(/ing$/.test(n))cands.push(n.slice(0,-3),n.slice(0,-3)+'e');
  else if(/s$/.test(n))cands.push(n.slice(0,-1));
  return cands.map(ok).find(Boolean)||n;}
function nwHTML(word,sid,cur){const n=swNorm(word);if(!n||n.length<2||(typeof SC_BASIC!=='undefined'&&SC_BASIC.has(n)))return '';
  const L=wiLang(sid),G=L==='de'?GLOSS_DE:GLOSS,lv=wlvWord(n,L),P=[];
  if(lv)P.push(`уровень слова — <b>${LVW[CEFR[lv-1]].toLowerCase()}</b>`);
  const base=nwBase(n,L);
  if(base&&base!==n)P.push(`форма от <b>${esc(base)}</b>${G[base]?` — «${esc(String(G[base]).split(';')[0])}»`:''}`);
  const ex=[];   // примеры: точное слово, если пусто — формы базовой (worrying→worry/worried); до 2 из других сцен, потом — из своей (кроме текущей реплики)
  for(const w0 of [n,nwBase(n,L)!==n?nwBase(n,L):null]){if(ex.length>=2)break;const w=String(w0||'').toLowerCase();if(!w||w.length<3)continue;
    const re=NW_RE(w),seen=new Set(),oth=[],own=[];
    for(const s of SCENES){if(s.lang==='de'||!s.subs)continue;
      for(const r of s.subs){const t=String(r[2]||'');if(t.length<4||seen.has(t)||(cur&&r[0]===cur[0]&&r[1]===cur[1]))continue;
        if(!re.test(t))continue;seen.add(t);(s.id===sid?own:oth).push([s,r,t]);if(oth.length>=2)break;}
      if(oth.length>=2)break;}
    ex.push(...oth,...own);}
  if(ex.length>2)ex.length=2;
  if(!P.length&&!ex.length)return '';
  const pt=P.join(', ');let h=`<div class="kwp-nw">${pt?`<p>${pt.charAt(0).toUpperCase()+pt.slice(1)}.</p>`:''}`;
  if(ex.length)h+=`<em>Ещё в кино</em>`+ex.map(([s,r,t])=>`<span class="kwp-wx"><b>${esc(t)}</b><small>${esc(String(r[3]||'').replace(/\n/g,' '))} · ${esc(s.title)}</small></span>`).join('');
  return h+'</div>';}
// 13.9.16 (Андрей: «при нажатии на слово пиши, что оно тут значит и какое выражение — over the past»): значение слова В ЭТОЙ РЕПЛИКЕ и выражения.
// data/ctx-en.json / ctx-de.json: {CTX_EN:{sid:[[реплика, {слово:значение тут}, [[выражение как в реплике, значение, пояснение]]], …]}} — по строкам s.subs
const CX={en:null,de:null,p:{}};
function cxLoad(L){if(CX[L])return Promise.resolve(CX[L]);if(CX.p[L])return CX.p[L];const K='CTX_'+L.toUpperCase(),A=window.__DATA_ALL;
  if(A&&A[K]){CX[L]=A[K];return Promise.resolve(CX[L]);}
  return CX.p[L]=fetch('data/ctx-'+L+'.json?v='+APP_V).then(r=>r.json()).then(j=>CX[L]=j[K]||{}).catch(()=>{CX.p[L]=null;return null;});}
const cxOrig=(s,r)=>String((s.lang==='de'?r[4]||r[2]:r[2])||'');
function cxRows(sid,o){const s=scOf(sid),D=CX[wiLang(sid)],A=D&&D[sid];if(!s||!A)return [];const S=s.subs||[];
  const at=r=>{let k=S.indexOf(r);if(k<0)k=S.findIndex(z=>Math.abs(z[0]-r[0])<0.05);const e=k>=0?A[k]:null;
    if(e&&phNorm(e[0])===phNorm(cxOrig(s,S[k])))return e;const t=phNorm(cxOrig(s,r));return t?A.find(z=>z&&phNorm(z[0])===t)||null:null;};
  if(o.row)return [at(o.row)].filter(Boolean);
  const f=o.f;if(!f||f.a==null)return [];return S.filter(r=>r[0]<f.b-0.05&&r[1]>f.a+0.05).map(at).filter(Boolean);}
const cxToks=t=>String(t||'').toLowerCase().replace(/[’`]/g,"'").split(/[^a-zß-öø-ÿ']+/).filter(Boolean);
function cxHit(sid,o,word){const R=cxRows(sid,o),n=swNorm(word),b=n.replace(/'s$/,'');if(!R.length||!n)return null;let here='',has=false,g='';const X=[],seen=new Set();
  R.forEach(e=>{const w=e[1]||{},G=e[3]||{},LT=cxToks(e[0]);if(!has){const k=n in w?n:b in w?b:null;if(k!==null){has=true;here=String(w[k]||'');g=String(G[k]||'');}}(e[2]||[]).forEach(x=>{const k=String(x[0]||'');if(seen.has(k))return;const T=cxToks(k);
    if(T.length>=Math.max(2,LT.length*0.8))return;   // «выражение» = почти вся реплика — её и так видно целиком с переводом (13.9.4: без дублей)
    if(T.includes(n)||T.includes(b)){seen.add(k);X.push(x);}});});
  return here||has||X.length?{here,X,g,has}:null;}
// 13.9.35: что показать главной строкой: значение тут; «—» — слово не переводится (объяснение из g); пустое — слово внутри выражения (значение выражения)
function cxMain(h){if(!h)return null;if(h.here==='—')return {t:h.g||'тут не переводится',l:h.g?'тут не переводится':'',k:'dash'};
  if(h.here)return {t:h.here,l:'так в этой реплике',k:'here'};if(h.X.length)return {t:h.X[0][1]||'',l:`в выражении «${h.X[0][0]}»`,k:'x'};return null;}
const cxGHTML=h=>h&&h.g&&h.here!=='—'?`<div class="kwp-use kwp-g"><em>Грамматика</em><span>${esc(h.g)}</span></div>`:'';
// 13.9.35 (ТЗ: пунктир в видео — как в словаре): учебное выражение фразы, если оно не вся фраза; вызывают и dictlab.js (через typeof)
function phIdOf(f){const id=phIdiom(f);return id&&!idWhole(id,f)?id:null;}
const cxXHTML=X=>X.map(x=>`<div class="kwp-use kwp-cx"><em>Тут это часть выражения</em><span><b>${esc(x[0])}</b> — ${esc(x[1]||'')}</span>${x[2]?`<small>${esc(x[2])}</small>`:''}</div>`).join('');
function swFind(sid,pi,tok){const d=swData(sid,pi),n=swNorm(tok),s0=scOf(sid);
  if(!d){const G=s0&&s0.lang==='de'?GLOSS_DE:GLOSS,b=n.replace(/'s$/,''),v=G[n]||G[b]||G[n.replace(/'/g,'')];return v?{w:n,ru:v,key:false}:null;}
  for(const k of d.key){if(k[3].includes(n)||k[0]===n)return {w:k[0],ru:k[1],de:k[2],key:true};}
  const g=d.gloss||{};const base=n.replace(/'s$/,'');const G=s0&&s0.lang==='de'?GLOSS_DE:GLOSS;const v=g[n]||g[base]||g[n.replace(/s$/,'')]||G[n]||G[base]||G[n.replace(/'/g,'')];return v?{w:n,ru:v,key:false}:null;}
// субтитры: оригинальная строка — словами, на которые можно нажать
const swWrap=txt=>String(txt||'').split(/([A-Za-zÀ-ÖØ-öø-ÿ'’]+)/).map((x,k)=>k%2?`<i class="sw">${esc(x)}</i>`:esc(x)).join('');   // 13.6: и буквы с акцентом (Timothée — одно слово)
function swPop(word,row,inPh,el){if(!SW||!SCUR)return;const s=scOf(SCUR.id),pi=SCUR.i||0,hit=swFind(s.id,pi,word),pf=inPh&&phIdiom(SW._rowPh)?SW._rowPh:null;
  if(el&&(!matchMedia('(hover:hover)').matches||innerWidth<640)){const was=SV&&!SV.paused;if(was)SV.pause();const id0=pf?phIdiom(pf):null,id=id0&&!idWhole(id0,pf)?id0:null,de=s.lang==='de';
    const html=`<span class="kwp-k">${hit&&hit.key?'★ Слово эпизода':'Слово'}</span><b class="kwp-w">${esc(swNorm(word))}</b><span class="kwp-t">${hit?esc(hit.ru):'нет в словарике — смотри перевод реплики'}</span>
      ${id?`<div class="kwp-use"><em>Тут это часть выражения</em><span><b>${esc(id.head)}</b> — ${esc(id.mean)}</span></div>`:''}
      ${row?`<div class="kwp-ex"><em>Вся реплика</em><b>${esc(String(row[de?4:2]||'').replace(/\n/g,' '))}</b><small>${esc(String(row[3]||'').replace(/\n/g,' '))}</small></div>`:''}`;
    popAt(el,html,{sid:s.id,f:pf,word:swNorm(word),w2:hit&&hit.w,ru:hit?hit.ru:'',row,pi,wi:1},true);
    if(KWP)KWP._resume=was?()=>{if(SV&&SV.isConnected&&SV.paused){const p=SV.play();if(p&&p.catch)p.catch(()=>{});}}:null;
    return;}
  if(SV&&!SV.paused)SV.pause();const o=SW.querySelector('.sc-wpop');if(o)o.remove();
  const w=document.createElement('div');w.className='sc-wpop';
  const cx=row&&CX[wiLang(s.id)]?cxHit(s.id,{row},word):null;if(row&&!CX[wiLang(s.id)])cxLoad(wiLang(s.id));   // 13.9.16: значение в этой реплике
  const cm=cxMain(cx);
  w.innerHTML=cm?`${hit&&hit.key?'<span class="k">★ слово эпизода</span>':''}<b>${esc(swNorm(word))}</b><span class="t">${esc(cm.t)}</span>${cm.l?`<small class="kwp-here">${esc(cm.l)}</small>`:''}`
    :hit?`${hit.key?'<span class="k">★ слово эпизода</span>':''}<b>${esc(swNorm(word))}</b><span class="t">${esc(hit.ru)}</span>${hit.de?`<small>по-немецки: ${esc(hit.de)}</small>`:''}`
    :`<b>${esc(swNorm(word))}</b>${pf?'':`<small class="wp-keep">нет в словарике — вся реплика:</small><span class="t">${esc(row&&row[3]||'')}</span>`}`;
  if(cx&&cx.X.length)w.innerHTML+=cxXHTML(cm&&cm.k==='x'?cx.X.slice(1):cx.X);else if(pf)w.innerHTML+=phBlock(pf);
  if(cx)w.innerHTML+=cxGHTML(cx);
  {const L=wiLang(s.id);if(hit){if(WI[L]){const wh=wiHTML(swNorm(word),L,hit.w);w.innerHTML+=wh||nwHTML(swNorm(word),s.id,row);}else wiLoad(L).then(()=>{if(!w.isConnected||w.querySelector('.kwp-wi'))return;const m=w.querySelector('.kwp-more'),b=w.querySelector('.hn-b'),h=wiHTML(swNorm(word),L,hit.w);if(m)m.insertAdjacentHTML('beforeend',h);else if(b){b.insertAdjacentHTML('beforebegin',h);w._fold=0;w.querySelector('.kwp-x')?.remove();wpFold(w);}});}
  else{const nh=nwHTML(swNorm(word),s.id,row);if(nh)w.innerHTML+=nh;}}   // 13.9.13: подробнее о слове — после выражения; 13.9.51: и для новых слов
  // 13.9.53 (Андрей: «не могу выбрать подробнее»): если у слова нет ни winfo, ни примеров — блок «Подробнее» не собирался,
  // и кнопки не было вовсе. Теперь «Вся реплика» всегда лежит под «Подробнее» (когда она ещё не видна в шторке) —
  // кнопка «Подробнее ▾» есть у любого слова сцены.
  {const de0=s.lang==='de';if(row&&!pf&&!w.querySelector('.kwp-ex')&&!w.querySelector('.wp-keep'))w.innerHTML+=`<div class="kwp-ex"><em>Вся реплика</em><b>${esc(String(row[de0?4:2]||'').replace(/\n/g,' '))}</b><small>${esc(String(row[3]||'').replace(/\n/g,' '))}</small></div>`;}
  w.innerHTML+=`<div class="hn-b"><button data-x="go">Дальше ${SI.play}</button>${row?'<button data-x="word">🔊 Слово</button>':''}${mywBtn(s.id,word)}</div>`;
  wpFold(w);wpEsc();
  w.onclick=e=>{e.stopPropagation();const b=e.target.closest('[data-x]');if(!b)return;
    if(b.dataset.x==='more'){sfx('tap');wpMore(w,!w.classList.contains('mo'));return;}
    if(b.dataset.x==='save'){const on=mywToggle(s.id,pi,word,row,hit);b.classList.toggle('on',on);b.textContent=on?'★ В моих словах':'☆ В мои слова';return;}
    if(b.dataset.x==='word'&&row){wordPlay(s.id,word,row[0],row[1],b);return;}
    w.remove();sfx('tap');
    if(b.dataset.x==='slow'&&row&&SV){const rt=SV.playbackRate,p=scOf(SCUR.id).parts[SCUR.i||0];SV.playbackRate=.75;scPlay(row[0]-0.1,row[1]+0.1,()=>{if(SV)SV.playbackRate=rt;});return;}
    if(b.dataset.x==='re'&&row&&SV){SV.currentTime=Math.max(0,row[0]-0.1);}if(SV){const p=SV.play();if(p&&p.catch)p.catch(()=>{});}};
  SW.appendChild(w);haptic('sel');}
// 7.9.6: выражения внутри реплики. Слово «clients» — «клиенты», а «Fuck the clients» — «да похуй на клиентов»:
// если в реплике есть учебная фраза, её слова подчёркнуты, и при нажатии/наведении показывается и слово, и смысл всего выражения.
const phNorm=x=>String(x||'').toLowerCase().replace(/[’`]/g,"'").replace(/[^a-zäöüß0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
function scRowPhrase(row){if(!row||!SCUR)return null;const s=scOf(SCUR.id);if(!s)return null;const de=s.lang==='de';
  const line=phNorm(de?row[4]:row[2]);if(!line)return null;let best=null;
  for(const p of s.parts)for(const f of p.ph){const t=phNorm(de?f.de:f.en);if(!t)continue;
    if(line.includes(t)||(t.includes(line)&&line.split(' ').length>=2)){if(!best||t.length>phNorm(de?best.de:best.en).length)best=f;}}
  return best;}
// оригинал реплики словами; слова выражения — с пометкой in-ph
function swWrapPh(txt,f){const de=SCUR&&scOf(SCUR.id)&&scOf(SCUR.id).lang==='de';const ph=f?String(de?f.de:f.en).replace(/[.!?…,]+$/,''):'';
  if(!ph)return swWrap(txt);const i=txt.toLowerCase().indexOf(ph.toLowerCase());
  // 13.9.35 (ТЗ: пунктир почти под всей строкой): как в словаре — только слова выражения (phIdOf, не вся фраза) и важных выражений из 2+ слов
  const id=phIdOf(f),KW=new Set((f.kw||[]).filter(k=>scToks(String(k[0]||'')).length>=2).flatMap(k=>cxToks(k[0])));if(!id&&!KW.size)return swWrap(txt);
  const mark=s=>swWrap(s).replace(/<i class="sw">([^<]+)<\/i>/g,(m,w)=>(id&&idHit(id,w))||KW.has(swNorm(w.replace(/&#39;/g,"'")))?`<i class="sw in-ph">${w}</i>`:m);
  if(i<0)return phNorm(ph).includes(phNorm(txt))?mark(txt):swWrap(txt);
  return swWrap(txt.slice(0,i))+mark(txt.slice(i,i+ph.length))+swWrap(txt.slice(i+ph.length));}
// идиома фразы — из начала пояснения: «Fuck + кто-то — «похуй на…»» → слова {fuck}, смысл «похуй на…»
function phIdiom(f){if(!f)return null;const m=/^([^—«]{2,70}?) — «([^»]{2,90})»/.exec(f.note||'');if(!m)return null;
  const words=(m[1].toLowerCase().match(/[a-zäöüß']+/g)||[]).filter(w=>w.length>1);return words.length?{head:m[1].trim(),mean:m[2].trim(),words}:null;}
const idHit=(id,tok)=>{if(!id)return false;const n=swNorm(tok);return id.words.some(w=>n===w||(n.startsWith(w)&&/^(s|es|ed|d|ing|in'|in|'s|'d|n't)$/.test(n.slice(w.length))));};
// 13.9.4: у 444 из 646 фраз пояснение начинается с самой фразы — «выражение» = вся фраза. Тогда «Тут это часть выражения» слово в слово
// повторяет «Во фразе» (Андрей: «даблится объяснение») — такое «выражение» не показываем. Настоящие выражения внутри фразы («Fuck the clients») — как раньше.
const idWhole=(id,f)=>!!(id&&f)&&[f.en,f.de].some(x=>{const t=phNorm(x);if(!t)return false;if(t===phNorm(id.head))return true;
  const tw=t.split(' ').filter(w=>w.length>1);return tw.length>0&&tw.filter(w=>id.words.includes(w)).length/tw.length>=0.8;});
function phBlock(f){const id=phIdiom(f);if(!id)return '';if(idWhole(id,f))return `<div class="wp-ph"><span class="k">Во фразе</span><b>${esc(scT(f))}</b><span class="t">${esc(f.ru)}</span></div>`;return `<div class="wp-ph"><span class="k">Это слово тут — часть выражения</span><b>${esc(id.head)}</b><span class="t">${esc(id.mean)}</span><small>В реплике: «${esc(scT(f))}» — ${esc(f.ru)}</small></div>`;}
/* ================= 9.1–9.2: слова фразы — нажимается КАЖДОЕ слово ================= */
// f.kw = [[как во фразе, словарная форма, перевод, пример, перевод примера, когда применяется], ...] — «важные» слова, подсвечены.
// Остальные слова тоже нажимаются: перевод из словаря сцены, выражение (если слово — его часть) и вся фраза с переводом.
const kwOf=f=>(scL()==='de'&&!scIsDe())?[]:(f&&Array.isArray(f.kw)?f.kw:[]);
function kwWrap(f,txt){txt=txt==null?scT(f):String(txt);const K=kwOf(f);if(!K.length)return swWrap(txt);
  const low=txt.toLowerCase().replace(/[’`]/g,"'"),isL=c=>!!c&&/[a-zäöüß0-9]/i.test(c),marks=[];
  K.forEach((k,i)=>{const w=String(k[0]).toLowerCase().replace(/[’`]/g,"'");if(!w)return;let at=-1,from=0;
    while((at=low.indexOf(w,from))>=0){if(!isL(low[at-1])&&!isL(low[at+w.length]))break;from=at+1;}
    if(at>=0&&!marks.some(m=>at<m[1]&&at+w.length>m[0]))marks.push([at,at+w.length,i]);});
  marks.sort((x,y)=>x[0]-y[0]);let out='',pos=0;
  for(const [a,b,i] of marks){out+=swWrap(txt.slice(pos,a))+`<i class="kw" data-kw="${i}" tabindex="0" role="button">${esc(txt.slice(a,b))}</i>`;pos=b;}
  return out+swWrap(txt.slice(pos));}
// 13.9.18 (Андрей: «окно огромное, закрывает субтитры, никак не могу закрыть; вся инфа — только по „Подробнее“»): окошко слова коротко —
// слово, что оно значит тут, одно выражение; остальное (объяснение, примеры, вся реплика, другие выражения) — под «Подробнее ▾». ✕, Esc, тап мимо — закрыть.
// Настройка «Окошко слова — сразу всё» (store.wpopFull) раскрывает «Подробнее» сразу.
const wpIsX=c=>c.classList.contains('kwp-cx')||(c.matches('.kwp-use,.wp-ph')&&/выражени/i.test(((c.querySelector('em,.k')||{}).textContent)||''));
function wpFold(box){if(!box||box._fold)return;box._fold=1;const bt=box.querySelector(':scope>.kwp-b,:scope>.hn-b');let fx=false;const more=document.createElement('div');more.className='kwp-more';
  [...box.children].forEach(c=>{if(c===bt||c.tagName==='B'||c.matches('.kwp-x,.kwp-k,.kwp-w,.kwp-t,.kwp-here,.wp-keep,.k,.t'))return;
    if(!fx&&wpIsX(c)){fx=true;c.classList.add('wp-k');return;}more.appendChild(c);});
  if(box.querySelector('.wp-k small'))more.prepend(Object.assign(document.createElement('div'),{className:'kwp-xn',textContent:box.querySelector('.wp-k small').textContent}));
  box.insertAdjacentHTML('afterbegin',`<button class="kwp-x" data-x="ok" aria-label="Закрыть">${ui('close')}</button>`);
  if(!more.children.length)return;const mb=document.createElement('button');mb.className='kwp-mb';mb.dataset.x='more';
  bt?box.insertBefore(mb,bt):box.appendChild(mb);box.insertBefore(more,mb.nextSibling);wpMore(box,store.wpopFull===true);}
// Esc и тап по видео мимо окошка — закрыть его и смотреть дальше
function wpClose(){const w=document.querySelector('.sc-wpop');if(!w)return false;w.remove();if(SV&&SV.isConnected&&SV.paused){const p=SV.play();if(p&&p.catch)p.catch(()=>{});}return true;}
let WP_ESC=0;function wpEsc(){if(WP_ESC)return;WP_ESC=1;document.addEventListener('keydown',e=>{if(e.key==='Escape'&&wpClose())e.stopPropagation();},true);}
function wpMore(box,on){box.classList.toggle('mo',on);const mb=box.querySelector('.kwp-mb');if(mb)mb.innerHTML=on?'Свернуть ▴':'Подробнее ▾';}
const kwCardHTML=k=>`<span class="kwp-k">${isPhr(k[1]||k[0])?'Важное выражение':'Важное слово'}</span><b class="kwp-w">${esc(k[1]||k[0])}</b><span class="kwp-t">${esc(k[2]||'')}</span>
  ${k[5]?`<div class="kwp-use"><em>Когда пригодится</em><span>${esc(k[5])}</span></div>`:''}
  ${k[3]?`<div class="kwp-ex"><em>Пример</em><b>${esc(k[3])}</b>${k[4]?`<small>${esc(k[4])}</small>`:''}</div>`:''}`;
let KWP=null,KWT=0;
function kwHide(ms){clearTimeout(KWT);KWT=setTimeout(()=>{if(KWP){KWP.classList.remove('on','pin');document.body.classList.remove('kw-open');if(KWP._resume){const f=KWP._resume;KWP._resume=null;f();}}$$('.kw.on,.sw.on').forEach(x=>x.classList.remove('on'));$$('.sc-sheetwrap.under').forEach(x=>x.classList.remove('under'));},ms||0);}
function kwPop(){if(KWP)return KWP;const dim=document.createElement('div');dim.className='kw-dim';document.body.appendChild(dim);
  KWP=document.createElement('div');KWP.className='kw-pop';KWP.setAttribute('role','dialog');document.body.appendChild(KWP);KWP._dim=dim;
  KWP.addEventListener('mouseenter',()=>clearTimeout(KWT));
  KWP.addEventListener('mouseleave',()=>{if(!KWP.classList.contains('pin'))kwHide(220);});
  KWP.addEventListener('click',e=>{e.stopPropagation();const b=e.target.closest('[data-x]');if(!b)return;
    if(b.dataset.x==='save'&&KWP._sv){const v=KWP._sv,s0=scOf(v.sid),f0=v.f,p0=s0&&f0?s0.parts[f0.pi]:null;
      const row=v.row||(s0&&p0?(s0.subs.find(r=>r[0]>=p0.a-0.3&&r[0]<p0.b&&phNorm(r[s0.lang==='de'?4:2]).includes(phNorm(v.word)))||[f0.a,f0.b,f0.en,f0.ru,f0.de]):null);
      const on=mywToggle(v.sid,f0?f0.pi||0:(v.pi||0),v.word,row,{ru:v.ru});b.classList.toggle('on',on);b.textContent=on?'★ В моих словах':'☆ В мои слова';return;}
    if(b.dataset.x==='hear'&&KWP._sv&&KWP._sv.f){const v=KWP._sv;scClip(v.sid,v.f.id,b);return;}
    if(b.dataset.x==='word'&&KWP._sv){const v=KWP._sv,r=v.row||(v.f?[v.f.a,v.f.b]:null);if(r){sfx('tap');wordPlay(v.sid,v.say||v.word,r[0],r[1],b);}return;}
    if(b.dataset.x==='more'){sfx('tap');wpMore(KWP,!KWP.classList.contains('mo'));
      if(!KWP.classList.contains('sheet')){const r=KWP.getBoundingClientRect(),k=r.width/(parseFloat(KWP.style.width)||r.width)||1;if(r.bottom>innerHeight-12)KWP.style.top=(Math.max(12,innerHeight-12-r.height)/k)+'px';}return;}
    if(b.dataset.x==='ok')kwHide(0);});
  // 13.9.18: шторку на телефоне можно смахнуть вниз
  {let y0=null,dy=0;KWP.addEventListener('touchstart',e=>{if(!KWP.classList.contains('sheet')||KWP.scrollTop>0)return;y0=e.touches[0].clientY;dy=0;},{passive:true});
    KWP.addEventListener('touchmove',e=>{if(y0==null)return;dy=e.touches[0].clientY-y0;if(dy>0){KWP.style.transition='none';KWP.style.transform=`translateY(${dy}px)`;}},{passive:true});
    KWP.addEventListener('touchend',()=>{if(y0==null)return;y0=null;KWP.style.transition='';KWP.style.transform='';if(dy>70)kwHide(0);});}
  document.addEventListener('click',e=>{if(KWP&&KWP.classList.contains('on')&&!e.target.closest('.kw-pop,.kw,.sw'))kwHide(0);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&KWP&&KWP.classList.contains('on'))kwHide(0);});
  window.addEventListener('scroll',()=>{if(KWP&&KWP.classList.contains('on')&&!KWP.classList.contains('sheet'))kwHide(0);},{passive:true});
  return KWP;}
// показать карточку рядом со словом (ПК) или снизу экрана (телефон)
function popAt(el,html,sv,pin){const P=kwPop();clearTimeout(KWT);P._sv=sv;P._resume=null;P.classList.toggle('in-v',!!(el&&el.closest&&el.closest('.sc-v')));
  // настоящий полный экран (браузер на ПК): поверх него видно только то, что внутри — переносим карточку туда
  {const fse=document.fullscreenElement||document.webkitFullscreenElement,host=fse&&el&&fse.contains(el)?fse:document.body;if(P.parentNode!==host){host.appendChild(P._dim);host.appendChild(P);}}
  const canW=sv&&sv.sid&&(sv.row||sv.f),html0=html;
  {const L=sv&&sv.wi&&sv.sid&&sv.word&&sv.sid!=='own'?wiLang(sv.sid):null;   // 13.9.13: подробнее о слове
    if(L){const bl=wiHTML(sv.word,L,sv.w2);if(bl)html=/class="kwp-use"/.test(html)?html.replace(/(<div class="kwp-use">[\s\S]*?<\/div>)/,'$1'+bl):html.replace(/(<span class="kwp-t">[\s\S]*?<\/span>)/,'$1'+bl);
      else html=html.replace(/(<span class="kwp-t">[\s\S]*?<\/span>(?:<span class="kwp-here">[\s\S]*?<\/span>)?)/,'$1'+nwHTML(sv.word,sv.sid,sv.row));   // 13.9.51: новых слов тоже касается — уровень, форма, ещё в кино
      if(!bl&&!WI[L])wiLoad(L).then(()=>{if(KWP&&KWP._sv===sv&&KWP.classList.contains('on')&&wiGet(sv.word,L))popAt(el,html0,sv,pin);});}}
  // 13.9.16: что слово значит в этой реплике (вместо общего перевода) и выражения, куда оно входит (вместо старого «Тут это часть выражения» из пояснения)
  {const L=sv&&sv.wi&&sv.sid&&sv.word&&sv.sid!=='own'&&(sv.row||sv.f)?wiLang(sv.sid):null;
    if(L&&CX[L]){const h=cxHit(sv.sid,sv.row?{row:sv.row}:{f:sv.f},sv.word);
      if(h){const m=cxMain(h);if(m)html=html.replace(/<span class="kwp-t">[\s\S]*?<\/span>/,`<span class="kwp-t">${esc(m.t)}</span>${m.l?`<span class="kwp-here">${esc(m.l)}</span>`:''}`);
        const X=m&&m.k==='x'?h.X.slice(1):h.X;
        if(h.X.length)html=html.replace(/<div class="kwp-use">[\s\S]*?<\/div>/,'');
        if(X.length||h.g)html=html.replace(/(<span class="kwp-t">[\s\S]*?<\/span>(?:<span class="kwp-here">[\s\S]*?<\/span>)?)/,'$1'+cxXHTML(X)+cxGHTML(h));}}
    else if(L&&CX.p[L]!==null)cxLoad(L).then(d=>{if(d&&KWP&&KWP._sv===sv&&KWP.classList.contains('on'))popAt(el,html0,sv,pin);});}
  P.innerHTML=html+`<div class="kwp-b">${sv&&sv.sid&&sv.word?mywBtn(sv.sid,sv.word):''}${canW?`<button data-x="word">🔊 ${isPhr(sv.say||sv.word)?'Выражение':'Слово'}</button>`:''}${sv&&sv.f?`<button data-x="hear">▶ Фраза</button>`:''}<button data-x="ok">Понятно</button></div>`;
  P._fold=0;wpFold(P);if(ndOn())ndWpDeco(P,sv);
  $$('.kw.on,.sw.on').forEach(x=>x.classList.remove('on'));el.classList.add('on');
  const sheet=!matchMedia('(hover:hover)').matches||window.innerWidth<640;
  P.classList.toggle('sheet',sheet);P.classList.toggle('pin',!!pin||sheet);P.style.left=P.style.top='';
  const r=el.getBoundingClientRect();
  if(!sheet){const W=Math.min(340,window.innerWidth-24);P.style.width=W+'px';P.style.left=P.style.top='0px';P.classList.add('on');
    // 11.2: меряем реальный размер (у body бывает zoom) и ставим под словом или над ним — так, чтобы карточка не закрывала строку
    const b0=P.getBoundingClientRect(),k=b0.width/W||1,bw=b0.width,bh=b0.height,vw=window.innerWidth,vh=window.innerHeight;
    const spB=vh-r.bottom-10,spA=r.top-10,below=spB>=bh+12||spB>=spA;
    const X=Math.max(12,Math.min(vw-bw-12,r.left+r.width/2-bw/2)),Y=Math.max(12,Math.min(vh-bh-12,below?r.bottom+10:r.top-10-bh));
    P.style.left=(X/k)+'px';P.style.top=(Y/k)+'px';}
  else{P.classList.add('on');document.body.classList.add('kw-open');
    // 11.2: шторка снизу не должна закрывать нажатое слово — подкручиваем страницу
    const top=window.innerHeight-P.getBoundingClientRect().height;if(r.bottom>top-12&&!el.closest('.sc-pfs'))window.scrollBy({top:r.bottom-top+28,behavior:'smooth'});}
  if(ndOn()&&el&&el.closest){const sh=el.closest('.sc-sheetwrap');if(sh)sh.classList.add('under');}   // 13.9.49 (движения, п.3): окошко слова поверх окна фразы — «стопкой»: старое окно темнее
  haptic('sel');}
function kwShow(el,f,pin){const k=kwOf(f)[+el.dataset.kw];if(!k)return;popAt(el,kwCardHTML(k),{sid:f.sid||(SCUR&&SCUR.id),f,word:k[1]||k[0],say:el.textContent||k[0],ru:k[2]},pin);}
function wordShow(el,f,pin){const sid=(f&&f.sid)||(SCUR&&SCUR.id);if(!sid)return;const w=el.textContent,hit=swFind(sid,f?f.pi||0:0,w),id=f?phIdiom(f):null,inId=id&&!idWhole(id,f)&&idHit(id,w);
  const inWin=!!(el.closest&&el.closest('.kno'));   // 13.9.4: в открытой фразе словаря фраза с переводом и так крупно на экране — «Во фразе» не повторяем
  const ft=f&&f.sid&&!(SCUR&&SCUR.id===f.sid)?dxT(f):f?scT(f):'';   // 13.9.20: из словаря (не из эпизода этой сцены) — фраза на языке фильма
  const html=`<span class="kwp-k">Слово</span><b class="kwp-w">${esc(swNorm(w))}</b><span class="kwp-t">${hit?esc(hit.ru):'перевода нет в словарике'}</span>
    ${inId?`<div class="kwp-use"><em>Тут это часть выражения</em><span><b>${esc(id.head)}</b> — ${esc(id.mean)}</span></div>`:''}
    ${f&&!inWin?`<div class="kwp-ex"><em>Во фразе</em><b>${esc(ft)}</b><small>${esc(f.ru)}</small></div>`:''}`;
  popAt(el,html,{sid,f,word:swNorm(w),w2:hit&&hit.w,ru:hit?hit.ru:'',wi:1},pin);}
// подключить слова в контейнере: f — фраза или функция (элемент → фраза)
function phBind(root,getF){if(!root)return;const fOf=el=>typeof getF==='function'?getF(el):getF,hov=matchMedia('(hover:hover)').matches;
  const open=(el,pin)=>{const f=fOf(el);if(!f)return;if(el.classList.contains('kw'))kwShow(el,f,pin);else wordShow(el,f,pin);};
  root.querySelectorAll('.kw,.sw').forEach(el=>{if(el._ph)return;el._ph=1;if(el.classList.contains('demo'))return;
    // 13.6: удержание пальцем — тоже открывает (на iPhone удержание раньше включало выделение текста, и ничего не происходило)
    let lp=0,lx=0,ly=0,held=false;el.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')return;lx=e.clientX;ly=e.clientY;clearTimeout(lp);held=false;
      lp=setTimeout(()=>{lp=0;held=true;haptic('light');open(el,true);},420);});
    el.addEventListener('pointermove',e=>{if(lp&&Math.hypot(e.clientX-lx,e.clientY-ly)>14){clearTimeout(lp);lp=0;}});
    el.addEventListener('pointerup',()=>{clearTimeout(lp);lp=0;if(held){held=false;   // клик после удержания попал бы в затемнение и закрыл карточку
      const k=ev=>{ev.stopPropagation();ev.preventDefault();};window.addEventListener('click',k,{capture:true,once:true});setTimeout(()=>window.removeEventListener('click',k,true),500);}});
    el.addEventListener('pointercancel',()=>{clearTimeout(lp);lp=0;held=false;});
    el.addEventListener('contextmenu',e=>e.preventDefault());
    el.addEventListener('click',e=>{e.stopPropagation();e.preventDefault();open(el,true);});
    el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(el,true);}});
    if(hov){el.addEventListener('mouseenter',()=>{if(!(KWP&&KWP.classList.contains('pin')&&KWP.classList.contains('on')))open(el,false);});
      el.addEventListener('mouseleave',()=>{if(KWP&&!KWP.classList.contains('pin'))kwHide(260);});}});}
const kwBind=phBind;
// блоки «Когда пригодится» и «Интересный факт»
function phInfoHTML(f,o){o=o||{};const use=scNoteS(f),de=scL()==='de'&&!scIsDe();
  const ex=de?(f.exDe&&f.exDe[0]?[f.exDe[0][0],f.exDe[0][1]]:null):(f.lx&&f.lx[0]?f.lx:(f.ex&&f.ex[0]?[f.ex[0][0],f.ex[0][1]]:null));
  const fact=o.fact&&f.fact&&!de;   // 12.0: факты — награда за финал эпизода, по ходу не показываем
  return `${use?`<div class="ph-blk ph-use"><em>Когда пригодится</em><p>${esc(use)}</p>${o.noEx||!ex?'':`<div class="ph-ex"><span>Например</span><b>${esc(ex[0])}</b><small>${esc(ex[1]||'')}</small></div>`}</div>`:''}
    ${fact?`<div class="ph-blk ph-fact"><em>Интересный факт</em><p>${esc(f.fact)}</p></div>`:''}`;}
// 13.6: слова в субтитрах на iPhone — нажатие И удержание. Было: удержание включало выделение текста iOS (клика нет),
// строка субтитров менялась под пальцем (клик терялся или ставил видео на паузу), мелкие слова («I», «a») — мимо пальца.
// Теперь слово запоминаем при касании, строка на это время не меняется, открываем при отпускании или через 0.4 с удержания;
// касание по строке мимо слова — ближайшее слово. Мышь (ПК) — обычный клик и наведение, как было.
function swTouch(SW){let T=null;
  const near=(ln,x,y)=>{let best=null,bd=1e9;ln.querySelectorAll('.sw').forEach(w=>{const r=w.getBoundingClientRect(),dx=Math.max(r.left-x,0,x-r.right),dy=Math.max(r.top-y,0,y-r.bottom),d=dx*dx+dy*dy*3;if(d<bd){bd=d;best=w;}});return bd<=30*30?best:null;};
  const pick=e=>{const t=e.target;if(!t||!t.closest)return null;const w=t.closest('.sc-subs .sw');if(w)return w;const ln=t.closest('.sc-subs .sline');return ln&&!ln.classList.contains('s2')?near(ln,e.clientX,e.clientY):null;};
  const end=()=>{if(T){clearTimeout(T.h);T=null;}SW._subHold=false;};
  const open=(w,word,row,inPh)=>{const tp=SW.querySelector('.sc-wtip');if(tp)tp.classList.remove('on');
    swPop(word,row,inPh,w&&w.isConnected?w:(SW.querySelector('.sc-subs .sline')||SW));};
  // клик, который браузер пришлёт после отпускания пальца, попал бы уже в открытую карточку/затемнение и закрыл её — съедаем
  const eatClick=()=>{const k=e=>{e.stopPropagation();e.preventDefault();};window.addEventListener('click',k,{capture:true,once:true});setTimeout(()=>window.removeEventListener('click',k,true),500);};
  SW.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')return;const w=pick(e);if(!w)return;end();
    T={w,word:w.textContent,row:SW._row,inPh:w.classList.contains('in-ph'),x:e.clientX,y:e.clientY,on:false};SW._subHold=true;w.classList.add('on');
    T.h=setTimeout(()=>{if(T&&!T.on){T.on=true;haptic('light');open(T.w,T.word,T.row,T.inPh);}},400);},true);   // удержание
  SW.addEventListener('pointermove',e=>{if(T&&!T.on&&Math.hypot(e.clientX-T.x,e.clientY-T.y)>16){T.w.classList.remove('on');end();}},true);
  SW.addEventListener('pointerup',e=>{if(!T)return;e.stopPropagation();eatClick();const x=T;end();if(!x.on)open(x.w,x.word,x.row,x.inPh);},true);   // нажатие
  SW.addEventListener('pointercancel',()=>{if(T){if(!T.on)T.w.classList.remove('on');end();}},true);
  SW.addEventListener('contextmenu',e=>{if(e.target.closest&&e.target.closest('.sc-subs'))e.preventDefault();},true);
  SW.addEventListener('click',e=>{const w=pick(e);if(!w)return;e.stopPropagation();e.preventDefault();open(w,w.textContent,SW._row,w.classList.contains('in-ph'));},true);}   // мышь, клавиатура
// подсказка при наведении мышкой (ПК): без паузы, рядом со словом
function swTipHide(){const tp=SW&&SW.querySelector('.sc-wtip');if(tp){tp.classList.remove('on');tp._el=null;}}
// 13.9.35 (скрин Андрея: подсказка от прошлой строки висела и вылезала за низ видео): строка 1 — «слово — значение тут», строка 2 — выражение; остальное — по клику
function swTip(el){if(!SW)return;let tip=SW.querySelector('.sc-wtip');if(!tip){tip=document.createElement('div');tip.className='sc-wtip';SW.appendChild(tip);}
  const s=scOf(SCUR.id),hit=swFind(s.id,SCUR.i||0,el.textContent),f=el.classList.contains('in-ph')?SW._rowPh:null;
  const id=f?phIdOf(f):null,w=esc(swNorm(el.textContent));
  const cx=SW._row&&CX[wiLang(s.id)]?cxHit(s.id,{row:SW._row},el.textContent):null,m=cxMain(cx);   // 13.9.16: значение в этой реплике
  const x=cx&&cx.X.length?(m&&m.k==='x'?cx.X[1]:cx.X[0]):null;
  tip.innerHTML=m?`<b>${w}</b> — ${esc(m.t)}${m.k==='x'?`<span>в выражении «${esc(cx.X[0][0])}»</span>`:x?`<span>часть выражения «${esc(x[0])}» — ${esc(x[1])}</span>`:''}`
    :`<b>${w}</b>${hit?` — ${esc(hit.ru)}`:''}${id?`<span>часть выражения «${esc(id.head)}» — ${esc(id.mean)}</span>`:(!hit?'<span>нажми — покажу перевод реплики</span>':'')}`;
  tip._el=el;tip.classList.remove('dn');tip.style.left='0px';tip.style.top='0px';   // сначала вписать содержимое, потом мерить
  const r=el.getBoundingClientRect(),V=SW.getBoundingClientRect(),z=parseFloat(getComputedStyle(document.body).zoom)||1,tw=tip.offsetWidth,th=tip.offsetHeight;
  const L=(r.left-V.left)/z,T=(r.top-V.top)/z,B=(r.bottom-V.top)/z,W=V.width/z,H=V.height/z;
  let x0=L+r.width/z/2-tw/2;x0=Math.max(6,Math.min(W-tw-6,x0));let y0=T-th-8;if(y0<6){y0=B+8;tip.classList.add('dn');}y0=Math.max(6,Math.min(H-th-6,y0));
  tip.style.left=x0+'px';tip.style.top=y0+'px';tip.classList.add('on');}
function linePop(el,row){const s=scOf(SCUR.id),pi=SCUR.i||0,word=el.textContent,hit=swFind(s.id,pi,word);
  let f=null;for(const p of s.parts)for(const x of p.ph){const id=phIdiom(x);if(id&&phNorm(row[2]).includes(phNorm(x.en))&&idHit(id,word))f=x;}
  const o=document.querySelector('.ln-pop');if(o)o.remove();const w=document.createElement('div');w.className='ln-pop';
  const cx=CX[wiLang(s.id)]?cxHit(s.id,{row},word):null;   // 13.9.16
  w.innerHTML=`<div class="lp-card">${hit&&hit.key?'<span class="k">★ слово эпизода</span>':''}<b>${esc(swNorm(word))}</b>${cxMain(cx)?`<span class="t">${esc(cxMain(cx).t)}</span>${cxMain(cx).l?`<small class="kwp-here">${esc(cxMain(cx).l)}</small>`:''}`:hit?`<span class="t">${esc(hit.ru)}</span>${hit.de?`<small>по-немецки: ${esc(hit.de)}</small>`:''}`:(f?'':`<small class="wp-keep">Нет в словарике. Вся реплика: ${esc(row[3])}</small>`)}${cx&&cx.X.length?cxXHTML(cx.X):f?phBlock(f):''}
    <div class="hn-b"><button data-x="word">🔊 Слово</button><button data-x="hear">▶ Реплика</button>${mywBtn(s.id,word)}<button data-x="ok">Понятно</button></div></div>`;
  wpFold(w.querySelector('.lp-card'));
  w.onclick=e=>{const b=e.target.closest('[data-x]');if(e.target===w||(b&&b.dataset.x==='ok')){w.remove();return;}
    if(b&&b.dataset.x==='more'){sfx('tap');const c=w.querySelector('.lp-card');wpMore(c,!c.classList.contains('mo'));return;}
    if(b&&b.dataset.x==='save'){const on=mywToggle(s.id,pi,word,row,hit);b.classList.toggle('on',on);b.textContent=on?'★ В моих словах':'☆ В мои слова';return;}
    if(b&&b.dataset.x==='word'){sfx('tap');wordPlay(s.id,word,row[0],row[1],b);return;}
    if(b&&b.dataset.x==='hear'){const p=s.parts[pi];w.remove();window.scrollTo({top:0,behavior:'smooth'});const ov=$('#scvo');if(ov)ov.style.display='none';scPlay(row[0]-p.a-0.1,row[1]-p.a+0.2,()=>{if(ov)ov.style.display='';});}};
  document.body.appendChild(w);haptic('sel');}
function lineWords(s,p){const rows=s.subs.filter(r=>r[0]>=p.a-0.3&&r[0]<p.b);
  $$('.sc-lines .ln').forEach(ln=>{const row=rows[+ln.dataset.k];if(!row)return;
    ln.onclick=e=>{const w=e.target.closest('.sw');if(!w)return;linePop(w,row);};
    if(matchMedia('(hover:hover)').matches)ln.onmouseover=e=>{const w=e.target.closest('.sw');if(!w)return;const hit=swFind(s.id,SCUR.i||0,w.textContent);
      let tip=document.querySelector('.ln-tip');if(!tip){tip=document.createElement('div');tip.className='ln-tip';document.body.appendChild(tip);}
      tip.innerHTML=`<b>${esc(swNorm(w.textContent))}</b>${hit?` — ${esc(hit.ru)}`:' — нажми, покажу'}`;const r=w.getBoundingClientRect();tip.style.left=Math.max(6,r.left)+'px';tip.style.top=Math.max(6,r.top-36)+'px';tip.classList.add('on');
      w.onmouseleave=()=>tip.classList.remove('on');};});}
// кусок эпизода звуком (для «какое слово прозвучало»)
// 13.6: «🔊 Слово» — играет само слово, а не всю реплику. Время каждого слова — scenes/<id>/wt.json (распознано по эпизодам);
// выражение из нескольких слов — от первого до последнего. Нет файла или слово не нашлось — голос устройства.
const WT={};
function wtLoad(sid){if(!WT[sid]){const s=scOf(sid),load=k=>fetch(k).then(r=>r.ok?r.json():null).then(d=>d&&d.w||null).catch(()=>null);
  WT[sid]=s?load(assetUrl(scKey(s,'wt.json'))):Promise.resolve(null);}return WT[sid];}   // 13.9.60: WT_LOCAL убран вместе с хвостами удалённой TLOU (13.9.55)
const wtN=w=>String(w||'').toLowerCase().replace(/[’`]/g,"'").replace(/[^a-zß-öø-ÿ0-9']/g,'');
const wtEq=(x,y)=>x===y||x.replace(/'s$/,'')===y.replace(/'s$/,'')||(Math.min(x.length,y.length)>=4&&(x.startsWith(y)||y.startsWith(x))&&Math.abs(x.length-y.length)<=3);
async function wordPlay(sid,say,a,b,btn){const s=scOf(sid);if(!s)return false;const T=String(say||'').split(/\s+/).map(wtN).filter(Boolean);if(!T.length)return false;
  if(btn)btn.classList.add('on');const W=await wtLoad(sid);let hit=null;
  if(W){const C=W.filter(w=>w[0]>=a-0.8&&w[0]<=b+0.8);
    for(let k=0;k<C.length&&!hit;k++){if(!wtEq(C[k][2],T[0]))continue;if(T.length===1){hit=[C[k][0],C[k][1]];break;}
      for(let j=k+1;j<Math.min(C.length,k+T.length+3);j++)if(wtEq(C[j][2],T[T.length-1])){hit=[C[k][0],C[j][1]];break;}}}
  if(hit){const pi=s.parts.findIndex(p=>hit[0]>=p.a-0.05&&hit[0]<p.b+0.05);
    if(pi>=0){const p=s.parts[pi];playSeg(assetUrl(scEpKey(s,pi,'mp4')),Math.max(0,hit[0]-p.a-0.07),hit[1]-p.a+0.12,btn);return true;}}
  if(btn)setTimeout(()=>btn.classList.remove('on'),900);
  try{const u=new SpeechSynthesisUtterance(say);u.lang=s.lang==='de'?'de-DE':'en-US';u.rate=.9;speechSynthesis.cancel();speechSynthesis.speak(u);}catch(e){}
  return false;}
function playSeg(src,a,b,btn){if(!SCLIP){SCLIP=document.createElement('video');SCLIP.playsInline=true;SCLIP.setAttribute('playsinline','');SCLIP.preload='auto';SCLIP.style.display='none';document.body.appendChild(SCLIP);}
  clearInterval(SCLIP._t);if(btn)btn.classList.add('on');if(SCLIP.dataset.src!==src){SCLIP.src=src;SCLIP.dataset.src=src;}
  const go=()=>{try{SCLIP.currentTime=Math.max(0,a);}catch(e){}const pr=SCLIP.play();if(pr&&pr.catch)pr.catch(()=>{});SCLIP._t=setInterval(()=>{if(SCLIP.currentTime>=b||SCLIP.ended){SCLIP.pause();clearInterval(SCLIP._t);if(btn)btn.classList.remove('on');}},40);};
  if(SCLIP.readyState>=1)go();else{SCLIP.addEventListener('loadedmetadata',go,{once:true});SCLIP.load();}}
/* ================= 8.3: «Мои слова» — сохраняй незнакомые слова прямо из субтитров ================= */
// Нажал на слово → «⭐ В мои слова». Потом — список с контекстом (реплика, момент в фильме) и тренировка «пары / что значит».
const mywKey=(sid,w)=>sid+'|'+w;
// 12.1: удалённое слово помечаем, чтобы синк с другим устройством его не вернул
function mywDel(k){if(!store.myw)return;delete store.myw[k];store.mywDel=store.mywDel||{};store.mywDel[k]=Date.now();}
const mywAll=()=>Object.values(store.myw||{}).sort((a,b)=>b.at-a.at);
const mywHas=(sid,w)=>!!(store.myw&&store.myw[mywKey(sid,swNorm(w))]);
function mywToggle(sid,pi,word,row,hit){store.myw=store.myw||{};const w=swNorm(word),k=mywKey(sid,w);
  if(store.myw[k]){mywDel(k);save();toast('Убрал из «Моих слов»');return false;}
  if(premNeed('myw')&&Object.keys(store.myw).length>=MYW_FREE){premAsk('myw');return false;}   // 13.9.30
  const s=scOf(sid),p=s&&s.parts[pi];store.myw[k]={k,w,ru:hit?hit.ru:'',de:hit&&hit.de||'',sid,pi,line:row?row[2]:'',lineRu:row?row[3]:'',a:row&&p?row[0]:0,at:Date.now(),lvl:0,st:0,due:Date.now()+36e5};
  {const it=store.myw[k],h=mywHere(it);if(h&&h!==it.ru){it.gl=it.ru;it.ru=h;}}   // 13.9.38: в «Моих словах» — что слово значит в своей реплике
  save();toast('⭐ Сохранил в «Мои слова»');haptic('ok');return true;}
const mywBtn=(sid,w)=>`<button data-x="save" class="myw-save${mywHas(sid,w)?' on':''}">${mywHas(sid,w)?'★ В моих словах':'☆ В мои слова'}</button>`;
// 13.3: ложные варианты «что значит слово» — той же части речи и длины, сначала из той же сцены (а не «гора Эверест» к «клиентам»)
function ruShape(v){v=String(v||'').toLowerCase().replace(/\(.*?\)/g,'').replace(/[.,!?…;:«»"]/g,'').trim();const n=v.split(/\s+/).filter(Boolean).length;
  if(n>=2)return 'p'+Math.min(n,4);if(/([аяеиоуыюё]ть|ться|тись|чь|чься|сти|зти|йти)$/.test(v))return 'v';if(/(ый|ий|ой|ая|яя|ое|ее|ые|ие|ого|его)$/.test(v))return 'a';
  if(v.length>=5&&/о$/.test(v))return 'o';return 'n';}
function distLike(right,pools,n){const R=String(right||''),rs=ruShape(R),rl=R.length,seen=new Set([R.toLowerCase()]),C=[];
  pools.forEach((P,k)=>(P||[]).forEach(v=>{v=String(v||'').trim();const lv=v.toLowerCase();if(!v||seen.has(lv)||/груб|мат\b/.test(lv))return;
    const rl0=R.toLowerCase();if(lv.includes(rl0)||rl0.includes(lv)||(rl0.length>=5&&lv.slice(0,4)===rl0.slice(0,4)))return;seen.add(lv);   // однокоренное — почти синоним, не ловушка
    const cl=x=>x.replace(/\(.*?\)/g,'').trim(),sh=ruShape(v),ratio=cl(v).length/Math.max(1,cl(R).length);if(cl(v).length<3&&cl(R).length>=4)return;const e1=lv.slice(-1)===rl0.slice(-1),e2=lv.slice(-2)===rl0.slice(-2);
    C.push({v,sc:(sh===rs?4:sh[0]===rs[0]?1.5:0)+(e2?1:e1?.5:0)+(ratio>.55&&ratio<1.8?1:ratio<.4||ratio>2.5?-2:0)+(pools.length-k)*0.8+Math.random()*1.2});}));
  return C.sort((a,b)=>b.sc-a.sc).slice(0,n).map(x=>x.v);}
// 13.6: после верного ответа — само дальше: полоска заполняет кнопку; тронул карточку или слово — ждёт, пока сам нажмёшь
const autoOn=()=>store.autoSc!==false;
const typeOn=()=>store.typeIn===true;   // 13.9.16 (Андрей: «убрать задания с письменным»): по умолчанию — только кнопки и кубики; печатать — настройкой «Писать самому»   // 13.6: «само дальше» по умолчанию включено (старый store.auto был выключен у всех)
// 13.9.11: ответ в проверке — докручиваем, чтобы начало ответа было видно; «Дальше» прилипает к низу экрана (sc-nx-stick в CSS)
function scShowFb(fb){if(!fb)return;requestAnimationFrame(()=>{const r=fb.getBoundingClientRect(),h=innerHeight;if(r.top>h*0.55)window.scrollBy({top:r.top-h*0.3,behavior:fxOK()?'smooth':'auto'});});}
function autoNext(btn,root,ms){if(!btn||!autoOn())return null;let t=0;const stop=()=>{clearTimeout(t);btn.classList.remove('auto');};
  btn.style.setProperty('--ms',ms+'ms');btn.classList.add('auto');t=setTimeout(()=>{if(btn.isConnected&&btn.classList.contains('auto'))btn.click();},ms);
  (root||btn.parentNode).addEventListener('pointerdown',e=>{if(!btn.contains(e.target))stop();},{capture:true});return stop;}
const SC_HINT=5;   // 13.6: «💡 Подсказка» в задании на слух — 5 билетов (ошибка даёт подсказку бесплатно)
// 13.6: слово или выражение — по пробелу («any messages», «hit a nerve» — выражения, а не слова)
const isPhr=w=>/\s/.test(String(w||'').trim());
// ложные варианты к выражению — только выражения (переводы фраз и многословных важных слов), без перевода самой реплики
function phDist(right,sid,excl,n){const ex=(excl||[]).map(x=>String(x||'').toLowerCase()).filter(Boolean),P0=[],P1=[];
  SCENES.forEach(z=>z.parts.forEach(pp=>pp.ph.forEach(f=>{const L=z.id===sid?P0:P1;(f.kw||[]).forEach(k=>{if(isPhr(k[1]||k[0])&&k[2])L.push(String(k[2]).replace(/\s*\(.*?\)\s*/g,' ').trim());});
    if(!f.passive&&f.ru&&f.ru.split(/\s+/).length<=6)L.push(f.ru);})));
  const ok=v=>{const lv=String(v).toLowerCase().replace(/[.!?…]+$/,'');return isPhr(v)&&lv.length>3&&!ex.some(e=>e.includes(lv)||lv.includes(e));};
  return distLike(right,[P0.filter(ok),P1.filter(ok),mywAll().map(x=>x.ru).filter(ok)],n);}
const swPool=(sid,pi)=>{const d=swData(sid,pi);if(!d)return [];return [...d.key.map(k=>k[1]),...Object.values(d.gloss||{})];};
const scPoolW=sid=>{const s=scOf(sid);return s?s.parts.flatMap((_,i)=>swPool(sid,i)):[];};
// 13.9.5: 4 варианта перевода к моему слову — выражение среди выражений, слово среди похожих слов той же сцены
// (общий для «Проверить себя» и для повторения: там вместо самопроверки «Знал / Не знал» теперь выбор)
// 13.9.38 (Андрей: «дичь с заданиями» — у «class» два верных: «класс; занятие» и «занятие, тренировка (групповая)»):
// ответ — что слово значит в своей реплике (ctx, cxMain), коротко; варианты — значения «тут» других слов той же сцены,
// без любых значений этого же слова и без вариантов с общим словом (занятие ≈ занятие)
const ruShort=(v,ph)=>{let x=String(v||'').replace(/\(.*?\)|\[.*?\]/g,' ').split(/[;\/]/)[0];if(!ph&&x.includes(','))x=x.split(',')[0];return x.replace(/\s+/g,' ').replace(/^[\s,.—–-]+|[\s,—–-]+$/g,'').trim();};
const ruStems=v=>String(v||'').toLowerCase().replace(/ё/g,'е').split(/[^а-яa-z]+/).filter(t=>t.length>=4).map(t=>t.slice(0,Math.max(4,t.length-2)));
function mywRow(it){const s=scOf(it.sid);if(!s||!it.a)return null;return (s.subs||[]).find(z=>Math.abs(z[0]-it.a)<0.06)||null;}
function mywHere(it){if(!it)return '';const s=scOf(it.sid),ph=isPhr(it.w);
  if(s&&!ph&&CX[wiLang(s.id)]){const r=mywRow(it),h=r?cxHit(s.id,{row:r},it.w):it.a?cxHit(s.id,{f:{a:it.a,b:it.a+0.3}},it.w):null,m=cxMain(h);
    if(m&&(m.k==='here'||m.k==='x')&&m.t&&m.t!=='—'){const v=ruShort(m.t);if(v)return v;}}
  return ruShort(it.ru,ph)||String(it.ru||'');}
function mywOwn(it){const w=swNorm(it.w),O=new Set(),add=v=>{const x=ruShort(v).toLowerCase();if(x)O.add(x);String(v||'').split(/[;,\/]/).forEach(y=>{y=ruShort(y).toLowerCase();if(y)O.add(y);});};
  add(it.ru);add(GLOSS[w]);if(typeof GLOSS_DE!=='undefined')add(GLOSS_DE[w]);mywAll().forEach(x=>{if(swNorm(x.w)===w)add(x.ru);});
  const s=scOf(it.sid);if(s)s.parts.forEach((_,i)=>{const d=swData(s.id,i);if(!d)return;d.key.forEach(k=>{if(k[0]===w||(k[3]||[]).includes(w))add(k[1]);});if(d.gloss&&d.gloss[w])add(d.gloss[w]);});
  const A=s&&CX[wiLang(s.id)]&&CX[wiLang(s.id)][s.id];if(A)A.forEach(e=>{if(e&&e[1]&&e[1][w])add(e[1][w]);});return O;}
function mywOpts(k){const right=mywHere(k);if(isPhr(k.w))return shuffle([right,...phDist(right,k.sid,[k.lineRu],3).map(v=>ruShort(v,true))]);
  const w=swNorm(k.w),own=mywOwn(k),st=new Set([...ruStems(right),...[...own].flatMap(ruStems)]),s=scOf(k.sid);
  const nm=/^[А-ЯЁ]/.test(right);   // имя — среди имён, слово — среди слов (не «Спенсер» к «загару»)
  const ok=v=>{const lv=String(v||'').toLowerCase();return v&&v!=='—'&&!own.has(lv)&&lv!==right.toLowerCase()&&!/[;()\/]/.test(v)&&/^[А-ЯЁ]/.test(v)===nm&&!ruStems(v).some(t=>st.has(t));};
  const A=s&&CX[wiLang(s.id)]&&CX[wiLang(s.id)][s.id],P0=[];if(A)A.forEach(e=>{if(e&&e[1])for(const [x,v] of Object.entries(e[1]))if(x!==w&&v&&v!=='—')P0.push(ruShort(v));});
  const P1=mywAll().filter(x=>swNorm(x.w)!==w&&!isPhr(x.w)).map(mywHere),P2=[...swPool(k.sid,k.pi),...scPoolW(k.sid)].map(v=>ruShort(v)),P3=shuffle(Object.values(GLOSS)).slice(0,400).map(v=>ruShort(v));
  const D=distLike(right,[P0,P1,P2,P3].map(P=>[...new Set(P)].filter(ok)),3);
  return shuffle([right,...D.filter((v,i)=>{const t=ruStems(v);return !t.length||D.findIndex(z=>ruStems(z).some(x=>t.includes(x)))===i;})]);}
// подгрузить значения «тут» до заданий со словами (renderDaily / renderMyWordsQuiz): без них ответ был бы из словарика
function mywCx(L,go){const need=[...new Set((L||[]).map(x=>x&&x.sid).filter(Boolean).map(wiLang))].filter(l=>!CX[l]);if(!need.length)return false;
  Promise.all(need.map(l=>cxLoad(l).catch(()=>null))).then(go,go);return true;}
// 13.9.69 (П8, Андрей: «по системе TikTok — заданий не больше трёх»): повторение, «Мои слова», финал сцены и дуэль — по 3 за раз, дальше «Ещё 3?»
const SC_PORT=3;
function renderMyWordsQuiz(list,back,pool){const bk=back||renderMyWords,P0=pool||shuffle((list||mywAll()).filter(x=>x.ru)),K=P0.slice(0,SC_PORT),REST=P0.slice(SC_PORT);if(!K.length){toast('Нет слов с переводом');bk();return;}
  if(!renderMyWordsQuiz._cx&&mywCx(K,()=>{renderMyWordsQuiz._cx=1;try{renderMyWordsQuiz(list,back,P0);}finally{renderMyWordsQuiz._cx=0;}}))return;   // 13.9.38
  K.forEach(k=>{k._r=mywHere(k);});   // 13.8.7: back — куда вернуться (новый словарь — в ту же подборку)
  const Q=[...(K.length>=4?[{t:'pairs',set:K.slice(0,4)}]:[]),...K.map(k=>({t:'mean',k})),...(K.length>=8?[{t:'pairs',set:K.slice(4,8)}]:[])];let n=0,ok=0;
  // 11.5: ложные варианты — из моих слов, а если их мало — из общего словаря
  const opts=mywOpts;
  const next=()=>{n++;n>=Q.length?end():show();};
  function show(){const q=Q[n],seg=Q.map((_,j)=>`<i class="${j<n?'done':j===n?'cur':''}"></i>`).join('');let body='';
    if(q.t==='pairs')body=`<div class="sc-meta">Соедини пары</div><h2>${q.set.some(k=>isPhr(k.w))?'Слово или фраза → перевод':'Слово → перевод'}</h2><div class="sw-pairs"><div>${shuffle(q.set).map(k=>`<button data-l="${esc(k.k)}">${esc(k.w)}</button>`).join('')}</div><div>${shuffle(q.set).map(k=>`<button data-r="${esc(k.k)}">${esc(k._r)}</button>`).join('')}</div></div>`;
    else body=`<div class="sc-meta">${isPhr(q.k.w)?'Что значит фраза?':'Что значит слово?'}</div><h2>${esc(q.k.w)}${q.k.line?`<br><small class="qsm">${esc(q.k.line)}</small>`:''}</h2><div class="sc-opts">${opts(q.k).map(v=>`<button class="sc-opt" data-v="${esc(v)}">${esc(v)}</button>`).join('')}</div>`;
    mount(`<div class="scn noir"><div class="sc-head"><button class="icon-btn" id="mqx" aria-label="Закрыть">${ui('close')}</button><div class="sc-segs">${seg}</div></div><div class="sc-q sc-card">${body}<div id="mqfb"></div></div></div>`,'scnscr');
    $('#mqx').onclick=()=>{sfx('tap');bk();};
    if(q.t==='pairs'){let sel=null,left=q.set.length;$$('.sw-pairs [data-l]').forEach(b=>b.onclick=()=>{$$('.sw-pairs [data-l]').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');sel=b;sfx('tap');});
      $$('.sw-pairs [data-r]').forEach(b=>b.onclick=()=>{if(!sel)return;const good=b.dataset.r===sel.dataset.l;
        if(good){sfx('good');sel.classList.add('ok');b.classList.add('ok');sel.disabled=b.disabled=true;sel=null;if(--left===0){ok++;setTimeout(next,450);}}else{sfx('bad');b.classList.add('bad');setTimeout(()=>b.classList.remove('bad'),400);}});}
    else $$('.sc-opt').forEach(b=>b.onclick=()=>{const good=b.dataset.v===q.k._r;if(good)ok++;lvRate(good,wlvText(q.k.w,wiLang(q.k.sid)),'mean');sfx(good?'good':'bad');const it=store.myw[q.k.k];if(it){wSRS(it,good);save();}
      $$('.sc-opt').forEach(x=>{x.disabled=true;if(x.dataset.v===q.k._r)x.classList.add('ok');});if(!good)b.classList.add('bad');
      $('#mqfb').innerHTML=`<div class="sc-fb ${good?'ok':'bad'}"><div class="t">${good?'Верно':'Неверно'}</div><div class="en">${esc(q.k.w)} — ${esc(q.k._r)}</div>${q.k.lineRu?`<div class="orig">${esc(q.k.lineRu)}</div>`:''}<button class="sc-btn" id="mqn">Дальше →</button></div>`;$('#mqn').onclick=()=>{sfx('tap');next();};if(good)autoNext($('#mqn'),$('#mqfb'),2600);});}
  function end(){sfx(ok===Q.length?'win':'learn');const more=REST.length;mount(`<div class="scn noir"><div class="sc-q sc-card sc-result" style="text-align:center"><div class="sc-meta">Мои слова</div><div class="sc-big">${ok} / ${Q.length}</div>
      <p class="sc-sub">${ok===Q.length?'Все верно. Сохраняй новые слова прямо из фильмов.':'Ошибки — нормально: повтори ещё раз через пару часов.'}${more?` Ещё ${more} ${plural(more,['слово','слова','слов'])} — по три за раз.`:''}</p><div class="sc-btns">${more?`<button class="sc-btn" id="mqm">Ещё ${Math.min(SC_PORT,more)} →</button><button class="sc-btn ghost" id="mqb">Хватит</button>`:`<button class="sc-btn" id="mqa">Ещё раз</button><button class="sc-btn ghost" id="mqb">К моим словам</button>`}</div></div></div>`,'scnscr');
    if($('#mqm'))$('#mqm').onclick=()=>{sfx('tap');renderMyWordsQuiz(list,back,REST);};if($('#mqa'))$('#mqa').onclick=()=>renderMyWordsQuiz(list,back);$('#mqb').onclick=()=>bk();}
  show();}
/* =====================================================================================
   8.5 — ЯДРО ОБУЧЕНИЯ: одна ежедневная очередь + диктант по репликам из фильма
   Всё, что пора повторить (фразы из сцен и «Мои слова»), — в одном месте, по 10 минут в день.
   Главное задание — ВСПОМНИТЬ, а не узнать: диктант (послушай и напиши), кубики (собери фразу по переводу), слово — выбор из 4.
   13.9.5: самопроверок «Вспомнил / Не вспомнил» и «Знал / Не знал» больше нет (Андрей: «конченое задание, замени на привычные кубики»).
   ===================================================================================== */
const MYW_DAYS=[1,3,7,21,60];
const dayMs=864e5;
function dailyItems(){const now=Date.now(),ph=[],wd=[];
  for(const s of SCENES){if(s.kind==='clip'||flagOf('scene-'+s.id)!=='on')continue;const P=scP(s.id);
    for(const p of s.parts)for(const f of p.ph){if(f.passive)continue;const r=P.r[f.id];if(r&&r[1]<=now)ph.push({k:'ph',s,f,due:r[1]});}}
  for(const it of mywAll()){if(!it.ru)continue;if(!it.due||it.due<=now)wd.push({k:'w',it,due:it.due||0});}
  ph.sort((a,b)=>a.due-b.due);wd.sort((a,b)=>a.due-b.due);
  const A=ph.slice(0,10),B=wd.slice(0,10),out=[];while(A.length||B.length){if(A.length)out.push(A.shift());if(B.length)out.push(B.shift());}
  return out;}
// нормализация для диктанта: регистр, пунктуация, кавычки, частые сокращения не важны
const dNorm=s=>String(s||'').toLowerCase().replace(/ß/g,'ss').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/[’`´]/g,"'").replace(/\b(gonna)\b/g,'going to').replace(/\b(wanna)\b/g,'want to').replace(/\b(gotta)\b/g,'got to')
  .replace(/\bi'm\b/g,'i am').replace(/\byou're\b/g,'you are').replace(/\bwe're\b/g,'we are').replace(/\bthey're\b/g,'they are').replace(/\bit's\b/g,'it is').replace(/\bthat's\b/g,'that is')
  .replace(/\bdon't\b/g,'do not').replace(/\bdoesn't\b/g,'does not').replace(/\bdidn't\b/g,'did not').replace(/\bcan't\b/g,'cannot').replace(/\bwon't\b/g,'will not').replace(/\bisn't\b/g,'is not')
  .replace(/\bi've\b/g,'i have').replace(/\bi'll\b/g,'i will').replace(/\bi'd\b/g,'i would').replace(/\blet's\b/g,'let us').replace(/n'(\s|$)/g,'ng$1')
  .replace(/[^a-zäöüß0-9' ]+/g,' ').replace(/'/g,'').replace(/\s+/g,' ').trim();
function lev(a,b){if(a===b)return 0;const m=a.length,n=b.length;if(!m||!n)return m||n;let prev=Array.from({length:n+1},(_,j)=>j);
  for(let i=1;i<=m;i++){const cur=[i];for(let j=1;j<=n;j++)cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));prev=cur;}return prev[n];}
// сравнение по словам: какие слова услышал верно (опечатка в длинном слове прощается)
function dCheck(typed,target){const A=dNorm(typed).split(' ').filter(Boolean),B=dNorm(target).split(' ').filter(Boolean);
  const m=A.length,n=B.length,D=Array.from({length:m+1},()=>Array(n+1).fill(0));
  const eq=(x,y)=>x===y||(y.length>=4&&lev(x,y)<=1)||(y.length>=8&&lev(x,y)<=2);
  for(let i=0;i<=m;i++)D[i][0]=i;for(let j=0;j<=n;j++)D[0][j]=j;
  for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)D[i][j]=Math.min(D[i-1][j]+1,D[i][j-1]+1,D[i-1][j-1]+(eq(A[i-1],B[j-1])?0:1));
  let i=m,j=n;const okB=Array(n).fill(false);
  while(i>0&&j>0){if(eq(A[i-1],B[j-1])&&D[i][j]===D[i-1][j-1]){okB[j-1]=true;i--;j--;}else if(D[i][j]===D[i-1][j-1]+1){i--;j--;}else if(D[i][j]===D[i-1][j]+1)i--;else j--;}
  const good=okB.filter(Boolean).length;return {score:n?good/n:0,okB,words:B};}
// разметка правильного текста: услышанные слова — зелёные, пропущенные — подчёркнуты
function dDiffHTML(target,okB){const toks=String(target).split(/\s+/);let k=0;
  return toks.map(t=>{const nm=dNorm(t).split(' ').filter(Boolean).length;if(!nm)return esc(t);const ok=okB.slice(k,k+nm).every(Boolean);k+=nm;return `<span class="${ok?'d-ok':'d-miss'}">${esc(t)}</span>`;}).join(' ');}
function phSRS(s,f,good){const P=scP(s.id),now=Date.now(),prev=P.r[f.id]||[0,0];
  if(good){const st=prev[0]+1;if(st>=SC_DAYS.length){delete P.r[f.id];P.rDone=P.rDone||{};P.rDone[f.id]=1;}else P.r[f.id]=[st,now+SC_DAYS[st]*dayMs];P.m[f.id]=3;}
  else P.r[f.id]=[Math.max(0,prev[0]-1),now+dayMs];scSave();}
function wSRS(it,good){const now=Date.now();it.st=it.st||0;if(good){it.st=Math.min(MYW_DAYS.length,it.st+1);it.due=now+MYW_DAYS[Math.min(it.st,MYW_DAYS.length)-1]*dayMs;it.lvl=Math.min(5,(it.lvl||0)+1);}
  else{it.st=0;it.due=now+dayMs;it.lvl=0;}save();}
// 13.8.7: renderDaily(list,o) — тренировка по подборке нового словаря: свой список, o.back — куда вернуться, o.title — подпись итога,
// o.train — фраза, которую ещё рано повторять, при верном ответе расписание не сдвигает (ошибка — вернётся завтра), o.nosrs — демо, прогресс не трогаем
function renderDaily(list,o){o=o||{};const L0=list||dailyItems(),back=o.back||(()=>renderTab('learn'));
  if(!list&&L0.length&&store.revDone===dayKey(new Date())&&premGate('rev',back))return;   // 13.9.30: без премиума — один заход повторения в день (если включено в админке)
  // 13.9.69 (П8): за раз — 3 задания, дальше «Ещё 3?». Ошибка — эта фраза в следующей порции (расписание и так вернёт её завтра)
  const sameLn=(a,b)=>a.k==='w'&&b.k==='w'&&a.it.line&&a.it.line===b.it.line,LS=L0.slice();   // 13.9.38: два слова одной реплики не подряд — по всему списку, до нарезки на порции
  for(let j=1;j<LS.length;j++)if(sameLn(LS[j-1],LS[j])){const m=LS.findIndex((z,i)=>i>j&&!sameLn(LS[j-1],z));if(m>0)[LS[j],LS[m]]=[LS[m],LS[j]];}
  const L=LS.slice(0,SC_PORT),REST=LS.slice(SC_PORT),CARRY=[];if(!o.all)o={...o,all:L0};
  if(!L0.length){mount(`<div class="page-head"><button class="icon-btn" id="bBtn" aria-label="Назад">${ui('back')}</button><h1 class="title">Повторение</h1></div>
    <div class="dl-empty card anim"><div class="dl-ic">✅</div><b>На сегодня всё повторено</b><span>Фразы из сцен и твои слова вернутся, когда придёт их время. Можно посмотреть новый эпизод или сохранить новые слова.</span>
    <button class="btn" id="dlGo">Новый эпизод →</button></div>`,'dlscr');$('#bBtn').onclick=()=>{sfx('tap');back();};
    $('#dlGo').onclick=()=>{const c=continueScene();renderScEp(c.s.id,c.i);};return;}
  const tgtOf=q=>q.s.lang==='de'?q.f.de:scT(q.f),nW=q=>dNorm(tgtOf(q)).split(' ').filter(Boolean).length;
  // 13.9.34: собрать целиком — только до 7 слов; длиннее — выражение (dexpr), нет выражения — «что значит?»
  const exQ=q=>!!scExpr(q.f,tgtOf(q)),longQ=q=>nW(q)>SC_MAXB,fitQ=(q,t)=>!longQ(q)||!['build','lbuild'].includes(t)?t:exQ(q)?'dexpr':(q.f.trap||[]).length>=2?'pmean':t;
  const phT=(q,j)=>fitQ(q,typeOn()?(nW(q)<2||(j%2===0&&nW(q)<=12)?'dict':'build'):nW(q)<2?'pmean':(j%2===0&&nW(q)<=12?'lbuild':'build'));   // фраза из одного слова — диктант / «что значит»; 13.9.16: без печати — «послушай и собери»
  if(!o._cx&&mywCx(L.filter(x=>x.k==='w').map(x=>x.it),()=>renderDaily(list,{...o,_cx:1})))return;   // 13.9.38: значения «тут» — до заданий со словами
  const Q=L.map((x,j)=>({...x,t:x.re&&x.t?x.t:x.k==='w'?'mean':phT(x,j)}));let n=0,ok=0;const res=[];
  for(let j=1;j<Q.length;j++){const a=Q[j-1],b=Q[j];if(a.k==='w'&&b.k==='w'&&a.it.line&&a.it.line===b.it.line){const m=Q.findIndex((z,i)=>i>j&&!(z.k==='w'&&z.it.line===a.it.line));if(m>0)[Q[j],Q[m]]=[Q[m],Q[j]];}}   // 13.9.38: два слова одной реплики не подряд
  const next=()=>{n++;n>=Q.length?end():show();};
  function frame(meta,body){const seg=Q.map((_,j)=>`<i class="${j<n?'done':j===n?'cur':''}"></i>`).join('');
    mount(`<div class="scn noir"><div class="sc-head"><button class="icon-btn" id="dlx" aria-label="Закрыть">${ui('close')}</button><div class="sc-segs">${seg}</div></div>
      <div class="sc-q sc-card dl-q"><div class="sc-meta">${meta}</div>${body}<div id="dlfb"></div></div></div>`,'scnscr');
    $('#dlx').onclick=()=>{sfx('tap');back();};}
  function grade(q,good,html){const early=o.train&&!(q.due&&q.due<=Date.now());if(!q.re&&!o.nosrs)lvRate(good,q.k==='ph'?wlvText(tgtOf(q),q.s.lang==='de'?'de':'en'):wlvText(q.it.w,wiLang(q.it.sid)),q.t);   // 13.9.72: живой уровень
    if(!o.nosrs&&!q.re&&!(good&&early)){   // 13.9.71 (ревью П8, п.1): повтор после ошибки (q.re) расписание не трогает — первая ошибка уже поставила «завтра», верный повтор не уносит на неделю
    if(q.k==='ph')phSRS(q.s,q.f,good);else wSRS(q.it,good);}res.push({q,good});if(good){ok++;store.reviews=(store.reviews||0)+1;}countAnswer();save();
    if(!good&&!q.re)CARRY.push({...q,re:true,t:q.k==='w'?'mean':(nW(q)<2?(typeOn()?'dict':'pmean'):fitQ(q,'build'))});   // 13.9.69: повтор — в следующей порции
    sfx(good?'good':'bad');haptic(good?'ok':'err');
    $('#dlfb').innerHTML=`<div class="sc-fb ${good?'ok':'bad'}">${html}<button class="sc-btn" id="dln">Дальше →</button></div>`;$('#dln').onclick=()=>{sfx('tap');next();};}
  function show(){const q=Q[n];
    if(q.k==='ph'&&!q.re&&!q.card&&ndOn()&&!o.train)return rcard(q);   // 13.9.43: «Новый» — сначала карточка с кадром (макет 12), «Знаю» — докажи заданием
    if(q.t==='dict'){const f=q.f,tgt=q.s.lang==='de'?f.de:scT(f);
      frame('Диктант · послушай и напиши',`<h2><button class="sc-hearbtn" id="dlh">${SI.vol||'🔊'} Ещё раз</button><button class="sc-hearbtn ghost" id="dls">🐢 Медленно</button><br><small class="qsm">Из «${esc(q.s.title)}». Напиши, что услышал — опечатки и знаки не важны.</small></h2>
        <textarea id="dlin" rows="2" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Пиши здесь…"></textarea>
        <div class="dl-b"><button class="sc-btn ghost" id="dlhint">Подсказка</button><button class="sc-btn" id="dlchk">Проверить</button></div>`);
      const hb=$('#dlh'),play=(rate)=>{scClip(q.s.id,f.id,hb);if(SCLIP)SCLIP.playbackRate=rate||1;};hb.onclick=()=>play(1);$('#dls').onclick=()=>play(.75);setTimeout(()=>play(1),300);
      let hint=0;$('#dlhint').onclick=()=>{hint++;const w=tgt.split(/\s+/);$('#dlin').placeholder=w.map((x,j)=>j<hint*2?x:x.replace(/[A-Za-zÄÖÜäöüß]/g,'·')).join(' ');sfx('tap');};
      $('#dlchk').onclick=()=>{const v=$('#dlin').value;if(!v.trim()){$('#dlin').focus();return;}const r=dCheck(v,tgt),good=r.score>=.85&&!hint;$('#dlchk').disabled=true;
        grade(q,good,`<div class="t">${good?'Верно — услышал':r.score>=.6?'Почти':'Послушай ещё раз'} · ${Math.round(r.score*100)}%</div><div class="en d-diff">${dDiffHTML(tgt,r.okB)}</div><div class="ru">${esc(f.ru)}</div>`);};
      setTimeout(()=>{const i=$('#dlin');if(i)i.focus();},400);return;}
    // 13.9.16: фраза из одного слова без печати — «что значит?» (варианты — ложные переводы фразы)
    if(q.t==='pmean'){const f=q.f,tgt=tgtOf(q),O=shuffle([f.ru,...(f.trap||[]).filter(x=>x&&x!==f.ru).slice(0,3)]);
      frame('Что значит фраза?',`<h2>${esc(tgt)} <button class="sc-hearbtn ghost" id="dlh">${SI.vol||'🔊'}</button><br><small class="qsm">Из «${esc(q.s.title)}»</small></h2><div class="sc-opts">${O.map(v=>`<button class="sc-opt" data-v="${esc(v)}">${esc(v)}</button>`).join('')}</div>`);
      const hb=$('#dlh');hb.onclick=()=>scClip(q.s.id,f.id,hb);setTimeout(()=>scClip(q.s.id,f.id,hb),300);
      $$('.sc-opt').forEach(b=>b.onclick=()=>{if(b.disabled)return;const good=b.dataset.v===f.ru;$$('.sc-opt').forEach(x=>{x.disabled=true;if(x.dataset.v===f.ru)x.classList.add('ok');});if(!good)b.classList.add('bad');
        grade(q,good,`<div class="t">${good?'Верно':'Неверно'}</div><div class="en">${esc(tgt)}</div><div class="ru">${esc(f.ru)}</div>`);});return;}
    if(q.t==='build'||q.t==='lbuild'||q.t==='dexpr'){const f=q.f,tgt=tgtOf(q),de=q.s.lang==='de',lis=q.t==='lbuild',E=q.t==='dexpr'?scExpr(f,tgt):null,
        B=scBuildTiles(E?E.x:tgt,f,q.s.parts.flatMap(p=>p.ph),de);
      // 13.9.5: кубики, как в проверке эпизода; 13.9.16: «послушай и собери»; 13.9.34: 2 попытки, длинная фраза — только выражение
      frame(E?'Собери выражение':lis?'Послушай и собери':'Собери фразу',(E?`<h2>${esc(f.ru)}${E.ru?`<br><small class="qsm">Выражение: <span class="mk">${esc(E.ru)}</span></small>`:''}</h2><div class="sc-expr">${esc(E.pre)}<span class="sc-bans in" id="scbans"></span>${esc(E.post)}</div>`
        :(lis?`<h2><button class="sc-hearbtn" id="dlh">${SI.vol||'🔊'} Ещё раз</button><button class="sc-hearbtn ghost" id="dls">🐢 Медленно</button><br><small class="qsm">Из «${esc(q.s.title)}». Собери, что услышал.</small></h2>`:`<h2>${esc(f.ru)}<br><small class="qsm">Из «${esc(q.s.title)}». Собери, как сказали в сцене.</small></h2>`)+`<div class="sc-bans" id="scbans"></div>`)+`
        <div class="sc-bpool" id="scbpool"></div>
        <div class="sc-bact"><button class="sc-btn ghost" id="scbrst" hidden>Сбросить</button><button class="sc-btn" id="scbchk" hidden>Проверить</button></div><div class="sc-bmsg" id="scbmsg"></div>`);
      scTilesUI(B,{ans:$('#scbans'),pool:$('#scbpool'),chk:$('#scbchk'),rst:$('#scbrst'),msg:$('#scbmsg'),fix:!!E,done:(right,tries,miss)=>{
        scClip(q.s.id,f.id,null);   // фраза звучит из фильма
        const good=right&&!tries;grade(q,good,`<div class="t">${good?'Верно':right?`Собрал со 2-й попытки — повторим ещё раз`:'Вот как в сцене'}</div>${right?'':scFixHTML(B.tk,miss,E)}<div class="en">${esc(tgt)}</div><div class="ru">${esc(f.ru)}</div>`);}});
      if(lis){const hb=$('#dlh'),play=r=>{scClip(q.s.id,f.id,hb);if(SCLIP)SCLIP.playbackRate=r||1;};hb.onclick=()=>play(1);$('#dls').onclick=()=>play(.75);setTimeout(()=>play(1),300);}
      return;}
    // 13.9.5: моё слово — выбор перевода из 4 (было «Показать перевод → Знал / Не знал»)
    const it=q.it,s=scOf(it.sid),hl=it.line?markWord(it.line,it.w,'<mark>','</mark>'):'',R=mywHere(it);
    frame(isPhr(it.w)?'Моё выражение · что значит?':'Моё слово · что значит?',`<h2>${esc(it.w)}${hl?`<br><small class="qsm">${hl}</small>`:''}</h2>
      <div class="sc-opts">${mywOpts(it).map(v=>`<button class="sc-opt" data-v="${esc(v)}">${esc(v)}</button>`).join('')}</div>
      ${s?`<button class="dl-mom" id="dlmom" hidden>▶ ${esc(s.title)} · эп. ${it.pi+1}</button>`:''}`);   // 13.9.38: момент из фильма — после ответа (там перевод реплики = ответ)
    $$('.sc-opt').forEach(b=>b.onclick=()=>{if(b.disabled)return;const good=b.dataset.v===R;$$('.sc-opt').forEach(x=>{x.disabled=true;if(x.dataset.v===R)x.classList.add('ok');});if(!good)b.classList.add('bad');
      const mb=$('#dlmom');if(mb)mb.hidden=false;
      grade(q,good,`<div class="t">${good?'Верно':'Неверно'}</div><div class="en">${esc(it.w)} — ${esc(R)}</div>${it.lineRu?`<div class="ru">${esc(it.lineRu)}</div>`:''}`);});
    if($('#dlmom'))$('#dlmom').onclick=()=>{sfx('tap');momOpen(it.sid,it.pi,it.a||0,it.w);};}
  // 13.9.43 (макет 12): карточка фразы — кадр эпизода, фильм · эпизод, фраза (слова нажимаются), перевод под «пылью», уровень и сколько верных.
  // «Ещё учу» (влево) — фраза вернётся раньше; «Знаю» (вправо) — короткое задание по ней: самопроверку Андрей запретил (13.9.5), «знаю» надо подтвердить.
  function rcard(q){try{wlvLoad();}catch(e){}const f=q.f,s0=q.s,p=s0.parts[f.pi]||{},m=Math.min(3,(scP(s0.id).m||{})[f.id]||0),lv=typeof wlvText==='function'?wlvText(tgtOf(q),s0.lang==='de'?'de':'en'):0;
    frame(`Повторение · ${n+1} из ${Q.length}`,`<div class="n-rst"><i class="b2"></i><i class="b1"></i>
      <div class="n-rcard" id="rcard"><span class="n-rstamp l">ЕЩЁ УЧУ</span><span class="n-rstamp r">ЗНАЮ</span>
        <button class="n-rim" id="rcim" style="background-image:url('${rwKadr(s0,f.pi)}'),url('${assetUrl(scEpKey(s0,f.pi,'jpg'))}')" aria-label="Послушать">${SI.play||'▶'}</button>
        <div class="n-rsrc">${esc((s0.show||s0.title).replace(/⁠/g,''))} · ${esc(p.t||'эпизод '+(f.pi+1))}</div>
        <div class="n-ren">${kwWrap(f,tgtOf(q))}</div>
        <div class="n-rru">${ndSp(esc(f.ru))}</div>
        <span class="n-chip ${lv?CEFR[lv-1].toLowerCase():'b1'}">${lv?LVW[CEFR[lv-1]]+' · ':''}${m?`учишь ${m} из 3`:'новая'}</span></div></div>
      <div class="yn n-yn n-ryn"><button class="sc-btn ghost" id="rcNo">↺ Ещё учу</button><button class="sc-btn" id="rcYes">✓ Знаю</button></div>`);
    const c=$('#rcard');try{phBind(c.querySelector('.n-ren'),f);}catch(e){}
    $('#rcim').onclick=e=>{e.stopPropagation();scClip(s0.id,f.id,null);};
    const go=yes=>{if(c._d)return;c._d=1;sfx(yes?'whoosh':'tap');haptic('sel');c.style.transition='transform .35s cubic-bezier(.4,0,.6,1),opacity .35s';c.style.transform=`translateX(${yes?640:-640}px) rotate(${yes?18:-18}deg)`;c.style.opacity='0';
      setTimeout(()=>{if(yes){q.card=true;show();return;}
        if(!o.nosrs)phSRS(q.s,q.f,false);res.push({q,good:false});countAnswer();save();CARRY.push({...q,re:true,t:fitQ(q,nW(q)<2?(typeOn()?'dict':'pmean'):'build')});next();},fxOK()?300:0);};
    onbSwipe(c,go,{tap:()=>{const sp=c.querySelector('.n-sp');if(sp)sp.classList.add('open');}});
    $('#rcNo').onclick=()=>go(false);$('#rcYes').onclick=()=>go(true);}
  function end(){remindSync(true);const day=!o.train&&(!list||o.day),left=[...CARRY,...REST],dayDone=()=>{if(day){store.revDone=dayKey(new Date());save();}};   // 13.9.69: что осталось — следующими порциями по 3
    if(!list&&!o.train)ev('review','daily');if(!left.length)dayDone();   // 13.9.71 (ревью П8, п.2–3): событие — один раз за заход; «повторение на сегодня было» — когда порций больше нет или нажал «Хватит»
    const good=res.filter(x=>x.good).length;sfx(good===res.length?'win':'learn');
    mount(`<div class="scn noir"><div class="sc-q sc-card sc-result" style="text-align:center"><div class="sc-meta">${esc(o.title||'Повторение на сегодня')}</div><div class="sc-big">${good} / ${res.length}</div>
      <p class="sc-sub">${good===res.length?(o.train?'Всё вспомнил.':'Всё вспомнил. Следующая встреча — через несколько дней.'):'Что не вспомнилось — вернётся завтра. Так и запоминается.'}${left.length?` Осталось ещё ${left.length} — по три за раз.`:''}</p>
      <div class="sc-btns">${left.length?`<button class="sc-btn" id="dlmore">Ещё ${Math.min(SC_PORT,left.length)} →</button>`:o.train?`<button class="sc-btn" id="dlh3">Ещё раз</button>`:''}<button class="sc-btn${o.train||left.length?' ghost':''}" id="dlh2">${left.length?'Хватит':o.back?'Назад в словарь':'На главную'}</button></div></div></div>`,'scnscr');$('#dlh2').onclick=()=>{if(left.length)dayDone();back();};
    if($('#dlmore'))$('#dlmore').onclick=()=>{sfx('tap');renderDaily(left,{...o,_cx:0,day:day?1:0});};
    if($('#dlh3'))$('#dlh3').onclick=()=>{sfx('tap');renderDaily(shuffle((o.all||L).slice()).map(x=>x.k==='ph'?{...x,re:false,due:((scP(x.s.id).r||{})[x.f.id]||[0,0])[1]}:{...x,re:false}),{...o,all:null,_cx:0});};}
  show();}
/* ================= 8.2: фраза дня ================= */
// 13.9.18: на Главной — та же «Фраза дня», что бот присылает в чат сегодня (data/daily.json, день по Берлину, как в воркере)
let DAILY_L=null;
const berlinDay=()=>{try{const d=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Berlin',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());return Math.floor(Date.parse(d+'T00:00:00Z')/864e5);}catch(e){return Math.floor(Date.now()/864e5);}};
function dailyLoad(){if(DAILY_L!==null)return;DAILY_L=[];fetch('data/daily.json?v='+APP_V).then(r=>r.json()).then(d=>{DAILY_L=(d&&d.DAILY)||[];const el=document.querySelector('.pod');if(el&&DAILY_L.length){const h=phraseOfDayHTML();if(h)el.outerHTML=h;}}).catch(()=>{});}
function phraseOfDayBot(){dailyLoad();const L=DAILY_L||[];if(!L.length)return null;const x=L[((berlinDay()%L.length)+L.length)%L.length],s=scOf(x.sid),f=s&&s.parts[x.pi]&&s.parts[x.pi].ph[x.n];
  return f&&flagOf('scene-'+s.id)==='on'?{s,f}:null;}
function phraseOfDay(){const b=phraseOfDayBot();if(b)return b;const A=SCENES.filter(s=>s.kind!=='clip'&&flagOf('scene-'+s.id)==='on').flatMap(s=>s.parts.flatMap(p=>p.ph).filter(f=>!f.passive&&f.ex&&f.ex.length).map(f=>({s,f})));
  if(!A.length)return null;const day=Math.floor((Date.now()+36e5)/864e5);return A[(day*7919)%A.length];}
function phraseOfDayHTML(){const x=phraseOfDay();if(!x)return '';const {s,f}=x,de=scL()==='de'&&!scIsDe(),tg=scTag(f);
  return `<div class="pod card anim"><div class="pod-top"><span class="pod-k">✦ Фраза дня</span><span class="sc-tag ${tg[1]}">${tg[0]}</span></div>
    <b class="pod-en">${esc(s.lang==='de'?f.de:scT(f))}</b><span class="pod-ru">${esc(f.ru)}</span>
    ${f.ex&&f.ex[0]?(dx=>`<small class="pod-ex">Пример: ${esc(dx&&f.exDe?f.exDe[0][0]:dx?f.ex[0][2]||f.ex[0][0]:f.ex[0][0])} — ${esc(dx&&f.exDe?f.exDe[0][1]:f.ex[0][1])}</small>`)(de||s.lang==='de'):''}
    <div class="pod-b"><button class="pod-go" onclick="momOpen('${s.id}',${f.pi},${f.a})">▶ Момент из «${esc(s.title)}»</button><button class="sc-say pod-say" data-s="${s.id}" data-clip="${f.id}" onclick="scClip(this.dataset.s,this.dataset.clip,this)" aria-label="Послушать из фильма">${SI.vol||'🔊'}</button></div></div>`;}
/* ================= 8.1: «Как пользоваться» ================= */
const HELP=[
 ['🎬','Кинозал','Сцены из фильмов и сериалов, разбитые на короткие эпизоды. Выбираешь сцену → эпизод → смотришь. У каждой сцены своя музыка (пластинка на странице сцены).'],
 ['👆','Слова под видео','Под видео — «Все реплики» эпизода. Нажми на любое слово — перевод слова, выражение (если оно есть) и «☆ В мои слова». То же в карточках разбора. На компьютере достаточно навести мышкой.'],
 ['〰️','Выражения','Слова, подчёркнутые пунктиром, — это выражение: вместе они значат не то, что по отдельности («Fuck the clients» — не про клиентов, а «да похуй на клиентов»).'],
 ['⏸','Урок по шагам','1 — посмотри эпизод целиком. 2 — разбор: каждая фраза с переводом, «когда применяется», примером и интересным фактом; подсвеченные слова наведи или нажми — откроется карточка слова. 3 — короткая проверка.'],
 ['✅','Проверка','До 5 заданий: «какая фраза прозвучала», «что это значит» (с ловушками), «вставь слово», «собери по-английски», «примени в жизни» (та же конструкция в другой ситуации). Ошибся — фраза вернётся позже, выученное не стирается.'],
 ['🔁','Повторение','Выученное возвращается через 1, 3, 7, 21 и 60 дней. Блок «Повторение» на главной, а бот напомнит днём (выключается в настройках).'],
 ['📚','Словарь фраз','Все фразы из кино по темам (знакомство, работа, свидание…) и тону (грубо / разговорное / официально). Фильтры, поиск, звук из фильма, переход к моменту.'],
 ['🔍','Поиск','Лупа на главной: ищет сразу по-русски, по-английски и по-немецки — фразы, реплики, сцены, слова. Нажал на реплику — открывается этот момент в фильме.'],
 ['🗣','Субтитры и язык','Кнопка субтитров под видео: «Оригинал + перевод», «Только оригинал», «Без субтитров». ⤢ в полном экране — растянуть видео без чёрных полос.'],
 ['🏆','Прогресс','«Освоение сцены» растёт, когда фразы держатся надолго; на 100% сцена получает золотую рамку. В профиле — неделя, серия дней и достижения.']];
function renderHelp(){screen='help';backBtn(true);
  mount(`<div class="page-head"><button class="icon-btn" id="bBtn" aria-label="Назад">${ui('back')}</button><h1 class="title">Как пользоваться</h1></div>
    <p class="lead" style="margin:2px 0 14px">Коротко обо всём, что умеет приложение.</p>
    <div class="help-list">${HELP.map(([ic,h,txt],k)=>`<details class="help-it anim"${k<2?' open':''}><summary><span class="hi-ic">${ic}</span><b>${h}</b><i>›</i></summary><p>${txt}</p></details>`).join('')}</div>
    <button class="btn help-tour" id="hTour">Показать обучение в эпизоде</button>`,'helpscr');
  $('#bBtn').onclick=()=>{sfx('tap');renderTab('profile');};$('#hTour').onclick=()=>{sfx('tap');scTour();};}
/* ================= 7.9: словарь фраз с темами ================= */
// Все учебные фразы из всех сцен в одном месте: фильтр по темам (знакомство, свидание, работа…),
// по тону (грубо / разговорное / официально / нейтрально), «все или только мои», поиск, звук из фильма, переход к моменту.
// Темы лежат отдельно в data/topics.json (ключ «id сцены|английская фраза»), scenes.json не трогаем.
const TOPIC_ICO={'знакомство':'👋','свидание':'💘','общение':'💬','работа':'💼','деньги':'💰','учёба':'📚','кафе и магазин':'☕','телефон и планы':'📞','эмоции':'💭','ссоры':'😤','здоровье':'🩺','быт':'🏠'};
const TOPICS_ALL=Object.keys(TOPIC_ICO);
(function(){const T=(window.__DATA&&window.__DATA.TOPICS)||{};SCENES.forEach(s=>s.parts.forEach(p=>p.ph.forEach(f=>{const k=s.id+'|'+f.en;if(T[k])f.topics=T[k];})));})();
const fTopics=f=>f.topics&&f.topics.length?f.topics:['общение'];
function dictAll(){return SCENES.filter(s=>s.kind!=='clip').flatMap(s=>{const P=scP(s.id);return s.parts.flatMap(p=>p.ph).filter(f=>!f.passive).map(f=>{const r=P.r[f.id];
  return {s,f,st:r?r[0]:(P.rDone&&P.rDone[f.id]?9:-1),seen:(P.m[f.id]||0)>0||!!r||!!(P.rDone&&P.rDone[f.id])};});});}
// статистика: что делают в приложении (уходит в бота, ничего не ждёт и не мешает)
// 13.9.32: аналитика PostHog (облако US). Ключ проекта публичный (phc_…) — он и должен лежать в коде.
// Грузится через 2,5 с после старта, только в Telegram (есть ID игрока) и не из file://. Игрок = Telegram ID; имён и @ника не шлём.
// tgWebAppData (подпись Telegram с именем и ником) до загрузки убирается из адреса — Telegram уже прочитал её и держит в sessionStorage.
// До загрузки события копятся в очереди (не больше 100); скрипт не загрузился — очередь выбрасывается. Экраны — $pageview с путём «/экран».
const PH_KEY='phc_sm8N6AsFNjtWgfeZVXz4oghJ3bVRubhZeoJmY9Qq8EKA',PH_HOST='https://us.i.posthog.com';
const PH={on:!!PH_KEY&&location.protocol!=='file:',ok:false,go:false,q:[],scr:''};
function phUid(){try{const u=TG&&TG.initDataUnsafe&&TG.initDataUnsafe.user;return u&&u.id?String(u.id):'';}catch(e){return '';}}
function ph(fn,...a){if(!PH.on)return;try{if(PH.ok&&window.posthog)window.posthog[fn](...a);else if(PH.q.length<100)PH.q.push([fn,a]);}catch(e){}}
const phUrl=u=>typeof u==='string'&&/tgWebApp/.test(u)?u.replace(/#.*$/,''):u;
function phClean(e){try{[e&&e.properties,e&&e.$set,e&&e.$set_once].forEach(p=>{if(p)['$current_url','$referrer','$initial_current_url','$initial_referrer','$referring_domain'].forEach(k=>{if(p[k])p[k]=phUrl(p[k]);});});}catch(x){}return e;}
function phLoad(){if(!PH.on||PH.go)return;const uid=phUid();if(!uid){PH.on=false;PH.q.length=0;return;}PH.go=true;
  try{if(/tgWebAppData/.test(location.hash)){const h=new URLSearchParams(location.hash.slice(1));h.delete('tgWebAppData');history.replaceState(history.state,'',location.pathname+location.search+(h.toString()?'#'+h:''));}}catch(e){}
  const sc=document.createElement('script');sc.async=true;sc.crossOrigin='anonymous';sc.src=PH_HOST.replace('.i.posthog.com','-assets.i.posthog.com')+'/static/array.js';
  sc.onerror=()=>{PH.on=false;PH.q.length=0;};
  sc.onload=()=>{try{const P=window.posthog;if(!P||!P.init){PH.on=false;PH.q.length=0;return;}
    P.init(PH_KEY,{api_host:PH_HOST,person_profiles:'identified_only',capture_pageview:false,capture_pageleave:false,autocapture:true,
      session_recording:{maskAllInputs:true},before_send:phClean,
      loaded:p=>{try{const u=TG.initDataUnsafe.user||{};p.identify(uid,{tg_lang:u.language_code||'',platform:(TG&&TG.platform)||'',is_admin:uid==='876754050'});
        p.register({app_v:APP_V});PH.ok=true;PH.q.splice(0).forEach(([f,a])=>{try{p[f](...a);}catch(x){}});}catch(x){}}});}catch(e){PH.on=false;}};
  document.head.appendChild(sc);}
// экран сменился → $pageview «/экран» (вкладки — «/home/<вкладка>»), повтор того же экрана не шлём
function phScreen(){if(!PH.on)return;const sc=typeof screen==='string'?screen:'',k=sc+(sc==='home'?'/'+(store.tab||''):'');if(!sc||k===PH.scr)return;PH.scr=k;
  let sid='';try{sid=(typeof SCUR!=='undefined'&&SCUR&&SCUR.id)||'';}catch(e){}
  ph('register',{app_v:APP_V,look:ndOn()?'nd':'old',cefr:store.cefr||''});ph('capture','$pageview',{$current_url:location.origin+location.pathname+'#/'+k,$pathname:'/'+k,sid});}
function ev(e,sid,props){try{ph('capture',e,props||(sid?{sid}:{}));if(!TG||!TG.initData)return;const src=typeof START==='string'&&/^src_/.test(START)?START:'';
  fetch(API+'/api/ev',{method:'POST',headers:{'content-type':'application/json','x-init-data':TG.initData},body:JSON.stringify({e,sid:sid||'',src}),keepalive:true}).catch(()=>{});}catch(x){}}
// 13.9.19: ошибки у игроков → бот → админка «Ошибки» (не больше 5 за запуск, одинаковые — один раз; шум плееров и расширений — мимо)
let ERRN=0;const ERRSEEN=new Set();
function errSend(msg,at){try{msg=String(msg||'').slice(0,300);at=String(at||'').slice(0,160);
  if(!msg||/NotAllowedError|AbortError|NotSupportedError|ResizeObserver|^Script error|play\(\) request|The operation was aborted|Load failed|Failed to fetch|NetworkError/i.test(msg))return;
  const k=msg+at;if(ERRN>=5||ERRSEEN.has(k)||!TG||!TG.initData)return;ERRSEEN.add(k);ERRN++;ph('captureException',new Error(msg),{at,scr:typeof screen==='string'?screen:''});
  fetch(API+'/api/ev',{method:'POST',headers:{'content-type':'application/json','x-init-data':TG.initData},body:JSON.stringify({a:'err',msg,at,v:APP_V,scr:typeof screen==='string'?screen:'',ua:navigator.userAgent.replace(/Mozilla\/5\.0 |\(KHTML, like Gecko\) /g,'').slice(0,120)}),keepalive:true}).catch(()=>{});}catch(x){}}
window.addEventListener('error',e=>{if(e&&e.message)errSend(e.message,String(e.filename||'').split('/').pop().split('?')[0]+':'+e.lineno+':'+e.colno);});
window.addEventListener('unhandledrejection',e=>{const r=e&&e.reason;errSend('promise: '+(r&&r.message||r),r&&r.stack?String(r.stack).split('\n')[1]||'':'');});
// 13.9.19: опрос «Что мешает?» — один раз, после 3-го пройденного эпизода, ответ уходит в бота (админка → «Воронка»)
function pollMaybe(){try{if(store.poll1||document.querySelector('.sc-sheetwrap')||screen!=='home'||store.tab!=='learn')return;let n=0;for(const k in SC)n+=(SC[k]&&SC[k].done?SC[k].done.length:0);if(n<3)return;
  const w=document.createElement('div');w.className='sc-sheetwrap poll';
  w.innerHTML=`<div class="sc-sheet poll-s"><b class="unl-h">Один вопрос</b><p>Что сейчас мешает больше всего? Ответ анонимный — по нему чиним приложение.</p>
    <div class="poll-l">${[['none','Ничего, всё понятно 👍'],['what','Непонятно, что делать'],['hard','Сложные задания'],['bore','Скучно, затянуто'],['few','Мало фильмов'],['bug','Что-то не работает']].map(([k,t])=>`<button data-p="${k}">${t}</button>`).join('')}</div>
    <button class="poll-x" data-close>Не сейчас</button></div>`;
  document.body.appendChild(w);
  w.onclick=e=>{const b=e.target.closest('[data-p]');if(b){store.poll1=b.dataset.p;save();ev('poll','q1:'+b.dataset.p);sfx('reward');haptic('success');w.querySelector('.poll-s').innerHTML='<b class="unl-h">Спасибо!</b><p>Учтём.</p>';setTimeout(()=>w.remove(),1200);return;}
    if(e.target===w||e.target.closest('[data-close]')){store.poll1='skip';save();w.remove();}};}catch(e){}}
// 3 фразы, которые пора повторить раньше всех — их бот покажет прямо в напоминании
function remindTop(){try{const de=scL()==='de';return SCENES.flatMap(s=>{const P=scP(s.id);return s.parts.flatMap(p=>p.ph).filter(f=>P.r[f.id]).map(f=>({t:P.r[f.id][1],x:((s.lang==='de'||de)?f.de:f.en)+' — '+f.ru}));})
  .sort((a,b)=>a.t-b.t).slice(0,3).map(o=>o.x.replace(/\s+/g,' ').slice(0,80));}catch(e){return [];}}
async function remindSync(force){
  try{if(!TG||!TG.initData)return;if(store.remind===undefined){store.remind=true;save();}if(store.daily===undefined){store.daily=true;save();}
    const now=Date.now(),all=SCENES.flatMap(s=>Object.values(scP(s.id).r||{}).map(x=>x[1])).filter(Boolean);
    const next=all.length?Math.max(now,Math.min(...all)):0,n=all.filter(x=>x<=Math.max(now,next)+12*36e5).length;
    const key=[store.remind?1:0,store.daily===false?0:1,Math.round(next/36e5),n].join(':');if(!force&&store.remindLast===key)return;
    const r=await fetch(API+'/api/remind',{method:'POST',headers:{'content-type':'application/json','x-init-data':TG.initData},body:JSON.stringify({next,n,off:!store.remind,doff:store.daily===false,top:remindTop()})});
    const j=await r.json();if(j&&j.ok){store.remindLast=key;save();}
  }catch(e){}}
const scRevLeft=id=>{const s=scOf(id);return s?(REVC.sid===id?REVC.q.length:0)+scDue(s).length:0;};   // 13.9.69: сколько осталось в повторении сцены (ошибки — в следующей порции)
const scRevMore=id=>{const n=scRevLeft(id);return n?`<button class="sc-btn" id="scmore">Ещё ${Math.min(SC_PORT,n)} · осталось ${n} →</button>`:'';};
const scRevNext=id=>{if(!REVCHAIN)return '';const L=scDueAll().filter(x=>x.s.id!==id);return L.length?`<button class="sc-btn" id="scnrev">Дальше: ${esc(L[0].s.title)} · ${L[0].n} →</button>`:'<p class="sc-sub" style="margin-top:8px">На сегодня всё повторено 👌</p>';};
const scDue=s=>{const r=scP(s.id).r||{},now=Date.now();return s.parts.flatMap(p=>p.ph).filter(f=>r[f.id]&&r[f.id][1]<=now);};
const SCK='dota_sc_v1';
let SC={};try{SC=JSON.parse(localStorage.getItem(SCK))||{};}catch(e){SC={};}
try{for(const id in SC)scRelay(id,SC[id]);}catch(e){}
const scP=id=>{let p=SC[id];if(!p){p=SC[id]={done:[],m:{},w:{}};if(SC_RELAY[id])p.lv=SC_RELAY[id].v;}p.r=p.r||{};return p;};
function scSave(){const s=JSON.stringify(SC);try{localStorage.setItem(SCK,s);}catch(e){}if(CLOUD_OK)cloudQueue(SCK,s);}
// 12.1: облачный прогресс сцен сливается в cloudSync() (вместе с store, M, RV)
const scFmt=s=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
// пассивные фразы (passive:true) — только для понимания: в тесты, повторение и счёт «выучено» не идут
const scAct=ph=>{const a=ph.filter(f=>!f.passive);return a.length?a:ph;};
// 13.9.43: какие фразы спрашивать и объяснять. u — польза (разметка tools/ph_use.py): 3 — нужна всем, 2 — полезна в своих ситуациях (g — кому:
// work/travel/films/move/self, цель из первого запуска store.goalWhy), 1 — только понимать (мат, сленг), 0 — бесполезная (passive).
// Сначала полезное и «под твою цель»; «только понимать» — тем, кто учит ради кино, или если полезных в эпизоде меньше двух.
const phU=f=>f&&f.u!=null?f.u:2;
const phScore=f=>{const u=phU(f),g=store.goalWhy;return u*10+(g&&(f.g||[]).includes(g)?6:0)+(u>=3?2:0);};
function phPick(L,n){const A=L.slice().sort((a,b)=>phScore(b)-phScore(a)||a.a-b.a),films=store.goalWhy==='films';
  let P=A.filter(f=>phU(f)>=2||(films&&phU(f)===1));if(P.length<2)P=A;return P.slice(0,n).sort((a,b)=>a.a-b.a);}   // 13.0.2: «только понять» не идут в проверку, даже если активная фраза в эпизоде одна (Бункер, эп. 1)
const scLearned=s=>s.parts.flatMap(p=>scAct(p.ph)).filter(f=>(scP(s.id).m[f.id]||0)>=3).length;
const scTotal=s=>s.parts.reduce((a,p)=>a+scAct(p.ph).length,0);
// «держится надолго»: прошла 3 шага повторения (7+ дней) или весь круг до конца
const scMastered=s=>{const P=scP(s.id);return s.parts.flatMap(p=>scAct(p.ph)).filter(f=>{const r=P.r[f.id];return r?r[0]>=3:(P.m[f.id]||0)>=3&&!!P.rDone&&P.rDone[f.id];}).length;};
const scMasterPct=s=>{const T=scTotal(s);return T?Math.round(scMastered(s)/T*100):0;};
let SCUR={id:null,i:0},SV=null,SW=null,SSTOP=null,SRATE=1,SSUBON=true,SRAF=0;
function scStop(){if(SV){try{SV.pause();SV.removeAttribute('src');SV.load();}catch(e){}}SV=null;SW=null;SSTOP=null;delete document.body.dataset.scn;delete document.body.dataset.scr;try{kwHide(0);}catch(e){}scExitFull();scCloseSheet();}
// язык заданий в кино: из выбранных субтитров (есть Deutsch — задания по-немецки), иначе английский
const scIsDe=()=>{try{const s=SCUR&&SCUR.id&&scOf(SCUR.id);return !!(s&&s.lang==='de');}catch(e){return false;}};
// в немецкой сцене первая строка субтитров всегда немецкий оригинал, вторая — выбранный перевод
const scDeMode=m=>!scIsDe()||m==='off'||m==='ru'?m:(/ru/.test(m)?'de+ru':m==='en+de'?'de+en':'de');
const scL=()=>{if(scIsDe())return 'de';if(!FLAG_ADMIN)return 'en';const v=store.scSub;   // 13.7: английская сцена учит английскому; немецкий перевод к ней — пока только админу
  if(['en+ru','en+de','de+ru','en','de','ru','off'].includes(v))return /de/.test(v)?'de':'en';return store.langs[0]==='de'?'de':'en';};
const scT=f=>scL()==='de'?f.de:f.en;
const scNoteS=f=>(scL()==='de'&&!scIsDe())?'':(f.use||f.tip||scShort(f.note));   // 9.1: «когда применяется» вместо старого пояснения                 // фраза на изучаемом языке
const scRowT=r=>scL()==='de'?r[4]:r[2];              // реплика на изучаемом языке
// субтитры: один язык — en (оригинал), de, ru или off
const SUB_MODES=['en+ru','en+de','de+ru','en','de','ru','off'];
// три режима: оригинал+перевод, только оригинал, без субтитров (язык — тот, что учишь)
function scSub(){let v=store.scSub,de=scL()==='de';if(SC_DIR)return de?'de':'en';   // 12.5: режиссёрская версия — только оригинал
if(!v||!store.scSubChosen)v='auto';if(v==='off')return 'off';
  if(v==='auto'){let w=false;try{const P=SCUR&&SCUR.id?scP(SCUR.id):null;w=!!(P&&(P.done.includes(SCUR.i)||P.w[SCUR.i]));}catch(e){}return de?(w?'de':'de+ru'):(w?'en':'en+ru');}if(!v||/\+/.test(v)||v==='ru')return de?'de+ru':'en+ru';return de?'de':'en';}
const SUB_SHORT={'en+ru':'EN·RU','en+de':'EN·DE','de+ru':'DE·RU',en:'EN',de:'DE',ru:'RU',off:'CC'};
const SUB_COL={en:2,ru:3,de:4};

// разделы кинозала: фильмы, сериалы, клипы. Сцены одного сериала (поле show) собираются в одну карточку.
const SC_KIND={film:'Фильм',series:'Сериал',clip:'Клип',interview:'Интервью',game:'Игра'};   // 13.9.62: игры = раздел в «Кино», как интервью
// 12.7: интервью — как фильмы: человек = «фильм» (поле show), куски интервью = сцены
const SC_CATS=[['all','Все'],['film','Фильмы'],['series','Сериалы'],['interview','Интервью'],['game','Игры'],['clip','Клипы']];
// 13.5: язык Кинозала = язык фильма (English / Deutsch — немецкий дубляж и «Бункер»), как в словаре
const scLang=s=>s&&s.lang==='de'?'de':'en';
const kinoLang=()=>store.kinoLang||(store.langs&&store.langs[0]==='de'?'de':'en');
const scDots=n=>`<span class="sc-dots">${[1,2,3,4,5].map(i=>`<i class="${i<=n?'on':''}"></i>`).join('')}</span>`;
function scRateHTML(s){if(!s.lvl&&!s.use)return '';
  return `<div class="sc-rate">${s.lvl?`<div><span>Сложность на слух</span>${scDots(s.lvl)}<small>${esc(s.lvlWhy||'')}</small></div>`:''}${s.use?`<div><span>Польза в жизни</span>${scDots(s.use)}<small>${esc(s.useWhy||'')}</small></div>`:''}</div>`;}
function kinoCard(s){const L=scLearned(s),T=scTotal(s),d=scP(s.id).done.length;
  const lk=!scOpen(s);
  return `<button class="kposter ${s.theme} anim${scMasterPct(s)===100?' mastered':''}${lk?' locked':''}" data-sc="${s.id}">${lk?`<span class="kp-lock">🔒 ${ui('coin')} ${fmt(SC_PRICE(s))}</span>`:''}${s.lang==='de'?`<span class="kp-lang">${FLAG.de} на немецком</span>`:''}${s.age?`<span class="kp-age">18+</span>`:''}<span class="kp-img" style="background-image:${ndOn()?`url('${scCover(s,'poster.jpg')}'),`:''}url('${scCover(s,'cover.jpg')}')"></span><span class="kp-grad"></span>${lvcHTML(s)}${musOf(s).length?'<span class="kp-mus" title="Есть саундтрек">♪</span>':''}
    <span class="kp-t"><em>${esc(s.ep)}</em><b>${esc(s.title)}</b><small>${s.parts.length} ${plural(s.parts.length,['эпизод','эпизода','эпизодов'])}${d?` · пройдено ${d}`:''}</small>
    ${s.lvl?`<span class="kp-rate"><i>сложность ${scDots(s.lvl)}</i><i>польза ${scDots(s.use||0)}</i></span>`:''}
    <span class="kp-bar"><i style="width:${Math.round(L/T*100)}%\"></i></span></span></button>`;}
// 13.9.39 (ТЗ-13.9.32, P2 экран 7): «Кино» как в макете (.cell 7) — поиск, сегмент разделов с едущей плашкой, уровни A1–C1 фильтром,
// сетка постеров 3 в ряд (уровень, полоска прогресса), постеры входят каскадом. Стиль — styles/nd.css (n-*). «Как было» — kinoTabHTML ниже
const ND_KCAT={film:'Фильмы',series:'Сериалы',interview:'Интервью',game:'Игры',clip:'Клипы'};
function ndKinoState(){const kl=kinoLang(),inL=s=>scLang(s)===kl&&flagOf('scene-'+s.id)!=='hide';
  // 13.9.62: раздел «Игры» встаёт сам — есть сцены с kind game или хотя бы одна игра в GAMES (как «Интервью»)
  const hasGame=SCENES.some(s=>inL(s)&&(s.kind||'film')==='game')||!!gmData();
  const kinds=['film','series','interview','game','clip'].filter(k=>k==='game'?hasGame:SCENES.some(s=>inL(s)&&(s.kind||'film')===k));
  const cat=kinds.includes(store.kinoCat)?store.kinoCat:kinds[0]||'film';
  const G={},cards=[];for(const s of SCENES){if(!inL(s)||(s.kind||'film')!==cat)continue;const h=s.show||s.id;if(!G[h]){G[h]=[];cards.push(h);}G[h].push(s);}
  const me=CEFR.indexOf(store.cefr||'');let lv=store.kinoLv||(me>=0?'me':'all');if(lv==='me'&&me<0)lv='all';
  const band=lv==='all'?CEFR:lv==='me'?CEFR.filter((c,k)=>Math.abs(k-me)<=1):[lv];
  const all=cards.map(h=>{const L=G[h],s0=L.reduce((a,y)=>(y.lvl||3)<(a.lvl||3)?y:a,L[0]),T=L.reduce((a,x)=>a+scTotal(x),0),D=L.reduce((a,x)=>a+scLearned(x),0);
    return {h,L,s:L[0],lv:cefrOf(s0),lvs:L.map(cefrOf),p:T?Math.round(D/T*100):0,lk:premNeed('scene')&&L.every(x=>!premFree(x)),age:L.some(x=>x.age&&!store.age18)};});
  const have=CEFR.filter(c=>all.some(x=>x.lvs.includes(c)));
  return {kl,kinds,cat,lv,band,have,list:all.filter(x=>x.lvs.some(c=>band.includes(c)))};}
function ndKinoBody(K){
  if(K.cat==='game'&&!SCENES.some(s=>(s.kind||'film')==='game')){   // 13.9.62: игр-сцен ещё нет — карточки игр из GAMES («игра как фильм»)
    const GS=window.__DATA&&window.__DATA.GAMES||{};
    const gc=Object.keys(GS).map(gid=>{const g=GS[gid],n=(g.heroes||[]).reduce((a,h)=>a+(h.dialogs||[]).length,0);
      return `<button class="n-po" data-game="${gid}" aria-label="${esc(g.name)}">
        <span class="n-pi" style="${g.cover?`background-image:url('${assetUrl(g.cover)}')`:'background:linear-gradient(150deg,#3A3226,#14100A)'}"><span class="n-chip n">Игра</span><u><i style="width:0%"></i></u></span>
        <span class="n-pt">${esc(g.name)}</span></button>`;}).join('');
    return `<div class="n-lbl"><span>Игры</span><span>${Object.keys(GS).length}</span></div>${gc?`<div class="n-pg">${gc}</div>`:'<div class="n-empty">Пока пусто — игры в пути</div>'}`;}
  const lbl=K.lv==='me'?'Для твоего уровня':K.lv==='all'?'Все уровни':'Уровень «'+lvW(K.lv)+'»';
  const po=x=>`<button class="n-po" ${x.L.length===1?`data-sc="${x.s.id}"`:`data-show="${esc(x.h)}"`} aria-label="${esc(x.s.show||x.s.title)}">
      <span class="n-pi" style="background-image:url('${scCover(x.s,'poster.jpg')}'),url('${scCover(x.s,'cover.jpg')}')"><span class="n-chip lvbc ${x.lv.toLowerCase()}" title="${LVW[x.lv]}">${lvBarsIn(CEFR.indexOf(x.lv)+1)}</span>${x.age?'<span class="n-po-b">18+</span>':x.lk?'<span class="n-po-b">🔒</span>':x.p===100?'<span class="n-po-b ok">✓</span>':''}<u><i style="width:${x.p}%"></i></u></span>
      <span class="n-pt">${esc(x.s.show||x.s.title)}</span></button>`;
  return `<div class="n-lv">${K.have.map(c=>`<button class="n-chip ${K.band.includes(c)?c.toLowerCase():'n'}${K.lv===c?' on':''}" data-lv="${c}">${LVW[c]}</button>`).join('')}<button class="n-chip n${K.lv==='all'?' on':''}" data-lv="all">Все уровни</button></div>
    <div class="n-lbl"><span>${lbl}</span><span>${K.list.length}</span></div>
    ${K.list.length?`<div class="n-pg">${K.list.map(po).join('')}</div>`:`<div class="n-empty">Для ${K.lv==='me'?'твоего уровня':'уровня «'+lvW(K.lv)+'»'} тут пока ничего — <button data-lv="all">смотри все</button></div>`}`;}
function ndKinoHTML(){const K=ndKinoState(),nDe=SCENES.some(s=>s.lang==='de'&&flagOf('scene-'+s.id)!=='hide'),ci=Math.max(0,K.kinds.indexOf(K.cat));
  return `<div class="n-scr n-kino">
    <div class="n-kh"><h3 class="n-h">Кино</h3>${nDe?`<div class="n-kl" role="group" aria-label="Язык фильмов"><button data-kl="en" class="${K.kl==='en'?'on':''}">${FLAG.en}EN</button><button data-kl="de" class="${K.kl==='de'?'on':''}">${FLAG.de}DE</button></div>`:''}</div>
    <button class="n-srch" data-go="search"><svg class="n-ic" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4"/></svg>Фильм, фраза или слово</button>
    ${K.kinds.length>1?`<div class="n-sg" style="--n:${K.kinds.length}"><i style="transform:translateX(${ci*100}%)"></i>${K.kinds.map(k=>`<button data-cat="${k}" class="${k===K.cat?'on':''}">${ND_KCAT[k]}</button>`).join('')}</div>`:''}
    <div class="n-kb" id="nKb">${ndKinoBody(K)}</div>
  </div>`;}
function ndBindKino(){const root=$('.n-kino');if(!root)return;
  const body=()=>{const b=$('#nKb');b.innerHTML=ndKinoBody(ndKinoState());bindB();};
  const bindB=()=>{$$('.n-kino .n-po').forEach(b=>b.onclick=()=>{haptic('medium');sfx('tap');b.dataset.sc?renderScene(b.dataset.sc):b.dataset.game?renderGameScreen(b.dataset.game):renderShow(b.dataset.show);});
    $$('.n-kino [data-lv]').forEach(b=>b.onclick=()=>{const v=b.dataset.lv,K=ndKinoState();sfx('sel');haptic('light');store.kinoLv=K.lv===v&&v!=='all'?'':v;save();body();});};
  root.querySelector('[data-go="search"]').onclick=()=>{sfx('tap');renderSearch();};
  $$('.n-kino [data-kl]').forEach(b=>b.onclick=()=>{if(b.dataset.kl===kinoLang())return;sfx('page');haptic('light');store.kinoLang=b.dataset.kl;save();renderTab('kino');});
  $$('.n-kino .n-sg button').forEach((b,k)=>b.onclick=()=>{if(b.classList.contains('on'))return;sfx('sel');haptic('light');store.kinoCat=b.dataset.cat;save();
    const sg=b.parentNode;sg.querySelector('i').style.transform=`translateX(${k*100}%)`;sg.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));body();});
  bindB();}
function kinoTabHTML(){if(ndOn())return ndKinoHTML();
  const kl=kinoLang(),inL=s=>scLang(s)===kl,nL=l=>SCENES.filter(s=>scLang(s)===l&&flagOf('scene-'+s.id)!=='hide').length;
  const cats=SC_CATS.filter(([k])=>k==='all'||(k==='game'?!!gmData():SCENES.some(s=>inL(s)&&(s.kind||'film')===k)));   // 13.9.62: «Игры» встаёт сам
  const cat=cats.some(([k])=>k===store.kinoCat)?store.kinoCat:'all';
  const list=SCENES.filter(s=>inL(s)&&(cat==='all'||(s.kind||'film')===cat));
  // сериал с несколькими сценами — одна карточка, внутри список его сцен
  const shows={},cards=[];
  for(const s of list){if(s.show){if(!shows[s.show]){shows[s.show]=[];cards.push({show:s.show});}shows[s.show].push(s);}else cards.push({s});}
  const html=cards.map(c=>{if(c.s)return kinoCard(c.s);const L=shows[c.show];if(L.length===1)return kinoCard(L[0]);const s=L[0];
    return `<button class="kposter ${s.theme} show poster anim${L.every(x=>scMasterPct(x)===100)?' mastered':''}" data-show="${esc(c.show)}"><span class="kp-img" style="background-image:url('${scCover(s,'poster.jpg')}'),url('${scCover(s,'cover.jpg')}')"></span><span class="kp-grad"></span>${lvcHTML(L.reduce((a,y)=>(y.lvl||3)<(a.lvl||3)?y:a,L[0]))}<span class="kp-t"><em>${SC_KIND[s.kind]||'Сцены'}</em><b>${esc(c.show)}</b><small>${L.length} ${plural(L.length,['сцена','сцены','сцен'])}</small></span></button>`;}).join('');
  const GS=cat==='game'?(window.__DATA&&window.__DATA.GAMES||{}):{};   // 13.9.62: игр-сцен ещё нет — карточки игр из GAMES
  const gcards=cat==='game'?Object.keys(GS).map(gid=>{const g=GS[gid],hn=gmHeroes().length;   // 13.9.63: считаем героев с живыми диалогами; обложка — key art игры из R2
    return `<button class="kposter noir show poster anim" data-g="${gid}"><span class="kp-img" style="background-image:${g.cover?`url('${assetUrl(g.cover)}'),`:''}linear-gradient(150deg,#3A3226,#14100A)"></span><span class="kp-grad"></span><span class="kp-t"><em>Игра</em><b>${esc(g.name)}</b><small>${hn} ${plural(hn,['герой','героя','героев'])} · диалоги</small></span></button>`;}).join(''):'';
  return `<h1 class="title anim">${ndOn()?'Кино':'Кинозал'}</h1>
    <p class="lead anim" style="margin:4px 0 12px">${kl==='de'?'Сцены на немецком: дубляж и немецкое кино. Учишь немецкий по живой речи.':'Смотришь сцену с субтитрами, разбираешь живые фразы, проверяешь себя.'}</p>
    ${nL('de')?`<div class="dx-lang klang anim"><button data-kl="en" class="${kl==='en'?'on':''}">${FLAG.en} English <i>${nL('en')}</i></button><button data-kl="de" class="${kl==='de'?'on':''}">${FLAG.de} Deutsch <i>${nL('de')}</i></button></div>`:''}
    <button class="srch-pill anim" onclick="renderSearch()">${ui('search')}<span>Найти фразу, сцену или слово</span></button>
    ${cats.length>2?`<div class="kcats anim">${cats.map(([k,l])=>`<button data-cat="${k}" class="${cat===k?'on':''}">${l}</button>`).join('')}</div>`:''}
    <div class="kgrid${kl==='de'?' k-de':''}">${cat==='game'?gcards:html}</div>
    <div class="ksoon anim"><b>Скоро</b> новые сцены, серии и клипы</div>`;
}
function bindKino(){if($('.n-kino'))return ndBindKino();$$('[data-sc]').forEach(b=>b.onclick=()=>{haptic('medium');sfx('tap');renderScene(b.dataset.sc);});
  $$('[data-cat]').forEach(b=>b.onclick=()=>{sfx('sel');store.kinoCat=b.dataset.cat;save();renderTab('kino');});
  $$('[data-kl]').forEach(b=>b.onclick=()=>{if(b.dataset.kl===kinoLang())return;sfx('page');haptic('light');store.kinoLang=b.dataset.kl;save();renderTab('kino');});
  $$('[data-show]').forEach(b=>b.onclick=()=>{haptic('medium');renderShow(b.dataset.show);});
  $$('[data-g]').forEach(b=>b.onclick=()=>{haptic('medium');sfx('tap');renderGameScreen(b.dataset.g);});}   // 13.9.62
// страница сериала: все его сцены
function renderShow(name){
  const L=SCENES.filter(s=>s.show===name);if(!L.length){renderTab('kino');return;}
  screen='show';backBtn(true);setWorld('neutral');
  const se=s=>{const m=/S(\d+)E(\d+)/.exec(s.ep||'');return m?[+m[1],+m[2]]:null;};
  const S=[...L].sort((a,b)=>{const x=se(a)||[0,0],y=se(b)||[0,0];return x[0]-y[0]||x[1]-y[1];}),ser=S.some(se);
  const lr=S.reduce((a,s)=>a+scLearned(s),0),tt=S.reduce((a,s)=>a+scTotal(s),0),pc=tt?Math.round(lr/tt*100):0;
  const vis=S.filter(s=>flagOf('scene-'+s.id)!=='hide');
  const nx=vis.find(s=>scP(s.id).done.length<s.parts.length)||vis[0];
  const lab=s=>{const e=se(s);return e?`${e[1]} серия · ${s.sub}`:s.sub||s.title;};
  const groups=ser?[...new Set(S.map(s=>(se(s)||[0])[0]))].map(n=>[n?`Сезон ${n}`:'Сцены',S.filter(s=>(se(s)||[0])[0]===n)]):[['Сцены',S]];
  if(ndOn()){const P0=S[0],bdi=filmImg(P0,innerWidth>=1000?'bd.jpg':'bdm.jpg');   // 13.9.39: сериал в «Новом» — как страница сцены (кадр, метки, одна кнопка, сцены строками)
    const row=s=>{const P=scP(s.id),d=P.done.length,n=s.parts.length,e=se(s),lk=premNeed('scene')&&!premFree(s);
      return `<button class="n-ep${s===nx?' cur':''}" data-sc="${s.id}"><span class="n-th" style="background-image:url('${scCover(s,'cover.jpg')}')"></span><span class="n-et"><small>${e?`S${String(e[0]).padStart(2,'0')}E${String(e[1]).padStart(2,'0')} · `:''}${d?`пройдено ${d} из ${n}`:n+' '+plural(n,['эпизод','эпизода','эпизодов'])}</small><b>${esc(s.sub||s.title)}</b></span>${s.age&&!store.age18?'<span class="n-lk">18+</span>':lk?'<span class="n-lk">🔒</span>':d===n?'<span class="n-stars">✓</span>':'<span class="n-cv">›</span>'}${s===nx&&d?`<i class="n-pb" style="--w:${Math.round(d/n*100)}%"></i>`:''}</button>`;};
    mount(`<div class="n-scr n-scene n-show"><div class="n-shero" style="background-image:${bdi?`url('${bdi}'),`:''}url('${scCover(P0,'cover.jpg')}')"><button class="n-back" id="bBtn" aria-label="Назад"><svg class="n-ic" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button></div>
      <div class="n-st"><div class="n-chips"><span class="n-chip ${cefrOf(S.reduce((a,y)=>(y.lvl||3)<(a.lvl||3)?y:a,S[0])).toLowerCase()}">${lvW(cefrOf(S.reduce((a,y)=>(y.lvl||3)<(a.lvl||3)?y:a,S[0])))}</span><span class="n-chip n">${esc(SC_KIND[P0.kind]||'Сцены')}</span><span class="n-chip n">${S.length} ${plural(S.length,['сцена','сцены','сцен'])}</span></div>
        <h3 class="n-h">${esc(name)}</h3><p class="n-mute">Собрано ${lr} из ${tt} фраз</p></div>
      ${nx?`<button class="n-pbtn" id="shGo">▶ ${scP(nx.id).done.length?'Продолжить':'Смотреть'} · ${esc(nx.sub||nx.title)}</button>`:''}
      ${groups.map(([h,G])=>`${groups.length>1||h!=='Сцены'?`<div class="n-lbl"><span>${h}</span><span>${G.length}</span></div>`:''}<div class="n-eps">${G.map(row).join('')}</div>`).join('')}</div>`,'tabscr showscr');}
  else mount(`<div class="page-head"><button class="icon-btn" id="bBtn" aria-label="Назад">${ui('back')}</button><h1 class="title">${esc(name)}</h1></div>
    <section class="sh-hero ${S[0].theme}" style="--shp:url('${assetUrl(scKey(S[0],'poster.jpg'))}')"><span class="sh-poster"></span>
      <div class="sh-info"><em>${SC_KIND[S[0].kind]||'Сцены'} · ${S.length} ${plural(S.length,['сцена','сцены','сцен'])}</em>
        <b>${lr} из ${tt} фраз</b><span class="sh-bar"><i style="width:${pc}%"></i></span>
        ${nx?`<button class="sh-go" id="shGo">${scP(nx.id).done.length?'Продолжить':'Смотреть по порядку'} ${SI.play}</button><small>${esc(lab(nx))}</small>`:''}</div></section>
    ${groups.map(([h,G])=>`<h2 class="sh-season">${h}</h2><div class="kgrid${S.every(x=>x.lang==='de')?' k-de':''}">${G.map(s=>kinoCard({...s,title:lab(s)})).join('')}</div>`).join('')}`,'tabscr showscr');
  $('#bBtn').onclick=()=>{sfx('tap');renderTab('kino');};
  try{paintTabbar('kino');}catch(e){}
  if($('#shGo')){if(ndOn())nCta($('#shGo'),()=>renderScene(nx.id));else $('#shGo').onclick=()=>{haptic('medium');renderScene(nx.id);};}   // 13.9.49: в «Новом» — заливка и ✓ перед переходом
  $$('[data-sc]').forEach(b=>b.onclick=()=>{haptic('medium');renderScene(b.dataset.sc);});applyFlagsUI();}

/* =====================================================================================
   9.2 — ПРОГРЕСС, КОТОРЫЙ ЗАТЯГИВАЕТ
   • Сцены по сложности: лёгкие открыты сразу, остальные — за монеты (монеты дают эпизоды, задания в видео, финалы, игры).
   • Внутри сцены — путь эпизодов: следующий открывается после проверки предыдущего, за каждый 1–3 звезды.
   • В конце пути — «Финал сцены»: фразы всей сцены на слух, без субтитров.
   ===================================================================================== */
const SC_PRICE=s=>s.mode||s.kind==='clip'||!s.lvl||s.lvl<=2?0:s.lvl===3?400:800;   // 10.2: пилотные режимы — без цены
// 11.2: админ видит всё открытым, пока не включит «Смотреть как игрок» (store.admPlayer)
const ADM_OPEN=()=>FLAG_ADMIN&&!store.admPlayer;
const scOpen=s=>!!s&&(ADM_OPEN()||!SC_PRICE(s)||!!(store.scOwn&&store.scOwn[s.id])||scP(s.id).done.length>0);
const scStars=(s,i)=>{const P=scP(s.id);return (P.st&&P.st[i])||(P.done.includes(i)?1:0);};
const scEpOpen=(s,i)=>ADM_OPEN()||i===0||scP(s.id).done.includes(i-1)||scP(s.id).done.includes(i);
const scBossOpen=s=>ADM_OPEN()||s.parts.every((p,i)=>scP(s.id).done.includes(i));
const starsHTML=n=>`<span class="stars3">${[1,2,3].map(k=>`<i class="${k<=n?'on':''}">★</i>`).join('')}</span>`;
function addGold(n,from){if(!n)return 0;store.gold=(store.gold||0)+n;save();if(n>0)setTimeout(()=>goldFX(n,from),350);return n;}
// 11.6: монеты — золотая плашка «+N» взлетает и улетает в счётчик в шапке (если он на экране), счётчик подпрыгивает
function scBuy(s){const pr=SC_PRICE(s),g=store.gold||0,ok=g>=pr;scCloseSheet();const w=document.createElement('div');w.className='sc-sheetwrap';
  w.innerHTML=`<div class="sc-sheet buy-sheet"><div class="bs-img" style="background-image:url('${scCover(s,'cover.jpg')}')"><span>🔒</span></div>
    <em>${SC_KIND[s.kind]||'Сцена'} · сложность ${scDots(s.lvl||1)}</em><b>${esc(s.title)}</b><small>${esc(s.sub||'')}</small>
    <div class="bs-price">Открыть за <b>${ui('coin')} ${fmt(pr)}</b><span>у тебя ${fmt(g)}</span></div>
    ${ok?`<button class="btn bs-go">Открыть сцену</button>`:`<p class="bs-need">Не хватает <b>${fmt(pr-g)}</b>. Монеты дают: проверка эпизода — до +60, ответ на задание в видео — +5, финал сцены — +150, а ещё игры.</p>`}
    <button class="bs-x">${ok?'Позже':'Понятно'}</button></div>`;
  w.onclick=e=>{if(e.target===w||e.target.closest('.bs-x')){w.remove();return;}
    if(e.target.closest('.bs-go')){store.gold-=pr;store.scOwn=store.scOwn||{};store.scOwn[s.id]=1;save();w.remove();sfx('win');haptic('ok');toast('🔓 Сцена открыта');try{ev('sc_buy',s.id);}catch(x){}renderScene(s.id);}};
  document.body.appendChild(w);}
// путь эпизодов на странице сцены
function scPathHTML(s){const P=scP(s.id),next=s.parts.findIndex((p,i)=>!P.done.includes(i)),bo=scBossOpen(s);
  return `<div class="path"><div class="path-h"><b>Путь сцены</b><span>${P.done.length} из ${s.parts.length} · ${s.parts.reduce((a,p,i)=>a+scStars(s,i),0)+(P.boss||0)} ★</span></div>
    ${s.parts.map((p,i)=>{const st=scStars(s,i),open=scEpOpen(s,i),done=P.done.includes(i),cur=i===next;
      return `<button class="pn${done?' done':''}${cur?' cur':''}${open?'':' lock'}" data-i="${i}" style="--x:${[0,1,0,-1][i%4]}">
        <span class="pn-c" style="background-image:url('${assetUrl(scEpKey(s,i,'jpg'))}')"><i>${open?(done?'✓':i+1):'🔒'}</i></span>
        <span class="pn-t"><b>${esc(p.t)}</b><small>${scFmt(p.b-p.a)} · ${scAct(p.ph).length} ${plural(scAct(p.ph).length,['фраза','фразы','фраз'])}</small>${done?starsHTML(st):''}</span>
        ${cur?`<span class="pn-go">${i?'Дальше':'Начать'}</span>`:''}</button>`;}).join('')}
    <button class="pn boss${bo?'':' lock'}${P.boss?' done':''}${next<0&&!P.boss?' cur':''}" id="scBoss" style="--x:0"><span class="pn-c"><i>${bo?'👑':'🔒'}</i></span>
      <span class="pn-t"><b>Финал сцены</b><small>${bo?'Фразы всей сцены на слух, без субтитров'+' · +150':'Откроется, когда пройдёшь все эпизоды'}</small>${P.boss?starsHTML(P.boss):''}</span>${next<0&&!P.boss?'<span class="pn-go">Финал</span>':''}</button></div>`;}
function scPathBind(s){$$('.pn[data-i]').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(!scEpOpen(s,i)){haptic('err');toast(`Сначала пройди эпизод ${String(i).padStart(2,'0')}`);return;}sfx('tap');renderScEp(s.id,i);});
  const bb=$('#scBoss');if(bb)bb.onclick=()=>{if(!scBossOpen(s)){haptic('err');toast('Финал откроется, когда пройдёшь все эпизоды');return;}sfx('tap');scBossStart(s.id);};}
function scBossStart(id){const s=scOf(id),L=shuffle(s.parts.flatMap(p=>scAct(p.ph)).filter(f=>f.b>f.a)).slice(0,SC_PORT);   // 13.9.69: финал — 3 фразы (было 8)
  if(!L.length){toast('В этой сцене нет фраз');return;}renderScQuiz(id,{list:L,lesson:true,boss:true});}

/* ---------- тест уровня: 1 минута при первом входе в эпизод ---------- */
const LVQ=[['See you tomorrow.','Увидимся завтра.',['Посмотри на меня завтра.','Я видел тебя вчера.']],
  ["I'm looking for a job.",'Я ищу работу.',['Я смотрю на работу.','Я нашёл работу.']],
  ['Could you give me a hand?','Можешь мне помочь?',['Можешь дать мне руку?','Пожми мне руку.']],
  ["I've been waiting for ages.",'Я жду целую вечность.',['Я ждал много лет назад.','Я буду ждать годами.']],
  ["It's not worth it.",'Оно того не стоит.',['Это ничего не весит.','Это не стоит денег.']],
  ["I'd rather stay home.",'Я лучше останусь дома.',['Я быстро вернусь домой.','Я редко бываю дома.']],
  ["Let's call it a day.",'На сегодня хватит.',['Давай назовём это днём.','Позвони мне днём.']],
  ['He bailed on us.','Он нас кинул.',['Он внёс за нас залог.','Он нас спас.']]];
function renderLevelTest(done){let n=0,ok=0,bad=0;screen='lvltest';backBtn(true);
  const fin=()=>{store.lvl=ok>=5?'b':'a';save();const b=store.lvl==='b';sfx('win');
    mount(`<div class="lvl-wrap"><div class="lvl-card"><span class="lvl-k">Тест уровня</span><div class="lvl-big">${ok} / ${LVQ.length}</div>
      <b>${b?'Ты знаешь базу':'Начнём с подсказками'}</b><p>${b?'Задания обычной сложности: собирать фразы по памяти, вписывать слова, применять в жизни.':'Задания полегче: выбрать перевод, собрать фразу без лишних слов и с подсказкой, вписать слово из вариантов. Станет проще — переключишь в настройках.'}</p>
      <button class="btn" id="lvGo">Поехали →</button><button class="ht-alt" id="lvSw">${b?'Хочу полегче':'Хочу посложнее'}</button></div></div>`,'lvlscr');
    $('#lvGo').onclick=()=>{sfx('tap');done&&done();};$('#lvSw').onclick=()=>{store.lvl=b?'a':'b';save();toast(store.lvl==='a'?'Режим новичка':'Обычная сложность');done&&done();};};
  const show=()=>{const [en,ru,tr]=LVQ[n],opts=shuffle([ru,...tr]);
    mount(`<div class="lvl-wrap"><div class="lvl-card"><span class="lvl-k">Тест уровня · ${n+1} из ${LVQ.length}</span><div class="lvl-bar"><i style="width:${n/LVQ.length*100}%"></i></div>
      <p class="lvl-q">Что значит</p><b class="lvl-en">${esc(en)}</b><div class="lvl-o">${opts.map(o=>`<button data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div>
      <button class="ht-alt" id="lvNo">Не знаю</button></div></div>`,'lvlscr');
    const next=right=>{if(right)ok++;else bad++;n++;setTimeout(()=>{if(n>=LVQ.length||(bad>=3&&n<=5))fin();else show();},right?350:650);};
    $$('.lvl-o button').forEach(b=>b.onclick=()=>{const r=b.dataset.v===ru;b.classList.add(r?'ok':'bad');sfx(r?'good':'bad');$$('.lvl-o button').forEach(x=>x.disabled=true);if(!r)$$('.lvl-o button').forEach(x=>{if(x.dataset.v===ru)x.classList.add('ok');});next(r);});
    $('#lvNo').onclick=()=>next(false);};
  show();}


/* ---------- музыка: тихо, случайный трек; тап по плашке — плеер ---------- */
function musSheet(){if(!MUSC)return;const s=scOf(MUSC.id),L=musOf(s);scCloseSheet();const w=document.createElement('div');w.className='sc-sheetwrap';let tk=0;
  const draw=()=>{if(!MUSC){w.remove();clearInterval(tk);return;}const k=MUSC.k,m=L[k],play=MUS&&!MUS.paused,d=MUS&&isFinite(MUS.duration)?MUS.duration:0,c=MUS?MUS.currentTime:0;
    w.innerHTML=`<div class="sc-sheet mus-sheet"><div class="ms-top"><span class="ms-art${play?' spin':''}" style="background-image:url('${musArt(s,m)}')"></span><span class="ms-ti"><em>Саундтрек · ${esc(s.title)}</em><b>${esc(m.t)}</b><small>${esc(m.by)}</small></span></div>
      <div class="ms-seek"><input type="range" class="ms-r" min="0" max="100" step="0.1" value="${d?(c/d*100).toFixed(1):0}" aria-label="Перемотка"><span><i class="ms-cur">${musFmt(c)}</i><i>${musFmt(d)}</i></span></div>
      <div class="ms-c"><button data-m="prev" aria-label="Назад">${MI.prev}</button><button data-m="pp" class="big" aria-label="Играть или пауза">${play?SI.pause:SI.play}</button><button data-m="next" aria-label="Дальше">${MI.next}</button></div>
      <label class="ms-vol"><span>🔈</span><input type="range" class="ms-vr" min="0" max="1" step="0.05" value="${musVol()}" aria-label="Громкость"><span>🔊</span></label>
      ${L.length>1?`<div class="ms-list">${L.map((x,i)=>`<button data-k="${i}" class="${i===k?'on':''}"><span>${i===k&&play?'♪':i+1}</span><b>${esc(x.t)}</b><small>${esc(x.by)}</small></button>`).join('')}</div>`:''}
      <label class="ms-auto"><input type="checkbox" ${store.musAuto===false?'':'checked'}><span>Включать музыку, когда заходишь в сцену</span></label>
      <div class="ms-f"><button data-m="off">Выключить музыку</button><button data-m="x">Закрыть</button></div></div>`;
    const r=w.querySelector('.ms-r');r.oninput=()=>{if(MUS&&isFinite(MUS.duration)){MUS.currentTime=+r.value/100*MUS.duration;musTick();}};
    const vr=w.querySelector('.ms-vr');vr.oninput=()=>{store.musVol=+vr.value;clearInterval(MUSFADE);musSetVol(store.musVol);};vr.onchange=()=>save();
    w.querySelector('.ms-auto input').onchange=e=>{store.musAuto=e.target.checked;save();};};
  w.onclick=e=>{if(e.target===w){w.remove();clearInterval(tk);return;}const b=e.target.closest('[data-m],[data-k]');if(!b)return;sfx('tap');
    if(b.dataset.k!=null){musPlay(s.id,+b.dataset.k);setTimeout(draw,60);return;}const v=b.dataset.m;
    if(v==='x'){w.remove();clearInterval(tk);return;}if(v==='off'){const id=MUSC&&MUSC.id;musStop();MUSOFF=id;w.remove();clearInterval(tk);return;}
    if(v==='pp')musToggle();if(v==='next')musNext();if(v==='prev'){if(MUS&&MUS.currentTime>3){MUS.currentTime=0;}else musPrev();}setTimeout(draw,60);};
  draw();document.body.appendChild(w);
  tk=setInterval(()=>{if(!document.body.contains(w)){clearInterval(tk);return;}const r=w.querySelector('.ms-r'),c=w.querySelector('.ms-cur');if(MUS&&r&&document.activeElement!==r&&isFinite(MUS.duration)){r.value=(MUS.currentTime/MUS.duration*100).toFixed(1);c.textContent=musFmt(MUS.currentTime);}},400);}
function musFadeIn(){if(!MUS)return;const to=musVol();musSetVol(0);clearInterval(MUSFADE);MUSFADE=setInterval(()=>{if(!MUS){clearInterval(MUSFADE);return;}musSetVol(Math.min(to,musGetVol()+to/30));if(musGetVol()>=to-0.001)clearInterval(MUSFADE);},100);}

/* ---------- все фразы сцены — столбиками: где так можно говорить ---------- */
// 13.6.1: фразы и реплики эпизода открываются только после его первого просмотра (Андрей: иначе всё сразу уходит в словарь)
const epSeen=(s,i)=>{if(ADM_OPEN())return true;const P=scP(s.id);return !!(P.w[i]||P.done.includes(i));};
const scSeenN=s=>s.parts.reduce((a,p,i)=>a+(epSeen(s,i)?scAct(p.ph).length:0),0);
const fogTxt=t=>String(t||'').replace(/[A-Za-z]/g,c=>{const a=c<='Z'?'ABCDEFGHIJKLMNOPRSTUVW':'abcdefghiklmnoprstuvwy';return a[Math.floor(Math.random()*a.length)];}).replace(/[А-Яа-яЁё]/g,c=>{const a=c===c.toUpperCase()?'АБВГДЕЖЗИКЛМНОПРСТУ':'абвгдежзиклмнопрстуя';return a[Math.floor(Math.random()*a.length)];}).replace(/[ÄÖÜäöüß]/g,'e');
function renderSceneSum(id){const s=scOf(id);if(!s)return;SCUR={id,i:0};const all=s.parts.flatMap((p,i)=>epSeen(s,i)?scAct(p.ph):[]),shut=s.parts.map((p,i)=>({p,i})).filter(x=>!epSeen(s,x.i));
  const G=[['all','Можно везде','нейтрально и вежливо',f=>['neutral','formal'].includes(scTag(f)[1])],['casual','Среди своих','разговорное',f=>scTag(f)[1]==='casual'],['rude','Грубо','только с друзьями',f=>scTag(f)[1]==='rude']];
  const kws=[],seen=new Set();all.forEach(f=>kwOf(f).forEach((k,j)=>{const key=String(k[1]||k[0]).toLowerCase();if(!seen.has(key)){seen.add(key);kws.push({f,j,k});}}));
  const de=scL()==='de'&&!scIsDe();
  scMount(s,`<div class="sc-head"><button class="sc-back" id="scb">${ui('back')}</button><div><span class="sc-meta">${esc(s.title)}</span><h1>Все фразы сцены</h1></div></div>
    <p class="ss-lead">${all.length?`${all.length} ${plural(all.length,['фраза','фразы','фраз'])} из ${scTotal(s)}. Нажми на любое слово — перевод и пример. <i class="kw demo">Подсвеченные</i> — самые полезные.`:'Фразы появятся здесь, когда посмотришь эпизод.'}</p>
    ${shut.length?`<div class="ss-shut">${shut.map(x=>{const L=scAct(x.p.ph),can=scEpOpen(s,x.i);
      return `<section class="ss-fog" data-i="${x.i}"><header><b>Эпизод ${x.i+1} · ${esc(x.p.t)}</b><small>${L.length} ${plural(L.length,['фраза','фразы','фраз'])}</small></header>
        <div class="ss-fogc" aria-hidden="true">${L.slice(0,4).map(f=>`<div class="ss-it"><div class="ss-en">${esc(fogTxt(scT(f)))}</div><div class="ss-ru">${esc(fogTxt(f.ru))}</div></div>`).join('')}</div>
        <i class="ss-mist m1"></i><i class="ss-mist m2"></i>
        <div class="ss-fogl"><b>🎬 Посмотри эпизод — фразы проявятся</b>${can?`<button class="sc-btn" data-ep="${x.i}">Смотреть эпизод ${x.i+1} →</button>`:`<span>Сначала эпизод ${x.i}</span>`}</div></section>`;}).join('')}</div>`:''}
    <div class="ss-cols">${G.map(([k,h,sub,fn])=>{const L=all.filter(fn);if(!L.length)return '';
      return `<section class="ss-col ss-${k}"><header><b>${h}</b><small>${sub} · ${L.length}</small></header>${L.map(f=>`<article class="ss-it" data-fid="${f.id}">
        <div class="ss-row"><div class="ss-en">${kwWrap(f)}</div><button class="ss-play" data-fid="${f.id}" aria-label="Послушать">${SI.play}</button></div><div class="ss-ru">${esc(f.ru)}</div>
        ${scNoteS(f)?`<p class="ss-use">${esc(scNoteS(f))}</p>`:''}${f.fact&&!de?`<p class="ss-fact">✦ ${esc(f.fact)}</p>`:''}</article>`).join('')}</section>`;}).join('')}
    ${kws.length?`<section class="ss-col ss-words"><header><b>Важные слова</b><small>${kws.length}</small></header><div class="ss-wl">${kws.map(x=>`<span class="ss-w" data-fid="${x.f.id}"><i class="kw" data-kw="${x.j}" tabindex="0" role="button">${esc(x.k[1]||x.k[0])}</i><small>${esc(x.k[2])}</small></span>`).join('')}</div></section>`:''}</div>`,'scsum');
  phBind(document.querySelector('.scn'),el=>{const c=el.closest('[data-fid]');return c?all.find(f=>f.id===c.dataset.fid):null;});
  $$('.ss-play').forEach(b=>b.onclick=e=>{e.stopPropagation();scClip(id,b.dataset.fid,b);});
  $$('.ss-fog [data-ep]').forEach(b=>b.onclick=()=>{sfx('tap');renderScEp(id,+b.dataset.ep);});
  // эпизод досмотрен с прошлого захода — дымка рассеивается над его фразами
  {store.ssRev=store.ssRev||{};const was=store.ssRev[id]||[],now=s.parts.map((_,i)=>i).filter(i=>epSeen(s,i)),fresh=now.filter(i=>!was.includes(i));
   if(fresh.length&&was.length+now.length&&fxOK()){const fids=new Set(s.parts.flatMap((p,i)=>fresh.includes(i)?scAct(p.ph).map(f=>f.id):[]));
     document.querySelectorAll('.ss-it[data-fid]').forEach((el,k)=>{if(!fids.has(el.dataset.fid))return;el.classList.add('ss-reveal');el.style.setProperty('--d',(Math.min(k,12)*70)+'ms');});
     setTimeout(()=>{sfx('unlock');haptic('light');},250);}
   store.ssRev[id]=now;save();}
  $('#scb').onclick=()=>{if(navBack())return;sfx('tap');renderScene(id);};}

/* ---- экраны сцены ---- */
const scOf=id=>SCENES.find(s=>s.id===id);
// 11.1: у сцен с skipIntro — если до первой реплики больше 3 с тишины, эпизод стартует за секунду до неё (без перенарезки видео)
const scStartAt=(s,p)=>{if(!s.skipIntro)return 0;const r=s.subs.filter(r=>r[0]>=p.a-0.3&&r[0]<p.b).sort((x,y)=>x[0]-y[0])[0];const t=r?r[0]-p.a:0;return t>3?Math.max(0,t-1):0;};
// 9.1: у каждой сцены своя атмосфера — размытый кадр сцены фоном и цвет фильма (а не одинаковая чёрная пустота)
function scAmb(s){let a=document.getElementById('amb');if(!a){a=document.createElement('div');a.id='amb';a.setAttribute('aria-hidden','true');a.innerHTML='<i></i><b></b>';document.body.prepend(a);}
  // 9.2.1: настоящее фото фоном — bg.jpg из папки сцены (если залит), иначе обложка сцены
  const u=scCover(s,'cover.jpg'),bg=assetUrl(scKey(s,'bg.jpg'));if(a.dataset.u!==u){a.dataset.u=u;a.firstChild.style.backgroundImage=`url('${bg}'),url('${u}')`;}
  }   // 13.0: видеофона в сценах нет — фоны-награды смотрят в «Коллекции» на Главной
// фоны-видео, которые не загрузились (404) — больше не просим
const AMB_BAD={};
function ambPause(on){const v=document.querySelector('#amb video');if(!v||!v.dataset.sid)return;
  if(on){v.pause();return;}if(v.paused&&document.body.dataset.scn){const p=v.play();if(p&&p.catch)p.catch(()=>{});}}
function scMount(s,html,scr,cls){scStop();screen=scr;backBtn(true);document.body.dataset.scn=s.theme;document.body.dataset.scr=scr;scAmb(s);mount(`<div class="scn ${s.theme} scr-${scr}${cls?' '+cls:''}">${html}</div>`,'scnscr');musUI();}
function renderScene(id){
  if(scGate(id))return;
  if(!scOpen(scOf(id))){scBuy(scOf(id));return;}
  {const s0=scOf(id);if(s0&&s0.kind==='clip'&&!s0._srtTry){s0._srtTry=true;clipLoad(s0).then(ok=>{if((ok||(CLIPNOTES&&CLIPNOTES[id]))&&SCUR&&SCUR.id===id&&document.querySelector('.scn .sc-top')&&!document.querySelector('.scn .sc-q,.scn #scvw'))renderScene(id);});}}
  const s=scOf(id),P=scP(id);SCUR={id,i:0};store.kinoLang=scLang(s);   // 13.5: «назад» из сцены — в Кинозал на языке этой сцены
  const n=s.parts.length,d=P.done.length,L=scLearned(s),T=scTotal(s),next=s.parts.findIndex((p,i)=>!P.done.includes(i));
  // 13.9.11 (Андрей: «кнопка начать где в ебенях, а первым показывается то, что нельзя»): главное — сразу под названием,
  // потом эпизоды; прогресс — одной строкой и только если есть; «Все фразы» — только когда что-то открыто; остальное — ниже
  const goTxt=d===0?'▶ Смотреть эпизод 1':next<0?(P.boss?'↺ Повторить сцену':'👑 Финал сцены'):'▶ Продолжить · эпизод '+(next+1),M=scMastered(s);
  if(ndOn()){scMount(s,ndSceneHTML(s),'scene','n-scn');ndBindScene(s);return;}
  scMount(s,`
    <div class="sc-head"><button class="sc-back" id="scb">${ui('back')}</button><span class="sc-meta">Сцены</span></div>
    <div class="sc-ban sc-ban2" style="--ban:url('${scCover(s,'cover.jpg')}')"><span class="sc-ban-k">${SC_KIND[s.kind]||'Сцена'}</span><span class="sc-ban-deco" aria-hidden="true"></span></div>
    ${s.kind==='clip'?clipNotesHTML(s):''}
    ${s.videoUrl?`<div class="clip-links sc-card"><a class="sc-btn" href="${esc(s.videoUrl)}" target="_blank" rel="noopener">▶ Смотреть официальный клип</a>${s.credit?`<small>${esc(s.credit)}</small>`:''}</div>`:''}
    <section class="sc-top sc-card sc-top2">
      ${ndOn()?`<div class="nd-chips">${lvcHTML(s,1)}<span>${esc(SC_KIND[s.kind]||'Сцена')}${ndYear(s)?' · '+ndYear(s):''}</span><span>${n} ${plural(n,['эпизод','эпизода','эпизодов'])}</span></div>`:`<div class="sc-meta">${esc(s.ep)}</div>`}<h1>${esc(s.title)}</h1><div class="sc-sub">${esc(s.sub)}</div>
      <button class="sc-btn sc-go1" id="scgo">${goTxt}</button>
      ${L||M?`<div class="sc-prog sc-prog1"><span>Выучено ${L} из ${T}${M?` · надолго ${M}`:''}${scMasterPct(s)===100?' · 🏆':''}</span></div><div class="sc-bar"><i style="width:${Math.round(L/T*100)}%"></i></div>`:''}
    </section>
    ${scPathHTML(s)}
    <section class="sc-more">
      ${scDue(s).length?`<button class="sc-btn ghost" id="screv">Повторить фразы: ${scDue(s).length} →</button>`:''}
      ${scSeenN(s)?`<button class="sc-allph" id="scAllPh">📚 Все фразы сцены <i>${scSeenN(s)}/${scTotal(s)}</i><span>›</span></button>`:''}
      <button class="sc-btn ghost kv-open" id="scKv">⚔️ Дуэль с другом по этой сцене</button>
      <details class="sc-about"><summary>О сцене · сложность и польза</summary>${scRateHTML(s)}<small class="sc-mhint">«Надолго» — фраза держится в памяти после повторений через 1, 3 и 7 дней.</small></details>
    </section>
    ${musHTML(s)}
    <p class="sc-foot">${s.subs.length} реплик с переводом</p>`,'scene');
  $('#scb').onclick=()=>{sfx('tap');renderTab('kino');};
  $('#scgo').onclick=()=>{if(next<0&&scBossOpen(s)&&!P.boss){scBossStart(id);return;}renderScEp(id,next<0?0:next);};
  if(P.boss&&$('#scKv')){$('#scKv').insertAdjacentHTML('afterend',`<button class="sc-btn ghost" id="scdir">🎬 Режиссёрская версия${store.dirCut&&store.dirCut[id]?' ✓':''}</button>`);$('#scdir').onclick=()=>{sfx('reel');renderDirCut(id);};}
  if($('#screv'))$('#screv').onclick=()=>renderScQuiz(id,'rev');
  if($('#scAllPh'))$('#scAllPh').onclick=()=>{sfx('tap');renderSceneSum(id);};
  if($('#scKv'))$('#scKv').onclick=()=>{sfx('tap');kvSheet(id);};
  scPathBind(s);
  musBind(s);
  $$('.pn[data-i]').forEach(b=>flagMark(b,flagEpKey(id,+b.dataset.i),p0t(s,+b.dataset.i)));
}
// 13.9.39 (ТЗ-13.9.32, P2 экран 8): страница сцены как в макете (.cell 8) — кадр во всю ширину, круглая «‹» поверх, метки, название, описание,
// одна кнопка «▶ Смотреть эпизод N · …»; эпизоды строками: пройденный — звёзды, текущий — обведён и шкала, закрытый — под плывущей дымкой; финал сцены — строкой;
// ниже — «Повторить фразы / Все фразы / Дуэль / Режиссёрская версия / О сцене» одним списком. «Как было» — старая разметка renderScene
function ndSceneHTML(s){const P=scP(s.id),n=s.parts.length,next=s.parts.findIndex((p,i)=>!P.done.includes(i)),bo=scBossOpen(s),due=scDue(s).length,seen=scSeenN(s);
  const bdi=filmImg(s,innerWidth>=1000?'bd.jpg':'bdm.jpg'),cf=cefrOf(s),yr=ndYear(s);
  const go=next<0?(P.boss?'↺ Повторить сцену':'👑 Финал сцены'):`▶ Смотреть эпизод ${next+1} · ${s.parts[next].t}`;
  const th=i=>`style="background-image:url('${assetUrl(scEpKey(s,i,'jpg'))}'),url('${scCover(s,'cover.jpg')}')"`;
  const ep=(p,i)=>{const open=scEpOpen(s,i),done=P.done.includes(i),cur=i===next,st=scStars(s,i),w=!!(P.w&&P.w[i]);
    return `<button class="n-ep${cur?' cur':''}${open?'':' lock'}${done?' done':''}" data-i="${i}"><span class="n-th" ${th(i)}></span>
      <span class="n-et"><small>Эпизод ${i+1}${done?' · пройден':cur?(w?' · досмотрен — к проверке':' · сейчас'):''}${!done&&epParts(s,i)>1?` · ${epParts(s,i)} ${plural(epParts(s,i),['часть','части','частей'])}`:''}</small><b>${esc(open?p.t:fogTxt(p.t))}</b></span>
      ${done?`<span class="n-sc${st>=3?' full':''}" style="--p:${Math.round(st/3*100)}" title="${st>=3?'Всё верно':'Можно лучше'}">${niSVG('tick')}</span>`:open?'<span class="n-cv">›</span>':'<span class="n-lk">🔒</span>'}${cur?`<i class="n-pb" style="--w:${w?62:8}%"></i>`:''}</button>`;};
  const it=(id,ic,t,sm)=>`<button id="${id}"><span class="n-li">${ic}</span><b>${t}</b>${sm!=null?`<small>${sm}</small>`:''}<span class="n-cv">›</span></button>`;
  return `<div class="n-scr n-scene">
    <div class="n-shero" style="background-image:${bdi?`url('${bdi}'),`:''}url('${scCover(s,'cover.jpg')}')"><button class="n-back" id="scb" aria-label="Назад"><svg class="n-ic" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button></div>
    <div class="n-st"><div class="n-chips"><span class="n-chip ${cf.toLowerCase()}">${lvW(cf)}</span><span class="n-chip n">${esc(SC_KIND[s.kind]||'Сцена')}${yr?' · '+yr:''}</span><span class="n-chip n">${n} ${plural(n,['эпизод','эпизода','эпизодов'])}</span>${s.age?'<span class="n-chip n">18+</span>':''}</div>
      <h3 class="n-h">${esc(s.title.replace(/\u2060/g,''))}</h3><p class="n-mute">${esc(s.sub||'')}</p></div>
    <button class="n-pbtn" id="scgo">${esc(go)}</button>
    <div class="n-eps">${s.parts.map(ep).join('')}
      <button class="n-ep boss${bo?'':' lock'}${P.boss?' done':''}${next<0&&!P.boss?' cur':''}" id="scBoss"><span class="n-th n-crown">👑</span><span class="n-et"><small>${bo?'Финал сцены · фразы на слух':'Финал сцены'}</small><b>${bo?'Без субтитров':'Откроется после всех эпизодов'}</b></span>${P.boss?`<span class="n-stars">${'★'.repeat(P.boss)}<i>${'★'.repeat(3-P.boss)}</i></span>`:bo?'<span class="n-cv">›</span>':'<span class="n-lk">🔒</span>'}</button></div>
    <div class="n-lst">${due?it('screv','🔁','Повторить фразы',due):''}${seen?it('scAllPh','📚','Все фразы сцены',seen+' из '+scTotal(s)):''}${it('scKv','⚔️','Дуэль с другом')}${P.boss?it('scdir','🎬','Режиссёрская версия',store.dirCut&&store.dirCut[s.id]?'✓':null):''}
      <details class="n-about"><summary><span class="n-li">ℹ️</span><b>О сцене</b><small>сложность и польза</small><span class="n-cv">›</span></summary>${scRateHTML(s)}</details></div>
    ${musHTML(s)}
  </div>`;}
function ndBindScene(s){const id=s.id,P=scP(id),next=s.parts.findIndex((p,i)=>!P.done.includes(i));
  $('#scb').onclick=()=>{sfx('tap');renderTab('kino');};
  $('#scgo').onclick=()=>{haptic('medium');sfx('tap');if(next<0&&scBossOpen(s)&&!P.boss){scBossStart(id);return;}renderScEp(id,next<0?0:next);};
  $$('.n-ep[data-i]').forEach(b=>{const i=+b.dataset.i;b.onclick=()=>{if(!scEpOpen(s,i)){haptic('err');b.classList.remove('shk');void b.offsetWidth;b.classList.add('shk');toast(`Сначала пройди эпизод ${i}`);return;}sfx('tap');renderScEp(id,i);};flagMark(b,flagEpKey(id,i),p0t(s,i));});
  const bb=$('#scBoss');if(bb)bb.onclick=()=>{if(!scBossOpen(s)){haptic('err');toast('Финал откроется, когда пройдёшь все эпизоды');return;}sfx('tap');scBossStart(id);};
  if($('#screv'))$('#screv').onclick=()=>renderScQuiz(id,'rev');
  if($('#scAllPh'))$('#scAllPh').onclick=()=>{sfx('tap');renderSceneSum(id);};
  if($('#scKv'))$('#scKv').onclick=()=>{sfx('tap');kvSheet(id);};
  if($('#scdir'))$('#scdir').onclick=()=>{sfx('reel');renderDirCut(id);};
  musBind(s);}
const p0t=(s,i)=>s.title+' · '+(s.parts[i]?s.parts[i].t:'');
// 12.5: «Режиссёрская версия» — после финала сцены: все эпизоды подряд, без пауз и объяснений, только оригинальные субтитры.
// Досмотрел до конца — значок «🎬 Режиссёрская версия» на карточке сцены (store.dirCut[sid]).
let SC_DIR=false;
function renderDirCut(id,k){const s=scOf(id);if(!s)return;k=k||0;if(!k&&premGate('dir',()=>renderScene(id)))return;const p=s.parts[k];SC_DIR=true;SCUR={id,i:k};
  scMount(s,`<div class="sc-head"><button class="sc-back" id="scb">${ui('close')}</button><div><span class="sc-meta">🎬 Режиссёрская версия · ${k+1} из ${s.parts.length}</span><h1>${esc(s.sub||s.title)}</h1></div></div>
    <div class="sc-v" id="scvw"><div class="sc-over" id="scvo"><button id="scplay" aria-label="Смотреть">▶</button></div></div>${scSeek()}${scCtrl()}
    <p class="dc-note">Без пауз и подсказок — только оригинал. Сцена целиком, как в кино.</p>`,'dircut');
  scVideo($('#scvw'),s,p);$('#scvw').appendChild($('#scvo'));
  const ov=$('#scvo'),run=()=>{ov.style.display='none';scPlay(0,p.b-p.a+1,()=>next());};
  let gone=false;SV.addEventListener('ended',()=>next(),{once:true});
  const next=()=>{if(gone)return;gone=true;if(k+1<s.parts.length){renderDirCut(id,k+1);setTimeout(()=>{const b=$('#scplay');if(b)b.click();},250);return;}
    SC_DIR=false;store.dirCut=store.dirCut||{};const fresh=!store.dirCut[id];store.dirCut[id]=Date.now();save();sfx('reward');haptic('ok');
    toast(fresh?'🎬 Значок «Режиссёрская версия» — на карточке сцены':'🎬 Сцена досмотрена целиком');renderScene(id);};
  $('#scplay').onclick=run;scBindCtrl(run);scBindSeek();$('#scb').onclick=()=>{sfx('tap');SC_DIR=false;renderScene(id);};
  if(k===0)run();}
function scVideo(el,s,p,noSubs){
  SSUBON=!noSubs;SW=el;el.dataset.ss='glass';SV=document.createElement('video');
  const pi=s.parts.indexOf(p);SV.src=assetUrl(scEpKey(s,pi,'mp4'));SV.playsInline=true;SV.setAttribute('playsinline','');SV.preload='auto';SV.poster=assetUrl(scEpKey(s,pi,'jpg'));SV.playbackRate=SRATE;
  // клип без видео: если 01.mp4 нет — играем 01.mp3 с обложкой (строки из srt идут по этому звуку)
  if(s.kind==='clip'){SV.poster=assetUrl(scKey(s,'cover.jpg'));SV.addEventListener('error',function f(){if(SV&&!SV._mp3){SV._mp3=true;SV.src=assetUrl(scEpKey(s,pi,'mp3'));SV.load();}},{once:false});}
  SV.volume=store.scVol==null?1:store.scVol;SV.muted=!!store.scMute;
  const loc=s.subs.filter(r=>r[1]>p.a&&r[0]<p.b).map(r=>[Math.max(0,r[0]-p.a),r[1]-p.a,r[2],r[3],r[4]]);
  const vt=x=>{const m=Math.floor(x/60),z=(x%60).toFixed(3).padStart(6,'0');return `00:${String(m).padStart(2,'0')}:${z}`;};
  const mk=f=>URL.createObjectURL(new Blob(['WEBVTT\n\n'+loc.map((r,i)=>{const nx=loc[i+1],end=nx?Math.max(r[0]+0.3,Math.min(r[1],nx[0]-0.05)):r[1];return `${i+1}\n${vt(r[0])} --> ${vt(end)}\n${f(r)}\n`;}).join('\n')],{type:'text/vtt'}));
  SUB_MODES.filter(k=>k!=='off').forEach(k=>{const [a,b]=k.split('+');const t=document.createElement('track');t.kind='subtitles';t.label=k;t.srclang=a;t.src=mk(r=>r[SUB_COL[a]]+(b?'\n'+r[SUB_COL[b]]:''));SV.appendChild(t);});
  el.appendChild(SV);
  const sb=document.createElement('div');sb.className='sc-subs';el.appendChild(sb);
  const fb=document.createElement('div');fb.className='sc-fs';
  fb.innerHTML=`<button data-f="pp" aria-label="Пауза">${SI.pause}</button><button data-f="b5" aria-label="Назад 5 секунд">${SI.back}</button>
    <span class="sc-ft">0:00</span><input type="range" class="sc-fsr" min="0" max="100" step="0.1" value="0" aria-label="Перемотка"><span class="sc-fd">0:00</span>
    <button data-f="mu" aria-label="Звук">${SV.muted?SI.mute:SI.vol}</button><input type="range" class="sc-vol" min="0" max="1" step="0.05" value="${SV.volume}" aria-label="Громкость">
    <button data-f="sp">${SRATE}x</button><button data-f="cc" aria-label="Субтитры">CC</button><button data-f="fill" aria-label="Заполнить экран" title="Заполнить экран (без чёрных полос)">⤢</button><button data-f="x" aria-label="Выйти из полного экрана">${SI.exit}</button>`;
  el.appendChild(fb);
  let idle=0;const wake=()=>{el.classList.remove('idle');clearTimeout(idle);idle=setTimeout(()=>{if(SV&&!SV.paused&&el.classList.contains('sc-pfs'))el.classList.add('idle');},3000);};
  el._wake=wake;el.addEventListener('pointermove',wake);
  fb.onclick=e=>{const b=e.target.closest('[data-f]');if(!b)return;e.stopPropagation();wake();const k=b.dataset.f;
    if(k==='pp')scPP();if(k==='b5')scB5();if(k==='sp'){scSpeed();b.textContent=SRATE+'x';}if(k==='mu')scMute();if(k==='cc')scSubSheet(false);if(k==='x')scExitFull();if(k==='fill'){store.scFill=store.scFill===false;save();el.classList.toggle('fill',store.scFill!==false);toast(store.scFill!==false?'Видео на весь экран, края чуть обрезаны':'Видео целиком, с полосами');}};
  el.classList.toggle('fill',store.scFill!==false);   // 9.1: по умолчанию на весь экран, без полос
  const fr=fb.querySelector('.sc-fsr'),vr=fb.querySelector('.sc-vol');
  fr.oninput=e=>{e.stopPropagation();wake();if(SV){SV.currentTime=+fr.value;if(SSTOP&&+fr.value>SSTOP.b)SSTOP.b=SV.duration||SSTOP.b;scTick();}};
  vr.oninput=e=>{e.stopPropagation();wake();if(SV){SV.volume=+vr.value;SV.muted=+vr.value===0;store.scVol=SV.volume;store.scMute=SV.muted;save();scSyncVol();}};
  [fr,vr].forEach(x=>x.onclick=e=>e.stopPropagation());
  // касание по видео: во весь экран сначала показывает панель, потом ставит на паузу
  // касание в любом месте видео: во весь экран сначала показывает панель, потом ставит на паузу
  el.addEventListener('click',e=>{if(e.target.closest('.sc-fs,.sc-sheetwrap,.sc-over button,.tk,.tk-plate,.sc-wpop,.sc-part'))return;
    if(!e.target.closest('.sc-subs')&&wpClose())return;   // 13.9.18: окошко слова открыто — тап мимо его закрывает (раньше видео шло, а окошко висело)
    if(el.classList.contains('sc-pfs')&&el.classList.contains('idle')){wake();return;}
    const ov=el.querySelector('.sc-over');if(ov&&ov.style.display!=='none'){const pb=ov.querySelector('button');if(pb)pb.click();return;}
    wake();scPP();scFlash();});
  SV.addEventListener('error',()=>{if(!el.querySelector('.sc-err'))el.insertAdjacentHTML('beforeend','<div class="sc-err">Видео не загрузилось. Проверь интернет или что репозиторий scenes опубликован.</div>');});
  SV.addEventListener('loadedmetadata',()=>{if(isFinite(SV.duration)){fr.max=SV.duration;fb.querySelector('.sc-fd').textContent=scFmt(SV.duration);}});
  SV.addEventListener('timeupdate',()=>{
    if(SSTOP&&SV.currentTime>=SSTOP.b){SV.pause();const x=SSTOP;SSTOP=null;if(x.cb)x.cb();}
    if(!SV)return;if(document.activeElement!==fr)fr.value=SV.currentTime;fb.querySelector('.sc-ft').textContent=scFmt(SV.currentTime);});
  SV.addEventListener('play',()=>{ambPause(true);musDuck(true);scSync();wake();if(!SRAF)SRAF=requestAnimationFrame(scTick);});
  SV.addEventListener('pause',()=>{ambPause(false);musDuck(false);scSync();el.classList.remove('idle');});
  SV.addEventListener('seeked',scTick);
  SV.addEventListener('webkitbeginfullscreen',()=>{const m=scDeMode(scSub());for(const t of SV.textTracks)t.mode=(SSUBON&&m!=='off'&&t.label===m)?'showing':'hidden';});
  SV.addEventListener('webkitendfullscreen',()=>{for(const t of SV.textTracks)t.mode='hidden';});
  setTimeout(()=>{if(SV)for(const t of SV.textTracks)t.mode='hidden';},0);
  SV._loc=loc;
}

const SUB_LAG=0.05; // 13.9.40: строки подогнаны под голос (tools/sub_sync.py)
// 13.9.9: строки иногда наезжают друг на друга (до 0.5 с) — показываем ту, что началась последней, иначе новая реплика опаздывала на время наезда
const scRowAt=(L,t)=>{let z=null;for(const x of L){if(t<x[0]+SUB_LAG)break;if(t<=x[1]+0.25)z=x;}return z;};
// 13.9.40 (ТЗ-13.9.32, P2 экран 9): плеер «Нового» по макету (.cell 9). Караоке: слова строки субтитров загораются в такт речи —
// время слов из wt.json сцены (wtLoad, время сцены), строка — время эпизода (+ p.a); не нашлось половины слов — равномерно по длине слов
const WTD={};
function ndKaraSet(box,r){const s=SCUR&&scOf(SCUR.id),p=s&&s.parts[SCUR.i||0];if(!p)return;
  if(!(s.id in WTD)){WTD[s.id]=null;wtLoad(s.id).then(d=>{WTD[s.id]=d||0;   // 13.9.51: wt пришёл при паузе — тиков нет, ставим карaoke сами, не ждём scTick
    if(d&&box._kwWait&&box.isConnected&&SW&&SW.isConnected&&SW._row===box._kwWait){const r0=box._kwWait;box._kwWait=null;ndKaraSet(box,r0);if(box._kw&&SV)ndKaraTick(box,SV.currentTime);}});}
  const ws=[...box.querySelectorAll('.sline:not(.s2) .sw')];if(ws.length<2)return;
  const a=r[0],b=Math.max(r[0]+0.4,r[1]-0.15),W=WTD[s.id],T=new Array(ws.length).fill(null);let hit=0;
  if(W){const C=W.filter(x=>x[0]>=a+p.a-0.5&&x[0]<=r[1]+p.a+0.3);let k=0;
    ws.forEach((el,j)=>{const n=wtN(el.textContent);if(!n)return;for(let q=k;q<Math.min(C.length,k+4);q++)if(wtN(C[q][2])===n){T[j]=C[q][0]-p.a;k=q+1;hit++;break;}});}
  if(W==null){box._kwWait=r;return;}   // wt.json ещё грузится — ndKaraTick повторит, когда придёт
  if(hit<ws.length/2){box._kw=null;return;} // 13.9.40: голос не нашёлся — строка горит целиком, без угадывания
  else{for(let j=0;j<T.length;j++)if(T[j]==null){let q=j;while(q<T.length&&T[q]==null)q++;const t0=j?T[j-1]:a,t1=q<T.length?T[q]:b;for(let z=j;z<q;z++)T[z]=t0+(t1-t0)*(z-j+1)/(q-j+1);j=q;}}
  box._kw=ws.map((el,j)=>[el,T[j]-0.06]);box.classList.add('kara');}
function ndKaraTick(box,t){if(!box._kw)return;for(const [el,a] of box._kw)el.classList.toggle('kk-on',t>=a);}
// окошко слова в «Новом» (шторка .wsh макета): уровень слова чипом, одна строка «почему так» (первое предложение объяснения) — до «Подробнее»
function ndWpDeco(P,sv){const w=P.querySelector('.kwp-w');
  if(w&&sv&&sv.word&&!w.querySelector('.n-chip')){const n=wlvWord(swNorm(sv.word),sv.sid?wiLang(sv.sid):'en');if(n)w.insertAdjacentHTML('beforeend',`<span class="n-chip ${CEFR[n-1].toLowerCase()}">${LVW[CEFR[n-1]]}</span>`);}
  if(P.querySelector('.n-wx'))return;const src=P.querySelector('.kwp-more .kwp-xn,.kwp-more .kwp-wi p');if(!src)return;
  const t=src.textContent.trim().split(/(?<=[.!?])\s+/)[0].slice(0,160);if(!t)return;const d=document.createElement('div');d.className='n-wx';d.textContent=t;
  const mb=P.querySelector('.kwp-mb');mb?P.insertBefore(d,mb):P.insertBefore(d,P.querySelector('.kwp-b'));}
// метки фраз эпизода на шкале перемотки (жёлтые чёрточки, как в макете); тап по слову субтитров — круг от пальца
function ndEpDeco(s,i){try{wlvLoad();}catch(e){}const p=s.parts[i],sk=$('#scsk');if(!p||!sk||sk.parentNode.classList.contains('n-tlw'))return;
  const w=document.createElement('span');w.className='n-tlw';sk.parentNode.insertBefore(w,sk);w.appendChild(sk);const D=()=>SV&&isFinite(SV.duration)&&SV.duration>1?SV.duration:Math.max(1,p.b-p.a);
  const put=()=>{w.querySelectorAll('.n-tlm,.n-tlc').forEach(m=>m.remove());const d=D();scAct(p.ph).forEach(f=>{const x=(f.a-p.a)/d;if(x<0||x>1)return;const m=document.createElement('b');m.className='n-tlm';m.style.left=(x*100).toFixed(2)+'%';w.appendChild(m);});
    epCuts(s,i).forEach(c=>{const x=(c-p.a)/d;if(x<=0||x>=1)return;const m=document.createElement('i');m.className='n-tlc';m.style.left=(x*100).toFixed(2)+'%';w.appendChild(m);});};   // 13.9.69: где кончается часть
  put();if(SV&&!(isFinite(SV.duration)&&SV.duration>1))SV.addEventListener('loadedmetadata',put,{once:true});}
document.addEventListener('pointerdown',e=>{if(!ndOn()||!fxOK())return;const w=e.target.closest&&e.target.closest('.sc-subs .sw');if(!w||!SW)return;
  const R=SW.getBoundingClientRect(),z=parseFloat(getComputedStyle(document.body).zoom)||1,c=document.createElement('i');c.className='n-tapr';
  c.style.left=(e.clientX/z-R.left/z)+'px';c.style.top=(e.clientY/z-R.top/z)+'px';SW.appendChild(c);setTimeout(()=>c.remove(),750);},true);
function scTick(){
  const box=SW&&SW.querySelector('.sc-subs');if(!SV||!box){SRAF=0;return;}
  const t=SV.currentTime,m=scDeMode(scSub()),r=SSUBON&&m!=='off'?scRowAt(SV._loc,t):null,id=r?r[0]+m:'';
  if(box.dataset.id!==id&&!SW._subHold){box.dataset.id=id;const [a,b]=m.split('+');
    // 13.3: оригинал — словами: нажал (телефон) / навёл (ПК) — перевод слова; слова учебного выражения подчёркнуты
    const s0=SCUR&&scOf(SCUR.id),orig=s0&&s0.lang==='de'?'de':'en',t1=r?String(r[SUB_COL[a]]).replace(/\n/g,' '):'',ph=r&&a===orig?scRowPhrase(r):null;
    swTipHide();SW._row=r;SW._rowPh=ph;box.innerHTML=r?`<div class="sline"><span class="en">${a===orig?swWrapPh(t1,ph):esc(t1)}</span></div>${b?`<div class="sline s2"><span class="tr">${esc(r[SUB_COL[b]]).replace(/\n/g,' ')}</span></div>`:''}`:'';SW.classList.toggle('has-sub',!!r);
    box._kw=null;box._kwWait=null;box.classList.remove('kara');if(r&&a===orig&&ndOn())ndKaraSet(box,r);}
  if(box._kwWait&&SCUR&&WTD[SCUR.id]!=null){const r0=box._kwWait;box._kwWait=null;if(SW._row===r0)ndKaraSet(box,r0);}
  if(box._kw)ndKaraTick(box,t);
  if(SW._tick&&!SV.paused)SW._tick(t);   // 12.2: плашки-объяснения по ходу фильма
  if(SW._cut&&!SV.paused)SW._cut(t);   // 13.9.69: эпизод длиннее минуты — пауза между частями
  SRAF=SV.paused?0:requestAnimationFrame(scTick);
}
const SCTOUR=[['🎬','Сначала просто смотри','Эпизод идёт целиком, с субтитрами. На полезных фразах появится короткое объяснение: что значит и когда пригодится. Никаких заданий во время фильма.'],
  ['⏸','С паузами или без','«С паузами» — видео ждёт, пока читаешь. «Без пауз» — объяснение висит поверх, кино идёт. Переключить можно в «⋯» под видео или в настройках.'],
  ['👆','Любое слово нажимается','В объяснении и в репликах под видео нажми на слово — перевод и «☆ В мои слова». Подчёркнутые — выражения: у них свой смысл.'],
  ['✅','Потом — проверка','Досмотрел — «Проверить, что запомнил»: послушай и напиши сам, подсказки — первые буквы и кубики. Выученное вернётся через 1, 3 и 7 дней.']];
function scTour(done){let k=0;const w=document.createElement('div');w.className='sctour';
  const draw=()=>{const [ic,h,txt]=SCTOUR[k];w.innerHTML=`<div class="tour-card"><div class="tour-ic">${ic}</div><b>${h}</b><p>${txt}</p>
    <div class="tour-dots">${SCTOUR.map((_,j)=>`<i class="${j===k?'on':''}"></i>`).join('')}</div>
    <div class="tour-b"><button data-t="skip">${k<SCTOUR.length-1?'Пропустить':''}</button><button data-t="next" class="go">${k<SCTOUR.length-1?'Дальше':'Понятно, поехали'}</button></div></div>`;};
  w.onclick=e=>{const b=e.target.closest('[data-t]');if(!b)return;sfx('tap');if(b.dataset.t==='next'&&k<SCTOUR.length-1){k++;draw();return;}store.tourV=1;save();w.remove();if(typeof done==='function')done();};
  draw();document.body.appendChild(w);}
// карточка фразы под видео в момент, когда её говорят: фраза, перевод и коротко — когда так говорят
const scShort=n=>{const m=String(n||'').match(/^.*?[.!?](\s|$)/);return m?m[0].trim():String(n||'');};
function scFlash(){if(!SW)return;const f=document.createElement('div');f.className='sc-flash';f.innerHTML=SV&&!SV.paused?SI.play:SI.pause;SW.appendChild(f);setTimeout(()=>f.remove(),600);}
// клавиатура на компьютере: пробел — пауза, стрелки — ±5 с, F — полный экран, Esc — выход
document.addEventListener('keydown',e=>{if(!SV||!SW||/INPUT|TEXTAREA/.test((e.target||{}).tagName||''))return;
  if(e.code==='Space'||e.key===' '){e.preventDefault();scPP();scFlash();}
  else if(e.key==='ArrowLeft'){SV.currentTime=Math.max(0,SV.currentTime-5);scTick();}
  else if(e.key==='ArrowRight'){SV.currentTime=Math.min(SV.duration||1e9,SV.currentTime+5);scTick();}
  else if(e.key==='f'||e.key==='F'||e.key==='а'||e.key==='А')scFull();
  else if(e.key==='Escape'&&SW.classList.contains('sc-pfs'))scExitFull();
  if(SW._wake)SW._wake();});
function scPlay(a,b,cb){if(!SV)return;SSTOP={a,b,cb};SV.playbackRate=SRATE;try{SV.currentTime=a;}catch(e){}const pr=SV.play();if(pr&&pr.catch)pr.catch(()=>toast('Нажми ещё раз, чтобы запустить видео'));return pr;}
function scPP(){if(!SV)return;if(SSTOP===null&&SV.paused){const g=$('#scag');if(g)g.click();return;}if(SV.paused)SV.play();else SV.pause();}
function scB5(){if(SV){SV.currentTime=Math.max(0,SV.currentTime-5);scTick();}}
function scSpeed(){SRATE=SRATE===1?.75:SRATE===.75?.5:1;if(SV)SV.playbackRate=SRATE;const b=$('#scsp');if(b){b.textContent=SRATE+'x';b.classList.toggle('on',SRATE!==1);}const f=SW&&SW.querySelector('[data-f=sp]');if(f)f.textContent=SRATE+'x';}
function scMute(){if(!SV)return;SV.muted=!SV.muted;if(!SV.muted&&SV.volume===0)SV.volume=.8;store.scMute=SV.muted;store.scVol=SV.volume;save();scSyncVol();}
function scSyncVol(){const ic=SV&&SV.muted?SI.mute:SI.vol;const a=$('#scmu');if(a)a.innerHTML=ic;const f=SW&&SW.querySelector('[data-f=mu]');if(f)f.innerHTML=ic;const v=SW&&SW.querySelector('.sc-vol');if(v&&SV)v.value=SV.muted?0:SV.volume;}
function scSync(){const on=SV&&!SV.paused;const p=$('#scpp');if(p)p.innerHTML=on?SI.pause:SI.play;const f=SW&&SW.querySelector('[data-f=pp]');if(f)f.innerHTML=on?SI.pause:SI.play;}
// 12.1: размер полного экрана — по реальному окну (на iPhone 100vh/100vw в Telegram врут → чёрные поля вокруг видео)
function scFsSize(){const r=document.documentElement.style;r.setProperty('--fw',window.innerWidth+'px');r.setProperty('--fh',window.innerHeight+'px');}
window.addEventListener('resize',()=>{if(document.body.classList.contains('sc-pfs-on'))scFsSize();});
// свой полноэкранный режим: видео на весь экран Telegram, кнопки всегда можно вызвать касанием
async function scFull(){if(!SW)return;if(SW.classList.contains('sc-pfs')){scExitFull();return;}
  const ios=(TG&&TG.platform==='ios')||/iPhone|iPad|iPod/.test(navigator.userAgent);

  SW.classList.add('sc-pfs');document.body.classList.add('sc-pfs-on');
  // Telegram 8+ — основной путь на iOS/Android. В обычном браузере/на ПК — нативный fullscreen как fallback.
  try{
    if(canFull()){if(!TG.isFullscreen)TG.requestFullscreen();}
    else if(SW.requestFullscreen) await SW.requestFullscreen();
  }catch(e){}
  try{if(screen.orientation&&screen.orientation.lock&&matchMedia('(orientation:portrait)').matches)screen.orientation.lock('landscape').catch(()=>{});}catch(e){}
  if(window.innerHeight>window.innerWidth&&matchMedia('(pointer:coarse)').matches)SW.classList.add('rot');
  scFsSize();
  try{if(TG&&TG.disableVerticalSwipes)TG.disableVerticalSwipes();}catch(e){}
  if(SW._wake)SW._wake();haptic('sel');}
function scExitFull(){
  try{if(TG&&TG.enableVerticalSwipes)TG.enableVerticalSwipes();}catch(e){}
  const w=document.querySelector('.sc-pfs');if(w)w.classList.remove('sc-pfs','idle','rot');document.body.classList.remove('sc-pfs-on');
  try{if(document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen().catch(()=>{});}catch(e){}
  try{if(screen.orientation&&screen.orientation.unlock)screen.orientation.unlock();}catch(e){}
}
// выбор субтитров: один язык и стиль, при первом входе в сцену открывается сам
function scCloseSheet(){const x=document.querySelector('.sc-sheetwrap');if(x)x.remove();}
function scSubSheet(first){
  scCloseSheet();store.subStyle='glass';const L=scL(),de=L==='de';
  const O=de?[['de+ru','Немецкий + перевод','Deutsch и русский'],['de','Только немецкий','без перевода — тренируешь слух'],['off','Без субтитров','только звук']]
           :[['en+ru','Оригинал + перевод','English и русский'],['en','Только оригинал','без перевода — тренируешь слух'],['off','Без субтитров','только звук']];
  O.unshift(['auto','Авто — рекомендую','первый просмотр с переводом, повторный — без него']);
  const cur=(!store.scSubChosen||store.scSub==='auto'||!store.scSub)?'auto':scSub();const w=document.createElement('div');w.className='sc-sheetwrap';
  w.innerHTML=`<div class="sc-sheet"><b>${first?'Как смотреть?':'Субтитры'}</b>
    ${scIsDe()?`<p class="sc-denote">${FLAG.de} Этот фильм на немецком — оригинал немецкий, перевод русский. Английских субтитров тут нет.</p>`:''}${scIsDe()||!FLAG_ADMIN?'':`<div class="sc-lang"><button data-lg="en" class="${de?'':'on'}">Учу English</button><button data-lg="de" class="${de?'on':''}">Учу Deutsch <small>админ</small></button></div>`}
    <div class="sc-opts3">${O.map(([k,n,d])=>`<button data-sl="${k}" class="${cur===k?'on':''}"><span>${n}</span><small>${d}</small></button>`).join('')}</div>
    <div class="sc-szw"><span>Размер</span><div class="sc-sz">${SUB_SZ.map(([k,l])=>`<button data-sz="${k}" class="${(store.subSz||'m')===k?'on':''}">${l}</button>`).join('')}</div></div>
    <button class="sc-stop ${store.subSame!==false?'on':''}" data-same="1"><i></i><span>Перевод того же размера<small>выключи — перевод будет чуть мельче оригинала</small></span></button>
    <button class="sc-btn" data-close>Готово</button></div>`;
  (SW&&SW.classList.contains('sc-pfs')?SW:(document.querySelector('.scn')||document.body)).appendChild(w);
  const relabel=()=>{const f=$('#sccc');if(f)f.textContent=(SUB_SHORT[scDeMode(scSub())]||'DE·EN');if(SW){const bx=SW.querySelector('.sc-subs');if(bx)bx.dataset.id='x';SW.dataset.ss='glass';}try{scTick();}catch(e){}};
  w.onclick=e=>{const b=e.target.closest('button');if(e.target===w||(b&&b.hasAttribute('data-close'))){store.scSubChosen=true;save();scCloseSheet();return;}
    if(!b)return;sfx('sel');
    if(b.dataset.lg){store.scSub=b.dataset.lg==='de'?'de+ru':'en+ru';store.scSubChosen=true;save();relabel();scSubSheet(first);return;}
    if(b.dataset.sl){store.scSub=b.dataset.sl;store.scSubChosen=true;save();w.querySelectorAll('[data-sl]').forEach(x=>x.classList.toggle('on',x===b));relabel();}
    if(b.dataset.sz){store.subSz=b.dataset.sz;save();applySubPrefs();w.querySelectorAll('[data-sz]').forEach(x=>x.classList.toggle('on',x===b));}
    if(b.dataset.same){store.subSame=store.subSame===false;save();applySubPrefs();b.classList.toggle('on',store.subSame!==false);}};
}
const SI={play:'<svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/></svg>',pause:'<svg viewBox="0 0 24 24"><rect x="6.5" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none"/><rect x="13.5" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none"/></svg>',again:'<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v5h5"/></svg>',back:'<svg viewBox="0 0 24 24"><path d="M11 7 6 12l5 5"/><path d="M18 7l-5 5 5 5"/></svg>',full:'<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',exit:'<svg viewBox="0 0 24 24"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>',
  vol:'<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" stroke="none"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>',mute:'<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" stroke="none"/><path d="M17 9l5 6M22 9l-5 6"/></svg>'};
const scCtrl=()=>`<div class="sc-ctrl2"><button id="scb5" class="c-side" aria-label="Назад 5 секунд">${SI.back}<small>5 с</small></button><button id="scpp" class="c-main" aria-label="Пауза">${SI.play}</button><button id="scfu" class="c-side" aria-label="На весь экран">${SI.full}</button><button id="scmore" class="c-side" aria-label="Ещё">⋯</button></div>
  <div class="sc-more" id="scMore" hidden><button id="scag" aria-label="Сначала">${SI.again}</button><button id="scsp"${SRATE!==1?' class="on"':''}>${SRATE}x</button><button id="scpz" class="sc-pzb" title="Останавливать видео на фразах">${scPauseOn()?'⏸ паузы':'▶ без пауз'}</button><button id="sccc" aria-label="Субтитры">${(SUB_SHORT[scDeMode(scSub())]||'DE·EN')}</button><button id="scmu" aria-label="Звук">${store.scMute?SI.mute:SI.vol}</button><input type="range" id="scvl" class="sc-vl" min="0" max="1" step="0.05" value="${store.scVol==null?1:store.scVol}" aria-label="Громкость"></div>`;
function scBindCtrl(run){const mb=$('#scmore');if(mb)mb.onclick=()=>{const m=$('#scMore');m.hidden=!m.hidden;mb.classList.toggle('on',!m.hidden);sfx('tap');};$('#scpp').onclick=scPP;$('#scag').onclick=run;$('#scb5').onclick=scB5;$('#scsp').onclick=scSpeed;$('#scmu').onclick=scMute;$('#sccc').onclick=()=>scSubSheet(false);const pz=$('#scpz');if(pz)pz.onclick=()=>{store.scPause=scPauseOn()?'off':'on';save();sfx('sel');pz.textContent=scPauseOn()?'⏸ паузы':'▶ без пауз';$$('.ep-pz button').forEach(x=>x.classList.toggle('on',x.dataset.pz===(scPauseOn()?'on':'off')));toast(scPauseOn()?'⏸ Видео будет ждать на фразах':'▶ Объяснения поверх, кино не останавливается');};$('#scfu').onclick=scFull;const vl=$('#scvl');if(vl)vl.oninput=()=>{store.scVol=+vl.value;save();if(SV){SV.volume=+vl.value;if(SV.muted&&+vl.value>0){SV.muted=false;store.scMute=false;}}const fv=document.querySelector('.sc-fs .sc-vol');if(fv)fv.value=vl.value;};}
const scSeek=()=>`<div class="sc-seek"><span id="sct0">0:00</span><input type="range" id="scsk" min="0" max="100" step="0.1" value="0" aria-label="Перемотка"><span id="sct1">0:00</span></div>`;
function scBindSeek(){const r=$('#scsk');if(!r||!SV)return;
  const setMax=()=>{if(SV&&isFinite(SV.duration)){r.max=SV.duration;$('#sct1').textContent=scFmt(SV.duration);}};SV.addEventListener('loadedmetadata',setMax);setMax();
  r.oninput=()=>{if(!SV)return;SV.currentTime=+r.value;if(SSTOP&&+r.value>SSTOP.b)SSTOP.b=SV.duration||SSTOP.b;$('#sct0').textContent=scFmt(+r.value);scTick();};
  SV.addEventListener('timeupdate',()=>{if(!SV)return;if(document.activeElement!==r){r.value=SV.currentTime;}const t=$('#sct0');if(t)t.textContent=scFmt(SV.currentTime);});}
// 13.6: после эпизода — все реплики с переводом: ★ — фразы, по которым будут задания, ▶ — переслушать, слова нажимаются.
// Человек сам выбирает, что пересмотреть, и сам идёт «К заданиям» (раньше — только «Ты встретил N фраз» и сразу проверка).
// 13.9.70: переводы в разборе открыты (Андрей: «не прячь, где не надо себя проверить»; пыль — только в повторении и «Проверь себя»)
// 13.9.40: разбор после эпизода — из двух частей: сверху 4 фразы, по которым будут задания (карточки), ниже свёрнуто «Все реплики эпизода»
function epReview(box,s,i,p,o){o=o||{};const rows=s.subs.filter(r=>r[0]>=p.a-0.3&&r[0]<p.b),act=scAct(p.ph),test=phPick(act,3);   // 13.9.60: заданий после эпизода 3, брали 4
  const seen=new Set(),cnt=()=>{const c=box.querySelector('#rvCnt');if(c)c.textContent=`${test.filter(f=>seen.has(f.id)).length} из ${test.length} послушал`;};
  const tip=f=>{const t=scNoteS(f)||f.use||'';return t?esc(scShort(t)):'';};
  box.innerHTML=`<div class="rv rv2"><div class="rv-head"><span class="ep-end-k">🎬 Эпизод досмотрен</span><b>Будут в заданиях · ${test.length}</b>
      <span>Нажми на слово — объясню, ${SI.play} — послушать ещё раз.</span>
      <div class="rv-top"><button class="rv-again" id="rvAgain">${SI.again} Смотреть ещё раз</button><span class="rv-cnt" id="rvCnt"></span></div></div>
    <div class="rv-cards">${test.map((f,k)=>`<div class="rv-c" data-k="${k}"><button class="rv-play" aria-label="Послушать фразу">${SI.play}</button>
      <div class="rv-t"><b>${kwWrap(f)}</b><span>${esc(f.ru||'')}</span>${tip(f)?`<small>💡 ${tip(f)}</small>`:''}</div></div>`).join('')}</div>
    ${rows.length?`<details class="rv-all"><summary>Все реплики эпизода · ${rows.length}</summary><div class="rv-list">${rows.map((r,k)=>`<div class="rv-ln" data-k="${k}">
      <button class="rv-play" aria-label="Послушать реплику">${SI.play}</button>
      <div class="rv-t"><b>${swWrap(scRowT(r))}</b><span>${esc(String(r[3]||'').replace(/\n/g,' '))}</span></div></div>`).join('')}</div></details>`:''}
    <div class="rv-go"><button class="sc-btn ep-go" id="epGoQ">К заданиям →<small>${test.length} ${plural(test.length,['фраза','фразы','фраз'])}</small></button></div></div>`;
  box.hidden=false;cnt();
  ['.ep-watch','#epToLearn','#epPhs','.ep-lines'].forEach(q=>{const x=document.querySelector(q);if(x){if(q==='#epToLearn')x.style.display='none';else x.hidden=true;}});
  const url=assetUrl(scEpKey(s,i,'mp4'));
  box.querySelectorAll('.rv-c').forEach(c=>{const f=test[+c.dataset.k],look=()=>{seen.add(f.id);c.classList.add('seen');cnt();};
    c.querySelector('.rv-play').onclick=e=>{e.stopPropagation();sfx('tap');playSeg(url,f.a-p.a-0.12,f.b-p.a+0.25,e.currentTarget);look();};
    kwBind(c.querySelector('.rv-t>b'),f);c.querySelector('.rv-t>b').addEventListener('pointerdown',look);});
  box.querySelectorAll('.rv-ln').forEach(ln=>{const r=rows[+ln.dataset.k];
    ln.querySelector('.rv-play').onclick=e=>{e.stopPropagation();sfx('tap');playSeg(url,r[0]-p.a-0.12,r[1]-p.a+0.25,e.currentTarget);};
    ln.querySelector('.rv-t>b').addEventListener('click',e=>{const w=e.target.closest('.sw');if(w)linePop(w,r);});});
  box.querySelector('#epGoQ').onclick=()=>{sfx('tap');renderScQuiz(s.id,i);};
  box.querySelector('#rvAgain').onclick=()=>{sfx('tap');window.scrollTo({top:0,behavior:'smooth'});if(o.again)o.again();};
  if(o.first&&store.fx!==false)box.querySelectorAll('.rv-head,.rv-c,.rv-all').forEach((el,k)=>el.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'none'}],{duration:380,delay:k*60,easing:'cubic-bezier(.2,.9,.3,1)',fill:'backwards'}));}
function renderScEp(id,i,opts){setTimeout(()=>{wiLoad(wiLang(id));cxLoad(wiLang(id));},1500);   // 13.9.13: «подробнее о слове» — заранее, чтобы окошко слова открылось сразу полным

  opts=opts||{};
  if(scGate(id,i))return;
  if(!scOpen(scOf(id))){scBuy(scOf(id));return;}
  if(!store.lvl){renderLevelTest(()=>renderScEp(id,i,opts));return;}
  const s=scOf(id),p=s.parts[i],P=scP(id),watched=!!(P.done.includes(i)||P.w[i]);
  if(!opts.free&&!scEpOpen(s,i)){toast(`Сначала пройди эпизод ${String(i).padStart(2,'0')}`);renderScene(id);return;}
  SCUR={id,i};store.scLast={id,i};save();
  const rows=s.subs.filter(r=>r[0]>=p.a-0.3&&r[0]<p.b),PTn=epParts(s,i);
  // 12.2: эпизод — ① Смотри (плашки-объяснения) → ② Проверка. 13.9.42: старый поток 9.2 («Разбор», задания в видео) убран
  scMount(s,`
    <div class="sc-head"><button class="sc-back" id="scb">${ui('back')}</button><div><span class="sc-meta">${esc(s.title)} · эпизод ${String(i+1).padStart(2,'0')}${PTn>1?` · <i class="sc-pt" id="scPt">${PTn} ${plural(PTn,['часть','части','частей'])} по минуте</i>`:''}</span><h1>${esc(p.t)}</h1></div></div>
    <div class="ep-main"><div class="sc-v" id="scvw"><div class="sc-over" id="scvo"><button id="scplay" aria-label="Смотреть">▶</button></div></div>
    ${scSeek()}
    ${scCtrl()}<div id="vqSlot"></div></div>
    <div class="ep-side"><div class="ep-tabs" role="tablist"><button data-tab="watch"><i>1</i>Смотри</button><button data-tab="test"><i>2</i>Проверка</button></div>
    <section class="ep-pane" data-pane="watch">
      <div class="ep-hint ep-watch ep-w2"><span>Просто смотри: на полезных фразах объясню, любое слово — нажми.</span>
        <div class="ep-pz ep-pz2" role="radiogroup" aria-label="Как смотреть"><button data-pz="on" class="${scPauseOn()?'on':''}">⏸ С паузами</button><button data-pz="off" class="${scPauseOn()?'':'on'}">▶ Без пауз</button></div></div>
      <div class="ep-end" id="epEnd" hidden></div>
      <button class="sc-btn ep-go" id="epToLearn"${watched?'':' hidden'}>Проверить, что запомнил →</button>
      <details class="ep-phs" id="epPhs"><summary>Фразы эпизода <i id="epPhN">0 из ${scWatchFX(p).length}</i></summary><div class="ep-phl" id="epPhL"><p class="ep-phe">Появятся здесь, когда встретишь их в сцене.</p></div></details>
      ${epSeen(s,i)?`<details class="ep-lines"><summary>Все реплики · нажми на любое слово <i>${rows.length}</i></summary>
        <div class="sc-lines sc-card">${rows.map((r,k)=>`<div class="ln" data-k="${k}"><b>${swWrap(scRowT(r))}</b><span>${esc(r[3]).replace(/\\n/g,' ')}</span></div>`).join('')}</div></details>`:''}
    </section></div>`,'scep');

  {const sn=document.querySelector('.scn');if(sn)sn.classList.add('scep');}
  scVideo($('#scvw'),s,p);
  $('#scvw').appendChild($('#scvo'));
  const MET=new Set();let WX=null;
  const phItem=f=>`<div class="ep-phi" data-fid="${f.id}"><b>${kwWrap(f)}</b><span>${esc(f.ru)}</span>${scNoteS(f)?`<small>💡 ${esc(scShort(scNoteS(f)))}</small>`:''}<button class="ep-php" data-a="${f.a}" data-b="${f.b}">${SI.play} Послушать</button></div>`;
  const phList=(full)=>{const box=$('#epPhL');if(!box||!WX)return;const L=full?WX.list:WX.list.filter(f=>MET.has(f.id));
    box.innerHTML=L.length?L.map(phItem).join(''):'<p class="ep-phe">Появятся здесь, когда встретишь их в сцене.</p>';
    box.querySelectorAll('.ep-phi').forEach(el=>phBind(el,WX.list.find(f=>f.id===el.dataset.fid)));
    box.querySelectorAll('.ep-php').forEach(b=>b.onclick=()=>{sfx('tap');$('#scvo').style.display='none';if(window.innerWidth<1000)window.scrollTo({top:0,behavior:'smooth'});scPlay(+b.dataset.a-p.a-0.1,+b.dataset.b-p.a+0.15,()=>{$('#scvo').style.display='';});});
    const n=$('#epPhN');if(n)n.textContent=full?`${WX.list.length}`:`${MET.size} из ${WX.list.length}`;};
  // 12.2: при просмотре — только плашки-объяснения, без заданий (задания — в проверке после фильма)
  const PT=scPartAttach(s,i,p);   // 13.9.69: части ≤ 1 мин
  {WX=scWatchAttach(s,p,$('#vqSlot'),{met:f=>{MET.add(f.id);phList(false);}});if(watched)phList(true);
    $$('.ep-pz button').forEach(b=>b.onclick=()=>{sfx('sel');store.scPause=b.dataset.pz;save();$$('.ep-pz button').forEach(x=>x.classList.toggle('on',x===b));toast(scPauseOn()?'⏸ Видео будет ждать на фразах':'▶ Объяснения поверх, кино не останавливается');});}
  const tabs=()=>$$('.ep-tabs button').forEach(b=>{const t=b.dataset.tab;b.classList.toggle('on',t==='watch');b.classList.toggle('done',t==='watch'&&(P.w[i]||P.done.includes(i)));});

  const opened=()=>{PT.done();const first=!P.w[i];P.w[i]=1;scSave();const b=$('#epToLearn');if(b){b.hidden=false;b.classList.add('pulse');}tabs();
    if(SW&&SW._watchKill)SW._watchKill();phList(true);const e=$('#epEnd');if(e){epReview(e,s,i,p,{again:()=>{run();},first});
      if(first)sfx('reel');if(window.innerWidth<1000)setTimeout(()=>e.scrollIntoView({behavior:'smooth',block:'start'}),150);}};
  let at0=opts.at;   // 12.1: открыли из словаря/поиска — первый ▶ играет с нужного места
  const run=()=>{$('#scvo').style.display='none';const from=at0!=null?at0:PT.from(scStartAt(s,p));at0=null;PT.reset(from);scPlay(from,p.b-p.a+1,()=>{$('#scvo').style.display='';opened();});if(SSTOP)SSTOP.full=true;};
  $('#scplay').onclick=run;
  scBindCtrl(run);scBindSeek();
  if(watched&&!opts.at){const e=$('#epEnd');if(e)epReview(e,s,i,p,{again:()=>{run();}});}
  if(opts.at!=null){const set=()=>{try{SV.currentTime=opts.at;scTick&&scTick();}catch(e){}};if(SV.readyState>=1)set();else SV.addEventListener('loadedmetadata',set,{once:true});run();if(SV.paused)setTimeout(()=>{if(SV&&SV.paused)$('#scvo').style.display='';},600);}
  SV.addEventListener('ended',()=>{$('#scvo').style.display='';opened();},{once:true});SV.addEventListener('ended',()=>ev('ep_watch',id),{once:true});
  $('#epToLearn').onclick=()=>{sfx('tap');if(!(P.w[i]||P.done.includes(i))&&SV&&SV.paused&&SV.currentTime<1){run();return;}renderScQuiz(id,i);};
  $$('.ep-tabs button').forEach(b=>b.onclick=()=>{sfx('tap');const t=b.dataset.tab;if(t==='test'){renderScQuiz(id,i);return;}window.scrollTo({top:0,behavior:'smooth'});});
  $('#scb').onclick=()=>{if(navBack())return;sfx('tap');renderScene(id);};
  lineWords(s,p);
  // 12.6: при первом заходе тур и выбор субтитров вылезали одновременно, друг на друга — теперь по очереди: тур → субтитры
  {const sub=()=>{if(!store.scSubChosen&&document.querySelector('.ep-tabs')&&!document.querySelector('.sc-sheetwrap'))scSubSheet(true);};
   if(store.tourV!==1)setTimeout(()=>{if(document.querySelector('.ep-tabs')&&!document.querySelector('.sctour'))scTour(sub);else sub();},500);else setTimeout(sub,250);}
  {const hb=document.createElement('button');hb.className='sc-help';hb.setAttribute('aria-label','Как тут учиться');hb.textContent='?';hb.onclick=()=>scTour();const hd=document.querySelector('.scn .sc-head');if(hd)hd.appendChild(hb);}
  // слова в субтитрах: нажатие — перевод, наведение (ПК) — подсказка
  swTouch(SW);
  if(matchMedia('(hover:hover)').matches){SW.addEventListener('mouseover',e=>{const w=e.target.closest('.sw');if(w)swTip(w);});
    SW.addEventListener('mouseout',e=>{if(e.target.closest('.sw')){const tp=SW.querySelector('.sc-wtip');if(tp)tp.classList.remove('on');}});
    SW.addEventListener('mouseleave',swTipHide);if(SV){SV.addEventListener('seeking',swTipHide);SV.addEventListener('pause',swTipHide);}}   // 13.9.35
  if(ndOn())ndEpDeco(s,i);   // 13.9.40: плеер по макету — метки фраз на шкале, караоке в субтитрах
  tabs();
}
/* ---------- задания: кубики, выражение, плашки при просмотре (12.2) ---------- */
// 11.4: слова, которые считаем знакомыми любому, кто дошёл до сцен (для «примени в жизни»)
const SC_BASIC=new Set("i you he she it we they me him her us them my your his its our their this that these those a an the and or but so if because when what who where why how which not no yes is am are was were be been do does did don't doesn't didn't have has had will would can can't could should must to of in on at for with from by up out about all some any one two there here now then just very too also only more most much many good bad new old big little get go come see know think want like make take say tell give look need feel let's it's i'm you're that's what's there's i'll i've don't okay ok right well oh hey please thank thanks sorry".split(' '));
// 11.4: до 12 слов — по слову; длиннее — кусками по 2 (по 3), но так, чтобы куски не повторялись («and again» ×2 — нельзя)
// 13.9.34 (P1, Андрей: «задания супер долгие»): всю фразу собираем, только если в ней не больше 7 слов (SC_MAXB);
// длиннее — «Собери выражение»: фраза видна, на месте выражения — клетки; выражение — самое длинное важное (kw[i][0]) из 2–5 слов, что есть во фразе
const SC_MAXB=7;
function scExpr(f,tgt){tgt=String(tgt||'');let best=null;const lw=tgt.toLowerCase(),isL=c=>/[A-Za-zÄÖÜäöüß'’]/.test(c||'');
  // 13.9.43: сначала размеченное «что запомнить» (f.x), перевод — из важного слова, которое в него входит
  if(f&&f.x){const x=String(f.x),n=scToks(x).length;let i=lw.indexOf(x.toLowerCase());while(i>=0&&(isL(tgt[i-1])||isL(tgt[i+x.length])))i=lw.indexOf(x.toLowerCase(),i+1);
    if(i>=0&&n>=2&&n<=6&&n<scToks(tgt).length){const kx=((f.kw)||[]).find(k=>k&&k[0]&&x.toLowerCase().includes(String(k[0]).toLowerCase())&&scToks(String(k[0])).length>=2);
      return {n,x:tgt.slice(i,i+x.length),pre:tgt.slice(0,i),post:tgt.slice(i+x.length),ru:kx?String(kx[2]||''):''};}}
  for(const k of (f&&f.kw)||[]){const x=String(k&&k[0]||'').trim(),n=scToks(x).length;if(n<2||n>5||(best&&n<=best.n))continue;
    let i=lw.indexOf(x.toLowerCase());while(i>=0&&(isL(tgt[i-1])||isL(tgt[i+x.length])))i=lw.indexOf(x.toLowerCase(),i+1);if(i<0)continue;
    best={n,x:tgt.slice(i,i+x.length),pre:tgt.slice(0,i),post:tgt.slice(i+x.length),ru:String(k[2]||'')};}
  return best;}
// кубики с двумя попытками (проверка эпизода и повторение): ошибся — верные кубики остаются на местах зелёными, остальные возвращаются,
// в следующей пустой клетке — первая буква; вторая ошибка — ответ. o: {ans,pool,chk,rst,msg,fix — клетки сразу по числу слов, done(right,tries,miss)}
function scTilesUI(B,o){let tries=0,over=false,hint=false;const want=B.tk.map(scNorm);B.keep=B.keep||[];
  const draw=marks=>{const N=Math.max(B.got.length,o.fix||hint?B.tk.length:0);let h1=-1;const cells=[];
    for(let j=0;j<N;j++){const x=B.got[j];if(x){cells.push(`<button class="sc-tile${marks?(marks[j]?' good':' bad'):(B.keep[j]?' good keep':'')}" data-k="${x.k}" data-j="${j}">${esc(x.w)}</button>`);continue;}
      const h=hint&&!over&&h1<0&&j<B.tk.length;if(h)h1=j;cells.push(`<span class="sc-hole${h?' hl':''}" aria-hidden="true">${h?esc([...B.tk[j]][0]||''):''}</span>`);}
    o.ans.innerHTML=cells.join('')||'<span class="sc-bph">Собери фразу слева направо</span>';
    o.pool.innerHTML=B.pool.map(x=>`<button class="sc-tile${B.got.includes(x)?' used':''}" data-k="${x.k}"${B.got.includes(x)?' disabled':''}>${esc(x.w)}</button>`).join('');
    const any=B.got.some((x,j)=>x&&!B.keep[j]);if(o.chk)o.chk.hidden=over||!B.got.some(Boolean);if(o.rst)o.rst.hidden=over||!any;
    o.pool.querySelectorAll('.sc-tile').forEach(b=>b.onclick=()=>{if(over)return;sfx('tap');const x=B.pool.find(y=>y.k===+b.dataset.k);if(x&&!B.got.includes(x))scSlotPut(B.got,x,B.tk.length+3);draw();});
    o.ans.querySelectorAll('.sc-tile').forEach(b=>b.onclick=()=>{if(over)return;const j=+b.dataset.j;if(B.keep[j])return;scSlotTake(B.got,j);draw();});};
  if(o.rst)o.rst.onclick=()=>{if(over)return;B.got=B.got.map((x,j)=>B.keep[j]?x:null);while(B.got.length&&!B.got[B.got.length-1])B.got.pop();if(o.msg&&!hint)o.msg.textContent='';sfx('tap');draw();};
  if(o.chk)o.chk.onclick=()=>{if(over)return;const N=Math.max(B.got.length,B.tk.length),gw=[];for(let j=0;j<N;j++)gw.push(B.got[j]?scNorm(B.got[j].w):'');
    const right=B.got.filter(Boolean).length===B.tk.length&&want.every((w,j)=>gw[j]===w);
    if(right){over=true;o.ans.classList.add('right');draw();o.done(true,tries,[]);return;}
    tries++;haptic('err');sfx('bad');const marks=scPosMarks(gw,want);
    if(tries>=2){over=true;o.ans.classList.add('wrong');draw(marks);if(o.msg)o.msg.textContent='';o.done(false,tries,want.map((_,j)=>!marks[j]));return;}
    B.keep=want.map((_,j)=>!!marks[j]);B.got=want.map((_,j)=>marks[j]?B.got[j]:null);while(B.got.length&&!B.got[B.got.length-1])B.got.pop();hint=true;draw();
    const okN=B.keep.filter(Boolean).length;if(o.msg)o.msg.textContent=`${okN?`На своих местах ${okN} из ${want.length} — оставил их. `:''}В пустой клетке — первая буква. Последняя попытка.`;};
  draw();return {draw};}
// «Вот как правильно»: перепутанные слова — маркером
function scFixHTML(tk,miss,ex){const body=tk.map((w,j)=>miss&&miss[j]?`<span class="mk">${esc(w)}</span>`:esc(w)).join(' ');
  return `<div class="sc-fix"><small>Вот как правильно</small>${ex?`${esc(ex.pre)}<b>${body}</b>${esc(ex.post)}`:body}</div>`;}
function scChunk(tk){if(tk.length<=12)return tk;for(const n of [2,3]){const ch=[];for(let k=0;k<tk.length;k+=n)ch.push(tk.slice(k,k+n).join(' '));if(new Set(ch.map(x=>x.toLowerCase())).size===ch.length)return ch;}return tk;}
// кубики: без знаков и заглавных, длинное — кусками, ловушки — другие формы тех же слов и gx
function scBuildTiles(text,f,all,keep){const clean=w=>{let x=String(w).replace(/[.,!?;:…"«»()]+/g,'');if(!keep&&!/^I('|$)/.test(x))x=x.toLowerCase();return x;};   // keep — немецкий: существительные с заглавной
  let tk=scToks(text).map(clean).filter(Boolean);
  tk=scChunk(tk);
  const pool=[],used=new Set(tk.map(x=>x.toLowerCase()));const add=v=>{v=clean(v);if(v&&!used.has(v.toLowerCase())&&pool.length<2){pool.push(v);used.add(v.toLowerCase());}};
  (f.gx||[]).forEach(add);
  for(const w of shuffle(tk.filter(x=>!x.includes(' '))))for(const v of wForms(w,false))add(v);
  if(pool.length<2)for(const x of shuffle(all)){if(x===f)continue;const w=scToks(x.en||'').map(clean).find(y=>y&&y.length>2&&!used.has(y.toLowerCase()));if(w){add(w);break;}}
  return {tk,pool:shuffle([...tk,...pool]).map((w,k)=>({w,k})),got:[]};}
// 11.4: подсказка на кубиках — зажми кубик, и покажу перевод слова (нажатие кубик не ставит)
(function(){let t=null,fired=false;
  document.addEventListener('pointerdown',e=>{const b=e.target.closest&&e.target.closest('.sc-tile');if(!b)return;fired=false;clearTimeout(t);
    t=setTimeout(()=>{fired=true;const G=scIsDe()?GLOSS_DE:GLOSS;const tr=b.textContent.trim().split(/\s+/).map(x=>{const n=swNorm(x);const v=G[n]||G[n.replace(/'s$/,'')]||G[n.replace(/s$/,'')]||G[n.replace(/'/g,'')];return v?`${x} — ${v}`:null;}).filter(Boolean);
      toast(tr.length?tr.join(' · '):'Перевода нет — попробуй по смыслу');haptic('sel');},450);},true);
  ['pointerup','pointercancel','pointerleave'].forEach(n=>document.addEventListener(n,()=>clearTimeout(t),true));
  document.addEventListener('click',e=>{if(fired&&e.target.closest&&e.target.closest('.sc-tile')){e.stopPropagation();e.preventDefault();fired=false;}},true);
  document.addEventListener('contextmenu',e=>{if(e.target.closest&&e.target.closest('.sc-tile'))e.preventDefault();},true);})();
// 11.0: какие кубики стоят правильно — по самой длинной общей последовательности, а не по позиции
// («meet for drinks after work» без «want to» — пять зелёных, а не пять красных)
function scLcsMarks(got,want){const n=got.length,m=want.length,D=[...Array(n+1)].map(()=>Array(m+1).fill(0));
  for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)D[i][j]=got[i]===want[j]?D[i+1][j+1]+1:Math.max(D[i+1][j],D[i][j+1]);
  const mk=Array(n).fill(false);let i=0,j=0;while(i<n&&j<m){if(got[i]===want[j]){mk[i]=true;i++;j++;}else if(D[i+1][j]>=D[i][j+1])i++;else j++;}return mk;}
// 12.1: зелёный — только слово на своём месте; под ответом — разбор: пропущенное [a…], лишнее зачёркнуто
const scPosMarks=(got,want)=>got.map((g,i)=>!!g&&g===want[i]);
// кубик в первую дырку; убранный из середины оставляет дырку
// 13.9.27: кубик летит в клетку и обратно (FLIP): до перерисовки запоминаем, где был кубик, после — тот же кубик (data-k)
// в другом ряду стартует с прежнего места и пружиной встаёт на новое. Работает в проверке эпизода и в повторении.
document.addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('.sc-tile[data-k]');if(!b||b.disabled||!fxOK())return;
  const box=b.closest('#scbpool,#scbans');if(!box)return;const r0=b.getBoundingClientRect(),k=b.dataset.k,to=box.id==='scbpool'?'#scbans':'#scbpool';
  requestAnimationFrame(()=>{const t=document.querySelector(`${to} .sc-tile[data-k="${k}"]`);if(!t)return;const r1=t.getBoundingClientRect(),dx=r0.left-r1.left,dy=r0.top-r1.top;
    if(Math.abs(dx)+Math.abs(dy)<3)return;try{t.animate([{transform:`translate(${dx}px,${dy}px) scale(1.08)`,zIndex:6},{transform:'none',zIndex:6}],{duration:430,easing:SPRING});}catch(_){}});},true);
function scSlotPut(arr,y,max){const h=arr.findIndex(z=>!z);if(h>=0&&h<max)arr[h]=y;else if(arr.length<max)arr.push(y);}
function scSlotTake(arr,i){arr[i]=null;while(arr.length&&!arr[arr.length-1])arr.pop();}
// 12.2: просмотр как кино с умным комментатором. Никаких вопросов — на полезных фразах плашка: фраза (слова нажимаются),
// перевод и коротко «когда так говорят». «⏸ С паузами» — видео ждёт «Дальше ▶»; «▶ Без пауз» — плашка висит и уходит сама.
// Учёба (вспомни / собери / примени) — только после просмотра, в «Проверке».
const scPauseOn=()=>store.scPause!=='off';
const scWatchFX=p=>{const L=scAct(p.ph).filter(f=>f.b>f.a&&!f.passive);return L.slice().sort((a,b)=>phScore(b)-phScore(a)||a.a-b.a).slice(0,5).sort((x,y)=>x.a-y.a);};   // 13.9.43: плашки — самые полезные 5
function scWatchAttach(s,p,box,o){o=o||{};const L=scWatchFX(p).map(f=>({f,a:f.a-p.a,b:f.b-p.a,done:false}));let cur=null,lastT=0;
  const kill=()=>{if(!cur)return;clearTimeout(cur._t);const w=cur;cur=null;kwHide(0);w.classList.add('out');setTimeout(()=>w.remove(),220);};
  // 13.9.16 (Андрей: «когда идут быстро 2 фразы и не скипаешь — фразы багаются»): фразы, идущие почти подряд (меньше 1.2 с между ними
  // или внахлёст), — одна плашка после последней: вторая не сбивает первую через секунду и пауза не режет следующую реплику
  const chain=y=>{const g=[y];let z=y;while(g.length<3){const i=L.indexOf(z),n=L[i+1];if(!n||n.done||n.a>=z.b+1.2)break;g.push(n);z=n;}return g;};
  SW._tick=t=>{if(SSTOP&&!SSTOP.full)return;
    if(t<lastT-0.5)L.forEach(y=>{if(y.a>t)y.done=false;});lastT=t;
    for(const y of L){if(y.done||t<y.b+0.1)continue;const g=chain(y),end=Math.max(...g.map(q=>q.b));
      if(t<end+0.1)return;   // следующая фраза ещё звучит — ждём её конца
      if(t<end+1.5){g.forEach(q=>q.done=true);show(g);return;}}};
  // продолжить после плашки: если пауза пришлась на начало реплики — с её начала, чтобы не терять слова
  const resume=()=>{if(!SV||!SV.isConnected)return;try{const t=SV.currentTime,r=(s.subs||[]).find(r=>{const a=r[0]-p.a,b=r[1]-p.a;return a<t&&b>t+0.3&&t-a<0.9;});if(r)SV.currentTime=Math.max(0,r[0]-p.a-0.1);}catch(e){}
    const pr=SV.play();if(pr&&pr.catch)pr.catch(()=>{});};
  function show(g){kill();const F=g.map(y=>y.f),f=F[0],fs=!!(SW&&SW.classList.contains('sc-pfs')),stop=scPauseOn();if(stop&&SV)SV.pause();
    const U=F.map(x=>scShort(scNoteS(x))),use=U.join(' '),len=F.reduce((a,x)=>a+x.en.length+x.ru.length,0)+use.length,w=document.createElement('div');w.className='tk tk-plate tk-watch'+(fs?' over':'')+(stop?'':' flow')+(F.length>1?' multi':'');
    w.innerHTML=`<div class="tkp-top"><span class="tk-k">💬 ${F.length>1?`${F.length} фразы подряд`:'Фраза из сцены'}</span><button class="tkp-x" data-x="go">${stop?'Дальше ▶':'✕'}</button></div>
      ${F.map((x,k)=>`<div class="tkp-ph" data-k="${k}"><b class="tkp-en">${kwWrap(x)}</b><span class="tkp-ru">${esc(x.ru)}</span>${U[k]?`<p class="tkp-use">💡 ${esc(U[k])}</p>`:''}</div>`).join('')}
      <small class="tkp-h">Нажми на слово — объясню</small>${stop?'':'<div class="vq-bar"><i></i></div>'}`;
    (fs?SW:box).appendChild(w);w.querySelectorAll('.tkp-ph').forEach(el=>kwBind(el,F[+el.dataset.k]));cur=w;if(o.met)F.forEach(x=>o.met(x));
    if(!fs&&window.innerWidth<1000&&stop)setTimeout(()=>w.scrollIntoView({behavior:'smooth',block:'nearest'}),50);
    if(!stop){const ms=Math.max(6000,Math.min(F.length>1?18000:11000,len*45)),bar=w.querySelector('.vq-bar i');
      requestAnimationFrame(()=>{bar.style.transition=`width ${ms}ms linear`;bar.style.width='0%';});w._t=setTimeout(()=>{if(cur===w)kill();},ms);}
    // 13.6: «С паузами» — тоже уходит само, когда прочитал (кнопка «Дальше ▶» заполняется); нажал на слово — ждёт тебя
    else if(autoOn()){const ms=Math.max(8000,Math.min(F.length>1?24000:15000,len*55)),x=w.querySelector('.tkp-x');
      x.classList.add('auto');x.style.setProperty('--ms',ms+'ms');
      w._t=setTimeout(()=>{if(cur!==w)return;kill();resume();},ms);}
    // нажал на слово — фильм ждёт, пока читаешь (слова сами глушат click, поэтому ловим касание заранее)
    w.addEventListener('pointerdown',e=>{if(!e.target.closest('.kw,.sw'))return;clearTimeout(w._t);const x=w.querySelector('.tkp-x');x.classList.remove('auto');
      if(SV&&!SV.paused){SV.pause();x.textContent='Дальше ▶';w._resume=true;const bar=w.querySelector('.vq-bar');if(bar)bar.remove();}},true);
    w.addEventListener('click',e=>{e.stopPropagation();const b=e.target.closest('[data-x]');
      if(!b||b.dataset.x!=='go')return;sfx('tap');const res=stop||w._resume;kill();if(res)resume();});}
  SW._watchKill=kill;
  return {list:L.map(y=>y.f)};}
// 13.9.69 (П8, Андрей: «по системе TikTok — кусок не больше минуты»): эпизод длиннее минуты смотрится частями. Видео, id фраз, номера эпизодов
// и прогресс — как были (без перерезки файлов): плеер сам встаёт на паузе между репликами — «Часть 1 из 2 · Дальше».
// Разрез — в паузе между строками субтитров, не внутри фразы и не там, где сейчас всплывёт плашка; части примерно поровну, ≤ ~1 мин.
// Досмотренная часть — P.pt[i] (только на этом устройстве): вернулся — эпизод идёт со следующей части. Режиссёрская версия — без разрывов.
const EP_PART=60,EP_TOL=6,EPC={};
function epCuts(s,i){const key=s.id+'|'+i;if(key in EPC)return EPC[key];const p=s.parts[i],R=[],d=p?p.b-p.a:0;
  if(p&&d>EP_PART+EP_TOL){const rows=(s.subs||[]).filter(r=>r[0]>=p.a-0.3&&r[0]<p.b).sort((x,y)=>x[0]-y[0]),PH=p.ph||[],W=scWatchFX(p),oc=s.lang==='de'?4:2;
    const inside=t=>PH.some(f=>t>f.a-0.2&&t<f.b+0.2)||rows.some(r=>t>r[0]+0.02&&t<r[1]-0.02),plate=t=>W.some(f=>t>=f.b-0.1&&t<f.b+2.2);
    // места разреза — стыки строк субтитров: лучше длинная пауза, конец предложения и не там, где всплывёт плашка
    const C=[],add=(t,pen)=>{if(t>p.a+12&&t<p.b-12&&!inside(t))C.push({t,pen:pen+(plate(t)?20:0)});},
      quiet=(a,b)=>{for(let t=a+4;t<b-2;t+=4)add(t,4);};   // долгая тишина (погоня, смех) — резать можно и посреди неё
    quiet(p.a-2,rows.length?rows[0][0]:p.b+2);
    for(let j=1;j<rows.length;j++){const g0=rows[j-1][1],g=rows[j][0]-g0;if(g<-0.005)continue;
      add(g0+Math.min(0.4,g/2),(g<0.15?25:g<0.25?10:0)+(/[.?!…]["»”)]?\s*$/.test(String(rows[j-1][oc]||''))?0:15));quiet(g0,rows[j][0]);}
    if(rows.length)quiet(rows[rows.length-1][1],p.b+2);
    C.sort((x,y)=>x.t-y.t);
    // разбиение целиком (динамика): части ~50 с, длиннее ~1 мин — штраф растёт квадратом, лишняя часть — тоже штраф
    const T=[{t:p.a,pen:0},...C,{t:p.b,pen:0}],N=T.length,B=new Array(N).fill(Infinity),F=new Array(N).fill(-1);B[0]=0;
    const seg=L=>L<8?Infinity:30+0.02*(L-50)*(L-50)+(L>62?(L-62)*(L-62)*5:0)+(L<22?(22-L)*(22-L)*2:0);
    for(let b=1;b<N;b++)for(let a=0;a<b;a++){if(B[a]===Infinity)continue;const c=B[a]+seg(T[b].t-T[a].t)+T[b].pen;if(c<B[b]){B[b]=c;F[b]=a;}}
    for(let k=F[N-1];k>0;k=F[k])R.unshift(+T[k].t.toFixed(2));}
  return EPC[key]=R;}
const epParts=(s,i)=>epCuts(s,i).length+1;
function scPartAttach(s,i,p){const C=epCuts(s,i).map(t=>t-p.a),P=scP(s.id);
  if(!C.length||!SW)return {n:1,from:x=>x,reset(){},done(){},kill(){}};
  let fired=new Set(),lastT=-1,card=null,shown='';
  // «часть N из M» в шапке: пока висит карточка конца части — ещё та часть, что кончилась
  const chip=()=>{const el=$('#scPt');if(!el||!SV)return;const k=Math.max(0,C.filter(c=>c<=SV.currentTime+0.05).length-(card?1:0)),t=`часть ${k+1} из ${C.length+1}`;if(t!==shown){shown=t;el.textContent=t;}};
  const kill=()=>{if(card){card.remove();card=null;}};
  if(SV)SV.addEventListener('play',()=>{if(card){kill();chip();}});   // запустили кнопкой плеера, а не карточкой — карточка уходит
  SW._cut=t=>{if(SSTOP&&!SSTOP.full)return;   // только когда эпизод идёт целиком (не «Послушать» и не перемотка к фразе)
    if(lastT<0||t<lastT-0.3||t-lastT>1.2){lastT=t;chip();return;}   // перемотка — разрыв не срабатывает
    for(let k=0;k<C.length;k++)if(!fired.has(k)&&lastT<C[k]&&t>=C[k]){fired.add(k);lastT=t;brk(k);return;}
    lastT=t;chip();};
  function brk(k){if(!SV)return;SV.pause();P.pt=P.pt||{};if((P.pt[i]||0)<k+1){P.pt[i]=k+1;scSave();}kill();
    if(SW._wake)SW._wake();const w=document.createElement('div');w.className='sc-part';w.setAttribute('role','button');
    w.innerHTML=`<div class="sc-pt-in"><span class="sc-pt-k">Часть ${k+1} из ${C.length+1} · готово</span><b>Минута позади</b><span class="sc-pt-go">${SI.play||'▶'} Дальше · часть ${k+2}</span><small>Можно выйти — в следующий раз начнём с части ${k+2}</small></div>`;
    SW.appendChild(w);card=w;chip();haptic('sel');sfx('tick');
    w.addEventListener('click',e=>{e.stopPropagation();sfx('tap');kill();chip();if(SV){const pr=SV.play();if(pr&&pr.catch)pr.catch(()=>{});}});}
  return {n:C.length+1,kill,
    reset(t0){fired=new Set(C.map((c,k)=>t0!=null&&c<=t0+0.1?k:-1).filter(k=>k>=0));lastT=-1;kill();setTimeout(chip,0);},   // старт с части 2 — разрез перед ней уже пройден
    from(x){const k=(P.pt||{})[i]||0;return k>0&&k<=C.length&&!(P.w[i]||P.done.includes(i))?Math.max(x,C[k-1]-0.05):x;},   // недосмотренный эпизод — со следующей части
    done(){kill();if(P.pt&&P.pt[i]){delete P.pt[i];scSave();}}};}
/* =====================================================================================
   11.0 — СЛОВАРЬ-КОЛЛЕКЦИЯ («гаврик зарабатывает свои фразы»)
   • Фраза заработана, когда на неё верно ответил (паузы, проверка, повторение, дуэль): P.got[fid]=время (внутри dota_sc_v1).
   • После эпизода новые карты с анимацией улетают в «Словарь» (dictFly).
   • Словарь: фильмы, теги, поиск, страницы по сценам с перелистыванием, закрытые карты «🔒», карта открывается с куском сцены.
   • «Мои слова» — отдельный раздел со своими тегами и добавлением своих слов (store.myw).
   ===================================================================================== */
let DICT_NEW=[];
function scGot(s,f){if(!s||!f||f.passive||s.kind==='clip')return false;const P=scP(s.id);P.got=P.got||{};if(P.got[f.id])return false;P.got[f.id]=Date.now();DICT_NEW.push({sid:s.id,fid:f.id});return true;}
const dictScenes=()=>SCENES.filter(s=>s.kind!=='clip'&&flagOf('scene-'+s.id)!=='hide');
const dictCards=s=>s.parts.flatMap((p,pi)=>scAct(p.ph).map(f=>({s,p,pi,f})));
const dictHas=(s,f)=>!!((scP(s.id).got||{})[f.id]);
const dictCount=L=>{let g=0,t=0;(L||dictScenes()).forEach(s=>dictCards(s).forEach(c=>{t++;if(dictHas(s,c.f))g++;}));return [g,t];};
const dictFilm=s=>s.show||s.title;
// 13.8.2: официальные картинки фильма высокого разрешения (TMDB) — scenes/_films/<ключ>/: bd.jpg — фон 3840×2160, bdm.jpg — 1280, bdp.jpg — постер ~1600
const FILM_KEYS=[['wolf','wolf'],['american-psycho','psycho'],['taxi-driver','taxi'],['titanic','titanic'],['downfall','bunker'],['sopranos','sopranos'],['breaking-bad','bb'],['bb-','bb']];
const filmKey=s=>{const id=(s&&s.id)||'',x=FILM_KEYS.find(([p])=>id.startsWith(p));return x?x[1]:null;};
const filmImg=(s,f)=>{const k=filmKey(s);return k?assetUrl('scenes/_films/'+k+'/'+f):null;};
// уже выученное до 11.0 — сразу в словаре (на повторении или отвечено хотя бы раз)
(function dictBackfill(){let ch=false;SCENES.forEach(s=>{const P=SC[s.id];if(!P||s.kind==='clip')return;
  s.parts.forEach(p=>scAct(p.ph).forEach(f=>{if(((P.m||{})[f.id]||0)>=1||(P.r||{})[f.id]){P.got=P.got||{};if(!P.got[f.id]){P.got[f.id]=Date.now()-864e5*7;ch=true;}}}));});
  if(ch)try{localStorage.setItem(SCK,JSON.stringify(SC));}catch(e){}})();
const DX={seg:'ph',lang:'en',show:null,sid:null,tag:'',q:'',mytag:'',mytab:'rep'};
const DX_TH={wolf:'#D4AF37',noir:'#c8323a',bone:'#E8DCC4',taxi:'#F2C200',bunker:'#C9B98A',pump:'#ff4fa0',ocean:'#D9B26F',meth:'#9FD356',studio:'#FF5A4E'};
// 13.6: редкость карты (1 обычная … 4 легендарная): легендарная — факт в сложной сцене, эпическая — факт, редкая — выражение в сложной сцене
function dcRar(s,f){const lv=s.lvl||3,mw=(f.kw||[]).some(k=>isPhr(k[1]||k[0]));return f.fact?(lv>=4?4:3):(mw&&lv>=4?2:1);}
// 11.5: словарь — иерархия как в Hearthstone: Фильмы / Сериалы → название → сцена → карты эпизодов. На экране один уровень.
// 🇬🇧/🇩🇪 — тот же словарь 1:1 (те же фильмы и тот же прогресс P.got), карты на немецком.
const dxL=s=>s&&s.lang==='de'?'de':'en';   // 13.3: язык словаря = язык фильма (английские фильмы — English, «Бункер» — Deutsch)
const dxScenes=()=>dictScenes().filter(s=>dxL(s)===DX.lang);
const dxT=f=>{const s=scOf(f.sid);return s&&s.lang==='de'?(f.de||f.en):f.en;};
const DXOPEN={};   // раскрытые эпизоды в словаре (sid|эпизод) — на этот заход
const dxShows=()=>{const G=[],by={};for(const s of dxScenes()){const k=dictFilm(s);if(!by[k]){by[k]=[];G.push(k);}by[k].push(s);}return G.map(k=>({k,L:by[k],kind:['series','interview'].includes(by[k][0].kind)?by[k][0].kind:'film'}));};
function dlLoad(){if(window.DL&&DL.V&&DL.V.length)return Promise.resolve();if(dlLoad.p)return dlLoad.p;
  dlLoad.p=new Promise((ok,no)=>{const l=document.createElement('link');l.rel='stylesheet';l.href='styles/dictlab.css?v='+APP_V;document.head.appendChild(l);
    const s=document.createElement('script');s.src='js/dictlab.js?v='+APP_V;s.onload=()=>ok();s.onerror=()=>{dlLoad.p=null;l.remove();no(new Error('dictlab'));};document.body.appendChild(s);});return dlLoad.p;}
// 13.9.13: словарь у всех — новый (бывшая лаборатория, вариант «kino»: Кинотека + «Мои фразы и слова»); код и стили грузятся при первом заходе (dlLoad)
function dictTabHTML(){return `<div class="dl-root" id="dlRoot"><div class="dl-wait">Загружаю словарь…</div></div>`;}
function bindDict(){setTimeout(()=>{const L=DX.lang==='de'?'de':'en';wiLoad(L);cxLoad(L);},1500);Promise.all([dlLoad(),ndOn()?wlvLoad():null]).then(()=>{const r=$('#dlRoot');if(r)DL.mount(r);}).catch(()=>{const r=$('#dlRoot');if(r)r.innerHTML='<div class="dl-wait">Не загрузилось — проверь связь</div>';});}
const mywLearned=x=>(x.st||0)>=3&&!(x.due&&x.due<=Date.now());
function renderMyWords(){DX.seg='my';store.knMyKind='w';try{if(window.DL&&DL.KN&&DL.KN.my)DL.KN.my.tag=null;}catch(e){}renderTab('dict');}   // 13.8.7: в новом словаре — сразу «Слова», меню подборок
const mywWhen=t=>{const h=(t-Date.now())/36e5;return h<12?'через пару часов':h<36?'завтра':`через ${Math.round(h/24)} ${plural(Math.round(h/24),['день','дня','дней'])}`;};
// новые карты после эпизода: вылетают, переворачиваются и с ускорением падают в словарь
/* =====================================================================================
   11.0 — ДУЭЛЬ ПО СЦЕНЕ (PvP с другом по ссылке)
   • Наперегонки: 3 одинаковых вопроса у обоих (до 13.9.69 — 8), живая полоска соперника; больше верных (при равенстве — быстрее) — забирает банк.
   • Вместе: по очереди, общий счёт; тот, чей ход, может нажать «🆘 Помоги» — вопрос откроется у друга.
   • Сервер — воркер бота bot/worker.js, маршрут /api/pvp (D1). Ссылка: APP_LINK?startapp=kv_CODE. Верные ответы → карты в словарь.
   ===================================================================================== */
// 12.0: дуэли и сброс прогресса — в том же воркере, что и бот (bot/worker.js → /api/pvp)
const PVP_API=(window.PVP_API||API+'/api/pvp').replace(/\/$/,'');
let KV=null;
const kvUid=()=>{try{const u=TG&&TG.initDataUnsafe&&TG.initDataUnsafe.user;if(u&&u.id)return 'tg'+u.id;}catch(e){}if(!store.kvUid){store.kvUid='u'+Math.random().toString(36).slice(2,10);save();}return store.kvUid;};
const kvName=()=>{try{const u=TG&&TG.initDataUnsafe&&TG.initDataUnsafe.user;if(u)return (u.first_name||u.username||'Игрок').slice(0,20);}catch(e){}return 'Игрок';};
async function kvNet(body){const r=await fetch(PVP_API,{method:'POST',headers:{'content-type':'application/json','x-init-data':(TG&&TG.initData)||window.__INIT||''},body:JSON.stringify(Object.assign({uid:kvUid(),name:kvName()},body))});return r.json();}
const kvErr=e=>toast(e&&e.msg?e.msg:'Дуэли пока недоступны: сервер не отвечает');
// вопросы генерит хозяин — у обоих одинаковые: «что значит», «вставь слово», «что он сказал» (на слух)
// 13.6.3: в немецкой сцене звучит и пишется f.de (раньше дуэль была на английском: только «что значит», без «на слух» и пропусков)
function kvMakeQs(s,ep){const all=s.parts.flatMap(p=>p.ph),de=s.lang==='de',T=f=>de?f.de:f.en;let L=scAct(s.parts[ep].ph).filter(f=>f.b>f.a);
  if(L.length<SC_PORT)L=[...L,...shuffle(s.parts.flatMap(p=>scAct(p.ph)).filter(f=>f.b>f.a&&!L.includes(f)))].slice(0,SC_PORT);
  L=shuffle(L).slice(0,SC_PORT);const types=['listen','mean','gap'];   // 13.9.69 (П8): 3 вопроса — по одному каждого вида (было 8)
  return L.map((f,i)=>{let t=types[i%3];
    if(t==='listen'){const o=scListenOpts(f,all,de);if(o&&o.length>=2)return {fid:f.id,t,right:T(f),opts:shuffle([T(f),...o.slice(0,2)])};t='mean';}
    if(t==='gap'&&f.gap&&wordRe(f.gap).test(T(f))){const g=(!de&&f.gx&&f.gx.length>=2?f.gx:de?scGapOptsDe(f,all):scGapOpts(f,all)).filter(x=>x.toLowerCase()!==f.gap.toLowerCase()).slice(0,2);
      if(g.length>=2)return {fid:f.id,t:'gap',right:f.gap,opts:shuffle([f.gap,...g])};}
    const tr=(f.trap||[]).slice(0,2);return {fid:f.id,t:'mean',right:f.ru,opts:shuffle([f.ru,...tr])};});}
const kvF=(s,fid)=>{let f=null;s.parts.forEach(p=>p.ph.forEach(x=>{if(x.id===fid)f=x;}));return f;};
// лист «Дуэль с другом»: эпизод, режим, ставка
function kvSheet(sid,ep){const s=scOf(sid);if(!s)return;scCloseSheet();let mode='race',bet=(store.gold||0)>=25?25:0;/* 13.2: ставка была внизу и «Без» по умолчанию — её не замечали */ep=ep==null?Math.max(0,s.parts.findIndex((p,i)=>!scP(sid).done.includes(i))):ep;if(ep<0)ep=0;
  const w=document.createElement('div');w.className='sc-sheetwrap';const g=store.gold||0;
  let drawn=false;const draw=()=>{w.innerHTML=`<div class="sc-sheet kv-sheet${drawn?' noanim':''}"><b>⚔️ Дуэль с другом</b><p class="kv-sub">${esc(s.title)} · ${esc(s.sub||'')}</p>
    <div class="kv-lbl">Режим</div><div class="kv-modes"><button data-m="race" class="${mode==='race'?'on':''}"><span>🏁</span><b>Наперегонки</b><small>Одни и те же вопросы у обоих. Верно — 100 очков и до 50 за скорость. Больше очков — забираешь банк.</small></button>
      <button data-m="coop" class="${mode==='coop'?'on':''}"><span>🤝</span><b>Вместе</b><small>По очереди, общий счёт. Застрял — «🆘 Помоги», и ответит друг.</small></button></div>
    ${mode==='race'?`<div class="kv-lbl">Ставка <small>у тебя ${ui('coin')} ${fmt(g)}</small></div>${g<25?`<p class="kv-poor">Ставки — от ${ui('coin')} 25. Пройди эпизод или финал сцены — дадут билеты.</p>`:''}<div class="kv-bets">${[0,25,50,100,200].filter(x=>!x||x<=g||x===25).map(x=>`<button data-b="${x}" class="${x===bet?'on':''}"${x>g?' disabled':''}>${x?`${ui('coin')} ${x}`:'Без ставки'}</button>`).join('')}</div>
      ${bet?`<p class="kv-bank-note">Банк ${ui('coin')} <b>${bet*2}</b> — ставка списывается у обоих на старте, победитель забирает всё. Ничья — вернём.</p>`:''}`:''}
    <div class="kv-lbl">Эпизод</div><div class="kv-eps">${s.parts.map((p,i)=>`<button data-ep="${i}" class="${i===ep?'on':''}">${i+1}. ${esc(p.t)}</button>`).join('')}</div>
    <button class="sc-btn" id="kvGo">${mode==='race'&&bet?`Создать — ставка ${ui('coin')} ${bet} →`:'Создать и позвать друга →'}</button><button class="sc-btn ghost" data-close>Отмена</button></div>`;drawn=true;};
  draw();w.onclick=async e=>{const b=e.target.closest('button');if(e.target===w||(b&&b.hasAttribute('data-close'))){w.remove();return;}if(!b)return;sfx('tap');
    if(b.dataset.ep){ep=+b.dataset.ep;draw();return;}if(b.dataset.m){mode=b.dataset.m;if(mode==='coop')bet=0;draw();return;}if(b.dataset.b){bet=+b.dataset.b;draw();return;}
    if(b.id==='kvGo'){b.disabled=true;b.textContent='Создаю комнату…';
      try{const r=await kvNet({a:'create',fx:shopUse('st'),bg:profBgKey(),pf:myPub(),room:{sid,ep,mode,bet,qs:kvMakeQs(s,ep)}});if(!r.ok){kvErr(r);b.disabled=false;draw();return;}
        w.remove();KV={code:r.v.code,role:'A',room:r.v,k:0,t0:0};kvShare();kvLobby();kvPoll();}catch(x){kvErr();b.disabled=false;draw();}}};
  document.body.appendChild(w);}
const kvLink=()=>`${APP_LINK}?startapp=kv_${KV.code}`;
function kvShare(){const R=KV.room,s=scOf(R.sid);shareLink(kvLink(),`${R.mode==='race'?'Го наперегонки':'Го вместе'} по сцене «${s?s.title:''}» в «Языки по кино»${R.bet?` — ставка ${R.bet} монет`:''}! Комната ${KV.code}`);}
function kvScreen(html){const s=scOf(KV.room.sid);scMount(s,`<div class="kv">${html}</div>`,'pvp');}
function kvLobby(){const R=KV.room,s=scOf(R.sid);
  kvScreen(`<div class="sc-head"><button class="sc-back" id="kvX">${ui('back')}</button><div><span class="sc-meta">Дуэль · ${R.mode==='race'?'наперегонки':'вместе'}</span><h1>${esc(s.title)}</h1></div></div>
    <div class="kv-lobby">${profBg()?kvPlHTML({n:kvName(),bg:profBgKey()},'inv',true,s,null,2.5,'me')+'<small class="kvp-cap">Так тебя увидит друг</small>':'<div class="kv-pulse">⚔️</div>'}<b>Ждём друга…</b><p>${esc(s.sub||'')} · эпизод ${R.ep+1} «${esc(s.parts[R.ep].t)}»${R.bet?` · ставка ${ui('coin')} ${R.bet}`:''}</p>
      <div class="kv-code">Комната <b>${KV.code}</b></div><button class="sc-btn" id="kvSh">📤 Отправить ссылку ещё раз</button><button class="sc-btn ghost" id="kvCp">Скопировать ссылку</button>${!profBg()&&bgAnyGot()?'<p class="kv-tip">🖼 Поставь фон в профиль (Коллекция) — друг увидит тебя на нём</p>':''}</div>`);bgFill($('.kv'));kvPvBind($('.kv'));
  $('#kvSh').onclick=()=>{sfx('tap');kvShare();};$('#kvCp').onclick=()=>{sfx('tap');try{navigator.clipboard.writeText(kvLink()).then(()=>toast('Ссылка скопирована'),()=>toast(kvLink()));}catch(e){toast(kvLink());}};
  $('#kvX').onclick=()=>kvLeave();}
async function kvJoin(code){try{const r=await kvNet({a:'state',code});if(!r.ok){kvErr(r);renderHome();return;}
    if(/^dd:/.test(String(r.v&&r.v.sid||'')))return dvJoin(code,r.v);   // 13.9.67: Versus по Deadlock — свой экран
    const R=r.v,s=scOf(R.sid);if(!s){toast('Этой сцены нет в твоей версии приложения');renderHome();return;}
    if(ageLock(s)){renderHome();ageAsk(()=>kvJoin(code));return;}
    const me=R.A&&R.A.id===kvUid()?'A':R.B&&R.B.id===kvUid()?'B':null;
    if(me){KV={code,role:me,room:R,k:0,t0:0};kvApply(R);kvPoll();return;}
    if(R.B){toast('В этой комнате уже двое');renderHome();return;}
    KV={code,role:'B',room:R,k:0,t0:0,guest:true};const g=store.gold||0,poor=R.bet>g;
    kvScreen(`<div class="sc-head"><button class="sc-back" id="kvX">${ui('back')}</button><div><span class="sc-meta">Тебя зовут на дуэль</span><h1>${esc(s.title)}</h1></div></div>
      <div class="kv-lobby">${bgInfo(R.A.bg)?kvPlHTML(R.A,'inv',false,s,null,1.5,'A'):`<div class="kv-pulse">${R.mode==='race'?'🏁':'🤝'}</div>`}<b>${esc(R.A.n)} зовёт ${R.mode==='race'?'наперегонки':'пройти вместе'}</b>
        <p>${esc(s.sub||'')} · эпизод ${R.ep+1} «${esc(s.parts[R.ep].t)}» · ${R.qs.length} ${plural(R.qs.length,['вопрос','вопроса','вопросов'])}</p>
        ${R.bet?`<div class="kv-code">Ставка <b>${ui('coin')} ${R.bet}</b> · у тебя ${fmt(g)}</div><p class="kv-rule">Победитель забирает банк ${ui('coin')} ${R.bet*2}. Очки: верно — 100 и до 50 за скорость, сначала решает точность.</p>`:''}
        ${poor?`<p class="kv-poor">Не хватает монет на ставку. Пройди эпизод или поиграй — и возвращайся по ссылке.</p>`:`<button class="sc-btn" id="kvIn">Принять ${R.mode==='race'?'вызов':'приглашение'} →</button>`}</div>`);
    bgFill($('.kv'));kvPvBind($('.kv'));$('#kvX').onclick=()=>{KV=null;renderHome();};
    if($('#kvIn'))$('#kvIn').onclick=async()=>{sfx('tap');$('#kvIn').disabled=true;try{const j=await kvNet({a:'join',code,fx:shopUse('st'),bg:profBgKey(),pf:myPub()});if(!j.ok){kvErr(j);$('#kvIn').disabled=false;return;}if(!j.v.B){KV.role='A';KV.guest=false;toast('Это твой же вызов — с одного аккаунта играть против себя нельзя. Отправь ссылку другу');}kvApply(j.v);kvPoll();}catch(e){kvErr();}};   // 13.9.71 (ревью П8, п.4): как в Versus 13.9.70
  }catch(e){kvErr();renderHome();}}
function kvPoll(){if(!KV)return;clearTimeout(KV.timer);KV.timer=setTimeout(async()=>{if(!KV)return;if(!document.querySelector('.kv')){kvStop();return;}
    try{const r=await kvNet({a:'state',code:KV.code});if(r.ok)kvApply(r.v);}catch(e){}kvPoll();},KV.room&&KV.room.st==='go'&&KV.started?900:1300);}
function kvStop(){if(KV){clearTimeout(KV.timer);clearInterval(KV.cd);}}
const kvFoe=()=>KV.role==='A'?'B':'A';
// 11.2: очки наперегонки — верно 100 + до 50 за скорость (полный бонус за мгновенный ответ, ноль после 20 с); ошибка 0.
// Одна лишняя верная (+100) всегда сильнее любой скорости — сначала точность, потом время.
const KV_FAST=20000,kvPts=a=>a&&a.ok?100+Math.round(50*Math.max(0,1-a.ms/KV_FAST)):0,kvSum=p=>Object.values((p&&p.ans)||{}).reduce((t,a)=>t+kvPts(a),0);
function kvApply(R){if(KV&&KV.dd)return dvApply(R);   // 13.9.67: Versus по Deadlock
  if(!KV)return;const prev=KV.room;KV.room=R;
  if(R.st==='wait'){if(!document.querySelector('.kv-lobby'))kvLobby();return;}
  if((R.st==='left'||R.st==='closed')&&R[kvFoe()]&&R[kvFoe()].left&&!KV.over){KV.over=true;kvEnd(true);return;}
  if(!KV.started){KV.started=true;kvPay();kvCountdown();return;}
  if(KV.over||!KV.ready)return;
  if(R.mode==='race'){kvBars();if(R[KV.role].done&&(R[kvFoe()].done||R.st==='end')){KV.over=true;kvEnd();}else if(R[KV.role].done)kvWait();}
  else{if(R.st==='end'||R.turn>=R.qs.length){KV.over=true;kvEnd();return;}if(!prev||prev.turn!==R.turn||prev.help!==R.help||!document.querySelector('.kv-q'))kvCoopShow();else kvBars();}}
// ставка списывается один раз, когда оба в игре
function kvPay(){const R=KV.room;store.kvPaid=store.kvPaid||{};if(R.mode==='race'&&R.bet&&!store.kvPaid[KV.code]){store.gold=Math.max(0,(store.gold||0)-R.bet);store.kvPaid[KV.code]=1;save();}}
function kvCountdown(){const R=KV.room,s=scOf(R.sid);let n=3;const bank=R.mode==='race'&&R.bet>0;
  const me=Object.assign({},R[KV.role],{bg:profBgKey()||(R[KV.role]||{}).bg});   // 13.9.6: каждый на своём фоне — ты снизу, друг сверху (как в краже билетов)
  kvScreen(`<div class="kv-vs${fxOK()?' in':''}">${kvPlHTML(R[kvFoe()]||{n:'…'},'top',false,s,rwKadr(s,R.ep),1.1)}${kvPlHTML(me,'bot',true,s,null,2)}
    <svg class="kvs-seam p" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><line x1="0" y1="54" x2="100" y2="46"/></svg><svg class="kvs-seam l" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><line x1="54" y1="0" x2="46" y2="100"/></svg>
    <div class="kvs-mid">${bank?`<div class="kv-pot" id="kvPot">${ui('coin')}<b id="kvPotN">0</b><small>банк · по ${R.bet} с каждого</small></div>`:''}
    <div class="kv-numw"><i class="cd2-ring" id="kvRing"></i><b id="kvN">3</b></div><small class="kvs-sub">${R.mode==='race'?'Наперегонки — отвечай быстро и точно':'Вместе — по очереди, начинает '+esc(R.A.n)}</small></div></div>`);
  bgFill($('.kv-vs'));if(bank)kvPotFX(R.bet);
  const pop=()=>{const el=$('#kvN'),rg=$('#kvRing');if(!el||!fxOK())return;el.animate([{transform:'scale(1.9)',opacity:0,filter:'blur(12px)'},{transform:'scale(1)',opacity:1,filter:'blur(0px)'}],{duration:480,easing:SPRING});
    if(rg)rg.animate([{transform:'translate(-50%,-50%) scale(.3)',opacity:.9},{transform:'translate(-50%,-50%) scale(2.4)',opacity:0}],{duration:640,easing:EZ.out});fxAt(el,{n:14,v:5.5,sh:'spark',life:34});};
  sfx('tap');pop();KV.cd=setInterval(()=>{n--;const el=$('#kvN');if(n<=0){clearInterval(KV.cd);sfx('win');KV.ready=true;KV.t0=Date.now();KV.qt=Date.now();if(R.mode==='race')kvRaceShow();else kvCoopShow();return;}
    if(el)el.textContent=n;pop();sfx('tap');haptic('sel');},900);}
function kvPotFX(bet){const pot=$('#kvPot'),nb=$('#kvPotN');if(!pot||!nb)return;
  if(!fxOK()){nb.textContent=bet*2;return;}
  const pr=pot.getBoundingClientRect(),px=pr.left+pr.width/2,py=pr.top+pr.height/2,K=6;let got=0;
  [...document.querySelectorAll('.kv-vs .kvp-who>b')].forEach((src,side)=>{const r=src.getBoundingClientRect(),x0=r.left+r.width/2,y0=r.top+r.height/2;
    for(let i=0;i<K/2;i++){const t=document.createElement('div');t.className='gtk';t.innerHTML=ui('coin');t.style.transform=`translate(${x0}px,${y0}px) translate(-50%,-50%) scale(0)`;FXROOT().appendChild(t);
      fxArc(t,x0,y0,px,py,{d:640,delay:250+i*120+side*60,s0:.9,s1:.6,rot:(side?-1:1)*120,lift:-50}).onfinish=()=>{t.remove();got++;nb.textContent=fmt(Math.round(bet*2*got/K));
        pot.animate([{transform:'scale(1)'},{transform:'scale(1.12)'},{transform:'scale(1)'}],{duration:240,easing:EZ.out});fxEmit(px,py,{n:6,v:3,life:30});sfx('tick');if(got===K)nb.textContent=fmt(bet*2);};}});}
// верх экрана: я и соперник/друг
function kvTop(){const R=KV.room,me=R[KV.role],fo=R[kvFoe()]||{n:'…',ans:{}},n=R.qs.length;
  if(R.mode==='race'){const sc=p=>Object.values(p.ans||{}).filter(a=>a.ok).length,pr=p=>Object.keys(p.ans||{}).length;
    return `<div class="kv-top"><div class="kv-pl me"><b>Ты</b><span>${kvSum(me)} <em>очк.</em> · ${sc(me)} ✓</span><i style="--p:${pr(me)/n*100}%"></i></div><div class="kv-vs">${R.bet?`<small>банк</small>${ui('coin')} ${R.bet*2}`:'vs'}</div><div class="kv-pl fo"><b>${esc(fo.n)}</b><span>${kvSum(fo)} <em>очк.</em> · ${sc(fo)} ✓</span><i style="--p:${pr(fo)/n*100}%"></i></div></div>`;}
  const ok=Object.values(R.co).filter(a=>a.ok).length;
  return `<div class="kv-top coop"><div class="kv-team">🤝 Общий счёт <b>${ok}</b> из ${n}</div><div class="kv-segs">${R.qs.map((q,i)=>`<i class="${R.co[i]?(R.co[i].ok?'ok':'bad'):i===R.turn?'cur':''}"></i>`).join('')}</div></div>`;}
function kvBars(){const t=document.querySelector('.kv-topw');if(t)t.innerHTML=kvTop();}
const kvT=f=>{const s=KV&&KV.room&&scOf(KV.room.sid);return s&&s.lang==='de'?f.de:f.en;};
function kvQHTML(q,f,lead){const s=scOf(KV.room.sid);
  const ask=q.t==='listen'?'🎧 Что прозвучало?':q.t==='gap'?'Вставь слово':'Что это значит?';
  const body=q.t==='listen'?`<button class="kv-hear" id="kvHear">${SI.play} Послушать</button>`:q.t==='gap'?`<b class="kv-qt">${markWord(kvT(f),f.gap,'<span class="gap">&nbsp;</span>')}</b><small class="kv-qs">${esc(f.ru)}</small>`:`<b class="kv-qt">${esc(kvT(f))}</b>`;
  return `<div class="kv-q">${lead||''}<span class="kv-ask">${ask}</span>${body}<div class="kv-o">${q.opts.map(o=>`<button data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div><div class="kv-fb" id="kvFb"></div></div>`;}
function kvBindQ(q,f,onAns){const s=scOf(KV.room.sid);if($('#kvHear')){let heard=false;
    // 11.2: на слух время идёт с конца первого прослушивания — загрузка видео не съедает очки
    const h=()=>scClip(s.id,f.id,$('#kvHear'),()=>{if(!heard&&KV&&!document.querySelector('.kv-o button[disabled]')){heard=true;KV.qt=Date.now();}});$('#kvHear').onclick=()=>{sfx('tap');h();};setTimeout(h,250);}
  $$('.kv-o button').forEach(b=>b.onclick=()=>{if(b.disabled)return;const r=b.dataset.v===q.right;$$('.kv-o button').forEach(x=>{x.disabled=true;if(x.dataset.v===q.right)x.classList.add('ok');});if(!r)b.classList.add('bad');
    sfx(r?'good':'bad');haptic(r?'ok':'err');if(r)scGot(s,f);$('#kvFb').innerHTML=`<b class="${r?'ok':'bad'}">${r?'Верно':'Мимо'}</b> ${esc(kvT(f))} — ${esc(f.ru)}`;onAns(r);});}
// наперегонки: у каждого свой темп
function kvRaceShow(){const R=KV.room,s=scOf(R.sid);if(KV.k>=R.qs.length){kvWait();return;}const q=R.qs[KV.k],f=kvF(s,q.fid);
  // 13.6.3: фразы нет (у друга новее версия) — раньше вопрос пропускался без ответа серверу, и дуэль не заканчивалась
  if(!f){const k=KV.k;KV.k++;R[KV.role].ans[k]={ok:false,ms:0};kvNet({a:'ans',code:KV.code,k,ok:false,ms:0}).then(j=>{if(j&&j.ok&&KV)KV.room=j.v;}).catch(()=>{});if(!KV.oldv){KV.oldv=1;toast('Обнови приложение: у друга новые фразы');}kvRaceShow();return;}
  KV.qt=Date.now();
  kvScreen(`<div class="kv-topw">${kvTop()}</div><div class="kv-n">Вопрос ${KV.k+1} из ${R.qs.length}</div>${kvQHTML(q,f)}`);
  kvBindQ(q,f,async r=>{const k=KV.k,ms=Date.now()-KV.qt;KV.k++;R[KV.role].ans[k]={ok:r,ms};kvBars();
    try{const j=await kvNet({a:'ans',code:KV.code,k,ok:r,ms});if(j.ok)KV.room=j.v;}catch(e){}
    setTimeout(()=>{if(!KV||KV.over)return;if(KV.k>=R.qs.length){kvApply(KV.room);if(!KV.over)kvWait();}else kvRaceShow();},r?700:1500);});}
function kvWait(){if(document.querySelector('.kv-waitb'))return kvBars();kvScreen(`<div class="kv-topw">${kvTop()}</div><div class="kv-lobby kv-waitb"><div class="kv-pulse">⏳</div><b>Ты всё! Ждём, пока ответит ${esc((KV.room[kvFoe()]||{}).n||'друг')}…</b><p>Итог — как только вы оба закончите.</p></div>`);}
// вместе: ходы по очереди, «помоги»
function kvCoopShow(){const R=KV.room,s=scOf(R.sid),k=R.turn;if(k>=R.qs.length)return;const q=R.qs[k],f=kvF(s,q.fid),who=k%2===0?'A':'B',mine=who===KV.role,helping=!mine&&R.help===k;KV.qt=Date.now();
  if(!f){if(!KV.oldv){KV.oldv=1;toast('Обнови приложение: у друга новые фразы');}if(mine||helping)kvNet({a:'ans',code:KV.code,k,ok:false,ms:0}).then(j=>{if(j&&j.ok)kvApply(j.v);}).catch(()=>{});return;}   // 13.6.3: раньше падало
  const lead=mine?`<div class="kv-turn me">Твой ход${R.help===k?' · друг уже видит вопрос':''}</div>`:helping?`<div class="kv-turn help">🆘 ${esc(R[who].n)} просит помочь — подскажи ответ!</div>`:`<div class="kv-turn">Ход: ${esc(R[who].n)}…</div>`;
  kvScreen(`<div class="kv-topw">${kvTop()}</div><div class="kv-n">Вопрос ${k+1} из ${R.qs.length}</div>${kvQHTML(q,f,lead)}${mine&&R.help!==k?`<button class="kv-helpb" id="kvHelp">🆘 Помоги — пусть ответит ${esc((R[kvFoe()]||{}).n||'друг')}</button>`:''}`);
  if(!mine&&!helping)$$('.kv-o button').forEach(b=>b.disabled=true);
  if($('#kvHelp'))$('#kvHelp').onclick=async()=>{sfx('tap');$('#kvHelp').disabled=true;$('#kvHelp').textContent='Зову на помощь…';try{const j=await kvNet({a:'help',code:KV.code,k});if(j.ok)KV.room=j.v;}catch(e){}};
  kvBindQ(q,f,async r=>{try{const j=await kvNet({a:'ans',code:KV.code,k,ok:r,ms:Date.now()-KV.qt});if(j.ok){setTimeout(()=>kvApply(j.v),r?800:1500);}else toast(j.msg||'Ответ на этот вопрос уже засчитан');}catch(e){kvErr();}});}
// итог
function kvEnd(foeLeft){kvStop();const R=KV.room,s=scOf(R.sid),me=R[KV.role],fo=R[kvFoe()]||{n:'друг',ans:{}};store.kvDone=store.kvDone||{};const first=!store.kvDone[KV.code];store.kvDone[KV.code]=1;
  let title,sub,gain=0,win=null,steal=null;
  let tbl='';
  if(R.mode==='race'){const sc=p=>Object.values(p.ans||{}).filter(a=>a.ok).length;
    const a=kvSum(me),b=kvSum(fo);win=foeLeft?true:a===b?null:a>b;
    title=foeLeft?`Победа! ${esc(fo.n)} больше нет в дуэли`:win===true?'Победа! 🏆':win===false?(sc(fo)>sc(me)?`Побеждает ${esc(fo.n)} — больше верных ответов`:`Побеждает ${esc(fo.n)} — быстрее при равном счёте`):'Ничья';   // 13.7: без угадывания рода
    sub=`Ты ${a} очк. (${sc(me)} из ${R.qs.length} верно)${foeLeft?'':` · ${esc(fo.n)} ${b} очк. (${sc(fo)} верно)`}`;
    const cell=x=>x?`<td class="${x.ok?'ok':'bad'}">${x.ok?'✓':'✗'}<small>${(x.ms/1000).toFixed(1)} с</small><em>${kvPts(x)}</em></td>`:'<td>—</td>';
    if(!foeLeft)tbl=`<table class="kv-tbl"><thead><tr><th>#</th><th>Ты</th><th>${esc(fo.n)}</th></tr></thead><tbody>${R.qs.map((q,i)=>`<tr><td>${i+1}</td>${cell((me.ans||{})[i])}${cell((fo.ans||{})[i])}</tr>`).join('')}</tbody>
      <tfoot><tr><td>Σ</td><td>${a}</td><td>${b}</td></tr></tfoot></table><p class="kv-rule">Верно — 100 очков и до 50 за скорость. Сначала решает точность, потом время.</p>`;
    if(first&&win===true)store.kvWins=(store.kvWins||0)+1;
    if(R.bet&&first){gain=win===true?R.bet*2:win===null?R.bet:0;if(gain)store.gold=(store.gold||0)+gain;   // 13.6.3: банк — сразу (раньше после анимации кражи: закрыл приложение — билеты пропали), анимация — только картинка
      if(win===null)setTimeout(()=>goldFX(gain,$('.kv-bank')),400);else steal={win,bet:R.bet,me:{n:me.n},foe:{n:fo.n},style:win?shopUse('st'):stOf(fo.fx)};}}
  else{const ok=Object.values(R.co).filter(a=>a.ok).length;title=ok===R.qs.length?'Идеально вместе! 🤝':'Пройдено вместе';sub=`Общий счёт: ${ok} из ${R.qs.length}`;if(first){gain=ok*5;addGold(gain);}}
  save();scSave();sfx(win===false?'learn':'win');ev('pvp_end',R.sid);
  const wp=R.mode==='race'&&win!=null?(win?Object.assign({},me,{bg:profBgKey()||me.bg}):fo):null;   // 13.9.6: победитель — на своём фоне
  kvScreen(`<div class="kv-end">${wp&&bgInfo(wp.bg)?kvPlHTML(wp,'win',win===true,s,null,1,win===true?'me':kvFoe()):`<div class="kv-pulse">${R.mode==='race'?(win===false?'🥈':'🏆'):'🤝'}</div>`}<b>${title}</b><p>${sub}</p>${R.mode==='race'&&R.bet?`<p class="kv-bank">${win===true?`Банк твой: ${ui('coin')} ${R.bet*2}`:win===null?`Ничья — ставка ${ui('coin')} ${R.bet} вернулась`:`Банк забирает ${esc(fo.n)}: ${ui('coin')} ${R.bet*2}`}</p>`:''}${gain&&!(R.mode==='race'&&R.bet)?`<div class="sc-gain">+${gain} ${ui('coin')}</div>`:''}${tbl}
    ${(fo.pf||fo.bg)&&!(wp&&win===false&&bgInfo(wp.bg))?`<button class="kv-pfb" data-pv="${kvFoe()}">👤 ${esc(fo.n)} · профиль ›</button>`:''}<button class="sc-btn" id="kvAgain">⚔️ Реванш</button><button class="sc-btn ghost" id="kvScene">К сцене</button><button class="sc-btn ghost" id="kvDict">📖 Словарь</button></div>`);
  bgFill($('.kv'));kvPvBind($('.kv'));$('#kvAgain').onclick=()=>{sfx('tap');const sid=R.sid,ep=R.ep;KV=null;renderScene(sid);setTimeout(()=>kvSheet(sid,ep),300);};
  $('#kvScene').onclick=()=>{sfx('tap');const sid=R.sid;KV=null;renderScene(sid);};
  $('#kvDict').onclick=()=>{sfx('tap');KV=null;DX.seg='ph';renderTab('dict');};
  if(steal)setTimeout(()=>kvSteal(steal).then(()=>{if(gain)goldFX(gain,$('.kv-bank'));setTimeout(dictFly,gain?1500:200);}),350);   // 13.3: кража билетов, потом выплата и карты
  else setTimeout(dictFly,900);}
function kvLeave(){if(KV){kvNet({a:'leave',code:KV.code}).catch(()=>{});kvStop();const sid=KV.room&&KV.room.sid;KV=null;if(sid)renderScene(sid);else renderHome();}}
// слова-ловушки для пропуска: та же форма (-ing, -ed, -ly, -s, n't), похожая длина
const SC_STOP=new Set('the a an to of and or in on at for is are was were be it i you he she we they me my your his her our their this that with as but so if not do does did have has had will would can could just what how why who'.split(' '));
// слова-ловушки для пропуска: та же часть речи и форма, по смыслу подходят во фразу — выбрать можно, только если расслышал или знаешь
const SC_POOLS={
  vs:'cuts makes takes fixes sells washes does keeps runs pays brings gets wants needs'.split(' '),
  ns:'keys points rules clients games friends stocks cards months ducks deals kids'.split(' '),
  ing:'making taking getting doing going saying looking following calling working selling paying'.split(' '),
  ed:'landed called moved played worked lived looked stopped finished started seen done taken made known gone mistaken hurt'.split(' '),
  ly:'really finally suddenly lately quickly clearly usually exactly actually probably'.split(' '),
  adj:'excited relaxed bored lonely sharp soft fake brilliant tasteful subtle amazing sufficient impressive advantageous married lucky nice good great late'.split(' '),
  vb:'let build tell guess trust follow cash keep see think look go take make get call pay'.split(' '),
  n:'rule game card walk gift turn escape pride result account reservation balance success paper wheel pocket hair money job week life day'.split(' ')};
const SC_PRON=new Set('he she it who that'.split(' '));
function scGapKind(g,prev){const w=g.toLowerCase();
  for(const k in SC_POOLS)if(SC_POOLS[k].includes(w))return k==='vs'||k==='ns'?(SC_PRON.has(prev)||/^[A-Z]/.test(prev||'')?'vs':'ns'):k;
  if(/ing$/.test(w))return 'ing';if(/ed$/.test(w))return 'ed';if(/ly$/.test(w))return 'ly';
  if(/[^s]s$/.test(w))return SC_PRON.has(prev)?'vs':'ns';
  if(/(ful|ous|ive|able|ible|al|ic|ent|ant|y)$/.test(w))return 'adj';return 'n';}
function scGapOpts(f,all){const g=f.gap,low=g.toLowerCase(),words=(f.en||'').split(/[^A-Za-z']+/),ix=words.findIndex(w=>w.toLowerCase()===low);
  const prev=ix>0?words[ix-1]:'',prevL=prev.toLowerCase(),kind=scGapKind(g,SC_PRON.has(prevL)?prevL:prev);
  const inPhrase=new Set(words.map(w=>w.toLowerCase()));
  const pool=shuffle(SC_POOLS[kind].filter(w=>w!==low&&!inPhrase.has(w))).map(w=>({w,s:Math.abs(w.length-g.length)*0.2+Math.random()})).sort((p,q)=>p.s-q.s).map(x=>x.w);
  // добор из слов сцены той же формы, если в словаре мало
  const suf=w=>(w.match(/(ing|ed|ly|s)$/i)||[''])[0].toLowerCase();
  const extra=[...new Set(all.flatMap(x=>(x.en||'').split(/[^A-Za-z']+/)))].filter(w=>w.length>=3&&!SC_STOP.has(w.toLowerCase())&&w.toLowerCase()!==low&&suf(w)===suf(g));
  const pick=[...new Set([...pool,...shuffle(extra).map(w=>w.toLowerCase())])].slice(0,3);
  const cap=/^[A-Z]/.test(g);return pick.map(w=>cap?w[0].toUpperCase()+w.slice(1):w);}
// «Что здесь сказали?»: та же фраза, но одно слово заменено похожим — надо реально расслышать
function scListenOpts(f,all,de){const src=de?f.de:f.en,re=wordRe(f.gap||'');
  if(!f.gap||!src||!re.test(src))return null;return (de?scGapOptsDe(f,all):scGapOpts(f,all)).map(w=>src.replace(re,(m,a)=>a+w));}
// 13.6.3: немецкие ловушки для пропуска — немецкие слова той же сцены (раньше английские: один немецкий ответ среди английских)
const SC_STOP_DE=new Set('ich du er sie es wir ihr der die das den dem des ein eine einen einem einer eines und oder aber nicht kein keine ist sind war waren bin bist hat habe haben hast wird werden wurde mit von zu zum zur im in am an auf aus bei für was wie wer wo ja nein so dann denn doch noch schon nur auch mal mir mich dir dich ihm ihn uns euch sich man da hier jetzt'.split(' '));
function scGapOptsDe(f,all){const g=String(f.gap),low=g.toLowerCase(),toks=x=>String(x||'').split(/[^A-Za-zÄÖÜäöüß]+/).filter(Boolean),words=toks(f.de);
  const first=words.length&&words[0].toLowerCase()===low,cap=!first&&/^[A-ZÄÖÜ]/.test(g),inPh=new Set(words.map(w=>w.toLowerCase()));
  const end=w=>(w.toLowerCase().match(/(en|er|es|em|st|te|t|e|n|s)$/)||[''])[0],seen=new Set(),cand=[];
  const add=w=>{const l=w.toLowerCase();if(seen.has(l)||l===low||inPh.has(l)||w.length<3||SC_STOP_DE.has(l))return;seen.add(l);cand.push(cap?w[0].toUpperCase()+w.slice(1):l);};
  all.flatMap(x=>toks(x.de)).filter((w,k,a)=>/^[A-ZÄÖÜ]/.test(w)===cap).forEach(add);
  if(cand.length<3)shuffle(Object.keys(GLOSS_DE).filter(w=>/^[a-zäöüß]+$/i.test(w))).slice(0,300).forEach(add);
  const r=cand.map(w=>({w,s:Math.abs(w.length-g.length)*0.25+(end(w)===end(g)?0:0.8)+Math.random()*0.6})).sort((a,b)=>a.s-b.s).slice(0,3).map(x=>x.w);
  return first?r.map(w=>w[0].toUpperCase()+w.slice(1)):r;}
const scToks=s=>String(s).split(/\s+/).filter(Boolean);
const scNorm=s=>String(s).toLowerCase().replace(/[^a-zäöüß'\s]/g,'').replace(/\s+/g,' ').trim();
// 13.6.3: немецкий без немецкой клавиатуры — ß=ss, ä=ae=a, ö=oe=o, ü=ue=u (обе стороны, только для немецких ответов)
const deLoose=x=>String(x).replace(/ß/g,'ss').replace(/ä|ae/g,'a').replace(/ö|oe/g,'o').replace(/ü|ue/g,'u');
const W_IRR={come:['came','coming'],came:['come'],go:['went','going'],went:['go'],is:['are','was'],are:['is','were'],was:['were','is'],were:['was'],have:['has','had'],has:['have'],had:['have'],
  do:['does','did'],does:['do'],did:['do','does'],can:['could'],could:['can'],would:['will'],will:['would'],been:['being','be'],be:['been','being'],my:['me'],me:['my'],by:['to','at'],to:['for','at'],for:['to'],
  at:['in','on'],in:['on','at'],on:['in'],a:['the'],the:['a'],you:['your'],your:['you'],get:['got'],got:['get'],make:['made'],made:['make'],take:['took'],took:['take'],think:['thought'],know:['knew'],
  see:['saw'],say:['said'],tell:['told'],this:['that'],that:['this'],some:['any'],any:['some']};
function wForms(w,de){const r=wForms0(w,de);return r.filter(v=>W_IRR[String(w).toLowerCase()]||(typeof GLOSS!=='undefined'&&GLOSS[v]));}   // только настоящие слова (есть в словаре сцен)
function wForms0(w,de){const l=String(w).toLowerCase();if(de)return [];if(W_IRR[l])return W_IRR[l];
  if(/ing$/.test(l)&&l.length>5)return [l.replace(/ing$/,''),l.replace(/ing$/,'ed')];if(/ed$/.test(l)&&l.length>4)return [l.replace(/ed$/,''),l.replace(/ed$/,'ing')];
  if(/s$/.test(l)&&l.length>3)return [l.replace(/s$/,'')];if(l.length>2&&/^[a-z]+$/.test(l))return [l+'s',l+'ing'];return [];}
// 13.9.34: план проверки — отдельно (тест qlen.js проходит им все сцены): 4 задания на эпизод, ни в одном не больше 7 нужных кубиков
function scQuizPlan(id,i){
  const s=scOf(id),les=!!i&&typeof i==='object'&&Array.isArray(i.list),rev=i==='rev',P=scP(id),de=scL()==='de',boss=les&&!!i.boss,beg=store.lvl!=='b'&&!boss;
  SCUR={id,i:typeof i==='number'?i:0};   // язык фразы (scT, scIsDe) — по текущей сцене
  const all=s.parts.flatMap(x=>x.ph);
  const normalList=()=>phPick(scAct(s.parts[i].ph),window.ZAI_ON?3:4);   // z-ai-version: 3 коротких задания вместо 4
  if(rev){if(REVC.go!==id)REVC={sid:id,q:[],go:null};REVC.go=null;}   // 13.9.69: «Ещё 3» продолжает, новый заход — с чистого листа
  const RC=rev?REVC.q.splice(0,SC_PORT):[];   // ошибки прошлой порции — первыми
  const list=les?i.list.filter(f=>!f.passive).slice(0,SC_PORT):rev?[...RC.map(x=>x.f),...shuffle(scDue(s)).filter(f=>!RC.some(x=>x.f===f))].slice(0,SC_PORT):normalList();
  if(!list.length)return {s,list,Q:[]};

  // Вопрос больше не «угадай, что имел в виду генератор».
  // Каждый экран проверяет ровно один объект:
  // LISTEN = что реально прозвучало, BUILD = точная реплика, LIFE = та же выученная реплика в новой ситуации, GAP = одно слово.
  const target=f=>scT(f);
  const lifeOf=f=>{
    if(de&&!scIsDe()&&f.exDe&&f.exDe[0])return {situation:f.exDe[0][1],target:f.exDe[0][0]};
    const x=f.ex&&f.ex[0];if(!x)return null;
    const tg=de?(x[2]||''):x[0];return tg?{situation:x[1],target:tg}:null;
  };
  // 11.4: «примени в жизни» — только если все слова примера уже встречались (в пройденных эпизодах, важных словах или базовом наборе)
  const known=(()=>{const K=new Set(SC_BASIC);const addT=t=>scToks(String(t||'')).forEach(w=>{w=scNorm(w).replace(/[^a-zäöüß']/g,'');if(w)K.add(w);});
    s.parts.forEach((pp,pi)=>{if(!(P.w[pi]||P.done.includes(pi)||pi===(typeof i==='number'?i:-1)||les||rev))return;pp.ph.forEach(x=>{addT(x.en);(x.kw||[]).forEach(k=>{addT(k[0]);addT(k[1]);});});});
    SCENES.forEach(z=>{if(z===s)return;const Z=scP(z.id);z.parts.forEach(pp=>pp.ph.forEach(x=>{if((Z.m[x.id]||0)>=1||(Z.got&&Z.got[x.id]))addT(x.en);}));});return K;})();
  const isKnown=w=>{w=scNorm(w).replace(/[^a-zäöüß']/g,'');if(!w||known.has(w))return true;const b=[w.replace(/'s$/,''),w.replace(/s$/,''),w.replace(/es$/,''),w.replace(/ed$/,''),w.replace(/d$/,''),w.replace(/ing$/,''),w.replace(/ing$/,'e')];return b.some(x=>known.has(x));};
  const canLife=f=>{const l=lifeOf(f);const n=l?scToks(l.target).length:0;return n>=2&&n<=SC_MAXB&&(de||scToks(l.target).every(isKnown));};
  const whenOthers=f=>{const pool=all.filter(x=>x!==f&&!x.passive&&x.use&&x.use!==f.use);return pool.length>=2?pool:[...pool,...SCENES.filter(z=>z!==s&&z.lang===s.lang).flatMap(z=>z.parts.flatMap(q=>q.ph)).filter(x=>!x.passive&&x.use&&x.use!==f.use)];};
  const canWhen=f=>!!f.use&&!de&&whenOthers(f).length>=2;
  const canBuild=f=>scToks(target(f)).length>=2&&scToks(target(f)).length<=SC_MAXB;
  // длинная фраза (> 7 слов): «на слух» → «Что прозвучало?» (3 варианта), «собери» → «Собери выражение», нет выражения — «Какое слово пропущено?» из 4
  const heardOk=f=>{const o=scListenOpts(f,all,scIsDe());return !!(o&&o.filter(x=>x!==(scIsDe()?f.de:f.en)).length>=2);};
  const meanOk=f=>!!(f.trap&&f.trap.length>=2);
  const fitT=(t,f)=>{if(scToks(target(f)).length<=SC_MAXB||!['listen','build'].includes(t))return t;const ex=!!scExpr(f,target(f));
    const seq=t==='listen'?[heardOk(f)&&'heard',ex&&'expr',canGap(f)&&'gap4',meanOk(f)&&'mean']:[ex&&'expr',canGap(f)&&'gap4',heardOk(f)&&'heard',meanOk(f)&&'mean'];   // 13.9.40: «Когда пригодится?» больше не задание
    return seq.find(Boolean)||t;};
  const canGap=f=>!!f.gap&&wordRe(f.gap).test(target(f));

  const canB=f=>scToks(target(f)).length>=2;   // 13.9.34: длинную фразу тоже «собираем» — fitT превратит это в «Собери выражение»
  function taskFor(f,k,retry){
    // финал сцены: всё на слух (видео без субтитров) + вписать слово
    if(boss)return k%3===1&&canGap(f)?'gap':'listen';
    // новичок: выбрать перевод, послушать и собрать (без лишних слов), собрать по переводу, слово из вариантов — без «примени в жизни»
    if(beg&&!retry){let t2=['mean','listen','build','gap'][k%4];if(t2==='mean'&&!(f.trap&&f.trap.length>=2))t2='listen';if(t2==='build'&&!canB(f))t2='listen';if(t2==='gap'&&!canGap(f))t2=canB(f)?'build':'listen';return t2;}
    if(beg&&retry)return canB(f)?'build':'listen';
    if(retry){
      if(canLife(f)&&k%2===0)return 'life';if(canB(f))return 'build';
      return 'listen';
    }
    if(rev){
      if(k%3===0&&canLife(f))return 'life';
      if(k%3===1&&canGap(f))return 'gap';
      return canB(f)?'build':'listen';
    }
    const seq=['listen','gap','build','mean'];   // 13.9.40: без «Когда пригодится?» (use показываем после ответа)
    let t=seq[k%seq.length];
    if(t==='mean'&&!(f.trap&&f.trap.length>=3))t=canLife(f)?'life':'listen';
    if(t==='build'&&!canB(f))t=canGap(f)?'gap':'listen';
    if(t==='life'&&!canLife(f))t=canB(f)?'build':(canGap(f)?'gap':'listen');
    if(t==='gap'&&!canGap(f))t=canB(f)?'build':'listen';
    return t;
  }

  const Q=list.map((f,k)=>{const c=RC.find(x=>x.f===f);return c?{f,type:c.type,re:true}:{f,type:fitT(taskFor(f,k,false),f)};});
  return {s,les,rev,P,de,boss,beg,all,list,Q,target,lifeOf,canLife,whenOthers,canWhen,canBuild,canGap,fitT};
}
function renderScQuiz(id,i){
  const C=scQuizPlan(id,i);SCUR={id,i:typeof i==='number'?i:0};
  if(!C.list.length){toast('Здесь пока нет фраз для проверки');return;}
  const {s,les,rev,P,de,boss,beg,all,Q,target,lifeOf,canLife,whenOthers,canBuild,fitT}=C,T0=Date.now();
  const need=Q.length;let n=0,ok=0,wrong=0,combo=0;

  function show(){
    const q=Q[n],f=q.f,type=q.type;
    let title='',ask='',opts=[],correct='',build=null,video=false,typed=false;

    // 13.6: выбора «кубики или напиши сам» больше нет — решает приложение: знающий базу пишет сам (фраза до 9 слов),
    // новичок и длинные фразы — собирают из кубиков. Ошибся — подсказка по буквам: у случайного слова → у другого → у всех
    const ladder=type==='listen'&&!beg&&!boss&&typeOn()&&scToks(scIsDe()?f.de:f.en).length<=9;
    if(type==='listen'){
      ask=ladder?'👂 Послушай и напиши':'Послушай и собери';
      title=ladder?'Что прозвучало?<br><small class="qsm">Напиши сам — опечатки прощаю. Ошибёшься — подскажу первые буквы</small>':'Собери, что услышал<br><small class="qsm">Видео покажет момент — собери реплику из слов</small>';
      const heard=scIsDe()?x=>x.de:x=>x.en;correct=heard(f);
      build=makeBuild(correct,f,all);opts=null;
      video=true;
    }

    if(type==='heard'){   // 13.9.34: длинная фраза на слух — выбрать, что прозвучало (в двух вариантах одно слово подменено)
      ask='Что прозвучало?';title='Послушай и выбери, что сказали<br><small class="qsm">Видео покажет момент. В двух вариантах одно слово другое</small>';
      const dd=scIsDe();correct=dd?f.de:f.en;opts=shuffle([correct,...shuffle((scListenOpts(f,all,dd)||[]).filter(x=>x!==correct)).slice(0,2)]);video=true;
    }

    if(type==='expr'){   // 13.9.34: длинная фраза — собрать только выражение
      const E=scExpr(f,target(f));q.ex=E;ask='Собери выражение';
      title=`${esc(f.ru)}${E.ru?`<br><small class="qsm">Выражение: <span class="mk">${esc(E.ru)}</span></small>`:''}`;
      correct=E.x;build=makeBuild(E.x,f,all,true);
    }

    if(type==='build'){
      ask='Вспомни дословно';
      title=`${esc(f.ru)}<br><small class="qsm">Собери именно фразу из сцены — не синоним и не свой вариант</small>`;
      correct=target(f);
      build=makeBuild(correct,f,all);
    }

    if(type==='life'){
      const life=lifeOf(f);
      ask='Примени в жизни';
      title=`${esc(life.situation)}<br><small class="qsm">Скажи это ${de?'по-немецки':'по-английски'} — той же конструкцией, что во фразе из сцены:</small><span class="life-src"><b>${esc(target(f))}</b><small>${esc(f.ru)}</small></span>`;
      correct=life.target;
      build=makeBuild(correct,f,all);
      q.life=life;
    }

    if(type==='when'){
      ask='Когда пригодится?';title=`${esc(target(f))}<br><small class="qsm">${esc(f.ru)}</small>`;correct=f.use;
      opts=shuffle([f.use,...shuffle(whenOthers(f)).slice(0,beg?1:2).map(x=>x.use)]);
    }

    if(type==='mean'){
      ask='Что это значит?';title=esc(target(f));correct=f.ru;opts=shuffle([correct,...f.trap.slice(0,beg?2:3)]);
    }

    if(type==='gap'||type==='gap4'){
      ask='Закрепи ключевое слово';
      title=markWord(target(f),f.gap,'<span class="gap">&nbsp;</span>')
        +`<br><small class="qsm">${esc(f.ru)}</small>`;
      correct=f.gap;opts=null;typed=true;
      ask='Впиши пропущенное слово';
      if(type==='gap4'||beg||!typeOn()){typed=false;ask=type==='gap4'?'Какое слово пропущено?':'Выбери пропущенное слово';opts=shuffle([f.gap,...(scIsDe()?scGapOptsDe(f,all):scGapOpts(f,all)).filter(x=>x.toLowerCase()!==String(f.gap).toLowerCase()).slice(0,beg&&type!=='gap4'?2:3)]);}
    }

    const p=s.parts[f.pi];q.t0=Date.now();
    scMount(s,`
      <div class="sc-head"><button class="sc-back" id="scb">${ui('close')}</button>
        <div class="sc-segs">${Q.map((x,k)=>`<i class="${k<n?(x.res?'ok':'bad'):k===n?'cur':''}"></i>`).join('')}</div>
      </div>
      ${boss&&n===0?`<div class="boss-banner">👑 <b>Финал сцены</b><span>Фразы всей сцены на слух, без субтитров. Покажи, что понимаешь на слух.</span></div>`:''}
      ${video?`<div class="sc-v sc-qvideo" id="scvw"><div class="sc-over" id="scvo"><button id="scplay" aria-label="Послушать">▶</button></div></div>${scCtrl()}`:''}
      <div class="sc-q sc-card">
        <div class="sc-meta">${ask}${q.re?' · повтор этой фразы':''}</div>
        <h2>${title}</h2>
        ${build
          ?`${ladder?`<div class="sc-lmask lm2" id="scLm"></div><div class="sc-lt" id="scLt"><input class="sc-gapin" id="scLin" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="Напиши, что услышал"><button class="sc-btn" id="scLok">Проверить</button></div>
            <div class="sc-lh lh2" id="scLh"><button class="tk-help" id="scLhint">💡 Подсказка <small>${ADM_OPEN()||premHas()?'':`🎟 ${SC_HINT}`}</small></button><button class="tk-help ghost" id="scLno">Не знаю</button></div>`:''}${q.ex?`<div class="sc-expr">${esc(q.ex.pre)}<span class="sc-bans in" id="scbans"></span>${esc(q.ex.post)}</div>`:`<div class="sc-bans" id="scbans"${ladder?' hidden':''}></div>`}${type!=='listen'&&!beg?`<button class="sc-reveal" id="scbrev">Сначала вспомни сам → показать слова</button>`:''}<div class="sc-bpool" id="scbpool"${(type!=='listen'&&!beg)||ladder?' hidden':''}></div>${beg&&build.tk.length>2?'<p class="sc-bhint">Первое слово уже стоит — продолжи</p>':''}<p class="tk-tip" id="scTip"${ladder?' hidden':''}>Зажми слово — покажу перевод</p>
            <div class="sc-bact"><button class="sc-btn ghost" id="scbrst" hidden>Сбросить</button><button class="sc-btn" id="scbchk" hidden>Проверить</button></div><div class="sc-bmsg" id="scbmsg"></div><div id="scbdiff"></div>`
          :typed?`<input class="sc-gapin" id="scgap" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="впиши слово и нажми «Готово»">
            <div class="sc-bact"><button class="sc-btn ghost" id="scgno">Не помню</button><button class="sc-btn" id="scgok">Проверить</button></div><div class="sc-bmsg" id="scbmsg"></div>`
          :`<div class="sc-opts">${opts.map(o=>`<button class="sc-opt" data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div>`}
        <div id="scfb"></div>
      </div>`,'scq');

    $('#scb').onclick=()=>boss?renderScene(id):les||(rev&&REVCHAIN)?renderTab('learn'):rev?renderScene(id):renderScEp(id,i);

    if(video){
      scVideo($('#scvw'),s,p,true);$('#scvw').appendChild($('#scvo'));
      // 11.2: большая ▶ не мелькает перед стартом — видна, только если автозапуск не прошёл или клип закончился
      const ov=$('#scvo');ov.style.display='none';
      const run=()=>{ov.style.display='none';const pr=scPlay(f.a-p.a,f.b-p.a,()=>{ov.style.display='';});if(pr&&pr.catch)pr.catch(()=>{ov.style.display='';});};
      $('#scplay').onclick=run;scBindCtrl(run);
      setTimeout(run,250);
    }

    const answer=(right,el)=>{
      if(q.res!==undefined)return;
      q.res=right;{const ln=$('#scLh'),tp=$('#scTip');if(ln)ln.hidden=true;if(tp)tp.hidden=true;}
      const r0=P.r[f.id];   // 13.9.69: шаг повторения до ответа — ошибка в повторении возвращает фразу завтра (раньше выпадала из расписания)
      try{const ms=Date.now()-(q.t0||Date.now()),nw=build?build.tk.length:scToks(String(correct||'')).length;ev('qtime',type+'|'+ms+'|'+nw,{t:type,ms,n:nw});}catch(e){}   // 13.9.34: время ответа (медиана — в «Воронке»)   // 12.6: «Не знаю» и подсказка про кубики висели после ответа
      if(right)ok++;else wrong++;
      if(!q.re)lvRate(right&&!q.soft,wlvText(s.lang==='de'?f.de:f.en,s.lang==='de'?'de':'en'),type);   // 13.9.72: живой уровень
      if(right){combo++;if(combo>=3&&combo%3===0)toast(`🔥 ${combo} подряд без ошибок`);}else combo=0;

      // Ошибка не стирает выученное. Она только снимает «надолго» и возвращает точечный повтор.
      const before=P.m[f.id]||0;
      if(right){
        P.m[f.id]=Math.min(3,before+1);scGot(s,f);
      }else{
        if(before>=3)P.m[f.id]=2;
        delete P.r[f.id];
        if(!q.re){
          const retryType=fitT(type==='life'?(canBuild(f)?'build':'listen'):(canLife(f)?'life':(canBuild(f)?'build':'listen')),f);
          if(rev){REVC.sid=id;REVC.q.push({f,type:retryType,re:true});}   // 13.9.69: в повторении — в следующую порцию, в порции не больше трёх
          else Q.splice(Math.min(Q.length,n+3),0,{f,type:retryType,re:true});
        }
      }
      if(right&&q.soft&&!q.re&&!rev){const rt=fitT(canBuild(f)&&type!=='build'?'build':'listen',f);Q.splice(Math.min(Q.length,n+3),0,{f,type:rt,re:true});}   // 13.6: с подсказкой — ещё раз попозже
      if(P.m[f.id]>=3&&!P.r[f.id])P.r[f.id]=[0,Date.now()+SC_DAYS[0]*864e5];

      if(rev){
        if(q.re){if(r0)P.r[f.id]=r0;}   // 13.9.71 (ревью П8, п.1): повтор после ошибки — расписание как поставила первая ошибка (завтра), ни вперёд, ни ещё шаг назад
        else if(right){
          const prev=P.r[f.id]||[0,0],st=prev[0]+1;
          if(st>=SC_DAYS.length){delete P.r[f.id];P.rDone=P.rDone||{};P.rDone[f.id]=1;}
          else P.r[f.id]=[st,Date.now()+SC_DAYS[st]*864e5];
        }else P.r[f.id]=[Math.max(0,((r0||[0,0])[0]||0)-1),Date.now()+864e5];   // 13.9.69: как в повторении на сегодня (phSRS) — вернётся завтра
      }
      if(rev&&right)store.reviews=(store.reviews||0)+1;
      scSave();sfx(right?'good':'bad');haptic(right?'ok':'err');countAnswer();save();if(right)fxGood(el||$('#scbmsg'));

      if(!build)$$('.sc-opt').forEach(x=>{
        x.disabled=true;
        if(x.dataset.v===correct)x.classList.add('right');
        else if(x===el)x.classList.add('wrong');
        else x.classList.add('dim');
      });

      const life=q.life;
      $('#scfb').innerHTML=`<div class="sc-fb ${right?'ok':'bad'}">
        <div class="t">${right?(q.typo?'Верно — только опечатка':q.soft?'Верно — с подсказкой, фраза вернётся ещё раз':'Верно'):q.soft?`Собрал с ${q.tries+1}-й попытки — фраза вернётся ещё раз`:'Вот как правильно'}</div>
        ${!right&&build&&q.miss?scFixHTML(build.tk,q.miss,q.ex):''}
        ${life
          ?`<div class="en">${kwWrap(f,correct)}</div><div class="ru">${esc(life.situation)}</div><div class="orig">В сцене было: ${esc(target(f))} — ${esc(f.ru)}</div>`
          :(type==='listen'&&de&&!scIsDe()?`<div class="en">${esc(f.en)}</div><div class="orig">по-немецки: ${esc(f.de)}</div><div class="ru">${esc(f.ru)}</div>`:`<div class="en">${kwWrap(f)}</div><div class="ru">${esc(f.ru)}</div>`)}
        <div class="fb-info">${phInfoHTML(f,{noEx:!!life,once:true})}</div>
        ${!right&&type==='mean'&&el&&f.trap.includes(el.dataset.v)?`<div class="sc-trapwhy">Это ловушка: дословный перевод или похожие слова, но смысл другой.</div>`:''}
        <button class="sc-btn" id="scnx" style="margin-top:12px">${n===Q.length-1?'Закончить':'Дальше'} →</button>
      </div>`;
      kwBind($('#scfb'),f);scShowFb($('#scfb'));
      $('#scnx').onclick=()=>{kwHide(0);n++;if(n<Q.length)show();else end();};
      if(right)autoNext($('#scnx'),$('#scfb'),Math.max(3200,Math.min(8000,2400+($('#scfb').textContent||'').length*24)));   // 13.6: само дальше
    };

    if(typed){
      const inp=$('#scgap'),msg=$('#scbmsg');q.tries=0;
      const raw=x=>scNorm(x).replace(/'/g,''),norm=x=>de?deLoose(raw(x)):raw(x);
      const check=final=>{if(q.res!==undefined)return;const v=norm(inp.value),c=norm(correct),cl=raw(correct).length;if(!v){inp.focus();return;}
        if(v===c){inp.classList.add('ok');answer(true);return;}
        if(c.length>=4&&lev(v,c)<=1){q.typo=true;inp.classList.add('typo');answer(true);return;}
        if(!final)return;q.tries++;inp.classList.add('bad');setTimeout(()=>inp.classList.remove('bad'),450);haptic('err');
        if(q.tries>=2){answer(false);inp.disabled=true;return;}
        msg.textContent=`Не то. Подсказка: ${cl} ${plural(cl,['буква','буквы','букв'])}, начинается на «${correct.charAt(0)}».`;};
      inp.oninput=()=>check(false);inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();check(true);}};
      inp.onpaste=e=>e.preventDefault();
      $('#scgok').onclick=()=>check(true);$('#scgno').onclick=()=>{if(q.res===undefined){answer(false);inp.disabled=true;}};
      setTimeout(()=>{try{inp.focus();}catch(e){}},300);
    }else if(build){
      q.tries=0;const pool=$('#scbpool');
      if(ladder){const inp=$('#scLin'),msg=$('#scbmsg'),W=scToks(correct).map(w=>w.replace(/[.,!?;:…"«»()]+/g,'')).filter(Boolean),nW=W.map(w=>scNorm(w).replace(/'/g,''));
        // 0 — скрыто · 1 — первая буква · 2 — слово открыто подсказкой · 3 — слово сам написал верно
        const rv=W.map(()=>0);let lvl=0,tr=0;
        const paint=()=>{$('#scLm').innerHTML=W.map((w,k)=>{const r=rv[k],L=[...w];const body=r>=2?esc(w):(r===1?esc(L[0]):'')+'<i>'+'·'.repeat(Math.max(0,L.length-(r===1?1:0)))+'</i>';
          return `<span class="lm-w${r===3?' ok':r===2?' hint':r===1?' l1':''}">${body}</span>`;}).join('');};
        const pick=lim=>{const c=W.map((_,k)=>k).filter(k=>rv[k]<lim);return c.length?c[Math.floor(Math.random()*c.length)]:-1;};
        const step=()=>{lvl++;if(lvl<=2){const k=pick(1);if(k>=0)rv[k]=1;else lvl=3;}   // буква у случайного слова → у другого → у всех → дальше целым словом
          if(lvl===3)W.forEach((_,k)=>{if(rv[k]<1)rv[k]=1;});
          if(lvl>3){const k=pick(2);if(k>=0)rv[k]=2;}
          q.soft=true;paint();$('#scLm').animate([{transform:'scale(1.03)'},{transform:'none'}],{duration:260,easing:'ease-out'});};
        const F=scIsDe()?deLoose:x=>x;
        const chk=()=>{if(q.res!==undefined)return;const v=F(scNorm(inp.value).replace(/'/g,'')),c=F(scNorm(correct).replace(/'/g,''));if(!v){inp.focus();return;}
          if(v===c||(c.length>=6&&lev(v,c)<=Math.max(1,Math.floor(c.length/14)))){rv.forEach((r,k)=>{if(r<2)rv[k]=3;});paint();$('#scLt').hidden=true;$('#scLh').hidden=true;msg.textContent='';answer(true);return;}
          scLcsMarks(nW.map(F),v.split(/\s+/).filter(Boolean)).forEach((m,k)=>{if(m)rv[k]=3;});   // что написал верно — остаётся зелёным
          tr++;q.tries=tr;q.soft=true;haptic('err');sfx('bad');inp.classList.add('bad');setTimeout(()=>inp.classList.remove('bad'),450);
          if(rv.every(r=>r>=2)){paint();msg.textContent='Все слова уже видно — допиши фразу целиком.';return;}
          step();msg.textContent=lvl<=2?'Не то. Подсказал первую букву у одного слова — попробуй ещё.':lvl===3?'Вот первые буквы всех слов — ещё попытка.':'Открыл ещё одно слово целиком.';};
        $('#scLok').onclick=chk;inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();chk();}};
        $('#scLhint').onclick=()=>{if(q.res!==undefined)return;const free=ADM_OPEN()||premHas();
          if(!free&&(store.gold||0)<SC_HINT){toast(`Нужно 🎟 ${SC_HINT} — или ошибись, и подскажу бесплатно`);haptic('err');return;}
          if(rv.every(r=>r>=2)){toast('Все слова уже открыты');return;}
          if(!free){store.gold-=SC_HINT;save();}sfx('tap');haptic('sel');step();msg.textContent=free?'Подсказка':`Подсказка · −${SC_HINT} 🎟`;};
        $('#scLno').onclick=()=>{if(q.res!==undefined)return;sfx('tap');rv.forEach((r,k)=>{if(r<2)rv[k]=2;});paint();$('#scLt').hidden=true;$('#scLh').hidden=true;answer(false);};
        paint();if(matchMedia('(hover:hover)').matches)setTimeout(()=>{try{inp.focus({preventScroll:true});}catch(e){}},700);}
      const rv=$('#scbrev');if(rv){const open=()=>{if(!pool.hidden)return;pool.hidden=false;rv.remove();sfx('tap');};rv.onclick=open;setTimeout(()=>{if(document.body.contains(rv))open();},3500);}
      scTilesUI(build,{ans:$('#scbans'),pool,chk:$('#scbchk'),rst:$('#scbrst'),msg:$('#scbmsg'),fix:!!q.ex,
        done:(right,tries,miss)=>{q.tries=tries;q.miss=miss;if(right){q.soft=tries>0;answer(tries===0);}else answer(false);}});   // 13.9.34: 2 попытки, верные кубики остаются, первая буква в пустой клетке
    }else{
      $$('.sc-opt').forEach(b=>b.onclick=()=>answer(b.dataset.v===correct,b));
    }
  }

  function makeBuild(text,f,allPhrases,force){
    const deS=scIsDe()||(scL()==='de'&&/[äöüß]|\b(ich|du|der|die|das|und|nicht)\b/i.test(text));
    // без точек, запятых и заглавных: порядок слов надо помнить, а не угадывать по знакам
    const clean=w=>{let x=String(w).replace(/[.,!?;:…"«»()]+/g,'');if(!deS&&!/^I('|$)/.test(x))x=x.toLowerCase();return x;};
    let tk=scToks(text).map(clean).filter(Boolean);
    tk=scChunk(tk);   // длинная фраза — кусками, без одинаковых кубиков
    const fresh=!force&&(beg||(!rev&&!(P.m[f.id]>0)&&!q0re(f)));
    const pool=[],used=new Set(tk.map(x=>x.toLowerCase()));
    if(!fresh){
      // ловушки: другие формы тех же слов (work → worked, come → came, by → to)
      for(const w of shuffle(tk.filter(x=>!x.includes(' ')))){for(const v of wForms(w,deS)){if(pool.length>=2)break;if(!used.has(v.toLowerCase())){pool.push(v);used.add(v.toLowerCase());}}if(pool.length>=2)break;}
      for(const x of shuffle(allPhrases)){if(pool.length>=2)break;if(x===f)continue;const w=scToks(target(x)).map(clean).find(y=>y&&y.length>2&&!used.has(y.toLowerCase()));if(w){pool.push(w);used.add(w.toLowerCase());}}   // 13.9.34: лишних кубиков — 2
    }
    const B={tk,pool:shuffle([...tk,...pool]).map((w,k)=>({w,k})),got:[]};
    if(beg&&tk.length>2){const first=B.pool.find(x=>x.w===tk[0]);if(first)B.got=[first];}
    return B;
  }
  function q0re(f){return Q.some(x=>x.f===f&&x.re);}

  function end(){
    try{const ms=Date.now()-T0;ev('qtime','all|'+ms+'|'+Q.length,{t:'all',ms,n:Q.length});}catch(e){}
    const firsts=rev?Q:Q.filter(x=>!x.re),okF=firsts.filter(x=>x.res).length,passed=okF===firsts.length;   // 13.9.69: в повторении повторы ошибок идут следующей порцией — считаем все три
    const firstTime=!rev&&!les&&!P.done.includes(i);
    if(!rev&&!les&&!P.done.includes(i)){P.done.push(i);scSave();}
    if(!rev&&les&&!boss&&!P.done.includes(Q[0].f.pi)){P.done.push(Q[0].f.pi);scSave();}
    // 9.2: звёзды (100% — 3, от 70% — 2, иначе 1) и монеты
    const acc=firsts.length?okF/firsts.length:0,stars=acc>=1?3:acc>=.7?2:1;let gain=0,prevSt=0;
    if(boss){prevSt=P.boss||0;gain=prevSt?Math.max(0,stars-prevSt)*30+okF*2:150+okF*5;P.boss=Math.max(prevSt,stars);}
    else if(!rev&&!les){P.st=P.st||{};prevSt=P.st[i]||0;gain=firstTime?20+okF*8:Math.max(0,stars-prevSt)*20+okF*2;P.st[i]=Math.max(prevSt,stars);}
    else gain=okF*(rev?4:5);
    const epRw=!rev&&!les&&!boss&&typeof i==='number'&&s.parts[i],rwNew=epRw?rwGive(s,i):false;
    scSave();addGold(gain);const lastEp=!rev&&!les&&!s.parts[i+1];

    const nd=ndOn()&&!rev,got=Q.filter((x,j,a)=>x.res&&a.findIndex(y=>y.f===x.f)===j).length;
    const top=nd?ndResultHTML({s,i,stars,boss,les,lastEp,got,gain,okF,n:firsts.length}):`<div class="sc-q sc-card sc-result" style="text-align:center">
      <div class="sc-meta">${rev?'Повторение':boss?'Финал сцены':les?'Урок фраз из кино':'Проверка эпизода'}</div>
      ${rev?'':`<div class="res-stars">${[1,2,3].map(k=>`<i class="${k<=stars?'on':''}" style="animation-delay:${.15+k*.18}s">★</i>`).join('')}</div>`}
      <div class="sc-big">${okF} / ${firsts.length}</div>${gain?`<div class="sc-gain">+${gain} ${ui('coin')}</div>`:''}<div class="sc-acc">точность ${firsts.length?Math.round(okF/firsts.length*100):0}% · ${firsts.length} ${plural(firsts.length,['фраза','фразы','фраз'])}${wrong?' · ошибки вернутся завтра':''}</div>
      <h2>${passed?'Фразы проверены.':'Нормально — ошибки как раз показывают, что повторить.'}</h2>
      <p class="sc-sub">${wrong?`Ошибок: ${wrong}. Они не удалили прогресс — эти фразы вернутся точечно.`:'Без ошибок. Следующая встреча с фразами будет позже.'}</p>
      <div class="sc-result-rule">Главное: ты не угадывал синоним. Ты несколько раз восстановил конкретную фразу и увидел, где её применять.</div>
      <div class="sc-btns">${rev?scRevMore(id)+scRevNext(id):boss?`<button class="sc-btn" id="scdir">🎬 Режиссёрская версия — сцена целиком</button><button class="sc-btn ghost" id="scsum">📚 Все фразы сцены</button><button class="sc-btn ghost" id="scpath">К пути сцены</button>`:`${!les&&s.parts[i+1]?`<button class="sc-btn" id="scnext">Следующий эпизод →</button>`:''}${lastEp?`<button class="sc-btn" id="scbossgo">👑 Финал сцены →</button><button class="sc-btn ghost" id="scsum">📚 Все фразы сцены</button>`:''}<button class="sc-btn ghost" id="scrp">Вернуться к эпизоду</button>`}<button class="sc-btn ghost" id="scshare">📤 Позвать друга учиться</button></div>
    </div>`;
    scMount(s,`${top}
    ${epRw?rwEndHTML(s,i,rwNew):boss?(segGive(s)?segHTML(s,'new'):'')+(z=>z?seasonHTML(s,z):'')(seasonGive(s))+(showGive(s)?showHTML(s):''):''}
    <div class="sc-sec"><h2>Что закрепили</h2><span>${Q.filter(x=>x.res).length}</span></div>
    ${Q.filter((x,j,a)=>a.findIndex(y=>y.f===x.f)===j).map(x=>`<div class="sc-use sc-card${x.res?'':' miss'}" data-fid="${x.f.id}"><div class="en">${kwWrap(x.f,target(x.f))}</div><div class="ru">${esc(x.f.ru)}</div>${phInfoHTML(x.f,{noEx:true})}</div>`).join('')}`,'scend');
    kwBind(document.querySelector('.scn'),el=>{const c=el.closest('[data-fid]');return c?all.find(y=>y.id===c.dataset.fid):null;});
    if(epRw)rwEndBind(document.querySelector('.scn'),s,i);else if(boss){segBind(document.querySelector('.scn'),s);bgBind(document.querySelector('.scn'));}
    sfx(passed?'win':'learn');remindSync();ev(rev?'review':'ep_quiz',id);if(!nd)setTimeout(dictFly,700);   // 11.0: новые карты летят в словарь (13.9.40: в «Новом» вместо пака — «фраз в словарь» набегает в итоге)
    if(ndOn()&&!rev)ndResultFX(stars);   // 13.9.27: звёзды вспыхивают искрами, 3★ — конфетти, счёт набегает
    if($('#scrp'))$('#scrp').onclick=()=>renderScEp(id,i);
    if($('#scsum'))$('#scsum').onclick=()=>{sfx('tap');renderSceneSum(id);};if($('#scdir'))$('#scdir').onclick=()=>{sfx('reel');renderDirCut(id);};if($('#scpath'))$('#scpath').onclick=()=>{sfx('tap');renderScene(id);};
    if($('#scbossgo'))$('#scbossgo').onclick=()=>{sfx('tap');if(scBossOpen(s))scBossStart(id);else renderScene(id);};
    if($('#scnext'))$('#scnext').onclick=()=>{sfx('tap');renderScEp(id,i+1);};
    if($('#scshare'))$('#scshare').onclick=()=>{sfx('tap');shareLink(APP_LINK+'?startapp=src_share',`Учу ${scL()==='de'?'немецкий':'английский'} по сценам из фильмов — сейчас «${s.title}». Сегодня закрепил ${okF} из ${firsts.length} фраз. Попробуй, тут бесплатно:`);};
    if($('#scnrev'))$('#scnrev').onclick=()=>{const L=scDueAll().filter(x=>x.s.id!==id);if(L.length)renderScQuiz(L[0].s.id,'rev');};
    if($('#scmore'))$('#scmore').onclick=()=>{sfx('tap');REVC.go=id;renderScQuiz(id,'rev');};
  }
  show();
}
/* =====================================================================================
   12.0 — НАГРАДА ЗА ФИНАЛ ЭПИЗОДА: кадр (вертится пальцем, переворачивается), интересный факт в конверте,
   значок в коллекцию профиля. Факты больше не показываются по ходу эпизода — только здесь (и в словаре после эпизода).
   Данные: parts[i].fact (факт про момент/фильм; нет — берётся факт фразы), parts[i].prize=[эмодзи, название], файл NN-k.jpg.
   Хранится в store.rw[sid|i]={t}. В будущем значок можно будет поставить в профиль.
   ===================================================================================== */
const rwKey=(s,i)=>s.id+'|'+i;
const rwHas=(s,i)=>!!(store.rw&&store.rw[rwKey(s,i)]);
const epFact=(s,i)=>{const p=s.parts[i];if(!p)return '';if(p.fact)return p.fact;const f=p.ph.find(x=>x.fact);return f?f.fact:'';};
const rwKadr=(s,i)=>{const p=typeof i==='object'?i:s.parts[i];const fi=p&&p.vf!=null?p.vf:(typeof i==='object'?s.parts.indexOf(i):i);return assetUrl(scKey(s,String(fi+1).padStart(2,'0')+'-k.jpg'));};
const rwPrize=(s,i)=>(s.parts[i]&&s.parts[i].prize)||['🎬',s.parts[i]?s.parts[i].t:s.title];
const rwPh=(s,i)=>{const L=scAct(s.parts[i].ph);return L.find(x=>x.fact)||L[Math.floor(L.length/2)]||null;};
function rwGive(s,i){store.rw=store.rw||{};const k=rwKey(s,i);if(store.rw[k])return false;store.rw[k]={t:Date.now()};save();return true;}
function rwCardHTML(s,i){const p=s.parts[i],pr=rwPrize(s,i),f=rwPh(s,i),n=SCENES.flatMap(x=>x.parts.map((q,j)=>x.id+'|'+j)).indexOf(rwKey(s,i))+1,r=store.rw&&store.rw[rwKey(s,i)];
  return `<div class="rw-card" style="--c:${DX_TH[s.theme]||'#E9C46A'}"><div class="rw-in">
    <div class="rw-f"><span class="rw-img" style="background-image:url('${rwKadr(s,i)}'),url('${assetUrl(scEpKey(s,i,'jpg'))}')"></span><span class="rw-sh"></span>
      <span class="rw-no">№ ${n}</span><span class="rw-cap"><em>${esc(dictFilm(s))} · эпизод ${i+1}</em><b>${esc(p.t)}</b></span></div>
    <div class="rw-b"><span class="rw-pr">${pr[0]}</span><em>Кадр № ${n}</em><b>${esc(p.t)}</b><small>${esc(s.sub||s.title)}</small>
      ${f?`<p class="rw-q">«${esc(s.lang==='de'?(f.de||f.en):f.en)}»<span>${esc(f.ru)}</span></p>`:''}${r?`<small class="rw-dt">получен ${new Date(r.t).toLocaleDateString('ru-RU')}</small>`:''}</div></div></div>`;}
// кадр: мышью — наклон за курсором, пальцем — тянешь и он вертится, тап — переворот на обратную сторону
function rwTilt(card){if(!card||card._tilt)return;card._tilt=1;const inn=card.querySelector('.rw-in');let ry=0,rx=0,flip=0,drag=null,moved=false;
  const set=t=>{inn.style.transition=t||'none';inn.style.transform=`rotateX(${rx}deg) rotateY(${ry+flip}deg)`;card.style.setProperty('--gx',(50+ry*1.4)+'%');card.style.setProperty('--gy',(50-rx*2)+'%');};
  card.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,ry,rx};moved=false;try{card.setPointerCapture(e.pointerId);}catch(x){}});
  card.addEventListener('pointermove',e=>{if(!drag){if(e.pointerType==='mouse'){const r=card.getBoundingClientRect();ry=((e.clientX-r.left)/r.width-.5)*26;rx=-((e.clientY-r.top)/r.height-.5)*20;set('transform .12s');}return;}
    const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>6)moved=true;ry=drag.ry+dx*.7;rx=Math.max(-30,Math.min(30,drag.rx-dy*.35));set();});
  const up=()=>{if(!drag)return;drag=null;if(!moved){flip+=180;sfx('tap');}else{flip=Math.round((ry+flip)/180)*180;}ry=0;rx=0;set('transform .75s cubic-bezier(.2,1.25,.3,1)');haptic('sel');};
  card.addEventListener('pointerup',up);card.addEventListener('pointercancel',up);
  card.addEventListener('pointerleave',e=>{if(!drag&&e.pointerType==='mouse'){ry=0;rx=0;set('transform .5s ease');}});}
// 12.4: награда за эпизод — кадр-карточка (3D), факты к фразам эпизода (конверты) и фон эпизода.
// За сцену — карточка сегмента; за весь фильм/сериал — главный живой фон (видео по кругу).
const epFacts=(s,i)=>{const L=[];const pf=s.parts[i]&&s.parts[i].fact;scAct(s.parts[i].ph).filter(f=>f.fact&&!f.passive).forEach(f=>L.push({f,t:f.fact}));if(pf&&!L.some(x=>x.t===pf))L.unshift({f:null,t:pf});return L;};
function rwHTML(s,i,fresh){const p=s.parts[i],F=epFacts(s,i),left=s.parts.filter((_,j)=>!scP(s.id).done.includes(j)).length;
  return `<section class="rw${fresh?' fresh':''}"><div class="rw-h"><b>🎁 Награда за эпизод</b><i>${fresh?'новое':'в коллекции'}</i></div>
    ${rwCardHTML(s,i)}<small class="rw-hint">Потяни кадр — вертится. Нажми — перевернётся.</small>
    ${F.length?`<div class="rwf"><em class="rwf-h">✦ ${F.length>1?'Интересные факты':'Интересный факт'} — открой</em>${F.map((x,k)=>`<button class="rw-fact" data-fk="${k}"><span class="rw-env">✉️</span><span><em>${x.f?'Факт к фразе':'Факт о сцене'}</em><b>${x.f?'«'+esc(scT(x.f))+'»':'Нажми, чтобы открыть'}</b></span></button>`).join('')}</div>`:''}
    <p class="seg-n">${left?`Ещё ${left} ${plural(left,['эпизод','эпизода','эпизодов'])} — и <b>карточка + фон сцены</b>. Весь фильм — <b>главный живой фон</b>.`:''}</p></section>`;}
function rwBind(box,s,i){const c=box.querySelector('.rw:not(.sgw) .rw-card');if(c){rwTilt(c);if(box.querySelector('.rw.fresh:not(.sgw)')){sfx('reward');}if(box.querySelector('.rw.fresh:not(.sgw)'))fxCardIn(c.querySelector('.rw-in'),350);}
  const F=epFacts(s,i);
  box.querySelectorAll('.rwf .rw-fact').forEach(fb=>fb.onclick=()=>{if(fb.classList.contains('open'))return;const x=F[+fb.dataset.fk];if(!x)return;sfx('unlock');haptic('ok');fb.classList.add('open');
    fb.innerHTML=`<span class="rw-env">✦</span><span><em>${x.f?'«'+esc(scT(x.f))+'»':'Факт о сцене'}</em><p>${esc(x.t)}</p></span>`;fb.animate([{transform:'rotateX(80deg)',opacity:.2},{transform:'none',opacity:1}],{duration:420,easing:'cubic-bezier(.2,1,.3,1)'});});
  bgBind(box);}
/* ===== фоны-награды: e:sid|i — фон эпизода (NN-bg.jpg, иначе кадр NN-k.jpg); h:фильм — главный живой фон (bg.mp4 по кругу) ===== */
const showOf=s=>s.show||s.title;
const showScenes=h=>SCENES.filter(x=>x.kind!=='clip'&&showOf(x)===h&&flagOf('scene-'+x.id)!=='hide');
const showDone=h=>{const L=showScenes(h);return L.length>0&&L.every(x=>segDone(x));};
const showHas=h=>!!(store.showRw&&store.showRw[h]);
/* ===== 13.9.74 (П18): фоны по сезонам — решение Андрея: «фильмам — 1 фон, сериалам — на каждый сезон».
   Ключ сезона — h:<сериал>|S04 (сезон — из начала поля ep: «S04E09 · …»), награда — за все сцены этого сезона в этой группе (у немецкой — свои).
   Уже выданный фон «весь сериал» (h:<сериал>) остаётся у тех, у кого он есть; новым у сериала он больше не выдаётся.
   Новые ролики (фильм, сезон, интервью) — scenes/_bg/<ключ>.mp4, ключ — из tools/bg-prompts.json, «:» → «-» (season-sopranos-S04.mp4), превью — <…>p.jpg.
   В приложении ролик появляется, когда в tools/bg-status.json у ключа стоит "ok":1 (ставит Claude, посмотрев ролик); до этого — обложка / постер, у фильма — прежний film-bg.mp4. ===== */
const BG_SHOW={'Волк с Уолл-стрит':'film:wolf','The Wolf of Wall Street':'film:wolf','Американский психопат':'film:psycho','Таксист':'film:taxi','Титаник':'film:titanic','Titanic':'film:titanic','Бункер':'film:bunker','Павел Дуров':'person:durov','Clavicular':'person:clavicular','Клан Сопрано':'season:sopranos','Die Sopranos':'season:sopranos','Во все тяжкие':'season:bb','Breaking Bad':'season:bb'};
let BGST={},BGST_P=null;
function bgStLoad(){if(BGST_P)return BGST_P;BGST_P=(location.protocol==='file:'?Promise.resolve({}):fetch('tools/bg-status.json?h='+Math.floor(Date.now()/36e5),{cache:'no-store'}).then(r=>r.ok?r.json():{}).catch(()=>({})))
  .then(j=>{BGST=j&&typeof j==='object'&&!Array.isArray(j)?j:{};return BGST;});return BGST_P;}
const bgNewF=key=>{const x=key&&BGST[key];if(!x||!x.ok)return null;const f=/^scenes\/_bg\/[\w.-]+\.mp4$/.test(String(x.file||''))?x.file:'scenes/_bg/'+key.replace(/:/g,'-')+'.mp4';
  return {vid:assetUrl(f),img:assetUrl(f.replace(/\.mp4$/,'p.jpg')),ev:x.ev!=null&&isFinite(+x.ev)?+x.ev:null};};
const seasonOf=s=>{if(!s||s.kind!=='series')return '';const m=/^S(\d{2})/i.exec(String(s.ep||''));return m?'S'+m[1]:'';};
const showSeasons=h=>[...new Set(showScenes(h).map(seasonOf).filter(Boolean))].sort();
const seasonScenes=(h,sx)=>showScenes(h).filter(x=>seasonOf(x)===sx);
const seasonK=(h,sx)=>'h:'+h+'|'+sx,seasonN=sx=>+String(sx||'').slice(1)||0;
const seasonHas=k=>!!(store.seasonRw&&store.seasonRw[k]);
function seasonGive(s){const sx=seasonOf(s);if(!sx)return false;const h=showOf(s),k=seasonK(h,sx),L=seasonScenes(h,sx);if(!L.length||!L.every(x=>segDone(x))||seasonHas(k))return false;
  store.seasonRw=Object.assign({},store.seasonRw,{[k]:{t:Date.now()}});save();return k;}
function showGive(s){const h=showOf(s);if(showSeasons(h).length||!showDone(h)||showHas(h))return false;store.showRw=store.showRw||{};store.showRw[h]={t:Date.now()};save();return true;}   // 13.9.74: у сериала — фоны сезонов, «весь сериал» больше не выдаём
function bgInfo(k){if(!k)return null;const adm=ADM_OPEN();   // 13.0: админ видит все фоны
  if(k.startsWith('h:')&&/\|S\d{2}$/.test(k)){const i=k.lastIndexOf('|'),h=k.slice(2,i),sx=k.slice(i+1),L=seasonScenes(h,sx);if(!L.length)return null;   // 13.9.74: фон сезона
    const nf=BG_SHOW[h]?bgNewF(BG_SHOW[h]+':'+sx):null,d=L.filter(x=>segDone(x)).length,n=seasonN(sx);
    return {k,film:true,season:sx,got:seasonHas(k)||adm,img:[...(nf?[nf.img]:[]),assetUrl(scKey(L[0],'poster.jpg')),scCover(L[0],'cover.jpg')],vid:nf?[nf.vid]:[],
      name:`${h} · сезон ${n}`,sub:'Главный фон · сезон '+n,live:!!nf,ev:nf?nf.ev:null,
      how:L.length>1?`Пройди все сцены ${n}-го сезона «${h}» — пройдено ${d} из ${L.length}`:`Пройди сцену «${L[0].sub||L[0].title}» целиком`};}
  if(k.startsWith('h:')){const h=k.slice(2),L=showScenes(h);if(!L.length)return null;const F=L.filter(x=>x.filmbg),d=L.filter(segDone).length,nf=BG_SHOW[h]&&!/^season:/.test(BG_SHOW[h])?bgNewF(BG_SHOW[h]):null;   // 13.9.74: новый ролик фильма / интервью — первым
    return {k,film:true,got:showHas(h)||adm,img:[...(nf?[nf.img]:[]),...F.map(x=>assetUrl(scKey(x,'film-bgp.jpg'))),assetUrl(scKey(L[0],'poster.jpg')),scCover(L[0],'cover.jpg')],vid:[...(nf?[nf.vid]:[]),...F.map(x=>assetUrl(scKey(x,'film-bg.mp4')))],
      name:h,sub:'Главный фон · '+(L[0].kind==='interview'?'всё интервью':L[0].kind==='series'?'весь сериал':'весь фильм'),live:F.length>0||!!nf,ev:nf?nf.ev:F.length&&F[0].filmbgev!=null?+F[0].filmbgev:null,
      how:L.length>1?`Пройди все сцены «${h}» — пройдено ${d} из ${L.length}`:`Пройди сцену «${L[0].sub||L[0].title}» целиком`};}
  const s=scOf(k);if(!s||!s.parts||s.kind==='clip')return null;
  return {k,got:segHas(s)||adm,img:[...(s.bgv?[assetUrl(scKey(s,'bgp.jpg'))]:[]),assetUrl(scKey(s,'bg.jpg')),scCover(s,'cover.jpg')],vid:s.bgv?[assetUrl(scKey(s,'bg.mp4'))]:[],
    name:s.sub||s.title,sub:'Фон сцены · '+dictFilm(s),live:!!s.bgv,ev:s.bgv&&s.bgev!=null?+s.bgev:null,how:`Пройди все эпизоды сцены «${s.sub||s.title}»`};}
// 13.0: в награде фон только анонсируется — смотреть его в «Коллекции»
function bgNewHTML(k,label){const b=bgInfo(k);if(!b)return '';
  return `<div class="seg-bg bg-new"><span class="seg-bgi${b.live?' live':''}" style="background-image:${b.img.map(u=>`url('${u}')`).join(',')}">${b.live?'<i>▶</i>':''}</span><span class="seg-bgt"><em>${label}</em><b>${esc(b.name)}</b><small>Лежит в «Коллекции» на Главной</small></span>
    <button class="seg-set" data-bgc="${esc(k)}">Смотреть</button></div>`;}
function bgBind(box){box.querySelectorAll('[data-bgc]').forEach(b=>b.onclick=()=>{sfx('tap');haptic('sel');renderCollection('bg',b.dataset.bgc);});}
/* ===== 13.9.6: фон в профиле (идея друга Андрея). Фон из «Коллекции» ставится в профиль (store.profBg, синхронизируется):
   профиль — карточка игрока на этом фоне; в дуэли друг видит тебя на нём (приглашение, экран «ты против друга», победа).
   Главный фон (весь фильм / сериал / интервью) — с золотой рамкой и меткой «Весь фильм»: он реже и ценнее фона сцены. ===== */
const profBg=()=>{const b=bgInfo(store.profBg);return b&&b.got?b:null;};
const profBgKey=()=>{const b=profBg();return b?b.k:'';};
const bgAnyGot=()=>bgKeys().some(k=>{const b=bgInfo(k);return !!(b&&b.got);});
// подпись фона: главный — «🏆 Весь фильм» + фильм, фон сцены — «🎞 Сцена · фильм» + сцена
function bgTagHTML(b){const s=b.film?null:scOf(b.k);
  return `<span class="pbg-tag${b.film?' film':''}"><em>${b.film?'🏆 '+esc(cap(b.sub.replace('Главный фон · ',''))):'🎞 Сцена'+(s?' · '+esc(dictFilm(s)):'')}</em><b>${esc(b.name)}</b></span>`;}
// фон с событием («4 с спокойно → событие → после»): ролик стартует так, чтобы событие случилось через lead секунд после
// появления — в профиле, приглашении и дуэли его видно сразу (отсчёт в дуэли короче 3 с, а событие в файле на 6–8-й секунде).
// Время события в файле — b.ev (scenes.json: bgev / filmbgev, считает tools/loop_bg.py); нет — с начала, как на Главной.
function bgSeek(v,b,lead){if(!v||!b||b.ev==null||lead==null)return;const t0=performance.now();
  const go=()=>{const d=v.duration||0,left=Math.max(.25,lead-(performance.now()-t0)/1000);let t=b.ev-left;if(d&&t>d-.5)t=d-.5;try{v.currentTime=Math.max(0,t);}catch(e){}};
  if(v.readyState>=1)go();else v.addEventListener('loadedmetadata',go,{once:true});}
// слой фона: картинка сразу, видео поверх, когда пойдёт (экономия трафика / «меньше движения» — без видео); data-lead — см. bgSeek
function bgLayer(el,b){if(!el||!b||el._bg===b.k)return;el._bg=b.k;el.style.backgroundImage=b.img.map(u=>`url('${u}')`).join(',');
  el.querySelectorAll('video').forEach(v=>{try{v.pause();v.removeAttribute('src');v.load();}catch(e){}v.remove();});
  const lite=(navigator.connection&&navigator.connection.saveData)||matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(b.vid.length&&!lite){const v=bgVid(b.vid);if(v){el.appendChild(v);if(el.dataset.lead)bgSeek(v,b,+el.dataset.lead);const p=v.play();if(p&&p.catch)p.catch(()=>{});}}}
const bgFill=root=>{if(root)root.querySelectorAll('[data-bgl]').forEach(el=>bgLayer(el,bgInfo(el.dataset.bgl)));};
// в профиле фона нет: позвать в «Коллекцию» (или сказать, как его получить)
const profBgAskHTML=()=>`<button class="pc-set" id="pcSet"><i>🖼</i><span>${bgAnyGot()?'Поставь фон из «Коллекции» — друзья увидят тебя на нём в дуэли':'Пройди сцену целиком — получишь фон для профиля. Его увидят друзья в дуэли'}</span><b>›</b></button>`;
// публичный профиль — что видит друг, нажав на тебя (уходит в комнату дуэли вместе с фоном): сцены, фразы, фоны, серия, аватарка Telegram
const avaOk=u=>typeof u==='string'&&u.length<300&&/^https:\/\/t\.me\/i\/userpic\/\d+\/[A-Za-z0-9_.=%-]+$/.test(u);
function myPub(){const sg=Object.keys(store.seg||{}).filter(id=>scOf(id)).length,sh=Object.keys(store.showRw||{}).length,a=tgPhoto();
  return {sc:sg,ph:dictCount()[0],bg:sg+sh,st:streakNow(),ava:avaOk(a)?a:''};}
const meCard=()=>({n:userName()||kvName()||'Игрок',bg:profBgKey(),pf:myPub()});
// окно «профиль игрока»: карточка на его фоне (событие — через 1.5 с), аватарка, имя, цифры. me — свой (как тебя видят друзья)
function pfView(p,me){if(!p)return;document.querySelectorAll('.pfv').forEach(o=>o.remove());const b=bgInfo(p.bg),P=p.pf,ava=me?tgPhoto():(P&&avaOk(P.ava)?P.ava:''),nm=String(p.n||'Игрок');
  const cell=(i,v,l)=>`<div><i>${i}</i><b>${fmt(v||0)}</b><span>${l}</span></div>`;
  const o=document.createElement('div');o.className='pfv';
  o.innerHTML=`<div class="pfv-dim"></div><div class="pfv-box" role="dialog" aria-label="Профиль игрока">
    <div class="pfv-card${b?' has'+(b.film?' film':''):''}">${b?`<div class="pc-bg" data-bgl="${esc(b.k)}" data-lead="1.5" aria-hidden="true"></div>`:''}<i class="pc-sh" aria-hidden="true"></i>
      <div class="pfv-top">${b?bgTagHTML(b):'<span></span>'}<button class="pfv-x" aria-label="Закрыть">${ui('close')}</button></div>
      <div class="pfv-who"><div class="pava${ava?'':' mono'}"${ava?` style="background-image:url('${esc(ava)}')"`:''}>${ava?'':esc(nm.trim().charAt(0).toUpperCase()||'И')}</div><b>${esc(nm)}</b>${me?'<small>Так тебя видят друзья в дуэли</small>':''}</div></div>
    ${P?`<div class="pfv-st">${cell('🎬',P.sc,plural(P.sc||0,['сцена пройдена','сцены пройдены','сцен пройдено']))}${cell('💬',P.ph,plural(P.ph||0,['фраза собрана','фразы собраны','фраз собрано']))}${cell('🖼',P.bg,plural(P.bg||0,['фон получен','фона получено','фонов получено']))}${cell('🔥',P.st,plural(P.st||0,['день подряд','дня подряд','дней подряд']))}</div>`:'<p class="pfv-old">Цифры появятся, когда у друга обновится приложение</p>'}
    ${me&&!b?`<button class="pc-set pfv-set">${bgAnyGot()?'🖼 Поставь фон из «Коллекции» — карточка станет живой':'🖼 Пройди сцену целиком — получишь фон для карточки'}</button>`:''}</div>`;
  document.body.appendChild(o);bgFill(o);
  const kd=e=>{if(e.key==='Escape')close();};document.addEventListener('keydown',kd);
  const close=()=>{if(o._c)return;o._c=true;document.removeEventListener('keydown',kd);o.querySelectorAll('video').forEach(v=>{try{v.pause();v.removeAttribute('src');v.load();}catch(e){}});
    o.animate([{opacity:1},{opacity:0}],{duration:180}).onfinish=()=>o.remove();};
  o._close=close;o.querySelector('.pfv-dim').onclick=close;o.querySelector('.pfv-x').onclick=()=>{sfx('tap');close();};
  const st=o.querySelector('.pfv-set');if(st)st.onclick=()=>{sfx('tap');close();renderCollection('bg');};
  sfx('tap');haptic('sel');if(fxOK())o.querySelector('.pfv-box').animate([{transform:'translateY(48px) scale(.97)',opacity:0},{transform:'none',opacity:1}],{duration:440,easing:SPRING});}
// нажал на игрока в дуэли — его профиль (pv: 'A' / 'B' — из комнаты, 'me' — свой)
function kvPvBind(root){if(root)root.querySelectorAll('[data-pv]').forEach(el=>el.onclick=e=>{e.stopPropagation();const r=el.dataset.pv;pfView(r==='me'?meCard():KV&&KV.room&&KV.room[r],r==='me');});}
// игрок дуэли на своём фоне (фон приходит из комнаты: R.A.bg / R.B.bg); нет фона — притемнённый кадр сцены (fb) или обложка, без подписи; pv — нажал → профиль
function kvPlHTML(p,cls,me,s,fb,lead,pv){const b=bgInfo(p&&p.bg);
  return `<div class="kvp ${cls||''}${b?' has'+(b.film?' film':''):''}"${pv?` data-pv="${pv}" role="button" aria-label="Профиль игрока"`:''}>${pv?'<span class="kvp-pv">Профиль ›</span>':''}<div class="kvp-bg"${b?` data-bgl="${esc(b.k)}"${lead!=null?` data-lead="${lead}"`:''}`:` style="background-image:url('${fb||scCover(s,'cover.jpg')}'),url('${scCover(s,'cover.jpg')}')"`} aria-hidden="true"></div><i class="kvp-sh" aria-hidden="true"></i>
    <div class="kvp-who"><b>${me?'Ты':esc((p&&p.n)||'…')}</b>${b?bgTagHTML(b):''}</div></div>`;}
/* ===== 12.3: награда за весь сегмент (сцену): карточка сегмента (золотая — если во всех эпизодах 3★) + фон сцены ===== */
const segDone=s=>!!s&&s.parts.every((_,j)=>scP(s.id).done.includes(j));
const segGold=s=>!!s&&s.parts.every((_,j)=>((scP(s.id).st||{})[j]||0)>=3);
const segHas=s=>!!(store.seg&&store.seg[s.id]);
// выдать: 'new' — впервые, 'gold' — карточка стала золотой, false — ничего нового
function segGive(s){if(!s||s.kind==='clip'||!segDone(s))return false;store.seg=store.seg||{};const g=segGold(s),o=store.seg[s.id];
  if(!o){store.seg[s.id]={t:Date.now(),gold:g?Date.now():0};save();return 'new';}if(g&&!o.gold){o.gold=Date.now();save();return 'gold';}return false;}
function segStats(s){const P=scP(s.id),L=s.parts.flatMap(p=>scAct(p.ph).filter(f=>!f.passive));
  const ph=L.filter(f=>(P.got&&P.got[f.id])||(P.m[f.id]||0)>=1).length,w=s.parts.reduce((a,_,j)=>{const d=swData(s.id,j);return a+(d?d.key.length:0);},0),st=s.parts.reduce((a,_,j)=>a+((P.st||{})[j]||0),0);
  return {ph,all:L.length,w,st,stMax:s.parts.length*3,ep:s.parts.length};}
function segCardHTML(s){const o=(store.seg||{})[s.id],g=!!(o&&o.gold),S=segStats(s),n=SCENES.filter(x=>x.kind!=='clip').indexOf(s)+1;
  return `<div class="rw-card seg-card${g?' gold':''}" style="--c:${g?'#F5C451':DX_TH[s.theme]||'#E9C46A'}"><div class="rw-in">
    <div class="rw-f"><span class="rw-img" style="background-image:url('${assetUrl(scKey(s,'poster.jpg'))}'),url('${scCover(s,'cover.jpg')}')"></span><span class="rw-sh"></span>${g?'<span class="seg-glint"></span>':''}
      <span class="rw-no">${g?'★ Золотая':'Сегмент № '+n}</span>${store.dirCut&&store.dirCut[s.id]?'<span class="rw-dc">🎬 Режиссёрская версия</span>':''}<span class="rw-cap"><em>${esc(dictFilm(s))}</em><b>${esc(s.sub||s.title)}</b></span></div>
    <div class="rw-b"><span class="rw-pr">${g?'🏆':'🎬'}</span><em>Карточка сегмента</em><b>${esc(s.sub||s.title)}</b><small>${esc(dictFilm(s))}</small>
      <div class="seg-st"><span><b>${S.ph}</b>фраз</span><span><b>${S.w}</b>слов</span><span><b>${S.ep}</b>${plural(S.ep,['эпизод','эпизода','эпизодов'])}</span><span><b>${S.st}/${S.stMax}</b>★</span></div>
      ${o?`<small class="rw-dt">получена ${new Date(o.t).toLocaleDateString('ru-RU')}</small>`:''}</div></div></div>`;}
function segHTML(s,kind){const g=segGold(s),S=segStats(s);
  return `<section class="rw sgw${kind?' fresh':''}"><div class="rw-h"><b>${kind==='gold'?'★ Золотая карточка':'🏆 Сегмент завершён'}</b><i>${kind?'новое':'в коллекции'}</i></div>
    <p class="seg-t">🎬 ${esc(dictFilm(s))} — ${esc(s.sub||s.title)}</p><p class="seg-y">Ты получил:</p>
    ${segCardHTML(s)}<small class="rw-hint">Потяни карточку — вертится. Нажми — перевернётся.</small>
    ${bgNewHTML(s.id,'🎞 Фон сцены')}
    <p class="seg-n"><b>${S.ph}</b> ${plural(S.ph,['фраза изучена','фразы изучены','фраз изучено'])}${g?'':' · пройди все эпизоды на 3★ — карточка станет золотой'}</p></section>`;}
function segBind(box,s){const c=box.querySelector('.seg-card');if(c){rwTilt(c);if(box.querySelector('.sgw.fresh')){sfx('reward');haptic('ok');c.querySelector('.rw-in').animate([{transform:'rotateY(-200deg) scale(.5)',opacity:0},{transform:'rotateY(12deg) scale(1.04)',opacity:1,offset:.7},{transform:'none',opacity:1}],{duration:1200,delay:300,easing:'cubic-bezier(.2,.9,.3,1)',fill:'backwards'});
    const b=box.querySelector('.seg-bg');if(b)b.animate([{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'none'}],{duration:500,delay:1300,easing:'ease-out',fill:'backwards'});}}
  bgBind(box);}
// 13.0: фон-награда, поставленный «на главную», виден только на Главной (вкладка learn); в сценах и на других вкладках его нет
function appBgApply(){const b=bgInfo(store.appBg),home=screen==='home'&&store.tab==='learn'&&!document.body.dataset.scn;let a=document.getElementById('appbg');
  if(!b||!b.got||!home){document.body.classList.remove('appbg');if(a){const v=a.querySelector('video');if(v)v.pause();}return;}
  if(!a){a=document.createElement('div');a.id='appbg';a.setAttribute('aria-hidden','true');document.body.prepend(a);}
  if(a.dataset.k!==b.k){a.dataset.k=b.k;a.style.backgroundImage=b.img.map(u=>`url('${u}')`).join(',');const o=a.querySelector('video');if(o){o.pause();o.remove();}
    const lite=(navigator.connection&&navigator.connection.saveData)||matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(b.vid.length&&!lite){const v=bgVid(b.vid);if(v)a.prepend(v);}}
  document.body.classList.add('appbg');const v=a.querySelector('video');if(v&&v.paused){const p=v.play();if(p&&p.catch)p.catch(()=>{});}}
// видео фона: без звука, по кругу (файлы — бесшовные петли из tools/loop_bg.py); нет файла — следующий источник, иначе остаётся картинка
function bgVid(L){L=L.filter(u=>!AMB_BAD[u]);if(!L.length)return null;const v=document.createElement('video');
  ['muted','playsinline','webkit-playsinline','autoplay','loop','disablepictureinpicture','disableremoteplayback'].forEach(x=>v.setAttribute(x,''));
  v.muted=true;v.defaultMuted=true;v.loop=true;v.playsInline=true;v.autoplay=true;v.preload='auto';v.tabIndex=-1;v.addEventListener('playing',()=>v.classList.add('on'));
  let n=0;v.addEventListener('error',()=>{AMB_BAD[L[n]]=1;n++;if(L[n])v.src=L[n];else v.remove();});v.src=L[0];return v;}
// итог эпизода: если этим эпизодом закончен сегмент — большая награда, иначе — кадр и факт
function rwEndHTML(s,i,rwNew){const g=segGive(s),z=seasonGive(s),h=showGive(s);return rwHTML(s,i,rwNew)+(g?segHTML(s,g):'')+(z?seasonHTML(s,z):'')+(h?showHTML(s):'');}
function showHTML(s){const h=showOf(s);return `<section class="rw sgw shw fresh"><div class="rw-h"><b>🏆 ${esc(h)} — пройден целиком</b><i>главная награда</i></div>
  <p class="seg-y">Все сцены пройдены. Тебе — главный фон «${esc(h)}»: смотри его в «Коллекции» на Главной.</p>${bgNewHTML('h:'+h,'🏆 Главный фон')}</section>`;}
function seasonHTML(s,k){const h=showOf(s),n=seasonN(seasonOf(s));return `<section class="rw sgw shw fresh"><div class="rw-h"><b>🏆 ${esc(h)} · сезон ${n} — пройден</b><i>главная награда</i></div>
  <p class="seg-y">Все сцены ${n}-го сезона пройдены. Тебе — фон сезона: смотри его в «Коллекции» на Главной.</p>${bgNewHTML(k,'🏆 Фон сезона')}</section>`;}
function rwEndBind(box,s,i){rwBind(box,s,i);segBind(box,s);bgBind(box);}
// кадры эпизодов (смотрят в «Коллекции» на Главной): кадр открывается и вертится
function rwAll(){const L=[];SCENES.filter(s=>s.kind!=='clip'&&flagOf('scene-'+s.id)!=='hide').forEach(s=>s.parts.forEach((p,i)=>L.push({s,i,got:rwHas(s,i)})));return L;}
function rwOpen(k){const [sid,ii]=k.split('|'),s=scOf(sid),i=+ii;if(!s)return;const o=document.createElement('div');o.className='rwo';
  o.innerHTML=`<div class="rwo-dim"></div><div class="rwo-box">${rwCardHTML(s,i)}<small class="rw-hint">Потяни — вертится, нажми — перевернётся</small>${epFact(s,i)?`<div class="rwo-fact"><em>✦ Интересный факт</em><p>${esc(epFact(s,i))}</p></div>`:''}<button class="sc-btn ghost" id="rwoX">Закрыть</button></div>`;
  document.body.appendChild(o);rwTilt(o.querySelector('.rw-card'));fxCardIn(o.querySelector('.rw-in'),0);
  const close=()=>{o.animate([{opacity:1},{opacity:0}],{duration:200}).onfinish=()=>o.remove();};o.querySelector('.rwo-dim').onclick=close;o.querySelector('#rwoX').onclick=()=>{sfx('tap');close();};}
function segOpen(sid){const s=scOf(sid);if(!s||!segHas(s))return;const o=document.createElement('div');o.className='rwo';
  o.innerHTML=`<div class="rwo-dim"></div><div class="rwo-box">${segCardHTML(s)}<small class="rw-hint">Потяни — вертится, нажми — перевернётся</small><button class="sc-btn ghost" id="rwoX">Закрыть</button></div>`;
  document.body.appendChild(o);segBind(o,s);fxCardIn(o.querySelector('.rw-in'),0);
  const close=()=>{o.animate([{opacity:1},{opacity:0}],{duration:200}).onfinish=()=>o.remove();};o.querySelector('.rwo-dim').onclick=close;o.querySelector('#rwoX').onclick=()=>{sfx('tap');close();};}
/* ===== 13.0: «Коллекция» — все награды в одном месте, вход с Главной (не путать со словарём): фоны, карточки сцен, кадры эпизодов.
   Будущие награды — новыми вкладками сюда же. Фоны: главный — за весь фильм / сериал / интервью, фон сцены — за всю сцену (на эпизоды фонов нет). ===== */
const showList=()=>[...new Set(SCENES.filter(x=>x.kind!=='clip'&&flagOf('scene-'+x.id)!=='hide').map(showOf))];
const bgKeysOf=h=>{const S=showSeasons(h);return [...(!S.length||showHas(h)?['h:'+h]:[]),...S.map(sx=>seasonK(h,sx)),...showScenes(h).map(x=>x.id)];};   // 13.9.74: у сериала — фоны сезонов
const bgKeys=()=>showList().flatMap(bgKeysOf);
const collScenes=()=>SCENES.filter(s=>s.kind!=='clip'&&flagOf('scene-'+s.id)!=='hide');
function collStat(){const B=bgKeys().map(bgInfo).filter(Boolean),SG=collScenes(),K=rwAll();
  return {bg:B.filter(b=>b.got).length,bgAll:B.length,cards:SG.filter(segHas).length,cardsAll:SG.length,kadr:K.filter(x=>x.got).length,kadrAll:K.length};}
let COLL_BACK='learn';   // 13.9.6: «назад» из Коллекции — на вкладку, откуда пришли (Главная или Профиль)
function renderCollection(tab,open){if(screen!=='coll')COLL_BACK=(screen==='home'||screen==='subtab')?(store.tab||'learn'):'learn';tab=tab||store.collTab||'bg';if(!['bg','cards','kadr'].includes(tab))tab='bg';if(store.collTab!==tab){store.collTab=tab;save();}
  screen='coll';backBtn(true);applyFx();const C=collStat();
  const T=[['bg','🎞','Фоны',C.bg,C.bgAll],['cards','🎬','Карточки',C.cards,C.cardsAll],['kadr','🖼','Кадры',C.kadr,C.kadrAll]];
  mount(`<div class="coll"><div class="page-head"><button class="icon-btn" id="bBtn" aria-label="Назад">${ui('back')}</button><h1 class="title">Коллекция</h1></div>
    <p class="coll-sub">Награды за пройденные сцены. Это не словарь — тут то, что ты заработал.</p>
    <div class="coll-tabs" role="tablist">${T.map(([k,i,n,g,a])=>`<button data-ct="${k}" class="${k===tab?'on':''}" role="tab" aria-selected="${k===tab}"><span>${i}</span><b>${n}</b><small>${g} из ${a}</small></button>`).join('')}</div>
    <div class="coll-pane">${tab==='bg'?collBgHTML():tab==='cards'?collCardsHTML():collKadrHTML()}</div>
    <p class="coll-soon">🎁 Скоро здесь появятся новые награды</p></div>`,'collscr');
  $('#bBtn').onclick=()=>{sfx('tap');renderTab(COLL_BACK||'learn');};
  $$('.coll-tabs [data-ct]').forEach(b=>b.onclick=()=>{if(b.dataset.ct===tab)return;sfx('tap');haptic('sel');renderCollection(b.dataset.ct);});
  $$('.coll [data-bgk]').forEach(b=>b.onclick=()=>{const i=bgInfo(b.dataset.bgk);if(!i)return;if(!i.got){sfx('bad');haptic('err');toast('🔒 '+i.how);return;}sfx('tap');haptic('sel');bgView(i.k);});
  $$('.coll [data-rw]').forEach(b=>b.onclick=()=>{sfx('tap');rwOpen(b.dataset.rw);});
  $$('.coll [data-seg]').forEach(b=>b.onclick=()=>{sfx('tap');segOpen(b.dataset.seg);});
  if(open&&tab==='bg'){const t=document.querySelector(`.coll [data-bgk="${CSS.escape(open)}"]`);if(t)t.scrollIntoView({block:'center',inline:'center'});setTimeout(()=>bgView(open),150);}}
function collBgHTML(){
  const G=showList().map(h=>{const B=bgKeysOf(h).map(bgInfo).filter(Boolean);return {h,B,g:B.filter(b=>b.got).length};});
  return (ADM_OPEN()?'<p class="coll-adm">Ты админ — видишь все фоны, даже не полученные.</p>':'')+[...G.filter(x=>x.g),...G.filter(x=>!x.g)].map(({h,B,g})=>{   // где есть полученные — выше
    return `<h3 class="coll-h">${esc(h)} <span>${g} из ${B.length}</span></h3><div class="bgw">${B.map(b=>`<button class="bgw-i${b.film?' film':''}${b.got?'':' lock'}${b.got&&store.appBg===b.k?' on':''}${b.got&&store.profBg===b.k?' pf':''}" data-bgk="${esc(b.k)}" aria-label="${esc((b.film?'Главный фон ':'Фон сцены ')+b.name)}">
      <span class="bgw-img" style="background-image:${b.img.map(u=>`url('${u}')`).join(',')}"></span>${b.got?(b.live?'<i class="bgw-live">▶ живой</i>':''):'<i class="bgw-lk">🔒</i>'}
      <span class="bgw-t"><em>${b.season?'Фон сезона':b.film?'Главный фон':'Сцена'}</em><b>${esc(b.season?'Сезон '+seasonN(b.season):b.film?b.sub.replace('Главный фон · ',''):b.name)}</b></span></button>`).join('')}</div>`;}).join('')+
    `<small class="rwc-n">Сцена целиком — её фон. Весь фильм или интервью — главный фон, у сериала — фон каждого сезона. Нажми на полученный — смотри на весь экран.</small>`;}
function collCardsHTML(){const SG=collScenes(),sg=SG.filter(segHas);
  return `<div class="rwc"><div class="rwc-k seg-k">${[...sg,...SG.filter(x=>!segHas(x))].map(s=>segHas(s)?`<button class="rwc-kd seg-kd${(store.seg[s.id]||{}).gold?' gold':''}" data-seg="${s.id}" style="background-image:url('${assetUrl(scKey(s,'poster.jpg'))}'),url('${scCover(s,'cover.jpg')}')"><span>${(store.seg[s.id]||{}).gold?'★':'🎬'}</span></button>`:`<span class="rwc-kd seg-lock" title="${esc(dictFilm(s))} — ${esc(s.sub||'')}">🔒</span>`).join('')}</div>
    <small class="rwc-n">${sg.length?'Нажми на карточку — откроется. Все эпизоды сцены на 3★ — карточка станет золотой.':'Пройди все эпизоды одной сцены — получишь карточку сцены и её фон.'}</small></div>`;}
function collKadrHTML(){const L=rwAll(),g=L.filter(x=>x.got);
  return `<div class="rwc">${g.length?`<div class="rwc-k">${g.map(x=>`<button class="rwc-kd" data-rw="${rwKey(x.s,x.i)}" style="background-image:url('${rwKadr(x.s,x.i)}'),url('${assetUrl(scEpKey(x.s,x.i,'jpg'))}')"></button>`).join('')}</div>`:''}
    <small class="rwc-n">${g.length?'Кадр — за каждый пройденный эпизод. Нажми — откроется с интересным фактом.':'Пройди проверку любого эпизода — получишь кадр и интересный факт.'}</small></div>`;}
// смотреть фон на весь экран: по кругу, тап — спрятать кнопки, ‹ › и свайп — соседние полученные, «Поставить на главную»
function bgView(k){const L=bgKeys().map(bgInfo).filter(b=>b&&b.got);let i=L.findIndex(b=>b.k===k);if(i<0)return;
  document.querySelectorAll('.bgvw').forEach(o=>o.remove());
  const o=document.createElement('div');o.className='bgvw';
  o.innerHTML=`<div class="bgvw-m"></div><div class="bgvw-ui"><div class="bgvw-top"><button class="bgvw-x" aria-label="Закрыть">${ui('close')}</button><span class="bgvw-t"><b></b><small></small></span></div>
    ${L.length>1?`<button class="bgvw-nav prev" aria-label="Предыдущий фон">${ui('back')}</button><button class="bgvw-nav next" aria-label="Следующий фон">${ui('fwd')}</button>`:''}
    <div class="bgvw-bot"><div class="bgvw-acts"><button class="sc-btn bgvw-set" data-to="appBg"></button><button class="sc-btn bgvw-set" data-to="profBg"></button></div><small>Нажми на фон — кнопки спрячутся</small></div></div>`;
  document.body.appendChild(o);const m=o.querySelector('.bgvw-m');let swiped=false;
  const kill=()=>o.querySelectorAll('video').forEach(v=>{try{v.pause();v.removeAttribute('src');v.load();}catch(e){}});
  const show=()=>{const b=L[i];kill();m.innerHTML='';m.className='bgvw-m'+(b.vid.length?'':' still');m.style.backgroundImage=b.img.map(u=>`url('${u}')`).join(',');
    const fit=(w,h)=>{const r=(w/h)/(innerWidth/innerHeight);return r>1.5||r<1/1.5;};   // 13.5: по пропорциям, а не «верт./гориз.» — квадратный фон (Таксист) на телефоне целиком, а не центр
    if(!b.vid.length&&b.img[0]){const im=new Image();im.onload=()=>m.classList.toggle('fit',fit(im.naturalWidth,im.naturalHeight));im.src=b.img[0];}   // 13.0.2: вертикальный постер на ПК — целиком на размытой подложке
    if(b.vid.length){const v=bgVid(b.vid);if(v){v.addEventListener('loadedmetadata',()=>{m.classList.toggle('fit',fit(v.videoWidth,v.videoHeight));});bgSeek(v,b,2.5);m.appendChild(v);const p=v.play();if(p&&p.catch)p.catch(()=>{});}}
    o.querySelector('.bgvw-t b').textContent=b.name;o.querySelector('.bgvw-t small').textContent=b.sub;
    o.querySelectorAll('.bgvw-set').forEach(st=>{const on=store[st.dataset.to]===b.k;st.textContent=st.dataset.to==='appBg'?(on?'✓ На Главной':'На Главную'):(on?'✓ В профиле':'В профиль');st.classList.toggle('ghost',on);});};
  const mark=()=>document.querySelectorAll('.coll [data-bgk]').forEach(x=>{const g=!x.classList.contains('lock');x.classList.toggle('on',g&&x.dataset.bgk===store.appBg);x.classList.toggle('pf',g&&x.dataset.bgk===store.profBg);});
  const close=()=>{if(o._c)return;o._c=true;kill();o.animate([{opacity:1},{opacity:0}],{duration:200}).onfinish=()=>o.remove();mark();};
  o._close=close;o.querySelector('.bgvw-x').onclick=()=>{sfx('tap');close();};
  m.onclick=()=>{if(swiped){swiped=false;return;}o.classList.toggle('bare');};
  o.querySelectorAll('.bgvw-set').forEach(st=>st.onclick=()=>{const b=L[i],k=st.dataset.to,off=store[k]===b.k;store[k]=off?'':b.k;save();sfx(off?'tap':'good');haptic('sel');
    toast(k==='appBg'?(off?'Фон убран с Главной':'🖼 Фон стоит на Главной'):(off?'Фон убран из профиля':'👤 Фон в профиле — друзья увидят тебя на нём в дуэли'));show();mark();});
  const go=d=>{i=(i+d+L.length)%L.length;sfx('page');show();};
  if(L.length>1){o.querySelector('.bgvw-nav.prev').onclick=()=>go(-1);o.querySelector('.bgvw-nav.next').onclick=()=>go(1);
    let x0=null;m.addEventListener('touchstart',e=>{x0=e.touches[0].clientX;},{passive:true});
    m.addEventListener('touchend',e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>50){swiped=true;setTimeout(()=>swiped=false,400);go(dx<0?1:-1);}},{passive:true});}
  show();o.animate([{opacity:0},{opacity:1}],{duration:250});}
/* ================= разделы: включение и выключение (админ-панель) ================= */
// Состояние берётся с сервера (/api/flags) и кэшируется. Менять может только организатор — проверяет сервер.
const FLAG_SECTIONS=[
  ['all','🛠 Технические работы — выключить всё','игрокам — заглушка «Кинотеатр обновляется», админ работает как обычно'],['kino','Кинозал','вкладка со сценами'],
  ['kinolesson','Урок «Фразы из кино»','на главной']];
const FKEY='dota_flags_v1';
let FLAGS={},FLAG_ADMIN=false,FLAG_RAW=null,FLAG_ME=null;
try{const c=JSON.parse(localStorage.getItem(FKEY)||'{}');FLAGS=c.flags||{};FLAG_ADMIN=!!c.admin;}catch(e){}
const flagRaw=k=>FLAG_ADMIN?'on':(FLAGS[k]||'on');
// 13.1: сцены 18+ (поле age у сцены). Пока игрок не подтвердил возраст — для всего приложения они «скрыты» (словарь, поиск,
// «Фраза дня», уроки, коллекция, полки Главной), а в Кинозале и на странице фильма видна карточка с плашкой «18+» и вопросом о возрасте.
const ageLock=s=>!!(s&&s.age)&&!store.age18&&!FLAG_ADMIN;
const flagOf=k=>{const f=flagRaw(k);return f!=='hide'&&k.startsWith('scene-')&&ageLock(scOf(k.slice(6)))?'hide':f;};
function ageAsk(ok){sfx('tap');haptic('medium');document.querySelectorAll('.gatewrap.agew').forEach(x=>x.remove());
  const w=document.createElement('div');w.className='gatewrap agew';
  w.innerHTML=`<div class="gatebox age"><i class="age-b">18+</i><b>Только для взрослых</b><p>Тут откровенный разговор: секс, порно, таблетки. Фразы живые и полезные, но тема — строго 18+.</p><button class="sc-btn" data-y>Мне есть 18</button><button class="sc-btn ghost" data-close>Нет, назад</button></div>`;
  document.body.appendChild(w);const close=()=>{w.classList.add('out');setTimeout(()=>w.remove(),220);};
  w.onclick=e=>{if(e.target.closest('[data-y]')){store.age18=true;save();sfx('good');close();if(ok)ok();return;}if(e.target===w||e.target.closest('[data-close]'))close();};}
const FLAG_TXT={maint:'Технические работы',dev:'В разработке',hide:'Скрыт'};
async function flagsCall(body){
  if(!TG||!TG.initData)return null;
  const r=await fetch(API+'/api/flags',{method:'POST',headers:{'content-type':'application/json','x-init-data':TG.initData},body:JSON.stringify(body)});
  return r.json();
}
async function flagsRefresh(){
  try{const r=await flagsCall({a:'get'});if(!r||!r.ok)return;
    const changed=JSON.stringify(r.v.flags)!==JSON.stringify(FLAGS)||!!r.v.admin!==FLAG_ADMIN;
    FLAGS=r.v.flags||{};FLAG_ADMIN=!!r.v.admin;FLAG_RAW=r.v.raw||null;FLAG_ME=r.v.me;
    try{localStorage.setItem(FKEY,JSON.stringify({flags:FLAGS,admin:FLAG_ADMIN}));}catch(e){}
    if(changed&&screen==='home'&&typeof renderHome==='function')renderHome();
  }catch(e){}
}
// экран закрытого раздела
function gateHTML(k,title){
  const st=flagOf(k),dev=st==='dev';
  const art=dev?`<div class="g2-clap"><i class="g2-top"></i><i class="g2-base"></i></div>`:`<div class="g2-bars">${['#e8e8e8','#e8d94a','#4ad3e8','#4ae86b','#e84ad9','#e84a4a','#4a5be8'].map(c=>`<i style="background:${c}"></i>`).join('')}<span>НЕТ СИГНАЛА</span></div>`;
  return `<div class="g2 ${dev?'dev':'maint'}">${art}<em>${esc(title||'')}</em><h2>${dev?'Скоро в прокате':'Технический перерыв'}</h2>
    <p>${dev?'Этот раздел ещё снимаем. Скоро откроем — загляни позже.':'Чиним и улучшаем этот раздел. Загляни чуть позже.'}</p></div>`;
}
function showGate(k,title){
  sfx('bad');haptic('err');
  const w=document.createElement('div');w.className='gatewrap';w.innerHTML=`<div class="gatebox">${gateHTML(k,title)}<button class="hs-btn" data-close>Понятно</button></div>`;
  document.body.appendChild(w);w.onclick=e=>{if(e.target===w||e.target.closest('[data-close]')){w.classList.add('out');setTimeout(()=>w.remove(),220);}};
}
// пометить закрытые кнопки и перехватить нажатия (вызывается после каждой отрисовки вкладки)
const FLAG_BTNS={'#hLesson':'kinolesson','.hrev2[data-go="les"]':'kinolesson'};
// пометить одну кнопку: закрыта — плашка и экран «тех. работы»/«в разработке»; админу — подсказка, что видят игроки
function flagMark(el,k,title){const st=flagOf(k);if(st==='hide'){el.style.display='none';el.classList.add('flag-hidden');return;}el.style.display='';const raw=FLAG_ADMIN&&FLAG_RAW&&FLAG_RAW[k]&&FLAG_RAW[k].st!=='on'?FLAG_RAW[k].st:null;
  el.querySelectorAll(':scope > .fbadge').forEach(x=>x.remove());el.classList.remove('flagged');
  if(st!=='on'){el.classList.add('flagged');el.insertAdjacentHTML('beforeend',`<span class="fbadge ${st}">${FLAG_TXT[st]}</span>`);el.onclick=e=>{e.stopPropagation();showGate(k,title);};}
  else if(raw)el.insertAdjacentHTML('beforeend',`<span class="fbadge admin">для всех: ${FLAG_TXT[raw]}</span>`);}
// ключи замков: вся вкладка kino → сцена scene-<id> → эпизод ep-<id>-<номер с 0>
const flagEpKey=(id,i)=>'ep-'+id+'-'+i;
// проверка перед входом в сцену или эпизод (ловит и кнопки «Продолжить», и ссылки с главной)
function scGate(id,i){const s=scOf(id);if(!s)return true;
  if(ageLock(s)){ageAsk(()=>renderScene(id));return true;}
  if(!premFree(s)&&premGate('scene',()=>renderTab(store.tab==='kino'?'kino':'learn')))return true;   // 13.9.30: режим «сцены» в админке
  const ks=['all','kino','scene-'+id].concat(i==null?[]:[flagEpKey(id,i)]);
  for(const k of ks)if(flagOf(k)!=='on'){if(flagOf(k)==='hide'){toast('Недоступно');return true;}showGate(k,k.startsWith('ep-')?s.title+' · '+s.parts[i].t:s.title);return true;}
  return false;}
function applyFlagsUI(){
  const mark=flagMark;
  for(const sel in FLAG_BTNS){const el=$(sel);if(el){const t=(el.querySelector('b')||{}).textContent||'';mark(el,FLAG_BTNS[sel],t);}}
  $$('[data-sc]').forEach(el=>{const id=el.dataset.sc,k=flagOf('kino')!=='on'?'kino':'scene-'+id;const t=(el.querySelector('b')||{}).textContent||'';
    if(k!=='kino'&&flagRaw(k)==='on'&&ageLock(scOf(id))){el.style.display='';return;}   // 18+: карточка видна, вход — через вопрос о возрасте
    mark(el,k,t);});
  // сериал/фильм целиком прячется, если скрыты все его сцены; скрытые вкладки — без кнопки внизу
  $$('[data-show]').forEach(el=>{const L=SCENES.filter(s=>s.show===el.dataset.show);el.style.display=L.length&&L.every(s=>flagRaw('scene-'+s.id)==='hide')?'none':'';});
  ['kino'].forEach(k=>$$(`[data-tab="${k}"],[data-nav="${k}"]`).forEach(el=>el.style.display=flagOf(k)==='hide'?'none':''));
}
/* ---- админ-панель: дерево «вкладка → раздел → сцена → эпизод» ---- */
/* ---- 11.2 админ → «Игрок»: пройти всё, сбросить прогресс (себе и по ID), режим игрока ---- */
function admPass(s){const P=scP(s.id);P.done=s.parts.map((p,i)=>i);P.w=P.w||{};P.st=P.st||{};P.got=P.got||{};
  s.parts.forEach((p,i)=>{P.w[i]=1;P.st[i]=3;scAct(p.ph).forEach(f=>{P.m[f.id]=Math.max(P.m[f.id]||0,3);if(!P.got[f.id])P.got[f.id]=Date.now();});});P.boss=3;
  store.scOwn=store.scOwn||{};store.scOwn[s.id]=1;s.parts.forEach((p,i)=>rwGive(s,i));segGive(s);seasonGive(s);showGive(s);}
const ADM_KEEP=['dictVar','dlDemo','onboarded','langs','snd','fx','full','fullV','theme','tab','subV','subStyle','scSub','scSubChosen','scVol','scMute','musVol','musAuto','vtask','look','goal','games','roles','path','kvUid','admPlayer','remind'];
function admResetMe(){const keep={};ADM_KEEP.forEach(k=>{if(store[k]!==undefined)keep[k]=store[k];});
  SC={};scSave();M={};saveM();RV={};saveRV();
  store=normalize(Object.assign(fresh(),keep));store.resetAt=Date.now();save();}
// сброс по ID: команда лежит в воркере бота (bot/worker.js, /api/pvp), игрок забирает её при запуске
async function admResetPull(){if(!(TG&&TG.initData)&&!window.__INIT)return;try{const r=await kvNet({a:'rget'});
  if(r&&r.ok&&r.v&&r.v.t&&r.v.t>(store.resetAt||0)){admResetMe();store.resetAt=r.v.t;save();toast('Прогресс сброшен администратором');renderHome();}}catch(e){}}
setTimeout(admResetPull,2500);
function admPlHTML(){const ch=(id,t,d)=>`<button class="adp-b" id="${id}"><b>${t}</b><small>${d}</small></button>`;
  return `<p class="lab-note">Для проверки. Всё меняется только у тебя на этом аккаунте (кроме сброса по ID).</p>
    <div class="adp">
      ${ch('adpPl',store.admPlayer?'👤 Смотрю как игрок':'👑 Смотрю как админ',store.admPlayer?'Замки и цены — как у всех. Нажми, чтобы снова открыть всё.':'Тебе открыто всё. Нажми, чтобы увидеть замки как у игрока.')}
      ${ch('adpAll','✅ Пройти всё','Все сцены: эпизоды на 3 ★, финалы, все фразы в словаре')}
      ${ch('adpGold','🎟 +1000 билетов','Для магазина и ставок в дуэли')}
      ${ch('adpReset','🗑 Сбросить мой прогресс','Как новый игрок: сцены, монеты, серия, словарь, мои слова. Настройки останутся')}
    </div>
    <button class="adm-tg" type="button">Пройти одну сцену</button><div class="adm-fold" hidden><div class="adp-sc">${SCENES.map(s=>{const P=scP(s.id);return `<button data-pass="${s.id}">${P.done.length>=s.parts.length?'✓ ':''}${esc(s.title)}<small>${esc(s.sub||s.ep||'')}</small></button>`;}).join('')}</div></div>
    <button class="adm-tg" type="button">Сбросить игроку по ID</button><div class="adm-fold" hidden><div class="adp-id"><input id="adpId" inputmode="numeric" placeholder="Telegram ID игрока"><button class="sc-btn" id="adpIdGo">Сбросить</button></div>
      <p class="lab-note">Прогресс обнулится, когда игрок в следующий раз откроет приложение. Работает через воркер бота (bot/worker.js 12.0).</p></div>`;}
function admPlBind(){const re=()=>{const se=document.scrollingElement,y=Math.max(window.scrollY||0,document.body.scrollTop||0);renderAdmin(ADM_SEC);try{window.scrollTo(0,y);document.body.scrollTop=y;}catch(e){}};
  $('#adpPl').onclick=()=>{sfx('tap');store.admPlayer=!store.admPlayer;save();toast(store.admPlayer?'Теперь всё как у игрока':'Тебе снова открыто всё');re();};
  $('#adpAll').onclick=()=>tgConfirm('Отметить все сцены пройденными на 3 звезды?',()=>{SCENES.forEach(admPass);scSave();save();sfx('win');haptic('ok');toast('Готово: всё пройдено');re();});
  $('#adpGold').onclick=()=>{store.gold=(store.gold||0)+1000;save();sfx('coin');toast('+1000 билетов · всего '+fmt(store.gold));};
  $('#adpReset').onclick=()=>tgConfirm('Сбросить весь твой прогресс? Это не отменить.',()=>{admResetMe();sfx('tap');haptic('warn');toast('Прогресс сброшен');re();});
  $$('[data-pass]').forEach(b=>b.onclick=()=>{const s=scOf(b.dataset.pass);admPass(s);scSave();save();sfx('good');toast('Пройдено: '+s.title);if(!/^✓/.test(b.firstChild.textContent))b.firstChild.textContent='✓ '+b.firstChild.textContent;});
  $('#adpIdGo').onclick=async()=>{const id=String($('#adpId').value||'').replace(/\D/g,'');if(!id){toast('Впиши Telegram ID');return;}
    tgConfirm(`Сбросить весь прогресс игроку ${id}?`,async()=>{try{const r=await kvNet({a:'rset',target:'tg'+id});toast(r&&r.ok?`Готово: сбросится у ${id} при следующем запуске`:(r&&r.msg)||'Не получилось');}catch(e){toast('Сервер не отвечает — обнови воркер бота (bot/worker.js)');}});};}
/* ---- 13.4: админка — меню разделов, на экране один раздел (раньше была простыня на 9000px) ---- */
let ADM_SEC=null,ADM_DR=null,ADM_U=null;
const ADM_ST=[['on','Открыт'],['maint','Тех. работы'],['dev','В разработке'],['hide','Скрыт']];
function admDraft(){if(!ADM_DR){ADM_DR={};const raw=FLAG_RAW||{};for(const k in raw)ADM_DR[k]={st:raw[k].st||'on',allow:[...(raw[k].allow||[])]};}return ADM_DR;}
const admSt=k=>(admDraft()[k]&&admDraft()[k].st)||'on';
const admAl=k=>(admDraft()[k]&&admDraft()[k].allow)||[];
function admDirty(){const raw=FLAG_RAW||{},D=admDraft(),keys=new Set([...Object.keys(raw),...Object.keys(D)]);let n=0;
  keys.forEach(k=>{const a=raw[k]||{},b=D[k]||{};if((a.st||'on')!==(b.st||'on')||(a.allow||[]).join(',')!==(b.allow||[]).join(','))n++;});return n;}
const admClosed=()=>Object.entries(admDraft()).filter(([k,x])=>k!=='dictlab'&&x.st&&x.st!=='on').length;
const admAgo=t=>{if(!t)return '—';const s=(Date.now()-t)/1000;return s<90?'только что':s<3600?Math.round(s/60)+' мин назад':s<86400?Math.round(s/3600)+' ч назад':s<86400*30?Math.round(s/86400)+' дн. назад':new Date(t).toLocaleDateString('ru-RU');};
function admCopy(t){const ok=()=>{toast('Скопировано: '+t);haptic('ok');};
  try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(ok,()=>fb());return;}}catch(e){}fb();
  function fb(){try{const a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;opacity:0';document.body.appendChild(a);a.select();document.execCommand('copy');a.remove();ok();}catch(e){toast(t);}}}
async function admUsersCall(body){if(!TG||!TG.initData)return null;
  const r=await fetch(window.EV_API||API+'/api/ev',{method:'POST',headers:{'content-type':'application/json','x-init-data':TG.initData},body:JSON.stringify(Object.assign({a:'users'},body||{}))});return r.json();}
function admPill(k){const st=admSt(k),al=admAl(k).length;return `<span class="ad2-pill st-${st}">${ADM_ST.find(x=>x[0]===st)[1]}${al?` · 👤 ${al}`:''}</span>`;}
function admSaveBar(){const n=admDirty(),bar=$('.ad2-save'),b=$('#admSave');if(!bar||!b)return;bar.classList.toggle('on',n>0);b.textContent=n?`Сохранить · ${n}`:'Сохранить';}
function admFlagSheet(k,name){scCloseSheet();const D=admDraft(),cur=D[k]||{st:'on',allow:[]};let st=cur.st||'on';
  const w=document.createElement('div');w.className='sc-sheetwrap';
  w.innerHTML=`<div class="sc-sheet ad2-sh"><b>${esc(name)}</b><div class="ad2-opts">${ADM_ST.map(([v,l])=>`<button data-v="${v}" class="${st===v?'on':''}"><i class="ad2-pd st-${v}"></i>${l}</button>`).join('')}</div>
    <label class="ad2-lbl" for="adAl">Тестеры — кому открыто всегда</label><input class="ad2-in" id="adAl" placeholder="Telegram ID через запятую" value="${esc((cur.allow||[]).join(', '))}" inputmode="numeric" autocomplete="off">
    <button class="sc-btn" id="adOk">Готово</button></div>`;
  document.body.appendChild(w);
  w.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{st=b.dataset.v;w.querySelectorAll('[data-v]').forEach(x=>x.classList.toggle('on',x===b));sfx('sel');haptic('sel');});
  const done=()=>{const allow=w.querySelector('#adAl').value.split(/[\s,;]+/).map(x=>x.replace(/\D/g,'')).filter(Boolean);D[k]={st,allow};w.remove();
    const p=document.querySelector(`[data-fk="${k}"] .ad2-pill`);if(p)p.outerHTML=admPill(k);admSaveBar();sfx('tap');};
  w.querySelector('#adOk').onclick=done;w.onclick=e=>{if(e.target===w)done();};}
async function admFlagsSave(){const D=admDraft(),flags={};for(const k in D){const x=D[k];if((x.st&&x.st!=='on')||(x.allow&&x.allow.length))flags[k]={st:x.st||'on',allow:x.allow||[]};}
  const b=$('#admSave');b.disabled=true;b.textContent='Сохраняю…';
  try{const r=await flagsCall({a:'set',flags});if(r&&r.ok){FLAG_RAW=r.v.raw;ADM_DR=null;toast('Сохранено. Игроки увидят при следующем открытии.');haptic('ok');b.disabled=false;admSaveBar();return;}
    toast((r&&r.msg)||'Не получилось сохранить — открой в Telegram');}catch(e){toast('Нет связи с сервером');}
  b.disabled=false;admSaveBar();}
function admUserSheet(u){if(!u)return;scCloseSheet();const nm=u.n||'Без имени';const w=document.createElement('div');w.className='sc-sheetwrap';
  w.innerHTML=`<div class="sc-sheet ad2-sh"><div class="ad2-uh"><i class="ad2-av lg">${esc((nm.trim()[0]||'?').toUpperCase())}</i><span><b>${esc(nm)}</b>${u.un?`<small>@${esc(u.un)}</small>`:''}</span></div>
    <div class="ad2-kv"><span>ID</span><b>${u.uid}</b><span>Пришёл</span><b>${u.first?new Date(u.first).toLocaleString('ru-RU'):'—'}</b><span>Был</span><b>${admAgo(u.last)}</b>
      <span>Откуда</span><b>${esc(u.src||'без метки')}</b><span>Язык Telegram</span><b>${esc(u.lang||'—')}</b><span>Действий</span><b>${u.ev||0}</b></div>
    <button class="sc-btn" data-a="copy">Скопировать ID</button>${u.un?`<button class="sc-btn ghost" data-a="tg">Написать @${esc(u.un)}</button>`:''}<button class="sc-btn ghost ad2-red" data-a="reset">Сбросить прогресс</button></div>`;
  document.body.appendChild(w);w.onclick=e=>{if(e.target===w){w.remove();return;}const b=e.target.closest('[data-a]');if(!b)return;sfx('tap');
    if(b.dataset.a==='copy')admCopy(String(u.uid));
    if(b.dataset.a==='tg'){try{TG.openTelegramLink('https://t.me/'+u.un);}catch(x){window.open('https://t.me/'+u.un);}}
    if(b.dataset.a==='reset')tgConfirm(`Сбросить весь прогресс игроку ${nm} (${u.uid})?`,async()=>{try{const r=await kvNet({a:'rset',target:'tg'+u.uid});toast(r&&r.ok?'Готово: сбросится при следующем запуске':(r&&r.msg)||'Не получилось');}catch(x){toast('Сервер не отвечает');}});};}
let ADM_FD=30;
function renderAdmin(sec){ADM_SEC=sec||null;screen='admin';backBtn(true);
  const head=(t,x)=>`<div class="page-head ad2-head"><button class="icon-btn" id="bBtn" aria-label="Назад">${ui('back')}</button><h1 class="title">${t}</h1>${x||''}</div>`;
  const mnt=h=>{mount(h,'admscr ad2');$('#bBtn').onclick=()=>{sfx('tap');if(ADM_SEC)renderAdmin();else renderTab('profile');};};
  if(!sec){
    const dirty=admDirty(),closed=admClosed();
    const it=(k,ic,t,d,x)=>`<button class="ad2-it" data-sec="${k}"><i class="ad2-ic">${ic}</i><span><b>${t}</b><small>${d}</small></span>${x||''}<i class="ad2-chev">${ui('fwd')}</i></button>`;
    mnt(`${head('Админка',FLAG_ME?`<button class="ad2-me" id="adMe" aria-label="Скопировать мой ID">ID ${FLAG_ME}</button>`:'')}
      <div class="ad2-stats" id="adStats"><div><b>—</b><small>игроков</small></div><div><b>—</b><small>новых за сутки</small></div><div><b>—</b><small>заходили за сутки</small></div></div>
      ${admSt('all')!=='on'?`<button class="ad2-warn" data-sec="flags">🛠 Включены технические работы — игроки видят заглушку</button>`:''}
      <div class="ad2-list">${it('users','👥','Игроки','кто заходил и их ID')}${it('stats','📈','Статистика','воронка, время на задание, ошибки')}${it('flags','🔒','Доступ',closed?`закрыто: ${closed}`:'всё открыто · дизайн «Новый» — '+{me:'только мне',test:'тестерам',all:'всем'}[ndAccMode()],dirty?'<em class="ad2-dot">не сохранено</em>':'')}${it('prem','⭐','Премиум',{off:'выключен — всё бесплатно',feat:'платные функции',scenes:'функции и сцены'}[premMode()])}${it('player','🧪','Я как игрок',store.admPlayer?'сейчас — как игрок':'пройти, сбросить, билеты, проверка установки')}</div>`);
    $$('[data-sec]').forEach(b=>b.onclick=()=>{sfx('tap');renderAdmin(b.dataset.sec);});
    if($('#adMe'))$('#adMe').onclick=()=>admCopy(String(FLAG_ME));
    admUsersCall({}).then(r=>{if(!r||!r.ok)return;const b=$$('#adStats b');if(b.length===3){b[0].textContent=fmt(r.v.total);b[1].textContent=fmt(r.v.new1);b[2].textContent=fmt(r.v.dau);}}).catch(()=>{});
    return;}
  if(sec==='users'){const st=ADM_U||{q:''};ADM_U=st;st.L=[];st.off=0;
    mnt(`${head('Игроки')}<div class="ad2-sw"><input id="adQ" placeholder="Поиск: ID, имя или @ник" value="${esc(st.q)}" autocomplete="off" inputmode="search"></div>
      <p class="ad2-note" id="adUn">Каждый, кто открыл мини-апп, попадает сюда сам. Ты в списке не показываешься.</p><div class="ad2-users" id="adUl"><div class="ad2-empty">Загружаю…</div></div><button class="ad2-more" id="adMore" hidden>Показать ещё</button>`);
    const row=u=>{const nm=u.n||'Без имени';return `<div class="ad2-u" data-id="${u.uid}" role="button"><i class="ad2-av">${esc((nm.trim()[0]||'?').toUpperCase())}</i><span class="ad2-ut"><b>${esc(nm)}${u.un?` <em>@${esc(u.un)}</em>`:''}</b><small>${admAgo(u.last)}${u.src?` · ${esc(u.src)}`:''}${u.ev?` · ${u.ev} ${plural(u.ev,['действие','действия','действий'])}`:''}</small></span><button class="ad2-id" data-copy="${u.uid}" aria-label="Скопировать ID">${u.uid}</button></div>`;};
    const bind=()=>{$$('#adUl [data-copy]').forEach(b=>b.onclick=e=>{e.stopPropagation();admCopy(b.dataset.copy);});$$('#adUl .ad2-u').forEach(r=>r.onclick=()=>{sfx('tap');admUserSheet(st.L.find(u=>String(u.uid)===r.dataset.id));});};
    const load=async more=>{const box=$('#adUl');if(!box)return;try{const r=await admUsersCall({q:st.q,off:more?st.off:0});if(!$('#adUl'))return;
        if(!r||!r.ok){box.innerHTML=`<div class="ad2-empty">${esc((r&&r.msg)||'Нет связи с сервером — открой приложение в Telegram.')}</div>`;return;}
        if(!more)st.L=[];st.L.push(...r.v.list);st.off=st.L.length;
        $('#adUn').innerHTML=`Всего <b>${fmt(r.v.total)}</b> · новых за сутки <b>${fmt(r.v.new1)}</b> · заходили за сутки <b>${fmt(r.v.dau)}</b>. Ты в списке не показываешься.`;
        box.innerHTML=st.L.length?st.L.map(row).join(''):`<div class="ad2-empty">${st.q?'Никого не нашёл':'Пока никто не заходил. Игрок появится здесь, как только откроет мини-апп.'}</div>`;
        $('#adMore').hidden=!r.v.more;bind();}catch(e){box.innerHTML='<div class="ad2-empty">Нет связи с сервером</div>';}};
    let qt=0;$('#adQ').oninput=e=>{clearTimeout(qt);qt=setTimeout(()=>{st.q=e.target.value.trim();load(false);},300);};
    $('#adMore').onclick=()=>{sfx('tap');load(true);};load(false);return;}
  if(sec==='flags'){const F=Object.fromEntries(FLAG_SECTIONS.map(x=>[x[0],x]));
    const fr=(k,n,d,cls)=>`<button class="ad2-fr ${cls||''}" data-fk="${k}"><span><b>${esc(n)}</b>${d?`<small>${esc(d)}</small>`:''}</span>${admPill(k)}</button>`;
    const grp=(t,h)=>`<h3 class="ad2-h">${t}</h3><div class="ad2-list">${h}</div>`;
    const scenes=SCENES.map(s=>{const n=s.parts.filter((p,i)=>admSt(flagEpKey(s.id,i))!=='on').length;
      return `<div class="ad2-sc">${fr('scene-'+s.id,s.sub||s.title,(s.show||s.title)+' · '+(s.ep||''))}<button class="ad2-eps" data-eps="${s.id}"><span>Эпизоды · ${s.parts.length}${n?` · закрыто ${n}`:''}</span><i>${ui('fwd')}</i></button><div class="ad2-epl" hidden>${s.parts.map((p,i)=>fr(flagEpKey(s.id,i),String(i+1).padStart(2,'0')+' · '+p.t,'','ep')).join('')}</div></div>`;}).join('');
    mnt(`${head('Доступ')}<p class="ad2-note">Нажми на строку и выбери, что видят игроки. «Скрыт» — этого у них нет. «${FLAG_TXT.maint}» и «${FLAG_TXT.dev}» — видно, но закрыто. Тебе всегда открыто всё.</p>
      ${grp('Приложение',fr('all','Технические работы','игроки видят заглушку «Кинотеатр обновляется»'))}${grp('Вкладки',fr('kino',F.kino[1],F.kino[2])+fr('kinolesson',F.kinolesson[1],F.kinolesson[2]))}
      <h3 class="ad2-h">Дизайн «Новый» — кому</h3>      <div class="lab" id="ndAcc"><div class="lab-chips">${[['me','Только мне'],['test','Тестерам'],['all','Всем']].map(([k,l])=>`<button data-nda="${k}" class="${ndAccMode()===k?'on':''}">${l}</button>`).join('')}</div>
        <input class="ad2-in" id="ndaIds" placeholder="ID тестеров через запятую" value="${esc(((FLAG_RAW&&FLAG_RAW.ndnew&&FLAG_RAW.ndnew.st==='hide'&&FLAG_RAW.ndnew.allow)||[]).join(', '))}" inputmode="numeric" autocomplete="off" ${ndAccMode()==='test'?'':'hidden'}>
        <p class="ad2-note">«Всем» — каждый игрок при следующем открытии видит «Новый», без «Как было». Откат — «Только мне».</p></div>
      ${grp('Сцены',scenes)}<div class="ad2-save"><button class="btn" id="admSave">Сохранить</button></div>`);
    $$('[data-fk]').forEach(b=>b.onclick=()=>{sfx('tap');admFlagSheet(b.dataset.fk,b.querySelector('b').textContent);});
    $$('[data-eps]').forEach(b=>b.onclick=()=>{const l=b.nextElementSibling;l.hidden=!l.hidden;b.classList.toggle('open',!l.hidden);sfx('tap');});
    $$('[data-nda]').forEach(b=>b.onclick=async()=>{const m=b.dataset.nda,ids=$('#ndaIds');sfx('tap');if(m==='test'&&ids.hidden){ids.hidden=false;ids.focus();return;}
      const ok=await ndAccSet(m,ids.value.split(/[\s,;]+/));if(ok){$$('[data-nda]').forEach(x=>x.classList.toggle('on',x===b));ids.hidden=m!=='test';toast(m==='all'?'«Новый» — у всех игроков при следующем открытии':m==='test'?'«Новый» — тестерам':'«Новый» — только у тебя');}});
    $('#admSave').onclick=admFlagsSave;admSaveBar();return;}
  // 13.9.19: воронка новичков и опрос — из событий бота (/api/ev a:'funnel'); ошибки у игроков — a:'errs'
  if(sec==='prem'){const M=[['off','Выкл','всё бесплатно, как раньше'],['feat','Функции','повторение больше раза в день, подсказки без билетов, «Мои слова» больше 50, режиссёрская версия'],['scenes','Функции и сцены','плюс сцены сложнее 2-го уровня (кроме сцен первого запуска)']];
    mnt(`${head('Премиум')}<p class="ad2-note">Звёзды Telegram: месяц — подписка 250 ⭐, год — 1500 ⭐ разово, пробные 7 дней без оплаты. Нужен бот 13.9.30 и один раз открыть /setup.</p>
      <div class="ad2-pm" id="pmM">${M.map(([k,t,d])=>`<button data-m="${k}" class="${premMode()===k?'on':''}"><b>${t}</b><small>${d}</small></button>`).join('')}</div>
      <div class="ad2-list"><button class="ad2-it" id="pmView"><i class="ad2-ic">👀</i><span><b>Посмотреть экран премиума</b><small>как его увидит игрок</small></span><i class="ad2-chev">${ui('fwd')}</i></button></div>
      <div id="pmS"><div class="ad2-empty">Загружаю…</div></div>
      <h3 class="ad2-h">Выдать дни</h3><div class="ad2-sw ad2-give"><input id="pmU" placeholder="ID игрока" inputmode="numeric"><input id="pmD" placeholder="дней" inputmode="numeric" value="30"><button class="btn" id="pmG">Выдать</button></div><p class="ad2-note">0 дней — забрать премиум.</p>`);
    const load=async()=>{const box=$('#pmS');const r=await premCall({a:'stats'}).catch(()=>null);if(!$('#pmS'))return;
      if(!r||!r.ok){box.innerHTML=`<div class="ad2-empty">${esc((r&&r.msg)||'Сервер не ответил — передеплой бота 13.9.30')}</div>`;return;}
      const PL={m:'месяц',y:'год',t:'тест',trial:'пробные',gift:'подарок'};
      box.innerHTML=`<div class="ad2-stats"><div><b>${fmt(r.active)}</b><small>с премиумом</small></div><div><b>${fmt(r.paid)}</b><small>платят</small></div><div><b>${fmt(r.stars30)} ⭐</b><small>за 30 дней</small></div></div><p class="ad2-note">Пробные дни брали: ${fmt(r.trials)}.</p>
        <h3 class="ad2-h">Платежи</h3>${r.pays.length?`<div class="ad2-list">${r.pays.map(x=>`<div class="ad2-it ad2-pay"><i class="ad2-ic">⭐</i><span><b>${esc(x.n||('ID '+x.uid))}${x.un?' · @'+esc(x.un):''}</b><small>${PL[x.plan]||x.plan} · ${fmt(x.amount)} ⭐ · ${premDate(x.ts)} · до ${premDate(x.until)}</small></span></div>`).join('')}</div>`:'<div class="ad2-empty">Пока не было</div>'}`;};
    load();
    $$('#pmM [data-m]').forEach(b=>b.onclick=async()=>{const m=b.dataset.m;if(m===premMode())return;b.disabled=true;const r=await premCall({a:'mode',mode:m}).catch(()=>null);b.disabled=false;
      if(!r||!r.ok){toast((r&&r.msg)||'Не сохранилось — передеплой бота 13.9.30');return;}PREM.st=Object.assign({},premC(),{mode:m});store.premC=Object.assign({},store.premC,{mode:m});save();sfx('sel');toast({off:'Премиум выключен — всё бесплатно',feat:'Включены платные функции',scenes:'Включены платные функции и сцены'}[m]);renderAdmin('prem');});
    $('#pmView').onclick=()=>{sfx('tap');renderPaywall(null,()=>renderAdmin('prem'));};
    $('#pmG').onclick=async()=>{const uid=+$('#pmU').value.trim(),days=+$('#pmD').value.trim();if(!uid){toast('Нужен ID');return;}const r=await premCall({a:'give',uid,days}).catch(()=>null);
      if(!r||!r.ok){toast((r&&r.msg)||'Не получилось');return;}toast(days?`Выдал до ${premDate(r.until)}`:'Забрал премиум');if(String(uid)===String(FLAG_ME))premLoad();load();};
    return;}
  const QT_N={all:'Вся проверка',listen:'Послушай и собери',heard:'Что прозвучало?',build:'Собери фразу',expr:'Собери выражение',mean:'Что значит?',when:'Когда пригодится?',gap:'Пропущенное слово',gap4:'Какое слово пропущено?',life:'Примени в жизни'};
  if(sec==='stats'||sec==='funnel'||sec==='errs'){ADM_SEC='stats';mnt(`${head('Статистика')}<div class="ad2-sg" id="fnD">${[7,30,90].map(d=>`<button data-d="${d}" class="${(ADM_FD||30)===d?'on':''}">${d} дн.</button>`).join('')}</div><div id="fnB"><div class="ad2-empty">Загружаю…</div></div>
      <h3 class="ad2-h">Ошибки у игроков</h3><p class="ad2-note">Что сломалось у игроков: одинаковые склеены, видно сколько раз и у скольких людей. Пришли скрин мне — починю.</p><div id="erB"><div class="ad2-empty">Загружаю…</div></div><button class="ad2-more" id="erClr">Очистить список</button>`);
    const load=async()=>{const box=$('#fnB');try{const r=await admUsersCall({a:'funnel',days:ADM_FD||30});if(!$('#fnB'))return;if(!r||!r.ok){box.innerHTML=`<div class="ad2-empty">${esc((r&&r.msg)||'Нет связи с сервером — открой приложение в Telegram. Если пишет «неизвестно» — передеплой бота 13.9.19.')}</div>`;return;}
        const v=r.v,pc=(a,b)=>b?Math.round(a/b*100)+'%':'—',bar=(t,n,base,hint)=>`<div class="fn-r"><span><b>${t}</b><small>${hint||''}</small></span><em>${fmt(n)}</em><i><u style="width:${base?Math.min(100,Math.round(n/base*100)):0}%"></u></i><strong>${pc(n,base)}</strong></div>`;
        const PQ={none:'Ничего, всё понятно',what:'Непонятно, что делать',hard:'Сложные задания',bore:'Скучно, затянуто',few:'Мало фильмов',bug:'Что-то не работает'};
        const pollN=v.poll.reduce((a,x)=>a+x.n,0);
        box.innerHTML=`<p class="ad2-note">Люди, которые впервые зашли за ${v.days} дн. Процент — от пришедших.</p>
          <div class="fn">${bar('Пришли',v.users,v.users,'открыли мини-апп')}${bar('Выбрали сцену',v.picked,v.users,'на первом экране')}${bar('Досмотрели эпизод',v.watched,v.users)}${bar('Прошли проверку',v.quiz,v.users)}${bar('Повторяли',v.review,v.users)}${bar('Открыли «Фразу дня»',v.daily,v.users,'из бота')}</div>
          <h3 class="ad2-h">Вернулись</h3><div class="fn">${bar('На следующий день',v.d1.back,v.d1.base,`из ${v.d1.base}, кто пришёл раньше 2 дней назад`)}${bar('Через неделю',v.d7.back,v.d7.base,`из ${v.d7.base}, кто пришёл раньше 8 дней назад`)}</div>
          <h3 class="ad2-h">Опрос «Что мешает?» · ${pollN}</h3><div class="fn">${v.poll.length?v.poll.map(x=>bar(PQ[String(x.sid).replace(/^q1:/,'')]||x.sid,x.n,pollN)).join(''):'<div class="ad2-empty">Пока никто не ответил. Опрос появляется после 3-го пройденного эпизода.</div>'}</div>
          <h3 class="ad2-h">Первая сцена</h3><div class="fn">${v.picks.length?v.picks.map(x=>{const sc=scOf(x.sid);return bar(sc?dictFilm(sc)+' · '+(sc.sub||sc.title):x.sid,x.n,v.picked);}).join(''):'<div class="ad2-empty">Пока нет</div>'}</div>${v.levels&&v.levels.length?`<h3 class="ad2-h">Уровень на старте</h3><div class="fn">${v.levels.map(x=>bar((x.sid||'?')+' · '+(CEFR_N[x.sid]||''),x.n,v.levels.reduce((a,y)=>a+y.n,0))).join('')}</div>`:''}
          ${v.qt?`<h3 class="ad2-h">Время на задание · медиана</h3><p class="ad2-note">Цель — до 20 с на задание и до 2 минут на всю проверку. Красным — дольше.</p><div class="fn">${v.qt.length?v.qt.map(x=>{const lim=x.t==='all'?120e3:20e3,sec=Math.round(x.med/1000);return `<div class="fn-r qt${x.med>lim?' slow':''}"><span><b>${esc(QT_N[x.t]||x.t)}</b><small>${x.n} ${plural(x.n,['ответ','ответа','ответов'])}</small></span><em>${sec>=60?Math.floor(sec/60)+' мин '+sec%60:sec} с</em></div>`;}).join(''):'<div class="ad2-empty">Пока нет — появится после передеплоя бота 13.9.34</div>'}</div>`:''}
          <h3 class="ad2-h">Откуда</h3><div class="fn">${v.src.map(x=>bar(x.s,x.n,v.users)).join('')||'<div class="ad2-empty">Пока нет</div>'}</div>`;}catch(e){box.innerHTML='<div class="ad2-empty">Нет связи с сервером</div>';}};
    $$('#fnD [data-d]').forEach(b=>b.onclick=()=>{sfx('tap');ADM_FD=+b.dataset.d;$$('#fnD [data-d]').forEach(x=>x.classList.toggle('on',x===b));load();});load();
    const draw=v=>{$('#erB').innerHTML=v.list.length?v.list.map(e=>`<div class="er-r"><b>${esc(e.msg)}</b><small>${esc(e.at||'')}${e.scr?` · экран ${esc(e.scr)}`:''}${e.v?` · v${esc(e.v)}`:''}</small><span>${e.n} ${plural(e.n,['раз','раза','раз'])} · ${e.u} ${plural(e.u,['человек','человека','человек'])} · ${admAgo(e.last)}</span>${e.ua?`<small class="er-ua">${esc(e.ua)}</small>`:''}</div>`).join(''):'<div class="ad2-empty">Ошибок нет 👍</div>';};
    admUsersCall({a:'errs'}).then(r=>{if(!$('#erB'))return;if(!r||!r.ok){$('#erB').innerHTML=`<div class="ad2-empty">${esc((r&&r.msg)||'Нет связи с сервером. Если пусто долго — передеплой бота 13.9.19.')}</div>`;return;}draw(r.v);}).catch(()=>{});
    $('#erClr').onclick=()=>{sfx('tap');admUsersCall({a:'errs',clear:1}).then(r=>{if(r&&r.ok)draw(r.v);});};return;}
  if(sec==='player'){mnt(`${head('Я как игрок')}${admPlHTML()}<div class="ad2-list"><button class="ad2-it" data-sec="check"><i class="ad2-ic">🔧</i><span><b>Проверка установки</b><small>код, видео, кадры; почему нет анимаций</small></span><i class="ad2-chev">${ui('fwd')}</i></button></div>`);admPlBind();
    $$('[data-sec]').forEach(b=>b.onclick=()=>{sfx('tap');renderAdmin(b.dataset.sec);});
    $$('.adm-tg').forEach(b=>b.onclick=e=>{e.stopPropagation();const f=b.nextElementSibling;const open=f.hidden;f.hidden=!open;b.classList.toggle('open',open);sfx('tap');});return;}
  if(sec==='check'){const yn=(v,a,b)=>`<b class="${v?'y':'n'}">${v?a:b}</b>`,lite=document.documentElement.classList.contains('lite');
    mnt(`${head('Проверка установки')}<div class="ad2-why" id="admWhy"><h3>Почему может не быть анимаций</h3>
      <p><span>Система просит меньше движения</span>${yn(rmOn(),'да','нет')}</p><p><span>ПК-облегчённый режим (lite)</span>${yn(lite,'да','нет')}</p>
      <p><span>Анимации в настройках</span>${yn(store.fx!==false,'вкл','выкл')}</p>
      <small>${rmOn()?'Система просит меньше движения — большие эффекты (наезды, конфетти, полёты) выключены, появление и отклик остаются. Включить всё: Windows — Параметры → Специальные возможности → Визуальные эффекты → «Эффекты анимации»; iPhone — Универсальный доступ → Движение → «Уменьшение движения».':store.fx===false?'Анимации выключены в Настройках.':'Всё включено.'}</small></div><p class="ad2-note">Проверяет, что в репозиториях лежит всё нужное: свежий код, видео, обложки и кадры каждой сцены.</p><button class="sc-btn" id="dkGo">Проверить</button><div id="dkBox" class="dk"></div>`);
    $('#dkGo').onclick=()=>{sfx('tap');deployCheck($('#dkBox'));};return;}
  renderAdmin();}

setTimeout(flagsRefresh,400);
/* ================= главная: кино в центре, игры ниже ================= */
function continueScene(){
  // 13.0.2: сцена пройдена целиком — предлагаем следующую непройденную, а не «Продолжить» уже пройденное
  const ok=x=>x.kind!=='clip'&&flagOf('scene-'+x.id)==='on'&&(scL()==='de'?true:x.lang!=='de');
  const todo=x=>{const P=scP(x.id);return x.parts.findIndex((p,k)=>!P.done.includes(k));};
  const list=SCENES.filter(ok).sort((a,b)=>(a.lvl||3)-(b.lvl||3)),nxt=()=>list.find(x=>todo(x)>=0);
  const L=store.scLast,s=L&&scOf(L.id);
  if(s){const P=scP(s.id);let i=Math.min(L.i,s.parts.length-1);if(P.done.includes(i)){const k=todo(s);if(k>=0)i=k;else{const n=nxt();if(n)return {s:n,i:todo(n),next:true};}}return {s,i,fresh:false};}
  const easy=nxt()||list[0]||SCENES[0];
  return {s:easy,i:Math.max(0,todo(easy)),fresh:!scP(easy.id).done.length};
}
// сцена для урока: эпизод (просмотренный), где больше всего невыученных фраз. 13.7: урок — фразы ОДНОГО эпизода
// (renderScEp берёт только фразы своего эпизода — раньше набор из разных эпизодов давал «5 фраз», а в уроке было 2–3)
function scLessonScene(){
  const un=(P,f)=>!f.passive&&(P.m[f.id]||0)<3&&!P.r[f.id];let best=null;
  for(const s of SCENES){if(flagOf('scene-'+s.id)==='hide')continue;const P=scP(s.id);
    s.parts.forEach((p,i)=>{if(!(P.w[i]||P.done.includes(i)))return;const cand=p.ph.filter(f=>un(P,f));
      if(cand.length&&(!best||cand.length>best.cand.length))best={s,i,cand};});}
  if(!best){const c=continueScene(),s=c.s,P=scP(s.id);
    for(let k=0;k<s.parts.length&&!best;k++){const i=(c.i+k)%s.parts.length,cand=s.parts[i].ph.filter(f=>un(P,f));if(cand.length)best={s,i,cand,fresh:true};}}
  if(best)best.n=Math.min(5,best.cand.length);
  return best;
}
function startScLesson(){
  const b=scLessonScene();
  if(!b){toast('Все фразы выучены — скоро будут новые сцены');return;}
  // 13.9.42: урок — обычный эпизод (смотри → проверка по его фразам); старый «Разбор» 9.2 убран
  renderScEp(b.s.id,b.i,{free:true});
}
// 13.9.19: серия и цель дня — крупно в углу кадра (кольцо «сегодня X из 20», 🔥 дни; серия не продлена сегодня — «сгорит в полночь»)
function dayGoalHTML(d,goal,gp,st){const ok=d.n>=goal,today=store.lastDay===new Date().toDateString(),risk=st>0&&!today;
  return `<button class="hh-dg${ok?' ok':''}${risk?' risk':''}" id="hDay" aria-label="Цель дня"><span class="hh-ring" style="--p:${gp}"><b>${ok?'✓':Math.min(d.n,goal)}</b><small>${ok?'цель':'из '+goal}</small></span>
    <span class="hh-dt"><b>${st?`🔥 ${st} ${plural(st,['день','дня','дней'])}`:'🔥 Серия'}</b><small>${ok?'Цель дня выполнена':risk?'Ответь хоть раз — иначе серия сгорит в полночь':st?`подряд · сегодня ещё ${goal-Math.min(d.n,goal)}`:'ответь на любой вопрос — начни серию'}</small></span></button>`;}
function learnTabHTML(){
  setWorld('neutral');
  if(ndOn())return ndTodayHTML();   // 13.9.37: «Новый» — экран 6 макета
  // 8.7: главная — только главное. Продолжить → Сегодня (одно главное действие) → два входа (мои слова, словарь) → фраза дня → кинозал.
  const c=continueScene(),s=c.s,p=s.parts[c.i],L=scLearned(s),T=scTotal(s);
  const d=dayStat(),goal=store.goal||20,gp=Math.min(100,Math.round(d.n/goal*100)),les=scLessonScene();
  const Q=dailyItems(),n=Q.length,mw=mywAll().length,A=dictAll().length;
  const main=n?{id:'hRev',k:'Повторение',b:`${n} ${plural(n,['задание','задания','заданий'])} · ≈ ${Math.max(2,Math.round(n*0.4))} мин`,s:'фразы и твои слова, которые пора вспомнить'}
    :les?{id:'hLesson',k:'Урок на сегодня',b:`${les.n} ${plural(les.n,['фраза','фразы','фраз'])} · ≈ ${Math.max(1,Math.round(les.n*.6))} мин`,s:`из «${esc(les.s.title)}» · эпизод ${les.i+1}`}
    :{id:'hNext',k:'Дальше',b:`Эпизод ${c.i+1} · ${esc(p.t)}`,s:esc(s.title)};
  // 13.9.13: Главная заново (Андрей: «переделай главное меню»): один большой кадр фильма — «▶ Смотреть» и «Повторение» прямо на нём,
  // мелкое (Мои слова · Коллекция · Магазин) — строкой значков, дальше полки фильмов, «Фраза дня» — внизу
  const big=innerWidth>=1000,bdi=filmImg(s,big?'bd.jpg':'bdm.jpg'),st=streakNow(),lbl=c.fresh?'Начни отсюда':c.next?'Следующая сцена':'Продолжить';
  const rev=n?`<button class="hh-rev" id="hRev"><i>🔁</i><span><b>Повторить <em>${n}</em></b><small>≈ ${Math.max(2,Math.round(n*0.4))} мин · фразы и слова</small></span></button>`
    :les&&!les.fresh?`<button class="hh-rev" id="hLesson"><i>📘</i><span><b>Урок <em>${les.n}</em></b><small>${plural(les.n,['фраза','фразы','фраз'])} · «${esc(les.s.title)}»</small></span></button>`:'';
  // 13.9.22: в видах на пробу «Повторить» (или «Урок») — строкой под кадром; в обычном виде строка скрыта, кнопка — на кадре.
  // Мелкой ссылки «или урок: N фраз →» больше нет: урок появляется на кадре, когда повторение сделано.
  const rev2=n?`<button class="hrev2" data-go="rev"><i class="hr-i">🔁</i><span class="hr-t"><b>Повторить</b><small>фразы и слова · ≈ ${Math.max(2,Math.round(n*0.4))} мин</small></span><em class="hr-n">${n}</em><i class="hr-c">${ui('fwd')}</i></button>`
    :les&&!les.fresh?`<button class="hrev2" data-go="les"><i class="hr-i">📘</i><span class="hr-t"><b>Урок на сегодня</b><small>${les.n} ${plural(les.n,['фраза','фразы','фраз'])} · «${esc(les.s.title)}»</small></span><em class="hr-n">${les.n}</em><i class="hr-c">${ui('fwd')}</i></button>`:'';
  const coll=(()=>{try{const C=collStat();return C.bg+C.cards||'';}catch(e){return '';}})();
  const chips=`<nav class="hchips anim">
      ${mw?`<button onclick="renderMyWords()"><i>⭐</i>Мои слова<em>${mw}</em></button>`:''}
      <button id="hColl"><i>🏆</i>Коллекция${coll?`<em>${coll}</em>`:''}</button>
      <button id="hShop"><i>🛍</i>Магазин</button>
    </nav>`;
  const shelves=`<div class="hsec anim"><h2>${ndOn()?'Кино':'Кинозал'}</h2><button class="hlink" id="hAllKino">Все сцены →</button></div>
    ${[['kino',x=>x.kind!=='interview'&&x.lang!=='de'],['iv',x=>x.kind==='interview'&&x.lang!=='de'],['de',x=>x.lang==='de']].map(([hk,hf])=>{const HS=SCENES.filter(x=>flagOf('scene-'+x.id)!=='hide'&&hf(x));if(!HS.length)return '';
    return (hk==='iv'?`<div class="hsec anim"><h2>Интервью</h2><button class="hlink" id="hAllIv">Все интервью →</button></div>`:hk==='de'?`<div class="hsec anim"><h2>${FLAG.de} Auf Deutsch</h2><button class="hlink" id="hAllDe">Все на немецком →</button></div>`:'')+`<div class="hrow">${(()=>{const G=[],by={};for(const x of HS){const k=x.show||x.title;if(!by[k]){by[k]=[];G.push(k);}by[k].push(x);}
      return G.map(k=>{const L=by[k],x=L[0],l=L.reduce((a,y)=>a+scLearned(y),0),t=L.reduce((a,y)=>a+scTotal(y),0),eps=L.reduce((a,y)=>a+y.parts.length,0);
        return `<button class="hposter ${x.theme} anim${L.every(y=>scMasterPct(y)===100)?' mastered':''}" ${L.length>1?`data-show="${esc(k)}"`:`data-sc="${x.id}"`}><span class="kp-img" style="background-image:url('${assetUrl(scKey(x,'poster.jpg'))}'),url('${assetUrl(scKey(x,'cover.jpg'))}')"></span><span class="kp-grad"></span>${lvcHTML(L.reduce((a,y)=>(y.lvl||3)<(a.lvl||3)?y:a,L[0]))}<span class="kp-t"><b>${esc(k)}</b><small>${L.length>1?L.length+' '+plural(L.length,['сцена','сцены','сцен'])+' · ':''}${eps} ${plural(eps,['эпизод','эпизода','эпизодов'])}</small><span class="kp-bar"><i style="width:${t?Math.round(l/t*100):0}%"></i></span></span></button>`;}).join('');})()}</div>`;}).join('')}`;
  return `<div class="home home2">${headHTML()}${hmChipHTML()}
    <section class="hh ${s.theme} anim" id="hHero" data-sc="${s.id}">
      ${dayGoalHTML(d,goal,gp,st)}
      <span class="hh-img" style="background-image:${bdi?`url('${bdi}'),`:''}url('${assetUrl(scKey(s,'cover.jpg'))}')"></span><span class="hh-grad"></span>
      <div class="hh-in">
        <em class="hh-k">${lbl}</em>
        <h1 class="hh-t">${esc(s.title)}</h1>
        <p class="hh-e">Эпизод ${c.i+1} · ${esc(p.t)}</p>
        <span class="hh-bar"><i style="width:${Math.round(L/T*100)}%"></i></span>
        <div class="hh-b"><button class="hh-go" id="hCont">${SI.play}<span>${c.fresh?'Смотреть':'Продолжить'}</span></button>${rev}</div>
      </div>
    </section>
    ${rev2}
    ${chips}
    ${shelves}
    ${phraseOfDayHTML()}</div>`;
}
function bindLearn(){
  bindHead();setTimeout(()=>{unlockSheet();setTimeout(pollMaybe,400);},600);   // 13.9.19: первый пройденный эпизод — «Открылось: …»; после 3-го — опрос
  const c=continueScene();
  if($('#hCont'))$('#hCont').onclick=()=>{haptic('medium');renderScEp(c.s.id,c.i);};
  {const h=$('#hHero');if(h)h.onclick=e=>{if(e.target.closest('button,.ndpull,.n-pull'))return;sfx('tap');renderScene(c.s.id);};}
  {const pl=$('#ndPull');if(pl)ndPull(pl,()=>renderScEp(c.s.id,c.i));
   $$('.n-row[data-go]').forEach(b=>b.onclick=()=>{haptic('light');sfx('tap');const g=b.dataset.go;if(g==='pod'){const x=phraseOfDay();if(x)momOpen(x.s.id,x.f.pi,x.f.a);}else if(g==='next')renderScEp(b.dataset.sc,+b.dataset.i);else renderDaily();});
   const r=$('.ndring,.n-ring');if(r&&fxOK()){r.classList.add('rg0');requestAnimationFrame(()=>requestAnimationFrame(()=>r.classList.remove('rg0')));}}   // кольцо заполняется при входе   // 13.9.13: нажал на кадр — страница сцены
  if($('#hLesson'))$('#hLesson').onclick=()=>{haptic('medium');startScLesson();};
  if($('#hRev'))$('#hRev').onclick=()=>{haptic('medium');renderDaily();};
  $$('.hrev2').forEach(b=>b.onclick=()=>{haptic('medium');if(b.dataset.go==='les')startScLesson();else renderDaily();});   // 13.9.22: строка под кадром в видах на пробу
  if($('#hDay'))$('#hDay').onclick=e=>{e.stopPropagation();sfx('tap');const d=dayStat(),g=store.goal||20;toast(`Серия растёт от одного ответа в день. Цель дня — ${g} ответов в сценах и повторении (сегодня ${Math.min(d.n,g)}), за неё 🎟 200.`);};
  if($('#hNext'))$('#hNext').onclick=()=>{haptic('medium');renderScEp(c.s.id,c.i);};
  if($('#hReview'))$('#hReview').onclick=()=>{haptic('medium');const sc=SCENES.find(x=>scDue(x).length);if(sc)renderScQuiz(sc.id,'rev');else renderDaily();};
  if($('#hAllKino'))$('#hAllKino').onclick=()=>{sfx('tap');store.kinoLang='en';renderTab('kino');};
  if($('#hAllDe'))$('#hAllDe').onclick=()=>{sfx('tap');store.kinoLang='de';store.kinoCat='all';save();renderTab('kino');};
  if($('#hColl'))$('#hColl').onclick=()=>{haptic('medium');sfx('tap');renderCollection();};
  if($('#hShop'))$('#hShop').onclick=()=>{haptic('medium');sfx('tap');renderShop();};hmBind();
  if($('#hAllIv'))$('#hAllIv').onclick=()=>{sfx('tap');store.kinoLang='en';store.kinoCat='interview';save();renderTab('kino');};
  $$('.hrow [data-show]').forEach(b=>b.onclick=()=>{haptic('medium');renderShow(b.dataset.show);});
  $$('.hrow [data-sc]').forEach(b=>b.onclick=()=>{haptic('medium');renderScene(b.dataset.sc);});
}
function onBack(){
  ND_BACK=Date.now();   // 13.9.33: экран «назад» приходит слева
  if(document.getElementById('ddx')){ddxClose();return;}   // 13.9.65: дуэль во весь рост — «назад» закрывает её
  if(document.getElementById('dvx')||document.querySelector('.sc-sheetwrap.dvs')){dvBack();return;}   // 13.9.67: Versus — выйти из боя / закрыть шторку
  if(screen==='onb'){onbBack();return;}   // 13.9.28: первый запуск — шаг назад
  if(screen==='prem'){(PREM.back||(()=>renderTab('learn')))();return;}   // 13.9.30: экран премиума
  {const g=document.querySelector('.gatewrap');if(g){g.click();return;}}   // аудит: окно «Технический перерыв / Скоро» закрывается «назад»
  if(window.DL&&document.querySelector('#dlRoot,.dli,.dlp')){const o=document.querySelector('.dlp');if(o&&o._close){o._close();return;}if(DL.back())return;}   // 13.7: варианты словаря
  if(document.querySelector('.dxo')){const d=document.querySelector('.dxo-dim');if(d)d.click();return;}   // 11.0: открытая карта словаря
  if(document.querySelector('.dfly')){document.querySelector('.dfly').click();return;}
  if(document.querySelector('.rwo')){document.querySelector('.rwo-dim').click();return;}   // 12.0: открытый кадр коллекции
  {const o=document.querySelector('.pfv');if(o&&o._close){o._close();return;}}   // 13.9.6: профиль игрока
  {const o=document.querySelector('.bgvw');if(o&&o._close){o._close();return;}}   // 13.0: фон на весь экран
  if(screen==='coll'){sfx('tap');renderTab(COLL_BACK||'learn');return;}
  if(screen==='shop'){shopBack();return;}
  if(screen==='pvp'){if(KV&&KV.over){const sid=KV.room.sid;KV=null;renderScene(sid);}else kvLeave();return;}
  if(screen==='sctask'){if(document.querySelector('.sc-pfs')){scExitFull();return;}renderScene(SCUR.id);return;}
  if(screen==='intro'){if(INTRO&&INTRO.i>0){INTRO.i--;renderIntro();}return;}   // 13.6 (экран «Выбери сцену» назад не уходит)
  if(screen==='admin'){sfx('tap');scCloseSheet();if(ADM_SEC)renderAdmin();else renderTab('profile');return;}
  if(screen==='show'){sfx('tap');renderTab('kino');return;}
  if(screen==='scintro'){sfx('tap');renderTab('learn');return;}
  if(screen==='scene'){sfx('tap');renderTab('kino');return;}
  if(screen==='dircut'){SC_DIR=false;renderScene(SCUR.id);return;}
  if(document.querySelector('.sc-sheetwrap')){scCloseSheet();return;}
  if(document.querySelector('.sc-pfs')){scExitFull();return;}
  if(screen==='scep'&&navBack())return;
  if(screen==='scep'||screen==='scend'){renderScene(SCUR.id);return;}
  if(screen==='scq'){const b=document.querySelector('#scb');if(b){b.click();return;}renderScEp(SCUR.id,SCUR.i);return;}   // аудит: как ✕ на экране (урок/повторение → Главная, финал → сцена), а не всегда эпизод 1
  if(!store.onboarded){startOnboarding();return;}
  sfx('tap');renderHome();
}

/* ================= 5.5: саундтреки сцен — проигрыватель-пластинка ================= */
// У сцены может быть поле music: [{t:'название', by:'исполнитель', f:'m1.m4a', note:'откуда', img:'poster.jpg'}].
// Файлы лежат рядом с видео: scenes/<сцена>/<f>. Картинка на пластинке — img трека, иначе cover.jpg сцены.
// Зашёл в сцену — пластинка сама начинает играть (можно выключить галочкой «Включать сразу»).
// Ушёл в эпизод или задания — музыка встаёт на паузу (внизу плашка, можно включить вручную), вернулся — играет дальше.
// Видео эпизода играет — музыка на паузе. Нажал «стоп» — в этой сцене больше не включается сама. Вышел из сцены — выключается.
let MUS=null,MUSC=null,MUSAUTO=false,MUSFADE=0,MUSWAIT=0,MUSTICK=0,MUSOFF=null,MUSOV=false;
const musOf=s=>s&&Array.isArray(s.music)?s.music:[];
const musArt=(s,m)=>s&&s.coverUrl?assetUrl(s.coverUrl):assetUrl(scKey(s,(m&&m.img)||'cover.jpg'));
const musVol=()=>store.musVol==null?.18:store.musVol;   // 9.2: тише по умолчанию
const MUSIOS=/iP(hone|ad|od)/.test(navigator.userAgent)||!!(TG&&TG.platform==='ios');
let MUSCTX=null,MUSG=null,MUSSRC=null;
function musGainInit(){if(!MUSIOS||MUSG||!MUS)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
  MUSCTX=new C();MUSSRC=MUSCTX.createMediaElementSource(MUS);MUSG=MUSCTX.createGain();MUSSRC.connect(MUSG);MUSG.connect(MUSCTX.destination);}catch(e){MUSG=null;MUSSRC=null;}}
function musSetVol(v){if(!MUS)return;if(MUSG){MUSG.gain.value=v;}else MUS.volume=v;}
const musGetVol=()=>MUSG?MUSG.gain.value:(MUS?MUS.volume:0);
const MI={prev:'<svg viewBox="0 0 24 24"><path d="M7 5v14" stroke-width="2.4"/><path d="M19 5.5v13L9 12z" fill="currentColor" stroke="none"/></svg>',
  next:'<svg viewBox="0 0 24 24"><path d="M17 5v14" stroke-width="2.4"/><path d="M5 5.5v13L15 12z" fill="currentColor" stroke="none"/></svg>',
  stop:'<svg viewBox="0 0 24 24"><rect x="6.5" y="6.5" width="11" height="11" rx="2" fill="currentColor" stroke="none"/></svg>'};
const musFmt=x=>isFinite(x)&&x>0?Math.floor(x/60)+':'+String(Math.floor(x%60)).padStart(2,'0'):'0:00';
function musHTML(s){const L=musOf(s);if(!L.length)return '';
  const k=MUSC&&MUSC.id===s.id?MUSC.k:0,m=L[k];
  return `<section class="vp sc-card" id="vp" style="--vpimg:url('${musArt(s,m)}')">
    <div class="vp-main">
      <div class="vp-deck"><div class="vp-disc"><span class="vp-label" style="background-image:url('${musArt(s,m)}')"></span><i class="vp-hole"></i></div><i class="vp-arm"></i></div>
      <div class="vp-side">
        <div class="vp-now">Саундтрек · ${k+1} из ${L.length}</div>
        <b class="vp-t">${esc(m.t)}</b><small class="vp-by">${esc(m.by)}${m.note?' · '+esc(m.note):''}</small>
        <div class="vp-seek"><input type="range" class="vp-range" min="0" max="100" step="0.1" value="0" aria-label="Перемотка трека"><span class="vp-cur">0:00</span><span class="vp-dur">0:00</span></div>
        <div class="vp-ctl"><button data-v="prev" aria-label="Предыдущий трек">${MI.prev}</button><button data-v="pp" class="big" aria-label="Играть или пауза">${SI.play}</button><button data-v="next" aria-label="Следующий трек">${MI.next}</button><button data-v="stop" aria-label="Выключить">${MI.stop}</button></div>
        <label class="vp-vol"><span aria-hidden="true">🔈</span><input type="range" class="vp-vr" min="0" max="1" step="0.05" value="${musVol()}" aria-label="Громкость музыки"><span aria-hidden="true">🔊</span></label>
      </div>
    </div>
    ${L.length>1?`<div class="vp-list">${L.map((x,i)=>`<button class="vp-row" data-k="${i}"><span class="n">${i+1}</span><span class="vt"><b>${esc(x.t)}</b><small>${esc(x.by)}</small></span><span class="eq"><b></b><b></b><b></b></span></button>`).join('')}</div>`:''}
    <label class="vp-auto"><input type="checkbox" id="vpauto" ${store.musAuto===false?'':'checked'}><span>Включать сразу, когда заходишь в сцену</span></label>
  </section>`;}
function musBind(s){const L=musOf(s),box=$('#vp');
  if(!L.length){if(MUS)musStop();return;}
  if(box){box.onclick=e=>{const b=e.target.closest('[data-v],[data-k]');if(!b)return;sfx('tap');
      if(b.dataset.k!=null)return musPlay(s.id,+b.dataset.k);
      const v=b.dataset.v,k=MUSC&&MUSC.id===s.id?MUSC.k:0;
      if(v==='pp'){if(MUS&&MUSC&&MUSC.id===s.id)musToggle();else{MUSOFF=null;musPlay(s.id,k);}}
      if(v==='next')musPlay(s.id,(k+1)%L.length);
      if(v==='prev'){if(MUS&&MUSC&&MUSC.id===s.id&&MUS.currentTime>3){MUS.currentTime=0;musTick();}else musPlay(s.id,(k-1+L.length)%L.length);}
      if(v==='stop'){musStop();MUSOFF=s.id;}};
    const r=box.querySelector('.vp-range');r.oninput=e=>{e.stopPropagation();if(MUS&&isFinite(MUS.duration)){MUS.currentTime=+r.value/100*MUS.duration;musTick();}};r.onclick=e=>e.stopPropagation();
    const vr=box.querySelector('.vp-vr');vr.oninput=e=>{e.stopPropagation();store.musVol=+vr.value;clearInterval(MUSFADE);musSetVol(store.musVol);};vr.onchange=()=>save();vr.onclick=e=>e.stopPropagation();
    const au=$('#vpauto');au.onchange=()=>{store.musAuto=au.checked;save();};au.onclick=e=>e.stopPropagation();}
  // автозапуск при входе в сцену
  if(MUS&&MUSC&&MUSC.id!==s.id)musStop();
  if(!MUS&&store.musAuto!==false&&MUSOFF!==s.id){musPlay(s.id,Math.floor(Math.random()*L.length),true);musFadeIn();}   // 9.2: случайный трек, плавно и тихо
  musUI();}
function musPlay(id,k,rnd){const s=scOf(id),m=musOf(s)[k];if(!m)return;MUSOFF=null;
  if(!MUS){MUS=new Audio();if(MUSIOS)MUS.crossOrigin='anonymous';MUS.preload='auto';MUS.addEventListener('ended',musNext);MUS.addEventListener('play',musUI);MUS.addEventListener('pause',musUI);
    MUS.addEventListener('loadedmetadata',musTick);MUS.addEventListener('error',()=>{if(!MUS||!MUS.getAttribute('src')||!MUSC)return;const L=musOf(scOf(MUSC.id));MUS._err=(MUS._err||0)+1;if(MUS._err<L.length){if(!MUS._quiet)toast('Трек не найден — включаю следующий');musNext();}else{if(!MUS._quiet)toast('Музыка этой сцены пока не загружена');const sid=MUSC.id;musStop();MUSOFF=sid;}});}
  clearInterval(MUSFADE);clearTimeout(MUSWAIT);MUSAUTO=false;MUSC={id,k};MUS._quiet=!!rnd;   // 13.9.16: сама включилась — без тостов «не загружена»
MUS.src=assetUrl(scKey(s,m.f));if(rnd)MUS.addEventListener('loadedmetadata',()=>{try{if(isFinite(MUS.duration)&&MUS.duration>40)MUS.currentTime=MUS.duration*(0.1+Math.random()*0.55);}catch(e){}},{once:true});   // 12.4: автостарт — со случайного места трека
  musGainInit();if(MUSCTX&&MUSCTX.state==='suspended')MUSCTX.resume();musSetVol(musVol());
  const p=MUS.play();if(p&&p.catch)p.catch(()=>musUI());musMeta(s,m);musUI();
  if(!MUSTICK)MUSTICK=setInterval(musTick,250);}
function musNext(){if(!MUS||!MUSC)return;const L=musOf(scOf(MUSC.id));musPlay(MUSC.id,(MUSC.k+1)%L.length);}
function musPrev(){if(!MUS||!MUSC)return;const L=musOf(scOf(MUSC.id));musPlay(MUSC.id,(MUSC.k-1+L.length)%L.length);}
function musToggle(){if(!MUS)return;clearTimeout(MUSWAIT);clearInterval(MUSFADE);MUSAUTO=false;
  if(MUS.paused){if(MUSCTX&&MUSCTX.state==='suspended')MUSCTX.resume();musSetVol(musVol());const p=MUS.play();if(p&&p.catch)p.catch(()=>{});}else MUS.pause();musUI();}
// Уборка: отцепить узлы, усыпить и закрыть контекст — иначе на iPhone при переходах между сценами звук хрипит или пропадает.
function audioFree(){
  try{if(MUSSRC)MUSSRC.disconnect();}catch(e){}try{if(MUSG)MUSG.disconnect();}catch(e){}
  const c=MUSCTX;MUSCTX=null;MUSG=null;MUSSRC=null;
  if(c){try{const p=c.suspend();(p&&p.then?p:Promise.resolve()).then(()=>c.close&&c.close()).catch(()=>{try{c.close();}catch(e){}});}catch(e){try{c.close();}catch(x){}}}
  if(SCLIP){try{clearInterval(SCLIP._t);SCLIP.pause();SCLIP.removeAttribute('src');SCLIP.load();SCLIP.remove();}catch(e){}SCLIP=null;}}
function musStop(){audioFree();clearInterval(MUSFADE);clearTimeout(MUSWAIT);clearInterval(MUSTICK);MUSTICK=0;MUSAUTO=false;
  if(MUS){const a=MUS;MUS=null;try{a.pause();a.removeAttribute('src');a.load();}catch(e){}}MUSC=null;musUI();musTick();}
function musResume(){if(!MUS)return;MUSAUTO=false;const to=musVol();musSetVol(0);const p=MUS.play();if(p&&p.catch)p.catch(()=>{});
  clearInterval(MUSFADE);MUSFADE=setInterval(()=>{if(!MUS){clearInterval(MUSFADE);return;}musSetVol(Math.min(to,musGetVol()+to/12));if(musGetVol()>=to-0.001)clearInterval(MUSFADE);},80);}
// видео эпизода играет — музыка ждёт; видео на паузе больше секунды — музыка плавно возвращается (если играла до видео)
function musDuck(on){if(!MUS||!MUSC)return;clearTimeout(MUSWAIT);clearInterval(MUSFADE);
  if(on){if(!MUS.paused){MUSAUTO='v';MUS.pause();}return;}
  if(MUSAUTO!=='v')return;
  MUSWAIT=setTimeout(()=>{if(!MUS||MUSAUTO!=='v'||(SV&&!SV.paused))return;musResume();},1200);}
function musTick(){const box=$('#vp'),d=MUS?MUS.duration:0,c=MUS?MUS.currentTime:0,w=isFinite(d)&&d>0?(c/d*100):0;
  if(box&&(!MUSC||MUSC.id===SCUR.id)){const r=box.querySelector('.vp-range');if(r&&document.activeElement!==r)r.value=w.toFixed(1);
    box.querySelector('.vp-cur').textContent=musFmt(c);box.querySelector('.vp-dur').textContent=musFmt(d);box.style.setProperty('--vpp',w.toFixed(1)+'%');}
  const di=document.querySelector('#mudock .mu-bar i');if(di)di.style.width=w.toFixed(1)+'%';
  if(!MUS&&MUSTICK){clearInterval(MUSTICK);MUSTICK=0;}}
function musMeta(s,m){try{if('mediaSession' in navigator&&window.MediaMetadata){
  navigator.mediaSession.metadata=new MediaMetadata({title:m.t,artist:m.by,album:s.title,artwork:[{src:musArt(s,m),sizes:'420x620',type:'image/jpeg'}]});
  navigator.mediaSession.setActionHandler('play',musToggle);navigator.mediaSession.setActionHandler('pause',musToggle);
  navigator.mediaSession.setActionHandler('nexttrack',musNext);navigator.mediaSession.setActionHandler('previoustrack',musPrev);}}catch(e){}}
// проигрыватель на странице сцены + плашка на экранах эпизода и заданий
function musUI(){
  const ov=!!document.querySelector('#vp');
  // переходы между экранами сцены: ушёл с пластинки — пауза, вернулся — играет дальше
  if(MUS&&MUSC){if(MUSOV&&!ov&&!MUS.paused){MUSAUTO='n';MUS.pause();}
    else if(!MUSOV&&ov&&MUSAUTO==='n'&&MUSC.id===SCUR.id)musResume();}
  MUSOV=ov;
  const on=!!(MUS&&MUSC),play=on&&!MUS.paused,box=$('#vp');
  if(box){const s=scOf(SCUR.id),L=musOf(s),k=on&&MUSC.id===s.id?MUSC.k:0,m=L[k];
    box.classList.toggle('playing',play&&MUSC.id===s.id);box.classList.toggle('idle',!on);
    if(box.dataset.k!==String(k)&&m){box.dataset.k=k;box.style.setProperty('--vpimg',`url('${musArt(s,m)}')`);box.querySelector('.vp-label').style.backgroundImage=`url('${musArt(s,m)}')`;
      box.querySelector('.vp-t').textContent=m.t;box.querySelector('.vp-by').textContent=m.by+(m.note?' · '+m.note:'');box.querySelector('.vp-now').textContent=`Саундтрек · ${k+1} из ${L.length}`;}
    box.querySelector('[data-v=pp]').innerHTML=play?SI.pause:SI.play;
    box.querySelectorAll('.vp-row').forEach(r=>{r.classList.toggle('cur',on&&+r.dataset.k===k);r.classList.toggle('playing',play&&+r.dataset.k===k);});}
  let d=document.getElementById('mudock');
  const show=on&&!!document.querySelector('.scn')&&!ov;
  if(!show){if(d)d.remove();document.body.classList.remove('mus-on');return;}
  const s=scOf(MUSC.id),m=musOf(s)[MUSC.k];
  if(!d){d=document.createElement('div');d.id='mudock';document.body.appendChild(d);
    d.onclick=e=>{const b=e.target.closest('[data-m]');e.stopPropagation();if(!b){sfx('tap');musSheet();return;}sfx('tap');if(b.dataset.m==='pp')musToggle();else{const id=MUSC&&MUSC.id;musStop();MUSOFF=id;}};}
  // 9.1: на ПК плашка музыки живёт в шапке экрана (рядом с заданием), а не висит отдельно внизу
  {const hd=window.innerWidth>=1000&&document.querySelector('.scn > .sc-head');if(hd){if(d.parentNode!==hd){hd.appendChild(d);}d.classList.add('inhead');}
    else{if(d.parentNode!==document.body)document.body.appendChild(d);d.classList.remove('inhead');}}
  const key=MUSC.id+':'+MUSC.k;
  if(d.dataset.key!==key){d.dataset.key=key;d.innerHTML=`<span class="mu-art" style="background-image:url('${musArt(s,m)}')"></span><span class="mu-t"><b>${esc(m.t)}</b><small>${esc(m.by)}</small><span class="mu-bar"><i></i></span></span><button data-m="pp" aria-label="Играть или пауза"></button><button data-m="x" aria-label="Выключить музыку">${ui('close')}</button>`;}
  d.querySelector('[data-m=pp]').innerHTML=play?SI.pause:SI.play;d.classList.toggle('playing',play);document.body.classList.add('mus-on');}

/* ================= 7.0: поиск по всему приложению ================= */
// Один поиск: реплики и фразы всех сцен (сразу на русском, английском и немецком) с переходом к моменту,
// сцены и сериалы, слова из игр. Индекс строится в браузере один раз при первом поиске.
const srNorm=s=>String(s||'').toLowerCase().replace(/ё/g,'е').replace(/[’‘`´]/g,"'").replace(/ä/g,'a').replace(/ö/g,'o').replace(/ü/g,'u').replace(/ß/g,'ss').replace(/[^\p{L}\p{N}' ]+/gu,' ').replace(/\s+/g,' ').trim();
let SRIDX=null;
function srIndex(){if(SRIDX)return SRIDX;const I=[];
  for(const s of SCENES){
    I.push({k:'scene',s,txt:srNorm([s.title,s.sub,s.ep,s.show,s.lvlWhy,s.useWhy].join(' '))});
    s.parts.forEach((p,pi)=>p.ph.forEach(f=>I.push({k:'ph',s,pi,f,t:f.a,txt:srNorm([f.en,f.ru,f.de,f.note].join(' '))})));
    for(const r of s.subs){const pi=s.parts.findIndex(p=>r[0]>=p.a-0.2&&r[0]<p.b);if(pi<0)continue;I.push({k:'line',s,pi,r,t:r[0],txt:srNorm(r.slice(2).join(' '))});}}
  return SRIDX=I;}
const srTime=x=>{const s=Math.max(0,Math.round(x));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');};
function srMark(text,q){const t=esc(text);if(!q)return t;const words=q.split(' ').filter(w=>w.length>1);if(!words.length)return t;
  // подсветка без учёта регистра и ё/е — по исходному тексту
  let out=t;for(const w of words){const re=new RegExp('('+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/е/g,'[её]').replace(/a/g,'[aä]').replace(/o/g,'[oö]').replace(/u/g,'[uü]')+')','gi');out=out.replace(re,'<mark>$1</mark>');}return out;}
const SR_CATS=[['all','Всё'],['ph','Фразы'],['line','Реплики'],['scene','Сцены'],['word','Слова']];
function renderSearch(q0){screen='search';backBtn(true);
  const cat=store.srCat||'all',recent=(store.srRecent||[]).slice(0,6),sugg=['перейдём к делу','успокойся','let me guess','fuck','Befehl','как дела'];
  mount(`<div class="page-head"><button class="icon-btn" id="bBtn" aria-label="Назад">${ui('back')}</button><h1 class="title">Поиск</h1></div>
    <div class="sr-box">${ui('search')}<input id="srq" type="search" enterkeyhint="search" autocomplete="off" placeholder="Фраза, слово, фильм — на любом языке" value="${esc(q0||'')}"><button id="srx" aria-label="Очистить">${ui('close')}</button></div>
    <div class="sr-cats">${SR_CATS.map(([k,l])=>`<button data-c="${k}" class="${cat===k?'on':''}">${l}</button>`).join('')}</div>
    <div id="srres"></div>`,'srscr');
  const inp=$('#srq'),res=$('#srres');let tm=0;
  const empty=()=>`<div class="sr-hint">${recent.length?`<b>Недавние</b><div class="sr-chips">${recent.map(x=>`<button data-q="${esc(x)}">${esc(x)}</button>`).join('')}</div>`:''}
    <b>Попробуй</b><div class="sr-chips">${sugg.map(x=>`<button data-q="${esc(x)}">${esc(x)}</button>`).join('')}</div>
    <p>Ищет сразу по русскому, английскому и немецкому: реплики и фразы всех сцен, сами сцены и слова из игр. Нажми на реплику — откроется этот момент в фильме.</p></div>`;
  const run=()=>{const q=srNorm(inp.value);if(q.length<2){res.innerHTML=empty();bindChips();return;}
    const words=q.split(' ');const hit=x=>words.every(w=>x.txt.includes(w));
    const vis=x=>!x.s||flagOf('scene-'+x.s.id)!=='hide';
    let L=srIndex().filter(x=>vis(x)&&hit(x)&&(cat==='all'||x.k===cat));
    // фразы и сцены выше реплик; внутри — короче = точнее
    // реплика, совпадающая с фразой той же сцены (±1 с), — не дублируем
    const phk=new Set(L.filter(x=>x.k==='ph').flatMap(x=>[-1,0,1].map(d=>x.s.id+'|'+(Math.round(x.t)+d))));L=L.filter(x=>x.k!=='line'||!phk.has(x.s.id+'|'+Math.round(x.t)));
    const rank={scene:0,ph:1,line:2,word:3};L.sort((a,b)=>rank[a.k]-rank[b.k]||a.txt.length-b.txt.length);
    const total=L.length;L=L.slice(0,80);
    const de=x=>x.s&&x.s.lang==='de';
    const row=x=>{
      if(x.k==='scene')return `<button class="sr-it sc" data-sc="${x.s.id}"><span class="sr-k">Сцена</span><b>${srMark(x.s.title,q)}</b><small>${srMark(x.s.sub||'',q)} · ${esc(x.s.ep||'')}</small></button>`;
      if(x.k==='ph'){const o=de(x)?x.f.de:x.f.en;return `<button class="sr-it" data-s="${x.s.id}" data-i="${x.pi}" data-t="${x.t}"><span class="sr-k ph">Фраза</span><b>${srMark(o,q)}</b><small>${srMark(x.f.ru,q)}</small><em>▶ ${esc(x.s.title)} · эп. ${x.pi+1} · ${srTime(x.t-x.s.parts[x.pi].a)}</em></button>`;}
      if(x.k==='line'){const o=de(x)?x.r[4]:x.r[2];return `<button class="sr-it" data-s="${x.s.id}" data-i="${x.pi}" data-t="${x.t}"><span class="sr-k">Реплика</span><b>${srMark(o,q)}</b><small>${srMark(String(x.r[3]).replace(/\n/g,' '),q)}</small><em>▶ ${esc(x.s.title)} · эп. ${x.pi+1} · ${srTime(x.t-x.s.parts[x.pi].a)}</em></button>`;}
      return `<div class="sr-it wd"><span class="sr-k">Слово</span><b>${srMark(x.w.en,q)} · ${srMark(x.w.de,q)}</b><small>${srMark(x.w.ru,q)}</small></div>`;};
    res.innerHTML=total?`<div class="sr-n">${total>80?'Первые 80 из '+total:total+' '+plural(total,['результат','результата','результатов'])}</div>${L.map(row).join('')}`:`<div class="sr-hint"><p>Ничего не нашлось. Попробуй короче или на другом языке.</p></div>`;
    $$('#srres .sr-it[data-s]').forEach(b=>b.onclick=()=>{srSave(inp.value);srOpen(b.dataset.s,+b.dataset.i,+b.dataset.t);});
    $$('#srres .sr-it[data-sc]').forEach(b=>b.onclick=()=>{srSave(inp.value);renderScene(b.dataset.sc);});};
  const bindChips=()=>$$('#srres [data-q]').forEach(b=>b.onclick=()=>{inp.value=b.dataset.q;sfx('tap');run();});
  inp.oninput=()=>{clearTimeout(tm);tm=setTimeout(run,120);};
  inp.onkeydown=e=>{if(e.key==='Enter'){srSave(inp.value);inp.blur();}};
  $('#srx').onclick=()=>{inp.value='';run();inp.focus();};
  $$('.sr-cats button').forEach(b=>b.onclick=()=>{store.srCat=b.dataset.c;save();sfx('sel');$$('.sr-cats button').forEach(x=>x.classList.toggle('on',x===b));renderSearch(inp.value);});
  $('#bBtn').onclick=()=>{sfx('tap');renderTab(store.tab||'learn');};
  run();setTimeout(()=>{try{inp.focus();}catch(e){}},250);}
function srSave(v){v=String(v||'').trim();if(v.length<2)return;store.srRecent=[v,...(store.srRecent||[]).filter(x=>x!==v)].slice(0,8);save();}
// открыть эпизод сразу на нужной секунде
// 12.1: момент из сцены — поверх текущего экрана, без перехода: мини-плеер играет ровно эту реплику, слово подсвечено.
// «Открыть эпизод» — отдельно, если хочется смотреть дальше.
function momOpen(sid,pi,t,word){const s=scOf(sid),p=s&&s.parts[pi];if(!p){toast('Сцена не найдена');return;}
  const rows=s.subs.filter(r=>r[1]>p.a&&r[0]<p.b);let r=rows.reduce((m,x)=>!m||Math.abs(x[0]-t)<Math.abs(m[0]-t)?x:m,null)||[t,t+3,'',''];
  const a=Math.max(0,r[0]-p.a-0.15),b=r[1]-p.a+0.25,de=s.lang==='de';
  const hl=x=>word?markWord(x||'',String(word),'<mark>','</mark>'):esc(x||'');
  const o=document.createElement('div');o.className='dxo momo';
  o.innerHTML=`<div class="dxo-dim"></div><div class="dxc" style="--c:${DX_TH[s.theme]||'#F5C451'}">
    <div class="dxv-w"><video class="dxv" playsinline webkit-playsinline preload="auto" poster="${assetUrl(scEpKey(s,pi,'jpg'))}"></video><button class="dxv-p" aria-label="Играть">${SI.play}</button></div>
    <div class="dxc-b"><div class="dxc-top"><span class="dxc-src">${esc(dictFilm(s))} · ${esc(s.sub||'')} · эп. ${pi+1}</span><button class="dxc-x" aria-label="Закрыть">${ui('close')}</button></div>
      <b class="ep-c-en mom-en">${momLine(s,de?r[4]:r[2],word)}</b><span class="ep-c-ru">${esc(String(r[3]||'').replace(/\n/g,' '))}</span>
      <div class="dxc-acts"><button data-v="re">${SI.play} Ещё раз</button><button data-v="slow">🐢 Медленнее</button><button data-v="ep">Открыть эпизод →</button></div></div></div>`;
  document.body.appendChild(o);document.body.classList.add('dx-open');
  const card=o.querySelector('.dxc');card.animate([{transform:'translateY(18px) scale(.97)',opacity:0},{transform:'none',opacity:1}],{duration:260,easing:'cubic-bezier(.2,.9,.3,1)'});
  o.querySelector('.dxo-dim').animate([{opacity:0},{opacity:1}],{duration:220});
  const v=o.querySelector('.dxv'),pb=o.querySelector('.dxv-p');
  const play=slow=>{v.playbackRate=slow?.75:1;try{if(Math.abs(v.currentTime-a)>0.05)v.currentTime=a;}catch(e){}const pr=v.play();if(pr&&pr.catch)pr.catch(()=>{pb.hidden=false;});pb.hidden=true;};
  v.src=assetUrl(scEpKey(s,pi,'mp4'))+'#t='+a.toFixed(2);v.volume=store.scVol==null?1:store.scVol;try{musDuck(true);}catch(e){}
  v.addEventListener('timeupdate',()=>{if(v.currentTime>=b){v.pause();pb.hidden=false;}});
  v.addEventListener('loadedmetadata',()=>{if(v.currentTime<a-0.1||v.currentTime>b)v.currentTime=a;},{once:true});
  play(false);pb.onclick=()=>{sfx('tap');play(false);};
  const close=()=>{if(o._c)return;o._c=true;v.pause();v.removeAttribute('src');try{v.load();}catch(e){}try{musDuck(false);}catch(e){}document.body.classList.remove('dx-open');kwHide(0);document.removeEventListener('keydown',k);
    card.animate([{opacity:1},{opacity:0,transform:'scale(.96)'}],{duration:160,fill:'forwards'});o.querySelector('.dxo-dim').animate([{opacity:1},{opacity:0}],{duration:180,fill:'forwards'}).onfinish=()=>o.remove();};
  const k=e=>{if(e.key==='Escape')close();};document.addEventListener('keydown',k);
  o.querySelector('.dxo-dim').onclick=close;o.querySelector('.dxc-x').onclick=()=>{sfx('tap');close();};
  o.querySelectorAll('[data-v]').forEach(x=>x.onclick=()=>{sfx('tap');if(x.dataset.v==='ep'){close();setTimeout(()=>srOpen(sid,pi,t),200);return;}play(x.dataset.v==='slow');});
  o.querySelectorAll('.mom-en .sw').forEach(el=>el.onclick=e=>{e.stopPropagation();sfx('tap');momWord(el,s,pi,r);});}
// 13.8.2: строка реплики словами — каждое слово нажимается; искомое подсвечено, уже сохранённые — со звёздочкой
function momLine(s,txt,word){const w0=word?swNorm(word):'';return swWrap(String(txt||'').replace(/\n/g,' ')).replace(/<i class="sw">([^<]+)<\/i>/g,(m,w)=>{const n=swNorm(w.replace(/&#39;/g,"'"));return `<i class="sw${w0&&n===w0?' mk':''}${mywHas(s.id,n)?' my':''}">${w}</i>`;});}
function momWord(el,s,pi,row){const w=el.textContent,hit=swFind(s.id,pi,w),de=s.lang==='de';
  const html=`<span class="kwp-k">Слово</span><b class="kwp-w">${esc(swNorm(w))}</b><span class="kwp-t">${hit?esc(hit.ru):'в словарике нет — смотри перевод реплики'}</span>
    ${row?`<div class="kwp-ex"><em>Вся реплика</em><b>${esc(String(row[de?4:2]||'').replace(/\n/g,' '))}</b><small>${esc(String(row[3]||'').replace(/\n/g,' '))}</small></div>`:''}`;
  popAt(el,html,{sid:s.id,word:swNorm(w),w2:hit&&hit.w,ru:hit?hit.ru:'',row,pi,wi:1},true);
  const b=KWP&&KWP.querySelector('[data-x="save"]');if(b)b.addEventListener('click',()=>setTimeout(()=>el.classList.toggle('my',mywHas(s.id,swNorm(w))),0));}
// 12.1: откуда пришли в эпизод (словарь на своём уровне / поиск / вкладка) — «‹» и системная «назад» вернут туда же
let NAV_BACK=null;
function navHere(){if(document.querySelector('#dlRoot')&&window.DL){const d=Object.assign({},DX),s=Object.assign({},DL.S),my=DL.KN&&DL.KN.my?JSON.parse(JSON.stringify(DL.KN.my)):null,y=window.scrollY;   // 13.9.13: словарь — на тот же уровень (фильм / сцена / «Мои»)
    return ()=>{Object.assign(DX,d);Object.assign(DL.S,s);if(my&&DL.KN&&DL.KN.my)Object.assign(DL.KN.my,my);renderTab('dict');setTimeout(()=>window.scrollTo(0,y),80);};}
  if(screen==='search'){const q=($('#srq')||{}).value||'';return ()=>renderSearch(q);}
  if(screen==='home'){const t=store.tab;return ()=>renderTab(t);}return null;}
function navBack(){ND_BACK=Date.now();const f=NAV_BACK;NAV_BACK=null;if(!f)return false;sfx('tap');f();return true;}
// 12.1: слово/фраза → момент в эпизоде. Тот же эпизод уже открыт — только перемотка (без нового <video> и мигания);
// иначе эпизод открывается сразу с нужного места
function srOpen(id,i,t){const s=scOf(id);if(!s||!s.parts[i])return;const off=Math.max(0,t-s.parts[i].a-0.4);
  if(SV&&SCUR&&SCUR.id===id&&SCUR.i===i&&document.querySelector('.scn.scep')){try{SV.currentTime=off;scTick&&scTick();}catch(e){}const o=$('#scvo');if(o)o.style.display='none';const pr=SV.play();if(pr&&pr.catch)pr.catch(()=>{if(o)o.style.display='';});window.scrollTo({top:0,behavior:'smooth'});return;}
  const back=navHere();renderScEp(id,i,{free:true,at:off});if(!SV||SCUR.id!==id)return;NAV_BACK=back;}

document.addEventListener('visibilitychange',()=>{try{if(document.hidden){if(typeof AC!=='undefined'&&AC&&AC.suspend)AC.suspend();}else if(typeof AC!=='undefined'&&AC&&AC.resume)AC.resume();}catch(e){}});
/* =====================================================================================
   13.2 — ЭФФЕКТЫ И МАГАЗИН
   • Частицы — на одном canvas поверх всего (fxEmit / fxAt / fxRain). Canvas и летящие билеты/карты живут в <html>, а не в
     <body>: у body на больших мониторах бывает zoom, и координаты уезжали бы.
   • Пружины — SPRING: настоящая кривая linear() (iOS 17.2+, Chrome 113+), иначе cubic-bezier с перелётом.
   • Полёт по дуге — fxArc (кадры по параболе). Всё на transform/opacity — без дёрганий на iPhone.
   • «Магазин» (renderShop): стиль эффектов, вид карт словаря, заставка, звуки, музыка на Главной — за билеты (store.gold).
     store.shop={own:{'fx:neon':время,…},use:{fx,cs,sp,snd,hm}}; own сливается между устройствами (storeMerge).
   ===================================================================================== */
const EZ={out:'cubic-bezier(.16,1,.3,1)',in:'cubic-bezier(.7,0,.84,0)',io:'cubic-bezier(.65,0,.35,1)',back:'cubic-bezier(.34,1.56,.64,1)'};
const SPRING=(()=>{try{if(window.CSS&&CSS.supports&&CSS.supports('animation-timing-function','linear(0, 1)')){const p=[];for(let i=0;i<=48;i++){const t=i/48;p.push((1-Math.exp(-5.2*t)*Math.cos(9.5*t)).toFixed(4));}p[p.length-1]='1';return 'linear('+p.join(',')+')';}}catch(e){}return EZ.back;})();
const fxOK=()=>store.fx!==false;
// 13.9.33 (P0.2, Андрей: «анимаций нет»): «меньше движения» в системе (Windows — «Эффекты анимации» выкл. или «Наилучшее быстродействие»; iPhone — «Уменьшение движения»)
// раньше гасило ВСЕ анимации. Теперь гасим только большое движение: долгие (> 0,9 с) и бесконечные CSS-анимации (наезды, плывущий туман…), частицы, конфетти, полёты.
// Появление, смена цвета и отклик на нажатие остаются. Главный выключатель — «Анимации» в Настройках (body.nofx).
const RMQ=(()=>{try{return matchMedia('(prefers-reduced-motion: reduce)');}catch(e){return null;}})();
const rmOn=()=>!!(RMQ&&RMQ.matches);
const fxBig=()=>fxOK()&&!rmOn();
document.addEventListener('animationstart',e=>{if(!rmOn())return;const t=e.target;if(!t||!t.getAnimations)return;const pe=e.pseudoElement||'';
  try{t.getAnimations({subtree:true}).forEach(a=>{const ef=a.effect;if(a.animationName!==e.animationName||!ef||ef.target!==t||(ef.pseudoElement||'')!==pe)return;const tm=ef.getTiming();
    if(tm.iterations===Infinity||(+tm.duration||0)>900)a.cancel();});}catch(_){}},true);
// ==== 13.9.33 (P0.2) — движение «Нового» в одном месте (раздел макета «Как всё будет двигаться») ====
// шторки и окна растут из точки нажатия; экраны: вкладки — вбок по порядку, вглубь — справа, назад — слева; списки — каскадом (≤ 8, шаг 70 мс).
// Только transform/opacity (правило 13.9.23). «Меньше движения» — короче и без сдвигов больше 8 px; «Анимации» выкл. — ничего.
const ND_TAP={x:0,y:0,t:0};let ND_PREV=null,ND_BACK=0;
document.addEventListener('pointerdown',e=>{ND_TAP.x=e.clientX;ND_TAP.y=e.clientY;ND_TAP.t=Date.now();},true);
const ndMo=()=>fxOK()&&!!document.body&&document.body.classList.contains('nd');
function ndGrow(box){if(!box||!box.animate||!ndMo())return;const r=box.getBoundingClientRect();if(!r.width)return;
  const fresh=Date.now()-ND_TAP.t<1500,big=!rmOn(),dx=fresh?(ND_TAP.x-(r.left+r.width/2))*.45:0,dy=fresh?(ND_TAP.y-(r.top+r.height/2))*.45:28;
  try{box.animate([{transform:big?`translate(${dx}px,${dy}px) scale(.84)`:'translateY(8px)',opacity:0},{transform:'none',opacity:1}],{duration:big?360:180,easing:big?SPRING:'ease-out'});}catch(e){}}
const ND_GROW=[['sc-sheetwrap',w=>w.firstElementChild],['pfv',w=>w.querySelector('.pfv-box')],['pwa',w=>w.firstElementChild],['modal',w=>w.querySelector('.card')||w.firstElementChild]];
function ndGrowWatch(){try{new MutationObserver(M=>{if(!ndMo())return;for(const m of M)for(const n of m.addedNodes){if(n.nodeType!==1)continue;const g=ND_GROW.find(x=>n.classList.contains(x[0]));if(g)ndGrow(g[1](n));}}).observe(document.body,{childList:true});}catch(e){}}
if(document.body)ndGrowWatch();else document.addEventListener('DOMContentLoaded',ndGrowWatch);
const ND_TABI=['learn','kino','dict','profile'],ND_CASC='.n-row,.kposter,.pn,.ndl,.ndrow,.checkrow,.ad2-it,.ss-card,.kv-row';
function ndCascade(root){if(!root)return;const L=[...root.querySelectorAll(ND_CASC)].filter(e=>!e.getAnimations().length&&e.getBoundingClientRect().top<innerHeight).slice(0,8),big=!rmOn();
  L.forEach((e,i)=>{try{e.animate([{transform:`translateY(${big?14:6}px)`,opacity:0},{transform:'none',opacity:1}],{duration:big?380:180,delay:i*70,easing:big?SPRING:'ease-out',fill:'backwards'});}catch(_){}});}
function ndScreenIn(cls){const tab=/\btabscr\b/.test(cls||''),key=(cls||'')+'|'+screen+'|'+(document.body.dataset.scr||'')+'|'+(tab?store.tab:''),cur={tab,t:tab?store.tab:null,key};
  const p=ND_PREV,back=Date.now()-ND_BACK<900;ND_PREV=cur;ND_BACK=0;if(!p||p.key===key||!ndMo())return;const el=app.firstElementChild;if(!el||!el.animate)return;
  let x;if(tab&&p.tab){const a=ND_TABI.indexOf(p.t),b=ND_TABI.indexOf(cur.t);x=b>=a?28:-28;}else x=back||(tab&&!p.tab)?-28:28;
  if(rmOn())x=Math.sign(x)*8;
  const vid=/\bscnscr\b/.test(cls||'')&&['scep','dircut'].includes(document.body.dataset.scr);   // .screen с видео — только прозрачность (transform ломает полный экран)
  try{el.animate(vid?[{opacity:0},{opacity:1}]:[{transform:`translateX(${x}px)`,opacity:0},{transform:'none',opacity:1}],{duration:240,easing:'cubic-bezier(.2,.8,.2,1)'});}catch(e){}
  ndCascade(el);}
const FXROOT=()=>document.documentElement;
// стили частиц (покупаются в магазине, «Кино» — бесплатно)
const FX_PACKS={
  cine:{c:['#FFE7A8','#F5C451','#E9C46A','#FFF6DC'],sh:['spark','frame','dot'],e:'🎞'},
  noir:{c:['#FFFFFF','#D6D6D6','#9A9A9A','#E63946'],sh:['dot','spark','dust'],e:'🌫'},
  neon:{c:['#FF3DA5','#2DE2E6','#B4FF39','#FFD1F0'],sh:['spark','dot','ring'],e:'💡'},
  fire:{c:['#FF7A1A','#FFB347','#FFE08A','#FF3B2F'],sh:['ember','spark','ember'],e:'🔥'},
  money:{c:['#7BD88F','#3FAE5A','#A8E6A1','#F5C451'],sh:['bill','bill','dot'],e:'💵'},
  holo:{c:['#FF7AD9','#7AF0FF','#B8A6FF','#FFF27A','#7DFFB0'],sh:['shard','star','dot'],e:'💎'}
};
const fxPack=()=>FX_PACKS[shopUse('fx')]||FX_PACKS.cine;
const FX={cv:null,cx:null,ps:[],on:false,dpr:1,spr:{},last:0};
function fxCv(){if(FX.cv&&FX.cv.isConnected)return FX.cx;const c=document.createElement('canvas');c.className='fxcv';c.setAttribute('aria-hidden','true');FXROOT().appendChild(c);FX.cv=c;FX.cx=c.getContext('2d');fxFit();return FX.cx;}
function fxFit(){const c=FX.cv;if(!c)return;FX.dpr=Math.min(2,window.devicePixelRatio||1);c.width=Math.round(innerWidth*FX.dpr);c.height=Math.round(innerHeight*FX.dpr);}
window.addEventListener('resize',fxFit);
// светящаяся точка — заранее нарисованный спрайт: рисовать его в сто раз дешевле, чем shadowBlur
function fxSpr(col){if(FX.spr[col])return FX.spr[col];const s=document.createElement('canvas');s.width=s.height=64;const g=s.getContext('2d'),r=g.createRadialGradient(32,32,0,32,32,32);
  r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.2,col);r.addColorStop(.55,col+'44');r.addColorStop(1,col+'00');g.fillStyle=r;g.fillRect(0,0,64,64);return FX.spr[col]=s;}
// o: n — сколько, v — скорость, a/spread — направление и разброс (радианы), g — тяжесть, life — кадров жизни, s — размер, sh — форма, pack — стиль, jx/jy — разброс точки старта
function fxEmit(x,y,o){if(!fxBig())return;o=o||{};const P=(o.pack&&FX_PACKS[o.pack])||fxPack(),n=Math.max(1,Math.round((o.n||16)*(innerWidth<500?.8:1)));fxCv();
  for(let i=0;i<n;i++){const a=(o.a!=null?o.a:-Math.PI/2)+(Math.random()-.5)*(o.spread!=null?o.spread:Math.PI*2),v=(o.v!=null?o.v:5)*(.4+Math.random()*.85),sh=o.sh||P.sh[Math.floor(Math.random()*P.sh.length)];
    FX.ps.push({x:x+(o.jx||0)*(Math.random()-.5),y:y+(o.jy||0)*(Math.random()-.5),vx:Math.cos(a)*v,vy:Math.sin(a)*v,
      g:o.g!=null?o.g:(sh==='ember'||sh==='dust'?-.035:sh==='bill'?.05:.13),dr:o.dr||(sh==='bill'?.97:.982),r:Math.random()*6.28,vr:(Math.random()-.5)*(sh==='bill'?.12:.3),
      s:(o.s||1)*(.65+Math.random()*.7),t:0,max:(o.life||(sh==='bill'?110:sh==='dust'?90:58))*(.7+Math.random()*.6),sh,col:P.c[Math.floor(Math.random()*P.c.length)],h:Math.random()*360,w:Math.random()*6.28});}
  if(FX.ps.length>260)FX.ps.splice(0,FX.ps.length-260);
  if(!FX.on){FX.on=true;FX.last=performance.now();requestAnimationFrame(fxTick);}}
function fxTick(now){const c=FX.cx;if(!c||!FX.cv.isConnected){FX.on=false;FX.ps.length=0;return;}
  const k=Math.max(.25,Math.min(3,(now-FX.last)/16.67||1)),d=FX.dpr;FX.last=now;   // 120 Гц на iPhone — та же скорость, что и 60
  c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,FX.cv.width,FX.cv.height);c.setTransform(d,0,0,d,0,0);
  for(let i=FX.ps.length-1;i>=0;i--){const p=FX.ps[i];p.t+=k;if(p.t>=p.max){FX.ps.splice(i,1);continue;}
    const dr=Math.pow(p.dr,k);p.vx*=dr;p.vy=p.vy*dr+p.g*k;if(p.sh==='bill'||p.sh==='dust')p.vx+=Math.sin(p.t*.07+p.w)*.06*k;
    p.x+=p.vx*k;p.y+=p.vy*k;p.r+=p.vr*k;const q=p.t/p.max;fxDraw(c,p,q<.12?q/.12:q>.6?1-(q-.6)/.4:1);}
  if(FX.ps.length)requestAnimationFrame(fxTick);else{c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,FX.cv.width,FX.cv.height);FX.on=false;}}
function fxDraw(c,p,al){c.save();c.globalAlpha=Math.max(0,Math.min(1,al));c.translate(p.x,p.y);const s=p.s;
  switch(p.sh){
    case 'dot':case 'ember':case 'dust':{c.globalCompositeOperation=p.sh==='dust'?'source-over':'lighter';const z=(p.sh==='dust'?7:p.sh==='ember'?8:10)*s*(p.sh==='ember'?.75+.25*Math.sin(p.t*.6+p.w):1);c.drawImage(fxSpr(p.col),-z,-z,z*2,z*2);break;}
    case 'spark':{c.globalCompositeOperation='lighter';c.rotate(Math.atan2(p.vy,p.vx));const L=Math.min(26,3+Math.hypot(p.vx,p.vy)*3.2)*s,gr=c.createLinearGradient(-L,0,0,0);
      gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(1,p.col);c.strokeStyle=gr;c.lineWidth=2.2*s;c.lineCap='round';c.beginPath();c.moveTo(-L,0);c.lineTo(0,0);c.stroke();break;}
    case 'star':{c.globalCompositeOperation='lighter';c.rotate(p.r);c.fillStyle=p.col;const z=5*s;c.beginPath();for(let j=0;j<4;j++){c.lineTo(0,-z*2.2);c.rotate(Math.PI/4);c.lineTo(0,-z*.5);c.rotate(Math.PI/4);}c.closePath();c.fill();break;}
    case 'shard':{c.rotate(p.r);c.fillStyle=`hsl(${(p.h+p.t*5)%360},95%,74%)`;c.beginPath();c.moveTo(0,-7*s);c.lineTo(5*s,5*s);c.lineTo(-5*s,4*s);c.closePath();c.fill();break;}
    case 'frame':{c.rotate(p.r);c.scale(1,Math.cos(p.t*.14+p.w));c.strokeStyle=p.col;c.lineWidth=1.5;c.strokeRect(-7*s,-5*s,14*s,10*s);c.fillStyle=p.col;for(let j=-1;j<=1;j++){c.fillRect(-10*s,j*3.2*s-1,2,2);c.fillRect(8*s,j*3.2*s-1,2,2);}break;}
    case 'bill':{c.rotate(p.r);c.scale(Math.cos(p.t*.1+p.w),1);c.fillStyle=p.col;c.fillRect(-10*s,-5*s,20*s,10*s);c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=1;c.strokeRect(-8*s,-3.5*s,16*s,7*s);c.beginPath();c.arc(0,0,2.4*s,0,6.29);c.stroke();break;}
    case 'ring':{c.globalCompositeOperation='lighter';c.strokeStyle=p.col;c.lineWidth=2*s;c.beginPath();c.arc(0,0,(2+p.t*.9)*s,0,6.29);c.stroke();break;}
  }c.restore();}
function fxAt(el,o){if(!el||!fxOK())return;const r=el.getBoundingClientRect();if(!r.width&&!r.height)return;fxEmit(r.left+r.width/2,r.top+r.height/2,o);}
function fxRain(n,o){if(!fxBig())return;o=o||{};for(let i=0;i<(n||40);i++)setTimeout(()=>fxEmit(Math.random()*innerWidth,-12,{n:1,a:Math.PI/2,spread:.7,v:2+Math.random()*3,g:.05,life:170,s:1.15,pack:o.pack}),i*30);}
// полёт DOM-элемента по дуге: элемент position:fixed, left/top 0 — всё в transform
function fxArc(el,x0,y0,x1,y1,o){o=o||{};if(rmOn())o=Object.assign({},o,{d:1,delay:0});const N=16,kf=[],lift=o.lift!=null?o.lift:-Math.min(160,Math.abs(x1-x0)*.4+60),s0=o.s0!=null?o.s0:1,s1=o.s1!=null?o.s1:.4;
  for(let i=0;i<=N;i++){const t=i/N,x=x0+(x1-x0)*t,y=y0+(y1-y0)*t+lift*4*t*(1-t);kf.push({transform:`translate(${x}px,${y}px) translate(-50%,-50%) scale(${s0+(s1-s0)*t}) rotate(${(o.rot||0)*t}deg)`,opacity:o.fade&&t>.8?1-(t-.8)/.2:1});}
  return el.animate(kf,{duration:o.d||720,delay:o.delay||0,easing:o.ez||'cubic-bezier(.5,0,.3,1)',fill:'forwards'});}
// верный ответ: искры + мягкое кольцо вокруг кнопки
function fxGood(el){if(!el||!fxOK())return;fxAt(el,{n:16,v:4.6,life:42});try{el.animate([{boxShadow:'0 0 0 0 rgba(245,196,81,.55)'},{boxShadow:'0 0 0 14px rgba(245,196,81,0)'}],{duration:620,easing:EZ.out});}catch(e){}}
// карта-награда вылетает из глубины, вспышка и полоса света по фольге
function fxCardIn(inn,delay){if(!inn||!fxOK())return;delay=delay||0;
  inn.animate([{transform:'translateY(80px) rotateY(-220deg) scale(.5)',opacity:0},{transform:'translateY(-6px) rotateY(12deg) scale(1.04)',opacity:1,offset:.66},{transform:'none',opacity:1}],{duration:1150,delay,easing:'cubic-bezier(.2,.9,.3,1)',fill:'backwards'});
  setTimeout(()=>{fxAt(inn,{n:34,v:7.5});const sw=document.createElement('i');sw.className='fx-sweep';inn.appendChild(sw);sw.animate([{transform:'translateX(-130%) skewX(-18deg)'},{transform:'translateX(230%) skewX(-18deg)'}],{duration:950,easing:EZ.io}).onfinish=()=>sw.remove();},delay+760);}

/* ---- билеты: «+N» и билетики летят в счётчик, счётчик пересчитывается по мере прилёта ---- */
function fxCounter(){const H=innerHeight;let el=[...document.querySelectorAll('.thead .gold,#goldHud,#shopBal')].find(e=>{const r=e.getBoundingClientRect();return r.width&&r.top>=0&&r.bottom<=H;});let tmp=null;
  if(!el){tmp=document.createElement('div');tmp.className='gpill';tmp.innerHTML=`${ui('coin')}<b></b>`;FXROOT().appendChild(tmp);el=tmp;if(fxOK())tmp.animate([{transform:'translateY(-24px)',opacity:0},{transform:'none',opacity:1}],{duration:320,easing:EZ.out});}
  const r=el.getBoundingClientRect(),hasB=!!el.querySelector('b');
  return {el,x:r.left+r.width/2,y:r.top+r.height/2,
    set(v){if(hasB)el.querySelector('b').textContent=fmt(v);else el.innerHTML=`${ui('coin')}${fmt(v)}`;},
    bump(){el.animate([{transform:'scale(1)'},{transform:'scale(1.2)'},{transform:'scale(1)'}],{duration:260,easing:EZ.out});},
    done(){if(tmp)setTimeout(()=>{tmp.animate([{opacity:1},{opacity:0,transform:'translateY(-12px)'}],{duration:320,fill:'forwards'}).onfinish=()=>tmp.remove();},900);}};}
function goldFX(n,from){try{if(!(n>0))return;const C=fxCounter(),end=store.gold||0,st=Math.max(0,end-n);
  if(!fxOK()){C.set(end);C.done();sfx('coin');return;}
  C.set(st);let ox=innerWidth/2,oy=innerHeight*.46;
  if(from&&from.getBoundingClientRect){const r=from.getBoundingClientRect();if(r.width&&r.top>0&&r.bottom<innerHeight){ox=r.left+r.width/2;oy=r.top+r.height/2;}}
  const lab=document.createElement('div');lab.className='gfx2';lab.innerHTML=`<b>+${fmt(n)}</b>${ui('coin')}`;FXROOT().appendChild(lab);lab.style.left=ox+'px';lab.style.top=oy+'px';
  lab.animate([{transform:'translate(-50%,-50%) scale(.3)',opacity:0},{transform:'translate(-50%,-50%) scale(1.15)',opacity:1,offset:.2},{transform:'translate(-50%,-62%) scale(1)',opacity:1,offset:.62},{transform:'translate(-50%,-115%) scale(.94)',opacity:0}],{duration:1550,easing:EZ.out}).onfinish=()=>lab.remove();
  fxEmit(ox,oy,{n:24,v:6.5});
  const k=Math.min(10,3+Math.floor(Math.log2(n+1)));let got=0;
  for(let i=0;i<k;i++){const t=document.createElement('div');t.className='gtk';t.innerHTML=ui('coin');FXROOT().appendChild(t);
    const a=-Math.PI/2+(Math.random()-.5)*Math.PI*1.6,rr=36+Math.random()*58,sx=ox+Math.cos(a)*rr,sy=oy+Math.sin(a)*rr,rot=(Math.random()-.5)*60;
    t.animate([{transform:`translate(${ox}px,${oy}px) translate(-50%,-50%) scale(.2)`,opacity:0},{transform:`translate(${sx}px,${sy}px) translate(-50%,-50%) scale(1.05) rotate(${rot}deg)`,opacity:1}],{duration:380,delay:i*28,easing:EZ.out,fill:'forwards'}).onfinish=()=>{
      fxArc(t,sx,sy,C.x,C.y,{d:620+Math.random()*160,delay:120+i*55,s0:1.05,s1:.42,rot:rot+(Math.random()-.5)*240,lift:-60-Math.random()*80}).onfinish=()=>{
        t.remove();got++;C.set(Math.round(st+(end-st)*got/k));C.bump();fxEmit(C.x,C.y,{n:5,v:2.6,life:34});sfx(got===k?'coin':'tick');if(got===k){C.set(end);C.done();haptic('ok');}};};}
}catch(e){}}

/* ---- карты словаря: кадр эпизода сверху, фраза, перевод; оформление — из магазина (data-cs) ---- */
const dcArt=(s,pi)=>assetUrl(scEpKey(s,pi,'jpg'));
function dcFace(c,isNew){const {s,f,pi}=c;return `<span class="dc-art" style="background-image:url('${dcArt(s,pi)}')"></span><span class="dc-ep">${isNew?'новая':'эп. '+(pi+1)}</span><b class="dc-en">${esc(dxT(f))}</b><span class="dc-ru">${esc(f.ru)}</span><i class="dc-foil"></i>`;}
// новые карты после эпизода/проверки/дуэли: пак падает, рвётся, карты вылетают рубашкой вверх, переворачиваются и улетают в «Словарь»
function dictFly(opt){opt=opt||{};const L=DICT_NEW.splice(0);if(!L.length)return;
  const cards=L.map(x=>{const s=scOf(x.sid);if(!s)return null;let f=null,pi=0;s.parts.forEach((p,i)=>p.ph.forEach(y=>{if(y.id===x.fid){f=y;pi=i;}}));return f?{s,f,pi,p:s.parts[pi]}:null;}).filter(Boolean);if(!cards.length)return;
  const N=cards.length,word=plural(N,['карта','карты','карт']);
  if(!fxOK()){toast(`📖 +${N} ${word} в словарь`);return;}
  document.querySelectorAll('.pk').forEach(x=>x.remove());
  const show=cards.slice(0,6),s0=show[0].s,o=document.createElement('div');o.className='pk';o.dataset.cs=opt.cs||shopUse('cs');
  o.innerHTML=`<div class="pk-bg"></div><div class="pk-rays"></div>
    <div class="pk-h"><b>${opt.demo?'Так выглядят карты':'Новые карты'}</b><span>+${N} ${word} в словарь</span></div>
    <div class="pk-pack" style="--art:url('${scCover(s0,'cover.jpg')}')"><i class="pk-top"></i><div class="pk-body"><em>${esc(dictFilm(s0))}</em><b>${N}</b><small>${word}</small></div><i class="pk-foil"></i></div>
    ${show.map((c,i)=>`<div class="pk-c"><div class="pk-in"><div class="pk-back">${N>6&&i===5?`<b>+${N-5}</b>`:''}</div><div class="dc pk-face t-${scTag(c.f)[1]}" style="--c:${DX_TH[c.s.theme]||'#F5C451'}">${dcFace(c,true)}</div></div></div>`).join('')}
    <small class="pk-tip">Нажми, чтобы открыть</small>`;
  FXROOT().appendChild(o);
  const W=innerWidth,H=innerHeight,n=show.length,cols=n<=3?n:(n===4?2:3),rows=Math.ceil(n/cols),cw=Math.min(150,(W-40-(cols-1)*10)/cols),ch=cw*1.4,gx=10,gy=12,totH=rows*ch+(rows-1)*gy,top=Math.max(96,(H-totH)/2+14);
  const pos=show.map((_,i)=>{const r=Math.floor(i/cols),c=i%cols,inRow=Math.min(cols,n-r*cols),rowW=inRow*cw+(inRow-1)*gx;return {x:(W-rowW)/2+c*(cw+gx)+cw/2,y:top+r*(ch+gy)+ch/2};});
  const els=[...o.querySelectorAll('.pk-c')],pack=o.querySelector('.pk-pack'),tip=o.querySelector('.pk-tip'),px=W/2,py=H*.5;
  els.forEach(e=>{e.style.width=cw+'px';e.style.height=ch+'px';});
  const T=[],later=(f,ms)=>T.push(setTimeout(()=>{if(o.isConnected)f();},ms));let st=0;
  o.animate([{opacity:0},{opacity:1}],{duration:260,fill:'forwards'});
  pack.animate([{transform:'translate(-50%,-170%) scale(.6) rotate(-14deg)',opacity:0},{transform:'translate(-50%,-50%) scale(1) rotate(0deg)',opacity:1}],{duration:850,easing:SPRING,fill:'both'});
  later(()=>{if(!st)pack.animate([{transform:'translate(-50%,-50%) rotate(0deg)'},{transform:'translate(-50%,-50%) rotate(-3deg)'},{transform:'translate(-50%,-50%) rotate(3deg)'},{transform:'translate(-50%,-50%) rotate(0deg)'}],{duration:380,iterations:2,easing:'ease-in-out'});},760);
  sfx('whoosh');haptic('light');
  const open=()=>{if(st)return;st=1;tip.textContent='';sfx('reward');haptic('medium');
    const fl=document.createElement('i');fl.className='pk-flash';o.appendChild(fl);fl.animate([{opacity:0},{opacity:.9,offset:.14},{opacity:0}],{duration:620,fill:'forwards'});
    fxEmit(px,py,{n:50,v:9.5,life:70});
    pack.querySelector('.pk-top').animate([{transform:'none',opacity:1},{transform:'translate(40px,-170px) rotate(38deg)',opacity:0}],{duration:620,easing:EZ.out,fill:'forwards'});
    pack.animate([{transform:'translate(-50%,-50%) scale(1)',opacity:1},{transform:'translate(-50%,-38%) scale(.86)',opacity:0}],{duration:460,delay:110,easing:EZ.in,fill:'forwards'});
    els.forEach((e,i)=>{const p=pos[i];e.style.opacity='1';
      e.animate([{transform:`translate(${px}px,${py}px) translate(-50%,-50%) scale(.3) rotate(${(i-n/2)*9}deg)`},{transform:`translate(${p.x}px,${p.y}px) translate(-50%,-50%) scale(1) rotate(0deg)`}],{duration:780,delay:150+i*70,easing:SPRING,fill:'both'});});
    later(flip,150+n*70+560);};
  const flip=()=>{if(st>1)return;st=2;tip.textContent=opt.demo?'':'Нажми, чтобы собрать в словарь';
    els.forEach((e,i)=>later(()=>{e.querySelector('.pk-in').animate([{transform:'rotateY(180deg)'},{transform:'rotateY(-14deg)',offset:.7},{transform:'rotateY(0deg)'}],{duration:640,easing:EZ.out,fill:'forwards'});
      later(()=>{const r=e.getBoundingClientRect();fxEmit(r.left+r.width/2,r.top+r.height/2,{n:12,v:4.5,life:40});sfx('tap');e.querySelector('.pk-face').classList.add('shine');},240);},i*170));
    later(collect,n*170+(opt.demo?2600:1900));};
  const collect=()=>{if(st>2)return;st=3;tip.remove();o.querySelector('.pk-h').animate([{opacity:1},{opacity:0}],{duration:250,fill:'forwards'});
    const tb=document.querySelector('#tabbar [data-nav="dict"]'),bar=document.getElementById('tabbar'),tr=tb&&tb.getBoundingClientRect(),vis=!!(tr&&tr.width&&tr.top<H&&bar&&getComputedStyle(bar).opacity!=='0'&&getComputedStyle(bar).display!=='none');
    const tx=vis?tr.left+tr.width/2:W/2,ty=vis?tr.top+tr.height/2:H-56;let land=0;
    els.forEach((e,i)=>{const r=e.getBoundingClientRect(),x0=r.left+r.width/2,y0=r.top+r.height/2;e.getAnimations().forEach(a=>a.cancel());e.style.transform=`translate(${x0}px,${y0}px) translate(-50%,-50%)`;
      fxArc(e,x0,y0,tx,ty,{d:720,delay:i*80,s0:1,s1:.1,rot:(i%2?1:-1)*(22+i*6),lift:-90-i*12,ez:'cubic-bezier(.55,0,.35,1)'}).onfinish=()=>{e.remove();land++;fxEmit(tx,ty,{n:9,v:3,life:32});sfx('tick');
        if(tb&&vis)tb.animate([{transform:'scale(1)'},{transform:'scale(1.28)'},{transform:'scale(1)'}],{duration:300,easing:EZ.out});
        if(land===els.length){haptic('ok');later(()=>{o.animate([{opacity:1},{opacity:0}],{duration:300,fill:'forwards'}).onfinish=()=>{T.forEach(clearTimeout);o.remove();};},260);}};});};
  o.onclick=()=>{if(st===0)open();else if(st===1)flip();else if(st===2)collect();};
  later(open,1450);}

/* ---- заставки: «Кинолента» (по умолчанию), «Отсчёт 3-2-1» (старая), «Неоновая вывеска»; выбор — в магазине ---- */
function splash(v){v=v||shopUse('sp');if(!store.fx||v==='off')return;if(v==='leader')return splashLeader();if(v==='neon')return splashNeon();return splashReel();}
function splashOut(d,ms,rm){let gone=false;const out=()=>{if(gone)return;gone=true;d.classList.add('out');setTimeout(()=>d.remove(),rm||650);};d.addEventListener('pointerdown',out);setTimeout(out,ms);}
// 13.9.21 «Кинолента» v2: ≈1,8 с (было 2,5 + 0,6), одна лента из 8 кадров (по сцене каждого фильма), один луч, без пылинок, название — APP_NAME.
// Кадры показываем, только если успели загрузиться за 0,3 с — иначе одно название, без серых пустых рамок (первый запуск, медленная сеть)
const spTitle=t=>t.toUpperCase().split('').map((ch,i)=>`<span style="--i:${i}">${ch===' '?'&nbsp;':esc(ch)}</span>`).join('');
function splashReel(){const seen={},S=SCENES.filter(x=>x.kind!=='clip'&&!x.age&&flagOf('scene-'+x.id)!=='hide').filter(x=>{const h=showOf(x);if(seen[h])return false;seen[h]=1;return true;}).slice(0,8);
  const d=document.createElement('div');d.className='spr v2';
  d.innerHTML=`<div class="spr-beam"></div><div class="spr-vig"></div>
    <div class="spr-c"><div class="spr-t">${spTitle(APP_NAME)}</div><div class="spr-line"></div><div class="spr-sub">английский и немецкий по сценам из кино</div></div>`;
  document.body.appendChild(d);
  const R=[],P=S.map((s,i)=>{const im=new Image();im.decoding='async';im.src=assetUrl(scEpKey(s,0,'jpg'));
    return (im.decode?im.decode():new Promise((ok,no)=>{im.onload=ok;im.onerror=no;})).then(()=>{R[i]=im.src;},()=>{});});
  let shown=false;const film=()=>{if(shown)return;shown=true;const U=R.filter(Boolean);if(U.length<4||!d.isConnected||d.classList.contains('out'))return;
    const f=document.createElement('div');f.className='spr-film';
    f.innerHTML=`<div class="spr-row"><div class="spr-strip">${[...U,...U].map(u=>`<i style="background-image:url('${u}')"></i>`).join('')}</div></div>`;
    d.insertBefore(f,d.firstChild);};
  Promise.all(P).then(film);setTimeout(film,300);
  splashOut(d,1400,450);}
function splashNeon(){const d=document.createElement('div');d.className='spn';
  const W=APP_NAME.split(' '),cl=i=>i===0?'a':i===W.length-1?'c':'b';
  d.innerHTML=`<div class="spn-wall"></div><div class="spn-t">${W.map((w,i)=>`<span class="${cl(i)}">${esc(w.length<=2?w.toLowerCase():w.toUpperCase())}</span>`).join('')}</div><div class="spn-sub">английский и немецкий по сценам из кино</div>`;
  document.body.appendChild(d);try{if(store.snd)[0,.18,.42].forEach(t=>osc('sawtooth',110,t,.12,.008,{lp:700}));}catch(e){}
  splashOut(d,2400);}
function splashLeader(){
  // 11.2: «кинопроектор» — отсчёт плёнки 3-2-1, вспышка, шторки-letterbox раскрываются, проявляется название. Тап — пропустить.
  const d=document.createElement('div');d.className='splash3';
  const title=spTitle(APP_NAME);
  d.innerHTML=`<div class="s3-beam"></div><div class="s3-lead"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44"/><circle class="sw" cx="50" cy="50" r="22"/><path d="M50 2v96M2 50h96"/></svg><b><i>3</i><i>2</i><i>1</i></b></div>
    <div class="s3-flash"></div><div class="s3-bar t"></div><div class="s3-bar b"></div>
    <div class="s3-c"><div class="s3-t">${title}</div><div class="s3-line"></div><div class="s3-sub">английский и немецкий по сценам из кино</div></div><div class="s3-grain"></div>`;
  document.body.appendChild(d);splashOut(d,2300);}
/* ---- отсчёт 3-2-1 (игры, дуэль): цифра влетает с размытием, кольцо-волна, искры, «В бой!» с толчком ---- */
/* ===================================== МАГАЗИН ===================================== */
const SHOP_DEF={fx:'cine',cs:'classic',st:'pick',sp:'reel',snd:'kino',hm:''};
const SHOP={
  fx:{n:'Эффекты',i:'✨',d:'Искры, полёт билетов и карт, вспышки наград — во всём приложении.',L:[
    {id:'cine',n:'Кино',p:0,d:'Золотые искры и кадры плёнки'},
    {id:'noir',n:'Нуар',p:250,d:'Серебро, пепел и красный акцент'},
    {id:'neon',n:'Неон',p:400,d:'Розовый и бирюзовый неон ночного города'},
    {id:'fire',n:'Огонь',p:400,d:'Угли и искры, как от костра'},
    {id:'money',n:'Бабки',p:600,d:'Дождь из купюр — как на Уолл-стрит'},
    {id:'holo',n:'Голограмма',p:800,d:'Радужные осколки, как у редкой карты'}]},
  cs:{n:'Карты',i:'🃏',d:'Как выглядят карты в словаре и в паке новых карт.',L:[
    {id:'classic',n:'Классика',p:0,d:'Кадр из сцены и тонкая рамка цвета фильма'},
    {id:'noir',n:'Нуар',p:300,d:'Чёрно-белый кадр и серебро'},
    {id:'neon',n:'Неон',p:450,d:'Светящаяся рамка и рубашка'},
    {id:'gold',n:'Золото',p:600,d:'Тиснёная золотая рамка'},
    {id:'holo',n:'Голограмма',p:900,d:'Переливающаяся фольга, как у редкой карты'}]},
  st:{n:'Кража',i:'🗡',d:'Выиграл дуэль со ставкой — забираешь билеты друга. Друг видит твой стиль.',L:[
    {id:'pick',n:'Ловкость рук',p:0,d:'Билеты тихо уплывают к тебе'},
    {id:'magnet',n:'Магнит',p:300,d:'Магнит вытягивает все билеты'},
    {id:'heist',n:'Ограбление',p:450,d:'Мешок падает на банк — и к тебе'},
    {id:'jinada',n:'Джинада',p:600,d:'Рывок, двойной удар, крит — и билеты твои'},
    {id:'jinadaI',n:'Джинада · имморталка',p:1200,d:'Метка, тройной удар, золото с неба'}]},
  sp:{n:'Заставка',i:'🎬',d:'Что показывается, когда открываешь приложение.',L:[
    {id:'reel',n:'Кинолента',p:0,d:'Кадры твоих сцен и золотое название'},
    {id:'leader',n:'Отсчёт 3-2-1',p:0,d:'Старая плёнка: отсчёт, вспышка, шторки'},
    {id:'neon',n:'Неоновая вывеска',p:350,d:'Название вспыхивает неоном, с треском'},
    {id:'off',n:'Без заставки',p:0,d:'Сразу на Главную'}]},
  snd:{n:'Звуки',i:'🔊',d:'Щелчки, верные ответы, награды.',L:[
    {id:'kino',n:'Кино',p:0,d:'Затвор, плёнка, челеста — по умолчанию'},
    {id:'ios',n:'Как в iPhone',p:0,d:'Короткий «ток», колёсико, чистый звоночек'},
    {id:'cs',n:'Прежние',p:0,d:'Чёткие щелчки и звон — как было до 13.9.21'},
    {id:'soft',n:'Мягкие',p:200,d:'Тихо и бархатно'},
    {id:'projector',n:'Кинопроектор',p:300,d:'Треск плёнки'},
    {id:'typewriter',n:'Печатная машинка',p:300,d:'Клавиши и звоночек'},
    {id:'arcade',n:'8-бит',p:300,d:'Как в старых приставках'}]}
  // 13.9.19: раздел «Музыка» (саундтреки фильмов за билеты) убран — самый большой риск по авторским правам. Купленное вернули билетами (hmRefund)
};
const SHOP_E={snd:{kino:'🎞',ios:'📱',cs:'🎯',soft:'🪶',projector:'📽',typewriter:'⌨️',arcade:'👾'}};
function musTracks(){const seen={},L=[];SCENES.forEach(s=>musOf(s).forEach(m=>{const k=(m.t+'|'+m.by).toLowerCase();if(seen[k])return;seen[k]=1;L.push({id:s.id+'|'+m.f,n:m.t,d:m.by,p:150,s,m});}));return L;}
function shopList(cat){return cat==='hm'?[{id:'',n:'Без музыки',p:0,d:'На Главной тихо'},...musTracks()]:(SHOP[cat]?SHOP[cat].L:[]);}
function shopS(){if(!store.shop||typeof store.shop!=='object')store.shop={};store.shop.own=store.shop.own||{};store.shop.use=store.shop.use||{};return store.shop;}
const shopItem=(cat,id)=>shopList(cat).find(x=>x.id===id);
const shopHas=(cat,id)=>{const it=shopItem(cat,id);return !!it&&(it.p===0||ADM_OPEN()||!!(store.shop&&store.shop.own&&store.shop.own[cat+':'+id]));};
function shopUse(cat){const u=store.shop&&store.shop.use?store.shop.use[cat]:undefined;return u!=null&&shopHas(cat,u)?u:SHOP_DEF[cat];}
function shopApply(){try{document.body.dataset.cs=shopUse('cs');}catch(e){}try{labApply();}catch(e){}}
function shopPv(cat,it){
  if(cat==='fx'){const P=FX_PACKS[it.id];return `<div class="pv-fx" style="--a:${P.c[0]};--b:${P.c[1]};--c:${P.c[2]}"><span>${P.e}</span>${P.c.slice(0,4).map((c,i)=>`<i style="--k:${c};--i:${i}"></i>`).join('')}</div>`;}
  if(cat==='cs'){const s=SCENES.find(x=>x.kind!=='clip'&&!x.age&&scAct(x.parts[0].ph).length)||SCENES[0],pi=0,f=scAct(s.parts[0].ph)[0]||s.parts[0].ph[0];return `<div class="pv-cs" data-cs="${it.id}"><div class="dc" style="--c:${DX_TH[s.theme]||'#F5C451'}">${dcFace({s,f,pi})}</div><div class="pv-back"></div></div>`;}
  if(cat==='sp')return `<div class="pv-sp sp-${it.id}"><b>${esc(APP_NAME.toUpperCase())}</b></div>`;
  if(cat==='snd')return `<div class="pv-snd"><span>${SHOP_E.snd[it.id]||'🔊'}</span></div>`;
  if(cat==='st')return `<div class="pv-st st-${it.id}"><span>${ST_ICO[it.id]||'🗡'}</span></div>`;
  if(cat==='hm')return it.s?`<div class="pv-hm" style="background-image:url('${musArt(it.s,it.m)}')"><span>♪</span></div>`:`<div class="pv-hm off"><span>🔇</span></div>`;
  return '';}
// 13.6: редкость товара по цене — как в HS: обычное / редкое / эпическое / легендарное. Плитка и открытие покупки — по редкости.
const SHOP_TIER=p=>p>=800?4:p>=400?3:p>0?2:1;
const TIER_N=[null,['common','Обычное','#c9ced6'],['rare','Редкое','#3b9bff'],['epic','Эпическое','#b155ff'],['leg','Легендарное','#ffad2e']];
function shopTile(cat,it,use){const own=shopHas(cat,it.id),on=use===it.id,g=store.gold||0,poor=!own&&g<it.p;
  const adm=own&&it.p>0&&!(store.shop&&store.shop.own&&store.shop.own[cat+':'+it.id]);   // админ: всё открыто, цену видно
  const btn=on?`<button class="shp-b on" disabled>✓ Выбрано${adm?`<small>${ui('coin')} ${it.p} · админу даром</small>`:''}</button>`:own?`<button class="shp-b use" data-use="${esc(it.id)}">Выбрать${adm?`<small>${ui('coin')} ${it.p} · админу даром</small>`:''}</button>`
    :poor?`<button class="shp-b poor" disabled>${ui('coin')} ${it.p}<small>не хватает ${it.p-g}</small></button>`:`<button class="shp-b buy" data-buy="${esc(it.id)}">${ui('coin')} ${it.p}</button>`;
  const tr=(cat==='hm'&&!it.id)||(cat==='sp'&&it.id==='off')?'':`<button class="shp-try" data-try="${esc(it.id)}" aria-label="Посмотреть">${SI.play}</button>`;
  const T=TIER_N[SHOP_TIER(it.p)];
  return `<div class="shp${on?' on':''}${own?' own':''} tr-${T[0]}" data-id="${esc(it.id)}" style="--tc:${T[2]}"><div class="shp-pv">${shopPv(cat,it)}${on?'<i class="shp-on">✓</i>':''}${it.p?`<i class="shp-tier">${T[1]}</i>`:''}</div><div class="shp-i"><b>${esc(it.n)}</b><small>${esc(it.d)}</small></div><div class="shp-a">${tr}${btn}</div></div>`;}
let SHPV=null,SHOP_BACK='learn';   // предпрослушка трека в магазине; вкладка, с которой пришли
function shopBack(){sfx('tap');shopPvStop();renderTab(SHOP_BACK||'learn');}
function shopPvStop(){if(SHPV){try{SHPV.pause();}catch(e){}SHPV=null;}}
function renderShop(cat){cat=SHOP[cat]?cat:(SHOP[store.shopTab]?store.shopTab:'fx');if(store.shopTab!==cat){store.shopTab=cat;save();}
  if(screen!=='shop')SHOP_BACK=(screen==='home'||screen==='subtab')?(store.tab||'learn'):'learn';screen='shop';backBtn(true);setWorld('neutral');shopPvStop();
  mount(`<div class="shop"><div class="page-head"><button class="icon-btn" id="bBtn" aria-label="Назад">${ui('back')}</button><h1 class="title">Магазин</h1><span class="gold shop-bal" id="shopBal">${ui('coin')}<b>${fmt(store.gold||0)}</b></span></div>
    <p class="shop-lead">Билеты дают за эпизоды, финалы сцен, цель дня и дуэли. Здесь их можно потратить на оформление.</p>
    <div class="shop-tabs" role="tablist">${Object.keys(SHOP).map(k=>`<button data-st="${k}" class="${k===cat?'on':''}" role="tab"><span>${SHOP[k].i}</span><b>${SHOP[k].n}</b></button>`).join('')}</div>
    <p class="shop-cd">${SHOP[cat].d}</p><div class="shop-grid g-${cat}" id="shopGrid"></div></div>`,'shopscr');
  $('#bBtn').onclick=shopBack;
  $$('.shop-tabs [data-st]').forEach(b=>b.onclick=()=>{if(b.dataset.st===cat)return;sfx('tap');haptic('sel');renderShop(b.dataset.st);});
  shopGrid(cat);}
function shopGrid(cat){const box=$('#shopGrid');if(!box)return;const use=shopUse(cat);box.innerHTML=shopList(cat).map(it=>shopTile(cat,it,use)).join('');
  box.querySelectorAll('[data-try]').forEach(b=>b.onclick=()=>{sfx('tap');shopTry(cat,b.dataset.try,b.closest('.shp'));});
  box.querySelectorAll('[data-use]').forEach(b=>b.onclick=()=>{shopS().use[cat]=b.dataset.use;save();shopApply();sfx('good');haptic('sel');shopGrid(cat);
    if(cat==='hm'){const it=shopItem('hm',b.dataset.use);toast(it&&it.id?`🎵 «${it.n}» — на Главной`:'Музыка на Главной выключена');}});
  box.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>{const it=shopItem(cat,b.dataset.buy);if(!it)return;
    if(!b.classList.contains('sure')){sfx('tap');b.classList.add('sure');b.innerHTML=`Купить за ${ui('coin')} ${it.p}?`;clearTimeout(b._t);b._t=setTimeout(()=>{if(b.isConnected){b.classList.remove('sure');b.innerHTML=`${ui('coin')} ${it.p}`;}},3500);return;}
    shopBuy(cat,it,b);});
  if(fxOK())box.querySelectorAll('.shp').forEach((e,i)=>e.animate([{opacity:0,transform:'translateY(14px) scale(.97)'},{opacity:1,transform:'none'}],{duration:420,delay:i*45,easing:EZ.out,fill:'backwards'}));}
function shopBuy(cat,it,btn){if(shopHas(cat,it.id))return;const g=store.gold||0;if(g<it.p){toast('Не хватает билетов');return;}
  store.gold=g-it.p;shopS().own[cat+':'+it.id]=Date.now();shopS().use[cat]=it.id;save();shopApply();sfx('reward');haptic('ok');
  const bal=$('#shopBal');if(bal){const nb=bal.querySelector('b'),t0=performance.now(),dur=600;const tick=t=>{const k=Math.min(1,(t-t0)/dur);nb.textContent=fmt(Math.round(g-it.p*(1-Math.pow(1-k,3))));if(k<1)requestAnimationFrame(tick);};requestAnimationFrame(tick);
    bal.animate([{transform:'scale(1)'},{transform:'scale(.9)'},{transform:'scale(1)'}],{duration:300,easing:EZ.out});}
  shopReveal(cat,it);setTimeout(()=>shopGrid(cat),700);}
// открытие покупки: фон из лучей и тумана движется, карта рубашкой вверх вылетает снизу, зависает (у эпиков и легендарок — заряжается),
// переворачивается со вспышкой и ударной волной, искры по редкости; тап — закрыть
function shopReveal(cat,it){const t=SHOP_TIER(it.p),[k,name,col]=TIER_N[t];
  if(!fxOK()){toast(`Куплено: ${it.n}`);return;}
  document.querySelectorAll('.srv').forEach(x=>x.remove());
  const o=document.createElement('div');o.className='srv t-'+k;o.style.setProperty('--tc',col);
  o.innerHTML=`<div class="srv-bg"><i class="srv-rays"></i><i class="srv-fog f1"></i><i class="srv-fog f2"></i><i class="srv-glow"></i></div>
    <div class="srv-stage"><div class="srv-card"><div class="srv-back"><i></i><span>◆</span></div><div class="srv-face"><div class="srv-pv">${shopPv(cat,it)}</div><b>${esc(it.n)}</b><small>${esc(it.d)}</small></div></div>
      <div class="srv-ttl"><em>${name}</em><b>${esc(it.n)}</b><span>${esc(SHOP[cat]?SHOP[cat].n:'')} · уже стоит у тебя</span></div></div>
    <i class="srv-ring"></i><i class="srv-flash"></i><div class="srv-hint">Нажми, чтобы закрыть</div>`;
  FXROOT().appendChild(o);
  const card=o.querySelector('.srv-card'),ttl=o.querySelector('.srv-ttl'),ring=o.querySelector('.srv-ring'),flash=o.querySelector('.srv-flash'),hint=o.querySelector('.srv-hint');
  const charge=t>=3?(t===4?1300:800):t===2?350:0,T0=420,tFlip=T0+charge;
  o.animate([{opacity:0},{opacity:1}],{duration:320,fill:'forwards'});
  card.animate([{transform:'translateY(70vh) rotateX(35deg) rotateZ(-12deg) scale(.55)'},{transform:'translateY(-14px) rotateX(0) rotateZ(2deg) scale(1.02)',offset:.8},{transform:'translateY(0) rotateY(0) scale(1)'}],{duration:T0,easing:EZ.out,fill:'forwards'});
  if(charge){sfx('tap');card.animate([{transform:'translateY(0) rotateY(0) scale(1)'},{transform:'translateY(-6px) rotateY(0) scale(1.04)',offset:.5},{transform:'translateY(0) rotateY(0) scale(1)'}],{duration:Math.min(700,charge),delay:T0,iterations:Math.max(1,Math.round(charge/700)),easing:'ease-in-out'});
    o.querySelector('.srv-glow').animate([{opacity:.3,transform:'scale(.8)'},{opacity:1,transform:'scale(1.25)'}],{duration:charge,delay:T0,fill:'forwards',easing:'ease-in'});
    if(t===4){o.classList.add('charging');haptic('light');setTimeout(()=>haptic('light'),T0+charge*.5);}}
  setTimeout(()=>{if(!o.isConnected)return;o.classList.remove('charging');o.classList.add('open');sfx('reward');haptic(t>=3?'heavy':'ok');
    card.animate([{transform:'rotateY(0) scale(1)'},{transform:'rotateY(100deg) scale(1.12)',offset:.45},{transform:'rotateY(180deg) scale(1)'}],{duration:t>=3?620:480,easing:'cubic-bezier(.3,.7,.2,1)',fill:'forwards'});
    flash.animate([{opacity:0},{opacity:t===4?.95:t===3?.7:.45,offset:.2},{opacity:0}],{duration:t>=3?700:450,easing:'ease-out'});
    ring.animate([{transform:'translate(-50%,-50%) scale(.2)',opacity:.95},{transform:'translate(-50%,-50%) scale(t4)'.replace('t4',t===4?'7':t===3?'5':'3.5'),opacity:0}],{duration:t>=3?900:650,easing:'cubic-bezier(.1,.7,.2,1)'});
    if(t===4)o.animate([{transform:'translate(0,0)'},{transform:'translate(-6px,4px)'},{transform:'translate(5px,-3px)'},{transform:'translate(-3px,2px)'},{transform:'translate(0,0)'}],{duration:420,easing:'linear'});
    const r=card.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,pack=cat==='fx'?it.id:t===4?'fire':t===3?'holo':t===2?'neon':'cine';
    fxEmit(cx,cy,{n:t===4?90:t===3?64:t===2?40:24,v:t>=3?11:8,pack});if(t>=3)setTimeout(()=>fxEmit(cx,cy,{n:30,v:5,pack,life:90}),240);if(t===4)fxRain(46,{pack:'cine'});
    ttl.animate([{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{duration:500,delay:260,easing:EZ.out,fill:'forwards'});
    hint.animate([{opacity:0},{opacity:.7}],{duration:400,delay:900,fill:'forwards'});},tFlip);
  let gone=false;const close=()=>{if(gone)return;gone=true;o.animate([{opacity:1},{opacity:0}],{duration:260,fill:'forwards'}).onfinish=()=>o.remove();};
  o.addEventListener('click',()=>{if(performance.now()-st<tFlip+300)return;sfx('tap');close();});const st=performance.now();
  o._close=close;}
function shopTry(cat,id,tile){const pv=tile&&tile.querySelector('.shp-pv');
  if(cat==='fx'){fxAt(pv,{n:54,v:8.5,pack:id});setTimeout(()=>fxAt(pv,{n:20,v:4,pack:id,life:70}),260);return;}
  if(cat==='cs'){const s=SCENES.find(x=>x.kind!=='clip'&&!x.age&&scAct(x.parts[0].ph).length>=3)||SCENES[0];scAct(s.parts[0].ph).slice(0,3).forEach(f=>DICT_NEW.push({sid:s.id,fid:f.id}));dictFly({cs:id,demo:true});return;}
  if(cat==='st'){if(!fxOK()){toast('Включи анимации в настройках');return;}kvSteal({win:true,bet:100,me:{n:kvName()},foe:{n:'Друг'},style:id,demo:true});return;}
  if(cat==='sp'){if(!fxOK()){toast('Включи анимации в настройках');return;}const was=store.fx;store.fx=true;splash(id);store.fx=was;return;}
  // 13.9.21: ▶ играет набор, не трогая выбранный (раньше SFX подменялся на 1,8 с — выбор в это время мог откатиться); «Кино»/«iPhone» — после загрузки файлов
  if(cat==='snd'){if(!store.snd){toast('Включи звук в настройках');return;}ac();sfxLoad(id).then(()=>{const P=sfxPack(id);
    ['tap','good','learn','reward'].forEach((n,i)=>setTimeout(()=>{try{P[n]();}catch(e){}},i*420));});return;}
  if(cat==='hm'){const it=shopItem('hm',id);if(!it||!it.s)return;if(SHPV&&SHPV._k===id){shopPvStop();return;}shopPvStop();try{if(MUS&&!MUS.paused)MUS.pause();}catch(e){}
    SHPV=new Audio(assetUrl(scKey(it.s,it.m.f)));SHPV._k=id;SHPV.volume=.5;SHPV.addEventListener('loadedmetadata',()=>{try{if(isFinite(SHPV.duration)&&SHPV.duration>40)SHPV.currentTime=SHPV.duration*.3;}catch(e){}},{once:true});
    const p=SHPV.play();if(p&&p.catch)p.catch(()=>toast('Трек не загрузился'));const me=SHPV;setTimeout(()=>{if(SHPV===me)shopPvStop();},20000);toast(`▶ «${it.n}» — 20 секунд`);}}
/* ---- музыка на Главной: выбранный в магазине трек тихо играет по кругу, только на вкладке «Главная» ---- */
let HM=null,HMF=0;
function hmFade(to,cb){if(!HM)return;clearInterval(HMF);const from=HM.volume,t0=Date.now(),d=700;HMF=setInterval(()=>{const k=Math.min(1,(Date.now()-t0)/d);try{HM.volume=from+(to-from)*k;}catch(e){}if(k>=1){clearInterval(HMF);if(cb)cb();}},40);}
function hmSync(){const id='',here=screen==='home'&&store.tab==='learn'&&!document.body.dataset.scn;
  if(!id||!here||store.hmOff){if(HM&&!HM.paused)hmFade(0,()=>{try{HM.pause();}catch(e){}});hmChip();return;}
  const it=shopItem('hm',id);if(!it||!it.s)return;
  if(!HM){HM=new Audio();HM.loop=true;HM.preload='auto';HM.addEventListener('play',hmChip);HM.addEventListener('pause',hmChip);}
  if(HM._k!==id){HM._k=id;HM.src=assetUrl(scKey(it.s,it.m.f));HM.volume=0;}
  if(HM.paused){try{HM.volume=0;}catch(e){}const p=HM.play();if(p&&p.then)p.then(()=>hmFade(.22),()=>hmChip());else hmFade(.22);}
  hmChip();}
function hmChip(){const c=$('#hmChip');if(!c)return;const on=!!(HM&&!HM.paused);c.classList.toggle('on',on);const i=c.querySelector('i');if(i)i.innerHTML=on?SI.pause:SI.play;}
function hmChipHTML(){const id='',it=id&&shopItem('hm',id);return it&&it.s?`<button class="hm-chip anim" id="hmChip"><span class="hm-eq"><b></b><b></b><b></b></span><span class="hm-t"><b>${esc(it.n)}</b><small>${esc(it.d)}</small></span><i>${SI.play}</i></button>`:'';}
function hmBind(){const c=$('#hmChip');if(!c)return;c.onclick=()=>{sfx('tap');if(HM&&!HM.paused){store.hmOff=true;save();hmFade(0,()=>{try{HM.pause();}catch(e){}});}else{store.hmOff=false;save();hmSync();}};hmChip();}


/* =====================================================================================
   13.3 — КРАЖА БИЛЕТОВ: дуэль со ставкой выиграна — победитель «крадёт» ставку друга.
   Стиль — из магазина (store.shop.use.st). Друг видит стиль победителя: поле fx игрока
   в комнате /api/pvp (старый воркер его не хранит — тогда стиль по умолчанию).
   kvSteal({win,bet,me:{n},foe:{n},style,demo}) → Promise (конец или тап «пропустить»).
   ===================================================================================== */
const ST_IDS=['pick','magnet','heist','jinada','jinadaI'];
const stOf=x=>ST_IDS.includes(x)?x:'pick';
const ST_ICO={pick:'🤏',magnet:'🧲',heist:'💰',jinada:'🗡',jinadaI:'⚔️'};
const ST_NAME={pick:'Ловкость рук',magnet:'Магнит',heist:'Ограбление',jinada:'Джинада',jinadaI:'Джинада · имморталка'};
const ST_SVG={
  slash:'<svg class="stl-sl" viewBox="0 0 120 120"><defs><linearGradient id="stg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff6d6"/><stop offset=".45" stop-color="#ffc44d"/><stop offset="1" stop-color="#ff6a2b"/></linearGradient><linearGradient id="stg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".4" stop-color="#e7b6ff"/><stop offset="1" stop-color="#ffd65c"/></linearGradient></defs><path class="a" d="M14 98 Q40 30 106 18"/><path class="b" d="M106 98 Q80 30 14 18"/><path class="c" d="M8 66 Q60 50 112 62"/></svg>',
  track:'<svg class="stl-trk" viewBox="0 0 80 80"><circle cx="40" cy="40" r="30" fill="none" stroke="url(#stg3)" stroke-width="4" stroke-dasharray="14 8"/><circle cx="40" cy="40" r="19" fill="none" stroke="#ffd65c" stroke-width="2" opacity=".7"/><path d="M40 22 L48 38 L40 34 L32 38 Z M40 58 L48 42 L40 46 L32 42 Z" fill="#ffd65c"/><defs><linearGradient id="stg3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe9a8"/><stop offset="1" stop-color="#c58cff"/></linearGradient></defs></svg>',
  magnet:'<svg viewBox="0 0 80 80"><path d="M18 8 V44 A22 22 0 0 0 62 44 V8" fill="none" stroke="#e63946" stroke-width="15"/><path d="M18 8 V20 M62 8 V20" stroke="#e8e8e8" stroke-width="15"/><path d="M14 44 A26 26 0 0 0 66 44" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="3"/></svg>',
  bag:'<svg viewBox="0 0 64 64"><path d="M23 13 H41 L36 22 C50 27 57 39 55 50 C53 58 45 61 32 61 C19 61 11 58 9 50 C7 39 14 27 28 22 Z" fill="#8a6527" stroke="#3b2a0d" stroke-width="2"/><path d="M27 22 H37" stroke="#f5c451" stroke-width="3.5" stroke-linecap="round"/><path d="M20 47 C26 53 38 53 44 47" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="3"/></svg>'
};
function stAva(n,me){const ch=(String(n||'?').trim()[0]||'?').toUpperCase();return `<i class="stl-av${me?' me':''}">${esc(ch)}</i>`;}
function kvSteal(o){o=o||{};return new Promise(done=>{
  if(!fxOK()){done();return;}
  document.querySelectorAll('.stl').forEach(x=>x.remove());
  const st=stOf(o.style),N=Math.max(1,o.bet|0),win=o.win!==false,me=o.me||{n:'Ты'},foe=o.foe||{n:'Друг'};
  const thiefN=win?'Ты':foe.n;
  const d=document.createElement('div');d.className='stl';d.dataset.st=st;
  const card=(p,cls,isMe,val)=>`<div class="stl-p ${cls}">${stAva(p.n,isMe)}<div class="stl-n"><b>${esc(isMe?'Ты':p.n)}</b><span class="stl-pile">${ui('coin')}<em>${fmt(val)}</em></span></div></div>`;
  d.innerHTML=`<div class="stl-bg"></div>${card(foe,'top',false,N)}${card(me,'bot',true,N)}
    <div class="stl-tag"><span>${ST_ICO[st]}</span>${win?'':esc(foe.n)+' · '}${esc(ST_NAME[st])}</div>
    <div class="stl-cap"></div><small class="stl-skip">нажми, чтобы пропустить</small>`;
  FXROOT().appendChild(d);
  const top=d.querySelector('.stl-p.top'),bot=d.querySelector('.stl-p.bot'),V=win?top:bot,T=win?bot:top,cap=d.querySelector('.stl-cap');
  const vEm=V.querySelector('em'),tEm=T.querySelector('em'),vP=V.querySelector('.stl-pile'),tP=T.querySelector('.stl-pile'),vA=V.querySelector('.stl-av'),tA=T.querySelector('.stl-av');
  const TM=[],later=(f,ms)=>TM.push(setTimeout(()=>{if(d.isConnected)f();},ms)),flyers=[];let fin=false;
  const ctr=el=>{const r=el.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};};
  const finish=()=>{if(fin)return;fin=true;TM.forEach(clearTimeout);flyers.forEach(x=>x.remove());
    d.animate([{opacity:1},{opacity:0}],{duration:260,fill:'forwards'}).onfinish=()=>{d.remove();done();};};
  d.onclick=finish;
  d.animate([{opacity:0},{opacity:1}],{duration:240,fill:'forwards'});
  top.animate([{transform:'translateY(-40px) scale(.9)',opacity:0},{transform:'none',opacity:1}],{duration:620,easing:SPRING,fill:'backwards'});
  bot.animate([{transform:'translateY(40px) scale(.9)',opacity:0},{transform:'none',opacity:1}],{duration:620,delay:80,easing:SPRING,fill:'backwards'});
  sfx('whoosh');
  const K=Math.min(10,4+Math.floor(Math.log2(N+1)));let got=0;
  const tick=()=>{got++;vEm.textContent=fmt(Math.round(N*(1-got/K)));tEm.textContent=fmt(N+Math.round(N*got/K));
    tP.animate([{transform:'scale(1)'},{transform:'scale(1.18)'},{transform:'scale(1)'}],{duration:220,easing:EZ.out});sfx('tick');
    if(got===K){vEm.textContent='0';tEm.textContent=fmt(N*2);end();}};
  // билет летит от вора к жертве / от жертвы к вору
  const ticket=(a,b,o2)=>{const t=document.createElement('div');t.className='gtk';t.innerHTML=ui('coin');FXROOT().appendChild(t);flyers.push(t);
    t.style.transform=`translate(${a.x}px,${a.y}px) translate(-50%,-50%) scale(0)`;
    const an=fxArc(t,a.x,a.y,b.x,b.y,{d:o2.d||640,delay:o2.delay||0,s0:o2.s0!=null?o2.s0:.95,s1:o2.s1!=null?o2.s1:.75,rot:o2.rot!=null?o2.rot:(Math.random()-.5)*320,lift:o2.lift!=null?o2.lift:-80,ez:o2.ez});
    an.onfinish=()=>{t.remove();if(o2.cb)o2.cb();};return an;};
  const pop=(el,txt,cls)=>{const p=document.createElement('b');p.className='stl-pop '+(cls||'');p.innerHTML=txt;d.appendChild(p);const c=ctr(el);p.style.left=c.x+'px';p.style.top=c.y+'px';
    p.animate([{transform:'translate(-50%,-50%) scale(2.1)',opacity:0},{transform:'translate(-50%,-50%) scale(1)',opacity:1,offset:.22},{transform:'translate(-50%,-90%) scale(1)',opacity:1,offset:.75},{transform:'translate(-50%,-130%) scale(.96)',opacity:0}],{duration:1500,easing:EZ.out,fill:'forwards'});return p;};
  const shake=(el,amp)=>el.animate([0,1,2,3,4,5].map(i=>({transform:`translate(${i===5?0:(i%2?-1:1)*amp*(1-i/6)}px,${i===5?0:(i%2?1:-1)*amp*.4}px)`})),{duration:300,easing:'linear'});
  const stream=o2=>{const a=ctr(vP),b=ctr(tP);for(let i=0;i<K;i++)ticket({x:a.x+(Math.random()-.5)*26,y:a.y+(Math.random()-.5)*14},b,{...o2,delay:(o2.delay||0)+i*(o2.gap||70),cb:tick});};
  const end=()=>{cap.innerHTML=win?`${ui('coin')} ${fmt(N)} — теперь твои`:`${esc(foe.n)} забирает твои ${ui('coin')} ${fmt(N)}`;
    cap.animate([{transform:'translateY(14px)',opacity:0},{transform:'none',opacity:1}],{duration:420,easing:SPRING,fill:'forwards'});
    if(win){fxAt(tP,{n:26,v:6.5});sfx('reward');haptic('ok');}else{sfx('lose');haptic('err');}
    later(finish,o.demo?1500:1300);};
  const dash=(cls)=>{const a=ctr(tA),b=ctr(vA),dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy),ln=document.createElement('i');ln.className='stl-dash '+(cls||'');
    ln.style.cssText=`left:${a.x}px;top:${a.y}px;width:${L}px;transform:rotate(${Math.atan2(dy,dx)}rad)`;d.appendChild(ln);
    ln.animate([{transform:`rotate(${Math.atan2(dy,dx)}rad) scaleX(0)`,opacity:1},{transform:`rotate(${Math.atan2(dy,dx)}rad) scaleX(1)`,opacity:1,offset:.45},{transform:`rotate(${Math.atan2(dy,dx)}rad) scaleX(1)`,opacity:0}],{duration:420,easing:EZ.out,fill:'forwards'}).onfinish=()=>ln.remove();
    tA.animate([{transform:'none',filter:'none'},{transform:'scale(.86)',filter:'blur(2px) brightness(1.6)'},{transform:'none',filter:'none'}],{duration:420,easing:EZ.io});sfx('whoosh');};
  const slash=(imm)=>{const w=document.createElement('div');w.className='stl-slw'+(imm?' imm':'');w.innerHTML=ST_SVG.slash;d.appendChild(w);const c=ctr(vA);w.style.left=c.x+'px';w.style.top=c.y+'px';
    const P=[...w.querySelectorAll('path')].slice(0,imm?3:2);w.querySelectorAll('path').forEach((p,i)=>{if(i>=P.length)p.style.display='none';});
    P.forEach((p,i)=>{const L=p.getTotalLength?p.getTotalLength():160;p.style.strokeDasharray=L;p.style.strokeDashoffset=L;
      p.animate([{strokeDashoffset:L,opacity:1},{strokeDashoffset:0,opacity:1,offset:.5},{strokeDashoffset:-L*.15,opacity:0}],{duration:imm?520:440,delay:i*(imm?95:85),easing:'cubic-bezier(.3,0,.2,1)',fill:'both'});});
    later(()=>w.remove(),1200);};
  const impact=(imm)=>{const c=ctr(vA),f=document.createElement('i');f.className='stl-flash'+(imm?' imm':'');d.appendChild(f);f.style.left=c.x+'px';f.style.top=c.y+'px';
    f.animate([{transform:'translate(-50%,-50%) scale(.2)',opacity:1},{transform:'translate(-50%,-50%) scale(2.6)',opacity:0}],{duration:420,easing:EZ.out,fill:'forwards'}).onfinish=()=>f.remove();
    shake(V,imm?11:8);if(imm)shake(d.querySelector('.stl-bg'),6);
    fxEmit(c.x,c.y,{n:imm?54:34,v:imm?10:8,pack:imm?'holo':'cine',life:imm?70:56});if(imm)fxEmit(c.x,c.y,{n:20,v:6,pack:'money',life:90});
    pop(vA,`−${fmt(N)}!`,imm?'crit imm':'crit');sfx('nope');haptic('medium');};
  // ——— сценарии ———
  if(st==='pick'){
    later(()=>{vP.animate([{transform:'rotate(0)'},{transform:'rotate(-7deg)'},{transform:'rotate(6deg)'},{transform:'rotate(-3deg)'},{transform:'none'}],{duration:420});fxAt(vP,{n:12,sh:'dust',pack:'noir',v:1.6,life:70});},420);
    later(()=>{pop(vP,`−${fmt(N)}`,'minus');stream({lift:-110,d:720,gap:85,ez:'cubic-bezier(.5,0,.3,1)'});},700);}
  else if(st==='magnet'){
    const a=ctr(vP),b=ctr(tP),mg=document.createElement('div');mg.className='stl-mag';mg.innerHTML=ST_SVG.magnet;d.appendChild(mg);
    const mx=a.x+(b.x-a.x)*.56-46,my=a.y+(b.y-a.y)*.56,ang=Math.atan2(a.y-b.y,a.x-b.x)*180/Math.PI+90;
    mg.style.left=mx+'px';mg.style.top=my+'px';mg.style.setProperty('--r',ang+'deg');
    mg.animate([{transform:`translate(-50%,-50%) rotate(${ang}deg) translateY(60px) scale(.4)`,opacity:0},{transform:`translate(-50%,-50%) rotate(${ang}deg) scale(1)`,opacity:1}],{duration:700,delay:250,easing:SPRING,fill:'backwards'});
    later(()=>{mg.animate([{transform:`translate(-50%,-50%) rotate(${ang-6}deg)`},{transform:`translate(-50%,-50%) rotate(${ang+6}deg)`}],{duration:90,iterations:8,direction:'alternate'});
      for(let i=0;i<3;i++)later(()=>fxEmit(mx,my,{n:3,sh:'ring',pack:'neon',v:.6,life:40}),i*160);
      vP.animate([{transform:'translateX(0)'},{transform:'translateX(-3px)'},{transform:'translateX(3px)'}],{duration:70,iterations:6,direction:'alternate'});},800);
    later(()=>{pop(vP,`−${fmt(N)}`,'minus');stream({lift:-12,d:560,gap:60,s1:.55,ez:'cubic-bezier(.75,0,.9,.35)'});},1150);
    later(()=>{if(mg.isConnected)mg.animate([{opacity:1},{opacity:0,transform:`translate(-50%,-50%) rotate(${ang}deg) scale(.6)`}],{duration:300,fill:'forwards'});},1150+K*60+700);}
  else if(st==='heist'){
    const a=ctr(vP),bag=document.createElement('div');bag.className='stl-bag';bag.innerHTML=ST_SVG.bag;d.appendChild(bag);bag.style.left=(a.x+8)+'px';bag.style.top=(a.y-40)+'px';
    bag.animate([{transform:'translate(-50%,-50%) translateY(-160px) rotate(-18deg)',opacity:0},{transform:'translate(-50%,-50%) rotate(0)',opacity:1}],{duration:720,delay:250,easing:SPRING,fill:'backwards'});
    later(()=>{pop(vP,`−${fmt(N)}`,'minus');const c0=ctr(V.querySelector('.stl-av'));let inb=0;
      for(let i=0;i<K;i++)ticket({x:c0.x+(Math.random()-.5)*40,y:c0.y+(Math.random()-.5)*20},{x:a.x+8,y:a.y-40},{d:420,delay:i*55,s0:.9,s1:.15,lift:-40,cb:()=>{inb++;vEm.textContent=fmt(Math.round(N*(1-inb/K)));
        bag.animate([{transform:'translate(-50%,-50%) scale(1)'},{transform:`translate(-50%,-50%) scale(${1+inb/K*.25+.08})`},{transform:`translate(-50%,-50%) scale(${1+inb/K*.25})`}],{duration:200,fill:'forwards'});sfx('tick');}});},950);
    later(()=>{const b=ctr(tP),s0=1.25;bag.getAnimations().forEach(x=>x.cancel());bag.style.left='0px';bag.style.top='0px';
      const an=fxArc(bag,a.x+8,a.y-40,b.x,b.y,{d:760,s0,s1:.55,rot:340,lift:-150,ez:'cubic-bezier(.45,0,.25,1)'});sfx('whoosh');
      an.onfinish=()=>{bag.remove();fxEmit(b.x,b.y,{n:30,v:7,pack:'money',life:80});got=K-1;tick();};},950+K*55+520);}
  else{ // джинада и имморталка
    const imm=st==='jinadaI';
    if(imm)later(()=>{const tr=document.createElement('div');tr.className='stl-track';tr.innerHTML=ST_SVG.track;d.appendChild(tr);const c=ctr(vA);tr.style.left=c.x+'px';tr.style.top=(c.y-64)+'px';
      tr.animate([{transform:'translate(-50%,-50%) scale(2.2) rotate(-90deg)',opacity:0},{transform:'translate(-50%,-50%) scale(1) rotate(0)',opacity:1}],{duration:520,easing:SPRING,fill:'forwards'});
      tr.querySelector('svg').animate([{transform:'rotate(0)'},{transform:'rotate(360deg)'}],{duration:2400,iterations:Infinity});sfx('hint');
      later(()=>tr.animate([{opacity:1},{opacity:0,transform:'translate(-50%,-50%) scale(.6)'}],{duration:260,fill:'forwards'}),1250);},300);
    const t0=imm?1000:450;
    later(()=>dash(imm?'imm':''),t0);
    later(()=>slash(imm),t0+150);
    later(()=>impact(imm),t0+(imm?330:300));
    later(()=>{const a=ctr(vP),b=ctr(tP);
      for(let i=0;i<K;i++){const ang=Math.random()*Math.PI*2,r=40+Math.random()*50,mid={x:a.x+Math.cos(ang)*r,y:a.y+Math.sin(ang)*r*.6};
        ticket(a,mid,{d:260,delay:i*24,s0:.3,s1:1,lift:-20,ez:EZ.out,cb:()=>ticket(mid,b,{d:560,delay:60+i*28,s0:1,s1:.7,lift:-60,cb:tick})});}
      if(imm)fxRain(22,{pack:'money'});
      pop(tA,`+${fmt(N)}`,'gold');},t0+(imm?430:390));}
});}

/* =====================================================================================
   13.6 — ПРИВЕТСТВЕННОЕ ОБУЧЕНИЕ: что это, как проходит сцена (живой пример), что получаешь, настройка под себя, первая сцена.
   Новичкам — вместо старого онбординга (путь/игры/роли), остальным — один раз после обновления (store.introV), повтор — из настроек.
   ===================================================================================== */
let INTRO=null;
const INTRO_N=5;
function introScenes(lang){const seen=new Set(),out=[];
  SCENES.filter(s=>(s.lang==='de'?'de':'en')===lang&&!ageLock(s)&&flagOf('scene-'+s.id)==='on'&&s.kind!=='clip')
    .sort((a,b)=>(a.lvl||3)-(b.lvl||3)||(b.use||3)-(a.use||3)).forEach(s=>{const h=s.show||s.title;if(seen.has(h)||out.length>=3)return;seen.add(h);out.push(s);});return out;}
function renderIntro(step){
  if(!INTRO)INTRO={i:0,lang:kinoLang(),lvl:store.lvl||'a',demo:0,t:0};
  if(step!=null)INTRO.i=step;clearInterval(INTRO.t);
  screen='intro';backBtn(INTRO.i>0);applySubPrefs();
  const I=INTRO,dots=`<div class="it-dots">${Array.from({length:INTRO_N},(_,k)=>`<i class="${k===I.i?'on':k<I.i?'done':''}"></i>`).join('')}</div>`;
  const top=`<div class="it-top">${dots}<button class="it-skip" id="itSkip">Пропустить</button></div>`;
  const posters=[...new Map(SCENES.filter(x=>!ageLock(x)&&x.kind!=='clip').map(x=>[x.show||x.title,x])).values()].slice(0,12).map(x=>assetUrl(scKey(x,'poster.jpg')));
  const wolf=scOf('wolf-of-wall-street');
  let html='';
  if(I.i===0)html=`<div class="it it0"><div class="it-wall">${[0,1,2].map(c=>`<div class="it-col c${c}">${[...posters,...posters].filter((_,k)=>k%3===c).map(u=>`<i style="background-image:url('${u}')"></i>`).join('')}</div>`).join('')}</div>
      <div class="it-shade"></div>
      <div class="it-body">${top}<div class="it-hero"><span class="it-k">Языки по кино</span><h1>Учи английский<br>по сценам из фильмов</h1>
        <p>Смотришь кусок настоящего кино — приложение объясняет живые фразы, которые реально говорят. Потом короткие задания — и фраза твоя.</p></div>
        <button class="btn it-next" id="itNext">Как это работает →</button></div></div>`;
  else if(I.i===1)html=`<div class="it it1">${top}<h2 class="it-h">Как проходит сцена</h2>
      <div class="it-demo"><div class="it-v" style="background-image:url('${wolf?scCover(wolf):''}')"><div class="it-vsh"></div>
        <div class="it-st st0"><div class="it-sub"><span>Fuck the </span><b class="it-w">clients</b><span>.</span><small>Да похуй на клиентов.</small></div><div class="it-tip"><b>clients</b> — клиенты<small>★ В мои слова</small></div><i class="it-finger"></i></div>
        <div class="it-st st1"><div class="it-plate"><em>💬 Фраза из сцены</em><b>Fuck the clients.</b><span>Да похуй на клиентов.</span><small>💡 Когда пригодится: грубо отмахнуться от чужих проблем — только среди своих</small><i class="it-bar"></i></div></div>
        <div class="it-st st2"><div class="it-task"><em>👂 Послушай и напиши</em><div class="it-mask"><i>F···</i><i class="ok">the</i><i>c······</i></div><div class="it-inp"><span>fuck the cli</span><i></i></div></div></div>
        <div class="it-st st3"><div class="it-rep"><em>🔁 Повторение</em><div class="it-days"><i>1</i><i>3</i><i>7</i><i>21</i><i>60</i></div><span>дней — фраза вернётся, пока не запомнится навсегда</span></div></div>
      </div></div>
      <div class="it-steps">${[['🎬','Смотри','Эпизод — 30–60 секунд с субтитрами. Нажми на любое слово — переведу. Удержание тоже работает.'],
        ['💡','Пойми','На полезных фразах кино встаёт само: перевод и «когда пригодится». Прочитал — едет дальше.'],
        ['✍️','Проверь','После эпизода — все реплики, ★ отмечены фразы для заданий. Послушай и напиши: ошибёшься — подскажу буквы.'],
        ['🔁','Повторяй','Фраза вернётся через 1, 3, 7, 21 и 60 дней — так она остаётся в голове.']].map(([e,t,d],k)=>`<button class="it-s${k===I.demo?' on':''}" data-d="${k}"><i>${e}</i><span><b>${t}</b><small>${d}</small></span></button>`).join('')}</div>
      <button class="btn it-next" id="itNext">Дальше</button></div>`;
  else if(I.i===2)html=`<div class="it it2">${top}<h2 class="it-h">Что ты получаешь</h2><p class="it-p">Учёба — это не только задания. За каждую сцену что-то остаётся у тебя.</p>
      <div class="it-grid">${[['🃏','Карты фраз','Каждая выученная фраза — карта в Словаре. Собирай сцены целиком.'],
        ['🎞','Кадры и фоны','Эпизод — кадр-награда. Сцена — карточка и живой фон. Весь фильм — главный фон.'],
        ['🎟','Билеты','За эпизоды и финалы сцен. Тратишь в Магазине: эффекты, карты, заставки, звуки.'],
        ['⚔️','Дуэли с другом','Отправь ссылку: наперегонки на билеты или проходите вместе.'],
        ['🔥','Серия дней','Заходи каждый день — цель дня видно на главной.']].map(([e,t,d])=>`<div class="it-g"><i>${e}</i><b>${t}</b><span>${d}</span></div>`).join('')}</div>
      <button class="btn it-next" id="itNext">Дальше</button></div>`;
  else if(I.i===3)html=`<div class="it it3">${top}<h2 class="it-h">Настрой под себя</h2><p class="it-p">Всё это можно поменять потом в настройках.</p>
      <div class="it-set"><span class="it-l">Язык фильмов</span><div class="it-seg" data-k="lang"><button data-v="en" class="${I.lang==='en'?'on':''}">${FLAG.en} English</button><button data-v="de" class="${I.lang==='de'?'on':''}">${FLAG.de} Deutsch</button></div></div>
      <div class="it-set"><span class="it-l">Твой уровень</span><div class="it-seg two" data-k="lvl"><button data-v="a" class="${I.lvl!=='b'?'on':''}">Новичок<small>собираю фразы из кубиков</small></button><button data-v="b" class="${I.lvl==='b'?'on':''}">Знаю базу<small>пишу на слух сам</small></button></div></div>
      <div class="it-set"><span class="it-l">Субтитры</span><div class="it-seg" data-k="sz">${SUB_SZ.map(([k,l])=>`<button data-v="${k}" class="${(store.subSz||'m')===k?'on':''}">${l}</button>`).join('')}</div>
        <div class="sub-prev" aria-hidden="true"><div class="sc-v" data-ss="glass" style="background-image:url('${wolf?scCover(wolf):''}')"><div class="sc-subs"><div class="sline"><span class="en">Fuck the clients.</span></div><div class="sline s2"><span class="tr">Да похуй на клиентов.</span></div></div></div></div>
        <button class="it-tg${store.subSame!==false?' on':''}" data-t="subSame"><i></i>Перевод того же размера, что оригинал</button></div>
      <div class="it-set"><span class="it-l">Как смотреть</span><div class="it-seg two" data-k="pz"><button data-v="on" class="${scPauseOn()?'on':''}">⏸ С паузами<small>кино ждёт на фразах</small></button><button data-v="off" class="${scPauseOn()?'':'on'}">▶ Без пауз<small>объяснение поверх</small></button></div></div>
      <div class="it-set it-tgs"><button class="it-tg${store.fx!==false?' on':''}" data-t="fx"><i></i>Анимации</button><button class="it-tg${store.snd!==false?' on':''}" data-t="snd"><i></i>Звуки</button></div>
      <button class="btn it-next" id="itNext">Готово</button></div>`;
  else{const L=introScenes(I.lang);html=`<div class="it it4">${top}<h2 class="it-h">С чего начнём?</h2><p class="it-p">Первая сцена — короткая и понятная. Остальные — в Кинозале.</p>
      <div class="it-sc">${L.map(x=>`<button class="it-c" data-id="${x.id}"><i style="background-image:url('${scCover(x)}')"></i><span><small>${esc(dictFilm(x))}</small><b>${esc(x.sub||x.title)}</b><em>${'★'.repeat(Math.min(5,x.lvl||2))}<u>${'★'.repeat(5-Math.min(5,x.lvl||2))}</u> сложность · ${x.parts.length} ${plural(x.parts.length,['эпизод','эпизода','эпизодов'])}</em></span></button>`).join('')}</div>
      <button class="btn ghost it-next" id="itNext">На главную</button></div>`;}
  mount(html,'introscr');
  const done=go=>{store.onboarded=true;store.introV=1;store.langs=[I.lang];store.kinoLang=I.lang;store.lvl=I.lvl;if(!store.path)store.path='mix';save();INTRO=null;sfx('whoosh');haptic('medium');go();};
  $('#itSkip').onclick=()=>{sfx('tap');done(()=>renderHome());};
  $('#itNext').onclick=()=>{sfx('tap');haptic('light');if(I.i<INTRO_N-1){I.i++;renderIntro();}else done(()=>renderHome());};
  if(I.i===1){const set=k=>{I.demo=k;const v=$('.it-v');if(!v)return;v.dataset.st=k;$$('.it-s').forEach((x,j)=>x.classList.toggle('on',j===k));};
    set(I.demo);I.t=setInterval(()=>{if(!document.querySelector('.it1')){clearInterval(I.t);return;}set((I.demo+1)%4);},3600);
    $$('.it-s').forEach(b=>b.onclick=()=>{sfx('tap');clearInterval(I.t);set(+b.dataset.d);});}
  if(I.i===3){$$('.it-seg').forEach(g=>g.querySelectorAll('button').forEach(b=>b.onclick=()=>{g.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));sfx('sel');haptic('sel');const v=b.dataset.v,k=g.dataset.k;
      if(k==='lang')I.lang=v;if(k==='lvl')I.lvl=v;if(k==='sz'){store.subSz=v;applySubPrefs();}if(k==='pz')store.scPause=v;save();}));
    $$('.it-tg').forEach(b=>b.onclick=()=>{const k=b.dataset.t;store[k]=store[k]===false;b.classList.toggle('on',store[k]!==false);if(k==='fx'||k==='subSame')applyFx();save();sfx('sel');haptic('sel');});}
  if(I.i===4)$$('.it-c').forEach(b=>b.onclick=()=>{const id=b.dataset.id;done(()=>renderScene(id));});
  if(store.fx!==false){const el=document.querySelector('.it');if(el)el.querySelectorAll('.it-hero,.it-h,.it-p,.it-demo,.it-s,.it-g,.it-set,.it-c,.it-next').forEach((x,k)=>x.animate([{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'none'}],{duration:480,delay:80+Math.min(k,10)*55,easing:'cubic-bezier(.2,.9,.3,1)',fill:'backwards'}));}
}

/* ================= 13.9.19 — ПЕРВЫЙ ЗАПУСК: сразу к сцене =================
   Андрей (гайд до релиза): «новичок должен смотреть сцену через 30 секунд». Было 5 экранов обучения → теперь один экран:
   выбери сцену → сразу первый эпизод. Обучение (renderIntro) осталось в Настройках → «Как тут всё устроено».
   Игры, магазин, дуэли и коллекция у новичка спрятаны до первого пройденного эпизода (newbie), потом — «Открылось: …» (unlockSheet). */
const START_PICK={en:['titanic-boat','wolf-of-wall-street','american-psycho'],de:['titanic-mother-de','wolf-naomi-de','bb-knocks-de']};
function startScenes(lang){const L=START_PICK[lang].map(scOf).filter(s=>s&&!ageLock(s)&&flagOf('scene-'+s.id)==='on'&&flagOf(flagEpKey(s.id,0))==='on');return L.length?L:introScenes(lang);}
let START_ST=null;
function renderStart(){if(ndOn()){renderOnb(0);return;}   // 13.9.28: в «Новом» — первый запуск из 5 экранов
  const st=START_ST||(START_ST={lang:kinoLang(),lvl:store.lvl||'a'});screen='intro';backBtn(false);applySubPrefs();
  const sec=n=>n<60?`${Math.round(n)} сек`:`${Math.round(n/60*2)/2} мин`.replace('.',',');
  const card=x=>{const p=x.parts[0],bd=filmImg(x,'bdm.jpg');return `<button class="st-c" data-id="${x.id}"><i class="st-im" style="background-image:${bd?`url('${bd}'),`:''}url('${scCover(x)}')"></i><i class="st-sh"></i>
      <span class="st-t"><small>${esc(dictFilm(x))}</small><b>${esc(x.sub||x.title)}</b><em>▶ ${sec(p.b-p.a)} · ${esc(p.t)}</em></span></button>`;};
  mount(`<div class="st0"><div class="st-top"><span class="st-k">Языки по кино</span>
      <div class="st-lg">${['en','de'].map(l=>`<button data-l="${l}" class="${st.lang===l?'on':''}">${FLAG[l]} ${l==='en'?'English':'Deutsch'}</button>`).join('')}</div></div>
    <h1 class="st-h">Выбери сцену —<br>и смотри</h1><p class="st-p">Кусок настоящего кино${st.lang==='de'?' на немецком':''}. Нажми на любое слово — переведу. Полезные фразы объясню по ходу.</p>
    <div class="st-cs">${startScenes(st.lang).map(card).join('')}</div>
    <div class="st-lv"><span>Уровень</span><button data-v="a" class="${st.lvl!=='b'?'on':''}">Новичок</button><button data-v="b" class="${st.lvl==='b'?'on':''}">Знаю базу</button></div></div>`,'introscr stscr');
  $$('.st-lg [data-l]').forEach(b=>b.onclick=()=>{if(st.lang===b.dataset.l)return;sfx('sel');st.lang=b.dataset.l;renderStart();});
  $$('.st-lv [data-v]').forEach(b=>b.onclick=()=>{sfx('sel');haptic('sel');st.lvl=b.dataset.v;$$('.st-lv [data-v]').forEach(x=>x.classList.toggle('on',x===b));});
  $$('.st-c').forEach(b=>b.onclick=()=>{const id=b.dataset.id;sfx('whoosh');haptic('medium');
    store.onboarded=true;store.introV=1;store.newb=1;store.langs=[st.lang];store.kinoLang=st.lang;store.lvl=st.lvl;store.scSubChosen=true;if(!store.path)store.path='mix';save();START_ST=null;
    ev('start_pick',id);renderScEp(id,0);});
  if(store.fx!==false)$$('.st0 .st-h,.st0 .st-p,.st-c,.st-lv').forEach((x,k)=>x.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{duration:460,delay:60+k*70,easing:'cubic-bezier(.2,.9,.3,1)',fill:'backwards'}));}
/* ===== 13.9.28 — первый запуск «Нового» (как у Germanize, 5 экранов): цель и язык → уровень (свайп «знаю / ещё учу» по словам из наших сцен,
   разложенным по частотности, + выдуманные слова, как в LexTALE, + 4 вопроса грамматики) → минуты в день → «Привет, Андрей» и фраза дня от бота
   → «настраиваем под тебя» → сразу эпизод сцены по уровню. Только в «Новом» (админ); старый первый запуск (renderStart) — у игроков. ===== */
const ONB_GOALS=[['work','💼','Для работы'],['travel','✈️','Путешествовать'],['films','🎬','Смотреть кино без перевода'],['move','🏠','Переезд'],['self','🙂','Для себя']];
const ONB_MIN=[[5,'Пара фраз'],[10,'Один эпизод'],[15,'Эпизод и повторение'],[20,'Всерьёз']];
const CEFR_N=LVW;   // 13.9.71: слова уровней — LVW рядом с CEFR
// слова по уровням: частотность (первые 500 — A1, 500–1000 — A2, 1000–2000 — B1, 2000–4000 — B2, дальше — C1), все — из реплик наших сцен
const LT_W={en:[
  [['time','время'],['money','деньги'],['friend','друг'],['today','сегодня'],['happy','счастливый'],['water','вода'],['house','дом'],['work','работа']],
  [['street','улица'],['wife','жена'],['beautiful','красивый'],['easy','лёгкий'],['chance','шанс'],['song','песня'],['sometimes','иногда'],['ready','готовый']],
  [['tomorrow','завтра'],['funny','смешной'],['expect','ожидать'],['husband','муж'],['message','сообщение'],['agree','соглашаться'],['definitely','точно'],['unless','если не']],
  [['suddenly','вдруг'],['behavior','поведение'],['confidence','уверенность'],['maintain','поддерживать'],['escape','сбежать'],['fault','вина'],['revenue','выручка'],['fake','фальшивый']],
  [['desperate','отчаявшийся'],['sufficient','достаточный'],['reliable','надёжный'],['rely','полагаться'],['judgment','суждение'],['enormous','огромный'],['arrangement','договорённость'],['abhorrent','мерзкий']]],
 de:[
  [['die Zeit','время'],['gut','хорошо'],['der Kaffee','кофе'],['der Tisch','стол'],['der Vater','отец'],['lernen','учиться'],['gestern','вчера'],['das Wasser','вода']],
  [['vergessen','забыть'],['verstehen','понимать'],['die Idee','идея'],['früher','раньше'],['ziemlich','довольно'],['das Frühstück','завтрак'],['kochen','готовить'],['gern','охотно']],
  [['die Wahrheit','правда'],['ehrlich','честно'],['erwarten','ожидать'],['die Ordnung','порядок'],['persönlich','лично'],['entweder','либо'],['passieren','случиться'],['sobald','как только']],
  [['der Widerstand','сопротивление'],['die Behörden','власти'],['dringend','срочно'],['gemeinsam','общий'],['die Abteilung','отдел'],['der Augenblick','момент'],['genügend','достаточно'],['das Gerät','прибор']],
  [['langfristig','долгосрочно'],['unnötig','лишне'],['gesetzlich','по закону'],['hinterlassen','оставить после себя'],['erledigen','уладить'],['versteckt','спрятан'],['das Vergnügen','удовольствие'],['zugeben','признать']]]};
const LT_FAKE={en:['plimsy','crandle','fenstow','treaval'],de:['die Flomke','verlüsten','der Grabsel','bestrapen']};
// грамматика: первый вариант — верный (варианты перемешиваются), уровень вопроса — индекс CEFR
const LT_G={en:[[1,'She ___ to work every day.',['goes','go','going']],[1,'Yesterday I ___ him at the bar.',['saw','see','have seen']],
  [2,'I ___ here since 2019.',['have lived','live','am living']],[3,'If I ___ known, I would have called.',['had','have','would']]],
 de:[[0,'___ Kaffee ist heiß.',['Der','Die','Das']],[1,'Ich ___ gestern ins Kino gegangen.',['bin','habe','werde']],
  [2,'Ich helfe ___ Mann.',['dem','den','der']],[3,'Wenn ich Zeit ___, würde ich kommen.',['hätte','habe','hatte']]]};
let ONB=null;
const onbHTML=(n,body,foot)=>`<div class="onb"><div class="onb-top"><button class="onb-b" id="onbB" aria-label="Назад"${n||ONB.re?'':' hidden'}>${ui('back')}</button><div class="onb-dots">${[0,1,2,3,4].map(i=>`<i class="${i<n?'d':i===n?'on':''}"></i>`).join('')}</div>${n<4?`<button class="onb-skip" id="onbSkip">${ONB.re?'Закрыть':'Пропустить'}</button>`:`<span class="onb-n">5 из 5</span>`}</div>
  <div class="onb-body">${body}</div>${foot?`<div class="onb-foot">${foot}</div>`:''}</div>`;
function onbQuit(){if(!ONB)return;tgVSwipes(false);if(ONB.re){ONB=null;renderSettings();return;}onbFinish();}   // 13.9.29: повтор из Настроек — закрыть; новичок — пропустить вопросы, сразу сцена
function onbBack(){if(!ONB)return;if(ONB.st===0&&!ONB.lt){if(ONB.re)onbQuit();return;}if(ONB.st===1&&ONB.lt&&ONB.lt.ph!=='intro'){ONB.lt=null;renderOnb(1);return;}if(ONB.st>0)renderOnb(ONB.st-1);}
function onbMount(n,body,foot){ONB.st=n;screen='onb';backBtn(n>0||ONB.re);mount(onbHTML(n,body,foot),'onbscr');tgVSwipes(n===1);const b=$('#onbB');if(b)b.onclick=()=>{sfx('tap');onbBack();};
  const q=$('#onbSkip');if(q)q.onclick=()=>{sfx('tap');onbQuit();};
  if(fxOK())$$('.onb-body>*,.onb-foot').forEach((x,k)=>x.animate([{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'none'}],{duration:520,delay:40+k*70,easing:'cubic-bezier(.2,.9,.25,1)',fill:'backwards'}));}
function renderOnb(n){if(!ONB)ONB={st:0,lang:kinoLang(),goal:null,cefr:null,min:10,daily:store.daily!==false,re:!!store.onboarded};n=n||0;const O=ONB,nm=((userName()||'').trim().split(/\s+/)[0])||'';
  if(n===0){
    onbMount(0,`<h1 class="onb-h">Зачем тебе <span class="mk">${O.lang==='de'?'немецкий':'английский'}</span>?</h1>
      <div class="onb-lg">${['en','de'].map(l=>`<button data-l="${l}" class="${O.lang===l?'on':''}">${FLAG[l]} ${l==='en'?'English':'Deutsch'}</button>`).join('')}</div>
      <div class="onb-opts">${ONB_GOALS.map(([k,e,t])=>`<button class="onb-o${O.goal===k?' on':''}" data-g="${k}"><i>${e}</i><span>${t}</span><u></u></button>`).join('')}</div>`,
      `<button class="onb-go" id="onbGo"${O.goal?'':' disabled'}>Дальше</button>`);
    $$('.onb-lg [data-l]').forEach(b=>b.onclick=()=>{if(O.lang===b.dataset.l)return;sfx('sel');O.lang=b.dataset.l;O.lt=null;O.cefr=null;renderOnb(0);});
    $$('.onb-o').forEach(b=>b.onclick=()=>{O.goal=b.dataset.g;sfx('sel');haptic('sel');$$('.onb-o').forEach(x=>x.classList.toggle('on',x===b));$('#onbGo').disabled=false;});
    $('#onbGo').onclick=()=>{sfx('tap');renderOnb(1);};return;}
  if(n===1){onbLevel();return;}
  if(n===2){
    onbMount(2,`<h1 class="onb-h">Сколько <span class="mk">минут</span> в день?</h1><p class="onb-p">Начни с малого — серия важнее длинных заходов.</p>
      <div class="onb-min"><b id="onbMv">${O.min}</b><small>минут в день</small></div>
      <div class="onb-rule">${ONB_MIN.map(([m,t])=>`<button data-m="${m}" class="${O.min===m?'on':''}"><b>${m}</b><small>${t}</small></button>`).join('')}</div>`,
      `<button class="onb-go" id="onbGo">Дальше</button>`);
    $$('.onb-rule [data-m]').forEach(b=>b.onclick=()=>{O.min=+b.dataset.m;sfx('tick');haptic('sel');$$('.onb-rule [data-m]').forEach(x=>x.classList.toggle('on',x===b));const v=$('#onbMv');v.textContent=O.min;
      if(fxOK())v.animate([{transform:'scale(1.25)'},{transform:'none'}],{duration:380,easing:SPRING});});
    $('#onbGo').onclick=()=>{sfx('tap');renderOnb(3);};return;}
  if(n===3){const x=phraseOfDay(),s=x&&x.s,f=x&&x.f;
    onbMount(3,`<div class="onb-wave" aria-hidden="true">👋</div><h1 class="onb-hw">Привет${nm?', '+esc(nm):''}!</h1><p class="onb-p">Каждый день бот пришлёт в чат <b>фразу дня</b> — короткий момент из фильма с переводом.</p>
      ${f?`<div class="onb-bot"><div class="onb-ava">🎬</div><div class="onb-bub"><i class="onb-th" style="background-image:url('${assetUrl(scEpKey(s,f.pi,'jpg'))}'),url('${assetUrl(scKey(s,'cover.jpg'))}')"><u>▶</u></i>
        <small>🎬 Фраза дня · ${esc(dictFilm(s))}</small><b>${esc(s.lang==='de'?f.de:scT(f))}</b><span>${esc(f.ru)}</span><em>▶ Разобрать сцену</em></div></div>`:''}
      <button class="checkrow frame onb-dl" id="onbDl" aria-pressed="${O.daily}">${BOX}<span class="ct"><span class="cn">Присылать фразу дня</span><span class="cd">Раз в день, в 12:00. Выключить можно в настройках.</span></span></button>`,
      `<button class="onb-go" id="onbGo">Дальше</button>`);
    $('#onbDl').onclick=e=>{O.daily=!O.daily;e.currentTarget.setAttribute('aria-pressed',O.daily);sfx('sel');haptic('sel');};
    $('#onbGo').onclick=()=>{sfx('tap');renderOnb(4);};return;}
  if(n===4){const c=O.cefr||'A2',g=ONB_GOALS.find(x=>x[0]===O.goal),L=[`Уровень «${lvW(c)}» — подбираем сцены`,`${g?g[2]:'Цель'} — нужные фразы первыми`,`${O.min} минут в день — ${O.min>=15?'эпизод и повторение':O.min>=10?'один эпизод':'пара фраз'}`,O.daily?'Фраза дня — в 12:00 в чате с ботом':'Без фразы дня — включишь в настройках'];
    // 13.9.49 (движения Germanize, п.7): коллаж постеров «наших фильмов», слегка плавает
    const cols=SCENES.filter(x=>x.kind!=='clip'&&!ageLock(x)&&flagOf('scene-'+x.id)==='on'),stp=Math.max(1,Math.floor(cols.length/6));   // 13.9.60: коллаж онбординга без 18+ и скрытых сцен
    const collage=cols.filter((x,i)=>i%stp===0).slice(0,6).map((s,j)=>`<i style="background-image:url('${filmImg(s,'bdm.jpg')||assetUrl(scKey(s,'cover.jpg'))}');--fd:${(j*.35).toFixed(2)}s"></i>`).join('');
    onbMount(4,`<div class="onb-coll" aria-hidden="true">${collage}</div><h1 class="onb-h">Настраиваем <span class="mk">под тебя</span></h1>
      <div class="onb-ring"><svg viewBox="0 0 40 40"><circle class="bg" cx="20" cy="20" r="17" pathLength="100"/><circle class="fg" cx="20" cy="20" r="17" pathLength="100"/></svg><b id="onbPc">0%</b></div>
      <div class="onb-chk">${L.map(t=>`<div><i>✓</i><span>${esc(t)}</span></div>`).join('')}</div>`,'');
    const D=fxOK()?2600:300,t0=performance.now(),rows=$$('.onb-chk>div'),pc=$('#onbPc'),fg=$('.onb-ring .fg');
    const tick=t=>{if(!pc.isConnected)return;const k=Math.min(1,(t-t0)/D);pc.textContent=Math.round(k*100)+'%';fg.style.strokeDashoffset=100-k*100;
      rows.forEach((r,i)=>{if(!r.classList.contains('on')&&k>=(i+.6)/(rows.length+.6)){r.classList.add('on');sfx('tick');haptic('light');}});
      if(k<1)requestAnimationFrame(tick);else setTimeout(onbFinish,450);};
    requestAnimationFrame(tick);return;}}
// 13.9.38 (Андрей с iPhone: «свайпать нельзя»): смах карточки — общий обработчик: touch-action:none (CSS), быстрый короткий смах тоже считается,
// на время теста Telegram не закрывает приложение свайпом вниз (иначе он перехватывал жест и карточка отскакивала)
var ONB_VS=false;
function tgVSwipes(off){if(off===ONB_VS)return;ONB_VS=off;try{if(TG)off?(TG.disableVerticalSwipes&&TG.disableVerticalSwipes()):(TG.enableVerticalSwipes&&TG.enableVerticalSwipes());}catch(e){}}
// 13.9.40: на телефоне — touch-события (touchmove с preventDefault): pointer-события iPhone в WebView Telegram отменял (pointercancel), карточка отскакивала
const ONB_TD={s:0,m:0,c:0};
function onbDbg(){const d=$('#onbDbg');if(d)d.textContent=`касаний ${ONB_TD.s} · движений ${ONB_TD.m} · отмен ${ONB_TD.c}`;}
function onbSwipe(card,go,o){o=o||{};let x0=null,dx=0,vx=0,lx=0,lt=0;const k=v=>card.style.setProperty('--k',Math.max(0,Math.min(1,v/90))),u=v=>card.style.setProperty('--u',Math.max(0,Math.min(1,-v/90)));
  const back=()=>{card.style.transition='transform .45s cubic-bezier(.3,1.4,.5,1)';card.style.transform='';k(0);u(0);};
  const start=x=>{if(card._d)return false;x0=lx=x;lt=performance.now();dx=0;vx=0;card.style.transition='none';card.getAnimations().forEach(a=>{if(a.effect&&a.effect.target===card)a.cancel();});card.classList.add('drag');return true;};
  const move=x=>{if(x0==null)return;dx=x-x0;const t=performance.now();if(t>lt){vx=(x-lx)/(t-lt);lx=x;lt=t;}card.style.transform=`translateX(${dx}px) rotate(${dx/18}deg)`;k(dx);u(dx);};
  const up=()=>{if(x0==null)return;x0=null;card.classList.remove('drag');const fl=Math.abs(dx)>=40&&Math.abs(vx)>0.45&&Math.sign(vx)===Math.sign(dx);if(Math.abs(dx)>90||fl)go(dx>0);else{back();if(Math.abs(dx)<6&&o.tap)o.tap();}};
  if('ontouchstart' in window&&!onbPC()){
    card.addEventListener('touchstart',e=>{ONB_TD.s++;onbDbg();if(e.touches.length===1)start(e.touches[0].clientX);},{passive:true});
    card.addEventListener('touchmove',e=>{if(x0==null)return;e.preventDefault();ONB_TD.m++;move(e.touches[0].clientX);if(ONB_TD.m%5===0)onbDbg();},{passive:false});
    card.addEventListener('touchend',()=>{up();onbDbg();});card.addEventListener('touchcancel',()=>{ONB_TD.c++;up();onbDbg();});return;}
  card.addEventListener('pointerdown',e=>{if(start(e.clientX))try{card.setPointerCapture(e.pointerId);}catch(_){}});
  card.addEventListener('pointermove',e=>move(e.clientX));
  card.addEventListener('pointerup',up);card.addEventListener('pointercancel',up);card.addEventListener('lostpointercapture',up);}
// тест уровня: вводный экран → карточки (свайп или кнопки) → грамматика → итог «Твой уровень»
// 13.9.33 (P0.1, Андрей с ПК: «как мне смахнуть на пк?»): ПК — мышь; клавиши ← → в карточках, Enter — главная кнопка шага
const onbPC=()=>{try{return matchMedia('(hover:hover) and (pointer:fine)').matches;}catch(e){return false;}};
document.addEventListener('keydown',e=>{if(screen!=='onb'||e.metaKey||e.ctrlKey||e.altKey||/INPUT|TEXTAREA|SELECT/.test((e.target||{}).tagName||''))return;
  const k=e.key;if(k==='Enter'&&(e.target||{}).tagName==='BUTTON')return;const b=k==='ArrowRight'?$('#onbYes'):k==='ArrowLeft'?$('#onbNo'):k==='Enter'?$('#onbGo'):/^[0-3]$/.test(k)?$(`.onb-chs [data-n="${k}"]`):null;if(!b||b.disabled)return;e.preventDefault();b.click();});   // 24.10 (П4): 1–3 — вариант перевода, 0 — «Не знаю»
function onbLevel(){const O=ONB,lang=O.lang;
  if(!O.lt)O.lt={ph:'intro'};const T=O.lt;
  if(T.ph==='intro'){
    onbMount(1,`<h1 class="onb-h">Узнаем твой <span class="mk">уровень</span></h1><p class="onb-p">Слова — из реплик наших фильмов. ${onbPC()?'Знаешь слово — перетащи карточку вправо или нажми →. Ещё учишь — влево или ←.':'Знаешь слово — смахни вправо, ещё учишь — влево.'} Около минуты.</p>
      <div class="onb-demo"><div class="onb-dc l">ещё учу</div><div class="onb-dc c">${lang==='de'?'gestern':'tomorrow'}</div><div class="onb-dc r">знаю</div></div>`,
      `<button class="onb-go" id="onbGo">Начать тест</button><button class="onb-alt" id="onbPick">Знаю свой уровень</button>`);
    const start=()=>{sfx('tap');Object.assign(T,{ph:'w',b:2,i:0,seq:[],used:{},fakeAt:[3,7,11],chAt:[5,12],fk:0,fkW:[],ch:[],ck:null,ckA:{}});O.cefr=null;onbLevel();};$('#onbGo').onclick=start;
    {const dc=$('.onb-dc.c');if(dc)onbSwipe(dc,know=>{dc._d=1;sfx(know?'tick':'tap');haptic('sel');if(fxOK())dc.animate([{transform:dc.style.transform||'none'},{transform:`translateX(${know?420:-420}px) rotate(${know?18:-18}deg)`,opacity:0}],{duration:300,easing:'cubic-bezier(.4,0,.6,1)',fill:'forwards'}).onfinish=start;else start();},
      {tap:()=>{dc.animate([{transform:'none'},{transform:'translateX(26px) rotate(1.5deg)'},{transform:'none'}],{duration:520,easing:'cubic-bezier(.3,1.4,.5,1)'});}});}   // 13.9.38
    $('#onbPick').onclick=()=>{sfx('tap');T.ph='res';T.pick=1;onbLevel();};return;}
  if(T.ph==='w'){const N=15;if(T.i>=N){T.gi=0;T.gok=[];T.ck=onbCkList(T);T.ckA={};T.ph=T.ck.length?'chk':'g';onbLevel();return;}
    // 24.10 (П4, Андрей: «чуть более разнообразно, чем просто свайпы»): на 6-й и 13-й карточке — «выбери перевод из 3» (ответ весит в 1,5 раза больше свайпа)
    const fake=T.fakeAt.includes(T.i),ch=!fake&&(T.chAt||[]).includes(T.i);let w=null,wb=T.b;
    if(fake)w=[LT_FAKE[lang][T.fakeAt.indexOf(T.i)%LT_FAKE[lang].length],null];
    else{for(const d of [0,-1,1,-2,2]){const bb=T.b+d;if(bb<0||bb>4)continue;const pool=LT_W[lang][bb].filter(x=>!T.used[x[0]]);if(pool.length){w=pool[Math.floor(Math.random()*pool.length)];wb=bb;break;}}   // слова полосы кончились — соседняя, без повторов
      if(!w)w=LT_W[lang][T.b][0];T.used[w[0]]=1;}
    const art=lang==='de'&&/^(der|die|das) /.exec(w[0]),wd=`${art?`<em class="art a-${art[1]}">${art[1]}</em>`:''}<b>${esc(art?w[0].slice(4):w[0])}</b>`;
    if(ch){const opts=onbChOpts(lang,wb,w);
      onbMount(1,`<h1 class="onb-h sm">Что значит это слово?${onbPC()?'<small>Нажми 1, 2 или 3</small>':''}</h1><div class="onb-bar"><i style="width:${T.i/N*100}%"></i></div>
        <div class="onb-stack ch"><div class="onb-card nx"></div><div class="onb-card ch" id="onbCard">${wd}<small>выбери перевод</small></div></div>
        <div class="onb-chs">${opts.map(([t,ok],k)=>`<button class="onb-o" data-ok="${ok?1:0}" data-n="${k+1}"><span>${esc(t)}</span><u></u></button>`).join('')}<button class="onb-o onb-dk" data-ok="0" data-n="0"><span>Не знаю</span></button></div>`,'');
      const card=$('#onbCard');backBtn(false);
      $$('.onb-chs .onb-o').forEach(b=>b.onclick=()=>{if(card._d)return;card._d=1;const ok=b.dataset.ok==='1';
        if(ok)b.classList.add('on','ok');else{if(!b.classList.contains('onb-dk'))b.classList.add('bad');$$('.onb-chs [data-ok="1"]').forEach(x=>x.classList.add('on','ok'));}
        sfx(ok?'good':'nope');haptic(ok?'ok':'err');
        T.seq.push([wb,ok,1.5,w,'c']);T.ch.push(ok);T.b=Math.max(0,Math.min(4,T.b+(ok?1:-1)));T.i++;
        setTimeout(()=>{if(!card.isConnected)return;const fin=()=>onbLevel();
          if(fxOK())card.animate([{transform:'none'},{transform:'translateY(-36px) scale(.92)',opacity:0}],{duration:260,easing:'cubic-bezier(.4,0,.6,1)',fill:'forwards'}).onfinish=fin;else fin();},ok?650:1150);});
      return;}
    onbMount(1,`<h1 class="onb-h sm">Знаешь это слово?</h1><div class="onb-bar"><i style="width:${T.i/N*100}%"></i></div>
      <div class="onb-stack"><div class="onb-card nx"></div><div class="onb-card" id="onbCard">${wd}<small>${lang==='de'?'Deutsch':'English'}</small><span class="stp k">ЗНАЮ</span><span class="stp u">УЧУ</span><i class="onb-bd k" aria-hidden="true">✓</i><i class="onb-bd u" aria-hidden="true">↺</i></div></div>${FLAG_ADMIN&&!onbPC()?'<div class="onb-dbg" id="onbDbg"></div>':''}`,
      `<div class="onb-yn n-yn"><button class="onb-no" id="onbNo" aria-label="Ещё учу">${niSVG('repeat')}<small>учу</small></button><span class="n-ynh">${onbPC()?'← или →':'смахни карточку'}</span><button class="onb-yes" id="onbYes" aria-label="Знаю">${niSVG('check')}<small>знаю</small></button></div>`);
    const card=$('#onbCard');backBtn(false);onbDbg();   // 13.9.40: «‹ Назад» Telegram на карточках прятать — палец задевал
    const go=know=>{if(card._d)return;card._d=1;sfx(know?'tick':'tap');haptic('sel');
      if(fake){if(know){T.fk++;T.fkW.push(w[0]);}}else{T.seq.push([wb,know,1,w,'s']);T.b=Math.max(0,Math.min(4,T.b+(know?1:-1)));}
      T.i++;const fin=()=>onbLevel();
      if(fxOK()){card.animate([{transform:card.style.transform||'none'},{transform:`translateX(${know?420:-420}px) rotate(${know?18:-18}deg)`,opacity:0}],{duration:320,easing:'cubic-bezier(.4,0,.6,1)',fill:'forwards'}).onfinish=fin;}else fin();};
    onbSwipe(card,go);
    $('#onbYes').onclick=()=>go(true);$('#onbNo').onclick=()=>go(false);return;}
  // 24.10 (П4, Андрей: «добавь перевод слов в конце, чтобы чел понимал, знал или нет, и мог честно сказать «не знал» — тогда лвл понижался бы»):
  // слова, на которые сказал «знаю» (самые трудные, до 6), перевод под пылью; «Не знал» — запись в seq становится «не знаю», уровень сверху меняется сразу
  if(T.ph==='chk'){const R=T.ck,A=T.ckA,fk=(T.fkW||[]).slice(0,3),est=()=>ltEstimate({seq:T.seq,fk:T.fk,ckA:A,gok:[]}),c0=est();
    onbMount(1,`<h1 class="onb-h sm">Проверь себя<small>Ты сказал «знаю». Нажми на перевод — покажу. Честно: знал?</small></h1>
      <div class="onb-ckl"><span>уровень по словам</span><i id="onbCkL" class="l-${c0.toLowerCase()}">${lvW(c0)}</i></div>
      <div class="onb-ck">${R.map(j=>{const [wo,ru]=T.seq[j][3],ar=lang==='de'&&/^(der|die|das) /.exec(wo);
        return `<div class="onb-cr${j in A?(A[j]?' y':' n'):''}" data-j="${j}"><div class="onb-cw"><b>${ar?`<em class="art a-${ar[1]}">${ar[1]}</em> `:''}${esc(ar?wo.slice(4):wo)}</b>${ndSp(esc(ru),'onb-ct')}</div>
          <div class="onb-cb"><button class="y${A[j]===true?' on':''}" data-a="1">Знал</button><button class="n${A[j]===false?' on':''}" data-a="0">Не знал</button></div></div>`;}).join('')}${fk.length?`<div class="onb-cr fk"><div class="onb-cw"><b>${fk.map(f=>{const a=/^(der|die|das) /.exec(f);return (a?`<em class="art a-${a[1]}">${a[1]}</em> `:'')+esc(a?f.slice(4):f);}).join(' · ')}</b><small>${fk.length>1?'таких слов нет':'такого слова нет'} — а ты сказал «знаю»</small></div></div>`:''}</div>`,
      `<button class="onb-go" id="onbGo"${R.every(j=>j in A)?'':' disabled'}>Дальше</button>`);
    const L=$('#onbCkL'),go=$('#onbGo');let cur=c0;
    const upd=()=>{go.disabled=!R.every(j=>j in A);const c=est();if(c===cur)return;const dn=CEFR.indexOf(c)<CEFR.indexOf(cur);cur=c;const sw=()=>{L.textContent=lvW(c);L.className='l-'+c.toLowerCase();};
      if(dn){sfx('nope');haptic('err');}
      if(!fxOK()){sw();return;}
      L.animate([{transform:'none'},{transform:'rotateX(90deg)'}],{duration:150,easing:'ease-in'}).onfinish=()=>{sw();L.animate([{transform:'rotateX(-90deg)'},{transform:'none'}],{duration:420,easing:SPRING});};};
    $$('.onb-cr[data-j]').forEach(r=>{const j=+r.dataset.j;r.querySelectorAll('.onb-cb button').forEach(b=>b.onclick=e=>{const v=b.dataset.a==='1';A[j]=v;T.seq[j][1]=v;if(e&&e.detail)b.blur();   // мышью — снять фокус: Enter на ПК жмёт «Дальше»
      r.classList.toggle('y',v);r.classList.toggle('n',!v);r.querySelectorAll('.onb-cb button').forEach(x=>x.classList.toggle('on',x===b));
      const sp=r.querySelector('.n-sp:not(.open)');if(sp)sp.classList.add('open');
      sfx(v?'tick':'tap');haptic('sel');
      if(fxOK())(v?b:r).animate(v?[{transform:'scale(.88)'},{transform:'none'}]:[{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'none'}],{duration:v?320:340,easing:v?SPRING:'ease-out'});
      upd();});});
    go.onclick=()=>{if(go.disabled)return;sfx('tap');T.ph='g';onbLevel();};
    if(fxOK())$$('.onb-cr').forEach((r,k)=>r.animate([{opacity:0,transform:'translateX(28px)'},{opacity:1,transform:'none'}],{duration:420,delay:140+k*70,easing:'cubic-bezier(.2,.9,.25,1)',fill:'backwards'}));
    return;}
  if(T.ph==='g'){const G=LT_G[lang];if(T.gi>=G.length){T.ph='res';onbLevel();return;}
    const [lv,qq,opts]=G[T.gi],sh=shuffle(opts.map((o,k)=>[o,k===0]));
    onbMount(1,`<h1 class="onb-h sm">Немного грамматики <small>${T.gi+1} из ${G.length}</small></h1><div class="onb-bar"><i style="width:${(T.gi/G.length)*100}%"></i></div>
      <p class="onb-q">${esc(qq).replace('___','<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>')}</p>
      <div class="onb-opts">${sh.map(([o,ok])=>`<button class="onb-o" data-ok="${ok?1:0}"><span>${esc(o)}</span><u></u></button>`).join('')}<button class="onb-o onb-dk" data-ok="0"><span>Не знаю</span></button></div>`,'');
    $$('.onb-opts .onb-o').forEach(b=>b.onclick=()=>{if(T._g)return;T._g=1;const ok=b.dataset.ok==='1';b.classList.add('on',ok?'ok':'bad');sfx(ok?'good':'nope');haptic(ok?'ok':'err');
      if(!ok)$$('.onb-opts [data-ok="1"]').forEach(x=>x.classList.add('ok'));T.gok.push([lv,ok]);setTimeout(()=>{T._g=0;T.gi++;onbLevel();},ok?520:900);});return;}
  if(T.ph==='res'){if(!T.pick&&!O.cefr)O.cefr=ltEstimate(T);const c=O.cefr||'A2';
    onbMount(1,`<h1 class="onb-h">${T.pick?'Выбери свой уровень':'Твой уровень'}</h1>
      ${T.pick?'':`<div class="onb-lvl l-${c.toLowerCase()}" id="onbLv">${lvBars(c,'big')}<b>${lvW(c)}</b><span>уточним по твоим ответам</span></div>${onbWhyHTML(T)}<p class="onb-p" id="onbLvP">${onbLvP(c)}</p>`}
      <div class="onb-grid">${CEFR.map(k=>`<button data-c="${k}" class="l-${k.toLowerCase()}${O.cefr===k?' on':''}">${lvBars(k)}<small>${LVW[k]}</small></button>`).join('')}</div>`,
      `<button class="onb-go" id="onbGo"${O.cefr?'':' disabled'}>Дальше</button>`);
    if(!T.pick&&fxOK()){const lv=$('#onbLv');lv.animate([{transform:'scale(.6) rotate(-6deg)',opacity:0},{transform:'none',opacity:1}],{duration:650,easing:SPRING});setTimeout(()=>{fxAt(lv,{n:18,v:4.5,life:44});sfx('reward');},280);}
    $$('.onb-grid [data-c]').forEach(b=>b.onclick=()=>{O.cefr=b.dataset.c;sfx('sel');haptic('sel');$$('.onb-grid [data-c]').forEach(x=>x.classList.toggle('on',x===b));$('#onbGo').disabled=false;
      const lv=$('#onbLv');if(lv){lv.className='onb-lvl l-'+O.cefr.toLowerCase();lv.innerHTML=lvBars(O.cefr,'big')+'<b>'+lvW(O.cefr)+'</b><span>выбрал сам</span>';}const lp=$('#onbLvP');if(lp)lp.textContent=onbLvP(O.cefr);});
    $('#onbGo').onclick=()=>{sfx('tap');renderOnb(2);};}}
// оценка: где остановилась «лесенка» (среднее по последним 6 словам), минус выдуманные «знаю», поправка грамматикой
function ltEstimate(T){const S=T.seq.slice(-6),W=x=>x[2]||1,sw=S.reduce((a,x)=>a+W(x),0);let v=S.length?S.reduce((a,x)=>a+W(x)*(x[0]+(x[1]?.5:-.5)),0)/sw:1;
  v-=T.fk*.8+Math.min(1.2,onbNk(T)*.25);   // 24.10 (П4): у записи [полоса, знает, вес]; каждое честное «не знал» — ещё −0,25 (переоценил себя и в соседних словах), всего не больше −1,2
  const G=T.gok||[];let g=-1;for(const [lv,ok] of G){if(ok)g=Math.max(g,lv);}const gl=G.length?(G.filter(x=>x[1]).length?g:0):v;
  const r=Math.round((v*2+gl)/3);return CEFR[Math.max(0,Math.min(4,r))];}
// 24.10 (П4): «Проверь себя» — слова со свайпа «знаю», самые трудные (до 6, при равенстве — последние)
const ONB_CK=6;
function onbCkList(T){return T.seq.map((x,j)=>[x,j]).filter(([x])=>x[4]==='s'&&x[1]&&x[3]&&x[3][1]).sort((a,b)=>b[0][0]-a[0][0]||b[1]-a[1]).slice(0,ONB_CK).map(x=>x[1]);}
const onbNk=T=>T.ckA?Object.values(T.ckA).filter(v=>v===false).length:(T.nk||0);
// варианты к «выбери перевод»: та же полоса (потом соседние), та же часть речи (ruShape), без общего корня с верным
function onbChOpts(lang,b,w){const L=LT_W[lang],sh=ruShape(w[1]),st=new Set(ruStems(w[1])),fine=x=>x[0]!==w[0]&&x[1]!==w[1]&&!ruStems(x[1]).some(t=>st.has(t));
  const C=[...shuffle(L[b].filter(fine)),...shuffle([...(L[b-1]||[]),...(L[b+1]||[])].filter(fine))],P=[...C.filter(x=>ruShape(x[1])===sh),...C.filter(x=>ruShape(x[1])!==sh)];
  const out=[],seen=new Set();for(const x of P){if(seen.has(x[1]))continue;seen.add(x[1]);out.push([x[1],false]);if(out.length===2)break;}
  return shuffle([[w[1],true],...out]);}
// итог: за что такой уровень — одной строкой значков
function onbWhyHTML(T){const S=(T.seq||[]).filter(x=>x[4]==='s');if(!S.length)return '';const nk=onbNk(T),G=T.gok||[],C=T.ch||[],r=[];
  r.push(`знаю <b>${S.filter(x=>x[1]).length+nk} из ${S.length}</b>`);
  if(T.ck&&T.ck.length)r.push(`не знал <b${nk?' class="m"':''}>${nk}</b>`);
  if(C.length)r.push(`перевод <b${C.some(x=>!x)?' class="m"':''}>${C.filter(Boolean).length} из ${C.length}</b>`);
  r.push(`выдуманные <b${T.fk?' class="m"':''}>${T.fk?'попался '+T.fk:'не попался'}</b>`);
  if(G.length)r.push(`грамматика <b>${G.filter(x=>x[1]).length} из ${G.length}</b>`);
  return `<div class="onb-why">${r.map(x=>`<span>${x}</span>`).join('')}</div>`;}
function onbFinish(){const O=ONB;if(!O)return;tgVSwipes(false);const c=O.cefr||(O.lt&&O.lt.seq&&O.lt.seq.length>=4?ltEstimate(O.lt):'A2'),ci=CEFR.indexOf(c);   // 24.10: «Пропустить» посреди теста — уровень по уже данным ответам
  store.onboarded=true;store.introV=1;store.newb=1;store.langs=[O.lang];store.kinoLang=O.lang;store.cefr=c;store.lvl=ci<=1?'a':'b';store.lvR=ci+1.5;store.lvN=0;store.lvCh=0;store.goalWhy=O.goal;store.goal=O.min*2;store.daily=O.daily;store.scSubChosen=true;if(!store.path)store.path='mix';save();
  try{remindSync();}catch(e){}
  const L=SCENES.filter(s=>scLang(s)===O.lang&&!s.age&&flagOf('scene-'+s.id)!=='hide'&&s.kind!=='clip'),pick=(START_PICK[O.lang]||[]).map(scOf).filter(Boolean);
  const near=(A)=>A.slice().sort((a,b)=>Math.abs((a.lvl||3)-1-ci)-Math.abs((b.lvl||3)-1-ci))[0];
  const s=near(pick.length?pick:L)||L[0];ONB=null;ev('start_pick',s.id);ev('onb_done',c);sfx('whoosh');renderScEp(s.id,0);}
// 13.9.30: премиум за звёзды Telegram. Режим задаёт админ (Админка → «Премиум»): off — всё бесплатно, как раньше; feat — платные функции; scenes — ещё и сцены сверх бесплатных.
// Платное: повторение больше одного раза в день, подсказки без билетов, «Мои слова» больше 50, режиссёрская версия. Оплата и учёт — воркер (/api/prem), тут только показ и проверки.
const PREM={st:null},MYW_FREE=50,PREM_FEAT={rev:'Повторение на сегодня уже было — с премиумом повторяй сколько хочешь.',myw:`В «Моих словах» уже ${MYW_FREE} слов — с премиумом без лимита.`,dir:'Режиссёрская версия — в премиуме.',scene:'Эта сцена — в премиуме. Бесплатные сцены открыты всем.',hint:'',prof:''};
async function premCall(body){const id=(TG&&TG.initData)||window.__INIT;if(!id)return null;
  const r=await fetch(API+'/api/prem',{method:'POST',headers:{'content-type':'application/json','x-init-data':id},body:JSON.stringify(body)});if(!r.ok)return null;try{return await r.json();}catch(e){return null;}}
async function premLoad(){try{const r=await premCall({a:'st'});if(r&&r.ok){PREM.st=r;store.premC={mode:r.mode,until:r.until,plan:r.plan,rec:r.rec,trialUsed:r.trialUsed,prices:r.prices};save();}}catch(e){}return PREM.st;}
const premC=()=>PREM.st||store.premC||{};
const premMode=()=>premC().mode||'off';
const premHas=()=>(premC().until||0)>Date.now();
const premFree=s=>!s||(s.lvl||3)<=2||START_PICK.en.includes(s.id)||START_PICK.de.includes(s.id);
const premNeed=f=>{const m=premMode();if(m==='off'||premHas()||ADM_OPEN())return false;return f==='scene'?m==='scenes':true;};
const premDate=t=>{const d=new Date(t);return String(d.getDate()).padStart(2,'0')+'.'+String(d.getMonth()+1).padStart(2,'0')+'.'+d.getFullYear();};
setTimeout(premLoad,2800);setTimeout(phLoad,2500);   // 13.9.32: аналитика PostHog
setTimeout(()=>{try{wlvLoad();}catch(e){}},3200);   // 13.9.72: уровни слов (21 КБ) — для живого уровня в заданиях
// экран премиума: что даёт, пробные 7 дней, тарифы, оплата звёздами; у кого есть — статус и продление
function renderPaywall(why,back){back=back||(()=>renderTab(store.tab||'learn'));screen='prem';backBtn(true);PREM.back=back;ph('capture','prem_view',{why:why||''});
  const c=premC(),has=premHas(),pr=c.prices||{m:250,y:1500},tr=!c.trialUsed&&!has,pick=PREM.pick||'y',plan=c.plan;
  const ben=[['🔁','Повторение без лимита','бесплатно — один заход в день'],['💡','Подсказки без билетов','в заданиях на слух'],['⭐','«Мои слова» без лимита',`бесплатно — до ${MYW_FREE} слов`],['🎬','Режиссёрская версия','сцена целиком, без пауз и подсказок']];
  const st=has?(plan==='trial'?`Пробные дни до ${premDate(c.until)}`:plan==='gift'?`Подарок до ${premDate(c.until)}`:`Премиум до ${premDate(c.until)}`):'Учи по кино без ограничений';
  const nm=(userName()||'').trim().split(/\s+/)[0],D=c.trialDays||7;
  if(ndOn())mount(`<div class="n-scr n-pw${has?' has':''}">   <!-- 13.9.40: «Премиум» как в макете (.cell 15): заголовок с маркером, стеклянная карточка, шкала пробных дней, тарифы строками -->
    <div class="n-pw-top"><button class="n-pw-x" id="pwX" aria-label="Закрыть">${ui('close')}</button></div>
    <h3 class="n-h n-pwh">${nm?esc(nm)+', учи':'Учи'} <em class="n-mk">без лимитов</em></h3>
    ${why&&PREM_FEAT[why]?`<p class="n-mute">${esc(PREM_FEAT[why])}</p>`:''}
    <div class="n-pwc"><b>✦ Премиум</b><small>${esc(st)}</small><ul>${ben.map(([i,b,sm])=>`<li><i>${i}</i><span>${b}<small>${sm}</small></span></li>`).join('')}</ul></div>
    ${has&&plan==='m'?`<div class="n-pwrec"><span><b>${c.rec?'Продлевается сама':'Продление выключено'}</b><small>${c.rec?`следующее списание — ${premDate(c.until)}, ${pr.m} ⭐`:`премиум работает до ${premDate(c.until)}`}</small></span><button id="pwRec">${c.rec?'Отменить':'Включить'}</button></div>`:''}
    ${tr?`<div class="n-tln"><div><b>Сегодня</b><span>Всё открыто бесплатно на ${D} ${plural(D,['день','дня','дней'])}</span></div><div><b>День ${D}</b><span>Пробные дни заканчиваются сами — ничего не спишется. Дальше решаешь сам.</span></div></div>`:''}
    <div class="n-plans">
      <button class="pw-pl n-plan${pick==='m'?' on':''}" data-p="m"><span><b>Месяц</b><small>продлевается каждые 30 дней</small></span><em>⭐ ${pr.m}</em></button>
      <button class="pw-pl n-plan${pick==='y'?' on':''}" data-p="y"><i class="n-best">Выгоднее</i><span><b>Год</b><small>≈ ${Math.round(pr.y/12)} ⭐ в месяц · одной оплатой</small></span><em>⭐ ${pr.y}</em></button>
    </div>
    ${tr?`<button class="n-pbtn" id="pwTrial">Попробовать ${D} ${plural(D,['день','дня','дней'])}</button><button class="n-pw-alt" id="pwBuy">Сразу оформить за ${pick==='y'?pr.y:pr.m} ⭐</button>`:`<button class="n-pbtn" id="pwBuy">${has?'Продлить':'Оформить'} за ${pick==='y'?pr.y:pr.m} ⭐</button>`}
    ${FLAG_ADMIN?`<button class="n-pw-alt" id="pwTest">Админ: тест оплаты за 1 ⭐ (на день)</button>`:''}
    <p class="n-pw-f">Оплата звёздами Telegram · сцены всегда бесплатно<small>Месяц продлевается сам раз в 30 дней — отменить можно здесь или в Telegram → «Мои звёзды». Год само не продлевается.</small></p>
  </div>`,'premscr');
  else mount(`<div class="pw${has?' has':''}">
    <div class="pw-top"><button class="pw-x" id="pwX" aria-label="Закрыть">${ui('close')}</button></div>
    <div class="pw-card"><i class="pw-holo"></i><i class="pw-gl"></i><span class="pw-eb">${esc(APP_NAME)}</span><b>Премиум</b><small>${esc(st)}</small><em class="pw-star">★</em></div>
    ${why&&PREM_FEAT[why]?`<p class="pw-why">${esc(PREM_FEAT[why])}</p>`:''}
    ${has?`<div class="pw-me">${plan==='m'?`<div class="pw-rec"><span><b>${c.rec?'Продлевается сама':'Продление выключено'}</b><small>${c.rec?`следующее списание — ${premDate(c.until)}, ${pr.m} ⭐`:`премиум работает до ${premDate(c.until)}`}</small></span><button class="pw-sm" id="pwRec">${c.rec?'Отменить':'Включить'}</button></div>`:''}</div>`:''}
    <h1 class="pw-h">${has?'Продлить':'Что даёт <span class="mk">премиум</span>'}</h1>
    ${has?'':`<ul class="pw-ben">${ben.map(([i,b,s])=>`<li><i>${i}</i><span><b>${b}</b><small>${s}</small></span></li>`).join('')}</ul>`}
    ${tr?`<div class="pw-tl"><div><i class="on"></i><span><b>Сегодня</b><small>всё открыто на ${c.trialDays||7} дней</small></span></div><div><i></i><span><b>Через ${c.trialDays||7} дней</b><small>пробные дни закончатся сами — ничего не спишется</small></span></div></div>`:''}
    <div class="pw-plans">
      <button class="pw-pl${pick==='y'?' on':''}" data-p="y"><em>Выгоднее · −50 %</em><b>Год</b><span>${pr.y} ⭐</span><small>≈ ${Math.round(pr.y/12)} ⭐ в месяц · одной оплатой</small></button>
      <button class="pw-pl${pick==='m'?' on':''}" data-p="m"><b>Месяц</b><span>${pr.m} ⭐</span><small>подписка · отменить в любой момент</small></button>
    </div>
    <div class="pw-foot">
      ${tr?`<button class="pw-go" id="pwTrial">Попробовать ${c.trialDays||7} дней бесплатно</button><button class="pw-alt" id="pwBuy">Сразу оформить за ${pick==='y'?pr.y:pr.m} ⭐</button>`:`<button class="pw-go" id="pwBuy">${has?'Продлить':'Оформить'} за ${pick==='y'?pr.y:pr.m} ★</button>`}
      ${FLAG_ADMIN?`<button class="pw-alt" id="pwTest">Админ: тест оплаты за 1 ⭐ (на день)</button>`:''}
      <p class="pw-fine">Оплата звёздами Telegram. Месяц продлевается сам раз в 30 дней — отменить можно здесь или в настройках Telegram → «Мои звёзды». Год само не продлевается.</p>
    </div></div>`,'premscr');
  $('#pwX').onclick=()=>{sfx('tap');back();};
  $$('.pw-pl').forEach(b=>b.onclick=()=>{sfx('sel');haptic('sel');PREM.pick=b.dataset.p;$$('.pw-pl').forEach(x=>x.classList.toggle('on',x===b));const k=$('#pwBuy');if(k)k.textContent=k.textContent.replace(/\d+ ([⭐★])/,(m,z)=>`${PREM.pick==='y'?pr.y:pr.m} ${z}`);});
  if($('#pwTrial'))$('#pwTrial').onclick=async e=>{const b=e.currentTarget;b.disabled=true;const r=await premCall({a:'trial'}).catch(()=>null);b.disabled=false;
    if(!r||!r.ok){toast((r&&r.msg)||'Нет связи с сервером — попробуй позже');return;}PREM.st=r;store.premC=Object.assign({},store.premC,{mode:r.mode,until:r.until,plan:r.plan,rec:r.rec,trialUsed:true,prices:r.prices});save();premYay(why);};
  if($('#pwBuy'))$('#pwBuy').onclick=e=>premBuy(PREM.pick||'y',e.currentTarget,why);
  if($('#pwTest'))$('#pwTest').onclick=e=>premBuy('t',e.currentTarget,why);
  if($('#pwRec'))$('#pwRec').onclick=async e=>{const b=e.currentTarget;b.disabled=true;const r=await premCall({a:'renew',on:!c.rec}).catch(()=>null);b.disabled=false;
    if(!r||!r.ok){toast((r&&r.msg)||'Не получилось — попробуй позже');return;}PREM.st=r;store.premC=Object.assign({},store.premC,{rec:r.rec,until:r.until});save();toast(r.rec?'Продление включено':'Продление выключено — премиум работает до конца оплаченного месяца');renderPaywall(why,back);};
  if(fxOK()&&!ndOn()){const cd=$('.pw-card');if(cd)cd.animate([{transform:'translateY(30px) rotateX(18deg) scale(.92)',opacity:0},{transform:'none',opacity:1}],{duration:700,easing:SPRING});
    $$('.pw-ben li,.pw-pl,.pw-tl>div').forEach((x,k)=>x.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{duration:500,delay:160+k*60,easing:'cubic-bezier(.2,.9,.25,1)',fill:'backwards'}));}}
async function premBuy(plan,btn,why){btn.disabled=true;const r=await premCall({a:'inv',plan}).catch(()=>null);btn.disabled=false;
  if(!r||!r.ok||!r.url){toast((r&&r.msg)||'Оплата пока недоступна — нужен бот 13.9.30');return;}sfx('tap');
  const cb=st=>{if(st==='paid')premAfterPay(why);else if(st==='failed')toast('Оплата не прошла');};
  try{if(TG&&TG.openInvoice){TG.openInvoice(r.url,cb);return;}}catch(e){}
  try{if(TG&&TG.openTelegramLink){TG.openTelegramLink(r.url);return;}}catch(e){}window.open(r.url,'_blank');}
// после оплаты бот получает платёж чуть позже — спрашиваем сервер, пока не увидим продление
async function premAfterPay(why){const was=premC().until||0;toast('Оплата прошла — включаю премиум…');
  for(let k=0;k<10;k++){await premLoad();if((premC().until||0)>Math.max(was,Date.now()))break;await new Promise(r=>setTimeout(r,1500));}
  if(premHas())premYay(why);else toast('Премиум включится через минуту — бот пришлёт сообщение');}
function premYay(why){ph('capture','prem_on',{why:why||'',plan:premC().plan||''});sfx('reward');haptic('ok');if(fxOK())fxRain(60);toast(premC().plan==='trial'?`Пробные дни до ${premDate(premC().until)} ⭐`:`Премиум до ${premDate(premC().until)} ⭐`);
  if(screen==='prem')renderPaywall(null,PREM.back);}
const premGate=(f,back)=>{if(!premNeed(f))return false;renderPaywall(f,back);return true;};
// там, где уходить с экрана нельзя (слово из видео) — шторка «нужен премиум»
function premAsk(f){document.querySelectorAll('.pwa').forEach(x=>x.remove());const w=document.createElement('div');w.className='pwa';
  w.innerHTML=`<div class="pwa-b"><b>⭐ Это в премиуме</b><p>${esc(PREM_FEAT[f]||'')}</p><div><button class="pw-go" data-x="go">Подробнее</button><button class="pw-alt" data-x="no">Не сейчас</button></div></div>`;
  document.body.appendChild(w);requestAnimationFrame(()=>w.classList.add('on'));sfx('hint');haptic('sel');
  const close=()=>{w.classList.remove('on');setTimeout(()=>w.remove(),260);};
  w.onclick=e=>{const x=e.target.closest('[data-x]');if(e.target===w||(x&&x.dataset.x==='no')){close();return;}
    if(x&&x.dataset.x==='go'){w.remove();renderPaywall(f,()=>renderTab(store.tab||'learn'));}};}
// новичок = ещё ни одного пройденного эпизода. Первый пройденный → всё открывается, на Главной один раз «Открылось: …»
function newbie(){if(store.unl||ADM_OPEN())return false;
  for(const k in SC){const P=SC[k];if(P&&P.done&&P.done.length){store.unl=1;if(store.newb){store.unlNew=1;delete store.newb;}save();return false;}}
  return true;}
function unlockSheet(){if(!store.unlNew||screen!=='home'||store.tab!=='learn')return;delete store.unlNew;save();
  const w=document.createElement('div');w.className='sc-sheetwrap unl';
  w.innerHTML=`<div class="sc-sheet unl-s"><b class="unl-h">Первый эпизод пройден 🎉</b><p>Открылось:</p>
    <div class="unl-l">${[['⚔️','Дуэли с другом','на странице сцены'],['🏆','Коллекция','кадры, карточки и живые фоны'],['🛍','Магазин','эффекты и карты за билеты']].map(([e,t,d])=>`<div><i>${e}</i><span><b>${t}</b><small>${d}</small></span></div>`).join('')}</div>
    <button class="btn" data-close>Круто</button></div>`;
  document.body.appendChild(w);sfx('reward');haptic('success');
  w.onclick=e=>{if(e.target===w||e.target.closest('[data-close]')){w.remove();}};}

/* ================= 13.9.17: «Фраза дня» от бота — кнопка «Разобрать сцену» (startapp=dp_<сцена>_<эпизод>_<фраза>) ================= */
// Открывает Главную (или обучение у новичка) и поверх — этот момент: видео реплики, слова нажимаются, «Открыть эпизод →».
function dpOpen(p,boot){const m=/^dp_([a-z0-9-]+)_(\d+)_(\d+)$/.exec(p||'');if(!m)return false;const s=scOf(m[1]),pi=+m[2],f=s&&s.parts[pi]&&s.parts[pi].ph[+m[3]];if(!f)return false;
  if(boot){if(store.onboarded)renderHome();else renderStart();}   // 13.9.19: новичок — экран выбора сцены, момент поверх
  ev('daily_open',s.id);setTimeout(()=>momOpen(s.id,pi,f.a+0.05),boot?700:0);return true;}

/* ================= старт ================= */
let START='';
try{
  const u=new URLSearchParams(location.search);
  START=(TG&&TG.initDataUnsafe&&TG.initDataUnsafe.start_param)||u.get('tgWebAppStartParam')||u.get('startapp')||'';
  try{if(sessionStorage.getItem('__ver_st')){sessionStorage.removeItem('__ver_st');START='';}}catch(e){}   // 13.9.36: перезагрузка на новую версию — ссылку-приглашение второй раз не открываем
  const q=u.get('lang')||START;
  if(q==='de'||q==='en')PARAM_LANG=q;
}catch(e){}
// 12.3: кто прошёл сцену до 12.3 — карточка сегмента и фон выдаются молча
try{SCENES.forEach(x=>{if(segDone(x)&&!segHas(x))segGive(x);seasonGive(x);showGive(x);});}catch(e){}   // 13.9.74: прошедшим сезон раньше — фон сезона молча
setTimeout(()=>bgStLoad().then(st=>{if(!Object.values(st).some(x=>x&&x.ok))return;const a=document.getElementById('appbg');if(a)a.dataset.k='';try{appBgApply();}catch(e){}
  if(screen==='coll'&&!document.querySelector('.bgvw'))try{renderCollection(store.collTab);}catch(e){}}),3600);   // 13.9.74: какие новые ролики фонов уже можно показывать
initTG();
applyFx();shopApply();
// 13.9.43: «С паузами» снова у всех один раз — без пауз объяснения фраз пролетали, и казалось, что фраз нет совсем
if(store.scPauseV!==1){store.scPause='on';store.scPauseV=1;save();}
try{const own=(store.shop&&store.shop.own)||{},n=Object.keys(own).filter(k=>/^hm:./.test(k)).length;if(n&&!store.hmRefund){store.hmRefund=1;store.gold=(store.gold||0)+150*n;save();setTimeout(()=>toast(`Музыку убрали из магазина — вернули 🎟 ${150*n}`),2500);}}catch(e){}   // 13.9.19
ensureTabbar();splash();
if(/^kv_[A-Za-z0-9]{5}$/.test(START)){if(flagOf('kino')!=='on'){if(store.onboarded)renderHome();else startOnboarding();}else kvJoin(START.slice(3).toUpperCase());}   // 11.0: дуэль по сцене
else if(START==='rev'&&store.onboarded){renderHome();setTimeout(startRevChain,600);}
else if(/^dp_[a-z0-9-]+_\d+_\d+$/.test(START)&&dpOpen(START,true)){}   // 13.9.17: «Фраза дня» от бота → этот момент из фильма
else if(START==='kino'&&store.onboarded)renderTab('kino');   // 13.6.3: закрытый Кинозал renderTab покажет сам (gateLink смотрел флаг игр)
else if(store.onboarded)renderHome();else renderStart();   // 13.9.19: новичок — сразу выбор сцены (обучение — в настройках)
/* 13.9.36 (ТЗ P1.3): автообновление. Telegram держит открытое приложение в памяти, а GitHub Pages отдаёт новые файлы при любом ?v= —
   старый app.js + новый лениво загруженный файл = падение (13.9.31). version.txt ≠ APP_V → одна перезагрузка, только на вкладках и без открытых окон. */
var VER={at:0,want:null,tm:0};
function verCheck(){if(location.protocol==='file:'||document.hidden)return;const n=Date.now();if(n-VER.at<60000)return;VER.at=n;
  fetch('version.txt?'+n,{cache:'no-store'}).then(r=>r.ok?r.text():'').then(t=>{t=String(t||'').trim();if(!/^\d+(\.\d+)+$/.test(t)||t===APP_V)return;VER.want=t;verGo();}).catch(()=>{});}
const VER_BUSY='.momo,.kno,.pfv,.pwa,.modal,.sc-sheetwrap,.dxo,.bgvw,.stl,.kw-pop.on,.rwo,.pk-wrap,.cd2';
function verGo(){if(!VER.want)return;
  let done='';try{done=sessionStorage.getItem('__ver_r')||'';}catch(e){return;}if(done===VER.want){clearInterval(VER.tm);return;}   // уже перезагружались на эту версию — без петли
  if(document.hidden||!(screen==='home'||screen==='subtab')||document.querySelector(VER_BUSY)){if(!VER.tm)VER.tm=setInterval(verGo,4000);return;}   // эпизод, проверка, дуэль, оплата, окно — ждём
  clearInterval(VER.tm);try{sessionStorage.setItem('__ver_r',VER.want);sessionStorage.setItem('__ver_st','1');}catch(e){return;}
  try{cloudFlush();}catch(e){}
  const u=new URLSearchParams(location.search);u.set('r',Date.now());setTimeout(()=>location.replace(location.pathname+'?'+u+location.hash),250);}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)verCheck();});
setTimeout(verCheck,2000);
setTimeout(remindSync,3000);setTimeout(()=>ev('open'),1200);setTimeout(labApply,1500);setTimeout(labApply,4000);

/* ============ 13.9.57 — ИГРЫ (вкладка «Игры»): Deadlock · диалоги героев ============
   Режимы (отдельные кнопки): «Диалоги» — герой → диалог → экран-дуэль (слева/справа герои,
   реплики пузырями «изо рта», внизу незаметный прогресс); «Выборка» — отметить героев,
   реплики приходят порциями; «Рандом» — случайная реплика по полезности.
   Вид списка: сетка «как в игре» / списком; сортировка А-Я / по полезности; слайдер размера.
   Портреты: h.img (R2) — если нет, плитка-инициалы. Данные: data/games.json → __DATA.GAMES. */
const GM={pick:new Set(),por:null,dlg:null,hero:null,mode:'browse'};
var gmSnd=null;   // 13.9.64: один аудио-плеер — войс реальных реплик ДД (data/games.json, l.a → R2). var (не let) — чтобы был виден как window.gmSnd в тестах/консоли
function gmPlay(u,btn){try{if(gmSnd){gmSnd.pause();}const pb=document.querySelector('.dd-voice.on');if(pb&&pb!==btn)pb.classList.remove('on');
  if(!u)return;gmSnd=new Audio(u);if(btn)btn.classList.add('on');
  gmSnd.onended=gmSnd.onerror=()=>{if(btn)btn.classList.remove('on');gmSnd=null;};
  gmSnd.play().catch(()=>{if(btn)btn.classList.remove('on');});}catch(e){}}
function gmData(){const D=window.__DATA&&window.__DATA.GAMES;return D&&D.deadlock||null;}
function gmHeroesAll(){const g=gmData();return g?g.heroes||[]:[];}   // 13.9.63: все герои, включая ещё без анимированных портретов
const gmAlive=h=>!!(h&&h.img&&/\.mp4($|\?)/i.test(h.img));   // 13.9.63: у героя есть анимированный портрет (видео в R2)
const gmDialogOK=d=>(d.lines||[]).every(l=>gmAlive(gmHeroesAll().find(x=>x.name===l.s)));   // 13.9.63 (правило Андрея): фразы только между героями с анимированными портретами
function gmHeroes(){return gmHeroesAll().filter(h=>(h.dialogs||[]).some(gmDialogOK));}   // 13.9.63: в списках — только герои с живыми диалогами
function gmHero(id){return gmHeroesAll().find(h=>h.id===id);}
function gmDlgs(h){return (h.dialogs||[]).filter(gmDialogOK);}   // 13.9.63: живые диалоги героя
function gmUse(h){return gmDlgs(h).reduce((m,d)=>Math.max(m,d.use||0),0);}
function gmAllLines(hs){const out=[];(hs||gmHeroes()).forEach(h=>gmDlgs(h).forEach(d=>d.lines.forEach(l=>out.push({h,d,l}))));return out;}
function gmFace(h,big){const in2=(h.name||'?').split(/[\s&]+/).filter(Boolean).map(w=>w[0]).slice(0,2).join('').toUpperCase();
  const hue=((h.id||'x').split('').reduce((a,c)=>a+c.charCodeAt(0),0)*37)%360;
  if(big&&gmAlive(h)){const u=assetUrl(h.img);   // 13.9.63: видео-портрет — только крупно (дуэль), в списках — статичные иконки с офиц. артов
    return `<div class="gm-face gm-vwrap"><video class="gm-vid" src="${esc(u)}" autoplay muted loop playsinline preload="metadata"></video></div>`;}
  const ic=h.icon?assetUrl(h.icon):(h.img&&!/\.mp4($|\?)/i.test(h.img)?assetUrl(h.img):null);
  if(ic)return `<div class="gm-face" style="background-image:url('${esc(ic)}')"></div>`;
  return `<div class="gm-face gm-ph" style="--h:${hue}">${esc(in2)}</div>`;}
function gmDots(h){const u=Math.min(5,gmUse(h)||0);return u?`<i class="gm-dots">${'●'.repeat(u)}${'○'.repeat(5-u)}</i>`:'';}   // 13.9.60: clamp — repeat(5-u) падал при use>5
// 13.9.62: игра как «фильм» — страница игры из «Кино → Игры» (вкладки «Игры» больше нет). Внутри — движок диалогов (герои → диалоги, выборка, рандом)
function renderGameScreen(gid){const GS=window.__DATA&&window.__DATA.GAMES||{},g=GS[gid];if(!g){renderTab('kino');return;}
  screen='show';backBtn(true);setWorld('neutral');GM.mode='browse';GM.hero=null;GM.dlg=null;GM.por=null;GM.pick.clear();
  mount(`<div class="n-scr n-gam"><div class="n-gamtop"><button class="gm-back" id="gmBackB">← Сцены</button></div><div class="gm-root anim" id="gmRoot"><div class="gm-wait">Загружаю…</div></div></div>`,'tabscr showscr');
  gmMount();
  const bb=$('#gmBackB');if(bb)bb.onclick=()=>{sfx('tap');haptic('sel');renderTab('kino');};
}
function gamesTabHTML(){return `<h1 class="title anim">Игры</h1><div class="gm-root anim" id="gmRoot"><div class="gm-wait">Загружаю…</div></div>`;}
function bindGames(){setTimeout(gmMount,50);}
function gmMount(){
  const r=$('#gmRoot');if(!r)return;
  if(!gmData()){r.innerHTML='<div class="gm-wait">Дедлок ещё в пути — данные не загрузились.<br>Обнови приложение позже.</div>';return;}
  r.innerHTML=gmHTML();gmBind();
}
function gmHTML(){
  const modes=[['browse','Диалоги'],['pick','Выборка'],['rnd','Рандом']];
  return `<div class="gm-head"><div class="gm-game"><b>Deadlock</b><span>диалоги героев · ${(()=>{const n=gmHeroes().length;return n+' '+plural(n,['герой','героя','героев']);})()}</span></div>
    <div class="gm-modes">${modes.map(m=>`<button data-gm="${m[0]}" class="${GM.mode===m[0]?'on':''}">${m[1]}</button>`).join('')}</div></div>
    ${dvDialogs().length?'<button class="dv-cta" data-dv="1"><b>⚔️ Versus с другом</b><small>Бой героев: 3 раунда, голоса из игры, урон — твои очки</small></button>':''}
    <div id="gmBody">${GM.mode==='browse'?(GM.dlg?gmDuelHTML():GM.hero?gmHeroHTML():gmBrowseHTML()):GM.mode==='pick'?gmPickHTML():gmRndHTML()}</div>`;
}
function gmBrowseHTML(){
  const hs=gmHeroes(),cols=6-(store.gmCols||3);
  const sorted=[...hs].sort((a,b)=>store.gmSort==='abc'?a.name.localeCompare(b.name):(gmUse(b)-gmUse(a)||a.name.localeCompare(b.name)));
  const cards=sorted.map(h=>{const n=gmDlgs(h).length;
    return (store.gmView==='list'
      ?`<button class="gm-row${n?'':' gm-soon'}" data-h="${h.id}">${gmFace(h)}<div class="gm-rowt"><b>${esc(h.name)}</b><span>${n?n+' '+(n===1?'диалог':n<5?'диалога':'диалогов'):'скоро'}</span></div>${gmDots(h)}</button>`
      :`<button class="gm-card${n?'':' gm-soon'}" data-h="${h.id}">${gmFace(h)}<b>${esc(h.name)}</b><span>${n?n+' диалога':'скоро'}</span>${gmDots(h)}</button>`);}).join('');
  return `<div class="gm-ctl">
    <div class="gm-chips"><b>Сортировка</b><button data-sort="abc" class="${store.gmSort==='abc'?'on':''}">А-Я</button><button data-sort="use" class="${store.gmSort!=='abc'?'on':''}">По полезности</button></div>
    <div class="gm-chips"><b>Вид</b><button data-view="grid" class="${store.gmView!=='list'?'on':''}">Как в игре</button><button data-view="list" class="${store.gmView==='list'?'on':''}">Списком</button></div>
    <div class="gm-sl"><b>Размер</b><input id="gmSize" type="range" min="1" max="4" step="1" value="${store.gmCols||3}"></div></div>
    <div class="gm-${store.gmView==='list'?'list':'grid'}" style="--gmcols:${cols}">${cards}</div>`;
}
function gmHeroHTML(){
  const h=GM.hero;
  return `<button class="gm-back" data-back="1">← Все герои</button>
  <div class="gm-herohead">${gmFace(h)}<div><b>${esc(h.name)}</b><span>${esc(h.role||'')}</span></div></div>
  ${(gmDlgs(h)||[]).slice().sort((a,b)=>(b.use||0)-(a.use||0)).map((d,i)=>{
    const other=d.lines.map(l=>l.s).find(s=>s!==h.name)||'';
    return `<button class="gm-dlg" data-d="${i}"><span class="gm-ctx">${esc(d.ctx)}</span><p>«${esc(d.lines[0].en)}»</p><div class="gm-dlgm"><span>с ${esc(other)} · ${d.lines.length} реплик</span>${gmDots({dialogs:[d],id:h.id})}</div></button>`;}).join('')}`;
}
function gmDuelHTML(){
  const h=GM.hero,d=GM.dlg;const other=d.lines.map(l=>l.s).find(s=>s!==h.name)||'';
  const hB=gmHeroesAll().find(x=>x.name===other)||{id:other,name:other};
  return `<button class="gm-back" data-back="2">← ${esc(h.name)}</button>
  <div class="dd-duel" id="ddStage">
    <div class="dd-sides"><div class="dd-side">${gmFace(h,1)}<b>${esc(h.name)}</b></div><div class="dd-vs">VS</div><div class="dd-side">${gmFace(hB,1)}<b>${esc(other)}</b></div></div>
    <div class="dd-bubwrap" id="ddBub"></div>
    <div class="dd-hint">нажми — дальше</div></div>
  <div class="dd-prog"><i id="ddProg"></i></div>
  <div class="dd-vocab" id="ddVoc"></div>`;
}
function gmBubble(i){
  const d=GM.dlg,h=GM.hero,l=d.lines[i];if(!l)return null;
  const left=l.s===h.name;
  const au=l.a?`<button class="dd-voice" data-au="${esc(assetUrl(l.a))}" aria-label="прослушать реплику">▸</button>`:'';   // 13.9.64: войс реальной игровой реплики
  return `<div class="dd-bub ${left?'lf':'rt'}"><div class="dd-who-row"><span class="dd-who">${esc(l.s)}</span>${au}</div><div class="dd-en">${esc(l.en)}</div><div class="dd-ru">${esc(l.ru)}</div></div>`;
}
function gmDuelStep(i){
  const b=gmBubble(i),box=$('#ddBub');if(!b)return;
  box.insertAdjacentHTML('beforeend',b);
  box.lastElementChild.querySelectorAll('.dd-voice[data-au]').forEach(btn=>btn.onclick=e=>{e.stopPropagation();haptic('medium');gmPlay(btn.dataset.au,btn);});   // 13.9.64: пузырь добавлен ПОСЛЕ gmBind — вешаем ▸ вручную
  box.querySelectorAll('.dd-bub').forEach((el,k)=>{el.classList.toggle('dim',k<i);});
  const st=$('#ddStage');st.scrollTop=st.scrollHeight;haptic('sel');
  const d=GM.dlg,n=d.lines.length;
  const l=d.lines[i];if(l&&l.a&&store.snd){const nb=box.lastElementChild;gmPlay(assetUrl(l.a),nb?nb.querySelector('.dd-voice'):null);}   // 13.9.64: автовойс при появлении реплики (звук вкл.)
  const p=$('#ddProg');if(p)p.style.width=Math.round((i+1)/n*100)+'%';
  if(i+1>=n){const v=$('#ddVoc');
    if(v&&d.vocab&&d.vocab.length)v.innerHTML='<b>Лексика</b>'+d.vocab.map(x=>`<span class="chip"><i>${esc(x.w)}</i> — ${esc(x.r)}</span>`).join('')+'<button class="gm-again" data-again="1">Ещё раз</button>';
    const hint=$('.dd-hint');if(hint)hint.textContent='диалог пройден';}
}
// 13.9.65 — дуэль «во весь рост» (просьба Андрея: «слева и справа во весь рост портреты почти, и оттуда фразы вылетают, на которые нажать можно, и где-то перевод их внизу»).
// Окно поверх экрана игры (в body — у .gm-root бывает transform, fixed внутри него не работает): два видео-портрета на всю высоту, левый отражён — смотрят друг на друга.
// Реплика вылетает пузырём со стороны говорящего, говорящий светлее, молчащий приглушён. Перевод активной реплики — панелью внизу.
// Тап по экрану — следующая реплика (+ войс, если звук вкл.), тап по фразе — ещё раз её голос и её перевод внизу. В конце — лексика, «Ещё раз», «К диалогам».
// Кадр: ролики 16:9, герой справа — h.fx = где лицо по ширине кадра (0–1), object-position считается под размер окна (ddxFit).
const DDX={h:null,hB:null,d:null,i:-1,sel:-1};
function ddxPort(h,side){
  return `<div class="ddx-p ${side}" data-side="${side}"><div class="ddx-pi">${gmAlive(h)?`<video src="${esc(assetUrl(h.img))}" data-fx="${+h.fx||0.75}" autoplay muted loop playsinline preload="auto"></video>`:gmFace(h)}</div><i class="ddx-dim"></i><b class="ddx-nm">${esc(h.name)}</b></div>`;}
function ddxFit(){const st=$('#ddxStage');if(!st)return;
  st.querySelectorAll('.ddx-pi video').forEach(v=>{const r=v.getBoundingClientRect();if(!r.width||!r.height)return;
    const vw=v.videoWidth||1280,vh=v.videoHeight||720,s=Math.max(r.width/vw,r.height/vh),w=Math.min(1,r.width/(vw*s)),f=+v.dataset.fx||0.75;
    const x=w>=1?50:Math.max(0,Math.min(100,(f-w/2)/(1-w)*100));v.style.objectPosition=x.toFixed(1)+'% 50%';});}
function ddxOpen(h,d){ddxClose(true);
  const other=d.lines.map(l=>l.s).find(s=>s!==h.name)||'',hB=gmHeroesAll().find(x=>x.name===other)||{id:other,name:other};
  Object.assign(DDX,{h,hB,d,i:-1,sel:-1});
  const w=document.createElement('div');w.className='ddx';w.id='ddx';
  w.innerHTML=`<div class="ddx-in">
    <div class="ddx-top"><button class="ddx-x" id="ddxX" aria-label="Закрыть">${ui('close')}</button><div class="ddx-ctx">${esc(d.ctx||'')}</div><span class="ddx-n" id="ddxN"></span></div>
    <div class="ddx-prog"><i id="ddxProg"></i></div>
    <div class="ddx-stage" id="ddxStage">${ddxPort(h,'lf')}${ddxPort(hB,'rt')}<div class="ddx-bubs" id="ddxBubs"></div></div>
    <div class="ddx-sub" id="ddxSub"><span class="ddx-sw" id="ddxSw"></span><p class="ddx-ru" id="ddxRu"></p><small class="ddx-hint" id="ddxHint">нажми на экран — дальше · на фразу — ещё раз</small></div>
    <div class="ddx-end" id="ddxEnd" hidden></div></div>`;
  document.body.appendChild(w);document.body.classList.add('ddx-on');
  w.querySelectorAll('video').forEach(v=>{v.addEventListener('loadedmetadata',ddxFit);const p=v.play();if(p&&p.catch)p.catch(()=>{});});
  ddxFit();setTimeout(ddxFit,60);
  $('#ddxX').onclick=e=>{e.stopPropagation();sfx('tap');ddxClose();};
  $('#ddxStage').onclick=e=>{const b=e.target.closest('.ddx-b');if(b){e.stopPropagation();ddxSel(+b.dataset.k);return;}ddxNext();};
  $('#ddxSub').onclick=()=>ddxNext();
  requestAnimationFrame(()=>w.classList.add('in'));
  ddxNext();}
function ddxClose(quiet){const w=document.getElementById('ddx');gmPlay(null);if(!w)return false;
  w.querySelectorAll('video').forEach(v=>{try{v.pause();v.removeAttribute('src');v.load();}catch(e){}});
  w.remove();document.body.classList.remove('ddx-on');DDX.d=null;
  if(!quiet){GM.dlg=null;const r=$('#gmRoot');if(r){r.innerHTML=gmHTML();gmBind();}}
  return true;}
function ddxVoice(k,auto){const l=DDX.d&&DDX.d.lines[k];if(!l||!l.a)return;if(auto&&!store.snd)return;
  const b=document.querySelector(`#ddxBubs .ddx-b[data-k="${k}"] .dd-voice`);gmPlay(assetUrl(l.a),b);}
function ddxSub(k){const l=DDX.d.lines[k],left=l.s===DDX.h.name,sub=$('#ddxSub');if(!sub)return;
  $('#ddxSw').textContent=l.s;$('#ddxSw').className='ddx-sw '+(left?'lf':'rt');$('#ddxRu').textContent=l.ru||'';
  sub.classList.remove('fl');void sub.offsetWidth;sub.classList.add('fl');}
function ddxSpeak(k){const l=DDX.d.lines[k],left=l.s===DDX.h.name;
  $$('#ddxStage .ddx-p').forEach(p=>p.classList.toggle('on',p.dataset.side===(left?'lf':'rt')));}
function ddxNext(){const d=DDX.d;if(!d)return;const n=d.lines.length;
  if(DDX.i+1>=n){ddxEnd();return;}
  const i=++DDX.i,l=d.lines[i],left=l.s===DDX.h.name,box=$('#ddxBubs');DDX.sel=i;
  box.querySelectorAll('.ddx-b').forEach(b=>{const age=(+b.dataset.age||0)+1;b.dataset.age=age;b.classList.add('old');b.classList.remove('sel');if(age>=3)b.remove();});
  box.insertAdjacentHTML('beforeend',`<button class="ddx-b ${left?'lf':'rt'} sel" data-k="${i}" data-age="0"><span class="ddx-en">${esc(l.en)}</span>${l.a?'<i class="ddx-v dd-voice" aria-hidden="true">▸</i>':''}</button>`);
  ddxSpeak(i);ddxSub(i);haptic('sel');sfx('tap');ddxVoice(i,true);
  $('#ddxProg').style.width=Math.round((i+1)/n*100)+'%';$('#ddxN').textContent=(i+1)+' / '+n;
  if(i+1>=n){$('#ddxHint').textContent='нажми — итог диалога';}}
function ddxSel(k){const box=$('#ddxBubs');if(!box)return;DDX.sel=k;
  box.querySelectorAll('.ddx-b').forEach(b=>b.classList.toggle('sel',+b.dataset.k===k));
  ddxSpeak(k);ddxSub(k);haptic('medium');ddxVoice(k,false);}
function ddxEnd(){const d=DDX.d,e=$('#ddxEnd');if(!d||!e)return;
  e.innerHTML=`<b class="ddx-eh">Диалог пройден</b>${d.vocab&&d.vocab.length?`<div class="ddx-voc">${d.vocab.map(x=>`<span class="chip"><i>${esc(x.w)}</i> — ${esc(x.r)}</span>`).join('')}</div>`:''}
    <div class="ddx-eb"><button class="ddx-again" id="ddxAgain">↺ Ещё раз</button><button class="ddx-out" id="ddxOut">К диалогам</button></div>`;
  e.hidden=false;$('#ddxSub').hidden=true;sfx('learn');haptic('ok');
  $('#ddxAgain').onclick=ev=>{ev.stopPropagation();sfx('tap');const h=DDX.h,dd=DDX.d;ddxOpen(h,dd);};
  $('#ddxOut').onclick=ev=>{ev.stopPropagation();sfx('tap');ddxClose();};}
addEventListener('resize',()=>{if(document.getElementById('ddx'))ddxFit();});
// 13.9.67 — Versus с другом по Deadlock (П2 в ПЛАН-24.10.md; Андрей: «самое главное — PvP с друзьями: слева и справа герои говорят фразы, игроки собирают кубики, правильный подсчёт очков»).
// Комната — та же, что у дуэлей по сценам (bot/worker.js /api/pvp, воркер не менялся): room.sid='dd:deadlock:<герой>:<№ диалога у него>', mode 'race', 3 вопроса в room.qs.
// Вопросы целиком собирает создатель (текст, перевод, войс, кубики, варианты) — у друга ровно те же; qs[0].hs = [герой создателя, герой друга].
// Очки — kvPts (верно 100 + до 50 за скорость, ошибка 0); полоска здоровья = 3×150 минус очки соперника. Кубики — одна попытка: в PvP вторая нечестна.
// Окно #dvx — в body и всегда тёмное, как ddx (у .screen при входе бывает transform). Внутри маркер .kv — без него kvPoll останавливается.
const DV_HP=150,DV_T={build:'Собери',mean:'Что значит',tr:'Перевод',hear:'На слух'};
const DV_STOP=new Set('them your yours our ours very some any all from into onto over than then there here were been being just only also even still more most such much many like gonna gotta wanna kinda yeah okay ever never tryna dunno lemme ain'.split(' '));   // служебные — не годятся в подмену на слух
// 13.9.73 (П12): герой качается — опыт за бой (10 за верный ответ, победа +20, ничья +8), уровень = 1 + √(опыт/30): 30 → 2, 120 → 3, 270 → 4, 480 → 5
const hxK=h=>'deadlock:'+(h&&h.id||''),hxXP=h=>+((store.heroXP||{})[hxK(h)])||0,hxLv=x=>1+Math.floor(Math.sqrt(Math.max(0,x)/30)),hxAt=l=>30*(l-1)*(l-1);
const hxProg=x=>{const l=hxLv(x),a=hxAt(l),b=hxAt(l+1);return Math.max(0,Math.min(1,(x-a)/(b-a)));};
function hxAdd(h,n){if(!h||!h.id||!(n>0))return null;const x0=hxXP(h),x1=x0+n;store.heroXP=Object.assign({},store.heroXP,{[hxK(h)]:x1});return {x0,x1,l0:hxLv(x0),l1:hxLv(x1)};}
let DVAU=null;   // один <audio> на весь бой: на iPhone звук разрешён элементу после нажатия, а новый элемент без нажатия молчит
function dvUnlock(){try{if(!DVAU)DVAU=new Audio();if(DVAU._ok)return;DVAU.src='data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';const p=DVAU.play();if(p&&p.then)p.then(()=>{DVAU.pause();DVAU._ok=1;},()=>{});}catch(e){}}
// войс реплики; end(true) — дослушал, end(false) — не заиграло
function dvVoice(u,btn,end){try{gmPlay(null);if(!DVAU)DVAU=new Audio();const a=DVAU;a.onended=a.onerror=null;a.pause();$$('#dvx .dvx-say.on').forEach(x=>x.classList.remove('on'));$$('#dvx .dvx-b.play').forEach(x=>x.classList.remove('play'));
  if(!u){if(end)end(false);return;}let fin=false;const done=ok=>{if(fin)return;fin=true;if(btn){btn.classList.remove('on');const b=btn.closest('.dvx-b');if(b)b.classList.remove('play');}if(end)end(ok);};
  a.src=assetUrl(u);if(btn){btn.classList.add('on');const b=btn.closest('.dvx-b');if(b)b.classList.add('play');}a.onended=()=>done(true);a.onerror=()=>done(false);const p=a.play();if(p&&p.catch)p.catch(()=>done(false));}catch(e){if(end)end(false);}}
// живые диалоги на двоих (у Венатора и Крысы одни и те же лежат у обоих — берём один раз)
function dvDialogs(){const H=gmHeroesAll(),seen=new Set(),out=[];
  H.forEach(h=>(h.dialogs||[]).forEach((d,i)=>{if(!d||!gmDialogOK(d))return;const k=(d.lines||[]).map(l=>l.en).join('|'),ns=[...new Set((d.lines||[]).map(l=>l.s))];
    if(seen.has(k)||ns.length!==2)return;const A=H.find(x=>x.name===ns[0]),B=H.find(x=>x.name===ns[1]);if(!A||!B)return;seen.add(k);out.push({h,i,d,A,B});}));
  return out;}
function dvParse(R){const m=/^dd:deadlock:([\w-]+):(\d+)/.exec(String(R&&R.sid||'')),h=m&&gmHero(m[1]),d=h&&(h.dialogs||[])[+m[2]]||null,hs=((R&&R.qs&&R.qs[0])||{}).hs||[];
  const by=n=>gmHeroesAll().find(x=>x.name===n)||{id:String(n||'?'),name:String(n||'?')};return {h,d,A:by(hs[0]),B:by(hs[1])};}
const dvMe=()=>{const P=dvParse(KV.room);return KV.role==='A'?{me:P.A,fo:P.B,P}:{me:P.B,fo:P.A,P};};
// 3 вопроса: собери (реплика до 7 слов, иначе выражение из лексики) · что значит (слово из лексики) · что он сказал (на слух, одно слово подменено)
function dvMakeQs(d,hs,o){o=o||{};const L=(d.lines||[]).filter(l=>l&&l.en),voc=(d.vocab||[]).filter(v=>v&&v.w&&v.r),seen=new Set(L.map(l=>l.en)),oth=[],used=new Set();
  gmHeroesAll().forEach(h=>(h.dialogs||[]).forEach(x=>(x.lines||[]).forEach(l=>{if(l&&l.en&&!seen.has(l.en)){seen.add(l.en);oth.push(l);}})));
  const nW=t=>scToks(String(t).replace(/[.,!?;:…"«»()]+/g,' ')).length;
  const find=w=>{const x=String(w).replace(/\.\.\.|…/g,'').trim();if(!x)return null;const re=wordRe(x);for(const l of L){const m=re.exec(l.en);if(m){const i=m.index+m[1].length;return {l,i,x:l.en.slice(i,i+m[2].length)};}}return null;};
  const rs=v=>ruShort(String(v.r).replace(/^\s*(разг|жарг|бран|груб|ирон)\.\s*/i,''))||String(v.r);
  const lineQ=(t,l,o)=>Object.assign({t,s:l.s||'',a:l.a||'',en:l.en,ru:l.ru||''},o);
  const voc2=[...new Set([...L,...oth].flatMap(x=>String(x.en).split(/[^A-Za-z']+/)).filter(w=>w.length>=3&&w===w.toLowerCase()&&!/'/.test(w)&&!SC_STOP.has(w)&&!DV_STOP.has(w)))],sfx2=w=>{const m=(w.match(/(ing|ed|ly|s)$/i)||[''])[0].toLowerCase();return m&&w.length>=m.length+3?m:'';};   // 13.9.73: king — не «-ing», bed — не «-ed»
  const dvTk=t=>{const B=scBuildTiles(t,{},[],false),inT=new Set(B.tk.map(w=>w.toLowerCase())),pool=B.pool.map(x=>x.w),n=B.tk.length,near=w=>Math.abs(w.length-5);
    for(const w of shuffle(voc2.filter(w=>!inT.has(w))).sort((a,b)=>near(a)-near(b))){if(pool.length>=n+2)break;if(!pool.includes(w))pool.push(w);}
    return {tk:B.tk,pool:shuffle(pool.slice(0,n+2))};};   // ровно 2 лишних: форма того же слова (wForms) и слово из реплик героев
  // 13.9.73 (П12): подмена на слух — похожее по звучанию слово (общее окончание / начало, мало разницы по буквам) той же части речи (по переводу в словарике), из словарика всех сцен и реплик героев: «priest» → «beast», а не «home»
  const FN=new Set('from with into onto about after before until upon than that this these those what when where which while whose without within'.split(' '));   // служебные — не подменяем и не подставляем
  const gp=w=>{const g=GLOSS[w];return g?ruShape(String(g).split(/[;,]/)[0]):'';},enP=w=>/ly$/.test(w)?'o':'',sfxN=(a,b)=>{let k=0;while(k<a.length&&k<b.length&&a[a.length-1-k]===b[b.length-1-k])k++;return k;},pre=(a,b)=>{let k=0;while(k<a.length&&k<b.length&&a[k]===b[k])k++;return k;};
  const SUBP=[...new Set([...Object.keys(GLOSS).filter(w=>/^[a-z]{3,}$/.test(w)&&!SC_STOP.has(w)&&!DV_STOP.has(w)&&!FN.has(w)&&!/\((имя|фамилия|назв|город|марк|бренд|фр\.|исп\.|нем\.|лат\.|итал\.)|итальянск|французск|груб|мат\b|бран|вибратор|секс|порн|оргазм|член|наркот/i.test(String(GLOSS[w]))),...voc2])];
  const dvSubs=(cw,inL,loose)=>{const p=loose?'':gp(cw)||enP(cw),L=cw.length;
    if(FN.has(cw))return [];
    const C=SUBP.filter(w=>w!==cw&&!inL.has(w)&&sfx2(w)===sfx2(cw)&&Math.abs(w.length-L)<=2).map(w=>{const q=gp(w)||enP(w);if(p&&q&&p!==q)return null;if(!p&&q&&q!=='n')return null;   // слова нет в словарике (priest, Venator) — скорее существительное
      const e=sfxN(w,cw),f=pre(w,cw),d=lev(w,cw);if(d>Math.max(2,Math.ceil(L*.5))||!(e>=2||f>=2||(f>=1&&d<=2)))return null;
      return {w,s:2*Math.min(e,4)+1.5*Math.min(f,3)-d-.5*Math.abs(w.length-L)+(p&&q?1:0)};}).filter(Boolean).sort((a,b)=>b.s-a.s);
    return shuffle(C.slice(0,3)).slice(0,2).map(x=>x.w);};
  // 13.9.73 (П12): «Выбери перевод» — реплика с голосом, 3 перевода: верный + переводы других реплик похожей длины (сначала этого же диалога). ru в вопросе пустой — старый клиент не покажет ответ в пузыре
  const trQ=l=>{if(!l||!l.ru||!l.a)return null;const right=String(l.ru).trim(),n=right.length,st=new Set(ruStems(right)),wr=[];
    const pool=[...shuffle(L.filter(x=>x.en!==l.en)),...shuffle(oth)].filter(x=>x&&x.ru).sort((a,b)=>(L.includes(b)?1:0)-(L.includes(a)?1:0)||Math.abs(String(a.ru).length-n)-Math.abs(String(b.ru).length-n));
    for(const x of pool){if(wr.length>=2)break;const r=String(x.ru).trim();if(!r||r.toLowerCase()===right.toLowerCase()||wr.some(y=>y.toLowerCase()===r.toLowerCase()))continue;const rs2=ruStems(r);if(rs2.length&&rs2.filter(s=>st.has(s)).length>=Math.ceil(rs2.length/2))continue;wr.push(r);}
    return wr.length>=2?lineQ('tr',l,{ru:'',tru:right,right,opts:shuffle([right,...wr])}):null;};
  // 1 — «Собери»: реплика с голосом, лучше 4–7 слов (случайная — в реванше другая)
  let q1=null;const bl=shuffle(L.filter(l=>l.a&&nW(l.en)>=4&&nW(l.en)<=SC_MAXB))[0]||shuffle(L.filter(l=>l.a&&nW(l.en)>=3&&nW(l.en)<=SC_MAXB))[0];
  if(bl){q1=lineQ('build',bl,dvTk(bl.en));used.add(bl.en);}
  else for(const v of shuffle(voc)){const n=scToks(String(v.w)).length;if(n<2||n>5)continue;const f=find(v.w);if(!f)continue;
    q1=lineQ('build',f.l,Object.assign(dvTk(f.x),{ex:{pre:f.l.en.slice(0,f.i),post:f.l.en.slice(f.i+f.x.length),ru:rs(v)}}));used.add(f.l.en);used.add(String(v.w).toLowerCase());break;}
  // 2 — «Что значит?»: чужие значения сначала из этого же диалога; значения того же слова из других диалогов — не варианты
  let q2=null;const lw=v=>String(v.w).toLowerCase().trim(),trL=()=>shuffle(L.filter(l=>l.a&&l.ru&&!used.has(l.en)&&nW(l.en)>=3)).concat(shuffle(L.filter(l=>l.a&&l.ru&&!used.has(l.en))));
  if(o.tr)for(const l of trL()){const q=trQ(l);if(q){q2=q;used.add(l.en);break;}}   // 13.9.73: через раз — «Выбери перевод» вместо «Что значит?»
  const mv=shuffle(voc.filter(v=>!used.has(lw(v)))).map(v=>({v,f:find(v.w)})).sort((a,b)=>(b.f?1:0)-(a.f?1:0))[0];
  if(mv&&!q2){const right=rs(mv.v),st=new Set(ruStems(right)),wr=[],pool=[...shuffle(voc),...shuffle(gmHeroesAll().flatMap(h=>(h.dialogs||[]).flatMap(x=>x.vocab||[])).filter(v=>v&&v.w&&v.r&&!voc.includes(v)))];
    for(const v of pool){if(wr.length>=2)break;if(lw(v)===lw(mv.v))continue;const r=rs(v);if(!r||r.toLowerCase()===right.toLowerCase()||/[;()\[\]]/.test(r)||ruStems(r).some(s=>st.has(s))||wr.some(x=>x.toLowerCase()===r.toLowerCase()))continue;wr.push(r);}
    if(wr.length>=2){const f=mv.f;q2=Object.assign(f?lineQ('mean',f.l,{}):{t:'mean',s:'',a:'',en:'',ru:''},{w:String(mv.v.w),right,opts:shuffle([right,...wr])});used.add(lw(mv.v));if(f)used.add(f.l.en);}}
  if(!q2)for(const l of trL()){const q=trQ(l);if(q){q2=q;used.add(l.en);break;}}   // нет лексики — перевод
  // 3 — «Что он сказал?»: варианты — та же реплика, но одно слово подменено похожим словом из реплик героев (та же длина и окончание) — надо расслышать;
  // не вышло — подмена как в «Что прозвучало?» у сцен, потом другие реплики похожей длины
  const hearQ=(l,strict)=>{const ws=String(l.en).split(/[^A-Za-z']+/).filter(Boolean),inL=new Set(ws.map(w=>w.toLowerCase())),re=w=>new RegExp('(^|[^A-Za-z\'])'+w+'(?=[^A-Za-z\']|$)');
    const cand=ws.map((w,k)=>({w,bad:SC_STOP.has(w.toLowerCase())||DV_STOP.has(w.toLowerCase())||FN.has(w.toLowerCase())||w.length<3||/'/.test(w)||(k>0&&/^[A-Z]/.test(w)),s:Math.min(w.length,8)+(k>0?2:0)})).filter(x=>!x.bad).sort((a,b)=>b.s-a.s);   // 13.9.73: было «−9 к очкам» — длинное имя (Venator) всё равно проходило
    let opts=null;for(const c of [...cand.map(c=>({w:c.w,lo:0})),...cand.map(c=>({w:c.w,lo:1}))]){const cw=c.w.toLowerCase(),cap=/^[A-Z]/.test(c.w),sub=dvSubs(cw,inL,c.lo);   // сначала той же части речи, потом — просто похожее на слух
      if(sub.length<2)continue;opts=sub.map(w=>l.en.replace(re(c.w),(m,a)=>a+(cap?w[0].toUpperCase()+w.slice(1):w)));if(new Set(opts).size===2&&!opts.includes(l.en))break;opts=null;}
    if(!opts&&strict)return null;   // 13.9.73: у реплики нет похожих на слух слов — лучше взять другую реплику
    if(!opts)for(const c of cand){const u=[...new Set((scListenOpts({en:l.en,gap:c.w},oth,false)||[]).filter(x=>x&&x!==l.en))];if(u.length>=2){opts=u.slice(0,2);break;}}
    if(!opts){const n=nW(l.en);opts=shuffle([...L,...oth].filter(x=>x.en!==l.en)).sort((a,b)=>Math.abs(nW(a.en)-n)-Math.abs(nW(b.en)-n)).slice(0,2).map(x=>x.en);}
    return opts.length>=2?lineQ('hear',l,{right:l.en,opts:shuffle([l.en,...opts])}):null;};
  const hls=[...shuffle(L.filter(l=>l.a&&!used.has(l.en)&&nW(l.en)>=3&&nW(l.en)<=14)),...shuffle(L.filter(l=>l.a&&!used.has(l.en)&&!(nW(l.en)>=3&&nW(l.en)<=14)))];
  let q3=null,hl=null;for(const l of hls){q3=hearQ(l,true);if(q3){hl=l;break;}}if(!q3&&hls[0]){hl=hls[0];q3=hearQ(hl);}if(hl)used.add(hl.en);
  const out=[q1,q2,q3].filter(Boolean);
  for(const l of shuffle(L.filter(x=>x.a&&!used.has(x.en)))){if(out.length>=3)break;const q=hearQ(l);if(q){out.push(q);used.add(l.en);}}   // запас: всегда 3 вопроса
  if(out[0])out[0].hs=hs;return out;}
// шторка: за кого играешь, диалог, ставка — как у дуэли по сцене
function dvSheet(pre){pre=pre||{};const D=dvDialogs();if(!D.length){toast('Пока нет диалогов, где оба героя живые');return;}scCloseSheet();
  const g=store.gold||0,dvK=x=>x.h.id+':'+x.i,dvN=x=>((store.dvPlay||{})[dvK(x)]||0),auto=D.reduce((b,x,k)=>dvN(x)<dvN(D[b])?k:b,0);   // 13.9.70: диалог выбирается сам — тот, что меньше всего играли
  const re=pre.not!=null,auto2=re?D.reduce((b,x,k)=>{if(dvK(x)===pre.not)return b;if(b<0)return k;const hm=y=>!pre.me||y.A.name===pre.me||y.B.name===pre.me?0:1;return hm(x)<hm(D[b])||(hm(x)===hm(D[b])&&dvN(x)<dvN(D[b]))?k:b;},-1):-1;   // 13.9.73: реванш — другой диалог (тот же герой, меньше всего игранный)
  let di=Math.max(0,pre.first?D.findIndex(x=>x.d.lines[0].en===pre.first):auto2>=0?auto2:auto),side=0,bet=pre.bet!=null?(pre.bet<=g?pre.bet:0):(g>=25?25:0);if(di<0)di=0;
  if(pre.me){const k=[D[di].A.name,D[di].B.name].indexOf(pre.me);if(k>=0)side=k;}
  const w=document.createElement('div');w.className='sc-sheetwrap dvs';let drawn=false;
  const ic=h=>`<span class="dv-ic"${h.icon?` style="background-image:url('${esc(assetUrl(h.icon))}')"`:''}></span>`;
  const draw=()=>{const x=D[di],hs=[x.A,x.B];w.innerHTML=`<div class="sc-sheet kv-sheet dv-sheet${drawn?' noanim':''}"><b>⚔️ Versus с другом</b><p class="kv-sub">Deadlock · 3 раунда: собери фразу, что значит, что сказал герой. Урон по сопернику — твои очки.</p>
    <div class="kv-lbl">Ты за</div><div class="kv-modes dv-sides">${hs.map((h,k)=>`<button data-side="${k}" class="${k===side?'on':''}">${ic(h)}<b>${esc(h.name)}</b><small>${k===side?'это ты':'достанется другу'} · ур. ${hxLv(hxXP(h))}</small></button>`).join('')}</div>
    <div class="kv-lbl">Диалог <small>${re?'реванш — другой диалог, можно сменить':'выбран сам — можно сменить'}</small></div><div class="kv-eps dv-dlgs">${D.map((x,k)=>`<button data-di="${k}" class="${k===di?'on':''}"><b>${esc(String(x.d.ctx||'').split('·').slice(0,2).join('·').trim())}</b><small>${x.d.about?esc(x.d.about):`«${esc(x.d.lines[0].en)}»`}</small><em>${x.d.lines.length} ${plural(x.d.lines.length,['реплика','реплики','реплик'])}${dvN(x)?` · играли ${dvN(x)}`:''}</em></button>`).join('')}</div>
    <div class="kv-lbl">Ставка <small>у тебя ${ui('coin')} ${fmt(g)}</small></div>${g<25?`<p class="kv-poor">Ставки — от ${ui('coin')} 25. Пройди эпизод — дадут билеты.</p>`:''}<div class="kv-bets">${[0,25,50,100,200].filter(v=>!v||v<=g||v===25).map(v=>`<button data-b="${v}" class="${v===bet?'on':''}"${v>g?' disabled':''}>${v?`${ui('coin')} ${v}`:'Без ставки'}</button>`).join('')}</div>
    ${bet?`<p class="kv-bank-note">Банк ${ui('coin')} <b>${bet*2}</b> — ставка списывается у обоих на старте, победитель забирает всё. Ничья — вернём.</p>`:''}
    <button class="sc-btn" id="dvGo">${bet?`Создать — ставка ${ui('coin')} ${bet} →`:'Создать и позвать друга →'}</button><button class="sc-btn ghost" data-close>Отмена</button></div>`;drawn=true;};
  draw();w.onclick=async e=>{const b=e.target.closest('button');if(e.target===w||(b&&b.hasAttribute('data-close'))){w.remove();return;}if(!b||b.disabled)return;sfx('tap');
    if(b.dataset.side){side=+b.dataset.side;draw();return;}if(b.dataset.di){const was=[D[di].A.name,D[di].B.name][side];di=+b.dataset.di;const k=[D[di].A.name,D[di].B.name].indexOf(was);side=k>=0?k:0;draw();return;}if(b.dataset.b){bet=+b.dataset.b;draw();return;}
    if(b.id==='dvGo'){dvUnlock();b.disabled=true;b.textContent='Создаю комнату…';const x=D[di],hs=[x.A,x.B],me=hs[side],fo=hs[1-side];
      try{const qs=dvMakeQs(x.d,[me.name,fo.name],{tr:((store.dvQn||0)%2)===1});const r=await kvNet({a:'create',fx:shopUse('st'),bg:profBgKey(),pf:myPub(),room:{sid:`dd:deadlock:${x.h.id}:${x.i}`,ep:0,mode:'race',bet,qs}});if(!r.ok){kvErr(r);b.disabled=false;draw();return;}
        w.remove();store.dvPlay=Object.assign({},store.dvPlay,{[dvK(x)]:dvN(x)+1});store.dvQn=(store.dvQn||0)+1;save();KV={code:r.v.code,role:'A',room:r.v,k:0,t0:0,dd:true};ev('dv_new','dd:'+x.h.id);dvShare();dvLobby();kvPoll();}catch(z){kvErr();b.disabled=false;draw();}}};
  document.body.appendChild(w);}
function dvShare(){const R=KV.room,{me,fo}=dvMe();shareLink(kvLink(),`Го в Versus по Deadlock: ${me.name} против ${fo.name} — кто лучше понимает английский? «Языки по кино»${R.bet?`, ставка ${R.bet} билетов`:''}. Комната ${KV.code}`);}
// окно боя
function dvOpen(){let w=document.getElementById('dvx');if(w)return w;w=document.createElement('div');w.className='dvx';w.id='dvx';
  w.innerHTML=`<i class="kv" hidden></i><div class="dvx-in"><div class="dvx-top" id="dvxTop"></div><div class="dvx-stage" id="dvxStage"></div><div class="dvx-pan" id="dvxPan"></div></div>`;
  document.body.appendChild(w);document.body.classList.add('dvx-on');requestAnimationFrame(()=>w.classList.add('in'));return w;}
function dvClose(){const w=document.getElementById('dvx');try{if(DVAU){DVAU.onended=DVAU.onerror=null;DVAU.pause();}}catch(e){}if(!w)return false;
  w.querySelectorAll('video').forEach(v=>{try{v.pause();v.removeAttribute('src');v.load();}catch(e){}});w.remove();document.body.classList.remove('dvx-on');return true;}
function dvPort(h,side,who){return `<div class="dvx-p ${side}" data-side="${side}"><div class="dvx-pi"${h.icon?` style="background-image:url('${esc(assetUrl(h.icon))}')"`:''}>${gmAlive(h)?`<video src="${esc(assetUrl(h.img))}" data-fx="${+h.fx||0.75}" autoplay muted loop playsinline preload="auto"></video>`:gmFace(h)}</div><i class="dvx-dim"></i><div class="dvx-nm"><b>${esc(h.name)}</b><small>${esc(who)}</small></div><i class="dvx-ko">K.O.</i></div>`;}
function dvFit(){$$('#dvxStage .dvx-pi video').forEach(v=>{const r=v.getBoundingClientRect();if(!r.width||!r.height)return;   // как ddxFit: лицо героя (h.fx) — в кадре при любом размере окна
  const vw=v.videoWidth||1280,vh=v.videoHeight||720,s=Math.max(r.width/vw,r.height/vh),w=Math.min(1,r.width/(vw*s)),f=+v.dataset.fx||0.75;
  const x=w>=1?50:Math.max(0,Math.min(100,(f-0.62*w)/(1-w)*100));v.style.objectPosition=x.toFixed(1)+'% 50%';});}   // 13.9.70: лицо на 62 % окна (у левого, отражённого, — на 38 %): ближе к краю экрана, а не к шву посередине
function dvStage(){const st=$('#dvxStage');if(!st||!KV)return;const {me,fo}=dvMe(),foN=(KV.room[kvFoe()]||{}).n||'Друг',key=me.name+'|'+fo.name+'|'+foN;if(st.dataset.k===key)return;st.dataset.k=key;
  st.innerHTML=dvPort(me,'lf','Ты · ур. '+hxLv(hxXP(me)))+dvPort(fo,'rt',foN)+'<div class="dvx-bub" id="dvxBub"></div>';   // 13.9.73: уровень своего героя
  st.querySelectorAll('video').forEach(v=>{v.addEventListener('loadedmetadata',dvFit);const p=v.play();if(p&&p.catch)p.catch(()=>{});});dvFit();setTimeout(dvFit,60);}
function dvTop(){const t=$('#dvxTop');if(!t||!KV)return;const R=KV.room,me=R[KV.role]||{ans:{}},fo=R[kvFoe()]||{n:'Друг',ans:{}},n=R.qs.length,HP=n*DV_HP;
  if(!t.firstChild){t.innerHTML=`<button class="dvx-x" id="dvxX" aria-label="Выйти">${ui('close')}</button><div class="dvx-hp lf"><b id="dvNmL"></b><i><em id="dvHpL"></em></i><span id="dvHpLn"></span></div><div class="dvx-mid" id="dvxMid"></div><div class="dvx-hp rt"><b id="dvNmR"></b><i><em id="dvHpR"></em></i><span id="dvHpRn"></span></div>`;
    $('#dvxX').onclick=e=>{e.stopPropagation();sfx('tap');dvBack();};}
  const hL=Math.max(0,HP-kvSum(fo)),hR=Math.max(0,HP-kvSum(me));
  $('#dvNmL').textContent='Ты';$('#dvNmR').textContent=fo.n||'Друг';$('#dvHpL').style.transform=`scaleX(${hL/HP})`;$('#dvHpR').style.transform=`scaleX(${hR/HP})`;$('#dvHpLn').textContent=hL;$('#dvHpRn').textContent=hR;
  $('#dvxMid').innerHTML=KV.over?(R.bet?`${ui('coin')} ${R.bet*2}`:'VS'):KV.ready&&KV.k<n?`Раунд ${KV.k+1}<small>из ${n}</small>`:R.bet?`${ui('coin')} ${R.bet*2}<small>банк</small>`:'VS';}
// удар: портрет вздрагивает, над полоской — «−N»
function dvHit(side,pts){const p=$(`#dvxStage .dvx-p.${side}`),hp=$(`#dvxTop .dvx-hp.${side}`);haptic(side==='lf'?'err':'ok');if(!fxOK()||!p)return;
  p.animate([{translate:'0 0'},{translate:`${side==='lf'?-12:12}px 0`},{translate:`${side==='lf'?5:-5}px 0`},{translate:'0 0'}],{duration:340,easing:'ease-out'});
  if(hp){const d=document.createElement('b');d.className='dvx-dmg';d.textContent='−'+pts;hp.appendChild(d);
    d.animate([{transform:'translateY(6px) scale(.6)',opacity:0},{transform:'translateY(-6px) scale(1.15)',opacity:1,offset:.25},{transform:'translateY(-28px) scale(1)',opacity:0}],{duration:1100,easing:'ease-out'}).onfinish=()=>d.remove();}
  if(side==='rt')sfx('match');}
function dvPan(html,r){const p=$('#dvxPan');if(!p)return;p.innerHTML=html;p.dataset.r=r==null?'':r;p.scrollTop=0;p.classList.remove('fl');void p.offsetWidth;p.classList.add('fl');}
function dvSpeak(side){$$('#dvxStage .dvx-p').forEach(p=>{p.classList.toggle('on',!!side&&p.dataset.side===side);p.classList.remove('wait');});}
function dvLobby(){dvOpen();dvStage();dvTop();dvSpeak('');const fp=$('#dvxStage .dvx-p.rt');if(fp)fp.classList.add('wait');const R=KV.room,{me,fo}=dvMe();
  dvPan(`<div class="dvx-lob wt"><b>Ждём друга…</b><p>Ты — ${esc(me.name)}, друг — ${esc(fo.name)} · 3 раунда${R.bet?` · ставка ${ui('coin')} ${R.bet}`:''}</p><div class="dvx-code">Комната <b>${KV.code}</b></div>
    <button class="dvx-go" id="dvSh">Отправить ссылку ещё раз</button><button class="dvx-gh" id="dvCp">Скопировать ссылку</button></div>`);
  $('#dvSh').onclick=()=>{sfx('tap');dvShare();};$('#dvCp').onclick=()=>{sfx('tap');try{navigator.clipboard.writeText(kvLink()).then(()=>toast('Ссылка скопирована'),()=>toast(kvLink()));}catch(e){toast(kvLink());}};}
// друг открыл ссылку
function dvJoin(code,R){if(!gmData()){toast('Обнови приложение: у друга новый бой');renderHome();return;}
  const me=R.A&&R.A.id===kvUid()?'A':R.B&&R.B.id===kvUid()?'B':null;renderGameScreen('deadlock');
  if(me){if(me==='A'&&!R.B&&R.st==='wait')toast('Это твой вызов — его принимает друг со своего Telegram. Ждём его');   // 13.9.70: свою ссылку открыл сам
    KV={code,role:me,room:R,k:Object.keys((R[me]||{}).ans||{}).length,t0:0,dd:true};dvOpen();kvApply(R);kvPoll();return;}   // сам открыл свою ссылку — продолжаем с того же вопроса
  if(R.B){toast('В этой комнате уже двое');return;}
  if(R.A&&R.A.left||R.st==='closed'){toast('Бой отменён: комната закрыта');return;}
  KV={code,role:'B',room:R,k:0,t0:0,guest:true,dd:true};const g=store.gold||0,poor=R.bet>g,{me:hm,fo:hf}=dvMe();
  dvOpen();dvStage();dvTop();dvSpeak('rt');
  dvPan(`<div class="dvx-lob"><b>${esc(R.A.n)} зовёт на Versus</b><p>Ты — ${esc(hm.name)}, ${esc(R.A.n)} — ${esc(hf.name)} · 3 раунда</p>
    ${R.bet?`<div class="dvx-code">Ставка <b>${ui('coin')} ${R.bet}</b> · у тебя ${fmt(g)}</div><p class="dvx-rule">Победитель забирает банк ${ui('coin')} ${R.bet*2}.</p>`:''}
    <p class="dvx-rule">Верно — 100 очков и до 50 за скорость, ошибка — 0. Урон по сопернику — твои очки.</p>
    ${poor?`<p class="kv-poor">Не хватает билетов на ставку. Пройди эпизод — и возвращайся по ссылке.</p>`:`<button class="dvx-go" id="dvIn">Принять вызов →</button>`}<button class="dvx-gh" id="dvNo">Не сейчас</button></div>`);
  $('#dvNo').onclick=()=>{sfx('tap');KV=null;dvClose();};
  if($('#dvIn'))$('#dvIn').onclick=async()=>{sfx('tap');dvUnlock();$('#dvIn').disabled=true;try{const j=await kvNet({a:'join',code,fx:shopUse('st'),bg:profBgKey(),pf:myPub()});if(!j.ok){kvErr(j);$('#dvIn').disabled=false;return;}
      if(!j.v.B){KV.role='A';KV.guest=false;toast('Это твой же вызов — с одного аккаунта играть против себя нельзя. Отправь ссылку другу');dvClose();dvOpen();dvLobby();kvPoll();return;}   // 13.9.70: сервер узнал создателя комнаты — второго игрока нет
      {const m=/^dd:deadlock:([\w-]+:\d+)/.exec(String(R.sid||''));if(m){store.dvPlay=Object.assign({},store.dvPlay,{[m[1]]:((store.dvPlay||{})[m[1]]||0)+1});save();}}   // 13.9.73: у друга этот диалог тоже «сыгран» — реванш предложит другой
      kvApply(j.v);kvPoll();}catch(e){kvErr();}};}
// состояние комнаты (опрос kvPoll → kvApply → сюда)
function dvApply(R){if(!KV)return;KV.room=R;
  if(R.st==='wait'){if(!$('#dvx .dvx-lob.wt'))dvLobby();return;}
  const fo=R[kvFoe()],me=R[KV.role];
  if(fo&&fo.left&&!KV.over){KV.over=true;if(!KV.started){dvGone();return;}dvEnd(true);return;}   // вышел до начала — бой отменён, ставку никто не платил
  if(!KV.started){KV.started=true;kvPay();dvCountdown();return;}
  if(KV.over||!KV.ready)return;
  const fp=kvSum(fo);if(KV.fp!=null&&fp>KV.fp)dvHit('lf',fp-KV.fp);KV.fp=fp;dvTop();
  if(Date.now()<(KV.lock||0))return;   // ещё показываем итог своего ответа — экран сменит таймер раунда
  if(me&&me.done&&KV.k>=R.qs.length){if(fo&&fo.done||R.st==='end'){KV.over=true;dvEnd();}else dvWait();}}
function dvGone(){kvStop();dvStage();dvTop();dvSpeak('');dvPan(`<div class="dvx-lob"><b>Бой отменён</b><p>${esc((KV.room[kvFoe()]||{}).n||'Друг')} вышел до начала. Ставка не списана.</p><button class="dvx-go" id="dvOut">К героям</button></div>`);$('#dvOut').onclick=()=>{sfx('tap');KV=null;dvClose();};}
function dvCountdown(){const R=KV.room;dvOpen();dvStage();KV.fp=kvSum(R[kvFoe()]);dvTop();dvSpeak('');const st=$('#dvxStage');if(st&&fxOK()){st.classList.remove('vs');void st.offsetWidth;st.classList.add('vs');}
  dvPan(`<div class="dvx-cd"><b id="dvN">3</b><small>${R.bet>0?`банк ${ui('coin')} ${R.bet*2} · `:''}отвечай быстро и точно</small></div>`);
  let n=3;const pop=()=>{const el=$('#dvN');if(!el||!fxOK())return;el.animate([{transform:'scale(1.9)',opacity:0},{transform:'scale(1)',opacity:1}],{duration:440,easing:SPRING});};
  sfx('tap');pop();KV.cd=setInterval(()=>{n--;const el=$('#dvN');if(n<=0){clearInterval(KV.cd);sfx('win');KV.ready=true;KV.t0=Date.now();dvRound();return;}if(el)el.textContent=n;pop();sfx('tap');haptic('sel');},900);}
// раунд
function dvRound(){if(!KV||KV.over)return;const R=KV.room,n=R.qs.length;if(KV.k>=n){dvApply(KV.room);if(KV&&!KV.over)dvWait();return;}
  const q=R.qs[KV.k],{me,fo}=dvMe(),side=q.s&&q.s===me.name?'lf':q.s&&q.s===fo.name?'rt':'',who=q.s||'Герой';KV.qt=Date.now();KV.ansd=0;KV.heard=0;
  dvStage();dvTop();dvSpeak(side);const st=$('#dvxStage');if(st)st.classList.remove('vs');
  const say=`<button class="dvx-say" id="dvSay" aria-label="Послушать">▶</button>`,mk=q.t==='mean'&&q.en?markWord(q.en,q.w.replace(/\.\.\.|…/g,'').trim(),'<mark>','</mark>'):'';
  const bub=q.t==='hear'?`<div class="dvx-b ${side||'lf'}">${say}<span class="dvx-wave" aria-hidden="true">${'<i></i>'.repeat(9)}</span></div>`
    :q.t==='mean'?(q.en?`<div class="dvx-b ${side||'lf'}">${q.a?say:''}<span>${mk}</span></div>`:'')
    :q.t==='tr'?`<div class="dvx-b ${side||'lf'}">${q.a?say:''}<span>${esc(q.en)}</span></div>`
    :`<div class="dvx-b ${side||'lf'}">${q.a?say:''}<span>«${esc(q.ru)}»</span></div>`;
  const b=$('#dvxBub');if(b)b.innerHTML=bub;
  const opts=()=>`<div class="dvx-o">${q.opts.map(o=>`<button data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div>`;
  dvPan(q.t==='build'?`<div class="dvx-ask">${q.ex?'Собери выражение':`Собери, что сказал ${esc(who)}`}<small>${q.ex?`«${esc(q.ex.ru)}» — внутри фразы`:'Перевод — в пузыре. Порядок слов — как в реплике'}</small></div>
      ${q.ex?`<div class="sc-expr">${esc(q.ex.pre)}<span class="sc-bans in" id="scbans"></span>${esc(q.ex.post)}</div>`:`<div class="sc-bans" id="scbans"></div>`}<div class="sc-bpool" id="scbpool"></div><button class="dvx-go" id="dvChk" disabled>Проверить</button><div class="dvx-fb" id="dvFb"></div>`
    :q.t==='mean'?`<div class="dvx-ask">Что значит «${esc(q.w)}»?${q.en?'<small>Слово — в реплике сверху</small>':''}</div>${opts()}<div class="dvx-fb" id="dvFb"></div>`
    :q.t==='tr'?`<div class="dvx-ask">Выбери перевод<small>Что сказал ${esc(who)} — реплика сверху</small></div>${opts()}<div class="dvx-fb" id="dvFb"></div>`
    :`<div class="dvx-ask">Что сказал ${esc(who)}?<small>Послушай — варианты почти одинаковые</small></div>${opts()}<div class="dvx-fb" id="dvFb"></div>`,KV.k);
  const sb=$('#dvSay'),play=auto=>{if(!q.a)return;dvVoice(q.a,sb,ok=>{if(q.t==='hear'&&ok&&!KV.heard&&!KV.ansd&&KV){KV.heard=1;KV.qt=Date.now();}});};   // на слух время идёт с конца первого прослушивания
  if(sb)sb.onclick=e=>{e.stopPropagation();dvUnlock();haptic('sel');play(false);};
  if(q.a&&store.snd!==false)setTimeout(()=>{if(KV&&KV.room.qs[KV.k]===q)play(true);},q.t==='hear'?350:500);
  if(q.t==='build')dvTiles(q,(right,miss)=>{const pts=dvAns(right);$('#dvFb').innerHTML=dvFb(q,right,pts,miss);});
  else $$('#dvxPan .dvx-o button').forEach(x=>x.onclick=()=>{if(x.disabled||KV.ansd)return;const r=x.dataset.v===q.right;$$('#dvxPan .dvx-o button').forEach(y=>{y.disabled=true;if(y.dataset.v===q.right)y.classList.add('ok');});if(!r)x.classList.add('bad');
    const pts=dvAns(r);$('#dvFb').innerHTML=dvFb(q,r,pts);});}
// кубики, одна попытка
function dvTiles(q,done){const B={tk:q.tk,pool:q.pool.map((w,k)=>({w,k})),got:[]},want=q.tk.map(scNorm),N=q.tk.length,ans=$('#scbans'),pool=$('#scbpool'),chk=$('#dvChk');let over=false;
  const draw=marks=>{const cells=[];for(let j=0;j<Math.max(N,B.got.length);j++){const x=B.got[j];cells.push(x?`<button class="sc-tile${marks?(marks[j]?' good':' bad'):''}" data-k="${x.k}" data-j="${j}">${esc(x.w)}</button>`:'<span class="sc-hole" aria-hidden="true"></span>');}
    ans.innerHTML=cells.join('');pool.innerHTML=B.pool.map(x=>`<button class="sc-tile${B.got.includes(x)?' used':''}" data-k="${x.k}"${B.got.includes(x)?' disabled':''}>${esc(x.w)}</button>`).join('');
    chk.disabled=over||B.got.filter(Boolean).length<N;
    pool.querySelectorAll('.sc-tile').forEach(b=>b.onclick=()=>{if(over)return;sfx('tap');const x=B.pool.find(y=>y.k===+b.dataset.k);if(x&&!B.got.includes(x))scSlotPut(B.got,x,N);draw();});
    ans.querySelectorAll('.sc-tile').forEach(b=>b.onclick=()=>{if(over)return;scSlotTake(B.got,+b.dataset.j);draw();});};
  chk.onclick=()=>{if(over||KV.ansd)return;over=true;const gw=[];for(let j=0;j<N;j++)gw.push(B.got[j]?scNorm(B.got[j].w):'');const right=want.every((w,j)=>gw[j]===w),marks=scPosMarks(gw,want);
    ans.classList.add(right?'right':'wrong');draw(marks);chk.hidden=true;done(right,want.map((_,j)=>!marks[j]));};
  draw();}
function dvFb(q,ok,pts,miss){const head=ok?`<b class="ok">✓ Верно</b> <span class="pts">+${pts}</span>`:'<b class="bad">✗ Мимо</b>';
  if(q.t==='build')return head+(ok?` · ${esc(q.en)}`:q.ex?scFixHTML(q.tk,miss,q.ex):`<div class="sc-fix"><small>Вот как правильно</small>${esc(q.en)}</div>`);
  if(q.t==='mean')return `${head} · «${esc(q.w)}» — ${esc(q.right)}`;
  if(q.t==='tr')return `${head} · ${esc(q.en)}<small class="dvx-ru">${esc(q.tru||q.right)}</small>`;
  return `${head} · ${esc(q.en)}<small class="dvx-ru">${esc(q.ru)}</small>`;}
// ответ: очки локально сразу, на сервер — в фоне; урон по полоске друга
function dvAns(ok){const R=KV.room,k=KV.k,a={ok:!!ok,ms:Math.max(0,Date.now()-KV.qt)},pts=kvPts(a);KV.ansd=1;KV.k++;
  {const q=R.qs[k]||{};lvRate(ok,wlvText(q.t==='mean'?q.w:q.en,'en'),q.t);}   // 13.9.72: живой уровень
  if(R[KV.role]){R[KV.role].ans=R[KV.role].ans||{};R[KV.role].ans[k]=a;}sfx(ok?'good':'bad');if(ok)dvHit('rt',pts);else haptic('err');dvTop();
  const wait=ok?1500:2600;KV.lock=Date.now()+wait;kvNet({a:'ans',code:KV.code,k,ok:a.ok,ms:a.ms}).then(j=>{if(j&&j.ok&&KV&&KV.dd)KV.room=j.v;}).catch(()=>{});
  setTimeout(()=>{if(!KV||KV.over||!KV.dd)return;KV.lock=0;if(KV.k>=KV.room.qs.length){dvApply(KV.room);if(KV&&!KV.over)dvWait();}else dvRound();},wait);
  return pts;}
function dvWait(){if($('#dvx .dvx-lob.wt2'))return dvTop();dvSpeak('');const b=$('#dvxBub');if(b)b.innerHTML='';dvTop();
  dvPan(`<div class="dvx-lob wt2"><b>Ты всё!</b><p>Ждём, пока ответит ${esc((KV.room[kvFoe()]||{}).n||'друг')}… Итог — как только вы оба закончите.</p></div>`);}
// итог: K.O. на проигравшем, таблица раундов, банк — как у дуэли по сцене
function dvEnd(foeLeft){kvStop();try{if(DVAU)DVAU.pause();}catch(e){}const R=KV.room,me=R[KV.role]||{ans:{}},fo=R[kvFoe()]||{n:'друг',ans:{}},n=R.qs.length,{me:hm}=dvMe();
  store.kvDone=store.kvDone||{};const first=!store.kvDone[KV.code];store.kvDone[KV.code]=1;
  const a=kvSum(me),b=kvSum(fo),win=foeLeft?true:a===b?null:a>b,sc=p=>Object.values(p.ans||{}).filter(x=>x.ok).length;let gain=0,steal=null;
  if(first&&win===true)store.kvWins=(store.kvWins||0)+1;
  const xpN=first?10*sc(me)+(win===true?20:win===null?8:0):0,xp=hxAdd(hm,xpN);   // 13.9.73: герой качается
  if(R.bet&&first){gain=win===true?R.bet*2:win===null?R.bet:0;if(gain)store.gold=(store.gold||0)+gain;   // банк — сразу (как в kvEnd): закрыл приложение во время анимации — билеты не пропадут
    if(win!==null)steal={win,bet:R.bet,me:{n:me.n},foe:{n:fo.n},style:win?shopUse('st'):stOf(fo.fx)};}
  save();sfx(win===false?'learn':'win');ev('pvp_end',R.sid);
  dvStage();dvTop();dvSpeak(win===true?'lf':win===false?'rt':'');const bb=$('#dvxBub');if(bb)bb.innerHTML='';
  if(win!==null){const lp=$(`#dvxStage .dvx-p.${win?'rt':'lf'}`);if(lp)lp.classList.add('ko');}
  const title=foeLeft?`Победа! ${esc(fo.n)} больше нет в бою`:win===true?'Победа!':win===false?(sc(fo)>sc(me)?`Побеждает ${esc(fo.n)} — больше верных ответов`:`Побеждает ${esc(fo.n)} — быстрее при равном счёте`):'Ничья';
  const cell=x=>x?`<td class="${x.ok?'ok':'bad'}">${x.ok?'✓':'✗'}<small>${(x.ms/1000).toFixed(1)} с</small><em>${kvPts(x)}</em></td>`:'<td>—</td>';
  const hx=hxXP(hm),hl=hxLv(hx);
  dvPan(`<div class="dvx-end"><b>${title}</b><p>Ты ${a} очк. (${sc(me)} из ${n} верно)${foeLeft?'':` · ${esc(fo.n)} ${b} очк. (${sc(fo)} верно)`}</p>
    <div class="dvx-xp${xp&&xp.l1>xp.l0?' up':''}"><span>${esc(hm.name)} · ур. ${hl}</span><i><em style="transform:scaleX(${hxProg(hx).toFixed(3)})"></em></i><small>${first?`+${xpN} опыта`:'опыт за этот бой уже начислен'}${xp&&xp.l1>xp.l0?` · новый уровень!`:''}</small></div>
    ${R.bet?`<p class="dvx-bank">${win===true?`Банк твой: ${ui('coin')} ${R.bet*2}`:win===null?`Ничья — ставка ${ui('coin')} ${R.bet} вернулась`:`Банк забирает ${esc(fo.n)}: ${ui('coin')} ${R.bet*2}`}</p>`:''}
    ${foeLeft?'':`<table class="kv-tbl"><thead><tr><th>Раунд</th><th>Ты</th><th>${esc(fo.n)}</th></tr></thead><tbody>${R.qs.map((q,i)=>`<tr><td>${esc(DV_T[q.t]||String(i+1))}</td>${cell((me.ans||{})[i])}${cell((fo.ans||{})[i])}</tr>`).join('')}</tbody><tfoot><tr><td>Σ</td><td>${a}</td><td>${b}</td></tr></tfoot></table>`}
    <button class="dvx-go" id="dvAgain">⚔️ Реванш — другой диалог</button><button class="dvx-gh" id="dvOut">К героям</button></div>`);
  const pre={me:hm.name,bet:R.bet,not:(/^dd:deadlock:([\w-]+:\d+)/.exec(String(R.sid||''))||[])[1]||''};   // 13.9.73: реванш на другом диалоге
  if(xp&&xp.l1>xp.l0)setTimeout(()=>{toast(`${hm.name} — уровень ${xp.l1}`);sfx('learn');},900);
  $('#dvAgain').onclick=()=>{sfx('tap');KV=null;dvClose();setTimeout(()=>dvSheet(pre),120);};
  $('#dvOut').onclick=()=>{sfx('tap');KV=null;dvClose();};
  if(steal)setTimeout(()=>kvSteal(steal).then(()=>{if(gain)goldFX(gain,$('.dvx-bank'));}),700);   // кража билетов, потом выплата — как в дуэли по сцене
  else if(gain)setTimeout(()=>goldFX(gain,$('.dvx-bank')),500);}
// «назад» и ✕: в бою — выйти (засчитаем поражение, как в дуэли по сцене), иначе просто закрыть
function dvBack(){const s=document.querySelector('.sc-sheetwrap.dvs');if(s){s.remove();return;}
  if(KV&&KV.dd&&!KV.over&&!(KV.guest&&!KV.started)){kvNet({a:'leave',code:KV.code}).catch(()=>{});kvStop();if(KV.started)toast('Ты вышел из боя');}
  if(KV&&KV.dd){kvStop();KV=null;}dvClose();}
addEventListener('resize',()=>{if(document.getElementById('dvx'))dvFit();});
function gmPickHTML(){
  const hs=gmHeroes();
  const n=gmAllLines(gmHeroes().filter(h=>GM.pick.has(h.id))).length;
  return `<button class="gm-back" data-back="3">← Режимы</button>
  <p class="gm-note">Отметь героев — их реплики придут порциями по 5.</p>
  <div class="gm-grid" style="--gmcols:3">${hs.map(h=>`<button class="gm-card${GM.pick.has(h.id)?' sel':''}" data-pick="${h.id}">${gmFace(h)}<b>${esc(h.name)}</b>${GM.pick.has(h.id)?'<i class="gm-tick">✓</i>':''}</button>`).join('')}</div>
  <div class="gm-pickbar"><span>${n} реплик</span><button id="gmGo" ${GM.pick.size?'':'disabled'}>Порция ▸</button></div>
  ${GM.por?gmPortHTML():''}`;
}
function gmPortHTML(){
  const p=GM.por;
  return `<div class="dd-duel dd-port" id="ddStage">
    ${p.lines.slice(p.i,p.i+5).map((x,k)=>`<div class="dd-bub mid${k===0?'':' dim'}"><div class="dd-who-row"><span class="dd-who">${esc(x.h.name)}</span>${x.l.a?`<button class="dd-voice" data-au="${esc(assetUrl(x.l.a))}" aria-label="прослушать реплику">▸</button>`:''}</div><div class="dd-en">${esc(x.l.en)}</div><div class="dd-ru">${esc(x.l.ru)}</div></div>`).join('')}
  </div>
  <div class="dd-prog"><i style="width:${Math.round(p.i/Math.max(1,p.lines.length)*100)}%"></i></div>
  <div class="gm-pickbar"><span>${p.i+Math.min(5,p.lines.length-p.i)} / ${p.lines.length}</span>
  <button id="gmMore" ${p.i+5>=p.lines.length?'disabled':''}>Ещё ▸</button></div>`;
}
function gmRndHTML(){
  const all=gmAllLines();
  if(!all.length)return '';
  const pool=[];all.forEach(x=>{for(let k=0;k<(x.d.use||1);k++)pool.push(x);});
  const x=pool[Math.floor(Math.random()*pool.length)];
  return `<button class="gm-back" data-back="3">← Режимы</button>
  <p class="gm-note">Случайная реплика: чем выше полезность, тем чаще выпадает.</p>
  <div class="dd-duel dd-one" id="ddStage"><div class="dd-bub mid"><div class="dd-who-row"><span class="dd-who">${esc(x.h.name)} · ${esc(x.d.ctx)}</span>${x.l.a?`<button class="dd-voice" data-au="${esc(assetUrl(x.l.a))}" aria-label="прослушать реплику">▸</button>`:''}</div><div class="dd-en">${esc(x.l.en)}</div><div class="dd-ru">${esc(x.l.ru)}</div></div></div>
  ${x.d.vocab&&x.d.vocab.length?`<div class="dd-vocab on"><b>Лексика</b>${x.d.vocab.slice(0,3).map(v=>`<span class="chip"><i>${esc(v.w)}</i> — ${esc(v.r)}</span>`).join('')}</div>`:''}
  <div class="gm-pickbar"><span>${esc(x.h.name)} · полезность ${'●'.repeat(x.d.use||1)}</span><button id="gmAgain2">Ещё ▸</button></div>`;
}
function gmBind(){
  const r=$('#gmRoot');if(!r)return;
  r.querySelectorAll('[data-dv]').forEach(b=>b.onclick=()=>{sfx('tap');haptic('sel');dvSheet();});   // 13.9.67
  r.querySelectorAll('[data-gm]').forEach(b=>b.onclick=()=>{GM.mode=b.dataset.gm;GM.dlg=null;GM.hero=null;haptic('sel');sfx('tap');r.innerHTML=gmHTML();gmBind();});
  r.querySelectorAll('[data-sort]').forEach(b=>b.onclick=()=>{store.gmSort=b.dataset.sort;save();r.innerHTML=gmHTML();gmBind();});
  r.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{store.gmView=b.dataset.view;save();r.innerHTML=gmHTML();gmBind();});
  const sl=$('#gmSize');if(sl)sl.oninput=()=>{store.gmCols=+sl.value;save();const g=$('.gm-grid');if(g)g.style.setProperty('--gmcols',6-(+sl.value));};
  r.querySelectorAll('[data-h]').forEach(b=>b.onclick=()=>{GM.hero=gmHero(b.dataset.h);GM.dlg=null;haptic('sel');r.innerHTML=gmHTML();gmBind();});
  r.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{const h=GM.hero;const d=gmDlgs(h).slice().sort((a,b2)=>(b2.use||0)-(a.use||0))[+b.dataset.d];if(!d)return;GM.dlg=d;haptic('sel');ddxOpen(h,d);});   // 13.9.65: дуэль во весь рост — окно поверх; список диалогов остаётся под ним
  r.querySelectorAll('[data-back]').forEach(b=>b.onclick=()=>{const k=b.dataset.back;if(k==='2')GM.dlg=null;else if(k==='3'){GM.por=null;}else GM.hero=null;if(GM.mode!=='browse'&&k==='3'){GM.mode='browse';}haptic('sel');r.innerHTML=gmHTML();gmBind();});
  const stage=$('#ddStage');if(stage)stage.onclick=e=>{if(e.target.closest('button'))return;const d=GM.dlg;if(!d)return;const shown=$('#ddBub').querySelectorAll('.dd-bub').length;if(shown<d.lines.length)gmDuelStep(shown);};
  r.querySelectorAll('[data-again]').forEach(b=>b.onclick=()=>{const v=$('#ddVoc');if(v)v.innerHTML='';$('#ddBub').innerHTML='';const hint=$('.dd-hint');if(hint)hint.textContent='нажми — дальше';gmDuelStep(0);});
  r.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{const id=b.dataset.pick;GM.pick.has(id)?GM.pick.delete(id):GM.pick.add(id);haptic('sel');r.innerHTML=gmHTML();gmBind();});
  const go=$('#gmGo');if(go)go.onclick=()=>{const lines=gmAllLines(gmHeroes().filter(h=>GM.pick.has(h.id))).sort((a,b)=>(b.d.use||0)-(a.d.use||0));GM.por={lines,i:0};haptic('sel');r.innerHTML=gmHTML();gmBind();};
  const more=$('#gmMore');if(more)more.onclick=()=>{if(GM.por){GM.por.i+=5;haptic('sel');r.innerHTML=gmHTML();gmBind();}};
  const ag2=$('#gmAgain2');if(ag2)ag2.onclick=()=>{r.innerHTML=gmHTML();gmBind();haptic('sel');};
  r.querySelectorAll('[data-au]').forEach(b=>b.onclick=e=>{e.stopPropagation();haptic('medium');gmPlay(b.dataset.au,b);});   // 13.9.64: войс по кнопке ▸
}
