"use strict";
/* Герои «как в Династии про Александра» (27.11): мягкий свет градиентом, крупные миндальные глаза с тёмным зрачком,
   толстые брови, нос — мягкая тень сверху вниз, рот — маленькая линия, румянец, борода/щетина — пятном с мягким краем.
   Координаты: центр лица (0,0), подбородок ≈ +96. Цвет света сцены ложится на всю кожу (o.light, o.la). */

const AX={
  max:{skin:'#e2ad8c',w:58,jw:54,jy:50,cw:24,cy:94,top:-108,hair:'office',hairC:'#231915',iris:'#3a2a1e',brow:'#1d1410',browK:'flat',stub:.13,ex:24,ey:-6,eye:1,eyeH:.82,deep:1,browY:-15,mouth:'max',cleft:1,nose:1.1,cheek:1,sq:1,browIn:3,lips:1},
  maxMessy:null,
  lyosha:{skin:'#eccabb',w:60,jw:48,jy:50,cw:24,cy:88,top:-118,hair:'bald',iris:'#4f6a86',brow:'#c9a58d',browK:'thin',ex:24,ey:4,eye:1.08,mouth:'kid',kid:1,mask:1,nose:.75,pale:1},
  boss:{skin:'#dba68c',w:62,jw:60,jy:60,cw:30,cy:98,top:-106,hair:'grey',hairC:'#c9c4bd',iris:'#2e2620',brow:'#a39b92',browK:'bushy',ex:26,ey:-4,eye:.92,mouth:'flat',glasses:1,nose:1.25,jowl:1},
  yulia:{skin:'#ecbfa3',w:54,jw:44,jy:52,cw:20,cy:90,top:-110,hair:'long',hairC:'#2c1b13',iris:'#3a271c',brow:'#2c1b13',browK:'arch',ex:23,ey:-4,eye:1.12,mouth:'soft',lashes:1,nose:.8},
};
AX.maxMessy={...AX.max,hair:'messy'};
AX.clown={...AX.max,hair:'messy',paint:1,stub:0};

function aFace(F){const p=new Path2D(),w=F.w,jw=F.jw,jy=F.jy,cw=F.cw,cy=F.cy,t=F.top;
  p.moveTo(0,t);p.bezierCurveTo(w*.78,t,w,t*.62,w,-28);
  if(F.sq){p.bezierCurveTo(w,6,jw+1,jy-24,jw,jy);p.bezierCurveTo(jw-4,jy+16,cw+10,cy-4,cw,cy-1);p.quadraticCurveTo(0,cy+3,-cw,cy-1);p.bezierCurveTo(-cw-10,cy-4,-jw+4,jy+16,-jw,jy);p.bezierCurveTo(-jw-1,jy-24,-w,6,-w,-28);}
  else{p.bezierCurveTo(w,4,jw*1.02,jy-18,jw,jy);p.bezierCurveTo(jw*.94,cy-16,cw*1.35,cy,0,cy);p.bezierCurveTo(-cw*1.35,cy,-jw*.94,cy-16,-jw,jy);p.bezierCurveTo(-jw*1.02,jy-18,-w,4,-w,-28);}
  p.bezierCurveTo(-w,t*.62,-w*.78,t,0,t);p.closePath();return p;}

function aHair(F){const p=new Path2D(),w=F.w+5,t=F.top;
  switch(F.hair){
  case'office':// коротко, объём спереди с заносом вбок, пробор справа, лоб открыт
    p.moveTo(-w+2,-24);p.bezierCurveTo(-w-4,-60,-w-2,-98,-w*.7,-124);p.bezierCurveTo(-w*.6,-140,-w*.42,-148,-w*.22,-146);p.bezierCurveTo(-w*.05,-154,w*.18,-150,w*.34,-142);p.bezierCurveTo(w*.52,-144,w*.7,-134,w*.8,-122);
    p.bezierCurveTo(w+2,-104,w+4,-86,w+3,-60);p.lineTo(w-1,-22);p.lineTo(w-7,-28);p.bezierCurveTo(w-7,-56,w*.74,-78,w*.52,-82);
    p.lineTo(w*.43,-92);p.lineTo(w*.32,-84);p.bezierCurveTo(w*.05,-90,-w*.32,-86,-w*.58,-76);p.quadraticCurveTo(-w*.8,-66,-w+8,-48);p.lineTo(-w+8,-24);p.closePath();return p;
  case'messy':// чёлка прядями на лоб
    p.moveTo(-w+2,-22);p.bezierCurveTo(-w-5,-62,-w-2,-100,-w*.66,-126);p.bezierCurveTo(-w*.4,-146,w*.2,-148,w*.6,-132);p.bezierCurveTo(w+4,-112,w+4,-70,w+2,-22);p.lineTo(w-7,-30);
    p.bezierCurveTo(w-6,-50,w*.86,-62,w*.72,-58);p.bezierCurveTo(w*.6,-50,w*.5,-62,w*.36,-60);p.bezierCurveTo(w*.2,-46,w*.06,-64,-w*.12,-58);
    p.bezierCurveTo(-w*.28,-52,-w*.38,-70,-w*.56,-64);p.bezierCurveTo(-w*.7,-56,-w*.82,-62,-w+8,-46);p.lineTo(-w+8,-22);p.closePath();return p;
  case'grey':p.moveTo(-w,-6);p.quadraticCurveTo(-w-6,-58,-w+16,-78);p.lineTo(-w+28,-66);p.quadraticCurveTo(-w+14,-40,-w+12,-6);p.closePath();
    p.moveTo(w,-6);p.quadraticCurveTo(w+6,-58,w-16,-78);p.lineTo(w-28,-66);p.quadraticCurveTo(w-14,-40,w-12,-6);p.closePath();return p;
  case'long':p.moveTo(-w-8,110);p.bezierCurveTo(-w-18,-50,-w*.62,t-14,0,t-14);p.bezierCurveTo(w*.62,t-14,w+18,-50,w+8,110);p.lineTo(w-8,100);
    p.bezierCurveTo(w-4,0,w-10,-56,w*.3,-64);p.quadraticCurveTo(0,-56,-w*.2,-62);p.bezierCurveTo(-w+8,-58,-w+4,0,-w+8,100);p.closePath();return p;}
  return null;}

/* e: neutral | smirk | tired | shout | sad | scared | smile */
function headA(c,o){const F=typeof o.f==='string'?AX[o.f]:o.f,e=o.e||'neutral',L=o.L??-1,S=-L,lc=o.light||'#ffb070',la=o.la??.18;
  c.save();c.translate(o.x,o.y);c.scale(o.s,o.s);
  const skin=F.paint?'#f3efe9':F.skin,fp=aFace(F),w=F.w;
  // уши
  for(const sd of [-1,1]){const g=c.createRadialGradient(sd*(w+2),0,1,sd*(w+2),0,16);g.addColorStop(0,tk(F.skin,sd===L?.05:-.12));g.addColorStop(1,tk(F.skin,sd===L?-.1:-.3));c.fillStyle=g;c.beginPath();c.ellipse(sd*(w+1),2,9,15,0,0,TAU);c.fill();}
  // кожа: мягкий свет с одной стороны, тень с другой
  c.fillStyle=skin;c.fill(fp);c.save();c.clip(fp);
  c.fillStyle=LG(c,L*w,0,S*w,0,[[0,rgba(tk(skin,.14),1)],[.42,rgba(skin,1)],[.72,rgba(tk(skin,-.14),1)],[1,rgba(tk(skin,-.32),1)]]);c.fillRect(-w-20,F.top-20,2*w+40,F.cy-F.top+40);
  c.fillStyle=RG(c,L*w*.35,10,2,w*.7,[[0,'rgba(255,240,225,.22)'],[1,'rgba(255,240,225,0)']]);c.fillRect(-w-20,F.top,2*w+40,200);
  // свет сцены на всей коже
  c.fillStyle=rgba(lc,la);c.fillRect(-w-20,F.top-20,2*w+40,F.cy-F.top+40);
  if(F.pale||e==='scared'){c.fillStyle='rgba(150,170,210,.22)';c.fillRect(-w-20,F.top-20,2*w+40,F.cy-F.top+40);}
  // тень от волос и под подбородком
  const hp=aHair(F);if(hp){c.save();c.translate(S*3,9);c.filter='blur(5px)';c.fillStyle='rgba(60,30,20,.35)';c.fill(hp);c.restore();}
  c.fillStyle=LG(c,0,F.cy-28,0,F.cy,[[0,'rgba(60,30,20,0)'],[1,'rgba(60,30,20,.22)']]);c.fillRect(-w,F.cy-28,2*w,30);
  if(F.deep)for(const sd of [-1,1]){c.fillStyle=RG(c,sd*F.ex,F.ey-6,2,26,[[0,'rgba(80,40,32,.30)'],[.6,'rgba(80,40,32,.12)'],[1,'rgba(80,40,32,0)']]);c.save();c.translate(0,0);c.scale(1,.62);c.fillRect(sd*F.ex-30,(F.ey-6)/.62-30,60,60);c.restore();}
  if(F.cheek)for(const sd of [-1,1]){if(sd!==S)continue;c.save();c.filter='blur(6px)';c.fillStyle='rgba(80,40,32,.16)';c.beginPath();c.moveTo(sd*(F.w-4),F.ey+18);c.quadraticCurveTo(sd*(F.w*.62),F.ey+40,sd*(F.jw-6),F.jy+6);c.lineTo(sd*(F.w+4),F.jy);c.closePath();c.fill();c.restore();}
  // румянец
  for(const sd of [-1,1]){c.fillStyle=RG(c,sd*(F.ex+9),F.ey+30,1,15,[[0,`rgba(225,105,100,${e==='shout'||e==='smile'?.42:.22})`],[1,'rgba(225,105,100,0)']]);c.fillRect(sd*(F.ex+9)-20,F.ey+10,40,40);}
  // щетина пятном
  if(F.stub){c.save();c.filter='blur(4px)';c.fillStyle=`rgba(55,40,45,${F.stub})`;c.beginPath();c.moveTo(-F.jw+2,F.jy-22);c.bezierCurveTo(-F.jw,F.cy-6,-F.cw,F.cy+4,0,F.cy+4);c.bezierCurveTo(F.cw,F.cy+4,F.jw,F.cy-6,F.jw-2,F.jy-22);
    c.quadraticCurveTo(F.jw*.62,F.jy-2,20,F.ey+70);c.quadraticCurveTo(0,F.ey+66,-20,F.ey+70);c.quadraticCurveTo(-F.jw*.62,F.jy-2,-F.jw+2,F.jy-22);c.closePath();c.fill();c.restore();}
  if(F.jowl){c.save();c.filter='blur(3px)';c.strokeStyle='rgba(90,50,40,.25)';c.lineWidth=4;for(const sd of [-1,1]){c.beginPath();c.moveTo(sd*24,F.ey+62);c.quadraticCurveTo(sd*(F.jw-8),F.jy+10,sd*(F.jw-12),F.cy-12);c.stroke();}c.restore();}
  // нос: длинная мягкая тень с теневой стороны и тёмный кончик
  const nk=F.nose||1,nx=0;c.save();c.filter='blur(2.5px)';
  c.fillStyle='rgba(90,45,35,.30)';c.beginPath();c.moveTo(S*2,F.ey-6);c.lineTo(S*8*nk,F.ey+30*nk);c.lineTo(S*10*nk,F.ey+40*nk);c.lineTo(S*1,F.ey+42*nk);c.lineTo(S*1,F.ey-6);c.closePath();c.fill();
  c.fillStyle='rgba(90,45,35,.38)';c.beginPath();c.moveTo(-10*nk,F.ey+40*nk);c.quadraticCurveTo(0,F.ey+30*nk,10*nk,F.ey+40*nk);c.quadraticCurveTo(0,F.ey+48*nk,-10*nk,F.ey+40*nk);c.fill();
  c.fillStyle='rgba(255,235,220,.35)';c.beginPath();c.ellipse(L*3,F.ey+18*nk,2.5,13*nk,0,0,TAU);c.fill();c.restore();
  if(F.cleft){c.strokeStyle='rgba(90,45,35,.35)';c.lineWidth=2.4;c.lineCap='round';c.beginPath();c.moveTo(0,F.cy-14);c.lineTo(0,F.cy-6);c.stroke();}
  // клоун: чёрные полосы через глаза
  if(F.paint){c.strokeStyle='rgba(25,18,20,.9)';c.lineWidth=3;c.lineCap='round';for(const sd of [-1,1]){c.beginPath();c.moveTo(sd*F.ex,F.ey-34);c.lineTo(sd*F.ex,F.ey-12);c.moveTo(sd*F.ex,F.ey+10);c.lineTo(sd*(F.ex+1),F.ey+34);c.stroke();}}
  c.restore();
  // глаза
  const lk=o.look||[0,0],K=F.eye||1;
  for(const sd of [-1,1]){const x=sd*F.ex+lk[0]*2,y=F.ey;c.save();c.translate(x,y);c.scale(K*(sd<0?-1:1),K);
    const op=(F.eyeH||1)*(e==='shout'||e==='scared'?1.3:e==='tired'?.75:e==='smirk'?.85:1),lid=e==='tired'?.45:e==='smirk'?.3:e==='sad'?.35:e==='shout'||e==='scared'?0:.18;
    const eye=new Path2D();eye.moveTo(-13,1);eye.bezierCurveTo(-7,-10*op,8,-11*op,14,-1);eye.bezierCurveTo(8,7*op,-7,7*op,-13,1);eye.closePath();
    c.fillStyle='#f5f1ec';c.fill(eye);c.save();c.clip(eye);
    const ir=e==='scared'?5:7;c.fillStyle=F.iris;c.beginPath();c.arc(lk[0]*3*(sd<0?-1:1),0,ir,0,TAU);c.fill();c.fillStyle='#0d0907';c.beginPath();c.arc(lk[0]*3*(sd<0?-1:1),0,ir*.55,0,TAU);c.fill();
    c.fillStyle='#fff';c.beginPath();c.arc(lk[0]*3*(sd<0?-1:1)-2.4,-2.6,1.9,0,TAU);c.fill();
    c.fillStyle=tk(skin,-.06);c.fillRect(-16,-14,32,14*lid+(lid?5:0));c.fillStyle='rgba(0,0,0,.18)';c.fillRect(-16,-14+14*lid+(lid?5:0),32,3);c.restore();
    const ly=-10*op+14*lid*.9;c.strokeStyle='#1b120e';c.lineWidth=3.4;c.lineCap='round';c.beginPath();c.moveTo(-13.5,1);c.bezierCurveTo(-7,ly,8,ly-1,14.5,-1);c.stroke();
    if(F.lashes){c.lineWidth=2;c.beginPath();c.moveTo(13,-2);c.lineTo(17,-5);c.stroke();}
    c.strokeStyle='rgba(90,50,40,.35)';c.lineWidth=1.6;c.beginPath();c.moveTo(-9,ly-6);c.quadraticCurveTo(0,ly-10,10,ly-6);c.stroke();
    c.restore();
    // брови
    const by=F.ey+(F.browY??-19)+(e==='shout'?3:e==='sad'||e==='scared'?-3:e==='smirk'?1:0),inner=e==='sad'||e==='scared'?-5:e==='shout'?5:e==='smirk'?2:(F.browIn??1.5);
    c.fillStyle=F.brow;c.beginPath();const bx=sd*F.ex;
    if(F.browK==='thin'){c.moveTo(bx-sd*10,by+inner*.6);c.quadraticCurveTo(bx,by-5,bx+sd*12,by);c.lineTo(bx+sd*11,by-2);c.quadraticCurveTo(bx,by-8,bx-sd*10,by+inner*.6-2);}
    else if(F.browK==='arch'){c.moveTo(bx-sd*12,by+inner);c.quadraticCurveTo(bx,by-9,bx+sd*15,by+1);c.lineTo(bx+sd*14,by-2);c.quadraticCurveTo(bx,by-13,bx-sd*12,by+inner-4);}
    else if(F.browK==='bushy'){c.moveTo(bx-sd*13,by+inner);c.lineTo(bx+sd*16,by+2);c.lineTo(bx+sd*15,by-7);c.lineTo(bx-sd*12,by+inner-9);}
    else{c.moveTo(bx-sd*14,by+inner+1);c.lineTo(bx+sd*8,by);c.quadraticCurveTo(bx+sd*14,by+.5,bx+sd*17,by+3);c.lineTo(bx+sd*16,by-4);c.quadraticCurveTo(bx+sd*8,by-8,bx-sd*14,by+inner-7);}
    c.closePath();c.fill();}
  // рот
  const my=F.ey+(F.kid?52:62);c.lineCap='round';
  if(F.paint){c.save();c.filter='blur(1px)';c.strokeStyle='rgba(190,35,40,.85)';c.lineWidth=9;c.beginPath();c.moveTo(-24,my-4);c.quadraticCurveTo(0,my+14,26,my-9);c.stroke();c.restore();}
  if(e==='shout'||e==='scared'){const h=e==='shout'?22:10,w2=e==='shout'?14:8;c.fillStyle='#4a141a';c.beginPath();c.moveTo(-w2,my-3);c.quadraticCurveTo(0,my-8,w2,my-3);c.quadraticCurveTo(w2+1,my+h,0,my+h+2);c.quadraticCurveTo(-w2-1,my+h,-w2,my-3);c.fill();
    c.fillStyle='#f7f3ef';c.beginPath();c.moveTo(-w2+2,my-3);c.quadraticCurveTo(0,my-7,w2-2,my-3);c.lineTo(w2-3,my+1);c.quadraticCurveTo(0,my-1,-w2+3,my+1);c.fill();}
  else{c.strokeStyle='#5a2a26';c.lineWidth=3.2;c.beginPath();
    if(e==='smirk'){c.moveTo(-12,my+1);c.quadraticCurveTo(3,my+3,15,my-5);}else if(e==='smile'){c.moveTo(-13,my-2);c.quadraticCurveTo(0,my+8,13,my-2);}
    else if(e==='sad'){c.moveTo(-11,my+3);c.quadraticCurveTo(0,my-4,11,my+3);}else if(F.mouth==='flat'){c.moveTo(-13,my+1);c.lineTo(13,my+1);}else{c.moveTo(-12,my);c.quadraticCurveTo(0,my+2.5,12,my);}
    c.stroke();if(F.lips&&e!=='smile'){c.fillStyle=rgba(tk(F.skin,-.16),.9);c.beginPath();c.moveTo(-11,my+2);c.quadraticCurveTo(0,my+12,11,my+2);c.quadraticCurveTo(0,my+5,-11,my+2);c.fill();
      c.fillStyle=rgba(tk(F.skin,-.24),.8);c.beginPath();c.moveTo(-12,my);c.quadraticCurveTo(-5,my-5,0,my-3);c.quadraticCurveTo(5,my-5,12,my);c.quadraticCurveTo(0,my+1,-12,my);c.fill();}
    c.save();c.filter='blur(2px)';c.fillStyle=rgba(tk(F.skin,-.3),.55);c.beginPath();c.ellipse(0,my+(F.lips?14:9),9,3.5,0,0,TAU);c.fill();c.restore();}
  if(F.paint){c.fillStyle='#e3242c';c.beginPath();c.arc(0,F.ey+34,10,0,TAU);c.fill();c.fillStyle='rgba(255,255,255,.65)';c.beginPath();c.arc(-3,F.ey+30,3,0,TAU);c.fill();}
  // волосы: градиент + мягкие пряди
  if(hp){c.save();c.clip(hp);c.fillStyle=LG(c,L*w,-100,S*w,0,[[0,tk(F.hairC,.22)],[.5,F.hairC],[1,tk(F.hairC,-.45)]]);c.fillRect(-w-30,F.top-60,2*w+60,260);
    c.strokeStyle=rgba(tk(F.hairC,.45),.35);c.lineWidth=2.4;c.lineCap='round';
    if(F.hair==='office'){for(const k of [-.5,-.15,.2]){c.beginPath();c.moveTo(w*k-6,-66);c.bezierCurveTo(w*k+6,-92,w*(k+.3),F.top-24,w*(k+.55),F.top-20);c.stroke();}}
    else{for(const k of [-1.3,-.1,1.1]){c.beginPath();c.moveTo(k*18,F.top-14);c.quadraticCurveTo(k*22,-92,k*26-6,-60);c.stroke();}}
    c.restore();}
  if(F.hair==='bald'){c.save();c.clip(fp);c.fillStyle=RG(c,L*w*.4,F.top+30,2,30,[[0,'rgba(255,255,255,.4)'],[1,'rgba(255,255,255,0)']]);c.fillRect(-w,F.top,2*w,80);c.restore();}
  if(F.glasses){c.strokeStyle='#2a2420';c.lineWidth=3;for(const sd of [-1,1]){RR(c,sd*F.ex-16,F.ey-11,32,22,7);c.stroke();}c.beginPath();c.moveTo(-F.ex+16,F.ey-3);c.lineTo(F.ex-16,F.ey-3);c.stroke();}
  if(F.mask){c.fillStyle=LG(c,-30,0,30,0,[[0,'#bfe2ef'],[1,'#8ec3d6']]);RR(c,-30,F.cy-12,60,30,9);c.fill();c.fillStyle='rgba(255,255,255,.5)';c.fillRect(-26,F.cy-3,52,3);c.fillRect(-26,F.cy+6,52,3);
    c.strokeStyle='#d5ecf4';c.lineWidth=3;for(const sd of [-1,1]){c.beginPath();c.moveTo(sd*30,F.cy-8);c.lineTo(sd*(w-2),4);c.stroke();}}
  c.restore();}

/* тело: мягкие градиенты, шея с тенью */
function bodyA(c,o){const F=typeof o.f==='string'?AX[o.f]:o.f,L=o.L??-1,S=-L,C=o.cloth,sw=o.sw||118,lc=o.light||'#ffb070',la=o.la??.18;
  c.save();c.translate(o.x,o.y);c.scale(o.s,o.s);
  const nw=F.kid?22:30,ny=F.cy+20,bt=o.bt||420;
  c.fillStyle=LG(c,L*nw,0,S*nw,0,[[0,tk(F.skin,.05)],[1,tk(F.skin,-.28)]]);c.fillRect(-nw,F.jy,nw*2,ny-F.jy+40);
  c.fillStyle=LG(c,0,F.cy-10,0,F.cy+28,[[0,'rgba(60,30,20,.45)'],[1,'rgba(60,30,20,0)']]);c.fillRect(-nw,F.cy-10,nw*2,40);
  c.fillStyle=rgba(lc,la);c.fillRect(-nw,F.jy,nw*2,ny-F.jy+40);
  const T=new Path2D();T.moveTo(-nw-4,ny);T.quadraticCurveTo(-sw*.92,ny+2,-sw,ny+64);T.lineTo(-sw*1.02,bt);T.lineTo(sw*1.02,bt);T.lineTo(sw,ny+64);T.quadraticCurveTo(sw*.92,ny+2,nw+4,ny);T.closePath();
  const base={suit:C.jacket,clown:'#f2c22e',flannel:'#b57f4c',parka:'#5f5e44'}[C.k];
  c.save();c.fillStyle=base;c.fill(T);c.clip(T);
  c.fillStyle=LG(c,L*sw,0,S*sw,0,[[0,rgba(tk(base,.16),1)],[.5,rgba(base,1)],[1,rgba(tk(base,-.4),1)]]);c.fillRect(-sw*1.2,ny-10,sw*2.4,bt);
  if(C.k==='clown'){c.fillStyle='#e4402f';for(let y=ny;y<bt+40;y+=50)for(let x=-sw*1.1+((y-ny)/50%2)*25;x<sw*1.1;x+=50){c.beginPath();c.arc(x,y+22,9,0,TAU);c.fill();}}
  if(C.k==='flannel'){c.fillStyle='rgba(90,52,28,.5)';for(let x=-sw*1.1;x<sw*1.1;x+=44)c.fillRect(x,ny,15,bt);for(let y=ny;y<bt;y+=44)c.fillRect(-sw*1.1,y,sw*2.2,15);}
  c.fillStyle=rgba(lc,la*.8);c.fillRect(-sw*1.2,ny-10,sw*2.4,bt);
  c.strokeStyle='rgba(0,0,0,.28)';c.lineWidth=4;for(const sd of [-1,1]){c.beginPath();c.moveTo(sd*sw*.7,ny+70);c.quadraticCurveTo(sd*sw*.66,ny+200,sd*sw*.72,bt);c.stroke();}
  c.restore();
  if(C.k==='suit'){const sh_=C.shirt||'#eef0f2';c.fillStyle=LG(c,-30,0,30,0,[[0,sh_],[1,tk(sh_,-.18)]]);c.beginPath();c.moveTo(-nw-6,ny-2);c.lineTo(nw+6,ny-2);c.lineTo(14,ny+210);c.lineTo(-14,ny+210);c.closePath();c.fill();
    if(C.open){c.fillStyle=LG(c,0,ny,0,ny+50,[[0,tk(F.skin,-.25)],[1,tk(F.skin,-.08)]]);c.beginPath();c.moveTo(-nw+3,ny-2);c.lineTo(0,ny+48);c.lineTo(nw-3,ny-2);c.closePath();c.fill();}
    if(C.tie){c.fillStyle=LG(c,-10,0,10,0,[[0,tk(C.tie,.15)],[1,tk(C.tie,-.3)]]);c.beginPath();c.moveTo(-8,ny+4);c.lineTo(8,ny+4);c.lineTo(12,ny+160);c.lineTo(0,ny+176);c.lineTo(-12,ny+160);c.closePath();c.fill();}
    for(const sd of [-1,1]){c.fillStyle=sd===S?tk(sh_,-.15):sh_;c.beginPath();c.moveTo(sd*(nw-3),ny-8);c.lineTo(sd*(nw+15),ny);c.lineTo(sd*(nw+6),ny+32);c.lineTo(sd*(C.open?9:3),ny+16);c.closePath();c.fill();
      c.fillStyle=sd===S?tk(C.jacket,-.35):tk(C.jacket,-.12);c.beginPath();c.moveTo(sd*(nw+8),ny-2);c.lineTo(sd*(nw+42),ny+66);c.lineTo(sd*(nw+30),ny+78);c.lineTo(sd*(nw+40),ny+92);c.lineTo(sd*12,ny+250);c.lineTo(sd*(nw+2),ny+14);c.closePath();c.fill();}}
  if(C.k==='flannel'){for(const sd of [-1,1]){c.fillStyle='#9a6a3c';c.beginPath();c.moveTo(sd*(nw-4),ny-6);c.lineTo(sd*(nw+20),ny+2);c.lineTo(sd*(nw+6),ny+36);c.lineTo(sd*4,ny+18);c.closePath();c.fill();}}
  if(C.k==='parka'){c.fillStyle='#29282c';c.beginPath();c.moveTo(-nw-6,ny-4);c.lineTo(0,ny+40);c.lineTo(nw+6,ny-4);c.lineTo(nw+10,ny+260);c.lineTo(-nw-10,ny+260);c.closePath();c.fill();
    c.fillStyle='#4f4e37';for(const sd of [-1,1]){c.beginPath();c.moveTo(sd*(nw+4),ny-12);c.quadraticCurveTo(sd*(nw+50),ny-6,sd*(nw+56),ny+30);c.lineTo(sd*(nw+14),ny+30);c.closePath();c.fill();}}
  if(C.k==='clown'){const n=16;for(const [r,col] of [[94,'#ffffff'],[68,'#5fb7e8']]){c.beginPath();for(let k=0;k<=n;k++){const a=Math.PI*(1+k/n),R=k%2?r:r*.8;c.lineTo(Math.cos(a)*R*1.2,ny-4-Math.sin(a)*R*.4);}
      for(let k=n;k>=0;k--){const a=Math.PI*(k/n),R=k%2?r:r*.8;c.lineTo(Math.cos(a)*R*1.2,ny-4+Math.sin(a)*R*.5);}c.closePath();c.fillStyle=col;c.fill();}
    for(const [k,col] of [[0,'#e4402f'],[1,'#2e7fd6'],[2,'#3bb05a']]){c.fillStyle=col;c.beginPath();c.arc(0,ny+86+k*86,14,0,TAU);c.fill();}}
  c.restore();}
function personA(c,o){bodyA(c,o);headA(c,o);}
