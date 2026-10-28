/* ================= v11 · Настройки — как в приложении (26.10) =================
   По замечаниям: мигания нет совсем (превью не перерисовывается, само ничего не щёлкает),
   «с паузами / без пауз» — живой момент из сцены, админка — всё тыкается, выход понятный,
   вид — как у приложения: «бархат и янтарь» ночью, тёплый крем днём (тема — как в Telegram). */
const S11I={back:'<path d="M15 5l-7 7 7 7"/>',chev:'<path d="M9 5l7 7-7 7"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',
 search:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
 eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
 cap:'<path d="M3 8.5l9-4 9 4-9 4z"/><path d="M7 10.5v4.2c0 1.6 2.3 2.8 5 2.8s5-1.2 5-2.8v-4.2"/><path d="M21 8.5v5"/>',
 moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5z"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
 bell:'<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2H4.5z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.9 5.6 3.9 9s-1.3 6.4-3.9 9c-2.6-2.6-3.9-5.6-3.9-9S9.4 5.6 12 3z"/>',
 lock:'<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
 help:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.8"/><circle cx="12" cy="17.2" r=".6" fill="currentColor"/>',
 redo:'<path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4v4.5h-4.5"/>',
 trash:'<path d="M4.5 7h15M9.5 7V4.8h5V7M6.5 7l.9 12.2a1.6 1.6 0 0 0 1.6 1.3h6a1.6 1.6 0 0 0 1.6-1.3L17.5 7"/>',
 key:'<circle cx="8" cy="15" r="4.2"/><path d="M11 12l8.5-8.5M16.5 6.5l2.5 2.5M14.3 8.7l2 2"/>',
 play:'<path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none"/>',pause:'<path d="M8 5.5v13M16 5.5v13"/>',
 rep:'<path d="M4 12a8 8 0 0 1 14-5.3L20 9"/><path d="M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-14 5.3L4 15"/><path d="M4 20v-5h5"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 20.5c1.4-3.9 4.4-6 8-6s6.6 2.1 8 6"/>',check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
 copy:'<rect x="8.5" y="8.5" width="11" height="11" rx="2.2"/><path d="M15.5 8.5V6.2a1.7 1.7 0 0 0-1.7-1.7H6.2a1.7 1.7 0 0 0-1.7 1.7v7.6a1.7 1.7 0 0 0 1.7 1.7h2.3"/>',
 chat:'<path d="M4.5 18.5V7.2A2.7 2.7 0 0 1 7.2 4.5h9.6a2.7 2.7 0 0 1 2.7 2.7v6.6a2.7 2.7 0 0 1-2.7 2.7H8.3z"/>',
 gift:'<rect x="4" y="9" width="16" height="11.5" rx="2"/><path d="M3 9h18M12 9v11.5M12 9C10 5 6.5 5 6.5 7S10 9 12 9zm0 0c2-4 5.5-4 5.5-2S14 9 12 9z"/>',
 flag:'<path d="M5.5 21V4.5M5.5 5h11l-2 4 2 4h-11"/>',chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',star:'<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z"/>',
 box:'<path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5L12 12l8.5-4.5M12 12v9"/>',bug:'<rect x="7" y="7.5" width="10" height="12" rx="5"/><path d="M12 7.5V5M9 4l1.5 2M15 4l-1.5 2M4 12h3M17 12h3M4.5 17.5L7 16M19.5 17.5L17 16M4.5 7.5L7 9M19.5 7.5L17 9"/>',
 cpu:'<rect x="6.5" y="6.5" width="11" height="11" rx="2"/><path d="M9.5 3v3.5M14.5 3v3.5M9.5 17.5V21M14.5 17.5V21M3 9.5h3.5M3 14.5h3.5M17.5 9.5H21M17.5 14.5H21"/>',
 out:'<path d="M14 4.5h3.3A2.7 2.7 0 0 1 20 7.2v9.6a2.7 2.7 0 0 1-2.7 2.7H14"/><path d="M10 8l-4 4 4 4M6 12h10"/>',
 cc:'<rect x="3" y="5.5" width="18" height="13" rx="3"/><path d="M10.5 10.2a2.4 2.4 0 1 0 0 3.6M17 10.2a2.4 2.4 0 1 0 0 3.6"/>',
 sound:'<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.6 7.6 0 0 1 0 11"/>',
 spark:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.6 2.6M15.4 15.4L18 18M6 18l2.6-2.6M15.4 8.6L18 6"/>',
 phone:'<rect x="7" y="2.5" width="10" height="19" rx="2.6"/><path d="M10.5 18.5h3"/>',clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
 term:'<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="M7 9.5l3 2.5-3 2.5M12.5 15h4.5"/>',dot:'<circle cx="12" cy="12" r="3.2" fill="currentColor" stroke="none"/>'};
const s11i=(k,c)=>`<svg viewBox="0 0 24 24" class="s11ic${c?' '+c:''}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${S11I[k]}</svg>`;

let S11={};
const S11C=[
 {k:'watch',n:'Просмотр',ic:'eye',sum:()=>`субтитры ${S11.sub.toUpperCase()} · ${S11.pause==='on'?'с паузами':'без пауз'}`},
 {k:'learn',n:'Обучение',ic:'cap',sum:()=>`${LVW[S11.lvl-1].toLowerCase()} · ${S11.goal} мин в день`},
 {k:'look',n:'Звук и вид',ic:'moon',sum:()=>`тема ${{tg:'авто',day:'светлая',night:'тёмная'}[S11.theme]} · ${S11.snd?'звук есть':'без звука'}`},
 {k:'notif',n:'Напоминания',ic:'bell',sum:()=>S11.daily?`фраза дня в ${S11.time}:00`:'выключены'}];
// все настройки одним списком: категория, ключ, название, пояснение, вид контрола
const S11S=[
 {c:'watch',id:'sub',n:'Размер субтитров',d:'как на видео в эпизоде',w:'seg',o:[['s','S'],['m','M'],['l','L'],['xl','XL']]},
 {c:'watch',id:'same',n:'Перевод того же размера',d:'иначе перевод чуть мельче оригинала',w:'tg'},
 {c:'watch',id:'pause',n:'Паузы на полезных фразах',d:'видео встаёт и показывает фразу с переводом',w:'seg',o:[['on','С паузами'],['off','Без пауз']]},
 {c:'watch',id:'win',n:'Окно фразы в словаре',d:'полэкрана — словарь видно сверху',w:'seg',o:[['sheet','Полэкрана'],['full','Весь экран']]},
 {c:'watch',id:'fs',n:'Весь экран при повороте',d:'повернул телефон — видео на весь экран',w:'tg'},
 {c:'learn',id:'lvl',n:'Твой уровень',d:'растёт и падает по ответам — можно поправить руками',w:'lv'},
 {c:'learn',id:'goal',n:'Цель дня',d:'сколько минут в день',w:'sl'},
 {c:'learn',id:'trn',n:'Перевод реплики после ответа',d:'новичкам первые 7 дней — потом сами',w:'seg',o:[['new','Новичкам'],['off','Никому'],['all','Всем']]},
 {c:'learn',id:'auto',n:'Само дальше',d:'после верного ответа — следующее задание',w:'tg'},
 {c:'learn',id:'type',n:'Писать самому',d:'вместо кубиков — клавиатура',w:'tg'},
 {c:'learn',id:'wp',n:'Окошко слова — сразу всё',d:'объяснение и примеры без «Подробнее»',w:'tg'},
 {c:'learn',id:'tts',n:'Озвучка слов',d:'голос читает слово, если в сцене его нет',w:'tg'},
 {c:'look',id:'theme',n:'Тема',d:'«Авто» — как в Telegram: днём светлая, ночью тёмная',w:'seg',o:[['tg','Авто'],['day','Светлая'],['night','Тёмная']]},
 {c:'look',id:'snd',n:'Звуки',d:'щелчки, верно / неверно, награды',w:'tg'},
 {c:'look',id:'fx',n:'Анимации',d:'выключи, если телефон тормозит',w:'tg'},
 {c:'look',id:'sp',n:'Заставка при входе',d:'из Магазина',w:'lnk',v:'Кинолента'},
 {c:'notif',id:'daily',n:'Фраза дня от бота',d:'раз в день — момент из сцены в чат',w:'tg'},
 {c:'notif',id:'rev',n:'Напомнить повторить',d:'одним сообщением с фразой дня',w:'tg'},
 {c:'notif',id:'time',n:'Во сколько',d:'по твоему времени',w:'seg',o:[['9','9:00'],['12','12:00'],['15','15:00'],['19','19:00']]},
 {c:'main',id:'lang',n:'Язык фильмов',d:'English или Deutsch',w:'lnk',v:'English'},
 {c:'main',id:'age',n:'Сцены 18+',d:'откровенные интервью',w:'tg'},
 {c:'main',id:'how',n:'Как тут всё устроено',d:'короткий тур',w:'lnk'},
 {c:'main',id:'onb',n:'Пройти первый запуск заново',d:'тест уровня и цель',w:'lnk'}];
const S11M={lang:'globe',age:'lock',how:'help',onb:'redo'};

function s11Ctl(s){const v=S11[s.id];
 if(s.w==='tg')return `<button class="s11-tg${v?' on':''}" data-tg="${s.id}" role="switch" aria-checked="${!!v}" aria-label="${s.n}"><i></i></button>`;
 if(s.w==='seg'){const i=Math.max(0,s.o.findIndex(o=>o[0]===v));return `<div class="s11-sg${s.o.length>3?' n4':''}" data-sg="${s.id}" style="--n:${s.o.length};--i:${i}"><i class="pl"></i>${s.o.map(o=>`<button data-v="${o[0]}" class="${o[0]===v?'on':''}">${o[1]}</button>`).join('')}</div>`}
 if(s.w==='lv')return `<div class="s11-lv" data-lv>${LVW.map((w,i)=>`<button data-v="${i+1}" class="${i+1===v?'on':''}"><span>${bars(i+1)}</span><small>${w}</small></button>`).join('')}</div>`;
 if(s.w==='sl')return `<div class="s11-sl"><input type="range" min="5" max="30" step="5" value="${v}" data-sl="${s.id}" aria-label="${s.n}"><b data-slv>${v} мин</b></div>`;
 if(s.w==='lnk')return `<span class="s11-lk">${s.v?`<em>${s.v}</em>`:''}${s11i('chev')}</span>`;
 return ''}
const s11Wide=s=>s.w==='seg'&&s.o.length>2||s.w==='lv'||s.w==='sl'||s.id==='pause'||s.id==='win';
function s11Row(s){const wide=s11Wide(s);
 return `<div class="s11-r${wide?' wd':''}${s.w==='lnk'?' lnk':''}" data-id="${s.id}">${S11M[s.id]?`<span class="li">${s11i(S11M[s.id])}</span>`:''}<span class="t"><b>${s.n}</b>${s.d?`<small>${s.d}</small>`:''}</span>${wide?'':`<span class="ct">${s11Ctl(s)}</span>`}${wide?`<div class="ct">${s11Ctl(s)}</div>`:''}</div>`}

/* --- живое превью «Просмотр»: момент из «Титаника», играет сам один раз, по кнопке — ещё раз ---
   ничего не перерисовывается: меняется только то, что поменял (размер — transform, паузы — сценарий) */
const S11L=[[0,1.45,'No, you have to go, now.','Нет, ты должна ехать. Сейчас же.'],[1.6,2.3,'No, Jack.','Нет, Джек.'],[2.45,3.75,'Get in the boat, Rose.','Садись в лодку, Роуз.',1],[4.15,4.9,'No, Jack.','Нет, Джек.'],[5.05,5.7,'Yes.','Да.']];
function s11Player(host,ctx,o){host.innerHTML=`<div class="s11-pv">
  <div class="fr">${['tk1','tk2','tk3'].map((k,i)=>`<i class="f${i?'':' on'}" style="background-image:url(${IMG[k]})"></i>`).join('')}</div><i class="sh"></i>
  <div class="cap"><div class="sz"><span class="en"></span><span class="ru"></span></div></div>
  <div class="plate"><small>полезная фраза</small><b>Get in the boat, Rose.</b><span>Садись в лодку, Роуз.</span><em>когда торопишь человека — садись, поехали</em><button class="nx">Дальше<i class="rg"><svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8"/></svg></i></button></div>
  <span class="pz">${s11i('pause')}пауза на фразе</span><span class="gone">${s11i('play')}видео идёт дальше</span>
  <div class="bar"><i></i></div>
  <button class="rp">${s11i('rep')}Ещё раз</button><span class="lb">${o&&o.lb||''}</span></div>`;
 const P=$('.s11-pv',host),cap=$('.cap',P),en=$('.en',P),ru=$('.ru',P),pl=$('.plate',P),bar=$('.bar i',P),F=$$('.f',P),pz=$('.pz',P),gone=$('.gone',P),rp=$('.rp',P),rg=$('.rg circle',pl);
 let c=null,run=0,st=null;const D=6.1;
 function size(){P.dataset.sub=S11.sub;P.classList.toggle('same',!!S11.same)}size();
 function frame(k){F.forEach((f,i)=>f.classList.toggle('on',i===k))}
 function unhold(){if(!st||st.held<=0)return;st.held=0;pl.classList.remove('on');pz.classList.remove('on');P.classList.remove('held')}
 function play(){run++;const my=run;if(c)c.kill();c=sub(ctx);P.classList.remove('end','held','flow');pl.classList.remove('on');pz.classList.remove('on');gone.classList.remove('on');cap.classList.remove('on');frame(0);
  st={vt:0,held:0,shown:false,line:-1,mode:S11.pause};
  const stop=c.loop((n,dt)=>{if(my!==run){stop();return}
   if(st.held>0){st.held-=dt/1000;if(st.held<=0)unhold()}else st.vt+=dt/1000;
   const vt=st.vt;bar.style.transform=`scaleX(${Math.min(1,vt/D).toFixed(4)})`;
   frame(vt<2.45?0:vt<4.15?1:2);
   const k=S11L.findIndex(l=>vt>=l[0]&&vt<l[1]);if(k!==st.line){st.line=k;if(k<0)cap.classList.remove('on');else{en.textContent=S11L[k][2];ru.textContent=S11L[k][3];cap.classList.add('on');an(cap,[{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{d:180,e:EO})}}
   if(!st.shown&&vt>=3.75){st.shown=true;pl.classList.add('on');
    if(st.mode==='on'){st.held=2.6;P.classList.add('held');pz.classList.add('on');rg.style.transition='none';rg.style.strokeDashoffset='0';void rg.getBoundingClientRect();rg.style.transition='stroke-dashoffset 2.6s linear';rg.style.strokeDashoffset='50.3'}
    else{P.classList.add('flow');gone.classList.add('on');c.t(()=>{pl.classList.remove('on');gone.classList.remove('on')},2400)}}
   if(vt>=D){stop();P.classList.add('end');cap.classList.remove('on')}});}
 ctx.on(rp,'click',e=>{e.stopPropagation();play()});
 ctx.on($('.nx',pl),'click',e=>{e.stopPropagation();unhold()});
 return {play,size,el:P}}

function s11User(R,ctx,o){o=o||{};
 S11={sub:'m',same:false,pause:'on',win:'sheet',fs:true,lvl:3,goal:10,trn:'new',auto:true,type:false,wp:false,tts:true,theme:'tg',snd:true,fx:true,sp:1,daily:true,rev:true,time:'12',age:false,lang:'en'};
 const tgDark=o.tg!=='day';const dk=()=>S11.theme==='night'||S11.theme==='tg'&&tgDark;
 R.className='scr s11 '+(dk()?'zd':'zl');let page=null,player=null;
 R.innerHTML=`${SB(!dk())}<div class="s11-app">
  <section class="s11-pg s11-root"><div class="s11-in">
   <div class="s11-hd"><button class="s11-bk" aria-label="Назад">${s11i('back')}</button><b>Настройки</b></div>
   <button class="s11-me"><span class="av">А</span><span class="nm"><b>Андрей</b><small>${bars(3)}Средний · 6 дней подряд</small></span>${s11i('chev')}</button>
   <label class="s11-q">${s11i('search')}<input placeholder="Найти настройку" data-q><button class="qx" hidden aria-label="Очистить">${s11i('x')}</button></label>
   <div class="s11-res" hidden></div>
   <div class="s11-main">
    <div class="s11-g s11-cats">${S11C.map(c=>`<button class="s11-cat" data-c="${c.k}"><span class="li">${s11i(c.ic)}</span><span class="t"><b>${c.n}</b><small data-sum="${c.k}">${c.sum()}</small></span>${s11i('chev')}</button>`).join('')}</div>
    <div class="s11-cap">ещё</div>
    <div class="s11-g">${S11S.filter(s=>s.c==='main').map(s11Row).join('')}</div>
    <button class="s11-reset">${s11i('trash')}Сбросить прогресс</button>
    <button class="s11-adm">${s11i('key')}<span><b>Админ-панель</b><small>видно только тебе</small></span>${s11i('chev')}</button>
    <p class="s11-ver">Языки по кино · 13.9.77</p>
   </div></div></section>
  <section class="s11-pg s11-sub" aria-hidden="true"></section>
 </div><i class="s11-dim"></i><canvas class="fx"></canvas><i class="hb${dk()?'':' dk'}"></i>`;
 const fx=FX(ctx,$('.fx',R)),ROOT=$('.s11-root',R),SUBP=$('.s11-sub',R),DIM=$('.s11-dim',R),q=$('[data-q]',R),res=$('.s11-res',R),qx=$('.s11-q .qx',R),MAIN=$('.s11-main',R);
 // превью папок (без мигания: строятся один раз при открытии, дальше меняются только свойства)
 const PV={
  watch(h){player=s11Player(h,ctx,{lb:'как будет в эпизоде'});ctx.t(()=>player.play(),520)},
  learn(h){h.innerHTML=`<div class="s11-pl"><span class="rg"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" class="t"/><circle cx="22" cy="22" r="18" class="p" pathLength="100"/></svg><b data-g></b></span><span class="tx"><b data-lw></b><small data-gl></small><span class="tr" data-tr></span></span></div>`;upd.learn(h)},
  look(h){h.innerHTML=`<div class="s11-pk"><span class="mini"><i class="hd"></i><i class="cd"></i><i class="cd s"></i><i class="bt"></i></span><span class="tx"><b data-th></b><small data-fx></small></span></div>`;upd.look(h)},
  notif(h){h.innerHTML=`<div class="s11-pn"><span class="bot">${s11i('chat')}</span><div class="msg"><small><b>Языки по кино</b><span data-tm></span></small><div class="dl"><i class="img" style="background-image:url(${IMG.tk2})">${s11i('play')}</i><b>Фраза дня · Титаник</b><p>Get in the boat, Rose.<br><i>Садись в лодку, Роуз.</i></p></div><p class="off">Фраза дня выключена — бот пишет, только если пора повторить.</p><em data-rv>Повторить 5 фраз ›</em></div></div>`;upd.notif(h)}};
 const upd={
  learn(h){const r=$('.p',h);if(!r)return;r.style.strokeDashoffset=(100-S11.goal/30*100).toFixed(1);$('[data-g]',h).textContent=S11.goal;$('[data-lw]',h).textContent=LVW[S11.lvl-1];
   $('[data-gl]',h).textContent=`${S11.goal} мин в день ≈ ${S11.goal*2} ответов`;$('[data-tr]',h).textContent={new:'перевод после ответа — первые 7 дней',off:'после ответа без перевода',all:'перевод после ответа — всегда'}[S11.trn]},
  look(h){const m=$('.mini',h);if(!m)return;m.classList.toggle('lt',!dk());$('[data-th]',h).textContent={tg:'Авто — как в Telegram',day:'Светлая',night:'Тёмная'}[S11.theme]+(S11.theme==='tg'?` · сейчас ${tgDark?'ночь':'день'}`:'');$('[data-fx]',h).textContent=`${S11.fx?'анимации есть':'без анимаций — быстрее'} · ${S11.snd?'звук есть':'без звука'}`;m.classList.toggle('nofx',!S11.fx)},
  notif(h){const M=$('.msg',h);if(!M)return;M.classList.toggle('off',!S11.daily);M.classList.toggle('norv',!S11.rev);$('[data-tm]',h).textContent=S11.time+':00'}};
 function sums(){$$('[data-sum]',R).forEach(s=>{const c=S11C.find(x=>x.k===s.dataset.sum);s.textContent=c.sum()})}
 function open(k,hl){const c=S11C.find(x=>x.k===k);page=k;player=null;
  SUBP.innerHTML=`<div class="s11-in"><div class="s11-hd"><button class="s11-bk" data-pb aria-label="Назад">${s11i('back')}</button><b>${c.n}</b></div><div class="s11-pvw" data-pv="${k}"></div><div class="s11-g">${S11S.filter(s=>s.c===k).map(s11Row).join('')}</div>${k==='watch'?`<p class="s11-ft">Меняй — превью сверху показывает сразу. «Ещё раз» — проиграть момент заново.</p>`:''}</div>`;
  SUBP.classList.add('on');SUBP.setAttribute('aria-hidden','false');ROOT.setAttribute('aria-hidden','true');SUBP.scrollTop=0;
  // состояние «под папкой» — инлайном (не держим на fill:forwards — Chrome может такие анимации убрать)
  ROOT.getAnimations().forEach(x=>x.cancel());DIM.getAnimations().forEach(x=>x.cancel());ROOT.style.transform='translateX(-28%)';DIM.style.opacity='1';
  an(SUBP,[{transform:'translateX(100%)'},{transform:'none'}],{sp:SPs});an(ROOT,[{transform:'none'},{transform:'translateX(-28%)'}],{d:340,e:EO});an(DIM,[{opacity:0},{opacity:1}],{d:340});
  $$('.s11-r',SUBP).forEach((r,i)=>an(r,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{d:260,dl:140+i*36,e:EO}));
  PV[k]($('.s11-pvw',SUBP));
  if(hl){const r=$(`.s11-r[data-id="${hl}"]`,SUBP);if(r)ctx.t(()=>{SUBP.scrollTo({top:Math.max(0,r.offsetTop-160),behavior:'smooth'});r.classList.add('hl');ctx.t(()=>r.classList.remove('hl'),1500)},420)}}
 function close(){if(!page)return;page=null;player=null;const z=an(SUBP,[{transform:'none'},{transform:'translateX(100%)'}],{d:280,e:EI,f:'forwards'});
  const f=()=>{SUBP.classList.remove('on');SUBP.setAttribute('aria-hidden','true');SUBP.getAnimations().forEach(a=>a.cancel());SUBP.innerHTML=''};if(z)z.onfinish=f;else f();
  ROOT.setAttribute('aria-hidden','false');ROOT.getAnimations().forEach(a=>a.cancel());DIM.getAnimations().forEach(a=>a.cancel());ROOT.style.transform='';DIM.style.opacity='';an(ROOT,[{transform:'translateX(-28%)'},{transform:'none'}],{d:320,e:EO});an(DIM,[{opacity:1},{opacity:0}],{d:300});sums()}
 // свайп от левого края — назад, как в iOS
 drag(ctx,SUBP,{axis:'x',start(e){const x=(e.touches?e.touches[0].clientX:e.clientX)-R.getBoundingClientRect().left;return page&&x/SCALE<34},
  move(dx){if(dx<0)dx=0;SUBP.style.transform=`translateX(${dx}px)`;ROOT.style.transform=`translateX(${-28+dx/344*28}%)`},
  end(dx,dy,vx){SUBP.style.transform='';if(dx>110||vx>.5)close();else{ROOT.style.transform='translateX(-28%)';an(SUBP,[{transform:`translateX(${Math.max(0,dx)}px)`},{transform:'none'}],{sp:SPs})}}});
 // смена темы — цвета плавно перетекают (разово, 0,45 с), от пальца расходится лёгкое кольцо; без вспышек
 function theme(e){const want=dk()?'zd':'zl';if(R.classList.contains(want))return;const r=R.getBoundingClientRect(),x=e?(e.clientX-r.left)/SCALE:172,y=e?(e.clientY-r.top)/SCALE:380;
  const w=document.createElement('i');w.className='s11-ring';w.style.left=x+'px';w.style.top=y+'px';R.appendChild(w);
  const z=an(w,[{transform:'translate(-50%,-50%) scale(.1)',opacity:.55},{transform:'translate(-50%,-50%) scale(1)',opacity:0}],{d:700,e:EO,f:'forwards'});if(z)z.onfinish=()=>w.remove();else w.remove();
  R.classList.add('thx');R.classList.remove('zd','zl');R.classList.add(want);$('.sb',R).classList.toggle('dk',want==='zl');$('.hb',R).classList.toggle('dk',want==='zl');ctx.t(()=>R.classList.remove('thx'),620)}
 // общий обработчик
 ctx.on(R,'click',e=>{const t=e.target;
  const tg=t.closest('[data-tg]');if(tg){const k=tg.dataset.tg;S11[k]=!S11[k];tg.classList.toggle('on',S11[k]);tg.setAttribute('aria-checked',S11[k]);an($('i',tg),[{transform:`translateX(${S11[k]?0:20}px) scaleX(1.25)`},{transform:`translateX(${S11[k]?20:0}px)`}],{sp:SPb});
   if(k==='same'&&player)player.size();if(page&&upd[page])upd[page]($('.s11-pvw',SUBP));if(k==='fx'){R.classList.toggle('nofx',!S11.fx);const bt=$('.s11-pk .mini .bt',R);if(bt&&S11.fx)an(bt,[{transform:'none'},{transform:'scale(.86)'},{transform:'scale(1.06)'},{transform:'none'}],{d:520,e:EO})}if(k==='snd'&&S11.snd)toast(R,'щёлк');if(k==='fs'&&S11.fs){const r=t.closest('.s11-r');if(r)s11Rot(r)}sums();return}
  const sb=t.closest('.s11-sg button');if(sb){const sg=sb.parentNode,k=sg.dataset.sg,B=$$('button',sg);if(S11[k]===sb.dataset.v)return;S11[k]=sb.dataset.v;B.forEach(x=>x.classList.toggle('on',x===sb));sg.style.setProperty('--i',B.indexOf(sb));
   if(k==='sub'&&player)player.size();if(k==='pause'&&player)player.play();if(k==='theme')theme(e);if(page&&upd[page])upd[page]($('.s11-pvw',SUBP));sums();return}
  const lv=t.closest('.s11-lv button');if(lv){S11.lvl=+lv.dataset.v;$$('.s11-lv button',R).forEach(x=>x.classList.toggle('on',x===lv));an(lv,[{transform:'scale(.94)'},{transform:'none'}],{sp:SPb});if(page)upd.learn($('.s11-pvw',SUBP));sums();return}
  const cat=t.closest('.s11-cat');if(cat){an(cat,[{transform:'scale(.97)'},{transform:'none'}],{d:200});ctx.t(()=>open(cat.dataset.c),60);return}
  if(t.closest('[data-pb]')){close();return}
  const hit=t.closest('.s11-hit');if(hit){const s=S11S.find(x=>x.id===hit.dataset.id);q.value='';search();if(s.c==='main'){const r=$(`.s11-root .s11-r[data-id="${s.id}"]`,R);if(r){r.scrollIntoView({block:'center',behavior:'smooth'});r.classList.add('hl');ctx.t(()=>r.classList.remove('hl'),1500)}}else open(s.c,s.id);return}
  if(t.closest('.s11-reset')){s11Confirm(R,ctx,{t:'Сбросить весь прогресс?',p:'Сцены, слова, награды и серия обнулятся на всех устройствах. Вернуть будет нельзя.',ok:'Сбросить',bad:1,done:()=>toast(R,'Не сбросил — это макет')});return}
  if(t.closest('.s11-adm')){s11Adm(R,ctx,$('.s11-adm',R));return}
  if(t.closest('.s11-me')){toast(R,'‹ в Профиль');return}
  const ln=t.closest('.s11-r.lnk');if(ln){const id=ln.dataset.id;toast(R,{lang:'Язык фильмов — English / Deutsch',how:'▶ Короткий тур',onb:'▶ Первый запуск заново',sp:'▶ Магазин → Заставки'}[id]||'▶');return}
  if(t.closest('.s11-bk:not([data-pb])'))toast(R,'‹ в Профиль')});
 ctx.on(R,'input',e=>{if(e.target.dataset.sl){S11.goal=+e.target.value;const b=$('[data-slv]',R);if(b)b.textContent=S11.goal+' мин';if(page)upd.learn($('.s11-pvw',SUBP));sums()}});
 function search(){const v=q.value.trim().toLowerCase();qx.hidden=!v;res.hidden=!v;MAIN.hidden=!!v;if(!v)return;
  const L=S11S.filter(s=>(s.n+' '+s.d+' '+((S11C.find(c=>c.k===s.c)||{n:''}).n)).toLowerCase().includes(v));
  const hl=x=>x.replace(new RegExp('('+v.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig'),'<mark>$1</mark>');
  res.innerHTML=L.length?`<div class="s11-g">${L.map(s=>{const c=S11C.find(x=>x.k===s.c);return `<button class="s11-hit" data-id="${s.id}"><small>${c?c.n:'Общее'} ›</small><b>${hl(s.n)}</b>${s.d?`<em>${hl(s.d)}</em>`:''}</button>`}).join('')}</div>`:`<p class="s11-none">Такой настройки нет. Попробуй «субтитры», «тема», «паузы».</p>`;
  $$('.s11-hit',res).forEach((b,i)=>an(b,[{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{d:200,dl:i*28}))}
 ctx.on(q,'input',search);ctx.on(qx,'click',e=>{e.preventDefault();q.value='';search();q.focus()});
 an($('.s11-root .s11-in',R),[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{d:360,e:EO});
 $$('.s11-root .s11-cat, .s11-root .s11-r',R).forEach((r,i)=>an(r,[{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{d:260,dl:120+i*34,e:EO}));
 if(o.openWatch)ctx.t(()=>open('watch'),700);
 return {open,close}}
// поворот телефона в строке «Весь экран при повороте» — один раз, когда включил
function s11Rot(r){let p=$('.s11-rot',r);if(!p){p=document.createElement('i');p.className='s11-rot';p.innerHTML=s11i('phone');$('.t',r).appendChild(p)}an(p,[{transform:'rotate(0)'},{transform:'rotate(-90deg)',offset:.55},{transform:'rotate(-90deg)',offset:.8},{transform:'rotate(0)'}],{d:1200,e:EIO})}
// вопрос-подтверждение (шторка снизу)
function s11Confirm(R,ctx,o){const w=document.createElement('div');w.className='s11-cf';w.innerHTML=`<i class="bg"></i><div class="sh"><b>${o.t}</b><p>${o.p}</p><button class="ok${o.bad?' bad':''}">${o.ok}</button><button class="no">Отмена</button></div>`;R.appendChild(w);
 an($('.bg',w),[{opacity:0},{opacity:1}],{d:220});an($('.sh',w),[{transform:'translateY(105%)'},{transform:'none'}],{sp:SPs});
 const close=f=>{const z=an($('.sh',w),[{transform:'none'},{transform:'translateY(105%)'}],{d:240,e:EI,f:'forwards'});an($('.bg',w),[{opacity:1},{opacity:0}],{d:240,f:'forwards'});const g=()=>{w.remove();f&&f()};if(z)z.onfinish=g;else g()};
 ctx.on($('.ok',w),'click',()=>close(o.done));ctx.on($('.no',w),'click',()=>close());ctx.on($('.bg',w),'click',()=>close())}

/* --- «Просмотр» с живым превью: открывается сразу на нужной папке --- */

/* ================= Админка · «Пульт» — другой мир, всё тыкается =================
   вход: «Админ-панель» → экран темнеет, по нему проходит строка развёртки, печатается «ПУЛЬТ»;
   выход: «‹ в приложение» (и «назад» из корня) — обратно в Настройки тем же путём. */
const A11P=[{n:'Андрей',u:'andrey',id:'876754050',s:'сейчас',src:'—',a:1840,me:1},{n:'Боря',u:'borya_k',id:'512339871',s:'5 мин назад',src:'src_tiktok',a:212},{n:'Маша',u:'',id:'640118230',s:'1 ч назад',src:'—',a:96},
 {n:'Kirill',u:'kir_dl',id:'7039912455',s:'сегодня 11:20',src:'src_tiktok',a:44},{n:'Лена',u:'lenka',id:'433870112',s:'вчера',src:'дуэль',a:131},{n:'Саша',u:'',id:'990211567',s:'вчера',src:'—',a:12},{n:'Dima',u:'dmtr',id:'1288340012',s:'3 дня назад',src:'src_reels',a:7}];
const A11F=[['ndnew','Дизайн «Новый» — кому','all'],['games','Игры · Deadlock','me'],['all','Технические работы — выключить всё','off'],['kinolesson','Урок на сегодня','all'],['scene-clavicular-18','Сцена: Клавикуляр 18+','test'],['scene-downfall-bunker','Сцена: Бункер','all'],['scene-titanic-boat','Сцена: Титаник','all'],['path','Путь сцены (новый вид)','me']];
const A11ST={all:['Всем','ok'],test:['Тестерам','t'],me:['Только мне','me'],off:['Выкл','off']};
const A11E=[['TypeError: Cannot read properties of null (reading \'currentTime\')','scClip · app.js:2231','13.9.68 · эпизод','у 4 · 9 раз'],['Failed to fetch','cloudSync','13.9.76 · Главная','у 2 · 2 раза'],['RangeError: Maximum call stack','dictlab.js:880','13.9.70 · словарь','у 1 · 1 раз']];
const A11SC=[['titanic-boat','Титаник · шлюпка',4,'all'],['wolf-of-wall-street','Волк · ланч с Ханной',6,'all'],['american-psycho','Психопат · офис',4,'all'],['sopranos-s01e01','Сопрано · S01E01',4,'all'],['breaking-bad-knocks','Во все тяжкие · стучит',2,'all'],['clavicular-18','Клавикуляр 18+',5,'test'],['downfall-bunker','Бункер',3,'all']];
const A11FOL=[{k:'players',n:'Игроки',ic:'user',m:'1 284'},{k:'stats',n:'Статистика',ic:'chart',m:'212 сегодня'},{k:'access',n:'Доступ и флаги',ic:'flag',m:'8 флагов'},{k:'prem',n:'Премиум',ic:'star',m:'выкл'},{k:'content',n:'Контент',ic:'box',m:'30 сцен'},{k:'me',n:'Я как игрок',ic:'term',m:''},{k:'sys',n:'Система',ic:'cpu',m:'3 ошибки',warn:1}];
function s11Adm(R,ctx,from){const ov=document.createElement('div');ov.className='a11';R.appendChild(ov);const c=sub(ctx);let stack=[],dr={},prem='off',meT={pl:false,nd:true,anim:true};
 const tiles=`<div class="a11-st"><div><b data-cu="1284">0</b><small>игроков</small></div><div><b data-cu="37">0</b><small>новых за сутки</small></div><div><b data-cu="212">0</b><small>заходили сегодня</small></div></div>`;
 ov.innerHTML=`<div class="a11-grid"></div><div class="a11-scan"></div><div class="a11-boot"><b>ПУЛЬТ</b><small>вход · admin · 876754050</small></div>
  <div class="a11-in"><div class="a11-top"><button class="a11-out">${s11i('out')}в приложение</button><span class="id">admin · 876754050</span></div>
   <div class="a11-crumb"></div><div class="a11-body"></div></div><canvas class="fx"></canvas>`;
 const body=$('.a11-body',ov),crumb=$('.a11-crumb',ov),fx=FX(c,$('.fx',ov));
 // вход: затемнение → строка развёртки → «ПУЛЬТ» печатается → пульт
 an(ov,[{opacity:0},{opacity:1}],{d:260});const sc=$('.a11-scan',ov);an(sc,[{transform:'translateY(-10px) scaleY(.4)'},{transform:'translateY(780px) scaleY(1)'}],{d:700,e:EIO,f:'forwards'});
 const bt=$('.a11-boot b',ov);typewrite(c,bt,'ПУЛЬТ',null,55);c.t(()=>{const z=an($('.a11-boot',ov),[{opacity:1},{opacity:0,transform:'scale(.96)'}],{d:240,f:'forwards'});c.t(home,120)},820);
 function cu(){$$('[data-cu]',body).forEach(b=>countUp(c,b,+b.dataset.cu,800))}
 function setCrumb(){crumb.classList.toggle('home',!stack.length);crumb.innerHTML=['Пульт',...stack.map(s=>s.n)].map((x,i,a)=>i<a.length-1?`<button data-cr="${i}">${x}</button><i>/</i>`:`<b>${x}</b>`).join('')}
 function swap(html,dir){const old=body.innerHTML;body.innerHTML=html;an(body,[{opacity:0,transform:`translateX(${dir<0?-24:24}px)`},{opacity:1,transform:'none'}],{d:240,e:EO});$$('.a11-row,.a11-f,.a11-pl',body).forEach((r,i)=>an(r,[{opacity:0},{opacity:1}],{d:180,dl:40+i*22}))}
 function home(dir){stack=[];setCrumb();
  swap(`<h2 class="a11-h">Пульт<small>13.9.77 · всё по папкам · поиск — по всему</small></h2>
   <label class="a11-q">${s11i('search')}<input placeholder="игрок, флаг, сцена, настройка…" data-aq><kbd>⌘K</kbd></label><div class="a11-res" hidden></div>
   <div class="a11-home">${tiles}<div class="a11-cap">папки</div><div class="a11-fs">${A11FOL.map(f=>`<button class="a11-f${f.warn?' warn':''}" data-f="${f.k}">${s11i(f.ic)}<b>${f.n}</b><small>${f.m}</small>${f.warn?'<i class="dt"></i>':''}</button>`).join('')}</div>
   <div class="a11-cap">недавнее</div><div class="a11-rec"><button data-go="access">Доступ › Игры · Deadlock</button><button data-go="sys:err">Система › Ошибки</button><button data-go="players:512339871">Игроки › Боря</button></div></div>`,dir);
  cu();const iq=$('[data-aq]',body);c.on(iq,'input',()=>asearch(iq.value))}
 function fold(k,arg){const f=A11FOL.find(x=>x.k===k);stack=[{k,n:f.n}];setCrumb();let h='';
  if(k==='players')h=`<label class="a11-q sm">${s11i('search')}<input placeholder="ID, имя или @ник" data-pq></label><div class="a11-pls">${A11P.map(plRow).join('')}</div><p class="a11-more">Показать ещё 50</p>`;
  if(k==='stats')h=`<div class="a11-sg" data-per><button class="on">7 дней</button><button>30</button><button>90</button></div>
   <div class="a11-fun">${[['Зашли',1284,100],['Выбрали сцену',911,71],['Посмотрели эпизод',702,55],['Дошли до проверки',488,38],['Повторение',203,16],['«Фраза дня» из бота',151,12]].map(([n,v,p],i)=>`<div class="a11-fr"><span>${n}</span><i style="--p:${p}"><b></b></i><em>${v.toLocaleString('ru-RU')}</em></div>`).join('')}</div>
   <div class="a11-kv"><div><small>вернулись на 2-й день</small><b>34 %</b></div><div><small>на 7-й</small><b>19 %</b></div><div><small>время на задание</small><b class="ok">14 с</b></div><div><small>вся проверка</small><b class="bad">2 мин 40</b></div></div>
   <button class="a11-row" data-go="sys:err">${s11i('bug')}<span><b>Ошибки приложения</b><small>3 новых — в «Системе»</small></span>${s11i('chev')}</button>`;
  if(k==='access')h=`<p class="a11-hint">Тап по строке — выбрать, кому видно. Правки копятся, внизу — «Сохранить».</p><div class="a11-fl">${A11F.map(flRow).join('')}</div><div class="a11-save" hidden><button>Сохранить · <b>0</b></button><button class="cn">Отменить</button></div>`;
  if(k==='prem')h=`<div class="a11-cap">режим</div><div class="a11-sg pm">${[['off','Выкл'],['feat','Функции'],['all','Функции и сцены']].map(([v,n])=>`<button data-pm="${v}" class="${prem===v?'on':''}">${n}</button>`).join('')}</div><p class="a11-hint" data-pmh></p>
   <div class="a11-kv"><div><small>с премиумом</small><b>0</b></div><div><small>платят</small><b>0</b></div><div><small>звёзд за 30 дней</small><b>0 ⭐</b></div><div><small>пробные</small><b>0</b></div></div>
   <button class="a11-row" data-act="give">${s11i('gift')}<span><b>Выдать дни премиума</b><small>по ID игрока</small></span>${s11i('chev')}</button><button class="a11-row" data-act="pw">${s11i('star')}<span><b>Посмотреть экран премиума</b><small>как увидит игрок</small></span>${s11i('chev')}</button>`;
  if(k==='content')h=`<p class="a11-hint">Тап — эпизоды сцены. Статус — кому видно.</p><div class="a11-fl">${A11SC.map(([id,n,e,st])=>`<button class="a11-row sc" data-sc="${id}"><span><b>${n}</b><small>${e} эп. · ${id}</small></span><em class="pill ${A11ST[st][1]}">${A11ST[st][0]}</em></button>`).join('')}</div>`;
  if(k==='me')h=`<div class="a11-fl">${[['pl','Смотрю как игрок','замки и премиум — как у всех'],['nd','Дизайн «Новый»','только у тебя'],['anim','Анимации в админке','строка развёртки и печать']].map(([id,n,d])=>`<div class="a11-row tgr"><span><b>${n}</b><small>${d}</small></span><button class="s11-tg${meT[id]?' on':''}" data-mt="${id}"><i></i></button></div>`).join('')}
   <button class="a11-row" data-act="pass">${s11i('check')}<span><b>Пройти всё</b><small>все сцены — как пройденные</small></span>${s11i('chev')}</button><button class="a11-row" data-act="t1000">${s11i('gift')}<span><b>+1000 билетов</b><small>себе</small></span>${s11i('chev')}</button><button class="a11-row" data-act="onb">${s11i('redo')}<span><b>Первый запуск заново</b><small>тест уровня, цель</small></span>${s11i('chev')}</button><button class="a11-row bad" data-act="reset">${s11i('trash')}<span><b>Сбросить мой прогресс</b><small>спросит ещё раз</small></span>${s11i('chev')}</button></div>`;
  if(k==='sys')h=`<div class="a11-fl"><button class="a11-row" data-go="sys:err">${s11i('bug')}<span><b>Ошибки приложения</b><small>3 новых</small></span><i class="dt"></i>${s11i('chev')}</button><button class="a11-row" data-act="check">${s11i('check')}<span><b>Проверка установки</b><small>медиа в R2 · 445 файлов</small></span>${s11i('chev')}</button><div class="a11-chk" hidden></div>
   <button class="a11-row" data-act="why">${s11i('spark')}<span><b>Почему может не быть анимаций</b><small>меньше движения, lite, «Анимации»</small></span>${s11i('chev')}</button><div class="a11-row inf"><span><b>Версия</b><small>сайт 13.9.77 · воркер 13.9.34</small></span><em class="pill t">передеплоить</em></div></div>`;
  swap(h,1);
  if(k==='stats')$$('.a11-fr i b',body).forEach((b,i)=>an(b,[{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{d:700,dl:120+i*70,e:EO}));
  if(k==='prem')pmHint();
  if(k==='players'){const pq=$('[data-pq]',body);c.on(pq,'input',()=>{const v=pq.value.trim().toLowerCase();$$('.a11-pl',body).forEach(r=>{r.hidden=!!v&&!r.dataset.s.includes(v)})});if(arg)c.t(()=>plSheet(A11P.find(p=>p.id===arg)),280)}
  if(k==='sys'&&arg==='err')c.t(errs,200)}
 const plRow=p=>`<button class="a11-pl" data-pl="${p.id}" data-s="${(p.n+' '+p.u+' '+p.id).toLowerCase()}"><span class="av">${p.n[0]}</span><span class="tx"><b>${p.n}${p.u?` <i>@${p.u}</i>`:''}${p.me?' <em>это ты</em>':''}</b><small>${p.s} · ${p.src} · ${p.a} действий</small></span><span class="id">${p.id}</span></button>`;
 const flRow=([k,n,st])=>{const s=dr[k]||st;return `<button class="a11-row fl${dr[k]&&dr[k]!==st?' ch':''}" data-fl="${k}"><span><b>${n}</b><small>${k}</small></span><em class="pill ${A11ST[s][1]}">${A11ST[s][0]}</em></button>`};
 function pmHint(){const h=$('[data-pmh]',body);if(h)h.textContent={off:'Выкл — у игроков всё как раньше, премиума не видно.',feat:'Функции — повторение больше раза в день, подсказки без билетов, «Мои слова» без лимита, режиссёрская версия.',all:'Функции и сцены — плюс сцены сложнее 2-го уровня, кроме сцен первого запуска.'}[prem]}
 function sheet(html,o){const w=document.createElement('div');w.className='a11-sh';w.innerHTML=`<i class="bg"></i><div class="in">${html}</div>`;ov.appendChild(w);an($('.bg',w),[{opacity:0},{opacity:1}],{d:200});an($('.in',w),[{transform:'translateY(105%)'},{transform:'none'}],{sp:SPs});
  const close=()=>{const z=an($('.in',w),[{transform:'none'},{transform:'translateY(105%)'}],{d:220,e:EI,f:'forwards'});an($('.bg',w),[{opacity:1},{opacity:0}],{d:220,f:'forwards'});const g=()=>w.remove();if(z)z.onfinish=g;else g()};
  c.on($('.bg',w),'click',close);$$('[data-cl]',w).forEach(b=>c.on(b,'click',close));return {w,close}}
 function plSheet(p){if(!p)return;const S=sheet(`<div class="a11-pst"><span class="av">${p.n[0]}</span><b>${p.n}</b><small>${p.u?'@'+p.u+' · ':''}ID ${p.id}</small></div>
   <div class="a11-kv"><div><small>был</small><b>${p.s}</b></div><div><small>пришёл</small><b>${p.src}</b></div><div><small>действий</small><b>${p.a}</b></div><div><small>язык Telegram</small><b>ru</b></div></div>
   <button class="a11-row" data-pa="copy">${s11i('copy')}<span><b>Скопировать ID</b></span></button>${p.u?`<button class="a11-row" data-pa="msg">${s11i('chat')}<span><b>Написать @${p.u}</b></span></button>`:''}<button class="a11-row" data-pa="prem">${s11i('star')}<span><b>Выдать премиум · 7 дней</b></span></button><button class="a11-row" data-pa="nd">${s11i('flag')}<span><b>Открыть «Новый» дизайн</b><small>тестером</small></span></button><button class="a11-row bad" data-pa="reset">${s11i('trash')}<span><b>Сбросить прогресс</b></span></button><button class="a11-x" data-cl>Готово</button>`);
  $$('[data-pa]',S.w).forEach(b=>c.on(b,'click',()=>{const a=b.dataset.pa;if(a==='reset'){s11Confirm(ov,c,{t:`Сбросить прогресс ${p.n}?`,p:'Сцены, слова и награды игрока обнулятся.',ok:'Сбросить',bad:1,done:()=>toast(ov,'Сброшено · '+p.n)});return}
   toast(ov,{copy:'ID скопирован · '+p.id,msg:'▶ Telegram · @'+p.u,prem:'Премиум выдан · 7 дней',nd:'«Новый» открыт · '+p.n}[a]);b.classList.add('done')}))}
 function flSheet(k){const f=A11F.find(x=>x[0]===k),cur=dr[k]||f[2];const S=sheet(`<b class="a11-sht">${f[1]}</b><small class="a11-shs">${k}</small><div class="a11-opts">${Object.entries(A11ST).map(([v,[n]])=>`<button data-st="${v}" class="${v===cur?'on':''}"><i></i><b>${n}</b><small>${{all:'видят все игроки',test:'только ID из списка',me:'только админ',off:'никто'}[v]}</small></button>`).join('')}</div><label class="a11-ids" ${cur==='test'?'':'hidden'}><small>ID тестеров через запятую</small><input value="512339871, 433870112"></label><button class="a11-x" data-cl>Готово</button>`);
  $$('[data-st]',S.w).forEach(b=>c.on(b,'click',()=>{$$('[data-st]',S.w).forEach(x=>x.classList.toggle('on',x===b));$('.a11-ids',S.w).hidden=b.dataset.st!=='test';if(b.dataset.st===f[2])delete dr[k];else dr[k]=b.dataset.st;const row=$(`[data-fl="${k}"]`,body);if(row){row.outerHTML=flRow(f);an($(`[data-fl="${k}"]`,body),[{background:'rgba(255,200,61,.18)'},{background:'transparent'}],{d:700})}saveBar()}))}
 function saveBar(){const n=Object.keys(dr).length,b=$('.a11-save',body);if(!b)return;const was=!b.hidden;b.hidden=!n;$('b',b).textContent=n;if(n&&!was)an(b,[{transform:'translateY(120%)'},{transform:'none'}],{sp:SPs})}
 function errs(){stack=[{k:'sys',n:'Система'},{k:'err',n:'Ошибки'}];setCrumb();swap(`<div class="a11-fl">${A11E.map((e,i)=>`<button class="a11-row er" data-er="${i}"><span><b>${e[0]}</b><small>${e[1]} · ${e[2]}</small></span><em>${e[3]}</em></button>`).join('')}</div><button class="a11-row" data-act="clr">${s11i('trash')}<span><b>Очистить список</b></span></button>`,1)}
 function asearch(v){v=v.trim().toLowerCase();const res=$('.a11-res',body),hm=$('.a11-home',body);res.hidden=!v;hm.hidden=!!v;if(!v)return;
  const L=[...A11P.filter(p=>(p.n+' '+p.u+' '+p.id).toLowerCase().includes(v)).map(p=>({p:'Игроки',n:p.n+(p.u?' · @'+p.u:''),go:'players:'+p.id})),
   ...A11F.filter(f=>(f[1]+' '+f[0]).toLowerCase().includes(v)).map(f=>({p:'Доступ',n:f[1],go:'access'})),
   ...A11SC.filter(s=>(s[1]+' '+s[0]).toLowerCase().includes(v)).map(s=>({p:'Контент',n:s[1],go:'content'})),
   ...A11FOL.filter(f=>f.n.toLowerCase().includes(v)).map(f=>({p:'Папка',n:f.n,go:f.k})),
   ...(('ошибки error краш').includes(v)?[{p:'Система',n:'Ошибки приложения · 3 новых',go:'sys:err'}]:[]),
   ...(('премиум звёзды оплата').includes(v)?[{p:'Премиум',n:'Режим: выкл / функции / сцены',go:'prem'}]:[])];
  res.innerHTML=L.length?L.map(x=>`<button class="a11-row" data-go="${x.go}"><span><small>${x.p} ›</small><b>${x.n}</b></span>${s11i('chev')}</button>`).join(''):'<p class="a11-hint">Ничего. Ищи по ID, имени, флагу, сцене.</p>'}
 function go(t){const [k,arg]=t.split(':');fold(k,arg)}
 function back(){if(stack.length>1){fold(stack[0].k);return}if(stack.length){home(-1);return}exit()}
 function exit(){const z=an(ov,[{opacity:1},{opacity:0}],{d:320,e:EO,f:'forwards'});an($('.a11-in',ov),[{transform:'none'},{transform:'scale(.97)'}],{d:300,f:'forwards'});const f=()=>{c.kill();ov.remove();if(from)an(from,[{transform:'scale(.96)'},{transform:'none'}],{sp:SPb})};if(z)z.onfinish=f;else f()}
 c.on(ov,'click',e=>{const t=e.target;
  if(t.closest('.a11-out')){exit();return}
  const cr=t.closest('[data-cr]');if(cr){const i=+cr.dataset.cr;if(i===0)home(-1);else fold(stack[0].k);return}
  const f=t.closest('[data-f]');if(f){an(f,[{transform:'scale(.95)'},{transform:'none'}],{d:180});fold(f.dataset.f);return}
  const g=t.closest('[data-go]');if(g){go(g.dataset.go);return}
  const pl=t.closest('[data-pl]');if(pl){plSheet(A11P.find(p=>p.id===pl.dataset.pl));return}
  const fl=t.closest('[data-fl]');if(fl){flSheet(fl.dataset.fl);return}
  const sv=t.closest('.a11-save button');if(sv){if(sv.classList.contains('cn')){dr={};fold('access');return}const n=Object.keys(dr).length;Object.entries(dr).forEach(([k,v])=>{const x=A11F.find(f=>f[0]===k);if(x)x[2]=v});dr={};fold('access');toast(ov,`Сохранено · ${n} ${n===1?'флаг':'флага'}`);return}
  const pm=t.closest('[data-pm]');if(pm){prem=pm.dataset.pm;$$('[data-pm]',body).forEach(x=>x.classList.toggle('on',x===pm));pmHint();A11FOL[3].m={off:'выкл',feat:'функции',all:'функции и сцены'}[prem];return}
  const mt=t.closest('[data-mt]');if(mt){meT[mt.dataset.mt]=!meT[mt.dataset.mt];mt.classList.toggle('on');an($('i',mt),[{transform:`translateX(${meT[mt.dataset.mt]?0:20}px)`},{transform:`translateX(${meT[mt.dataset.mt]?20:0}px)`}],{sp:SPb});return}
  const sc=t.closest('[data-sc]');if(sc){const s=A11SC.find(x=>x[0]===sc.dataset.sc);const S=sheet(`<b class="a11-sht">${s[1]}</b><small class="a11-shs">${s[0]} · ${A11ST[s[3]][0].toLowerCase()}</small><div class="a11-fl">${Array.from({length:s[2]},(_,i)=>`<div class="a11-row tgr"><span><b>Эпизод ${i+1}</b><small>${i<2?'открыт':'по порядку'}</small></span><button class="s11-tg on" data-ep><i></i></button></div>`).join('')}</div><button class="a11-x" data-cl>Готово</button>`);$$('[data-ep]',S.w).forEach(b=>c.on(b,'click',()=>b.classList.toggle('on')));return}
  const er=t.closest('[data-er]');if(er){const x=A11E[+er.dataset.er];sheet(`<b class="a11-sht">Ошибка</b><pre class="a11-pre">${x[0]}\n  at ${x[1]}\n\nверсия ${x[2]}\n${x[3]}</pre><button class="a11-x" data-cl>Готово</button>`);return}
  const act=t.closest('[data-act]');if(act){const a=act.dataset.act;
   if(a==='reset'){s11Confirm(ov,c,{t:'Сбросить твой прогресс?',p:'Сцены, слова, награды — с нуля. Облако тоже.',ok:'Сбросить',bad:1,done:()=>toast(ov,'Сброшено (макет)')});return}
   if(a==='check'){const box=$('.a11-chk',body);box.hidden=false;box.innerHTML=['Сцены · 30','Видео эпизодов · 104','Кадры NN-k.jpg · 104','Фоны · 17','Звуки · 2 набора','wt.json · 30'].map(x=>`<div class="ln"><i></i>${x}</div>`).join('');$$('.ln',box).forEach((l,i)=>c.t(()=>{l.classList.add('ok')},300+i*260));return}
   if(a==='clr'){$$('.er',body).forEach((r,i)=>an(r,[{opacity:1},{opacity:0,transform:'translateX(30px)'}],{d:220,dl:i*60,f:'forwards'}));c.t(()=>{toast(ov,'Список ошибок пуст');A11FOL[6].warn=0;A11FOL[6].m='0 ошибок'},420);return}
   if(a==='t1000'){const r=rel(act,ov);fx.burst(r.x+r.w-30,r.y+r.h/2,{n:26,c:['#FFC83D','#fff','#F0B44C'],v:4,g:.12,s:4,l:46});toast(ov,'+1000 билетов');return}
   toast(ov,{give:'▶ Выдать дни: ID и сколько дней',pw:'▶ Экран премиума',pass:'Все сцены — пройдены (макет)',onb:'▶ Первый запуск',why:'Меньше движения в системе · lite · «Анимации» выкл'}[a]||'▶');return}});
 c.on(ov,'keydown',e=>{if(e.key==='Escape')back()});
 return {back,exit}}

V.push({g:'s11',id:'s11u',n:'Настройки · как в приложении',cmp:'set-user',
 idea:'Переделал под вид самого приложения: «бархат и янтарь» ночью, тёплый крем днём (тема — как в Telegram, переключается в «Звук и вид» и меняет весь экран кругом из пальца). Мигания нет совсем: превью строится один раз и меняется только то, что ты поменял; само ничего не щёлкает. В «Просмотре» сверху — живой момент из «Титаника»: включил «С паузами» — видео встаёт на «Get in the boat, Rose» и показывает фразу с переводом; «Без пауз» — фраза выезжает, а видео идёт дальше. «Ещё раз» — проиграть снова. Старые настройки v9 не трогал — они в «Прошлых версиях».',
 moves:['папка въезжает справа, корень уезжает влево и темнеет; свайп от левого края — назад, как в iOS','превью: кадры с медленным наездом, субтитры по строкам, полоска времени; на паузе — кольцо «Дальше» убывает','размер субтитров S/M/L/XL — плавно увеличивается, без перерисовки','тема — круг новой темы растёт из пальца','поиск: «Просмотр › Размер субтитров», тап — открывает папку и один раз подсвечивает строку'],
 from:'Настройки iOS и Telegram — папки с пояснением, что внутри; превью сверху — как в настройках субтитров Apple TV.',
 minus:'Видео в превью — кадрами эпизода; в приложении это будет настоящий кусок эпизода (3–6 с) с нашими субтитрами.',
 mount(R,ctx){s11User(R,ctx)}});
V.push({g:'s11',id:'s11w',n:'Просмотр · с паузами и без',cmp:'set-watch',
 idea:'Сразу открыта папка «Просмотр»: момент из сцены играет сам один раз. Переключи «С паузами / Без пауз» — момент проиграется заново и покажет, как будет в эпизоде. Размер субтитров — меняется на глазах.',
 moves:['«С паузами»: на полезной фразе видео встаёт, сверху «⏸ пауза на фразе», снизу плашка с фразой и «Дальше» (кольцо 2,6 с)','«Без пауз»: плашка выезжает, видео идёт дальше, через 2,4 с она уходит сама','«Ещё раз» — заново'],
 from:'Твоё: «челу проигрывается момент и показывается, как будет».',
 minus:'В макете — кадрами, в приложении — настоящий кусок эпизода.',
 mount(R,ctx){s11User(R,ctx,{openWatch:1})}});
V.push({g:'s11',id:'s11a',n:'Админка · пульт (всё тыкается)',cmp:'set-adm',
 idea:'Админка — «другой мир», как ты просил, но теперь в ней тыкается всё: папки открываются, игроки — шторкой с действиями, флаги — выбор «Всем / Тестерам / Только мне / Выкл», правки копятся и «Сохранить · N», премиум — режим с пояснением, ошибки — по тапу текст, «Проверка установки» — бежит по пунктам. Поиск ищет по всему: игроки, флаги, сцены, папки. Выход — «‹ в приложение» вверху (или крошки «Пульт / …»), обратно в Настройки.',
 moves:['вход: строка развёртки сверху вниз, «ПУЛЬТ» печатается, цифры набегают','папки — сдвигом, строки проявляются по очереди','шторки снизу пружиной; «Сохранить» выезжает, когда есть правки','выход — пульт гаснет, кнопка «Админ-панель» пружинит'],
 from:'Твоё: «админка должна открываться чуть ли не как другое приложение… поиск, всё по папочкам», и «не дал потыкать, непонятно, как отработает выход».',
 minus:'Цифры и игроки в макете выдуманные; в приложении — из воркера (как сейчас в «Игроках» и «Статистике»).',
 mount(R,ctx){s11User(R,ctx);ctx.t(()=>{const b=$('.s11-adm',R);if(b){b.scrollIntoView({block:'center'});ctx.t(()=>b.click(),500)}},900)}});
