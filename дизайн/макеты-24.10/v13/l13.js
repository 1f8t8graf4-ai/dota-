/* --- Обучение v13 (Андрей на v12): награда — карточка, а не кадр («кадры убери»); фон сцены — только в исключительных случаях
   (вручную или как редкая случайная награда); главный фон фильма — за 100 % всего фильма; объяснять как игроку, а не как админу --- */
const card13=(im,r,n)=>`<span class="cd13 r-${r}"><i class="img" style="background-image:url(${IMG[im]})"></i><i class="sh"></i><b>${n||''}</b><em>${{c:'обычная',s:'редкая',g:'золотая'}[r]}</em></span>`;
function deep13(R,ctx,kind){R.className='scr v8 dp12 dp13 dp13-'+kind;let touched=false;ctx.on(R,'pointerdown',()=>{touched=true},{capture:true});const fx=()=>FX(ctx,$('.fx',R));
 if(kind==='scene'){R.innerHTML=`${SB(0)}<div class="dp12-top"><i class="img" style="background-image:url(${IMG.bd_psycho})"></i><i class="sh"></i><small>АМЕРИКАНСКИЙ ПСИХОПАТ · ЭП. 1 ПРОЙДЕН</small><b>Ты знаешь <em class="n">31</em> из 100 слов сцены</b></div>
   <div class="dp12-grid">${dots12(100,31,0)}</div>
   <p class="dp12-q">Хватит — норм. Хочешь ещё — без проблем.</p>
   <div class="dp12-ch"><button class="dc0" data-a="0"><b>Дальше смотреть</b><small>эпизод 2 · прогресс останется</small></button>
    <button class="dc1" data-a="30"><span class="tg">УГЛУБЛЁННОЕ</span><b>Ещё 30 слов</b><small>≈ 6 мин · двумя подходами</small><span class="rw">${card13('p_psycho','c')}<em>карточка сцены «Офис»</em></span></button>
    <button class="dc2" data-a="69"><span class="tg">ПОЛНОЕ</span><b>Все 100</b><small>≈ 20 мин · частями, когда хочешь</small><span class="rw">${card13('p_psycho','g')}<em>золотая карточка + «Знаток сцены»</em></span></button></div>
   <div class="dp13-rw"><small>ЕЩЁ НАГРАДЫ</small>
    <span class="f">${ic('film11')}<span><b>Живой фон фильма</b><small>когда весь «Американский психопат» на 100 %</small><i class="pb"><i style="--p:.18"></i></i></span><em>18 %</em></span>
    <span class="r">${ic('star')}<span><b>Фон сцены — редкость</b><small>иногда выпадает сам, за любой подход</small></span></span></div>
   <p class="dp12-nt">Никто не заставляет. Ушёл — вернёшься с 32-го слова.</p><canvas class="fx"></canvas><i class="hb"></i>`;
  const G=$$('.dp12-grid i',R),N=$('.dp12-top .n',R),F=fx();
  G.forEach((d,j)=>an(d,[{opacity:0,transform:'scale(.2)'},{opacity:1,transform:'none'}],{d:300,dl:200+j*7,e:EO}));countUp(ctx,N,31,1100);
  $$('.dp12-ch button,.dp13-rw>*',R).forEach((b,j)=>an(b,[{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:900+j*70}));
  an($('.dp13-rw .pb i',R),[{transform:'scaleX(0)'},{transform:'scaleX(var(--p))'}],{d:1000,e:EO,f:'forwards',dl:1500});
  const prev=a=>{G.forEach((d,j)=>{d.classList.toggle('a',j>=31&&j<31+a)});N.textContent=31+a;N.classList.toggle('up',a>0)};
  $$('.dp12-ch button',R).forEach(b=>{ctx.on(b,'pointerenter',()=>prev(+b.dataset.a));ctx.on(b,'pointerleave',()=>prev(0));
   ctx.on(b,'click',()=>{touched=true;const a=+b.dataset.a;an(b,[{transform:'scale(.96)'},{transform:'none'}],{sp:SPb});if(!a){toast(R,'Эпизод 2 — поехали. 31 из 100 сохранено');return}prev(a);
    const c=$('.cd13',b);if(c)an(c,[{transform:'rotate(-8deg) scale(1)'},{transform:'rotate(4deg) scale(1.35)'},{transform:'rotate(-8deg) scale(1)'}],{d:700,e:EO});
    const r=rel($('.dp12-grid',R),R);F.burst(r.x+r.w/2,r.y+r.h/2,{n:40,c:a>30?['#F6D488','#fff','#E8B34B']:['#2EE6C5','#fff'],v:5,g:.05,s:2.2,l:44});toast(R,a>30?'Полное: 10 слов за подход — бросить можно в любой момент':'Углублённое: 15 слов сейчас, 15 — когда захочешь')})});
  ctx.t(()=>{if(!touched){prev(30);$('.dc1',R).classList.add('hv');ctx.t(()=>{if(touched)return;prev(69);$('.dc1',R).classList.remove('hv');$('.dc2',R).classList.add('hv');ctx.t(()=>{if(!touched){prev(0);$('.dc2',R).classList.remove('hv')}},1800)},1800)}},2600);return}
 if(kind==='full'){const M=[[50,'карточка сцены','c'],[75,'редкая карточка','s'],[100,'золотая карточка + «Знаток сцены»','g']];
  R.innerHTML=`${SB(0)}<div class="dp12-fh"><small>ПОЛНОЕ ОБУЧЕНИЕ · «ОФИС»</small><b>64 из 100 слов</b><span>осталось ≈ 7 мин</span></div>
   <div class="dp13-how"><small>КАК ЭТО РАБОТАЕТ</small>
    <span><i>1</i><b>Учишь по 10 слов за раз</b><small>≈ 2 минуты, задания как в проверке</small></span>
    <span><i>2</i><b>Бросил — ничего не сгорает</b><small>вернёшься — продолжишь с того же слова</small></span>
    <span><i>3</i><b>На 50, 75 и 100 % — карточки</b><small>каждая лучше прошлой, лежат в «Коллекции»</small></span></div>
   <div class="dp13-tr"><div class="dp12-ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" class="bg"/><circle cx="60" cy="60" r="52" class="fg" style="--p:.64"/>${M.map(([p])=>{const a=(p/100)*Math.PI*2-Math.PI/2;return `<circle cx="${(60+Math.cos(a)*52).toFixed(1)}" cy="${(60+Math.sin(a)*52).toFixed(1)}" r="4.6" class="ms${p<=64?' got':''}"/>`}).join('')}</svg><b>64<small>%</small></b></div>
    <div class="dp13-cds">${M.map(([p,n,r])=>`<span class="${p<=64?'got':''}">${card13('p_psycho',r)}<b>${p} %</b><small>${n}</small></span>`).join('')}</div></div>
   <div class="dp13-rw"><span class="f">${ic('film11')}<span><b>Весь фильм на 100 % — живой фон фильма</b><small>«Офис» 64 % · «Визитки» 0 % · «Утро» 0 %</small><i class="pb"><i style="--p:.21"></i></i></span><em>21 %</em></span></div>
   <div class="dp12-nx"><small>СЛЕДУЮЩИЕ 10 СЛОВ</small><span>${['sculpted','tan','reservation','lunch','partner','merger'].map(w=>`<i>${w}</i>`).join('')}<i class="m">+4</i></span><button class="pri">Продолжить · 10 слов · 2 мин</button><button>Передохнуть — прогресс не сгорит</button></div><canvas class="fx"></canvas><i class="hb"></i>`;
  const fg=$('.dp12-ring .fg',R);an(fg,[{strokeDashoffset:'326.7'},{strokeDashoffset:String(326.7*(1-.64))}],{d:1300,e:EO,f:'forwards'});countUp(ctx,$('.dp12-ring b',R).firstChild,64,1300);
  $$('.dp13-how>span,.dp13-cds>span,.dp13-rw>*,.dp12-nx>*',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:300+i*60}));
  an($('.dp13-rw .pb i',R),[{transform:'scaleX(0)'},{transform:'scaleX(var(--p))'}],{d:1000,e:EO,f:'forwards',dl:1200});
  $$('.dp12-nx button',R).forEach(b=>ctx.on(b,'click',()=>{an(b,[{transform:'scale(.96)'},{transform:'none'}],{sp:SPb});toast(R,b.classList.contains('pri')?'10 слов · ≈ 2 мин':'Ок — продолжишь, когда захочешь')}));
  $$('.dp13-cds>span',R).forEach(s=>ctx.on(s,'click',()=>{const c=$('.cd13',s);an(c,[{transform:'rotateY(0)'},{transform:'rotateY(180deg)'},{transform:'rotateY(360deg)'}],{d:700,e:EO});toast(R,s.classList.contains('got')?'Уже твоя — лежит в «Коллекции»':'Откроется на '+$('b',s).textContent)}));return}}

/* --- Уровень героя v13 (Андрей: «награды должны идти за уровень, а не иконка просто после комикса»):
   комикс, проверка, углубление и Versus дают опыт; награды даёт только уровень. --- */
const LVT13=[[1,'иконка героя','ic'],[2,'рамка иконки','fr'],[3,'серебряная рамка','sv'],[4,'карточка героя','cd'],[5,'вход в бой','en'],[6,'фон героя в профиль','bg'],[7,'реплика победы','vo'],[8,'анимация удара','hit'],[9,'рамка в профиль','pf'],[10,'золотая иконка','gd']];
function lv13(R,ctx){R.className='scr v8 lv13';const L=LV13.venator;let touched=false;ctx.on(R,'pointerdown',()=>{touched=true},{capture:true});
 const node=([n,t,c])=>`<span class="nd ${n<L.lv?'got':n===L.lv?'now':''}" data-n="${n}"><i class="dt">${n<=L.lv?ic('check'):n}</i><span class="rw r-${c}">${c==='ic'||c==='fr'||c==='sv'||c==='gd'?`<i class="ic13 f-${c}">${hic12('venator')}</i>`:ic({cd:'cards13',en:'swords13',bg:'img',vo:'snd',hit:'bolt',pf:'user'}[c])}</span><b>ур. ${n}</b><small>${t}</small></span>`;
 R.innerHTML=`${SB(0)}<div class="lv13-hd">${loc13('venator')}<i class="dm"></i><span class="ico">${hic12('venator','big')}</span><span class="tx"><small>VENATOR</small><b>Уровень ${L.lv}</b><span class="xp"><i style="--p:${(L.xp/L.nx).toFixed(2)}"></i></span><em>${L.xp} / ${L.nx} опыта · ещё ${L.nx-L.xp} до ур. ${L.lv+1}</em></span></div>
  <p class="lv13-k"><b>Главное — уровень.</b> Комиксы и Versus дают опыт, а награду даёт только уровень. Иконку «просто за комикс» больше не выдаём.</p>
  <div class="g11-sec"><b>Что даёт каждый уровень</b><small>листай →</small></div>
  <div class="lv13-tr"><i class="ln"><i style="--p:${((L.lv-1)/9).toFixed(3)}"></i></i>${LVT13.map(node).join('')}</div>
  <div class="g11-sec"><b>Откуда опыт</b><small>за Венатора</small></div>
  <div class="lv13-xp">${[['book11','Прочитал главу','+30'],['check','Закрепил главу · 3 вопроса','+30'],['deep11','Углубил главу','×2 за неё'],['swords13','Versus: победа · поражение','+40 · +10'],['radar','Перехват с Радара','×2 опыта']].map(([i,t,v])=>`<span>${ic(i)}<b>${t}</b><em>${v}</em></span>`).join('')}</div>
  <div class="lv13-vs"><small>Так тебя видят друзья в Versus</small><div class="rw13">${[[1,'ур. 1'],[3,'ур. 3'],[10,'ур. 10']].map(([n,t])=>`<span class="f-${n===1?'ic':n===3?'sv':'gd'}"><i class="ic13">${hic12('venator')}</i><em>${t}</em></span>`).join('')}</div><p>Силы уровень не даёт — бой честный. Только вид.</p></div><canvas class="fx"></canvas><i class="hb"></i>`;
 const fx=FX(ctx,$('.fx',R));an($('.lv13-hd .xp i',R),[{transform:'scaleX(0)'},{transform:'scaleX(var(--p))'}],{d:1100,e:EO,f:'forwards',dl:300});
 an($('.lv13-tr .ln>i',R),[{transform:'scaleX(0)'},{transform:'scaleX(var(--p))'}],{d:1200,e:EO,f:'forwards',dl:500});
 $$('.lv13-tr .nd',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(16px) scale(.9)'},{opacity:1,transform:'none'}],{sp:SPs,dl:400+i*60}));
 $$('.lv13-xp>span,.lv13-vs',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:900+i*60}));
 ctx.on($('.lv13-tr',R),'click',e=>{const n=e.target.closest('.nd');if(!n)return;touched=true;const v=+n.dataset.n,x=LVT13[v-1];an(n,[{transform:'scale(.92)'},{transform:'none'}],{sp:SPb});toast(R,v<=L.lv?`ур. ${v} — ${x[1]}: уже твоё`:`ур. ${v} — ${x[1]}: ещё ≈ ${(L.nx-L.xp)+(v-L.lv-1)*200} опыта`)});
 // без касания: «получить» ур. 3 — опыт добегает, рамка становится серебряной
 ctx.t(()=>{if(touched)return;const tr=$('.lv13-tr',R),n3=$('.nd[data-n="3"]',R);tr.scrollTo({left:Math.max(0,n3.offsetLeft-120),behavior:'smooth'});
  ctx.t(()=>{if(touched)return;an($('.lv13-hd .xp i',R),[{transform:`scaleX(${(L.xp/L.nx).toFixed(2)})`},{transform:'scaleX(1)'}],{d:900,e:EO,f:'forwards'});$('.lv13-hd em',R).textContent='500 / 500 · новый уровень!';
   ctx.t(()=>{if(touched)return;n3.classList.add('now');$('.nd[data-n="2"]',R).classList.replace('now','got');$('.lv13-hd .tx b',R).textContent='Уровень 3';const ico=$('.lv13-hd .ico',R);ico.classList.add('f-sv');
    const r=rel(n3,R);fx.burst(r.x+r.w/2,r.y+24,{n:46,c:['#DDE6F2','#fff','#9FB3C8'],v:5.5,g:.08,s:2.4,l:46});an(ico,[{transform:'scale(1)'},{transform:'scale(1.25)'},{transform:'scale(1)'}],{sp:SPb});toast(R,'Уровень 3 — серебряная рамка иконки')},950)},1100)},3200)}

/* --- «Понимаешь %» v13: как видит игрок (Андрей: «добавляй, только чуть улучши») --- */
function pct13(R,ctx){R.className='scr v8 pc12 pc13';const IT=[['Nice tan',1,'«Офис», 2 дня назад'],['reservation',1,'«Визитки», вчера'],['I have to return some videotapes',0,''],['sculpted',0,''],['Is that Patrick?',1,'«Офис», сегодня'],['merger',1,'«Офис», 3 дня назад'],['partner',1,'«Волк», неделю назад'],['lunch',1,'«Волк», 5 дней назад'],['Dorsia',0,''],['business card',1,'«Визитки», вчера'],['impressive',0,''],['nice try',1,'«Таксист», 4 дня назад']];
 const known=IT.filter(x=>x[1]).length,N=IT.length,AFT=[3,8],pct=v=>Math.round(v/N*100);
 R.innerHTML=`${SB(0)}<div class="pc13-sc"><i class="img" style="background-image:url(${IMG.bd_psycho})"></i><i class="sh"></i><span><small>АМЕРИКАНСКИЙ ПСИХОПАТ · ЭП. 1</small><b>Понимаешь <em class="v1">${pct(known)}</em>%</b></span><button class="q">?</button></div>
  <div class="pc13-ex"><b>Что это значит</b><p>В этом эпизоде <b>${N} главных</b> слов и фраз. Ты уже знаешь <b class="kn">${known}</b> — значит, понимаешь <b class="pe">${pct(known)}</b> %. Знаешь — это когда хоть раз ответил верно с первого раза, в любой сцене.</p></div>
  <div class="pc12-it">${IT.map((x,j)=>`<button class="${x[1]?'k':''}" data-j="${j}">${x[0]}</button>`).join('')}</div>
  <p class="pc13-tip">нажми на слово — покажу, где ты его выучил</p>
  <div class="pc13-af"><small>ПОСЛЕ ЭПИЗОДА</small><span><b class="v0">${pct(known)}</b><i>${ic('chev')}</i><b class="v2">${pct(known)}</b>%</span><em>ответил верно ещё на 2 слова</em></div>
  <p class="pc12-n">Ошибся — процент не падает. Вместо «−3 %» пишу «2 слова просят повторения».</p><canvas class="fx"></canvas><i class="hb"></i>`;
 const fx=FX(ctx,$('.fx',R));$$('.pc12-it button',R).forEach((x,i)=>an(x,[{opacity:0,transform:'scale(.7)'},{opacity:1,transform:'none'}],{sp:SPb,dl:200+i*40}));
 ctx.on($('.pc12-it',R),'click',e=>{const b=e.target.closest('button');if(!b)return;const x=IT[+b.dataset.j];an(b,[{transform:'scale(1.12)'},{transform:'none'}],{sp:SPb});toast(R,b.classList.contains('nw')?`${x[0]} — ответил верно только что`:x[1]?`${x[0]} — знаешь: ${x[2]}`:`${x[0]} — ещё не встречал, будет в заданиях`)});
 ctx.on($('.pc13-sc .q',R),'click',()=>{const e=$('.pc13-ex',R);an(e,[{boxShadow:'0 0 0 2px #F6D488'},{boxShadow:'0 0 0 0 transparent'}],{d:1200})});
 const go=()=>{AFT.forEach((j,n)=>ctx.t(()=>{const s=$(`.pc12-it [data-j="${j}"]`,R);s.classList.add('k','nw');an(s,[{transform:'scale(1.3)'},{transform:'none'}],{sp:SPb});const r=rel(s,R);fx.burst(r.x+r.w/2,r.y+r.h/2,{n:16,c:['#4FD18B','#fff'],v:3,g:0,s:1.8,l:28});
  if(n===AFT.length-1){countUp(ctx,$('.v2',R),pct(known+AFT.length),700,pct(known));countUp(ctx,$('.pc13-sc .v1',R),pct(known+AFT.length),700,pct(known));$('.kn',R).textContent=known+AFT.length;$('.pe',R).textContent=pct(known+AFT.length);$('.pc13-af',R).classList.add('up')}},n*700))};ctx.t(go,2200)}

/* --- Советы нейронок — просто (Андрей: «вопрос 5 вообще не понял, очень сложно»): по одному, обычными словами, с примером.
   Мои ответы, где я сказал «беру», он одобрил («можешь брать») — они сверху как решённые. --- */
const OP13=[{id:'a1',t:'После эпизода — две кнопки: «Закрепить · 1 мин» и «Смотреть дальше».',ex:'Досмотрел → две равные кнопки. Задания сами не выскакивают.',by:'ChatGPT',me:'y',why:'не давит: кто хочет — закрепит'},
 {id:'a2',t:'Заданий за раз мало: 3, максимум 5.',ex:'«Закрепить» — это 3 вопроса, а не 10.',by:'ChatGPT · Зетка',me:'y',why:'в приложении уже так'},
 {id:'a3',t:'Ошибся — одна строка «почему». Остальное — по кнопке.',ex:'«hide — прятаться». «Почему другие нет?» — если нажмёшь.',by:'ChatGPT',me:'y',why:'меньше текста на экране'},
 {id:'a4',t:'Ошибся — эта фраза вернётся в конце этого же захода.',ex:'Неверно на «show your face» → через 2 вопроса она снова.',by:'ChatGPT',me:'y',why:'закрепляет сразу, а не завтра'},
 {id:'a5',t:'Пропустил день — серия не сгорает, а замерзает.',ex:'Не зашёл в субботу → «Серия заморожена · 1 из 2 в неделю».',by:'ChatGPT · Gemini · Зетка',me:'y',why:'не наказываем — так возвращаются'},
 {id:'a6',t:'В каждом задании звучит реплика из фильма.',ex:'«Что значит crumbum?» — и сразу голос Короля.',by:'Gemini',me:'y',why:'учимся по живой речи — наша фишка'},
 {id:'a7',t:'Без «долгов»: «Разогрев · 3 вопроса», а не «Повторить 45».',ex:'На главной всегда 3, даже если накопилось 45.',by:'Gemini · Зетка',me:'y',why:'цифра 45 пугает и не даёт начать'},
 {id:'a8',t:'Слова, которые ты нажимал, — после эпизода списком. Сам решаешь, учить ли.',ex:'«Тебя заинтересовало: tan, merger, sculpted» — галочки.',by:'ChatGPT · Зетка',me:'y',why:'сам нажал — значит, интересно'},
 {id:'a9',t:'Выученное слово звучит в новой реплике — «я это знаю!».',ex:'Выучил «hide» → в эпизоде 3 оно снова, подсвечено.',by:'Зетка',me:'y',why:'приятно и закрепляет'},
 {id:'a10',t:'Бот присылает вопрос из вчерашнего эпизода — отвечаешь прямо в чате.',ex:'В Telegram: «Что значит „show your face“?» и 3 кнопки.',by:'Gemini',me:'l',why:'позже: сначала «Фраза дня» с переходом'},
 {id:'a11',t:'Проверка главы комикса — строго обязательна.',ex:'Не ответил на 3 вопроса — следующая глава закрыта.',by:'Gemini',me:'n',why:'против: глава открыта, проверка ждёт значком'}];
const OPOK13=[['Прогресс «до и после»: «понимаешь 67 → 83 %»','как считаю — экран «Понимаешь %»'],['Уровень героя даёт вид, а не силу','рамка иконки, вход в бой, реплика победы'],['«Фраза дня» — кусок твоего эпизода','кнопка открывает эпизод на этой секунде']];
function ops13(R,ctx){R.className='scr v8 op13';let S={},i=0;try{S=JSON.parse(localStorage.getItem('kd13-op')||'{}')}catch(e){}const save=()=>{try{localStorage.setItem('kd13-op',JSON.stringify(S))}catch(e){}};
 const T={y:'Беру',n:'Не надо',l:'Потом'};
 R.innerHTML=`${SB(0)}<div class="op13-hd"><b>Советы нейронок</b><small>по одному, коротко. Отвечай «Беру» или «Не надо».</small></div>
  <div class="op13-ok"><small>УЖЕ РЕШЕНО · ты сказал «можешь брать»</small>${OPOK13.map(([a,b])=>`<span>${ic('check')}<b>${a}</b><em>${b}</em></span>`).join('')}</div>
  <div class="op13-pr"><i></i></div><div class="op13-st"></div>
  <div class="op13-bt"><button class="n" data-v="n">Не надо</button><button class="y" data-v="y">Беру</button></div><button class="op13-l" data-v="l">Потом</button>
  <div class="op13-sm" hidden></div><i class="hb"></i>`;
 const st=$('.op13-st',R);
 function card(dir){if(i>=OP13.length){sum();return}const x=OP13[i];st.innerHTML=`<div class="op13-c"><small>СОВЕТ ${i+1} ИЗ ${OP13.length} · ${x.by}</small><b>${x.t}</b><span class="ex"><i>как будет</i>${x.ex}</span><span class="me me-${x.me}">Я бы: <b>${T[x.me].toLowerCase()}</b> — ${x.why}</span>${S[x.id]?`<em class="was">твой ответ: ${T[S[x.id]]}</em>`:''}</div>`;
  $('.op13-pr i',R).style.transform=`scaleX(${(i/OP13.length).toFixed(3)})`;an($('.op13-c',st),[{opacity:0,transform:`translateX(${dir||40}px) rotate(${(dir||40)/12}deg)`},{opacity:1,transform:'none'}],{sp:SPs})}
 function vote(v){const x=OP13[i];if(!x)return;S[x.id]=v;save();const c=$('.op13-c',st);const z=an(c,[{opacity:1,transform:'none'},{opacity:0,transform:`translateX(${v==='y'?220:v==='n'?-220:0}px) translateY(${v==='l'?40:0}px) rotate(${v==='y'?12:v==='n'?-12:0}deg)`}],{d:260,e:EI,f:'forwards'});i++;const nx=()=>card(v==='n'?-40:40);if(z)z.onfinish=nx;else nx()}
 function sum(){$('.op13-pr i',R).style.transform='scaleX(1)';$('.op13-bt',R).hidden=true;$('.op13-l',R).hidden=true;st.innerHTML='';const s=$('.op13-sm',R);s.hidden=false;
  s.innerHTML=`<b>Готово</b>${OP13.map(x=>`<span class="v-${S[x.id]||'q'}">${S[x.id]==='y'?ic('check'):S[x.id]==='n'?ic('x'):'·'}<em>${x.t}</em></span>`).join('')}<div class="bt"><button class="cp pri">Скопировать ответы</button><button class="rs">Заново</button></div>`;
  an(s,[{opacity:0,transform:'translateY(20px)'},{opacity:1,transform:'none'}],{sp:SPs});
  ctx.on($('.cp',s),'click',()=>{let t='Советы нейронок — мои ответы:\n';OP13.forEach((x,n)=>{t+=`${n+1}. ${x.t} — ${S[x.id]?T[S[x.id]]:'?'}\n`});const ok=()=>toast(R,'Скопировал — вставь мне в чат');try{navigator.clipboard.writeText(t).then(ok,()=>toast(R,'Не скопировалось — выдели текст выше'))}catch(e){toast(R,'Не скопировалось — выдели текст выше')}});
  ctx.on($('.rs',s),'click',()=>{i=0;s.hidden=true;$('.op13-bt',R).hidden=false;$('.op13-l',R).hidden=false;card()})}
 ctx.on(R,'click',e=>{const b=e.target.closest('[data-v]');if(!b)return;an(b,[{transform:'scale(.92)'},{transform:'none'}],{sp:SPb});vote(b.dataset.v)});
 drag(ctx,st,{axis:'x',move(dx){const c=$('.op13-c',st);if(c)c.style.transform=`translateX(${dx}px) rotate(${dx/16}deg)`},end(dx){const c=$('.op13-c',st);if(Math.abs(dx)>90)vote(dx>0?'y':'n');else if(c){c.style.transform='';an(c,[{transform:`translateX(${dx}px)`},{transform:'none'}],{sp:SPs})}}});
 $$('.op13-ok>span',R).forEach((x,j)=>an(x,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:100+j*60}));card()}
