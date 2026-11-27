"use strict";
/* «Духless» · «Твоими глазами» v6 — весь ролик (27.11). Движок — dlx8.js (камера, переходы, субтитры по голосу), герои — alex9.js.
   N=<кадров> P10A=<папка с pov10.words.json> node render.mjs pov10 pov10 out.mp4
   Голос — dlx8/vo.py (pov6a, pov6b) + pov10/vo_join.py; тексты на экране — pov10/<язык>.json. */
let TX={};const QM={a:0,b:0};
KW.pov10='глаза хотят шеф пенсией рай миллионеров кредит киваешь девять кредитном нулей евро тверская клуб миша шестьсот ручкой вадима туалет зеркало себе юля ничего акцию денег полиции пусто больницу клоуна смешной клоун лёша химии вокзал больных калека рушится полигон химоружия твоя уволены голые лёгкие ушли выбиваешь втянул гудки хлопок трубку долларов операцию дорожки провал отвезти реанимация опоздал детям себя один тишина заработал клоуном';
SUBSTY.pov10='dyn';GRADE.pov10=['#ffc890','#22406c',.12];
const T10=(k,d)=>{let v=TX;for(const p of k.split('.'))v=v&&v[p];return v??d??k;};
const _init=CLIP.init;CLIP.init=async()=>{TX=await (await fetch('pov10/'+(Q.get('lang')||'ru')+'.json?'+Date.now())).json();await _init();
  QM.a=VO.maxq.a;QM.b=VO.maxq.b;ENDT=DUR+5;for(const S of SUBS){const L=S.ws[S.ws.length-1];S.b=Math.min(S.b,L.b+.55);}window.PLAN.hst=HST;window.PLAN.endt=ENDT;window.PLAN.qa=QM.a;window.PLAN.maxq=VO.maxq;};
const IDX=(s,from=0)=>{s=s.toLowerCase().replace(/[«»]/g,"");for(let i=from;i<VO.words.length;i++)if(VO.words[i].w.toLowerCase().replace(/[«»"“”.,:;!?…—–]/g,'').startsWith(s))return i;throw new Error('нет слова '+s);};

/* ================= общий набор ================= */
const fillG=(c,x,y,w,h,st,vert=true)=>{c.fillStyle=vert?LG(c,0,y,0,y+h,st):LG(c,x,0,x+w,0,st);c.fillRect(x,y,w,h);};
function scr(c,x,y,r,col,a){if(a<=0)return;c.save();c.globalCompositeOperation='screen';c.fillStyle=RG(c,x,y,0,r,[[0,rgba(col,a)],[.5,rgba(col,a*.35)],[1,rgba(col,0)]]);c.fillRect(x-r,y-r,2*r,2*r);c.restore();}
function shade(c,x,y,rx,ry,a=.45){c.save();c.translate(x,y);c.scale(1,ry/rx);c.fillStyle=RG(c,0,0,0,rx,[[0,`rgba(0,0,0,${a})`],[1,'rgba(0,0,0,0)']]);c.fillRect(-rx,-rx,2*rx,2*rx);c.restore();}
function quad(c,P,fill){c.beginPath();c.moveTo(P[0][0],P[0][1]);for(const q of P)c.lineTo(q[0],q[1]);c.closePath();c.fillStyle=fill;c.fill();}
function bokehs(c,t,n,y0,y1,cols,seed=1,r0=20,r1=70,a=.5){c.save();c.globalCompositeOperation='screen';for(let i=0;i<n;i++){const x=(H1(i*3.1+seed)*WW+Math.sin(t*.3+i)*10),y=lp(y0,y1,H1(i*7.3+seed)),r=lp(r0,r1,H1(i*1.7+seed)),col=cols[i%cols.length];
  c.fillStyle=RG(c,x,y,0,r,[[0,rgba(col,a*(.5+.5*Math.sin(t*1.3+i)))],[.7,rgba(col,a*.25)],[1,rgba(col,0)]]);c.fillRect(x-r,y-r,2*r,2*r);}c.restore();}
function blurOn(c,px,fn){const g=TB.getContext('2d');reset(g);g.clearRect(0,0,WW,HH);const k=c.getTransform();g.setTransform(k);fn(g);reset(g);c.save();reset(c);c.filter=`blur(${px*k.a}px)`;c.drawImage(TB,0,0,WW,HH,0,0,c.canvas.width,c.canvas.height);c.restore();}
function textP(c,s,x,y,o={}){tx(c,s,x,y,{f:o.f||'M',w:o.w||600,s:o.s||28,c:o.c||'#2a2622',al:o.al||'center',ls:o.ls||0});}
function cityDay(c,cx,by,sc){const C2=[{x:0,w:70,h:560,top:'flat',col:'#8ea3b8'},{x:70,w:62,h:700,top:'slant',col:'#7f9cbc'},{x:150,w:84,h:880,top:'spire',col:'#6e8fb6'},{x:236,w:72,h:760,top:'step',col:'#b89a62',crown:'#ffe0a0'},
  {x:314,w:74,h:720,top:'flat',col:'#7e98b6',twist:1},{x:390,w:66,h:640,top:'round',col:'#88a2bc'},{x:452,w:58,h:600,top:'flat',col:'#93a8bc'},{x:508,w:52,h:520,top:'slant',col:'#8198b0'}];
  for(const T of C2)tower(c,{...T,x:cx+(T.x-250)*sc},by,sc,{lite:0});}
function stalDay(c,x,by,sc){c.save();c.translate(x,by);c.scale(sc,sc);const L=[[-170,0],[-170,-140],[-120,-140],[-120,-230],[-80,-230],[-80,-330],[-52,-330],[-52,-410],[-30,-410],[-30,-470],[-12,-500],[0,-600],[12,-500],[30,-470],[30,-410],[52,-410],[52,-330],[80,-330],[80,-230],[120,-230],[120,-140],[170,-140],[170,0]];
  const p=new Path2D();p.moveTo(L[0][0],L[0][1]);for(const q of L)p.lineTo(q[0],q[1]);p.closePath();c.fillStyle=LG(c,-170,0,170,0,[[0,'#d8cbb8'],[.6,'#c1b29d'],[1,'#9a8c7a']]);c.fill(p);
  c.save();c.clip(p);c.fillStyle='rgba(80,70,60,.25)';for(let j=0;j<40;j++)for(let i=-24;i<24;i++){if(H2(i+50,j+9)>.5)continue;c.fillRect(i*7+1,-j*12-14,3.4,5);}c.restore();
  c.fillStyle='#d9b45a';c.beginPath();c.moveTo(-4,-600);c.lineTo(4,-600);c.lineTo(2,-640);c.lineTo(-2,-640);c.fill();c.restore();}
/* бумага с текстом в перспективе (плоско, с наклоном) */
function paper(c,x,y,w,h,rot,fn,o={}){c.save();c.translate(x,y);c.rotate(rot);shade(c,10,h*.55,w*.62,h*.08,.35);
  c.fillStyle=o.col||'#f3efe6';c.fillRect(-w/2,-h/2,w,h);c.fillStyle=LG(c,-w/2,0,w/2,0,[[0,'rgba(255,255,255,.18)'],[1,'rgba(0,0,0,.08)']]);c.fillRect(-w/2,-h/2,w,h);
  fn&&fn(c,w,h);c.restore();}
function lines(c,x,y,w,n,dy,col='rgba(40,40,50,.28)',seed=1){c.fillStyle=col;for(let i=0;i<n;i++)c.fillRect(x,y+i*dy,w*(.55+.45*H1(i*3.3+seed)),dy*.28);}
/* подпись настоящая: петли и росчерк, k — сколько написано */
function signature(c,x,y,s,k,col='#1b2a6a'){if(k<=0)return;c.save();c.translate(x,y);c.scale(s,s);c.strokeStyle=col;c.lineWidth=3.2;c.lineCap='round';c.lineJoin='round';
  const P=[];const add=(a,b,cx1,cy1,cx2,cy2,ex,ey,n=14)=>{for(let i=0;i<=n;i++){const u=i/n,v=1-u;P.push([v*v*v*a+3*v*v*u*cx1+3*v*u*u*cx2+u*u*u*ex,v*v*v*b+3*v*v*u*cy1+3*v*u*u*cy2+u*u*u*ey]);}};
  add(-150,10,-140,-60,-110,-70,-100,0);add(-100,0,-95,30,-80,30,-70,-6);add(-70,-6,-60,-50,-40,-40,-36,4);add(-36,4,-30,30,-12,24,-6,-4);
  add(-6,-4,4,-40,24,-36,22,6);add(22,6,20,40,50,26,60,-10);add(60,-10,74,-50,90,-30,84,10);add(84,10,80,40,120,20,140,-6);add(140,-6,160,-30,60,30,-150,36,20);
  const n=Math.max(2,Math.floor(P.length*cl(k)));c.beginPath();c.moveTo(P[0][0],P[0][1]);for(let i=1;i<n;i++)c.lineTo(P[i][0],P[i][1]);c.stroke();c.restore();
  return P[n-1];}
/* ручка без руки */
function pen(c,x,y,a,s=1){c.save();c.translate(x,y);c.rotate(a);c.scale(s,s);shade(c,30,26,140,14,.35);c.fillStyle=LG(c,0,-10,0,10,[[0,'#3a3530'],[.45,'#151210'],[1,'#050404']]);RR(c,0,-9,300,18,9);c.fill();
  c.fillStyle=LG(c,0,-9,0,9,[[0,'#ffe9a8'],[.5,'#c9962a'],[1,'#6a4a10']]);c.fillRect(70,-9,16,18);c.fillRect(250,-12,10,24);c.fillStyle='#c9962a';c.beginPath();c.moveTo(0,-9);c.lineTo(-40,0);c.lineTo(0,9);c.closePath();c.fill();
  c.fillStyle='rgba(255,255,255,.35)';c.fillRect(10,-6,230,3);c.restore();}
/* пачка долларов */
function stack(c,x,y,w,h,rot=0){c.save();c.translate(x,y);c.rotate(rot);c.fillStyle='#4f6a4a';c.fillRect(-w/2,-h/2,w,h);c.fillStyle='#7d9a76';c.fillRect(-w/2,-h/2,w,h*.3);
  c.fillStyle='rgba(30,40,30,.35)';for(let i=0;i<6;i++)c.fillRect(-w/2,-h/2+h*.3+i*(h*.7/6),w,1.2);c.fillStyle='#e9e1c8';c.fillRect(-w*.12,-h/2,w*.24,h);c.restore();}
function moneyBag(c,x,y,s,open=1){c.save();c.translate(x,y);c.scale(s,s);shade(c,0,120,330,40,.5);
  c.fillStyle=LG(c,-300,0,300,0,[[0,'#2b2b31'],[.5,'#1a1a1f'],[1,'#0c0c10']]);RR(c,-300,-90,600,220,60);c.fill();
  if(open){c.fillStyle='#09090b';RR(c,-250,-110,500,70,30);c.fill();for(let i=0;i<7;i++)stack(c,-200+i*66,-80-H1(i)*20,58,90,(H1(i*3)-.5)*.3);}
  c.strokeStyle='#9aa0a8';c.lineWidth=5;c.beginPath();c.moveTo(-250,-74);c.lineTo(250,-74);c.stroke();c.fillStyle='#c0c4c8';c.fillRect(200,-84,24,20);
  c.strokeStyle='#121216';c.lineWidth=18;c.lineCap='round';c.beginPath();c.moveTo(-150,-90);c.quadraticCurveTo(0,-230,150,-90);c.stroke();c.restore();}
/* окно с дождём / ночная Москва вдали */
function nightCity(c,x0,y0,x1,y1,t,o={}){c.save();c.beginPath();c.rect(x0,y0,x1-x0,y1-y0);c.clip();
  fillG(c,x0,y0,x1-x0,y1-y0,[[0,'#070b1a'],[.6,'#17204a'],[1,'#4a3048']]);twinkle(c,t,40,y0,y0+(y1-y0)*.4,4);
  moscowCity(c,lp(x0,x1,o.cx??.62),y1-(y1-y0)*.12,(y1-y0)/1500*(o.sc||1),{lite:.5});cityFar(c,y1-(y1-y0)*.1,{col:'#0b0d18',h:30,n:160,seed:9});
  if(o.rain)rain(c,t,.8,{});c.restore();}
/* кафель */
function tilesG(c,x0,y0,x1,y1,a,b,sz){for(let y=y0;y<y1;y+=sz)for(let x=x0;x<x1;x+=sz){const r=H2(x*.07,y*.11);c.fillStyle=tmix(a,b,r*.5);c.fillRect(x+1.5,y+1.5,sz-3,sz-3);}}
/* детский рисунок клоуна */
function kidDraw(c,x,y,s,rot){paper(c,x,y,300*s,380*s,rot,(g,w,h)=>{g.lineWidth=5*s;g.lineCap='round';g.strokeStyle='#e33';g.beginPath();g.arc(0,-40*s,70*s,0,TAU);g.stroke();
  g.fillStyle='#e33';g.beginPath();g.arc(0,-34*s,14*s,0,TAU);g.fill();g.strokeStyle='#26a';g.beginPath();g.arc(-24*s,-60*s,8*s,0,TAU);g.arc(24*s,-60*s,8*s,0,TAU);g.stroke();
  g.strokeStyle='#e33';g.beginPath();g.arc(0,-10*s,34*s,.2,Math.PI-.2);g.stroke();g.strokeStyle='#f2b51f';g.beginPath();g.moveTo(-60*s,40*s);g.lineTo(-90*s,150*s);g.moveTo(60*s,40*s);g.lineTo(90*s,150*s);g.moveTo(-50*s,40*s);g.lineTo(50*s,40*s);g.lineTo(40*s,150*s);g.lineTo(-40*s,150*s);g.closePath();g.stroke();
  g.fillStyle='#26a';for(let i=0;i<4;i++){g.beginPath();g.arc((-20+i*14)*s,(70+i*18)*s,6*s,0,TAU);g.fill();}},{col:'#fbf8ef'});}
const talk=(T,on,f=1)=>on?.35+.65*Math.max(0,Math.sin(T*14*f)*Math.sin(T*9.1*f+1)):0;

/* ================= миры ================= */
/* 1. переговорная днём: Москва-Сити за окном, коллеги и шеф смотрят на тебя */
W8.p_meet=(c,t,o)=>{fillG(c,0,0,WW,250,[[0,'#cfcac2'],[1,'#bdb7ae']]);
  c.fillStyle='rgba(255,255,250,.85)';for(const x of [180,540,900]){c.beginPath();c.moveTo(x-90,60);c.lineTo(x+90,60);c.lineTo(lp(x,540,.25)+70,200);c.lineTo(lp(x,540,.25)-70,200);c.closePath();c.fill();}
  fillG(c,0,250,WW,800,[[0,'#8fb3d6'],[.55,'#c9dbea'],[1,'#e9eef0']]);
  for(let i=0;i<5;i++){c.fillStyle=`rgba(255,255,255,${.5-i*.07})`;c.beginPath();c.ellipse(120+i*230+Math.sin(t*.05+i)*20,330+H1(i)*120,140,26,0,0,TAU);c.fill();}
  cityFar(c,980,{col:'#a9b6c2',h:50,n:0,seed:3});stalDay(c,200,1000,.62);cityDay(c,690,1010,.82);
  fillG(c,0,700,WW,350,[[0,'rgba(235,240,242,0)'],[1,'rgba(235,240,242,.6)']]);
  c.fillStyle='#2b2d33';for(const x of [0,270,540,810,1080])c.fillRect(x-8,250,16,800);c.fillRect(0,250,WW,14);c.fillRect(0,1036,WW,18);
  c.fillStyle='rgba(255,255,255,.12)';for(let i=0;i<4;i++){c.beginPath();c.moveTo(90+i*270,250);c.lineTo(150+i*270,250);c.lineTo(20+i*270,1050);c.lineTo(-40+i*270,1050);c.fill();}
  fillG(c,0,1050,WW,140,[[0,'#6a645c'],[1,'#4a453f']]);
  const tk_=o.talk?talk(t,1):0,boss={x:540,y:860,s:.66,f:'boss',e:o.bossE||'neutral',mo:tk_,light:'#dfeaff',la:.12,L:-1,cloth:{k:'suit',jacket:'#2f323a',shirt:'#e8eaee',tie:'#6a1f2a'},sw:128,bt:520};
  personA(c,boss);
  const P=[{x:300,y:990,s:.78,f:'woman',cloth:{k:'suit',jacket:'#3a3048',shirt:'#f0ece6'},sw:104},{x:790,y:990,s:.78,f:'clerk',cloth:{k:'suit',jacket:'#252a33',shirt:'#e4e8ee',tie:'#22365a'}},
    {x:95,y:1180,s:1.12,f:'st2',cloth:{k:'suit',jacket:'#1d2129',shirt:'#eef0f2',tie:'#4a1d24'}},{x:985,y:1180,s:1.12,f:'vadim',cloth:{k:'suit',jacket:'#2c3038',shirt:'#e8eaee',tie:'#36415a'}}];
  for(const p of P)personA(c,{...p,e:'neutral',light:'#dfeaff',la:.14,L:p.x<540?1:-1,look:[p.x<540?.6:-.6,0],blink:o.blink&&((t*.7+p.x*.003)%3<.12)?1:0,bt:520});
  // стол
  const TP=[[330,1150],[750,1150],[1380,1920],[-300,1920]];quad(c,TP,LG(c,0,1150,0,1920,[[0,'#3c2619'],[.5,'#5a3a24'],[1,'#2a1a11']]));
  c.save();c.beginPath();c.moveTo(TP[0][0],TP[0][1]);for(const q of TP)c.lineTo(q[0],q[1]);c.closePath();c.clip();
  c.fillStyle=LG(c,0,1150,0,1700,[[0,'rgba(220,235,250,.45)'],[1,'rgba(220,235,250,0)']]);c.fillRect(0,1150,WW,600);
  c.strokeStyle='rgba(20,10,5,.25)';c.lineWidth=2;for(let i=-6;i<7;i++){c.beginPath();c.moveTo(540+i*30,1150);c.lineTo(540+i*170,1920);c.stroke();}c.restore();
  c.fillStyle='#1a1712';c.fillRect(-300,1910,1700,10);
  // мелочи на столе: ноутбуки, бумаги, стаканы
  quad(c,[[380,1170],[470,1170],[460,1200],[370,1200]],'#d8dce2');quad(c,[[610,1170],[700,1170],[710,1200],[620,1200]],'#d8dce2');
  paper(c,250,1330,190,120,-.25,(g,w,h)=>lines(g,-w/2+14,-h/2+14,w-28,6,16));paper(c,860,1340,190,120,.3,(g,w,h)=>lines(g,-w/2+14,-h/2+14,w-28,6,16,'rgba(40,40,50,.28)',4));
  for(const [x,y,s] of [[420,1240,.7],[680,1250,.75]]){c.save();c.translate(x,y);c.scale(s,s);c.fillStyle='rgba(230,240,255,.55)';c.beginPath();c.moveTo(-26,-60);c.lineTo(26,-60);c.lineTo(20,20);c.lineTo(-20,20);c.closePath();c.fill();c.fillStyle='rgba(255,255,255,.7)';c.fillRect(-18,-50,6,60);c.restore();}
  if(o.maq!==false){c.save();c.translate(540,lp(1290,1520,o.mk||0));c.scale(lp(.55,1,o.mk||0),lp(.55,1,o.mk||0));maquette(c,t,{small:1});c.restore();}
  // твой блокнот снизу, не в фокусе
  blurOn(c,6,g=>{paper(g,420,1830,420,300,-.08,(q,w,h)=>{lines(q,-w/2+30,-h/2+40,w-60,7,30,'rgba(40,60,120,.35)');},{col:'#f6f2e8'});pen(g,700,1800,2.6,.9);});
};
/* макет посёлка «Рай миллионеров» */
function house(c,x,y,s,col,rot){c.save();c.translate(x,y);c.scale(s,s);shade(c,10,30,80,18,.4);
  quad(c,[[-60,0],[40,0],[60,-24],[-40,-24]],'#c9c3b8');quad(c,[[-60,0],[-60,-70],[40,-70],[40,0]],LG(c,-60,0,40,0,[[0,tk(col,.1)],[1,tk(col,-.15)]]));
  quad(c,[[40,0],[40,-70],[60,-92],[60,-24]],tk(col,-.35));quad(c,[[-70,-66],[50,-66],[70,-90],[-50,-90]],'#3d2f2a');quad(c,[[-70,-66],[50,-66],[0,-118],[-20,-118]],'#5a4038');quad(c,[[50,-66],[70,-90],[10,-128],[0,-118]],'#3a2a24');
  for(const wx of [-46,-12,18]){c.fillStyle=rot?'#ffd98a':'#9fc3e0';c.fillRect(wx,-52,18,22);c.fillStyle='rgba(255,255,255,.5)';c.fillRect(wx,-52,18,4);}c.fillStyle='#6a4a30';c.fillRect(-28,-30,16,30);c.restore();}
function tree(c,x,y,s,col='#4d7a46'){c.save();c.translate(x,y);c.scale(s,s);shade(c,6,6,40,10,.35);c.fillStyle='#5a3f2a';c.fillRect(-4,-40,8,40);c.fillStyle=col;c.beginPath();c.arc(0,-60,30,0,TAU);c.fill();c.fillStyle=tk(col,.25);c.beginPath();c.arc(-9,-70,14,0,TAU);c.fill();c.restore();}
function maquette(c,t,o={}){shade(c,0,60,620,90,.55);
  quad(c,[[-560,-250],[560,-250],[640,120],[-640,120]],LG(c,0,-250,0,120,[[0,'#7aa35e'],[1,'#56803f']]));quad(c,[[-640,120],[640,120],[640,160],[-640,160]],'#e8e2d6');
  c.strokeStyle='#cfc8b8';c.lineWidth=26;c.beginPath();c.moveTo(-520,40);c.lineTo(520,40);c.moveTo(0,40);c.lineTo(0,-240);c.stroke();
  c.fillStyle=LG(c,0,-200,0,-120,[[0,'#7fb7d8'],[1,'#4f8fb8']]);c.beginPath();c.ellipse(330,-150,110,40,0,0,TAU);c.fill();c.fillStyle='rgba(255,255,255,.5)';c.fillRect(280,-162,60,4);
  c.strokeStyle='#efe9dd';c.lineWidth=3;c.setLineDash([8,6]);c.beginPath();c.moveTo(-600,100);c.lineTo(600,100);c.stroke();c.setLineDash([]);
  const H=[[-430,-170,.62,'#efe6da'],[-250,-170,.62,'#f1e9dd'],[-430,-20,.8,'#ece2d4'],[-230,-20,.8,'#efe7da'],[170,-20,.8,'#f0e8dc'],[380,-20,.8,'#ede4d6'],[150,-180,.6,'#efe7db'],[-80,-200,.55,'#ece3d6'],[-430,130,.95,'#efe6d9'],[400,130,.95,'#ede3d5']];
  for(const [x,y,s,col] of H)house(c,x,y,s,col);for(let i=0;i<14;i++)tree(c,-560+i*85+H1(i)*30,-215+H1(i*4)*30,.55);for(let i=0;i<6;i++)tree(c,-150+i*60,70,.5,'#3f6e3a');
  // ворота и табличка
  c.fillStyle='#2a2622';c.fillRect(-120,10,10,-120+120);c.fillRect(-130,-100,12,110);c.fillRect(118,-100,12,110);c.fillStyle='#e9e2d0';RR(c,-170,-150,340,56,8);c.fill();c.strokeStyle='#b08a3a';c.lineWidth=4;c.stroke();
  tx(c,T10('maq','РАЙ МИЛЛИОНЕРОВ'),0,-114,{f:'P',w:700,s:26,c:'#5a3e10'});tx(c,T10('maq2','коттеджный посёлок'),0,-148+60,{f:'M',w:500,s:13,c:'#5a3e10'});
  for(let i=0;i<6;i++){c.fillStyle=['#c33','#ddd','#245','#333','#c93','#eee'][i];RR(c,-500+i*190,28,30,16,5);c.fill();}}
W8.p_maq=(c,t,o)=>{fillG(c,0,0,WW,HH,[[0,'#2f2620'],[1,'#120d0a']]);
  const TP=[[-200,500],[1280,500],[1700,1920],[-620,1920]];quad(c,TP,LG(c,0,500,0,1920,[[0,'#3c2619'],[.6,'#5a3a24'],[1,'#2a1a11']]));
  c.fillStyle=LG(c,0,500,0,1300,[[0,'rgba(220,235,250,.35)'],[1,'rgba(220,235,250,0)']]);c.fillRect(0,500,WW,800);
  scr(c,540,300,900,'#cfe0ff',.25);
  c.save();c.translate(540,lp(980,1180,o.k||0));c.scale(lp(.82,1.08,o.k||0),lp(.82,1.08,o.k||0));maquette(c,t);c.restore();
  // договор в углу
  paper(c,860,1640,420,300,.18,(g,w,h)=>{tx(g,T10('doc.title','КРЕДИТНЫЙ ДОГОВОР'),0,-h/2+46,{f:'J',w:700,s:20,c:'#2a2622'});lines(g,-w/2+30,-h/2+80,w-60,8,22);});
};
/* 3. стол: пропуск и справка о доходе */
W8.p_desk=(c,t,o)=>{fillG(c,0,0,WW,HH,[[0,'#4a3020'],[1,'#2a1a10']]);for(let i=0;i<40;i++){c.fillStyle=`rgba(0,0,0,${.06+.06*H1(i)})`;c.fillRect(0,i*48+H1(i*3)*10,WW,3);}
  scr(c,300,500,900,'#e7f0ff',.22);
  // пропуск на шнурке
  c.save();c.translate(330,780);c.rotate(-.12);shade(c,14,200,220,26,.45);c.strokeStyle='#c4222f';c.lineWidth=22;c.beginPath();c.moveTo(-30,-520);c.quadraticCurveTo(-60,-260,0,-210);c.stroke();
  c.fillStyle='#f6f6f4';RR(c,-170,-210,340,470,22);c.fill();c.fillStyle='#183a6b';RR(c,-170,-210,340,110,22);c.fill();c.fillRect(-170,-140,340,40);
  tx(c,T10('pass.bank','МЕГАПОЛИС'),0,-142,{f:'O',w:700,s:46,c:'#fff',ls:3});tx(c,T10('pass.bank2','РУССКО-ФРАНЦУЗСКИЙ БАНК'),0,-110,{f:'M',w:600,s:13,c:'rgba(255,255,255,.8)',ls:1});
  c.fillStyle='#dfe3e8';RR(c,-120,-70,110,140,8);c.fill();c.fillStyle='#b9c0c8';c.beginPath();c.arc(-65,-20,30,0,TAU);c.fill();c.beginPath();c.ellipse(-65,50,46,30,0,Math.PI,TAU);c.fill();
  tx(c,T10('pass.name','МАКСИМ'),60,-30,{f:'O',w:700,s:30,c:'#111',al:'center'});tx(c,T10('pass.sur','АНДРЕЕВ'),60,6,{f:'O',w:700,s:30,c:'#111'});
  tx(c,T10('pass.dep','КРЕДИТНЫЙ ОТДЕЛ'),0,120,{f:'J',w:700,s:20,c:'#183a6b',ls:2});tx(c,T10('pass.pos','ведущий менеджер'),0,156,{f:'M',w:500,s:18,c:'#444'});
  c.fillStyle='#183a6b';for(let i=0;i<22;i++)c.fillRect(-120+i*11,195,i%3?4:7,40);c.restore();
  // справка о доходе
  paper(c,780,1180,520,700,.1,(g,w,h)=>{tx(g,T10('pay.bank','МЕГАПОЛИС'),0,-h/2+56,{f:'O',w:700,s:30,c:'#183a6b',ls:3});tx(g,T10('pay.title','СПРАВКА О ДОХОДАХ · 2011'),0,-h/2+100,{f:'J',w:700,s:18,c:'#333',ls:1});
    lines(g,-w/2+40,-h/2+140,w-80,9,26);tx(g,T10('pay.total','ИТОГО ЗА ГОД'),-w/2+40,90,{f:'J',w:700,s:20,c:'#333',al:'left'});
    tx(g,'€       00 000',w/2-40,150,{f:'J',w:700,s:52,c:'#111',al:'right'});g.fillStyle='#111';g.fillRect(w/2-40-7*31.2+2,112,28,48);lines(g,-w/2+40,210,w-80,4,26,'rgba(40,40,50,.22)',7);
    const k=o.mark||0;if(k>0){g.save();g.strokeStyle='rgba(230,40,50,.85)';g.lineWidth=7;g.lineCap='round';g.beginPath();const cx=w/2-125,cy=140;for(let i=0;i<=60*k;i++){const a=-1.2+i/60*TAU*1.05,r=1+.06*Math.sin(i*.7);g.lineTo(cx+Math.cos(a)*150*r,cy+Math.sin(a)*52*r);}g.stroke();g.restore();}});
  pen(c,640,1640,-.25,.8);
  // ключ от машины и кофе
  c.save();c.translate(260,1500);shade(c,0,30,110,30,.4);c.fillStyle='#f3efe8';c.beginPath();c.arc(0,0,92,0,TAU);c.fill();c.fillStyle='#3a2414';c.beginPath();c.arc(0,0,70,0,TAU);c.fill();c.fillStyle='rgba(255,230,200,.35)';c.beginPath();c.ellipse(-20,-20,30,12,-.5,0,TAU);c.fill();c.restore();
};
/* 4. лифт вниз */
W8.p_lift=(c,t,o)=>{fillG(c,0,0,WW,HH,[[0,'#3a3d44'],[1,'#17181c']]);const k=o.k||0,op=o.open||0;
  for(const sd of [-1,1]){c.save();const x0=540+sd*(4+op*480);c.fillStyle=LG(c,x0,0,x0+sd*480,0,[[0,'#c9ced4'],[.5,'#9aa1aa'],[1,'#6d737c']]);c.fillRect(sd<0?x0-480:x0,700,480,1100);
    c.strokeStyle='rgba(255,255,255,.18)';for(let i=0;i<60;i++){c.beginPath();const x=(sd<0?x0-480:x0)+i*8;c.moveTo(x,700);c.lineTo(x,1800);c.stroke();}c.restore();}
  c.fillStyle='#2a2c31';c.fillRect(0,680,WW,24);fillG(c,0,1800,WW,120,[[0,'#3a3c42'],[1,'#121316']]);scr(c,540,300,700,'#fff6e0',.25);
  if(op>0){c.save();c.beginPath();c.rect(540-op*480,700,op*960,1100);c.clip();W8.p_tver(c,t,{cz:0});c.restore();}
  c.fillStyle='#0c0d10';RR(c,330,420,420,190,20);c.fill();c.strokeStyle='#4a4e56';c.lineWidth=6;c.stroke();const fl=Math.max(1,Math.round(42-41*k));tx(c,String(fl),580,560,{f:'J',w:700,s:130,c:'#ff4a3a',glow:'#ff2a20',gb:18});
  c.fillStyle='#ff4a3a';c.beginPath();c.moveTo(380,470);c.lineTo(440,470);c.lineTo(410,530);c.closePath();c.fill();
};
/* 5. Тверская ночью: сталинки, гирлянды, Кремль в конце */
W8.p_tver=(c,t,o)=>{const cz=o.cz||0,HZ=900,F=900,P=(X,h,Z)=>{const z=Math.max(40,Z-cz);return [540+X*F/z,HZ+(160-h)*F/z];};
  fillG(c,0,0,WW,HZ+40,[[0,'#060a1c'],[.6,'#152052'],[1,'#3a2a50']]);twinkle(c,t,40,0,500,7);
  // Кремль: Спасская башня с красной звездой
  {const [x,y]=P(0,0,9000),k=F/(9000-cz);c.save();c.translate(x,y);c.scale(k*9,k*9);c.fillStyle='#7a2a22';c.fillRect(-26,-120,52,120);c.fillRect(-20,-170,40,50);c.fillStyle='#5a1e18';c.fillRect(-14,-215,28,45);
    c.fillStyle='#3a5a40';c.beginPath();c.moveTo(-14,-215);c.lineTo(0,-270);c.lineTo(14,-215);c.fill();c.fillStyle='#e9e2d0';c.beginPath();c.arc(0,-150,9,0,TAU);c.fill();c.fillStyle='#5a1e18';c.fillRect(-120,-60,240,60);c.restore();glowDot(c,x,y-k*9*278,26,'#ff2a20',1);glowDot(c,x,y-k*9*278,80,'#ff4030',.4);}
  c.fillStyle=LG(c,0,HZ,0,HH,[[0,'#2a2030'],[1,'#07060a']]);c.fillRect(0,HZ,WW,HH-HZ);
  for(const sd of [-1,1]){for(let j=0;j<14;j++){const Z0=600+j*650,Z1=Z0+600,X=sd*620,H=560+(j%3)*60;if(Z1-cz<60)continue;const a=P(X,0,Math.max(Z0,cz+60)),b=P(X,H,Math.max(Z0,cz+60)),cc=P(X,H,Z1),d=P(X,0,Z1);
      quad(c,[a,b,cc,d],LG(c,a[0],0,d[0],0,[[0,j%2?'#5a4436':'#4e3c33'],[1,'#22191a']]));
      const nf=10,nc=6;for(let fi=1;fi<nf;fi++)for(let ci=0;ci<nc;ci++){if(H2(ci+j*7+sd*3,fi)>.62)continue;const z0=Z0+40+ci*95,z1=z0+46;if(z0<cz+60)continue;const h0=fi*52,h1=h0+30;
        quad(c,[P(X,h0,z0),P(X,h1,z0),P(X,h1,z1),P(X,h0,z1)],`rgba(255,${200+(H2(ci,fi)*40|0)},130,${.55+.4*H2(ci*3,fi)})`);}
      quad(c,[b,P(X,H+24,Math.max(Z0,cz+60)),P(X,H+24,Z1),cc],'#2a2026');}}
  // гирлянды поперёк улицы
  for(let j=0;j<12;j++){const Z=800+j*700;if(Z-cz<80)continue;const L0=P(-600,420,Z),R0=P(600,420,Z),k=F/(Z-cz);c.save();c.strokeStyle=`rgba(255,220,150,${Math.min(.8,k*2)})`;c.lineWidth=Math.max(1,3*k);c.beginPath();c.moveTo(L0[0],L0[1]);c.quadraticCurveTo(540,L0[1]+120*k,R0[0],R0[1]);c.stroke();
    for(let i=0;i<=16;i++){const u=i/16,x=lp(L0[0],R0[0],u),y=(1-u)*(1-u)*L0[1]+2*u*(1-u)*(L0[1]+120*k)+u*u*R0[1];glowDot(c,x,y,Math.max(3,26*k),'#ffd690',.6+.4*Math.sin(t*3+i+j));}c.restore();}
  // поток машин: фары и стопы
  for(let i=0;i<40;i++){const sd=i%2?1:-1,Z=((H1(i*3.3)*9000+(sd>0?-1:1)*t*1600-cz)%9000+9000)%9000+cz+120,[x,y]=P(sd*(110+H1(i)*240),20,Z),k=F/(Z-cz);glowDot(c,x,y,Math.max(4,70*k),sd>0?'#fff1d6':'#ff3a30',.9);}
  fog(c,t,HZ-40,{n:8,sp:20,h:80,r:520,a:.14,seed:3});
};
/* 6. вход в клуб: фасад, неон, канат, охранник */
W8.p_entry=(c,t,o)=>{fillG(c,0,0,WW,HH,[[0,'#08060e'],[1,'#030205']]);
  c.fillStyle='#1b1620';c.fillRect(0,0,WW,1500);for(let j=0;j<12;j++)for(let i=0;i<8;i++){c.fillStyle='rgba(0,0,0,.25)';c.fillRect(i*140,j*130,136,4);}
  const nb=.85+.15*Math.sin(t*20)*(Math.sin(t*3)>.9?1:0);tx(c,T10('club','VELVET'),540,330,{f:'P',w:700,s:150,c:'#ffd2ec',glow:'#ff2f8e',gb:40*nb,ls:6});scr(c,540,330,520,'#ff2f8e',.35*nb);
  const op=o.door||0;c.fillStyle='#09070c';RR(c,330,560,420,860,10);c.fill();
  if(op>0){c.save();c.beginPath();c.rect(330,560,420,860);c.clip();c.fillStyle=`rgba(255,120,200,${.5*op})`;c.fillRect(330,560,420,860);bokehs(c,t,10,600,1400,['#ff2f8e','#38d6ff','#ffd27a'],4,20,60,.6*op);c.restore();}
  for(const sd of [-1,1]){c.save();c.translate(540+sd*(105+op*190),990);c.fillStyle=LG(c,-105,0,105,0,[[0,'#2a2030'],[1,'#141018']]);c.fillRect(-105,-430,210,860);c.fillStyle='#c9a45a';c.fillRect(sd*-90,-20,10,60);c.restore();}
  scr(c,540,560,260,'#ffb0d8',.5);c.fillStyle='#d8c06a';c.fillRect(330,548,420,10);
  c.fillStyle=LG(c,0,1400,0,HH,[[0,'#2a2430'],[1,'#07060a']]);c.fillRect(0,1400,WW,HH-1400);c.fillStyle='rgba(255,47,142,.18)';c.fillRect(0,1400,WW,120);
  // канат
  const rp=o.rope||0;for(const x of [250,830]){c.fillStyle=LG(c,x-12,0,x+12,0,[[0,'#ffe9a8'],[.5,'#c9962a'],[1,'#6a4a10']]);c.fillRect(x-10,1330,20,230);c.beginPath();c.arc(x,1326,18,0,TAU);c.fill();}
  c.strokeStyle='#8a1030';c.lineWidth=20;c.lineCap='round';c.beginPath();c.moveTo(250,1360);if(rp<.5)c.quadraticCurveTo(540,1500,830,1360);else{c.quadraticCurveTo(300,1480,320,1560);}c.stroke();
  // очередь силуэтами
  for(let i=0;i<4;i++){c.save();c.globalAlpha=.85;c.fillStyle='#0b0a10';const x=40+i*60,y=1420+i*10;c.beginPath();c.ellipse(x,y-260,34,42,0,0,TAU);c.fill();RR(c,x-60,y-210,120,330,40);c.fill();c.restore();}
  // охранник: нормальный, без «Сопрано» — чёрное пальто, наушник
  figA(c,{x:880,y:1700,s:.6,f:'guard',e:'neutral',cloth:{k:'coat'},light:'#ff6ab0',la:.16,L:-1,look:[-.6,0]});
};
/* 7. VIP: Миша, Вадим, стол со сметой и договором */
function clubBG(c,t,ac='#ff2f8e',ac2='#38d6ff'){fillG(c,0,0,WW,HH,[[0,'#0b0612'],[1,'#030205']]);
  for(let i=0;i<5;i++){const a=-.9+i*.45+Math.sin(t*.8+i)*.25;beam(c,540+(i-2)*120,-40,Math.PI/2+a,.08,1600,i%2?ac:ac2,.5);}
  bokehs(c,t,26,200,1100,[ac,ac2,'#ffd27a'],2,16,64,.5);
  for(let i=0;i<9;i++){c.fillStyle='#07050a';const x=H1(i*5)*WW,y=900+H1(i*3)*120,b=Math.abs(Math.sin(t*6+i))*14;c.beginPath();c.ellipse(x,y-b,38,46,0,0,TAU);c.fill();RR(c,x-70,y+40-b,140,400,50);c.fill();}}
W8.p_vip=(c,t,o)=>{clubBG(c,t);
  // диван
  c.fillStyle=LG(c,0,820,0,1300,[[0,'#7a1028'],[1,'#2a040c']]);RR(c,-40,820,1160,520,120);c.fill();c.fillStyle='rgba(255,255,255,.08)';for(let i=0;i<9;i++)c.fillRect(40+i*120,840,6,300);
  personA(c,{x:440,y:860,s:1.08,f:'misha',e:o.mishaE||'smile',mo:o.mt?talk(t,1):0,light:'#ff6ab0',la:.2,L:1,cloth:{k:'shirt',shirt:'#1d6f6a',chain:1},sw:128,bt:520});
  personA(c,{x:860,y:900,s:.98,f:'vadim',e:o.vadE||'neutral',light:'#5ad0ff',la:.2,L:-1,cloth:{k:'sweater',col:'#4a5260',collar:'#e9e6df'},sw:118,bt:520,look:[-.5,0]});
  // стол
  quad(c,[[60,1300],[1020,1300],[1180,1920],[-100,1920]],LG(c,0,1300,0,1920,[[0,'#1c1820'],[1,'#07060a']]));c.fillStyle='rgba(255,47,142,.12)';c.fillRect(0,1300,WW,30);
  // бутылка без этикетки, бокалы
  c.save();c.translate(180,1380);c.fillStyle='#0f2a1c';c.beginPath();c.moveTo(-36,0);c.lineTo(-36,-170);c.quadraticCurveTo(-36,-210,-12,-226);c.lineTo(-12,-300);c.lineTo(12,-300);c.lineTo(12,-226);c.quadraticCurveTo(36,-210,36,-170);c.lineTo(36,0);c.closePath();c.fill();
  c.fillStyle='#c9a45a';c.fillRect(-13,-300,26,46);c.fillStyle='rgba(255,255,255,.18)';c.fillRect(-26,-160,8,140);c.restore();
  for(const x of [300,880]){c.save();c.translate(x,1360);c.fillStyle='rgba(255,230,170,.55)';c.beginPath();c.moveTo(-18,-110);c.lineTo(18,-110);c.lineTo(10,-20);c.lineTo(-10,-20);c.closePath();c.fill();c.fillStyle='rgba(230,240,255,.4)';c.fillRect(-2,-20,4,40);c.fillRect(-18,18,36,4);c.restore();}
  // смета клуба
  paper(c,470,1545,480,360,-.06,(g,w,h)=>{tx(g,T10('smeta.title','КЛУБ · ОТКРЫТИЕ'),0,-h/2+46,{f:'J',w:700,s:22,c:'#222',ls:2});lines(g,-w/2+30,-h/2+80,w-60,5,26);
    tx(g,T10('smeta.left','ДО ОТКРЫТИЯ'),-w/2+30,40,{f:'J',w:700,s:18,c:'#333',al:'left'});tx(g,T10('smeta.days','30 ДНЕЙ'),w/2-30,40,{f:'J',w:700,s:22,c:'#111',al:'right'});
    tx(g,T10('smeta.hole','НЕ ХВАТАЕТ'),-w/2+30,110,{f:'J',w:700,s:20,c:'#c0182e',al:'left'});tx(g,T10('smeta.sum','600 000 $'),w/2-30,112,{f:'J',w:700,s:34,c:'#c0182e',al:'right'});
    if(o.ul){g.fillStyle='rgba(230,40,50,.8)';g.fillRect(-w/2+30,128,(w-60)*cl(o.ul),5);}},{col:'#efeadd'});
  // договор с ручкой
  paper(c,930,1790,420,330,.12,(g,w,h)=>{tx(g,T10('deal.title','ДОГОВОР О ДОЛЕ'),0,-h/2+44,{f:'J',w:700,s:20,c:'#222',ls:2});lines(g,-w/2+30,-h/2+76,w-60,6,22);
    g.fillStyle='#333';g.fillRect(-w/2+30,90,150,2);g.fillRect(30,90,150,2);tx(g,T10('deal.s1','М. Андреев'),-w/2+105,116,{f:'M',w:500,s:14,c:'#555'});tx(g,T10('deal.s2','В. ...'),105,116,{f:'M',w:500,s:14,c:'#555'});
    signature(g,-w/2+100,70,.42,o.sig||0);signature(g,108,72,.38,o.sig2||0,'#2a2a2a');},{col:'#f2eee4'});
  const pk=o.pen||0;pen(c,lp(1100,910,eo(pk)),lp(1960,1790,eo(pk)),lp(-.9,-2.4,eo(pk)),.7);
};
/* 8. туалет клуба: зеркало, лампа мигает, остатки и купюра не в фокусе */
W8.p_wc=(c,t,o)=>{const fl=o.flick?(((t*7.3)%1)<.12?.35:1):1,b=o.bass?Math.pow(Math.max(0,Math.cos(t*TAU*105.5/60)),8):0;
  fillG(c,0,0,WW,HH,[[0,'#0f1416'],[1,'#050607']]);tilesG(c,0,0,WW,1500,'#1e2a2c','#0f1718',90);
  c.save();c.globalAlpha=fl;scr(c,540,180,700,'#d9f2ff',.45);c.restore();c.fillStyle=`rgba(230,248,255,${fl})`;RR(c,300,150,480,26,13);c.fill();
  // зеркало
  c.save();c.translate(b*3*Math.sin(t*80),0);c.fillStyle='#0a0c0d';RR(c,180,260,720,980,10);c.fill();c.beginPath();c.rect(200,280,680,940);c.clip();
  fillG(c,200,280,680,940,[[0,'#1f2a2d'],[1,'#0d1314']]);tilesG(c,200,280,880,1220,'#273436','#182224',70);c.fillStyle='#2a1c18';c.fillRect(640,420,180,800);c.fillStyle='#c9a45a';c.fillRect(800,800,10,40);
  personA(c,{x:500,y:690,s:1.55,f:'max',e:o.maxE||'smirk',light:'#cfefff',la:.18*fl,L:-1,cloth:{k:'suit',jacket:'#1e2430',shirt:'#eef0f2',open:true},sw:120,bt:520,blink:o.bl||0,look:[0,o.up?-.6:0]});
  if(o.rub){const k=o.rub;c.save();c.translate(lp(660,545,k),lp(1150,760,k));c.rotate(-.5);c.fillStyle=tk('#1e2430',-.1);RR(c,-50,40,100,260,40);c.fill();c.fillStyle='#d9a688';RR(c,-34,-30,68,90,30);c.fill();c.restore();}
  c.fillStyle=LG(c,200,280,880,280,[[0,'rgba(255,255,255,.08)'],[.4,'rgba(255,255,255,0)'],[.55,'rgba(255,255,255,.05)'],[1,'rgba(255,255,255,0)']]);c.fillRect(200,280,680,940);
  c.fillStyle=`rgba(10,14,16,${(1-fl)*.5})`;c.fillRect(200,280,680,940);c.restore();
  // столешница и раковина
  quad(c,[[0,1300],[WW,1300],[WW,1920],[0,1920]],LG(c,0,1300,0,1920,[[0,'#262d30'],[1,'#0a0d0e']]));c.fillStyle='rgba(255,255,255,.06)';for(let i=0;i<8;i++)c.fillRect(0,1320+i*70,WW,2);
  c.fillStyle='#d8dde0';c.beginPath();c.ellipse(820,1360,170,50,0,0,TAU);c.fill();c.fillStyle='#9aa3a8';c.beginPath();c.ellipse(820,1370,140,36,0,0,TAU);c.fill();
  c.fillStyle='#b8c0c6';RR(c,800,1200,40,140,10);c.fill();RR(c,760,1200,120,30,12);c.fill();
  blurOn(c,9,g=>{g.save();g.globalAlpha=.8;g.fillStyle='rgba(245,245,245,.9)';for(let i=0;i<14;i++){g.beginPath();g.ellipse(360+i*14+H1(i)*20,1620+H1(i*4)*40,10+H1(i*2)*14,4,0,0,TAU);g.fill();}g.restore();
    g.save();g.translate(480,1720);g.rotate(-.25);g.fillStyle='#4f6a4a';RR(g,-160,-18,320,36,18);g.fill();g.fillStyle='#7d9a76';g.fillRect(-160,-18,320,10);g.restore();});
};
/* 9. Юля ночью */
W8.p_yulia=(c,t,o)=>{fillG(c,0,0,WW,HH,[[0,'#0b1222'],[1,'#1a1020']]);bokehs(c,t,30,100,1300,['#ffb35a','#ff5a5a','#7ab8ff','#fff0c0'],5,20,90,.55);
  c.fillStyle=LG(c,0,1100,0,HH,[[0,'rgba(0,0,0,0)'],[1,'rgba(0,0,0,.6)']]);c.fillRect(0,1100,WW,HH-1100);
  personA(c,{x:540,y:o.cy||780,s:o.s||2.1,f:'yulia',e:o.e||'smile',mo:o.mt?talk(t,1):0,light:'#ffb070',la:.2,L:1,cloth:{k:'parka'},sw:110,bt:520,blink:((t*.6)%4)<.12?1:0,look:o.look||[0,0]});
};
/* 10. акция у бутика: видоискатель, «деньги» падают, потом мигалки */
W8.p_action=(c,t,o)=>{fillG(c,0,0,WW,HH,[[0,'#0a0d18'],[1,'#05060a']]);const pol=o.pol||0,blu=pol>0&&((t*5)%1)<.5;
  // фасад бутика
  c.fillStyle='#1d1a1c';c.fillRect(0,0,WW,1350);c.fillStyle='#e7dcc4';c.fillRect(120,240,840,60);tx(c,T10('shop','MAISON'),540,286,{f:'P',w:700,s:46,c:'#1a1510',ls:12});
  c.fillStyle=LG(c,0,330,0,1150,[[0,'#ffe8c0'],[1,'#d6a86a']]);c.fillRect(150,330,780,820);
  for(let i=0;i<3;i++){const x=290+i*250;c.fillStyle='rgba(60,40,30,.6)';c.beginPath();c.ellipse(x,520,30,38,0,0,TAU);c.fill();RR(c,x-56,560,112,420,30);c.fill();}
  c.fillStyle='rgba(255,255,255,.18)';c.beginPath();c.moveTo(150,330);c.lineTo(330,330);c.lineTo(150,800);c.fill();c.fillStyle='#120f12';c.fillRect(140,1150,800,30);
  c.fillStyle=LG(c,0,1300,0,HH,[[0,'#2a2630'],[1,'#08070a']]);c.fillRect(0,1300,WW,HH-1300);
  // активисты: в масках, Юля с плакатом
  figA(c,{x:220,y:1760,s:.62,f:'st2',e:'neutral',cloth:{k:'hoodie',col:'#262a33'},light:'#ffcf8a',la:.2,L:1,mask:1});
  figA(c,{x:860,y:1780,s:.64,f:'clerk',e:'neutral',cloth:{k:'hoodie',col:'#3a2a2a'},light:'#ffcf8a',la:.2,L:-1});
  figA(c,{x:540,y:1820,s:.7,f:'yulia',e:'smile',cloth:{k:'parka'},light:'#ffcf8a',la:.22,L:-1,look:[0,0]});
  c.save();c.translate(540,1140);c.rotate(Math.sin(t*2)*.03);c.fillStyle='#f4f1ea';c.fillRect(-300,-70,600,140);c.strokeStyle='#d11';c.lineWidth=6;c.strokeRect(-290,-60,580,120);
  tx(c,T10('banner','ДЕНЬГИ — ЧЕПУХА'),0,22,{f:'O',w:700,s:62,c:'#c01020'});c.fillStyle='#5a3a24';c.fillRect(-300,60,10,200);c.fillRect(290,60,10,200);c.restore();
  // фальшивые деньги падают
  for(let i=0;i<34;i++){const ph=(t*.35+H1(i*2.1))%1,x=H1(i*3.7)*WW+Math.sin(t*2+i)*40,y=-80+ph*1900,r=t*2+i;c.save();c.translate(x,y);c.rotate(r);c.scale(1,Math.abs(Math.sin(r*1.3))+.2);c.fillStyle='#8fae86';c.fillRect(-46,-20,92,40);c.fillStyle='#5f7d58';c.fillRect(-14,-14,28,28);c.restore();}
  if(pol>0){c.save();c.globalCompositeOperation='screen';c.fillStyle=blu?`rgba(40,90,255,${.42*pol})`:`rgba(255,30,40,${.42*pol})`;c.fillRect(0,0,WW,HH);c.restore();
    c.save();c.translate(lp(1500,820,eo(pol)),1520);c.fillStyle='#e9ecef';RR(c,-330,-150,660,170,40);c.fill();c.fillStyle='#1d4fa8';c.fillRect(-330,-90,660,34);tx(c,T10('police','ПОЛИЦИЯ'),0,-62,{f:'O',w:700,s:30,c:'#fff',ls:3});
    c.fillStyle='#1a1a1e';c.beginPath();c.arc(-200,20,52,0,TAU);c.arc(200,20,52,0,TAU);c.fill();glowDot(c,-60,-170,60,blu?'#3a6aff':'#ff2a30',1);glowDot(c,60,-170,60,blu?'#ff2a30':'#3a6aff',1);c.restore();}
};
/* видоискатель поверх кадра */
function viewfinder(c,t,a=1){c.save();c.globalAlpha=a;c.strokeStyle='rgba(255,255,255,.85)';c.lineWidth=5;const m=70,l=90;for(const [x,y,dx,dy] of [[m,260,1,1],[WW-m,260,-1,1],[m,1500,1,-1],[WW-m,1500,-1,-1]]){c.beginPath();c.moveTo(x,y+dy*l);c.lineTo(x,y);c.lineTo(x+dx*l,y);c.stroke();}
  if((t*2)%1<.6){c.fillStyle='#ff2a2a';c.beginPath();c.arc(110,320,14,0,TAU);c.fill();}tx(c,'REC',135,330,{f:'J',w:700,s:30,al:'left',c:'#fff'});
  c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=3;c.strokeRect(WW-190,302,70,32);c.fillStyle='rgba(255,255,255,.7)';c.fillRect(WW-186,306,44,24);c.fillRect(WW-118,312,6,12);
  c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=2;c.beginPath();c.moveTo(540,860);c.lineTo(540,900);c.moveTo(520,880);c.lineTo(560,880);c.stroke();c.restore();}
/* 11. бег по ночной улице */
W8.p_run=(c,t,o)=>{fillG(c,0,0,WW,HH,[[0,'#05070e'],[1,'#0b0b12']]);const HZ=820;
  for(let i=0;i<24;i++){const z=((i*300-t*2400)%7200+7200)%7200+120,k=900/z,sd=i%2?1:-1;const x=540+sd*700*k,y=HZ+300*k;c.fillStyle='#14121a';c.fillRect(x-(sd>0?0:420*k),y-1400*k,420*k,1400*k);
    for(let j=0;j<6;j++){if(H2(i,j)>.5)continue;c.fillStyle='rgba(255,210,140,.6)';c.fillRect(x+(sd>0?60:-360)*k+((j%2)*120)*k,y-(1250-Math.floor(j/2)*300)*k,70*k,90*k);}glowDot(c,x-sd*60*k,y-900*k,Math.max(4,160*k),'#ffcf80',.7);}
  c.fillStyle=LG(c,0,HZ,0,HH,[[0,'#1a1820'],[1,'#050407']]);c.fillRect(0,HZ+60,WW,HH);
  for(let i=0;i<10;i++){const z=((i*500-t*2400)%5000+5000)%5000+100,k=900/z;c.fillStyle=`rgba(255,220,180,${Math.min(.5,k*.6)})`;c.fillRect(540-6*k,HZ+300*k,12*k,160*k);}
  figA(c,{x:540+Math.sin(t*3)*30,y:1500,s:.62,f:'yulia',e:'smile',pose:'run',t,cloth:{k:'parka'},light:'#ffcf80',la:.2,L:1,flip:false});
  const pol=.6+.4*Math.sin(t*12);c.save();c.globalCompositeOperation='screen';c.fillStyle=((t*5)%1)<.5?`rgba(40,90,255,${.25*pol})`:`rgba(255,30,40,${.25*pol})`;c.fillRect(0,0,WW,HH);c.restore();
};
/* 12. машина: Юля везёт в детскую больницу */
W8.p_car=(c,t,o)=>{const hk=o.hosp||0;fillG(c,0,0,WW,1150,[[0,'#9cc0de'],[1,'#e9e4d8']]);
  // больница впереди
  c.save();c.translate(540,1020);c.scale(lp(.55,1.1,hk),lp(.55,1.1,hk));c.fillStyle='#f0e2c8';c.fillRect(-460,-520,920,520);c.fillStyle='#e7c98f';c.fillRect(-460,-560,920,40);
  for(let j=0;j<4;j++)for(let i=0;i<8;i++){c.fillStyle='#8fb6d6';c.fillRect(-420+i*108,-480+j*110,60,74);c.fillStyle='rgba(255,255,255,.5)';c.fillRect(-420+i*108,-480+j*110,60,10);}
  c.fillStyle='#ffcf3a';c.beginPath();c.arc(-330,-330,70,0,TAU);c.fill();for(let i=0;i<12;i++){const a=i/12*TAU;c.strokeStyle='#ffcf3a';c.lineWidth=10;c.beginPath();c.moveTo(-330+Math.cos(a)*84,-330+Math.sin(a)*84);c.lineTo(-330+Math.cos(a)*112,-330+Math.sin(a)*112);c.stroke();}
  for(const [r,col] of [[150,'#e43'],[130,'#f93'],[110,'#fd4'],[90,'#5b5'],[70,'#49d']]){c.strokeStyle=col;c.lineWidth=18;c.beginPath();c.arc(280,-120,r,Math.PI,TAU);c.stroke();}
  c.fillStyle='#fff';RR(c,-300,-640,600,70,10);c.fill();tx(c,T10('hosp','ДЕТСКАЯ БОЛЬНИЦА'),0,-592,{f:'O',w:700,s:44,c:'#2a6db8',ls:3});c.fillStyle='#2a6db8';c.fillRect(-90,-140,180,140);c.restore();
  for(let i=0;i<6;i++)tree(c,40+i*200,1150,2.2,'#5f8f50');
  fillG(c,0,1100,WW,300,[[0,'#7a7670'],[1,'#4a4640']]);
  // салон: лобовое стекло, панель
  c.fillStyle='#16171b';c.beginPath();c.moveTo(0,0);c.lineTo(WW,0);c.lineTo(WW,120);c.quadraticCurveTo(540,60,0,120);c.closePath();c.fill();
  c.beginPath();c.moveTo(0,0);c.lineTo(110,0);c.lineTo(10,1300);c.lineTo(0,1300);c.fill();c.beginPath();c.moveTo(WW,0);c.lineTo(WW-110,0);c.lineTo(WW-10,1300);c.lineTo(WW,1300);c.fill();
  fillG(c,0,1260,WW,660,[[0,'#24252b'],[1,'#0a0a0d']]);c.fillStyle='rgba(255,255,255,.06)';c.beginPath();c.ellipse(540,1290,560,40,0,0,TAU);c.fill();
  // зеркало заднего вида и подвеска
  c.fillStyle='#0d0d10';RR(c,440,130,200,70,20);c.fill();c.strokeStyle='#333';c.lineWidth=3;c.beginPath();c.moveTo(540,200);c.lineTo(540+Math.sin(t*2)*16,300);c.stroke();c.fillStyle='#e4402f';c.beginPath();c.arc(540+Math.sin(t*2)*16,312,16,0,TAU);c.fill();
  // руль Юли слева (без рук)
  c.strokeStyle='#0c0c0f';c.lineWidth=40;c.beginPath();c.arc(150,1600,260,Math.PI*1.1,Math.PI*1.9);c.stroke();
  c.fillStyle='rgba(255,255,255,.06)';c.beginPath();c.moveTo(120,0);c.lineTo(400,0);c.lineTo(200,1260);c.lineTo(60,1260);c.fill();
};
/* 13. костюм клоуна */
W8.p_costume=(c,t,o)=>{fillG(c,0,0,WW,HH,[[0,'#e8efe9'],[1,'#c7d3cc']]);tilesG(c,0,1200,WW,HH,'#d4ddd6','#c2ccc5',120);
  for(let i=0;i<3;i++){c.fillStyle='rgba(255,255,255,.6)';c.fillRect(80+i*330,180,200,600);}
  personA(c,{x:780,y:720,s:1.25,f:'nurse',e:'smile',light:'#ffffff',la:.1,L:1,cloth:{k:'scrub'},sw:118,bt:520});
  const k=o.k||0;c.save();c.translate(lp(500,540,k),lp(1150,1050,k));c.scale(lp(1,1.25,k),lp(1,1.25,k));c.rotate(Math.sin(t*2)*.04);
  c.strokeStyle='#888';c.lineWidth=8;c.beginPath();c.moveTo(0,-560);c.lineTo(0,-610);c.arc(0,-630,20,Math.PI/2,-Math.PI*1.2,true);c.stroke();c.beginPath();c.moveTo(-200,-470);c.lineTo(0,-560);c.lineTo(200,-470);c.stroke();
  const p=new Path2D();p.moveTo(-170,-480);p.lineTo(170,-480);p.lineTo(320,-200);p.lineTo(240,-160);p.lineTo(170,-300);p.lineTo(200,320);p.lineTo(30,320);p.lineTo(0,60);p.lineTo(-30,320);p.lineTo(-200,320);p.lineTo(-170,-300);p.lineTo(-240,-160);p.lineTo(-320,-200);p.closePath();
  c.fillStyle='#f2c22e';c.fill(p);c.save();c.clip(p);c.fillStyle='#e4402f';for(let y=-480;y<340;y+=70)for(let x=-320+((y/70)&1)*35;x<340;x+=70){c.beginPath();c.arc(x,y,15,0,TAU);c.fill();}c.fillStyle=LG(c,-300,0,300,0,[[0,'rgba(255,255,255,.18)'],[1,'rgba(0,0,0,.25)']]);c.fillRect(-340,-500,680,840);c.restore();
  const n=16;for(const [r,col] of [[190,'#ffffff'],[150,'#5fb7e8']]){c.beginPath();for(let q=0;q<=n;q++){const a=Math.PI*(1+q/n),R=q%2?r:r*.8;c.lineTo(Math.cos(a)*R,-480-Math.sin(a)*R*.3);}for(let q=n;q>=0;q--){const a=Math.PI*(q/n),R=q%2?r:r*.8;c.lineTo(Math.cos(a)*R,-480+Math.sin(a)*R*.35);}c.closePath();c.fillStyle=col;c.fill();}
  c.restore();
  // нос летит в камеру
  const nk=o.nose||0;if(nk>0){const s=lp(40,900,E.inC(nk));c.fillStyle=RG(c,540-s*.2,960-s*.2,s*.05,s*1.25,[[0,'#ff7a7a'],[.6,'#d81c24'],[1,'#8a0a10']]);c.beginPath();c.arc(540,960,s,0,TAU);c.fill();}
};
/* 14. больничный туалет: Лёша у окна, зеркало с клоуном */
W8.p_hwc=(c,t,o)=>{fillG(c,0,0,WW,HH,[[0,'#cfdcd6'],[1,'#8fa39a']]);tilesG(c,0,0,WW,1500,'#d7e3dd','#c3d2cb',96);
  // окно с матовым стеклом, приоткрыто
  c.fillStyle='#f2f5f4';c.fillRect(560,180,440,620);c.fillStyle=LG(c,0,200,0,780,[[0,'#eef6ff'],[1,'#c8d8e6']]);c.fillRect(580,200,400,580);c.fillStyle='rgba(255,255,255,.55)';c.fillRect(580,200,180,580);
  c.strokeStyle='#d0d6d4';c.lineWidth=14;c.strokeRect(580,200,400,580);c.beginPath();c.moveTo(780,200);c.lineTo(780,780);c.stroke();scr(c,780,480,560,'#ffffff',.35);
  // зеркало слева: Макс-клоун
  c.fillStyle='#e7ece9';c.fillRect(40,300,420,560);c.save();c.beginPath();c.rect(56,316,388,528);c.clip();fillG(c,56,316,388,528,[[0,'#c6d4cd'],[1,'#9db2a8']]);
  personA(c,{x:250,y:560,s:.95,f:'clown',e:o.clE||'sad',light:'#ffffff',la:.1,L:1,cloth:{k:'clown'},sw:118,bt:520});c.fillStyle='rgba(255,255,255,.12)';c.fillRect(56,316,388,528);c.restore();
  c.fillStyle='#f2f4f3';c.beginPath();c.ellipse(250,940,190,40,0,0,TAU);c.fill();
  // Лёша
  personA(c,{x:780,y:o.ly||980,s:o.ls||1.25,f:{...AX.lyosha,mask:0},e:o.lyE||'neutral',mo:o.lt?talk(t,1,.9):0,light:'#ffffff',la:.12,L:-1,cloth:{k:'flannel'},sw:96,bt:520,look:[-.4,0]});
  // сигарета и дым у окна
  const cx=o.cigX||930,cy=o.cigY||1180;c.save();c.translate(cx,cy);c.rotate(-.5);c.fillStyle='#f4f1e8';c.fillRect(0,-5,70,10);c.fillStyle='#d9a066';c.fillRect(0,-5,20,10);glowDot(c,70,0,10,'#ff6a20',.9);c.restore();
  c.save();c.globalAlpha=.5;for(let i=0;i<10;i++){const ph=(t*.25+i/10)%1,x=cx+30+Math.sin(ph*6+i)*30*ph+ph*40,y=cy-30-ph*500;c.fillStyle=`rgba(255,255,255,${(1-ph)*.35})`;c.beginPath();c.arc(x,y,16+ph*60,0,TAU);c.fill();}c.restore();
  fillG(c,0,1500,WW,420,[[0,'#7f938a'],[1,'#3f4a45']]);
};
/* 15. вокзал ночью: поезд, часы, Юля */
W8.p_station=(c,t,o)=>{fillG(c,0,0,WW,HH,[[0,'#070a14'],[1,'#141824']]);
  for(let i=0;i<6;i++){c.strokeStyle='rgba(120,140,170,.25)';c.lineWidth=10;c.beginPath();c.arc(540,1800,600+i*260,Math.PI*1.05,Math.PI*1.95);c.stroke();}
  for(let i=0;i<8;i++){const x=80+i*130;glowDot(c,x,260+Math.abs(i-3.5)*30,60,'#ffe6b0',.6);}
  // поезд слева в перспективе
  quad(c,[[-100,520],[420,700],[420,1180],[-100,1380]],LG(c,-100,0,420,0,[[0,'#c21a28'],[1,'#7a0e18']]));quad(c,[[-100,660],[420,780],[420,860],[-100,820]],'#1a1c22');
  for(let i=0;i<5;i++){const x0=-80+i*100,y0=lp(690,800,i/5);c.fillStyle='rgba(255,230,180,.7)';c.fillRect(x0,y0,60,40);}c.fillStyle='#dfe3e8';quad(c,[[-100,1260],[420,1130],[420,1180],[-100,1380]],'#d6dadf');
  // часы
  c.save();c.translate(780,420);c.fillStyle='#efe9da';c.beginPath();c.arc(0,0,90,0,TAU);c.fill();c.strokeStyle='#222';c.lineWidth=8;c.stroke();c.lineWidth=6;c.beginPath();c.moveTo(0,0);c.lineTo(0,-60);c.moveTo(0,0);c.lineTo(46,18);c.stroke();c.restore();
  fillG(c,0,1180,WW,740,[[0,'#3a3e48'],[1,'#121318']]);c.fillStyle='#e6c64a';c.fillRect(0,1190,WW,14);
  fog(c,t,1100,{n:8,sp:20,h:120,r:520,a:.12,seed:7});
  personA(c,{x:o.x||600,y:o.cy||780,s:o.s||1.9,f:'yulia',e:o.e||'sad',mo:o.mt?talk(t,1):0,light:'#ffe0b0',la:.18,L:-1,cloth:{k:'parka'},sw:110,bt:520,blink:((t*.6)%4)<.12?1:0});
};
/* 16. кабинет шефа: карта под посёлком — полигон */
W8.p_boss=(c,t,o)=>{fillG(c,0,0,WW,HH,[[0,'#2a2622'],[1,'#141210']]);for(let i=0;i<8;i++){c.fillStyle=i%2?'#3a2c22':'#33271e';c.fillRect(i*140,0,140,1000);c.fillStyle='rgba(0,0,0,.25)';c.fillRect(i*140,0,4,1000);}
  c.fillStyle='#8fa0b0';c.fillRect(640,160,360,520);fillG(c,656,176,328,488,[[0,'#9aa8b5'],[1,'#c3ccd3']]);c.fillStyle='#3a2c22';c.fillRect(812,170,10,500);c.fillRect(650,420,360,10);
  personA(c,{x:540,y:620,s:1.25,f:'boss',e:o.bossE||'neutral',mo:o.bt?talk(t,1):0,light:'#ffd8a8',la:.16,L:-1,cloth:{k:'suit',jacket:'#2f323a',shirt:'#e8eaee',tie:'#6a1f2a'},sw:128,bt:520});
  quad(c,[[-60,1150],[1140,1150],[1300,1920],[-220,1920]],LG(c,0,1150,0,1920,[[0,'#4a2e1c'],[1,'#1e120a']]));
  // карта: старая подложка + план посёлка + красная зона
  paper(c,540,1460,820,560,-.04,(g,w,h)=>{g.fillStyle='#e8dcb8';g.fillRect(-w/2,-h/2,w,h);g.strokeStyle='rgba(90,70,40,.35)';g.lineWidth=2;for(let i=0;i<14;i++){g.beginPath();g.moveTo(-w/2,-h/2+i*40);g.bezierCurveTo(-100,-h/2+i*40+30,100,-h/2+i*40-30,w/2,-h/2+i*40);g.stroke();}
    const k=o.zone||0;g.save();g.globalAlpha=k;g.fillStyle='rgba(200,20,30,.28)';g.beginPath();g.ellipse(40,10,300,170,-.2,0,TAU);g.fill();g.strokeStyle='#c0182e';g.lineWidth=5;g.setLineDash([16,10]);g.stroke();g.setLineDash([]);
    g.strokeStyle='rgba(192,24,46,.55)';g.lineWidth=3;for(let i=-12;i<12;i++){g.beginPath();g.moveTo(-260+i*30,180);g.lineTo(-100+i*30,-180);g.stroke();}
    tx(g,T10('zone','ПОЛИГОН ХИМ. БОЕПРИПАСОВ · 1930-е'),40,-200,{f:'J',w:700,s:22,c:'#a0101e'});
    g.fillStyle='#a0101e';g.beginPath();g.moveTo(40,-60);g.lineTo(90,30);g.lineTo(-10,30);g.closePath();g.fill();tx(g,'!',40,22,{f:'O',w:700,s:52,c:'#e8dcb8'});g.restore();
    g.globalAlpha=1-k*.4;for(let i=0;i<10;i++){const x=-300+(i%5)*130,y=-110+Math.floor(i/5)*170;g.strokeStyle='#2f6a3a';g.lineWidth=3;g.strokeRect(x,y,70,52);g.fillStyle='rgba(60,140,70,.25)';g.fillRect(x,y,70,52);}
    tx(g,T10('maq','РАЙ МИЛЛИОНЕРОВ'),-150,-230,{f:'P',w:700,s:22,c:'#2f6a3a'});},{col:'#e8dcb8'});
  // договор с твоей подписью
  paper(c,800,1780,460,320,.16,(g,w,h)=>{tx(g,T10('doc.title','КРЕДИТНЫЙ ДОГОВОР'),0,-h/2+44,{f:'J',w:700,s:20,c:'#222',ls:2});tx(g,T10('doc.no','№ 1407/12'),0,-h/2+72,{f:'J',w:500,s:14,c:'#555'});lines(g,-w/2+30,-h/2+96,w-60,5,22);
    g.fillStyle='#333';g.fillRect(-w/2+30,90,180,2);tx(g,T10('doc.sign','Подпись заёмщика'),-w/2+120,116,{f:'M',w:500,s:13,c:'#666'});signature(g,-w/2+120,70,.5,1);
    if(o.circle){g.strokeStyle='rgba(220,30,40,.85)';g.lineWidth=6;g.beginPath();for(let i=0;i<=60*o.circle;i++){const a=-1+i/60*TAU;g.lineTo(-w/2+120+Math.cos(a)*120,70+Math.sin(a)*46);}g.stroke();}},{col:'#f2eee4'});
};
/* 17. пустой клуб Миши: голые стены, Миша с сумками */
W8.p_empty=(c,t,o)=>{fillG(c,0,0,WW,HH,[[0,'#5a5853'],[1,'#2a2926']]);for(let j=0;j<8;j++)for(let i=0;i<5;i++){c.fillStyle=`rgba(0,0,0,${.05+.08*H2(i,j)})`;c.fillRect(i*216+2,j*160+2,212,156);}
  c.fillStyle=LG(c,0,1250,0,HH,[[0,'#3c3a36'],[1,'#151412']]);c.fillRect(0,1250,WW,HH-1250);c.fillStyle='rgba(120,140,160,.25)';c.beginPath();c.ellipse(300,1600,220,40,0,0,TAU);c.fill();
  for(const x of [260,560,860]){c.strokeStyle='#111';c.lineWidth=3;c.beginPath();c.moveTo(x,0);c.quadraticCurveTo(x+20,180,x,300);c.stroke();glowDot(c,x,310,90,'#ffe0a0',.8);c.fillStyle='#fff6d8';c.beginPath();c.arc(x,312,12,0,TAU);c.fill();}
  c.fillStyle='#2a2826';c.save();c.translate(940,1300);c.rotate(.05);c.fillRect(-20,-700,14,700);c.fillRect(80,-700,14,700);for(let i=0;i<8;i++)c.fillRect(-20,-80-i*85,114,10);c.restore();
  c.strokeStyle='rgba(20,20,20,.6)';c.lineWidth=4;c.beginPath();c.moveTo(0,420);c.bezierCurveTo(200,520,400,380,700,460);c.stroke();
  if(o.full!==false){figA(c,{x:500,y:1700,s:.86,f:'misha',e:o.mishaE||'smirk',mo:o.mt?talk(t,1):0,cloth:{k:'jacket',col:'#3d4148',tee:'#222'},light:'#ffe0a0',la:.16,L:-1});
    for(const [x,s] of [[290,1],[720,.9]]){c.save();c.translate(x,1640);c.scale(s,s);shade(c,0,70,170,26,.5);c.fillStyle=LG(c,-150,0,150,0,[[0,'#3a3a40'],[1,'#16161a']]);RR(c,-150,-60,300,130,40);c.fill();c.strokeStyle='#0c0c10';c.lineWidth=14;c.beginPath();c.moveTo(-70,-60);c.quadraticCurveTo(0,-150,70,-60);c.stroke();c.restore();}}
  if(o.bag)moneyBag(c,540,1650,1,1);
};
/* 18. Вадим кричит */
W8.p_vadim=(c,t,o)=>{fillG(c,0,0,WW,HH,[[0,'#2a2a30'],[1,'#0e0e12']]);c.fillStyle='#3a3530';c.fillRect(0,300,WW,700);c.fillStyle='rgba(255,220,160,.5)';c.fillRect(760,340,200,300);scr(c,860,480,500,'#ffd8a0',.3);
  const sh_=o.e==='shout'?Math.sin(t*40)*4:0;personA(c,{x:540+sh_,y:820,s:2.05,f:'vadim',e:o.e||'shout',mo:o.mt?talk(t,1,1.3):0,light:'#ffcf9a',la:.2,L:1,cloth:{k:'sweater',col:'#4a5260',collar:'#e9e6df'},sw:118,bt:520,sweat:1});
};
/* 19. телефон: «Вадим», гудки, гаснет */
W8.p_phone=(c,t,o)=>{fillG(c,0,0,WW,HH,[[0,'#0a0a0e'],[1,'#030304']]);const off=o.off||0;
  c.save();c.translate(540,980);c.rotate(-.04);shade(c,10,620,420,60,.6);c.fillStyle='#0c0c0f';RR(c,-330,-640,660,1280,70);c.fill();c.strokeStyle='#2a2a30';c.lineWidth=6;c.stroke();
  c.save();c.beginPath();RR(c,-300,-610,600,1220,50);c.clip();fillG(c,-300,-610,600,1220,[[0,'#1d3a55'],[1,'#0c1622']]);
  c.fillStyle='#6a8aa8';c.beginPath();c.arc(0,-300,120,0,TAU);c.fill();c.fillStyle='#dfe8f0';tx(c,T10('call.v','В'),0,-262,{f:'O',w:700,s:120,c:'#e9f0f6'});
  tx(c,T10('call.name','Вадим'),0,-110,{f:'M',w:600,s:60,c:'#fff'});const st=o.st||0;tx(c,st<1?T10('call.ring','вызов…'):T10('call.no','не отвечает'),0,-40,{f:'M',w:500,s:34,c:st<1?'rgba(255,255,255,.7)':'#ff8a80'});
  const k=1+.06*Math.sin(t*9);c.fillStyle='#ff3b30';c.beginPath();c.arc(0,400,70*k,0,TAU);c.fill();c.save();c.translate(0,400);c.rotate(2.36);c.strokeStyle='#fff';c.lineWidth=12;c.lineCap='round';c.beginPath();c.moveTo(-24,0);c.quadraticCurveTo(0,-16,24,0);c.stroke();c.restore();
  c.fillStyle=`rgba(0,0,0,${off})`;c.fillRect(-300,-610,600,1220);c.restore();c.restore();
  if(off>.5)scr(c,540,980,400,'#3a5a80',.08*(1-off));
};
/* 20. далеко — хлопок: ночное окно, птицы срываются */
W8.p_far=(c,t,o)=>{fillG(c,0,0,WW,HH,[[0,'#04050a'],[1,'#020203']]);const k=o.k||0;
  c.save();c.globalAlpha=.75;nightCity(c,0,300,WW,1400,t,{cx:.55,sc:.8});c.restore();c.fillStyle='rgba(2,2,4,.55)';c.fillRect(0,0,WW,HH);
  if(k>0&&k<.12)scr(c,760,980,240,'#ffe0b0',(.12-k)*4);
  for(let i=0;i<9;i++){const p=Math.max(0,k-.05)*1.4,x=700+i*30+p*(200+i*80),y=1000-p*(300+H1(i)*500);if(k<.05){c.fillStyle='#0a0a0e';c.fillRect(680+i*28,1004,10,6);continue;}
    c.save();c.translate(x,y);c.strokeStyle='#0d0d12';c.lineWidth=5;const f=Math.sin(t*30+i)*10;c.beginPath();c.moveTo(-16,f);c.lineTo(0,0);c.lineTo(16,f);c.stroke();c.restore();}
  c.strokeStyle='#08080b';c.lineWidth=4;c.beginPath();c.moveTo(0,1010);c.quadraticCurveTo(540,1040,WW,1000);c.stroke();
};
/* 21. сумка долларов на сиденье */
W8.p_bag=(c,t,o)=>{fillG(c,0,0,WW,HH,[[0,'#121218'],[1,'#050507']]);c.fillStyle='#1e1e24';RR(c,-60,700,1200,1400,120);c.fill();for(let i=0;i<6;i++){c.fillStyle='rgba(0,0,0,.3)';c.fillRect(0,800+i*180,WW,6);}
  moneyBag(c,540,1250,1.4,1);
  const sw=((t*.6)%1);c.save();c.globalCompositeOperation='screen';c.fillStyle=LG(c,lp(-600,1600,sw),0,lp(-200,2000,sw),0,[[0,'rgba(255,190,110,0)'],[.5,'rgba(255,190,110,.35)'],[1,'rgba(255,190,110,0)']]);c.fillRect(0,0,WW,HH);c.restore();
  if(o.mem>0){c.save();c.globalAlpha=o.mem;c.fillStyle='rgba(240,236,230,.85)';c.fillRect(0,0,WW,HH);personA(c,{x:540,y:820,s:1.8,f:'lyosha',e:'smile',light:'#ffffff',la:.1,L:-1,cloth:{k:'flannel'},sw:96,bt:520});c.restore();}
};
/* 22. ночь длиннее: дорожки, чужие лица, провал */
W8.p_night=(c,t,o)=>{clubBG(c,t,'#ff2f8e','#8a5aff');const k=o.k||0;
  quad(c,[[-100,1250],[1180,1250],[1300,1920],[-220,1920]],LG(c,0,1250,0,1920,[[0,'#0c0b10'],[1,'#020203']]));
  blurOn(c,5,g=>{g.fillStyle='rgba(245,245,245,.85)';for(let i=0;i<3;i++){g.save();g.translate(380+i*160,1500+i*30);g.rotate(-.2);RR(g,-110,-7,220,14,7);g.fill();g.restore();}});
  const F=['st1','st2','guard'];for(let i=0;i<3;i++){const ph=k*1.2-i*.25;if(ph<=0)continue;const s=lp(1.2,3.2,cl(ph)),x=[260,800,540][i]+Math.sin(t*2+i)*40,y=[760,820,700][i];
    c.save();c.globalAlpha=cl(1-Math.abs(ph-.5)*1.6)*.8;headA(c,{x,y,s,f:F[i],e:i===1?'smile':'smirk',light:'#ff5ab0',la:.35,L:i%2?1:-1});c.restore();}
  if(o.str){const st=((t*9)%1)<.08;if(st){c.save();c.globalCompositeOperation='screen';c.fillStyle='rgba(255,255,255,.16)';c.fillRect(0,0,WW,HH);c.restore();}}
};
/* 23. утро: забытая сумка на диване */
W8.p_morning=(c,t,o)=>{fillG(c,0,0,WW,HH,[[0,'#d9d2c4'],[1,'#a39a8a']]);c.fillStyle='#f4efe4';c.fillRect(560,140,460,760);scr(c,790,520,700,'#fff3d8',.5);c.fillStyle='#c9bfae';c.fillRect(780,140,12,760);c.fillRect(560,500,460,12);
  for(let i=0;i<6;i++){c.save();c.globalCompositeOperation='screen';c.fillStyle='rgba(255,240,210,.12)';c.beginPath();c.moveTo(560+i*40,900);c.lineTo(600+i*40,900);c.lineTo(200+i*120,1920);c.lineTo(100+i*120,1920);c.fill();c.restore();}
  c.fillStyle=LG(c,0,1000,0,1500,[[0,'#6a2a30'],[1,'#3a1418']]);RR(c,-60,1000,1200,500,90);c.fill();fillG(c,0,1480,WW,440,[[0,'#5a5048'],[1,'#2a2420']]);
  moneyBag(c,620,1300,.9,0);
  for(const [x,y,a] of [[200,1600,.4],[330,1660,-1.2],[420,1580,.1],[860,1640,1.4]]){c.save();c.translate(x,y);c.rotate(a);c.fillStyle='rgba(20,60,30,.85)';RR(c,-24,-80,48,150,16);c.fill();c.fillRect(-9,-120,18,44);c.restore();}
  for(let i=0;i<14;i++){const x=H1(i*5)*WW,y=lp(100,900,H1(i*9)),ph=(t*.2+H1(i))%1;c.fillStyle=`rgba(255,255,255,${.5*Math.sin(ph*Math.PI)})`;c.fillRect(x+ph*40,y+ph*60,3,3);}
};
/* 24. реанимация: коридор, красная лампа, рисунок на стене */
W8.p_icu=(c,t,o)=>{fillG(c,0,0,WW,HH,[[0,'#0e1416'],[1,'#06090a']]);const HZ=880,lamp=o.lamp??1;
  quad(c,[[0,0],[380,700],[380,1080],[0,HH]],LG(c,0,0,380,0,[[0,'#2a3a3c'],[1,'#162022']]));quad(c,[[WW,0],[700,700],[700,1080],[WW,HH]],LG(c,WW,0,700,0,[[0,'#2a3a3c'],[1,'#162022']]));
  quad(c,[[0,HH],[380,1080],[700,1080],[WW,HH]],LG(c,0,1080,0,HH,[[0,'#1d2a2c'],[1,'#0b1011']]));quad(c,[[0,0],[380,700],[700,700],[WW,0]],'#101618');
  for(let i=0;i<4;i++){const y=lp(40,640,i/4),x0=lp(0,380,i/4),x1=lp(WW,700,i/4);c.fillStyle='rgba(200,230,230,.55)';c.fillRect(lp(x0,x1,.35),y,lp(x1,x0,.35)-lp(x0,x1,.35),lp(18,5,i/4));}
  c.fillStyle='#d8e2e2';c.fillRect(420,760,240,320);c.fillStyle='#b9c6c6';c.fillRect(538,760,4,320);tx(c,T10('icu','РЕАНИМАЦИЯ'),540,735,{f:'O',w:700,s:30,c:'#e8f0f0',ls:3});
  c.fillStyle=lamp>.5?'#ff2a2a':'#3a1a1a';RR(c,505,672,70,30,8);c.fill();if(lamp>.5)scr(c,540,688,260,'#ff2a2a',.6*lamp);
  c.save();c.globalAlpha=.85;c.fillStyle='#232d2f';RR(c,60,1350,330,60,10);c.fill();c.fillRect(80,1410,14,140);c.fillRect(350,1410,14,140);c.restore();
  kidDraw(c,840,820,.62,.06);
  c.fillStyle=`rgba(255,40,40,${.08*lamp})`;c.fillRect(0,0,WW,HH);
};
/* 25. приёмный покой: сумка на стойке */
W8.p_give=(c,t,o)=>{fillG(c,0,0,WW,HH,[[0,'#efe4d0'],[1,'#c9b89c']]);for(let i=0;i<5;i++)kidDraw(c,140+i*200,420+H1(i)*60,.42,(H1(i*3)-.5)*.3);
  scr(c,540,300,900,'#fff4dc',.4);
  personA(c,{x:540,y:1000,s:1.2,f:'nurse',e:o.e||'scared',light:'#fff0d0',la:.12,L:-1,cloth:{k:'scrub'},sw:118,bt:520,look:[0,.6]});
  quad(c,[[-60,1300],[1140,1300],[1140,1920],[-60,1920]],LG(c,0,1300,0,1920,[[0,'#f4efe6'],[1,'#c9c0b0']]));c.fillStyle='#d8cfbf';c.fillRect(-60,1300,1200,26);
  moneyBag(c,lp(540,540,1),lp(1180,1300,eo(o.k||1)),1.1,1);
};
/* 26. один: пустая комната, дождь, Москва вдали, красный нос на подоконнике */
W8.p_alone=(c,t,o)=>{fillG(c,0,0,WW,HH,[[0,'#06070c'],[1,'#030305']]);nightCity(c,140,220,940,1240,t,{cx:.6,sc:.9,rain:1});
  c.fillStyle='#0c0d12';c.fillRect(130,210,820,20);c.fillRect(130,1230,820,30);c.fillRect(530,220,14,1020);c.fillRect(140,700,800,12);
  for(let i=0;i<30;i++){const x=150+H1(i*3)*780,y=((H1(i*7)*1000+t*(80+H1(i)*120))%1000)+230;c.fillStyle='rgba(180,200,230,.35)';c.fillRect(x,y,2.5,18);}
  fillG(c,0,1260,WW,660,[[0,'#0b0b0f'],[1,'#030304']]);c.fillStyle='#141419';c.fillRect(100,1250,880,40);
  const nk=o.nose??1;if(nk>0){c.save();c.globalAlpha=nk;c.fillStyle=RG(c,612,1224,3,38,[[0,'#ff6a6a'],[.6,'#c81a22'],[1,'#5a0a10']]);c.beginPath();c.arc(620,1232,30,0,TAU);c.fill();scr(c,620,1232,120,'#ff3030',.12);c.restore();}
};
/* финальное затемнение и обрушение — оверлеем */
function crumble(c,k){if(k<=0)return;const g=TB.getContext('2d');reset(g);g.clearRect(0,0,WW,HH);g.drawImage(c.canvas,0,0,c.canvas.width,c.canvas.height,0,0,WW,HH);c.save();reset(c);c.fillStyle='#000';c.fillRect(0,0,WW,HH);
  const cols=6,rows=8;for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const w=WW/cols,h=HH/rows,d=Math.max(0,k*1.6-H1(i*7+j*3)*.6),y=d*d*1400,r=(H1(i+j*9)-.5)*d*1.2;
    c.save();c.translate(i*w+w/2,j*h+h/2+y);c.rotate(r);c.globalAlpha=cl(1-d*.8);c.drawImage(TB,i*w,j*h,w,h,-w/2,-h/2,w,h);c.restore();}c.restore();}

/* ================= HUD: место + иконки (работа · клуб · друг · Юля) ================= */
function icon10(c,k,x,y,s,st,pop){c.save();c.translate(x,y);const sc=s*(1+.35*pop);c.scale(sc,sc);
  c.fillStyle=st===1?'rgba(14,18,26,.72)':'rgba(14,18,26,.4)';RR(c,-34,-34,68,68,14);c.fill();c.strokeStyle=st===1?'rgba(255,255,255,.3)':'rgba(255,255,255,.12)';c.lineWidth=1.5;c.stroke();
  const col=st===1?'#ffffff':st>=2?'rgba(255,255,255,.45)':'rgba(255,255,255,.22)';c.strokeStyle=col;c.fillStyle=col;c.lineWidth=3;c.lineCap='round';c.lineJoin='round';
  if(k==='pass'){RR(c,-15,-12,30,36,4);c.stroke();c.beginPath();c.moveTo(-6,-12);c.lineTo(-6,-22);c.lineTo(6,-22);c.lineTo(6,-12);c.stroke();RR(c,-9,-5,10,11,2);c.fill();c.fillRect(3,-3,8,2.5);c.fillRect(3,2,8,2.5);c.fillRect(-9,11,20,2.5);}
  if(k==='club'){c.beginPath();c.moveTo(-18,18);c.lineTo(-18,-6);c.lineTo(0,-20);c.lineTo(18,-6);c.lineTo(18,18);c.closePath();c.stroke();c.beginPath();c.arc(0,4,7,0,TAU);c.stroke();c.beginPath();c.moveTo(-10,-26);c.lineTo(-14,-32);c.moveTo(10,-26);c.lineTo(14,-32);c.stroke();}
  if(k==='friend'){for(const sd of [-1,1]){c.save();c.translate(sd*9,4);c.rotate(sd*.32);c.beginPath();c.moveTo(-8,-18);c.lineTo(8,-18);c.lineTo(6,0);c.quadraticCurveTo(0,6,-6,0);c.closePath();c.stroke();c.beginPath();c.moveTo(0,3);c.lineTo(0,16);c.moveTo(-6,17);c.lineTo(6,17);c.stroke();c.restore();}}
  if(k==='cam'){RR(c,-20,-10,28,22,4);c.stroke();c.beginPath();c.moveTo(8,-4);c.lineTo(20,-10);c.lineTo(20,12);c.lineTo(8,6);c.stroke();c.beginPath();c.arc(-6,1,5,0,TAU);c.stroke();}
  c.restore();
  if(st>=2){const kk=cl(st-2);c.save();c.translate(x,y);c.strokeStyle='#ff2a3a';c.lineWidth=5*s;c.lineCap='round';c.shadowColor='rgba(255,40,60,.6)';c.shadowBlur=10;c.beginPath();c.moveTo(-30*s,30*s);c.lineTo(lp(-30,30,kk)*s,lp(30,-30,kk)*s);c.stroke();c.restore();}}
const HST=[];   // [иконка, время появления, время зачёркивания]
function hudState(t,i){const [_,on,off]=HST[i];if(t<on)return [0,0];const pop=Math.max(0,1-(t-on)/.35)*Math.sin(Math.min(1,(t-on)/.35)*Math.PI);if(off&&t>=off)return [2+cl((t-off)/.25),0];return [1,pop];}
hud=function(c,t,S){if(S.nohud)return;c.save();c.shadowColor='rgba(0,0,0,.75)';c.shadowBlur=10;if(S.hud&&S.hud[0]){c.fillStyle='#ff5a36';c.beginPath();c.arc(66,130,6,0,TAU);c.fill();
  tx(c,S.hud[0],84,138,{f:'J',w:500,s:22,ls:3,al:'left',c:'rgba(255,255,255,.92)'});}c.restore();
  const K=['pass','club','friend','cam'];K.forEach((k,i)=>{const [st,pop]=hudState(t,i);icon10(c,k,WW-70-(3-i)*80,134,.92,st,pop);});};
/* цитата Макса из фильма */
function maxQuote(c,t){if(t<QM.a-.05||t>QM.b+.35)return;const a=cl((t-QM.a+.05)/.12)*cl((QM.b+.35-t)/.2),two=t>QM.a+.98;c.save();c.globalAlpha=a;font(c,{f:'P',w:700,it:1,s:72});c.textAlign='center';c.textBaseline='middle';
  c.shadowColor='rgba(0,0,0,.9)';c.shadowBlur=24;c.fillStyle='#fff';if(!two)c.fillText(T10('maxq1','«Я всего добился сам.'),540,1590);else{c.fillText(T10('maxq2','«Я не виноват, что я'),540,1560);c.fillText(T10('maxq3','не инвалид и не урод»'),540,1645);}
  tx(c,T10('maxn','МАКС · ИЗ ФИЛЬМА'),540,1475,{f:'J',w:500,s:22,ls:6,c:'#ffb13b'});c.restore();}

/* ================= план ================= */
PLANG.pov10=S=>{let t=0;const nx=(b,o)=>{o.a=t;o.b=b;t=b;o.hh=1;S.push(o);return o;};const w=IDX,H=k=>[T10('hud.'+k)];
  const iA=(s,f)=>wa(w(s,f||0))-.05,iB=(s,f)=>wb(w(s,f||0));
  HST.length=0;HST.push(['pass',wa(w('киваешь')),wa(w('уволены'))],['club',wa(w('тянешься')),wa(w('ушли'))],['friend',wa(w('вадима')),wa(w('вадим',230))],['cam',wa(w('юля')),wa(w('калека'))]);
  // 1. глаза открываются: переговорная, все смотрят
  nx(iA('шеф'),{w:'p_meet',o:{blink:1,maq:false},hi:2,cam:[[0,540,900,1.12],[1,540,880,1.22]],hud:H('meet'),ov:(c,T,lt)=>blink(c,lt)});
  nx(iA('посёлок'),{w:'p_meet',o:(T)=>({talk:1,maq:false}),hi:2,tin:'push',cam:[[0,540,880,1.9],[1,540,860,2.2]],hud:H('meet')});
  nx(iA('нужен'),{w:'p_maq',o:(T,lt,u)=>({k:eio(u)}),hi:2,tin:'cut',cam:[[0,540,1040,1.05],[1,540,1000,1.22]],hud:H('meet')});
  nx(iA('ты',20),{w:'p_meet',o:(T,lt,u)=>({talk:1,mk:eio(u)}),hi:2,tin:'cut',cam:[[0,540,960,1.25],[1,540,1100,1.35]],hud:H('meet')});
  // киваешь — камера кивает, дальше стол: пропуск и доход
  nx(iA('двадцать'),{w:'p_meet',o:{mk:1},hi:2,cam:[[0,540,1000,1.3],[.35,540,1260,1.42],[.7,540,960,1.3],[1,540,980,1.3]],hud:H('meet')});
  nx(iA('доход'),{w:'p_desk',hi:2,tin:'whipv',cam:[[0,330,760,1.75],[1,330,800,1.9]],hud:H('meet')});
  nx(iA('вниз'),{w:'p_desk',o:(T)=>({mark:eio(inv(wa(w('пять')),wb(w('евро'))+.1,T))}),hi:2,tin:'push',cam:[[0,740,1220,1.65],[1,760,1290,1.95]],hud:H('meet')});
  // вниз — Тверская — клуб
  nx(iA('тверская'),{w:'p_lift',o:(T,lt,u)=>({k:eio(cl(u*1.3)),open:eio(cl((u-.75)*4))}),hi:1,tin:'cut',cam:[[0,540,900,1.0],[1,540,960,1.08]],hud:H('lift')});
  nx(iA('клуб',37),{w:'p_tver',o:(T,lt)=>({cz:lt*2600}),hi:1,tin:'push',roll:1,cam:[[0,540,920,1.02],[1,540,900,1.08]],hud:H('tver')});
  nx(iA('миша'),{w:'p_entry',o:(T,lt,u)=>({rope:u>.3?1:0,door:eio(cl((u-.25)*1.6))}),hi:1,tin:'push',cam:[[0,540,1000,1.0],[1,540,900,1.32]],hud:H('club'),dive:()=>[540,990]});
  nx(iA('дыра'),{w:'p_vip',o:{mt:1},hi:2,tin:'dive',cam:[[0,540,1060,1.12],[1,500,980,1.4]],hud:H('vip')});
  nx(iA('он',52),{w:'p_vip',o:(T)=>({ul:inv(wa(w('шестьсот')),wb(w('тысяч')),T)}),hi:2,tin:'whipv',cam:[[0,470,1545,1.9],[1,470,1560,2.15]],hud:H('vip')});
  nx(iA('а',57),{w:'p_vip',o:{ul:1,mishaE:'smirk'},hi:2,tin:'cut',cam:[[0,440,900,2.0],[1,440,885,2.25]],hud:H('vip')});
  nx(iA('и',63),{w:'p_vip',o:(T)=>({ul:1,mishaE:'smirk',pen:eio(inv(wa(w('тянешься')),wb(w('ручкой')),T)),sig:inv(wb(w('ручкой'))-.2,wb(w('ручкой'))+.5,T)}),hi:2,tin:'cut',cam:[[0,860,1700,1.6],[1,880,1740,1.85]],hud:H('vip')});
  nx(iA('туалет'),{w:'p_vip',o:(T)=>({ul:1,pen:1,sig:1,sig2:inv(wa(w('вадима')),wa(w('вадима'))+.6,T),vadE:T>wa(w('вадима'))?'smile':'neutral'}),hi:2,tin:'whip',cam:[[0,840,980,1.8],[.6,840,960,2.0],[1,840,1500,1.7]],hud:H('vip')});
  // туалет: кафель, лампа, бас; зеркало
  nx(iA('ты',77),{w:'p_wc',o:{flick:1,bass:1,maxE:'tired',bl:0},hi:2,tin:'flash',shake:1,cam:[[0,540,1500,1.6],[.5,540,900,1.15],[1,540,700,1.3]],hud:H('wc')});
  nx(iA('а',85),{w:'p_wc',o:(T)=>{const r=inv(wa(w('и',82))-.1,wa(w('и',82))+.4,T),r2=inv(wb(w('себе'))-.1,wb(w('себе'))+.25,T);return {flick:1,bass:1,up:T<wa(w('зеркало')),maxE:T>wa(w('нравишься'))?'smirk':'neutral',rub:Math.sin(Math.PI*cl(r))*(1-r2)};},hi:2,tin:'cut',cam:[[0,520,720,1.55],[1,520,700,1.8]],hud:H('wc')});
  // Юля
  nx(iA('ночью'),{w:'p_yulia',o:(T)=>({e:'smile',mt:0}),hi:2,tin:'push',cam:[[0,540,880,1.0],[1,540,860,1.12]],hud:H('yulia')});
  nx(iA('лучший',100),{w:'p_action',hi:1,tin:'whip',cam:[[0,540,980,1.0],[1,540,1000,1.08]],hud:H('action'),ov:(c,T)=>viewfinder(c,T)});
  nx(iA('мигалки'),{w:'p_action',hi:2,tin:'cut',cam:[[0,560,1140,1.55],[1,560,1120,1.7]],hud:H('action'),ov:(c,T)=>viewfinder(c,T)});
  nx(iA('и',112),{w:'p_action',o:(T,lt,u)=>({pol:eio(cl(u*1.6))}),hi:1,tin:'flash',shake:1,cam:[[0,540,980,1.0],[1,600,1000,1.1]],hud:H('action'),ov:(c,T)=>viewfinder(c,T,.6)});
  nx(iA('она',117),{w:'p_run',hi:1,tin:'whip',roll:1,shake:1,cam:[[0,540,980,1.04],[1,540,960,1.08]],hud:H('run')});
  nx(iA('тебе',125),{w:'p_yulia',o:(T)=>({e:T<wa(w('там',123))?'neutral':'sad',s:3.2,cy:860,look:[0,0]}),hi:2,tin:'cut',cam:[[0,540,840,1.45],[1,540,820,1.7]],hud:H('yulia')});
  nx(iA('и',130),{w:'p_yulia',o:{e:'sad',s:3.2,cy:860},hi:2,post:'grey',cam:[[0,540,880,1.2],[1,540,900,1.05]],hud:H('yulia')});
  nx(iA('на',137),{w:'p_car',o:(T,lt,u)=>({hosp:eio(u)}),hi:1,tin:'push',cam:[[0,540,900,1.0],[1,540,860,1.1]],hud:H('car')});
  nx(iA('ты',142),{w:'p_costume',o:(T,lt,u)=>({k:eio(u),nose:inv(wb(w('клоуна'))-.45,wb(w('клоуна'))+.1,T)}),hi:1,tin:'cut',cam:[[0,540,960,1.0],[1,540,960,1.08]],hud:H('hosp')});
  // больничный туалет, Лёша
  nx(iA('«а',150),{w:'p_hwc',o:{lt:0},hi:1,tin:'cut',cam:[[0,600,960,1.02],[1,640,980,1.12]],hud:H('hwc')});
  nx(iA('лёша'),{w:'p_hwc',o:{lt:1,lyE:'smile'},hi:2,tin:'cut',cam:[[0,780,1040,1.75],[1,780,1020,1.95]],hud:H('hwc')});
  nx(iA('вокзал'),{w:'p_hwc',o:{lyE:'neutral',clE:'sad'},hi:2,tin:'cut',cam:[[0,250,640,1.9],[.55,250,620,2.05],[1,560,900,1.2]],hud:H('hwc')});
  // вокзал: Юля, голос Макса, «калека — это ты»
  nx(VO.maxq.a-.02,{w:'p_station',o:(T)=>({e:'sad',mt:T<wb(w('да')),s:1.9}),hi:2,tin:'whip',cam:[[0,560,1000,1.0],[1,580,860,1.3]],hud:H('station')});
  nx(iA('«по-моему'),{w:'p_station',o:(T)=>({e:'scared',s:1.9}),hi:2,tin:'cut',shake:1,cam:[[0,600,760,1.9],[1,600,740,2.3]],hud:H('station'),ov:(c,T)=>maxQuote(c,T)});
  nx(iA('а',179),{w:'p_station',o:{e:'neutral',mt:1,s:1.9},hi:2,tin:'cut',cam:[[0,600,780,1.7],[1,600,770,1.85]],hud:H('station')});
  // всё рушится
  nx(iA('кабинет'),{w:'p_station',o:{e:'neutral',s:1.9},hi:2,cam:[[0,600,780,1.85],[1,600,790,1.7]],hud:H('station'),ov:(c,T,lt)=>crumble(c,inv(wa(w('рушится')),wb(w('стоял'))+.2,T))});
  // кабинет шефа: карта, подпись, уволен
  nx(iA('подпись'),{w:'p_boss',o:(T)=>({zone:eio(inv(wa(w('полигон')),wb(w('химоружия')),T))}),hi:2,tin:'cut',cam:[[0,540,760,1.4],[.35,540,760,1.45],[.7,540,1380,1.55],[1,560,1420,1.7]],hud:H('boss')});
  nx(iA('«вы'),{w:'p_boss',o:(T)=>({zone:1,circle:eio(inv(wa(w('твоя')),wb(w('твоя'))+.3,T))}),hi:2,tin:'whip',cam:[[0,740,1760,1.9],[1,740,1770,2.1]],hud:H('boss')});
  nx(iA('клуб',201),{w:'p_boss',o:{zone:1,bt:1,bossE:'neutral'},hi:2,tin:'cut',cam:[[0,540,660,2.0],[1,540,650,2.3]],hud:H('boss')});
  // пустой клуб Миши
  nx(iA('«лёгкие'),{w:'p_empty',o:{mishaE:'neutral'},hi:1,tin:'push',cam:[[0,540,960,1.0],[1,540,1000,1.1]],hud:H('empty')});
  nx(iA('всю'),{w:'p_empty',o:{mt:1,mishaE:'smirk'},hi:2,tin:'cut',cam:[[0,500,800,2.3],[1,500,790,2.55]],hud:H('empty')});
  nx(iA('и',221),{w:'p_empty',o:{mishaE:'scared'},hi:2,tin:'cut',shake:1,cam:[[0,500,820,2.3],[1,500,840,2.1]],hud:H('empty')});
  nx(iA('а',223),{w:'p_empty',o:{full:false,bag:1},hi:2,tin:'flash',cam:[[0,540,1560,1.6],[1,540,1600,1.75]],hud:H('empty')});
  nx(iA('ты',230),{w:'p_vadim',o:{e:'shout',mt:1},hi:2,tin:'whip',cam:[[0,540,880,1.15],[1,540,860,1.3]],hud:H('vadim')});
  // звонок
  nx(iA('экран'),{w:'p_phone',o:(T)=>({st:T>wa(w('ещё',237))?1:0}),hi:1,tin:'cut',cam:[[0,540,980,1.0],[1,540,960,1.12]],hud:H('phone')});
  nx(iA('где-то'),{w:'p_phone',o:(T,lt,u)=>({st:1,off:eio(u)}),hi:1,cam:[[0,540,960,1.12],[1,540,960,1.2]],hud:H('phone')});
  nx(iA('вадим',245),{w:'p_far',o:(T)=>({k:inv(wa(w('хлопок')),wa(w('хлопок'))+1.6,T)}),hi:1,tin:'cut',cam:[[0,600,980,1.0],[1,640,980,1.08]],hud:['']});
  nx(iA('у',251),{w:'p_phone',o:{st:1,off:.82},hi:1,tin:'cut',cam:[[0,540,980,1.05],[1,540,980,1.0]],hud:H('phone')});
  // сумка, Лёша, ночь, провал, утро
  nx(iA('ты',261),{w:'p_bag',hi:1,tin:'cut',cam:[[0,540,1180,1.05],[1,540,1220,1.15]],hud:H('car')});
  nx(iA('но',266),{w:'p_bag',o:(T)=>({mem:Math.sin(Math.PI*cl(inv(wa(w('лёше')),wb(w('операцию'))+.3,T)))*.92}),hi:1,cam:[[0,540,1220,1.15],[1,540,1240,1.22]],hud:H('car')});
  nx(iA('ты',274),{w:'p_night',o:(T,lt,u)=>({k:u,str:1}),hi:1,tin:'whip',shake:1,cam:[[0,540,960,1.0],[1,540,960,1.15]],hud:H('club'),ov:(c,T,lt)=>{const k=inv(wa(w('провал')),wb(w('провал'))+.1,T);if(k>0)blink(c,1-k);}});
  nx(iA('больница'),{w:'p_morning',hi:1,tin:'cut',cam:[[0,540,1000,1.0],[1,600,1240,1.25]],hud:H('morning')});
  // реанимация
  nx(iA('деньги',287),{w:'p_icu',o:(T)=>({lamp:T<wa(w('опоздал'))+.25?1:0}),hi:1,tin:'cut',cam:[[0,540,900,1.0],[.7,540,880,1.25],[1,540,860,1.3]],hud:H('icu')});
  nx(iA('ты',299),{w:'p_give',o:(T,lt,u)=>({k:eio(cl(u*2)),e:T<wa(w('впервые'))?'scared':'smile'}),hi:1,tin:'push',cam:[[0,540,1000,1.0],[1,540,1080,1.12]],hud:H('give')});
  // финал
  ENDT=DUR+5;DUR=wb(w('клоуном'))+2.6;
  nx(DUR,{w:'p_alone',o:(T)=>({nose:1}),hi:2,tin:'cut',cam:[[0,540,900,1.0],[.6,560,1080,1.35],[1,610,1220,1.9]],hud:[''],
    ov:(c,T)=>{const k=cl((T-wa(w('и',315)))/1.6);if(k>0){c.save();c.fillStyle=`rgba(0,0,0,${eio(k)})`;c.fillRect(0,0,WW,HH);c.restore();}}});
  ENDT=DUR+5;
};
