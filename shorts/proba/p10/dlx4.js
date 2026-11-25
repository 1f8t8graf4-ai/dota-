/* «Духless» EN · тест v4 (25.11, ночь): на движке v15 («Что вы знаете об одноразках?») — Андрей: «сделай так же, как видос про вейпы».
   Чистое 2D: предметы крупно, свет, боке, дым, документы, экраны, HUD с уголками. Без людей, без кадров фильма, без 3D.
   0–5,0 — карусель под «Кобальт» (DC), 5,0–5,2 — обрыв, 5,2 — удар, дроп «Кашалота» и первый кадр с наездом.
   Время — от слов голоса Brock ×1,10 (faster-whisper). Имя героя и название фильма — развязка в конце ролика: до неё скрыты плашкой. */
(function(){
'use strict';
CLIP.fonts=['800 78px Unb','700 40px Unb','500 26px JBM','700 30px JBM','700 70px Osw','700 230px Cav','600 82px Man'];
const V0=5.2;
const WD=[[0,0.26,'Imagine'],[0.26,0.64,'this.'],[0.84,1.04,"You're"],[1.04,1.5,'29.'],[1.88,2.32,'Moscow.'],[2.6,2.8,"You're"],[2.8,2.9,'a'],[2.9,3.16,'top'],[3.16,3.62,'executive.'],[3.92,4.08,'By'],[4.08,4.4,'day,'],[4.56,4.72,'you'],[4.72,5.04,'sign'],[5.04,5.44,'million'],[5.44,5.7,'-dollar'],[5.7,6.12,'deals.'],[6.36,6.52,'By'],[6.52,6.84,'night,'],[7.04,7.36,'clubs'],[7.36,7.54,'where'],[7.54,7.66,'the'],[7.66,8.04,'bouncers'],[8.04,8.24,'know'],[8.24,8.4,'your'],[8.4,8.8,'face.'],[9.24,9.68,'Champagne,'],[9.94,10.36,'girls,'],[10.54,10.76,'and'],[10.76,10.88,'a'],[10.88,11.1,'white'],[11.1,11.4,'line'],[11.4,11.54,'in'],[11.54,11.62,'a'],[11.62,12.0,'bathroom'],[12.0,12.4,'stall.']];
const wa=k=>V0+WD[k][0],wb=k=>V0+WD[k][1],TEND=wb(34)+0.75;
const SUB=[[0,1],[2,3],[4,4],[5,6],[7,8],[9,10],[11,12],[13,14],[15,15],[16,17],[18,18],[19,21],[22,24],[25,25],[26,26],[27,28],[29,30],[31,32],[33,34]];
const ACC=new Set([3,4,7,8,13,14,18,24,25,26,29,30,34]);
const WW=W,HH=H;

/* ================= утилиты (как в v15) ================= */
const cl=(x,a=0,b=1)=>x<a?a:x>b?b:x,lp=(a,b,k)=>a+(b-a)*k;
const ss=(a,b,x)=>{const k=cl((x-a)/(b-a));return k*k*(3-2*k);};
const eo=k=>1-Math.pow(1-cl(k),3),ei=k=>Math.pow(cl(k),3),eio=k=>{k=cl(k);return k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;};
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
const LG=(c,x0,y0,x1,y1,st)=>{const g=c.createLinearGradient(x0,y0,x1,y1);for(const [o,col] of st)g.addColorStop(o,col);return g;};
const RG=(c,x,y,r0,r1,st)=>{const g=c.createRadialGradient(x,y,r0,x,y,r1);for(const [o,col] of st)g.addColorStop(o,col);return g;};
const RR=(c,x,y,w,h,r)=>{c.beginPath();c.roundRect(x,y,w,h,r);};
const PL=(c,p)=>{c.beginPath();c.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)c.lineTo(p[i],p[i+1]);c.closePath();};
const view=(c,s,x,y,r=0)=>{c.translate(WW/2,HH/2);if(r)c.rotate(r);c.scale(s,s);c.translate(-x,-y);};
const scr=(s,cx,cy,x,y)=>[WW/2+(x-cx)*s,HH/2+(y-cy)*s];
const FM={U:'Unb',O:'Osw',M:'Man',J:'JBM',C:'Cav'};
function font(c,o){c.font=`${o.w||700} ${o.s||32}px ${FM[o.f||'U']}`;c.letterSpacing=(o.ls||0)+'px';}
function tx(c,s,x,y,o={}){if(!s)return;c.save();font(c,o);c.textAlign=o.al||'center';c.textBaseline=o.bl||'alphabetic';c.globalAlpha*=(o.a??1);if(o.glow){c.shadowColor=o.glow;c.shadowBlur=o.gb||20;}c.fillStyle=o.c||'#fff';c.fillText(s,x,y);c.restore();}
function tm(c,s,o={}){c.save();font(c,o);const w=c.measureText(s).width;c.restore();return w;}
const money=n=>'$'+Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,',');
const C={ice:'#8fd6ff',teal:'#3fd3c6',amber:'#ffb54a',gold:'#e7b15c',red:'#ff3d3d',green:'#47e38a',pink:'#ff3e9a',paper:'#ece2c6'};

/* ================= свет, воздух, глубина ================= */
function noiseTex(k,w,h,sc,oct){return cache('nz'+k,w,h,(x,Wd,Hd)=>{const im=x.createImageData(Wd,Hd),d=im.data;for(let j=0;j<Hd;j++)for(let i=0;i<Wd;i++){const v=fbm(i/sc+3.3,j/sc+7.7,oct),p=(j*Wd+i)*4;d[p]=d[p+1]=d[p+2]=v*255;d[p+3]=255;}x.putImageData(im,0,0);});}
function coneSprite(len,spread,col){const half=Math.tan(spread/2)*len,pad=70,w=half*2+pad*2,h=len+pad;
  return cache(`cone${len|0}|${spread.toFixed(3)}|${col}`,w,h,x=>{const t=mkc(w,h),y=t.getContext('2d');
    for(let i=0;i<7;i++){const k=1-i/7,hh=half*(.3+.7*k);y.beginPath();y.moveTo(w/2-5*k,0);y.lineTo(w/2+5*k,0);y.lineTo(w/2+hh,len);y.lineTo(w/2-hh,len);y.closePath();y.fillStyle=LG(y,0,0,0,len,[[0,rgba(col,.17)],[.3,rgba(col,.08)],[1,rgba(col,0)]]);y.fill();}
    x.filter='blur(16px)';x.drawImage(t,0,0);});}
// конус света: вершина (x, y), ang — направление (0 — вниз), spread — раствор, len — длина
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
// пластина боке, сразу размытая (кэш)
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
// дым / пар от источника (x, y)
function smoke(c,t,x,y,o={}){const S=smokeSprites(),n=o.n||24,life=o.life||4,seed=o.seed||1;c.save();c.globalCompositeOperation=o.op||'screen';
  for(let i=0;i<n;i++){const age=(((t+(o.t0||0))/life+H1(seed+i*1.37))%1+1)%1;
    const rise=(o.rise||420)*Math.pow(age,.85),sway=n1(i*3.7+t*.35+seed)*(o.sway||40)*age+(o.drift||0)*age*age;
    const px=x+sway+(H1(seed+i*9.1)-.5)*(o.spread||20)*(1+age*2),py=y-rise;
    const r=lp(o.r0||30,o.r1||180,Math.pow(age,.8)),a=(o.a??.5)*Math.pow(Math.sin(Math.PI*Math.min(1,age*1.12)),1.3);
    if(a<=.003)continue;c.globalAlpha=a;c.save();c.translate(px,py);c.rotate(H1(seed+i)*TAU+t*.15*(H1(i*2.3)-.5));c.drawImage(S[i%4],-r,-r,2*r,2*r);c.restore();}
  c.restore();}
// дымка, плывущая вбок
function fog(c,t,y0,o){const S=smokeSprites(),n=o.n||14;c.save();c.globalCompositeOperation='screen';
  for(let i=0;i<n;i++){const sp=o.sp*(.6+.8*H1(i*3.1+o.seed)),x=((H1(i*7.7+o.seed)*(WW+900)+t*sp)%(WW+900))-450,y=y0+(H1(i*5.3+o.seed)-.5)*o.h,r=o.r*(.7+.6*H1(i*1.9+o.seed));
    c.globalAlpha=o.a*(.5+.5*H1(i*9.1+o.seed));c.drawImage(S[i%4],x-r,y-r*.45,r*2,r*.9);}
  c.restore();}
// тех-карточка с выноской: (x, y) — левый верх, k — появление, o.tx/o.ty — куда тянется линия
function card(c,x,y,title,value,k,o={}){
  if(k<=0)return;const ts=24,vs=o.vs||42,tw1=tm(c,title,{f:'J',w:500,s:ts,ls:4}),tw2=tm(c,value,{f:'U',w:700,s:vs}),w=Math.max(tw1,tw2)+64,h=118,e=eo(k),col=o.col||C.ice;
  c.save();c.globalAlpha*=cl(k*2);
  if(o.tx!=null){const sx=o.side==='r'?x:x+w,sy=y+h/2,ex=lp(sx,o.tx,e),ey=lp(sy,o.ty,e);
    c.strokeStyle=rgba(col,.75);c.lineWidth=2.5;c.beginPath();c.moveTo(sx,sy);c.lineTo(ex,ey);c.stroke();
    c.fillStyle=col;c.beginPath();c.arc(ex,ey,7,0,TAU);c.fill();glowDot(c,ex,ey,34,col,.7*e);}
  c.beginPath();c.rect(x,y,w*e,h);c.clip();
  c.fillStyle='rgba(6,10,20,.8)';c.fillRect(x,y,w,h);c.strokeStyle='rgba(190,225,255,.35)';c.lineWidth=1.5;c.strokeRect(x+.75,y+.75,w-1.5,h-1.5);
  c.fillStyle=col;c.fillRect(x,y,6,h);
  tx(c,title,x+30,y+42,{f:'J',w:500,s:ts,ls:4,al:'left',c:'rgba(190,210,235,.85)'});
  tx(c,value,x+30,y+94,{f:'U',w:700,s:vs,al:'left',c:'#fff'});
  c.restore();}
// штамп: 2,2 → 1 за 0,18 с (встряска — HITS)
function stamp(c,s,x,y,rot,t,t0,col,sz){const k=cl((t-t0+.18)/.18);if(k<=0)return;
  const w=tm(c,s,{f:'O',w:700,s:sz,ls:8})+90,h=sz*1.75,sc=lp(2.2,1,k*k);
  c.save();c.translate(x,y);c.rotate(rot);c.scale(sc,sc);c.globalAlpha*=cl(k*3)*.94;
  c.strokeStyle=col;c.lineWidth=10;RR(c,-w/2,-h/2,w,h,14);c.stroke();c.lineWidth=3.5;RR(c,-w/2+14,-h/2+14,w-28,h-28,7);c.stroke();
  tx(c,s,0,sz*.36,{f:'O',w:700,s:sz,ls:8,c:col});c.restore();
  const pk=(t-t0)/.45;if(pk>0&&pk<1){c.save();c.strokeStyle=col;c.globalAlpha=1-pk;c.lineWidth=10*(1-pk);c.beginPath();c.arc(x,y,100+pk*460,0,TAU);c.stroke();c.restore();}}
const HITS=[];
function shake(t){for(const h of HITS)if(t>=h&&t<h+.22){const k=1-(t-h)/.22,f=Math.floor(t*60);return [(H1(f)-.5)*30*k,(H1(f+7)-.5)*30*k];}return [0,0];}
function pin(c,x,y,col){c.save();c.fillStyle='rgba(0,0,0,.45)';c.beginPath();c.ellipse(x+6,y+8,17,11,0,0,TAU);c.fill();c.fillStyle=RG(c,x-4,y-5,2,19,[[0,'#ff8a8a'],[.4,col],[1,'#5a0a0e']]);c.beginPath();c.arc(x,y,16,0,TAU);c.fill();c.restore();}
function grid(c,step,a,col){c.save();c.strokeStyle=rgba(col,a);c.lineWidth=1;c.beginPath();for(let x=0;x<=WW;x+=step){c.moveTo(x+.5,0);c.lineTo(x+.5,HH);}for(let y=0;y<=HH;y+=step){c.moveTo(0,y+.5);c.lineTo(WW,y+.5);}c.stroke();c.restore();}
// тень листа/предмета (кэш)
function shadowSpr(key,w,h,bl,a){return cache('sh'+key,w+bl*6,h+bl*6,x=>{x.filter=`blur(${bl}px)`;x.fillStyle=`rgba(0,0,0,${a})`;x.fillRect(bl*3,bl*3,w,h);});}
// маркер: жёлтая полоса с неровным краем
function marker(c,x0,y0,w,h,k,col='rgba(255,214,40,.85)'){if(k<=0)return;c.save();c.globalCompositeOperation='multiply';c.fillStyle=col;
  c.beginPath();c.moveTo(x0,y0+3);for(let i=0;i<=24;i++)c.lineTo(x0+w*k*i/24,y0+2+Math.sin(i*1.7)*2);c.lineTo(x0+w*k,y0+h);for(let i=24;i>=0;i--)c.lineTo(x0+w*k*i/24,y0+h+Math.sin(i*2.3)*2);c.fill();c.restore();}
// плашка «скрыто»: чёрный прямоугольник поверх строки
function redact(c,x,y,w,h){c.save();c.fillStyle='#0b0a09';c.beginPath();c.moveTo(x,y+2);c.lineTo(x+w,y);c.lineTo(x+w-3,y+h);c.lineTo(x+2,y+h-1);c.closePath();c.fill();c.restore();}

/* ================= 1. МОСКВА-СИТИ ночью ================= */
const BASE=1330;
const TOW=[[150,124,650,'caps',0],[312,140,560,'evo',0],[452,104,730,'imp',1],[592,150,250,'fed',0],[762,156,430,'merc',1],[917,126,480,'oko',0],[1032,100,800,'low',1],[48,104,870,'low',0]];
function towerPath(cx,w,top,kind){
  const p=new Path2D(),L=cx-w/2,R=cx+w/2;
  if(kind==='fed'){p.moveTo(L,BASE);p.lineTo(cx-w*.40,top+70);p.lineTo(cx-7,top);p.lineTo(cx-2,top-210);p.lineTo(cx+2,top-210);p.lineTo(cx+7,top);p.lineTo(cx+w*.40,top+70);p.lineTo(R,BASE);p.closePath();
    p.moveTo(R-14,BASE);p.lineTo(R-8,top+330);p.lineTo(R+52,top+292);p.lineTo(R+70,BASE);p.closePath();}
  else if(kind==='merc'){const P=[[L,BASE],[L,top+230],[cx-w*.38,top+230],[cx-w*.38,top+130],[cx-w*.24,top+130],[cx-w*.24,top+50],[cx-w*.10,top],[cx+w*.10,top],[cx+w*.24,top+50],[cx+w*.24,top+130],[cx+w*.38,top+130],[cx+w*.38,top+230],[R,top+230],[R,BASE]];
    p.moveTo(P[0][0],P[0][1]);for(const q of P.slice(1))p.lineTo(q[0],q[1]);p.closePath();}
  else if(kind==='evo'){const tl=y=>L+16*Math.sin((y-top)*.011),tr=y=>R+16*Math.sin((y-top)*.011+1.3);
    p.moveTo(tl(BASE),BASE);for(let y=BASE;y>=top+40;y-=20)p.lineTo(tl(y),y);p.quadraticCurveTo(cx,top-36,tr(top+40),top+40);for(let y=top+40;y<=BASE;y+=20)p.lineTo(tr(y),y);p.closePath();}
  else if(kind==='imp'){p.moveTo(L,BASE);p.lineTo(L,top+50);p.quadraticCurveTo(cx,top-50,R,top+50);p.lineTo(R,BASE);p.closePath();}
  else if(kind==='oko'){p.moveTo(L,BASE);p.lineTo(L,top+120);p.lineTo(cx+w*.15,top);p.lineTo(R,top+70);p.lineTo(R,BASE);p.closePath();}
  else if(kind==='caps'){for(let i=0,y=BASE;y>top;i++,y-=84){const dx=i%2?14:-14,y0=Math.max(top,y-86);p.rect(L+dx,y0,w,y-y0+2);}}
  else p.rect(L,top,w,BASE-top);
  return p;}
function towersTex(){return cache('towers',WW,BASE+20,x=>{
  const far=mkc(WW,BASE+20),f=far.getContext('2d');
  for(let i=0;i<30;i++){const bx=H1(i*3.7)*WW-40,bw=40+H1(i*1.3)*90,bh=110+H1(i*9.1)**2*460;f.fillStyle='#131a2e';f.fillRect(bx,BASE-bh,bw,bh+20);
    for(let r=0;r<bh/22;r++)for(let k=0;k<bw/16;k++)if(H2(i*31+r,k)>.8){f.fillStyle='rgba(255,200,150,.35)';f.fillRect(bx+4+k*16,BASE-bh+8+r*22,6,8);}}
  x.filter='blur(3px)';x.globalAlpha=.8;x.drawImage(far,0,0);x.filter='none';x.globalAlpha=1;
  for(const [cx,w,top,kind,warm] of TOW){
    const p=towerPath(cx,w,top,kind),L=cx-w/2-30,R=cx+w/2+80,glass=kind==='fed'||kind==='evo'||kind==='merc';
    x.save();
    x.fillStyle=warm?LG(x,L,0,R,0,[[0,'#2b1b11'],[.5,'#1c120c'],[1,'#0d0806']]):LG(x,L,0,R,0,[[0,'#13203c'],[.5,'#0b1328'],[1,'#060a16']]);
    x.fill(p);x.clip(p);
    // этажи и окна: у стеклянных — светящиеся ленты офисов, у остальных — мелкие окна
    x.fillStyle=warm?'rgba(255,190,120,.06)':'rgba(150,190,255,.06)';for(let y=top-220;y<BASE;y+=12)x.fillRect(L,y,R-L,1.2);
    if(glass){for(let r=0,y=top+8;y<BASE-4;r++,y+=12){let xx=L+H2(cx+r,3)*40;while(xx<R){const len=14+70*H2(cx*.3+r,xx*.07),on=H2(r*1.7+cx,xx*.13)>.5;
        if(on){const ww=warm||H2(xx,r)>.6,al=.22+.5*H2(r,xx*.3);x.fillStyle=ww?`rgba(255,${205+35*H1(r+xx)|0},160,${al})`:`rgba(185,222,255,${al})`;x.fillRect(xx,y+2,len,4);}
        xx+=len+6+30*H2(xx*.11,r);}}
      x.fillStyle='rgba(0,0,0,.28)';for(let xx=L;xx<R;xx+=18)x.fillRect(xx,top-220,1.5,BASE-top+220);}
    else{for(let r=0,y=top+10;y<BASE-6;r++,y+=15)for(let k=0,xx=L+4;xx<R;k++,xx+=12){const h=H2(cx*.37+r,k*1.7+top*.1);
      if(h>.62){const ww=warm||H2(k,r*3)>.55;x.fillStyle=ww?`rgba(255,${200+40*H1(r+k)|0},150,${.28+.5*H1(r*7+k)})`:`rgba(190,225,255,${.25+.45*H1(r*3+k)})`;x.fillRect(xx,y,6,7);}}}
    x.globalCompositeOperation='screen';x.fillStyle=LG(x,L,0,R,0,[[0,'rgba(255,255,255,0)'],[.16,'rgba(190,220,255,.12)'],[.22,'rgba(255,255,255,.02)'],[.78,'rgba(255,255,255,0)'],[.9,'rgba(170,210,255,.13)'],[1,'rgba(255,255,255,0)']]);x.fillRect(L,top-240,R-L,BASE-top+260);
    x.restore();
    x.save();x.strokeStyle=warm?'rgba(255,190,130,.3)':'rgba(170,210,255,.3)';x.lineWidth=1.6;x.stroke(p);x.restore();}
});}
function reflTex(){return cache('refl',WW,700,x=>{x.filter='blur(3px)';x.scale(1,-.5);x.drawImage(towersTex(),0,-BASE);});}
function skyTex(){return cache('sky',WW+400,BASE+420,x=>{x.fillStyle=LG(x,0,0,0,BASE+420,[[0,'#02040a'],[.36,'#071026'],[.62,'#121a38'],[.8,'#2b1f33'],[.92,'#5a3324'],[1,'#7a4422']]);x.fillRect(0,0,WW+400,BASE+420);
  for(let i=0;i<90;i++){x.fillStyle=`rgba(220,230,255,${.15+.4*H1(i*3.3)})`;const r=.6+1.2*H1(i*5.1);x.fillRect(H1(i*7.1)*(WW+400),H1(i*2.9)*700,r,r);}});}
function city(c,t){
  c.drawImage(skyTex(),-200,-420);
  fog(c,t,470,{n:10,sp:60,h:220,r:420,a:.06,seed:3});
  for(const [bx,sp,ph] of [[210,.45,0],[640,.38,2],[960,.5,4.1]])beam(c,bx,BASE-10,Math.PI+Math.sin(t*sp+ph)*.32,.085,1700,'#d6e4ff',.36);
  c.drawImage(towersTex(),0,0);
  for(const [x,y,ph] of [[592,40,0],[762,430,1.3],[936,482,2.1],[452,692,.7]]){const b=Math.sin(t*3.2+ph)>.2?1:.15;glowDot(c,x,y,30,'#ff2a2a',b);c.fillStyle=`rgba(255,90,90,${b})`;c.beginPath();c.arc(x,y,4.5,0,TAU);c.fill();}
  // бегущий блик по стеклу
  const gx=((t*.22)%1.6-.3)*WW;c.save();c.globalCompositeOperation='screen';c.globalAlpha=.10;c.translate(gx,700);c.rotate(.35);c.fillStyle=LG(c,-90,0,90,0,[[0,'rgba(255,255,255,0)'],[.5,'rgba(220,235,255,1)'],[1,'rgba(255,255,255,0)']]);c.fillRect(-90,-900,180,1800);c.restore();
  fog(c,t,BASE-40,{n:16,sp:90,h:120,r:300,a:.13,seed:9});
  c.fillStyle=LG(c,0,BASE,0,HH,[[0,'#0b0d18'],[.4,'#05070d'],[1,'#020306']]);c.fillRect(-300,BASE,WW+600,HH-BASE+500);
  const R=reflTex();c.save();c.globalCompositeOperation='screen';c.globalAlpha=.6;
  for(let j=0;j<R.height;j+=10){const dx=6*Math.sin(t*2.6+j*.09)+3*Math.sin(t*1.3+j*.21);c.drawImage(R,0,j,WW,10,dx,BASE+6+j,WW,10);}
  c.restore();
  c.fillStyle='rgba(255,190,120,.55)';c.fillRect(-300,BASE,WW+600,3);
  for(let i=0;i<20;i++)glowDot(c,i*58+14,BASE+2,22,'#ffb36b',.7);
  fog(c,t,BASE+160,{n:10,sp:40,h:200,r:360,a:.07,seed:17});
}
// «29» — объёмная золотая цифра (как «2017» у «Династии»)
function big29(c,t,t0,t1){if(t<t0-.02)return;const k=cl((t-t0)/.55),p=spr(k),out=cl((t-t1)/.16),sc=lp(1.9,1,p)*lp(1,.86,eo(out)),a=cl((t-t0)/.08)*(1-out);if(a<=0)return;
  glowDot(c,540,800,560,'#ff9a4a',.24*a);
  c.save();c.globalAlpha=a;c.translate(540,800);c.scale(sc,sc);font(c,{f:'U',w:800,s:430});c.textAlign='center';c.textBaseline='middle';
  for(let L=16;L>0;L--){c.fillStyle=`rgb(${62-L*2},${34-L},12)`;c.fillText('29',L*1.4,L*2.0);}
  c.shadowColor='rgba(255,170,70,.8)';c.shadowBlur=60;c.fillStyle=LG(c,0,-180,0,180,[[0,'#fff7e6'],[.5,'#ffd08a'],[1,'#ff9a3a']]);c.fillText('29',0,0);
  c.shadowBlur=0;tx(c,'YEARS OLD',0,250,{f:'J',w:700,s:34,ls:14,c:'rgba(255,225,180,.9)'});
  c.restore();}

/* ================= 2. СТОЛ: досье и договор ================= */
const DW=1400,DH=3000;
const DOS={x:470,y:760,w:640,h:420,r:-.05},CON={x:720,y:1700,w:1000,h:1320,r:.022};
function woodTex(){return cache('wood',DW,DH,x=>{x.fillStyle='#150d08';x.fillRect(0,0,DW,DH);const n=mkc(350,750),y=n.getContext('2d'),im=y.createImageData(350,750),d=im.data;
  for(let j=0;j<750;j++)for(let i=0;i<350;i++){const v=fbm(i/5+fbm(i/40,j/40,2)*3,j/110,4),p=(j*350+i)*4;d[p]=110+v*90;d[p+1]=62+v*50;d[p+2]=32+v*26;d[p+3]=255*(.22+.5*v);}
  y.putImageData(im,0,0);x.globalAlpha=.6;x.drawImage(n,0,0,DW,DH);x.globalAlpha=1;});}
function paperBase(x,w,h){x.fillStyle='#efe8d6';x.fillRect(0,0,w,h);x.globalAlpha=.16;x.fillStyle=x.createPattern(noiseTex('pap',256,256,9,3),'repeat');x.fillRect(0,0,w,h);x.globalAlpha=1;
  x.fillStyle=RG(x,w/2,h/2,w*.3,w*.95,[[0,'rgba(0,0,0,0)'],[1,'rgba(90,60,20,.2)']]);x.fillRect(0,0,w,h);}
function dossierTex(){return cache('dos',DOS.w,DOS.h,(x,w,h)=>{paperBase(x,w,h);
  x.fillStyle='rgba(200,40,40,.7)';x.fillRect(0,78,w,2.5);for(let i=0;i<5;i++){x.fillStyle='rgba(80,120,170,.32)';x.fillRect(0,140+i*58,w,1.5);}
  tx(x,'DOSSIER  № 1',34,56,{f:'J',w:700,s:30,ls:4,al:'left',c:'#a01c20'});
  const ink='#26221c';[['NAME',''],['AGE','29'],['CITY','MOSCOW'],['ROLE','TOP EXECUTIVE']].forEach(([k,v],i)=>{tx(x,k+':',34,128+i*58,{f:'J',w:500,s:24,al:'left',c:'rgba(38,34,28,.7)'});tx(x,v,170,128+i*58,{f:'J',w:700,s:30,al:'left',c:ink});});
  redact(x,166,98,330,36);
  x.save();x.translate(w-120,64);x.rotate(.18);x.strokeStyle='rgba(180,20,26,.75)';x.lineWidth=4;x.strokeRect(-88,-26,176,52);tx(x,'CLASSIFIED',0,10,{f:'O',w:700,s:28,ls:4,c:'rgba(180,20,26,.8)'});x.restore();});}
function contractTex(){return cache('con',CON.w,CON.h,(x,w,h)=>{paperBase(x,w,h);const ink='#25221d';
  tx(x,'INVESTMENT AGREEMENT',w/2,124,{f:'J',w:700,s:44,ls:3,c:ink});
  tx(x,'No. 0418/12  ·  MOSCOW  ·  2012',w/2,174,{f:'J',w:500,s:24,ls:2,c:'rgba(37,34,29,.75)'});
  x.fillStyle=ink;x.fillRect(80,204,w-160,3);
  for(let i=0;i<12;i++){const y=272+i*40,ww=(i%5===4?.5:.84+.12*H1(i))*(w-160);x.fillStyle='rgba(40,36,30,.5)';for(let k=0;k<ww;k+=18+30*H1(i*50+k)){const q=Math.min(ww-k,10+34*H1(i*77+k));x.fillRect(80+k,y-12,q,12);}}
  tx(x,'AMOUNT:',80,830,{f:'J',w:500,s:26,al:'left',c:'rgba(37,34,29,.75)'});
  tx(x,'$1,000,000.00',250,834,{f:'J',w:700,s:50,al:'left',c:ink});
  for(let i=0;i<3;i++){const y=920+i*40,ww=(.7+.2*H1(i*9))*(w-160);x.fillStyle='rgba(40,36,30,.45)';for(let k=0;k<ww;k+=18+30*H1(i*31+k)){const q=Math.min(ww-k,10+34*H1(i*17+k));x.fillRect(80+k,y-12,q,12);}}
  tx(x,'SIGNATURE:',80,1110,{f:'J',w:500,s:26,al:'left',c:'rgba(37,34,29,.75)'});
  x.fillStyle=ink;x.fillRect(300,1120,600,2.5);redact(x,500,1138,160,26);});}
const SIG=(()=>{const a=[];for(let i=0;i<=170;i++){const s=i/170,x=330+510*s+22*Math.sin(s*Math.PI*13),y=1096-34*Math.abs(Math.sin(s*Math.PI*6.5))*(1-.35*s)+8*Math.cos(s*Math.PI*13);a.push([x,y]);}
  for(let i=1;i<=34;i++){const s=i/34;a.push([lp(850,360,s),1124+6*Math.sin(s*3)]);}return a;})();
function onP(P,px,py){const c0=Math.cos(P.r),s0=Math.sin(P.r),dx=px-P.w/2,dy=py-P.h/2;return [P.x+dx*c0-dy*s0,P.y+dx*s0+dy*c0];}
function paperAt(c,img,P,key){const s=shadowSpr(key,P.w,P.h,14,.5);c.save();c.translate(P.x,P.y);c.rotate(P.r);c.drawImage(s,-P.w/2-42+14,-P.h/2-42+22);c.drawImage(img,-P.w/2,-P.h/2);c.restore();}
let THC=null;
function polaroid(c,x,y,r){c.save();c.translate(x,y);c.rotate(r);const s=shadowSpr('pol',340,410,12,.5);c.drawImage(s,-170-36+10,-205-36+16);
  c.fillStyle='#f1ede4';c.fillRect(-170,-205,340,410);if(THC)c.drawImage(THC,-150,-185,300,300);
  c.save();c.globalCompositeOperation='screen';c.fillStyle=LG(c,-150,-185,150,115,[[0,'rgba(255,255,255,.18)'],[.4,'rgba(255,255,255,0)']]);c.fillRect(-150,-185,300,300);c.restore();
  tx(c,'MOSCOW · 2012',0,170,{f:'C',w:700,s:42,c:'#2a2a6a'});c.restore();}
function paperclip(c,x,y,r){c.save();c.translate(x,y);c.rotate(r);c.strokeStyle=LG(c,-20,0,20,0,[[0,'#7d858d'],[.5,'#e6ebef'],[1,'#6a727a']]);c.lineWidth=7;c.lineCap='round';
  c.beginPath();c.moveTo(-12,60);c.lineTo(-12,-60);c.arc(4,-60,16,Math.PI,0);c.lineTo(20,70);c.arc(4,70,16,0,Math.PI);c.lineTo(-12,-30);c.stroke();c.restore();}
function pen(c,x,y,ang){c.save();c.translate(x,y);c.rotate(ang);
  c.save();c.translate(10,26);c.fillStyle='rgba(0,0,0,.35)';c.filter='blur(6px)';RR(c,40,-12,360,26,13);c.fill();c.restore();
  c.fillStyle=LG(c,0,-9,0,9,[[0,'#e8c870'],[.5,'#fff1b8'],[1,'#a8822a']]);PL(c,[0,0,48,-10,48,10]);c.fill();c.fillStyle='rgba(60,40,10,.6)';c.fillRect(18,-1,28,2);
  c.fillStyle='#16161a';c.fillRect(46,-12,22,24);
  c.fillStyle=LG(c,0,-16,0,16,[[0,'#2a2a30'],[.35,'#70707e'],[.6,'#1a1a20'],[1,'#0a0a0d']]);RR(c,66,-16,330,32,16);c.fill();
  c.fillStyle='#c9a24a';c.fillRect(150,-16,10,32);c.fillRect(384,-16,9,32);c.fillStyle='rgba(255,255,255,.35)';c.fillRect(80,-10,300,3);c.restore();}
function watch(c,x,y,r,t){c.save();c.translate(x,y);c.rotate(-.35);
  c.save();c.translate(14,22);c.fillStyle='rgba(0,0,0,.45)';c.filter='blur(12px)';c.beginPath();c.arc(0,0,r*1.05,0,TAU);c.fill();c.fillRect(-r*.55,-r*2.6,r*1.1,r*5.2);c.restore();
  c.fillStyle=LG(c,-r*.6,0,r*.6,0,[[0,'#1a1310'],[.5,'#2c211a'],[1,'#120d0a']]);RR(c,-r*.55,-r*2.6,r*1.1,r*5.2,22);c.fill();
  c.fillStyle=LG(c,-r,-r,r,r,[[0,'#f2f4f6'],[.3,'#9aa2aa'],[.6,'#5b636b'],[1,'#d8dde2']]);c.beginPath();c.arc(0,0,r,0,TAU);c.fill();
  c.fillStyle=RG(c,-r*.2,-r*.25,4,r*.86,[[0,'#1a2a4a'],[1,'#070c18']]);c.beginPath();c.arc(0,0,r*.84,0,TAU);c.fill();
  for(let i=0;i<12;i++){const a=i/12*TAU;c.save();c.rotate(a);c.fillStyle=i%3?'rgba(220,230,245,.7)':'#e9c46a';c.fillRect(-2.5,-r*.78,5,i%3?12:22);c.restore();}
  const hand=(a,l,w,col)=>{c.save();c.rotate(a);c.fillStyle=col;RR(c,-w/2,-l,w,l+10,w/2);c.fill();c.restore();};
  hand(TAU*(11.7/12),r*.48,10,'#e8ecf2');hand(TAU*(42/60),r*.68,7,'#e8ecf2');hand(t*TAU/60*6,r*.74,2.5,'#ff5a3a');
  c.fillStyle='#e9c46a';c.beginPath();c.arc(0,0,7,0,TAU);c.fill();
  c.globalCompositeOperation='screen';c.fillStyle=LG(c,-r,-r,r*.3,r*.3,[[0,'rgba(255,255,255,.35)'],[.5,'rgba(255,255,255,.04)'],[1,'rgba(255,255,255,0)']]);c.beginPath();c.arc(0,0,r*.84,0,TAU);c.fill();
  c.restore();}
function desk(c,t,o){
  c.drawImage(woodTex(),0,0);
  // папка под досье
  c.save();c.translate(DOS.x+50,DOS.y+50);c.rotate(.035);c.drawImage(shadowSpr('fold',960,690,16,.55),-480-48+12,-345-48+20);c.fillStyle='#5a4122';c.fillRect(-480,-345,960,690);c.fillStyle='#6b4f2b';RR(c,-480,-395,320,60,[16,16,0,0]);c.fill();c.restore();
  paperAt(c,dossierTex(),DOS,'dos');
  if(o.hl>0){c.save();c.translate(DOS.x,DOS.y);c.rotate(DOS.r);c.translate(-DOS.w/2,-DOS.h/2);marker(c,160,128+3*58-34,tm(c,'TOP EXECUTIVE',{f:'J',w:700,s:30})+22,42,o.hl);c.restore();}
  polaroid(c,DOS.x+270,DOS.y-250,.09);paperclip(c,DOS.x+250,DOS.y-430,.12);
  paperAt(c,contractTex(),CON,'con');
  if(o.sig>0){const n=Math.floor(SIG.length*cl(o.sig));c.save();c.translate(CON.x,CON.y);c.rotate(CON.r);c.translate(-CON.w/2,-CON.h/2);
    c.strokeStyle='#18245e';c.lineWidth=5;c.lineCap='round';c.lineJoin='round';c.beginPath();for(let i=0;i<n;i++){const [x,y]=SIG[i];i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();c.restore();}
  const k=cl(o.sig||0),tip=SIG[Math.min(SIG.length-1,Math.floor(SIG.length*k))],pw=onP(CON,tip[0],tip[1]),pa=o.sig>0&&o.sig<1?-.62+.05*Math.sin(t*30):-.7;
  const rest=onP(CON,980,940),ap=o.app!=null?eio(o.app):(o.sig>0?1:0),hov=o.sig>0?0:16*(1-ap)+10;
  const px=lp(rest[0]+60,pw[0],ap),py=lp(rest[1]-40,pw[1],ap)-hov;pen(c,px,py,lp(-.75,pa,ap));
  watch(c,1190,1030,118,t);
  beam(c,120,-520,-.42,.95,3000,'#ffd59a',.62);pool(c,640,1250,900,700,'#ffcf8a',.30);dust(c,t,120,-520,-.42,.95,3000,140,21,.7);
}

/* ================= 3. ГРАФИК И СЧЁТЧИК ================= */
let CND=null;
function candles(){if(CND)return CND;CND=[];let v=100;for(let i=0;i<70;i++){const o0=v,ch=(H1(i*3.7)-.38)*16+i*.12,c0=o0+ch,hi=Math.max(o0,c0)+H1(i*5.1)*7,lo=Math.min(o0,c0)-H1(i*7.9)*7;CND.push([o0,hi,lo,c0,20+H1(i*2.2)*60]);v=c0;}return CND;}
function chart(c,t,u,o){const D0=candles();c.fillStyle='#050203';c.fillRect(0,0,WW,HH);
  c.fillStyle=RG(c,WW*.6,HH*.48,50,1300,[[0,'rgba(130,12,18,.38)'],[1,'rgba(0,0,0,0)']]);c.fillRect(0,0,WW,HH);grid(c,90,.05,'#ffd0d0');
  c.save();view(c,1+u*.04,540,1000);
  const n=Math.floor(lp(34,70,eo(cl(u/1.8)))),vis=D0.slice(Math.max(0,n-30),n),lo=Math.min(...vis.map(d=>d[2])),hi=Math.max(...vis.map(d=>d[1]));
  const X1=990,cw=32,Y0=1560,Y1=880,Y=v=>lp(Y0,Y1,(v-lo)/(hi-lo+1e-6));
  for(let i=Math.max(0,n-31);i<n;i++){const [o0,h0,l0,c0,vol]=D0[i],x=X1-(n-1-i)*cw;if(x<40)continue;const up=c0>=o0,col=up?'#f4efe8':'#e3232c';
    c.strokeStyle=col;c.lineWidth=2;c.beginPath();c.moveTo(x,Y(h0));c.lineTo(x,Y(l0));c.stroke();c.fillStyle=col;c.fillRect(x-10,Math.min(Y(o0),Y(c0)),20,Math.max(3,Math.abs(Y(o0)-Y(c0))));
    c.fillStyle=up?'rgba(244,239,232,.18)':'rgba(227,35,44,.25)';c.fillRect(x-10,1760-vol*1.4,20,vol*1.4);}
  const last=D0[n-1],ly=Y(last[3]);c.save();c.setLineDash([8,8]);c.strokeStyle='rgba(255,255,255,.4)';c.beginPath();c.moveTo(40,ly);c.lineTo(X1+40,ly);c.stroke();c.restore();glowDot(c,X1,ly,90,'#ff4a3a',.65);
  c.restore();
  const vk=t>=o.c1?1:eo(cl((t-o.c0)/(o.c1-o.c0))),val=vk>=1?1e6:Math.floor(1e6*vk/7)*7,pop=t>o.c1?1+.1*Math.exp(-(t-o.c1)*14):1;
  c.fillStyle='rgba(0,0,0,.5)';c.fillRect(0,400,WW,280);
  c.save();c.translate(540,560);c.scale(pop,pop);tx(c,money(val),0,0,{f:'U',w:800,s:112,c:'#fff',glow:t>o.c1?'#ff3a2a':'#e3232c',gb:t>o.c1?40:20});c.restore();
  tx(c,'ONE DEAL  ·  ONE SIGNATURE',540,640,{f:'J',w:700,s:26,ls:6,c:'#ff8a80'});
  stamp(c,'APPROVED',540,1190,-.12,t,o.st,'#ff4646',96);
}

/* ================= 4. НОЧЬ: вход в клуб ================= */
function brick(){return cache('brick',WW,HH,x=>{x.fillStyle='#0d0a0b';x.fillRect(0,0,WW,HH);for(let r=0;r<48;r++)for(let k=0;k<13;k++){const bx=k*96+(r%2)*48-48,by=r*40,v=13+10*H1(r*31+k);x.fillStyle=`rgb(${v+7|0},${v|0},${v+1|0})`;x.fillRect(bx+3,by+3,90,34);}
  x.globalAlpha=.12;x.fillStyle=x.createPattern(noiseTex('wall',512,512,60,4),'repeat');x.fillRect(0,0,WW,HH);});}
function neonText(c,s,x,y,sz,col,fl){c.save();font(c,{f:'C',w:700,s:sz});c.textAlign='center';c.textBaseline='middle';c.globalAlpha*=fl;
  c.shadowColor=col;c.shadowBlur=70;c.fillStyle=col;c.fillText(s,x,y);c.shadowBlur=28;c.fillText(s,x,y);c.shadowBlur=8;c.fillStyle='#ffe3f1';c.fillText(s,x,y);c.restore();}
function stanchion(c,x,y){c.save();c.fillStyle='rgba(0,0,0,.5)';c.beginPath();c.ellipse(x+10,y+12,70,18,0,0,TAU);c.fill();
  c.fillStyle=LG(c,x-60,0,x+60,0,[[0,'#6a4a12'],[.35,'#f5d77a'],[.6,'#b8892a'],[1,'#4a3008']]);c.beginPath();c.ellipse(x,y,62,16,0,0,TAU);c.fill();
  c.fillStyle=LG(c,x-12,0,x+12,0,[[0,'#7a5614'],[.4,'#ffe39a'],[1,'#5a3c0a']]);c.fillRect(x-11,y-200,22,200);
  c.fillStyle=RG(c,x-8,y-222,2,26,[[0,'#fff4c8'],[.5,'#d6a83c'],[1,'#5a3c0a']]);c.beginPath();c.arc(x,y-214,22,0,TAU);c.fill();c.restore();}
function rope(c,x0,y0,x1,y1,t){const my=Math.max(y0,y1)+120+4*Math.sin(t*1.5);c.save();c.lineCap='round';
  c.strokeStyle='rgba(0,0,0,.45)';c.lineWidth=26;c.beginPath();c.moveTo(x0,y0+14);c.quadraticCurveTo((x0+x1)/2,my+14,x1,y1+14);c.stroke();
  c.strokeStyle=LG(c,0,y0-12,0,my+12,[[0,'#8a0a1c'],[.5,'#5a0612'],[1,'#2a0208']]);c.lineWidth=24;c.beginPath();c.moveTo(x0,y0);c.quadraticCurveTo((x0+x1)/2,my,x1,y1);c.stroke();
  c.strokeStyle='rgba(255,120,150,.35)';c.lineWidth=4;c.beginPath();c.moveTo(x0,y0-7);c.quadraticCurveTo((x0+x1)/2,my-8,x1,y1-7);c.stroke();c.restore();}
function rain(c,t,a){c.save();c.globalCompositeOperation='screen';c.strokeStyle=`rgba(200,220,255,${.16*a})`;c.lineWidth=1.6;c.beginPath();
  for(let i=0;i<150;i++){const x=((H1(i)*1300+t*260)%1300)-110,y=((H1(i*7.3)*2200+t*2400*(.7+.3*H1(i*3)))%2200)-140;c.moveTo(x,y);c.lineTo(x-12,y+64);}c.stroke();c.restore();}
function club(c,t,u){
  c.drawImage(brick(),0,0);const fl=(H1(Math.floor(t*14))>.93?.5:1);
  c.save();view(c,1.02+u*.04,540,930);
  glowDot(c,540,560,860,'#ff2f8e',.30*fl);
  c.fillStyle=LG(c,0,820,0,1520,[[0,'#060405'],[1,'#0e0a0d']]);RR(c,330,800,420,720,[44,44,0,0]);c.fill();c.strokeStyle='rgba(255,120,180,.28)';c.lineWidth=3;c.stroke();
  glowDot(c,540,1120,260,'#ff7ab8',.10);
  c.fillStyle=LG(c,480,0,600,0,[[0,'#7a5614'],[.5,'#f5d77a'],[1,'#7a5614']]);RR(c,470,880,140,46,6);c.fill();tx(c,'PRIVATE',540,912,{f:'J',w:700,s:20,ls:3,c:'#2a1a06'});
  neonText(c,'Velvet',540,580,250,'#ff2f8e',fl);
  c.fillStyle='#ffd6ea';c.globalAlpha=.9*fl;RR(c,350,700,380,6,3);c.fill();c.globalAlpha=1;
  PL(c,[380,1520,700,1520,1000,1980,80,1980]);c.fillStyle=LG(c,0,1520,0,1980,[[0,'#3a0510'],[1,'#7a0a18']]);c.fill();
  stanchion(c,240,1600);stanchion(c,840,1600);rope(c,240,1392,840,1392,t);
  c.restore();
  glowDot(c,540,1820,520,'#ff2f8e',.12*fl);
  rain(c,t,1);
  c.drawImage(bokeh('club',WW,HH,26,['#ff7ab8','#8fd6ff','#ffb36b'],50,150,51,8),0,lp(80,40,u));
}
// список гостей: имя героя скрыто — это развязка в конце
const GL=['ALEX VOLKOV','DMITRY ORLOV','KATYA SOKOLOVA','ARTEM BELOV','','IRINA LEBEDEVA','PAVEL GROMOV','DASHA MOROZOVA','OLEG KRAVETS','SVETA NIKOLAEVA','ROMAN ZIMIN'];
function listTex(){return cache('gl',740,1110,(x,w,h)=>{paperBase(x,w,h);const ink='#26221c';
  tx(x,'GUEST LIST',44,92,{f:'U',w:800,s:50,al:'left',c:ink});tx(x,'FRIDAY  ·  VIP  ·  23:00',46,138,{f:'J',w:500,s:22,ls:3,al:'left',c:'rgba(38,34,28,.7)'});
  x.fillStyle=ink;x.fillRect(44,160,w-88,3);
  GL.forEach((s,i)=>{const y=236+i*78;x.strokeStyle='rgba(38,34,28,.6)';x.lineWidth=2.5;x.strokeRect(46,y-30,32,32);
    if(s)tx(x,s,104,y,{f:'J',w:700,s:30,al:'left',c:ink});else redact(x,100,y-30,300,36);
    tx(x,i===4?'VIP':['+1','','+2','','','+1','','','+3','',''][i],w-48,y,{f:'J',w:700,s:24,al:'right',c:i===4?'#a01c20':'rgba(38,34,28,.6)'});
    x.fillStyle='rgba(38,34,28,.12)';x.fillRect(44,y+18,w-88,1.5);
    if([0,2,3,6,8].includes(i)){x.strokeStyle='rgba(40,40,40,.55)';x.lineWidth=4;x.beginPath();x.moveTo(52,y-14);x.lineTo(62,y-2);x.lineTo(84,y-34);x.stroke();}});});}
function blackCard(c,x,y,r,s){c.save();c.translate(x,y);c.rotate(r);c.scale(s,s);
  c.drawImage(shadowSpr('bc',520,330,14,.6),-260-42+14,-165-42+24);
  c.fillStyle=LG(c,-260,-165,260,165,[[0,'#0b0b0d'],[.45,'#2a2b31'],[.55,'#141418'],[1,'#060607']]);RR(c,-260,-165,520,330,26);c.fill();
  c.save();RR(c,-260,-165,520,330,26);c.clip();c.globalCompositeOperation='screen';c.fillStyle=LG(c,-260,0,260,0,[[0,'rgba(255,255,255,0)'],[.4,'rgba(255,255,255,.10)'],[.5,'rgba(255,255,255,.02)'],[1,'rgba(255,255,255,0)']]);c.fillRect(-260,-165,520,330);c.restore();
  c.strokeStyle='rgba(255,255,255,.18)';c.lineWidth=2;RR(c,-260,-165,520,330,26);c.stroke();
  c.fillStyle=LG(c,-190,-40,-110,20,[[0,'#f5d77a'],[.5,'#b88a2a'],[1,'#f0cf72']]);RR(c,-200,-50,92,70,10);c.fill();c.strokeStyle='rgba(90,60,10,.6)';c.lineWidth=1.5;c.beginPath();c.moveTo(-154,-50);c.lineTo(-154,20);c.moveTo(-200,-15);c.lineTo(-108,-15);c.stroke();
  tx(c,'BLACK',212,-104,{f:'U',w:800,s:34,al:'right',c:'#d8dce2'});
  tx(c,'••••  ••••  ••••  0418',-200,92,{f:'J',w:500,s:28,ls:2,al:'left',c:'rgba(225,230,238,.85)'});c.restore();}
function guest(c,t,u,o){
  c.fillStyle='#070507';c.fillRect(0,0,WW,HH);
  c.drawImage(bokeh('gl',WW*1.2,HH*1.2,60,['#ff2f8e','#ffb36b','#8fd6ff'],30,110,71,6),-WW*.1-u*16,-HH*.1);
  c.save();view(c,1.04+u*.05,540,1010,-.03);
  c.drawImage(shadowSpr('clip',800,1200,18,.6),130-54+16,420-54+26);
  c.fillStyle=LG(c,130,0,930,0,[[0,'#1d1510'],[.5,'#2a1e16'],[1,'#140e0a']]);RR(c,130,420,800,1200,30);c.fill();
  c.drawImage(listTex(),160,490);
  // зажим
  c.fillStyle=LG(c,0,380,0,500,[[0,'#f2f4f6'],[.4,'#8d959c'],[1,'#3d444a']]);RR(c,380,390,320,100,22);c.fill();c.fillStyle='#262b30';RR(c,470,420,140,26,13);c.fill();
  // красная галочка у скрытого имени и обводка
  const ry=490+236+4*78,ck=eio(cl((t-o.chk)/.28));
  if(ck>0){c.save();c.strokeStyle='#d0151c';c.lineWidth=8;c.lineCap='round';c.lineJoin='round';const P=[[160+52,ry-14],[160+62,ry-2],[160+84,ry-34]],L1=Math.hypot(10,12),L2=Math.hypot(22,32),d=ck*(L1+L2);
    c.beginPath();c.moveTo(P[0][0],P[0][1]);if(d<=L1)c.lineTo(lp(P[0][0],P[1][0],d/L1),lp(P[0][1],P[1][1],d/L1));else{c.lineTo(P[1][0],P[1][1]);const q=(d-L1)/L2;c.lineTo(lp(P[1][0],P[2][0],q),lp(P[1][1],P[2][1],q));}c.stroke();c.restore();}
  const ok=eio(cl((t-o.circ)/.4));if(ok>0){c.save();c.strokeStyle='rgba(208,21,28,.85)';c.lineWidth=6;c.beginPath();c.ellipse(160+260,ry-12,215,50,-.03,-Math.PI*.6,-Math.PI*.6+TAU*ok*1.04);c.stroke();c.restore();}
  c.restore();
  beam(c,1180,-260,.5,.42,2400,'#fff6dc',.5);pool(c,520,1100,520,360,'#fff3d0',.22);
  const bk=eo(cl((t-o.card)/.4));if(bk>0)blackCard(c,lp(1400,760,bk),lp(1900,1560,bk),lp(.6,-.22,bk),.92);
}

/* ================= 5. ШАМПАНСКОЕ ================= */
function flute(c,cx,t,lev,pour,u){
  const bowl=new Path2D();bowl.moveTo(cx-104,520);bowl.bezierCurveTo(cx-108,820,cx-82,1070,cx-14,1140);bowl.lineTo(cx+14,1140);bowl.bezierCurveTo(cx+82,1070,cx+108,820,cx+104,520);bowl.closePath();
  c.save();c.clip(bowl);
  c.fillStyle=LG(c,0,lev,0,1150,[[0,'rgba(255,214,120,.92)'],[.5,'rgba(240,180,70,.9)'],[1,'rgba(200,130,40,.95)']]);c.fillRect(cx-140,lev,280,1160-lev);
  c.fillStyle='rgba(255,250,230,.8)';c.fillRect(cx-140,lev-3,280,6);
  if(pour>0){for(let i=0;i<26;i++){const r=10+14*H1(i*3.3);c.fillStyle=`rgba(255,252,240,${.7*pour})`;c.beginPath();c.arc(cx-100+H1(i*7.1)*200,lev-6-H1(i*2.2)*30*pour,r,0,TAU);c.fill();}}
  for(let i=0;i<46;i++){const sp=.35+.5*H1(i*1.7),ph=(t*sp+H1(i*3.1))%1,y=lp(1120,lev+12,ph),bx=cx+(H1(i*5.7)-.5)*(y<900?150:90)+Math.sin(t*6+i)*3,r=1.8+3.2*H1(i*9.3);
    c.strokeStyle=`rgba(255,250,225,${.75*Math.sin(Math.PI*ph)})`;c.lineWidth=1.6;c.beginPath();c.arc(bx,y,r,0,TAU);c.stroke();}
  c.restore();
  c.fillStyle='rgba(255,255,255,.05)';c.fill(bowl);c.strokeStyle='rgba(255,250,240,.55)';c.lineWidth=3;c.stroke(bowl);
  c.save();c.globalCompositeOperation='screen';c.fillStyle=LG(c,cx-104,0,cx-60,0,[[0,'rgba(255,255,255,.45)'],[1,'rgba(255,255,255,0)']]);c.fillRect(cx-98,540,34,520);c.fillStyle='rgba(255,255,255,.35)';c.fillRect(cx+78,580,6,380);c.restore();
  c.fillStyle=LG(c,cx-9,0,cx+9,0,[[0,'rgba(255,255,255,.25)'],[.5,'rgba(255,255,255,.7)'],[1,'rgba(255,255,255,.2)']]);c.fillRect(cx-7,1140,14,350);
  c.fillStyle='rgba(255,255,255,.18)';c.beginPath();c.ellipse(cx,1500,150,24,0,0,TAU);c.fill();c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=2.5;c.stroke();
  if(pour>0){c.save();c.strokeStyle=LG(c,0,-200,0,lev,[[0,'rgba(255,220,140,.9)'],[1,'rgba(255,240,190,.8)']]);c.lineWidth=12*pour;c.lineCap='round';c.beginPath();c.moveTo(cx+40,-200);c.quadraticCurveTo(cx+20+6*Math.sin(t*20),200,cx+8,lev);c.stroke();c.restore();}
}
function champ(c,t,u,o){
  c.fillStyle=LG(c,0,0,0,HH,[[0,'#0c0805'],[1,'#030202']]);c.fillRect(0,0,WW,HH);
  c.drawImage(bokeh('ch',WW*1.3,HH*1.3,70,['#ffcf7a','#ffb36b','#fff1cc'],34,140,81,7),-WW*.15+u*30,-HH*.15);
  beam(c,600,-240,-.03,.5,1900,'#ffe8c0',.62);
  c.save();view(c,1.0+u*.08,540,1000);
  c.fillStyle=LG(c,0,1500,0,2000,[[0,'#1a120c'],[1,'#060403']]);c.fillRect(-300,1500,WW+600,700);c.fillStyle='rgba(255,210,150,.25)';c.fillRect(-300,1500,WW+600,2);
  pool(c,540,1505,420,60,'#ffd99a',.6);
  const pk=cl(1-u/.45),lev=lp(1000,640,eo(cl(u/.5)));flute(c,540,t,lev,pk,u);
  c.restore();
  dust(c,t,600,-240,-.03,.5,1900,120,83,.8);
}
/* ================= 6. ТЕЛЕФОН: «девушки» ================= */
function heart(c,x,y,s,col){c.save();c.translate(x,y);c.scale(s,s);c.fillStyle=col;c.beginPath();c.moveTo(0,6);c.bezierCurveTo(-14,-4,-10,-16,0,-9);c.bezierCurveTo(10,-16,14,-4,0,6);c.fill();c.restore();}
const MSG=[['KATYA','where are you??'],['LENA','come back to the club'],['MASHA','miss you already']];
function phone(c,t,u,o){
  c.fillStyle='#050406';c.fillRect(0,0,WW,HH);c.drawImage(bokeh('ph',WW*1.2,HH*1.2,50,['#ff2f8e','#b06bff','#ffb36b'],40,130,91,8),-WW*.1+u*20,-HH*.1);
  c.save();view(c,1.0+u*.1,540,980,-.05);
  c.drawImage(shadowSpr('phone',560,1160,20,.65),262-60+20,300-60+30);
  c.fillStyle=LG(c,262,0,822,0,[[0,'#2b2d33'],[.5,'#6a6e78'],[1,'#1d1f24']]);RR(c,262,300,560,1160,86);c.fill();
  c.fillStyle='#030304';RR(c,276,314,532,1132,74);c.fill();
  const on=cl((t-o.on)/.12);
  if(on>0){c.save();c.globalAlpha=on;RR(c,276,314,532,1132,74);c.clip();
    c.fillStyle=LG(c,0,314,0,1446,[[0,'#2a0f3a'],[.55,'#140a2a'],[1,'#07050f']]);c.fillRect(276,314,532,1132);
    glowDot(c,540,600,420,'#ff2f8e',.25);
    tx(c,'02:03',542,560,{f:'U',w:800,s:128,c:'#fff'});tx(c,'SATURDAY, APRIL 14',542,616,{f:'J',w:500,s:22,ls:3,c:'rgba(255,255,255,.75)'});
    MSG.forEach(([n,m],i)=>{const k=eo(cl((t-o.on-.08-i*.12)/.22));if(k<=0)return;const y=720+i*168+(1-k)*-60;c.save();c.globalAlpha*=k;
      c.fillStyle='rgba(255,255,255,.16)';RR(c,300,y,484,148,34);c.fill();
      c.fillStyle=LG(c,320,0,388,0,[[0,'#ff4fa0'],[1,'#ff2f6e']]);RR(c,322,y+30,68,68,18);c.fill();heart(c,356,y+68,1.55,'#fff');
      tx(c,n,412,y+64,{f:'U',w:700,s:30,al:'left',c:'#fff'});heart(c,412+tm(c,n,{f:'U',w:700,s:30})+24,y+56,1.05,'#ff4f9a');
      tx(c,m,412,y+108,{f:'M',w:600,s:28,al:'left',c:'rgba(255,255,255,.85)'});tx(c,'now',764,y+62,{f:'M',w:600,s:22,al:'right',c:'rgba(255,255,255,.6)'});c.restore();});
    c.restore();glowDot(c,540,880,720,'#c06bff',.16*on);}
  c.fillStyle='#030304';RR(c,470,334,144,40,20);c.fill();
  c.restore();
}

/* ================= 7. ДОРОЖКА на чёрном стекле (из опенинга dl_open) ================= */
const S2={f:1400,yh:-900,cx:540};
const P2=(x,z)=>[S2.cx+S2.f*x/z,S2.yh+S2.f/z];
const LA={x:-0.10,z:0.72},LB={x:0.30,z:1.30},LWD=0.017;
const LDIR=(()=>{const dx=LB.x-LA.x,dz=LB.z-LA.z,l=Math.hypot(dx,dz);return {ux:dx/l,uz:dz/l,len:l};})();
const GRN=(()=>{const r=rng(21),a=[],{ux,uz,len}=LDIR,nx=-uz,nz=ux;
  for(let i=0;i<4400;i++){const s=r();let off=(r()+r()+r()-1.5)/1.5*LWD*0.55;if(r()<0.05)off=(r()-0.5)*LWD*4.4;
    const al=cl(s+(r()-0.5)*0.004)*len,x=LA.x+ux*al+nx*off,z=LA.z+uz*al+nz*off,big=r()<0.025;
    a.push({s:al/len,x,z,sz:big?0.0030+r()*0.0022:0.0006+r()*r()*0.0021,b:0.72+r()*0.28,ph:r()*TAU});}
  a.sort((p,q)=>q.z-p.z);return a;})();
const DUSTL=(()=>{const r=rng(31),a=[];for(let i=0;i<220;i++)a.push([r()*1300-110,r()*2100-90,0.6+r()*1.8,0.06+r()*0.3]);return a;})();
function glassBg(c){
  c.fillStyle='#06080C';c.fillRect(-500,-500,WW+1000,HH+1000);
  c.fillStyle=lg(c,0,-200,0,HH,[[0,'rgba(38,50,70,0.4)'],[0.5,'rgba(10,14,20,0.12)'],[1,'rgba(0,0,0,0.2)']]);c.fillRect(-500,-500,WW+1000,HH+1000);
  c.drawImage(cache('glassRefl',WW,HH,x=>{x.save();x.translate(300,470);x.rotate(-0.32);
    x.filter='blur(46px)';x.fillStyle='rgba(150,185,240,0.32)';ell(x,0,0,380,100);x.fill();
    x.filter='blur(10px)';x.fillStyle='rgba(210,228,255,0.55)';rr(x,-270,-17,540,34,17);x.fill();
    x.filter='blur(2px)';x.fillStyle='rgba(245,250,255,0.9)';rr(x,-240,-6,480,12,6);x.fill();x.restore();
    x.save();x.translate(880,110);x.rotate(-0.25);x.filter='blur(30px)';x.fillStyle='rgba(150,185,240,0.2)';ell(x,0,0,230,52);x.fill();x.filter='blur(4px)';x.fillStyle='rgba(220,235,255,0.5)';rr(x,-160,-5,320,10,5);x.fill();x.restore();
    for(const d of DUSTL){x.fillStyle=`rgba(210,225,245,${d[3]})`;x.fillRect(d[0],d[1],d[2],d[2]);}
    x.strokeStyle='rgba(200,220,255,0.08)';x.lineWidth=1;const r=rng(41);for(let i=0;i<46;i++){const xx=80+r()*560,yy=300+r()*360,l=20+r()*90,a=-0.3+(r()-.5)*0.6;x.beginPath();x.moveTo(xx,yy);x.lineTo(xx+Math.cos(a)*l,yy+Math.sin(a)*l);x.stroke();}}),0,0);}
function lineGrains(c,shown){
  const {ux,uz,len}=LDIR,nx=-uz,nz=ux,L1=[],R1=[],N=40,s0=1-shown;
  for(let i=0;i<=N;i++){const s=lp(s0,1,i/N),al=s*len,w=LWD*0.42*(1+0.15*Math.sin(i*1.7));L1.push(P2(LA.x+ux*al+nx*w,LA.z+uz*al+nz*w));R1.push(P2(LA.x+ux*al-nx*w,LA.z+uz*al-nz*w));}
  const body=L1.concat(R1.slice().reverse());
  c.save();c.globalCompositeOperation='screen';c.filter='blur(9px)';c.fillStyle='rgba(200,215,235,0.16)';poly(c,body);c.fill();c.restore();
  c.save();c.filter='blur(2.2px)';c.fillStyle='rgba(232,236,238,0.72)';poly(c,body);c.fill();c.restore();
  for(const g of GRN){if(g.s<s0-.004)continue;const q=P2(g.x,g.z),sz=Math.max(0.7,S2.f*g.sz/g.z),d=Math.hypot(q[0]-300,q[1]-470),lit=cl(1-d/1500)*0.25;
    const v=Math.round(185+70*g.b*(0.85+lit));c.fillStyle=`rgb(${v},${v},${Math.min(255,v+4)})`;
    if(sz>2.6){ell(c,q[0],q[1],sz*0.55,sz*0.45,g.ph);c.fill();c.fillStyle='rgba(0,0,0,0.35)';ell(c,q[0]+sz*0.2,q[1]+sz*0.25,sz*0.45,sz*0.3,g.ph);c.fill();}
    else c.fillRect(q[0]-sz/2,q[1]-sz/2,sz,sz);}}
// чёрная карта лежит на стекле поперёк дорожки и «ведёт» её: s — где по дорожке её край
function cardOnGlass(c,s){const {ux,uz,len}=LDIR,nx=-uz,nz=ux,al=s*len,cx=LA.x+ux*al,cz=LA.z+uz*al,hw=0.085,dp=0.11;
  const Q=[[-hw,0],[hw,0],[hw,-dp],[-hw,-dp]].map(([a,b])=>P2(cx+nx*a+ux*b,cz+nz*a+uz*b));
  c.save();c.filter='blur(8px)';c.fillStyle='rgba(0,0,0,.6)';poly(c,Q.map(([x,y])=>[x+10,y+16]));c.fill();c.restore();
  c.fillStyle=lg(c,Q[0][0],Q[0][1],Q[2][0],Q[2][1],[[0,'#1c1d22'],[.5,'#3a3c44'],[1,'#0e0f12']]);poly(c,Q);c.fill();
  c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=2;c.beginPath();c.moveTo(Q[0][0],Q[0][1]);c.lineTo(Q[1][0],Q[1][1]);c.stroke();
  const m=P2(cx+ux*(-dp*.55),cz+uz*(-dp*.55));c.save();c.translate(m[0],m[1]);c.rotate(Math.atan2(Q[1][1]-Q[0][1],Q[1][0]-Q[0][0]));tx(c,'BLACK',0,8,{f:'U',w:800,s:26,c:'rgba(220,224,232,.8)'});c.restore();}
// сигарета в пепельнице (из v15)
function ashtray(c,t,ax,ay,s){c.save();c.translate(ax,ay);c.scale(s,s);c.fillStyle='rgba(0,0,0,.5)';c.beginPath();c.ellipse(10,24,190,70,0,0,TAU);c.fill();
  c.fillStyle=LG(c,-180,0,180,0,[[0,'rgba(160,190,200,.18)'],[.5,'rgba(220,240,255,.32)'],[1,'rgba(160,190,200,.12)']]);c.beginPath();c.ellipse(0,0,180,64,0,0,TAU);c.fill();
  c.fillStyle='#0d0a08';c.beginPath();c.ellipse(0,4,120,40,0,0,TAU);c.fill();
  c.rotate(-.5);c.fillStyle='#e9e3d6';c.fillRect(-20,-9,210,18);c.fillStyle='#c98a3a';c.fillRect(150,-9,60,18);c.restore();
  const ex=ax-20*s,ey=ay+12*s;glowDot(c,ex,ey,30*s,'#ff7a2a',.9+.3*Math.sin(t*5));c.fillStyle='#ff9a3a';c.beginPath();c.arc(ex,ey,7*s,0,TAU);c.fill();
  smoke(c,t,ex,ey-6,{n:20,life:5,rise:900,sway:70,drift:-160,r0:10,r1:150,a:.24,seed:41});}
const T1=mkc(WW,HH),T1X=T1.getContext('2d');
function blurPass(c,px,mask){reset(T1X);T1X.clearRect(0,0,WW,HH);T1X.filter=`blur(${px}px)`;T1X.drawImage(c.canvas,0,0);T1X.filter='none';
  if(mask){T1X.globalCompositeOperation='destination-in';T1X.fillStyle=mask(T1X);T1X.fillRect(0,0,WW,HH);T1X.globalCompositeOperation='source-over';}
  c.save();reset(c);c.drawImage(T1,0,0);c.restore();}
function lineShot(c,t,u,o){
  const k=eio(u/1.1),s=1+0.22*k,cx=lp(560,640,k),cy=lp(900,720,k);
  const sh0=cl(.25+u*1.6);c.save();view(c,s,cx,cy);glassBg(c);lineGrains(c,sh0);cardOnGlass(c,1-sh0);ashtray(c,t,930,300,1.0);c.restore();
  blurPass(c,5,x=>{const g=x.createLinearGradient(0,0,0,HH);[[0,1],[.18,1],[.34,0],[.66,0],[.86,.85],[1,.85]].forEach(s0=>g.addColorStop(s0[0],`rgba(0,0,0,${s0[1]})`));return g;});
}

/* ================= 8. КАБИНКА: защёлка (из опенинга dl_open) ================= */
const S1={px:540,py:1000,rx:255,ry:385};
const BRUSH=(()=>{const c=mkc(520,780),x=c.getContext('2d'),r=rng(5);for(let i=0;i<1500;i++){const y=r()*780,x0=r()*560-40,l=40+r()*380,a=0.02+r()*0.08;x.strokeStyle=r()<0.55?`rgba(255,255,255,${a})`:`rgba(0,0,0,${a*0.9})`;x.lineWidth=r()<0.8?1:1.8;x.beginPath();x.moveTo(x0,y);x.lineTo(x0+l,y+(r()-.5)*1.2);x.stroke();}return c;})();
const SCR=(()=>{const r=rng(9),a=[];for(let i=0;i<26;i++)a.push([r()*1500-200,r()*2300-200,r()*60+10,(r()-.5)*0.8,0.04+r()*0.07]);return a;})();
const FINE=(()=>{const c=mkc(540,960),x=c.getContext('2d'),d=x.createImageData(540,960),r=rng(77);for(let i=0;i<540*960;i++){const v=70+115*r();d.data[i*4]=d.data[i*4+1]=d.data[i*4+2]=v;d.data[i*4+3]=255;}x.putImageData(d,0,0);return c;})();
const cap=(c,x,y,w,h)=>rr(c,x,y,w,h,Math.min(w,h)/2);
function s1Door(c){
  c.fillStyle='#8C948E';c.fillRect(-300,-300,WW+600,HH+600);
  c.fillStyle=lg(c,0,0,WW,HH,[[0,'rgba(255,255,255,0.17)'],[0.45,'rgba(255,255,255,0.03)'],[1,'rgba(0,0,0,0.34)']]);c.fillRect(-300,-300,WW+600,HH+600);
  c.save();c.globalAlpha=0.18;c.globalCompositeOperation='overlay';c.drawImage(FINE,-300,-300,WW+600,HH+600);c.restore();
  c.fillStyle=rg(c,400,720,0,520,960,900,[[0,'rgba(255,255,255,0.12)'],[1,'rgba(255,255,255,0)']]);c.fillRect(-300,-300,WW+600,HH+600);
  c.save();c.lineCap='round';for(const s of SCR){c.strokeStyle=`rgba(255,255,255,${s[4]})`;c.lineWidth=1.2;c.beginPath();c.moveTo(s[0],s[1]);c.lineTo(s[0]+Math.cos(s[3])*s[2],s[1]+Math.sin(s[3])*s[2]);c.stroke();}c.restore();
  c.drawImage(cache('doorEdge',600,HH+600,x=>{x.filter='blur(7px)';x.fillStyle=lg(x,0,0,450,0,[[0,'#545B56'],[1,'#69716B']]);x.fillRect(0,0,450,HH+600);x.fillStyle='#141816';x.fillRect(450,0,16,HH+600);x.fillStyle='rgba(255,255,255,0.25)';x.fillRect(466,0,5,HH+600);}),-300,-300);}
function screw(c,x,y,r,a){
  c.save();c.fillStyle='rgba(0,0,0,0.35)';ell(c,x+3,y+4,r+3,r+3);c.fill();c.restore();
  c.save();c.fillStyle=rg(c,x-r*0.35,y-r*0.4,1,x,y,r,[[0,'#F6F9FA'],[0.45,'#AEB6BC'],[1,'#4B5359']]);ell(c,x,y,r,r);c.fill();
  c.strokeStyle='rgba(0,0,0,0.6)';c.lineWidth=1.5;c.stroke();
  c.translate(x,y);c.rotate(a);c.fillStyle='#1A1E21';c.fillRect(-r*0.72,-r*0.12,r*1.44,r*0.24);c.fillRect(-r*0.12,-r*0.72,r*0.24,r*1.44);c.restore();}
function s1Window(c,u,click){
  const wx=S1.px,wy=S1.py-205,ww=240,wh=104;
  c.save();
  rr(c,wx-ww/2-11,wy-wh/2-11,ww+22,wh+22,27);c.fillStyle=lg(c,0,wy-wh/2-11,0,wy+wh/2+11,[[0,'#14181B'],[0.5,'#3A4146'],[1,'#D4DBE0']]);c.fill();
  rr(c,wx-ww/2,wy-wh/2,ww,wh,18);c.save();c.clip();
  const kk=u<click?0:E.outB(clamp((u-click-0.006)/0.07),2.4),off=kk*wh;
  c.fillStyle=lg(c,0,wy-wh/2-off,0,wy+wh/2-off,[[0,'#E6E6DE'],[0.5,'#FBFBF7'],[1,'#D2D2C8']]);c.fillRect(wx-ww/2,wy-wh/2-off,ww,wh);
  tx(c,'VACANT',wx,wy-off+12,{f:'J',w:700,s:34,ls:3,c:'#2e8a4a'});
  c.fillStyle=lg(c,0,wy+wh/2-off,0,wy+wh*1.5-off,[[0,'#CC1A1A'],[0.45,'#A81010'],[1,'#5A0303']]);c.fillRect(wx-ww/2,wy+wh/2-off,ww,wh);
  tx(c,'OCCUPIED',wx,wy+wh-off+12,{f:'J',w:700,s:30,ls:2,c:'#ffe9e2'});
  c.fillStyle='rgba(0,0,0,0.55)';c.fillRect(wx-ww/2,wy+wh/2-off-2,ww,4);
  c.fillStyle=lg(c,0,wy-wh/2,0,wy+wh/2,[[0,'rgba(0,0,0,0.6)'],[0.3,'rgba(0,0,0,0)'],[0.7,'rgba(0,0,0,0)'],[1,'rgba(0,0,0,0.62)']]);c.fillRect(wx-ww/2,wy-wh/2,ww,wh);
  c.globalCompositeOperation='screen';
  c.fillStyle=lg(c,wx-ww/2,wy-wh/2,wx+ww/2,wy+wh/2,[[0,'rgba(255,255,255,0.38)'],[0.33,'rgba(255,255,255,0.07)'],[0.5,'rgba(255,255,255,0)'],[1,'rgba(255,255,255,0.1)']]);c.fillRect(wx-ww/2,wy-wh/2,ww,wh);
  c.restore();
  rr(c,wx-ww/2,wy-wh/2,ww,wh,18);c.strokeStyle='rgba(0,0,0,0.85)';c.lineWidth=3;c.stroke();
  if(kk>0.15){c.globalCompositeOperation='screen';c.fillStyle=rg(c,wx,wy,10,wx,wy,230,[[0,`rgba(220,22,22,${0.28*clamp(kk)})`],[1,'rgba(200,22,22,0)']]);ell(c,wx,wy,240,140);c.fill();}
  c.restore();}
function s1Boss(c){
  const bx=S1.px,by=S1.py+45,br=122;
  c.drawImage(cache('bossSh',360,360,x=>{x.filter='blur(14px)';x.fillStyle='rgba(0,0,0,0.52)';ell(x,180,180,br,br);x.fill();}),bx+14-180,by+20-180);
  c.fillStyle=rg(c,bx-45,by-55,8,bx,by,br,[[0,'#F7FAFB'],[0.3,'#C5CCD1'],[0.72,'#6C757B'],[1,'#2A3034']]);ell(c,bx,by,br,br);c.fill();
  c.save();ell(c,bx,by,br,br);c.clip();for(let i=0;i<28;i++){c.strokeStyle=i%2?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.07)';c.lineWidth=1.2;const q=br*(0.18+0.82*i/28);ell(c,bx,by,q,q);c.stroke();}c.restore();
  c.strokeStyle=lg(c,bx-br,by-br,bx+br,by+br,[[0,'rgba(255,255,255,0.85)'],[0.5,'rgba(255,255,255,0.05)'],[1,'rgba(0,0,0,0.75)']]);c.lineWidth=6;ell(c,bx,by,br-3,br-3);c.stroke();
  c.strokeStyle='rgba(0,0,0,0.8)';c.lineWidth=2;ell(c,bx,by,br,br);c.stroke();}
function s1Handle(c,u,click){
  const bx=S1.px,by=S1.py+45,k=u<click?0:E.outB(clamp((u-click)/0.11),1.9),a=k*Math.PI/2,hw=80,hl=350;
  c.save();c.translate(bx+16,by+24);c.rotate(a);c.fillStyle='rgba(0,0,0,0.32)';cap(c,-hw/2-4,-hl/2-4,hw+8,hl+8);c.fill();c.restore();
  c.save();c.translate(bx,by);c.rotate(a);
  c.fillStyle=lg(c,-hw/2,0,hw/2,0,[[0,'#5A636A'],[0.1,'#DDE4E8'],[0.3,'#FFFFFF'],[0.46,'#C4CBD0'],[0.72,'#757E85'],[1,'#22272B']]);cap(c,-hw/2,-hl/2,hw,hl);c.fill();
  c.fillStyle=lg(c,0,-hl/2,0,hl/2,[[0,'rgba(0,0,0,0.28)'],[0.12,'rgba(0,0,0,0)'],[0.88,'rgba(0,0,0,0)'],[1,'rgba(0,0,0,0.38)']]);cap(c,-hw/2,-hl/2,hw,hl);c.fill();
  c.save();cap(c,-hw/2,-hl/2,hw,hl);c.clip();c.globalAlpha=0.6;c.drawImage(BRUSH,-hw/2,-hl/2,hw,hl);c.restore();
  c.fillStyle=lg(c,-11,0,11,0,[[0,'#020304'],[0.6,'#0D1012'],[1,'#2A3034']]);cap(c,-11,-120,22,240);c.fill();
  c.fillStyle='rgba(255,255,255,0.6)';c.fillRect(9,-110,2.4,220);c.fillStyle='rgba(0,0,0,0.75)';c.fillRect(-13,-112,2,224);
  c.fillStyle='rgba(255,255,255,0.85)';c.fillRect(-hw*0.24,-hl*0.38,3,hl*0.76);
  c.strokeStyle='rgba(0,0,0,0.65)';c.lineWidth=2;cap(c,-hw/2,-hl/2,hw,hl);c.stroke();c.restore();}
function s1Plate(c,u,click,L){
  const {px,py,rx,ry}=S1;
  c.drawImage(cache('plateSh',rx*2+260,ry*2+260,x=>{x.filter='blur(28px)';x.fillStyle='rgba(0,0,0,0.55)';ell(x,rx+130,ry+130,rx,ry);x.fill();x.filter='blur(5px)';x.fillStyle='rgba(0,0,0,0.5)';ell(x,rx+130-21,ry+130-30,rx,ry);x.fill();}),px+26-rx-130,py+38-ry-130);
  c.fillStyle=lg(c,px-rx,py-ry,px+rx,py+ry,[[0,'#3E454A'],[0.16,'#8F989F'],[0.3,'#E8EEF2'],[0.42,'#C9D0D5'],[0.58,'#7E878E'],[0.78,'#454D52'],[1,'#23282C']]);ell(c,px,py,rx,ry);c.fill();
  c.save();ell(c,px,py,rx,ry);c.clip();c.drawImage(BRUSH,px-rx,py-ry,rx*2,ry*2);c.restore();
  c.strokeStyle=lg(c,px-rx,py-ry,px+rx,py+ry,[[0,'rgba(255,255,255,0.9)'],[0.5,'rgba(255,255,255,0.05)'],[1,'rgba(0,0,0,0.8)']]);c.lineWidth=13;ell(c,px,py,rx-7,ry-7);c.stroke();
  c.strokeStyle='rgba(10,12,14,0.9)';c.lineWidth=2.5;ell(c,px,py,rx,ry);c.stroke();
  screw(c,px,py-ry+62,21,0.4);screw(c,px,py+ry-62,21,1.1);
  s1Window(c,u,click);s1Boss(c);s1Handle(c,u,click);
  c.save();ell(c,px,py,rx,ry);c.clip();c.globalCompositeOperation='screen';
  c.translate(px-430+820*(u/L),py);c.rotate(-0.42);c.fillStyle=lg(c,-95,0,95,0,[[0,'rgba(255,255,255,0)'],[0.5,'rgba(255,255,255,0.45)'],[1,'rgba(255,255,255,0)']]);c.fillRect(-95,-760,190,1520);c.restore();}
function stall(c,t,u,o){
  const L=TEND-o.a,click=o.click-o.a,k=u>=click?Math.exp(-(u-click)*34):0,z=1.32*(1+0.12*E.ioS(u/L));
  c.save();c.translate(8*k*Math.sin((u-click)*130),6*k*Math.cos((u-click)*105));view(c,z*(1+0.02*k),540,985-40*(u/L),0.006*k*Math.sin((u-click)*80));
  s1Door(c);s1Plate(c,u,click,L);c.restore();
  // холодный свет: лампа мигает на входе
  const fl=u<.18?(H1(Math.floor(u*40))>.5?.35:0):0;if(fl>0){c.fillStyle=`rgba(0,0,0,${fl})`;c.fillRect(0,0,WW,HH);}
  c.save();c.globalCompositeOperation='soft-light';c.fillStyle='rgba(120,170,220,.35)';c.fillRect(0,0,WW,HH);c.restore();
}

/* ================= монтаж: планы, переходы, HUD, субтитры ================= */
const SH=[];
const TRD={cut:0,blur:.45,punch:.34,flash:.42,whip:.36};
function shotAt(t){let i=0;while(i<SH.length-1&&t>=SH[i+1].a)i++;return i;}
function drawShot(c,s,t){c.save();c.fillStyle='#000';c.fillRect(0,0,WW,HH);s.f(c,t,t-s.a);c.restore();}
const A=mkc(WW,HH),B=mkc(WW,HH);
function composite(c,p,n,k,kind,t){
  const a=A.getContext('2d'),b=B.getContext('2d');reset(a);reset(b);
  if(kind==='blur'){drawShot(a,p,t);drawShot(b,n,t);const b1=24*ss(0,.6,k),b2=24*(1-ss(.4,1,k));
    c.filter=b1>.3?`blur(${b1.toFixed(1)}px)`:'none';c.drawImage(A,0,0);c.globalAlpha=ss(.2,.8,k);c.filter=b2>.3?`blur(${b2.toFixed(1)}px)`:'none';c.drawImage(B,0,0);c.globalAlpha=1;c.filter='none';}
  else if(kind==='punch'){
    if(k<.5){const e=ei(k*2);drawShot(a,p,t);c.save();c.translate(WW/2,HH/2);c.scale(1+.32*e,1+.32*e);c.translate(-WW/2,-HH/2);c.filter=`blur(${(10*e).toFixed(1)}px)`;c.drawImage(A,0,0);c.restore();}
    else{const e=eo((k-.5)*2);drawShot(b,n,t);c.save();c.translate(WW/2,HH/2);c.scale(1.16-.16*e,1.16-.16*e);c.translate(-WW/2,-HH/2);c.filter=`blur(${(8*(1-e)).toFixed(1)}px)`;c.drawImage(B,0,0);c.restore();}
    c.filter='none';c.fillStyle=`rgba(255,255,255,${(.22*Math.max(0,1-Math.abs(k-.5)*5)).toFixed(3)})`;c.fillRect(0,0,WW,HH);}
  else if(kind==='flash'){drawShot(c,k<.5?p:n,t);c.fillStyle=`rgba(255,248,240,${Math.pow(Math.max(0,1-Math.abs(k-.5)*2),1.6).toFixed(3)})`;c.fillRect(0,0,WW,HH);}
  else if(kind==='whip'){const e=eio(k);drawShot(a,p,t);drawShot(b,n,t);c.filter=`blur(${(18*Math.sin(Math.PI*k)).toFixed(1)}px)`;c.drawImage(A,-WW*e,0);c.drawImage(B,WW*(1-e),0);c.filter='none';}
}
function capPlate(c){c.drawImage(cache('capP',WW,620,x=>{x.fillStyle=LG(x,0,0,0,620,[[0,'rgba(0,0,0,0)'],[.55,'rgba(0,0,0,.35)'],[1,'rgba(0,0,0,.6)']]);x.fillRect(0,0,WW,620);}),0,HH-620);}
function topPlate(c){c.drawImage(cache('topP',WW,300,x=>{x.fillStyle=LG(x,0,0,0,300,[[0,'rgba(0,0,0,.62)'],[1,'rgba(0,0,0,0)']]);x.fillRect(0,0,WW,300);}),0,0);}
function vignette(c){c.drawImage(cache('vig',WW,HH,x=>{x.fillStyle=RG(x,WW/2,HH*.47,HH*.26,HH*.82,[[0,'rgba(0,0,0,0)'],[.55,'rgba(0,0,0,.18)'],[1,'rgba(0,0,0,.78)']]);x.fillRect(0,0,WW,HH);}),0,0);}
let CLK=[];
function clockAt(t){let k=CLK[0];for(const q of CLK)if(t>=q[0])k=q;const [h,m,s]=k[1].split(':').map(Number);let S=(h*3600+m*60+s+Math.floor(t-k[0]))%86400;return [Math.floor(S/3600),Math.floor(S/60)%60,S%60].map(v=>String(v).padStart(2,'0')).join(':');}
function hud(c,t){const a=cl((t-V0)/.25);if(a<=0)return;c.save();c.globalAlpha=a;
  c.strokeStyle='rgba(225,238,255,.32)';c.lineWidth=2.5;const m=40,L0=64;
  for(const [x,y,sx,sy] of [[m,m,1,1],[WW-m,m,-1,1],[m,HH-m,1,-1],[WW-m,HH-m,-1,-1]]){c.beginPath();c.moveTo(x,y+sy*L0);c.lineTo(x,y);c.lineTo(x+sx*L0,y);c.stroke();}
  const y=126,bl=.5+.5*Math.sin(t*5.4);c.fillStyle=`rgba(255,50,50,${.45+.55*bl})`;c.beginPath();c.arc(84,y-9,8,0,TAU);c.fill();glowDot(c,84,y-9,30,'#ff3030',.5*bl);
  c.shadowColor='rgba(0,0,0,.9)';c.shadowBlur=8;
  tx(c,'MOSCOW · 2012',106,y,{f:'J',w:500,s:26,ls:4,al:'left',c:'rgba(236,243,255,.95)'});
  tx(c,clockAt(t),WW-84,y+2,{f:'J',w:700,s:32,ls:2,al:'right',c:'rgba(236,243,255,.95)'});
  c.shadowBlur=0;c.fillStyle='rgba(225,238,255,.18)';c.fillRect(84,y+22,WW-168,1.5);
  tx(c,'FILE 01  ·  THE GOOD LIFE',106,y+58,{f:'J',w:500,s:20,ls:4,al:'left',c:'rgba(200,215,235,.6)'});
  c.restore();}
function subs(c,t){const v=t-V0;if(v<-.05)return;let cur=null;
  for(let k=0;k<SUB.length;k++){const [a,b]=SUB[k],ta=WD[a][0],nx=k+1<SUB.length?WD[SUB[k+1][0]][0]:99,tb=nx-WD[b][1]<0.6?nx:WD[b][1]+0.35;if(v>=ta-0.03&&v<tb){cur=[a,b,ta];break;}}
  if(!cur)return;const [a,b,ta]=cur,age=v-ta,pop=1+0.12*Math.max(0,1-age/0.1);
  const words=[];for(let i=a;i<=b;i++)words.push([WD[i][2].replace(/^-/,'').toUpperCase(),ACC.has(i)]);
  c.save();font(c,{f:'U',w:800,s:76,ls:-1});const sp=c.measureText(' ').width;let tot=0;const ws=words.map(w=>{const m=c.measureText(w[0]).width;tot+=m;return m;});tot+=sp*(words.length-1);
  const sc=Math.min(1,920/tot)*pop;c.translate(540,1300);c.scale(sc,sc);let x=-tot/2;
  c.textAlign='left';c.textBaseline='middle';c.shadowColor='rgba(0,0,0,.85)';c.shadowBlur=26;c.shadowOffsetY=4;
  for(let i=0;i<words.length;i++){c.fillStyle=words[i][1]?'#FFB13B':'#FFFFFF';c.fillText(words[i][0],x,0);x+=ws[i]+sp;}
  c.restore();}

function build(){
  const sh=(a,tr,f)=>SH.push({a,tr,f});
  // 1. Москва-Сити: общий план, вход после обрыва — наезд и вспышка (в CLIP.draw)
  HITS.push(V0);
  sh(V0,'cut',(c,t,u)=>{const k=eio(u/1.2);c.save();view(c,lp(1.0,1.05,k),540,lp(985,955,k));city(c,t);c.restore();});
  // 2. Ближе: верхушки башен, «29», выноска «Москва-Сити»
  const s2=wa(2)-.08;
  sh(s2,'punch',(c,t,u)=>{const s=lp(1.62,1.72,eio(u/1.8)),cx=640,cy=lp(640,610,cl(u/1.8));c.save();view(c,s,cx,cy);city(c,t);c.restore();
    big29(c,t,wa(3)-.04,wa(4)-.3);const [fx,fy]=scr(s,cx,cy,592,300);card(c,96,980,'LOCATION','MOSCOW CITY',(t-wa(4)+.12)/.22,{tx:fx,ty:fy,col:C.amber});});
  // 3. Стол: досье, «топ-менеджер» маркером
  sh(wa(5)-.1,'whip',(c,t,u)=>{c.save();view(c,lp(1.36,1.42,eio(u/1.3)),lp(520,500,u/1.3),lp(700,740,u/1.3),.03);desk(c,t,{hl:eio((t-wa(7)+.02)/.5)});c.restore();});
  // 4. Договор: ручка расписывается
  sh(wa(9)-.12,'blur',(c,t,u)=>{const [px,py]=onP(CON,590,1080);c.save();view(c,lp(1.38,1.46,eio(u/1.2)),px,py+lp(40,10,u/1.2),-.02);desk(c,t,{hl:1,sig:(t-wa(12)+.04)/.62,app:(t-wa(9))/.5});c.restore();});
  // 5. График и счётчик: ровно $1,000,000 к концу «-dollar», штамп на «deals»
  HITS.push(wa(15)+.02);
  sh(wa(13)-.12,'punch',(c,t,u)=>chart(c,t,u,{c0:wa(13)-.1,c1:wb(14),st:wa(15)+.02}));
  // 6. Ночь: вход в клуб
  sh(wa(16)-.1,'flash',(c,t,u)=>club(c,t,u));
  // 7. Список гостей: галочка у скрытого имени, чёрная карта
  sh(wa(19)-.1,'whip',(c,t,u)=>guest(c,t,u,{chk:wa(22)-.02,circ:wa(24)-.05,card:wa(24)+.18}));
  // 8. Шампанское
  sh(wa(25)-.12,'punch',(c,t,u)=>champ(c,t,u,{}));
  // 9. Телефон: сообщения от девушек
  sh(wa(26)-.08,'whip',(c,t,u)=>phone(c,t,u,{on:wa(26)-.02}));
  // 10. Дорожка на чёрном стекле
  sh(wa(27)-.1,'blur',(c,t,u)=>lineShot(c,t,u,{}));
  // 11. Кабинка: защёлка → «занято» на «stall»
  const a11=wa(33)-.1;HITS.push(wa(34));
  sh(a11,'cut',(c,t,u)=>stall(c,t,u,{a:a11,click:wa(34)}));
  CLK=[[V0,'07:58:12'],[wa(5)-.1,'09:14:40'],[wa(9)-.12,'11:42:05'],[wa(13)-.12,'14:06:31'],[wa(16)-.1,'23:41:07'],[wa(19)-.1,'23:58:44'],[wa(25)-.12,'01:17:20'],[wa(26)-.08,'02:03:51'],[wa(27)-.1,'03:12:09'],[a11,'03:14:26']];
  window.DLX4={V0,TEND,cuts:SH.slice(1).map(s=>+s.a.toFixed(3)),hits:HITS.slice()};
}

CLIP.init=async()=>{await DC.init();smokeSprites();build();
  // фото на полароиде — тот же ночной Сити
  const big=mkc(WW,HH),bx=big.getContext('2d');city(bx,2.4);THC=mkc(300,300);THC.getContext('2d').drawImage(big,150,140,780,780,0,0,300,300);};
CLIP.draw=(c,t,i)=>{
  if(t<5.0){DC.draw(c,t);grain(c,i,0.05);return;}
  if(t<V0){c.fillStyle='#000';c.fillRect(0,0,WW,HH);return;}
  const k=shotAt(t),s0=SH[k],nx=SH[k+1];let tr=null;
  if(nx&&nx.tr!=='cut'&&t>=nx.a-TRD[nx.tr]/2)tr=[s0,nx,(t-(nx.a-TRD[nx.tr]/2))/TRD[nx.tr],nx.tr];
  else if(k>0&&s0.tr!=='cut'&&t<s0.a+TRD[s0.tr]/2)tr=[SH[k-1],s0,(t-(s0.a-TRD[s0.tr]/2))/TRD[s0.tr],s0.tr];
  const [dx,dy]=shake(t);
  if(t<V0+.3){ // вход после обрыва: кадр летит из глубины, вспышка
    const a=A.getContext('2d');reset(a);drawShot(a,s0,t);const e=eo((t-V0)/.3),s=lp(1.45,1,e),b=lp(16,0,e);
    c.save();c.translate(WW/2+dx,HH/2+dy);c.scale(s,s);c.translate(-WW/2,-HH/2);c.filter=b>.3?`blur(${b.toFixed(1)}px)`:'none';c.drawImage(A,0,0);c.restore();c.filter='none';
  }else{c.save();c.translate(dx,dy);if(tr)composite(c,tr[0],tr[1],cl(tr[2]),tr[3],t);else drawShot(c,s0,t);c.restore();}
  reset(c);
  const fk=cl(1-(t-V0)/.14);if(fk>0){c.fillStyle=`rgba(255,250,240,${.85*fk})`;c.fillRect(0,0,WW,HH);}
  capPlate(c);vignette(c);bloom(c,CV,0.10);topPlate(c);hud(c,t);subs(c,t);grain(c,i,0.06);
};
})();
