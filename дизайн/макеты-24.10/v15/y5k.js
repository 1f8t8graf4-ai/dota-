/* --- Герой v15 — уютнее (Андрей: «раньше профиль Венатора лучше, уютнее выглядел»; «убери „как запомнится“ и „Венатор начинает“ —
   не делай приложение для идиотов, либо объясняй при первом взаимодействии»; «дать каждому васяну абилку, супер лайтовую»).
   Сверху — живой герой на своей локации, крупно. Ниже — его способность в Versus, две кнопки и главы строками без лишних подписей.
   Подсказка про главы — один раз, при первом заходе, с «Понял». --- */
const Y5PK={venator:['Ira Domini','убирает один неверный вариант'],rat:['Крысы шепчут','первая буква в «Собери»'],doorman:['Звонок портье','+5 секунд на ответ'],
 talon:['Глаз совы','перевод одного слова'],rem:['Подушка','одна ошибка без урона'],seven:['Разряд','«на слух» — переслушать без штрафа'],celeste:['Софиты','подсвечивает первое слово'],
 victor:['Второе дыхание','один вопрос — заново'],danny:['Карта судьбы','пример со словом']};
const Y5ST={new:['Новая','nw'],chk:['Проверка','ck'],done:['Пройдена','dn'],lock:['Скоро','lk']};
const y5thumb=x=>{const sp=[...x.o].map(c=>CHK13[c]);return `<span class="y5th">${sp.slice(0,2).map(k=>`<i style="background-image:url(${VT(k)});--ac:${H12[k].ac}"></i>`).join('')}</span>`};
function y5Hero(R,ctx,k,o){o=o||{};k=k||'venator';const h=H12[k],d=Y5H[k],pk=Y5PK[k],CH=(CH13[k]||[]).map(x=>Object.assign({},x));R.className='scr y5 y5he';R.style.setProperty('--ac',h.ac);
 R.innerHTML=`${SB(0)}<div class="y5sc"><div class="y5he-st">${loc13(k)}${h.v?`<video muted loop playsinline data-hv="${h.v}" poster="${IMG[h.v]}" style="object-position:${h.pos}"></video>`:''}<i class="dm"></i>
   <button class="y5bk" aria-label="Назад">${ic('back')}</button>
   <div class="nm"><small>${((HERO[k]&&HERO[k].role)||h.loc).toUpperCase()}</small><b>${h.n}</b>
    <span class="y5lv"><span class="rg">${y5ring(d.xp/d.nx,17)}<em>${d.lv}</em></span><span><b>Уровень ${d.lv}</b><small>${d.xp} / ${d.nx} опыта · ${d.ph} из ${d.of} фраз</small></span></span></div></div>
  <div class="y5he-bd">
   <div class="y5pkc"><span class="i">${ic('spark5')}</span><span class="t"><small>СПОСОБНОСТЬ В VERSUS</small><b>${pk[0]}</b><span>${pk[1]} · раз за бой</span></span></div>
   <div class="y5he-ac"><button data-go="vs">${ic('swords13')}<b>Versus</b></button><button data-go="lines">${ic('wave13')}<b>Реплики</b></button></div>
   <div class="y5sec"><b>Главы</b><small>${CH.length}</small></div>
   <div class="y5chs">${CH.map((x,j)=>{const s=Y5ST[x.st==='deep'?'done':x.st];return `<button class="y5ch s-${x.st}" data-j="${j}">${y5thumb(x)}<span class="t"><b>${x.t}</b><small>${x.o.length} реплик · ≈ ${x.min} мин</small></span><em class="${s[1]}">${x.st==='done'?ic('check'):''}${s[0]}</em></button>`}).join('')}</div></div></div><i class="hb"></i>`;
 playV12(R);const c=ctx;
 $$('.y5he-st .nm>*,.y5pkc,.y5he-ac>button,.y5sec,.y5ch',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:240+Math.min(i,10)*50}));
 // подсказка — один раз: что такое глава
 const coach=()=>{if(y5get('y5-coach','')==='1'||o.noCoach)return;const ch=$('.y5ch',R);if(!ch)return;const b=document.createElement('div');b.className='y5co';
  b.innerHTML=`<b>Глава — диалог героев из игры</b><span>Читаешь как комикс, потом 3 вопроса. Фразы уйдут в повторение.</span><button>Понял</button>`;$('.y5he-bd',R).insertBefore(b,$('.y5chs',R));
  an(b,[{opacity:0,transform:'translateY(-8px) scale(.96)'},{opacity:1,transform:'none'}],{sp:SPb});c.on($('button',b),'click',()=>{y5set('y5-coach','1');const z=an(b,[{opacity:1},{opacity:0,transform:'scale(.96)'}],{d:180,f:'forwards'});if(z)z.onfinish=()=>b.remove();else b.remove()})};
 c.t(coach,1100);
 c.on(R,'click',e=>{const t=e.target;if(t.closest('.y5bk')){o.onBack?o.onBack():toast(R,'← назад к героям');return}
  if(t.closest('.y5lv')){g11Over(R,c,(pv,cc,cl)=>y5Level(pv,cc,{hero:k,onBack:cl}),null,t.closest('.y5lv'));return}
  const g=t.closest('[data-go]');if(g){an(g,[{transform:'scale(.95)'},{transform:'none'}],{sp:SPb});if(g.dataset.go==='vs')g11Over(R,c,(pv,cc,cl)=>y5Vs(pv,cc,{onBack:cl}),null,g);else g11Over(R,c,(pv,cc,cl)=>y5Lines(pv,cc,{onBack:cl}),null,g);return}
  const ch=t.closest('.y5ch');if(ch){const x=CH[+ch.dataset.j];an(ch,[{transform:'scale(.97)'},{transform:'none'}],{sp:SPb});if(x.st==='lock'){shake(ch,4,280);toast(R,'Откроется с живым портретом Рэма');return}y5chSheet(R,c,k,x)}});
 return R}
// шторка главы — коротко: о чём, сколько, «Читать» / «Слушать». Без «начинает» и «как запомнится»
function y5chSheet(R,ctx,k,x){let s=$('.y5sh',R);if(s)s.remove();s=document.createElement('div');s.className='y5sh';const w=H12[x.w]||H12.rat;
 const pri=x.st==='chk'?`<button class="pri" data-a="chk">${ic('check')}Проверка · 3 вопроса</button>`:`<button class="pri" data-a="read">${ic('book11')}Читать</button>`;
 s.innerHTML=`<i class="sc"></i><div class="pn"><i class="hd"></i>${y5thumb(x)}<b>${x.t}</b><p>${x.ab}</p><small class="m">${H12[k].n} и ${w.n} · ${x.o.length} реплик · ≈ ${x.min} мин</small>
  <div class="bt">${pri}<button data-a="listen">${ic('ear13')}Слушать</button></div></div>`;
 R.appendChild(s);an($('.pn',s),[{transform:'translateY(100%)'},{transform:'none'}],{sp:SPs});an($('.sc',s),[{opacity:0},{opacity:1}],{d:220});
 const c=sub(ctx),cl=()=>{c.kill();const z=an($('.pn',s),[{transform:'none'},{transform:'translateY(100%)'}],{d:200,e:EI,f:'forwards'});an($('.sc',s),[{opacity:1},{opacity:0}],{d:200,f:'forwards'});const f=()=>s.remove();if(z)z.onfinish=f;else f()};
 c.on($('.sc',s),'click',cl);c.on($('.bt',s),'click',e=>{const b=e.target.closest('button');if(!b)return;const a=b.dataset.a;cl();
  if(a==='chk')g11Over(R,ctx,(pv,cc,cb)=>comic12(pv,cc,'who',{start:'check',onBack:cb}),null,null);else g11Over(R,ctx,(pv,cc,cb)=>comic12(pv,cc,'who',{onBack:cb}),null,null)})}
