/* ================= v21 · по твоим заметкам к v20 ================= */
// 1. Радар — однотонный 3D-город: дома по сетке с широкими улицами, не выше 16 этажей, камера выше — дома не наезжают друг на друга; без звука
function city21(){let s=29;const r=()=>(s=(s*16807)%2147483647)/2147483647;const B=[];
 const LMK=Object.values(C11LM).map(v=>[v[0],v[2]]),riv=(x,z)=>Math.abs(x-z*.62+6)<10,near=(x,z)=>LMK.some(([a,b])=>Math.abs(x-a)<12&&Math.abs(z-b)<12);
 for(let gx=-6;gx<=6;gx++)for(let gz=-6;gz<=6;gz++){const x=gx*12,z=gz*12;if(riv(x,z)||near(x,z)||r()<.14)continue;const w=5+r()*1.5,d=5+r()*1.5;B.push({t:'box',x:x-w/2,z:z-d/2,w,d,h:3+r()*r()*13})}
 // ориентиры — те же места, что у точек радара, ниже и проще: одна коробка, у главных — второй ярус
 for(const [k,[x,y,z]] of Object.entries(C11LM)){const w=k==='ht'?7:9;B.push({t:'box',x:x-w/2,z:z-w/2,w,d:w,h:k==='ht'?24:k==='pw'?12:8,lm:k});if(k==='ht'||k==='cr')B.push({t:'box',x:x-w/4,z:z-w/4,w:w/2,d:w/2,h:k==='ht'?8:10,y0:k==='ht'?24:8,lm:k})}
 B[0].mono=1;return B}
function draw3d21(g,W,H,cam,B,t){const pitch=Math.min(1.36,cam.pitch+.24),cy=Math.cos(cam.yaw),sy=Math.sin(cam.yaw),cp=Math.cos(pitch),sp=Math.sin(pitch),S=cam.s*.92,ox=W/2,oy=H*.52;
 const P=(x,y,z)=>{const dx=x-cam.cx,dz=z-cam.cz,rx=dx*cy-dz*sy,rz=dx*sy+dz*cy;return [ox+rx*S,oy+(rz*sp-y*cp)*S,rz*cp+y*sp]};
 g.clearRect(0,0,W,H);
 const poly=(pts,f)=>{g.fillStyle=f;g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill()};
 poly([[-82,-82],[82,-82],[82,82],[-82,82]].map(([x,z])=>P(x,0,z)),'#10151b');
 // река — тот же тон, чуть темнее
 const rv=[];for(let i=0;i<=24;i++){const z=-82+i*164/24;rv.push([z*.62-6-10,z])}for(let i=24;i>=0;i--){const z=-82+i*164/24;rv.push([z*.62-6+10,z])}
 poly(rv.map(([x,z])=>P(x,0,z)),'#0b0f14');
 // кольца и луч — единственный цвет радара
 g.strokeStyle='rgba(46,230,197,.14)';g.lineWidth=1;[30,55,80].forEach(R0=>{g.beginPath();for(let a=0;a<=48;a++){const p=P(Math.cos(a/48*6.283)*R0,0,Math.sin(a/48*6.283)*R0);a?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1])}g.stroke()});
 const sa=t*.0011;for(let k=0;k<6;k++){const a0=sa-k*.1,a1=a0-.1,c0=P(0,0,0),p0=P(Math.cos(a0)*84,0,Math.sin(a0)*84),p1=P(Math.cos(a1)*84,0,Math.sin(a1)*84);g.fillStyle=`rgba(46,230,197,${(.16*(1-k/6)).toFixed(3)})`;g.beginPath();g.moveTo(c0[0],c0[1]);g.lineTo(p0[0],p0[1]);g.lineTo(p1[0],p1[1]);g.closePath();g.fill()}
 // дома: один цвет, свет только от наклона стены; дальние — первыми
 const L=B.map(b=>[P(b.x+b.w/2,(b.y0||0),b.z+b.d/2)[2],b]).sort((a,b)=>a[0]-b[0]);
 const tone=(k,lm)=>{const v=lm?k*1.18:k;return `rgb(${(58*v)|0},${(68*v)|0},${(80*v)|0})`};
 for(const [,b] of L){const y0=b.y0||0,y1=y0+b.h,x0=b.x,x1=b.x+b.w,z0=b.z,z1=b.z+b.d,fx=sy>0?x1:x0,fz=cy>0?z1:z0;
  poly([P(fx,y0,z0),P(fx,y0,z1),P(fx,y1,z1),P(fx,y1,z0)],tone(.62,b.lm));
  poly([P(x0,y0,fz),P(x1,y0,fz),P(x1,y1,fz),P(x0,y1,fz)],tone(.8,b.lm));
  poly([P(x0,y1,z0),P(x1,y1,z0),P(x1,y1,z1),P(x0,y1,z1)],tone(1.12,b.lm))}
 return P}
{const d0=draw3d11;draw3d11=function(g,W,H,cam,B,t){return (B[0]&&B[0].mono?draw3d21:d0)(g,W,H,cam,B,t)}}
function radar21(R,ctx){const c0=city11;city11=city21;try{radar11(R,ctx,'city')}finally{city11=c0}R.classList.add('r21');
 const h=$('.r11-hint',R);if(h)h.textContent='крути · тап по точке — подлетим'}

// 2. «Сегодня в Deadlock» → «Сводка Ночного Города» (как газета в мире игры: Нью-Йорк 20-х, оккультный)
const Z21N=[['Ночная сводка','как вечерняя газета в мире игры'],['Слухи с улиц','то, что шепчут в барах Нью-Йорка'],['Дела на ночь','коротко и по делу']];
function z21Dl(R,ctx,k){z20Dl(R,ctx);const b=$('.z20-plan .hd b',R),sm=$('.z20-plan .hd small',R);if(b)b.textContent=Z21N[k][0];if(sm)sm.textContent='3 дела · ~6 мин';R.classList.add('z21dl');
 const P=$('.z20-plan',R);if(P&&!$('.z21-alt',R)){P.insertAdjacentHTML('afterbegin',`<div class="z21-alt">${Z21N.map(([n],i)=>`<button data-n="${i}" class="${i===k?'on':''}">${n}</button>`).join('')}</div>`);
  ctx.on($('.z21-alt',R),'click',e=>{const x=e.target.closest('[data-n]');if(!x)return;const i=+x.dataset.n;$$('.z21-alt button',R).forEach(y=>y.classList.toggle('on',y===x));b.textContent=Z21N[i][0];toast(R,Z21N[i][1])})}}

// 3. Профиль-бенто без фона внизу: фон из Коллекции и так стоит в шапке
function z21Bento(R,ctx){const o=V.find(x=>x.id==='h3');o.mount(R,ctx);const w=$('[data-w="bg"]',R);if(w)w.remove();R.classList.add('z21p')}

V.push({g:'y21',id:'z21r',n:'Радар · однотонный 3D-город',
 idea:'Твоё: «3D-город, только однотонно и чтобы здания друг на друга не наезжали; убери звук». Город — один серо-синий тон, ориентиры чуть светлее, цвет — только у луча радара и точек. Дома стоят по сетке с широкими улицами и не выше 16 этажей, камера выше — дома не закрывают друг друга. Звука нет.',
 moves:['город вырастает из земли','крутится сам и пальцем / мышью','тап по точке — подлетаем, «Читать» — комикс главы'],
 from:'Ты к v20: «все не очень… сделай как v11 · 3D-город, только однотонно и чтобы здания не наезжали… убери звук, заебался слушать».',
 minus:'Город придуманный: в игре карта другая. Места — по репликам героев.',
 mount(R,ctx){radar21(R,ctx)}});
V.push({g:'y21',id:'z21d',n:'«Ночная сводка» вместо «Сегодня в Deadlock»',
 idea:'Тот же план из 3 дел, название — из мира игры: Deadlock — оккультный Нью-Йорк 20-х, у города есть газеты и слухи. Сверху три варианта названия — нажми и выбери.',
 moves:['«Ночная сводка», «Слухи с улиц», «Дела на ночь» — переключаются сверху'],
 from:'Ты к v20: «норм, только по-другому называй, как-то более аутентично».',
 minus:'—',
 mount(R,ctx){z21Dl(R,ctx,0)}});
V.push({g:'y21',id:'z21p',n:'Профиль-бенто без фона внизу',
 idea:'Убрал виджет «Фон из Коллекции» внизу — фон уже стоит в шапке профиля. Остальное как было: любимая фраза, фильм, герой, серия, выучено, Versus.',
 moves:['«Изменить» — виджеты дрожат, «−» и «＋ Виджет» — как было'],
 from:'Ты к v20: «типа такого норм, только не понимаю, зачем внизу фон из Коллекции — вверху же есть».',
 minus:'—',
 mount(R,ctx){z21Bento(R,ctx)}});
V.push({g:'y21',id:'z21v',n:'Versus · герой сначала говорит',
 idea:'Починил то, что ты заметил: «Венатор ничего не ляпнул, а просит собрать фразу». Теперь в раунде «Собери» Венатор сначала говорит свою реплику голосом (текст скрыт точками, внизу «послушай и собери»), потом кубики. «Ещё раз» — послушать снова. Верно — реплика звучит ещё раз уже с текстом.',
 moves:['говорит — у окна загорается рамка его цвета','собрал верно — урон сопернику, реплика с субтитром','остальные раунды — как были'],
 from:'Ты к v20 (Versus · компактный): «осталась проблема — Венатор ничо не ляпнул, а просит ввести фразу; анимацию добавить в будущем».',
 minus:'Поправка общая: так же теперь и в «Versus · компактный» v15.',
 mount(R,ctx){y5Vs(R,ctx)}});
