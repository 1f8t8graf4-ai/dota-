/* ================= v11 · Versus: как файтинг, но учим язык ================= */
// диалог «Проповедь свинца» — настоящие реплики с голосом
const VR11=[{t:'СОБЕРИ',who:'venator',a:'ven-not-merciful',en:'The Lord is merciful... I am not.',ru:'Господь милосерден… а вот я — нет.',ans:['The','Lord','is','merciful','I','am','not'],ex:['mercy',"isn't"],q:'Собери, что сказал Венатор',why:'merciful — «милосердный»; mercy — это «милосердие», лишнее слово.'},
 {t:'ЧТО ЗНАЧИТ',who:'rat',a:'rk-holier',en:'Holier than thou, <u>crumbum</u>!',ru:'Святее всех выискался, мелюзга!',q:'Что значит «crumbum»?',o:['ничтожество (ругательство)','крошка (ласково)','бродячий кот'],r:0,why:'crumb — крошка, bum — бродяга. Король так ругается на всех.'},
 {t:'НА СЛУХ',who:'rat',a:'rk-hail-marys',en:"Go do some ▢▢▢▢ Marys or somethin'.",full:"Go do some Hail Marys or somethin'.",ru:'Иди почитай «Радуйся, Мария», что ли.',q:'Какое слово прозвучало?',o:['Hail','Hell','Hale'],r:0,why:'Hail Mary — молитва «Радуйся, Мария». Король издевается: иди помолись.'}];
// соперник (Боря): когда отвечает и верно ли
const VO11=[{at:7200,ok:1},{at:6800,ok:0},{at:8600,ok:1}];
const vsDmg=ms=>ms<6000?150:Math.max(100,Math.round(100+50*(1-ms/20000)));
function vs11(R,ctx,o){o=o||{};const me=o.me==='rat'?'rat':'venator',op=me==='venator'?'rat':'venator',H0=450;R.className='scr v8 g11 vs11';
 const G={venator:G11H.venator,rat:G11H.rat};let hp={me:H0,op:H0},rd=-1,streak=0,touched=false,best=99,dealt=0,got=0,t0=0,tmA=null,iMe=false,iOp=false,over=false;
 const P=(k,side)=>`<div class="v11-p ${side}" data-k="${k}"><div class="bg">${heroBg11(k)}</div><video muted loop playsinline data-hv="${G[k].v}" poster="${IMG[G[k].v]}"></video><i class="fl"></i></div>`;
 const HB=(k,side,who,lv)=>`<div class="v11-hp ${side}">${mini8(k)}<div class="nm"><b>${HERO[k].n}</b></div><div class="bar"><i class="gh"></i><i class="v"></i><em>${H0}</em></div><span class="who"><span class="w">${who} · ур. ${lv}</span><span class="ty">отвечает<i></i><i></i><i></i></span></span></div>`;
 R.innerHTML=`${SB(0)}<div class="v11-ar">${P(me,'l')}${P(op,'r')}<i class="v11-sp"></i><i class="v11-fo"></i><div class="v11-bb"></div><b class="v11-dm"></b><b class="v11-cb"></b><b class="v11-bn"></b><b class="v11-ko">K.O.</b></div>
  <div class="v11-hud">${o.onBack?`<button class="v11-x" aria-label="Выйти">${ic('x')}</button>`:''}${HB(me,'l','ты',G[me].lv)}<div class="v11-tm"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="19" class="t"/><circle cx="22" cy="22" r="19" class="p" pathLength="100"/></svg><b>20</b><span class="rp"><i></i><i></i><i></i></span></div>${HB(op,'r','Боря',G[op].lv)}</div>
  <div class="v11-pn"></div>
  <div class="v11-in"><div class="h l"><div class="bg">${heroBg11(me)}</div><video muted loop playsinline data-hv="${G[me].v}" poster="${IMG[G[me].v]}"></video><b>${HERO[me].n}</b><small>ТЫ · ур. ${G[me].lv}</small></div><div class="h r"><div class="bg">${heroBg11(op)}</div><video muted loop playsinline data-hv="${G[op].v}" poster="${IMG[G[op].v]}"></video><b>${HERO[op].n}</b><small>БОРЯ · ур. ${G[op].lv}</small></div><b class="vs">VS</b><i class="sw"></i><span class="bk">банк 100 ${ic('ticket')}</span></div>
  <canvas class="fx"></canvas><i class="v11-wh"></i><i class="hb"></i>`;
 $$('video[data-hv]',R).forEach(v=>{v.src=vurl(v.dataset.hv);v.muted=true;const p=v.play();if(p&&p.catch)p.catch(()=>{})});
 const fx=FX(ctx,$('.fx',R)),pn=$('.v11-pn',R),bb=$('.v11-bb',R),ar=$('.v11-ar',R),tmP=$('.v11-tm .p',R),tmB=$('.v11-tm b',R);
 ctx.on(R,'pointerdown',()=>{touched=true},{capture:true});
 if(o.onBack)ctx.on($('.v11-x',R),'click',()=>o.onBack());
 const loud=()=>touched;
 // полоска здоровья: яркая падает сразу, «призрачная» белая — через полсекунды
 function bar(side,v){hp[side]=Math.max(0,v);const q=$(`.v11-hp.${side==='me'?'l':'r'}`,R),s=hp[side]/H0;$('.v',q).style.transform=`scaleX(${s.toFixed(3)})`;$('em',q).textContent=hp[side];ctx.t(()=>{$('.gh',q).style.transform=`scaleX(${s.toFixed(3)})`},560);an(q,[{transform:'none'},{transform:'translateY(-3px)'},{transform:'none'}],{d:260})}
 // реплика пузырём над головой говорящего; hid — спрятана (собрать на слух)
 function say(k,ln,hid,cb){const side=k===me?'l':'r',m=document.createElement('div');m.className='v11-sb '+side+(hid?' hid':'');m.dataset.vw='';
  m.innerHTML=`<div class="tx">${hid?'<i class="dt">· · · · · · ·</i><em>послушай и собери</em>':ln.en}</div><button class="pl" aria-label="Ещё раз">${ic('play')}</button>${wv11(12)}`;
  $$('.v11-sb',bb).forEach(x=>{const z=an(x,[{opacity:1},{opacity:0,transform:'translateY(-10px) scale(.94)'}],{d:220,f:'forwards'});if(z)z.onfinish=()=>x.remove();else x.remove()});
  bb.appendChild(m);an(m,[{opacity:0,transform:`translate(${side==='l'?-20:20}px,14px) scale(.7)`},{opacity:1,transform:'none'}],{sp:SPb});
  const pv=$(`.v11-p.${side}`,R);pv.classList.add('tk');m.classList.add('spk');voice11(ctx,ln.a,{mute:!loud(),end(){m.classList.remove('spk');pv.classList.remove('tk');cb&&cb()}});
  ctx.on($('.pl',m),'click',e=>{e.stopPropagation();an($('.pl',m),[{transform:'scale(.8)'},{transform:'none'}],{sp:SPb});m.classList.add('spk');voice11(ctx,ln.a,{end(){m.classList.remove('spk')}})});return m}
 function banner(t,big){const b=$('.v11-bn',R);b.innerHTML=big?`<i>${big}</i>`:`<small>РАУНД ${rd+1}</small>${t}`;b.classList.toggle('big',!!big);b.getAnimations().forEach(a=>a.cancel());
  an(b,[{opacity:0,transform:'translate(-50%,-50%) translateX(-140px) skewX(-14deg)'},{opacity:1,transform:'translate(-50%,-50%) skewX(-8deg)',offset:.22},{opacity:1,transform:'translate(-50%,-50%) translateX(8px) skewX(-8deg)',offset:.78},{opacity:0,transform:'translate(-50%,-50%) translateX(160px) skewX(-14deg)'}],{d:big?900:1250,e:'linear',f:'forwards'});
  $$('.v11-tm .rp i',R).forEach((x,i)=>x.classList.toggle('on',i<=rd))}
 function timer(){t0=performance.now();if(tmA)tmA();tmP.style.transition='none';tmP.style.strokeDashoffset='0';let last=20;
  tmA=ctx.loop(n=>{const s=Math.max(0,20-(n-t0)/1000);tmP.style.strokeDashoffset=String((100*(1-s/20)).toFixed(1));if(s<=0&&!iMe){answered(false);return}const c=Math.ceil(s);if(c!==last){last=c;tmB.textContent=c;if(c<=5)an(tmB,[{transform:'scale(1.3)'},{transform:'none'}],{d:240})}$('.v11-tm',R).classList.toggle('lo',s<=5)})}
 // удар: стоп-кадр → вспышка → отлёт, тряска → большой урон
 function hit(target,dmg,crit){const tv=$(`.v11-p.${target==='op'?'r':'l'}`,R),vids=$$('video',R);vids.forEach(v=>v.pause());R.classList.add('stop');an($('.v11-wh',R),[{opacity:0},{opacity:crit?.7:.45},{opacity:0}],{d:240});
  ctx.t(()=>{vids.forEach(v=>{const p=v.play();if(p&&p.catch)p.catch(()=>{})});R.classList.remove('stop');
   const r=rel(tv,R),cx=r.x+r.w*(target==='op'?.42:.58),cy=r.y+r.h*.42;
   an(tv,[{transform:'none'},{transform:`translateX(${target==='op'?22:-22}px) rotate(${target==='op'?2:-2}deg)`},{transform:`translateX(${target==='op'?-5:5}px)`},{transform:'none'}],{d:480,e:EO});
   an($('.fl',tv),[{opacity:.85},{opacity:0}],{d:420});an(ar,[{transform:'none'},{transform:'translate(-6px,3px)'},{transform:'translate(5px,-3px)'},{transform:'translate(-2px,1px)'},{transform:'none'}],{d:300});
   fx.burst(cx,cy,{n:crit?80:46,c:crit?['#FFD23F','#fff','#FF6B6B']:['#FF6B6B','#fff','#F6D488'],v:crit?10:7,g:.1,s:3,l:56});fx.burst(cx,cy,{n:14,t:'s',c:['#fff'],v:13,g:0,s:2,l:16});
   const dm=$('.v11-dm',R);dm.className='v11-dm '+(target==='op'?'r':'l')+(crit?' cr':'');dm.innerHTML=(crit?'<small>КРИТ · БЫСТРО</small>':'')+'−'+dmg;dm.getAnimations().forEach(a=>a.cancel());
   an(dm,[{opacity:0,transform:'translate(-50%,0) scale(.3) rotate(-8deg)'},{opacity:1,transform:'translate(-50%,-24px) scale(1.35) rotate(-4deg)',offset:.2},{opacity:1,transform:'translate(-50%,-36px) scale(1) rotate(-4deg)',offset:.75},{opacity:0,transform:'translate(-50%,-80px) scale(.96) rotate(-4deg)'}],{d:1500,e:EO});
   bar(target,hp[target]-dmg);
   if(target==='op'&&streak>1){const cb=$('.v11-cb',R);cb.innerHTML=`×${streak}<small>КОМБО</small>`;cb.getAnimations().forEach(a=>a.cancel());an(cb,[{opacity:0,transform:'scale(.4) rotate(-10deg)'},{opacity:1,transform:'scale(1.15) rotate(-6deg)',offset:.25},{opacity:1,transform:'scale(1) rotate(-6deg)',offset:.8},{opacity:0,transform:'scale(1.1) rotate(-6deg)'}],{d:1500})}},crit?140:100)}
 function miss(who){const dm=$('.v11-dm',R);dm.className='v11-dm ms '+(who==='op'?'r':'l');dm.innerHTML=who==='op'?'Боря ошибся':'Мимо!';an(dm,[{opacity:0,transform:'translate(-50%,0) scale(.6)'},{opacity:1,transform:'translate(-50%,-20px) scale(1)',offset:.3},{opacity:0,transform:'translate(-50%,-40px)'}],{d:1300})}
 // соперник отвечает сам (в Versus его ответ приходит с сервера)
 function opTurn(){const v=VO11[rd],q=$('.v11-hp.r .who',R);q.classList.add('on');ctx.t(()=>{q.classList.remove('on');iOp=true;if(v.ok)hit('me',vsDmg(v.at),v.at<6000);else miss('op');next()},v.at)}
 function next(){if(!iMe||!iOp||over)return;ctx.t(()=>pn.classList.remove('on'),600);if(rd<2)ctx.t(()=>round(rd+1),1500);else ctx.t(finish,1100)}
 function answered(ok){if(iMe)return;iMe=true;if(tmA)tmA();ctx.t(()=>{if(!iOp)pn.classList.remove('on')},1300);const ms=performance.now()-t0;if(ok){got++;streak++;const d=vsDmg(ms);dealt+=d;best=Math.min(best,ms/1000);hit('op',d,ms<6000)}else{streak=0;miss('me')}ctx.t(next,1200)}
 function round(n){rd=n;iMe=false;iOp=false;const q=VR11[n];banner(q.t);
  ctx.t(()=>{const m=say(q.who,q,q.t==='СОБЕРИ');ctx.t(()=>{task(q,m);timer();opTurn()},q.t==='СОБЕРИ'?500:900)},700)}
 function task(q,m){
  if(q.t==='СОБЕРИ'){let pk=[];pn.innerHTML=`<div class="hd"><b>${q.q}</b><small>${q.ru}</small></div><div class="qsl">${q.ans.map(()=>'<i></i>').join('')}</div><div class="tl">${q.ans.concat(q.ex).sort(()=>Math.random()-.5).map(w=>`<button>${w}</button>`).join('')}</div><button class="ckb" disabled>Удар!</button>`;
   const SL=$$('.qsl i',pn),TB=$$('.tl button',pn),ck=$('.ckb',pn);
   const put=b=>{if(pk.length>=SL.length||b.disabled)return;const s=SL[pk.length];pk.push(b);const a=rel(b,R),z=rel(s,R);b.disabled=true;s.textContent=b.textContent;s.className='f';an(s,[{transform:`translate(${a.x-z.x}px,${a.y-z.y}px)`},{transform:'none'}],{sp:SPs});ck.disabled=pk.length<SL.length};
   TB.forEach(b=>ctx.on(b,'click',()=>put(b)));SL.forEach(s=>ctx.on(s,'click',()=>{const i=SL.indexOf(s);if(i<0||!s.textContent)return;for(let j=SL.length-1;j>=i;j--){if(!SL[j].textContent)continue;const b=pk.pop();if(b)b.disabled=false;SL[j].textContent='';SL[j].className=''}ck.disabled=true}));
   ctx.on(ck,'click',()=>{const ok=pk.map(b=>b.textContent).join(' ')===q.ans.join(' ');if(!ok){shake($('.qsl',pn),6,360);SL.forEach((s,j)=>{if(s.textContent!==q.ans[j])s.classList.add('bad')});ctx.t(()=>{pk.forEach(b=>b.disabled=false);pk=[];SL.forEach(s=>{s.textContent='';s.className=''});ck.disabled=true},700);streak=0;return}
    ck.disabled=true;SL.forEach((s,j)=>{s.classList.add('ok');an(s,[{transform:'none'},{transform:'translateY(-7px)'},{transform:'none'}],{sp:SPb,dl:j*45})});if(m){m.classList.remove('hid');$('.tx',m).textContent=q.en}answered(true)});
   pn._q={t:'tiles',ans:q.ans}}
  else{pn.innerHTML=`<div class="hd"><b>${q.q}</b><small>${q.t==='НА СЛУХ'?'нажми ▶ в пузыре — послушать ещё раз':q.ru}</small></div><div class="op">${q.o.map((x,j)=>`<button data-j="${j}">${x}</button>`).join('')}</div><p class="why"></p>`;
   const O=$$('.op button',pn);[...O].sort(()=>Math.random()-.5).forEach(b=>$('.op',pn).appendChild(b));
   O.forEach(b=>ctx.on(b,'click',()=>{if(iMe)return;const ok=+b.dataset.j===q.r;O.forEach(x=>{x.disabled=true;x.classList.toggle('ok',+x.dataset.j===q.r)});if(!ok){b.classList.add('bad');shake(b,5,300)}$('.why',pn).textContent=q.why;if(m&&q.full){$('.tx',m).textContent=q.full}answered(ok)}));pn._q={t:'op',r:q.r}}
  pn.classList.add('on');$$('.v11-pn>*',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:i*60}))}
 function finish(){over=true;pn.classList.remove('on');const ko=hp.op<=0,win=ko||dealt>H0-hp.me;
  if(ko){const loser=$('.v11-p.r',R),k=$('.v11-ko',R);R.classList.add('slo');$$('video',loser).forEach(v=>{try{v.playbackRate=.3}catch(e){}});
   ctx.t(()=>say(me,me==='venator'?{a:'ven-evil-dies',en:'Evil dies today.'}:{a:'rk-took-down',en:'Took down the Venatah!'},false),200);
   an(loser,[{filter:'grayscale(0) brightness(1)'},{filter:'grayscale(1) brightness(.5)'}],{d:1100,f:'forwards'});
   an(k,[{opacity:0,transform:'translate(-50%,-50%) scale(3.4) rotate(-16deg)'},{opacity:1,transform:'translate(-50%,-50%) scale(1) rotate(-10deg)'}],{d:560,e:'cubic-bezier(.3,1.5,.5,1)',f:'forwards',dl:350});
   ctx.t(()=>{shake(R,9,460);fx.burst(172,300,{n:110,c:['#F6D488','#fff','#E8B34B','#FF6B6B'],v:9,g:.13,s:3.2,l:76})},800)}
  ctx.t(()=>result(win,ko),ko?2200:600)}
 function result(win,ko){const g=G[me],add=got*20+(win?40:0)+(ko?100:0),lvUp=g.xp+add>=g.nx;const el=document.createElement('div');el.className='v11-rs';
  el.innerHTML=`<div class="in"><small>${win?(ko?'ПОБЕДА · K.O.':'ПОБЕДА ПО ОЧКАМ'):'ПОРАЖЕНИЕ'}</small><b>${win?'Ты сильнее Бори':'Боря сильнее — реванш?'}</b>
   <div class="st"><span><b>${dealt}</b><small>урон</small></span><span><b>${best<99?best.toFixed(1).replace('.',','):'—'} с</b><small>лучший ответ</small></span><span><b>${got} из 3</b><small>верно</small></span></div>
   <div class="xp">${mini8(me)}<span><b>${HERO[me].n} · +${add} опыта</b><i><i></i></i><small>${lvUp?`ур. ${g.lv} → <em>${g.lv+1}</em>`:`${g.xp+add} из ${g.nx}`}</small></span></div>
   ${win?`<div class="bk"><span>${ic('ticket')}<b>+200</b></span><small>банк твой</small></div>`:''}
   <div class="bt"><button class="rv">${ic('sword')}Реванш — другой диалог</button><button class="an">Разбор ответов</button></div></div>`;
  R.appendChild(el);an(el,[{opacity:0},{opacity:1}],{d:260});an($('.in',el),[{transform:'translateY(70%)'},{transform:'none'}],{sp:SPs});
  $$('.in>*',el).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:200+i*80}));
  $$('.st b',el).forEach((b,i)=>{if(i===0)countUp(ctx,b,dealt,900)});
  const xi=$('.xp i>i',el);xi.style.transform=`scaleX(${(g.xp/g.nx).toFixed(3)})`;ctx.t(()=>{xi.style.transform=`scaleX(${Math.min(1,(g.xp+add)/g.nx).toFixed(3)})`},700);
  if(lvUp)ctx.t(()=>{const e2=$('.xp em',el),r=rel(e2,R);an(e2,[{transform:'scale(2.2)'},{transform:'none'}],{sp:SPb});fx.burst(r.x+6,r.y+6,{n:40,c:['#2EE6C5','#fff','#F2C14E'],v:5,g:.05,s:2.4,l:40})},1900);
  ctx.on($('.rv',el),'click',()=>{an($('.rv',el),[{transform:'scale(.96)'},{transform:'none'}],{sp:SPb});toast(R,'Реванш: «Тяжела корона» — другой диалог, те же герои')});
  ctx.on($('.an',el),'click',()=>toast(R,'Разбор: 3 реплики с голосом и что значили слова'))}
 // вступление: половинки въезжают по диагонали, VS бьёт, полоски заполняются → «Бой!»
 const IN=$('.v11-in',R);
 an($('.v11-in .h.l',R),[{transform:'translateX(-105%)'},{transform:'none'}],{sp:SPs,dl:120});an($('.v11-in .h.r',R),[{transform:'translateX(105%)'},{transform:'none'}],{sp:SPs,dl:120});
 $$('.v11-in .h b,.v11-in .h small',R).forEach((x,i)=>an(x,[{opacity:0,transform:`translateX(${i<2?-40:40}px)`},{opacity:1,transform:'none'}],{sp:SPs,dl:380+i*40}));
 an($('.v11-in .vs',R),[{opacity:0,transform:'translate(-50%,-50%) scale(3) rotate(-14deg)'},{opacity:1,transform:'translate(-50%,-50%) scale(1) rotate(-8deg)'}],{d:380,e:'cubic-bezier(.3,1.5,.5,1)',dl:720});
 an($('.v11-in .sw',R),[{opacity:.9,transform:'translate(-50%,-50%) scale(.2)'},{opacity:0,transform:'translate(-50%,-50%) scale(3)'}],{d:700,e:EO,dl:860});
 an($('.v11-in .bk',R),[{opacity:0,transform:'translate(-50%,10px)'},{opacity:1,transform:'translate(-50%,0)'}],{sp:SPs,dl:1100});
 ctx.t(()=>{shake(R,7,360);fx.burst(172,377,{n:60,c:['#FFD86B','#fff','#FF8A4C'],v:8,g:.06,s:2.6,l:50});voice11(ctx,'rk-king-here',{mute:!loud()})},820);
 $$('.v11-hp .v,.v11-hp .gh',R).forEach(x=>{x.style.transform='scaleX(0)'});
 ctx.t(()=>{const z=an(IN,[{opacity:1},{opacity:0,transform:'scale(1.08)'}],{d:420,e:EI,f:'forwards'});if(z)z.onfinish=()=>IN.remove();else IN.remove();
  an($('.v11-hud',R),[{opacity:0,transform:'translateY(-20px)'},{opacity:1,transform:'none'}],{sp:SPs});$$('.v11-hp .v,.v11-hp .gh',R).forEach((x,i)=>ctx.t(()=>{x.style.transform='scaleX(1)'},200+i*40));
  an($('.v11-p.l',R),[{transform:'translateX(-60px)',opacity:0},{transform:'none',opacity:1}],{sp:SPs});an($('.v11-p.r',R),[{transform:'translateX(60px)',opacity:0},{transform:'none',opacity:1}],{sp:SPs});
  ctx.t(()=>{rd=0;banner('',`БОЙ!`);ctx.t(()=>round(0),1000)},500)},2100);
 // демо: само отвечает, пока не тронули
 if(o.demo!==false){(async()=>{for(let n=0;n<200;n++){await ctx.wait(300);if(touched||over)return;if(!pn.classList.contains('on')||iMe)continue;const q=pn._q;if(!q)continue;await ctx.wait(1900);if(touched||iMe)return;
   if(q.t==='tiles'){for(const w of q.ans){const b=$$('.tl button',pn).find(x=>!x.disabled&&x.textContent===w);if(b)b.click();await ctx.wait(210);if(touched)return}await ctx.wait(250);const ck=$('.ckb',pn);if(ck&&!ck.disabled)ck.click()}
   else{const b=$(`.op button[data-j="${q.r}"]`,pn);if(b)b.click()}}})()}}

V.push({g:'g11',id:'g11v',n:'Versus · как файтинг',
 idea:'Ты сказал «реально норм, но можешь лучше». Что стало лучше: 1) вступление как в файтинге — половинки с героями въезжают по диагонали, «VS» бьёт с волной, Король кричит «The rat king is here!»; 2) сверху HUD: толстые полоски здоровья с «призрачной» белой частью, таймер кругом, три раунда точками, у Бори — «отвечает…»; 3) реплика — пузырём над головой того, кто говорит, с настоящим голосом (▶ — ещё раз), лица не закрывает; 4) Боря отвечает одновременно с тобой — его удары тоже прилетают (а не только твои); 5) удар: стоп-кадр, вспышка, отлёт и тряска, урон крупно, быстрый ответ — КРИТ, подряд — КОМБО ×2, ×3; 6) последний удар — K.O.: соперник сереет в замедлении, Венатор говорит «Evil dies today.», печать K.O.; 7) итог: урон, лучший ответ, опыт героя (ур. 2 → 3), банк, «Реванш — другой диалог». Задания — те же три (собери, что значит, на слух) по настоящим репликам «Проповеди свинца».',
 moves:['вступление: диагональные половинки, VS, ударная волна, тряска','удар: стоп-кадр → вспышка → отлёт → «−150 КРИТ» → полоска тает','у Бори «отвечает…» — его удар прилетает тебе','K.O.: замедление, серый соперник, печать, искры; итог выезжает снизу'],
 from:'Твой отзыв на v9: «версусы можешь как-то улучшить, не знаю что, но улучши — типа норм, реально норм, но можешь лучше, я это вижу. Если что, откат сделаем».',
 minus:'Таймер и КРИТ за скорость добавляют давления. Если кому-то это мешает учить — крит можно давать просто за первую попытку, без таймера.',
 mount(R,ctx){vs11(R,ctx,{})}});

/* --- фоны героев: на весь экран, листай вбок; «под героем» — как выглядит фон за живым портретом --- */
function g11Bgs(R,ctx){R.className='scr v8 g11 g11bg';const K=['venator','rat','talon','rem','celeste'],MV={venator:'лучи витража ходят, роза медленно вращается, пыль в лучах, свечи дрожат',rat:'вода течёт двумя слоями, с потолка капает — круги, глаза в темноте мигают',talon:'деревья качаются от ветра, ветки в углах, падают листья, светлячки',rem:'облака плывут двумя слоями, звёзды мерцают, «z» всплывают',celeste:'два прожектора ходят, сверху падает конфетти'};let i=0,under=false;
 R.innerHTML=`${SB(0)}<div class="bg11-st">${K.map((k,j)=>`<div class="bg11-sl${j?'':' on'}" data-k="${k}"><div class="bg">${heroBg11(k)}</div>${G11H[k]?`<video muted loop playsinline data-hv="${G11H[k].v}" poster="${IMG[G11H[k].v]}"></video>`:`<i class="vt" style="background-image:url(${VT(k)})"></i>`}</div>`).join('')}</div>
  <div class="bg11-hd"><b>Фоны героев</b><small>чуть живые · листай вбок</small></div>
  <div class="bg11-ft"><div class="nm"><i class="em">${emb(K[0],44)}</i><span><b>${HERO[K[0]].n}</b><small>${MV[K[0]]}</small></span></div>
   <div class="sw"><button class="on" data-u="0">Только фон</button><button data-u="1">Под героем</button><i></i></div><div class="dots">${K.map((k,j)=>`<i class="${j?'':'on'}"></i>`).join('')}</div></div><i class="hb"></i>`;
 $$('video[data-hv]',R).forEach(v=>{v.src=vurl(v.dataset.hv);v.muted=true;const p=v.play();if(p&&p.catch)p.catch(()=>{})});
 const SL=$$('.bg11-sl',R),nm=$('.bg11-ft .nm',R),D=$$('.bg11-ft .dots i',R),SW=$$('.bg11-ft .sw button',R);let touched=false;ctx.on(R,'pointerdown',()=>{touched=true},{capture:true});
 const go=(j,dir)=>{j=(j+K.length)%K.length;if(j===i)return;const a=SL[i],b=SL[j];a.classList.remove('on');b.classList.add('on');an(b,[{opacity:0,transform:`translateX(${dir*40}px) scale(1.04)`},{opacity:1,transform:'none'}],{d:520,e:EO});an(a,[{opacity:1},{opacity:0,transform:`translateX(${-dir*30}px)`}],{d:420,e:EO});i=j;const k=K[i];
  nm.innerHTML=`<i class="em">${emb(k,44)}</i><span><b>${HERO[k].n}</b><small>${MV[k]}</small></span>`;an(nm,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{sp:SPs});D.forEach((d,q)=>d.classList.toggle('on',q===i))};
 drag(ctx,$('.bg11-st',R),{axis:'x',end(dx,dy,vx){if(Math.abs(dx)>40||Math.abs(vx)>.4)go(i+(dx<0?1:-1),dx<0?1:-1)},tap(){}});
 SW.forEach((b,q)=>ctx.on(b,'click',()=>{under=!!q;SW.forEach(x=>x.classList.toggle('on',x===b));$('.bg11-ft .sw i',R).style.transform=`translateX(${q*100}%)`;R.classList.toggle('und',under)}));
 an($('.bg11-ft',R),[{transform:'translateY(40px)',opacity:0},{transform:'none',opacity:1}],{sp:SPs,dl:200});
 const demo=async()=>{await ctx.wait(3800);for(let n=0;n<10;n++){if(touched)return;if(n===2){SW[1].click();await ctx.wait(3400);if(touched)return;SW[0].click()}go(i+1,1);await ctx.wait(3600)}};demo()}
V.push({g:'g11',id:'g11b',n:'Фоны героев · чуть живые',
 idea:'Фоны те же (тебе понравились), движение — заметное, но лайтово: у Талона деревья качаются от ветра, ветки в углах, падают листья и мигают светлячки; у Венатора медленно вращается роза витража, ходят лучи и в них плывёт пыль, дрожат свечи; у Крысы вода течёт двумя слоями, с потолка капает — и расходятся круги, в темноте мигают глаза; у Рэм плывут облака и всплывают «z»; у Селесты ходят прожекторы и падает конфетти. Каждый фон — на весь экран, листай вбок. Кнопка «Под героем» — как фон смотрится за живым портретом (у Венатора и Короля — их ролики).',
 moves:['Талон: деревья качаются, листья падают и кружатся, светлячки','Венатор: роза вращается, лучи ходят, пыль всплывает, свечи дрожат','Крыса: вода течёт, капля падает — круги по воде','«Под героем»: живой портрет поверх фона'],
 from:'Твой отзыв на v9: «фоны героев ахуенно, ток анимируй их немного совсем чучуть: у Талона шевелится листва, у Венатора чёт, у Крысы вода двигается — ну ты понял, лайтовенько».',
 minus:'Всё — сдвиг и прозрачность, телефон не грузит. Если на слабом будет тормозить — оставим по одному движению на фон.',
 mount(R,ctx){g11Bgs(R,ctx)}});
