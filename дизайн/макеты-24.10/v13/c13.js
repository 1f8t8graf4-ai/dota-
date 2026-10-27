/* --- Versus v13: раскладка v10 один в один (Андрей на v12: «v10 лучше», «половина реплик не работает», «шум на фоне постоянный»).
   Что поменял — только то, что в v10 молчало или ломалось: реплики настоящие и звучат, ▶ переслушивает, фона-шума нет (голос и лёгкое эхо),
   взятый кубик оставляет пустое место, ошибка не стопорит бой — соперник бьёт тебя, «на слух» правда играет реплику.
   sync — те же секунды, что в v10 (для сравнения шторкой). --- */
const VR13=[{t:'СОБЕРИ',q:'Собери, что ответил Venator'},{t:'ЧТО ЗНАЧИТ',q:'Что значит «crumbum»?',o:['ничтожество (ругательство)','крошка (ласково)','бродячий кот'],r:0},{t:'НА СЛУХ',q:'Какое слово прозвучало?',o:['Hail','Hell','Hale'],r:0}];
const VA13=['rk-priest-vs-king','ven-no-hide','rk-holier','rk-hail-marys','ven-evil-dies','rat-king-21','venator-14'];
function vs13(R,ctx,o){o=o||{};R.className='scr v8 vs8 vs9 vs10 vs13';S13.preload(VA13);
 const P=(k,side,nm,who)=>`<div class="vs8-p ${side}" data-k="${k}"><div class="hbg">${heroBg10(k)}</div><video muted loop playsinline data-hv="${H12[k].v}" poster="${IMG[H12[k].v]}"></video><i class="dm"></i><i class="v10-fl"></i><div class="nm">${ic9(k,'nmi')}<b>${nm}</b><small>${who}</small></div><i class="ko">K.O.</i></div>`;
 R.innerHTML=`${SB(0)}<div class="vs8-top"><button class="x">${ic('x')}</button><div class="hp l"><small>ТЫ</small><i><i class="gh"></i><i class="v"></i></i><b>450</b></div><div class="rd"><b>Раунд 1</b><small>из 3 · банк 100</small></div><div class="hp r"><small>БОРЯ</small><i><i class="gh"></i><i class="v"></i></i><b>450</b></div></div>
  <div class="vs8-st">${P('venator','lf','Venator','Ты · ур. 2')}${P('rat','rt','Rat King','Боря')}<div class="vs9-log"></div><b class="vs8-x">VS</b><b class="vs8-dmg"></b><b class="vs8-dmg me"></b><b class="v10-bn"></b><b class="v10-cb"></b></div>
  <div class="vs8-pn v10-pn"></div><i class="v10-tm"><i></i></i>
  <canvas class="fx"></canvas><i class="v10-wh"></i><i class="hb"></i>`;
 playV12(R);
 const fx=FX(ctx,$('.fx',R)),pn=$('.v10-pn',R),LOG=$('.vs9-log',R),st=$('.vs8-st',R),tmb=$('.v10-tm i',R);let hp=[450,450],rd=0,streak=0,touched=false,t0=0,tmA=null,vm=null;
 if(!o.sync)ctx.on(R,'pointerdown',()=>{touched=true},{capture:true});
 // реплика: звучит голосом; пока звучит — бегут столбики, говорящий светлее; ▶ — ещё раз
 function speak(m,k,a){if(!a)return;const pv=$(`.vs8-p[data-k="${k}"]`,R);m.classList.add('spk');pv.classList.add('tk');say13(ctx,a,{echo:.18,end(){m.classList.remove('spk');pv.classList.remove('tk')}})}
 function say(k,side,txt,a,hid){const m=document.createElement('div');m.className='vs9-m '+side+(hid?' hid':'');
  m.innerHTML=`<span class="who">${ic9(k)}</span><div class="bb"><b class="nm">${HERO[k].n}</b><span class="tx">${hid?'<i class="dt">· · · · · ·</i><em>соберёшь ниже</em>':txt}</span><span class="v10-wv">${Array.from({length:14},(_,i)=>`<i style="animation-delay:${(-i*.09).toFixed(2)}s"></i>`).join('')}</span></div><button class="pl"${hid?' hidden':''}>${ic('play')}</button>`;
  LOG.appendChild(m);const M=$$('.vs9-m',LOG);M.forEach((x,i)=>x.classList.toggle('old',i<M.length-1));if(M.length>3)M[0].remove();
  an(m,[{opacity:0,transform:`translateX(${side==='lf'?-30:30}px) scale(.9)`},{opacity:1,transform:'none'}],{sp:SPs});m._a=a;m._k=k;
  ctx.on($('.pl',m),'click',e=>{e.stopPropagation();an($('.pl',m),[{transform:'scale(.85)'},{transform:'none'}],{sp:SPb});speak(m,k,m._a)});if(!hid)speak(m,k,a);return m}
 function banner(t){const b=$('.v10-bn',R);b.innerHTML=`<small>РАУНД ${rd+1}</small>${t}`;b.getAnimations().forEach(a=>a.cancel());
  an(b,[{opacity:0,transform:'translate(-50%,-50%) scale(2.4) rotate(-6deg)'},{opacity:1,transform:'translate(-50%,-50%) scale(1) rotate(-3deg)',offset:.25},{opacity:1,transform:'translate(-50%,-50%) scale(1.04) rotate(-3deg)',offset:.8},{opacity:0,transform:'translate(-50%,-50%) translateX(80px) rotate(-3deg)'}],{d:1300,e:'linear',f:'forwards'});
  $('.vs8-top .rd b',R).textContent=`Раунд ${rd+1}`;an($('.vs8-top .rd',R),[{transform:'scale(1.25)'},{transform:'none'}],{sp:SPb})}
 function timer(){t0=performance.now();if(tmA)tmA.cancel();tmA=an(tmb,[{transform:'scaleX(1)'},{transform:'scaleX(0)'}],{d:20000,e:'linear',f:'forwards'})}
 function bar(side,v){const i=side==='l'?0:1;hp[i]=Math.max(0,v);const q=$(`.hp.${side}`,R),f=$('.v',q),g=$('.gh',q),s=hp[i]/450;f.style.transform=`scaleX(${s})`;$('b',q).textContent=hp[i];ctx.t(()=>{g.style.transform=`scaleX(${s})`},520);an(q,[{transform:'none'},{transform:'translateY(-2px) scale(1.04)'},{transform:'none'}],{d:300})}
 // удар: стоп-кадр, вспышка, отлёт (как в v10); me — бьют тебя
 function hit(me){const fast=!me&&(performance.now()-t0)<6500,dmg=me?120:fast?150:Math.round(110+Math.random()*30);if(!me)streak++;
  const vids=$$('video',R);vids.forEach(v=>v.pause());R.classList.add('stop');an($('.v10-wh',R),[{opacity:0},{opacity:.55},{opacity:0}],{d:260});
  ctx.t(()=>{vids.forEach(v=>{const p=v.play();if(p&&p.catch)p.catch(()=>{})});R.classList.remove('stop');S13.sfx('hit');
   const tg=$(me?'.vs8-p.lf':'.vs8-p.rt',R),r=rel(tg,R),dm=$(me?'.vs8-dmg.me':'.vs8-dmg:not(.me)',R);dm.className='vs8-dmg'+(me?' me':fast?' cr':'');dm.innerHTML=(fast?'<small>КРИТ · БЫСТРО</small>':'')+'−'+dmg;
   an(dm,[{opacity:0,transform:'translate(-50%,0) scale(.4)'},{opacity:1,transform:'translate(-50%,-20px) scale(1.3)',offset:.25},{opacity:1,transform:'translate(-50%,-34px) scale(1.1)',offset:.7},{opacity:0,transform:'translate(-50%,-70px) scale(1)'}],{d:1400,e:EO});
   const dx=me?-18:18;an(tg,[{transform:'none'},{transform:`translateX(${dx}px) rotate(${me?-1.5:1.5}deg)`},{transform:`translateX(${-dx/4}px)`},{transform:'none'}],{d:460,e:EO});an($('.v10-fl',tg),[{opacity:.8},{opacity:0}],{d:380});
   an(st,[{transform:'none'},{transform:'translate(-5px,3px)'},{transform:'translate(4px,-2px)'},{transform:'none'}],{d:260});
   fx.burst(r.x+r.w/2,r.y+r.h*.45,{n:fast?70:44,c:me?['#A9C8FF','#fff','#5C8DFF']:fast?['#FFD23F','#fff','#FF6B6B']:['#FF6B6B','#fff','#F6D488'],v:fast?9:7,g:.1,s:3,l:55});
   bar(me?'l':'r',hp[me?0:1]-dmg);
   if(!me&&streak>1){const cb=$('.v10-cb',R);cb.textContent=`×${streak} подряд`;an(cb,[{opacity:0,transform:'translateY(10px) scale(.6)'},{opacity:1,transform:'none',offset:.3},{opacity:0,transform:'translateY(-14px)'}],{d:1400})}},110)}
 function end(){const win=hp[1]<=0||hp[0]>hp[1];const L=$(win?'.vs8-p.rt':'.vs8-p.lf',R),W=$(win?'.vs8-p.lf':'.vs8-p.rt',R);R.classList.add('slo');S13.sfx('ko');
  an(L,[{filter:'grayscale(0) brightness(1)'},{filter:'grayscale(1) brightness(.55)'}],{d:900,f:'forwards'});
  an($('.ko',L),[{opacity:0,transform:'translate(-50%,-50%) scale(3) rotate(-14deg)'},{opacity:1,transform:'translate(-50%,-50%) scale(1) rotate(-10deg)'}],{d:520,e:EO,f:'forwards',dl:300});
  an(W,[{transform:'none'},{transform:'scale(1.04)'}],{d:1200,e:EO,f:'forwards'});
  ctx.t(()=>{if(win)say('venator','lf','Evil dies today.','ven-evil-dies');else say('rat','rt','Took down the Venatah!','rk-took-down')},450);
  ctx.t(()=>{fx.burst(172,300,{n:90,c:['#F6D488','#fff','#E8B34B'],v:8,g:.12,s:3,l:70});pn.innerHTML=win?`<div class="v10-win"><small>ПОБЕДА · ${hp[1]<=0?'K.O.':'ПО ОЧКАМ'}</small><b>+200 ${ic('ticket')}</b><span>Венатор · +40 опыта · ур. 2 → <em>3</em></span><div class="bt"><button class="rv">${ic('sword')}Реванш — другой диалог</button></div></div>`
    :`<div class="v10-win ls"><small>ПОРАЖЕНИЕ</small><b>−50 ${ic('ticket')}</b><span>Венатор · +10 опыта за бой</span><div class="bt"><button class="rv">${ic('sword')}Реванш — другой диалог</button></div></div>`;
   $$('.v10-win>*',pn).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:i*90}));
   const bk=$('.vs8-top .rd',R);bk.innerHTML=win?'<b>K.O.</b><small>банк 200 — твой</small>':'<b>Конец</b><small>банк — у Бори</small>';an(bk,[{transform:'scale(1.4)'},{transform:'none'}],{sp:SPb})},1100)}
 // раунд 1 — собрать ответ Венатора; взятый кубик оставляет пустое место, тап по клетке — вернуть
 function r1(){rd=0;banner('СОБЕРИ');timer();const ANS=['You',"can't",'hide','from','a','Venator'],TK=['hide','You','a','from','Venator',"can't",'find','see'];let pk=[];
  pn.innerHTML=`<b class="q">${VR13[0].q}</b><small>От Венатора не спрячешься.</small><div class="sl">${ANS.map(()=>'<i></i>').join('')}</div><div class="tl">${TK.map((w,j)=>`<button data-j="${j}">${w}</button>`).join('')}</div><button class="ck" disabled>Проверить</button>`;
  const SL=$$('.sl i',pn),TB=$$('.tl button',pn),ck=$('.ck',pn);$$('.v10-pn>*',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(20px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:200+i*50}));
  const paint=()=>{SL.forEach((s,j)=>{const b=pk[j];s.textContent=b?b.textContent:'';s.className=b?'f':''});TB.forEach(b=>b.classList.toggle('used',pk.includes(b)));ck.disabled=pk.length<6};
  const put=b=>{if(pk.length>=6||pk.includes(b))return;const s=SL[pk.length];pk.push(b);const a=rel(b,R),z=rel(s,R);paint();an(s,[{transform:`translate(${a.x-z.x}px,${a.y-z.y}px)`},{transform:'none'}],{sp:SPs});S13.sfx('tick')};
  TB.forEach(b=>ctx.on(b,'click',()=>{touched=true;put(b)}));
  SL.forEach((s,j)=>ctx.on(s,'click',()=>{if(!pk[j]||s.classList.contains('ok'))return;touched=true;pk.splice(j,1);paint()}));
  const go=()=>{if(pk.map(b=>b.textContent).join(' ')!==ANS.join(' ')){shake($('.sl',pn),6,360);streak=0;ctx.t(()=>{pk=[];paint()},700);return}
   if(vm){vm.classList.remove('hid');$('.tx',vm).textContent="You can't hide from a Venator.";$('.pl',vm).hidden=false;vm._a='ven-no-hide';speak(vm,'venator','ven-no-hide')}
   SL.forEach((s,j)=>{s.classList.add('ok');an(s,[{transform:'none'},{transform:'translateY(-7px)'},{transform:'none'}],{sp:SPb,dl:j*60})});hit();ctx.t(r2,2200)};
  ctx.on(ck,'click',()=>{touched=true;go()});return {put,TB,ANS,go}}
 // раунды 2–3 — варианты; ошибка не стопорит бой: соперник бьёт тебя, бой идёт дальше
 function choice(n,after,getL){rd=n;const line=()=>getL?getL():null;const q=VR13[n];banner(q.t);timer();
  pn.innerHTML=`<b class="q">${q.q}</b>${n===2?`<button class="v10-ls v13-ls">${ic('play')}<span class="v10-wv">${Array.from({length:18},(_,i)=>`<i style="animation-delay:${(-i*.08).toFixed(2)}s"></i>`).join('')}</span><em>Go do some ▢▢▢▢ Marys…</em></button>`:'<small>Король: «Holier than thou, <u>crumbum</u>!»</small>'}<div class="v10-op">${q.o.map((o,j)=>`<button data-j="${j}">${o}</button>`).join('')}</div>`;
  $$('.v10-pn>*',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(20px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:200+i*50}));
  const ls=$('.v13-ls',pn);if(ls)ctx.on(ls,'click',()=>{touched=true;an(ls,[{transform:'scale(.97)'},{transform:'none'}],{sp:SPb});const L=line();ls.classList.add('on');if(L)L.classList.add('spk');say13(ctx,'rk-hail-marys',{echo:.18,end(){ls.classList.remove('on');if(L)L.classList.remove('spk')}})});
  const O=$$('.v10-op button',pn);O.forEach(b=>ctx.on(b,'click',()=>{touched=true;O.forEach(x=>{x.disabled=true;x.classList.toggle('ok',+x.dataset.j===q.r)});
   if(+b.dataset.j!==q.r){b.classList.add('bad');shake(b,5,300);streak=0;ctx.t(()=>{say('rat','rt','Eat dirt, crumbum.','rat-king-21');ctx.t(()=>hit(true),500)},600);ctx.t(after,3200);return}
   if(n===2&&line()){$('.tx',line()).innerHTML="Go do some <u>Hail</u> Marys or somethin'."}hit();ctx.t(after,2000)}))}
 let n2=0;
 function r2(){if(n2)return;n2=1;ctx.t(()=>say('rat','rt','Holier than thou, <u>crumbum</u>!','rk-holier'),300);choice(1,r3)}
 function r3(){let ln=null;ctx.t(()=>{ln=say('rat','rt','Go do some <i class="dt">▢▢▢▢</i> Marys or somethin\'.','rk-hail-marys')},300);choice(2,()=>{if(hp[1]>0&&hp[0]>hp[1])bar('r',0);ctx.t(end,300)},()=>ln)}
 ctx.t(()=>say('rat','rt',"What's a priest gonna do to a king?!",'rk-priest-vs-king'),1000);ctx.t(()=>{vm=say('venator','lf','',null,true)},2100);
 an($('.vs8-p.lf',R),[{transform:'translateX(-80px)',opacity:0},{transform:'none',opacity:1}],{sp:SPs,dl:80});
 an($('.vs8-p.rt',R),[{transform:'translateX(80px)',opacity:0},{transform:'none',opacity:1}],{sp:SPs,dl:80});
 an($('.vs8-x',R),[{opacity:0,transform:'translate(-50%,-50%) scale(3)'},{opacity:1,transform:'translate(-50%,-50%) scale(1)',offset:.4},{opacity:0,transform:'translate(-50%,-50%) scale(1.1)'}],{d:1200,dl:300});
 let R1=null;ctx.t(()=>{R1=r1()},1200);
 ctx.on($('.vs8-top .x',R),'click',()=>{if(o.onBack)o.onBack();else toast(R,'← выйти из боя')});
 ctx.on(pn,'click',e=>{if(e.target.closest('.rv'))toast(R,'Реванш: «Тяжела корона» — другой диалог, те же герои')});
 if(o.demo===false)return;
 const demo=async()=>{await ctx.wait(3600);if(!R1)return;for(const w of R1.ANS){if(touched)return;const b=R1.TB.find(x=>x.textContent===w&&!x.classList.contains('used'));if(b)R1.put(b);await ctx.wait(320)}if(touched)return;await ctx.wait(300);R1.go();
  await ctx.wait(3600);if(touched)return;let b=$('.v10-op button[data-j="0"]',pn);if(b)b.click();await ctx.wait(3500);if(touched)return;b=$('.v10-op button[data-j="0"]',pn);if(b)b.click()};demo()}

/* --- Сравнение 1 в 1: v10 и v13 идут одновременно, секунда в секунду; шторка показывает, где что поменялось (Андрей: «сравни 1 в 1, чтобы я видел разницу») --- */
const VC13=[[900,'1','Реплики звучат голосом из игры','в v10 ▶ был без звука'],[2400,'2','Реплики — настоящие из игры','в v10 — придуманные'],[4300,'3','Взятый кубик — пустое место','в v10 оставался серым'],
 [6400,'4','Говорящий светлее, пока звучит','в v10 — всегда 1,8 с'],[8200,'5','Без фона-шума: голос и эхо','в v12 гудела арена'],[10300,'6','«На слух» — ▶ правда играет','в v10 волна нарисована'],
 [12600,'7','K.O. — «Evil dies today.»','в v10 — тишина'],[15200,'8','Ошибся — бой идёт дальше','в v10 всё вставало · проверь сам ↓']];
function vsCmp13(R,ctx){R.className='scr v8 vc13';
 R.innerHTML=`<div class="vc13-l a"><div class="scr"></div></div><div class="vc13-l b"><div class="scr"></div></div>
  <div class="vc13-dv"><i class="ln"></i><span class="kn" aria-label="Тяни">${ic('back')}${ic('chev')}</span><em class="la">v10</em><em class="lb">v13</em></div>
  <div class="vc13-cap"><span class="n"></span><span class="t"><b></b><small></small></span><span class="md"><button data-m="a">v10</button><button data-m="s" class="on">⇆</button><button data-m="b">v13</button></span></div>
  <button class="vc13-me">Сыграть v13 самому ${ic('chev')}</button>`;
 const A=$('.vc13-l.a .scr',R),B=$('.vc13-l.b .scr',R),LB=$('.vc13-l.b',R),dv=$('.vc13-dv',R);vs10(A,sub(ctx));vs13(B,sub(ctx),{sync:true});
 let X=172,dragged=false,mode='s';const set=x=>{X=clamp(x,0,344);LB.style.clipPath=`inset(0 0 0 ${X.toFixed(1)}px)`;dv.style.left=X.toFixed(1)+'px'};set(X);
 const md=m=>{mode=m;$$('.vc13-cap .md button',R).forEach(b=>b.classList.toggle('on',b.dataset.m===m));dv.hidden=m!=='s';if(m==='a')set(344);else if(m==='b')set(0);else set(172)};
 let x0=X;drag(ctx,dv,{start(){dragged=true;if(mode!=='s')md('s');x0=X},move(dx){set(x0+dx)},tap(){}});
 ctx.on($('.vc13-cap .md',R),'click',e=>{const b=e.target.closest('button');if(b){dragged=true;md(b.dataset.m)}});
 // шторка сама проезжает туда-обратно, пока ты её не тронул
 const sweep=async()=>{await ctx.wait(1600);for(const [to,ms] of [[286,900],[58,1300],[172,800]]){if(dragged)return;const f=X,t0=performance.now();await new Promise(r=>{const st=ctx.loop(n=>{const p=Math.min(1,(n-t0)/ms),e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;if(!dragged)set(f+(to-f)*e);if(p>=1||dragged){st();r()}})})}};sweep();
 const cap=$('.vc13-cap',R);VC13.forEach(([t,n,a,b])=>ctx.t(()=>{$('.n',cap).textContent=n;$('.t b',cap).textContent=a;$('.t small',cap).textContent=b;an($('.t',cap),[{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{sp:SPs});an($('.n',cap),[{transform:'scale(.5)'},{transform:'none'}],{sp:SPb})},t));
 ctx.on($('.vc13-me',R),'click',()=>{const v=V.find(x=>x.id==='g13v');if(v)mount(v)})}
