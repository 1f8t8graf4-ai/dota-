"use strict";
/* «Акула» RU · тестовый ролик «Представь… правила» (27.11) по формату референса «инсульт» (@pqajshisaoqod):
   ты в беде → «Правило первое…четвёртое» по одному → обрыв без пятого. Плоский мультик + HUD: стикер «место · время»,
   таймер «с начала» (краснеет в опасности), значки правил слева, выноски, субтитры по 1–3 слова (сказанное — белым).
   N=<кадров> P10A=<папка с shk.words.json> node render.mjs shk - out.mp4 */
CLIP.fonts=['900 40px Mont','800 40px Mont','700 40px Mont','700 40px Cav','600 40px Cav'];
let VO=null,SH=[],SUB=[],DUR=75;
const wa=i=>VO.words[i].a,wb=i=>VO.words[i].b;
const cl=clamp,lp=lerp,ez=E.ioC,oz=E.outC;
const H1=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};
const PAL={skin:'#f1c09a',skin2:'#d49a74',skin3:'#b97c5a',hair:'#3a2a22',trunk:'#d8463a',trunk2:'#a9322a',
  sk:'#7d8d99',sk2:'#5d6c78',skB:'#e2e7ea',gill:'#3a4650',
  red:'#ff4d4d',yel:'#ffd23f',grn:'#3ddc84',ink:'#14171d',cream:'#f6efe2',navy:'#0c1a2c'};

/* ---------- примитивы ---------- */
function cap(c,x0,y0,x1,y1,w,col){c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.stroke();}
function quadc(c,x0,y0,cx,cy,x1,y1,w,col){c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.beginPath();c.moveTo(x0,y0);c.quadraticCurveTo(cx,cy,x1,y1);c.stroke();}
function dot(c,x,y,r,col){c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}
function bubbles(c,t,x0,x1,y0,y1,n,seed){for(let i=0;i<n;i++){const sp=40+60*H1(i+seed),ph=((t*sp+H1(i*3+seed)*(y1-y0))%(y1-y0)),y=y1-ph,x=lp(x0,x1,H1(i*7+seed))+Math.sin(t*2+i)*8,r=3+7*H1(i*5+seed);
  c.strokeStyle='rgba(190,230,255,.55)';c.lineWidth=2;c.beginPath();c.arc(x,y,r,0,TAU);c.stroke();}}
function specks(c,t,n,seed,a){for(let i=0;i<n;i++){const x=((H1(i+seed)*1300+t*(8+10*H1(i*3)))%1300)-110,y=(H1(i*9+seed)*2100+Math.sin(t+i)*20)-90;c.fillStyle=`rgba(200,230,255,${(a||.25)*(.4+.6*H1(i*2))})`;c.fillRect(x,y,3,3);}}
function rays(c,t,a){c.save();c.globalCompositeOperation='screen';for(let i=0;i<6;i++){const x=120+i*190+Math.sin(t*.4+i)*40,w=50+40*H1(i);c.fillStyle=`rgba(140,200,255,${(a||.08)*(.6+.4*Math.sin(t*.7+i*1.3))})`;
  c.beginPath();c.moveTo(x,-40);c.lineTo(x+w,-40);c.lineTo(x+w*2.4+260,2000);c.lineTo(x+260,2000);c.closePath();c.fill();}c.restore();}
function underwater(c,t,o={}){c.fillStyle=lg(c,0,0,0,H,[[0,o.top||'#1f5a83'],[.55,'#0d3152'],[1,'#04111f']]);c.fillRect(-300,-300,W+600,H+600);rays(c,t,o.ray);specks(c,t,70,3,.22);}
function sky(c,y1){c.fillStyle=lg(c,0,0,0,y1,[[0,'#232a55'],[.55,'#9c5a78'],[.85,'#e88c64'],[1,'#f6b46e']]);c.fillRect(-300,-300,W+600,y1+300);
  dot(c,760,y1-120,70,'rgba(255,214,150,.95)');c.fillStyle='rgba(255,214,150,.25)';c.beginPath();c.arc(760,y1-120,120,0,TAU);c.fill();}
function waves(c,t,y,col,amp,len,sp){c.fillStyle=col;c.beginPath();c.moveTo(-300,H+300);for(let x=-300;x<=W+300;x+=20)c.lineTo(x,y+Math.sin(x/len+t*sp)*amp+Math.sin(x/(len*.43)-t*sp*1.3)*amp*.4);c.lineTo(W+300,H+300);c.closePath();c.fill();}
function stamp(c,x,y,s,a,col){c.save();c.globalAlpha=a;c.translate(x,y);c.scale(s,s);cap(c,-60,-60,60,60,22,col||PAL.red);cap(c,60,-60,-60,60,22,col||PAL.red);c.restore();}
function check(c,x,y,s,a){c.save();c.globalAlpha=a;c.translate(x,y);c.scale(s,s);c.strokeStyle=PAL.grn;c.lineWidth=22;c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(-50,0);c.lineTo(-15,38);c.lineTo(55,-40);c.stroke();c.restore();}
function ring(c,x,y,r,a,col,w){c.strokeStyle=col||'#fff';c.globalAlpha=a;c.lineWidth=w||6;c.beginPath();c.arc(x,y,r,0,TAU);c.stroke();c.globalAlpha=1;}

/* ---------- герой ---------- */
function face(c,x,y,s,o={}){const lk=o.look||[0,0],ex=o.ex||'calm';c.save();c.translate(x,y);c.scale(s,s);
  c.fillStyle=PAL.skin2;ell(c,-96,14,20,30);c.fill();ell(c,96,14,20,30);c.fill();
  c.fillStyle=PAL.skin;ell(c,0,0,98,118);c.fill();
  c.save();ell(c,0,0,98,118);c.clip();c.fillStyle='rgba(185,124,90,.28)';c.beginPath();c.ellipse(70,10,60,130,0,0,TAU);c.fill();c.restore();
  c.fillStyle=PAL.hair;c.beginPath();c.moveTo(-104,-6);c.bezierCurveTo(-112,-120,-30,-150,10,-140);c.bezierCurveTo(80,-142,118,-100,104,-8);
  c.bezierCurveTo(88,-50,60,-74,20,-70);c.bezierCurveTo(-20,-90,-60,-60,-80,-40);c.bezierCurveTo(-92,-30,-98,-18,-104,-6);c.fill();
  if(o.wet){c.fillStyle='rgba(255,255,255,.35)';for(let i=0;i<4;i++)c.fillRect(-60+i*36,-96+((i*13)%20),10,4);}
  const eh=ex==='wide'?26:ex==='grit'||ex==='pain'?13:ex==='dazed'?9:20;
  for(const sx of [-38,38]){c.fillStyle='#fff';ell(c,sx,-6,22,eh);c.fill();dot(c,sx+lk[0]*9,-6+lk[1]*7,ex==='wide'?8:10,'#1a1c22');}
  c.strokeStyle=PAL.hair;c.lineWidth=9;c.lineCap='round';const br=ex==='wide'?-46:ex==='grit'||ex==='pain'?-30:-38,tl=ex==='grit'||ex==='pain'?8:0;
  c.beginPath();c.moveTo(-60,br-tl);c.lineTo(-20,br+tl);c.stroke();c.beginPath();c.moveTo(20,br+tl);c.lineTo(60,br-tl);c.stroke();
  c.strokeStyle=PAL.skin3;c.lineWidth=6;c.beginPath();c.moveTo(4,4);c.quadraticCurveTo(14,30,0,36);c.stroke();
  c.fillStyle='#5a2a24';c.strokeStyle='#5a2a24';
  if(ex==='wide'){ell(c,0,66,16,20);c.fill();}
  else if(ex==='grit'){c.fillStyle='#fff';rr(c,-30,56,60,20,8);c.fill();c.strokeStyle='#5a2a24';c.lineWidth=4;c.strokeRect(-30,56,60,20);c.beginPath();c.moveTo(-30,66);c.lineTo(30,66);c.stroke();}
  else if(ex==='pain'){c.lineWidth=7;c.beginPath();c.moveTo(-30,70);c.quadraticCurveTo(0,52,30,70);c.stroke();}
  else if(ex==='puff'){c.fillStyle='rgba(214,120,100,.35)';ell(c,-62,40,22,16);c.fill();ell(c,62,40,22,16);c.fill();c.fillStyle='#5a2a24';ell(c,0,64,10,6);c.fill();}
  else{c.lineWidth=7;c.beginPath();c.moveTo(-26,62);c.quadraticCurveTo(0,72,26,62);c.stroke();}
  c.restore();}
/* сбоку в воде: голова над водой, тело и ноги под водой */
function swimmer(c,x,y,s,t,o={}){c.save();c.translate(x,y);c.scale(s,s);const k=t*(o.fast?9:4.2);
  // ноги (дальняя темнее)
  for(const [ph,col] of [[Math.PI,'#b98463'],[0,PAL.skin2]]){const a=Math.sin(k+ph)*.35;cap(c,0,330,Math.sin(a)*180,330+Math.cos(a)*180,44,col);
    const fx=Math.sin(a)*180,fy=330+Math.cos(a)*180;cap(c,fx,fy,fx+Math.sin(a+.5)*150,fy+Math.cos(a+.5)*150,38,col);}
  c.fillStyle=PAL.trunk;rr(c,-62,250,124,110,26);c.fill();c.fillStyle=PAL.trunk2;c.fillRect(-62,250,124,16);
  c.fillStyle=PAL.skin2;rr(c,-70,90,140,190,50);c.fill();
  for(const [ph,col,sx] of [[Math.PI,'#b98463',-1],[0,PAL.skin2,1]]){const a=Math.sin(k*1.2+ph)*.6;const ex=sx*120+Math.cos(a)*40,ey=150+Math.sin(a)*60;
    cap(c,sx*50,120,ex,ey,34,col);cap(c,ex,ey,ex+sx*80+Math.cos(a*2)*30,ey+Math.sin(a*2)*70,30,col);}
  c.restore();}
function swimTop(c,x,y,s,ang,t,o={}){c.save();c.translate(x,y);c.rotate(ang);c.scale(s,s);const k=t*(o.fast?10:4);
  for(const sd of [-1,1]){const a=Math.sin(k+(sd>0?0:Math.PI))*.3;cap(c,sd*22,60,sd*30+Math.sin(a)*40,170,30,PAL.skin2);}
  c.fillStyle=PAL.trunk;rr(c,-36,30,72,50,16);c.fill();
  for(const sd of [-1,1]){const a=Math.sin(k*1.1+(sd>0?0:Math.PI))*.9;cap(c,sd*40,-8,sd*(95+Math.cos(a)*20),-30+Math.sin(a)*50,26,PAL.skin2);}
  c.fillStyle=PAL.skin2;ell(c,0,10,48,36);c.fill();c.fillStyle=PAL.hair;ell(c,0,-34,34,32);c.fill();
  if(o.splash){for(let i=0;i<14;i++){const an=i/14*TAU+t*3,r=90+((t*260+i*40)%120);dot(c,Math.cos(an)*r,Math.sin(an)*r*.8,9,'rgba(230,248,255,.9)');}}
  c.restore();}
function ripples(c,x,y,t,n,col){for(let i=0;i<n;i++){const ph=((t*.6+i/n)%1);c.strokeStyle=col||`rgba(220,245,255,${.5*(1-ph)})`;c.lineWidth=4;c.beginPath();c.ellipse(x,y,40+ph*200,30+ph*150,0,0,TAU);c.stroke();}}

/* ---------- акула ---------- */
function shark(c,x,y,s,t,o={}){c.save();c.translate(x,y);c.scale(o.flip?-s:s,s);c.rotate(o.rot||0);const sw=Math.sin(t*(o.sp||3))*(o.sway===undefined?.12:o.sway),mo=o.mouth||0;
  const body=new Path2D();body.moveTo(330,0);body.bezierCurveTo(330,-40,260,-78,150,-84);body.bezierCurveTo(30,-90,-150,-60,-270,-16+sw*40);
  body.lineTo(-270,16+sw*40);body.bezierCurveTo(-150,60,40,96,150,88);body.bezierCurveTo(240,84,300,60,320,26+mo*60);
  if(mo>0){body.lineTo(250,40+mo*30);body.lineTo(312,18);}body.closePath();
  // хвост
  c.fillStyle=PAL.sk2;c.save();c.translate(-262,sw*40);c.rotate(sw*1.4);c.beginPath();c.moveTo(10,-12);c.quadraticCurveTo(-60,-90,-120,-190);c.quadraticCurveTo(-70,-60,-40,0);c.quadraticCurveTo(-80,60,-110,120);c.quadraticCurveTo(-40,60,10,14);c.closePath();c.fill();c.restore();
  // плавники
  c.fillStyle=PAL.sk2;c.beginPath();c.moveTo(90,-80);c.quadraticCurveTo(20,-210,-40,-230);c.quadraticCurveTo(-20,-140,-60,-70);c.closePath();c.fill();
  c.beginPath();c.moveTo(-160,-50);c.lineTo(-200,-96);c.lineTo(-195,-44);c.closePath();c.fill();
  c.fillStyle=PAL.sk;c.fill(body);
  c.save();c.clip(body);c.fillStyle=PAL.skB;c.beginPath();c.moveTo(340,14);c.bezierCurveTo(240,30,60,44,-280,10);c.lineTo(-280,200);c.lineTo(340,200);c.closePath();c.fill();
  c.fillStyle='rgba(255,255,255,.12)';c.beginPath();c.ellipse(120,-60,160,18,-.05,0,TAU);c.fill();c.restore();
  if(mo>0){c.fillStyle='#4a1a20';c.beginPath();c.moveTo(316,22);c.lineTo(240,36+mo*28);c.lineTo(300,26+mo*60);c.closePath();c.fill();
    c.fillStyle='#fff';for(let i=0;i<5;i++){const a=i/5;c.beginPath();c.moveTo(lp(306,250,a),lp(24,36+mo*28,a));c.lineTo(lp(306,250,a)-6,lp(24,36+mo*28,a)+14*mo);c.lineTo(lp(306,250,a)-12,lp(24,36+mo*28,a));c.fill();}}
  else{c.strokeStyle=PAL.gill;c.lineWidth=5;c.beginPath();c.moveTo(316,26);c.quadraticCurveTo(280,44,236,40);c.stroke();}
  c.fillStyle=PAL.sk2;c.beginPath();c.moveTo(150,40);c.quadraticCurveTo(110,140,40,190);c.quadraticCurveTo(80,110,70,46);c.closePath();c.fill();
  c.strokeStyle=PAL.gill;c.lineWidth=6;for(let i=0;i<5;i++){const gx=200-i*22;c.beginPath();c.moveTo(gx,-34+i*2);c.quadraticCurveTo(gx-12,0,gx-2,36);c.stroke();}
  dot(c,262,-18,13,'#0e1216');dot(c,265,-21,4,'rgba(255,255,255,.8)');
  c.restore();}
function sharkTop(c,x,y,s,ang,t,o={}){c.save();c.translate(x,y);c.rotate(ang);c.scale(s,s);const sw=Math.sin(t*3)*.25;
  c.fillStyle=o.col||'rgba(5,20,40,.55)';c.beginPath();c.moveTo(0,-300);c.bezierCurveTo(60,-260,70,-80,50,40);c.quadraticCurveTo(30+sw*20,180,sw*60,260);c.quadraticCurveTo(-30+sw*20,180,-50,40);c.bezierCurveTo(-70,-80,-60,-260,0,-300);c.fill();
  c.beginPath();c.moveTo(45,-90);c.quadraticCurveTo(170,-30,200,40);c.quadraticCurveTo(120,0,40,-20);c.fill();c.beginPath();c.moveTo(-45,-90);c.quadraticCurveTo(-170,-30,-200,40);c.quadraticCurveTo(-120,0,-40,-20);c.fill();
  c.save();c.translate(sw*60,260);c.rotate(sw);c.beginPath();c.moveTo(0,-20);c.quadraticCurveTo(60,40,90,110);c.quadraticCurveTo(20,70,0,40);c.quadraticCurveTo(-20,70,-90,110);c.quadraticCurveTo(-60,40,0,-20);c.fill();c.restore();c.restore();}
function sharkFront(c,x,y,s,t,o={}){c.save();c.translate(x,y);c.scale(s,s);const mo=o.mouth||0;
  c.fillStyle=PAL.sk2;c.beginPath();c.moveTo(-180,40);c.quadraticCurveTo(-420,160,-470,260);c.quadraticCurveTo(-300,200,-150,120);c.fill();c.beginPath();c.moveTo(180,40);c.quadraticCurveTo(420,160,470,260);c.quadraticCurveTo(300,200,150,120);c.fill();
  c.beginPath();c.moveTo(-40,-170);c.quadraticCurveTo(0,-420,60,-440);c.quadraticCurveTo(30,-300,60,-160);c.fill();
  c.fillStyle=PAL.sk;c.beginPath();c.moveTo(0,-200);c.bezierCurveTo(170,-200,270,-60,250,60);c.bezierCurveTo(230,190,120,250,0,250);c.bezierCurveTo(-120,250,-230,190,-250,60);c.bezierCurveTo(-270,-60,-170,-200,0,-200);c.fill();
  c.fillStyle=PAL.skB;c.beginPath();c.moveTo(-240,90);c.bezierCurveTo(-120,40,120,40,240,90);c.bezierCurveTo(200,200,110,250,0,250);c.bezierCurveTo(-110,250,-200,200,-240,90);c.fill();
  c.fillStyle='#4a1a20';c.beginPath();c.ellipse(0,120+mo*20,150,10+mo*70,0,0,TAU);c.fill();
  if(mo>.05){c.fillStyle='#fff';for(let i=-6;i<=6;i++){const xx=i*22,yy=120+mo*20-(10+mo*70)*Math.sqrt(Math.max(0,1-(xx/150)**2));c.beginPath();c.moveTo(xx-9,yy);c.lineTo(xx,yy+18*mo+4);c.lineTo(xx+9,yy);c.fill();
    const y2=120+mo*20+(10+mo*70)*Math.sqrt(Math.max(0,1-(xx/150)**2));c.beginPath();c.moveTo(xx-9,y2);c.lineTo(xx,y2-18*mo-4);c.lineTo(xx+9,y2);c.fill();}}
  for(const sx of [-1,1]){dot(c,sx*205,-10,16,'#0e1216');dot(c,sx*208,-14,5,'rgba(255,255,255,.8)');dot(c,sx*60,30,7,PAL.gill);}
  c.restore();}

/* ---------- выноски, значки, HUD ---------- */
function callout(c,txt0,px,py,lx,ly,k,o={}){if(k<=0)return;const a=cl(k*3),sc=.7+.3*E.outB(cl(k*2.5));c.save();c.globalAlpha=a;
  c.strokeStyle=o.col||PAL.red;c.lineWidth=4;c.beginPath();c.moveTo(px,py);c.lineTo(lp(px,lx,cl(k*3)),lp(py,ly,cl(k*3)));c.stroke();
  ring(c,px,py,14+6*Math.sin(k*8),a,o.col||PAL.red,5);c.globalAlpha=a;dot(c,px,py,6,o.col||PAL.red);
  c.translate(lx,ly);c.scale(sc,sc);c.font='800 34px Mont';const w=c.measureText(txt0).width+70;
  c.fillStyle='rgba(16,18,24,.92)';rr(c,-w/2,-30,w,60,30);c.fill();c.strokeStyle=o.col||PAL.red;c.lineWidth=4;rr(c,-w/2,-30,w,60,30);c.stroke();
  dot(c,-w/2+28,0,7,o.col||PAL.red);txt(c,txt0,12,2,{font:'800 34px Mont',fill:'#fff'});c.restore();}
function card(c,x,y,w,h,k){const a=cl(k*3),s=.85+.15*E.outB(cl(k*2.5));c.save();c.globalAlpha=a;c.translate(x,y);c.scale(s,s);c.fillStyle='rgba(12,20,32,.86)';rr(c,-w/2,-h/2,w,h,34);c.fill();c.strokeStyle='rgba(255,255,255,.14)';c.lineWidth=3;rr(c,-w/2,-h/2,w,h,34);c.stroke();c.restore();}

/* ---------- мир плана ---------- */
const WD={};
WD.swim=(c,lt,o,t)=>{const WL=980+Math.sin(t*1.3)*8;sky(c,WL);waves(c,t,WL-6,'#3a6f96',10,90,1.2);
  c.save();c.beginPath();c.rect(-300,WL,W+600,H);c.clip();underwater(c,t,{top:'#2b6a93',ray:.06});
  if(o.sh!==undefined){const k=cl(lt/o.sh);sharkTop(c,lp(-500,1500,k),1500,1.3,Math.PI/2,t,{col:'rgba(2,10,22,.5)'});}
  swimmer(c,540,WL-60,1.05,t);c.restore();
  c.save();c.beginPath();c.rect(-300,-300,W+600,WL+300);c.clip();face(c,540,WL-150,.95,{ex:o.ex||'calm',look:o.look||[.3,0],wet:1});c.restore();
  c.fillStyle='rgba(220,245,255,.6)';for(let x=-200;x<W+300;x+=46){const y=WL+Math.sin(x/90+t*1.2)*10;c.fillRect(x,y-2,26,4);}
  c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=6;c.beginPath();c.ellipse(540,WL,170,22,0,0,TAU);c.stroke();};
WD.bump=(c,lt,o,t)=>{underwater(c,t,{top:'#23628c'});c.fillStyle='rgba(255,255,255,.08)';c.fillRect(-300,-300,W+600,360);
  const hit=o.hit||99,k=cl((lt-.1)/(hit-.1));c.save();c.translate(560,520);c.scale(1.6,1.6);c.rotate(.12);c.fillStyle=PAL.skin2;rr(c,-80,-260,160,200,60);c.fill();
  for(const [ph,col] of [[Math.PI,'#b98463'],[0,PAL.skin2]]){const a=Math.sin(t*4+ph)*.35;cap(c,0,0,Math.sin(a)*190,Math.cos(a)*190,48,col);const fx=Math.sin(a)*190,fy=Math.cos(a)*190;cap(c,fx,fy,fx+Math.sin(a+.5)*160,fy+Math.cos(a+.5)*160,42,col);}
  c.fillStyle=PAL.trunk;rr(c,-76,-90,152,110,30);c.fill();c.fillStyle=PAL.trunk2;c.fillRect(-76,-90,152,14);c.restore();
  const sx=lp(-420,300,E.inQ(k))+(lt>hit?-40*Math.exp(-(lt-hit)*4):0);shark(c,sx,1140,1.25,t,{rot:-.18,sp:5});
  if(lt>hit){const u=lt-hit;for(let i=0;i<3;i++)ring(c,700,880,40+u*500+i*60,cl(1-u*1.6),'#fff',8);}
  bubbles(c,t,300,900,600,1500,16,2);};
WD.face=(c,lt,o,t)=>{sky(c,1200);waves(c,t,1180,'#3a6f96',14,80,1.2);c.fillStyle='#22557c';c.fillRect(-300,1260,W+600,H);
  face(c,540,1000,2.6,{ex:'wide',look:[Math.sin(t*3)*.6,.6],wet:1});waves(c,t*1.1,1230,'#2e6a93',22,70,1.6);
  for(let i=0;i<8;i++){const ph=(t*.9+H1(i))%1;dot(c,300+H1(i*3)*480,820+ph*260,7,`rgba(200,235,255,${1-ph})`);}};
WD.top=(c,lt,o,t)=>{c.fillStyle=lg(c,0,0,0,H,[[0,'#2b6d96'],[1,'#123c60']]);c.fillRect(-300,-300,W+600,H+600);
  c.strokeStyle='rgba(255,255,255,.07)';c.lineWidth=3;for(let i=0;i<30;i++){const y=(i*80+t*20)%2200-140;c.beginPath();for(let x=-200;x<1300;x+=40)c.lineTo(x,y+Math.sin(x/70+i)*10);c.stroke();}
  const k=o.k===undefined?cl(lt/o.d):o.k,meas=o.m===undefined?0:cl((lt-o.m)*3);sharkTop(c,lp(-300,1400,k),lp(1300,700,k),1.5,Math.atan2(-600,1700)+Math.PI/2,t);
  ripples(c,540,900,t,3);swimTop(c,540,900,.9,0,t);
  if(meas>0){const m=meas;c.globalAlpha=m;c.strokeStyle=PAL.yel;c.lineWidth=5;const sx=lp(-300,1400,k),sy=lp(1300,700,k);c.save();c.translate(sx,sy);c.rotate(Math.atan2(-600,1700));
    c.beginPath();c.moveTo(-330,-150);c.lineTo(330,-150);c.moveTo(-330,-170);c.lineTo(-330,-130);c.moveTo(330,-170);c.lineTo(330,-130);c.stroke();txt(c,'≈ 3 м',0,-200,{font:'800 52px Mont',fill:PAL.yel,sw:8,stroke:'#0a1a2a'});c.restore();
    c.beginPath();c.moveTo(440,780);c.lineTo(440,1060);c.stroke();txt(c,'1,8 м',360,920,{font:'800 44px Mont',fill:'#fff',sw:8,stroke:'#0a1a2a'});c.globalAlpha=1;}};
WD.wide=(c,lt,o,t)=>{const HZ=520;sky(c,HZ);c.fillStyle='#d8b07a';c.beginPath();c.moveTo(-300,HZ);for(let x=-300;x<=1400;x+=60)c.lineTo(x,HZ-8+Math.sin(x/200)*6);c.lineTo(1400,HZ+50);c.lineTo(-300,HZ+50);c.fill();
  c.fillStyle='#2c2a3c';for(const px of [170,880]){c.fillRect(px,HZ-90,8,85);c.beginPath();c.moveTo(px+4,HZ-90);for(let i=0;i<5;i++){const a=-Math.PI+i*Math.PI/4;c.lineTo(px+4+Math.cos(a)*55,HZ-90+Math.sin(a)*22+18);c.lineTo(px+4,HZ-90);}c.fill();}
  txt(c,'НИКОГО',540,HZ-60,{font:'800 34px Mont',fill:'rgba(255,255,255,.85)',a:cl((lt-.5)*2)});
  waves(c,t,HZ+40,'#3d7aa1',6,60,1);waves(c,t,HZ+90,'#2f6a92',8,90,1.1);c.fillStyle=lg(c,0,HZ+100,0,H,[[0,'#2b628b'],[1,'#123a5c']]);c.fillRect(-300,HZ+120,W+600,H);
  for(let i=0;i<40;i++){const y=HZ+140+i*30+(t*20%30),x=(H1(i)*1300+t*15*(i%2?1:-1))%1300-100;c.fillStyle='rgba(255,255,255,.12)';c.fillRect(x,y,60+40*H1(i*2),4);}
  ripples(c,540,1080,t,2);face(c,540,1050,.5,{ex:'wide',look:[0,-1],wet:1});
  const k=cl((lt-.25)/1.1);if(k>0){c.save();c.setLineDash([22,18]);c.lineDashOffset=-t*60;c.strokeStyle=PAL.yel;c.lineWidth=7;c.beginPath();c.moveTo(540,980);c.lineTo(540,lp(980,HZ+30,k));c.stroke();c.restore();
    txt(c,'40 м',690,780,{font:'900 84px Mont',fill:PAL.yel,sw:12,stroke:'#0a1a2a',a:cl((k-.4)*4)});}};
WD.splash=(c,lt,o,t)=>{WD.swim(c,lt,{ex:'grit',look:[0,0]},t);const s=1;for(let i=0;i<26;i++){const ph=((t*1.6+H1(i))%1),an=-Math.PI/2+(H1(i*3)-.5)*2.4,r=ph*360;dot(c,540+Math.cos(an)*r*1.4,960+Math.sin(an)*r,10*(1-ph)+4,'rgba(235,250,255,.9)');}
  if(o.x!==undefined)stamp(c,540,980,1.6*E.outB(cl((lt-o.x)*4)),cl((lt-o.x)*5));};
WD.sound=(c,lt,o,t)=>{underwater(c,t);c.fillStyle='#3a7aa3';c.fillRect(-300,-300,W+600,420);waves(c,t,130,'#2b6a93',10,80,1.4);
  for(let i=0;i<12;i++){const ph=((t*.8+i/12)%1);c.strokeStyle=`rgba(255,210,63,${.7*(1-ph)})`;c.lineWidth=6;c.beginPath();c.arc(300,140,60+ph*1500,0.05*Math.PI,.55*Math.PI);c.stroke();}
  swimTop(c,300,150,.55,Math.PI,t,{fast:1,splash:1});
  const k=cl(lt/2.6);shark(c,lp(1500,880,E.outQ(k)),1500,.85,t,{flip:true,rot:lp(0,.35,k),sp:4});
  if(o.fish){const f=cl((lt-o.fish)*3);c.save();c.globalAlpha=f;c.translate(600,860);c.rotate(Math.sin(t*14)*.35);c.fillStyle='#c9d6de';ell(c,0,0,60,26);c.fill();c.beginPath();c.moveTo(-50,0);c.lineTo(-95,-30);c.lineTo(-95,30);c.fill();dot(c,30,-6,6,'#111');c.restore();
    callout(c,'РАНЕНАЯ РЫБА?',600,860,640,700,f);}};
WD.approach=(c,lt,o,t)=>{underwater(c,t,{top:'#1b5175'});const k=cl(lt/(o.d||2));c.save();c.globalAlpha=.25+.75*k;shark(c,lp(260,520,k),lp(1050,980,k),lp(.6,1.5,E.inQ(k)),t,{flip:true,rot:.05});c.restore();
  c.fillStyle=`rgba(4,17,31,${.6*(1-k)})`;c.fillRect(-300,-300,W+600,H+600);bubbles(c,t,0,1080,300,1700,10,5);};
WD.turn=(c,lt,o,t)=>{WD.top(c,lt,{k:.38},t);};
WD.turnTop=(c,lt,o,t)=>{c.fillStyle=lg(c,0,0,0,H,[[0,'#2b6d96'],[1,'#123c60']]);c.fillRect(-300,-300,W+600,H+600);const rot=lp(0,-2.2,ez(cl(lt/1.1)));
  sharkTop(c,250,1350,1.4,-.4+Math.sin(t*.6)*.1,t);ripples(c,540,900,t,3);swimTop(c,540,900,.9,rot,t);
  c.save();c.setLineDash([18,16]);c.lineDashOffset=-t*50;c.strokeStyle=PAL.yel;c.lineWidth=5;c.globalAlpha=cl((lt-1)*3);c.beginPath();c.moveTo(500,950);c.lineTo(290,1280);c.stroke();c.restore();};
WD.eyes=(c,lt,o,t)=>{underwater(c,t,{top:'#22608a'});face(c,300,960,1.5,{ex:'puff',look:[1,0]});bubbles(c,t,250,380,500,860,6,9);
  shark(c,820,1000,1.05,t,{flip:true,sway:.05,sp:2});
  const k=cl((lt-.3)*2.5);c.save();c.setLineDash([20,16]);c.lineDashOffset=-t*60;c.strokeStyle=PAL.yel;c.lineWidth=6;c.globalAlpha=k;c.beginPath();c.moveTo(372,950);c.lineTo(lp(372,545,k),lp(950,980,k));c.stroke();c.restore();
  callout(c,'ГЛАЗА В ГЛАЗА',545,980,540,700,cl((lt-.7)*2),{col:PAL.yel});};
WD.ambush=(c,lt,o,t)=>{underwater(c,t,{top:'#1a4d73'});c.fillStyle='rgba(2,8,16,.5)';c.fillRect(-300,1150,W+600,1200);
  swimmer(c,600,520,.55,t);face(c,600,455,.42,{ex:'calm',look:[o.seen?-.8:1,o.seen?1:-.2]});
  const seen=o.seen,k=seen?cl(lt/1.4):cl(lt/2.4),sx=seen?lp(300,-200,E.inQ(k)):lp(-100,330,k),sy=seen?lp(1200,1500,k):lp(1650,1250,k);
  shark(c,sx,sy,.75,t,{rot:seen?.5:-.45,flip:seen});
  if(!seen){c.save();c.setLineDash([16,14]);c.strokeStyle=PAL.red;c.lineWidth=5;c.globalAlpha=.8;c.beginPath();c.moveTo(sx+200,sy-90);c.quadraticCurveTo(520,980,590,760);c.stroke();c.restore();callout(c,'ЗАСАДА СНИЗУ',sx+120,sy-60,700,1640,cl((lt-.4)*2));}
  else{check(c,780,1180,1.3*E.outB(cl(lt*3)),cl(lt*4));}};
WD.back=(c,lt,o,t)=>{c.fillStyle=lg(c,0,0,0,H,[[0,'#3b86ad'],[.25,'#2b6d96'],[1,'#123c60']]);c.fillRect(-300,-300,W+600,H+600);
  c.fillStyle='#d8b07a';c.fillRect(-300,-300,W+600,420);c.fillStyle='rgba(255,255,255,.8)';for(let x=-300;x<1400;x+=30)c.fillRect(x,110+Math.sin(x/60+t*2)*10,24,8);
  const k=cl(lt/3),y=lp(1000,820,k);sharkTop(c,560+Math.sin(t*.7)*60,1500,1.3,Math.sin(t*.7)*.2,t);ripples(c,540,y,t,2);swimTop(c,540,y,.85,Math.PI,t);
  c.save();c.globalAlpha=.9;for(let i=0;i<3;i++){const yy=y-150-i*70-((t*120)%70);c.strokeStyle=PAL.yel;c.lineWidth=8;c.beginPath();c.moveTo(500,yy+30);c.lineTo(540,yy);c.lineTo(580,yy+30);c.stroke();}c.restore();
  if(o.x!==undefined){const u=cl((lt-o.x)*3);card(c,850,640,300,300,u);if(u>0){c.save();c.globalAlpha=u;swimTop(c,850,640,.5,0,t);stamp(c,850,640,1,u);c.restore();}callout(c,'СПИНОЙ — НИКОГДА',850,790,560,1640,cl((lt-o.x-.2)*2));}};
WD.circle=(c,lt,o,t)=>{c.fillStyle=lg(c,0,0,0,H,[[0,'#2b6d96'],[1,'#0f3556']]);c.fillRect(-300,-300,W+600,H+600);const R=380,an=t*1.3;
  c.save();c.setLineDash([24,20]);c.lineDashOffset=-t*80;c.strokeStyle='rgba(255,77,77,.7)';c.lineWidth=6;c.beginPath();c.arc(540,960,R,0,TAU);c.stroke();c.restore();
  sharkTop(c,540+Math.cos(an)*R,960+Math.sin(an)*R,1.05,an+Math.PI,t);ripples(c,540,960,t,3);swimTop(c,540,960,.8,an-Math.PI/2+Math.PI,t);};
WD.bb=(c,lt,o,t)=>{underwater(c,t,{top:'#1a4d73'});card(c,540,760,980,640,cl(lt*3));const u=cl(lt*3);c.save();c.globalAlpha=u;c.translate(0,-200);
  txt(c,'1',120,710,{font:'900 64px Mont',fill:PAL.yel});txt(c,'ТОЛЧОК',290,1180,{font:'800 48px Mont',fill:'#fff'});
  c.save();c.translate(290,960);c.scale(.62,.62);c.fillStyle=PAL.trunk;rr(c,-130,-330,140,90,24);c.fill();cap(c,-90,-250,-50,40,58,PAL.skin2);cap(c,-50,40,-20,260,50,PAL.skin2);shark(c,-300+Math.sin(t*5)*22,170,.75,t,{rot:-.35});c.restore();
  const k2=cl((lt-(o.s2||1))*2.5);c.globalAlpha=u*cl(k2*2);c.strokeStyle='#fff';c.lineWidth=8;c.beginPath();c.moveTo(480,960);c.lineTo(600,960);c.lineTo(575,935);c.moveTo(600,960);c.lineTo(575,985);c.stroke();
  txt(c,'2',640,710,{font:'900 64px Mont',fill:PAL.red});txt(c,'УКУС',800,1180,{font:'800 48px Mont',fill:PAL.red});
  c.save();c.translate(800,960);c.scale(.6,.6);sharkFront(c,0,0,1,t,{mouth:.5+.5*Math.sin(t*6)*k2});c.restore();c.restore();};
WD.charge=(c,lt,o,t)=>{underwater(c,t,{top:'#1b5378'});const k=cl(lt/(o.d||2.4));c.save();c.translate(540+Math.sin(t*20)*4*k,980);sharkFront(c,0,0,lp(.5,1.35,E.inQ(k)),t,{mouth:cl((k-.5)*2)*.8});c.restore();bubbles(c,t,0,1080,600,1700,12,7);};
WD.nose=(c,lt,o,t)=>{underwater(c,t,{top:'#1b5378'});sharkFront(c,540,960,1.6,t,{mouth:.85});
  stamp(c,540,820,.8*E.outB(cl((lt-.1)*4)),cl(lt*5));callout(c,'НОС',540,820,280,560,cl((lt-.05)*2));callout(c,'ПАСТЬ',540,1180,800,1500,cl((lt-(o.p||.6))*2));};
WD.targets=(c,lt,o,t)=>{underwater(c,t,{top:'#1b5378'});shark(c,420,980,1.9,t,{sway:.04,sp:2});const ex=420+262*1.9,ey=980-18*1.9,gx=420+160*1.9,gy=980;
  for(const [x,y,d] of [[ex,ey,0],[gx,gy,o.g||.5]]){const k=cl((lt-d)*3);if(k<=0)continue;for(let i=0;i<3;i++)ring(c,x,y,30+i*26+Math.sin(t*6)*4,k*(1-i*.25),PAL.red,6);}
  callout(c,'ГЛАЗ',ex,ey,860,640,cl(lt*2));callout(c,'ЖАБРЫ',gx,gy+40,360,1640,cl((lt-(o.g||.5))*2));};
WD.dead=(c,lt,o,t)=>{underwater(c,t,{top:'#1b5378'});c.save();c.translate(540,930);c.rotate(Math.sin(t*.8)*.08);c.globalAlpha=.85;swimmer(c,0,-200,.9,0);c.restore();
  face(c,540,700,.85,{ex:'dazed',look:[0,1]});stamp(c,540,960,2.2*E.outB(cl((lt-.25)*4)),cl((lt-.2)*5));};
WD.hit=(c,lt,o,t)=>{underwater(c,t,{top:'#1b5378'});const hs=o.hits||[0],last=hs.filter(h=>lt>=h).pop(),u=last===undefined?9:lt-last,gone=o.go!==undefined&&lt>o.go;
  if(!gone){const sh=u<.3?Math.sin(u*80)*30*(1-u/.3):0;shark(c,520+sh,1000,1.6,t,{rot:u<.3?-.15:0,sway:.05});}
  else{const g=lt-o.go;shark(c,lp(520,-900,E.inQ(cl(g/1.2))),lp(1000,1250,g),1.6,t,{flip:true,sp:9,rot:.1});}
  if(u<.45&&!gone){const k=u/.45;c.save();c.translate(940,940);c.scale(1+k*.5,1+k*.5);c.globalAlpha=1-k;c.fillStyle=PAL.yel;c.beginPath();for(let i=0;i<16;i++){const r=i%2?60:150,a=i/16*TAU;c.lineTo(Math.cos(a)*r,Math.sin(a)*r);}c.fill();
    txt(c,'УДАР',0,0,{font:'900 56px Mont',fill:'#1a1a1a'});c.restore();}};
WD.beach=(c,lt,o,t)=>{sky(c,880);c.fillStyle='#2e6a92';c.fillRect(-300,860,W+600,300);waves(c,t,900,'#3d7aa1',8,70,1.4);
  c.fillStyle=lg(c,0,1080,0,H,[[0,'#c9a06c'],[1,'#8c6a46']]);c.fillRect(-300,1100,W+600,H);c.fillStyle='rgba(255,255,255,.75)';
  for(let i=0;i<3;i++){const ph=(t*.35+i/3)%1;c.globalAlpha=1-ph;c.beginPath();for(let x=-300;x<=1400;x+=30)c.lineTo(x,1100+ph*90+Math.sin(x/50+i)*8);c.lineTo(1400,1100);c.lineTo(-300,1100);c.fill();}c.globalAlpha=1;
  const m=o.mode||'crawl';
  if(m==='crawl'){const k=cl(lt/2.4),x=lp(380,560,k);c.save();c.translate(x,1300);c.rotate(-.12);c.fillStyle=PAL.skin2;rr(c,-200,-60,260,110,50);c.fill();c.fillStyle=PAL.trunk;rr(c,-280,-50,120,96,30);c.fill();
    cap(c,-280,0,-520,30,46,PAL.skin2);cap(c,-290,20,-500,80,42,'#b98463');const a=Math.sin(t*5)*.3;cap(c,40,10,140+Math.cos(a)*30,120,36,PAL.skin2);c.restore();face(c,x+150,1210,.75,{ex:'pain',look:[1,.2],wet:1});}
  else{const f=o.fall!==undefined?E.inQ(cl((lt-o.fall)/.35)):0,fs=.8,fp=-f*1.3;c.save();c.translate(800,1640);c.rotate(fp);c.scale(fs,fs);
    cap(c,-36,0,-30,-320,46,'#b98463');cap(c,36,0,40,-320,46,PAL.skin2);c.fillStyle=PAL.trunk;rr(c,-80,-420,160,120,30);c.fill();c.fillStyle=PAL.skin2;rr(c,-90,-700,180,300,60);c.fill();
    cap(c,-80,-650,-140+Math.sin(t*3)*10,-430,34,'#b98463');cap(c,80,-650,150,-430,34,PAL.skin2);c.restore();
    const hx=800+Math.sin(fp)*800*fs,hy=1640-Math.cos(fp)*800*fs;face(c,hx,hy,.72*fs,{ex:f>.6?'dazed':'pain',look:[.5,0],wet:1});
    if(f>.9){c.fillStyle='rgba(255,255,255,.7)';for(let i=0;i<10;i++){const a=i/10*Math.PI;dot(c,hx+Math.cos(a)*120*(lt-o.fall),hy+60-Math.sin(a)*60*(lt-o.fall),6,'rgba(220,190,140,.8)');}}}};
function leg(c,t,o={}){c.save();c.fillStyle=lg(c,0,800,0,1200,[[0,'#d3a874'],[1,'#a8825a']]);c.fillRect(-300,-300,W+600,H+600);
  for(let i=0;i<60;i++){c.fillStyle='rgba(120,90,60,.25)';c.fillRect(H1(i)*1100,H1(i*3)*1920,4,4);}
  const blue=o.blue||0,col=`rgb(${lp(241,170,blue)|0},${lp(192,180,blue)|0},${lp(154,200,blue)|0})`,col2=`rgb(${lp(212,140,blue)|0},${lp(154,150,blue)|0},${lp(116,175,blue)|0})`;
  c.save();c.translate(620,1120);c.rotate(-.5);const LG=new Path2D();LG.moveTo(-135,-820);LG.bezierCurveTo(-145,-420,-108,-130,-90,-40);LG.bezierCurveTo(-112,120,-110,270,-72,520);LG.bezierCurveTo(-62,600,-60,640,-62,680);
  LG.bezierCurveTo(-74,770,-40,840,12,846);LG.bezierCurveTo(74,850,96,800,72,700);LG.bezierCurveTo(60,640,58,600,64,520);LG.bezierCurveTo(102,300,110,120,86,-40);LG.bezierCurveTo(112,-170,135,-420,135,-820);LG.closePath();
  c.fillStyle=col;c.fill(LG);c.save();c.clip(LG);c.fillStyle=col2;c.beginPath();c.ellipse(120,0,70,900,0,0,TAU);c.fill();c.restore();c.strokeStyle='rgba(150,100,70,.35)';c.lineWidth=5;c.beginPath();c.arc(-6,-40,40,.4,2.6);c.stroke();
  c.fillStyle=PAL.trunk;rr(c,-170,-960,340,200,40);c.fill();c.fillStyle=PAL.trunk2;c.fillRect(-170,-790,340,14);
  const wy=-300;if(o.wound!==false){c.fillStyle='rgba(120,14,24,.9)';for(let i=0;i<11;i++){const a=-1.2+i*.24;ell(c,Math.sin(a)*120,wy+Math.cos(a)*-60,14,8,a);c.fill();}
    for(let i=0;i<11;i++){const a=-1.2+i*.24;ell(c,Math.sin(a)*110,wy+80+Math.cos(a)*40,14,8,-a);c.fill();}
    const fl=o.flow===undefined?1:o.flow;if(fl>0){c.fillStyle=`rgba(170,20,30,${.75*fl})`;for(let i=0;i<4;i++){const ph=(t*.8+i/4)%1;ell(c,-80+i*50,wy+120+ph*260,12,18+ph*10);c.fill();}}}
  if(o.belt!==undefined){const k=o.belt,y=-560;c.fillStyle='#5b3a22';c.fillRect(-150,y-34,300,68);c.fillStyle='#3e2715';c.fillRect(-150,y-34,300,10);
    c.fillStyle='#c9b37a';rr(c,-40,y-46,80,92,10);c.fill();c.fillStyle='#5b3a22';rr(c,-24,y-30,48,60,6);c.fill();
    c.fillStyle='#5b3a22';c.save();c.translate(40,y);c.rotate(-.2-k*.3);c.fillRect(0,-26,lp(180,280,k),52);c.restore();
    if(o.glow){c.strokeStyle=`rgba(255,60,60,${o.glow})`;c.lineWidth=16;c.strokeRect(-160,y-44,320,88);}}
  c.restore();c.restore();}
WD.leg=(c,lt,o,t)=>{leg(c,t,{flow:1});if(o.c1!==undefined)callout(c,'УКУС',500,880,780,620,cl((lt-o.c1)*2));
  if(o.adr!==undefined){const k=cl((lt-o.adr)*2);card(c,700,1640,560,220,k);if(k>0){c.save();c.globalAlpha=k;c.strokeStyle=PAL.red;c.lineWidth=7;c.beginPath();
    for(let x=0;x<480;x+=4){const ph=((x/480+t*1.5)%1),y=ph>.45&&ph<.5?-80:ph>.5&&ph<.55?60:0;c.lineTo(460+x,1640+y);}c.stroke();c.restore();}}};
WD.cause=(c,lt,o,t)=>{c.fillStyle=lg(c,0,0,0,H,[[0,'#1b1418'],[1,'#3a1218']]);c.fillRect(-300,-300,W+600,H+600);const u=cl(lt*3);card(c,540,760,920,640,u);c.save();c.globalAlpha=u;c.translate(0,-180);
  c.save();c.translate(300,900);c.scale(.5,.5);sharkFront(c,0,0,1,t,{mouth:.9});c.restore();txt(c,'ЗУБЫ',300,1180,{font:'800 44px Mont',fill:'#fff'});
  if(o.x!==undefined)stamp(c,300,900,1.3*E.outB(cl((lt-o.x)*4)),cl((lt-o.x)*5));
  const k=o.b===undefined?0:cl((lt-o.b)*2);const s=lp(.8,1.25,E.outB(k));c.save();c.translate(790,880);c.scale(s,s);c.fillStyle=PAL.red;c.beginPath();c.moveTo(0,-140);c.bezierCurveTo(30,-80,110,-10,110,60);c.arc(0,60,110,0,Math.PI);c.bezierCurveTo(-110,-10,-30,-80,0,-140);c.fill();
  c.fillStyle='rgba(255,255,255,.35)';ell(c,-45,60,18,40,.3);c.fill();c.restore();txt(c,'ПОТЕРЯ КРОВИ',790,1180,{font:'800 44px Mont',fill:k>0?PAL.red:'#fff'});
  if(k>0)txt(c,'ГЛАВНАЯ ПРИЧИНА',540,1360,{font:'900 56px Mont',fill:PAL.yel,a:k});c.restore();};
WD.belt=(c,lt,o,t)=>{const bk=o.tight===undefined?0:E.outB(cl((lt-o.tight)/.8));leg(c,t,{belt:bk,flow:1-bk});
  const k=cl(lt*2.5);callout(c,'НА ЛАДОНЬ ВЫШЕ',405,690,700,460,k,{col:PAL.yel});};
WD.watch=(c,lt,o,t)=>{c.fillStyle=lg(c,0,0,0,H,[[0,'#16202e'],[1,'#0a1018']]);c.fillRect(-300,-300,W+600,H+600);const u=cl(lt*3);c.save();c.globalAlpha=u;c.translate(540,940);
  c.fillStyle='#22262e';rr(c,-120,-470,240,940,60);c.fill();c.fillStyle='#0d0f13';rr(c,-230,-260,460,520,110);c.fill();c.fillStyle='#14303f';rr(c,-200,-230,400,460,90);c.fill();
  txt(c,'19:58',0,0,{font:'900 150px Mont',fill:'#fff'});const r=cl((lt-.4)*2);if(r>0){c.strokeStyle=PAL.yel;c.lineWidth=10;c.beginPath();c.ellipse(0,0,240,120,-.05,0,TAU*r);c.stroke();}c.restore();
  callout(c,'ЗАПОМНИ ВРЕМЯ',540,820,540,500,cl((lt-.3)*2),{col:PAL.yel});};
WD.phone=(c,lt,o,t)=>{c.fillStyle=lg(c,0,0,0,H,[[0,'#13202c'],[1,'#071018']]);c.fillRect(-300,-300,W+600,H+600);const u=cl(lt*4);c.save();c.translate(540,960+(1-E.outB(u))*300);c.globalAlpha=u;
  c.fillStyle='#0d1116';rr(c,-260,-520,520,1040,70);c.fill();c.fillStyle=lg(c,0,-500,0,500,[[0,'#1d3a48'],[1,'#0f2a22']]);rr(c,-236,-496,472,992,56);c.fill();
  txt(c,'112',0,-300,{font:'900 150px Mont',fill:'#fff'});const s=Math.floor(cl(lt)*0+lt);txt(c,'00:0'+Math.min(9,s),0,-190,{font:'700 44px Mont',fill:'rgba(255,255,255,.7)'});
  for(let i=0;i<3;i++){const ph=(t*.9+i/3)%1;ring(c,0,140,90+ph*170,(1-ph)*.6,'#3ddc84',5);}dot(c,0,140,90,'#2bb673');txt(c,'SOS',0,142,{font:'900 52px Mont',fill:'#fff'});c.restore();
  if(o.amb!==undefined){const k=cl((lt-o.amb)*3);const on=Math.floor(t*6)%2;c.save();c.globalAlpha=k;dot(c,330,560,40,on?'rgba(255,60,60,.9)':'rgba(60,120,255,.9)');dot(c,750,560,40,on?'rgba(60,120,255,.9)':'rgba(255,60,60,.9)');c.restore();callout(c,'СКОРАЯ ЕДЕТ',540,560,540,430,k,{col:PAL.grn});}};
WD.clock=(c,lt,o,t)=>{c.fillStyle=lg(c,0,0,0,H,[[0,'#101722'],[1,'#05080d']]);c.fillRect(-300,-300,W+600,H+600);const k=E.ioS(cl(lt/1.3));c.save();c.translate(540,900);
  c.fillStyle=PAL.cream;dot(c,0,0,330,'#1d2430');dot(c,0,0,300,PAL.cream);for(let i=0;i<12;i++){const a=i/12*TAU;cap(c,Math.cos(a)*250,Math.sin(a)*250,Math.cos(a)*280,Math.sin(a)*280,i%3?6:12,'#1d2430');}
  const m=k*20;cap(c,0,0,Math.cos(-Math.PI/2+m/60*TAU*20)*0+Math.sin(m/60*TAU)*220,-Math.cos(m/60*TAU)*220,12,'#1d2430');cap(c,0,0,Math.sin((58+m)/60*TAU*0+ (7+ (58+m)/60)/12*TAU)*150,-Math.cos((7+(58+m)/60)/12*TAU)*150,16,'#1d2430');
  c.fillStyle='rgba(255,77,77,.25)';c.beginPath();c.moveTo(0,0);c.arc(0,0,280,-Math.PI/2,-Math.PI/2+k*TAU/3);c.closePath();c.fill();dot(c,0,0,18,PAL.red);c.restore();
  txt(c,'+20 МИН',540,1640,{font:'900 96px Mont',fill:PAL.red,sw:10,stroke:'#05080d',a:cl(lt*3)});};
WD.blue=(c,lt,o,t)=>{const b=cl((lt+(o.b0||0))/2.2);leg(c,t,{belt:1,flow:0,blue:b,glow:o.glow!==undefined?cl((lt-o.glow)*2)*(.5+.5*Math.sin(t*10)):0});
  callout(c,'СИНЕЕТ',700,1300,800,1560,cl((lt-.3)*2),{col:'#7fb2ff'});callout(c,'НЕМЕЕТ',960,1720,560,1720,cl((lt-.9)*2),{col:'#7fb2ff'});};
WD.reach=(c,lt,o,t)=>{c.save();c.translate(540,960);c.scale(1.7,1.7);c.translate(-390,-700);leg(c,t,{belt:1,flow:0,blue:1,wound:false});c.restore();
  const k=cl(lt/(o.d||1.6)),hx=lp(1300,760,E.outC(k)),hy=lp(1500,1080,E.outC(k));c.save();c.translate(hx,hy);c.rotate(-.5);
  c.fillStyle=PAL.skin2;cap(c,0,0,420,180,110,PAL.skin2);c.fillStyle=PAL.skin;rr(c,-100,-70,170,150,60);c.fill();
  for(let i=0;i<4;i++){const fx=-90,fy=-60+i*38;cap(c,fx,fy,fx-80+Math.sin(t*3+i)*6,fy+10,32,PAL.skin);}cap(c,20,-60,-40,-110,32,PAL.skin2);c.restore();
  if(o.q!==undefined){const q=cl((lt-o.q)*2);txt(c,'?',540,560,{font:'900 260px Mont',fill:PAL.red,sw:14,stroke:'#120608',a:q*(.6+.4*Math.sin(t*8))});}};

/* ---------- раскадровка ---------- */
function plan(){const S=[];const add=(w,a,o={},cam=[[540,960,1],[540,960,1.07]],tin='pop')=>S.push({w,a,o,cam,tin});
  add('swim',0,{ex:'calm',sh:2.2},[[540,900,1.15],[540,930,1.05]],'cut');
  add('bump',wa(7),{hit:wa(9)-wa(7)},[[540,960,1],[560,900,1.12]]);
  add('face',wa(13),{},[[540,1000,1],[540,1000,1.1]]);
  add('top',wa(17),{d:wa(23)-wa(17)+1,m:wa(21)-wa(17)},[[540,960,1.05],[540,960,.95]]);
  add('wide',wa(23),{},[[540,900,1.18],[540,880,1]],'whip');
  add('splash',wa(29),{x:wa(31)-wa(29)},[[540,1000,1.1],[540,1000,1.2]]);
  add('sound',wa(39),{fish:wa(44)-wa(39)},[[540,960,1],[620,1000,1.08]]);
  add('approach',wa(46),{d:wa(49)-wa(46)},[[540,960,1],[540,980,1.15]]);
  add('turnTop',wa(49),{},[[540,1000,1.05],[540,1050,.98]],'whip');
  add('eyes',wa(57),{},[[540,960,1],[560,960,1.08]]);
  add('ambush',wa(61),{},[[540,1000,1],[480,1100,1.08]]);
  add('ambush',wa(65),{seen:1},[[480,1100,1.08],[540,1000,1]],'cut');
  add('back',wa(71),{x:wa(75)-wa(71)},[[540,1000,1.05],[540,950,1]],'whip');
  add('circle',wa(79),{},[[540,960,1.15],[540,960,1]]);
  add('bb',wa(82),{s2:wa(88)-wa(82)},[[540,960,1],[540,960,1.06]]);
  add('charge',wa(91),{d:wa(99)-wa(91)},[[540,980,1],[540,980,1.12]],'flash');
  add('nose',wa(99),{p:wa(103)-wa(99)},[[540,960,1],[540,980,1.06]]);
  add('targets',wa(106),{g:wa(110)-wa(106)},[[540,960,1.05],[560,980,1.12]]);
  add('dead',wa(112),{},[[540,960,1.1],[540,960,1]]);
  add('hit',wa(115),{hits:[0,wa(116)-wa(115)],go:wa(118)-wa(115)},[[620,980,1.15],[540,1000,1]],'flash');
  add('beach',wa(120),{mode:'crawl'},[[540,1250,1.2],[540,1200,1.05]],'whip');
  add('beach',wa(124),{mode:'stand',fall:wa(128)-wa(124)},[[600,1200,1.05],[560,1250,1.15]],'cut');
  add('leg',wa(130),{c1:.1,adr:wa(133)-wa(130)},[[540,1000,1.15],[560,1100,1.05]],'flash');
  add('cause',wa(137),{x:wa(146)-wa(137),b:wa(149)-wa(137)},[[540,960,1],[540,960,1.06]]);
  add('belt',wa(153),{tight:wa(158)-wa(153)},[[540,900,1],[540,900,1.1]]);
  add('watch',wa(163),{},[[540,940,1.1],[540,940,1.2]]);
  add('phone',wa(165),{amb:wa(168)-wa(165)},[[540,960,1],[540,960,1.06]]);
  add('clock',wa(170),{},[[540,960,1.1],[540,960,1]],'whip');
  add('blue',wa(173),{glow:wa(177)-wa(173)},[[540,960,1],[540,1000,1.12]]);
  add('reach',wa(183),{d:wa(186)-wa(183),q:wa(187)-wa(183)},[[540,960,1.05],[540,900,1.15]]);
  for(let i=0;i<S.length;i++)S[i].b=i+1<S.length?S[i+1].a:DUR;return S;}

/* ---------- субтитры ---------- */
const KW_R=['толкает','укусом','бей','пасть','крови','кровь','падаешь','ослабить','никогда','удар','нет.'],
      KW_Y=['тень','один','плескайся','раненой','лицом','глаз','засады','круг','глаза','жабры','мёртвым','песок','адреналин','ладонь','время','двенадцать','синеет','немеет','сорок'];
const nw=w=>w.toLowerCase().replace(/ё/g,'е').replace(/[^а-яa-z0-9.-]/g,'');
function buildSubs(){const W2=VO.words,out=[];let cur=[];const flush=()=>{if(cur.length)out.push(cur);cur=[];};
  for(let i=0;i<W2.length;i++){const w=W2[i];cur.push(i);const len=cur.map(j=>W2[j].w).join(' ').length,end=/[.:!?…,—]$/.test(w.w),nx=W2[i+1];
    if(cur.length>=3||len>16||end||(nx&&nx.s!==w.s))flush();}flush();
  const STICK=new Set(['и','а','но','в','к','с','на','до','под','из','изо','от','для','за','по','о','у','не','что','так','если','пока','после','прямо','совсем','ещё','еще','тот','перед','его','её','ее']);
  for(let k=0;k<out.length-1;k++){while(out[k].length>1){const last=out[k][out[k].length-1],ww=W2[last].w;if(/[.:!?…,—]$/.test(ww)||!STICK.has(nw(ww).replace(/[.-]/g,'')))break;out[k+1].unshift(out[k].pop());}}
  return out.map(g=>({a:W2[g[0]].a-.04,b:W2[g[g.length-1]].b+.12,ids:g}));}
function subs(c,t){const S=SUB.filter(s=>t>=s.a&&t<s.b+.25).pop();if(!S)return;const W2=VO.words,lt=t-S.a,sc=1+.06*Math.exp(-lt*20);
  const words=S.ids.map(i=>({i,s:W2[i].w.replace(/[«»"]/g,'').replace(/[:,;—]+$/,'').toUpperCase()}));c.save();c.font='900 92px Mont';
  const sp=24,lines=[];let line=[],lw=0;for(const w of words){const ww=c.measureText(w.s).width;if(line.length&&lw+sp+ww>900){lines.push([line,lw]);line=[];lw=0;}line.push(Object.assign(w,{ww}));lw+=(line.length>1?sp:0)+ww;}lines.push([line,lw]);
  const y0=1330-(lines.length-1)*52;c.translate(540,y0);c.scale(sc,sc);
  lines.forEach(([L,w],li)=>{let x=-w/2;for(const o of L){const on=t>=W2[o.i].a-.02,key=nw(W2[o.i].w);let col=on?'#ffffff':'rgba(200,204,212,.72)';
    if(on&&KW_R.some(k=>key.startsWith(k.replace('.',''))&&(k!=='нет.'||/\.$/.test(W2[o.i].w))))col=PAL.red;else if(on&&KW_Y.some(k=>key.startsWith(k)))col=PAL.yel;
    txt(c,o.s,x+o.ww/2,li*104,{font:'900 92px Mont',fill:col,sw:16,stroke:'rgba(8,10,14,.95)'});x+=o.ww+sp;}});c.restore();}

/* ---------- HUD ---------- */
const STORY=[[0,0],[2.7,40],[44.8,190],[63,470],[65.84,500],[67.2,1700],[80,1760]];
function storySec(t){for(let i=1;i<STORY.length;i++)if(t<=STORY[i][0]){const [a0,v0]=STORY[i-1],[a1,v1]=STORY[i];return lp(v0,v1,(t-a0)/(a1-a0));}return STORY[STORY.length-1][1];}
const RULES=[[29,'НЕ ПЛЕСКАЙСЯ'],[49,'СМОТРИ НА НЕЁ'],[91,'БЕЙ В ГЛАЗА'],[137,'СНАЧАЛА КРОВЬ']];
function hud(c,t){c.save();
  // стикер
  const loc=t<wa(120)?'Море, один':'Пляж, один',ss=storySec(t),mm=52+Math.floor(ss/60),hh=19+Math.floor(mm/60),clk=`${hh}:${String(mm%60).padStart(2,'0')}`;
  c.save();c.translate(170,120);c.rotate(-.035);c.fillStyle='rgba(0,0,0,.35)';c.fillRect(-118,-66,250,150);c.fillStyle='#f6e27a';c.fillRect(-125,-74,250,150);c.fillStyle='rgba(255,255,255,.45)';c.fillRect(-40,-86,80,24);
  txt(c,loc,0,-28,{font:'700 40px Cav',fill:'#2a2418'});txt(c,clk,-6,26,{font:'700 64px Cav',fill:'#2a2418'});c.restore();
  // таймер
  const dang=(t>wa(9)&&t<wa(119))||t>wa(130),col=dang?PAL.red:t>wa(119)?PAL.yel:'#ffffff',x=960,y=124,ms=`${String(Math.floor(ss/60)).padStart(2,'0')}:${String(Math.floor(ss%60)).padStart(2,'0')}`;
  if(dang){c.fillStyle=`rgba(255,40,40,${.18+.12*Math.sin(t*6)})`;c.beginPath();c.arc(x,y,82,0,TAU);c.fill();}
  dot(c,x,y,68,'rgba(14,16,22,.92)');c.strokeStyle='rgba(255,255,255,.15)';c.lineWidth=8;c.beginPath();c.arc(x,y,60,0,TAU);c.stroke();
  c.strokeStyle=col;c.beginPath();c.arc(x,y,60,-Math.PI/2,-Math.PI/2+TAU*((ss%60)/60));c.stroke();
  txt(c,'С НАЧАЛА',x,y-30,{font:'800 15px Mont',fill:'rgba(255,255,255,.75)'});txt(c,ms,x,y+6,{font:'900 38px Mont',fill:col});txt(c,'МИН : СЕК',x,y+36,{font:'700 13px Mont',fill:'rgba(255,255,255,.6)'});
  // правила
  const seen=RULES.filter(r=>t>=wa(r[0])-.05);let x0=52;for(let i=0;i<seen.length;i++){const k=cl((t-wa(seen[i][0]))*4);c.save();c.translate(x0+24,232);c.scale(.6+.4*E.outB(k),.6+.4*E.outB(k));c.globalAlpha=cl(k*3);
    c.fillStyle='#fff';rr(c,-24,-24,48,48,10);c.fill();dot(c,0,0,17,PAL.red);txt(c,String(i+1),0,1,{font:'900 22px Mont',fill:'#fff'});c.restore();x0+=58;}
  if(t>wa(184)){const k=cl((t-wa(184))*3);c.save();c.translate(x0+24,232);c.globalAlpha=k*(.6+.4*Math.sin(t*9));c.strokeStyle='#fff';c.lineWidth=4;c.setLineDash([6,5]);rr(c,-24,-24,48,48,10);c.stroke();txt(c,'5',0,1,{font:'900 24px Mont',fill:'#fff'});c.restore();}
  if(seen.length){const r=seen[seen.length-1],k=cl((t-wa(r[0]))*3);c.save();c.globalAlpha=k;c.font='800 30px Mont';const w=c.measureText(r[1]).width+92;c.fillStyle='rgba(246,239,226,.95)';rr(c,52,282,w,52,14);c.fill();
    dot(c,82,308,15,PAL.red);txt(c,String(seen.length),82,309,{font:'900 18px Mont',fill:'#fff'});txt(c,r[1],108,309,{font:'800 30px Mont',fill:'#1b1e24',align:'left'});c.restore();}
  c.restore();}

/* ---------- кадр ---------- */
const WC=mk(W,H),WX=WC.getContext('2d');
function shotAt(t){let i=0;while(i+1<SH.length&&t>=SH[i+1].a)i++;return i;}
function drawShot(c,S,t){const lt=t-S.a,u=cl(lt/Math.max(.01,S.b-S.a)),k=ez(u),[x,y,z]=S.cam[0].map((v,j)=>lp(v,S.cam[1][j],k));let zz=z,ox=0;
  if(S.tin==='pop')zz*=1+.07*Math.exp(-lt*14);if(S.tin==='whip'&&lt<.18)ox=(1-lt/.18)*260;
  reset(c);c.translate(540+ox,960);c.scale(zz,zz);c.translate(-x,-y);WD[S.w](c,lt,S.o,t);reset(c);}
CLIP.init=async()=>{VO=await (await fetch('/a/shk.words.json?'+Date.now())).json();DUR=VO.dur+.15;SH=plan();SUB=buildSubs();window.PLAN={dur:DUR,shots:SH.map(s=>({w:s.w,a:+s.a.toFixed(2),b:+s.b.toFixed(2)}))};};
CLIP.draw=(c,t,i)=>{const si=shotAt(t),S=SH[si],lt=t-S.a;
  if(S.tin==='whip'&&lt<.18){reset(WX);WX.clearRect(0,0,W,H);drawShot(WX,S,t);c.save();for(let j=0;j<6;j++){c.globalAlpha=j?.22:1;c.drawImage(WC,(j-2.5)*28*(1-lt/.18),0);}c.restore();}
  else drawShot(c,S,t);
  // встряска на ударах
  reset(c);vig(c,.45,.32);
  if(S.tin==='flash'&&lt<.12){c.fillStyle=`rgba(255,255,255,${.55*(1-lt/.12)})`;c.fillRect(0,0,W,H);}
  hud(c,t);subs(c,t);
  if(t>DUR-.12){c.fillStyle=`rgba(0,0,0,${cl((t-(DUR-.12))/.12)})`;c.fillRect(0,0,W,H);}};
