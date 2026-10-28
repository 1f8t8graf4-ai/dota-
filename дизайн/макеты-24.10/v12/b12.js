/* --- Радар v12: 3D в стиле v10 (бирюза на тёмном), но легче 3D-города: 9 районов-плит, у каждого один знак и хозяин --- */
const RD12=[{k:'sobor',n:'Собор',h:'venator',x:160,y:92,z:3,g:'sp'},{k:'tun',n:'Туннели',h:'rat',x:160,y:196,z:1,g:'ar'},{k:'cir',n:'Цирк',h:'celeste',x:258,y:142,z:2,g:'tn'},
 {k:'les',n:'Старый лес',h:'talon',x:62,y:70,z:2,g:'tr'},{k:'lab',n:'Лаборатория',h:'victor',x:54,y:176,z:2,g:'fl'},{k:'niz',n:'Сонная низина',h:'rem',x:98,y:266,z:1,g:'mn'},
 {k:'kla',n:'Кладбище',h:'danny',x:204,y:278,z:1,g:'cr'},{k:'otl',n:'Отель',h:'doorman',x:276,y:242,z:3,g:'ht'},{k:'ele',n:'Электростанция',h:'seven',x:258,y:44,z:2,g:'bt'}];
const RSIG12={tun:{a:'rat',b:'venator',t:'«Охота объявлена»',st:'open',m:'5 реплик · ×2 опыта',left:'ещё 5:12'},sobor:{a:'venator',b:'rat',t:'«Проповедь свинца»',st:'open',m:'7 реплик · ×2 опыта',left:'ещё 3:40'},
 cir:{a:'celeste',b:'talon',t:'Селеста и Талон',st:'soon',m:'портреты ещё делаем',left:'через 5 ч'},otl:{a:'doorman',b:'talon',t:'Дормен и Талон',st:'soon',m:'портреты ещё делаем',left:'через 8 ч'}};
const RG12={sp:'<path d="M12 2v5M10 4h4M8 22V11l4-4 4 4v11"/><path d="M5 22v-7l3-3M19 22v-7l-3-3M12 16v6"/>',ar:'<path d="M4 20v-7a8 8 0 0 1 16 0v7"/><path d="M8 20v-6a4 4 0 0 1 8 0v6"/>',tn:'<path d="M3 20L12 4l9 16z"/><path d="M12 4v16M7.5 20L12 12l4.5 8"/>',
 tr:'<path d="M12 3l6 9h-4l5 7H5l5-7H6z"/><path d="M12 19v3"/>',fl:'<path d="M9 3h6M10 3v6L5 19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2L14 9V3"/><path d="M7.5 15h9"/>',mn:'<path d="M15 3a8 8 0 1 0 6 13A7 7 0 0 1 15 3z"/>',
 cr:'<path d="M12 3v18M7 8h10"/><path d="M6 21h12"/>',ht:'<rect x="5" y="4" width="14" height="17" rx="1"/><path d="M9 8h2M13 8h2M9 12h2M13 12h2M10.5 21v-4h3v4"/>',bt:'<path d="M13 2L5 13h6l-1 9 8-11h-6z"/>'};
function plate12(d,mini){const s=RSIG12[d.k],h=H12[d.h];const L=Array.from({length:mini?2:4},(_,i)=>`<i class="ly" style="--zi:${i}"></i>`).join('');
 return `<span class="r12-p z${d.z}${s?' sig '+s.st:''}" data-k="${d.k}" style="left:${d.x}px;top:${d.y}px;--ac:${h.ac}">${L}${s&&!mini?'<i class="rg"></i><i class="rg b"></i>':''}
  <span class="bb"><svg viewBox="0 0 24 24" class="gl">${RG12[d.g]}</svg>${mini?'':`<b>${d.n}</b><span class="hi">${hic12(d.h)}${s?hic12(s.b):''}</span>`}</span>${s&&!mini?'<i class="bm"></i>':''}</span>`}
function radarMini12(){return `<span class="r12-mini"><span class="pl">${RD12.map(d=>plate12(d,1)).join('')}</span></span>`}
function radarSpin12(ctx,root){const P=$$('.r12-mini .pl',root);if(!P.length)return;let a=-24;ctx.loop((n,dt)=>{a+=dt*.006;P.forEach(p=>p.style.setProperty('--a',a.toFixed(2)+'deg'))})}
function radar12(R,ctx,o){o=o||{};R.className='scr v8 g11 r12';
 R.innerHTML=`${SB(0)}<div class="r12-hd"><button class="r12-bk">${ic('back')}</button><span><b>Радар</b><small>2 сигнала · новые через 5:12:40</small></span><em>⚡ ×2 опыта</em></div>
  <div class="r12-st"><span class="pl">
   <svg class="rv" viewBox="0 0 320 320"><path d="M-10 150 C40 140 70 120 110 136 S190 168 220 150 S290 110 330 124" fill="none" stroke="rgba(46,230,197,.28)" stroke-width="14" stroke-linecap="round"/><path class="fl" d="M-10 150 C40 140 70 120 110 136 S190 168 220 150 S290 110 330 124" fill="none" stroke="rgba(190,255,245,.5)" stroke-width="1.6" stroke-dasharray="6 14"/></svg>
   ${RD12.map(d=>plate12(d)).join('')}<i class="sw"></i></span></div>
  <p class="r12-hint">тяни вбок — крутится · нажми на район</p>
  <div class="r12-lg"><button class="hd">Что где ${ic('chev')}</button><div class="ls">${RD12.map(d=>`<span data-k="${d.k}">${hic12(d.h)}<b>${d.n}</b><small>${H12[d.h].ru}</small></span>`).join('')}</div></div>
  <div class="r12-sh" hidden></div><canvas class="fx"></canvas><i class="hb"></i>`;
 const pl=$('.r12-st .pl',R),st=$('.r12-st',R),sh=$('.r12-sh',R),fx=FX(ctx,$('.fx',R));let a=-28,va=0,drag0=false,touched=false;
 const set=()=>pl.style.setProperty('--a',a.toFixed(2)+'deg');set();
 an(pl,[{transform:'translate(-50%,-50%) rotateX(62deg) rotateZ(-70deg) scale(.6)',opacity:0},{transform:'translate(-50%,-50%) rotateX(56deg) rotateZ(var(--a)) scale(1)',opacity:1}],{d:1100,e:EO});
 $$('.r12-p',R).forEach((p,i)=>an(p,[{opacity:0},{opacity:1}],{d:400,dl:300+i*60}));
 $$('.r12-p .ly',R).forEach(l=>{const zi=+l.style.getPropertyValue('--zi');an(l,[{transform:'translateZ(0)'},{transform:`translateZ(calc(${zi} * var(--zz)))`}],{d:700,e:EO,dl:700})});
 let a0=a;drag(ctx,st,{axis:'x',start(){touched=true;drag0=true;va=0;a0=a},move(dx,dy,vx){a=a0+dx*.45;set();va=vx*16*.45},end(){drag0=false},tap(e){const p=e.target.closest&&e.target.closest('.r12-p');if(p)openP(p.dataset.k)}});
 ctx.loop((n,dt)=>{if(drag0)return;if(Math.abs(va)>.02){a+=va;va*=.93;set()}else if(!touched){a+=dt*.004;set()}});
 function openP(k){const d=RD12.find(x=>x.k===k),s=RSIG12[k],h=H12[d.h];$$('.r12-p',R).forEach(p=>p.classList.toggle('on',p.dataset.k===k));
  sh.hidden=false;sh.innerHTML=`<i class="hd"></i><div class="t">${hic12(d.h,'big')}<span><small>РАЙОН · ${h.ru.toUpperCase()}</small><b>${d.n}</b></span><button class="x">${ic('x')}</button></div>
   ${s?`<div class="rsg ${s.st}"><span class="mm">${hic12(s.a)}${hic12(s.b)}</span><span><b>${s.st==='open'?'Перехват: ':''}${s.t}</b><small>${s.m}</small></span><em>${s.left}</em></div>
   ${s.st==='open'?`<button class="go">${ic('book11')}Читать перехват</button>`:'<p class="nn">Сигнал появится, когда у обоих героев будет живой портрет.</p>'}`:`<p class="nn">Сейчас тихо. Новые сигналы — раз в 8 часов, до 4 за раз.</p>`}`;
  an(sh,[{transform:'translateY(110%)'},{transform:'none'}],{sp:SPs});const r=rel($(`.r12-p[data-k="${k}"] .bb`,R),R);fx.burst(r.x+r.w/2,r.y+r.h/2,{n:22,c:[h.ac,'#fff','#2EE6C5'],v:3.4,g:0,s:2,l:34});
  ctx.on($('.x',sh),'click',e=>{e.stopPropagation();an(sh,[{transform:'none'},{transform:'translateY(110%)'}],{d:220,e:EI,f:'forwards'}).onfinish=()=>{sh.hidden=true};$$('.r12-p',R).forEach(p=>p.classList.remove('on'))});
  const go=$('.go',sh);if(go)ctx.on(go,'click',()=>{an(go,[{transform:'scale(.95)'},{transform:'none'}],{sp:SPb});g11Over(R,ctx,(pv,cc,cl)=>comic12(pv,cc,'who',{onBack:cl}),null,go)})}
 ctx.on($('.r12-lg .hd',R),'click',()=>{touched=true;$('.r12-lg',R).classList.toggle('op')});
 ctx.on($('.r12-lg .ls',R),'click',e=>{const s=e.target.closest('[data-k]');if(s)openP(s.dataset.k)});
 ctx.on($('.r12-bk',R),'click',()=>{if(o.onBack)o.onBack();else toast(R,'← назад в Deadlock')});
 if(o.demo!==false)ctx.t(()=>{if(!touched)openP('tun')},3200)}

/* --- Versus v12: раскладка v10 (Андрей: «в 10 нет проблемы, кто что говорит»), аккуратнее:
   говорит один — он светлее, второй в тени; реплика — под говорящим, с хвостиком к нему; урон — у полоски соперника, не поверх реплики --- */
function vs12(R,ctx,o){o=o||{};R.className='scr v8 vs12';
 const P=(k,side,nm,who)=>`<div class="v12-p ${side}" data-k="${k}"><div class="hbg">${heroBg11(k)}</div><video muted loop playsinline data-hv="${H12[k].v}" poster="${IMG[H12[k].v]}"></video><i class="dm"></i><i class="fl"></i><i class="ko">K.O.</i></div>`;
 R.innerHTML=`${SB(0)}<div class="v12-top"><button class="x">${ic('x')}</button><div class="hp l"><small>ТЫ · VENATOR</small><i><i class="gh"></i><i class="v"></i></i><b>450</b></div><div class="rd"><b>Раунд 1</b><small>из 3 · банк 100</small></div><div class="hp r"><small>RAT KING · БОРЯ</small><i><i class="gh"></i><i class="v"></i></i><b>450</b></div><b class="v12-dmg"></b></div>
  <div class="v12-st">${P('venator','lf','Venator','ты · ур. 2')}${P('rat','rt','Rat King','Боря · ур. 1')}<b class="v12-x">VS</b></div>
  <div class="v12-ln"></div>
  <div class="v12-pn"><div class="v12-rb"><small>РАУНД 1</small><b>СОБЕРИ</b><i class="tm"><i></i></i></div><div class="v12-q"></div></div>
  <button class="v12-snd on">${ic('snd')}<span>фон</span></button><canvas class="fx"></canvas><i class="hb"></i>`;
 playV12(R);const fx=FX(ctx,$('.fx',R)),LN=$('.v12-ln',R),Q=$('.v12-q',R),st=$('.v12-st',R);let hp=[450,450],streak=0,touched=false,t0=0,tmA=null,loud=false,bedOn=true;
 ctx.on(R,'pointerdown',()=>{touched=true;loud=true},{capture:true});
 ctx.on($('.v12-snd',R),'click',e=>{e.stopPropagation();bedOn=!bedOn;e.currentTarget.classList.toggle('on',bedOn);if(!bedOn)SND12.bedStop();toast(R,bedOn?'Фон арены под репликами: вкл':'Фон: выкл — как сейчас, сухо')});
 // кто говорит: он светлее и чуть ближе, второй в тени; реплика — у его стороны, хвостик к нему
 function say(k,txt,a,hid){const side=k==='venator'?'lf':'rt';$$('.v12-p',R).forEach(p=>p.classList.toggle('tk',p.dataset.k===k));$$('.v12-p',R).forEach(p=>p.classList.toggle('qt',p.dataset.k!==k));
  const old=$$('.v12-m',LN);old.forEach(m=>{m.classList.add('old');if(m.classList.contains('old2'))m.remove();else m.classList.add('old2')});
  const m=document.createElement('div');m.className='v12-m '+side+(hid?' hid':'');m.innerHTML=`<i class="tl"></i><span class="who">${hic12(k)}<b>${H12[k].n}</b></span><span class="tx">${hid?'<i class="dt">· · · · · · ·</i> <em>соберёшь ниже</em>':txt}</span>${a?`<button class="pl" data-a="${a}">${ic('play')}</button>`:''}<span class="wv">${Array.from({length:16},(_,i)=>`<i style="animation-delay:${(-i*.08).toFixed(2)}s"></i>`).join('')}</span>`;
  LN.appendChild(m);an(m,[{opacity:0,transform:`translateY(10px) translateX(${side==='lf'?-16:16}px)`},{opacity:1,transform:'none'}],{sp:SPs});
  if(a){m.classList.add('say');say12(ctx,a,{loud:loud,bed:bedOn?'arena':null,dry:!bedOn,end(){m.classList.remove('say')}});const pb=$('.pl',m);ctx.on(pb,'click',e=>{e.stopPropagation();m.classList.add('say');say12(ctx,a,{bed:bedOn?'arena':null,dry:!bedOn,end(){m.classList.remove('say')}})})}
  return m}
 function fitLn(){const p=$('.v12-pn',R);if(!p)return;const r=rel(p,R);LN.style.bottom=Math.max(300,754-r.y+8)+'px'}
 if(window.ResizeObserver){const ro=new ResizeObserver(()=>fitLn());ro.observe($('.v12-pn',R));ctx.add(()=>ro.disconnect())}
 function round(n,t){const rb=$('.v12-rb',R);rb.innerHTML=`<small>РАУНД ${n}</small><b>${t}</b><i class="tm"><i></i></i>`;an(rb,[{transform:'scale(.6)',opacity:0},{transform:'none',opacity:1}],{sp:SPb});
  $('.v12-top .rd b',R).textContent=`Раунд ${n}`;t0=performance.now();if(tmA)tmA.cancel();tmA=an($('.v12-rb .tm i',R),[{transform:'scaleX(1)'},{transform:'scaleX(0)'}],{d:20000,e:'linear',f:'forwards'})}
 function bar(side,v){const i=side==='l'?0:1;hp[i]=Math.max(0,v);const q=$(`.v12-top .hp.${side}`,R),s=hp[i]/450;$('.v',q).style.transform=`scaleX(${s})`;$('b',q).textContent=hp[i];ctx.t(()=>{$('.gh',q).style.transform=`scaleX(${s})`},520)}
 function hit(){const fast=(performance.now()-t0)<6500,dmg=fast?150:130;streak++;const rt=$('.v12-p.rt',R),dm=$('.v12-dmg',R);
  $$('video',R).forEach(v=>v.pause());R.classList.add('stop');ctx.t(()=>{$$('video',R).forEach(v=>{const p=v.play();if(p&&p.catch)p.catch(()=>{})});R.classList.remove('stop');
   dm.innerHTML=`−${dmg}${fast?'<small>КРИТ · быстро</small>':''}${streak>1?`<small>×${streak} подряд</small>`:''}`;an(dm,[{opacity:0,transform:'translateY(-8px) scale(.6)'},{opacity:1,transform:'none',offset:.2},{opacity:1,transform:'none',offset:.75},{opacity:0,transform:'translateY(6px)'}],{d:1500,e:EO});
   an(rt,[{transform:'none'},{transform:'translateX(14px)'},{transform:'translateX(-3px)'},{transform:'none'}],{d:420,e:EO});an($('.fl',rt),[{opacity:.7},{opacity:0}],{d:360});
   const r=rel(rt,R);fx.burst(r.x+r.w*.5,r.y+r.h*.4,{n:fast?54:36,c:fast?['#FFD23F','#fff','#FF6B6B']:['#FF6B6B','#fff','#F6D488'],v:fast?8:6,g:.1,s:2.6,l:50});bar('r',hp[1]-dmg)},110)}
 function ko(){const rt=$('.v12-p.rt',R);an(rt,[{filter:'grayscale(0) brightness(1)'},{filter:'grayscale(1) brightness(.5)'}],{d:900,f:'forwards'});an($('.ko',rt),[{opacity:0,transform:'translate(-50%,-50%) scale(3) rotate(-14deg)'},{opacity:1,transform:'translate(-50%,-50%) rotate(-10deg)'}],{d:520,e:EO,f:'forwards',dl:250});
  ctx.t(()=>say('venator','Evil dies today.','ven-evil-dies'),700);
  ctx.t(()=>{fx.burst(172,300,{n:80,c:['#F6D488','#fff','#E8B34B'],v:7,g:.12,s:3,l:66});$('.v12-pn',R).innerHTML=`<div class="v12-win"><small>ПОБЕДА · 3 ИЗ 3</small><b>+200 ${ic('ticket')}</b><span>Венатор · +40 опыта · ур. 2 → <em>3</em></span><button class="rv">${ic('sword')}Реванш — другой диалог</button></div>`;
   fitLn();$$('.v12-win>*',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:i*80}));const bk=$('.v12-top .rd',R);bk.innerHTML='<b>K.O.</b><small>банк 200 — твой</small>'},2600)}
 function r1(){round(1,'СОБЕРИ');const ANS=['You',"can't",'hide','from','a','Venator'],TK=['hide','You','a','from','Venator',"can't",'find','see'];let pk=[];
  Q.innerHTML=`<b class="q">Собери ответ Венатора</b><small>От Венатора не спрячешься.</small><div class="vsl">${ANS.map(()=>'<i></i>').join('')}</div><div class="tl">${TK.map((w,j)=>`<button data-j="${j}">${w}</button>`).join('')}</div><button class="ck" disabled>Ударить</button>`;
  fitLn();const SL=$$('.vsl i',Q),TB=$$('.tl button',Q),ck=$('.ck',Q);$$('.v12-q>*',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:i*40}));
  const put=b=>{if(pk.length>=6||b.disabled)return;const s=SL[pk.length];pk.push(b.textContent);const a=rel(b,R),z=rel(s,R);b.disabled=true;s.textContent=b.textContent;s.className='f';an(s,[{transform:`translate(${a.x-z.x}px,${a.y-z.y}px)`},{transform:'none'}],{sp:SPs});ck.disabled=pk.length<6};
  TB.forEach(b=>ctx.on(b,'click',()=>put(b)));
  const go=()=>{if(pk.join(' ')!==ANS.join(' ')){shake($('.vsl',Q),6,360);streak=0;ctx.t(()=>{pk=[];SL.forEach(s=>{s.textContent='';s.className=''});TB.forEach(b=>b.disabled=false);ck.disabled=true},700);return}
   SL.forEach((s,j)=>{s.classList.add('ok');an(s,[{transform:'none'},{transform:'translateY(-6px)'},{transform:'none'}],{sp:SPb,dl:j*50})});if(vm){$('.tx',vm).textContent="You can't hide from a Venator.";vm.classList.remove('hid')}
   say('venator',"You can't hide from a Venator.",'ven-no-hide');ctx.t(hit,900);ctx.t(r2,3000)};
  ctx.on(ck,'click',go);return {put,TB,ANS,go}}
 function opts(n,t,q,line,O,r,after){round(n,t);Q.innerHTML=`<b class="q">${q}</b>${line}<div class="op">${O.map((x,j)=>`<button data-j="${j}">${x}</button>`).join('')}</div>`;
  $$('.v12-q>*',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:i*40}));
  fitLn();const B=$$('.op button',Q);B.forEach(b=>ctx.on(b,'click',()=>{B.forEach(x=>{x.disabled=true;x.classList.toggle('ok',+x.dataset.j===r)});if(+b.dataset.j!==r){b.classList.add('bad');shake(b,5,300);streak=0;ctx.t(after,1600);return}hit();ctx.t(after,2000)}))}
 function r2(){say('rat','Holier than thou, <u>crumbum</u>!','rk-holier');ctx.t(()=>opts(2,'ЧТО ЗНАЧИТ','Что значит «crumbum» у Короля?','<small>crumb — крошка, bum — бродяга</small>',['ничтожество (ругательство)','крошка (ласково)','бродячий кот'],0,r3),900)}
 function r3(){say('rat','Go do some <i class="dt">▢▢▢▢</i> Marys or somethin\'.','rk-hail-marys');ctx.t(()=>opts(3,'НА СЛУХ','Какое слово прозвучало?','<small>нажми ▶ у реплики — послушать ещё</small>',['Hail','Hell','Hale'],0,()=>{bar('r',0);ctx.t(ko,300)}),900)}
 let vm=null,R1=null;
 an($('.v12-p.lf',R),[{transform:'translateX(-70px)',opacity:0},{transform:'none',opacity:1}],{sp:SPs,dl:60});an($('.v12-p.rt',R),[{transform:'translateX(70px)',opacity:0},{transform:'none',opacity:1}],{sp:SPs,dl:60});
 an($('.v12-x',R),[{opacity:0,transform:'translate(-50%,-50%) scale(2.6)'},{opacity:1,transform:'translate(-50%,-50%) scale(1)',offset:.35},{opacity:0,transform:'translate(-50%,-50%) scale(1.05)'}],{d:1300,dl:250});
 ctx.t(()=>say('rat',"What's a priest gonna do to a king?!",'rk-priest-vs-king'),900);ctx.t(()=>{vm=say('venator','',null,true);R1=r1()},2600);
 ctx.on($('.v12-top .x',R),'click',()=>{if(o.onBack)o.onBack();else toast(R,'← выйти из боя')});
 if(o.demo!==false)(async()=>{await ctx.wait(4400);if(!R1||touched)return;for(const w of R1.ANS){if(touched)return;const b=R1.TB.find(x=>x.textContent===w&&!x.disabled);if(b)R1.put(b);await ctx.wait(300)}if(touched)return;await ctx.wait(300);R1.go();
  await ctx.wait(4400);if(touched)return;let b=$('.op button[data-j="0"]',Q);if(b)b.click();await ctx.wait(3400);if(touched)return;b=$('.op button[data-j="0"]',Q);if(b)b.click()})()}

/* --- Реплики «как в TikTok»: карточка в тонкой рамке на фоне локации, слова крупно по одному, звук абилки + голос;
   «X про Y» — как «favourite doorman voicelines»: кто говорит — карточкой, про кого — рядом --- */
const LN12={venator:[{a:'ven-evil-stirs',en:'Evil stirs in New York... and so the Vatican has called on me.',ru:'В Нью-Йорке пробуждается зло… и Ватикан призвал меня.',tag:'Выход на бой'},{a:'ven-not-merciful',en:'The Lord is merciful... I am not.',ru:'Господь милосерден… а вот я — нет.',tag:'Ульта'}],
 rat:[{a:'rk-king-here',en:'The rat king is here!',ru:'Крысиный король здесь!',tag:'Ульта'},{a:'rk-took-down',en:'Took down the Venatah!',ru:'Уложил Венатора!',tag:'Убил Венатора'}]};
const AB12={venator:[{a:'ven-die-monster',en:'Die, monster!',ru:'Сдохни, тварь!'},{a:'ven-will-find',en:'I will find you.',ru:'Я тебя найду.'},{a:'ven-no-hide',en:"You can't hide from a Venator.",ru:'От Венатора не спрячешься.'}],
 rat:[{a:'rk-priest-vs-king',en:"What's a priest gonna do to a king?!",ru:'И что поп сделает королю?!'},{a:'rk-took-down',en:'Took down the Venatah!',ru:'Уложил Венатора!'},{a:'rk-hail-marys',en:"Go do some Hail Marys or somethin'.",ru:'Иди почитай «Аве Мария», что ли.'}]};
const WM12={evil:'зло',stirs:'шевелится, пробуждается',vatican:'Ватикан',called:'призвал (called on — позвал на помощь)',merciful:'милосердный',lord:'Господь',king:'король',rat:'крыса',took:'уложил (take down)',down:'(take down — завалить)',priest:'священник, поп',gonna:'= going to, собирается',die:'сдохни',monster:'чудовище, тварь',find:'найти',hide:'спрятаться',hail:'Hail Mary — молитва «Аве Мария»'};
function lines12(R,ctx,mode,o){o=o||{};const about=mode==='about';R.className='scr v8 ln12 '+(about?'ab':'ul');let k=o.hero||'rat',i=0,touched=false,loud=false;
 R.innerHTML=`${SB(0)}<div class="ln12-bg"></div><i class="ln12-vg"></i>
  <div class="ln12-hd"><button class="bk">${ic('back')}</button><span><small>РЕПЛИКИ ГЕРОЕВ</small><b>${about?'Кто что говорит про кого':'Ульты и выходы'}</b></span></div>
  <div class="ln12-stage"></div><div class="ln12-cap"></div><div class="ln12-ru"></div>
  <div class="ln12-chips"></div>
  <div class="ln12-ft"><button class="lpv">${ic('back')}</button><button class="pl">${ic('play')}<span>Слушать</span></button><button class="sv">${ic('star')}</button><button class="nx">${ic('chev')}</button></div>
  <i class="ln12-fl"></i><canvas class="fx"></canvas><i class="hb"></i>`;
 const stg=$('.ln12-stage',R),cap=$('.ln12-cap',R),ru=$('.ln12-ru',R),fx=FX(ctx,$('.fx',R));
 ctx.on(R,'pointerdown',()=>{touched=true;loud=true},{capture:true});
 const L=()=>about?AB12[k]:LN12[k];
 function paint(){const h=H12[k],x=L()[i],tg=k==='rat'?'venator':'rat';$('.ln12-bg',R).innerHTML=heroBg11(k);
  stg.innerHTML=about?`<span class="ls12"><span class="fr"><video muted loop playsinline data-hv="${h.v}" poster="${IMG[h.v]}" style="object-position:${h.pos}"></video></span><span class="wf">${Array.from({length:22},(_,j)=>`<i style="--h:${(.25+.75*Math.abs(Math.sin(j*1.7+i))).toFixed(2)}"></i>`).join('')}</span></span>
    <span class="to"><span class="ct"><video muted loop playsinline data-hv="${H12[tg].v}" poster="${IMG[H12[tg].v]}" style="object-position:${H12[tg].pos}"></video></span><small>про ${tg==='venator'?'Венатора':'Короля'}</small></span>`
   :`<span class="fr big"><video muted loop playsinline data-hv="${h.v}" poster="${IMG[h.v]}" style="object-position:${h.pos}"></video><i class="gl"></i></span><small class="tg">${x.tag} · ${h.n}</small>`;
  playV12(stg);cap.innerHTML='';ru.textContent='';
  $('.ln12-chips',R).innerHTML=about?`<span>${hic12(k)}<b>${h.n} про:</b></span><button class="on">${hic12(tg)}${H12[tg].n}</button><button class="lk">${hic12('victor')}Victor</button><button class="lk">${hic12('rem')}Rem</button>`
   :`${['rat','venator'].map(q=>`<button class="${q===k?'on':''}" data-h="${q}">${hic12(q)}${H12[q].n}</button>`).join('')}<button class="lk">${hic12('doorman')}Doorman</button><button class="lk">${hic12('seven')}Seven</button>`;
  an(stg,[{opacity:0,transform:'translateY(18px) scale(.94)'},{opacity:1,transform:'none'}],{sp:SPs})}
 // слова — крупно по одному (как в роликах), тап по слову — что значит
 function play(){const x=L()[i],W=x.en.split(' '),d=(DUR11[AU11[x.a]||x.a]||2.4)*1000,pre=about?120:480;const len=W.reduce((s,w)=>s+w.length+2,0);
  if(!about){an($('.ln12-fl',R),[{opacity:0},{opacity:.6,offset:.1},{opacity:0}],{d:520});shake($('.fr',stg),5,320);const r=rel($('.fr',stg),R);fx.burst(r.x+r.w/2,r.y+r.h*.55,{n:40,c:[H12[k].ac,'#fff','#F6D488'],v:6,g:.06,s:2.4,l:44})}
  stg.classList.add('say');say12(ctx,x.a,{loud,bed:BED12[k],abil:about?null:k,end(){stg.classList.remove('say')}});
  let t=pre;cap.innerHTML='';ru.textContent='';W.forEach((w,j)=>{const ms=d*(w.length+2)/len;ctx.t(()=>{cap.innerHTML=`<button class="cw" data-w="${w.toLowerCase().replace(/[^a-z']/g,'')}">${w}</button>`;an($('.cw',cap),[{transform:'scale(.6) rotate(-4deg)',opacity:0},{transform:'none',opacity:1}],{sp:SPb})},t);t+=ms});
  ctx.t(()=>{cap.innerHTML=`<span class="all">${W.map(w=>`<button class="cw s" data-w="${w.toLowerCase().replace(/[^a-z']/g,'')}">${w}</button>`).join(' ')}</span>`;ru.textContent=x.ru;an(ru,[{opacity:0},{opacity:1}],{d:400})},t+250)}
 ctx.on(cap,'click',e=>{const b=e.target.closest('.cw');if(!b)return;const m=WM12[b.dataset.w];toast(R,m?`${b.textContent.replace(/[^A-Za-z']/g,'')} — ${m}`:'нажми слово — объясню (в приложении — по словарю сцены)');an(b,[{transform:'scale(1.2)'},{transform:'none'}],{sp:SPb})});
 ctx.on($('.ln12-ft',R),'click',e=>{const b=e.target.closest('button');if(!b)return;an(b,[{transform:'scale(.9)'},{transform:'none'}],{sp:SPb});
  if(b.classList.contains('pl'))play();else if(b.classList.contains('sv')){b.classList.toggle('on');toast(R,b.classList.contains('on')?'В «Мои фразы» — уйдёт в повторение':'Убрал из «Моих фраз»')}
  else{const n=b.classList.contains('nx')?1:-1;i+=n;if(i<0||i>=L().length){k=k==='rat'?'venator':'rat';i=0}paint();ctx.t(play,500)}});
 ctx.on($('.ln12-chips',R),'click',e=>{const b=e.target.closest('button');if(!b)return;if(b.classList.contains('lk')){toast(R,'Реплики этого героя ещё собирает Зетка');return}if(b.dataset.h){k=b.dataset.h;i=0;paint();ctx.t(play,500)}});
 ctx.on($('.ln12-hd .bk',R),'click',()=>{if(o.onBack)o.onBack();else toast(R,'← назад в Deadlock')});
 paint();ctx.t(play,900);
 // без касания — листает сам
 const auto=()=>{if(touched)return;i++;if(i>=L().length){k=k==='rat'?'venator':'rat';i=0}paint();ctx.t(play,500);ctx.t(auto,6200)};ctx.t(auto,6400)}

/* --- Звук реплики: «как сейчас» (сухо) и «как будет» — голос в эхе локации, под ним фон, перед ультой — звук абилки --- */
function snd12(R,ctx){R.className='scr v8 sd12';let k='venator',tr={v:true,b:true,a:true},playing=false;
 const LNS={venator:{a:'ven-not-merciful',en:'The Lord is merciful... I am not.',ru:'Господь милосерден… а вот я — нет.',bed:'Собор: орган и колокол в большом эхе'},rat:{a:'rk-king-here',en:'The rat king is here!',ru:'Крысиный король здесь!',bed:'Туннели: гул, капли воды'}};
 R.innerHTML=`${SB(0)}<div class="sd12-hd"><b>Звук реплик</b><small>сравни: как сейчас и как будет</small></div>
  <div class="sd12-sg"><button class="on" data-k="venator">${hic12('venator')}Венатор</button><button data-k="rat">${hic12('rat')}Король</button></div>
  <div class="sd12-cd"></div>
  <div class="sd12-tr">${[['v','Голос','реплика из игры'],['b','Фон локации',''],['a','Звук абилки','перед ультой']].map(([id,n,s])=>`<button class="t on" data-t="${id}"><i class="ck">${ic('check')}</i><span><b>${n}</b><small>${s}</small></span><span class="eq">${eqBars(12)}</span></button>`).join('')}</div>
  <div class="sd12-ab"><button class="dry">${ic('play')}Как сейчас</button><button class="wet pri">${ic('play')}Как будет</button></div>
  <p class="sd12-nt">В макете фон и абилка синтезированы. В приложении — настоящие звуки игры: у каждого героя на вики есть страница «Sounds» (каст, попадание, ульта) — их собирает Зетка.</p><i class="hb"></i>`;
 const cd=$('.sd12-cd',R);
 function paint(){const x=LNS[k],h=H12[k];cd.innerHTML=`<span class="fr"><video muted loop playsinline data-hv="${h.v}" poster="${IMG[h.v]}" style="object-position:${h.pos}"></video></span><span class="tx"><b>${x.en}</b><small>${x.ru}</small></span>`;playV12(cd);
  $('.sd12-tr [data-t="b"] small',R).textContent=x.bed;an(cd,[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'none'}],{sp:SPs})}
 paint();$$('.sd12-tr .t,.sd12-ab button',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:120+i*60}));
 ctx.on($('.sd12-sg',R),'click',e=>{const b=e.target.closest('button');if(!b)return;k=b.dataset.k;$$('.sd12-sg button',R).forEach(x=>x.classList.toggle('on',x===b));SND12.stop();paint()});
 ctx.on($('.sd12-tr',R),'click',e=>{const b=e.target.closest('.t');if(!b||b.dataset.t==='v')return;tr[b.dataset.t]=!tr[b.dataset.t];b.classList.toggle('on',tr[b.dataset.t])});
 const go=(dry)=>{SND12.stop();const x=LNS[k];R.classList.add('pl');R.classList.toggle('dry',dry);$$('.sd12-tr .t',R).forEach(t=>t.classList.toggle('live',!dry&&tr[t.dataset.t]||t.dataset.t==='v'));
  ctx.t(()=>{say12(ctx,x.a,{dry:dry,bed:!dry&&tr.b?BED12[k]:null,abil:!dry&&tr.a?k:null,end(){R.classList.remove('pl');$$('.sd12-tr .t',R).forEach(t=>t.classList.remove('live'));if(!dry)ctx.t(()=>SND12.bedStop(),1400)}})},60)};
 ctx.on($('.dry',R),'click',()=>go(true));ctx.on($('.wet',R),'click',()=>go(false))}
