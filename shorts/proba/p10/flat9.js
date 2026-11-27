"use strict";
/* Люди v9, плоский стиль (27.11, правка Андрея/Gemini): один тон + одна жёсткая тень, без обводки и размытых градиентов,
   глаза простые, нос — плоская тень, рот — линия, уши маленькие, шея короткая, плечи широкие.
   Координаты: центр лица (0,0), макушка ≈ −110, подбородок ≈ +96. Свет слева — тень справа. */

const FL={
  max:{skin:'#dfa98a',sh:'#bb8467',w:67,jw:62,jy:56,cw:32,cy:95,top:-104,shx:.62,eye:'deep',eyeY:-4,eyeX:26,brow:'maxs',browC:'#24170f',browY:-19,
    nose:'broad',mouth:'lips',mouthY:57,lip:'#b9786b',stub:0,hair:'max2',hairC:'#2a1b13',hairS:'#1a100a',hairL:'#43301f',nw:37,eyeK:1.2,hood:5.2,iris:'#4a3220'},
  lyosha:{skin:'#f2d6c7',sh:'#d8b2a2',w:62,jw:50,jy:46,cw:28,cy:84,top:-112,eye:'round',eyeY:6,eyeX:23,brow:'light',browC:'#d2b09a',browY:-12,
    nose:'kid',mouth:'kid',mouthY:50,hair:'bald',kid:1,nw:22,mask:1},
  boss:{skin:'#e0ac92',sh:'#bd876e',w:64,jw:60,jy:62,cw:28,cy:98,top:-104,eye:'small',eyeY:-2,eyeX:25,brow:'bushy',browC:'#9d968e',browY:-18,
    nose:'big',mouth:'flat',mouthY:62,hair:'grey',hairC:'#c9c5be',hairS:'#a7a29a',hairL:'#e2dfda',glasses:1,nw:34,jowl:1},
  yulia:{skin:'#eec0a4',sh:'#cf9a7e',w:56,jw:44,jy:52,cw:20,cy:90,top:-108,eye:'almond',eyeY:-2,eyeX:23,brow:'thin',browC:'#3a2418',browY:-18,
    nose:'small',mouth:'soft',mouthY:54,hair:'bangs',hairC:'#3a2418',hairS:'#24150d',hairL:'#5a3a28',nw:24},
  misha:{skin:'#d9a07c',sh:'#b5795a',w:61,jw:56,jy:58,cw:26,cy:96,top:-108,eye:'lid',eyeY:-3,eyeX:24,brow:'max',browC:'#1e140e',browY:-16,
    nose:'long',mouth:'grin',mouthY:60,beard:1,hair:'slick',hairC:'#1e140e',hairS:'#120b07',hairL:'#3b2a1e',nw:32},
  vadim:{skin:'#e8b495',sh:'#c88e70',w:63,jw:58,jy:60,cw:30,cy:96,top:-108,eye:'dot',eyeY:-2,eyeX:24,brow:'soft',browC:'#5a3d2a',browY:-17,
    nose:'small',mouth:'smile',mouthY:58,hair:'vside',hairC:'#6a4a32',hairS:'#4a3222',hairL:'#8a6646',nw:33},
};
FL.clown={...FL.max,skin:'#f6f2ec',sh:'#d8d5de',paint:1,mouth:'clown',stub:0,nose:'clown',realSkin:'#e2aa88',realSh:'#bf8466'};

function fpath(F){const p=new Path2D(),w=F.w,jw=F.jw,jy=F.jy,cw=F.cw,cy=F.cy,t=F.top;
  if(F.kid){p.moveTo(0,t);p.bezierCurveTo(w*.75,t,w*1.02,t*.55,w,-14);p.bezierCurveTo(w*.98,20,jw*1.05,jy-6,jw,jy);p.bezierCurveTo(jw*.8,cy-6,cw*1.2,cy,0,cy);
    p.bezierCurveTo(-cw*1.2,cy,-jw*.8,cy-6,-jw,jy);p.bezierCurveTo(-jw*1.05,jy-6,-w*.98,20,-w,-14);p.bezierCurveTo(-w*1.02,t*.55,-w*.75,t,0,t);p.closePath();return p;}
  p.moveTo(0,t);p.bezierCurveTo(w*.7,t,w,t*.6,w,-30);p.lineTo(w*.98,4);p.quadraticCurveTo(w*.96,jy*.7,jw,jy);
  p.quadraticCurveTo(jw*.8,cy-10,cw,cy-2);p.quadraticCurveTo(0,cy+3,-cw,cy-2);p.quadraticCurveTo(-jw*.8,cy-10,-jw,jy);
  p.quadraticCurveTo(-w*.96,jy*.7,-w*.98,4);p.lineTo(-w,-30);p.bezierCurveTo(-w,t*.6,-w*.7,t,0,t);p.closePath();return p;}

function fhair(F){const p=new Path2D(),w=F.w+4,t=F.top;
  switch(F.hair){
  case'max':p.moveTo(-w+2,-8);p.bezierCurveTo(-w-4,-50,-w+6,t-8,-w*.35,t-10);p.bezierCurveTo(w*.2,t-20,w*.85,t-4,w,-40);p.lineTo(w-2,-8);p.lineTo(w-8,-30);
    // чёлка: три крупные пряди вниз-влево
    p.lineTo(w*.55,-44);p.lineTo(w*.42,-32);p.lineTo(w*.18,-48);p.lineTo(w*.02,-30);p.lineTo(-w*.24,-46);p.lineTo(-w*.42,-30);p.lineTo(-w*.6,-50);p.lineTo(-w+8,-30);p.closePath();return p;
  case'max2':p.moveTo(-w+2,-4);p.bezierCurveTo(-w-10,-48,-w*.7,t+2,0,t-2);p.bezierCurveTo(w*.7,t+2,w+10,-50,w+1,-4);p.lineTo(w-6,-10);p.lineTo(w-8,-24);
    p.quadraticCurveTo(w*.74,-22,w*.6,-23);p.quadraticCurveTo(w*.58,-32,w*.46,-35);p.quadraticCurveTo(w*.38,-25,w*.26,-24);p.quadraticCurveTo(w*.22,-34,w*.08,-38);
    p.quadraticCurveTo(-w*.02,-28,-w*.16,-27);p.quadraticCurveTo(-w*.2,-37,-w*.34,-40);p.quadraticCurveTo(-w*.44,-30,-w*.58,-30);p.quadraticCurveTo(-w*.64,-40,-w*.78,-42);
    p.quadraticCurveTo(-w+6,-38,-w+8,-26);p.lineTo(-w+8,-6);p.closePath();return p;
  case'grey':p.moveTo(-w,-6);p.quadraticCurveTo(-w-4,-56,-w+16,-74);p.lineTo(-w+26,-62);p.quadraticCurveTo(-w+12,-40,-w+10,-6);p.closePath();
    p.moveTo(w,-6);p.quadraticCurveTo(w+4,-56,w-16,-74);p.lineTo(w-26,-62);p.quadraticCurveTo(w-12,-40,w-10,-6);p.closePath();
    p.moveTo(-w*.5,-92);p.quadraticCurveTo(0,t-10,w*.5,-92);p.quadraticCurveTo(0,-98,-w*.5,-92);p.closePath();return p;
  case'bangs':p.moveTo(-w-8,110);p.bezierCurveTo(-w-16,-40,-w*.7,t-12,0,t-12);p.bezierCurveTo(w*.7,t-12,w+16,-40,w+8,110);p.lineTo(w-6,100);p.lineTo(w-6,-20);
    p.lineTo(w*.5,-36);p.lineTo(w*.25,-28);p.lineTo(0,-38);p.lineTo(-w*.3,-28);p.lineTo(-w*.55,-38);p.lineTo(-w+6,-22);p.lineTo(-w+6,100);p.closePath();return p;
  case'slick':p.moveTo(-w+2,-14);p.bezierCurveTo(-w-2,-60,-w*.6,t-14,0,t-14);p.bezierCurveTo(w*.6,t-14,w+2,-60,w-2,-14);p.lineTo(w-8,-30);
    p.quadraticCurveTo(w*.6,-70,0,-72);p.quadraticCurveTo(-w*.6,-70,-w+8,-30);p.closePath();return p;
  case'vside':p.moveTo(-w+2,-4);p.bezierCurveTo(-w-6,-56,-w*.5,t-14,0,t-14);p.bezierCurveTo(w*.6,t-14,w+6,-56,w-2,-4);p.lineTo(w-9,-22);
    p.quadraticCurveTo(w*.7,-52,w*.2,-46);p.quadraticCurveTo(-w*.25,-40,-w*.55,-26);p.quadraticCurveTo(-w*.4,-50,-w*.62,-48);p.lineTo(-w+8,-24);p.closePath();return p;
  case'wavy':p.moveTo(-w-2,0);for(let k=0;k<=8;k++){const a=Math.PI+k/8*Math.PI,r=w+8+(k%2?7:0);p.lineTo(Math.cos(a)*r,-36+Math.sin(a)*(r+14));}
    p.lineTo(w+2,0);p.lineTo(w-8,-26);p.quadraticCurveTo(w*.3,-52,-w*.2,-42);p.quadraticCurveTo(-w*.6,-36,-w+8,-26);p.closePath();return p;}
  return null;}

function earF(c,F,sd,L){const x=sd*(F.w-3),y=F.kid?10:4,col=sd===-L?F.sh:F.skin;c.fillStyle=F.paint?F.realSkin:col;
  if(F.paint&&sd===-L)c.fillStyle=F.realSh;c.beginPath();c.ellipse(x+sd*4,y,9,14,0,0,TAU);c.fill();}

/* голова: {x,y,s,f,L,expr:{smile}} */
function headF(c,o){const F=typeof o.f==='string'?FL[o.f]:o.f,L=o.L??-1;
  c.save();c.translate(o.x,o.y);c.scale(o.s,o.s);
  const fp=fpath(F);earF(c,F,-1,L);earF(c,F,1,L);
  c.fillStyle=F.skin;c.fill(fp);
  c.save();c.clip(fp);
  // жёсткая тень сбоку (свет слева)
  const S=-L,sp=new Path2D(),w=F.w,sx=F.shx||.42;sp.moveTo(S*w*sx,F.top-10);sp.bezierCurveTo(S*w*(sx+.2),-40,S*w*(sx+.2),10,S*F.jw*(sx+.26),F.jy);sp.lineTo(S*F.cw*.5,F.cy+10);sp.lineTo(S*(w+30),F.cy+10);sp.lineTo(S*(w+30),F.top-10);sp.closePath();
  if(o.soft){const R=F.w*1.25;c.fillStyle=RG(c,L*F.w*.35,-30,F.w*.15,R*1.15,[[0,rgba(tk(F.skin,.16),1)],[.45,rgba(F.skin,1)],[.8,rgba(tk(F.sh,.15),1)],[1,rgba(tk(F.sh,-.05),1)]]);c.fillRect(-120,-150,240,280);
    c.fillStyle=LG(c,0,F.cy-30,0,F.cy+4,[[0,rgba(F.sh,0)],[1,rgba(F.sh,.55)]]);c.fillRect(-120,F.cy-30,240,40);
    if(F.paint){c.fillStyle=RG(c,L*F.w*.35,-30,F.w*.15,R*1.15,[[0,'rgba(255,255,255,.3)'],[1,'rgba(150,145,165,.35)']]);c.fillRect(-120,-150,240,280);}}
  else{c.fillStyle=F.sh;c.fill(sp);}
  // щетина / борода — плоское пятно
  if(F.stub||F.beard){const b=new Path2D(),y0=F.beard?8:34;b.moveTo(-F.w,y0);b.quadraticCurveTo(-F.jw,F.jy+10,-F.cw,F.cy);b.lineTo(F.cw,F.cy);b.quadraticCurveTo(F.jw,F.jy+10,F.w,y0);b.quadraticCurveTo(F.w*.5,y0+30,22,F.mouthY-6);
    b.quadraticCurveTo(0,F.mouthY-12,-22,F.mouthY-6);b.quadraticCurveTo(-F.w*.5,y0+30,-F.w,y0);b.closePath();c.fillStyle=F.beard?'rgba(40,24,16,.72)':'rgba(70,60,72,.12)';c.fill(b);}
  // тень от волос на лбу
  const hp=fhair(F);if(hp&&F.hair!=='bangs'){c.save();c.translate(0,o.soft?9:7);c.fillStyle=F.sh;c.globalAlpha=o.soft?.45:.85;if(o.soft)c.filter='blur(4px)';c.fill(hp);c.restore();}
  // клоунский грим кончается у челюсти: на шее и ушах — кожа
  c.restore();
  // нос
  const ns=F.nose;c.fillStyle=o.soft?rgba(F.sh,.75):F.sh;
  if(ns==='broad'){c.beginPath();c.moveTo(S*4,2);c.lineTo(S*11,26);c.quadraticCurveTo(S*15,34,S*9,38);c.lineTo(S*3,34);c.quadraticCurveTo(S*2,22,S*3,2);c.closePath();c.fill();
    c.beginPath();c.moveTo(-15,33);c.quadraticCurveTo(-12,42,-4,41);c.quadraticCurveTo(0,44,4,41);c.quadraticCurveTo(12,42,15,33);c.quadraticCurveTo(8,38,0,37);c.quadraticCurveTo(-8,38,-15,33);c.fill();}
  else if(ns==='long'||ns==='big'){const k=ns==='big'?1.2:1;c.beginPath();c.moveTo(S*2,-8);c.lineTo(S*9*k,30);c.quadraticCurveTo(S*10*k,40,S*1,40);c.lineTo(-S*6*k,39);c.quadraticCurveTo(-S*2,36,S*1,32);c.closePath();c.fill();}
  else if(ns==='small'){c.beginPath();c.moveTo(S*3,8);c.lineTo(S*8,30);c.quadraticCurveTo(S*4,36,-S*5,33);c.closePath();c.fill();}
  else if(ns==='kid'){c.beginPath();c.ellipse(S*2,30,7,5,0,0,TAU);c.fill();}
  else if(ns==='clown'){c.fillStyle='#e8262f';c.beginPath();c.arc(0,28,13,0,TAU);c.fill();c.fillStyle='#b8141d';c.beginPath();c.arc(S*4,31,9,-.4,2.2);c.lineTo(S*4,31);c.fill();c.fillStyle='rgba(255,255,255,.75)';c.beginPath();c.arc(-S*4,23,3.4,0,TAU);c.fill();}
  // глаза
  const lk=o.look||[0,0];for(const sd of [-1,1]){const ex=sd*F.eyeX+lk[0]*3,ey=F.eyeY+lk[1]*2;c.fillStyle='#1e1410';
    if(o.soft&&F.eye!=='round'){const K=(F.eyeK||1)*(F.kid?1.1:1);c.save();c.translate(ex,ey);c.scale(K,K);
      c.fillStyle=rgba(F.sh,.45);c.beginPath();c.ellipse(sd*1,-4,14,9,0,0,TAU);c.fill();
      c.fillStyle='#f4f0ea';c.beginPath();c.ellipse(0,0,10.5,7.2,0,0,TAU);c.fill();c.save();c.beginPath();c.ellipse(0,0,10.5,7.2,0,0,TAU);c.clip();
      c.fillStyle=F.iris||'#3a2618';c.beginPath();c.arc(lk[0]*3,.5,5.4,0,TAU);c.fill();c.fillStyle='#120b07';c.beginPath();c.arc(lk[0]*3,.5,2.8,0,TAU);c.fill();
      c.fillStyle=rgba(F.sh,.5);c.fillRect(-12,-9,24,4+(F.hood||2.5));c.restore();
      c.fillStyle='#fff';c.beginPath();c.arc(lk[0]*3-1.8,-1.6,1.5,0,TAU);c.fill();
      c.strokeStyle='#22150e';c.lineWidth=2.6;c.lineCap='round';c.beginPath();c.moveTo(-11,.5);c.quadraticCurveTo(0,-9,11,-.5);c.stroke();c.restore();}
    else if(F.eye==='deep'){c.save();const K=F.eyeK||1;c.translate(ex,ey);c.scale(K,K);c.translate(-ex,-ey);c.fillStyle=F.sh;c.beginPath();c.ellipse(ex+sd*1,ey-5,15,9,0,0,TAU);c.fill();
      const e=new Path2D();e.moveTo(ex-sd*11,ey);e.quadraticCurveTo(ex,ey-6.5,ex+sd*11,ey+1);e.quadraticCurveTo(ex,ey+6,ex-sd*11,ey);e.closePath();c.fillStyle='#efe9e2';c.fill(e);c.clip(e);
      c.fillStyle='#3b2618';c.beginPath();c.arc(ex+lk[0]*3,ey+.5,5.6,0,TAU);c.fill();c.fillStyle='#120b07';c.beginPath();c.arc(ex+lk[0]*3,ey+.5,2.6,0,TAU);c.fill();c.restore();
      c.save();c.translate(ex,ey);c.scale(K,K);c.translate(-ex,-ey);c.strokeStyle='#1e130d';c.lineWidth=3.2;c.lineCap='round';c.beginPath();c.moveTo(ex-sd*12,ey+.5);c.quadraticCurveTo(ex,ey-7,ex+sd*12,ey+1.5);c.stroke();c.restore();}
    else if(F.eye==='lid'){c.beginPath();c.moveTo(ex-9,ey-1.5);c.quadraticCurveTo(ex,ey-4,ex+9,ey-1.5);c.quadraticCurveTo(ex+6,ey+6,ex,ey+6);c.quadraticCurveTo(ex-6,ey+6,ex-9,ey-1.5);c.fill();}
    else if(F.eye==='round'){c.beginPath();c.ellipse(ex,ey,7.5,9,0,0,TAU);c.fill();c.fillStyle='#ffffff';c.beginPath();c.arc(ex-2.5*S,ey-3,2.4,0,TAU);c.fill();}
    else if(F.eye==='almond'){c.beginPath();c.ellipse(ex,ey,7,6,0,0,TAU);c.fill();c.strokeStyle='#1e1410';c.lineWidth=2.4;c.lineCap='round';c.beginPath();c.moveTo(ex+sd*6,ey-4);c.lineTo(ex+sd*11,ey-7);c.stroke();}
    else if(F.eye==='small'){c.beginPath();c.ellipse(ex,ey,5,4.5,0,0,TAU);c.fill();}
    else{c.beginPath();c.ellipse(ex,ey,5.5,6,0,0,TAU);c.fill();}}
  // брови
  for(const sd of [-1,1]){const ex=sd*F.eyeX,by=F.browY-(o.expr&&o.expr.brow||0);c.fillStyle=F.browC;c.beginPath();
    if(F.brow==='maxs'){c.moveTo(ex-sd*14,by+1);c.lineTo(ex+sd*8,by-1);c.quadraticCurveTo(ex+sd*14,by,ex+sd*17,by+4);c.lineTo(ex+sd*15,by-5);c.quadraticCurveTo(ex+sd*10,by-9,ex-sd*14,by-7);}
    else if(F.brow==='max'){c.moveTo(ex-sd*13,by+3);c.lineTo(ex+sd*15,by-2);c.lineTo(ex+sd*14,by-8);c.lineTo(ex-sd*13,by-5);}
    else if(F.brow==='bushy'){c.moveTo(ex-sd*13,by);c.lineTo(ex+sd*15,by+2);c.lineTo(ex+sd*14,by-8);c.lineTo(ex-sd*12,by-9);}
    else if(F.brow==='thin'){c.moveTo(ex-sd*11,by+1);c.quadraticCurveTo(ex,by-6,ex+sd*13,by);c.lineTo(ex+sd*12,by-2);c.quadraticCurveTo(ex,by-9,ex-sd*11,by-2);}
    else if(F.brow==='light'){c.moveTo(ex-sd*10,by+1);c.quadraticCurveTo(ex,by-5,ex+sd*11,by+1);c.lineTo(ex+sd*10,by-2);c.quadraticCurveTo(ex,by-8,ex-sd*10,by-2);}
    else{c.moveTo(ex-sd*12,by+1);c.quadraticCurveTo(ex,by-6,ex+sd*13,by+1);c.lineTo(ex+sd*12,by-4);c.quadraticCurveTo(ex,by-11,ex-sd*12,by-4);}
    c.closePath();c.fill();}
  // рот
  const my=F.mouthY,sm=(o.expr&&o.expr.smile)||0;c.lineCap='round';c.strokeStyle=F.paint?'#7a2a24':'#7a3a30';c.lineWidth=4;c.beginPath();
  switch(F.mouth){
  case'lips':break;
  case'max':c.moveTo(-17,my);c.quadraticCurveTo(0,my+1+sm*2,17,my-1-sm*5);break;
  case'kid':c.moveTo(-10,my);c.quadraticCurveTo(0,my+5,11,my-1);break;
  case'flat':c.moveTo(-17,my+1);c.lineTo(17,my+1);break;
  case'soft':c.moveTo(-12,my);c.quadraticCurveTo(0,my+3,12,my);break;
  case'grin':c.moveTo(-19,my-2);c.quadraticCurveTo(0,my+9,19,my-4);break;
  case'smile':c.moveTo(-15,my-2);c.quadraticCurveTo(0,my+7,15,my-2);break;
  case'clown':c.strokeStyle='#e8262f';c.lineWidth=7;c.moveTo(-27,my-8);c.quadraticCurveTo(0,my+14,27,my-8);break;}
  c.stroke();
  if(F.mouth==='lips'){c.fillStyle=tk(F.lip,-.12);c.beginPath();c.moveTo(-24,my);c.quadraticCurveTo(-12,my-8,-3,my-6);c.quadraticCurveTo(0,my-4,3,my-6);c.quadraticCurveTo(12,my-8,24,my);c.quadraticCurveTo(0,my+1,-24,my);c.fill();
    c.fillStyle=F.lip;c.beginPath();c.moveTo(-20,my+.5);c.quadraticCurveTo(0,my+16,20,my+.5);c.quadraticCurveTo(0,my+2,-20,my+.5);c.fill();
    c.strokeStyle='#6e3329';c.lineWidth=2.6;c.beginPath();c.moveTo(-24,my);c.quadraticCurveTo(0,my+2,24,my);c.stroke();
    c.fillStyle=F.sh;c.beginPath();c.ellipse(0,my+20,10,3,0,0,TAU);c.fill();
    if(F.cleft){c.strokeStyle=F.sh;c.lineWidth=3;c.beginPath();c.moveTo(0,F.cy-16);c.lineTo(0,F.cy-6);c.stroke();}}
  if(F.mouth==='max'||F.mouth==='flat'){c.strokeStyle=F.sh;c.lineWidth=5;c.beginPath();c.moveTo(-7,my+10);c.lineTo(8,my+10);c.stroke();}
  if(F.mouth==='clown'){c.fillStyle='#e8262f';for(const sd of [-1,1]){c.beginPath();c.arc(sd*28,my-9,4,0,TAU);c.fill();}}
  // волосы: тон + тень справа + светлая прядь
  if(hp){c.fillStyle=F.hairC;c.fill(hp);c.save();c.clip(hp);c.fillStyle=F.hairS;c.beginPath();c.moveTo(S*F.w*.3,F.top-30);c.bezierCurveTo(S*F.w*.62,-60,S*F.w*.66,-20,S*F.w*.6,40);c.lineTo(S*F.w*2,40);c.lineTo(S*F.w*2,F.top-30);c.closePath();c.fill();
    if(F.hair==='max2'){c.fillStyle=F.hairS;for(const [x,d] of [[-.5,1],[-.1,1.1],[.28,.95]]){c.beginPath();c.moveTo(F.w*x+8,F.top+4);c.quadraticCurveTo(F.w*x-2,F.top+40,F.w*x-14*d,-34);c.quadraticCurveTo(F.w*x+4,F.top+44,F.w*x+16,F.top+6);c.closePath();c.fill();}}
    c.fillStyle=F.hairL;c.beginPath();c.moveTo(-F.w*.55,F.top+6);c.quadraticCurveTo(-F.w*.1,F.top-6,F.w*.3,F.top+2);c.quadraticCurveTo(-F.w*.1,F.top+4,-F.w*.5,F.top+14);c.closePath();c.fill();c.restore();}
  if(F.hair==='bald'){c.save();c.clip(fp);c.fillStyle='rgba(255,255,255,.4)';c.beginPath();c.ellipse(-F.w*.35,F.top+26,18,9,-.5,0,TAU);c.fill();c.restore();}
  if(F.mask){c.save();c.fillStyle='#a9d7e8';RR(c,-34,F.cy-14,68,34,10);c.fill();c.fillStyle='#86bdd2';c.fillRect(S>0?4:-34,F.cy-14,30,34);
    c.fillStyle='rgba(255,255,255,.55)';c.fillRect(-30,F.cy-4,60,3);c.fillRect(-30,F.cy+6,60,3);c.strokeStyle='#d5ecf4';c.lineWidth=3;for(const sd of [-1,1]){c.beginPath();c.moveTo(sd*34,F.cy-10);c.lineTo(sd*(F.w-4),6);c.stroke();}c.restore();}
  // очки
  if(F.glasses){c.strokeStyle='#2a2420';c.lineWidth=3;for(const sd of [-1,1]){RR(c,sd*F.eyeX-15,F.eyeY-10,30,21,6);c.stroke();}c.beginPath();c.moveTo(-F.eyeX+15,F.eyeY-3);c.lineTo(F.eyeX-15,F.eyeY-3);c.stroke();}
  c.restore();}

/* шея: короткая, тень под подбородком — жёсткая */
function neckF(c,o){const F=typeof o.f==='string'?FL[o.f]:o.f,L=o.L??-1,nw=F.nw,skin=F.paint?F.realSkin:F.skin,shc=F.paint?F.realSh:F.sh;
  c.save();c.translate(o.x,o.y);c.scale(o.s,o.s);
  const p=new Path2D();p.moveTo(-nw,F.jy);p.lineTo(-nw*1.06,F.cy+34);p.lineTo(nw*1.06,F.cy+34);p.lineTo(nw,F.jy);p.closePath();c.fillStyle=skin;c.fill(p);
  c.save();c.clip(p);c.fillStyle=shc;c.beginPath();c.moveTo(-nw*1.2,F.jy);c.lineTo(-F.cw,F.cy+16);c.quadraticCurveTo(0,F.cy+22,F.cw,F.cy+16);c.lineTo(nw*1.2,F.jy);c.closePath();c.fill();
  c.fillRect(-L>0?nw*.35:-nw*1.2,F.jy,nw*.85,200);c.restore();c.restore();}

/* тело: широкие прямые плечи, руки вдоль тела. o.cloth:{k:'suit'|'clown'|'flannel'|'parka'|'shirt'|'sweater', ...} */
function bodyF(c,o){const F=typeof o.f==='string'?FL[o.f]:o.f,L=o.L??-1,S=-L,C=o.cloth,sw=o.sw||150,ny=F.cy+30,bt=o.bt||520,nb=F.nw*1.15;
  c.save();c.translate(o.x,o.y);c.scale(o.s,o.s);
  const T=new Path2D();T.moveTo(-nb,ny-6);T.lineTo(-sw*.72,ny+4);T.quadraticCurveTo(-sw*1.02,ny+10,-sw,ny+56);T.lineTo(-sw*.97,bt);T.lineTo(sw*.97,bt);T.lineTo(sw,ny+56);T.quadraticCurveTo(sw*1.02,ny+10,sw*.72,ny+4);T.lineTo(nb,ny-6);T.closePath();
  const base={suit:C.jacket,clown:'#f4c52c',flannel:'#b98049',parka:'#6c6b48',shirt:C.shirt,sweater:C.col}[C.k],shade=tk(base,-.28);
  c.fillStyle=base;c.fill(T);c.save();c.clip(T);
  if(o.soft){c.fillStyle=LG(c,sw*L,0,-sw*L,0,[[0,rgba(tk(base,.16),1)],[.5,rgba(base,1)],[1,rgba(tk(base,-.38),1)]]);c.fillRect(-sw*1.2,ny-20,sw*2.4,bt+40);}
  // узоры
  if(C.k==='clown'){c.fillStyle='#e4402f';for(let y=ny;y<bt+40;y+=54)for(let x=-sw*1.1+((y-ny)/54%2)*27;x<sw*1.1;x+=54){c.beginPath();c.arc(x,y+22,10,0,TAU);c.fill();}}
  if(C.k==='flannel'){c.fillStyle='rgba(98,58,30,.55)';for(let x=-sw*1.1;x<sw*1.1;x+=48)c.fillRect(x,ny-20,16,bt);for(let y=ny;y<bt;y+=48)c.fillRect(-sw*1.1,y,sw*2.2,16);
    c.fillStyle='rgba(240,225,200,.3)';for(let x=-sw*1.1;x<sw*1.1;x+=48)c.fillRect(x+26,ny-20,3,bt);for(let y=ny;y<bt;y+=48)c.fillRect(-sw*1.1,y+26,sw*2.2,3);}
  if(C.k==='shirt'&&C.pattern){c.fillStyle=C.pattern;for(let y=ny;y<bt;y+=40)for(let x=-sw*1.1+((y-ny)/40%2)*20;x<sw*1.1;x+=40){c.beginPath();c.ellipse(x,y+14,7,4,.6,0,TAU);c.fill();}}
  // жёсткая тень справа и руки вдоль тела
  if(!o.soft){c.fillStyle=rgba(shade,.85);c.beginPath();c.moveTo(S*sw*.38,ny);c.lineTo(S*sw*.32,bt);c.lineTo(S*sw*1.2,bt);c.lineTo(S*sw*1.2,ny);c.closePath();c.fill();}
  for(const sd of [-1,1]){const ac=sd===S?tk(base,-.5):tk(base,-.3);c.strokeStyle=rgba(ac,.7);c.lineWidth=6;c.lineCap='round';c.beginPath();c.moveTo(sd*sw*.66,ny+80);c.quadraticCurveTo(sd*sw*.62,ny+220,sd*sw*.7,bt+20);c.stroke();}
  if(o.soft&&o.rim)rimF(c,T,o.rim,L*6,.6);
  if(o.soft&&o.arms!==0){const aw=sw*.34,arm=new Path2D();for(const sd of [-1,1]){const x0=sd*sw*.8,y0=ny+44;arm.moveTo(x0-aw/2,y0);arm.arc(x0,y0,aw/2,Math.PI,0);arm.lineTo(x0+aw*.52+sd*4,bt+60);arm.lineTo(x0-aw*.52+sd*4,bt+60);arm.closePath();}
    const ac=C.k==='clown'?'#f4c52c':tk(base,.04);c.save();c.fillStyle=ac;c.fill(arm);c.clip(arm);
    for(const sd of [-1,1]){const x0=sd*sw*.8;c.fillStyle=LG(c,x0-aw*.6,0,x0+aw*.6,0,L<0?[[0,rgba(tk(ac,.18),1)],[.55,rgba(ac,1)],[1,rgba(tk(ac,-.4),1)]]:[[0,rgba(tk(ac,-.4),1)],[.45,rgba(ac,1)],[1,rgba(tk(ac,.18),1)]]);c.fillRect(x0-aw,ny,aw*2,bt+80);}
    if(C.k==='clown'){c.fillStyle='#e4402f';for(let y=ny;y<bt+40;y+=54)for(const sd of [-1,1])c.beginPath(),c.arc(sd*sw*.8,y+40,9,0,TAU),c.fill();}
    if(C.k==='flannel'){c.fillStyle='rgba(98,58,30,.55)';for(let y=ny;y<bt+40;y+=48)c.fillRect(-sw*1.2,y,sw*2.4,14);}
    c.restore();c.fillStyle=rgba(tk(base,-.55),.45);for(const sd of [-1,1]){c.beginPath();c.moveTo(sd*(sw*.8-aw*.52),ny+90);c.lineTo(sd*(sw*.8-aw*.5),bt+60);c.lineTo(sd*(sw*.8-aw*.5)+sd*6,bt+60);c.lineTo(sd*(sw*.8-aw*.52)+sd*6,ny+90);c.closePath();c.fill();}
    if(o.rim)rimF(c,arm,o.rim,L*6,.65);}
  c.restore();
  // ворот
  if(C.k==='suit'||C.k==='shirt'||C.k==='flannel'){const sh_=C.k==='suit'?C.shirt:C.k==='flannel'?'#a46f3c':tk(C.shirt,.06),open=C.open;
    if(C.k==='suit'){const v=new Path2D();v.moveTo(-nb-4,ny-6);v.lineTo(nb+4,ny-6);v.lineTo(nb+20,ny+70);v.lineTo(16,ny+252);v.lineTo(-16,ny+252);v.lineTo(-nb-20,ny+70);v.closePath();c.save();
      c.fillStyle=sh_;c.fill(v);c.save();c.clip(v);c.fillStyle=tk(sh_,-.18);c.fillRect(S>0?4:-200,ny-10,196,300);c.restore();
      if(open){c.fillStyle=F.paint?F.realSkin:F.skin;c.beginPath();c.moveTo(-nb*.85,ny-6);c.lineTo(0,ny+60);c.lineTo(nb*.85,ny-6);c.closePath();c.fill();
        c.fillStyle=F.paint?F.realSh:F.sh;c.beginPath();c.moveTo(-nb*.85,ny-6);c.lineTo(0,ny+14);c.lineTo(nb*.85,ny-6);c.closePath();c.fill();}
      if(C.tie){c.fillStyle=C.tie;c.beginPath();c.moveTo(-8,ny+6);c.lineTo(8,ny+6);c.lineTo(13,ny+170);c.lineTo(0,ny+186);c.lineTo(-13,ny+170);c.closePath();c.fill();
        c.fillStyle=tk(C.tie,-.3);c.beginPath();c.moveTo(S*1,ny+6);c.lineTo(S*8,ny+6);c.lineTo(S*13,ny+170);c.lineTo(0,ny+186);c.closePath();c.fill();}
      for(const sd of [-1,1]){c.fillStyle=sd===S?tk(C.jacket,-.32):tk(C.jacket,-.12);c.beginPath();c.moveTo(sd*(nb+2),ny-8);c.lineTo(sd*(nb+38),ny+60);c.lineTo(sd*(nb+26),ny+74);c.lineTo(sd*(nb+36),ny+88);c.lineTo(sd*12,ny+250);c.lineTo(sd*(nb-2),ny+10);c.closePath();c.fill();}
      for(const sd of [-1,1]){c.fillStyle=sd===S?tk(sh_,-.12):sh_;c.beginPath();c.moveTo(sd*nb*.85,ny-10);c.lineTo(sd*(nb+12),ny-2);c.lineTo(sd*(nb+4),ny+(open?36:24));c.lineTo(sd*(open?nb*.55:4),ny+(open?20:12));c.closePath();c.fill();}
      c.restore();}
    else{c.save();for(const sd of [-1,1]){c.fillStyle=sd===S?tk(sh_,-.2):sh_;c.beginPath();c.moveTo(sd*nb*.8,ny-10);c.lineTo(sd*(nb+18),ny);c.lineTo(sd*(nb+6),ny+38);c.lineTo(sd*5,ny+18);c.closePath();c.fill();}
      if(C.tie){c.fillStyle=C.tie;c.beginPath();c.moveTo(-8,ny+12);c.lineTo(8,ny+12);c.lineTo(13,ny+170);c.lineTo(0,ny+186);c.lineTo(-13,ny+170);c.closePath();c.fill();}
      if(C.chain){c.strokeStyle='#d8b452';c.lineWidth=4;c.beginPath();c.moveTo(-nb*.7,ny-4);c.quadraticCurveTo(0,ny+44,nb*.7,ny-4);c.stroke();}
      c.restore();}}
  if(C.k==='clown'){c.save();
    // гофрированный воротник
    const rf=(r,col,col2)=>{const n=18;c.beginPath();for(let k=0;k<=n;k++){const a=Math.PI*(1+k/n),R=k%2?r:r*.78;c.lineTo(Math.cos(a)*R*1.25,ny-6-Math.sin(a)*R*.42);}
      for(let k=n;k>=0;k--){const a=Math.PI*(k/n),R=k%2?r:r*.78;c.lineTo(Math.cos(a)*R*1.25,ny-6+Math.sin(a)*R*.55);}c.closePath();c.fillStyle=col;c.fill();
      c.save();c.clip();c.fillStyle=col2;c.fillRect(S>0?0:-r*2,ny-80,r*2,160);c.restore();};
    rf(96,'#ffffff','#dfe3ea');rf(70,'#5fb7e8','#3d93c6');
    for(const [k,col] of [[0,'#e4402f'],[1,'#2e7fd6'],[2,'#3bb05a']]){c.fillStyle=col;c.beginPath();c.arc(0,ny+90+k*92,15,0,TAU);c.fill();c.fillStyle='rgba(255,255,255,.5)';c.beginPath();c.arc(-4,ny+85+k*92,4.5,0,TAU);c.fill();}
    c.restore();}
  if(C.k==='parka'){c.save();c.fillStyle='#2a2a2e';c.beginPath();c.moveTo(-nb-6,ny-8);c.lineTo(0,ny+40);c.lineTo(nb+6,ny-8);c.lineTo(nb+10,ny+260);c.lineTo(-nb-10,ny+260);c.closePath();c.fill();
    c.fillStyle='#57563a';for(const sd of [-1,1]){c.beginPath();c.moveTo(sd*(nb+2),ny-14);c.quadraticCurveTo(sd*(nb+50),ny-6,sd*(nb+56),ny+30);c.lineTo(sd*(nb+14),ny+30);c.closePath();c.fill();}
    c.strokeStyle='#4a492f';c.lineWidth=4;for(const sd of [-1,1]){c.beginPath();c.moveTo(sd*(nb+12),ny+30);c.lineTo(sd*(nb+16),bt);c.stroke();}c.restore();}
  if(C.k==='sweater'){c.save();c.fillStyle=tk(C.col,-.15);c.beginPath();c.moveTo(-nb-6,ny-8);c.quadraticCurveTo(0,ny+30,nb+6,ny-8);c.lineTo(nb+10,ny+2);c.quadraticCurveTo(0,ny+44,-nb-10,ny+2);c.closePath();c.fill();
    if(C.collar){c.fillStyle=C.collar;for(const sd of [-1,1]){c.beginPath();c.moveTo(sd*nb*.6,ny-6);c.lineTo(sd*(nb+4),ny);c.lineTo(sd*nb*.3,ny+22);c.closePath();c.fill();}}c.restore();}
  c.restore();}

const OFF9=mkc(WW,HH);
function rimF(c,path,col,dx,a){const g=OFF9.getContext('2d');g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='source-over';g.filter='none';g.clearRect(0,0,WW,HH);
  g.setTransform(c.getTransform());g.fillStyle=col;g.fill(path);g.globalCompositeOperation='destination-out';g.translate(dx,0);g.fill(path);
  c.save();c.setTransform(1,0,0,1,0,0);c.globalCompositeOperation='screen';c.globalAlpha=a;c.filter='blur(1.5px)';c.drawImage(OFF9,0,0);c.restore();}
function personF(c,o){neckF(c,o);bodyF(c,o);headF(c,o);
  if(o.soft&&o.rim){const F=typeof o.f==='string'?FL[o.f]:o.f,L=o.L??-1;c.save();c.translate(o.x,o.y);c.scale(o.s,o.s);const fp=fpath(F),hp=fhair(F);
    rimF(c,fp,o.rim,L*5,.7);if(hp)rimF(c,hp,o.rim,L*4,.45);c.restore();}}
