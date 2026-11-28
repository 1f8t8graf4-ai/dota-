"use strict";
/* «Духless» v8 — «чисто Династия» (28.11, Андрей: «подставь перед собой их ролики и сделай 1в1, как было с версией про вейпы»;
   «цвета — какие нужны именно сцене»; «запрет на 3D»). Образец — их ролик про Александра: плоский вектор, мягкие градиенты,
   солнце/свет за героем, силуэты и повтор (войско, колонны), крупные лица, большие золотые цифры, тяжёлая виньетка, пылинки.
   Кадры: node render.mjs dy12 <сцена> <папка> shots 0 */
const P12={};
const DY_SOLO=Q.get('clip')==='dy12';
if(DY_SOLO)CLIP.draw=(c,t)=>{const k=Q.get('style'),f=P12[k];if(f){f(c,t,{});dyFin(c,t,DYH[k]||['','','',.3]);}};

/* ================= язык Династии: HUD, субтитры, финиш ================= */
// HUD: слева «● дата · место» (место оранжевым), справа год моноширинным; снизу «01 / 07 · глава», шкала с засечками и ромбом, таймкод; уголки
function dyHud(c,t,left,right,ch,k,clock){c.save();c.shadowColor='rgba(0,0,0,.85)';c.shadowBlur=10;
  const [l1,l2]=String(left).split(' · ');c.fillStyle='#ff5a36';c.beginPath();c.arc(66,128,5,0,TAU);c.fill();
  font(c,{f:'J',w:600,s:20,ls:3});c.textAlign='left';c.textBaseline='alphabetic';c.fillStyle='rgba(235,235,235,.82)';c.fillText(l1,82,135);
  if(l2){const w=c.measureText(l1+' · ').width;c.fillStyle='rgba(235,235,235,.5)';c.fillText(' · ',82+c.measureText(l1).width,135);c.fillStyle='#ffa040';c.fillText(l2,82+w,135);}
  tx(c,right,WW-66,140,{f:'J',w:600,s:40,ls:3,al:'right',c:'rgba(245,245,245,.95)'});
  const y=1760;font(c,{f:'J',w:600,s:17,ls:3});c.textAlign='left';c.fillStyle='rgba(235,235,235,.7)';c.fillText(ch,80,y);c.textAlign='right';c.fillStyle='rgba(235,235,235,.45)';c.fillText(clock,WW-80,y);
  c.shadowBlur=0;c.strokeStyle='rgba(255,255,255,.22)';c.lineWidth=2;c.beginPath();c.moveTo(80,y+30);c.lineTo(WW-80,y+30);c.stroke();
  for(let i=0;i<=24;i++){const x=lp(80,WW-80,i/24);c.beginPath();c.moveTo(x,y+30);c.lineTo(x,y+(i%4?24:20));c.stroke();}
  const px=lp(80,WW-80,cl(k));c.strokeStyle='#ff9a2e';c.lineWidth=3;c.beginPath();c.moveTo(80,y+30);c.lineTo(px,y+30);c.stroke();c.fillStyle='#ff9a2e';c.save();c.translate(px,y+30);c.rotate(Math.PI/4);c.fillRect(-6,-6,12,12);c.restore();
  // уголки рамки
  c.strokeStyle='rgba(255,255,255,.28)';c.lineWidth=2;const m=36,L=26;for(const [x,yy,dx,dy] of [[m,m+40,1,1],[WW-m,m+40,-1,1],[m,HH-m,1,-1],[WW-m,HH-m,-1,-1]]){c.beginPath();c.moveTo(x,yy+dy*L);c.lineTo(x,yy);c.lineTo(x+dx*L,yy);c.stroke();}
  c.restore();}
// субтитры: 1–3 слова, сказанные — белые (ключевое — оранжевое с жаром), несказанные — серые
function dySub(c,ws,o={}){c.save();font(c,{f:'O',w:700,s:o.s||98,ls:0});const sp=c.measureText(' ').width*.9;const m=ws.map(w=>c.measureText(w.t).width),tot=m.reduce((a,b)=>a+b,0)+sp*(ws.length-1),sc=Math.min(1,(o.max||940)/tot);
  const y=o.y||1230;c.translate(540,y);c.scale(sc,sc);let x=-tot/2;c.textAlign='left';c.textBaseline='middle';
  for(let i=0;i<ws.length;i++){const w=ws[i];c.shadowColor='rgba(0,0,0,.95)';c.shadowBlur=24;c.shadowOffsetY=4;
    if(!w.on){c.fillStyle='rgba(150,150,150,.38)';c.fillText(w.t,x,0);}
    else if(w.acc){c.fillStyle='#ff8a1e';c.shadowColor='rgba(255,60,0,.65)';c.shadowBlur=30;c.fillText(w.t,x,0);c.shadowColor='rgba(0,0,0,.6)';c.shadowBlur=6;c.fillStyle=LG(c,0,-40,0,40,[[0,'#ffd27a'],[1,'#ff7a12']]);c.fillText(w.t,x,0);}
    else{c.fillStyle='#ffffff';c.fillText(w.t,x,0);}x+=m[i]+sp;}c.restore();}
// пылинки и боке, плавают
function dyDust(c,t,n=40,col='#ffd9a0',seed=1,a=1){c.save();c.globalCompositeOperation='screen';for(let i=0;i<n;i++){const x=(H1(seed+i*3.1)*WW+t*(6+10*H1(i))+Math.sin(t*.4+i)*20)%WW,y=(H1(seed+i*7.3)*HH-t*(8+14*H1(i*5)))%HH,yy=y<0?y+HH:y,r=2+H1(seed+i*1.7)**3*26;
  c.fillStyle=RG(c,x,yy,0,r,[[0,rgba(col,.32*a)],[.5,rgba(col,.12*a)],[1,rgba(col,0)]]);c.fillRect(x-r,yy-r,2*r,2*r);}c.restore();}
// финиш: тяжёлая виньетка сверху/снизу, пылинки, зерно
function dyFin(c,t,h){c.save();reset(c);c.fillStyle=LG(c,0,0,0,HH,[[0,'rgba(5,5,8,.92)'],[.13,'rgba(5,5,8,.35)'],[.3,'rgba(5,5,8,0)'],[.7,'rgba(5,5,8,0)'],[.86,'rgba(5,5,8,.5)'],[1,'rgba(5,5,8,.95)']]);c.fillRect(0,0,WW,HH);
  c.fillStyle=LG(c,0,0,WW,0,[[0,'rgba(5,5,8,.55)'],[.15,'rgba(5,5,8,0)'],[.85,'rgba(5,5,8,0)'],[1,'rgba(5,5,8,.55)']]);c.fillRect(0,0,WW,HH);c.restore();
  if(DY_SOLO){dyHud(c,t,h[0],h[1],h[2],h[3],'00:00:'+String(Math.floor(t)).padStart(2,'0'));if(h[4])dySub(c,h[4]);grain(c,0,.05);}}
const DYH={};

/* ================= рисовальные кирпичи: всё плоское, мягкие градиенты ================= */
const G2=(c,x0,y0,x1,y1,st)=>LG(c,x0,y0,x1,y1,st);
function skyG(c,st,y0=0,y1=HH){c.fillStyle=G2(c,0,y0,0,y1,st);c.fillRect(0,0,WW,HH);}
function sun(c,x,y,r,core='#fff4d0',halo='#ffb050',a=1){c.save();c.globalCompositeOperation='screen';c.globalAlpha=a;c.fillStyle=RG(c,x,y,0,r*7,[[0,rgba(halo,.55)],[.25,rgba(halo,.25)],[1,rgba(halo,0)]]);c.fillRect(x-r*7,y-r*7,r*14,r*14);c.restore();
  c.save();c.globalAlpha=a;c.fillStyle=RG(c,x,y,0,r,[[0,core],[.8,core],[1,rgba(core,0)]]);c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.restore();}
function haze(c,y,h,col,a){c.fillStyle=G2(c,0,y-h,0,y+h,[[0,rgba(col,0)],[.5,rgba(col,a)],[1,rgba(col,0)]]);c.fillRect(0,y-h,WW,2*h);}
function rays2(c,x,y,n,col,a,len=1600,w=.05,rot=0){c.save();c.globalCompositeOperation='screen';c.translate(x,y);c.rotate(rot);for(let i=0;i<n;i++){const an=-Math.PI/2+(i-(n-1)/2)*.22+(H1(i)-.5)*.1;c.save();c.rotate(an);
  c.fillStyle=G2(c,0,0,0,-len,[[0,rgba(col,a)],[1,rgba(col,0)]]);c.beginPath();c.moveTo(0,0);c.lineTo(Math.tan(w)*len,-len);c.lineTo(-Math.tan(w)*len,-len);c.closePath();c.fill();c.restore();}c.restore();}
// плоская башня: две грани (освещённая и в тени), окна точками, контур света со стороны солнца
function towerF(c,x,by,w,h,o={}){const sd=o.sd||1,cl1=o.lit||'#5a3a5a',cl2=o.dark||'#2a1a30',top=o.top||'flat';c.save();
  const P=new Path2D();P.moveTo(x-w/2,by);P.lineTo(x-w/2,by-h);if(top==='spire'){P.lineTo(x,by-h-w*1.3);}else if(top==='slant'){P.lineTo(x+w/2,by-h-w*.6);}else if(top==='step'){P.lineTo(x-w/4,by-h);P.lineTo(x-w/4,by-h-w*.4);P.lineTo(x+w/4,by-h-w*.4);P.lineTo(x+w/4,by-h);}P.lineTo(x+w/2,by-h);P.lineTo(x+w/2,by);P.closePath();
  c.fillStyle=G2(c,x-w/2,0,x+w/2,0,sd>0?[[0,cl2],[.55,cl2],[.56,cl1],[1,cl1]]:[[0,cl1],[.44,cl1],[.45,cl2],[1,cl2]]);c.fill(P);
  if(o.win){c.save();c.clip(P);for(let j=0;j<h/14;j++)for(let i=0;i<w/10;i++){if(H2(i+x*.1,j+(o.seed||0))>o.win)continue;c.fillStyle=rgba(o.wc||'#ffc870',.5+.5*H2(j,i+3));c.fillRect(x-w/2+3+i*10,by-h+8+j*14,4,6);}c.restore();}
  if(o.rim){c.strokeStyle=rgba(o.rim,.75);c.lineWidth=2.5;c.beginPath();c.moveTo(x+sd*w/2,by);c.lineTo(x+sd*w/2,by-h);c.stroke();}c.restore();}
// Москва-Сити силуэтом: Федерация со шпилем, Меркурий ступенями, Эволюция, ОКО
function mCity(c,cx,by,s,o={}){const T=[[-150,46,560,'flat'],[-100,40,470,'slant'],[-40,52,880,'spire'],[20,46,720,'flat'],[78,54,760,'step'],[136,44,620,'slant'],[186,40,520,'flat'],[-190,34,380,'flat']];
  for(const [dx,w,h,top] of T.sort((a,b)=>a[2]-b[2]))towerF(c,cx+dx*s,by,w*s,h*s,{...o,top,seed:dx});}
function stalinkaF(c,x,by,s,col='#3a2430',rim){c.save();c.translate(x,by);c.scale(s,s);const L=[[-170,0],[-170,-140],[-120,-140],[-120,-230],[-80,-230],[-80,-330],[-52,-330],[-52,-410],[-30,-410],[-30,-470],[-12,-500],[0,-620],[12,-500],[30,-470],[30,-410],[52,-410],[52,-330],[80,-330],[80,-230],[120,-230],[120,-140],[170,-140],[170,0]];
  c.fillStyle=col;c.beginPath();L.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill();c.fillStyle='#ffcf70';c.beginPath();c.moveTo(-5,-620);c.lineTo(5,-620);c.lineTo(0,-650);c.fill();if(rim){c.strokeStyle=rgba(rim,.6);c.lineWidth=3;c.stroke();}c.restore();}
// отражение: нижняя часть кадра — зеркально, с рябью и градиентом
const RFC=mkc(WW,HH);function mirrorBelow(c,y,a=.55,blur=4){const g=RFC.getContext('2d');reset(g);g.clearRect(0,0,WW,HH);g.drawImage(c.canvas,0,0,c.canvas.width,c.canvas.height,0,0,WW,HH);
  c.save();reset(c);c.beginPath();c.rect(0,y,WW,HH-y);c.clip();c.globalAlpha=a;c.filter=`blur(${blur}px)`;c.translate(0,2*y);c.scale(1,-1);c.drawImage(RFC,0,0);c.restore();
  c.save();c.globalCompositeOperation='multiply';c.fillStyle=G2(c,0,y,0,HH,[[0,'rgba(120,120,140,1)'],[1,'rgba(20,20,30,1)']]);c.fillRect(0,y,WW,HH-y);c.restore();
  c.save();c.globalCompositeOperation='screen';for(let i=0;i<60;i++){const yy=y+8+H1(i*3)*(HH-y);c.fillStyle=`rgba(255,200,140,${.05*H1(i*7)})`;c.fillRect(H1(i*5)*WW,yy,80+H1(i)*200,2);}c.restore();}
// большое лицо как у Династии: персонаж alex9 крупно, свет с одной стороны, контур
function bigFace(c,f,x,y,s,o={}){personA(c,{f,x,y,s,L:o.L??-1,light:o.light||'#ffb070',la:o.la??.3,e:o.e||'neutral',look:o.look||[0,0],cloth:o.cloth||{k:'suit',jacket:'#22252d',shirt:'#eef0f2'},sw:o.sw||124,bt:o.bt||620});}

/* ================= СЦЕНЫ ================= */
// 1. Москва на рассвете: солнце за Сити, река отражает
P12.city=(c,t,o={})=>{skyG(c,[[0,'#140d2c'],[.28,'#4a2450'],[.42,'#b04a48'],[.5,'#ff9a50'],[.53,'#ffd08a']]);sun(c,600,1000,70,'#fff2c8','#ffa040');
  haze(c,960,80,'#ffb070',.35);c.fillStyle='#5a3050';for(let i=0;i<9;i++){const x=i*140-40;c.beginPath();c.moveTo(x,1010);c.lineTo(x+20,940-H1(i)*60);c.lineTo(x+120,950-H1(i*3)*40);c.lineTo(x+150,1010);c.fill();}
  stalinkaF(c,190,1010,.95,'#3a2038','#ffb070');mCity(c,640,1010,1,{lit:'#6a3a58',dark:'#2c1630',rim:'#ffb070',win:.86,sd:-1});
  c.fillStyle='#1a0f1e';c.fillRect(0,1008,WW,10);mirrorBelow(c,1014,.6,3);
  for(let i=0;i<7;i++){const x=200+i*90+Math.sin(t+i)*20,y=420+H1(i)*120;c.strokeStyle='#1a1020';c.lineWidth=3;c.beginPath();c.moveTo(x-12,y);c.quadraticCurveTo(x,y-8,x,y);c.quadraticCurveTo(x,y-8,x+12,y);c.stroke();}
  dyDust(c,t,30,'#ffd9a0');};
DYH.city=['10:00 · МОСКВА','2012','01 / 07 · МЕГАПОЛИС',.06,[{t:'ТЫ',on:1},{t:'ОТКРЫВАЕШЬ',on:1},{t:'ГЛАЗА',on:1,acc:1}]];

// 2. Шеф крупно: переговорная, за ним стекло и Сити в утреннем свете
P12.boss=(c,t,o={})=>{skyG(c,[[0,'#2a3a58'],[.5,'#e0a070'],[1,'#3a2a2a']]);sun(c,820,700,50,'#fff6e0','#ffd090',.7);
  mCity(c,560,1020,.9,{lit:'#a08aa0',dark:'#6a5a78',win:.9,sd:-1});haze(c,900,200,'#ffd8b0',.35);
  c.fillStyle='rgba(20,22,30,.85)';for(const x of [80,540,1000])c.fillRect(x-8,0,16,HH);c.fillRect(0,1050,WW,14);
  bigFace(c,'boss',540,900,2.4,{e:o.e||'neutral',L:1,light:'#ffd8a8',la:.4,cloth:{k:'suit',jacket:'#2f323a',shirt:'#e8eaee',tie:'#6a1f2a'}});
  c.fillStyle=G2(c,0,1500,0,HH,[[0,'#3a2418'],[1,'#120a06']]);c.fillRect(0,1500,WW,HH-1500);c.fillStyle='rgba(255,220,180,.25)';c.fillRect(0,1500,WW,4);dyDust(c,t,24,'#ffe2b8');};
DYH.boss=['ПЕРЕГОВОРНАЯ · МЕГАПОЛИС','2012','01 / 07 · МЕГАПОЛИС',.1,[{t:'ПОСЛЕДНИЙ',on:1},{t:'ПРОЕКТ',on:1,acc:1}]];

// 3. Доход: огромная золотая цифра над ночным городом в боке
P12.num=(c,t,o={})=>{skyG(c,[[0,'#07091a'],[.6,'#1c1a3a'],[1,'#0a0810']]);const bb=bokeh('dynum',WW,HH,50,['#ffb050','#ff7040','#ffd890','#7090ff'],18,90,3,3);c.save();c.globalCompositeOperation='screen';c.drawImage(bb,0,0);c.restore();
  mCity(c,540,1500,1.1,{lit:'#2a2a4a',dark:'#14142a',win:.7,wc:'#ffc870',sd:1});c.fillStyle='#07070c';c.fillRect(0,1500,WW,420);
  c.save();c.translate(540,760);bigNum(c,'dyn?00','?00 000 €',0,0,{s:190,d:18});c.restore();tag(c,'ДОХОД · В ГОД',540,930);dyDust(c,t,30,'#ffd9a0');};
DYH.num=['ДОХОД · КРЕДИТНЫЙ ОТДЕЛ','2012','01 / 07 · МЕГАПОЛИС',.16,[{t:'ПЯТЬ',on:1},{t:'НУЛЕЙ',on:1,acc:1},{t:'В',on:0},{t:'ЕВРО',on:0}]];

// 4. Тверская ночью: проспект в Кремль, звезда, окна, следы фар, неон клуба
P12.tver=(c,t,o={})=>{skyG(c,[[0,'#05071a'],[.4,'#1a1440'],[.52,'#5a2a50'],[.56,'#2a1430'],[1,'#07050c']]);const vx=540,vy=980;
  sun(c,vx,vy-210,16,'#ff4a3a','#ff2020',.9);c.fillStyle='#3a0e14';c.beginPath();c.moveTo(vx-26,vy);c.lineTo(vx-26,vy-120);c.lineTo(vx-14,vy-160);c.lineTo(vx,vy-215);c.lineTo(vx+14,vy-160);c.lineTo(vx+26,vy-120);c.lineTo(vx+26,vy);c.fill();
  c.fillRect(vx-160,vy-50,320,50);for(let i=0;i<9;i++)c.fillRect(vx-160+i*38,vy-62,16,14);
  // дома слоями от горизонта к краям
  for(const sd of [-1,1])for(let k=7;k>=0;k--){const x0=vx+sd*(40+k*k*9+k*30),x1=vx+sd*(40+(k+1)**2*9+(k+1)*30),hT=vy-120-k*90-k*k*18,lit=.55-k*.03;
    c.fillStyle=mixc('#3a2a44','#120c18',k/8);c.beginPath();c.moveTo(x0,vy);c.lineTo(x0,hT+ (k*12));c.lineTo(x1,hT);c.lineTo(x1,vy+k*k*12+k*20);c.closePath();c.fill();
    for(let j=0;j<6+k;j++)for(let i=0;i<3;i++){if(H2(i+k*7+sd*3,j)>lit)continue;const u=(i+.5)/3,xx=lp(x0,x1,u),yy=lp(hT+k*12,hT,u)+20+j*(24+k*9),hh=8+k*4,ww=Math.abs(x1-x0)/6;c.fillStyle=H2(j,i)>.5?'#ffcf7a':'#ffa850';c.fillRect(xx-ww/2,yy,ww,hh);}}
  // дорога и следы фар
  c.fillStyle=G2(c,0,vy,0,HH,[[0,'#120c18'],[1,'#05040a']]);c.beginPath();c.moveTo(vx-60,vy);c.lineTo(vx+60,vy);c.lineTo(WW+300,HH);c.lineTo(-300,HH);c.closePath();c.fill();
  c.save();c.globalCompositeOperation='screen';for(let i=0;i<6;i++){const sd=i<3?-1:1,off=(i%3)*.11+.08,col=sd<0?'#fff2d8':'#ff2a2a';c.strokeStyle=rgba(col,.75);c.lineWidth=4+i%3*3;c.shadowColor=col;c.shadowBlur=18;
    c.beginPath();c.moveTo(vx+sd*8,vy+4);c.lineTo(vx+sd*(off*WW*1.6),HH);c.stroke();}c.restore();
  for(let i=0;i<9;i++){const k=i/8,x=lp(vx,-160,k*k),y=lp(vy-30,600,k*k);for(const sd of [-1,1]){const xx=sd<0?x:WW-x;c.strokeStyle='#0a0810';c.lineWidth=2+k*10;c.beginPath();c.moveTo(xx,lp(vy,HH,k*k));c.lineTo(xx,y);c.stroke();sun(c,xx+sd*-14*k,y,4+k*10,'#fff0c8','#ffb050',.9);}}
  // неон клуба справа
  c.fillStyle='#120810';c.fillRect(890,420,110,560);c.save();c.shadowColor='#ff2e8f';c.shadowBlur=30;font(c,{f:'O',w:700,s:86});c.textAlign='center';c.fillStyle='#ffd1ea';'VELVET'.split('').forEach((ch,i)=>c.fillText(ch,945,510+i*88));c.restore();
  c.save();c.globalCompositeOperation='screen';c.fillStyle=RG(c,945,700,20,520,[[0,'rgba(255,46,143,.35)'],[1,'rgba(255,46,143,0)']]);c.fillRect(400,200,680,1100);c.restore();
  dyDust(c,t,24,'#ffb0d0');};
DYH.tver=['23:40 · ТВЕРСКАЯ','2012','02 / 07 · КЛУБ',.24,[{t:'ВНИЗ',on:1},{t:'ТВЕРСКАЯ',on:1,acc:1},{t:'КЛУБ',on:0}]];

// 5. Клуб: море поднятых рук против слепящей сцены (как войско против солнца)
P12.club=(c,t,o={})=>{skyG(c,[[0,'#0a0614'],[.45,'#3a0a40'],[.55,'#ff3a9a'],[.6,'#5a1048'],[1,'#07040a']]);const sx=540,sy=980;
  rays2(c,sx,sy,9,'#ffd0f0',.16,1500,.04);sun(c,sx,sy,90,'#ffffff','#ff4ab0',1);for(let i=0;i<8;i++){const a=-Math.PI/2+(i-3.5)*.26+Math.sin(t*1.3+i)*.08;c.save();c.globalCompositeOperation='screen';c.translate(sx+(i-3.5)*110,sy-500);c.rotate(a+Math.PI/2);c.fillStyle=G2(c,0,0,1200,0,[[0,rgba(i%2?'#3fd6ff':'#ff2f8e',.45)],[1,'rgba(0,0,0,0)']]);c.beginPath();c.moveTo(0,0);c.lineTo(1200,-60);c.lineTo(1200,60);c.closePath();c.fill();c.restore();}
  haze(c,1000,160,'#ff8ad0',.3);
  // толпа рядами: силуэты с руками вверх, ближе — крупнее и темнее
  for(let r=0;r<9;r++){const y=1000+r*r*11+r*40,s=.2+r*.11,n=Math.round(22-r*1.4);for(let i=0;i<n;i++){const x=(i+.5)*WW/n+(H1(i*3+r)-.5)*60;
    sil(c,x,y+Math.sin(t*6+i+r)*4,s,{col:mixc('#3a1440','#050308',r/8),up:H1(i*5+r)>.4?.6+.4*H1(i):0,both:H1(i*9+r)>.6,side:H1(i+r)>.5?1:-1,rim:r<5?'#ff7ac8':undefined,ra:.5});}}
  dyDust(c,t,40,'#ffb0e0');};
DYH.club=['01:50 · КЛУБ · VIP','2012','02 / 07 · КЛУБ',.3,[{t:'НОЧЬЮ',on:1},{t:'КЛУБЫ',on:1,acc:1}]];

// 6. Миша крупно в випе, за ним свет зала
P12.misha=(c,t,o={})=>{skyG(c,[[0,'#12061a'],[.5,'#3a0a30'],[1,'#0a0408']]);rays2(c,540,700,7,'#ff6ab8',.12,1200,.05);const bb=bokeh('dymi',WW,HH,40,['#ff2f8e','#3fd6ff','#ffd25a'],24,100,5,3);c.save();c.globalCompositeOperation='screen';c.drawImage(bb,0,0);c.restore();
  c.fillStyle=G2(c,0,1150,0,1500,[[0,'#7a0f22'],[1,'#2a040b']]);RR(c,-40,1120,WW+80,400,120);c.fill();
  bigFace(c,'misha',540,980,2.55,{e:o.e||'smirk',L:1,light:'#ff8ac8',la:.35,cloth:{k:'shirt',shirt:'#2b2f3a'}});
  c.save();c.translate(540,540);bigNum(c,'dy600','600 000 $',0,0,{s:170,d:16});c.restore();tag(c,'ДЫРА В БЮДЖЕТЕ КЛУБА',540,680);dyDust(c,t,30,'#ffb0d0');};
DYH.misha=['01:50 · КЛУБ · VIP','2012','02 / 07 · КЛУБ',.34,[{t:'ДЫРА',on:1},{t:'В',on:1},{t:'ШЕСТЬСОТ',on:1,acc:1},{t:'ТЫСЯЧ',on:0}]];

// 7. Зеркало: лицо Макса, лампа сверху, тёмный мрамор, розовый свет из-под двери в отражении
P12.mirror=(c,t,o={})=>{skyG(c,[[0,'#0a0709'],[1,'#151014']]);c.strokeStyle='rgba(255,255,255,.05)';c.lineWidth=2;for(let i=0;i<12;i++){c.beginPath();c.moveTo(H1(i)*WW,0);c.bezierCurveTo(H1(i*3)*WW,600,H1(i*5)*WW,1300,H1(i*7)*WW,HH);c.stroke();}
  const M={x:150,y:250,w:780,h:1160};c.save();c.beginPath();c.rect(M.x,M.y,M.w,M.h);c.clip();c.fillStyle=G2(c,0,M.y,0,M.y+M.h,[[0,'#2a2028'],[1,'#120c12']]);c.fillRect(0,0,WW,HH);
  c.fillStyle='#1a1418';for(let i=0;i<4;i++)c.fillRect(M.x+40+i*190,M.y+300,150,700);c.save();c.globalCompositeOperation='screen';c.fillStyle=RG(c,M.x+M.w*.7,M.y+M.h,10,500,[[0,'rgba(255,60,150,.45)'],[1,'rgba(255,60,150,0)']]);c.fillRect(0,0,WW,HH);c.restore();
  bigFace(c,'max',540,860,2.0,{e:o.e||'smirk',L:-1,light:'#ffc27a',la:.38,cloth:{k:'suit',jacket:'#1c1e25',shirt:'#e9e6e0'}});
  c.globalCompositeOperation='screen';c.fillStyle=G2(c,M.x,M.y,M.x+M.w,M.y+M.h,[[0,'rgba(255,255,255,0)'],[.36,'rgba(255,245,235,.1)'],[.4,'rgba(255,245,235,.02)'],[1,'rgba(255,255,255,0)']]);c.fillRect(0,0,WW,HH);c.restore();
  c.strokeStyle=G2(c,M.x,0,M.x+M.w,0,[[0,'#6a4e1c'],[.5,'#f1d48c'],[1,'#5a3f14']]);c.lineWidth=16;c.strokeRect(M.x-8,M.y-8,M.w+16,M.h+16);
  c.fillStyle='#fff3dc';RR(c,270,180,540,16,8);c.fill();sun(c,540,188,30,'#fff3dc','#ffb060',.8);dyDust(c,t,18,'#ffe0b8');};
DYH.mirror=['02:31 · КЛУБ · ТУАЛЕТ','2012','02 / 07 · КЛУБ',.4,[{t:'И',on:1},{t:'НРАВИШЬСЯ',on:1},{t:'СЕБЕ',on:1,acc:1}]];

// 8. Юля: лицо крупно, ночная улица в синем боке
P12.yulia=(c,t,o={})=>{skyG(c,[[0,'#060a1c'],[.5,'#14204a'],[1,'#05060c']]);const bb=bokeh('dyyu',WW,HH,46,['#6aa0ff','#ffb050','#a0d0ff'],24,110,8,3);c.save();c.globalCompositeOperation='screen';c.drawImage(bb,0,0);c.restore();
  rays2(c,900,300,5,'#a8c8ff',.1,1400,.06,.4);bigFace(c,'yulia',540,960,2.6,{e:o.e||'smile',L:1,light:'#ffc890',la:.35,cloth:{k:'parka'}});dyDust(c,t,30,'#bcd4ff');};
DYH.yulia=['00:40 · УЛИЦА','2012','03 / 07 · ЮЛЯ',.48,[{t:'ПОЯВЛЯЕТСЯ',on:1},{t:'ЮЛЯ',on:1,acc:1}]];

// 9. Вокзал: поезд по диагонали уходит в туман, огни окон, фонари; Юля на перроне в свете
P12.vok=(c,t,o={})=>{skyG(c,[[0,'#03050c'],[.5,'#101a30'],[.62,'#1e2a44'],[1,'#05070c']]);const vx=860,vy=900;haze(c,vy,200,'#7a90b0',.3);
  // навес сверху: фермы сходятся к точке
  for(let i=0;i<10;i++){const k=i/9,x=lp(-100,vx,k*k*.0+k),y=lp(120,vy-220,k);c.strokeStyle=rgba('#2a3240',1-k*.6);c.lineWidth=lp(18,3,k);c.beginPath();c.moveTo(lp(-200,vx-40,1-(1-k)**2),lp(160,vy-200,1-(1-k)**2));c.lineTo(WW+100,lp(160,vy-200,1-(1-k)**2)+lp(-40,0,k));c.stroke();
    const lx=lp(300,vx,1-(1-k)**2),ly=lp(200,vy-190,1-(1-k)**2);sun(c,lx,ly,lp(14,3,k),'#fff0d0','#ffc880',.95);}
  // поезд: бок от левого края к точке схода
  const P=(k,y)=>[lp(-60,vx-20,k),lp(y,vy+(y-vy)*.08,k)];
  const top=[P(0,500),P(1,500)],bot=[P(0,1160),P(1,1160)];c.fillStyle=G2(c,0,500,0,1160,[[0,'#cfd4da'],[.5,'#9aa1aa'],[1,'#5a6068']]);c.beginPath();c.moveTo(top[0][0],top[0][1]);c.lineTo(top[1][0],top[1][1]);c.lineTo(bot[1][0],bot[1][1]);c.lineTo(bot[0][0],bot[0][1]);c.closePath();c.fill();
  c.save();c.globalCompositeOperation='multiply';c.fillStyle=G2(c,0,0,vx,0,[[0,'rgba(255,255,255,1)'],[1,'rgba(60,70,90,1)']]);c.beginPath();c.moveTo(top[0][0],top[0][1]);c.lineTo(top[1][0],top[1][1]);c.lineTo(bot[1][0],bot[1][1]);c.lineTo(bot[0][0],bot[0][1]);c.closePath();c.fill();c.restore();
  const band=(y0,y1,col)=>{const a=P(0,y0),b=P(1,y0),cc=P(1,y1),d=P(0,y1);c.fillStyle=col;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(cc[0],cc[1]);c.lineTo(d[0],d[1]);c.closePath();c.fill();};
  band(1080,1110,'#b3172a');band(640,820,'#11151d');
  for(let i=0;i<26;i++){const k0=1-Math.pow(1-i/26,2.2),k1=1-Math.pow(1-(i+.72)/26,2.2),a=P(k0,655),b=P(k1,655),cc=P(k1,805),d=P(k0,805);c.fillStyle=H1(i)>.2?'#ffd49a':'#2a3240';c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(cc[0],cc[1]);c.lineTo(d[0],d[1]);c.closePath();c.fill();
    if(H1(i)>.2){c.save();c.globalCompositeOperation='screen';c.fillStyle=RG(c,(a[0]+cc[0])/2,(a[1]+cc[1])/2,0,lp(120,10,k0),[[0,'rgba(255,200,130,.35)'],[1,'rgba(255,200,130,0)']]);c.fillRect(0,0,WW,HH);c.restore();}}
  // перрон
  c.fillStyle=G2(c,0,1160,0,HH,[[0,'#2a2e36'],[1,'#08090c']]);c.beginPath();c.moveTo(P(0,1160)[0],1160);c.lineTo(vx,vy+20);c.lineTo(WW,vy+20);c.lineTo(WW,HH);c.lineTo(0,HH);c.lineTo(0,1160);c.closePath();c.fill();
  c.strokeStyle='#e8c23a';c.lineWidth=12;c.beginPath();c.moveTo(-60,1190);c.lineTo(vx-10,vy+24);c.stroke();
  // Юля в круге света
  c.save();c.globalCompositeOperation='screen';c.fillStyle=RG(c,700,1460,20,360,[[0,'rgba(255,214,160,.35)'],[1,'rgba(255,214,160,0)']]);c.fillRect(0,0,WW,HH);c.restore();
  figA(c,{f:'yulia',x:700,y:1470,s:.5,cloth:{k:'parka'},L:-1,light:'#ffcf8a',la:.32});
  c.fillStyle='#f4efe2';c.beginPath();c.arc(560,560,44,0,TAU);c.fill();c.strokeStyle='#1a1d22';c.lineWidth=7;c.stroke();c.lineWidth=5;c.beginPath();c.moveTo(560,560);c.lineTo(568,530);c.moveTo(560,560);c.lineTo(586,565);c.stroke();
  haze(c,1000,260,'#9ab0d0',.12);dyDust(c,t,30,'#d0e0ff');};
DYH.vok=['23:30 · ВОКЗАЛ','2012','03 / 07 · ЮЛЯ',.6,[{t:'ВОКЗАЛ',on:1,acc:1}]];

// 10. Больничный туалет: окно в ночь, Лёша на подоконнике силуэтом, дым в лунном свете
P12.hosp=(c,t,o={})=>{skyG(c,[[0,'#0c1416'],[1,'#162224']]);c.strokeStyle='rgba(0,0,0,.25)';c.lineWidth=2;for(let x=0;x<WW;x+=80){c.beginPath();c.moveTo(x,0);c.lineTo(x,HH);c.stroke();}for(let y=0;y<HH;y+=80){c.beginPath();c.moveTo(0,y);c.lineTo(WW,y);c.stroke();}
  const W0={x:220,y:330,w:640,h:760};c.fillStyle=G2(c,0,W0.y,0,W0.y+W0.h,[[0,'#0e2446'],[1,'#1c3a66']]);c.fillRect(W0.x,W0.y,W0.w,W0.h);sun(c,700,480,46,'#f4f8ff','#9ac0ff',.9);
  c.fillStyle='#0c1a30';for(let i=0;i<7;i++){const x=W0.x+i*95;c.fillRect(x,W0.y+W0.h-120-H1(i)*140,80,260);}for(let i=0;i<40;i++){if(H1(i*3)>.5)continue;c.fillStyle='#ffd27a';c.fillRect(W0.x+H1(i*7)*W0.w,W0.y+W0.h-60-H1(i*5)*200,5,6);}
  c.strokeStyle='#cfd8d8';c.lineWidth=16;c.strokeRect(W0.x,W0.y,W0.w,W0.h);c.beginPath();c.moveTo(540,W0.y);c.lineTo(540,W0.y+W0.h);c.stroke();
  c.fillStyle='#e9eeee';c.fillRect(180,1090,720,40);c.fillStyle='rgba(0,0,0,.3)';c.fillRect(180,1130,720,14);
  bigFace(c,{...AX.lyosha,mask:0},620,950,1.35,{e:o.e||'neutral',L:-1,light:'#cfe2ff',la:.35,cloth:{k:'scrub',col:'#7f9fb8'},sw:104,bt:280});
  c.save();c.globalCompositeOperation='screen';const S=smokeSprites();for(let i=0;i<8;i++){const y=1060-i*70-((t*40)%70),r=40+i*20;c.globalAlpha=.16*(1-i/8);c.drawImage(S[i%4],700-r+Math.sin(t*1.3+i)*24,y-r,2*r,2*r);}c.restore();dyDust(c,t,20,'#cfe2ff');};
DYH.hosp=['ДЕТСКАЯ БОЛЬНИЦА · ТУАЛЕТ','2012','03 / 07 · ЛЁША',.56,[{t:'«А',on:1},{t:'ТЫ',on:1},{t:'СМЕШНОЙ»',on:1,acc:1}]];

// 11. Кабинет шефа: закат сквозь жалюзи, шеф силуэтом, лампа и карта полигона
P12.office=(c,t,o={})=>{skyG(c,[[0,'#140a06'],[1,'#0a0604']]);const wx=120,wy=240,ww=840,wh=1000;c.fillStyle=G2(c,0,wy,0,wy+wh,[[0,'#ffb060'],[.55,'#e0602a'],[1,'#5a1e10']]);c.fillRect(wx,wy,ww,wh);sun(c,640,880,80,'#fff0c0','#ff8030',.9);
  for(let y=wy;y<wy+wh;y+=30){c.fillStyle='rgba(28,12,6,.82)';c.fillRect(wx,y+14,ww,16);}c.strokeStyle='#120a06';c.lineWidth=24;c.strokeRect(wx,wy,ww,wh);
  c.save();c.globalCompositeOperation='screen';for(let i=0;i<16;i++){c.fillStyle='rgba(255,150,80,.06)';c.beginPath();c.moveTo(wx+ww,wy+i*62);c.lineTo(WW,wy+i*62+70);c.lineTo(WW,wy+i*62+100);c.lineTo(wx+ww,wy+i*62+30);c.fill();}c.restore();
  bigFace(c,'boss',540,930,2.2,{e:o.e||'neutral',L:1,light:'#ffa060',la:.5,cloth:{k:'suit',jacket:'#22252d',shirt:'#e8eaee',tie:'#6a1f2a'}});c.save();reset(c);c.globalCompositeOperation='multiply';c.fillStyle='rgba(150,110,90,1)';c.fillRect(0,600,WW,700);c.restore();
  c.fillStyle=G2(c,0,1300,0,HH,[[0,'#2a160c'],[1,'#0a0604']]);c.fillRect(0,1300,WW,HH-1300);c.fillStyle='rgba(255,200,140,.2)';c.fillRect(0,1300,WW,4);
  c.save();c.translate(560,1470);c.rotate(-.06);c.drawImage(mapTex(1),-250,-120,500,280);c.restore();
  c.fillStyle='#1a3d27';c.beginPath();c.moveTo(120,1200);c.lineTo(300,1200);c.lineTo(270,1260);c.lineTo(150,1260);c.closePath();c.fill();c.fillStyle='#c9a24a';c.fillRect(204,1260,12,60);sun(c,210,1280,20,'#fff0c0','#ffe08a',.6);dyDust(c,t,24,'#ffc890');};
DYH.office=['КАБИНЕТ ШЕФА · МЕГАПОЛИС','2012','05 / 07 · ОБВАЛ',.7,[{t:'ПОЛИГОН',on:1,acc:1},{t:'ХИМОРУЖИЯ',on:1}]];

// 12. Финал: окно ночью, Макс со спины, красный нос на подоконнике
P12.alone=(c,t,o={})=>{skyG(c,[[0,'#04060c'],[1,'#0a0c14']]);const W0={x:110,y:220,w:860,h:1100};c.save();c.beginPath();c.rect(W0.x,W0.y,W0.w,W0.h);c.clip();
  c.fillStyle=G2(c,0,W0.y,0,W0.y+W0.h,[[0,'#060a18'],[.65,'#18203e'],[1,'#2a1a34']]);c.fillRect(0,0,WW,HH);mCity(c,640,1240,.9,{lit:'#1e2440',dark:'#10142a',win:.7,wc:'#9ab8ff',sd:-1});cityFar(c,1240,{col:'#0a0d18',seed:4});
  c.globalCompositeOperation='screen';for(let i=0;i<140;i++){const x=W0.x+H1(i*3.3)*W0.w,y=W0.y+((H1(i*7.7)*W0.h+t*(20+40*H1(i)))%W0.h),r=2+H1(i*5)*5;c.fillStyle=`rgba(190,210,255,${.15+.2*H1(i*9)})`;c.beginPath();c.ellipse(x,y,r*.7,r,0,0,TAU);c.fill();}c.restore();
  c.strokeStyle='#07080b';c.lineWidth=26;c.strokeRect(W0.x,W0.y,W0.w,W0.h);c.fillStyle='#14151a';c.fillRect(60,1320,960,80);
  const nx=780,ny=1300;c.fillStyle=RG(c,nx-12,ny-14,4,46,[[0,'#ff5a4a'],[.6,'#c81e1e'],[1,'#5a0606']]);c.beginPath();c.arc(nx,ny,36,0,TAU);c.fill();
  manBack(c,380,1330,1.25,{rim:'#6a90ff',light:1,suit:'#06070a'});dyDust(c,t,20,'#9ab8ff',3,.6);};
DYH.alone=['04:00 · ДОМ','2012','07 / 07 · ОДИН',.96,[{t:'ТЫ',on:1},{t:'ОСТАЁШЬСЯ',on:1},{t:'ОДИН',on:1,acc:1}]];

/* ================= ещё места (для всего ролика) — всё плоское ================= */
// карточка-документ: картинка-текстура на столе, наклон, тень, лампа
function card2(c,img,x,y,w,h,rot,o={}){c.save();c.translate(x,y);c.rotate(rot);c.fillStyle='rgba(0,0,0,.55)';c.filter='blur(22px)';c.fillRect(-w/2+18,-h/2+26,w,h);c.filter='none';c.drawImage(img,-w/2,-h/2,w,h);
  if(o.sheen){c.globalCompositeOperation='screen';c.fillStyle=G2(c,-w/2,-h/2,w/2,h/2,[[0,'rgba(255,255,255,0)'],[.45,'rgba(255,245,230,.12)'],[.55,'rgba(255,255,255,0)']]);c.fillRect(-w/2,-h/2,w,h);}c.restore();}
function deskBg(c,col='#2a170c'){c.fillStyle=G2(c,0,0,0,HH,[[0,'#0a0604'],[.4,col],[1,'#070403']]);c.fillRect(0,0,WW,HH);c.save();c.globalAlpha=.35;for(let i=0;i<90;i++){c.strokeStyle=`rgba(${90+40*H1(i)},${50+20*H1(i*3)},24,${.3*H1(i*7)})`;c.lineWidth=1+H1(i*5)*3;c.beginPath();const y=H1(i*9.1)*HH;c.moveTo(0,y);c.bezierCurveTo(WW*.3,y+30*(H1(i)-.5),WW*.6,y-30*(H1(i*2)-.5),WW,y+20*(H1(i*4)-.5));c.stroke();}c.restore();}
function lampPool(c,x,y,r,col='#ffcf8a',a=.5){c.save();reset(c);c.globalCompositeOperation='multiply';c.fillStyle=RG(c,x,y,r*.15,r,[[0,'rgba(255,255,255,1)'],[.6,'rgba(130,115,100,1)'],[1,'rgba(20,16,14,1)']]);c.fillRect(0,0,WW,HH);c.restore();sun(c,x,y-r*.5,10,'#fff0d0',col,a*.4);}

// макет посёлка — как рекламный плакат проекта: холмы на закате, ряды одинаковых домиков, арка с названием
P12.maq=(c,t,o={})=>{skyG(c,[[0,'#2a1a3a'],[.35,'#a0506a'],[.5,'#ffa060'],[.56,'#ffd890']]);sun(c,540,1020,90,'#fff4d0','#ffb060');
  c.fillStyle='#6a8a4a';c.beginPath();c.moveTo(0,1080);c.bezierCurveTo(300,980,700,1020,WW,960);c.lineTo(WW,HH);c.lineTo(0,HH);c.fill();
  c.fillStyle='#4f7a3c';c.beginPath();c.moveTo(0,1180);c.bezierCurveTo(400,1100,700,1160,WW,1100);c.lineTo(WW,HH);c.lineTo(0,HH);c.fill();
  for(let r=0;r<5;r++){const y=1060+r*r*26+r*50,s=.35+r*.22,n=Math.round(11-r*1.4);for(let i=0;i<n;i++){const x=(i+.5)*WW/n+(r%2)*30,w=60*s,h=46*s;c.fillStyle='#f4efe4';c.fillRect(x-w/2,y-h,w,h);c.fillStyle=mixc('#ffd0a0','#f4efe4',.5);c.fillRect(x-w/2,y-h,w*.45,h);
    c.fillStyle='#c4452f';c.beginPath();c.moveTo(x-w/2-6*s,y-h);c.lineTo(x,y-h-34*s);c.lineTo(x+w/2+6*s,y-h);c.closePath();c.fill();c.fillStyle='#ffd27a';c.fillRect(x-8*s,y-h*.6,16*s,14*s);
    c.fillStyle='#2f5a2a';c.beginPath();c.arc(x+w*.85,y-14*s,18*s,0,TAU);c.fill();}}
  // арка-табличка
  c.fillStyle='#1f2a44';RR(c,190,600,700,120,14);c.fill();c.strokeStyle='#f2d48a';c.lineWidth=5;c.stroke();tx(c,'РАЙ МИЛЛИОНЕРОВ',540,680,{f:'P',w:700,s:62,c:'#f2d48a'});c.fillStyle='#1f2a44';c.fillRect(230,720,16,330);c.fillRect(834,720,16,330);
  dyDust(c,t,30,'#ffe0b0');};
// справка о доходах и пропуск на столе под лампой, маркер по сумме
P12.desk=(c,t,o={})=>{deskBg(c);card2(c,incomeTex(),520,900,660,930,-.06,{sheen:1});
  const mk=o.mark??0;if(mk>0){c.save();c.translate(520,900);c.rotate(-.06);c.globalCompositeOperation='multiply';c.fillStyle='rgba(255,226,60,.9)';c.fillRect(-330+48,-465+468,400*mk,62);c.restore();}
  card2(c,passTex(),700,1330,400,252,.12,{sheen:1});c.strokeStyle='#a0212b';c.lineWidth=14;c.lineCap='round';c.beginPath();c.moveTo(720,1205);c.bezierCurveTo(760,1050,980,1000,1150,880);c.stroke();
  lampPool(c,560,800,1100);};
// лифт: стальные двери, табло этажей, двери открываются — за ними ночь
P12.lift=(c,t,o={})=>{const k=o.k??0,op=o.open??0;skyG(c,[[0,'#1a1c22'],[1,'#0a0b0e']]);
  if(op>0){c.save();c.beginPath();c.rect(240,520,600,1100);c.clip();P12.tver(c,t,{});c.restore();}
  const dx=op*300;c.fillStyle=G2(c,240,0,540,0,[[0,'#6a7078'],[.5,'#b8bec6'],[1,'#7d838c']]);c.fillRect(240-dx,520,300,1100);c.fillStyle=G2(c,540,0,840,0,[[0,'#7d838c'],[.5,'#c2c8d0'],[1,'#6a7078']]);c.fillRect(540+dx,520,300,1100);
  c.globalAlpha=.15;for(let i=0;i<60;i++){c.fillStyle=H1(i)>.5?'#fff':'#000';c.fillRect(240-dx+H1(i*3)*300,520,1,1100);c.fillRect(540+dx+H1(i*7)*300,520,1,1100);}c.globalAlpha=1;
  c.fillStyle='#2a2c31';c.fillRect(200,480,680,40);c.fillRect(200,480,40,1180);c.fillRect(840,480,40,1180);
  c.fillStyle='#070707';RR(c,400,330,280,110,12);c.fill();const fl=Math.max(1,Math.round(lp(42,1,k)));tx(c,'▼ '+fl,540,410,{f:'J',w:700,s:76,c:'#ff3b30',glow:'#ff2a1a',gb:24});
  sun(c,540,140,16,'#fff6e6','#fff2dc',.5);c.save();c.globalCompositeOperation='screen';c.fillStyle=G2(c,0,0,0,1000,[[0,'rgba(255,246,230,.25)'],[1,'rgba(255,246,230,0)']]);c.fillRect(200,0,680,1000);c.restore();};
// вход в клуб: кирпичный фасад, неон над дверью, канат, охранник, очередь
P12.entry=(c,t,o={})=>{skyG(c,[[0,'#0a0610'],[1,'#120812']]);for(let j=0;j<40;j++)for(let i=-1;i<12;i++){c.fillStyle=`rgb(${40+20*H2(i,j)},${18+8*H2(i+3,j)},${24+10*H2(i,j+5)})`;c.fillRect(i*100+(j%2)*50+2,j*48+2,96,44);}
  c.save();c.globalCompositeOperation='multiply';c.fillStyle=RG(c,540,900,100,1100,[[0,'rgba(255,200,230,1)'],[1,'rgba(30,10,30,1)']]);c.fillRect(0,0,WW,HH);c.restore();
  c.fillStyle='#ff4aa6';c.save();c.shadowColor='#ff2e8f';c.shadowBlur=40;font(c,{f:'O',w:700,s:150});c.textAlign='center';c.fillStyle='#ffe0f0';c.fillText('VELVET',540,560);c.restore();sun(c,540,520,10,'#ffd0ea','#ff2e8f',.9);
  c.fillStyle='#ff9ad0';c.fillRect(380,700,320,560);c.fillStyle=G2(c,0,700,0,1260,[[0,'#ffd8ec'],[1,'#ff5aa8']]);c.fillRect(400,720,280,540);sun(c,540,1000,30,'#fff','#ff6ab8',.6);
  pers3(c,540,1330,560,{col:'#050306',rim:'#ff9ad0',ra:.9,sd:-1,w:1.6});
  for(const [x,s] of [[160,.9],[60,1.05],[920,.95],[1030,1.1]])pers3(c,x,1480,520*s,{col:'#0a0608',rim:'#ff6ab8',ra:.6,sd:x<540?1:-1,w:1.1});
  for(const x of [300,780]){c.fillStyle='#c9a24a';c.fillRect(x-6,1180,12,200);sun(c,x,1180,8,'#fff0c0','#ffd070',.8);}c.strokeStyle='#8a1430';c.lineWidth=14;c.beginPath();c.moveTo(300,1200);c.quadraticCurveTo(540,1270,780,1200);c.stroke();
  c.fillStyle=G2(c,0,1380,0,HH,[[0,'#1a0c16'],[1,'#050306']]);c.fillRect(0,1380,WW,HH-1380);dyDust(c,t,24,'#ffb0d0');};
// вип широко: Миша и Вадим на красном диване, ведро с шампанским
P12.vipw=(c,t,o={})=>{skyG(c,[[0,'#12061a'],[.5,'#3a0a30'],[1,'#0a0408']]);rays2(c,540,560,7,'#ff6ab8',.1,1100,.05);const bb=bokeh('dyvw',WW,HH,40,['#ff2f8e','#3fd6ff','#ffd25a'],20,90,6,3);c.save();c.globalCompositeOperation='screen';c.drawImage(bb,0,0);c.restore();
  c.fillStyle=G2(c,0,800,0,1300,[[0,'#9a1a2e'],[1,'#3a0610']]);c.beginPath();c.moveTo(-40,1300);c.lineTo(-40,860);c.quadraticCurveTo(540,640,WW+40,860);c.lineTo(WW+40,1300);c.closePath();c.fill();
  c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=3;for(let i=0;i<14;i++){const x=i*84;c.beginPath();c.moveTo(x,800-Math.sin(i/13*Math.PI)*150+60);c.lineTo(x,1300);c.stroke();}
  bigFace(c,'misha',360,1020,1.45,{e:o.mishaE||'smirk',L:1,light:'#ff8ac8',la:.35,cloth:{k:'shirt',shirt:'#2b2f3a'}});bigFace(c,'vadim',760,1040,1.38,{e:o.vadE||'smile',L:-1,light:'#7ad8ff',la:.3,cloth:{k:'sweater',col:'#4a5160'}});
  c.fillStyle=G2(c,0,1380,0,1500,[[0,'#2a1e2a'],[1,'#0a080c']]);c.fillRect(0,1380,WW,540);c.fillStyle='rgba(255,180,220,.25)';c.fillRect(0,1380,WW,4);
  c.fillStyle=G2(c,440,0,640,0,[[0,'#4a4e56'],[.3,'#eef1f6'],[.6,'#8a9098'],[1,'#3a3d44']]);c.beginPath();c.moveTo(450,1210);c.lineTo(630,1210);c.lineTo(610,1390);c.lineTo(470,1390);c.closePath();c.fill();
  c.save();c.translate(560,1200);c.rotate(.18);c.fillStyle=G2(c,-26,0,26,0,[[0,'#06110a'],[.4,'#2c5a3a'],[.5,'#9cc9a8'],[1,'#040b07']]);RR(c,-26,-190,52,200,20);c.fill();c.fillStyle='#e8c060';c.fillRect(-10,-250,20,70);c.restore();
  for(const x of [250,820]){c.strokeStyle='rgba(240,248,255,.85)';c.lineWidth=3;c.beginPath();c.moveTo(x-16,1270);c.lineTo(x-6,1370);c.lineTo(x+6,1370);c.lineTo(x+16,1270);c.stroke();c.fillStyle='rgba(255,212,110,.8)';c.fillRect(x-12,1310,24,50);c.beginPath();c.moveTo(x,1370);c.lineTo(x,1430);c.stroke();}
  dyDust(c,t,30,'#ffb0d0');};
// подпись на договоре
P12.pen=(c,t,o={})=>{deskBg(c,'#24160e');card2(c,contractTex(Math.round((o.sig??1)*12)/12),540,920,720,1016,.04,{sheen:1});
  c.save();c.translate(720,1300);c.rotate(-.5);c.fillStyle='rgba(0,0,0,.5)';c.filter='blur(10px)';c.fillRect(10,16,420,26);c.filter='none';c.fillStyle=G2(c,0,-14,0,14,[[0,'#1a1a1e'],[.4,'#6a6c72'],[.5,'#f0f2f6'],[.65,'#3a3c42'],[1,'#0c0c0f']]);RR(c,0,-13,420,26,13);c.fill();c.fillStyle=G2(c,0,-14,0,14,[[0,'#6a4e12'],[.5,'#ffe08a'],[1,'#5a420e']]);c.fillRect(260,-14,26,28);c.restore();
  lampPool(c,560,880,1150);};
// лица крупно: Вадим
P12.vadim=(c,t,o={})=>{if(o.shout){skyG(c,[[0,'#1a1612'],[1,'#0a0908']]);sun(c,540,140,20,'#fff2d8','#ffd9a0',.6);c.save();c.globalCompositeOperation='screen';c.fillStyle=G2(c,0,140,0,1600,[[0,'rgba(255,220,170,.25)'],[1,'rgba(255,220,170,0)']]);c.beginPath();c.moveTo(540,140);c.lineTo(1000,1600);c.lineTo(80,1600);c.closePath();c.fill();c.restore();}
  else{skyG(c,[[0,'#12061a'],[.5,'#3a0a30'],[1,'#0a0408']]);const bb=bokeh('dyva',WW,HH,40,['#ff2f8e','#3fd6ff'],24,100,9,3);c.save();c.globalCompositeOperation='screen';c.drawImage(bb,0,0);c.restore();}
  bigFace(c,'vadim',540,960,2.5,{e:o.e||'smile',L:-1,light:o.shout?'#ffd9a0':'#7ad8ff',la:.38,cloth:{k:'sweater',col:'#4a5160'}});dyDust(c,t,24,o.shout?'#ffe0b0':'#9ad8ff');};
// туалет клуба: ряд кабинок из чёрного лака, кафель, лампа мигает, розовый свет из-под двери
P12.wc=(c,t,o={})=>{const fl=o.flick??1;skyG(c,[[0,'#0c0a0e'],[1,'#141016']]);for(let x=0;x<WW;x+=90)for(let y=0;y<1500;y+=90){c.fillStyle=`rgba(255,255,255,${.02+.02*H2(x,y)})`;c.fillRect(x+2,y+2,86,86);}
  sun(c,540,180,18,'#fff3dc','#ffc27a',.9*fl);c.save();c.globalCompositeOperation='screen';c.fillStyle=G2(c,0,180,0,1500,[[0,`rgba(255,220,170,${.28*fl})`],[1,'rgba(255,220,170,0)']]);c.beginPath();c.moveTo(540,180);c.lineTo(1100,1500);c.lineTo(-20,1500);c.closePath();c.fill();c.restore();
  for(let i=0;i<4;i++){const x=60+i*250;c.fillStyle=G2(c,x,0,x+230,0,[[0,'#16131a'],[.5,'#2a2430'],[1,'#121016']]);c.fillRect(x,420,230,1000);c.fillStyle='#0a080c';c.fillRect(x+228,400,22,1040);
    c.fillStyle=i===2?'#ff2a2a':'#2dff86';c.beginPath();c.arc(x+200,900,8,0,TAU);c.fill();sun(c,x+200,900,4,'#fff',i===2?'#ff2a2a':'#2dff86',.6);c.fillStyle='#cfd3da';c.fillRect(x+188,930,24,6);
    c.save();c.globalCompositeOperation='screen';c.fillStyle=i===3?'rgba(255,60,150,.55)':'rgba(255,180,120,.12)';c.fillRect(x,1420,230,18);c.restore();}
  c.fillStyle=G2(c,0,1440,0,HH,[[0,'#16121a'],[1,'#050406']]);c.fillRect(0,1440,WW,HH-1440);c.save();c.globalCompositeOperation='screen';c.fillStyle=RG(c,875,1440,10,400,[[0,'rgba(255,60,150,.35)'],[1,'rgba(255,60,150,0)']]);c.fillRect(0,1200,WW,720);c.restore();
  dyDust(c,t,16,'#ffe0c0');};
// акция: витрина бутика, активисты со спины с плакатом, купюры летят, мигалки
P12.action=(c,t,o={})=>{const pol=o.pol??0,bl=pol*Math.max(0,Math.sin(t*TAU*3.2)),rd=pol*Math.max(0,Math.sin(t*TAU*3.2+Math.PI));skyG(c,[[0,'#06050a'],[1,'#0e0a10']]);
  c.fillStyle=G2(c,0,380,0,1300,[[0,'#ffe8c8'],[1,'#ffb070']]);c.fillRect(120,380,840,900);sun(c,540,800,40,'#fffaf0','#ffd090',.5);
  for(const x of [300,540,780]){c.fillStyle='rgba(120,80,60,.45)';c.beginPath();c.ellipse(x,560,34,42,0,0,TAU);c.fill();c.fillRect(x-60,600,120,560);}
  c.fillStyle='#1a1418';c.fillRect(120,300,840,80);tx(c,'BOUTIQUE',540,360,{f:'P',w:700,s:54,c:'#f6e3c2',ls:14});c.strokeStyle='#14100f';c.lineWidth=20;c.strokeRect(120,380,840,900);
  c.fillStyle=G2(c,0,1280,0,HH,[[0,'#2a2024'],[1,'#060507']]);c.fillRect(0,1280,WW,HH-1280);c.save();c.globalCompositeOperation='screen';c.fillStyle=G2(c,0,1280,0,HH,[[0,'rgba(255,200,140,.25)'],[1,'rgba(255,200,140,0)']]);c.fillRect(120,1280,840,640);c.restore();
  for(const [x,h] of [[260,820],[540,790],[820,840]])pers3(c,x,1900,h,{col:'#0a080c',rim:'#ffc890',ra:.85,sd:1,w:1.15});
  c.save();c.translate(540,1500);c.rotate(-.03);c.fillStyle='#f4efe4';c.fillRect(-380,-90,760,150);tx(c,'ДЕНЬГИ — ЧЕПУХА',0,20,{f:'O',w:700,s:78,c:'#c0182a'});c.restore();
  const bt=billTex();for(let i=0;i<26;i++){const ph=t*.7+H1(i*3.1)*7,x=(H1(i*7.7)*WW+Math.sin(ph)*40),y=((t*120+H1(i*9.1)*HH)%HH);c.save();c.translate(x,y);c.rotate(ph*2+i);c.scale(1,.3+.7*Math.abs(Math.sin(ph*3+i)));c.drawImage(bt,-48,-20,96,40);c.restore();}
  if(pol>0){c.save();c.globalCompositeOperation='screen';c.fillStyle=`rgba(47,107,255,${.35*bl})`;c.fillRect(0,0,WW/2,HH);c.fillStyle=`rgba(255,40,40,${.3*rd})`;c.fillRect(WW/2,0,WW/2,HH);c.restore();}
  dyDust(c,t,20,'#ffe0b0');};
// бег: подворотня, мигалки сзади, Юля впереди
P12.run=(c,t,o={})=>{const bl=Math.max(0,Math.sin(t*TAU*3.2)),rd=Math.max(0,Math.sin(t*TAU*3.2+Math.PI)),vx=540+Math.sin(t*5)*10,vy=900;skyG(c,[[0,'#05060a'],[1,'#0a0a0e']]);
  for(const sd of [-1,1]){c.fillStyle=sd<0?'#2a1a16':'#22140f';c.beginPath();c.moveTo(vx+sd*40,vy-60);c.lineTo(sd<0?0:WW,-200);c.lineTo(sd<0?0:WW,HH+200);c.lineTo(vx+sd*40,vy+60);c.closePath();c.fill();
    for(let k=0;k<12;k++){const u=k/12,x=lp(vx+sd*40,sd<0?0:WW,u*u),h=lp(120,2200,u*u);c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=2+u*6;c.beginPath();c.moveTo(x,vy-h/2);c.lineTo(x,vy+h/2);c.stroke();}}
  c.fillStyle=G2(c,0,vy,0,HH,[[0,'#0c0c10'],[1,'#1a1a20']]);c.beginPath();c.moveTo(vx-40,vy+60);c.lineTo(vx+40,vy+60);c.lineTo(WW+200,HH);c.lineTo(-200,HH);c.closePath();c.fill();
  for(let k=1;k<6;k++){const u=k/6;sun(c,vx,lp(vy-60,-100,u*u),lp(6,30,u),'#ffe0b0','#ffb35c',.9);}
  figA(c,{f:'yulia',x:vx+20,y:1330,s:.34,cloth:{k:'parka'},pose:'run',t,L:1,light:'#7aa8ff',la:.3});
  c.save();c.globalCompositeOperation='screen';c.fillStyle=G2(c,0,0,WW,0,[[0,`rgba(47,107,255,${.4*bl})`],[.45,'rgba(0,0,0,0)'],[.55,'rgba(0,0,0,0)'],[1,`rgba(255,40,40,${.35*rd})`]]);c.fillRect(0,0,WW,HH);c.restore();rain(c,t,.6,{n:120});};
// машина к больнице: лобовое стекло, дорога в 2D, корпус больницы с вывеской
P12.car=(c,t,o={})=>{const k=o.hosp??0;skyG(c,[[0,'#04060c'],[.5,'#0d1426'],[1,'#05060a']]);const vx=540,vy=900;
  const hs=lp(.45,1.1,k),w=900*hs,h=520*hs;c.fillStyle='#1b2230';c.fillRect(vx-w/2,vy-h,w,h);for(let j=0;j<6;j++)for(let i=0;i<12;i++){c.fillStyle=H2(i,j)>.4?'#cfe6ff':'#101622';c.fillRect(vx-w/2+w*(i+.25)/12,vy-h+h*(j+.3)/7,w/12*.5,h/7*.45);}
  c.fillStyle='#08111c';c.fillRect(vx-w*.38,vy-h*1.18,w*.76,h*.14);tx(c,'ДЕТСКАЯ БОЛЬНИЦА',vx,vy-h*1.08,{f:'M',w:800,s:h*.085,c:'#7fe3ff',glow:'#29c8ff',gb:18});sun(c,vx,vy-h*1.1,8,'#bff','#29c8ff',.4);
  c.fillStyle=G2(c,0,vy,0,HH,[[0,'#0a0b10'],[1,'#1c1c24']]);c.beginPath();c.moveTo(vx-30,vy);c.lineTo(vx+30,vy);c.lineTo(WW+300,HH);c.lineTo(-300,HH);c.closePath();c.fill();
  for(let i=0;i<8;i++){const u=((i/8)+t*.5)%1,y=lp(vy,HH,u*u),hh=lp(4,90,u*u);c.fillStyle=`rgba(233,227,208,${.6})`;c.fillRect(vx-lp(2,14,u*u),y,lp(4,28,u*u),hh);}
  for(let i=0;i<7;i++){const u=i/7;for(const sd of [-1,1]){const x=vx+sd*lp(40,700,u*u),y=lp(vy-40,200,u*u);sun(c,x,y,lp(3,18,u),'#fff0d0','#ffb35c',.8);}}
  c.fillStyle='#030304';c.beginPath();c.moveTo(0,0);c.lineTo(200,0);c.lineTo(40,1350);c.lineTo(0,1400);c.closePath();c.fill();c.beginPath();c.moveTo(WW,0);c.lineTo(WW-200,0);c.lineTo(WW-40,1350);c.lineTo(WW,1400);c.closePath();c.fill();
  c.fillStyle=G2(c,0,1340,0,HH,[[0,'#0d0e12'],[1,'#030304']]);c.beginPath();c.moveTo(0,1380);c.quadraticCurveTo(540,1260,WW,1380);c.lineTo(WW,HH);c.lineTo(0,HH);c.closePath();c.fill();
  for(let i=0;i<5;i++)sun(c,700+i*40,1440,4,'#fff',i%2?'#ff9a3c':'#3fd6ff',.8);
  c.save();c.globalCompositeOperation='screen';for(let i=0;i<80;i++){const x=H1(i*3.3)*WW,y=H1(i*7.7)*1300,r=3+H1(i)*9;c.fillStyle=`rgba(200,220,255,${.12+.15*H1(i*5)})`;c.beginPath();c.ellipse(x,y,r*.7,r,0,0,TAU);c.fill();}c.restore();};
// костюм клоуна на вешалке в коридоре больницы, медсестра рядом
P12.costume=(c,t,o={})=>{skyG(c,[[0,'#cfe0de'],[.5,'#9fbcb8'],[1,'#4a6462']]);const vx=540,vy=820;c.fillStyle='#7fc4b6';c.fillRect(0,vy,WW,HH);
  for(let i=0;i<5;i++){const u=i/5;c.fillStyle=`rgba(255,255,255,${.9-u*.4})`;const w=lp(500,60,u),y=lp(60,vy-140,u);c.fillRect(vx-w/2,y,w,lp(40,6,u));}
  for(const sd of [-1,1])for(let i=0;i<4;i++){const u=i/4,x=vx+sd*lp(520,120,u),w=lp(140,30,u),h=lp(700,160,u);c.fillStyle='#e3d7bc';c.fillRect(x-w/2,vy+60-h*.55,w,h);c.fillStyle='#3a4a52';c.fillRect(x-w*.25,vy+60-h*.4,w*.5,h*.18);}
  c.fillStyle=G2(c,0,vy+60,0,HH,[[0,'#8fa6a2'],[1,'#3a4a48']]);c.beginPath();c.moveTo(vx-120,vy+60);c.lineTo(vx+120,vy+60);c.lineTo(WW+300,HH);c.lineTo(-300,HH);c.closePath();c.fill();
  c.strokeStyle='#9aa3a8';c.lineWidth=12;c.beginPath();c.moveTo(260,1650);c.lineTo(260,600);c.lineTo(820,600);c.lineTo(820,1650);c.stroke();
  const q=2.6;c.save();c.translate(540,640);c.strokeStyle='#6a5a44';c.lineWidth=5;c.beginPath();c.moveTo(0,-40);c.lineTo(0,6*q);c.moveTo(-60,30);c.lineTo(0,6*q);c.lineTo(60,30);c.stroke();
  const P=new Path2D();P.moveTo(-70,30);P.lineTo(70,30);P.lineTo(92,190);P.lineTo(76,360);P.lineTo(18,366);P.lineTo(0,250);P.lineTo(-18,366);P.lineTo(-76,360);P.lineTo(-92,190);P.closePath();c.scale(2.2,2.2);
  c.fillStyle=G2(c,-90,0,90,0,[[0,'#d9a71c'],[.5,'#f6cf3a'],[1,'#c49214']]);c.fill(P);c.save();c.clip(P);c.fillStyle='#d9372a';for(let yy=40;yy<370;yy+=30)for(let xx=-90+(yy/30%2)*15;xx<92;xx+=30){c.beginPath();c.arc(xx,yy,6,0,TAU);c.fill();}c.restore();
  for(let i=0;i<9;i++){const a=Math.PI*(i/8);c.fillStyle=i%2?'#ffffff':'#7cc4ef';c.beginPath();c.ellipse(Math.cos(a)*-56,30+Math.sin(a)*4,16,11,a,0,TAU);c.fill();}c.restore();
  bigFace(c,'nurse',900,1250,1.2,{e:'smile',L:-1,light:'#eaf6ff',la:.25,cloth:{k:'scrub'}});
  const nz=o.nose??0;if(nz>0){c.save();c.globalAlpha=nz;c.filter='blur(26px)';c.fillStyle='#d8261c';c.beginPath();c.ellipse(540,1980,330,260,0,0,TAU);c.fill();c.restore();}dyDust(c,t,14,'#ffffff',2,.5);};
// клоун в зеркале больничного туалета
P12.clown=(c,t,o={})=>{skyG(c,[[0,'#8fa8a0'],[1,'#5a706a']]);c.strokeStyle='rgba(40,60,56,.4)';c.lineWidth=2;for(let x=0;x<WW;x+=90){c.beginPath();c.moveTo(x,0);c.lineTo(x,HH);c.stroke();}for(let y=0;y<HH;y+=90){c.beginPath();c.moveTo(0,y);c.lineTo(WW,y);c.stroke();}
  const M={x:170,y:250,w:740,h:1100};c.save();c.beginPath();c.rect(M.x,M.y,M.w,M.h);c.clip();c.fillStyle=G2(c,0,M.y,0,M.y+M.h,[[0,'#c9dad4'],[1,'#8aa49c']]);c.fillRect(0,0,WW,HH);
  bigFace(c,'clown',540,860,2.1,{e:o.e||'sad',L:-1,light:'#e9fbff',la:.25,cloth:{k:'clown'}});c.globalCompositeOperation='screen';c.fillStyle=G2(c,M.x,M.y,M.x+M.w,M.y+M.h,[[0,'rgba(255,255,255,0)'],[.4,'rgba(255,255,255,.12)'],[.44,'rgba(255,255,255,.02)'],[1,'rgba(255,255,255,0)']]);c.fillRect(0,0,WW,HH);c.restore();
  c.strokeStyle='#d8e0de';c.lineWidth=16;c.strokeRect(M.x-8,M.y-8,M.w+16,M.h+16);sun(c,540,170,20,'#f4ffff','#cfefff',.7);};
// карта полигона и подпись в кругу
P12.map=(c,t,o={})=>{deskBg(c,'#24160e');card2(c,mapTex(Math.round((o.zone??0)*20)/20),540,920,760,930,-.05,{sheen:1});lampPool(c,560,880,1150);};
P12.sig=(c,t,o={})=>{deskBg(c,'#24160e');card2(c,contractTex(1),540,1000,860,1214,.03,{sheen:1});const ck=o.circle??0;if(ck>0){c.save();c.strokeStyle='#d0141f';c.lineWidth=12;c.lineCap='round';c.beginPath();c.ellipse(500,1450,230,80,-.06,-1,-1+TAU*ck*1.05);c.stroke();c.restore();}lampPool(c,560,1100,1150);};
// пустой клуб: бетон, провода, лампа на проводе, пыль в луче, Миша с сумками
P12.empty=(c,t,o={})=>{const sw=Math.sin(t*1.4)*40;skyG(c,[[0,'#151517'],[1,'#0a0a0c']]);for(let i=0;i<30;i++){c.fillStyle=`rgba(0,0,0,${.15*H1(i)})`;c.beginPath();c.ellipse(H1(i*3)*WW,H1(i*7)*1500,60+80*H1(i*5),40+60*H1(i*9),0,0,TAU);c.fill();}
  c.strokeStyle='#08080a';c.lineWidth=4;for(let i=0;i<4;i++){c.beginPath();c.moveTo(0,200+i*90);c.quadraticCurveTo(540,260+i*90,WW,190+i*90);c.stroke();}
  c.strokeStyle='#111';c.lineWidth=3;c.beginPath();c.moveTo(540,0);c.lineTo(540+sw,420);c.stroke();sun(c,540+sw,430,22,'#fff2d8','#ffd9a0',1);
  c.save();c.globalCompositeOperation='screen';c.fillStyle=G2(c,0,430,0,1700,[[0,'rgba(255,225,180,.35)'],[1,'rgba(255,225,180,0)']]);c.beginPath();c.moveTo(540+sw,430);c.lineTo(1000+sw*1.5,1700);c.lineTo(80+sw*1.5,1700);c.closePath();c.fill();c.restore();dust(c,t,540+sw,430,-sw*.001,.7,1300,80,7,.8);
  c.fillStyle=G2(c,0,1400,0,HH,[[0,'#2a2826'],[1,'#0c0c0c']]);c.fillRect(0,1400,WW,HH-1400);
  c.strokeStyle='#8a8a86';c.lineWidth=10;c.beginPath();c.moveTo(130,1520);c.lineTo(220,980);c.lineTo(310,1520);c.stroke();for(let i=1;i<5;i++){c.beginPath();c.moveTo(lp(130,220,i/5),lp(1520,980,i/5));c.lineTo(lp(310,220,i/5),lp(1520,980,i/5));c.stroke();}
  if(o.view!=='bag')bigFace(c,'misha',560,1060,1.6,{e:o.e||'neutral',L:Math.sign(sw)||1,light:'#ffd9a0',la:.4,cloth:{k:'jacket',col:'#3a3532'},bt:700});
  for(const [x,y] of [[760,1520],[930,1560]]){c.fillStyle='rgba(0,0,0,.5)';c.beginPath();c.ellipse(x,y,130,24,0,0,TAU);c.fill();c.fillStyle=G2(c,0,y-130,0,y,[[0,'#4a4033'],[1,'#17130e']]);RR(c,x-120,y-120,240,120,30);c.fill();c.strokeStyle='#0c0a08';c.lineWidth=12;c.beginPath();c.moveTo(x-50,y-120);c.quadraticCurveTo(x,y-180,x+50,y-120);c.stroke();}
  dyDust(c,t,14,'#ffe0c0',3,.6);};
// телефон на сиденье: вызов «Вадим», экран гаснет
P12.phone=(c,t,o={})=>{const st=o.st??0,off=o.off??0;skyG(c,[[0,'#08090c'],[1,'#121216']]);const bb=bokeh('dyph',WW,800,30,['#ffb35c','#7ad8ff','#ff4aa6'],30,90,7,2);c.save();c.globalAlpha=.5;c.globalCompositeOperation='screen';c.drawImage(bb,0,0);c.restore();
  c.strokeStyle='rgba(255,255,255,.06)';c.setLineDash([12,12]);c.lineWidth=3;for(let i=1;i<4;i++){c.beginPath();c.moveTo(i*270,700);c.lineTo(i*270,HH);c.stroke();}c.setLineDash([]);
  c.save();c.translate(540,1060);c.rotate(-.08);c.fillStyle='rgba(0,0,0,.6)';c.filter='blur(24px)';c.fillRect(-230,-440,480,900);c.filter='none';c.fillStyle='#0a0a0c';RR(c,-240,-470,480,940,60);c.fill();c.strokeStyle='#4a4c52';c.lineWidth=4;c.stroke();
  c.drawImage(phoneTex(st,Math.round(off*10)/10),-215,-440,430,880);c.restore();c.save();c.globalCompositeOperation='screen';c.fillStyle=RG(c,540,1060,40,700,[[0,`rgba(120,160,255,${.25*(1-off)})`],[1,'rgba(120,160,255,0)']]);c.fillRect(0,0,WW,HH);c.restore();};
// сумка с деньгами в 2D (пол плоский), воспоминание — отдельно
P12.bag=(c,t,o={})=>{skyG(c,[[0,'#0a0807'],[.45,'#1e140c'],[1,'#080605']]);const save=texPlane;try{texPlane=()=>{};P11.bag(c,t,o);}finally{texPlane=save;}};
// реанимация: кровать, монитор, жалюзи, холодный свет
P12.icu=(c,t,o={})=>{const lampOn=o.lamp??1;skyG(c,[[0,'#0a1418'],[1,'#05090b']]);c.fillStyle='#0e1d30';c.fillRect(300,300,480,420);for(let y=300;y<720;y+=16){c.fillStyle='rgba(120,160,200,.25)';c.fillRect(300,y,480,7);}c.strokeStyle='#1a2a30';c.lineWidth=14;c.strokeRect(300,300,480,420);
  if(lampOn){c.save();c.globalCompositeOperation='screen';c.fillStyle=G2(c,0,0,0,1500,[[0,'rgba(200,235,255,.25)'],[1,'rgba(200,235,255,0)']]);c.beginPath();c.moveTo(540,0);c.lineTo(1000,1500);c.lineTo(80,1500);c.closePath();c.fill();c.restore();}
  c.fillStyle='#8a9aa0';c.fillRect(180,1180,720,30);c.fillStyle=G2(c,0,1000,0,1200,[[0,'#eef4f6'],[1,'#b9c8cc']]);c.beginPath();c.moveTo(200,1190);c.lineTo(200,1060);c.quadraticCurveTo(540,960,880,1060);c.lineTo(880,1190);c.closePath();c.fill();
  c.fillStyle='#f4f8f8';c.beginPath();c.ellipse(320,1020,90,40,0,0,TAU);c.fill();c.fillStyle='#3a4a50';c.fillRect(200,1210,20,300);c.fillRect(860,1210,20,300);
  c.fillStyle='#7a8a90';c.fillRect(940,800,8,700);c.fillStyle='#030806';RR(c,860,700,180,130,10);c.fill();c.save();c.beginPath();c.rect(870,710,160,110);c.clip();c.strokeStyle='#38ff8a';c.lineWidth=4;c.shadowColor='#38ff8a';c.shadowBlur=12;c.beginPath();
  for(let x=870;x<=1030;x+=2){const ph=((x-870)/160*2.5+t*1.2)%1,y=lampOn&&ph>.45&&ph<.52?765-40*Math.sin((ph-.45)/.07*Math.PI):765;x===870?c.moveTo(x,y):c.lineTo(x,y);}c.stroke();c.restore();sun(c,950,765,10,'#bfffd8','#38ff8a',.4);
  c.fillStyle='#7a8a90';c.fillRect(120,700,6,800);c.fillStyle='rgba(200,230,255,.7)';RR(c,95,700,56,90,10);c.fill();c.fillStyle=G2(c,0,1500,0,HH,[[0,'#0c1418'],[1,'#030506']]);c.fillRect(0,1500,WW,HH-1500);dyDust(c,t,14,'#cfeaff',4,.5);};
// приёмный покой: медсестра крупно за стойкой, сумка едет к ней
P12.give=(c,t,o={})=>{const k=o.k??0;skyG(c,[[0,'#dfeae8'],[.5,'#a9c4c0'],[1,'#5a706c']]);for(let i=0;i<6;i++){c.fillStyle=['#ffd34d','#ff7a59','#7ad3ff','#9be07a','#ff9ad1','#ffd34d'][i];c.save();c.translate(120+i*170,420+H1(i)*60);c.rotate((H1(i*3)-.5)*.2);c.fillStyle='#fbf6ea';c.fillRect(-60,-45,120,90);c.fillStyle=['#ffd34d','#ff7a59','#7ad3ff','#9be07a','#ff9ad1','#ffd34d'][i];c.beginPath();c.arc(0,-8,22,0,TAU);c.fill();c.fillRect(-40,20,80,12);c.restore();}
  bigFace(c,'nurse',540,940,2.0,{e:o.e||'scared',L:-1,light:'#fff1dc',la:.3,cloth:{k:'scrub'}});
  c.fillStyle=G2(c,0,1260,0,HH,[[0,'#e8ece6'],[1,'#8f958e']]);c.fillRect(0,1260,WW,HH-1260);c.fillStyle='#f6f8f4';c.fillRect(0,1240,WW,30);
  c.save();c.translate(lp(780,560,eio(k)),1250);c.scale(.6,.6);c.fillStyle='rgba(0,0,0,.4)';c.beginPath();c.ellipse(0,0,330,40,0,0,TAU);c.fill();c.fillStyle=G2(c,0,-260,0,0,[[0,'#3a3b43'],[.2,'#1c1d22'],[1,'#050506']]);RR(c,-320,-250,640,250,110);c.fill();c.fillStyle='#020203';c.beginPath();c.ellipse(-10,-245,250,40,0,0,TAU);c.fill();
  const bt=billTex();for(let i=0;i<7;i++){c.save();c.translate(-200+i*62,-262);c.rotate((H1(i)-.5)*.3);c.drawImage(bt,-55,-20,110,40);c.fillStyle='#d6a73c';c.fillRect(-10,-20,20,40);c.restore();}c.strokeStyle='#0c0c0f';c.lineWidth=26;c.lineCap='round';c.beginPath();c.moveTo(-160,-240);c.bezierCurveTo(-170,-420,-30,-420,-40,-240);c.stroke();c.restore();};
// Юля крупно на вокзале (для разговора)
P12.yvok=(c,t,o={})=>{skyG(c,[[0,'#04060e'],[.55,'#141e34'],[1,'#05070c']]);for(let i=0;i<14;i++)sun(c,40+i*80,520-i*6,6,'#fff0d0','#ffd090',.7);c.fillStyle='rgba(230,236,240,.2)';c.fillRect(0,760,WW,180);for(let i=0;i<14;i++){c.fillStyle='rgba(255,212,150,.35)';c.fillRect(i*80,790,60,46);}
  const bb=bokeh('dyyv',WW,HH,36,['#ffd090','#9ab0d0'],24,100,12,3);c.save();c.globalCompositeOperation='screen';c.drawImage(bb,0,0);c.restore();
  bigFace(c,'yulia',540,o.cy??960,o.s??2.6,{e:o.e||'sad',L:1,light:'#ffcf8a',la:.34,cloth:{k:'parka'}});c.save();c.globalCompositeOperation='screen';c.fillStyle=RG(c,180,800,40,700,[[0,'rgba(120,180,255,.2)'],[1,'rgba(120,180,255,0)']]);c.fillRect(0,0,WW,HH);c.restore();dyDust(c,t,24,'#d0e0ff');};
