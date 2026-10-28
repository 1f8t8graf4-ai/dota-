/* ================= v15 · обучение, мод, настройки ================= */
/* Договорились (Андрей, 27.10): эпизод — момент из фильма («Офис»), сцена — момент из эпизода (короткий кусок 30–60 с).
   Награды — внутри эпизода, на его странице. После сцены — только коротко: сколько слов прибавилось и что дальше. */
const Y5EP={film:'Американский психопат',ep:'Офис',img:'bd_psycho',poster:'p_psycho',kn:31,of:50,
 sc:[['Патрик приходит в офис','dn',12],['Визитки','dn',9],['Ты в порядке?','cur',0],['Обед в Dorsia','',0]],
 ms:[[25,'Карточка эпизода','c'],[38,'Редкая карточка','s'],[50,'Золотая 3D-карточка','g']]};
const y5dots=(n,k,cls)=>`<span class="y5dt ${cls||''}">${Array.from({length:n},(_,i)=>`<i class="${i<k?'k':''}"></i>`).join('')}</span>`;
const y5card=(img,r,cls)=>`<span class="y5cd r-${r} ${cls||''}"><i class="im" style="background-image:url(${IMG[img]})"></i><i class="fl"></i><i class="fr"></i></span>`;
function y5Ep(R,ctx){const E=Y5EP;R.className='scr y5 y5ep2';
 const next=E.ms.find(m=>m[0]>E.kn);
 R.innerHTML=`${SB(0)}<div class="y5sc"><div class="y5ep2-hh"><i class="img" style="background-image:url(${IMG[E.img]})"></i><i class="sh"></i><button class="y5bk" aria-label="Назад">${ic('back')}</button><span class="sk">🔥 5</span>
   <div class="tx"><small>${E.film.toUpperCase()} · ЭПИЗОД</small><b>${E.ep}</b><span>4 сцены · ≈ 6 мин</span></div></div>
  <div class="y5ep2-rw"><div class="hd"><b>Слова эпизода</b><span><em class="n">${E.kn}</em> из ${E.of}</span></div>
   <div class="trk"><i class="f" style="--p:${(E.kn/E.of).toFixed(3)}"></i>${E.ms.map(([p,n,r])=>`<span class="ms ${p<=E.kn?'got':''} ${next&&p===next[0]?'nx':''}" style="left:${(p/E.of*100).toFixed(1)}%">${y5card(E.poster,r,'sm')}<small>${p}</small></span>`).join('')}</div>
   ${next?`<p class="nt">Ещё <b>${next[0]-E.kn}</b> слов — <b>${next[1].toLowerCase()}</b></p>`:''}${y5dots(E.of,E.kn)}</div>
  <div class="y5sec"><b>Сцены</b><small>по порядку</small></div>
  <div class="y5ep2-sc">${E.sc.map(([t,s,w],i)=>`<button class="s-${s||'no'}"><i class="n">${s==='dn'?ic('check'):i+1}</i><span><b>${t}</b><small>${s==='dn'?'+'+w+' слов':s==='cur'?'дальше по порядку':'после третьей'}</small></span>${s==='cur'?'<em>Смотреть</em>':''}</button>`).join('')}</div>
  <div class="y5ep2-fb">${ic('film11')}<span><b>Весь фильм на 100 % — живой фон фильма</b><small>«Офис» 62 % · «Визитки» 0 % · «Утро» 0 %</small></span><em>21 %</em></div></div><i class="hb"></i>`;
 const c=ctx;an($('.trk .f',R),[{transform:'scaleX(0)'},{transform:'scaleX(var(--p))'}],{d:1100,e:EO,f:'forwards',dl:300});
 $$('.y5dt i',R).forEach((d,j)=>an(d,[{opacity:0,transform:'scale(.3)'},{opacity:1,transform:'none'}],{d:260,dl:300+j*12,e:EO}));
 $$('.y5ep2-rw .ms,.y5sec,.y5ep2-sc>button,.y5ep2-fb',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:500+i*60}));
 // подсказка один раз: слова копятся, ничего не пропадает; огонёк — отдельно, дни подряд
 c.t(()=>{if(y5get('y5-ep-co','')==='1')return;const b=document.createElement('div');b.className='y5co';b.innerHTML=`<b>Слова копятся по всему эпизоду</b><span>Бросил на середине — вернёшься к тем же. Огонёк 🔥 — отдельно: сколько дней подряд ты занимался.</span><button>Понял</button>`;
  $('.y5ep2-rw',R).after(b);an(b,[{opacity:0,transform:'translateY(-8px)'},{opacity:1,transform:'none'}],{sp:SPb});c.on($('button',b),'click',()=>{y5set('y5-ep-co','1');b.remove()})},1400);
 c.on(R,'click',e=>{const t=e.target;if(t.closest('.y5bk')){toast(R,'← к фильму');return}const m=t.closest('.ms');if(m){g11Over(R,c,(pv,cc,cl)=>y5Card3D(pv,cc,{onBack:cl}),null,m);return}
  const s=t.closest('.y5ep2-sc>button');if(s){if(s.classList.contains('s-cur'))g11Over(R,c,(pv,cc,cl)=>y5After(pv,cc,{onBack:cl}),null,s);else if(s.classList.contains('s-no')){shake(s,4,260);toast(R,'Сначала сцена 3')}else toast(R,'Пройдена — можно пересмотреть')}})}

// после сцены — коротко: сколько слов прибавилось к эпизоду и что дальше; слова, которые ты нажимал, — галочками (совет a8, ты взял)
function y5After(R,ctx,o){o=o||{};const E=Y5EP,add=6,kn=E.kn+add,next=E.ms.find(m=>m[0]>kn);R.className='scr y5 y5af';
 R.innerHTML=`${SB(0)}<div class="y5af-in"><small>СЦЕНА 3 ИЗ 4 · «ТЫ В ПОРЯДКЕ?»</small><b>Пройдена</b>
  <div class="cnt"><em class="a">+${add}</em><span>слов эпизода · <b class="n">${E.kn}</b> из ${E.of}</span></div>${y5dots(E.of,E.kn,'big')}
  ${next?`<p class="nt">Ещё ${next[0]-kn} — и ${next[1].toLowerCase()}. Она ждёт на странице эпизода.</p>`:''}
  <div class="tap"><small>ТЫ НАЖИМАЛ — УЧИТЬ?</small><span>${['tan','merger','sculpted'].map(w=>`<button class="on">${ic('check')}${w}</button>`).join('')}</span></div>
  <div class="bt"><button class="pri">Сцена 4 · «Обед в Dorsia»</button><button>Ещё 10 слов · 2 мин</button><button class="lk">Хватит на сегодня</button></div></div><canvas class="fx"></canvas><i class="hb"></i>`;
 const fx=FX(ctx,$('.fx',R)),D=$$('.y5dt i',R);D.forEach((d,j)=>an(d,[{opacity:0},{opacity:1}],{d:200,dl:100+j*8}));
 ctx.t(()=>{for(let j=E.kn;j<kn;j++)ctx.t(()=>{D[j].classList.add('k','nw');const r=rel(D[j],R);fx.burst(r.x+4,r.y+4,{n:6,c:['#E8C277','#fff'],v:2.4,g:0,s:1.6,l:22})},(j-E.kn)*120);countUp(ctx,$('.n',R),kn,800,E.kn)},700);
 $$('.y5af-in>*',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:i*60}));
 ctx.on(R,'click',e=>{const b=e.target.closest('.tap button');if(b){b.classList.toggle('on');return}const p=e.target.closest('.bt button');if(!p)return;if(p.classList.contains('lk')&&o.onBack)o.onBack();else toast(R,p.classList.contains('pri')?'Сцена 4 — поехали':'10 слов: 3 вопроса за раз, бросить можно в любой момент')})}

// 100 % эпизода — золотая 3D-карточка: наклоняется за пальцем или мышью, фольга переливается, тап — оборот
function y5Card3D(R,ctx,o){o=o||{};R.className='scr y5 y5c3';
 R.innerHTML=`${SB(0)}<button class="y5bk" aria-label="Назад">${ic('back')}</button><div class="y5c3-st"><i class="rays"></i><div class="y5c3-c"><div class="fc f">${y5card('p_psycho','g','big')}<span class="lb"><small>ЗНАТОК ЭПИЗОДА</small><b>Офис</b><em>50 из 50 слов</em></span></div>
   <div class="fc b"><small>АМЕРИКАНСКИЙ ПСИХОПАТ · ОФИС</small><b>50 / 50</b><span>слов эпизода</span><i></i><span>получена 27.10 · №214</span><span>у 3 % игроков</span></div></div></div>
  <div class="y5c3-tx"><small>ЭПИЗОД НА 100 %</small><b>Золотая карточка</b><span>Лежит в «Коллекции». Тяни — повернётся, нажми — обратная сторона.</span></div><canvas class="fx"></canvas><i class="hb"></i>`;
 const cd=$('.y5c3-c',R),st=$('.y5c3-st',R),fx=FX(ctx,$('.fx',R));let rx=0,ry=0,tx=0,ty=0,fl=false,touched=false;
 an(cd,[{transform:'translateY(60px) rotateY(-80deg) scale(.6)',opacity:0},{transform:'none',opacity:1}],{d:900,e:EO});ctx.t(()=>{const r=rel(cd,R);fx.burst(r.x+r.w/2,r.y+r.h/2,{n:70,c:['#F6D488','#fff','#E8B34B'],v:7,g:.04,s:2.4,l:60})},500);
 ctx.on(st,'pointermove',e=>{touched=true;const r=st.getBoundingClientRect();tx=((e.clientY-r.top)/r.height-.5)*-28;ty=((e.clientX-r.left)/r.width-.5)*34});
 ctx.on(st,'pointerleave',()=>{tx=0;ty=0});ctx.on(st,'click',()=>{fl=!fl;an(cd,[{transform:cd.style.transform+' scale(1)'},{transform:cd.style.transform+' scale(.94)'},{transform:cd.style.transform+' scale(1)'}],{d:300})});
 ctx.loop(n=>{if(!touched){tx=Math.sin(n/900)*10;ty=Math.cos(n/1100)*16}rx+=(tx-rx)*.12;ry+=(ty+(fl?180:0)-ry)*.12;cd.style.transform=`rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;cd.style.setProperty('--gx',(50+ry%180*1.6).toFixed(1)+'%');cd.style.setProperty('--gy',(50-rx*1.6).toFixed(1)+'%')});
 ctx.on($('.y5bk',R),'click',()=>{o.onBack?o.onBack():toast(R,'← к эпизоду')})}

/* уровень героя v15 (Андрей: «раньше уровень лучше был оформлен; это я на героя нажимаю, чтобы увидеть? написано „листай“, но не листается»).
   Да — с экрана героя, нажал на кольцо уровня. Лента наград листается и пальцем, и мышью (на ПК — тянешь или стрелки ‹ ›). */
function y5Level(R,ctx,o){o=o||{};const k=o.hero||'venator',h=H12[k],d=Y5H[k];R.className='scr y5 y5lvp';R.style.setProperty('--ac',h.ac);
 const ico=c=>c==='ic'||c==='fr'||c==='sv'||c==='gd'?`<i class="ic13 f-${c}">${hic12(k)}</i>`:`<i class="gi">${ic({cd:'cards13',en:'swords13',bg:'img',vo:'snd',hit:'bolt',pf:'user'}[c])}</i>`;
 R.innerHTML=`${SB(0)}<div class="y5lvp-hh">${loc13(k)}<i class="dm"></i><button class="y5bk" aria-label="Назад">${ic('back')}</button>
   <span class="rg">${y5ring(d.xp/d.nx,44)}<span class="in">${hic12(k,'big')}</span><em>${d.lv}</em></span><b>${h.n} · уровень ${d.lv}</b><small>${d.xp} / ${d.nx} опыта · ещё ${d.nx-d.xp} до ур. ${d.lv+1}</small></div>
  <div class="y5sec"><b>Награды за уровни</b><span class="ar"><button data-d="-1">${ic('back')}</button><button data-d="1">${ic('chev')}</button></span></div>
  <div class="y5lvp-rl">${LVT13.map(([n,t,c])=>`<div class="nd ${n<d.lv?'got':n===d.lv?'now':''}"><span class="pv">${ico(c)}</span><b>ур. ${n}</b><small>${t}</small>${n<=d.lv?`<i class="ok">${ic('check')}</i>`:''}</div>`).join('')}</div>
  <div class="y5sec"><b>Откуда опыт</b></div>
  <div class="y5lvp-xp">${[['book11','Глава комикса','+30'],['check','Проверка главы','+30'],['swords13','Versus: победа · поражение','+40 · +10'],['radar','Перехват с радара','×2']].map(([i,t,v])=>`<span>${ic(i)}<b>${t}</b><em>${v}</em></span>`).join('')}</div><i class="hb"></i>`;
 const rl=$('.y5lvp-rl',R);
 // мышь: тянешь — лента едет (на ПК горизонтальную прокрутку колесом не сделать — поэтому так)
 let on=false,x0=0,s0=0;ctx.on(rl,'pointerdown',e=>{if(e.pointerType==='touch')return;on=true;x0=e.clientX;s0=rl.scrollLeft;rl.classList.add('dg')});
 ctx.on(window,'pointermove',e=>{if(on)rl.scrollLeft=s0-(e.clientX-x0)/SCALE});ctx.on(window,'pointerup',()=>{on=false;rl.classList.remove('dg')});
 ctx.on(rl,'wheel',e=>{if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){rl.scrollLeft+=e.deltaY;e.preventDefault()}},{passive:false});
 ctx.on(R,'click',e=>{const t=e.target;if(t.closest('.y5bk')){o.onBack?o.onBack():toast(R,'← к герою');return}const a=t.closest('[data-d]');if(a)rl.scrollBy({left:+a.dataset.d*150,behavior:'smooth'})});
 const now=$('.nd.now',rl);ctx.t(()=>{if(now)rl.scrollTo({left:now.offsetLeft-40,behavior:'smooth'})},500);
 ctx.t(()=>rl.scrollBy({left:300,behavior:'smooth'}),2400);ctx.t(()=>rl.scrollBy({left:-300,behavior:'smooth'}),4200);
 $$('.y5lvp-rl .nd,.y5lvp-xp>span',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:200+i*50}))}

/* «Понимаешь %» v15 (Андрей: «скрывай слова, которые не знаешь; нет ли перегруза?»). Одна строка из эпизода: знакомые слова видно,
   незнакомые — скрыты. Сразу видно, сколько понимаешь. После эпизода — 2 скрытых слова проявляются, 67 → 83 %. Больше ничего. */
function y5Pct(R,ctx){R.className='scr y5 y5pc';const L=[['I',1],['have',1],['to',1],['return',1],['some',1],['videotapes.',0]],L2=[['Is',1],['that',1],['a',1],['Valentino',0],['suit?',1]];
 const line=A=>A.map(([w,k],i)=>`<span class="${k?'k':'h'}" data-w="${w}">${k?w:'<i>'+w+'</i>'}</span>`).join(' ');
 R.innerHTML=`${SB(0)}<div class="y5pc-hh"><i class="img" style="background-image:url(${IMG.bd_psycho})"></i><i class="sh"></i><button class="y5bk" aria-label="Назад">${ic('back')}</button>
   <div class="tx"><small>ЭПИЗОД «ОФИС»</small><b>Понимаешь <em class="v">67</em> %</b></div></div>
  <div class="y5pc-ln"><p>${line(L)}</p><p>${line(L2)}</p></div>
  <p class="y5pc-k">Скрыто то, чего ты пока не знаешь. Выучишь — проявится.</p>
  <button class="y5pc-go">${ic('play')}Смотреть эпизод</button><canvas class="fx"></canvas><i class="hb"></i>`;
 const fx=FX(ctx,$('.fx',R));$$('.y5pc-ln span',R).forEach((s,i)=>an(s,[{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{d:300,dl:300+i*60,e:EO}));
 const reveal=()=>{$$('.y5pc-ln span.h',R).forEach((s,i)=>ctx.t(()=>{s.classList.remove('h');s.classList.add('nw');const r=rel(s,R);fx.burst(r.x+r.w/2,r.y+r.h/2,{n:16,c:['#E8C277','#fff'],v:3,g:0,s:1.8,l:30})},i*500));countUp(ctx,$('.v',R),83,1100,67)};
 ctx.t(reveal,3200);ctx.on(R,'click',e=>{const s=e.target.closest('.y5pc-ln span.h');if(s){toast(R,'Это слово ещё учить — оно в сцене 3');return}if(e.target.closest('.y5pc-go'))toast(R,'Эпизод «Офис» · сцена 3');if(e.target.closest('.y5bk'))toast(R,'← назад')})}

/* Советы нейронок v15 (Андрей: «там, где я поставил „Потом“, — верни потом задания и добавь возможность задать вопросы по ним»).
   Берёт твои отметки из v13 (они в этом браузере). Отложенные — сверху. Под каждым — «Спросить» — вопрос уходит мне (в базу страницы), отвечу в следующей версии. */
function y5Ops(R,ctx){let S={};try{S=JSON.parse(localStorage.getItem('kd13-op')||'{}')}catch(e){}const save=()=>{try{localStorage.setItem('kd13-op',JSON.stringify(S))}catch(e){}};R.className='scr y5 y5op';
 const st=x=>S[x.id]||'';const L=OP13.filter(x=>st(x)==='l'),N=OP13.filter(x=>!st(x)),D=OP13.filter(x=>st(x)==='y'||st(x)==='n');const mine=Object.keys(S).length>0;
 const LL=L.length?L:OP13.filter(x=>x.me==='l');
 const card=(x,lt)=>`<div class="y5oc" data-id="${x.id}"><small>${lt?'ТЫ ОТЛОЖИЛ':'БЕЗ ОТВЕТА'} · ${x.by}</small><b>${x.t}</b><p>${x.ex}</p><span class="me">Я бы: ${x.me==='y'?'взял':x.me==='n'?'не брал':'отложил'} — ${x.why}</span>
  <div class="bt"><button data-a="y">Беру</button><button data-a="n">Не надо</button><button data-a="q">${ic('q5')}Спросить</button></div><div class="ask" hidden><textarea placeholder="Что непонятно? Напиши как есть"></textarea><small>Уйдёт мне — отвечу в следующей версии</small></div></div>`;
 R.innerHTML=`${SB(0)}<div class="y5sc"><div class="y5op-hd"><b>Советы нейронок</b><small>${mine?`ты ответил на ${D.length+L.length} из ${OP13.length}`:'твоих отметок в этом браузере нет — показываю, что отложил я'}</small></div>
  <div class="y5sec"><b>Отложено · вернуть</b><small>${LL.length}</small></div>${LL.map(x=>card(x,true)).join('')}
  ${N.length&&mine?`<div class="y5sec"><b>Без ответа</b><small>${N.length}</small></div>${N.slice(0,3).map(x=>card(x)).join('')}`:''}
  ${D.length?`<div class="y5sec"><b>Решено</b><small>${D.length}</small></div><div class="y5op-dn">${D.map(x=>`<span class="${st(x)}">${st(x)==='y'?ic('check'):ic('x')}${x.t}</span>`).join('')}</div>`:''}</div><i class="hb"></i>`;
 $$('.y5oc,.y5sec',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:100+i*70}));
 ctx.on(R,'click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const c=b.closest('.y5oc'),id=c.dataset.id,a=b.dataset.a;
  if(a==='q'){const k=$('.ask',c);k.hidden=!k.hidden;if(!k.hidden)$('textarea',k).focus();return}
  S[id]=a;save();an(c,[{opacity:1},{opacity:0,transform:`translateX(${a==='y'?40:-40}px)`}],{d:240,f:'forwards'});ctx.t(()=>{c.remove()},250);toast(R,a==='y'?'Беру — сделаю':'Не надо — убрал')});
 // вопрос — в базу страницы (как «Твоё мнение»): notes/ask-<совет>
 $$('.y5oc textarea',R).forEach(t=>{let tm=0;const id=t.closest('.y5oc').dataset.id;try{t.value=localStorage.getItem('ask:'+id)||''}catch(e){}
  ctx.on(t,'input',()=>{clearTimeout(tm);tm=setTimeout(async()=>{const s=t.value.trim();try{localStorage.setItem('ask:'+id,s)}catch(e){}const sm=$('small',t.parentElement);
   try{if(typeof NDB!=='undefined'&&NDB){await NDB.doc('notes/ask-'+id).set({t:s,id:'ask-'+id,g:'l15',n:'Вопрос про совет: '+(OP13.find(x=>x.id===id)||{}).t,at:Date.now()});sm.textContent='Сохранено — прочитаю'}else sm.textContent='Сохранено в этом браузере'}catch(e){sm.textContent='Не сохранилось — напиши в чат'}},1100)})})}

/* ================= мод ================= */
// FPS одной кнопкой (Андрей: «всё, что ты написал, уже есть; только FPS-конфиги должны сами ставиться — одна кнопка, максимум две»)
function y5Fps(R,ctx){let cur='';R.className='scr y5 y5fp';
 R.innerHTML=`${SB(0)}<div class="y5fp-in">${y5logo()}<small>МОД · FPS</small><b>Больше FPS — одной кнопкой</b>
  <button class="pr" data-p="low"><span class="t"><b>Слабый ПК</b><small>больше кадров, проще картинка</small></span><em>+35–60 %</em></button>
  <button class="pr" data-p="bal"><span class="t"><b>Баланс</b><small>красиво и плавно</small></span><em>+10–20 %</em></button>
  <div class="st" hidden><i class="sp"></i><span>Ставлю настройки…</span></div>
  <button class="bk">Вернуть как было</button>
  <p class="nt">Только обычные настройки игры. Траву, дым и всё, что видят другие, не трогаем — это нечестно. Проценты — пример, точные даст проба.</p></div><i class="hb"></i>`;
 $$('.y5fp-in>*',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:i*60}));
 const go=b=>{cur=b.dataset.p;$$('.pr',R).forEach(x=>x.classList.toggle('on',x===b));const s=$('.st',R);s.hidden=false;s.className='st';s.innerHTML='<i class="sp"></i><span>Ставлю настройки…</span>';
  ctx.t(()=>{s.className='st ok';s.innerHTML=`${ic('check')}<span><b>Готово — «${cur==='low'?'Слабый ПК':'Баланс'}»</b><small>Перезапусти Deadlock</small></span>`;an(s,[{transform:'scale(.95)'},{transform:'none'}],{sp:SPb})},1300)};
 let touched=false;ctx.on(R,'pointerdown',e=>{if(e.isTrusted)touched=true},{capture:true});
 ctx.on(R,'click',e=>{const b=e.target.closest('.pr');if(b){go(b);return}if(e.target.closest('.bk')){$$('.pr',R).forEach(x=>x.classList.remove('on'));const s=$('.st',R);s.hidden=false;s.className='st';s.innerHTML=`${ic('undo')}<span>Вернул твои настройки</span>`}});
 ctx.t(()=>{if(!touched)go($('[data-p="low"]',R))},1600)}

// сборки с винрейтом: обычные от игроков и топ-игрока; и как это видно прямо в игре, в магазине (мод)
const Y5B=[{n:'Пули и выносливость',a:'raznoe',p:'12,4 тыс.',w:'54,1 %',it:['Headshot Booster','Rapid Rounds','Titanic Magazine','Leech']},{n:'Дух через Ira Domini',a:'katya_dl',p:'6,9 тыс.',w:'52,7 %',it:['Extra Spirit','Improved Spirit','Mystic Burst','Boundless Spirit']},
 {n:'Танк-священник',a:'popovich',p:'3,1 тыс.',w:'49,8 %',it:['Extra Health','Bullet Armor','Fortitude','Leech']}];
const Y5BT={n:'Как играет Eternus',a:'Eternus · топ-игрок',p:'последние 20 матчей',w:'63 %',it:['Headshot Booster','Rapid Rounds','Burst Fire','Titanic Magazine']};
const y5it=n=>`<i class="y5it" title="${n}" style="--h:${[...n].reduce((s,c)=>s+c.charCodeAt(0),0)%360}">${n.split(' ').map(w=>w[0]).join('').slice(0,2)}</i>`;
function y5Builds(R,ctx){let v='app';R.className='scr y5 y5bl';
 const card=(b,top)=>`<div class="y5bc ${top?'top':''}"><div class="h"><span><b>${b.n}</b><small>${b.a}</small></span><span class="w"><b>${b.w}</b><small>побед</small></span></div><div class="it">${b.it.map(y5it).join('<i class="ar"></i>')}</div><div class="f"><small>взяли ${b.p}</small><button>В игру</button></div></div>`;
 R.innerHTML=`${SB(0)}<div class="y5sc"><div class="y5pt-top"><button class="y5bk" aria-label="Назад">${ic('back')}</button><small>RESTLESS · СБОРКИ</small><b>Venator</b><span>по матчам за неделю · пример, цифры выдуманы</span></div>
  <div class="y5mp-v"><button data-v="app" class="on">В приложении</button><button data-v="game">В игре, в магазине</button></div>
  <div class="y5bl-b"></div></div><i class="hb"></i>`;
 const B=$('.y5bl-b',R);
 const paint=()=>{B.innerHTML=v==='app'?`<div class="y5sec"><b>Топ-игрок</b><small>Restless+</small></div>${card(Y5BT,true)}<div class="y5sec"><b>Сборки игроков</b><small>по популярности</small></div>${Y5B.map(b=>card(b)).join('')}`
  :`<div class="y5shop"><div class="sh-hd"><b>SHOP</b><span>Weapon · Vitality · Spirit</span></div><div class="sh-g">${Array.from({length:12},(_,i)=>`<i style="--h:${i*29}"></i>`).join('')}</div>
   <div class="sh-pn"><small>RESTLESS · СБОРКА ТОПА</small><b>Eternus · 63 % побед</b><div class="it">${Y5BT.it.map(y5it).join('<i class="ar"></i>')}</div><small class="nx">Дальше: <b>Rapid Rounds</b> · 61 % побед с ним на 10–15 мин</small></div></div>
   <p class="y5mt-nt">Так это выглядит в самой игре: панель мода в магазине. Можно ли так показывать свой текст из файла — проверяет Зетка (ТЗ v15, п. 6) и проба на твоём ПК.</p>`;
  $$('.y5bl-b>*',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'none'}],{d:300,dl:i*50,e:EO}))};
 paint();let touched=false;ctx.on(R,'pointerdown',e=>{if(e.isTrusted)touched=true},{capture:true});
 ctx.on(R,'click',e=>{const t=e.target,b=t.closest('[data-v]');if(b){v=b.dataset.v;$$('[data-v]',R).forEach(x=>x.classList.toggle('on',x===b));paint();return}if(t.closest('.y5bc button')){toast(R,'Сборка уйдёт в игру — в браузер сборок Deadlock');return}if(t.closest('.y5bk'))toast(R,'← назад')});
 ctx.t(()=>{if(!touched)$('[data-v="game"]',R).click()},3800)}

/* ================= настройки ================= */
// Андрей: «обучение будто не в настройках должно быть; иконки — в играх; пауза — фрагментом с примером, как будет; субтитры норм»
function y5Set(R,ctx){let pz=true;R.className='scr y5 y5st';
 R.innerHTML=`${SB(0)}<div class="y5sc"><div class="y5st-hd"><b>Настройки</b></div>
  <div class="y5st-g"><div class="r"><span><b>Пауза на фразах</b><small>видео встаёт после важной фразы</small></span><i class="sw on" data-k="pz"></i></div>
   <div class="y5pzp"><i class="img" style="background-image:url(${IMG.bd_wolf})"></i><i class="sh"></i><span class="sub">Sell me this pen.</span><span class="cd"><b>Sell me this pen</b><small>Продай мне эту ручку</small></span><i class="pb"><i></i></i><em class="lb"></em></div></div>
  <div class="y5st-g"><div class="r"><span><b>Субтитры</b><small>английские + перевод</small></span><em>Средние</em></div><div class="r"><span><b>Звук реплик</b></span><i class="sw on"></i></div><div class="r"><span><b>Фраза дня от бота</b></span><i class="sw on"></i></div></div>
  <div class="y5st-g"><div class="r"><span><b>Язык</b></span><em>English</em></div><div class="r"><span><b>Тема</b></span><em>Как в Telegram</em></div></div>
  <p class="y5st-mv">${ic('info')}<span>Обучение переехало в Профиль → «Как учиться». Иконки героев — в Deadlock → Герои → ▦.</span></p></div><i class="hb"></i>`;
 const P=$('.y5pzp',R),cd=$('.cd',P),sub=$('.sub',P),bar=$('.pb i',P),lb=$('.lb',P);
 // фрагмент «как будет»: с паузами — видео встаёт, выезжает карточка фразы; без — фраза пролетает субтитром
 const loop=()=>{if(!ctx.alive)return;cd.getAnimations().forEach(a=>a.cancel());bar.getAnimations().forEach(a=>a.cancel());lb.textContent=pz?'С паузой':'Без пауз';
  an(sub,[{opacity:0},{opacity:1}],{d:200});const p1=an(bar,[{transform:'scaleX(0)'},{transform:'scaleX(.45)'}],{d:1600,e:'linear',f:'forwards'});
  ctx.t(()=>{if(pz){P.classList.add('stop');an(cd,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{sp:SPs,f:'forwards'});ctx.t(()=>{an(cd,[{opacity:1},{opacity:0}],{d:200,f:'forwards'});P.classList.remove('stop');an(bar,[{transform:'scaleX(.45)'},{transform:'scaleX(1)'}],{d:1600,e:'linear',f:'forwards'});ctx.t(loop,1900)},2200)}
   else{an(bar,[{transform:'scaleX(.45)'},{transform:'scaleX(1)'}],{d:1600,e:'linear',f:'forwards'});ctx.t(loop,1900)}},1650)};
 ctx.t(loop,400);
 ctx.on(R,'click',e=>{const s=e.target.closest('.sw');if(!s)return;s.classList.toggle('on');if(s.dataset.k==='pz'){pz=s.classList.contains('on');toast(R,pz?'С паузами — смотри фрагмент':'Без пауз — фраза пролетает субтитром')}});
 ctx.t(()=>{const s=$('[data-k="pz"]',R);s.click()},7800)}
// админка — просто (Андрей: «супер хуйня, опять накидал кучу»): три числа, поиск игрока, четыре раздела
function y5Adm(R,ctx){R.className='scr y5 y5ad';
 R.innerHTML=`${SB(0)}<div class="y5sc"><div class="y5st-hd"><b>Админка</b><small>только ты · ID 876754050</small></div>
  <div class="y5ad-n"><span><b>142</b><small>сегодня</small></span><span><b>+18</b><small>новых</small></span><span class="er"><b>2</b><small>ошибки</small></span></div>
  <div class="y5ad-s">${ic('search')}<span>ID, имя или @ник игрока</span></div>
  <div class="y5st-g">${[['users','Игроки','кто заходил'],['bolt','Статистика','воронка, время, ошибки'],['lock','Доступ','что кому видно'],['starf','Премиум','режим, оплаты']].map(([i,t,s])=>`<div class="r a">${ic(i)}<span><b>${t}</b><small>${s}</small></span>${ic('chev')}</div>`).join('')}</div></div><i class="hb"></i>`;
 $$('.y5ad-n>span,.y5ad-s,.y5st-g .r',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:i*50}));
 ctx.on(R,'click',e=>{const r=e.target.closest('.r.a');if(r)toast(R,'Откроется раздел');if(e.target.closest('.y5ad-s'))toast(R,'Поиск по игрокам')})}
