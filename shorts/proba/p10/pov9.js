"use strict";
/* «Духless» · «Твоими глазами» v9 — пробные кадры (27.11). node render.mjs pov9 <сцена>[-<язык>] <папка> shots 0
   Сцены: cast — лист героев, meet — переговорная, wc — туалет клуба, hosp — больничный туалет. Тексты — pov9/<язык>.json */
CLIP.fonts=['700 40px Osw','500 40px Osw','500 40px JBM','600 40px Man','800 40px Man'];
const SC9={};let TXT={};
const [SCN,LANG]=(Q.get('style')||'cast').split('-');
CLIP.init=async()=>{TXT=await (await fetch(`pov9/${LANG||'ru'}.json?`+Date.now())).json();if(SCN==='face')KZ=await loadImg('/a/kz.jpg');};
CLIP.draw=(c,t,i)=>{const f=SC9[SCN];if(f)f(c,t,i);};

SC9.cast=(c,t)=>{c.fillStyle=LG(c,0,0,0,HH,[[0,'#2a3140'],[1,'#10131a']]);c.fillRect(0,0,WW,HH);
  const P=[
    {x:200,y:330,s:1.25,f:'max',cloth:{k:'suit',jacket:'#20232b',shirt:'#eef0f2',open:true},L:-1,rim:'#9fc8ff',bt:560},
    {x:540,y:330,s:1.25,f:'maxClown',cloth:{k:'suit',jacket:'#121318',shirt:'#e9ebee',open:true},L:-1,rim:'#bfe6ff',bt:560},
    {x:880,y:330,s:1.25,f:'lyosha',cloth:{k:'flannel',a:'#8b6a48',b:'#3a2a1f'},L:1,sw:104,rim:'#ffd9a0',bt:560},
    {x:200,y:1100,s:1.25,f:'boss',cloth:{k:'suit',jacket:'#2c2f37',shirt:'#e8eaee',tie:'#5a1d26'},L:-1,sw:146,rim:'#ffd9a0',bt:560},
    {x:540,y:1100,s:1.25,f:'woman',cloth:{k:'blouse',shirt:'#e7dccd'},L:1,sw:112,rim:'#ffd9a0',bt:560},
    {x:880,y:1100,s:1.25,f:'glasses',cloth:{k:'shirt',shirt:'#9db4cc',tie:'#22303f'},L:-1,rim:'#9fc8ff',bt:560},
  ];
  for(const p of P)person9(c,p);
  // кисти
  const hs=[['flat',-.2],['relax',-.2],['fist',-.2],['point',-1.4],['pen',-.5],['grip',-.2],['cig',-.6],['rub',-1.3]];
  hs.forEach(([k,a],j)=>{const x=110+(j%4)*250,y=1660+Math.floor(j/4)*150;hand9(c,x,y,a,1.15,{pose:k});tx(c,k,x+40,y+90,{f:'J',s:20,c:'#9aa'});});
};

/* сверка лица Макса с фото (только для проверки, фото в git нет): P10A=<папка с kz.jpg> */
let KZ=null;
SC9.face=(c,t)=>{c.fillStyle='#1c2029';c.fillRect(0,0,WW,HH);
  if(KZ)c.drawImage(KZ,0,0,540,720);
  const o={x:810,y:330,s:2.3,f:'max',cloth:{k:'suit',jacket:'#20232b',shirt:'#eef0f2',open:true},L:1,turn:-.04,look:[0,.1],bt:300};
  person9(c,o);
  const o2={x:270,y:1120,s:1.7,f:'maxClown',cloth:{k:'suit',jacket:'#121318',shirt:'#e9ebee',open:true},L:-1,bt:420};person9(c,o2);
  const o3={x:810,y:1120,s:1.7,f:'lyosha',cloth:{k:'flannel',a:'#8b6a48',b:'#3a2a1f'},L:1,sw:104,bt:420};person9(c,o3);
};
SC9.hands=(c,t)=>{c.fillStyle='#2a3140';c.fillRect(0,0,WW,HH);
  const hs=[['flat',-.2],['relax',-.2],['fist',-.2],['point',-1.4],['pen',-.5],['grip',-.2],['cig',-.6],['rub',-1.3]];
  hs.forEach(([k,a],j)=>{const x=120+(j%2)*480,y=260+Math.floor(j/2)*420;hand9(c,x,y,a,2.6,{pose:k});tx(c,k,x+120,y+180,{f:'J',s:26,c:'#9aa'});});};

/* ===================== общее ===================== */
// камера POV: мир в см (x вправо, y вверх от пола, z вглубь), глаз на высоте ey, наклон вниз p (рад)
function cam9(o){const F=o.f||1500,cx=o.cx??WW/2,cy=o.cy??HH/2,ey=o.ey,p=o.p||0,cp=Math.cos(p),sp=Math.sin(p),ex=o.ex||0;
  const P=(x,y,z)=>{const dx=x-ex,dy=y-ey,zc=Math.max(1,z*cp-dy*sp),yc=dy*cp+z*sp;return [cx+F*dx/zc,cy-F*yc/zc,zc,F/zc];};
  return {P,f:F,o:{x:ex,y:-ey,z:0},cx,cy};}
// texPlane из dlx5a ждёт cam.P(x,y,z) — даём ему нашу камеру
function quad9(c,cam,img,O,U,V,n=10){texPlane(c,cam,img,O,U,V,n,n);}
function poly9(c,cam,pts){const q=pts.map(p=>cam.P(p[0],p[1],p[2]));c.beginPath();c.moveTo(q[0][0],q[0][1]);for(let i=1;i<q.length;i++)c.lineTo(q[i][0],q[i][1]);c.closePath();return q;}
// значки HUD: 0 — пусто (контур), 1 — есть, 2 — потерян (красная черта). Без текста.
function icon9(c,k,x,y,s,st){c.save();c.translate(x,y);c.scale(s,s);
  c.fillStyle=st===1?'rgba(14,18,26,.72)':'rgba(14,18,26,.42)';RR(c,-34,-34,68,68,14);c.fill();
  c.strokeStyle=st===1?'rgba(255,255,255,.25)':'rgba(255,255,255,.12)';c.lineWidth=1.5;c.stroke();
  const col=st===1?'#ffffff':st===2?'rgba(255,255,255,.45)':'rgba(255,255,255,.28)';c.strokeStyle=col;c.fillStyle=col;c.lineWidth=3;c.lineCap='round';c.lineJoin='round';
  if(k==='pass'){RR(c,-15,-12,30,36,4);c.stroke();c.beginPath();c.moveTo(-6,-12);c.lineTo(-6,-22);c.lineTo(6,-22);c.lineTo(6,-12);c.stroke();RR(c,-9,-5,10,11,2);c.fill();c.fillRect(3,-3,8,2.5);c.fillRect(3,2,8,2.5);c.fillRect(-9,11,20,2.5);c.fillRect(-9,16,14,2.5);}
  if(k==='band'){c.beginPath();c.ellipse(0,4,20,12,0,0,TAU);c.stroke();c.beginPath();c.ellipse(0,4,20,12,0,0,Math.PI);c.lineWidth=7;c.stroke();c.lineWidth=3;RR(c,-9,-18,18,16,3);c.stroke();c.beginPath();c.arc(0,-10,2.5,0,TAU);c.fill();}
  if(k==='cheers'){for(const sd of [-1,1]){c.save();c.translate(sd*9,4);c.rotate(sd*.32);c.beginPath();c.moveTo(-8,-18);c.lineTo(8,-18);c.lineTo(6,0);c.quadraticCurveTo(0,6,-6,0);c.closePath();c.stroke();c.beginPath();c.moveTo(0,3);c.lineTo(0,16);c.moveTo(-6,17);c.lineTo(6,17);c.stroke();c.restore();}
    for(const a of [-.6,0,.6]){c.beginPath();c.moveTo(Math.sin(a)*14,-24-Math.cos(a)*2);c.lineTo(Math.sin(a)*19,-30-Math.cos(a)*3);c.stroke();}}
  if(k==='cam'){RR(c,-20,-10,28,22,4);c.stroke();c.beginPath();c.moveTo(8,-4);c.lineTo(20,-10);c.lineTo(20,12);c.lineTo(8,6);c.stroke();c.beginPath();c.arc(-6,1,5,0,TAU);c.stroke();c.fillRect(-16,-17,10,5);}
  c.restore();
  if(st===2){c.save();c.translate(x,y);c.strokeStyle='#ff2a3a';c.lineWidth=5*s;c.lineCap='round';c.shadowColor='rgba(255,40,60,.6)';c.shadowBlur=10;c.beginPath();c.moveTo(-30*s,30*s);c.lineTo(30*s,-30*s);c.stroke();c.restore();}}
function hud9(c,place,st){c.save();c.shadowColor='rgba(0,0,0,.75)';c.shadowBlur=10;c.fillStyle='#ff5a36';c.beginPath();c.arc(66,130,6,0,TAU);c.fill();
  tx(c,place,84,138,{f:'J',w:500,s:22,ls:3,al:'left',c:'rgba(255,255,255,.92)'});c.restore();
  const K=['pass','band','cheers','cam'];K.forEach((k,i)=>icon9(c,k,WW-70-(3-i)*80,134,.92,st[i]));}
function sub9(c,ws,y){subLine(c,ws,{y:y||1330,s:100,f:'O',w:700,acc:'#ffb13b'});}
function fin9(c,o={}){grade(c,o.warm||'#ffb46a',o.cool||'#2a4466',o.ga??.16);vignette(c,o.vig??.55);grain(c,0,o.gr??.05);}

/* ===================== Москва-Сити днём ===================== */
function towerDay(c,T,by,o){const {x,w,h}=T,top=by-h,col=T.col,p=new Path2D();
  const sl=T.top;p.moveTo(x-w/2,by);
  if(sl==='sail'){p.lineTo(x-w/2,top+w*.9);p.quadraticCurveTo(x-w*.1,top+w*.2,x+w*.15,top);p.lineTo(x+w/2,top+w*.55);}
  else if(sl==='step'){p.lineTo(x-w/2,top+w*.75);p.lineTo(x-w*.3,top+w*.75);p.lineTo(x-w*.3,top+w*.35);p.lineTo(x-w*.1,top+w*.35);p.lineTo(x-w*.1,top);p.lineTo(x+w*.1,top);p.lineTo(x+w*.1,top+w*.35);p.lineTo(x+w*.3,top+w*.35);p.lineTo(x+w*.3,top+w*.75);p.lineTo(x+w/2,top+w*.75);}
  else if(sl==='curve'){p.lineTo(x-w/2,top+w*.8);p.quadraticCurveTo(x,top+w*.55,x+w/2,top);}
  else if(sl==='twist'){p.lineTo(x-w/2,top+w*.3);p.quadraticCurveTo(x,top-w*.12,x+w/2,top+w*.3);}
  else if(sl==='crown'){p.lineTo(x-w/2,top+w*.5);p.lineTo(x-w*.36,top);p.lineTo(x+w*.36,top);p.lineTo(x+w/2,top+w*.5);}
  else{p.lineTo(x-w/2,top);p.lineTo(x+w/2,top);}
  p.lineTo(x+w/2,by);p.closePath();
  c.save();c.fillStyle=LG(c,x-w/2,0,x+w/2,0,[[0,tk(col,.14)],[T.split??.5,tk(col,.06)],[(T.split??.5)+.001,tk(col,-.22)],[1,tk(col,-.32)]]);c.fill(p);c.clip(p);
  c.fillStyle=LG(c,0,top,0,by,[[0,'rgba(220,235,250,.32)'],[.45,'rgba(255,255,255,0)'],[1,'rgba(0,0,0,.18)']]);c.fillRect(x-w,top-40,w*2,h+40);
  c.strokeStyle='rgba(20,30,45,.16)';c.lineWidth=1;for(let yy=top+8;yy<by;yy+=Math.max(4,w*.09)){c.beginPath();c.moveTo(x-w/2,yy);c.lineTo(x+w/2,yy);c.stroke();}
  c.strokeStyle='rgba(255,255,255,.10)';for(let k=1;k<8;k++){c.beginPath();c.moveTo(x-w/2+w*k/8,top);c.lineTo(x-w/2+w*k/8,by);c.stroke();}
  if(T.twist){c.strokeStyle='rgba(240,250,255,.22)';c.lineWidth=w*.08;for(let k=-10;k<30;k++){c.beginPath();c.moveTo(x-w/2,top+k*w*.42);c.quadraticCurveTo(x,top+k*w*.42+w*.32,x+w/2,top+k*w*.42+w*.06);c.stroke();}}
  c.fillStyle=LG(c,x-w/2,0,x+w/2,0,[[0,'rgba(255,255,255,0)'],[.18,'rgba(255,250,235,.28)'],[.3,'rgba(255,255,255,0)']]);c.fillRect(x-w/2,top-40,w,h+40);
  c.restore();
  if(T.spire){c.strokeStyle=tk(col,-.2);c.lineWidth=Math.max(2,w*.05);c.beginPath();c.moveTo(x+w*.15,top);c.lineTo(x+w*.15,top-T.spire);c.stroke();}
  if(sl==='crown'){c.strokeStyle=tk(col,-.25);c.lineWidth=Math.max(2,w*.05);c.strokeRect(x-w*.36,top-w*.5,w*.72,w*.5);}}
function cityDay9(c,cx,by,s,o={}){
  // дальний город в дымке
  const r=rng(31);for(let i=0;i<120;i++){const x=cx-700*s+r()*1400*s,w=(20+r()*50)*s,h=(20+r()*90)*s;c.fillStyle=`rgba(${150+r()*20|0},${165+r()*20|0},${180+r()*15|0},${.75})`;c.fillRect(x,by-h,w,h+400);}
  // сталинская высотка («Украина») — слева
  c.save();c.translate(cx-430*s,by);c.scale(s*.62,s*.62);const L=[[-170,0],[-170,-140],[-120,-140],[-120,-230],[-80,-230],[-80,-330],[-52,-330],[-52,-410],[-30,-410],[-30,-470],[-12,-500],[0,-600],[12,-500],[30,-470],[30,-410],[52,-410],[52,-330],[80,-330],[80,-230],[120,-230],[120,-140],[170,-140],[170,0]];
  c.beginPath();c.moveTo(L[0][0],L[0][1]);for(const q of L)c.lineTo(q[0],q[1]);c.closePath();c.fillStyle=LG(c,-170,0,170,0,[[0,'#d9cbb0'],[.5,'#c8b89b'],[.51,'#a8977b'],[1,'#968669']]);c.fill();
  c.fillStyle='rgba(90,70,50,.18)';for(let j=0;j<40;j++)for(let i=-24;i<24;i++){if(H2(i+50,j+9)>.6)continue;c.fillRect(i*7+1,-j*12-14,3,5);}
  c.fillStyle='#c9a24a';c.beginPath();c.moveTo(0,-640);c.lineTo(4,-606);c.lineTo(-4,-606);c.closePath();c.fill();c.restore();
  const T=[{x:-330,w:56,h:300,top:'twist',col:'#7d97ad',twist:1},{x:-245,w:60,h:300,top:'curve',col:'#8ba2b6'},
    {x:-160,w:56,h:340,top:'sail',col:'#9ab1c3'},{x:-100,w:66,h:490,top:'sail',col:'#a3b9ca',spire:70},
    {x:-8,w:68,h:440,top:'step',col:'#b9935c',split:.45},{x:84,w:64,h:460,top:'crown',col:'#56708c'},{x:150,w:54,h:330,top:'flat',col:'#5f7891'},
    {x:236,w:62,h:390,top:'flat',col:'#a4adb4'},{x:300,w:56,h:300,top:'flat',col:'#b1b8bd'},{x:-410,w:50,h:330,top:'flat',col:'#c8c0b0'}];
  for(const t of T.sort((a,b)=>a.h-b.h))towerDay(c,{...t,x:cx+t.x*s,w:t.w*s,h:t.h*s},by,o);
  // ближний город и дымка у земли
  const r2=rng(77);for(let i=0;i<70;i++){const x=cx-720*s+r2()*1440*s,w=(30+r2()*70)*s,h=(10+r2()*45)*s;c.fillStyle=`rgb(${120+r2()*25|0},${132+r2()*25|0},${140+r2()*20|0})`;c.fillRect(x,by-h+12*s,w,h+400);
    c.fillStyle='rgba(40,50,60,.25)';for(let k=0;k<4;k++)c.fillRect(x+4,by-h+16*s+k*8*s,w-8,2);}
  c.fillStyle=LG(c,0,by-260*s,0,by+30*s,[[0,'rgba(225,228,226,0)'],[1,'rgba(228,226,218,.75)']]);c.fillRect(0,by-260*s,WW,300*s);}

/* ===================== предметы ===================== */
function woodTex(){return cache('wood9',512,1024,(g,w,h)=>{g.fillStyle='#3a2215';g.fillRect(0,0,w,h);const r=rng(5);
  for(let i=0;i<220;i++){const x=r()*w,a=.04+r()*.1,wd=1+r()*4,ph=r()*10;g.strokeStyle=r()>.5?`rgba(20,10,5,${a})`:`rgba(120,70,40,${a})`;g.lineWidth=wd;g.beginPath();for(let y=0;y<=h;y+=16){const xx=x+Math.sin(y/90+ph)*8+Math.sin(y/23+ph*2)*2;y?g.lineTo(xx,y):g.moveTo(xx,y);}g.stroke();}
  g.fillStyle=LG(g,0,0,w,0,[[0,'rgba(0,0,0,.25)'],[.5,'rgba(255,200,150,.05)'],[1,'rgba(0,0,0,.25)']]);g.fillRect(0,0,w,h);});}
function docTex(){return cache('doc9',620,860,(g,w,h)=>{const D=TXT.doc;g.fillStyle='#f4f2ec';g.fillRect(0,0,w,h);
  g.fillStyle='#14335c';g.font='700 46px Play';g.fillText(D.bank,46,86);g.font='600 15px Man';g.fillStyle='#4a5a70';g.fillText(D.bank2,48,110);
  g.fillStyle='#14335c';g.fillRect(46,124,w-92,3);g.fillStyle='#1a1d22';g.font='800 27px Man';g.fillText(D.title,46,180);g.font='600 22px Man';g.fillStyle='#555';g.fillText(D.no,46,214);
  const r=rng(9);g.fillStyle='#9aa0a6';for(let j=0;j<14;j++){const y=256+j*24;g.fillRect(46,y,(w-92)*(j%5===4?.55:.9+r()*.1),7);}
  g.strokeStyle='#14335c';g.lineWidth=2;g.strokeRect(46,610,w-92,64);g.font='700 17px Man';g.fillStyle='#14335c';g.fillText(D.sum,62,638);g.font='800 28px JBM';g.fillStyle='#1a1d22';g.fillText('€ 48 000 000',62,666);
  g.fillStyle='#9aa0a6';for(let j=0;j<3;j++)g.fillRect(46,700+j*22,(w-92)*.85,6);
  g.strokeStyle='#333';g.lineWidth=1.5;g.beginPath();g.moveTo(330,808);g.lineTo(w-46,808);g.stroke();g.font='500 15px Man';g.fillStyle='#666';g.fillText(D.sign,330,830);
  g.save();g.globalAlpha=.55;g.strokeStyle='#2a4fb0';g.lineWidth=4;g.beginPath();g.arc(150,780,52,0,TAU);g.stroke();g.lineWidth=2;g.beginPath();g.arc(150,780,40,0,TAU);g.stroke();g.font='700 13px Man';g.fillStyle='#2a4fb0';g.textAlign='center';g.fillText(D.bank,150,785);g.restore();});}
function signTex(){return cache('sign9'+LANG,640,140,(g,w,h)=>{g.fillStyle='#0f1114';RR(g,0,0,w,h,10);g.fill();g.strokeStyle='#c9a24a';g.lineWidth=4;RR(g,8,8,w-16,h-16,8);g.stroke();
  g.fillStyle='#e7c77a';g.textAlign='center';g.font='700 50px Play';g.fillText(TXT.maq,w/2,72);g.font='600 22px Man';g.fillStyle='#b9a77a';g.fillText(TXT.maq2,w/2,108);});}
function lawnTex(){return cache('lawn9',800,560,(g,w,h)=>{g.fillStyle='#7da35c';g.fillRect(0,0,w,h);const r=rng(3);
  for(let i=0;i<900;i++){g.fillStyle=`rgba(${60+r()*40|0},${110+r()*40|0},${40+r()*20|0},.35)`;g.fillRect(r()*w,r()*h,3,3);}
  g.strokeStyle='#cfd2d4';g.lineWidth=34;g.lineCap='round';g.beginPath();g.moveTo(-20,300);g.bezierCurveTo(200,200,420,420,820,250);g.stroke();
  g.beginPath();g.moveTo(410,330);g.lineTo(420,-20);g.stroke();g.strokeStyle='#e9eaec';g.lineWidth=3;g.setLineDash([14,12]);g.beginPath();g.moveTo(-20,300);g.bezierCurveTo(200,200,420,420,820,250);g.stroke();g.setLineDash([]);
  g.fillStyle='#5aa0c8';g.beginPath();g.ellipse(640,440,90,50,.2,0,TAU);g.fill();g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.ellipse(620,425,40,12,.2,0,TAU);g.fill();
  g.fillStyle='rgba(0,0,0,.12)';for(let i=0;i<10;i++){g.fillRect(40+i*76,40,58,70);g.fillRect(40+i*76,430,58,70);}});}
// домик: основание (x,z) в см на уровне y, размер w×d, высота стен h, крыша rh
function house9(c,cam,x,y,z,w,d,h,rh,camx){const P=(a,b,cz)=>cam.P(a,b,cz),x0=x-w/2,x1=x+w/2,z0=z-d/2,z1=z+d/2,yt=y+h,yr=yt+rh;
  const face=(pts,col,a)=>{const q=pts.map(p=>P(...p));c.beginPath();c.moveTo(q[0][0],q[0][1]);for(const t of q)c.lineTo(t[0],t[1]);c.closePath();c.fillStyle=col;c.fill();c.strokeStyle='rgba(40,40,45,.35)';c.lineWidth=.8;c.stroke();return q;};
  // тень
  c.fillStyle='rgba(20,30,10,.3)';const sq=[[x0,y,z0],[x1+2,y,z0],[x1+3,y,z1+2],[x0+1,y,z1+2]].map(p=>P(...p));c.beginPath();c.moveTo(sq[0][0],sq[0][1]);for(const t of sq)c.lineTo(t[0],t[1]);c.closePath();c.fill();
  const sideX=x>camx?x0:x1;face([[sideX,y,z0],[sideX,y,z1],[sideX,yt,z1],[sideX,yt,z0]],'#c9c6bf');
  const fq=face([[x0,y,z0],[x1,y,z0],[x1,yt,z0],[x0,yt,z0]],'#f1eee8');
  // окна на фасаде
  c.fillStyle='rgba(40,60,80,.85)';for(const u of [.22,.62]){const a=P(x0+w*u,y+h*.25,z0-.01),b=P(x0+w*(u+.22),y+h*.75,z0-.01);c.fillRect(a[0],b[1],b[0]-a[0],a[1]-b[1]);}
  // крыша (двускатная вдоль x)
  face([[x0-.5,yt,z0-.5],[x1+.5,yt,z0-.5],[x1+.5,yr,z],[x0-.5,yr,z]],'#4a4e57');face([[sideX,yt,z0-.5],[sideX,yt,z1+.5],[sideX,yr,z]],'#d8d4cc');}
function tree9(c,cam,x,y,z,r){const a=cam.P(x,y,z),b=cam.P(x,y+r*1.6,z),rr=a[3]*r;c.strokeStyle='#5a4030';c.lineWidth=Math.max(1,rr*.18);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();
  c.fillStyle=RG(c,b[0]-rr*.3,b[1]-rr*.4,rr*.1,rr*1.1,[[0,'#8fc06a'],[.6,'#4f8a3c'],[1,'#2f5a28']]);c.beginPath();c.arc(b[0],b[1],rr,0,TAU);c.fill();}
function glass9(c,cam,x,z,y,r,h,o={}){const n=36,top=[],bot=[];for(let i=0;i<=n;i++){const a=i/n*TAU;top.push(cam.P(x+Math.cos(a)*r,y+h,z+Math.sin(a)*r));bot.push(cam.P(x+Math.cos(a)*r*.92,y,z+Math.sin(a)*r*.92));}
  const cx=cam.P(x,y,z),xs=top.map(p=>p[0]),xmin=Math.min(...xs),xmax=Math.max(...xs),ty=Math.min(...top.map(p=>p[1])),by=Math.max(...bot.map(p=>p[1]));
  // тень и каустика
  c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(cx[0]+(xmax-xmin)*.15,cx[1]+4,(xmax-xmin)*.55,(xmax-xmin)*.14,0,0,TAU);c.fill();
  // тело
  c.save();c.beginPath();c.moveTo(top[0][0],top[0][1]);for(let i=0;i<=n/2;i++)c.lineTo(bot[i][0],bot[i][1]);for(let i=n/2;i<=n;i++)c.lineTo(top[i][0],top[i][1]);c.closePath();
  c.fillStyle='rgba(200,220,235,.10)';c.fill();c.clip();
  const wl=cam.P(x,y+h*.62,z);c.fillStyle='rgba(170,200,225,.22)';c.fillRect(xmin-5,wl[1],xmax-xmin+10,by-wl[1]+5);
  c.fillStyle='rgba(255,255,255,.55)';c.fillRect(xmin+(xmax-xmin)*.14,ty,(xmax-xmin)*.07,by-ty);c.fillStyle='rgba(255,255,255,.2)';c.fillRect(xmax-(xmax-xmin)*.18,ty,(xmax-xmin)*.04,by-ty);
  c.restore();
  c.strokeStyle='rgba(230,240,250,.55)';c.lineWidth=1.6;c.beginPath();top.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
  const wt=[];for(let i=0;i<=n;i++){const a=i/n*TAU;wt.push(cam.P(x+Math.cos(a)*r*.96,y+h*.62,z+Math.sin(a)*r*.96));}c.strokeStyle='rgba(220,235,250,.45)';c.beginPath();wt.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();}

/* ===================== 1. Переговорная «Мегаполиса» ===================== */
SC9.meet=(c,t)=>{const cam=cam9({f:1500,cy:820,ey:120,p:.1}),P=cam.P;
  // окно: небо и Сити
  const wTop=P(0,300,650)[1],wBot=P(0,0,650)[1],hz=820-1500*Math.tan(.1);
  c.fillStyle=LG(c,0,wTop,0,wBot,[[0,'#8fb6d8'],[.55,'#c9d9e4'],[1,'#e9e3d6']]);c.fillRect(0,wTop,WW,wBot-wTop);
  c.fillStyle=RG(c,140,wTop+60,10,520,[[0,'rgba(255,246,220,.85)'],[1,'rgba(255,246,220,0)']]);c.fillRect(0,wTop,WW,wBot-wTop);
  c.save();c.beginPath();c.rect(0,wTop,WW,wBot-wTop);c.clip();c.filter='blur(1.2px)';cityDay9(c,560,hz+18,.78);c.restore();
  // стекло: дымка и отражение зала
  c.fillStyle=LG(c,0,wTop,WW,wBot,[[0,'rgba(255,255,255,.06)'],[.4,'rgba(255,255,255,0)'],[.55,'rgba(210,225,240,.12)'],[1,'rgba(255,255,255,0)']]);c.fillRect(0,wTop,WW,wBot-wTop);
  // импосты окна
  for(const x of [-360,-240,-120,0,120,240,360]){const a=P(x-4,0,650),b=P(x+4,300,650);c.fillStyle='#22262c';c.fillRect(a[0],b[1],Math.max(3,b[0]-a[0]),a[1]-b[1]);c.fillStyle='rgba(255,255,255,.18)';c.fillRect(b[0]-1,b[1],1.5,a[1]-b[1]);}
  { const a=P(-500,0,650),b=P(500,6,650);c.fillStyle='#2a2d33';c.fillRect(0,b[1],WW,a[1]-b[1]+2);}
  // потолок с линейными светильниками
  c.fillStyle=LG(c,0,0,0,wTop,[[0,'#b9bcc0'],[1,'#d7d8d8']]);c.fillRect(0,0,WW,wTop);c.fillStyle='#2a2d33';c.fillRect(0,wTop-6,WW,8);
  for(const x of [-150,0,150]){const q=poly9(c,cam,[[x-3,300,150],[x+3,300,150],[x+3,300,640],[x-3,300,640]]);c.fillStyle='#fffdf6';c.globalAlpha=.85;c.fill();c.globalAlpha=1;c.save();c.filter='blur(10px)';c.globalAlpha=.35;c.fill();c.restore();}
  // пол
  c.fillStyle=LG(c,0,wBot,0,HH,[[0,'#3a3d42'],[1,'#1b1d21']]);c.fillRect(0,wBot,WW,HH-wBot);
  // стол: дальняя часть (за шефом)
  const wood=woodTex(),TW=88;
  quad9(c,cam,wood,[-TW,75,185],[2*TW,0,0],[0,0,260]);
  const gloss=(z0,z1)=>{c.save();poly9(c,cam,[[-TW,75,z0],[TW,75,z0],[TW,75,z1],[-TW,75,z1]]);c.clip();c.globalCompositeOperation='screen';
    c.fillStyle=LG(c,0,830,0,1250,[[0,'rgba(230,240,250,.42)'],[.35,'rgba(200,215,230,.12)'],[1,'rgba(0,0,0,0)']]);c.fillRect(0,820,WW,500);
    for(const x of [-120,0,120]){const a=P(x,75,430),b=P(x,75,60);c.strokeStyle='rgba(255,255,255,.08)';c.lineWidth=8;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}c.restore();};
  const edge=(z0,z1)=>{for(const sd of [-1,1]){poly9(c,cam,[[sd*TW,75,z0],[sd*TW,75,z1],[sd*TW,70,z1],[sd*TW,70,z0]]);c.fillStyle='#1e120b';c.fill();}};
  edge(185,445);gloss(185,445);
  // коллеги за столом — смотрят в камеру, свет из окна сзади
  const RIM='#fff3df';
  const cols=[{f:'young',x:196,y:hz-2,s:.4,cloth:{k:'blouse',shirt:'#565b63'},turn:.22,look:[.4,0],L:1,sw:126},{f:'woman2',x:884,y:hz,s:.4,cloth:{k:'suit',jacket:'#2c2e36',shirt:'#e9e3dc',open:true},turn:-.22,look:[-.4,0],L:-1,sw:116},
    {f:'woman',x:62,y:hz+4,s:.53,cloth:{k:'blouse',shirt:'#e7dccd'},turn:.3,look:[.6,0],L:1,sw:116},{f:'glasses',x:1022,y:hz+4,s:.53,cloth:{k:'shirt',shirt:'#9db4cc',tie:'#22303f'},turn:-.3,look:[-.6,0],L:-1}];
  for(const p of cols){c.save();c.translate(p.x,p.y);c.scale(p.s,p.s);c.fillStyle='#15171b';RR(c,-150,40,300,560,60);c.fill();c.fillStyle='rgba(255,255,255,.06)';RR(c,-150,40,300,30,30);c.fill();c.restore();
    person9(c,{...p,rim:RIM,bt:640});}
  // их руки на столе
  for(const [x,y,s,a] of [[150,898,.55,-.35],[930,898,.55,-2.8],[250,840,.42,-.4],[830,840,.42,-2.75]])hand9(c,x,y,a,s,{pose:'relax',flip:a<-1.5});
  // шеф: наклонился к тебе через стол
  const B={x:585,y:552,s:.9,f:'boss',cloth:{k:'suit',jacket:Q.get('dbg')?'#ff0000':'#2c2f37',shirt:'#e8eaee',tie:'#5a1d26'},L:-1,sw:146,rim:RIM,bt:560,look:[0,.15]};
  person9(c,B);
  // стол: ближняя часть
  quad9(c,cam,wood,[-TW,75,40],[2*TW,0,0],[0,0,145]);
  // блеск лака: отражение окна
  edge(40,185);gloss(40,185);
  // край стола (торец) снизу не виден; кромка по бокам
  // папки, ноутбук, стаканы у коллег
  const fold=cache('fold9',300,400,(g,w,h)=>{g.fillStyle='#1d3a5c';g.fillRect(0,0,w,h);g.fillStyle='rgba(255,255,255,.1)';g.fillRect(0,0,w,6);g.fillStyle='#c9a24a';g.fillRect(30,40,120,10);});
  quad9(c,cam,fold,[-80,75.3,300],[24,0,-3],[2,0,30],4);quad9(c,cam,fold,[58,75.3,280],[24,0,4],[-3,0,30],4);
  glass9(c,cam,-62,262,75,3.4,11);glass9(c,cam,64,250,75,3.4,11);glass9(c,cam,-66,365,75,3.4,11);
  // макет посёлка
  const mx0=-24,mx1=24,mz0=110,mz1=156,my=79;
  poly9(c,cam,[[mx0,75,mz0],[mx1,75,mz0],[mx1,my,mz0],[mx0,my,mz0]]);c.fillStyle='#e6e4df';c.fill();c.strokeStyle='rgba(0,0,0,.25)';c.stroke();
  poly9(c,cam,[[mx1,75,mz0],[mx1,75,mz1],[mx1,my,mz1],[mx1,my,mz0]]);c.fillStyle='#c4c1bb';c.fill();
  // тень макета на столе
  c.save();c.filter='blur(10px)';poly9(c,cam,[[mx0-2,75.1,mz0-3],[mx1+4,75.1,mz0-3],[mx1+5,75.1,mz1+2],[mx0,75.1,mz1+2]]);c.fillStyle='rgba(0,0,0,.45)';c.fill();c.restore();
  quad9(c,cam,lawnTex(),[mx0,my,mz1],[mx1-mx0,0,0],[0,0,mz0-mz1],12);
  const HS=[[-17,148,5.6,4.4,3.2,2.2],[-6,149,5,4,3,2],[6,148,5.6,4.4,3.4,2.2],[17,147,5,4,3,2],[-18,121,5.6,4.4,3.4,2.2],[-7,119,5,4,3,2],[16,119,6,4.6,3.6,2.4],[7,137,4.6,3.8,2.8,1.8]];
  const Tr=[[-12,152,1.2],[12,153,1.3],[-1,151,1.1],[22,140,1.4],[-22,135,1.2],[0,124,1.2],[-13,113,1.1],[10,112,1.2],[22,125,1]];
  const items=[...HS.map(h=>({z:h[1],f:()=>house9(c,cam,h[0],my,h[1],h[2],h[3],h[4],h[5],0)})),...Tr.map(r=>({z:r[1],f:()=>tree9(c,cam,r[0],my,r[1],r[2])}))].sort((a,b)=>b.z-a.z);
  for(const it of items)it.f();
  // табличка на передней кромке
  quad9(c,cam,signTex(),[-13,my+5.8,mz0-1.2],[26,0,0],[0,-5.6,1.6],6);
  // руки шефа на дальних углах макета — толкает к тебе
  const sh=(x,y)=>pt9(B,x,y);
  for(const sd of [-1,1]){const S=sh(sd*112,215),E=[585+sd*180,905],W=[540+sd*196,1040];arm9(c,S,E,W,{w0:74,w1:56,col:'#2c2f37',L:-1,cuff:'#e8eaee'});
    hand9(c,W[0]+sd*4,W[1]+6,Math.PI/2-sd*.32,1.25,{pose:'flat',skin:FACES.boss.skin,flip:sd>0});}
  // договор и ручка у тебя
  quad9(c,cam,docTex(),[-19,75.2,106],[22,0,-2.2],[-2.6,0,-31],10);
  c.save();c.filter='blur(6px)';poly9(c,cam,[[-19,75.1,106],[3,75.1,103.8],[0,75.1,73],[-22,75.1,75]]);c.fillStyle='rgba(0,0,0,.2)';c.fill();c.restore();
  glass9(c,cam,-40,92,75,3.6,11.5);
  // рука Макса снизу справа: рукав, манжета, часы, ручка
  const Wm=[850,1800];arm9(c,[1230,2180],[1050,1990],Wm,{w0:230,w1:160,col:'#20232a',L:-1,cuff:'#eef0f2',rim:'#fff3df'});
  hand9(c,Wm[0],Wm[1],-2.5,2.25,{pose:'relax',skin:FACES.max.skin,L:-1});
  pen9(c,Wm[0]-40,Wm[1]-150,-2.2,270,{w:15});
  // свет из окна по залу
  c.save();c.globalCompositeOperation='screen';c.fillStyle=LG(c,0,wTop,0,1150,[[0,'rgba(255,245,225,.0)'],[.5,'rgba(255,245,225,.10)'],[1,'rgba(255,245,225,0)']]);c.fillRect(0,wTop,WW,900);c.restore();
  fin9(c,{warm:'#ffc98a',cool:'#35567a',ga:.14,vig:.5});
  hud9(c,TXT.hud.meet,[1,0,0,0]);sub9(c,TXT.sub.meet,960);};
SC9.dbg=(c,t)=>{c.fillStyle='#d01010';c.fillRect(0,0,WW,HH);c.fillStyle='#10d010';for(let y=0;y<HH;y+=60)c.fillRect(0,y,WW,10);
  person9(c,{x:540,y:500,s:1.2,f:'boss',cloth:{k:'suit',jacket:'#2c2f37',shirt:'#e8eaee',tie:'#5a1d26'},L:-1,sw:146,rim:'#fff3df',bt:900});};

/* ===================== 2. Туалет клуба: зеркало 1 ===================== */
function tilesTex(key,col,grout,tw,th,w=512,h=512){return cache('tl'+key,w,h,(g)=>{g.fillStyle=grout;g.fillRect(0,0,w,h);const r=rng(key.length*7);
  for(let y=0,row=0;y<h;y+=th,row++)for(let x=(row%2)*-tw/2;x<w;x+=tw){const k=(r()-.5)*.08;g.fillStyle=tk(col,k);g.fillRect(x+2,y+2,tw-4,th-4);
    g.fillStyle=LG(g,x,0,x+tw,0,[[0,'rgba(255,255,255,.10)'],[.25,'rgba(255,255,255,.02)'],[1,'rgba(0,0,0,.12)']]);g.fillRect(x+2,y+2,tw-4,th-4);g.fillStyle='rgba(255,255,255,.12)';g.fillRect(x+4,y+4,tw-8,2);}});}
function marbleDark(){return cache('mrbD',1024,1024,(g,w,h)=>{g.fillStyle='#141517';g.fillRect(0,0,w,h);const r=rng(19);
  for(let i=0;i<46;i++){let x=r()*w,y=r()*h,a=r()*TAU;g.strokeStyle=`rgba(${200+r()*40|0},${190+r()*40|0},${170+r()*40|0},${.06+r()*.22})`;g.lineWidth=.6+r()*2.2;g.beginPath();g.moveTo(x,y);
    for(let k=0;k<30;k++){a+=(r()-.5)*.7;x+=Math.cos(a)*24;y+=Math.sin(a)*24;g.lineTo(x,y);}g.stroke();}
  g.fillStyle='rgba(201,162,74,.05)';for(let i=0;i<300;i++)g.fillRect(r()*w,r()*h,2,2);});}
// свёрнутая купюра
function billTube(c,x,y,a,len,w){c.save();c.translate(x,y);c.rotate(a);const g=LG(c,0,-w/2,0,w/2,[[0,'#9aa98a'],[.35,'#d9dcc6'],[.6,'#b8c0a4'],[1,'#6f7a62']]);
  c.fillStyle=g;RR(c,-len/2,-w/2,len,w,w*.2);c.fill();c.strokeStyle='rgba(60,80,50,.5)';c.lineWidth=1.5;for(let k=-3;k<=3;k++){c.beginPath();c.moveTo(k*len*.12,-w/2);c.quadraticCurveTo(k*len*.12+6,0,k*len*.12,w/2);c.stroke();}
  c.fillStyle='#4d5a44';c.beginPath();c.ellipse(len/2,0,w*.18,w/2,0,0,TAU);c.fill();c.fillStyle='#2b3326';c.beginPath();c.ellipse(len/2,0,w*.1,w*.32,0,0,TAU);c.fill();c.restore();}
SC9.wc=(c,t,i)=>{const fl=.85+.15*Math.sin(t*37)*Math.sin(t*11);   // мигающая лампа
  // потолок и стена
  c.fillStyle='#0b0c0e';c.fillRect(0,0,WW,HH);
  const TL=tilesTex('wcg','#123430','#4f5d5a',64,128);c.save();c.globalAlpha=.95;for(let y=0;y<1480;y+=512)for(let x=0;x<WW;x+=512)c.drawImage(TL,x,y);c.restore();
  c.fillStyle=LG(c,0,0,0,300,[[0,'rgba(0,0,0,.85)'],[1,'rgba(0,0,0,.2)']]);c.fillRect(0,0,WW,300);
  // свет лампы по кафелю
  c.save();c.globalCompositeOperation='screen';c.fillStyle=RG(c,540,250,10,700,[[0,`rgba(255,200,130,${.35*fl})`],[1,'rgba(255,200,130,0)']]);c.fillRect(0,0,WW,1500);c.restore();
  // зеркало
  const MX0=70,MX1=1010,MY0=300,MY1=1330;c.save();RR(c,MX0,MY0,MX1-MX0,MY1-MY0,18);c.clip();
  // — отражённый зал: тёмные кабинки, неон по верху, споты
  c.fillStyle='#0d1012';c.fillRect(MX0,MY0,MX1-MX0,MY1-MY0);
  const TL2=tilesTex('wcg2','#0f2b28','#3a4644',40,80,512,512);c.save();c.globalAlpha=.7;c.drawImage(TL2,MX0,MY0,1100,1100);c.restore();
  for(let k=0;k<4;k++){const x=MX0+40+k*250;c.fillStyle='#2a1e18';c.fillRect(x,560,210,780);c.fillStyle='rgba(255,255,255,.06)';c.fillRect(x,560,6,780);c.fillStyle='#9aa3a8';c.fillRect(x+180,900,8,46);}
  c.save();c.globalCompositeOperation='screen';c.fillStyle='#ff2f8e';c.fillRect(MX0,548,MX1-MX0,6);c.filter='blur(14px)';c.fillRect(MX0,530,MX1-MX0,40);c.filter='blur(60px)';c.globalAlpha=.6;c.fillRect(MX0,480,MX1-MX0,200);c.restore();
  for(const x of [220,540,860]){glowDot(c,x,330,80,'#ffd9a0',.55);}
  c.fillStyle=LG(c,0,MY0,0,MY1,[[0,'rgba(0,0,0,.25)'],[1,'rgba(0,0,0,.55)']]);c.fillRect(MX0,MY0,MX1-MX0,MY1-MY0);
  // — Макс в отражении: доволен собой, трёт нос
  const M={x:520,y:760,s:1.18,f:'max',cloth:{k:'suit',jacket:'#191b21',shirt:'#eceef0',open:true},L:-1,sw:136,rim:'#ff5fb0',bt:620,look:[0,-.05],expr:{smile:.6,brow:1},turn:-.06};
  person9(c,M);
  // свет сверху на лицо
  c.save();c.globalCompositeOperation='soft-light';c.fillStyle=RG(c,520,560,10,420,[[0,`rgba(255,220,170,${.55*fl})`],[1,'rgba(255,220,170,0)']]);c.fillRect(MX0,MY0,MX1-MX0,700);c.restore();
  // рука у носа (правая — справа в отражении)
  const sh=pt9(M,128,230);arm9(c,sh,[790,1180],[650,905],{w0:92,w1:70,col:'#191b21',L:-1,cuff:'#eceef0',rim:'#ff5fb0'});
  hand9(c,640,902,-2.55,1.32,{pose:'rub',skin:FACES.max.skin,L:-1,flip:true});
  // стекло: мягкий блик и разводы
  c.save();c.globalCompositeOperation='screen';c.fillStyle=LG(c,MX0,MY0,MX1,MY1,[[0,'rgba(255,255,255,0)'],[.32,'rgba(255,255,255,0)'],[.36,'rgba(255,240,220,.07)'],[.42,'rgba(255,255,255,0)'],[1,'rgba(255,255,255,0)']]);c.fillRect(MX0,MY0,MX1-MX0,MY1-MY0);
  const r=rng(4);c.strokeStyle='rgba(255,255,255,.04)';c.lineWidth=18;for(let k=0;k<5;k++){c.beginPath();c.arc(MX0+r()*900,MY0+r()*1000,40+r()*90,0,2);c.stroke();}c.restore();
  c.restore();
  // рама зеркала
  c.save();c.strokeStyle='#b8924a';c.lineWidth=8;RR(c,MX0,MY0,MX1-MX0,MY1-MY0,18);c.stroke();c.strokeStyle='rgba(255,230,170,.5)';c.lineWidth=2;RR(c,MX0+3,MY0+3,MX1-MX0-6,MY1-MY0-6,15);c.stroke();c.restore();
  // лампа над зеркалом — латунная планка
  c.fillStyle='#6a5228';RR(c,300,232,480,30,15);c.fill();c.fillStyle=`rgba(255,236,200,${.95*fl})`;RR(c,312,250,456,8,4);c.fill();
  c.save();c.globalCompositeOperation='screen';c.filter='blur(18px)';c.fillStyle=`rgba(255,200,130,${.8*fl})`;c.fillRect(300,240,480,40);c.restore();
  // столешница — чёрный мрамор в перспективе
  const cam=cam9({f:980,cy:900,ey:150,p:.3}),CT=92;
  const top=[[-70,CT,30],[70,CT,30],[70,CT,64],[-70,CT,64]];
  quad9(c,cam,marbleDark(),[-70,CT,64],[140,0,0],[0,0,-34],10);
  { const q=[cam.P(-70,CT,64),cam.P(70,CT,64)];c.fillStyle='#0a0b0c';c.fillRect(0,MY1,WW,q[0][1]-MY1+2);
    c.save();c.globalCompositeOperation='screen';c.fillStyle=LG(c,0,q[0][1],0,HH,[[0,`rgba(255,200,140,${.22*fl})`],[.4,'rgba(255,200,140,.04)'],[1,'rgba(0,0,0,0)']]);c.fillRect(0,q[0][1],WW,HH);c.restore();}
  // раковина-чаша и смеситель
  const sk=cam.P(38,CT,48);c.fillStyle='rgba(0,0,0,.5)';c.beginPath();c.ellipse(sk[0]+10,sk[1]+30,190,46,0,0,TAU);c.fill();
  c.fillStyle=LG(c,sk[0]-180,0,sk[0]+180,0,[[0,'#d8d6d0'],[.4,'#f4f2ee'],[1,'#a9a6a0']]);c.beginPath();c.ellipse(sk[0],sk[1],175,58,0,0,TAU);c.fill();
  c.beginPath();c.moveTo(sk[0]-175,sk[1]);c.bezierCurveTo(sk[0]-170,sk[1]+120,sk[0]+170,sk[1]+120,sk[0]+175,sk[1]);c.fill();
  c.fillStyle='#8c8a86';c.beginPath();c.ellipse(sk[0],sk[1]+4,150,44,0,0,TAU);c.fill();c.fillStyle='#c7c5c0';c.beginPath();c.ellipse(sk[0],sk[1]+12,140,36,0,0,TAU);c.fill();
  const fw=cam.P(38,CT+30,63);c.strokeStyle='#b8924a';c.lineWidth=22;c.lineCap='round';c.beginPath();c.moveTo(fw[0],1395);c.lineTo(fw[0],fw[1]);c.quadraticCurveTo(fw[0],fw[1]-40,fw[0]-60,fw[1]-30);c.stroke();
  c.strokeStyle='rgba(255,230,170,.6)';c.lineWidth=5;c.beginPath();c.moveTo(fw[0]-6,1395);c.lineTo(fw[0]-6,fw[1]);c.stroke();
  // остатки дорожек и свёрнутая купюра — в расфокусе
  c.save();c.filter='blur(7px)';const d0=cam.P(-38,CT,40),d1=cam.P(-18,CT,47);c.strokeStyle='rgba(235,235,230,.55)';c.lineWidth=12;c.lineCap='round';
  c.beginPath();c.moveTo(d0[0],d0[1]);c.quadraticCurveTo((d0[0]+d1[0])/2,(d0[1]+d1[1])/2+8,d1[0],d1[1]);c.stroke();c.fillStyle='rgba(235,235,230,.35)';for(let k=0;k<26;k++){const u=r();c.fillRect(d0[0]+(d1[0]-d0[0])*u+r()*30,d0[1]+(d1[1]-d0[1])*u+r()*24-12,4,4);}
  billTube(c,d0[0]+30,d0[1]+120,-.35,330,52);c.restore();
  // твоя рука на краю столешницы (слева), рукав
  arm9(c,[-160,2100],[60,1980],[250,1830],{w0:220,w1:150,col:'#191b21',L:-1,cuff:'#eceef0'});
  hand9(c,250,1830,-.55,2.3,{pose:'flat',skin:FACES.max.skin,L:-1});
  fin9(c,{warm:'#ff9a5c',cool:'#1b2b4b',ga:.2,vig:.72,gr:.06});
  hud9(c,TXT.hud.wc,[1,1,1,0]);sub9(c,TXT.sub.wc,1200);};

/* лист героев в плоском стиле: Макс, Макс-клоун, Лёша + остальные */
SC9.sheet=(c,t)=>{c.fillStyle='#232a36';c.fillRect(0,0,WW,HH);c.fillStyle='#2b3342';c.fillRect(0,1090,WW,HH-1090);
  const top=[{x:185,f:'max',cloth:{k:'suit',jacket:'#22252d',shirt:'#eef0f2',open:true},n:'МАКС',expr:{smile:.4}},
    {x:540,f:'clown',cloth:{k:'clown'},n:'МАКС-КЛОУН',expr:{}},
    {x:895,f:'lyosha',cloth:{k:'flannel'},n:'ЛЁША',sw:96,s:1.3,y:430}];
  for(const p of top){personF(c,{y:400,s:1.45,L:-1,bt:420,sw:122,...p});tx(c,p.n,p.x,1050,{f:'J',w:500,s:26,ls:3,c:'rgba(255,255,255,.7)'});}
  const bot=[{x:135,f:'boss',cloth:{k:'suit',jacket:'#2f323a',shirt:'#e8eaee',tie:'#6a1f2a'},n:'ШЕФ',sw:128},
    {x:405,f:'yulia',cloth:{k:'parka'},n:'ЮЛЯ',sw:104},
    {x:675,f:'misha',cloth:{k:'shirt',shirt:'#1d6f6a',pattern:'rgba(230,200,90,.55)',chain:1},n:'МИША',expr:{smile:1}},
    {x:945,f:'vadim',cloth:{k:'sweater',col:'#7c8794',collar:'#e9e6df'},n:'ВАДИМ',sw:128}];
  for(const p of bot){personF(c,{y:1360,s:1.02,L:-1,bt:430,sw:118,...p});tx(c,p.n,p.x,1880,{f:'J',w:500,s:24,ls:3,c:'rgba(255,255,255,.7)'});}
};
