"use strict";
/* Пробники по 10 с (25.11): общий набор. Клип — свой файл <clip>.js, задаёт CLIP.init() и CLIP.draw(c,t,i).
   Кадр i рисуется заново с нуля (кадры можно считать в любом порядке и в несколько потоков). */
const W=1080,H=1920,TAU=Math.PI*2,DEG=Math.PI/180,FPS=30,NF=300;
const Q=new URLSearchParams(location.search);
const CV=document.getElementById('c'),X=CV.getContext('2d');
const clamp=(v,a,b)=>Math.max(a===undefined?0:a,Math.min(b===undefined?1:b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const inv=(a,b,v)=>clamp((v-a)/(b-a));
const sstep=t=>{t=clamp(t);return t*t*(3-2*t);};
const E={
  inQ:t=>{t=clamp(t);return t*t;}, outQ:t=>{t=clamp(t);return 1-(1-t)*(1-t);},
  inC:t=>{t=clamp(t);return t*t*t;}, outC:t=>1-Math.pow(1-clamp(t),3),
  ioC:t=>{t=clamp(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;},
  ioS:t=>-(Math.cos(Math.PI*clamp(t))-1)/2,
  inE:t=>{t=clamp(t);return t<=0?0:Math.pow(2,10*t-10);}, outE:t=>{t=clamp(t);return t>=1?1:1-Math.pow(2,-10*t);},
  outB:(t,s)=>{t=clamp(t);if(s===undefined)s=1.70158;const c=s+1;return 1+c*Math.pow(t-1,3)+s*Math.pow(t-1,2);},
  spring:(t,f,d)=>{if(t<=0)return 0;f=f||18;d=d||7;return 1-Math.exp(-d*t)*Math.cos(f*t);}, // t — секунды; с перелётом
};
function rng(seed){let s=((seed*2654435761)>>>0)||1;return function(){s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;return s/4294967296;};}
function sn(t,k){return Math.sin(t*5.3+k*1.91)*0.5+Math.sin(t*11.7+k*4.37)*0.3+Math.sin(t*23.9+k*2.63)*0.2;}
function mk(w,h){const c=document.createElement('canvas');c.width=w||W;c.height=h||H;return c;}
function reset(c){c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.globalCompositeOperation='source-over';c.filter='none';c.shadowBlur=0;c.shadowColor='rgba(0,0,0,0)';c.shadowOffsetX=0;c.shadowOffsetY=0;c.letterSpacing='0px';}
function lg(c,x0,y0,x1,y1,st){const g=c.createLinearGradient(x0,y0,x1,y1);for(const s of st)g.addColorStop(s[0],s[1]);return g;}
function rg(c,x0,y0,r0,x1,y1,r1,st){const g=c.createRadialGradient(x0,y0,r0,x1,y1,r1);for(const s of st)g.addColorStop(s[0],s[1]);return g;}
function rr(c,x,y,w,h,r){r=Math.max(0,Math.min(r,w/2,h/2));c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
function poly(c,p){c.beginPath();c.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)c.lineTo(p[i][0],p[i][1]);c.closePath();}
function ell(c,x,y,rx,ry,a){c.beginPath();c.ellipse(x,y,rx,ry,a||0,0,TAU);}
function loadImg(src){return new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>{console.error('нет картинки '+src);r(null);};i.src=src;});}
const fmt=n=>Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,' ');

/* картинка «на весь кадр»: s — масштаб сверх «cover», (fx,fy) — точка картинки (0..1) в центре кадра, кадр закрыт всегда */
function kb(c,img,s,fx,fy,ox,oy){
  if(!img)return;const iw=img.naturalWidth||img.width,ih=img.naturalHeight||img.height;
  const k=Math.max(W/iw,H/ih)*s,w=iw*k,h=ih*k;
  let x=W/2-fx*w,y=H/2-fy*h;x=Math.min(0,Math.max(W-w,x));y=Math.min(0,Math.max(H-h,y));
  c.drawImage(img,x+(ox||0),y+(oy||0),w,h);
}
/* картинка в прямоугольник (x,y,w,h) с обрезкой «cover» и точкой (fx,fy) */
function kbr(c,img,x,y,w,h,s,fx,fy){
  if(!img)return;const iw=img.naturalWidth||img.width,ih=img.naturalHeight||img.height;
  const k=Math.max(w/iw,h/ih)*s,dw=iw*k,dh=ih*k;let dx=x+w/2-fx*dw,dy=y+h/2-fy*dh;
  dx=Math.min(x,Math.max(x+w-dw,dx));dy=Math.min(y,Math.max(y+h-dh,dy));
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.drawImage(img,dx,dy,dw,dh);c.restore();
}

/* зерно, виньетка, свечение */
const GR=[];
function grainInit(){for(let i=0;i<6;i++){const g=mk(540,960),x=g.getContext('2d'),d=x.createImageData(540,960),r=rng(31+i);for(let j=0;j<d.data.length;j+=4){const v=(r()*255)|0;d.data[j]=d.data[j+1]=d.data[j+2]=v;d.data[j+3]=255;}x.putImageData(d,0,0);GR.push(g);}}
function grain(c,i,a){c.save();reset(c);c.globalCompositeOperation='overlay';c.globalAlpha=a;c.imageSmoothingEnabled=false;c.drawImage(GR[i%GR.length],0,0,W,H);c.restore();}
function vig(c,a,r0){c.save();reset(c);c.fillStyle=rg(c,W/2,H*0.47,H*(r0||0.28),W/2,H*0.47,H*0.78,[[0,'rgba(0,0,0,0)'],[1,`rgba(0,0,0,${a})`]]);c.fillRect(0,0,W,H);c.restore();}
const BL=mk(270,480),BLX=BL.getContext('2d');
function bloom(c,src,a,flt){reset(BLX);BLX.clearRect(0,0,270,480);BLX.filter=flt||'brightness(0.8) contrast(2.6) blur(6px)';BLX.drawImage(src,0,0,270,480);BLX.filter='none';c.save();reset(c);c.globalCompositeOperation='lighter';c.globalAlpha=a;c.drawImage(BL,0,0,W,H);c.restore();}
/* размытая копия кадра (дёшево: через маленький холст) */
const SB=mk(270,480),SBX=SB.getContext('2d');
function blurCopy(c,src,px,flt){reset(SBX);SBX.clearRect(0,0,270,480);SBX.filter=`${flt||''} blur(${px}px)`;SBX.drawImage(src,0,0,270,480);SBX.filter='none';c.drawImage(SB,0,0,W,H);}
let GS=null;function glowSprite(){if(GS)return GS;GS=mk(64,64);const x=GS.getContext('2d');x.fillStyle=rg(x,32,32,0,32,32,32,[[0,'rgba(255,255,255,1)'],[0.18,'rgba(255,255,255,0.55)'],[0.5,'rgba(255,255,255,0.12)'],[1,'rgba(255,255,255,0)']]);x.fillRect(0,0,64,64);return GS;}

/* текст: обводка (sw), тень, разрядка (ls) */
function txt(c,s,x,y,o){o=o||{};c.save();c.font=o.font||'800 80px Man';c.textAlign=o.align||'center';c.textBaseline=o.base||'middle';c.letterSpacing=(o.ls||0)+'px';c.globalAlpha=o.a===undefined?1:o.a;
  if(o.sw){c.lineJoin='round';c.miterLimit=2;c.strokeStyle=o.stroke||'#000';c.lineWidth=o.sw;c.strokeText(s,x,y);}
  if(o.shadow){c.shadowColor=o.shadow;c.shadowBlur=o.sb||16;c.shadowOffsetY=o.sy||0;}
  c.fillStyle=o.fill||'#fff';c.fillText(s,x,y);c.restore();}
function tw(c,s,font,ls){c.save();c.font=font;c.letterSpacing=(ls||0)+'px';const w=c.measureText(s).width;c.restore();return w;}

window.CLIP={fonts:[]};
async function boot(){
  await Promise.all((CLIP.fonts||[]).map(f=>document.fonts.load(f,'АБВабв0123 ₽')));
  grainInit();await CLIP.init();window.READY=true;
}
window.F=function(i){reset(X);X.clearRect(0,0,W,H);CLIP.draw(X,i/FPS,i);reset(X);};
