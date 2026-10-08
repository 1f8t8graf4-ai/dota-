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
const TERMS=window.__DATA.TERMS.map(([id,icon,ru,art,noun,ex,exru,w,fn])=>({id,icon,ru,art,noun,ex,exru,w,fn}));
const EN_TERMS={
 dmg:{word:'damage',ex:'How much {w} does he deal?'},
 armor:{word:'armor',ex:'Buy more {w}!'},
 hp:{word:'health',ex:'I have almost no {w} left.'},
 mana:{word:'mana',ex:'I have no {w} left.'},
 speed:{word:'speed',ex:'The boots give you {w}.'},
 str:{word:'strength',ex:'{W} gives you more health.'},
 agi:{word:'agility',ex:'{W} gives armor and attack speed.'},
 int:{word:'intelligence',ex:'{W} gives you more mana.'},
 gold:{word:'gold',ex:"I'm saving {w} for a new item."},
 xp:{word:'experience',ex:'The {w} is enough for level six.'},
 lvl:{word:'level',ex:'At {w} six you get your ultimate.'},
 hero:{word:'hero',ex:'Which {w} do you play?'},
 enemy:{word:'enemy',ex:'The {w} is in the forest.'},
 ally:{word:'ally',ex:'Help your {w}!'},
 tower:{word:'tower',ex:"We're attacking the {w}."},
 forest:{word:'forest',ex:'There are many monsters in the {w}.',fn:'В английской версии Доты лес называют jungle.'},
 river:{word:'river',ex:'The rune is by the {w}.'},
 death:{word:'death',ex:'One more {w} and we lose.'},
 win:{word:'victory',ex:'{W} is ours!'},
 lose:{word:'defeat',ex:'After the {w} we play one more game.'},
 rune:{word:'rune',ex:'Take the {w}!'},
 spell:{word:'spell',ex:'This {w} stuns the enemy.'},
 item:{word:'item',ex:'Which {w} do you buy first?'},
 shop:{word:'shop',ex:"I'm going to the {w}."},
 game:{word:'game',ex:'Good {w}!',exru:'Хорошая игра!'},
 team:{word:'team',ex:'Our {w} fights together.'},
 target:{word:'goal',ex:'Our {w} is victory.'},
 life:{word:'life',ex:'He has very little {w} left.'}
};
TERMS.forEach(t=>{t.en=EN_TERMS[t.id];});

/* ================= предметы ================= */
const ITEMS=window.__DATA.ITEMS;
const BUILDS=window.__DATA.BUILDS;
const EN_BUILDS={
 'Healing Salve':{parts:[['Healing'],['Salve']],extra:[['Heal'],['Save']],note:'heal — лечить, healing — лечащий. salve — мазь, не путай с save — сохранить.'},
 'Iron Branch':{parts:[['Iron'],['Branch']],extra:[['Irony'],['Bench']],note:'iron — железо, branch — ветка.'},
 'Gloves of Haste':{parts:[['Gloves'],['of'],['Haste']],extra:[['Glove'],['for'],['Hasty']],note:'haste — спешка. Gloves во множественном числе: перчаток две.'},
 'Belt of Strength':{parts:[['Belt'],['of'],['Strength']],extra:[['Strong'],['the']],note:'strength — сила (существительное), strong — сильный (прилагательное).'},
 'Boots of Speed':{parts:[['Boots'],['of'],['Speed']],extra:[['Boot'],['Fast']],note:'speed — скорость, fast — быстрый. «X of Y» читается как «X чего»: сапоги скорости.'},
 'Ring of Protection':{parts:[['Ring'],['of'],['Protection']],extra:[['Protect'],['with']],note:'protect — защищать, protection — защита. Окончание -tion делает из глагола существительное.'},
 'Chainmail':{parts:[['Chain'],['mail',1]],extra:[['Chair'],['male',1]],note:'chain — цепь, mail — кольчуга (и почта). Пишется слитно.'},
 'Magic Wand':{parts:[['Magic'],['Wand']],extra:[['Magical'],['Want']],note:'wand — волшебная палочка. want — хотеть, не путай.'},
 'Power Treads':{parts:[['Power'],['Treads']],extra:[['Powerful'],['Threads']],note:'tread — ступать, treads — подошвы. threads — нитки, не путай.'},
 'Blades of Attack':{parts:[['Blades'],['of'],['Attack']],extra:[['Blade'],['Attacks']],note:'blade — клинок, во множественном blades.'},
 'Ring of Health':{parts:[['Ring'],['of'],['Health']],extra:[['Healthy'],['the']],note:'health — здоровье, healthy — здоровый.'},
 'Staff of Wizardry':{parts:[['Staff'],['of'],['Wizardry']],extra:[['Wizard'],['Stuff']],note:'wizard — волшебник, wizardry — волшебство. staff — посох, stuff — вещи, хлам.'},
 'Robe of the Magi':{parts:[['Robe'],['of'],['the'],['Magi']],extra:[['Rope'],['a']],note:'magi — «маги», множественное от magus. robe — мантия, rope — верёвка.'},
 'Shadow Amulet':{parts:[['Shadow'],['Amulet']],extra:[['Shade'],['Omelet']],note:'shadow — тень. omelet — омлет, это чисто прикол.'}
};
BUILDS.forEach(b=>{b.en=EN_BUILDS[b.name];});
const ITEM_IMG=window.__DATA.ITEM_IMG;

/* ================= скиллы: названия как фразы ================= */
const SKILLS=window.__DATA.SKILLS;

/* ================= слова из имён героев ================= */
const HEROES=window.__DATA.HEROES;

/* ================= полезные слова (к каждому своя ассоциация из Доты) ================= */
const WORDS=window.__DATA.WORDS;

/* ================= фразы для общения ================= */
const PHRASES=window.__DATA.PHRASES;

/* ================= слова для режима «Лор» (хай тир) =================
   [id, часть речи, перевод, английский: 'как показывать:формы через запятую', немецкий: то же, группа синонимов]
   Первая форма — словарная. Лор-тексты берутся из lore.json, слово ищется в тексте автоматически. */
const LORE_VOCAB=window.__DATA.LORE_VOCAB.map(([id,pos,ru,en,de,g])=>{
  const p=s=>{if(!s)return null;const [l,f]=s.split(':');return {l,f:f.split(',')};};
  return {id,pos,ru,en:p(en),de:p(de),g};
});

/* ================= сноски: как запомнить и как сказать в жизни =================
   [как запомнить, пример EN, пример DE, перевод] или [.., перевод EN, перевод DE], если примеры разные */
const TIPS=window.__DATA.TIPS;


/* ================= режимы, роли, языки ================= */
const MODES=[
 {id:'terms',name:'Основы',sub:'Урон, броня, опыт, победа',icon:{svg:'sword'}},
 {id:'items',name:'Предметы',sub:'Названия предметов как обычные слова',icon:{img:'items/bottle',svg:'bottle'}},
 {id:'skills',name:'Умения',sub:'Что значат названия умений',icon:{img:'abilities/disruptor_static_storm',svg:'lightning'}},
 {id:'heroes',name:'Имена героев',sub:'Слова из имён: Witch, Knight, Queen',icon:{img:'heroes/witch_doctor',svg:'helmet'}},
 {id:'words',name:'Полезные слова',sub:'Глаголы, прилагательные и существительные',icon:{img:'items/tpscroll',svg:'book'}},
 {id:'phrases',name:'Фразы',sub:'Короткие фразы для общения',icon:{svg:'ally'}},
 {id:'lore',name:'Лор Доты',sub:'Настоящие тексты из игры: слова в контексте',icon:{img:'items/ultimate_scepter',svg:'scroll'},tier:true}
];
const ROLES=[
 {id:'c',name:'Керри',hero:'juggernaut',heroName:'Juggernaut',ab:'juggernaut_blade_fury',desc:'Набирает силу и решает исход поздней игры'},
 {id:'m',name:'Мид',hero:'invoker',heroName:'Invoker',ab:'invoker_sun_strike',desc:'Центральная линия и руны'},
 {id:'o',name:'Оффлейн',hero:'mars',heroName:'Mars',ab:'mars_arena_of_blood',desc:'Начинает драки и мешает вражескому керри'},
 {id:'s',name:'Саппорт',hero:'disruptor',heroName:'Disruptor',ab:'disruptor_static_storm',desc:'Обзор, контроль и спасение союзников'}
];
const ROLE_NAME={c:'керри',m:'мид',o:'оффлейн',s:'саппорт'};
const LNAME={de:'по-немецки',en:'по-английски'};
const LANG_NAME={de:'немецкий',en:'английский'};
const LEARN_AT=3;
const RANKS=[
 {n:'Новичок',g:'Новичка',at:0,m:1},{n:'Ученик',g:'Ученика',at:10,m:1.1},{n:'Практик',g:'Практика',at:25,m:1.2},{n:'Киноман',g:'Киномана',at:50,m:1.3},
 {n:'Знаток',g:'Знатока',at:80,m:1.4},{n:'Эксперт',g:'Эксперта',at:120,m:1.5},{n:'Мастер',g:'Мастера',at:170,m:1.75},{n:'Легенда',g:'Легенды',at:230,m:2}
];
const APP_LINK='https://t.me/languagegamesbot/languagedota2';
const CDN='https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/';
const portrait=k=>`${CDN}heroes/${k}.png`;

// свои обложки для дуэли и «Шпиона» вместо героев Доты
const svgArt=(bg1,bg2,body)=>"data:image/svg+xml;utf8,"+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><defs><radialGradient id='g' cx='50%' cy='35%' r='75%'><stop offset='0' stop-color='${bg1}'/><stop offset='1' stop-color='${bg2}'/></radialGradient></defs><rect width='200' height='200' fill='url(#g)'/>${body}</svg>`).replace(/'/g,'%27');
const GART={
  duel:svgArt('#3a2a12','#0b0b0c',"<g fill='none' stroke='#F5C451' stroke-width='7' stroke-linecap='round'><path d='M52 148L132 68M118 62l20-6-6 20M60 128l12 12'/><path d='M148 148L68 68M82 62l-20-6 6 20M140 128l-12 12'/></g><text x='100' y='186' text-anchor='middle' font-family='Georgia' font-weight='700' font-size='26' fill='#F5C451' opacity='.85'>VS</text>"),
  spy:svgArt('#14303a','#08090a',"<g fill='none' stroke='#9fe3ff' stroke-width='7' stroke-linecap='round' stroke-linejoin='round'><path d='M40 104c16-24 38-36 60-36s44 12 60 36c-16 24-38 36-60 36s-44-12-60-36z'/><circle cx='100' cy='104' r='18'/></g><path d='M58 70h84l-10-26H68z' fill='#9fe3ff' opacity='.9'/><rect x='46' y='66' width='108' height='8' rx='4' fill='#9fe3ff'/>")
};
/* ================= хранилище ================= */
const KEY='dota_quiz_v4',OLD_KEY='dota_deutsch_v3',MKEY='dota_m_v1';
const fresh=()=>({scLv:scLvNow(),v:5,onboarded:false,langs:['en'],roles:'all',gold:0,streak:0,lastDay:null,best:{},answered:0,correct:0,snd:true,fx:true,full:true,hideLearned:true,mistakes:[],duels:{},theme:'hud',tab:'learn',path:'mix',games:['dota','cs2'],auto:false,goal:20,ach:{}});
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
  f.mistakes=f.mistakes.filter(x=>typeof x==='string'&&MODES.some(m=>x.startsWith(m.id+'|')));
  if(!f.best||typeof f.best!=='object')f.best={};
  if(!f.duels||typeof f.duels!=='object')f.duels={};
  if(!['hud','clean','light'].includes(f.theme))f.theme='hud';
  if(!f.ach||typeof f.ach!=='object')f.ach={};
  if(Array.isArray(f.langs)&&f.langs.length>1)f.langs=[f.langs[0]];
  if(!Array.isArray(f.recent))f.recent=[];
  if(f.subV!==3){f.subStyle='glass';f.subV=3;if(!['en+ru','en+de','de+ru','en','de','ru','off'].includes(f.scSub)||['en','de','ru'].includes(f.scSub))delete f.scSub;}
  if(!['learn','spy','arena','profile'].includes(f.tab))f.tab='learn';
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
const SV0=store.sv||0;let CLOUD_OK=false,CLOUD_T=0;
function save(){
  store.sv=Date.now();const s=JSON.stringify(store);
  try{localStorage.setItem(KEY,s);}catch(e){}
  if(!CLOUD_OK||!TG||!TG.CloudStorage)return;
  clearTimeout(CLOUD_T);CLOUD_T=setTimeout(()=>{const v=JSON.stringify(store);cloudSaveChunked(KEY,v);try{if(v.length<4000)TG.CloudStorage.setItem(KEY,v,()=>{});}catch(e){}},1200);
}
function saveM(){
  const s=JSON.stringify(M);
  try{localStorage.setItem(MKEY,s);}catch(e){}
  if(CLOUD_OK)cloudSaveChunked(MKEY,s);
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
    try{if(!TG||!TG.CloudStorage)return res(null);TG.CloudStorage.getItem(key,(err,val)=>res(err||!val?null:val));}catch(e){res(null);}
  });
}
async function cloudLoadM(){
  const n=+(await cloudGet(MKEY+'_n'))||0;if(!n)return null;
  let s='';for(let i=0;i<n;i++){const p=await cloudGet(MKEY+'_'+i);if(p===null)return null;s+=p;}
  try{return JSON.parse(s);}catch(e){return null;}
}
function initTG(){
  if(!TG)return;
  try{TG.ready();TG.expand();}catch(e){}
  try{if(TG.enableVerticalSwipes)TG.enableVerticalSwipes();}catch(e){}
  try{TG.setHeaderColor('#0E1318');TG.setBackgroundColor('#0E1318');if(TG.setBottomBarColor)TG.setBottomBarColor('#0E1318');}catch(e){}
  setInsets();
  ['safeAreaChanged','contentSafeAreaChanged','fullscreenChanged','viewportChanged'].forEach(ev=>{try{TG.onEvent(ev,setInsets);}catch(e){}});
  try{TG.BackButton.onClick(onBack);}catch(e){}
  applyFullscreen();setTimeout(applyFullscreen,500);
  document.addEventListener('pointerdown',function once(){document.removeEventListener('pointerdown',once,true);if(store.full!==false&&canFull()&&!TG.isFullscreen)applyFullscreen();},true);
  cloudSync();
}
function cloudLoad(key){return new Promise(res=>{try{if(!TG||!TG.CloudStorage)return res(null);
  TG.CloudStorage.getItem(key+'_n',(e,n)=>{n=+n;if(e||!n)return res(null);const ks=[...Array(n).keys()].map(i=>key+'_'+i);
    TG.CloudStorage.getItems(ks,(e2,v)=>{if(e2||!v)return res(null);try{res(JSON.parse(ks.map(k=>v[k]||'').join('')));}catch(x){res(null);}});});}catch(e){res(null);}});}
// 12.1: синк телефон ↔ ПК. Раньше облачная копия бралась целиком, только если в ней больше ответов, — «Мои слова», награды,
// покупки и звёзды с другого устройства терялись. Теперь — слияние по полям; настройки экрана/звука остаются свои.
const LOCAL_ONLY=['snd','fx','full','fullV','theme','tab','subV','subStyle','scSub','scSubChosen','scVol','scMute','musVol','musAuto','vtask','scStopPh','bg3d','labSub','labSnd','labUi','tts','autoSpeak','srCat','kinoCat','dictV','dictVS','scLast','srRecent','admPlayer','scPause','scFill','tourV','tourPlayed','tourLang'];
function storeMerge(c){storeRelay(c);const L=store,cNew=(c.sv||0)>SV0,o=Object.assign({},cNew?L:c,cNew?c:L);
  const uni=k=>Object.assign({},c[k]||{},L[k]||{});
  o.myw=uni('myw');o.mywDel=uni('mywDel');for(const k in c.myw||{}){const a=(L.myw||{})[k],b=c.myw[k];if(a&&((b.st||0)>(a.st||0)||((b.st||0)===(a.st||0)&&(b.due||0)>(a.due||0))))o.myw[k]=b;}
  for(const k in o.mywDel)if(o.myw[k]&&(o.myw[k].at||0)<o.mywDel[k])delete o.myw[k];
  o.rw=uni('rw');for(const k in c.rw||{})if(L.rw&&L.rw[k]&&c.rw[k].t<L.rw[k].t)o.rw[k]=c.rw[k];
  ['scOwn','kvPaid','kvDone','ach','duels','goalsDone','seg','showRw','dirCut'].forEach(k=>{if((c[k]&&typeof c[k]==='object'&&!Array.isArray(c[k]))||(L[k]&&typeof L[k]==='object'&&!Array.isArray(L[k])))o[k]=uni(k);});
  o.best=uni('best');for(const k in c.best||{})o.best[k]=Math.max(+c.best[k]||0,+(L.best||{})[k]||0);
  ['answered','correct','bestStreak'].forEach(k=>o[k]=Math.max(+c[k]||0,+L[k]||0));
  LOCAL_ONLY.forEach(k=>{if(k in L)o[k]=L[k];else delete o[k];});
  return normalize(o);}
function scMergeIn(c){for(const id in c){const a=scP(id),b=scRelay(id,c[id]||{});
  a.done=[...new Set([...a.done,...(b.done||[])])];for(const k in b.m||{})a.m[k]=Math.max(a.m[k]||0,b.m[k]);Object.assign(a.w,b.w||{});
  a.got=Object.assign({},b.got||{},a.got||{});a.vq=Object.assign({},b.vq||{},a.vq||{});a.rDone=Object.assign({},b.rDone||{},a.rDone||{});
  if(b.st){a.st=a.st||{};for(const k in b.st)a.st[k]=Math.max(a.st[k]||0,b.st[k]);}
  if(b.boss)a.boss=Math.max(a.boss||0,b.boss);
  for(const k in b.r||{}){const x=a.r[k],y=b.r[k];if(!x||y[0]>x[0]||(y[0]===x[0]&&y[1]>x[1]))a.r[k]=y;}}}
async function cloudSync(){
  try{let c=await cloudLoad(KEY);if(!c){const v=await cloudGet(KEY);try{c=v&&JSON.parse(v);}catch(e){c=null;}}
    let more=true;
    if(c&&typeof c==='object'){
      if((store.resetAt||0)>(c.sv||0))more=false;   // в облаке — прогресс до сброса: не возвращаем его
      else if((c.resetAt||0)>(store.resetAt||0)&&(c.resetAt||0)>SV0){const keep={};LOCAL_ONLY.forEach(k=>{if(k in store)keep[k]=store[k];});store=normalize(Object.assign(c,keep));SC={};M={};RV={};}   // сброс был на другом устройстве
      else store=storeMerge(c);
    }else if(!store.answered){const o0=await cloudGet(OLD_KEY);let o=null;try{o=o0&&JSON.parse(o0);}catch(e){}if(o&&(o.answered||0)>0&&!store.onboarded)store=migrate(o);}
    if(more){const sc=await cloudLoad(SCK);if(sc)scMergeIn(sc);
      const cm=await cloudLoadM();if(cm)for(const k in cm)if((cm[k]||0)>(M[k]||0))M[k]=cm[k];
      const cr=await cloudLoad(RKEY);if(cr)for(const k in cr){const x=RV[k],y=cr[k];if(Array.isArray(y)&&(!x||y[0]>x[0]))RV[k]=y;}}
  }catch(e){}
  CLOUD_OK=true;save();scSave();saveM();saveRV();
  if(screen==='home'&&!document.querySelector('.dxo,.rwo,.dfly,.sc-sheetwrap')&&!document.body.classList.contains('kw-open'))try{renderHome();}catch(e){}
}
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
  page:()=>noise(0,.16,.018,{type:'bandpass',f:1800,fTo:900,q:.6})
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
function sfx(n,arg){if(!store.snd||store.labSnd==='off')return;try{SFX[n](arg);}catch(e){}}
/* ================= 7.0: лаборатория оформления (видит только админ) ================= */
// Варианты субтитров, звуков и интерфейса — переключаются в админ-панели, применяются только на этом устройстве.
// В админской лаборатории оставлены ровно 3 варианта каждого слоя.
// Много вариантов только мешает выбрать и раздувает CSS.
const LAB_SUB=[['glass','Стильные (сейчас)'],['netflix','Стриминг'],['criterion','Артхаус'],['bateman','Бейтман'],['soprano','Сопрано'],['taxi','Таксист'],['wolf','Уолл-стрит'],['bunker','Бункер'],['karaoke','Крупные плашки'],['minimal','Минимум']];
const LAB_SND=[['cs','CS (сейчас)'],['soft','Мягкие'],['typewriter','Печатная машинка'],['projector','Кинопроектор'],['arcade','8-бит'],['off','Без звуков']];
const LAB_UI=[['grafit','Графит (сейчас)'],['noir','Нуар · Сопрано'],['bone','Визитка · Психопат'],['taxi','Такси'],['wolf','Уолл-стрит'],['bunker','Бункер'],['neon','Неон · кинотеатр']];
const labSub=()=>FLAG_ADMIN&&store.labSub?store.labSub:'glass';
function labApply(){try{document.body.dataset.ui=FLAG_ADMIN&&store.labUi&&store.labUi!=='grafit'?store.labUi:'';const k=FLAG_ADMIN&&store.labSnd?store.labSnd:'cs';Object.assign(SFX,SFXP[k]||SFXP.cs);}catch(e){}}


/* ================= утилиты ================= */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const app=$('#app');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const rnd=a=>a[Math.floor(Math.random()*a.length)];
function plural(n,f){const m10=n%10,m100=n%100;if(m10===1&&m100!==11)return f[0];if(m10>=2&&m10<=4&&(m100<12||m100>14))return f[1];return f[2];}
const fmt=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const joinTok=list=>list.reduce((s,t)=>t.g?s+t.t:(s?s+' '+t.t:t.t),'');
const toks=arr=>arr.map(p=>({t:p[0],g:!!p[1]}));
const accuracy=()=>store.answered?Math.round(store.correct/store.answered*100):null;
function underline(name,focus){return focus&&name.includes(focus)&&focus!==name?esc(name).replace(esc(focus),`<u>${esc(focus)}</u>`):esc(name);}
// 12.1: при любом переходе — убрать всё, что висит поверх экрана (карта словаря с видео, мини-плеер, поповеры слов),
// и остановить видео эпизода, если уходим со сцены. Раньше карта/видео могли остаться висеть над новым экраном.
function uiClean(cls){try{if(!/\bscnscr\b/.test(cls||''))SC_DIR=false;}catch(e){}const scn=/\bscnscr\b/.test(cls||'');if(!scn)try{NAV_BACK=null;}catch(e){}
  document.querySelectorAll('.dxo,.rwo').forEach(o=>{o._c=true;o.querySelectorAll('video').forEach(v=>{try{v.pause();v.removeAttribute('src');v.load();}catch(e){}});o.remove();});
  document.body.classList.remove('dx-open');try{kwHide(0);}catch(e){}try{musDuck(false);}catch(e){}
  try{if(SCLIP&&!SCLIP.paused)SCLIP.pause();}catch(e){}
  if(!scn)try{if(SV)scStop();}catch(e){}}
function mount(html,cls){const tab=/\btabscr\b/.test(cls||'');uiClean(cls);try{if(!/\bscnscr\b/.test(cls||'')&&MUS)musStop();}catch(e){}try{gavGone();}catch(e){}document.body.classList.toggle('tabs-on',tab);if(!tab)paintTabbar(null);app.innerHTML=`<div class="screen ${cls||''}">${html}</div>`;window.scrollTo(0,0);try{if(!/\bscnscr\b/.test(cls||'')){delete document.body.dataset.scn;ambPause(true);}if(window.BG3D)BG3D.set(document.body.dataset.scn||'app');}catch(e){}document.querySelectorAll('.sctour,.ln-pop,.ln-tip').forEach(x=>x.remove());try{appBgApply();}catch(e){}}
function applyFx(){
  document.body.classList.toggle('nofx',!store.fx);
  if(!document.body.dataset.world)setWorld('neutral');
  try{if(TG){const c=store.theme==='light'?'#F2EEE6':store.theme==='clean'?'#0F1115':'#0C0E0F';TG.setHeaderColor(c);TG.setBackgroundColor(c);if(TG.setBottomBarColor)TG.setBottomBarColor(c);}}catch(e){}
}
function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),1900);}
function roleMatch(roles){return store.roles==='all'||store.roles.some(r=>roles.includes(r));}
let SEEDED=false;
const poolFor=src=>SEEDED?src:src.filter(c=>roleMatch(c.roles));
const hasArt=s=>/^(der|die|das) /.test(s);
const noArt=s=>s.replace(/^(der|die|das) /,'');
// варианты-ловушки: похожие по длине, по части речи и по виду (имя с большой буквы к имени, фраза к фразе),
// чтобы правильный ответ не бросался в глаза
function distinct(list,card,n,label){
  const own=String(label(card)||''),seen=new Set([own.toLowerCase()]),cand=[];
  const up=s=>/^[A-ZА-ЯЁÄÖÜ]/.test(s),wc=s=>s.split(/\s+/).length;
  for(const o of shuffle(list)){if(o===card)continue;const l=String(label(o)||'');if(!l||seen.has(l.toLowerCase()))continue;seen.add(l.toLowerCase());
    const d=Math.abs(l.length-own.length)/Math.max(5,own.length)+Math.abs(wc(l)-wc(own))*0.3+(up(l)!==up(own)?0.5:0)+(card.pos&&o.pos&&card.pos!==o.pos?0.6:0)+Math.random()*0.45;
    cand.push({o,d});}
  return cand.sort((a,b)=>a.d-b.d).slice(0,n).map(x=>x.o);
}
function articleRule(noun){
  if(/(ung|heit|keit|schaft|ion)$/.test(noun))return 'Слова на <b>-ung, -heit, -keit, -schaft, -ion</b> почти всегда женского рода.';
  if(/(chen|lein)$/.test(noun))return 'Слова на <b>-chen</b> и <b>-lein</b> всегда среднего рода.';
  return 'Тут правила нет, придётся запомнить. Совет: учи слово сразу вместе с артиклем.';
}
const langBadge=L=>`<span class="lb${L==='de'?' de':''}">${L==='de'?'DE':'EN'}</span>`;
function heroFor(){
  const r=store.roles==='all'?['s']:store.roles;
  return ROLES.find(x=>x.id===(r.includes('s')?'s':r[0]))||ROLES[3];
}

/* ================= эффекты ================= */
function center(el){const r=el.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2];}
function burstAt(el,n,colors){
  if(!store.fx||!el)return;
  const [cx,cy]=center(el);colors=colors||['#F6DDA0','#E3C27A','#8FDC5A','#FFF1BF','#C9A45A'];
  for(let i=0;i<n;i++){
    const p=document.createElement('div');p.className='pt';
    const a=Math.random()*Math.PI*2,d=60+Math.random()*110;
    p.style.left=cx+'px';p.style.top=cy+'px';
    p.style.setProperty('--dx',Math.cos(a)*d+'px');p.style.setProperty('--dy',Math.sin(a)*d-20+'px');p.style.setProperty('--r',(Math.random()*540-270)+'deg');
    p.style.background=colors[i%colors.length];if(Math.random()<.5)p.style.transform='rotate(45deg)';
    document.body.appendChild(p);setTimeout(()=>p.remove(),950);
  }
}
function flyCoins(fromEl,toEl,n){
  if(!store.fx||!fromEl||!toEl||!Element.prototype.animate)return;
  const [fx,fy]=center(fromEl),[tx,ty]=center(toEl);
  for(let i=0;i<n;i++){
    const c=document.createElement('div');c.className='coin';c.style.left=(fx-7)+'px';c.style.top=(fy-7)+'px';document.body.appendChild(c);
    const mx=(Math.random()-.5)*150,my=-50-Math.random()*80;
    const an=c.animate([{transform:'translate(0,0) scale(.6)',opacity:0},{transform:`translate(${mx}px,${my}px) scale(1.1)`,opacity:1,offset:.35},{transform:`translate(${tx-fx}px,${ty-fy}px) scale(.5)`,opacity:.9}],{duration:700+i*70,easing:'cubic-bezier(.3,.7,.3,1)'});
    an.onfinish=()=>c.remove();
  }
}
function announce(text,cls){const d=document.createElement('div');d.className='announce'+(cls?' '+cls:'');d.textContent=text;document.body.appendChild(d);setTimeout(()=>d.remove(),1450);}
function death(){if(!store.fx)return;document.body.classList.add('dead');setTimeout(()=>document.body.classList.remove('dead'),600);}
function restart(el,cls){if(!el)return;el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);}
function countUp(el,from,to,ms){
  if(!el)return;
  if(!store.fx||from===to){el.textContent=fmt(to);return;}
  const t0=performance.now(),d=ms||650;
  (function f(t){const p=Math.min(1,(t-t0)/d);el.textContent=fmt(Math.round(from+(to-from)*(1-Math.pow(1-p,3))));if(p<1)requestAnimationFrame(f);})(t0);
}
const KILLS=n=>n===2?'Дубль!':n===3?'Хет-трик!':n===4?'Серия ×4':n<=6?'В ударе!':'Без дублей!';

/* ================= иконки ================= */
function iconHTML(ic,size,o){
  o=o||{};
  const cls='slot'+(size?' '+size:'');
  const ov=(o.cd>0?`<i class="cd" style="--cd:${o.cd}%"></i>`:'')+(o.hk?`<i class="hk">${o.hk}</i>`:'')+(o.chg!==undefined&&o.chg!==''&&o.chg!==0?`<i class="chg">${o.chg}</i>`:'');
  if(ic&&ic.img)return `<div class="${cls} hasimg"><img src="${CDN}${ic.img}.png" alt="" loading="lazy" onerror="this.parentNode.classList.add('noimg')">${svg(ic.svg)}${ov}</div>`;
  return `<div class="${cls}">${svg(ic&&ic.svg)}${ov}</div>`;
}
const itemIcon=c=>({img:ITEM_IMG[c.name]?'items/'+ITEM_IMG[c.name]:null,svg:c.icon});
const skillIcon=s=>({img:'abilities/'+s.key,svg:s.icon});
const heroIcon=h=>({img:'heroes/'+h.k,svg:'helmet'});

/* ================= прогресс слов ================= */
const mget=k=>M[k]||0;
const isLearned=k=>mget(k)>=LEARN_AT;
function bump(k,ok){
  const before=mget(k);let v=ok?Math.min(before+1,LEARN_AT):Math.max(0,before-1);
  if(v)M[k]=v;else delete M[k];
  return {before,after:v,learnedNow:ok&&before<LEARN_AT&&v>=LEARN_AT};
}
const cidOf=(mode,c)=>mode==='lore'||mode==='terms'||mode==='heroes'||mode==='words'||mode==='phrases'?c.id:mode==='items'?(c.parts?c.name:c.id):c.key;
const mkey=(mode,cid,L)=>mode+'|'+cid+'|'+L;
function basePool(mode,L){
  if(mode==='lore')return loreVocab(L);
  if(mode==='terms')return TERMS;
  if(mode==='items')return poolFor([...ITEMS,...BUILDS]);
  if(mode==='skills')return poolFor(SKILLS);
  if(mode==='heroes')return poolFor(HEROES);
  if(mode==='words')return WORDS.filter(w=>CURW==='cs2'?w.g==='cs2':CURW==='best'?BEST_WORDS.includes(w.id):!w.g);
  if(mode==='phrases')return PHRASES;
  return [];
}
function poolOf(mode,L){
  const base=basePool(mode,L);
  if(SEEDED||!store.hideLearned)return base;
  const left=base.filter(c=>!isLearned(mkey(mode,cidOf(mode,c),L)));
  return left.length?left:base;
}
function modeProgress(mode){
  let total=0,learned=0;
  store.langs.forEach(L=>basePool(mode,L).forEach(c=>{total++;if(isLearned(mkey(mode,cidOf(mode,c),L)))learned++;}));
  return {total,learned};
}
function totals(){let learned=0,going=0;for(const k in M){if(!MODES.some(m=>k.startsWith(m.id+'|')))continue;if(M[k]>=LEARN_AT)learned++;else if(M[k]>0)going++;}return {learned,going};}
function describe(k){
  const [mode,cid,L]=k.split('|');let c;
  try{
    if(mode==='terms'&&(c=TERMS.find(x=>x.id===cid)))return {w:tWord(c,L),t:c.ru.toLowerCase(),ic:{svg:c.icon}};
    if(mode==='items'){
      if((c=ITEMS.find(x=>x.id===cid)))return {w:L==='de'?`${c.art} ${c.noun}`:c.focus,t:c.ru,ic:itemIcon(c)};
      if((c=BUILDS.find(x=>x.name===cid)))return {w:L==='de'?joinTok(toks(c.parts)):c.name,t:c.ru,ic:itemIcon(c)};
    }
    if(mode==='skills'&&(c=SKILLS.find(x=>x.key===cid)))return {w:L==='de'?c.de:c.name,t:c.ru,ic:skillIcon(c)};
    if(mode==='heroes'&&(c=HEROES.find(x=>x.id===cid)))return {w:L==='de'?c.de:c.f,t:c.ru,ic:heroIcon(c)};
    if(mode==='words'&&(c=WORDS.find(x=>x.id===cid)))return {w:c[L],t:c.ru,ic:c.icon};
    if(mode==='phrases'&&(c=PHRASES.find(x=>x.id===cid)))return {w:c[L],t:c.ru,ic:{svg:'ally'}};
    if(mode==='lore'&&(c=LORE_VOCAB.find(x=>x.id===cid))&&c[L])return {w:c[L].l,t:c.ru,ic:{svg:'scroll'}};
  }catch(e){}
  return null;
}
function rankInfo(n){
  if(n===undefined)n=totals().learned;
  let i=0;RANKS.forEach((r,k)=>{if(n>=r.at)i=k;});
  const r=RANKS[i],nx=RANKS[i+1]||null;
  return {r,i,n,nx,pct:nx?Math.round((n-r.at)/(nx.at-r.at)*100):100};
}

/* ================= лор (хай тир) ================= */
let LORE=null,LORE_STATE='idle';const LIDX={};
const LET="A-Za-zÄÖÜäöüß'";
const reEsc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
function findForm(text,form,L,pos){
  const m=new RegExp(`(^|[^${LET}])(${reEsc(form)})(?=[^${LET}]|$)`,L==='en'?'i':'').exec(text);
  if(m)return {i:m.index+m[1].length,f:m[2]};
  if(L==='de'&&pos!=='n'){const F=form[0].toUpperCase()+form.slice(1);if(new RegExp(`^${reEsc(F)}(?=[^${LET}]|$)`).test(text))return {i:0,f:F};}
  return null;
}
function loreIndex(L){
  if(!LORE)return null;
  if(LIDX[L])return LIDX[L];
  const idx={};
  for(const v of LORE_VOCAB){
    if(!v[L])continue;const hits=[];
    for(const k in LORE){const t=LORE[k][L];if(!t)continue;for(const f of v[L].f){const m=findForm(t,f,L,v.pos);if(m){hits.push({k,f:m.f,i:m.i,base:f===v[L].f[0]});break;}}}
    if(hits.length)idx[v.id]=hits;
  }
  return (LIDX[L]=idx);
}
function loreVocab(L){const idx=loreIndex(L);return idx?LORE_VOCAB.filter(v=>v[L]&&idx[v.id]&&idx[v.id].some(h=>loreOK(h.k))):[];}
const loreHasNames=()=>!!LORE&&Object.values(LORE).some(e=>e.name);
function loreName(k,L){
  const e=LORE&&LORE[k];if(e&&e.name)return e.name[L]||e.name.en;
  if(k.startsWith('item_')){const n=Object.keys(ITEM_IMG).find(x=>ITEM_IMG[x]===k.slice(5));if(n)return n;}
  const s=SKILLS.find(x=>x.key===k);if(s)return s.name;
  return cap(k.replace(/^item_/,'').replace(/_/g,' '));
}
const HERO_POS=window.__DATA.HERO_POS;
function loreHero(k){const e=LORE&&LORE[k];if(e&&e.hero)return e.hero;let best='';for(const h in HERO_POS){if(k.startsWith(h+'_')&&h.length>best.length)best=h;}return best||null;}
function loreOK(k){if(k.startsWith('item_')||SEEDED||store.roles==='all')return true;const h=loreHero(k),p=h&&HERO_POS[h];return !p||store.roles.some(r=>p.includes(r));}
const loreIcon=k=>k.startsWith('item_')?{img:'items/'+k.slice(5),svg:'scroll'}:{img:'abilities/'+k,svg:'lightning'};
function loadLore(){
  if(LORE_STATE==='loading'||LORE_STATE==='ok')return;
  if(typeof fetch!=='function'){LORE_STATE='fail';return;}
  LORE_STATE='loading';
  fetch('lore.json',{cache:'no-cache'}).then(r=>r.ok?r.json():null).then(d=>{
    if(d&&d.entries&&Object.keys(d.entries).length){LORE=d.entries;LORE_STATE='ok';}else LORE_STATE='fail';
  }).catch(()=>{LORE_STATE='fail';}).then(()=>{if(screen==='home')renderHome();});
}
const POSNAME={n:'существительное',a:'прилагательное',v:'глагол',d:'наречие'};
function loreDistr(v,L,need){
  const ok=x=>x!==v&&x.pos===v.pos&&!(v.g&&x.g===v.g)&&(!need||x[L]);
  return distinct(LORE_VOCAB.filter(ok),v,3,x=>need?x[L].f[0]:x.ru);
}
function loreQ(v,L,kind,avoid){
  const allHits=loreIndex(L)[v.id],okHits=allHits.filter(h=>loreOK(h.k)),hits=okHits.length?okHits:allHits;
  let pool=kind==='lg'?hits.filter(h=>h.base):hits;if(!pool.length){pool=hits;kind='lw';}
  const fresh=avoid?pool.filter(h=>!avoid.has('lk:'+h.k)):pool;
  const h=rnd(fresh.length?fresh:pool);if(avoid)avoid.add('lk:'+h.k);
  const e=LORE[h.k],t=e[L],name=loreName(h.k,L);
  const base={mode:'lore',cid:v.id,lang:L,kind,chip:chip(L,'lore'),icon:loreIcon(h.k),aw:v[L].l,at:v.ru,time:35,
    sub:null,say:t,notes:[`<b>Перевод:</b> ${esc(e.ru)}`],hint:`Это ${POSNAME[v.pos]}. Перевод всего текста: ${esc(e.ru)}`};
  const before=esc(t.slice(0,h.i)),after=esc(t.slice(h.i+h.f.length));
  if(kind==='lg'){
    const o=loreDistr(v,L,true),low=h.f.toLowerCase()===h.f?h.f:(L==='de'&&v.pos==='n'?h.f:h.f.toLowerCase());
    return Q({...base,titleSmall:true,title:esc(name),quote:`${before}<span class="gapw" id="gap"></span>${after}`,ask:'Какое слово пропущено?',
      opts:shuffle([v,...o]).map(x=>({v:x.id,label:esc(x===v?low:x[L].f[0])})),correct:v.id,fill:h.f});
  }
  const o=loreDistr(v,L,false);
  return Q({...base,titleSmall:true,title:esc(name),quote:`${before}<u>${esc(h.f)}</u>${after}`,ask:`Что значит «${esc(h.f)}» в этом тексте?`,
    opts:shuffle([v,...o]).map(x=>({v:x.id,label:esc(x.ru)})),correct:v.id});
}
const NAME_STOP=new Set(['of','the','and','der','die','das','des','und','von','dem','den']);
function loreGuessQ(k,L){
  const e=LORE[k];if(!e||!e.name)return null;
  const name=loreName(k,L),type=k.startsWith('item_');
  let t=esc(e[L]);
  name.split(/[\s'’-]+/).filter(w=>w.length>=3&&!NAME_STOP.has(w.toLowerCase())).forEach(w=>{
    t=t.replace(new RegExp(`(^|[^${LET}])(${reEsc(esc(w))})(?=[^${LET}]|$)`,'gi'),'$1<span class="mask"></span>');
  });
  let others=shuffle(Object.keys(LORE).filter(x=>x!==k&&LORE[x].name&&x.startsWith('item_')===type&&loreOK(x)));if(others.length<3)others=shuffle(Object.keys(LORE).filter(x=>x!==k&&LORE[x].name&&x.startsWith('item_')===type));
  const seen=new Set([name]),o=[];for(const x of others){const n=loreName(x,L);if(seen.has(n))continue;seen.add(n);o.push(x);if(o.length===3)break;}
  if(o.length<3)return null;
  return Q({mode:'lore',cid:'li:'+k,lang:L,kind:'li',chip:chip(L,'lore'),icon:{svg:'eye'},reveal:loreIcon(k),noM:true,time:45,cols:1,
    aw:name,at:(e.name.ru&&e.name.ru!==name)?e.name.ru:(type?'предмет':'умение'),say:e[L],title:type?'Что это за предмет?':'Что это за умение?',quote:t,ask:'Прочитай описание и выбери ответ',
    opts:shuffle([k,...o]).map(x=>({v:x,label:esc(loreName(x,L))})),correct:k,notes:[`<b>Перевод:</b> ${esc(e.ru)}`],hint:null});
}

/* ================= вопросы ================= */
function Q(o){return Object.assign({time:20,cols:2,notes:[],hint:null,sub:null},o);}
const tWord=(t,L)=>L==='de'?`${t.art} ${t.noun}`:t.en.word;
const enEx=(c,blank)=>c.en.ex.replace('{w}',blank?'___':`<b>${c.en.word}</b>`).replace('{W}',blank?'___':`<b>${cap(c.en.word)}</b>`);
const exFill=(t,L,blank)=>L==='de'?t.ex.replace('{w}',blank?'___':`<b>${t.w}</b>`):enEx(t,blank);
const exRu=(t,L)=>L==='en'?(t.en.exru||t.exru):t.exru;
const chip=(L,mode)=>`${langBadge(L)} ${MODES.find(m=>m.id===mode).name}`;
const ART=['der','die','das'].map(a=>({v:a,label:a}));

const BUILD={
  terms(c,L,kind){
    const base={mode:'terms',cid:c.id,lang:L,kind,chip:chip(L,'terms'),icon:{svg:c.icon},aw:tWord(c,L),at:c.ru.toLowerCase()};
    const notes=[`${exFill(c,L,false)}<br>${esc(exRu(c,L))}`,L==='de'?c.fn:c.en.fn];
    if(kind==='article')return Q({...base,title:`<span class="gapw" id="gap"></span>${esc(c.noun)}`,ask:`Какой артикль у слова «${esc(c.ru.toLowerCase())}»?`,opts:ART,correct:c.art,cols:3,fill:c.art,notes,hint:articleRule(c.noun),time:15});
    if(kind==='x2ru'){
      const o=distinct(TERMS,c,3,t=>t.ru);
      return Q({...base,title:esc(tWord(c,L)),ask:'Что это значит?',opts:shuffle([c,...o]).map(x=>({v:x.id,label:esc(x.ru.toLowerCase())})),correct:c.id,notes,hint:`<b>Пример:</b> ${exFill(c,L,false)}`});
    }
    const o=distinct(TERMS,c,3,t=>tWord(t,L));
    return Q({...base,title:esc(c.ru),ask:`Как это ${LNAME[L]}?`,opts:shuffle([c,...o]).map(x=>({v:x.id,label:esc(tWord(x,L))})),correct:c.id,notes,hint:`<b>Пример:</b> ${exFill(c,L,true)}<br>${esc(exRu(c,L))}`});
  },
  items(c,L,kind){
    if(c.parts)return buildQ(c,L,kind);
    const aw=L==='de'?`${c.art} ${c.noun}`:c.focus;
    const base={mode:'items',cid:c.id,lang:L,kind,chip:chip(L,'items'),icon:itemIcon(c),aw,at:c.ru,hint:`<b>Что делает в игре:</b> ${esc(c.desc)}`,notes:[`Как в названии ${esc(c.name)}.`]};
    if(kind==='article')return Q({...base,title:`<span class="gapw" id="gap"></span>${esc(c.noun)}`,sub:esc(c.name),ask:'Какой артикль?',opts:ART,correct:c.art,cols:3,fill:c.art,hint:articleRule(c.noun),time:15});
    if(kind==='x2ru'){const o=distinct(ITEMS,c,3,t=>t.ru);return Q({...base,title:`${c.art} ${esc(c.noun)}`,ask:'Что это значит?',opts:shuffle([c,...o]).map(x=>({v:x.id,label:esc(x.ru)})),correct:c.id});}
    if(kind==='mean'){const o=distinct(ITEMS,c,3,t=>t.ru);return Q({...base,title:underline(c.name,c.focus),ask:`Что значит «${esc(c.focus)}»?`,opts:shuffle([c,...o]).map(x=>({v:x.id,label:esc(x.ru)})),correct:c.id});}
    if(kind==='name'){const o=distinct(ITEMS,c,3,t=>t.focus);return Q({...base,icon:{svg:c.icon},title:esc(cap(c.ru)),ask:'Как это по-английски?',opts:shuffle([c,...o]).map(x=>({v:x.id,label:esc(x.focus)})),correct:c.id,hint:null});}
    const o=distinct(ITEMS,c,3,t=>t.art+' '+t.noun);
    return Q({...base,title:underline(c.name,c.focus),ask:`Как «${esc(c.focus)}» по-немецки?`,opts:shuffle([c,...o]).map(x=>({v:x.id,label:`${x.art} ${esc(x.noun)}`})),correct:c.id});
  },
  skills(s,L,kind){
    const base={mode:'skills',cid:s.key,lang:L,kind,chip:chip(L,'skills'),icon:skillIcon(s),hint:`Умение героя <b>${esc(s.hero)}</b>. ${esc(s.desc)}`};
    const deNote='Перевод дословный: в немецкой версии игры название может звучать иначе.';
    if(kind==='sk_word'){const o=distinct(SKILLS.filter(x=>x.w),s,3,x=>x.w[1]);return Q({...base,aw:s.w[0],at:s.w[1],title:underline(s.name,s.w[0]),sub:esc(s.hero),ask:`Что значит «${esc(s.w[0])}»?`,opts:shuffle([s,...o]).map(x=>({v:x.key,label:esc(x.w[1])})),correct:s.key,notes:[`${esc(s.name)}: ${esc(s.ru)}.`]});}
    if(kind==='sk_wde'){const o=distinct(SKILLS.filter(x=>x.w),s,3,x=>x.w[2]);return Q({...base,aw:s.w[2],at:s.w[1],title:esc(cap(s.w[1])),sub:`из названия ${esc(s.name)}`,ask:'Как это по-немецки?',opts:shuffle([s,...o]).map(x=>({v:x.key,label:esc(x.w[2])})),correct:s.key,notes:[`${esc(s.name)} по-немецки: ${esc(s.de)}.`]});}
    if(kind==='sk_ru2de'){const o=distinct(SKILLS,s,3,x=>x.de);return Q({...base,aw:s.de,at:s.ru,title:esc(cap(s.ru)),sub:esc(s.name),ask:'Как это по-немецки?',opts:shuffle([s,...o]).map(x=>({v:x.key,label:esc(x.de)})),correct:s.key,cols:1,notes:[deNote]});}
    if(kind==='sk_de2ru'){const o=distinct(SKILLS,s,3,x=>x.ru);return Q({...base,aw:s.de,at:s.ru,title:esc(s.de),sub:esc(s.name),ask:'Что это значит?',opts:shuffle([s,...o]).map(x=>({v:x.key,label:esc(x.ru)})),correct:s.key,cols:1,notes:[deNote]});}
    const o=distinct(SKILLS,s,3,x=>x.ru);
    return Q({...base,aw:s.name,at:s.ru,title:esc(s.name),sub:esc(s.hero),ask:'Что значит название?',opts:shuffle([s,...o]).map(x=>({v:x.key,label:esc(x.ru)})),correct:s.key,cols:1});
  },
  heroes(h,L,kind){
    const aw=L==='de'?h.de:h.f;
    const base={mode:'heroes',cid:h.id,lang:L,kind,chip:chip(L,'heroes'),icon:heroIcon(h),aw,at:h.ru,notes:[`Как в имени ${esc(h.h)}.`,h.note?esc(h.note):null]};
    if(kind==='h_art')return Q({...base,title:`<span class="gapw" id="gap"></span>${esc(noArt(h.de))}`,sub:esc(h.h),ask:`Какой артикль у слова «${esc(h.ru)}»?`,opts:ART,correct:h.de.split(' ')[0],cols:3,fill:h.de.split(' ')[0],hint:articleRule(noArt(h.de)),time:15});
    if(kind==='h_name'){const o=distinct(HEROES,h,3,x=>x.f.toLowerCase());return Q({...base,icon:{svg:'helmet'},title:esc(cap(h.ru)),ask:'Как это по-английски?',opts:shuffle([h,...o]).map(x=>({v:x.id,label:esc(cap(x.f))})),correct:h.id,hint:`Это слово есть в имени героя <b>${esc(h.h)}</b>.`});}
    if(kind==='h_de'){const o=distinct(HEROES,h,3,x=>x.de);return Q({...base,title:underline(h.h,h.f),ask:`Как «${esc(h.f)}» по-немецки?`,opts:shuffle([h,...o]).map(x=>({v:x.id,label:esc(x.de)})),correct:h.id,hint:`По-русски: ${esc(h.ru)}.`});}
    if(kind==='h_de2ru'){const o=distinct(HEROES,h,3,x=>x.ru);return Q({...base,title:esc(h.de),ask:'Что это значит?',opts:shuffle([h,...o]).map(x=>({v:x.id,label:esc(x.ru)})),correct:h.id,hint:`По-английски это ${esc(h.f)}, как в имени ${esc(h.h)}.`});}
    const o=distinct(HEROES,h,3,x=>x.ru);
    return Q({...base,title:underline(h.h,h.f),ask:`Что значит «${esc(h.f)}»?`,opts:shuffle([h,...o]).map(x=>({v:x.id,label:esc(x.ru)})),correct:h.id});
  },
  words(w,L,kind){
    const same=WORDS.filter(x=>x.pos===w.pos&&(x.g||'')===(w.g||''));
    const base={mode:'words',cid:w.id,lang:L,kind,chip:(w.g==='cs2'?`${langBadge(L)} CS 2`:chip(L,'words'))+`<span class="pos">${POS_RU[w.pos]}</span>`,icon:w.icon,aw:w[L],at:w.ru,hint:w.hint?esc(w.hint):null,notes:[w.hint?esc(w.hint):null]};
    if(kind==='w_art')return Q({...base,title:`<span class="gapw" id="gap"></span>${esc(noArt(w.de))}`,ask:`Какой артикль у слова «${esc(w.ru)}»?`,opts:ART,correct:w.de.split(' ')[0],cols:3,fill:w.de.split(' ')[0],hint:articleRule(noArt(w.de)),time:15});
    if(kind==='w_x2ru'){const o=distinct(same,w,3,x=>x.ru);return Q({...base,title:esc(w[L]),ask:'Что это значит?',opts:shuffle([w,...o]).map(x=>({v:x.id,label:esc(x.ru)})),correct:w.id});}
    const o=distinct(same,w,3,x=>x[L]);
    return Q({...base,title:esc(cap(w.ru)),sub:w.hint?`${w.g==='cs2'?'В CS 2':'Связь с Дотой'}: ${esc(w.hint)}`:null,hint:null,notes:[],ask:`Как это ${LNAME[L]}?`,opts:shuffle([w,...o]).map(x=>({v:x.id,label:esc(x[L])})),correct:w.id});
  },
  phrases(p,L,kind){
    const base={mode:'phrases',cid:p.id,lang:L,kind,chip:chip(L,'phrases'),icon:{svg:'ally'},aw:p[L],at:p.ru,cols:1,time:22};
    if(kind==='x2ru'){const o=distinct(PHRASES,p,3,x=>x.ru);return Q({...base,title:esc(p[L]),ask:'Что это значит?',opts:shuffle([p,...o]).map(x=>({v:x.id,label:esc(x.ru)})),correct:p.id});}
    const o=distinct(PHRASES,p,3,x=>x[L]);
    return Q({...base,title:esc(p.ru),ask:`Как сказать это ${LNAME[L]}?`,opts:shuffle([p,...o]).map(x=>({v:x.id,label:esc(x[L])})),correct:p.id});
  }
};
function buildQ(c,L,kind){
  const v=L==='en'?Object.assign({},c,{parts:c.en.parts,extra:c.en.extra,note:c.en.note}):c;
  const full=joinTok(toks(v.parts));
  const base={mode:'items',cid:c.name,lang:L,kind,chip:chip(L,'items'),icon:itemIcon(c),aw:L==='en'?c.name:full,at:c.ru,hint:`<b>Что делает в игре:</b> ${esc(c.desc)}`,notes:[esc(v.note)]};
  if(kind==='bmean'){const o=distinct(BUILDS,c,3,x=>x.ru);return Q({...base,title:esc(c.name),ask:'Что значит это название?',opts:shuffle([c,...o]).map(x=>({v:x.name,label:esc(x.ru)})),correct:c.name,cols:1});}
  if(kind==='bru2x'){const o=distinct(BUILDS,c,3,x=>joinTok(toks(x.parts)));return Q({...base,title:esc(cap(c.ru)),sub:esc(c.name),ask:'Как это по-немецки?',opts:shuffle([c,...o]).map(x=>({v:x.name,label:esc(joinTok(toks(x.parts)))})),correct:c.name,cols:1});}
  const all=[...toks(v.parts),...toks(v.extra)].map((t,i)=>({...t,id:i}));
  return Q({...base,kind:'build',title:L==='en'?esc(cap(c.ru)):esc(c.name),sub:L==='en'?null:`«${esc(c.ru)}»`,ask:L==='en'?'Собери название по-английски':'Собери название по-немецки',pool:shuffle(all),target:full,correct:full,time:40});
}
function matchQ(L,avoid){
  const fresh4=shuffle(TERMS.filter(t=>!avoid.has('terms:'+t.id)&&!(store.hideLearned&&isLearned(mkey('terms',t.id,L)))));
  const pairs=(fresh4.length>=4?fresh4:shuffle(TERMS)).slice(0,4);
  return Q({mode:'terms',cid:'match',lang:L,kind:'match',chip:chip(L,'terms'),icon:{svg:'coin'},title:'Соедини пары',ask:'Сначала слово слева, потом перевод справа',pairs,time:45,aw:'',at:''});
}
function kindsOf(mode,L,c){
  if(mode==='terms')return L==='de'?['ru2x','x2ru','article']:['ru2x','x2ru'];
  if(mode==='items'){if(c.parts)return L==='de'?['build','bru2x']:['build','bmean'];return L==='de'?['ru2x','x2ru','article']:['mean','name'];}
  if(mode==='skills')return L==='en'?(c.w?['sk_mean','sk_word']:['sk_mean']):(c.w?['sk_ru2de','sk_de2ru','sk_wde']:['sk_ru2de','sk_de2ru']);
  if(mode==='heroes')return L==='en'?['h_mean','h_name']:(hasArt(c.de)?['h_de','h_de2ru','h_art']:['h_de','h_de2ru']);
  if(mode==='words')return L==='de'&&hasArt(c.de)?['w_ru2x','w_x2ru','w_art']:['w_ru2x','w_x2ru'];
  if(mode==='lore'){const h=((loreIndex(L)||{})[c.id]||[]).filter(x=>loreOK(x.k));return h.some(x=>x.base)?['lw','lw','lg']:['lw'];}
  return ['ru2x','x2ru'];
}
function randQ(mode,L,used){
  if(mode==='lore'&&loreHasNames()&&Math.random()<.25){
    const ks=shuffle(Object.keys(LORE)).filter(k=>!used.has('lk:'+k)&&loreOK(k));
    for(const k of ks.slice(0,20)){const q=loreGuessQ(k,L);if(q){used.add('lk:'+k);return q;}}
  }
  const pool=poolOf(mode,L);if(!pool.length)return null;
  const c=pickCard(mode,L,pool,used);
  used.add(mode+':'+cidOf(mode,c));
  if(mode==='lore'){const lk=kindsOf(mode,L,c);if(!SEEDED&&mget(mkey('lore',c.id,L))>=1)lk.push('type');const kk=rnd(lk);return kk==='type'?newQ('lore',c,L,'type'):loreQ(c,L,kk,used);}
  const bk=kindsOf(mode,L,c);
  return buildAny(mode,c,L,rnd([...bk,...bk,...extraKinds(mode,L,c)]));
}
// подбор слова: сначала новые, потом недоученные; недавние уходят в конец очереди
function pickCard(mode,L,pool,used){
  const avail=pool.filter(x=>!used.has(mode+':'+cidOf(mode,x)));
  if(!avail.length)return rnd(pool);
  if(SEEDED)return shuffle(avail)[0];
  const rec=store.recent||[],pos={};rec.forEach((k,i)=>pos[k]=i);
  const score=x=>{const k=mkey(mode,cidOf(mode,x),L),m=M[k];let s=Math.random()*0.6;
    if(m===undefined)s+=1.2;else if(m<LEARN_AT)s+=0.8;
    if(pos[k]!==undefined)s-=2.5*(pos[k]+1)/rec.length;
    return s;};
  return avail.map(x=>[score(x),x]).sort((a,b)=>b[0]-a[0])[0][1];
}
function noteRecent(k){const r=(store.recent||[]).filter(x=>x!==k);r.push(k);store.recent=r.slice(-160);}
function regen(spec){
  const [mode,cid,L,kind]=spec.split('|');
  if(!store.langs.includes(L))return null;
  if(mode==='lore'){
    if(!LORE)return null;
    try{
      if(kind==='li')return loreGuessQ(cid.slice(3),L);
      const v=LORE_VOCAB.find(x=>x.id===cid);if(!v||!v[L]||!loreIndex(L)[v.id])return null;
      return kind==='type'?newQ('lore',v,L,'type'):loreQ(v,L,kind==='lg'||kind==='lw'?kind:'lw');
    }catch(e){return null;}
  }
  if(!BUILD[mode])return null;
  let c=null;
  if(mode==='terms')c=TERMS.find(x=>x.id===cid);
  else if(mode==='items')c=(['build','bmean','bru2x'].includes(kind)?BUILDS.find(x=>x.name===cid):ITEMS.find(x=>x.id===cid));
  else if(mode==='skills')c=SKILLS.find(x=>x.key===cid);
  else if(mode==='heroes')c=HEROES.find(x=>x.id===cid);
  else if(mode==='words')c=WORDS.find(x=>x.id===cid);
  else if(mode==='phrases')c=PHRASES.find(x=>x.id===cid);
  if(!c)return null;
  const all=[...kindsOf(mode,L,c),...extraKinds(mode,L,c)];
  try{return buildAny(mode,c,L,all.includes(kind)?kind:rnd(kindsOf(mode,L,c)));}catch(e){return null;}
}
const specOf=q=>[q.mode,q.cid,q.lang,q.kind].join('|');

/* ================= дуэль ================= */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
function seededQs(seed,L){
  CURW='dota';
  const orig=Math.random;Math.random=mulberry32(seed);SEEDED=true;
  try{
    const used=new Set();
    const modes=shuffle(['terms','terms','items','items','skills','heroes','heroes','words','words','phrases']);
    return modes.map(m=>randQ(m,L,used)).filter(Boolean);
  }finally{Math.random=orig;SEEDED=false;}
}
const b64n=s=>{try{return btoa(unescape(encodeURIComponent(s.slice(0,12)))).replace(/[+]/g,'-').replace(/[/]/g,'_').replace(/=+$/,'');}catch(e){return '';}};
const unb64n=s=>{try{s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';return decodeURIComponent(escape(atob(s)));}catch(e){return '';}};
function duelParam(d,withMe){
  let p=`d_${d.seed.toString(36)}_${d.L}`;
  if(withMe){const me=store.duels[d.seed];if(me)p+=`_${me.s}_${me.t}_${b64n(userName()||'Игрок')}`;}
  return p;
}
function parseDuel(p){
  if(!p||!/^d_/.test(p))return null;
  const a=p.split('_'),seed=parseInt(a[1],36),L=a[2];
  if(!seed||(L!=='en'&&L!=='de'))return null;
  const d={seed,L,opp:null};
  if(a.length>=6&&/^[0-9]+$/.test(a[3])&&/^[0-9]+$/.test(a[4]))d.opp={s:+a[3],t:+a[4],n:unb64n(a.slice(5).join('_'))||'Друг'};
  return d;
}
let DUEL=null;
function renderDuelNew(){
  screen='duel';backBtn(true);
  const both=store.langs.length===2;let L=store.langs[0];
  mount(`
    <div class="page-head"><button class="icon-btn" id="bBtn" aria-label="Назад">${ui('back')}</button><h1 class="title">Дуэль</h1></div>
    <div class="stage" style="margin:0 0 14px"><div class="pic" style="background-image:url('${GART.duel}')"></div><div class="stage-t"><span class="hn">Один на один</span></div></div>
    <p class="lead">Ты и друг отвечаете на одни и те же 10 вопросов. Больше правильных — победа. При ничьей побеждает тот, кто ответил быстрее.</p>
    ${both?`<div class="opt"><span>Язык</span>${segCtl('dl',[['en','Английский'],['de','Немецкий']],L)}</div>`:''}
    <div class="summary frame">
      <div><span>Язык</span><b id="dl">${cap(LANG_NAME[L])}</b></div>
      <div><span>Вопросов</span><b>10, в конце Рошан</b></div>
      <div><span>Отправить другу</span><b>после игры</b></div>
    </div>
    <div class="cta"><button class="btn" id="go">Начать дуэль</button></div>`,'duelscr');
  $('#bBtn').onclick=()=>{sfx('tap');renderHome();};
  if(both)bindSeg('dl',v=>{L=v;$('#dl').textContent=cap(LANG_NAME[L]);});
  $('#go').onclick=()=>{haptic('medium');startDuel({seed:1+Math.floor(Math.random()*2e9),L,opp:null});};
}
function renderDuelIntro(d){
  screen='duel';backBtn(!!store.onboarded);
  if(store.duels[d.seed]){renderDuelResult(d);return;}
  mount(`
    <div class="cover"><div class="pic" style="background-image:url('${GART.duel}')"></div></div>
    <h1 class="title">${d.opp?`${esc(d.opp.n)} вызывает тебя на дуэль`:'Тебя вызвали на дуэль'}</h1>
    <p class="lead" style="margin-top:10px">10 одинаковых вопросов ${LNAME[d.L]}. ${d.opp?'Результат соперника покажем после игры.':'После игры отправишь свой результат в чат.'}</p>
    <div class="summary frame">
      <div><span>Язык</span><b>${cap(LANG_NAME[d.L])}</b></div>
      <div><span>Победа</span><b>больше правильных, при ничьей быстрее</b></div>
    </div>
    <div class="cta btns"><button class="btn" id="go">Принять вызов</button>${store.onboarded?'':'<button class="btn dark" id="skip">Сначала посмотреть игру</button>'}</div>`,'duelscr');
  $('#go').onclick=()=>{haptic('medium');startDuel(d);};
  if($('#skip'))$('#skip').onclick=()=>{sfx('tap');startOnboarding();};
}
function startDuel(d){
  DUEL=d;
  const qs=seededQs(d.seed,d.L);
  if(!qs.length){toast('Не получилось собрать вопросы');return;}
  qs[qs.length-1].roshan=true;
  qs.forEach(q=>{q.chip=`${langBadge(q.lang)} Дуэль`;});
  S={type:'duel',mode:null,qs,i:0,correct:0,streak:0,bestStreak:0,gold:0,first:false,answered:false,wrong:[],learned:[],tInt:null,tSum:0};
  screen='quiz';countdown(()=>{sfx('whoosh');renderQ();});
}
function duelOutcome(me,op){
  if(me.s!==op.s)return me.s>op.s?1:-1;
  if(me.t!==op.t)return me.t<op.t?1:-1;
  return 0;
}
function vsHTML(d){
  const me=store.duels[d.seed],op=d.opp;
  if(!op)return `<div class="vs frame"><div class="p"><em>Ты</em><b>${me.s}/10</b><span>${me.t} с</span></div><i>VS</i><div class="p"><em>Друг</em><b>?</b><span>ещё не играл</span></div></div>`;
  const o=duelOutcome(me,op);
  return `<div class="vs frame"><div class="p ${o>0?'win':o<0?'lose':''}"><em>Ты</em><b>${me.s}/10</b><span>${me.t} с</span></div><i>VS</i><div class="p ${o<0?'win':o>0?'lose':''}"><em>${esc(op.n)}</em><b>${op.s}/10</b><span>${op.t} с</span></div></div>`;
}
// ссылки-приглашения открывают мини-апп сразу на весь экран (Telegram 8.0+: mode=fullscreen)
const fsLink=u=>/t\.me\//.test(u)&&!/mode=/.test(u)?u+(u.includes('?')?'&':'?')+'mode=fullscreen':u;
function shareLink(link,text){link=fsLink(link);
  const url=`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`;
  try{if(TG&&TG.openTelegramLink){TG.openTelegramLink(url);return;}}catch(e){}
  try{if(navigator.share){navigator.share({text:text+' '+link});return;}}catch(e){}
  try{navigator.clipboard.writeText(text+' '+link).then(()=>toast('Ссылка скопирована'),()=>toast(link));}catch(e){toast(link);}
}
function shareDuel(d){
  const me=store.duels[d.seed];
  const text=d.opp?`Дуэль на словах из Доты: у меня ${me.s}/10, у тебя ${d.opp.s}/10. Смотри результат:`:`Дуэль на словах из Доты: я набрал ${me.s}/10 за ${me.t} с. Сможешь больше?`;
  shareLink(`${APP_LINK}?startapp=${duelParam(d,true)}`,text);
}
function renderDuelResult(d,fresh){
  screen='duelres';backBtn(true);
  const me=store.duels[d.seed],o=d.opp?duelOutcome(me,d.opp):null;
  if(d.opp&&me&&(!me.opp||me.opp.s!==d.opp.s||me.opp.n!==d.opp.n)){me.opp={n:d.opp.n,s:d.opp.s,t:d.opp.t};save();setTimeout(checkAch,1200);}
  const title=o===null?'Вызов готов':o>0?'Победа в дуэли':o<0?'Поражение в дуэли':'Ничья';
  const cls=o===null||o>=0?'win':'lose';
  mount(`
    <div class="end">
      <div class="result ${cls}">
        <div class="pic" style="background-image:url('${GART.duel}')"></div>
        <span class="side">Дуэль</span>
        <h1>${title}</h1>
        <p>${o===null?'Отправь вызов другу. Он получит те же 10 вопросов и увидит твой результат после игры.':'Отправь результат сопернику, чтобы он тоже его увидел.'}</p>
      </div>
      ${vsHTML(d)}
      ${fresh&&S&&S.wrong.length?`<div class="words frame"><h3>Повтори эти слова</h3><ul>${S.wrong.slice(0,8).map(x=>`<li><b>${esc(x.w)}</b><span>${esc(x.t)}</span></li>`).join('')}</ul></div>`:''}
      <div class="end-actions">
        <button class="btn" id="share">${o===null?'Отправить вызов':'Отправить результат'}</button>
        <div class="btns two"><button class="btn dark" id="again">${o===null?'Новая дуэль':'Реванш'}</button><button class="btn dark" id="homeBtn">В меню</button></div>
      </div>
    </div>`,'endscr');
  if(fresh){sfx(o===null||o>=0?'win':'lose');if(o>0)setTimeout(()=>burstAt($('.result h1'),36),250);}
  $('#share').onclick=()=>{haptic('medium');shareDuel(d);};
  $('#again').onclick=()=>{sfx('tap');if(!store.onboarded){startOnboarding();return;}if(o===null){renderDuelNew();return;}startDuel({seed:Math.floor(Math.random()*2176782335),L:d.L});};
  $('#homeBtn').onclick=()=>{sfx('tap');if(!store.onboarded){startOnboarding();return;}renderHome();};
}

/* ================= обучение 4.0: сноски, новые задания, повторение ================= */
function tipOf(mode,cid){const t=TIPS[mode];return t?t[cid]||null:null;}
function tipHTML(q){
  if(!q||q.kind==='match'||!q.mode)return '';
  const t=tipOf(q.mode,q.cid);if(!t)return '';
  if(q.mode==='lore')return `<div class="tipbox"><p><b>В жизни:</b> <i>${esc(q.lang==='de'?t[1]:t[0])}</i> — ${esc(t[2])}</p></div>`;
  if(q.mode==='phrases')return `<div class="tipbox"><p><b>Когда говорить:</b> ${esc(t[0])}</p><p><b>Ещё можно сказать:</b> <i>${esc(q.lang==='de'?t[2]:t[1])}</i> — ${esc(t[3])}</p></div>`;
  const ex=q.lang==='de'?t[2]:t[1],ru=q.lang==='de'&&t[4]?t[4]:t[3];
  const mem=memOf(q.mode,q.cid,q.lang,t);
  return `<div class="tipbox">${mem?`<p><b>Как запомнить:</b> ${esc(mem)}</p>`:''}<p><b>В жизни:</b> <i>${esc(ex)}</i> — ${esc(ru)}</p></div>`;
}
const POS_RU={v:'глагол',a:'прилагательное',n:'существительное',d:'наречие'};
// словарная форма слова, которую можно вписать или найти в предложении
function baseForm(mode,c,L){
  if(mode==='terms')return L==='de'?c.noun:c.en.word;
  if(mode==='items')return c.parts?null:(L==='de'?c.noun:c.focus);
  if(mode==='heroes')return L==='de'?noArt(c.de):c.f;
  if(mode==='words')return L==='de'?noArt(c.de).replace(/^sich /,''):c.en.replace(/^to /,'');
  if(mode==='skills')return c.w?(L==='de'?noArt(c.w[2]):c.w[0]):null;
  if(mode==='lore')return c[L]?c[L].l.replace(/^to /,'').replace(/^sich /,'').replace(/^(der|die|das) /,''):null;
  return null;
}
// полный правильный ответ для ввода (с артиклем у немецких существительных)
function typedAnswer(mode,c,L){
  if(mode==='terms')return L==='de'?`${c.art} ${c.noun}`:c.en.word;
  if(mode==='items')return L==='de'?`${c.art} ${c.noun}`:c.focus;
  if(mode==='heroes')return L==='de'?c.de:c.f;
  if(mode==='words')return c[L];
  if(mode==='skills')return L==='de'?c.w[2]:c.w[0];
  if(mode==='lore')return c[L].l;
  return '';
}
function ruOf(mode,c){
  if(mode==='terms')return c.ru.toLowerCase();
  if(mode==='skills')return c.w?c.w[1]:c.ru;
  return c.ru;
}
function lifeOf(mode,cid,L){
  const t=tipOf(mode,cid);if(!t||mode==='phrases'||mode==='lore')return null;
  return {s:L==='de'?t[2]:t[1],ru:L==='de'&&t[4]?t[4]:t[3]};
}
function fillable(mode,c,L){
  const f=baseForm(mode,c,L),l=lifeOf(mode,cidOf(mode,c),L);
  if(!f||!l||mode==='skills')return null;
  const m=findForm(l.s,f,L,L==='de'&&/^[A-ZÄÖÜ]/.test(f)?'n':'x');
  return m&&m.f.toLowerCase()===f.toLowerCase()?{f,l,m}:null;
}
const normT=(s,L)=>{
  s=String(s||'').toLowerCase().trim().replace(/[.!?,;:«»"]/g,'').replace(/\s+/g,' ')
    .replace(/ß/g,'ss').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/[’`]/g,"'");
  if(L==='en')s=s.replace(/^to /,'');
  return s;
};
function typeOk(input,answer,L){
  const a=normT(answer,L),u=normT(input,L);
  if(!u)return false;
  if(u===a)return true;
  if(L==='de'){
    const am=a.match(/^(der|die|das) (.+)$/),um=u.match(/^(der|die|das) (.+)$/);
    if(am&&!um&&u===am[2])return true;          // без артикля засчитываем
    if(am&&um)return um[1]===am[1]&&um[2]===am[2];
    if(u.replace(/^sich /,'')===a.replace(/^sich /,''))return true;
  }
  return false;
}
const SITU_GROUP={welldone:'praise',played:'praise',game:'praise',wait:'wait',back:'wait',careful:'danger',watch:'danger',behind:'danger',giveup:'push',canwin:'push',attack:'go',ready:'go',together:'team',follow:'team',help:'help',understand:'ask',repeat:'ask',later:'bye'};
function pickSame(list,card,n,label,filt){
  return distinct(list.filter(x=>x!==card&&(!filt||filt(x))),card,n,label);
}
function modeList(mode,c){
  if(mode==='terms')return TERMS;
  if(mode==='items')return ITEMS;
  if(mode==='heroes')return HEROES;
  if(mode==='words')return WORDS.filter(x=>x.pos===c.pos&&(x.g||'')===(c.g||''));
  if(mode==='skills')return SKILLS.filter(x=>x.w);
  if(mode==='lore')return LORE_VOCAB.filter(x=>x.pos===c.pos);
  if(mode==='phrases')return PHRASES;
  return [];
}
function newQ(mode,c,L,kind){
  const cid=cidOf(mode,c),list=modeList(mode,c);
  const icon=mode==='terms'?{svg:c.icon}:mode==='items'?itemIcon(c):mode==='skills'?skillIcon(c):mode==='heroes'?heroIcon(c):mode==='words'?c.icon:mode==='lore'?{svg:'scroll'}:{svg:'ally'};
  const aw=mode==='phrases'?c[L]:typedAnswer(mode,c,L),at=mode==='phrases'?c.ru:ruOf(mode,c);
  const base={mode,cid,lang:L,kind,chip:chip(L,mode),icon,aw,at,notes:[]};
  if(kind==='type'){
    const ans=typedAnswer(mode,c,L),bf=baseForm(mode,c,L)||ans;
    return Q({...base,title:esc(cap(at)),ask:`Напиши ${LNAME[L]}`,typeAns:ans,time:35,hint:`Начинается на «${esc(bf[0])}», букв: ${bf.length}${L==='de'&&hasArt(ans)?'. Артикль можно не писать':''}`,notes:mode==='words'&&c.hint?[esc(c.hint)]:[]});
  }
  if(kind==='listen'){
    const o=pickSame(list,c,3,x=>ruOf(mode,x));
    const say=mode==='phrases'?c[L]:mode==='skills'?(L==='de'?c.w[2]:c.w[0]):typedAnswer(mode,c,L);
    return Q({...base,icon:{svg:'lightning'},title:'Послушай',ask:'Что ты услышал?',listen:true,say,time:25,cols:mode==='phrases'?1:2,
      opts:shuffle([c,...o]).map(x=>({v:cidOf(mode,x),label:esc(mode==='phrases'?x.ru:ruOf(mode,x))})),correct:cid});
  }
  if(kind==='fill'){
    const fb=fillable(mode,c,L);
    const s=fb.l.s,h=fb.m,capA=/^[A-ZÄÖÜ]/.test(h.f);
    // варианты в том же регистре, что и ответ в предложении, иначе ответ видно по большой букве
    const o=pickSame(list,c,3,x=>baseForm(mode,x,L).toLowerCase(),x=>{const b=baseForm(mode,x,L);return !!b&&(L!=='de'||/^[A-ZÄÖÜ]/.test(b)===capA);});
    const disp=x=>{if(x===c)return h.f;const b=baseForm(mode,x,L);if(L==='de')return b;return capA?cap(b):b[0].toLowerCase()+b.slice(1);};
    return Q({...base,title:'Вставь слово',titleSmall:true,quote:`${esc(s.slice(0,h.i))}<span class="gapw" id="gap"></span>${esc(s.slice(h.i+h.f.length))}`,
      sub:esc(fb.l.ru),ask:'Какое слово пропущено?',opts:shuffle([c,...o]).map(x=>({v:cidOf(mode,x),label:esc(disp(x))})),correct:cid,fill:h.f,time:25});
  }
  if(kind==='icon'){
    const o=pickSame(ITEMS,c,3,x=>L==='de'?`${x.art} ${x.noun}`:x.focus);
    return Q({...base,title:'Что это за предмет?',ask:L==='de'?'Как по-немецки главное слово его названия?':'Какое слово есть в его названии?',
      opts:shuffle([c,...o]).map(x=>({v:x.id,label:esc(L==='de'?`${x.art} ${x.noun}`:x.focus)})),correct:c.id,notes:[`Это ${esc(c.name)}.`]});
  }
  if(kind==='hero'){
    const o=pickSame(HEROES,c,3,x=>x.h,x=>x.h!==c.h);
    return Q({...base,icon:{svg:'helmet'},reveal:heroIcon(c),title:esc(cap(c.ru)),ask:'В имени какого героя есть это слово?',
      opts:shuffle([c,...o]).map(x=>({v:x.id,label:esc(x.h)})),correct:c.id,cols:1,notes:[`${esc(c.h)}: ${esc(c.f)} = ${esc(c.ru)}.`]});
  }
  if(kind==='situ'){
    const t=tipOf('phrases',c.id);const g=SITU_GROUP[c.id];
    const o=pickSame(PHRASES,c,3,x=>x[L],x=>!g||SITU_GROUP[x.id]!==g);
    return Q({...base,title:esc(t[0]),titleSmall:true,ask:`Что скажешь ${LNAME[L]}?`,cols:1,time:22,
      opts:shuffle([c,...o]).map(x=>({v:x.id,label:esc(x[L])})),correct:c.id});
  }
  if(kind==='order'){
    const words=c[L].split(' ');
    const extraPool=shuffle(PHRASES.filter(x=>x!==c).flatMap(x=>x[L].split(' '))).filter(w=>!words.includes(w));
    const extra=extraPool.slice(0,words.length>4?2:1);
    const all=[...words.map(t=>({t,g:false})),...extra.map(t=>({t,g:false}))].map((t,i)=>({...t,id:i}));
    return Q({...base,kind:'order',title:esc(c.ru),ask:`Собери фразу ${LNAME[L]}`,pool:shuffle(all),target:c[L],correct:c[L],time:40});
  }
  return null;
}
function extraKinds(mode,L,c){
  const k=[];
  const m=mget(mkey(mode,cidOf(mode,c),L));
  if(!SEEDED&&m>=1&&baseForm(mode,c,L)&&mode!=='phrases')k.push('type');
  if(!SEEDED&&store.tts&&canSpeak()&&['terms','words','heroes','phrases','skills'].includes(mode)&&(mode!=='skills'||c.w))k.push('listen');
  if(fillable(mode,c,L))k.push('fill');
  if(mode==='items'&&!c.parts&&ITEM_IMG[c.name])k.push('icon');
  if(mode==='heroes')k.push('hero');
  if(mode==='phrases'){k.push('situ');if(c[L].split(' ').length>=3)k.push('order');}
  return k;
}
const NEW_KINDS=['type','listen','fill','icon','hero','situ','order'];
function buildAny(mode,c,L,kind){
  if(NEW_KINDS.includes(kind))return newQ(mode,c,L,kind);
  if(mode==='lore')return loreQ(c,L,kind);
  return BUILD[mode](c,L,kind);
}

/* ---- повторение выученного (интервалы 3, 7, 21, 60 дней) ---- */
const RKEY='dota_r_v1',R_DAYS=[3,7,21,60];
let RV={};try{RV=JSON.parse(localStorage.getItem(RKEY))||{};}catch(e){RV={};}
function saveRV(){const s=JSON.stringify(RV);try{localStorage.setItem(RKEY,s);}catch(e){}if(CLOUD_OK)cloudSaveChunked(RKEY,s);}
function cloudSaveChunked(key,s){
  if(!TG||!TG.CloudStorage)return;
  try{const parts=[];for(let i=0;i<s.length;i+=3800)parts.push(s.slice(i,i+3800));
    parts.forEach((p,i)=>TG.CloudStorage.setItem(key+'_'+i,p,()=>{}));TG.CloudStorage.setItem(key+'_n',String(parts.length),()=>{});}catch(e){}
}
function dueList(){
  const now=Date.now();
  return Object.keys(RV).filter(k=>RV[k][1]<=now&&isLearned(k)&&store.langs.includes(k.split('|')[2])&&describe(k));
}
function cardOf(mode,cid){
  if(mode==='terms')return TERMS.find(x=>x.id===cid);
  if(mode==='items')return ITEMS.find(x=>x.id===cid)||BUILDS.find(x=>x.name===cid);
  if(mode==='skills')return SKILLS.find(x=>x.key===cid);
  if(mode==='heroes')return HEROES.find(x=>x.id===cid);
  if(mode==='words')return WORDS.find(x=>x.id===cid);
  if(mode==='phrases')return PHRASES.find(x=>x.id===cid);
  if(mode==='lore')return LORE_VOCAB.find(x=>x.id===cid);
  return null;
}
function reviewQ(key){
  const [mode,cid,L]=key.split('|'),c=cardOf(mode,cid);if(!c)return null;
  if(mode==='lore'&&(!LORE||!loreIndex(L)[c.id]))return null;
  const kinds=[...kindsOf(mode,L,c),...extraKinds(mode,L,c)].filter(k=>k!=='match');
  const pref=kinds.filter(k=>['type','x2ru','ru2x','w_x2ru','w_ru2x','h_mean','h_de2ru','sk_mean','sk_de2ru','lw','listen'].includes(k));
  try{const q=buildAny(mode,c,L,rnd(pref.length?pref:kinds));if(q){q.review=true;q.chip=`${langBadge(L)} Повторение`;}return q;}catch(e){return null;}
}
function onLearned(k){if(!RV[k]){RV[k]=[0,Date.now()+R_DAYS[0]*864e5];saveRV();}}
function onReview(k,ok){
  if(!ok){delete RV[k];saveRV();return {back:true};}
  const st=((RV[k]&&RV[k][0])||0)+1;
  if(st>=R_DAYS.length){delete RV[k];saveRV();return {done:true};}
  RV[k]=[st,Date.now()+R_DAYS[st]*864e5];saveRV();return {days:R_DAYS[st]};
}

/* ---- цель дня и статистика ---- */
const todayKey=()=>new Date().toISOString().slice(0,10);
function dayStat(){if(!store.day||store.day.d!==todayKey())store.day={d:todayKey(),n:0,done:false};return store.day;}
// ответы по дням за последние две недели — для блока «Неделя» в профиле
function weekAdd(){const k=todayKey();store.week=store.week||{};store.week[k]=(store.week[k]||0)+1;const ks=Object.keys(store.week).sort();while(ks.length>14)delete store.week[ks.shift()];}
function weekHTML(){const W=store.week||{},days=[...Array(7)].map((_,i)=>{const d=new Date(Date.now()-(6-i)*864e5);const k=d.toISOString().slice(0,10);return {d,n:W[k]||0};});
  const mx=Math.max(1,...days.map(x=>x.n)),sum=days.reduce((a,x)=>a+x.n,0),mine=typeof scMine==='function'?scMine():[],ok=mine.filter(x=>x.st>=3).length;
  const wd=['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
  return `<section class="wk card anim"><div class="wk-h"><b>Неделя</b><span>${sum} ${plural(sum,['ответ','ответа','ответов'])}</span></div>
    <div class="wk-bars">${days.map((x,i)=>`<div class="wk-c${i===6?' today':''}"><i style="height:${Math.round(x.n/mx*100)}%"></i><span>${wd[x.d.getDay()]}</span></div>`).join('')}</div>
    <div class="wk-f"><div><b>${mine.length}</b><span>фраз из кино</span></div><div><b>${ok}</b><span>держатся надолго</span></div><div><b>${store.streak||0}</b><span>${plural(store.streak||0,['день','дня','дней'])} подряд</span></div></div></section>`;}
function countAnswer(){
  weekAdd();const d=dayStat();d.n++;
  const goal=store.goal||20;
  if(!d.done&&d.n>=goal){d.done=true;store.goalsDone=(store.goalsDone||0)+1;store.gold+=200;setTimeout(()=>{announce('Цель дня','learn');sfx('learn');toast('Цель дня выполнена: +200 билетов');},900);}
}

/* ================= сессия ================= */
let S=null;
function langSeq(n){const ls=store.langs;if(ls.length===1)return Array(n).fill(ls[0]);const st=Math.random()<.5?0:1;return Array.from({length:n},(_,i)=>ls[(i+st)%2]);}
function startSession(type,mode){
  if(type==='mode'&&mode==='lore'&&LORE_STATE!=='ok'){loadLore();toast(LORE_STATE==='fail'?'Лор не загрузился, проверь интернет':'Лор ещё грузится, попробуй через пару секунд');return;}
  const N=10,used=new Set();let qs=[];
  if(type==='mistakes')qs=shuffle(store.mistakes).map(regen).filter(Boolean).slice(0,N);
  else if(type==='review')qs=shuffle(dueList()).slice(0,N).map(reviewQ).filter(Boolean);
  else{
    const modes=type==='quick'?shuffle(['terms','terms','items','items','skills','heroes','heroes','words','words','phrases']):Array(N).fill(mode);
    const Ls=langSeq(N),count=(type==='mode'&&mode==='terms')?N-1:N;
    for(let i=0;i<count;i++){const q=randQ(modes[i],Ls[i],used);if(q)qs.push(q);}
    if(type==='mode'&&mode==='terms')qs.push(matchQ(Ls[N-1],used));
  }
  if(!qs.length){toast('Нет вопросов под эти настройки');return;}
  qs[qs.length-1].roshan=true;
  S={type,mode,qs,i:0,correct:0,streak:0,bestStreak:0,gold:0,first:false,answered:false,wrong:[],learned:[],tInt:null,reask:0};
  screen='quiz';sfx('whoosh');
  renderQ();
}
function exitQuiz(){stopTimer();clearTimeout(S&&S.autoT);sfx('tap');if(!store.onboarded){startOnboarding();return;}backToWorld();}

function renderQ(){
  {const q0=S.qs[S.i];if(q0&&store.intro!==false&&S.type!=='duel'&&!q0.introDone&&!q0.noM&&q0.mode!=='lore'&&q0.mode!=='phrases'&&M[mkey(q0.mode,q0.cid,q0.lang)]===undefined&&!(store.recent||[]).includes(mkey(q0.mode,q0.cid,q0.lang))&&!(S.seenIntro=S.seenIntro||new Set()).has(mkey(q0.mode,q0.cid,q0.lang))){q0.introDone=true;S.seenIntro.add(mkey(q0.mode,q0.cid,q0.lang));if(introCard(q0)){renderIntro(q0);return;}}}
  const q=S.qs[S.i];
  S.answered=false;S.low=false;S.lastTick=0;S.t0=performance.now();
  backBtn(true);
  const segs=S.qs.map((qq,i)=>`<i class="seg${i<S.i?(qq.res?' ok':' bad'):i===S.i?' cur':''}${qq.roshan?' boss':''}"></i>`).join('');
  let body='';
  if(q.kind==='type')body=`<div class="typebox"><input id="typein" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="done" placeholder="Напиши ответ" aria-label="Ответ"><button class="btn" id="typeok">Проверить</button></div>`;
  else if(q.kind==='build'||q.kind==='order')body=`<div class="line" id="line"></div><p class="preview" id="preview"></p><div class="pool" id="pool"></div><button class="btn" id="check" disabled>Проверить</button>`;
  else if(q.kind==='match'){
    const Lc=shuffle(q.pairs),Rc=shuffle(q.pairs);
    body=`<div class="match"><div class="mcol">${Lc.map(t=>`<button class="mbtn" data-side="L" data-id="${t.id}">${iconHTML({svg:t.icon})}${esc(t.ru)}</button>`).join('')}</div>
      <div class="mcol">${Rc.map(t=>`<button class="mbtn" data-side="R" data-id="${t.id}">${esc(tWord(t,q.lang))}</button>`).join('')}</div></div>`;
  }else body=`<div class="tiles${q.cols===1?' one':q.cols===3?' three':''}">${q.opts.map(o=>`<button class="tile" data-v="${esc(o.v)}">${o.label}</button>`).join('')}</div>`;
  const pts=q.kind!=='match'&&!q.noM?mget(mkey(q.mode,q.cid,q.lang)):0;
  mount(`
    <div class="qhud">
      <button class="icon-btn" id="xBtn" aria-label="Выйти">${ui('close')}</button>
      <div class="segs">${segs}</div>
      <span class="gold" id="goldHud">${ui('coin')}<b id="goldNum">${fmt(S.gold)}</b></span>
    </div>
    <div class="mana" id="mana"><i id="tbar"></i><b id="tnum">${q.time}</b></div>
    <div class="qwrap">
      <article class="tip">
        <header class="tip-h">
          <div class="slot-wrap" id="slotWrap">${iconHTML(q.icon,'big')}</div>
          <div class="tt">
            <div class="kind">${q.reask?'':''}${q.chip}${pts&&pts<LEARN_AT?pipsHTML(pts):''}${S.streak>=2?`<span class="streak">серия ${S.streak}</span>`:''}${q.roshan?'<span class="boss">Бонус: билеты x2</span>':''}</div>
            <h1 class="qtitle${q.titleSmall?' small':''}">${q.title}</h1>
            ${q.sub&&!/ru2|type/.test(q.kind||'')?`<p class="qsub">${q.sub}</p>`:''}
          </div>
        </header>
        <div class="tip-b">${q.quote?`<div class="quote">${q.quote}</div>`:''}${q.listen?`<button class="playbtn" id="play">${ui('speaker')}<span>Послушать ещё раз</span></button>`:''}<p class="ask">${q.ask}</p></div>
      </article>
      ${body}
      ${q.hint?`<button class="hint-btn" id="hintBtn">${ui('bulb')}Подсказка</button><div id="hintBox"></div>`:''}
    </div>
    <div id="sheetWrap"></div>`,'quiz'+(q.roshan?' roshan':''));
  $('#xBtn').onclick=exitQuiz;
  if(q.hint)$('#hintBtn').onclick=()=>{sfx('hint');haptic('sel');$('#hintBox').innerHTML=`<div class="hint">${q.hint}</div>`;$('#hintBtn').remove();};
  $$('.tile').forEach(b=>b.onclick=()=>pick(b));
  if(q.kind==='build'||q.kind==='order')setupBuild(q);
  if(q.kind==='type')setupType(q);
  if(q.listen){const p=()=>speak(q.say,q.lang);$('#play').onclick=()=>{haptic('sel');p();};setTimeout(p,280);}
  if(q.kind==='match')setupMatch(q);
  if(q.roshan&&S.i>0)sfx('roshan');
  startTimer(q.time);
}

function setupType(q){
  const inp=$('#typein'),btn=$('#typeok');
  const go=()=>{
    if(S.answered)return;
    const v=inp.value.trim();if(!v){restart(inp,'shake');return;}
    const ok=typeOk(v,q.typeAns,q.lang);
    inp.disabled=true;btn.disabled=true;
    inp.classList.add(ok?'right':'wrong');
    if(!ok)inp.value=v+'  →  '+q.typeAns;
    finish(ok,inp);
  };
  btn.onclick=go;
  inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();go();}};
  setTimeout(()=>{try{inp.focus();}catch(e){}},350);
}
const pipsHTML=n=>`<span class="pips">${[0,1,2].map(i=>`<i class="${i<n?'on':''}"></i>`).join('')}</span>`;

function startTimer(sec){
  stopTimer();
  const bar=$('#tbar');if(!bar)return;
  S.tEnd=performance.now()+sec*1000;
  bar.style.transition='none';bar.style.transform='scaleX(1)';void bar.offsetWidth;
  bar.style.transition=`transform ${sec}s linear`;bar.style.transform='scaleX(0)';
  S.tInt=setInterval(()=>{
    if(!S||S.answered){stopTimer();return;}
    const left=S.tEnd-performance.now(),s=Math.max(0,Math.ceil(left/1000));
    const num=$('#tnum');if(num&&num.textContent!==String(s))num.textContent=s;
    if(left<=5000&&!S.low){S.low=true;const t=$('#mana');if(t)t.classList.add('low');}
    if(left<=5000&&left>0&&s!==S.lastTick){S.lastTick=s;sfx('tick');}
    if(left<=0){stopTimer();timeout();}
  },150);
}
function stopTimer(){
  if(S&&S.tInt){clearInterval(S.tInt);S.tInt=null;}
  const bar=$('#tbar');
  if(bar){const cs=getComputedStyle(bar).transform;bar.style.transition='none';bar.style.transform=(!cs||cs==='none')?'scaleX(1)':cs;}
}
function timeout(){
  if(S.answered)return;
  const q=S.qs[S.i];
  $$('.tile').forEach(t=>{t.disabled=true;if(t.dataset.v===String(q.correct))t.classList.add('right');else t.classList.add('dim');});
  $$('.tok,.mbtn,#typein,#typeok').forEach(t=>t.disabled=true);
  if(q.fill&&$('#gap')){$('#gap').textContent=q.fill;$('#gap').classList.add('filled');}
  finish(false,null,'Время вышло');
}
function pick(btn){
  if(S.answered)return;
  const q=S.qs[S.i],ok=btn.dataset.v===String(q.correct);
  haptic('light');
  $$('.tile').forEach(t=>{t.disabled=true;if(t.dataset.v===String(q.correct))t.classList.add('right');else if(t!==btn)t.classList.add('dim');});
  if(!ok)btn.classList.add('wrong');
  if(q.fill&&$('#gap')){$('#gap').textContent=q.fill;$('#gap').classList.add('filled');}
  finish(ok,btn);
}
function setupBuild(q){
  S.chosen=[];
  const byId=id=>q.pool.find(t=>t.id===id),label=t=>t.g?'-'+t.t:t.t;
  const draw=()=>{
    $('#line').innerHTML=S.chosen.map(id=>`<button class="tok" data-id="${id}">${esc(label(byId(id)))}</button>`).join('');
    $('#pool').innerHTML=q.pool.map(t=>`<button class="tok${S.chosen.includes(t.id)?' used':''}" data-id="${t.id}">${esc(label(t))}</button>`).join('');
    $('#preview').textContent=joinTok(S.chosen.map(byId));
    $('#check').disabled=!S.chosen.length;
    $$('#pool .tok').forEach(b=>b.onclick=()=>{if(S.answered)return;const id=+b.dataset.id;if(!S.chosen.includes(id)){S.chosen.push(id);sfx('tap');haptic('sel');draw();}});
    $$('#line .tok').forEach(b=>b.onclick=()=>{if(S.answered)return;S.chosen=S.chosen.filter(x=>x!==+b.dataset.id);sfx('tap');draw();});
  };
  draw();
  $('#check').onclick=()=>{
    if(S.answered)return;
    const ok=joinTok(S.chosen.map(byId))===q.target,line=$('#line');
    line.classList.add(ok?'ok':'bad');$('#check').disabled=true;$$('.tok').forEach(t=>t.disabled=true);
    finish(ok,line);
  };
}
function setupMatch(q){
  S.mSel={L:null,R:null};S.mDone=0;S.mErr=0;
  $$('.mbtn').forEach(b=>b.onclick=()=>{
    if(S.answered||b.classList.contains('done'))return;
    const side=b.dataset.side;
    $$(`.mbtn[data-side="${side}"]`).forEach(x=>x.classList.remove('sel'));
    b.classList.add('sel');S.mSel[side]=b;sfx('tap');haptic('sel');
    if(S.mSel.L&&S.mSel.R){
      const a=S.mSel.L,bb=S.mSel.R;
      if(a.dataset.id===bb.dataset.id){
        [a,bb].forEach(x=>{x.classList.remove('sel');x.classList.add('done');x.disabled=true;});
        S.mDone++;sfx('match');burstAt(bb,8);
        if(S.mDone===q.pairs.length)finish(S.mErr<=1,null,S.mErr>1?'Слишком много ошибок':null);
      }else{S.mErr++;sfx('nope');haptic('warn');[a,bb].forEach(x=>{x.classList.remove('sel');restart(x,'shake');});}
      S.mSel={L:null,R:null};
    }
  });
}

const PRAISE=['Верно','Отлично','Точно','Так держать','Правильно'];
function recordMistake(q,ok){
  if(q.kind==='match')return;
  const sp=specOf(q);
  store.mistakes=store.mistakes.filter(x=>x!==sp);
  if(!ok){store.mistakes.unshift(sp);if(store.mistakes.length>50)store.mistakes.length=50;}
}
function finish(ok,el,reason){
  if(S.answered)return;
  S.answered=true;stopTimer();
  const q=S.qs[S.i],last=S.i===S.qs.length-1;
  q.res=ok;store.answered++;if(ok){S.correct++;store.correct++;}
  recordMistake(q,ok);
  let mres=null;const rankBefore=rankInfo().i;
  if(S.type==='duel')S.tSum+=Math.min(q.time,(performance.now()-S.t0)/1000);
  if(q.kind==='match'){if(ok)q.pairs.forEach(t=>{const r=bump(mkey('terms',t.id,q.lang),true);if(r.learnedNow)S.learned.push({w:tWord(t,q.lang),t:t.ru.toLowerCase()});});}
  else if(!q.noM){mres=bump(mkey(q.mode,q.cid,q.lang),ok);if(mres.learnedNow){S.learned.push({w:q.aw,t:q.at});onLearned(mkey(q.mode,q.cid,q.lang));}}
  let rres=null;if(q.review&&!q.noM)rres=onReview(mkey(q.mode,q.cid,q.lang),ok);
  if(S.type!=='duel'){countAnswer();if(!q.noM)noteRecent(mkey(q.mode,q.cid,q.lang));}
  if(!ok&&!['duel','review'].includes(S.type)&&q.kind!=='match'&&!q.noM&&!q.reask&&S.reask<3&&S.i<S.qs.length-1){
    const q2=regen([q.mode,q.cid,q.lang,'x'].join('|'));
    if(q2){q2.reask=true;q2.chip=`${langBadge(q.lang)} Повтор ошибки`;S.qs.splice(S.qs.length-1,0,q2);S.reask++;}
  }
  if(q.reveal){const sw=$('#slotWrap');if(sw)sw.innerHTML=iconHTML(q.reveal,'big');}
  saveM();
  const seg=$$('.seg')[S.i];if(seg){seg.classList.remove('cur');seg.classList.add(ok?'ok':'bad');}
  if(ok){
    S.streak++;S.bestStreak=Math.max(S.bestStreak,S.streak);
    const fast=!['match','build','order','type'].includes(q.kind)&&performance.now()-S.t0<5000;
    let gain=50+Math.min(50,(S.streak-1)*10)+(fast?20:0);if(q.roshan)gain*=2;
    gain=Math.round(gain*rankInfo().r.m);
    const from=S.gold;S.gold+=gain;store.gold+=gain;
    setTimeout(()=>{countUp($('#goldNum'),from,S.gold);},520);
    const slot=$('#slotWrap .slot');restart(slot,'pop');burstAt(slot,q.roshan?24:12);flyCoins(el||slot,$('#goldHud'),q.roshan?8:5);
    const fx=document.createElement('span');fx.className='fx';fx.innerHTML=`+${gain}${fast?'<small>быстро</small>':''}`;$('#slotWrap').appendChild(fx);
    sfx('good');haptic('ok');
    const rk=rankInfo();
    if(rk.i>rankBefore){announce('Ранг: '+rk.r.n,'learn');sfx('learn');burstAt(slot,36,['#FFF1C9','#F6DDA0','#E3C27A']);}
    else if(mres&&mres.learnedNow){announce('Слово выучено','learn');sfx('learn');burstAt(slot,24,['#FFF1C9','#F6DDA0','#E3C27A']);}
    else if(q.roshan){announce('Рошан повержен');sfx('roshan');}
    else if(!S.first){S.first=true;announce('First Blood','red');sfx('firstblood');}
    else if(S.streak>=2){announce(KILLS(S.streak));sfx('announce',S.streak);}
  }else{
    const lost=S.streak;S.streak=0;
    sfx('bad');death();haptic('err');
    if(el)restart(el,'shake');
    if(lost>=3)announce('Серия прервана','red');
    if(q.aw)S.wrong.push({w:q.aw,t:q.at});
  }
  save();
  const notes=(q.notes||[]).filter(Boolean);
  let mline='';
  if(rres){
    mline=rres.back?`<div class="mastery">${pipsHTML(mres?mres.after:2)}Слово вернулось в изучение, повторим его в играх</div>`:rres.done?`<div class="mastery learned">${pipsHTML(3)}Слово закреплено навсегда</div>`:`<div class="mastery learned">${pipsHTML(3)}Повторение пройдено. Следующее через ${rres.days} ${plural(rres.days,['день','дня','дней'])}</div>`;
  }else if(mres){
    if(mres.learnedNow)mline=`<div class="mastery learned">${pipsHTML(3)}Слово выучено и ушло в словарь${store.hideLearned?', больше не попадётся':''}</div>`;
    else if(ok)mline=`<div class="mastery">${pipsHTML(mres.after)}Ещё ${LEARN_AT-mres.after} ${plural(LEARN_AT-mres.after,['правильный ответ','правильных ответа','правильных ответов'])}, и слово выучено</div>`;
    else mline=`<div class="mastery">${pipsHTML(mres.after)}Прогресс слова: ${mres.after} из ${LEARN_AT}</div>`;
  }
  const ans=q.kind==='match'?`<div class="ans"><span>${q.pairs.map(t=>`${esc(tWord(t,q.lang))}: ${esc(t.ru.toLowerCase())}`).join('<br>')}</span></div>`:`<div class="ans"><div><b>${esc(q.aw)}</b><span>${esc(q.at)}</span></div>${canSpeak()?`<button class="say" id="say" aria-label="Послушать">${ui('speaker')}</button>`:''}</div>`;
  $('#sheetWrap').innerHTML=`
    <div class="sheet ${ok?'ok':'bad'}" role="status">
      <p class="sh-title">${ok?rnd(PRAISE):(reason||'Неверно. Правильный ответ:')}</p>
      ${ans}
      ${notes.map(t=>`<p class="sh-note">${t}</p>`).join('')}
      ${tipHTML(q)}
      ${mline}
      <button class="btn" id="next">${last?'Итоги':'Дальше'}</button>
      ${ok&&store.auto?'<i class="autobar" id="autobar"></i>':''}
    </div>`;
  const go=()=>{clearTimeout(S.autoT);if(S.gone===S.i)return;S.gone=S.i;sfx('whoosh');S.i++;if(S.i>=S.qs.length)renderEnd();else renderQ();};
  $('#next').onclick=go;
  if($('#say'))$('#say').onclick=()=>{clearTimeout(S.autoT);const ab=$('#autobar');if(ab)ab.remove();speak(q.say||q.aw,q.lang);};
  if(ok&&store.auto){
    const ms=4200,bar=$('#autobar');
    if(bar&&Element.prototype.animate)bar.animate([{transform:'scaleX(1)'},{transform:'scaleX(0)'}],{duration:ms,easing:'linear',fill:'forwards'});
    S.autoT=setTimeout(go,ms);
  }
}

/* ================= озвучка ================= */
const canSpeak=()=>{try{return 'speechSynthesis' in window&&typeof SpeechSynthesisUtterance!=='undefined';}catch(e){return false;}};
function speak(text,L){
  if(!store.tts)return;
  try{
    const s=window.speechSynthesis;s.cancel();
    const u=new SpeechSynthesisUtterance(text);u.lang=L==='de'?'de-DE':'en-US';u.rate=.92;
    const v=(s.getVoices()||[]).find(x=>x.lang&&x.lang.toLowerCase().replace('_','-').startsWith(L));if(v)u.voice=v;
    s.speak(u);haptic('sel');
  }catch(e){}
}

/* ================= итоги ================= */
function renderEnd(){
  if(S.type==='duel'&&DUEL){
    store.duels[DUEL.seed]={s:S.correct,t:Math.round(S.tSum),L:DUEL.L,ts:Date.now()};
    const ks=Object.keys(store.duels);if(ks.length>30)ks.slice(0,ks.length-30).forEach(k=>delete store.duels[k]);
    save();renderDuelResult(DUEL,true);return;
  }
  screen='end';backBtn(true);
  const n=S.qs.length,k=S.correct,pct=Math.round(k/n*100),win=pct>=70;
  store.games=(store.games||0)+1;store.bestStreak=Math.max(store.bestStreak||0,S.bestStreak);if(k===n&&n>=10)store.perfect=(store.perfect||0)+1;
  setTimeout(checkAch,1600);
  const bk=S.type==='mode'?S.mode:S.type;
  if(pct>(store.best[bk]||0))store.best[bk]=pct;
  const today=new Date().toDateString(),y=new Date(Date.now()-864e5).toDateString();
  if(store.lastDay!==today){store.streak=store.lastDay===y?store.streak+1:1;store.lastDay=today;}
  save();
  const h=heroFor();
  const msg=win?(k===n?'Ни одной ошибки.':'Ошибки лежат в рюкзаке, в «Ошибках».'):'Ошибки лежат в рюкзаке, в «Ошибках». Разбери их и попробуй снова.';
  const list=arr=>arr.slice(0,8).map(x=>`<li><b>${esc(x.w)}</b><span>${esc(x.t)}</span></li>`).join('');
  mount(`
    <div class="end">
      <div class="result ${win?'win':'lose'}">
        <div class="pic" style="background-image:url('${portrait(h.hero)}')"></div>
        <span class="side">Конец игры</span>
        <h1>${win?'Победа Сил Света':'Победа Сил Тьмы'}</h1>
        <p>${msg}</p>
      </div>
      <div class="score frame">
        <div class="row"><span>Игрок</span><span>Верно</span><span>Билеты</span><span>Серия</span><span>Выучено</span></div>
        <div class="row"><span>${esc(userName()||'Ты')}</span><b id="eK">0</b><b class="g" id="eG">0</b><b>${S.bestStreak}</b><b>${S.learned.length}</b></div>
      </div>
      ${rankLineHTML()}
      ${S.learned.length?`<div class="words frame good"><h3>Выучено в этой игре</h3><ul>${list(S.learned)}</ul></div>`:''}
      ${S.wrong.length?`<div class="words frame"><h3>Повтори эти слова</h3><ul>${list(S.wrong)}</ul></div>`:''}
      <div class="end-actions">
        <button class="btn" id="again">Играть ещё раз</button>
        <button class="btn dark" id="homeBtn">В меню</button>
      </div>
    </div>`,'endscr');
  sfx(win?'win':'lose');haptic(win?'ok':'warn');
  countUp($('#eK'),0,k);countUp($('#eG'),0,S.gold,900);
  if(win)setTimeout(()=>{burstAt($('.result h1'),36);if(k===n)announce('Godlike');},250);
  $('#again').onclick=()=>(S.lesson?startLesson():startSession(S.type,S.mode));
  $('#homeBtn').onclick=()=>{sfx('tap');backToWorld();};
  if($('#rkInfo'))$('#rkInfo').onclick=showRanks;
}
function rankLineHTML(){
  const rk=rankInfo();
  return `<p class="note center">Твой ранг: <b>${rk.r.n}</b>. ${rk.nx?`До ранга ${rk.nx.n} осталось выучить ${rk.nx.at-rk.n} ${plural(rk.nx.at-rk.n,['слово','слова','слов'])}.`:'Это высший ранг.'} <button class="linkbtn" id="rkInfo">Как работают ранги?</button></p>`;
}
function showRanks(){
  const t=totals(),rk=rankInfo(t.learned);
  const d=document.createElement('div');d.className='modal';
  d.innerHTML=`<div class="card frame" role="dialog">
    <h3 style="font-size:18px;color:var(--ink)">Ранги</h3>
    <p class="note" style="text-align:left">Ранг растёт за <b>выученные слова</b>. Слово становится выученным, когда ты ответил на него правильно 3 раза (ошибка отнимает одно очко). Чем выше ранг, тем больше билетов за каждый правильный ответ.</p>
    <div class="rlist">${RANKS.map((r,i)=>`<div class="rrow${i===rk.i?' cur':''}${t.learned>=r.at?' got':''}"><span class="rn">${r.n}</span><span>от ${r.at} ${plural(r.at,['слова','слов','слов'])}</span><span>билеты x${r.m}</span></div>`).join('')}</div>
    <p class="note" style="text-align:left">Сейчас: <b>${rk.r.n}</b>, выучено ${t.learned}. ${rk.nx?`До ранга ${rk.nx.n} ещё ${rk.nx.at-t.learned} ${plural(rk.nx.at-t.learned,['слово','слова','слов'])}.`:'Выше некуда.'}</p>
    <button class="btn" id="rClose" style="margin-top:10px">Понятно</button></div>`;
  document.body.appendChild(d);sfx('sel');
  d.onclick=e=>{if(e.target===d)d.remove();};
  d.querySelector('#rClose').onclick=()=>d.remove();
}

/* ================= слово дня ================= */
const INV_ICONS={terms:'items/branches',items:'items/bottle',skills:'items/magic_wand',heroes:'items/helm_of_the_overlord',words:'items/tome_of_knowledge',phrases:'items/clarity'};
function wordOfDay(){
  const pool=[...WORDS.map(w=>({en:w.en,de:w.de,ru:w.ru,hint:w.hint,ic:w.icon})),...HEROES.map(h=>({en:h.f.toLowerCase()===h.f?h.f:h.f,de:h.de,ru:h.ru,hint:`Как в имени ${h.h}.`,ic:heroIcon(h)}))];
  return pool[(Math.floor(Date.now()/864e5)*7919)%pool.length];
}
function showWod(){
  const w=wordOfDay();
  const d=document.createElement('div');d.className='modal';
  d.innerHTML=`<div class="card frame" role="dialog">${iconHTML(w.ic,'big')}<h3>Слово дня</h3>
    <div class="wodl"><span class="lb">EN</span><b>${esc(w.en)}</b><span class="lb de">DE</span><b>${esc(w.de)}</b><span class="lb" style="background:#6E6B63;color:#fff">RU</span><b>${esc(w.ru)}</b></div>
    ${w.hint?`<p class="note">${esc(w.hint)}</p>`:''}
    <div class="btns two" style="margin-top:14px">${canSpeak()?`<button class="btn dark small" id="wEn">Послушать EN</button><button class="btn dark small" id="wDe">Послушать DE</button>`:''}</div>
    <button class="btn" id="wClose" style="margin-top:8px">Закрыть</button></div>`;
  document.body.appendChild(d);sfx('sel');
  const close=()=>d.remove();
  d.onclick=e=>{if(e.target===d)close();};
  d.querySelector('#wClose').onclick=close;
  if(d.querySelector('#wEn')){d.querySelector('#wEn').onclick=()=>speak(w.en,'en');d.querySelector('#wDe').onclick=()=>speak(w.de,'de');}
}
/* ================= словарь ================= */
function renderDict(tab){
  screen='dict';backBtn(true);
  const rows=Object.keys(M).filter(k=>MODES.some(m=>k.startsWith(m.id+'|'))).map(k=>({k,v:M[k],d:describe(k),mode:k.split('|')[0],L:k.split('|')[2]})).filter(r=>r.d);
  const learned=rows.filter(r=>r.v>=LEARN_AT),going=rows.filter(r=>r.v>0&&r.v<LEARN_AT);
  const list=tab==='learned'?learned:going;
  const groups=MODES.map(m=>({m,items:list.filter(r=>r.mode===m.id).sort((a,b)=>a.d.w.localeCompare(b.d.w))})).filter(g=>g.items.length);
  const body=groups.length?groups.map(g=>`<div class="dgroup"><h3>${g.m.name}</h3><div class="frame">${g.items.map(r=>`
      <div class="drow">${iconHTML(r.d.ic,'sm')}<div class="dt"><b>${esc(r.d.w)}</b><span>${esc(r.d.t)}</span></div>${langBadge(r.L)}
      ${tab==='learned'?`<button class="undo" data-k="${esc(r.k)}">Вернуть</button>`:pipsHTML(r.v)}</div>`).join('')}</div></div>`).join('')
    :`<div class="empty frame" style="margin-top:16px">${tab==='learned'?`<b>Пока ничего не выучено</b>Ответь правильно на одно слово ${LEARN_AT} раза, и оно появится здесь.`:'<b>Здесь пусто</b>Начни игру: каждое слово, которое тебе попалось, появится здесь с прогрессом.'}</div>`;
  mount(`
    <div class="page-head"><button class="icon-btn" id="bBtn" aria-label="Назад">${ui('back')}</button><h1 class="title">Словарь</h1></div>
    <div class="tabs" role="tablist">
      <button role="tab" aria-selected="${tab==='going'}" data-tab="going">Изучаю (${going.length})</button>
      <button role="tab" aria-selected="${tab==='learned'}" data-tab="learned">Выучено (${learned.length})</button>
    </div>
    <p class="note">${tab==='learned'?(store.hideLearned?'Выученные слова больше не попадаются. «Вернуть» снова отправит слово в тренировку.':'Выученные слова всё равно попадаются: так настроено в настройках.'):`Правильный ответ даёт слову очко, ошибка отнимает. ${LEARN_AT} очка, и слово выучено.`}</p>
    ${body}`,'dict');
  $('#bBtn').onclick=()=>{sfx('tap');renderHome();};
  $$('[data-tab]').forEach(b=>b.onclick=()=>{sfx('sel');renderDict(b.dataset.tab);});
  $$('.undo').forEach(b=>b.onclick=()=>{delete M[b.dataset.k];saveM();sfx('tap');haptic('sel');renderDict('learned');});
}

/* ================= выбор языка и ролей ================= */
function langChoiceHTML(sel){
  const opts=[['en',['en'],'Английский','Фильмы, сериалы и игры в оригинале'],['de',['de'],'Немецкий','Живой немецкий с артиклями и примерами'],['both',['en','de'],'Оба сразу','Язык переключаешь прямо в плеере: «Учу English / Учу Deutsch»']];
  return `<div class="stack">${opts.map(([id,ls,n,d])=>`<button class="choice frame" data-lang="${id}" aria-pressed="${sel===id}"><span class="badges">${ls.map(langBadge).join('')}</span><span class="ct"><span class="cn">${n}</span><span class="cd">${d}</span></span>${BOX}</button>`).join('')}</div>`;
}
function rolesHTML(roles){
  return `<div class="roles">${ROLES.map(r=>`<button class="role frame" data-role="${r.id}" aria-pressed="${roles!=='all'&&roles.includes(r.id)}">
      <span class="pic" style="background-image:url('${portrait(r.hero)}')"><span class="ab2">${iconHTML({img:'abilities/'+r.ab,svg:'star'},'sm')}</span></span>${BOX}
      <span class="rt"><span class="rn">${r.name}</span><span class="rh">Например, ${r.heroName}</span><span class="rd">${r.desc}</span></span>
    </button>`).join('')}</div>
    <button class="choice frame" data-role="all" aria-pressed="${roles==='all'}" style="margin-top:8px"><span class="badges">${iconHTML({svg:'team'},'sm')}</span><span class="ct"><span class="cn">Играю на всех ролях</span><span class="cd">Вопросы про всех героев и предметы</span></span>${BOX}</button>`;
}
const langsToChoice=l=>l[0]||'en';
const choiceToLangs=c=>c==='both'?['en','de']:[c];
function bindLangChoice(set){
  $$('.choice[data-lang]').forEach(b=>b.onclick=()=>{set(b.dataset.lang);sfx('sel');haptic('sel');$$('.choice[data-lang]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));});
}
function bindRoles(get,set,onChange){
  const paint=()=>{const r=get();$$('[data-role]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.role==='all'?r==='all':(r!=='all'&&r.includes(x.dataset.role)))));onChange&&onChange();};
  $$('[data-role]').forEach(b=>b.onclick=()=>{
    const id=b.dataset.role;let r=get();
    if(id==='all')set(r==='all'?[]:'all');
    else{
      r=r==='all'?[]:r.slice();
      if(r.includes(id))r=r.filter(x=>x!==id);
      else if(r.length>=2){restart(b,'shake');haptic('warn');sfx('nope');const h=$('#roleHint');if(h){h.textContent='Можно выбрать максимум две роли';h.classList.add('warn');}return;}
      else r.push(id);
      set(r);
    }
    sfx('sel');haptic('sel');paint();
  });
}
const rolesOk=r=>r==='all'||(Array.isArray(r)&&r.length>=1&&r.length<=2);
const roleHintText=r=>r==='all'?'Будут вопросы про всех героев':!r.length?'Выбери одну или две роли':r.length===1?'Можно добавить ещё одну':'Выбраны две роли, это максимум';

/* ================= онбординг ================= */
let OB=null;
function startOnboarding(){stopSpyAll();OB={i:0,path:null,lang:PARAM_LANG||null,games:[],roles:[]};renderOB();}
function obSteps(){const st=['intro','path','lang'];if(OB.path&&OB.path!=='kino')st.push('games');if(OB.games.includes('dota'))st.push('roles');st.push('done');return st;}
function renderOB(){
  setWorld('neutral');screen='ob';const st=obSteps(),cur=st[OB.i];backBtn(OB.i>0&&cur!=='done');
  const dots=`<div class="steps">${st.slice(1).map((x,i)=>`<i class="${i<OB.i?'on':''}"></i>`).join('')}</div>`;
  const opt=(k,v,t,d,on)=>`<button class="choice frame" data-${k}="${v}" aria-pressed="${!!on}"><span class="ct"><span class="cn">${t}</span><span class="cd">${d}</span></span>${BOX}</button>`;
  let html='';
  if(cur==='intro')html=`<div class="obhero"><span class="orb o1"></span><span class="orb o2"></span><span class="orb o3"></span></div>
      <h1 class="title obt">Учи язык на том, что любишь</h1>
      <p class="lead" style="margin-top:10px">Английский или немецкий — через игры, фильмы и сериалы. Настоящие фразы из того, что ты и так смотришь и во что играешь.</p>
      <div class="stack">
        <div class="feat frame">${iconHTML({svg:'eye'})}<span><b>Фильмы, сериалы и клипы</b><span>сцены с субтитрами и разбором живых фраз</span></span></div>
        <div class="feat frame">${iconHTML({svg:'target'})}<span><b>Игры</b><span>карточная дуэль, «Шпион», слова из Dota 2 и CS 2</span></span></div>
        <div class="feat frame">${iconHTML({svg:'ally'})}<span><b>С друзьями</b><span>дуэли, «Шпион» и турнир недели</span></span></div>
      </div>
      <div class="cta"><button class="btn" id="obNext">Начать</button></div>`;
  else if(cur==='path')html=`${dots}<h1 class="title">Как хочешь учить?</h1><p class="lead" style="margin-top:8px">От этого зависит, что будет на главной. Остальное тоже останется доступно.</p>
      <div class="stack">${opt('p','kino','Через фильмы и сериалы','Сцены с субтитрами, живые фразы',OB.path==='kino')}${opt('p','mix','Всё понемногу','Кино и немного игр',OB.path==='mix')}${opt('p','games','Через игры','Слова и фразы из Dota 2 и CS 2',OB.path==='games')}</div>
      <div class="cta"><button class="btn" id="obNext" ${OB.path?'':'disabled'}>Дальше</button></div>`;
  else if(cur==='lang')html=`${dots}<h1 class="title">Какой язык?</h1><p class="lead" style="margin-top:8px">Потом можно поменять в настройках.</p>
      ${langChoiceHTML(OB.lang)}<div class="cta"><button class="btn" id="obNext" ${OB.lang?'':'disabled'}>Дальше</button></div>`;
  else if(cur==='games')html=`${dots}<h1 class="title">Во что играешь?</h1><p class="lead" style="margin-top:8px">Можно выбрать обе. Если ни во что — просто жми «Дальше».</p>
      <div class="stack">${opt('g','dota','Dota 2','Предметы, умения, имена героев, лор',OB.games.includes('dota'))}${opt('g','cs2','CS 2','Defuse, clutch, rotate и другие слова из раунда',OB.games.includes('cs2'))}</div>
      <div class="cta"><button class="btn" id="obNext">Дальше</button></div>`;
  else if(cur==='roles')html=`${dots}<h1 class="title">Твоя роль в Доте</h1><p class="lead" style="margin-top:8px">Одна или две роли. Предметы, умения и герои будут под тебя.</p>
      ${rolesHTML(OB.roles)}<p class="hint-line" id="roleHint">${roleHintText(OB.roles)}</p>
      <div class="cta"><button class="btn" id="obNext" ${rolesOk(OB.roles)?'':'disabled'}>Дальше</button></div>`;
  else html=`${dots}<h1 class="title">Всё готово</h1><p class="lead" style="margin-top:8px">Настройки можно поменять в любой момент.</p>
      <div class="summary frame">
        <div><span>Язык</span><b>${cap(LANG_NAME[choiceToLangs(OB.lang)[0]])}</b></div>
        <div><span>Учим через</span><b>${{games:'игры',kino:'фильмы и сериалы',mix:'игры и кино'}[OB.path]}</b></div>
        ${OB.games.length?`<div><span>Игры</span><b>${OB.games.map(g=>g==='dota'?'Dota 2':'CS 2').join(' и ')}</b></div>`:''}
        <div><span>Слово выучено после</span><b>${LEARN_AT} правильных ответов</b></div>
      </div><div class="cta"><button class="btn" id="obNext">Поехали</button></div>`;
  mount(html,'obscr');
  const re=()=>{const n=$('#obNext');if(!n)return;if(cur==='path')n.disabled=!OB.path;if(cur==='lang')n.disabled=!OB.lang;};
  $$('[data-p]').forEach(b=>b.onclick=()=>{OB.path=b.dataset.p;if(OB.path==='kino')OB.games=[];$$('[data-p]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));sfx('sel');re();});
  $$('[data-g]').forEach(b=>b.onclick=()=>{const g=b.dataset.g;OB.games=OB.games.includes(g)?OB.games.filter(x=>x!==g):[...OB.games,g];b.setAttribute('aria-pressed',String(OB.games.includes(g)));sfx('sel');});
  if(cur==='lang')bindLangChoice(v=>{OB.lang=v;re();});
  if(cur==='roles')bindRoles(()=>OB.roles,v=>{OB.roles=v;},()=>{$('#obNext').disabled=!rolesOk(OB.roles);const h=$('#roleHint');h.classList.remove('warn');h.textContent=roleHintText(OB.roles);});
  $('#obNext').onclick=()=>{
    haptic('medium');sfx('whoosh');
    if(cur!=='done'){OB.i++;renderOB();return;}
    store.langs=choiceToLangs(OB.lang);store.path=OB.path;store.games=OB.games.slice();
    store.roles=OB.games.includes('dota')?(OB.roles==='all'?'all':OB.roles.slice()):'all';store.onboarded=true;save();
    renderHome();
  };
}

/* ================= настройки ================= */
function renderSettings(){
  screen='settings';backBtn(true);applyFx();if(store.gav===undefined)store.gav=true;if(store.bg3d===undefined)store.bg3d=false;if(store.vtask===undefined)store.vtask=true;
  let roles=store.roles==='all'?'all':store.roles.slice();
  const row=(k,n,d)=>`<button class="checkrow frame" data-t="${k}" aria-pressed="${!!store[k]}">${BOX}<span class="ct"><span class="cn">${n}</span>${d?`<span class="cd">${d}</span>`:''}</span></button>`;
  mount(`
    <div class="page-head"><button class="icon-btn" id="bBtn" aria-label="Назад">${ui('back')}</button><h1 class="title">Настройки</h1></div>

    <section class="set-sec"><h2>Обучение</h2>
      <div class="stack">${row('hideLearned','Убирать выученные слова',`Слово, на которое ты ${LEARN_AT} раза ответил правильно, больше не попадается в обычных играх. Оно вернётся в «Повторение» через 3, 7, 21 и 60 дней.`)}
      ${row('tts','Озвучка слов','Голос устройства читает слова и фразы. На некоторых телефонах звучит как робот, поэтому по умолчанию выключено.')}
      ${row('auto','Автопереход после верного ответа','Выключено: ты спокойно читаешь сноску и сам жмёшь «Дальше».')}
      ${row('bg3d','3D-фон вместо фото','По умолчанию фоном — кадр из фильма. Можно включить нарисованную 3D-сцену.')}</div>
      <p class="hint-line" style="margin-top:12px">Как смотреть сцены</p>
      ${segCtl('scPause',[['on','⏸ С паузами'],['off','▶ Без пауз']],scPauseOn()?'on':'off')}
      <p class="hint-line" style="margin-top:12px">Уровень английского в кино</p>
      ${segCtl('lvl',[['a','Новичок'],['b','Знаю базу']],store.lvl||'a')}
      <button class="ht-alt" id="lvlTest" style="margin-top:8px">Пройти тест уровня ещё раз</button>
      <p class="hint-line" style="margin-top:12px">Цель дня: сколько ответов в день</p>
      ${segCtl('goal',[['10','10'],['20','20'],['30','30']],String(store.goal||20))}
    </section>
    <section class="set-sec"><h2>Язык</h2>${langChoiceHTML(langsToChoice(store.langs))}</section>
    <section class="set-sec"><h2>Роли</h2>${rolesHTML(roles)}<p class="hint-line" id="roleHint">${roleHintText(roles)}</p></section>
    <section class="set-sec"><h2>Приложение</h2>
      <div class="stack">${row('snd','Звук','')}${row('fx','Анимации и эффекты','')}${canFull()?row('full','Полный экран',''):''}${row('remind','Напоминания о повторении','Бот напишет днём, когда фразы из сцен пора повторить. Не чаще раза в день.')}${row('gav','Маскот в проверке','Радуется верным ответам, «рубит» выученные фразы, ставит «Снято!» после эпизода.')}</div>
    </section>
    <section class="set-sec"><button class="btn dark" id="reset" style="color:#F4907A">Сбросить прогресс</button></section>`,'settings');
  $('#bBtn').onclick=()=>{sfx('tap');renderHome();};
  bindSeg('goal',v=>{store.goal=+v;save();sfx('sel');});
  bindSeg('scPause',v=>{store.scPause=v;save();sfx('sel');});
  bindLangChoice(v=>{store.langs=choiceToLangs(v);save();});
  bindRoles(()=>roles,v=>{roles=v;if(rolesOk(v)){store.roles=v==='all'?'all':v.slice();save();}},()=>{const h=$('#roleHint');h.classList.remove('warn');h.textContent=roleHintText(roles);});
  $$('.checkrow').forEach(b=>b.onclick=()=>{
    const k=b.dataset.t;store[k]=!store[k];save();b.setAttribute('aria-pressed',String(store[k]));sfx('sel');haptic('sel');
    if(k==='fx')applyFx();if(k==='full')applyFullscreen();if(k==='remind')remindSync(true);if(k==='bg3d'&&window.BG3D)BG3D.enable(store.bg3d);
  });
  bindSeg('lvl',v=>{store.lvl=v;save();toast(v==='a'?'Режим новичка: задания с подсказками':'Обычная сложность');});
  if($('#lvlTest'))$('#lvlTest').onclick=()=>{sfx('tap');renderLevelTest(()=>renderSettings());};
  $('#reset').onclick=()=>{
    const doReset=()=>{const keep={snd:store.snd,fx:store.fx,full:store.full};store=Object.assign(fresh(),keep);M={};save();saveM();startOnboarding();};
    const txt='Сбросить билеты, словарь и ошибки? Язык и роли тоже придётся выбрать заново.';
    if(TG&&TG.showConfirm){try{TG.showConfirm(txt,ok=>{if(ok)doReset();});return;}catch(e){}}
    if(window.confirm(txt))doReset();
  };
}

/* ================= вкладки, заставка, профиль ================= */
const TABS=[
 {id:'learn',name:'Главная',ico:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>'},
 {id:'kino',name:'Кинозал',ico:'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M7 3l3 3M14 3l-3 3"/><path d="M10 10.5v5l4-2.5z"/>'},
 {id:'dict',name:'Словарь',ico:'<path d="M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h9"/><path d="M9 8h5"/>'},
 {id:'games',name:'Игры',ico:'<path d="M7 8h10a4 4 0 0 1 4 4v3a3 3 0 0 1-5.4 1.8L14 15h-4l-1.6 1.8A3 3 0 0 1 3 15v-3a4 4 0 0 1 4-4z"/><path d="M7.5 11v3M6 12.5h3"/><circle cx="16" cy="11.5" r=".8"/><circle cx="17.5" cy="13.5" r=".8"/>'},
 {id:'profile',name:'Профиль',ico:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'}
];
// «Шпион» и «Арена» — разделы внутри «Игр»
const TAB_PARENT={spy:'games',arena:'games'};
let lastTabIdx=0;
function ensureTabbar(){
  if($('#tabbar'))return;
  const nav=document.createElement('nav');nav.id='tabbar';nav.className='tabbar';
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
  const ind=$('#tabind');if(ind&&i>=0)ind.style.transform=`translateX(${i*100}%)`;
}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.querySelector('.sc-pfs')){e.preventDefault();e.stopPropagation();scExitFull();}},true);
function noCloseAsk(){try{if(TG&&TG.disableClosingConfirmation)TG.disableClosingConfirmation();}catch(e){}}
function renderTab(id){
  // 12.5: рубильник «тех. работы» — игрокам заглушка, админу всё как обычно
  if(flagOf('all')!=='on'){screen='home';ensureTabbar();mount(`<div class="mnt"><i>🎬</i><b>Кинотеатр временно обновляется</b><span>Меняем плёнку и чиним проектор. Загляни чуть позже — прогресс никуда не денется.</span></div>`,'tabscr');return;}
  id=id||store.tab||'learn';
  if(!['learn','kino','dict','games','profile','spy','arena'].includes(id))id='learn';
  try{const top=TAB_PARENT[id]||id;if((top==='kino'||top==='games')&&flagOf(top)==='hide')id='learn';}catch(e){}
  const vis=TAB_PARENT[id]||id,sub=!!TAB_PARENT[id];
  const idx=TABS.findIndex(t=>t.id===vis),dir=idx>lastTabIdx?'fr':idx<lastTabIdx?'fl':'';lastTabIdx=idx;
  if(store.tab!==vis){store.tab=vis;save();}
  stopSpyAll();if(typeof stopTourTimer==='function')stopTourTimer();noCloseAsk();musStop();MUSOFF=null;REVCHAIN=false;{const g=document.getElementById('gav');if(g)g.remove();}if(typeof SCUR!=='undefined')SCUR.id=null;scStop();
  try{if(TG&&TG.disableClosingConfirmation)TG.disableClosingConfirmation();}catch(e){}
  screen=sub?'subtab':'home';backBtn(sub);applyFx();ensureTabbar();delete document.body.dataset.world;
  const gated=(vis==='kino'||vis==='games')&&flagOf(vis)!=='on'||(TAB_PARENT[id]&&flagOf(id)!=='on');
  let html=gated?`<h1 class="title anim">${TABS.find(t=>t.id===vis).name}</h1>`+gateHTML(TAB_PARENT[id]?id:vis):id==='learn'?learnTabHTML():id==='kino'?kinoTabHTML():id==='dict'?dictTabHTML():id==='games'?gamesTabHTML():id==='spy'?spyTabHTML():id==='arena'?arenaTabHTML():profileTabHTML();
  if(sub)html=`<button class="crumb anim" id="crumb">${ui('back')}<span>Игры</span></button>`+html;
  mount(html,'tabscr '+dir);
  paintTabbar(vis);
  if(!gated)(id==='learn'?bindLearn:id==='kino'?bindKino:id==='dict'?bindDict:id==='games'?bindGames:id==='spy'?bindSpyTab:id==='arena'?bindArena:bindProfile)();
  applyFlagsUI();
  if(sub)$('#crumb').onclick=()=>{sfx('tap');renderTab('games');};
  $$('.tabscr .anim').forEach((el,i)=>el.style.animationDelay=Math.min(i,10)*55+'ms');
  if(id==='learn'||id==='profile')setTimeout(checkAch,400);
}
function renderHome(){renderTab(store.tab||'learn');}
function tgPhoto(){try{const u=TG&&TG.initDataUnsafe&&TG.initDataUnsafe.user;return u&&u.photo_url||'';}catch(e){return '';}}
function headHTML(){
  const name=userName()||'Игрок',rk=rankInfo(),photo=tgPhoto();
  return `<header class="thead anim"><div class="tava${photo?'':' mono'}"${photo?` style="background-image:url('${esc(photo)}')"`:''}>${photo?'':esc((name||'И').trim().charAt(0).toUpperCase())}</div>
    <div class="twho"><b>${esc(name)}</b><button class="rankchip" id="rankBtn">${rk.r.n} <i>?</i></button></div>
    ${store.streak?`<span class="streak" title="Дней подряд">🔥 ${store.streak}</span>`:''}<span class="gold">${ui('coin')}${fmt(store.gold)}</span><button class="icon-btn" id="srchBtn" aria-label="Поиск" onclick="renderSearch()">${ui('search')}</button><button class="icon-btn" id="setBtn" aria-label="Настройки">${ui('gear')}</button></header>`;
}
function bindHead(){
  if($('#setBtn'))$('#setBtn').onclick=()=>{sfx('tap');renderSettings();};
  $$('#rankBtn,#rankBtn2').forEach(b=>b.onclick=showRanks);
}

/* ---- Учить ---- */
function learnTabHTML(){
  const t=totals(),d=dayStat(),goal=store.goal||20,gp=Math.min(100,Math.round(d.n/goal*100)),due=dueList().length,h=heroFor(),w=wordOfDay();
  const mis=store.mistakes.filter(x=>store.langs.includes(x.split('|')[2])).length,lp=modeProgress('lore');
  const modes=MODES.filter(m=>!m.tier).map(m=>{const p=modeProgress(m.id),pct=p.total?Math.round(p.learned/p.total*100):0;
    return `<button class="mcard card anim" data-m="${m.id}">${iconHTML({img:INV_ICONS[m.id],svg:m.icon.svg})}<b>${m.name}</b><small>${p.total&&p.learned>=p.total?'выучено всё':`${p.learned} из ${p.total}`}</small><span class="mbar"><i style="--w:${pct}%"></i></span></button>`;}).join('');
  return `${headHTML()}
    <section class="goal card anim">
      <div class="gring"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="19"/><circle class="gv" cx="22" cy="22" r="19" style="--gp:${gp}"/></svg><b>${Math.min(d.n,goal)}</b></div>
      <div class="gtxt"><b>${d.done?'Цель дня выполнена':'Цель дня'}</b><small>${d.done?'+200 билетов уже у тебя':`Ещё ${goal-d.n} ${plural(goal-d.n,['ответ','ответа','ответов'])} до бонуса +200 билетов`}</small></div>
      <div class="gstreak"><b>${store.streak}</b><small>${plural(store.streak,['день','дня','дней'])} подряд</small></div>
    </section>
    <section class="play card anim"><div class="pic" style="background-image:url('${portrait(h.hero)}')"></div>
      <div class="pinfo"><span class="ptag">${store.roles==='all'?'Все роли':store.roles.map(r=>cap(ROLE_NAME[r])).join(', ')} ${store.langs.map(langBadge).join('')}</span>
      <h2>Быстрая игра</h2><p>10 вопросов из всех режимов, в конце Рошан</p><button class="btn" id="quick">Играть</button></div></section>
    ${due?`<button class="rowcard card anim" id="review">${iconHTML({img:'items/refresher',svg:'star'})}<span><b>Повторение</b><small>${due} ${plural(due,['слово пора','слова пора','слов пора'])} повторить, чтобы не забыть</small></span><span class="go">›</span></button>`:''}
    <h2 class="sec2 anim">Режимы <span>выучено ${t.learned}</span></h2>
    <div class="mgrid">${modes}</div>
    <button class="rowcard card anim ultra" id="lore">${iconHTML({img:'items/ultimate_scepter',svg:'scroll'})}<span><b>Лор Доты</b><small>Хай тир: настоящие тексты из игры${LORE_STATE==='ok'?`, ${lp.learned} из ${lp.total}`:LORE_STATE==='fail'?'. Нажми, чтобы загрузить':'. Загружаю...'}</small></span><span class="go">›</span></button>
    <div class="duo2">
      <button class="mini card anim" id="wod"><small>Слово дня</small><b>${esc(w.en)}</b><span>${esc(w.de)}</span></button>
      <button class="mini card anim${mis?' bad':''}" id="redo" ${mis?'':'disabled'}><small>Ошибки</small><b>${mis}</b><span>${mis?'разобрать сейчас':'пока нет'}</span></button>
    </div>`;
}
function bindLearn(){
  bindHead();
  $('#quick').onclick=()=>{haptic('medium');startSession('quick');};
  if($('#review'))$('#review').onclick=()=>{haptic('medium');startSession('review');};
  $('#lore').onclick=()=>{haptic('medium');if(LORE_STATE==='fail'){LORE_STATE='idle';loadLore();renderTab('learn');return;}startSession('mode','lore');};
  $('#wod').onclick=showWod;
  const mis=store.mistakes.filter(x=>store.langs.includes(x.split('|')[2])).length;
  if(mis)$('#redo').onclick=()=>{haptic('medium');startSession('mistakes');};
  $$('.mcard').forEach(b=>b.onclick=()=>{haptic('medium');startSession('mode',b.dataset.m);});
}

/* ---- Шпион ---- */
function spyTabHTML(){
  return `<h1 class="title anim">Шпион</h1>
    <div class="stage anim" style="margin:12px 0 14px"><div class="pic" style="background-image:url('${GART.spy}')"></div><div class="stage-t"><span class="hn">Найди шпиона</span></div></div>
    <p class="lead anim">Все знают загаданного героя, предмет или умение. Все, кроме шпиона. Задавайте вопросы по очереди и вычислите его, пока он не догадался.</p>
    <button class="bigopt card anim" id="spyLocal">${iconHTML({img:'items/smoke_of_deceit',svg:'smoke'})}<span><b>За одним телефоном</b><small>Сидите вместе и передаёте телефон по кругу. Интернет не нужен.</small></span><span class="go">›</span></button>
    <button class="bigopt card anim" id="spyOnline">${iconHTML({img:'abilities/bounty_hunter_track',svg:'eye'})}<span><b>По ссылке</b><small>Каждый со своего телефона. Создай комнату и отправь ссылку друзьям.</small></span><span class="go">›</span></button>
    <div class="rules card anim"><h3>Как играть</h3><ol>
      <li>Каждый смотрит свою роль. Мирные видят загаданное, шпион — только то, что он шпион.</li>
      <li>Тот, чей ход, выбирает, кого спросить. Тот отвечает и спрашивает следующим.</li>
      <li>Шпион отвечает наугад и слушает, чтобы догадаться.</li>
      <li>Подозреваете кого-то — голосование. Поймали шпиона — победа мирных.</li>
      <li>Шпион может раскрыться и назвать загаданное. Угадал — победил он.</li>
    </ol></div>`;
}
function bindSpyTab(){
  $('#spyLocal').onclick=()=>{sfx('tap');renderSpyLocalSetup();};
  $('#spyOnline').onclick=()=>{sfx('tap');renderSpyOnlineSetup();};
}

/* ---- Арена ---- */
function arenaTabHTML(){
  const ds=Object.entries(store.duels||{}).sort((a,b)=>(b[1].ts||0)-(a[1].ts||0)).slice(0,6);
  const rows=ds.length?ds.map(([seed,d])=>{
    const o=d.opp?duelOutcome(d,d.opp):null;
    return `<div class="drow2"><span class="lb${d.L==='de'?' de':''}">${d.L==='de'?'DE':'EN'}</span><span class="dn">${d.opp?esc(d.opp.n):'ждём соперника'}</span><b>${d.s}${d.opp?` : ${d.opp.s}`:''}</b><span class="tag ${o===null?'':o>0?'w':o<0?'l':''}">${o===null?'вызов':o>0?'победа':o<0?'поражение':'ничья'}</span></div>`;}).join('')
    :'<div class="empty">Дуэлей пока не было. Вызови друга!</div>';
  return `<h1 class="title anim">Арена</h1>
    <section class="play card anim" style="margin-top:12px"><div class="pic" style="background-image:url('${GART.duel}')"></div>
      <div class="pinfo"><span class="ptag">1 на 1</span><h2>Дуэль</h2><p>Одинаковые 10 вопросов у тебя и друга. Больше правильных — победа.</p><button class="btn" id="duel">Вызвать друга</button></div></section>
    <section class="tourcard card anim">${iconHTML({img:'items/aegis',svg:'trophy'},'big')}
      <div><span class="ptag">Раз в неделю</span><h2>Турнир недели</h2><p>Приз чеком CryptoBot. Участие бесплатное, ответы проверяет сервер.</p><button class="btn gold2" id="tour">Открыть турнир</button></div></section>
    <h2 class="sec2 anim">Мои дуэли</h2>
    <div class="card anim">${rows}</div>`;
}
function bindArena(){
  $('#duel').onclick=()=>{sfx('tap');renderDuelNew();};
  $('#tour').onclick=()=>{sfx('tap');renderTour();};
}

/* ---- Профиль и достижения ---- */
const ACH=[
 {id:'first',n:'Первый дубль',d:'Сыграй первую игру',ic:null,t:s=>s.games>=1},
 {id:'goal',n:'Цель дня',d:'Выполни цель дня',ic:null,t:s=>s.goalsDone>=1},
 {id:'w10',n:'Первая десятка',d:'Выучи 10 слов',ic:null,t:s=>s.learned>=10},
 {id:'w50',n:'Полсотни',d:'Выучи 50 слов',ic:null,t:s=>s.learned>=50},
 {id:'w120',n:'Словарный запас',d:'Выучи 120 слов',ic:null,t:s=>s.learned>=120},
 {id:'w230',n:'Режиссёрская версия',d:'Выучи 230 слов',ic:null,t:s=>s.learned>=230},
 {id:'rampage',n:'Серия',d:'5 правильных ответов подряд',ic:null,t:s=>s.bestStreak>=5},
 {id:'godlike',n:'Без дублей',d:'10 из 10 в одной игре',ic:null,t:s=>s.perfect>=1},
 {id:'streak3',n:'Три дня',d:'Играй 3 дня подряд',ic:null,t:s=>s.streak>=3},
 {id:'streak7',n:'Неделя',d:'Играй 7 дней подряд',ic:null,t:s=>s.streak>=7},
 {id:'duel',n:'Дуэлянт',d:'Победи друга в дуэли',ic:null,t:s=>s.duelWins>=1},
 {id:'spy',n:'Агент',d:'Сыграй раунд «Шпиона»',ic:null,t:s=>s.spyRounds>=1},
 {id:'tour',n:'Турнир',d:'Сыграй в турнире недели',ic:null,t:s=>s.tourPlayed>=1},
 {id:'lore',n:'Знаток лора',d:'Выучи 10 слов в лоре',ic:null,t:s=>s.loreLearned>=10},
 {id:'review',n:'Не забыл',d:'Пройди повторение слова',ic:null,t:s=>s.reviews>=1}
];
function achStats(){
  const t=totals();
  const lore=Object.keys(M).filter(k=>k.startsWith('lore|')&&M[k]>=LEARN_AT).length;
  const duelWins=Object.values(store.duels||{}).filter(d=>d.opp&&duelOutcome(d,d.opp)>0).length;
  return {games:store.games||0,goalsDone:store.goalsDone||0,learned:t.learned,bestStreak:store.bestStreak||0,perfect:store.perfect||0,streak:store.streak||0,duelWins,spyRounds:store.spyRounds||0,tourPlayed:store.tourPlayed||0,loreLearned:lore,reviews:store.reviews||0};
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
function profileTabHTML(){
  const t=totals(),rk=rankInfo(t.learned),name=userName()||'Игрок',photo=tgPhoto(),acc=accuracy(),s=achStats();
  const got=ACH.filter(a=>store.ach[a.id]).length,due=dueList().length;
  const mis=store.mistakes.filter(x=>store.langs.includes(x.split('|')[2])).length;
  const cell=(v,l)=>`<div><b>${v}</b><span>${l}</span></div>`;
  const adm=FLAG_ADMIN?`<button class="rowcard card anim" id="admBtn">${iconHTML({svg:'shield'})}<span><b>Админ-панель</b><small>Какие разделы видят игроки, тех. работы и тестеры</small></span><span class="go">›</span></button>`:'';
  return `<section class="phead card anim"><div class="pava${photo?'':' mono'}"${photo?` style="background-image:url('${esc(photo)}')"`:''}>${photo?'':esc((name||'И').trim().charAt(0).toUpperCase())}</div>
      <b class="pn">${esc(name)}</b><button class="rankchip" id="rankBtn">${rk.r.n} <i>?</i></button>
      <span class="pbar"><i style="--w:${rk.pct}%"></i></span><small>${rk.nx?`До ранга ${rk.nx.n}: ${rk.n} из ${rk.nx.at} выученных слов`:'Высший ранг'}${rk.r.m>1?`. Билеты x${rk.r.m}`:''}</small></section>
    <div class="stats card anim">${cell(t.learned,'выучено слов')}${cell(acc===null?'—':acc+'%','точность')}${cell(store.streak,'дней подряд')}${cell(fmt(store.gold),'билетов')}${cell(store.answered,'ответов')}${cell(s.bestStreak,'лучшая серия')}</div>
    ${weekHTML()}
    ${rwProfileHTML()}
    <h2 class="sec2 anim">Достижения <span>${got} из ${ACH.length}</span></h2>
    <div class="achs anim">${ACH.map(a=>`<button class="ach${store.ach[a.id]?' got':''}" data-a="${a.id}">${iconHTML({img:a.ic,svg:'trophy'})}<span>${esc(a.n)}</span></button>`).join('')}</div>
    <div class="links card anim">
      <button class="lrow2" id="dict">${iconHTML({svg:'book'},'sm')}<span><b>Словарь</b><small>изучаю ${t.going}, выучено ${t.learned}</small></span><span class="go">›</span></button>
      <button class="lrow2" id="rev2" ${due?'':'disabled'}>${iconHTML({img:'items/refresher',svg:'star'},'sm')}<span><b>Повторение</b><small>${due?`${due} ${plural(due,['слово ждёт','слова ждут','слов ждут'])}`:'пока нечего повторять'}</small></span><span class="go">›</span></button>
      <button class="lrow2" id="redo2" ${mis?'':'disabled'}>${iconHTML({svg:'flag'},'sm')}<span><b>Ошибки</b><small>${mis?`${mis} на разбор`:'пока нет'}</small></span><span class="go">›</span></button>
      <button class="lrow2" id="helpBtn" onclick="renderHelp()">${iconHTML({svg:'book'},'sm')}<span><b>Как пользоваться</b><small>все функции коротко и по шагам</small></span><span class="go">›</span></button>
      <button class="lrow2" id="setBtn">${iconHTML({svg:'shield'},'sm')}<span><b>Настройки</b><small>язык, роли, оформление, звук</small></span><span class="go">›</span></button>
    </div>
    ${adm}
    <p class="foot">Версия ${APP_V}</p>`;
}
function bindProfileAdmin(){const b=$('#admBtn');if(b)b.onclick=()=>{sfx('tap');renderAdmin();};}
function bindProfile(){bindProfileAdmin();
  $$('[data-rw]').forEach(b=>b.onclick=()=>{sfx('tap');rwOpen(b.dataset.rw);});$$('[data-seg]').forEach(b=>b.onclick=()=>{sfx('tap');segOpen(b.dataset.seg);});$$('[data-bgp]').forEach(b=>b.onclick=()=>{const k=b.dataset.bgp;store.appBg=store.appBg===k?'':k;save();sfx('good');haptic('sel');toast(store.appBg?'🖼 Фон поставлен':'Фон убран');appBgApply();$$('[data-bgp]').forEach(x=>x.classList.toggle('on',x.dataset.bgp===store.appBg));});
  bindHead();
  $('#dict').onclick=()=>{sfx('tap');renderDict('going');};
  if(dueList().length)$('#rev2').onclick=()=>{haptic('medium');startSession('review');};
  if(!$('#redo2').disabled)$('#redo2').onclick=()=>{haptic('medium');startSession('mistakes');};
  $$('.ach').forEach(b=>b.onclick=()=>{const a=ACH.find(x=>x.id===b.dataset.a);sfx('sel');toast(`${a.n}: ${a.d}${store.ach[a.id]?'. Получено':''}`);});
}

/* ---- заставка и отсчёт ---- */
function splash(){
  // 11.2: «кинопроектор» — отсчёт плёнки 3-2-1, вспышка, шторки-letterbox раскрываются, проявляется название. Тап — пропустить.
  if(!store.fx)return;
  const d=document.createElement('div');d.className='splash3';
  const title='ЯЗЫКИ ПО КИНО'.split('').map((ch,i)=>`<span style="--i:${i}">${ch===' '?'&nbsp;':ch}</span>`).join('');
  d.innerHTML=`<div class="s3-beam"></div><div class="s3-lead"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44"/><circle class="sw" cx="50" cy="50" r="22"/><path d="M50 2v96M2 50h96"/></svg><b><i>3</i><i>2</i><i>1</i></b></div>
    <div class="s3-flash"></div><div class="s3-bar t"></div><div class="s3-bar b"></div>
    <div class="s3-c"><div class="s3-t">${title}</div><div class="s3-line"></div><div class="s3-sub">английский и немецкий по сценам из кино</div></div><div class="s3-grain"></div>`;
  document.body.appendChild(d);
  let gone=false;const out=()=>{if(gone)return;gone=true;d.classList.add('out');setTimeout(()=>d.remove(),600);};
  d.addEventListener('pointerdown',out);setTimeout(out,2300);
}
function countdown(cb){
  if(!store.fx){cb();return;}
  const d=document.createElement('div');d.className='cdown';document.body.appendChild(d);
  let n=3;
  const step=()=>{if(n===0){d.innerHTML='<b class="go">В бой!</b>';sfx('announce',3);setTimeout(()=>{d.remove();cb();},450);return;}
    d.innerHTML=`<b>${n}</b>`;sfx('tick');haptic('light');n--;setTimeout(step,620);};
  step();
}
const SPY_HEROES=window.__DATA.SPY_HEROES;
const SPY_ITEMS=window.__DATA.SPY_ITEMS;

function tgConfirm(text,cb){
  try{if(TG&&TG.showConfirm&&TG.isVersionAtLeast&&TG.isVersionAtLeast('6.2')){TG.showConfirm(text,ok=>{if(ok)cb();});return;}}catch(e){}
  if(window.confirm(text))cb();
}
/* ================= шпион ================= */
const API='https://dota.1f8t8graf4.workers.dev';
const SPY_CATN={heroes:'Герои',items:'Предметы',skills:'Умения',mix:'Всё вместе'};
const SPY_SKILLS=SKILLS.map(s=>[s.name,s.key]);
const SPY_LANGN={ru:'Русский',en:'English',de:'Deutsch'};
const SPY_RULES={ru:'',en:'Вопросы и ответы только по-английски.',de:'Вопросы и ответы только по-немецки.'};
const SPY_CAT_OPTS=[['heroes','Герои'],['items','Предметы'],['skills','Умения'],['mix','Всё']];
const SPY_LANG_OPTS=[['ru','Русский'],['en','English'],['de','Deutsch']];
const spyIconT=(t,k)=>t==='h'?{img:'heroes/'+k,svg:'helmet'}:t==='s'?{img:'abilities/'+k,svg:'lightning'}:{img:'items/'+k,svg:'bag'};
const spyIcon=s=>spyIconT(s.t,s.k);
const spyKindName=s=>s.t==='h'?'герой':s.t==='s'?'умение':'предмет';
const SPY_QHINTS={
  h:['Он ближнего боя?','Его часто берут на миде?','Он из Сил Света?','У него есть оглушение?','Он умеет становиться невидимым?','Он сильный в начале игры?','Он похож на животное?','У него есть призванные существа?','Его ульта бьёт по площади?','Он может быстро перемещаться по карте?','Его часто банят?','Он страшный на вид?'],
  s:['Это ульта?','Оно оглушает?','Оно бьёт по площади?','Оно лечит или защищает?','Оно пассивное?','Его герой ближнего боя?','Оно связано со льдом, огнём или молнией?','Им часто пользуются саппорты?','Оно двигает героя?','Его видно издалека?'],
  i:['Он дорогой?','Его покупают саппорты?','Его берут в начале игры?','У него есть кнопка применения?','Он собирается из нескольких предметов?','Он даёт броню?','Он помогает убегать?','Он одноразовый?','Он связан с магией?','Он даёт урон?','Его продают в секретной лавке?','Его покупают против магов?']
};
function spyHintQ(t){const list=t&&SPY_QHINTS[t]?SPY_QHINTS[t]:[...SPY_QHINTS.h,...SPY_QHINTS.i,...SPY_QHINTS.s];toast('Пример вопроса: '+rnd(list));sfx('hint');}
function turnHTML(o){
  const last=o.last?`<p class="last">${esc(o.last.a)} спросил(а) ${esc(o.last.b)}.</p>`:'<p class="last">Первый вопрос раунда.</p>';
  if(o.answering)return `<div class="turn frame"><small>Вопрос ${o.asks}</small>${last}<p class="now">Сейчас отвечает: <b>${esc(o.fromN)}</b></p>${o.canAsk?'<p class="note" style="margin:6px 0 0">Ответь вслух, а когда закончишь — нажми кнопку. Тогда ход перейдёт к тебе.</p><button class="btn" id="spDone" style="margin-top:10px">Я закончил говорить</button>':`<p class="note" style="margin:6px 0 0">Ждём, пока ${esc(o.fromN)} ответит и нажмёт «Я закончил говорить».</p>`}</div>`;
  const pool=o.cat==='items'?SPY_QHINTS.i:o.cat==='skills'?SPY_QHINTS.s:o.cat==='heroes'?SPY_QHINTS.h:[...SPY_QHINTS.h,...SPY_QHINTS.i];
  const ideas=o.canAsk?`<div class="idea">${shuffle(pool).slice(0,3).map(q=>`<span>${esc(q)}</span>`).join('')}</div>`:'';
  const targets=o.canAsk?`<p class="note" style="margin:6px 0 0">Кого спросишь? Нельзя спрашивать того, кто только что спросил тебя.</p><div class="targets">${o.players.map(p=>`<button data-t="${p.id}" ${p.id===o.fromId||p.id===o.prev?'disabled':''}>${esc(p.n)}</button>`).join('')}</div>`:`<p class="note" style="margin:6px 0 0">Ждём, пока ${esc(o.fromN)} выберет, кого спросить.</p>`;
  return `<div class="turn frame"><small>Вопрос ${o.asks+1}</small>${last}<p class="now">Спрашивает: <b>${esc(o.fromN)}</b></p>${o.canAsk?'<p class="note" style="margin:8px 0 0">Идеи для вопроса:</p>'+ideas:''}${targets}<button class="hint-btn" id="qhint">${ui('bulb')}Другие идеи</button></div>`;
}
const spyBg=s=>s&&s.t==='h'?portrait(s.k):portrait('bounty_hunter');
function segCtl(name,opts,val){return `<div class="segctl" data-seg="${name}">${opts.map(([v,l])=>`<button data-v="${v}" aria-pressed="${String(v)===String(val)}">${l}</button>`).join('')}</div>`;}
function bindSeg(name,fn){$$(`[data-seg="${name}"] button`).forEach(b=>b.onclick=()=>{$$(`[data-seg="${name}"] button`).forEach(x=>x.setAttribute('aria-pressed',String(x===b)));sfx('sel');haptic('sel');fn(b.dataset.v);});}
function spyPrefs(){
  if(!store.spy||typeof store.spy!=='object')store.spy={};
  const p=store.spy;
  if(!SPY_CATN[p.cat])p.cat='heroes';
  if(!SPY_LANGN[p.lang])p.lang='ru';
  p.n=Math.min(12,Math.max(3,+p.n||4));
  if(![5,8,10].includes(+p.min))p.min=8;
  p.min=+p.min;
  if(!Array.isArray(p.names))p.names=[];
  return p;
}
function roleCardHTML(role,sec,lang,small){
  const rule=SPY_RULES[lang]?`<p class="note">${SPY_RULES[lang]}</p>`:'';
  if(role==='spy')return `<div class="rolecard flip spy${small?' small':''}">${iconHTML({img:'abilities/riki_tricks_of_the_trade',svg:'mask'},'big')}<h2>Ты шпион</h2><p>Ты не знаешь, что загадано. Слушай вопросы, не спались и попробуй догадаться.</p>${rule}</div>`;
  return `<div class="rolecard flip${sec.t==='h'?' hero':''}${small?' small':''}">${iconHTML(spyIcon(sec),'big')}<span class="kind">Загадан ${spyKindName(sec)}</span><h2>${esc(sec.n)}</h2><p>Не называй прямо. Найди шпиона.</p>${rule}</div>`;
}
const cardBack=(text,small)=>`<div class="rolecard back${small?' small':''}" id="card">${iconHTML({img:'abilities/bounty_hunter_track',svg:'eye'},'big')}<p>${text}</p></div>`;
function spyRandom(cat){
  const type=cat==='mix'?rnd(['heroes','items','skills']):cat;
  const x=rnd(type==='heroes'?SPY_HEROES:type==='skills'?SPY_SKILLS:SPY_ITEMS);
  return {t:type==='heroes'?'h':type==='skills'?'s':'i',n:x[0],k:x[1]};
}
function spyOptions(sec){
  const list=sec.t==='h'?SPY_HEROES:sec.t==='s'?SPY_SKILLS:SPY_ITEMS;
  return shuffle([[sec.n,sec.k],...shuffle(list.filter(x=>x[0]!==sec.n)).slice(0,7)]);
}
const optsHTML=(opts,t,active)=>`<div class="opts">${opts.map((o,i)=>`<button class="optc" data-i="${i}" ${active?'':'disabled'}>${iconHTML(spyIconT(t,o[1]),'sm')}<span>${esc(o[0])}</span></button>`).join('')}</div>`;

let SPL=null,SPYT=null;
let SPO={code:null,v:null,poll:null,busy:false,reveal:false};
function stopSpyAll(){if(SPYT){clearInterval(SPYT);SPYT=null;}stopSpyPoll();}

function renderSpyHub(){if(typeof flagOf==='function'){const g=flagOf('games')!=='on'?'games':flagOf('spy')!=='on'?'spy':null;if(g){showGate(g,'Шпион');return;}}renderTab('spy');}
function renderSpyLocalSetup(){
  screen='spyset';backBtn(true);stopSpyAll();
  const p=spyPrefs();
  mount(`
    <div class="page-head"><button class="icon-btn" id="bBtn" aria-label="Назад">${ui('back')}</button><h1 class="title">За одним телефоном</h1></div>
    <div class="opt"><span>Игроков</span><div class="stepper frame"><button class="icon-btn" id="minus" aria-label="Меньше">−</button><b id="pn">${p.n}</b><button class="icon-btn" id="plus" aria-label="Больше">+</button></div></div>
    <div class="opt"><span>Имена (можно оставить как есть)</span><div class="names" id="names"></div></div>
    <div class="opt"><span>Что загадываем</span>${segCtl('cat',SPY_CAT_OPTS,p.cat)}</div>
    <div class="opt"><span>Язык общения</span>${segCtl('lang',SPY_LANG_OPTS,p.lang)}</div>
    <div class="opt"><span>Время на обсуждение</span>${segCtl('min',[['5','5 минут'],['8','8 минут'],['10','10 минут']],p.min)}</div>
    <div class="cta"><button class="btn" id="go">Раздать роли</button></div>`,'spyscr');
  $('#bBtn').onclick=()=>{sfx('tap');renderSpyHub();};
  const drawNames=()=>{$('#names').innerHTML=Array.from({length:p.n},(_,i)=>`<input class="pname" data-i="${i}" maxlength="20" placeholder="Игрок ${i+1}" value="${esc(p.names[i]||'')}">`).join('');
    $$('.pname').forEach(inp=>inp.oninput=()=>{p.names[+inp.dataset.i]=inp.value.trim();save();});};
  drawNames();
  const setN=d=>{p.n=Math.min(12,Math.max(3,p.n+d));$('#pn').textContent=p.n;drawNames();sfx('tap');haptic('sel');save();};
  $('#minus').onclick=()=>setN(-1);$('#plus').onclick=()=>setN(1);
  bindSeg('cat',v=>{p.cat=v;save();});bindSeg('lang',v=>{p.lang=v;save();});bindSeg('min',v=>{p.min=+v;save();});
  $('#go').onclick=startSpyLocal;
}
function startSpyLocal(){
  const p=spyPrefs();
  const names=Array.from({length:p.n},(_,i)=>(p.names[i]||'').trim()||`Игрок ${i+1}`);
  const first=Math.floor(Math.random()*p.n);
  SPL={n:p.n,names,cat:p.cat,lang:p.lang,min:p.min,sec:spyRandom(p.cat),spy:Math.floor(Math.random()*p.n),first,turn:{from:first,prev:null},last:null,asks:0,i:0,shown:false,timeUp:false};
  haptic('medium');sfx('whoosh');renderSpyDeal();
}
function renderSpyDeal(){
  screen='spyl';backBtn(true);
  const i=SPL.i,last=i===SPL.n-1;
  mount(`
    <p class="dealn">${esc(SPL.names[i])}</p><p class="note center" style="margin:-4px 0 12px">Игрок ${i+1} из ${SPL.n}</p>
    ${SPL.shown?roleCardHTML(i===SPL.spy?'spy':'crew',SPL.sec,SPL.lang):cardBack(`Передай телефон: ${esc(SPL.names[i])}. Остальные не подглядывают.`)}
    <div class="cta"><button class="btn${SPL.shown?' dark':''}" id="deal">${SPL.shown?(last?'Скрыть и начать игру':'Скрыть и передать дальше'):'Показать мою роль'}</button></div>`,'spyscr');
  const act=()=>{
    if(!SPL.shown){SPL.shown=true;haptic('heavy');sfx('sel');renderSpyDeal();return;}
    SPL.shown=false;SPL.i++;sfx('whoosh');
    if(SPL.i>=SPL.n){SPL.endAt=Date.now()+SPL.min*60000;renderSpyLocalPlay();}else renderSpyDeal();
  };
  $('#deal').onclick=act;
  if($('#card'))$('#card').onclick=act;
}
const spyClock=ms=>{const s=Math.max(0,Math.ceil(ms/1000));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');};
function renderSpyLocalPlay(){
  screen='spyl';backBtn(true);
  mount(`
    <div class="page-head"><button class="icon-btn" id="bBtn" aria-label="Назад">${ui('back')}</button><h1 class="title">Шпион</h1></div>
    <div class="ring small${SPL.timeUp?' over':''}" id="ring"><div><b id="clock">${spyClock(SPL.endAt-Date.now())}</b><small>на обсуждение</small></div></div>
    ${SPY_RULES[SPL.lang]?`<p class="status">${SPY_RULES[SPL.lang]}</p>`:''}
    ${turnHTML({asks:SPL.asks,last:SPL.last?{a:SPL.names[SPL.last.a],b:SPL.names[SPL.last.b]}:null,fromN:SPL.names[SPL.turn.from],fromId:SPL.turn.from,prev:SPL.turn.prev,canAsk:true,cat:SPL.cat,players:SPL.names.map((n,i)=>({id:i,n}))})}
    <div class="cta btns"><button class="btn" id="vote">Начать голосование: кто шпион?</button><button class="btn red" id="reveal">Шпион раскрылся и угадывает</button></div>`,'spyscr hasbar');
  if(SPL.keepY!=null){window.scrollTo(0,SPL.keepY);SPL.keepY=null;}
  $('#bBtn').onclick=()=>{sfx('tap');renderSpyHub();};
  $('#vote').onclick=()=>{sfx('tap');renderSpyLocalVote();};
  $('#reveal').onclick=()=>{sfx('tap');renderSpyLocalGuess();};
  $('#qhint').onclick=()=>spyHintQ({heroes:'h',items:'i',skills:'s'}[SPL.cat]||null);
  $$('.targets [data-t]').forEach(b=>b.onclick=()=>{const t=+b.dataset.t;SPL.last={a:SPL.turn.from,b:t};SPL.turn={from:t,prev:SPL.turn.from};SPL.asks++;haptic('sel');sfx('sel');SPL.keepY=window.scrollY;renderSpyLocalPlay();});
  const tick=()=>{
    const c=$('#clock'),r=$('#ring');if(!c||!r)return;
    const left=SPL.endAt-Date.now();
    c.textContent=spyClock(left);r.style.setProperty('--p',Math.max(0,left/(SPL.min*60000)*100)+'%');
    if(left<=0&&!SPL.timeUp){SPL.timeUp=true;r.classList.add('over');haptic('warn');sfx('roshan');toast('Время вышло! Пора голосовать');}
  };
  if(SPYT)clearInterval(SPYT);SPYT=setInterval(tick,250);tick();
}
function renderSpyLocalVote(){
  screen='spyl';backBtn(true);
  mount(`
    <div class="page-head"><button class="icon-btn" id="bBtn" aria-label="Назад">${ui('back')}</button><h1 class="title">Кто шпион?</h1></div>
    <p class="lead">Обсудите и выберите одного игрока.</p>
    <div class="plist frame">${SPL.names.map((n,i)=>`<button class="prow" data-i="${i}"><span class="num">${i+1}</span><span class="n">${esc(n)}</span></button>`).join('')}</div>
    <div class="cta"><button class="btn dark" id="backPlay">Вернуться к игре</button></div>`,'spyscr');
  const back=()=>{sfx('tap');renderSpyLocalPlay();};
  $('#bBtn').onclick=back;$('#backPlay').onclick=back;
  $$('.prow').forEach(b=>b.onclick=()=>{
    const i=+b.dataset.i;
    spyLocalEnd(i===SPL.spy?'crew':'spy',i===SPL.spy?`${esc(SPL.names[i])} и правда шпион.`:`${esc(SPL.names[i])} был мирным.`);
  });
}
function renderSpyLocalGuess(){
  screen='spyl';backBtn(true);
  SPL.opts=SPL.opts||spyOptions(SPL.sec);
  mount(`
    <div class="page-head"><button class="icon-btn" id="bBtn" aria-label="Назад">${ui('back')}</button><h1 class="title">Шпион угадывает</h1></div>
    <p class="lead">Шпион, выбери, что было загадано. Угадаешь — победа твоя.</p>
    ${optsHTML(SPL.opts,SPL.sec.t,true)}
    <div class="cta"><button class="btn dark" id="backPlay">Это была ошибка, назад</button></div>`,'spyscr');
  const back=()=>{sfx('tap');renderSpyLocalPlay();};
  $('#bBtn').onclick=back;$('#backPlay').onclick=back;
  $$('.optc').forEach(b=>b.onclick=()=>{
    const o=SPL.opts[+b.dataset.i],ok=o[0]===SPL.sec.n;
    spyLocalEnd(ok?'spy':'crew',ok?`Шпион угадал: ${esc(o[0])}.`:`Шпион ошибся: назвал ${esc(o[0])}.`);
  });
}
function spyLocalEnd(win,why){
  stopSpyAll();screen='spyl';backBtn(true);
  mount(`
    <div class="end">
      <div class="result ${win==='crew'?'win':'lose'}"><div class="pic" style="background-image:url('${spyBg(SPL.sec)}')"></div><span class="side">Шпион</span><h1>${win==='crew'?'Шпиона поймали':'Шпион победил'}</h1><p>${why}</p></div>
      <div class="summary frame" style="margin-top:10px"><div><span>Шпион</span><b>${esc(SPL.names[SPL.spy])}</b></div><div><span>Было загадано</span><b>${esc(SPL.sec.n)}</b></div></div>
      <div class="end-actions"><button class="btn" id="again">Ещё раунд</button><button class="btn dark" id="menu">В меню шпиона</button></div>
    </div>`,'endscr');
  sfx(win==='crew'?'win':'lose');haptic(win==='crew'?'ok':'warn');
  store.spyRounds=(store.spyRounds||0)+1;save();setTimeout(checkAch,900);
  $('#again').onclick=startSpyLocal;
  $('#menu').onclick=()=>{sfx('tap');renderSpyHub();};
}

/* ---- по ссылке ---- */
async function spyCall(a,extra){
  if(!TG||!TG.initData)throw new Error('Онлайн-режим работает только внутри Telegram');
  let r;
  try{r=await fetch(API+'/api/spy',{method:'POST',headers:{'content-type':'application/json','x-init-data':TG.initData},body:JSON.stringify(Object.assign({a,code:SPO.code},extra||{}))});}
  catch(e){throw new Error('Нет связи с сервером');}
  let d=null;try{d=await r.json();}catch(e){}
  if(!d)throw new Error('Сервер не ответил');
  if(!d.ok)throw new Error(d.msg||'Ошибка');
  return d.v;
}
async function spyAct(a,extra){
  if(SPO.busy)return false;
  SPO.busy=true;
  try{const v=await spyCall(a,extra);spyApply(v,true);return true;}
  catch(e){toast(e.message);haptic('err');return false;}
  finally{SPO.busy=false;}
}
function spyApply(v,force){
  const prev=SPO.v;
  if(prev&&prev.code===v.code&&v.stamp<prev.stamp)return;
  SPO.v=v;SPO.code=v.code;
  if(prev&&prev.round!==v.round)SPO.reveal=false;
  if(prev&&prev.st!==v.st){
    if(v.st==='play'){haptic('heavy');sfx('whoosh');}
    if(v.st==='over'&&v.win&&v.role){const won=(v.win==='spy')===(v.role==='spy');sfx(won?'win':'lose');haptic(won?'ok':'warn');store.spyRounds=(store.spyRounds||0)+1;save();setTimeout(checkAch,900);}
  }
  if(prev&&v.st==='play'&&prev.asks!==v.asks){sfx('sel');if(v.turn&&v.turn.from===v.me)haptic('medium');}
  if(v.now)SPO.skew=v.now-Date.now();
  if(force||!prev||prev.stamp!==v.stamp||prev.st!==v.st)renderSpyOnline();
}
function startSpyPoll(){stopSpyPoll();SPO.poll=setInterval(()=>{if(document.hidden||SPO.busy||!SPO.code||screen!=='spyo')return;spyCall('state').then(v=>spyApply(v)).catch(()=>{});},2000);}
function stopSpyPoll(){if(SPO.poll){clearInterval(SPO.poll);SPO.poll=null;}}
function renderSpyOnlineSetup(){
  screen='spyset';backBtn(true);stopSpyAll();
  const p=spyPrefs();
  mount(`
    <div class="page-head"><button class="icon-btn" id="bBtn" aria-label="Назад">${ui('back')}</button><h1 class="title">По ссылке</h1></div>
    <p class="lead">Создай комнату и отправь ссылку друзьям. Каждый играет со своего телефона, а обсуждаете в чате или голосом.</p>
    <div class="opt"><span>Что загадываем</span>${segCtl('cat',SPY_CAT_OPTS,p.cat)}</div>
    <div class="opt"><span>Язык общения</span>${segCtl('lang',SPY_LANG_OPTS,p.lang)}</div>
    ${TG?'':'<p class="note">Онлайн-режим работает только внутри Telegram.</p>'}
    <div class="cta btns"><button class="btn" id="go" ${TG?'':'disabled'}>Создать комнату</button><button class="btn dark" id="bots" style="display:none">Тест с ботами (только для тебя)</button></div>`,'spyscr');
  $('#bBtn').onclick=()=>{sfx('tap');renderSpyHub();};
  if(TG&&TG.initData)spyCall('whoami').then(v=>{const b=$('#bots');if(v&&v.admin&&b&&screen==='spyset')b.style.display='';}).catch(()=>{});
  $('#bots').onclick=async()=>{
    haptic('medium');$('#bots').disabled=true;
    SPO={code:null,v:null,poll:null,busy:false,reveal:false};screen='spyo';
    if(await spyAct('create',{cat:p.cat,lang:p.lang,bots:true}))startSpyPoll();
    else{screen='spyset';const g=$('#bots');if(g)g.disabled=false;}
  };
  bindSeg('cat',v=>{p.cat=v;save();});bindSeg('lang',v=>{p.lang=v;save();});
  $('#go').onclick=async()=>{
    haptic('medium');$('#go').disabled=true;
    SPO={code:null,v:null,poll:null,busy:false,reveal:false};screen='spyo';
    if(await spyAct('create',{cat:p.cat,lang:p.lang}))startSpyPoll();
    else{screen='spyset';const g=$('#go');if(g)g.disabled=false;}
  };
}
async function spyJoin(code){
  stopSpyAll();
  SPO={code,v:null,poll:null,busy:false,reveal:false};screen='spyo';backBtn(true);
  mount(`<div class="empty frame" style="margin-top:40px"><b>Захожу в комнату ${esc(code)}</b>Секунду...</div>`,'spyscr');
  if(await spyAct('join')){startSpyPoll();return;}
  screen='spyerr';
  mount(`<div class="empty frame" style="margin-top:40px"><b>Не получилось зайти в комнату ${esc(code)}</b>Попроси друга прислать ссылку ещё раз или создай свою комнату.</div>
    <div class="cta btns"><button class="btn" id="toSpy">Шпион</button><button class="btn dark" id="toHome">В меню</button></div>`,'spyscr');
  $('#toSpy').onclick=()=>{if(!store.onboarded){startOnboarding();return;}renderSpyHub();};
  $('#toHome').onclick=()=>{if(!store.onboarded){startOnboarding();return;}renderHome();};
}
function spyLeaveTo(where){
  const v=SPO.v;stopSpyAll();
  if(v&&(v.st==='lobby'||v.st==='over')&&v.inGame){spyCall('leave').catch(()=>{});}
  SPO={code:null,v:null,poll:null,busy:false,reveal:false};
  if(!store.onboarded){startOnboarding();return;}
  where==='home'?renderHome():renderSpyHub();
}
function renderSpyOnline(){
  if(screen!=='spyo'||!SPO.v)return;
  const v=SPO.v;backBtn(true);
  try{if(TG&&TG.enableClosingConfirmation)TG.enableClosingConfirmation();}catch(e){}
  if(v.kicked&&!v.inGame){stopSpyAll();mount(`<div class="page-head"><button class="icon-btn" id="bBtn">${ui('back')}</button><h1 class="title">Шпион</h1></div><div class="empty frame"><b>Тебя убрали из комнаты</b>Хозяин комнаты ${esc(v.host.n)} убрал тебя из игры. Вернуться по этой ссылке нельзя.</div><div class="cta"><button class="btn" id="kk">В меню</button></div>`,'spyscr');$('#bBtn').onclick=$('#kk').onclick=()=>renderTab('spy');return;}
  const head=`<div class="page-head"><button class="icon-btn" id="bBtn" aria-label="Назад">${ui('back')}</button><h1 class="title">Шпион</h1></div>`;
  const canKick=v.isHost&&(v.st==='lobby'||v.st==='over');
  const plist=clickable=>`<div class="plist frame">${v.pl.map(p=>`<${clickable?'button':'div'} class="prow" data-pid="${p.id}" aria-pressed="${v.myVote===p.id}"><span class="n">${esc(p.n)}${p.id===v.me?' (ты)':''}</span>${p.id===v.host.id?'<span class="tag">хозяин</span>':''}${p.pts?`<span class="pts">${p.pts} ${plural(p.pts,['очко','очка','очков'])}</span>`:''}${p.v!==undefined?`<span class="cnt">${p.v}</span>`:''}${canKick&&p.id!==v.me?`<span class="kick" data-kick="${p.id}" role="button" aria-label="Убрать">${ui('close')}</span>`:''}</${clickable?'button':'div'}>`).join('')}</div>`;
  const clockLeft=()=>v.endAt?v.endAt-(Date.now()+(SPO.skew||0)):0;
  const settings=v.isHost?`<div class="opt" style="margin-top:14px"><span>Что загадываем</span>${segCtl('ocat',SPY_CAT_OPTS,v.cat)}</div><div class="opt"><span>Язык общения</span>${segCtl('olang',SPY_LANG_OPTS,v.lang)}</div><div class="opt"><span>Время на обсуждение</span>${segCtl('omin',[['5','5 мин'],['8','8 мин'],['10','10 мин']],String(v.min||8))}</div>`:'';
  const rule=SPY_RULES[v.lang]?`<br>${SPY_RULES[v.lang]}`:'';
  const card=SPO.reveal&&v.role?`<div id="card">${roleCardHTML(v.role,v.sec,v.lang,true)}</div>`:cardBack('Нажми, чтобы посмотреть свою роль. Никому не показывай экран.',true);
  let html='';
  if(v.st==='closed'){
    html=`${head}<div class="empty frame"><b>Комната закрыта</b>Все вышли. Создай новую.</div>`;
  }else if(v.st==='lobby'){
    html=`${head}
      <div class="code frame"><small>Комната</small><b>${esc(v.code)}</b></div>
      <button class="btn dark" id="invite">Пригласить друзей</button>
      <h2 class="lbl" style="margin-top:16px">Игроки <span>${v.pl.length} из 12</span></h2>
      ${plist(false)}
      ${v.isHost?settings:`<p class="status">Загадываем: <b>${SPY_CATN[v.cat]}</b>. Язык: <b>${SPY_LANGN[v.lang]}</b>. Время: <b>${v.min||8} мин</b>.<br>Ждём, пока ${esc(v.host.n)} начнёт игру.</p>`}
      <div class="cta btns">${v.isHost?`<button class="btn" id="start" ${v.pl.length<3?'disabled':''}>${v.pl.length<3?'Нужно минимум 3 игрока':'Начать игру'}</button>`:''}<button class="btn dark" id="leave">Выйти из комнаты</button></div>`;
  }else if(v.st==='roles'&&v.inGame){
    html=`${head}
      <div class="phase frame"><b>Шаг 1 из 3. Посмотри свою роль</b><span>Никому не показывай экран. Когда запомнишь — нажми «Запомнил». Вопросы начнутся, когда роли посмотрят все.</span></div>
      ${v.seen?`<div class="waitbox frame"><b>Ты посмотрел роль</b><span>Ждём: ${v.waiting.map(esc).join(', ')}</span>${SPO.peek?roleCardHTML(v.role,v.sec,v.lang,true):''}<button class="linkbtn" id="peek">${SPO.peek?'Скрыть роль':'Подсмотреть свою роль ещё раз'}</button></div>`
        :(SPO.reveal?`<div id="card">${roleCardHTML(v.role,v.sec,v.lang,true)}</div>`:cardBack('Нажми, чтобы посмотреть свою роль',true))}
      <div class="cta btns">${!v.seen&&SPO.reveal?'<button class="btn" id="seen">Запомнил, скрыть</button>':''}${v.isHost&&v.seen?'<button class="btn dark" id="skip">Начать, не дожидаясь остальных</button>':''}</div>`;
  }else if(!v.inGame&&v.st!=='over'){
    html=`${head}<div class="empty frame"><b>Раунд уже идёт</b>Зайди по ссылке ещё раз, когда он закончится.</div>`;
  }else if(v.st==='play'){
    const tn=v.turn||{from:null,fromN:v.first||'',prev:null};
    const cl=clockLeft();
    html=`${head}
      <div class="phase frame"><b>Шаг 2 из 3. Вопросы по очереди</b><span>${tn.from===v.me?'Твой ход: выбери, кого спросить, и задай вопрос вслух или в чате.':`Сейчас спрашивает ${esc(tn.fromN)}. Отвечай, если спросят тебя.`} Если кого-то подозреваете — начните голосование.</span></div>
      ${v.endAt?`<div class="ring small${cl<=0?' over':''}" id="ring" style="--p:${Math.max(0,Math.min(100,cl/((v.min||8)*60000)*100))}%"><div><b id="clock">${spyClock(cl)}</b><small>на обсуждение</small></div></div>`:''}
      ${card}
      ${rule?`<p class="status">${rule.replace('<br>','')}</p>`:''}
      ${turnHTML({asks:v.asks||0,last:v.last,fromN:tn.fromN,fromId:tn.from,prev:tn.prev,canAsk:tn.from===v.me,players:v.pl,answering:tn.answering,cat:v.cat})}
      <div class="cta btns"><button class="btn" id="vopen">Начать голосование: кто шпион?</button>${v.role==='spy'?'<button class="btn red" id="gopen">Я шпион: назвать загаданное</button>':''}${v.isHost?'<button class="btn dark" id="end">Остановить раунд</button>':''}</div>`;
  }else if(v.st==='vote'){
    html=`${head}
      <div class="phase frame"><b>Шаг 3 из 3. Голосование</b><span>Нажми на того, кого считаешь шпионом. Голос можно поменять.</span></div>
      ${card}
      <h2 class="lbl" style="margin-top:14px">Кто шпион? <span>проголосовали ${v.voted} из ${v.pl.length}</span></h2>
      ${plist(true)}
      <p class="note">Голос можно поменять. Итог появится, когда проголосуют все${v.isHost?', или подведи его сам':''}.</p>
      <div class="cta btns">${v.role==='spy'?'<button class="btn red" id="gopen">Я шпион, угадаю</button>':''}${v.isHost?'<button class="btn dark" id="resolve">Подсчитать голоса сейчас</button>':''}</div>`;
  }else if(v.st==='guess'){
    const me=v.role==='spy';
    html=`${head}
      <p class="status">${me?'Выбери, что было загадано. Угадаешь — победа твоя.':`<b>${esc(v.spyName||'')}</b> раскрылся: он шпион. Сейчас он угадывает.`}</p>
      ${optsHTML(v.opts||[],v.optT||'h',me)}`;
  }else if(v.st==='over'){
    const title=!v.win?'Раунд остановлен':v.win==='spy'?'Шпион победил':'Шпиона поймали';
    const cls=!v.win||!v.role?'lose':((v.role==='spy')===(v.win==='spy')?'win':'lose');
    html=`<div class="end">
      <div class="result ${cls}"><div class="pic" style="background-image:url('${spyBg(v.sec)}')"></div><span class="side">Раунд ${v.round}</span><h1>${title}</h1><p>${esc(v.why)}</p></div>
      <div class="summary frame" style="margin-top:10px"><div><span>Шпион</span><b>${esc(v.spyName||'?')}</b></div><div><span>Было загадано</span><b>${v.sec?esc(v.sec.n):'?'}</b></div></div>
      <h2 class="lbl" style="margin-top:16px">Счёт <span>мирные +1 за пойманного шпиона, шпион +2 за победу</span></h2>
      ${plist(false)}
      ${settings}
      <div class="end-actions">${v.isHost?`<button class="btn" id="start" ${v.pl.length<3?'disabled':''}>Ещё раунд</button>`:`<p class="status">Ждём, пока ${esc(v.host.n)} начнёт новый раунд.</p>`}
        <div class="btns two"><button class="btn dark" id="invite">Позвать друзей</button><button class="btn dark" id="leave">Выйти</button></div></div>
    </div>`;
  }
  const sameSt=SPO.lastSt===v.st,y=window.scrollY;
  mount(html,'spyscr'+(v.st==='over'?'':' hasbar'));
  if(sameSt)window.scrollTo(0,y);
  SPO.lastSt=v.st;
  const on=(id,fn)=>{const el=$(id);if(el)el.onclick=fn;};
  on('#seen',()=>{haptic('medium');SPO.reveal=false;spyAct('seen');});
  on('#skip',()=>{sfx('tap');spyAct('skip');});
  on('#peek',()=>{SPO.peek=!SPO.peek;renderSpyOnline();});
  on('#bBtn',()=>{sfx('tap');spyLeaveTo('hub');});
  on('#leave',()=>{sfx('tap');spyLeaveTo('hub');});
  on('#invite',()=>{haptic('medium');shareLink(`${APP_LINK}?startapp=spy_${v.code}`,`Го в «Шпиона» по Доте! Комната ${v.code}`);});
  on('#start',()=>{haptic('medium');spyAct('start');});
  on('#vopen',()=>{haptic('medium');spyAct('vote_open');});
  on('#resolve',()=>{haptic('medium');spyAct('resolve');});
  on('#end',()=>{sfx('tap');spyAct('end');});
  on('#gopen',()=>{haptic('heavy');spyAct('guess_open');});
  on('#card',()=>{SPO.reveal=!SPO.reveal;haptic('medium');sfx('sel');renderSpyOnline();});
  if(v.isHost){bindSeg('ocat',x=>spyAct('set',{cat:x}));bindSeg('olang',x=>spyAct('set',{lang:x}));bindSeg('omin',x=>spyAct('set',{min:+x}));}
  $$('[data-kick]').forEach(b=>b.onclick=e=>{e.stopPropagation();const p=v.pl.find(x=>x.id===+b.dataset.kick);if(p)tgConfirm(`Убрать ${p.n} из комнаты?`,()=>{haptic('medium');spyAct('kick',{t:p.id});});});
  if(SPYT){clearInterval(SPYT);SPYT=null;}
  if(v.st==='play'&&v.endAt){let warned=false;SPYT=setInterval(()=>{const c=$('#clock'),r=$('#ring');if(!c||screen!=='spyo'){clearInterval(SPYT);SPYT=null;return;}const l=clockLeft();c.textContent=spyClock(l);if(r){r.style.setProperty('--p',Math.max(0,Math.min(100,l/((v.min||8)*60000)*100))+'%');if(l<=0&&!r.classList.contains('over')){r.classList.add('over');if(!warned){warned=true;sfx('roshan');haptic('heavy');toast('Время вышло. Пора голосовать!');}}}},500);}
  if(v.st==='vote')$$('.prow[data-pid]').forEach(b=>b.onclick=()=>{haptic('sel');spyAct('vote',{t:+b.dataset.pid});});
  if(v.st==='play'&&$('#spDone'))$('#spDone').onclick=()=>{haptic('medium');sfx('sel');spyAct('done');};
  if(v.st==='play'){$$('.targets [data-t]').forEach(b=>b.onclick=()=>{haptic('sel');spyAct('ask',{t:+b.dataset.t});});on('#qhint',()=>spyHintQ({heroes:'h',items:'i',skills:'s'}[v.cat]||null));}
  if(v.st==='guess'&&v.role==='spy')$$('.optc').forEach(b=>b.onclick=()=>{haptic('heavy');spyAct('guess',{p:+b.dataset.i});});
}

/* ================= турнир недели ================= */
let TOUR=null;
async function tourCall(a,extra){
  if(!TG||!TG.initData)throw new Error('Турнир работает только внутри Telegram');
  let r;
  try{r=await fetch(API+'/api/tour',{method:'POST',headers:{'content-type':'application/json','x-init-data':TG.initData},body:JSON.stringify(Object.assign({a},extra||{}))});}
  catch(e){throw new Error('Нет связи с сервером');}
  let d=null;try{d=await r.json();}catch(e){}
  if(!d)throw new Error('Сервер не ответил');
  if(!d.ok){const er=new Error(d.msg||'Ошибка');er.resync=!!d.resync;throw er;}
  return d.v;
}
const fmtLeft=ms=>{const h=Math.max(0,Math.floor(ms/36e5)),d=Math.floor(h/24);return d?`${d} д ${h%24} ч`:`${h} ч`;};
function tourExit(){stopTourTimer();if(!store.onboarded){startOnboarding();return;}renderHome();}
async function renderTour(L){
  stopSpyAll();stopTourTimer();screen='tour';backBtn(true);
  L=L||store.tourLang||store.langs[0]||'en';store.tourLang=L;
  const head=`<div class="page-head"><button class="icon-btn" id="bBtn" aria-label="Назад">${ui('back')}</button><h1 class="title">Турнир недели</h1></div>`;
  mount(`${head}<div class="empty frame">Загружаю таблицу...</div>`,'tourscr');
  $('#bBtn').onclick=tourExit;
  let v;
  try{v=await tourCall('info',{lang:L});}
  catch(e){
    if(screen!=='tour')return;
    mount(`${head}<div class="empty frame"><b>Турнир сейчас недоступен</b>${esc(e.message)}</div>`,'tourscr');
    $('#bBtn').onclick=tourExit;return;
  }
  if(screen!=='tour')return;
  const m=v.mine;
  const mine=m.st==='done'?`<p class="status">Твой результат: <b>${m.score}/${v.n}</b> за ${Math.round(m.ms/1000)} с, место <b>${m.place}</b></p>`:m.st==='play'?'<p class="status">Ты начал попытку и не закончил. Время на вопрос уже идёт.</p>':'';
  const rows=v.top.length?v.top.map((x,i)=>`<div class="brow${x.me?' me':''}"><span class="pl">${i+1}</span><span class="nm">${esc(x.n)}</span><span class="sc">${x.s}/${v.n}</span><span class="tm">${Math.round(x.ms/1000)} с</span></div>`).join(''):'<div class="empty">Пока никто не сыграл. Будь первым.</div>';
  mount(`${head}
    <div class="prize frame">${iconHTML({svg:'trophy'})}<span><b>${v.prize?esc(v.prize):'Приз объявит организатор'}</b><small>Приз приходит чеком @CryptoBot в личку от бота. До конца недели: ${fmtLeft(v.endsAt-Date.now())}</small></span></div>
    ${segCtl('tl',[['en','English'],['de','Deutsch']],L)}
    <div class="rules frame" style="margin-top:10px"><h3>Правила</h3><ol>
      <li>${v.n} вопросов, ${v.sec} секунд на каждый. Одна попытка в неделю на каждый язык.</li>
      <li>Ответы проверяет сервер. Больше правильных — выше место. При равенстве выше тот, кто ответил быстрее.</li>
      <li>Участие бесплатное. Итоги в понедельник, победителям бот пишет в личку.</li>
    </ol></div>
    ${mine}
    ${v.lastTop&&v.lastTop.length?`<div class="lastw card"><small>Победители прошлой недели</small>${v.lastTop.map((x,i)=>`<span><b>${['1','2','3'][i]}</b> ${esc(x.n)} <em>${x.s}/${v.n}</em></span>`).join('')}</div>`:''}
    <h2 class="lbl" style="margin-top:16px">Таблица лидеров</h2>
    <div class="board frame">${rows}</div>
    <div class="cta">${m.st==='done'?'<button class="btn dark" id="back2">В меню</button>':`<button class="btn" id="go">${m.st==='play'?'Продолжить попытку':'Начать попытку'}</button>`}</div>`,'tourscr');
  $('#bBtn').onclick=tourExit;
  bindSeg('tl',x=>{save();renderTour(x);});
  if($('#back2'))$('#back2').onclick=tourExit;
  if($('#go'))$('#go').onclick=()=>{
    $('#go').disabled=true;haptic('medium');
    const begin=async()=>{
      try{const r=await tourCall('start',{lang:L});TOUR={L,q:r.q,left:r.left,score:r.score,res:[],busy:false};sfx('whoosh');renderTourQ();}
      catch(e){toast(e.message);if(screen!=='tour')renderTour(L);else{const g=$('#go');if(g)g.disabled=false;}}
    };
    if(m.st==='none')countdown(begin);else begin();
  };
}
function stopTourTimer(){if(TOUR&&TOUR.tInt){clearInterval(TOUR.tInt);TOUR.tInt=null;}}
function renderTourQ(){
  screen='tourq';backBtn(true);stopTourTimer();
  const q=TOUR.q,sec=TOUR.left!=null?TOUR.left:q.sec;TOUR.left=null;TOUR.busy=false;
  const segs=Array.from({length:q.n},(_,i)=>`<i class="seg${i<q.i?(TOUR.res[i]===false?' bad':TOUR.res[i]?' ok':' cur'):i===q.i?' cur':''}"></i>`).join('');
  const one=q.o.some(x=>x.length>18);
  mount(`
    <div class="qhud">
      <button class="icon-btn" id="xBtn" aria-label="Выйти">${ui('close')}</button>
      <div class="segs">${segs}</div>
      <span class="gold">${q.i+1}/${q.n}</span>
    </div>
    <div class="mana" id="mana"><i id="tbar"></i><b id="tnum">${sec}</b></div>
    <div class="qwrap">
      <article class="tip">
        <header class="tip-h"><div class="slot-wrap" id="slotWrap">${iconHTML({svg:'trophy'},'big')}</div>
          <div class="tt"><div class="kind">${langBadge(TOUR.L)} Турнир недели</div><h1 class="qtitle">${esc(q.word)}</h1></div></header>
        <div class="tip-b"><p class="ask">${esc(q.ask)}</p></div>
      </article>
      <div class="tiles${one?' one':''}">${q.o.map((o,i)=>`<button class="tile" data-i="${i}">${esc(o)}</button>`).join('')}</div>
    </div>`,'quiz');
  $('#xBtn').onclick=()=>{toast('Попытка продолжится, но время на вопрос идёт');renderTour(TOUR.L);};
  $$('.tile').forEach(b=>b.onclick=()=>tourAnswer(+b.dataset.i,b));
  const bar=$('#tbar'),end=Date.now()+sec*1000;
  bar.style.transition='none';bar.style.transform=`scaleX(${sec/q.sec})`;void bar.offsetWidth;
  bar.style.transition=`transform ${sec}s linear`;bar.style.transform='scaleX(0)';
  TOUR.tInt=setInterval(()=>{
    const left=end-Date.now(),s=Math.max(0,Math.ceil(left/1000)),n=$('#tnum');
    if(n&&n.textContent!==String(s))n.textContent=s;
    if(left<=5000){const m=$('#mana');if(m)m.classList.add('low');}
    if(left<=0){stopTourTimer();tourAnswer(-1,null);}
  },150);
}
async function tourAnswer(p,btn){
  if(!TOUR||TOUR.busy)return;
  TOUR.busy=true;stopTourTimer();
  $$('.tile').forEach(t=>t.disabled=true);haptic('light');
  let r;
  try{r=await tourCall('answer',{lang:TOUR.L,i:TOUR.q.i,p});}
  catch(e){
    if(e.resync){try{const s=await tourCall('start',{lang:TOUR.L});TOUR.q=s.q;TOUR.left=s.left;renderTourQ();return;}catch(x){}}
    toast(e.message);TOUR.busy=false;$$('.tile').forEach(t=>t.disabled=false);return;
  }
  TOUR.res[TOUR.q.i]=r.right;
  $$('.tile').forEach(t=>{const i=+t.dataset.i;if(i===r.c)t.classList.add('right');else if(t===btn)t.classList.add('wrong');else t.classList.add('dim');});
  if(r.right){sfx('good');haptic('ok');burstAt($('#slotWrap .slot'),12);}else{sfx('bad');haptic('err');if(btn)restart(btn,'shake');}
  if(r.late)toast('Время вышло');
  setTimeout(()=>{if(r.done)renderTourDone(r);else{TOUR.q=r.next;renderTourQ();}},r.right?800:1400);
}
function renderTourDone(r){
  screen='tourdone';backBtn(true);stopTourTimer();
  const win=r.score>=7;
  mount(`
    <div class="end">
      <div class="result ${win?'win':'lose'}"><div class="pic" style="background-image:url('${portrait(heroFor().hero)}')"></div><span class="side">Турнир недели</span><h1>Попытка засчитана</h1><p>Место в таблице сейчас: ${r.place}. Итоги в понедельник.</p></div>
      <div class="summary frame" style="margin-top:10px"><div><span>Правильных</span><b>${r.score} из ${TOUR.q.n}</b></div><div><span>Время</span><b>${Math.round(r.ms/1000)} с</b></div><div><span>Место сейчас</span><b>${r.place}</b></div></div>
      <p class="note">Если займёшь призовое место, бот пришлёт чек в личку. Для этого у тебя должен быть запущен бот: открой его и нажми «Старт».</p>
      <div class="end-actions"><button class="btn" id="board">Таблица лидеров</button><div class="btns two"><button class="btn dark" id="shareT">Поделиться</button><button class="btn dark" id="homeBtn">В меню</button></div></div>
    </div>`,'endscr');
  sfx(win?'win':'lose');if(win)setTimeout(()=>burstAt($('.result h1'),30),200);
  store.tourPlayed=(store.tourPlayed||0)+1;save();setTimeout(checkAch,1500);
  $('#board').onclick=()=>renderTour(TOUR.L);
  $('#shareT').onclick=()=>{haptic('medium');shareLink(`${APP_LINK}?startapp=tour`,`Я набрал ${r.score} из ${TOUR.q.n} в турнире недели по Доте (${TOUR.L==='de'?'немецкий':'английский'}). Сможешь больше?`);};
  $('#homeBtn').onclick=tourExit;
}

/* ================= кино: сцены из сериалов и фильмов ================= */
// Видео и картинки сцен лежат в хранилище по ключам scenes/<сцена>/<NN>.mp4|jpg и scenes/<сцена>/cover.jpg.
// Базовый адрес задаётся в index.html (window.ASSET_BASE): GitHub Pages сейчас, Cloudflare R2 или любое S3 потом.
const ASSET_BASE=(window.ASSET_BASE||window.SC_MEDIA||'https://1f8t8graf4-ai.github.io/scenes').replace(/\/$/,'');
function assetUrl(key){const k=String(key||'');return /^https?:\/\//i.test(k)?k:ASSET_BASE+'/'+k;}
const scCover=(s,file='cover.jpg')=>s&&s.coverUrl?assetUrl(s.coverUrl):assetUrl(scKey(s,file));
const scKey=(s,file)=>`scenes/${s.id}/${file}`;
const scEpKey=(s,i,ext)=>scKey(s,String(i+1).padStart(2,'0')+'.'+ext);
const SCENES=window.__DATA.SCENES;
SCENES.forEach(s=>s.parts.forEach((p,i)=>p.ph.forEach((f,j)=>{f.id=i+'_'+j;f.pi=i;f.sid=s.id;})));
const SC_DAYS=[1,3,7,21,60];
// повторение сразу по всем сценам: сколько фраз пора повторить и где
const scDueAll=()=>SCENES.map(s=>({s,n:scDue(s).length})).filter(x=>x.n>0).sort((a,b)=>b.n-a.n);
let REVCHAIN=false;
function startRevChain(){const L=scDueAll();if(!L.length){toast('Сегодня повторять нечего');return;}sfx('tap');REVCHAIN=true;renderScQuiz(L[0].s.id,'rev');}
const scMine=()=>SCENES.flatMap(s=>{const P=scP(s.id);return s.parts.flatMap(p=>p.ph).filter(f=>!f.passive&&(P.m[f.id]||0)>0||P.r[f.id]).map(f=>({s,f,st:P.r[f.id]?P.r[f.id][0]:-1,m:P.m[f.id]||0}));});
const scStLabel=x=>x.st>=3?['надолго','ok']:x.st>=1?['закрепляю','mid']:['учу','new'];
// звук фразы прямо из фильма: берём кусок эпизода (тот же mp4) с её начала до конца
let SCLIP=null;
function scClip(id,fid,btn,onEnd){const s=scOf(id);if(!s)return;let pi=-1,f=null;s.parts.forEach((p,i)=>p.ph.forEach(x=>{if(x.id===fid){pi=i;f=x;}}));if(!f)return;
  const p=s.parts[pi],src=assetUrl(scEpKey(s,pi,'mp4')),st=Math.max(0,f.a-p.a-0.08),en=f.b-p.a+0.12;
  if(!SCLIP){SCLIP=document.createElement('video');SCLIP.playsInline=true;SCLIP.setAttribute('playsinline','');SCLIP.preload='auto';SCLIP.style.display='none';document.body.appendChild(SCLIP);}
  clearInterval(SCLIP._t);$$('.sc-say.on').forEach(x=>x.classList.remove('on'));if(btn)btn.classList.add('on');
  if(SCLIP.dataset.src!==src){SCLIP.src=src;SCLIP.dataset.src=src;}
  const go=()=>{const start=()=>{const pr=SCLIP.play();if(pr&&pr.catch)pr.catch(()=>{});
      SCLIP._t=setInterval(()=>{if(SCLIP.currentTime>=en||SCLIP.ended){SCLIP.pause();clearInterval(SCLIP._t);if(btn)btn.classList.remove('on');if(onEnd)onEnd();}},30);};
    SCLIP.pause();if(Math.abs(SCLIP.currentTime-st)<0.03){start();return;}SCLIP.addEventListener('seeked',start,{once:true});try{SCLIP.currentTime=st;}catch(e){start();}};
  if(SCLIP.readyState>=1)go();else{SCLIP.addEventListener('loadedmetadata',go,{once:true});SCLIP.load();}
  haptic('sel');}
// «Шаблон» — рабочая конструкция без сюжета фильма (берётся из начала пояснения: «X — «Y»»)
function scPattern(f){if(scL()==='de'&&!scIsDe())return null;const m=/^([^—«]{2,60}?) — «([^»]{2,60})»/.exec(f.note||'');if(!m)return null;return [m[1].replace(/\.$/,''),m[2]];}
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
const APP_V='12.8.1';
async function deployCheck(box){
  const head=u=>fetch(u,{method:'HEAD',cache:'no-store'}).then(r=>({ok:r.ok,len:+(r.headers.get('content-length')||0)})).catch(()=>({ok:false,len:0}));
  const rows=[];const add=(ok,name,hint)=>{rows.push({ok,name,hint});draw();};
  const draw=()=>{const bad=rows.filter(r=>!r.ok).length;box.innerHTML=`<div class="dk-sum ${bad?'bad':'ok'}">${bad?`Не хватает: ${bad}`:'Всё на месте ✅'} · проверено ${rows.length}</div>`+rows.map(r=>`<div class="dk-r ${r.ok?'ok':'bad'}"><b>${r.ok?'✅':'❌'}</b><span>${esc(r.name)}${!r.ok&&r.hint?`<small>${esc(r.hint)}</small>`:''}</span></div>`).join('');};
  box.innerHTML='<div class="dk-sum">Проверяю…</div>';
  add(true,`Код приложения: версия ${APP_V}`,'');
  let r=await head('data/topics.json');add(r.ok,'data/topics.json — темы фраз','Загрузи из архива папку data в корень основного репо');
  r=await head('img/bateman.png');add(r.ok&&r.len<400000,'img/bateman.png — маскот',r.ok?'Лежит старая картинка (прямоугольное фото). Замени файлом из архива':'Загрузи папку img в корень основного репо');
  r=await head('js/mascot/mascot-engine.js');add(r.ok,'js/mascot/mascot-engine.js','Загрузи папку js в корень основного репо');
  for(const s of SCENES.filter(x=>x.kind!=='clip')){
    const miss=[];for(let i=0;i<s.parts.length;i++){const nn=String(i+1).padStart(2,'0'),x=await head(assetUrl(scEpKey(s,i,'mp4')));if(!x.ok)miss.push(nn+'.mp4');const k=await head(assetUrl(scKey(s,nn+'-k.jpg')));if(!k.ok)miss.push(nn+'-k.jpg (кадр-награда)');}
    const cv=await head(assetUrl(scKey(s,'cover.jpg')));if(!cv.ok)miss.push('cover.jpg');
    const m=(s.music||[])[0];if(m){const x=await head(assetUrl(scKey(s,m.f)));if(!x.ok)miss.push(m.f);}
    add(!miss.length,`Сцена «${s.title}» · ${s.sub||s.id}`,miss.length?`Нет в репо scenes, папка ${s.id}/: ${miss.join(', ')}`:'');}
}
/* ================= 7.9.3: слова вместо зубрёжки фраз (пилот: Волк, эпизод 1) ================= */
// Данные — data/scenewords.json: по сцене и эпизоду ключевые слова [слово, перевод, по-немецки, формы] и словарик остальных слов.
// В субтитрах любое слово нажимается: перевод слова (или, если его нет в словарике, перевод всей реплики).
const SCW=(window.__DATA&&window.__DATA.SCENEWORDS)||{};
const swData=(sid,pi)=>(SCW[sid]&&SCW[sid][String(pi)])||null;
const swNorm=w=>String(w||'').toLowerCase().replace(/[’`]/g,"'").replace(/^[^a-zäöüß']+|[^a-zäöüß'.]+$/g,'').replace(/\.$/,'');
// 8.6: общий словарь всех слов всех сцен (data/glossary.json) — перевод есть у каждого слова в субтитрах
const GLOSS=(window.__DATA&&window.__DATA.GLOSS_EN)||{},GLOSS_DE=(window.__DATA&&window.__DATA.GLOSS_DE)||{};
function swFind(sid,pi,tok){const d=swData(sid,pi),n=swNorm(tok),s0=scOf(sid);
  if(!d){const G=s0&&s0.lang==='de'?GLOSS_DE:GLOSS,b=n.replace(/'s$/,''),v=G[n]||G[b]||G[n.replace(/'/g,'')];return v?{w:n,ru:v,key:false}:null;}
  for(const k of d.key){if(k[3].includes(n)||k[0]===n)return {w:k[0],ru:k[1],de:k[2],key:true};}
  const g=d.gloss||{};const base=n.replace(/'s$/,'');const G=s0&&s0.lang==='de'?GLOSS_DE:GLOSS;const v=g[n]||g[base]||g[n.replace(/s$/,'')]||G[n]||G[base]||G[n.replace(/'/g,'')];return v?{w:n,ru:v,key:false}:null;}
const swKeysIn=(sid,pi,text)=>{const d=swData(sid,pi);if(!d)return [];const toks=String(text||'').split(/\s+/).map(swNorm);return d.key.filter(k=>k[3].some(f=>toks.includes(f)));};
// субтитры: оригинальная строка — словами, на которые можно нажать
const swWrap=txt=>String(txt||'').split(/([A-Za-zÄÖÜäöüß'’]+)/).map((x,k)=>k%2?`<i class="sw">${esc(x)}</i>`:esc(x)).join('');
function swPop(word,row,inPh){if(!SW||!SCUR)return;const s=scOf(SCUR.id),pi=SCUR.i||0,hit=swFind(s.id,pi,word),pf=inPh&&phIdiom(SW._rowPh)?SW._rowPh:null;
  if(SV&&!SV.paused)SV.pause();const o=SW.querySelector('.sc-wpop');if(o)o.remove();
  const w=document.createElement('div');w.className='sc-wpop';
  w.innerHTML=hit?`${hit.key?'<span class="k">★ слово эпизода</span>':''}<b>${esc(swNorm(word))}</b><span class="t">${esc(hit.ru)}</span>${hit.de?`<small>по-немецки: ${esc(hit.de)}</small>`:''}`
    :`<b>${esc(swNorm(word))}</b>${pf?'':`<small>Этого слова нет в словарике. Вся реплика:</small><span class="t">${esc(row&&row[3]||'')}</span>`}`;
  if(pf)w.innerHTML+=phBlock(pf);
  w.innerHTML+=`<div class="hn-b"><button data-x="go">Дальше ${SI.play}</button>${mywBtn(s.id,word)}</div>`;
  w.onclick=e=>{e.stopPropagation();const b=e.target.closest('[data-x]');if(!b)return;
    if(b.dataset.x==='save'){const on=mywToggle(s.id,pi,word,row,hit);b.classList.toggle('on',on);b.textContent=on?'★ В моих словах':'☆ В мои слова';return;}
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
  const id=phIdiom(f);const mark=s=>swWrap(s).replace(/<i class="sw">([^<]+)<\/i>/g,(m,w)=>idHit(id,w)?`<i class="sw in-ph">${w}</i>`:m);
  if(i<0)return phNorm(ph).includes(phNorm(txt))?mark(txt):swWrap(txt);
  return swWrap(txt.slice(0,i))+mark(txt.slice(i,i+ph.length))+swWrap(txt.slice(i+ph.length));}
// идиома фразы — из начала пояснения: «Fuck + кто-то — «похуй на…»» → слова {fuck}, смысл «похуй на…»
function phIdiom(f){if(!f)return null;const m=/^([^—«]{2,70}?) — «([^»]{2,90})»/.exec(f.note||'');if(!m)return null;
  const words=(m[1].toLowerCase().match(/[a-zäöüß']+/g)||[]).filter(w=>w.length>1);return words.length?{head:m[1].trim(),mean:m[2].trim(),words}:null;}
const idHit=(id,tok)=>{if(!id)return false;const n=swNorm(tok);return id.words.some(w=>n===w||(n.startsWith(w)&&/^(s|es|ed|d|ing|in'|in|'s|'d|n't)$/.test(n.slice(w.length))));};
function phBlock(f){const id=phIdiom(f);if(!id)return '';return `<div class="wp-ph"><span class="k">Это слово тут — часть выражения</span><b>${esc(id.head)}</b><span class="t">${esc(id.mean)}</span><small>В реплике: «${esc(scT(f))}» — ${esc(f.ru)}</small></div>`;}
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
const kwCardHTML=k=>`<span class="kwp-k">Важное слово</span><b class="kwp-w">${esc(k[1]||k[0])}</b><span class="kwp-t">${esc(k[2]||'')}</span>
  ${k[5]?`<div class="kwp-use"><em>Когда применяется</em><span>${esc(k[5])}</span></div>`:''}
  ${k[3]?`<div class="kwp-ex"><em>Пример</em><b>${esc(k[3])}</b>${k[4]?`<small>${esc(k[4])}</small>`:''}</div>`:''}`;
let KWP=null,KWT=0;
function kwHide(ms){clearTimeout(KWT);KWT=setTimeout(()=>{if(KWP){KWP.classList.remove('on','pin');document.body.classList.remove('kw-open');}$$('.kw.on,.sw.on').forEach(x=>x.classList.remove('on'));},ms||0);}
function kwPop(){if(KWP)return KWP;const dim=document.createElement('div');dim.className='kw-dim';document.body.appendChild(dim);
  KWP=document.createElement('div');KWP.className='kw-pop';KWP.setAttribute('role','dialog');document.body.appendChild(KWP);
  KWP.addEventListener('mouseenter',()=>clearTimeout(KWT));
  KWP.addEventListener('mouseleave',()=>{if(!KWP.classList.contains('pin'))kwHide(220);});
  KWP.addEventListener('click',e=>{e.stopPropagation();const b=e.target.closest('[data-x]');if(!b)return;
    if(b.dataset.x==='save'&&KWP._sv){const v=KWP._sv,s0=scOf(v.sid),f0=v.f,p0=s0&&f0?s0.parts[f0.pi]:null;
      const row=s0&&p0?(s0.subs.find(r=>r[0]>=p0.a-0.3&&r[0]<p0.b&&phNorm(r[s0.lang==='de'?4:2]).includes(phNorm(v.word)))||[f0.a,f0.b,f0.en,f0.ru,f0.de]):null;
      const on=mywToggle(v.sid,f0?f0.pi||0:0,v.word,row,{ru:v.ru});b.classList.toggle('on',on);b.textContent=on?'★ В моих словах':'☆ В мои слова';return;}
    if(b.dataset.x==='hear'&&KWP._sv&&KWP._sv.f){const v=KWP._sv;scClip(v.sid,v.f.id,b);return;}
    if(b.dataset.x==='ok')kwHide(0);});
  document.addEventListener('click',e=>{if(KWP&&KWP.classList.contains('on')&&!e.target.closest('.kw-pop,.kw,.sw'))kwHide(0);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&KWP&&KWP.classList.contains('on'))kwHide(0);});
  window.addEventListener('scroll',()=>{if(KWP&&KWP.classList.contains('on')&&!KWP.classList.contains('sheet'))kwHide(0);},{passive:true});
  return KWP;}
// показать карточку рядом со словом (ПК) или снизу экрана (телефон)
function popAt(el,html,sv,pin){const P=kwPop();clearTimeout(KWT);P._sv=sv;
  P.innerHTML=html+`<div class="kwp-b">${sv&&sv.sid&&sv.ru?mywBtn(sv.sid,sv.word):''}${sv&&sv.f?`<button data-x="hear">▶ Фраза</button>`:''}<button data-x="ok">Понятно</button></div>`;
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
  haptic('sel');}
function kwShow(el,f,pin){const k=kwOf(f)[+el.dataset.kw];if(!k)return;popAt(el,kwCardHTML(k),{sid:f.sid||(SCUR&&SCUR.id),f,word:k[1]||k[0],ru:k[2]},pin);}
function wordShow(el,f,pin){const sid=(f&&f.sid)||(SCUR&&SCUR.id);if(!sid)return;const w=el.textContent,hit=swFind(sid,f?f.pi||0:0,w),id=f?phIdiom(f):null,inId=id&&idHit(id,w);
  const html=`<span class="kwp-k">Слово</span><b class="kwp-w">${esc(swNorm(w))}</b><span class="kwp-t">${hit?esc(hit.ru):'перевода нет в словарике'}</span>
    ${inId?`<div class="kwp-use"><em>Тут это часть выражения</em><span><b>${esc(id.head)}</b> — ${esc(id.mean)}</span></div>`:''}
    ${f?`<div class="kwp-ex"><em>Во фразе</em><b>${esc(scT(f))}</b><small>${esc(f.ru)}</small></div>`:''}`;
  popAt(el,html,{sid,f,word:swNorm(w),ru:hit?hit.ru:''},pin);}
// подключить слова в контейнере: f — фраза или функция (элемент → фраза)
function phBind(root,getF){if(!root)return;const fOf=el=>typeof getF==='function'?getF(el):getF,hov=matchMedia('(hover:hover)').matches;
  const open=(el,pin)=>{const f=fOf(el);if(!f)return;if(el.classList.contains('kw'))kwShow(el,f,pin);else wordShow(el,f,pin);};
  root.querySelectorAll('.kw,.sw').forEach(el=>{if(el._ph)return;el._ph=1;if(el.classList.contains('demo'))return;
    el.addEventListener('click',e=>{e.stopPropagation();e.preventDefault();open(el,true);});
    el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(el,true);}});
    if(hov){el.addEventListener('mouseenter',()=>{if(!(KWP&&KWP.classList.contains('pin')&&KWP.classList.contains('on')))open(el,false);});
      el.addEventListener('mouseleave',()=>{if(KWP&&!KWP.classList.contains('pin'))kwHide(260);});}});}
const kwBind=phBind;
// блоки «Когда применяется» и «Интересный факт». Факт показывается один раз за заход (не дублируется в повторах)
const FSEEN=new Set();
function phInfoHTML(f,o){o=o||{};const use=scNoteS(f),de=scL()==='de'&&!scIsDe();
  const ex=de?(f.exDe&&f.exDe[0]?[f.exDe[0][0],f.exDe[0][1]]:null):(f.lx&&f.lx[0]?f.lx:(f.ex&&f.ex[0]?[f.ex[0][0],f.ex[0][1]]:null));
  const fact=o.fact&&f.fact&&!de;   // 12.0: факты — награда за финал эпизода, по ходу не показываем
  return `${use?`<div class="ph-blk ph-use"><em>Когда применяется</em><p>${esc(use)}</p>${o.noEx||!ex?'':`<div class="ph-ex"><span>Например</span><b>${esc(ex[0])}</b><small>${esc(ex[1]||'')}</small></div>`}</div>`:''}
    ${fact?`<div class="ph-blk ph-fact"><em>Интересный факт</em><p>${esc(f.fact)}</p></div>`:''}`;}
// подсказка при наведении мышкой (ПК): без паузы, рядом со словом
function swTip(el){if(!SW)return;let tip=SW.querySelector('.sc-wtip');if(!tip){tip=document.createElement('div');tip.className='sc-wtip';SW.appendChild(tip);}
  const s=scOf(SCUR.id),hit=swFind(s.id,SCUR.i||0,el.textContent),f=el.classList.contains('in-ph')?SW._rowPh:null;
  const id=f?phIdiom(f):null;
  tip.innerHTML=`<b>${esc(swNorm(el.textContent))}</b>${hit?` — ${esc(hit.ru)}`:''}${id?`<span>тут часть выражения «${esc(id.head)}» — ${esc(id.mean)}</span>`:(!hit?'<span>нет в словарике — нажми, покажу перевод реплики</span>':'')}`;
  const r=el.getBoundingClientRect(),w=SW.getBoundingClientRect();tip.style.left=Math.max(6,Math.min(w.width-220,r.left-w.left-20))+'px';tip.style.top=Math.max(6,r.top-w.top-tip.offsetHeight-8)+'px';tip.classList.add('on');}
function linePop(el,row){const s=scOf(SCUR.id),pi=SCUR.i||0,word=el.textContent,hit=swFind(s.id,pi,word);
  let f=null;for(const p of s.parts)for(const x of p.ph){const id=phIdiom(x);if(id&&phNorm(row[2]).includes(phNorm(x.en))&&idHit(id,word))f=x;}
  const o=document.querySelector('.ln-pop');if(o)o.remove();const w=document.createElement('div');w.className='ln-pop';
  w.innerHTML=`<div class="lp-card">${hit&&hit.key?'<span class="k">★ слово эпизода</span>':''}<b>${esc(swNorm(word))}</b>${hit?`<span class="t">${esc(hit.ru)}</span>${hit.de?`<small>по-немецки: ${esc(hit.de)}</small>`:''}`:(f?'':`<small>Этого слова нет в словарике. Вся реплика: ${esc(row[3])}</small>`)}${f?phBlock(f):''}
    <div class="hn-b"><button data-x="hear">▶ Услышать</button>${mywBtn(s.id,word)}<button data-x="ok">Понятно</button></div></div>`;
  w.onclick=e=>{const b=e.target.closest('[data-x]');if(e.target===w||(b&&b.dataset.x==='ok')){w.remove();return;}
    if(b&&b.dataset.x==='save'){const on=mywToggle(s.id,pi,word,row,hit);b.classList.toggle('on',on);b.textContent=on?'★ В моих словах':'☆ В мои слова';return;}
    if(b&&b.dataset.x==='hear'){const p=s.parts[pi];w.remove();window.scrollTo({top:0,behavior:'smooth'});const ov=$('#scvo');if(ov)ov.style.display='none';scPlay(row[0]-p.a-0.1,row[1]-p.a+0.2,()=>{if(ov)ov.style.display='';});}};
  document.body.appendChild(w);haptic('sel');}
function lineWords(s,p){const rows=s.subs.filter(r=>r[0]>=p.a-0.3&&r[0]<p.b);
  $$('.sc-lines .ln').forEach(ln=>{const row=rows[+ln.dataset.k];if(!row)return;
    ln.onclick=e=>{const w=e.target.closest('.sw');if(!w)return;linePop(w,row);};
    if(matchMedia('(hover:hover)').matches)ln.onmouseover=e=>{const w=e.target.closest('.sw');if(!w)return;const hit=swFind(s.id,SCUR.i||0,w.textContent);
      let tip=document.querySelector('.ln-tip');if(!tip){tip=document.createElement('div');tip.className='ln-tip';document.body.appendChild(tip);}
      tip.innerHTML=`<b>${esc(swNorm(w.textContent))}</b>${hit?` — ${esc(hit.ru)}`:' — нажми, покажу'}`;const r=w.getBoundingClientRect();tip.style.left=Math.max(6,r.left)+'px';tip.style.top=Math.max(6,r.top-36)+'px';tip.classList.add('on');
      w.onmouseleave=()=>tip.classList.remove('on');};});}
// блок «Слова эпизода» на экране эпизода
function swBlock(s,pi,p){const d=swData(s.id,pi);if(!d)return '';const rows=s.subs.filter(r=>r[0]>=p.a-0.2&&r[0]<p.b);const st=(store.scw&&store.scw[s.id])||{};
  const card=k=>{const r=rows.find(x=>k[3].some(f=>(s.lang==='de'?x[4]:x[2]).toLowerCase().split(/[^a-zäöüß']+/).includes(f)));
    const line=r?esc(s.lang==='de'?r[4]:r[2]).replace(new RegExp('\\b('+k[3].map(x=>x.replace(/[.*+?^${}()|[\]\\']/g,'\\$&')).join('|')+')\\b','i'),'<mark>$1</mark>'):'';
    const lv=st[k[0]]||0;return `<div class="sw-card${lv>=2?' ok':''}"><div class="sw-h"><b>${esc(k[0])}</b><span>${esc(k[1])}</span>${lv>=2?'<em>✓</em>':''}</div>
      ${k[2]?`<small class="sw-de">по-немецки: ${esc(k[2])}</small>`:''}${line?`<div class="sw-line">${line}</div>`:''}${r?`<button class="sw-play" data-a="${r[0]-p.a}" data-b="${r[1]-p.a}">▶ услышать в сцене</button>`:''}</div>`;};
  const known=d.key.filter(k=>(st[k[0]]||0)>=2).length;
  return `<div class="sc-sec"><h2>Слова эпизода</h2><span>${known} / ${d.key.length}</span></div>
    <p class="sw-tip">Тапни любое слово в субтитрах — увидишь перевод. Эти ${d.key.length} — главные, их и проверим.</p>
    <div class="sw-list">${d.key.map(card).join('')}</div><button class="sc-btn" id="swq">Проверить слова →</button>`;}
// тест по словам: пары, «что значит слово», «какое слово прозвучало», «вставь слово» — коротко, 8 заданий
function renderWordQuiz(id,pi){const s=scOf(id),p=s.parts[pi],d=swData(id,pi);if(!d)return;SCUR={id,i:pi};
  const rows=s.subs.filter(r=>r[0]>=p.a-0.2&&r[0]<p.b),K=d.key.map(k=>({w:k[0],ru:k[1],de:k[2],f:k[3],row:rows.find(x=>k[3].some(f=>(s.lang==='de'?x[4]:x[2]).toLowerCase().split(/[^a-zäöüß']+/).includes(f)))}));
  const withRow=shuffle(K.filter(k=>k.row));const Q=[{t:'pairs',set:shuffle(K).slice(0,4)}];
  withRow.slice(0,3).forEach(k=>Q.push({t:'mean',k}));withRow.slice(3,5).forEach(k=>Q.push({t:'hear',k}));withRow.slice(5,7).forEach(k=>Q.push({t:'gap',k}));Q.push({t:'pairs',set:shuffle(K).slice(0,4)});
  let n=0,ok=0;const res={};store.scw=store.scw||{};store.scw[id]=store.scw[id]||{};
  const mark=(k,good)=>{res[k.w]=res[k.w]===false?false:good;const st=store.scw[id];st[k.w]=good?Math.min(3,(st[k.w]||0)+1):Math.max(0,(st[k.w]||0)-1);save();};
  const opts=(k,field)=>shuffle([k[field],...shuffle(K.filter(x=>x.w!==k.w)).slice(0,3).map(x=>x[field])]);
  const hl=(k)=>esc(s.lang==='de'?k.row[4]:k.row[2]).replace(new RegExp('\\b('+k.f.map(x=>x.replace(/[.*+?^${}()|[\]\\']/g,'\\$&')).join('|')+')\\b','i'),'<mark>$1</mark>');
  const gapL=(k)=>esc(s.lang==='de'?k.row[4]:k.row[2]).replace(new RegExp('\\b('+k.f.map(x=>x.replace(/[.*+?^${}()|[\]\\']/g,'\\$&')).join('|')+')\\b','i'),'<span class="sw-gap">_____</span>');
  const play=(k,btn)=>playSeg(assetUrl(scEpKey(s,pi,'mp4')),k.row[0]-p.a-0.15,k.row[1]-p.a+0.2,btn);
  function next(){n++;if(n>=Q.length)return end();show();}
  function show(){const q=Q[n],seg=Q.map((_,j)=>`<i class="${j<n?'done':j===n?'cur':''}"></i>`).join('');let body='';
    if(q.t==='pairs'){body=`<div class="sc-meta">Соедини пары</div><h2>Слово → перевод</h2><div class="sw-pairs"><div>${shuffle(q.set).map(k=>`<button data-l="${esc(k.w)}">${esc(k.w)}</button>`).join('')}</div><div>${shuffle(q.set).map(k=>`<button data-r="${esc(k.w)}">${esc(k.ru)}</button>`).join('')}</div></div>`;}
    if(q.t==='mean'){body=`<div class="sc-meta">Что значит слово?</div><h2>${hl(q.k)}</h2><div class="sc-opts">${opts(q.k,'ru').map(v=>`<button class="sc-opt" data-v="${esc(v)}">${esc(v)}</button>`).join('')}</div>`;}
    if(q.t==='hear'){body=`<div class="sc-meta">Послушай реплику</div><h2><button class="sc-hearbtn" id="swh">${SI.vol||'🔊'} Послушать ещё раз</button><br><small class="qsm">Какое слово ты услышал?</small></h2><div class="sc-opts">${opts(q.k,'w').map(v=>`<button class="sc-opt" data-v="${esc(v)}">${esc(v)}</button>`).join('')}</div>`;}
    if(q.t==='gap'){body=`<div class="sc-meta">Вставь слово</div><h2>${gapL(q.k)}</h2><p class="qsm">${esc(q.k.row[3])}</p><div class="sc-opts">${opts(q.k,'w').map(v=>`<button class="sc-opt" data-v="${esc(v)}">${esc(v)}</button>`).join('')}</div>`;}
    scMount(s,`<div class="sc-head"><button class="icon-btn" id="swx" aria-label="Закрыть">${ui('close')}</button><div class="sc-segs">${seg}</div></div><div class="sc-q sc-card">${body}<div id="swfb"></div></div>`,'scnscr');
    $('#swx').onclick=()=>{sfx('tap');renderScEp(id,pi);};
    if(q.t==='hear'){const hb=$('#swh');hb.onclick=()=>play(q.k,hb);setTimeout(()=>play(q.k,hb),300);}
    if(q.t==='pairs'){let sel=null,left=q.set.length;$$('.sw-pairs [data-l]').forEach(b=>b.onclick=()=>{$$('.sw-pairs [data-l]').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');sel=b;sfx('tap');});
      $$('.sw-pairs [data-r]').forEach(b=>b.onclick=()=>{if(!sel)return;const k=K.find(x=>x.w===sel.dataset.l),good=b.dataset.r===sel.dataset.l;mark(k,good);
        if(good){sfx('good');sel.classList.add('ok');b.classList.add('ok');sel.disabled=b.disabled=true;sel=null;left--;if(left===0){ok++;setTimeout(next,450);}}
        else{sfx('bad');b.classList.add('bad');setTimeout(()=>b.classList.remove('bad'),400);}});}
    else $$('.sc-opt').forEach(b=>b.onclick=()=>{const good=b.dataset.v===(q.t==='mean'?q.k.ru:q.k.w);mark(q.k,good);if(good)ok++;sfx(good?'good':'bad');try{gavReact(good);}catch(e){}
      $$('.sc-opt').forEach(x=>{x.disabled=true;if(x.dataset.v===(q.t==='mean'?q.k.ru:q.k.w))x.classList.add('ok');});if(!good)b.classList.add('bad');
      $('#swfb').innerHTML=`<div class="sc-fb ${good?'ok':'bad'}"><div class="t">${good?'Верно':'Неверно'}</div><div class="en">${esc(q.k.w)} — ${esc(q.k.ru)}</div><div class="orig">${esc(q.k.row?q.k.row[2]:'')}</div><button class="sc-btn" id="swn">Дальше →</button></div>`;
      $('#swn').onclick=()=>{sfx('tap');next();};});}
  function end(){ev('word_quiz',id);const L=K.filter(k=>k.w in res);const good=L.filter(k=>res[k.w]).length;sfx(good===L.length?'win':'learn');
    scMount(s,`<div class="sc-q sc-card" style="text-align:center"><div class="sc-meta">Слова эпизода</div><div class="sc-big">${good} / ${L.length}</div><p class="sc-sub">${good===L.length?'Все слова верно. Они вернутся в повторении.':'Ошибки — не страшно: эти слова вернутся ещё раз.'}</p>
      <div class="sw-res">${L.map(k=>`<div class="${res[k.w]?'ok':'bad'}"><b>${esc(k.w)}</b><span>${esc(k.ru)}</span></div>`).join('')}</div>
      <button class="sc-btn" id="swa">Ещё раз</button><button class="sc-btn ghost" id="swb">К эпизоду</button></div>`,'scnscr');
    $('#swa').onclick=()=>renderWordQuiz(id,pi);$('#swb').onclick=()=>renderScEp(id,pi);}
  show();}
// кусок эпизода звуком (для «какое слово прозвучало»)
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
  const s=scOf(sid),p=s&&s.parts[pi];store.myw[k]={k,w,ru:hit?hit.ru:'',de:hit&&hit.de||'',sid,pi,line:row?row[2]:'',lineRu:row?row[3]:'',a:row&&p?row[0]:0,at:Date.now(),lvl:0,st:0,due:Date.now()+36e5};
  save();toast('⭐ Сохранил в «Мои слова»');haptic('ok');return true;}
const mywBtn=(sid,w)=>`<button data-x="save" class="myw-save${mywHas(sid,w)?' on':''}">${mywHas(sid,w)?'★ В моих словах':'☆ В мои слова'}</button>`;
function renderMyWordsOld(){screen='myw';backBtn(true);const L=mywAll(),ok=L.filter(x=>x.ru);
  const hl=(line,w)=>esc(line).replace(new RegExp('\\b('+w.replace(/[.*+?^${}()|[\]\\']/g,'\\$&')+')\\b','i'),'<mark>$1</mark>');
  mount(`<div class="page-head"><button class="icon-btn" id="bBtn" aria-label="Назад">${ui('back')}</button><h1 class="title">Мои слова</h1></div>
    <p class="lead" style="margin:2px 0 12px">${L.length?`${L.length} ${plural(L.length,['слово','слова','слов'])} — сохранены прямо из фильмов.`:'Пока пусто. В эпизоде нажми на незнакомое слово в субтитрах → «☆ В мои слова».'}</p>
    ${ok.length>=4?`<button class="btn myw-train" id="mwT">Потренировать ${ok.length>=8?'8':ok.length} слов →</button>`:L.length?`<p class="myw-need">Для тренировки нужно хотя бы 4 слова с переводом.</p>`:''}
    <div class="myw-list">${L.map(x=>{const s=scOf(x.sid);return `<div class="myw-it anim"><div class="myw-h"><b>${esc(x.w)}</b>${x.ru?`<span>${esc(x.ru)}</span>`:''}<button class="myw-del" data-k="${esc(x.k)}" aria-label="Убрать">${ui('close')}</button></div>
      ${x.de?`<small>по-немецки: ${esc(x.de)}</small>`:''}${x.line?`<div class="myw-line">${hl(x.line,x.w)}</div><div class="myw-lru">${esc(x.lineRu)}</div>`:''}
      ${s?`<button class="myw-go" data-s="${x.sid}" data-i="${x.pi}" data-a="${x.a}">▶ ${esc(s.title)} · эп. ${x.pi+1}</button>`:''}</div>`;}).join('')}</div>`,'mywscr');
  $('#bBtn').onclick=()=>{sfx('tap');renderTab('learn');};
  if($('#mwT'))$('#mwT').onclick=()=>{sfx('tap');renderMyWordsQuiz();};
  $$('.myw-del').forEach(b=>b.onclick=()=>{mywDel(b.dataset.k);save();sfx('tap');renderMyWords();});
  $$('.myw-go').forEach(b=>b.onclick=()=>{sfx('tap');const x=store.myw[b.closest('.myw-it').querySelector('.myw-del').dataset.k];momOpen(b.dataset.s,+b.dataset.i,+b.dataset.a,x&&x.w);});}
function renderMyWordsQuiz(list){const K=shuffle((list||mywAll()).filter(x=>x.ru)).slice(0,8);if(!K.length){toast('Нет слов с переводом');renderMyWords();return;}
  const Q=[...(K.length>=4?[{t:'pairs',set:K.slice(0,4)}]:[]),...K.map(k=>({t:'mean',k})),...(K.length>=8?[{t:'pairs',set:K.slice(4,8)}]:[])];let n=0,ok=0;
  // 11.5: ложные варианты — из моих слов, а если их мало — из общего словаря
  const opts=k=>{const o=shuffle(mywAll().filter(x=>x.ru&&x.ru!==k.ru)).slice(0,3).map(x=>x.ru);const G=Object.values(GLOSS).filter(v=>!/груб|мат/.test(v));while(o.length<3&&G.length){const v=G[Math.floor(Math.random()*G.length)];if(v&&v!==k.ru&&!o.includes(v))o.push(v);}return shuffle([k.ru,...o]);};
  const next=()=>{n++;n>=Q.length?end():show();};
  function show(){const q=Q[n],seg=Q.map((_,j)=>`<i class="${j<n?'done':j===n?'cur':''}"></i>`).join('');let body='';
    if(q.t==='pairs')body=`<div class="sc-meta">Соедини пары</div><h2>Слово → перевод</h2><div class="sw-pairs"><div>${shuffle(q.set).map(k=>`<button data-l="${esc(k.k)}">${esc(k.w)}</button>`).join('')}</div><div>${shuffle(q.set).map(k=>`<button data-r="${esc(k.k)}">${esc(k.ru)}</button>`).join('')}</div></div>`;
    else body=`<div class="sc-meta">Что значит слово?</div><h2>${esc(q.k.w)}${q.k.line?`<br><small class="qsm">${esc(q.k.line)}</small>`:''}</h2><div class="sc-opts">${opts(q.k).map(v=>`<button class="sc-opt" data-v="${esc(v)}">${esc(v)}</button>`).join('')}</div>`;
    mount(`<div class="scn noir"><div class="sc-head"><button class="icon-btn" id="mqx" aria-label="Закрыть">${ui('close')}</button><div class="sc-segs">${seg}</div></div><div class="sc-q sc-card">${body}<div id="mqfb"></div></div></div>`,'scnscr');
    $('#mqx').onclick=()=>{sfx('tap');renderMyWords();};
    if(q.t==='pairs'){let sel=null,left=q.set.length;$$('.sw-pairs [data-l]').forEach(b=>b.onclick=()=>{$$('.sw-pairs [data-l]').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');sel=b;sfx('tap');});
      $$('.sw-pairs [data-r]').forEach(b=>b.onclick=()=>{if(!sel)return;const good=b.dataset.r===sel.dataset.l;
        if(good){sfx('good');sel.classList.add('ok');b.classList.add('ok');sel.disabled=b.disabled=true;sel=null;if(--left===0){ok++;setTimeout(next,450);}}else{sfx('bad');b.classList.add('bad');setTimeout(()=>b.classList.remove('bad'),400);}});}
    else $$('.sc-opt').forEach(b=>b.onclick=()=>{const good=b.dataset.v===q.k.ru;if(good)ok++;sfx(good?'good':'bad');const it=store.myw[q.k.k];if(it){wSRS(it,good);save();}
      $$('.sc-opt').forEach(x=>{x.disabled=true;if(x.dataset.v===q.k.ru)x.classList.add('ok');});if(!good)b.classList.add('bad');
      $('#mqfb').innerHTML=`<div class="sc-fb ${good?'ok':'bad'}"><div class="t">${good?'Верно':'Неверно'}</div><div class="en">${esc(q.k.w)} — ${esc(q.k.ru)}</div>${q.k.lineRu?`<div class="orig">${esc(q.k.lineRu)}</div>`:''}<button class="sc-btn" id="mqn">Дальше →</button></div>`;$('#mqn').onclick=()=>{sfx('tap');next();};});}
  function end(){sfx(ok===Q.length?'win':'learn');mount(`<div class="scn noir"><div class="sc-q sc-card sc-result" style="text-align:center"><div class="sc-meta">Мои слова</div><div class="sc-big">${ok} / ${Q.length}</div>
      <p class="sc-sub">${ok===Q.length?'Все верно. Сохраняй новые слова прямо из фильмов.':'Ошибки — нормально: повтори ещё раз через пару часов.'}</p><div class="sc-btns"><button class="sc-btn" id="mqa">Ещё раз</button><button class="sc-btn ghost" id="mqb">К моим словам</button></div></div></div>`,'scnscr');
    $('#mqa').onclick=()=>renderMyWordsQuiz(list);$('#mqb').onclick=()=>renderMyWords();}
  show();}
/* =====================================================================================
   8.5 — ЯДРО ОБУЧЕНИЯ: одна ежедневная очередь + диктант по репликам из фильма
   Всё, что пора повторить (фразы из сцен и «Мои слова»), — в одном месте, по 10 минут в день.
   Главное задание — ВСПОМНИТЬ, а не узнать: диктант (послушай и напиши), «вспомни по-английски», карточка слова.
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
const dailyCount=()=>dailyItems().length;
// нормализация для диктанта: регистр, пунктуация, кавычки, частые сокращения не важны
const dNorm=s=>String(s||'').toLowerCase().replace(/[’`´]/g,"'").replace(/\b(gonna)\b/g,'going to').replace(/\b(wanna)\b/g,'want to').replace(/\b(gotta)\b/g,'got to')
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
function renderDaily(){const L=dailyItems();
  if(!L.length){mount(`<div class="page-head"><button class="icon-btn" id="bBtn" aria-label="Назад">${ui('back')}</button><h1 class="title">Повторение</h1></div>
    <div class="dl-empty card anim"><div class="dl-ic">✅</div><b>На сегодня всё повторено</b><span>Фразы из сцен и твои слова вернутся, когда придёт их время. Можно посмотреть новый эпизод или сохранить новые слова.</span>
    <button class="btn" id="dlGo">Новый эпизод →</button></div>`,'dlscr');$('#bBtn').onclick=()=>{sfx('tap');renderTab('learn');};
    $('#dlGo').onclick=()=>{const c=continueScene();renderScEp(c.s.id,c.i);};return;}
  const Q=L.map((x,j)=>({...x,t:x.k==='w'?'card':(j%2===0&&dNorm(scT(x.f)).split(' ').length<=12?'dict':'recall')}));let n=0,ok=0;const res=[];
  const next=()=>{n++;n>=Q.length?end():show();};
  function frame(meta,body){const seg=Q.map((_,j)=>`<i class="${j<n?'done':j===n?'cur':''}"></i>`).join('');
    mount(`<div class="scn noir"><div class="sc-head"><button class="icon-btn" id="dlx" aria-label="Закрыть">${ui('close')}</button><div class="sc-segs">${seg}</div></div>
      <div class="sc-q sc-card dl-q"><div class="sc-meta">${meta}</div>${body}<div id="dlfb"></div></div></div>`,'scnscr');
    $('#dlx').onclick=()=>{sfx('tap');renderTab('learn');};}
  function grade(q,good,html){if(q.k==='ph')phSRS(q.s,q.f,good);else wSRS(q.it,good);res.push({q,good});if(good)ok++;weekAdd();
    if(!good&&!q.re)Q.splice(Math.min(Q.length,n+4),0,{...q,re:true,t:q.k==='w'?'card':'recall'});
    sfx(good?'good':'bad');haptic(good?'ok':'err');
    $('#dlfb').innerHTML=`<div class="sc-fb ${good?'ok':'bad'}">${html}<button class="sc-btn" id="dln">Дальше →</button></div>`;$('#dln').onclick=()=>{sfx('tap');next();};}
  function show(){const q=Q[n];
    if(q.t==='dict'){const f=q.f,tgt=q.s.lang==='de'?f.de:scT(f);
      frame('Диктант · послушай и напиши',`<h2><button class="sc-hearbtn" id="dlh">${SI.vol||'🔊'} Ещё раз</button><button class="sc-hearbtn ghost" id="dls">🐢 Медленно</button><br><small class="qsm">Из «${esc(q.s.title)}». Напиши, что услышал — опечатки и знаки не важны.</small></h2>
        <textarea id="dlin" rows="2" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Пиши здесь…"></textarea>
        <div class="dl-b"><button class="sc-btn ghost" id="dlhint">Подсказка</button><button class="sc-btn" id="dlchk">Проверить</button></div>`);
      const hb=$('#dlh'),play=(rate)=>{scClip(q.s.id,f.id,hb);if(SCLIP)SCLIP.playbackRate=rate||1;};hb.onclick=()=>play(1);$('#dls').onclick=()=>play(.75);setTimeout(()=>play(1),300);
      let hint=0;$('#dlhint').onclick=()=>{hint++;const w=tgt.split(/\s+/);$('#dlin').placeholder=w.map((x,j)=>j<hint*2?x:x.replace(/[A-Za-zÄÖÜäöüß]/g,'·')).join(' ');sfx('tap');};
      $('#dlchk').onclick=()=>{const v=$('#dlin').value;if(!v.trim()){$('#dlin').focus();return;}const r=dCheck(v,tgt),good=r.score>=.85&&!hint;$('#dlchk').disabled=true;
        grade(q,good,`<div class="t">${good?'Верно — услышал':r.score>=.6?'Почти':'Послушай ещё раз'} · ${Math.round(r.score*100)}%</div><div class="en d-diff">${dDiffHTML(tgt,r.okB)}</div><div class="ru">${esc(f.ru)}</div>`);};
      setTimeout(()=>{const i=$('#dlin');if(i)i.focus();},400);return;}
    if(q.t==='recall'){const f=q.f,tgt=q.s.lang==='de'?f.de:scT(f);
      frame('Вспомни по-'+(q.s.lang==='de'||scL()==='de'?'немецки':'английски'),`<h2>${esc(f.ru)}<br><small class="qsm">Скажи вслух или про себя, потом проверь. Из «${esc(q.s.title)}».</small></h2>
        <div class="dl-hide" id="dlans"><b>${esc(tgt)}</b>${scNoteS(f)?`<small>${esc(scShort(scNoteS(f)))}</small>`:''}</div>
        <button class="sc-btn" id="dlshow">Показать ответ</button><div class="dl-b" id="dlgr" hidden><button class="sc-btn ghost" id="dlno">Не вспомнил</button><button class="sc-btn" id="dlyes">Вспомнил</button></div>`);
      $('#dlshow').onclick=()=>{$('#dlans').classList.add('on');$('#dlshow').hidden=true;$('#dlgr').hidden=false;scClip(q.s.id,f.id,null);sfx('tap');};
      $('#dlyes').onclick=()=>{$('#dlgr').hidden=true;grade(q,true,`<div class="t">Отлично</div><div class="en">${esc(tgt)}</div><div class="ru">${esc(f.ru)}</div>`);};
      $('#dlno').onclick=()=>{$('#dlgr').hidden=true;grade(q,false,`<div class="t">Ничего — вернётся через пару заданий</div><div class="en">${esc(tgt)}</div><div class="ru">${esc(f.ru)}</div>`);};return;}
    const it=q.it,s=scOf(it.sid),hl=it.line?esc(it.line).replace(new RegExp('\\b('+it.w.replace(/[.*+?^${}()|[\]\\']/g,'\\$&')+')\\b','i'),'<mark>$1</mark>'):'';
    frame('Моё слово · вспомни перевод',`<h2>${esc(it.w)}${hl?`<br><small class="qsm">${hl}</small>`:''}</h2>
      <div class="dl-hide" id="dlans"><b>${esc(it.ru)}</b>${it.de?`<small>по-немецки: ${esc(it.de)}</small>`:''}${it.lineRu?`<small>${esc(it.lineRu)}</small>`:''}</div>
      <button class="sc-btn" id="dlshow">Показать перевод</button><div class="dl-b" id="dlgr" hidden><button class="sc-btn ghost" id="dlno">Не знал</button><button class="sc-btn" id="dlyes">Знал</button></div>
      ${s?`<button class="dl-mom" id="dlmom">▶ ${esc(s.title)} · эп. ${it.pi+1}</button>`:''}`);
    $('#dlshow').onclick=()=>{$('#dlans').classList.add('on');$('#dlshow').hidden=true;$('#dlgr').hidden=false;sfx('tap');};
    $('#dlyes').onclick=()=>{$('#dlgr').hidden=true;grade(q,true,`<div class="t">Отлично</div><div class="en">${esc(it.w)} — ${esc(it.ru)}</div>`);};
    $('#dlno').onclick=()=>{$('#dlgr').hidden=true;grade(q,false,`<div class="t">Вернётся ещё раз</div><div class="en">${esc(it.w)} — ${esc(it.ru)}</div>`);};
    if($('#dlmom'))$('#dlmom').onclick=()=>{sfx('tap');momOpen(it.sid,it.pi,it.a||0,it.w);};}
  function end(){remindSync(true);ev('review','daily');const good=res.filter(x=>x.good).length;sfx(good===res.length?'win':'learn');
    mount(`<div class="scn noir"><div class="sc-q sc-card sc-result" style="text-align:center"><div class="sc-meta">Повторение на сегодня</div><div class="sc-big">${good} / ${res.length}</div>
      <p class="sc-sub">${good===res.length?'Всё вспомнил. Следующая встреча — через несколько дней.':'Что не вспомнилось — вернётся завтра. Так и запоминается.'}</p>
      <div class="sc-btns"><button class="sc-btn" id="dlh2">На главную</button></div></div></div>`,'scnscr');$('#dlh2').onclick=()=>renderTab('learn');}
  show();}
/* ================= 8.2: фраза дня ================= */
function phraseOfDay(){const A=SCENES.filter(s=>s.kind!=='clip'&&flagOf('scene-'+s.id)==='on').flatMap(s=>s.parts.flatMap(p=>p.ph).filter(f=>!f.passive&&f.ex&&f.ex.length).map(f=>({s,f})));
  if(!A.length)return null;const day=Math.floor((Date.now()+36e5)/864e5);return A[(day*7919)%A.length];}
function phraseOfDayHTML(){const x=phraseOfDay();if(!x)return '';const {s,f}=x,de=scL()==='de'&&!scIsDe(),tg=scTag(f);
  return `<div class="pod card anim"><div class="pod-top"><span class="pod-k">✦ Фраза дня</span><span class="sc-tag ${tg[1]}">${tg[0]}</span></div>
    <b class="pod-en">${esc(s.lang==='de'?f.de:scT(f))}</b><span class="pod-ru">${esc(f.ru)}</span>
    ${f.ex&&f.ex[0]?`<small class="pod-ex">Пример: ${esc(de&&f.exDe?f.exDe[0][0]:de?f.ex[0][2]||f.ex[0][0]:f.ex[0][0])} — ${esc(de&&f.exDe?f.exDe[0][1]:f.ex[0][1])}</small>`:''}
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
 ['🗣','Субтитры и язык','Кнопка субтитров под видео: «Оригинал + перевод», «Только оригинал», «Без субтитров», и «Учу English / Учу Deutsch». ⤢ в полном экране — растянуть видео без чёрных полос.'],
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
const REG_NAME={rude:'Грубо',casual:'Разговорное',formal:'Официально',neutral:'Нейтрально'};
function dictAll(){return SCENES.filter(s=>s.kind!=='clip').flatMap(s=>{const P=scP(s.id);return s.parts.flatMap(p=>p.ph).filter(f=>!f.passive).map(f=>{const r=P.r[f.id];
  return {s,f,st:r?r[0]:(P.rDone&&P.rDone[f.id]?9:-1),seen:(P.m[f.id]||0)>0||!!r||!!(P.rDone&&P.rDone[f.id])};});});}
const dictSt=x=>x.st>=3?['надолго','ok']:x.st>=1?['закрепляю','mid']:x.seen?['учу','new']:['новая','none'];
function renderMyPhrases(){renderPhraseDict();}
function renderPhraseDict(opt){opt=opt||{};if(screen!=='dict')ev('dict');screen='dict';backBtn(true);const V=opt.scene?(store.dictVS||(store.dictVS={mine:false,topic:'',reg:''})):(store.dictV||(store.dictV={mine:false,topic:'',reg:''}));const de=scL()==='de';
  const ALL=dictAll().filter(x=>!opt.scene||x.s.id===opt.scene),L0=V.mine?ALL.filter(x=>x.seen):ALL;
  if(V.topic&&!L0.some(x=>fTopics(x.f).includes(V.topic)))V.topic='';if(V.reg&&!L0.some(x=>scTag(x.f)[1]===V.reg))V.reg='';
  const L=L0.filter(x=>(!V.topic||fTopics(x.f).includes(V.topic))&&(!V.reg||scTag(x.f)[1]===V.reg));
  const cntT=k=>L0.filter(x=>fTopics(x.f).includes(k)).length,ok=ALL.filter(x=>x.st>=3).length,mine=ALL.filter(x=>x.seen).length;
  const txt=x=>x.s.lang==='de'?x.f.de:scT(x.f);
  const card=x=>{const [l,c]=dictSt(x),tg=scTag(x.f);return `<div class="mp-it" data-q="${esc((x.f.en+' '+x.f.ru+' '+(x.f.de||'')).toLowerCase())}">
    <div class="mp-top"><b>${esc(txt(x))}</b><span class="mp-st ${c}">${l}</span></div><div class="mp-ru">${esc(x.f.ru)}</div>
    <div class="dc-tags">${fTopics(x.f).map(k=>`<span class="dc-t">${TOPIC_ICO[k]||''} ${k}</span>`).join('')}<span class="sc-tag ${tg[1]}">${tg[0]}</span></div>
    ${scNoteS(x.f)?`<div class="mp-n">${esc(scNoteS(x.f))}</div>`:''}
    <div class="mp-row"><button class="mp-go" data-s="${x.s.id}" data-i="${x.f.pi}">▶ ${esc(x.s.title)} · эп. ${x.f.pi+1}</button><button class="sc-say" data-s="${x.s.id}" data-clip="${x.f.id}" aria-label="Послушать из фильма">${SI.vol||'🔊'}</button></div></div>`;};
  const sc=opt.scene?scOf(opt.scene):null;
  mount(`<div class="page-head"><button class="icon-btn" id="bBtn" aria-label="Назад">${ui('back')}</button><h1 class="title">${sc?'Фразы сцены':'Словарь фраз'}</h1></div>
    ${sc?`<p class="lead" style="margin:0 0 12px">${esc(sc.title)}${sc.sub?' · '+esc(sc.sub):''} — ${ALL.length} ${plural(ALL.length,['фраза','фразы','фраз'])}${L.length!==ALL.length?`, показано ${L.length}`:''}. ▶ — открыть момент, 🔊 — услышать.</p>`:''}
    ${sc?'':`<div class="mp-sum"><div><b>${ALL.length}</b><span>всего</span></div><div><b>${mine}</b><span>мои</span></div><div><b>${ok}</b><span>надолго</span></div></div>`}
    <div class="sc-lang dc-mode"><button data-dm="0" class="${V.mine?'':'on'}">Все фразы</button><button data-dm="1" class="${V.mine?'on':''}">Только мои</button></div>
    <div class="dc-chips"><button data-tp="" class="${V.topic?'':'on'}">Все темы</button>${TOPICS_ALL.filter(k=>cntT(k)).map(k=>`<button data-tp="${k}" class="${V.topic===k?'on':''}">${TOPIC_ICO[k]} ${k} <i>${cntT(k)}</i></button>`).join('')}</div>
    <div class="dc-chips reg"><button data-rg="" class="${V.reg?'':'on'}">Любой тон</button>${Object.entries(REG_NAME).filter(([k])=>L0.some(x=>scTag(x.f)[1]===k)).map(([k,n])=>`<button data-rg="${k}" class="${V.reg===k?'on':''}">${n} <i>${L0.filter(x=>scTag(x.f)[1]===k).length}</i></button>`).join('')}</div>
    <input class="mp-q" id="mpq" placeholder="Поиск: слово или перевод">
    <div class="mp-list">${L.length?L.map(card).join(''):'<div class="mp-empty">Тут пусто. Сними фильтр или пройди пару эпизодов в Кинозале.</div>'}</div>`,'mpscr');
  $('#bBtn').onclick=()=>{sfx('tap');sc?renderScene(sc.id):renderTab('learn');};
  $$('[data-dm]').forEach(b=>b.onclick=()=>{V.mine=b.dataset.dm==='1';save();sfx('sel');renderPhraseDict(opt);});
  $$('[data-tp]').forEach(b=>b.onclick=()=>{V.topic=b.dataset.tp;save();sfx('sel');renderPhraseDict(opt);});
  $$('[data-rg]').forEach(b=>b.onclick=()=>{V.reg=b.dataset.rg;save();sfx('sel');renderPhraseDict(opt);});
  const q=$('#mpq');q.oninput=()=>{const v=q.value.trim().toLowerCase();$$('.mp-it').forEach(e=>e.style.display=!v||e.dataset.q.includes(v)?'':'none');};
  $$('.mp-go').forEach(b=>b.onclick=()=>{sfx('tap');renderScEp(b.dataset.s,+b.dataset.i);});
  $$('.mp-it .sc-say').forEach(b=>b.onclick=e=>{e.stopPropagation();scClip(b.dataset.s,b.dataset.clip,b);});}

// статистика: что делают в приложении (уходит в бота, ничего не ждёт и не мешает)
function ev(e,sid){try{if(!TG||!TG.initData)return;const src=typeof START==='string'&&/^src_/.test(START)?START:'';
  fetch(API+'/api/ev',{method:'POST',headers:{'content-type':'application/json','x-init-data':TG.initData},body:JSON.stringify({e,sid:sid||'',src}),keepalive:true}).catch(()=>{});}catch(x){}}
// 3 фразы, которые пора повторить раньше всех — их бот покажет прямо в напоминании
function remindTop(){try{const de=scL()==='de';return SCENES.flatMap(s=>{const P=scP(s.id);return s.parts.flatMap(p=>p.ph).filter(f=>P.r[f.id]).map(f=>({t:P.r[f.id][1],x:((s.lang==='de'||de)?f.de:f.en)+' — '+f.ru}));})
  .sort((a,b)=>a.t-b.t).slice(0,3).map(o=>o.x.replace(/\s+/g,' ').slice(0,80));}catch(e){return [];}}
async function remindSync(force){
  try{if(!TG||!TG.initData)return;if(store.remind===undefined){store.remind=true;save();}
    const now=Date.now(),all=SCENES.flatMap(s=>Object.values(scP(s.id).r||{}).map(x=>x[1])).filter(Boolean);
    const next=all.length?Math.max(now,Math.min(...all)):0,n=all.filter(x=>x<=Math.max(now,next)+12*36e5).length;
    const key=[store.remind?1:0,Math.round(next/36e5),n].join(':');if(!force&&store.remindLast===key)return;
    const r=await fetch(API+'/api/remind',{method:'POST',headers:{'content-type':'application/json','x-init-data':TG.initData},body:JSON.stringify({next,n,off:!store.remind,top:remindTop()})});
    const j=await r.json();if(j&&j.ok){store.remindLast=key;save();}
  }catch(e){}}
const scRevNext=id=>{if(!REVCHAIN)return '';const L=scDueAll().filter(x=>x.s.id!==id);return L.length?`<button class="sc-btn" id="scnrev">Дальше: ${esc(L[0].s.title)} · ${L[0].n} →</button>`:'<p class="sc-sub" style="margin-top:8px">На сегодня всё повторено 👌</p>';};
const scDue=s=>{const r=scP(s.id).r||{},now=Date.now();return s.parts.flatMap(p=>p.ph).filter(f=>r[f.id]&&r[f.id][1]<=now);};
const SCK='dota_sc_v1';
let SC={};try{SC=JSON.parse(localStorage.getItem(SCK))||{};}catch(e){SC={};}
try{for(const id in SC)scRelay(id,SC[id]);}catch(e){}
const scP=id=>{let p=SC[id];if(!p){p=SC[id]={done:[],m:{},w:{}};if(SC_RELAY[id])p.lv=SC_RELAY[id].v;}p.r=p.r||{};return p;};
function scSave(){const s=JSON.stringify(SC);try{localStorage.setItem(SCK,s);}catch(e){}if(CLOUD_OK)cloudSaveChunked(SCK,s);}
// 12.1: облачный прогресс сцен сливается в cloudSync() (вместе с store, M, RV)
const scFmt=s=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
// пассивные фразы (passive:true) — только для понимания: в тесты, повторение и счёт «выучено» не идут
const scAct=ph=>{const a=ph.filter(f=>!f.passive);return a.length>=2?a:ph;};
const scLearned=s=>s.parts.flatMap(p=>scAct(p.ph)).filter(f=>(scP(s.id).m[f.id]||0)>=3).length;
const scTotal=s=>s.parts.reduce((a,p)=>a+scAct(p.ph).length,0);
// «держится надолго»: прошла 3 шага повторения (7+ дней) или весь круг до конца
const scMastered=s=>{const P=scP(s.id);return s.parts.flatMap(p=>scAct(p.ph)).filter(f=>{const r=P.r[f.id];return r?r[0]>=3:(P.m[f.id]||0)>=3&&!!P.rDone&&P.rDone[f.id];}).length;};
const scMasterPct=s=>{const T=scTotal(s);return T?Math.round(scMastered(s)/T*100):0;};
let SCUR={id:null,i:0},SV=null,SW=null,SSTOP=null,SRATE=1,SSUBON=true,SRAF=0;
function scStop(){if(SV){try{SV.pause();SV.removeAttribute('src');SV.load();}catch(e){}}SV=null;SW=null;SSTOP=null;try{BG3D.pause(false);}catch(e){}delete document.body.dataset.scn;delete document.body.dataset.scr;try{kwHide(0);}catch(e){}scExitFull();scCloseSheet();}
// язык заданий в кино: из выбранных субтитров (есть Deutsch — задания по-немецки), иначе английский
const scIsDe=()=>{try{const s=SCUR&&SCUR.id&&scOf(SCUR.id);return !!(s&&s.lang==='de');}catch(e){return false;}};
// в немецкой сцене первая строка субтитров всегда немецкий оригинал, вторая — выбранный перевод
const scDeMode=m=>!scIsDe()||m==='off'||m==='ru'?m:(/ru/.test(m)?'de+ru':m==='en+de'?'de+en':'de');
const scL=()=>{if(scIsDe())return 'de';const v=store.scSub;if(['en+ru','en+de','de+ru','en','de','ru','off'].includes(v))return /de/.test(v)?'de':'en';return store.langs[0]==='de'?'de':'en';};
const scT=f=>scL()==='de'?f.de:f.en;
const scNoteS=f=>(scL()==='de'&&!scIsDe())?'':(f.use||f.tip||scShort(f.note));   // 9.1: «когда применяется» вместо старого пояснения                 // фраза на изучаемом языке
const scRowT=r=>scL()==='de'?r[4]:r[2];              // реплика на изучаемом языке
// субтитры: один язык — en (оригинал), de, ru или off
const SUB_MODES=['en+ru','en+de','de+ru','en','de','ru','off'];
// три режима: оригинал+перевод, только оригинал, без субтитров (язык — тот, что учишь)
function scSub(){let v=store.scSub,de=scL()==='de';if(SC_DIR)return de?'de':'en';   // 12.5: режиссёрская версия — только оригинал
if(!v||!store.scSubChosen)v='auto';if(v==='off')return 'off';
  if(v==='auto'){let w=false;try{const P=SCUR&&SCUR.id?scP(SCUR.id):null;w=!!(P&&(P.done.includes(SCUR.i)||P.w[SCUR.i]));}catch(e){}return de?(w?'de':'de+ru'):(w?'en':'en+ru');}if(!v||/\+/.test(v)||v==='ru')return de?'de+ru':'en+ru';return de?'de':'en';}
const SUB_NAMES={'en+ru':'English + русский','en+de':'English + Deutsch','de+ru':'Deutsch + русский',en:'Только English',de:'Только Deutsch',ru:'Только русский',off:'Без субтитров'};
const SUB_NOTE={'en+ru':'что говорят + перевод','en+de':'что говорят + немецкий','de+ru':'немецкий + подсказка','en':'как в оригинале','de':'немецкий перевод','ru':'русский перевод','off':'только звук'};
const SUB_SHORT={'en+ru':'EN·RU','en+de':'EN·DE','de+ru':'DE·RU',en:'EN',de:'DE',ru:'RU',off:'CC'};
const SUB_COL={en:2,ru:3,de:4};

// разделы кинозала: фильмы, сериалы, клипы. Сцены одного сериала (поле show) собираются в одну карточку.
const SC_KIND={film:'Фильм',series:'Сериал',clip:'Клип',interview:'Интервью'};
// 12.7: интервью — как фильмы: человек = «фильм» (поле show), куски интервью = сцены
const SC_CATS=[['all','Все'],['film','Фильмы'],['series','Сериалы'],['interview','Интервью'],['clip','Клипы']];
const scDots=n=>`<span class="sc-dots">${[1,2,3,4,5].map(i=>`<i class="${i<=n?'on':''}"></i>`).join('')}</span>`;
function scRateHTML(s){if(!s.lvl&&!s.use)return '';
  return `<div class="sc-rate">${s.lvl?`<div><span>Сложность на слух</span>${scDots(s.lvl)}<small>${esc(s.lvlWhy||'')}</small></div>`:''}${s.use?`<div><span>Польза в жизни</span>${scDots(s.use)}<small>${esc(s.useWhy||'')}</small></div>`:''}</div>`;}
function kinoCard(s){const L=scLearned(s),T=scTotal(s),d=scP(s.id).done.length;
  const lk=!scOpen(s);
  return `<button class="kposter ${s.theme} anim${scMasterPct(s)===100?' mastered':''}${lk?' locked':''}" data-sc="${s.id}">${lk?`<span class="kp-lock">🔒 ${ui('coin')} ${fmt(SC_PRICE(s))}</span>`:''}${s.lang==='de'?`<span class="kp-lang">${FLAG.de} на немецком</span>`:''}<span class="kp-img" style="background-image:url('${scCover(s,'cover.jpg')}')"></span><span class="kp-grad"></span>${musOf(s).length?'<span class="kp-mus" title="Есть саундтрек">♪</span>':''}
    <span class="kp-t"><em>${esc(s.ep)}</em><b>${esc(s.title)}</b><small>${s.parts.length} ${plural(s.parts.length,['эпизод','эпизода','эпизодов'])}${d?` · пройдено ${d}`:''}</small>
    ${s.lvl?`<span class="kp-rate"><i>сложность ${scDots(s.lvl)}</i><i>польза ${scDots(s.use||0)}</i></span>`:''}
    <span class="kp-bar"><i style="width:${Math.round(L/T*100)}%\"></i></span></span></button>`;}
function kinoTabHTML(){
  const de=scL()==='de',cat=store.kinoCat||'all';
  const cats=SC_CATS.filter(([k])=>k==='all'||SCENES.some(s=>(s.kind||'film')===k));
  const list=SCENES.filter(s=>cat==='all'||(s.kind||'film')===cat);
  // сериал с несколькими сценами — одна карточка, внутри список его сцен
  const shows={},cards=[];
  for(const s of list){if(s.show){if(!shows[s.show]){shows[s.show]=[];cards.push({show:s.show});}shows[s.show].push(s);}else cards.push({s});}
  const html=cards.map(c=>{if(c.s)return kinoCard(c.s);const L=shows[c.show];if(L.length===1)return kinoCard(L[0]);const s=L[0];
    return `<button class="kposter ${s.theme} show poster anim${L.every(x=>scMasterPct(x)===100)?' mastered':''}" data-show="${esc(c.show)}"><span class="kp-img" style="background-image:url('${scCover(s,'poster.jpg')}'),url('${scCover(s,'cover.jpg')}')"></span><span class="kp-grad"></span><span class="kp-t"><em>${SC_KIND[s.kind]||'Сцены'}</em><b>${esc(c.show)}</b><small>${L.length} ${plural(L.length,['сцена','сцены','сцен'])}</small></span></button>`;}).join('');
  return `<h1 class="title anim">Кинозал</h1>
    <p class="lead anim" style="margin:4px 0 12px">Смотришь сцену с субтитрами, разбираешь живые фразы, проверяешь себя.${de?' Задания — по-немецки.':''}</p>
    <button class="srch-pill anim" onclick="renderSearch()">${ui('search')}<span>Найти фразу, сцену или слово</span></button>
    ${cats.length>2?`<div class="kcats anim">${cats.map(([k,l])=>`<button data-cat="${k}" class="${cat===k?'on':''}">${l}</button>`).join('')}</div>`:''}
    <div class="kgrid">${html}</div>
    <div class="ksoon anim"><b>Скоро</b> новые сцены, серии и клипы</div>`;
}
function bindKino(){$$('[data-sc]').forEach(b=>b.onclick=()=>{haptic('medium');sfx('tap');renderScene(b.dataset.sc);});
  $$('[data-cat]').forEach(b=>b.onclick=()=>{sfx('sel');store.kinoCat=b.dataset.cat;save();renderTab('kino');});
  $$('[data-show]').forEach(b=>b.onclick=()=>{haptic('medium');renderShow(b.dataset.show);});}
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
  mount(`<div class="page-head"><button class="icon-btn" id="bBtn" aria-label="Назад">${ui('back')}</button><h1 class="title">${esc(name)}</h1></div>
    <section class="sh-hero ${S[0].theme}" style="--shp:url('${assetUrl(scKey(S[0],'poster.jpg'))}')"><span class="sh-poster"></span>
      <div class="sh-info"><em>${SC_KIND[S[0].kind]||'Сцены'} · ${S.length} ${plural(S.length,['сцена','сцены','сцен'])}</em>
        <b>${lr} из ${tt} фраз</b><span class="sh-bar"><i style="width:${pc}%"></i></span>
        ${nx?`<button class="sh-go" id="shGo">${scP(nx.id).done.length?'Продолжить':'Смотреть по порядку'} ${SI.play}</button><small>${esc(lab(nx))}</small>`:''}</div></section>
    ${groups.map(([h,G])=>`<h2 class="sh-season">${h}</h2><div class="kgrid">${G.map(s=>kinoCard({...s,title:lab(s)})).join('')}</div>`).join('')}`,'tabscr showscr');
  $('#bBtn').onclick=()=>{sfx('tap');renderTab('kino');};
  try{paintTabbar('kino');}catch(e){}
  if($('#shGo'))$('#shGo').onclick=()=>{haptic('medium');renderScene(nx.id);};
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
const scEpOpen=(s,i)=>ADM_OPEN()||scPilot(s)||i===0||scP(s.id).done.includes(i-1)||scP(s.id).done.includes(i);
const scBossOpen=s=>ADM_OPEN()||scPilot(s)||s.parts.every((p,i)=>scP(s.id).done.includes(i));
const starsHTML=n=>`<span class="stars3">${[1,2,3].map(k=>`<i class="${k<=n?'on':''}">★</i>`).join('')}</span>`;
function addGold(n){if(!n)return 0;store.gold=(store.gold||0)+n;save();if(n>0)setTimeout(()=>goldFX(n),350);return n;}
// 11.6: монеты — золотая плашка «+N» взлетает и улетает в счётчик в шапке (если он на экране), счётчик подпрыгивает
function goldFX(n){try{if(store.fx===false||!(n>0))return;const g=document.createElement('div');g.className='gfx';g.innerHTML=`+${fmt(n)} ${ui('coin')}`;document.body.appendChild(g);
  const W=innerWidth,H=innerHeight,x0=W/2-g.offsetWidth/2,y0=H*0.42;g.style.left=x0+'px';g.style.top=y0+'px';
  const t=document.querySelector('.thead .gold'),r=t&&t.getBoundingClientRect(),vis=!!(r&&r.width&&r.top>=0&&r.bottom<=H);
  const dx=vis?r.left+r.width/2-(x0+g.offsetWidth/2):0,dy=vis?r.top+r.height/2-(y0+g.offsetHeight/2):-140;
  g.animate([{transform:'translateY(14px) scale(.6)',opacity:0},{transform:'none',opacity:1,offset:.22},{transform:'translateY(-8px)',opacity:1,offset:.55},{transform:`translate(${dx}px,${dy}px) scale(.45)`,opacity:vis?.85:0}],{duration:1150,easing:'cubic-bezier(.5,0,.25,1)'}).onfinish=()=>{g.remove();
    if(vis){t.innerHTML=`${ui('coin')}${fmt(store.gold)}`;t.classList.remove('bump');void t.offsetWidth;t.classList.add('bump');}};}catch(e){}}
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
      <span class="pn-t"><b>Финал сцены</b><small>${bo?'Фразы всей сцены на слух, без субтитров'+(scPilot(s)?'':' · +150'):'Откроется, когда пройдёшь все эпизоды'}</small>${P.boss?starsHTML(P.boss):''}</span>${next<0&&!P.boss?'<span class="pn-go">Финал</span>':''}</button></div>`;}
function scPathBind(s){$$('.pn[data-i]').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(!scEpOpen(s,i)){haptic('err');toast(`Сначала пройди эпизод ${String(i).padStart(2,'0')}`);return;}sfx('tap');renderScEp(s.id,i);});
  const bb=$('#scBoss');if(bb)bb.onclick=()=>{if(!scBossOpen(s)){haptic('err');toast('Финал откроется, когда пройдёшь все эпизоды');return;}sfx('tap');scBossStart(s.id);};}
function scBossStart(id){const s=scOf(id),L=shuffle(s.parts.flatMap(p=>scAct(p.ph)).filter(f=>f.b>f.a)).slice(0,8);if(!L.length){toast('В этой сцене нет фраз');return;}renderScQuiz(id,{list:L,lesson:true,boss:true});}

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

/* ---------- задания прямо в видео ---------- */
// Видео встаёт сразу после ключевой фразы: «Что он сказал?» — та же фраза и варианты с одним подменённым словом
// (надо реально расслышать), либо выбор перевода. 12 секунд, потом видео идёт дальше само.
function scVQ(h){if(!SW||!SV)return;const f=h.f,beg=store.lvl!=='b',s=scOf(SCUR.id),all=s.parts.flatMap(p=>p.ph),P=scP(s.id);
  let ask,opts,right;const subsOn=scDeMode(scSub())!=='off',lv=!subsOn&&!scIsDe()?scListenOpts(f,all):null;
  const others=shuffle(all.filter(x=>x!==f&&x.use&&x.use!==f.use)).slice(0,beg?1:2);
  if(lv&&lv.length){ask='Что прозвучало? Выбери, что услышал';right=f.en;opts=shuffle([f.en,...lv.slice(0,beg?1:2)]);}
  else if(f.use&&others.length&&scL()==='en'){ask=`«${scT(f)}» — когда так говорят?`;right=f.use;opts=shuffle([f.use,...others.map(x=>x.use)]);}
  else if(f.trap&&f.trap.length){ask='Что это значит?';right=f.ru;opts=shuffle([f.ru,...f.trap.slice(0,beg?1:2)]);}
  else{const p=SV.play();if(p&&p.catch)p.catch(()=>{});return;}
  const fs=SW.classList.contains('sc-pfs'),box=fs?SW:($('#vqSlot')||SW);const o=document.querySelector('.sc-vq');if(o)o.remove();
  const w=document.createElement('div');w.className='sc-vq'+(fs?' over':'');
  w.innerHTML=`<div class="vq-top"><span class="vq-k">⚡ Задание</span><span class="vq-c">${SW._vqc>=2?'🔥 '+SW._vqc+' подряд':''}</span></div><b class="vq-q">${ask}</b>
    <div class="vq-o">${opts.map(x=>`<button data-v="${esc(x)}">${esc(x)}</button>`).join('')}</div><div class="vq-bar"><i></i></div>
    <div class="vq-b"><button data-h="re">↺ Ещё раз послушать</button><button data-h="skip">Пропустить</button></div>`;
  box.appendChild(w);SW.classList.add('vq-on');if(!fs&&window.innerWidth<1000)setTimeout(()=>w.scrollIntoView({behavior:'smooth',block:'nearest'}),50);
  const bar=w.querySelector('.vq-bar i');requestAnimationFrame(()=>{bar.style.transition='width 12s linear';bar.style.width='0%';});
  let gone=false;const go=(ms)=>{if(gone)return;gone=true;clearTimeout(w._t);setTimeout(()=>{w.remove();if(SW)SW.classList.remove('vq-on');if(SV){const p=SV.play();if(p&&p.catch)p.catch(()=>{});}},ms);};
  w._t=setTimeout(()=>{w.querySelectorAll('.vq-o button').forEach(b=>{b.disabled=true;if(b.dataset.v===right)b.classList.add('ok');});go(1600);},12000);
  w.onclick=e=>{e.stopPropagation();const b=e.target.closest('button');if(!b||gone)return;
    if(b.dataset.h==='skip'){go(0);return;}
    if(b.dataset.h==='re'){clearTimeout(w._t);gone=true;w.remove();SW.classList.remove('vq-on');h.shown=false;SV.currentTime=Math.max(0,h.a-0.25);const p=SV.play();if(p&&p.catch)p.catch(()=>{});return;}
    const r=b.dataset.v===right;w.querySelectorAll('.vq-o button').forEach(x=>{x.disabled=true;if(x.dataset.v===right)x.classList.add('ok');});if(!r)b.classList.add('bad');
    sfx(r?'good':'bad');haptic(r?'ok':'err');SW._vqc=r?(SW._vqc||0)+1:0;
    if(r){P.vq=P.vq||{};if(!P.vq[f.id]){P.vq[f.id]=1;scSave();addGold(5);w.querySelector('.vq-c').textContent='+5 🪙';}else if(SW._vqc>=3&&SW._vqc%3===0)w.querySelector('.vq-c').textContent='🔥 '+SW._vqc+' подряд';}
    go(r?900:2000);};}

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
function renderSceneSum(id){const s=scOf(id);if(!s)return;SCUR={id,i:0};const all=s.parts.flatMap(p=>scAct(p.ph));
  const G=[['all','Можно везде','нейтрально и вежливо',f=>['neutral','formal'].includes(scTag(f)[1])],['casual','Среди своих','разговорное',f=>scTag(f)[1]==='casual'],['rude','Грубо','только с друзьями',f=>scTag(f)[1]==='rude']];
  const kws=[],seen=new Set();all.forEach(f=>kwOf(f).forEach((k,j)=>{const key=String(k[1]||k[0]).toLowerCase();if(!seen.has(key)){seen.add(key);kws.push({f,j,k});}}));
  const de=scL()==='de'&&!scIsDe();
  scMount(s,`<div class="sc-head"><button class="sc-back" id="scb">${ui('back')}</button><div><span class="sc-meta">${esc(s.title)}</span><h1>Все фразы сцены</h1></div></div>
    <p class="ss-lead">${all.length} ${plural(all.length,['фраза','фразы','фраз'])}. Нажми на любое слово — перевод и пример. <i class="kw demo">Подсвеченные</i> — самые полезные.</p>
    <div class="ss-cols">${G.map(([k,h,sub,fn])=>{const L=all.filter(fn);if(!L.length)return '';
      return `<section class="ss-col ss-${k}"><header><b>${h}</b><small>${sub} · ${L.length}</small></header>${L.map(f=>`<article class="ss-it" data-fid="${f.id}">
        <div class="ss-row"><div class="ss-en">${kwWrap(f)}</div><button class="ss-play" data-fid="${f.id}" aria-label="Послушать">${SI.play}</button></div><div class="ss-ru">${esc(f.ru)}</div>
        ${scNoteS(f)?`<p class="ss-use">${esc(scNoteS(f))}</p>`:''}${f.fact&&!de?`<p class="ss-fact">✦ ${esc(f.fact)}</p>`:''}</article>`).join('')}</section>`;}).join('')}
    ${kws.length?`<section class="ss-col ss-words"><header><b>Важные слова</b><small>${kws.length}</small></header><div class="ss-wl">${kws.map(x=>`<span class="ss-w" data-fid="${x.f.id}"><i class="kw" data-kw="${x.j}" tabindex="0" role="button">${esc(x.k[1]||x.k[0])}</i><small>${esc(x.k[2])}</small></span>`).join('')}</div></section>`:''}</div>`,'scsum');
  phBind(document.querySelector('.scn'),el=>{const c=el.closest('[data-fid]');return c?all.find(f=>f.id===c.dataset.fid):null;});
  $$('.ss-play').forEach(b=>b.onclick=e=>{e.stopPropagation();scClip(id,b.dataset.fid,b);});
  $('#scb').onclick=()=>{if(navBack())return;sfx('tap');renderScene(id);};}

/* ---- экраны сцены ---- */
const scOf=id=>SCENES.find(s=>s.id===id);
// 11.1: у сцен с skipIntro — если до первой реплики больше 3 с тишины, эпизод стартует за секунду до неё (без перенарезки видео)
const scStartAt=(s,p)=>{if(!s.skipIntro)return 0;const r=s.subs.filter(r=>r[0]>=p.a-0.3&&r[0]<p.b).sort((x,y)=>x[0]-y[0])[0];const t=r?r[0]-p.a:0;return t>3?Math.max(0,t-1):0;};
// 9.1: у каждой сцены своя атмосфера — размытый кадр сцены фоном и цвет фильма (а не одинаковая чёрная пустота)
function scAmb(s){let a=document.getElementById('amb');if(!a){a=document.createElement('div');a.id='amb';a.setAttribute('aria-hidden','true');a.innerHTML='<i></i><b></b>';document.body.prepend(a);}
  // 9.2.1: настоящее фото фоном — bg.jpg из папки сцены (если залит), иначе обложка сцены
  const u=scCover(s,'cover.jpg'),bg=assetUrl(scKey(s,'bg.jpg'));if(a.dataset.u!==u){a.dataset.u=u;a.firstChild.style.backgroundImage=`url('${bg}'),url('${u}')`;}
  scAmbVid(a,s);}
// 10.0: видеофон — bg.mp4 из папки сцены: без звука, по кругу, плавно поверх фото. Нет файла / экономия трафика /
// «меньше движения» / включён 3D-фон — остаётся фото (bg.jpg, иначе обложка).
const AMB_NOV={};
// 12.7: общий видеофон раздела — для сцен, у которых нет ни своего фона, ни фона «фильма» (у интервью — студия)
const SC_KIND_BG={interview:'scenes/_interview/bg.mp4'};
function scAmbVid(a,s){let v=a.querySelector('video');
  // 11.1: видеофон подхватывается сам — свой bg.mp4 сцены, иначе bg.mp4 соседней сцены того же фильма, иначе фото
  const src=[s].filter(x=>x.bgv).map(x=>assetUrl(scKey(x,'bg.mp4'))).concat(SCENES.filter(x=>x.filmbg&&(x.show||x.title)===(s.show||s.title)).map(x=>assetUrl(scKey(x,'film-bg.mp4')))).concat(SC_KIND_BG[s.kind]?[assetUrl(SC_KIND_BG[s.kind])]:[]).filter(u=>!AMB_BAD[u]);   // 12.5.1: свой bg.mp4, иначе главный фон фильма film-bg.mp4; 12.7: иначе общий фон раздела (интервью)
  const no=!src.length||document.body.classList.contains('has3d')||(navigator.connection&&navigator.connection.saveData)||matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(no){if(v){v.pause();v.classList.remove('on');v.dataset.sid=v.dataset.src='';v.removeAttribute('src');}return;}
  if(!v){v=document.createElement('video');v.muted=true;v.defaultMuted=true;v.loop=true;v.playsInline=true;v.autoplay=true;v.preload='auto';v.tabIndex=-1;
    ['muted','playsinline','webkit-playsinline','autoplay','loop','disablepictureinpicture','disableremoteplayback'].forEach(k=>v.setAttribute(k,''));
    v.addEventListener('playing',()=>v.classList.add('on'));bgLoop(v);   // 12.4: бесшовная петля
    // файла нет — пробуем следующий источник
    v.addEventListener('error',()=>{const u=v.dataset.src;if(u)AMB_BAD[u]=1;v.classList.remove('on');const L=(v._src||[]).filter(x=>!AMB_BAD[x]);
      if(L.length){v.dataset.src=L[0];v.src=L[0];}else{v.dataset.src='';v.removeAttribute('src');try{v.load();}catch(e){}}});
    a.insertBefore(v,a.querySelector('b'));}
  if(v.dataset.sid!==s.id){v.dataset.sid=s.id;v._src=src;if(v.dataset.src!==src[0]){v.classList.remove('on');v.dataset.src=src[0];v.src=src[0];}}   // тот же файл — не перезагружаем и не гасим
  ambPause(false);}
const AMB_BAD={};
function ambPause(on){const v=document.querySelector('#amb video');if(!v||!v.dataset.sid)return;
  if(on){v.pause();return;}if(v.paused&&document.body.dataset.scn){const p=v.play();if(p&&p.catch)p.catch(()=>{});}}
function scMount(s,html,scr){scStop();gavGone();screen=scr;backBtn(true);document.body.dataset.scn=s.theme;document.body.dataset.scr=scr;scAmb(s);mount(`<div class="scn ${s.theme} scr-${scr}">${html}</div>`,'scnscr');musUI();}
function renderScene(id){
  if(scGate(id))return;
  if(!scOpen(scOf(id))){scBuy(scOf(id));return;}
  {const s0=scOf(id);if(s0&&s0.kind==='clip'&&!s0._srtTry){s0._srtTry=true;clipLoad(s0).then(ok=>{if((ok||(CLIPNOTES&&CLIPNOTES[id]))&&SCUR&&SCUR.id===id&&document.querySelector('.scn .sc-top')&&!document.querySelector('.scn .sc-q,.scn #scvw'))renderScene(id);});}}
  const s=scOf(id),P=scP(id);SCUR={id,i:0};
  const n=s.parts.length,d=P.done.length,L=scLearned(s),T=scTotal(s),next=s.parts.findIndex((p,i)=>!P.done.includes(i));
  scMount(s,`
    <div class="sc-head"><button class="sc-back" id="scb">${ui('back')}</button><span class="sc-meta">Сцены</span></div>
    <div class="sc-ban" style="--ban:url('${scCover(s,'cover.jpg')}')"><span class="sc-ban-k">${SC_KIND[s.kind]||'Сцена'}</span><span class="sc-ban-deco" aria-hidden="true"></span></div>
    ${musHTML(s)}
    ${s.kind==='clip'?clipNotesHTML(s):''}
    ${s.videoUrl?`<div class="clip-links sc-card"><a class="sc-btn" href="${esc(s.videoUrl)}" target="_blank" rel="noopener">▶ Смотреть официальный клип</a>${s.credit?`<small>${esc(s.credit)}</small>`:''}</div>`:''}
    <section class="sc-top sc-card">
      <div class="sc-meta">${esc(s.ep)}</div><h1>${esc(s.title)}</h1><div class="sc-sub">${esc(s.sub)}</div>
      ${scRateHTML(s)}
      <div class="sc-prog"><span>Выучено фраз</span><b>${L} / ${T}</b></div><div class="sc-bar"><i style="width:${Math.round(L/T*100)}%"></i></div>
      <div class="sc-prog sc-mast"><span>Освоение сцены${scMasterPct(s)===100?' · 🏆':''}</span><b>${scMastered(s)} / ${T}</b></div><div class="sc-bar sc-mbar"><i style="width:${scMasterPct(s)}%"></i></div><small class="sc-mhint">Фраза засчитывается, когда держится в памяти надолго — после повторений через 1, 3 и 7 дней.</small>
      <button class="sc-allph" id="scAllPh">📚 Все фразы сцены <i>${scTotal(s)}</i><span>›</span></button>
      ${scDue(s).length?`<button class="sc-btn ghost" id="screv" style="margin-bottom:8px">Повторить фразы: ${scDue(s).length} →</button>`:''}
      <button class="sc-btn ghost kv-open" id="scKv">⚔️ Дуэль с другом по этой сцене</button>
      <button class="sc-btn" id="scgo">${d===0?'Начать':next<0?(P.boss?'Повторить сцену':'👑 Финал сцены'):'Продолжить: эпизод '+String(next+1).padStart(2,'0')} →</button>
    </section>
    ${scPathHTML(s)}
    <p class="sc-foot">${s.subs.length} реплик с переводом</p>`,'scene');
  $('#scb').onclick=()=>{sfx('tap');renderTab('kino');};
  $('#scgo').onclick=()=>{if(next<0&&scBossOpen(s)&&!P.boss){scBossStart(id);return;}renderScEp(id,next<0?0:next);};
  if(P.boss&&$('#scgo')){$('#scgo').insertAdjacentHTML('afterend',`<button class="sc-btn ghost" id="scdir">🎬 Режиссёрская версия${store.dirCut&&store.dirCut[id]?' ✓':''}</button>`);$('#scdir').onclick=()=>{sfx('reel');renderDirCut(id);};}
  if($('#screv'))$('#screv').onclick=()=>renderScQuiz(id,'rev');
  if($('#scAllPh'))$('#scAllPh').onclick=()=>{sfx('tap');renderSceneSum(id);};
  if($('#scKv'))$('#scKv').onclick=()=>{sfx('tap');kvSheet(id);};
  scPathBind(s);
  musBind(s);
  $$('.pn[data-i]').forEach(b=>flagMark(b,flagEpKey(id,+b.dataset.i),p0t(s,+b.dataset.i)));
}
const p0t=(s,i)=>s.title+' · '+(s.parts[i]?s.parts[i].t:'');
// 12.5: «Режиссёрская версия» — после финала сцены: все эпизоды подряд, без пауз и объяснений, только оригинальные субтитры.
// Досмотрел до конца — значок «🎬 Режиссёрская версия» на карточке сцены (store.dirCut[sid]).
let SC_DIR=false;
function renderDirCut(id,k){const s=scOf(id);if(!s)return;k=k||0;const p=s.parts[k];SC_DIR=true;SCUR={id,i:k};
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
  SSUBON=!noSubs;SW=el;el.dataset.ss=labSub();SV=document.createElement('video');
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
  el.addEventListener('click',e=>{if(e.target.closest('.sc-fs,.sc-sheetwrap,.sc-over button,.tk,.tk-plate,.sc-wpop'))return;
    if(el.classList.contains('sc-pfs')&&el.classList.contains('idle')){wake();return;}
    const ov=el.querySelector('.sc-over');if(ov&&ov.style.display!=='none'){const pb=ov.querySelector('button');if(pb)pb.click();return;}
    wake();scPP();scFlash();});
  SV.addEventListener('error',()=>{if(!el.querySelector('.sc-err'))el.insertAdjacentHTML('beforeend','<div class="sc-err">Видео не загрузилось. Проверь интернет или что репозиторий scenes опубликован.</div>');});
  SV.addEventListener('loadedmetadata',()=>{if(isFinite(SV.duration)){fr.max=SV.duration;fb.querySelector('.sc-fd').textContent=scFmt(SV.duration);}});
  SV.addEventListener('timeupdate',()=>{
    if(SSTOP&&SV.currentTime>=SSTOP.b){SV.pause();const x=SSTOP;SSTOP=null;if(x.cb)x.cb();}
    if(!SV)return;if(document.activeElement!==fr)fr.value=SV.currentTime;fb.querySelector('.sc-ft').textContent=scFmt(SV.currentTime);});
  SV.addEventListener('play',()=>{try{BG3D.pause(true);}catch(e){}ambPause(true);musDuck(true);scSync();wake();if(!SRAF)SRAF=requestAnimationFrame(scTick);});
  SV.addEventListener('pause',()=>{try{BG3D.pause(false);}catch(e){}ambPause(false);musDuck(false);scSync();el.classList.remove('idle');});
  SV.addEventListener('seeked',scTick);
  SV.addEventListener('webkitbeginfullscreen',()=>{const m=scDeMode(scSub());for(const t of SV.textTracks)t.mode=(SSUBON&&m!=='off'&&t.label===m)?'showing':'hidden';});
  SV.addEventListener('webkitendfullscreen',()=>{for(const t of SV.textTracks)t.mode='hidden';});
  setTimeout(()=>{if(SV)for(const t of SV.textTracks)t.mode='hidden';},0);
  SV._loc=loc;
}

const SUB_LAG=0.18; // реплика в srt часто начинается чуть раньше голоса
function scTick(){
  const box=SW&&SW.querySelector('.sc-subs');if(!SV||!box){SRAF=0;return;}
  const t=SV.currentTime,m=scDeMode(scSub()),r=SSUBON&&m!=='off'?SV._loc.find(x=>t>=x[0]+SUB_LAG&&t<=x[1]+0.25&&!(SW._hideRow&&SW._hideRow(x))):null,id=r?r[0]+m:'';
  if(box.dataset.id!==id){box.dataset.id=id;const [a,b]=m.split('+');
    SW._row=r;SW._rowPh=null;box.innerHTML=r?`<div class="sline"><span class="en">${esc(String(r[SUB_COL[a]]).replace(/\n/g,' '))}</span></div>${b?`<div class="sline s2"><span class="tr">${esc(r[SUB_COL[b]]).replace(/\n/g,' ')}</span></div>`:''}`:'';SW.classList.toggle('has-sub',!!r);}
  if(SW._ph){const lv=document.getElementById('sclive');if(lv){const h=SW._ph.find(x=>t>=x.a-0.15&&t<=x.b+3);const k=h?h.f.id:'';
    if(lv.dataset.k!==k){lv.dataset.k=k;if(h)lv.innerHTML=scLiveHTML(h.f);lv.classList.toggle('on',!!h);}}}
  scChip(t);
  if(SW._tick&&!SV.paused)SW._tick(t);   // 10.2: задания по ходу фильма
  if(SW._stopPh&&(!SSTOP||SSTOP.full)&&!SV.paused&&SW._ph){const h=SW._ph.find(x=>!x.shown&&t>=x.b&&t<x.b+0.7);if(h){h.shown=true;SV.pause();if(SW._vq)scVQ(h);else scHint(h);}}
  SRAF=SV.paused?0:requestAnimationFrame(scTick);
}
// подсказка на паузе: фраза, перевод, коротко когда говорят; «Повторить» — ещё раз этот момент
function scSecondPass(id,i){if(!SW||SW._guided)return;SW._guided=true;const o=SW.querySelector('.sc-hint');if(o)o.remove();
  const w=document.createElement('div');w.className='sc-hint sc-next';
  w.innerHTML=`<span class="hn-k">Шаг 2 из 3</span><b>Теперь ещё раз — с остановками</b><span class="hn-n">Видео встанет после каждой фразы и объяснит её. Потом — короткий тест.</span>
    <div class="hn-b"><button data-h="go">Смотреть с разбором ${SI.play}</button><button data-h="q">Сразу к тесту</button></div>`;
  w.onclick=e=>{const b=e.target.closest('[data-h]');if(!b)return;e.stopPropagation();sfx('tap');w.remove();
    if(b.dataset.h==='q'){renderScQuiz(id,i);return;}
    store.scStopPh=true;save();SW._watched=true;SW._stopPh=true;(SW._ph||[]).forEach(x=>x.shown=false);
    const ov=$('#scvo');if(ov)ov.style.display='none';SV.currentTime=0;const p=SV.play();if(p&&p.catch)p.catch(()=>{});};
  SW.appendChild(w);}
const SCTOUR=[['🎬','Сначала просто смотри','Эпизод идёт целиком, с субтитрами. На полезных фразах появится короткое объяснение: что значит и когда так говорят. Никаких заданий во время фильма.'],
  ['⏸','С паузами или без','«С паузами» — видео ждёт, пока читаешь. «Без пауз» — объяснение висит поверх, кино идёт. Переключить можно в «⋯» под видео или в настройках.'],
  ['👆','Любое слово нажимается','В объяснении и в репликах под видео нажми на слово — перевод и «☆ В мои слова». Подчёркнутые — выражения: у них свой смысл.'],
  ['✅','Потом — проверка','Досмотрел — «Проверить, что запомнил»: послушай и напиши сам, подсказки — первые буквы и кубики. Выученное вернётся через 1, 3 и 7 дней.']];
function scTour(done){let k=0;const w=document.createElement('div');w.className='sctour';
  const draw=()=>{const [ic,h,txt]=SCTOUR[k];w.innerHTML=`<div class="tour-card"><div class="tour-ic">${ic}</div><b>${h}</b><p>${txt}</p>
    <div class="tour-dots">${SCTOUR.map((_,j)=>`<i class="${j===k?'on':''}"></i>`).join('')}</div>
    <div class="tour-b"><button data-t="skip">${k<SCTOUR.length-1?'Пропустить':''}</button><button data-t="next" class="go">${k<SCTOUR.length-1?'Дальше':'Понятно, поехали'}</button></div></div>`;};
  w.onclick=e=>{const b=e.target.closest('[data-t]');if(!b)return;sfx('tap');if(b.dataset.t==='next'&&k<SCTOUR.length-1){k++;draw();return;}store.tourV=1;save();w.remove();if(typeof done==='function')done();};
  draw();document.body.appendChild(w);}
function scChip(t){return;/* 8.4: во время просмотра — только чистые субтитры, без плашек */if(!SW)return;
  {const r=SW._row,s=SCUR&&scOf(SCUR.id),ks=r&&s?swKeysIn(s.id,SCUR.i||0,r[2]):[];if(ks.length){const id='w'+r[0];if(SW._chipId===id)return;SW._chipId=id;
    let c=SW.querySelector('.sc-chip');if(!c){c=document.createElement('div');c.className='sc-chip';SW.appendChild(c);}
    c.classList.add('words');c.innerHTML=`<span class="k">★ слова</span><span class="wl">${ks.map(k=>'<b>'+esc(k[0])+'</b> — '+esc(k[1])).join(' · ')}</span>`;c.classList.add('on');return;}}
  if(!SW._ph)return;const cur=SW._ph.find(x=>t>=x.a-0.1&&t<=x.b+0.9),id=cur?cur.f.id:'';if(SW._chipId===id)return;SW._chipId=id;
  let c=SW.querySelector('.sc-chip');if(!cur){if(c)c.classList.remove('on');return;}
  if(!c){c=document.createElement('div');c.className='sc-chip';SW.appendChild(c);}c.classList.remove('words');
  const f=cur.f,pat=typeof scPattern==='function'?scPattern(f):null,short=scShort(scNoteS(f));
  c.innerHTML=`<span class="k">★ учим эту фразу</span><b>${esc(scT(f))}</b><span>${esc(short||f.ru)}</span>`;
  c.classList.add('on');}
function scHint(h){if(!SW)return;const ch=SW.querySelector('.sc-chip');if(ch)ch.classList.remove('on');const f=h.f,o=SW.querySelector('.sc-hint');if(o)o.remove();const w=document.createElement('div');w.className='sc-hint';
  w.innerHTML=`<span class="hn-k">Ключевая фраза</span><b>${esc(scT(f))}</b><span class="hn-ru">${esc(f.ru)}</span>
    ${scShort(scNoteS(f))?`<span class="hn-n">${esc(scShort(scNoteS(f)))}</span>`:''}
    <div class="hn-b"><button data-h="go">Дальше ${SI.play}</button><button data-h="sh">🔁 Повторить</button><button data-h="re">Ещё раз</button><button data-h="off">Без остановок</button></div>`;
  w.onclick=e=>{const b=e.target.closest('[data-h]');if(!b)return;e.stopPropagation();sfx('tap');const v=b.dataset.h;w.remove();
    if(v==='sh'){let k=0;const one=()=>{if(!SW||k>=3){SW&&SW.appendChild(w);return;}k++;scPlay(h.a-0.1,h.b+0.1,()=>setTimeout(one,Math.max(1500,(h.b-h.a)*1000+600)));};w.remove();toast('Слушай и повторяй вслух — 3 раза');one();return;}
    if(v==='off'){store.scStopPh=false;save();SW._stopPh=false;}
    if(v==='re'){SV.currentTime=Math.max(0,h.a-0.2);h.shown=false;}
    const p=SV.play();if(p&&p.catch)p.catch(()=>{});};
  SW.appendChild(w);}
// карточка фразы под видео в момент, когда её говорят: фраза, перевод и коротко — когда так говорят
const scShort=n=>{const m=String(n||'').match(/^.*?[.!?](\s|$)/);return m?m[0].trim():String(n||'');};
function scLiveHTML(f){return `<span class="lv-tag">Фраза эпизода</span><b>${esc(scT(f))}</b><span class="lv-ru">${esc(f.ru)}</span><span class="lv-n">${esc(scNoteS(f))}</span>`;}
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
    ${scIsDe()?`<p class="sc-denote">${FLAG.de} Этот фильм на немецком — оригинал немецкий, перевод русский. Английских субтитров тут нет.</p>`:''}${scIsDe()?'':`<div class="sc-lang"><button data-lg="en" class="${de?'':'on'}">Учу English</button><button data-lg="de" class="${de?'on':''}">Учу Deutsch</button></div>`}
    <div class="sc-opts3">${O.map(([k,n,d])=>`<button data-sl="${k}" class="${cur===k?'on':''}"><span>${n}</span><small>${d}</small></button>`).join('')}</div>
    <button class="sc-stop ${store.scStopPh!==false?'on':''}" data-stop="1"><i></i><span>Останавливать на фразах и объяснять<small>со второго просмотра эпизода</small></span></button>
    <button class="sc-btn" data-close>Готово</button></div>`;
  (SW&&SW.classList.contains('sc-pfs')?SW:(document.querySelector('.scn')||document.body)).appendChild(w);
  const relabel=()=>{const f=$('#sccc');if(f)f.textContent=(SUB_SHORT[scDeMode(scSub())]||'DE·EN');if(SW){const bx=SW.querySelector('.sc-subs');if(bx)bx.dataset.id='x';SW.dataset.ss=labSub();}try{scTick();}catch(e){}};
  w.onclick=e=>{const b=e.target.closest('button');if(e.target===w||(b&&b.hasAttribute('data-close'))){store.scSubChosen=true;save();scCloseSheet();return;}
    if(!b)return;sfx('sel');
    if(b.dataset.lg){store.scSub=b.dataset.lg==='de'?'de+ru':'en+ru';store.scSubChosen=true;save();relabel();scSubSheet(first);return;}
    if(b.dataset.sl){store.scSub=b.dataset.sl;store.scSubChosen=true;save();w.querySelectorAll('[data-sl]').forEach(x=>x.classList.toggle('on',x===b));relabel();}
    if(b.dataset.stop){store.scStopPh=store.scStopPh===false;save();b.classList.toggle('on',store.scStopPh!==false);if(SW)SW._stopPh=!!SW._watched&&store.scStopPh!==false;}};
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
const scPips=n=>`<span class="sc-pips">${[0,1,2].map(i=>`<i class="${i<n?'on':''}"></i>`).join('')}</span>`;
const scCard=(f,P)=>`<div class="sc-ph sc-card${f.passive?' passive':''}">${f.passive?'<span class="sc-pas">для понимания · без теста</span>':''}<div class="en">${esc(scT(f))}</div><div class="ru">${esc(f.ru)}</div><div class="dc-tags">${f.passive?'':fTopics(f).map(k=>`<span class="dc-t">${TOPIC_ICO[k]||''} ${k}</span>`).join('')}<span class="sc-tag ${scTag(f)[1]}">${scTag(f)[0]}</span></div>${scNoteS(f)?`<div class="nt">${esc(scShort(scNoteS(f)))}</div>`:''}<div class="row"><button class="sc-mom" data-id="${f.id}">▶ Момент</button>${scPips(Math.min(3,P.m[f.id]||0))}</div></div>`;
function renderScEp(id,i,opts){
  opts=opts||{};
  if(scGate(id,i))return;
  if(!scOpen(scOf(id))){scBuy(scOf(id));return;}
  if(scPilot(scOf(id))&&!opts.lessonList){renderScEpTask(id,i);return;}   // 10.2: режимы hero / dict
  if(!store.lvl&&!opts.lessonList){renderLevelTest(()=>renderScEp(id,i,opts));return;}
  const s=scOf(id),p=s.parts[i],P=scP(id),watched=!!(P.done.includes(i)||P.w[i]);
  if(!opts.lessonList&&!opts.free&&!scEpOpen(s,i)){toast(`Сначала пройди эпизод ${String(i).padStart(2,'0')}`);renderScene(id);return;}
  const focus=Array.isArray(opts.lessonList)&&opts.lessonList.length?opts.lessonList.filter(f=>f&&!f.passive&&f.pi===i).slice(0,5):scAct(p.ph);
  const lesson=!!opts.lessonList;
  SCUR={id,i};store.scLast={id,i};save();
  const rows=s.subs.filter(r=>r[0]>=p.a-0.3&&r[0]<p.b),swd=swData(s.id,i);
  const mx=s.mode==='mix'&&!lesson;   // 11.4: в mix нет «Разбора» — объяснения приходят плашками прямо во время просмотра
  // 8.4: эпизод по шагам — на экране только текущий шаг. ① Смотри → ② Разбор (фразы по одной) → ③ Проверка.
  scMount(s,`
    <div class="sc-head"><button class="sc-back" id="scb">${ui('back')}</button><div><span class="sc-meta">${esc(s.title)} · эпизод ${String(i+1).padStart(2,'0')}</span><h1>${esc(p.t)}</h1></div></div>
    <div class="ep-main"><div class="sc-v" id="scvw"><div class="sc-over" id="scvo"><button id="scplay" aria-label="Смотреть">▶</button></div></div>
    ${scSeek()}
    ${scCtrl()}<div id="vqSlot"></div></div>
    <div class="ep-side"><div class="ep-tabs" role="tablist"><button data-tab="watch"><i>1</i>Смотри</button>${mx?'':'<button data-tab="learn"><i>2</i>Разбор</button>'}<button data-tab="test"><i>${mx?2:3}</i>Проверка</button></div>
    <section class="ep-pane" data-pane="watch">
      ${mx?`<div class="ep-hint ep-watch"><b>🎬 Смотри сцену</b><span>Просто смотри. На полезных фразах появится короткое объяснение — нажми на любое слово, если непонятно. Проверка — после.</span>
        <div class="ep-pz" role="radiogroup" aria-label="Как смотреть"><button data-pz="on" class="${scPauseOn()?'on':''}">⏸ С паузами<small>видео ждёт, пока читаешь</small></button><button data-pz="off" class="${scPauseOn()?'':'on'}">▶ Без пауз<small>объяснение поверх, кино идёт</small></button></div></div>
      <div class="ep-end" id="epEnd" hidden></div>`:''}
      <div class="ep-hint"${mx?' hidden':''}><b>Посмотри эпизод</b><span>${store.vtask===false?'Субтитры — оригинал и перевод.':s.mode==='mix'?`Видео встанет на полезных фразах: ${Math.min(focus.length,SC_TASK_N.mix)} напишешь сам, остальные — коротко объясню и спрошу «когда так говорят?».`:`Видео встанет ${focus.length} ${plural(focus.length,['раз','раза','раз'])} — на ключевых фразах: короткое задание, за верный ответ +5 монет.`} Незнакомое слово — нажми на него в репликах ниже.</span>
        <label class="ep-vt"><input type="checkbox" id="epVt" ${store.vtask===false?'':'checked'}><span>Задания прямо в видео</span></label></div>
      <button class="sc-btn ep-go" id="epToLearn">${watched?(mx?'Проверить, что запомнил →':'Дальше: разбор фраз →'):(mx?'🎬 Смотреть сцену':'Смотреть эпизод ▶')}</button>
      ${mx?`<details class="ep-phs" id="epPhs"><summary>Фразы эпизода <i id="epPhN">0 из ${scWatchFX(p).length}</i></summary><div class="ep-phl" id="epPhL"><p class="ep-phe">Появятся здесь, когда встретишь их в сцене.</p></div></details>`:''}
      ${!lesson?`<details class="ep-lines"${s.mode==='mix'?'':' open'}><summary>Все реплики · нажми на любое слово <i>${rows.length}</i></summary>
        <div class="sc-lines sc-card">${rows.map((r,k)=>`<div class="ln" data-k="${k}"><b>${swWrap(scRowT(r))}</b><span>${esc(r[3]).replace(/\\n/g,' ')}</span></div>`).join('')}</div></details>`:''}
    </section>
    <section class="ep-pane" data-pane="learn" hidden>
      <div class="ep-card" id="epCard"></div>
      <div class="ep-nav"><button id="epPrev" aria-label="Назад">${ui('back')}</button><div class="ep-dots" id="epDots"></div><button id="epNext" aria-label="Дальше">${ui('fwd')}</button></div>
      ${swd?`<details class="ep-words"><summary>Все слова эпизода <i>${swd.key.length}</i></summary>${swBlock(s,i,p)}</details>`:''}

    </section></div>`,'scep');

  {const sn=document.querySelector('.scn');if(sn)sn.classList.add('scep');}
  scVideo($('#scvw'),s,p);
  $('#scvw').appendChild($('#scvo'));
  // 9.2: задания прямо в видео — видео встаёт после ключевой фразы (только при просмотре целиком, не при «Послушать в сцене»)
  SW._ph=focus.filter(f=>f.b>f.a).map(f=>({f,a:f.a-p.a,b:f.b-p.a,shown:false}));SW._watched=watched;SW._stopPh=store.vtask!==false;SW._vq=true;SW._vqc=0;
  // 10.2 mix: вместо старых заданий в видео — паузы «Ты герой» перед ключевыми репликами
  const MET=new Set();let WX=null;
  const phItem=f=>`<div class="ep-phi" data-fid="${f.id}"><b>${kwWrap(f)}</b><span>${esc(f.ru)}</span>${scNoteS(f)?`<small>💡 ${esc(scShort(scNoteS(f)))}</small>`:''}<button class="ep-php" data-a="${f.a}" data-b="${f.b}">${SI.play} Послушать</button></div>`;
  const phList=(full)=>{const box=$('#epPhL');if(!box||!WX)return;const L=full?WX.list:WX.list.filter(f=>MET.has(f.id));
    box.innerHTML=L.length?L.map(phItem).join(''):'<p class="ep-phe">Появятся здесь, когда встретишь их в сцене.</p>';
    box.querySelectorAll('.ep-phi').forEach(el=>phBind(el,WX.list.find(f=>f.id===el.dataset.fid)));
    box.querySelectorAll('.ep-php').forEach(b=>b.onclick=()=>{sfx('tap');$('#scvo').style.display='none';if(window.innerWidth<1000)window.scrollTo({top:0,behavior:'smooth'});scPlay(+b.dataset.a-p.a-0.1,+b.dataset.b-p.a+0.15,()=>{$('#scvo').style.display='';});});
    const n=$('#epPhN');if(n)n.textContent=full?`${WX.list.length}`:`${MET.size} из ${WX.list.length}`;};
  // 12.2 mix: при просмотре — только плашки-объяснения, без заданий (задания — в проверке после фильма)
  if(mx){SW._stopPh=false;SW._vq=false;WX=scWatchAttach(s,p,$('#vqSlot'),{met:f=>{MET.add(f.id);phList(false);}});if(watched)phList(true);
    $$('.ep-pz button').forEach(b=>b.onclick=()=>{sfx('sel');store.scPause=b.dataset.pz;save();$$('.ep-pz button').forEach(x=>x.classList.toggle('on',x===b));toast(scPauseOn()?'⏸ Видео будет ждать на фразах':'▶ Объяснения поверх, кино не останавливается');});}
  let k=0,pane=watched&&focus.length&&!mx?'learn':'watch';
  const tabs=()=>$$('.ep-tabs button').forEach(b=>{const t=b.dataset.tab;b.classList.toggle('on',t===pane);b.classList.toggle('done',(t==='watch'&&(P.w[i]||P.done.includes(i)))||(t==='learn'&&P.done.includes(i)));});
  const show=t=>{pane=t;$$('.ep-pane').forEach(x=>x.hidden=x.dataset.pane!==t);tabs();if(t==='learn')card();const vq=document.querySelector('.sc-vq');if(vq){clearTimeout(vq._t);vq.remove();if(SW)SW.classList.remove('vq-on');}};
  // ② разбор: одна фраза — одна карточка
  function card(){const box=$('#epCard');if(!box)return;
    if(!focus.length){box.innerHTML=`<div class="ep-empty">В этом эпизоде нет фраз для разбора — можно сразу к проверке слов или к следующему эпизоду.</div>`;$('#epDots').innerHTML='';return;}
    if(k>=focus.length){box.innerHTML=`<div class="ep-done"><div class="ep-done-ic">👍</div><b>Все фразы разобрали</b><span>Теперь короткая проверка — 5 заданий, пара минут.</span>
        <button class="sc-btn" id="epTest">К проверке →</button>${swd?`<button class="sc-btn ghost" id="epWq">Проверить слова эпизода</button>`:''}</div>`;
      $('#epTest').onclick=()=>{sfx('tap');renderScQuiz(id,lesson?{list:focus,lesson:true}:i);};if($('#epWq'))$('#epWq').onclick=()=>{sfx('tap');renderWordQuiz(id,i);};dots();return;}
    const f=focus[k],tg=scTag(f);
    box.innerHTML=`<div class="ep-c-top"><span class="ep-c-n">Фраза ${k+1} из ${focus.length}</span><span class="sc-tag ${tg[1]}">${tg[0]}</span></div>
      <b class="ep-c-en">${kwWrap(f)}</b><span class="ep-c-ru">${esc(f.ru)}</span>
      <div class="ep-c-hear"><button class="ep-hear" id="epMom" title="Видео сыграет только эту фразу">${SI.play}<span>Послушать в сцене</span></button><button class="ep-slow" id="epSlow" title="То же самое, но в 0.75x">🐢 Медленнее</button></div>
      ${kwOf(f).length?`<p class="ep-c-kwh">${matchMedia('(hover:hover)').matches?'Наведи':'Нажми'} на любое слово — перевод. <i class="kw demo">Подсвеченные</i> — самые полезные: с примером и когда их говорят</p>`:''}
      ${phInfoHTML(f)}`;
    dots();
    const hear=slow=>{sfx('tap');$('#scvo').style.display='none';if(window.innerWidth<1000)window.scrollTo({top:0,behavior:'smooth'});const rt=SV.playbackRate;if(slow)SV.playbackRate=.75;
      scPlay(f.a-p.a-0.1,f.b-p.a+0.15,()=>{if(SV)SV.playbackRate=rt;$('#scvo').style.display='';});if(slow&&SV)SV.playbackRate=.75;};
    $('#epMom').onclick=()=>hear(false);$('#epSlow').onclick=()=>hear(true);
    phBind(box,f);}
  function dots(){$('#epDots').innerHTML=focus.map((_,j)=>`<i class="${j<k?'done':j===k?'on':''}"></i>`).join('')+`<i class="${k>=focus.length?'on':''} fin"></i>`;
    $('#epPrev').disabled=k===0;$('#epNext').disabled=k>=focus.length;}
  $('#epPrev').onclick=()=>{if(k>0){k--;sfx('tap');card();}};
  $('#epNext').onclick=()=>{if(k<focus.length){k++;sfx('tap');card();}};
  {let x0=null;const c=$('#epCard');c.addEventListener('touchstart',e=>{x0=e.touches[0].clientX;},{passive:true});
    c.addEventListener('touchend',e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)<50)return;if(dx<0&&k<focus.length){k++;card();}else if(dx>0&&k>0){k--;card();}},{passive:true});}

  const opened=()=>{const first=!P.w[i];P.w[i]=1;scSave();const b=$('#epToLearn');if(b){b.textContent=mx?'Проверить, что запомнил →':'Дальше: разбор фраз →';b.classList.add('pulse');}tabs();
    if(mx){if(SW&&SW._watchKill)SW._watchKill();phList(true);const e=$('#epEnd');if(e){const n=WX?WX.list.length:0;
      e.innerHTML=`<div class="ep-end-in"><span class="ep-end-k">🎬 Эпизод досмотрен</span><b>Ты встретил ${n} ${plural(n,['полезную фразу','полезные фразы','полезных фраз'])}</b><span>Теперь проверим, что запомнилось: послушай → вспомни → собери → примени.</span>
        <div class="ep-end-b"><button class="sc-btn ep-go" id="epGoQ">Проверить, что запомнил →</button><button class="ep-see" id="epSeePh">Посмотреть фразы</button></div></div>`;
      e.hidden=false;const h=document.querySelector('.ep-watch');if(h)h.hidden=true;if(b)b.style.display='none';
      $('#epSeePh').onclick=()=>{sfx('tap');const d=$('#epPhs');d.open=true;d.scrollIntoView({behavior:'smooth',block:'start'});};
      $('#epGoQ').onclick=()=>{sfx('tap');renderScQuiz(id,i);};
      if(first){sfx('reel');}if(first)e.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{duration:420,easing:'cubic-bezier(.2,.9,.3,1)'});
      if(window.innerWidth<1000)setTimeout(()=>e.scrollIntoView({behavior:'smooth',block:'center'}),120);}}};
  let at0=opts.at;   // 12.1: открыли из словаря/поиска — первый ▶ играет с нужного места
  const run=()=>{$('#scvo').style.display='none';(SW._ph||[]).forEach(x=>x.shown=false);const from=at0!=null?at0:scStartAt(s,p);at0=null;scPlay(from,p.b-p.a+1,()=>{$('#scvo').style.display='';opened();});if(SSTOP)SSTOP.full=true;};
  if($('#epVt'))$('#epVt').onchange=e=>{store.vtask=e.target.checked;save();if(SW)SW._stopPh=s.mode==='mix'?false:store.vtask;toast(store.vtask?'Задания в видео включены':'Задания в видео выключены');};
  $('#scplay').onclick=run;
  scBindCtrl(run);scBindSeek();
  if(opts.at!=null){const set=()=>{try{SV.currentTime=opts.at;scTick&&scTick();}catch(e){}};if(SV.readyState>=1)set();else SV.addEventListener('loadedmetadata',set,{once:true});run();if(SV.paused)setTimeout(()=>{if(SV&&SV.paused)$('#scvo').style.display='';},600);}
  SV.addEventListener('ended',()=>{$('#scvo').style.display='';opened();},{once:true});SV.addEventListener('ended',()=>ev('ep_watch',id),{once:true});
  $('#epToLearn').onclick=()=>{sfx('tap');if(!(P.w[i]||P.done.includes(i))&&SV&&SV.paused&&SV.currentTime<1){run();return;}if(mx){renderScQuiz(id,i);return;}show('learn');window.scrollTo({top:0,behavior:'smooth'});};
  $$('.ep-tabs button').forEach(b=>b.onclick=()=>{sfx('tap');const t=b.dataset.tab;if(t==='test'){renderScQuiz(id,lesson?{list:focus,lesson:true}:i);return;}show(t);});
  $('#scb').onclick=()=>{if(navBack())return;sfx('tap');renderScene(id);};
  if($('#swq'))$('#swq').onclick=()=>{sfx('tap');renderWordQuiz(id,i);};
  $$('.sw-play').forEach(b=>b.onclick=()=>{$('#scvo').style.display='none';window.scrollTo({top:0,behavior:'smooth'});scPlay(+b.dataset.a-0.1,+b.dataset.b+0.2,()=>{$('#scvo').style.display='';});});
  lineWords(s,p);
  // 12.6: при первом заходе тур и выбор субтитров вылезали одновременно, друг на друга — теперь по очереди: тур → субтитры
  {const sub=()=>{if(!store.scSubChosen&&document.querySelector('.ep-tabs')&&!document.querySelector('.sc-sheetwrap'))scSubSheet(true);};
   if(store.tourV!==1)setTimeout(()=>{if(document.querySelector('.ep-tabs')&&!document.querySelector('.sctour'))scTour(sub);else sub();},500);else setTimeout(sub,250);}
  {const hb=document.createElement('button');hb.className='sc-help';hb.setAttribute('aria-label','Как тут учиться');hb.textContent='?';hb.onclick=()=>scTour();const hd=document.querySelector('.scn .sc-head');if(hd)hd.appendChild(hb);}
  // слова в субтитрах: нажатие — перевод, наведение (ПК) — подсказка
  SW.addEventListener('click',e=>{const w=e.target.closest('.sw');if(!w)return;e.stopPropagation();e.preventDefault();const tp=SW.querySelector('.sc-wtip');if(tp)tp.classList.remove('on');swPop(w.textContent,SW._row,w.classList.contains('in-ph'));},true);
  if(matchMedia('(hover:hover)').matches){SW.addEventListener('mouseover',e=>{const w=e.target.closest('.sw');if(w)swTip(w);});
    SW.addEventListener('mouseout',e=>{if(e.target.closest('.sw')){const tp=SW.querySelector('.sc-wtip');if(tp)tp.classList.remove('on');}});}
  show(pane);
}
/* =====================================================================================
   10.2 — ЗАДАНИЯ ПО ХОДУ ФИЛЬМА. Режим эпизода задаётся у сцены полем mode в scenes.json (пилот: сравнить вживую):
   • hero — «Ты герой»: перед ключевой репликой видео встаёт, собираешь её сам (смысл подсказан), потом фильм играет настоящую.
   • dict — «Диктант»: ключевые реплики идут без субтитров, сразу после — пауза: собери, что услышал.
   • mix  — поток 9.2 (Смотри → Разбор → Проверка), но при просмотре вместо старых заданий — паузы «Ты герой».
   • без mode — 9.2 как было.
   hero/dict — без цены, замков, теста уровня и монет. 10.0 (шаги+игра) и 10.1 (карточки справа) Андрею не зашли.
   ===================================================================================== */
const scPilot=s=>!!(s&&(s.mode==='hero'||s.mode==='dict'));
const SC_TASK_N={hero:4,dict:4,mix:3};
// 11.4: слова, которые считаем знакомыми любому, кто дошёл до сцен (для «примени в жизни»)
const SC_BASIC=new Set("i you he she it we they me him her us them my your his its our their this that these those a an the and or but so if because when what who where why how which not no yes is am are was were be been do does did don't doesn't didn't have has had will would can can't could should must to of in on at for with from by up out about all some any one two there here now then just very too also only more most much many good bad new old big little get go come see know think want like make take say tell give look need feel let's it's i'm you're that's what's there's i'll i've don't okay ok right well oh hey please thank thanks sorry".split(' '));
// ключевые фразы эпизода для заданий: активные, по времени; если их больше лимита — равномерно по эпизоду
function scTaskFX(s,p){const L=scAct(p.ph).filter(f=>f.b>f.a&&!f.passive).slice().sort((a,b)=>a.a-b.a),n=SC_TASK_N[s.mode]||4;
  if(L.length<=n)return L;return [...new Set([...Array(n).keys()].map(k=>L[Math.round(k*(L.length-1)/(n-1))]))];}
// 11.4: до 12 слов — по слову; длиннее — кусками по 2 (по 3), но так, чтобы куски не повторялись («and again» ×2 — нельзя)
function scChunk(tk){if(tk.length<=12)return tk;for(const n of [2,3]){const ch=[];for(let k=0;k<tk.length;k+=n)ch.push(tk.slice(k,k+n).join(' '));if(new Set(ch.map(x=>x.toLowerCase())).size===ch.length)return ch;}return tk;}
// кубики: без знаков и заглавных, длинное — кусками, ловушки — другие формы тех же слов и gx
function scBuildTiles(text,f,all){const clean=w=>{let x=String(w).replace(/[.,!?;:…"«»()]+/g,'');if(!/^I('|$)/.test(x))x=x.toLowerCase();return x;};
  let tk=scToks(text).map(clean).filter(Boolean);
  tk=scChunk(tk);
  const pool=[],used=new Set(tk.map(x=>x.toLowerCase()));const add=v=>{v=clean(v);if(v&&!used.has(v.toLowerCase())&&pool.length<3){pool.push(v);used.add(v.toLowerCase());}};
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
// реплика перед ключевой фразой — чтобы было понятно, на что отвечает герой
function scCtxRow(s,f){const fe=phNorm(f.en);let best=null;for(const r of s.subs){const re=phNorm(r[2]);if(r[0]<f.a-0.35&&r[1]>f.a-8&&r[1]<=f.b&&re!==fe&&!fe.includes(re)&&!re.includes(fe)&&(!best||r[0]>best[0]))best=r;}return best;}   // строку с самой фразой не показываем — там ответ
// 11.0: какие кубики стоят правильно — по самой длинной общей последовательности, а не по позиции
// («meet for drinks after work» без «want to» — пять зелёных, а не пять красных)
function scLcsMarks(got,want){const n=got.length,m=want.length,D=[...Array(n+1)].map(()=>Array(m+1).fill(0));
  for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)D[i][j]=got[i]===want[j]?D[i+1][j+1]+1:Math.max(D[i+1][j],D[i][j+1]);
  const mk=Array(n).fill(false);let i=0,j=0;while(i<n&&j<m){if(got[i]===want[j]){mk[i]=true;i++;j++;}else if(D[i+1][j]>=D[i][j+1])i++;else j++;}return mk;}
// 12.1: зелёный — только слово на своём месте; под ответом — разбор: пропущенное [a…], лишнее зачёркнуто
const scPosMarks=(got,want)=>got.map((g,i)=>!!g&&g===want[i]);
function scDiffHTML(got,want,full){got=got.filter(Boolean);const n=got.length,m=want.length,D=[...Array(n+1)].map(()=>Array(m+1).fill(0));
  for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)D[i][j]=got[i]===want[j]?D[i+1][j+1]+1:Math.max(D[i+1][j],D[i][j+1]);
  const out=[];let i=0,j=0;while(i<n||j<m){if(i<n&&j<m&&got[i]===want[j]){out.push(`<span>${esc(got[i])}</span>`);i++;j++;}
    else if(j<m&&(i>=n||D[i][j+1]>=D[i+1][j]))out.push(`<b class="miss">[${esc(full?want[j]:want[j].charAt(0)+'…')}]</b>`),j++;
    else out.push(`<s>${esc(got[i])}</s>`),i++;}
  return `<div class="sc-diff">${out.join(' ')}</div>`;}
// кубик в первую дырку; убранный из середины оставляет дырку
function scSlotPut(arr,y,max){const h=arr.findIndex(z=>!z);if(h>=0&&h<max)arr[h]=y;else if(arr.length<max)arr.push(y);}
function scSlotTake(arr,i){arr[i]=null;while(arr.length&&!arr[arr.length-1])arr.pop();}
// движок пауз: реплика прозвучала → видео встаёт → вспомни и напиши сам → первые буквы → собери из слов → ответ.
// В полном экране видео на время задания выходит из него, потом возвращается.
// 12.2: просмотр как кино с умным комментатором. Никаких вопросов — на полезных фразах плашка: фраза (слова нажимаются),
// перевод и коротко «когда так говорят». «⏸ С паузами» — видео ждёт «Дальше ▶»; «▶ Без пауз» — плашка висит и уходит сама.
// Учёба (вспомни / собери / примени) — только после просмотра, в «Проверке».
const scPauseOn=()=>store.scPause!=='off';
const scWatchFX=p=>(L=>L.length<=5?L:[...new Set([0,1,2,3,4].map(k=>L[Math.round(k*(L.length-1)/4)]))])(scAct(p.ph).filter(f=>f.b>f.a&&!f.passive).slice().sort((x,y)=>x.a-y.a));
function scWatchAttach(s,p,box,o){o=o||{};const L=scWatchFX(p).map(f=>({f,a:f.a-p.a,b:f.b-p.a,done:false}));let cur=null,lastT=0;
  SW._hideRow=null;
  const kill=()=>{if(!cur)return;clearTimeout(cur._t);const w=cur;cur=null;kwHide(0);w.classList.add('out');setTimeout(()=>w.remove(),220);};
  SW._tick=t=>{if(SSTOP&&!SSTOP.full)return;
    if(t<lastT-0.5)L.forEach(y=>{if(y.a>t)y.done=false;});lastT=t;
    const y=L.find(y=>!y.done&&t>=y.b+0.1&&t<y.b+1.5);if(!y)return;y.done=true;show(y);};
  function show(y){kill();const f=y.f,fs=!!(SW&&SW.classList.contains('sc-pfs')),stop=scPauseOn();if(stop&&SV)SV.pause();
    const use=scShort(scNoteS(f)),w=document.createElement('div');w.className='tk tk-plate tk-watch'+(fs?' over':'')+(stop?'':' flow');
    w.innerHTML=`<div class="tkp-top"><span class="tk-k">💬 Фраза из сцены</span><button class="tkp-x" data-x="go">${stop?'Дальше ▶':'✕'}</button></div>
      <b class="tkp-en">${kwWrap(f)}</b><span class="tkp-ru">${esc(f.ru)}</span>${use?`<p class="tkp-use">💡 ${esc(use)}</p>`:''}
      <small class="tkp-h">Нажми на слово — объясню</small>${stop?'':'<div class="vq-bar"><i></i></div>'}`;
    (fs?SW:box).appendChild(w);kwBind(w,f);cur=w;if(o.met)o.met(f);
    if(!fs&&window.innerWidth<1000&&stop)setTimeout(()=>w.scrollIntoView({behavior:'smooth',block:'nearest'}),50);
    if(!stop){const ms=Math.max(6000,Math.min(11000,(f.en.length+f.ru.length+use.length)*45)),bar=w.querySelector('.vq-bar i');
      requestAnimationFrame(()=>{bar.style.transition=`width ${ms}ms linear`;bar.style.width='0%';});w._t=setTimeout(()=>{if(cur===w)kill();},ms);}
    // нажал на слово в режиме без пауз — фильм ждёт, пока читаешь
    w.addEventListener('click',e=>{e.stopPropagation();const b=e.target.closest('[data-x]');
      if(e.target.closest('.kw,.sw')&&SV&&!SV.paused){SV.pause();clearTimeout(w._t);const x=w.querySelector('.tkp-x');x.textContent='Дальше ▶';w._resume=true;const bar=w.querySelector('.vq-bar');if(bar)bar.remove();return;}
      if(!b||b.dataset.x!=='go')return;sfx('tap');const res=stop||w._resume;kill();if(res&&SV){const r=SV.play();if(r&&r.catch)r.catch(()=>{});}});}
  SW._watchKill=kill;
  return {list:L.map(y=>y.f)};}
function scTaskAttach(s,p,FX,kind,box,o){o=o||{};const P=scP(s.id),all=s.parts.flatMap(x=>x.ph),ru0=kind!=='dict';
  const T=FX.map(f=>({f,a:f.a-p.a,b:f.b-p.a,done:false,res:undefined}));let busy=false,lastT=0;
  // 11.4 (mix): остальные полезные фразы — компактная плашка на паузе: фраза, перевод и «когда так говорят?»; уходит сама или по «Дальше»
  // не больше 3 плашек на эпизод (равномерно), чтобы видео не стояло каждые 5 секунд
  const PL=o.plates?(L=>L.length<=3?L:[...new Set([0,1,2].map(k=>L[Math.round(k*(L.length-1)/2)]))])(scAct(p.ph).filter(f=>f.b>f.a&&!f.passive&&!FX.includes(f)).sort((x,y)=>x.a-y.a)).map(f=>({f,a:f.a-p.a,b:f.b-p.a,done:false})):[];
  // строка с ключевой репликой — без субтитров, пока на неё не ответил (иначе ответ висит на экране)
  SW._hideRow=r=>T.some(x=>!x.shown&&r[0]<x.b-0.05&&r[1]>x.a+0.05);
  SW._tick=t=>{if(busy||(o.on&&!o.on()))return;if(SSTOP&&!SSTOP.full)return;
    if(t<lastT-0.5){T.forEach(x=>{if(x.a>t)x.done=x.shown=false;});PL.forEach(y=>{if(y.a>t)y.done=false;});}lastT=t;
    const y=PL.find(y=>!y.done&&t>=y.b+0.12&&t<y.b+1.5);if(y){y.done=true;busy=true;SV.pause();plate(y);return;}
    const x=T.find(x=>!x.done&&t>=x.b+0.12&&t<x.b+1.5);if(!x)return;x.done=true;busy=true;SV.pause();ask(x);};
  function plate(y){const f=y.f,fs=!!(SW&&SW.classList.contains('sc-pfs')),beg=store.lvl!=='b';
    const pool=all.filter(z=>z!==f&&!z.passive&&z.use&&z.use!==f.use),more=pool.length>=2?pool:[...pool,...SCENES.filter(z=>z!==s&&z.lang===s.lang).flatMap(z=>z.parts.flatMap(q=>q.ph)).filter(z=>!z.passive&&z.use&&z.use!==f.use)];
    const others=shuffle(more).slice(0,beg?1:2),qq=f.use&&others.length&&scL()==='en',right=f.use,opts=qq?shuffle([f.use,...others.map(z=>z.use)]):[];
    const w=document.createElement('div');w.className='tk tk-plate'+(fs?' over':'');
    w.innerHTML=`<div class="tkp-top"><span class="tk-k">💬 Фраза из сцены</span><span class="tkp-c"></span><button class="tkp-x" data-x="go">Дальше ▶</button></div>
      <b class="tkp-en">${kwWrap(f)}</b><span class="tkp-ru">${esc(f.ru)}</span>
      ${qq?`<div class="tkp-q"><em>Когда так говорят?</em><div class="tkp-o">${opts.map(v=>`<button data-v="${esc(v)}">${esc(v)}</button>`).join('')}</div></div>`:f.use?`<p class="tkp-use">${esc(f.use)}</p>`:''}
      <div class="vq-bar"><i></i></div>`;
    (fs?SW:box).appendChild(w);kwBind(w,f);if(!fs&&window.innerWidth<1000)setTimeout(()=>w.scrollIntoView({behavior:'smooth',block:'nearest'}),50);
    const bar=w.querySelector('.vq-bar i'),ms=qq?16000:7000;requestAnimationFrame(()=>{bar.style.transition=`width ${ms}ms linear`;bar.style.width='0%';});
    let gone=false;const go=d=>{if(gone)return;gone=true;clearTimeout(w._t);setTimeout(()=>{kwHide(0);w.remove();busy=false;if(SV&&!document.querySelector('.tk:not(.tk-intro):not(.tk-end)')){const r=SV.play();if(r&&r.catch)r.catch(()=>{});}},d);};
    const reveal=()=>w.querySelectorAll('.tkp-o button').forEach(b=>{b.disabled=true;if(b.dataset.v===right)b.classList.add('ok');});
    w._t=setTimeout(()=>{reveal();go(qq?1800:0);},ms);
    w.addEventListener('click',e=>{e.stopPropagation();const b=e.target.closest('button');if(!b||gone)return;
      if(b.dataset.x==='go'){sfx('tap');go(0);return;}
      if(b.dataset.v==null)return;clearTimeout(w._t);bar.style.transition='none';const r=b.dataset.v===right;reveal();if(!r)b.classList.add('bad');
      sfx(r?'good':'bad');haptic(r?'ok':'err');
      if(r){P.vq=P.vq||{};if(!P.vq[f.id]){P.vq[f.id]=1;scSave();addGold(5);w.querySelector('.tkp-c').textContent='+5 🪙';}}
      go(r?1100:2600);});}
  function close(){document.querySelectorAll('.tk:not(.tk-intro):not(.tk-end)').forEach(e=>e.remove());}
  function ask(x){close();const wasFs=!!(SW&&SW.classList.contains('sc-pfs'));if(wasFs)scExitFull();
    const f=x.f,n=T.indexOf(x),B=scBuildTiles(f.en,f,all),ctx=ru0?scCtxRow(s,f):null,want=B.tk.map(scNorm);let step=0,tries=0,typed=false;
    const w=document.createElement('div');w.className='tk';w.addEventListener('click',e=>e.stopPropagation());box.appendChild(w);
    w.innerHTML=`<div class="tk-top"><span class="tk-k">${kind==='dict'?'🎧 Диктант':'🎬 Повтори за героем'} · ${n+1} из ${T.length}</span><span class="tk-segs">${T.map((y,j)=>`<i class="${y.res===true?'ok':y.res===false?'bad':j===n?'cur':''}"></i>`).join('')}</span></div>
      ${ctx?`<div class="tk-ctx"><em>Перед этим</em><b>${esc(ctx[2])}</b><small>${esc(ctx[3]).replace(/\n/g,' ')}</small></div>`:''}
      <b class="tk-q">Что прозвучало?${ru0?`<span class="tk-ruq">«${esc(f.ru)}»</span>`:''}</b>
      <div class="tk-hear"><button data-h="0">${SI.play} Ещё раз</button><button data-h="1">🐢 Медленнее</button>${ru0?'':'<button data-h="ru">Перевод</button>'}</div>
      <div class="tk-mask" id="tkMask"></div>
      <div class="tk-type" id="tkType"><input id="tkIn" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="Напиши, что услышал"><button class="sc-btn" id="tkTypeOk">Проверить</button></div>
      <div class="tk-pool" id="tkPool" hidden></div><p class="tk-tip" id="tkTip" hidden>Зажми слово — покажу перевод</p>
      <div class="tk-msg" id="tkMsg"></div><div id="tkDiff"></div>
      <div class="tk-act" id="tkAct"><button class="tk-help" id="tkLet">💡 Первые буквы</button><button class="tk-help" id="tkTiles">🧩 Собрать из слов</button></div>
      <div class="tk-act" id="tkAct2" hidden><button class="sc-btn ghost" id="tkRst">Сбросить</button><button class="sc-btn" id="tkChk">Проверить</button></div>
      <button class="tk-skip" id="tkSkip">Не знаю — показать ответ</button>`;
    const q=s=>w.querySelector(s),msg=t=>{q('#tkMsg').textContent=t||'';};
    // маска реплики: клетки по словам; первые буквы — со 2-й ступени; кубики ложатся в клетки
    const mask=marks=>{q('#tkMask').innerHTML=B.tk.map((t,i)=>{const g=B.got[i];
        return `<span class="tk-w${g?' fill':''}${marks&&g?(marks[i]?' good':' bad'):''}" data-i="${i}" style="--n:${Math.min(12,t.replace(/\s/g,'').length)}">${g?esc(g.w):step>=1?`<i>${esc(t.split(' ').map(x=>x[0]+'·'.repeat(Math.max(0,x.length-1))).join(' '))}</i>`:''}</span>`;}).join('');
      q('#tkMask').querySelectorAll('.tk-w.fill').forEach(el=>el.onclick=()=>{if(x.res!==undefined)return;scSlotTake(B.got,+el.dataset.i);q('#tkDiff').innerHTML='';draw();});};
    const draw=marks=>{mask(marks);q('#tkPool').innerHTML=B.pool.map(y=>`<button class="sc-tile${B.got.includes(y)?' used':''}" data-k="${y.k}"${B.got.includes(y)?' disabled':''}>${esc(y.w)}</button>`).join('');
      q('#tkPool').querySelectorAll('.sc-tile').forEach(b=>b.onclick=()=>{if(x.res!==undefined)return;sfx('tap');const y=B.pool.find(z=>z.k===+b.dataset.k);if(y&&!B.got.includes(y))scSlotPut(B.got,y,B.tk.length);draw();});};
    const toLetters=()=>{if(step>=1)return;step=1;q('#tkLet').remove();draw();msg('');};
    const toTiles=()=>{if(step>=2)return;if(step<1)step=1;step=2;q('#tkType').hidden=true;q('#tkAct').hidden=true;q('#tkPool').hidden=false;q('#tkTip').hidden=false;q('#tkAct2').hidden=false;draw();msg('');};
    draw();
    q('#tkLet').onclick=()=>{sfx('tap');toLetters();};q('#tkTiles').onclick=()=>{sfx('tap');toTiles();};
    q('#tkSkip').onclick=()=>{sfx('tap');done(false);};
    q('#tkRst').onclick=()=>{B.got=[];msg('');q('#tkDiff').innerHTML='';sfx('tap');draw();};
    w.querySelectorAll('.tk-hear [data-h]').forEach(b=>b.onclick=()=>{sfx('tap');const h=b.dataset.h;if(h==='ru'){b.outerHTML=`<span class="tk-ru">«${esc(f.ru)}»</span>`;return;}
      const rt=SV.playbackRate;scPlay(x.a-0.1,x.b+0.15,()=>{if(SV)SV.playbackRate=rt;});if(h==='1'&&SV)SV.playbackRate=.75;});
    // своими словами: прощаем регистр, знаки и мелкие опечатки
    const inp=q('#tkIn');const checkTyped=()=>{const v=scNorm(inp.value).replace(/'/g,''),c=scNorm(f.en).replace(/'/g,'');if(!v){inp.focus();return;}
      if(v===c||(c.length>=6&&lev(v,c)<=Math.max(1,Math.floor(c.length/14)))){typed=true;done(true,step===0?'clean':'hint');return;}
      tries++;haptic('err');sfx('bad');inp.classList.add('bad');setTimeout(()=>inp.classList.remove('bad'),450);
      if(tries===1){toLetters();msg('Не то. Вот первые буквы — попробуй ещё раз или собери из слов.');}else{toTiles();msg('Собери из слов.');}};
    q('#tkTypeOk').onclick=checkTyped;inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();checkTyped();}};
    let tt=0;q('#tkChk').onclick=()=>{if(!B.got.some(Boolean))return;const got=B.tk.map((_,i)=>B.got[i]?scNorm(B.got[i].w):'');if(got.join(' ')===want.join(' ')){done(true,'tiles');return;}
      tt++;haptic('err');sfx('bad');const marks=scPosMarks(got,want);q('#tkDiff').innerHTML=scDiffHTML(got,want,tt>=2);
      if(tt>=2){draw(marks);setTimeout(()=>done(false),1400);return;}
      draw(marks);msg(`На своём месте ${marks.filter(Boolean).length} из ${want.length} (зелёные). Ниже — чего не хватает [ ] и что лишнее. Ещё попытка.`);};
    function done(right,how){x.res=right;x.how=how;sfx(right?(how==='clean'?'win':'good'):'bad');haptic(right?'ok':'err');weekAdd();save();
      if(right&&how!=='tiles')P.m[f.id]=Math.min(3,(P.m[f.id]||0)+1);if(right)scGot(s,f);scSave();
      w.innerHTML=`<div class="tk-res ${right?'ok':'bad'}"><span class="tk-k">${!right?'Вот что прозвучало':how==='clean'?'🔥 Сам, без подсказок':how==='hint'?'✓ Сам, с подсказкой':'✓ Собрал из слов'}</span>
        <b class="ep-c-en">${kwWrap(f)}</b><span class="ep-c-ru">${esc(f.ru)}</span>${phInfoHTML(f,{once:true})}
        <button class="sc-btn" id="tkGo">Смотреть дальше ▶</button></div>`;
      kwBind(w,f);
      w.querySelector('#tkGo').onclick=()=>{sfx('tap');kwHide(0);close();busy=false;x.shown=true;const ov=$('#scvo');if(ov)ov.style.display='none';
        scPlay(x.b+0.1,p.b-p.a+1,()=>{});if(SSTOP)SSTOP.full=true;
        if(wasFs)scFull();else if(window.innerWidth<1000)window.scrollTo({top:0,behavior:'smooth'});};}
    setTimeout(()=>{if(window.innerWidth<1000)w.scrollIntoView({behavior:'smooth',block:'start'});else if(matchMedia('(hover:hover)').matches)try{inp.focus({preventScroll:true});}catch(e){}},wasFs?350:60);}
  return {T,reset(){T.forEach(x=>{x.done=x.shown=false;x.res=undefined;});PL.forEach(y=>y.done=false);busy=false;close();},close};}
// экран эпизода для hero/dict: видео на всю ширину, задание под видео
function renderScEpTask(id,i){
  const s=scOf(id),p=s.parts[i],P=scP(id),FX=scTaskFX(s,p),kind=s.mode;
  SCUR={id,i};store.scLast={id,i};save();
  scMount(s,`
    <div class="sc-head"><button class="sc-back" id="scb">${ui('back')}</button><div><span class="sc-meta">${esc(s.title)} · эпизод ${String(i+1).padStart(2,'0')} из ${s.parts.length}</span><h1>${esc(p.t)}</h1></div></div>
    <div class="tk-main"><div class="sc-v" id="scvw"><div class="sc-over" id="scvo"><button id="scplay" aria-label="Смотреть">▶</button></div></div>
    ${scSeek()}
    ${scCtrl()}<div class="tk-box" id="tkBox"></div></div>`,'sctask');
  scVideo($('#scvw'),s,p);$('#scvw').appendChild($('#scvo'));
  SW._ph=null;SW._stopPh=false;SW._vq=false;
  const E=scTaskAttach(s,p,FX,kind,$('#tkBox'));
  const ov=on=>{const o=$('#scvo');if(o)o.style.display=on?'':'none';};
  const run=()=>{E.reset();ov(false);scPlay(scStartAt(s,p),p.b-p.a+1,()=>ov(true));if(SSTOP)SSTOP.full=true;};
  const intro=()=>{$('#tkBox').innerHTML=`<div class="tk tk-intro">${kind==='hero'
      ?`<b>🎬 Повтори за героем</b><p>После полезных реплик видео встанет: вспомни и напиши, что он сказал. Не выходит — первые буквы, потом собрать из слов. Верные фразы — в твой словарь.</p>`
      :`<b>🎧 Диктант по ходу фильма</b><p>Главные реплики идут без субтитров. Сразу после каждой — пауза: напиши, что услышал. Можно переслушать, замедлить, взять подсказку или собрать из слов.</p>`}
      <button class="sc-btn" id="tkStart">${P.done.includes(i)?'Пройти ещё раз ▶':'Смотреть эпизод ▶'}</button></div>`;
    $('#tkStart').onclick=()=>{sfx('tap');$('#tkBox').innerHTML='';run();};};
  function finish(){if(SV&&!SV.paused)SV.pause();ov(true);E.close();const ok=E.T.filter(x=>x.res).length,n=E.T.length,acc=n?ok/n:1,st=acc>=1?3:acc>=.7?2:1,first=!P.done.includes(i);
    P.w[i]=1;if(first)P.done.push(i);P.st=P.st||{};P.st[i]=Math.max(P.st[i]||0,st);
    FX.forEach(f=>{if(!P.r[f.id])P.r[f.id]=[0,Date.now()+SC_DAYS[0]*864e5];});scSave();remindSync();ev('ep_quiz',id);sfx(ok===n?'win':'learn');setTimeout(dictFly,700);
    const nx=s.parts[i+1],rwNew=rwGive(s,i);
    $('#tkBox').innerHTML=`<div class="tk tk-end"><div class="res-stars">${[1,2,3].map(j=>`<i class="${j<=st?'on':''}" style="animation-delay:${.1+j*.15}s">★</i>`).join('')}</div>
      <div class="tk-big">${ok} из ${n}</div><p class="tk-sub">${ok===n?'Чисто. Эти фразы вернутся в повторении — завтра, через 3 и 7 дней.':'Ошибки не страшны — эти фразы вернутся в повторении завтра.'}</p>
      ${E.T.map(x=>`<div class="tk-li ${x.res?'ok':'bad'}" data-fid="${x.f.id}"><i>${x.res?'✓':'✗'}</i><div><b>${kwWrap(x.f)}</b><span>${esc(x.f.ru)}</span>${scNoteS(x.f)?`<small>${esc(scNoteS(x.f))}</small>`:''}</div></div>`).join('')}
      ${rwEndHTML(s,i,rwNew)}
      ${nx?`<button class="sc-btn" id="tkNext">Следующий эпизод →</button>`:`<button class="sc-btn" id="tkBoss">👑 Финал сцены — на слух</button>`}
      <button class="sc-btn ghost" id="tkKv">⚔️ Дуэль с другом по эпизоду</button><button class="sc-btn ghost" id="tkAgain">Пройти ещё раз</button><button class="tk-skip" id="tkPath">К пути сцены</button></div>`;
    kwBind($('#tkBox'),el=>{const c=el.closest('[data-fid]');return c?FX.find(f=>f.id===c.dataset.fid):null;});rwEndBind($('#tkBox'),s,i);
    if($('#tkNext'))$('#tkNext').onclick=()=>{sfx('tap');renderScEp(id,i+1);};
    if($('#tkBoss'))$('#tkBoss').onclick=()=>{sfx('tap');scBossStart(id);};
    $('#tkKv').onclick=()=>{sfx('tap');kvSheet(id,i);};
    $('#tkAgain').onclick=()=>{sfx('tap');window.scrollTo({top:0,behavior:'smooth'});run();$('#tkBox').innerHTML='';};
    $('#tkPath').onclick=()=>{sfx('tap');renderScene(id);};
    if(window.innerWidth<1000)setTimeout(()=>{const b=$('#tkBox');if(b)b.scrollIntoView({behavior:'smooth',block:'start'});},80);}
  SV.addEventListener('ended',()=>{ov(true);finish();});
  $('#scplay').onclick=()=>{if(!$('#tkBox .tk:not(.tk-intro):not(.tk-end)'))$('#tkBox').innerHTML='';run();};
  scBindCtrl(()=>{$('#tkBox').innerHTML='';run();});scBindSeek();
  $('#scb').onclick=()=>{if(navBack())return;sfx('tap');renderScene(id);};
  intro();
}
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
// уже выученное до 11.0 — сразу в словаре (на повторении или отвечено хотя бы раз)
(function dictBackfill(){let ch=false;SCENES.forEach(s=>{const P=SC[s.id];if(!P||s.kind==='clip')return;
  s.parts.forEach(p=>scAct(p.ph).forEach(f=>{if(((P.m||{})[f.id]||0)>=1||(P.r||{})[f.id]){P.got=P.got||{};if(!P.got[f.id]){P.got[f.id]=Date.now()-864e5*7;ch=true;}}}));});
  if(ch)try{localStorage.setItem(SCK,JSON.stringify(SC));}catch(e){}})();
// теги карты: тон, темы, статус
function dictTags(s,f){const P=scP(s.id),T=[scTag(f)[0],...fTopics(f)],got=(P.got||{})[f.id],r=P.r[f.id];
  if(got&&Date.now()-got<3*864e5)T.push('новые');if(r&&r[1]<=Date.now())T.push('повторить');if((P.m[f.id]||0)>=3)T.push('выучено');return T;}
const DX={seg:'ph',lang:'en',show:null,sid:null,tag:'',q:'',mytag:'',mytab:'rep'};
const DX_TH={wolf:'#D4AF37',noir:'#c8323a',bone:'#E8DCC4',taxi:'#F2C200',bunker:'#C9B98A',pump:'#ff4fa0',ocean:'#D9B26F',meth:'#9FD356',studio:'#FF5A4E'};
function dcHTML(c,i){const {s,f,pi,p}=c;
  if(!dictHas(s,f))return `<button class="dc lock" data-sid="${s.id}" data-fid="${f.id}" style="--c:${DX_TH[s.theme]||'#F5C451'};--d:${i}"><span class="dc-ep">эп. ${pi+1}</span><span class="dc-q">?</span><small>Пройди «${esc(p.t)}»</small></button>`;
  const P=scP(s.id),r=P.r[f.id],due=r&&r[1]<=Date.now();
  return `<button class="dc t-${scTag(f)[1]}" data-sid="${s.id}" data-fid="${f.id}" style="--c:${DX_TH[s.theme]||'#F5C451'};--d:${i}"><span class="dc-ep">эп. ${pi+1}</span>${due?'<i class="dc-due" title="Пора повторить">🔁</i>':''}<b class="dc-en">${esc(dxT(f))}</b><span class="dc-ru">${esc(f.ru)}</span><span class="dc-st">${'●'.repeat(Math.min(3,P.m[f.id]||0))}${'○'.repeat(3-Math.min(3,P.m[f.id]||0))}</span></button>`;}
// 11.5: словарь — иерархия как в Hearthstone: Фильмы / Сериалы → название → сцена → карты эпизодов. На экране один уровень.
// 🇬🇧/🇩🇪 — тот же словарь 1:1 (те же фильмы и тот же прогресс P.got), карты на немецком.
const dxT=f=>DX.lang==='de'?(f.de||f.en):f.en;
const dxShows=()=>{const G=[],by={};for(const s of dictScenes()){const k=dictFilm(s);if(!by[k]){by[k]=[];G.push(k);}by[k].push(s);}return G.map(k=>({k,L:by[k],kind:['series','interview'].includes(by[k][0].kind)?by[k][0].kind:'film'}));};
function dictTabHTML(){const [g,t]=dictCount(),my=mywAll().length;
  return `<div class="dx anim"><div class="dx-head"><h1 class="title">Словарь</h1><div class="dx-count"><b>${g}</b><span> / ${t}</span></div></div>
    <div class="dx-bar"><i style="width:${t?Math.round(g/t*100):0}%"></i></div>
    <div class="dx-seg"><button data-dseg="ph" class="${DX.seg==='ph'?'on':''}">🎬 Фразы из кино</button><button data-dseg="my" class="${DX.seg==='my'?'on':''}">⭐ Мои слова${my?` <i>${my}</i>`:''}</button></div>
    <div id="dxBody"></div></div>`;}
function bindDict(){$$('[data-dseg]').forEach(b=>b.onclick=()=>{if(DX.seg===b.dataset.dseg)return;sfx('tap');DX.seg=b.dataset.dseg;$$('[data-dseg]').forEach(x=>x.classList.toggle('on',x===b));dxBody();});dxBody();}
// уровень вверх (кнопка «‹» и системная «назад»)
function dxUp(){if(DX.seg==='my'){return false;}if(DX.sid){const sh=dxShows().find(x=>x.k===DX.show);DX.sid=null;if(!sh||sh.L.length<2)DX.show=null;dxBody(-1);return true;}
  if(DX.show){DX.show=null;dxBody(-1);return true;}if(DX.q||DX.tag){DX.q='';DX.tag='';dxBody(-1);return true;}return false;}
function dxBody(dir){const box=$('#dxBody');if(!box)return;if(DX.seg==='my'){backBtn(false);dxMy(box);return;}
  const deep=!!(DX.sid||DX.show||DX.q||DX.tag);try{backBtn(deep);}catch(e){}
  const lang=`<div class="dx-lang"><button data-dl="en" class="${DX.lang!=='de'?'on':''}">${FLAG.en} English</button><button data-dl="de" class="${DX.lang==='de'?'on':''}">${FLAG.de} Deutsch</button></div>`;
  let html='';
  if(DX.sid){const s=scOf(DX.sid),sh=dxShows().find(x=>x.k===dictFilm(s)),L=sh?sh.L:[s],n=L.indexOf(s);
    html=`<div class="dx-crumb"><button class="dx-up" id="dxUp">${ui('back')}</button><span><em>${esc(dictFilm(s))}${L.length>1?` · сцена ${n+1} из ${L.length}`:''}</em><b>${esc(s.sub||s.title)}</b></span></div>${lang}
      <div class="dx-book" id="dxBook"><div class="dx-page" id="dxPage">${dxScene(s)}</div></div>
      ${L.length>1?`<div class="dx-nav"><button id="dxPrev"${n?'':' disabled'}>${ui('back')}</button><span>сцена ${n+1} из ${L.length}</span><button id="dxNext"${n<L.length-1?'':' disabled'}>${ui('fwd')}</button></div>`:''}`;}
  else if(DX.show){const sh=dxShows().find(x=>x.k===DX.show);if(!sh){DX.show=null;return dxBody();}const [g,t]=dictCount(sh.L),s0=sh.L[0];
    html=`<div class="dx-crumb"><button class="dx-up" id="dxUp">${ui('back')}</button><span><em>${SC_KIND[sh.kind]||'Фильм'}</em><b>${esc(sh.k)}</b></span></div>${lang}
      <div class="dx-showh"><span class="dx-pst" style="background-image:url('${scCover(s0,'poster.jpg')}'),url('${scCover(s0,'cover.jpg')}')"></span><span><b>${g}</b> из ${t} карт<small>${sh.L.length} ${plural(sh.L.length,['сцена','сцены','сцен'])}</small><i class="dx-mb"><i style="width:${t?g/t*100:0}%"></i></i></span></div>
      <div class="dx-scl">${sh.L.map(s=>{const [a,b]=dictCount([s]);return `<button class="dx-sci" data-sid="${s.id}" style="--ban:url('${scCover(s,'cover.jpg')}')"><span><em>${esc(s.ep||'')}</em><b>${esc(s.sub||s.title)}</b><small>${s.parts.length} ${plural(s.parts.length,['эпизод','эпизода','эпизодов'])}</small></span><span class="dx-got"><b>${a}</b>/${b}<i style="--p:${b?a/b*100:0}%"></i></span></button>`;}).join('')}</div>`;}
  else if(DX.q||DX.tag){html=`<div class="dx-crumb"><button class="dx-up" id="dxUp">${ui('back')}</button><span><em>Поиск</em><b>${DX.tag?'#'+esc(DX.tag):'«'+esc(DX.q)+'»'}</b></span></div>
      <div class="dx-tools"><input class="dx-q" id="dxQ" placeholder="🔍 Найти фразу или перевод" value="${esc(DX.q)}" autocomplete="off"></div>${dxTagsHTML(true)}<div class="dx-page" id="dxPage">${dxResults()}</div>`;}
  else{const SH=dxShows(),row=(title,L)=>L.length?`<div class="dx-shelf"><h3>${title}</h3><div class="dx-shows">${L.map(sh=>{const [g,t]=dictCount(sh.L),s0=sh.L[0];
      return `<button class="dx-show" data-show="${esc(sh.k)}" style="--c:${DX_TH[s0.theme]||'#F5C451'}"><span class="dx-pst" style="background-image:url('${scCover(s0,'poster.jpg')}'),url('${scCover(s0,'cover.jpg')}')"></span><b>${esc(sh.k)}</b><small>${g} / ${t}</small><i class="dx-mb"><i style="width:${t?g/t*100:0}%"></i></i></button>`;}).join('')}</div></div>`:'';
    html=`${lang}<div class="dx-tools"><input class="dx-q" id="dxQ" placeholder="🔍 Найти фразу или перевод" value="" autocomplete="off"></div>${dxTagsHTML()}
      ${row('Фильмы',SH.filter(x=>x.kind==='film'))}${row('Сериалы',SH.filter(x=>x.kind==='series'))}${row('Интервью',SH.filter(x=>x.kind==='interview'))}`;}
  box.innerHTML=`<div class="dx-lvl">${html}</div>`;
  if(dir)box.firstChild.animate([{opacity:0,transform:`translateX(${dir>0?28:-28}px)`},{opacity:1,transform:'none'}],{duration:260,easing:'cubic-bezier(.2,.9,.3,1)'});
  box.querySelectorAll('[data-dl]').forEach(b=>b.onclick=()=>{if(DX.lang===b.dataset.dl)return;sfx('tap');DX.lang=b.dataset.dl;dxBody();});
  if($('#dxUp'))$('#dxUp').onclick=()=>{sfx('tap');dxUp();};
  box.querySelectorAll('[data-show]').forEach(b=>b.onclick=()=>{sfx('tap');const sh=dxShows().find(x=>x.k===b.dataset.show);DX.show=sh.k;DX.sid=sh.L.length===1?sh.L[0].id:null;dxBody(1);});
  box.querySelectorAll('.dx-sci').forEach(b=>b.onclick=()=>{sfx('tap');DX.sid=b.dataset.sid;dxBody(1);});
  box.querySelectorAll('[data-tag]').forEach(b=>b.onclick=()=>{sfx('tap');DX.tag=DX.tag===b.dataset.tag?'':b.dataset.tag;dxBody(DX.tag?1:-1);});
  if($('#dxQ')){let qt=0;$('#dxQ').oninput=e=>{clearTimeout(qt);qt=setTimeout(()=>{const was=!!(DX.q||DX.tag);DX.q=e.target.value.trim();if(!was&&!DX.q)return;
      if(was&&$('#dxPage')&&DX.q){$('#dxPage').innerHTML=dxResults();dxBindCards();return;}const p=e.target.selectionStart;dxBody();const n=$('#dxQ');if(n){n.focus();try{n.setSelectionRange(p,p);}catch(x){}}},220);};}
  if($('#dxPrev'))$('#dxPrev').onclick=()=>dxFlip(-1);if($('#dxNext'))$('#dxNext').onclick=()=>dxFlip(1);
  const bk=$('#dxBook');if(bk){let x0=null;bk.addEventListener('touchstart',e=>{x0=e.touches[0].clientX;},{passive:true});
    bk.addEventListener('touchend',e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>60)dxFlip(dx<0?1:-1);},{passive:true});}
  dxBindCards();}
function dxTagsHTML(full){const SS=dictScenes();let all=[...new Set(SS.flatMap(s=>dictCards(s).filter(c=>dictHas(s,c.f)).flatMap(c=>dictTags(s,c.f))))];
  const order=['новые','повторить','выучено','нейтрально','разговорное','официально','грубо'];all.sort((a,b)=>(order.indexOf(a)+1||99)-(order.indexOf(b)+1||99));
  if(!full)all=all.filter(t=>['новые','повторить','выучено'].includes(t));   // на полках — только статус, остальные теги — в поиске
  return all.length?`<details class="dx-flt"${DX.tag?' open':''}><summary>⚙ Фильтры${DX.tag?` · <b>#${esc(DX.tag)}</b>`:''}</summary><div class="dx-tags">${all.map(t=>`<button data-tag="${esc(t)}" class="${DX.tag===t?'on':''}">#${esc(t)}</button>`).join('')}</div></details>`:'';}   // 12.5: теги спрятаны за «Фильтры»
let DXK=0;
function dxSceneBlock(s,cards,full){const [g,t]=dictCount([s]);const eps=s.parts.map((p,pi)=>({p,pi,c:cards.filter(c=>c.pi===pi)})).filter(e=>e.c.length);
  return `<div class="dx-sc">${full?'':`<div class="dx-sch" style="--ban:url('${scCover(s,'cover.jpg')}')"><span><em>${esc(dictFilm(s))}</em><b>${esc(s.sub||s.title)}</b></span><span class="dx-got"><b>${g}</b>/${t}<i style="--p:${t?g/t*100:0}%"></i></span></div>`}
    ${eps.map(e=>{const has=e.c.filter(c=>dictHas(s,c.f)).length;return `<div class="dx-ep"><div class="dx-eph"><b>Эпизод ${e.pi+1} · ${esc(e.p.t)}</b>${full?`<small>${has} из ${e.c.length}</small>`:''}</div><div class="dx-grid">${e.c.map(c=>dcHTML(c,DXK++)).join('')}</div></div>`;}).join('')}</div>`;}
function dxScene(s){DXK=0;return dxSceneBlock(s,dictCards(s),true);}
function dxResults(){DXK=0;const q=DX.q.toLowerCase();const hit=c=>dictHas(c.s,c.f)&&(!DX.tag||dictTags(c.s,c.f).includes(DX.tag))&&(!q||(c.f.en+' '+(c.f.de||'')+' '+c.f.ru+' '+(c.f.use||'')).toLowerCase().includes(q));
  const res=dictScenes().map(s=>({s,cards:dictCards(s).filter(hit)})).filter(x=>x.cards.length);
  return res.length?res.map(x=>dxSceneBlock(x.s,x.cards,false)).join(''):`<div class="dx-empty">Ничего не нашёл среди твоих карт.<small>Карты появляются, когда верно отвечаешь на фразы в эпизодах.</small></div>`;}
function dxBindCards(){const box=$('#dxPage');if(!box)return;
  box.querySelectorAll('.dc').forEach(b=>b.onclick=()=>{const s=scOf(b.dataset.sid);let c=null;dictCards(s).forEach(x=>{if(x.f.id===b.dataset.fid)c=x;});if(!c)return;
    if(!dictHas(s,c.f)){haptic('err');b.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:280});toast(`🔒 Пройди эпизод ${c.pi+1} «${c.p.t}» — карта откроется`);
      clearTimeout(b._t);if(b._arm){sfx('tap');renderScEp(s.id,c.pi);return;}b._arm=true;b._t=setTimeout(()=>{b._arm=false;},2500);return;}
    sfx('tap');dxOpen(b,c);});
  box.querySelectorAll('.dc').forEach((b,i)=>b.animate([{opacity:0,transform:'translateY(14px) scale(.96)'},{opacity:1,transform:'none'}],{duration:320,delay:Math.min(i,16)*28,easing:'cubic-bezier(.2,.9,.3,1)',fill:'backwards'}));}
// перелистывание сцен одного фильма как страниц книги
function dxFlip(d){const s=scOf(DX.sid);if(!s)return;sfx('page');const sh=dxShows().find(x=>x.k===dictFilm(s)),L=sh?sh.L:[s],n=L.indexOf(s)+d;if(n<0||n>=L.length){haptic('err');return;}
  const pg=$('#dxPage');if(!pg||pg._busy)return;pg._busy=true;sfx('tap');haptic('sel');pg.style.transformOrigin=d>0?'left center':'right center';
  pg.animate([{transform:'none',opacity:1},{transform:`rotateY(${d>0?-70:70}deg)`,opacity:0}],{duration:230,easing:'cubic-bezier(.5,0,.9,.6)'}).onfinish=()=>{DX.sid=L[n].id;dxBody();const p2=$('#dxPage');if(!p2)return;
    p2.style.transformOrigin=d>0?'right center':'left center';p2.animate([{transform:`rotateY(${d>0?70:-70}deg)`,opacity:0},{transform:'none',opacity:1}],{duration:300,easing:'cubic-bezier(.15,.7,.3,1)'});};}
// открыть карту: вылетает из сетки в центр, внутри — кусок сцены с этой фразой
function dxOpen(btn,c){const {s,f,p,pi}=c,r0=btn.getBoundingClientRect();
  const o=document.createElement('div');o.className='dxo';
  o.innerHTML=`<div class="dxo-dim"></div><div class="dxc" style="--c:${DX_TH[s.theme]||'#F5C451'}">
    <div class="dxv-w"><video class="dxv" playsinline webkit-playsinline preload="auto" poster="${assetUrl(scEpKey(s,pi,'jpg'))}"></video><button class="dxv-p" aria-label="Играть">${SI.play}</button></div>
    <div class="dxc-b"><div class="dxc-top"><span class="dxc-src">${esc(dictFilm(s))} · ${esc(s.sub||'')} · эп. ${pi+1}</span><button class="dxc-x" aria-label="Закрыть">${ui('close')}</button></div>
      <b class="ep-c-en">${DX.lang==='de'?esc(f.de||f.en):kwWrap(f)}</b>${DX.lang==='de'?`<span class="dxc-alt">${esc(f.en)}</span>`:''}<span class="ep-c-ru">${esc(f.ru)}</span>
      <div class="dxc-tags">${dictTags(s,f).map(t=>`<i>#${esc(t)}</i>`).join('')}</div>
      ${phInfoHTML(f,{fact:scP(s.id).done.includes(pi)})}
      <div class="dxc-acts"><button data-v="re">${SI.play} Ещё раз</button><button data-v="slow">🐢 Медленнее</button><button data-v="ep">Открыть эпизод →</button></div></div></div>`;
  document.body.appendChild(o);document.body.classList.add('dx-open');
  const card=o.querySelector('.dxc'),R=card.getBoundingClientRect(),k=R.width/card.offsetWidth||1;
  const dx=(r0.left+r0.width/2-(R.left+R.width/2))/k,dy=(r0.top+r0.height/2-(R.top+R.height/2))/k,sc=Math.max(.15,r0.width/R.width);
  card.animate([{transform:`translate(${dx}px,${dy}px) scale(${sc}) rotateY(-35deg)`,opacity:.5},{transform:'none',opacity:1}],{duration:460,easing:'cubic-bezier(.2,.9,.25,1)'});
  o.querySelector('.dxo-dim').animate([{opacity:0},{opacity:1}],{duration:300});
  const v=o.querySelector('.dxv'),a=Math.max(0,f.a-p.a-0.15),b=f.b-p.a+0.2,pb=o.querySelector('.dxv-p');
  const play=slow=>{v.playbackRate=slow?.75:1;try{if(Math.abs(v.currentTime-a)>0.05)v.currentTime=a;}catch(e){}const pr=v.play();if(pr&&pr.catch)pr.catch(()=>{pb.hidden=false;});pb.hidden=true;};
  v.src=assetUrl(scEpKey(s,pi,'mp4'))+'#t='+a.toFixed(2);v.volume=store.scVol==null?1:store.scVol;try{musDuck(true);}catch(e){}
  v.addEventListener('timeupdate',()=>{if(v.currentTime>=b){v.pause();pb.hidden=false;}});
  v.addEventListener('loadedmetadata',()=>{if(v.currentTime<a-0.1||v.currentTime>b)v.currentTime=a;},{once:true});
  play(false);
  pb.onclick=()=>{sfx('tap');play(false);};
  phBind(card,f);
  const close=()=>{if(o._c)return;o._c=true;v.pause();try{musDuck(false);}catch(e){}kwHide(0);document.removeEventListener('keydown',esc_);document.body.classList.remove('dx-open');
    card.animate([{transform:'none',opacity:1},{transform:'scale(.9)',opacity:0}],{duration:200,easing:'ease-in',fill:'forwards'});
    o.querySelector('.dxo-dim').animate([{opacity:1},{opacity:0}],{duration:220,fill:'forwards'}).onfinish=()=>o.remove();};
  const esc_=e=>{if(e.key==='Escape')close();};document.addEventListener('keydown',esc_);
  o.querySelector('.dxo-dim').onclick=close;o.querySelector('.dxc-x').onclick=close;
  o.querySelectorAll('[data-v]').forEach(x=>x.onclick=()=>{sfx('tap');const t=x.dataset.v;if(t==='ep'){close();setTimeout(()=>srOpen(s.id,pi,f.a),220);return;}play(t==='slow');});
  let y0=null;card.addEventListener('touchstart',e=>{y0=e.touches[0].clientY;},{passive:true});card.addEventListener('touchend',e=>{if(y0!=null&&e.changedTouches[0].clientY-y0>110&&card.scrollTop<=0)close();y0=null;},{passive:true});}
// 11.5: «Мои слова» — книга: вкладки «Повторить» / «Выучено», слова по эпизодам, «Проверить себя», «В проверку»
const mywLearned=x=>(x.st||0)>=3&&!(x.due&&x.due<=Date.now());
function dxMy(box){const L=mywAll(),tagsOf=x=>[...(x.tags||[]),x.own?'добавлено мной':(scOf(x.sid)?dictFilm(scOf(x.sid)):'')].filter(Boolean);
  const tags=[...new Set(L.flatMap(tagsOf))],q=DX.q.toLowerCase(),rep=L.filter(x=>!mywLearned(x)),lrn=L.filter(mywLearned);
  const T=DX.mytab==='lrn'?lrn:rep,V=T.filter(x=>(!DX.mytag||tagsOf(x).includes(DX.mytag))&&(!q||(x.w+' '+(x.ru||'')).toLowerCase().includes(q)));
  const grp={},G=[];V.forEach(x=>{const s=scOf(x.sid),k=s?x.sid+'|'+x.pi:'own';if(!grp[k]){grp[k]={s,pi:x.pi,L:[]};G.push(k);}grp[k].L.push(x);});
  const card=(x,i)=>{const s=scOf(x.sid),soon=x.due&&x.due>Date.now();
    return `<div class="dm" style="--d:${i}"><div class="dm-h"><b>${esc(x.w)}</b><span class="dm-st">${'●'.repeat(Math.min(5,x.st||0))}${'○'.repeat(Math.max(0,5-(x.st||0)))}</span><button class="dm-del" data-k="${esc(x.k)}" aria-label="Убрать">${ui('close')}</button></div>${x.ru?`<span class="dm-ru">${esc(x.ru)}</span>`:''}
      ${x.line?`<div class="dm-line">${esc(x.line)}</div>`:''}${(x.tags||[]).length?`<div class="dm-tags">${x.tags.map(t=>`<i>#${esc(t)}</i>`).join('')}</div>`:''}
      <div class="dm-acts">${s?`<button class="dm-go" data-s="${x.sid}" data-i="${x.pi}" data-a="${x.a}">${SI.play} В сцене</button>`:''}${x.ru&&soon?`<button class="dm-rev" data-k="${esc(x.k)}">🔁 В проверку</button>`:x.ru?'<span class="dm-due">в проверке</span>':''}</div></div>`;};
  box.innerHTML=`<div class="dm-book"><div class="dm-tabs"><button data-mt="rep" class="${DX.mytab!=='lrn'?'on':''}">Повторить <i>${rep.length}</i></button><button data-mt="lrn" class="${DX.mytab==='lrn'?'on':''}">Выучено <i>${lrn.length}</i></button></div>
      <div class="dm-tools"><input class="dx-q" id="dxQ" placeholder="🔍 Найти в моих словах" value="${esc(DX.q)}" autocomplete="off"><button class="dm-addb" id="dmAddB">＋ Своё</button></div>
      <form class="dx-add" id="dxAdd" autocomplete="off" hidden><div class="dx-addr"><input name="w" placeholder="Слово или фраза (англ.)" required maxlength="60"><input name="ru" placeholder="Перевод" maxlength="80"></div>
        <div class="dx-addr"><input name="tag" placeholder="#тег — например работа" maxlength="24" list="dxTagL"><datalist id="dxTagL">${tags.map(t=>`<option value="${esc(t)}">`).join('')}</datalist><button class="sc-btn" type="submit">＋ В словарь</button></div></form>
      ${tags.length?`<div class="dx-tags">${tags.map(t=>`<button data-mtag="${esc(t)}" class="${DX.mytag===t?'on':''}">#${esc(t)}</button>`).join('')}</div>`:''}
      ${V.filter(x=>x.ru).length?`<button class="sc-btn dx-train" id="dxTrain">Проверить себя · ${Math.min(8,V.filter(x=>x.ru).length)} ${plural(Math.min(8,V.filter(x=>x.ru).length),['слово','слова','слов'])} →</button>`:''}
      <div class="dx-my">${G.length?G.map(k=>{const g=grp[k];return `<div class="dm-grp"><div class="dm-gh">${g.s?`<span class="dm-gi" style="background-image:url('${scCover(g.s,'cover.jpg')}')"></span><b>${esc(dictFilm(g.s))} · эп. ${g.pi+1}</b><small>${esc((g.s.parts[g.pi]||{}).t||'')}</small>`:'<b>Добавлено мной</b>'}</div>${g.L.map(card).join('')}</div>`;}).join('')
        :`<div class="dx-empty">${L.length?(DX.mytab==='lrn'?'Пока ничего не выучено — проверяй себя, и слова переедут сюда.':'Всё выучено 👏'):'Тут будут твои слова.'}<small>Сохраняй незнакомые слова прямо из сцен (нажми на слово → «☆ В мои слова») или добавь своё.</small></div>`}</div></div>`;
  const re=()=>{const y=window.scrollY;dxMy(box);window.scrollTo(0,y);};
  box.querySelectorAll('[data-mt]').forEach(b=>b.onclick=()=>{if(DX.mytab===b.dataset.mt)return;sfx('tap');DX.mytab=b.dataset.mt;const pg=box.querySelector('.dx-my');dxMy(box);const n=box.querySelector('.dx-my');if(n)n.animate([{opacity:0,transform:`rotateY(${DX.mytab==='lrn'?-25:25}deg)`},{opacity:1,transform:'none'}],{duration:320,easing:'cubic-bezier(.2,.9,.3,1)'});});
  $('#dmAddB').onclick=()=>{sfx('tap');const f=$('#dxAdd');f.hidden=!f.hidden;if(!f.hidden)f.w.focus();};
  $('#dxAdd').onsubmit=e=>{e.preventDefault();const F=e.target,w=F.w.value.trim(),ru=F.ru.value.trim(),tg=F.tag.value.trim().replace(/^#/,'').toLowerCase();if(!w)return;
    store.myw=store.myw||{};const k=mywKey('own',w.toLowerCase());store.myw[k]={k,w,ru,de:'',sid:'own',pi:0,line:'',lineRu:'',a:0,at:Date.now(),lvl:0,st:0,due:Date.now()+36e5,own:true,tags:tg?[tg]:[]};
    save();sfx('good');haptic('ok');toast('⭐ Добавил в «Мои слова»');DX.mytab='rep';dxMy(box);const c=box.querySelector('.dm');if(c)c.animate([{transform:'scale(.8)',opacity:0},{transform:'none',opacity:1}],{duration:380,easing:'cubic-bezier(.2,1.4,.4,1)'});};
  let qt=0;$('#dxQ').oninput=e=>{clearTimeout(qt);qt=setTimeout(()=>{DX.q=e.target.value.trim();const p=e.target.selectionStart;dxMy(box);const n=$('#dxQ');if(n){n.focus();try{n.setSelectionRange(p,p);}catch(x){}}},220);};
  box.querySelectorAll('[data-mtag]').forEach(b=>b.onclick=()=>{sfx('tap');DX.mytag=DX.mytag===b.dataset.mtag?'':b.dataset.mtag;re();});
  if($('#dxTrain'))$('#dxTrain').onclick=()=>{sfx('tap');renderMyWordsQuiz(V);};
  box.querySelectorAll('.dm-del').forEach(b=>b.onclick=()=>{mywDel(b.dataset.k);save();sfx('tap');re();});
  box.querySelectorAll('.dm-rev').forEach(b=>b.onclick=()=>{const it=store.myw[b.dataset.k];if(!it)return;it.due=Date.now()-1;save();sfx('good');haptic('ok');toast('🔁 Слово в сегодняшнем повторении');re();});
  box.querySelectorAll('.dm-go').forEach(b=>b.onclick=()=>{sfx('tap');const x=store.myw[b.closest('.dm').querySelector('.dm-del').dataset.k];momOpen(b.dataset.s,+b.dataset.i,+b.dataset.a,x&&x.w);});
  box.querySelectorAll('.dm').forEach((b,i)=>b.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:280,delay:Math.min(i,12)*30,fill:'backwards'}));}
function renderMyWords(){DX.seg='my';renderTab('dict');}
// новые карты после эпизода: вылетают, переворачиваются и с ускорением падают в словарь
function dictFly(){const L=DICT_NEW.splice(0);if(!L.length)return;
  const cards=L.map(x=>{const s=scOf(x.sid);let f=null;if(s)s.parts.forEach(p=>p.ph.forEach(y=>{if(y.id===x.fid)f=y;}));return f?{s,f}:null;}).filter(Boolean);if(!cards.length)return;
  const show=cards.slice(0,6),o=document.createElement('div');o.className='dfly';
  o.innerHTML=`<div class="dfly-h"><b>+${cards.length} ${plural(cards.length,['карта','карты','карт'])} в словарь</b><span>Ты заработал эти фразы</span></div>
    <div class="dfly-row">${show.map(c=>`<div class="dc t-${scTag(c.f)[1]}" style="--c:${DX_TH[c.s.theme]||'#F5C451'}"><span class="dc-ep">новая</span><b class="dc-en">${esc(scT(c.f))}</b><span class="dc-ru">${esc(c.f.ru)}</span></div>`).join('')}</div>
    <div class="dfly-book"><span>📖</span><b>Словарь</b><i id="dflyN">${Math.max(0,dictCount()[0]-cards.length)}</i></div><small class="dfly-skip">нажми, чтобы пропустить</small>`;
  document.body.appendChild(o);sfx('learn');haptic('ok');
  const els=[...o.querySelectorAll('.dfly-row .dc')],book=o.querySelector('.dfly-book'),nEl=o.querySelector('#dflyN');
  o.animate([{opacity:0},{opacity:1}],{duration:260,fill:'forwards'});
  els.forEach((e,i)=>e.animate([{transform:'translateY(70px) rotateY(180deg) scale(.55)',opacity:0},{transform:'none',opacity:1}],{duration:560,delay:180+i*140,easing:'cubic-bezier(.2,1.25,.4,1)',fill:'backwards'}));
  let gone=false;const fly=()=>{if(gone)return;gone=true;const B=book.getBoundingClientRect();let landed=0;
    els.forEach((e,i)=>{const r=e.getBoundingClientRect(),k=r.width/e.offsetWidth||1,dx=(B.left+B.width/2-(r.left+r.width/2))/k,dy=(B.top+B.height/2-(r.top+r.height/2))/k;
      e.animate([{transform:'none',opacity:1},{transform:`translate(${dx}px,${dy}px) scale(.14) rotate(${i%2?18:-18}deg)`,opacity:.35}],{duration:640,delay:i*95,easing:'cubic-bezier(.6,0,1,.4)',fill:'forwards'}).onfinish=()=>{
        landed++;nEl.textContent=+nEl.textContent+(landed===els.length?cards.length-els.length+1:1);book.animate([{transform:'scale(1)'},{transform:'scale(1.18)'},{transform:'scale(1)'}],{duration:260,easing:'ease-out'});sfx('tap');
        if(landed===els.length){haptic('ok');setTimeout(()=>{o.animate([{opacity:1},{opacity:0}],{duration:260,fill:'forwards'}).onfinish=()=>o.remove();},650);}};});
    o.querySelector('.dfly-h').animate([{opacity:1},{opacity:0}],{duration:250,fill:'forwards'});o.querySelector('.dfly-skip').remove();};
  o.onclick=fly;setTimeout(fly,1500+els.length*140);}
/* =====================================================================================
   11.0 — ДУЭЛЬ ПО СЦЕНЕ (PvP с другом по ссылке)
   • Наперегонки: 8 одинаковых вопросов у обоих, живая полоска соперника; больше верных (при равенстве — быстрее) — забирает банк.
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
function kvMakeQs(s,ep){const all=s.parts.flatMap(p=>p.ph);let L=scAct(s.parts[ep].ph).filter(f=>f.b>f.a);
  if(L.length<6)L=[...L,...shuffle(s.parts.flatMap(p=>scAct(p.ph)).filter(f=>f.b>f.a&&!L.includes(f)))].slice(0,8);
  L=shuffle(L).slice(0,8);const types=['listen','mean','gap'];
  return L.map((f,i)=>{let t=types[i%3];
    if(t==='listen'){const o=scListenOpts(f,all);if(o&&o.length>=2)return {fid:f.id,t,right:f.en,opts:shuffle([f.en,...o.slice(0,2)])};t='mean';}
    if(t==='gap'&&f.gap&&new RegExp('\\b'+String(f.gap).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i').test(f.en)){const g=(f.gx&&f.gx.length>=2?f.gx:scGapOpts(f,all)).filter(x=>x.toLowerCase()!==f.gap.toLowerCase()).slice(0,2);
      if(g.length>=2)return {fid:f.id,t:'gap',right:f.gap,opts:shuffle([f.gap,...g])};}
    const tr=(f.trap||[]).slice(0,2);return {fid:f.id,t:'mean',right:f.ru,opts:shuffle([f.ru,...tr])};});}
const kvF=(s,fid)=>{let f=null;s.parts.forEach(p=>p.ph.forEach(x=>{if(x.id===fid)f=x;}));return f;};
// лист «Дуэль с другом»: эпизод, режим, ставка
function kvSheet(sid,ep){const s=scOf(sid);if(!s)return;scCloseSheet();let mode='race',bet=0;ep=ep==null?Math.max(0,s.parts.findIndex((p,i)=>!scP(sid).done.includes(i))):ep;if(ep<0)ep=0;
  const w=document.createElement('div');w.className='sc-sheetwrap';const g=store.gold||0;
  let drawn=false;const draw=()=>{w.innerHTML=`<div class="sc-sheet kv-sheet${drawn?' noanim':''}"><b>⚔️ Дуэль с другом</b><p class="kv-sub">${esc(s.title)} · ${esc(s.sub||'')}</p>
    <div class="kv-lbl">Эпизод</div><div class="kv-eps">${s.parts.map((p,i)=>`<button data-ep="${i}" class="${i===ep?'on':''}">${i+1}. ${esc(p.t)}</button>`).join('')}</div>
    <div class="kv-lbl">Режим</div><div class="kv-modes"><button data-m="race" class="${mode==='race'?'on':''}"><span>🏁</span><b>Наперегонки</b><small>Одни и те же 8 вопросов. Очки: верно — 100 и до 50 за скорость. Больше очков — забираешь банк.</small></button>
      <button data-m="coop" class="${mode==='coop'?'on':''}"><span>🤝</span><b>Вместе</b><small>По очереди, общий счёт. Застрял — «🆘 Помоги», и ответит друг.</small></button></div>
    ${mode==='race'?`<div class="kv-lbl">Ставка <small>у тебя ${ui('coin')} ${fmt(g)}</small></div><div class="kv-bets">${[0,25,50,100,200].map(x=>`<button data-b="${x}" class="${x===bet?'on':''}"${x>g?' disabled':''}>${x?`${ui('coin')} ${x}`:'Без'}</button>`).join('')}</div>`:''}
    <button class="sc-btn" id="kvGo">Создать и позвать друга →</button><button class="sc-btn ghost" data-close>Отмена</button></div>`;drawn=true;};
  draw();w.onclick=async e=>{const b=e.target.closest('button');if(e.target===w||(b&&b.hasAttribute('data-close'))){w.remove();return;}if(!b)return;sfx('tap');
    if(b.dataset.ep){ep=+b.dataset.ep;draw();return;}if(b.dataset.m){mode=b.dataset.m;if(mode==='coop')bet=0;draw();return;}if(b.dataset.b){bet=+b.dataset.b;draw();return;}
    if(b.id==='kvGo'){b.disabled=true;b.textContent='Создаю комнату…';
      try{const r=await kvNet({a:'create',room:{sid,ep,mode,bet,qs:kvMakeQs(s,ep)}});if(!r.ok){kvErr(r);b.disabled=false;draw();return;}
        w.remove();KV={code:r.v.code,role:'A',room:r.v,k:0,t0:0};kvShare();kvLobby();kvPoll();}catch(x){kvErr();b.disabled=false;draw();}}};
  document.body.appendChild(w);}
const kvLink=()=>`${APP_LINK}?startapp=kv_${KV.code}`;
function kvShare(){const R=KV.room,s=scOf(R.sid);shareLink(kvLink(),`${R.mode==='race'?'Го наперегонки':'Го вместе'} по сцене «${s?s.title:''}» в «Языки по кино»${R.bet?` — ставка ${R.bet} монет`:''}! Комната ${KV.code}`);}
function kvScreen(html){const s=scOf(KV.room.sid);scMount(s,`<div class="kv">${html}</div>`,'pvp');}
function kvLobby(){const R=KV.room,s=scOf(R.sid);
  kvScreen(`<div class="sc-head"><button class="sc-back" id="kvX">${ui('back')}</button><div><span class="sc-meta">Дуэль · ${R.mode==='race'?'наперегонки':'вместе'}</span><h1>${esc(s.title)}</h1></div></div>
    <div class="kv-lobby"><div class="kv-pulse">⚔️</div><b>Ждём друга…</b><p>${esc(s.sub||'')} · эпизод ${R.ep+1} «${esc(s.parts[R.ep].t)}»${R.bet?` · ставка ${ui('coin')} ${R.bet}`:''}</p>
      <div class="kv-code">Комната <b>${KV.code}</b></div><button class="sc-btn" id="kvSh">📤 Отправить ссылку ещё раз</button><button class="sc-btn ghost" id="kvCp">Скопировать ссылку</button></div>`);
  $('#kvSh').onclick=()=>{sfx('tap');kvShare();};$('#kvCp').onclick=()=>{sfx('tap');try{navigator.clipboard.writeText(kvLink()).then(()=>toast('Ссылка скопирована'),()=>toast(kvLink()));}catch(e){toast(kvLink());}};
  $('#kvX').onclick=()=>kvLeave();}
async function kvJoin(code){try{const r=await kvNet({a:'state',code});if(!r.ok){kvErr(r);renderHome();return;}
    const R=r.v,s=scOf(R.sid);if(!s){toast('Этой сцены нет в твоей версии приложения');renderHome();return;}
    const me=R.A&&R.A.id===kvUid()?'A':R.B&&R.B.id===kvUid()?'B':null;
    if(me){KV={code,role:me,room:R,k:0,t0:0};kvApply(R);kvPoll();return;}
    if(R.B){toast('В этой комнате уже двое');renderHome();return;}
    KV={code,role:'B',room:R,k:0,t0:0,guest:true};const g=store.gold||0,poor=R.bet>g;
    kvScreen(`<div class="sc-head"><button class="sc-back" id="kvX">${ui('back')}</button><div><span class="sc-meta">Тебя зовут на дуэль</span><h1>${esc(s.title)}</h1></div></div>
      <div class="kv-lobby"><div class="kv-pulse">${R.mode==='race'?'🏁':'🤝'}</div><b>${esc(R.A.n)} зовёт ${R.mode==='race'?'наперегонки':'пройти вместе'}</b>
        <p>${esc(s.sub||'')} · эпизод ${R.ep+1} «${esc(s.parts[R.ep].t)}» · ${R.qs.length} вопросов</p>
        ${R.bet?`<div class="kv-code">Ставка <b>${ui('coin')} ${R.bet}</b> · у тебя ${fmt(g)}</div><p class="kv-rule">Победитель забирает банк ${ui('coin')} ${R.bet*2}. Очки: верно — 100 и до 50 за скорость, сначала решает точность.</p>`:''}
        ${poor?`<p class="kv-poor">Не хватает монет на ставку. Пройди эпизод или поиграй — и возвращайся по ссылке.</p>`:`<button class="sc-btn" id="kvIn">Принять ${R.mode==='race'?'вызов':'приглашение'} →</button>`}</div>`);
    $('#kvX').onclick=()=>{KV=null;renderHome();};
    if($('#kvIn'))$('#kvIn').onclick=async()=>{sfx('tap');$('#kvIn').disabled=true;try{const j=await kvNet({a:'join',code});if(!j.ok){kvErr(j);$('#kvIn').disabled=false;return;}kvApply(j.v);kvPoll();}catch(e){kvErr();}};
  }catch(e){kvErr();renderHome();}}
function kvPoll(){if(!KV)return;clearTimeout(KV.timer);KV.timer=setTimeout(async()=>{if(!KV)return;if(!document.querySelector('.kv')){kvStop();return;}
    try{const r=await kvNet({a:'state',code:KV.code});if(r.ok)kvApply(r.v);}catch(e){}kvPoll();},KV.room&&KV.room.st==='go'&&KV.started?900:1300);}
function kvStop(){if(KV){clearTimeout(KV.timer);clearInterval(KV.cd);}}
const kvFoe=()=>KV.role==='A'?'B':'A';
// 11.2: очки наперегонки — верно 100 + до 50 за скорость (полный бонус за мгновенный ответ, ноль после 20 с); ошибка 0.
// Одна лишняя верная (+100) всегда сильнее любой скорости — сначала точность, потом время.
const KV_FAST=20000,kvPts=a=>a&&a.ok?100+Math.round(50*Math.max(0,1-a.ms/KV_FAST)):0,kvSum=p=>Object.values((p&&p.ans)||{}).reduce((t,a)=>t+kvPts(a),0);
function kvApply(R){if(!KV)return;const prev=KV.room;KV.room=R;
  if(R.st==='wait'){if(!document.querySelector('.kv-lobby'))kvLobby();return;}
  if((R.st==='left'||R.st==='closed')&&R[kvFoe()]&&R[kvFoe()].left&&!KV.over){KV.over=true;kvEnd(true);return;}
  if(!KV.started){KV.started=true;kvPay();kvCountdown();return;}
  if(KV.over||!KV.ready)return;
  if(R.mode==='race'){kvBars();if(R[KV.role].done&&(R[kvFoe()].done||R.st==='end')){KV.over=true;kvEnd();}else if(R[KV.role].done)kvWait();}
  else{if(R.st==='end'||R.turn>=R.qs.length){KV.over=true;kvEnd();return;}if(!prev||prev.turn!==R.turn||prev.help!==R.help||!document.querySelector('.kv-q'))kvCoopShow();else kvBars();}}
// ставка списывается один раз, когда оба в игре
function kvPay(){const R=KV.room;store.kvPaid=store.kvPaid||{};if(R.mode==='race'&&R.bet&&!store.kvPaid[KV.code]){store.gold=Math.max(0,(store.gold||0)-R.bet);store.kvPaid[KV.code]=1;save();}}
function kvCountdown(){const R=KV.room,s=scOf(R.sid);let n=3;
  kvScreen(`<div class="kv-cd"><span>${esc(R.A.n)} <i>vs</i> ${esc(R.B?R.B.n:'…')}</span><b id="kvN">3</b><small>${R.mode==='race'?'Наперегонки — отвечай быстро и точно':'Вместе — по очереди, начинает '+esc(R.A.n)}</small></div>`);
  sfx('tap');KV.cd=setInterval(()=>{n--;const el=$('#kvN');if(n<=0){clearInterval(KV.cd);sfx('win');KV.ready=true;KV.t0=Date.now();KV.qt=Date.now();if(R.mode==='race')kvRaceShow();else kvCoopShow();return;}
    if(el){el.textContent=n;el.animate([{transform:'scale(1.6)',opacity:0},{transform:'none',opacity:1}],{duration:400,easing:'cubic-bezier(.2,1.4,.4,1)'});}sfx('tap');haptic('sel');},900);}
// верх экрана: я и соперник/друг
function kvTop(){const R=KV.room,me=R[KV.role],fo=R[kvFoe()]||{n:'…',ans:{}},n=R.qs.length;
  if(R.mode==='race'){const sc=p=>Object.values(p.ans||{}).filter(a=>a.ok).length,pr=p=>Object.keys(p.ans||{}).length;
    return `<div class="kv-top"><div class="kv-pl me"><b>Ты</b><span>${kvSum(me)} <em>очк.</em> · ${sc(me)} ✓</span><i style="--p:${pr(me)/n*100}%"></i></div><div class="kv-vs">${R.bet?`<small>банк</small>${ui('coin')} ${R.bet*2}`:'vs'}</div><div class="kv-pl fo"><b>${esc(fo.n)}</b><span>${kvSum(fo)} <em>очк.</em> · ${sc(fo)} ✓</span><i style="--p:${pr(fo)/n*100}%"></i></div></div>`;}
  const ok=Object.values(R.co).filter(a=>a.ok).length;
  return `<div class="kv-top coop"><div class="kv-team">🤝 Общий счёт <b>${ok}</b> из ${n}</div><div class="kv-segs">${R.qs.map((q,i)=>`<i class="${R.co[i]?(R.co[i].ok?'ok':'bad'):i===R.turn?'cur':''}"></i>`).join('')}</div></div>`;}
function kvBars(){const t=document.querySelector('.kv-topw');if(t)t.innerHTML=kvTop();}
function kvQHTML(q,f,lead){const s=scOf(KV.room.sid);
  const ask=q.t==='listen'?'🎧 Что прозвучало?':q.t==='gap'?'Вставь слово':'Что это значит?';
  const body=q.t==='listen'?`<button class="kv-hear" id="kvHear">${SI.play} Послушать</button>`:q.t==='gap'?`<b class="kv-qt">${esc(f.en).replace(new RegExp('\\b'+String(f.gap).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i'),'<span class="gap">&nbsp;</span>')}</b><small class="kv-qs">${esc(f.ru)}</small>`:`<b class="kv-qt">${esc(f.en)}</b>`;
  return `<div class="kv-q">${lead||''}<span class="kv-ask">${ask}</span>${body}<div class="kv-o">${q.opts.map(o=>`<button data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div><div class="kv-fb" id="kvFb"></div></div>`;}
function kvBindQ(q,f,onAns){const s=scOf(KV.room.sid);if($('#kvHear')){let heard=false;
    // 11.2: на слух время идёт с конца первого прослушивания — загрузка видео не съедает очки
    const h=()=>scClip(s.id,f.id,$('#kvHear'),()=>{if(!heard&&KV&&!document.querySelector('.kv-o button[disabled]')){heard=true;KV.qt=Date.now();}});$('#kvHear').onclick=()=>{sfx('tap');h();};setTimeout(h,250);}
  $$('.kv-o button').forEach(b=>b.onclick=()=>{if(b.disabled)return;const r=b.dataset.v===q.right;$$('.kv-o button').forEach(x=>{x.disabled=true;if(x.dataset.v===q.right)x.classList.add('ok');});if(!r)b.classList.add('bad');
    sfx(r?'good':'bad');haptic(r?'ok':'err');if(r)scGot(s,f);$('#kvFb').innerHTML=`<b class="${r?'ok':'bad'}">${r?'Верно':'Мимо'}</b> ${esc(f.en)} — ${esc(f.ru)}`;onAns(r);});}
// наперегонки: у каждого свой темп
function kvRaceShow(){const R=KV.room,s=scOf(R.sid);if(KV.k>=R.qs.length){kvWait();return;}const q=R.qs[KV.k],f=kvF(s,q.fid);if(!f){KV.k++;kvRaceShow();return;}KV.qt=Date.now();
  kvScreen(`<div class="kv-topw">${kvTop()}</div><div class="kv-n">Вопрос ${KV.k+1} из ${R.qs.length}</div>${kvQHTML(q,f)}`);
  kvBindQ(q,f,async r=>{const k=KV.k,ms=Date.now()-KV.qt;KV.k++;R[KV.role].ans[k]={ok:r,ms};kvBars();
    try{const j=await kvNet({a:'ans',code:KV.code,k,ok:r,ms});if(j.ok)KV.room=j.v;}catch(e){}
    setTimeout(()=>{if(!KV||KV.over)return;if(KV.k>=R.qs.length){kvApply(KV.room);if(!KV.over)kvWait();}else kvRaceShow();},r?700:1500);});}
function kvWait(){if(document.querySelector('.kv-waitb'))return kvBars();kvScreen(`<div class="kv-topw">${kvTop()}</div><div class="kv-lobby kv-waitb"><div class="kv-pulse">⏳</div><b>Ты всё! Ждём ${esc((KV.room[kvFoe()]||{}).n||'друга')}…</b><p>Как только он ответит на всё — покажу итог.</p></div>`);}
// вместе: ходы по очереди, «помоги»
function kvCoopShow(){const R=KV.room,s=scOf(R.sid),k=R.turn;if(k>=R.qs.length)return;const q=R.qs[k],f=kvF(s,q.fid),who=k%2===0?'A':'B',mine=who===KV.role,helping=!mine&&R.help===k;KV.qt=Date.now();
  const lead=mine?`<div class="kv-turn me">Твой ход${R.help===k?' · друг уже видит вопрос':''}</div>`:helping?`<div class="kv-turn help">🆘 ${esc(R[who].n)} просит помочь — ответь за него!</div>`:`<div class="kv-turn">Ход: ${esc(R[who].n)}…</div>`;
  kvScreen(`<div class="kv-topw">${kvTop()}</div><div class="kv-n">Вопрос ${k+1} из ${R.qs.length}</div>${kvQHTML(q,f,lead)}${mine&&R.help!==k?`<button class="kv-helpb" id="kvHelp">🆘 Помоги — пусть ответит ${esc((R[kvFoe()]||{}).n||'друг')}</button>`:''}`);
  if(!mine&&!helping)$$('.kv-o button').forEach(b=>b.disabled=true);
  if($('#kvHelp'))$('#kvHelp').onclick=async()=>{sfx('tap');$('#kvHelp').disabled=true;$('#kvHelp').textContent='Позвал друга…';try{const j=await kvNet({a:'help',code:KV.code,k});if(j.ok)KV.room=j.v;}catch(e){}};
  kvBindQ(q,f,async r=>{try{const j=await kvNet({a:'ans',code:KV.code,k,ok:r,ms:Date.now()-KV.qt});if(j.ok){setTimeout(()=>kvApply(j.v),r?800:1500);}else toast(j.msg||'Друг уже ответил');}catch(e){kvErr();}});}
// итог
function kvEnd(foeLeft){kvStop();const R=KV.room,s=scOf(R.sid),me=R[KV.role],fo=R[kvFoe()]||{n:'друг',ans:{}};store.kvDone=store.kvDone||{};const first=!store.kvDone[KV.code];store.kvDone[KV.code]=1;
  let title,sub,gain=0,win=null;
  let tbl='';
  if(R.mode==='race'){const sc=p=>Object.values(p.ans||{}).filter(a=>a.ok).length;
    const a=kvSum(me),b=kvSum(fo);win=foeLeft?true:a===b?null:a>b;
    title=foeLeft?`${esc(fo.n)} сдался — победа!`:win===true?'Победа! 🏆':win===false?(sc(fo)>sc(me)?`${esc(fo.n)} ответил точнее`:`${esc(fo.n)} оказался быстрее`):'Ничья';
    sub=`Ты ${a} очк. (${sc(me)} из ${R.qs.length} верно)${foeLeft?'':` · ${esc(fo.n)} ${b} очк. (${sc(fo)} верно)`}`;
    const cell=x=>x?`<td class="${x.ok?'ok':'bad'}">${x.ok?'✓':'✗'}<small>${(x.ms/1000).toFixed(1)} с</small><em>${kvPts(x)}</em></td>`:'<td>—</td>';
    if(!foeLeft)tbl=`<table class="kv-tbl"><thead><tr><th>#</th><th>Ты</th><th>${esc(fo.n)}</th></tr></thead><tbody>${R.qs.map((q,i)=>`<tr><td>${i+1}</td>${cell((me.ans||{})[i])}${cell((fo.ans||{})[i])}</tr>`).join('')}</tbody>
      <tfoot><tr><td>Σ</td><td>${a}</td><td>${b}</td></tr></tfoot></table><p class="kv-rule">Верно — 100 очков и до 50 за скорость. Сначала решает точность, потом время.</p>`;
    if(R.bet&&first){gain=win===true?R.bet*2:win===null?R.bet:0;addGold(gain);}}
  else{const ok=Object.values(R.co).filter(a=>a.ok).length;title=ok===R.qs.length?'Идеально вместе! 🤝':'Пройдено вместе';sub=`Общий счёт: ${ok} из ${R.qs.length}`;if(first){gain=ok*5;addGold(gain);}}
  save();scSave();sfx(win===false?'learn':'win');ev('pvp_end',R.sid);
  kvScreen(`<div class="kv-end"><div class="kv-pulse">${R.mode==='race'?(win===false?'🥈':'🏆'):'🤝'}</div><b>${title}</b><p>${sub}</p>${R.mode==='race'&&R.bet?`<p class="kv-bank">${win===true?`Банк твой: ${ui('coin')} ${R.bet*2}`:win===null?`Ничья — ставка ${ui('coin')} ${R.bet} вернулась`:`Ставка ${ui('coin')} ${R.bet} ушла к ${esc(fo.n)}`}</p>`:''}${gain&&!(R.mode==='race'&&R.bet)?`<div class="sc-gain">+${gain} ${ui('coin')}</div>`:''}${tbl}
    <button class="sc-btn" id="kvAgain">⚔️ Реванш</button><button class="sc-btn ghost" id="kvScene">К сцене</button><button class="sc-btn ghost" id="kvDict">📖 Словарь</button></div>`);
  $('#kvAgain').onclick=()=>{sfx('tap');const sid=R.sid,ep=R.ep;KV=null;renderScene(sid);setTimeout(()=>kvSheet(sid,ep),300);};
  $('#kvScene').onclick=()=>{sfx('tap');const sid=R.sid;KV=null;renderScene(sid);};
  $('#kvDict').onclick=()=>{sfx('tap');KV=null;DX.seg='ph';renderTab('dict');};
  setTimeout(dictFly,900);}
function kvLeave(){if(KV){kvNet({a:'leave',code:KV.code}).catch(()=>{});kvStop();const sid=KV.room&&KV.room.sid;KV=null;if(sid)renderScene(sid);else renderHome();}}
function scSim(f,pool,get,n){const c=get(f),wc=x=>String(x).split(/\s+/).length,end=x=>/[?]$/.test(x)?'?':/!$/.test(x)?'!':'.';
  const seen=new Set([c.toLowerCase()]),cand=[];
  for(const x of pool){const v=get(x);if(!v||seen.has(v.toLowerCase()))continue;seen.add(v.toLowerCase());
    cand.push({v,d:Math.abs(v.length-c.length)/Math.max(8,c.length)+Math.abs(wc(v)-wc(c))*0.35+(end(v)===end(c)?0:0.6)+Math.random()*0.35});}
  return cand.sort((p,q)=>p.d-q.d).slice(0,n).map(x=>x.v);}
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
function scListenOpts(f,all){const src=f.en,re=new RegExp('\\b'+f.gap.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b');
  if(!re.test(src))return null;return scGapOpts(f,all).map(w=>src.replace(re,w));}
const scToks=s=>String(s).split(/\s+/).filter(Boolean);
const scNorm=s=>String(s).toLowerCase().replace(/[^a-zäöüß'\s]/g,'').replace(/\s+/g,' ').trim();
const W_IRR={come:['came','coming'],came:['come'],go:['went','going'],went:['go'],is:['are','was'],are:['is','were'],was:['were','is'],were:['was'],have:['has','had'],has:['have'],had:['have'],
  do:['does','did'],does:['do'],did:['do','does'],can:['could'],could:['can'],would:['will'],will:['would'],been:['being','be'],be:['been','being'],my:['me'],me:['my'],by:['to','at'],to:['for','at'],for:['to'],
  at:['in','on'],in:['on','at'],on:['in'],a:['the'],the:['a'],you:['your'],your:['you'],get:['got'],got:['get'],make:['made'],made:['make'],take:['took'],took:['take'],think:['thought'],know:['knew'],
  see:['saw'],say:['said'],tell:['told'],this:['that'],that:['this'],some:['any'],any:['some']};
function wForms(w,de){const r=wForms0(w,de);return r.filter(v=>W_IRR[String(w).toLowerCase()]||(typeof GLOSS!=='undefined'&&GLOSS[v]));}   // только настоящие слова (есть в словаре сцен)
function wForms0(w,de){const l=String(w).toLowerCase();if(de)return [];if(W_IRR[l])return W_IRR[l];
  if(/ing$/.test(l)&&l.length>5)return [l.replace(/ing$/,''),l.replace(/ing$/,'ed')];if(/ed$/.test(l)&&l.length>4)return [l.replace(/ed$/,''),l.replace(/ed$/,'ing')];
  if(/s$/.test(l)&&l.length>3)return [l.replace(/s$/,'')];if(l.length>2&&/^[a-z]+$/.test(l))return [l+'s',l+'ing'];return [];}
function renderScQuiz(id,i){
  const s=scOf(id),les=!!i&&typeof i==='object'&&Array.isArray(i.list),rev=i==='rev',P=scP(id),de=scL()==='de',boss=les&&!!i.boss,beg=store.lvl!=='b'&&!boss;
  SCUR={id,i:typeof i==='number'?i:0};
  const all=s.parts.flatMap(x=>x.ph);
  const normalList=()=>scAct(s.parts[i].ph).slice().sort((a,b)=>a.a-b.a).slice(0,5);
  const list=les?i.list.filter(f=>!f.passive).slice(0,boss?8:5):rev?shuffle(scDue(s)).slice(0,8):normalList();
  if(!list.length){toast('Здесь пока нет фраз для проверки');return;}

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
  const canLife=f=>{const l=lifeOf(f);const n=l?scToks(l.target).length:0;return n>=2&&n<=12&&(de||scToks(l.target).every(isKnown));};
  const whenOthers=f=>{const pool=all.filter(x=>x!==f&&!x.passive&&x.use&&x.use!==f.use);return pool.length>=2?pool:[...pool,...SCENES.filter(z=>z!==s&&z.lang===s.lang).flatMap(z=>z.parts.flatMap(q=>q.ph)).filter(x=>!x.passive&&x.use&&x.use!==f.use)];};
  const canWhen=f=>!!f.use&&!de&&whenOthers(f).length>=2;
  const canBuild=f=>scToks(target(f)).length>=2&&scToks(target(f)).length<=12;
  const canGap=f=>!!f.gap&&new RegExp('\\b'+String(f.gap).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i').test(target(f));

  function taskFor(f,k,retry){
    // финал сцены: всё на слух (видео без субтитров) + вписать слово
    if(boss)return k%3===1&&canGap(f)?'gap':'listen';
    // новичок: выбрать перевод, послушать и собрать (без лишних слов), собрать по переводу, слово из вариантов — без «примени в жизни»
    if(beg&&!retry){let t2=['mean','listen','build','when','gap'][k%5];if(t2==='when'&&!canWhen(f))t2='listen';if(t2==='mean'&&!(f.trap&&f.trap.length>=2))t2='listen';if(t2==='build'&&!canBuild(f))t2='listen';if(t2==='gap'&&!canGap(f))t2=canBuild(f)?'build':'listen';return t2;}
    if(beg&&retry)return canBuild(f)?'build':'listen';
    if(retry){
      if(canLife(f)&&k%2===0)return 'life';if(canBuild(f))return 'build';
      return 'listen';
    }
    if(rev){
      if(k%3===0&&canLife(f))return 'life';
      if(k%3===1&&canGap(f))return 'gap';
      return canBuild(f)?'build':'listen';
    }
    const seq=['listen','when','build','mean','gap','life'];
    let t=seq[k%seq.length];
    if(t==='when'&&!canWhen(f))t=canBuild(f)?'build':'listen';
    if(t==='mean'&&!(f.trap&&f.trap.length>=3))t=canLife(f)?'life':'listen';
    if(t==='build'&&!canBuild(f))t=canGap(f)?'gap':'listen';
    if(t==='life'&&!canLife(f))t=canBuild(f)?'build':(canGap(f)?'gap':'listen');
    if(t==='gap'&&!canGap(f))t=canBuild(f)?'build':'listen';
    return t;
  }

  const Q=list.map((f,k)=>({f,type:taskFor(f,k,false)}));
  const need=Q.length;let n=0,ok=0,wrong=0,combo=0;

  function show(){
    const q=Q[n],f=q.f,type=q.type;setTimeout(gavIdle,0);
    let title='',ask='',opts=[],correct='',build=null,video=false,typed=false;

    const ladder=type==='listen'&&!beg&&!boss;   // 12.2: вспомни сам → первые буквы → кубики → не знаю
    if(type==='listen'){
      ask=ladder?'👂 Послушай и восстанови':'Послушай и собери';
      title=ladder?'Что прозвучало?<br><small class="qsm">Без перевода. Напиши сам — опечатки прощаю. Не выходит — подсказки ниже</small>':'Собери, что услышал<br><small class="qsm">Видео покажет момент — собери реплику из слов</small>';
      const heard=scIsDe()?x=>x.de:x=>x.en;correct=heard(f);
      build=makeBuild(correct,f,all);opts=null;
      video=true;
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
      ask='Когда так говорят?';title=`${esc(target(f))}<br><small class="qsm">${esc(f.ru)}</small>`;correct=f.use;
      opts=shuffle([f.use,...shuffle(whenOthers(f)).slice(0,beg?1:2).map(x=>x.use)]);
    }

    if(type==='mean'){
      ask='Что это значит?';title=esc(target(f));correct=f.ru;opts=shuffle([correct,...f.trap.slice(0,beg?2:3)]);
    }

    if(type==='gap'){
      ask='Закрепи ключевое слово';
      title=esc(target(f)).replace(new RegExp('\\b'+String(f.gap).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i'),'<span class="gap">&nbsp;</span>')
        +`<br><small class="qsm">${esc(f.ru)}</small>`;
      correct=f.gap;opts=null;typed=true;
      ask='Впиши пропущенное слово';
      if(beg){typed=false;ask='Выбери пропущенное слово';opts=shuffle([f.gap,...scGapOpts(f,all).filter(x=>x.toLowerCase()!==String(f.gap).toLowerCase()).slice(0,2)]);}
    }

    const p=s.parts[f.pi];
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
          ?`${ladder?`<div class="sc-lt" id="scLt"><input class="sc-gapin" id="scLin" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="Напиши, что услышал"><button class="sc-btn" id="scLok">Проверить</button></div>
            <div class="sc-lmask" id="scLm" hidden></div><div class="sc-lh" id="scLh"><button class="tk-help" id="scLlet">💡 Первые буквы</button><button class="tk-help" id="scLtil">🧩 Собрать из слов</button></div>`:''}<div class="sc-bans" id="scbans"${ladder?' hidden':''}></div>${type!=='listen'&&!beg?`<button class="sc-reveal" id="scbrev">Сначала вспомни сам → показать слова</button>`:''}<div class="sc-bpool" id="scbpool"${(type!=='listen'&&!beg)||ladder?' hidden':''}></div>${beg&&build.tk.length>2?'<p class="sc-bhint">Первое слово уже стоит — продолжи</p>':''}<p class="tk-tip" id="scTip"${ladder?' hidden':''}>Зажми слово — покажу перевод</p>
            <div class="sc-bact"><button class="sc-btn ghost" id="scbrst" hidden>Сбросить</button><button class="sc-btn" id="scbchk" hidden>Проверить</button></div><div class="sc-bmsg" id="scbmsg"></div><div id="scbdiff"></div>${ladder?'<button class="tk-skip" id="scLno">Не знаю — показать ответ</button>':''}`
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
      q.res=right;{const ln=$('#scLno'),tp=$('#scTip');if(ln)ln.hidden=true;if(tp)tp.hidden=true;}   // 12.6: «Не знаю» и подсказка про кубики висели после ответа
      if(right)ok++;else wrong++;
      if(right){combo++;if(combo>=3&&combo%3===0)toast(`🔥 ${combo} подряд без ошибок`);}else combo=0;

      // Ошибка не стирает выученное. Она только снимает «надолго» и возвращает точечный повтор.
      const before=P.m[f.id]||0;
      if(right){
        P.m[f.id]=Math.min(3,before+1);scGot(s,f);
      }else{
        if(before>=3)P.m[f.id]=2;
        delete P.r[f.id];
        if(!q.re){
          const retryType=type==='life'?(canBuild(f)?'build':'listen'):(canLife(f)?'life':(canBuild(f)?'build':'listen'));
          Q.splice(Math.min(Q.length,n+3),0,{f,type:retryType,re:true});
        }
      }
      if(P.m[f.id]>=3&&!P.r[f.id])P.r[f.id]=[0,Date.now()+SC_DAYS[0]*864e5];

      if(rev){
        if(right){
          const prev=P.r[f.id]||[0,0],st=prev[0]+1;
          if(st>=SC_DAYS.length){delete P.r[f.id];P.rDone=P.rDone||{};P.rDone[f.id]=1;}
          else P.r[f.id]=[st,Date.now()+SC_DAYS[st]*864e5];
        }else delete P.r[f.id];
      }
      scSave();sfx(right?'good':'bad');haptic(right?'ok':'err');weekAdd();
      gavReact(right);if(right&&before<3&&P.m[f.id]>=3)setTimeout(()=>gavKill(target(f)),350);

      if(!build)$$('.sc-opt').forEach(x=>{
        x.disabled=true;
        if(x.dataset.v===correct)x.classList.add('right');
        else if(x===el)x.classList.add('wrong');
        else x.classList.add('dim');
      });

      const life=q.life;
      $('#scfb').innerHTML=`<div class="sc-fb ${right?'ok':'bad'}">
        <div class="t">${right?(q.typo?'Верно — только опечатка':q.soft?'Верно — с подсказкой':'Верно'):q.soft?`Собрал с ${q.tries+1}-й попытки — фраза вернётся ещё раз`:'Вот как правильно'}</div>
        ${life
          ?`<div class="en">${kwWrap(f,correct)}</div><div class="ru">${esc(life.situation)}</div><div class="orig">В сцене было: ${esc(target(f))} — ${esc(f.ru)}</div>`
          :(type==='listen'&&de&&!scIsDe()?`<div class="en">${esc(f.en)}</div><div class="orig">по-немецки: ${esc(f.de)}</div><div class="ru">${esc(f.ru)}</div>`:`<div class="en">${kwWrap(f)}</div><div class="ru">${esc(f.ru)}</div>`)}
        <div class="fb-info">${phInfoHTML(f,{noEx:!!life,once:true})}</div>
        ${!right&&type==='mean'&&el&&f.trap.includes(el.dataset.v)?`<div class="sc-trapwhy">Это ловушка: дословный перевод или похожие слова, но смысл другой.</div>`:''}
        <button class="sc-btn" id="scnx" style="margin-top:12px">${n===Q.length-1?'Закончить':'Дальше'} →</button>
      </div>`;
      kwBind($('#scfb'),f);
      $('#scnx').onclick=()=>{kwHide(0);n++;if(n<Q.length)show();else end();};
    };

    if(typed){
      const inp=$('#scgap'),msg=$('#scbmsg');q.tries=0;
      const norm=x=>scNorm(x).replace(/'/g,'');
      const check=final=>{if(q.res!==undefined)return;const v=norm(inp.value),c=norm(correct);if(!v){inp.focus();return;}
        if(v===c){inp.classList.add('ok');answer(true);return;}
        if(c.length>=4&&lev(v,c)<=1){q.typo=true;inp.classList.add('typo');answer(true);return;}
        if(!final)return;q.tries++;inp.classList.add('bad');setTimeout(()=>inp.classList.remove('bad'),450);haptic('err');
        if(q.tries>=2){answer(false);inp.disabled=true;return;}
        msg.textContent=`Не то. Подсказка: ${c.length} ${plural(c.length,['буква','буквы','букв'])}, начинается на «${correct.charAt(0)}».`;};
      inp.oninput=()=>check(false);inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();check(true);}};
      inp.onpaste=e=>e.preventDefault();
      $('#scgok').onclick=()=>check(true);$('#scgno').onclick=()=>{if(q.res===undefined){answer(false);inp.disabled=true;}};
      setTimeout(()=>{try{inp.focus();}catch(e){}},300);
    }else if(build){
      q.tries=0;const pool=$('#scbpool');
      if(ladder){let st=0,tr=0;const inp=$('#scLin'),msg=$('#scbmsg'),words=scToks(correct).map(w=>w.replace(/[.,!?;:…"«»()]+/g,'')).filter(Boolean);
        const letters=()=>{if(st>=1)return;st=1;const m=$('#scLm');m.hidden=false;m.textContent=words.map(w=>w[0]+'·'.repeat(Math.max(0,w.length-1))).join(' ');const b=$('#scLlet');if(b)b.remove();};
        const tiles=()=>{if(st>=2)return;st=2;$('#scLt').hidden=true;$('#scLh').hidden=true;$('#scbans').hidden=false;pool.hidden=false;{const tp=$('#scTip');if(tp)tp.hidden=false;}msg.textContent='';draw();};
        const chk=()=>{const v=scNorm(inp.value).replace(/'/g,''),c=scNorm(correct).replace(/'/g,'');if(!v){inp.focus();return;}
          if(v===c||(c.length>=6&&lev(v,c)<=Math.max(1,Math.floor(c.length/14)))){$('#scLt').hidden=true;$('#scLh').hidden=true;q.soft=st>0;answer(true);return;}
          tr++;haptic('err');sfx('bad');inp.classList.add('bad');setTimeout(()=>inp.classList.remove('bad'),450);
          if(tr===1){letters();msg.textContent='Не то. Вот первые буквы — попробуй ещё раз.';}else{tiles();msg.textContent='Собери из слов.';}};
        $('#scLok').onclick=chk;inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();chk();}};
        $('#scLlet').onclick=()=>{sfx('tap');letters();};$('#scLtil').onclick=()=>{sfx('tap');if(st<1)letters();tiles();};
        $('#scLno').onclick=()=>{if(q.res!==undefined)return;sfx('tap');$('#scLt').hidden=true;$('#scLh').hidden=true;answer(false);};}
      const rv=$('#scbrev');if(rv){const open=()=>{if(!pool.hidden)return;pool.hidden=false;rv.remove();sfx('tap');};rv.onclick=open;setTimeout(()=>{if(document.body.contains(rv))open();},3500);}
      const draw=(marks)=>{
        $('#scbans').innerHTML=build.got.map((x,j)=>x?`<button class="sc-tile${marks?(marks[j]?' good':' bad'):''}" data-k="${x.k}" data-j="${j}">${esc(x.w)}</button>`:`<span class="sc-hole" aria-hidden="true"></span>`).join('')||'<span class="sc-bph">Собери фразу слева направо</span>';
        $('#scbpool').innerHTML=build.pool.map(x=>`<button class="sc-tile${build.got.includes(x)?' used':''}" data-k="${x.k}" ${build.got.includes(x)?'disabled':''}>${esc(x.w)}</button>`).join('');
        const done=q.res!==undefined;$('#scbchk').hidden=!build.got.some(Boolean)||done;$('#scbrst').hidden=!build.got.length||done;
        $('#scbrst').onclick=()=>{build.got=[];$('#scbmsg').textContent='';$('#scbdiff').innerHTML='';sfx('tap');draw();};
        $$('#scbpool .sc-tile').forEach(b=>b.onclick=()=>{
          if(q.res!==undefined)return;sfx('tap');
          const x=build.pool.find(x=>x.k===+b.dataset.k);if(x&&!build.got.includes(x))scSlotPut(build.got,x,99);draw();
        });
        $$('#scbans .sc-tile').forEach(b=>b.onclick=()=>{
          if(q.res!==undefined)return;scSlotTake(build.got,+b.dataset.j);$('#scbdiff').innerHTML='';draw();
        });
      };
      draw();
      $('#scbchk').onclick=()=>{
        const got=scNorm(build.got.filter(Boolean).map(x=>x.w).join(' ')),right=got===scNorm(correct)&&build.got.every(Boolean);
        if(right){q.soft=q.tries>0;answer(q.tries===0);$('#scbans').classList.add('right');draw();return;}
        q.tries++;haptic('err');sfx('bad');
        const want=build.tk.map(scNorm),gw=build.got.map(x=>x?scNorm(x.w):''),marks=scPosMarks(gw,want),okN=marks.filter(Boolean).length;$('#scbdiff').innerHTML=scDiffHTML(gw,want,q.tries>=3);   // 12.1: зелёный — только на своём месте
        if(q.tries>=3){answer(false);$('#scbans').classList.add('wrong');draw(marks);return;}
        draw(marks);$('#scbmsg').textContent=`На своём месте ${okN} из ${want.length} (зелёные). Ниже — чего не хватает [ ] и что лишнее. Попытка ${q.tries+1} из 3.`;
      };
    }else{
      $$('.sc-opt').forEach(b=>b.onclick=()=>answer(b.dataset.v===correct,b));
    }
  }

  function makeBuild(text,f,allPhrases){
    const deS=scIsDe()||(scL()==='de'&&/[äöüß]|\b(ich|du|der|die|das|und|nicht)\b/i.test(text));
    // без точек, запятых и заглавных: порядок слов надо помнить, а не угадывать по знакам
    const clean=w=>{let x=String(w).replace(/[.,!?;:…"«»()]+/g,'');if(!deS&&!/^I('|$)/.test(x))x=x.toLowerCase();return x;};
    let tk=scToks(text).map(clean).filter(Boolean);
    tk=scChunk(tk);   // длинная фраза — кусками, без одинаковых кубиков
    const fresh=beg||(!rev&&!(P.m[f.id]>0)&&!q0re(f));
    const pool=[],used=new Set(tk.map(x=>x.toLowerCase()));
    if(!fresh){
      // ловушки: другие формы тех же слов (work → worked, come → came, by → to)
      for(const w of shuffle(tk.filter(x=>!x.includes(' ')))){for(const v of wForms(w,deS)){if(pool.length>=2)break;if(!used.has(v.toLowerCase())){pool.push(v);used.add(v.toLowerCase());}}if(pool.length>=2)break;}
      for(const x of shuffle(allPhrases)){if(x===f)continue;const w=scToks(target(x)).map(clean).find(y=>y&&y.length>2&&!used.has(y.toLowerCase()));if(w){pool.push(w);break;}}
    }
    const B={tk,pool:shuffle([...tk,...pool]).map((w,k)=>({w,k})),got:[]};
    if(beg&&tk.length>2){const first=B.pool.find(x=>x.w===tk[0]);if(first)B.got=[first];}
    return B;
  }
  function q0re(f){return Q.some(x=>x.f===f&&x.re);}

  function end(){
    const firsts=Q.filter(x=>!x.re),okF=firsts.filter(x=>x.res).length,passed=okF===firsts.length;
    const firstTime=!rev&&!les&&!P.done.includes(i);
    if(!rev&&!les&&!P.done.includes(i)){P.done.push(i);scSave();}
    if(!rev&&les&&!boss&&!P.done.includes(Q[0].f.pi)){P.done.push(Q[0].f.pi);scSave();}
    // 9.2: звёзды (100% — 3, от 70% — 2, иначе 1) и монеты
    const acc=firsts.length?okF/firsts.length:0,stars=acc>=1?3:acc>=.7?2:1;let gain=0,prevSt=0;
    if(boss){prevSt=P.boss||0;gain=prevSt?Math.max(0,stars-prevSt)*30+okF*2:150+okF*5;P.boss=Math.max(prevSt,stars);}
    else if(!rev&&!les){P.st=P.st||{};prevSt=P.st[i]||0;gain=firstTime?20+okF*8:Math.max(0,stars-prevSt)*20+okF*2;P.st[i]=Math.max(prevSt,stars);}
    else gain=okF*(rev?4:5);
    if(scPilot(s))gain=0;   // 10.2: в пилотных режимах монет нет
    const epRw=!rev&&!les&&!boss&&typeof i==='number'&&s.parts[i],rwNew=epRw?rwGive(s,i):false;
    scSave();addGold(gain);const lastEp=!rev&&!les&&!s.parts[i+1];

    scMount(s,`<div class="sc-q sc-card sc-result" style="text-align:center">
      <div class="sc-meta">${rev?'Повторение':boss?'Финал сцены':les?'Урок фраз из кино':'Проверка эпизода'}</div>
      ${rev?'':`<div class="res-stars">${[1,2,3].map(k=>`<i class="${k<=stars?'on':''}" style="animation-delay:${.15+k*.18}s">★</i>`).join('')}</div>`}
      <div class="sc-big">${okF} / ${firsts.length}</div>${gain?`<div class="sc-gain">+${gain} ${ui('coin')}</div>`:''}<div class="sc-acc">точность ${firsts.length?Math.round(okF/firsts.length*100):0}% · ${firsts.length} ${plural(firsts.length,['фраза','фразы','фраз'])}${wrong?' · ошибки вернутся завтра':''}</div>
      <h2>${passed?'Фразы проверены.':'Нормально — ошибки как раз показывают, что повторить.'}</h2>
      <p class="sc-sub">${wrong?`Ошибок: ${wrong}. Они не удалили прогресс — эти фразы вернутся точечно.`:'Без ошибок. Следующая встреча с фразами будет позже.'}</p>
      <div class="sc-result-rule">Главное: ты не угадывал синоним. Ты несколько раз восстановил конкретную фразу и увидел, где её применять.</div>
      <div class="sc-btns">${rev?scRevNext(id):boss?`<button class="sc-btn" id="scdir">🎬 Режиссёрская версия — сцена целиком</button><button class="sc-btn ghost" id="scsum">📚 Все фразы сцены</button><button class="sc-btn ghost" id="scpath">К пути сцены</button>`:`${!les&&s.parts[i+1]?`<button class="sc-btn" id="scnext">Следующий эпизод →</button>`:''}${lastEp?`<button class="sc-btn" id="scbossgo">👑 Финал сцены →</button><button class="sc-btn ghost" id="scsum">📚 Все фразы сцены</button>`:''}<button class="sc-btn ghost" id="scrp">Вернуться к эпизоду</button>`}<button class="sc-btn ghost" id="scshare">📤 Позвать друга учиться</button></div>
    </div>
    ${epRw?rwEndHTML(s,i,rwNew):boss?(segGive(s)?segHTML(s,'new'):'')+(showGive(s)?showHTML(s):''):''}
    <div class="sc-sec"><h2>Что закрепили</h2><span>${Q.filter(x=>x.res).length}</span></div>
    ${Q.filter((x,j,a)=>a.findIndex(y=>y.f===x.f)===j).map(x=>`<div class="sc-use sc-card${x.res?'':' miss'}" data-fid="${x.f.id}"><div class="en">${kwWrap(x.f,target(x.f))}</div><div class="ru">${esc(x.f.ru)}</div>${phInfoHTML(x.f,{noEx:true})}</div>`).join('')}`,'scend');
    kwBind(document.querySelector('.scn'),el=>{const c=el.closest('[data-fid]');return c?all.find(y=>y.id===c.dataset.fid):null;});
    if(epRw)rwEndBind(document.querySelector('.scn'),s,i);else if(boss){segBind(document.querySelector('.scn'),s);bgBind(document.querySelector('.scn'));}
    sfx(passed?'win':'learn');remindSync();ev(rev?'review':'ep_quiz',id);setTimeout(dictFly,700);   // 11.0: новые карты летят в словарь
    {const g=document.getElementById('gav');if(g)g.remove();}if(!rev)setTimeout(()=>gavEpisode(boss?'Финал':les?'Урок':s.parts[i]?s.parts[i].t:s.title),300);
    if($('#scrp'))$('#scrp').onclick=()=>renderScEp(id,i);
    if($('#scsum'))$('#scsum').onclick=()=>{sfx('tap');renderSceneSum(id);};if($('#scdir'))$('#scdir').onclick=()=>{sfx('reel');renderDirCut(id);};if($('#scpath'))$('#scpath').onclick=()=>{sfx('tap');renderScene(id);};
    if($('#scbossgo'))$('#scbossgo').onclick=()=>{sfx('tap');if(scBossOpen(s))scBossStart(id);else renderScene(id);};
    if($('#scnext'))$('#scnext').onclick=()=>{sfx('tap');renderScEp(id,i+1);};
    if($('#scshare'))$('#scshare').onclick=()=>{sfx('tap');shareLink(APP_LINK+'?startapp=src_share',`Учу ${scL()==='de'?'немецкий':'английский'} по сценам из фильмов — сейчас «${s.title}». Сегодня закрепил ${okF} из ${firsts.length} фраз. Попробуй, тут бесплатно:`);};
    if($('#scnrev'))$('#scnrev').onclick=()=>{const L=scDueAll().filter(x=>x.s.id!==id);if(L.length)renderScQuiz(L[0].s.id,'rev');};
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
const rwKadr=(s,i)=>assetUrl(scKey(s,String(i+1).padStart(2,'0')+'-k.jpg'));
const rwPrize=(s,i)=>(s.parts[i]&&s.parts[i].prize)||['🎬',s.parts[i]?s.parts[i].t:s.title];
const rwPh=(s,i)=>{const L=scAct(s.parts[i].ph);return L.find(x=>x.fact)||L[Math.floor(L.length/2)]||null;};
function rwGive(s,i){store.rw=store.rw||{};const k=rwKey(s,i);if(store.rw[k])return false;store.rw[k]={t:Date.now()};save();return true;}
function rwCardHTML(s,i){const p=s.parts[i],pr=rwPrize(s,i),f=rwPh(s,i),n=SCENES.flatMap(x=>x.parts.map((q,j)=>x.id+'|'+j)).indexOf(rwKey(s,i))+1,r=store.rw&&store.rw[rwKey(s,i)];
  return `<div class="rw-card" style="--c:${DX_TH[s.theme]||'#E9C46A'}"><div class="rw-in">
    <div class="rw-f"><span class="rw-img" style="background-image:url('${rwKadr(s,i)}'),url('${assetUrl(scEpKey(s,i,'jpg'))}')"></span><span class="rw-sh"></span>
      <span class="rw-no">№ ${n}</span><span class="rw-cap"><em>${esc(dictFilm(s))} · эпизод ${i+1}</em><b>${esc(p.t)}</b></span></div>
    <div class="rw-b"><span class="rw-pr">${pr[0]}</span><em>Кадр № ${n}</em><b>${esc(p.t)}</b><small>${esc(s.sub||s.title)}</small>
      ${f?`<p class="rw-q">«${esc(f.en)}»<span>${esc(f.ru)}</span></p>`:''}${r?`<small class="rw-dt">получен ${new Date(r.t).toLocaleDateString('ru-RU')}</small>`:''}</div></div></div>`;}
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
function rwBind(box,s,i){const c=box.querySelector('.rw:not(.sgw) .rw-card');if(c){rwTilt(c);if(box.querySelector('.rw.fresh:not(.sgw)')){sfx('reward');}if(box.querySelector('.rw.fresh:not(.sgw)'))c.querySelector('.rw-in').animate([{transform:'rotateY(-200deg) scale(.55)',opacity:0},{transform:'rotateY(12deg) scale(1.03)',opacity:1,offset:.7},{transform:'none',opacity:1}],{duration:1100,delay:350,easing:'cubic-bezier(.2,.9,.3,1)',fill:'backwards'});}
  const F=epFacts(s,i);
  box.querySelectorAll('.rwf .rw-fact').forEach(fb=>fb.onclick=()=>{if(fb.classList.contains('open'))return;const x=F[+fb.dataset.fk];if(!x)return;sfx('unlock');haptic('ok');fb.classList.add('open');
    fb.innerHTML=`<span class="rw-env">✦</span><span><em>${x.f?'«'+esc(scT(x.f))+'»':'Факт о сцене'}</em><p>${esc(x.t)}</p></span>`;fb.animate([{transform:'rotateX(80deg)',opacity:.2},{transform:'none',opacity:1}],{duration:420,easing:'cubic-bezier(.2,1,.3,1)'});});
  bgBind(box);}
/* ===== фоны-награды: e:sid|i — фон эпизода (NN-bg.jpg, иначе кадр NN-k.jpg); h:фильм — главный живой фон (bg.mp4 по кругу) ===== */
const showOf=s=>s.show||s.title;
const showScenes=h=>SCENES.filter(x=>x.kind!=='clip'&&showOf(x)===h&&flagOf('scene-'+x.id)!=='hide');
const showDone=h=>{const L=showScenes(h);return L.length>0&&L.every(x=>segDone(x));};
const showHas=h=>!!(store.showRw&&store.showRw[h]);
function showGive(s){const h=showOf(s);if(!showDone(h)||showHas(h))return false;store.showRw=store.showRw||{};store.showRw[h]={t:Date.now()};save();return true;}
function bgInfo(k){if(!k)return null;
  if(k.startsWith('e:')){const [sid,ii]=k.slice(2).split('|'),s=scOf(sid),i=+ii;if(!s||!s.parts[i])return null;const nn=String(i+1).padStart(2,'0');
    return {k,got:rwHas(s,i),img:[assetUrl(scKey(s,nn+'-bg.jpg')),rwKadr(s,i)],vid:[],name:s.parts[i].t,sub:dictFilm(s)+' · эпизод '+(i+1)};}
  if(k.startsWith('h:')){const h=k.slice(2),L=showScenes(h);if(!L.length)return null;
    return {k,got:showHas(h),img:[assetUrl(scKey(L[0],'bg.jpg')),scCover(L[0],'cover.jpg')],vid:[...L.filter(x=>x.filmbg).map(x=>assetUrl(scKey(x,'film-bg.mp4'))),...L.filter(x=>x.bgv).map(x=>assetUrl(scKey(x,'bg.mp4')))],name:h,sub:'Главный фон · весь фильм',live:L.some(x=>x.bgv||x.filmbg)};}
  const s=scOf(k);if(s&&s.parts)return {k,got:segHas(s),img:segBgUrls(s),vid:s.bgv?[assetUrl(scKey(s,'bg.mp4'))]:[],name:s.sub||s.title,sub:dictFilm(s),live:!!s.bgv};   // 12.5: фон сцены — за всю сцену
  return null;}
function bgRowHTML(k,label){const b=bgInfo(k);if(!b)return '';const on=store.appBg===k;
  return `<div class="seg-bg" data-bgrow="${esc(k)}"><span class="seg-bgi${b.live?' live':''}" style="background-image:${b.img.map(u=>`url('${u}')`).join(',')}">${b.live?'<i>▶ живой</i>':''}</span><span class="seg-bgt"><em>${label}</em><b>${on?'Стоит фоном главной':'Поставь фоном главной'}</b></span>
    <button class="seg-set${on?' on':''}" data-bg="${esc(k)}">${on?'Убрать':'Поставить'}</button></div>`;}
function bgBind(box){box.querySelectorAll('.seg-set[data-bg]').forEach(b=>b.onclick=()=>{const k=b.dataset.bg;store.appBg=store.appBg===k?'':k;save();sfx(store.appBg?'good':'tap');haptic('sel');
  toast(store.appBg?'🖼 Фон поставлен — увидишь на главной':'Фон убран');
  box.querySelectorAll('.seg-set[data-bg]').forEach(x=>{const on=store.appBg===x.dataset.bg;x.classList.toggle('on',on);x.textContent=on?'Убрать':'Поставить';const t=x.closest('.seg-bg');if(t){const bb=t.querySelector('.seg-bgt b');if(bb)bb.textContent=on?'Стоит фоном главной':'Поставь фоном главной';}});appBgApply();});}
/* ===== 12.3: награда за весь сегмент (сцену): карточка сегмента (золотая — если во всех эпизодах 3★) + фон сцены ===== */
const segDone=s=>!!s&&s.parts.every((_,j)=>scP(s.id).done.includes(j));
const segGold=s=>!!s&&s.parts.every((_,j)=>((scP(s.id).st||{})[j]||0)>=3);
const segHas=s=>!!(store.seg&&store.seg[s.id]);
const segBgUrls=s=>[assetUrl(scKey(s,'bg.jpg')),scCover(s,'cover.jpg')];
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
function segBgHTML(s){const [b,c]=segBgUrls(s),on=store.appBg===s.id;
  return `<div class="seg-bg"><span class="seg-bgi" style="background-image:url('${b}'),url('${c}')"></span><span class="seg-bgt"><em>🖼 Фон сцены</em><b>${on?'Стоит фоном главной':'Поставь фоном главной'}</b></span>
    <button class="seg-set${on?' on':''}" data-bg="${s.id}">${on?'Убрать':'Поставить'}</button></div>`;}
function segHTML(s,kind){const g=segGold(s),S=segStats(s);
  return `<section class="rw sgw${kind?' fresh':''}"><div class="rw-h"><b>${kind==='gold'?'★ Золотая карточка':'🏆 Сегмент завершён'}</b><i>${kind?'новое':'в коллекции'}</i></div>
    <p class="seg-t">🎬 ${esc(dictFilm(s))} — ${esc(s.sub||s.title)}</p><p class="seg-y">Ты получил:</p>
    ${segCardHTML(s)}<small class="rw-hint">Потяни карточку — вертится. Нажми — перевернётся.</small>
    ${bgRowHTML(s.id,'🖼 Фон сцены')}
    <p class="seg-n"><b>${S.ph}</b> ${plural(S.ph,['фраза изучена','фразы изучены','фраз изучено'])}${g?'':' · пройди все эпизоды на 3★ — карточка станет золотой'}</p></section>`;}
function segBind(box,s){const c=box.querySelector('.seg-card');if(c){rwTilt(c);if(box.querySelector('.sgw.fresh')){sfx('reward');haptic('ok');c.querySelector('.rw-in').animate([{transform:'rotateY(-200deg) scale(.5)',opacity:0},{transform:'rotateY(12deg) scale(1.04)',opacity:1,offset:.7},{transform:'none',opacity:1}],{duration:1200,delay:300,easing:'cubic-bezier(.2,.9,.3,1)',fill:'backwards'});
    const b=box.querySelector('.seg-bg');if(b)b.animate([{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'none'}],{duration:500,delay:1300,easing:'ease-out',fill:'backwards'});}}
  bgBind(box);}
// 12.3: фон сцены — фоном главной и вкладок (не в самих сценах: там свой фон)
function appBgApply(){const b=bgInfo(store.appBg);let a=document.getElementById('appbg');
  if(!b||!b.got){document.body.classList.remove('appbg');if(a){const v=a.querySelector('video');if(v)v.pause();}return;}
  if(!a){a=document.createElement('div');a.id='appbg';a.setAttribute('aria-hidden','true');document.body.prepend(a);}
  if(a.dataset.k!==b.k){a.dataset.k=b.k;a.style.backgroundImage=b.img.map(u=>`url('${u}')`).join(',');const o=a.querySelector('video');if(o){o.pause();o.remove();}
    const lite=(navigator.connection&&navigator.connection.saveData)||matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(b.vid.length&&!lite){const L=b.vid.filter(u=>!AMB_BAD[u]);if(L.length){const v=document.createElement('video');['muted','playsinline','webkit-playsinline','autoplay','disablepictureinpicture'].forEach(x=>v.setAttribute(x,''));v.muted=true;v.playsInline=true;v.preload='auto';
      v.addEventListener('playing',()=>v.classList.add('on'));let n=0;v.addEventListener('error',()=>{AMB_BAD[L[n]]=1;n++;if(L[n])v.src=L[n];else v.remove();});v.src=L[0];bgLoop(v);a.prepend(v);}}}
  document.body.classList.add('appbg');const v=a.querySelector('video');if(v){if(document.body.dataset.scn)v.pause();else if(v.paused){const p=v.play();if(p&&p.catch)p.catch(()=>{});}}}
// 12.4: бесшовная петля видеофона — у конца мягко гаснет и начинается заново (без рывка «склейки»)
function bgLoop(v){v.loop=false;v.addEventListener('timeupdate',()=>{const d=v.duration;if(!d||!isFinite(d))return;const t=v.currentTime;v.style.opacity=t>d-0.7?Math.max(0,(d-t)/0.7):t<0.7?Math.min(1,t/0.7):'';});
  v.addEventListener('ended',()=>{try{v.currentTime=0;}catch(e){}const p=v.play();if(p&&p.catch)p.catch(()=>{});});}
// итог эпизода: если этим эпизодом закончен сегмент — большая награда, иначе — кадр и факт
function rwEndHTML(s,i,rwNew){const g=segGive(s),h=showGive(s);return rwHTML(s,i,rwNew)+(g?segHTML(s,g):'')+(h?showHTML(s):'');}
function showHTML(s){const h=showOf(s);return `<section class="rw sgw shw fresh"><div class="rw-h"><b>🏆 ${esc(h)} — пройден целиком</b><i>главная награда</i></div>
  <p class="seg-y">Все сцены фильма пройдены. Тебе — главный живой фон: кусок фильма по кругу, на главной.</p>${bgRowHTML('h:'+h,'🎬 Главный фон')}</section>`;}
function rwEndBind(box,s,i){rwBind(box,s,i);segBind(box,s);bgBind(box);}
// коллекция в профиле: значки и кадры; кадр открывается и вертится
function rwAll(){const L=[];SCENES.filter(s=>s.kind!=='clip'&&flagOf('scene-'+s.id)!=='hide').forEach(s=>s.parts.forEach((p,i)=>L.push({s,i,got:rwHas(s,i)})));return L;}
function rwProfileHTML(){const L=rwAll(),g=L.filter(x=>x.got),SG=SCENES.filter(s=>s.kind!=='clip'&&flagOf('scene-'+s.id)!=='hide'),sg=SG.filter(segHas);
  return `<h2 class="sec2 anim">Карточки сегментов <span>${sg.length} из ${SG.length}</span></h2>
    <div class="rwc anim"><div class="rwc-k seg-k">${[...SG.filter(segHas),...SG.filter(x=>!segHas(x))].map(s=>segHas(s)?`<button class="rwc-kd seg-kd${(store.seg[s.id]||{}).gold?' gold':''}" data-seg="${s.id}" style="background-image:url('${assetUrl(scKey(s,'poster.jpg'))}'),url('${scCover(s,'cover.jpg')}')"><span>${(store.seg[s.id]||{}).gold?'★':'🎬'}</span></button>`:`<span class="rwc-kd seg-lock" title="${esc(dictFilm(s))} — ${esc(s.sub||'')}">🔒</span>`).join('')}</div>
      <small class="rwc-n">${sg.length?'Нажми на карточку — откроется. Там же фон сцены: его можно поставить фоном приложения.':'Пройди все эпизоды одной сцены — получишь карточку сегмента и фон сцены.'}</small></div>
    ${bgGalleryHTML()}
    <h2 class="sec2 anim">Кадры эпизодов <span>${g.length} из ${L.length}</span></h2>
    <div class="rwc anim">${g.length?`<div class="rwc-k">${g.map(x=>`<button class="rwc-kd" data-rw="${rwKey(x.s,x.i)}" style="background-image:url('${rwKadr(x.s,x.i)}'),url('${assetUrl(scEpKey(x.s,x.i,'jpg'))}')"></button>`).join('')}</div>`:''}
      <div class="rwc-m" hidden>${L.map(x=>`<span class="rwc-md${x.got?' on':''}" title="${x.got?esc(rwPrize(x.s,x.i)[1]):'Пройди эпизод «'+esc(x.s.parts[x.i].t)+'»'}">${x.got?rwPrize(x.s,x.i)[0]:'?'}</span>`).join('')}</div>
      <small class="rwc-n">${g.length?'Кадр — за каждый пройденный эпизод. Нажми — откроется с интересным фактом.':'Пройди проверку любого эпизода — получишь кадр и интересный факт.'}</small></div>`;}
function rwOpen(k){const [sid,ii]=k.split('|'),s=scOf(sid),i=+ii;if(!s)return;const o=document.createElement('div');o.className='rwo';
  o.innerHTML=`<div class="rwo-dim"></div><div class="rwo-box">${rwCardHTML(s,i)}<small class="rw-hint">Потяни — вертится, нажми — перевернётся</small>${epFact(s,i)?`<div class="rwo-fact"><em>✦ Интересный факт</em><p>${esc(epFact(s,i))}</p></div>`:''}<button class="sc-btn ghost" id="rwoX">Закрыть</button></div>`;
  document.body.appendChild(o);rwTilt(o.querySelector('.rw-card'));o.querySelector('.rw-in').animate([{transform:'rotateY(-90deg) scale(.7)',opacity:0},{transform:'none',opacity:1}],{duration:500,easing:'cubic-bezier(.2,1,.3,1)'});
  const close=()=>{o.animate([{opacity:1},{opacity:0}],{duration:200}).onfinish=()=>o.remove();};o.querySelector('.rwo-dim').onclick=close;o.querySelector('#rwoX').onclick=()=>{sfx('tap');close();};}
// 12.4: фоны в профиле — полученные (эпизоды и главные фоны фильмов); нажал — стоит фоном главной, ещё раз — убран
function bgGalleryHTML(){const L=[];SCENES.filter(x=>x.kind!=='clip'&&flagOf('scene-'+x.id)!=='hide').forEach(x=>{const h='h:'+showOf(x);if(!L.includes(h))L.push(h);L.push(x.id);});
  const B=L.map(bgInfo).filter(Boolean),G=B.filter(b=>b.got).sort((a,b)=>(b.live?1:0)-(a.live?1:0)),all=B.length;
  return `<h2 class="sec2 anim">Фоны <span>${G.length} из ${all}</span></h2><div class="rwc anim">${G.length?`<div class="rwc-k bgp">${G.map(b=>`<button class="bgp-i${b.live?' live':''}${store.appBg===b.k?' on':''}" data-bgp="${esc(b.k)}" style="background-image:${b.img.map(u=>`url('${u}')`).join(',')}"><span>${b.live?'▶ ':''}${esc(b.name)}</span></button>`).join('')}</div>`:''}
    <small class="rwc-n">${G.length?'Нажми — фон встанет на главную. Сцена даёт свой фон, весь фильм — главный.':'Пройди сцену целиком — получишь её фон. Весь фильм — главный фон.'}</small></div>`;}
function segOpen(sid){const s=scOf(sid);if(!s||!segHas(s))return;const o=document.createElement('div');o.className='rwo';
  o.innerHTML=`<div class="rwo-dim"></div><div class="rwo-box">${segCardHTML(s)}<small class="rw-hint">Потяни — вертится, нажми — перевернётся</small><button class="sc-btn ghost" id="rwoX">Закрыть</button></div>`;
  document.body.appendChild(o);segBind(o,s);o.querySelector('.rw-in').animate([{transform:'rotateY(-90deg) scale(.7)',opacity:0},{transform:'none',opacity:1}],{duration:500,easing:'cubic-bezier(.2,1,.3,1)'});
  const close=()=>{o.animate([{opacity:1},{opacity:0}],{duration:200}).onfinish=()=>o.remove();};o.querySelector('.rwo-dim').onclick=close;o.querySelector('#rwoX').onclick=()=>{sfx('tap');close();};}
/* ================= «как запомнить»: созвучие + картинка, отдельно для английского и немецкого ================= */
const MEM=window.__DATA.MEM;
function memOf(mode,cid,L,t){const m=MEM[mode]&&MEM[mode][cid];return m?m[L==='de'?1:0]:(t?t[0]:'');}
Object.assign(MEM,{items:{
bottle:['Bottle ≈ «ботл»: боттл — бутылка, в Доте мидер носит её с руной.','die Flasche ≈ «фляшка»: фляжка — бутылка.'],
cheese:['Cheese ≈ «чиз»: чизбургер — с сыром.','der Käse ≈ «кезе»: как «кейс» с сыром.'],
crown:['Crown ≈ «краун»: корона, крона дерева — макушка.','die Krone ≈ «кроне»: крона и корона — на макушке.'],
cloak:['Cloak ≈ «клоук»: плащ — клоак, как у фокусника.','der Umhang ≈ «умханг»: um (вокруг) + hängen (висеть) — висит вокруг плеч.'],
heart:['Heart ≈ «харт»: хартия — от сердца.','das Herz ≈ «херц»: пульс в герцах — сердце.'],
eye:['Eye ≈ «ай»: «ай!» — в глаз попало.','das Auge ≈ «ауге»: «ау!» — глаз видит, кто зовёт.'],
fire:['Fire ≈ «файэ»: файер-шоу — огонь.','das Feuer ≈ «фойер»: фейерверк — огонь.'],
smoke:['Smoke ≈ «смоук»: смокинг курили — дым.','der Rauch ≈ «раух»: раухтопф — копчёный дымом.'],
mango:['Mango — манго, одинаково.','die Mango — манго, женский род.'],
branch:['Branch ≈ «бранч»: ветка — и ветка компании (филиал).','der Zweig ≈ «цвайг»: две (zwei) ветки.'],
dagger:['Dagger ≈ «дэггер»: даггер — кинжал, Blink Dagger телепортирует.','der Dolch ≈ «дольх»: долго точили кинжал.'],
king:['King ≈ «кинг»: Кинг-Конг — король.','der König ≈ «кёниг»: Кёнигсберг — «королевская гора».'],
sblade:['Blade ≈ «блейд»: Блейд — охотник с клинком.','die Klinge ≈ «клинге»: клинок.'],
fly:['Butterfly: butter (масло) + fly (муха) — бабочка.','der Schmetterling ≈ «шметтерлинг»: шмат-шмат крыльями — бабочка.'],
force:['Staff ≈ «стафф»: посох; а ещё staff — персонал.','der Stab ≈ «штаб»: посох, штаб держит палку.'],
fury:['Fury ≈ «фьюри»: фурия — в ярости.','die Wut ≈ «вут»: «ву-ух!» — ярость.'],
lens:['Lens ≈ «ленс»: линза, объектив камеры.','die Linse ≈ «линзе»: линза и чечевица.'],
drum:['Drum ≈ «драм»: драм-машина — барабан.','die Trommel ≈ «троммель»: тромбон рядом с барабаном.'],
pipe:['Pipe ≈ «пайп»: пайплайн — труба, трубка.','die Pfeife ≈ «пфайфе»: пфф — дым из трубки; ещё и свисток.'],
midas:['Hand ≈ «хэнд»: хенд-мейд — сделано рукой.','die Hand — рука, почти как в английском.'],
mom:['Mask ≈ «маск» — маска.','die Maske — маска.'],
vessel:['Vessel ≈ «вессел»: сосуд и судно — везёт жидкость.','das Gefäß ≈ «гефэс»: фасуют в сосуд.'],
soulring:['Ring ≈ «ринг»: кольцо и ринг для бокса — круглые.','der Ring — кольцо, как в английском.'],
ghost:['Ghost ≈ «гоуст»: гость-призрак.','der Geist ≈ «гайст»: дух, как Zeitgeist — дух времени.']
},heroes:{
witch:['Witch ≈ «уич»: Witch Doctor — ведьма-доктор.','die Hexe ≈ «хексе»: хэкс-заклятие ведьмы.'],
doctor:['Doctor — доктор, врач.','der Arzt ≈ «арцт»: арцт лечит от «ой, ай».'],
knight:['Knight ≈ «найт» (k молчит): рыцарь ночью (night).','der Ritter ≈ «риттер»: рыцарь.'],
king:['King ≈ «кинг»: Wraith King — король.','der König ≈ «кёниг»: король.'],
queen:['Queen ≈ «куин»: группа Queen — королева.','die Königin: König + in — королева.'],
pain:['Pain ≈ «пейн»: Queen of Pain — королева боли.','der Schmerz ≈ «шмерц»: шмяк — и боль.'],
night:['Night ≈ «найт»: Night Stalker охотится ночью.','die Nacht ≈ «нахт»: Gute Nacht — спокойной ночи.'],
light:['Light ≈ «лайт»: Keeper of the Light — свет.','das Licht ≈ «лихт»: лихо светит.'],
keeper:['Keeper ≈ «кипер»: голкипер хранит ворота.','der Hüter ≈ «хютер»: хуторянин хранит дом.'],
winter:['Winter — зима, как по-английски, так и по-немецки.','der Winter — зима.'],
sand:['Sand ≈ «сэнд»: Sand King — король песка.','der Sand — песок.'],
hunter:['Hunter ≈ «хантер»: хантер — охотник.','der Jäger ≈ «егер»: егерь — охотник.'],
bounty:['Bounty ≈ «баунти»: награда за голову (и шоколадка «рай»).','das Kopfgeld: Kopf (голова) + Geld (деньги).'],
beast:['Beast ≈ «бист»: бестия — зверь.','die Bestie ≈ «бестие»: бестия.'],
master:['Master ≈ «мастер» — хозяин, мастер.','der Meister ≈ «майстер»: мастер.'],
nature:['Nature ≈ «нейче»: натура — природа.','die Natur — природа.'],
prophet:['Prophet ≈ «профит»: пророк предсказал профит.','der Prophet — пророк.'],
dark:['Dark ≈ «дарк»: Dark Seer — тёмный.','dunkel ≈ «дункель»: тёмное пиво Dunkel.'],
seer:['Seer ≈ «сиа»: see — видеть, провидец видит.','der Seher: sehen (видеть) — провидец.'],
ancient:['Ancient ≈ «эйншент»: Древний — главное здание в Доте.','uralt: ur (пра-) + alt (старый) — древний.'],
elder:['Elder ≈ «элдер»: старше (older) — старейшина.','der Älteste: alt (старый) — самый старый.'],
tide:['Tide ≈ «тайд»: Tidehunter — охотник за приливами.','die Flut ≈ «флут»: флюид прибывает — прилив.'],
ranger:['Ranger ≈ «рейнджер»: Power Rangers — следопыты.','der Waldläufer: Wald (лес) + Läufer (бегун) — следопыт.'],
monkey:['Monkey ≈ «манки»: Monkey King — обезьяна.','der Affe ≈ «аффе»: обезьяна аффектирует.'],
lone:['Lone ≈ «лоун»: Lone Druid — одинокий.','einsam: ein (один) + sam — одинокий.'],
brew:['Brew ≈ «бру»: Brewmaster — мастер варева.','das Gebräu: brauen (варить) — варево.'],
vengeful:['Vengeful ≈ «венджфул»: вендетта — мстительный.','rachsüchtig: Rache (месть) + süchtig (зависимый).'],
spirit:['Spirit ≈ «спирит»: спиритизм — духи.','der Geist ≈ «гайст»: дух, как Zeitgeist.'],
dawn:['Dawn ≈ «дон»: Dawnbreaker — рассвет.','die Morgendämmerung: Morgen (утро) + Dämmerung (сумерки).'],
protector:['Protector ≈ «протектор» — защитник.','der Beschützer: schützen — защищать.'],
faceless:['Faceless: face (лицо) + less (без) — безликий.','gesichtslos: Gesicht (лицо) + los (без).'],
commander:['Commander ≈ «коммандер» — командир.','der Kommandant — командир.'],
assassin:['Assassin ≈ «ассасин» — наёмный убийца, как в Assassin\'s Creed.','der Attentäter: Attentat — покушение.'],
maiden:['Maiden ≈ «мейден»: Crystal Maiden — дева.','das Mädchen ≈ «медхен» — девушка.'],
ember:['Ember ≈ «эмбер»: янтарный уголёк — тлеет.','die Glut ≈ «глют»: глоток жара — угли.'],
storm:['Storm ≈ «шторм» — буря.','der Sturm ≈ «штурм»: штурм — буря.'],
silence:['Silence ≈ «сайленс»: сайленсер — глушитель, тишина.','die Stille ≈ «штилле»: штиль — тишина.'],
stealer:['Stealer: steal (красть) — вор.','der Dieb ≈ «диб»: вор утащил.'],
seeker:['Seeker: seek (искать) — искатель; hide and seek — прятки.','der Sucher: suchen (искать) — искатель.'],
clock:['Clock ≈ «клок»: Clockwerk — часы.','die Uhr ≈ «ур»: «у-у-р» — часы тикают.'],
saw:['Saw ≈ «со»: Пила (фильм Saw) — пила.','die Säge ≈ «зеге»: зигзаг зубьев пилы.'],
timber:['Timber ≈ «тимбер»: Timbersaw пилит древесину.','das Holz ≈ «хольц»: холст из дерева.'],
tiny:['Tiny ≈ «тайни»: крошечный великан Тайни.','winzig ≈ «винциг»: винтик — крошечный.'],
warlock:['Warlock ≈ «уорлок»: колдун.','der Hexenmeister: Hexe (ведьма) + Meister (мастер).'],
enchantress:['Enchantress ≈ «энчантресс»: очаровывает — чародейка.','die Zauberin: Zauber (волшебство) — чародейка.'],
bat:['Bat ≈ «бэт»: Бэтмен — летучая мышь.','die Fledermaus: flattern (порхать) + Maus (мышь).'],
rider:['Rider ≈ «райдер»: райдер — всадник.','der Reiter ≈ «райтер»: всадник.'],
venom:['Venom ≈ «веном» — яд, как у Венома.','das Gift ≈ «гифт» — яд (не подарок!).'],
razor:['Razor ≈ «рейзор»: бритва.','das Rasiermesser: rasieren (брить) + Messer (нож).'],
weaver:['Weaver ≈ «уивер»: weave — ткать, ткач.','der Weber ≈ «вебер»: ткач (Weber — частая фамилия).'],
primal:['Primal ≈ «праймал»: прайм — первичный.','urzeitlich: Urzeit — первобытное время.'],
undying:['Undying: un (не) + dying (умирающий) — бессмертный.','unsterblich: un + sterben (умирать).'],
grim:['Grim ≈ «грим»: мрачный грим.','finster ≈ «финстер»: финиш в темноте — мрачно.'],
hoodwink:['Hoodwink: hood (капюшон) на глаза — обмануть.','täuschen ≈ «тойшен»: тушить свет и обманывать.'],
spectre:['Spectre ≈ «спектр»: призрак из спектра.','das Gespenst ≈ «гешпенст»: привидение.'],
warlord:['Warlord: war (война) + lord (лорд) — военачальник.','der Kriegsherr: Krieg (война) + Herr (господин).'],
fiend:['Fiend ≈ «финд»: изверг.','der Unhold: un + hold (милый) — немилый, изверг.'],
warden:['Warden ≈ «уорден»: надзиратель в тюрьме.','der Wärter ≈ «вертер»: надзиратель.'],
devourer:['Devourer: devour — пожирать, пожиратель.','der Verschlinger: schlingen — глотать.'],
willow:['Willow ≈ «уиллоу»: ива.','die Weide ≈ «вайде»: ива и пастбище.'],
tusk:['Tusk ≈ «таск»: бивень.','der Stoßzahn: stoßen (толкать) + Zahn (зуб).'],
tinker:['Tinker ≈ «тинкер»: тинкерить — возиться, мастерить.','der Bastler: basteln — мастерить.'],
earth:['Earth ≈ «ёрс»: Earthshaker трясёт землю.','die Erde ≈ «эрде»: земля.'],
disruptor:['Disruptor: disrupt — нарушать, нарушитель.','der Störer: stören — мешать.']
}});
Object.assign(MEM,{skills:{
zuus_lightning_bolt:['Lightning ≈ «лайтнинг»: light (свет) — молния светит.','der Blitz ≈ «блиц»: блиц — быстро, как молния.'],
zuus_thundergods_wrath:['Wrath ≈ «рэс»: гнев бога грома — rage, только пафоснее.','der Zorn ≈ «цорн»: «зорко» злишься — гнев.'],
invoker_sun_strike:['Sun ≈ «сан»: санлайт, санкрим — солнце.','die Sonne ≈ «зонне»: Sonntag — день солнца, воскресенье.'],
invoker_tornado:['Tornado — торнадо, одинаково; от испанского «вертеться».','der Tornado — торнадо, мужской род.'],
invoker_ice_wall:['Wall ≈ «уол»: вал — стена крепости.','die Wand ≈ «ванд»: стена в комнате (снаружи — Mauer).'],
storm_spirit_ball_lightning:['Ball ≈ «болл»: мяч и шар.','die Kugel ≈ «кугель»: кегли катают шаром.'],
lina_dragon_slave:['Dragon ≈ «дрэгон»: драгон — дракон.','der Drache ≈ «драхе»: дракон; ещё и воздушный змей.'],
lina_laguna_blade:['Blade ≈ «блейд»: Блейд — охотник с клинком.','die Klinge ≈ «клинге»: клинок.'],
nevermore_requiem:['Souls ≈ «соулз»: соул-музыка — музыка души.','die Seelen: Seele ≈ «зееле» — душа.'],
queenofpain_shadow_strike:['Shadow ≈ «шэдоу»: шедевр в тени — тень.','der Schatten ≈ «шаттен»: шатёр даёт тень.'],
puck_dream_coil:['Dream ≈ «дрим»: дрим-тим — команда мечты.','der Traum ≈ «траум»: травма от кошмарного сна.'],
leshrac_split_earth:['Earth ≈ «ёрс»: планета Земля — Earth.','die Erde ≈ «эрде»: земля, Erdbeere — земляника.'],
pangolier_gyroshell:['Thunder ≈ «сандер»: гром гремит «тан-дер».','der Donner ≈ «доннер»: Donnerstag — день грома, четверг.'],
juggernaut_blade_fury:['Fury ≈ «фьюри»: фурия — в ярости.','die Wut ≈ «вут»: «ву-ух!» — ярость.'],
juggernaut_healing_ward:['Ward ≈ «уорд»: вард в Доте сторожит место.','der Wächter ≈ «вехтер»: вахтёр — страж.'],
phantom_assassin_stifling_dagger:['Dagger ≈ «дэггер»: кинжал, как Blink Dagger.','der Dolch ≈ «дольх»: долго точили кинжал.'],
antimage_mana_break:['Break ≈ «брейк»: брейк-данс — ломаешь тело.','der Bruch ≈ «брух»: брешь — разрыв, разрушение.'],
faceless_void_chronosphere:['Chronosphere: chrono (время) + sphere (сфера) — сфера остановленного времени.','die Chronosphäre: Chronometer измеряет время, Sphäre — сфера.'],
slark_shadow_dance:['Dance ≈ «дэнс»: дэнс-баттл — танец.','der Tanz ≈ «танц»: танец.'],
troll_warlord_battle_trance:['Battle ≈ «баттл»: рэп-баттл — битва.','die Schlacht ≈ «шлахт»: шлагбаум на поле битвы.'],
sven_gods_strength:['God ≈ «гад»: God of War — бог войны.','der Gott ≈ «гот»: Gott sei Dank — слава богу.'],
life_stealer_rage:['Rage ≈ «рейдж»: рейдж-квит — выйти из игры в ярости.','die Raserei ≈ «разерай»: rasen — мчаться в бешенстве.'],
bloodseeker_thirst:['Thirst ≈ «сёрст»: сёрфер после волн хочет пить — жажда.','der Durst ≈ «дурст»: от жары дурно — жажда.'],
medusa_stone_gaze:['Stone ≈ «стоун»: Стоунхендж — каменный круг.','der Stein ≈ «штайн»: Эйнштейн — «один камень».'],
luna_eclipse:['Eclipse ≈ «иклипс»: затмение — луна «съедает» солнце.','die Finsternis ≈ «финстернис»: финиш света — тьма, затмение.'],
sniper_assassinate:['Assassinate: assassin (наёмный убийца) — убить по заказу.','ermorden: Mord (убийство) — убить.'],
axe_berserkers_call:['Call ≈ «колл»: колл-центр — звонки, зов.','der Ruf ≈ «руф»: рупор — зов.'],
mars_arena_of_blood:['Blood ≈ «блад»: Bloodseeker ищет кровь.','das Blut ≈ «блют»: блюдо с кровью.'],
tidehunter_ravage:['Ravage ≈ «рэвидж»: разорить, опустошить; ravaged — разгромленный.','die Verwüstung: Wüste (пустыня) — превратить в пустыню.'],
enigma_black_hole:['Hole ≈ «хоул»: хол в полу — дыра.','das Loch ≈ «лох»: дыра, в которую провалился лох.'],
legion_commander_duel:['Duel — дуэль, одинаково.','das Duell — дуэль, средний род.'],
centaur_hoof_stomp:['Hoof ≈ «хуф»: «ух!» — удар копытом.','der Huf ≈ «хуф»: копыто.'],
batrider_flaming_lasso:['Flaming ≈ «флейминг»: flame — пламя, пылающий.','brennend ≈ «бреннент»: бренди горит — пылающий.'],
night_stalker_void:['Void ≈ «войд»: пустота, как Faceless Void.','die Leere ≈ «лере»: leer — пустой.'],
tiny_toss:['Toss ≈ «тосс»: toss a coin — подбросить монетку.','der Wurf ≈ «вурф»: werfen — бросать, бросок.'],
kunkka_ghostship:['Ghost ≈ «гоуст»: гость-призрак.','der Geist ≈ «гайст»: дух, как Zeitgeist — дух времени.'],
earthshaker_fissure:['Fissure ≈ «фишер»: трещина в земле.','der Spalt ≈ «шпальт»: шпала треснула — щель.'],
earthshaker_echo_slam:['Echo — эхо, одинаково.','das Echo — эхо, средний род.'],
pudge_meat_hook:['Hook ≈ «хук»: хук в боксе — удар крюком.','der Haken ≈ «хакен»: хакер цепляет крюком.'],
disruptor_thunder_strike:['Strike ≈ «страйк»: страйк в боулинге — удар.','der Schlag ≈ «шлаг»: шлагбаум бьёт — удар.'],
disruptor_glimpse:['Glimpse ≈ «глимпс»: мельком увидеть, беглый взгляд.','der Blick ≈ «блик»: блик в глазах — взгляд.'],
disruptor_kinetic_field:['Kinetic — кинетический, от «движение»; field — поле.','das Feld — поле; kinetisch — кинетический.'],
disruptor_static_storm:['Storm ≈ «сторм»: шторм — буря.','der Sturm ≈ «штурм»: буря идёт на штурм.'],
dark_willow_bramble_maze:['Maze ≈ «мейз»: amazing — лабиринт сбивает с толку.','das Labyrinth — лабиринт.'],
dark_willow_cursed_crown:['Cursed ≈ «кёрст»: curse — проклятие.','verflucht ≈ «ферфлухт»: Fluch — проклятие.'],
crystal_maiden_frostbite:['Frost — мороз, одинаково; frostbite — обморожение.','der Frost — мороз.'],
crystal_maiden_freezing_field:['Field ≈ «филд»: поле, как в футболе.','das Feld ≈ «фельд»: фельдмаршал — полевой.'],
lion_impale:['Spike ≈ «спайк»: шипы на кроссовках.','der Stachel ≈ «штахель»: стая шипов у ежа.'],
lich_chain_frost:['Chain ≈ «чейн»: блокчейн — цепь блоков.','die Kette ≈ «кетте»: цепь, цепочка.'],
lich_frost_shield:['Shield ≈ «шилд»: щит.','der Schild ≈ «шильд»: щит; das Schild — табличка.'],
dazzle_shadow_wave:['Wave ≈ «уэйв»: вэйв в стадионе — волна.','die Welle ≈ «велле»: вельвет волнами — волна.'],
dazzle_shallow_grave:['Grave ≈ «грейв»: гравий на могиле.','das Grab ≈ «граб»: грабли у могилы.'],
omniknight_guardian_angel:['Angel ≈ «энджел»: ангел.','der Engel ≈ «энгель»: ангел.'],
treant_living_armor:['Living ≈ «ливинг»: living room — гостиная, где живут.','lebend ≈ «лебенд»: leben — жить, живой.'],
bane_nightmare:['Nightmare: night (ночь) + mare (ведьма) — кошмар.','der Albtraum: Alb (эльф) + Traum (сон) — кошмар.'],
bane_fiends_grip:['Grip ≈ «грип»: грип на гитаре — хватка.','der Griff ≈ «грифф»: гриф гитары держишь — хватка.'],
jakiro_ice_path:['Path ≈ «пас»: пас в футболе — путь мяча.','der Pfad ≈ «пфад»: тропа, путь.'],
rubick_spell_steal:['Spell ≈ «спел»: спел заклинание.','der Zauber ≈ «цаубер»: Zauberer — волшебник.'],
mirana_leap:['Leap ≈ «лип»: leap year — високосный год, «прыжок» на день.','der Sprung ≈ «шпрунг»: springen — прыгать, прыжок.'],
mirana_invis:['Moonlight: moon (луна) + light (свет) — лунный свет.','das Mondlicht: Mond (луна) + Licht (свет) — лунный свет.'],
witch_doctor_death_ward:['Death ≈ «дэс»: Death Prophet — пророчица смерти.','der Tod ≈ «тот»: тот свет — смерть.'],
windrunner_windrun:['Wind — ветер, одинаково.','der Wind ≈ «винд»: ветер.'],
tusk_snowball:['Snow ≈ «сноу»: сноуборд — доска для снега.','der Schnee ≈ «шнее»: шнеки снегоуборщика.']
}});
Object.assign(MEM.items,{
'Healing Salve':['Heal — лечить (хилер), salve ≈ «сэлв» — мазь: мажешь, и спасает (save).','die Heilsalbe: heilen (лечить) + Salbe ≈ «зальбе» — мазь, как бальзам.'],
'Iron Branch':['Iron ≈ «айрон»: Iron Man — железный человек; branch — ветка.','der Eisenzweig: Eisen ≈ «айзен» — железо (Eisenbahn — железная дорога) + Zweig — ветка.'],
'Gloves of Haste':['Haste ≈ «хейст»: haste makes waste — поспешишь, людей насмешишь.','die Handschuhe der Eile: Handschuh — «обувь для руки», перчатка; Eile — спешка.'],
'Belt of Strength':['Belt ≈ «белт»: чемпионский пояс у боксёров; strength — сила.','der Gürtel der Stärke: Gürtel ≈ «гюртель» — пояс; Stärke — сила (Старк).'],
'Boots of Speed':['Boots ≈ «бутс»: бутсы — ботинки; speed — скорость (спидометр).','die Stiefel der Geschwindigkeit: Stiefel ≈ «штифель» — сапоги.'],
'Ring of Protection':['Protection ≈ «протекшн»: протекция — защита.','der Ring des Schutzes: Schutz ≈ «шутц» — щит, защита.'],
'Chainmail':['Chain — цепь, mail — кольчужная сетка (не почта!).','das Kettenhemd: Kette (цепь) + Hemd (рубашка) — рубашка из цепей.'],
'Magic Wand':['Wand ≈ «уонд»: волшебная палочка, как у Гарри Поттера.','der Zauberstab: Zauber (волшебство) + Stab (палка). Осторожно: die Wand — стена!'],
'Power Treads':['Tread ≈ «тред»: шаг, протектор подошвы; power — сила.','die Krafttreter: Kraft — сила, treten — шагать, пинать.'],
'Blades of Attack':['Blade — клинок (Блейд), attack — атака.','die Klingen des Angriffs: Klinge — клинок; Angriff — атака (greifen — хватать).'],
'Ring of Health':['Health ≈ «хелс»: хелс-бар — полоска здоровья.','der Ring der Gesundheit: Gesundheit! — «будь здоров», когда чихают.'],
'Staff of Wizardry':['Wizard ≈ «уизард»: волшебник; staff — посох.','der Stab der Zauberei: Zauberei — волшебство, Zauberer — волшебник.'],
'Robe of the Magi':['Robe ≈ «роуб»: мантия и халат, bathrobe — банный халат.','die Robe der Magier: Robe — мантия; Magier — маги.'],
'Shadow Amulet':['Shadow ≈ «шэдоу»: шедевр в тени — тень.','das Schattenamulett: Schatten ≈ «шаттен» — шатёр даёт тень.']
});
/* ================= CS 2: полезные слова из игры (часть «полезных слов» с меткой мира g:'cs2') ================= */
const CS2_WORDS=[
{id:'cs_defuse',pos:'v',en:'to defuse',de:'entschärfen',ru:'обезвредить',hint:'Defuse the bomb — разминировать бомбу, главная задача спецназа.',icon:{svg:'target'}},
{id:'cs_plant',pos:'v',en:'to plant',de:'legen',ru:'заложить (бомбу)',hint:'Plant the bomb — заложить бомбу на точке.',icon:{svg:'flag'}},
{id:'cs_smoke',pos:'n',en:'smoke',de:'der Rauch',ru:'дым',hint:'Smoke — дымовая граната, закрывает обзор.',icon:{svg:'smoke'}},
{id:'cs_flash',pos:'n',en:'flash',de:'der Blitz',ru:'вспышка',hint:'Flashbang — светошумовая граната, ослепляет.',icon:{svg:'lightning'}},
{id:'cs_rotate',pos:'v',en:'to rotate',de:'rotieren',ru:'перейти (на другую точку)',hint:'Rotate to B — перебежать на точку B.',icon:{svg:'spin'}},
{id:'cs_peek',pos:'v',en:'to peek',de:'hervorlugen',ru:'выглянуть',hint:'Peek — выглянуть из-за угла.',icon:{svg:'eye'}},
{id:'cs_hold',pos:'v',en:'to hold',de:'halten',ru:'держать',hint:'Hold the angle — держать угол и ждать врага.',icon:{svg:'hand'}},
{id:'cs_clutch',pos:'n',en:'clutch',de:'die Kupplung',ru:'решающий момент; сцепление',hint:'Clutch — выиграть раунд, оставшись одному против нескольких.',icon:{svg:'trophy'}},
{id:'cs_retake',pos:'v',en:'to retake',de:'zurückerobern',ru:'отбить (снова взять)',hint:'Retake — отбить точку, где уже стоит бомба.',icon:{svg:'swords'}},
{id:'cs_rush',pos:'v',en:'to rush',de:'stürmen',ru:'рвануть, спешить',hint:'Rush B — всей командой бегом на точку B.',icon:{svg:'blink'}},
{id:'cs_save',pos:'v',en:'to save',de:'sparen',ru:'копить, сберечь',hint:'Save — не тратить деньги или сберечь оружие в проигранном раунде.',icon:{svg:'coin'}},
{id:'cs_eco',pos:'n',en:'economy',de:'die Wirtschaft',ru:'экономика, экономия',hint:'Eco — раунд, когда экономишь и не покупаешь оружие.',icon:{svg:'bars'}},
{id:'cs_drop',pos:'v',en:'to drop',de:'fallen lassen',ru:'бросить, уронить',hint:'Drop me an AK — скинь мне автомат.',icon:{svg:'drop'}},
{id:'cs_bait',pos:'n',en:'bait',de:'der Köder',ru:'приманка',hint:'Bait — отправить тиммейта вперёд как приманку.',icon:{svg:'pulse'}},
{id:'cs_lurk',pos:'v',en:'to lurk',de:'lauern',ru:'затаиться',hint:'Lurk — тихо сидеть в тылу врага.',icon:{svg:'ghost'}},
{id:'cs_spray',pos:'v',en:'to spray',de:'sprühen',ru:'брызгать; стрелять очередью',hint:'Spray — зажать огонь и стрелять очередью.',icon:{svg:'wave'}},
{id:'cs_aim',pos:'v',en:'to aim',de:'zielen',ru:'целиться',hint:'Aim — прицел и меткость; aim training — тренировка стрельбы.',icon:{svg:'target'}},
{id:'cs_reload',pos:'v',en:'to reload',de:'nachladen',ru:'перезарядить',hint:'Reload — перезарядка, самый опасный момент в перестрелке.',icon:{svg:'spin'}},
{id:'cs_cover',pos:'v',en:'to cover',de:'decken',ru:'прикрыть',hint:'Cover me — прикрой меня.',icon:{svg:'shield'}},
{id:'cs_trade',pos:'v',en:'to trade',de:'tauschen',ru:'обменять, разменяться',hint:'Trade — сразу убить того, кто убил тиммейта.',icon:{svg:'coin'}},
{id:'cs_entry',pos:'n',en:'entry',de:'der Eingang',ru:'вход',hint:'Entry — первым заходить на точку.',icon:{svg:'tower'}},
{id:'cs_backup',pos:'n',en:'backup',de:'die Verstärkung',ru:'подмога; резервная копия',hint:'I need backup — мне нужна подмога.',icon:{svg:'ally'}},
{id:'cs_hostage',pos:'n',en:'hostage',de:'die Geisel',ru:'заложник',hint:'Hostage — заложник в режиме спасения.',icon:{svg:'helmet'}},
{id:'cs_ammo',pos:'n',en:'ammo',de:'die Munition',ru:'патроны',hint:'Ammo — патроны; low ammo — патроны на исходе.',icon:{svg:'bars'}},
{id:'cs_vest',pos:'n',en:'vest',de:'die Weste',ru:'жилет, бронежилет',hint:'Kevlar vest — бронежилет из магазина.',icon:{svg:'shield'}},
{id:'cs_knife',pos:'n',en:'knife',de:'das Messer',ru:'нож',hint:'Knife — нож, с ним быстрее бегаешь.',icon:{svg:'dagger'}},
{id:'cs_round',pos:'n',en:'round',de:'die Runde',ru:'раунд; круг',hint:'Round — раунд матча, до 13 побед.',icon:{svg:'ring'}},
{id:'cs_surrender',pos:'v',en:'to surrender',de:'sich ergeben',ru:'сдаться',hint:'Surrender vote — голосование за сдачу.',icon:{svg:'flag'}},
{id:'cs_boost',pos:'v',en:'to boost',de:'verstärken',ru:'подсадить, усилить',hint:'Boost — подсадить тиммейта на ящик.',icon:{svg:'pulse'}},
{id:'cs_camp',pos:'v',en:'to camp',de:'campen',ru:'сидеть в засаде; жить в палатке',hint:'Camp — долго сидеть на одном месте в засаде.',icon:{svg:'tree'}},
{id:'cs_ace',pos:'n',en:'ace',de:'das Ass',ru:'туз; эйс',hint:'Ace — убить всех пятерых соперников за раунд.',icon:{svg:'star'}}
].map(w=>({...w,g:'cs2'}));
WORDS.push(...CS2_WORDS);
Object.assign(TIPS.words,{
cs_defuse:['De + fuse (запал) = снять запал. В жизни: defuse a situation — разрядить обстановку.','She joked to defuse the tension.','Sie machte einen Witz, um die Spannung zu entschärfen.','Она пошутила, чтобы разрядить обстановку.'],
cs_plant:['Plant — сажать растение и «закладывать». А ещё завод: power plant — электростанция. Бомбу по-немецки legen — «класть».','We planted a tree in the garden.','Leg die Bombe auf Punkt B!','Мы посадили дерево в саду.','Заложи бомбу на точке B!'],
cs_smoke:['Smoke — дым и «курить»: Do you smoke? — Ты куришь?','I can smell smoke.','Ich rieche Rauch.','Я чувствую запах дыма.'],
cs_flash:['Flash — вспышка; flashlight — фонарик; in a flash — мгновенно.','Take a photo without the flash.','Mach das Foto ohne Blitz.','Сфотографируй без вспышки.'],
cs_rotate:['Rotate — вращать и меняться по очереди: rotate shifts — меняться сменами.','We rotate shifts every week.','Die Erde rotiert um die Sonne.','Мы меняемся сменами каждую неделю.','Земля вращается вокруг Солнца.'],
cs_peek:['Sneak peek — тизер, «подглядеть» заранее.','Don\'t peek at the answers!','Er lugte hinter der Tür hervor.','Не подглядывай в ответы!','Он выглянул из-за двери.'],
cs_hold:['Hold on — подожди; hold the line — не вешай трубку.','Can you hold my bag?','Kannst du meine Tasche halten?','Подержишь мою сумку?'],
cs_clutch:['Clutch — сцепление в машине и «решающий момент»: a clutch player не сдаёт в конце.','Press the clutch before you shift gears.','Tritt die Kupplung, bevor du schaltest.','Выжми сцепление перед сменой передачи.'],
cs_retake:['Re- значит «снова»: retake an exam — пересдать экзамен.','I have to retake the exam.','Die Stadt wurde zurückerobert.','Мне надо пересдать экзамен.','Город отбили.'],
cs_rush:['Rush hour — час пик; Don\'t rush me — не торопи меня.','Don\'t rush, we have time.','Die Fans stürmten auf das Feld.','Не спеши, у нас есть время.','Фанаты выбежали на поле.'],
cs_save:['Save — спасти, сохранить и копить: save money — копить деньги.','I\'m saving money for a car.','Ich spare Geld für ein Auto.','Я коплю на машину.'],
cs_eco:['Economy — экономика и экономия; economy class — эконом-класс.','The economy is growing.','Die Wirtschaft wächst.','Экономика растёт.'],
cs_drop:['Drop — уронить; drop me a line — черкни мне; drop out — бросить учёбу.','Don\'t drop the glass!','Lass das Glas nicht fallen!','Не урони стакан!'],
cs_bait:['Clickbait — кликбейт, «приманка для кликов». Take the bait — клюнуть на приманку.','The fish took the bait.','Der Fisch hat den Köder geschluckt.','Рыба проглотила наживку.'],
cs_lurk:['Lurker — тот, кто читает чат, но сам не пишет.','Danger lurks in the dark.','Im Dunkeln lauert Gefahr.','Во тьме таится опасность.'],
cs_spray:['Spray — спрей и брызгать; spray paint — баллончик с краской.','Spray some water on the plants.','Sprüh etwas Wasser auf die Pflanzen.','Побрызгай цветы водой.'],
cs_aim:['Aim — цель и «целиться»: What\'s your aim? — Какая у тебя цель?','Aim at the target.','Ziel auf die Scheibe.','Целься в мишень.'],
cs_reload:['Reload the page — перезагрузить страницу, то же слово.','Reload the page.','Lade die Seite neu.','Перезагрузи страницу.'],
cs_cover:['Cover — обложка, крышка и «прикрыть»: I\'ll cover for you — я тебя подменю.','Can you cover for me tomorrow?','Deck mich, ich lade nach!','Подменишь меня завтра?','Прикрой меня, я перезаряжаюсь!'],
cs_trade:['Trade — торговля и обмен: trade places — поменяться местами.','Do you want to trade places?','Willst du die Plätze tauschen?','Хочешь поменяться местами?'],
cs_entry:['Entry — вход и запись: No entry — вход запрещён.','No entry!','Wo ist der Eingang?','Вход запрещён!','Где вход?'],
cs_backup:['Backup — подмога и резервная копия файлов.','Always make a backup of your files.','Wir brauchen Verstärkung!','Всегда делай резервную копию файлов.','Нам нужна подмога!'],
cs_hostage:['Hostage — заложник; hold someone hostage — держать в заложниках.','The police freed the hostages.','Die Polizei hat die Geiseln befreit.','Полиция освободила заложников.'],
cs_ammo:['Ammo — сокращение от ammunition. Run out of ammo — остаться без патронов, в том числе в споре.','We ran out of ammo.','Uns ist die Munition ausgegangen.','У нас кончились патроны.'],
cs_vest:['Vest — жилет; но в Британии vest — это майка!','He wore a bulletproof vest.','Er trug eine schusssichere Weste.','На нём был бронежилет.'],
cs_knife:['В knife буква k не читается: «найф».','Pass me the knife, please.','Gib mir bitte das Messer.','Передай мне нож, пожалуйста.'],
cs_round:['Round — раунд, круглый и «угощение»: This round is on me — эта выпивка за мой счёт.','This round is on me!','Die Runde geht auf mich!','Эта выпивка за мой счёт!'],
cs_surrender:['Surrender — сдаться, капитулировать.','The enemy surrendered.','Der Feind hat sich ergeben.','Враг сдался.'],
cs_boost:['Boost — ускорение, «прокачка»: boost your confidence — прибавить уверенности.','Coffee boosts my energy.','Das verstärkt den Effekt.','Кофе даёт мне заряд энергии.','Это усиливает эффект.'],
cs_camp:['Camp — лагерь и «сидеть на месте»; go camping — пойти в поход.','We go camping every summer.','Wir gehen jeden Sommer campen.','Мы каждое лето ходим в поход.'],
cs_ace:['Ace — туз и «мастер своего дела»; ace an exam — сдать на отлично.','She aced the exam.','Er hat ein Ass im Ärmel.','Она сдала экзамен на отлично.','У него туз в рукаве.']
});
// «Солянка»: самые полезные слова из Доты и CS 2 — те, что пригодятся и вне игры
const BEST_WORDS=['cs_defuse','cs_rush','cs_save','cs_drop','cs_cover','cs_backup','cs_clutch','cs_trade','cs_hold','cs_peek','cs_bait','cs_round','cs_ace','cs_reload','cs_lurk',
 'heal','escape','steal','catch','pull','push','sell','support','forget','grow','invisible','dangerous','rare','brave','empty','heavy','hidden','weapon','mistake','luck','courage','vision','gift'];
/* ================= миры: нейтральная главная, Дота, CS 2, солянка ================= */
let CURW='dota';
// оформление зависит от мира: нейтральное по умолчанию, дотерское внутри Доты, своё у CS 2 и у каждой сцены
function setWorld(w){
  document.body.classList.toggle('no-tts',!store.tts);
  const b=document.body.classList;['hud','clean','light','cs'].forEach(t=>b.remove('t-'+t));
  if(w==='dota')b.add('t-hud');else{b.add('t-clean');if(w==='cs2')b.add('t-cs');}
  document.body.dataset.world=w;
  try{if(TG){const c=w==='dota'?'#0C0E0F':w==='cs2'?'#0B1016':'#0A0B10';TG.setHeaderColor(c);TG.setBackgroundColor(c);if(TG.setBottomBarColor)TG.setBottomBarColor(c);}}catch(e){}
}
const hasGame=g=>!store.games||!store.games.length||store.games.includes(g);
function cs2Progress(){const L=store.langs[0];let l=0;CS2_WORDS.forEach(w=>{if(isLearned(mkey('words',w.id,L)))l++;});return {learned:l,total:CS2_WORDS.length};}
function bestProgress(){const L=store.langs[0];let l=0;BEST_WORDS.forEach(id=>{if(isLearned(mkey('words',id,L)))l++;});return {learned:l,total:BEST_WORDS.length};}
function dotaProgress(){let l=0,t=0;MODES.filter(m=>!m.tier).forEach(m=>{const p=modeProgress(m.id);l+=p.learned;t+=p.total;});return {learned:l,total:t};}
function play(world,type,mode){CURW=world==='best'?'best':world;setWorld(world==='best'?'neutral':world);startSession(type,mode);}
function backToWorld(){if(CURW==='dota'&&store.onboarded){renderDotaWorld();return;}if(CURW==='cs2'){renderCSWorld();return;}renderHome();}

function worldCardsHTML(){
  const dp=dotaProgress(),cp=cs2Progress();
  const dota=`<button class="wcard w-dota anim" id="wDota"><span class="wpic" style="background-image:url('${portrait(heroFor().hero)}')"></span><span class="wt"><em>Игра</em><b>Dota 2</b><small>Предметы, умения, герои, лор</small><span class="wbar"><i style="width:${dp.total?Math.round(dp.learned/dp.total*100):0}%"></i></span><small>выучено ${dp.learned} из ${dp.total}</small></span></button>`;
  const cs=`<button class="wcard w-cs anim" id="wCS"><span class="wpic cspic"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="20"/><path d="M32 6v14M32 44v14M6 32h14M44 32h14"/><circle cx="32" cy="32" r="3"/></svg></span><span class="wt"><em>Игра</em><b>CS 2</b><small>Слова, которые слышишь каждый раунд</small><span class="wbar"><i style="width:${Math.round(cp.learned/cp.total*100)}%"></i></span><small>выучено ${cp.learned} из ${cp.total}</small></span></button>`;
  return (hasGame('cs2')&&!hasGame('dota'))?cs+dota:dota+cs;
}
function kinoCardsHTML(){
  return SCENES.map(s=>{const L=scLearned(s),T=scTotal(s);
    return `<button class="kcard ${s.theme} anim" data-sc="${s.id}"><span class="kpic" style="background-image:url('${scCover(s,'cover.jpg')}')"></span>
      <span class="kt"><em>${esc(s.ep)}</em><b>${esc(s.title)}</b><small>${esc(s.sub)}</small><span class="kbar"><i style="width:${Math.round(L/T*100)}%"></i></span><small>фраз ${L} из ${T}</small></span></button>`;}).join('');
}
function learnTabHTML(){
  setWorld('neutral');CURW='dota';
  const d=dayStat(),goal=store.goal||20,gp=Math.min(100,Math.round(d.n/goal*100)),due=dueList().length,w=wordOfDay(),bp=bestProgress();
  const mis=store.mistakes.filter(x=>store.langs.includes(x.split('|')[2])).length;
  const games=`<h2 class="sec2 anim">Игры <span>Dota 2 и CS 2</span></h2>${worldCardsHTML()}`;
  const kino=`<h2 class="sec2 anim">Кинозал <span>сцены с разбором</span></h2>${kinoCardsHTML()}`;
  return `${headHTML()}
    <section class="goal card anim">
      <div class="gring"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="19"/><circle class="gv" cx="22" cy="22" r="19" style="--gp:${gp}"/></svg><b>${Math.min(d.n,goal)}</b></div>
      <div class="gtxt"><b>${d.done?'Цель дня выполнена':'Цель дня'}</b><small>${d.done?'+200 билетов уже у тебя':`Ещё ${goal-d.n} ${plural(goal-d.n,['ответ','ответа','ответов'])} до бонуса`}</small></div>
      <div class="gstreak"><b>${store.streak}</b><small>${plural(store.streak,['день','дня','дней'])} подряд</small></div>
    </section>
    <section class="hero2 anim" id="best"><span class="h2glow"></span><span class="h2t"><em>Солянка</em><b>Лучшие слова из игр</b><small>Dota 2 и CS 2: только то, что пригодится и в жизни. 10 вопросов.</small></span><span class="h2p"><span class="h2bar"><i style="width:${Math.round(bp.learned/bp.total*100)}%"></i></span><small>${bp.learned} из ${bp.total}</small><span class="h2go">Играть →</span></span></section>
    ${store.path!=='kino'?`<button class="lesson card anim" id="lesson"><span class="lsn-steps"><i>1</i><i>2</i><i>3</i></span><span><b>Урок: 5 новых слов</b><small>Слово → узнай → вспомни → напиши</small></span><span class="go">›</span></button>`:''}
    ${due?`<button class="rowcard card anim" id="review">${iconHTML({svg:'star'})}<span><b>Повторение</b><small>${due} ${plural(due,['слово пора','слова пора','слов пора'])} повторить</small></span><span class="go">›</span></button>`:''}
    ${store.path==='kino'?kino+games:games+kino}
    <div class="duo2">
      <button class="mini card anim" id="wod"><small>Слово дня</small><b>${esc(w.en)}</b><span>${esc(w.de)}</span></button>
      <button class="mini card anim${mis?' bad':''}" id="redo" ${mis?'':'disabled'}><small>Ошибки</small><b>${mis}</b><span>${mis?'разобрать сейчас':'пока нет'}</span></button>
    </div>`;
}
function bindLearn(){
  bindHead();
  $('#best').onclick=()=>{haptic('medium');play('best','mode','words');};
  if($('#lesson'))$('#lesson').onclick=()=>{haptic('medium');startLesson();};
  if($('#review'))$('#review').onclick=()=>{haptic('medium');startSession('review');};
  $('#wDota').onclick=()=>{sfx('tap');renderDotaWorld();};
  $('#wCS').onclick=()=>{sfx('tap');renderCSWorld();};
  $$('[data-sc]').forEach(b=>b.onclick=()=>{haptic('medium');renderScene(b.dataset.sc);});
  $('#wod').onclick=showWod;
  if(!$('#redo').disabled)$('#redo').onclick=()=>{haptic('medium');startSession('mistakes');};
}
/* ---- мир Доты: прежний экран обучения в дотерском стиле ---- */
function renderDotaWorld(){
  scStop();CURW='dota';setWorld('dota');screen='dota';backBtn(true);
  const t=totals(),h=heroFor(),lp=modeProgress('lore');
  const modes=MODES.filter(m=>!m.tier).map(m=>{const p=modeProgress(m.id),pct=p.total?Math.round(p.learned/p.total*100):0;
    return `<button class="mcard card anim" data-m="${m.id}">${iconHTML({img:INV_ICONS[m.id],svg:m.icon.svg})}<b>${m.name}</b><small>${p.total&&p.learned>=p.total?'выучено всё':`${p.learned} из ${p.total}`}</small><span class="mbar"><i style="--w:${pct}%"></i></span></button>`;}).join('');
  mount(`<div class="page-head"><button class="icon-btn" id="bBtn" aria-label="Назад">${ui('back')}</button><h1 class="title">Dota 2</h1></div>
    <section class="play card anim"><div class="pic" style="background-image:url('${portrait(h.hero)}')"></div>
      <div class="pinfo"><span class="ptag">${store.roles==='all'?'Все роли':store.roles.map(r=>cap(ROLE_NAME[r])).join(', ')} ${store.langs.map(langBadge).join('')}</span>
      <h2>Быстрая игра</h2><p>10 вопросов из всех режимов, в конце Рошан</p><button class="btn" id="quick">Играть</button></div></section>
    <button class="lesson card anim" id="lesson"><span class="lsn-steps"><i>1</i><i>2</i><i>3</i></span><span><b>Урок: 5 новых слов</b><small>Карточка слова → узнай → вспомни сам → напиши. Так слова реально запоминаются.</small></span><span class="go">›</span></button>
    <h2 class="sec2 anim">Режимы <span>выучено ${t.learned}</span></h2>
    <div class="mgrid">${modes}</div>
    <button class="rowcard card anim" id="wiki">${iconHTML({svg:'book'})}<span><b>Словарь</b><small>Все слова Доты: перевод, как запомнить, примеры</small></span><span class="go">›</span></button>
    <button class="rowcard card anim ultra" id="lore">${iconHTML({img:'items/ultimate_scepter',svg:'scroll'})}<span><b>Лор Доты</b><small>Хай тир: настоящие тексты из игры${LORE_STATE==='ok'?`, ${lp.learned} из ${lp.total}`:''}</small></span><span class="go">›</span></button>`,'dotascr');
  $('#bBtn').onclick=()=>{sfx('tap');renderHome();};
  $('#quick').onclick=()=>{haptic('medium');play('dota','quick');};
  $('#lesson').onclick=()=>{haptic('medium');startLesson();};
  applyFlagsUI();
  $('#wiki').onclick=()=>{sfx('tap');renderWiki();};
  $('#lore').onclick=()=>{haptic('medium');if(LORE_STATE==='fail'){LORE_STATE='idle';loadLore();}play('dota','mode','lore');};
  $$('.mcard').forEach(b=>b.onclick=()=>{haptic('medium');play('dota','mode',b.dataset.m);});
}
/* ---- мир CS 2 ---- */
function renderCSWorld(){
  scStop();CURW='cs2';setWorld('cs2');screen='cs';backBtn(true);
  const L=store.langs[0],p=cs2Progress();
  mount(`<div class="page-head"><button class="icon-btn" id="bBtn" aria-label="Назад">${ui('back')}</button><h1 class="title">CS 2</h1></div>
    <section class="cshero anim"><span class="csgrid"></span><em>Counter-Strike 2</em><b>Слова из каждого раунда</b><small>Defuse, clutch, rotate, eco — что они значат и как их сказать вне игры.</small>
      <span class="csbar"><i style="width:${Math.round(p.learned/p.total*100)}%"></i></span><small>выучено ${p.learned} из ${p.total}</small>
      <button class="btn" id="csPlay">Играть · 10 вопросов</button></section>
    <h2 class="sec2 anim">Все слова <span>${p.total}</span></h2>
    <div class="cslist card anim">${CS2_WORDS.map(w=>{const m=mget(mkey('words',w.id,L));return `<div class="csrow"><span class="csw"><b>${esc(w[L])}</b><small>${esc(w.ru)}</small></span>${pipsHTML(Math.min(3,m))}</div>`;}).join('')}</div>`,'csscr');
  $('#bBtn').onclick=()=>{sfx('tap');renderHome();};
  $('#csPlay').onclick=()=>{haptic('medium');play('cs2','mode','words');};
}
/* ---- карточка нового слова перед первым вопросом (для тех, кто только начинает) ---- */
function introCard(q){
  const c=cardOf(q.mode,q.cid);if(!c)return null;
  const L=q.lang,w=baseForm(q.mode,c,L),ru=ruOf(q.mode,c),t=tipOf(q.mode,q.cid);
  if(!w||!ru)return null;
  return {w,ru,mem:memOf(q.mode,q.cid,L,t),ex:t&&t.length>=4?(L==='de'?t[2]:t[1]):'',exru:t?(t.length===5?(L==='de'?t[4]:t[3]):t[3]):''};
}
function renderIntro(q){
  const ic=introCard(q);if(!ic){renderQ();return;}
  screen='quiz';
  mount(`<div class="intro-top"><button class="icon-btn" id="qx" aria-label="Выйти">${ui('close')}</button><span class="meta">Новое слово</span></div>
    <section class="intro card anim"><span class="ichip">${q.chip||''}</span>
      <h1>${esc(ic.w)}</h1><p class="iru">${esc(ic.ru)}</p>
      ${ic.mem?`<div class="imem"><b>Как запомнить</b><span>${esc(ic.mem)}</span></div>`:''}
      ${ic.ex?`<div class="iex"><b>Пример</b><span>${esc(ic.ex)}</span><small>${esc(ic.exru)}</small></div>`:''}
      <button class="speak" id="isp" aria-label="Послушать">${ui('sound')}</button>
    </section>
    <div class="cta"><button class="btn" id="ign">Понятно, проверь меня →</button></div>
    <p class="foot">Новые слова сначала показываются, потом проверяются. Выключить можно в настройках.</p>`,'quizscr');
  $('#qx').onclick=exitQuiz;$('#ign').onclick=()=>{haptic('sel');renderQ();};
  $('#isp').onclick=()=>speak(ic.w,q.lang);
  if(store.autoSpeak!==false)setTimeout(()=>speak(ic.w,q.lang),300);
}
/* ---- словарь Доты: все слова по разделам, с поиском ---- */
let WIKI={mode:'terms',q:''};
function wikiRows(mode,L){
  const list=mode==='items'?ITEMS:mode==='skills'?SKILLS:mode==='heroes'?HEROES:mode==='words'?WORDS.filter(w=>!w.g):mode==='phrases'?PHRASES:TERMS;
  return list.map(c=>{const cid=cidOf(mode,c);const w=baseForm(mode,c,L),ru=ruOf(mode,c);return w&&ru?{cid,w,ru,c,m:mget(mkey(mode,cid,L))}:null;}).filter(Boolean);
}
function renderWiki(){
  scStop();CURW='dota';setWorld('dota');screen='wiki';backBtn(true);
  const L=store.langs[0],tabs=MODES.filter(m=>!m.tier&&m.id!=='lore');
  const q=WIKI.q.trim().toLowerCase();
  const rows=wikiRows(WIKI.mode,L).filter(r=>!q||r.w.toLowerCase().includes(q)||r.ru.toLowerCase().includes(q));
  mount(`<div class="page-head"><button class="icon-btn" id="bBtn" aria-label="Назад">${ui('back')}</button><h1 class="title">Словарь</h1></div>
    <input class="wsearch" id="wq" placeholder="Найти слово или перевод" value="${esc(WIKI.q)}">
    <div class="wtabs">${tabs.map(m=>`<button data-wm="${m.id}" class="${m.id===WIKI.mode?'on':''}">${m.name}</button>`).join('')}</div>
    <div class="wlist card">${rows.length?rows.map(r=>`<details class="wrow"><summary><span><b>${esc(r.w)}</b><small>${esc(r.ru)}</small></span>${pipsHTML(Math.min(3,r.m))}</summary>${wikiBody(WIKI.mode,r,L)}</details>`).join(''):'<p class="foot">Ничего не нашлось</p>'}</div>`,'wikiscr');
  $('#bBtn').onclick=()=>{sfx('tap');renderDotaWorld();};
  $$('[data-wm]').forEach(b=>b.onclick=()=>{WIKI.mode=b.dataset.wm;WIKI.q='';sfx('sel');renderWiki();});
  const inp=$('#wq');inp.oninput=()=>{WIKI.q=inp.value;clearTimeout(inp._t);inp._t=setTimeout(()=>{const p=inp.selectionStart;renderWiki();const n=$('#wq');n.focus();n.setSelectionRange(p,p);},250);};
  $$('.wrow .speak').forEach(b=>b.onclick=e=>{e.preventDefault();speak(b.dataset.w,L);});
}
function wikiBody(mode,r,L){
  const t=tipOf(mode,r.cid);let h='';
  if(t){if(mode==='phrases')h+=`<p class="wwhen"><b>Когда говорят:</b> ${esc(t[0])}</p>`;
    else h+=`<p><b>Как запомнить:</b> ${esc(memOf(mode,r.cid,L,t))}</p>`+(t.length>=4?`<p class="wex"><i>${esc(L==='de'?t[2]:t[1])}</i> — ${esc(t.length===5?(L==='de'?t[4]:t[3]):t[3])}</p>`:'');}
  if(r.c.hint)h+=`<p class="wh">${esc(r.c.hint)}</p>`;
  return `<div class="wb">${h}<button class="speak" data-w="${esc(r.w)}" aria-label="Послушать">${ui('sound')}</button></div>`;
}

/* ---- вкладка «Игры» ---- */
function gamesTabHTML(){
  const st=store.cg||{games:0,wins:0};
  const I=p=>`<svg viewBox="0 0 24 24">${p}</svg>`;
  return `<h1 class="title anim">Игры</h1>
    <p class="lead anim" style="margin:4px 0 14px">Играй сам или с друзьями — и по ходу учи слова.</p>
    <button class="gcard anim" id="gCards"><span class="gc-shine"></span>
      <span class="hg-ico cardsico"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="11" height="15" rx="2" transform="rotate(-10 8.5 12.5)"/><rect x="10" y="4" width="11" height="15" rx="2" transform="rotate(8 15.5 11.5)"/></svg></span>
      <span class="gc-t"><em>Новое · карточная игра</em><b>Карточная дуэль</b><small>Бейтман против Дёрдена. Колоды, мана, существа. Переводи слова с карт — они становятся сильнее.</small></span>
      <span class="gc-go">Играть →</span></button>
    <div class="ggrid">
      <button class="gtile anim" id="gSpy"><span class="gi">${I('<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>')}</span><b>Шпион</b><small>Компанией: один не знает, что загадано</small></button>
      <button class="gtile anim" id="gArena"><span class="gi">${I('<path d="M14.5 17.5 3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M9.5 6.5 14 2h3v3l-4.5 4.5M5 14l4 4M7 17l-3 3"/>')}</span><b>Дуэль и турнир</b><small>1 на 1 по ссылке и турнир недели с призом</small></button>
    </div>
    ${st.games?`<p class="foot anim">Карточная дуэль: сыграно ${st.games}, побед ${st.wins}</p>`:''}`;
}
function bindGames(){
  $('#gCards').onclick=()=>{haptic('medium');sfx('whoosh');cgPick();};
  $('#gSpy').onclick=()=>{sfx('tap');renderTab('spy');};
  $('#gArena').onclick=()=>{sfx('tap');renderTab('arena');};
}

/* ---- урок: 5 новых слов — карточка, узнать, вспомнить, написать ---- */
function lessonMode(){
  const ms=['words','terms','heroes','items'].map(m=>{const p=modeProgress(m);return {m,left:p.total-p.learned};}).filter(x=>x.left>0);
  if(!ms.length)return 'words';
  ms.sort((a,b)=>b.left-a.left);return ms[(store.lessonN||0)%Math.min(2,ms.length)].m;
}
function startLesson(){
  CURW='dota';setWorld('dota');
  const L=store.langs[0],mode=lessonMode(),used=new Set();
  const pool=basePool(mode,L).filter(c=>!c.parts);
  const cards=[];for(let i=0;i<5&&pool.length;i++){const c=pickCard(mode,L,pool,used);if(!c)break;used.add(mode+':'+cidOf(mode,c));cards.push(c);}
  if(cards.length<3){toast('Здесь почти всё выучено — попробуй «Быструю игру»');return;}
  const ks=c=>kindsOf(mode,L,c);
  const recog=c=>{const k=ks(c);return k.find(x=>/x2ru|mean|de2ru/.test(x))||k[0];};
  const recall=c=>{const k=ks(c),r=recog(c);return k.find(x=>x!==r&&/ru2|name|^h_de$|word|wde/.test(x))||k.find(x=>x!==r)||k[0];};
  const safe=(c,k)=>{try{return buildAny(mode,c,L,k);}catch(e){return null;}};
  const qs=[...cards.map(c=>safe(c,recog(c))),...shuffle(cards).map(c=>safe(c,recall(c)))].filter(Boolean);
  shuffle(cards).slice(0,3).forEach(c=>{const q=safe(c,'type');if(q)qs.push(q);});
  qs.forEach(q=>{q.chip=(q.chip||'')+' <span class="lchip">Урок</span>';});
  qs[qs.length-1].roshan=true;
  store.lessonN=(store.lessonN||0)+1;save();
  S={type:'mode',mode,lesson:true,qs,i:0,correct:0,streak:0,bestStreak:0,gold:0,first:false,answered:false,wrong:[],learned:[],tInt:null,reask:0};
  screen='quiz';sfx('whoosh');renderQ();
}
/* ================= карточная дуэль: Бейтман против Дёрдена (прототип) ================= */
// Колода, мана до 10, стол до 5 существ, заклинания с целями, соперник-компьютер.
// Учебная фишка: при розыгрыше карты переводишь слово с неё; верно — карта сильнее.
const CG_ICONS={
  card:'<rect x="4" y="7" width="16" height="10" rx="1.5"/><path d="M7 11h6M7 14h4"/>',
  book:'<path d="M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2z"/><path d="M5 17a2 2 0 0 1 2-2h11"/>',
  mirror:'<ellipse cx="12" cy="9.5" rx="5" ry="6.5"/><path d="M12 16v5M9 21h6"/>',
  phone:'<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>',
  chart:'<path d="M4 20h16"/><path d="M6 16l4-5 3 3 5-7"/><path d="M15 7h3v3"/>',
  case:'<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M9 8V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18"/>',
  tie:'<path d="M10 3h4l-1 3 2 11-3 4-3-4 2-11z"/>',
  crown:'<path d="M4 17l2-9 4 4 2-6 2 6 4-4 2 9z"/><path d="M4 20h16"/>',
  suit:'<path d="M8 3l4 4 4-4 4 3-2 5v10H6V11L4 6z"/><path d="M12 7v14"/>',
  handshake:'<path d="M3 11l4-4 4 2 2-1 4 3 4 0"/><path d="M7 7l-2 6 5 5 3-2 3 2 3-4"/>',
  soap:'<rect x="4" y="8" width="16" height="10" rx="4"/><circle cx="17" cy="5" r="1.5"/><circle cx="20" cy="7" r="1"/>',
  fist:'<path d="M7 11V7a1.5 1.5 0 0 1 3 0v3M10 10V6a1.5 1.5 0 0 1 3 0v4M13 10V7a1.5 1.5 0 0 1 3 0v4M16 11V9a1.5 1.5 0 0 1 3 0v4a7 7 0 0 1-7 7h-1a6 6 0 0 1-6-6v-2a2 2 0 0 1 2-2h3"/>',
  rule:'<path d="M6 3h9l3 3v15H6z"/><path d="M9 9h6M9 12h6M9 15h4"/>',
  boot:'<path d="M8 3h5v8l6 3v4H5v-3l3-2z"/><path d="M5 18h14"/>',
  bulb:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5V16h8v-2.5A6 6 0 0 0 12 3z"/>',
  moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5z"/>',
  wrench:'<path d="M14.5 6.5a4 4 0 0 0-5.3 5L4 16.7 7.3 20l5.2-5.2a4 4 0 0 0 5-5.3l-2.4 2.4-2.6-.6-.6-2.6z"/>',
  swirl:'<path d="M12 12a2 2 0 1 1 2-2 4 4 0 1 1-4-4 6 6 0 1 1-6 6 8 8 0 0 1 8-8"/>',
  megaphone:'<path d="M3 10v4h3l7 4V6L6 10z"/><path d="M17 9a4 4 0 0 1 0 6"/>',
  house:'<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-6h4v6"/>',
  axe:'<path d="M14 4l6 6-3 3-6-6z"/><path d="M11 7L4 20"/><path d="M17 13c1 2 1 4-1 6"/>'
};
// cost, тип m — существо, s — заклинание; kw: taunt — провокация, charge — рывок
const CG_CARDS={
  // ---- Бейтман ----
  b_card:{side:'bateman',name:'Визитка',en:'business card',de:'die Visitenkarte',ru:'визитка',ico:'card',cost:1,type:'s',fx:{k:'dmg',n:2,t:'any'},text:'2 урона любой цели'},
  b_res:{side:'bateman',name:'Бронь',en:'reservation',de:'die Reservierung',ru:'бронь',ico:'book',cost:2,type:'s',fx:{k:'draw',n:2},text:'Возьми 2 карты'},
  b_mirror:{side:'bateman',name:'Зеркало',en:'mirror',de:'der Spiegel',ru:'зеркало',ico:'mirror',cost:1,type:'s',fx:{k:'buff',a:1,h:2,t:'ally'},text:'Своему существу +1/+2'},
  b_secr:{side:'bateman',name:'Секретарша',en:'secretary',de:'die Sekretärin',ru:'секретарша',ico:'phone',cost:2,type:'m',atk:2,hp:4,kw:['taunt'],text:'Провокация'},
  b_analyst:{side:'bateman',name:'Аналитик',en:'analyst',de:'der Analyst',ru:'аналитик',ico:'chart',cost:3,type:'m',atk:2,hp:4,bc:{k:'draw',n:1},text:'При розыгрыше: возьми карту'},
  b_broker:{side:'bateman',name:'Брокер',en:'broker',de:'der Makler',ru:'брокер',ico:'case',cost:3,type:'m',atk:3,hp:3,text:''},
  b_rival:{side:'bateman',name:'Соперник',en:'rival',de:'der Rivale',ru:'соперник',ico:'tie',cost:4,type:'m',atk:4,hp:5,text:''},
  b_suit:{side:'bateman',name:'Костюм',en:'suit',de:'der Anzug',ru:'костюм',ico:'suit',cost:2,type:'s',fx:{k:'buff',a:2,h:2,t:'ally'},text:'Своему существу +2/+2'},
  b_deal:{side:'bateman',name:'Сделка',en:'deal',de:'das Geschäft',ru:'сделка',ico:'handshake',cost:4,type:'s',fx:{k:'aoe',n:2,t:'enemies'},text:'2 урона всем вражеским существам'},
  b_patrick:{side:'bateman',name:'Патрик Бейтман',en:'businessman',de:'der Geschäftsmann',ru:'бизнесмен',ico:'case',cost:5,type:'m',atk:4,hp:5,legend:true,evo:{need:2,into:'b_axe'},text:'Легендарная. После 2 убийств — эволюция'},
  b_axe:{side:'bateman',name:'Бейтман с топором',en:'axe',de:'die Axt',ru:'топор',ico:'axe',cost:5,type:'m',atk:6,hp:7,legend:true,token:true,onEvo:'discover',text:'Раскопка: 3 верхние карты врага — 1 себе, 2 уничтожить'},
  b_vp:{side:'bateman',name:'Вице-президент',en:'vice president',de:'der Vizepräsident',ru:'вице-президент',ico:'crown',cost:6,type:'m',atk:4,hp:6,kw:['taunt'],text:'Провокация'},
  // ---- Дёрден ----
  d_soap:{side:'durden',name:'Мыло',en:'soap',de:'die Seife',ru:'мыло',ico:'soap',cost:1,type:'s',fx:{k:'heal',n:4,t:'friend'},text:'Вылечи 4 здоровья'},
  d_punch:{side:'durden',name:'Удар',en:'punch',de:'der Schlag',ru:'удар',ico:'fist',cost:1,type:'s',fx:{k:'dmg',n:2,t:'any'},text:'2 урона любой цели'},
  d_rule:{side:'durden',name:'Правило',en:'rule',de:'die Regel',ru:'правило',ico:'rule',cost:2,type:'s',fx:{k:'team',a:1},text:'Всем своим существам +1 к атаке'},
  d_recruit:{side:'durden',name:'Новобранец',en:'recruit',de:'der Rekrut',ru:'новобранец',ico:'boot',cost:1,type:'m',atk:1,hp:2,kw:['charge'],text:'Рывок'},
  d_fighter:{side:'durden',name:'Боец',en:'fighter',de:'der Kämpfer',ru:'боец',ico:'fist',cost:2,type:'m',atk:3,hp:2,text:''},
  d_base:{side:'durden',name:'Подвал',en:'basement',de:'der Keller',ru:'подвал',ico:'bulb',cost:3,type:'s',fx:{k:'summon',n:2,tok:'d_tok'},text:'Призови двух бойцов 2/1'},
  d_insom:{side:'durden',name:'Бессонница',en:'insomnia',de:'die Schlaflosigkeit',ru:'бессонница',ico:'moon',cost:2,type:'s',fx:{k:'draw',n:2,self:2},text:'Возьми 2 карты, твой герой получает 2 урона'},
  d_mech:{side:'durden',name:'Механик',en:'mechanic',de:'der Mechaniker',ru:'механик',ico:'wrench',cost:3,type:'m',atk:3,hp:5,text:''},
  d_mayhem:{side:'durden',name:'Хаос',en:'mayhem',de:'das Chaos',ru:'хаос',ico:'swirl',cost:4,type:'s',fx:{k:'aoe',n:2,t:'enemies',face:2},text:'2 урона всем вражеским существам и герою'},
  d_leader:{side:'durden',name:'Лидер',en:'leader',de:'der Anführer',ru:'лидер',ico:'megaphone',cost:6,type:'m',atk:6,hp:5,kw:['charge'],text:'Рывок'},
  d_tyler:{side:'durden',name:'Тайлер Дёрден',en:'rebel',de:'der Rebell',ru:'бунтарь',ico:'soap',cost:5,type:'m',atk:5,hp:4,legend:true,kw:['charge'],evo:{need:2,into:'d_anarchy'},text:'Легендарная. Рывок. После 2 убийств — эволюция'},
  d_anarchy:{side:'durden',name:'Дёрден без правил',en:'anarchy',de:'die Anarchie',ru:'анархия',ico:'swirl',cost:5,type:'m',atk:7,hp:6,legend:true,token:true,onEvo:'rally',text:'Клуб в бой: твоим существам +1/+1, могут атаковать сразу'},
  d_tok:{side:'durden',name:'Боец клуба',en:'member',de:'das Mitglied',ru:'участник',ico:'house',cost:1,type:'m',atk:2,hp:1,token:true,text:''}
};
const CG_HEROES={
  bateman:{name:'Патрик Бейтман',short:'Бейтман',sub:'Уолл-стрит',mono:'PB',power:{name:'Уход за собой',text:'Вылечи своему герою 3 здоровья',k:'selfheal',n:3}},
  durden:{name:'Тайлер Дёрден',short:'Дёрден',sub:'Бумажная улица',mono:'TD',power:{name:'Удар с правой',text:'1 урон любой цели',k:'dmg',n:1}}
};
const CG_DECKS={bateman:['b_card','b_res','b_mirror','b_secr','b_analyst','b_broker','b_rival','b_suit','b_deal','b_vp'],durden:['d_soap','d_punch','d_rule','d_recruit','d_fighter','d_base','d_insom','d_mech','d_mayhem','d_leader']};
const CG_LEGENDS={bateman:['b_patrick'],durden:['d_tyler']};
// реплики Бейтмана из сцены (лежат в репозитории scenes рядом с видео)
const CG_VOICE={b_patrick:{play:['1'],attack:['2','3']},b_axe:{play:['4'],attack:['2','3']}};
function cgVoice(id,ev){
  const v=CG_VOICE[id];if(!v||!v[ev]||!store.snd)return;
  try{const a=new Audio(assetUrl('scenes/american-psycho/vo/'+rnd(v[ev])+'.mp3'));a.volume=.9;const p=a.play();if(p&&p.catch)p.catch(()=>{});}catch(e){}
}
let CG=null,CG_UID=1;
const cgSleep=ms=>new Promise(r=>setTimeout(r,window.CG_FAST?0:ms));
const cgWord=c=>store.langs[0]==='de'?c.de:c.en;
function cgNewSide(hero){
  const deck=shuffle([...CG_DECKS[hero].flatMap(id=>[id,id]),...(CG_LEGENDS[hero]||[])]);
  return {hero,hp:30,max:30,mana:0,maxMana:0,deck,hand:[],board:[],powerUsed:false,fatigue:0};
}
function cgStart(hero){
  CG_UID=1;const foe=hero==='bateman'?'durden':'bateman';
  CG={me:cgNewSide(hero),ai:cgNewSide(foe),turn:'me',over:null,sel:null,target:null,busy:false,words:store.cgWords!==false,learned:[],turnNo:0,fx:[]};
  for(let i=0;i<3;i++){cgDraw(CG.me,true);cgDraw(CG.ai,true);}cgDraw(CG.ai,true);
  screen='cards';backBtn(true);scStop();document.body.dataset.world='cards';
  cgRender();cgBanner(`Ты играешь за ${CG_HEROES[hero].short}`,()=>cgTurnStart('me'));
}
function cgDraw(side,quiet){
  if(!side.deck.length){side.fatigue++;cgHit(side,null,side.fatigue);cgToast(`${side===CG.me?'Колода кончилась':'У соперника кончилась колода'}: ${side.fatigue} урона`);return;}
  const id=side.deck.pop();
  if(side.hand.length>=9){cgToast('Рука полная, карта сгорела');return;}
  side.hand.push({uid:CG_UID++,id,fresh:!quiet});
}
function cgTurnStart(who){
  if(CG.over)return;
  CG.turn=who;const s=CG[who];CG.turnNo++;
  s.maxMana=Math.min(10,s.maxMana+1);s.mana=s.maxMana;s.powerUsed=false;
  s.board.forEach(m=>{m.ready=true;m.sick=false;});
  cgDraw(s);cgCheck();cgRender();
  if(who==='ai'&&!CG.over){if(CGO)cgBanner('Ход соперника');else cgBanner('Ход соперника',()=>cgAiTurn());}
  else if(!CG.over)cgBanner('Твой ход');
}
function cgEnemy(side){return side===CG.me?CG.ai:CG.me;}
function cgSideOf(uid){if(uid==='me'||uid==='ai')return CG[uid];return CG.me.board.some(m=>m.uid===uid)?CG.me:CG.ai;}
function cgMinion(uid){return CG.me.board.find(m=>m.uid===uid)||CG.ai.board.find(m=>m.uid===uid);}
// урон и лечение: цель — существо (uid) или герой ('me'/'ai')
function cgHit(side,uid,n){
  if(n<=0)return;
  if(uid==null||uid==='me'||uid==='ai'){side=uid?CG[uid]:side;side.hp-=n;CG.fx.push({t:side===CG.me?'me':'ai',v:-n});}
  else{const m=cgMinion(uid);if(!m)return;m.hp-=n;CG.fx.push({t:uid,v:-n});}
}
function cgHeal(uid,n){
  if(uid==='me'||uid==='ai'){const s=CG[uid],was=s.hp;s.hp=Math.min(s.max,s.hp+n);if(s.hp>was)CG.fx.push({t:uid,v:s.hp-was});return;}
  const m=cgMinion(uid);if(!m)return;const was=m.hp;m.hp=Math.min(m.maxHp,m.hp+n);if(m.hp>was)CG.fx.push({t:uid,v:m.hp-was});
}
function cgCleanup(){
  const dead=[];[CG.me,CG.ai].forEach(s=>{s.board.forEach(m=>{if(m.hp<=0)dead.push(m.uid);});});
  return dead;
}
async function cgRemoveDead(){
  const dead=cgCleanup();if(!dead.length)return;
  dead.forEach(u=>{const el=document.querySelector(`[data-u="${u}"]`);if(el)el.classList.add('die');});
  sfx('bad');await cgSleep(420);
  [CG.me,CG.ai].forEach(s=>{s.board=s.board.filter(m=>m.hp>0);});
}
function cgCheck(){
  if(CG.over)return true;
  const a=CG.me.hp<=0,b=CG.ai.hp<=0;
  if(a||b){CG.over=a&&b?'draw':a?'lose':'win';setTimeout(cgEnd,700);return true;}
  return false;
}
function cgNeedsTarget(c){
  if(c.type!=='s'||!c.fx)return null;
  if(['dmg','heal','buff'].includes(c.fx.k))return c.fx.t;
  return null;
}
function cgValidTarget(kind,uid,side){
  const enemy=cgEnemy(side);
  if(kind==='any')return true;
  if(kind==='ally')return side.board.some(m=>m.uid===uid);
  if(kind==='friend')return uid===(side===CG.me?'me':'ai')||side.board.some(m=>m.uid===uid);
  if(kind==='enemy')return uid===(enemy===CG.me?'me':'ai')||enemy.board.some(m=>m.uid===uid);
  return false;
}
// розыгрыш карты: сначала цель (если нужна), потом слово, потом эффект
async function cgPlay(side,handUid,target,bonus){
  const i=side.hand.findIndex(h=>h.uid===handUid);if(i<0)return false;
  const h=side.hand[i],c=CG_CARDS[h.id];if(c.cost>side.mana)return false;
  if(c.type==='m'&&side.board.length>=5){if(side===CG.me)cgToast('На столе максимум 5 существ');return false;}
  side.mana-=c.cost;side.hand.splice(i,1);if(CGO&&side===CG.me)cgLog(`Соперник сыграл «${c.name}»`);
  const plus=bonus?1:0;
  if(side===CG.me)CG.lastPlayed=h.uid;
  if(c.type==='m'){
    const m={uid:CG_UID++,id:h.id,atk:c.atk+plus,hp:c.hp+plus,maxHp:c.hp+plus,taunt:(c.kw||[]).includes('taunt'),charge:(c.kw||[]).includes('charge'),ready:(c.kw||[]).includes('charge'),sick:!(c.kw||[]).includes('charge'),fresh:true,bonus:!!bonus};
    if(c.legend){m.legend=true;m.kills=0;}
    side.board.push(m);sfx('sel');if(c.legend){cgVoice(h.id,'play');CG.legendIn=m.uid;}
    if(c.bc&&c.bc.k==='draw')for(let k=0;k<c.bc.n;k++)cgDraw(side);
  }else{
    const f=c.fx,n=(f.n||0)+(['dmg','heal','aoe'].includes(f.k)?plus:0);sfx('whoosh');
    if(f.k==='dmg')cgHit(side,target,n);
    if(f.k==='heal')cgHeal(target,n);
    if(f.k==='buff'){const m=cgMinion(target);if(m){m.atk+=f.a+plus;m.hp+=f.h;m.maxHp+=f.h;CG.fx.push({t:target,v:'+'+(f.a+plus)+'/+'+f.h,buff:true});}}
    if(f.k==='draw'){for(let k=0;k<f.n+(bonus&&f.n<3?0:0);k++)cgDraw(side);if(f.self)cgHit(side,side===CG.me?'me':'ai',Math.max(0,f.self-plus));}
    if(f.k==='aoe'){const tg=f.t==='all'?[...CG.me.board,...CG.ai.board]:cgEnemy(side).board;tg.forEach(m=>cgHit(side,m.uid,n));if(f.face)cgHit(side,side===CG.me?'ai':'me',f.face+plus);}
    if(f.k==='team'){side.board.forEach(m=>{m.atk+=f.a+plus;CG.fx.push({t:m.uid,v:'+'+(f.a+plus),buff:true});});}
    if(f.k==='summon'){for(let k=0;k<f.n&&side.board.length<5;k++){const t=CG_CARDS[f.tok];side.board.push({uid:CG_UID++,id:f.tok,atk:t.atk+plus,hp:t.hp,maxHp:t.hp,taunt:false,charge:false,ready:false,sick:true,fresh:true});}}
  }
  cgRender();await cgSleep(350);await cgRemoveDead();cgCheck();cgRender();return true;
}
async function cgPower(side,target){
  const p=CG_HEROES[side.hero].power;if(side.powerUsed||side.mana<2)return false;
  side.mana-=2;side.powerUsed=true;sfx('sel');
  if(p.k==='selfheal')cgHeal(side===CG.me?'me':'ai',p.n);
  if(p.k==='dmg')cgHit(side,target,p.n);
  cgRender();await cgSleep(300);await cgRemoveDead();cgCheck();cgRender();return true;
}
function cgCanAttack(side,m){return m.ready&&!m.sick&&m.atk>0;}
function cgTauntOK(side,target){const en=cgEnemy(side),t=en.board.filter(m=>m.taunt);if(!t.length)return true;return t.some(m=>m.uid===target);}
async function cgAttack(side,uid,target){
  const m=side.board.find(x=>x.uid===uid);if(!m||!cgCanAttack(side,m))return false;
  if(!cgTauntOK(side,target)){if(side===CG.me)cgToast('Сначала существо с провокацией');return false;}
  if(CGO&&side===CG.me){const tn=typeof target==='number'?(CG_CARDS[(cgMinion(target)||{}).id]||{}).name:'твоего героя';cgLog(`«${CG_CARDS[m.id].name}» атакует ${typeof target==='number'?'«'+tn+'»':tn}`);}
  await cgLunge(uid,target);
  if(target==='me'||target==='ai'){cgHit(side,target,m.atk);}
  else{const t=cgMinion(target);if(!t)return false;cgHit(side,target,m.atk);cgHit(side,uid,t.atk);}
  m.ready=false;sfx('good');cgVoice(m.id,'attack');
  const killed=typeof target==='number'&&(cgMinion(target)||{hp:1}).hp<=0;
  cgRender();await cgSleep(300);await cgRemoveDead();
  const me2=side.board.find(x=>x.uid===uid);
  if(me2&&killed&&CG_CARDS[me2.id].evo){me2.kills=(me2.kills||0)+1;if(me2.kills>=CG_CARDS[me2.id].evo.need)await cgEvolve(side,me2);else{CG.fx.push({t:uid,v:'убийство '+me2.kills+'/'+CG_CARDS[me2.id].evo.need,buff:true});}}
  cgCheck();cgRender();return true;
}
// эволюция: вспышка, новая карта, раскопка колоды соперника
async function cgEvolve(side,m){
  const into=CG_CARDS[m.id].evo.into,c=CG_CARDS[into];
  const el=document.querySelector(`[data-u="${m.uid}"]`);if(el)el.classList.add('evolving');
  cgBanner('Эволюция!');haptic('heavy');await cgSleep(900);
  m.id=into;m.atk=c.atk;m.hp=c.hp;m.maxHp=c.hp;m.kills=0;m.evolved=true;CG.evolvedIn=m.uid;cgVoice(into,'play');
  cgRender();await cgSleep(700);
  if(c.onEvo==='rally'){
    side.board.forEach(x=>{if(x.uid===m.uid)return;x.atk+=1;x.hp+=1;x.maxHp+=1;x.ready=true;x.sick=false;CG.fx.push({t:x.uid,v:'+1/+1',buff:true});});
    cgBanner('Клуб в бой!');sfx('win');cgRender();await cgSleep(600);
  }else await cgDiscover(side);
}
async function cgDiscover(side){
  const en=cgEnemy(side);const top=en.deck.splice(-3).reverse();
  if(!top.length){cgToast('Колода соперника пуста');return;}
  let pick=0;
  if(side===CG.me){pick=await new Promise(res=>{
    const w=document.createElement('div');w.className='cg-disc';
    w.innerHTML=`<div class="cg-dbox"><small>Раскопка: верхние карты соперника</small><b>Возьми одну. Остальные сгорят.</b>
      <div class="cg-dcards">${top.map((id,i)=>`<button class="cg-dpick" data-i="${i}" style="--d:${i*120}ms">${cgCardHTML({uid:-1-i,id},false)}</button>`).join('')}</div></div>`;
    document.querySelector('.cg').appendChild(w);
    w.querySelectorAll('.cg-dpick').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;w.querySelectorAll('.cg-dpick').forEach((x,j)=>x.classList.add(j===i?'take':'burn'));sfx('good');setTimeout(()=>{w.remove();res(i);},900);});
  });}
  else{pick=top.reduce((b,id,i)=>CG_CARDS[id].cost>CG_CARDS[top[b]].cost?i:b,0);
    const w=document.createElement('div');w.className='cg-disc';
    w.innerHTML=`<div class="cg-dbox"><small>Соперник раскопал твою колоду</small><b>Одну карту забрал, две сжёг</b><div class="cg-dcards">${top.map((id,i)=>`<div class="cg-dpick ${i===pick?'take':'burn'}" style="--d:${i*120}ms">${cgCardHTML({uid:-1-i,id},false)}</div>`).join('')}</div></div>`;
    const root=document.querySelector('.cg');if(root){root.appendChild(w);await cgSleep(1600);w.remove();}}
  if(side.hand.length<9)side.hand.push({uid:CG_UID++,id:top[pick],fresh:true});
  cgRender();
}
/* ---- соперник-компьютер ---- */
async function cgAiTurn(){
  const s=CG.ai,e=CG.me;CG.busy=true;cgRender();
  await cgSleep(500);
  // карты: сначала дорогие, пока хватает маны
  for(let loop=0;loop<10&&!CG.over;loop++){
    const playable=s.hand.map(h=>({h,c:CG_CARDS[h.id]})).filter(x=>x.c.cost<=s.mana&&!(x.c.type==='m'&&s.board.length>=5)).sort((a,b)=>b.c.cost-a.c.cost);
    let done=false;
    for(const {h,c} of playable){
      const need=cgNeedsTarget(c);let tg=null;
      if(c.type==='s'){
        const f=c.fx;
        if(f.k==='dmg'){const kill=e.board.filter(m=>m.hp<=f.n).sort((a,b)=>b.atk-a.atk)[0];tg=kill?kill.uid:'me';}
        if(f.k==='heal'){if(s.hp<=s.max-3)tg='ai';else{const hurt=s.board.find(m=>m.hp<m.maxHp);if(!hurt)continue;tg=hurt.uid;}}
        if(f.k==='buff'){const best=[...s.board].sort((a,b)=>b.atk+b.hp-a.atk-a.hp)[0];if(!best)continue;tg=best.uid;}
        if(f.k==='aoe'&&(f.t==='all'?e.board.length<=s.board.length:e.board.length<2))continue;
        if(f.k==='team'&&s.board.length<2)continue;
        if(f.k==='draw'&&f.self&&s.hp<=6)continue;
      }
      await cgAiShow(h.uid,c);
      if(await cgPlay(s,h.uid,tg,Math.random()<.4)){done=true;await cgSleep(450);break;}
    }
    if(!done)break;
  }
  // атаки: смертельный удар в лицо, иначе выгодные размены, иначе в героя
  for(const m of [...s.board]){
    if(CG.over)break;const mm=s.board.find(x=>x.uid===m.uid);if(!mm||!cgCanAttack(s,mm))continue;
    const taunts=e.board.filter(x=>x.taunt);let tg=null;
    const lethal=!taunts.length&&s.board.filter(x=>cgCanAttack(s,x)).reduce((a,x)=>a+x.atk,0)>=e.hp;
    if(taunts.length)tg=taunts.sort((a,b)=>a.hp-b.hp)[0].uid;
    else if(lethal)tg='me';
    else{const good=e.board.filter(x=>x.hp<=mm.atk&&x.atk<mm.hp).sort((a,b)=>b.atk-a.atk)[0];tg=good?good.uid:'me';}
    await cgAttack(s,mm.uid,tg);await cgSleep(350);
  }
  if(!CG.over&&!s.powerUsed&&s.mana>=2){const p=CG_HEROES[s.hero].power;
    if(p.k==='selfheal'&&s.hp<s.max)await cgPower(s,null);
    else if(p.k==='dmg'){const kill=e.board.find(m=>m.hp<=1);await cgPower(s,kill?kill.uid:'me');}}
  CG.busy=false;
  if(!CG.over){await cgSleep(400);cgTurnStart('me');}
}
async function cgAiShow(uid,c){
  const el=document.createElement('div');el.className='cg-reveal';el.innerHTML=cgCardHTML({uid,id:Object.keys(CG_CARDS).find(k=>CG_CARDS[k]===c)},true);
  const root=document.querySelector('.cg');if(!root)return;root.appendChild(el);
  await cgSleep(900);el.remove();
}
/* ---- ход игрока ---- */
function cgCancel(){CG.sel=null;CG.target=null;cgRender();}
async function cgTapHand(uid){
  if(CG.turn!=='me'||CG.busy||CG.over)return;
  const h=CG.me.hand.find(x=>x.uid===uid);const c=CG_CARDS[h.id];
  if(c.cost>CG.me.mana){cgToast('Не хватает маны');cgShake(`[data-h="${uid}"]`);return;}
  if(c.type==='m'&&CG.me.board.length>=5){cgToast('На столе максимум 5 существ');return;}
  const need=cgNeedsTarget(c);
  if(need){CG.target={mode:'card',uid,kind:need};CG.sel=null;cgRender();cgToast('Выбери цель');return;}
  await cgPlayWithWord(uid,null);
}
async function cgPlayWithWord(uid,target){
  const h=CG.me.hand.find(x=>x.uid===uid);if(!h)return;const c=CG_CARDS[h.id];
  CG.busy=true;CG.target=null;cgRender();
  let bonus=false;
  if(CG.words)bonus=await cgQuiz(c);
  CG.busy=false;await cgPlay(CG.me,uid,target,bonus);
}
async function cgTapTarget(t){
  if(CG.turn!=='me'||CG.busy||CG.over)return;
  if(CG.target){
    const T=CG.target;
    if(!cgValidTarget(T.kind,t,CG.me)){cgToast(T.kind==='ally'?'Выбери своё существо':'Эта цель не подходит');return;}
    if(T.mode==='card')return cgPlayWithWord(T.uid,t);
    if(T.mode==='power'){CG.target=null;return cgPower(CG.me,t);}
  }
  if(CG.sel){
    if(t==='me'||CG.me.board.some(m=>m.uid===t)){if(CG.me.board.some(m=>m.uid===t))return cgTapMine(t);return;}
    const a=CG.sel;CG.sel=null;CG.busy=true;await cgAttack(CG.me,a,t);CG.busy=false;cgRender();return;
  }
}
function cgTapMine(uid){
  if(CG.turn!=='me'||CG.busy||CG.over)return;
  if(CG.target)return cgTapTarget(uid);
  const m=CG.me.board.find(x=>x.uid===uid);
  if(!cgCanAttack(CG.me,m)){cgToast(m.sick?'Существо только пришло: атакует со следующего хода':'Уже атаковало в этом ходу');return;}
  CG.sel=CG.sel===uid?null:uid;sfx('tap');cgRender();
}
function cgTapPower(){
  if(CG.turn!=='me'||CG.busy||CG.over)return;
  const s=CG.me;if(s.powerUsed){cgToast('Способность уже использована');return;}if(s.mana<2){cgToast('Нужно 2 маны');return;}
  const p=CG_HEROES[s.hero].power;
  if(p.k==='dmg'){CG.target={mode:'power',kind:'any'};CG.sel=null;cgRender();cgToast('Выбери цель');return;}
  cgPower(s,null);
}
function cgEndTurn(){if(CG.turn!=='me'||CG.busy||CG.over)return;CG.sel=null;CG.target=null;haptic('medium');if(CGO)cgLog('Соперник закончил ход');cgTurnStart('ai');}
/* ---- слово с карты ---- */
function cgQuiz(c){
  return new Promise(res=>{
    const pool=Object.values(CG_CARDS).filter(x=>x!==c&&x.ru!==c.ru&&!x.token);
    const opts=shuffle([c.ru,...shuffle(pool).slice(0,2).map(x=>x.ru)]);
    const w=document.createElement('div');w.className='cg-quiz';
    w.innerHTML=`<div class="cg-qbox"><small>Переведи слово с карты — карта станет сильнее</small><b>${esc(cgWord(c))}</b>
      <div class="cg-qopts">${opts.map(o=>`<button data-o="${esc(o)}">${esc(o)}</button>`).join('')}</div><button class="cg-qskip">Сыграть без бонуса</button></div>`;
    document.querySelector('.cg').appendChild(w);
    const done=ok=>{
      w.querySelectorAll('[data-o]').forEach(b=>{b.disabled=true;if(b.dataset.o===c.ru)b.classList.add('right');});
      const known=CG.learned.find(x=>x.en===c.en);if(!known)CG.learned.push({en:c.en,de:c.de,ru:c.ru,ok});else if(!ok)known.ok=false;
      setTimeout(()=>{w.classList.add('out');setTimeout(()=>{w.remove();res(ok);},220);},ok?500:1100);
    };
    w.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{const ok=b.dataset.o===c.ru;if(!ok)b.classList.add('wrong');sfx(ok?'good':'bad');haptic(ok?'ok':'err');
      if(ok){const t=document.createElement('div');t.className='cg-bonus';t.textContent='Бонус +1';w.querySelector('.cg-qbox').appendChild(t);}done(ok);});
    w.querySelector('.cg-qskip').onclick=()=>{w.remove();res(false);};
  });
}
/* ---- отрисовка ---- */
function cgIcon(k){return `<svg viewBox="0 0 24 24" aria-hidden="true">${CG_ICONS[k]||CG_ICONS.card}</svg>`;}
function cgCardHTML(h,big){
  const c=CG_CARDS[h.id];const side=c.side;
  const cost=CG.me&&CG.me.hand.includes(h)&&c.cost<=CG.me.mana&&CG.turn==='me'&&!CG.busy;
  const tg=CG.target&&CG.target.mode==='card'&&CG.target.uid===h.uid;
  return `<div class="cg-card ${side}${c.legend?' legend':''}${big?' big':''}${cost?' can':''}${tg?' aim':''}${h.fresh?' draw':''}" data-h="${h.uid}">
    <span class="cg-cost">${c.cost}</span><span class="cg-art">${cgIcon(c.ico)}</span>
    <b class="cg-nm">${esc(c.name)}</b><span class="cg-word">${esc(cgWord(c))}</span>
    <span class="cg-tx">${esc(c.text)}</span>
    ${c.type==='m'?`<span class="cg-atk">${c.atk}</span><span class="cg-hp">${c.hp}</span>`:''}</div>`;
}
function cgMinionHTML(m,mine){
  const c=CG_CARDS[m.id];const can=mine&&CG.turn==='me'&&!CG.busy&&cgCanAttack(CG.me,m);
  const sel=CG.sel===m.uid;const targetable=(CG.target&&cgValidTarget(CG.target.kind,m.uid,CG.me))||(!mine&&CG.sel&&cgTauntOK(CG.me,m.uid));
  const fxc=(CG.legendIn===m.uid?' legend-in':'')+(CG.evolvedIn===m.uid?' evolved':'');if(CG.legendIn===m.uid)CG.legendIn=null;if(CG.evolvedIn===m.uid)CG.evolvedIn=null;
  return `<button class="cg-min ${c.side}${c.legend?' legend':''}${fxc}${m.taunt?' taunt':''}${can?' can':''}${sel?' sel':''}${targetable?' tg':''}${m.fresh?' summon':''}${m.hp<m.maxHp?' hurt':''}" data-u="${m.uid}" data-mine="${mine?1:0}">
    <span class="cg-art">${cgIcon(c.ico)}</span><span class="cg-mn">${esc(c.name)}</span>
    <span class="cg-atk">${m.atk}</span><span class="cg-hp">${m.hp}</span>${m.sick&&mine?'<i class="zz">z</i>':''}${c.evo?`<i class="cg-evo">${m.kills||0}/${c.evo.need}</i>`:''}</button>`;
}
function cgHeroHTML(s,who){
  const H=CG_HEROES[s.hero];const mine=who==='me';
  const targetable=(CG.target&&cgValidTarget(CG.target.kind,who,CG.me))||(!mine&&CG.sel&&cgTauntOK(CG.me,who));
  return `<div class="cg-hero ${s.hero}${targetable?' tg':''}" data-hero="${who}"><span class="cg-mono">${H.mono}</span>
    <span class="cg-hn"><b>${H.short}</b><small>${H.sub}</small></span><span class="cg-hhp">${Math.max(0,s.hp)}</span></div>`;
}
function cgRender(){
  if(screen!=='cards'||!CG)return;
  const me=CG.me,ai=CG.ai,P=CG_HEROES[me.hero].power;
  const crystals=s=>`<span class="cg-mana"><b>${s.mana}/${s.maxMana}</b>${[...Array(10)].map((_,i)=>`<i class="${i<s.mana?'on':i<s.maxMana?'used':''}"></i>`).join('')}</span>`;
  mount(`<div class="cg ${me.hero}-side">
    <div class="cg-top"><button class="icon-btn" id="cgx" aria-label="Выйти">${ui('close')}</button>
      <span class="cg-aihand">${ai.hand.map(()=>'<i></i>').join('')}</span>${crystals(ai)}<span class="cg-deck" title="Колода соперника">${ai.deck.length}</span></div>
    ${cgHeroHTML(ai,'ai')}
    <div class="cg-row ai">${ai.board.map(m=>cgMinionHTML(m,false)).join('')||'<span class="cg-empty">пусто</span>'}</div>
    <div class="cg-mid"><span class="cg-turn">${CG.turn==='me'?'Твой ход':'Ход соперника'}</span>
      <button class="cg-end${CG.turn==='me'&&!CG.busy&&!me.hand.some(h=>CG_CARDS[h.id].cost<=me.mana)&&!me.board.some(m=>cgCanAttack(me,m))?' glow':''}" id="cgend" ${CG.turn!=='me'||CG.busy?'disabled':''}>Конец хода</button></div>
    <div class="cg-row me">${me.board.map(m=>cgMinionHTML(m,true)).join('')||'<span class="cg-empty">сыграй существо из руки</span>'}</div>
    <div class="cg-bot">${cgHeroHTML(me,'me')}
      <button class="cg-power${me.powerUsed||me.mana<2||CG.turn!=='me'?' off':''}" id="cgpow"><b>2</b><span>${esc(P.name)}</span><small>${esc(P.text)}</small></button>
      <div class="cg-side">${crystals(me)}<span class="cg-deck">${me.deck.length}</span></div></div>
    <div class="cg-hand" style="--n:${me.hand.length}">${me.hand.map((h,i)=>`<div class="cg-slot" style="--i:${i}">${cgCardHTML(h)}</div>`).join('')}</div>
    ${CG.target?'<button class="cg-cancel" id="cgcancel">Отмена</button>':''}
  </div>`,'cgscr');
  me.hand.forEach(h=>h.fresh=false);[me,ai].forEach(s=>s.board.forEach(m=>m.fresh=false));
  $('#cgx').onclick=cgExitAsk;$('#cgend').onclick=cgEndTurn;$('#cgpow').onclick=cgTapPower;
  if($('#cgcancel'))$('#cgcancel').onclick=cgCancel;
  $$('.cg-hand .cg-card').forEach(el=>el.onclick=()=>cgTapHand(+el.dataset.h));
  $$('.cg-min').forEach(el=>el.onclick=()=>{const u=+el.dataset.u;if(el.dataset.mine==='1')cgTapMine(u);else cgTapTarget(u);});
  $$('.cg-hero').forEach(el=>el.onclick=()=>cgTapTarget(el.dataset.hero));
  cgFloat();
  if(CGO&&!CGO.stopped)cgSchedulePush();
}
function cgFloat(){
  const fx=CG.fx.splice(0);
  fx.forEach((f,i)=>{
    const el=typeof f.t==='number'?document.querySelector(`[data-u="${f.t}"]`):document.querySelector(`[data-hero="${f.t}"]`);if(!el)return;
    const n=document.createElement('span');n.className='cg-num '+(f.buff?'buff':f.v>0?'heal':'dmg');n.textContent=f.buff?f.v:(f.v>0?'+'+f.v:f.v);
    n.style.animationDelay=i*60+'ms';el.appendChild(n);
    if(!f.buff&&f.v<0){el.classList.remove('hit');void el.offsetWidth;el.classList.add('hit');}
  });
}
async function cgLunge(uid,target){
  const a=document.querySelector(`[data-u="${uid}"]`),b=typeof target==='number'?document.querySelector(`[data-u="${target}"]`):document.querySelector(`[data-hero="${target}"]`);
  if(!a||!b||!a.animate)return cgSleep(120);
  const ra=a.getBoundingClientRect(),rb=b.getBoundingClientRect();
  const dx=(rb.left+rb.width/2)-(ra.left+ra.width/2),dy=(rb.top+rb.height/2)-(ra.top+ra.height/2);
  a.style.zIndex=5;
  const an=a.animate([{transform:'translate(0,0) scale(1)'},{transform:`translate(${dx*.85}px,${dy*.85}px) scale(1.08)`,offset:.55},{transform:'translate(0,0) scale(1)'}],{duration:window.CG_FAST?1:520,easing:'cubic-bezier(.3,.7,.3,1)'});
  await cgSleep(290);haptic('medium');
  await new Promise(r=>{an.onfinish=r;setTimeout(r,600);});a.style.zIndex='';
}
function cgShake(sel){const el=document.querySelector(sel);if(!el)return;el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake');}
function cgToast(t){const r=document.querySelector('.cg');if(!r)return;const d=document.createElement('div');d.className='cg-toast';d.textContent=t;r.appendChild(d);setTimeout(()=>d.remove(),1800);}
function cgBanner(t,cb){
  const r=document.querySelector('.cg');if(!r){if(cb)cb();return;}
  const d=document.createElement('div');d.className='cg-banner';d.innerHTML=`<b>${esc(t)}</b>`;r.appendChild(d);
  setTimeout(()=>{d.remove();if(cb)cb();},window.CG_FAST?0:1100);
}
function cgExitAsk(){
  const leave=()=>{if(CGO){cgNet({a:'leave',code:CGO.code}).catch(()=>{});cgStopOnline();}CG=null;delete document.body.dataset.world;renderTab('games');};
  if(!CG||CG.over)return leave();
  if(typeof tgConfirm==='function')tgConfirm(CGO?'Выйти из партии? Сопернику засчитается победа.':'Выйти из партии? Прогресс этой игры пропадёт.',leave);else leave();
}
function cgEnd(){
  if(!CG)return;const res=CG.over;const st=store.cg=store.cg||{games:0,wins:0};st.games++;if(res==='win'){st.wins++;store.gold+=100;}save();
  sfx(res==='win'?'win':'lose');
  const words=CG.learned;
  const r=document.querySelector('.cg');if(!r)return;
  const d=document.createElement('div');d.className='cg-over '+res;
  d.innerHTML=`<div class="cg-obox"><small>${CG_HEROES[CG.me.hero].name} против ${CG_HEROES[CG.ai.hero].name}</small><h2>${res==='win'?'Победа':res==='lose'?'Поражение':'Ничья'}</h2>
    ${res==='win'?'<p class="cg-gold">+100 билетов</p>':''}
    ${words.length?`<div class="cg-words"><b>Слова этой партии</b>${words.map(w=>`<span class="${w.ok?'ok':'bad'}">${esc(store.langs[0]==='de'?w.de:w.en)} — ${esc(w.ru)}</span>`).join('')}</div>`:''}
    <div class="cg-obtns"><button class="btn" id="cgagain">Ещё партия</button><button class="btn ghost" id="cgback">К играм</button></div></div>`;
  r.appendChild(d);
  const wasOnline=!!CGO;cgStopOnline();
  $('#cgagain').onclick=()=>cgPick(wasOnline?'online':'');$('#cgback').onclick=()=>{CG=null;delete document.body.dataset.world;renderTab('games');};
}
/* ---- выбор героя ---- */
function cgPick(mode){if(typeof flagOf==='function'){const g=flagOf('games')!=='on'?'games':flagOf('cards')!=='on'?'cards':null;if(g){showGate(g,'Карточная дуэль');return;}}
  CG=null;if(CGO)cgStopOnline();screen='cgpick';let online=mode==='online';backBtn(true);scStop();document.body.dataset.world='cards';
  const st=store.cg||{games:0,wins:0};
  mount(`<div class="cgp"><div class="page-head"><button class="icon-btn" id="cgpb" aria-label="Назад">${ui('back')}</button><h1 class="title">Карточная дуэль</h1></div>
    <p class="lead">Колоды, мана и существа, как в Hearthstone. Разыгрываешь карту — переводишь слово с неё. Верно — карта получает +1.</p>
    <div class="cgp-vs">
      <button class="cgp-hero bateman" data-pick="bateman"><span class="cg-mono">PB</span><b>Патрик Бейтман</b><small>Уолл-стрит. Контроль: провокация, усиления, «Сделка» по всему столу.</small><em>Способность: вылечить 3</em></button>
      <span class="cgp-x">VS</span>
      <button class="cgp-hero durden" data-pick="durden"><span class="cg-mono">TD</span><b>Тайлер Дёрден</b><small>Бумажная улица. Агрессия: рывок, бойцы из подвала, «Хаос».</small><em>Способность: 1 урон</em></button>
    </div>
    <div class="cgp-mode"><button data-m="ai" class="${online?'':'on'}">Против компьютера</button><button data-m="online" class="${online?'on':''}">С другом онлайн</button></div>
    <p class="cgp-hint" id="cgph">${online?'Выбери героя — создастся комната, позовёшь друга по ссылке.':'Выбери героя и играй сразу.'}</p>
    <div class="cgp-join"><input id="cgcode" maxlength="5" placeholder="Код комнаты" autocomplete="off"><button id="cgjoin">Войти</button></div>
    <label class="cgp-opt"><input type="checkbox" id="cgw" ${store.cgWords!==false?'checked':''}> Переводить слова с карт</label>
    <details class="cgp-how"><summary>Как играть</summary><p>У каждого 30 здоровья. Каждый ход мана растёт на 1 (до 10). Нажми карту в руке, чтобы разыграть. Существо атакует со следующего хода (кроме «Рывка»): нажми своё существо, потом цель. Существа с «Провокацией» надо убить первыми. Способность героя стоит 2 маны, раз в ход. Побеждает тот, кто первым обнулит здоровье соперника.</p></details>
    ${st.games?`<p class="foot">Сыграно ${st.games}, побед ${st.wins}</p>`:''}</div>`,'cgscr');
  $('#cgpb').onclick=()=>{delete document.body.dataset.world;renderTab('games');};
  $('#cgw').onchange=e=>{store.cgWords=e.target.checked;save();};
  $$('.cgp-mode [data-m]').forEach(b=>b.onclick=()=>{online=b.dataset.m==='online';$$('.cgp-mode [data-m]').forEach(x=>x.classList.toggle('on',x===b));$('#cgph').textContent=online?'Выбери героя — создастся комната, позовёшь друга по ссылке.':'Выбери героя и играй сразу.';sfx('sel');});
  $('#cgjoin').onclick=()=>{const c=($('#cgcode').value||'').trim().toUpperCase();if(!/^[A-Z0-9]{5}$/.test(c)){toast('Код — 5 букв и цифр');return;}haptic('medium');cgJoin(c);};
  $$('[data-pick]').forEach(b=>b.onclick=()=>{haptic('medium');sfx('whoosh');if(online)cgCreateRoom(b.dataset.pick);else cgStart(b.dataset.pick);});
}
/* ================= карточная дуэль онлайн: комнаты по коду и ссылке ================= */
// Общее состояние: A — хозяин комнаты, B — гость. Пишет на сервер только тот, чей ход.
let CGO=null;
async function cgNet(body){
  if(!TG||!TG.initData)throw new Error('Открой игру внутри Telegram');
  const r=await fetch(API+'/api/cg',{method:'POST',headers:{'content-type':'application/json','x-init-data':TG.initData},body:JSON.stringify(body)});
  return r.json();
}
const cgMine=()=>CGO.role==='host'?'A':'B',cgTheirs=()=>CGO.role==='host'?'B':'A';
function cgPack(){
  const m=cgMine(),o=cgTheirs();
  return JSON.stringify({uid:CG_UID,turnNo:CG.turnNo,[m]:CG.me,[o]:CG.ai,turn:CG.turn==='me'?m:o,
    over:CG.over?(CG.over==='draw'?'draw':CG.over==='win'?m:o):null,log:CG.log||[]});
}
function cgUnpack(json){
  const st=JSON.parse(json),m=cgMine();
  CG.me=st[m];CG.ai=st[cgTheirs()];CG_UID=Math.max(CG_UID,st.uid||1);CG.turnNo=st.turnNo;CG.turn=st.turn===m?'me':'ai';
  CG.over=st.over?(st.over==='draw'?'draw':st.over===m?'win':'lose'):null;
  const seen=CGO.logSeen||0;(st.log||[]).filter(x=>x.id>seen&&x.by!==CGO.role).forEach((x,i)=>setTimeout(()=>cgToast(x.t),i*900));
  CGO.logSeen=Math.max(seen,...(st.log||[]).map(x=>x.id),0);CG.log=st.log||[];
}
function cgLog(t){if(!CGO||!CG)return;CG.log=[...(CG.log||[]),{id:(CG.log&&CG.log.length?CG.log[CG.log.length-1].id:0)+1,by:CGO.role,t}].slice(-6);CGO.logSeen=CG.log[CG.log.length-1].id;}
function cgSchedulePush(){if(!CGO||CGO.applying||!CG)return;clearTimeout(CGO.pt);CGO.pt=setTimeout(cgPush,window.CG_FAST?0:180);}
async function cgPush(){
  if(!CGO||!CG)return;
  if(CGO.pushing){CGO.again=true;return;}
  const json=cgPack();if(json===CGO.lastSent)return;
  const turnRole=CG.turn==='me'?CGO.role:(CGO.role==='host'?'guest':'host');
  CGO.pushing=true;
  try{const r=await cgNet({a:'push',code:CGO.code,ver:CGO.ver,state:json,turn:turnRole,over:!!CG.over});
    if(r.ok){CGO.ver=r.v.ver;CGO.lastSent=json;}
    else if(r.err==='ver'&&r.v)cgApplyRemote(r.v,true);
  }catch(e){if(CGO)setTimeout(cgSchedulePush,1500);}
  if(CGO)CGO.pushing=false;
  // пока шла отправка, могли сыграть ещё карту или закончить ход — дошлём последнее состояние
  if(CGO&&CG&&(CGO.again||cgPack()!==CGO.lastSent)){CGO.again=false;cgSchedulePush();}
}
function cgPollLoop(){
  if(!CGO)return;clearTimeout(CGO.timer);
  CGO.timer=setTimeout(async()=>{
    if(!CGO)return;
    try{const r=await cgNet({a:'state',code:CGO.code});if(r.ok)cgApplyRemote(r.v);}catch(e){}
    cgPollLoop();
  },window.CG_FAST?20:(CG&&CG.turn==='me'?4000:1400));
}
function cgApplyRemote(v,force){
  if(!CGO)return;
  if(v.left&&v.left!==CGO.role&&!CGO.done){CGO.done=true;if(CG&&!CG.over){CG.over='win';}cgStopOnline();cgToast('Соперник вышел из партии');if(CG)setTimeout(cgEnd,600);else cgPick();return;}
  if(v.st==='wait'){if(screen==='cglobby')cgLobby(v);return;}
  if(!v.state){if(CGO.role==='host'&&!CG)cgOnlineInit(v);return;}
  if(!force&&CG&&v.ver<=CGO.ver)return;
  const prev=CG&&CG.turn;CGO.ver=v.ver;
  if(!CG){CG={turn:'ai',over:null,sel:null,target:null,busy:false,words:store.cgWords!==false,learned:[],turnNo:0,fx:[],log:[]};screen='cards';backBtn(true);scStop();document.body.dataset.world='cards';}
  CGO.applying=true;cgUnpack(v.state);CGO.lastSent=v.state;CG.sel=null;CG.target=null;CG.busy=false;cgRender();CGO.applying=false;
  if(CG.over&&!CGO.done){CGO.done=true;cgStopOnline(true);setTimeout(cgEnd,600);return;}
  if(CG.turn==='me'&&prev!=='me'){cgBanner('Твой ход');haptic('medium');}
}
function cgStopOnline(keep){if(!CGO)return;clearTimeout(CGO.timer);clearTimeout(CGO.pt);if(!keep)CGO=null;else CGO.stopped=true;}
// хозяин раздаёт карты, когда гость зашёл
function cgOnlineInit(v){
  CG_UID=1;const foe=v.guest.hero;
  CG={me:cgNewSide(v.host.hero),ai:cgNewSide(foe),turn:'me',over:null,sel:null,target:null,busy:false,words:store.cgWords!==false,learned:[],turnNo:0,fx:[],log:[]};
  for(let i=0;i<3;i++){cgDraw(CG.me,true);cgDraw(CG.ai,true);}cgDraw(CG.ai,true);
  screen='cards';backBtn(true);scStop();document.body.dataset.world='cards';
  cgLog(`${v.guest.n} зашёл в комнату`);cgRender();cgToast(`${v.guest.n} в игре!`);sfx('win');cgTurnStart('me');
}
async function cgCreateRoom(hero){
  try{const r=await cgNet({a:'create',hero});if(!r.ok){toast(r.msg||'Не получилось создать комнату');return;}
    CGO={code:r.v.code,role:'host',ver:0};cgLobby(r.v);cgPollLoop();}
  catch(e){toast(e.message||'Нет связи');}
}
async function cgJoin(code){
  try{const r=await cgNet({a:'join',code});if(!r.ok){toast(r.msg||'Не получилось войти');cgPick();return;}
    CGO={code:r.v.code,role:r.v.me||'guest',ver:0};
    if(!r.v.state){screen='cglobby';backBtn(true);mount(`<div class="cgp"><div class="cgl-wait"><span class="cgl-spin"></span><b>Заходим в комнату ${esc(r.v.code)}…</b><small>${esc(r.v.host.n)} раздаёт карты</small></div></div>`,'cgscr');}
    else cgApplyRemote(r.v,true);
    cgPollLoop();}
  catch(e){toast(e.message||'Нет связи');}
}
function cgLobby(v){
  screen='cglobby';backBtn(true);document.body.dataset.world='cards';
  const link=fsLink(`https://t.me/languagegamesbot/languagedota2?startapp=cg_${v.code}`);
  mount(`<div class="cgp"><div class="page-head"><button class="icon-btn" id="cglb" aria-label="Назад">${ui('back')}</button><h1 class="title">Комната</h1></div>
    <div class="cgl"><small>Код комнаты</small><b class="cgl-code">${esc(v.code)}</b>
      <p>Отправь другу ссылку или код. Ты играешь за ${esc(CG_HEROES[v.host.hero].short)}, друг — за ${esc(CG_HEROES[v.host.hero==='bateman'?'durden':'bateman'].short)}.</p>
      <button class="btn" id="cgshare">Позвать друга</button><button class="btn ghost" id="cgcopy">Скопировать код</button>
      <div class="cgl-wait"><span class="cgl-spin"></span><small>Ждём соперника…</small></div></div></div>`,'cgscr');
  $('#cglb').onclick=()=>{cgNet({a:'leave',code:v.code}).catch(()=>{});cgStopOnline();cgPick();};
  $('#cgshare').onclick=()=>{const u=`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent('Сыграем в карточную дуэль? Бейтман против Дёрдена 🃏')}`;try{TG.openTelegramLink(u);}catch(e){window.open(u);}};
  $('#cgcopy').onclick=()=>{try{navigator.clipboard.writeText(v.code);toast('Код скопирован');}catch(e){toast('Код: '+v.code);}};
}
/* ================= разделы: включение и выключение (админ-панель) ================= */
// Состояние берётся с сервера (/api/flags) и кэшируется. Менять может только организатор — проверяет сервер.
const FLAG_SECTIONS=[
  ['all','🛠 Технические работы — выключить всё','игрокам — заглушка «Кинотеатр обновляется», админ работает как обычно'],['kino','Кинозал','вкладка со сценами'],['games','Игры','вкладка игр целиком'],['cards','Карточная дуэль',''],['spy','Шпион',''],['arena','Дуэль и турнир',''],
  ['kinolesson','Урок «Фразы из кино»','на главной'],['dota','Мир Доты',''],['cs2','Мир CS 2',''],['best','Солянка',''],['lesson','Урок: 5 новых слов','']];
const FKEY='dota_flags_v1';
let FLAGS={},FLAG_ADMIN=false,FLAG_RAW=null,FLAG_ME=null;
try{const c=JSON.parse(localStorage.getItem(FKEY)||'{}');FLAGS=c.flags||{};FLAG_ADMIN=!!c.admin;}catch(e){}
const flagOf=k=>FLAG_ADMIN?'on':(FLAGS[k]||'on');
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
// контур шестерёнки для экрана «тех. работ»
function gearPath(cx,cy,r1,r2,n){let d='';for(let i=0;i<n*2;i++){const a1=Math.PI*i/n,a2=Math.PI*(i+1)/n,r=i%2?r1:r2;
  d+=(i?'L':'M')+(cx+r*Math.cos(a1)).toFixed(1)+' '+(cy+r*Math.sin(a1)).toFixed(1)+'L'+(cx+r*Math.cos(a2)).toFixed(1)+' '+(cy+r*Math.sin(a2)).toFixed(1);}return d+'Z';}
function showGate(k,title){
  sfx('bad');haptic('err');
  const w=document.createElement('div');w.className='gatewrap';w.innerHTML=`<div class="gatebox">${gateHTML(k,title)}<button class="hs-btn" data-close>Понятно</button></div>`;
  document.body.appendChild(w);w.onclick=e=>{if(e.target===w||e.target.closest('[data-close]')){w.classList.add('out');setTimeout(()=>w.remove(),220);}};
}
// пометить закрытые кнопки и перехватить нажатия (вызывается после каждой отрисовки вкладки)
const FLAG_BTNS={'#hLesson':'kinolesson','#best':'best','#lesson':'lesson','#wDota':'dota','#wCS':'cs2','#gCards':'cards','#gSpy':'spy','#gArena':'arena'};
// пометить одну кнопку: закрыта — плашка и экран «тех. работы»/«в разработке»; админу — подсказка, что видят игроки
function flagMark(el,k,title){const st=flagOf(k);if(st==='hide'){el.style.display='none';el.classList.add('flag-hidden');return;}el.style.display='';const raw=FLAG_ADMIN&&FLAG_RAW&&FLAG_RAW[k]&&FLAG_RAW[k].st!=='on'?FLAG_RAW[k].st:null;
  el.querySelectorAll(':scope > .fbadge').forEach(x=>x.remove());el.classList.remove('flagged');
  if(st!=='on'){el.classList.add('flagged');el.insertAdjacentHTML('beforeend',`<span class="fbadge ${st}">${FLAG_TXT[st]}</span>`);el.onclick=e=>{e.stopPropagation();showGate(k,title);};}
  else if(raw)el.insertAdjacentHTML('beforeend',`<span class="fbadge admin">для всех: ${FLAG_TXT[raw]}</span>`);}
// ключи замков: вся вкладка kino → сцена scene-<id> → эпизод ep-<id>-<номер с 0>
const flagEpKey=(id,i)=>'ep-'+id+'-'+i;
// проверка перед входом в сцену или эпизод (ловит и кнопки «Продолжить», и ссылки с главной)
function scGate(id,i){const s=scOf(id);if(!s)return true;
  const ks=['all','kino','scene-'+id].concat(i==null?[]:[flagEpKey(id,i)]);
  for(const k of ks)if(flagOf(k)!=='on'){if(flagOf(k)==='hide'){toast('Недоступно');return true;}showGate(k,k.startsWith('ep-')?s.title+' · '+s.parts[i].t:s.title);return true;}
  return false;}
function applyFlagsUI(){
  const mark=flagMark;
  for(const sel in FLAG_BTNS){const el=$(sel);if(el){const t=(el.querySelector('b')||{}).textContent||'';mark(el,FLAG_BTNS[sel],t);}}
  $$('[data-sc]').forEach(el=>{const id=el.dataset.sc,k=flagOf('kino')!=='on'?'kino':'scene-'+id;const t=(el.querySelector('b')||{}).textContent||'';mark(el,k,t);});
  // сериал/фильм целиком прячется, если скрыты все его сцены; скрытые вкладки — без кнопки внизу
  $$('[data-show]').forEach(el=>{const L=SCENES.filter(s=>s.show===el.dataset.show);el.style.display=L.length&&L.every(s=>flagOf('scene-'+s.id)==='hide')?'none':'';});
  ['kino','games'].forEach(k=>$$(`[data-tab="${k}"],[data-nav="${k}"]`).forEach(el=>el.style.display=flagOf(k)==='hide'?'none':''));
}
/* ---- админ-панель: дерево «вкладка → раздел → сцена → эпизод» ---- */
/* ---- 11.2 админ → «Игрок»: пройти всё, сбросить прогресс (себе и по ID), режим игрока ---- */
function admPass(s){const P=scP(s.id);P.done=s.parts.map((p,i)=>i);P.w=P.w||{};P.st=P.st||{};P.got=P.got||{};
  s.parts.forEach((p,i)=>{P.w[i]=1;P.st[i]=3;scAct(p.ph).forEach(f=>{P.m[f.id]=Math.max(P.m[f.id]||0,3);if(!P.got[f.id])P.got[f.id]=Date.now();});});P.boss=3;
  store.scOwn=store.scOwn||{};store.scOwn[s.id]=1;s.parts.forEach((p,i)=>rwGive(s,i));segGive(s);showGive(s);}
const ADM_KEEP=['onboarded','langs','snd','fx','full','fullV','theme','tab','subV','subStyle','scSub','scSubChosen','scVol','scMute','musVol','musAuto','vtask','gav','bg3d','labSub','labSnd','labUi','goal','games','roles','path','kvUid','admPlayer','remind'];
function admResetMe(){const keep={};ADM_KEEP.forEach(k=>{if(store[k]!==undefined)keep[k]=store[k];});
  SC={};scSave();M={};saveM();RV={};saveRV();
  store=normalize(Object.assign(fresh(),keep));store.resetAt=Date.now();save();}
// сброс по ID: команда лежит в воркере бота (bot/worker.js, /api/pvp), игрок забирает её при запуске
async function admResetPull(){if(!(TG&&TG.initData)&&!window.__INIT)return;try{const r=await kvNet({a:'rget'});
  if(r&&r.ok&&r.v&&r.v.t&&r.v.t>(store.resetAt||0)){admResetMe();store.resetAt=r.v.t;save();toast('Прогресс сброшен администратором');renderHome();}}catch(e){}}
setTimeout(admResetPull,2500);
const ADM_ANIMS=[
  {id:'splash',n:'Заставка «кинопроектор»',d:'Отсчёт плёнки, шторки, название. При запуске приложения.',run:()=>splash()},
  {id:'gold',n:'Монеты в счётчик',d:'Когда что-то заработал: «+N» летит в счётчик.',run:()=>{renderHome();setTimeout(()=>{const w=store.fx;store.fx=true;goldFX(25);store.fx=w;},500);}},
  {id:'fly',n:'Карты летят в словарь',d:'После эпизода и проверки: новые фразы-карты падают в «Словарь».',run:()=>{const s=SCENES.find(x=>x.kind!=='clip'),L=dictCards(s).slice(0,4);L.forEach(c=>DICT_NEW.push({sid:s.id,fid:c.f.id}));dictFly();}},
  {id:'rw',n:'Награда за эпизод',d:'Кадр, который вертится и переворачивается, факт в конверте, значок.',run:()=>{const s=SCENES.find(x=>x.id==='american-psycho')||SCENES[0];rwOpen(rwKey(s,0));}},
  {id:'cd',n:'Отсчёт 3-2-1',d:'Перед дуэлью и играми.',run:()=>countdown(()=>{})},
  {id:'flip',n:'Перелистывание словаря',d:'Страница сцены поворачивается, как в книге.',run:()=>{DX.seg='ph';DX.show=null;DX.sid=null;const sh=dxShows().find(x=>x.L.length>1)||dxShows()[0];DX.show=sh.k;DX.sid=sh.L[0].id;renderTab('dict');setTimeout(()=>dxFlip(1),600);}},
];
function admPlHTML(){const ch=(id,t,d)=>`<button class="adp-b" id="${id}"><b>${t}</b><small>${d}</small></button>`;
  return `<p class="lab-note">Для проверки. Всё меняется только у тебя на этом аккаунте (кроме сброса по ID).</p>
    <div class="adp">
      ${ch('adpPl',store.admPlayer?'👤 Смотрю как игрок':'👑 Смотрю как админ',store.admPlayer?'Замки и цены — как у всех. Нажми, чтобы снова открыть всё.':'Тебе открыто всё. Нажми, чтобы увидеть замки как у игрока.')}
      ${ch('adpAll','✅ Пройти всё','Все сцены: эпизоды на 3 ★, финалы, все фразы в словаре')}
      ${ch('adpGold','🪙 +1000 монет','Для проверки покупок и ставок в дуэли')}
      ${ch('adpReset','🗑 Сбросить мой прогресс','Как новый игрок: сцены, монеты, серия, словарь, мои слова. Настройки останутся')}
    </div>
    <button class="adm-tg" type="button">Пройти одну сцену</button><div class="adm-fold" hidden><div class="adp-sc">${SCENES.map(s=>{const P=scP(s.id);return `<button data-pass="${s.id}">${P.done.length>=s.parts.length?'✓ ':''}${esc(s.title)}<small>${esc(s.sub||s.ep||'')}</small></button>`;}).join('')}</div></div>
    <button class="adm-tg" type="button">Сбросить игроку по ID</button><div class="adm-fold" hidden><div class="adp-id"><input id="adpId" inputmode="numeric" placeholder="Telegram ID игрока"><button class="sc-btn" id="adpIdGo">Сбросить</button></div>
      <p class="lab-note">Прогресс обнулится, когда игрок в следующий раз откроет приложение. Работает через воркер бота (bot/worker.js 12.0).</p></div>`;}
function admPlBind(){const re=()=>{const y=document.querySelector('.admscr')?window.scrollY:0;renderAdmin();window.scrollTo(0,y);};
  $('#adpPl').onclick=()=>{sfx('tap');store.admPlayer=!store.admPlayer;save();toast(store.admPlayer?'Теперь всё как у игрока':'Тебе снова открыто всё');re();};
  $('#adpAll').onclick=()=>tgConfirm('Отметить все сцены пройденными на 3 звезды?',()=>{SCENES.forEach(admPass);scSave();save();sfx('win');haptic('ok');toast('Готово: всё пройдено');re();});
  $('#adpGold').onclick=()=>{store.gold=(store.gold||0)+1000;save();sfx('coin');toast('+1000 монет · всего '+fmt(store.gold));};
  $('#adpReset').onclick=()=>tgConfirm('Сбросить весь твой прогресс? Это не отменить.',()=>{admResetMe();sfx('tap');haptic('warn');toast('Прогресс сброшен');re();});
  $$('[data-pass]').forEach(b=>b.onclick=()=>{const s=scOf(b.dataset.pass);admPass(s);scSave();save();sfx('good');toast('Пройдено: '+s.title);if(!/^✓/.test(b.firstChild.textContent))b.firstChild.textContent='✓ '+b.firstChild.textContent;});
  $('#adpIdGo').onclick=async()=>{const id=String($('#adpId').value||'').replace(/\D/g,'');if(!id){toast('Впиши Telegram ID');return;}
    tgConfirm(`Сбросить весь прогресс игроку ${id}?`,async()=>{try{const r=await kvNet({a:'rset',target:'tg'+id});toast(r&&r.ok?`Готово: сбросится у ${id} при следующем запуске`:(r&&r.msg)||'Не получилось');}catch(e){toast('Сервер не отвечает — обнови воркер бота (bot/worker.js)');}});};}
function renderAdmin(){
  screen='admin';backBtn(true);
  const raw=FLAG_RAW||{},F=Object.fromEntries(FLAG_SECTIONS.map(x=>[x[0],x]));
  const stOf=k=>(raw[k]&&raw[k].st)||'on',allowOf=k=>(raw[k]&&raw[k].allow)||[];
  const ST=[['on','Открыт'],['maint','Тех. работы'],['dev','В разработке'],['hide','Скрыт']];
  const row=(k,n,d,lvl)=>{const st=stOf(k),al=allowOf(k);return `<section class="adm l${lvl||1}" data-k="${k}" data-st="${st}">
    <div class="adm-h"><b>${esc(n)}</b>${d?`<small>${esc(d)}</small>`:''}<span class="adm-dot"></span></div>
    <div class="adm-seg">${ST.map(([v,l])=>`<button data-st="${v}" class="${st===v?'on':''}">${l}</button>`).join('')}</div>
    <button class="adm-tg${al.length?' open':''}" type="button">Тестеры${al.length?` · ${al.length}`:''}</button><div class="adm-fold"${al.length?'':' hidden'}><input class="adm-allow" placeholder="ID через запятую — кому открыт всегда" value="${esc(al.join(', '))}"></div></section>`;};
  const sec=k=>row(k,F[k][1],F[k][2],1);
  const locked=k=>stOf(k)!=='on';
  const scenes=SCENES.map(s=>{const eps=s.parts.map((p,i)=>flagEpKey(s.id,i)),n=eps.filter(locked).length;
    return row('scene-'+s.id,s.title,s.ep,2)+`<div class="adm-eps"><button class="adm-tg${n?' open':''}" type="button">Эпизоды · ${s.parts.length}${n?` · закрыто ${n}`:''}</button><div class="adm-fold"${n?'':' hidden'}>${s.parts.map((p,i)=>row(flagEpKey(s.id,i),String(i+1).padStart(2,'0')+' · '+p.t,'',3)).join('')}</div></div>`;}).join('');
  const grp=(title,html)=>`<div class="adm-grp"><h3>${title}</h3>${html}</div>`;
  mount(`<div class="page-head"><button class="icon-btn" id="bBtn" aria-label="Назад">${ui('back')}</button><h1 class="title">Админ-панель</h1></div>
    <p class="lead adm-lead">Тебе открыто всё.${FLAG_ME?` Твой ID: <b>${FLAG_ME}</b>.`:''} Ниже — проверка, анимации и что видят игроки.</p>
    ${grp('Игрок',admPlHTML())}
    ${grp('Анимации',`<p class="lab-note">Все анимации приложения — нажми «▶», посмотри, она закроется сама.</p><div class="adp-anl">${ADM_ANIMS.map(a=>`<div class="adp-an"><span><b>${a.n}</b><small>${a.d}</small></span><button data-an="${a.id}">▶</button></div>`).join('')}</div>`)}
    ${grp('Проверка установки',`<p class="lab-note">Проверяет, что в репозиториях лежит всё нужное: свежий код, маскот, видео и обложки каждой сцены.</p><button class="sc-btn" id="dkGo">Проверить установку</button><div id="dkBox" class="dk"></div>`)}
    ${grp('Оформление — лаборатория',`<p class="lab-note">Видишь только ты, на этом устройстве. Пощёлкай, выбери лучшее и напиши мне — сделаю по умолчанию для всех.</p>
      <div class="lab"><b>Субтитры</b><div class="lab-prev" data-ss="${labSub()}"><div class="sc-subs"><div class="sline"><span class="en">I'm in it for the long run, you know?</span></div><div class="sline s2"><span class="tr">Я тут надолго, понимаете?</span></div></div></div>
        <div class="lab-chips">${LAB_SUB.map(([k,l])=>`<button data-lab="labSub" data-v="${k}" class="${labSub()===k?'on':''}">${l}</button>`).join('')}</div></div>
      <div class="lab"><b>Звуки</b><div class="lab-chips">${LAB_SND.map(([k,l])=>`<button data-lab="labSnd" data-v="${k}" class="${(store.labSnd||'cs')===k?'on':''}">${l}</button>`).join('')}</div></div>
      <div class="lab"><b>Интерфейс</b><div class="lab-chips">${LAB_UI.map(([k,l])=>`<button data-lab="labUi" data-v="${k}" class="${(store.labUi||'grafit')===k?'on':''}">${l}</button>`).join('')}</div></div>`)}
    ${grp('Всё приложение',sec('all'))}
    ${grp('Кинозал',`<p class="lab-note">«Скрыт» — у игроков этого нет вообще. «${FLAG_TXT.maint}» / «${FLAG_TXT.dev}» — видно, но закрыто. Закрытая вкладка закрывает всё внутри. «Тестеры» — ID тех, кому открыто всегда (/myid).</p>`+sec('kino')+scenes)}
    ${grp('Игры',sec('games')+['cards','spy','arena'].map(k=>row(k,F[k][1],F[k][2],2)).join(''))}
    ${grp('Главная',['kinolesson','lesson','best','dota','cs2'].map(sec).join(''))}
    <div class="cta"><button class="btn" id="admSave">Сохранить</button></div>`,'admscr');
  $('#bBtn').onclick=()=>{sfx('tap');renderTab('profile');};
  if($('#dkGo'))$('#dkGo').onclick=()=>{sfx('tap');deployCheck($('#dkBox'));};
  admPlBind();
  $$('[data-an]').forEach(b=>b.onclick=()=>{const a=ADM_ANIMS.find(x=>x.id===b.dataset.an);if(!a)return;sfx('tap');const was=store.fx;store.fx=true;try{a.run();}catch(e){toast('Не получилось: '+e.message);}store.fx=was;});
  $$('[data-gv]').forEach(b=>b.onclick=()=>{const v=b.dataset.gv;sfx('tap');
    if(v==='tog'){store.gav=store.gav===false;save();b.classList.toggle('on',store.gav!==false);b.textContent=store.gav!==false?'Включён':'Выключен';return;}
    if(!gavOn()){toast('Сначала включи Гаврика (и анимации в настройках)');return;}
    if(v==='kill')gavKill("I'm in it for the long run");else if(['stamp','bag','burn'].includes(v))gavEpisode('Первый день',v);else{gavIdle();gavSay(v);}});
  $$('[data-lab]').forEach(b=>b.onclick=()=>{store[b.dataset.lab]=b.dataset.v;save();labApply();
    b.parentElement.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));
    if(b.dataset.lab==='labSub'){const pv=$('.lab-prev');if(pv)pv.dataset.ss=b.dataset.v;}
    if(b.dataset.lab==='labSnd'&&b.dataset.v!=='off'){const was=store.snd;store.snd=true;sfx('tap');setTimeout(()=>sfx('good'),250);setTimeout(()=>sfx('nope'),700);setTimeout(()=>sfx('win'),1150);store.snd=was;}
    if(b.dataset.lab==='labUi')haptic('sel');});
  $$('.adm-seg button').forEach(b=>b.onclick=()=>{b.parentElement.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));b.closest('.adm').dataset.st=b.dataset.st;sfx('sel');});
  // раскрыть «Тестеры» / «Эпизоды» — обычные кнопки, без <details> (в части вебвью Telegram они не раскрываются)
  $$('.adm-tg').forEach(b=>b.onclick=e=>{e.stopPropagation();const f=b.nextElementSibling;const open=f.hidden;f.hidden=!open;b.classList.toggle('open',open);sfx('tap');});
  $('#admSave').onclick=async()=>{
    const flags={};$$('.adm').forEach(s=>{const st=s.querySelector('.adm-seg .on').dataset.st;const allow=s.querySelector('.adm-allow').value.split(/[\s,;]+/).map(x=>x.trim()).filter(Boolean);
      if(st!=='on'||allow.length)flags[s.dataset.k]={st,allow};});
    const b=$('#admSave');b.disabled=true;b.textContent='Сохраняю…';
    try{const r=await flagsCall({a:'set',flags});if(r&&r.ok){FLAG_RAW=r.v.raw;toast('Сохранено. Игроки увидят при следующем открытии.');haptic('ok');}else toast((r&&r.msg)||'Не получилось сохранить');}
    catch(e){toast('Нет связи с сервером');}
    b.disabled=false;b.textContent='Сохранить';
  };
}

setTimeout(flagsRefresh,400);
/* ================= главная: кино в центре, игры ниже ================= */
function continueScene(){
  const L=store.scLast,s=L&&scOf(L.id);
  if(s){const P=scP(s.id);let i=Math.min(L.i,s.parts.length-1);if(P.done.includes(i)){const nx=s.parts.findIndex((p,k)=>!P.done.includes(k));if(nx>=0)i=nx;}return {s,i,fresh:false};}
  const easy=SCENES.filter(x=>x.kind!=='clip'&&flagOf('scene-'+x.id)==='on'&&(scL()==='de'?true:x.lang!=='de')).sort((a,b)=>(a.lvl||3)-(b.lvl||3))[0]||SCENES[0];
  return {s:easy,i:0,fresh:true};
}
// сцена для урока: где больше всего невыученных фраз из просмотренных эпизодов
function scLessonScene(){
  let best=null;
  for(const s of SCENES){const P=scP(s.id);const cand=s.parts.flatMap((p,i)=>(P.w[i]||P.done.includes(i))?p.ph:[]).filter(f=>!f.passive&&(P.m[f.id]||0)<3&&!P.r[f.id]);
    if(cand.length&&(!best||cand.length>best.cand.length))best={s,cand};}
  if(!best){const s=continueScene().s,P=scP(s.id);const cand=s.parts.flatMap(p=>p.ph).filter(f=>!f.passive&&(P.m[f.id]||0)<3&&!P.r[f.id]);if(cand.length)best={s,cand,fresh:true};}
  return best;
}
function startScLesson(){
  const b=scLessonScene();
  if(!b){toast('Все фразы выучены — скоро будут новые сцены');return;}
  // Урок начинается с эпизода, а не с пяти разрозненных карточек.
  // Берём максимум 5 активных фраз из одного эпизода — их и разбираем на втором просмотре.
  const list=b.cand.slice().sort((x,y)=>x.a-y.a).slice(0,5);
  renderScEp(b.s.id,list[0].pi,{lessonList:list});
}
function learnTabHTML(){
  setWorld('neutral');CURW='dota';
  // 8.7: главная — только главное. Продолжить → Сегодня (одно главное действие) → два входа (мои слова, словарь) → фраза дня → кинозал.
  const c=continueScene(),s=c.s,p=s.parts[c.i],L=scLearned(s),T=scTotal(s);
  const d=dayStat(),goal=store.goal||20,gp=Math.min(100,Math.round(d.n/goal*100)),les=scLessonScene();
  const Q=dailyItems(),n=Q.length,mw=mywAll().length,A=dictAll().length;
  const main=n?{id:'hRev',k:'Повторение',b:`${n} ${plural(n,['задание','задания','заданий'])} · ≈ ${Math.max(2,Math.round(n*0.4))} мин`,s:'фразы и твои слова, которые пора вспомнить'}
    :les?{id:'hLesson',k:'Урок на сегодня',b:`5 фраз · ≈ 3 мин`,s:`из «${esc(les.s.title)}»`}
    :{id:'hNext',k:'Дальше',b:`Эпизод ${c.i+1} · ${esc(p.t)}`,s:esc(s.title)};
  return `<div class="home">${headHTML()}
    <button class="hcont ${s.theme} anim" id="hCont" data-sc="${s.id}"><span class="hc-img" style="background-image:url('${assetUrl(scKey(s,'cover.jpg'))}')"></span><span class="hc-grad"></span>
      <span class="hc-t"><em>${c.fresh?'Начни отсюда':'Продолжить смотреть'}</em><b>${esc(s.title)}</b><small>Эпизод ${c.i+1} · ${esc(p.t)}</small>
        <span class="hc-bar"><i style="width:${Math.round(L/T*100)}%"></i></span><small class="hc-prog">выучено фраз ${L} из ${T}</small></span>
      <span class="hc-play">${SI.play}</span></button>
    <section class="htoday anim">
      <div class="ht-h"><b>Сегодня</b><span>🔥 ${store.streak} ${plural(store.streak,['день','дня','дней'])} · ${Math.min(d.n,goal)}/${goal}</span></div>
      <span class="ht-bar"><i style="width:${gp}%"></i></span>
      <button class="ht-main" id="${main.id}"><span><em>${main.k}</em><b>${main.b}</b><small>${main.s}</small></span><i>${SI.play}</i></button>
      ${n&&les?`<button class="ht-alt" id="hLesson">или урок: 5 фраз из «${esc(les.s.title)}» →</button>`:''}
    </section>
    <div class="htiles anim">
      <button class="htile" onclick="renderMyWords()"><span>⭐</span><b>Мои слова</b><small>${mw?mw+' '+plural(mw,['слово','слова','слов']):'сохраняй из субтитров'}</small></button>
    </div>
    ${phraseOfDayHTML()}
    <div class="hsec anim"><h2>Кинозал</h2><button class="hlink" id="hAllKino">Все сцены →</button></div>
    ${[['kino',x=>x.kind!=='interview'],['iv',x=>x.kind==='interview']].map(([hk,hf])=>{const HS=SCENES.filter(x=>flagOf('scene-'+x.id)!=='hidden'&&hf(x));if(!HS.length)return '';
    return (hk==='iv'?`<div class="hsec anim"><h2>Интервью</h2><button class="hlink" id="hAllIv">Все интервью →</button></div>`:'')+`<div class="hrow">${(()=>{const G=[],by={};for(const x of HS){const k=x.show||x.title;if(!by[k]){by[k]=[];G.push(k);}by[k].push(x);}
      return G.map(k=>{const L=by[k],x=L[0],l=L.reduce((a,y)=>a+scLearned(y),0),t=L.reduce((a,y)=>a+scTotal(y),0),eps=L.reduce((a,y)=>a+y.parts.length,0);
        return `<button class="hposter ${x.theme} anim${L.every(y=>scMasterPct(y)===100)?' mastered':''}" ${L.length>1?`data-show="${esc(k)}"`:`data-sc="${x.id}"`}><span class="kp-img" style="background-image:url('${assetUrl(scKey(x,'poster.jpg'))}'),url('${assetUrl(scKey(x,'cover.jpg'))}')"></span><span class="kp-grad"></span><span class="kp-t"><b>${esc(k)}</b><small>${L.length>1?L.length+' '+plural(L.length,['сцена','сцены','сцен'])+' · ':''}${eps} ${plural(eps,['эпизод','эпизода','эпизодов'])}</small><span class="kp-bar"><i style="width:${t?Math.round(l/t*100):0}%"></i></span></span></button>`;}).join('');})()}</div>`;}).join('')}</div>`;
}
function bindLearn(){
  bindHead();
  const c=continueScene();
  if($('#hCont'))$('#hCont').onclick=()=>{haptic('medium');renderScEp(c.s.id,c.i);};
  if($('#hLesson'))$('#hLesson').onclick=()=>{haptic('medium');startScLesson();};
  if($('#hRev'))$('#hRev').onclick=()=>{haptic('medium');renderDaily();};
  if($('#hNext'))$('#hNext').onclick=()=>{haptic('medium');renderScEp(c.s.id,c.i);};
  if($('#hReview'))$('#hReview').onclick=()=>{haptic('medium');const sc=SCENES.find(x=>scDue(x).length);if(sc)renderScQuiz(sc.id,'rev');else startSession('review');};
  if($('#hAllKino'))$('#hAllKino').onclick=()=>{sfx('tap');renderTab('kino');};
  if($('#hAllIv'))$('#hAllIv').onclick=()=>{sfx('tap');store.kinoCat='interview';save();renderTab('kino');};
  if($('#hAllGames'))$('#hAllGames').onclick=()=>{sfx('tap');renderTab('games');};
  $$('.hrow [data-show]').forEach(b=>b.onclick=()=>{haptic('medium');renderShow(b.dataset.show);});
  $$('.hrow [data-sc]').forEach(b=>b.onclick=()=>{haptic('medium');renderScene(b.dataset.sc);});
  if($('#gCards'))$('#gCards').onclick=()=>{haptic('medium');cgPick();};
  if($('#gSpy'))$('#gSpy').onclick=()=>{sfx('tap');renderTab('spy');};
  if($('#wDota'))$('#wDota').onclick=()=>{sfx('tap');renderDotaWorld();};
  if($('#wCS'))$('#wCS').onclick=()=>{sfx('tap');renderCSWorld();};
  if($('#best'))$('#best').onclick=()=>{haptic('medium');play('best','mode','words');};
}
function onBack(){
  if(document.querySelector('.dxo')){const d=document.querySelector('.dxo-dim');if(d)d.click();return;}   // 11.0: открытая карта словаря
  if(document.querySelector('.dfly')){document.querySelector('.dfly').click();return;}
  if(document.querySelector('.rwo')){document.querySelector('.rwo-dim').click();return;}   // 12.0: открытый кадр коллекции
  if(document.querySelector('.dx')&&!document.querySelector('.scn')&&dxUp())return;   // 11.5: словарь — уровень вверх
  if(screen==='pvp'){if(KV&&KV.over){const sid=KV.room.sid;KV=null;renderScene(sid);}else kvLeave();return;}
  if(screen==='sctask'){if(document.querySelector('.sc-pfs')){scExitFull();return;}renderScene(SCUR.id);return;}
  if(screen==='quiz'){exitQuiz();return;}
  if(screen==='ob'){if(OB&&OB.i>0){OB.i--;renderOB();}return;}
  if(screen==='dota'||screen==='cs'){sfx('tap');renderHome();return;}
  if(screen==='subtab'||screen==='cgpick'){sfx('tap');renderTab('games');return;}
  if(screen==='admin'){sfx('tap');renderTab('profile');return;}
  if(screen==='show'){sfx('tap');renderTab('kino');return;}
  if(screen==='scintro'){sfx('tap');renderTab('learn');return;}
  if(screen==='cards'){cgExitAsk();return;}
  if(screen==='cglobby'){if(CGO){cgNet({a:'leave',code:CGO.code}).catch(()=>{});cgStopOnline();}cgPick();return;}
  if(screen==='wiki'){sfx('tap');renderDotaWorld();return;}
  if((screen==='duel'||screen==='duelres')&&!store.onboarded){startOnboarding();return;}
  if(screen==='spyo'){spyLeaveTo('hub');return;}
  if(screen==='spyl'||screen==='spyset'){sfx('tap');renderSpyHub();return;}
  if(screen==='tourq'){renderTour(TOUR&&TOUR.L);return;}
  if(screen==='scene'){sfx('tap');renderTab('kino');return;}
  if(screen==='dircut'){SC_DIR=false;renderScene(SCUR.id);return;}
  if(document.querySelector('.sc-sheetwrap')){scCloseSheet();return;}
  if(document.querySelector('.sc-pfs')){scExitFull();return;}
  if(screen==='scep'&&navBack())return;
  if(screen==='scep'||screen==='scend'){renderScene(SCUR.id);return;}
  if(screen==='scq'){renderScEp(SCUR.id,SCUR.i);return;}
  if(screen==='tour'||screen==='tourdone'){tourExit();return;}
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
    MUS.addEventListener('loadedmetadata',musTick);MUS.addEventListener('error',()=>{if(!MUS||!MUS.getAttribute('src')||!MUSC)return;const L=musOf(scOf(MUSC.id));MUS._err=(MUS._err||0)+1;if(MUS._err<L.length){toast('Трек не найден — включаю следующий');musNext();}else{toast('Музыка этой сцены пока не загружена');const sid=MUSC.id;musStop();MUSOFF=sid;}});}
  clearInterval(MUSFADE);clearTimeout(MUSWAIT);MUSAUTO=false;MUSC={id,k};MUS.src=assetUrl(scKey(s,m.f));if(rnd)MUS.addEventListener('loadedmetadata',()=>{try{if(isFinite(MUS.duration)&&MUS.duration>40)MUS.currentTime=MUS.duration*(0.1+Math.random()*0.55);}catch(e){}},{once:true});   // 12.4: автостарт — со случайного места трека
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
  for(const w of (typeof WORDS!=='undefined'?WORDS:[]))I.push({k:'word',w,txt:srNorm([w.en,w.de,w.ru].join(' '))});
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
  const hl=x=>{let h=esc(x||'');if(word){const w=String(word).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');h=h.replace(new RegExp('(^|[^\\p{L}])('+w+')(?=[^\\p{L}]|$)','iu'),'$1<mark>$2</mark>');}return h;};
  const o=document.createElement('div');o.className='dxo momo';
  o.innerHTML=`<div class="dxo-dim"></div><div class="dxc" style="--c:${DX_TH[s.theme]||'#F5C451'}">
    <div class="dxv-w"><video class="dxv" playsinline webkit-playsinline preload="auto" poster="${assetUrl(scEpKey(s,pi,'jpg'))}"></video><button class="dxv-p" aria-label="Играть">${SI.play}</button></div>
    <div class="dxc-b"><div class="dxc-top"><span class="dxc-src">${esc(dictFilm(s))} · ${esc(s.sub||'')} · эп. ${pi+1}</span><button class="dxc-x" aria-label="Закрыть">${ui('close')}</button></div>
      <b class="ep-c-en mom-en">${hl(r[2])}</b><span class="ep-c-ru">${esc(String(r[3]||'').replace(/\n/g,' '))}</span>
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
  o.querySelectorAll('[data-v]').forEach(x=>x.onclick=()=>{sfx('tap');if(x.dataset.v==='ep'){close();setTimeout(()=>srOpen(sid,pi,t),200);return;}play(x.dataset.v==='slow');});}
// 12.1: откуда пришли в эпизод (словарь на своём уровне / поиск / вкладка) — «‹» и системная «назад» вернут туда же
let NAV_BACK=null;
function navHere(){if(document.querySelector('.dx')){const d=Object.assign({},DX),y=window.scrollY;return ()=>{Object.assign(DX,d);renderTab('dict');setTimeout(()=>window.scrollTo(0,y),30);};}
  if(screen==='search'){const q=($('#srq')||{}).value||'';return ()=>renderSearch(q);}
  if(screen==='home'){const t=store.tab;return ()=>renderTab(t);}return null;}
function navBack(){const f=NAV_BACK;NAV_BACK=null;if(!f)return false;sfx('tap');f();return true;}
// 12.1: слово/фраза → момент в эпизоде. Тот же эпизод уже открыт — только перемотка (без нового <video> и мигания);
// иначе эпизод открывается сразу с нужного места
function srOpen(id,i,t){const s=scOf(id);if(!s||!s.parts[i])return;const off=Math.max(0,t-s.parts[i].a-0.4);
  if(SV&&SCUR&&SCUR.id===id&&SCUR.i===i&&document.querySelector('.scn.scep')){try{SV.currentTime=off;scTick&&scTick();}catch(e){}const o=$('#scvo');if(o)o.style.display='none';const pr=SV.play();if(pr&&pr.catch)pr.catch(()=>{if(o)o.style.display='';});window.scrollTo({top:0,behavior:'smooth'});return;}
  const back=navHere();renderScEp(id,i,{free:true,at:off});if(!SV||SCUR.id!==id)return;NAV_BACK=back;}

document.addEventListener('visibilitychange',()=>{try{if(document.hidden){if(typeof AC!=='undefined'&&AC&&AC.suspend)AC.suspend();}else if(typeof AC!=='undefined'&&AC&&AC.resume)AC.resume();}catch(e){}});
/* ================= 7.2: Гаврик — маскот-хлопушка (пока виден только админу, для выбора) ================= */
// Свой персонаж (не чужой IP): киношная хлопушка с глазами. Не учит и не мешает: сидит в углу проверки,
// радуется верному ответу, пожимает плечами на ошибку (без насмешек), «рубит» выученную фразу,
// а законченный эпизод — «Снято!» штампом, в мешок или сжигает. Любая анимация ≤ 1,5 с и пропускается тапом.
const GAV_SVG=`<svg viewBox="0 0 80 84" class="gv-svg"><g class="gv-top"><rect x="8" y="10" width="64" height="14" rx="3" fill="#1b1b1f" stroke="#f3efe6" stroke-width="2"/>
  <path d="M14 10l8 14M28 10l8 14M42 10l8 14M56 10l8 14" stroke="#f3efe6" stroke-width="4"/></g>
  <rect x="8" y="26" width="64" height="40" rx="6" fill="#1b1b1f" stroke="#f3efe6" stroke-width="2"/>
  <g class="gv-eyes"><circle cx="30" cy="44" r="8" fill="#fff"/><circle cx="50" cy="44" r="8" fill="#fff"/><circle class="gv-p" cx="31" cy="45" r="3.6" fill="#111"/><circle class="gv-p" cx="51" cy="45" r="3.6" fill="#111"/></g>
  <path class="gv-mouth" d="M33 57q7 5 14 0" stroke="#F5C451" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <path d="M26 66v10M54 66v10" stroke="#f3efe6" stroke-width="4" stroke-linecap="round"/><path d="M20 77h12M48 77h12" stroke="#f3efe6" stroke-width="4" stroke-linecap="round"/></svg>`;
// Картинка маскота — img/bateman.png (без фона). Нет файла — подставляется хлопушка Гаврик.
const GAV_IMG='img/bateman.png';
const gavArt=()=>`<img class="gv-img" src="${GAV_IMG}" alt="" draggable="false" onerror="this.outerHTML=GAV_SVG">`;
const gavOn=()=>false;   // 12.5: Гаврик выпилен по ТЗ (функции остались пустыми, чтобы вызовы не падали)
let GAVSTREAK=0;
function gavEl(){let g=document.getElementById('gav');const head=document.querySelector('.scn .sc-head');if(!g){g=document.createElement('div');g.id='gav';g.innerHTML=gavArt();}if(head&&g.parentNode!==head)head.appendChild(g);else if(!head&&!g.parentNode)document.body.appendChild(g);return g;}
function gavIdle(){if(!gavOn()){const g=document.getElementById('gav');if(g)g.remove();return;}const g=gavEl();g.className='gv idle';}
function gavSceneOpen(title){/* 8.1: заставка при входе убрана — мешала начать */}
function gavGone(){if(window.MASCOT)window.MASCOT.remove();}
function gavSay(state){if(!gavOn())return;const g=gavEl();g.className='gv '+state;clearTimeout(g._t);g._t=setTimeout(()=>{g.className='gv idle';},1400);}
function gavReact(right){if(!gavOn())return;GAVSTREAK=right?GAVSTREAK+1:0;gavSay(!right?'wrong':GAVSTREAK>=3&&GAVSTREAK%3===0?'streak':'correct');}
// Постановочная реакция на выученную фразу: отдельное событие, а не просто UI-эффект.
function gavKill(text){return;if(!gavOn())return; if(window.MASCOT)window.MASCOT.play('learned',{text:text||''});}
// Финал эпизода: разные постановки. В будущем можно добавлять новые события/персонажей без переписывания app.js.
function gavEpisode(title,kind){return;if(!gavOn())return; const ev=kind==='bag'?'episodeBag':kind==='burn'?'episodeBurn':'sceneComplete'; if(window.MASCOT)window.MASCOT.play(ev,{title:title||'Эпизод',text:kind||''});}
/* ================= старт ================= */
let START='';
try{
  const u=new URLSearchParams(location.search);
  START=(TG&&TG.initDataUnsafe&&TG.initDataUnsafe.start_param)||u.get('tgWebAppStartParam')||u.get('startapp')||'';
  const q=u.get('lang')||START;
  if(q==='de'||q==='en')PARAM_LANG=q;
}catch(e){}
// 12.3: кто прошёл сцену до 12.3 — карточка сегмента и фон выдаются молча
try{SCENES.forEach(x=>{if(segDone(x)&&!segHas(x))segGive(x);showGive(x);});}catch(e){}
initTG();
applyFx();
loadLore();
const START_DUEL=parseDuel(START);
ensureTabbar();splash();
const START_SPY=/^spy_[A-Za-z0-9]{5}$/.test(START)?START.slice(4).toUpperCase():null;
// ссылки-приглашения: если раздел закрыт в админ-панели — главная и окно «Технические работы / В разработке»
const gateLink=(k,t)=>{const g=flagOf('games')!=='on'?'games':flagOf(k)!=='on'?k:null;if(!g)return false;if(store.onboarded)renderHome();else startOnboarding();if(flagOf(g)!=='hide')setTimeout(()=>showGate(g,t),700);return true;};
if(/^kv_[A-Za-z0-9]{5}$/.test(START)){if(flagOf('kino')!=='on'){if(store.onboarded)renderHome();else startOnboarding();}else kvJoin(START.slice(3).toUpperCase());}   // 11.0: дуэль по сцене
else if(START_SPY){if(!gateLink('spy','Шпион'))spyJoin(START_SPY);}
else if(START==='tour'){if(!gateLink('arena','Турнир недели'))renderTour();}
else if(START_DUEL){if(!gateLink('arena','Дуэль'))renderDuelIntro(START_DUEL);}
else if(/^cg_[A-Za-z0-9]{5}$/.test(START)){if(!gateLink('cards','Карточная дуэль'))cgJoin(START.slice(3).toUpperCase());}
else if(START==='cards'){if(!gateLink('cards','Карточная дуэль'))cgPick();}
else if(START==='rev'&&store.onboarded){renderHome();setTimeout(startRevChain,600);}
else if(START==='kino'&&store.onboarded){if(!gateLink('kino','Кинозал'))renderTab('kino');}
else if(store.onboarded)renderHome();else startOnboarding();
setTimeout(remindSync,3000);setTimeout(()=>ev('open'),1200);setTimeout(labApply,1500);setTimeout(labApply,4000);
