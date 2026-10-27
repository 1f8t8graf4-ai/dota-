/* --- звук v15: сопровождение мягче (Андрей: «эхо заебывает», «канализация заебывать начинает», «ульта не всегда должна быть — помягче»).
   Голос — сухой, как в ролике Дормена, который ему зашёл. Перед голосом — короткий тихий акцент по типу реплики:
   ульта — настоящий звук ульты, но вдвое тише; убийство — глухой удар; выход — лёгкий взмах; подколы и угрозы — ничего. Постоянного фона нет. --- */
const Y5A=(()=>{let vol=.42;
 function nz(ac,sec){const r=ac.sampleRate,n=Math.round(r*sec),b=ac.createBuffer(1,n,r),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;return b}
 async function acc(fx,sx){if(!S13.live())return 0;const ac=S13.A0();if(!ac)return 0;const t=ac.currentTime,g=ac.createGain();g.connect(ac.destination);
  if(fx==='ult'&&sx){const b=await S13.load(sx);if(!b)return 0;const s=ac.createBufferSource();s.buffer=b;g.gain.value=vol;s.connect(g);s.start();return Math.round(Math.min(b.duration*600,1100))}
  if(fx==='kill'){const o=ac.createOscillator();o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(42,t+.22);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.32,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+.3);o.connect(g);o.start(t);o.stop(t+.32);return 160}
  if(fx==='enter'){const s=ac.createBufferSource();s.buffer=nz(ac,.42);const f=ac.createBiquadFilter();f.type='bandpass';f.Q.value=.8;f.frequency.setValueAtTime(600,t);f.frequency.exponentialRampToValueAtTime(3200,t+.38);
   g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.09,t+.12);g.gain.exponentialRampToValueAtTime(.0001,t+.42);s.connect(f);f.connect(g);s.start(t);s.stop(t+.44);return 220}
  return 0}
 return {acc}})();
// реплика v15: сопровождение по типу → голос сухой; слова зажигаются караоке (все видны, загораются по голосу)
function y5say(ctx,x,o){o=o||{};let gap=0;const go=()=>speak13(ctx,x.a,{echo:0,mute:o.mute,words:x.en.split(' '),onStart:o.onStart,onWord:o.onWord,onEnd:o.onEnd});
 if(o.mute||!S13.live()||!x.fx){go();return}
 Y5A.acc(x.fx,x.sx).then(ms=>{if(!ctx.alive)return;gap=ms;if(gap)ctx.t(go,gap);else go()})}
const y5kara=en=>en.split(' ').map((w,i)=>`<span class="y5w" data-i="${i}">${w}</span>`).join(' ');

/* --- Реплики v15 (Андрей на g13a/g13b: «эхо портит, субтитры опять плохо, лагает, дизайн не нравится, добавь без звука, канализация заебывает»).
   Один экран как в TikTok: живой герой на весь экран, листаешь вверх-вниз. Субтитр — вся фраза сразу, слова загораются по голосу
   (время слов из распознавания — не «на глаз»), перевод под ней сразу. Кнопка без звука — те же субтитры тем же ритмом. «Про кого» — кружок справа. --- */
const Y5L=[{k:'rat',a:'rk-king-here',en:'The rat king is here!',ru:'Крысиный король здесь!',tg:'Выход на бой',fx:'enter',kw:['is here','пришёл, на месте']},
 {k:'rat',a:'rk-priest-vs-king',to:'venator',en:"What's a priest gonna do to a king?!",ru:'И что поп сделает королю?!',tg:'Подкол',kw:['gonna','собирается (= going to)']},
 {k:'venator',a:'ven-will-find',to:'rat',en:'I will find you.',ru:'Я тебя найду.',tg:'Угроза',kw:['find','найти']},
 {k:'rat',a:'rk-ult-roll',sx:'rk-a4',en:"Let's roll, boys!",ru:'Погнали, пацаны!',tg:'Ульта',fx:'ult',kw:["let's roll",'погнали, поехали']},
 {k:'venator',a:'ven-evil-dies',sx:'ven-a4',en:'Evil dies today.',ru:'Зло сегодня умрёт.',tg:'Ульта',fx:'ult',kw:['evil','зло']},
 {k:'rat',a:'rk-took-down',to:'venator',en:'Took down the Venatah!',ru:'Уложил Венатора!',tg:'Убийство',fx:'kill',kw:['took down','уложил, завалил']},
 {k:'venator',a:'ven-die-monster',to:'rat',en:'Die, monster!',ru:'Сдохни, тварь!',tg:'Убийство',fx:'kill',kw:['monster','чудовище, тварь']},
 {k:'rat',a:'rat-king-18',en:"Who's exterminating who now!",ru:'Ну и кто теперь кого травит?!',tg:'Игра слов',fx:'kill',kw:['exterminate','травить (крыс, тараканов)']}];
function y5Lines(R,ctx,o){o=o||{};let i=0,touched=false,mute=y5get('y5-mute','0')==='1',seq=0;R.className='scr y5 y5ln';S13.preload(Y5L.flatMap(x=>x.sx?[x.a,x.sx]:[x.a]));
 R.innerHTML=`${SB(0)}<div class="y5ln-st"></div><i class="y5ln-gr"></i>
  <div class="y5ln-hd"><button class="y5bk" aria-label="Назад">${ic('back')}</button><span class="y5sg">${Y5L.map(()=>'<i><i></i></i>').join('')}</span><button class="mu" aria-label="Звук"></button></div>
  <div class="y5ln-side"><button class="to" hidden></button><button class="rp" aria-label="Ещё раз">${ic('rep')}</button><button class="sv" aria-label="В мои фразы">${ic('star')}</button></div>
  <div class="y5ln-cap"><small class="tg"></small><p class="en"></p><p class="ru"></p><button class="kw"></button></div>
  <i class="y5ln-hint">Нажми — со звуком</i><i class="hb"></i>`;
 const st=$('.y5ln-st',R),cap=$('.y5ln-cap',R),en=$('.en',cap),ru=$('.ru',cap),kw=$('.kw',cap),mu=$('.mu',R);
 const muPaint=()=>{mu.innerHTML=ic(mute?'mute11':'snd');mu.classList.toggle('off',mute)};muPaint();
 ctx.on(R,'pointerdown',()=>{if(!touched){touched=true;const h=$('.y5ln-hint',R);an(h,[{opacity:1},{opacity:0}],{d:240,f:'forwards'})}},{capture:true});
 function slide(dir){const x=Y5L[i],h=H12[x.k];R.style.setProperty('--ac',h.ac);
  const p=document.createElement('div');p.className='y5ln-pn';p.innerHTML=`${loc13(x.k)}<video muted loop playsinline data-hv="${h.v}" poster="${IMG[h.v]}" style="object-position:${h.pos}"></video><i class="vg"></i><span class="nm"><small>${(HERO[x.k]&&HERO[x.k].role)||h.loc}</small><b>${h.n}</b></span>`;
  st.appendChild(p);playV12(p);const old=$$('.y5ln-pn',st).filter(q=>q!==p);
  if(dir){an(p,[{transform:`translateY(${dir*100}%)`},{transform:'none'}],{d:420,e:EO});old.forEach(q=>{const z=an(q,[{transform:'none',opacity:1},{transform:`translateY(${-dir*30}%)`,opacity:.3}],{d:420,e:EO,f:'forwards'});if(z)z.onfinish=()=>q.remove();else q.remove()})}
  else old.forEach(q=>q.remove());
  $$('.y5sg>i',R).forEach((s,j)=>{s.className=j<i?'dn':j===i?'cur':'';const f=$('i',s);f.getAnimations().forEach(a=>a.cancel());f.style.transform=j<i?'scaleX(1)':'scaleX(0)'});
  $('.tg',cap).textContent=x.tg;en.innerHTML=y5kara(x.en);ru.textContent=x.ru;ru.classList.remove('on');kw.innerHTML=`<b>${x.kw[0]}</b> — ${x.kw[1]}`;kw.classList.remove('on');
  const to=$('.y5ln-side .to',R);if(x.to){to.hidden=false;to.innerHTML=`<span class="c">${hic12(x.to,'y5s')}</span><small>про ${x.to==='rat'?'Короля':'Венатора'}</small>`;an(to,[{opacity:0,transform:'scale(.5)'},{opacity:1,transform:'none'}],{sp:SPb,dl:300})}else to.hidden=true;
  an(cap,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{d:360,e:EO,dl:120})}
 function play(){const x=Y5L[i],my=++seq,W=$$('.y5w',en),sgf=$(`.y5sg>i:nth-child(${i+1})>i`,R);$$('.y5w',en).forEach(w=>w.className='w');ru.classList.remove('on');kw.classList.remove('on');
  y5say(ctx,x,{mute,onStart(){if(my!==seq)return;ru.classList.add('on');const d=(DUR11[AU11[x.a]||x.a]||2.4)*1000;an(sgf,[{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{d:d+1600,e:'linear',f:'forwards'})},
   onWord(j){if(my!==seq)return;W.forEach((w,q)=>{w.classList.toggle('on',q<=j);w.classList.toggle('cur',q===j)})},
   onEnd(){if(my!==seq)return;W.forEach(w=>{w.classList.add('on');w.classList.remove('cur')});kw.classList.add('on');if(!touched)ctx.t(()=>{if(!touched&&my===seq)go(1)},2400);else ctx.t(()=>{if(my===seq)go(1)},3200)}})}
 function go(d){if(i+d<0||i+d>=Y5L.length){if(d>0){i=-1}else return}S13.stopLine();seq++;i+=d;slide(d);ctx.t(play,420)}
 // свайп вверх / вниз — следующая / прошлая
 let y0=null;ctx.on(R,'pointerdown',e=>{if(e.target.closest('button'))return;y0=e.clientY});ctx.on(R,'pointerup',e=>{if(y0==null)return;const dy=(e.clientY-y0)/SCALE;y0=null;if(Math.abs(dy)>40)go(dy<0?1:-1)});
 ctx.on(R,'click',e=>{const t=e.target;if(t.closest('.y5bk')){o.onBack?o.onBack():toast(R,'← назад в Deadlock');return}
  if(t.closest('.mu')){mute=!mute;y5set('y5-mute',mute?'1':'0');muPaint();an(mu,[{transform:'scale(.8)'},{transform:'none'}],{sp:SPb});if(mute)S13.stopLine();toast(R,mute?'Без звука: субтитры тем же ритмом':'Со звуком');seq++;play();return}
  if(t.closest('.rp')){an(t.closest('.rp'),[{transform:'rotate(-200deg)'},{transform:'none'}],{d:420,e:EO});play();return}
  if(t.closest('.sv')){const b=t.closest('.sv');b.classList.toggle('on');an(b,[{transform:'scale(1.3)'},{transform:'none'}],{sp:SPb});toast(R,b.classList.contains('on')?'В «Мои фразы» — завтра в повторение':'Убрал');return}
  if(t.closest('.kw')){toast(R,'Слово — в «Мои слова»');return}
  if(t.closest('.y5ln-cap,.to'))return});
 slide(0);ctx.t(play,700)}

/* --- Versus v15 компактный (Андрей: «слишком громоздкое, сомнительно выглядит»). Сверху — две тонкие полоски здоровья,
   посередине — два живых героя небольшими окнами друг напротив друга, реплика — субтитром под ними, задание — главное, внизу.
   У каждого героя одна лёгкая способность на бой (Андрей: «абилку каждому, супер лайтовую, чтобы приятно») — у Венатора «Ira Domini»:
   убрать один неверный вариант. У соперника своя, такая же по силе. --- */
const Y5V=[{t:'СОБЕРИ',q:'Собери, что ответил Venator',say:{k:'rat',a:'rk-priest-vs-king',en:"What's a priest gonna do to a king?!",ru:'И что поп сделает королю?!'},ans:{k:'venator',a:'ven-no-hide',en:"You can't hide from a Venator.",ru:'От Венатора не спрячешься.'},tiles:["You","can't","hide","from","a","Venator","find","see"]},
 {t:'ЧТО ЗНАЧИТ',q:'Что значит «crumbum»?',say:{k:'rat',a:'rat-king-21',en:'Eat dirt, crumbum.',ru:'Жри землю, ничтожество.'},o:['ничтожество (ругательство)','крошка (ласково)','бродячий кот'],r:0},
 {t:'НА СЛУХ',q:'Какое слово прозвучало?',say:{k:'rat',a:'rk-hail-marys',en:'Go do some Hail Marys or something.',ru:'Иди прочитай «Аве Марию», что ли.',hid:true},o:['Hail','Hell','Hale'],r:0}];
function y5Vs(R,ctx,o){o=o||{};R.className='scr y5 y5vs';let rd=0,hp=[450,450],touched=false,perk=true,busy=false;S13.preload(['rk-priest-vs-king','ven-no-hide','rat-king-21','rk-hail-marys','ven-evil-dies']);
 const P=(k,side)=>`<div class="y5vp ${side}" data-k="${k}" style="--ac:${H12[k].ac}">${loc13(k)}<video muted loop playsinline data-hv="${H12[k].v}" poster="${IMG[H12[k].v]}" style="object-position:${H12[k].pos}"></video><i class="vg"></i><b class="dm"></b></div>`;
 R.innerHTML=`${SB(0)}<div class="y5vs-top"><button class="x" aria-label="Выйти">${ic('x')}</button>
   <div class="hp l"><span class="who">${hic12('venator','y5s')}<b>Ты</b></span><i class="bar"><i></i></i><em>450</em></div><b class="rd">1/3</b>
   <div class="hp r"><em>450</em><i class="bar"><i></i></i><span class="who"><b>Боря</b>${hic12('rat','y5s')}</span></div></div>
  <div class="y5vs-ar">${P('venator','l')}${P('rat','r')}<div class="y5vs-sub"><small class="who"></small><p class="en"></p><p class="ru"></p></div></div>
  <div class="y5vs-pn"></div><button class="y5pk" aria-label="Способность">${ic('spark5')}<span><b>Ira Domini</b><small>убрать неверный · 1 раз</small></span></button><canvas class="fx"></canvas><i class="hb"></i>`;
 playV12(R);const fx=FX(ctx,$('.fx',R)),pn=$('.y5vs-pn',R),sb=$('.y5vs-sub',R);
 ctx.on(R,'pointerdown',e=>{if(e.isTrusted)touched=true},{capture:true});
 function line(x,hid,end){const p=$(`.y5vp[data-k="${x.k}"]`,R);$$('.y5vp',R).forEach(q=>q.classList.toggle('tk',q===p));$('.who',sb).textContent=H12[x.k].n;
  const E=$('.en',sb),RU=$('.ru',sb);E.innerHTML=hid?'<span class="hd">· · · · · ·</span>':y5kara(x.en);RU.textContent=hid?'послушай и выбери слово':x.ru;RU.classList.toggle('on',!!hid);
  an(sb,[{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{d:260});const W=$$('.y5w',E);
  speak13(ctx,x.a,{echo:0,words:x.en.split(' '),onStart(){RU.classList.add('on')},onWord(j){W.forEach((w,q)=>{w.classList.toggle('on',q<=j);w.classList.toggle('cur',q===j)})},onEnd(){W.forEach(w=>{w.classList.add('on');w.classList.remove('cur')});p.classList.remove('tk');end&&end()}})}
 function bar(i,v){hp[i]=Math.max(0,v);const q=$(`.hp.${i?'r':'l'}`,R);$('.bar>i',q).style.transform=`scaleX(${hp[i]/450})`;$('em',q).textContent=hp[i];an(q,[{transform:'none'},{transform:'scale(1.05)'},{transform:'none'}],{d:280})}
 function hit(me,n){const v=$(`.y5vp.${me?'l':'r'}`,R),d=$('.dm',v);d.textContent='−'+n;an(d,[{opacity:0,transform:'translateY(10px) scale(.6)'},{opacity:1,transform:'translateY(-6px) scale(1.1)',offset:.3},{opacity:0,transform:'translateY(-30px)'}],{d:1000,e:EO});
  shake(v,4,260);const r=rel(v,R);fx.burst(r.x+r.w/2,r.y+r.h*.45,{n:26,c:[H12[me?'venator':'rat'].ac,'#fff'],v:5,g:.05,s:2.2,l:36});bar(me?0:1,hp[me?0:1]-n)}
 function done(ok,el){if(busy)return;busy=true;const n=ok?140+Math.round(Math.random()*10):0;if(el)el.classList.add(ok?'ok':'no');
  if(ok)hit(false,n);else{shake(pn,5,300);hit(true,120)}
  const R0=Y5V[rd];if(ok&&R0.ans)ctx.t(()=>line(R0.ans,false),500);
  ctx.t(()=>{busy=false;rd++;if(rd<Y5V.length)round();else end()},ok&&R0.ans?3600:1700)}
 function round(){const X=Y5V[rd];$('.y5vs-top .rd',R).textContent=`${rd+1}/3`;perkPaint();
  pn.innerHTML=`<small class="t">РАУНД ${rd+1} · ${X.t}</small><b class="q">${X.q}</b>${X.tiles?`<div class="sl5">${X.tiles.slice(0,6).map(()=>'<i></i>').join('')}</div><div class="tl5">${[...X.tiles].sort(()=>Math.random()-.5).map(w=>`<button>${w}</button>`).join('')}</div><button class="ck" disabled>Проверить</button>`
   :`<div class="op5">${X.o.map((w,j)=>`<button data-j="${j}">${w}</button>`).join('')}</div>${X.say.hid?`<button class="re">${ic('play')}Ещё раз</button>`:''}`}`;
  $$('.y5vs-pn>*',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:i*50}));
  line(X.say,X.say.hid);
  if(X.tiles){const sl=$$('.sl5>i',pn),pick=[];
   const put=()=>{sl.forEach((s,j)=>{s.textContent=pick[j]?pick[j].textContent:'';s.classList.toggle('f',!!pick[j])});$('.ck',pn).disabled=pick.length<6};
   ctx.on($('.tl5',pn),'click',e=>{const b=e.target.closest('button');if(!b||b.classList.contains('u')||pick.length>=6)return;pick.push(b);b.classList.add('u');an(sl[pick.length-1],[{transform:'scale(.8)'},{transform:'none'}],{sp:SPb});put()});
   ctx.on($('.sl5',pn),'click',e=>{const s=e.target.closest('i');if(!s)return;const j=sl.indexOf(s);if(j<0||!pick[j])return;pick[j].classList.remove('u');pick.splice(j,1);put()});
   ctx.on($('.ck',pn),'click',()=>{const ok=pick.map(b=>b.textContent).join(' ')===X.ans.en.replace('.','');done(ok,$('.sl5',pn))})}
  else{ctx.on($('.op5',pn),'click',e=>{const b=e.target.closest('[data-j]');if(!b||b.classList.contains('gone'))return;done(+b.dataset.j===X.r,b)});const re=$('.re',pn);if(re)ctx.on(re,'click',()=>line(X.say,true))}
  if(!touched)ctx.t(()=>demo(X),X.say.hid?3600:3000)}
 // способность: один раз за бой — убрать один неверный вариант
 function perkPaint(){const b=$('.y5pk',R),X=Y5V[rd]||{};b.classList.toggle('used',!perk);b.classList.toggle('can',perk&&!!X.o)}
 ctx.on($('.y5pk',R),'click',()=>{const X=Y5V[rd];if(!perk){toast(R,'Способность — один раз за бой');return}if(!X||!X.o){toast(R,'Ira Domini работает в вопросах с вариантами');return}
  const w=$$('.op5 [data-j]',pn).find(b=>+b.dataset.j!==X.r&&!b.classList.contains('gone'));if(!w)return;perk=false;perkPaint();w.classList.add('gone');
  const r=rel($('.y5pk',R),R);fx.burst(r.x+20,r.y+20,{n:30,c:['#F0C86A','#fff','#E23A4E'],v:5,g:.04,s:2,l:40});toast(R,'Ira Domini: один вариант сгорел')});
 function demo(X){if(touched||busy)return;if(X.tiles){const L=X.ans.en.replace('.','').split(' ');let j=0;const step=()=>{if(touched)return;const b=$$('.tl5 button',pn).find(q=>q.textContent===L[j]&&!q.classList.contains('u'));if(b)b.click();j++;if(j<L.length)ctx.t(step,260);else ctx.t(()=>{if(!touched)$('.ck',pn).click()},500)};step()}
  else{if(rd===1&&perk)ctx.t(()=>{if(!touched)$('.y5pk',R).click()},200);ctx.t(()=>{if(!touched){const b=$(`.op5 [data-j="${X.r}"]`,pn);if(b)b.click()}},1300)}}
 function end(){const win=hp[1]<=hp[0];pn.innerHTML=`<div class="y5ko"><small>${win?'ПОБЕДА':'ПОРАЖЕНИЕ'}</small><b>${hp[0]} : ${hp[1]}</b><span>${win?'Банк +100 · Венатор +40 опыта':'Ставка 50 ушла Боре'}</span>
   <div class="bt"><button class="pri">Реванш — другой диалог</button><button class="sec">Выйти</button></div></div>`;
  an($('.y5ko',pn),[{opacity:0,transform:'scale(.9)'},{opacity:1,transform:'none'}],{sp:SPs});$$('.y5vp',R).forEach(v=>v.classList.toggle('lose',v.classList.contains(win?'r':'l')));
  if(win){speak13(ctx,'ven-evil-dies',{echo:0,words:['Evil','dies','today.']});const r=rel($('.y5vs-ar',R),R);fx.burst(r.x+r.w*.3,r.y+r.h*.5,{n:60,c:['#F0C86A','#fff','#E23A4E'],v:7,g:.05,s:2.4,l:50})}
  ctx.on($('.y5ko',pn),'click',e=>{const b=e.target.closest('button');if(!b)return;if(b.classList.contains('pri')){rd=0;hp=[450,450];perk=true;bar(0,450);bar(1,450);$$('.y5vp',R).forEach(v=>v.classList.remove('lose'));round()}else if(o.onBack)o.onBack();else toast(R,'← назад в Deadlock')})}
 ctx.on($('.y5vs-top .x',R),'click',()=>{if(o.onBack)o.onBack();else toast(R,'← выйти из боя')});
 ctx.t(round,500)}
