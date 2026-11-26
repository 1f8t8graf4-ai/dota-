"use strict";
/* «Духless» v5 · сцены 1–3: ночная Москва (Кремль, Спасская башня, Василий Блаженный, Москва-Сити в дымке),
   пропуск топ-менеджера MEGAPOLIS BANK с фото Козловского на столе, подпись договора на $1,000,000 рукой с ручкой.
   Сцена — функция (c, t, u, o): t — время ролика, u — время от начала плана, o — параметры варианта. */

/* ================= 1. МОСКВА ================= */
const MS={zK:2600,zC:9000,BASE:1560,WT:1340,WL:1650};
function onionPath(x,cx,by,w,h){x.beginPath();x.moveTo(cx-w*.34,by);x.bezierCurveTo(cx-w*.64,by-h*.16,cx-w*.62,by-h*.5,cx-w*.22,by-h*.72);
  x.bezierCurveTo(cx-w*.07,by-h*.82,cx-w*.02,by-h*.9,cx,by-h);x.bezierCurveTo(cx+w*.02,by-h*.9,cx+w*.07,by-h*.82,cx+w*.22,by-h*.72);
  x.bezierCurveTo(cx+w*.62,by-h*.5,cx+w*.64,by-h*.16,cx+w*.34,by);x.closePath();}
// купол-луковица: gold — золото, остальное — полосы по спирали / ромбы
function dome(x,cx,by,w,h,kind,lit=1){x.save();onionPath(x,cx,by,w,h);x.clip();
  if(kind==='gold'){x.fillStyle=LG(x,cx-w*.6,0,cx+w*.6,0,[[0,'#3a2206'],[.3,'#c98d26'],[.45,'#ffe9a8'],[.58,'#e5ad3c'],[1,'#2e1b05']]);x.fillRect(cx-w,by-h,2*w,h);}
  else{const P={gy:['#2e7d3c','#f0c93c'],rw:['#b52a20','#f3e8d6'],bw:['#1e5ea8','#f1f4f8'],tw:['#13867e','#f6ead0'],gs:['#d9a930','#255f36']}[kind];
    x.fillStyle=P[0];x.fillRect(cx-w,by-h,2*w,h);x.fillStyle=P[1];
    if(kind==='gs'){for(let j=0;j<9;j++)for(let i=-6;i<7;i++){const px=cx+i*w*.2+(j%2)*w*.1,py=by-j*h*.12;x.beginPath();x.moveTo(px,py-h*.05);x.lineTo(px+w*.07,py);x.lineTo(px,py+h*.05);x.lineTo(px-w*.07,py);x.closePath();x.fill();}}
    else if(kind==='rw'){for(let j=0;j<10;j++){x.beginPath();const py=by-j*h*.11;x.moveTo(cx-w,py);for(let i=0;i<=12;i++)x.lineTo(cx-w+i*w/6,py-((i%2)?h*.05:0));x.lineTo(cx+w,py-h*.035);for(let i=12;i>=0;i--)x.lineTo(cx-w+i*w/6,py-h*.035-((i%2)?h*.05:0));x.closePath();x.fill();}}
    else{for(let i=-8;i<8;i++){x.beginPath();const sx=cx+i*w*.22;x.moveTo(sx,by);x.bezierCurveTo(sx+w*.25,by-h*.35,sx+w*.5,by-h*.55,sx+w*.55,by-h);x.lineTo(sx+w*.66,by-h);x.bezierCurveTo(sx+w*.6,by-h*.55,sx+w*.36,by-h*.35,sx+w*.11,by);x.closePath();x.fill();}}}
  // объём: края темнее, блик слева сверху, тёплая подсветка снизу
  x.globalCompositeOperation='multiply';x.fillStyle=LG(x,cx-w*.6,0,cx+w*.6,0,[[0,'#2a2a3a'],[.28,'#dcdcdc'],[.5,'#ffffff'],[.78,'#9a9aa8'],[1,'#1a1a26']]);x.fillRect(cx-w,by-h,2*w,h);
  x.globalCompositeOperation='screen';x.fillStyle=RG(x,cx-w*.18,by-h*.6,2,w*.42,[[0,'rgba(255,250,235,.55)'],[1,'rgba(255,250,235,0)']]);x.fillRect(cx-w,by-h,2*w,h);
  x.fillStyle=LG(x,0,by,0,by-h,[[0,`rgba(255,170,90,${.45*lit})`],[.5,'rgba(255,170,90,0)']]);x.fillRect(cx-w,by-h,2*w,h);
  x.restore();}
function cross(x,cx,top,s){x.save();x.strokeStyle='#e8c35a';x.lineWidth=3*s;x.lineCap='round';x.beginPath();x.moveTo(cx,top);x.lineTo(cx,top-38*s);x.moveTo(cx-12*s,top-26*s);x.lineTo(cx+12*s,top-26*s);x.moveTo(cx-8*s,top-12*s);x.lineTo(cx+8*s,top-16*s);x.stroke();x.restore();}
function star5(x,cx,cy,R,r){x.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,q=i%2?r:R;x.lineTo(cx+Math.cos(a)*q,cy+Math.sin(a)*q);}x.closePath();}
function rubyStar(x,cx,cy,R){x.save();x.shadowColor='rgba(255,40,40,.9)';x.shadowBlur=R*.8;x.fillStyle=RG(x,cx-R*.2,cy-R*.25,R*.05,R,[[0,'#ffb4a8'],[.35,'#ff3a34'],[.8,'#b80c18'],[1,'#5c0610']]);star5(x,cx,cy,R,R*.42);x.fill();x.shadowBlur=0;
  x.strokeStyle='#f3cf6e';x.lineWidth=R*.09;x.lineJoin='round';x.stroke();x.strokeStyle='rgba(255,220,200,.45)';x.lineWidth=R*.03;
  for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,q=i%2?R*.42:R;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+Math.cos(a)*q,cy+Math.sin(a)*q);x.stroke();}x.restore();}
// грань с подсветкой снизу: (x0..x1, y0 — верх, y1 — низ)
const litFace=(x,x0,x1,y0,y1,top,bot)=>{x.fillStyle=LG(x,0,y1,0,y0,[[0,bot],[1,top]]);x.fillRect(x0,y0,x1-x0,y1-y0);};
const sideFace=(x,x1,y0,y1,dw,dy,top,bot)=>{x.fillStyle=LG(x,0,y1,0,y0,[[0,bot],[1,top]]);x.beginPath();x.moveTo(x1,y1);x.lineTo(x1+dw,y1-dy);x.lineTo(x1+dw,y0-dy);x.lineTo(x1,y0);x.closePath();x.fill();};
function arches(x,x0,x1,y,h,n,col='#1a0806',glow='rgba(255,190,120,.6)'){const w=(x1-x0)/n;for(let i=0;i<n;i++){const ax=x0+i*w+w*.22,aw=w*.56;x.fillStyle=col;x.beginPath();x.moveTo(ax,y);x.lineTo(ax,y-h+aw/2);x.arc(ax+aw/2,y-h+aw/2,aw/2,Math.PI,0);x.lineTo(ax+aw,y);x.closePath();x.fill();x.strokeStyle=glow;x.lineWidth=1.5;x.stroke();}}
function pinnacle(x,cx,by,h,w){x.fillStyle=LG(x,cx-w,0,cx+w,0,[[0,'#cdbba0'],[.5,'#fff3dc'],[1,'#8f7d64']]);x.beginPath();x.moveTo(cx-w,by);x.lineTo(cx,by-h);x.lineTo(cx+w,by);x.closePath();x.fill();
  x.fillStyle=RG(x,cx-1,by-h-3,1,w*.7,[[0,'#fff2b0'],[1,'#b3801c']]);x.beginPath();x.arc(cx,by-h-2,w*.55,0,TAU);x.fill();}
// шатёр (восьмигранная пирамида): три видимые грани
function tent(x,cx,by,w,top,c1='#2f6e4c',c2='#173826'){x.fillStyle=LG(x,cx-w/2,0,cx,0,[[0,c2],[1,c1]]);x.beginPath();x.moveTo(cx-w/2,by);x.lineTo(cx-w*.2,by);x.lineTo(cx,top);x.closePath();x.fill();
  x.fillStyle=LG(x,0,by,0,top,[[0,'#4f9a6c'],[1,c1]]);x.beginPath();x.moveTo(cx-w*.2,by);x.lineTo(cx+w*.22,by);x.lineTo(cx,top);x.closePath();x.fill();
  x.fillStyle=c2;x.beginPath();x.moveTo(cx+w*.22,by);x.lineTo(cx+w/2,by);x.lineTo(cx,top);x.closePath();x.fill();
  x.strokeStyle='rgba(220,255,230,.18)';x.lineWidth=1.5;for(const f of [-.2,.22]){x.beginPath();x.moveTo(cx+w*f,by);x.lineTo(cx,top);x.stroke();}
  x.fillStyle='rgba(255,180,110,.22)';x.beginPath();x.moveTo(cx-w/2,by);x.lineTo(cx+w/2,by);x.lineTo(cx+w*.3,by-(by-top)*.25);x.lineTo(cx-w*.3,by-(by-top)*.25);x.closePath();x.fill();}
function brickLines(x,x0,x1,y0,y1,a=.13){x.save();x.globalAlpha=a;x.fillStyle='#2a0905';for(let y=y0+5;y<y1;y+=9)x.fillRect(x0,y,x1-x0,1.4);x.restore();}

function mSky(){return cache('mSky',WW,HH+600,(x,w,h)=>{
  x.fillStyle=LG(x,0,0,0,h,[[0,'#01020a'],[.3,'#050d26'],[.52,'#0c1b44'],[.64,'#22264c'],[.72,'#5a3a4c'],[.78,'#9a5a44'],[.84,'#3a2026'],[1,'#07050a']]);x.fillRect(0,0,w,h);
  const r=rng(11);for(let i=0;i<260;i++){const px=r()*w,py=r()*h*.5,a=.12+.55*r()*r();x.fillStyle=`rgba(230,235,255,${a})`;x.fillRect(px,py,1.3,1.3);}
  const S=smokeSprites();x.globalCompositeOperation='screen';for(let i=0;i<30;i++){const px=r()*w,py=lp(h*.3,h*.7,r()),q=lp(140,420,r());x.globalAlpha=.05+.09*r();x.drawImage(S[i%4],px-q,py-q*.28,q*2,q*.56);}
  x.globalAlpha=1;x.fillStyle=RG(x,w*.25,h*.76,0,w*.95,[[0,'rgba(255,140,70,.28)'],[1,'rgba(255,140,70,0)']]);x.fillRect(0,0,w,h);});}

// Москва-Сити: башни в дымке (масштаб 1:1 к экрану), MS.reds — красные огни на верхушках
function mCityTex(){return cache('mCity',780,560,(x,w,h)=>{const B=540,r=rng(5);MS.reds=[];
  const T=[[70,64,300,'box'],[150,88,214,'cap'],[262,100,64,'fed'],[340,66,176,'fedw'],[430,84,150,'merc'],[522,78,232,'imp'],[606,66,196,'oko'],[680,60,280,'evo'],[738,44,350,'box']];
  for(const [cx,tw,top,k] of T){const x0=cx-tw/2,x1=cx+tw/2,sd=tw*.3,gold=k==='merc';
    const shape=()=>{x.beginPath();
      if(k==='fed'){x.moveTo(x0,B);x.lineTo(x0,top+70);x.lineTo(cx-4,top);x.lineTo(x1,top+40);x.lineTo(x1,B);}
      else if(k==='fedw'){x.moveTo(x0,B);x.lineTo(x0,top+10);x.lineTo(x1,top+44);x.lineTo(x1,B);}
      else if(k==='imp'){x.moveTo(x0,B);x.lineTo(x0,top+24);x.quadraticCurveTo(cx,top-30,x1,top+24);x.lineTo(x1,B);}
      else if(k==='merc'){x.moveTo(x0,B);x.lineTo(x0+6,top+34);x.lineTo(cx-8,top);x.lineTo(x1-5,top+18);x.lineTo(x1,B);}
      else if(k==='oko'){x.moveTo(x0,B);x.lineTo(x0,top);x.lineTo(x1,top+36);x.lineTo(x1,B);}
      else if(k==='evo'){x.moveTo(x0,B);for(let y=B;y>=top;y-=10)x.lineTo(x0+Math.sin((B-y)/60)*9,y);for(let y=top;y<=B;y+=10)x.lineTo(x1+Math.sin((B-y)/60)*9,y);}
      else if(k==='cap'){x.moveTo(x0,B);x.lineTo(x0,top+110);x.lineTo(x0+14,top+110);x.lineTo(x0+14,top+50);x.lineTo(x0+30,top+50);x.lineTo(x0+30,top);x.lineTo(x1-10,top);x.lineTo(x1-10,top+70);x.lineTo(x1,top+70);x.lineTo(x1,B);}
      else x.rect(x0,top,tw,B-top);
      x.closePath();};
    // боковая грань
    x.fillStyle=gold?'#2a170a':'#070c18';x.beginPath();x.moveTo(x1,B);x.lineTo(x1+sd,B-10);x.lineTo(x1+sd,top+30);x.lineTo(x1,top+20);x.closePath();x.fill();
    x.save();shape();x.fillStyle=LG(x,x0,0,x1,0,gold?[[0,'#6b4524'],[.5,'#9a6a3a'],[1,'#3c2412']]:[[0,'#1f3456'],[.55,'#2c4670'],[1,'#121e36']]);x.fill();x.clip();
    for(let y=top+6;y<B;y+=6){for(let xx=x0;xx<x1;xx+=4){const v=r();if(v<.42)continue;const warm=r()<.25;x.fillStyle=warm?`rgba(255,214,150,${.25+.6*r()})`:`rgba(190,220,255,${.2+.65*r()})`;x.fillRect(xx,y,3,2.4);}}
    x.fillStyle=LG(x,0,top,0,B,[[0,'rgba(150,190,255,.12)'],[1,'rgba(0,0,0,0)']]);x.fillRect(x0,top-40,tw,B-top+40);
    x.restore();
    if(k==='fed'){x.strokeStyle='#9fb6d8';x.lineWidth=2;x.beginPath();x.moveTo(cx-4,top);x.lineTo(cx-4,top-58);x.stroke();MS.reds.push([cx-4,top-60]);}else MS.reds.push([cx,top+(k==='imp'?-6:2)]);}
  // дымка у подножия
  x.fillStyle=LG(x,0,B-190,0,B,[[0,'rgba(120,140,190,0)'],[1,'rgba(120,140,190,.55)']]);x.fillRect(0,B-190,w,190);
  const S=smokeSprites();x.globalCompositeOperation='screen';for(let i=0;i<14;i++){x.globalAlpha=.16;x.drawImage(S[i%4],i*60-80,B-150+(i%3)*22,260,110);}
});}

// Кремль: стена, дворец, соборы, Иван Великий, Спасская башня, Василий Блаженный (масштаб ×2; низ стены — MS.BASE)
function mKremTex(){return cache('mKrem',2400,1760,(x,w,h)=>{const B=MS.BASE,WT=MS.WT;MS.lamps=[];
  // ---- за стеной: Большой Кремлёвский дворец
  litFace(x,40,820,1158,WT,'#a8916a','#f4dcab');
  x.fillStyle='#3b5648';x.beginPath();x.moveTo(30,1160);x.lineTo(830,1160);x.lineTo(806,1132);x.lineTo(54,1132);x.closePath();x.fill();
  for(let i=0;i<36;i++){const wx=58+i*21.5;for(const wy of [1180,1236]){x.fillStyle=`rgba(255,${(196+H1(i*3+wy)*44)|0},120,${(.5+.45*H1(i*7+wy)).toFixed(2)})`;x.fillRect(wx,wy,9,30);}}
  x.fillStyle='#f6e6c0';x.fillRect(380,1110,120,50);dome(x,440,1112,70,70,'gold',.6);
  // ---- Успенский собор: белый объём, 5 золотых глав
  litFace(x,930,1250,1080,WT,'#cdbfa4','#fff1d6');arches(x,945,1235,1180,70,6,'#2a1a10');
  for(const [dx,dw,dh,by] of [[1090,70,108,1000],[1000,52,80,1034],[1180,52,80,1034],[1030,44,66,1060],[1150,44,66,1060]]){litFace(x,dx-dw*.32,dx+dw*.32,by,by+60,'#d8c8a6','#fff3d8');dome(x,dx,by+2,dw,dh,'gold');cross(x,dx,by-dh+2,.9);}
  // ---- Иван Великий
  const IV=760;litFace(x,IV-70,IV+70,1000,WT,'#d9c8a8','#fff2d6');sideFace(x,IV+70,1000,WT,22,6,'#a8977a','#d6c4a2');arches(x,IV-62,IV+62,1110,64,3);arches(x,IV-62,IV+62,1260,70,3);
  litFace(x,IV-58,IV+58,820,1000,'#d2c2a0','#fbedd0');sideFace(x,IV+58,820,1000,18,5,'#9f8f72','#cdbd9c');arches(x,IV-52,IV+52,980,110,3,'#1a0c06','rgba(255,200,130,.9)');
  litFace(x,IV-46,IV+46,680,820,'#cdbd9c','#f6e8cc');arches(x,IV-42,IV+42,808,90,3,'#1a0c06','rgba(255,200,130,.9)');
  litFace(x,IV-32,IV+32,600,680,'#d8c8a8','#f2e2c4');dome(x,IV,604,84,112,'gold');cross(x,IV,494,1.2);
  // ---- стена с «ласточкиными хвостами»
  litFace(x,0,w,WT,B,'#6c2016','#f2905a');brickLines(x,0,w,WT,B);
  for(let mx=-10;mx<w;mx+=64){x.beginPath();x.moveTo(mx,WT+2);x.lineTo(mx,WT-54);x.lineTo(mx+13,WT-54);x.lineTo(mx+20,WT-38);x.lineTo(mx+27,WT-54);x.lineTo(mx+40,WT-54);x.lineTo(mx+40,WT+2);x.closePath();x.fillStyle=LG(x,0,WT-54,0,WT,[[0,'#5a1a12'],[1,'#8e3422']]);x.fill();x.fillStyle='rgba(20,4,2,.55)';x.fillRect(mx+18,WT-30,4,16);}
  x.globalCompositeOperation='screen';for(let lx=60;lx<w;lx+=176){x.fillStyle=RG(x,lx,B,0,250,[[0,'rgba(255,190,120,.5)'],[1,'rgba(255,190,120,0)']]);x.fillRect(lx-250,WT-90,500,B-WT+90);}x.globalCompositeOperation='source-over';
  // ---- малая башня слева (Тайницкая)
  const TA=300;litFace(x,TA-62,TA+62,1080,WT+10,'#6e2216','#c9623a');sideFace(x,TA+62,1080,WT+10,20,6,'#3e120a','#7c2e1a');brickLines(x,TA-62,TA+62,1080,WT);
  x.fillStyle='#efe2c8';x.fillRect(TA-66,1076,132,12);tent(x,TA,1078,140,880);x.fillStyle='#e8c35a';x.fillRect(TA-1.5,846,3,36);
  // ---- Спасская башня
  const S0=1560;
  litFace(x,S0-122,S0+122,902,WT+20,'#6a2014','#e47a4c');sideFace(x,S0+122,902,WT+20,60,14,'#3c1209','#9a3f24');brickLines(x,S0-122,S0+122,902,WT);
  x.fillStyle='rgba(255,236,210,.85)';for(const wy of [1000,1130]){x.fillRect(S0-20,wy,40,64);x.fillStyle='#2a0c06';x.fillRect(S0-12,wy+10,24,48);x.fillStyle='rgba(255,236,210,.85)';}
  litFace(x,S0-128,S0+128,884,908,'#d9ccb4','#fff4e2');sideFace(x,S0+128,884,908,62,14,'#a39684','#cfc2ac');
  litFace(x,S0-100,S0+100,770,886,'#7c2818','#d26038');sideFace(x,S0+100,770,886,50,12,'#401309','#8a361f');arches(x,S0-96,S0+96,880,46,5,'#3a0f08','rgba(255,220,180,.7)');
  for(const px of [S0-104,S0+104,S0-52,S0+52])pinnacle(x,px,890,px===S0-104||px===S0+104?190:120,11);
  litFace(x,S0-88,S0+88,602,772,'#7a2617','#c65530');sideFace(x,S0+88,602,772,44,10,'#3e1208','#7a2e18');
  x.fillStyle='#d4b45a';x.beginPath();x.arc(S0,688,74,0,TAU);x.fill();x.fillStyle=RG(x,S0-20,668,4,66,[[0,'#2d3954'],[1,'#080d1c']]);x.beginPath();x.arc(S0,688,64,0,TAU);x.fill();
  for(let i=0;i<12;i++){const a=i/12*TAU;x.fillStyle='#f3d57e';x.beginPath();x.arc(S0+Math.cos(a)*52,688+Math.sin(a)*52,i%3?3.2:5.5,0,TAU);x.fill();}
  x.strokeStyle='#f3d57e';x.lineCap='round';x.lineWidth=6;x.beginPath();x.moveTo(S0,688);x.lineTo(S0+Math.cos(-2.3)*30,688+Math.sin(-2.3)*30);x.stroke();x.lineWidth=4;x.beginPath();x.moveTo(S0,688);x.lineTo(S0+Math.cos(-1.05)*46,688+Math.sin(-1.05)*46);x.stroke();
  litFace(x,S0-70,S0+70,505,604,'#e5d6bb','#fff6e6');sideFace(x,S0+70,505,604,30,8,'#a89a86','#d4c6b0');arches(x,S0-66,S0+66,596,74,4,'#2a0e08','rgba(255,210,150,.9)');
  for(const px of [S0-74,S0+74])pinnacle(x,px,508,70,8);
  litFace(x,S0-52,S0+52,452,507,'#7a2a1a','#b9553a');sideFace(x,S0+52,452,507,22,6,'#3c1209','#6a2614');arches(x,S0-48,S0+48,503,40,3,'#2a0e08','rgba(255,210,150,.8)');
  tent(x,S0+6,456,124,250);
  x.fillStyle='#d4b45a';x.fillRect(S0+3,226,6,28);
  rubyStar(x,S0+6,188,46);MS.star=[S0+6,188];
  // ---- Василий Блаженный (перед стеной, справа)
  const BX=2060;
  litFace(x,1790,2360,1360,B,'#7c2a1a','#e97a4a');brickLines(x,1790,2360,1360,B);arches(x,1800,2350,B-6,92,9,'#1e0a06','rgba(255,210,160,.8)');
  x.fillStyle='#f2e6cf';for(let i=0;i<9;i++)x.fillRect(1800+i*62,1366,46,10);
  litFace(x,BX-70,BX+70,1070,1362,'#8a3a26','#e8885a');sideFace(x,BX+70,1070,1362,24,6,'#4a180d','#9a4a2a');
  for(let j=0;j<3;j++){x.fillStyle='#f4e8d2';for(let i=0;i<4;i++){const kx=BX-62+i*34,ky=1080+j*90;x.beginPath();x.moveTo(kx,ky+40);x.lineTo(kx,ky+14);x.quadraticCurveTo(kx+15,ky-6,kx+30,ky+14);x.lineTo(kx+30,ky+40);x.closePath();x.fill();}}
  x.save();x.beginPath();x.moveTo(BX-74,1074);x.lineTo(BX+74,1074);x.lineTo(BX+6,760);x.lineTo(BX-6,760);x.closePath();x.clip();
  x.fillStyle='#c9472a';x.fillRect(BX-80,756,160,320);x.fillStyle='#f5ebd8';for(let j=0;j<16;j++)for(let i=-4;i<5;i++){const px=BX+i*20+(j%2)*10,py=1060-j*19;x.beginPath();x.moveTo(px,py-7);x.lineTo(px+7,py);x.lineTo(px,py+7);x.lineTo(px-7,py);x.closePath();x.fill();}
  x.fillStyle='#2f7a48';for(let j=0;j<16;j+=2)for(let i=-4;i<5;i+=2){const px=BX+i*20,py=1060-j*19;x.beginPath();x.arc(px,py,3,0,TAU);x.fill();}
  x.globalCompositeOperation='multiply';x.fillStyle=LG(x,BX-74,0,BX+74,0,[[0,'#5a5a6a'],[.4,'#fff'],[1,'#3a3a48']]);x.fillRect(BX-80,756,160,320);x.restore();
  dome(x,BX,764,46,70,'gold');cross(x,BX,694,1);
  for(const [dx,by,dw,dh,k] of [[1880,1150,118,150,'gy'],[1976,1104,104,134,'rw'],[2178,1112,112,146,'bw'],[2286,1160,100,128,'gs'],[2366,1200,84,110,'tw']]){
    litFace(x,dx-dw*.33,dx+dw*.33,by,by+120,'#8e3a24','#e4794a');arches(x,dx-dw*.3,dx+dw*.3,by+110,40,2,'#2a0e08','rgba(255,210,160,.9)');
    dome(x,dx,by+4,dw,dh,k);x.fillStyle='#e8c35a';x.beginPath();x.arc(dx,by-dh+4,5,0,TAU);x.fill();cross(x,dx,by-dh+2,.95);}
  // ---- набережная: дорога, гранит, фонари
  x.fillStyle='#0d0a0a';x.fillRect(0,B,w,40);x.fillStyle=LG(x,0,B+40,0,MS.WL,[[0,'#3a2c26'],[1,'#120d0c']]);x.fillRect(0,B+40,w,MS.WL-B-40);
  x.fillStyle='rgba(255,200,140,.22)';x.fillRect(0,B+40,w,3);
  for(let lx=40;lx<w;lx+=150){x.fillStyle='#1a1412';x.fillRect(lx-2,B-70,4,72);x.fillStyle='#fff1d0';x.beginPath();x.arc(lx,B-74,6,0,TAU);x.fill();MS.lamps.push([lx,B-74]);}
});}
// отражение Кремля в реке: перевёрнуто, сжато, размыто, темнее (масштаб ×2 как у Кремля)
function mReflTex(){return cache('mRefl',1200,700,(x,w,h)=>{const k=mKremTex();x.save();x.filter='blur(3px) brightness(.7) saturate(1.3)';x.translate(0,0);x.scale(.5,-.42);
  for(let i=0;i<9;i++){x.globalAlpha=i?.16:1;x.drawImage(k,0,-MS.WL+i*14);}x.restore();x.filter='none';
  x.globalCompositeOperation='multiply';x.fillStyle=LG(x,0,0,0,h,[[0,'#6a7088'],[1,'#141826']]);x.fillRect(0,0,w,h);});}

// кадр Москвы. o: {Z,X,Y — камера, fg — парапет моста на переднем плане, n29:[t0,t1] — «29», t0 — начало}
function moscow(c,t,u,o={}){const Z=o.Z||0,X=o.X||0,Y=o.Y||0,kK=MS.zK/(MS.zK-Z),kC=MS.zC/(MS.zC-Z);
  c.drawImage(mSky(),0,-360-Y*.08);
  // Сити
  const ct=mCityTex(),cxs=540+(200-540)*kC-X*kC*MS.zK/MS.zC,cys=960+(1128-960)*kC-Y*kC*MS.zK/MS.zC,cs=kC*.74;
  c.save();c.globalAlpha=.78;c.drawImage(ct,cxs-390*cs,cys-540*cs,780*cs,560*cs);c.restore();
  c.save();c.globalCompositeOperation='screen';c.fillStyle=LG(c,0,cys-420*cs,0,cys,[[0,'rgba(90,110,160,0)'],[1,'rgba(110,130,180,.38)']]);c.fillRect(0,cys-420*cs,WW,420*cs);c.restore();
  for(const [rx,ry] of MS.reds){const bl=.5+.5*Math.sin(t*3.1+rx*.07);glowDot(c,cxs+(rx-390)*cs,cys+(ry-540)*cs,12+8*bl,'#ff2a2a',.45+.4*bl);}
  fog(c,t,cys-60,{n:12,sp:14,h:90,r:300,a:.14,seed:3});
  // Кремль
  const kt=mKremTex(),s=.78*kK,sx=540-X*kK,sy=960+(1290-960)*kK-Y*kK,dx=sx-1760*s,dy=sy-MS.BASE*s;
  c.drawImage(kt,dx,dy,kt.width*s,kt.height*s);
  // подсветка: лучи прожекторов вверх по башням, свечение звезды
  beam(c,dx+1560*s,dy+(MS.WT-10)*s,Math.PI,.34,520*s,'#ffc890',.5);beam(c,dx+760*s,dy+(MS.WT-10)*s,Math.PI,.3,560*s,'#ffd8a0',.35);
  const [stx,sty]=MS.star;const sp=.7+.3*Math.sin(t*2.2);glowDot(c,dx+stx*s,dy+sty*s,150*s,'#ff3030',.6*sp);glowDot(c,dx+stx*s,dy+sty*s,46*s,'#ffd0c0',.5);
  for(const [lx,ly] of MS.lamps)glowDot(c,dx+lx*s,dy+ly*s,26*s,'#ffd9a0',.7);
  // машины по набережной
  c.save();c.globalCompositeOperation='screen';for(let i=0;i<16;i++){const dir=i%2?1:-1,sp=(260+200*H1(i*3.3))*dir,x0=((H1(i*7.1)*2400+t*sp)%2600+2600)%2600-100,yy=dy+(MS.BASE+(dir>0?14:28))*s,col=dir>0?'255,60,40':'255,240,220';
    c.fillStyle=LG(c,dx+x0*s,0,dx+(x0-dir*90)*s,0,[[0,`rgba(${col},.95)`],[1,`rgba(${col},0)`]]);c.fillRect(Math.min(dx+x0*s,dx+(x0-dir*90)*s),yy-3*s,90*s,6*s);}c.restore();
  // река: отражение полосами с рябью
  const wy=dy+MS.WL*s;c.fillStyle=LG(c,0,wy,0,HH,[[0,'#0a1020'],[1,'#03050b']]);c.fillRect(0,wy,WW,HH-wy+2);
  const rf=mReflTex(),rs=2*s,n=Math.ceil((HH-wy)/3)+1;
  for(let i=0;i<n;i++){const y0=i*3,sy0=y0/rs;if(sy0>=rf.height)break;const k=y0/(HH-wy+1),off=Math.sin(t*1.7+y0*.045)*(1.5+9*k)+Math.sin(t*2.9+y0*.13)*(.8+3*k);c.globalAlpha=.9-.55*k;c.drawImage(rf,0,sy0,rf.width,3/rs,dx+off,wy+y0,rf.width*rs,3.4);}
  c.globalAlpha=1;
  c.save();c.globalCompositeOperation='screen';const r=rng(77);for(let i=0;i<90;i++){const px=r()*WW,py=wy+20+Math.pow(r(),1.6)*(HH-wy),fl=Math.sin(t*6+i*1.7);if(fl<.2)continue;c.globalAlpha=.3*fl;c.fillStyle=i%5?'#ffcf96':'#ff6b5a';c.fillRect(px,py,8+r()*30,1.6);}c.restore();
  // «29»: объёмные цифры над городом
  if(o.n29){const [a,b]=o.n29;if(t>=a-.02&&t<b+.4){const sp=spr(cl((t-a)/.5)),out=cl((t-b)/.38),sc=lp(.35,1,sp)*lp(1,2.8,ei(out)),al=cl((t-a)/.07)*(1-ss(.3,1,out));
    const O29={f:'T',w:900,s:330,depth:34,dir:[.35,1],face:['#fff6d8','#ffd27a','#e09a2e','#a4661a'],side:['#7a4a12','#1e1004']},sprt=ext3('n29','29',O29);
    c.save();c.globalAlpha=al;c.translate(540,lp(600,520,eo(cl((t-a)/1.2))));c.rotate(-.04+.02*Math.sin(t*1.4));c.scale(sc,sc);c.shadowColor='rgba(255,170,60,.55)';c.shadowBlur=40;c.drawImage(sprt,-sprt.width/2,-sprt.height/2);c.restore();
    if(al>.05&&out<.2)extShine(c,'n29','29',O29,540,lp(600,520,eo(cl((t-a)/1.2))),sc,cl((t-a-.15)/.6),.8);}}
  // парапет моста и фонарь на переднем плане (размыт)
  if(o.fg){const kF=900/(900-Z*.9),a=o.fg;c.save();c.globalAlpha=a;c.filter='blur(7px)';
    const by=HH-110+(kF-1)*520;c.fillStyle=LG(c,0,by-60,0,HH,[[0,'#2a2220'],[1,'#0a0808']]);c.fillRect(-40,by-40,WW+80,HH-by+80);
    c.fillStyle='#1a1514';const lx=150-(kF-1)*420;c.fillRect(lx-16,by-640*kF,32,700*kF);c.restore();
    glowDot(c,lx,by-660*kF,90*kF,'#ffd29a',.8*a);}
}

/* ================= 2. СТОЛ ================= */
// стол — плоскость y=0: x∈[-1400,1400], z∈[-400,3200]; текстура 0,5 пикс. на единицу
const DESK={O:[-1400,0,-400],U:[2800,0,0],V:[0,0,3600]};
const sunAt=(x,z)=>{const q=(x*.5+z*.86)/300,f=q-Math.floor(q);return .7*ss(.0,.2,f)*(1-ss(.42,.62,f));};
function deskTex(day){return cache('desk'+(day?'d':'n'),1400,1800,(x,w,h)=>{const r=rng(3);
  x.fillStyle=day?'#4a2c18':'#2e1b10';x.fillRect(0,0,w,h);
  for(let i=0;i<700;i++){const gx=r()*w,amp=5+r()*16,ph=r()*TAU,dark=r()<.5;x.strokeStyle=dark?`rgba(20,10,4,${.12+.2*r()})`:`rgba(${day?'150,92,52':'110,66,36'},${.1+.18*r()})`;x.lineWidth=1.4+r()*3;
    x.beginPath();for(let y=0;y<=h;y+=20){const xx=gx+Math.sin(y/170+ph)*amp+Math.sin(y/47+ph*2)*amp*.3;y?x.lineTo(xx,y):x.moveTo(xx,y);}x.stroke();}
  x.globalAlpha=.22;x.globalCompositeOperation='overlay';x.drawImage(noiseTex('dk',256,256,14,4),0,0,w,h);x.globalAlpha=1;x.globalCompositeOperation='source-over';
  // кожаная подкладка под пропуском и договором
  const px0=(-560+1400)/2,pz0=(300+400)/2,pw=1120/2,pd=1700/2;
  x.fillStyle='#0c0c0f';RR(x,px0,pz0,pw,pd,10);x.fill();x.globalAlpha=.35;x.globalCompositeOperation='overlay';x.drawImage(noiseTex('lea',256,256,4,3),px0,pz0,pw,pd);x.globalAlpha=1;x.globalCompositeOperation='source-over';
  x.strokeStyle='rgba(200,200,210,.22)';x.setLineDash([5,4]);x.lineWidth=1.2;RR(x,px0+9,pz0+9,pw-18,pd-18,6);x.stroke();x.setLineDash([]);
  x.fillStyle=LG(x,px0,0,px0+pw,0,[[0,'rgba(255,255,255,0)'],[.5,'rgba(255,255,255,.04)'],[1,'rgba(255,255,255,0)']]);x.fillRect(px0,pz0,pw,pd);
  x.filter='blur(1.2px)';x.drawImage(x.canvas,0,0);x.filter='none';
  if(day){const im=x.getImageData(0,0,w,h),d=im.data;for(let j=0;j<h;j++)for(let i=0;i<w;i++){const s=sunAt(i*2-1400,j*2-400);if(s<=0)continue;const p=(j*w+i)*4;d[p]=Math.min(255,d[p]*(1+1.5*s)+42*s);d[p+1]=Math.min(255,d[p+1]*(1+1.25*s)+26*s);d[p+2]=Math.min(255,d[p+2]*(1+.8*s)+10*s);}x.putImageData(im,0,0);}
});}
function deskDraw(c,cam,day){texPlane(c,cam,deskTex(day),DESK.O,DESK.U,DESK.V,10,12);}

// фото Козловского (кадр фильма) с лёгкой «печатью»
let KZ=null;
// пропуск MEGAPOLIS BANK · TOP EXECUTIVE (текстура 760×1210)
function badgeTex(){return cache('badge',760,1210,(x,w,h)=>{
  x.fillStyle=LG(x,0,0,w,h,[[0,'#13284f'],[.55,'#0a1834'],[1,'#060f22']]);x.fillRect(0,0,w,h);
  x.strokeStyle='rgba(218,182,96,.09)';x.lineWidth=1.2;for(let i=0;i<46;i++){x.beginPath();for(let xx=0;xx<=w;xx+=10){const y=i*28+Math.sin(xx/38+i*.6)*10;xx?x.lineTo(xx,y):x.moveTo(xx,y);}x.stroke();}
  x.fillStyle='rgba(0,0,0,.28)';x.fillRect(0,0,w,196);x.fillStyle=LG(x,0,192,w,192,[[0,'#7a5a1c'],[.5,'#f2d27e'],[1,'#7a5a1c']]);x.fillRect(0,192,w,4);
  // прорезь под клипсу
  x.fillStyle='#03050a';RR(x,w/2-56,26,112,26,13);x.fill();x.strokeStyle='rgba(255,255,255,.12)';x.lineWidth=2;x.stroke();
  // эмблема и название банка
  const gold=LG(x,0,70,0,170,[[0,'#fff1c0'],[.5,'#e2b558'],[1,'#9a6c1e']]);
  x.strokeStyle=gold;x.lineWidth=5;x.beginPath();x.arc(140,120,44,0,TAU);x.stroke();
  x.fillStyle=gold;x.font='800 54px Man';x.textAlign='center';x.textBaseline='middle';x.fillText('M',140,122);
  x.textAlign='left';x.font='800 58px Man';x.letterSpacing='8px';x.fillText('MEGAPOLIS',212,108);
  x.font='600 26px Man';x.letterSpacing='18px';x.fillStyle='rgba(230,200,130,.9)';x.fillText('BANK · MOSCOW',214,160);x.letterSpacing='0px';
  // фото
  const PX=170,PY=236,PW=420,PH=520;x.fillStyle=LG(x,0,PY,0,PY+PH,[[0,'#c9d2e0'],[1,'#8e9ab0']]);x.fillRect(PX,PY,PW,PH);
  if(KZ){x.save();x.beginPath();x.rect(PX,PY,PW,PH);x.clip();x.filter='saturate(.82) contrast(1.06) brightness(1.04)';const k=Math.max(PW/KZ.width,PH/KZ.height)*1.02;x.drawImage(KZ,PX+PW/2-KZ.width*k/2,PY+PH/2-KZ.height*k/2+8,KZ.width*k,KZ.height*k);x.restore();x.filter='none';}
  x.strokeStyle=gold;x.lineWidth=5;x.strokeRect(PX-3,PY-3,PW+6,PH+6);
  // голограмма поверх фото
  x.save();x.globalCompositeOperation='screen';x.globalAlpha=.18;x.fillStyle=LG(x,PX+PW-150,PY+PH-150,PX+PW,PY+PH,[[0,'#ff5cf0'],[.33,'#5cf5ff'],[.66,'#fff35c'],[1,'#5cff9a']]);x.beginPath();x.arc(PX+PW-60,PY+PH-60,70,0,TAU);x.fill();x.restore();
  // имя скрыто (развязка в конце ролика)
  x.save();x.translate(w/2,822);x.rotate(-.012);x.fillStyle='#020306';x.fillRect(-224,-30,448,60);x.restore();
  x.font='600 22px Man';x.letterSpacing='8px';x.fillStyle='rgba(170,190,225,.75)';x.textAlign='center';x.fillText('NAME',w/2,776);
  x.font='800 62px Man';x.letterSpacing='5px';x.fillStyle=gold;x.fillText('TOP EXECUTIVE',w/2,926);
  x.font='600 24px Man';x.letterSpacing='9px';x.fillStyle='rgba(170,190,225,.85)';x.fillText('INVESTMENT DIVISION',w/2,982);x.letterSpacing='0px';
  // низ: штрихкод, номер, голограмма
  x.fillStyle='rgba(0,0,0,.25)';x.fillRect(0,1030,w,h-1030);
  x.fillStyle='#e9eef8';const rr=rng(4);let bx=60;while(bx<430){const bw=2+Math.floor(rr()*4);x.fillRect(bx,1062,bw,84);bx+=bw+2+Math.floor(rr()*4);}
  x.font='600 22px JBM';x.letterSpacing='6px';x.fillStyle='rgba(200,212,235,.8)';x.textAlign='left';x.fillText('ID 0418 · ALL FLOORS',60,1182);x.letterSpacing='0px';
  const hg=x.createConicGradient(0,620,1110);for(const [o,col] of [[0,'#ff7af0'],[.2,'#7ae8ff'],[.4,'#f6ff7a'],[.6,'#7affb0'],[.8,'#a07aff'],[1,'#ff7af0']])hg.addColorStop(o,col);
  x.fillStyle=hg;x.globalAlpha=.85;x.beginPath();x.arc(620,1110,58,0,TAU);x.fill();x.globalAlpha=1;x.strokeStyle='rgba(255,255,255,.5)';x.lineWidth=2;x.stroke();
  x.font='800 30px Man';x.fillStyle='rgba(20,24,40,.55)';x.textAlign='center';x.fillText('M',620,1121);
});}
// лента от пропуска (на столе)
function lanyard(c,cam,pts,w){const L=[],R=[];for(let i=0;i<pts.length;i++){const a=pts[Math.max(0,i-1)],b=pts[Math.min(pts.length-1,i+1)],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz)||1,nx=-dz/l*w/2,nz=dx/l*w/2;L.push(cam.P(pts[i][0]+nx,-1.5,pts[i][1]+nz));R.push(cam.P(pts[i][0]-nx,-1.5,pts[i][1]-nz));}
  c.save();c.beginPath();c.moveTo(L[0][0],L[0][1]);for(const p of L)c.lineTo(p[0],p[1]);for(let i=R.length-1;i>=0;i--)c.lineTo(R[i][0],R[i][1]);c.closePath();
  c.fillStyle='#0f1f44';c.fill();c.clip();c.strokeStyle='rgba(226,190,110,.55)';c.lineWidth=2;c.beginPath();for(let i=0;i<L.length;i++){const p=[(L[i][0]*.8+R[i][0]*.2),(L[i][1]*.8+R[i][1]*.2)];i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}c.stroke();
  c.beginPath();for(let i=0;i<L.length;i++){const p=[(L[i][0]*.2+R[i][0]*.8),(L[i][1]*.2+R[i][1]*.8)];i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}c.stroke();c.restore();}
// ручка (лежит на столе или в руке): кончик (x,y), направление ang, длина L (экран)
function penDraw(c,x,y,ang,L,o={}){c.save();c.translate(x,y);c.rotate(ang);const w=L*.06;
  // перо
  c.fillStyle=LG(c,0,-w*.4,0,w*.4,[[0,'#8a6418'],[.45,'#fff0b8'],[1,'#7a5410']]);c.beginPath();c.moveTo(0,0);c.lineTo(L*.09,-w*.42);c.lineTo(L*.13,-w*.42);c.lineTo(L*.13,w*.42);c.lineTo(L*.09,w*.42);c.closePath();c.fill();
  const cyl=(x0,x1,ww,c0,c1,c2)=>{c.fillStyle=LG(c,0,-ww/2,0,ww/2,[[0,c0],[.32,c1],[.55,c2],[1,c0]]);RR(c,x0,-ww/2,x1-x0,ww,ww*.3);c.fill();};
  cyl(L*.12,L*.3,w*.92,'#050506','#4a4a52','#101012');cyl(L*.29,L*.32,w*1.02,'#5a4210','#ffe9a6','#b88a2a');
  cyl(L*.31,L*.86,w,'#040405','#5a5a64','#0e0e10');cyl(L*.62,L*.66,w*1.06,'#5a4210','#ffe9a6','#b88a2a');cyl(L*.66,L,w*1.08,'#040405','#5a5a64','#0e0e10');
  c.fillStyle=LG(c,0,-w*.85,0,-w*.35,[[0,'#7a5a1a'],[.5,'#ffe7a0'],[1,'#8a6a20']]);RR(c,L*.7,-w*.8,L*.24,w*.34,w*.17);c.fill();
  c.restore();}
// правая рука с ручкой, как пишут (кончик пера в (x,y)), ang — направление ручки от кончика, s — масштаб
// правая рука с ручкой, как пишут: кончик пера в (x,y), ang — направление ручки от кончика (экран), s — масштаб
function penHand(c,x,y,ang,s,o={}){const ca=Math.cos(ang),sa=Math.sin(ang),Ls=[-.6,-.8],L=[Ls[0]*ca+Ls[1]*sa,-Ls[0]*sa+Ls[1]*ca];
  c.save();c.translate(x,y);c.rotate(ang);c.scale(s,s);
  c.save();c.filter='blur(16px)';c.fillStyle='rgba(30,16,8,.34)';c.beginPath();c.ellipse(300,40,190,95,.2,0,TAU);c.fill();c.restore();
  sleeve(c,420,-20,430,40,176,L);
  tube(c,[[282,-120],[238,-134],[212,-120]],27,21,L);tube(c,[[252,-100],[205,-112],[178,-96]],30,24,L);
  tube(c,[[228,-70],[160,-56],[104,-34]],31,25,L,{joints:[1]});
  blob(c,[[196,24],[206,-28],[222,-70],[238,-100],[262,-120],[306,-130],[372,-110],[424,-62],[436,2],[410,46],[330,64],[252,54]],L,{tendons:[[240,-60,300,-58,390,-40],[232,-20,300,-10,392,0]]});
  penDraw(c,0,0,0,330);
  tube(c,[[206,30],[150,42],[92,24]],38,29,L,{nail:{side:1,k:.78},joints:[1]});
  tube(c,[[214,-32],[150,-18],[98,-8],[58,-2]],32,24,L,{nail:{side:-1,k:.82},joints:[1,2]});
  c.restore();}
const SIGP=(()=>{const a=[];for(let i=0;i<=160;i++){const s=i/160,x=20+330*s+16*Math.sin(s*Math.PI*11),y=-28*Math.abs(Math.sin(s*Math.PI*5.5))*(1-s*.35)+8*Math.sin(s*Math.PI*3);a.push([x,y]);}
  for(let i=0;i<=30;i++){const s=i/30;a.push([350-260*s,10+6*Math.sin(s*Math.PI)]);}return a;})();

// договор (лист A4, мир 600×848; текстура 1500×2120)
function contractTex(){return cache('contract',1500,2120,(x,w,h)=>{
  x.fillStyle='#f5f0e5';x.fillRect(0,0,w,h);x.globalAlpha=.12;x.drawImage(noiseTex('pap',256,256,6,3),0,0,w,h);x.globalAlpha=1;
  x.fillStyle=RG(x,w/2,h/2,h*.3,h*.8,[[0,'rgba(0,0,0,0)'],[1,'rgba(90,70,40,.12)']]);x.fillRect(0,0,w,h);
  const ink='#26242a';x.fillStyle=ink;x.textAlign='center';
  x.font='700 34px Man';x.letterSpacing='14px';x.fillStyle='#8a6a2a';x.fillText('MEGAPOLIS BANK',w/2,170);
  x.font='800 84px Play';x.letterSpacing='2px';x.fillStyle=ink;x.fillText('INVESTMENT AGREEMENT',w/2,300);
  x.font='500 34px Man';x.letterSpacing='6px';x.fillStyle='#5a5660';x.fillText('No. 0418/12  ·  MOSCOW',w/2,370);x.letterSpacing='0px';
  x.fillStyle='rgba(40,38,46,.85)';const r=rng(8);for(let p=0;p<4;p++){const y0=470+p*150;for(let l=0;l<4;l++){const wl=l===3?400+r()*500:1180+r()*60;x.fillRect(160,y0+l*34,wl,12);}}
  // сумма
  x.strokeStyle='#26242a';x.lineWidth=3;x.strokeRect(160,1100,1180,210);x.font='600 30px Man';x.letterSpacing='10px';x.fillStyle='#5a5660';x.textAlign='left';x.fillText('TOTAL AMOUNT',200,1160);
  x.font='800 112px Man';x.letterSpacing='0px';x.fillStyle=ink;x.fillText('$1,000,000.00',200,1275);
  x.fillStyle='rgba(40,38,46,.8)';for(let l=0;l<3;l++)x.fillRect(160,1380+l*34,l===2?600:1180,12);
  // подписи
  x.font='600 28px Man';x.letterSpacing='6px';x.fillStyle='#5a5660';x.fillText('FOR MEGAPOLIS BANK',160,1640);x.fillText('TOP EXECUTIVE',820,1640);x.letterSpacing='0px';
  x.strokeStyle='#26242a';x.lineWidth=2.5;x.beginPath();x.moveTo(160,1820);x.lineTo(660,1820);x.moveTo(820,1820);x.lineTo(1340,1820);x.stroke();
  // подпись банка и синяя печать
  x.strokeStyle='#1b2c78';x.lineWidth=5;x.lineCap='round';x.beginPath();for(let i=0;i<=60;i++){const s=i/60,px=200+380*s,py=1790-30*Math.abs(Math.sin(s*Math.PI*4))+10*Math.sin(s*9);i?x.lineTo(px,py):x.moveTo(px,py);}x.stroke();
  x.save();x.translate(520,1760);x.rotate(-.25);x.globalAlpha=.62;x.strokeStyle='#2a3fa8';x.lineWidth=7;x.beginPath();x.arc(0,0,96,0,TAU);x.stroke();x.lineWidth=3;x.beginPath();x.arc(0,0,72,0,TAU);x.stroke();
  x.fillStyle='#2a3fa8';x.font='800 26px Man';x.textAlign='center';x.fillText('MEGAPOLIS',0,-8);x.font='700 20px Man';x.fillText('BANK · 2012',0,24);x.restore();
  x.font='500 26px JBM';x.fillStyle='#5a5660';x.textAlign='left';x.fillText('Date: 14.04.2012',820,1880);
});}
// договор на столе: левый верх листа — (x0,z0), поворот 0
const CON={x0:-300,z0:520,w:600,d:848};
function conPt(px,py){return [CON.x0+px/2.5,CON.z0+CON.d-py/2.5];} // пиксель текстуры → (x, z); верх листа — дальний край
function contractDraw(c,cam,o={}){const T=contractTex(),O=[CON.x0,-.6,CON.z0+CON.d];
  // тень листа
  const sh=[cam.P(CON.x0+18,0,CON.z0+16),cam.P(CON.x0+CON.w+22,0,CON.z0+16),cam.P(CON.x0+CON.w+22,0,CON.z0+CON.d+22),cam.P(CON.x0+18,0,CON.z0+CON.d+22)];
  c.save();c.filter='blur(16px)';c.fillStyle='rgba(0,0,0,.5)';PP(c,sh);c.fill();c.restore();
  texPlane(c,cam,T,O,[CON.w,0,0],[0,0,-CON.d],8,10);}

// сцена «пропуск на столе». o: {K — ключи камеры, sheen:[t0,t1]}
// сцена «пропуск на столе». o: {K — ключи камеры, sh0, sh1 — блик}
function badgeScene(c,t,u,o={}){if(!KZ)KZ=MEDIA.kz;
  const cm=camKeys(o.K||[[0,lookAt([-150,-600,420],[-40,0,930],1500,-.05)],[1.7,lookAt([-60,-560,500],[-30,0,935],1500,-.015)]],u,t=>eo(t)),cam=cam3(cm);
  c.fillStyle='#0c0805';c.fillRect(0,0,WW,HH);deskDraw(c,cam,false);
  const p0=cam.P(250,-9,760),p1=cam.P(150,-9,1250);penShadow(c,cam,[250,760],[150,1250]);penDraw(c,p0[0],p0[1],Math.atan2(p1[1]-p0[1],p1[0]-p0[0]),Math.hypot(p1[0]-p0[0],p1[1]-p0[1]));
  const bd={x:-30,z:930,w:324,d:516,h:4,r:22,a:-.16,top:badgeTex(),side0:'#05070c',side1:'#4a5a7a',shOff:[26,0,-30],nx:6,ny:9};
  const tp=[bd.x+Math.sin(bd.a)*(bd.d/2-20),bd.z+Math.cos(bd.a)*(bd.d/2-20)];
  lanyard(c,cam,[tp,[tp[0]+40,tp[1]+190],[tp[0]-60,tp[1]+380],[tp[0]-260,tp[1]+520],[tp[0]-520,tp[1]+560]],40);
  slabShadow(c,cam,bd,16,.6);const T=slab(c,cam,bd);
  sheen(c,T,ss(o.sh0??.15,o.sh1??1.5,u),.42,1.1,.12);
  c.save();c.globalCompositeOperation='multiply';c.fillStyle=RG(c,560,880,100,1100,[[0,'rgb(255,244,230)'],[1,'rgb(70,60,54)']]);c.fillRect(0,0,WW,HH);c.restore();
  c.save();c.globalCompositeOperation='screen';c.fillStyle=RG(c,480,700,0,700,[[0,'rgba(255,196,120,.22)'],[1,'rgba(255,196,120,0)']]);c.fillRect(0,0,WW,HH);c.restore();
  dof(c,{px:18,top:1,m0:.26,m1:.74,bot:.6});vignette(c,.6);}
function penShadow(c,cam,a,b){const p=cam.P(a[0]+14,0,a[1]+10),q=cam.P(b[0]+14,0,b[1]+10);c.save();c.filter='blur(7px)';c.strokeStyle='rgba(0,0,0,.55)';c.lineCap='round';c.lineWidth=18*p[3];c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(q[0],q[1]);c.stroke();c.restore();}

// сцена «подпись договора». o: {K, sig:[t0,t1], gold:[t0,t1], hand:true, day:true}
// сцена «подпись договора». o: {K — ключи камеры, sig:[t0,t1], gold:[t0,…], app:[t0,t1] — рука подходит, hand, day}
function signScene(c,t,u,o={}){
  const cm=camKeys(o.K||[[0,lookAt([150,-700,300],[40,0,780],1500,-.03)],[2.4,lookAt([90,-640,380],[50,0,790],1500,-.01)]],u,t=>eio(t)),cam=cam3(cm);
  c.fillStyle='#120a05';c.fillRect(0,0,WW,HH);deskDraw(c,cam,o.day!==false);contractDraw(c,cam);
  // солнце через жалюзи: мягкие полосы поверх листа
  if(o.day!==false){c.save();c.globalCompositeOperation='soft-light';for(let i=-3;i<8;i++){const z=CON.z0+i*260;const q=[cam.P(CON.x0-300,-.8,z),cam.P(CON.x0+CON.w+300,-.8,z+170),cam.P(CON.x0+CON.w+300,-.8,z+170+120),cam.P(CON.x0-300,-.8,z+120)];c.filter='blur(10px)';c.fillStyle='rgba(255,228,180,.5)';PP(c,q);c.fill();}c.filter='none';c.restore();}
  // подпись: по точкам SIGP вдоль линии «TOP EXECUTIVE»
  const k=o.sig?cl((t-o.sig[0])/(o.sig[1]-o.sig[0])):1,n=Math.max(1,Math.floor(SIGP.length*k));
  const SP=SIGP.slice(0,n).map(p=>{const w=conPt(850+p[0]*1.3,1806+p[1]*1.3);return cam.P(w[0],-.7,w[1]);});
  c.save();c.strokeStyle='#1b2f86';c.lineCap='round';c.lineJoin='round';for(let i=1;i<SP.length;i++){c.lineWidth=(2.6+1.3*Math.sin(i*.7))*SP[i][3];c.beginPath();c.moveTo(SP[i-1][0],SP[i-1][1]);c.lineTo(SP[i][0],SP[i][1]);c.stroke();}c.restore();
  // золотая сумма встаёт со строки «$1,000,000.00»
  if(o.gold&&t>=o.gold[0]){const g=cl((t-o.gold[0])/.6),phi=lp(0,1.26,spr(g)),hgt=150,wd=540,a0=conPt(160,1306),z0=a0[1],x0=-wd/2,y0=-1;
    const OG={f:'O',w:700,s:180,depth:22,dir:[0,1],face:['#fff7d6','#ffd36e','#e2a238','#9a6418'],side:['#6a3e0c','#1c0f03']},spr0=ext3('mil','$1,000,000',OG);
    const crop=mkcOnce('milt',spr0.width,spr0.height),tmp=crop.getContext('2d');reset(tmp);tmp.clearRect(0,0,crop.width,crop.height);tmp.drawImage(spr0,0,0);tmp.globalCompositeOperation='source-atop';const bx=lp(-.3,1.3,cl((t-o.gold[0]-.35)/.7))*spr0.width;tmp.fillStyle=LG(tmp,bx-160,0,bx+160,0,[[0,'rgba(255,255,255,0)'],[.5,'rgba(255,255,235,.85)'],[1,'rgba(255,255,255,0)']]);tmp.fillRect(0,0,crop.width,crop.height);tmp.globalCompositeOperation='source-over';
    const O=[x0,y0-hgt*Math.sin(phi),z0+hgt*Math.cos(phi)],U=[wd,0,0],V=[0,hgt*Math.sin(phi),-hgt*Math.cos(phi)];
    const ctr=cam.P(0,y0-hgt*.5*Math.sin(phi),z0+hgt*.5*Math.cos(phi));glowDot(c,ctr[0],ctr[1],460,'#ffb43a',.4*cl(g*2));
    c.save();c.globalAlpha=cl(g*5);texPlane(c,cam,crop,O,U,V,6,2);c.restore();
    for(let i=0;i<30;i++){const a=H1(i*3.7)*TAU,rr=lp(80,560,H1(i*5.1)),lf=cl((t-o.gold[0]-.1-H1(i)*.35)/.85);if(lf<=0||lf>=1)continue;glowDot(c,ctr[0]+Math.cos(a)*rr*eo(lf),ctr[1]+Math.sin(a)*rr*.45*eo(lf)-lf*140,11,'#ffe7a0',1-lf);}}
  // рука с ручкой
  if(o.hand!==false){const tip=SP[SP.length-1],app=o.app?eo(cl((t-o.app[0])/(o.app[1]-o.app[0]))):1,lift=o.sig&&k>=1?ss(0,.4,t-o.sig[1]):0;
    const hx=tip[0]+lp(520,0,app)+lift*70,hy=tip[1]+lp(640,0,app)+lift*80,an=1.02,L=Math.max(900,(HH-hy)/Math.sin(an)+120);c.save();c.filter='blur(10px)';c.strokeStyle='rgba(20,10,5,.35)';c.lineWidth=40*tip[3];c.beginPath();c.moveTo(hx+30,hy+40);c.lineTo(hx+30+Math.cos(an)*L,hy+40+Math.sin(an)*L);c.stroke();c.restore();penDraw(c,hx,hy,an,L);}
  c.save();c.globalCompositeOperation='multiply';c.fillStyle=RG(c,560,820,120,1150,[[0,'rgb(255,246,236)'],[1,'rgb(96,80,70)']]);c.fillRect(0,0,WW,HH);c.restore();
  dof(c,{px:16,top:.9,m0:.2,m1:.82,bot:.5});vignette(c,.55);}
const MKO={};function mkcOnce(k,w,h){let c=MKO[k];if(!c||c.width!==w||c.height!==h){c=mkc(w,h);MKO[k]=c;}return c;}
