/* ================= v12 (26.10, отзыв на v11) ================= */
// герои v12: у Венатора и Короля — живой портрет (видео), у остальных пока арт с вики
const H12={venator:{n:'Venator',ru:'Венатор',v:'hv_venator2',pos:'60% 30%',ac:'#E23A4E',loc:'Собор',bed:'cathedral',lv:2},
 rat:{n:'Rat King',ru:'Крысиный король',v:'hv_rat3',pos:'50% 38%',ac:'#8FCB4F',loc:'Туннели',bed:'sewer',lv:1},
 talon:{n:'Grey Talon',ru:'Грей Талон',ac:'#2FB6A8',loc:'Старый лес'},rem:{n:'Rem',ru:'Рэм',ac:'#8C6BFF',loc:'Сонная низина'},
 celeste:{n:'Celeste',ru:'Селеста',ac:'#FF5FA2',loc:'Цирк'},doorman:{n:'Doorman',ru:'Дормен',ac:'#E8A93A',loc:'Отель'},
 seven:{n:'Seven',ru:'Севен',ac:'#5EA8FF',loc:'Электростанция'},victor:{n:'Victor',ru:'Виктор',ac:'#9BE15D',loc:'Лаборатория'},
 danny:{n:'Dead Man Danny',ru:'Дэнни',ac:'#FF7A3D',loc:'Кладбище'}};
const HK12=Object.keys(H12);
try{document.documentElement.style.setProperty('--cns',`url(${IMG.dl_cover})`)}catch(e){}
// иконка героя — как у игрока в интерфейсе (гербы или арт); у кого герба нет — арт
const hic12=(k,cl)=>HERO[k]?ic9(k,cl):`<i class="m8${cl?' '+cl:''}" style="background-image:url(${MINI(k)})"></i>`;
function playV12(root){$$('video[data-hv]',root).forEach(v=>{if(v.src)return;v.src=vurl(v.dataset.hv);v.muted=true;v.defaultMuted=true;const p=v.play();if(p&&p.catch)p.catch(()=>{})})}

/* --- звук v12: реплика + фон локации + звук абилки (Web Audio). Андрей: «реплики звучат сыро — добавь сопровождение».
   В макете фон и абилка синтезированы; в приложении — записи из игры (их достаёт Зетка со страниц героев «Sounds» на вики). --- */
const SND12=(()=>{let ac=null,out=null,vb=null,rv=null,bed=null,bedN='';const BUF={};
 function A0(){if(!ac){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;ac=new C();
   out=ac.createDynamicsCompressor();out.threshold.value=-18;out.ratio.value=3;out.connect(ac.destination);
   rv=ac.createConvolver();rv.buffer=imp(2.8,2.4);const rg=ac.createGain();rg.gain.value=.55;rv.connect(rg);rg.connect(out);
   vb=ac.createGain();vb.gain.value=0;vb.connect(out);const vs=ac.createGain();vs.gain.value=.35;vb.connect(vs);vs.connect(rv)}
  if(ac.state==='suspended')ac.resume();return ac}
 function imp(sec,dc){const r=ac.sampleRate,n=Math.round(r*sec),b=ac.createBuffer(2,n,r);for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,dc)}return b}
 function noise(sec,brown){const r=ac.sampleRate,n=Math.round(r*sec),b=ac.createBuffer(1,n,r),d=b.getChannelData(0);let l=0;for(let i=0;i<n;i++){const w=Math.random()*2-1;if(brown){l=(l+.02*w)/1.02;d[i]=l*3.5}else d[i]=w}return b}
 async function buf(k){k=AU11[k]||k;if(BUF[k])return BUF[k];const s=A.A&&A.A[k];if(!s||!A0())return null;let u;if(s.startsWith('a/')){try{u=new Uint8Array(await (await fetch(s)).arrayBuffer())}catch(e){return null}}else{const b=atob(s);u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i)}
  try{BUF[k]=await new Promise((ok,no)=>ac.decodeAudioData(u.buffer,ok,no))}catch(e){return null}return BUF[k]}
 // фоны локаций: собор — орган и колокол в большом эхе; туннели — гул и капли; арена — низкий гул и сердце
 function bedStart(name){if(!A0()||bedN===name)return;bedStop();bedN=name;const g=ac.createGain();g.gain.value=0;g.connect(out);g.gain.linearRampToValueAtTime(.5,ac.currentTime+1.2);const N=[],T=[];
  const send=ac.createGain();send.gain.value=.8;send.connect(rv);
  if(name==='cathedral'){[110,164.8,220,329.6].forEach((f,i)=>{const o=ac.createOscillator();o.type=i%2?'triangle':'sine';o.frequency.value=f*(1+(i-1.5)*.0015);const og=ac.createGain();og.gain.value=[.09,.05,.05,.025][i];
    const lf=ac.createOscillator(),lg=ac.createGain();lf.frequency.value=.13+i*.04;lg.gain.value=og.gain.value*.4;lf.connect(lg);lg.connect(og.gain);o.connect(og);og.connect(g);og.connect(send);o.start();lf.start();N.push(o,lf)});
   const bell=()=>{if(bedN!=='cathedral')return;const t=ac.currentTime;[220,440*1.19,660*1.01].forEach((f,j)=>{const o=ac.createOscillator(),e=ac.createGain();o.frequency.value=f;e.gain.setValueAtTime(.0001,t);e.gain.exponentialRampToValueAtTime([.06,.025,.015][j],t+.02);e.gain.exponentialRampToValueAtTime(.0001,t+3.5);o.connect(e);e.connect(send);o.start(t);o.stop(t+3.6)});T.push(setTimeout(bell,5200+Math.random()*2600))};T.push(setTimeout(bell,1800))}
  else if(name==='sewer'){const s=ac.createBufferSource();s.buffer=noise(4,1);s.loop=true;const f=ac.createBiquadFilter();f.type='lowpass';f.frequency.value=260;const sg=ac.createGain();sg.gain.value=.55;s.connect(f);f.connect(sg);sg.connect(g);s.start();N.push(s);
   const drip=()=>{if(bedN!=='sewer')return;const t=ac.currentTime,o=ac.createOscillator(),e=ac.createGain(),p=ac.createStereoPanner?ac.createStereoPanner():null;o.type='sine';const f0=900+Math.random()*700;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f0*.45,t+.07);
    e.gain.setValueAtTime(.0001,t);e.gain.exponentialRampToValueAtTime(.12,t+.005);e.gain.exponentialRampToValueAtTime(.0001,t+.12);o.connect(e);if(p){p.pan.value=Math.random()*1.6-.8;e.connect(p);p.connect(send);p.connect(g)}else{e.connect(send);e.connect(g)}o.start(t);o.stop(t+.14);T.push(setTimeout(drip,500+Math.random()*1400))};T.push(setTimeout(drip,600))}
  else{const o=ac.createOscillator();o.type='sawtooth';o.frequency.value=55;const f=ac.createBiquadFilter();f.type='lowpass';f.frequency.value=180;const og=ac.createGain();og.gain.value=.08;o.connect(f);f.connect(og);og.connect(g);o.start();N.push(o);
   const s=ac.createBufferSource();s.buffer=noise(4,0);s.loop=true;const bp=ac.createBiquadFilter();bp.type='bandpass';bp.frequency.value=900;bp.Q.value=.6;const sg=ac.createGain();sg.gain.value=.04;s.connect(bp);bp.connect(sg);sg.connect(g);s.start();N.push(s)}
  bed={g,N,T}}
 function bedStop(){if(!bed)return;const b=bed;bed=null;bedN='';try{b.g.gain.cancelScheduledValues(ac.currentTime);b.g.gain.setValueAtTime(b.g.gain.value,ac.currentTime);b.g.gain.linearRampToValueAtTime(0,ac.currentTime+.5)}catch(e){}b.T.forEach(clearTimeout);setTimeout(()=>{b.N.forEach(n=>{try{n.stop()}catch(e){}});try{b.g.disconnect()}catch(e){}},700)}
 function duck(on){if(bed){const t=ac.currentTime;bed.g.gain.cancelScheduledValues(t);bed.g.gain.setValueAtTime(bed.g.gain.value,t);bed.g.gain.linearRampToValueAtTime(on?.18:.5,t+(on?.12:.6))}}
 // звук абилки (пример): вжух шумом вверх + низкий удар
 function abil(kind){if(!A0())return;const t=ac.currentTime;const s=ac.createBufferSource();s.buffer=noise(.6,0);const bp=ac.createBiquadFilter();bp.type='bandpass';bp.Q.value=1.4;bp.frequency.setValueAtTime(kind==='rat'?300:500,t);bp.frequency.exponentialRampToValueAtTime(kind==='rat'?1600:3600,t+.38);
  const e=ac.createGain();e.gain.setValueAtTime(.0001,t);e.gain.exponentialRampToValueAtTime(.5,t+.05);e.gain.exponentialRampToValueAtTime(.0001,t+.5);s.connect(bp);bp.connect(e);e.connect(out);e.connect(rv);s.start(t);s.stop(t+.6);
  const o=ac.createOscillator(),oe=ac.createGain();o.frequency.setValueAtTime(kind==='rat'?90:70,t+.32);o.frequency.exponentialRampToValueAtTime(34,t+.8);oe.gain.setValueAtTime(.0001,t+.3);oe.gain.exponentialRampToValueAtTime(.8,t+.34);oe.gain.exponentialRampToValueAtTime(.0001,t+.95);o.connect(oe);oe.connect(out);o.start(t+.3);o.stop(t+1)}
 // реплика: dry — как сейчас (без эха и фона); иначе — с эхом локации поверх фона
 async function line(k,o){o=o||{};if(!A0())return 0;const b=await buf(k);if(!b)return 0;if(o.abil){abil(o.abil);await new Promise(r=>setTimeout(r,380))}
  const s=ac.createBufferSource();s.buffer=b;const g=ac.createGain();g.gain.value=1;s.connect(g);
  if(o.dry){g.connect(ac.destination)}else{g.connect(vb);vb.gain.value=1;duck(true)}
  s.start();s.onended=()=>{if(!o.dry)duck(false);o.end&&o.end()};line.cur=s;return b.duration}
 function stop(){try{line.cur&&line.cur.stop()}catch(e){}bedStop()}
 return {A0,line,bed:bedStart,bedStop,abil,stop,on:()=>!!ac&&ac.state==='running'}})();
// реплика в макете v12: играет с фоном локации (если фон включён), без касания — молча
function say12(ctx,k,o){o=o||{};if(o.loud===false){return voice11(ctx,k,{mute:true,end:o.end})}
 try{hush();if(AUcur){AUcur.pause();AUcur=null}}catch(e){}const d=(DUR11[AU11[k]||k]||2.4)*1000;let done=false;const fin=()=>{if(done)return;done=true;o.end&&o.end()};
 if(!o.dry&&o.bed)SND12.bed(o.bed);SND12.line(k,{dry:o.dry,abil:o.abil,end:fin});ctx.add(()=>SND12.stop());ctx.t(fin,d+(o.abil?500:150));return d}
const BED12={venator:'cathedral',rat:'sewer'};

/* --- «City Never Sleeps» живой: окна мигают, луч прожектора, блик по буквам, неон дышит, дождь --- */
// окна — только там, где на арте тёмные дома (координаты в % квадрата 640×640)
const CNSW=[[33,0,16,9],[38,8,9,10],[80,0,18,14],[2,16,10,22],[56,40,40,20],[0,46,14,15]];
function cns12(){let s=11;const r=()=>(s=(s*16807)%2147483647)/2147483647;let w='';
 CNSW.forEach(([x,y,ww,hh])=>{for(let i=0;i<Math.round(ww*hh/14);i++)w+=`<i style="left:${(x+r()*ww).toFixed(1)}%;top:${(y+r()*hh).toFixed(1)}%;animation-delay:${(-r()*9).toFixed(1)}s;animation-duration:${(3.5+r()*6).toFixed(1)}s"></i>`});
 return `<span class="c12-art"><i class="img"></i><i class="c12-gw img"></i><span class="c12-win">${w}</span><i class="c12-bm a"></i><i class="c12-bm b"></i><i class="c12-sh"></i><canvas class="c12-rain"></canvas></span>`}
function cnsOn12(ctx,root,alive){const art=$('.c12-art',root);if(!art)return;ctx.t(()=>rain11(ctx,$('.c12-rain',art),{n:46,alive}),500);
 an($('.img',art),[{transform:'scale(1.16)'},{transform:'scale(1.04)'}],{d:1600,e:EO,f:'forwards'})}

/* --- карточка героя: фон берётся с самой анимированной карточки (Зетка вырезает его из ролика), герой — в рамке поверх --- */
function hcard12(k,o){o=o||{};const h=H12[k],v=h.v,mode=o.mode||'card';
 const fg=v?`<video class="fg" muted loop playsinline data-hv="${v}" poster="${IMG[v]}" style="object-position:${h.pos}"></video>`:`<i class="fg img" style="background-image:url(${VT(k)})"></i>`;
 const bg=mode==='frame'?`<span class="loc">${HERO[k]?heroBg11(k):`<i class="img" style="background-image:url(${VT(k)})"></i>`}</span>`
  :(v?`<video class="bg" muted loop playsinline data-hv="${v}" poster="${IMG[v]}"></video>`:`<i class="bg img" style="background-image:url(${VT(k)})"></i>`);
 return `<button class="h12c ${mode}${v?' live':' st'}" data-k="${k}" style="--ac:${h.ac}"><span class="bgw">${bg}<i class="vg"></i></span><span class="fr">${fg}<i class="gl"></i></span>
  <span class="nm"><b>${h.n}</b><small>${o.sub||(v?'ур. '+h.lv+' · '+h.loc:'портрет делаем')}</small></span>${o.badge||''}</button>`}
function hcTilt12(ctx,root){$$('.h12c',root).forEach(b=>{ctx.on(b,'pointermove',e=>{const r=b.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;b.style.transform=`perspective(600px) rotateY(${(x*12).toFixed(1)}deg) rotateX(${(-y*9).toFixed(1)}deg)`;const g=$('.gl',b);if(g)g.style.transform=`translateX(${(x*160).toFixed(0)}%)`});ctx.on(b,'pointerleave',()=>{b.style.transform='';const g=$('.gl',b);if(g)g.style.transform=''})})}
// крупно: карточка героя на весь экран — фон с карточки, герой в рамке, что у него внутри
function hDetail12(R,ctx,k,from,mode){const h=H12[k];if(!h.v){toast(R,`${h.ru}: портрет ещё делаем`);return}let ov=$('.h12d',R);if(ov)ov.remove();ov=document.createElement('div');ov.className='h12d '+(mode||'card');
 const c=sub(ctx);const CH=(G11CH[k]||[]).slice(0,3);
 ov.innerHTML=`<span class="bgw">${mode==='frame'?`<span class="loc">${heroBg11(k)}</span>`:`<video class="bg" muted loop playsinline data-hv="${h.v}" poster="${IMG[h.v]}"></video>`}<i class="vg"></i></span>
  <button class="h12-bk">${ic('back')}</button>
  <span class="fr"><video class="fg" muted loop playsinline data-hv="${h.v}" poster="${IMG[h.v]}" style="object-position:${h.pos}"></video><i class="gl"></i></span>
  <div class="tx"><small>${HERO[k].role||''}</small><b>${h.n}</b><span class="hlv"><i style="--p:${k==='venator'?.68:.6}"></i><em>ур. ${h.lv}</em></span></div>
  <div class="ac"><button class="pri">${ic('sword')}Versus за ${h.ru.split(' ')[0]==='Крысиный'?'Короля':h.ru}</button><button>${ic('book11')}Комиксы · ${(G11CH[k]||[]).length}</button><button>${ic('snd')}Реплики</button></div>
  <div class="cl">${CH.map(x=>`<span class="${x.st}"><b>${x.t}</b><small>${x.st==='done'?'закреплено':x.st==='chk'?'ждёт проверки':x.st==='new'?'новая':'замок'}</small></span>`).join('')}</div>`;
 R.appendChild(ov);playV12(ov);
 const q=from?rel(from,R):null;if(q)an(ov,[{clipPath:`inset(${q.y}px ${344-q.x-q.w}px ${754-q.y-q.h}px ${q.x}px round 20px)`},{clipPath:'inset(0 0 0 0 round 0)'}],{d:520,e:EO});else an(ov,[{opacity:0},{opacity:1}],{d:300});
 an($('.fr',ov),[{transform:'translateY(30px) scale(.86)',opacity:0},{transform:'none',opacity:1}],{sp:SPs,dl:160});
 $$('.tx>*,.ac>button,.cl>span',ov).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:300+i*50}));
 c.on($('.h12-bk',ov),'click',()=>{c.kill();const z=an(ov,[{opacity:1},{opacity:0,transform:'scale(.96)'}],{d:220,e:EI,f:'forwards'});const f=()=>ov.remove();if(z)z.onfinish=f;else f()});
 c.on($('.ac',ov),'click',e=>{const b=e.target.closest('button');if(!b)return;an(b,[{transform:'scale(.94)'},{transform:'none'}],{sp:SPb});toast(R,b.textContent.trim())})}

/* --- вкладка «Игры» v12: Deadlock отдельно, игры по кино — отдельно; всё дедлоковское — внутри Deadlock --- */
function g12Tab(R,ctx,o){o=o||{};const city=o.card==='city',seg=o.place==='seg',inScenes=o.place==='scenes';R.className='scr v8 g11 g12'+(seg?' g12-seg':'');
 const W=316,SH=236;
 const cityArt=`<span class="g11-crt"><i class="g11-glow"></i><span class="g11-sky">
   ${sky11(W,SH,{seed:3,w:[16,30],h:[SH*.42,SH*.82],fill:'#161d3a',cls:'l1',mid:.6})}<i class="g11-bm a"></i><i class="g11-bm b"></i>
   ${sky11(W,SH,{seed:11,w:[14,26],h:[SH*.26,SH*.6],fill:'#0e1430',win:.15,cls:'l2',wo:.8})}
   <span class="g11-brg"><i class="g11-trn"><svg viewBox="0 0 230 14"><rect x="0" y="2" width="222" height="9" rx="2.5" fill="#05070f"/>${Array.from({length:19},(_,i)=>`<rect x="${6+i*11.4}" y="4.4" width="6.2" height="3.6" rx=".8" fill="#FFD58A" opacity="${i%6?'.95':'.25'}"/>`).join('')}<path d="M222 2 l7 4.5 -7 4.5z" fill="#05070f"/></svg></i></span>
   ${sky11(W,SH,{seed:29,w:[18,34],h:[SH*.12,SH*.34],fill:'#05070f',win:.05,cls:'l3',wo:.55})}</span><canvas class="g11-rain"></canvas><i class="g11-fl"></i>
   <span class="g11-tx"><small>ИГРА · ДИАЛОГИ ГЕРОЕВ</small>${neon11('DEADLOCK')}<span class="g11-ln">реплики героев с голосом · Versus · комиксы</span></span><i class="g11-gl"></i></span>`;
 const card=city?`<button class="g11-card g12-card city" aria-label="Открыть Deadlock">${cityArt}<span class="g12-ft"><span class="g12-go">Войти ${ic('chev')}</span></span><i class="g12-bd">2</i></button>`
  :`<button class="g12-card cns" aria-label="Открыть Deadlock">${cns12()}<i class="c12-fd"></i><span class="g12-ct"><small>ИГРА · ДИАЛОГИ ГЕРОЕВ</small><b>Deadlock</b><span>реплики героев с голосом · Versus · комиксы</span></span><span class="g12-ft"><span class="g12-go">Войти ${ic('chev')}</span></span><i class="g12-bd">2</i></button>`;
 const duel=`<button class="g12-duel"><span class="ps"><i class="img" style="background-image:url(${IMG.p_wolf})"></i><i class="img" style="background-image:url(${IMG.p_titanic})"></i><i class="img" style="background-image:url(${IMG.p_psycho})"></i></span>
   <span class="tx"><small>${ic('users11')}ИГРА ПО КИНО · С ДРУГОМ</small><b>Дуэль по сцене</b><em>Выбери сцену — кто быстрее поймёт, тот и забрал банк</em></span><span class="cta">Позвать ${ic('chev')}</span></button>`;
 const soon=`<div class="g12-soon"><i>${ic('star')}</i><span><b>Скоро ещё игры по кино</b><small>тоже учат — но на спор</small></span></div>`;
 const games=`<div class="g11-sec g12-sec"><b>Игры</b><small>играешь — и понимаешь английский</small></div>${card}`;
 const learn=`<div class="g11-sec g12-sec"><b>Игры по кино</b><small>для учёбы — на спор с другом</small></div>${duel}${soon}`;
 const body=seg?`<div class="g12-sg"><button class="on" data-s="g">Игры</button><button data-s="l">Учёба на спор</button><i></i></div><div class="g12-pane" data-p="g">${card}<p class="g12-nt">В Deadlock внутри: Радар, Versus, комиксы героев, реплики.</p></div><div class="g12-pane" data-p="l" hidden>${duel}${soon}</div>`
  :games+(inScenes?`<div class="g12-moved">${ic('film11')}<span><b>Дуэль по сцене — теперь в «Сценах»</b><small>у каждой сцены кнопка «С другом»</small></span><button data-tb="film">Показать</button></div>`:learn);
 R.innerHTML=`${SB(0)}<div class="g11-pg g12-pg"><div class="g11-hd"><b>Игры</b><small>учишь язык, пока играешь</small></div>${body}</div>
  ${TB5('v3-tb w4b-tb m6-tb m7-tb v8-tb g11-tb',2)}<canvas class="fx"></canvas><i class="hb"></i>`;
 const fx=FX(ctx,$('.fx',R)),cd=$('.g12-card',R);let hub=false,touched=false;const vis=()=>!hub;
 ctx.on(R,'pointerdown',()=>{touched=true},{capture:true});
 if(city){const crt=$('.g11-crt',R);an(crt,[{transform:'scaleY(.012)',opacity:.4},{transform:'scaleY(1)',opacity:1}],{d:480,e:'cubic-bezier(.2,.9,.25,1)',dl:200});$$('.g11-sk',R).forEach((s,i)=>an(s,[{transform:`translateY(${26+i*14}px)`},{transform:'none'}],{sp:SPs,dl:420+i*90}));
  neonOn11(ctx,$('.g11-ne',R),640);neonLife11(ctx,$('.g11-ne',R),vis);ctx.t(()=>rain11(ctx,$('.g11-rain',R),{n:60,splash:true,alive:vis}),600);bolt11(ctx,$('.g11-fl',R),$('.g11-sk.l1',R),vis);
  const L1=$('.g11-sk.l1',R),L2=$('.g11-sk.l2',R),L3=$('.g11-sk.l3',R);ctx.on(cd,'pointermove',e=>{const b=cd.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;cd.style.transform=`perspective(800px) rotateY(${(x*9).toFixed(1)}deg) rotateX(${(-y*7).toFixed(1)}deg)`;L1.style.transform=`translateX(${(-x*5).toFixed(1)}px)`;L2.style.transform=`translateX(${(-x*11).toFixed(1)}px)`;L3.style.transform=`translateX(${(-x*18).toFixed(1)}px)`});
  ctx.on(cd,'pointerleave',()=>{cd.style.transform='';[L1,L2,L3].forEach(l=>l.style.transform='')})}
 else{an(cd,[{opacity:0,transform:'translateY(24px) scale(.96)'},{opacity:1,transform:'none'}],{sp:SPs,dl:120});cnsOn12(ctx,cd,vis);
  an($('.g12-ct b',R),[{opacity:0,letterSpacing:'.4em'},{opacity:1,letterSpacing:'-.01em'}],{d:900,e:EO,dl:500});
  ctx.on(cd,'pointermove',e=>{const b=cd.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;cd.style.transform=`perspective(800px) rotateY(${(x*8).toFixed(1)}deg) rotateX(${(-y*6).toFixed(1)}deg)`;$('.c12-art .img',cd).style.translate=`${(-x*10).toFixed(1)}px ${(-y*8).toFixed(1)}px`});
  ctx.on(cd,'pointerleave',()=>{cd.style.transform='';$('.c12-art .img',cd).style.translate=''})}
 an($('.g12-bd',R),[{opacity:0,transform:'scale(.2)'},{opacity:1,transform:'none'}],{sp:SPb,dl:1300});
 $$('.g12-sec,.g12-duel,.g12-soon,.g12-moved,.g12-sg,.g12-nt',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:520+i*80}));
 const openHub=()=>{if(hub)return;hub=true;an(cd,[{transform:'scale(.97)'},{transform:'scale(1.015)'},{transform:'none'}],{d:300,e:EO});const r=rel(cd,R);fx.burst(r.x+r.w/2,r.y+r.h/2,{n:30,c:['#F6D488','#fff','#FF8A4C'],v:5,g:0,s:2.2,l:40});
  ctx.t(()=>g12Hub(R,ctx,cd,{onClose(){hub=false}}),140)};
 ctx.on(cd,'click',openHub);
 ctx.on(R,'click',e=>{const d=e.target.closest('.g12-duel');if(d){an(d,[{transform:'scale(.97)'},{transform:'none'}],{sp:SPb});g12DuelSheet(R,ctx);return}
  const s=e.target.closest('.g12-sg button');if(s){$$('.g12-sg button',R).forEach(b=>b.classList.toggle('on',b===s));$('.g12-sg',R).classList.toggle('r',s.dataset.s==='l');$$('.g12-pane',R).forEach(p=>{const on=p.dataset.p===s.dataset.s;p.hidden=!on;if(on)$$('.g12-card,.g12-duel,.g12-soon,.g12-nt',p).forEach((x,i)=>an(x,[{opacity:0,transform:`translateX(${s.dataset.s==='l'?30:-30}px)`},{opacity:1,transform:'none'}],{sp:SPs,dl:i*60}))});return}
  const t=e.target.closest('[data-tb]');if(t){const k=t.dataset.tb;if(k==='film'){g12Scenes(R,ctx);return}if(k==='game'&&R.classList.contains('g12-sc')){g12Tab(R,ctx,o);return}if(k!=='game')toast(R,'В макете — только «Игры» и «Сцены»')}});
 if(o.auto!==false)ctx.t(()=>{if(!touched)openHub()},o.autoMs||4600)}

// «Сцены» с дуэлью: полоса «С другом» сверху, у каждой сцены — значок дуэли
function g12Scenes(R,ctx){R.className='scr v8 g11 g12 g12-sc';const P=[['p_wolf','Волк с Уолл-стрит','6 эпизодов'],['p_titanic','Титаник','4 эпизода'],['p_psycho','Американский психопат','3 эпизода'],['p_taxi','Таксист','2 эпизода'],['p_sopranos','Клан Сопрано','4 эпизода'],['p_bb','Во все тяжкие','3 эпизода']];
 R.innerHTML=`${SB(0)}<div class="g11-pg g12-pg"><div class="g11-hd"><b>Сцены</b><small>смотри и понимай</small></div>
  <button class="g12-band">${ic('users11')}<span><b>С другом — дуэль по любой сцене</b><small>нажми ⚔ на постере · кто быстрее поймёт</small></span>${ic('chev')}</button>
  <div class="g12-pg3">${P.map(([im,n,e])=>`<button class="g12-po"><i class="img" style="background-image:url(${IMG[im]})"></i><span class="du">${ic('sword')}</span><b>${n}</b><small>${e}</small></button>`).join('')}</div></div>
  ${TB5('v3-tb w4b-tb m6-tb m7-tb v8-tb g11-tb',1)}<canvas class="fx"></canvas><i class="hb"></i>`;
 $$('.g12-band,.g12-po',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(18px) scale(.96)'},{opacity:1,transform:'none'}],{sp:SPs,dl:80+i*50}));
 $$('.g12-po .du',R).forEach((x,i)=>an(x,[{opacity:0,transform:'scale(.3) rotate(-30deg)'},{opacity:1,transform:'none'}],{sp:SPb,dl:600+i*60}));
 ctx.on($('.g12-pg',R),'click',e=>{const p=e.target.closest('.g12-po,.g12-band');if(!p)return;an(p,[{transform:'scale(.95)'},{transform:'none'}],{sp:SPb});g12DuelSheet(R,ctx,$('b',p).textContent)})}
// шторка дуэли по сцене
function g12DuelSheet(R,ctx,film){let s=$('.g12-dsh',R);if(s)s.remove();s=document.createElement('div');s.className='g12-dsh';
 s.innerHTML=`<i class="sc"></i><div class="pn"><i class="hd"></i><small>ДУЭЛЬ ПО СЦЕНЕ</small><b>${film&&!/С другом/.test(film)?film:'Выбери сцену'}</b><p>3 вопроса по одной сцене. Кто ответит быстрее и точнее — забирает банк.</p>
  <div class="st"><button>0</button><button class="on">25</button><button>50</button><button>100</button></div><button class="go">Позвать друга ${ic('chev')}</button></div>`;
 R.appendChild(s);an($('.pn',s),[{transform:'translateY(100%)'},{transform:'none'}],{sp:SPs});an($('.sc',s),[{opacity:0},{opacity:1}],{d:240});
 const c=sub(ctx),cl=()=>{c.kill();const z=an($('.pn',s),[{transform:'none'},{transform:'translateY(100%)'}],{d:220,e:EI,f:'forwards'});an($('.sc',s),[{opacity:1},{opacity:0}],{d:220,f:'forwards'});const f=()=>s.remove();if(z)z.onfinish=f;else f()};
 c.on($('.sc',s),'click',cl);c.on($('.go',s),'click',()=>{toast(R,'Ссылка ушла другу в Telegram');cl()});
 $$('.st button',s).forEach(b=>c.on(b,'click',()=>{$$('.st button',s).forEach(x=>x.classList.toggle('on',x===b));an(b,[{transform:'scale(.9)'},{transform:'none'}],{sp:SPb})}))}

/* --- Deadlock изнутри: всё, что про игру, — тут («Сейчас», Радар, Versus, реплики, герои на карточках) --- */
function g12Hub(R,ctx,from,o){o=o||{};let ov=$('.g11-hub',R);if(ov)ov.remove();ov=document.createElement('div');ov.className='g11-hub g12-hub';
 const LIVE=['venator','rat'],SOON=['talon','rem','celeste','doorman','seven','victor','danny'];
 ov.innerHTML=`<div class="g11-hh g12-hh">${cns12()}<i class="sh"></i><button class="g11-bk" aria-label="Назад">${ic('back')}</button>
   <div class="tx"><small>ИГРА · ДИАЛОГИ ГЕРОЕВ</small>${neon11('DEADLOCK','hh')}<span>9 героев · 6 комиксов · голоса из игры</span></div></div>
  <div class="g11-sec"><b>Сейчас</b><small>новое — раз в 8 часов</small></div>
  <div class="g11-feed">
   <button class="g11-fi" data-go="radar"><span class="ic">${rdr11(0)}</span><span class="tx"><b>2 перехвата ждут</b><small>Туннели · Король и Венатор · ×2 опыта</small></span><em class="tm">5:12:40</em></button>
   <button class="g11-fi" data-go="check"><span class="ic bk">${ic('book11')}</span><span class="tx"><b>Глава ждёт проверки</b><small>«Охота объявлена» · 3 вопроса · ≈ 30 с</small></span>${ic('chev')}</button>
   <button class="g11-fi" data-go="vs"><span class="ic mm">${hic12('rat')}${hic12('venator')}</span><span class="tx"><b>Боря зовёт в Versus</b><small>ставка 50 · 2 ч назад</small></span><em class="ok">Принять</em></button></div>
  <button class="g11-vsb g12-vsb"><span class="hv l"><video muted loop playsinline data-hv="hv_venator2" poster="${IMG.hv_venator2}"></video></span><span class="hv r"><video muted loop playsinline data-hv="hv_rat3" poster="${IMG.hv_rat3}"></video></span><i class="vsl"></i><b class="vs">VS</b>
   <span class="tx"><small>${ic('sword')}VERSUS С ДРУГОМ</small><b>Кто лучше поймёт героев?</b><em>3 раунда · урон — твои очки</em></span><span class="cta">Позвать ${ic('chev')}</span></button>
  <div class="g12-two"><button class="g12-rd" data-go="radar"><span class="cb">${radarMini12()}</span><b>Радар · 3D</b><small>кто где спорит сейчас</small></button>
   <button class="g12-ln" data-go="lines"><span class="cb"><i class="img" style="background-image:url(${VT('doorman')})"></i><em>«Your heart…»</em></span><b>Реплики</b><small>как в TikTok · с голосом</small></button></div>
  <div class="g11-sec"><b>Герои</b><small>нажми — его комиксы и реплики</small></div>
  <div class="g12-hs">${LIVE.map(k=>hcard12(k,{badge:k==='venator'?'<em class="g12-nw">1 новая</em>':''})).join('')}${SOON.map(k=>hcard12(k)).join('')}</div>`;
 R.appendChild(ov);playV12(ov);const c=sub(ctx);
 if(from){const q=rel(from,R);an(ov,[{clipPath:`inset(${q.y}px ${344-q.x-q.w}px ${754-q.y-q.h}px ${q.x}px round 24px)`},{clipPath:'inset(0 0 0 0 round 0)'}],{d:560,e:EO})}else an(ov,[{opacity:0},{opacity:1}],{d:300});
 neonOn11(c,$('.g11-ne.hh',ov),260);neonLife11(c,$('.g11-ne.hh',ov));cnsOn12(c,ov);
 $$('.g11-sec,.g11-fi,.g12-vsb,.g12-two>button,.h12c',ov).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(22px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:420+i*60}));
 an($('.g12-vsb .l',ov),[{transform:'translateX(-50%)',opacity:0},{transform:'none',opacity:1}],{sp:SPs,dl:700});an($('.g12-vsb .r',ov),[{transform:'translateX(50%)',opacity:0},{transform:'none',opacity:1}],{sp:SPs,dl:700});
 hcTilt12(c,ov);radarSpin12(c,ov);
 let touched=false;c.on(ov,'pointerdown',()=>{touched=true},{capture:true});
 const close=()=>{c.kill();const z=an(ov,[{opacity:1,transform:'none'},{opacity:0,transform:'translateX(40px)'}],{d:240,e:EI,f:'forwards'});const f=()=>{ov.remove();o.onClose&&o.onClose()};if(z)z.onfinish=f;else f()};
 c.on(ov,'click',e=>{const t=e.target;
  if(t.closest('.g11-bk')){if(o.onClose||from)close();else toast(R,'← назад к вкладке «Игры»');return}
  const h=t.closest('.h12c');if(h){touched=true;an(h,[{transform:'scale(.95)'},{transform:'none'}],{sp:SPb});hDetail12(R,c,h.dataset.k,h);return}
  const g=t.closest('[data-go]')||(t.closest('.g12-vsb')?{dataset:{go:'vs'}}:null);if(!g)return;touched=true;const el=t.closest('button');if(el)an(el,[{transform:'scale(.96)'},{transform:'none'}],{sp:SPb});
  const go=g.dataset.go;
  if(go==='radar')g11Over(R,c,(pv,cc,cl)=>radar12(pv,cc,{onBack:cl}),null,el);
  else if(go==='check')g11Over(R,c,(pv,cc,cl)=>comic12(pv,cc,'who',{start:'check',onBack:cl}),null,el);
  else if(go==='vs')g11Over(R,c,(pv,cc,cl)=>vs12(pv,cc,{demo:false,onBack:cl}),null,el);
  else if(go==='lines')g11Over(R,c,(pv,cc,cl)=>lines12(pv,cc,'ult',{onBack:cl}),null,el)});
 if(o.demo)c.t(()=>{if(!touched){ov.scrollTo({top:520,behavior:'smooth'});c.t(()=>{if(touched)return;const h=$('.h12c[data-k="venator"]',ov);if(h)hDetail12(R,c,'venator',h)},1600)}},2600);
 return ov}

/* --- герои на карточках: фон взят с анимированной карточки (вариант Зетки) или рамка на фоне локации (как в TikTok) --- */
function g12Cards(R,ctx,mode){R.className='scr v8 g11 g12 g12-cards '+mode;
 R.innerHTML=`${SB(0)}<div class="g11-pg g12-pg"><div class="g11-hd"><b>Герои</b><small>${mode==='frame'?'рамка на фоне его локации':'фон — с его же карточки'}</small></div>
  <div class="g12-hs big">${HK12.map(k=>hcard12(k,{mode})).join('')}</div>
  <p class="g12-nt">${mode==='frame'?'Фон — живая локация героя (тот, что из v11), сам герой — в тонкой рамке, как в роликах «Desperation Ultimate Lines».':'Фон не рисуем отдельно: Зетка вырезает его из того же ролика-карточки (без героя) — цвет и свет всегда совпадают.'}</p></div>
  <canvas class="fx"></canvas><i class="hb"></i>`;
 playV12(R);hcTilt12(ctx,R);let touched=false;ctx.on(R,'pointerdown',()=>{touched=true},{capture:true});
 $$('.h12c',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(26px) scale(.94)'},{opacity:1,transform:'none'}],{sp:SPs,dl:80+i*60}));
 ctx.on(R,'click',e=>{const h=e.target.closest('.h12c');if(h&&!e.target.closest('.h12d')){touched=true;an(h,[{transform:'scale(.95)'},{transform:'none'}],{sp:SPb});hDetail12(R,ctx,h.dataset.k,h,mode)}});
 ctx.t(()=>{if(!touched){const h=$('.h12c[data-k="venator"]',R);hDetail12(R,ctx,'venator',h,mode)}},3400)}
