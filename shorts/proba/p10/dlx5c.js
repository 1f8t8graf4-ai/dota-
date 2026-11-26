"use strict";
/* «Духless» v5 · сцены 4–6: вход в элитный клуб (очередь, бархатная лента, охранник отстёгивает её перед тобой),
   шампанское льётся в хрустальный бокал, телефон с сообщениями от девушек (кнопки как у iPhone: слева action и громкость, справа питание). */

/* ================= 4. КЛУБ ================= */
// мир в сантиметрах: фасад z=1400 (x −300…420), стена слева x=−300, земля y=0; камера на высоте глаз (y≈−160)
const CLB={FZ:1400,WX:-300,RX:420,FH:900};
function clubFacadeTex(){return cache('clbF',1440,1800,(x,w,h)=>{const X=v=>(v+300)*2,Y=v=>(v+900)*2;
  x.fillStyle=LG(x,0,0,0,h,[[0,'#07070b'],[.7,'#120d16'],[1,'#1a1018']]);x.fillRect(0,0,w,h);
  for(let i=0;i<w;i+=96){x.fillStyle='rgba(255,255,255,.035)';x.fillRect(i,0,2,h);}for(let j=0;j<h;j+=150){x.fillStyle='rgba(255,255,255,.025)';x.fillRect(0,j,w,2);}
  // окна верхних этажей (тусклые)
  const r=rng(31);for(let j=0;j<3;j++)for(let i=0;i<6;i++){if(r()<.35)continue;const wx=60+i*230,wy=90+j*180;x.fillStyle=`rgba(${r()<.5?'255,190,140':'160,140,255'},${.08+.18*r()})`;x.fillRect(wx,wy,120,110);}
  // дверь: x −90…70, y −250…0 — тёплый свет изнутри, силуэты танцующих
  const d0=X(-90),d1=X(70),dt=Y(-250),db=Y(0);x.fillStyle=LG(x,0,dt,0,db,[[0,'#ff7a3a'],[.5,'#ff3f8a'],[1,'#6a1a5a']]);x.fillRect(d0,dt,d1-d0,db-dt);
  x.save();x.beginPath();x.rect(d0,dt,d1-d0,db-dt);x.clip();x.fillStyle='rgba(255,240,220,.65)';x.beginPath();x.ellipse((d0+d1)/2,dt+40,140,60,0,0,TAU);x.fill();
  for(let i=0;i<7;i++){const px=d0+30+i*46+r()*10,ph=150+r()*60;x.fillStyle='rgba(30,6,30,.82)';x.beginPath();x.ellipse(px,db-ph-18,13,16,0,0,TAU);x.fill();x.beginPath();x.moveTo(px-24,db);x.quadraticCurveTo(px-26,db-ph+20,px,db-ph);x.quadraticCurveTo(px+26,db-ph+20,px+24,db);x.closePath();x.fill();}
  x.restore();x.strokeStyle='#c9a24a';x.lineWidth=8;x.strokeRect(d0-4,dt-4,d1-d0+8,db-dt+8);
  // козырёк над дверью
  x.fillStyle='#050507';x.fillRect(X(-150),Y(-300),X(130)-X(-150),44);x.fillStyle='rgba(255,210,150,.5)';for(let i=0;i<5;i++)x.fillRect(X(-130)+i*110,Y(-300)+38,26,6);
  // неон: PARADISE (розовый), под ним CLUB · MOSCOW
  const neon=(s,cx,cy,font,col,lw)=>{x.font=font;x.textAlign='center';x.textBaseline='middle';x.lineJoin='round';
    x.save();x.shadowColor=col;x.shadowBlur=40;x.strokeStyle=col;x.lineWidth=lw*2.2;x.globalAlpha=.55;x.strokeText(s,cx,cy);x.restore();
    x.save();x.shadowColor=col;x.shadowBlur=16;x.strokeStyle=col;x.lineWidth=lw;x.strokeText(s,cx,cy);x.restore();x.strokeStyle='#fff3fa';x.lineWidth=lw*.38;x.strokeText(s,cx,cy);};
  neon('Paradise',X(-10),Y(-470),'700 230px Cav','#ff3ea0',9);
  x.letterSpacing='22px';neon('CLUB · MOSCOW',X(-10),Y(-345),'600 54px Man','#7ad9ff',4);x.letterSpacing='0px';
});}
function clubWallTex(){return cache('clbW',800,450,(x,w,h)=>{x.fillStyle=LG(x,0,0,w,0,[[0,'#0d0a0e'],[1,'#151018']]);x.fillRect(0,0,w,h);
  x.globalAlpha=.18;for(let j=0;j<h;j+=9)for(let i=(j/9%2)*12;i<w;i+=24){x.fillStyle=(i+j)%3?'#2a1a1c':'#1a1012';x.fillRect(i,j,22,8);}x.globalAlpha=1;
  for(let i=0;i<4;i++){const sx=80+i*200;x.fillStyle=RG(x,sx,150,0,90,[[0,'rgba(255,190,120,.5)'],[1,'rgba(255,190,120,0)']]);x.fillRect(sx-90,60,180,180);x.fillStyle='#ffe2b0';x.fillRect(sx-4,140,8,14);}});}
function clubGroundTex(){return cache('clbG',650,800,(x,w,h)=>{// x −600…700, z −200…1400
  x.fillStyle='#0b0a0c';x.fillRect(0,0,w,h);x.globalAlpha=.5;x.globalCompositeOperation='overlay';x.drawImage(noiseTex('asf',256,256,3,3),0,0,w,h);x.globalAlpha=1;x.globalCompositeOperation='source-over';
  const r=rng(14);for(let i=0;i<26;i++){const px=r()*w,pz=r()*h,rx=20+r()*60,ry=8+r()*20;x.fillStyle='rgba(120,110,140,.16)';x.beginPath();x.ellipse(px,pz,rx,ry,r()*.6,0,TAU);x.fill();}
  // красная дорожка к двери: x −70…50, z 380…1400
  const X=v=>(v+600)/2,Z=v=>(v+200)/2;x.fillStyle='#5a0c14';x.fillRect(X(-70),Z(380),X(50)-X(-70),Z(1400)-Z(380));x.fillStyle='rgba(255,90,110,.12)';x.fillRect(X(-70),Z(380),4,Z(1400)-Z(380));x.fillRect(X(50)-4,Z(380),4,Z(1400)-Z(380));});}
// стойка с латунным шаром
function stanchion(c,cam,px,pz,h=100){const b=cam.P(px,0,pz),tp=cam.P(px,-h,pz),s=b[3];
  c.save();c.fillStyle='rgba(0,0,0,.45)';c.beginPath();c.ellipse(b[0]+8*s,b[1]+2*s,26*s,7*s,0,0,TAU);c.fill();
  c.fillStyle=LG(c,b[0]-20*s,0,b[0]+20*s,0,[[0,'#5a3c10'],[.45,'#ffe6a0'],[1,'#6a4612']]);c.beginPath();c.ellipse(b[0],b[1],20*s,6*s,0,0,TAU);c.fill();
  c.strokeStyle=LG(c,b[0]-4*s,0,b[0]+4*s,0,[[0,'#6a4612'],[.5,'#fff0b8'],[1,'#5a3c10']]);c.lineWidth=7*s;c.beginPath();c.moveTo(b[0],b[1]);c.lineTo(tp[0],tp[1]);c.stroke();
  c.fillStyle=RG(c,tp[0]-3*s,tp[1]-4*s,1,9*s,[[0,'#fffbe0'],[.5,'#e6b24a'],[1,'#5a3c10']]);c.beginPath();c.arc(tp[0],tp[1]-5*s,8*s,0,TAU);c.fill();c.restore();}
// бархатная лента между точками (мир), провис sag
function rope3(c,cam,a,b,sag,o={}){const P=[];for(let i=0;i<=18;i++){const k=i/18;P.push(cam.P(lp(a[0],b[0],k),lp(a[1],b[1],k)+sag*4*k*(1-k),lp(a[2],b[2],k)));}const s=(P[0][3]+P[18][3])/2;
  c.save();c.lineCap='round';c.lineJoin='round';const pth=()=>{c.beginPath();c.moveTo(P[0][0],P[0][1]);for(const p of P)c.lineTo(p[0],p[1]);};
  pth();c.strokeStyle='#2a0308';c.lineWidth=9*s;c.stroke();pth();c.strokeStyle='#9a1424';c.lineWidth=6.5*s;c.stroke();c.translate(0,-1.8*s);pth();c.strokeStyle='rgba(255,120,140,.5)';c.lineWidth=2*s;c.stroke();c.restore();}
// фигура со спины/в профиль (очередь): ноги в (x,z) на земле, h — рост, вид — v (0..3)
function queuer(c,cam,px,pz,h,v,t){const f=cam.P(px,0,pz),hd=cam.P(px,-h,pz),H=f[1]-hd[1];if(H<20)return;const s=H/175,x=f[0],y=f[1];
  c.save();c.translate(x,y);c.scale(s,s);const sw=Math.sin(t*1.2+v*2)*2;
  c.fillStyle='#0a070c';c.beginPath();
  if(v%2){c.moveTo(-26,0);c.lineTo(-18,-80);c.quadraticCurveTo(-30,-110,-26,-128);c.quadraticCurveTo(-24,-142,0,-146);c.quadraticCurveTo(24,-142,26,-128);c.quadraticCurveTo(30,-110,18,-80);c.lineTo(26,0);c.closePath();c.fill();
    c.beginPath();c.ellipse(sw*.3,-158,12,15,0,0,TAU);c.fill();c.beginPath();c.moveTo(-14,-160);c.quadraticCurveTo(-22,-120,-10,-108);c.lineTo(14,-108);c.quadraticCurveTo(22,-120,14,-160);c.closePath();c.fill();}
  else{c.moveTo(-22,0);c.lineTo(-24,-90);c.quadraticCurveTo(-34,-126,-28,-140);c.quadraticCurveTo(-20,-150,0,-150);c.quadraticCurveTo(20,-150,28,-140);c.quadraticCurveTo(34,-126,24,-90);c.lineTo(22,0);c.closePath();c.fill();c.beginPath();c.ellipse(sw*.3,-164,13,16,0,0,TAU);c.fill();}
  c.globalCompositeOperation='screen';c.strokeStyle=v%3?'rgba(255,70,170,.55)':'rgba(120,200,255,.45)';c.lineWidth=3/s*Math.min(1,s*1.5);c.beginPath();c.arc(sw*.3,-160,15,Math.PI*1.05,Math.PI*1.75);c.stroke();c.beginPath();c.moveTo(-28,-132);c.quadraticCurveTo(-30,-100,-22,-60);c.stroke();
  c.restore();}
// охранник лицом к камере: (x,y) — центр плеч на экране, s — масштаб; o: {nod, reach:[ex,ey] — куда тянется правая рука, grab}
function bouncer(c,x,y,s,o={}){c.save();c.translate(x,y);c.scale(s,s);const rim='#ffb070',pink='#ff4aa8';
  // тело: широкие плечи, пиджак
  c.fillStyle='#08080b';c.beginPath();c.moveTo(-150,560);c.lineTo(-160,120);c.quadraticCurveTo(-168,30,-120,6);c.lineTo(-48,-12);c.lineTo(48,-12);c.lineTo(120,6);c.quadraticCurveTo(168,30,160,120);c.lineTo(150,560);c.closePath();c.fill();
  // контровой свет по плечам (от двери) и розовый с боку
  c.save();c.globalCompositeOperation='screen';c.filter='blur(4px)';c.strokeStyle=rgba(rim,.85);c.lineWidth=9;c.beginPath();c.moveTo(-150,200);c.quadraticCurveTo(-168,30,-120,6);c.lineTo(-48,-12);c.stroke();c.strokeStyle=rgba(pink,.6);c.beginPath();c.moveTo(120,6);c.quadraticCurveTo(168,30,160,160);c.stroke();c.restore();
  // рубашка, галстук, лацканы
  c.fillStyle='#d8dce4';c.beginPath();c.moveTo(-40,-12);c.lineTo(40,-12);c.lineTo(14,170);c.lineTo(-14,170);c.closePath();c.fill();
  c.fillStyle='#050507';c.beginPath();c.moveTo(-9,4);c.lineTo(9,4);c.lineTo(14,150);c.lineTo(0,172);c.lineTo(-14,150);c.closePath();c.fill();
  c.fillStyle='#121218';c.beginPath();c.moveTo(-48,-12);c.lineTo(-14,170);c.lineTo(-60,90);c.closePath();c.fill();c.beginPath();c.moveTo(48,-12);c.lineTo(14,170);c.lineTo(60,90);c.closePath();c.fill();
  // шея и голова (наклон — кивок)
  const nod=o.nod||0;c.save();c.translate(0,-20);c.rotate(-nod*.06);c.translate(0,nod*10);
  c.fillStyle='#3a2620';c.fillRect(-30,-50,60,46);
  c.beginPath();c.ellipse(0,-112,62,76,0,0,TAU);c.fillStyle=LG(c,-60,0,60,0,[[0,'#6a4436'],[.45,'#3a2620'],[1,'#1c120e']]);c.fill();
  c.fillStyle='#0c0907';c.beginPath();c.ellipse(0,-150,60,42,0,Math.PI,TAU);c.fill();
  // лицо в тени: скулы, нос, брови — тёплый край от двери, розовый с другой стороны
  c.save();c.globalCompositeOperation='screen';c.filter='blur(3px)';c.strokeStyle=rgba(rim,.8);c.lineWidth=7;c.beginPath();c.ellipse(0,-112,62,76,0,Math.PI*.95,Math.PI*1.55);c.stroke();c.strokeStyle=rgba(pink,.55);c.beginPath();c.ellipse(0,-112,62,76,0,Math.PI*1.75,Math.PI*2.3);c.stroke();c.restore();
  c.strokeStyle='rgba(255,190,150,.35)';c.lineWidth=3;c.beginPath();c.moveTo(2,-104);c.lineTo(-4,-80);c.lineTo(8,-78);c.moveTo(-18,-58);c.quadraticCurveTo(0,-54,18,-58);c.stroke();
  // тёмные очки с отражением неона
  c.fillStyle='#050507';c.beginPath();c.moveTo(-52,-130);c.quadraticCurveTo(0,-140,52,-130);c.lineTo(48,-104);c.quadraticCurveTo(26,-96,6,-108);c.lineTo(-6,-108);c.quadraticCurveTo(-26,-96,-48,-104);c.closePath();c.fill();
  c.fillStyle=LG(c,-50,-130,40,-100,[[0,'rgba(255,62,160,.0)'],[.45,'rgba(255,62,160,.55)'],[.6,'rgba(122,217,255,.35)'],[1,'rgba(255,62,160,0)']]);c.fill();
  // ухо и наушник с витым проводом
  c.fillStyle='#4a2e24';c.beginPath();c.ellipse(-62,-108,10,18,0,0,TAU);c.fill();c.fillStyle='#0a0a0c';c.beginPath();c.arc(-64,-104,6,0,TAU);c.fill();
  c.strokeStyle='rgba(200,210,230,.55)';c.lineWidth=2.2;c.beginPath();for(let i=0;i<=30;i++){const k=i/30,yy=-98+k*120,xx=-66+Math.sin(k*40)*4-k*8;i?c.lineTo(xx,yy):c.moveTo(xx,yy);}c.stroke();
  c.restore();
  // правая рука (у нас слева) тянется к крюку стойки
  if(o.reach){const [ex,ey]=o.reach,sx=-150,sy=40,ax=lp(sx,ex,.55)-30,ay=lp(sy,ey,.55)+50;
    c.save();c.lineCap='round';c.lineJoin='round';c.strokeStyle='#07070a';c.lineWidth=72;c.beginPath();c.moveTo(sx,sy);c.quadraticCurveTo(ax,ay,ex+26,ey+12);c.stroke();
    c.globalCompositeOperation='screen';c.strokeStyle=rgba(rim,.35);c.lineWidth=6;c.beginPath();c.moveTo(sx-30,sy);c.quadraticCurveTo(ax-30,ay-30,ex+10,ey-20);c.stroke();c.restore();
    c.fillStyle='#e8e8ee';c.save();c.translate(ex+22,ey+10);c.rotate(Math.atan2(ey-ay,ex-ax));c.fillRect(-20,-30,16,60);c.restore();
    const L=[-.6,-.7];blob(c,[[ex+18,ey-24],[ex-26,ey-28],[ex-46,ey-6],[ex-40,ey+24],[ex-10,ey+34],[ex+20,ey+22]],L,{skin:{d:'#3c241c',m:'#6a4436',l:'#9a6a54',h:'#e0b8a0',nail:'#c9a090'}});
    tube(c,[[ex-20,ey-20],[ex-44,ey-22],[ex-54,ey-6]],18,15,L,{skin:{d:'#3c241c',m:'#6a4436',l:'#9a6a54',h:'#e0b8a0',nail:'#c9a090'}});}
  c.restore();}

// сцена «клуб». o: {K — ключи камеры, nod:[t0], open:[t0,t1] — снимает ленту, hero — фигура героя со спины идёт к двери (вариант side)}
function clubScene(c,t,u,o={}){
  const cm=camKeys(o.K||[[0,lookAt([-30,-150,-40],[10,-140,1400],1150,0)],[2.6,lookAt([-24,-150,250],[20,-140,1400],1150,0)]],u,k=>eo(k)),cam=cam3(cm);
  // небо и дальняя улица
  c.fillStyle=LG(c,0,0,0,HH,[[0,'#06050c'],[.5,'#0c0814'],[1,'#030205']]);c.fillRect(0,0,WW,HH);
  c.drawImage(bokeh('clb1',WW,HH,40,['#ff3ea0','#7ad9ff','#ffb46a','#c06aff'],10,46,3,6),0,-120);
  texPlane(c,cam,clubFacadeTex(),[CLB.WX,-CLB.FH,CLB.FZ],[720,0,0],[0,CLB.FH,0],8,8);
  // свет двери и неона: свечение, лучи в дымке
  const dc=cam.P(-10,-125,CLB.FZ),sg=cam.P(-10,-470,CLB.FZ),fl=.92+.08*Math.sin(t*23)*Math.sin(t*7);
  glowDot(c,dc[0],dc[1],520*dc[3],'#ff5a8a',.55);glowDot(c,sg[0],sg[1],700*sg[3],'#ff3ea0',.5*fl);
  beam(c,dc[0],dc[1]-200*dc[3],0,.9,900*dc[3],'#ff8ab0',.35);
  texPlane(c,cam,clubWallTex(),[CLB.WX,-CLB.FH,-200],[0,0,1600],[0,CLB.FH,0],6,6);
  texPlane(c,cam,clubGroundTex(),[-600,0,1400],[1300,0,0],[0,0,-1600],8,10);
  // отражения в мокром асфальте: вертикальные полосы под дверью и вывеской
  c.save();c.globalCompositeOperation='screen';const gy=cam.P(-10,0,CLB.FZ);for(const [px,col,a,w] of [[-10,'#ff5a8a',.5,120],[-10,'#ff3ea0',.35,260],[-180,'#7ad9ff',.18,60]]){const p=cam.P(px,0,CLB.FZ);c.fillStyle=LG(c,0,gy[1],0,HH,[[0,rgba(col,a)],[1,rgba(col,0)]]);c.fillRect(p[0]-w*p[3],gy[1],2*w*p[3],HH-gy[1]);}c.restore();
  // очередь вдоль стены (дальние — первыми)
  for(let i=11;i>=0;i--){const pz=560+i*72,px=-215-(i%3)*22;queuer(c,cam,px,pz,165+((i*37)%25),i,t);}
  // стойки и ленты: линия очереди слева, линия справа, поперечная лента
  for(const z of [1300,1100,900,700,540])stanchion(c,cam,-120,z);for(let z=540;z<1300;z+=200)rope3(c,cam,[-120,-92,z],[-120,-92,z+200],10);
  for(const z of [1300,1050,800])stanchion(c,cam,70,z);for(const [z0,z1] of [[800,1050],[1050,1300]])rope3(c,cam,[70,-92,z0],[70,-92,z1],10);
  // поперечная лента: снимается с правой стойки
  const ok=o.open?eo(cl((t-o.open[0])/(o.open[1]-o.open[0]))):0,A=[-110,-92,480],Bp=[30,-92,480],hook=[lp(30,96,ok),lp(-92,-118,ok),lp(480,540,ok)];
  stanchion(c,cam,A[0],A[2]);stanchion(c,cam,Bp[0],Bp[2]);rope3(c,cam,A,hook,lp(14,26,ok));
  // герой со спины (вариант «со стороны»): идёт по дорожке к ленте
  if(o.hero){const hz=lp(420,560,eo(cl(u/2.6))),hf=cam.P(-60,0,hz),hh=cam.P(-60,-182,hz),sH=(hf[1]-hh[1])/600;manBack(c,hf[0],hh[1]+170*sH,sH*1.05,{rim:'#ff8ac0',light:1});}
  // охранник
  const bf=cam.P(78,0,540),bh=cam.P(78,-150,540),bs=(bf[1]-bh[1])/560,hk=cam.P(hook[0],hook[1],hook[2]);
  const nod=o.nod?Math.max(0,Math.sin(cl((t-o.nod[0])/.5)*Math.PI)):0;
  bouncer(c,bh[0],bh[1],bs,{nod,reach:[(hk[0]-bh[0])/bs,(hk[1]-bh[1])/bs]});
  // дождь, дымка, глубина
  rain(c,t,.8,{n:120,sl:.1});fog(c,t,dc[1]-200,{n:10,sp:18,h:260,r:380,a:.1,seed:7});
  c.save();c.globalCompositeOperation='screen';c.fillStyle=RG(c,dc[0],dc[1],0,900,[[0,`rgba(255,170,120,${.2+.25*ok})`],[1,'rgba(255,170,120,0)']]);c.fillRect(0,0,WW,HH);c.restore();
  dof(c,{px:14,top:.6,m0:.3,m1:.85,bot:.6});vignette(c,.7);}

/* ================= 5. ШАМПАНСКОЕ ================= */
function clubBokeh(c,t,a=1){c.save();c.globalAlpha=a;c.fillStyle=LG(c,0,0,0,HH,[[0,'#120818'],[.6,'#1a0a14'],[1,'#07040a']]);c.fillRect(0,0,WW,HH);
  c.drawImage(bokeh('clb2',WW,HH,70,['#ff3ea0','#ffb46a','#c06aff','#ffd27a'],18,90,5,8),Math.sin(t*.3)*20,Math.cos(t*.25)*14);
  for(let i=0;i<3;i++){const a0=-.5+i*.5+Math.sin(t*.8+i)*.25;beam(c,300+i*240,-40,a0,.08,1700,i%2?'#ff3ea0':'#9a7aff',.35);}c.restore();}
// бутылка: горлышко (mx,my) — точка выхода струи, ang — направление от дна к горлышку, s — масштаб
function bottle(c,mx,my,ang,s,o={}){c.save();c.translate(mx,my);c.rotate(ang+Math.PI);c.scale(s,s);// ось бутылки: от горлышка (0) к дну (+x)
  const body=()=>{c.beginPath();c.moveTo(0,-15);c.lineTo(150,-17);c.bezierCurveTo(230,-20,260,-72,330,-78);c.lineTo(720,-80);c.quadraticCurveTo(742,-80,744,-60);c.lineTo(744,60);c.quadraticCurveTo(742,80,720,80);c.lineTo(330,78);c.bezierCurveTo(260,72,230,20,150,17);c.lineTo(0,15);c.closePath();};
  body();c.fillStyle=LG(c,0,-80,0,80,[[0,'#020604'],[.18,'#1e3a2a'],[.3,'#0a1a12'],[.62,'#03080a'],[.85,'#14261c'],[1,'#010302']]);c.fill();
  c.save();body();c.clip();
  // фольга на горлышке
  c.fillStyle=LG(c,0,-40,0,40,[[0,'#5a3c0c'],[.3,'#ffe6a0'],[.5,'#c9962e'],[.7,'#fff0c0'],[1,'#4a300a']]);c.beginPath();c.moveTo(0,-16);c.lineTo(250,-30);c.bezierCurveTo(270,-50,280,-64,300,-70);c.lineTo(300,70);c.bezierCurveTo(280,64,270,50,250,30);c.lineTo(0,16);c.closePath();c.fill();
  c.strokeStyle='rgba(90,60,10,.5)';c.lineWidth=1.5;for(let i=10;i<290;i+=13){c.beginPath();c.moveTo(i,-30);c.lineTo(i+8,0);c.lineTo(i,30);c.stroke();}
  // этикетка: чёрная с золотом
  c.fillStyle='#07070a';RR(c,400,-66,260,132,10);c.fill();c.strokeStyle='#d8b25a';c.lineWidth=4;RR(c,408,-58,244,116,8);c.stroke();
  c.save();c.translate(530,0);c.rotate(Math.PI/2);c.fillStyle='#e9c66a';c.font='700 34px Play';c.textAlign='center';c.textBaseline='middle';c.fillText('CHAMPAGNE',0,-4);c.font='600 16px Man';c.letterSpacing='6px';c.fillText('BRUT · RÉSERVE',0,30);c.letterSpacing='0px';c.restore();
  // блики стекла
  c.globalCompositeOperation='screen';c.fillStyle=LG(c,0,-80,0,80,[[0,'rgba(255,255,255,0)'],[.2,'rgba(220,255,235,.32)'],[.26,'rgba(255,255,255,0)'],[.8,'rgba(255,200,140,.12)'],[1,'rgba(255,255,255,0)']]);c.fillRect(300,-90,450,180);
  c.restore();c.restore();}
// бокал-флюте: ножка в (x,yb), высота H; lev — уровень 0..1; pour — струя есть; t — время для пузырьков
function flute(c,x,yb,H,lev,t,o={}){const s=H/900,rim=yb-H,bw=110*s,cupB=yb-470*s;c.save();
  // отражение на столе
  if(o.table){c.save();c.globalAlpha=.25;c.translate(0,2*yb);c.scale(1,-1);c.restore();}
  // основание и ножка
  c.fillStyle='rgba(255,255,255,.06)';c.beginPath();c.ellipse(x,yb,150*s,30*s,0,0,TAU);c.fill();c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=2.5*s;c.stroke();
  c.fillStyle=LG(c,x-10*s,0,x+10*s,0,[[0,'rgba(255,255,255,.12)'],[.5,'rgba(255,255,255,.55)'],[1,'rgba(255,255,255,.12)']]);c.fillRect(x-8*s,cupB,16*s,yb-cupB);
  // чаша
  const cup=()=>{c.beginPath();c.moveTo(x-bw,rim);c.bezierCurveTo(x-bw*1.05,rim+220*s,x-70*s,cupB-80*s,x-14*s,cupB);c.lineTo(x+14*s,cupB);c.bezierCurveTo(x+70*s,cupB-80*s,x+bw*1.05,rim+220*s,x+bw,rim);c.closePath();};
  // напиток
  if(lev>0){const ly=lp(cupB-10*s,rim+60*s,lev);c.save();cup();c.clip();c.fillStyle=LG(c,x-bw,0,x+bw,0,[[0,'#8a5a10'],[.35,'#f2c65a'],[.55,'#ffe7a0'],[.8,'#d9a438'],[1,'#7a4a0c']]);c.fillRect(x-bw-10,ly,2*bw+20,cupB-ly+20);
    c.globalCompositeOperation='screen';for(let i=0;i<46;i++){const bx=x+(H1(i*3.1)-.5)*bw*1.4,sp=120+200*H1(i*7.3),by=cupB-((t*sp+H1(i)*900)%Math.max(10,cupB-ly));if(by<ly)continue;c.fillStyle='rgba(255,250,220,.75)';c.beginPath();c.arc(bx,by,(1.5+2.5*H1(i*5.7))*s*2,0,TAU);c.fill();}
    c.globalCompositeOperation='source-over';const fh=(o.foam??.5)*60*s;c.fillStyle=LG(c,0,ly-fh,0,ly+8,[[0,'rgba(255,252,240,.95)'],[1,'rgba(255,240,200,.4)']]);c.beginPath();c.moveTo(x-bw*1.2,ly+6);for(let i=0;i<=24;i++){const k=i/24;c.lineTo(x-bw*1.2+k*bw*2.4,ly-fh*(.6+.4*Math.sin(k*19+t*6)));}c.lineTo(x+bw*1.2,ly+6);c.closePath();c.fill();c.restore();}
  // стекло: тонкие края, блики
  cup();c.fillStyle='rgba(255,255,255,.05)';c.fill();c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=2.8*s;c.stroke();
  c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=7*s;c.lineCap='round';c.beginPath();c.moveTo(x-bw*.78,rim+40*s);c.quadraticCurveTo(x-bw*.8,rim+250*s,x-40*s,cupB-60*s);c.stroke();
  c.lineWidth=3*s;c.globalAlpha=.6;c.beginPath();c.moveTo(x+bw*.6,rim+60*s);c.quadraticCurveTo(x+bw*.7,rim+200*s,x+50*s,cupB-90*s);c.stroke();c.globalAlpha=1;
  c.strokeStyle='rgba(255,255,255,.75)';c.lineWidth=2.5*s;c.beginPath();c.ellipse(x,rim,bw,16*s,0,0,TAU);c.stroke();
  c.restore();return {rim,bw,cupB};}
// сцена «шампанское». o: {pour:[t0,t1] — струя, hand — рука держит бокал за ножку (POV), K — камера (масштаб, сдвиг)}
function champScene(c,t,u,o={}){clubBokeh(c,t);const z=lp(1,1.08,eo(cl(u/1.4))),cx=540,cy=980;
  c.save();c.translate(cx,cy);c.scale(z,z);c.translate(-cx,-cy);
  // стол: тёмный глянец с отражениями огней
  const ty=o.hand?1500:1330;c.fillStyle=LG(c,0,ty-10,0,HH,[[0,'#0e0a10'],[1,'#030204']]);c.fillRect(-200,ty-10,WW+400,HH);c.save();c.globalCompositeOperation='screen';c.globalAlpha=.35;c.scale(1,-.5);c.drawImage(bokeh('clb2',WW,HH,70,['#ff3ea0','#ffb46a','#c06aff','#ffd27a'],18,90,5,8),0,-2*ty-HH*.2);c.restore();
  const p=o.pour||[0,1],pk=cl((t-p[0])/(p[1]-p[0])),lev=lp(.06,.84,ss(0,1,pk)),fx=560,fy=o.hand?1230:1320,G=flute(c,fx,fy,780,lev,t,{foam:.4+.6*Math.sin(Math.PI*Math.min(1,pk*1.2))});
  // струя из горлышка в бокал
  const bx=fx-120+40*(1-pk),by=G.rim-250,pour=t>p[0]-.05&&t<p[1]+.15;
  bottle(c,bx,by,-.82+.12*Math.sin(t*1.7)*0,1.15);
  if(pour){const ly=lp(G.cupB-10,G.rim+48,lev);c.save();c.lineCap='round';c.strokeStyle=LG(c,bx,by,fx,ly,[[0,'rgba(255,224,140,.95)'],[1,'rgba(255,210,110,.85)']]);c.lineWidth=13;c.beginPath();c.moveTo(bx+8,by+10);c.quadraticCurveTo(bx+40,by+120,fx-6,ly);c.stroke();
    c.strokeStyle='rgba(255,255,235,.8)';c.lineWidth=3;c.beginPath();c.moveTo(bx+6,by+12);c.quadraticCurveTo(bx+34,by+120,fx-9,ly);c.stroke();c.restore();
    for(let i=0;i<14;i++){const a=-Math.PI/2+(H1(i*3.3+Math.floor(t*14))-.5)*1.6,r=10+30*H1(i*5.1+Math.floor(t*14));glowDot(c,fx+Math.cos(a)*r,ly-6+Math.sin(a)*r*.5,6,'#fff1c0',.8);}}
  // рука держит бокал за ножку (POV)
  if(o.hand){const L=[-.5,-.86],hx=fx+8,hy=fy-160;sleeve(c,hx+220,hy+330,300,420,230,L);
    blob(c,[[hx+40,hy-10],[hx+120,hy+20],[hx+210,hy+120],[hx+230,hy+250],[hx+170,hy+330],[hx+70,hy+300],[hx+20,hy+170],[hx+10,hy+60]],L,{});
    tube(c,[[hx+60,hy+40],[hx+8,hy+30],[hx-26,hy+50]],38,30,L,{nail:{side:-1}});tube(c,[[hx+70,hy+110],[hx+14,hy+108],[hx-22,hy+122]],36,28,L,{nail:{side:-1}});tube(c,[[hx+80,hy+190],[hx+30,hy+190],[hx,hy+204]],32,25,L,{nail:{side:-1}});
    tube(c,[[hx+150,hy+10],[hx+80,hy-40],[hx+30,hy-36]],40,31,L,{nail:{side:1}});}
  c.restore();
  c.save();c.globalCompositeOperation='screen';c.fillStyle=RG(c,560,900,0,700,[[0,'rgba(255,200,120,.18)'],[1,'rgba(255,200,120,0)']]);c.fillRect(0,0,WW,HH);c.restore();
  vignette(c,.65);}

/* ================= 6. ТЕЛЕФОН ================= */
const GIRLS=[['KATYA','where are you?? 🥂'],['LENA','come back to the club'],['MASHA','sent you a photo'],['ALINA','I miss you 😘']];
// экран блокировки (текстура 780×1690), n — сколько уведомлений пришло, k — дольки въезда последнего
function phoneScreen(n,k){const cv=mkcOnce('phs',780,1690),x=cv.getContext('2d');reset(x);
  x.fillStyle=LG(x,0,0,0,1690,[[0,'#2a1240'],[.5,'#120a26'],[1,'#05030c']]);x.fillRect(0,0,780,1690);
  x.fillStyle=RG(x,560,380,0,700,[[0,'rgba(255,80,160,.35)'],[1,'rgba(255,80,160,0)']]);x.fillRect(0,0,780,1690);
  x.fillStyle='#000';RR(x,280,34,220,64,32);x.fill();
  x.fillStyle='#fff';x.textAlign='center';x.font='600 34px Man';x.fillText('Saturday, April 14',390,210);x.font='300 210px Man';x.fillText('02:03',390,410);
  for(let i=0;i<n;i++){const last=i===n-1,e=last?spr(k):1,yy=560+(n-1-i)*190,dy=last?lp(-120,0,e):0,al=last?cl(k*3):1;x.save();x.globalAlpha=al;x.translate(0,dy);
    x.fillStyle='rgba(255,255,255,.2)';RR(x,40,yy,700,166,40);x.fill();x.fillStyle=RG(x,104,yy+60,2,30,[[0,'#ff8ac8'],[1,'#e0307a']]);RR(x,74,yy+32,62,62,16);x.fill();
    x.fillStyle='#fff';x.font='700 30px Man';x.textAlign='left';x.fillText('♥',91,yy+74);x.font='700 32px Man';x.fillText(GIRLS[i][0],160,yy+64);x.font='500 30px Man';x.fillStyle='rgba(255,255,255,.88)';x.fillText(GIRLS[i][1],160,yy+116);
    x.font='500 24px Man';x.fillStyle='rgba(255,255,255,.55)';x.textAlign='right';x.fillText('now',700,yy+62);x.restore();}
  x.fillStyle='rgba(255,255,255,.85)';RR(x,270,1640,240,10,5);x.fill();return cv;}
// телефон в пространстве: центр (x,y,z), наклон tilt (назад), поворот yaw; рисует корпус с кнопками и экран; возвращает экранные углы
function phone3(c,cam,o){const w=78,h=164,d=8.5,ct=Math.cos(o.tilt),st=Math.sin(o.tilt),cy=Math.cos(o.yaw),sy=Math.sin(o.yaw);
  const tr=(lx,ly,lz)=>{const y1=ly*ct-lz*st,z1=ly*st+lz*ct,x2=lx*cy+z1*sy,z2=-lx*sy+z1*cy;return [o.x+x2,o.y+y1,o.z+z2];};
  const P=(lx,ly,lz)=>{const q=tr(lx,ly,lz);return cam.P(q[0],q[1],q[2]);};
  const r=11,ring=(zz)=>{const pts=[];const cs=[[w/2-r,-h/2+r,-Math.PI/2],[w/2-r,h/2-r,0],[-w/2+r,h/2-r,Math.PI/2],[-w/2+r,-h/2+r,Math.PI]];for(const [cx,cy0,a0] of cs)for(let i=0;i<=5;i++){const a=a0+i/5*Math.PI/2;pts.push(P(cx+Math.cos(a)*r,cy0+Math.sin(a)*r,zz));}return pts;};
  const F=ring(-d/2),B=ring(d/2),n=F.length;
  // борт (титан): видимые грани
  for(let i=0;i<n;i++){const j=(i+1)%n,q=[F[i],F[j],B[j],B[i]],cr=(q[1][0]-q[0][0])*(q[3][1]-q[0][1])-(q[1][1]-q[0][1])*(q[3][0]-q[0][0]);if(cr<0)continue;c.fillStyle=i<n/2?'#3a3c44':'#6a6c76';PP(c,q);c.fill();c.strokeStyle='rgba(255,255,255,.15)';c.lineWidth=1;c.stroke();}
  // кнопки: слева (x=−w/2) — action и две громкости, справа (x=+w/2) — питание
  const btn=(side,y0,y1)=>{const xx=side*(w/2+1.6),q=[P(xx,y0,-2),P(xx,y1,-2),P(xx,y1,2),P(xx,y0,2)];c.fillStyle='#8a8c96';PP(c,q);c.fill();c.strokeStyle='rgba(0,0,0,.5)';c.lineWidth=1;c.stroke();};
  btn(-1,-58,-50);btn(-1,-40,-26);btn(-1,-20,-6);btn(1,-34,-12);
  // лицевая сторона: рамка и экран
  c.fillStyle='#0a0a0c';PP(c,F);c.fill();c.save();PP(c,F);c.clip();
  const sw=w-6,sh=h-6,O=tr(-sw/2,-sh/2,-d/2-.2),U0=tr(sw/2,-sh/2,-d/2-.2),V0=tr(-sw/2,sh/2,-d/2-.2),U=[U0[0]-O[0],U0[1]-O[1],U0[2]-O[2]],V=[V0[0]-O[0],V0[1]-O[1],V0[2]-O[2]];
  texPlane(c,cam,o.screen,O,U,V,5,8);c.restore();
  c.strokeStyle='rgba(255,255,255,.22)';c.lineWidth=1.5;PP(c,F);c.stroke();
  return {F,P};}
// сцена «девушки»: телефон в руке (POV) или на столе (o.table). o: {n0 — время первого уведомления, step — шаг}
function phoneScene(c,t,u,o={}){clubBokeh(c,t,.9);const z=lp(1.0,1.06,eo(cl(u/1.2)));
  const step=o.step||.2,n0=o.n0??0,nk=(t-n0)/step,n=Math.max(1,Math.min(GIRLS.length,Math.floor(nk)+1)),k=cl(nk-(n-1)),buzz=Math.max(0,1-k*3)*(nk>=0?1:0);
  const scr=phoneScreen(n,k),jx=Math.sin(t*90)*4*buzz;
  if(o.table||!o.hand){// на столе: камера сверху, телефон лежит, свет экрана на столе
    const cam=cam3(camKeys([[0,lookAt([60,-560,300],[0,0,820],1500,-.04)],[1.2,lookAt([40,-520,380],[0,0,830],1500,-.02)]],u,eo));
    texPlane(c,cam,clubTableTex(),[-600,0,1400],[1300,0,0],[0,0,-1600],6,6);
    const pc=cam.P(0,0,820);c.save();c.globalCompositeOperation='screen';c.fillStyle=RG(c,pc[0],pc[1],0,520*(.7+.3*(1-k)),[[0,`rgba(200,120,255,${.35+.3*buzz})`],[1,'rgba(200,120,255,0)']]);c.fillRect(0,0,WW,HH);c.restore();
    const sl={x:jx*.3,z:820,w:78*4,d:164*4,h:34,r:44,a:.12,top:scr,side0:'#202228',side1:'#9a9ca6',shOff:[20,0,-24],nx:5,ny:8};slabShadow(c,cam,sl,18,.6);const T=slab(c,cam,sl);sheen(c,T,ss(0,1.2,u),.25,1.2,.1);
}
  else{// в руке: телефон стоит перед камерой, наклон назад
    c.save();c.translate(540,980);c.scale(z,z);c.translate(-540,-980);
    const cam=cam3(lookAt([0,-10,-330],[0,0,0],1500,0));
    const L=[-.4,-.9],ph=phone3(c,cam,{x:jx*.05,y:8,z:0,tilt:.12+.03*Math.sin(t*1.3),yaw:-.34,screen:scr});
    // рука снизу: большой палец спереди слева, пальцы справа за корпусом
    const b=ph.P(0,82,0),lft=ph.P(-39,30,-4),rgt=ph.P(39,20,4);sleeve(c,b[0]+60,b[1]+170,140,600,300,L,{});
    blob(c,[[b[0]-170,b[1]-40],[b[0]+120,b[1]-70],[b[0]+230,b[1]+60],[b[0]+200,b[1]+250],[b[0]-80,b[1]+260],[b[0]-200,b[1]+120]],L,{});
    for(let i=0;i<3;i++){const q=ph.P(39,-20+i*30,4);tube(c,[[q[0]+90,q[1]+50],[q[0]+30,q[1]+12],[q[0]+4,q[1]-4]],66,52,L,{nail:{side:1,k:.85}});}
    tube(c,[[lft[0]-70,lft[1]+210],[lft[0]-34,lft[1]+96],[lft[0]+36,lft[1]+34]],78,60,L,{nail:{side:-1,k:.85}});
    // свет экрана на пальцах
    c.save();c.globalCompositeOperation='screen';const sc=ph.P(0,0,-5);c.fillStyle=RG(c,sc[0],sc[1],100,620,[[0,`rgba(210,150,255,${.25+.35*buzz})`],[1,'rgba(210,150,255,0)']]);c.fillRect(0,0,WW,HH);c.restore();
    c.restore();}
  vignette(c,.6);}
