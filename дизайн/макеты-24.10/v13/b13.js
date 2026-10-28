/* --- Радар v13: 3D в цветах v12 (бирюза на тёмном) 1 в 1, но вместо плит с карточками — модельки мест одним цветом:
   собор со шпилем, вход в туннель, цирковой шатёр, лес, лаборатория с башней, отель, электростанция, кладбище, холмы сна.
   Свет один и тот же для всех (сверху слева), грани считаются от поворота карты — поэтому не «кривой», как в v11. Подписей-карточек нет. --- */
// кубик: x,y — угол на карте, w×d — основание, h — высота, z — на какой высоте стоит
const bx13=(x,y,w,d,h,z,c)=>`<i class="b3${c?' '+c:''}" style="left:${x}px;top:${y}px;width:${w}px;height:${d}px;transform:translateZ(${z||0}px)"><i class="f zt" style="width:${w}px;height:${d}px;transform:translateZ(${h}px)"></i><i class="f zs" style="top:${d}px;width:${w}px;height:${h}px"></i><i class="f zn" style="width:${w}px;height:${h}px"></i><i class="f zw" style="width:${h}px;height:${d}px"></i><i class="f ze" style="left:${w}px;width:${h}px;height:${d}px"></i></i>`;
// пирамида (шпиль, шатёр, ёлка, холм): основание s×s, высота hp
function py13(x,y,s,hp,z,c){const L=Math.hypot(hp,s/2),ang=-Math.asin(hp/L)*180/Math.PI;const S=['zs','zw','zn','ze'];
 return `<i class="p3${c?' '+c:''}" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px;transform:translateZ(${z||0}px)">${S.map((q,i)=>`<i class="pw" style="transform:rotateZ(${i*90}deg)"><i class="f ${q} tr" style="width:${s}px;height:${L.toFixed(1)}px;top:${(s-L).toFixed(1)}px;transform:rotateX(${ang.toFixed(2)}deg)"></i></i>`).join('')}</i>`}
// двускатная крыша: основание w×d, высота hr, конёк — вдоль длинной стороны (x)
function rf13(x,y,w,d,hr,z,c){const L=Math.hypot(hr,d/2),ang=-Math.asin(hr/L)*180/Math.PI,sl=q=>`<i class="f ${q}" style="width:${w}px;height:${L.toFixed(1)}px;top:${(d-L).toFixed(1)}px;transform:rotateX(${ang.toFixed(2)}deg)"></i>`;
 return `<i class="p3 rf${c?' '+c:''}" style="left:${x}px;top:${y}px;width:${w}px;height:${d}px;transform:translateZ(${z||0}px)"><i class="pw">${sl('zs')}</i><i class="pw" style="transform:rotateZ(180deg)">${sl('zn')}</i><i class="f zw tri" style="width:${hr}px;height:${d}px"></i><i class="f ze tri" style="left:${w}px;width:${hr}px;height:${d}px"></i></i>`}
// «щит» стоит лицом к камере (луна, шар, луч сигнала)
const bb13=(x,y,z,html,c)=>`<i class="bb3${c?' '+c:''}" style="left:${x}px;top:${y}px;--z:${z}px">${html}</i>`;
// подпись лежит на земле, всегда читается
const lb13=(x,y,t,k)=>`<i class="lb3" data-k="${k}" style="left:${x}px;top:${y}px"><b>${t}</b></i>`;
const MD13={
 sobor:()=>bx13(-28,-14,56,24,20,0)+rf13(-28,-14,56,24,12,20)+bx13(28,-10,10,16,14,0)+rf13(28,-10,10,16,6,14)+bx13(-42,10,16,16,44,0)+py13(-42,10,16,26,44)+bx13(-34.8,17.2,1.6,1.6,10,68)+bx13(-38,17.2,8,1.6,1.6,74),
 tun:()=>`<i class="rl13" style="left:-7px;top:14px"></i>`+bx13(-34,-24,68,28,10,0,'hill')+bx13(-16,4,32,10,20,0,'portal')+rf13(-16,4,32,10,6,20)+bx13(22,8,10,10,4,0)+`<i class="mh13" style="left:-40px;top:16px"></i><i class="mh13" style="left:28px;top:-26px"></i>`,
 cir:()=>bx13(-22,-22,44,44,8,0,'drum')+py13(-22,-22,44,32,8,'tent')+bx13(-.8,-.8,1.6,1.6,14,40)+bb13(0,0,54,'<i class="flg13"></i>')+bx13(28,-6,10,10,6,0),
 les:()=>[[-22,-14,20,30],[2,-22,16,24],[-6,4,22,34],[16,2,14,20],[-30,10,12,18]].map(([x,y,s,h])=>bx13(x+s/2-1.5,y+s/2-1.5,3,3,5,0,'trunk')+py13(x,y,s,h,5,'tree')).join(''),
 lab:()=>bx13(-24,-14,40,28,18,0)+bx13(20,-8,8,8,40,0)+bb13(24,-4,46,'<i class="sph13"></i>')+bx13(-18,-24,10,10,26,0),
 niz:()=>py13(-34,-14,34,10,0,'hillp')+py13(-4,-24,30,14,0,'hillp')+py13(2,2,26,8,0,'hillp')+bb13(-4,-6,58,'<i class="moon13"></i>'),
 kla:()=>bx13(-28,-22,56,1.6,6,0)+bx13(-28,20.4,56,1.6,6,0)+bx13(-28,-22,1.6,44,6,0)+bx13(26.4,-22,1.6,44,6,0)+[[-16,-10],[-2,-10],[12,-10],[-16,6],[2,6],[14,6]].map(([x,y],i)=>i%2?bx13(x,y,6,2,8,0):(bx13(x+2.2,y,1.6,1.6,12,0)+bx13(x,y,6,1.6,1.6,8))).join(''),
 otl:()=>bx13(-16,-14,32,26,64,0,'win')+bx13(-10,12,20,8,2,14,'awn')+bx13(-12,-10,8,8,8,64),
 ele:()=>bx13(-26,-14,40,28,20,0)+bx13(18,-14,9,9,48,0)+bx13(18,2,9,9,40,0)+py13(-34,-30,12,52,0,'pylon')};
// карта 300×300: где стоит каждое место (центр модели), чьё оно
const RD13=[{k:'sobor',n:'Собор',h:'venator',x:150,y:96},{k:'tun',n:'Туннели',h:'rat',x:150,y:206},{k:'cir',n:'Цирк',h:'celeste',x:252,y:150},
 {k:'les',n:'Старый лес',h:'talon',x:52,y:72},{k:'lab',n:'Лаборатория',h:'victor',x:52,y:182},{k:'niz',n:'Сонная низина',h:'rem',x:92,y:266},
 {k:'kla',n:'Кладбище',h:'danny',x:206,y:268},{k:'otl',n:'Отель',h:'doorman',x:264,y:240},{k:'ele',n:'Электростанция',h:'seven',x:250,y:52}];
const RS13={tun:{a:'rat',b:'venator',t:'«Охота объявлена»',m:'5 реплик · ×2 опыта',left:'ещё 5:12'},sobor:{a:'venator',b:'rat',t:'«Проповедь свинца»',m:'7 реплик · ×2 опыта',left:'ещё 3:40'}};
function map13(mini){return `<span class="r13-pl${mini?' mini':''}"><i class="fl13"></i>
  <svg class="rv13" viewBox="0 0 300 300"><path d="M-10 146 C40 136 70 118 108 132 S188 166 222 148 S288 108 330 120" fill="none" stroke="hsl(172 60% 40% / .35)" stroke-width="13" stroke-linecap="round"/><path class="fl" d="M-10 146 C40 136 70 118 108 132 S188 166 222 148 S288 108 330 120" fill="none" stroke="hsl(172 80% 78% / .5)" stroke-width="1.4" stroke-dasharray="5 13"/></svg>
  ${RD13.map(d=>`<span class="m13" data-k="${d.k}" style="left:${d.x}px;top:${d.y}px">${MD13[d.k]()}${RS13[d.k]&&!mini?`<i class="pu13"></i><i class="pu13 b"></i>`+bb13(0,0,0,'<i class="bm13"></i>','beam'):''}</span>`).join('')}
  ${mini?'':RD13.map(d=>lb13(d.x,d.y+(d.k==='sobor'?34:d.k==='tun'?24:28),d.n,d.k)).join('')}</span>`}
// свет: грань ярче, если смотрит туда, откуда свет (верх-лево экрана); считаем от угла поворота карты
function light13(pl,a){const L=q=>{const v=22+11*Math.cos((q+a-225)*Math.PI/180);return v.toFixed(1)};pl.style.setProperty('--a',a.toFixed(2)+'deg');pl.style.setProperty('--le',L(0));pl.style.setProperty('--ls',L(90));pl.style.setProperty('--lw',L(180));pl.style.setProperty('--ln',L(270))}
function radarMini13(){return `<span class="r13-mn">${map13(1)}</span>`}
function radarSpin13(ctx,root){const P=$$('.r13-mn .r13-pl',root);if(!P.length)return;let a=-30;light13(P[0],a);ctx.loop((n,dt)=>{a+=dt*.008;P.forEach(p=>light13(p,a))})}
function radar13(R,ctx,o){o=o||{};R.className='scr v8 g11 r12 r13';
 R.innerHTML=`${SB(0)}<div class="r12-hd"><button class="r12-bk">${ic('back')}</button><span><b>Радар</b><small>2 сигнала · новые через 5:12:40</small></span><em>⚡ ×2 опыта</em></div>
  <div class="r13-st">${map13()}</div>
  <p class="r12-hint">тяни вбок — крутится · нажми на место</p>
  <div class="r13-sg">${Object.keys(RS13).map(k=>{const d=RD13.find(x=>x.k===k),s=RS13[k];return `<button data-k="${k}"><i class="dot"></i><span><b>${d.n}</b><small>${s.t} · ${s.left}</small></span>${ic('chev')}</button>`}).join('')}</div>
  <div class="r12-sh" hidden></div><canvas class="fx"></canvas><i class="hb"></i>`;
 const pl=$('.r13-pl',R),st=$('.r13-st',R),sh=$('.r12-sh',R),fx=FX(ctx,$('.fx',R));let a=-28,va=0,dr=false,touched=false,cur=null;light13(pl,a);
 an(pl,[{transform:'translate(-50%,-50%) rotateX(66deg) rotateZ(-80deg) scale(.7)',opacity:0},{transform:'translate(-50%,-50%) rotateX(56deg) rotateZ(var(--a)) scale(1.16)',opacity:1}],{d:1100,e:EO});
 $$('.m13',R).forEach((m,i)=>an(m,[{transform:'scale3d(1,1,.02)',opacity:0},{transform:'none',opacity:1}],{d:640,e:EO,dl:420+i*70}));
 let a0=a;drag(ctx,st,{axis:'x',start(){touched=true;dr=true;va=0;a0=a},move(dx,dy,vx){a=a0+dx*.45;light13(pl,a);va=vx*16*.45},end(){dr=false},tap(e,x,y){const el=document.elementFromPoint(x,y),m=el&&el.closest&&el.closest('.m13,.lb3');if(m)open(m.dataset.k)}});
 ctx.loop((n,dt)=>{if(dr)return;if(Math.abs(va)>.02){a+=va;va*=.93;light13(pl,a)}else if(!touched){a+=dt*.004;light13(pl,a)}});
 function open(k){const d=RD13.find(x=>x.k===k),s=RS13[k],h=H12[d.h];cur=k;$$('.m13',R).forEach(m=>m.classList.toggle('on',m.dataset.k===k));
  sh.hidden=false;sh.innerHTML=`<i class="hd"></i><div class="t">${hic12(d.h,'big')}<span><small>МЕСТО · ${h.ru.toUpperCase()}</small><b>${d.n}</b></span><button class="x">${ic('x')}</button></div>
   ${s?`<div class="rsg open"><span class="mm">${hic12(s.a)}${hic12(s.b)}</span><span><b>Перехват: ${s.t}</b><small>${s.m}</small></span><em>${s.left}</em></div><button class="go">${ic('book11')}Читать перехват</button>`
    :`<p class="nn">Сейчас тихо. Сигналы — раз в 8 часов, до 4 за раз. ${h.v?'':'Здесь заговорят, когда у героя будет живой портрет.'}</p>`}`;
  an(sh,[{transform:'translateY(110%)'},{transform:'none'}],{sp:SPs});const m=$(`.m13[data-k="${k}"]`,R),r=rel(m,R);fx.burst(r.x+r.w/2,r.y+r.h/2,{n:20,c:[h.ac,'#fff','#2EE6C5'],v:3.2,g:0,s:2,l:32});
  ctx.on($('.x',sh),'click',e=>{e.stopPropagation();close()});const go=$('.go',sh);if(go)ctx.on(go,'click',()=>{an(go,[{transform:'scale(.95)'},{transform:'none'}],{sp:SPb});g11Over(R,ctx,(pv,cc,cl)=>comic12(pv,cc,'who',{onBack:cl}),null,go)})}
 function close(){const z=an(sh,[{transform:'none'},{transform:'translateY(110%)'}],{d:220,e:EI,f:'forwards'});if(z)z.onfinish=()=>{sh.hidden=true};else sh.hidden=true;$$('.m13',R).forEach(m=>m.classList.remove('on'));cur=null}
 ctx.on($('.r13-sg',R),'click',e=>{const b=e.target.closest('[data-k]');if(b){touched=true;an(b,[{transform:'scale(.96)'},{transform:'none'}],{sp:SPb});open(b.dataset.k)}});
 ctx.on($('.r12-bk',R),'click',()=>{if(o.onBack)o.onBack();else toast(R,'← назад в Deadlock')});
 if(o.demo!==false)ctx.t(()=>{if(!touched)open('tun')},3600)}
