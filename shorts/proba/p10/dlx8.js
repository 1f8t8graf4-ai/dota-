"use strict";
/* «Духless» RU · 3 ролика с голосом (27.11): dina — копия Дины (Виктор), pov — «Твоими глазами» (васян), nonstop — «Без остановки» (Майк).
   N=<кадров> P10A=<папка с <ролик>.words.json> node render.mjs dlx8 dina|pov|nonstop out.mp4
   Мир плана рисуется в свой холст, как стоп-кадр (в 2× при сильном зуме), камера двигает холст; переходы — смаз, нырок, вспышка.
   Набор рисовки — stk.js и stl.js (стоп-кадры 26.11). */
CLIP.fonts=['700 40px Osw','500 40px Osw','500 40px JBM','700 40px JBM','700 40px Play','italic 700 40px Play','600 40px Man','800 40px Man'];
const KEY=Q.get('style')||'dina';
const W8={};
let VO=null,SHOTS=[],SUBS=[],DUR=30,ENDT=30,VOFF=0;
const WLC=[mkc(WW,HH),mkc(WW*2,HH*2)],OVC=mkc(WW,HH);
const wa=i=>VO.words[i].a,wb=i=>VO.words[i].b;
const flap=(t,f=1)=>(Math.sin(t*17*f)+Math.sin(t*10.3*f+1.3))>.25?'open':'flat';

/* ---------- живые мелочи ---------- */
function carsT(c,y,t,o={}){c.save();c.globalCompositeOperation='screen';const n=o.n||30,sp=o.sp||140,L=WW+300;
  for(let i=0;i<n;i++){const dir=i%2?1:-1,v=sp*(.7+.6*H1(i*3.1)),x=((H1(i*7.7)*L+dir*t*v)%L+L)%L-150,yy=y+(dir>0?5:-3)+(H1(i)-.5)*4*(o.sy||1);
    const col=dir>0?'#ff3b30':'#fff1d6',r=(o.r||14)*(.8+.4*H1(i*5));glowDot(c,x,yy,r,col,.85);glowDot(c,x+(dir>0?-12:12),yy,r*.7,col,.6);}
  c.restore();}
function twinkle(c,t,n,y0,y1,seed=1){for(let i=0;i<n;i++){const a=.2+.6*Math.max(0,Math.sin(t*(1+H1(i+seed)*2)+i));c.fillStyle=`rgba(255,255,255,${a*(.3+.5*H1(i*7.1+seed))})`;c.fillRect(H1(i*3.3+seed)*WW,lp(y0,y1,H1(i*5.9+seed)),2,2);}}
function walkers(c,t,y,s,n,col,seed=1){for(let i=0;i<n;i++){const dir=H1(i+seed)>.5?1:-1,L=WW+400,x=((H1(i*5.3+seed)*L+dir*t*(60+60*H1(i*2+seed)))%L+L)%L-200;
  c.save();c.translate(x,y+Math.abs(Math.sin(t*6+i))*4*s);c.scale(s,s);c.fillStyle=col;c.beginPath();c.ellipse(0,0,30,36,0,0,TAU);c.fill();
  c.beginPath();c.moveTo(-60,40);c.lineTo(60,40);c.lineTo(70,400);c.lineTo(-70,400);c.closePath();c.fill();c.restore();}}
function flashes(c,t,pts,seed=1){for(let i=0;i<pts.length;i++){const ph=(t*1.7+H1(i+seed)*3)%1.9;if(ph<.09){const [x,y]=pts[i],k=1-ph/.09;glowDot(c,x,y,260*k+60,'#ffffff',1.2*k);glowDot(c,x,y,40,'#ffffff',k);}}}

/* ---------- 1. полёт над Москвой-рекой к Сити (b1, камера едет вперёд) ---------- */
const FL={HZ:820,F:1000,HC:170,ZC:15000};let FLB=null;
function flBlds(){if(FLB)return FLB;FLB=[];for(const sd of [-1,1]){let Z=26000,k=0;while(Z>200){const len=500+H1(k*3.7+sd)*900,h=220+H1(k*5.1+sd*2)*520,Z1=Math.max(200,Z-len);
  FLB.push({sd,Z0:Z1,Z1:Z,h,k,col:['#3b3346','#4a3a3a','#3a3f52','#52443a'][(k+(sd>0?1:0))%4]});Z=Z1-60-H1(k*9+sd)*120;k++;}}FLB.sort((a,b)=>b.Z1-a.Z1);return FLB;}
function flCity(cz){const zr=Math.max(600,FL.ZC-cz);return {by:FL.HZ+FL.HC*FL.F/zr,sc:.6*14000/zr};}
function flTarget(cz){const {by,sc}=flCity(cz);return [590+(150+42-250)*sc,by-880*sc*.58];}   // окно в башне со шпилем
W8.moscow=(c,t,o)=>{const cz=o.cz||0,{HZ,F,HC}=FL,P=(X,h,Z)=>{const z=Math.max(60,Z-cz);return [540+X*F/z,HZ+(HC-h)*F/z];};
  c.fillStyle=LG(c,0,0,0,HZ+40,[[0,'#050914'],[.55,'#1a1f45'],[1,'#8a4a4a']]);c.fillRect(0,0,WW,HZ+40);
  c.fillStyle=RG(c,560,HZ,10,700,[[0,'rgba(255,150,90,.5)'],[1,'rgba(255,120,60,0)']]);c.fillRect(0,0,WW,HZ+300);
  twinkle(c,t,60,0,400,3);
  const {by,sc}=flCity(cz);moscowCity(c,590,by,sc,{lite:.5});stalinka(c,330,HZ+14,.3,'#3a3150');
  c.fillStyle=LG(c,0,HZ,0,HH,[[0,'#2a2140'],[.25,'#0e1630'],[1,'#03060d']]);c.fillRect(0,HZ,WW,HH-HZ);
  const QD=(pts,fill)=>{c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(const q of pts)c.lineTo(q[0],q[1]);c.closePath();c.fillStyle=fill;c.fill();};
  for(const B of flBlds()){if(B.Z1-cz<70)continue;const Z0=Math.max(B.Z0,cz+70),X=B.sd*560,A=P(X,0,Z0),Bp=P(X,B.h,Z0),C=P(X,B.h,B.Z1),D=P(X,0,B.Z1);
    if(B.Z0-cz>16000)continue;
    QD([A,Bp,C,D],LG(c,A[0],0,D[0],0,[[0,sh(B.col,.05)],[1,sh(B.col,-.45)]]));
    const nf=Math.floor(B.h/42),nc=Math.floor((B.Z1-B.Z0)/90);
    for(let fi=0;fi<nf;fi++)for(let ci=0;ci<nc;ci++){const r=H2(ci+B.k*13+B.sd*7,fi);if(r>.55)continue;const z0=B.Z0+ci*90+20,z1=z0+46;if(z0<cz+70)continue;const h0=24+fi*42,h1=h0+22;
      QD([P(X,h0,z0),P(X,h1,z0),P(X,h1,z1),P(X,h0,z1)],r<.42?`rgba(255,${185+(r*120|0)},${100+(r*150|0)},${.55+.4*r})`:`rgba(150,190,240,${.35+.4*r})`);}
    QD([Bp,P(X,B.h+18,Z0),P(X,B.h+18,B.Z1),C],sh(B.col,-.2));}
  for(const sd of [-1,1]){c.save();c.lineCap='round';
    for(let k=0;k<2;k++){c.beginPath();let first=true;for(let Z=cz+120;Z<cz+16000;Z*=1.05){const [sx,sy]=P(sd*(440+k*50),6,Z);first?c.moveTo(sx,sy):c.lineTo(sx,sy);first=false;}
      c.strokeStyle=k?'rgba(255,70,60,.75)':'rgba(255,235,205,.85)';c.lineWidth=k?4:5;c.shadowColor=k?'#ff3b30':'#ffe0a0';c.shadowBlur=16;c.stroke();}c.restore();
    const st=400;for(let j=Math.ceil((cz+150)/st);j*st<cz+12000;j++){const Z=j*st*(1+.002*j);const [lx,ly]=P(sd*410,60,Z),[bx,bY]=P(sd*410,0,Z),k=F/Math.max(60,Z-cz);
      c.strokeStyle='#0b0a12';c.lineWidth=Math.max(1,6*k);c.beginPath();c.moveTo(bx,bY);c.lineTo(lx,ly);c.stroke();glowDot(c,lx,ly,Math.max(4,60*k),'#ffc070',.9);}}
  // фары по набережным едут навстречу
  for(const sd of [-1,1])for(let i=0;i<14;i++){const Z=((H1(i*3+sd)*9000-t*(sd>0?900:-700)-cz)%9000+9000)%9000+cz+200,[x,y]=P(sd*(450+(i%2)*40),8,Z),k=F/(Z-cz);glowDot(c,x,y,Math.max(3,40*k),sd>0?'#fff1d6':'#ff4a3a',.9);}
  {const Z=2400;if(Z-cz>200){const y0=P(0,0,Z)[1],y1=P(0,70,Z)[1],xl=P(-600,0,Z)[0],xr=P(600,0,Z)[0];c.fillStyle='#0b0a12';c.fillRect(xl,y1,xr-xl,(y0-y1)*.35);
    for(let i=0;i<3;i++){const ax=lp(xl,xr,(i+.5)/3),aw=(xr-xl)/3*.42;c.beginPath();c.moveTo(ax-aw,y0);c.quadraticCurveTo(ax,y1+(y0-y1)*.2,ax+aw,y0);c.lineTo(ax+aw+6,y0);c.lineTo(ax+aw+6,y1+(y0-y1)*.3);c.lineTo(ax-aw-6,y1+(y0-y1)*.3);c.lineTo(ax-aw-6,y0);c.closePath();c.fill();}
    for(let i=0;i<=14;i++)glowDot(c,lp(xl,xr,i/14),y1-4,12,'#ffd27a',.9);}}
  {const g=TB.getContext('2d');reset(g);g.clearRect(0,0,WW,HH);g.drawImage(c.canvas,0,0);
   c.save();c.beginPath();c.rect(0,HZ,WW,HH-HZ);c.clip();c.globalAlpha=.42;c.translate(0,2*HZ+6);c.scale(1,-1.15);c.filter='blur(5px)';c.drawImage(TB,0,0,WW,HZ,0,0,WW,HZ);c.restore();
   c.fillStyle=LG(c,0,HZ,0,HH,[[0,'rgba(3,6,13,0)'],[.5,'rgba(3,6,13,.55)'],[1,'rgba(3,6,13,.92)']]);c.fillRect(0,HZ,WW,HH-HZ);
   c.strokeStyle='rgba(3,6,13,.55)';for(let i=0;i<70;i++){const y=HZ+Math.pow(i/70,1.8)*(HH-HZ),w=2+i*.12,ph=t*6+cz*.004;c.lineWidth=w*.5;c.beginPath();c.moveTo(0,y);for(let x=0;x<=WW;x+=60)c.lineTo(x,y+Math.sin(x*.02+i+ph)*w*.6);c.stroke();}}
  {const Z=1500+t*120;if(Z-cz>150){const [bx,bY]=P(-160,0,Z),k=F/(Z-cz);c.save();c.translate(bx,bY);c.scale(k,k);c.fillStyle='#0d0c16';c.beginPath();c.moveTo(-160,0);c.lineTo(170,0);c.lineTo(140,-34);c.lineTo(-150,-34);c.closePath();c.fill();
   c.fillStyle='#e9e4dc';c.fillRect(-120,-70,220,36);for(let i=0;i<9;i++){c.fillStyle='rgba(255,210,140,.95)';c.fillRect(-110+i*24,-62,16,18);}c.fillStyle='#0d0c16';c.fillRect(-120,-76,220,8);c.restore();
   glowDot(c,bx,bY-60*k,140*k,'#ffc070',.5);}}
  fog(c,t,HZ-10,{n:12,sp:20,h:60,r:520,a:.2,seed:9});
  const sp=o.blur||0;if(sp>.002){const g=TA.getContext('2d');reset(g);g.clearRect(0,0,WW,HH);g.drawImage(c.canvas,0,0);zoomBlur(c,TA,580,HZ-40,1,sp,7,.9);}
  const [tx0,ty0]=flTarget(cz);glowDot(c,tx0,ty0,30+20*Math.sin(t*5),'#ffe6a8',1);
};

/* ---------- 2. ночная панорама (h2b без цифры) ---------- */
W8.city=(c,t,o)=>{c.fillStyle=LG(c,0,0,0,1300,[[0,'#060b1c'],[.5,'#13204a'],[.85,'#4a2f50'],[1,'#c0623a']]);c.fillRect(0,0,WW,1300);
  twinkle(c,t,60,0,500,5);
  cityFar(c,1060,{col:'#2a2546',h:70,n:200,seed:3});c.fillStyle='rgba(120,90,140,.28)';c.fillRect(0,900,WW,200);
  stalinka(c,840,1120,.55,'#3c3352');moscowCity(c,330,1140,.8,{lite:.45});
  c.fillStyle='rgba(60,50,90,.25)';c.fillRect(0,950,WW,260);
  cityFar(c,1200,{col:'#0c0e1a',h:46,n:260,seed:17});river(c,1200,1330,{});carsT(c,1196,t,{n:40,sp:120,r:10});
  c.fillStyle=LG(c,0,1330,0,HH,[[0,'#0a0d18'],[1,'#04050a']]);c.fillRect(0,1330,WW,HH-1330);
  fog(c,t,1150,{n:12,sp:25,h:120,r:520,a:.2,seed:5});
  for(let i=0;i<5;i++)glowDot(c,330+(i-2)*70,1140-700*.8+i*30,20,'#ff3b30',.4+.6*Math.max(0,Math.sin(t*3+i)));
};

/* ---------- 3. кабинет у окна, Макс со спины (d1) ---------- */
W8.office=(c,t,o)=>{
  c.fillStyle=LG(c,0,0,0,1250,[[0,'#060b1c'],[.45,'#13204a'],[.78,'#3a2b5e'],[1,'#c0623a']]);c.fillRect(0,0,WW,1300);
  c.fillStyle=RG(c,720,1180,20,700,[[0,'rgba(255,150,80,.55)'],[1,'rgba(255,120,60,0)']]);c.fillRect(0,400,WW,900);
  twinkle(c,t,70,0,520,7);
  cityFar(c,1150,{col:'#1b1830',h:50,n:300});stalinka(c,190,1150,.62,'#3c3352');moscowCity(c,700,1170,1.0,{lite:.42});
  cityFar(c,1185,{col:'#0d0f1c',h:26,n:200,seed:11});river(c,1185,1300,{});carsT(c,1182,t,{n:46,sp:90,r:11});
  fog(c,t,1120,{n:10,sp:15,h:80,r:420,a:.18,seed:3});
  for(let i=0;i<3;i++)glowDot(c,700+(i-1)*80,1170-860+i*40,22,'#ff3b30',.3+.7*Math.max(0,Math.sin(t*2.6+i*2)));
  c.save();c.globalCompositeOperation='screen';c.fillStyle=LG(c,0,0,WW,HH,[[0,'rgba(120,160,220,.08)'],[.5,'rgba(255,255,255,0)'],[.62,'rgba(255,220,180,.07)'],[1,'rgba(0,0,0,0)']]);c.fillRect(0,0,WW,1300);c.restore();
  c.fillStyle='#07080c';for(const mx of [40,560,1050])c.fillRect(mx-14,0,28,1320);c.fillRect(0,1288,WW,34);
  c.fillStyle='rgba(255,210,150,.15)';for(const mx of [40,560,1050])c.fillRect(mx+10,0,3,1300);
  c.fillStyle=LG(c,0,1320,0,HH,[[0,'#16120f'],[1,'#070605']]);c.fillRect(0,1320,WW,HH-1320);
  c.save();c.globalCompositeOperation='screen';c.globalAlpha=.25;c.translate(0,2640);c.scale(1,-1);c.filter='blur(10px)';c.drawImage(c.canvas,0,1000,WW,320,0,1320,WW,320);c.restore();
  const br=Math.sin(t*1.3)*3;
  backMan(c,{x:640,y:820+br,s:1.35,hairC:'#1d140f',suit:'#05060a',neck:'#9a6248',rim:'#ffb27a',R:1,rimA:.95});
  c.save();c.translate(640,820+br);c.scale(1.35,1.35);rimStroke(c,[headPath({hw:60})],'#8fb8ff',.8,7,-1,90);c.restore();
  pool(c,640,1500,340,60,'#ffb27a',.25);
  fgBlur(c,9,g=>{g.fillStyle=LG(g,0,1480,0,HH,[[0,'#3a2416'],[1,'#120a06']]);g.beginPath();g.moveTo(-40,1500);g.lineTo(520,1560);g.lineTo(560,HH);g.lineTo(-40,HH);g.closePath();g.fill();
    g.fillStyle='rgba(255,200,140,.25)';g.fillRect(-40,1500,600,10);
    g.fillStyle=RG(g,120,1420,10,260,[[0,'rgba(255,190,110,.9)'],[1,'rgba(255,190,110,0)']]);g.fillRect(-140,1160,520,520);
    g.fillStyle='rgba(220,150,70,.75)';g.beginPath();g.moveTo(380,1560);g.lineTo(470,1560);g.lineTo(462,1660);g.lineTo(388,1660);g.closePath();g.fill();
    g.fillStyle='rgba(255,255,255,.35)';g.fillRect(384,1560,6,96);});
};

/* ---------- 4. банк «Мегаполис»: Макс за столом лицом к нам, ночь, стекло ---------- */
W8.bank=(c,t,o)=>{
  c.fillStyle=LG(c,0,0,0,1150,[[0,'#070b1a'],[.6,'#17204a'],[1,'#5a3348']]);c.fillRect(0,0,WW,1150);twinkle(c,t,40,0,420,11);
  cityFar(c,960,{col:'#1c1a34',h:60,n:240,seed:21});moscowCity(c,320,1000,.85,{lite:.5});stalinka(c,880,1000,.45,'#3a3150');carsT(c,1000,t,{n:24,sp:60,r:8});
  fog(c,t,900,{n:8,sp:12,h:80,r:420,a:.14,seed:4});
  c.fillStyle='rgba(30,40,70,.25)';c.fillRect(0,0,WW,1150);
  c.fillStyle='#0b0d14';for(const x of [0,360,720,1080])c.fillRect(x-8,0,16,1160);c.fillRect(0,1140,WW,20);
  // логотип на стекле
  c.save();c.globalAlpha=.85;tx(c,'МЕГАПОЛИС',540,250,{f:'M',w:800,s:58,ls:14,c:'rgba(230,236,255,.18)'});c.restore();
  c.strokeStyle='rgba(230,236,255,.16)';c.lineWidth=3;c.beginPath();c.arc(540,150,40,0,TAU);c.stroke();c.beginPath();c.moveTo(510,165);c.lineTo(540,125);c.lineTo(570,165);c.stroke();
  // коллеги за стеклом коридора
  c.save();c.globalAlpha=.55;walkers(c,t,840,.42,5,'#0d1020',3);c.restore();
  // пол
  c.fillStyle=LG(c,0,1150,0,HH,[[0,'#171a22'],[1,'#07080b']]);c.fillRect(0,1150,WW,HH-1150);
  glowDot(c,540,1000,420,'#ffb27a',.22);
  // Макс
  const br=Math.sin(t*1.6)*2;
  person(c,{x:540,y:840+br,s:1.05,skin:SKINS.b,hairC:'#1d140f',beard:1,L:-1,turn:-.05,look:[0,.15],suit:'#11141c',shirt:'#e6e8ec',tie:'#5a1b22',mouth:o.smile?'smile':'neutral',rim:'#ffb27a',R:1,rimA:.9});
  // монитор слева, свет на лице
  c.fillStyle='#0a0c11';c.beginPath();c.moveTo(80,1010);c.lineTo(300,990);c.lineTo(300,1140);c.lineTo(80,1150);c.closePath();c.fill();
  glowDot(c,250,1060,260,'#6fb6ff',.22);
  // стол
  c.fillStyle=LG(c,0,1180,0,1540,[[0,'#3b2a20'],[1,'#120c08']]);c.beginPath();c.moveTo(40,1180);c.lineTo(1040,1180);c.lineTo(1120,1560);c.lineTo(-40,1560);c.closePath();c.fill();
  c.fillStyle='rgba(255,200,140,.25)';c.fillRect(40,1180,1000,5);
  c.fillStyle='#0b0805';c.fillRect(-40,1560,WW+80,HH-1560);
  // табличка
  c.save();c.translate(540,1300);c.fillStyle='#14110e';rr(c,-210,-38,420,76,8);c.fill();c.fillStyle='rgba(201,150,59,.5)';c.fillRect(-210,-38,420,3);
  tx(c,'М. АНДРЕЕВ',0,-2,{f:'M',w:800,s:28,ls:4,c:'#e3b35a'});tx(c,'КРЕДИТНЫЙ ОТДЕЛ',0,26,{f:'J',w:500,s:15,ls:4,c:'rgba(227,179,90,.7)'});c.restore();
  // бумаги, ручка
  c.save();c.translate(820,1330);c.rotate(.12);c.fillStyle='#e9e6df';c.fillRect(-100,-60,200,120);c.fillStyle='rgba(0,0,0,.2)';for(let k=0;k<5;k++)c.fillRect(-80,-40+k*18,150-(k%2)*40,4);c.restore();
  fgBlur(c,10,g=>{g.fillStyle='#050608';g.fillRect(-40,0,110,HH);g.fillStyle='rgba(255,190,120,.12)';g.fillRect(60,0,6,HH);
    g.fillStyle='rgba(220,150,70,.7)';g.beginPath();g.moveTo(880,1600);g.lineTo(990,1600);g.lineTo(980,1740);g.lineTo(890,1740);g.closePath();g.fill();});
};

/* ---------- 5. фон для огромных цифр ---------- */
W8.numbg=(c,t,o)=>{const tone=o.tone||'gold';
  blurred(c,12,g=>{if(tone==='red'){clubHall(g,{ac:'#ff2f8e',ac2:'#38d6ff'});}else W8.city(g,t,{});});
  c.fillStyle=tone==='red'?'rgba(12,4,10,.55)':'rgba(4,6,14,.5)';c.fillRect(0,0,WW,HH);
  const col=tone==='red'?'#ff2f8e':'#ffb13b';
  for(let i=0;i<26;i++){const x=H1(i*3.7)*WW,y=(H1(i*9.1)*HH-t*(20+30*H1(i)))%HH,yy=y<0?y+HH:y;glowDot(c,x,yy,20+40*H1(i*5),i%3?col:'#ffffff',.25+.35*H1(i*2));}
  glowDot(c,540,820,620,col,.18);
};

/* ---------- 6. переговорная (a1): шеф говорит, макет едет к камере ---------- */
W8.meeting=(c,t,o)=>{const vx=540;
  c.fillStyle=LG(c,0,0,0,HH,[[0,'#cfd6df'],[1,'#8c96a3']]);c.fillRect(0,0,WW,HH);
  c.fillStyle='#e8ecf1';c.beginPath();c.moveTo(0,0);c.lineTo(WW,0);c.lineTo(860,380);c.lineTo(220,380);c.closePath();c.fill();
  for(let i=-4;i<=4;i++){c.strokeStyle='rgba(255,255,255,.9)';c.lineWidth=10;c.beginPath();c.moveTo(vx+i*150,0);c.lineTo(vx+i*35,380);c.stroke();}
  c.fillStyle='#b3bcc7';c.beginPath();c.moveTo(0,0);c.lineTo(220,380);c.lineTo(220,920);c.lineTo(0,HH);c.closePath();c.fill();
  c.fillStyle='#a2abb7';c.beginPath();c.moveTo(WW,0);c.lineTo(860,380);c.lineTo(860,920);c.lineTo(WW,HH);c.closePath();c.fill();
  c.save();c.beginPath();c.rect(220,380,640,540);c.clip();
  c.fillStyle=LG(c,0,380,0,920,[[0,'#9fc3e6'],[1,'#e6eef4']]);c.fillRect(220,380,640,540);
  for(let i=0;i<4;i++){const x=((H1(i)*900+t*14*(1+i*.3))%900)+120;c.fillStyle='rgba(255,255,255,.5)';c.beginPath();c.ellipse(x,430+i*30,70,14,0,0,TAU);c.fill();}
  cityFar(c,860,{col:'#8b9db2',h:40,n:0});moscowCity(c,600,880,.55,{lite:0});
  c.fillStyle='rgba(230,240,250,.35)';c.fillRect(220,380,640,540);c.restore();
  c.fillStyle='#2d333c';for(const mx of [220,433,646,860])c.fillRect(mx-6,380,12,540);c.fillRect(220,374,640,12);
  const tk=o.talk?flap(t):'flat';
  person(c,{x:540,y:730+Math.sin(t*1.4)*2,s:.58,skin:SKINS.o,hair:'grey',hairC:'#a5a8ae',glasses:true,L:-1,look:[0,.4],suit:'#2a2c33',tie:'#5a1b22',mouth:tk,brow:'frown',rim:'#ffffff',rimA:.6});
  const P=[[388,812,.56,1,SKINS.a,'short','#3b2a1e','#1d2330'],[692,812,.56,-1,SKINS.c,'long','#2a1810','#3a2232'],[268,880,.8,1,SKINS.b,'bald','#2a2a2a','#20242c'],
    [812,880,.8,-1,SKINS.a,'short','#5a3a22','#262a33'],[90,1000,1.2,1,SKINS.c,'short','#151010','#1a1d24'],[990,1000,1.2,-1,SKINS.o,'long','#8a5a32','#2c2030']];
  for(const [x,y,s,sd,sk,hr,hc,su] of P)person(c,{x,y:y+Math.sin(t*1.1+x)*1.5,s,skin:sk,hair:hr,hairC:hc,turn:sd*.32,look:[sd*.8,.5],L:-1,suit:su,shirt:hr==='long'?'#e9e2dc':'#e6e6e2',mouth:o.smile&&H1(x)>.4?'smile':H1(x)>.5?'flat':'neutral',rimA:.35,rim:'#ffffff',beard:hr==='bald'?1:0});
  c.fillStyle=LG(c,0,900,0,HH,[[0,'#3b2a20'],[1,'#1a110c']]);c.beginPath();c.moveTo(400,900);c.lineTo(680,900);c.lineTo(1500,HH);c.lineTo(-420,HH);c.closePath();c.fill();
  c.fillStyle=LG(c,0,900,0,HH,[[0,'rgba(255,255,255,.25)'],[.4,'rgba(255,255,255,.05)'],[1,'rgba(255,255,255,0)']]);c.beginPath();c.moveTo(500,900);c.lineTo(580,900);c.lineTo(760,HH);c.lineTo(320,HH);c.closePath();c.fill();
  for(const [x,y,s,a] of [[470,960,.4,-.1],[640,965,.4,.12],[300,1100,.7,-.2],[800,1110,.7,.2]]){c.save();c.translate(x,y);c.rotate(a);c.scale(s,s);c.fillStyle='#f4f2ec';c.fillRect(-60,-40,120,80);c.fillStyle='rgba(0,0,0,.25)';for(let k=0;k<5;k++)c.fillRect(-48,-28+k*13,90-(k%2)*30,3);c.restore();}
  const vk=eio(o.vk||0);village(c,540,lp(1240,1440,vk),lp(1.0,1.55,vk));
  if(o.fg!==false)fgBlur(c,10,g=>{g.save();g.translate(300,1780);g.rotate(-.12);g.fillStyle='#1d2a3a';g.fillRect(-200,-90,420,240);g.fillStyle='#f1efe9';g.fillRect(-180,-80,380,220);g.restore();
    g.save();g.translate(760,1800);g.rotate(.5);g.fillStyle='#0d0d10';g.fillRect(-12,-150,24,300);g.fillStyle='#c9a24a';g.fillRect(-12,-150,24,30);g.restore();});
};

/* ---------- 7. стекло банка днём (жалюзи, Сити), люди в коридоре ---------- */
W8.steel=(c,t,o)=>{steelOffice(c);c.save();c.globalAlpha=.6;walkers(c,t,1180,.6,4,'#0b0f14',8);c.restore();
  glowDot(c,860,420,300,'#ffffff',.12);};

/* ---------- 8. клуб-арена, Макс в центре (h2a) ---------- */
function clubLive(c,t,o={}){const ac=o.ac||'#f5a623',ac2=o.ac2||'#4a8dff';
  c.fillStyle=LG(c,0,0,0,HH,[[0,'#07040d'],[.5,'#140820'],[1,'#05030a']]);c.fillRect(0,0,WW,HH);
  for(let i=0;i<14;i++){const x=40+i*76,a=.35+.35*Math.max(0,Math.sin(t*4+i*.9));c.fillStyle=LG(c,0,300,0,900,[[0,rgba(i%2?ac:ac2,0)],[.5,rgba(i%2?ac:ac2,a)],[1,rgba(i%2?ac:ac2,0)]]);c.fillRect(x,300,8,600);}
  c.fillStyle=LG(c,0,240,0,960,[[0,'rgba(7,4,13,1)'],[.25,'rgba(7,4,13,.55)'],[.75,'rgba(7,4,13,.55)'],[1,'rgba(7,4,13,1)']]);c.fillRect(0,240,WW,720);
  c.fillStyle='#0b0612';c.fillRect(380,820,320,70);c.fillStyle=rgba(ac2,.7);c.fillRect(380,818,320,4);glowDot(c,540,820,160,ac2,.35+.2*Math.sin(t*8));
  const B=[[200,.35,ac],[420,.12,ac2],[660,-.1,ac],[880,-.35,ac2],[540,0,'#ffffff']];
  for(let i=0;i<B.length;i++){const [x,a,col]=B[i];beam(c,x,-20,a+Math.sin(t*1.6+i*1.7)*.28,.22,1300,col,.9);}
  fog(c,t,900,{n:16,sp:30,h:300,r:520,a:.22,seed:5});
  const beat=Math.pow(Math.max(0,Math.cos(t*TAU*105.5/60)),8);
  for(let row=0;row<3;row++){const y=880+row*90,s=.38+row*.14;for(let i=0;i<16;i++){const x=(i+.5)*WW/16+(H1(i*3+row)-.5)*50;
    sil(c,x,y+(H1(i*7+row)-.5)*30-beat*10*(.5+H1(i+row)),s,{col:row===2?'#06040a':'#0c0714',up:H1(i*5+row)>.5?.6+.4*H1(i)+.2*beat:0,both:H1(i*9+row)>.75,side:H1(i+row*3)>.5?1:-1,rim:H1(i)>.5?ac:ac2,ra:.45+row*.15});}}
  if(o.strobe){const k=Math.max(0,Math.sin(t*TAU*3.5));if(k>.92){c.fillStyle=`rgba(255,255,255,${(k-.92)*3})`;c.fillRect(0,0,WW,HH);}}
}
W8.club=(c,t,o)=>{clubLive(c,t,{strobe:true});
  c.strokeStyle='#1a2233';c.lineWidth=6;for(const y of [160,220]){c.beginPath();c.moveTo(0,y);c.lineTo(WW,y);c.stroke();}
  c.lineWidth=3;for(let x=0;x<WW;x+=60){c.beginPath();c.moveTo(x,160);c.lineTo(x+60,220);c.moveTo(x+60,160);c.lineTo(x,220);c.stroke();}
  glowDot(c,540,1000,360,'#f5a623',.45);
  person(c,{x:540,y:1010+Math.sin(t*TAU*105.5/60)*4,s:.78,skin:SKINS.b,hairC:'#1d140f',beard:1,L:-1,look:[0,.1],suit:'#0b0d13',open:true,skinC:SKINS.b.b,mouth:'smile',rim:'#f5a623',R:1,rimA:1});
  c.save();c.translate(540,1010);c.scale(.78,.78);rimStroke(c,[headPath({})],'#4a8dff',.8,7,-1,90);c.restore();
  blurred(c,4,g=>{for(let i=0;i<6;i++){const x=60+i*195+(H1(i*13)-.5)*40+Math.sin(t*2+i)*10;sil(g,x,1420+(H1(i*7)-.5)*60+Math.sin(t*TAU*105.5/60+i)*8,1.05,{col:'#05060a',up:i===1||i===4?.9:0,both:i===4,side:i===1?1:-1,rim:i%2?'#f5a623':'#4a8dff',ra:.8});}});
};

/* ---------- 9. VIP: Миша и Макс (d2) ---------- */
function bottle(c,x,y,s,col){c.save();c.translate(x,y);c.scale(s,s);c.fillStyle=col;c.beginPath();c.moveTo(-26,0);c.lineTo(-26,-120);c.quadraticCurveTo(-26,-150,-10,-165);c.lineTo(-10,-215);c.lineTo(10,-215);c.lineTo(10,-165);c.quadraticCurveTo(26,-150,26,-120);c.lineTo(26,0);c.closePath();c.fill();
  c.fillStyle='#d8b04a';c.fillRect(-11,-228,22,40);c.fillStyle='rgba(255,255,255,.35)';c.fillRect(-18,-130,6,110);c.fillStyle='#e9e2d2';c.fillRect(-20,-90,40,40);c.restore();}
function flute(c,gx,y,t,s=1){c.save();c.translate(gx,y);c.scale(s,s);c.fillStyle='rgba(255,230,170,.55)';c.beginPath();c.moveTo(-14,0);c.lineTo(14,0);c.lineTo(8,60);c.lineTo(-8,60);c.closePath();c.fill();
  c.fillStyle='rgba(255,255,255,.6)';c.fillRect(-1,60,2,24);c.fillRect(-10,84,20,3);
  for(let i=0;i<4;i++){const ph=((t*.9+H1(gx+i))%1);c.fillStyle=`rgba(255,255,255,${.7*(1-ph)})`;c.beginPath();c.arc(-6+i*4,56-ph*54,1.6,0,TAU);c.fill();}c.restore();}
function vipSet(c,t){c.fillStyle=LG(c,0,1080,0,1500,[[0,'#5a0d1e'],[1,'#22040b']]);rr(c,60,1060,960,330,90);c.fill();
  c.fillStyle='rgba(255,90,140,.18)';rr(c,60,1060,960,24,12);c.fill();
  for(let i=0;i<6;i++){c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=4;c.beginPath();c.moveTo(150+i*156,1080);c.lineTo(150+i*156,1380);c.stroke();}}
function vipTable(c,t){c.fillStyle=LG(c,0,1400,0,1520,[[0,'#2a2230'],[1,'#0b0910']]);c.beginPath();c.moveTo(120,1420);c.lineTo(960,1420);c.lineTo(1040,1530);c.lineTo(40,1530);c.closePath();c.fill();
  c.fillStyle='rgba(255,255,255,.18)';c.fillRect(120,1420,840,4);
  c.fillStyle=LG(c,250,0,390,0,[[0,'#7d8594'],[.5,'#d9dee6'],[1,'#5d6470']]);c.beginPath();c.moveTo(250,1310);c.lineTo(390,1310);c.lineTo(370,1430);c.lineTo(270,1430);c.closePath();c.fill();
  bottle(c,300,1330,.8,'#0f2b18');bottle(c,345,1335,.72,'#1a1a22');bottle(c,700,1500,.75,'#0f2b18');
  for(const gx of [500,560,820,880])flute(c,gx,1340,t);}
W8.vip=(c,t,o)=>{clubLive(c,t,{ac:'#ff2f8e',ac2:'#38d6ff'});vipSet(c,t);
  person(c,{x:420,y:1010+Math.sin(t*1.7)*2,s:.95,skin:SKINS.b,hair:'curly',hairC:'#1a120d',beard:2,L:1,turn:.25,look:[.6,0],suit:'#2b1838',shirt:'#9c2a44',mouth:o.talk?flap(t,.9):'open',brow:'up',hw:68,jaw:1.1,rim:'#ff4fa0',R:-1,rimA:.9});
  person(c,{x:760,y:1030+Math.sin(t*1.3+1)*2,s:.9,skin:SKINS.b,hairC:'#1d140f',beard:1,L:-1,turn:-.28,look:[-.8,0],suit:'#0b0d13',open:true,skinC:SKINS.a.b,mouth:'flat',brow:o.maxBrow||'flat',rim:'#46d6ff',R:1,rimA:.6});
  vipTable(c,t);
  fgBlur(c,12,g=>{for(const [x,y,s] of [[90,1760,1.6],[330,1820,1.3],[980,1740,1.7],[720,1860,1.2]])sil(g,x+Math.sin(t*1.5+x)*12,y,s,{col:'#030205',rim:'#ff2f8e',ra:.7});});
};

/* ---------- 10. VIP с девушками, вспышки камер ---------- */
W8.girls=(c,t,o)=>{clubLive(c,t,{ac:'#ff2f8e',ac2:'#f5a623'});vipSet(c,t);
  const G=[[300,1000,.9,SKINS.c,'#3b2414','#b0123a',.35],[780,1000,.9,SKINS.a,'#e7c27a','#141218',-.35]];
  for(const [x,y,s,sk,hc,dr,tu] of G){const yy=y+Math.sin(t*1.6+x)*2;person(c,{x,y:yy,s,skin:sk,hair:'long',hairC:hc,L:tu>0?1:-1,turn:tu,look:[tu*1.4,0],suit:dr,shirt:dr,skinC:sk.b,open:true,mouth:'smile',brow:'up',hw:56,jaw:.92,rim:'#ff4fa0',R:tu>0?-1:1,rimA:.5});
    c.save();c.translate(x,yy);c.scale(s,s);c.fillStyle='#c0182e';c.beginPath();c.ellipse(tu*14,50,13,6,0,0,TAU);c.fill();c.strokeStyle='#120808';c.lineWidth=3.5;c.lineCap='round';
    for(const sd of [-1,1]){const ex=sd*25+tu*14;c.beginPath();c.moveTo(ex-sd*16,-1);c.lineTo(ex-sd*22,-7);c.moveTo(ex+sd*15,-3);c.lineTo(ex+sd*21,-10);c.stroke();}
    c.fillStyle='#ffd27a';for(const sd of [-1,1]){c.beginPath();c.arc(sd*60+tu*4,26,4,0,TAU);c.fill();}c.restore();}
  person(c,{x:540,y:1040,s:.95,skin:SKINS.b,hairC:'#1d140f',beard:1,L:-1,look:[0,.1],suit:'#0b0d13',open:true,skinC:SKINS.b.b,mouth:'smile',rim:'#f5a623',R:1,rimA:.9});
  vipTable(c,t);
  flashes(c,t,[[120,700],[950,640],[260,520],[820,860],[540,560]],o.seed||2);
};

/* ---------- 11. шампанское крупно: пробка вылетает ---------- */
W8.champ=(c,t,o)=>{blurred(c,14,g=>clubLive(g,t,{ac:'#ff2f8e',ac2:'#f5a623'}));c.fillStyle='rgba(8,4,10,.35)';c.fillRect(0,0,WW,HH);
  for(let i=0;i<18;i++){const x=H1(i*3.1)*WW,y=H1(i*7.7)*1100+200;glowDot(c,x,y,30+50*H1(i),i%2?'#ff2f8e':'#f5a623',.3);}
  const lt=t-(o.pop??0);
  // ведро со льдом и бутылка
  c.fillStyle=LG(c,320,0,760,0,[[0,'#6d7584'],[.45,'#e2e6ee'],[.6,'#aab1bd'],[1,'#4d5462']]);c.beginPath();c.moveTo(300,1180);c.lineTo(780,1180);c.lineTo(730,1640);c.lineTo(350,1640);c.closePath();c.fill();
  c.fillStyle='rgba(255,255,255,.35)';c.fillRect(300,1180,480,8);
  c.save();c.translate(560,1260);c.rotate(-.18);bottle(c,0,0,2.4,'#0f2b18');c.restore();
  if(lt<0){c.save();c.translate(560-.18*520,1260-520);c.fillStyle='#d8b04a';c.fillRect(-26,-30,52,60);c.restore();}
  else{const k=Math.min(lt,1.2),cx=560-95+lt*420,cy=1260-520-lt*1500+lt*lt*1800;c.save();c.translate(cx,cy);c.rotate(lt*14);c.fillStyle='#d8b04a';rr(c,-24,-28,48,56,8);c.fill();c.restore();
    for(let i=0;i<60;i++){const a=-1.75+(H1(i)-.5)*.9,v=500+900*H1(i*3),tt=Math.min(lt,1.4),x=560-95+Math.cos(a)*v*tt,y=1260-520+Math.sin(a)*v*tt+tt*tt*900;if(tt>1.2*H1(i*5)+.3)continue;
      c.fillStyle=`rgba(255,248,220,${.8*(1-tt/1.4)})`;c.beginPath();c.arc(x,y,4+8*H1(i*7),0,TAU);c.fill();}
    if(lt<.12){glowDot(c,560-95,1260-520,300,'#fff6d8',1.4*(1-lt/.12));}}
  for(const [gx,s] of [[230,2.2],[870,2.2]])flute(c,gx,1240,t,s);
  fgBlur(c,10,g=>{g.fillStyle='#0a0710';g.fillRect(-40,1700,WW+80,260);});
};

/* ---------- 12. договор на столе крупно, подпись (ручка без руки) ---------- */
function sigPath(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);c.beginPath();c.moveTo(-120,10);c.bezierCurveTo(-90,-40,-70,40,-40,0);c.bezierCurveTo(-20,-30,0,30,20,-6);c.bezierCurveTo(40,-40,60,30,90,-4);c.bezierCurveTo(110,-20,130,10,160,-10);c.restore();}
const SIGL=760;
W8.desk=(c,t,o)=>{const dark=o.dark;
  c.fillStyle=dark?LG(c,0,0,0,HH,[[0,'#1a1410'],[1,'#080605']]):LG(c,0,0,0,HH,[[0,'#3b2a20'],[1,'#140d09']]);c.fillRect(0,0,WW,HH);
  for(let i=0;i<40;i++){c.strokeStyle=`rgba(0,0,0,${.08+.1*H1(i)})`;c.lineWidth=2+3*H1(i*2);c.beginPath();const y=H1(i*7)*HH;c.moveTo(0,y);c.bezierCurveTo(300,y+20*Math.sin(i),700,y-20,WW,y+10);c.stroke();}
  glowDot(c,620,700,700,dark?'#ff2f8e':'#ffb27a',.22);
  if(o.title!==false){c.save();c.translate(540,980);c.rotate(-.06);c.fillStyle='rgba(0,0,0,.5)';c.fillRect(-370,-500,760,1040);c.fillStyle='#ece9e2';c.fillRect(-380,-510,760,1020);
    tx(c,'КРЕДИТНЫЙ ДОГОВОР',0,-400,{f:'M',w:800,s:34,ls:4,c:'#1b1f26'});tx(c,o.title||'«РАЙ МИЛЛИОНЕРОВ»',0,-340,{f:'P',w:700,s:46,c:'#1b1f26'});
    for(let k=0;k<14;k++){c.fillStyle='rgba(30,34,40,.25)';c.fillRect(-300,-260+k*34,600-(k%3)*90,8);}
    tx(c,o.sum||'€ ··· 000',150,300,{f:'O',w:700,s:58,c:'#a37224'});
    c.strokeStyle='#1b1f26';c.lineWidth=2;c.beginPath();c.moveTo(-300,420);c.lineTo(60,420);c.stroke();tx(c,'ПОДПИСЬ',-120,455,{f:'J',w:500,s:16,ls:4,c:'rgba(27,31,38,.6)'});
    const sk=cl(o.sig??0);if(sk>0){c.save();c.translate(-130,395);c.strokeStyle='#1f3b8a';c.lineWidth=7;c.lineCap='round';c.setLineDash([SIGL*sk,4000]);sigPath(c,0,0,1.3);c.stroke();c.restore();}
    c.restore();
    // ручка: кончик в конце подписи
    const sk2=cl(o.sig??0),px=lp(-130-156,-130+208,sk2),py=395+Math.sin(sk2*24)*16;c.save();c.translate(540,980);c.rotate(-.06);c.translate(px,py);c.rotate(-.75);
    c.fillStyle='rgba(0,0,0,.35)';c.fillRect(14,10,22,560);c.fillStyle='#0b0b0d';rr(c,-11,-560,22,560,10);c.fill();c.fillStyle='#c9963b';c.fillRect(-11,-560,22,60);c.fillRect(-11,-300,22,10);
    c.fillStyle='#d9d9dc';c.beginPath();c.moveTo(-11,0);c.lineTo(11,0);c.lineTo(0,34);c.closePath();c.fill();c.restore();}
  if(o.glass){fgBlur(c,8,g=>{g.fillStyle='rgba(220,150,70,.65)';g.beginPath();g.moveTo(860,1500);g.lineTo(1040,1500);g.lineTo(1020,1760);g.lineTo(880,1760);g.closePath();g.fill();});}
};

/* ---------- 13. макет посёлка крупно (окна зажигаются) ---------- */
W8.model=(c,t,o)=>{c.fillStyle=LG(c,0,0,0,HH,[[0,'#2b2a33'],[1,'#120d0b']]);c.fillRect(0,0,WW,HH);
  blurred(c,12,g=>{steelOffice(g);});c.fillStyle='rgba(10,10,14,.45)';c.fillRect(0,0,WW,HH);
  c.fillStyle=LG(c,0,1000,0,HH,[[0,'#3b2a20'],[1,'#140d09']]);c.fillRect(0,1000,WW,HH-1000);
  village(c,540,1240,2.6);
  const lit=cl(o.lit||0);if(lit>0){const H=[[-150,-30,.8],[-80,-36,.75],[80,-34,.75],[150,-28,.8],[-190,20,1],[-110,30,1.05],[90,26,1.05],[180,22,1],[-230,70,1.2],[230,66,1.2]];
    c.save();c.translate(540,1240);c.scale(2.6,2.6);for(let i=0;i<H.length;i++){const [hx,hy,k]=H[i];if(H1(i*3)>lit*1.2)continue;c.save();c.translate(hx,hy);c.scale(k,k);
      c.fillStyle='#ffd27a';c.fillRect(-14,-16,10,10);c.fillRect(4,-16,10,10);c.restore();glowDot(c,hx,hy-12,30*k,'#ffc070',.7*lit);}c.restore();
    c.fillStyle=`rgba(5,8,20,${.55*lit})`;c.fillRect(0,0,WW,HH);
    c.save();c.translate(540,1240);c.scale(2.6,2.6);for(let i=0;i<H.length;i++){const [hx,hy,k]=H[i];if(H1(i*3)>lit*1.2)continue;glowDot(c,hx,hy-12,22*k,'#ffd27a',1);}c.restore();}
};

/* ---------- 14. вход в клуб: канат, вышибала, неон ---------- */
W8.entry=(c,t,o)=>{c.fillStyle=LG(c,0,0,0,HH,[[0,'#0a0710'],[1,'#030205']]);c.fillRect(0,0,WW,HH);
  // стена из кирпича
  c.fillStyle='#1a1216';c.fillRect(0,0,WW,1250);c.strokeStyle='rgba(0,0,0,.5)';c.lineWidth=3;for(let j=0;j<31;j++){c.beginPath();c.moveTo(0,j*40);c.lineTo(WW,j*40);c.stroke();for(let i=0;i<14;i++){const x=i*90+(j%2)*45;c.beginPath();c.moveTo(x,j*40);c.lineTo(x,j*40+40);c.stroke();}}
  // неоновая вывеска
  const fl=(Math.sin(t*37)>.96||(t%3.1>2.95))?.35:1;
  c.save();c.translate(540,330);c.rotate(-.05);tx(c,'Клуб',0,0,{f:'C',w:700,s:200,c:rgba('#ff4fa0',fl),glow:'#ff2f8e',gb:40});c.restore();glowDot(c,540,280,520,'#ff2f8e',.3*fl);
  // дверь со светом
  c.fillStyle='#050306';rr(c,380,560,320,690,10);c.fill();const dk=cl(o.door||0);c.fillStyle=LG(c,0,560,0,1250,[[0,'rgba(255,170,90,.9)'],[1,'rgba(255,90,140,.7)']]);c.fillRect(540-150*dk,575,300*dk,665);
  glowDot(c,540,900,520*dk+60,'#ff9a5c',.6*dk+.15);beam(c,540,1240,Math.PI,.9,700,'#ff9a5c',.4*dk);
  // очередь
  c.save();c.globalAlpha=.9;for(let i=0;i<5;i++)sil(c,90+i*70+Math.sin(t+i)*3,960+i*14,.7,{col:'#07050a',rim:'#ff2f8e',ra:.5});c.restore();
  // тротуар, лужи
  c.fillStyle=LG(c,0,1250,0,HH,[[0,'#140d12'],[1,'#050305']]);c.fillRect(0,1250,WW,HH-1250);
  c.save();c.globalCompositeOperation='screen';c.globalAlpha=.35;c.translate(0,2500);c.scale(1,-1);c.filter='blur(6px)';c.drawImage(c.canvas,0,560,WW,690,0,1250,WW,690);c.restore();
  // вышибала
  person(c,{x:800,y:830,s:1.05,skin:SKINS.a,hair:'bald',hairC:'#2a2a2a',beard:1,L:-1,turn:o.pov?-.05:-.3,look:o.pov?[0,.2]:[-.7,0],suit:'#050608',shirt:'#050608',mouth:'flat',brow:'frown',hw:70,jaw:1.15,rim:'#ff4fa0',R:-1,rimA:.9});
  // канат на стойках
  const rk=cl(o.rope||0);for(const sx of [280,700]){c.fillStyle=LG(c,sx-14,0,sx+14,0,[[0,'#7a5a1e'],[.5,'#f2d27a'],[1,'#6a4a12']]);c.fillRect(sx-12,1190,24,280);c.beginPath();c.arc(sx,1188,22,0,TAU);c.fill();c.fillRect(sx-40,1460,80,16);}
  c.strokeStyle='#9c1028';c.lineWidth=22;c.lineCap='round';c.beginPath();c.moveTo(280,1205);
  if(rk<1){const ex=lp(700,640,rk),ey=lp(1205,1460,rk*rk);c.quadraticCurveTo(lp(490,520,rk),lp(1330,1470,rk),ex,ey);}else{c.quadraticCurveTo(440,1420,520,1470);}c.stroke();
  c.strokeStyle='rgba(255,120,150,.35)';c.lineWidth=5;c.stroke();
  carsT(c,1640,t,{n:6,sp:400,r:40,sy:0});
};

/* ---------- 15. Тверская: полёт вдоль проспекта ---------- */
const ST={HZ:860,F:900,HC:150};let STB=null;
function stBlds(){if(STB)return STB;STB=[];for(const sd of [-1,1]){let Z=20000,k=0;while(Z>150){const len=700+H1(k*2.7+sd)*700,h=380+H1(k*4.1+sd*3)*260,Z1=Math.max(150,Z-len);
  STB.push({sd,Z0:Z1,Z1:Z,h,k,col:['#4a3a32','#3d3a44','#56463a','#40383e'][(k+(sd>0?2:0))%4]});Z=Z1-40;k++;}}STB.sort((a,b)=>b.Z1-a.Z1);return STB;}
W8.street=(c,t,o)=>{const cz=o.cz||0,{HZ,F,HC}=ST,P=(X,h,Z)=>{const z=Math.max(50,Z-cz);return [540+X*F/z,HZ+(HC-h)*F/z];};
  c.fillStyle=LG(c,0,0,0,HZ,[[0,'#0a0c1a'],[.6,'#2a2040'],[1,'#7a3e3a']]);c.fillRect(0,0,WW,HZ+10);twinkle(c,t,30,0,300,13);
  stalinka(c,540,HZ+6,.42,'#3a3048');
  c.fillStyle=LG(c,0,HZ,0,HH,[[0,'#2a2028'],[1,'#07060a']]);c.fillRect(0,HZ,WW,HH-HZ);
  const QD=(pts,fill)=>{c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(const q of pts)c.lineTo(q[0],q[1]);c.closePath();c.fillStyle=fill;c.fill();};
  for(const B of stBlds()){if(B.Z1-cz<60||B.Z0-cz>14000)continue;const Z0=Math.max(B.Z0,cz+60),X=B.sd*620;
    QD([P(X,0,Z0),P(X,B.h,Z0),P(X,B.h,B.Z1),P(X,0,B.Z1)],LG(c,P(X,0,Z0)[0],0,P(X,0,B.Z1)[0],0,[[0,sh(B.col,.08)],[1,sh(B.col,-.5)]]));
    const nf=Math.floor(B.h/48),nc=Math.floor((B.Z1-B.Z0)/110);
    for(let fi=1;fi<nf;fi++)for(let ci=0;ci<nc;ci++){const r=H2(ci+B.k*17+B.sd*5,fi);if(r>.62)continue;const z0=B.Z0+ci*110+30,z1=z0+50;if(z0<cz+60)continue;const h0=fi*48,h1=h0+26;
      QD([P(X,h0,z0),P(X,h1,z0),P(X,h1,z1),P(X,h0,z1)],r<.48?`rgba(255,${190+(r*110|0)},${120+(r*120|0)},${.6+.3*r})`:`rgba(140,170,220,${.3+.3*r})`);}
    // витрины первого этажа
    QD([P(X,8,Z0),P(X,40,Z0),P(X,40,B.Z1),P(X,8,B.Z1)],B.k%3?'rgba(255,200,140,.55)':'rgba(120,200,255,.45)');
    QD([P(X,B.h,Z0),P(X,B.h+22,Z0),P(X,B.h+22,B.Z1),P(X,B.h,B.Z1)],sh(B.col,-.25));}
  // фонари и машины
  for(const sd of [-1,1]){for(let j=Math.ceil((cz+120)/500);j*500<cz+12000;j++){const Z=j*500,[lx,ly]=P(sd*520,90,Z),[bx,bY]=P(sd*520,0,Z),k=F/(Z-cz);c.strokeStyle='#0b0a10';c.lineWidth=Math.max(1,7*k);c.beginPath();c.moveTo(bx,bY);c.lineTo(lx,ly);c.stroke();glowDot(c,lx,ly,Math.max(4,70*k),'#ffcf8a',.95);}
    for(let i=0;i<26;i++){const Z=((H1(i*5+sd*3)*10000+t*(sd>0?-1400:900)-cz)%10000+10000)%10000+cz+150,[x,y]=P(sd*(180+(i%3)*90),10,Z),k=F/(Z-cz);
      glowDot(c,x-14*k*sd,y,Math.max(3,46*k),sd>0?'#fff1d6':'#ff3b30',.95);glowDot(c,x+14*k*sd,y,Math.max(3,46*k),sd>0?'#fff1d6':'#ff3b30',.95);}}
  c.save();c.globalCompositeOperation='screen';c.strokeStyle='rgba(255,235,200,.35)';c.lineWidth=3;c.setLineDash([40,60]);c.beginPath();for(let Z=cz+100;Z<cz+12000;Z*=1.06){const [x,y]=P(0,0,Z);Z===cz+100?c.moveTo(x,y):c.lineTo(x,y);}c.stroke();c.restore();
  // уличная табличка «Тверская ул.»
  {const Z=o.signZ||3000;if(Z-cz>120){const [x,y]=P(-430,230,Z),k=F/(Z-cz);c.save();c.translate(x,y);c.scale(k*3.2,k*3.2);c.fillStyle='#0c3f8c';rr(c,-90,-26,180,52,6);c.fill();c.strokeStyle='#fff';c.lineWidth=3;rr(c,-84,-20,168,40,4);c.stroke();
    tx(c,'ТВЕРСКАЯ УЛ.',0,8,{f:'M',w:800,s:20,ls:1,c:'#fff'});c.restore();}}
  fog(c,t,HZ-30,{n:10,sp:20,h:80,r:520,a:.16,seed:12});
  const sp=o.blur||0;if(sp>.002){const g=TA.getContext('2d');reset(g);g.clearRect(0,0,WW,HH);g.drawImage(c.canvas,0,0);zoomBlur(c,TA,540,HZ,1,sp,7,.9);}
};

/* ---------- 16. сквозь толпу (взгляд Макса): толпа расступается ---------- */
W8.crowd=(c,t,o)=>{const k=o.k||0;clubLive(c,t,{ac:'#ff2f8e',ac2:'#38d6ff'});
  c.fillStyle='rgba(7,4,13,.35)';c.fillRect(0,860,WW,HH-860);
  const F=900,HZ=900,CZ=k*2400,rows=[];
  for(let r=0;r<20;r++){const Z=350+r*220;for(let i=0;i<9;i++){const X0=(i-4)*170+(H1(r*9+i)-.5)*110;rows.push([Z,X0,r,i]);}}
  rows.sort((a,b)=>b[0]-a[0]);
  for(const [Z,X0,r,i] of rows){const z=Z-CZ;if(z<160)continue;const near=cl(1-(z-160)/1400),part=Math.sign(X0||1)*eo(cl((near-.5)/.5))*620*(Math.abs(X0)<420?1:.5);
    const X=X0+part,s=F/z*1.25,x=540+X*F/z,y=HZ+(260)*F/z;
    sil(c,x,y-Math.abs(Math.sin(t*6+r+i))*12*s,s,{col:near>.5?'#030205':'#0b0714',up:H1(r*7+i)>.6?.7:0,side:X0>0?1:-1,rim:H1(i+r)>.5?'#ff2f8e':'#38d6ff',ra:.5+.4*near});}
  if(o.blur){const g=TA.getContext('2d');reset(g);g.clearRect(0,0,WW,HH);g.drawImage(c.canvas,0,0);zoomBlur(c,TA,540,900,1,o.blur,6,.85);}
};

/* ---------- 17. Миша напротив (взгляд Макса) ---------- */
W8.misha=(c,t,o)=>{clubLive(c,t,{ac:'#ff2f8e',ac2:'#38d6ff'});
  c.fillStyle=LG(c,0,1020,0,1500,[[0,'#5a0d1e'],[1,'#22040b']]);rr(c,80,1040,920,420,90);c.fill();c.fillStyle='rgba(255,90,140,.18)';rr(c,80,1040,920,24,12);c.fill();
  person(c,{x:540,y:860+Math.sin(t*1.9)*3,s:1.25,skin:SKINS.b,hair:'curly',hairC:'#1a120d',beard:2,L:1,turn:.05,look:[0,.15],suit:'#2b1838',shirt:'#9c2a44',mouth:o.talk?flap(t,.9):'flat',brow:o.brow||'up',hw:68,jaw:1.1,rim:'#ff4fa0',R:-1,rimA:.9});
  c.fillStyle=LG(c,0,1440,0,1700,[[0,'#2a2230'],[1,'#0b0910']]);c.beginPath();c.moveTo(-40,1460);c.lineTo(WW+40,1460);c.lineTo(WW+40,HH);c.lineTo(-40,HH);c.closePath();c.fill();
  c.fillStyle='rgba(255,255,255,.18)';c.fillRect(-40,1460,WW+80,5);
  bottle(c,190,1500,1.0,'#0f2b18');flute(c,860,1420,t,1.6);
  fgBlur(c,9,g=>{g.fillStyle='rgba(255,230,170,.5)';g.beginPath();g.moveTo(560,1640);g.lineTo(700,1640);g.lineTo(670,1820);g.lineTo(590,1820);g.closePath();g.fill();
    g.fillStyle='#0b0a10';g.beginPath();g.ellipse(250,1880,300,90,0,0,TAU);g.fill();});
};

/* ---------- 18. туалет клуба: мигает лампа, бас, лицо в зеркале ---------- */
W8.toilet=(c,t,o)=>{toiletScene(c);
  const fl=o.flick?(((t*7.3)%1<.12)||((t*2.9)%1<.05)?.55:0):0;
  if(fl){c.fillStyle=`rgba(0,5,10,${fl})`;c.fillRect(0,0,WW,HH);}
  if(o.mouth){c.save();c.beginPath();rr(c,150,300,780,930,14);c.clip();person(c,{x:540,y:760,s:2.3,skin:SKINS.b,hairC:'#1d140f',beard:1,L:1,look:[0,0],suit:'#0b0d13',open:true,skinC:SKINS.b.b,mouth:o.mouth,brow:'frown',tired:.8,rim:'#c8e0ff',R:-1,rimA:.25});
    c.fillStyle=RG(c,540,765,272,624,[[0,'rgba(255,255,255,0)'],[1,'rgba(220,235,245,.28)']]);c.fillRect(150,300,780,930);c.restore();}
  if(o.bass){const b=Math.pow(Math.max(0,Math.cos(t*TAU*105.5/60)),10);if(b>.05){c.fillStyle=`rgba(255,47,142,${.06*b})`;c.fillRect(0,0,WW,HH);}}
};

/* ---------- 19. стол в VIP крупно: ручка ---------- */
W8.pen=(c,t,o)=>{blurred(c,14,g=>W8.vip(g,t,{talk:false}));c.fillStyle='rgba(6,3,8,.4)';c.fillRect(0,0,WW,HH);
  c.fillStyle=LG(c,0,1000,0,HH,[[0,'#2a2230'],[1,'#0b0910']]);c.beginPath();c.moveTo(-200,1000);c.lineTo(WW+200,1000);c.lineTo(WW+200,HH);c.lineTo(-200,HH);c.closePath();c.fill();
  c.fillStyle='rgba(255,255,255,.12)';c.fillRect(-200,1000,WW+400,5);
  pool(c,540,1300,500,120,'#ff2f8e',.35);
  // салфетка с цифрой
  c.save();c.translate(440,1330);c.rotate(-.1);c.fillStyle='#efe9df';c.fillRect(-230,-150,460,300);c.fillStyle='rgba(0,0,0,.1)';c.fillRect(-230,-150,460,10);
  tx(c,'600 000 $',0,20,{f:'C',w:700,s:96,c:'#1f3b8a'});c.strokeStyle='#1f3b8a';c.lineWidth=4;c.beginPath();c.moveTo(-170,60);c.lineTo(170,52);c.stroke();c.restore();
  // ручка
  c.save();c.translate(700,1450);c.rotate(-.35);c.fillStyle='rgba(0,0,0,.4)';c.fillRect(-6,14,340,22);c.fillStyle='#0b0b0d';rr(c,-10,-14,340,28,12);c.fill();c.fillStyle='#c9963b';c.fillRect(250,-14,60,28);c.fillRect(120,-14,8,28);
  c.fillStyle='#d9d9dc';c.beginPath();c.moveTo(-10,-14);c.lineTo(-10,14);c.lineTo(-44,0);c.closePath();c.fill();c.fillStyle='rgba(255,255,255,.3)';c.fillRect(0,-10,300,5);c.restore();
  glowDot(c,700,1440,60+20*Math.sin(t*3),'#ffd27a',.35);
  flute(c,900,1150,t,2.2);
};

/* ================= раскадровка ================= */
const KW={dina:'хозяин жизни мегаполис нулями евро клубы шампанское обложек шеф пенсией рай миллионеров кредит миша долю шестьсот тысяч долларов месяц ответишь',
  pov:'глаза хотят шеф пенсией рай миллионеров кредит киваешь двадцать девять нулей евро клуб толпа миша друг деньги шестьсот тысяч туалет лампа бас зеркало',
  nonstop:'останавливается секунду двадцать девять мегаполиса нулей евро читая рай миллионеров посёлок тверская клуб миша шестьсот тысяч дыра ручкой сказал'};
const nrm=s=>s.toLowerCase().replace(/[«»"“”.,:;!?…—–-]/g,'');
function buildSubs(){const ws=VO.words,kw=new Set(KW[KEY].split(' ')),out=[];let cur=[];
  const push=()=>{if(cur.length){out.push(cur);cur=[];}};
  for(let i=0;i<ws.length;i++){const w=ws[i],txt=w.w.replace(/[«»]/g,'').replace(/[.,:;—]+$/,'');const len=cur.reduce((a,x)=>a+x.t.length+1,0);
    if(cur.length>=3||(cur.length&&len+txt.length>21))push();
    cur.push({t:SUBSTY[KEY]==='dyn'?txt.toUpperCase():txt,acc:kw.has(nrm(w.w)),a:w.a,b:w.b});
    if(/[.:!?…,]$/.test(w.w)||(/—$/.test(w.w)&&cur.length>=2))push();}
  push();
  for(let i=0;i<out.length-1;i++){const ch=out[i],L=ch[ch.length-1];if(ch.length>1&&L.t.length<=3&&!/[.,:!?…]$/.test(VO.words.find(w=>w.a===L.a).w)){out[i+1].unshift(ch.pop());}}
  return out.map((ch,i)=>({ws:ch,a:ch[0].a-.04,b:i<out.length-1?out[i+1][0].a-.04:ch[ch.length-1].b+.6}));}

// огромная сумма «?00 000 €»: ноли выпрыгивают по одному
function zerosNum(c,t,o){const steps=['?','?0','?00','?00 0','?00 00','?00 000'];let k=-1;for(let i=0;i<6;i++)if(t>=lp(o.t0,o.t1,i/5))k=i;if(k<0)return;
  let s=steps[k];if(t>=o.te)s+=' €';const tk=t>=o.te?t-o.te:t-lp(o.t0,o.t1,k/5),sc=1+.18*Math.exp(-tk*14)*Math.cos(tk*30);
  c.save();c.translate(540,o.y||760);c.scale(sc,sc);bigNum(c,'z'+s,s,0,0,{s:o.s||230,d:18});c.restore();
  if(t>=o.te&&o.tag)tag(c,o.tag,540,(o.y||760)+170);}
function slamNum(c,t,t0,s,o={}){if(t<t0)return;const tk=t-t0,sc=1+.35*Math.exp(-tk*12)*Math.cos(tk*28),a=cl(tk/.06);
  c.save();c.globalAlpha=a;c.translate(o.x||540,o.y||760);c.scale(sc,sc);bigNum(c,o.key||('n'+s),s,0,0,{s:o.s||230,d:o.d||18,face:o.face,side:o.side});c.restore();
  if(o.tag&&tk>.12)tag(c,o.tag,o.x||540,(o.y||760)+(o.ty||170),{bc:o.tagc});}
function strike(c,t,t0,y){if(t<t0)return;const k=eo((t-t0)/.25);c.save();c.strokeStyle='#e0283c';c.lineWidth=18;c.lineCap='round';c.shadowColor='#e0283c';c.shadowBlur=22;
  c.beginPath();c.moveTo(150,y+30);c.lineTo(lp(150,930,k),y+30-lp(0,60,k));c.stroke();c.restore();}
function chip(c,t,t0,s,x,y){if(t<t0)return;const k=E.outB(cl((t-t0)/.25));c.save();c.translate(x,y);c.scale(k,k);font(c,{f:'J',w:700,s:40,ls:3});const w=c.measureText(s).width+56;
  c.fillStyle='rgba(8,12,20,.78)';rr(c,-w/2,-38,w,76,10);c.fill();c.strokeStyle='#ffb13b';c.lineWidth=3;c.stroke();c.fillStyle='#ffb13b';c.fillRect(-w/2,-38,8,76);
  tx(c,s,4,14,{f:'J',w:700,s:40,ls:3,c:'#fff'});c.restore();}
function blink(c,lt){const op=lt<.12?0:lt<.55?eo((lt-.12)/.43):lt<.72?1:lt<.8?1-eo((lt-.72)/.08)*.85:lt<.98?.15+.85*eo((lt-.8)/.18):1;
  if(op<1){const src=TB.getContext('2d');reset(src);src.clearRect(0,0,WW,HH);src.drawImage(c.canvas,0,0);c.save();reset(c);c.globalAlpha=1-op;c.filter=`blur(${18*(1-op)}px)`;c.drawImage(TB,0,0);c.restore();}
  const h=960*(1-op)+10;c.save();reset(c);c.fillStyle='#000';c.beginPath();c.moveTo(-50,-50);c.lineTo(WW+50,-50);c.lineTo(WW+50,h-120*(1-op));c.quadraticCurveTo(540,h+140*op,-50,h-120*(1-op));c.closePath();c.fill();
  c.beginPath();c.moveTo(-50,HH+50);c.lineTo(WW+50,HH+50);c.lineTo(WW+50,HH-h+120*(1-op));c.quadraticCurveTo(540,HH-h-140*op,-50,HH-h+120*(1-op));c.closePath();c.fill();c.restore();}

function plan(){const S=[],sh=(o)=>{S.push(o);return o;};
  if(typeof PLANG!=='undefined'&&PLANG[KEY]){PLANG[KEY](S);return S;}
  if(KEY==='dina'){
    const H1x=['МОСКВА · СИТИ','2012'],CH=['01 / 07 · ХОЗЯИН ЖИЗНИ','02 / 07 · ДЕНЬ И НОЧЬ','03 / 07 · РАЙ МИЛЛИОНЕРОВ','04 / 07 · МИША'];
    let t=0;const nx=(b,o)=>{o.a=t;o.b=b;t=b;return sh(o);};
    nx(wa(1)-.05,{w:'moscow',o:(T,lt)=>({cz:600+lt*2400,blur:.03}),cam:[[0,540,900,1.04],[1,540,880,1.12]],hud:H1x,ch:CH[0]});
    nx(wa(4)-.05,{w:'city',tin:'flash',cam:[[0,540,900,1.0],[1,540,860,1.12]],hud:H1x,ch:CH[0],ov:(c,T)=>slamNum(c,T,wa(2)-.06,'29',{s:430,y:700,d:26,tag:'ЛЕТ'})});
    nx(wa(9)-.08,{w:'office',tin:'whip',cam:[[0,600,900,1.02],[1,640,860,1.16]],hud:['МЕГАПОЛИС · 42 ЭТАЖ','2012'],ch:CH[0]});
    nx(wa(13),{w:'bank',o:{smile:1},tin:'whip',hi:2,cam:[[0,540,960,1.02],[1,540,1000,1.12]],hud:['МЕГАПОЛИС · КРЕДИТНЫЙ ОТДЕЛ','2012'],ch:CH[0]});
    nx(wa(15)-.05,{w:'bank',o:{smile:1},hi:2,cam:[[0,540,640,1.75],[1,540,600,1.95]],hud:['МЕГАПОЛИС · КРЕДИТНЫЙ ОТДЕЛ','2012'],ch:CH[0]});
    nx(wa(22)-.08,{w:'numbg',tin:'whip',cam:[[0,540,960,1.0],[1,540,940,1.08]],hud:['ДОХОД','€ / ГОД'],ch:CH[0],ov:(c,T)=>zerosNum(c,T,{t0:wa(16),t1:wb(19)-.05,te:wa(21),tag:'В ГОД'})});
    nx(wa(26)-.06,{w:'meeting',o:{smile:1,talk:0},tin:'flash',hi:2,cam:[[0,540,860,1.08],[1,540,800,1.2]],hud:['МЕГАПОЛИС · ПЕРЕГОВОРНАЯ','10:00'],ch:CH[1]});
    nx(wa(28)-.05,{w:'club',tin:'whip',cam:[[0,540,1000,1.05],[1,540,980,1.15]],hud:['КЛУБ · ТАНЦПОЛ','23:40'],ch:CH[1]});
    nx(wa(29)-.02,{w:'champ',o:{pop:wa(28)+.05},tin:'flash',cam:[[0,560,980,1.0],[1,560,940,1.08]],hud:['КЛУБ · БАР','00:30'],ch:CH[1]});
    nx(wa(33)-.06,{w:'girls',tin:'whip',hi:2,cam:[[0,540,1000,1.02],[1,540,1030,1.12]],hud:['КЛУБ · VIP','01:50'],ch:CH[1]});
    nx(wa(37)-.05,{w:'meeting',o:{talk:1},tin:'flash',hi:2,cam:[[0,540,800,1.7],[1,540,780,1.95]],hud:['МЕГАПОЛИС · КАБИНЕТ ШЕФА','09:00'],ch:CH[2]});
    nx(wa(41)-.05,{w:'meeting',o:{talk:1},hi:2,cam:[[0,540,770,2.3],[1,540,755,2.6]],hud:['МЕГАПОЛИС · КАБИНЕТ ШЕФА','09:02'],ch:CH[2]});
    nx(wa(44)-.05,{w:'model',tin:'whipv',hi:2,cam:[[0,540,1180,1.0],[1,540,1240,1.16]],hud:['ПРОЕКТ','«РАЙ МИЛЛИОНЕРОВ»'],ch:CH[2]});
    nx(wa(46)-.05,{w:'desk',o:(T)=>({sig:inv(wa(45),wa(45)+.75,T)}),hi:2,cam:[[0,540,1120,1.05],[1,540,1250,1.2]],hud:['МЕГАПОЛИС · КРЕДИТ','09:40'],ch:CH[2]});
    nx(wa(55)-.08,{w:'vip',o:{talk:1},tin:'whip',hi:2,cam:[[0,560,1080,1.02],[.5,480,1050,1.12],[1,470,1030,1.2]],hud:['КЛУБ · VIP','02:14'],ch:CH[3]});
    nx(wa(62)-.06,{w:'numbg',o:{tone:'red'},tin:'whip',cam:[[0,540,960,1.0],[1,540,940,1.08]],hud:['КЛУБ МИШИ','02:20'],ch:CH[3],
      ov:(c,T)=>{slamNum(c,T,wa(55)-.04,'600 000 $',{s:200,y:740,tag:'ПАРТНЁР СНЯЛ ДЕНЬГИ',tagc:'rgba(255,47,142,.8)'});strike(c,T,wa(59),740);}});
    nx(wa(67)-.06,{w:'entry',o:{door:0,rope:0},tin:'cut',cam:[[0,540,900,1.05],[1,540,860,1.14]],hud:['КЛУБ МИШИ · ВХОД','ЗАКРЫТО'],ch:CH[3],ov:(c,T)=>slamNum(c,T,wa(63),'30',{s:380,y:1060,d:24,tag:'ДНЕЙ ДО ОТКРЫТИЯ',ty:220})});
    ENDT=wb(72)+.35;DUR=ENDT+1.7;
    nx(DUR,{w:'vip',o:{maxBrow:'frown'},tin:'whip',hi:2,cam:[[0,760,1060,2.3],[1,760,1045,2.9]],hud:['КЛУБ · VIP','02:31'],ch:CH[3]});
  }
  if(KEY==='pov'){
    let t=0;const nx=(b,o)=>{o.a=t;o.b=b;t=b;o.hh=1;return sh(o);};
    const MR=['МЕГАПОЛИС · ПЕРЕГОВОРНАЯ','10:00'];
    nx(wa(3)-.04,{w:'meeting',o:{fg:false},hi:2,cam:[[0,540,880,1.2],[1,540,860,1.14]],hud:MR,ov:(c,T,lt)=>blink(c,lt)});
    nx(wa(11)-.06,{w:'meeting',hi:2,cam:[[0,300,920,1.65],[.55,790,920,1.65],[1,560,840,1.45]],hud:MR});
    nx(wa(21)-.06,{w:'meeting',o:(T,lt)=>({talk:T<wa(16),vk:inv(wa(16),wb(18),T)}),hi:2,tin:'cut',cam:[[0,540,780,2.0],[.42,540,760,2.35],[.62,540,1080,1.55],[1,540,1320,1.6]],hud:MR});
    nx(wa(23)-.06,{w:'desk',o:(T)=>({sig:inv(wa(22),wb(22)+.1,T)}),hi:2,tin:'cut',cam:[[0,540,980,1.12],[.5,540,1150,1.2],[.75,540,1010,1.16],[1,540,1030,1.17]],hud:MR});
    nx(wa(30)-.06,{w:'steel',tin:'whip',hi:1,cam:[[0,380,700,1.22],[1,660,640,1.32]],hud:['МЕГАПОЛИС · 42 ЭТАЖ','10:07'],
      ov:(c,T)=>{chip(c,T,wa(23)-.05,'29 ЛЕТ',330,900);chip(c,T,wa(26)-.05,'ЛУЧШИЙ В КРЕДИТНОМ ОТДЕЛЕ',540,1060);}});
    nx(wa(35)-.05,{w:'numbg',tin:'cut',cam:[[0,540,960,1.0],[1,540,940,1.08]],hud:['ДОХОД','€ / ГОД'],ov:(c,T)=>zerosNum(c,T,{t0:wa(31),t1:wb(32),te:wa(34),tag:'В ГОД'})});
    nx(wa(37)-.05,{w:'entry',o:(T)=>({pov:1,rope:eo(inv(wa(36),wa(36)+.4,T)),door:eo(inv(wa(36)+.1,wa(36)+.6,T))}),tin:'flash',cam:[[0,540,1000,1.0],[1,540,940,1.16]],hud:['КЛУБ · ВХОД','23:40']});
    nx(wa(40)-.06,{w:'crowd',o:(T,lt,u)=>({k:eio(u),blur:.03}),tin:'push',cam:[[0,540,960,1.05],[1,540,940,1.1]],hud:['КЛУБ · ТАНЦПОЛ','23:52']});
    nx(wa(48)-.06,{w:'misha',o:{talk:1},hi:2,tin:'flash',cam:[[0,540,1000,1.22],[1,540,950,1.42]],hud:['КЛУБ · VIP','02:14']});
    nx(wa(55)-.06,{w:'numbg',o:{tone:'red'},tin:'cut',cam:[[0,540,960,1.0],[1,540,940,1.08]],hud:['КЛУБ МИШИ','ДЫРА'],
      ov:(c,T)=>{const k=inv(wa(50),wb(52),T),v=Math.round(600*(1-eio(k)))*1000,s=(v?fmt(v):'0')+' $';
        if(T<wa(53))slamNum(c,T,wa(49)-.05,s,{key:'cd'+s,s:200,y:760,tag:'ПАРТНЁР СНЯЛ ВСЁ',tagc:'rgba(255,47,142,.8)'});
        else{slamNum(c,T,wa(53),'600 000 $',{s:200,y:760,face:['#ffd0d6','#ff5a6e','#c0182e'],side:['#4a0610','#200208']});}}});
    const QA=wb(66)+.5;QT.a=QA;ENDT=QA+1.6;DUR=ENDT+1.5;
    nx(wa(62)-.06,{w:'toilet',o:{flick:1,bass:1},hi:2,tin:'flash',shake:1,cam:[[0,540,1460,2.0],[1,560,1420,2.15]],hud:['КЛУБ · ТУАЛЕТ','03:12']});
    nx(DUR,{w:'toilet',o:(T)=>({flick:T<QA,bass:T<QA,mouth:T>QA+.05&&T<QA+1.3?flap(T,1.3):'flat'}),hi:2,cam:[[0,560,1420,2.15],[.32,540,900,1.5],[1,540,800,1.62]],hud:['КЛУБ · ТУАЛЕТ','03:12']});
  }
  if(KEY==='nonstop'){
    let t=0;const nx=(b,o)=>{o.a=t;o.b=b;t=b;o.run=1;return sh(o);};
    const CZ=lt=>1200+1500*lt+260*lt*lt;
    nx(wa(7)-.25,{w:'moscow',o:(T,lt)=>({cz:CZ(lt),blur:.035+.02*lt}),cam:[[0,540,900,1.04],[1,560,860,1.1]],roll:1,hud:['МОСКВА · НАБЕРЕЖНАЯ'],dive:(lt)=>flTarget(CZ(lt))});
    nx(wa(14)-.1,{w:'bank',o:{smile:1},hi:2,tin:'dive',cam:[[0,540,980,1.28],[1,540,960,1.06]],hud:['МЕГАПОЛИС · КАБИНЕТ']});
    nx(wa(22)-.1,{w:'desk',o:(T)=>({sig:inv(wa(19),wb(21),T),sum:'€ ?00 000'}),hi:2,tin:'whipv',cam:[[0,540,980,1.05],[1,540,1120,1.22]],hud:['МЕГАПОЛИС · КАБИНЕТ']});
    nx(wa(30)-.1,{w:'model',o:(T)=>({lit:inv(wa(27),wb(29),T)}),hi:2,tin:'whip',cam:[[0,540,1150,1.0],[.7,540,1220,1.25],[1,540,1235,1.4]],hud:['ПРОЕКТ · «РАЙ МИЛЛИОНЕРОВ»'],dive:()=>[540-110*2.6,1240+30*2.6-12]});
    nx(wa(32)-.1,{w:'street',o:(T,lt)=>({cz:400+lt*2600,blur:.04}),tin:'dive',cam:[[0,540,960,1.05],[1,600,960,1.1]],roll:1,hud:['ТВЕРСКАЯ']});
    nx(wa(33)-.05,{w:'entry',o:(T,lt,u)=>({rope:eo(u*1.6),door:eo(u*1.3)}),tin:'whip',cam:[[0,540,1000,1.0],[1,540,900,1.3]],hud:['КЛУБ · ВХОД'],dive:()=>[540,900]});
    nx(wa(37)-.1,{w:'crowd',o:(T,lt,u)=>({k:eio(u),blur:.04}),tin:'push',cam:[[0,540,960,1.05],[1,540,930,1.12]],hud:['КЛУБ · ТАНЦПОЛ']});
    nx(wa(47)-.1,{w:'vip',o:{talk:1},hi:2,tin:'push',cam:[[0,540,1120,1.3],[.4,520,1060,1.08],[1,500,1040,1.04]],hud:['КЛУБ · VIP'],
      ov:(c,T)=>{if(T>wa(43)-.05)slamNum(c,T,wa(45)-.04,'600 000 $',{s:190,y:600,tag:'ДЫРА В БЮДЖЕТЕ КЛУБА',tagc:'rgba(255,47,142,.8)'});}});
    ENDT=wb(57)+.4;DUR=ENDT+1.5;
    nx(DUR,{w:'pen',hi:2,tin:'whipv',cam:[[0,540,1180,1.0],[1,640,1420,1.6]],hud:['КЛУБ · VIP']});
  }
  return S;}
const QT={a:0};

/* ================= камера и переходы ================= */
function keyCam(K,u){if(u<=K[0][0])return K[0];for(let i=0;i<K.length-1;i++)if(u<K[i+1][0]){const k=eio((u-K[i][0])/(K[i+1][0]-K[i][0])),A=K[i],B=K[i+1];return [u,lp(A[1],B[1],k),lp(A[2],B[2],k),lp(A[3],B[3],k),lp(A[4]||0,B[4]||0,k)];}return K[K.length-1];}
const TD={whip:.17,whipv:.17,dive:.34,push:.3};
function camAt(si,t){const S=SHOTS[si],u=(t-S.a)/(S.b-S.a),K=keyCam(S.cam||[[0,540,960,1.02],[1,540,960,1.1]],u);let x=K[1],y=K[2],z=K[3],r=K[4]||0;
  if(S.hh){x+=sn(t*.6,1)*7;y+=sn(t*.5,2)*6;r+=sn(t*.4,3)*.004;}
  if(S.roll)r+=Math.sin(t*.9)*.018;
  if(S.shake){const b=Math.pow(Math.max(0,Math.cos(t*TAU*105.5/60)),10);y+=b*7*Math.sin(t*90);x+=b*5*Math.cos(t*77);}
  const N=SHOTS[si+1];
  if(N&&N.tin&&TD[N.tin]){const D=TD[N.tin],k=(t-(S.b-D))/D;if(k>0){
    if(N.tin==='whip')x+=E.inQ(k)*WW*.22;
    else if(N.tin==='whipv')y+=E.inQ(k)*HH*.15;
    else if(N.tin==='dive'||N.tin==='push'){const P=S.dive?S.dive(S.b-S.a):[540,960],e=N.tin==='dive'?6:1.6;x=lp(x,P[0],eio(k));y=lp(y,P[1],eio(k));z*=1+e*E.inC(k);}}}
  if(S.tin&&TD[S.tin]){const D=TD[S.tin],k=(t-S.a)/D;if(k<1){
    if(S.tin==='whip')x-=(1-E.outQ(k))*WW*.22;
    else if(S.tin==='whipv')y-=(1-E.outQ(k))*HH*.15;
    else if(S.tin==='dive')z*=1+.7*(1-E.outC(k));
    else if(S.tin==='push')z*=1+.3*(1-E.outC(k));}}
  return [x,y,Math.max(z,1),r];}
function smearAt(si,t){const S=SHOTS[si],N=SHOTS[si+1];let a=0,ax=0;
  if(N&&(N.tin==='whip'||N.tin==='whipv')){const k=(t-(N.a-TD[N.tin]))/TD[N.tin];if(k>0){a=E.inQ(k);ax=N.tin==='whipv'?1:0;}}
  if(S.tin==='whip'||S.tin==='whipv'){const k=(t-S.a)/TD[S.tin];if(k<1){a=Math.max(a,1-E.outQ(k));ax=S.tin==='whipv'?1:0;}}
  return [a,ax];}
function shotAt(t){for(let i=0;i<SHOTS.length;i++)if(t<SHOTS[i].b)return i;return SHOTS.length-1;}

/* ================= HUD и подписи ================= */
const hm=m=>{m=((Math.round(m)%1440)+1440)%1440;return `${String(m/60|0).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;};
function hud(c,t,S){
  if(KEY==='dina'){hudTop(c,S.hud[0],S.hud[1]);hudBot(c,S.ch,cl(t/DUR)*.57,`00:00:${String(Math.floor(t)).padStart(2,'0')}`);}
  else if(KEY==='pov'){hudTop(c,S.hud[0],S.hud[1],{rs:30});}
  else if(KEY==='g1'){hudReal(c,S.hud[0],'ПУСТОТА: 82%',{k:.82,rc:'#bfe3ff'});}
  else if(KEY==='g2'){hudTop(c,'ГЛАВА 01 · МОСКВА, 2012','');c.save();c.shadowColor='rgba(0,0,0,.8)';c.shadowBlur=10;const bal=t<wa(30)?'БАЛАНС: €0':'БАЛАНС: €100 000+';tx(c,bal,WW-66,160,{f:'J',w:700,s:26,ls:2,al:'right',c:'#f5a623'});c.restore();
    hudBot(c,'01 / 07 · ПЕРЕМОТКА',cl(t/DUR)*.14,`00:00:${String(Math.floor(t)).padStart(2,'0')}`,{col:'#f5a623'});}
  else if(KEY==='g3'){const k=t<wa(57)?.94:t<wb(63)?lp(.94,.61,eio(inv(wa(57),wb(63),t))):t<wa(65)?.61:lp(.61,.28,eio(inv(wa(65),wb(68),t)));hudCorp(c,k);}
  else if(KEY==='g4'){hudPulse(c,S.hud[0]||'04:15');}
  else{const m=21*60+40+4*t+.34*t*t;hudTop(c,S.hud[0],hm(m),{rs:44,rc:'#ffffff'});
    c.save();c.globalAlpha=.75;tx(c,'▶  НЕ ОСТАНАВЛИВАЕТСЯ',70,1792,{f:'J',w:500,s:18,ls:3,al:'left',c:'rgba(255,255,255,.8)'});c.restore();}
}
const SUBSTY={dina:'dyn',pov:'dyn',nonstop:'dyn',g2:'dyn',g1:'thin',g3:'serif',g4:'mono'};
function subs(c,t){const st=SUBSTY[KEY];for(const S of SUBS){if(t<S.a||t>=S.b||t>ENDT)continue;const lt=t-S.a,sc=1+.08*Math.exp(-lt*22),a=cl(lt/.05);
  c.save();c.globalAlpha=a;c.translate(540,1600);c.scale(sc,sc);c.translate(-540,-1600);
  if(st==='dyn')subLine(c,S.ws.map(w=>[w.t,w.acc]),{x:540,y:1600,s:100,max:960,acc:KEY==='g2'?'#f5a623':undefined});
  else{const F={thin:{f:'M',w:600,s:70,col:'#f2f2f2',acc:'#bfe3ff'},serif:{f:'P',w:700,s:76,col:'#f1e6d2',acc:'#e3b35a'},mono:{f:'J',w:700,s:62,col:'#ececec',acc:'#ff1e32'}}[st];
    font(c,F);const sp=c.measureText(' ').width,ms=S.ws.map(w=>c.measureText(w.t).width),tot=ms.reduce((x,y)=>x+y,0)+sp*(ms.length-1),k=Math.min(1,960/tot);
    c.translate(540,1600);c.scale(k,k);let x=-tot/2;c.textAlign='left';c.textBaseline='middle';c.shadowColor='rgba(0,0,0,.9)';c.shadowBlur=20;c.shadowOffsetY=3;
    for(let i=0;i<S.ws.length;i++){c.fillStyle=S.ws[i].acc?F.acc:F.col;c.fillText(S.ws[i].t,x,0);x+=ms[i]+sp;}}
  c.restore();}
  if(KEY==='g1'&&t>QT.a-.05&&t<QT.a+1.75){const a=cl((t-QT.a)/.12);c.save();c.globalAlpha=a;font(c,{f:'P',w:700,it:1,s:66});c.textAlign='center';c.textBaseline='middle';c.shadowColor='rgba(0,0,0,.9)';c.shadowBlur=24;c.fillStyle='#fff';
    c.fillText('«Я не виноват, что я не инвалид',540,1560);c.fillText('и не урод…»',540,1645);tx(c,'МАКС',540,1475,{f:'J',w:500,s:22,ls:6,c:'#bfe3ff'});c.restore();}
  if(KEY==='pov'&&t>QT.a-.05&&t<QT.a+1.6){const lt=t-QT.a,a=cl(lt/.12);c.save();c.globalAlpha=a;font(c,{f:'P',w:700,it:1,s:84});c.textAlign='center';c.textBaseline='middle';c.shadowColor='rgba(0,0,0,.9)';c.shadowBlur=24;c.fillStyle='#fff';c.fillText('«Я всего добился сам»',540,1590);
    tx(c,'МАКС',540,1500,{f:'J',w:500,s:22,ls:6,c:'#ffb13b'});c.restore();}}
function endCard(c,t){if(t<ENDT)return;const k=eo((t-ENDT)/.5);c.save();c.fillStyle=`rgba(0,0,0,${.55*k})`;c.fillRect(0,0,WW,HH);c.globalAlpha=k;
  tx(c,'ПРОДОЛЖЕНИЕ',540,880,{f:'J',w:500,s:30,ls:10,c:'rgba(255,255,255,.75)'});
  c.translate(540,1010);const s=1+.1*Math.exp(-(t-ENDT)*8);c.scale(s,s);const tw2=tm(c,'ЧАСТЬ 2',{f:'O',w:700,s:150});tx(c,'ЧАСТЬ 2',-60,0,{f:'O',w:700,s:150,c:'#ffb13b',glow:'#ff9a3c',gb:30});
  const ax=-60+tw2/2+110+Math.sin((t-ENDT)*6)*10;c.strokeStyle='#ffb13b';c.lineWidth=16;c.lineCap='round';c.lineJoin='round';c.shadowColor='#ff9a3c';c.shadowBlur=24;c.beginPath();c.moveTo(ax-70,-50);c.lineTo(ax,-50);c.moveTo(ax-30,-90);c.lineTo(ax+5,-50);c.lineTo(ax-30,-10);c.stroke();c.restore();}

/* ================= кадр ================= */
CLIP.init=async()=>{VO=await (await fetch('/a/'+KEY+'.words.json?'+Date.now())).json();VOFF={g1:1.95}[KEY]||0;for(const w of VO.words){w.a+=VOFF;w.b+=VOFF;}SHOTS=plan();SUBS=buildSubs();window.PLAN={dur:DUR,endt:ENDT,qa:QT.a,voff:VOFF,shots:SHOTS.map(s=>({a:+s.a.toFixed(3),b:+s.b.toFixed(3),w:s.w,tin:s.tin||''}))};};
const GRADE={dina:['#ff9a3c','#1b3b6b',.2],pov:['#ffd2a0','#2a4a70',.16],nonstop:['#ff8a5c','#1b2b6b',.22],g1:['#cfe6ff','#203040',.22],g2:['#f5a623','#0b1a3a',.2],g3:['#c9963b','#1a2a3a',.26],g4:['#ffffff','#000000',0]};
const POST={g3:'noir',g4:'mono'};
CLIP.draw=(c,t,i)=>{const si=shotAt(t),S=SHOTS[si],lt=t-S.a,u=lt/(S.b-S.a);
  const o=typeof S.o==='function'?S.o(t,lt,u):(S.o||{}),hi=S.hi||1,WL=WLC[hi-1],g=WL.getContext('2d');
  reset(g);g.clearRect(0,0,WL.width,WL.height);if(hi>1)g.scale(hi,hi);W8[S.w](g,t,o,lt);reset(g);
  const C0=camAt(si,t),C1=camAt(si,t-1/30),d=Math.abs(C0[0]-C1[0])*C0[2]+Math.abs(C0[1]-C1[1])*C0[2]+Math.abs(C0[2]-C1[2])*900+Math.abs(C0[3]-C1[3])*900;
  const n=Math.max(1,Math.min(14,Math.ceil(d/7)));
  c.fillStyle='#000';c.fillRect(0,0,WW,HH);
  const [sa,sx]=smearAt(si,t);
  if(sa>.02){const A=sa*(sx?HH*.5:WW*.6),m=14;for(let j=0;j<m;j++){const off=-A/2+A*j/(m-1),[x,y,z,r]=C0,zz=z*(1+sa*.3);
    c.save();c.globalAlpha=1/(j+1);c.translate(540,960);if(r)c.rotate(r);c.scale(zz/hi,zz/hi);c.translate(-(x+(sx?0:off))*hi,-(y+(sx?off:0))*hi);c.drawImage(WL,0,0);c.restore();}}
  else for(let j=0;j<n;j++){const tt=t-j*(.55/30)/Math.max(1,n-1),[x,y,z,r]=n>1?camAt(si,tt):C0;
    c.save();c.globalAlpha=1/(j+1);c.translate(540,960);if(r)c.rotate(r);c.scale(z/hi,z/hi);c.translate(-x*hi,-y*hi);c.drawImage(WL,0,0);c.restore();}
  if(S.post||POST[KEY])post(c,S.post||POST[KEY],t,i);
  if(S.ov){if(sa>.02){const og=OVC.getContext('2d');reset(og);og.clearRect(0,0,WW,HH);S.ov(og,t,lt,u);reset(og);const A=sa*(sx?HH*.5:WW*.6),m=10;
    for(let j=0;j<m;j++){const off=-A/2+A*j/(m-1);c.save();c.globalAlpha=(1-sa*.7)/(j+1)*(j?1:1);c.drawImage(OVC,sx?0:off,sx?off:0);c.restore();}}else S.ov(c,t,lt,u);}
  const G=GRADE[KEY];grade(c,G[0],G[1],G[2]);vignette(c,.62);grain(c,KEY==='g4'?Math.floor(i/2):(i||0),KEY==='g4'?.16:KEY==='g1'||KEY==='g3'?.08:.055);
  if(S.tin==='flash'&&lt<.14){c.save();c.globalCompositeOperation='screen';c.fillStyle=`rgba(255,255,255,${.6*(1-lt/.14)})`;c.fillRect(0,0,WW,HH);c.restore();}
  if(S.burn&&lt<.12){const k=1-lt/.12;c.save();c.globalCompositeOperation='screen';c.fillStyle=RG(c,S.burn>0?WW:0,960,0,1300,[[0,`rgba(255,40,40,${.95*k})`],[.5,`rgba(255,20,30,${.45*k})`],[1,'rgba(255,0,0,0)']]);c.fillRect(0,0,WW,HH);c.restore();}
  if(KEY==='g4'){filmDirt(c,(i*7)%97);}
  if(S.tin==='dive'&&lt<.1){c.save();c.globalCompositeOperation='screen';c.fillStyle=`rgba(255,240,220,${.6*(1-lt/.1)})`;c.fillRect(0,0,WW,HH);c.restore();}
  c.fillStyle=LG(c,0,0,0,240,[[0,'rgba(0,0,0,.5)'],[1,'rgba(0,0,0,0)']]);c.fillRect(0,0,WW,240);
  corners(c,.3);hud(c,t,S);subs(c,t);endCard(c,t);
};
