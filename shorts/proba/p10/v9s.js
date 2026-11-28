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
