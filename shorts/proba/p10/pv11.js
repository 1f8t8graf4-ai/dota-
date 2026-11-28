"use strict";
/* «Духless» v7 (27.11 ночь): места заново — как архив v15. Андрей: «посмотри на этот архив — он в 100 раз лучше всего ролика»,
   «прикол Дины в том, что ты веришь происходящему: клуб похож на клуб, туалет на туалет, Тверская на Тверскую».
   Рецепт места: настоящая перспектива (всё уходит в одну точку), повтор деталей, свет по глубине (лампы дают пятна),
   дымка, отражения на полу, один-два цвета света. Предметы — объём, материал, тень, глубина резкости.
   Кадры: node render.mjs pv11 <место> <папка> shots 0   (места: P11.*) */
const P11={};
const PV11_SOLO=Q.get('clip')==='pv11';   // pv11 — отдельные кадры; в ролике (pov11) — библиотека мест
if(PV11_SOLO)CLIP.draw=(c,t)=>{const k=Q.get('style'),f=P11[k]||SC[k];if(f)f(c,t);};

/* ================= 3D: проекция, полоски по глубине, свет ================= */
const C3=(E,T,f=1300,roll=0)=>cam3(lookAt(E,T,f,roll));
function pj(cam,pts){const r=[];for(const p of pts){const q=cam.P(p[0],p[1],p[2]);if(q[2]<=3)return null;r.push(q);}return r;}
function fq(c,cam,pts,fill){const q=pj(cam,pts);if(!q)return null;PP(c,q);c.fillStyle=fill;c.fill();return q;}
function ln3(c,cam,a,b,col,w){const p=cam.P(a[0],a[1],a[2]),q=cam.P(b[0],b[1],b[2]);if(p[2]<=3||q[2]<=3)return;c.strokeStyle=col;c.lineWidth=w*Math.min(p[3],q[3]);c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(q[0],q[1]);c.stroke();}
const h3=h=>{const n=parseInt(h.slice(1),16);return [n>>16,n>>8&255,n&255];};
const m3=(a,b,k)=>[lp(a[0],b[0],k),lp(a[1],b[1],k),lp(a[2],b[2],k)];
const k3=(a,k)=>[a[0]*k,a[1]*k,a[2]*k];
const s3=(a,al=1)=>`rgba(${cl(a[0],0,255)|0},${cl(a[1],0,255)|0},${cl(a[2],0,255)|0},${al})`;
const fogK=(d,D)=>1-Math.exp(-Math.max(0,d)/D);
// сумма ламп вдоль z: каждая лампа — мягкое пятно ширины r
const lampSum=(z,L,r)=>{let s=0;for(const zl of L){const d=(z-zl)/r;s+=1/(1+d*d);}return s;};
// цвет поверхности: тёмный → освещённый (k), потом дымка по глубине
function surf(dark,lit,k,z,camz,fogC,D){return m3(m3(dark,lit,cl(k)),fogC,fogK(z-camz,D));}
// коридор вдоль z: пол y=0, потолок y=-h, стены x=xl и x=xr. Полоски от дальних к ближним.
function corridor(c,cam,o){const dz=(o.z1-o.z0)/o.n;
  for(let i=o.n-1;i>=0;i--){const z=o.z0+i*dz,z2=z+dz*1.04;
    if(o.ceil)fq(c,cam,[[o.xl,-o.h,z],[o.xr,-o.h,z],[o.xr,-o.h,z2],[o.xl,-o.h,z2]],o.ceil(z));
    if(o.floor)fq(c,cam,[[o.xl,0,z],[o.xr,0,z],[o.xr,0,z2],[o.xl,0,z2]],o.floor(z));
    if(o.wallL)fq(c,cam,[[o.xl,0,z],[o.xl,-o.h,z],[o.xl,-o.h,z2],[o.xl,0,z2]],o.wallL(z));
    if(o.wallR)fq(c,cam,[[o.xr,0,z],[o.xr,-o.h,z],[o.xr,-o.h,z2],[o.xr,0,z2]],o.wallR(z));}
  if(o.end)fq(c,cam,[[o.xl,0,o.z1],[o.xr,0,o.z1],[o.xr,-o.h,o.z1],[o.xl,-o.h,o.z1]],o.end);}
// мягкое свечение точки мира
function glow3(c,cam,p,r,col,a){const q=cam.P(p[0],p[1],p[2]);if(q[2]<=3)return null;glowDot(c,q[0],q[1],r*q[3],col,a);return q;}
// отражение на мокром/глянцевом полу (y=0): точка (x,y,z) → (x,-y,z), вытянутое по вертикали пятно
function refl3(c,cam,p,r,col,a,st=3){const q=cam.P(p[0],-p[1],p[2]);if(q[2]<=3)return;const rr=r*q[3];
  c.save();c.globalCompositeOperation='screen';c.globalAlpha*=a;c.translate(q[0],q[1]);c.scale(1,st);
  c.fillStyle=RG(c,0,0,0,rr,[[0,rgba(col,.9)],[.3,rgba(col,.3)],[1,rgba(col,0)]]);c.fillRect(-rr,-rr,2*rr,2*rr);c.restore();}
// плитка: линии стыков на плоскости (сетка шага s), гаснут в дымке
function grid3(c,cam,o){c.save();c.lineCap='butt';
  for(let z=o.z0;z<=o.z1;z+=o.s){const d=z-o.camz,a=o.a*(1-fogK(d,o.D));if(a<.01)continue;
    if(o.plane==='floor')ln3(c,cam,[o.x0,0,z],[o.x1,0,z],rgba(o.col,a),o.w);
    else ln3(c,cam,[o.x,o.y0,z],[o.x,o.y1,z],rgba(o.col,a),o.w);}
  if(o.plane==='floor')for(let x=o.x0;x<=o.x1;x+=o.s)ln3(c,cam,[x,0,o.z0],[x,0,o.z1],rgba(o.col,o.a*.8),o.w);
  else for(let y=o.y0;y>=o.y1;y-=o.sy||o.s)ln3(c,cam,[o.x,y,o.z0],[o.x,y,o.z1],rgba(o.col,o.a*.8),o.w);
  c.restore();}
// коробка (комод, кабинка, стойка): x0..x1, y0(низ)..y1(верх, отриц.), z0..z1; видимые грани по камере
function box3(c,cam,b,cols){const [x0,x1,y0,y1,z0,z1]=b,E=cam.o;
  const F={front:[[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0]],top:[[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]],
    left:[[x0,y0,z0],[x0,y1,z0],[x0,y1,z1],[x0,y0,z1]],right:[[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[x1,y0,z1]],back:[[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]]};
  const vis={front:E.z<z0,back:E.z>z1,top:E.y<y1,left:E.x<x0,right:E.x>x1};
  for(const k of ['back','top','left','right','front'])if(vis[k]&&cols[k])fq(c,cam,F[k],cols[k]);}
// полупрозрачные «облака» дымки на заданной глубине
function haze3(c,cam,z,y,a,col='#ffffff',n=10,seed=1,t=0){const q=cam.P(0,y,z);if(q[2]<=3)return;const S=smokeSprites();
  c.save();c.globalCompositeOperation='screen';for(let i=0;i<n;i++){const r=(500+700*H1(seed+i*3.1))*q[3]*2.2,x=q[0]+(H1(seed+i*7.7)-.5)*WW*1.6+Math.sin(t*.2+i)*30,yy=q[1]+(H1(seed+i*5.3)-.5)*r*.5;
    c.globalAlpha=a*(.5+.5*H1(seed+i*9.1));c.filter='none';c.drawImage(S[i%4],x-r,yy-r*.4,r*2,r*.8);}
  c.restore();}
// финиш кадра: зерно, виньетка, мягкий цветокор
function fin11(c,i,o={}){if(!PV11_SOLO)return;if(o.grade!==false)grade(c,o.warm||'#ff9a3c',o.cool||'#1b3b6b',o.ga??.16);vignette(c,o.vig??.6);grain(c,i||0,o.gr??.045);}
const PUN=mkc(WW,HH);
function punch(c,k=1.18,sa=1.08,br=1){const g=PUN.getContext('2d');reset(g);g.clearRect(0,0,WW,HH);g.filter=`contrast(${k}) saturate(${sa}) brightness(${br})`;g.drawImage(c.canvas,0,0);g.filter='none';c.save();reset(c);c.drawImage(PUN,0,0);c.restore();}
function lightBloom(c,a=.35){bloom(c,c.canvas,a,'brightness(0.7) contrast(2.4) blur(7px)');}

// силуэт человека в полный рост: ноги в (x,y), рост h px, контурный свет с одной стороны (sd)
function pers3(c,x,y,h,o={}){const k=h/1000,col=o.col||'#07060a',rim=o.rim,sd=o.sd||1,w=o.w||1,ph=o.ph||0;c.save();c.translate(x,y);c.scale(k*w,k);
  const P=new Path2D();P.ellipse(0,-905,58,72,0,0,TAU);
  const B=new Path2D();B.moveTo(-34,-835);B.lineTo(34,-835);B.lineTo(40,-800);B.bezierCurveTo(110,-790,150,-770,158,-700);B.lineTo(172,-420);B.lineTo(140,-405);B.lineTo(124,-640);
  B.lineTo(118,-460);B.lineTo(96,-420);B.lineTo(84+ph*20,-10);B.lineTo(30+ph*10,0);B.lineTo(8,-400);B.lineTo(-8,-400);B.lineTo(-30-ph*10,0);B.lineTo(-84-ph*20,-10);B.lineTo(-96,-420);B.lineTo(-118,-460);
  B.lineTo(-124,-640);B.lineTo(-140,-405);B.lineTo(-172,-420);B.lineTo(-158,-700);B.bezierCurveTo(-150,-770,-110,-790,-40,-800);B.closePath();
  c.fillStyle=col;c.fill(P);c.fill(B);
  if(o.up){c.strokeStyle=col;c.lineCap='round';c.lineWidth=62;for(const a of o.up){const sx=a<0?-1:1,q=Math.abs(a);c.beginPath();c.moveTo(sx*135,-720);c.quadraticCurveTo(sx*(200+40*q),-900,sx*(120+80*q),-1080-180*q);c.stroke();}}
  if(rim){for(const S of [B,P]){c.save();c.clip(S);c.globalAlpha=o.ra??.75;c.fillStyle=rim;c.fill(S);c.globalAlpha=1;c.translate(-sd*14,7);c.fillStyle=col;c.fill(S);c.restore();}}
  c.restore();}

/* ================= ТУАЛЕТ КЛУБА ================= */
// глаза Макса у входа: слева мраморная стойка, раковины, зеркала в латуни и лампы над ними; справа кабинки из чёрного лака;
// в конце — дверь в зал: из-под неё розовый свет и бас. Пол — мокрый чёрный кафель с отражениями.
P11.wc=(c,t,o={})=>{const u=o.u??0,E=o.E||[lp(-30,-20,u),-162,lp(0,140,u)],cam=C3(E,o.T||[30,-150,1000],o.f||1000,o.roll||0);
  const camz=E[2],FOG=h3('#0c090d'),D=2600,LAMPS=[250,420,590,760,930],fl=o.flick??1;
  const lamp=z=>lampSum(z,LAMPS,60);
  c.fillStyle='#050406';c.fillRect(0,0,WW,HH);
  corridor(c,cam,{z0:60,z1:1180,n:110,xl:-180,xr:300,h:300,
    ceil:z=>s3(surf(h3('#060507'),h3('#2a221e'),.04+.15*lamp(z),z,camz,FOG,D)),
    floor:z=>s3(surf(h3('#060507'),h3('#2b2326'),.05+.3*lamp(z),z,camz,FOG,D)),
    wallL:z=>s3(surf(h3('#0d0b0e'),h3('#5c4a3e'),.06+.62*lamp(z),z,camz,FOG,D)),
    wallR:z=>s3(surf(h3('#0b0a0d'),h3('#2c2630'),.05+.2*lamp(z),z,camz,FOG,D)),
    end:s3(m3(h3('#140e12'),FOG,.3))});
  grid3(c,cam,{plane:'floor',x0:-180,x1:300,z0:60,z1:1180,s:60,camz,D,col:'#000000',a:.7,w:2.4});
  grid3(c,cam,{plane:'wall',x:-180,y0:0,y1:-300,sy:120,z0:60,z1:1180,s:60,camz,D,col:'#000000',a:.55,w:2});
  // дверь в зал: щель снизу розовая, бас «дышит»
  const bass=.6+.4*Math.max(0,Math.sin(t*TAU*1.75))**6;
  fq(c,cam,[[20,0,1179],[160,0,1179],[160,-220,1179],[20,-220,1179]],'#0a0709');
  ln3(c,cam,[24,-215,1178],[156,-215,1178],rgba('#ff3d9e',.35*bass),3);
  fq(c,cam,[[20,0,1178],[160,0,1178],[160,-7,1178],[20,-7,1178]],rgba('#ff4aa6',.95*bass));
  glow3(c,cam,[90,-4,1170],300,'#ff2e8f',.55*bass);refl3(c,cam,[90,-4,1170],230,'#ff2e8f',.45*bass,4.5);
  glow3(c,cam,[90,-120,1175],600,'#ff2e8f',.1*bass);
  // кабинки справа: фасад x=150 (двери и стойки между ними), перегородки до стены x=300, верх на 210 — над ними тёмный просвет
  for(let i=6;i>=0;i--){const z0=200+i*140,z1=z0+140,fz=1-fogK(z0-camz,D),dc=m3(h3('#16131a'),FOG,1-fz),pc=m3(h3('#221e26'),FOG,1-fz);
    // перегородка (видим её торец и верх)
    box3(c,cam,[150,300,-16,-210,z0-4,z0+4],{left:s3(k3(pc,1.1)),top:s3(k3(pc,1.5)),front:s3(pc)});
    // стойка-пилястра
    fq(c,cam,[[150,0,z0-6],[150,0,z0+10],[150,-210,z0+10],[150,-210,z0-6]],s3(k3(pc,1.3)));
    if(i===3){// приоткрытая дверь: внутри темно, створка повёрнута внутрь
      fq(c,cam,[[150,-16,z0+10],[150,-16,z1-6],[150,-210,z1-6],[150,-210,z0+10]],'#030203');
      fq(c,cam,[[150,-16,z0+10],[210,-16,z0+100],[210,-210,z0+100],[150,-210,z0+10]],s3(k3(dc,1.4)));}
    else{const q=fq(c,cam,[[150,-16,z0+10],[150,-16,z1-6],[150,-210,z1-6],[150,-210,z0+10]],s3(dc));
      if(q){c.save();PP(c,q);c.clip();c.globalCompositeOperation='screen';const a=cam.P(150,-210,z0),b=cam.P(150,-16,z1);
        c.fillStyle=LG(c,a[0],a[1],b[0],b[1],[[0,'rgba(255,200,150,0)'],[.42,`rgba(255,210,170,${.16*fz})`],[.5,'rgba(255,200,150,0)']]);c.fillRect(0,0,WW,HH);c.restore();}
      glow3(c,cam,[148,-112,z1-24],7,'#e9edf3',.7*fz);glow3(c,cam,[148,-126,z1-24],7,i===5?'#ff2a2a':'#2dff86',.9*fz);}
    // свет из кабинки на полу под дверью
    const lq=pj(cam,[[150,0,z0+12],[150,0,z1-8],[128,0,z1-8],[128,0,z0+12]]);if(lq){c.save();c.globalCompositeOperation='screen';PP(c,lq);c.fillStyle=`rgba(255,170,110,${.12*fz})`;c.fill();c.restore();}}
  // слева: стойка из белого мрамора с прожилками, раковины, зеркала, лампы
  const marb=h3('#d9d2ca');
  box3(c,cam,[-180,-112,-80,-88,170,1010],{top:s3(k3(marb,.62)),right:s3(k3(marb,.3)),front:s3(k3(marb,.4))});
  for(let i=0;i<LAMPS.length;i++){const zc=LAMPS[i],fz=1-fogK(zc-camz,D),on=i===1?fl:1;
    const mq=fq(c,cam,[[-179,-112,zc-64],[-179,-112,zc+64],[-179,-252,zc+64],[-179,-252,zc-64]],s3(m3(h3('#17161c'),FOG,1-fz)));
    if(mq){c.save();PP(c,mq);c.clip();const a=cam.P(-179,-252,zc-64),b=cam.P(-179,-112,zc+64);
      // в зеркале — отражение кабинок напротив: тёмные двери и полоса света
      for(let j=0;j<3;j++){const zz=zc-50+j*42,p0=cam.P(-179,-230,zz),p1=cam.P(-179,-120,zz+30);c.fillStyle=rgba('#2b2532',.8*fz);c.fillRect(p0[0],p0[1],p1[0]-p0[0],p1[1]-p0[1]);}
      c.globalCompositeOperation='screen';c.fillStyle=LG(c,a[0],a[1],b[0],b[1],[[0,'rgba(255,255,255,0)'],[.4,`rgba(255,240,225,${.2*fz})`],[.5,`rgba(255,240,225,${.04*fz})`],[1,'rgba(255,255,255,0)']]);c.fillRect(0,0,WW,HH);c.restore();
      c.strokeStyle=rgba('#d8b06a',.75*fz);c.lineWidth=3.2*cam.P(-179,-180,zc)[3];PP(c,mq);c.stroke();}
    fq(c,cam,[[-176,-264,zc-50],[-176,-264,zc+50],[-176,-273,zc+50],[-176,-273,zc-50]],rgba('#fff3dc',on));
    glow3(c,cam,[-170,-268,zc],200,'#ffbf70',.55*on*fz);glow3(c,cam,[-170,-268,zc],55,'#fff3dc',.9*on*fz);
    glow3(c,cam,[-140,-92,zc],170,'#ffb15a',.25*on*fz);
    refl3(c,cam,[-170,-268,zc],120,'#ffc77a',.3*on*fz,3.6);refl3(c,cam,[-140,-92,zc],80,'#ffb15a',.15*on*fz,3);
    const s=pj(cam,[[-164,-88.5,zc-30],[-124,-88.5,zc-30],[-124,-88.5,zc+30],[-164,-88.5,zc+30]]);if(s){PP(c,s);c.fillStyle=s3(m3(h3('#7e776f'),FOG,1-fz));c.fill();}
    // кран: хром — тёмное тело, светлый блик
    c.lineCap='round';ln3(c,cam,[-172,-88,zc],[-172,-132,zc],rgba('#3a3d44',fz),9);ln3(c,cam,[-172,-132,zc],[-148,-128,zc],rgba('#3a3d44',fz),8);
    ln3(c,cam,[-171,-90,zc+1],[-171,-130,zc+1],rgba('#f2f4f8',.85*fz),3);ln3(c,cam,[-171,-131,zc+1],[-149,-127,zc+1],rgba('#f2f4f8',.85*fz),3);}
  // потолочные светильники: маленькие яркие точки, узкие конусы
  for(const zl of [330,600,870]){const q=glow3(c,cam,[60,-299,zl],26,'#fff4e0',.9);if(q){const f=cam.P(60,0,zl);beam(c,q[0],q[1],0,.32,Math.max(10,f[1]-q[1]),'#ffe9c8',.35);}refl3(c,cam,[60,-299,zl],40,'#fff0d8',.35,3.5);}
  haze3(c,cam,900,-140,.035,'#ffd9e8',8,4,t);
  punch(c,1.2,1.1);fin11(c,0,{warm:'#ff8a5c',cool:'#2a1b3b',ga:.14,vig:.7});lightBloom(c,.3);
};

/* ================= ДЕТСКАЯ БОЛЬНИЦА: коридор ================= */
// длинный коридор: лампы дневного света панелями по потолку (пятна света по глубине), стены — низ бирюзовый, верх белый,
// поручень, двери палат с окошками, детские рисунки, каталка и капельница, в конце — окно в ночь. Линолеум блестит.
P11.hosp=(c,t,o={})=>{const u=o.u??0,E=o.E||[lp(-20,0,u),-158,lp(0,160,u)],cam=C3(E,o.T||[-10,-150,1000],o.f||1000,o.roll||0);
  const camz=E[2],FOG=h3('#9fb3b2'),D=3200,LAMPS=[180,400,620,840,1060,1280];const lamp=z=>lampSum(z,LAMPS,75);
  c.fillStyle='#0a0f10';c.fillRect(0,0,WW,HH);
  const low=(z,b)=>s3(surf(h3('#13302f'),h3('#7fc4b6'),b+.5*lamp(z),z,camz,FOG,D)),up=(z,b)=>s3(surf(h3('#2d3434'),h3('#e9efe9'),b+.62*lamp(z),z,camz,FOG,D));
  corridor(c,cam,{z0:60,z1:1400,n:110,xl:-150,xr:150,h:290,
    ceil:z=>s3(surf(h3('#1e2526'),h3('#c9d4d2'),.1+.45*lamp(z),z,camz,FOG,D)),
    floor:z=>s3(surf(h3('#162423'),h3('#86a19c'),.1+.42*lamp(z),z,camz,FOG,D)),
    wallL:z=>up(z,.12),wallR:z=>up(z,.1),end:s3(h3('#28343a'))});
  // нижняя половина стен — бирюзовая краска до поручня
  for(const x of [-149,149])corridor(c,cam,{z0:60,z1:1400,n:90,xl:x,xr:x,h:110,[x<0?'wallL':'wallR']:z=>low(z,.12)});
  grid3(c,cam,{plane:'floor',x0:-150,x1:150,z0:60,z1:1400,s:50,camz,D,col:'#0b1514',a:.28,w:1.6});
  // поручень (дерево) на стыке
  for(const x of [-147,147]){ln3(c,cam,[x,-112,60],[x,-112,1400],'#6b5236',7);ln3(c,cam,[x,-114,60],[x,-114,1400],'rgba(255,230,190,.5)',2);}
  // окно в конце: ночь, синее, рама крестом
  const wq=fq(c,cam,[[-80,-90,1399],[80,-90,1399],[80,-250,1399],[-80,-250,1399]],'#0e1d38');
  if(wq){c.save();PP(c,wq);c.clip();c.fillStyle=LG(c,0,wq[2][1],0,wq[0][1],[[0,'#1b2f5c'],[1,'#0a1428']]);c.fillRect(0,0,WW,HH);for(let i=0;i<30;i++)glowDot(c,lp(wq[0][0],wq[1][0],H1(i*3.3)),lp(wq[2][1],wq[0][1],.55+.45*H1(i*7.1)),3,'#ffd27a',.8);c.restore();
    ln3(c,cam,[0,-90,1398],[0,-250,1398],'#cfd6d6',4);ln3(c,cam,[-80,-170,1398],[80,-170,1398],'#cfd6d6',4);}
  // двери палат: по обеим сторонам, с окошком и номером
  for(let i=5;i>=0;i--){for(const sd of [-1,1]){const z0=260+i*220+(sd>0?90:0),z1=z0+95,x=sd*149,fz=1-fogK(z0-camz,D);
    fq(c,cam,[[x,0,z0],[x,0,z1],[x,-215,z1],[x,-215,z0]],s3(m3(h3('#d7d0c0'),FOG,1-fz)));
    fq(c,cam,[[x,0,z0+5],[x,0,z1-5],[x,-208,z1-5],[x,-208,z0+5]],s3(m3(h3('#b9ad95'),FOG,(1-fz)*.9)));
    fq(c,cam,[[x,-140,z0+30],[x,-140,z1-30],[x,-190,z1-30],[x,-190,z0+30]],s3(m3(i===2&&sd<0?h3('#f4d58a'):h3('#3a4a52'),FOG,(1-fz)*.8)));
    ln3(c,cam,[x,-100,z1-14],[x,-100,z1-34],rgba('#e8e8e8',fz),5);}}
  // детские рисунки на стенах: цветные листы
  const KID=['#ffd34d','#ff7a59','#7ad3ff','#9be07a','#ff9ad1'];
  for(let i=0;i<14;i++){const sd=i%2?1:-1,x=sd*148.5,z=150+i*85+H1(i)*30,y=-150-H1(i*3)*40,fz=1-fogK(z-camz,D);if(z>1300)continue;
    const q=fq(c,cam,[[x,y,z],[x,y,z+32],[x,y-24,z+32],[x,y-24,z]],s3(m3(h3('#fbf6ea'),FOG,1-fz)));
    if(q){c.save();PP(c,q);c.clip();c.globalAlpha=fz;const cx=(q[0][0]+q[2][0])/2,cy=(q[0][1]+q[2][1])/2,r=Math.abs(q[1][0]-q[0][0])*.3+2;
      c.fillStyle=KID[i%5];c.beginPath();c.arc(cx,cy-r*.3,r,0,TAU);c.fill();c.fillStyle=KID[(i+2)%5];c.fillRect(cx-r*1.4,cy+r*.5,r*2.8,r*.7);c.restore();}}
  // лампы: панели на потолке, мягкое свечение
  for(const zl of LAMPS){const fz=1-fogK(zl-camz,D);fq(c,cam,[[-45,-289,zl-55],[45,-289,zl-55],[45,-289,zl+55],[-45,-289,zl+55]],rgba('#f4fbff',.95*fz+.05));
    glow3(c,cam,[0,-286,zl],230,'#dff6ff',.35*fz);refl3(c,cam,[0,-289,zl],150,'#e6faff',.35*fz,2.6);}
  // каталка у правой стены и капельница
  const gz=520,gb=[[60,138,-62,-78,gz,gz+190]];
  box3(c,cam,[60,138,-60,-74,gz,gz+190],{top:s3(h3('#eef2f2')),left:s3(h3('#b9c3c3')),front:s3(h3('#c9d1d1'))});
  for(const [x,z] of [[64,gz+6],[134,gz+6],[64,gz+184],[134,gz+184]])ln3(c,cam,[x,0,z],[x,-60,z],'#8e9696',3);
  ln3(c,cam,[40,0,gz+40],[40,-205,gz+40],'#9aa3a3',3);const ivq=fq(c,cam,[[30,-190,gz+40],[50,-190,gz+40],[50,-160,gz+40],[30,-160,gz+40]],'rgba(220,240,255,.75)');
  haze3(c,cam,1100,-150,.05,'#e8f6ff',8,2,t);
  punch(c,1.12,1.05);fin11(c,0,{warm:'#ffd2a0',cool:'#2a5a5a',ga:.12,vig:.55});lightBloom(c,.22);
};

/* ================= ВОКЗАЛ: перрон ночью ================= */
// перрон уходит вдаль, слева — белый скоростной поезд с красной полосой и светящимися окнами, навес на фермах с лампами,
// табло «САНКТ-ПЕТЕРБУРГ», круглые часы, дымка; Юля стоит на перроне.
P11.vok=(c,t,o={})=>{const E=o.E||[120,-165,0],cam=C3(E,o.T||[40,-175,1600],o.f||1100,o.roll||0);const camz=E[2],FOG=h3('#18222e'),D=3800;
  c.fillStyle=LG(c,0,0,0,HH,[[0,'#04070d'],[.5,'#0b1320'],[1,'#05080c']]);c.fillRect(0,0,WW,HH);
  const LZ=[];for(let z=200;z<5200;z+=360)LZ.push(z);const lamp=z=>lampSum(z,LZ,90);
  // платформа: асфальт/плитка, жёлтая линия у края
  corridor(c,cam,{z0:60,z1:5200,n:150,xl:-160,xr:520,h:620,
    floor:z=>s3(surf(h3('#0c0f14'),h3('#5a5e63'),.06+.28*lamp(z),z,camz,FOG,D)),
    ceil:z=>s3(surf(h3('#05070b'),h3('#2a3038'),.03+.18*lamp(z),z,camz,FOG,D))});
  for(let z=60;z<5200;z+=40){const fz=1-fogK(z-camz,D);fq(c,cam,[[-160,-1,z],[-128,-1,z],[-128,-1,z+38],[-160,-1,z+38]],rgba('#e8c23a',.85*fz));}
  grid3(c,cam,{plane:'floor',x0:-120,x1:520,z0:60,z1:5200,s:80,camz,D,col:'#000000',a:.35,w:1.4});
  // поезд: бок вагона на x=-185 от платформы до -390, освещён фонарями перрона (пятна по глубине)
  corridor(c,cam,{z0:150,z1:5200,n:140,xl:-185,xr:-185,h:390,wallL:z=>s3(surf(h3('#3a4048'),h3('#b9c0c8'),.08+.5*lamp(z),z,camz,FOG,D))});
  for(let k=2;k>=0;k--){const z0=150+k*2450,z1=z0+2400,fz=1-fogK(z0-camz,D);
    fq(c,cam,[[-184,-44,z0],[-184,-44,z1],[-184,-60,z1],[-184,-60,z0]],s3(m3(h3('#b3172a'),FOG,(1-fz)*.9)));
    fq(c,cam,[[-184,-196,z0+60],[-184,-196,z1-60],[-184,-286,z1-60],[-184,-286,z0+60]],s3(m3(h3('#10141b'),FOG,(1-fz)*.9)));
    for(let w=0;w<22;w++){const zw=z0+80+w*104;if(zw+80>z1-60)break;const lit=H1(k*31+w)>.2,pp=H1(k*17+w*3)>.55;
      fq(c,cam,[[-183.5,-204,zw],[-183.5,-204,zw+82],[-183.5,-278,zw+82],[-183.5,-278,zw]],lit?s3(m3(h3('#f2c890'),FOG,(1-fz)*.6)):s3(m3(h3('#263040'),FOG,1-fz)));
      if(lit)glow3(c,cam,[-170,-240,zw+40],70,'#ffc27a',.18*fz);}
    fq(c,cam,[[-184,0,z1],[-184,0,z1+50],[-184,-390,z1+50],[-184,-390,z1]],'#06080b');}
  // блик фонарей на гладком боку поезда
  for(const z of LZ){const fz=1-fogK(z-camz,D);glow3(c,cam,[-184,-300,z],120,'#ffe2b8',.18*fz);}
  // навес: фермы поперёк, лампы под ними
  for(let i=LZ.length-1;i>=0;i--){const z=LZ[i],fz=1-fogK(z-camz,D);
    ln3(c,cam,[-160,-618,z],[520,-618,z],rgba('#4a525c',.9*fz),9);ln3(c,cam,[-160,-560,z],[520,-600,z],rgba('#323840',.8*fz),5);
    ln3(c,cam,[470,0,z],[470,-618,z],rgba('#2d333a',fz),16);ln3(c,cam,[466,0,z],[466,-618,z],rgba('#7d8794',.5*fz),3);
    glow3(c,cam,[160,-590,z],210,'#ffd79a',.5*fz);glow3(c,cam,[160,-590,z],30,'#fff3dc',.95*fz);
    refl3(c,cam,[160,-590,z],110,'#ffd79a',.22*fz,2.4);}
  // табло отправления и часы на навесе
  const bz=900,bq=fq(c,cam,[[60,-520,bz],[360,-520,bz],[360-0,-440,bz],[60,-440,bz]],'#050608');
  if(bq){const p=cam.P(210,-480,bz);tx(c,'САНКТ-ПЕТЕРБУРГ',p[0],p[1]-6*p[3],{f:'J',w:700,s:30*p[3],c:'#ffb02e',glow:'#ff8a00',gb:8});tx(c,'23:30   ПУТЬ 4',p[0],p[1]+26*p[3],{f:'J',w:500,s:22*p[3],c:'#ffd27a'});}
  const kp=cam.P(250,-500,2300);if(kp[2]>3){ln3(c,cam,[250,-618,2300],[250,-545,2300],'#2a2f36',5);const r=48*kp[3];c.fillStyle='#f4efe2';c.beginPath();c.arc(kp[0],kp[1],r,0,TAU);c.fill();c.strokeStyle='#20242a';c.lineWidth=r*.12;c.stroke();
    c.strokeStyle='#111';c.lineCap='round';c.lineWidth=r*.08;c.beginPath();c.moveTo(kp[0],kp[1]);c.lineTo(kp[0]+r*.15,kp[1]-r*.62);c.stroke();c.lineWidth=r*.06;c.beginPath();c.moveTo(kp[0],kp[1]);c.lineTo(kp[0]+r*.58,kp[1]+r*.1);c.stroke();glowDot(c,kp[0],kp[1],r*2.2,'#ffe9c0',.25);}
  haze3(c,cam,1800,-250,.12,'#b9cce0',12,7,t);haze3(c,cam,3200,-200,.1,'#9fb4cc',10,11,t);
  // Юля: в куртке, у края света, смотрит на камеру
  const yz=520,yp=cam.P(150,0,yz);if(!o.noY&&yp[2]>3&&typeof figA==='function'){figA(c,{f:AX.yulia||AX.woman||'max',x:yp[0],y:yp[1],s:yp[3]*.165,cloth:{k:'parka'},L:1,light:'#ffcf8a',la:.25});}
  punch(c,1.15,1.08);fin11(c,0,{warm:'#ffb46a',cool:'#16304f',ga:.18,vig:.7});lightBloom(c,.3);
};

/* ================= ТВЕРСКАЯ ночью + вход в клуб ================= */
// широкий проспект уходит к Кремлю: сталинские дома с горящими окнами, фонари рядами, следы фар, мокрый асфальт;
// в конце — Спасская башня с красной звездой; справа близко — вход в клуб: неон, канат, очередь, охранник.
function spasskaya(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);const R='#3a0f12',R2='#5a1a1c';
  c.fillStyle=R;c.fillRect(-300,-2600,600,2600);c.fillStyle=R2;c.fillRect(-300,-2600,150,2600);
  c.fillStyle='#2c0b0e';c.fillRect(-250,-3300,500,700);c.fillRect(-190,-4300,380,1000);
  c.fillStyle='#e9d8a8';c.beginPath();c.arc(0,-3000,150,0,TAU);c.fill();c.fillStyle='#1a1410';c.beginPath();c.arc(0,-3000,120,0,TAU);c.fill();
  c.fillStyle='#2c0b0e';c.beginPath();c.moveTo(-190,-4300);c.lineTo(0,-6600);c.lineTo(190,-4300);c.closePath();c.fill();
  for(let i=0;i<5;i++){c.fillStyle='#4a1518';c.fillRect(-170,-4200+i*180,340,30);}
  c.restore();
  const sx=x,sy=y-6800*s;glowDot(c,sx,sy,420*s*3,'#ff2a2a',.55);c.save();c.translate(sx,sy);c.fillStyle='#ff3b30';c.beginPath();
  for(let i=0;i<10;i++){const r=i%2?60:150,a=-Math.PI/2+i*Math.PI/5;c.lineTo(Math.cos(a)*r*s*1.6,Math.sin(a)*r*s*1.6);}c.closePath();c.fill();c.restore();
  glowDot(c,sx,sy,90*s*3,'#ffb0a0',.7);}
function kremlinWall(c,x0,x1,y,s){c.fillStyle='#2a0c0e';c.fillRect(x0,y-1900*s,x1-x0,1900*s);const m=220*s;for(let x=x0;x<x1;x+=m*2){c.beginPath();c.moveTo(x,y-1900*s);c.lineTo(x,y-2150*s);c.lineTo(x+m*.5,y-2050*s);c.lineTo(x+m,y-2150*s);c.lineTo(x+m,y-1900*s);c.closePath();c.fill();}}
P11.tver=(c,t,o={})=>{const E=o.E||[1050,-175,0],cam=C3(E,o.T||[200,-1500,16000],o.f||1100,o.roll||0);const camz=E[2],FOG=h3('#241a2c'),D=9000;
  // небо: тёмно-синее, у горизонта — оранжевое свечение города
  c.fillStyle=LG(c,0,0,0,HH,[[0,'#03050c'],[.35,'#0b1230'],[.48,'#3b2443'],[.52,'#5a2f3a'],[.6,'#0c0a14'],[1,'#050508']]);c.fillRect(0,0,WW,HH);
  const LZ=[];for(let z=2200;z<23000;z+=1700)LZ.push(z);const lamp=z=>lampSum(z,LZ,500);
  // Кремль в конце
  const kp=cam.P(-150,0,19000);kremlinWall(c,kp[0]-2600*kp[3],kp[0]+2600*kp[3],kp[1],kp[3]);spasskaya(c,kp[0],kp[1],kp[3]);
  haze3(c,cam,20000,-800,.25,'#ff9a70',10,3,t);
  // дорога и тротуары
  corridor(c,cam,{z0:60,z1:24000,n:160,xl:-1700,xr:1700,h:4000,floor:z=>s3(surf(h3('#0a090f'),h3('#4a3a48'),.12+.45*lamp(z),z,camz,FOG,D))});
  for(const sd of [-1,1]){const x0=sd*1200;fq(c,cam,[[x0,-15,60],[x0,-15,24000],[x0+sd*8,0,24000],[x0+sd*8,0,60]],'#1a1820');}
  // разметка
  for(let z=200;z<20000;z+=600){const fz=1-fogK(z-camz,D);fq(c,cam,[[-12,-1,z],[12,-1,z],[12,-1,z+300],[-12,-1,z+300]],rgba('#e9e3d0',.5*fz));}
  // дома: фасады по обе стороны, окна
  for(const sd of [-1,1]){let z=200;let k=0;while(z<23000){const len=900+H1(k*3.1+sd)*1400,hgt=2300+H1(k*7.7+sd)*1100,z1=z+len,fz=1-fogK(z-camz,D);
      const X=sd*1700,base=m3(h3(sd<0?'#2a2228':'#241e26'),FOG,(1-fz)*.85);
      fq(c,cam,[[X,0,z],[X,0,z1],[X,-hgt,z1],[X,-hgt,z]],s3(base));
      // карниз
      fq(c,cam,[[X,-hgt,z],[X,-hgt,z1],[X-sd*60,-hgt-40,z1],[X-sd*60,-hgt-40,z]],s3(k3(base,1.3)));
      // окна
      if(fz>.08)for(let wz=z+120;wz<z1-120;wz+=260)for(let wy=-420;wy>-hgt+220;wy-=300){const on=H1(wz*.013+wy*.07+sd*5)>.45,col=on?(H1(wz+wy)>.6?'#ffcf86':'#ffb35c'):'#141018';
        fq(c,cam,[[X-sd*1,wy,wz],[X-sd*1,wy,wz+110],[X-sd*1,wy-170,wz+110],[X-sd*1,wy-170,wz]],s3(m3(h3(col),FOG,(1-fz)*(on?.5:.8))));}
      // витрины на первом этаже
      fq(c,cam,[[X-sd*1,-60,z+80],[X-sd*1,-60,z1-80],[X-sd*1,-300,z1-80],[X-sd*1,-300,z+80]],s3(m3(h3(H1(k+sd)>.5?'#ffd7a0':'#ffb88a'),FOG,(1-fz)*.55+(z<1500?.35:0))));
      glow3(c,cam,[X-sd*200,-180,(z+z1)/2],300,'#ffc890',.25*fz);refl3(c,cam,[X-sd*120,-180,(z+z1)/2],260,'#ffc08a',.3*fz,4.5);
      z=z1+40;k++;}}
  // фонари: столбы у бордюров, двойные плафоны
  for(let i=LZ.length-1;i>=0;i--){const z=LZ[i],fz=1-fogK(z-camz,D);for(const sd of [-1,1]){const x=sd*1260;
    ln3(c,cam,[x,0,z],[x,-950,z],rgba('#1c1a22',fz),22);ln3(c,cam,[x,-950,z],[x-sd*180,-1000,z],rgba('#1c1a22',fz),12);
    glow3(c,cam,[x-sd*180,-985,z],520,'#ffb35c',.45*fz);glow3(c,cam,[x-sd*180,-985,z],70,'#fff0d0',.95*fz);
    refl3(c,cam,[x-sd*180,-985,z],300,'#ffb35c',.35*fz,3.2);}}
  // фары: слева навстречу белые, справа — красные стоп-сигналы, полосами
  c.save();c.globalCompositeOperation='screen';for(let lane=0;lane<4;lane++){const x=lane<2?-950+lane*400:250+(lane-2)*400,col=lane<2?'#fff4dc':'#ff2a2a';
    for(let z=300;z<16000;z+=140){const fz=1-fogK(z-camz,D),p=cam.P(x,-70,z),q=cam.P(x,-70,z+120);if(p[2]<=3)continue;const a=(.35+.65*H1(z*.01+lane))*fz*(H1(z*.003+lane*2)>.35?1:0);
      c.strokeStyle=rgba(col,a*.8);c.lineWidth=Math.max(1,10*p[3]);c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(q[0],q[1]);c.stroke();
      refl3(c,cam,[x,-70,z],50,col,a*.25,4);}}c.restore();
  // машины: уезжающая (стоп-сигналы) и встречная (фары)
  const car=(x,z,dir,body)=>{const fz=1-fogK(z-camz,D),bc=s3(m3(h3(body),FOG,(1-fz)*.7));
    box3(c,cam,[x-90,x+90,-20,-120,z,z+440],{top:bc,left:bc,right:bc,front:s3(k3(m3(h3(body),FOG,(1-fz)*.7),.8)),back:bc});
    box3(c,cam,[x-75,x+75,-120,-185,z+110,z+330],{top:'#0b0c10',left:'#14161c',right:'#14161c',front:'#191b22',back:'#191b22'});
    const lz=dir>0?z:z+440,col=dir>0?'#ff2a2a':'#fff6e0';for(const sx of [-62,62]){glow3(c,cam,[x+sx,-85,lz-2],dir>0?60:140,col,.9*fz);refl3(c,cam,[x+sx,-85,lz],dir>0?70:160,col,.5*fz,5);}
    if(dir<0)beam(c,cam.P(x,-85,z)[0],cam.P(x,-85,z)[1],Math.PI,.8,300,'#fff2d8',.12);};
  car(-750,5200,-1,'#1c1f26');car(600,3600,1,'#101114');car(-350,9800,-1,'#22232a');car(320,12500,1,'#18191d');
  // вход в клуб справа: козырёк, неон, дверь светится, канат, очередь
  const cz0=2600,cz1=3400;
  box3(c,cam,[1450,1700,-480,-520,cz0,cz1],{bottom:0,left:s3(h3('#0d0b12')),front:s3(h3('#141019'))});
  fq(c,cam,[[1699,0,cz0+250],[1699,0,cz0+550],[1699,-300,cz0+550],[1699,-300,cz0+250]],'#2a0f22');
  glow3(c,cam,[1690,-150,cz0+400],420,'#ff2e8f',.55);
  // вертикальная неоновая вывеска
  const np=cam.P(1640,-1300,cz0+100),nq=cam.P(1640,-600,cz0+100);if(np[2]>3){const h=nq[1]-np[1],w=h*.22;c.fillStyle='#120812';c.fillRect(np[0]-w/2,np[1],w,h);
    glowDot(c,np[0],np[1]+h/2,h*.9,'#ff2e8f',.45);c.save();c.translate(np[0],np[1]);font(c,{f:'O',w:700,s:w*.72});c.textAlign='center';c.textBaseline='middle';c.shadowColor='#ff2e8f';c.shadowBlur=24;c.fillStyle='#ffd1ea';
    'VELVET'.split('').forEach((ch,i)=>c.fillText(ch,0,h*(.1+i*.16)));c.restore();}
  // канат на латунных стойках
  const posts=[];for(let z=cz0-1500;z<=cz0+200;z+=280)posts.push([1470,z]);
  for(let i=0;i<posts.length;i++){const [x,z]=posts[i];ln3(c,cam,[x,0,z],[x,-95,z],'#b8913f',6);glow3(c,cam,[x,-98,z],14,'#ffe2a0',.8);
    if(i<posts.length-1){const a=cam.P(x,-88,z),b=cam.P(posts[i+1][0],-88,posts[i+1][1]),mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2+18*a[3];c.strokeStyle='#8a1430';c.lineWidth=7*a[3];c.beginPath();c.moveTo(a[0],a[1]);c.quadraticCurveTo(mx,my,b[0],b[1]);c.stroke();}}
  // очередь: силуэты против неона, охранник у двери
  const Q=[[1580,cz0-120],[1610,cz0-380],[1560,cz0-640],[1620,cz0-900],[1575,cz0-1160],[1600,cz0-1420]];
  for(const [x,z] of Q.reverse()){const p=cam.P(x,0,z);if(p[2]<=3)continue;pers3(c,p[0],p[1],175*p[3],{col:'#07060b',rim:'#ff4aa6',sd:1,coat:H1(z)>.5,w:.95+.15*H1(z*3)});}
  const bp=cam.P(1520,0,cz0+380);pers3(c,bp[0],bp[1],192*bp[3],{col:'#040306',rim:'#ff4aa6',sd:1,w:1.25});
  haze3(c,cam,3000,-300,.08,'#ffb0d0',8,9,t);
  punch(c,1.15,1.15);fin11(c,0,{warm:'#ff8a4c',cool:'#1d1f55',ga:.16,vig:.7});lightBloom(c,.38);
};

/* ================= КЛУБ: танцпол ================= */
// глаза Макса в толпе: головы и поднятые руки силуэтами против сцены, над сценой ферма — лучи в дыму качаются,
// лазеры над головами, за диджеем светодиодная стена.
P11.club=(c,t,o={})=>{const E=o.E||[30,-172,0],cam=C3(E,o.T||[0,-300,2200],o.f||1000,o.roll||0);const camz=E[2],FOG=h3('#1c0a26'),D=2400,ac='#ff2f8e',ac2='#3fd6ff';
  c.fillStyle='#040207';c.fillRect(0,0,WW,HH);
  corridor(c,cam,{z0:150,z1:2600,n:80,xl:-1000,xr:1000,h:1000,
    floor:z=>s3(surf(h3('#060309'),h3('#2a1030'),.15,z,camz,FOG,D)),ceil:z=>s3(surf(h3('#030204'),h3('#120716'),.1,z,camz,FOG,D))});
  // светодиодная стена: крупные пиксели, градиент, тёмная середина за диджеем
  const wq=pj(cam,[[-760,-120,2590],[760,-120,2590],[760,-760,2590],[-760,-760,2590]]);
  if(wq){c.save();PP(c,wq);c.clip();c.fillStyle=LG(c,wq[0][0],0,wq[1][0],0,[[0,'#3a0a52'],[.35,'#c21f78'],[.5,'#ff8ac4'],[.65,'#c21f78'],[1,'#123a9a']]);c.fillRect(0,0,WW,HH);
    c.fillStyle='rgba(8,0,12,.6)';const st=7;for(let x=wq[0][0];x<wq[1][0];x+=st)c.fillRect(x,0,2.5,HH);for(let y=wq[2][1];y<wq[0][1];y+=st)c.fillRect(0,y,WW,2.5);c.restore();
    glowDot(c,(wq[0][0]+wq[1][0])/2,(wq[0][1]+wq[2][1])/2,700,ac,.4);}
  box3(c,cam,[-650,650,0,-110,2200,2580],{front:'#0a050d',top:'#1b0e21'});
  box3(c,cam,[-170,170,-110,-220,2280,2360],{front:'#07040a',top:'#24162b'});
  for(let i=0;i<12;i++)glow3(c,cam,[-150+i*27,-222,2300],7,i%3?ac2:'#ffffff',.95);
  // диджей силуэтом
  const dp=cam.P(0,-110,2380);pers3(c,dp[0],dp[1],180*dp[3],{col:'#050307',rim:'#ffb6e0',ra:.9,up:[.5]});
  // ферма над сценой и прожекторы
  ln3(c,cam,[-900,-900,1900],[900,-900,1900],'#1e1824',14);ln3(c,cam,[-900,-860,1900],[900,-860,1900],'#1e1824',8);
  for(let i=0;i<8;i++){const x=-770+i*220,p=cam.P(x,-880,1900),ang=Math.sin(t*1.2+i*1.9)*.35+(3.5-i)*-.07,col=[ac,ac2,'#ffffff',ac2,ac,'#ffd25a',ac2,ac][i];
    beam(c,p[0],p[1],ang,.15,1700,col,.8);glowDot(c,p[0],p[1],34,col,.95);}
  haze3(c,cam,1700,-500,.2,'#c070ff',12,3,t);haze3(c,cam,1000,-300,.12,'#ff6fb0',10,8,t);
  // лазеры зелёным веером над головами
  c.save();c.globalCompositeOperation='screen';const l0=cam.P(0,-700,2500);for(let i=0;i<16;i++){const a=-1.05+i*.14+Math.sin(t*.9)*.06;c.strokeStyle=rgba('#45ff9c',.4);c.lineWidth=2.5;c.beginPath();c.moveTo(l0[0],l0[1]);c.lineTo(l0[0]+Math.sin(a)*2600,l0[1]+Math.cos(a)*420-40);c.stroke();}c.restore();
  glowDot(c,l0[0],l0[1],60,'#45ff9c',.9);
  // толпа: от сцены к камере, ряды всё крупнее; руки вверх; контур в цвет света
  for(let row=0;row<13;row++){const z=2050-row*150,n=Math.round(11+row*1.1),fz=1-fogK(z-camz,D);for(let i=0;i<n;i++){
    const x=-950+(i+.5)*1900/n+(H1(i*3+row)-.5)*120,p=cam.P(x,0,z);if(p[2]<=3)continue;const hgt=(168+14*H1(i+row*7))*p[3];
    const up=H1(i*5+row)>.5?[(H1(i)>.5?1:-1)*(.5+.5*H1(i*13+row)),...(H1(i*9+row)>.72?[(H1(i)>.5?-1:1)*.8]:[])]:null;
    pers3(c,p[0],p[1]+Math.sin(t*7+i*1.3+row)*4*p[3],hgt,{col:s3(m3(h3('#040206'),FOG,(1-fz)*.65)),rim:H1(i*2+row)>.5?ac:ac2,ra:.35+.3*(row/13),sd:x<E[0]?-1:1,up,w:1.05+.2*H1(i*7+row)});}}
  const bb=bokeh('club',WW,HH,40,[ac,ac2,'#ffd25a'],20,80,5,4);c.save();c.globalCompositeOperation='screen';c.globalAlpha=.5;c.drawImage(bb,0,0);c.restore();
  punch(c,1.15,1.2);fin11(c,0,{warm:'#ff5c9c',cool:'#2a1b6b',ga:.14,vig:.75});lightBloom(c,.42);
};

/* ================= ВИП: Миша и Вадим за столом (реальные сантиметры) ================= */
// камера — глаза сидящего Макса. Низкий стол из тёмного стекла, ведро со льдом и шампанское, бокалы;
// за столом полукругом диван из красной кожи со стёжкой, на нём Миша и Вадим; за спинкой — стекло и зал в боке.
P11.vip=(c,t,o={})=>{const E=o.E||[0,-120,0],cam=C3(E,o.T||[0,-100,260],o.f||1500,o.roll||0);const ac='#ff2f8e',ac2='#3fd6ff';
  blurred(c,16,g=>{g.fillStyle=LG(g,0,0,0,HH,[[0,'#0a0410'],[.55,'#1c0a26'],[1,'#07030a']]);g.fillRect(0,0,WW,HH);
    for(let i=0;i<7;i++)beam(g,90+i*150,-60,(i-3)*.12+Math.sin(t+i)*.1,.22,1300,[ac,ac2,'#ffffff'][i%3],.75);
    for(let i=0;i<24;i++)sil(g,(i+.5)*WW/24,760+H1(i)*50,.4,{col:'#09040d',up:H1(i*5)>.5?.8:0,both:H1(i*9)>.7,side:H1(i)>.5?1:-1});});
  const bb=bokeh('vip',WW,HH,50,[ac,ac2,'#ffd25a','#ffffff'],20,90,9,3);c.save();c.globalCompositeOperation='screen';c.globalAlpha=.75;c.drawImage(bb,0,0);c.restore();
  // диван: дуга радиуса R с центром (0, zc); спинка от сиденья (y=-42) до y=-100
  const R=125,zc=235,arc=(y,r,a0,a1,n=40)=>{const P=[];for(let i=0;i<=n;i++){const a=lp(a0,a1,i/n);P.push(cam.P(Math.sin(a)*r,y,zc+Math.cos(a)*r));}return P;};
  const back=[...arc(-104,R,-1.75,1.75),...arc(-42,R-6,1.75,-1.75)];
  c.fillStyle=LG(c,0,cam.P(0,-104,zc+R)[1],0,cam.P(0,-42,zc+R)[1],[[0,'#8c1426'],[.5,'#5a0a16'],[1,'#2a040b']]);PP(c,back);c.fill();
  c.save();PP(c,back);c.clip();c.strokeStyle='rgba(0,0,0,.4)';c.lineWidth=2.5;for(let a=-1.7;a<=1.7;a+=.17){const p0=cam.P(Math.sin(a)*R,-104,zc+Math.cos(a)*R),p1=cam.P(Math.sin(a)*(R-6),-42,zc+Math.cos(a)*(R-6));c.beginPath();c.moveTo(p0[0],p0[1]);c.lineTo(p1[0],p1[1]);c.stroke();}
  for(let y=-95;y<-45;y+=14){const L=arc(y,R-2,-1.7,1.7);c.beginPath();L.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.stroke();}
  c.globalCompositeOperation='screen';const L2=arc(-104,R,-1.7,1.7);c.strokeStyle=rgba(ac,.55);c.lineWidth=5;c.beginPath();L2.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.stroke();c.restore();
  // сиденье
  const seat=[...arc(-42,R-6,-1.75,1.75),...arc(-38,R-60,1.75,-1.75)];c.fillStyle='#3a0610';PP(c,seat);c.fill();
  // Миша (по центру, ухмылка) и Вадим (правее) — сидят
  if(typeof personA==='function'){const mp=cam.P(-30,-116,zc+55);personA(c,{f:'misha',x:mp[0],y:mp[1],s:mp[3]/7.2,L:1,light:'#ff7ab8',la:.22,e:o.mishaE||'smirk',cloth:{k:'shirt',shirt:'#2b2f3a'},sw:130,bt:520});
    const vp=cam.P(78,-114,zc+18);personA(c,{f:'vadim',x:vp[0],y:vp[1],s:vp[3]/7.2,L:-1,light:'#7ad8ff',la:.2,e:o.vadE||'smile',cloth:{k:'sweater',col:'#4a5160'},sw:120,bt:520});}
  // стол: столешница из тёмного стекла y=-45, ножки тенью
  const tq=fq(c,cam,[[-70,-45,75],[70,-45,75],[70,-45,175],[-70,-45,175]],'rgba(14,10,18,.94)');
  if(tq){c.save();PP(c,tq);c.clip();c.globalCompositeOperation='screen';c.fillStyle=LG(c,0,tq[2][1],0,tq[0][1],[[0,'rgba(255,80,160,.22)'],[1,'rgba(60,200,255,.06)']]);c.fillRect(0,0,WW,HH);c.restore();
    c.strokeStyle='rgba(255,220,190,.55)';c.lineWidth=2.5;PP(c,tq);c.stroke();box3(c,cam,[-70,70,0,-45,75,79],{front:'rgba(30,20,30,.9)'});}
  // ведро: цилиндр из металла, лёд, бутылка шампанского под наклоном
  const cyl=(x,z,r,y0,y1,f)=>{const n=24,T=[],B=[];for(let i=0;i<=n;i++){const a=Math.PI*i/n;T.push(cam.P(x+Math.cos(a)*r,y1,z-Math.sin(a)*r*0+Math.sin(a)*0-Math.sin(a)*r));B.push(cam.P(x+Math.cos(a)*r,y0,z-Math.sin(a)*r));}
    const L=cam.P(x-r,y0,z),Rr=cam.P(x+r,y0,z);c.fillStyle=LG(c,L[0],0,Rr[0],0,f);PP(c,[...T,...B.reverse()]);c.fill();
    const top=[];for(let i=0;i<=n*2;i++){const a=TAU*i/(n*2);top.push(cam.P(x+Math.cos(a)*r,y1,z+Math.sin(a)*r));}return top;};
  const bx=-26,bz=128,top=cyl(bx,bz,12,-45,-70,[[0,'#3c3f45'],[.25,'#e9ecf1'],[.4,'#9aa0a8'],[.75,'#5a5e66'],[1,'#2a2c31']]);
  c.fillStyle='#cfd5dc';PP(c,top);c.fill();c.fillStyle='rgba(225,242,255,.95)';for(let i=0;i<9;i++){const q=cam.P(bx+(H1(i)-.5)*18,-71,bz+(H1(i*3)-.5)*14);c.beginPath();c.arc(q[0],q[1],2.2*q[3],0,TAU);c.fill();}
  // бутылка: от (bx+2,-70,bz) вверх-вправо
  const b0=cam.P(bx+3,-66,bz),b1=cam.P(bx+9,-104,bz-4),k=b0[3],ang=Math.atan2(b1[0]-b0[0],-(b1[1]-b0[1]));c.save();c.translate(b0[0],b0[1]);c.rotate(ang);
  c.fillStyle=LG(c,-4.2*k,0,4.2*k,0,[[0,'#06110a'],[.35,'#2c5a3a'],[.5,'#9cc9a8'],[.6,'#1b3624'],[1,'#040b07']]);
  c.beginPath();c.moveTo(-4.2*k,10*k);c.lineTo(-4.2*k,-14*k);c.quadraticCurveTo(-4.2*k,-22*k,-1.6*k,-26*k);c.lineTo(-1.6*k,-36*k);c.lineTo(1.6*k,-36*k);c.lineTo(1.6*k,-26*k);c.quadraticCurveTo(4.2*k,-22*k,4.2*k,-14*k);c.lineTo(4.2*k,10*k);c.closePath();c.fill();
  c.fillStyle=LG(c,-1.8*k,0,1.8*k,0,[[0,'#7a5a14'],[.45,'#ffe48e'],[1,'#5e4410']]);c.fillRect(-1.8*k,-38*k,3.6*k,10*k);c.restore();
  // бокалы-флюте: стекло — тонкий контур, игристое внутри, блик
  const flute=(x,z,lv)=>{const p=cam.P(x,-45,z),q=p[3];c.save();c.translate(p[0],p[1]);
    c.strokeStyle='rgba(235,244,255,.85)';c.lineWidth=.35*q;c.beginPath();c.ellipse(0,0,3.6*q,1*q,0,0,TAU);c.stroke();c.beginPath();c.moveTo(0,0);c.lineTo(0,-10*q);c.stroke();
    c.fillStyle='rgba(255,212,110,.85)';c.beginPath();c.moveTo(-2.3*q,-10*q-lv*q);c.lineTo(2.3*q,-10*q-lv*q);c.lineTo(1.6*q,-10.5*q);c.lineTo(-1.6*q,-10.5*q);c.closePath();c.fill();
    c.strokeStyle='rgba(240,248,255,.9)';c.beginPath();c.moveTo(-2.8*q,-23*q);c.lineTo(-1.6*q,-10.5*q);c.lineTo(1.6*q,-10.5*q);c.lineTo(2.8*q,-23*q);c.stroke();
    c.globalCompositeOperation='screen';c.fillStyle='rgba(255,255,255,.75)';c.fillRect(-2*q,-21*q,.5*q,9*q);for(let i=0;i<4;i++)glowDot(c,(H1(i*x)-.5)*2*q,-12*q-i*1.6*q,.6*q,'#fff8e0',.9);c.restore();};
  flute(16,105,8);flute(36,150,6);flute(-52,155,7);
  // отражения на стекле стола
  c.save();c.globalCompositeOperation='screen';const rp=cam.P(bx,-45,bz);c.fillStyle=LG(c,rp[0]-30,0,rp[0]+30,0,[[0,'rgba(255,255,255,0)'],[.5,'rgba(230,240,255,.18)'],[1,'rgba(255,255,255,0)']]);c.fillRect(rp[0]-40,rp[1],80,90);c.restore();
  dof(c,{px:8,top:.0,m0:.1,m1:.75,bot:.9});
  punch(c,1.12,1.18);fin11(c,0,{warm:'#ff6aa0',cool:'#20306b',ga:.14,vig:.72});lightBloom(c,.32);
};

/* ================= ПЕРЕГОВОРНАЯ «МЕГАПОЛИСА», день ================= */
// длинный стол из полированного ореха уходит к стеклянной стене, за ней Сити в дымке; по бокам сотрудники смотрят в камеру,
// шеф стоит в конце против света. На столе: стаканы воды, папки, ноутбуки, ручки; в столе отражается окно.
function cityDay11(c,cx,by,sc){const C2=[{x:0,w:70,h:560,top:'flat',col:'#8ea3b8'},{x:70,w:62,h:700,top:'slant',col:'#7f9cbc'},{x:150,w:84,h:880,top:'spire',col:'#6e8fb6'},{x:236,w:72,h:760,top:'step',col:'#b89a62',crown:'#ffe0a0'},
  {x:314,w:74,h:720,top:'flat',col:'#7e98b6',twist:1},{x:390,w:66,h:640,top:'round',col:'#88a2bc'},{x:452,w:58,h:600,top:'flat',col:'#93a8bc'},{x:508,w:52,h:520,top:'slant',col:'#8198b0'}];
  for(const T of C2)tower(c,{...T,x:cx+(T.x-250)*sc},by,sc,{lite:0});}
P11.meet=(c,t,o={})=>{const E=o.E||[0,-135,0],cam=C3(E,o.T||[0,-105,700],o.f||1050,o.roll||0);const FOG=h3('#c9d6e2');
  // окно: небо, дальний город, Сити, дымка
  const wz=760,wq=pj(cam,[[-260,0,wz],[260,0,wz],[260,-300,wz],[-260,-300,wz]]);
  c.fillStyle='#1d222a';c.fillRect(0,0,WW,HH);
  if(wq){c.save();PP(c,wq);c.clip();const top=wq[2][1],bot=wq[0][1];c.fillStyle=LG(c,0,top,0,bot,[[0,'#7fa3c8'],[.6,'#c6d6e4'],[1,'#e9e4da']]);c.fillRect(0,0,WW,HH);
    cityFar(c,bot-(bot-top)*.18,{col:'#9fb0bf',seed:4});const cx=(wq[0][0]+wq[1][0])/2+40,sc=(bot-top)/1300;cityDay11(c,cx,bot-(bot-top)*.15,sc);
    c.fillStyle=LG(c,0,top,0,bot,[[0,'rgba(230,240,250,0)'],[.7,'rgba(230,236,240,.45)'],[1,'rgba(240,236,228,.7)']]);c.fillRect(0,0,WW,HH);
    glowDot(c,wq[0][0]+(wq[1][0]-wq[0][0])*.8,top+(bot-top)*.15,500,'#fff6e0',.35);c.restore();}
  // комната: пол (ковролин), стены — светлое дерево, потолок с линейными светильниками; стена со стеклом
  corridor(c,cam,{z0:60,z1:wz,n:60,xl:-260,xr:260,h:300,
    floor:z=>s3(m3(h3('#2b2f36'),h3('#5a6068'),z/wz*.6)),ceil:z=>s3(m3(h3('#5d646c'),h3('#b9c0c6'),z/wz)),
    wallL:z=>s3(m3(h3('#6a5644'),h3('#c8b8a4'),z/wz*.9)),wallR:z=>s3(m3(h3('#5e4c3d'),h3('#bba996'),z/wz*.9))});
  // переплёты окна
  for(const x of [-260,-87,87,260])ln3(c,cam,[x,0,wz],[x,-300,wz],'#2a2f36',10);ln3(c,cam,[-260,-300,wz],[260,-300,wz],'#2a2f36',12);
  for(const z of [220,420,620]){fq(c,cam,[[-120,-299,z],[120,-299,z],[120,-299,z+12],[-120,-299,z+12]],'rgba(255,252,245,.95)');glow3(c,cam,[0,-296,z],160,'#fff6e6',.25);}
  // люди по бокам стола (смотрят в камеру) и шеф у окна против света
  const ppl=[['clerk',-118,250,1,'#2d3340'],['woman',118,230,-1,'#1f2a3a'],['st1',-112,420,1,'#30343d'],['st2',112,400,-1,'#24282f']];
  if(typeof personA==='function'){
    const bp=cam.P(0,-150,700);personA(c,{f:'boss',x:bp[0],y:bp[1],s:bp[3]/7.2,L:-1,light:'#fff1d8',la:.35,e:o.bossE||'neutral',cloth:{k:'suit',jacket:'#2f323a',shirt:'#e8eaee',tie:'#6a1f2a'},sw:128,bt:520});
    for(const [f,x,z,L,j] of ppl.sort((a,b)=>b[2]-a[2])){const ch=pj(cam,[[x-26,-74,z+24],[x+26,-74,z+24],[x+24,-104,z+27],[x-24,-104,z+27]]);if(ch){PP(c,ch);c.fillStyle='#14161b';c.fill();c.strokeStyle='rgba(255,255,255,.12)';c.lineWidth=2;c.stroke();}const p=cam.P(x,-118,z);personA(c,{f,x:p[0],y:p[1],s:p[3]/7.2,L,light:'#fff1d8',la:.22,e:'neutral',look:[-Math.sign(x)*.4,0],cloth:{k:'suit',jacket:j,shirt:'#eef0f2'},sw:122,bt:520});}}
  // стол: полированный орех, в нём отражение окна
  const T=[[-90,-74,40],[90,-74,40],[90,-74,640],[-90,-74,640]],tq=fq(c,cam,T,'#3a2418');
  if(tq){c.save();PP(c,tq);c.clip();c.fillStyle=LG(c,0,tq[2][1],0,tq[0][1],[[0,'#7a5236'],[.5,'#4a2e1e'],[1,'#22130c']]);c.fillRect(0,0,WW,HH);
    c.globalCompositeOperation='screen';const a=cam.P(0,-74,640),b=cam.P(0,-74,300);c.fillStyle=LG(c,0,a[1],0,b[1],[[0,'rgba(235,240,248,.55)'],[1,'rgba(235,240,248,0)']]);
    c.beginPath();const w0=cam.P(-75,-74,640),w1=cam.P(75,-74,640),w2=cam.P(60,-74,300),w3=cam.P(-60,-74,300);c.moveTo(w0[0],w0[1]);c.lineTo(w1[0],w1[1]);c.lineTo(w2[0],w2[1]);c.lineTo(w3[0],w3[1]);c.closePath();c.fill();c.restore();
    box3(c,cam,[-90,90,-70,-74,40,640],{front:'#1d110a'});}
  // на столе: стаканы, папки, ноутбуки
  for(const [x,z] of [[-55,200],[55,240],[-58,420],[58,450]]){const p=cam.P(x,-74,z),q=p[3];c.save();c.translate(p[0],p[1]);c.fillStyle='rgba(220,235,245,.35)';c.fillRect(-3.4*q,-11*q,6.8*q,11*q);
    c.fillStyle='rgba(190,215,235,.45)';c.fillRect(-3.4*q,-7*q,6.8*q,7*q);c.strokeStyle='rgba(255,255,255,.75)';c.lineWidth=.4*q;c.strokeRect(-3.4*q,-11*q,6.8*q,11*q);c.fillStyle='rgba(255,255,255,.8)';c.fillRect(-2.6*q,-10*q,.6*q,8*q);c.restore();}
  for(const [x,z,a] of [[-40,250,.1],[45,330,-.15]]){box3(c,cam,[x-16,x+16,-74,-75.5,z-11,z+11],{top:'#1b2a44',front:'#13203a',left:'#13203a',right:'#13203a'});}
  for(const [x,z] of [[-50,560],[50,520]]){box3(c,cam,[x-17,x+17,-74,-75.2,z-12,z+12],{top:'#2a2d33',front:'#1a1c20'});const sq=pj(cam,[[x-16,-75.5,z+12],[x+16,-75.5,z+12],[x+16,-97,z+14],[x-16,-97,z+14]]);if(sq){PP(c,sq);c.fillStyle='#202329';c.fill();c.strokeStyle='#3a3e46';c.lineWidth=1.5;c.stroke();}}
  // макет посёлка на краю стола у шефа: белые домики на зелёном
  const mz=600;box3(c,cam,[-40,40,-74,-78,mz-20,mz+20],{top:'#7fa36a',front:'#e9e9e2'});for(let i=0;i<6;i++){const x=-30+(i%3)*30,z=mz-10+Math.floor(i/3)*18;box3(c,cam,[x-5,x+5,-78,-84,z-4,z+4],{top:'#c94b3a',front:'#f4f2ea',left:'#d8d6cc',right:'#d8d6cc'});}
  // солнечный свет из окна: лучи и пыль
  const sp=cam.P(140,-280,wz);beam(c,sp[0],sp[1],.35,.5,1500,'#fff2dc',.35);dust(c,t,sp[0],sp[1],.35,.5,1300,60,3,.5);
  punch(c,1.08,1.02);fin11(c,0,{warm:'#ffcf9a',cool:'#5c7896',ga:.16,vig:.5});lightBloom(c,.25);
};

/* ================= ДОГОВОР: лист на столе под лампой ================= */
function contractTex(sig){return cache('contract'+sig,900,1270,(x,w,h)=>{x.fillStyle=LG(x,0,0,w,h,[[0,'#f7f3ea'],[1,'#e9e2d2']]);x.fillRect(0,0,w,h);
  for(let i=0;i<2500;i++){x.fillStyle=`rgba(120,100,70,${.03*H1(i)})`;x.fillRect(H1(i*3.1)*w,H1(i*7.3)*h,1+H1(i)*3,1);}
  x.fillStyle='#1f2a44';x.font='800 46px Man';x.letterSpacing='6px';x.fillText('МЕГАПОЛИС',70,110);x.letterSpacing='0px';x.font='500 18px Man';x.fillStyle='#54607a';x.fillText('Русско-французский банк · Москва',72,142);
  x.fillStyle='#b3262d';x.fillRect(70,160,760,3);
  x.fillStyle='#16181d';x.font='700 30px Man';x.fillText('КРЕДИТНЫЙ ДОГОВОР № 4471/12',70,230);x.font='500 20px Man';x.fillStyle='#3a3e46';x.fillText('г. Москва                                                       «__» ________ 2012 г.',70,272);
  const W=['Банк','обязуется','предоставить','Заёмщику','кредит','на','строительство','коттеджного','посёлка','«Рай миллионеров»','в','порядке','и','на','условиях,','предусмотренных','настоящим','Договором.','Заёмщик','обязуется','возвратить','полученную','сумму','и','уплатить','проценты','за','пользование','ею','в','сроки','и','размере,','установленные'];
  x.font='400 19px Man';x.fillStyle='#2b2f38';let y=330;for(let r=0;r<26;r++){let xx=70;const cut=r%7===6?.55:1;while(xx<70+760*cut){const wd=W[(r*11+Math.floor(xx))%W.length];const ww=x.measureText(wd+' ').width;if(xx+ww>830)break;x.fillText(wd,xx,y);xx+=ww;}y+=r%7===6?44:29;}
  x.font='700 21px Man';x.fillStyle='#16181d';x.fillText('Кредитный инспектор:',70,1150);x.font='400 19px Man';x.fillText('М. Андреев',70,1180);x.strokeStyle='#3a3e46';x.lineWidth=1.2;x.beginPath();x.moveTo(330,1180);x.lineTo(620,1180);x.stroke();
  // печать банка
  x.save();x.translate(720,1120);x.rotate(-.2);x.strokeStyle='rgba(40,60,150,.75)';x.lineWidth=5;x.beginPath();x.arc(0,0,88,0,TAU);x.stroke();x.lineWidth=2;x.beginPath();x.arc(0,0,70,0,TAU);x.stroke();
  x.fillStyle='rgba(40,60,150,.75)';x.font='700 17px Man';x.textAlign='center';x.fillText('МЕГАПОЛИС',0,6);x.font='600 11px Man';for(let i=0;i<16;i++){x.save();x.rotate(i/16*TAU);x.fillText('•',0,-78);x.restore();}x.restore();
  // подпись — живой росчерк с нажимом
  if(sig>0){x.strokeStyle='#14246b';x.lineCap='round';x.lineJoin='round';const P=[[345,1172],[362,1140],[372,1176],[384,1132],[398,1170],[420,1150],[452,1160],[470,1128],[480,1168],[520,1150],[560,1162],[610,1148]];
    const nS=Math.max(1,Math.round(sig*(P.length-1)));for(let i=1;i<=nS;i++){x.lineWidth=2.2+2.4*Math.sin(i*1.7)**2;x.beginPath();x.moveTo(P[i-1][0],P[i-1][1]);x.quadraticCurveTo((P[i-1][0]+P[i][0])/2+6,(P[i-1][1]+P[i][1])/2-8,P[i][0],P[i][1]);x.stroke();}
    if(sig>=1){x.lineWidth=2;x.beginPath();x.moveTo(350,1188);x.bezierCurveTo(450,1200,560,1182,640,1192);x.stroke();}}
});}
P11.doc=(c,t,o={})=>{const E=o.E||[30,-70,0],cam=C3(E,o.T||[0,0,70],o.f||1700,o.roll??-.04);
  // стол: тёмное дерево с текстурой, пятно света от лампы
  c.fillStyle='#120b07';c.fillRect(0,0,WW,HH);
  const wood=cache('wood',800,800,(x,w,h)=>{x.fillStyle='#2a170c';x.fillRect(0,0,w,h);for(let i=0;i<260;i++){x.strokeStyle=`rgba(${80+40*H1(i)},${45+20*H1(i*3)},20,${.25*H1(i*7)})`;x.lineWidth=1+H1(i*5)*3;x.beginPath();const y=H1(i*9.1)*h;x.moveTo(0,y);x.bezierCurveTo(w*.3,y+20*(H1(i)-.5),w*.6,y-30*(H1(i*2)-.5),w,y+10*(H1(i*4)-.5));x.stroke();}});
  texPlane(c,cam,wood,[-200,0,-20],[400,0,0],[0,0,260],10,10);
  // лист договора в перспективе, с тенью
  const O=[-33,-.2,20],U=[64,0,4],V=[-6,0,90];
  c.save();c.filter='blur(14px)';c.fillStyle='rgba(0,0,0,.6)';const sh=pj(cam,[[O[0]+3,0,O[2]+3],[O[0]+U[0]+3,0,O[2]+U[2]+3],[O[0]+U[0]+V[0]+3,0,O[2]+U[2]+V[2]+3],[O[0]+V[0]+3,0,O[2]+V[2]+3]]);PP(c,sh);c.fill();c.restore();
  texPlane(c,cam,contractTex(Math.round((o.sig??1)*12)/12),[O[0],O[1],O[2]+V[2]],[U[0],0,U[2]],[-V[0],0,-V[2]],12,16);
  // ручка: металлическая, лежит наискосок, блик и тень
  const p0=cam.P(40,-.8,34),p1=cam.P(28,-.8,56),pk=p0[3];c.save();c.translate(p0[0],p0[1]);c.rotate(Math.atan2(p1[1]-p0[1],p1[0]-p0[0]));const L=Math.hypot(p1[0]-p0[0],p1[1]-p0[1]);
  c.fillStyle='rgba(0,0,0,.45)';c.filter='blur(6px)';c.fillRect(6,8,L,10);c.filter='none';
  c.fillStyle=LG(c,0,-8,0,8,[[0,'#1a1a1e'],[.35,'#5a5c62'],[.5,'#e9ecf0'],[.65,'#3a3c42'],[1,'#0c0c0f']]);RR(c,0,-7,L,14,7);c.fill();
  c.fillStyle=LG(c,0,-8,0,8,[[0,'#6a4e12'],[.5,'#ffe08a'],[1,'#5a420e']]);c.fillRect(L*.62,-7.5,L*.06,15);c.beginPath();c.moveTo(0,-7);c.lineTo(-L*.12,0);c.lineTo(0,7);c.closePath();c.fill();c.restore();
  // лампа: тёплое пятно, всё остальное в тени
  c.save();reset(c);c.globalCompositeOperation='multiply';c.fillStyle=RG(c,560,820,120,1250,[[0,'rgba(255,255,255,1)'],[.6,'rgba(120,100,90,1)'],[1,'rgba(20,16,14,1)']]);c.fillRect(0,0,WW,HH);c.restore();
  glowDot(c,620,600,700,'#ffcf8a',.18);
  dof(c,{px:12,top:.9,m0:.2,m1:.72,bot:.8});
  punch(c,1.1,1.05);fin11(c,0,{warm:'#ffb46a',cool:'#2a2f4a',ga:.16,vig:.65});lightBloom(c,.2);
};

/* ================= СУМКА ДОЛЛАРОВ ================= */
// открытая чёрная спортивная сумка на полу машины / номера, внутри пачки сотенных в горчичных банковских лентах, свет сверху.
function billTex(){return cache('bill',300,128,(x,w,h)=>{x.fillStyle='#c9cfbf';x.fillRect(0,0,w,h);x.fillStyle='#9fae95';x.fillRect(8,8,w-16,h-16);x.fillStyle='#dfe3d4';x.fillRect(14,14,w-28,h-28);
  x.fillStyle='#7d8f76';x.beginPath();x.ellipse(w*.5,h*.5,34,42,0,0,TAU);x.fill();x.fillStyle='#b8c2ab';x.beginPath();x.ellipse(w*.5,h*.5,26,34,0,0,TAU);x.fill();
  x.fillStyle='#3d5a3a';x.font='800 30px Osw';x.fillText('100',18,46);x.fillText('100',w-72,h-18);x.fillStyle='rgba(60,90,60,.35)';for(let i=0;i<20;i++)x.fillRect(20+i*12,h-30,6,2);});}
P11.bag=(c,t,o={})=>{c.fillStyle='#0a090b';c.fillRect(0,0,WW,HH);
  // пол номера: тёмный паркет в перспективе
  const cam=C3([0,-160,-60],[0,0,140],1200);const wood=cache('wood',800,800,(x,w,h)=>{x.fillStyle='#2a170c';x.fillRect(0,0,w,h);for(let i=0;i<260;i++){x.strokeStyle=`rgba(${80+40*H1(i)},${45+20*H1(i*3)},20,${.25*H1(i*7)})`;x.lineWidth=1+H1(i*5)*3;x.beginPath();const y=H1(i*9.1)*h;x.moveTo(0,y);x.bezierCurveTo(w*.3,y+20*(H1(i)-.5),w*.6,y-30*(H1(i*2)-.5),w,y+10*(H1(i*4)-.5));x.stroke();}});
  texPlane(c,cam,wood,[-300,0,-20],[600,0,0],[0,0,500],10,10);
  // сумка-дафл: капсула в 3/4, нейлон с бликом, торец эллипсом
  const cx=540,cy=1080,L=820,Hh=360,rot=-.08;c.save();c.translate(cx,cy);c.rotate(rot);
  c.save();c.filter='blur(30px)';c.fillStyle='rgba(0,0,0,.8)';c.beginPath();c.ellipse(30,Hh*.52,L*.56,70,0,0,TAU);c.fill();c.restore();
  const body=new Path2D();body.moveTo(-L/2+Hh*.35,-Hh/2);body.lineTo(L/2-Hh*.3,-Hh/2+10);body.bezierCurveTo(L/2+20,-Hh/2+20,L/2+30,Hh/2-20,L/2-Hh*.3,Hh/2);body.lineTo(-L/2+Hh*.35,Hh/2);body.bezierCurveTo(-L/2-30,Hh/2-10,-L/2-30,-Hh/2+10,-L/2+Hh*.35,-Hh/2);body.closePath();
  c.fillStyle=LG(c,0,-Hh/2,0,Hh/2,[[0,'#3a3b43'],[.18,'#1c1d22'],[.6,'#0b0b0e'],[1,'#040405']]);c.fill(body);
  c.save();c.clip(body);c.globalCompositeOperation='screen';c.fillStyle=LG(c,-L/2,0,L/2,0,[[0,'rgba(255,255,255,0)'],[.3,'rgba(255,240,220,.12)'],[.36,'rgba(255,240,220,.02)'],[1,'rgba(255,255,255,0)']]);c.fillRect(-L,-Hh,2*L,2*Hh);
  // складки нейлона
  c.globalCompositeOperation='source-over';c.strokeStyle='rgba(0,0,0,.3)';c.lineWidth=3;for(let i=0;i<7;i++){const x=-L*.35+i*L*.11;c.beginPath();c.moveTo(x,-Hh*.2);c.quadraticCurveTo(x+30,Hh*.1,x-10,Hh*.45);c.stroke();}
  c.strokeStyle='rgba(255,255,255,.06)';c.lineWidth=3;for(let i=0;i<7;i++){const x=-L*.35+i*L*.11+6;c.beginPath();c.moveTo(x,-Hh*.2);c.quadraticCurveTo(x+30,Hh*.1,x-4,Hh*.45);c.stroke();}c.restore();
  // правый торец
  c.fillStyle=LG(c,L/2-Hh*.4,0,L/2+30,0,[[0,'#121216'],[1,'#2e2f36']]);c.beginPath();c.ellipse(L/2-Hh*.3,0,Hh*.28,Hh*.5,0,-Math.PI/2,Math.PI/2);c.fill();
  // проём молнии сверху: тёмная щель, внутри пачки
  const op=new Path2D();op.ellipse(-20,-Hh*.42,L*.36,Hh*.2,0,0,TAU);c.fillStyle='#020203';c.fill(op);
  c.save();c.clip(op);const bt=billTex();
  for(let j=0;j<2;j++)for(let i=0;i<8;i++){const x=-L*.33+i*L*.085+j*20,y=-Hh*.47+j*Hh*.11,w=118,hh=46;c.save();c.translate(x,y);c.rotate((H1(i+j*9)-.5)*.25);
    c.fillStyle='#9aa48e';c.fillRect(-w/2,0,w,hh*.5);c.drawImage(bt,-w/2,-hh/2,w,hh);c.fillStyle='#d6a73c';c.fillRect(-12,-hh/2,24,hh);c.fillStyle='rgba(0,0,0,.25)';c.fillRect(-w/2,hh/2-4,w,4);c.restore();}
  c.fillStyle=LG(c,0,-Hh*.62,0,-Hh*.22,[[0,'rgba(0,0,0,0)'],[1,'rgba(0,0,0,.65)']]);c.fillRect(-L,-Hh,2*L,Hh);c.restore();
  // зубцы молнии по краю проёма
  c.fillStyle='#8a8c92';for(let i=0;i<80;i++){const a=i/80*TAU,x=-20+Math.cos(a)*L*.36,y=-Hh*.42+Math.sin(a)*Hh*.2;c.fillRect(x-2,y-2,4,4);}
  c.fillStyle=LG(c,L*.18,0,L*.24,0,[[0,'#6a6b70'],[.5,'#f2f3f6'],[1,'#55565b']]);RR(c,L*.18,-Hh*.46,50,22,5);c.fill();
  // ручки
  for(const sd of [-1,1]){c.strokeStyle='#0c0c0f';c.lineWidth=26;c.lineCap='round';c.beginPath();c.moveTo(sd*L*.18-40,-Hh*.32);c.bezierCurveTo(sd*L*.18-50,-Hh*1.1,sd*L*.18+50,-Hh*1.1,sd*L*.18+40,-Hh*.32);c.stroke();
    c.strokeStyle='rgba(255,255,255,.12)';c.lineWidth=3;c.beginPath();c.moveTo(sd*L*.18-36,-Hh*.4);c.bezierCurveTo(sd*L*.18-44,-Hh*1.02,sd*L*.18+44,-Hh*1.02,sd*L*.18+36,-Hh*.4);c.stroke();}
  c.restore();
  // свет лампы сверху
  c.save();reset(c);c.globalCompositeOperation='multiply';c.fillStyle=RG(c,560,980,200,1250,[[0,'rgba(255,255,255,1)'],[.7,'rgba(120,112,105,1)'],[1,'rgba(22,20,20,1)']]);c.fillRect(0,0,WW,HH);c.restore();
  glowDot(c,560,820,500,'#ffe2b0',.15);
  punch(c,1.1,1.05);fin11(c,0,{warm:'#ffc27a',cool:'#1b2b3b',ga:.14,vig:.7});lightBloom(c,.2);
};

/* ================= ЗЕРКАЛО: Макс в туалете клуба ================= */
P11.mir=(c,t,o={})=>{c.fillStyle='#07060a';c.fillRect(0,0,WW,HH);
  // в зеркале: туалет за спиной — кабинки, розовый свет, Макс
  const M={x:150,y:260,w:780,h:1120};c.save();c.beginPath();c.rect(M.x,M.y,M.w,M.h);c.clip();
  P11.wc(c,t,{u:0});
  c.fillStyle='rgba(6,5,8,.35)';c.fillRect(0,0,WW,HH);
  if(typeof personA==='function')personA(c,{f:'max',x:540,y:820,s:1.55,L:-1,light:'#ffc27a',la:.32,e:o.maxE||'smirk',cloth:{k:'suit',jacket:'#1c1e25',shirt:'#e9e6e0',tie:null},sw:128,bt:520});
  c.globalCompositeOperation='screen';c.fillStyle=LG(c,M.x,M.y,M.x+M.w,M.y+M.h,[[0,'rgba(255,255,255,0)'],[.38,'rgba(255,245,235,.10)'],[.42,'rgba(255,245,235,.02)'],[1,'rgba(255,255,255,0)']]);c.fillRect(0,0,WW,HH);c.restore();
  // рама из латуни
  c.strokeStyle=LG(c,M.x,0,M.x+M.w,0,[[0,'#6a4e1c'],[.5,'#f1d48c'],[1,'#5a3f14']]);c.lineWidth=18;c.strokeRect(M.x-9,M.y-9,M.w+18,M.h+18);
  // стена вокруг — чёрный мрамор
  c.save();c.beginPath();c.rect(0,0,WW,HH);c.rect(M.x-18,M.y-18,M.w+36,M.h+36);c.clip('evenodd');c.fillStyle=LG(c,0,0,WW,HH,[[0,'#141016'],[1,'#07060a']]);c.fillRect(0,0,WW,HH);
  c.strokeStyle='rgba(255,255,255,.06)';c.lineWidth=2;for(let i=0;i<14;i++){c.beginPath();c.moveTo(H1(i)*WW,0);c.bezierCurveTo(H1(i*3)*WW,500,H1(i*5)*WW,1200,H1(i*7)*WW,HH);c.stroke();}c.restore();
  // лампа над зеркалом
  c.fillStyle='#fff3dc';RR(c,260,178,560,18,9);c.fill();glowDot(c,540,187,520,'#ffbf70',.55);
  // столешница и кран на переднем плане (размыто)
  blurred(c,12,g=>{g.fillStyle=LG(g,0,1620,0,HH,[[0,'#8a8279'],[1,'#3a3530']]);g.fillRect(0,1620,WW,HH-1620);g.fillStyle='#2a2c31';g.fillRect(500,1440,34,190);g.fillRect(500,1440,150,30);g.fillStyle='#eef1f6';g.fillRect(507,1446,8,170);g.fillRect(510,1448,130,7);});
  punch(c,1.1,1.08);fin11(c,0,{warm:'#ff9a6a',cool:'#2a1b3b',ga:.14,vig:.7});lightBloom(c,.28);
};

/* ================= общие предметы ================= */
function woodTex(){return cache('wood',800,800,(x,w,h)=>{x.fillStyle='#2a170c';x.fillRect(0,0,w,h);for(let i=0;i<260;i++){x.strokeStyle=`rgba(${80+40*H1(i)},${45+20*H1(i*3)},20,${.25*H1(i*7)})`;x.lineWidth=1+H1(i*5)*3;x.beginPath();const y=H1(i*9.1)*h;x.moveTo(0,y);x.bezierCurveTo(w*.3,y+20*(H1(i)-.5),w*.6,y-30*(H1(i*2)-.5),w,y+10*(H1(i*4)-.5));x.stroke();}});}
// фон-кэш: место, нарисованное один раз и размытое (для портретов на глубине резкости)
const BGC={};function bgBlur(key,fn,px=18){if(!BGC[key]){const cv=mkc(WW,HH),g=cv.getContext('2d');fn(g);const cv2=mkc(WW,HH),g2=cv2.getContext('2d');g2.filter=`blur(${px}px)`;g2.drawImage(cv,0,0);BGC[key]=cv2;}return BGC[key];}
function lampMul(c,x,y,r0,r1,dark='rgba(18,16,16,1)'){c.save();reset(c);c.globalCompositeOperation='multiply';c.fillStyle=RG(c,x,y,r0,r1,[[0,'rgba(255,255,255,1)'],[.65,'rgba(120,112,108,1)'],[1,dark]]);c.fillRect(0,0,WW,HH);c.restore();}

/* ================= МАКЕТ ПОСЁЛКА «Рай миллионеров» ================= */
// макет на столе переговорной: зелёное основание, дороги петлёй, пруд, домики с красными крышами, деревья, табличка.
P11.maq=(c,t,o={})=>{const u=o.u??0,E=o.E||[lp(-30,10,u),lp(-70,-60,u),lp(-10,10,u)],cam=C3(E,o.T||[0,-8,120],o.f||1350,o.roll||0);
  c.drawImage(bgBlur('meetbg',g=>{P11.meet(g,0,{})},26),0,0);c.fillStyle='rgba(20,14,10,.25)';c.fillRect(0,0,WW,HH);
  // основание
  const base=[-70,70,0,-5,55,185];box3(c,cam,base,{top:'#6f9a5c',front:'#efece4',left:'#d9d5cb',right:'#d9d5cb'});
  const gq=pj(cam,[[-70,-5,55],[70,-5,55],[70,-5,185],[-70,-5,185]]);
  if(gq){c.save();PP(c,gq);c.clip();for(let i=0;i<400;i++){const p=cam.P(-70+140*H1(i*3.1),-5,55+130*H1(i*7.3));c.fillStyle=`rgba(${60+40*H1(i)},${110+40*H1(i*5)},60,.5)`;c.fillRect(p[0],p[1],2*p[3],1.2*p[3]);}c.restore();}
  // дорога-петля и пруд
  const loop=(r,y)=>{const P=[];for(let i=0;i<=48;i++){const a=i/48*TAU;P.push(cam.P(Math.cos(a)*r*1.25,y,120+Math.sin(a)*r));}return P;};
  c.fillStyle='#d8cfbf';PP(c,loop(44,-5.1));c.fill();c.fillStyle='#6f9a5c';PP(c,loop(37,-5.15));c.fill();
  const pond=[];for(let i=0;i<=40;i++){const a=i/40*TAU;pond.push(cam.P(Math.cos(a)*14,-5.2,120+Math.sin(a)*9));}c.fillStyle='#5aa0c8';PP(c,pond);c.fill();c.save();c.globalCompositeOperation='screen';c.fillStyle='rgba(255,255,255,.35)';PP(c,pond);c.fill();c.restore();
  // домики: короб + двускатная крыша, от дальних к ближним
  const H=[];for(let j=0;j<4;j++)for(let i=0;i<6;i++){const a=(i+j*6)/24*TAU,r=lp(52,60,H1(i+j))*(j%2?1:.78),x=Math.cos(a)*r*1.25,z=120+Math.sin(a)*r*.9;if(Math.abs(x)>64||z<62||z>178)continue;H.push([x,z]);}
  for(const [x,z] of [[-22,96],[22,96],[-24,146],[24,146],[0,160]])H.push([x,z]);
  H.sort((a,b)=>b[1]-a[1]);
  for(const [x,z] of H){const w=4.2,hb=4.5;box3(c,cam,[x-w,x+w,-5,-5-hb,z-w,z+w],{front:'#f3f1ea',left:'#d9d6cc',right:'#e6e3da',top:'#f3f1ea'});
    const y0=-5-hb,y1=y0-3.6;fq(c,cam,[[x-w-.6,y0,z-w-.6],[x,y1,z-w-.6],[x,y1,z+w+.6],[x-w-.6,y0,z+w+.6]],'#b8402f');fq(c,cam,[[x+w+.6,y0,z-w-.6],[x,y1,z-w-.6],[x,y1,z+w+.6],[x+w+.6,y0,z+w+.6]],'#d65a43');
    fq(c,cam,[[x-w,y0,z-w],[x+w,y0,z-w],[x,y1,z-w]],'#e9e6dd');const wq=pj(cam,[[x-1.5,-7,z-w-.05],[x+1.5,-7,z-w-.05],[x+1.5,-9,z-w-.05],[x-1.5,-9,z-w-.05]]);if(wq){PP(c,wq);c.fillStyle='#5b7da0';c.fill();}}
  // деревья
  for(let i=0;i<22;i++){const x=-66+132*H1(i*4.3),z=58+124*H1(i*8.1);if(Math.hypot(x/1.25,z-120)<40)continue;const p=cam.P(x,-9,z),r=3.2*p[3];c.fillStyle='#3e6b35';c.beginPath();c.arc(p[0],p[1],r,0,TAU);c.fill();c.fillStyle='rgba(160,210,120,.6)';c.beginPath();c.arc(p[0]-r*.3,p[1]-r*.3,r*.5,0,TAU);c.fill();}
  // табличка на стойках
  const s0=cam.P(-22,-5,60),s1=cam.P(22,-16,60);c.strokeStyle='#6a5a48';c.lineWidth=1.2*s0[3];for(const x of [-18,18]){ln3(c,cam,[x,-5,60],[x,-12,60],'#5a4a38',1.2);}
  const sq=fq(c,cam,[[-27,-11,59.9],[27,-11,59.9],[27,-18,59.9],[-27,-18,59.9]],'#1f2a44');if(sq){const p=cam.P(0,-14.5,59.9);tx(c,'РАЙ МИЛЛИОНЕРОВ',p[0],p[1]+2.2*p[3],{f:'M',w:800,s:3.0*p[3],c:'#f2d48a',ls:.2*p[3]});}
  // свет из окна: мягкий блик и тени
  glowDot(c,900,300,900,'#fff4e0',.25);
  dof(c,{px:10,top:.7,m0:.25,m1:.8,bot:.6});punch(c,1.06,1.04);lightBloom(c,.22);
};

/* ================= СТОЛ: пропуск и справка о доходах ================= */
function passTex(){return cache('pass',540,340,(x,w,h)=>{x.fillStyle=LG(x,0,0,w,h,[[0,'#f6f7f9'],[1,'#dfe3ea']]);x.fillRect(0,0,w,h);x.fillStyle='#1f2a44';x.fillRect(0,0,w,70);
  x.fillStyle='#f2d48a';x.font='800 34px Man';x.letterSpacing='5px';x.fillText('МЕГАПОЛИС',26,47);x.letterSpacing='0px';x.fillStyle='#b3262d';x.fillRect(0,70,w,5);
  x.fillStyle='#c9cfd8';x.fillRect(26,96,150,190);if(typeof headA==='function'){x.save();x.beginPath();x.rect(26,96,150,190);x.clip();x.fillStyle='#9fb0c4';x.fillRect(26,96,150,190);bodyA(x,{f:'max',x:101,y:215,s:.52,cloth:{k:'suit',jacket:'#22252d',shirt:'#eef0f2',tie:'#6a1f2a'},sw:118,bt:420});headA(x,{f:'max',x:101,y:215,s:.52,e:'neutral'});x.restore();}
  x.fillStyle='#16181d';x.font='800 30px Man';x.fillText('АНДРЕЕВ',200,140);x.font='600 26px Man';x.fillText('Максим',200,174);x.font='500 19px Man';x.fillStyle='#4a5160';x.fillText('Кредитный отдел',200,214);x.fillText('Пропуск № 0291',200,244);
  x.fillStyle=LG(x,400,250,470,300,[[0,'#b8913f'],[.5,'#ffe7a8'],[1,'#8a6a24']]);x.fillRect(430,250,70,52);x.strokeStyle='rgba(80,60,20,.6)';x.lineWidth=2;x.strokeRect(430,250,70,52);x.beginPath();x.moveTo(465,250);x.lineTo(465,302);x.moveTo(430,276);x.lineTo(500,276);x.stroke();});}
function incomeTex(){return cache('income',900,1270,(x,w,h)=>{x.fillStyle=LG(x,0,0,w,h,[[0,'#f7f4ec'],[1,'#ebe5d6']]);x.fillRect(0,0,w,h);
  x.fillStyle='#1f2a44';x.font='800 40px Man';x.letterSpacing='6px';x.fillText('МЕГАПОЛИС',70,100);x.letterSpacing='0px';x.fillStyle='#b3262d';x.fillRect(70,124,760,3);
  x.fillStyle='#16181d';x.font='700 32px Man';x.fillText('СПРАВКА О ДОХОДАХ',70,210);x.font='500 21px Man';x.fillStyle='#3a3e46';x.fillText('физического лица за 2011 год',70,246);
  const R=[['Сотрудник','Андреев Максим'],['Подразделение','Кредитный отдел'],['Должность','Ведущий специалист'],['Стаж в банке','5 лет']];R.forEach(([a,b],i)=>{x.font='500 22px Man';x.fillStyle='#6a6e78';x.fillText(a,70,330+i*52);x.fillStyle='#16181d';x.font='600 24px Man';x.fillText(b,380,330+i*52);});
  x.strokeStyle='#cfc8b8';x.lineWidth=1.2;for(let i=0;i<4;i++){x.beginPath();x.moveTo(70,346+i*52);x.lineTo(830,346+i*52);x.stroke();}
  x.font='700 26px Man';x.fillStyle='#16181d';x.fillText('Сумма дохода за год:',70,620);x.font='800 64px Man';x.fillStyle='#14246b';x.fillText('?00 000 €',70,700);
  x.font='400 18px Man';x.fillStyle='#8a8e98';for(let r=0;r<9;r++){x.fillRect(70,800+r*30,r%4===3?380:720,2);}
  x.save();x.translate(700,1110);x.rotate(.15);x.strokeStyle='rgba(40,60,150,.75)';x.lineWidth=5;x.beginPath();x.arc(0,0,80,0,TAU);x.stroke();x.fillStyle='rgba(40,60,150,.75)';x.font='700 16px Man';x.textAlign='center';x.fillText('МЕГАПОЛИС',0,6);x.restore();});}
P11.desk=(c,t,o={})=>{const u=o.u??0,E=o.E||[lp(10,0,u),lp(-90,-80,u),-10],cam=C3(E,o.T||[0,0,62],o.f||1600,o.roll??-.03);
  c.fillStyle='#120b07';c.fillRect(0,0,WW,HH);texPlane(c,cam,woodTex(),[-200,0,-20],[400,0,0],[0,0,260],10,10);
  // справка: лист под углом
  const O=[-36,-.2,30],U=[60,0,-6],V=[8,0,85],sh=pj(cam,[[O[0]+3,0,O[2]+3],[O[0]+U[0]+3,0,O[2]+U[2]+3],[O[0]+U[0]+V[0]+3,0,O[2]+U[2]+V[2]+3],[O[0]+V[0]+3,0,O[2]+V[2]+3]]);
  c.save();c.filter='blur(14px)';c.fillStyle='rgba(0,0,0,.6)';PP(c,sh);c.fill();c.restore();
  texPlane(c,cam,incomeTex(),[O[0]+V[0],O[1],O[2]+V[2]],U,[-V[0],0,-V[2]],12,16);
  // жёлтый маркер по сумме дохода
  const mk=o.mark??0;if(mk>0){const y0=.505,y1=.56,a=(f,g)=>[O[0]+V[0]*(1-g)+U[0]*f,-.3,O[2]+V[2]*(1-g)+U[2]*f];const q=pj(cam,[a(.07,y0),a(.07+.55*mk,y0),a(.07+.55*mk,y1),a(.07,y1)]);
    if(q){c.save();c.globalCompositeOperation='multiply';PP(c,q);c.fillStyle='rgba(255,226,60,.85)';c.fill();c.restore();}}
  // пропуск на шнурке поверх справки
  const P0=[8,-.6,22];const ps=[[P0[0]+2,0,P0[2]+2],[P0[0]+36,0,P0[2]+2],[P0[0]+36,0,P0[2]+24],[P0[0]+2,0,P0[2]+24]];c.save();c.filter='blur(8px)';c.fillStyle='rgba(0,0,0,.55)';PP(c,pj(cam,ps));c.fill();c.restore();
  texPlane(c,cam,passTex(),[P0[0],P0[1],P0[2]+22],[34,0,0],[0,0,-22],6,4);
  const lq=cam.P(P0[0]+17,-.7,P0[2]+22.5);c.strokeStyle='#a0212b';c.lineWidth=5*lq[3]*.4;c.beginPath();c.moveTo(lq[0],lq[1]);const l2=cam.P(P0[0]+8,-.7,P0[2]+60),l3=cam.P(P0[0]+40,-.7,P0[2]+75);c.bezierCurveTo(l2[0],l2[1],l3[0],l3[1],l3[0]+200,l3[1]-60);c.stroke();
  lampMul(c,600,900,140,1250);glowDot(c,620,640,700,'#ffcf8a',.16);
  dof(c,{px:12,top:.9,m0:.22,m1:.75,bot:.8});punch(c,1.1,1.05);lightBloom(c,.2);
};

/* ================= ЛИФТ: «вниз» ================= */
P11.lift=(c,t,o={})=>{const k=o.k??0,op=o.open??0,E=o.E||[0,-165,10],cam=C3(E,o.T||[0,-150,200],o.f||980);
  c.fillStyle='#0c0d10';c.fillRect(0,0,WW,HH);
  // за дверями — ночная улица (видна, когда открываются)
  if(op>0){const q=pj(cam,[[-60,0,180],[60,0,180],[60,-220,180],[-60,-220,180]]);if(q){c.save();PP(c,q);c.clip();c.drawImage(bgBlur('tverbg',g=>P11.tver(g,0,{}),10),0,0);c.restore();}}
  const steel=z=>s3(m3(h3('#3a3d44'),h3('#9aa0a8'),.25+.4*Math.exp(-(((z-90)/80)**2))));
  corridor(c,cam,{z0:15,z1:180,n:30,xl:-100,xr:100,h:260,wallL:steel,wallR:steel,ceil:()=>'#16181c',floor:z=>s3(m3(h3('#141518'),h3('#3a3b40'),.3))});
  // шлифовка стали: вертикальные полосы
  c.save();c.globalAlpha=.18;for(let i=0;i<60;i++){const z=15+165*H1(i*3.3);ln3(c,cam,[-99.5,-2,z],[-99.5,-258,z],H1(i)>.5?'#ffffff':'#000000',.8);ln3(c,cam,[99.5,-2,z],[99.5,-258,z],H1(i*5)>.5?'#ffffff':'#000000',.8);}c.restore();
  // двери: две створки разъезжаются
  const dx=op*58;fq(c,cam,[[-60-dx,0,179],[0-dx,0,179],[0-dx,-220,179],[-60-dx,-220,179]],'#7d838c');fq(c,cam,[[0+dx,0,179],[60+dx,0,179],[60+dx,-220,179],[0+dx,-220,179]],'#8a9099');
  ln3(c,cam,[-dx,0,178.5],[-dx,-220,178.5],'#2a2d33',2);ln3(c,cam,[dx,0,178.5],[dx,-220,178.5],'#2a2d33',2);
  fq(c,cam,[[-100,-220,179.5],[100,-220,179.5],[100,-260,179.5],[-100,-260,179.5]],'#2a2c31');
  // табло этажа: красные цифры, стрелка вниз
  const fl=Math.max(1,Math.round(lp(42,1,k))),dp=cam.P(0,-240,179);c.fillStyle='#070707';c.fillRect(dp[0]-80*dp[3]*.6,dp[1]-24*dp[3]*.6,160*dp[3]*.6,48*dp[3]*.6);
  tx(c,'▼ '+fl,dp[0],dp[1]+10*dp[3]*.6,{f:'J',w:700,s:30*dp[3]*.6,c:'#ff3b30',glow:'#ff2a1a',gb:14});
  // потолочный свет
  for(const z of [50,95,140])fq(c,cam,[[-50,-259,z],[50,-259,z],[50,-259,z+18],[-50,-259,z+18]],'rgba(255,246,230,.95)');glow3(c,cam,[0,-255,95],320,'#fff2dc',.25);
  // отражение света на дверях
  glow3(c,cam,[0,-150,178],260,'#ffffff',.08);
  punch(c,1.08,1.02);lightBloom(c,.25);
};

/* ================= ЮЛЯ: портрет на ночной улице ================= */
P11.yulia=(c,t,o={})=>{c.drawImage(bgBlur('streetbg',g=>P11.tver(g,0,{E:[300,-170,0],T:[-200,-400,9000]}),24),0,0);
  const bb=bokeh('yul',WW,HH,36,['#ffb35c','#ff4aa6','#7ad8ff'],30,110,4,2);c.save();c.globalCompositeOperation='screen';c.globalAlpha=.6;c.drawImage(bb,0,0);c.restore();
  const s=o.s??2.6,cy=o.cy??980;
  if(typeof personA==='function')personA(c,{f:'yulia',x:o.x??540,y:cy,s,L:o.L??1,light:o.light||'#ffc890',la:.32,e:o.e||'neutral',look:o.look||[0,0],cloth:{k:'parka'},sw:122,bt:560});
  // контровой холодный свет с другой стороны
  c.save();c.globalCompositeOperation='screen';c.fillStyle=RG(c,(o.x??540)-420,cy-200,40,700,[[0,'rgba(120,200,255,.22)'],[1,'rgba(120,200,255,0)']]);c.fillRect(0,0,WW,HH);c.restore();
  punch(c,1.06,1.06);lightBloom(c,.25);
};

/* ================= АКЦИЯ: витрина бутика ночью ================= */
// мокрая улица, витрина светится; активисты со спины держат плакат на древках, в воздух летят купюры; потом — мигалки.
function bills3(c,cam,t,n,cx,cz,seed=3,a=1){const bt=billTex();for(let i=0;i<n;i++){const ph=t*.6+H1(i*3.1+seed)*7,x=cx+(H1(i*7.7+seed)-.5)*700+Math.sin(ph*1.3)*40,z=cz+(H1(i*5.3+seed)-.5)*500,y=-420+((t*60+H1(i*9.1+seed)*400)%400);
  const p=cam.P(x,y,z);if(p[2]<=3)continue;const w=16*p[3],h=7*p[3];c.save();c.translate(p[0],p[1]);c.rotate(ph*2+i);c.scale(1,.35+.65*Math.abs(Math.sin(ph*3+i)));c.globalAlpha=a*(1-fogK(z,4000));c.drawImage(bt,-w/2,-h/2,w,h);c.restore();}}
P11.action=(c,t,o={})=>{const E=o.E||[-40,-165,380],cam=C3(E,o.T||[200,-190,1100],o.f||1000,o.roll||0),camz=E[2],FOG=h3('#0a0710'),D=2600,pol=o.pol??0;
  const bl=pol>0?Math.max(0,Math.sin(t*TAU*3.2)):0,rd=pol>0?Math.max(0,Math.sin(t*TAU*3.2+Math.PI)):0;
  c.fillStyle='#06050a';c.fillRect(0,0,WW,HH);
  corridor(c,cam,{z0:60,z1:3200,n:100,xl:-900,xr:420,h:900,
    floor:z=>s3(surf(h3('#050407'),h3('#3a2a26'),.05+.45*Math.exp(-(((z-900)/420)**2)),z,camz,FOG,D)),
    wallR:z=>s3(surf(h3('#0a080c'),h3('#3a2c28'),.05+.4*Math.exp(-(((z-900)/300)**2)),z,camz,FOG,D)),
    wallL:z=>s3(surf(h3('#070609'),h3('#1c171c'),.05,z,camz,FOG,D))});
  // витрина справа: тёплый свет, манекены силуэтами, вывеска
  const vq=fq(c,cam,[[419,-30,600],[419,-30,1250],[419,-330,1250],[419,-330,600]],'#ffdcae');
  if(vq){c.save();PP(c,vq);c.clip();c.fillStyle=LG(c,vq[0][0],0,vq[1][0],0,[[0,'#ffe6c4'],[1,'#ffb978']]);c.fillRect(0,0,WW,HH);
    for(const z of [720,900,1080]){const p=cam.P(419,-30,z);pers3(c,p[0],p[1],150*p[3]*1.1,{col:'rgba(40,30,30,.55)',w:.8});}c.restore();}
  ln3(c,cam,[418,-345,580],[418,-345,1270],'#1a1418',30);const sp=cam.P(418,-345,925);tx(c,'BOUTIQUE',sp[0],sp[1]+8*sp[3],{f:'P',w:700,s:26*sp[3],c:'#f6e3c2',ls:6*sp[3]});
  glow3(c,cam,[380,-180,925],700,'#ffc890',.35);refl3(c,cam,[380,-180,925],520,'#ffc890',.35,3.2);
  // фонари вдоль улицы
  for(const z of [500,1500,2500]){glow3(c,cam,[-650,-500,z],260,'#ffb35c',.45);refl3(c,cam,[-650,-500,z],200,'#ffb35c',.25,3.5);}
  // плакат на двух древках, активисты со спины
  const bz=800,b0=[70,-82,bz-40],b1=[330,-82,bz-70];const bq=pj(cam,[[b0[0],b0[1]-66,b0[2]],[b1[0],b1[1]-66,b1[2]],[b1[0],b1[1],b1[2]],[b0[0],b0[1],b0[2]]]);
  for(const x of [[70,bz-40],[330,bz-70]])ln3(c,cam,[x[0],-60,x[1]],[x[0],-200,x[1]],'#6a5236',3);
  for(const [x,z,h] of [[40,860,172],[200,900,166],[360,850,178]]){const p=cam.P(x,0,z);pers3(c,p[0],p[1],h*p[3],{col:'#0a080c',rim:'#ffc890',ra:.8,sd:1,coat:true,w:1.05});}
  if(bq){PP(c,bq);c.fillStyle='#f4efe4';c.fill();const m=cam.P(200,-115,bz-55);c.save();c.translate(m[0],m[1]);const ang=Math.atan2(bq[1][1]-bq[0][1],bq[1][0]-bq[0][0]);c.rotate(ang);tx(c,'ДЕНЬГИ — ЧЕПУХА',0,12*m[3],{f:'O',w:700,s:30*m[3],c:'#c0182a'});c.restore();}
  bills3(c,cam,t,26,240,800,5,1);
  // мигалки: синие и красные отблески, машина вдали
  if(pol>0){const cp=cam.P(-150,-60,2600);c.fillStyle='#0d0e12';c.fillRect(cp[0]-90*cp[3]*1.4,cp[1]-40*cp[3]*1.4,180*cp[3]*1.4,60*cp[3]*1.4);
    glowDot(c,cp[0]-30*cp[3],cp[1]-50*cp[3],420*cp[3]*3,'#2f6bff',bl*pol);glowDot(c,cp[0]+30*cp[3],cp[1]-50*cp[3],420*cp[3]*3,'#ff2a2a',rd*pol);
    c.save();c.globalCompositeOperation='screen';c.fillStyle=`rgba(47,107,255,${.18*bl*pol})`;c.fillRect(0,0,WW,HH);c.fillStyle=`rgba(255,40,40,${.12*rd*pol})`;c.fillRect(0,0,WW,HH);c.restore();
    refl3(c,cam,[-150,-60,2600],300,'#2f6bff',.5*bl*pol,5);refl3(c,cam,[-120,-60,2600],300,'#ff2a2a',.5*rd*pol,5);}
  rain(c,t,.5,{n:120});haze3(c,cam,1400,-300,.08,'#ffd0a0',8,5,t);
  punch(c,1.12,1.1);lightBloom(c,.32);
};

/* ================= БЕГ: подворотня, мигалки сзади ================= */
function brickTex(){return cache('brick',512,512,(x,w,h)=>{x.fillStyle='#2a1c18';x.fillRect(0,0,w,h);for(let j=0;j<16;j++)for(let i=-1;i<9;i++){const bx=i*64+(j%2)*32,by=j*32;x.fillStyle=`rgb(${70+30*H2(i,j)},${42+16*H2(i+3,j)},${34+10*H2(i,j+5)})`;x.fillRect(bx+2,by+2,60,28);}});}
P11.run=(c,t,o={})=>{const u=o.u??0,bob=Math.sin(t*TAU*2.6),E=o.E||[bob*6,-160+Math.abs(bob)*8,lp(0,600,u)],cam=C3(E,[bob*20,-150,E[2]+1000],o.f||950,Math.sin(t*TAU*1.3)*.03);
  const camz=E[2],FOG=h3('#0a0c14'),D=1800,bl=Math.max(0,Math.sin(t*TAU*3.2)),rd=Math.max(0,Math.sin(t*TAU*3.2+Math.PI));
  c.fillStyle='#050608';c.fillRect(0,0,WW,HH);const LZ=[400,900,1400,1900];const lamp=z=>lampSum(z,LZ,120);
  corridor(c,cam,{z0:camz+60,z1:camz+2400,n:90,xl:-160,xr:160,h:420,floor:z=>s3(surf(h3('#07080a'),h3('#3a3430'),.06+.4*lamp(z),z,camz,FOG,D)),
    ceil:z=>s3(surf(h3('#040506'),h3('#1a1816'),.05,z,camz,FOG,D))});
  for(const sd of [-1,1]){texPlane(c,cam,brickTex(),[sd*160,-420,camz+60],[0,0,2400],[0,420,0],24,4);}
  // свет фонарей и тени по стенам (умножение по глубине)
  c.save();c.globalCompositeOperation='multiply';for(let z=camz+60;z<camz+2400;z+=30){const k=.25+.75*cl(lamp(z)),fz=fogK(z-camz,D),col=s3(m3([255*k,235*k,210*k],h3('#0a0c14'),fz));for(const sd of [-1,1])fq(c,cam,[[sd*160,0,z],[sd*160,0,z+31],[sd*160,-420,z+31],[sd*160,-420,z]],col);}c.restore();
  for(const z of LZ){glow3(c,cam,[0,-400,z],200,'#ffb35c',.6*(1-fogK(z-camz,D)));refl3(c,cam,[0,-400,z],150,'#ffb35c',.3,3);}
  // Юля бежит впереди
  const yz=camz+420,yp=cam.P(-30,0,yz);if(typeof figA==='function')figA(c,{f:'yulia',x:yp[0],y:yp[1],s:yp[3]*.165,cloth:{k:'parka'},pose:'run',t,L:1,light:'#7aa8ff',la:.3});
  // мигалки сзади: синие/красные вспышки по стенам
  c.save();c.globalCompositeOperation='screen';c.fillStyle=LG(c,0,0,WW,0,[[0,`rgba(47,107,255,${.35*bl})`],[.4,'rgba(0,0,0,0)'],[.6,'rgba(0,0,0,0)'],[1,`rgba(255,40,40,${.3*rd})`]]);c.fillRect(0,0,WW,HH);c.restore();
  rain(c,t,.6,{n:140});punch(c,1.12,1.08);lightBloom(c,.3);
};

/* ================= МАШИНА: к детской больнице ================= */
P11.car=(c,t,o={})=>{const k=o.hosp??0,E=[0,-120,0],cam=C3(E,[0,-125,1000],1000,Math.sin(t*.8)*.01),FOG=h3('#0b0f1a'),D=6000,dz=t*900;
  c.fillStyle=LG(c,0,0,0,HH,[[0,'#04060c'],[.5,'#0d1426'],[1,'#05060a']]);c.fillRect(0,0,WW,HH);
  const LZ=[];for(let z=-((dz)%800)+800;z<9000;z+=800)LZ.push(z);
  corridor(c,cam,{z0:60,z1:9000,n:120,xl:-700,xr:700,h:3000,floor:z=>s3(surf(h3('#07080c'),h3('#34343c'),.06+.35*lampSum(z,LZ,160),z,0,FOG,D))});
  for(let z=200-(dz%400);z<8000;z+=400)fq(c,cam,[[-8,-1,z],[8,-1,z],[8,-1,z+180],[-8,-1,z+180]],rgba('#e9e3d0',.6*(1-fogK(z,D))));
  for(const z of LZ){for(const sd of [-1,1]){ln3(c,cam,[sd*650,0,z],[sd*650,-700,z],'#15171c',14);glow3(c,cam,[sd*560,-700,z],260,'#ffb35c',.5*(1-fogK(z,D)));refl3(c,cam,[sd*560,-700,z],160,'#ffb35c',.3*(1-fogK(z,D)),3);}}
  // больница впереди: корпус с окнами и светящейся вывеской, приближается
  const hz=lp(7000,2600,k),hp=cam.P(0,0,hz),hs=hp[3];if(hp[2]>3){const w=2400*hs,h=1300*hs;c.fillStyle='#1b2230';c.fillRect(hp[0]-w/2,hp[1]-h,w,h);
    for(let j=0;j<6;j++)for(let i=0;i<14;i++){const on=H2(i,j)>.4;c.fillStyle=on?'#cfe6ff':'#101622';c.fillRect(hp[0]-w/2+w*(i+.25)/14,hp[1]-h+h*(j+.3)/7,w/14*.5,h/7*.45);}
    const sw=w*.7;c.fillStyle='#08111c';c.fillRect(hp[0]-sw/2,hp[1]-h*1.13,sw,h*.11);tx(c,'ДЕТСКАЯ БОЛЬНИЦА',hp[0],hp[1]-h*1.045,{f:'M',w:800,s:h*.075,c:'#7fe3ff',glow:'#29c8ff',gb:18,ls:h*.006});
    glowDot(c,hp[0],hp[1]-h*1.07,w*.6,'#29c8ff',.25);}
  // встречные фары
  for(let i=0;i<3;i++){const z=((i*2700+dz*1.6)%7000);const zz=7000-z;if(zz<300)continue;for(const sx of [-60,60]){glow3(c,cam,[-380+sx,-80,zz],160,'#fff4dc',.8*(1-fogK(zz,D)));refl3(c,cam,[-380+sx,-80,zz],160,'#fff4dc',.3,5);}}
  // салон: стойки, приборная панель, зеркало; капли на стекле
  c.fillStyle='#050507';c.beginPath();c.moveTo(0,0);c.lineTo(210,0);c.lineTo(60,1300);c.lineTo(0,1400);c.closePath();c.fill();c.beginPath();c.moveTo(WW,0);c.lineTo(WW-210,0);c.lineTo(WW-60,1300);c.lineTo(WW,1400);c.closePath();c.fill();
  c.fillStyle=LG(c,0,1330,0,HH,[[0,'#0d0e12'],[1,'#030304']]);c.beginPath();c.moveTo(0,1360);c.quadraticCurveTo(540,1250,WW,1360);c.lineTo(WW,HH);c.lineTo(0,HH);c.closePath();c.fill();
  c.strokeStyle='rgba(255,255,255,.12)';c.lineWidth=3;c.beginPath();c.moveTo(0,1362);c.quadraticCurveTo(540,1252,WW,1362);c.stroke();
  for(let i=0;i<5;i++)glowDot(c,700+i*40,1420,10,i%2?'#ff9a3c':'#3fd6ff',.8);
  c.fillStyle='#0b0b0e';RR(c,420,40,240,70,16);c.fill();c.fillStyle='#1d2230';RR(c,432,50,216,50,10);c.fill();
  c.save();c.globalCompositeOperation='screen';for(let i=0;i<90;i++){const x=H1(i*3.3)*WW,y=H1(i*7.7)*1300,r=3+H1(i)*9;c.fillStyle=`rgba(200,220,255,${.12+.15*H1(i*5)})`;c.beginPath();c.ellipse(x,y,r*.7,r,0,0,TAU);c.fill();}c.restore();
  punch(c,1.1,1.08);lightBloom(c,.32);
};

/* ================= КОСТЮМ КЛОУНА: коридор больницы, вешалка на колёсах ================= */
P11.costume=(c,t,o={})=>{const k=o.k??0;P11.hosp(c,t,{E:[lp(-10,10,k),-160,lp(0,120,k)],T:[40,-150,900]});
  const cam=C3([lp(-10,10,k),-160,lp(0,120,k)],[40,-150,900],1000);
  // вешалка: стойки, перекладина, плечики, костюм в горох с жабо
  const z=lp(330,330,k),x0=-40,x1=70;for(const x of [x0,x1]){ln3(c,cam,[x,0,z],[x,-180,z],'#9aa3a8',5);glow3(c,cam,[x,-2,z],10,'#333',.6);}ln3(c,cam,[x0,-180,z],[x1,-180,z],'#b8c0c6',5);
  const hp=cam.P(15,-178,z),q=hp[3];c.save();c.translate(hp[0],hp[1]);c.strokeStyle='#6a5a44';c.lineWidth=2*q;c.beginPath();c.moveTo(0,0);c.lineTo(0,6*q);c.moveTo(-22*q,14*q);c.lineTo(0,6*q);c.lineTo(22*q,14*q);c.stroke();
  const P=new Path2D();P.moveTo(-24*q,14*q);P.lineTo(24*q,14*q);P.lineTo(32*q,70*q);P.lineTo(26*q,128*q);P.lineTo(6*q,130*q);P.lineTo(0,90*q);P.lineTo(-6*q,130*q);P.lineTo(-26*q,128*q);P.lineTo(-32*q,70*q);P.closePath();
  c.fillStyle=LG(c,-30*q,0,30*q,0,[[0,'#d9a71c'],[.5,'#f6cf3a'],[1,'#c49214']]);c.fill(P);c.save();c.clip(P);c.fillStyle='#d9372a';for(let yy=18;yy<130;yy+=12)for(let xx=-30+(yy/12%2)*6;xx<32;xx+=12){c.beginPath();c.arc(xx*q,yy*q,2.6*q,0,TAU);c.fill();}
  c.fillStyle=LG(c,-30*q,0,30*q,0,[[0,'rgba(0,0,0,.25)'],[.5,'rgba(0,0,0,0)'],[1,'rgba(0,0,0,.25)']]);c.fillRect(-40*q,0,80*q,140*q);c.restore();
  // жабо
  for(let i=0;i<9;i++){const a=Math.PI*(i/8);c.fillStyle=i%2?'#ffffff':'#7cc4ef';c.beginPath();c.ellipse(Math.cos(a)*-20*q,14*q+Math.sin(a)*2*q,6*q,4*q,a,0,TAU);c.fill();}
  for(const yy of [40,60,80]){c.fillStyle='#e8402f';c.beginPath();c.arc(0,yy*q,3.2*q,0,TAU);c.fill();}c.restore();
  // медсестра рядом
  if(typeof personA==='function'){const np=cam.P(150,-150,420);personA(c,{f:'nurse',x:np[0],y:np[1],s:np[3]/7.2,L:-1,light:'#eaf6ff',la:.2,e:'smile',cloth:{k:'scrub'},sw:118,bt:520});}
  // нос надели: красное пятно снизу кадра (косим глазами)
  const nz=o.nose??0;if(nz>0){c.save();c.globalAlpha=nz;c.filter='blur(26px)';c.fillStyle='#d8261c';c.beginPath();c.ellipse(540,1980,330,260,0,0,TAU);c.fill();c.filter='none';c.fillStyle='rgba(255,180,170,.35)';c.beginPath();c.ellipse(470,1780,90,50,-.3,0,TAU);c.fill();c.restore();}
};

/* ================= БОЛЬНИЧНЫЙ ТУАЛЕТ: Лёша на подоконнике; клоун в зеркале ================= */
function tilesW(c,x,y,w,h,s,base,line){c.fillStyle=base;c.fillRect(x,y,w,h);c.strokeStyle=line;c.lineWidth=2;for(let i=x;i<=x+w;i+=s){c.beginPath();c.moveTo(i,y);c.lineTo(i,y+h);c.stroke();}for(let j=y;j<=y+h;j+=s){c.beginPath();c.moveTo(x,j);c.lineTo(x+w,j);c.stroke();}}
P11.hwc=(c,t,o={})=>{const v=o.view||'lyosha';
  if(v==='mirror'){c.fillStyle='#0e1414';c.fillRect(0,0,WW,HH);const M={x:170,y:250,w:740,h:1080};tilesW(c,0,0,WW,HH,90,'#9fb8b0','rgba(60,80,76,.5)');
    c.save();c.beginPath();c.rect(M.x,M.y,M.w,M.h);c.clip();tilesW(c,0,0,WW,HH,80,'#b9ccc6','rgba(70,90,86,.5)');c.fillStyle='rgba(20,30,30,.25)';c.fillRect(0,0,WW,HH);
      if(typeof personA==='function')personA(c,{f:'clown',x:540,y:780,s:1.55,L:-1,light:'#e9fbff',la:.25,e:o.clE||'sad',cloth:{k:'clown'},sw:128,bt:520});
      c.globalCompositeOperation='screen';c.fillStyle=LG(c,M.x,M.y,M.x+M.w,M.y+M.h,[[0,'rgba(255,255,255,0)'],[.4,'rgba(255,255,255,.12)'],[.44,'rgba(255,255,255,.02)'],[1,'rgba(255,255,255,0)']]);c.fillRect(0,0,WW,HH);c.restore();
    c.strokeStyle='#c9d2d0';c.lineWidth=14;c.strokeRect(M.x-7,M.y-7,M.w+14,M.h+14);c.fillStyle='#f4f8f8';RR(c,300,1420,480,70,30);c.fill();c.fillStyle='#d8e2e2';RR(c,330,1430,420,46,22);c.fill();
    glowDot(c,540,170,600,'#e6fbff',.35);lampMul(c,540,800,200,1300,'rgba(30,40,40,1)');punch(c,1.08,1.02);lightBloom(c,.22);return;}
  const E=[40,-150,240],cam=C3(E,[70,-150,600],1150),FOG=h3('#22302e'),D=1500,camz=240;
  c.fillStyle='#0c1212';c.fillRect(0,0,WW,HH);
  corridor(c,cam,{z0:270,z1:520,n:30,xl:-160,xr:200,h:280,floor:z=>s3(surf(h3('#3a4644'),h3('#aebdb8'),.3,z,camz,FOG,D)),ceil:z=>s3(surf(h3('#2a3432'),h3('#c8d6d2'),.3,z,camz,FOG,D)),
    wallL:z=>s3(surf(h3('#4a6460'),h3('#b9d0c8'),.35,z,camz,FOG,D)),wallR:z=>s3(surf(h3('#4a6460'),h3('#b9d0c8'),.3,z,camz,FOG,D)),end:'#8fa8a0'});
  grid3(c,cam,{plane:'wall',x:-160,y0:0,y1:-280,sy:25,z0:330,z1:520,s:25,camz,D,col:'#2e3e3b',a:.35,w:1.2});grid3(c,cam,{plane:'wall',x:200,y0:0,y1:-280,sy:25,z0:330,z1:520,s:25,camz,D,col:'#2e3e3b',a:.35,w:1.2});
  // окно в конце: ночь, подоконник
  const wq=fq(c,cam,[[-20,-90,519],[150,-90,519],[150,-250,519],[-20,-250,519]],'#0c1a33');if(wq){c.save();PP(c,wq);c.clip();c.fillStyle=LG(c,0,wq[2][1],0,wq[0][1],[[0,'#13284d'],[1,'#07101f']]);c.fillRect(0,0,WW,HH);for(let i=0;i<20;i++)glowDot(c,lp(wq[0][0],wq[1][0],H1(i*3)),lp(wq[2][1],wq[0][1],.6+.4*H1(i*7)),3,'#ffd27a',.8);c.restore();}
  box3(c,cam,[-30,160,-86,-92,470,519],{top:'#e9eeee',front:'#cfd8d8'});
  // Лёша на подоконнике: лысый, худой, в больничной пижаме; дым поднимается от руки снизу кадра
  if(typeof personA==='function'){const lp_=cam.P(70,-150,470),ly={...AX.lyosha,mask:0};personA(c,{f:ly,x:lp_[0],y:lp_[1],s:lp_[3]/7.2,L:1,light:'#e6fbff',la:.25,e:o.lyE||'neutral',cloth:{k:'scrub',col:'#7f9fb8'},sw:100,bt:300});
    const sp=cam.P(115,-105,455);c.save();c.globalCompositeOperation='screen';const S=smokeSprites();for(let i=0;i<7;i++){const yy=sp[1]-i*40-((t*50)%40),r=30+i*14;c.globalAlpha=.18*(1-i/7);c.drawImage(S[i%4],sp[0]-r+Math.sin(t*1.5+i)*18,yy-r,2*r,2*r);}c.restore();}
  // лампа над зеркалом слева, холодный свет
  glow3(c,cam,[-150,-250,200],260,'#e6fbff',.35);lampMul(c,560,900,250,1300,'rgba(30,40,40,1)');punch(c,1.08,1.02);lightBloom(c,.22);
};

/* ================= КАБИНЕТ ШЕФА: карта полигона, подпись, «Вы уволены» ================= */
function mapTex(z){return cache('map'+z,900,1100,(x,w,h)=>{x.fillStyle='#ece3c8';x.fillRect(0,0,w,h);
  for(let i=0;i<9;i++){x.fillStyle=`rgba(${120+40*H1(i)},${150+30*H1(i*3)},${90},.35)`;x.beginPath();x.ellipse(H1(i*5)*w,H1(i*7)*h,120+200*H1(i*9),90+150*H1(i*11),H1(i)*3,0,TAU);x.fill();}
  x.strokeStyle='rgba(120,90,50,.35)';x.lineWidth=1.5;for(let r=40;r<500;r+=34){x.beginPath();x.ellipse(560,520,r,r*.7,.3,0,TAU);x.stroke();}
  x.strokeStyle='#b8a07a';x.lineWidth=10;x.beginPath();x.moveTo(0,820);x.bezierCurveTo(300,760,500,900,w,780);x.stroke();x.strokeStyle='#efe6cc';x.lineWidth=4;x.stroke();
  x.fillStyle='#2b6fb0';x.beginPath();x.ellipse(220,300,90,50,.3,0,TAU);x.fill();
  // участки посёлка
  x.strokeStyle='rgba(60,60,60,.7)';x.lineWidth=1.5;for(let j=0;j<6;j++)for(let i=0;i<7;i++){x.strokeRect(380+i*52,340+j*52,46,46);}
  x.fillStyle='#1f2a44';x.font='800 30px Man';x.fillText('РАЙ МИЛЛИОНЕРОВ',380,320);x.font='500 18px Man';x.fillText('генплан · участки 1–42',380,680);
  x.fillStyle='#22252b';x.font='700 22px JBM';x.fillText('ЛИСТ 3',30,50);x.fillText('М 1:5000',w-180,50);
  // зона полигона: красный пунктир (рисуется на k)
  if(z>0){x.save();x.setLineDash([18,12]);x.strokeStyle='#c8141f';x.lineWidth=7;x.beginPath();x.ellipse(560,500,250*z,200*z,.15,0,TAU*z);x.stroke();x.restore();
    if(z>.8){x.fillStyle='rgba(200,20,31,.12)';x.beginPath();x.ellipse(560,500,250,200,.15,0,TAU);x.fill();x.fillStyle='#c8141f';x.font='800 26px Man';x.fillText('ПОЛИГОН ХИМ. БОЕПРИПАСОВ',330,770);x.font='600 20px Man';x.fillText('1930-е · не рекультивирован',330,800);}}});}
P11.boss=(c,t,o={})=>{const v=o.view||'room';
  if(v==='map'||v==='sig'){const E=v==='map'?[0,-95,-10]:[40,-60,10],cam=C3(E,v==='map'?[0,0,60]:[30,0,70],1600,-.02);c.fillStyle='#100a06';c.fillRect(0,0,WW,HH);texPlane(c,cam,woodTex(),[-200,0,-20],[400,0,0],[0,0,260],10,10);
    if(v==='map'){const zq=Math.round((o.zone??0)*20)/20,O=[-40,-.2,25],U=[80,0,0],V=[0,0,98];c.save();c.filter='blur(14px)';c.fillStyle='rgba(0,0,0,.6)';PP(c,pj(cam,[[O[0]+3,0,O[2]+3],[O[0]+U[0]+3,0,O[2]+3],[O[0]+U[0]+3,0,O[2]+V[2]+3],[O[0]+3,0,O[2]+V[2]+3]]));c.fill();c.restore();
      texPlane(c,cam,mapTex(zq),[O[0],O[1],O[2]+V[2]],U,[0,0,-V[2]],12,14);}
    else{const O=[-33,-.2,20],U=[64,0,4],V=[-6,0,90];texPlane(c,cam,contractTex(1),[O[0],O[1],O[2]+V[2]],[U[0],0,U[2]],[-V[0],0,-V[2]],12,16);
      const ck=o.circle??0;if(ck>0){const p=cam.P(O[0]+V[0]*.05+U[0]*.53,-.5,O[2]+V[2]*.08+U[2]*.5),r=150*p[3]/14;c.save();c.strokeStyle='#d0141f';c.lineWidth=9;c.lineCap='round';c.beginPath();c.ellipse(p[0],p[1],r*2.2,r,-.1,-1,-1+TAU*ck*1.05);c.stroke();c.restore();}}
    lampMul(c,560,900,160,1250);glowDot(c,600,600,700,'#ffd8a0',.15);dof(c,{px:12,top:.9,m0:.2,m1:.75,bot:.8});punch(c,1.1,1.05);lightBloom(c,.2);return;}
  // комната: окно с жалюзи за спиной шефа, полосы света, стол
  c.fillStyle='#120d0a';c.fillRect(0,0,WW,HH);const wx=180,wy=260,ww=720,wh=900;
  c.fillStyle=LG(c,0,wy,0,wy+wh,[[0,'#ffb46a'],[.6,'#d0703a'],[1,'#6a2f18']]);c.fillRect(wx,wy,ww,wh);cityFar(c,wy+wh*.75,{col:'#5a2c1a',seed:6});
  for(let y=wy;y<wy+wh;y+=34){c.fillStyle='rgba(30,16,10,.78)';c.fillRect(wx,y+17,ww,17);}
  c.strokeStyle='#1d140f';c.lineWidth=26;c.strokeRect(wx,wy,ww,wh);
  // полосы света на стене и потолке
  c.save();c.globalCompositeOperation='screen';for(let i=0;i<14;i++){c.fillStyle='rgba(255,170,100,.07)';c.beginPath();c.moveTo(wx+ww,wy+i*64);c.lineTo(WW,wy-120+i*90);c.lineTo(WW,wy-80+i*90);c.lineTo(wx+ww,wy+i*64+30);c.fill();}c.restore();
  // шеф против света
  if(typeof personA==='function')personA(c,{f:'boss',x:540,y:900,s:1.65,L:-1,light:'#ffb46a',la:.4,e:o.bossE||'neutral',cloth:{k:'suit',jacket:'#2f323a',shirt:'#e8eaee',tie:'#6a1f2a'},sw:128,bt:520});
  // стол: тёмное дерево, лампа-банкир с зелёным абажуром, карта, бумаги
  c.fillStyle=LG(c,0,1250,0,HH,[[0,'#3a2214'],[1,'#120a06']]);c.beginPath();c.moveTo(0,1260);c.lineTo(WW,1260);c.lineTo(WW,HH);c.lineTo(0,HH);c.closePath();c.fill();
  c.fillStyle='rgba(255,220,170,.18)';c.fillRect(0,1258,WW,4);
  c.save();c.translate(560,1460);c.rotate(-.08);c.fillStyle='#e3d7b8';c.fillRect(-260,-120,520,300);c.drawImage(mapTex(1),-250,-110,500,280);c.restore();
  c.fillStyle='#1a3d27';c.beginPath();c.moveTo(140,1160);c.lineTo(330,1160);c.lineTo(300,1220);c.lineTo(170,1220);c.closePath();c.fill();c.fillStyle='#c9a24a';c.fillRect(228,1220,14,70);c.fillRect(190,1288,90,10);glowDot(c,235,1240,260,'#fff0c0',.45);
  vignette(c,.5);punch(c,1.1,1.08);lightBloom(c,.3);
};

/* ================= ПУСТОЙ КЛУБ МИШИ ================= */
// бетонный зал: голые стены, провода, одна лампа на проводе качается, пыль в луче, стремянка, Миша с сумками.
P11.empty=(c,t,o={})=>{const v=o.view||'misha',E=o.E||(v==='bag'?[60,-120,120]:[0,-160,240]),cam=C3(E,o.T||(v==='bag'?[120,-20,420]:[20,-150,800]),o.f||(v==='bag'?1400:1250)),camz=E[2],FOG=h3('#14151a'),D=1800;
  c.fillStyle='#0b0b0d';c.fillRect(0,0,WW,HH);const sw=Math.sin(t*1.4)*30,L=[sw,-330,520];const lamp=z=>lampSum(z,[520],200);
  corridor(c,cam,{z0:camz+40,z1:1400,n:70,xl:-500,xr:500,h:450,floor:z=>s3(surf(h3('#121215'),h3('#6a665e'),.08+.5*lamp(z),z,camz,FOG,D)),
    ceil:z=>s3(surf(h3('#0c0c0e'),h3('#3a3834'),.06+.3*lamp(z),z,camz,FOG,D)),wallL:z=>s3(surf(h3('#141417'),h3('#5a564e'),.08+.35*lamp(z),z,camz,FOG,D)),
    wallR:z=>s3(surf(h3('#141417'),h3('#5a564e'),.08+.35*lamp(z),z,camz,FOG,D)),end:'#1e1e22'});
  // пятна бетона и провода
  c.save();c.globalAlpha=.25;for(let i=0;i<40;i++){const z=200+1200*H1(i*3.3),y=-40-400*H1(i*7.7),sd=H1(i)>.5?1:-1;glow3(c,cam,[sd*499,y,z],40+60*H1(i*5),'#000000',.5);}c.restore();
  for(let i=0;i<4;i++){const z0=300+i*250;c.strokeStyle='rgba(10,10,12,.9)';c.lineWidth=3;const a=cam.P(-499,-420,z0),b=cam.P(-499,-300,z0+200),m=cam.P(-499,-330,z0+100);c.beginPath();c.moveTo(a[0],a[1]);c.quadraticCurveTo(m[0],m[1]+20,b[0],b[1]);c.stroke();}
  // лампа на проводе: луч вниз и пыль
  ln3(c,cam,[0,-450,520],L,'#111',2);const lq=glow3(c,cam,L,40,'#fff2d8',.95);if(lq){const f=cam.P(L[0],0,520);beam(c,lq[0],lq[1],-sw*.0012,.9,Math.max(10,f[1]-lq[1]),'#ffe9c4',.55);dust(c,t,lq[0],lq[1],-sw*.0012,.9,f[1]-lq[1],80,7,.8);glowDot(c,lq[0],lq[1],380,'#ffd9a0',.3);}
  // стремянка
  const st=[[-260,0,700],[-200,0,700],[-230,-260,640]];ln3(c,cam,st[0],st[2],'#8a8a86',6);ln3(c,cam,st[1],st[2],'#8a8a86',6);ln3(c,cam,[-260,0,580],st[2],'#6a6a66',5);for(let i=1;i<5;i++)ln3(c,cam,[lp(-260,-230,i/5),-i*52,lp(700,640,i/5)],[lp(-200,-230,i/5),-i*52,lp(700,640,i/5)],'#8a8a86',4);
  // сумки (две дорожные) у ног Миши
  const bag=(x,z)=>{const p=cam.P(x,0,z),q=p[3];c.save();c.translate(p[0],p[1]);c.fillStyle='rgba(0,0,0,.5)';c.beginPath();c.ellipse(0,0,40*q,8*q,0,0,TAU);c.fill();c.fillStyle=LG(c,0,-40*q,0,0,[[0,'#3a3328'],[1,'#17130e']]);RR(c,-36*q,-38*q,72*q,38*q,10*q);c.fill();c.strokeStyle='#0c0a08';c.lineWidth=4*q;c.beginPath();c.moveTo(-14*q,-38*q);c.quadraticCurveTo(0,-56*q,14*q,-38*q);c.stroke();c.restore();};
  bag(70,560);bag(150,600);
  if(v!=='bag'&&typeof personA==='function'){const mp=cam.P(30,-150,620);personA(c,{f:'misha',x:mp[0],y:mp[1],s:mp[3]/7.2,L:Math.sign(sw)||1,light:'#ffd9a0',la:.4,e:o.mishaE||'neutral',cloth:{k:'jacket',col:'#3a3532'},sw:124,bt:520});}
  haze3(c,cam,700,-200,.06,'#d9c8a8',8,3,t);lampMul(c,cam.P(L[0],-120,520)[0],cam.P(L[0],-120,520)[1],120,1300,'rgba(12,12,14,1)');
  punch(c,1.1,1.0);lightBloom(c,.25);
};
/* ================= ВАДИМ орёт: та же пустая коробка, свет жёсткий ================= */
P11.vadim=(c,t,o={})=>{c.drawImage(bgBlur('emptybg',g=>P11.empty(g,0,{view:'bag'}),16),0,0);c.fillStyle='rgba(10,8,8,.35)';c.fillRect(0,0,WW,HH);
  if(typeof personA==='function')personA(c,{f:'vadim',x:540,y:900,s:2.1,L:1,light:'#ffd9a0',la:.4,e:o.e||'shout',cloth:{k:'sweater',col:'#4a5160'},sw:120,bt:560});
  glowDot(c,800,200,700,'#ffd9a0',.18);punch(c,1.1,1.04);lightBloom(c,.2);
};

/* ================= ТЕЛЕФОН: звонок Вадиму, экран гаснет ================= */
function phoneTex(st,off){return cache('ph'+st+'_'+Math.round(off*10),400,820,(x,w,h)=>{x.fillStyle=LG(x,0,0,0,h,[[0,'#1a2233'],[1,'#0a0d14']]);x.fillRect(0,0,w,h);
  x.fillStyle='#e9edf5';x.font='600 22px Man';x.textAlign='center';x.fillText('23:58',w/2,40);
  x.fillStyle='#5a6478';x.beginPath();x.arc(w/2,230,84,0,TAU);x.fill();x.fillStyle='#e9edf5';x.font='700 88px Man';x.fillText('В',w/2,262);
  x.font='700 46px Man';x.fillText('Вадим',w/2,380);x.font='500 24px Man';x.fillStyle=st?'#ff6b6b':'#9aa3b5';x.fillText(st?'не отвечает':'вызов…',w/2,420);
  x.fillStyle='#ff3b30';x.beginPath();x.arc(w/2,700,46,0,TAU);x.fill();x.strokeStyle='#fff';x.lineWidth=7;x.lineCap='round';x.beginPath();x.moveTo(w/2-20,702);x.quadraticCurveTo(w/2,690,w/2+20,702);x.stroke();
  for(let i=0;i<3;i++){x.fillStyle='rgba(255,255,255,.12)';x.beginPath();x.arc(w/2-110+i*110,560,34,0,TAU);x.fill();}
  if(off>0){x.fillStyle=`rgba(0,0,0,${off})`;x.fillRect(0,0,w,h);}});}
P11.phone=(c,t,o={})=>{const st=o.st??0,off=o.off??0,E=[10,-60,0],cam=C3(E,[0,0,60],1500,-.05);
  c.fillStyle='#060709';c.fillRect(0,0,WW,HH);
  // сиденье машины: тёмная кожа, строчка; за окном город в боке
  const leather=cache('leather',600,600,(x,w,h)=>{x.fillStyle='#141416';x.fillRect(0,0,w,h);for(let i=0;i<4000;i++){x.fillStyle=`rgba(255,255,255,${.03*H1(i)})`;x.fillRect(H1(i*3.3)*w,H1(i*7.7)*h,2,2);}x.strokeStyle='rgba(255,255,255,.08)';x.setLineDash([8,8]);x.lineWidth=2;for(let i=1;i<4;i++){x.beginPath();x.moveTo(i*150,0);x.lineTo(i*150,h);x.stroke();}});
  texPlane(c,cam,leather,[-120,0,-20],[240,0,0],[0,0,200],8,8);
  const bb=bokeh('ph',WW,700,30,['#ffb35c','#7ad8ff','#ff4aa6'],30,90,7,2);c.save();c.globalAlpha=.55;c.globalCompositeOperation='screen';c.drawImage(bb,0,0);c.restore();
  // телефон: плита с экраном
  const P={x:0,z:62,w:36,d:74,h:1.6,r:5,a:.12};slabShadow(c,cam,P,18,.7);const T=slab(c,cam,{...P,side0:'#0b0b0d',side1:'#5a5c62',top:phoneTex(st,Math.round(off*10)/10)});sheen(c,T,.3,.18,.9,.15);
  // свет экрана на коже
  const sp=cam.P(0,0,62);glowDot(c,sp[0],sp[1],520,'#8fb4ff',.35*(1-off));
  punch(c,1.08,1.05);lightBloom(c,.3*(1-off)+.05);
};

/* ================= ХЛОПОК ВДАЛИ: ночная Москва, гаснет одно окно ================= */
P11.far=(c,t,o={})=>{const k=o.k??0;c.fillStyle=LG(c,0,0,0,HH,[[0,'#03050b'],[.55,'#0d1530'],[.62,'#2a1c2e'],[1,'#04050a']]);c.fillRect(0,0,WW,HH);
  cityFar(c,1180,{col:'#0a0d18',seed:9});if(typeof moscowCity==='function')moscowCity(c,760,1180,.55,{});stalinka(c,240,1190,.62,'#120f18');
  // дома ближе: окна, одно гаснет
  for(let b=0;b<3;b++){const x0=b*380-40,w=330,h=520+b*60,y0=1500-h;c.fillStyle='#07080e';c.fillRect(x0,y0,w,h+420);for(let j=0;j<18;j++)for(let i=0;i<11;i++){const on=H2(i+b*7,j)>.5;let a=on?1:0;if(b===1&&i===5&&j===7)a=1-cl(k*6);c.fillStyle=a>0?`rgba(255,200,120,${.8*a})`:'#0e1018';c.fillRect(x0+14+i*28,y0+16+j*28,14,16);}}
  // река и отражения
  c.fillStyle=LG(c,0,1500,0,HH,[[0,'#060812'],[1,'#020306']]);c.fillRect(0,1500,WW,HH-1500);for(let i=0;i<40;i++){c.fillStyle=`rgba(255,190,110,${.08*H1(i)})`;c.fillRect(H1(i*3.3)*WW,1520+H1(i*7.7)*360,60+H1(i)*80,3);}
  // вспышка-удар: секундная дрожь света (без вспышки на экране — только тишина и окно)
  rain(c,t,.25,{n:80});punch(c,1.05,1.05);lightBloom(c,.3);
};

/* ================= РЕАНИМАЦИЯ ================= */
P11.icu=(c,t,o={})=>{const lampOn=o.lamp??1,E=[0,-160,0],cam=C3(E,[0,-120,600],1050),FOG=h3('#0b1418'),D=1600,camz=0;
  c.fillStyle='#05080a';c.fillRect(0,0,WW,HH);
  corridor(c,cam,{z0:60,z1:700,n:50,xl:-260,xr:260,h:290,floor:z=>s3(surf(h3('#0a1012'),h3('#5a7a80'),.1+.4*lampSum(z,[430],150)*lampOn,z,camz,FOG,D)),
    ceil:z=>s3(surf(h3('#070b0d'),h3('#3a5058'),.06,z,camz,FOG,D)),wallL:z=>s3(surf(h3('#0b1215'),h3('#5a7880'),.08+.3*lampOn,z,camz,FOG,D)),wallR:z=>s3(surf(h3('#0b1215'),h3('#5a7880'),.08+.25*lampOn,z,camz,FOG,D)),end:'#0e171b'});
  // жалюзи на окне в конце
  const wq=fq(c,cam,[[-120,-90,699],[120,-90,699],[120,-250,699],[-120,-250,699]],'#0b1a2c');if(wq){c.save();PP(c,wq);c.clip();for(let y=wq[2][1];y<wq[0][1];y+=14){c.fillStyle='rgba(120,160,200,.25)';c.fillRect(0,y,WW,6);}c.restore();}
  // кровать: рама, простыня, маленький силуэт под простынёй
  box3(c,cam,[-90,90,-55,-62,330,540],{top:'#c9d6da',front:'#9fb0b6',left:'#8a9aa0',right:'#8a9aa0'});box3(c,cam,[-90,90,0,-55,335,340],{front:'#3a4a50'});
  const bq=pj(cam,[[-60,-63,360],[60,-63,360],[50,-75,470],[-50,-75,470]]);if(bq){PP(c,bq);c.fillStyle='#e6f0f2';c.fill();}
  const pp=cam.P(0,-70,500);c.fillStyle='#f2f6f7';c.beginPath();c.ellipse(pp[0],pp[1],60*pp[3]/2.2,26*pp[3]/2.2,0,0,TAU);c.fill();
  // монитор на стойке: зелёная линия, при «опоздал» — ровная
  ln3(c,cam,[150,0,420],[150,-190,420],'#7a8a90',6);const mq=fq(c,cam,[[110,-190,420],[190,-190,420],[190,-250,420],[110,-250,420]],'#030806');
  if(mq){c.save();PP(c,mq);c.clip();c.strokeStyle='#38ff8a';c.lineWidth=3;c.shadowColor='#38ff8a';c.shadowBlur=10;c.beginPath();const x0=mq[0][0],x1=mq[1][0],ym=(mq[0][1]+mq[2][1])/2;
    for(let x=x0;x<=x1;x+=2){const ph=((x-x0)/(x1-x0)*3+t*1.2)%1,y=lampOn>0&&ph>.45&&ph<.52?ym-40*Math.sin((ph-.45)/.07*Math.PI):ym;x===x0?c.moveTo(x,y):c.lineTo(x,y);}c.stroke();c.restore();
    glow3(c,cam,[150,-220,415],200,'#38ff8a',.25);}
  // капельница
  ln3(c,cam,[-140,0,400],[-140,-230,400],'#8a9aa0',4);fq(c,cam,[[-155,-200,400],[-125,-200,400],[-125,-170,400],[-155,-170,400]],'rgba(200,230,255,.7)');
  glow3(c,cam,[0,-285,430],400,'#cfeaff',.25*lampOn+.05);punch(c,1.1,1.0);lightBloom(c,.25);
};

/* ================= ОТДАЁШЬ ДЕНЬГИ: приёмный покой ================= */
P11.give=(c,t,o={})=>{const k=o.k??0;c.drawImage(bgBlur('hospbg',g=>P11.hosp(g,0,{}),12),0,0);c.fillStyle='rgba(20,30,30,.2)';c.fillRect(0,0,WW,HH);
  if(typeof personA==='function')personA(c,{f:'nurse',x:540,y:880,s:1.9,L:-1,light:'#fff1dc',la:.3,e:o.e||'scared',cloth:{k:'scrub'},sw:118,bt:560});
  // стойка регистратуры
  c.fillStyle=LG(c,0,1250,0,HH,[[0,'#d8dcd6'],[1,'#8f958e']]);c.fillRect(0,1250,WW,HH-1250);c.fillStyle='#f2f4f0';c.fillRect(0,1230,WW,30);c.fillStyle='rgba(0,0,0,.2)';c.fillRect(0,1260,WW,8);
  // сумка на стойке, едет к медсестре
  c.save();c.translate(lp(760,580,eio(k)),1230);c.scale(.55,.55);c.fillStyle='rgba(0,0,0,.4)';c.beginPath();c.ellipse(0,0,330,40,0,0,TAU);c.fill();
  c.fillStyle=LG(c,0,-260,0,0,[[0,'#3a3b43'],[.2,'#1c1d22'],[1,'#050506']]);RR(c,-320,-250,640,250,110);c.fill();c.fillStyle='#020203';c.beginPath();c.ellipse(-10,-245,250,40,0,0,TAU);c.fill();
  const bt=billTex();for(let i=0;i<7;i++){c.save();c.translate(-200+i*62,-262);c.rotate((H1(i)-.5)*.3);c.drawImage(bt,-55,-20,110,40);c.fillStyle='#d6a73c';c.fillRect(-10,-20,20,40);c.restore();}
  c.strokeStyle='#0c0c0f';c.lineWidth=26;c.lineCap='round';c.beginPath();c.moveTo(-160,-240);c.bezierCurveTo(-170,-420,-30,-420,-40,-240);c.stroke();c.restore();
  punch(c,1.06,1.04);lightBloom(c,.2);
};

/* ================= ФИНАЛ: один у окна, красный нос на подоконнике ================= */
P11.alone=(c,t,o={})=>{c.fillStyle='#030406';c.fillRect(0,0,WW,HH);const W0={x:120,y:200,w:840,h:1120};
  c.save();c.beginPath();c.rect(W0.x,W0.y,W0.w,W0.h);c.clip();c.fillStyle=LG(c,0,W0.y,0,W0.y+W0.h,[[0,'#060a16'],[.6,'#121a34'],[1,'#20182a']]);c.fillRect(W0.x,W0.y,W0.w,W0.h);
  cityFar(c,1180,{col:'#0a0d18',seed:4});if(typeof moscowCity==='function')moscowCity(c,600,1240,.55,{});
  // капли на стекле
  c.globalCompositeOperation='screen';for(let i=0;i<160;i++){const x=W0.x+H1(i*3.3)*W0.w,y=W0.y+((H1(i*7.7)*W0.h+t*(20+40*H1(i)))%W0.h),r=2+H1(i*5)*6;c.fillStyle=`rgba(190,210,255,${.15+.2*H1(i*9)})`;c.beginPath();c.ellipse(x,y,r*.7,r,0,0,TAU);c.fill();}c.restore();
  c.strokeStyle='#0a0b0e';c.lineWidth=28;c.strokeRect(W0.x,W0.y,W0.w,W0.h);c.beginPath();c.moveTo(540,W0.y);c.lineTo(540,W0.y+W0.h);c.stroke();
  // подоконник и нос: матовый поролон, мягкий свет из окна
  c.fillStyle=LG(c,0,1320,0,1420,[[0,'#2a2a30'],[1,'#0b0b0d']]);c.fillRect(60,1320,960,90);
  if(o.nose??1){const nx=760,ny=1300;c.fillStyle='rgba(0,0,0,.6)';c.beginPath();c.ellipse(nx+6,ny+22,40,10,0,0,TAU);c.fill();c.fillStyle=RG(c,nx-12,ny-14,4,46,[[0,'#ff5a4a'],[.6,'#c81e1e'],[1,'#5a0606']]);c.beginPath();c.arc(nx,ny,38,0,TAU);c.fill();
    c.fillStyle='rgba(255,255,255,.08)';for(let i=0;i<30;i++){c.fillRect(nx-30+H1(i*3)*60,ny-30+H1(i*7)*60,2,2);}}
  // Макс со спины у окна, против света
  if(typeof manBack==='function')manBack(c,330,1180,1.25,{rim:'#7aa0ff',light:1,suit:'#07080b'});
  glowDot(c,540,700,700,'#3a5aa0',.18);punch(c,1.08,1.05);lightBloom(c,.25);
};
