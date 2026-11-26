"use strict";
/* «Духless» v5 (26.11): набор объёмной рисовки 2.5D для четырёх вариантов (dlx5.js).
   Камера с перспективой, текстура на плоскости в перспективе, плиты со скруглёнными углами (пропуск, телефон, карта),
   свет и тени, глубина резкости, объёмный текст, руки и фигуры людей, переходы (наезд с размытием, глитч, свайп).
   Разбор Андрея и Gemini (25.11): «в 99 % кадров Династии есть объём» — свет, тень, перспектива, глубина, руки, буквальность. */
const WW=W,HH=H;

/* ================= утилиты ================= */
const cl=(x,a=0,b=1)=>x<a?a:x>b?b:x,lp=(a,b,k)=>a+(b-a)*k;
const ss=(a,b,x)=>{const k=cl((x-a)/(b-a));return k*k*(3-2*k);};
const eo=k=>1-Math.pow(1-cl(k),3),ei=k=>Math.pow(cl(k),3),eio=k=>{k=cl(k);return k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;};
const eo5=k=>1-Math.pow(1-cl(k),5);
const spr=k=>k<=0?0:k>=1?1:1-Math.exp(-6.5*k)*Math.cos(11*k);
const H1=i=>{const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);};
const H2=(i,j)=>H1(i*57.31+j*131.71);
const n1=x=>{const i=Math.floor(x),f=x-i;return lp(H1(i),H1(i+1),f*f*(3-2*f))*2-1;};
function vn(x,y){const xi=Math.floor(x),yi=Math.floor(y),u=x-xi,v=y-yi,su=u*u*(3-2*u),sv=v*v*(3-2*v);return lp(lp(H2(xi,yi),H2(xi+1,yi),su),lp(H2(xi,yi+1),H2(xi+1,yi+1),su),sv);}
function fbm(x,y,o=4){let s=0,a=.5,f=1;for(let i=0;i<o;i++){s+=a*vn(x*f,y*f);a*=.5;f*=2.03;}return s;}
const mkc=(w,h)=>{const c=document.createElement('canvas');c.width=Math.ceil(w);c.height=Math.ceil(h);return c;};
const CA=new Map();
const cache=(k,w,h,fn)=>{let c=CA.get(k);if(!c){c=mkc(w,h);fn(c.getContext('2d'),c.width,c.height);CA.set(k,c);}return c;};
const rgba=(hex,a)=>{const n=parseInt(hex.slice(1),16);return `rgba(${n>>16},${n>>8&255},${n&255},${a})`;};
const mixc=(h1,h2,k)=>{const a=parseInt(h1.slice(1),16),b=parseInt(h2.slice(1),16),m=(s)=>Math.round(lp(a>>s&255,b>>s&255,k));return `rgb(${m(16)},${m(8)},${m(0)})`;};
const LG=(c,x0,y0,x1,y1,st)=>{const g=c.createLinearGradient(x0,y0,x1,y1);for(const [o,col] of st)g.addColorStop(o,col);return g;};
const RG=(c,x,y,r0,r1,st)=>{const g=c.createRadialGradient(x,y,r0,x,y,r1);for(const [o,col] of st)g.addColorStop(o,col);return g;};
const RR=(c,x,y,w,h,r)=>{c.beginPath();c.roundRect(x,y,w,h,r);};
const PL=(c,p)=>{c.beginPath();c.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)c.lineTo(p[i],p[i+1]);c.closePath();};
const PP=(c,p)=>{c.beginPath();c.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)c.lineTo(p[i][0],p[i][1]);c.closePath();};
const view=(c,s,x,y,r=0)=>{c.translate(WW/2,HH/2);if(r)c.rotate(r);c.scale(s,s);c.translate(-x,-y);};
const FM={U:'Unb',O:'Osw',M:'Man',J:'JBM',C:'Cav',P:'Play',T:'Mont',R:'Rub'};
function font(c,o){c.font=`${o.it?'italic ':''}${o.w||700} ${o.s||32}px ${FM[o.f||'M']}`;c.letterSpacing=(o.ls||0)+'px';}
function tx(c,s,x,y,o={}){if(!s)return;c.save();font(c,o);c.textAlign=o.al||'center';c.textBaseline=o.bl||'alphabetic';c.globalAlpha*=(o.a??1);if(o.glow){c.shadowColor=o.glow;c.shadowBlur=o.gb||20;}c.fillStyle=o.c||'#fff';c.fillText(s,x,y);c.restore();}
function tm(c,s,o={}){c.save();font(c,o);const w=c.measureText(s).width;c.restore();return w;}

/* ================= 3D-камера ================= */
// мир: x вправо, y вниз, z вглубь. pitch>0 — смотрит вниз, yaw>0 — вправо. P(x,y,z) → [экран x, экран y, глубина, масштаб]
function cam3(o){const yw=o.yaw||0,pt=o.pitch||0,rl=o.roll||0,cy=Math.cos(yw),sy=Math.sin(yw),cp=Math.cos(pt),sp=Math.sin(pt),cr=Math.cos(rl),sr=Math.sin(rl),f=o.f||1500,ox=o.cx??WW/2,oy=o.cy??HH/2;
  const P=(x,y,z)=>{const X=x-o.x,Y=y-o.y,Z=z-o.z,x1=X*cy-Z*sy,z1=X*sy+Z*cy,y2=Y*cp-z1*sp,z2=Y*sp+z1*cp,x3=x1*cr-y2*sr,y3=x1*sr+y2*cr,zz=Math.max(z2,2);return [ox+f*x3/zz,oy+f*y3/zz,zz,f/zz];};
  return {P,f,o};}
// камера «смотрит из E в T»
function lookAt(E,T,f=1500,roll=0){const dx=T[0]-E[0],dy=T[1]-E[1],dz=T[2]-E[2],h=Math.hypot(dx,dz);return {x:E[0],y:E[1],z:E[2],yaw:Math.atan2(dx,dz),pitch:Math.atan2(dy,h),roll,f};}
const camLerp=(a,b,k)=>{const o={};for(const key in a)o[key]=typeof a[key]==='number'?lp(a[key],b[key]??a[key],k):a[key];return o;};
// камера по ключам [[время, {x,y,z,yaw,pitch,roll,f}], …] с плавным ходом между ключами
function camKeys(K,u,ease=eio){if(u<=K[0][0])return K[0][1];for(let i=0;i<K.length-1;i++)if(u<K[i+1][0])return camLerp(K[i][1],K[i+1][1],ease((u-K[i][0])/(K[i+1][0]-K[i][0])));return K[K.length-1][1];}

/* текстура img на плоскость: точка (u,v)∈[0,1]² → O + u·U + v·V. Перспектива — сеткой треугольников */
function triTex(c,img,s0,s1,s2,d0,d1,d2){
  const mx=(d0[0]+d1[0]+d2[0])/3,my=(d0[1]+d1[1]+d2[1])/3;
  const ex=p=>{const dx=p[0]-mx,dy=p[1]-my,l=Math.hypot(dx,dy)||1;return [p[0]+dx/l*.9,p[1]+dy/l*.9];};
  const S1x=s1[0]-s0[0],S1y=s1[1]-s0[1],S2x=s2[0]-s0[0],S2y=s2[1]-s0[1],det=S1x*S2y-S2x*S1y;if(Math.abs(det)<1e-9)return;
  const D1x=d1[0]-d0[0],D1y=d1[1]-d0[1],D2x=d2[0]-d0[0],D2y=d2[1]-d0[1];
  const a=(D1x*S2y-D2x*S1y)/det,cc=(-D1x*S2x+D2x*S1x)/det,b=(D1y*S2y-D2y*S1y)/det,d=(-D1y*S2x+D2y*S1x)/det;
  const e=d0[0]-a*s0[0]-cc*s0[1],f=d0[1]-b*s0[0]-d*s0[1];
  const e0=ex(d0),e1=ex(d1),e2=ex(d2);
  c.save();c.beginPath();c.moveTo(e0[0],e0[1]);c.lineTo(e1[0],e1[1]);c.lineTo(e2[0],e2[1]);c.closePath();c.clip();
  c.transform(a,b,cc,d,e,f);c.drawImage(img,0,0);c.restore();}
function texPlane(c,cam,img,O,U,V,nx=8,ny=8){const sw=img.width,sh=img.height,G=[];
  for(let j=0;j<=ny;j++){const row=[];for(let i=0;i<=nx;i++){const u=i/nx,v=j/ny;row.push(cam.P(O[0]+U[0]*u+V[0]*v,O[1]+U[1]*u+V[1]*v,O[2]+U[2]*u+V[2]*v));}G.push(row);}
  c.save();c.imageSmoothingQuality='high';
  for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const a0=[i/nx*sw,j/ny*sh],a1=[(i+1)/nx*sw,j/ny*sh],a2=[(i+1)/nx*sw,(j+1)/ny*sh],a3=[i/nx*sw,(j+1)/ny*sh];
    triTex(c,img,a0,a1,a2,G[j][i],G[j][i+1],G[j+1][i+1]);triTex(c,img,a0,a2,a3,G[j][i],G[j+1][i+1],G[j+1][i]);}
  c.restore();return G;}
// точка плоскости стола (y=0): (x,z) → экран
const onT=(cam,x,z,y=0)=>cam.P(x,y,z);
// проекция точек полилинии (мир) → экран
const projPts=(cam,pts)=>pts.map(p=>cam.P(p[0],p[1],p[2]));

/* плита со скруглёнными углами на столе: o={x,z,w,d,h,r,a,top,side,sh,shOff,light} — центр (x,z), поворот a вокруг вертикали */
function slabOutline(o,y,n=6){const pts=[],hw=o.w/2,hd=o.d/2,r=Math.min(o.r||0,hw,hd),ca=Math.cos(o.a||0),sa=Math.sin(o.a||0);
  const cs=[[hw-r,hd-r,0],[-hw+r,hd-r,Math.PI/2],[-hw+r,-hd+r,Math.PI],[hw-r,-hd+r,Math.PI*1.5]];
  for(const [cx,cz,a0] of cs)for(let i=0;i<=n;i++){const a=a0+i/n*Math.PI/2,lx=cx+Math.cos(a)*r,lz=cz+Math.sin(a)*r;pts.push([o.x+lx*ca-lz*sa,y,o.z+lx*sa+lz*ca]);}
  return pts;}
function slabShadow(c,cam,o,bl=18,a=.55){const off=o.shOff||[30,0,40],pts=slabOutline({...o,x:o.x+off[0],z:o.z+off[2]},0,4).map(p=>cam.P(p[0],p[1],p[2]));
  c.save();c.filter=`blur(${bl}px)`;c.fillStyle=`rgba(0,0,0,${a})`;PP(c,pts);c.fill();c.restore();}
function slab(c,cam,o){const h=o.h||4,top=slabOutline(o,-h),bot=slabOutline(o,0),T=top.map(p=>cam.P(p[0],p[1],p[2])),B=bot.map(p=>cam.P(p[0],p[1],p[2])),n=T.length;
  // борта: только те, что смотрят в камеру
  const L=o.light||[-.6,-.8];
  for(let i=0;i<n;i++){const j=(i+1)%n,q=[T[i],T[j],B[j],B[i]],cr=(q[1][0]-q[0][0])*(q[3][1]-q[0][1])-(q[1][1]-q[0][1])*(q[3][0]-q[0][0]);if(cr>0)continue;
    const nx=-(top[j][2]-top[i][2]),nz=top[j][0]-top[i][0],nl=Math.hypot(nx,nz)||1,sh=cl(.5+.5*((nx/nl)*L[0]+(nz/nl)*L[1]));
    c.fillStyle=o.sideF?o.sideF(sh):mixc(o.side0||'#0b0b0d',o.side1||'#55565c',sh);PP(c,q);c.fill();}
  // крышка: текстура с клипом по скруглённому контуру
  c.save();PP(c,T);c.clip();
  if(o.top){const ca=Math.cos(o.a||0),sa=Math.sin(o.a||0),hw=o.w/2,hd=o.d/2;const O=[o.x+(-hw)*ca-(hd)*sa,-h,o.z+(-hw)*sa+(hd)*ca],U=[o.w*ca,0,o.w*sa],V=[o.d*sa,0,-o.d*ca];texPlane(c,cam,o.top,O,U,V,o.nx||6,o.ny||8);}
  else{c.fillStyle=o.fill||'#222';c.fill();}
  if(o.after)o.after(c,T);
  c.restore();
  if(o.rim){c.save();c.strokeStyle=o.rim;c.lineWidth=o.rimW||1.5;PP(c,T);c.stroke();c.restore();}
  return T;}
// блик по крышке: полоса света проходит по контуру T (k — 0..1 положение)
function sheen(c,T,k,a=.55,ang=.9,wid=.16){let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const p of T){x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1]);}
  const cx=lp(x0-300,x1+300,k),cy=(y0+y1)/2,dx=Math.cos(ang)*900,dy=Math.sin(ang)*900;
  c.save();PP(c,T);c.clip();c.globalCompositeOperation='screen';c.fillStyle=LG(c,cx-dy*wid,cy+dx*wid,cx+dy*wid,cy-dx*wid,[[0,'rgba(255,255,255,0)'],[.5,`rgba(255,250,240,${a})`],[1,'rgba(255,255,255,0)']]);c.fillRect(x0-20,y0-20,x1-x0+40,y1-y0+40);c.restore();}

/* ================= свет, воздух, глубина ================= */
function noiseTex(k,w,h,sc,oct){return cache('nz'+k,w,h,(x,Wd,Hd)=>{const im=x.createImageData(Wd,Hd),d=im.data;for(let j=0;j<Hd;j++)for(let i=0;i<Wd;i++){const v=fbm(i/sc+3.3,j/sc+7.7,oct),p=(j*Wd+i)*4;d[p]=d[p+1]=d[p+2]=v*255;d[p+3]=255;}x.putImageData(im,0,0);});}
function coneSprite(len,spread,col){const half=Math.tan(spread/2)*len,pad=70,w=half*2+pad*2,h=len+pad;
  return cache(`cone${len|0}|${spread.toFixed(3)}|${col}`,w,h,x=>{const t=mkc(w,h),y=t.getContext('2d');
    for(let i=0;i<7;i++){const k=1-i/7,hh=half*(.3+.7*k);y.beginPath();y.moveTo(w/2-5*k,0);y.lineTo(w/2+5*k,0);y.lineTo(w/2+hh,len);y.lineTo(w/2-hh,len);y.closePath();y.fillStyle=LG(y,0,0,0,len,[[0,rgba(col,.17)],[.3,rgba(col,.08)],[1,rgba(col,0)]]);y.fill();}
    x.filter='blur(16px)';x.drawImage(t,0,0);});}
function beam(c,x,y,ang,spread,len,col,a=1){if(a<=0)return;const s=coneSprite(len,spread,col);c.save();c.translate(x,y);c.rotate(ang);c.globalCompositeOperation='screen';c.globalAlpha*=a;c.drawImage(s,-s.width/2,0);c.restore();}
function dust(c,t,x,y,ang,spread,len,n,seed=1,a=1){
  c.save();c.translate(x,y);c.rotate(ang);c.globalCompositeOperation='screen';c.fillStyle='#fff';const tn=Math.tan(spread/2);
  for(let i=0;i<n;i++){const d=((H1(seed+i*3.17)+t*(.006+.012*H1(i*1.9+seed)))%1),al=d*len,w=tn*al;
    const ac=(H1(seed+i*7.73)*2-1)*w*.85+Math.sin(t*.6+i)*8,r=.9+H1(i*1.31+seed)*2.4;
    const k=a*(.25+.75*H1(i*9.1+seed))*Math.sin(Math.PI*d)*(1-Math.abs(ac)/(w+1))*(.6+.4*Math.sin(t*2+i));
    if(k<=.01)continue;c.globalAlpha=k;c.fillRect(ac-r/2,al-r/2,r,r);}
  c.restore();}
function glowDot(c,x,y,r,col,a=1){if(a<=0)return;c.save();c.globalCompositeOperation='screen';c.globalAlpha*=cl(a,0,4);c.fillStyle=RG(c,x,y,0,r,[[0,rgba(col,1)],[.22,rgba(col,.45)],[1,rgba(col,0)]]);c.fillRect(x-r,y-r,2*r,2*r);c.restore();}
function pool(c,x,y,rx,ry,col,a){c.save();c.globalCompositeOperation='screen';c.globalAlpha*=a;c.translate(x,y);c.scale(1,ry/rx);c.fillStyle=RG(c,0,0,0,rx,[[0,rgba(col,.55)],[.45,rgba(col,.2)],[1,rgba(col,0)]]);c.fillRect(-rx,-rx,2*rx,2*rx);c.restore();}
function bokeh(key,w,h,n,cols,r0,r1,seed=1,bl=0){return cache('bk'+key,w,h,x=>{const t=mkc(w,h),y=t.getContext('2d');y.globalCompositeOperation='lighter';
  for(let i=0;i<n;i++){const px=H1(seed+i*3.1)*w,py=H1(seed+i*7.7)*h,r=lp(r0,r1,H1(seed+i*1.9)**2),col=cols[i%cols.length],a=.05+.13*H1(seed+i*5.3);
    y.fillStyle=RG(y,px,py,0,r,[[0,rgba(col,a*.65)],[.8,rgba(col,a)],[.92,rgba(col,a*1.3)],[1,rgba(col,0)]]);y.beginPath();y.arc(px,py,r,0,TAU);y.fill();}
  if(bl)x.filter=`blur(${bl}px)`;x.drawImage(t,0,0);});}
let SMK=null;
function smokeSprites(){if(SMK)return SMK;SMK=[];const S=160;
  for(let v=0;v<4;v++){const c=mkc(S,S),x=c.getContext('2d'),im=x.createImageData(S,S),d=im.data;
    for(let j=0;j<S;j++)for(let i=0;i<S;i++){const dx=(i-S/2)/(S/2),dy=(j-S/2)/(S/2),r=Math.sqrt(dx*dx+dy*dy),m=Math.max(0,1-r);
      const nn=fbm(i/34+v*11.3,j/34+v*7.1,4),a=cl(Math.pow(m,1.5)*(nn*2-.5))*255,p=(j*S+i)*4;d[p]=d[p+1]=d[p+2]=255;d[p+3]=a;}
    x.putImageData(im,0,0);SMK.push(c);}
  return SMK;}
function fog(c,t,y0,o){const S=smokeSprites(),n=o.n||14;c.save();c.globalCompositeOperation='screen';
  for(let i=0;i<n;i++){const sp=o.sp*(.6+.8*H1(i*3.1+o.seed)),x=((H1(i*7.7+o.seed)*(WW+900)+t*sp)%(WW+900))-450,y=y0+(H1(i*5.3+o.seed)-.5)*o.h,r=o.r*(.7+.6*H1(i*1.9+o.seed));
    c.globalAlpha=o.a*(.5+.5*H1(i*9.1+o.seed));c.drawImage(S[i%4],x-r,y-r*.45,r*2,r*.9);}
  c.restore();}
function rain(c,t,a,o={}){c.save();c.globalCompositeOperation='screen';c.strokeStyle=`rgba(210,225,255,${.18*a})`;c.lineWidth=o.lw||1.7;c.beginPath();
  const n=o.n||170,sl=o.sl||.16;for(let i=0;i<n;i++){const x=(H1(i*3.3)*(WW+300)-150+t*90*sl)%(WW+300),sp=1500+900*H1(i*5.1),y=((H1(i*7.7)*(HH+400))+t*sp)%(HH+400)-200,l=34+50*H1(i*1.3);c.moveTo(x,y);c.lineTo(x+l*sl,y+l);}
  c.stroke();c.restore();}
// тень-спрайт прямоугольника (кэш)
function shadowSpr(key,w,h,bl,a){return cache('sh'+key,w+bl*6,h+bl*6,x=>{x.filter=`blur(${bl}px)`;x.fillStyle=`rgba(0,0,0,${a})`;x.fillRect(bl*3,bl*3,w,h);});}

/* глубина резкости: поверх кадра — его размытая копия по маске (сверху/снизу размыто, середина резкая) */
const DOFC=mkc(WW/2,HH/2);
function dof(c,o){const s=DOFC.getContext('2d');reset(s);s.clearRect(0,0,DOFC.width,DOFC.height);s.filter=`blur(${(o.px||14)/2}px)`;s.drawImage(c.canvas,0,0,DOFC.width,DOFC.height);s.filter='none';
  s.globalCompositeOperation='destination-in';
  if(o.radial){const [x,y,r0,r1]=o.radial;s.fillStyle=RG(s,x/2,y/2,r0/2,r1/2,[[0,'rgba(0,0,0,0)'],[1,`rgba(0,0,0,${o.a??1})`]]);}
  else s.fillStyle=LG(s,0,0,0,DOFC.height,[[0,`rgba(0,0,0,${o.top??1})`],[o.m0??.3,'rgba(0,0,0,0)'],[o.m1??.7,'rgba(0,0,0,0)'],[1,`rgba(0,0,0,${o.bot??1})`]]);
  s.fillRect(0,0,DOFC.width,DOFC.height);s.globalCompositeOperation='source-over';
  c.save();reset(c);c.imageSmoothingQuality='high';c.drawImage(DOFC,0,0,WW,HH);c.restore();}
// цветокор: тёплые света, холодные тени (мягкий свет)
function grade(c,warm='#ff9a3c',cool='#1b3b6b',a=.22){c.save();reset(c);c.globalCompositeOperation='soft-light';c.globalAlpha=a;c.fillStyle=LG(c,0,0,WW,HH,[[0,cool],[1,warm]]);c.fillRect(0,0,WW,HH);c.restore();}
function vignette(c,a=.78){c.drawImage(cache('vig'+a,WW,HH,x=>{x.fillStyle=RG(x,WW/2,HH*.47,HH*.26,HH*.82,[[0,'rgba(0,0,0,0)'],[.55,`rgba(0,0,0,${a*.23})`],[1,`rgba(0,0,0,${a})`]]);x.fillRect(0,0,WW,HH);}),0,0);}

/* ================= объёмный текст ================= */
// спрайт: лицо (градиент), торец (слои назад), фаска. o: {f,w,s,depth,dir:[dx,dy],face:[цвета],side:[цвета],stroke}
function ext3(key,s,o){const fs=o.s,pad=o.depth+fs*.4,w=Math.ceil(tm(null||document.createElement('canvas').getContext('2d'),s,o)+pad*2+fs*.2),h=Math.ceil(fs*1.5+pad*2);
  return cache('ext'+key,w,h,(x)=>{font(x,o);x.textAlign='center';x.textBaseline='middle';const cx=w/2-o.dir[0]*o.depth/2,cy=h/2-o.dir[1]*o.depth/2;
    for(let i=o.depth;i>0;i--){const k=i/o.depth;x.fillStyle=mixc(o.side[0],o.side[1],k);x.fillText(s,cx+o.dir[0]*i,cy+o.dir[1]*i);}
    x.fillStyle=LG(x,0,cy-fs*.55,0,cy+fs*.55,o.face.map((col,i)=>[i/(o.face.length-1),col]));x.fillText(s,cx,cy);
    if(o.stroke){x.lineWidth=o.sw||3;x.strokeStyle=o.stroke;x.strokeText(s,cx,cy);}
    x.globalCompositeOperation='source-atop';x.fillStyle=LG(x,0,cy-fs*.6,0,cy-fs*.1,[[0,'rgba(255,255,255,.55)'],[1,'rgba(255,255,255,0)']]);x.fillRect(0,0,w,h);});}
// маска лица текста (для блика)
function extMask(key,s,o){const spr=ext3(key,s,o),w=spr.width,h=spr.height;return cache('extm'+key,w,h,x=>{font(x,o);x.textAlign='center';x.textBaseline='middle';x.fillStyle='#fff';x.fillText(s,w/2-o.dir[0]*o.depth/2,h/2-o.dir[1]*o.depth/2);});}
const SHN=mkc(1600,600);
function extShine(c,key,s,o,x,y,sc,k,a=.9){const m=extMask(key,s,o),w=m.width,h=m.height,g=SHN.getContext('2d');reset(g);g.clearRect(0,0,w,h);g.drawImage(m,0,0);g.globalCompositeOperation='source-in';
  const bx=lp(-w*.3,w*1.3,k);g.fillStyle=LG(g,bx-120,0,bx+120,h,[[0,'rgba(255,255,255,0)'],[.5,`rgba(255,255,240,${a})`],[1,'rgba(255,255,255,0)']]);g.fillRect(0,0,w,h);
  c.save();c.globalCompositeOperation='screen';c.translate(x,y);c.scale(sc,sc);c.drawImage(SHN,0,0,w,h,-w/2,-h/2,w,h);c.restore();}

/* ================= переходы ================= */
const TA=mkc(WW,HH),TB=mkc(WW,HH),TC=mkc(WW,HH);
// наезд с размытием «в глубину» (zoom blur): src — холст, s — масштаб, n — копий
function zoomBlur(c,src,cx,cy,s,amt,n=7,a=1){c.save();reset(c);c.globalAlpha=a;c.translate(cx,cy);c.scale(s,s);c.translate(-cx,-cy);c.drawImage(src,0,0);c.restore();
  if(amt<=.002)return;for(let i=1;i<=n;i++){const k=1+amt*i/n;c.save();reset(c);c.globalAlpha=a*.38*(1-i/(n+1));c.translate(cx,cy);c.scale(s*k,s*k);c.translate(-cx,-cy);c.drawImage(src,0,0);c.restore();}}
// глитч: горизонтальные полосы со сдвигом и разведение каналов
function glitch(c,src,k,seed,shift=1){const g=TC.getContext('2d');reset(g);const n=26;
  for(let i=0;i<n;i++){const y0=Math.floor(H1(seed+i*3.7)*HH),h=Math.floor(12+H1(seed+i*5.1)*140*k),dx=(H1(seed+i*9.3)-.5)*900*k*shift;if(H1(seed+i*2.2)>.55+.4*(1-k))continue;
    g.drawImage(src,0,y0,WW,h,dx,y0,WW,h);}
  c.drawImage(TC,0,0);
  const r=26*k;if(r<1)return;c.save();reset(c);c.globalCompositeOperation='screen';c.globalAlpha=.55*k;c.filter='sepia(1) saturate(9) hue-rotate(-50deg)';c.drawImage(src,-r,0);c.filter='sepia(1) saturate(9) hue-rotate(150deg)';c.drawImage(src,r,0);c.restore();}

/* ================= руки ================= */
const SKIN={d:'#8a5844',m:'#d4a086',l:'#efc6ae',h:'#fff0e4',nail:'#f6d9cc'};
// палец/цилиндр: полилиния pts (экран), толщина w, свет L=[lx,ly] (единичный, откуда свет)
function limb(c,pts,w,L,o={}){const S=o.skin||SKIN;c.save();c.lineCap='round';c.lineJoin='round';
  const path=(dx,dy)=>{c.beginPath();c.moveTo(pts[0][0]+dx,pts[0][1]+dy);for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0]+dx,pts[i][1]+dy);};
  path(0,0);c.strokeStyle=S.d;c.lineWidth=w+2.5;c.stroke();
  path(-L[0]*w*.05,-L[1]*w*.05);c.strokeStyle=S.m;c.lineWidth=w;c.stroke();
  path(L[0]*w*.16,L[1]*w*.16);c.strokeStyle=S.l;c.globalAlpha=.9;c.lineWidth=w*.52;c.stroke();
  path(L[0]*w*.28,L[1]*w*.28);c.strokeStyle=S.h;c.globalAlpha=.45;c.lineWidth=w*.16;c.stroke();
  c.globalAlpha=1;
  if(o.nail){const n=pts.length,a=pts[n-2],b=pts[n-1],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,ux=dx/l,uy=dy/l;
    c.save();c.translate(b[0]-ux*w*.28+(o.nail.side||0)*-uy*w*.12,b[1]-uy*w*.28+(o.nail.side||0)*ux*w*.12);c.rotate(Math.atan2(uy,ux));
    c.fillStyle=S.nail;c.globalAlpha=o.nail.a??.85;c.beginPath();c.ellipse(0,0,w*.36,w*.3,0,0,TAU);c.fill();c.strokeStyle='rgba(120,70,55,.35)';c.lineWidth=1.2;c.stroke();c.restore();}
  if(o.creases)for(const q of o.creases){c.strokeStyle='rgba(110,60,45,.45)';c.lineWidth=1.6;c.beginPath();c.arc(q[0],q[1],w*.3,q[2]-.7,q[2]+.7);c.stroke();}
  c.restore();}
// кисть тыльной стороной: контур poly (экран), градиент по направлению света
function palm(c,poly,L,o={}){const S=o.skin||SKIN;let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const p of poly){x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1]);}
  const cx=(x0+x1)/2,cy=(y0+y1)/2,R=Math.max(x1-x0,y1-y0)*.6;
  c.save();c.beginPath();c.moveTo(poly[0][0],poly[0][1]);for(let i=1;i<poly.length;i++){const p=poly[i-1],q=poly[i];c.quadraticCurveTo(p[0],p[1],(p[0]+q[0])/2,(p[1]+q[1])/2);}c.closePath();
  c.fillStyle=LG(c,cx+L[0]*R,cy+L[1]*R,cx-L[0]*R,cy-L[1]*R,[[0,S.l],[.45,S.m],[1,S.d]]);c.fill();
  c.strokeStyle='rgba(90,48,36,.55)';c.lineWidth=2;c.stroke();
  c.clip();c.globalCompositeOperation='screen';c.fillStyle=RG(c,cx+L[0]*R*.45,cy+L[1]*R*.45,0,R*.7,[[0,'rgba(255,225,205,.35)'],[1,'rgba(255,225,205,0)']]);c.fillRect(x0-50,y0-50,x1-x0+100,y1-y0+100);
  c.restore();}
// рукав пиджака с манжетой рубашки и запонкой: от точки w (запястье) в сторону d (к краю кадра)
function sleeve(c,wx,wy,dx,dy,wd,L,o={}){const l=Math.hypot(dx,dy),ux=dx/l,uy=dy/l,nx=-uy,ny=ux;
  c.save();
  // манжета
  const cuff=wd*.34;PL(c,[wx+nx*wd*.47,wy+ny*wd*.47,wx-nx*wd*.47,wy-ny*wd*.47,wx-nx*wd*.5+ux*cuff,wy-ny*wd*.5+uy*cuff,wx+nx*wd*.5+ux*cuff,wy+ny*wd*.5+uy*cuff]);
  c.fillStyle=LG(c,wx+nx*wd*.5,wy+ny*wd*.5,wx-nx*wd*.5,wy-ny*wd*.5,[[0,'#f4f4f6'],[.6,'#d5d8de'],[1,'#8f949e']]);c.fill();
  if(o.link!==false){const lx=wx+ux*cuff*.5-nx*wd*.12,ly=wy+uy*cuff*.5-ny*wd*.12;c.fillStyle=RG(c,lx-3,ly-3,1,wd*.07,[[0,'#fff6d0'],[.5,'#d9a640'],[1,'#6e4a10']]);c.beginPath();c.arc(lx,ly,wd*.065,0,TAU);c.fill();}
  // рукав
  const s0=cuff*.85,sx=wx+ux*s0,sy=wy+uy*s0,ex=wx+ux*l,ey=wy+uy*l,w2=wd*.62,w3=wd*.78;
  PL(c,[sx+nx*w2,sy+ny*w2,sx-nx*w2,sy-ny*w2,ex-nx*w3,ey-ny*w3,ex+nx*w3,ey+ny*w3]);
  const sg=LG(c,sx+nx*w2,sy+ny*w2,sx-nx*w2,sy-ny*w2,[[0,o.suitL||'#3b4150'],[.35,o.suit||'#1c2029'],[1,o.suitD||'#08090c']]);c.fillStyle=sg;c.fill();
  c.strokeStyle='rgba(255,255,255,.08)';c.lineWidth=2;c.beginPath();c.moveTo(sx+nx*w2*.6,sy+ny*w2*.6);c.lineTo(ex+nx*w3*.6,ey+ny*w3*.6);c.stroke();
  c.restore();}

/* ================= фигуры (силуэт с контровым светом) ================= */
// человек со спины по пояс: (x,y) — центр плеч, s — масштаб; o.rim — цвет контура, o.light — сторона света (-1 слева, 1 справа)
function manBack(c,x,y,s,o={}){c.save();c.translate(x,y);c.scale(s,s);const rim=o.rim||'#ffcf8a',side=o.light||-1;
  const body=()=>{c.beginPath();c.moveTo(-190,40);c.bezierCurveTo(-200,-10,-170,-52,-110,-62);c.lineTo(-48,-78);c.bezierCurveTo(-40,-96,-34,-110,-30,-118);c.lineTo(30,-118);c.bezierCurveTo(34,-110,40,-96,48,-78);c.lineTo(110,-62);c.bezierCurveTo(170,-52,200,-10,190,40);c.lineTo(205,420);c.lineTo(-205,420);c.closePath();};
  const head=()=>{c.beginPath();c.ellipse(0,-190,58,76,0,0,TAU);};
  // тело
  body();c.fillStyle=o.suit||'#0b0d12';c.fill();
  c.save();body();c.clip();c.fillStyle=LG(c,side*-200,0,side*200,0,[[0,rgba(rim.length===7?rim:'#ffcf8a',.0)],[1,'rgba(0,0,0,0)']]);
  c.globalCompositeOperation='screen';c.strokeStyle=rgba(rim,.75);c.lineWidth=7;c.filter='blur(3px)';body();c.stroke();c.filter='none';
  c.fillStyle=LG(c,0,-120,0,420,[[0,'rgba(255,255,255,.06)'],[1,'rgba(255,255,255,0)']]);c.fillRect(-220,-130,440,560);c.restore();
  // воротник рубашки
  c.fillStyle='#d9dce3';c.beginPath();c.moveTo(-34,-116);c.lineTo(34,-116);c.lineTo(28,-92);c.lineTo(-28,-92);c.closePath();c.fill();
  // шея
  c.fillStyle='#2a1c17';c.beginPath();c.moveTo(-30,-150);c.lineTo(30,-150);c.lineTo(34,-112);c.lineTo(-34,-112);c.closePath();c.fill();
  // голова и волосы
  head();c.fillStyle='#120d0b';c.fill();c.save();head();c.clip();c.globalCompositeOperation='screen';c.strokeStyle=rgba(rim,.8);c.lineWidth=8;c.filter='blur(3px)';head();c.stroke();c.restore();
  c.fillStyle='#2b1d17';c.beginPath();c.ellipse(side*-55,-185,10,22,side*.2,0,TAU);c.fill();c.beginPath();c.ellipse(side*55,-185,10,22,-side*.2,0,TAU);c.fill();
  c.restore();}
// толпа силуэтов (очередь): позиции на экране [x,y,s], размыты
function crowd(c,list,col='#07070a',rim='#ff3e9a'){for(const [x,y,s,sd] of list){c.save();c.translate(x,y);c.scale(s,s);
  c.fillStyle=col;c.beginPath();c.ellipse(0,-150,36,46,0,0,TAU);c.fill();c.beginPath();c.moveTo(-95,30);c.bezierCurveTo(-100,-40,-80,-80,-40,-90);c.lineTo(40,-90);c.bezierCurveTo(80,-80,100,-40,95,30);c.lineTo(110,400);c.lineTo(-110,400);c.closePath();c.fill();
  c.globalCompositeOperation='screen';c.strokeStyle=rgba(rim,.55);c.lineWidth=5;c.beginPath();c.arc(0,-150,40,Math.PI*(sd>0?1.6:.9),Math.PI*(sd>0?2.4:1.7));c.stroke();c.restore();}}

/* ================= монтаж: планы, переходы, HUD, субтитры ================= */
// план: {a — начало, tr — переход на него, f(c,t,u)}
function shotAt(SH,t){let i=0;while(i<SH.length-1&&t>=SH[i+1].a)i++;return i;}
function drawShot(c,s,t){c.save();c.fillStyle='#000';c.fillRect(0,0,WW,HH);s.f(c,t,t-s.a);c.restore();}
const TRD={cut:0,blur:.42,punch:.32,flash:.36,whip:.34,glitch:.3,zoom:.42,swipeUp:.36};
function composite(c,p,n,k,kind,t,seed){
  const a=TA.getContext('2d'),b=TB.getContext('2d');reset(a);reset(b);
  if(kind==='blur'){drawShot(a,p,t);drawShot(b,n,t);const b1=24*ss(0,.6,k),b2=24*(1-ss(.4,1,k));
    c.filter=b1>.3?`blur(${b1.toFixed(1)}px)`:'none';c.drawImage(TA,0,0);c.globalAlpha=ss(.2,.8,k);c.filter=b2>.3?`blur(${b2.toFixed(1)}px)`:'none';c.drawImage(TB,0,0);c.globalAlpha=1;c.filter='none';}
  else if(kind==='punch'){
    if(k<.5){const e=ei(k*2);drawShot(a,p,t);zoomBlur(c,TA,WW/2,HH/2,1+.3*e,.12*e,5);}
    else{const e=eo((k-.5)*2);drawShot(b,n,t);zoomBlur(c,TB,WW/2,HH/2,1.18-.18*e,.1*(1-e),5);}
    c.fillStyle=`rgba(255,255,255,${(.16*Math.max(0,1-Math.abs(k-.5)*5)).toFixed(3)})`;c.fillRect(0,0,WW,HH);}
  else if(kind==='zoom'){ // пролёт вперёд: старый план улетает в камеру, новый выходит из глубины
    if(k<.5){const e=ei(k*2);drawShot(a,p,t);zoomBlur(c,TA,WW/2,HH*.45,1+1.6*e,.35*e,8);}
    else{const e=eo((k-.5)*2);drawShot(b,n,t);zoomBlur(c,TB,WW/2,HH*.45,lp(.62,1,e),.28*(1-e),8);}
    const fl=Math.max(0,1-Math.abs(k-.5)*4);if(fl>0){c.save();c.globalCompositeOperation='screen';c.fillStyle=RG(c,WW/2,HH*.45,0,900,[[0,`rgba(255,245,230,${.55*fl})`],[1,'rgba(255,245,230,0)']]);c.fillRect(0,0,WW,HH);c.restore();}}
  else if(kind==='flash'){drawShot(c,k<.5?p:n,t);c.fillStyle=`rgba(255,248,240,${(.75*Math.pow(Math.max(0,1-Math.abs(k-.5)*2),2)).toFixed(3)})`;c.fillRect(0,0,WW,HH);}
  else if(kind==='whip'){const e=eio(k);drawShot(a,p,t);drawShot(b,n,t);c.filter=`blur(${(22*Math.sin(Math.PI*k)).toFixed(1)}px)`;c.drawImage(TA,-WW*e,0);c.drawImage(TB,WW*(1-e),0);c.filter='none';}
  else if(kind==='swipeUp'){const e=eio(k);drawShot(a,p,t);drawShot(b,n,t);c.filter=`blur(${(18*Math.sin(Math.PI*k)).toFixed(1)}px)`;c.drawImage(TA,0,-HH*e);c.drawImage(TB,0,HH*(1-e));c.filter='none';}
  else if(kind==='glitch'){drawShot(a,k<.5?p:n,t);c.drawImage(TA,0,0);glitch(c,TA,Math.sin(Math.PI*k),seed||7);}
}
function playShots(c,SH,t){const k=shotAt(SH,t),s0=SH[k],nx=SH[k+1];let tr=null;
  if(nx&&nx.tr!=='cut'&&t>=nx.a-TRD[nx.tr]/2)tr=[s0,nx,(t-(nx.a-TRD[nx.tr]/2))/TRD[nx.tr],nx.tr,k+1];
  else if(k>0&&s0.tr!=='cut'&&t<s0.a+TRD[s0.tr]/2)tr=[SH[k-1],s0,(t-(s0.a-TRD[s0.tr]/2))/TRD[s0.tr],s0.tr,k];
  if(tr)composite(c,tr[0],tr[1],cl(tr[2]),tr[3],t,tr[4]*13.7);else drawShot(c,s0,t);}

// HUD в одну строку: слева «● MOSCOW · 2012», справа тонкие цифры времени
function hudLine(c,t,a,left,clock,o={}){if(a<=0)return;c.save();c.globalAlpha=a;const y=o.y||118;
  const bl=.5+.5*Math.sin(t*5.4);c.fillStyle=`rgba(255,59,48,${.55+.45*bl})`;c.beginPath();c.arc(72,y-9,7,0,TAU);c.fill();glowDot(c,72,y-9,24,'#ff3b30',.45*bl);
  c.shadowColor='rgba(0,0,0,.85)';c.shadowBlur=10;
  tx(c,left,94,y,{f:'M',w:600,s:25,ls:6,al:'left',c:'rgba(255,255,255,.95)'});
  tx(c,clock,WW-70,y+1,{f:'M',w:300,s:34,ls:2,al:'right',c:'rgba(255,255,255,.95)'});
  c.restore();}
// субтитры: Oswald 700 капсом, ключевые слова — оранжевым, по 1–3 слова
function subsDraw(c,t,V0,WD,SUB,ACC,o={}){const v=t-V0;if(v<-.05)return;let cur=null;
  for(let k=0;k<SUB.length;k++){const [a,b]=SUB[k],ta=WD[a][0],nx=k+1<SUB.length?WD[SUB[k+1][0]][0]:99,tb=nx-WD[b][1]<0.6?nx:WD[b][1]+0.35;if(v>=ta-0.03&&v<tb){cur=[a,b,ta];break;}}
  if(!cur)return;const [a,b,ta]=cur,age=v-ta,pop=1+0.1*Math.max(0,1-age/0.09);
  const words=[];for(let i=a;i<=b;i++)words.push([WD[i][2].replace(/^-/,'').toUpperCase(),ACC.has(i)]);
  c.save();font(c,{f:'O',w:700,s:o.s||104,ls:1});const sp=c.measureText(' ').width;let tot=0;const ws=words.map(w=>{const m=c.measureText(w[0]).width;tot+=m;return m;});tot+=sp*(words.length-1);
  const sc=Math.min(1,900/tot)*pop;c.translate(540,o.y||1190);c.scale(sc,sc);let x=-tot/2;
  c.textAlign='left';c.textBaseline='middle';c.lineJoin='round';
  for(let i=0;i<words.length;i++){c.shadowColor='rgba(0,0,0,.9)';c.shadowBlur=24;c.shadowOffsetY=5;c.fillStyle=words[i][1]?(o.acc||'#FFB13B'):'#FFFFFF';c.fillText(words[i][0],x,0);
    c.shadowBlur=0;c.shadowOffsetY=0;c.lineWidth=3;c.strokeStyle='rgba(0,0,0,.35)';c.strokeText(words[i][0],x,0);x+=ws[i]+sp;}
  c.restore();}
// встряска после удара
function shakeAt(HITS,t,amp=28){for(const h of HITS)if(t>=h&&t<h+.22){const k=1-(t-h)/.22,f=Math.floor(t*60);return [(H1(f)-.5)*amp*k,(H1(f+7)-.5)*amp*k];}return [0,0];}

/* трубка с сужением (палец, большой палец): pts — точки по оси, w0/w1 — толщина у основания и у кончика, L — свет [lx,ly] в тех же координатах */
function tube(c,pts,w0,w1,L,o={}){const S=o.skin||SKIN,n=pts.length,Lt=[],Rt=[];let len=0;const acc=[0];for(let i=1;i<n;i++){len+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);acc.push(len);}
  for(let i=0;i<n;i++){const a=pts[Math.max(0,i-1)],b=pts[Math.min(n-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,w=lp(w0,w1,acc[i]/len)/2;Lt.push([pts[i][0]+nx*w,pts[i][1]+ny*w]);Rt.push([pts[i][0]-nx*w,pts[i][1]-ny*w]);}
  const tip=pts[n-1],pv=pts[n-2],ta=Math.atan2(tip[1]-pv[1],tip[0]-pv[0]);
  const path=()=>{c.beginPath();c.moveTo(Rt[0][0],Rt[0][1]);for(let i=1;i<n;i++)c.lineTo(Rt[i][0],Rt[i][1]);c.arc(tip[0],tip[1],w1/2,ta-Math.PI/2,ta+Math.PI/2);for(let i=n-1;i>=0;i--)c.lineTo(Lt[i][0],Lt[i][1]);c.closePath();};
  const mx=(pts[0][0]+tip[0])/2,my=(pts[0][1]+tip[1])/2,dx=tip[0]-pts[0][0],dy=tip[1]-pts[0][1],l=Math.hypot(dx,dy)||1;let nx=-dy/l,ny=dx/l;if(nx*L[0]+ny*L[1]<0){nx=-nx;ny=-ny;}const W=(w0+w1)/2;
  c.save();path();c.fillStyle=LG(c,mx+nx*W*.55,my+ny*W*.55,mx-nx*W*.55,my-ny*W*.55,[[0,S.l],[.42,S.m],[1,S.d]]);c.fill();
  c.lineWidth=1.6;c.strokeStyle='rgba(95,52,38,.55)';c.stroke();c.clip();
  c.globalCompositeOperation='screen';c.strokeStyle='rgba(255,236,222,.42)';c.lineWidth=W*.16;c.lineCap='round';c.beginPath();for(let i=0;i<n;i++){const p=pts[i],q=[p[0]+nx*W*.26,p[1]+ny*W*.26];i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]);}c.stroke();
  c.globalCompositeOperation='source-over';
  if(o.joints)for(const j of o.joints){const p=pts[j];if(!p)continue;const a=pts[Math.max(0,j-1)],b=pts[Math.min(n-1,j+1)],ax=b[0]-a[0],ay=b[1]-a[1],al=Math.hypot(ax,ay)||1;c.strokeStyle='rgba(120,70,52,.5)';c.lineWidth=1.4;c.beginPath();c.moveTo(p[0]-ay/al*W*.3,p[1]+ax/al*W*.3);c.quadraticCurveTo(p[0]+ax/al*3,p[1]+ay/al*3,p[0]+ay/al*W*.3,p[1]-ax/al*W*.3);c.stroke();}
  if(o.nail){const k=o.nail.k??.8,q=[lp(pv[0],tip[0],k),lp(pv[1],tip[1],k)],sd=o.nail.side||0;c.save();c.translate(q[0]+nx*W*.12*sd,q[1]+ny*W*.12*sd);c.rotate(ta);c.fillStyle=LG(c,0,-w1*.3,0,w1*.3,[[0,'#fff3ec'],[1,S.nail]]);c.globalAlpha=.9;RR(c,-w1*.42,-w1*.27,w1*.72,w1*.54,w1*.24);c.fill();c.strokeStyle='rgba(130,80,64,.4)';c.lineWidth=1;c.stroke();c.restore();}
  c.restore();}
// гладкая заливка ладони/тыльной стороны по точкам (кривые через середины)
function blob(c,poly,L,o={}){const S=o.skin||SKIN;let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const p of poly){x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1]);}
  const cx=(x0+x1)/2,cy=(y0+y1)/2,R=Math.max(x1-x0,y1-y0)*.55;const n=poly.length;
  c.save();c.beginPath();const m0=[(poly[n-1][0]+poly[0][0])/2,(poly[n-1][1]+poly[0][1])/2];c.moveTo(m0[0],m0[1]);for(let i=0;i<n;i++){const p=poly[i],q=poly[(i+1)%n];c.quadraticCurveTo(p[0],p[1],(p[0]+q[0])/2,(p[1]+q[1])/2);}c.closePath();
  c.fillStyle=LG(c,cx+L[0]*R,cy+L[1]*R,cx-L[0]*R,cy-L[1]*R,[[0,S.l],[.5,S.m],[1,S.d]]);c.fill();c.lineWidth=1.6;c.strokeStyle='rgba(95,52,38,.5)';c.stroke();
  c.clip();c.globalCompositeOperation='screen';c.fillStyle=RG(c,cx+L[0]*R*.4,cy+L[1]*R*.4,0,R*.8,[[0,'rgba(255,232,215,.3)'],[1,'rgba(255,232,215,0)']]);c.fillRect(x0-40,y0-40,x1-x0+80,y1-y0+80);
  if(o.tendons){c.globalCompositeOperation='source-over';c.strokeStyle='rgba(255,240,228,.18)';c.lineWidth=5;c.lineCap='round';for(const t of o.tendons){c.beginPath();c.moveTo(t[0],t[1]);c.quadraticCurveTo(t[2],t[3],t[4],t[5]);c.stroke();}}
  c.restore();}
