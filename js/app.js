/* ================= иконки ================= */
const ICONS=window.__DATA.ICONS;
const svg=n=>`<svg viewBox="0 0 48 48" aria-hidden="true">${ICONS[n]||ICONS.scroll}</svg>`;
const UI={
 gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
 close:'<path d="M6 6l12 12M18 6L6 18"/>',
 back:'<path d="M15 18l-6-6 6-6"/>',
 bulb:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z"/>',
 coin:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.5"/>',
 check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
 speaker:'<path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>'
};
const ui=n=>`<svg class="ui" viewBox="0 0 24 24" aria-hidden="true">${UI[n]}</svg>`;
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
 {n:'Рекрут',g:'Рекрута',at:0,m:1},{n:'Страж',g:'Стража',at:10,m:1.1},{n:'Рыцарь',g:'Рыцаря',at:25,m:1.2},{n:'Герой',g:'Героя',at:50,m:1.3},
 {n:'Легенда',g:'Легенды',at:80,m:1.4},{n:'Властелин',g:'Властелина',at:120,m:1.5},{n:'Божество',g:'Божества',at:170,m:1.75},{n:'Титан',g:'Титана',at:230,m:2}
];
const APP_LINK='https://t.me/languagegamesbot/languagedota2';
const CDN='https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/';
const portrait=k=>`${CDN}heroes/${k}.png`;

/* ================= хранилище ================= */
const KEY='dota_quiz_v4',OLD_KEY='dota_deutsch_v3',MKEY='dota_m_v1';
const fresh=()=>({v:5,onboarded:false,langs:['en'],roles:'all',gold:0,streak:0,lastDay:null,best:{},answered:0,correct:0,snd:true,fx:true,full:true,hideLearned:true,mistakes:[],duels:{},theme:'hud',tab:'learn',path:'mix',games:['dota','cs2'],auto:false,goal:20,ach:{}});
function migrate(o){
  const f=fresh();
  ['gold','streak','lastDay','answered','correct','snd','fx'].forEach(k=>{if(o[k]!==undefined)f[k]=o[k];});
  if(o.lang==='de'||o.lang==='en')f.langs=[o.lang];
  return f;
}
function normalize(s){
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
  if(f.subV!==2){f.subStyle='box';f.subV=2;}
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
function save(){
  const s=JSON.stringify(store);
  try{localStorage.setItem(KEY,s);}catch(e){}
  try{if(TG&&TG.CloudStorage)TG.CloudStorage.setItem(KEY,s,()=>{});}catch(e){}
}
function saveM(){
  const s=JSON.stringify(M);
  try{localStorage.setItem(MKEY,s);}catch(e){}
  if(!TG||!TG.CloudStorage)return;
  try{
    const parts=[];for(let i=0;i<s.length;i+=3800)parts.push(s.slice(i,i+3800));
    parts.forEach((p,i)=>TG.CloudStorage.setItem(MKEY+'_'+i,p,()=>{}));
    TG.CloudStorage.setItem(MKEY+'_n',String(parts.length),()=>{});
  }catch(e){}
}

/* ================= Telegram ================= */
const TG=(window.Telegram&&window.Telegram.WebApp&&window.Telegram.WebApp.platform&&window.Telegram.WebApp.platform!=='unknown')?window.Telegram.WebApp:null;
let screen='home',PARAM_LANG='';
const canFull=()=>!!(TG&&typeof TG.requestFullscreen==='function'&&TG.isVersionAtLeast&&TG.isVersionAtLeast('8.0')&&/^(android|ios)/.test(TG.platform||''));
function setInsets(){
  if(!TG)return;
  const r=document.documentElement.style,sa=TG.safeAreaInset||{},ca=TG.contentSafeAreaInset||{};
  ['top','bottom','left','right'].forEach(k=>{
    if(typeof sa[k]==='number')r.setProperty('--tg-safe-area-inset-'+k,sa[k]+'px');
    if(typeof ca[k]==='number')r.setProperty('--tg-content-safe-area-inset-'+k,ca[k]+'px');
  });
}
function applyFullscreen(){
  if(!canFull())return;
  try{if(store.full&&!TG.isFullscreen)TG.requestFullscreen();else if(!store.full&&TG.isFullscreen)TG.exitFullscreen();}catch(e){}
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
  try{if(TG.disableVerticalSwipes)TG.disableVerticalSwipes();}catch(e){}
  try{TG.setHeaderColor('#0E1318');TG.setBackgroundColor('#0E1318');if(TG.setBottomBarColor)TG.setBottomBarColor('#0E1318');}catch(e){}
  setInsets();
  ['safeAreaChanged','contentSafeAreaChanged','fullscreenChanged','viewportChanged'].forEach(ev=>{try{TG.onEvent(ev,setInsets);}catch(e){}});
  try{TG.BackButton.onClick(onBack);}catch(e){}
  applyFullscreen();
  cloudGet(KEY).then(v=>{
    let r=null;try{r=v&&JSON.parse(v);}catch(e){}
    if(r&&(r.answered||0)>(store.answered||0)){
      store=normalize(r);try{localStorage.setItem(KEY,JSON.stringify(store));}catch(e){}
      if(screen==='home'||(screen==='ob'&&store.onboarded&&OB&&OB.i===0))renderHome();
    }else if(!r&&!store.answered){
      cloudGet(OLD_KEY).then(o=>{try{o=o&&JSON.parse(o);}catch(e){o=null;}if(o&&(o.answered||0)>0&&!store.onboarded){store=migrate(o);save();}});
    }
  });
  cloudLoadM().then(c=>{
    if(!c)return;let changed=false;
    for(const k in c){if((c[k]||0)>(M[k]||0)){M[k]=c[k];changed=true;}}
    if(changed){try{localStorage.setItem(MKEY,JSON.stringify(M));}catch(e){}if(screen==='home')renderHome();}
  });
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
const SFX={
  tap:()=>osc('sine',1500,0,.035,.022,{to:1100}),
  sel:()=>{osc('sine',880,0,.07,.03);osc('sine',1320,.035,.08,.018);},
  whoosh:()=>noise(0,.16,.012,{type:'lowpass',f:500,fTo:2000,q:.4}),
  tick:()=>osc('sine',1046,0,.05,.02),
  good:()=>{osc('sine',784,0,.22,.065);osc('sine',1175,.07,.32,.055);osc('triangle',1568,.07,.26,.012);},
  learn:()=>{[784,988,1175,1568].forEach((f,i)=>osc('sine',f,i*.08,.36,.045));},
  nope:()=>osc('sine',300,0,.12,.035,{to:240}),
  bad:()=>{osc('sine',330,0,.26,.06,{to:196});osc('sine',247,.08,.3,.045,{to:165});},
  hint:()=>{osc('sine',1047,0,.1,.028);osc('sine',1319,.06,.14,.022);},
  match:()=>{osc('sine',880,0,.1,.035);osc('sine',1319,.05,.14,.03);},
  announce:(lvl)=>{const k=1+Math.min(lvl||2,6)*.06;[523,659,784].forEach((f,i)=>osc('triangle',f*k,i*.05,.45,.03,{att:.02}));},
  firstblood:()=>{osc('sine',392,0,.35,.05);osc('sine',523,.1,.45,.045);osc('sine',784,.2,.5,.035);},
  roshan:()=>{osc('sine',98,0,.7,.1,{att:.06});osc('triangle',196,.05,.6,.025,{att:.08,lp:900});},
  win:()=>{[523,659,784,1047].forEach((f,i)=>osc('sine',f,i*.11,.4,.055));osc('triangle',1047,.44,.6,.018);},
  lose:()=>{[440,392,330].forEach((f,i)=>osc('sine',f,i*.16,.4,.045));}
};
function sfx(n,arg){if(!store.snd)return;try{SFX[n](arg);}catch(e){}}

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
function mount(html,cls){const tab=/\btabscr\b/.test(cls||'');document.body.classList.toggle('tabs-on',tab);if(!tab)paintTabbar(null);app.innerHTML=`<div class="screen ${cls||''}">${html}</div>`;window.scrollTo(0,0);}
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
function distinct(list,card,n,label){
  const own=label(card),seen=new Set([own]),out=[];
  for(const o of shuffle(list)){if(o===card)continue;const l=label(o);if(!l||seen.has(l))continue;seen.add(l);out.push(o);if(out.length===n)break;}
  return out;
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
const KILLS=n=>n===2?'Double Kill':n===3?'Triple Kill':n===4?'Ultra Kill':n<=6?'Rampage':'Godlike';

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
    <div class="stage" style="margin:0 0 14px"><div class="pic" style="background-image:url('${portrait('legion_commander')}')"></div><div class="stage-t"><span class="hn">Один на один</span></div></div>
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
    <div class="cover"><div class="pic" style="background-image:url('${portrait('legion_commander')}')"></div></div>
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
function shareLink(link,text){
  const url=`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`;
  try{if(TG&&TG.openTelegramLink){TG.openTelegramLink(url);return;}}catch(e){}
  try{if(navigator.share){navigator.share({text:text+' '+link});return;}}catch(e){}
  try{navigator.clipboard.writeText(text+' '+link);toast('Ссылка скопирована');}catch(e){toast(link);}
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
        <div class="pic" style="background-image:url('${portrait('legion_commander')}')"></div>
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
function saveRV(){const s=JSON.stringify(RV);try{localStorage.setItem(RKEY,s);}catch(e){}cloudSaveChunked(RKEY,s);}
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
function countAnswer(){
  const d=dayStat();d.n++;
  const goal=store.goal||20;
  if(!d.done&&d.n>=goal){d.done=true;store.goalsDone=(store.goalsDone||0)+1;store.gold+=200;setTimeout(()=>{announce('Цель дня','learn');sfx('learn');toast('Цель дня выполнена: +200 золота');},900);}
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
            <div class="kind">${q.reask?'':''}${q.chip}${pts&&pts<LEARN_AT?pipsHTML(pts):''}${S.streak>=2?`<span class="streak">серия ${S.streak}</span>`:''}${q.roshan?'<span class="boss">Рошан, золото x2</span>':''}</div>
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
        <div class="row"><span>Игрок</span><span>Верно</span><span>Золото</span><span>Серия</span><span>Выучено</span></div>
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
    <p class="note" style="text-align:left">Ранг растёт за <b>выученные слова</b>. Слово становится выученным, когда ты ответил на него правильно 3 раза (ошибка отнимает одно очко). Чем выше ранг, тем больше золота за каждый правильный ответ.</p>
    <div class="rlist">${RANKS.map((r,i)=>`<div class="rrow${i===rk.i?' cur':''}${t.learned>=r.at?' got':''}"><span class="rn">${r.n}</span><span>от ${r.at} ${plural(r.at,['слова','слов','слов'])}</span><span>золото x${r.m}</span></div>`).join('')}</div>
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
  const opts=[['en',['en'],'Английский','Фильмы, сериалы и игры в оригинале'],['de',['de'],'Немецкий','Живой немецкий с артиклями и примерами']];
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
        <div class="feat frame">${iconHTML({svg:'target'})}<span><b>Игры</b><span>Dota 2 и CS 2: слова, которые видишь каждый матч</span></span></div>
        <div class="feat frame">${iconHTML({svg:'eye'})}<span><b>Фильмы и сериалы</b><span>сцены с субтитрами и разбором живых фраз</span></span></div>
        <div class="feat frame">${iconHTML({svg:'ally'})}<span><b>С друзьями</b><span>дуэли, «Шпион» и турнир недели</span></span></div>
      </div>
      <div class="cta"><button class="btn" id="obNext">Начать</button></div>`;
  else if(cur==='path')html=`${dots}<h1 class="title">Как хочешь учить?</h1><p class="lead" style="margin-top:8px">От этого зависит, что будет на главной. Остальное тоже останется доступно.</p>
      <div class="stack">${opt('p','games','Через игры','Слова и фразы из Dota 2 и CS 2',OB.path==='games')}${opt('p','kino','Через фильмы и сериалы','Сцены с субтитрами, живые фразы',OB.path==='kino')}${opt('p','mix','Всё понемногу','И игры, и кино',OB.path==='mix')}</div>
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
  screen='settings';backBtn(true);applyFx();
  let roles=store.roles==='all'?'all':store.roles.slice();
  const row=(k,n,d)=>`<button class="checkrow frame" data-t="${k}" aria-pressed="${!!store[k]}">${BOX}<span class="ct"><span class="cn">${n}</span>${d?`<span class="cd">${d}</span>`:''}</span></button>`;
  mount(`
    <div class="page-head"><button class="icon-btn" id="bBtn" aria-label="Назад">${ui('back')}</button><h1 class="title">Настройки</h1></div>

    <section class="set-sec"><h2>Обучение</h2>
      <div class="stack">${row('hideLearned','Убирать выученные слова',`Слово, на которое ты ${LEARN_AT} раза ответил правильно, больше не попадается в обычных играх. Оно вернётся в «Повторение» через 3, 7, 21 и 60 дней.`)}
      ${row('tts','Озвучка слов','Голос устройства читает слова и фразы. На некоторых телефонах звучит как робот, поэтому по умолчанию выключено.')}
      ${row('auto','Автопереход после верного ответа','Выключено: ты спокойно читаешь сноску и сам жмёшь «Дальше».')}</div>
      <p class="hint-line" style="margin-top:12px">Цель дня: сколько ответов в день</p>
      ${segCtl('goal',[['10','10'],['20','20'],['30','30']],String(store.goal||20))}
    </section>
    <section class="set-sec"><h2>Язык</h2>${langChoiceHTML(langsToChoice(store.langs))}</section>
    <section class="set-sec"><h2>Роли</h2>${rolesHTML(roles)}<p class="hint-line" id="roleHint">${roleHintText(roles)}</p></section>
    <section class="set-sec"><h2>Приложение</h2>
      <div class="stack">${row('snd','Звук','')}${row('fx','Анимации и эффекты','')}${canFull()?row('full','Полный экран',''):''}</div>
    </section>
    <section class="set-sec"><button class="btn dark" id="reset" style="color:#F4907A">Сбросить прогресс</button></section>`,'settings');
  $('#bBtn').onclick=()=>{sfx('tap');renderHome();};
  bindSeg('goal',v=>{store.goal=+v;save();sfx('sel');});
  bindLangChoice(v=>{store.langs=choiceToLangs(v);save();});
  bindRoles(()=>roles,v=>{roles=v;if(rolesOk(v)){store.roles=v==='all'?'all':v.slice();save();}},()=>{const h=$('#roleHint');h.classList.remove('warn');h.textContent=roleHintText(roles);});
  $$('.checkrow').forEach(b=>b.onclick=()=>{
    const k=b.dataset.t;store[k]=!store[k];save();b.setAttribute('aria-pressed',String(store[k]));sfx('sel');haptic('sel');
    if(k==='fx')applyFx();if(k==='full')applyFullscreen();
  });
  $('#reset').onclick=()=>{
    const doReset=()=>{const keep={snd:store.snd,fx:store.fx,full:store.full};store=Object.assign(fresh(),keep);M={};save();saveM();startOnboarding();};
    const txt='Сбросить золото, словарь и ошибки? Язык и роли тоже придётся выбрать заново.';
    if(TG&&TG.showConfirm){try{TG.showConfirm(txt,ok=>{if(ok)doReset();});return;}catch(e){}}
    if(window.confirm(txt))doReset();
  };
}

/* ================= вкладки, заставка, профиль ================= */
const TABS=[
 {id:'learn',name:'Учить',ico:'<path d="M4 19.5V5a2 2 0 0 1 2-2h14v16H6.5A2.5 2.5 0 0 0 4 21.5"/><path d="M8 7h8M8 11h6"/>'},
 {id:'kino',name:'Кинозал',ico:'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M7 3l3 3M14 3l-3 3"/><path d="M10 10.5v5l4-2.5z"/>'},
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
function renderTab(id){
  id=id||store.tab||'learn';
  if(!['learn','kino','games','profile','spy','arena'].includes(id))id='learn';
  const vis=TAB_PARENT[id]||id,sub=!!TAB_PARENT[id];
  const idx=TABS.findIndex(t=>t.id===vis),dir=idx>lastTabIdx?'fr':idx<lastTabIdx?'fl':'';lastTabIdx=idx;
  if(store.tab!==vis){store.tab=vis;save();}
  stopSpyAll();if(typeof stopTourTimer==='function')stopTourTimer();scStop();
  try{if(TG&&TG.disableClosingConfirmation)TG.disableClosingConfirmation();}catch(e){}
  screen=sub?'subtab':'home';backBtn(sub);applyFx();ensureTabbar();delete document.body.dataset.world;
  const gated=(vis==='kino'||vis==='games')&&flagOf(vis)!=='on'||(TAB_PARENT[id]&&flagOf(id)!=='on');
  let html=gated?`<h1 class="title anim">${TABS.find(t=>t.id===vis).name}</h1>`+gateHTML(TAB_PARENT[id]?id:vis):id==='learn'?learnTabHTML():id==='kino'?kinoTabHTML():id==='games'?gamesTabHTML():id==='spy'?spyTabHTML():id==='arena'?arenaTabHTML():profileTabHTML();
  if(sub)html=`<button class="crumb anim" id="crumb">${ui('back')}<span>Игры</span></button>`+html;
  mount(html,'tabscr '+dir);
  paintTabbar(vis);
  if(!gated)(id==='learn'?bindLearn:id==='kino'?bindKino:id==='games'?bindGames:id==='spy'?bindSpyTab:id==='arena'?bindArena:bindProfile)();
  applyFlagsUI();
  if(sub)$('#crumb').onclick=()=>{sfx('tap');renderTab('games');};
  $$('.tabscr .anim').forEach((el,i)=>el.style.animationDelay=Math.min(i,10)*55+'ms');
  if(id==='learn'||id==='profile')setTimeout(checkAch,400);
}
function renderHome(){renderTab(store.tab||'learn');}
function tgPhoto(){try{const u=TG&&TG.initDataUnsafe&&TG.initDataUnsafe.user;return u&&u.photo_url||'';}catch(e){return '';}}
function headHTML(){
  const name=userName()||'Игрок',rk=rankInfo(),photo=tgPhoto();
  return `<header class="thead anim"><div class="tava" style="background-image:url('${esc(photo||portrait(heroFor().hero))}')"></div>
    <div class="twho"><b>${esc(name)}</b><button class="rankchip" id="rankBtn">${rk.r.n} <i>?</i></button></div>
    <span class="gold">${ui('coin')}${fmt(store.gold)}</span><button class="icon-btn" id="setBtn" aria-label="Настройки">${ui('gear')}</button></header>`;
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
      <div class="gtxt"><b>${d.done?'Цель дня выполнена':'Цель дня'}</b><small>${d.done?'+200 золота уже у тебя':`Ещё ${goal-d.n} ${plural(goal-d.n,['ответ','ответа','ответов'])} до бонуса +200 золота`}</small></div>
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
    <div class="stage anim" style="margin:12px 0 14px"><div class="pic" style="background-image:url('${portrait('bounty_hunter')}')"></div><div class="stage-t"><span class="hn">Найди шпиона</span></div></div>
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
    <section class="play card anim" style="margin-top:12px"><div class="pic" style="background-image:url('${portrait('legion_commander')}')"></div>
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
 {id:'first',n:'Первая кровь',d:'Сыграй первую игру',ic:'items/tpscroll',t:s=>s.games>=1},
 {id:'goal',n:'Цель дня',d:'Выполни цель дня',ic:'items/hand_of_midas',t:s=>s.goalsDone>=1},
 {id:'w10',n:'Страж',d:'Выучи 10 слов',ic:'items/tome_of_knowledge',t:s=>s.learned>=10},
 {id:'w50',n:'Герой',d:'Выучи 50 слов',ic:'items/ultimate_scepter',t:s=>s.learned>=50},
 {id:'w120',n:'Властелин',d:'Выучи 120 слов',ic:'items/rapier',t:s=>s.learned>=120},
 {id:'w230',n:'Титан',d:'Выучи 230 слов',ic:'items/radiance',t:s=>s.learned>=230},
 {id:'rampage',n:'Rampage',d:'5 правильных ответов подряд',ic:'abilities/juggernaut_omni_slash',t:s=>s.bestStreak>=5},
 {id:'godlike',n:'Godlike',d:'10 из 10 в одной игре',ic:'items/black_king_bar',t:s=>s.perfect>=1},
 {id:'streak3',n:'Три дня',d:'Играй 3 дня подряд',ic:'items/bottle',t:s=>s.streak>=3},
 {id:'streak7',n:'Неделя',d:'Играй 7 дней подряд',ic:'items/cheese',t:s=>s.streak>=7},
 {id:'duel',n:'Дуэлянт',d:'Победи друга в дуэли',ic:'abilities/legion_commander_duel',t:s=>s.duelWins>=1},
 {id:'spy',n:'Агент',d:'Сыграй раунд «Шпиона»',ic:'abilities/bounty_hunter_track',t:s=>s.spyRounds>=1},
 {id:'tour',n:'Aegis',d:'Сыграй в турнире недели',ic:'items/aegis',t:s=>s.tourPlayed>=1},
 {id:'lore',n:'Хранитель лора',d:'Выучи 10 слов в лоре',ic:'items/gem',t:s=>s.loreLearned>=10},
 {id:'review',n:'Не забыл',d:'Пройди повторение слова',ic:'items/refresher',t:s=>s.reviews>=1}
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
  return `<section class="phead card anim"><div class="pava" style="background-image:url('${esc(photo||portrait(heroFor().hero))}')"></div>
      <b class="pn">${esc(name)}</b><button class="rankchip" id="rankBtn">${rk.r.n} <i>?</i></button>
      <span class="pbar"><i style="--w:${rk.pct}%"></i></span><small>${rk.nx?`До ранга ${rk.nx.n}: ${rk.n} из ${rk.nx.at} выученных слов`:'Высший ранг'}${rk.r.m>1?`. Золото x${rk.r.m}`:''}</small></section>
    <div class="stats card anim">${cell(t.learned,'выучено слов')}${cell(acc===null?'—':acc+'%','точность')}${cell(store.streak,'дней подряд')}${cell(fmt(store.gold),'золота')}${cell(store.answered,'ответов')}${cell(s.bestStreak,'лучшая серия')}</div>
    <h2 class="sec2 anim">Достижения <span>${got} из ${ACH.length}</span></h2>
    <div class="achs anim">${ACH.map(a=>`<button class="ach${store.ach[a.id]?' got':''}" data-a="${a.id}">${iconHTML({img:a.ic,svg:'trophy'})}<span>${esc(a.n)}</span></button>`).join('')}</div>
    <div class="links card anim">
      <button class="lrow2" id="dict">${iconHTML({svg:'book'},'sm')}<span><b>Словарь</b><small>изучаю ${t.going}, выучено ${t.learned}</small></span><span class="go">›</span></button>
      <button class="lrow2" id="rev2" ${due?'':'disabled'}>${iconHTML({img:'items/refresher',svg:'star'},'sm')}<span><b>Повторение</b><small>${due?`${due} ${plural(due,['слово ждёт','слова ждут','слов ждут'])}`:'пока нечего повторять'}</small></span><span class="go">›</span></button>
      <button class="lrow2" id="redo2" ${mis?'':'disabled'}>${iconHTML({svg:'flag'},'sm')}<span><b>Ошибки</b><small>${mis?`${mis} на разбор`:'пока нет'}</small></span><span class="go">›</span></button>
      <button class="lrow2" id="setBtn">${iconHTML({svg:'shield'},'sm')}<span><b>Настройки</b><small>язык, роли, оформление, звук</small></span><span class="go">›</span></button>
    </div>
    ${adm}
    <p class="foot">Версия 4.6</p>`;
}
function bindProfileAdmin(){const b=$('#admBtn');if(b)b.onclick=()=>{sfx('tap');renderAdmin();};}
function bindProfile(){bindProfileAdmin();
  bindHead();
  $('#dict').onclick=()=>{sfx('tap');renderDict('going');};
  if(dueList().length)$('#rev2').onclick=()=>{haptic('medium');startSession('review');};
  if(!$('#redo2').disabled)$('#redo2').onclick=()=>{haptic('medium');startSession('mistakes');};
  $$('.ach').forEach(b=>b.onclick=()=>{const a=ACH.find(x=>x.id===b.dataset.a);sfx('sel');toast(`${a.n}: ${a.d}${store.ach[a.id]?'. Получено':''}`);});
}

/* ---- заставка и отсчёт ---- */
function splash(){
  if(!store.fx)return;
  const d=document.createElement('div');d.className='splash';
  const title='ЯЗЫКИ'.split('').map((ch,i)=>`<span style="animation-delay:${520+i*45}ms">${ch===' '?'&nbsp;':ch}</span>`).join('');
  d.innerHTML=`<div class="sp-emb"><svg viewBox="0 0 120 120"><circle class="sp-r1" cx="60" cy="60" r="50"/><circle class="sp-r2" cx="60" cy="60" r="50"/><path class="sp-rune" d="M60 24 84 60 60 96 36 60Z"/><path class="sp-core" d="M60 44 70 60 60 76 50 60Z"/></svg></div><h1 class="sp-t">${title}</h1><p class="sp-s"><span class="lb">EN</span><span class="lb de">DE</span></p>`;
  document.body.appendChild(d);
  const end=()=>{if(d.classList.contains('out'))return;d.classList.add('out');setTimeout(()=>d.remove(),650);};
  d.onclick=end;setTimeout(end,2100);
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

function renderSpyHub(){renderTab('spy');}
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
function assetUrl(key){return ASSET_BASE+'/'+key;}
const scKey=(s,file)=>`scenes/${s.id}/${file}`;
const scEpKey=(s,i,ext)=>scKey(s,String(i+1).padStart(2,'0')+'.'+ext);
const SCENES=window.__DATA.SCENES;
SCENES.forEach(s=>s.parts.forEach((p,i)=>p.ph.forEach((f,j)=>{f.id=i+'_'+j;f.pi=i;})));
const SC_DAYS=[1,3,7,21];
const scDue=s=>{const r=scP(s.id).r||{},now=Date.now();return s.parts.flatMap(p=>p.ph).filter(f=>r[f.id]&&r[f.id][1]<=now);};
const SCK='dota_sc_v1';
let SC={};try{SC=JSON.parse(localStorage.getItem(SCK))||{};}catch(e){SC={};}
const scP=id=>{const p=SC[id]=SC[id]||{done:[],m:{},w:{}};p.r=p.r||{};return p;};
function scSave(){const s=JSON.stringify(SC);try{localStorage.setItem(SCK,s);}catch(e){}cloudSaveChunked(SCK,s);}
(function scCloud(){try{if(!TG||!TG.CloudStorage)return;TG.CloudStorage.getItem(SCK+'_n',(e,n)=>{n=+n;if(e||!n)return;const ks=[...Array(n).keys()].map(i=>SCK+'_'+i);
  TG.CloudStorage.getItems(ks,(e2,v)=>{if(e2||!v)return;try{const c=JSON.parse(ks.map(k=>v[k]||'').join(''));for(const id in c){const a=scP(id),b=c[id];a.done=[...new Set([...a.done,...(b.done||[])])];for(const k in b.m||{})a.m[k]=Math.max(a.m[k]||0,b.m[k]);Object.assign(a.w,b.w||{});}try{localStorage.setItem(SCK,JSON.stringify(SC));}catch(x){}}catch(x){}});});}catch(e){}})();
const scFmt=s=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
const scLearned=s=>s.parts.flatMap(p=>p.ph).filter(f=>(scP(s.id).m[f.id]||0)>=3).length;
const scTotal=s=>s.parts.reduce((a,p)=>a+p.ph.length,0);
let SCUR={id:null,i:0},SV=null,SW=null,SSTOP=null,SRATE=1,SSUBON=true,SRAF=0;
function scStop(){if(SV){try{SV.pause();}catch(e){}}SV=null;SW=null;SSTOP=null;delete document.body.dataset.scn;scExitFull();scCloseSheet();}
const scL=()=>store.langs[0]==='de'?'de':'en';
const scT=f=>scL()==='de'?f.de:f.en;                 // фраза на изучаемом языке
const scRowT=r=>scL()==='de'?r[4]:r[2];              // реплика на изучаемом языке
// субтитры: один язык — en (оригинал), de, ru или off
function scSub(){const v=store.scSub;return ['en','de','ru','off'].includes(v)?v:scL();}
const SUB_NAMES={en:'English',de:'Deutsch',ru:'Русские',off:'Без субтитров'},SUB_NOTE={en:'как в оригинале',de:'немецкий перевод',ru:'русский перевод',off:'только звук'};

function kinoTabHTML(){
  const de=store.langs[0]==='de';
  return `<h1 class="title anim">Кинозал</h1>
    <p class="lead anim" style="margin:4px 0 14px">Сцены из сериалов, фильмов и клипов: смотришь с субтитрами, разбираешь живые фразы, проверяешь себя.${de?' Видео на английском, субтитры и задания — по-немецки.':''}</p>
    <div class="kgrid">${SCENES.map(s=>{const L=scLearned(s),T=scTotal(s),d=scP(s.id).done.length;
      return `<button class="kposter ${s.theme} anim" data-sc="${s.id}"><span class="kp-img" style="background-image:url('${assetUrl(scKey(s,'cover.jpg'))}')"></span><span class="kp-grad"></span>
        <span class="kp-t"><em>${esc(s.ep)}</em><b>${esc(s.title)}</b><small>${s.parts.length} ${plural(s.parts.length,['эпизод','эпизода','эпизодов'])}${d?` · пройдено ${d}`:''}</small>
        <span class="kp-bar"><i style="width:${Math.round(L/T*100)}%"></i></span></span></button>`;}).join('')}
      <div class="kposter soon anim"><span class="kp-t"><em>Скоро</em><b>Новые сцены и клипы</b><small>Сериалы, фильмы и музыкальные клипы</small></span></div></div>`;
}
function bindKino(){$$('[data-sc]').forEach(b=>b.onclick=()=>{haptic('medium');sfx('tap');renderScene(b.dataset.sc);});}

/* ---- экраны сцены ---- */
const scOf=id=>SCENES.find(s=>s.id===id);
function scMount(s,html,scr){scStop();screen=scr;backBtn(true);document.body.dataset.scn=s.theme;mount(`<div class="scn ${s.theme}">${html}</div>`,'scnscr');}
function renderScene(id){
  const s=scOf(id),P=scP(id);SCUR={id,i:0};
  const n=s.parts.length,d=P.done.length,L=scLearned(s),T=scTotal(s),next=s.parts.findIndex((p,i)=>!P.done.includes(i));
  scMount(s,`
    <div class="sc-head"><button class="sc-back" id="scb">‹</button><span class="sc-meta">Сцены</span></div>
    <section class="sc-top sc-card">
      <div class="sc-meta">${esc(s.ep)}</div><h1>${esc(s.title)}</h1><div class="sc-sub">${esc(s.sub)}</div>
      <div class="sc-prog"><span>Выучено фраз</span><b>${L} / ${T}</b></div><div class="sc-bar"><i style="width:${Math.round(L/T*100)}%"></i></div>
      ${scDue(s).length?`<button class="sc-btn ghost" id="screv" style="margin-bottom:8px">Повторить фразы: ${scDue(s).length} →</button>`:''}
      <button class="sc-btn" id="scgo">${d===0?'Начать':next<0?'Повторить сцену':'Продолжить: эпизод '+String(next+1).padStart(2,'0')} →</button>
    </section>
    <div class="sc-sec"><h2>Эпизоды</h2><span>пройдено ${d} из ${n}</span></div>
    ${s.parts.map((p,i)=>`<button class="sc-ep sc-card${P.done.includes(i)?' done':''}${i===next?' cur':''}" data-i="${i}"><span class="n">${String(i+1).padStart(2,'0')}</span><span class="pic" style="background-image:url('${assetUrl(scEpKey(s,i,'jpg'))}')"></span><span class="t"><b>${esc(p.t)}</b><small>${scFmt(p.b-p.a)} · ${p.ph.filter(f=>(P.m[f.id]||0)>=3).length} из ${p.ph.length} фраз</small></span><span class="st">${P.done.includes(i)?'✓':''}</span></button>`).join('')}
    <p class="sc-foot">${s.subs.length} реплик с переводом</p>`,'scene');
  $('#scb').onclick=()=>{sfx('tap');renderTab('kino');};
  $('#scgo').onclick=()=>renderScEp(id,next<0?0:next);
  if($('#screv'))$('#screv').onclick=()=>renderScQuiz(id,'rev');
  $$('.sc-ep').forEach(b=>b.onclick=()=>renderScEp(id,+b.dataset.i));
}
function scVideo(el,s,p,noSubs){
  SSUBON=!noSubs;SW=el;el.dataset.ss=store.subStyle||'box';SV=document.createElement('video');
  const pi=s.parts.indexOf(p);SV.src=assetUrl(scEpKey(s,pi,'mp4'));SV.playsInline=true;SV.setAttribute('playsinline','');SV.preload='auto';SV.poster=assetUrl(scEpKey(s,pi,'jpg'));SV.playbackRate=SRATE;
  SV.volume=store.scVol==null?1:store.scVol;SV.muted=!!store.scMute;
  const loc=s.subs.filter(r=>r[1]>p.a&&r[0]<p.b).map(r=>[Math.max(0,r[0]-p.a),r[1]-p.a,r[2],r[3],r[4]]);
  const vt=x=>{const m=Math.floor(x/60),z=(x%60).toFixed(3).padStart(6,'0');return `00:${String(m).padStart(2,'0')}:${z}`;};
  const mk=f=>URL.createObjectURL(new Blob(['WEBVTT\n\n'+loc.map((r,i)=>`${i+1}\n${vt(r[0])} --> ${vt(r[1])}\n${f(r)}\n`).join('\n')],{type:'text/vtt'}));
  [['en',r=>r[2]],['ru',r=>r[3]],['de',r=>r[4]]].forEach(([k,f])=>{const t=document.createElement('track');t.kind='subtitles';t.label=k;t.srclang=k;t.src=mk(f);SV.appendChild(t);});
  el.appendChild(SV);
  const sb=document.createElement('div');sb.className='sc-subs';el.appendChild(sb);
  const fb=document.createElement('div');fb.className='sc-fs';
  fb.innerHTML=`<button data-f="pp" aria-label="Пауза">${SI.pause}</button><button data-f="b5" aria-label="Назад 5 секунд">${SI.back}</button>
    <span class="sc-ft">0:00</span><input type="range" class="sc-fsr" min="0" max="100" step="0.1" value="0" aria-label="Перемотка"><span class="sc-fd">0:00</span>
    <button data-f="mu" aria-label="Звук">${SV.muted?SI.mute:SI.vol}</button><input type="range" class="sc-vol" min="0" max="1" step="0.05" value="${SV.volume}" aria-label="Громкость">
    <button data-f="sp">${SRATE}x</button><button data-f="cc" aria-label="Субтитры">CC</button><button data-f="x" aria-label="Выйти из полного экрана">${SI.exit}</button>`;
  el.appendChild(fb);
  let idle=0;const wake=()=>{el.classList.remove('idle');clearTimeout(idle);idle=setTimeout(()=>{if(SV&&!SV.paused&&el.classList.contains('sc-pfs'))el.classList.add('idle');},3000);};
  el._wake=wake;el.addEventListener('pointermove',wake);
  fb.onclick=e=>{const b=e.target.closest('[data-f]');if(!b)return;e.stopPropagation();wake();const k=b.dataset.f;
    if(k==='pp')scPP();if(k==='b5')scB5();if(k==='sp'){scSpeed();b.textContent=SRATE+'x';}if(k==='mu')scMute();if(k==='cc')scSubSheet(false);if(k==='x')scExitFull();};
  const fr=fb.querySelector('.sc-fsr'),vr=fb.querySelector('.sc-vol');
  fr.oninput=e=>{e.stopPropagation();wake();if(SV){SV.currentTime=+fr.value;if(SSTOP&&+fr.value>SSTOP.b)SSTOP.b=SV.duration||SSTOP.b;scTick();}};
  vr.oninput=e=>{e.stopPropagation();wake();if(SV){SV.volume=+vr.value;SV.muted=+vr.value===0;store.scVol=SV.volume;store.scMute=SV.muted;save();scSyncVol();}};
  [fr,vr].forEach(x=>x.onclick=e=>e.stopPropagation());
  // касание по видео: во весь экран сначала показывает панель, потом ставит на паузу
  SV.onclick=()=>{if(el.classList.contains('sc-pfs')&&el.classList.contains('idle')){wake();return;}wake();scPP();};
  SV.addEventListener('error',()=>{if(!el.querySelector('.sc-err'))el.insertAdjacentHTML('beforeend','<div class="sc-err">Видео не загрузилось. Проверь интернет или что репозиторий scenes опубликован.</div>');});
  SV.addEventListener('loadedmetadata',()=>{if(isFinite(SV.duration)){fr.max=SV.duration;fb.querySelector('.sc-fd').textContent=scFmt(SV.duration);}});
  SV.addEventListener('timeupdate',()=>{
    if(SSTOP&&SV.currentTime>=SSTOP.b){SV.pause();const x=SSTOP;SSTOP=null;if(x.cb)x.cb();}
    if(document.activeElement!==fr)fr.value=SV.currentTime;fb.querySelector('.sc-ft').textContent=scFmt(SV.currentTime);});
  SV.addEventListener('play',()=>{scSync();wake();if(!SRAF)SRAF=requestAnimationFrame(scTick);});
  SV.addEventListener('pause',()=>{scSync();el.classList.remove('idle');});
  SV.addEventListener('seeked',scTick);
  SV.addEventListener('webkitbeginfullscreen',()=>{for(const t of SV.textTracks)t.mode=(SSUBON&&t.label===scSub())?'showing':'hidden';});
  SV.addEventListener('webkitendfullscreen',()=>{for(const t of SV.textTracks)t.mode='hidden';});
  setTimeout(()=>{if(SV)for(const t of SV.textTracks)t.mode='hidden';},0);
  SV._loc=loc;
}
function scTick(){
  const box=SW&&SW.querySelector('.sc-subs');if(!SV||!box){SRAF=0;return;}
  const t=SV.currentTime,m=scSub(),r=SSUBON&&m!=='off'?SV._loc.find(x=>t>=x[0]&&t<=x[1]+0.25):null,id=r?r[0]+m:'';
  if(box.dataset.id!==id){box.dataset.id=id;box.innerHTML=r?`<div class="sline"><span class="en">${esc(r[{en:2,ru:3,de:4}[m]]).replace(/\n/g,' ')}</span></div>`:'';SW.classList.toggle('has-sub',!!r);}
  SRAF=SV.paused?0:requestAnimationFrame(scTick);
}
function scPlay(a,b,cb){if(!SV)return;SSTOP={a,b,cb};SV.playbackRate=SRATE;try{SV.currentTime=a;}catch(e){}const pr=SV.play();if(pr&&pr.catch)pr.catch(()=>toast('Нажми ещё раз, чтобы запустить видео'));}
function scPP(){if(!SV)return;if(SSTOP===null&&SV.paused){const g=$('#scag');if(g)g.click();return;}if(SV.paused)SV.play();else SV.pause();}
function scB5(){if(SV){SV.currentTime=Math.max(0,SV.currentTime-5);scTick();}}
function scSpeed(){SRATE=SRATE===1?.75:SRATE===.75?.5:1;if(SV)SV.playbackRate=SRATE;const b=$('#scsp');if(b){b.textContent=SRATE+'x';b.classList.toggle('on',SRATE!==1);}const f=SW&&SW.querySelector('[data-f=sp]');if(f)f.textContent=SRATE+'x';}
function scMute(){if(!SV)return;SV.muted=!SV.muted;if(!SV.muted&&SV.volume===0)SV.volume=.8;store.scMute=SV.muted;store.scVol=SV.volume;save();scSyncVol();}
function scSyncVol(){const ic=SV&&SV.muted?SI.mute:SI.vol;const a=$('#scmu');if(a)a.innerHTML=ic;const f=SW&&SW.querySelector('[data-f=mu]');if(f)f.innerHTML=ic;const v=SW&&SW.querySelector('.sc-vol');if(v&&SV)v.value=SV.muted?0:SV.volume;}
function scSync(){const on=SV&&!SV.paused;const p=$('#scpp');if(p)p.innerHTML=on?SI.pause:SI.play;const f=SW&&SW.querySelector('[data-f=pp]');if(f)f.innerHTML=on?SI.pause:SI.play;}
// свой полноэкранный режим: видео на весь экран Telegram, кнопки всегда можно вызвать касанием
function scFull(){if(!SW)return;if(SW.classList.contains('sc-pfs')){scExitFull();return;}
  SW.classList.add('sc-pfs');document.body.classList.add('sc-pfs-on');
  try{if(TG&&TG.requestFullscreen&&TG.isVersionAtLeast&&TG.isVersionAtLeast('8.0'))TG.requestFullscreen();}catch(e){}
  try{if(screen.orientation&&screen.orientation.lock)screen.orientation.lock('landscape').catch(()=>{});}catch(e){}
  if(SW._wake)SW._wake();haptic('sel');}
function scExitFull(){const w=document.querySelector('.sc-pfs');if(w)w.classList.remove('sc-pfs','idle');document.body.classList.remove('sc-pfs-on');
  try{if(TG&&TG.exitFullscreen&&TG.isFullscreen)TG.exitFullscreen();}catch(e){}
  try{if(screen.orientation&&screen.orientation.unlock)screen.orientation.unlock();}catch(e){}}
// выбор субтитров: один язык и стиль, при первом входе в сцену открывается сам
function scCloseSheet(){const x=document.querySelector('.sc-sheetwrap');if(x)x.remove();}
function scSubSheet(first){
  scCloseSheet();const langs=scL()==='de'?['de','en','ru','off']:['en','ru','de','off'];
  const w=document.createElement('div');w.className='sc-sheetwrap';
  w.innerHTML=`<div class="sc-sheet"><b>${first?'Какие субтитры включить?':'Субтитры'}</b>
    <div class="sc-opts2">${langs.map(k=>`<button data-sl="${k}" class="${scSub()===k?'on':''}"><span>${SUB_NAMES[k]}</span><small>${SUB_NOTE[k]}</small></button>`).join('')}</div>
    <b class="sc-st">Вид субтитров</b>
    <div class="sc-chips">${[['box','Как на YouTube'],['cinema','Кино'],['yellow','Жёлтые'],['big','Крупные']].map(([k,l])=>`<button data-st="${k}" class="${(store.subStyle||'box')===k?'on':''}">${l}</button>`).join('')}</div>
    <button class="sc-btn" data-close>Готово</button></div>`;
  (SW&&SW.classList.contains('sc-pfs')?SW:(document.querySelector('.scn')||document.body)).appendChild(w);
  w.onclick=e=>{const b=e.target.closest('button');if(e.target===w||(b&&b.hasAttribute('data-close'))){store.scSubChosen=true;save();scCloseSheet();return;}
    if(b&&b.dataset.sl){store.scSub=b.dataset.sl;store.scSubChosen=true;save();w.querySelectorAll('[data-sl]').forEach(x=>x.classList.toggle('on',x===b));const f=$('#sccc');if(f)f.textContent=scSub()==='off'?'CC':scSub().toUpperCase();if(SW){const bx=SW.querySelector('.sc-subs');if(bx)bx.dataset.id='x';}scTick();}
    if(b&&b.dataset.st){store.subStyle=b.dataset.st;save();w.querySelectorAll('[data-st]').forEach(x=>x.classList.toggle('on',x===b));if(SW)SW.dataset.ss=store.subStyle;}};
}
const SI={play:'<svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/></svg>',pause:'<svg viewBox="0 0 24 24"><rect x="6.5" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none"/><rect x="13.5" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none"/></svg>',again:'<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v5h5"/></svg>',back:'<svg viewBox="0 0 24 24"><path d="M11 7 6 12l5 5"/><path d="M18 7l-5 5 5 5"/></svg>',full:'<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',exit:'<svg viewBox="0 0 24 24"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>',
  vol:'<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" stroke="none"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>',mute:'<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" stroke="none"/><path d="M17 9l5 6M22 9l-5 6"/></svg>'};
const scCtrl=()=>`<div class="sc-ctrl"><button id="scpp" aria-label="Пауза">${SI.play}</button><button id="scag" aria-label="Сначала">${SI.again}</button><button id="scb5" aria-label="Назад 5 секунд">${SI.back}<small>5 с</small></button><button id="scsp"${SRATE!==1?' class="on"':''}>${SRATE}x</button><button id="scmu" aria-label="Звук">${store.scMute?SI.mute:SI.vol}</button><button id="sccc" aria-label="Субтитры">${scSub()==='off'?'CC':scSub().toUpperCase()}</button><button id="scfu" aria-label="На весь экран">${SI.full}</button></div>`;
function scBindCtrl(run){$('#scpp').onclick=scPP;$('#scag').onclick=run;$('#scb5').onclick=scB5;$('#scsp').onclick=scSpeed;$('#scmu').onclick=scMute;$('#sccc').onclick=()=>scSubSheet(false);$('#scfu').onclick=scFull;}
const scSeek=()=>`<div class="sc-seek"><span id="sct0">0:00</span><input type="range" id="scsk" min="0" max="100" step="0.1" value="0" aria-label="Перемотка"><span id="sct1">0:00</span></div>`;
function scBindSeek(){const r=$('#scsk');if(!r||!SV)return;
  const setMax=()=>{if(SV&&isFinite(SV.duration)){r.max=SV.duration;$('#sct1').textContent=scFmt(SV.duration);}};SV.addEventListener('loadedmetadata',setMax);setMax();
  r.oninput=()=>{if(!SV)return;SV.currentTime=+r.value;if(SSTOP&&+r.value>SSTOP.b)SSTOP.b=SV.duration||SSTOP.b;$('#sct0').textContent=scFmt(+r.value);scTick();};
  SV.addEventListener('timeupdate',()=>{if(document.activeElement!==r){r.value=SV.currentTime;}const t=$('#sct0');if(t)t.textContent=scFmt(SV.currentTime);});}
const scPips=n=>`<span class="sc-pips">${[0,1,2].map(i=>`<i class="${i<n?'on':''}"></i>`).join('')}</span>`;
const scCard=(f,P)=>`<div class="sc-ph sc-card"><div class="en">${esc(scT(f))}</div>${scL()==='de'?`<div class="orig">в оригинале: ${esc(f.en)}</div>`:''}<div class="ru">${esc(f.ru)}</div><div class="row"><button class="sc-mom" data-id="${f.id}">▶ Момент</button>${scPips(Math.min(3,P.m[f.id]||0))}</div></div>`;
function renderScEp(id,i){
  const s=scOf(id),p=s.parts[i],P=scP(id),watched=P.done.includes(i)||P.w[i];SCUR={id,i};
  scMount(s,`
    <div class="sc-head"><button class="sc-back" id="scb">‹</button><div><span class="sc-meta">${esc(s.title)} · эпизод ${String(i+1).padStart(2,'0')}</span><h1>${esc(p.t)}</h1></div></div>
    <div class="sc-v" id="scvw"><div class="sc-over" id="scvo"><button id="scplay" aria-label="Смотреть">▶</button></div></div>
    ${scSeek()}
    ${scCtrl()}
    <div class="sc-sec"><h2>Фразы эпизода</h2><span>${p.ph.length}</span></div>
    <div id="scphs">${watched?p.ph.map(f=>scCard(f,P)).join(''):'<div class="sc-lock sc-card">Сначала посмотри эпизод. Фразы откроются после просмотра.</div>'}</div>
    <button class="sc-btn" id="scq" ${watched?'':'disabled'} style="margin-top:12px">Проверить себя →</button>
    <div class="sc-sec"><h2>Все реплики</h2><span>с переводом</span></div>
    <div class="sc-lines sc-card">${s.subs.filter(r=>r[0]>=p.a-0.3&&r[0]<p.b).map(r=>`<div class="ln"><b>${esc(scRowT(r))}</b><span>${esc(r[3]).replace(/\n/g,' ')}</span></div>`).join('')}</div>`,'scep');
  scVideo($('#scvw'),s,p);$('#scvw').appendChild($('#scvo'));
  const opened=()=>{P.w[i]=1;scSave();$('#scphs').innerHTML=p.ph.map(f=>scCard(f,P)).join('');bindMom();$('#scq').disabled=false;};
  const run=()=>{$('#scvo').style.display='none';scPlay(0,p.b-p.a+1,()=>{$('#scvo').style.display='';opened();});};
  $('#scplay').onclick=run;scBindCtrl(run);scBindSeek();
  if(!store.scSubChosen)setTimeout(()=>scSubSheet(true),250);
  SV.addEventListener('ended',()=>{$('#scvo').style.display='';opened();});
  $('#scb').onclick=()=>{sfx('tap');renderScene(id);};$('#scq').onclick=()=>renderScQuiz(id,i);
  function bindMom(){$$('.sc-mom').forEach(b=>b.onclick=()=>{const f=p.ph.find(x=>x.id===b.dataset.id);$('#scvo').style.display='none';window.scrollTo({top:0,behavior:'smooth'});scPlay(f.a-p.a,f.b-p.a,()=>{$('#scvo').style.display='';});});}
  bindMom();
}
function renderScQuiz(id,i){
  const s=scOf(id),rev=i==='rev',P=scP(id),all=s.parts.flatMap(x=>x.ph),de=scL()==='de',types=shuffle(de?['listen','mean','en2de','ru2en']:['listen','mean','gap','ru2en']);
  const list=rev?shuffle(scDue(s)).slice(0,10):s.parts[i].ph;
  const Q=shuffle(list).map((f,k)=>({f,type:types[k%4]})),need=Math.ceil(Q.length*0.7);let n=0,ok=0;
  const others=f=>shuffle(all.filter(x=>x!==f));
  function show(){
    const {f,type}=Q[n];let title='',ask='',opts=[],correct='',ipa='';
    if(type==='listen'){ask='Послушай момент';title=de?'Как это сказать по-немецки?':'Что здесь сказали?';opts=shuffle([f,...others(f).slice(0,3)]).map(scT);correct=scT(f);}
    if(type==='en2de'){ask='В оригинале';title=esc(f.en)+'<br><small class="qsm">Как это по-немецки?</small>';opts=shuffle([f,...others(f).slice(0,3)]).map(x=>x.de);correct=f.de;}
    if(type==='mean'){ask='Что это значит?';title=esc(scT(f));opts=shuffle([f,...others(f).slice(0,3)]).map(x=>x.ru);correct=f.ru;}
    if(type==='ru2en'){ask=de?'Как это по-немецки?':'Как это по-английски?';title=esc(f.ru);opts=shuffle([f,...others(f).slice(0,3)]).map(scT);correct=scT(f);}
    if(type==='gap'){ask='Какое слово пропущено?';title=esc(f.en).replace(new RegExp('\\b'+f.gap+'\\b'),'<span class="gap">&nbsp;</span>');
      const cap=/^[A-Z]/.test(f.gap),pool=[...new Set(others(f).map(x=>x.gap).filter(g=>g.toLowerCase()!==f.gap.toLowerCase()))].slice(0,3);
      opts=shuffle([f.gap,...pool.map(g=>cap?g[0].toUpperCase()+g.slice(1):g[0].toLowerCase()+g.slice(1))]);correct=f.gap;}
    const p=s.parts[f.pi];
    scMount(s,`
      <div class="sc-head"><button class="sc-back" id="scb">×</button><div class="sc-segs">${Q.map((q,k)=>`<i class="${k<n?(q.res?'ok':'bad'):k===n?'cur':''}"></i>`).join('')}</div></div>
      ${type==='listen'?`<div class="sc-v" id="scvw"><div class="sc-over" id="scvo"><button id="scplay">▶</button></div></div>${scCtrl()}`:''}
      <div class="sc-q sc-card"><div class="sc-meta">${ask}</div><h2>${title}</h2>
        <div class="sc-opts">${opts.map(o=>`<button class="sc-opt" data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div><div id="scfb"></div></div>`,'scq');
    $('#scb').onclick=()=>rev?renderScene(id):renderScEp(id,i);
    if(type==='listen'){scVideo($('#scvw'),s,p,true);$('#scvw').appendChild($('#scvo'));
      const run=()=>{$('#scvo').style.display='none';scPlay(f.a-p.a,f.b-p.a,()=>{$('#scvo').style.display='';});};$('#scplay').onclick=run;scBindCtrl(run);}
    $$('.sc-opt').forEach(b=>b.onclick=()=>{
      if(Q[n].res!==undefined)return;
      const right=b.dataset.v===correct;Q[n].res=right;if(right)ok++;
      const before=P.m[f.id]||0;P.m[f.id]=Math.max(0,Math.min(3,before+(right?1:-1)));
      if(rev){if(right){const st=((P.r[f.id]||[0])[0])+1;if(st>=SC_DAYS.length)delete P.r[f.id];else P.r[f.id]=[st,Date.now()+SC_DAYS[st]*864e5];}else{delete P.r[f.id];P.m[f.id]=2;}}
      else if(P.m[f.id]>=3&&before<3&&!P.r[f.id])P.r[f.id]=[0,Date.now()+SC_DAYS[0]*864e5];
      scSave();
      sfx(right?'good':'bad');haptic(right?'ok':'err');
      $$('.sc-opt').forEach(x=>{x.disabled=true;if(x.dataset.v===correct)x.classList.add('right');else if(x===b)x.classList.add('wrong');else x.classList.add('dim');});
      $('#scfb').innerHTML=`<div class="sc-fb ${right?'ok':'bad'}"><div class="t">${right?'Верно':'Неверно'}</div><div class="en">${esc(scT(f))}</div>${de?`<div class="orig">в оригинале: ${esc(f.en)}</div>`:''}<div class="ru">${esc(f.ru)}</div><button class="sc-btn" id="scnx" style="margin-top:12px">${n===Q.length-1?'Итоги':'Дальше'} →</button></div>`;
      $('#scnx').onclick=()=>{n++;if(n<Q.length)show();else end();};
    });
  }
  function end(){
    const pass=ok>=need;if(!rev&&pass&&!P.done.includes(i)){P.done.push(i);scSave();}
    const nx=!rev&&i+1<s.parts.length?i+1:null;
    scMount(s,`<div class="sc-q sc-card" style="text-align:center"><div class="sc-meta">${rev?'Повторение':'Эпизод '+String(i+1).padStart(2,'0')}</div><div class="sc-big">${ok} из ${Q.length}</div>
      <p class="sc-sub">${pass?'Эпизод пройден, прогресс сохранён.':'Нужно хотя бы '+need+' из '+Q.length+'. Пересмотри эпизод и попробуй ещё раз.'}</p>
      <div class="sc-btns">${pass&&nx!==null?'<button class="sc-btn" id="scnp">Следующий эпизод →</button>':''}${rev?'':`<button class="sc-btn ghost" id="scrp">${pass?'Пересмотреть':'Смотреть ещё раз'}</button>`}</div></div>
      <div class="sc-sec"><h2>Когда и зачем это говорить</h2><span>${list.length} фраз</span></div>
      ${list.map(f=>`<div class="sc-use sc-card"><div class="en">${esc(scT(f))}</div>${de?`<div class="orig">в оригинале: ${esc(f.en)}</div>`:''}<div class="ru">${esc(f.ru)}</div><div class="note">${esc(f.note)}</div></div>`).join('')}
      <button class="sc-btn ghost" id="schm" style="margin-top:6px">Ко всем эпизодам</button>`,'scend');
    sfx(pass?'win':'lose');
    if($('#scnp'))$('#scnp').onclick=()=>renderScEp(id,nx);if($('#scrp'))$('#scrp').onclick=()=>renderScEp(id,i);$('#schm').onclick=()=>renderScene(id);
  }
  show();
}
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
    return `<button class="kcard ${s.theme} anim" data-sc="${s.id}"><span class="kpic" style="background-image:url('${assetUrl(scKey(s,'cover.jpg'))}')"></span>
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
      <div class="gtxt"><b>${d.done?'Цель дня выполнена':'Цель дня'}</b><small>${d.done?'+200 золота уже у тебя':`Ещё ${goal-d.n} ${plural(goal-d.n,['ответ','ответа','ответов'])} до бонуса`}</small></div>
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
      <span class="gc-vs"><span class="cg-mono bm">PB</span><i>VS</i><span class="cg-mono dm">TD</span></span>
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
  b_secr:{side:'bateman',name:'Секретарша',en:'secretary',de:'die Sekretärin',ru:'секретарша',ico:'phone',cost:2,type:'m',atk:1,hp:4,kw:['taunt'],text:'Провокация'},
  b_analyst:{side:'bateman',name:'Аналитик',en:'analyst',de:'der Analyst',ru:'аналитик',ico:'chart',cost:3,type:'m',atk:2,hp:3,bc:{k:'draw',n:1},text:'При розыгрыше: возьми карту'},
  b_broker:{side:'bateman',name:'Брокер',en:'broker',de:'der Makler',ru:'брокер',ico:'case',cost:3,type:'m',atk:3,hp:3,text:''},
  b_rival:{side:'bateman',name:'Соперник',en:'rival',de:'der Rivale',ru:'соперник',ico:'tie',cost:4,type:'m',atk:4,hp:5,text:''},
  b_suit:{side:'bateman',name:'Костюм',en:'suit',de:'der Anzug',ru:'костюм',ico:'suit',cost:2,type:'s',fx:{k:'buff',a:2,h:2,t:'ally'},text:'Своему существу +2/+2'},
  b_deal:{side:'bateman',name:'Сделка',en:'deal',de:'das Geschäft',ru:'сделка',ico:'handshake',cost:4,type:'s',fx:{k:'aoe',n:2,t:'enemies'},text:'2 урона всем вражеским существам'},
  b_patrick:{side:'bateman',name:'Патрик Бейтман',en:'businessman',de:'der Geschäftsmann',ru:'бизнесмен',ico:'case',cost:5,type:'m',atk:4,hp:5,legend:true,evo:{need:2,into:'b_axe'},text:'Легендарная. После 2 убийств — эволюция'},
  b_axe:{side:'bateman',name:'Бейтман с топором',en:'axe',de:'die Axt',ru:'топор',ico:'axe',cost:5,type:'m',atk:6,hp:7,legend:true,token:true,text:'Раскопка: 3 верхние карты врага — 1 себе, 2 уничтожить'},
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
  d_tok:{side:'durden',name:'Боец клуба',en:'member',de:'das Mitglied',ru:'участник',ico:'house',cost:1,type:'m',atk:2,hp:1,token:true,text:''}
};
const CG_HEROES={
  bateman:{name:'Патрик Бейтман',short:'Бейтман',sub:'Уолл-стрит',mono:'PB',power:{name:'Уход за собой',text:'Вылечи своему герою 3 здоровья',k:'selfheal',n:3}},
  durden:{name:'Тайлер Дёрден',short:'Дёрден',sub:'Бумажная улица',mono:'TD',power:{name:'Удар с правой',text:'1 урон любой цели',k:'dmg',n:1}}
};
const CG_DECKS={bateman:['b_card','b_res','b_mirror','b_secr','b_analyst','b_broker','b_rival','b_suit','b_deal','b_vp'],durden:['d_soap','d_punch','d_rule','d_recruit','d_fighter','d_base','d_insom','d_mech','d_mayhem','d_leader']};
const CG_LEGENDS={bateman:['b_patrick']};
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
  if(who==='ai'&&!CG.over)cgBanner('Ход соперника',()=>cgAiTurn());
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
  side.mana-=c.cost;side.hand.splice(i,1);
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
  await cgDiscover(side);
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
function cgEndTurn(){if(CG.turn!=='me'||CG.busy||CG.over)return;CG.sel=null;CG.target=null;haptic('medium');cgTurnStart('ai');}
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
  const leave=()=>{CG=null;delete document.body.dataset.world;renderTab('games');};
  if(!CG||CG.over)return leave();
  if(typeof tgConfirm==='function')tgConfirm('Выйти из партии? Прогресс этой игры пропадёт.',ok=>{if(ok)leave();});else leave();
}
function cgEnd(){
  if(!CG)return;const res=CG.over;const st=store.cg=store.cg||{games:0,wins:0};st.games++;if(res==='win'){st.wins++;store.gold+=100;}save();
  sfx(res==='win'?'win':'lose');
  const words=CG.learned;
  const r=document.querySelector('.cg');if(!r)return;
  const d=document.createElement('div');d.className='cg-over '+res;
  d.innerHTML=`<div class="cg-obox"><small>${CG_HEROES[CG.me.hero].name} против ${CG_HEROES[CG.ai.hero].name}</small><h2>${res==='win'?'Победа':res==='lose'?'Поражение':'Ничья'}</h2>
    ${res==='win'?'<p class="cg-gold">+100 золота</p>':''}
    ${words.length?`<div class="cg-words"><b>Слова этой партии</b>${words.map(w=>`<span class="${w.ok?'ok':'bad'}">${esc(store.langs[0]==='de'?w.de:w.en)} — ${esc(w.ru)}</span>`).join('')}</div>`:''}
    <div class="cg-obtns"><button class="btn" id="cgagain">Ещё партия</button><button class="btn ghost" id="cgback">К играм</button></div></div>`;
  r.appendChild(d);
  $('#cgagain').onclick=()=>cgPick();$('#cgback').onclick=()=>{CG=null;delete document.body.dataset.world;renderTab('games');};
}
/* ---- выбор героя ---- */
function cgPick(){
  CG=null;screen='cgpick';backBtn(true);scStop();document.body.dataset.world='cards';
  const st=store.cg||{games:0,wins:0};
  mount(`<div class="cgp"><div class="page-head"><button class="icon-btn" id="cgpb" aria-label="Назад">${ui('back')}</button><h1 class="title">Карточная дуэль</h1></div>
    <p class="lead">Колоды, мана и существа, как в Hearthstone. Разыгрываешь карту — переводишь слово с неё. Верно — карта получает +1.</p>
    <div class="cgp-vs">
      <button class="cgp-hero bateman" data-pick="bateman"><span class="cg-mono">PB</span><b>Патрик Бейтман</b><small>Уолл-стрит. Контроль: провокация, усиления, «Сделка» по всему столу.</small><em>Способность: вылечить 3</em></button>
      <span class="cgp-x">VS</span>
      <button class="cgp-hero durden" data-pick="durden"><span class="cg-mono">TD</span><b>Тайлер Дёрден</b><small>Бумажная улица. Агрессия: рывок, бойцы из подвала, «Хаос».</small><em>Способность: 1 урон</em></button>
    </div>
    <label class="cgp-opt"><input type="checkbox" id="cgw" ${store.cgWords!==false?'checked':''}> Переводить слова с карт</label>
    <details class="cgp-how"><summary>Как играть</summary><p>У каждого 30 здоровья. Каждый ход мана растёт на 1 (до 10). Нажми карту в руке, чтобы разыграть. Существо атакует со следующего хода (кроме «Рывка»): нажми своё существо, потом цель. Существа с «Провокацией» надо убить первыми. Способность героя стоит 2 маны, раз в ход. Побеждает тот, кто первым обнулит здоровье соперника.</p></details>
    ${st.games?`<p class="foot">Сыграно ${st.games}, побед ${st.wins}</p>`:''}</div>`,'cgscr');
  $('#cgpb').onclick=()=>{delete document.body.dataset.world;renderTab('games');};
  $('#cgw').onchange=e=>{store.cgWords=e.target.checked;save();};
  $$('[data-pick]').forEach(b=>b.onclick=()=>{haptic('medium');sfx('whoosh');cgStart(b.dataset.pick);});
}
/* ================= разделы: включение и выключение (админ-панель) ================= */
// Состояние берётся с сервера (/api/flags) и кэшируется. Менять может только организатор — проверяет сервер.
const FLAG_SECTIONS=[
  ['kino','Кинозал','вкладка со сценами'],['games','Игры','вкладка игр целиком'],['cards','Карточная дуэль',''],['spy','Шпион',''],['arena','Дуэль и турнир',''],
  ['dota','Мир Доты',''],['cs2','Мир CS 2',''],['best','Солянка',''],['lesson','Урок: 5 новых слов','']];
const FKEY='dota_flags_v1';
let FLAGS={},FLAG_ADMIN=false,FLAG_RAW=null,FLAG_ME=null;
try{const c=JSON.parse(localStorage.getItem(FKEY)||'{}');FLAGS=c.flags||{};FLAG_ADMIN=!!c.admin;}catch(e){}
const flagOf=k=>FLAG_ADMIN?'on':(FLAGS[k]||'on');
const FLAG_TXT={maint:'Технические работы',dev:'В разработке'};
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
  return `<div class="gate anim"><div class="gate-ico ${dev?'dev':'maint'}">${dev?'<svg viewBox="0 0 24 24"><path d="M9 3h6M10 3v6L5 18a2 2 0 0 0 1.7 3h10.6A2 2 0 0 0 19 18l-5-9V3"/><path d="M7.5 14h9"/></svg>':'<svg viewBox="0 0 24 24"><path d="M14.5 6.5a4 4 0 0 0-5.3 5L4 16.7 7.3 20l5.2-5.2a4 4 0 0 0 5-5.3l-2.4 2.4-2.6-.6-.6-2.6z"/></svg>'}</div>
    <em>${esc(title||'')}</em><h2>${FLAG_TXT[st]}</h2><p>${dev?'Раздел ещё делается. Скоро откроем — следи за ботом.':'Раздел временно закрыт: чиним и улучшаем. Скоро вернётся.'}</p></div>`;
}
function showGate(k,title){
  sfx('bad');haptic('err');
  const w=document.createElement('div');w.className='gatewrap';w.innerHTML=`<div class="gatebox">${gateHTML(k,title)}<button class="btn" data-close>Понятно</button></div>`;
  document.body.appendChild(w);w.onclick=e=>{if(e.target===w||e.target.closest('[data-close]'))w.remove();};
}
// пометить закрытые кнопки и перехватить нажатия (вызывается после каждой отрисовки вкладки)
const FLAG_BTNS={'#best':'best','#lesson':'lesson','#wDota':'dota','#wCS':'cs2','#gCards':'cards','#gSpy':'spy','#gArena':'arena'};
function applyFlagsUI(){
  const mark=(el,k,title)=>{const st=flagOf(k);const raw=FLAG_ADMIN&&FLAG_RAW&&FLAG_RAW[k]&&FLAG_RAW[k].st!=='on'?FLAG_RAW[k].st:null;
    el.querySelectorAll(':scope > .fbadge').forEach(x=>x.remove());el.classList.remove('flagged');
    if(st!=='on'){el.classList.add('flagged');el.insertAdjacentHTML('beforeend',`<span class="fbadge ${st}">${FLAG_TXT[st]}</span>`);el.onclick=e=>{e.stopPropagation();showGate(k,title);};}
    else if(raw)el.insertAdjacentHTML('beforeend',`<span class="fbadge admin">для всех: ${FLAG_TXT[raw]}</span>`);};
  for(const sel in FLAG_BTNS){const el=$(sel);if(el){const t=(el.querySelector('b')||{}).textContent||'';mark(el,FLAG_BTNS[sel],t);}}
  $$('[data-sc]').forEach(el=>{const id=el.dataset.sc,k=flagOf('kino')!=='on'?'kino':'scene-'+id;const t=(el.querySelector('b')||{}).textContent||'';mark(el,k,t);});
}
/* ---- админ-панель ---- */
function renderAdmin(){
  screen='admin';backBtn(true);
  const raw=FLAG_RAW||{};
  const secs=[...FLAG_SECTIONS,...SCENES.map(s=>['scene-'+s.id,'Сцена: '+s.title,s.ep])];
  mount(`<div class="page-head"><button class="icon-btn" id="bBtn" aria-label="Назад">${ui('back')}</button><h1 class="title">Админ-панель</h1></div>
    <p class="lead" style="margin:4px 0 12px">Что видят игроки. Закрытый раздел показывает «${FLAG_TXT.maint}» или «${FLAG_TXT.dev}». В поле ниже — ID тех, кому раздел открыт всегда (тестеры). ID человек узнаёт командой /myid в боте. Тебе всё открыто всегда.${FLAG_ME?` Твой ID: <b>${FLAG_ME}</b>.`:''}</p>
    ${secs.map(([k,n,d])=>{const f=raw[k]||{st:'on',allow:[]};return `<section class="adm card" data-k="${k}"><div class="adm-h"><b>${esc(n)}</b>${d?`<small>${esc(d)}</small>`:''}</div>
      <div class="adm-seg">${[['on','Открыт'],['maint','Тех. работы'],['dev','В разработке']].map(([v,l])=>`<button data-st="${v}" class="${f.st===v?'on':''}">${l}</button>`).join('')}</div>
      <input class="adm-allow" placeholder="ID через запятую — кому открыт всегда" value="${esc((f.allow||[]).join(', '))}"></section>`;}).join('')}
    <div class="cta"><button class="btn" id="admSave">Сохранить</button></div>`,'admscr');
  $('#bBtn').onclick=()=>{sfx('tap');renderTab('profile');};
  $$('.adm-seg button').forEach(b=>b.onclick=()=>{b.parentElement.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));sfx('sel');});
  $('#admSave').onclick=async()=>{
    const flags={};$$('.adm').forEach(s=>{const st=s.querySelector('.adm-seg .on').dataset.st;const allow=s.querySelector('.adm-allow').value.split(/[\s,;]+/).map(x=>x.trim()).filter(Boolean);flags[s.dataset.k]={st,allow};});
    const b=$('#admSave');b.disabled=true;b.textContent='Сохраняю…';
    try{const r=await flagsCall({a:'set',flags});if(r&&r.ok){FLAG_RAW=r.v.raw;toast('Сохранено. Игроки увидят изменения при следующем открытии.');haptic('ok');}else toast((r&&r.msg)||'Не получилось сохранить');}
    catch(e){toast('Нет связи с сервером');}
    b.disabled=false;b.textContent='Сохранить';
  };
}

setTimeout(flagsRefresh,400);
function onBack(){
  if(screen==='quiz'){exitQuiz();return;}
  if(screen==='ob'){if(OB&&OB.i>0){OB.i--;renderOB();}return;}
  if(screen==='dota'||screen==='cs'){sfx('tap');renderHome();return;}
  if(screen==='subtab'||screen==='cgpick'){sfx('tap');renderTab('games');return;}
  if(screen==='admin'){sfx('tap');renderTab('profile');return;}
  if(screen==='cards'){cgExitAsk();return;}
  if(screen==='wiki'){sfx('tap');renderDotaWorld();return;}
  if((screen==='duel'||screen==='duelres')&&!store.onboarded){startOnboarding();return;}
  if(screen==='spyo'){spyLeaveTo('hub');return;}
  if(screen==='spyl'||screen==='spyset'){sfx('tap');renderSpyHub();return;}
  if(screen==='tourq'){renderTour(TOUR&&TOUR.L);return;}
  if(screen==='scene'){sfx('tap');renderTab('kino');return;}
  if(document.querySelector('.sc-sheetwrap')){scCloseSheet();return;}
  if(document.querySelector('.sc-pfs')){scExitFull();return;}
  if(screen==='scep'||screen==='scend'){renderScene(SCUR.id);return;}
  if(screen==='scq'){renderScEp(SCUR.id,SCUR.i);return;}
  if(screen==='tour'||screen==='tourdone'){tourExit();return;}
  if(!store.onboarded){startOnboarding();return;}
  sfx('tap');renderHome();
}

/* ================= старт ================= */
let START='';
try{
  const u=new URLSearchParams(location.search);
  START=(TG&&TG.initDataUnsafe&&TG.initDataUnsafe.start_param)||u.get('tgWebAppStartParam')||u.get('startapp')||'';
  const q=u.get('lang')||START;
  if(q==='de'||q==='en')PARAM_LANG=q;
}catch(e){}
initTG();
applyFx();
loadLore();
const START_DUEL=parseDuel(START);
ensureTabbar();splash();
const START_SPY=/^spy_[A-Za-z0-9]{5}$/.test(START)?START.slice(4).toUpperCase():null;
if(START_SPY)spyJoin(START_SPY);
else if(START==='tour')renderTour();
else if(START_DUEL)renderDuelIntro(START_DUEL);
else if(store.onboarded)renderHome();else startOnboarding();
