/* ================= v11 · Обучение ================= */
// 1) проверка: перевод реплики после ответа — никому / новичкам (первые 7 дней)
function l11Check(R,ctx){l8Check(R,ctx);R.classList.add('l11','l11-exp');
 R.insertAdjacentHTML('beforeend',`<div class="l11-who"><small>Перевод реплики после ответа</small><div class="sg"><button class="on" data-m="exp">никому</button><button data-m="new">новичкам · 7 дней</button><i></i></div></div>`);
 const W=$$('.l11-who button',R),set=(i,quiet)=>{W.forEach((x,j)=>x.classList.toggle('on',j===i));$('.l11-who i',R).style.transform=`translateX(${i*100}%)`;R.classList.toggle('l11-exp',i===0);if(!quiet)toast(R,i?'Новичок: первую неделю перевод реплики — после ответа':'Перевода нет — только «почему ловушка» под вариантами')};
 let touched=false;ctx.t(()=>ctx.on(R,'pointerdown',()=>{touched=true},{capture:true}),30);
 W.forEach((b,i)=>ctx.on(b,'click',e=>{e.stopPropagation();touched=true;set(i)}));
 an($('.l11-who',R),[{opacity:0,transform:'translateY(20px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:300});
 // демо: второй вопрос — как видит новичок, третий — снова «никому»
 ctx.t(()=>{if(!touched)set(1)},5600);ctx.t(()=>{if(!touched)set(0)},10600)}

// 2) после эпизода: «Тебя заинтересовало» (что нажимал) — карточки с кадром; ниже «Выучим из эпизода»
const TAP11=[{w:'aerobics',ru:'аэробика',l:'<u>Aerobics</u> class. Sorry.',lr:'Аэробика. Простите.',fr:'ak1',t:'0:14',lv:1},
 {w:'occasionally',ru:'иногда',l:'I <u>occasionally</u> box.',lr:'Иногда я боксирую.',fr:'ak2',t:'0:31',lv:3},
 {w:'reservation',ru:'бронь (столика)',l:'I need <u>reservations</u> for three.',lr:'Мне нужен столик на троих.',fr:'ak3',t:'0:52',lv:2}];
const L11N=[['Тебя заинтересовало','ты нажимал во время просмотра'],['Ты нажимал','слова, которые ты тапнул в субтитрах'],['Зацепило тебя','что ты нажимал во время просмотра']];
function l11Scene(R,ctx){R.className='scr v8 l11s';let mode='a',nm=0;
 const pool=()=>{const tw=TAP11.map(t=>({t:'w',x:t.w,ru:t.ru,src:t.l,tap:1}));const le=LE8.filter(l=>!TAP11.some(t=>l[2].toLowerCase().startsWith(t.w.slice(0,6)))).map(l=>({t:l[1],x:l[2],ru:l[3],src:l[0]}));return tw.concat(le).filter(i=>mode==='a'||i.t===mode).slice(0,5)};
 R.innerHTML=`${SB(0)}<div class="l11s-pg"><div class="l11s-hd"><div><small>ЭПИЗОД 1 ДОСМОТРЕН · АМЕРИКАНСКИЙ ПСИХОПАТ</small><b>Ты понял эпизод</b></div><span class="rg"><svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="25" class="t"/><circle cx="30" cy="30" r="25" class="p" pathLength="100"/></svg><b>0%</b></span></div>
  <button class="l11s-st"><span class="tt"><b>${L11N[0][0]}</b><small>${L11N[0][1]} · ${TAP11.length}</small></span><i class="ch">${ic('swap')}<em>название</em></i></button>
  <div class="l11s-cs">${TAP11.map((t,j)=>`<div class="l11s-c" data-j="${j}"><div class="im"><i class="img" style="background-image:url(${IMG[t.fr]})"></i><button class="pm" aria-label="Смотреть момент">${ic('play')}</button><em>${t.t}</em>${bars(t.lv)}</div>
   <div class="bd"><b>${t.w}</b><span class="ru">${t.ru}</span><p>${t.l}</p><small>${t.lr}</small></div>
   <div class="ft"><button class="sv">${ic('star')}<span>В мои слова</span></button><button class="sw" data-s="${t.w}">${ic('snd')}</button></div></div>`).join('')}</div>
  <div class="l11s-h2"><b>Выучим из эпизода</b><div class="sg"><button data-c="w">Слова</button><button data-c="p">Фразы</button><button class="on" data-c="a">Всё</button><i></i></div></div>
  <div class="l11s-ls"></div></div>
  <div class="l11s-bt"><button class="go"></button><button class="sk">Позже</button></div><canvas class="fx"></canvas><i class="hb"></i>`;
 const fx=FX(ctx,$('.fx',R)),ls=$('.l11s-ls',R),go=$('.l11s-bt .go',R),SG=$$('.l11s-h2 .sg button',R);let touched=false;ctx.on(R,'pointerdown',()=>{touched=true},{capture:true});
 function list(anim){const L=pool();ls.innerHTML=L.map(i=>`<div class="r"><button class="sw" data-s="${esc0(i.x)}">${ic('snd')}</button><span class="c ${i.t}"><em>${i.t==='w'?'слово':'фраза'}${i.tap?' · <i>нажимал</i>':''}</em><b>${esc0(i.x)}</b><small>${esc0(i.ru)}</small></span></div>`).join('');
  go.innerHTML=`Учить ${L.length} · ≈ ${Math.max(1,Math.round(L.length*12/60))} мин ${ic('chev')}`;if(anim)$$('.r',ls).forEach((r,i)=>an(r,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:i*45}))}
 SG.forEach((b,i)=>ctx.on(b,'click',()=>{mode=b.dataset.c;SG.forEach(x=>x.classList.toggle('on',x===b));$('.l11s-h2 .sg i',R).style.transform=`translateX(${i*100}%)`;list(true)}));
 $('.l11s-h2 .sg i',R).style.transform='translateX(200%)';list(false);
 // кольцо «понял»
 const p=$('.l11s-hd .p',R),rn=$('.l11s-hd .rg b',R);p.style.strokeDashoffset='100';ctx.t(()=>{p.style.strokeDashoffset=String(100-86);countUp(ctx,{set textContent(v){rn.textContent=v+'%'}},86,1100)},380);
 // название блока — три варианта, тап — следующий
 const st=$('.l11s-st',R);ctx.on(st,'click',()=>{nm=(nm+1)%L11N.length;const tt=$('.tt',st);an(tt,[{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-8px)'}],{d:160}).onfinish=()=>{tt.innerHTML=`<b>${L11N[nm][0]}</b><small>${L11N[nm][1]} · ${TAP11.length}</small>`;an(tt,[{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{sp:SPs})};toast(R,`Название ${nm+1} из 3 — выбери, какое оставить`)});
 // карточки: ☆ — в «Мои слова» (звезда с искрами), ▶ — момент, 🔊 — слово
 ctx.on(R,'click',e=>{const sv=e.target.closest('.sv');if(sv){const on=sv.classList.toggle('on');$('span',sv).textContent=on?'В словах':'В мои слова';an(sv,[{transform:'scale(.85)'},{transform:'scale(1.08)'},{transform:'none'}],{d:360});if(on){const r=rel(sv,R);fx.burst(r.x+18,r.y+r.h/2,{n:22,c:['#F2C14E','#fff'],v:4,g:.08,s:2.4,l:34})}return}
  const pm=e.target.closest('.pm');if(pm){const c=pm.closest('.l11s-c'),im=$('.img',c);an(im,[{transform:'scale(1)'},{transform:'scale(1.08)'}],{d:1600,e:EO,f:'forwards'});c.classList.add('pl');ctx.t(()=>{c.classList.remove('pl');an(im,[{transform:'scale(1.08)'},{transform:'scale(1)'}],{d:500})},1700);toast(R,'▶ момент из фильма с этим словом');return}
  const s=e.target.closest('[data-s]');if(s){an(s,[{transform:'scale(.85)'},{transform:'none'}],{sp:SPb});say(s.dataset.s);return}
  if(e.target.closest('.l11s-bt .go'))toast(R,'▶ 3 коротких задания по тому, что выбрал');if(e.target.closest('.l11s-bt .sk'))toast(R,'Всё уже в «Мои слова» — придёт в повторении')});
 // вход
 $$('.l11s-hd,.l11s-st,.l11s-c,.l11s-h2,.l11s-ls .r,.l11s-bt',R).forEach((x,j)=>an(x,[{opacity:0,transform:x.classList.contains('l11s-c')?'translateX(40px) rotate(2deg)':'translateY(16px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:120+j*60}));
 (async()=>{await ctx.wait(3200);if(touched)return;const c=$('.l11s-c .sv',R);if(c)c.click();await ctx.wait(1800);if(touched)return;$('.l11s-cs',R).scrollTo({left:250,behavior:'smooth'});await ctx.wait(2200);if(touched)return;st.click()})()}

// 3) фильм: после проверки эпизода — «Углубить эпизод» по желанию
const LD11=[{k:'СЛОВО',ctx:'Aerobics <u>class</u>. Sorry.',q:'Что значит «class» тут?',o:['занятие (в зале)','класс в школе','класс, круто','урок английского'],r:0,why:'class — и «класс в школе», и «занятие, тренировка». Тут — занятие аэробикой.'},
 {k:'НА СЛУХ',tts:'I need reservations for three.',ctx:'I need ▢▢▢▢▢▢▢▢▢▢▢▢ for three.',q:'Какое слово прозвучало?',o:['reservations','reflections','restorations'],r:0,why:'reservations — бронь (столика). Остальные звучат похоже.'},
 {k:'СОБЕРИ',t:'tiles',tts:'Forget it. I\'ll make them.',ru:'Не надо, я сам забронирую.',ans:['Forget','it','I\'ll','make','them'],ex:['forgot','me'],q:'Собери, что сказал Бейтман',why:'Forget it — «не надо, не бери в голову». make (reservations) — сделать бронь.'},
 {k:'СЛОВО',ctx:'<u>Negative</u>. Cancel it.',q:'Что значит «Negative» тут?',o:['Нет','Плохо','Отрицательный','Грустно'],r:0,why:'Negative в ответе — сухое «нет», как у военных. Буквально — «отрицательный».'},
 {k:'СЛОВО',ctx:'I <u>occasionally</u> box.',q:'Что значит «occasionally»?',o:['иногда','случайно','по случаю','обычно'],r:0,why:'occasionally — время от времени. Ловушка — «случайно» (accidentally).'},
 {k:'ФРАЗА',ctx:'<u>Any messages</u>?',q:'Что он спрашивает?',o:['Мне что-нибудь передавали?','Есть сообщения в телефоне?','Есть новости?','Есть письма на почту?'],r:0,why:'Так спрашивают у секретаря: «мне звонили, что-то передавали?»'}];
function l11Deep(R,ctx){l8Check(R,ctx);R.classList.add('l11','l11-exp');let shown=false;const fx=FX(ctx,$('.fx',R));let touched=false;ctx.t(()=>ctx.on(R,'pointerdown',()=>{touched=true},{capture:true}),30);
 const mo=new MutationObserver(()=>{const e=$('.l8-end',R);if(!e||shown)return;shown=true;const b=$('.nx2',e);b.textContent='Хватит';b.classList.add('l11-sk');
  e.insertAdjacentHTML('beforeend',`<button class="l11-dp"><span class="md">${ic('deep11')}</span><span class="tx"><b>Углубить эпизод</b><small>+6 заданий · все слова эпизода · ≈ 1,5 мин</small></span>${ic('chev')}</button><small class="l11-dn">По желанию — эпизод уже засчитан.</small>`);
  const dp=$('.l11-dp',e);an(dp,[{opacity:0,transform:'translateY(14px) scale(.96)'},{opacity:1,transform:'none'}],{sp:SPs,dl:500});
  ctx.on(dp,'click',()=>{quiz11(R,ctx,LD11,{fx,title:'УГЛУБЛЁННАЯ · ЭПИЗОД 1',note:'по желанию',onDone(g){l11Medal(R,ctx,fx,g)}})});
  ctx.on(b,'click',()=>toast(R,'Ок — слова эпизода придут в повторении'));
  ctx.t(()=>{if(!touched){dp.click();ctx.t(()=>q11Demo(R,ctx,()=>touched),600)}},3400)});
 mo.observe($('.l8-bd',R),{childList:true,subtree:true});ctx.add(()=>mo.disconnect());
 // демо: довести обязательную проверку до конца (3 задания), дальше — «Углубить»
 (async()=>{await ctx.wait(4200);for(let n=0;n<12;n++){if(touched||$('.l8-end',R))return;const nx=$('.l8-bd .nx:not([hidden])',R);if(nx)nx.click();else{const b=$('.l8-bd .op button[data-j="0"]:not([disabled])',R);if(b)b.click()}await ctx.wait(1500)}})()}
function l11Medal(R,ctx,fx,got){const el=document.createElement('div');el.className='g11-md l11-md';const W=['class','reservation','forget it','negative','occasionally','any messages?'];
 el.innerHTML=`<div class="in"><span class="mdl"><i class="rays"></i><span class="cn">${ic('starf')}</span></span><small>УГЛУБЛЕНО · ${got} ИЗ ${LD11.length}</small><b>Эпизод закреплён на ★</b><p class="l11-mp">«Дорсия» · Американский психопат</p>
  <div class="wd"><small>+${W.length} в «Мои слова» · повторим по 3</small><div>${W.map(w=>`<span>${w}</span>`).join('')}</div></div><button class="ok">К сцене</button></div>`;
 R.appendChild(el);an(el,[{opacity:0},{opacity:1}],{d:240});const mdl=$('.mdl',el);an(mdl,[{transform:'scale(0) rotate(-160deg)'},{transform:'scale(1.15) rotate(8deg)',offset:.7},{transform:'none'}],{d:760,e:EO,dl:120});
 ctx.t(()=>{const r=rel(mdl,R);fx.burst(r.x+r.w/2,r.y+r.h/2,{n:80,c:['#F2D35B','#fff','#4FD18B'],v:7.5,g:.1,s:3,l:62})},620);
 $$('.in>*:not(.mdl)',el).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:500+i*90}));$$('.wd span',el).forEach((s,i)=>an(s,[{opacity:0,transform:'translateY(10px) scale(.6)'},{opacity:1,transform:'none'}],{sp:SPb,dl:1000+i*80}));
 ctx.on($('.ok',el),'click',()=>{const z=an(el,[{opacity:1},{opacity:0}],{d:200,f:'forwards'});if(z)z.onfinish=()=>el.remove();else el.remove()})}

V.push({g:'l11',id:'l11a',n:'Проверка · без перевода реплики',
 idea:'После ответа перевод всей реплики не показываем: только верный вариант зелёным и под каждым неверным — строка «почему ловушка». Перевод реплики решал задание за тебя. Ты сказал «не пиши перевод после ответа или ток для новых юзеров, хз» — внизу переключатель, как это будет в Настройках → «Обучение»: «никому» или «новичкам · 7 дней» (первую неделю перевод показываем — новичку иначе страшно, потом сам выключается). Нажми — увидишь разницу на следующем вопросе. Я бы оставил «новичкам».',
 moves:['ответ: верный зеленеет, неверный трясётся, у всех вариантов выезжает «почему ловушка»','«новичкам»: под репликой проявляется перевод; «никому» — его нет','верное слово летит в значок словаря'],
 from:'Твой отзыв на v9: «обучение — не пиши перевод после ответа, или ток для новых юзеров, хз».',
 minus:'Новичок без перевода может не понять, почему ответ такой, — поэтому «почему ловушка» под каждым вариантом остаётся у всех.',
 mount(R,ctx){l11Check(R,ctx)}});
V.push({g:'l11',id:'l11b',n:'После эпизода · «Тебя заинтересовало»',
 idea:'Блок, который ты назвал лучшим, — переименовал и оформил. Название — «Тебя заинтересовало» (подпись: «ты нажимал во время просмотра»); нажми на заголовок — ещё два варианта: «Ты нажимал», «Зацепило тебя» — выбери. Каждое нажатое слово — карточка: кадр того момента (▶ — посмотреть), уровень слова, само слово и что оно значит тут, реплика с подсветкой и её перевод, «☆ В мои слова» и 🔊. Листается вбок. Ниже — «Выучим из эпизода»: Слова · Фразы · Всё, не больше 5, нажатые — первыми.',
 moves:['кольцо «понял» заполняется, проценты набегают','карточки въезжают справа с лёгким поворотом, листаются вбок','☆ — звезда загорается с искрами, «В словах»','▶ — кадр наезжает, как будто момент играет'],
 from:'Твой отзыв на v9: «обучение „что учим“ ахуенно сделал, просто лучший, ток переименуй как-то… заинтересованные… или нажимал… идея хорошая, ток переименовать и оформить норм».',
 minus:'Если ничего не нажимал — блока нет, сразу «Выучим из эпизода».',
 mount(R,ctx){l11Scene(R,ctx)}});
V.push({g:'l11',id:'l11d',n:'Фильм · «Углубить эпизод» по желанию',
 idea:'То же, что в комиксе: обязательная проверка эпизода — 3 задания (≈ 40 с). В конце — «Хватит» или «Углубить эпизод»: ещё 6 заданий по всем словам эпизода (слово, на слух, собрать реплику, фраза). Не заставляем — эпизод уже засчитан. В конце — медаль «Эпизод закреплён на ★» и слова в «Мои слова». В первый раз — только обязательные 3.',
 moves:['после проверки снизу появляется «Углубить эпизод» — карточка с иконкой слоёв','углублённая — те же задания, что в комиксе: сегменты сверху, «почему» под ответом','медаль вращается и встаёт, слова выпрыгивают'],
 from:'Твой отзыв на v9: «…если васян хочет — углублённую проверку, больше слов, больше заданий… ты его не заставляешь, первый раз ток это, можешь думаю добавить и в фильмы это».',
 minus:'Углублённая — потолок 6 заданий: дальше это уже урок, а не проверка.',
 mount(R,ctx){l11Deep(R,ctx)}});
