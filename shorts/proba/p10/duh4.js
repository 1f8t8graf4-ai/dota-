/* «Духless» · вариант 4 — плоская векторная мультграфика как в тиктоке @uwas2017, только аккуратнее.
   0–3,5 карусель → наезд в лампу на фото → 4,1 та же лампа уже нарисована: квартира над Москвой → 5,7 часы (03:14) → 7,0 герой у окна. */
(function(){
CLIP.fonts=['600 82px Man','700 80px Osw','600 40px Osw','700 30px Mont'];
const C={bg0:'#0b1222',bg1:'#141f37',bg2:'#1c2a48',far:'#17223b',mid:'#1e2c4b',twr:'#243557',win:'#f4d48c',winC:'#bcc8e4',org:'#F6B35A',ink:'#0e1320'};
/* ---------- плоский город (мир 1300×1100, земля 1000) ---------- */
let CITY=null;const CWd=1300,CHd=1100,GYd=1000;
function buildCity(){const S=2,K=mk(CWd*S,CHd*S),c=K.getContext('2d');c.scale(S,S);const r=rng(23);
  c.fillStyle=lg(c,0,0,0,GYd,[[0,C.bg0],[0.6,C.bg1],[1,C.bg2]]);c.fillRect(0,0,CWd,CHd);
  for(let i=0;i<160;i++){c.fillStyle=`rgba(220,230,255,${0.15+0.5*r()})`;const s=0.6+r()*1.6;c.fillRect(r()*CWd,r()*GYd*0.7,s,s);}
  const grid=(x,y,w,h,col,p,fh,cw)=>{for(let yy=y+10;yy<y+h-6;yy+=fh)for(let xx=x+7;xx<x+w-8;xx+=cw)if(r()<p){c.globalAlpha=0.55+0.45*r();c.fillStyle=r()<0.8?col:C.winC;c.fillRect(xx,yy,cw*0.46,fh*0.42);}c.globalAlpha=1;};
  let x=-10;while(x<CWd){const w=50+r()*90,h=140+r()*260;c.fillStyle=C.far;c.fillRect(x,GYd-h,w,h);grid(x,GYd-h,w,h,C.winC,0.22,22,18);x+=w+4+r()*10;}
  const T=[[150,95,520,'imp'],[300,110,640,'cap'],[440,92,560,'evo'],[600,150,880,'fed'],[760,118,760,'merc'],[905,120,820,'oko'],[1050,100,620,'neva'],[1190,96,560,'oko']];
  for(const [tx,w,h,k] of T){c.fillStyle=C.twr;c.beginPath();
    if(k==='fed'){c.moveTo(tx-w/2,GYd);c.lineTo(tx-w/2,GYd-0.66*h);c.quadraticCurveTo(tx-w/2,GYd-0.9*h,tx+0.1*w,GYd-h);c.lineTo(tx+w/2,GYd-0.72*h);c.lineTo(tx+w/2,GYd);}
    else if(k==='merc'){for(const q of [[-.5,0],[-.5,-.6],[-.36,-.6],[-.36,-.85],[-.18,-1],[.18,-1],[.36,-.85],[.36,-.6],[.5,-.6],[.5,0]])c.lineTo(tx+q[0]*w,GYd+q[1]*h);}
    else if(k==='imp'){c.moveTo(tx-w/2,GYd);c.lineTo(tx-w/2,GYd-0.85*h);c.quadraticCurveTo(tx,GYd-1.08*h,tx+w/2,GYd-0.85*h);c.lineTo(tx+w/2,GYd);}
    else if(k==='neva'||k==='oko'){c.moveTo(tx-w/2,GYd);c.lineTo(tx-w/2,GYd-h+22);c.lineTo(tx+w/2,GYd-h);c.lineTo(tx+w/2,GYd);}
    else if(k==='evo'){for(let j=0;j<=24;j++){const y=GYd-h*j/24,o=w*0.16*Math.sin(j*0.32),ww=w*(0.82+0.18*Math.cos(j*0.32));c.lineTo(tx+o-ww/2,y);}for(let j=24;j>=0;j--){const y=GYd-h*j/24,o=w*0.16*Math.sin(j*0.32),ww=w*(0.82+0.18*Math.cos(j*0.32));c.lineTo(tx+o+ww/2,y);}}
    else if(k==='cap'){const N=7,off=[0,10,-8,12,-9,8,-10];for(let j=0;j<N;j++){const y0=GYd-h*j/N,y1=GYd-h*(j+1)/N,o=off[j];c.lineTo(tx+o-w/2,y0);c.lineTo(tx+o-w/2,y1);}for(let j=N-1;j>=0;j--){const y0=GYd-h*j/N,y1=GYd-h*(j+1)/N,o=off[j];c.lineTo(tx+o+w/2,y1);c.lineTo(tx+o+w/2,y0);}}
    c.closePath();c.fill();c.save();c.clip();
    c.fillStyle='rgba(255,255,255,0.035)';c.fillRect(tx,GYd-h*1.1,w/2,h*1.1);grid(tx-w/2,GYd-h*1.08,w,h*1.08,C.win,0.4,20,16);c.restore();
    if(k==='fed'){c.strokeStyle=C.twr;c.lineWidth=3;c.beginPath();c.moveTo(tx+0.1*w,GYd-h);c.lineTo(tx+0.1*w,GYd-h-90);c.stroke();}}
  x=-10;while(x<CWd){const w=60+r()*120,h=50+r()*120;c.fillStyle=C.mid;c.fillRect(x,GYd-h,w,h);grid(x,GYd-h,w,h,C.win,0.3,18,15);x+=w+2;}
  c.fillStyle='#0d1527';c.fillRect(0,GYd,CWd,CHd-GYd);return K;}
function cityAt(c,cx,cy,s){c.drawImage(CITY,cx-CWd*s/2,cy-CHd*s/2,CWd*s,CHd*s);}
function dust(c,t,seed,n){const r=rng(seed);c.save();for(let i=0;i<n;i++){const x=(r()*W+t*(6+r()*14))%W,y=(r()*H-t*(4+r()*10)+H)%H,s=1+r()*2.2;c.globalAlpha=0.12+0.35*r()*(0.6+0.4*Math.sin(t*2+i));c.fillStyle='#dfe7ff';c.fillRect(x,y,s,s);}c.restore();}

/* ---------- план 1: квартира над Москвой ---------- */
const LMP=[[372,520,62],[470,600,62],[568,560,62]]; // лампы: x, y низа, радиус
function lamp(c,x,y,rad,t,i){c.strokeStyle='#3a4258';c.lineWidth=3;c.beginPath();c.moveTo(x,-10);c.lineTo(x,y-rad*0.32);c.stroke();
  const fl=0.92+0.08*Math.sin(t*3+i*2);c.save();c.globalCompositeOperation='lighter';c.fillStyle=rg(c,x,y,0,x,y,rad*4.2,[[0,`rgba(255,200,120,${0.45*fl})`],[0.35,`rgba(255,170,90,${0.12*fl})`],[1,'rgba(255,160,80,0)']]);c.fillRect(x-rad*4.2,y-rad*4.2,rad*8.4,rad*8.4);c.restore();
  c.fillStyle='#d9a45a';c.beginPath();c.ellipse(x,y-rad*0.15,rad,rad*0.42,0,Math.PI,0);c.closePath();c.fill();
  c.fillStyle='#ffe2a6';c.beginPath();c.ellipse(x,y-rad*0.15,rad,rad*0.2,0,0,Math.PI);c.fill();c.fillStyle='#fff6dc';ell(c,x,y-rad*0.06,rad*0.5,rad*0.1);c.fill();}
function apart(c,t){
  c.fillStyle=C.bg0;c.fillRect(0,0,W,H);cityAt(c,560+12*Math.sin(t*0.3),700,1.06);
  c.fillStyle=lg(c,0,980,0,1180,[[0,'rgba(11,18,34,0)'],[1,'rgba(11,18,34,0.85)']]);c.fillRect(0,980,W,200);
  for(const mx of [-6,348,712,1074]){c.fillStyle='#0a0f1c';c.fillRect(mx,0,14,1190);c.fillStyle='rgba(140,165,220,0.18)';c.fillRect(mx+11,0,2,1190);}
  c.fillStyle='#0a0f1c';c.fillRect(0,0,W,86);c.fillRect(0,1180,W,18);
  c.fillStyle=lg(c,0,1198,0,H,[[0,'#2a2430'],[1,'#120f17']]);c.fillRect(0,1198,W,H-1198);
  c.save();c.globalAlpha=0.16;c.translate(0,2*1198);c.scale(1,-0.45);cityAt(c,560,700,1.06);c.restore();
  c.strokeStyle='rgba(235,225,215,0.75)';c.lineWidth=3;ell(c,540,1560,300,62);c.stroke();
  // диван
  c.fillStyle='#6f5f61';rr(c,150,1035,780,250,30);c.fill();c.fillStyle='#7f6e70';for(let k=0;k<4;k++){rr(c,178+k*186,970,176,190,26);c.fill();}
  c.fillStyle='#655557';rr(c,110,1060,92,250,28);c.fill();rr(c,878,1060,92,250,28);c.fill();
  c.fillStyle='rgba(0,0,0,0.25)';c.fillRect(150,1270,780,16);c.fillStyle='#8c7b7d';for(let k=0;k<4;k++){rr(c,184+k*186,976,164,16,8);c.fill();}
  c.fillStyle='rgba(0,0,0,0.35)';ell(c,540,1302,420,24);c.fill();
  // бокал
  const gx=560,gy=1545;c.strokeStyle='rgba(235,240,250,0.9)';c.lineWidth=3;c.beginPath();c.moveTo(gx,gy);c.lineTo(gx,gy-70);c.stroke();ell(c,gx,gy,26,7);c.stroke();
  c.beginPath();c.moveTo(gx-30,gy-150);c.quadraticCurveTo(gx-32,gy-72,gx,gy-70);c.quadraticCurveTo(gx+32,gy-72,gx+30,gy-150);c.stroke();
  c.fillStyle='#8e1b2c';c.beginPath();c.moveTo(gx-29,gy-118);c.quadraticCurveTo(gx-28,gy-74,gx,gy-73);c.quadraticCurveTo(gx+28,gy-74,gx+29,gy-118);c.closePath();c.fill();
  c.fillStyle='rgba(255,255,255,0.55)';c.fillRect(gx-20,gy-146,4,40);
  LMP.forEach((L,i)=>lamp(c,L[0],L[1]+5*Math.sin(t*0.9+i),L[2],t,i));
  dust(c,t,4,70);}

/* ---------- план 2: часы на руке, 03:14 ---------- */
function watch(c,t){
  c.fillStyle=rg(c,540,900,100,540,900,1300,[[0,'#1d2a47'],[1,'#080d19']]);c.fillRect(0,0,W,H);dust(c,t,6,90);
  const u=inv(5.7,7.0,t),s=1+0.05*u,rot=-0.42;c.save();c.translate(540,900);c.scale(s,s);c.rotate(rot);
  c.fillStyle='#e7b796';c.beginPath();c.moveTo(-200,-122);c.lineTo(1400,-104);c.lineTo(1400,104);c.lineTo(-200,122);c.closePath();c.fill();c.fillStyle='#d4a084';c.beginPath();c.moveTo(-200,46);c.lineTo(1400,40);c.lineTo(1400,104);c.lineTo(-200,122);c.closePath();c.fill();c.fillStyle='rgba(255,255,255,0.18)';c.fillRect(-200,-92,1600,20);
  c.fillStyle='#1b2236';rr(c,-1400,-175,1150,350,40);c.fill();c.fillStyle='#232c45';c.fillRect(-1400,-175,1150,72);c.fillStyle='#10172a';c.fillRect(-1400,120,1150,55);
  c.fillStyle='#eef1f6';rr(c,-300,-150,112,300,16);c.fill();c.fillStyle='#cfd6e2';c.fillRect(-300,60,112,90);c.fillStyle='#b9a26a';ell(c,-244,0,10,10);c.fill();
  for(let k=-6;k<=6;k++){if(Math.abs(k)<2)continue;const y=k*60;c.fillStyle=(k%2)?'#c9ced8':'#d9b462';rr(c,-110,y-26,220,52,10);c.fill();c.fillStyle='rgba(0,0,0,0.18)';c.fillRect(-110,y+16,220,8);c.fillStyle=(k%2)?'#e9edf3':'#f2d48c';c.fillRect(-36,y-26,72,52);}
  c.restore();
  c.save();c.translate(540,900);c.scale(s,s);
  c.fillStyle='rgba(0,0,0,0.35)';ell(c,14,18,250,250);c.fill();
  c.fillStyle=lg(c,-240,-240,240,240,[[0,'#f6dc9a'],[0.45,'#c9973f'],[1,'#8a6424']]);ell(c,0,0,240,240);c.fill();
  c.fillStyle=lg(c,-200,-200,200,200,[[0,'#a57a32'],[1,'#f0d08a']]);ell(c,0,0,214,214);c.fill();
  c.fillStyle=rg(c,-40,-60,10,0,0,200,[[0,'#1d2a44'],[1,'#0b1120']]);ell(c,0,0,200,200);c.fill();
  for(let k=0;k<60;k++){const a=k/60*TAU,big=k%5===0;c.save();c.rotate(a);c.fillStyle=big?'#e8c477':'rgba(230,236,248,0.55)';if(big)c.fillRect(-5,-186,10,34);else c.fillRect(-1.4,-186,2.8,12);c.restore();}
  txt(c,'AUTOMATIC',0,70,{font:'700 22px Mont',fill:'rgba(232,196,119,0.8)',ls:4});
  const sec=Math.floor(t-5.7)+7,ha=(3+14/60)/12*TAU,ma=(14+sec/60)/60*TAU,sa=sec/60*TAU;
  const hand=(a,len,w,col)=>{c.save();c.rotate(a);c.fillStyle=col;rr(c,-w/2,-len,w,len+26,w/2);c.fill();c.restore();};
  hand(ha,110,16,'#f0cf86');hand(ma,165,11,'#f0cf86');c.save();c.rotate(sa);c.fillStyle='#e0473c';c.fillRect(-2.5,-180,5,215);c.restore();
  c.fillStyle='#f0cf86';ell(c,0,0,14,14);c.fill();
  const g=inv(6.0,6.7,t);if(g>0&&g<1){c.save();ell(c,0,0,200,200);c.clip();c.rotate(-0.6);const gx=lerp(-380,380,E.ioS(g));c.fillStyle=lg(c,gx-90,0,gx+90,0,[[0,'rgba(255,255,255,0)'],[0.5,'rgba(255,255,255,0.22)'],[1,'rgba(255,255,255,0)']]);c.fillRect(gx-90,-300,180,600);c.restore();}
  c.restore();}

/* ---------- план 3: герой у окна ---------- */
function face(c){c.beginPath();c.moveTo(-150,-110);c.bezierCurveTo(-156,40,-122,148,-56,198);c.quadraticCurveTo(0,224,56,198);c.bezierCurveTo(122,148,156,40,150,-110);c.bezierCurveTo(150,-196,88,-238,0,-238);c.bezierCurveTo(-88,-238,-150,-196,-150,-110);c.closePath();}
function hero(c,t){
  const sk='#e3bba1',skS='#c09681',ink=C.ink,blinkT=[7.95,9.35],bl=Math.max(...blinkT.map(b=>1-Math.abs(t-b)/0.09)),lid=clamp(bl),smirk=E.ioS(inv(8.3,8.8,t)),br=Math.sin(t*1.6)*3;
  c.save();c.lineJoin='round';c.lineCap='round';
  // плечи и пиджак
  c.save();c.translate(0,br*0.6);
  c.fillStyle='#1a2337';c.beginPath();c.moveTo(-420,760);c.lineTo(-400,420);c.bezierCurveTo(-380,330,-250,300,-120,285);c.lineTo(120,285);c.bezierCurveTo(250,300,380,330,400,420);c.lineTo(420,760);c.closePath();c.fill();c.strokeStyle=ink;c.lineWidth=6;c.stroke();
  c.fillStyle='#121a2b';c.beginPath();c.moveTo(60,290);c.bezierCurveTo(200,310,330,350,380,430);c.lineTo(420,760);c.lineTo(120,760);c.closePath();c.fill();
  c.fillStyle='#eef1f6';c.beginPath();c.moveTo(-95,270);c.lineTo(95,270);c.lineTo(60,560);c.lineTo(-60,560);c.closePath();c.fill();
  c.fillStyle='#d4dae6';c.beginPath();c.moveTo(0,300);c.lineTo(95,270);c.lineTo(60,560);c.lineTo(20,560);c.closePath();c.fill();
  c.fillStyle='#7a1d2b';c.beginPath();c.moveTo(-26,318);c.lineTo(26,318);c.lineTo(18,352);c.lineTo(-18,352);c.closePath();c.fill();c.beginPath();c.moveTo(-18,352);c.lineTo(18,352);c.lineTo(34,600);c.lineTo(0,640);c.lineTo(-34,600);c.closePath();c.fill();
  c.fillStyle='#5f1622';c.beginPath();c.moveTo(2,352);c.lineTo(18,352);c.lineTo(34,600);c.lineTo(2,636);c.closePath();c.fill();
  c.fillStyle='#232f4a';c.beginPath();c.moveTo(-100,272);c.lineTo(-20,560);c.lineTo(-70,760);c.lineTo(-170,760);c.lineTo(-215,420);c.closePath();c.fill();c.beginPath();c.moveTo(100,272);c.lineTo(20,560);c.lineTo(70,760);c.lineTo(170,760);c.lineTo(215,420);c.closePath();c.fill();
  c.strokeStyle=ink;c.lineWidth=5;c.beginPath();c.moveTo(-100,272);c.lineTo(-20,560);c.lineTo(-70,760);c.moveTo(100,272);c.lineTo(20,560);c.lineTo(70,760);c.stroke();
  c.fillStyle='#ffffff';c.beginPath();c.moveTo(-95,262);c.lineTo(-20,318);c.lineTo(-70,345);c.closePath();c.fill();c.beginPath();c.moveTo(95,262);c.lineTo(20,318);c.lineTo(70,345);c.closePath();c.fill();
  c.restore();
  // шея
  c.fillStyle=skS;rr(c,-66,130,132,170,30);c.fill();c.strokeStyle=ink;c.lineWidth=5;c.beginPath();c.moveTo(-66,140);c.lineTo(-66,280);c.moveTo(66,140);c.lineTo(66,280);c.stroke();
  // голова
  c.save();c.translate(0,br);c.rotate(0.02*Math.sin(t*0.7));
  for(const sx of [-1,1]){c.fillStyle=sk;ell(c,sx*150,-22,26,46);c.fill();c.strokeStyle=ink;c.lineWidth=5;c.stroke();c.fillStyle=skS;ell(c,sx*152,-20,11,24);c.fill();}
  face(c);c.fillStyle=sk;c.fill();
  c.save();face(c);c.clip();c.fillStyle=skS;c.beginPath();c.moveTo(40,-240);c.bezierCurveTo(110,-120,120,60,30,240);c.lineTo(200,240);c.lineTo(200,-240);c.closePath();c.globalAlpha=0.55;c.fill();c.globalAlpha=0.16;c.fillStyle='#3a2c2a';c.beginPath();c.moveTo(-130,90);c.quadraticCurveTo(0,250,130,90);c.lineTo(140,240);c.lineTo(-140,240);c.closePath();c.fill();c.restore();
  face(c);c.strokeStyle=ink;c.lineWidth=6;c.stroke();
  // волосы, пробор слева, зачёс
  c.fillStyle='#2b1f1d';c.beginPath();c.moveTo(-158,-78);c.bezierCurveTo(-176,-210,-104,-292,4,-292);c.bezierCurveTo(118,-292,178,-214,160,-84);c.bezierCurveTo(150,-150,128,-176,96,-186);c.bezierCurveTo(40,-150,-20,-178,-52,-210);c.bezierCurveTo(-90,-176,-126,-150,-158,-78);c.closePath();c.fill();c.strokeStyle=ink;c.lineWidth=6;c.stroke();
  c.strokeStyle='#4c3a35';c.lineWidth=8;c.beginPath();c.moveTo(-40,-262);c.bezierCurveTo(20,-270,90,-250,128,-200);c.stroke();c.beginPath();c.moveTo(-90,-236);c.bezierCurveTo(-120,-200,-136,-160,-146,-120);c.stroke();
  // брови
  c.strokeStyle='#2b1f1d';c.lineWidth=15;c.beginPath();c.moveTo(-120,-90);c.quadraticCurveTo(-80,-104,-38,-96);c.moveTo(38,-98+(-6*smirk));c.quadraticCurveTo(80,-108-8*smirk,120,-94-4*smirk);c.stroke();
  // глаза: полуприкрыты, мешки
  for(const sx of [-1,1]){const ex=sx*72,ey=-44;c.fillStyle='rgba(120,80,90,0.28)';c.beginPath();c.ellipse(ex,ey+30,44,14,0,0,Math.PI);c.fill();
    c.save();c.beginPath();c.ellipse(ex,ey,38,19,0,0,TAU);c.clip();c.fillStyle='#f4f1ee';c.fillRect(ex-40,ey-20,80,40);c.fillStyle='#3a2b24';ell(c,ex+4,ey+3,14,14);c.fill();c.fillStyle='#0d0a0a';ell(c,ex+4,ey+3,7,7);c.fill();c.fillStyle='#fff';ell(c,ex+9,ey-2,3.5,3.5);c.fill();
      const ly=ey-20+lerp(19,40,lid);c.fillStyle=sk;c.fillRect(ex-42,ey-24,84,ly-(ey-24));c.strokeStyle=ink;c.lineWidth=5;c.beginPath();c.moveTo(ex-40,ly);c.quadraticCurveTo(ex,ly+3,ex+40,ly);c.stroke();c.restore();
    c.strokeStyle=ink;c.lineWidth=4;c.beginPath();c.ellipse(ex,ey,38,19,0,0.15*Math.PI,0.85*Math.PI);c.stroke();}
  // нос
  c.strokeStyle='#9c7462';c.lineWidth=5;c.beginPath();c.moveTo(10,-30);c.quadraticCurveTo(24,20,16,40);c.quadraticCurveTo(2,52,-14,42);c.stroke();
  // рот: ухмылка
  c.strokeStyle='#6d3d36';c.lineWidth=7;c.beginPath();c.moveTo(-46,104);c.quadraticCurveTo(0,112-4*smirk,48,100-14*smirk);c.stroke();c.lineWidth=4;c.beginPath();c.moveTo(48,100-14*smirk);c.lineTo(56,94-16*smirk);c.stroke();
  c.strokeStyle='rgba(120,70,60,0.35)';c.lineWidth=4;c.beginPath();c.moveTo(-18,128);c.quadraticCurveTo(0,134,18,128);c.stroke();
  c.restore();c.restore();}
function heroShot(c,t){
  const u=inv(7,10,t);c.fillStyle=C.bg0;c.fillRect(0,0,W,H);cityAt(c,540-30*u,760,1.18+0.04*u);
  c.fillStyle=lg(c,0,0,0,H,[[0,'rgba(8,12,24,0.2)'],[0.6,'rgba(8,12,24,0)'],[1,'rgba(8,12,24,0.7)']]);c.fillRect(0,0,W,H);
  for(const mx of [190,880]){c.fillStyle='#0a0f1c';c.fillRect(mx,0,16,H);}
  c.fillStyle='#0a0f1c';c.fillRect(0,1370,W,30);
  dust(c,t,9,60);
  c.save();c.translate(540,935);const s=1.02+0.05*E.ioS(u);c.scale(s,s);hero(c,t);c.restore();}

/* ---------- титры и шапка как у референса ---------- */
function sub(c,lines,t0,t,y){const a=E.outC(inv(t0,t0+0.12,t)),sc=lerp(1.08,1,a);if(a<=0)return;c.save();c.translate(540,y);c.scale(sc,sc);
  lines.forEach((L,i)=>txt(c,L[0],0,i*86,{font:'700 78px Osw',fill:L[1],a,stroke:'rgba(10,12,20,0.85)',sw:10,shadow:'rgba(0,0,0,0.6)',sb:8,sy:4}));c.restore();}
function tag(c){txt(c,'ДУХLESS',56,128,{font:'600 40px Osw',align:'left',fill:'#e9edf5',ls:1});c.fillStyle='rgba(233,237,245,0.35)';c.fillRect(56,156,600,2);c.fillStyle=C.org;c.fillRect(56,155,64,4);}

CLIP.init=async function(){await DC.init();CITY=buildCity();};
const LAY=mk(),LX=LAY.getContext('2d');
CLIP.draw=function(c,t,i){
  if(t<DC.T0){DC.draw(c,t);grain(c,i,0.035);return;}const tt=t;t=DC.map(t);
  if(t<4.1){const u=inv(3.5,4.1,t),z=Math.exp(Math.log(10)*E.inC(u)),L=DC.zpt(),Pp=[lerp(L[0],LMP[0][0],E.ioS(u)),lerp(L[1],LMP[0][1],E.ioS(u))];
    c.save();c.translate(Pp[0],Pp[1]);c.scale(z,z);c.translate(-L[0],-L[1]);DC.video(c,0,tt,{capA:1-inv(3.5,3.68,t)});c.restore();DC.dots(c,2,1-inv(3.5,3.65,t));
    const g=inv(3.6,4.1,t),R=60+1800*E.inQ(g);c.fillStyle=rg(c,Pp[0],Pp[1],0,Pp[0],Pp[1],R,[[0,`rgba(255,226,170,${E.inQ(g)})`],[0.4,`rgba(255,214,150,${0.8*E.inQ(g)})`],[1,'rgba(255,210,140,0)']]);c.fillRect(0,0,W,H);
    c.fillStyle=`rgba(255,226,170,${E.inC(g)})`;c.fillRect(0,0,W,H);return;}
  reset(LX);LX.clearRect(0,0,W,H);
  if(t<5.7){const v=inv(4.1,5.0,t),z=1+2.2*(1-E.outC(v)),Lp=[LMP[0][0],LMP[0][1]];LX.save();LX.translate(Lp[0],Lp[1]);LX.scale(z,z);LX.translate(-Lp[0],-Lp[1]);const s2=1+0.04*inv(5.0,5.7,t);LX.translate(540,960);LX.scale(s2,s2);LX.translate(-540,-960);apart(LX,t);LX.restore();}
  else if(t<7.0)watch(LX,t);else heroShot(LX,t);
  c.drawImage(LAY,0,0);
  const ga=1-E.outQ(inv(4.1,4.6,t));if(ga>0){const Lp=LMP[0],R=lerp(1900,120,E.outQ(inv(4.1,4.6,t)));c.fillStyle=rg(c,Lp[0],Lp[1],0,Lp[0],Lp[1],R,[[0,`rgba(255,226,170,${ga})`],[0.45,`rgba(255,214,150,${0.85*ga})`],[1,'rgba(255,210,140,0)']]);c.fillRect(0,0,W,H);c.fillStyle=`rgba(255,226,170,${ga*ga*ga})`;c.fillRect(0,0,W,H);}
  tag(c);
  if(t<7.0)sub(c,[['ТЕБЕ 28.',C.org]],4.62,t,1340);else sub(c,[['ТЫ ДУМАЛ, ЧТО КУПИЛ','#ffffff'],['ЭТОТ ГОРОД.',C.org]],7.05,t,1300);
  grain(c,i,0.04);vig(c,0.35);
};
})();
