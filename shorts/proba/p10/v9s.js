"use strict";
/* Духless v9 (28.11): сцены по кадрам фильма — вип-зона Миши, Вадим у машины, шеф в кабинете, туалет больницы.
   Кадры: node render.mjs v9s <сцена> <папка> shots 1  (сцены: vip, vadim, boss, hwc) */
const V9={};
CLIP.draw=(c,t)=>{const f=V9[Q.get('style')];if(f){f(c,t);V9fin(c,t);}};
function V9fin(c,t){grade(c,'#ff9a3c','#1b3b6b',.12);vignette(c,.62);grain(c,Math.floor(t*30),.04);}
// ---------- вип-зона: серебряная стёганая стена, круглая лампа, стеклянный стол ----------
function puff9(c,P,o={}){const cx=P.reduce((s,p)=>s+p[0],0)/P.length,cy=P.reduce((s,p)=>s+p[1],0)/P.length,k=o.k||1;
 const ins=(q,dx=0,dy=0)=>P.map(([x,y])=>[cx+(x-cx)*q+dx*k,cy+(y-cy)*q+dy*k]);
 L.fill(c,P,o.base||'#5a8589',{t:.35});L.fill(c,ins(.82),o.mid||'#a6c7c8',{blur:5*k,t:.4});
 L.fill(c,ins(.5,-5,-5),'rgba(250,255,254,.8)',{blur:8*k,t:.5});L.fill(c,ins(.16,-8,-7),'#ffffff',{blur:3*k,t:.5,a:.85});
 L.line(c,P.concat([P[0]]),'rgba(40,70,74,.8)',1.6*k,{blur:.7*k});}
function vipWall(c,lx,ly,R){c.fillStyle='#78a2a6';c.fillRect(0,0,WW,HH);
 const sx=R*.95,sy=R*.78;
 for(let j=-2;j<12;j++)for(let i=-2;i<6;i++){const x=i*sx+(j%2?sx/2:0)+40,y=j*sy+60;puff9(c,[[x,y-sy*.62],[x+sx*.52,y],[x,y+sy*.62],[x-sx*.52,y]],{k:R/100});}
 c.save();c.beginPath();c.ellipse(lx,ly,R*1.18,R*1.13,0,0,TAU);c.clip();c.fillStyle='#78a2a6';c.fillRect(lx-R*1.3,ly-R*1.3,R*2.6,R*2.6);
 for(let k=0;k<8;k++){const a0=k*Math.PI/4+.2,a1=a0+Math.PI/4,P=[];
  for(let t=0;t<=6;t++){const a=a0+(a1-a0)*t/6;P.push([lx+Math.cos(a)*R*1.16,ly+Math.sin(a)*R*1.1]);}
  for(let t=6;t>=0;t--){const a=a0+(a1-a0)*t/6;P.push([lx+Math.cos(a)*R*.7,ly+Math.sin(a)*R*.67]);}puff9(c,P,{k:R/100});}
 c.restore();
 c.save();c.lineWidth=R*.27;c.strokeStyle=L.rg(c,lx,ly,R*.4,R*.72,[[0,'#46747a'],[.35,'#d6ecea'],[.5,'#ffffff'],[.7,'#a6c8ca'],[1,'#3f6a70']]);c.beginPath();c.ellipse(lx,ly,R*.56,R*.54,0,0,TAU);c.stroke();c.restore();
 L.line(c,[[lx-R*.46,ly-R*.26],[lx-R*.3,ly-R*.44],[lx-R*.06,ly-R*.52],[lx+R*.18,ly-R*.5]],'rgba(255,255,255,.95)',R*.03,{blur:R*.015});
 L.ell(c,lx,ly,R*.5,R*.48,'rgba(255,255,250,.7)',{blur:R*.18});
 L.ell(c,lx,ly,R*.34,R*.33,'#4a4036');L.ell(c,lx,ly,R*.316,R*.306,L.rg(c,lx-R*.06,ly-R*.06,2,R*.32,[[0,'#ffffff'],[.8,'#fdfff8'],[1,'#e6efe2']]));
 c.save();c.filter='blur(2.5px)';c.drawImage(c.canvas,0,0);c.restore();c.fillStyle='rgba(20,40,44,.1)';c.fillRect(0,0,WW,HH);}
function glassTable(c,y,t){L.ell(c,540,y+60,760,120,L.lg(c,0,y-40,0,y+180,[[0,'#d7eeee'],[.45,'#9ccacc'],[1,'#4f8589']]));
 L.ell(c,540,y+52,750,104,'rgba(255,255,255,.3)',{blur:4});
 L.line(c,[[-120,y+90],[300,y+130],[800,y+122],[1200,y+80]],'rgba(255,255,255,.9)',5,{blur:2});
 L.fill(c,[[-200,y+180],[1300,y+180],[1300,HH],[-200,HH]],L.lg(c,0,y+180,0,HH,[[0,'#2f5a5e'],[1,'#0d1a1c']]));}
V9.vip=(c,t)=>{vipWall(c,560,520,330);
 // Макс справа, откинулся на спинку
 personA(c,{f:'max',x:900,y:870,s:1.45,L:-1,light:'#e8fbff',la:.24,e:'smile',look:[-.6,0],cloth:{k:'suit',jacket:'#1a1c22',shirt:'#eef4f3',tie:null},sw:128,bt:620});
 // Миша по центру, лысина в ореоле лампы
 personA(c,{f:'misha',x:470,y:860,s:1.75,L:1,light:'#e8fbff',la:.28,e:'smirk',look:[.5,0],cloth:{k:'shirt',shirt:'#f1f7f6'},sw:132,bt:640});
 glassTable(c,1420,t);
 // шампанское в ведре на столе
 L.fill(c,[[700,1300],[800,1300],[790,1440],[710,1440]],L.lg(c,700,0,800,0,[[0,'#9fb4b6'],[.4,'#f4fbfb'],[1,'#7f9698']]),{t:.1});
 L.fill(c,[[742,1120],[758,1120],[764,1300],[736,1300]],'#123018',{t:.1});L.fill(c,[[740,1100],[760,1100],[758,1130],[742,1130]],'#d8b35a',{t:.1});
};
// ---------- Вадим у машины: подземный паркинг ----------
V9.vadim=(c,t)=>{c.fillStyle=L.lg(c,0,0,0,HH,[[0,'#3c434b'],[.5,'#5b636b'],[1,'#22262a']]);c.fillRect(0,0,WW,HH);
 const vy=760;// линия горизонта
 for(let i=0;i<14;i++){const k=i/13,x=lp(-300,1380,k);L.line(c,[[x,0],[540+(x-540)*.08,vy]],'rgba(255,255,255,.05)',2);}
 for(let i=0;i<7;i++){const z=1/(1+i*.6),y=vy-z*700,w=z*1400;L.fill(c,[[540-w,y],[540+w,y],[540+w,y+z*40],[540-w,y+z*40]],'rgba(240,248,255,.55)',{blur:3});}
 for(let i=0;i<5;i++){const z=1/(1+i*.55),x=540+(i%2?1:-1)*z*620;L.fill(c,[[x-z*60,vy-z*700],[x+z*60,vy-z*700],[x+z*60,vy+z*900],[x-z*60,vy+z*900]],L.lg(c,x-z*60,0,x+z*60,0,[[0,'#7c858d'],[1,'#4d555c']]),{t:.05});
  L.fill(c,[[x-z*60,vy+z*60],[x+z*60,vy+z*60],[x+z*60,vy+z*110],[x-z*60,vy+z*110]],'rgba(240,200,60,.7)',{t:.05});}
 L.fill(c,[[-200,vy],[1300,vy],[1300,HH],[-200,HH]],L.lg(c,0,vy,0,HH,[[0,'#6b7279'],[1,'#2b2f33']]));
 for(let i=-3;i<5;i++)L.line(c,[[540+i*90,vy],[540+i*560,HH]],'rgba(255,255,255,.25)',4);
 c.save();c.filter='blur(5px)';c.drawImage(c.canvas,0,0);c.restore();
 // чёрная машина справа
 L.fill(c,[[560,1060],[700,940],[980,920],[1120,960],[1120,1340],[560,1340]],L.lg(c,0,920,0,1340,[[0,'#2a2f36'],[.5,'#0e1014'],[1,'#050507']]),{t:.2});
 L.fill(c,[[640,1010],[720,960],[920,950],[1000,1000]],'rgba(150,175,200,.35)',{t:.3});
 L.line(c,[[590,1080],[1120,1060]],'rgba(200,220,240,.5)',3,{blur:1.5});
 L.ell(c,1040,1150,40,22,'rgba(255,90,70,.85)',{blur:6});
 personA(c,{f:'vadim',x:430,y:980,s:1.9,L:1,light:'#dbe8ff',la:.25,e:'sad',look:[.3,0],cloth:{k:'suit',jacket:'#22262f',shirt:'#cfe0f0',tie:'#2c3e66'},sw:132,bt:700});
};
// ---------- шеф: кожаное кресло, окно на Москва-Сити ----------
V9.boss=(c,t)=>{c.fillStyle=L.lg(c,0,0,0,HH,[[0,'#c8d8e6'],[1,'#eef2f2']]);c.fillRect(0,0,WW,HH);
 if(typeof cityDay11==='function'){c.save();c.globalAlpha=.9;cityDay11(c,560,1150,1.25);c.restore();}
 c.save();c.filter='blur(6px)';c.drawImage(c.canvas,0,0);c.restore();
 c.fillStyle='rgba(255,240,215,.18)';c.fillRect(0,0,WW,HH);
 for(const x of [60,520,1000])L.fill(c,[[x-18,0],[x+18,0],[x+18,HH],[x-18,HH]],'#3c3f44',{t:.05});
 L.fill(c,[[-40,0],[150,0],[170,HH],[-40,HH]],L.lg(c,0,0,170,0,[[0,'#a89a86'],[1,'#d8ccb8']]),{t:.05});
 // спинка кресла
 L.fill(c,[[300,560],[360,470],[720,470],[780,560],[800,1400],[280,1400]],L.lg(c,300,0,800,0,[[0,'#0e0e10'],[.45,'#2a2a2e'],[1,'#0a0a0b']]),{t:.25});
 for(let i=0;i<5;i++)L.line(c,[[330,600+i*150],[750,600+i*150]],'rgba(255,255,255,.07)',3);
 personA(c,{f:'boss',x:540,y:900,s:1.9,L:-1,light:'#fff1d8',la:.3,e:'neutral',look:[.2,0],cloth:{k:'suit',jacket:'#26262a',shirt:'#e8eaee',tie:'#5a1e22'},sw:150,bt:700});
 // стол на переднем плане
 L.fill(c,[[-100,1480],[1180,1440],[1180,HH],[-100,HH]],L.lg(c,0,1440,0,HH,[[0,'#6b5136'],[1,'#2a1d12']]));
 L.line(c,[[-100,1482],[1180,1442]],'rgba(255,230,190,.6)',4,{blur:1});
 for(const [x,col] of [[820,'#d22'],[860,'#fff']]){L.line(c,[[x,1460],[x,1300]],'#cfcfcf',4);L.fill(c,[[x,1300],[x+60,1308],[x+60,1340],[x,1332]],col,{t:.1});}
 L.fill(c,[[860,1300],[920,1308],[920,1320],[860,1312]],'#1b4bd0',{t:.1});
 L.fill(c,[[120,1460],[380,1446],[400,1500],[140,1514]],'#f1efe8',{t:.1});
};
// ---------- туалет детской больницы: Макс смывает грим, входит Лёша ----------
V9.hwc=(c,t)=>{c.fillStyle='#e9eeec';c.fillRect(0,0,WW,HH);
 for(let y=0;y<HH;y+=64)for(let x=(y/64%2)*0;x<WW;x+=64){c.fillStyle=((x+y)/64)%2?'#eef2f0':'#e4eae8';c.fillRect(x+1,y+1,62,62);}
 c.strokeStyle='rgba(150,165,160,.6)';c.lineWidth=2;for(let y=0;y<HH;y+=64){c.beginPath();c.moveTo(0,y);c.lineTo(WW,y);c.stroke();}for(let x=0;x<WW;x+=64){c.beginPath();c.moveTo(x,0);c.lineTo(x,HH);c.stroke();}
 // дверца кабинки слева и сушилка
 L.fill(c,[[0,300],[210,300],[210,1500],[0,1500]],L.lg(c,0,0,210,0,[[0,'#d9dfdd'],[1,'#f6f8f7']]),{t:.02});L.line(c,[[210,300],[210,1500]],'rgba(120,130,128,.7)',4);
 L.fill(c,[[860,520],[1010,520],[1010,640],[860,640]],L.lg(c,0,520,0,640,[[0,'#f2f4f3'],[1,'#c9d0ce']]),{t:.2});L.fill(c,[[880,610],[990,610],[990,628],[880,628]],'#9aa4a2',{t:.2});
 c.save();c.filter='blur(4px)';c.drawImage(c.canvas,0,0);c.restore();
 // ряд раковин
 for(let i=0;i<4;i++){const x=140+i*260;L.fill(c,[[x,1330],[x+210,1330],[x+190,1420],[x+20,1420]],L.lg(c,0,1330,0,1420,[[0,'#ffffff'],[1,'#c6cfcd']]),{t:.25});
  L.line(c,[[x+105,1330],[x+105,1290],[x+130,1290]],'#a9b3b6',8);}
 // Лёша у двери справа, дальше
 personA(c,{f:'lyosha',x:820,y:820,s:1.15,L:1,light:'#ffffff',la:.2,e:'neutral',look:[-.6,0],cloth:{k:'flannel'},sw:96,bt:560});
 // Макс у раковины, грим наполовину смыт
 personA(c,{f:'clown',x:420,y:900,s:1.8,L:-1,light:'#f4fbff',la:.22,e:'sad',look:[.5,0],cloth:{k:'suit',jacket:'#16171b',shirt:'#eef2f2',tie:null},sw:130,bt:620});
 L.fill(c,[[-50,1420],[1130,1420],[1130,HH],[-50,HH]],L.lg(c,0,1420,0,HH,[[0,'#b8c3c1'],[1,'#5e6a68']]));
 c.fillStyle='rgba(230,245,255,.08)';c.fillRect(0,0,WW,HH);};

// ================= сцены в объёме (как места v7) =================
// паркинг: бетонные колонны, полосы ламп дневного света, мокрый пол, чёрная машина; Вадим с телефоном
V9.park=(c,t)=>{const E=[-40,-160,0],cam=C3(E,[10,-150,1000],1000),camz=0,FOG=h3('#1c2226'),D=1500,LAMPS=[260,520,780,1040,1300];
 const lamp=z=>lampSum(z,LAMPS,70);c.fillStyle='#0d1012';c.fillRect(0,0,WW,HH);
 corridor(c,cam,{z0:40,z1:1600,n:120,xl:-420,xr:420,h:260,
  ceil:z=>s3(surf(h3('#15191c'),h3('#7d878c'),.08+.5*lamp(z),z,camz,FOG,D)),
  floor:z=>s3(surf(h3('#121517'),h3('#5c656a'),.06+.45*lamp(z),z,camz,FOG,D)),
  wallL:z=>s3(surf(h3('#16191b'),h3('#6c757a'),.05+.4*lamp(z),z,camz,FOG,D)),
  wallR:z=>s3(surf(h3('#16191b'),h3('#6c757a'),.05+.4*lamp(z),z,camz,FOG,D)),end:s3(m3(h3('#20262a'),FOG,.5))});
 // разметка мест
 for(let z=200;z<1500;z+=170){ln3(c,cam,[-420,0,z],[-200,0,z],rgba('#e8ece8',.55*(1-fogK(z,D))),3);ln3(c,cam,[200,0,z],[420,0,z],rgba('#e8ece8',.55*(1-fogK(z,D))),3);}
 ln3(c,cam,[-200,0,60],[-200,0,1600],'rgba(240,200,60,.55)',4);ln3(c,cam,[200,0,60],[200,0,1600],'rgba(240,200,60,.55)',4);
 // колонны с полосой
 for(let i=6;i>=0;i--){const z=180+i*230,fz=1-fogK(z-camz,D),pc=m3(h3('#7a8287'),FOG,1-fz);
  for(const x of [-300,300]){box3(c,cam,[x-26,x+26,0,-260,z-26,z+26],{front:s3(k3(pc,.9)),left:s3(k3(pc,.7)),right:s3(k3(pc,.7))});
   box3(c,cam,[x-27,x+27,-40,-70,z-27,z+27],{front:rgba('#e0b020',.85*fz),left:rgba('#a88010',.85*fz),right:rgba('#a88010',.85*fz)});}}
 // лампы
 for(const zl of LAMPS){const fz=1-fogK(zl-camz,D);fq(c,cam,[[-120,-259,zl-50],[120,-259,zl-50],[120,-259,zl+50],[-120,-259,zl+50]],rgba('#f2fbff',.95*fz));
  glow3(c,cam,[0,-255,zl],260,'#dff4ff',.5*fz);refl3(c,cam,[0,-255,zl],140,'#dff4ff',.35*fz,4);}
 // чёрная машина справа: профиль кузова в плоскости x=110, зад к камере
 const cz=430,X=110,prof=[[0,-18],[0,-62],[30,-74],[110,-78],[165,-120],[330,-124],[385,-80],[420,-72],[424,-18]];
 const rear=[[X,-18,cz],[X+190,-18,cz],[X+190,-74,cz],[X,-74,cz]];fq(c,cam,rear,'#0b0c10');
 fq(c,cam,[[X+10,-70,cz-1],[X+180,-70,cz-1],[X+170,-56,cz-1],[X+20,-56,cz-1]],'rgba(255,40,40,.85)');
 glow3(c,cam,[X+20,-62,cz],26,'#ff2a2a',.9);glow3(c,cam,[X+170,-62,cz],26,'#ff2a2a',.9);refl3(c,cam,[X+100,-62,cz],60,'#ff2a2a',.35,4);
 fq(c,cam,prof.map(([z,y])=>[X,y,cz+z]),'#101217');
 fq(c,cam,[[X,-80,cz+120],[X,-116,cz+168],[X,-118,cz+322],[X,-82,cz+372]],'#2a3240');
 ln3(c,cam,[X,-100,cz+150],[X,-100,cz+340],'rgba(220,235,250,.5)',1.6);
 ln3(c,cam,[X,-60,cz+10],[X,-64,cz+410],'rgba(210,225,240,.55)',2.2);
 for(const wz of [80,340]){const p=cam.P(X,-18,cz+wz),r=30*p[3];c.fillStyle='#050506';c.beginPath();c.ellipse(p[0],p[1]-r*.2,r*.55,r,0,0,TAU);c.fill();c.fillStyle='#3a3e44';c.beginPath();c.ellipse(p[0],p[1]-r*.2,r*.28,r*.55,0,0,TAU);c.fill();}
 haze3(c,cam,900,-130,.03,'#dfe8ef',8,3,t);
 dof(c,{px:8,top:.6,m0:.35,m1:.7,bot:.4});
 personA(c,{f:'vadim',x:380,y:1060,s:2.05,L:1,light:'#dff4ff',la:.24,e:'sad',look:[.5,0],cloth:{k:'suit',jacket:'#22262f',shirt:'#cfe0f0',tie:'#2c3e66'},sw:132,bt:1500});
 punch(c,1.12,1.05);lightBloom(c,.28);};
// туалет детской больницы: белая плитка, раковины слева, кабинки справа, Макс с полусмытым гримом, в двери Лёша
V9.hwc3=(c,t)=>{const E=[-20,-158,0],cam=C3(E,[40,-150,1000],1000),camz=0,FOG=h3('#9fb0ac'),D=2600,LAMPS=[260,480,700];
 const lamp=z=>lampSum(z,LAMPS,80);c.fillStyle='#b8c6c2';c.fillRect(0,0,WW,HH);
 corridor(c,cam,{z0:40,z1:900,n:90,xl:-190,xr:260,h:290,
  ceil:z=>s3(surf(h3('#8e9c98'),h3('#eef4f2'),.3+.4*lamp(z),z,camz,FOG,D)),
  floor:z=>s3(surf(h3('#7c8784'),h3('#c9d2cf'),.3+.3*lamp(z),z,camz,FOG,D)),
  wallL:z=>s3(surf(h3('#a7b6b2'),h3('#f4f8f6'),.35+.4*lamp(z),z,camz,FOG,D)),
  wallR:z=>s3(surf(h3('#a1afab'),h3('#e8efed'),.3+.35*lamp(z),z,camz,FOG,D)),end:s3(m3(h3('#dfe7e4'),FOG,.2))});
 grid3(c,cam,{plane:'floor',x0:-190,x1:260,z0:40,z1:900,s:40,camz,D,col:'#5c6865',a:.35,w:1.4});
 grid3(c,cam,{plane:'wall',x:-190,y0:0,y1:-290,sy:30,z0:40,z1:900,s:30,camz,D,col:'#7f8e8a',a:.35,w:1.2});
 // кабинки справа
 for(let i=4;i>=0;i--){const z0=260+i*130,fz=1-fogK(z0-camz,D),dc=m3(h3('#e9eeed'),FOG,1-fz);
  box3(c,cam,[160,260,-14,-200,z0-3,z0+3],{left:s3(k3(dc,.85)),top:s3(k3(dc,1.05))});
  fq(c,cam,[[160,-14,z0+6],[160,-14,z0+124],[160,-200,z0+124],[160,-200,z0+6]],s3(k3(dc,.95)));ln3(c,cam,[160,-110,z0+110],[160,-110,z0+118],'rgba(80,90,90,.8)',3);}
 // дверь в конце открыта — в проёме Лёша
 fq(c,cam,[[-20,0,899],[100,0,899],[100,-210,899],[-20,-210,899]],'#6f7f86');
 const lp_=cam.P(40,-150,880);personA(c,{f:'lyosha',x:lp_[0],y:lp_[1],s:lp_[3]/6.4,L:1,light:'#ffffff',la:.2,e:'neutral',look:[-.5,0],cloth:{k:'flannel'},sw:96,bt:560});
 // раковины и зеркала слева
 const marb=h3('#f1f4f3');box3(c,cam,[-190,-130,-80,-86,120,820],{top:s3(k3(marb,.95)),right:s3(k3(marb,.75)),front:s3(k3(marb,.8))});
 for(const zc of [220,440,660]){const fz=1-fogK(zc-camz,D);const mq=fq(c,cam,[[-189,-110,zc-60],[-189,-110,zc+60],[-189,-240,zc+60],[-189,-240,zc-60]],s3(m3(h3('#c5d1d3'),FOG,1-fz)));
  if(mq){c.strokeStyle='rgba(150,160,160,.9)';c.lineWidth=3;PP(c,mq);c.stroke();}
  ln3(c,cam,[-175,-86,zc],[-175,-126,zc],'#9aa3a8',8);ln3(c,cam,[-175,-126,zc],[-152,-122,zc],'#9aa3a8',7);
  glow3(c,cam,[-160,-280,zc],180,'#f4fbff',.35*fz);}
 for(const zl of LAMPS)fq(c,cam,[[-40,-289,zl-40],[120,-289,zl-40],[120,-289,zl+40],[-40,-289,zl+40]],'rgba(250,255,255,.95)');
 dof(c,{px:10,top:.8,m0:.25,m1:.85,bot:.8});
 // Макс у раковины на переднем плане
 personA(c,{f:'clownW',x:330,y:1040,s:2.05,L:1,light:'#f4fbff',la:.2,e:'sad',look:[.6,0],cloth:{k:'suit',jacket:'#16171b',shirt:'#eef2f2',tie:null},sw:130,bt:1600});
 punch(c,1.06,1.02);lightBloom(c,.22);};

// кабинет шефа: окно во всю стену на Москва-Сити днём, кожаное кресло, стол с флажками
V9.boss3=(c,t)=>{c.drawImage(bgBlur('bosscity',g=>{g.fillStyle=LG(g,0,0,0,HH,[[0,'#9fb9d4'],[.6,'#d9e3ea'],[1,'#c8c2b4']]);g.fillRect(0,0,WW,HH);
   if(typeof cityDay11==='function')cityDay11(g,560,1180,1.35);g.fillStyle='rgba(255,244,225,.25)';g.fillRect(0,0,WW,HH);},9),0,0);
 // рама окна
 for(const x of [70,540,1010]){c.fillStyle=LG(c,x-16,0,x+16,0,[[0,'#2a2c30'],[.5,'#55585e'],[1,'#2a2c30']]);c.fillRect(x-16,0,32,HH);}
 c.fillStyle='#2b2d31';c.fillRect(0,300,WW,18);
 // свет из окна: пол и стена тёплые
 c.fillStyle=LG(c,0,1200,0,HH,[[0,'rgba(60,45,30,.0)'],[1,'rgba(20,14,8,.85)']]);c.fillRect(0,1200,WW,HH-1200);
 // кресло: высокая чёрная кожаная спинка
 L.fill(c,[[330,560],[380,430],[700,430],[750,560],[770,1450],[310,1450]],L.lg(c,330,0,750,0,[[0,'#0a0a0c'],[.3,'#2f2f34'],[.55,'#1a1a1d'],[1,'#060607']]),{t:.25});
 for(let i=0;i<4;i++)L.line(c,[[360,620+i*170],[720,620+i*170]],'rgba(255,255,255,.08)',4,{blur:1});
 L.line(c,[[380,440],[340,600],[330,1100]],'rgba(255,250,240,.45)',5,{blur:3});
 personA(c,{f:'boss',x:540,y:930,s:2.0,L:-1,light:'#fff1d8',la:.32,e:'neutral',look:[.25,0],cloth:{k:'suit',jacket:'#26262a',shirt:'#e8eaee',tie:'#5a1e22'},sw:150,bt:1400});
 // стол: тёмное дерево в перспективе
 L.fill(c,[[-60,1440],[1140,1440],[1140,HH],[-60,HH]],L.lg(c,0,1440,0,HH,[[0,'#5a4230'],[.2,'#3a2a1c'],[1,'#120c07']]));
 L.line(c,[[-60,1442],[1140,1442]],'rgba(255,236,205,.7)',4,{blur:1.2});
 c.fillStyle='rgba(255,240,220,.12)';c.fillRect(0,1446,WW,60);
 for(const [x,col,col2] of [[800,'#e8e8ea','#d22a2a'],[860,'#ffffff','#1f4fd0']]){L.line(c,[[x,1440],[x,1260]],'#d0d0d0',5);L.fill(c,[[x,1262],[x+70,1270],[x+70,1312],[x,1304]],col,{t:.1});L.fill(c,[[x,1290],[x+70,1298],[x+70,1312],[x,1304]],col2,{t:.1});}
 L.fill(c,[[120,1500],[420,1486],[440,1560],[140,1574]],'#f2efe6',{t:.1});for(let i=0;i<5;i++)L.line(c,[[150,1510+i*10],[400,1498+i*10]],'rgba(60,60,60,.35)',2);
 L.fill(c,[[600,1520],[720,1512],[724,1540],[604,1548]],'#1a1b1e',{t:.2});
 lightBloom(c,.25);punch(c,1.06,1.04);};
// вип-зона Миши: серебряная стёганая стена с лампой — фоном с глубиной резкости, стеклянный стол
V9.vip3=(c,t)=>{c.drawImage(bgBlur('vipwall',g=>{const cc=c;vipWall(g,560,560,330);},10),0,0);
 lampMul(c,560,600,250,1500,'rgba(20,34,38,1)');glowDot(c,560,560,520,'#f4fff8',.5);
 personA(c,{f:'max',x:870,y:900,s:1.6,L:-1,light:'#e8fbff',la:.24,e:'smile',look:[-.7,0],cloth:{k:'suit',jacket:'#16181d',shirt:'#eef4f3',tie:null},sw:128,bt:1200});
 personA(c,{f:'misha',x:430,y:880,s:2.0,L:1,light:'#e8fbff',la:.28,e:'smirk',look:[.6,0],cloth:{k:'shirt',shirt:'#f1f7f6'},sw:134,bt:1200});
 // стеклянный стол: столешница в перспективе, блики, отражения
 L.fill(c,[[-80,1430],[1160,1430],[1300,1640],[-220,1640]],L.lg(c,0,1430,0,1640,[[0,'rgba(200,232,234,.88)'],[1,'rgba(120,170,175,.9)']]),{t:.05});
 L.line(c,[[-80,1432],[1160,1432]],'rgba(255,255,255,.95)',4,{blur:1});
 L.fill(c,[[-220,1640],[1300,1640],[1300,1680],[-220,1680]],'rgba(80,130,136,.95)',{t:.02});
 L.fill(c,[[-220,1680],[1300,1680],[1300,HH],[-220,HH]],L.lg(c,0,1680,0,HH,[[0,'#21393c'],[1,'#081011']]));
 c.save();c.globalAlpha=.25;c.translate(0,2*1430);c.scale(1,-1);c.beginPath();c.rect(0,1240,WW,190);c.clip();c.filter='blur(4px)';c.drawImage(c.canvas,0,0);c.restore();
 // ведро с шампанским и бокалы
 L.fill(c,[[700,1300],[820,1300],[806,1450],[714,1450]],L.lg(c,700,0,820,0,[[0,'#8fa6a8'],[.4,'#f6fcfc'],[1,'#6f8789']]),{t:.1});
 L.fill(c,[[748,1110],[766,1110],[772,1300],[742,1300]],'#0f2a16',{t:.1});L.fill(c,[[746,1090],[768,1090],[766,1124],[748,1124]],'#d8b35a',{t:.1});
 for(const x of [260,960]){L.fill(c,[[x-22,1300],[x+22,1300],[x+12,1380],[x-12,1380]],'rgba(255,255,255,.35)',{t:.4});L.fill(c,[[x-18,1320],[x+18,1320],[x+10,1376],[x-10,1376]],'rgba(240,200,90,.75)',{t:.4});L.line(c,[[x,1380],[x,1430]],'rgba(255,255,255,.7)',3);}
 lightBloom(c,.3);punch(c,1.08,1.04);};
