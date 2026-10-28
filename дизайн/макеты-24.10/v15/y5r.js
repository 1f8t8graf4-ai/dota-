/* --- Радар v15 · 5 вариантов (Андрей: «не совсем красиво, дай вариантов 5; если героев будет куча — ты же заебёшься рисовать;
   радар меняется сам или васян ищет реплику по всей карте?»).
   Ответ во всех пяти один: мест 9, они рисуются один раз; героев не рисуем — над местом всплывают их иконки.
   Перехваты (2–4 раз в 8 часов) — ещё и списком под радаром: искать по карте не надо, карта — для красоты и «где это». --- */
const Y5S=[{p:'tun',a:'rat',b:'venator',t:'Охота объявлена',n:5,left:'5:12'},{p:'sobor',a:'venator',b:'rat',t:'Проповедь свинца',n:7,left:'3:40'},{p:'otl',a:'doorman',b:'talon',t:'Месть за отца',n:5,left:'7:55'}];
const y5P=k=>RD13.find(q=>q.k===k);
const y5pair=(a,b,cl)=>`<span class="y5pr ${cl||''}">${hic12(a,'y5s')}${hic12(b,'y5s')}</span>`;
// общий каркас: шапка, место для радара, список перехватов. vis(box,c,api) рисует сам радар и возвращает focus(i)
function y5radar(R,ctx,o,kind,vis){o=o||{};R.className='scr y5 y5rd '+kind;
 R.innerHTML=`${SB(0)}<div class="y5rd-hd"><button class="y5bk" aria-label="Назад">${ic('back')}</button><span><b>Радар</b><small>3 перехвата · новые через 5:12</small></span></div>
  <div class="y5rd-vis"></div>
  <div class="y5rd-ls">${Y5S.map((s,i)=>{const P=y5P(s.p);return `<button data-i="${i}"><span class="pl">${ic('pin5')}<small>${P.n}</small></span><span class="t"><b>${s.t}</b><small>${H12[s.a].ru} и ${H12[s.b].ru} · ${s.n} реплик</small></span>${y5pair(s.a,s.b)}<em>${s.left}</em></button>`}).join('')}</div>
  <div class="y5rd-sh" hidden></div><i class="hb"></i>`;
 const box=$('.y5rd-vis',R);let touched=false,cur=-1;ctx.on(R,'pointerdown',e=>{if(e.isTrusted)touched=true},{capture:true});
 const api={sel(i){pick(i)},hi(i){$$('.y5rd-ls>button',R).forEach((b,j)=>b.classList.toggle('on',j===i))}};const focus=vis(box,ctx,api)||(()=>{});
 function pick(i){cur=i;$$('.y5rd-ls>button',R).forEach((b,j)=>b.classList.toggle('on',j===i));focus(i);
  const s=Y5S[i],P=y5P(s.p),sh=$('.y5rd-sh',R);sh.hidden=false;sh.innerHTML=`<i class="sc"></i><div class="pn"><i class="hd"></i><small>ПЕРЕХВАТ · ${P.n.toUpperCase()}</small><b>«${s.t}»</b>
   <span class="who">${y5pair(s.a,s.b,'big')}<span>${H12[s.a].ru} и ${H12[s.b].ru}<small>${s.n} реплик · ≈ 1 мин · ×2 опыта · ещё ${s.left}</small></span></span>
   <div class="bt"><button class="pri">${ic('comic13')}Читать комиксом</button><button class="sec">${ic('ear13')}Слушать</button></div></div>`;
  an($('.pn',sh),[{transform:'translateY(100%)'},{transform:'none'}],{sp:SPs});an($('.sc',sh),[{opacity:0},{opacity:1}],{d:200})}
 function unpick(){const sh=$('.y5rd-sh',R);if(sh.hidden)return;const z=an($('.pn',sh),[{transform:'none'},{transform:'translateY(100%)'}],{d:200,e:EI,f:'forwards'});const f=()=>{sh.hidden=true;sh.innerHTML=''};if(z)z.onfinish=f;else f();cur=-1;$$('.y5rd-ls>button',R).forEach(b=>b.classList.remove('on'));focus(-1)}
 ctx.on(R,'click',e=>{const t=e.target;if(t.closest('.y5bk')){o.onBack?o.onBack():toast(R,'← назад в Deadlock');return}
  if(t.closest('.y5rd-sh .sc')){unpick();return}
  if(t.closest('.y5rd-sh .pri')){unpick();toast(R,'Открывается глава комиксом');return}if(t.closest('.y5rd-sh .sec')){toast(R,'Диалог голосами, без заданий');return}
  const b=t.closest('.y5rd-ls>button');if(b){an(b,[{transform:'scale(.97)'},{transform:'none'}],{sp:SPb});pick(+b.dataset.i)}});
 $$('.y5rd-ls>button',R).forEach((b,i)=>an(b,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:500+i*70}));
 if(kind!=='rdi'){ctx.t(()=>{if(!touched)pick(0)},3600);ctx.t(()=>{if(!touched)unpick()},6200);ctx.t(()=>{if(!touched)pick(2)},7600)}}

/* 1 · Сонар: круг, бегущий луч, точки мест; луч прошёл по перехвату — всплывают двое героев */
function y5RadarA(R,ctx,o){y5radar(R,ctx,o,'ra',(box,c,api)=>{box.innerHTML=`<canvas class="cv"></canvas><span class="tags">${Y5S.map((s,i)=>{const P=y5P(s.p);return `<button class="tg" data-i="${i}" style="left:${(P.x/300*100).toFixed(1)}%;top:${(P.y/300*100).toFixed(1)}%">${y5pair(s.a,s.b)}</button>`}).join('')}</span>`;
 const cv=$('.cv',box),g=cv.getContext('2d'),dpr=Math.min(2,window.devicePixelRatio||1),W=300;cv.width=W*dpr;cv.height=W*dpr;g.setTransform(dpr,0,0,dpr,0,0);
 const tags=$$('.tg',box),seen=Y5S.map(()=>0),hot=Y5S.map(()=>0);let a=-1.2,f=-1;
 c.on(box,'click',e=>{const t=e.target.closest('.tg');if(t)api.sel(+t.dataset.i)});
 c.loop((n,dt)=>{a=(a+dt*.0013)%(Math.PI*2);g.clearRect(0,0,W,W);const C=W/2;
  const bg=g.createRadialGradient(C,C,10,C,C,C);bg.addColorStop(0,'#0f2a26');bg.addColorStop(1,'#071312');g.fillStyle=bg;g.beginPath();g.arc(C,C,C-2,0,7);g.fill();
  g.strokeStyle='rgba(46,230,197,.14)';g.lineWidth=1;[.25,.5,.75,1].forEach(q=>{g.beginPath();g.arc(C,C,(C-3)*q,0,7);g.stroke()});g.beginPath();g.moveTo(C,4);g.lineTo(C,W-4);g.moveTo(4,C);g.lineTo(W-4,C);g.stroke();
  if(g.createConicGradient){const cg=g.createConicGradient(a-1.1,C,C);cg.addColorStop(0,'rgba(46,230,197,0)');cg.addColorStop(.17,'rgba(46,230,197,.28)');cg.addColorStop(.175,'rgba(150,255,235,.0)');g.fillStyle=cg;g.beginPath();g.arc(C,C,C-3,0,7);g.fill()}
  g.strokeStyle='rgba(150,255,235,.7)';g.lineWidth=1.4;g.beginPath();g.moveTo(C,C);g.lineTo(C+Math.cos(a)*(C-3),C+Math.sin(a)*(C-3));g.stroke();
  g.font='600 8.5px Inter,sans-serif';g.textAlign='center';
  RD13.forEach(P=>{const si=Y5S.findIndex(s=>s.p===P.k),ang=(Math.atan2(P.y-C,P.x-C)+Math.PI*2)%(Math.PI*2),d=((a-ang)+Math.PI*2)%(Math.PI*2);
   if(si>=0){if(d<.1){hot[si]=1;if(!seen[si]){seen[si]=1;tags[si].classList.add('on');an(tags[si],[{opacity:0,transform:'translate(-50%,-100%) scale(.4)'},{opacity:1,transform:'translate(-50%,-100%)'}],{sp:SPb})}}hot[si]=Math.max(0,hot[si]-dt*.0006)}
   const h=si>=0?hot[si]:0,on=si===f;g.fillStyle=si>=0?`rgba(150,255,235,${.55+h*.45})`:'rgba(46,230,197,.35)';g.beginPath();g.arc(P.x,P.y,si>=0?3.2+h*2:2,0,7);g.fill();
   if(si>=0&&(h>.05||on)){g.strokeStyle=`rgba(150,255,235,${on?.8:h*.6})`;g.lineWidth=1.2;g.beginPath();g.arc(P.x,P.y,5+(on?6+Math.sin(n/220)*2:(1-h)*16),0,7);g.stroke()}
   g.fillStyle=si>=0?'rgba(200,255,244,.8)':'rgba(46,230,197,.4)';g.fillText(P.n.toUpperCase(),P.x,P.y+14)})});
 return i=>{f=i;tags.forEach((t,j)=>t.classList.toggle('sel',j===i))}})}

/* 2 · Ночной город: сам арт Deadlock, перехваты — огоньки на домах, лучи вверх, дождь */
const Y5CITY=[[30,60],[56,36],[78,66]];
function y5RadarB(R,ctx,o){y5radar(R,ctx,o,'rb',(box,c,api)=>{box.innerHTML=`<span class="art"><i class="img"></i><canvas class="rn"></canvas><i class="dk"></i></span>${Y5S.map((s,i)=>`<button class="y5pin" data-i="${i}" style="left:${Y5CITY[i][0]}%;top:${Y5CITY[i][1]}%"><i class="bm"></i><i class="dt"></i><i class="rp"></i><span class="y5lb">${y5pair(s.a,s.b)}<small>${y5P(s.p).n}</small></span></button>`).join('')}`;
 c.t(()=>rain11(c,$('.rn',box),{n:40}),300);an($('.img',box),[{transform:'scale(1.18)'},{transform:'scale(1.06)'}],{d:2200,e:EO,f:'forwards'});
 $$('.y5pin',box).forEach((p,i)=>an(p,[{opacity:0,transform:'translate(-50%,-50%) translateY(-20px)'},{opacity:1,transform:'translate(-50%,-50%)'}],{sp:SPb,dl:700+i*260}));
 c.on(box,'click',e=>{const t=e.target.closest('.y5pin');if(t)api.sel(+t.dataset.i)});
 // параллакс: потянул — город чуть смещается
 c.on(box,'pointermove',e=>{const r=box.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;$('.img',box).style.translate=`${(-x*10).toFixed(1)}px ${(-y*8).toFixed(1)}px`});
 return i=>{$$('.y5pin',box).forEach((p,j)=>p.classList.toggle('sel',j===i));box.classList.toggle('foc',i>=0)}})}

/* 3 · Карта сверху: схема города — река, улицы, районы цветом героя; булавки с иконками; карту можно тянуть */
function y5RadarC(R,ctx,o){y5radar(R,ctx,o,'rc',(box,c,api)=>{const D=RD13.map(P=>`<g class="ds" transform="translate(${P.x} ${P.y})"><path d="M-30 -20 L28 -26 L34 18 L-24 26 Z" fill="${H12[P.h].ac}" opacity=".09"/><circle r="3" fill="${H12[P.h].ac}" opacity=".7"/><text y="15" text-anchor="middle">${P.n}</text></g>`).join('');
 box.innerHTML=`<div class="pan"><svg viewBox="-20 -20 340 340"><rect x="-20" y="-20" width="340" height="340" fill="#101318"/>
   <g stroke="rgba(255,255,255,.05)" stroke-width="1">${Array.from({length:12},(_,i)=>`<path d="M${-20+i*30} -20 L${-30+i*30} 320"/><path d="M-20 ${-20+i*30} L320 ${-14+i*30}"/>`).join('')}</g>
   <path d="M-20 140 C40 128 70 112 110 128 S190 160 222 144 S290 104 330 116" fill="none" stroke="#1d3a4a" stroke-width="16" stroke-linecap="round"/>
   <path d="M-20 140 C40 128 70 112 110 128 S190 160 222 144 S290 104 330 116" fill="none" stroke="#2a5a70" stroke-width="2" stroke-dasharray="3 6" opacity=".6"/>
   <g fill="none" stroke="rgba(232,194,119,.26)" stroke-width="3.5" stroke-linecap="round"><path d="M150 -20 L150 320"/><path d="M-20 200 C80 190 200 214 320 196"/><path d="M40 -20 C70 120 30 220 70 320"/><path d="M270 -20 C240 100 290 220 250 320"/></g>
   ${D}</svg>
  ${Y5S.map((s,i)=>{const P=y5P(s.p);return `<button class="mp" data-i="${i}" style="left:${((P.x+20)/340*100).toFixed(1)}%;top:${((P.y+20)/340*100).toFixed(1)}%">${y5pair(s.a,s.b)}<i class="tip"></i></button>`}).join('')}</div>
  <span class="y5cmp">N</span>`;
 const pan=$('.pan',box);let px=0,py=0,bx=0,by=0;const set=()=>{pan.style.transform=`translate(${px}px,${py}px)`};
 drag(c,box,{start(){bx=px;by=py},move(dx,dy){px=clamp(bx+dx,-60,60);py=clamp(by+dy,-50,50);set()},tap(e){const t=e&&e.target&&e.target.closest&&e.target.closest('.mp');if(t)api.sel(+t.dataset.i)}});
 c.on(box,'click',e=>{const t=e.target.closest('.mp');if(t)api.sel(+t.dataset.i)});
 $$('.mp',box).forEach((p,i)=>an(p,[{opacity:0,transform:'translate(-50%,-100%) translateY(-24px)'},{opacity:1,transform:'translate(-50%,-100%)'}],{sp:SPb,dl:600+i*220}));
 return i=>{$$('.mp',box).forEach((p,j)=>p.classList.toggle('sel',j===i));if(i>=0){const P=y5P(Y5S[i].p);px=clamp((150-P.x)*.5,-60,60);py=clamp((150-P.y)*.45,-50,50);pan.style.transition='transform .5s cubic-bezier(.2,.8,.2,1)';set();c.t(()=>{pan.style.transition=''},520)}}})}

/* 4 · Рация: крутишь ручку частоты — шипение; поймал станцию — голос, место, двое героев. Без карты вообще */
const Y5FQ=[{f:88.4,i:0},{f:94.2,i:1},{f:101.7,i:2}];
function y5RadarD(R,ctx,o){y5radar(R,ctx,o,'rdi',(box,c,api)=>{let fq=86,tgt=null,caught=-1,noise=null,ng=null;
 box.innerHTML=`<div class="rad"><div class="scale"><span class="tk">${Array.from({length:41},(_,i)=>`<i class="${i%5?'':'b'}"><small>${i%10?'':86+i/2}</small></i>`).join('')}</span>${Y5FQ.map(q=>`<i class="st" style="left:${((q.f-86)/20*100).toFixed(1)}%"></i>`).join('')}<i class="nd"></i></div>
  <div class="lcd"><b class="fq">86.0</b><small>МГц</small><span class="msg">Покрути ручку — ищи голоса</span></div>
  <div class="knob"><i class="gr"></i><i class="mk"></i></div><span class="eq">${eqBars(16)}</span></div>`;
 const nd=$('.nd',box),fqEl=$('.fq',box),msg=$('.msg',box),kb=$('.knob',box);
 const paint=()=>{nd.style.left=((fq-86)/20*100).toFixed(2)+'%';fqEl.textContent=fq.toFixed(1);kb.style.transform=`rotate(${((fq-86)/20*300-150).toFixed(0)}deg)`;
  const near=Y5FQ.find(q=>Math.abs(q.f-fq)<.6);const v=near?Math.max(0,1-Math.abs(near.f-fq)/.6):0;box.style.setProperty('--sig',v.toFixed(2));
  if(ng)ng.gain.value=near?.05*(1-v):.05;
  if(near&&v>.8&&caught!==near.i){caught=near.i;const s=Y5S[near.i];msg.innerHTML=`<b>Пойман: ${y5P(s.p).n}</b> · ${H12[s.a].ru} и ${H12[s.b].ru}`;api.hi(near.i);an(msg,[{opacity:0},{opacity:1}],{d:200});
   if(s.a==='rat')say13(c,'rk-priest-vs-king',{echo:0});else if(s.a==='venator')say13(c,'ven-will-find',{echo:0})}
  else if(!near||v<.4){if(caught>=0){caught=-1;msg.textContent='Шум… ищи дальше';api.hi(-1)}}};
 const hiss=()=>{if(noise||!S13.live())return;const ac=S13.A0();const n=ac.sampleRate*2,b=ac.createBuffer(1,n,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;
  noise=ac.createBufferSource();noise.buffer=b;noise.loop=true;const f=ac.createBiquadFilter();f.type='bandpass';f.frequency.value=1800;f.Q.value=.6;ng=ac.createGain();ng.gain.value=.05;noise.connect(f);f.connect(ng);ng.connect(ac.destination);noise.start();
  c.add(()=>{try{noise.stop()}catch(e){}})};
 let auto=true,f0=fq;drag(c,box,{start(){auto=false;f0=fq;hiss()},move(dx){fq=clamp(f0+dx*.035,86,106);paint()}});
 // без касания — стрелка сама ползёт и ловит станции
 let dir=1;c.loop((n,dt)=>{if(!auto)return;if(tgt==null){tgt=0}const T=Y5FQ[tgt].f;fq+=Math.sign(T-fq)*Math.min(Math.abs(T-fq),dt*.004);paint();if(Math.abs(T-fq)<.01){auto=false;c.t(()=>{if(caught>=0){tgt=(tgt+1)%Y5FQ.length;auto=true}},3200)}});
 paint();return i=>{}})}

/* 5 · Изометрия: девять мест — плоские домики в изометрии, свет сверху слева, у перехвата — столб света и двое героев */
const Y5ISO={sobor:'ch',tun:'tn',cir:'ct',les:'tr',lab:'lb',niz:'hl',kla:'gv',otl:'ht',ele:'pw'};
function y5iso(t,ac){const L='rgba(255,255,255,.16)',M='rgba(255,255,255,.07)',D='rgba(0,0,0,.25)';const box=(w,h,d)=>`<path d="M0 0 L${w} ${w/2} L0 ${w} L${-w} ${w/2}Z" transform="translate(0 ${-h-w/2})" fill="${L}"/><path d="M${-w} ${-h} L0 ${-h+w/2} L0 ${w/2} L${-w} 0Z" fill="${M}"/><path d="M${w} ${-h} L0 ${-h+w/2} L0 ${w/2} L${w} 0Z" fill="${D}"/>`;
 const base=`<path d="M0 -14 L28 0 L0 14 L-28 0Z" fill="${ac}" opacity=".18"/>`;
 if(t==='ch')return base+box(12,18)+`<path d="M-6 -36 L0 -58 L6 -36Z" fill="rgba(255,255,255,.2)"/><path d="M0 -62v-6M-3 -65h6" stroke="rgba(255,255,255,.4)" stroke-width="1.2"/>`;
 if(t==='tn')return base+`<path d="M-16 4 A16 16 0 0 1 16 4" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="6"/><path d="M-10 6 A10 10 0 0 1 10 6Z" fill="#000" opacity=".6"/>`;
 if(t==='ct')return base+`<path d="M-16 0 L0 -30 L16 0Z" fill="rgba(255,255,255,.16)"/><path d="M0 -30 L-6 0M0 -30 L6 0" stroke="${ac}" stroke-width="3" opacity=".6"/><path d="M0 -30v-8l7 3-7 3" fill="${ac}"/>`;
 if(t==='tr')return base+[[-10,2],[8,-2],[0,8]].map(([x,y])=>`<path d="M${x} ${y} l-7 0 l7 -20 l7 20Z" fill="rgba(255,255,255,.14)"/>`).join('');
 if(t==='lb')return base+box(10,12)+`<path d="M8 -12 v-18" stroke="rgba(255,255,255,.3)" stroke-width="3"/><circle cx="8" cy="-34" r="5" fill="${ac}" opacity=".8"/>`;
 if(t==='hl')return base+`<path d="M-24 4 Q-10 -14 2 2 Q12 -10 24 4Z" fill="rgba(255,255,255,.12)"/><circle cx="12" cy="-22" r="5" fill="rgba(255,255,255,.35)"/>`;
 if(t==='gv')return base+[[-10,-2],[0,4],[10,-2]].map(([x,y])=>`<path d="M${x-3} ${y} v-9 a3 3 0 0 1 6 0 v9Z" fill="rgba(255,255,255,.2)"/>`).join('');
 if(t==='ht')return base+box(12,30)+Array.from({length:4},(_,i)=>`<rect x="-9" y="${-30+i*7}" width="3" height="3" fill="${ac}" opacity=".7" transform="skewY(26)"/>`).join('');
 return base+box(12,10)+`<path d="M-4 -16 v-18 M4 -12 v-20" stroke="rgba(255,255,255,.3)" stroke-width="4"/>`}
function y5RadarE(R,ctx,o){y5radar(R,ctx,o,'re',(box,c,api)=>{const GR={les:[0,0],sobor:[1,0],ele:[2,0],lab:[0,1],tun:[1,1],cir:[2,1],niz:[0,2],kla:[1,2],otl:[2,2]},pos=P=>{const [gx,gy]=GR[P.k];return [150+(gx-gy)*54,60+(gx+gy)*29]};
 box.innerHTML=`<svg viewBox="0 0 300 220"><defs><radialGradient id="y5ig" cx=".5" cy=".55" r=".6"><stop offset="0" stop-color="#16302b"/><stop offset="1" stop-color="#0a1110"/></radialGradient></defs><rect width="300" height="220" fill="url(#y5ig)"/>
  ${Array.from({length:4},(_,i)=>{const a=-.5+i;return `<path d="M${150+(a+.5)*54} ${60+(a-.5)*29} L${150+(a-2.5)*54} ${60+(a+2.5)*29}" stroke="rgba(46,230,197,.12)"/><path d="M${150-(a+.5)*54} ${60+(a-.5)*29} L${150-(a-2.5)*54} ${60+(a+2.5)*29}" stroke="rgba(46,230,197,.12)"/>`}).join('')}
  ${RD13.map(P=>{const [x,y]=pos(P),si=Y5S.findIndex(s=>s.p===P.k);return `<g class="pl${si>=0?' hot':''}" transform="translate(${x} ${y})" data-i="${si}">${si>=0?`<path class="beam" d="M-7 0 L-3 -120 L3 -120 L7 0Z" fill="${H12[Y5S[si].a].ac}"/>`:''}${y5iso(Y5ISO[P.k],H12[P.h].ac)}<text y="24" text-anchor="middle">${P.n}</text></g>`}).join('')}</svg>
  ${Y5S.map((s,i)=>{const [x,y]=pos(y5P(s.p));return `<button class="ib" data-i="${i}" style="left:${(x/300*100).toFixed(1)}%;top:${((y-62)/220*100).toFixed(1)}%">${y5pair(s.a,s.b)}</button>`}).join('')}`;
 $$('g.pl',box).forEach((g,i)=>an(g,[{opacity:0,transform:g.getAttribute('transform')+' translate(0 -16)'},{opacity:1,transform:g.getAttribute('transform')}],{sp:SPs,dl:200+i*60}));
 $$('.ib',box).forEach((b,i)=>an(b,[{opacity:0,transform:'translate(-50%,-50%) scale(.4)'},{opacity:1,transform:'translate(-50%,-50%)'}],{sp:SPb,dl:1000+i*200}));
 c.on(box,'click',e=>{const t=e.target.closest('.ib,g.pl.hot');if(t)api.sel(+t.dataset.i)});
 return i=>{$$('.ib',box).forEach((b,j)=>b.classList.toggle('sel',j===i));$$('g.pl.hot',box).forEach(g=>g.classList.toggle('sel',+g.dataset.i===i))}})}
