"use strict";
/* Люди v9 (27.11, «Твоими глазами»): шея, плечи, руки, кисти — без «головы на ластике».
   Локальные координаты человека: центр лица (0,0), макушка ≈ −114, подбородок ≈ +96, низ шеи +128.
   Порядок: person9 → тело (body9) → шея (neck9) → воротник (collar9) → голова (head9). Руки — arm9 / hand9 сцена кладёт сама. */

/* ---------- цвет ---------- */
const hx9=h=>{const n=parseInt(h.slice(1),16);return [n>>16,n>>8&255,n&255];};
const hex9=(r,g,b)=>'#'+[r,g,b].map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
function tk(h,k){const [r,g,b]=hx9(h),f=v=>k>0?v+(255-v)*k:v*(1+k);return hex9(f(r),f(g),f(b));}   // k>0 светлее
function tmix(a,b,k){const A=hx9(a),B=hx9(b);return hex9(lp(A[0],B[0],k),lp(A[1],B[1],k),lp(A[2],B[2],k));}
const INK='#1b1210';   // контур

/* заливка пути с объёмом: свет с вектора L=[lx,ly] (откуда свет), тень, контровой свет rim с другой стороны */
function vol(c,path,base,box,o={}){const [x0,y0,x1,y1]=box,cx=(x0+x1)/2,cy=(y0+y1)/2,R=Math.max(x1-x0,y1-y0)*.55,L=o.L||[-.7,-.5];
  c.save();c.fillStyle=base;c.fill(path);c.clip(path);
  c.fillStyle=LG(c,cx+L[0]*R,cy+L[1]*R,cx-L[0]*R,cy-L[1]*R,[[0,rgba(tk(base,.35),o.la??.55)],[.42,rgba(base,0)],[.62,rgba(tk(base,-.45),0)],[1,rgba(tk(base,-.5),o.da??.75)]]);
  c.fillRect(x0-20,y0-20,x1-x0+40,y1-y0+40);
  if(o.rim){c.globalCompositeOperation='screen';c.strokeStyle=rgba(o.rim,o.ra??.55);c.lineWidth=o.rw||10;c.filter=`blur(${o.rb||5}px)`;c.translate(L[0]*(o.rw||10)*.6,L[1]*(o.rw||10)*.6);c.stroke(path);}
  c.restore();
  if(o.ink!==0){c.save();c.strokeStyle=rgba(INK,o.ink??.55);c.lineWidth=o.iw||2.2;c.lineJoin='round';c.stroke(path);c.restore();}}

/* ---------- лица ---------- */
const FACES={
  max:{skin:'#d3a083',fw:62,jw:55,jy:64,cw:23,cy:100,top:-116,eyeY:-5,eyeX:26.5,eyeW:14.5,eyeH:6.4,hood:.85,deep:.75,slant:1.8,big:1.15,
    brow:{y:-18.5,th:10,col:'#271910',tilt:.03,arch:2},nose:{len:40,w:16.5,br:7,tip:10.5},mouth:{y:62,w:23.5,up:7,lo:11,col:'#a9665e',smirk:0},
    cleft:1,stubble:.6,hair:'max',hairC:'#2a1c15',iris:'#5e4128'},
  lyosha:{skin:'#e9d0c4',fw:60,jw:48,jy:54,cw:20,cy:84,top:-104,kid:1,eyeY:8,eyeX:24,eyeW:15.5,eyeH:10,hood:.05,deep:.34,slant:.5,
    brow:{y:-12,th:3,col:'#c4a590',tilt:.08,arch:5},nose:{len:26,w:10.5,br:4,tip:6.5},mouth:{y:54,w:14,up:3.4,lo:5,col:'#b98d89'},nw:.86,
    hair:'bald',ears:'out',pale:1,bags:.55,iris:'#6a7a8a',nw:.92},
  boss:{skin:'#d4a28c',fw:67,jw:61,jy:66,cw:27,cy:100,top:-108,eyeY:-4,eyeX:27,eyeW:14,eyeH:6.4,hood:.7,deep:.45,
    brow:{y:-25,th:7.5,col:'#8d867e',tilt:.08,arch:4},nose:{len:42,w:15.5,br:7,tip:9},mouth:{y:60,w:21,up:3.5,lo:5.5,col:'#9a6a60',down:1.5},
    hair:'grey',hairC:'#b8b4ad',wrinkles:1,jowl:1,glasses:'#2b2622',iris:'#4b4640'},
  woman:{skin:'#e2b49b',fw:58,jw:44,jy:56,cw:18,cy:90,top:-112,eyeY:-4,eyeX:24,eyeW:15,eyeH:8.6,hood:.2,deep:.3,
    brow:{y:-26,th:5,col:'#4a2c1e',tilt:-.12,arch:5},nose:{len:33,w:10.5,br:4.5,tip:6},mouth:{y:52,w:17,up:4.6,lo:6.4,col:'#b0504c'},
    hair:'bun',hairC:'#5a3423',lashes:1,iris:'#4a3522'},
  glasses:{skin:'#cf9c80',fw:61,jw:52,jy:60,cw:22,cy:95,top:-112,eyeY:-5,eyeX:25,eyeW:14,eyeH:7,hood:.35,deep:.4,
    brow:{y:-26,th:6.5,col:'#3a2a20',tilt:0,arch:3},nose:{len:38,w:12.5,br:5.5,tip:7},mouth:{y:56,w:18,up:4,lo:6,col:'#a46658'},
    hair:'side',hairC:'#4a3326',glasses:'#1a1614',stubble:.25,iris:'#3d2c20'},
};
FACES.young={skin:'#dcae94',fw:60,jw:51,jy:60,cw:21,cy:94,top:-112,eyeY:-5,eyeX:25,eyeW:14.5,eyeH:7.6,hood:.3,deep:.35,
  brow:{y:-24,th:6.5,col:'#6b4a33',tilt:-.02,arch:3},nose:{len:36,w:12,br:5,tip:7},mouth:{y:55,w:18,up:4.4,lo:6.4,col:'#ad6c5e'},hair:'side',hairC:'#8a6242',iris:'#5a6f7e'};
FACES.woman2={skin:'#edc4ac',fw:57,jw:43,jy:55,cw:17,cy:89,top:-112,eyeY:-4,eyeX:24,eyeW:15,eyeH:8.8,hood:.15,deep:.28,
  brow:{y:-26,th:4.6,col:'#2c1d16',tilt:-.1,arch:5},nose:{len:32,w:10,br:4.5,tip:6},mouth:{y:51,w:16,up:4.6,lo:6.6,col:'#a84b4b'},hair:'long',hairC:'#1f1511',lashes:1,iris:'#3b2a20'};
FACES.maxClown={...FACES.max,paint:1,hair:'maxMess',mouth:{...FACES.max.mouth,smirk:0}};

function facePath(F){const fw=F.fw,jw=F.jw,jy=F.jy,cw=F.cw,cy=F.cy,t=F.top,p=new Path2D();
  p.moveTo(0,t);p.bezierCurveTo(fw*.62,t,fw,t*.66,fw,-24);p.bezierCurveTo(fw,6,fw*.97,jy*.55,jw,jy);
  p.bezierCurveTo(jw*.82,jy+(cy-jy)*.55,cw*1.25,cy-3,cw,cy-1);p.quadraticCurveTo(0,cy+2,-cw,cy-1);
  p.bezierCurveTo(-cw*1.25,cy-3,-jw*.82,jy+(cy-jy)*.55,-jw,jy);p.bezierCurveTo(-fw*.97,jy*.55,-fw,6,-fw,-24);p.bezierCurveTo(-fw,t*.66,-fw*.62,t,0,t);p.closePath();return p;}

/* волосы: путь в координатах головы */
function hairPath9(F){const w=F.fw+5,t=F.top,st=F.hair,p=new Path2D();
  if(st==='max'||st==='maxMess'){const m=st==='maxMess'?1:0;
    p.moveTo(-w+5,-14);p.bezierCurveTo(-w-1,-46,-w+2,t+24,-w*.5,t+2-m*6);p.bezierCurveTo(-w*.1,t-10-m*4,w*.45,t-8,w*.8,t+12);
    p.bezierCurveTo(w+3,t+30,w+1,-44,w-3,-14);p.lineTo(w-9,-18);p.bezierCurveTo(w-9,-30,w-12,-42,w-16,-50);
    // чёлка: пряди падают вниз-влево, концы мягкие
    const lock=(x0,y0,x1,y1,bend)=>{p.quadraticCurveTo(x0+bend,y0+(y1-y0)*.4,x1,y1);};
    p.quadraticCurveTo(w*.6,-48,w*.52,-40+m*3);p.quadraticCurveTo(w*.44,-52,w*.3,-46);p.quadraticCurveTo(w*.2,-40+m*4,w*.1,-33+m*5);
    p.quadraticCurveTo(w*.02,-46,-w*.14,-42);p.quadraticCurveTo(-w*.26,-36+m*4,-w*.38,-30+m*6);p.quadraticCurveTo(-w*.44,-44,-w*.58,-44);
    p.quadraticCurveTo(-w*.7,-36,-w*.76,-28+m*4);p.bezierCurveTo(-w+11,-36,-w+10,-24,-w+11,-16);p.closePath();
    return p;}
  if(st==='grey'){p.moveTo(-w,-4);p.bezierCurveTo(-w-4,-40,-w+4,-70,-w+18,-82);p.lineTo(-w+30,-70);p.bezierCurveTo(-w+20,-56,-w+12,-34,-w+10,-6);p.closePath();
    p.moveTo(w,-4);p.bezierCurveTo(w+4,-40,w-4,-70,w-18,-82);p.lineTo(w-30,-70);p.bezierCurveTo(w-20,-56,w-12,-34,w-10,-6);p.closePath();
    p.moveTo(-w*.55,-92);p.bezierCurveTo(-w*.2,t-4,w*.3,t-4,w*.6,-90);p.bezierCurveTo(w*.3,-96,-w*.2,-97,-w*.55,-92);p.closePath();return p;}
  if(st==='bun'){p.moveTo(-w-2,30);p.bezierCurveTo(-w-10,-40,-w*.7,t-6,0,t-6);p.bezierCurveTo(w*.7,t-6,w+10,-40,w+2,30);p.lineTo(w-8,10);
    p.bezierCurveTo(w-10,-30,w-24,-60,w-40,-66);p.bezierCurveTo(w*.1,-76,-w*.3,-72,-w+30,-62);p.bezierCurveTo(-w+12,-48,-w+8,-20,-w+8,10);p.closePath();
    p.moveTo(w*.75+26,t+18);p.arc(w*.75,t+18,26,0,TAU);return p;}
  if(st==='side'){p.moveTo(-w,-6);p.bezierCurveTo(-w-4,-64,-w*.62,t+6,0,t+4);p.bezierCurveTo(w*.66,t+4,w+4,-66,w,-6);p.lineTo(w-7,-12);
    p.bezierCurveTo(w-8,-40,w-16,-56,w-30,-62);p.bezierCurveTo(w-60,-68,-10,-76,-28,-66);p.bezierCurveTo(-40,-62,-w+16,-58,-w+10,-44);p.bezierCurveTo(-w+7,-34,-w+7,-22,-w+7,-12);p.closePath();return p;}
  if(st==='long'){p.moveTo(-w-6,90);p.bezierCurveTo(-w-14,-40,-w*.7,t-4,0,t-4);p.bezierCurveTo(w*.7,t-4,w+14,-40,w+6,90);p.lineTo(w-10,80);
    p.bezierCurveTo(w-6,0,w-14,-50,w-30,-60);p.bezierCurveTo(14,-66,-20,-74,-w+26,-58);p.bezierCurveTo(-w+10,-40,-w+6,0,-w+10,80);p.closePath();return p;}
  return null;}

function ear9(c,F,sd,L){const x=sd*(F.fw-2),out=F.ears==='out'?1.5:1,S=F.skin;
  c.save();c.translate(x,4);c.scale(sd,1);const p=new Path2D();p.moveTo(-2,-24);p.bezierCurveTo(12*out,-30,18*out,-10,14*out,8);p.bezierCurveTo(12*out,22,6,30,-2,26);p.closePath();
  vol(c,p,sd===L?tk(S,-.04):tk(S,-.16),[-4,-30,18*out,30],{L:[sd*-.3,-.5],ink:.45,iw:1.8});
  c.strokeStyle=rgba(tk(S,-.5),.5);c.lineWidth=2;c.beginPath();c.moveTo(3,-16);c.bezierCurveTo(10*out,-18,11*out,0,7*out,12);c.stroke();c.restore();}

/* голова. o: {x,y,s, f (ключ FACES или объект), turn −1..1, look [dx,dy], L (−1 свет слева / 1 справа), rim, expr:{smile,brow}, flipX} */
function head9(c,o){const F=typeof o.f==='string'?FACES[o.f]:o.f,L=o.L??-1,t=o.turn||0,S=F.paint?'#ece8e2':F.skin;
  c.save();c.translate(o.x,o.y);c.scale(o.s*(o.flipX?-1:1),o.s);
  const fp=facePath(F),box=[-F.fw,F.top,F.fw,F.cy];
  for(const sd of [-1,1])if(F.hair!=='bun'||true)ear9(c,F,sd,L);
  // кожа лица
  c.save();c.fillStyle=S;c.fill(fp);c.clip(fp);
  const Lv=[L*.8,-.45],R=F.fw*1.2;
  c.fillStyle=LG(c,L*R,-30,-L*R,10,[[0,rgba(tk(S,.3),.6)],[.4,rgba(S,0)],[.58,rgba(tk(S,-.4),0)],[1,rgba(tk(S,-.5),.62)]]);c.fillRect(-90,-130,180,240);
  const dk=tk(F.skin,-.55);
  // глубокие глазницы
  for(const sd of [-1,1]){c.fillStyle=RG(c,sd*F.eyeX+t*12,F.eyeY-5,2,22,[[0,rgba(dk,.42*F.deep)],[1,rgba(dk,0)]]);c.save();c.translate(sd*F.eyeX+t*12,F.eyeY-5);c.scale(1.25,.8);c.translate(-(sd*F.eyeX+t*12),-(F.eyeY-5));c.fillRect(-90,-80,180,140);c.restore();}
  // скулы, виски
  for(const sd of [-1,1]){const k=sd===L?.6:1.15;c.save();c.translate(sd*(F.fw-14),F.eyeY+38);c.rotate(sd*.7);c.fillStyle=RG(c,0,0,1,26,[[0,rgba(dk,.22*k)],[1,rgba(dk,0)]]);c.scale(1,.45);c.fillRect(-40,-60,80,120);c.restore();
    c.fillStyle=RG(c,sd*(F.fw-4),-42,1,22,[[0,rgba(dk,.18*k)],[1,rgba(dk,0)]]);c.fillRect(sd*(F.fw-4)-30,-72,60,60);}
  // нос
  const N=F.nose,nx=t*16,ny0=F.eyeY+2,ny1=ny0+N.len;
  c.fillStyle=rgba(dk,.22);c.beginPath();c.moveTo(nx-L*3,ny0+N.len*.25);c.bezierCurveTo(nx-L*(N.br+2),ny0+N.len*.45,nx-L*(N.w-1),ny1-10,nx-L*N.w,ny1-2);c.bezierCurveTo(nx-L*N.w*.5,ny1+5,nx,ny1+4,nx+L*3,ny1+1);
  c.bezierCurveTo(nx-L*2,ny1-10,nx-L*1,ny0+N.len*.4,nx-L*1,ny0);c.closePath();c.fill();
  c.fillStyle=rgba(tk(S,.5),.28);c.beginPath();c.ellipse(nx+L*3,ny0+N.len*.55,2.6,N.len*.28,0,0,TAU);c.fill();
  c.beginPath();c.ellipse(nx+L*1.5,ny1-5,N.tip*.55,N.tip*.4,0,0,TAU);c.fill();
  c.fillStyle=rgba(tk(F.skin,-.6),.6);for(const sd of [-1,1]){c.beginPath();c.ellipse(nx+sd*N.w*.55,ny1+1,3.6,2.1,sd*.35,0,TAU);c.fill();}
  c.strokeStyle=rgba(dk,.32);c.lineWidth=2;for(const sd of [-1,1]){c.beginPath();c.arc(nx+sd*(N.w-4),ny1-4,6,sd>0?-1.2:Math.PI*.2+1.1,sd>0?1.1:Math.PI+1.2);c.stroke();}
  c.fillStyle=RG(c,nx,ny1+8,1,16,[[0,rgba(dk,.28)],[1,rgba(dk,0)]]);c.fillRect(nx-20,ny1-6,40,26);
  // носогубные, щетина
  c.strokeStyle=rgba(dk,F.wrinkles?.34:F.kid?0:.16);c.lineWidth=2.3;c.lineCap='round';
  for(const sd of [-1,1]){c.beginPath();c.moveTo(nx+sd*(N.w+3),ny1-3);c.quadraticCurveTo(nx+sd*(N.w+12),ny1+14,nx+sd*(F.mouth.w+5),F.mouth.y+4);c.stroke();}
  if(F.stubble){const r=rng(7);c.fillStyle=rgba('#3a2a26',.05*F.stubble);
    for(let i=0;i<1500;i++){const a=r()*TAU,rr=r(),x=(r()*2-1)*F.jw*1.05,y=F.mouth.y-16+r()*(F.cy-F.mouth.y+18);const inLip=Math.abs(x)<F.mouth.w+2&&Math.abs(y-F.mouth.y)<F.mouth.lo+2;if(inLip)continue;
      if(y<ny1+4&&Math.abs(x)>F.mouth.w+16)continue;c.fillRect(x,y,1.6,1.6);}
    c.fillStyle=rgba('#3c3436',.16*F.stubble);c.beginPath();c.moveTo(-F.jw,F.jy-10);c.bezierCurveTo(-F.jw*.9,F.cy,F.jw*.9,F.cy,F.jw,F.jy-10);c.lineTo(F.jw,F.cy+10);c.lineTo(-F.jw,F.cy+10);c.closePath();c.fill();}
  // челюсть снизу
  c.fillStyle=LG(c,0,F.cy-30,0,F.cy,[[0,rgba(dk,0)],[1,rgba(dk,.3)]]);c.fillRect(-90,F.cy-30,180,40);
  if(F.cleft){c.strokeStyle=rgba(dk,.4);c.lineWidth=2;c.beginPath();c.moveTo(1,F.cy-14);c.quadraticCurveTo(-1,F.cy-8,0,F.cy-3);c.stroke();}
  if(F.jowl){c.strokeStyle=rgba(dk,.25);c.lineWidth=3;for(const sd of [-1,1]){c.beginPath();c.moveTo(sd*(F.mouth.w+8),F.mouth.y+10);c.quadraticCurveTo(sd*(F.jw-6),F.jy+18,sd*(F.jw-14),F.cy-14);c.stroke();}}
  if(F.wrinkles){c.strokeStyle=rgba(dk,.22);c.lineWidth=1.8;for(let k=0;k<3;k++){c.beginPath();c.moveTo(-30,-56-k*9);c.quadraticCurveTo(0,-61-k*9,30,-56-k*9);c.stroke();}}
  if(F.bags){for(const sd of [-1,1]){c.fillStyle=RG(c,sd*F.eyeX,F.eyeY+11,1,16,[[0,rgba('#7a4f63',.3*F.bags)],[1,'rgba(122,79,99,0)']]);c.fillRect(sd*F.eyeX-20,F.eyeY,40,24);}}
  if(F.pale){c.fillStyle='rgba(170,190,210,.12)';c.fillRect(-90,-130,180,240);}
  // клоунский грим: белила + чёрные слёзы + красный рот
  if(F.paint){c.fillStyle='rgba(120,110,105,.10)';c.fillRect(-90,-130,180,240);
    c.strokeStyle='rgba(20,14,14,.82)';c.lineCap='round';for(const sd of [-1,1]){const ex=sd*F.eyeX+t*12;c.lineWidth=2.6;c.beginPath();c.moveTo(ex+sd*1,F.eyeY+9);c.lineTo(ex+sd*3,F.eyeY+30);c.stroke();
      c.lineWidth=2;c.beginPath();c.moveTo(ex-sd*1,F.eyeY-9);c.lineTo(ex-sd*2,F.eyeY-34);c.stroke();
      c.fillStyle='rgba(20,14,14,.75)';c.beginPath();c.ellipse(ex+sd*3.4,F.eyeY+33,2.4,3.6,0,0,TAU);c.fill();}}
  c.restore();
  // контур лица
  c.save();c.strokeStyle=rgba(INK,.5);c.lineWidth=2.2;c.stroke(fp);c.restore();
  // глаза
  const lk=o.look||[0,0];
  for(const sd of [-1,1]){const far=t!==0&&Math.sign(t)===-sd,ex=sd*F.eyeX+t*12,esc=far?1-Math.abs(t)*.25:1,ew=F.eyeW,eh=F.eyeH;
    c.save();c.translate(ex,F.eyeY);c.scale(esc*(sd<0?-1:1),1);
    const sl=F.slant??0,et=1.25-(F.hood||0)*.3,eye=new Path2D();eye.moveTo(-ew,-1);eye.bezierCurveTo(-ew*.5,-eh*et,ew*.35,-eh*(et+.05),ew,sl);eye.bezierCurveTo(ew*.5,eh*.85,-ew*.5,eh*.8,-ew,-1);eye.closePath();
    c.fillStyle='#ece6e0';c.fill(eye);c.save();c.clip(eye);const ir=eh*(F.big||.95),ix=lk[0]*5*(sd<0?-1:1),iy=lk[1]*3;
    c.fillStyle=F.iris;c.beginPath();c.arc(ix,iy,ir,0,TAU);c.fill();c.fillStyle=tk(F.iris,-.5);c.beginPath();c.arc(ix,iy,ir*.48,0,TAU);c.fill();
    c.fillStyle=rgba('#000',.25+F.hood*.2);c.fillRect(-ew-2,-eh*1.3,ew*2+4,eh*(.55+F.hood*.5));c.restore();
    c.fillStyle='rgba(255,255,255,.9)';c.beginPath();c.arc(ix+2,iy-2.2,1.6,0,TAU);c.fill();
    c.strokeStyle=F.paint?'#160e0c':'#24140e';c.lineWidth=3.2;c.lineCap='round';c.beginPath();c.moveTo(-ew-1,-.5);c.bezierCurveTo(-ew*.5,-eh*et,ew*.35,-eh*(et+.05),ew+1.5,sl+.8);c.stroke();
    if(F.lashes){c.lineWidth=2;for(let k=0;k<3;k++){c.beginPath();c.moveTo(ew*.4+k*3,-eh*.95+k*2);c.lineTo(ew*.6+k*4,-eh*1.4+k*2);c.stroke();}}
    c.fillStyle=rgba(tk(F.skin,-.5),.28*F.hood);c.beginPath();c.moveTo(-ew-3,-2);c.bezierCurveTo(-ew*.5,-eh*2.3,ew*.6,-eh*2.3,ew+4,sl-1);c.bezierCurveTo(ew*.4,-eh*1.3,-ew*.5,-eh*1.25,-ew-3,-2);c.fill();
    // складка века (нависшее веко — близко к ресницам)
    c.strokeStyle=rgba(tk(F.skin,-.55),.5);c.lineWidth=1.8;c.beginPath();c.moveTo(-ew*.8,-eh*(1.1-F.hood*.35));c.quadraticCurveTo(0,-eh*(1.75-F.hood*.5),ew*.9,-eh*(.9-F.hood*.3));c.stroke();
    c.strokeStyle=rgba(tk(F.skin,-.35),.45);c.lineWidth=1.4;c.beginPath();c.moveTo(-ew*.7,eh*.7);c.quadraticCurveTo(0,eh*1.05,ew*.8,eh*.35);c.stroke();
    c.restore();
    // бровь — сплошная, толстая у носа
    const B=F.brow,bu=o.expr&&o.expr.brow||0,bx=ex,by=B.y-bu;c.save();c.translate(bx,by);c.scale(sd*esc,1);c.rotate(B.tilt||0);
    c.fillStyle=B.col;c.beginPath();c.moveTo(-17,B.th*.45);c.bezierCurveTo(-8,-B.th*.6-B.arch*.3,6,-B.th*.7-B.arch,19,-B.th*.1-B.arch*.3+3);c.bezierCurveTo(8,-B.th*.05-B.arch*.4,-6,B.th*.3,-17,B.th*.45);
    c.lineTo(-17,-B.th*.55);c.closePath();c.fill();c.strokeStyle=rgba(tk(B.col,.25),.35);c.lineWidth=1;for(let k=0;k<5;k++){c.beginPath();c.moveTo(-14+k*7,B.th*.2);c.lineTo(-10+k*7,-B.th*.5);c.stroke();}c.restore();}
  // рот
  const M=F.mouth,mx=t*14,my=M.y,sm=(o.expr&&o.expr.smile)||0,sk=M.smirk||0,mc=F.paint?'#b51d22':M.col;
  if(F.paint){c.save();c.fillStyle='rgba(185,25,32,.75)';c.beginPath();c.moveTo(mx-M.w-10,my-2);c.quadraticCurveTo(mx,my-M.up-6,mx+M.w+12,my-6);c.quadraticCurveTo(mx+M.w+4,my+M.lo+6,mx,my+M.lo+5);c.quadraticCurveTo(mx-M.w-6,my+M.lo+4,mx-M.w-10,my-2);c.fill();
    c.fillStyle='rgba(185,25,32,.35)';c.beginPath();c.ellipse(mx+M.w+10,my-4,6,3,-.4,0,TAU);c.fill();c.restore();}
  c.fillStyle=tk(mc,-.12);c.beginPath();c.moveTo(mx-M.w,my+sk*-2-sm*2);c.bezierCurveTo(mx-M.w*.5,my-M.up,mx-4,my-M.up-1,mx,my-M.up*.55);c.bezierCurveTo(mx+4,my-M.up-1,mx+M.w*.5,my-M.up,mx+M.w,my-sm*3-sk*4);
  c.quadraticCurveTo(mx,my+1,mx-M.w,my+sk*-2-sm*2);c.fill();
  c.fillStyle=mc;c.beginPath();c.moveTo(mx-M.w+2,my+.5-sm);c.quadraticCurveTo(mx,my+M.lo*1.35,mx+M.w-2,my-sm*2-sk*3);c.quadraticCurveTo(mx,my+1,mx-M.w+2,my+.5-sm);c.fill();
  c.fillStyle='rgba(255,235,225,.35)';c.beginPath();c.ellipse(mx+2,my+M.lo*.5,M.w*.35,1.8,0,0,TAU);c.fill();
  c.strokeStyle=rgba(tk(mc,-.6),.85);c.lineWidth=2.2;c.lineCap='round';c.beginPath();c.moveTo(mx-M.w,my-sm*2-(M.down||0)*-2);c.quadraticCurveTo(mx,my+1.5+sm*2,mx+M.w+sk*2,my-sm*3-sk*5+(M.down||0)*2);c.stroke();
  // волосы
  const hp=hairPath9(F);if(hp){c.fillStyle=F.hairC;c.fill(hp);c.save();c.clip(hp);
    c.fillStyle=LG(c,L*60,-100,-L*60,0,[[0,rgba(tk(F.hairC,.3),.5)],[.5,rgba(F.hairC,0)],[1,rgba(tk(F.hairC,-.6),.6)]]);c.fillRect(-100,-140,200,240);
    c.save();c.globalCompositeOperation='screen';c.strokeStyle=rgba(tk(F.hairC,.45),.12);c.lineWidth=14;c.filter='blur(4px)';c.beginPath();c.moveTo(-F.fw*.6,F.top+30);c.quadraticCurveTo(0,F.top+14,F.fw*.55,F.top+34);c.stroke();c.restore();
    c.strokeStyle=rgba(tk(F.hairC,-.6),.4);c.lineWidth=2;const r=rng(F.fw*7);for(let i=0;i<7;i++){const x=-F.fw*.6+i*F.fw*.2+r()*6,y=F.top+26+r()*12;c.beginPath();c.moveTo(x+10,y);c.quadraticCurveTo(x,y+22,x-10,y+50);c.stroke();}
    c.restore();c.strokeStyle=rgba(INK,.55);c.lineWidth=2;c.stroke(hp);}
  if(F.hair==='bald'){c.save();c.clip(fp);c.fillStyle=RG(c,L*20,F.top+30,2,46,[[0,'rgba(255,255,255,.35)'],[1,'rgba(255,255,255,0)']]);c.fillRect(-60,F.top-10,120,90);c.restore();}
  // очки
  if(F.glasses){c.strokeStyle=F.glasses;c.lineWidth=3.2;for(const sd of [-1,1]){const ex=sd*F.eyeX+t*12;RR(c,ex-18,F.eyeY-12,36,24,7);c.stroke();
      c.save();RR(c,ex-18,F.eyeY-12,36,24,7);c.clip();c.fillStyle='rgba(200,225,255,.13)';c.fillRect(ex-18,F.eyeY-12,36,24);c.fillStyle='rgba(255,255,255,.28)';c.beginPath();c.moveTo(ex-10,F.eyeY-12);c.lineTo(ex-2,F.eyeY-12);c.lineTo(ex-14,F.eyeY+12);c.lineTo(ex-20,F.eyeY+12);c.closePath();c.fill();c.restore();}
    c.beginPath();c.moveTo(-F.eyeX+18+t*12,F.eyeY-4);c.quadraticCurveTo(t*12,F.eyeY-9,F.eyeX-18+t*12,F.eyeY-4);c.stroke();
    for(const sd of [-1,1]){c.beginPath();c.moveTo(sd*(F.eyeX+18)+t*12,F.eyeY-6);c.lineTo(sd*(F.fw-1),F.eyeY-8);c.stroke();}}
  // контровой свет
  if(o.rim){c.save();c.clip(fp);c.globalCompositeOperation='screen';c.strokeStyle=rgba(o.rim,o.ra??.6);c.lineWidth=9;c.filter='blur(4px)';c.translate(-L*7,-2);c.stroke(fp);c.restore();}
  c.restore();}

/* шея: от подбородка до ключиц */
function neck9(c,o){const F=typeof o.f==='string'?FACES[o.f]:o.f,L=o.L??-1,S=F.paint?F.skin:F.skin,nw=F.jw*(F.nw||.74);
  c.save();c.translate(o.x,o.y);c.scale(o.s*(o.flipX?-1:1),o.s);
  const p=new Path2D();p.moveTo(-nw,F.jy-6);p.bezierCurveTo(-nw*.98,F.cy+14,-nw*1.02,F.cy+26,-nw*1.3,F.cy+36);p.lineTo(-nw*1.45,F.cy+150);p.lineTo(nw*1.45,F.cy+150);p.lineTo(nw*1.3,F.cy+36);p.bezierCurveTo(nw*1.02,F.cy+26,nw*.98,F.cy+14,nw,F.jy-6);p.closePath();
  vol(c,p,tk(S,-.08),[-nw*1.45,F.jy,nw*1.45,F.cy+150],{L:[L*.8,-.15],ink:.45,da:.5});
  c.save();c.clip(p);c.fillStyle=LG(c,0,F.cy+40,0,F.cy+150,[[0,rgba(tk(S,.1),0)],[1,rgba(tk(S,.08),.0)]]);c.fillRect(-90,F.cy+40,180,110);c.fillStyle=LG(c,0,F.cy-6,0,F.cy+26,[[0,rgba(tk(S,-.62),.62)],[1,rgba(tk(S,-.62),0)]]);c.fillRect(-90,F.cy-10,180,40);
  if(!F.pale&&o.adam!==0){c.fillStyle=rgba(tk(S,.3),.35);c.beginPath();c.ellipse(L*2,F.cy+22,4,7,0,0,TAU);c.fill();}
  for(const sd of [-1,1]){c.strokeStyle=rgba(tk(S,-.5),.25);c.lineWidth=2.4;c.beginPath();c.moveTo(sd*nw*.7,F.cy-4);c.quadraticCurveTo(sd*nw*.35,F.cy+30,sd*6,F.cy+58);c.stroke();}
  c.restore();c.restore();}

/* ---------- тело ---------- */
/* o.cloth: {k:'suit'|'shirt'|'flannel'|'blouse'|'hoodie', jacket, shirt, tie, open, a,b (клетка)}; o.sw — полуширина плеч; o.lean — наклон корпуса (рад) */
function torsoPath(o){const sw=o.sw||132,F=o.F,ny=F.cy+46,p=new Path2D(),bt=o.bt||620,wa=sw*.92,nb=F.jw*(F.nw||.74)*1.3,C=o.cloth||{},vy=C.open?ny+96:ny+4;
  p.moveTo(nb,ny-14);p.quadraticCurveTo(nb*.4,C.open?ny+30:ny+4,0,vy);p.quadraticCurveTo(-nb*.4,C.open?ny+30:ny+4,-nb,ny-14);p.bezierCurveTo(-nb-20,ny-2,-sw*.78,ny+12,-sw*.95,ny+40);p.bezierCurveTo(-sw*1.1,ny+62,-sw*1.12,ny+110,-sw*1.08,ny+170);
  p.lineTo(-wa,bt);p.lineTo(wa,bt);p.lineTo(sw*1.08,ny+170);p.bezierCurveTo(sw*1.12,ny+110,sw*1.1,ny+62,sw*.95,ny+40);p.bezierCurveTo(sw*.78,ny+12,nb+20,ny-2,nb,ny-14);p.closePath();return p;}
function body9(c,o){const F=typeof o.f==='string'?FACES[o.f]:o.f,L=o.L??-1,C=o.cloth||{k:'suit'},sw=o.sw||132,ny=F.cy+46;
  c.save();c.translate(o.x,o.y);c.scale(o.s*(o.flipX?-1:1),o.s);if(o.lean){c.translate(0,ny);c.rotate(o.lean);c.translate(0,-ny);}
  const T=torsoPath({...o,F}),base=C.k==='suit'?C.jacket:C.k==='flannel'?C.a:C.k==='hoodie'?C.col:C.shirt;
  vol(c,T,base,[-sw*1.1,ny,sw*1.1,o.bt||620],{L:[L*.8,-.4],rim:o.rim,ra:.45,rw:14,da:.85});
  c.save();c.clip(T);
  if(C.k==='flannel'){const a=C.a,b=C.b;c.globalAlpha=.55;for(let x=-sw*1.2;x<sw*1.2;x+=46){c.fillStyle=rgba(b,.55);c.fillRect(x,ny,18,800);c.fillStyle=rgba('#e9dcc4',.25);c.fillRect(x+24,ny,4,800);}
    for(let y=ny;y<ny+800;y+=46){c.fillStyle=rgba(b,.45);c.fillRect(-sw*1.2,y,sw*2.4,18);c.fillStyle=rgba('#e9dcc4',.2);c.fillRect(-sw*1.2,y+24,sw*2.4,4);}c.globalAlpha=1;
    c.fillStyle=LG(c,sw*L,0,-sw*L,0,[[0,'rgba(255,240,220,.12)'],[.5,'rgba(0,0,0,0)'],[1,'rgba(0,0,0,.4)']]);c.fillRect(-sw*1.2,ny,sw*2.4,800);
    c.strokeStyle='rgba(0,0,0,.3)';c.lineWidth=2.5;c.beginPath();c.moveTo(4,ny+10);c.lineTo(8,ny+600);c.stroke();for(let k=0;k<4;k++){c.fillStyle='#d9ccb4';c.beginPath();c.arc(-6,ny+70+k*90,4,0,TAU);c.fill();}}
  // складки
  c.strokeStyle=rgba('#000',.22);c.lineWidth=3;c.lineCap='round';
  for(const sd of [-1,1]){c.beginPath();c.moveTo(sd*sw*.86,ny+130);c.quadraticCurveTo(sd*sw*.7,ny+260,sd*sw*.8,ny+420);c.stroke();
    c.beginPath();c.moveTo(sd*sw*.95,ny+60);c.quadraticCurveTo(sd*sw*.82,ny+80,sd*sw*.66,ny+76);c.stroke();}
  c.restore();
  c.restore();}

/* воротник/грудь поверх шеи: рубашка, галстук, лацканы */
function collar9(c,o){const F=typeof o.f==='string'?FACES[o.f]:o.f,L=o.L??-1,C=o.cloth||{k:'suit'},ny=F.cy+46,nw=F.jw*.56;
  c.save();c.translate(o.x,o.y);c.scale(o.s*(o.flipX?-1:1),o.s);if(o.lean){c.translate(0,ny);c.rotate(o.lean);c.translate(0,-ny);}
  const shirt=C.shirt||'#eceef0',open=C.open,vy=open?ny+86:ny+30;
  if(C.k==='suit'||C.k==='shirt'){
    // треугольник рубашки и кожи
    if(C.k==='suit'){const sh=new Path2D();sh.moveTo(-60,ny+2);sh.lineTo(-nw*1.1,ny-14);sh.lineTo(0,vy+(open?6:70));sh.lineTo(nw*1.1,ny-14);sh.lineTo(60,ny+2);sh.lineTo(26,ny+200);sh.lineTo(-26,ny+200);sh.closePath();
      if(!open){vol(c,sh,shirt,[-60,ny,60,ny+200],{L:[L,-.3],ink:.3});}else{const nwb=F.jw*(F.nw||.74)*1.25,W2=nwb*1.45;
        const nb3_=F.jw*(F.nw||.74)*1.25,clipV=new Path2D();clipV.moveTo(-nb3_*1.3,ny-16);clipV.lineTo(nb3_*1.3,ny-16);clipV.lineTo(nb3_*1.3,ny+20);clipV.lineTo(16,ny+262);clipV.lineTo(-16,ny+262);clipV.lineTo(-nb3_*1.3,ny+20);clipV.closePath();c.save();c.clip(clipV);
        for(const sd of [-1,1]){const h=new Path2D();h.moveTo(sd*(nwb+4),ny-14);h.quadraticCurveTo(sd*nwb*.45,ny+24,sd*1,vy);h.lineTo(sd*1,ny+230);h.lineTo(sd*W2,ny+230);h.lineTo(sd*W2,ny-6);h.closePath();
          c.save();c.fillStyle=tk(shirt,sd===L?0:-.08);c.fill(h);c.clip(h);c.fillStyle=LG(c,-60*L,0,60*L,0,[[0,'rgba(255,255,255,.08)'],[1,'rgba(0,0,0,.28)']]);c.fillRect(-90,ny-20,180,260);c.restore();
          c.save();c.strokeStyle=rgba(tk(F.skin,-.6),.35);c.lineWidth=5;c.filter='blur(3px)';c.beginPath();c.moveTo(sd*(nwb+2),ny-12);c.quadraticCurveTo(sd*nwb*.45,ny+24,sd*1,vy);c.stroke();c.restore();}
        c.restore();c.save();c.strokeStyle=rgba(tk(F.skin,-.45),.3);c.lineWidth=2.2;for(const sd of [-1,1]){c.beginPath();c.moveTo(sd*5,ny+6);c.quadraticCurveTo(sd*nwb*.5,ny,sd*nwb*.85,ny+6);c.stroke();}c.restore();}
      if(C.tie&&!open){c.fillStyle=C.tie;c.beginPath();c.moveTo(-9,ny+4);c.lineTo(9,ny+4);c.lineTo(7,ny+18);c.lineTo(-7,ny+18);c.closePath();c.fill();
        const tp=new Path2D();tp.moveTo(-7,ny+18);tp.lineTo(7,ny+18);tp.lineTo(15,ny+160);tp.lineTo(0,ny+182);tp.lineTo(-15,ny+160);tp.closePath();vol(c,tp,C.tie,[-15,ny+18,15,ny+182],{L:[L,-.2],ink:.4,iw:1.6});}
      // воротник рубашки
      for(const sd of [-1,1]){const cp=new Path2D();const nb2=F.jw*(F.nw||.74)*1.25;cp.moveTo(sd*nb2*.92,ny-18);cp.lineTo(sd*(nb2*1.22),ny-8);cp.lineTo(sd*(open?nb2*1.3:nb2*1.05),ny+(open?34:24));cp.lineTo(sd*(open?nb2*.62:6),ny+(open?18:12));cp.closePath();
        vol(c,cp,tk(shirt,sd===L?.04:-.12),[-60,ny-16,60,ny+40],{L:[L,-.4],ink:.45,iw:1.6});}
      // лацканы пиджака
      const J=C.jacket,nb3=F.jw*(F.nw||.74)*1.25;for(const sd of [-1,1]){const lp_=new Path2D();lp_.moveTo(sd*nb3*1.2,ny-10);lp_.lineTo(sd*(nb3*2.1),ny+70);lp_.lineTo(sd*(nb3*1.75),ny+88);lp_.lineTo(sd*(nb3*2.05),ny+100);lp_.lineTo(sd*(open?12:20),ny+260);lp_.lineTo(sd*(open?18:24),ny+40);lp_.closePath();
        vol(c,lp_,tk(J,sd===L?.12:-.18),[-90,ny-6,90,ny+260],{L:[L,-.3],ink:.6,iw:1.8});}
      c.fillStyle=tk(J,-.5);c.beginPath();c.arc(0,ny+290,5,0,TAU);c.fill();}
    else{ // просто рубашка: воротник и планка
      for(const sd of [-1,1]){const cp=new Path2D();cp.moveTo(sd*nw*1.05,ny-16);cp.lineTo(sd*(nw*1.5),ny-4);cp.lineTo(sd*(nw*1.5),ny+30);cp.lineTo(sd*4,ny+18);cp.closePath();vol(c,cp,tk(shirt,.05),[-60,ny-16,60,ny+30],{L:[L,-.4],ink:.45,iw:1.6});}
      if(C.tie){const tp=new Path2D();tp.moveTo(-8,ny+12);tp.lineTo(8,ny+12);tp.lineTo(14,ny+170);tp.lineTo(0,ny+190);tp.lineTo(-14,ny+170);tp.closePath();vol(c,tp,C.tie,[-15,ny,15,ny+190],{L:[L,-.2],ink:.4,iw:1.6});}
      else{c.strokeStyle='rgba(0,0,0,.25)';c.lineWidth=2;c.beginPath();c.moveTo(0,ny+18);c.lineTo(0,ny+400);c.stroke();for(let k=0;k<4;k++){c.fillStyle='#cfd3d6';c.beginPath();c.arc(5,ny+60+k*80,3.5,0,TAU);c.fill();}}}}
  else if(C.k==='flannel'){for(const sd of [-1,1]){const cp=new Path2D();cp.moveTo(sd*nw*1.05,ny-14);cp.lineTo(sd*nw*1.7,ny-2);cp.lineTo(sd*nw*1.4,ny+40);cp.lineTo(sd*4,ny+22);cp.closePath();vol(c,cp,tk(C.a,sd===L?.08:-.15),[-60,ny-14,60,ny+40],{L:[L,-.4],ink:.5,iw:1.6});}}
  else if(C.k==='blouse'){const v=new Path2D();v.moveTo(-nw*1.3,ny-8);v.quadraticCurveTo(0,ny+60,nw*1.3,ny-8);v.lineTo(nw*1.3,ny-30);v.lineTo(-nw*1.3,ny-30);v.closePath();
    c.save();c.globalCompositeOperation='source-atop';c.restore();
    const b=new Path2D();b.moveTo(-nw*1.45,ny-6);b.quadraticCurveTo(0,ny+66,nw*1.45,ny-6);b.lineTo(nw*1.7,ny+4);b.quadraticCurveTo(0,ny+80,-nw*1.7,ny+4);b.closePath();vol(c,b,tk(C.shirt,.06),[-70,ny-6,70,ny+80],{L:[L,-.4],ink:.35,iw:1.4});}
  c.restore();}

/* человек целиком: тело + шея + воротник + голова (руки — отдельно) */
function person9(c,o){neck9(c,o);body9(c,o);collar9(c,o);head9(c,o);}
/* точка в мировых координатах по локальной точке человека (для рук) */
function pt9(o,x,y){const ny=(typeof o.f==='string'?FACES[o.f]:o.f).cy+46;let X=x,Y=y;if(o.lean){const a=o.lean,dx=x,dy=y-ny;X=dx*Math.cos(a)-dy*Math.sin(a);Y=ny+dx*Math.sin(a)+dy*Math.cos(a);}
  return [o.x+X*o.s*(o.flipX?-1:1),o.y+Y*o.s];}

/* ---------- руки ---------- */
/* рукав/рука по точкам (мир): плечо S → локоть E → запястье W. o:{w0,w1 толщина у плеча/запястья, col, L, cuff (цвет манжеты), skin (голая рука)} */
function arm9(c,S,E,W,o={}){const w0=o.w0||60,w1=o.w1||40,col=o.col||'#1d1f26',L=o.L??-1;
  const seg=(A,B,a0,a1)=>{const dx=B[0]-A[0],dy=B[1]-A[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,p=new Path2D();
    p.moveTo(A[0]+nx*a0/2,A[1]+ny*a0/2);p.lineTo(B[0]+nx*a1/2,B[1]+ny*a1/2);p.arc(B[0],B[1],a1/2,Math.atan2(ny,nx),Math.atan2(ny,nx)+Math.PI,true);
    p.lineTo(A[0]-nx*a0/2,A[1]-ny*a0/2);p.arc(A[0],A[1],a0/2,Math.atan2(-ny,-nx),Math.atan2(-ny,-nx)+Math.PI,true);p.closePath();return p;};
  const wm=(w0+w1)/2,p1=seg(S,E,w0,wm),p2=seg(E,W,wm,w1);
  const all=new Path2D();all.addPath(p1);all.addPath(p2);
  const bx=[Math.min(S[0],E[0],W[0])-w0,Math.min(S[1],E[1],W[1])-w0,Math.max(S[0],E[0],W[0])+w0,Math.max(S[1],E[1],W[1])+w0];
  c.save();c.strokeStyle=rgba(INK,.6);c.lineWidth=4;c.stroke(p1);c.stroke(p2);c.restore();
  vol(c,p1,col,bx,{L:[L*.8,-.5],ink:0,rim:o.rim,ra:.4});vol(c,p2,tk(col,.03),bx,{L:[L*.8,-.5],ink:0,rim:o.rim,ra:.4});
  // складки на сгибе локтя
  c.save();c.strokeStyle=rgba('#000',.28);c.lineWidth=2.4;c.lineCap='round';for(let k=0;k<3;k++){c.beginPath();c.arc(E[0],E[1],wm*(.25+k*.12),0.3+k*.4,1.2+k*.4);c.stroke();}c.restore();
  if(o.cuff){const dx=W[0]-E[0],dy=W[1]-E[1],l=Math.hypot(dx,dy),ux=dx/l,uy=dy/l,nx=-uy,ny=ux;
    const q=new Path2D();const a=w1*.52,b=w1*.48;q.moveTo(W[0]-ux*6+nx*a,W[1]-uy*6+ny*a);q.lineTo(W[0]+ux*12+nx*b,W[1]+uy*12+ny*b);q.lineTo(W[0]+ux*12-nx*b,W[1]+uy*12-ny*b);q.lineTo(W[0]-ux*6-nx*a,W[1]-uy*6-ny*a);q.closePath();
    vol(c,q,o.cuff,[W[0]-w1,W[1]-w1,W[0]+w1,W[1]+w1],{L:[L,-.5],ink:.5,iw:1.6});}}

/* кисть. (x,y) — запястье, a — куда смотрят пальцы (рад), s — масштаб (1 ≈ голова масштаба 1),
   o.pose: flat|relax|fist|point|pen|grip|cig|rub, o.flip — левая рука, o.skin, o.L, o.thumbUnder (большой палец под ладонью) */
const HP={
  flat:{sp:[-.14,-.05,.04,.13],cu:[[.05,.04,.02],[.04,.03,.02],[.05,.04,.02],[.08,.05,.03]],th:[-.95,[.1,.05]]},
  relax:{sp:[-.1,-.03,.04,.1],cu:[[.25,.3,.2],[.3,.35,.25],[.35,.4,.3],[.45,.45,.35]],th:[-.75,[.25,.2]]},
  fist:{sp:[-.06,0,.05,.1],cu:[[1.4,1.4,1],[1.45,1.4,1],[1.45,1.4,1],[1.4,1.3,1]],th:[-.35,[.7,.5]]},
  point:{sp:[-.08,0,.05,.1],cu:[[.02,.02,0],[1.4,1.4,1],[1.45,1.4,1],[1.4,1.3,1]],th:[-.45,[.6,.4]]},
  rub:{sp:[-.3,0,.05,.1],cu:[[.15,.25,.1],[1.3,1.3,.9],[1.4,1.3,.9],[1.35,1.2,.9]],th:[-.35,[.6,.5]]},
  pen:{sp:[-.06,.02,.06,.11],cu:[[.45,.55,.25],[1.0,1.1,.7],[1.35,1.3,.9],[1.35,1.2,.9]],th:[-.25,[.35,.3]]},
  grip:{sp:[-.05,0,.04,.08],cu:[[1.05,.9,.6],[1.1,.9,.6],[1.1,.9,.6],[1.05,.9,.6]],th:[-.5,[.3,.2]]},
  cig:{sp:[-.12,.06,.06,.1],cu:[[.12,.15,.08],[.18,.2,.1],[1.35,1.3,.9],[1.35,1.2,.9]],th:[-.6,[.4,.3]]},
};
function hand9(c,x,y,a,s,o={}){const P=HP[o.pose||'relax'],S=o.skin||'#d6a184',L=o.L??-1,fl=o.flip?-1:1;
  c.save();c.translate(x,y);c.rotate(a);c.scale(s,s*fl);
  const KN=[[58,-17],[63,-5.5],[61,6],[55,16]],LEN=[[23,15,12],[26,17,13],[24,16,12],[19,12,10]],WD=[13.5,14,13,11.5];
  const parts=[],caps=[];
  const palm=new Path2D();palm.moveTo(-2,-19);palm.bezierCurveTo(14,-25,40,-26,58,-24);palm.quadraticCurveTo(68,-12,66,4);palm.quadraticCurveTo(64,20,55,24);palm.bezierCurveTo(36,26,14,24,-2,19);palm.closePath();
  // пальцы: ломаные
  const fing=[];for(let i=0;i<4;i++){const cuSum=P.cu[i][0]+P.cu[i][1]+P.cu[i][2];let ang=P.sp[i],px=KN[i][0],py=KN[i][1];const pts=[[px-6,py]];pts.push([px,py]);
    for(let j=0;j<3;j++){ang+=P.cu[i][j]*(o.side?1:.55);const sh_=1-Math.min(.62,P.cu[i][j]*.36*(o.side?0.4:1));px+=Math.cos(ang)*LEN[i][j]*sh_;py+=Math.sin(ang)*LEN[i][j]*sh_*(o.side?1:.55)+Math.sin(ang)*LEN[i][j]*(o.side?0:.0);pts.push([px,py]);}
    fing.push({pts,w:WD[i],tip:ang,nail:cuSum<1.2});}
  // большой палец
  let ta=P.th[0],tx_=14,ty_=-18;const tp=[[tx_-4,ty_+4],[tx_,ty_]];for(let j=0;j<2;j++){ta+=P.th[1][j];const ln=[24,18][j];tx_+=Math.cos(ta)*ln;ty_+=Math.sin(ta)*ln;tp.push([tx_,ty_]);}
  const thumb={pts:tp,w:16,tip:ta,nail:true};
  const stroke=(pts,w,col,lw)=>{c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]);c.strokeStyle=col;c.lineWidth=lw;c.stroke();};
  c.lineCap='round';c.lineJoin='round';
  const order=o.thumbUnder?[thumb,...fing]:[...fing,thumb];
  // 1) контур всего силуэта
  c.save();c.strokeStyle=rgba(INK,.7);c.lineWidth=4;c.stroke(palm);for(const f of order)stroke(f.pts,f.w,rgba(INK,.7),f.w+4);c.restore();
  // 2) заливка
  c.fillStyle=S;c.fill(palm);for(const f of order)stroke(f.pts,f.w,S,f.w);
  // 3) свет/тень на ладони
  c.save();c.clip(palm);c.fillStyle=LG(c,30,-26*L*fl,30,26*L*fl,[[0,rgba(tk(S,.35),.5)],[.5,rgba(S,0)],[1,rgba(tk(S,-.45),.55)]]);c.fillRect(-10,-40,90,80);
  c.strokeStyle=rgba(tk(S,-.4),.35);c.lineWidth=2;for(const k of KN.slice(0,4)){c.beginPath();c.moveTo(k[0]-22,k[1]*.7);c.lineTo(k[0]-6,k[1]*.95);c.stroke();}c.restore();
  // костяшки
  for(const k of KN){c.fillStyle=rgba(tk(S,.4),.45);c.beginPath();c.ellipse(k[0]-1,k[1],4.5,3,0,0,TAU);c.fill();}
  // 4) пальцы: тень и блик, щели, ногти, складки
  for(const f of order){stroke(f.pts.slice(1),f.w,rgba(tk(S,-.45),.5),f.w*.45);c.save();c.translate(0,-f.w*.2);stroke(f.pts.slice(1),f.w,rgba(tk(S,.3),.28),f.w*.3);c.restore();
    const n=f.pts.length,A=f.pts[n-2],B=f.pts[n-1],dx=B[0]-A[0],dy=B[1]-A[1],l=Math.hypot(dx,dy)||1;
    if(!o.palmView&&f.nail){c.save();c.translate(B[0]-dx/l*f.w*.32,B[1]-dy/l*f.w*.32);c.rotate(Math.atan2(dy,dx));c.fillStyle=rgba(tk(S,.35),.55);RR(c,-f.w*.34,-f.w*.32,f.w*.6,f.w*.64,f.w*.28);c.fill();c.strokeStyle=rgba(tk(S,-.35),.35);c.lineWidth=1.1;c.stroke();c.restore();}
    c.strokeStyle=rgba(tk(S,-.5),.3);c.lineWidth=1.2;for(let j=2;j<n-1;j++){const p=f.pts[j],q=f.pts[j+1],ax=q[0]-p[0],ay=q[1]-p[1],al=Math.hypot(ax,ay)||1;c.beginPath();c.moveTo(p[0]-ay/al*f.w*.3,p[1]+ax/al*f.w*.3);c.lineTo(p[0]+ay/al*f.w*.15,p[1]-ax/al*f.w*.15);c.stroke();}}
  c.restore();}

/* предметы в руке */
function pen9(c,x,y,a,len,o={}){c.save();c.translate(x,y);c.rotate(a);const w=o.w||7;
  c.fillStyle='#111317';RR(c,-len*.15,-w/2,len*.85,w,w/2);c.fill();c.fillStyle='#c9a24a';c.fillRect(len*.55,-w/2,len*.06,w);c.fillRect(-len*.05,-w/2-1,len*.35,2);
  c.fillStyle='#d8dde2';c.beginPath();c.moveTo(len*.7,-w/2);c.lineTo(len*.86,0);c.lineTo(len*.7,w/2);c.closePath();c.fill();c.fillStyle='rgba(255,255,255,.35)';c.fillRect(-len*.1,-w/2+1,len*.6,1.5);c.restore();}
function cig9(c,x,y,a,len,t,o={}){c.save();c.translate(x,y);c.rotate(a);const w=o.w||6;
  c.fillStyle='#d9a96a';c.fillRect(-len*.3,-w/2,len*.3,w);c.fillStyle='#f3f1ec';c.fillRect(0,-w/2,len*.7,w);c.fillStyle='#8d8780';c.fillRect(len*.7,-w/2,len*.04,w);
  c.restore();const ex=x+Math.cos(a)*len*.74,ey=y+Math.sin(a)*len*.74;glowDot(c,ex,ey,9,'#ff7a2a',.9);
  // дым — мягкая лента
  c.save();c.globalCompositeOperation='screen';for(let k=0;k<26;k++){const u=k/26,px=ex+Math.sin(u*9+t*1.3)*14*u+u*8,py=ey-u*(o.h||260);c.fillStyle=RG(c,px,py,0,8+u*26,[[0,`rgba(220,225,232,${.16*(1-u)})`],[1,'rgba(220,225,232,0)']]);c.fillRect(px-40,py-40,80,80);}c.restore();}
