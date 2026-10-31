/* ================= v22 · по твоим заметкам к v21 ================= */
// 1–3. Versus с большим портретом: тот же бой (z21v — герой сначала говорит), другая раскладка арены
function vs22(R,ctx,k){y5Vs(R,ctx);R.classList.add('v22',k);
 // «крупный план»: большой — тот, кто сейчас говорит; держим последнего говорившего
 if(k==='v22b'){R.dataset.big='l';const tick=()=>{if(!R.isConnected)return;const t=$('.y5vp.tk',R);if(t)R.dataset.big=t.classList.contains('l')?'l':'r';ctx.t(tick,180)};tick()}
 if(k==='v22c'){const a=$('.y5vs-ar',R);if(a&&!$('.v22-seam',a))a.insertAdjacentHTML('beforeend','<i class="v22-seam"></i><b class="v22-vs">VS</b>')}}
const V22I={v22a:'Оба героя во весь рост, по половине экрана — как в бою в приложении (13.9.65). Задание — шторкой снизу поверх ног, субтитр — посередине. Говорит — светлее и ближе, молчит — в тени.',
 v22b:'Крупный план по очереди: кто говорит — тот на весь экран; второй — кружком в углу и ждёт. Ответил — герой сменился. Как в катсценах файтингов: лицо видно целиком, ничего не обрезано.',
 v22c:'Мой вариант — экран «VS» как в файтинге: экран режет диагональ, герои на всю высоту, каждый в своём треугольнике, на шве — VS. Попал — шов вспыхивает цветом твоего героя.'};
[['v22a','Versus · во весь рост'],['v22b','Versus · крупный план по очереди'],['v22c','Versus · диагональ, как файтинг (мой)']].forEach(([id,n])=>V.push({g:'y22',id:'z22'+id.slice(3),n,
 idea:V22I[id],moves:['герой сначала говорит, потом задание (как в v21)','урон — цифра над героем, полоска наверху','остальное — как в «Versus · герой сначала говорит»'],
 from:'Ты к v21: «Versus — 2 варианта с большим портретом + 1 свой, сравним и определимся, заебался».',
 minus:'Видео героев — твои петли (Венатор, Крыса). Раунды и подсчёт очков те же, что в приложении 13.9.75.',
 mount(R,ctx){vs22(R,ctx,id)}}));

// 4. Меню: сторис одним кружком «Сегодня» + «Что посмотреть» — сначала обычный выбор, лента кнопкой
const LV22=['','Начинающий','Базовый','Средний','Выше среднего','Продвинутый'];
const sc22Min=s=>Math.max(1,Math.round(s.eps.reduce((a,e)=>a+parseInt(e[1]),0)/60)),sc22Ph=s=>s.eps.reduce((a,e)=>a+(+e[2]||0),0);
function z22Pick(R,ctx,from){g11Over(R,ctx,(pv,cc,cl)=>{pv.classList.add('z22p');
  pv.innerHTML=`${SB(0)}<div class="z22p-h"><button class="z22p-x" aria-label="Назад">${ic('back')}</button><b>Что посмотреть</b><button class="z22p-feed">${ic('play')}Лентой</button></div>
   <div class="z22p-seg">${['Все','Фильмы','Сериалы','Интервью'].map((n,i)=>`<button class="${i?'':'on'}" data-c="${i}">${n}</button>`).join('')}</div>
   <div class="z22p-l">${SC4.map((s,j)=>`<button class="z22p-r" data-j="${j}"><i class="img" style="background-image:url(${IMG[s.img]})"></i><span><b>${s.t}</b><small>${s.yr}</small><em>${LV22[s.lv]||''} · ≈ ${sc22Min(s)} мин · ${sc22Ph(s)} фраз</em></span><i class="go">${ic('play')}</i></button>`).join('')}</div>`;
  cc.on($('.z22p-x',pv),'click',cl);
  cc.on($('.z22p-feed',pv),'click',e=>w4Feed(R,ctx,0,e.currentTarget));
  cc.on($('.z22p-l',pv),'click',e=>{const b=e.target.closest('.z22p-r');if(b)w4Feed(R,ctx,+b.dataset.j,b)});
  cc.on($('.z22p-seg',pv),'click',e=>{const b=e.target.closest('button');if(!b)return;$$('.z22p-seg button',pv).forEach(x=>x.classList.toggle('on',x===b));toast(R,'В макете все сцены в одном списке — в приложении фильтр по разделам')});
  $$('.z22p-r',pv).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:80+i*45}))},null,from)}
function z22Menu(R,ctx){q9Menu(R,ctx,'games');R.classList.add('z22m');
 const st=$('.q7-st',R),B=$$('.q7-sti',R);B.forEach((b,i)=>{if(i)b.hidden=true});
 if(B[0]){B[0].classList.add('z22-one');B[0].innerHTML=`<svg class="z22-rg" viewBox="0 0 44 44">${[0,1,2,3,4].map(i=>`<circle r="20" cx="22" cy="22" pathLength="100" stroke-dasharray="17 3" stroke-dashoffset="${-i*20}" class="${i<2?'n':''}"/>`).join('')}</svg><span>${ic('bell')}</span><em>Сегодня</em>`;B[0].title='Сегодня: новое, фраза дня, серия, цель'}
 const w=$('.q7m-i[data-j="2"] small',R);if(w)w.textContent='6 фильмов и сериалов · 2 интервью';
 ctx.on(R,'click',e=>{const b=e.target.closest('.q7m-i[data-j="2"]');if(!b)return;e.stopPropagation();z22Pick(R,ctx,b)},{capture:true})}
V.push({g:'y22',id:'z22m',n:'Меню · «Сегодня» одним кружком, «Что посмотреть» — выбором',
 idea:'Сверху вместо четырёх кружков — один «Сегодня»: внутри по очереди новое, фраза дня, серия и цель (то же, что было, только в одной истории). «Что посмотреть» открывает обычный список сцен — кадр, уровень словами, минуты и фразы. Лента как в TikTok — кнопкой «▶ Лентой» сверху; тап по сцене тоже открывает ленту с неё.',
 moves:['кольцо «Сегодня» — сегментами, жёлтые — непросмотренные','список въезжает каскадом','«Лентой» — та же лента, что раньше'],
 from:'Ты к v21: «сторис — норм, что все показываешь? мб в одно спрятать»; «Что посмотреть — сначала обычный выбор, TikTok-лента кнопкой».',
 minus:'Фильтр «Фильмы / Сериалы / Интервью» в макете не фильтрует — в приложении будет.',
 mount(R,ctx){z22Menu(R,ctx)}});

// 5. После сцены — слова, которые ты нажимал: выбрать, какие в повторение, «Все»
const W22=[['lifeboat','спасательная шлюпка','Get in the boat, Rose. — Садись в шлюпку, Роуз.',1],['survive','выжить','I\'ll survive. — Я выживу.',1],['promise','обещать','Promise me you\'ll survive. — Пообещай, что выживешь.',1],['hold on','держись','Hold on to me. — Держись за меня.',0],['freezing','ледяной','The water is freezing. — Вода ледяная.',0],['let go','отпустить','I\'ll never let go. — Я никогда не отпущу.',1]];
function z22Words(R,ctx){R.className='scr z22w';
 R.innerHTML=`${SB(0)}<div class="z22w-h"><small>ТИТАНИК · ЭПИЗОД 2 ПРОЙДЕН</small><b>Слова, которые ты нажимал</b><p>Отметь, какие учить, — они придут в повторение завтра.</p></div>
  <div class="z22w-bar"><label class="z22w-all"><input type="checkbox" checked><i></i>Все</label><span class="z22w-n"></span></div>
  <div class="z22w-l">${W22.map(([w,ru,ex],i)=>`<label class="z22w-r" data-i="${i}"><input type="checkbox" checked><i class="cb"></i><span><b>${w}</b><em>${ru}</em><small>${ex}</small></span><button class="pl" aria-label="Послушать">${ic('play')}</button></label>`).join('')}</div>
  <div class="z22w-ft"><button class="z22w-go">В повторение</button><button class="z22w-sk">Не сейчас</button></div><i class="hb"></i>`;
 const L=$$('.z22w-r input',R),A=$('.z22w-all input',R),N=$('.z22w-n',R),G=$('.z22w-go',R);
 const upd=()=>{const n=L.filter(x=>x.checked).length;N.textContent=`${n} из ${L.length}`;A.checked=n===L.length;A.indeterminate=n>0&&n<L.length;G.textContent=n?`В повторение · ${n}`:'Ничего не учить';G.classList.toggle('off',!n)};
 L.forEach(x=>ctx.on(x,'change',upd));ctx.on(A,'change',()=>{L.forEach(x=>x.checked=A.checked);upd()});
 ctx.on($('.z22w-l',R),'click',e=>{const b=e.target.closest('.pl');if(!b)return;e.preventDefault();an(b,[{transform:'scale(.85)'},{transform:'none'}],{sp:SPb});toast(R,'▶ Слово — голосом героя из этой реплики')});
 ctx.on(G,'click',()=>{const S=$$('.z22w-r',R).filter(r=>$('input',r).checked);S.forEach((r,i)=>an(r,[{opacity:1,transform:'none'},{opacity:0,transform:'translateY(30px) scale(.9)'}],{d:320,dl:i*60,e:EI,f:'forwards'}));
  ctx.t(()=>toast(R,S.length?`${S.length} ${S.length===1?'слово':S.length<5?'слова':'слов'} в повторении — первое завтра`:'Ок, без повторения'),S.length*60+260)});
 ctx.on($('.z22w-sk',R),'click',()=>toast(R,'Слова останутся в «Мои слова» — без повторения'));
 $$('.z22w-r',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateX(-16px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:120+i*60}));upd()}
V.push({g:'y22',id:'z22w',n:'После сцены · нажатые слова — что в повторение',
 idea:'Досмотрел эпизод — список слов, которые ты нажимал. У каждого — перевод, реплика, где оно было, и ▶ — послушать. Галочки стоят у всех; сверху «Все» — снять или поставить разом. Внизу «В повторение · N» — придут завтра, по интервалам. «Не сейчас» — слова останутся в «Мои слова», без повторения.',
 moves:['строки въезжают по одной','«В повторение» — отмеченные уезжают вниз, тост «придут завтра»','«Все» — галочка становится чертой, если отмечена часть'],
 from:'Твой ответ на вопрос: «нажатые слова — после сцены список, выбрать какие в повторение, кнопка „Все“».',
 minus:'Слова — из «Титаника», эпизод 2; в приложении — те, что ты нажимал в этом эпизоде.',
 mount(R,ctx){z22Words(R,ctx)}});
