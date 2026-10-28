/* ================= v11 · Радар: два теста — рельефная карта и 3D-город ================= */
// районы города: у каждого героя своё место (из его реплик и биографии)
const RD11=[
 {k:'tn',u:.62,v:.64,n:'Туннели',h:['rat'],ab:'канализация под рекой — царство Крысиного короля',ic:'tn'},
 {k:'cr',u:.31,v:.40,n:'Собор',h:['venator'],ab:'Ватикан держит тут своего охотника',ic:'cr'},
 {k:'ct',u:.78,v:.24,n:'Цирк',h:['celeste'],ab:'шатёр на холме, звезда шоу — Селеста',ic:'ct'},
 {k:'fr',u:.2,v:.15,n:'Старый лес',h:['talon'],ab:'охотник с совой живёт на холмах',ic:'fr'},
 {k:'dr',u:.5,v:.2,n:'Сонная низина',h:['rem'],ab:'туман, тут Рэм выходит из чужих снов',ic:'dr'},
 {k:'ht',u:.4,v:.8,n:'Отель',h:['doorman'],ab:'Дормен открывает двери — и не только',ic:'ht'},
 {k:'pw',u:.84,v:.56,n:'Электростанция',h:['seven'],ab:'Севен и его молнии',ic:'pw'},
 {k:'lb',u:.15,v:.62,n:'Лаборатория',h:['victor'],ab:'Виктор и его опыты',ic:'lb'},
 {k:'cm',u:.7,v:.88,n:'Кладбище',h:['danny'],ab:'Мертвец Дэнни не спит',ic:'cm'}];
// сигналы за 8 часов: что перехватил радар (комикс про двух героев)
const SG11=[{d:'tn',a:'rat',b:'venator',t:'Ватикан объявил охоту на Короля',sig:3},{d:'cr',a:'venator',b:'rat',t:'Проповедь свинца',sig:2},{d:'ct',a:'celeste',b:'talon',t:'Цирк против старости',sig:1,soon:1},{d:'dr',a:'rem',b:'venator',t:'Добрый пастырь',sig:1,soon:1}];
const RDI={tn:'<path d="M-9 7V1Q0-10 9 1v6" fill="none" stroke-width="1.8"/><path d="M-5 7V3Q0-3 5 3v4" fill="none"/>',cr:'<path d="M0-12V9M-6-5H6" stroke-width="2.2"/><path d="M-8 9V0L0-6 8 0v9" fill="none"/>',ct:'<path d="M-10 8L0-9 10 8Z" fill="none" stroke-width="1.6"/><path d="M0-9v-5l6 2-6 2M-5 8L0-9 5 8" fill="none"/>',
 fr:'<path d="M-7 8L-2-4 3 8ZM1 8L6-8 11 8Z" fill="none" stroke-width="1.5"/>',dr:'<path d="M3-9A8 8 0 1 0 9 3 6.5 6.5 0 0 1 3-9Z" fill="none" stroke-width="1.6"/><path d="M-11-8h4l-4 4h4" fill="none" stroke-width="1.2"/>',ht:'<path d="M-6 9V-10H6V9M-3-6h2M1-6h2M-3-2h2M1-2h2M-3 2h2M1 2h2" fill="none" stroke-width="1.5"/>',
 pw:'<path d="M2-11L-5 2h5l-2 9 7-13H0z" fill="none" stroke-width="1.6"/>',lb:'<path d="M-3-10h6M-2-10v6L-8 8h16L2-4v-6" fill="none" stroke-width="1.6"/>',cm:'<path d="M-6 9V-1a6 6 0 0 1 12 0v10M0-5v6M-3-2h6" fill="none" stroke-width="1.6"/>'};
const rdi11=k=>`<svg class="rdi" viewBox="-14 -14 28 28">${RDI[k]||''}</svg>`;

/* --- рельеф: высоты из холмов + шум, река прорезает долину; отмывка (тени от склонов), изогипсы --- */
function hgt11(u,v){const g=(cu,cv,r,a)=>{const dx=(u-cu)/r,dy=(v-cv)/r;return a*Math.exp(-(dx*dx+dy*dy))};
 const n=(x,y)=>{const s=Math.sin(x*12.9898+y*78.233)*43758.5453;return s-Math.floor(s)};
 const vn=(x,y)=>{const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,sx=xf*xf*(3-2*xf),sy=yf*yf*(3-2*yf);const a=n(xi,yi),b=n(xi+1,yi),c=n(xi,yi+1),d=n(xi+1,yi+1);return a+(b-a)*sx+(c-a)*sy+(a-b-c+d)*sx*sy};
 let f=0,amp=.5,fr=3.2;for(let o=0;o<5;o++){f+=amp*vn(u*fr+7.3,v*fr*1.37+2.1);amp*=.5;fr*=2.03}
 let h=.26+f*.24+g(.2,.13,.2,.46)+g(.32,.4,.11,.3)+g(.79,.22,.15,.26)+g(.14,.63,.1,.2)+g(.86,.06,.12,.22)-g(.5,.2,.14,.16)+g(.1,.92,.14,.12);
 h=Math.min(h,.62+(h-.62)*.35);// плато цирка и вершины чуть плоские
 const ht=g(.4,.8,.13,1);h=h*(1-ht*.6)+.3*ht*.6;// центр города выровнен
 const vr=.4+.5*(1-u)+.045*Math.sin(u*9.4+1.2),dv=(v-vr)/Math.sqrt(1+.25*1.37),w=.05+.012*Math.sin(u*6);h-=.42*Math.exp(-(dv*dv)/(w*w));
 return h}
const SEA11=.12;
function relief11(W,H,o){o=o||{};const im=new ImageData(W,H),d=im.data,G=new Float32Array(W*H);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++)G[y*W+x]=hgt11(x/W,y/H);
 const L=[-.62,-.55,.56],ln=Math.hypot(...L);const lx=L[0]/ln,ly=L[1]/ln,lz=L[2]/ln,z=o.mini?2.6:4.2*(W/344);
 const pal=[[0,[13,34,30]],[.18,[18,44,34]],[.3,[26,58,42]],[.42,[38,74,50]],[.54,[58,92,62]],[.68,[92,118,84]],[.85,[140,150,118]]];
 const col=h=>{for(let i=1;i<pal.length;i++)if(h<pal[i][0]||i===pal.length-1){const a=pal[i-1],b=pal[i],t=Math.max(0,Math.min(1,(h-a[0])/(b[0]-a[0])));return [a[1][0]+(b[1][0]-a[1][0])*t,a[1][1]+(b[1][1]-a[1][1])*t,a[1][2]+(b[1][2]-a[1][2])*t]}};
 const step=o.mini?.06:.04;
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x,h=G[i],hx=G[y*W+Math.min(W-1,x+1)]-G[y*W+Math.max(0,x-1)],hy=G[Math.min(H-1,y+1)*W+x]-G[Math.max(0,y-1)*W+x];
  let nx=-hx*z*W/2,ny=-hy*z*W/2,nz=1;const nl=Math.hypot(nx,ny,nz);nx/=nl;ny/=nl;nz/=nl;const sh=Math.max(0,nx*lx+ny*ly+nz*lz);
  let r,g2,b;if(h<SEA11){const dp=Math.min(1,(SEA11-h)/.16);r=14-dp*6;g2=46-dp*14;b=66-dp*12;const sp=Math.pow(Math.max(0,nz*.3+sh*.7),6)*30;r+=sp;g2+=sp*1.2;b+=sp*1.4}
  else{const c=col(h);const k=.42+sh*.95;r=c[0]*k;g2=c[1]*k;b=c[2]*k;
   // изогипсы: граница уровня — тонкая светлая линия, каждая пятая — ярче
   const lv=Math.floor(h/step),lvR=Math.floor(G[y*W+Math.min(W-1,x+1)]/step),lvD=Math.floor(G[Math.min(H-1,y+1)*W+x]/step);
   if(lv!==lvR||lv!==lvD){const mj=lv%5===0;r+=mj?46:20;g2+=mj?70:34;b+=mj?58:28}
   if(h<SEA11+.012){r=r*.6+40;g2=g2*.6+60;b=b*.6+60}}// кромка берега
  d[i*4]=r;d[i*4+1]=g2;d[i*4+2]=b;d[i*4+3]=255}
 return im}
// путь реки — для течения поверх (та же формула, что вырезала долину)
function river11(W,H){let p='';for(let i=0;i<=40;i++){const u=-.05+i/40*1.1,v=.4+.5*(1-u)+.045*Math.sin(u*9.4+1.2);p+=(i?'L':'M')+(u*W).toFixed(1)+' '+(v*H).toFixed(1)}return p}

/* --- 3D-город: свой маленький движок на canvas — кварталы, река, мосты, узнаваемые здания; крутится пальцем --- */
function city11(){let s=17;const r=()=>(s=(s*16807)%2147483647)/2147483647;const B=[];
 const riv=(x,z)=>Math.abs(x-z*.62+6)<9;// река по диагонали
 const LM=[[-25,-10],[15,25],[40,-40],[-50,-50],[5,-48],[-10,45],[50,20],[-55,15],[35,55]];
 const near=(x,z,d)=>LM.some(([lx,lz])=>Math.abs(x-lx)<d&&Math.abs(z-lz)<d);
 for(let gx=-7;gx<7;gx++)for(let gz=-7;gz<7;gz++){const x=gx*10+5,z=gz*10+5;if(riv(x,z)||near(x,z,9))continue;const q=r();if(q<.12)continue;
  const cd=Math.hypot(x+5,z-10)/70,h=6+r()*r()*34*(1.4-cd)+(cd<.35?14:0),w=6+r()*2.4,dd=6+r()*2.4;B.push({t:'box',x:x-w/2,z:z-dd/2,w,d:dd,h,c:[26,34,58],seed:q});if(r()<.32&&h>16)B.push({t:'box',x:x-w*.32,z:z-dd*.32,w:w*.64,d:dd*.64,h:h+4+r()*8,y0:h,c:[30,40,66],seed:q*7})}
 // ориентиры
 B.push({t:'box',x:-31,z:-17,w:12,d:16,h:12,c:[44,30,40],lm:'cr'},{t:'pyr',x:-25,z:-9,w:6,h:30,y0:12,c:[60,40,52],lm:'cr'},{t:'box',x:-28,z:-21,w:6,d:6,h:22,c:[50,34,46]});
 B.push({t:'cone',x:40,z:-40,rr:11,h:16,c:[[180,50,110],[240,200,110]],lm:'ct'},{t:'box',x:39.4,z:-40.6,w:1.2,d:1.2,h:26,c:[200,180,120]});
 for(let i=0;i<26;i++){const a=r()*6.28,dd=r()*15;B.push({t:'tree',x:-50+Math.cos(a)*dd,z:-50+Math.sin(a)*dd,rr:2.2+r()*1.4,h:7+r()*6,c:[24,70,60]})}
 B.push({t:'box',x:-15,z:40,w:10,d:10,h:58,c:[52,34,30],lm:'ht'},{t:'box',x:-13,z:42,w:6,d:6,h:66,y0:58,c:[70,40,34]});
 B.push({t:'box',x:42,z:14,w:16,d:12,h:14,c:[40,44,52],lm:'pw'},{t:'cyl',x:46,z:16,rr:2.2,h:34,y0:14,c:[60,60,70]},{t:'cyl',x:52,z:22,rr:2.2,h:30,y0:14,c:[60,60,70]});
 B.push({t:'box',x:-60,z:10,w:12,d:12,h:12,c:[30,52,46],lm:'lb'},{t:'cyl',x:-54,z:16,rr:4.2,h:6,y0:12,c:[60,120,96]});
 for(let i=0;i<14;i++)B.push({t:'box',x:28+(i%5)*3.4,z:50+Math.floor(i/5)*3.4,w:1.2,d:.6,h:2.6,c:[90,96,110]});
 for(let i=0;i<9;i++)B.push({t:'box',x:-4+(i%3)*5,z:-54+Math.floor(i/3)*5,w:3.4,d:3.4,h:5+r()*4,c:[46,36,80],lm:i===4?'dr':0});
 B.push({t:'box',x:9,z:21,w:12,d:8,h:3,c:[30,44,36],lm:'tn'});
 // мосты через реку
 B.push({t:'bridge',x0:-30,z0:-38,x1:-14,z1:-38,c:[50,56,72]},{t:'bridge',x0:20,z0:16,x1:36,z1:16,c:[50,56,72]});
 return B}
const C11LM={cr:[-25,44,-10],tn:[15,6,25],ct:[40,18,-40],fr:[-50,14,-50],dr:[5,10,-48],ht:[-10,68,45],pw:[50,36,20],lb:[-55,20,15],cm:[35,6,55]};
function draw3d11(g,W,H,cam,B,t){const cy=Math.cos(cam.yaw),sy=Math.sin(cam.yaw),cp=Math.cos(cam.pitch),sp=Math.sin(cam.pitch),S=cam.s,ox=W/2,oy=H*.54;
 const P=(x,y,z)=>{const dx=x-cam.cx,dz=z-cam.cz,rx=dx*cy-dz*sy,rz=dx*sy+dz*cy;return [ox+rx*S,oy+(rz*sp-y*cp)*S,rz*cp+y*sp]};
 g.clearRect(0,0,W,H);
 // земля
 const gp=[[-78,-78],[78,-78],[78,78],[-78,78]].map(([x,z])=>P(x,0,z));g.fillStyle='#0b1220';g.beginPath();gp.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill();
 // улицы — сетка
 g.strokeStyle='rgba(120,150,200,.07)';g.lineWidth=1;for(let i=-7;i<=7;i++){let a=P(i*10,0,-70),b=P(i*10,0,70);g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke();a=P(-70,0,i*10);b=P(70,0,i*10);g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke()}
 // река и блики течения
 const rv=[];for(let i=0;i<=24;i++){const z=-80+i*160/24;rv.push([z*.62-6-9,z])}for(let i=24;i>=0;i--){const z=-80+i*160/24;rv.push([z*.62-6+9,z])}
 g.fillStyle='#0f2c44';g.beginPath();rv.forEach(([x,z],i)=>{const p=P(x,0,z);i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1])});g.closePath();g.fill();
 g.strokeStyle='rgba(160,215,255,.32)';g.lineWidth=1;for(let k=0;k<7;k++){const off=((t*.006+k*23)%160)-80;const a=P(off*.62-6-5+k%3*4,0,off),b=P(off*.62-6-5+k%3*4+3.1,0,off+5);g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke()}
 // кольца радара и луч по земле
 g.strokeStyle='rgba(46,230,197,.16)';g.lineWidth=1;[30,55,80].forEach(R0=>{g.beginPath();for(let a=0;a<=48;a++){const p=P(Math.cos(a/48*6.283)*R0,0,Math.sin(a/48*6.283)*R0);a?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1])}g.stroke()});
 const c0=P(0,0,0);g.fillStyle='#2EE6C5';g.beginPath();g.arc(c0[0],c0[1],3.4,0,6.3);g.fill();g.strokeStyle='rgba(46,230,197,'+(.6-((t*.0006)%1)*.6).toFixed(2)+')';g.beginPath();g.arc(c0[0],c0[1],4+((t*.0006)%1)*14,0,6.3);g.stroke();
 const sa=t*.0011;for(let k=0;k<7;k++){const a0=sa-k*.09,a1=a0-.09,c0=P(0,0,0),p0=P(Math.cos(a0)*82,0,Math.sin(a0)*82),p1=P(Math.cos(a1)*82,0,Math.sin(a1)*82);g.fillStyle=`rgba(46,230,197,${(.22*(1-k/7)).toFixed(3)})`;g.beginPath();g.moveTo(c0[0],c0[1]);g.lineTo(p0[0],p0[1]);g.lineTo(p1[0],p1[1]);g.closePath();g.fill()}
 // свечения районов
 const glow=(x,y,z,r0,c)=>{const p=P(x,y,z);const gr=g.createRadialGradient(p[0],p[1],0,p[0],p[1],r0*S);gr.addColorStop(0,c);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.beginPath();g.arc(p[0],p[1],r0*S,0,6.3);g.fill()};
 glow(15,1,25,16,'rgba(120,255,140,.28)');glow(5,6,-48,20,'rgba(150,110,255,.24)');glow(-10,64,45,10,'rgba(255,90,70,'+(.25+.2*Math.sin(t*.004))+')');glow(50,40,20,12,'rgba(130,190,255,'+(Math.random()<.04?.5:.12)+')');
 // предметы: дальние — первыми
 const L=B.map(b=>{const cx=b.t==='bridge'?(b.x0+b.x1)/2:b.t==='box'?b.x+b.w/2:b.x,cz=b.t==='bridge'?(b.z0+b.z1)/2:b.t==='box'?b.z+b.d/2:b.z;return [P(cx,(b.y0||0)+(b.h||0)/2,cz)[2],b]}).sort((a,b)=>a[0]-b[0]);
 const shade=(c,k)=>`rgb(${(c[0]*k)|0},${(c[1]*k)|0},${(c[2]*k)|0})`;
 const quad=(pts,f)=>{g.fillStyle=f;g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill()};
 for(const [,b] of L){
  if(b.t==='box'){const y0=b.y0||0,y1=y0+b.h,x0=b.x,x1=b.x+b.w,z0=b.z,z1=b.z+b.d;
   const fx=sy>0?x1:x0,fz=cy>0?z1:z0;// видимые стены
   quad([P(fx,y0,z0),P(fx,y0,z1),P(fx,y1,z1),P(fx,y1,z0)],shade(b.c,sy>0?1:.62));
   quad([P(x0,y0,fz),P(x1,y0,fz),P(x1,y1,fz),P(x0,y1,fz)],shade(b.c,cy>0?.82:.55));
   quad([P(x0,y1,z0),P(x1,y1,z0),P(x1,y1,z1),P(x0,y1,z1)],shade(b.c,1.35));
   if(b.seed&&b.h>9){// окна
    const fl=Math.floor((b.h-3)/3.4);g.fillStyle='rgba(255,214,140,.85)';for(let j=0;j<fl;j++){for(let k=0;k<2;k++){const on=((b.seed*997+j*31+k*17)%1)<.36;if(!on)continue;const wy=y0+2+j*3.4;let p=P(fx,wy,z0+b.d*(.3+k*.4));g.fillRect(p[0]-.7,p[1]-1,1.4,1.8);p=P(x0+b.w*(.3+k*.4),wy,fz);g.fillRect(p[0]-.7,p[1]-1,1.4,1.8)}}}}
  else if(b.t==='pyr'){const y0=b.y0,top=P(b.x,y0+b.h,b.z),hw=b.w/2,c=[[b.x-hw,b.z-hw],[b.x+hw,b.z-hw],[b.x+hw,b.z+hw],[b.x-hw,b.z+hw]];
   for(let i=0;i<4;i++){const a=c[i],e=c[(i+1)%4],nx=(a[1]-e[1]),nz=(e[0]-a[0]);const vis=nx*sy+nz*cy>0;if(!vis)continue;quad([P(a[0],y0,a[1]),P(e[0],y0,e[1]),top],shade(b.c,.6+.4*Math.abs(nx*sy)/b.w))}
   g.strokeStyle='#F2C14E';g.lineWidth=1.2;const k1=P(b.x,y0+b.h+5,b.z),k2=P(b.x,y0+b.h,b.z),k3=P(b.x-1.6,y0+b.h+3.4,b.z),k4=P(b.x+1.6,y0+b.h+3.4,b.z);g.beginPath();g.moveTo(k1[0],k1[1]);g.lineTo(k2[0],k2[1]);g.moveTo(k3[0],k3[1]);g.lineTo(k4[0],k4[1]);g.stroke();
   const rw=P(b.x-6.6,y0-4,b.z);g.fillStyle=`rgba(255,200,90,${(.55+.25*Math.sin(t*.003)).toFixed(2)})`;g.beginPath();g.arc(rw[0],rw[1],2.2*S,0,6.3);g.fill()}
  else if(b.t==='cone'){const n=16;for(let i=0;i<n;i++){const a0=i/n*6.283,a1=(i+1)/n*6.283,am=(a0+a1)/2;const vis=Math.cos(am)*sy+Math.sin(am)*cy>-.2;if(!vis)continue;quad([P(b.x+Math.cos(a0)*b.rr,0,b.z+Math.sin(a0)*b.rr),P(b.x+Math.cos(a1)*b.rr,0,b.z+Math.sin(a1)*b.rr),P(b.x,b.h,b.z)],shade(b.c[i%2],.7+.35*Math.max(0,Math.cos(am)*sy+Math.sin(am)*cy)))}}
  else if(b.t==='cyl'){const n=10,y0=b.y0||0;for(let i=0;i<n;i++){const a0=i/n*6.283,a1=(i+1)/n*6.283,am=(a0+a1)/2,vis=Math.cos(am)*sy+Math.sin(am)*cy>0;if(!vis)continue;quad([P(b.x+Math.cos(a0)*b.rr,y0,b.z+Math.sin(a0)*b.rr),P(b.x+Math.cos(a1)*b.rr,y0,b.z+Math.sin(a1)*b.rr),P(b.x+Math.cos(a1)*b.rr,y0+b.h,b.z+Math.sin(a1)*b.rr),P(b.x+Math.cos(a0)*b.rr,y0+b.h,b.z+Math.sin(a0)*b.rr)],shade(b.c,.55+.5*(Math.cos(am)*sy+Math.sin(am)*cy)))}
   const tp=P(b.x,y0+b.h,b.z);g.fillStyle=shade(b.c,1.2);g.beginPath();g.ellipse(tp[0],tp[1],b.rr*S,b.rr*S*sp,0,0,6.3);g.fill()}
  else if(b.t==='tree'){const base=P(b.x,0,b.z),top=P(b.x,b.h,b.z),l=P(b.x-b.rr*cy,b.h*.25,b.z+b.rr*sy),rr=P(b.x+b.rr*cy,b.h*.25,b.z-b.rr*sy);quad([l,rr,top],shade(b.c,.9+.2*Math.sin(t*.002+b.x)));g.fillStyle=shade(b.c,.5);g.fillRect(base[0]-.6,base[1]-2,1.2,2)}
  else if(b.t==='bridge'){const y=3,w=1.6;const a=P(b.x0,y,b.z0-w),bb=P(b.x1,y,b.z1-w),c=P(b.x1,y,b.z1+w),d2=P(b.x0,y,b.z0+w);quad([a,bb,c,d2],shade(b.c,1.1));g.strokeStyle='rgba(255,214,140,.5)';g.lineWidth=1;g.beginPath();for(let i=0;i<=6;i++){const p=P(b.x0+(b.x1-b.x0)*i/6,y+1.6,b.z0);g.lineTo(p[0],p[1])}g.stroke()}}
 return P}

/* --- экран Радара: общий для обеих карт --- */
function radar11(R,ctx,mode,o){o=o||{};const C3=mode==='city';R.className='scr v8 g11 r11 r11-'+(C3?'city':'relief');let ch=2,cur=-1,touched=false;
 const SG=SG11.map(x=>Object.assign({},x));
 R.innerHTML=`${SB(0)}<div class="r11-map"><div class="r11-cam">${C3?'<canvas class="r11-3d"></canvas>':`<canvas class="r11-rl"></canvas><svg class="r11-ov" viewBox="0 0 344 520" preserveAspectRatio="none"><path class="rv" d="${river11(344,520)}"/><path class="rf" d="${river11(344,520)}"/>${RD11.map((a,i)=>i?`<path class="rd" d="M${(RD11[0].u*344).toFixed(0)} ${(RD11[0].v*520).toFixed(0)} Q${(172+(a.u-.5)*60).toFixed(0)} ${(260+(a.v-.5)*60).toFixed(0)} ${(a.u*344).toFixed(0)} ${(a.v*520).toFixed(0)}"/>`:'').join('')}</svg><i class="r11-cl a"></i><i class="r11-cl b"></i><i class="r11-sw"></i><i class="r11-rg a"></i><i class="r11-rg b"></i><i class="r11-me"></i>`}
   <div class="r11-lbs">${RD11.map((a,j)=>`<span class="r11-lb" data-d="${a.k}" style="left:${(a.u*344).toFixed(0)}px;top:${(a.v*520).toFixed(0)}px">${rdi11(a.ic)}<b>${a.n}</b></span>`).join('')}</div>
   <div class="r11-pins">${SG.map((p,j)=>{const a=RD11.find(x=>x.k===p.d);return `<button class="r11-pin${p.soon?' sn':''}" data-j="${j}" style="left:${(a.u*344).toFixed(0)}px;top:${(a.v*520).toFixed(0)}px"><i class="pl"></i><span class="pi">${mini8(p.a)}${mini8(p.b,'s')}</span><span class="sg2">${[1,2,3].map(i=>`<i class="${i<=p.sig?'on':''}"></i>`).join('')}</span></button>`}).join('')}</div></div></div>
  <div class="r11-hd">${o.onBack?`<button class="g11-bk s" aria-label="Назад">${ic('back')}</button>`:''}<div class="tt"><b>Радар</b><small>${C3?'3D-город':'рельефная карта'}</small></div><span class="ch" title="заряды">${[0,1,2,3].map(i=>`<i class="${i<ch?'on':''}"></i>`).join('')}</span><span class="tm">5:12:40</span></div>
  <div class="r11-st"><span class="ty"></span><em>${ic('bolt')}×2 опыта</em></div>
  ${C3?'<div class="r11-hint">крути пальцем · тап по точке — подлетим</div>':''}
  <div class="r11-pop"><span class="mm"></span><div class="tx"><small class="d"></small><b class="t"></b><em class="ab"></em></div><button class="go">Читать ${ic('chev')}</button></div>
  <div class="r11-lg"><button class="hd2"><b>Что где</b><small>9 районов · у каждого героя своё место</small>${ic('chev')}</button><div class="ls">${RD11.map(a=>{const s=SG.findIndex(x=>x.d===a.k&&!x.soon);return `<button data-d="${a.k}" class="${s>=0?'hot':''}">${rdi11(a.ic)}<span><b>${a.n}</b><small>${a.ab}</small></span>${mini8(a.h[0])}${s>=0?'<em>сигнал</em>':''}</button>`}).join('')}</div></div>
  <canvas class="fx"></canvas><i class="hb"></i>`;
 const fx=FX(ctx,$('.fx',R)),cam=$('.r11-cam',R),pop=$('.r11-pop',R),PB=$$('.r11-pin',R),LB=$$('.r11-lb',R),lg=$('.r11-lg',R);
 ctx.on(R,'pointerdown',()=>{touched=true},{capture:true});
 if(o.onBack)ctx.on($('.r11-hd .g11-bk',R),'click',()=>o.onBack());
 // таймер новых сигналов
 let left=5*3600+12*60+40;const tm=$('.r11-hd .tm',R);const tick=()=>{if(!ctx.alive)return;left--;tm.textContent=`${Math.floor(left/3600)}:${String(Math.floor(left%3600/60)).padStart(2,'0')}:${String(left%60).padStart(2,'0')}`;ctx.t(tick,1000)};tick();
 const ty=$('.r11-st .ty',R);(async()=>{typewrite(ctx,ty,C3?'ПОДНИМАЮ ДРОН НАД ГОРОДОМ…':'СТРОЮ КАРТУ РЕЛЬЕФА…',null,36);await ctx.wait(1900);typewrite(ctx,ty,'2 СИГНАЛА ЖДУТ · 2 ЗАРЯДА',null,32)})();
 // где точки на экране (для 3D — пересчёт каждый кадр)
 let proj=null;const where=j=>{const a=RD11.find(x=>x.k===SG[j].d);return {x:a.u*344,y:a.v*520}};
 // камера: подлёт к точке / обратно
 let tx=0,ty2=0,sc=1;const setCam=d=>{cam.style.transition=d?`transform ${d}ms cubic-bezier(.2,.8,.2,1)`:'';cam.style.transform=`translate(${tx}px,${ty2}px) scale(${sc})`};
 // --- рельеф ---
 if(!C3){const cv=$('.r11-rl',R),b=cv.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1),W=344,H=520;cv.width=Math.round(W*dpr*.75);cv.height=Math.round(H*dpr*.75);
  const g=cv.getContext('2d');g.putImageData(relief11(cv.width,cv.height),0,0);
  an(cv,[{opacity:0,transform:'scale(1.08)'},{opacity:1,transform:'none'}],{d:1200,e:EO});
  // течение по реке и дороги проявляются
  const rd=$$('.r11-ov .rd',R);rd.forEach((p,i)=>{const L=p.getTotalLength();p.style.strokeDasharray=`${L}`;an(p,[{strokeDashoffset:L},{strokeDashoffset:0}],{d:900,e:EO,dl:700+i*80,f:'forwards'});ctx.t(()=>{p.style.strokeDasharray='3 5'},900+700+i*80+40)});
  ctx.on(R,'pointermove',e=>{if(cur>=0)return;const bb=R.getBoundingClientRect(),x=(e.clientX-bb.left)/bb.width-.5,y=(e.clientY-bb.top)/bb.height-.5;tx=-x*12;ty2=-y*10;sc=1.03;setCam(0)})}
 // --- 3D ---
 let C3D=null;
 if(C3){const cv=$('.r11-3d',R),dpr=Math.min(2,window.devicePixelRatio||1),W=344,H=600;cv.width=W*dpr;cv.height=H*dpr;const g=cv.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);
  const B=city11();C3D={yaw:-.7,pitch:.98,s:2.45,cx:0,cz:2};const goal=Object.assign({},C3D);let auto=true,t0=performance.now(),drg=false,lastSeen=[];
  const lm=a=>C11LM[a.k];
  ctx.loop((n,dt)=>{const t=n-t0;if(auto&&!drg&&cur<0)goal.yaw+=dt*.00009;for(const k of ['yaw','pitch','s','cx','cz'])C3D[k]+=(goal[k]-C3D[k])*Math.min(1,dt*.006);
   // вход: город вырастает
   const grow=Math.min(1,t/1600),e=1-Math.pow(1-grow,3);const BB=grow<1?B.map(b=>b.h?Object.assign({},b,{h:b.h*e,y0:(b.y0||0)*e}):b):B;
   proj=draw3d11(g,W,H,C3D,BB,t);
   RD11.forEach((a,i)=>{const L3=lm(a),p=proj(L3[0],0,L3[2]);LB[i].style.transform=`translate(${p[0].toFixed(1)}px,${p[1].toFixed(1)}px)`;LB[i].style.opacity=grow<.9?'0':''});
   PB.forEach((b,j)=>{const a=RD11.find(x=>x.k===SG[j].d),L3=lm(a),p=proj(L3[0],L3[1]+3,L3[2]);b.style.transform=`translate(${p[0].toFixed(1)}px,${p[1].toFixed(1)}px)`;b._p=p;
    const ang=Math.atan2(L3[2],L3[0]),d=((t*.0011-ang)%6.283+6.283)%6.283;b.style.left='0';b.style.top='0';b.style.setProperty('--hot',d<.5?(1-d/.5).toFixed(2):'0');if(d<.08&&!b._h&&!SG[j].used){b._h=1;ripple(b)}else if(d>.6)b._h=0})});
  drag(ctx,$('.r11-map',R),{start(){goal._y=goal.yaw;goal._p=goal.pitch},move(dx,dy){drg=true;auto=false;goal.yaw=goal._y-dx*.012;goal.pitch=clamp(goal._p+dy*.006,.62,1.32)},end(){drg=false;ctx.t(()=>{if(!drg&&cur<0)auto=true},2500)},tap(){}});
  C3D._goal=goal}
 // эхо, когда луч задевает точку
 const ripple=b=>{const r=rel(b,R),e=document.createElement('i');e.className='r11-rp';e.style.left=(r.x+r.w/2)+'px';e.style.top=(r.y+r.h/2)+'px';R.appendChild(e);const z=an(e,[{transform:'translate(-50%,-50%) scale(.2)',opacity:.9},{transform:'translate(-50%,-50%) scale(1.7)',opacity:0}],{d:1100,e:EO});if(z)z.onfinish=()=>e.remove();else e.remove()};
 if(!C3){const sw=$('.r11-sw',R),C0={x:172,y:280},t0=performance.now();
  ctx.loop(n=>{const a=((n-t0)/17)%360;sw.style.transform=`rotate(${a}deg)`;PB.forEach((b,j)=>{const w=where(j),an2=(Math.atan2(w.y-C0.y,w.x-C0.x)*180/Math.PI+90+360)%360,d=(a-an2+360)%360;b.style.setProperty('--hot',d<36?(1-d/36).toFixed(2):'0');if(d<5&&!b._h&&!SG[j].used&&!SG[j].soon){b._h=1;ripple(b)}else if(d>60)b._h=0})})}
 function flyTo(j,k){const w=k?{x:RD11.find(x=>x.k===k).u*344,y:RD11.find(x=>x.k===k).v*520}:where(j);
  if(C3&&C3D){const a=RD11.find(x=>x.k===(k||SG[j].d)),L3=C11LM[a.k];const g=C3D._goal;g.cx=L3[0]*.8;g.cz=L3[2]*.8;g.s=3.3;return}
  tx=(172-w.x)*.6;ty2=(250-w.y)*.6;sc=1.45;setCam(760)}
 function unfly(){if(C3&&C3D){const g=C3D._goal;g.cx=0;g.cz=2;g.s=2.45;return}tx=0;ty2=0;sc=1;setCam(620)}
 function openPop(j){const p=SG[j],b=PB[j],a=RD11.find(x=>x.k===p.d);if(p.used){toast(R,'Уже перехвачено — опыт получен');return}
  if(p.soon){shake(b,4,300);toast(R,`${HERO[p.a]?HERO[p.a].ru:'Герой'}: портрет делаем — сигнал откроется позже`);return}
  cur=j;PB.forEach(x=>x.classList.toggle('on',x===b));flyTo(j);lg.classList.remove('op');
  $('.mm',pop).innerHTML=mini8(p.a)+mini8(p.b);$('.d',pop).textContent=`${a.n.toUpperCase()} · ${HERO[p.a].ru} и ${HERO[p.b].ru}`;scramble(ctx,$('.t',pop),p.t);$('.ab',pop).textContent=a.ab;
  pop.classList.add('on');pop.getAnimations().forEach(x=>x.cancel());an(pop,[{opacity:0,transform:'translateY(26px) scale(.96)'},{opacity:1,transform:'none'}],{sp:SPs})}
 function unpop(){pop.classList.remove('on');cur=-1;PB.forEach(x=>x.classList.remove('on'));unfly()}
 function intercept(){const j=cur,p=SG[j],b=PB[j];pop.classList.remove('on');const r=rel(b,R);
  const lk=document.createElement('i');lk.className='r11-lk';lk.style.left=(r.x+r.w/2)+'px';lk.style.top=(r.y+r.h/2)+'px';R.appendChild(lk);
  an(lk,[{transform:'translate(-50%,-50%) scale(3) rotate(45deg)',opacity:0},{transform:'translate(-50%,-50%) scale(1) rotate(0)',opacity:1}],{d:420,e:EO});
  ctx.t(()=>{fx.burst(r.x+r.w/2,r.y+r.h/2,{n:44,c:['#2EE6C5','#F6D488','#fff'],v:5,g:0,s:2.5,l:45});lk.remove();ch--;$$('.r11-hd .ch i',R).forEach((x,i)=>x.classList.toggle('on',i<ch));p.used=1;b.classList.add('used');
   g11Over(R,ctx,(pv,c)=>k11Comic(pv,c,{mode:'read',demo:!touched,hero:p.a==='rat'?'rat':'venator',onDone(){}}),'Радар');ctx.t(unpop,400)},460)}
 ctx.on(R,'click',e=>{const t=e.target;if(t.closest('.g11-ov'))return;
  const b=t.closest('.r11-pin');if(b){openPop(+b.dataset.j);return}
  if(t.closest('.r11-pop .go')){intercept();return}
  if(t.closest('.r11-lg .hd2')){lg.classList.toggle('op');an($('.r11-lg .ls',R),[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{sp:SPs});return}
  const d=t.closest('.r11-lg .ls button');if(d){const k=d.dataset.d,j=SG.findIndex(x=>x.d===k&&!x.soon&&!x.used);lg.classList.remove('op');if(j>=0){openPop(j)}else{unpop();flyTo(-1,k);const lb=$(`.r11-lb[data-d="${k}"]`,R);if(lb){lb.classList.add('on');ctx.t(()=>lb.classList.remove('on'),2200)}toast(R,'Сейчас тут тихо — сигнала нет')}return}
  if(cur>=0&&!t.closest('.r11-pop'))unpop()});
 // вход: подписи районов и точки появляются по одной
 LB.forEach((l,i)=>an(l,[{opacity:0},{opacity:1}],{d:500,dl:900+i*70}));
 PB.forEach((b,i)=>an(b,[{opacity:0,scale:'.2'},{opacity:1,scale:'1'}],{sp:SPb,dl:1300+i*160}));
 an(lg,[{transform:'translateY(100%)'},{transform:'none'}],{sp:SPs,dl:600});
 if(o.demo!==false){(async()=>{await ctx.wait(3600);if(touched)return;lg.classList.add('op');await ctx.wait(1800);if(touched)return;lg.classList.remove('op');openPop(0);await ctx.wait(2800);if(touched)return;intercept()})()}}

V.push({g:'g11',id:'g11r',n:'Радар · рельефная карта',
 idea:'Тест №1. Настоящая рельефная карта, как в атласе: холмы с тенью от склонов (свет с северо-запада), изогипсы, по долине течёт река, над картой плывут тени облаков. У каждого героя — своё место: Туннели под рекой — Крысиный король, Собор на холме — Венатор, Цирк на плато — Селеста, Старый лес — Талон, Сонная низина — Рэм, Отель — Дормен, Электростанция — Севен, Лаборатория — Виктор, Кладбище — Дэнни. Внизу «Что где» — список районов: нажал — карта подлетает. Сигналы (их 4 за 8 часов): тап — камера подлетает, снизу «о чём», «Читать» — перехват и комикс. Сигналы героев без портрета — тусклые, «скоро».',
 moves:['карта проявляется, дороги прорисовываются от Туннелей к районам, по реке бежит течение','луч радара задевает сигнал — круг-эхо; тени облаков медленно плывут','тап по сигналу — камера подлетает, название «о чём» собирается из помех','«Читать» — замок перехвата, искры, комикс раскрывается'],
 from:'Твой отзыв на v9: «мб добавь рельефную карту, чтобы понималось, что где происходит, типа такого, ну как тест (сделай 2 радара типо)».',
 minus:'Город придуманный — в игре карта другая. Но места взяты из реплик и биографий героев, и игроку сразу видно: Король — под рекой, Венатор — в соборе.',
 mount(R,ctx){radar11(R,ctx,'relief')}});
V.push({g:'g11',id:'g11d',n:'Радар · 3D-город',
 idea:'Тест №2. Город в 3D, как с дрона: кварталы с окнами, река с течением, мосты, и у каждого героя узнаваемое здание — собор со шпилем и розой-окном, цирковой шатёр, отель-башня с мигающей вывеской, электростанция с трубами, лес, сонный квартал в фиолетовом тумане, зелёное свечение у входа в Туннели. Город медленно вращается; пальцем — крутишь сам (вбок — поворот, вверх-вниз — наклон). Луч радара идёт по земле, над сигналами висят иконки героев. Тап — дрон подлетает, «Читать» — комикс.',
 moves:['при входе город вырастает из земли','медленный облёт, пальцем — поворот и наклон','луч радара ползёт по земле, задевает сигнал — эхо','тап по сигналу — камера подлетает к зданию'],
 from:'Твой отзыв на v9: «добавь рельефную карту… сделай 2 радара типо».',
 minus:'Это уже маленький 3D-движок: на слабом телефоне сделаем без вращения (облёт по кругу один раз).',
 mount(R,ctx){radar11(R,ctx,'city')}});
