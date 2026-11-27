"use strict";
/* Герои «как у Династии» (27.11): плоский 2D, эмоции — веками, бровями и ртом; мешки под глазами, румянец,
   нос — тонкая линия, сторона лица подсвечена цветом сцены. Координаты: центр лица (0,0), подбородок ≈ +92. */

const DY={
  max:{skin:'#efd6c6',sh:'#c9a99f',w:56,jw:50,jy:50,cw:20,cy:92,hair:'maxD',hairC:'#16131a',iris:'#6b5a3a',bags:.5,brow:'#16131a',browT:8,nose:'max',stub:.10,ear:1},
  lyosha:{skin:'#f1e1db',sh:'#d3c0c2',w:58,jw:46,jy:44,cw:22,cy:84,hair:'bald',iris:'#6d8299',bags:.75,brow:'#bfa79b',browT:3,nose:'kid',kid:1,mask:1},
  boss:{skin:'#ecd5c8',sh:'#c9b0ab',w:60,jw:56,jy:56,cw:24,cy:94,hair:'greyD',hairC:'#c7c3c9',iris:'#4b4640',bags:.35,brow:'#a59fa6',browT:7,nose:'big',glasses:1},
  yulia:{skin:'#f2ddd3',sh:'#d2bbb8',w:52,jw:42,jy:48,cw:18,cy:88,hair:'yuliaD',hairC:'#2b1a14',iris:'#4d3b30',bags:.25,brow:'#2b1a14',browT:4,nose:'small',lashes:1},
};
DY.clown={...DY.max,paint:1,bags:.2,stub:0};

function dFace(F){const p=new Path2D(),w=F.w,jw=F.jw,jy=F.jy,cw=F.cw,cy=F.cy;
  p.moveTo(0,-104);p.bezierCurveTo(w*.8,-104,w,-70,w,-30);p.bezierCurveTo(w,0,jw*1.04,jy-14,jw,jy);
  p.bezierCurveTo(jw*.9,cy-18,cw*1.4,cy,0,cy);p.bezierCurveTo(-cw*1.4,cy,-jw*.9,cy-18,-jw,jy);p.bezierCurveTo(-jw*1.04,jy-14,-w,0,-w,-30);p.bezierCurveTo(-w,-70,-w*.8,-104,0,-104);p.closePath();return p;}

/* причёски: чёлка острыми прядями */
function dHair(F){const p=new Path2D(),w=F.w+6;
  if(F.hair==='maxD'){p.moveTo(-w+6,-4);p.lineTo(-w-2,-16);p.lineTo(-w-1,-40);p.lineTo(-w-6,-54);p.lineTo(-w-1,-68);p.quadraticCurveTo(-w-4,-92,-w*.6,-106);
    p.lineTo(-w*.5,-118);p.lineTo(-w*.3,-112);p.lineTo(-w*.12,-124);p.lineTo(w*.1,-114);p.lineTo(w*.34,-121);p.lineTo(w*.5,-108);p.quadraticCurveTo(w*.9,-104,w+3,-78);
    p.lineTo(w+1,-62);p.lineTo(w+6,-48);p.lineTo(w+1,-34);p.lineTo(w+3,-14);p.lineTo(w-6,-6);p.lineTo(w-10,-30);
    const T=[[w*.78,-34],[w*.62,-20],[w*.48,-40],[w*.3,-14],[w*.14,-38],[-w*.06,-12],[-w*.2,-36],[-w*.4,-16],[-w*.54,-40],[-w*.72,-22],[-w*.82,-46]];
    for(let k=0;k<T.length;k++){p.lineTo(T[k][0],T[k][1]);}
    p.lineTo(-w+8,-30);p.closePath();return p;}
  if(F.hair==='greyD'){p.moveTo(-w,-4);p.quadraticCurveTo(-w-6,-60,-w+16,-80);p.lineTo(-w+28,-66);p.quadraticCurveTo(-w+14,-40,-w+12,-4);p.closePath();
    p.moveTo(w,-4);p.quadraticCurveTo(w+6,-60,w-16,-80);p.lineTo(w-28,-66);p.quadraticCurveTo(w-14,-40,w-12,-4);p.closePath();return p;}
  if(F.hair==='yuliaD'){p.moveTo(-w-10,120);p.bezierCurveTo(-w-22,-60,-w*.6,-132,0,-130);p.bezierCurveTo(w*.6,-132,w+22,-60,w+10,120);p.lineTo(w-6,110);p.lineTo(w-8,-20);
    const T=[[w*.7,-30],[w*.5,-18],[w*.3,-34],[w*.1,-16],[-w*.12,-32],[-w*.34,-16],[-w*.55,-32],[-w*.75,-20]];for(const t of T)p.lineTo(t[0],t[1]);p.lineTo(-w+8,-20);p.lineTo(-w+6,110);p.closePath();return p;}
  return null;}

/* эмоции: e = neutral | tired | smirk | smile | shout | sad | shock */
function headD(c,o){const F=typeof o.f==='string'?DY[o.f]:o.f,e=o.e||'neutral',L=o.L??-1,lc=o.light||'#7fd6c0';
  c.save();c.translate(o.x,o.y);c.scale(o.s,o.s);
  const fp=dFace(F),skin=F.paint?'#f4f2f0':F.skin;
  // уши
  if(!F.paint||true){for(const sd of [-1,1]){c.fillStyle=F.skin;c.beginPath();c.ellipse(sd*(F.w+2),2,8,13,0,0,TAU);c.fill();c.fillStyle=F.sh;c.beginPath();c.ellipse(sd*(F.w+3),3,3.5,7,0,0,TAU);c.fill();}}
  c.fillStyle=skin;c.fill(fp);c.save();c.clip(fp);
  c.fillStyle=RG(c,0,-10,10,F.w*1.25,[[0,'rgba(255,250,245,.22)'],[.6,'rgba(255,255,255,0)'],[1,rgba(F.sh,.55)]]);c.fillRect(-120,-140,240,260);
  // свет сцены — жёсткой полосой по одной стороне лица
  const S=-L;c.fillStyle=rgba(lc,.5);c.beginPath();c.moveTo(S*F.w*.52,-120);c.lineTo(S*F.w*.46,120);c.lineTo(S*(F.w+40),120);c.lineTo(S*(F.w+40),-120);c.closePath();c.fill();
  // тень от чёлки и под подбородком
  const hp=dHair(F);if(hp){c.save();c.translate(0,8);c.fillStyle=rgba(F.sh,.7);c.fill(hp);c.restore();}
  // щетина
  if(F.stub){c.fillStyle=`rgba(70,70,90,${F.stub})`;c.beginPath();c.moveTo(-F.jw,F.jy-14);c.bezierCurveTo(-F.jw*.9,F.cy-12,-F.cw,F.cy+2,0,F.cy+2);c.bezierCurveTo(F.cw,F.cy+2,F.jw*.9,F.cy-12,F.jw,F.jy-14);c.lineTo(F.jw*.5,F.jy-4);c.quadraticCurveTo(0,F.jy+10,-F.jw*.5,F.jy-4);c.closePath();c.fill();}
  // мешки под глазами и румянец
  const ey=F.kid?6:-6,ex=F.kid?23:22;
  for(const sd of [-1,1]){c.save();c.filter='blur(3px)';c.fillStyle=`rgba(120,96,150,${F.bags*.6})`;c.beginPath();c.ellipse(sd*ex,ey+13,15,6,0,0,TAU);c.fill();
    if(e==='shout'||e==='smile'||e==='shock'||o.blush){c.fillStyle='rgba(235,110,120,.42)';c.beginPath();c.ellipse(sd*(ex+8),ey+30,14,8,0,0,TAU);c.fill();}c.restore();}
  if(o.sweat){c.fillStyle='rgba(200,230,255,.9)';c.beginPath();c.moveTo(-F.w*.72,-46);c.quadraticCurveTo(-F.w*.62,-30,-F.w*.72,-24);c.quadraticCurveTo(-F.w*.82,-30,-F.w*.72,-46);c.fill();}
  // клоунский грим: чёрные полосы через глаза
  if(F.paint){c.strokeStyle='#1a1416';c.lineWidth=3;c.lineCap='round';for(const sd of [-1,1]){c.beginPath();c.moveTo(sd*ex,ey-36);c.lineTo(sd*ex,ey-12);c.moveTo(sd*ex,ey+8);c.lineTo(sd*(ex+1),ey+34);c.stroke();}}
  c.restore();
  // глаза
  const lk=o.look||[0,0];
  const EK=F.kid?1.15:1.32;for(const sd of [-1,1]){const x=sd*ex+lk[0]*2,y=ey+lk[1]*2;c.save();c.translate(x,y);c.scale(EK,EK);c.translate(-x,-y);
    let lid=e==='tired'||e==='sad'?.55:e==='smirk'?.45:e==='shout'||e==='shock'?-.1:.3;   // сколько радужки закрыто веком
    const open=e==='shock'?9:e==='shout'?8:7.5;
    c.save();c.beginPath();c.ellipse(x,y,12,open,0,0,TAU);c.clip();
    c.fillStyle='#f6f2f2';c.fillRect(x-14,y-12,28,24);c.fillStyle=F.iris;c.beginPath();c.arc(x+lk[0]*2,y+1,e==='shock'?4.5:6.5,0,TAU);c.fill();
    c.fillStyle='#120e12';c.beginPath();c.arc(x+lk[0]*2,y+1,e==='shock'?2:3,0,TAU);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(x+lk[0]*2-2,y-1.5,1.4,0,TAU);c.fill();
    if(lid>0){c.fillStyle=skin;c.fillRect(x-14,y-14,28,14*lid+(open*.7));}c.restore();
    // верхнее веко — толстая линия с хвостиком
    const ly=y-open+lid*13+.5,sl=e==='sad'?3:e==='smirk'?-1:0;
    c.strokeStyle='#17121a';c.lineWidth=3.6;c.lineCap='round';c.beginPath();c.moveTo(x-sd*12,ly+(sd>0?-sl:sl)*.3);c.quadraticCurveTo(x,ly-2.5,x+sd*13,ly+sl);c.stroke();
    c.lineWidth=2.4;c.beginPath();c.moveTo(x+sd*12,ly+sl);c.lineTo(x+sd*16,ly+sl-3);c.stroke();
    if(F.lashes){c.lineWidth=2;c.beginPath();c.moveTo(x+sd*9,ly-1);c.lineTo(x+sd*12,ly-5);c.stroke();}
    c.strokeStyle='rgba(60,40,60,.45)';c.lineWidth=1.6;c.beginPath();c.moveTo(x-sd*9,y+open-1);c.quadraticCurveTo(x,y+open+1.5,x+sd*10,y+open-2);c.stroke();
    // брови (под чёлкой видны краем)
    const by=ey-20+(e==='shout'?4:e==='sad'?-2:0),tilt=e==='shout'?-.3:e==='sad'?.28:e==='smirk'?-.1:0;
    c.save();c.translate(x,by);c.rotate(sd*tilt);c.fillStyle=F.brow;c.beginPath();c.moveTo(-13,F.browT*.5);c.lineTo(13,F.browT*.2);c.lineTo(12,-F.browT*.5);c.lineTo(-13,-F.browT*.4);c.closePath();c.fill();c.restore();c.restore();}
  // нос — мягкая тень по центру + «( )»
  if(o.noseStyle!=='hook'&&!F.kid){c.save();c.filter='blur(4px)';c.fillStyle=rgba(F.sh,.55);RR(c,-8-L*2,ey-6,16,ey+40-(ey-6),8);c.fill();c.restore();
    c.strokeStyle=rgba('#6a4a50',.75);c.lineWidth=2.4;c.lineCap='round';c.beginPath();c.arc(-3,ey+34,6.5,Math.PI*.72,Math.PI*1.22);c.stroke();c.beginPath();c.arc(3,ey+34,6.5,-Math.PI*.22,Math.PI*.28);c.stroke();}
  else{
  // нос — линия-крючок
  c.strokeStyle=rgba('#5a4048',.8);c.lineWidth=2.6;c.lineCap='round';c.lineJoin='round';c.beginPath();
  if(F.nose==='kid'){c.arc(-L*2,ey+20,4,.3,2.6);}
  else if(F.nose==='small'){c.moveTo(-L*3,ey+6);c.quadraticCurveTo(-L*7,ey+22,-L*2,ey+26);c.lineTo(L*2,ey+25);}
  else{const k=F.nose==='big'?1.2:1;c.moveTo(-L*2,ey+2);c.quadraticCurveTo(-L*7*k,ey+26,-L*7*k,ey+30);c.quadraticCurveTo(-L*5,ey+36,0,ey+35);c.quadraticCurveTo(L*4,ey+36,L*6,ey+32);}
  c.stroke();}
  if(F.paint){c.fillStyle='#e8262f';c.beginPath();c.arc(0,ey+30,10,0,TAU);c.fill();c.fillStyle='rgba(255,255,255,.7)';c.beginPath();c.arc(-3,ey+26,3,0,TAU);c.fill();}
  // рот
  const my=F.kid?54:58;c.strokeStyle='#4a2a30';c.lineWidth=3.4;c.beginPath();
  if(e==='shout'||e==='shock'){const h=e==='shout'?26:14,w2=e==='shout'?16:9;c.fillStyle='#5c1620';c.beginPath();c.moveTo(-w2,my-4);c.quadraticCurveTo(0,my-10,w2,my-4);c.quadraticCurveTo(w2+2,my+h,0,my+h+2);c.quadraticCurveTo(-w2-2,my+h,-w2,my-4);c.fill();
    c.fillStyle='#fbf8f6';c.beginPath();c.moveTo(-w2+2,my-4);c.quadraticCurveTo(0,my-9,w2-2,my-4);c.lineTo(w2-3,my+1);c.quadraticCurveTo(0,my-2,-w2+3,my+1);c.fill();
    if(e==='shout'){c.fillStyle='#e07a86';c.beginPath();c.ellipse(0,my+h-4,10,6,0,0,TAU);c.fill();}}
  else if(e==='smile'){c.moveTo(-14,my-3);c.quadraticCurveTo(0,my+10,14,my-3);c.stroke();}
  else if(e==='smirk'){c.moveTo(-12,my+1);c.quadraticCurveTo(2,my+4,14,my-6);c.stroke();}
  else if(e==='sad'){c.moveTo(-11,my+4);c.quadraticCurveTo(0,my-5,11,my+4);c.stroke();}
  else{c.moveTo(-11,my+1);c.quadraticCurveTo(0,my+3,11,my);c.stroke();}
  if(F.paint&&!(e==='shout'||e==='shock')){c.strokeStyle='rgba(200,30,40,.85)';c.lineWidth=9;c.beginPath();c.moveTo(-24,my-4);c.quadraticCurveTo(0,my+16,26,my-8);c.stroke();}
  // волосы: чёрные, тонкие серые линии-блики, торчащие волоски
  if(hp){c.fillStyle=F.hairC;c.fill(hp);c.save();c.clip(hp);c.strokeStyle=rgba(tk(F.hairC,.4),.55);c.lineWidth=2;
    for(const k of [-1.5,-.2,1.1]){c.beginPath();c.moveTo(k*18,-112);c.quadraticCurveTo(k*22,-92,k*26-6,-70);c.stroke();}c.restore();}
  if(F.hair==='bald'){c.save();c.clip(fp);c.fillStyle='rgba(255,255,255,.35)';c.beginPath();c.ellipse(-F.w*.35,-80,18,9,-.5,0,TAU);c.fill();c.restore();}
  if(F.glasses){c.strokeStyle='#29242a';c.lineWidth=3;for(const sd of [-1,1]){RR(c,sd*ex-15,ey-11,30,22,6);c.stroke();}c.beginPath();c.moveTo(-ex+15,ey-3);c.lineTo(ex-15,ey-3);c.stroke();}
  if(F.mask){c.fillStyle='#a9d7e8';RR(c,-30,F.cy-12,60,30,9);c.fill();c.fillStyle='rgba(255,255,255,.5)';c.fillRect(-26,F.cy-3,52,3);c.fillRect(-26,F.cy+6,52,3);
    c.strokeStyle='#d5ecf4';c.lineWidth=3;for(const sd of [-1,1]){c.beginPath();c.moveTo(sd*30,F.cy-8);c.lineTo(sd*(F.w-2),4);c.stroke();}}
  c.restore();}

/* тело: шея-прямоугольник, плечи округлые; o.cloth {k:'suit'|'clown'|'flannel'|'parka', jacket, shirt, tie, open} */
function bodyD(c,o){const F=typeof o.f==='string'?DY[o.f]:o.f,L=o.L??-1,C=o.cloth,sw=o.sw||118,lc=o.light||'#7fd6c0',S=-L;
  c.save();c.translate(o.x,o.y);c.scale(o.s,o.s);
  // шея
  const nw=F.kid?20:26,ny=F.cy+34;c.fillStyle=F.skin;c.fillRect(-nw,F.jy,nw*2,ny-F.jy+30);c.fillStyle=F.sh;c.beginPath();c.moveTo(-nw,F.jy+16);c.lineTo(0,F.cy+12);c.lineTo(nw,F.jy+16);c.lineTo(nw,F.cy+18);c.lineTo(-nw,F.cy+18);c.closePath();c.fill();
  c.save();c.beginPath();c.rect(-nw,F.jy,nw*2,ny-F.jy+30);c.clip();c.fillStyle=rgba(lc,.45);c.fillRect(S>0?F.w*.46:-F.w*2,F.jy,F.w*1.54,ny-F.jy+30);c.restore();
  const bt=o.bt||420,T=new Path2D();T.moveTo(-nw-6,ny);T.quadraticCurveTo(-sw*.9,ny+2,-sw,ny+60);T.lineTo(-sw*1.02,bt);T.lineTo(sw*1.02,bt);T.lineTo(sw,ny+60);T.quadraticCurveTo(sw*.9,ny+2,nw+6,ny);T.closePath();
  const base={suit:C.jacket,clown:'#f2c22e',flannel:'#b57f4c',parka:'#5f5e44'}[C.k];
  c.fillStyle=base;c.fill(T);c.save();c.clip(T);
  if(C.k==='clown'){c.fillStyle='#e4402f';for(let y=ny;y<bt+40;y+=50)for(let x=-sw*1.1+((y-ny)/50%2)*25;x<sw*1.1;x+=50){c.beginPath();c.arc(x,y+22,9,0,TAU);c.fill();}}
  if(C.k==='flannel'){c.fillStyle='rgba(90,52,28,.55)';for(let x=-sw*1.1;x<sw*1.1;x+=44)c.fillRect(x,ny,15,bt);for(let y=ny;y<bt;y+=44)c.fillRect(-sw*1.1,y,sw*2.2,15);}
  c.fillStyle=LG(c,0,ny,0,bt,[[0,'rgba(255,255,255,.06)'],[1,'rgba(0,0,0,.28)']]);c.fillRect(-sw*1.2,ny,sw*2.4,bt);
  c.fillStyle=rgba(lc,.35);c.beginPath();c.moveTo(S*sw*.72,ny);c.lineTo(S*sw*.68,bt);c.lineTo(S*sw*1.2,bt);c.lineTo(S*sw*1.2,ny);c.closePath();c.fill();
  // руки — складка у плеча
  c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=4;for(const sd of [-1,1]){c.beginPath();c.moveTo(sd*sw*.7,ny+70);c.quadraticCurveTo(sd*sw*.66,ny+200,sd*sw*.72,bt);c.stroke();}
  c.restore();
  // ворот
  if(C.k==='suit'){const sh_=C.shirt||'#eef0f2';c.fillStyle=sh_;c.beginPath();c.moveTo(-nw-6,ny-2);c.lineTo(nw+6,ny-2);c.lineTo(14,ny+200);c.lineTo(-14,ny+200);c.closePath();c.fill();
    if(C.open){c.fillStyle=F.skin;c.beginPath();c.moveTo(-nw+2,ny-2);c.lineTo(0,ny+46);c.lineTo(nw-2,ny-2);c.closePath();c.fill();}
    if(C.tie){c.fillStyle=C.tie;c.beginPath();c.moveTo(-7,ny+4);c.lineTo(7,ny+4);c.lineTo(11,ny+150);c.lineTo(0,ny+164);c.lineTo(-11,ny+150);c.closePath();c.fill();}
    for(const sd of [-1,1]){c.fillStyle=sh_;c.beginPath();c.moveTo(sd*(nw-2),ny-8);c.lineTo(sd*(nw+14),ny);c.lineTo(sd*(nw+6),ny+32);c.lineTo(sd*(C.open?8:3),ny+16);c.closePath();c.fill();
      c.fillStyle=tk(C.jacket,-.25);c.beginPath();c.moveTo(sd*(nw+8),ny-2);c.lineTo(sd*(nw+40),ny+66);c.lineTo(sd*(nw+28),ny+78);c.lineTo(sd*(nw+38),ny+92);c.lineTo(sd*12,ny+240);c.lineTo(sd*(nw+2),ny+14);c.closePath();c.fill();}}
  if(C.k==='flannel'){for(const sd of [-1,1]){c.fillStyle='#9a6a3c';c.beginPath();c.moveTo(sd*(nw-4),ny-6);c.lineTo(sd*(nw+20),ny+2);c.lineTo(sd*(nw+6),ny+36);c.lineTo(sd*4,ny+18);c.closePath();c.fill();}}
  if(C.k==='parka'){c.fillStyle='#29282c';c.beginPath();c.moveTo(-nw-6,ny-4);c.lineTo(0,ny+40);c.lineTo(nw+6,ny-4);c.lineTo(nw+10,ny+260);c.lineTo(-nw-10,ny+260);c.closePath();c.fill();
    c.fillStyle='#4f4e37';for(const sd of [-1,1]){c.beginPath();c.moveTo(sd*(nw+4),ny-12);c.quadraticCurveTo(sd*(nw+50),ny-6,sd*(nw+56),ny+30);c.lineTo(sd*(nw+14),ny+30);c.closePath();c.fill();}}
  if(C.k==='clown'){const n=16;for(const [r,col] of [[94,'#ffffff'],[68,'#5fb7e8']]){c.beginPath();for(let k=0;k<=n;k++){const a=Math.PI*(1+k/n),R=k%2?r:r*.8;c.lineTo(Math.cos(a)*R*1.2,ny-4-Math.sin(a)*R*.4);}
      for(let k=n;k>=0;k--){const a=Math.PI*(k/n),R=k%2?r:r*.8;c.lineTo(Math.cos(a)*R*1.2,ny-4+Math.sin(a)*R*.5);}c.closePath();c.fillStyle=col;c.fill();}
    for(const [k,col] of [[0,'#e4402f'],[1,'#2e7fd6'],[2,'#3bb05a']]){c.fillStyle=col;c.beginPath();c.arc(0,ny+86+k*86,14,0,TAU);c.fill();}}
  c.restore();}

function personD(c,o){bodyD(c,o);headD(c,o);}
