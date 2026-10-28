/* ================= v15 (27.10, ночь — отзыв Андрея на v13–v14) =================
   Общее правило v15 (Андрей: «громоздко», «перегруз», «UI такой себе»): на экране — только нужное.
   Объяснения — в описании варианта справа, не в телефоне. Без коробок в коробках, крупно главное, тихо остальное. */
Object.assign(ICO,{pause5:'<path d="M8 5v14M16 5v14"/>',sort5:'<path d="M7 4v16M4 17l3 3 3-3M17 20V4M14 7l3-3 3 3"/>',view5:'<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
 spark5:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',q5:'<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.4M12 16.6v.2"/>',pin5:'<path d="M12 21s-6-5.6-6-10.5a6 6 0 0 1 12 0C18 15.4 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',
 layers5:'<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',cam5:'<path d="M4 8h3l2-2.5h6L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.4"/>',send5:'<path d="M4 12l16-8-6 16-2.5-6.5z"/>',img5:'<rect x="3.5" y="5" width="17" height="14" rx="2.5"/><path d="M4 16l5-5 4 4 3-3 4 4"/><circle cx="15.5" cy="9" r="1.4"/>'});

// герои v15: фразы (выучено из всех), опыт до следующего уровня — для сортировок «Фразы» и «До уровня»
const Y5H={venator:{ph:18,of:40,lv:2,xp:340,nx:500},rat:{ph:12,of:36,lv:1,xp:240,nx:300},doorman:{ph:7,of:22,lv:1,xp:110,nx:300},talon:{ph:5,of:24,lv:1,xp:70,nx:300},
 rem:{ph:3,of:20,lv:1,xp:40,nx:300},victor:{ph:2,of:21,lv:1,xp:25,nx:300},seven:{ph:0,of:26,lv:1,xp:0,nx:300},celeste:{ph:0,of:18,lv:1,xp:0,nx:300},danny:{ph:0,of:19,lv:1,xp:0,nx:300}};
const Y5SORT={az:'А–Я',ph:'Фразы',lv:'До уровня'},Y5SZ={i:'Иконки',s:'Маленькие',c:'Карточки'};
const y5get=(k,d)=>{try{return localStorage.getItem(k)||d}catch(e){return d}},y5set=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
function y5stat(k,s){const d=Y5H[k],h=H12[k];if(s==='ph')return d.ph?`${d.ph} из ${d.of} фраз`:`${d.of} фраз · не начат`;if(s==='lv')return d.xp?`до ур. ${d.lv+1} — ${d.nx-d.xp} оп.`:'ещё не играл';return h.loc}
function y5ord(s){const K=[...HK12];if(s==='ph')return K.sort((a,b)=>Y5H[b].ph/Y5H[b].of-Y5H[a].ph/Y5H[a].of||H12[a].n.localeCompare(H12[b].n));
 if(s==='lv')return K.sort((a,b)=>(Y5H[a].xp?Y5H[a].nx-Y5H[a].xp:1e4)-(Y5H[b].xp?Y5H[b].nx-Y5H[b].xp:1e4)||H12[a].n.localeCompare(H12[b].n));return K.sort((a,b)=>H12[a].n.localeCompare(H12[b].n))}
const y5ring=(p,r)=>`<svg class="y5rg" viewBox="0 0 ${2*r+4} ${2*r+4}"><circle cx="${r+2}" cy="${r+2}" r="${r}" class="t"/><circle cx="${r+2}" cy="${r+2}" r="${r}" class="p" pathLength="100" style="stroke-dashoffset:${(100-Math.round(p*100))}"/></svg>`;
// карточка героя в трёх размерах: i — только иконка (без фона), s — маленькая карточка с фоном, c — как сейчас (фон на всю, иконка посередине)
function y5hc(k,m,s){const h=H12[k],d=Y5H[k],p=d.xp/d.nx,st=y5stat(k,s),soon=!h.v;
 if(m==='i')return `<button class="y5hc i${soon?' soon':''}" data-k="${k}" style="--ac:${h.ac}"><span class="ic">${hic12(k,'y5i')}${y5ring(p,29)}</span><b>${h.n}</b><small>${st}</small></button>`;
 return `<button class="y5hc ${m}${soon?' soon':''}" data-k="${k}" style="--ac:${h.ac}"><span class="bg">${loc13(k)}</span><i class="vg"></i><span class="ic">${hic12(k,'y5i')}${y5ring(p,m==='s'?21:27)}</span>
  <span class="nm"><b>${h.n}</b><small>${st}</small></span>${soon?'<em class="sn">портрет скоро</em>':''}</button>`}
// сетка героев: сортировка с перестановкой (FLIP), размер — перерисовка с каскадом
function y5grid(root,ctx,o){o=o||{};let s=o.sort||y5get('y5-sort','az'),m=o.size||y5get('y5-size','s');const box=$('.y5hg',root);
 const paint=()=>{box.className='y5hg m-'+m;box.innerHTML=y5ord(s).map(k=>y5hc(k,m,s)).join('');$$('.y5hc',box).forEach((b,i)=>an(b,[{opacity:0,transform:'translateY(14px) scale(.96)'},{opacity:1,transform:'none'}],{sp:SPs,dl:Math.min(i,9)*35}))};
 const resort=n=>{if(n===s)return;const R0=new Map($$('.y5hc',box).map(b=>[b.dataset.k,b.getBoundingClientRect()]));s=n;y5set('y5-sort',s);
  y5ord(s).forEach(k=>{const b=$(`.y5hc[data-k="${k}"]`,box);box.appendChild(b);const sm=$('small',b);if(sm){sm.textContent=y5stat(k,s);an(sm,[{opacity:0},{opacity:1}],{d:260})}});
  $$('.y5hc',box).forEach(b=>{const a=R0.get(b.dataset.k),z=b.getBoundingClientRect();if(!a)return;const dx=(a.left-z.left)/SCALE,dy=(a.top-z.top)/SCALE;if(dx||dy)an(b,[{transform:`translate(${dx}px,${dy}px)`},{transform:'none'}],{sp:SPs})});
  $$('[data-s]',root).forEach(x=>x.classList.toggle('on',x.dataset.s===s))};
 const resize=n=>{if(n===m)return;m=n;y5set('y5-size',m);paint();$$('[data-z]',root).forEach(x=>x.classList.toggle('on',x.dataset.z===m))};
 paint();$$('[data-s]',root).forEach(x=>x.classList.toggle('on',x.dataset.s===s));$$('[data-z]',root).forEach(x=>x.classList.toggle('on',x.dataset.z===m));
 return {resort,resize,repaint:paint,get s(){return s},get m(){return m}}}
const y5ctl=()=>`<div class="y5ctl"><span class="y5seg">${Object.entries(Y5SORT).map(([k,n])=>`<button data-s="${k}">${n}</button>`).join('')}</span><button class="y5vw" aria-label="Вид">${ic('view5')}</button></div>`;
// шторка «Вид»: размер карточек и сами иконки (герб или арт из игры) — Андрей: «иконки должны меняться где-то в играх»
function y5viewSheet(R,ctx,G,onIc){let s=$('.y5sh',R);if(s)s.remove();s=document.createElement('div');s.className='y5sh';
 const icg=icMode()==='g';
 s.innerHTML=`<i class="sc"></i><div class="pn"><i class="hd"></i><b>Вид героев</b>
  <small>Размер</small><div class="y5opt">${Object.entries(Y5SZ).map(([k,n])=>`<button data-z="${k}" class="${G.m===k?'on':''}"><span class="y5pv z-${k}"><i></i><i></i><i></i><i></i></span>${n}</button>`).join('')}</div>
  <small>Иконки</small><div class="y5opt ic2"><button data-ic="e" class="${icg?'':'on'}"><span class="pi">${`<i class="m8 em">${emb('venator',40)}</i>`}</span>Гербы</button><button data-ic="g" class="${icg?'on':''}"><span class="pi">${mini8('venator')}</span>Арт из игры</button></div>
  <button class="y5ok">Готово</button></div>`;
 R.appendChild(s);an($('.pn',s),[{transform:'translateY(100%)'},{transform:'none'}],{sp:SPs});an($('.sc',s),[{opacity:0},{opacity:1}],{d:220});
 const c=sub(ctx),cl=()=>{c.kill();const z=an($('.pn',s),[{transform:'none'},{transform:'translateY(100%)'}],{d:200,e:EI,f:'forwards'});an($('.sc',s),[{opacity:1},{opacity:0}],{d:200,f:'forwards'});const f=()=>s.remove();if(z)z.onfinish=f;else f()};
 c.on($('.sc',s),'click',cl);c.on($('.y5ok',s),'click',cl);
 c.on($('.pn',s),'click',e=>{const z=e.target.closest('[data-z]');if(z){G.resize(z.dataset.z);$$('[data-z]',s).forEach(x=>x.classList.toggle('on',x===z));return}
  const q=e.target.closest('[data-ic]');if(q){y5set('kd-ic',q.dataset.ic);$$('[data-ic]',s).forEach(x=>x.classList.toggle('on',x===q));G.repaint();onIc&&onIc()}});
 return cl}

/* --- Deadlock изнутри v15. Андрей: «радар даблится 2 раза, в целом UI такой себе». Радар теперь только плиткой.
   «Сейчас» — две строки без коробок; плитки — картинками, а не значками в квадратах; герои — сортировка и вид. --- */
function y5Hub(R,ctx,o){o=o||{};R.className='scr y5 y5hub';
 R.innerHTML=`${SB(0)}<div class="y5sc">
  <div class="y5hh">${cns12()}<i class="sh"></i><button class="y5bk" aria-label="Назад">${ic('back')}</button>
   <div class="tx">${neon11('DEADLOCK','hh')}<span>Голоса героев · по-английски</span></div></div>
  <div class="y5now">
   <button data-go="check"><span class="pr">${hic12('venator','y5s')}${hic12('rat','y5s')}</span><span class="t"><b>Глава ждёт проверки</b><small>«Проповедь свинца» · 3 вопроса</small></span><em>Проверить</em></button>
   <button data-go="vs"><span class="pr">${hic12('rat','y5s')}${hic12('venator','y5s')}</span><span class="t"><b>Боря зовёт в Versus</b><small>ставка 50 · 2 ч назад</small></span><em class="g">Принять</em></button></div>
  <div class="y5tiles">
   <button data-go="comics" class="tl cm"><span class="art"><i style="background-image:url(${VT('venator')})"></i><i style="background-image:url(${VT('rat')})"></i><i class="ht"></i></span><span class="lb"><b>Комиксы</b><small>6 глав</small></span></button>
   <button data-go="vs" class="tl vs"><span class="art"><i style="background-image:url(${VT('venator')})"></i><i style="background-image:url(${VT('rat')})"></i><em>VS</em></span><span class="lb"><b>Versus</b><small>с другом</small></span></button>
   <button data-go="radar" class="tl rd"><span class="art"><canvas class="y5mini"></canvas></span><span class="lb"><b>Радар</b><small>3 перехвата</small></span><i class="bd">3</i></button>
   <button data-go="lines" class="tl ln"><span class="art"><video muted loop playsinline data-hv="hv_rat3" poster="${IMG.hv_rat3}"></video><span class="eq">${eqBars(12)}</span></span><span class="lb"><b>Реплики</b><small>голоса из игры</small></span></button></div>
  <div class="y5sec"><b>Герои</b>${y5ctl()}</div>
  <div class="y5hg"></div></div><i class="hb"></i>`;
 const c=ctx;playV12(R);cnsOn12(c,R);const ne=$('.g11-ne.hh',R);neonOn11(c,ne,260);neonLife11(c,ne);y5sonarMini(c,$('.y5mini',R));
 const G=y5grid(R,c,{size:o.size});
 $$('.y5now>button,.y5tiles>.tl,.y5sec',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:380+i*55}));
 let touched=false;c.on(R,'pointerdown',()=>{touched=true},{capture:true});
 c.on(R,'click',e=>{const t=e.target;if(t.closest('.y5bk')){o.onBack?o.onBack():toast(R,'← назад во вкладку «Игры»');return}
  const s=t.closest('[data-s]');if(s){G.resort(s.dataset.s);return}
  if(t.closest('.y5vw')){y5viewSheet(R,c,G);return}
  const h=t.closest('.y5hc');if(h){an(h,[{transform:'scale(.95)'},{transform:'none'}],{sp:SPb});if(!H12[h.dataset.k].v){toast(R,`${H12[h.dataset.k].ru}: живой портрет ещё делаем`);return}g11Over(R,c,(pv,cc,cl)=>y5Hero(pv,cc,h.dataset.k,{onBack:cl}),null,h);return}
  const g=t.closest('[data-go]');if(!g)return;an(g,[{transform:'scale(.96)'},{transform:'none'}],{sp:SPb});const go=g.dataset.go;
  if(go==='radar')g11Over(R,c,(pv,cc,cl)=>y5RadarA(pv,cc,{onBack:cl}),null,g);
  else if(go==='vs')g11Over(R,c,(pv,cc,cl)=>y5Vs(pv,cc,{onBack:cl}),null,g);
  else if(go==='lines')g11Over(R,c,(pv,cc,cl)=>y5Lines(pv,cc,{onBack:cl}),null,g);
  else if(go==='check')g11Over(R,c,(pv,cc,cl)=>comic12(pv,cc,'who',{start:'check',onBack:cl}),null,g);
  else g11Over(R,c,(pv,cc,cl)=>y5Hero(pv,cc,'venator',{onBack:cl}),null,g)});
 if(o.demo)c.t(()=>{if(touched)return;$('.y5sc',R).scrollTo({top:470,behavior:'smooth'});c.t(()=>{if(!touched)G.resort('ph')},1500);c.t(()=>{if(!touched)G.resort('lv')},3600)},2600);
 return G}

/* --- «Герои» отдельным экраном: сортировка и три размера (Андрей: «по алфавиту, по процентам фраз, до некст лвла;
   размер — чисто иконки без фона, либо поменьше иконки и фон, либо как щас») --- */
function y5Heroes(R,ctx){R.className='scr y5 y5hp';
 R.innerHTML=`${SB(0)}<div class="y5sc"><div class="y5top"><button class="y5bk" aria-label="Назад">${ic('back')}</button><b>Герои</b><span>9</span></div>${y5ctl()}<div class="y5hg"></div></div><i class="hb"></i>`;
 const c=ctx,G=y5grid(R,c,{size:'i',sort:'az'});let touched=false;c.on(R,'pointerdown',()=>{touched=true},{capture:true});
 c.on(R,'click',e=>{const t=e.target;const s=t.closest('[data-s]');if(s){G.resort(s.dataset.s);return}if(t.closest('.y5vw')){y5viewSheet(R,c,G);return}
  if(t.closest('.y5bk')){toast(R,'← назад в Deadlock');return}
  const h=t.closest('.y5hc');if(h){an(h,[{transform:'scale(.95)'},{transform:'none'}],{sp:SPb});if(!H12[h.dataset.k].v){toast(R,`${H12[h.dataset.k].ru}: живой портрет ещё делаем`);return}g11Over(R,c,(pv,cc,cl)=>y5Hero(pv,cc,h.dataset.k,{onBack:cl}),null,h)}});
 // без касаний — показывает все три размера и сортировки по очереди
 const steps=[()=>G.resort('ph'),()=>G.resize('s'),()=>G.resort('lv'),()=>G.resize('c'),()=>{G.resort('az');G.resize('i')}];let i=0;
 const demo=()=>{if(touched)return;steps[i%steps.length]();i++;c.t(demo,2600)};c.t(demo,2200)}

/* --- маленький сонар для плитки «Радар» --- */
function y5sonarMini(ctx,cv){if(!cv)return;const g=cv.getContext('2d'),dpr=Math.min(2,window.devicePixelRatio||1),W=150,H=104;cv.width=W*dpr;cv.height=H*dpr;g.setTransform(dpr,0,0,dpr,0,0);
 const B=[[.34,.6],[.62,.36],[.72,.7]].map(([x,y])=>({x:x*W,y:y*H,v:0}));let a=0;
 ctx.loop((n,dt)=>{a=(a+dt*.0016)%(Math.PI*2);g.clearRect(0,0,W,H);const cx=W/2,cy=H/2+4,r=58;
  g.strokeStyle='rgba(46,230,197,.16)';g.lineWidth=1;[r,r*.66,r*.33].forEach(q=>{g.beginPath();g.arc(cx,cy,q,0,7);g.stroke()});
  const gr=g.createConicGradient?g.createConicGradient(a-.9,cx,cy):null;if(gr){gr.addColorStop(0,'rgba(46,230,197,0)');gr.addColorStop(.14,'rgba(46,230,197,.32)');gr.addColorStop(.145,'rgba(46,230,197,0)');g.fillStyle=gr;g.beginPath();g.arc(cx,cy,r,0,7);g.fill()}
  B.forEach(b=>{const ang=(Math.atan2(b.y-cy,b.x-cx)+Math.PI*2)%(Math.PI*2);const d=((a-ang)+Math.PI*2)%(Math.PI*2);if(d<.12)b.v=1;b.v=Math.max(0,b.v-dt*.0007);
   g.fillStyle=`rgba(120,255,226,${.25+b.v*.75})`;g.beginPath();g.arc(b.x,b.y,2.4+b.v*2,0,7);g.fill();if(b.v>.2){g.strokeStyle=`rgba(120,255,226,${b.v*.5})`;g.beginPath();g.arc(b.x,b.y,4+(1-b.v)*10,0,7);g.stroke()}})})}
