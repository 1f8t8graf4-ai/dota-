"use strict";
/* Набор для стоп-кадров (26.11): люди с лицами в плоском векторе «как у Дины», свет, дымка, HUD, субтитры.
   Подключается перед клипом stl.js (stage.html → PRE). Всё в координатах кадра 1080×1920. */

/* ---------- цвет ---------- */
function hx(h){const n=parseInt(h.slice(1),16);return [n>>16,n>>8&255,n&255];}
function sh(h,k){const [r,g,b]=hx(h),f=v=>Math.round(k>0?v+(255-v)*k:v*(1+k));return `rgb(${f(r)},${f(g)},${f(b)})`;}  // k>0 светлее, k<0 темнее
const SKINS={
  a:{b:'#e2b096',d:'#b07a62',l:'#f6d2bd',lip:'#b9705f'},
  b:{b:'#d8a17f',d:'#a26a50',l:'#f0c4a6',lip:'#a9604e'},
  c:{b:'#c98d6a',d:'#8f5b42',l:'#e4b08f',lip:'#9c5644'},
  o:{b:'#dcae98',d:'#a87a66',l:'#f1cfbf',lip:'#a8705f'},
};

/* контурный свет: только с одной стороны (R -1 слева / 1 справа), без filter (он ломается в клипе) */
function rimStroke(c,paths,col,a,w,R,box){const b=box||300;
  for(let k=0;k<4;k++){c.save();const x0=R*b*(.05+k*.16);c.beginPath();c.rect(R>0?x0:-b*1.4,-b*1.4,b*1.4-Math.abs(x0)*0+ (R>0?b*1.4-x0:x0+b*1.4)-b*1.4,b*2.8);c.clip();
    c.strokeStyle=rgba(col,a*.3);c.shadowColor=rgba(col,a*.35);c.shadowBlur=w*1.6;c.lineWidth=w*.55;c.lineJoin='round';for(const p of paths)c.stroke(p);c.restore();}}

/* ---------- путь головы (центр головы — 0,0; ширина ~124) ---------- */
function headPath(o){const w=o.hw||62,j=o.jaw||1,p=new Path2D();
  p.moveTo(0,-90);p.bezierCurveTo(w*.66,-90,w,-64,w,-22);p.bezierCurveTo(w,10,w*.96*j,36,w*.74*j,56);
  p.bezierCurveTo(w*.54*j,74,w*.26,84,0,84);p.bezierCurveTo(-w*.26,84,-w*.54*j,74,-w*.74*j,56);
  p.bezierCurveTo(-w*.96*j,36,-w,10,-w,-22);p.bezierCurveTo(-w,-64,-w*.66,-90,0,-90);p.closePath();return p;}
function hairPath(o){const w=(o.hw||62)+4,st=o.hair||'short',p=new Path2D();
  if(st==='bald'){p.moveTo(-w,-6);p.bezierCurveTo(-w-2,-30,-w+6,-44,-w+12,-50);p.lineTo(-w+18,-24);p.lineTo(-w+12,-2);p.closePath();
    p.moveTo(w,-6);p.bezierCurveTo(w+2,-30,w-6,-44,w-12,-50);p.lineTo(w-18,-24);p.lineTo(w-12,-2);p.closePath();return p;}
  if(st==='grey'){p.moveTo(-w,-4);p.bezierCurveTo(-w-4,-62,-w*.6,-100,0,-100);p.bezierCurveTo(w*.6,-100,w+4,-62,w,-4);p.lineTo(w-8,-8);
    p.bezierCurveTo(w-8,-40,w-20,-62,w-34,-66);p.bezierCurveTo(10,-74,-26,-70,-w+30,-60);p.bezierCurveTo(-w+12,-50,-w+8,-34,-w+8,-8);p.closePath();return p;}
  if(st==='curly'){p.moveTo(-w-2,-2);for(let i=0;i<=12;i++){const a=Math.PI+i/12*Math.PI,r=w+10+(i%2?8:0);p.lineTo(Math.cos(a)*r,-30+Math.sin(a)*(r+16));}
    p.lineTo(w+2,-2);p.lineTo(w-8,-6);p.bezierCurveTo(w-10,-40,w-22,-56,w-36,-58);p.bezierCurveTo(10,-66,-24,-64,-w+34,-58);p.bezierCurveTo(-w+14,-48,-w+8,-34,-w+8,-6);p.closePath();return p;}
  if(st==='long'){p.moveTo(-w-6,70);p.bezierCurveTo(-w-14,-40,-w*.7,-104,0,-104);p.bezierCurveTo(w*.7,-104,w+14,-40,w+6,70);p.lineTo(w-10,60);
    p.bezierCurveTo(w-6,0,w-14,-50,w-30,-60);p.bezierCurveTo(14,-66,-20,-74,-w+26,-58);p.bezierCurveTo(-w+10,-40,-w+6,0,-w+10,60);p.closePath();return p;}
  // short: короткая стрижка с пробором и чёлкой назад
  p.moveTo(-w,-6);p.bezierCurveTo(-w-4,-64,-w*.62,-104,0,-104);p.bezierCurveTo(w*.66,-104,w+4,-66,w,-6);p.lineTo(w-7,-12);
  p.bezierCurveTo(w-8,-42,w-16,-58,w-30,-64);p.bezierCurveTo(w-52,-70,-6,-80,-22,-70);p.bezierCurveTo(-36,-64,-w+16,-60,-w+10,-44);
  p.bezierCurveTo(-w+7,-34,-w+7,-22,-w+7,-12);p.closePath();return p;}

/* лицо + голова. o: {x,y,s, skin, hairC, hair, turn(-1..1), look:[dx,dy], L (сторона света -1 слева/1 справа), rim, beard, glasses, mouth, brow, eyesC, hw, jaw, lite(0..1 освещённость)} */
function head(c,o){const S=o.skin||SKINS.a,L=o.L??-1,t=o.turn||0,rim=o.rim||'#ffd9a0',lite=o.lite??1;
  c.save();c.translate(o.x,o.y);c.scale(o.s,o.s);
  const hp=headPath(o),hw=o.hw||62;
  // шея
  c.fillStyle=sh(S.d,-.12*(1-lite));c.beginPath();c.moveTo(-28+t*6,50);c.lineTo(28+t*6,50);c.lineTo(32+t*4,118);c.lineTo(-32+t*4,118);c.closePath();c.fill();
  c.fillStyle='rgba(0,0,0,.28)';c.beginPath();c.moveTo(-30,60);c.quadraticCurveTo(t*8,96,30,60);c.lineTo(30,74);c.quadraticCurveTo(t*8,104,-30,74);c.closePath();c.fill();
  // уши
  for(const sd of [-1,1]){const far=Math.sign(t)===-sd&&t!==0;c.fillStyle=sh(S.b,sd===L?.05:-.1);c.beginPath();c.ellipse(sd*(hw-2)+t*(far?10:4),0,far?6:9,17,0,0,TAU);c.fill();
    c.fillStyle='rgba(90,40,30,.25)';c.beginPath();c.ellipse(sd*(hw-1)+t*4,1,4,9,0,0,TAU);c.fill();}
  // кожа
  c.fillStyle=S.b;c.fill(hp);
  c.save();c.clip(hp);
  // свет/тень по стороне
  c.fillStyle=LG(c,hw*L,0,-hw*L,0,[[0,'rgba(255,240,225,.38)'],[.45,'rgba(255,240,225,0)'],[.6,'rgba(60,20,10,0)'],[1,'rgba(60,20,10,.42)']]);c.fillRect(-90,-110,180,200);
  // тень от волос на лбу и под челюстью (сверху)
  c.fillStyle=LG(c,0,-80,0,-40,[[0,'rgba(40,15,8,.35)'],[1,'rgba(40,15,8,0)']]);c.fillRect(-90,-110,180,80);
  // скулы / румянец
  for(const sd of [-1,1]){c.fillStyle=RG(c,sd*30+t*10,22,0,24,[[0,'rgba(200,90,80,.16)'],[1,'rgba(200,90,80,0)']]);c.fillRect(sd*30+t*10-26,-4,52,52);}
  // щетина / борода
  if(o.beard){c.fillStyle=`rgba(50,30,24,${.13*Math.min(1,o.beard)})`;c.beginPath();c.moveTo(-hw+6,20);c.bezierCurveTo(-hw+10,60,-26,86,0,86);c.bezierCurveTo(26,86,hw-10,60,hw-6,20);
    c.bezierCurveTo(hw-14,46,30,40,18+t*8,36);c.bezierCurveTo(8,30,-8,30,-18+t*8,36);c.bezierCurveTo(-30,40,-hw+14,46,-hw+6,20);c.closePath();c.fill();
    if(o.beard>1){c.fillStyle=o.hairC||'#2a1c15';c.globalAlpha=.85;c.fill();c.globalAlpha=1;}}
  // нос: тень с тёмной стороны
  const nx=t*16;c.fillStyle='rgba(110,50,35,.30)';c.beginPath();c.moveTo(nx-L*2,-6);c.bezierCurveTo(nx-L*10,6,nx-L*12,18,nx-L*14,26);c.bezierCurveTo(nx-L*6,32,nx+L*6,32,nx+L*10,28);
  c.bezierCurveTo(nx+L*2,22,nx-L*1,10,nx-L*2,-6);c.closePath();c.fill();
  c.fillStyle='rgba(255,240,225,.22)';c.beginPath();c.ellipse(nx+L*2.5,12,2.2,8,0,0,TAU);c.fill();
  c.fillStyle='rgba(80,30,20,.45)';for(const sd of [-1,1]){c.beginPath();c.ellipse(nx+sd*7,30,3.6,2.2,sd*.4,0,TAU);c.fill();}
  // подбородок, носогубка
  c.strokeStyle='rgba(110,50,35,.22)';c.lineWidth=2.2;c.lineCap='round';
  for(const sd of [-1,1]){c.beginPath();c.moveTo(nx+sd*15,30);c.quadraticCurveTo(nx+sd*22,42,nx+sd*20,52);c.stroke();}
  c.restore();
  // контур челюсти (тень снизу)
  c.save();c.clip(hp);c.strokeStyle='rgba(60,25,15,.22)';c.lineWidth=10;c.stroke(hp);c.lineWidth=4;c.stroke(hp);c.restore();
  // рот
  const mx=t*14,my=48;c.strokeStyle='#6d332a';c.lineWidth=3.2;c.lineCap='round';c.beginPath();
  if(o.mouth==='smile'){c.moveTo(mx-15,my-2);c.quadraticCurveTo(mx,my+9,mx+15,my-2);}
  else if(o.mouth==='open'){c.fillStyle='#4a1d18';c.beginPath();c.ellipse(mx,my+2,10,7,0,0,TAU);c.fill();c.fillStyle='#f3ece6';c.fillRect(mx-8,my-4,16,3);}
  else if(o.mouth==='flat'){c.moveTo(mx-14,my+1);c.lineTo(mx+14,my+1);}
  else{c.moveTo(mx-14,my);c.quadraticCurveTo(mx,my+3,mx+14,my);}
  c.stroke();c.fillStyle=rgba(S.lip,.35);c.beginPath();c.ellipse(mx,my+7,9,3.4,0,0,TAU);c.fill();
  // глаза
  const lk=o.look||[0,0],eyesC=o.eyesC||'#3a2618',ey=-8;
  for(const sd of [-1,1]){const far=t!==0&&Math.sign(t)===-sd,ex=sd*25+t*14,esc=far?1-Math.abs(t)*.25:1;
    c.save();c.translate(ex,ey);c.scale(esc,1);
    const eye=new Path2D();eye.moveTo(-14,0);eye.bezierCurveTo(-8,-9,8,-9,14,-1);eye.bezierCurveTo(8,6,-8,6,-14,0);eye.closePath();
    c.fillStyle='#f4efe9';c.fill(eye);c.save();c.clip(eye);c.fillStyle=eyesC;c.beginPath();c.arc(lk[0]*5,lk[1]*3-0.5,6.8,0,TAU);c.fill();
    c.fillStyle='#120b08';c.beginPath();c.arc(lk[0]*5,lk[1]*3-0.5,3.2,0,TAU);c.fill();
    c.fillStyle='rgba(0,0,0,.25)';c.fillRect(-16,-10,32,5);c.restore();
    c.fillStyle='#fff';c.beginPath();c.arc(lk[0]*5+2.2,lk[1]*3-3,1.8,0,TAU);c.fill();
    if(o.tired){c.save();c.clip(eye);c.fillStyle=S.d;c.fillRect(-16,-12,32,9*o.tired);c.restore();c.fillStyle=`rgba(80,40,50,${.25*o.tired})`;c.beginPath();c.ellipse(0,9,13,4.5,0,0,TAU);c.fill();}
    c.strokeStyle='#2a1610';c.lineWidth=3;c.lineCap='round';c.beginPath();c.moveTo(-15,1);c.bezierCurveTo(-9,-10,8,-10,15,-2);c.stroke();
    c.strokeStyle='rgba(110,50,35,.3)';c.lineWidth=1.6;c.beginPath();c.moveTo(-11,-12);c.quadraticCurveTo(0,-16,12,-11);c.stroke();
    c.restore();
    // бровь
    const by=-30,yi=by+(o.brow==='frown'?6:o.brow==='up'?-6:0);c.strokeStyle=o.browC||o.hairC||'#2a1c15';c.lineWidth=5.5;c.lineCap='round';
    c.beginPath();c.moveTo(ex-sd*15*esc,yi);c.quadraticCurveTo(ex,by-6,ex+sd*16*esc,by+3);c.stroke();}
  if(o.glasses){c.strokeStyle='#1a1410';c.lineWidth=3.4;for(const sd of [-1,1]){rr(c,sd*25+t*14-17,-20,34,24,7);c.stroke();}
    c.beginPath();c.moveTo(-8+t*14,-10);c.lineTo(8+t*14,-10);c.stroke();c.fillStyle='rgba(255,255,255,.14)';for(const sd of [-1,1]){c.fillRect(sd*25+t*14-12,-17,10,4);}}
  // волосы
  const hP=hairPath(o),hc=o.hairC||'#2a1c15';c.fillStyle=hc;c.fill(hP);
  c.save();c.clip(hP);c.fillStyle=LG(c,-80*L,0,80*L,0,[[0,'rgba(0,0,0,.35)'],[1,'rgba(255,255,255,.12)']]);c.fillRect(-120,-130,240,240);
  c.strokeStyle='rgba(255,255,255,.12)';c.lineWidth=3;for(let i=0;i<6;i++){c.beginPath();c.moveTo(-40+i*14,-90);c.quadraticCurveTo(-20+i*16,-80,10+i*10,-64);c.stroke();}c.restore();
  // контровой свет по краю головы со стороны rim (o.R: -1/1)
  const R=o.R??-L;if(o.rimA!==0){const HO=new Path2D();HO.addPath(hp,new DOMMatrix().translate(0,-12).scale(1.07,1.1));rimStroke(c,[hp,HO],rim,o.rimA??.75,7,R,90);}
  c.restore();}

/* тело в пиджаке (до пояса) — центр головы (x,y), s — масштаб. o: {suit, shirt, tie, L, rim, open, arms} */
function bust(c,o){const L=o.L??-1,rim=o.rim||'#ffd9a0',su=o.suit||'#1a1d26';c.save();c.translate(o.x,o.y);c.scale(o.s,o.s);
  const T=new Path2D();T.moveTo(-34,96);T.bezierCurveTo(-64,108,-122,112,-152,128);T.bezierCurveTo(-182,144,-194,186,-196,236);T.lineTo(-206,520);T.lineTo(206,520);T.lineTo(196,236);
  T.bezierCurveTo(194,186,182,144,152,128);T.bezierCurveTo(122,112,64,108,34,96);T.closePath();
  c.fillStyle=su;c.fill(T);c.save();c.clip(T);
  c.fillStyle=LG(c,200*L,0,-200*L,0,[[0,'rgba(255,240,220,.16)'],[.5,'rgba(0,0,0,0)'],[1,'rgba(0,0,0,.35)']]);c.fillRect(-220,80,440,460);
  // рубашка
  const sC=o.shirt||'#e8e6e1';c.fillStyle=sC;c.beginPath();c.moveTo(-34,94);c.lineTo(0,o.open?200:160);c.lineTo(34,94);c.closePath();c.fill();
  c.fillStyle='rgba(0,0,0,.18)';c.beginPath();c.moveTo(-34,94);c.lineTo(0,120);c.lineTo(34,94);c.closePath();c.fill();
  if(o.tie){c.fillStyle=o.tie;c.beginPath();c.moveTo(-8,112);c.lineTo(8,112);c.lineTo(14,230);c.lineTo(0,250);c.lineTo(-14,230);c.closePath();c.fill();}
  if(o.open){c.fillStyle=o.skinC||'#c98d6a';c.beginPath();c.moveTo(-14,100);c.lineTo(0,150);c.lineTo(14,100);c.closePath();c.fill();}
  // воротник рубашки
  c.fillStyle=sh(sC,.1);for(const sd of [-1,1]){c.beginPath();c.moveTo(sd*36,90);c.lineTo(sd*6,128);c.lineTo(sd*18,98);c.closePath();c.fill();}
  // лацканы
  for(const sd of [-1,1]){c.fillStyle=sh(su,sd===L?.1:-.25);c.beginPath();c.moveTo(sd*36,96);c.lineTo(sd*70,140);c.lineTo(sd*52,150);c.lineTo(sd*(o.open?6:4),o.open?250:220);c.lineTo(sd*30,100);c.closePath();c.fill();
    c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=2;c.stroke();}
  // складки
  c.strokeStyle='rgba(0,0,0,.25)';c.lineWidth=3;c.beginPath();c.moveTo(-120,200);c.quadraticCurveTo(-100,300,-120,420);c.moveTo(120,200);c.quadraticCurveTo(100,300,120,420);c.stroke();
  c.restore();
  // контур света
  rimStroke(c,[T],rim,o.rimA??.7,8,o.R??-L,280);
  c.restore();}

/* человек целиком (бюст+голова): обёртка */
function person(c,o){bust(c,{...o});head(c,{...o});}

/* фигура со спины (волосы, плечи), центр головы (x,y) */
function backMan(c,o){const L=o.L??-1,rim=o.rim||'#ffd9a0';c.save();c.translate(o.x,o.y);c.scale(o.s,o.s);
  const T=new Path2D();T.moveTo(-36,70);T.bezierCurveTo(-70,96,-124,104,-154,122);T.bezierCurveTo(-186,140,-196,186,-198,236);T.lineTo(-208,560);T.lineTo(208,560);T.lineTo(198,236);
  T.bezierCurveTo(196,186,186,140,154,122);T.bezierCurveTo(124,104,70,96,36,70);T.closePath();
  c.fillStyle=o.suit||'#12141b';c.fill(T);
  c.save();c.clip(T);c.fillStyle=LG(c,0,80,0,560,[[0,'rgba(255,255,255,.06)'],[1,'rgba(0,0,0,.25)']]);c.fillRect(-220,60,440,520);
  c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=3;c.beginPath();c.moveTo(0,130);c.lineTo(0,560);c.stroke();c.restore();
  // воротник
  c.fillStyle=o.shirt||'#dfe1e6';c.beginPath();c.moveTo(-34,62);c.lineTo(34,62);c.lineTo(30,84);c.lineTo(-30,84);c.closePath();c.fill();
  // шея
  c.fillStyle=o.neck||'#8f5b42';c.beginPath();c.moveTo(-28,30);c.lineTo(28,30);c.lineTo(32,66);c.lineTo(-32,66);c.closePath();c.fill();
  // голова (затылок) + уши
  const hp=headPath({hw:60});c.fillStyle=o.neck||'#8f5b42';for(const sd of [-1,1]){c.beginPath();c.ellipse(sd*59,0,9,16,0,0,TAU);c.fill();}
  const hc=o.hairC||'#1f1611';c.fillStyle=hc;c.fill(hp);
  c.save();c.clip(hp);c.fillStyle=LG(c,0,-90,0,84,[[0,'rgba(255,255,255,.1)'],[1,'rgba(0,0,0,.3)']]);c.fillRect(-80,-100,160,200);
  c.fillStyle=o.neck||'#8f5b42';c.globalAlpha=.55;c.beginPath();c.ellipse(0,92,40,26,0,0,TAU);c.fill();c.restore();
  // контур
  rimStroke(c,[T,hp],rim,o.rimA??.8,8,o.R??-L,280);
  c.restore();}

/* силуэт в толпе: x,y — голова; s; руки вверх (up 0..1) */
function sil(c,x,y,s,o={}){c.save();c.translate(x,y);c.scale(s,s);c.fillStyle=o.col||'#07070a';
  c.beginPath();c.ellipse(0,0,34,42,o.tilt||0,0,TAU);c.fill();
  c.beginPath();c.moveTo(-26,40);c.bezierCurveTo(-60,52,-96,60,-108,90);c.lineTo(-124,420);c.lineTo(124,420);c.lineTo(108,90);c.bezierCurveTo(96,60,60,52,26,40);c.closePath();c.fill();
  if(o.up){c.lineWidth=34;c.lineCap='round';c.strokeStyle=o.col||'#07070a';const sd=o.side||1;c.beginPath();c.moveTo(sd*80,90);c.quadraticCurveTo(sd*(110+30*o.up),-40,sd*(70+40*o.up),-150*o.up);c.stroke();
    if(o.both){c.beginPath();c.moveTo(-sd*80,90);c.quadraticCurveTo(-sd*(110+30*o.up),-40,-sd*(60+40*o.up),-140*o.up);c.stroke();}}
  if(o.rim){c.globalCompositeOperation='screen';c.strokeStyle=rgba(o.rim,o.ra??.6);c.lineWidth=5;c.filter='blur(2px)';c.beginPath();c.arc(0,0,38,Math.PI*1.1,Math.PI*1.95);c.stroke();
    c.beginPath();c.moveTo(-108,92);c.bezierCurveTo(-96,60,-60,52,-26,42);c.moveTo(108,92);c.bezierCurveTo(96,60,60,52,26,42);c.stroke();}
  c.restore();}

/* ---------- HUD «как у Дины» ---------- */
function hudTop(c,left,right,o={}){c.save();const y=o.y||112;c.shadowColor='rgba(0,0,0,.8)';c.shadowBlur=10;
  c.fillStyle=o.dot||'#ff5a36';c.beginPath();c.arc(70,y-8,6,0,TAU);c.fill();
  tx(c,left,88,y,{f:'J',w:500,s:22,ls:3,al:'left',c:o.lc||'rgba(255,255,255,.9)'});
  tx(c,right,WW-66,y+2,{f:'J',w:500,s:o.rs||40,ls:2,al:'right',c:o.rc||'rgba(255,255,255,.96)'});c.restore();}
function hudBot(c,ch,k,clock,o={}){c.save();const y=o.y||1792;c.globalAlpha=o.a??.85;c.shadowColor='rgba(0,0,0,.8)';c.shadowBlur=8;
  tx(c,ch,70,y,{f:'J',w:500,s:18,ls:3,al:'left',c:'rgba(255,255,255,.75)'});tx(c,clock,WW-70,y,{f:'J',w:400,s:18,ls:2,al:'right',c:'rgba(255,255,255,.6)'});
  c.fillStyle='rgba(255,255,255,.22)';c.fillRect(70,y+22,WW-140,3);c.fillStyle=o.col||'#ffb13b';c.fillRect(70,y+22,(WW-140)*k,3);
  c.beginPath();c.moveTo(70+(WW-140)*k,y+16);c.lineTo(70+(WW-140)*k+7,y+23);c.lineTo(70+(WW-140)*k,y+30);c.lineTo(70+(WW-140)*k-7,y+23);c.closePath();c.fill();
  for(let i=1;i<(o.n||7);i++){c.fillStyle='rgba(255,255,255,.45)';c.fillRect(70+(WW-140)*i/(o.n||7)-1,y+18,2,11);}
  c.restore();}
// уголки рамки (как у Дины — тонкие скобки по углам)
function corners(c,a=.35){c.save();c.strokeStyle=`rgba(255,255,255,${a})`;c.lineWidth=2;const m=40,l=34;
  for(const [x,y,dx,dy] of [[m,m,1,1],[WW-m,m,-1,1],[m,HH-m,1,-1],[WW-m,HH-m,-1,-1]]){c.beginPath();c.moveTo(x,y+dy*l);c.lineTo(x,y);c.lineTo(x+dx*l,y);c.stroke();}c.restore();}
/* субтитр: строка слов, акцентные — цветом. ws: [['слово',acc]] */
function subLine(c,ws,o={}){c.save();font(c,{f:o.f||'O',w:o.w||700,s:o.s||96,ls:o.ls??1});const sp=c.measureText(' ').width;
  const m=ws.map(w=>c.measureText(w[0]).width),tot=m.reduce((a,b)=>a+b,0)+sp*(ws.length-1),sc=Math.min(1,(o.max||940)/tot);
  c.translate(o.x||540,o.y||1250);c.scale(sc,sc);let x=-tot/2;c.textAlign='left';c.textBaseline='middle';
  for(let i=0;i<ws.length;i++){c.shadowColor='rgba(0,0,0,.9)';c.shadowBlur=26;c.shadowOffsetY=5;c.fillStyle=ws[i][1]?(o.acc||'#FFB13B'):(o.col||'#fff');c.fillText(ws[i][0],x,0);x+=m[i]+sp;}
  c.restore();}
/* мелкий текст-«подпись» как у Дины под цифрой */
function tag(c,s,x,y,o={}){c.save();font(c,{f:'J',w:500,s:o.s||20,ls:3});const w=c.measureText(s).width+28;c.fillStyle=o.bg||'rgba(10,14,22,.72)';rr(c,x-w/2,y-17,w,34,4);c.fill();
  c.strokeStyle=o.bc||'rgba(255,177,59,.6)';c.lineWidth=1.5;c.stroke();tx(c,s,x,y+7,{f:'J',w:500,s:o.s||20,ls:3,c:o.c||'#ffd9a0'});c.restore();}
/* огромная золотая цифра с объёмом */
function bigNum(c,key,s,x,y,o={}){const spr=ext3(key,s,{f:o.f||'O',w:700,s:o.s||230,depth:o.d||16,dir:[0,1],face:o.face||['#fff4c8','#ffd055','#ff9d1c'],side:o.side||['#5a2b05','#2a1302'],stroke:'rgba(80,40,0,.5)',sw:3});
  c.save();c.shadowColor='rgba(0,0,0,.75)';c.shadowBlur=40;c.shadowOffsetY=14;c.drawImage(spr,x-spr.width/2,y-spr.height/2);c.restore();
  c.save();c.globalCompositeOperation='screen';c.globalAlpha=.35;c.filter='blur(22px)';c.drawImage(spr,x-spr.width/2,y-spr.height/2);c.restore();}

/* ---------- Москва: силуэт Сити и высотки (вид спереди). o: {by — низ, sc — масштаб, x0 — сдвиг, a — дымка 0..1, lite — сколько окон горит} ---------- */
function tower(c,T,by,sc,o){const x=T.x,w=T.w*sc,h=T.h*sc,top=by-h,p=new Path2D();
  if(T.top==='spire'){p.moveTo(x-w/2,by);p.lineTo(x-w/2,top+w*.5);p.lineTo(x-w*.12,top);p.lineTo(x+w*.12,top);p.lineTo(x+w/2,top+w*.5);p.lineTo(x+w/2,by);}
  else if(T.top==='slant'){p.moveTo(x-w/2,by);p.lineTo(x-w/2,top+w*.9);p.lineTo(x+w/2,top);p.lineTo(x+w/2,by);}
  else if(T.top==='step'){p.moveTo(x-w/2,by);p.lineTo(x-w/2,top+w*1.2);p.lineTo(x-w*.32,top+w*1.2);p.lineTo(x-w*.32,top+w*.55);p.lineTo(x-w*.12,top+w*.55);p.lineTo(x,top);p.lineTo(x+w*.12,top+w*.55);p.lineTo(x+w*.32,top+w*.55);p.lineTo(x+w*.32,top+w*1.2);p.lineTo(x+w/2,top+w*1.2);p.lineTo(x+w/2,by);}
  else if(T.top==='round'){p.moveTo(x-w/2,by);p.lineTo(x-w/2,top+w*.4);p.quadraticCurveTo(x,top-w*.25,x+w/2,top+w*.4);p.lineTo(x+w/2,by);}
  else{p.moveTo(x-w/2,by);p.lineTo(x-w/2,top);p.lineTo(x+w/2,top);p.lineTo(x+w/2,by);}
  p.closePath();
  c.fillStyle=LG(c,x-w/2,0,x+w/2,0,[[0,sh(T.col,-.35)],[.55,T.col],[1,sh(T.col,-.55)]]);c.fill(p);
  c.save();c.clip(p);
  // окна
  c.fillStyle=LG(c,0,top,0,by,[[0,'rgba(150,180,255,.18)'],[.5,'rgba(0,0,0,0)'],[1,'rgba(0,0,0,.35)']]);c.fillRect(x-w/2,top-60,w,h+60);
  c.strokeStyle='rgba(0,0,0,.25)';c.lineWidth=1;for(let k=1;k<6;k++){c.beginPath();c.moveTo(x-w/2+w*k/6,top);c.lineTo(x-w/2+w*k/6,by);c.stroke();}
  const cw=Math.max(3,4.2*sc),chh=Math.max(2.5,5.5*sc),lit=(o.lite??.45)*.8;
  for(let j=0;top+j*chh*1.6<by;j++)for(let i=0;x-w/2+i*cw*1.5<x+w/2;i++){const r=H2(i+T.x*.13,j+T.h*.07);if(r>lit)continue;
    const warm=H2(i*3.1+T.x,j*1.7)>.35;c.fillStyle=warm?`rgba(255,${190+(r*60|0)},${110+(r*80|0)},${.45+r*.5})`:`rgba(170,210,255,${.35+r*.4})`;
    c.fillRect(x-w/2+i*cw*1.5+cw*.25,top+j*chh*1.6+chh*.3,cw,chh);}
  if(T.twist){c.strokeStyle='rgba(180,220,255,.25)';c.lineWidth=2*sc;for(let k=-8;k<14;k++){c.beginPath();c.moveTo(x-w/2,top+k*40*sc);c.lineTo(x+w/2,top+k*40*sc+60*sc);c.stroke();}}
  // блик стекла
  c.fillStyle=LG(c,x-w/2,0,x+w/2,0,[[0,'rgba(255,255,255,0)'],[.7,'rgba(255,255,255,0)'],[.78,'rgba(200,230,255,.16)'],[.86,'rgba(255,255,255,0)']]);c.fillRect(x-w/2,top-40,w,h+40);
  c.restore();
  if(T.top==='spire'){c.strokeStyle=sh(T.col,-.4);c.lineWidth=3*sc;c.beginPath();c.moveTo(x,top);c.lineTo(x,top-70*sc);c.stroke();glowDot(c,x,top-70*sc,16*sc,'#ff3b30',.9);}
  if(T.crown){glowDot(c,x,top+6*sc,40*sc,T.crown,.5);}}
function stalinka(c,x,by,sc,col){c.save();c.translate(x,by);c.scale(sc,sc);const p=new Path2D();
  const L=[[-170,0],[-170,-140],[-120,-140],[-120,-230],[-80,-230],[-80,-330],[-52,-330],[-52,-410],[-30,-410],[-30,-470],[-12,-500],[0,-600],[12,-500],[30,-470],[30,-410],[52,-410],[52,-330],[80,-330],[80,-230],[120,-230],[120,-140],[170,-140],[170,0]];
  p.moveTo(L[0][0],L[0][1]);for(const q of L)p.lineTo(q[0],q[1]);p.closePath();
  c.fillStyle=LG(c,0,-600,0,0,[[0,sh(col,.25)],[.5,col],[1,sh(col,-.5)]]);c.fill(p);
  c.save();c.clip(p);c.fillStyle=RG(c,0,-80,10,420,[[0,'rgba(255,214,150,.45)'],[1,'rgba(255,214,150,0)']]);c.fillRect(-200,-620,400,620);
  for(let j=0;j<40;j++)for(let i=-24;i<24;i++){if(H2(i+50,j+9)>.38)continue;c.fillStyle=`rgba(255,220,150,${.35+.5*H2(i,j)})`;c.fillRect(i*7+1,-j*12-14,3.4,5);}c.restore();
  glowDot(c,0,-606,22,'#ff4030',1);glowDot(c,0,-606,60,'#ff6040',.45);c.restore();}
const CITY=[{x:0,w:70,h:560,top:'flat',col:'#1d3150'},{x:70,w:62,h:700,top:'slant',col:'#24456e'},{x:150,w:84,h:880,top:'spire',col:'#2b5585'},{x:236,w:72,h:760,top:'step',col:'#6b5a32',crown:'#ffc35a'},
  {x:314,w:74,h:720,top:'flat',col:'#2a4363',twist:1},{x:390,w:66,h:640,top:'round',col:'#20385a'},{x:452,w:58,h:600,top:'flat',col:'#26405e'},{x:508,w:52,h:520,top:'slant',col:'#1c3048'}];
function moscowCity(c,cx,by,sc,o={}){for(const T of CITY)tower(c,{...T,x:cx+(T.x-250)*sc},by,sc,o);}
// линия города вдали (крыши, огни)
function cityFar(c,by,o={}){const r=rng(o.seed||7);c.fillStyle=o.col||'#141a2b';c.beginPath();c.moveTo(0,by);let x=0;
  while(x<WW){const w=20+r()*60,h=(o.h||40)*(.3+r());c.lineTo(x,by-h);c.lineTo(x+w,by-h);x+=w;}c.lineTo(WW,by+400);c.lineTo(0,by+400);c.closePath();c.fill();
  for(let i=0;i<(o.n||260);i++){const px=r()*WW,py=by-(o.h||40)*r()*1.1+r()*120;c.fillStyle=r()>.3?`rgba(255,200,120,${.3+r()*.6})`:`rgba(170,210,255,${.3+r()*.5})`;c.fillRect(px,py,2+r()*2,2+r()*2);}}
// река с отражениями и набережная с фарами
function river(c,y0,y1,o={}){c.fillStyle=LG(c,0,y0,0,y1,[[0,o.top||'#0d1a30'],[1,o.bot||'#050a14']]);c.fillRect(0,y0,WW,y1-y0);
  c.save();c.globalCompositeOperation='screen';const r=rng(o.seed||3);
  for(let i=0;i<70;i++){const x=r()*WW,w=2+r()*8,col=r()>.4?'255,190,110':'160,200,255';c.fillStyle=`rgba(${col},${.12+r()*.25})`;for(let k=0;k<8;k++){c.fillRect(x+Math.sin(k*1.7+i)*6,y0+k*(y1-y0)/8+r()*6,w*(1-k/10),3);}}
  c.restore();}
function cars(c,y,o={}){c.save();c.globalCompositeOperation='screen';const r=rng(o.seed||5);
  for(let i=0;i<(o.n||40);i++){const x=r()*WW,l=40+r()*160,red=r()>.5;c.fillStyle=LG(c,x,0,x+l,0,[[0,'rgba(0,0,0,0)'],[1,red?'rgba(255,60,50,.8)':'rgba(255,240,210,.9)']]);c.fillRect(x,y+(red?6:0)+r()*4,l,red?2.5:3);}
  c.restore();}
