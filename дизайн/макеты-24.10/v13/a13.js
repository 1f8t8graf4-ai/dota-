/* ================= v13 (26.10, отзыв на v12) ================= */
Object.assign(ICO,{wave13:'<path d="M3 12h2M7 8v8M11 5v14M15 9v6M19 7v10M21 12h0"/>',cards13:'<rect x="3.5" y="6" width="11" height="14" rx="2"/><path d="M8 3.5h9.5a2 2 0 0 1 2 2V17"/>',
 swords13:'<path d="M4 4l9.5 9.5M4 4v4l8 8M4 4h4l8 8"/><path d="M20 4l-9.5 9.5M20 4v4l-3 3M20 4h-4l-3 3"/><path d="M13 16l-2 2 2 2M11 16l2 2-2 2"/>',
 comic13:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 11h9M12 4v16M12 13h9"/>',trophy13:'<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M9 20h6"/>',
 cal13:'<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 10h16M9 3v4M15 3v4"/>',ear13:'<path d="M7 10a5 5 0 0 1 10 0c0 3-3 4-3 7a3 3 0 0 1-6 0"/><path d="M10 10a2 2 0 0 1 4 0"/>'});

/* --- звук v13 (свой движок, общий для всех экранов v13).
   Андрей на v12: «половина реплик не работает в Versus», «шум на фоне постоянный».
   Причина: на iPhone звук страницы открывается только касанием, а реплики v12 звучали по таймеру — до касания движок ещё не был открыт.
   Теперь движок открывается на первом же касании любого места, а все реплики экрана загружаются заранее. В Versus фона нет: только голос и лёгкое эхо. --- */
const S13=(()=>{let ac=null,out=null,rv=null,cur=null,bed=null,bedN='',bedV=.5,duckOn=false,ok=false;const BUF={},PR={};
 function A0(){if(ac)return ac;const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;ac=new C();
  out=ac.createDynamicsCompressor();out.threshold.value=-16;out.knee.value=8;out.ratio.value=2.4;out.connect(ac.destination);
  rv=ac.createConvolver();rv.buffer=ir(1.5,3.2);rv.connect(out);return ac}
 function ir(sec,dc){const r=ac.sampleRate,n=Math.round(r*sec),b=ac.createBuffer(2,n,r);for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,dc)*(i<r*.012?i/(r*.012):1)}return b}
 function unlock(){if(!A0())return;if(ac.state!=='running'){try{ac.resume()}catch(e){}}try{const b=ac.createBuffer(1,1,22050),s=ac.createBufferSource();s.buffer=b;s.connect(ac.destination);s.start(0)}catch(e){}ok=true}
 ['pointerdown','touchend','keydown'].forEach(ev=>document.addEventListener(ev,unlock,{capture:true,passive:true}));
 const live=()=>!!ac&&ac.state==='running';
 function key(k){return AU11[k]||k}
 function load(k){k=key(k);if(BUF[k])return Promise.resolve(BUF[k]);if(PR[k])return PR[k];const s=A.A&&A.A[k];if(!s||!A0())return Promise.resolve(null);
  PR[k]=(async()=>{try{let u;if(String(s).startsWith('a/'))u=new Uint8Array(await (await fetch(s)).arrayBuffer());else{const b=atob(s);u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i)}
   BUF[k]=await new Promise((y,n)=>ac.decodeAudioData(u.buffer,y,n));return BUF[k]}catch(e){console.warn('звук не загрузился:',k);PR[k]=null;return null}})();return PR[k]}
 const preload=L=>Promise.all(L.map(load));
 function duck(on){duckOn=on;if(!bed)return;const t=ac.currentTime;bed.g.gain.cancelScheduledValues(t);bed.g.gain.setValueAtTime(bed.g.gain.value,t);bed.g.gain.linearRampToValueAtTime(on?bedV*.35:bedV,t+(on?.12:.7))}
 function stopLine(){if(cur){try{cur.onended=null;cur.stop()}catch(e){}cur=null;duck(false)}}
 // реплика: echo 0…1 — сколько эха места (0 — сухо, как с вики)
 let tok=0,t0=0;
 async function line(k,o){o=o||{};const my=++tok;stopLine();const b=await load(k);if(my!==tok||!b||!live())return 0;stopLine();const s=ac.createBufferSource();s.buffer=b;const g=ac.createGain();g.gain.value=o.gain||1;s.connect(g);g.connect(out);
  if(o.echo){const e=ac.createGain();e.gain.value=o.echo;g.connect(e);e.connect(rv)}duck(true);s.onended=()=>{if(cur===s){cur=null;duck(false)}o.end&&o.end()};s.start();t0=ac.currentTime;cur=s;o.start&&o.start();return b.duration}
 const pos=()=>cur&&ac?ac.currentTime-t0:-1;
 function cancel(){tok++;stopLine()}
 function noise(sec,brown){const r=ac.sampleRate,n=Math.round(r*sec),b=ac.createBuffer(1,n,r),d=b.getChannelData(0);let l=0;for(let i=0;i<n;i++){const w=Math.random()*2-1;if(brown){l=(l+.02*w)/1.02;d[i]=l*3.5}else d[i]=w}return b}
 // фон места: собор — орган и колокол; туннели — гул и капли (громкость — vol, под голосом сам тише)
 function bedOn(name,vol){if(!A0()||!live())return;if(vol!=null)bedV=vol;if(bedN===name){duck(duckOn);return}bedOff();bedN=name;const g=ac.createGain();g.gain.value=0;g.connect(out);const sd=ac.createGain();sd.gain.value=.7;sd.connect(rv);const N=[],T=[];
  g.gain.linearRampToValueAtTime(duckOn?bedV*.35:bedV,ac.currentTime+1.4);
  if(name==='cathedral'){[110,164.8,220,329.6].forEach((f,i)=>{const o=ac.createOscillator();o.type=i%2?'triangle':'sine';o.frequency.value=f*(1+(i-1.5)*.0015);const og=ac.createGain();og.gain.value=[.08,.045,.045,.02][i];
    const lf=ac.createOscillator(),lg=ac.createGain();lf.frequency.value=.11+i*.04;lg.gain.value=og.gain.value*.45;lf.connect(lg);lg.connect(og.gain);o.connect(og);og.connect(g);og.connect(sd);o.start();lf.start();N.push(o,lf)});
   const bell=()=>{if(bedN!=='cathedral')return;const t=ac.currentTime;[220,523.3,660.6].forEach((f,j)=>{const o=ac.createOscillator(),e=ac.createGain();o.frequency.value=f;e.gain.setValueAtTime(.0001,t);e.gain.exponentialRampToValueAtTime([.05,.02,.012][j],t+.02);e.gain.exponentialRampToValueAtTime(.0001,t+3.6);o.connect(e);e.connect(sd);e.connect(g);o.start(t);o.stop(t+3.7)});T.push(setTimeout(bell,6200+Math.random()*2600))};T.push(setTimeout(bell,2200))}
  else{const s=ac.createBufferSource();s.buffer=noise(4,1);s.loop=true;const f=ac.createBiquadFilter();f.type='lowpass';f.frequency.value=240;const sg=ac.createGain();sg.gain.value=.5;s.connect(f);f.connect(sg);sg.connect(g);s.start();N.push(s);
   const drip=()=>{if(bedN!==name)return;const t=ac.currentTime,o=ac.createOscillator(),e=ac.createGain(),p=ac.createStereoPanner?ac.createStereoPanner():null;const f0=900+Math.random()*700;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f0*.45,t+.07);
    e.gain.setValueAtTime(.0001,t);e.gain.exponentialRampToValueAtTime(.1,t+.005);e.gain.exponentialRampToValueAtTime(.0001,t+.12);o.connect(e);const to=p||e;if(p){p.pan.value=Math.random()*1.6-.8;e.connect(p)}to.connect(sd);to.connect(g);o.start(t);o.stop(t+.14);T.push(setTimeout(drip,700+Math.random()*1600))};T.push(setTimeout(drip,800))}
  bed={g,N,T}}
 function bedVol(v){bedV=v;duck(duckOn)}
 function bedOff(){if(!bed)return;const b=bed;bed=null;bedN='';try{const t=ac.currentTime;b.g.gain.cancelScheduledValues(t);b.g.gain.setValueAtTime(b.g.gain.value,t);b.g.gain.linearRampToValueAtTime(0,t+.5)}catch(e){}b.T.forEach(clearTimeout);setTimeout(()=>{b.N.forEach(n=>{try{n.stop()}catch(e){}});try{b.g.disconnect()}catch(e){}},700)}
 // звуки событий (в макете — синтез; в приложении — настоящие звуки игры от Зетки)
 function sfx(kind){if(!A0()||!live())return 0;const t=ac.currentTime,o2=(f,ty)=>{const o=ac.createOscillator();o.type=ty||'sine';o.frequency.value=f;return o},env=(g,a,pk,d,t0)=>{g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(pk,t0+a);g.gain.exponentialRampToValueAtTime(.0001,t0+d)};
  const nz=(sec,lo,hi,pk,t0,sweep)=>{const s=ac.createBufferSource();s.buffer=noise(sec,0);const bp=ac.createBiquadFilter();bp.type='bandpass';bp.Q.value=1.2;bp.frequency.setValueAtTime(lo,t0);if(sweep)bp.frequency.exponentialRampToValueAtTime(hi,t0+sec*.85);else bp.frequency.value=hi;const g=ac.createGain();env(g,.04,pk,sec,t0);s.connect(bp);bp.connect(g);g.connect(out);g.connect(rv);s.start(t0);s.stop(t0+sec)};
  const boom=(f0,pk,t0,d)=>{const o=o2(f0),g=ac.createGain();o.frequency.setValueAtTime(f0,t0);o.frequency.exponentialRampToValueAtTime(32,t0+d*.8);env(g,.01,pk,d,t0);o.connect(g);g.connect(out);o.start(t0);o.stop(t0+d)};
  if(kind==='ult'){nz(.9,240,3200,.42,t,true);[0,.12,.24].forEach((dl,i)=>{const o=o2(220*(i+1)*1.5,'triangle'),g=ac.createGain();env(g,.3,.03,.9,t+dl);o.connect(g);g.connect(rv);o.start(t+dl);o.stop(t+dl+1)});boom(90,.95,t+.86,1.1);nz(.35,1800,1800,.22,t+.86);return 900}
  if(kind==='enter'){nz(.5,3800,3800,.18,t);const o=o2(2637,'sine'),g=ac.createGain();env(g,.005,.12,1.4,t+.05);o.connect(g);g.connect(out);g.connect(rv);o.start(t+.05);o.stop(t+1.5);const o3=o2(3951),g3=ac.createGain();env(g3,.005,.05,1,t+.05);o3.connect(g3);g3.connect(rv);o3.start(t+.05);o3.stop(t+1.1);return 320}
  if(kind==='kill'){[196,233.1,293.7].forEach((f,i)=>{const o=o2(f,'sawtooth'),lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1200;const g=ac.createGain();env(g,.01,.09,1.3,t+i*.05);o.connect(lp);lp.connect(g);g.connect(out);g.connect(rv);o.start(t+i*.05);o.stop(t+1.4)});boom(70,.6,t,.6);return 300}
  if(kind==='hit'){boom(120,.8,t,.32);nz(.12,2200,2200,.25,t);return 0}
  if(kind==='ko'){boom(60,.9,t,1.6);[110,164.8].forEach(f=>{const o=o2(f,'triangle'),g=ac.createGain();env(g,.02,.08,2.4,t);o.connect(g);g.connect(rv);o.start(t);o.stop(t+2.5)});return 0}
  if(kind==='tick'){const o=o2(1800),g=ac.createGain();env(g,.002,.05,.06,t);o.connect(g);g.connect(out);o.start(t);o.stop(t+.08);return 0}
  return 0}
 // 27.10: настоящий звук абилки из игры (Зетка, ветка zai/sfx) — поверх, не обрывая реплику; вернёт, через сколько мс пускать голос (-1 — нет файла)
 function fxPlay(k){k=key(k);const b=BUF[k];if(!b||!live())return -1;const s=ac.createBufferSource();s.buffer=b;const g=ac.createGain();g.gain.value=.85;s.connect(g);g.connect(out);const e=ac.createGain();e.gain.value=.22;g.connect(e);e.connect(rv);s.start();return Math.round(Math.min(b.duration*700,1500))}
 function stop(){cancel();bedOff()}
 return {A0,load,preload,line,stopLine:cancel,pos,bed:bedOn,bedVol,bedOff,sfx,fxPlay,stop,live,unlocked:()=>ok}})();
// старый звук v12 тоже открываем на первом касании — чтобы и в v12 реплики по таймеру звучали
['pointerdown','touchend'].forEach(ev=>document.addEventListener(ev,()=>{try{const a=SND12.A0();if(a&&a.state!=='running')a.resume()}catch(e){}},{capture:true,passive:true}));
// реплика: до первого касания — молча (только волна), после — голос; sfx — звук события перед голосом
/* 27.10, Андрей: «реплики по звуку и перевод за ними не успевают, не совпадают». Было: слова шли по таймеру «на глаз» от длины файла
   и стартовали до того, как звук реально пошёл. Теперь время каждого слова — из распознавания самих mp3 (WT13, faster-whisper),
   слова загораются по реальному месту воспроизведения (S13.pos), без звука — тем же ритмом. Перевод показывают сразу, как пошла реплика. */
const WT13={"rat-king-14":[["We",0.0,0.12],["do",0.12,0.34],["this",0.34,0.54],["on",0.54,0.78],["my",0.78,1.02],["time,",1.02,1.46],["you",1.64,1.68],["crumb",1.68,2.22],["bum.",2.22,2.46]],"rat-king-15":[["NO",0.0,0.22],["ONE",0.22,0.6],["RUSHES",0.6,1.24],["THE",1.24,1.48],["KING!",1.48,1.86]],"rat-king-18":[["Who's",0.0,0.4],["exterminatin'",0.4,1.44],["who",1.78,1.94],["now?",1.94,2.52]],"rat-king-19":[["Get",0.0,0.16],["outta",0.16,0.52],["my",0.52,0.78],["face,",0.78,1.4],["pal!",1.8,1.9]],"rat-king-21":[["Eat",0.0,0.3],["dirt",0.3,0.98],["crumb",0.98,1.72],["bum.",1.72,2.04]],"rat-king-23":[["How's",0.0,0.3],["your",0.3,0.42],["streak",0.42,0.94],["lookin'",0.94,1.44],["now,",1.72,1.86],["pal?",2.2,2.22]],"rk-hail-marys":[["Go",0.0,0.2],["do",0.2,0.48],["some",0.48,0.82],["Hail",0.82,1.16],["Marys",1.16,1.9],["or",1.9,2.02],["something.",2.02,2.38]],"rk-holier":[["Haulier",0.0,0.6],["than",0.6,0.8],["thou,",0.8,1.32],["crumb",1.74,2.04],["bum.",2.04,2.36]],"rk-king-here":[["The",0.0,0.3],["Red",0.3,0.66],["King",0.66,1.26],["is",1.26,1.68],["here!",1.68,2.28]],"rk-priest-vs-king":[["What's",0.0,0.3],["a",0.3,0.4],["priest",0.4,0.76],["gonna",0.76,1.1],["do",1.1,1.4],["to",1.4,1.56],["a",1.56,1.74],["king?",1.74,2.1]],"rk-sewers":[["I",0.0,0.18],["thought",0.18,0.4],["I",0.4,0.62],["said",0.62,1.0],["you",1.0,1.24],["weren't",1.24,1.6],["supposed",1.6,1.9],["to",1.9,2.2],["show",2.2,2.44],["your",2.44,2.74],["face",2.74,3.08],["in",3.08,3.32],["the",3.32,3.46],["sewers",3.46,3.94],["again.",3.94,4.36]],"rk-took-down":[["Took",0.0,0.24],["DOWN",0.24,0.56],["THE",0.56,0.78],["VANADA!",0.78,1.34]],"rk-ult-roll":[["Let's",0.0,0.52],["roll",0.52,0.96],["boys!",0.96,1.6]],"ven-die-monster":[["Die,",0.0,0.48],["monster!",0.86,1.1]],"ven-evil-dies":[["Evil",0.0,0.34],["dies",0.34,0.88],["today.",0.88,1.64]],"ven-evil-stirs":[["Evil",0.0,0.32],["stirs",0.32,0.92],["in",0.92,1.08],["New",1.08,1.22],["York,",1.22,1.58],["and",2.26,2.48],["so",2.48,2.64],["the",2.64,2.76],["Vatican",2.76,3.14],["has",3.14,3.42],["called",3.42,3.64],["on",3.64,3.86],["me.",3.86,4.06]],"ven-no-hide":[["You",0.0,0.16],["can't",0.16,0.6],["hide",0.6,0.8],["from",0.8,1.06],["a",1.06,1.18],["Venator.",1.18,1.64]],"ven-not-merciful":[["The",0.0,0.16],["Lord",0.16,0.4],["is",0.4,0.66],["merciful,",0.66,1.36],["I",2.16,2.48],["am",2.48,2.66],["not.",2.66,2.98]],"ven-will-find":[["I",0.0,0.18],["will",0.18,0.4],["find",0.4,0.74],["you.",0.74,1.04]],"venator-08":[["Today,",0.0,0.4],["nine",1.42,1.72],["commandments",1.72,2.2],["will",2.2,2.5],["have",2.5,2.64],["to",2.64,2.78],["do.",2.78,2.96]],"venator-09":[["God",0.0,0.24],["forgives,",0.24,0.94],["I",1.44,2.0],["do",2.0,2.22],["not.",2.22,2.5]],"venator-14":[["Picked",0.0,0.2],["the",0.2,0.34],["wrong",0.34,0.56],["fight.",0.56,0.92]],"venator-21":[["The",0.0,0.08],["work",0.08,0.26],["doesn't",0.26,0.68],["come",0.68,0.82],["cheap.",0.82,1.16]]};
Object.assign(DUR11,{"rat-king-14":2.89,"rat-king-15":2.35,"rat-king-18":3.31,"rat-king-19":2.33,"rat-king-21":2.37,"rat-king-23":2.65,"rk-a4":2.45,"rk-hail-marys":2.84,"rk-holier":2.73,"rk-king-here":2.95,"rk-priest-vs-king":2.53,"rk-sewers":4.77,"rk-took-down":1.73,"rk-ult-roll":2.37,"ven-a4":2.45,"ven-die-monster":1.79,"ven-evil-dies":2.3,"ven-evil-stirs":4.43,"ven-no-hide":2.3,"ven-not-merciful":3.5,"ven-will-find":1.4,"venator-08":3.4,"venator-09":2.98,"venator-14":1.37,"venator-21":1.6});
// время слов на экране (D — слова как написаны у нас): совпало число слов — 1:1, нет («crumbum» = «crumb bum») — по доле букв
function wt13(k,D){const T=WT13[AU11[k]||k],cl=s=>s.replace(/[^a-z0-9']/gi,'').length||1;
 if(!T||!T.length){const d=(DUR11[AU11[k]||k]||2.4)*.85,L=D.reduce((s,w)=>s+cl(w),0);let t=0;return D.map(w=>{const a=t;t+=d*cl(w)/L;return[a,t]})}
 if(T.length===D.length)return T.map(x=>[x[1],x[2]]);
 const tc=[];let acc=0;T.forEach(x=>{const n=cl(x[0]);tc.push([acc,acc+n,x[1],x[2]]);acc+=n});
 const at=f=>{const c=f*acc;for(const q of tc)if(c<=q[1]+1e-6)return q[2]+(q[3]-q[2])*Math.max(0,(c-q[0])/(q[1]-q[0]));return tc[tc.length-1][3]};
 const dc=D.map(cl),DT=dc.reduce((a,b)=>a+b,0);let c=0;return D.map((w,i)=>{const a=at(c/DT),b=at((c+dc[i])/DT);c+=dc[i];return[a,b]})}
let SPK13=0;
// реплика: sx/sfx — звук перед голосом; words + onWord(i) — слова по голосу; onStart — звук пошёл (тут показывать перевод); onEnd — договорил
function speak13(ctx,k,o){o=o||{};const id=++SPK13,D=o.words||[],T=wt13(k,D),dur=DUR11[AU11[k]||k]||2.4;let done=false,started=false,iw=-1;
 const words=t=>{while(iw+1<D.length&&t>=T[iw+1][0]-.04){iw++;o.onWord&&o.onWord(iw)}};
 const fin=()=>{if(done)return;done=true;if(id===SPK13)words(1e9);o.end&&o.end();o.onEnd&&o.onEnd()};
 const loop=get=>{const f=()=>{if(done||!ctx.alive||id!==SPK13)return;words(get());requestAnimationFrame(f)};f()};
 const begin=get=>{if(started)return;started=true;o.onStart&&o.onStart();loop(get)};
 const silent=()=>{if(started||done)return;const s0=performance.now();begin(()=>(performance.now()-s0)/1000);ctx.t(()=>{if(id===SPK13)fin()},dur*1000+120)};
 const go=()=>{if(id!==SPK13)return;if(o.mute||!S13.live()){silent();return}
  S13.line(k,{echo:o.echo,gain:o.gain,start(){begin(()=>Math.max(0,S13.pos()))},end(){if(id===SPK13)fin()}}).then(x=>{if(!x)silent()})};
 let gap=0;if(!o.mute&&S13.live()){gap=o.sx?S13.fxPlay(o.sx):-1;if(gap<0)gap=o.sfx?S13.sfx(o.sfx):0}
 if(gap)ctx.t(go,gap);else go();ctx.add(()=>{if(id===SPK13)S13.stopLine()});
 ctx.t(()=>{if(!started&&!done&&id===SPK13)silent()},gap+2500); // звук не пошёл за 2,5 с (сеть) — текст не висит
 return (dur*1000+gap)}
function say13(ctx,k,o){o=o||{};return speak13(ctx,k,{echo:o.echo,gain:o.gain,sx:o.sx,sfx:o.sfx,mute:o.mute,end:o.end})}
// комикс в v13 открывает движок v12 — его реплики тоже через этот звук (один голос за раз, без двух звуковых движков)
const SAY12_OLD=say12;
say12=function(ctx,k,o){o=o||{};if(curV&&/^[gkls]13/.test(curV.id||'')){if(o.bed&&!o.dry&&o.loud!==false)S13.bed(o.bed==='arena'?'sewer':o.bed,.3);return say13(ctx,k,{echo:o.dry?0:.2,mute:o.loud===false,end:o.end})}return SAY12_OLD(ctx,k,o)};

/* --- герои v13 --- */
const LV13={venator:{lv:2,xp:340,nx:500,nxt:'серебряная рамка иконки'},rat:{lv:1,xp:120,nx:300,nxt:'рамка иконки'}};
// главы: o — кто говорит по очереди (V — Венатор, R — Король, M — Рэм); первая буква — кто начинает
const CH13={venator:[{t:'Охота объявлена',w:'rat',ab:'Ватикан послал Венатора в канализацию за Крысиным королём.',o:'VRVRV',st:'done',min:'1',dp:6},
  {t:'Проповедь свинца',w:'rat',ab:'Драка в соборе: проповедь под выстрелы, Король дразнит молитвами.',o:'RVRVRVV',st:'chk',min:'1,5',dp:7},
  {t:'Тяжела корона',w:'rat',ab:'Король жалуется, как тяжело быть королём крыс.',o:'RVRRV',st:'new',min:'1',dp:5},
  {t:'Добрый пастырь',w:'rem',ab:'Рэм не верит, что поп может быть добрым.',o:'MVMVMVMV',st:'lock',min:'2',dp:8}],
 rat:[{t:'Охота объявлена',w:'venator',ab:'В туннели Короля спустился поп с ружьём.',o:'VRVRV',st:'done',min:'1',dp:6},
  {t:'Проповедь свинца',w:'venator',ab:'Король дразнит Венатора молитвами.',o:'RVRVRVV',st:'chk',min:'1,5',dp:7},
  {t:'Тяжела корона',w:'venator',ab:'Быть королём крыс — это работа. Важные дела! Крысиные!',o:'RVRRV',st:'new',min:'1',dp:5}]};
const CHK13={V:'venator',R:'rat',M:'rem'};
// фон-локация героя: у пяти героев — живой фон (v11), у остальных — их арт, размытый и в цвете героя
const loc13=k=>HERO[k]?`<span class="l13 l13v">${heroBg11(k)}</span>`:`<span class="l13 la" style="--ac:${H12[k].ac}"><i class="img" style="background-image:url(${VT(k)})"></i></span>`;
// карточка героя: живая локация на весь размер, герой — маленькой иконкой (герб или мини-арт — как у игрока в настройках)
function hc13(k,o){o=o||{};const h=H12[k],L=LV13[k];return `<button class="h13c${h.v?' live':' soon'}" data-k="${k}" style="--ac:${h.ac}">${loc13(k)}<i class="vg"></i>
  <span class="ri"><span class="ico">${hic12(k,'h13i')}</span>${L?`<svg class="lr" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18.5" class="t"/><circle cx="20" cy="20" r="18.5" class="p" pathLength="100" style="--p:${Math.round(L.xp/L.nx*100)}"/></svg>`:''}</span>
  <span class="nm"><b>${h.n}</b><small>${L?'ур. '+L.lv+' · '+h.loc:h.v?h.loc:'портрет делаем'}</small></span>${o.badge||''}</button>`}
function hcPaint13(root){$$('.h13c',root).forEach(b=>{const i=$('.ico',b);if(i)i.innerHTML=hic12(b.dataset.k,'h13i')})}

/* --- мини-комикс главы (обложка): панели по очереди говорящих — первая, крупная, — кто начинает --- */
function th13(x){const sp=[...x.o].map(c=>CHK13[c]);const P=sp.slice(0,3);return `<span class="th13">${P.map((k,i)=>`<span class="pn p${i}" style="--ac:${(H12[k]||{}).ac||'#888'}">${hic12(k,'t13i')}<i class="bq"></i></span>`).join('')}<em class="st1">начинает</em></span>`}
const ST13={new:['Новая','nw',''],chk:['Прочитана · проверка ждёт','ck','book11'],done:['Закреплено · 3 из 3','dn','check'],deep:['Углублено','dp','starf'],lock:['Откроется, когда будет портрет Рэма','lk','lock']};
function chHTML13(k,x,j,mode){const s=ST13[x.st],w=H12[x.w]||{ru:'?'},first=CHK13[x.o[0]],strip=mode==='strip';
 const who=`<span class="who">${hic12(first,'w13i')}<span><b>${H12[first].ru}</b> начинает · ${x.o.length} реплик · ≈ ${x.min} мин</span></span>`;
 const ord=`<span class="ord">${[...x.o].map((c,i)=>`<i class="${i===0?'f':''}" style="--ac:${H12[CHK13[c]].ac}">${hic12(CHK13[c],'o13i')}</i>`).join('')}</span>`;
 return `<button class="ch13 s-${x.st}${strip?' strip':''}" data-j="${j}">${strip?'':th13(x)}<span class="tx"><small>ГЛАВА ${j+1} · С ${(INS11[x.w]||'').toUpperCase()}</small><b>${x.t}</b>${strip?ord+`<span class="who t"><span><b>${H12[first].ru}</b> начинает · ${x.o.length} реплик · ≈ ${x.min} мин</span></span>`:who}
  <span class="ft"><span class="sc ${s[1]}">${s[2]?ic(s[2]):'<i class="dt"></i>'}${s[0]}</span>${x.st==='done'?`<span class="dg" data-deep="${j}">${ic('deep11')}Углубить · +${x.dp} слов</span>`:''}</span></span>${x.st==='lock'?'':`<i class="go">${ic('chev')}</i>`}</button>`}

/* --- страница героя: живой портрет сверху, уровень, комиксы — выбор главы (Андрей: «на стадии пика — кто начал, сколько углубить, как запомнится») --- */
function hp13(R,ctx,k,from,o){o=o||{};const h=H12[k],L=LV13[k]||{lv:1,xp:0,nx:300,nxt:'рамка'},CH=(CH13[k]||[]).map(x=>Object.assign({},x)),mode=o.mode||'thumb';
 const ov=document.createElement('div');ov.className='hp13';ov.style.setProperty('--ac',h.ac);
 ov.innerHTML=`<div class="hp13-st">${loc13(k)}${h.v?`<video muted loop playsinline data-hv="${h.v}" poster="${IMG[h.v]}" style="object-position:${h.pos}"></video>`:''}<i class="dm"></i>
   <button class="g11-bk" aria-label="Назад">${ic('back')}</button><button class="hp13-ic" aria-label="Иконки"></button>
   <div class="nm"><small>${(HERO[k]&&HERO[k].role||'').toUpperCase()}</small><b>${h.n}</b>
    <span class="lvl"><span class="ring"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" class="t"/><circle cx="20" cy="20" r="16" class="p" pathLength="100"/></svg><em>${L.lv}</em></span>
    <span class="xp"><b>ур. ${L.lv} · ${L.xp} / ${L.nx}</b><small>на ур. ${L.lv+1} — ${L.nxt}</small></span></span></div></div>
  <div class="hp13-bd"><div class="hp13-ac"><button class="vs">${ic('swords13')}<span><b>Versus за ${k==='rat'?'Короля':h.ru+'а'}</b><small>3 раунда с другом</small></span></button><button class="ln">${ic('wave13')}<span><b>Реплики</b><small>с голосом</small></span></button></div>
   <div class="g11-sec"><b>Комиксы · выбери главу</b><small>${CH.length} главы</small></div>
   <div class="hp13-ls"></div>
   <p class="hp13-nt">${ic('cal13')}<span>Каждая глава после чтения — 3 вопроса. Ответил — 3 фразы уходят в повторение на завтра. «Углубить» — по желанию: ещё слова главы и ×2 опыта.</span></p></div>`;
 const paint=()=>{$('.hp13-ls',ov).innerHTML=CH.map((x,j)=>chHTML13(k,x,j,mode)).join('')};paint();
 R.appendChild(ov);playV12(ov);const c=sub(ctx);
 icToggle(R,c,$('.hp13-ic',ov),()=>{paint();hcPaint13(R)});
 const q=from?rel(from,R):null;if(q)an(ov,[{clipPath:`inset(${q.y}px ${344-q.x-q.w}px ${754-q.y-q.h}px ${q.x}px round 20px)`},{clipPath:'inset(0 0 0 0 round 0)'}],{d:520,e:EO});else an(ov,[{opacity:0},{opacity:1}],{d:300});
 const ring=$('.lvl .p',ov),xpv=L.xp/L.nx;ring.style.strokeDashoffset='100';c.t(()=>{ring.style.strokeDashoffset=String(100-Math.round(xpv*100))},380);
 $$('.hp13-st .nm>*,.hp13-ac>button,.hp13-bd .g11-sec,.ch13,.hp13-nt',ov).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:260+Math.min(i,10)*55}));
 let touched=false;c.on(ov,'pointerdown',()=>{touched=true},{capture:true});
 const close=()=>{c.kill();const z=an(ov,[{opacity:1},{opacity:0,transform:'scale(.96)'}],{d:220,e:EI,f:'forwards'});const f=()=>{ov.remove();o.onClose&&o.onClose()};if(z)z.onfinish=f;else f()};
 c.on(ov,'click',e=>{const t=e.target;if(t.closest('.g11-bk')){if(o.onClose||from)close();else toast(R,'← назад к героям');return}
  if(t.closest('.hp13-ac .vs')){g11Over(R,c,(pv,cc,cl)=>vs13(pv,cc,{onBack:cl}),null,t.closest('button'));return}
  if(t.closest('.hp13-ac .ln')){g11Over(R,c,(pv,cc,cl)=>tt13(pv,cc,{hero:k,onBack:cl}),null,t.closest('button'));return}
  const dg=t.closest('[data-deep]');if(dg){e.stopPropagation();chSheet13(R,c,k,CH[+dg.dataset.deep],+dg.dataset.deep,'deep');return}
  const ch=t.closest('.ch13');if(ch){const x=CH[+ch.dataset.j];an(ch,[{transform:'scale(.97)'},{transform:'none'}],{sp:SPb});if(x.st==='lock'){shake(ch,5,300);toast(R,'Откроется, когда у Рэма будет живой портрет');return}chSheet13(R,c,k,x,+ch.dataset.j)}});
 if(o.demo)c.t(()=>{if(touched)return;const ch=$('.ch13[data-j="1"]',ov);if(ch){ov.scrollTo({top:Math.max(0,ch.offsetTop-300),behavior:'smooth'});c.t(()=>{if(!touched)chSheet13(R,c,k,CH[1],1)},1000)}},2600);
 return ov}

/* --- шторка главы перед чтением: кто начинает, кто отвечает, длина, как запомнится, сколько углубить --- */
function chSheet13(R,ctx,k,x,j,want){let s=$('.cs13',R);if(s)s.remove();s=document.createElement('div');s.className='cs13';const sp=[...x.o].map(c=>CHK13[c]),first=sp[0],other=sp.find(q=>q!==first)||x.w,dn=x.st==='done'||x.st==='deep';
 const go=x.st==='chk'?`<button class="pri" data-a="chk">${ic('check')}Проверка · 3 вопроса · ≈ 30 с</button><button data-a="read">Перечитать</button>`
  :dn||want==='deep'?`<button class="pri" data-a="deep">${ic('deep11')}Углубить · ещё ${x.dp} слов</button><button data-a="read">Перечитать</button>`
  :`<button class="pri" data-a="read">${ic('book11')}Читать главу</button><button data-a="listen">${ic('ear13')}Слушать как диалог</button>`;
 s.innerHTML=`<i class="sc"></i><div class="pn"><i class="hd"></i><small>ГЛАВА ${j+1} · С ${(INS11[x.w]||'').toUpperCase()}</small><b>${x.t}</b><p>${x.ab}</p>
  <div class="ord13${sp.length>6?' sm':''}">${sp.map((q,i)=>`<span class="${i===0?'f':''}" style="--ac:${H12[q].ac}">${hic12(q,'o13i')}${i===0?'<em>начинает</em>':''}</span>`).join('<i class="ar"></i>')}</div>
  <div class="rows"><span>${hic12(first,'w13i')}<span class="tt"><b>${H12[first].ru} начинает, ${H12[other].ru} отвечает</b><small>${x.o.length} реплик · ≈ ${x.min} мин · голоса из игры</small></span></span>
   <span><i class="ri">${ic('cal13')}</i><span class="tt"><b>Как запомнится</b><small>после главы 3 вопроса → 3 фразы завтра в повторение${dn?' · уже закреплено':''}</small></span></span>
   <span><i class="ri g">${ic('deep11')}</i><span class="tt"><b>Углубить — по желанию</b><small>ещё ${x.dp} слов главы · ×2 опыта ${k==='rat'?'Короля':H12[k].ru+'а'}</small></span></span></div>
  <div class="bt">${go}</div></div>`;
 R.appendChild(s);an($('.pn',s),[{transform:'translateY(100%)'},{transform:'none'}],{sp:SPs});an($('.sc',s),[{opacity:0},{opacity:1}],{d:240});
 $$('.ord13>span',s).forEach((e,i)=>an(e,[{opacity:0,transform:'scale(.4)'},{opacity:1,transform:'none'}],{sp:SPb,dl:200+i*70}));
 const c=sub(ctx),cl=()=>{c.kill();const z=an($('.pn',s),[{transform:'none'},{transform:'translateY(100%)'}],{d:220,e:EI,f:'forwards'});an($('.sc',s),[{opacity:1},{opacity:0}],{d:220,f:'forwards'});const f=()=>s.remove();if(z)z.onfinish=f;else f()};
 c.on($('.sc',s),'click',cl);
 c.on($('.bt',s),'click',e=>{const b=e.target.closest('button');if(!b)return;an(b,[{transform:'scale(.95)'},{transform:'none'}],{sp:SPb});const a=b.dataset.a;cl();
  if(a==='read'||a==='listen')g11Over(R,ctx,(pv,cc,cb)=>comic12(pv,cc,'who',{onBack:cb}),null,null);
  else if(a==='chk')g11Over(R,ctx,(pv,cc,cb)=>comic12(pv,cc,'who',{start:'check',onBack:cb}),null,null);
  else toast(R,`Углублённая: ${x.dp} коротких заданий по словам главы · ×2 опыта`)})}

/* --- Deadlock изнутри v13: шапка — сам Deadlock; Versus — обычная плитка среди других, без двух героев на всю ширину --- */
function g13Hub(R,ctx,from,o){o=o||{};let ov=$('.g11-hub',R);if(ov)ov.remove();ov=document.createElement('div');ov.className='g11-hub g12-hub g13-hub';
 ov.innerHTML=`<div class="g11-hh g12-hh">${cns12()}<i class="sh"></i><button class="g11-bk" aria-label="Назад">${ic('back')}</button>
   <div class="tx"><small>ИГРА · ДИАЛОГИ ГЕРОЕВ</small>${neon11('DEADLOCK','hh')}<span>9 героев · 6 комиксов · голоса из игры</span></div></div>
  <div class="g11-sec"><b>Сейчас</b><small>новое — раз в 8 часов</small></div>
  <div class="g11-feed">
   <button class="g11-fi" data-go="radar"><span class="ic">${rdr11(0)}</span><span class="tx"><b>2 перехвата ждут</b><small>Туннели · Собор · ×2 опыта</small></span><em class="tm">5:12:40</em></button>
   <button class="g11-fi" data-go="check"><span class="ic bk">${ic('book11')}</span><span class="tx"><b>Глава ждёт проверки</b><small>«Проповедь свинца» · 3 вопроса · ≈ 30 с</small></span>${ic('chev')}</button>
   <button class="g11-fi" data-go="vs"><span class="ic mm">${hic12('rat')}${hic12('venator')}</span><span class="tx"><b>Боря зовёт в Versus</b><small>ставка 50 · 2 ч назад</small></span><em class="ok">Принять</em></button></div>
  <div class="g11-sec"><b>Во что играть</b><small>всё про Deadlock — тут</small></div>
  <div class="g13-md">
   <button data-go="comics" class="cm"><span class="art">${ic('comic13')}<i class="pg a"></i><i class="pg b"></i></span><b>Комиксы</b><small>6 глав · 1 ждёт</small></button>
   <button data-go="vs" class="vs"><span class="art">${ic('swords13')}</span><b>Versus</b><small>с другом · 3 раунда</small></button>
   <button data-go="radar" class="rd"><span class="art r13-mini">${radarMini13()}</span><b>Радар</b><small>2 перехвата</small></button>
   <button data-go="lines" class="ln"><span class="art">${eqBars(9)}</span><b>Реплики</b><small>как в TikTok</small></button></div>
  <div class="g11-sec"><b>Герои</b><small>иконки — как в твоих настройках</small></div>
  <div class="h13-g">${HK12.map(k=>hc13(k,{badge:k==='venator'?'<em class="nw13">1 новая</em>':''})).join('')}</div>
  <button class="g13-ict"><span class="ic13"></span><span><b>Иконки героев</b><small>гербы или арт из игры — в приложении это настройка</small></span></button>`;
 R.appendChild(ov);const c=sub(ctx);
 if(from){const q=rel(from,R);an(ov,[{clipPath:`inset(${q.y}px ${344-q.x-q.w}px ${754-q.y-q.h}px ${q.x}px round 24px)`},{clipPath:'inset(0 0 0 0 round 0)'}],{d:560,e:EO})}else an(ov,[{opacity:0},{opacity:1}],{d:300});
 neonOn11(c,$('.g11-ne.hh',ov),260);neonLife11(c,$('.g11-ne.hh',ov));cnsOn12(c,ov);radarSpin13(c,ov);
 icToggle(R,c,$('.g13-ict .ic13',ov),()=>{hcPaint13(ov);$$('.g11-fi .mm',ov).forEach(m=>{m.innerHTML=hic12('rat')+hic12('venator')})});
 $$('.g11-sec,.g11-fi,.g13-md>button,.h13c,.g13-ict',ov).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(20px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:420+Math.min(i,14)*50}));
 let touched=false;c.on(ov,'pointerdown',()=>{touched=true},{capture:true});
 const close=()=>{c.kill();const z=an(ov,[{opacity:1,transform:'none'},{opacity:0,transform:'translateX(40px)'}],{d:240,e:EI,f:'forwards'});const f=()=>{ov.remove();o.onClose&&o.onClose()};if(z)z.onfinish=f;else f()};
 c.on(ov,'click',e=>{const t=e.target;if(t.closest('.g13-ict')){if(!t.closest('.ic13'))$('.g13-ict .ic13',ov).click();return}
  if(t.closest('.g11-bk')){if(o.onClose||from)close();else toast(R,'← назад к вкладке «Игры»');return}
  const h=t.closest('.h13c');if(h){an(h,[{transform:'scale(.95)'},{transform:'none'}],{sp:SPb});if(!H12[h.dataset.k].v){toast(R,`${H12[h.dataset.k].ru}: живой портрет ещё делаем`);return}hp13(R,c,h.dataset.k,h);return}
  const g=t.closest('[data-go]');if(!g)return;an(g,[{transform:'scale(.96)'},{transform:'none'}],{sp:SPb});const go=g.dataset.go;
  if(go==='radar')g11Over(R,c,(pv,cc,cl)=>radar13(pv,cc,{onBack:cl}),null,g);
  else if(go==='check')g11Over(R,c,(pv,cc,cl)=>comic12(pv,cc,'who',{start:'check',onBack:cl}),null,g);
  else if(go==='vs')g11Over(R,c,(pv,cc,cl)=>vs13(pv,cc,{onBack:cl}),null,g);
  else if(go==='lines')g11Over(R,c,(pv,cc,cl)=>tt13(pv,cc,{onBack:cl}),null,g);
  else if(go==='comics')hp13(R,c,'venator',g)});
 if(o.demo)c.t(()=>{if(!touched){ov.scrollTo({top:560,behavior:'smooth'});c.t(()=>{if(touched)return;const h=$('.h13c[data-k="venator"]',ov);if(h)hp13(R,c,'venator',h,{demo:true})},1700)}},2800);
 return ov}

/* --- «Герои»: живая локация, маленькая иконка героя (Андрей: «хотел увидеть иконки, которые твои были, маленькие, и мини-арты — сейчас анимированная иконка перекрывает всё и фон не видно») --- */
function g13Heroes(R,ctx){R.className='scr v8 g11 g13h';
 R.innerHTML=`${SB(0)}<div class="g11-pg g12-pg"><div class="g11-hd"><b>Герои</b><button class="g13-ib"></button></div>
  <p class="g13-hl">Фон — живая локация героя. Сам герой — маленькой иконкой: гербом или мини-артом, как ты выбрал в настройках. Кнопка справа сверху — переключить.</p>
  <div class="h13-g big">${HK12.map(k=>hc13(k,{badge:k==='venator'?'<em class="nw13">1 новая</em>':''})).join('')}</div></div><canvas class="fx"></canvas><i class="hb"></i>`;
 let touched=false;ctx.on(R,'pointerdown',()=>{touched=true},{capture:true});
 icToggle(R,ctx,$('.g13-ib',R),()=>{hcPaint13(R);$$('.h13c .ico',R).forEach((x,i)=>an(x,[{transform:'rotateY(90deg)'},{transform:'none'}],{sp:SPs,dl:i*40}))});
 $$('.h13c',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(24px) scale(.95)'},{opacity:1,transform:'none'}],{sp:SPs,dl:80+i*55}));
 $$('.h13c .lr .p',R).forEach(p=>{const v=+p.style.getPropertyValue('--p');p.style.strokeDashoffset='100';ctx.t(()=>{p.style.strokeDashoffset=String(100-v)},600)});
 ctx.on(R,'click',e=>{const h=e.target.closest('.h13c');if(!h||e.target.closest('.hp13'))return;touched=true;an(h,[{transform:'scale(.95)'},{transform:'none'}],{sp:SPb});if(!H12[h.dataset.k].v){toast(R,`${H12[h.dataset.k].ru}: живой портрет ещё делаем`);return}hp13(R,ctx,h.dataset.k,h)});
 // без касания: переключит иконки, чтобы было видно оба вида
 ctx.t(()=>{if(touched)return;$('.g13-ib',R).click();ctx.t(()=>{if(!touched)$('.g13-ib',R).click()},2600)},2400)}
