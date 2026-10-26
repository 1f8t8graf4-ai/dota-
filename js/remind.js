/* 13.9.76: НАПОМИНАНИЯ И БУДИЛЬНИКИ в стиле iOS (Андрей: «кнопочка, чтобы я мог себе напоминания ставить или будильники, всё в стиле айфона»).
   Самостоятельный модуль: своего стора (localStorage), своих стилей не касается app.js.
   Что умеет:
   • Кнопка-колокольчик на главной → шторка «Напоминания» (лист снизу, граббер, переключатели — как в iOS)
   • Добавить: колесо времени (часы + минуты, шаг 5 мин, как Таймер в iPhone), подпись, дни недели
   • Пока приложение открыто — в назначенное время срабатывает БУДИЛЬНИК на весь экран: время, подпись, звук и вибрация, «Стоп» / «Отложить 5 мин»
   • «В календарь iPhone» — скачивает .ics с ежедневным напоминанием: сработает и когда приложение закрыто
   • «Проверить звук» — разок проиграть сигнал
   • Трекер недели: точки-активность за последние 7 дней (данные dayStat() из app.js, если она доступна)
   API для app.js: RMIND.open(), RMIND.weekHTML(), RMIND.record(), RMIND.badgeOn(), RMIND.start() */
(function(){
'use strict';
var KEY='ddRemind_v1', HKEY='ddDayHist_v1';
var DAYS=['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];          // getDay(): 0=вс
var DAYS_FULL=['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
var ALARM_SND='snd/ios/announce.mp3', TICK_SND='snd/ios/tick.mp3';
var Z=10050;   // выше шторок приложения

/* ---------- стор ---------- */
function load(){try{var v=JSON.parse(localStorage.getItem(KEY));return Array.isArray(v)?v:[];}catch(e){return [];}}
function save(l){try{localStorage.setItem(KEY,JSON.stringify(l));}catch(e){}}
function list(){return load();}
function anyOn(){return load().some(function(r){return r.on!==false;});}
function hist(){try{var v=JSON.parse(localStorage.getItem(HKEY));return (v&&typeof v==='object')?v:{};}catch(e){return {};}}
function histSave(h){try{localStorage.setItem(HKEY,JSON.stringify(h));}catch(e){}}
function dkey(d){d=d||new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);}
function tgHap(kind){try{var T=window.Telegram&&window.Telegram.WebApp;if(T&&T.HapticFeedback){if(kind==='ok')T.HapticFeedback.notificationOccurred('success');else T.HapticFeedback.impactOccurred(kind||'light');}}catch(e){}}
function pad(n){return (n<10?'0':'')+n;}

/* ---------- звук ---------- */
var AUD=null,TICK=null,UNLOCKED=false,VIB_T=0;
function unlock(){if(UNLOCKED)return;try{AUD=new Audio(ALARM_SND);AUD.loop=true;AUD.volume=0.9;AUD.play().then(function(){AUD.pause();AUD.currentTime=0;UNLOCKED=true;}).catch(function(){});}catch(e){}}
function tickSnd(){try{TICK=TICK||new Audio(TICK_SND);TICK.volume=0.25;TICK.currentTime=0;TICK.play().catch(function(){});}catch(e){}}
function alarmStart(){
  try{if(!AUD)AUD=new Audio(ALARM_SND);AUD.loop=true;AUD.volume=0.9;AUD.currentTime=0;AUD.play().catch(function(){});}catch(e){}
  try{if(navigator.vibrate){clearInterval(VIB_T);navigator.vibrate([600,300,600]);VIB_T=setInterval(function(){navigator.vibrate([600,300,600]);},1800);}}catch(e){}
}
function alarmStop(){try{if(AUD){AUD.pause();AUD.currentTime=0;}}catch(e){}try{clearInterval(VIB_T);navigator.vibrate(0);}catch(e){}}
document.addEventListener('pointerdown',unlock,{passive:true});

/* ---------- стили (iOS) ---------- */
function injectCss(){
  if(document.getElementById('rmcss'))return;
  var st=document.createElement('style');st.id='rmcss';st.textContent=RM_CSS;document.head.appendChild(st);
}
var RM_CSS=[
'.rm-dim{position:fixed;inset:0;background:rgba(0,0,0,.42);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);z-index:'+Z+';opacity:0;transition:opacity .28s}',
'.rm-dim.on{opacity:1}',
'.rm-sheet{position:fixed;left:0;right:0;bottom:0;z-index:'+(Z+1)+';background:#F2F2F7;border-radius:22px 22px 0 0;box-shadow:0 -12px 40px rgba(0,0,0,.25);transform:translateY(105%);transition:transform .34s cubic-bezier(.32,.72,.28,1);max-height:86vh;display:flex;flex-direction:column;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Roboto,sans-serif;color:#000;padding-bottom:env(safe-area-inset-bottom)}',
'.rm-sheet.on{transform:translateY(0)}',
'.rm-grab{width:38px;height:5px;border-radius:3px;background:#C7C7CC;margin:8px auto 2px;flex:none}',
'.rm-head{display:flex;align-items:center;justify-content:space-between;padding:10px 18px 6px;flex:none}',
'.rm-head b{font-size:19px;font-weight:700;letter-spacing:-.2px}',
'.rm-act{color:#007AFF;font-size:17px;font-weight:600;background:none;border:none;padding:4px 2px;font-family:inherit}',
'.rm-body{overflow-y:auto;-webkit-overflow-scrolling:touch;padding:4px 14px 18px}',
'.rm-card{background:#fff;border-radius:14px;overflow:hidden;margin-bottom:14px;box-shadow:0 1px 2px rgba(0,0,0,.05)}',
'.rm-row{display:flex;align-items:center;gap:12px;padding:13px 16px;border-bottom:.5px solid rgba(60,60,67,.13);width:100%;background:none;border-left:none;border-right:none;border-top:none;text-align:left;font-family:inherit;color:#000}',
'.rm-row:last-child{border-bottom:none}',
'.rm-time{font-size:26px;font-weight:400;letter-spacing:-.5px;font-variant-numeric:tabular-nums;min-width:78px}',
'.rm-time small{font-size:14px;color:#3C3C43;margin-left:2px}',
'.rm-info{flex:1;min-width:0}',
'.rm-info b{display:block;font-size:15px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
'.rm-info small{font-size:13px;color:#8E8E93}',
'.rm-info small i{font-style:normal;color:#007AFF}',
'.rm-off .rm-time,.rm-off .rm-info b{color:#C7C7CC}',
'.rm-off .rm-info small{color:#C7C7CC}',
'.rm-sw{position:relative;width:51px;height:31px;flex:none;pointer-events:none}',
'.rm-sw i{position:absolute;inset:0;border-radius:16px;background:#E9E9EA;transition:background .22s}',
'.rm-sw i:after{content:"";position:absolute;top:2px;left:2px;width:27px;height:27px;border-radius:50%;background:#fff;box-shadow:0 2px 5px rgba(0,0,0,.2);transition:transform .22s}',
'.rm-sw.on i{background:#34C759}',
'.rm-sw.on i:after{transform:translateX(20px)}',
'.rm-empty{padding:34px 20px;text-align:center;color:#8E8E93;font-size:15px;line-height:1.45}',
'.rm-empty b{display:block;font-size:17px;color:#000;margin-bottom:4px}',
'.rm-foot{padding:0 16px 16px;font-size:12.5px;color:#8E8E93;line-height:1.5;text-align:center}',
'.rm-plus{width:56px;height:56px;border-radius:50%;background:#007AFF;color:#fff;font-size:30px;font-weight:400;border:none;display:block;margin:0 auto 14px;box-shadow:0 4px 14px rgba(0,122,255,.35);font-family:inherit}',
'.rm-ics{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:14px;border-radius:14px;background:#fff;border:none;font-size:16px;font-weight:600;color:#007AFF;font-family:inherit;margin-bottom:14px;box-shadow:0 1px 2px rgba(0,0,0,.05)}',
/* будильник на весь экран */
'.rm-alarm{position:fixed;inset:0;z-index:'+(Z+2)+';background:rgba(12,12,14,.96);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;opacity:0;transition:opacity .3s;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif}',
'.rm-alarm.on{opacity:1}',
'.rm-alarm small{font-size:16px;color:rgba(255,255,255,.55);letter-spacing:.4px;text-transform:uppercase}',
'.rm-alarm .rm-big{font-size:min(88px,22vw);font-weight:200;letter-spacing:-2px;font-variant-numeric:tabular-nums;line-height:1}',
'.rm-alarm .rm-lbl{font-size:20px;font-weight:600;margin-bottom:26px;text-align:center;padding:0 24px}',
'.rm-alarm .rm-btns{display:flex;gap:18px}',
'.rm-abtn{border:none;font-family:inherit;font-size:17px;font-weight:600;padding:0 0;width:112px;height:46px;border-radius:23px}',
'.rm-abtn.stop{background:#fff;color:#000;width:132px;height:52px;font-size:18px}',
'.rm-abtn.zzz{background:rgba(255,255,255,.14);color:#fff}',
/* редактор: колёса */
'.rm-picker{display:flex;justify-content:center;gap:6px;height:190px;margin:10px 0 6px;position:relative}',
'.rm-picker:after,.rm-picker:before{content:"";position:absolute;left:24px;right:24px;height:1px;background:rgba(60,60,67,.2);pointer-events:none}',
'.rm-picker:before{top:calc(50% - 24px)}',
'.rm-picker:after{top:calc(50% + 24px)}',
'.rm-wheel{flex:none;width:76px;height:100%;overflow-y:auto;scroll-snap-type:y mandatory;scrollbar-width:none;padding:71px 0;box-sizing:border-box;-webkit-mask-image:linear-gradient(transparent,#000 26%,#000 74%,transparent);mask-image:linear-gradient(transparent,#000 26%,#000 74%,transparent)}',
'.rm-wheel::-webkit-scrollbar{display:none}',
'.rm-wheel div{height:48px;line-height:48px;text-align:center;font-size:22px;font-variant-numeric:tabular-nums;scroll-snap-align:center;color:#000}',
'.rm-wheel div.sel{font-weight:700}',
'.rm-wheel.wm{width:82px}',
'.rm-inp{width:100%;padding:12px 14px;border-radius:12px;border:none;background:#fff;font-size:16px;font-family:inherit;color:#000;margin:4px 0 12px;box-shadow:0 1px 2px rgba(0,0,0,.05)}',
'.rm-inp::placeholder{color:#C7C7CC}',
'.rm-lab{font-size:13px;font-weight:600;color:#8E8E93;text-transform:uppercase;letter-spacing:.4px;margin:12px 2px 8px}',
'.rm-days{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;justify-content:space-between}',
'.rm-day{width:40px;height:40px;border-radius:50%;background:#fff;border:none;font-size:13px;font-weight:600;color:#000;font-family:inherit;box-shadow:0 1px 2px rgba(0,0,0,.05)}',
'.rm-day.sel{background:#007AFF;color:#fff}',
'.rm-del{width:100%;padding:14px;border-radius:14px;border:none;background:#fff;color:#FF3B30;font-size:16px;font-weight:600;font-family:inherit;margin-bottom:14px;box-shadow:0 1px 2px rgba(0,0,0,.05)}',
/* колокольчик на главной + неделя */
'.n-bell{position:relative;width:38px;height:38px;border-radius:50%;border:none;background:rgba(120,120,128,.14);display:inline-flex;align-items:center;justify-content:center;flex:none;cursor:pointer;margin:0 8px}',
'.n-bell svg{width:19px;height:19px;stroke:#98989F;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}',
'.n-bell.has:after{content:"";position:absolute;top:7px;right:8px;width:7px;height:7px;border-radius:50%;background:#FF453A;box-shadow:0 0 0 2px rgba(0,0,0,.25)}',
'.n-bell:active{transform:scale(.92)}',
'.n-week{display:flex;align-items:center;justify-content:space-between;gap:4px;background:rgba(120,120,128,.1);border-radius:14px;padding:12px 14px;margin:10px 0 14px}',
'.n-week .n-wd{display:flex;flex-direction:column;align-items:center;gap:6px;flex:1}',
'.n-week .n-wd i{width:11px;height:11px;border-radius:50%;background:rgba(120,120,128,.25)}',
'.n-week .n-wd i.full{background:#34C759}',
'.n-week .n-wd i.half{background:linear-gradient(90deg,#FF9F0A 50%,rgba(120,120,128,.25) 50%)}',
'.n-week .n-wd i.today{box-shadow:0 0 0 2px rgba(127,127,132,.45)}',
'.n-week .n-wd small{font-size:10px;color:rgba(110,110,115,.75)}',
'.n-week .n-wt{font-size:11px;color:rgba(110,110,115,.75);flex:none;padding-right:8px}',
].join('\n');

/* ---------- разметка ---------- */function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function daysStr(r){if(!r.days||r.days.length>=7)return 'Каждый день';if(!r.days.length)return 'Каждый день';return r.days.slice().sort().map(function(d){return DAYS[d];}).join(', ');}
function rowHTML(r){
  return '<button class="rm-row'+(r.on===false?' rm-off':'')+'" data-rm="'+r.id+'">'
    +'<span class="rm-time">'+pad(r.h)+':'+pad(r.m)+'</span>'
    +'<span class="rm-info"><b>'+esc(r.label||'Напоминание')+'</b><small>'+esc(daysStr(r))+'</small></span>'
    +'<span class="rm-sw'+(r.on===false?'':' on')+'"><i></i></span>'
    +'</button>';
}
function sheetHTML(L){
  return '<div class="rm-sheet" id="rmSheet"><div class="rm-grab"></div>'
    +'<div class="rm-head"><b>Напоминания</b><button class="rm-act" id="rmDone">Готово</button></div>'
    +'<div class="rm-body">'
    +(L.length?'<div class="rm-card">'+L.map(rowHTML).join('')+'</div>'
      :'<div class="rm-empty"><b>Пока ничего не стоит</b>Заведи будильник — приложение напомнит учить немецкий.</div>')
    +'<button class="rm-plus" id="rmPlus" aria-label="Добавить">+</button>'
    +'<button class="rm-ics" id="rmIcs">📅 Поставить в календарь iPhone</button>'
    +'<div class="rm-foot">Будильник звонит, пока приложение открыто. Чтобы напоминание пришло и в закрытом — «Поставить в календарь iPhone», оно повторяется каждый день.</div>'
    +'</div></div>';
}
/* колесо: values — массив, sel — выбранное */
function wheelHTML(cls,values,sel){
  return '<div class="rm-wheel '+cls+'">'+values.map(function(v){return '<div data-v="'+v+'" class="'+(v===sel?'sel':'')+'">'+v+'</div>';}).join('')+'</div>';
}
var HOURS=[],MINS=[];(function(){for(var h=0;h<24;h++)HOURS.push(pad(h));for(var m=0;m<60;m+=5)MINS.push(pad(m));})();
function editorHTML(r){
  var days=r.days||[0,1,2,3,4,5,6];
  return '<div class="rm-sheet" id="rmSheet"><div class="rm-grab"></div>'
    +'<div class="rm-head"><button class="rm-act" id="rmCancel">Отмена</button><b>'+(r.id?'Изменить':'Напоминание')+'</b><button class="rm-act" id="rmSave">Сохранить</button></div>'
    +'<div class="rm-body">'
    +'<div class="rm-picker" id="rmPick">'+wheelHTML('wh',HOURS,pad(r.h))+wheelHTML('wm',MINS,pad(r.m))+'</div>'
    +'<div class="rm-lab">Подпись</div>'
    +'<input class="rm-inp" id="rmLbl" maxlength="40" placeholder="Немецкий 🇩🇪" value="'+esc(r.label||'')+'">'
    +'<div class="rm-lab">Дни</div>'
    +'<div class="rm-days">'+[1,2,3,4,5,6,0].map(function(d){return '<button class="rm-day'+(days.indexOf(d)>=0?' sel':'')+'" data-d="'+d+'">'+DAYS_FULL[d]+'</button>';}).join('')+'</div>'
    +(r.id?'<button class="rm-del" id="rmDel">Удалить напоминание</button>':'<button class="rm-del" id="rmTest" style="color:#007AFF">Проверить будильник 🔔</button>')
    +'</div></div>';
}
/* ---------- механика шторок ---------- */
var ROOT=null,open_=false;
function root(){
  injectCss();
  if(!ROOT){ROOT=document.createElement('div');ROOT.id='rmRoot';document.body.appendChild(ROOT);}return ROOT;
}
function showSheet(html){
  var R=root();
  R.innerHTML='<div class="rm-dim"></div>'+html;
  open_=true;
  var d=R.querySelector('.rm-dim'),s=R.querySelector('.rm-sheet');
  requestAnimationFrame(function(){d.classList.add('on');s.classList.add('on');});
  d.onclick=function(){closeSheet();};
  tgHap('light');
  return s;
}
function closeSheet(){
  var R=ROOT;if(!R||!open_)return;open_=false;
  var d=R.querySelector('.rm-dim'),s=R.querySelector('.rm-sheet');
  if(d)d.classList.remove('on');if(s)s.classList.remove('on');
  setTimeout(function(){if(!open_&&R)R.innerHTML='';},380);
}
/* открытие списка */
function openList(){
  var s=showSheet(sheetHTML(load()));
  s.querySelector('#rmDone').onclick=closeSheet;
  s.querySelector('#rmPlus').onclick=function(){tgHap('light');openEditor(null);};
  s.querySelector('#rmIcs').onclick=icsToday;
  s.querySelectorAll('[data-rm]').forEach(function(b){
    b.onclick=function(e){
      var sw=b.querySelector('.rm-sw');
      if(e.target.closest('.rm-sw')){                     // тап по переключателю — вкл/выкл
        var L=load(),id=b.dataset.rm,r=L.find(function(x){return x.id===id;});
        if(r){r.on=(r.on===false);save(L);tgHap(r.on===false?'light':'ok');openList();badge();}
        return;
      }
      tgHap('light');openEditor(load().find(function(x){return x.id===b.dataset.rm;}));
    };
  });
}
/* редактор с колёсами */
function openEditor(r){
  r=r||{id:null,h:new Date().getHours(),m:(Math.round(new Date().getMinutes()/5)*5)%60,label:'',days:[0,1,2,3,4,5,6],on:true};
  var s=showSheet(editorHTML(r));
  var wh=s.querySelector('.wh'),wm=s.querySelector('.wm'),days=r.days||[0,1,2,3,4,5,6];
  function wheelInit(w,val){
    var first=w.querySelector('[data-v="'+val+'"]'),idx=first?[].indexOf.call(w.children,first):0;
    // с паддингом 71px сверху позиция пункта idx: scrollTop = idx*48 (последний — ровно в упор)
    var set=function(){w.scrollTop=idx*48;};
    requestAnimationFrame(set);setTimeout(set,80);
    var t=0;
    w.addEventListener('scroll',function(){
      clearTimeout(t);
      w.querySelectorAll('div').forEach(function(x){x.classList.remove('sel');});
      t=setTimeout(function(){
        var i2=Math.round(w.scrollTop/48),el=w.children[Math.max(0,Math.min(w.children.length-1,i2))];
        if(el){w.scrollTop=[].indexOf.call(w.children,el)*48;el.classList.add('sel');tickSnd();tgHap('sel');}
      },130);
    },{passive:true});
  }
  wheelInit(wh,pad(r.h));wheelInit(wm,pad(r.m));
  s.querySelectorAll('.rm-day').forEach(function(b){
    b.classList.toggle('sel',days.indexOf(+b.dataset.d)>=0);
    b.onclick=function(){
      var d=+b.dataset.d,i=days.indexOf(d);
      if(i>=0)days.splice(i,1);else days.push(d);
      b.classList.toggle('sel',i<0);tickSnd();tgHap('light');
    };
  });
  s.querySelector('#rmCancel').onclick=closeSheet;
  var del=s.querySelector('#rmDel');
  if(del)del.onclick=function(){save(load().filter(function(x){return x.id!==r.id;}));tgHap('heavy');closeSheet();setTimeout(openList,60);badge();};
  var tst=s.querySelector('#rmTest');
  if(tst)tst.onclick=function(){alarmStart();setTimeout(alarmStop,2500);tgHap('ok');};
  s.querySelector('#rmSave').onclick=function(){
  function val(w){var idx=Math.round(w.scrollTop/48);var el=w.children[Math.max(0,Math.min(w.children.length-1,idx))];return +(el?el.dataset.v:0);}
    var L=load(),lbl=s.querySelector('#rmLbl').value.trim();
    var rec={id:r.id||('r'+Date.now()),h:val(wh),m:val(wm),label:lbl||'Пора учить немецкий',days:days.length?days:[0,1,2,3,4,5,6],on:true};
    if(r.id){var i=L.findIndex(function(x){return x.id===r.id;});if(i>=0)L[i]=rec;}else L.push(rec);
    L.sort(function(a,b){return a.h*60+a.m-(b.h*60+b.m);});
    save(L);tgHap('ok');closeSheet();setTimeout(openList,60);badge();
  };
}
/* ---------- будильник на весь экран ---------- */
var SNOOZE=0;
function fire(r){
  var R=root();
  alarmStop();alarmStart();
  var big=pad(new Date().getHours())+':'+pad(new Date().getMinutes());
  R.innerHTML='<div class="rm-alarm"><small>Напоминание</small><div class="rm-big">'+big+'</div><div class="rm-lbl">'+esc(r.label||'Пора учить немецкий')+'</div>'
    +'<div class="rm-btns"><button class="rm-abtn zzz" id="rmZzz">Отложить</button><button class="rm-abtn stop" id="rmStop">Стоп</button></div></div>';
  requestAnimationFrame(function(){R.querySelector('.rm-alarm').classList.add('on');});
  R.querySelector('#rmStop').onclick=function(){alarmStop();tgHap('ok');fadeAlarm();};
  R.querySelector('#rmZzz').onclick=function(){alarmStop();tgHap('light');fadeAlarm();SNOOZE=Date.now()+5*60000;SNOOZE_R=r;};
  function fadeAlarm(){var a=R.querySelector('.rm-alarm');if(a)a.classList.remove('on');setTimeout(function(){if(R&&!R.querySelector('.rm-sheet'))R.innerHTML='';},340);}
}
var SNOOZE_R=null;
function tick(){
  var n=new Date(),key=dkey()+' '+pad(n.getHours())+':'+pad(n.getMinutes());
  if(SNOOZE&&Date.now()>=SNOOZE){SNOOZE=0;var rr=SNOOZE_R;SNOOZE_R=null;if(rr)fire(rr);return;}
  var L=load();
  for(var i=0;i<L.length;i++){
    var r=L[i];
    if(r.on===false)continue;
    if(r.h!==n.getHours()||r.m!==n.getMinutes())continue;
    if(Array.isArray(r.days)&&r.days.length<7&&r.days.indexOf(n.getDay())<0)continue;
    if(r._fired===key)continue;
    r._fired=key;save(L);
    fire(r);return;
  }
}
/* ---------- .ics: напоминание в календарь iPhone ---------- */
function icsFor(r){
  var t=new Date();t.setDate(t.getDate()+1);   // завтра, дальше повторяется
  var dt=dkey(t).replace(/-/g,'')+'T'+pad(r.h)+pad(r.m)+'00';
  var byday={1:'MO',2:'TU',3:'WE',4:'TH',5:'FR',6:'SA',0:'SU'};
  var rule=(r.days&&r.days.length&&r.days.length<7)?'RRULE:FREQ=WEEKLY;BYDAY='+r.days.slice().sort().map(function(d){return byday[d];}).join(','):'RRULE:FREQ=DAILY';
  var lbl=(r.label||'Пора учить немецкий').replace(/[,;]/g,' ');
  return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//dota-de//reminders//RU','BEGIN:VEVENT',
    'UID:'+r.id+'@dota-de','DTSTAMP:'+dkey(new Date()).replace(/-/g,'')+'T000000',
    'DTSTART:'+dt,'DTEND:'+dt,'RRULE:'+rule,
    'SUMMARY:'+lbl,
    'DESCRIPTION:Напоминание из приложения «Языки по кино»',
    'BEGIN:VALARM','ACTION:DISPLAY','TRIGGER:-PT0M','DESCRIPTION:'+lbl,'END:VALARM',
    'END:VEVENT','END:VCALENDAR'].join('\r\n');
}
function icsToday(){
  var L=load(),r=L[0];
  if(!r){r={id:'daily',h:20,m:0,label:'Пора учить немецкий',days:[0,1,2,3,4,5,6]};save([r]);badge();}
  try{
    var b=new Blob([icsFor(r)],{type:'text/calendar'});
    var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='napominanie-nemeckiy.ics';
    document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},800);
    tgHap('ok');
  }catch(e){}
}
/* ---------- неделя (точки-активность) ---------- */
function record(){
  var h=hist(),t=dkey(),v=0;
  try{if(typeof dayStat==='function'){var d=dayStat();v=(d&&d.n)||0;}}catch(e){}
  if(h[t]!==v){h[t]=v;var ks=Object.keys(h);if(ks.length>90){ks.sort();ks.slice(0,ks.length-90).forEach(function(k){delete h[k];});}histSave(h);}
}
function weekHTML(){
  try{record();}catch(e){}
  var h=hist(),out='',d=new Date(),goal=(typeof store!=='undefined'&&store&&store.goal)||20;
  var days=[];
  for(var i=0;i<7;i++){days.push(new Date(d));d.setDate(d.getDate()-1);}
  days.reverse();
  out+=days.map(function(dt){
    var v=hist()[dkey(dt)]||0,today=dkey(dt)===dkey();
    var cls=v>=goal?'full':(v>0?'half':'');
    return '<span class="n-wd"><i class="'+cls+(today?' today':'')+'"></i><small>'+DAYS[dt.getDay()]+'</small></span>';
  }).join('');
  return '<div class="n-week anim" aria-label="Активность за неделю"><span class="n-wt">Неделя</span>'+out+'</div>';
}
function badgeSync(){
  var b=document.getElementById('nRemind');
  if(b)b.classList.toggle('has',anyOn());
}
function badge(){try{badgeSync();}catch(e){}}
function start(){
  if(start._on)return;start._on=true;
  injectCss();
  setInterval(function(){try{tick();record();badgeSync();}catch(e){}},15000);
}

/* ---------- API ---------- */
window.RMIND={
  open:function(){unlock();openList();start();},
  weekHTML:weekHTML,
  record:record,
  badge:badge,
  start:start,
  list:list
};
if(document.readyState!=='loading')start();
else document.addEventListener('DOMContentLoaded',start);
})();
