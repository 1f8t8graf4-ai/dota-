/* «Духless» EN · тест 15 с (25.11): карусель (0–5,0) → обрыв (5,0–5,25) → удар → 6 кадров под голос Brock (ускоренный, vo25).
   Кадры: город и «29» · силуэт у окна · контракт и $1 000 000 · вход в клуб · шампанское · дорожка на стекле.
   Сверху: мелкий HUD у верхнего края, субтитры по 1–3 слова (акцентные — оранжевым), зерно, виньетка, свечение, хлыст-переходы. */
(function(){
CLIP.fonts=['600 82px Man','800 96px Mont','600 26px JBM','800 300px Mont','700 40px JBM'];
const V0=5.25,TEND=V0+10.06+0.3;
/* слова голоса: [от, до, слово] — время от V0 (Whisper по brock1_fast.wav) */
const WD=[[0.0,0.24,'Imagine'],[0.24,0.54,'this.'],[0.76,0.84,"You're"],[0.84,1.24,'29.'],[1.56,1.92,'Moscow.'],[2.12,2.28,"You're"],[2.28,2.38,'a'],[2.38,2.56,'top'],[2.56,2.96,'executive.'],[3.18,3.34,'By'],[3.34,3.6,'day,'],[3.72,3.84,'you'],[3.84,4.1,'sign'],[4.1,4.44,'million'],[4.44,4.66,'-dollar'],[4.66,4.98,'deals.'],[5.18,5.3,'By'],[5.3,5.56,'night,'],[5.72,5.98,'clubs'],[5.98,6.12,'where'],[6.12,6.22,'the'],[6.22,6.54,'bouncers'],[6.54,6.7,'know'],[6.7,6.84,'your'],[6.84,7.14,'face.'],[7.7,8.06,'Champagne,'],[8.06,8.42,'girls,'],[8.62,8.74,'and'],[8.74,8.84,'a'],[8.84,9.02,'white'],[9.02,9.26,'line'],[9.26,9.38,'in'],[9.38,9.46,'a'],[9.46,9.74,'bathroom'],[9.74,10.06,'stall.']];
/* субтитры: [слова с, по] (индексы WD), акцентные слова — по индексам */
const SUB=[[0,1],[2,3],[4,4],[5,6],[7,8],[9,10],[11,12],[13,14],[15,15],[16,17],[18,18],[19,21],[22,24],[25,25],[26,26],[27,28],[29,30],[31,34]];
const ACC=new Set([3,4,7,8,13,14,18,24,25,26,29,30]);
/* кадры: [имя, начало по голосу] */
const SC=[['city',0],['win',2.12],['desk',3.18],['club',5.18],['champ',7.5],['line',8.55]];
const scStart=i=>V0+SC[i][1],scEnd=i=>i+1<SC.length?scStart(i+1):TEND;

/* ===================== город (как duh.js, палитра cine) ===================== */
const P={sky:['#01030a','#05112a','#112a52'],hz:'rgba(80,125,200,0.34)',far:'#081227',bld:'#040a17',bld2:'#0a1733',win:['#ffc46b','#ffb04f','#ffd89a','#ff9e45','#ffe6bd','#ffb45c','#c4d8ff'],winP:0.36,band:0.5,edge:'rgba(140,180,255,0.24)',edgeW:1,band2:'#ffcf86',spire:'#ffcf7d',river:'#020713',refA:0.45,car:['255,214,150','255,90,60'],sheen:1};
const CW=1900,CH=1500,GY=1240,RS=1.5;
const TOW=[
  {k:'stalin',x:250,w:190,h:540},{k:'imp',x:470,w:110,h:500},{k:'cap2',x:690,w:98,h:560},{k:'oko2',x:1345,w:100,h:640},{k:'neva2',x:1565,w:92,h:690},
  {k:'cap',x:588,w:115,h:700},{k:'evo',x:806,w:106,h:620},{k:'fed',x:955,w:150,h:1040},{k:'merc',x:1105,w:122,h:880},{k:'oko',x:1240,w:122,h:950},{k:'neva',x:1456,w:100,h:770}];
const AV=[];let CITY=null,FOGC=null;
function tpath(c,k,x,w,h){const b=GY;c.beginPath();
  if(k==='fed'){c.moveTo(x-w/2,b);c.lineTo(x-w/2,b-0.64*h);c.quadraticCurveTo(x-w/2,b-0.9*h,x+0.12*w,b-h);c.lineTo(x+w/2,b-0.72*h);c.lineTo(x+w/2,b);}
  else if(k==='merc'){const p=[[-.5,0],[-.5,-.56],[-.42,-.56],[-.42,-.78],[-.31,-.78],[-.31,-.93],[-.14,-1],[.14,-1],[.31,-.93],[.31,-.78],[.42,-.78],[.42,-.56],[.5,-.56],[.5,0]];c.moveTo(x+p[0][0]*w,b);for(const q of p)c.lineTo(x+q[0]*w,b+q[1]*h);}
  else if(k==='oko'||k==='oko2'){c.moveTo(x-w/2,b);c.lineTo(x-w/2,b-h+26);c.lineTo(x+w/2,b-h);c.lineTo(x+w/2,b);}
  else if(k==='imp'){c.moveTo(x-w/2,b);c.lineTo(x-w/2,b-0.84*h);c.quadraticCurveTo(x,b-1.1*h,x+w/2,b-0.84*h);c.lineTo(x+w/2,b);}
  else if(k==='neva'||k==='neva2'){c.moveTo(x-w/2,b);c.lineTo(x-w/2,b-0.9*h);c.lineTo(x+w/2,b-h);c.lineTo(x+w/2,b);}
  else c.rect(x-w/2,b-h,w,h);
  c.closePath();}
function wins(c,r,x0,y0,x1,y1,o){o=o||{};const fh=o.fh||9,cw=o.cw||7,sc=o.sc===undefined?1:o.sc;
  for(let y=y1-fh;y>y0-fh;y-=fh){const on=r()<P.band,pr=(on?0.82:0.05)*sc,col=P.win[(r()*P.win.length)|0];
    for(let x=x0+1.5;x<x1-1;x+=cw){if(r()<pr){c.globalAlpha=0.5+0.5*r();c.fillStyle=r()<0.88?col:P.win[(r()*P.win.length)|0];c.fillRect(x,y+2,cw-2.4,fh-4);}}}
  c.globalAlpha=1;}
function block(c,r,x,y,w,h,o){c.fillStyle=P.bld;c.fillRect(x,y,w,h+0.6);c.save();c.beginPath();c.rect(x,y,w,h);c.clip();wins(c,r,x,y,x+w,y+h,o);c.restore();c.strokeStyle=P.edge;c.lineWidth=P.edgeW;c.strokeRect(x,y,w,h);}
function tower(c,r,T){const {k,x,w,h}=T;
  if(k==='evo'){const N=58,hs=h/N;for(let j=0;j<N;j++){const ph=j*0.13,ww=w*(0.8+0.2*Math.cos(ph)),off=w*0.17*Math.sin(ph),y=GY-(j+1)*hs;
      c.fillStyle=P.bld;c.fillRect(x+off-ww/2,y,ww,hs+0.6);
      c.globalAlpha=0.3+0.45*(0.5+0.5*Math.sin(ph*1.7));c.fillStyle=P.band2;c.fillRect(x+off-ww/2,y+hs-1.7,ww,1.5);c.globalAlpha=1;
      if(r()<0.5){c.save();c.beginPath();c.rect(x+off-ww/2,y,ww,hs);c.clip();wins(c,r,x+off-ww/2,y,x+off+ww/2,y+hs,{fh:hs,cw:6,sc:0.7});c.restore();}
      c.fillStyle=P.edge;c.fillRect(x+off-ww/2,y,P.edgeW,hs+0.6);c.fillRect(x+off+ww/2-P.edgeW,y,P.edgeW,hs+0.6);}
    AV.push([x+w*0.17*Math.sin((N-1)*0.13),GY-h-2,0.3]);return;}
  if(k==='cap'||k==='cap2'){const N=8,hs=h/N,off=[0,9,-7,12,-9,7,-11,5];for(let j=0;j<N;j++){const ww=w*(1-0.03*j),xx=x+off[j]*(w/115);block(c,r,xx-ww/2,GY-(j+1)*hs,ww,hs);}
    AV.push([x+off[N-1]*(w/115),GY-h-2,k==='cap'?0.6:0.9]);return;}
  if(k==='stalin'){const b=GY,parts=[[x-0.95*w,b-0.26*h,0.55*w,0.26*h],[x+0.4*w,b-0.26*h,0.55*w,0.26*h],[x-0.5*w,b-0.44*h,w,0.44*h],[x-0.32*w,b-0.66*h,0.64*w,0.22*h],[x-0.19*w,b-0.8*h,0.38*w,0.14*h],[x-0.1*w,b-0.88*h,0.2*w,0.08*h]];
    for(const q of parts)block(c,r,q[0],q[1],q[2],q[3],{fh:10,cw:8,sc:0.55});
    c.fillStyle=P.spire;c.beginPath();c.moveTo(x-0.05*w,b-0.88*h);c.lineTo(x,b-h);c.lineTo(x+0.05*w,b-0.88*h);c.closePath();c.fill();ell(c,x,b-h-6,5,5);c.fill();return;}
  tpath(c,k,x,w,h);c.fillStyle=lg(c,x-w/2,0,x+w/2,0,[[0,P.bld],[0.65,P.bld2],[1,P.bld]]);c.fill();
  c.save();tpath(c,k,x,w,h);c.clip();wins(c,r,x-w/2,GY-h*1.12,x+w/2,GY);
  c.fillStyle=lg(c,x-w/2,0,x+w/2,0,[[0,'rgba(120,160,255,0)'],[0.72,'rgba(130,170,255,0.09)'],[1,'rgba(120,160,255,0)']]);c.fillRect(x-w/2,GY-h*1.12,w,h*1.12);
  c.restore();tpath(c,k,x,w,h);c.strokeStyle=P.edge;c.lineWidth=P.edgeW;c.stroke();
  if(k==='fed'){c.strokeStyle=P.edge;c.lineWidth=2.2;c.beginPath();c.moveTo(x+0.12*w,GY-h);c.lineTo(x+0.12*w,GY-h-120);c.stroke();AV.push([x+0.12*w,GY-h-122,0]);}
  else if(k==='merc')AV.push([x,GY-h-3,0.45]);
  else if(k==='oko'||k==='oko2'||k==='neva'||k==='neva2')AV.push([x+w/2-5,GY-h-3,k.length*0.17]);
  else if(k==='imp')AV.push([x,GY-1.03*h,0.8]);
}
function buildCity(){
  const C=mk(CW*RS,CH*RS),c=C.getContext('2d');c.scale(RS,RS);const r=rng(7);
  c.fillStyle=lg(c,0,0,0,GY,[[0,P.sky[0]],[0.55,P.sky[1]],[1,P.sky[2]]]);c.fillRect(0,0,CW,GY);
  c.fillStyle=lg(c,0,GY-460,0,GY,[[0,'rgba(0,0,0,0)'],[1,P.hz]]);c.fillRect(0,GY-460,CW,460);
  let x=-20;while(x<CW){const w=40+r()*120,h=60+r()*170*(0.65+0.35*Math.sin(x*0.004));c.fillStyle=P.far;c.fillRect(x,GY-h,w+1,h);
    c.save();c.beginPath();c.rect(x,GY-h,w,h);c.clip();wins(c,r,x,GY-h,x+w,GY,{fh:8,cw:6,sc:0.4});c.restore();x+=w+(r()<0.25?r()*18:0);}
  c.fillStyle=lg(c,0,GY-300,0,GY,[[0,'rgba(40,70,120,0)'],[1,'rgba(40,70,120,0.28)']]);c.fillRect(0,GY-300,CW,300);
  for(const T of TOW)tower(c,r,T);
  x=-10;while(x<CW){const w=50+r()*110,h=24+r()*90;block(c,r,x,GY-h,w,h,{fh:8,cw:7,sc:0.5});x+=w+r()*6;}
  c.fillStyle='#0b1630';c.fillRect(0,GY,CW,3);c.fillStyle=P.river;c.fillRect(0,GY+3,CW,CH-GY-3);
  const RH=(CH-GY-4)*RS,top=(GY+4)*RS,C2=mk(CW*RS,RH),r2=C2.getContext('2d');
  for(let y=0;y<RH;y+=2){const sy=GY*RS-y*1.7-2;if(sy<0)break;const dx=(Math.sin(y*0.11)*2.5+Math.sin(y*0.033)*5)*RS;r2.globalAlpha=Math.max(0,1-y/RH)*P.refA;r2.drawImage(C,0,sy,CW*RS,2,dx,y,CW*RS,2);}
  const c0=C.getContext('2d');c0.setTransform(1,0,0,1,0,0);c0.filter='blur(1.4px)';c0.drawImage(C2,0,top);c0.filter='none';
  c0.globalAlpha=0.5;c0.fillStyle=P.river;for(let y=top;y<CH*RS;y+=7*RS){c0.fillRect(0,y,CW*RS,1.6*RS);}c0.globalAlpha=1;
  return C;}
function buildFog(){const F=mk(2400,420),c=F.getContext('2d'),r=rng(5);
  for(let i=0;i<70;i++){const x=r()*2400,y=150+r()*200,rx=120+r()*320,ry=40+r()*90,a=0.04+r()*0.07;c.fillStyle=rg(c,x,y,0,x,y,rx,[[0,`rgba(170,196,236,${a})`],[1,'rgba(170,196,236,0)']]);c.save();c.translate(x,y);c.scale(1,ry/rx);c.translate(-x,-y);c.fillRect(x-rx,y-rx,rx*2,rx*2);c.restore();}return F;}
function city(c,wx,wy,s,fx,fy){c.drawImage(CITY,fx-wx*s,fy-wy*s,CW*s,CH*s);}
function inWorld(c,wx,wy,s,fx,fy,fn){c.save();c.translate(fx-wx*s,fy-wy*s);c.scale(s,s);fn();c.restore();}
function lights(c,t){const G=glowSprite();
  for(const [x,y,ph] of AV){const k=0.5+0.5*Math.sin((t*1.3+ph)*TAU),a=0.35+0.65*k*k;
    c.globalCompositeOperation='lighter';c.globalAlpha=a*0.9;c.drawImage(G,x-18,y-18,36,36);c.globalAlpha=1;c.globalCompositeOperation='source-over';
    c.fillStyle=`rgba(255,70,60,${0.5+0.5*a})`;ell(c,x,y,2.6,2.6);c.fill();}
  const r=rng(11);c.globalCompositeOperation='lighter';c.lineCap='round';
  for(let i=0;i<34;i++){const lane=i%2,v=(130+r()*150)*(lane?-1:1),L=24+r()*40,x0=r()*2300,x=((x0+v*t)%2300+2300)%2300-200,y=GY-5+lane*3,col=P.car[lane];
    c.strokeStyle=`rgba(${col},0.9)`;c.lineWidth=2.4;c.beginPath();c.moveTo(x,y);c.lineTo(x-Math.sign(v)*L,y);c.stroke();
    c.strokeStyle=`rgba(${col},0.18)`;c.lineWidth=3;c.beginPath();c.moveTo(x,GY+8);c.lineTo(x,GY+70+r()*40);c.stroke();}
  c.globalCompositeOperation='source-over';c.lineCap='butt';
  for(const [y,sp,a,sc] of [[960,22,0.75,1],[1050,-14,0.9,1.2],[640,9,0.35,1.4]]){const off=((t*sp)%2400+2400)%2400;c.globalAlpha=a;for(const dx of [-2400,0])c.drawImage(FOGC,dx+off-200,y-210*sc,2400,420*sc);}c.globalAlpha=1;}
function rain(c,t,n,seed,o){const r=rng(seed);c.save();c.strokeStyle=o.col||'#fff';c.lineCap='round';
  for(let i=0;i<n;i++){const L=lerp(o.l0,o.l1,r()),v=lerp(o.v0,o.v1,r()),w=lerp(o.w0,o.w1,r()),x0=r()*1500-260,y0=r()*2400,a=o.a*(0.35+0.65*r());
    const y=((y0+v*t)%2400+2400)%2400-240,x=x0+y*0.27;c.globalAlpha=a;c.lineWidth=w;c.beginPath();c.moveTo(x,y);c.lineTo(x-L*0.26,y-L);c.stroke();}
  c.restore();}
function manPath(c){c.beginPath();c.moveTo(-360,40);c.lineTo(-348,-420);c.bezierCurveTo(-338,-520,-252,-575,-150,-600);c.bezierCurveTo(-110,-612,-92,-640,-90,-680);c.lineTo(-93,-722);
  c.bezierCurveTo(-112,-735,-131,-760,-128,-802);c.bezierCurveTo(-141,-882,-121,-962,-40,-990);c.bezierCurveTo(40,-1016,111,-976,116,-900);c.bezierCurveTo(121,-840,96,-770,70,-735);
  c.lineTo(72,-680);c.bezierCurveTo(80,-640,110,-615,170,-600);c.bezierCurveTo(290,-575,382,-540,424,-470);c.lineTo(444,40);c.closePath();}
function man(c,x,y,s,body,rim,rw,line){c.save();c.translate(x,y);c.scale(s,s);manPath(c);c.fillStyle=rim;c.fill();c.save();manPath(c);c.clip();c.translate(rw,rw*0.45);manPath(c);c.fillStyle=body;c.fill();c.restore();
  c.save();manPath(c);c.clip();c.strokeStyle=line;c.lineCap='round';c.lineWidth=4;c.beginPath();c.moveTo(-96,-668);c.quadraticCurveTo(-10,-640,74,-664);c.stroke();
  c.lineWidth=3.2;c.beginPath();c.moveTo(-160,-598);c.quadraticCurveTo(-60,-560,8,-572);c.quadraticCurveTo(90,-560,182,-598);c.stroke();c.beginPath();c.moveTo(8,-572);c.lineTo(14,-300);c.stroke();
  c.lineWidth=3;c.beginPath();c.moveTo(-128,-808);c.quadraticCurveTo(-150,-790,-136,-758);c.stroke();c.restore();c.restore();}

/* ===================== общие мелочи ===================== */
const sh=(t,k,a)=>({x:a*sn(t*0.7,k),y:a*0.8*sn(t*0.7+3,k+1)});
function bokeh(c,t,seed,n,cols,o){o=o||{};const r=rng(seed),G=glowSprite();c.save();c.globalCompositeOperation='lighter';
  for(let i=0;i<n;i++){const x=r()*W*1.2-W*0.1+(o.vx||0)*t*(0.5+r()),y=r()*H+(o.vy||0)*t*(0.5+r()),R=lerp(o.r0||40,o.r1||150,r()),col=cols[(r()*cols.length)|0],a=(o.a||0.35)*(0.4+0.6*r())*(0.75+0.25*Math.sin(t*1.7+i));
    c.globalAlpha=a;c.fillStyle=rg(c,x,y,0,x,y,R,[[0,col],[0.7,col],[0.92,col.replace(/[\d.]+\)$/,'0.35)')],[1,col.replace(/[\d.]+\)$/,'0)')]]);ell(c,x,y,R,R);c.fill();}
  c.restore();}
function lightPool(c,x,y,r,col,a){c.save();c.globalCompositeOperation='lighter';c.globalAlpha=a;c.fillStyle=rg(c,x,y,0,x,y,r,[[0,col],[1,'rgba(0,0,0,0)']]);c.fillRect(x-r,y-r,r*2,r*2);c.restore();}

/* ===================== кадры ===================== */
function sCity(c,u,t){ // Сити снизу вверх, в небе — «29»
  const d=scEnd(0)-scStart(0),k=E.ioS(u/d),s=1.55+0.18*k,wx=1020+40*k,wy=lerp(1180,700,E.outC(u/d)),j=sh(t,1,3);
  c.fillStyle='#01030a';c.fillRect(0,0,W,H);
  c.save();c.translate(j.x,j.y);city(c,wx,wy,s,540,1080);inWorld(c,wx,wy,s,540,1080,()=>lights(c,t));c.restore();
  rain(c,t,140,4,{l0:30,l1:90,v0:1300,v1:2100,w0:0.8,w1:1.8,a:0.22,col:'#cfe0ff'});
  /* «29» — объёмные цифры над башнями */
  const a=inv(0.78,0.98,u);if(a>0){const p=E.outB(inv(0.78,1.25,u),1.6),sc=lerp(1.9,1,p),fl=8*Math.sin(t*1.6),cx=540,cy=640+fl;
    c.save();c.globalAlpha=a;c.translate(cx,cy);c.scale(sc,sc);c.rotate(-0.04*(1-p));c.font='800 470px Mont';c.textAlign='center';c.textBaseline='middle';
    for(let L=22;L>0;L--){c.fillStyle=`rgb(${78-L*2},${44-L},${14})`;c.fillText('29',L*1.4,L*2.0);}
    c.shadowColor='rgba(255,170,70,0.85)';c.shadowBlur=60;c.fillStyle=lg(c,0,-210,0,210,[[0,'#fff6e2'],[0.55,'#ffcf86'],[1,'#ff9a3c']]);c.fillText('29',0,0);
    c.shadowBlur=0;c.globalCompositeOperation='lighter';c.globalAlpha=a*0.35;const gx=lerp(-420,420,inv(1.0,2.0,u));c.fillStyle=lg(c,gx-90,0,gx+90,0,[[0,'rgba(255,255,255,0)'],[0.5,'rgba(255,255,255,0.9)'],[1,'rgba(255,255,255,0)']]);c.fillText('29',0,0);
    c.restore();lightPool(c,540,700,520,'rgba(255,150,60,0.35)',a*0.8);}
  /* размытый передний план: перила */
  c.save();c.filter='blur(14px)';c.fillStyle='rgba(2,4,10,0.95)';c.fillRect(-40,1640+j.y*2,W+80,40);c.fillRect(-40,1760+j.y*2,W+80,240);for(let x=-60;x<W+60;x+=210){c.fillRect(x+j.x*3,1640,26,400);}c.restore();
}
const WIN={y0:170,y1:1452,m:[360,744]};
function sWin(c,u,t){ // силуэт у панорамного окна, быстрый отъезд
  const z=lerp(1.32,1.0,E.outE(u/0.7)),j=sh(t,5,2.6);
  c.save();c.translate(540,960);c.scale(z,z);c.translate(-540,-960);
  c.fillStyle='#02050c';c.fillRect(-200,-200,W+400,H+400);
  c.save();c.beginPath();c.rect(0,WIN.y0,W,WIN.y1-WIN.y0);c.clip();city(c,905,860,0.88,470,890);inWorld(c,905,860,0.88,470,890,()=>lights(c,t));c.restore();
  c.save();c.beginPath();c.rect(0,WIN.y1,W,H-WIN.y1+300);c.clip();c.globalAlpha=0.22;c.translate(0,2*WIN.y1);c.scale(1,-1);city(c,905,860,0.88,470,890);c.restore();
  c.fillStyle=lg(c,0,WIN.y1,0,H,[[0,'rgba(0,0,0,0.15)'],[1,'rgba(0,0,0,0.85)']]);c.fillRect(-200,WIN.y1,W+400,H-WIN.y1+300);
  const fr='#03060d',hl='rgba(150,180,240,0.25)';c.fillStyle=fr;c.fillRect(-200,-200,W+400,WIN.y0+200);c.fillRect(-200,WIN.y1-6,W+400,26);
  for(const mx of WIN.m){c.fillStyle=fr;c.fillRect(mx-9,WIN.y0,18,WIN.y1-WIN.y0);c.fillStyle=hl;c.fillRect(mx-9,WIN.y0,1.6,WIN.y1-WIN.y0);}
  man(c,930+j.x,1915+j.y,1.02,'#02050b','rgba(255,176,92,0.9)',5,'rgba(255,176,92,0.2)');
  c.restore();
}
function sDesk(c,u,t){ // стол сверху: контракт, ручка ставит подпись, счётчик $1 000 000
  const d=scEnd(2)-scStart(2),z=lerp(1.1,1.0,E.outC(u/d)),rot=lerp(-0.05,0.0,E.outC(u/d));
  c.save();c.translate(540,960);c.rotate(rot);c.scale(z,z);c.translate(-540,-960);
  c.fillStyle='#0c0705';c.fillRect(-300,-300,W+600,H+600);
  const r=rng(23);for(let i=0;i<70;i++){const y=-300+i*36+r()*10;c.fillStyle=`rgba(${70+r()*30},${38+r()*16},${20+r()*10},${0.25+r()*0.2})`;c.fillRect(-300,y,W+600,8+r()*18);}
  lightPool(c,620,820,900,'rgba(255,170,90,0.42)',1);
  /* бумага */
  c.save();c.translate(560,1010);c.rotate(-0.12);c.shadowColor='rgba(0,0,0,0.7)';c.shadowBlur=60;c.shadowOffsetY=24;c.fillStyle='#efe9dc';c.fillRect(-370,-520,740,1040);c.shadowBlur=0;c.shadowOffsetY=0;
  c.fillStyle=lg(c,-370,0,370,0,[[0,'rgba(0,0,0,0.06)'],[0.6,'rgba(255,255,255,0.08)'],[1,'rgba(0,0,0,0.1)']]);c.fillRect(-370,-520,740,1040);
  c.fillStyle='#2a2a2a';c.font='700 40px JBM';c.textAlign='left';c.fillText('LOAN AGREEMENT',-300,-430);
  const r2=rng(41);for(let i=0;i<17;i++){const y=-360+i*36;c.fillStyle='rgba(40,40,40,0.38)';c.fillRect(-300,y,lerp(380,600,r2()),9);}
  c.fillStyle='rgba(40,40,40,0.6)';c.fillRect(-300,330,420,3);c.font='600 26px JBM';c.fillText('SIGNATURE',-300,370);
  /* подпись — чернила по пути */
  const sp=inv(0.12,0.95,u),pts=[];for(let i=0;i<=60;i++){const q=i/60;pts.push([-290+q*400,318-28*Math.sin(q*TAU*1.6)*(1-q*0.4)-22*Math.sin(q*TAU*3.3)]);}
  c.strokeStyle='#0d1b4d';c.lineWidth=7;c.lineCap='round';c.lineJoin='round';c.beginPath();const nN=Math.max(1,Math.floor(sp*60));c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<=nN;i++)c.lineTo(pts[i][0],pts[i][1]);if(sp>0)c.stroke();
  /* ручка */
  const pp=pts[Math.min(60,nN)];c.save();c.translate(pp[0],pp[1]);c.rotate(-0.85);c.shadowColor='rgba(0,0,0,0.55)';c.shadowBlur=30;c.shadowOffsetX=18;c.shadowOffsetY=22;
  c.fillStyle=lg(c,0,-22,0,22,[[0,'#3a3a3a'],[0.45,'#0b0b0b'],[1,'#000']]);rr(c,10,-20,520,40,20);c.fill();c.shadowBlur=0;c.shadowOffsetX=0;c.shadowOffsetY=0;
  c.fillStyle=lg(c,0,-20,0,20,[[0,'#fff1c4'],[0.5,'#d4a84b'],[1,'#7a5a1c']]);c.fillRect(150,-21,22,42);c.fillRect(440,-21,14,42);
  c.fillStyle='#d9b35a';c.beginPath();c.moveTo(10,-14);c.lineTo(-34,0);c.lineTo(10,14);c.closePath();c.fill();c.restore();
  c.restore();
  /* размытый передний план: стакан виски */
  c.save();c.filter='blur(22px)';c.globalAlpha=0.9;c.fillStyle=rg(c,120,1640,0,120,1640,330,[[0,'rgba(255,170,70,0.55)'],[0.6,'rgba(120,60,20,0.55)'],[1,'rgba(0,0,0,0)']]);ell(c,120,1640,330,330);c.fill();c.restore();
  c.restore();
  /* счётчик */
  const cu=inv(0.9,1.55,u);if(u>0.55){const v=Math.round(1e6*E.outC(cu)),s='$'+v.toString().replace(/\B(?=(\d{3})+(?!\d))/g,','),pop=1+0.08*Math.max(0,1-Math.abs(u-1.55)/0.12);
    c.save();c.translate(540,330);c.scale(pop,pop);txt(c,s,0,0,{font:'800 138px Mont',fill:'#fff',shadow:'rgba(255,170,60,0.75)',sb:40});c.restore();}
}
function sClub(c,u,t){ // вход в клуб: неон, канат, вышибала, он со спины
  const d=scEnd(3)-scStart(3),k=E.ioS(u/d),j=sh(t,8,2.4),fl=(Math.sin(t*37)>0.93?0.55:1)*(0.92+0.08*Math.sin(t*9));
  c.fillStyle='#07040a';c.fillRect(0,0,W,H);
  const z=1.0+0.07*k;c.save();c.translate(540,900);c.scale(z,z);c.translate(-540,-900);c.translate(j.x*0.5,j.y*0.5);
  /* стена */
  c.fillStyle=lg(c,0,0,0,H,[[0,'#0a0610'],[0.7,'#140a18'],[1,'#050308']]);c.fillRect(-100,-100,W+200,1500);
  const r=rng(61);for(let y=-100;y<1400;y+=46){for(let x=-120+(Math.floor(y/46)%2)*48;x<W+120;x+=96){c.fillStyle=`rgba(${30+r()*20},${14+r()*10},${28+r()*14},0.9)`;c.fillRect(x,y,92,42);}}
  /* дверь и свет из неё */
  const op=inv(1.3,1.9,u),dg=lerp(0.55,1,op);c.fillStyle='#000';c.fillRect(380,560,320,780);
  c.fillStyle=lg(c,0,560,0,1340,[[0,`rgba(255,60,170,${0.55*dg})`],[1,`rgba(140,40,255,${0.75*dg})`]]);c.fillRect(380+lerp(150,0,op),560,lerp(20,320,op),780);
  lightPool(c,540,1000,620,`rgba(255,60,170,${0.5*dg})`,1);
  /* неон */
  c.save();c.globalAlpha=fl;c.font='800 120px Mont';c.textAlign='center';c.textBaseline='middle';c.shadowColor='rgba(255,40,160,1)';c.shadowBlur=50;c.fillStyle='#ffd6f0';c.fillText('VELVET',540,430);c.shadowBlur=18;c.fillText('VELVET',540,430);c.restore();
  lightPool(c,540,430,520,'rgba(255,40,160,0.45)',fl);
  /* мокрый асфальт */
  c.fillStyle=lg(c,0,1330,0,H,[[0,'#120810'],[1,'#030204']]);c.fillRect(-100,1330,W+200,700);
  c.save();c.globalAlpha=0.35;c.translate(0,2*1330);c.scale(1,-0.6);c.fillStyle=`rgba(255,80,190,${0.6*fl})`;c.fillRect(380,560,320,780);c.restore();
  lightPool(c,540,1500,700,`rgba(255,60,170,${0.25*fl})`,1);
  /* стойки и канат */
  const posts=[[230,1360],[850,1360]];for(const [x,y] of posts){c.fillStyle=lg(c,x-14,0,x+14,0,[[0,'#6b4b16'],[0.5,'#ffe3a0'],[1,'#5a3c10']]);c.fillRect(x-12,y-300,24,300);ell(c,x,y-310,24,24);c.fill();ell(c,x,y,60,16);c.fill();}
  const drop=E.inQ(inv(1.45,1.9,u));c.strokeStyle='#b0102a';c.lineWidth=22;c.lineCap='round';c.beginPath();c.moveTo(242,1070);
  if(drop<=0)c.quadraticCurveTo(540,1230,838,1070);else c.quadraticCurveTo(lerp(540,330,drop),lerp(1230,1320,drop),lerp(838,300,drop),lerp(1070,1340,drop));c.stroke();
  c.strokeStyle='rgba(255,140,160,0.5)';c.lineWidth=5;c.stroke();
  /* вышибала */
  c.save();c.translate(800,1340);c.scale(0.62,0.62);manPath(c);c.fillStyle='rgba(255,60,170,0.55)';c.fill();c.translate(6,3);manPath(c);c.fillStyle='#030104';c.fill();c.restore();
  c.restore();
  /* он со спины — ближе, быстрее параллакс */
  const mz=1.12+0.1*k;man(c,330+j.x*2-60*k,2010+j.y,mz,'#020103','rgba(255,70,180,0.85)',6,'rgba(255,90,190,0.2)');
  /* дымка */
  c.save();c.globalAlpha=0.5;c.drawImage(FOGC,-300+60*t%300,780,2400,520);c.restore();
}
function sChamp(c,u,t){ // макро: бокал шампанского, пузырьки, боке
  const d=scEnd(4)-scStart(4),z=lerp(1.0,1.08,E.ioS(u/d)),j=sh(t,12,2);
  c.fillStyle='#050305';c.fillRect(0,0,W,H);
  bokeh(c,t,71,26,['rgba(255,190,90,0.6)','rgba(255,90,170,0.5)','rgba(255,230,180,0.5)'],{r0:50,r1:170,a:0.32,vx:-20,vy:-10});
  c.save();c.translate(540+j.x,980+j.y);c.scale(z,z);
  /* чаша */
  const bw=190,top=-560,bot=180;
  const bowl=()=>{c.beginPath();c.moveTo(-bw,top);c.bezierCurveTo(-bw,-80,-bw*0.75,bot-40,-26,bot);c.lineTo(26,bot);c.bezierCurveTo(bw*0.75,bot-40,bw,-80,bw,top);c.closePath();};
  c.save();bowl();c.clip();
  const lv=-330;c.fillStyle=lg(c,0,lv,0,bot,[[0,'rgba(255,214,120,0.9)'],[0.5,'rgba(232,160,50,0.9)'],[1,'rgba(150,80,10,0.95)']]);c.fillRect(-bw,lv,bw*2,bot-lv+10);
  c.fillStyle='rgba(255,250,220,0.7)';c.fillRect(-bw,lv-6,bw*2,10);
  const r=rng(81);for(let i=0;i<70;i++){const x0=lerp(-bw*0.6,bw*0.6,r()),sp=lerp(160,420,r()),ph=r(),R=lerp(2,7,r());const y=bot-((ph*600+sp*t)%(bot-lv));const x=x0+8*Math.sin(t*5+i);c.fillStyle='rgba(255,255,240,0.85)';ell(c,x,y,R,R);c.fill();c.fillStyle='rgba(255,255,255,0.95)';ell(c,x-R*0.3,y-R*0.3,R*0.35,R*0.35);c.fill();}
  c.restore();
  bowl();c.strokeStyle='rgba(255,255,255,0.55)';c.lineWidth=4;c.stroke();
  c.save();bowl();c.clip();c.globalCompositeOperation='lighter';c.fillStyle=lg(c,-bw,0,bw,0,[[0,'rgba(255,255,255,0.35)'],[0.12,'rgba(255,255,255,0)'],[0.78,'rgba(255,255,255,0)'],[0.9,'rgba(255,255,255,0.3)'],[1,'rgba(255,255,255,0.05)']]);c.fillRect(-bw,top,bw*2,bot-top);c.restore();
  /* ножка */
  c.fillStyle='rgba(255,255,255,0.5)';c.fillRect(-9,bot,18,520);ell(c,0,bot+530,170,26);c.fill();
  /* помада на краю */
  c.save();c.globalAlpha=0.85;c.fillStyle='#c21032';ell(c,-bw+60,top+10,46,14,0.08);c.fill();ell(c,-bw+92,top+14,30,10,0.1);c.fill();c.restore();
  /* блик по краю */
  const gx=lerp(-bw,bw,inv(0.15,0.9,u));c.save();c.globalCompositeOperation='lighter';c.drawImage(glowSprite(),gx-60,top-60,120,120);c.restore();
  c.restore();
  /* передний план: размытый второй бокал */
  c.save();c.filter='blur(26px)';c.fillStyle='rgba(255,200,110,0.35)';ell(c,940,1300,200,520);c.fill();c.restore();
}
function sLine(c,u,t){ // чёрное стекло сверху: дорожка и карта
  const d=scEnd(5)-scStart(5),z=lerp(1.12,1.0,E.outC(u/d)),j=sh(t,15,3.2);
  c.save();c.translate(540+j.x,960+j.y);c.scale(z,z);c.rotate(-0.42);c.translate(-540,-960);
  c.fillStyle='#030305';c.fillRect(-500,-500,W+1000,H+1000);
  /* неон в отражении */
  c.save();c.globalCompositeOperation='lighter';c.filter='blur(40px)';c.fillStyle='rgba(255,40,150,0.45)';c.fillRect(-300,520,W+600,90);c.fillStyle='rgba(40,140,255,0.35)';c.fillRect(-300,1380,W+600,70);c.filter='none';c.restore();
  lightPool(c,540,960,900,'rgba(120,120,160,0.12)',1);
  /* дорожка: много мелких крупинок */
  const r=rng(91),cut=inv(0.2,1.2,u);for(let i=0;i<1600;i++){const q=r(),x=lerp(170,910,q),y=960+(r()-0.5)*lerp(26,14,Math.abs(q-0.5)*2)+(r()<0.04?(r()-0.5)*60:0),R=lerp(0.8,3.2,r()*r());
    c.fillStyle=`rgba(255,255,255,${0.55+0.45*r()})`;c.fillRect(x,y,R,R);}
  c.save();c.globalCompositeOperation='lighter';c.filter='blur(6px)';c.fillStyle='rgba(255,255,255,0.18)';c.fillRect(170,948,740,24);c.restore();
  /* карта едет вдоль дорожки */
  const cx=lerp(980,320,E.ioS(cut));c.save();c.translate(cx,1010);c.rotate(0.08);c.shadowColor='rgba(0,0,0,0.8)';c.shadowBlur=40;c.shadowOffsetY=18;
  c.fillStyle=lg(c,-170,-110,170,110,[[0,'#1b1b1f'],[0.5,'#08080a'],[1,'#141418']]);rr(c,-170,-108,340,216,18);c.fill();c.shadowBlur=0;c.shadowOffsetY=0;
  c.fillStyle=lg(c,0,0,40,30,[[0,'#d9c48a'],[1,'#8a7440']]);rr(c,-120,-40,62,46,8);c.fill();
  c.fillStyle='rgba(255,255,255,0.75)';c.font='600 22px JBM';c.textAlign='left';c.fillText('•••• •••• •••• 2012',-120,50);
  const gx=lerp(-220,220,inv(0.5,1.3,u));c.globalCompositeOperation='lighter';c.fillStyle=lg(c,gx-60,0,gx+60,0,[[0,'rgba(255,255,255,0)'],[0.5,'rgba(255,255,255,0.4)'],[1,'rgba(255,255,255,0)']]);rr(c,-170,-108,340,216,18);c.fill();c.restore();
  c.restore();
  const dk=inv(d-0.45,d,u);if(dk>0){c.fillStyle=`rgba(0,0,0,${0.7*dk})`;c.fillRect(0,0,W,H);}
}
const DRAW={city:sCity,win:sWin,desk:sDesk,club:sClub,champ:sChamp,line:sLine};

/* ===================== поверх: HUD и субтитры ===================== */
function hud(c,t){const a=inv(V0,V0+0.4,t);if(a<=0)return;c.save();c.globalAlpha=a*0.85;
  c.font='600 26px JBM';c.textBaseline='middle';c.textAlign='left';c.fillStyle='#ff3b30';ell(c,64,140,7,7);c.fill();c.fillStyle='rgba(255,255,255,0.86)';c.fillText('MOSCOW · 2012',82,141);
  const s=13+Math.floor(t-V0),mm=47+Math.floor(s/60),ss=s%60;c.textAlign='right';c.fillText(`02:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`,1016,141);
  c.fillStyle='rgba(255,255,255,0.25)';c.fillRect(64,168,952,1.5);c.restore();}
function subs(c,t){const v=t-V0;if(v<0)return;let cur=null;
  for(let k=0;k<SUB.length;k++){const [a,b]=SUB[k],ta=WD[a][0],nx=k+1<SUB.length?WD[SUB[k+1][0]][0]:99,tb=nx-WD[b][1]<0.6?nx:WD[b][1]+0.3;if(v>=ta&&v<tb){cur=[a,b,ta];break;}}
  if(!cur)return;const [a,b,ta]=cur,age=v-ta,pop=1+0.1*Math.max(0,1-age/0.09);
  c.save();c.fillStyle=rg(c,540,1200,0,540,1200,520,[[0,'rgba(0,0,0,0.5)'],[0.55,'rgba(0,0,0,0.28)'],[1,'rgba(0,0,0,0)']]);c.translate(540,1200);c.scale(1,0.36);c.translate(-540,-1200);c.fillRect(0,680,W,1040);c.restore();
  const words=[];for(let i=a;i<=b;i++)words.push([WD[i][2].replace(/^-/,'').toUpperCase(),ACC.has(i)]);
  c.save();c.font='800 96px Mont';c.letterSpacing='-1px';const sp=c.measureText(' ').width;let tot=0;const ws=words.map(w=>{const m=c.measureText(w[0]).width;tot+=m;return m;});tot+=sp*(words.length-1);
  const sc=Math.min(1,820/tot)*pop;c.translate(540,1200);c.scale(sc,sc);let x=-tot/2;
  for(let i=0;i<words.length;i++){c.textAlign='left';c.textBaseline='middle';c.shadowColor='rgba(0,0,0,0.7)';c.shadowBlur=24;c.shadowOffsetY=4;
    c.fillStyle=words[i][1]?'#FF8A1E':'#FFFFFF';c.fillText(words[i][0],x,0);x+=ws[i]+sp;}
  c.restore();}

/* ===================== переходы ===================== */
const OFF=mk(),OX=OFF.getContext('2d');
function sceneAt(t){for(let i=SC.length-1;i>=0;i--)if(t>=scStart(i))return i;return -1;}
function drawScene(c,i,t){reset(c);DRAW[SC[i][0]](c,t-scStart(i),t);}
function whip(c,i,t){const u=t-scStart(i),D=0.2;
  if(u>=D||i===0){drawScene(c,i,t);return;}
  const k=1-E.outC(u/D);reset(OX);OX.clearRect(0,0,W,H);drawScene(OX,i,t);
  c.save();reset(c);
  if(i%2===1){const s0=1+0.42*k;for(let n=0;n<6;n++){const s=s0*(1+0.05*n*k);c.globalAlpha=n===0?1:0.32*(1-n/7);c.drawImage(OFF,540-540*s,960-960*s,W*s,H*s);}}
  else{const dir=i%4===0?1:-1;for(let n=0;n<7;n++){const dx=dir*(260*k+n*45*k);c.globalAlpha=n===0?1:0.3*(1-n/8);c.drawImage(OFF,dx,0);}}
  c.restore();
  c.save();c.globalAlpha=0.16*k;c.fillStyle='#fff';c.fillRect(0,0,W,H);c.restore();}

CLIP.init=async()=>{await DC.init();CITY=buildCity();FOGC=buildFog();};
CLIP.draw=(c,t,i)=>{
  if(t<5.0){DC.draw(c,t);grain(c,i,0.05);return;}
  if(t<V0){c.fillStyle='#000';c.fillRect(0,0,W,H);return;}
  const s=sceneAt(t);whip(c,s,t);
  vig(c,0.62,0.26);bloom(c,CV,0.22);grain(c,i,0.075);
  const fk=inv(V0+0.1,V0,t);if(fk>0){c.save();reset(c);c.globalAlpha=0.85*fk;c.fillStyle='#fff';c.fillRect(0,0,W,H);c.restore();}
  hud(c,t);subs(c,t);
};
})();
