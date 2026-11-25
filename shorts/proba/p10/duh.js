/* «Духless» · 10 с: карусель (0–3,5) → переход (3,5–4,5) → ночная Москва (4,5–10). Стиль — ?style=noir|cine|ui */
(function(){
const ST=Q.get('style')||'noir';
CLIP.fonts=['600 82px Man','800 100px Man','700 60px Man','bold 60px FreeMono','700 76px JBM','200 250px "Inter Display"','800 120px Inter','700 62px Inter','600 32px Inter'];
const CUT=7.0; // время «старое» (DC.map): 3,5 — начало перехода, 10 — конец
const PAL={
  noir:{sky:['#000','#030303','#0d0d0d'],hz:'rgba(255,255,255,0.08)',far:'#000',bld:'#000',bld2:'#000',win:['#ffffff','#f1f1f1','#dedede'],winP:0.3,band:0.42,edge:'rgba(255,255,255,0.9)',edgeW:1.4,band2:'#ffffff',spire:'#ffffff',river:'#000',refA:0.6,car:['255,255,255','235,235,235']},
  cine:{sky:['#01030a','#05112a','#112a52'],hz:'rgba(80,125,200,0.34)',far:'#081227',bld:'#040a17',bld2:'#0a1733',win:['#ffc46b','#ffb04f','#ffd89a','#ff9e45','#ffe6bd','#ffb45c','#c4d8ff'],winP:0.36,band:0.5,edge:'rgba(140,180,255,0.24)',edgeW:1,band2:'#ffcf86',spire:'#ffcf7d',river:'#020713',refA:0.45,car:['255,214,150','255,90,60'],sheen:1},
};
const P=ST==='noir'?PAL.noir:PAL.cine;

/* ===================== город (мир 1900×1500, земля 1240) ===================== */
const CW=1900,CH=1500,GY=1240,RS=1.5;
const TOW=[
  {k:'stalin',x:250,w:190,h:540},{k:'imp',x:470,w:110,h:500},{k:'cap2',x:690,w:98,h:560},{k:'oko2',x:1345,w:100,h:640},{k:'neva2',x:1565,w:92,h:690},
  {k:'cap',x:588,w:115,h:700},{k:'evo',x:806,w:106,h:620},{k:'fed',x:955,w:150,h:1040},{k:'merc',x:1105,w:122,h:880},{k:'oko',x:1240,w:122,h:950},{k:'neva',x:1456,w:100,h:770}];
const AV=[];let CITY=null,FOGC=null,NOISE=null;
function tpath(c,k,x,w,h){const b=GY;c.beginPath();
  if(k==='fed'){c.moveTo(x-w/2,b);c.lineTo(x-w/2,b-0.64*h);c.quadraticCurveTo(x-w/2,b-0.9*h,x+0.12*w,b-h);c.lineTo(x+w/2,b-0.72*h);c.lineTo(x+w/2,b);}
  else if(k==='merc'){const p=[[-.5,0],[-.5,-.56],[-.42,-.56],[-.42,-.78],[-.31,-.78],[-.31,-.93],[-.14,-1],[.14,-1],[.31,-.93],[.31,-.78],[.42,-.78],[.42,-.56],[.5,-.56],[.5,0]];c.moveTo(x+p[0][0]*w,b);for(const q of p)c.lineTo(x+q[0]*w,b+q[1]*h);}
  else if(k==='oko'||k==='oko2'){c.moveTo(x-w/2,b);c.lineTo(x-w/2,b-h+26);c.lineTo(x+w/2,b-h);c.lineTo(x+w/2,b);}
  else if(k==='imp'){c.moveTo(x-w/2,b);c.lineTo(x-w/2,b-0.84*h);c.quadraticCurveTo(x,b-1.1*h,x+w/2,b-0.84*h);c.lineTo(x+w/2,b);}
  else if(k==='neva'||k==='neva2'){c.moveTo(x-w/2,b);c.lineTo(x-w/2,b-0.9*h);c.lineTo(x+w/2,b-h);c.lineTo(x+w/2,b);}
  else c.rect(x-w/2,b-h,w,h);
  c.closePath();}
function wins(c,r,x0,y0,x1,y1,o){o=o||{};const fh=o.fh||9,cw=o.cw||7,sc=o.sc===undefined?1:o.sc;
  for(let y=y1-fh;y>y0-fh;y-=fh){const on=r()<P.band,pr=(on?0.82:0.05)*sc*(P.winP/0.36),col=P.win[(r()*P.win.length)|0];
    for(let x=x0+1.5;x<x1-1;x+=cw){if(r()<pr){c.globalAlpha=0.5+0.5*r();c.fillStyle=r()<0.88?col:P.win[(r()*P.win.length)|0];c.fillRect(x,y+2,cw-2.4,fh-4);}}}
  c.globalAlpha=1;}
function block(c,r,x,y,w,h,o){c.fillStyle=P.bld;c.fillRect(x,y,w,h+0.6);c.save();c.beginPath();c.rect(x,y,w,h);c.clip();wins(c,r,x,y,x+w,y+h,o);c.restore();c.strokeStyle=P.edge;c.lineWidth=P.edgeW;c.strokeRect(x,y,w,h);}
function tower(c,r,T){const {k,x,w,h}=T;
  if(k==='evo'){const N=58,hs=h/N;for(let j=0;j<N;j++){const ph=j*0.13,ww=w*(0.8+0.2*Math.cos(ph)),off=w*0.17*Math.sin(ph),y=GY-(j+1)*hs;
      c.fillStyle=P.bld;c.fillRect(x+off-ww/2,y,ww,hs+0.6);
      c.globalAlpha=0.3+0.45*(0.5+0.5*Math.sin(ph*1.7));c.fillStyle=P.band2;c.fillRect(x+off-ww/2,y+hs-1.7,ww,1.5);c.globalAlpha=1;
      if(r()<0.5){c.save();c.beginPath();c.rect(x+off-ww/2,y,ww,hs);c.clip();wins(c,r,x+off-ww/2,y,x+off+ww/2,y+hs,{fh:hs,cw:6,sc:0.7});c.restore();}
      c.fillStyle=P.edge;c.fillRect(x+off-ww/2,y,P.edgeW,hs+0.6);c.fillRect(x+off+ww/2-P.edgeW,y,P.edgeW,hs+0.6);}
    AV.push([x+w*0.17*Math.sin((N-1)*0.13),GY-h-2,0.3]);return;}
  if(k==='cap'||k==='cap2'){const N=8,hs=h/N,off=[0,9,-7,12,-9,7,-11,5];for(let j=0;j<N;j++){const ww=w*(1-0.03*j),xx=x+off[j]*(w/115);block(c,r,xx-ww/2,GY-(j+1)*hs,ww,hs);}
    AV.push([x+off[N-1]*(w/115),GY-h-2,k==='cap'?0.6:0.9]);return;}
  if(k==='stalin'){const b=GY,parts=[[x-0.95*w,b-0.26*h,0.55*w,0.26*h],[x+0.4*w,b-0.26*h,0.55*w,0.26*h],[x-0.5*w,b-0.44*h,w,0.44*h],[x-0.32*w,b-0.66*h,0.64*w,0.22*h],[x-0.19*w,b-0.8*h,0.38*w,0.14*h],[x-0.1*w,b-0.88*h,0.2*w,0.08*h]];
    for(const q of parts)block(c,r,q[0],q[1],q[2],q[3],{fh:10,cw:8,sc:0.55});
    c.fillStyle=P.spire;c.beginPath();c.moveTo(x-0.05*w,b-0.88*h);c.lineTo(x,b-h);c.lineTo(x+0.05*w,b-0.88*h);c.closePath();c.fill();ell(c,x,b-h-6,5,5);c.fill();return;}
  tpath(c,k,x,w,h);c.fillStyle=lg(c,x-w/2,0,x+w/2,0,[[0,P.bld],[0.65,P.bld2],[1,P.bld]]);c.fill();
  c.save();tpath(c,k,x,w,h);c.clip();wins(c,r,x-w/2,GY-h*1.12,x+w/2,GY);
  if(P.sheen){c.fillStyle=lg(c,x-w/2,0,x+w/2,0,[[0,'rgba(120,160,255,0)'],[0.72,'rgba(130,170,255,0.09)'],[1,'rgba(120,160,255,0)']]);c.fillRect(x-w/2,GY-h*1.12,w,h*1.12);}
  c.restore();tpath(c,k,x,w,h);c.strokeStyle=P.edge;c.lineWidth=P.edgeW;c.stroke();
  if(k==='fed'){c.strokeStyle=P.edge;c.lineWidth=2.2;c.beginPath();c.moveTo(x+0.12*w,GY-h);c.lineTo(x+0.12*w,GY-h-120);c.stroke();AV.push([x+0.12*w,GY-h-122,0]);}
  else if(k==='merc')AV.push([x,GY-h-3,0.45]);
  else if(k==='oko'||k==='oko2'||k==='neva'||k==='neva2')AV.push([x+w/2-5,GY-h-3,k.length*0.17]);
  else if(k==='imp')AV.push([x,GY-1.03*h,0.8]);
}
function buildCity(){
  const C=mk(CW*RS,CH*RS),c=C.getContext('2d');c.scale(RS,RS);const r=rng(7);
  c.fillStyle=lg(c,0,0,0,GY,[[0,P.sky[0]],[0.55,P.sky[1]],[1,P.sky[2]]]);c.fillRect(0,0,CW,GY);
  c.fillStyle=lg(c,0,GY-460,0,GY,[[0,'rgba(0,0,0,0)'],[1,P.hz]]);c.fillRect(0,GY-460,CW,460);
  let x=-20;while(x<CW){const w=40+r()*120,h=60+r()*170*(0.65+0.35*Math.sin(x*0.004));c.fillStyle=P.far;c.fillRect(x,GY-h,w+1,h);
    c.save();c.beginPath();c.rect(x,GY-h,w,h);c.clip();wins(c,r,x,GY-h,x+w,GY,{fh:8,cw:6,sc:0.4});c.restore();
    if(ST==='noir'){c.strokeStyle='rgba(255,255,255,0.35)';c.lineWidth=1;c.strokeRect(x,GY-h,w,h);}x+=w+(r()<0.25?r()*18:0);}
  if(ST!=='noir'){c.fillStyle=lg(c,0,GY-300,0,GY,[[0,'rgba(40,70,120,0)'],[1,'rgba(40,70,120,0.28)']]);c.fillRect(0,GY-300,CW,300);}
  for(const T of TOW)tower(c,r,T);
  x=-10;while(x<CW){const w=50+r()*110,h=24+r()*90;block(c,r,x,GY-h,w,h,{fh:8,cw:7,sc:0.5});x+=w+r()*6;}
  c.fillStyle=ST==='noir'?'#fff':'#0b1630';c.fillRect(0,GY,CW,3);c.fillStyle=P.river;c.fillRect(0,GY+3,CW,CH-GY-3);
  const RH=(CH-GY-4)*RS,top=(GY+4)*RS,C2=mk(CW*RS,RH),r2=C2.getContext('2d');
  for(let y=0;y<RH;y+=2){const sy=GY*RS-y*1.7-2;if(sy<0)break;const dx=(Math.sin(y*0.11)*2.5+Math.sin(y*0.033)*5)*RS;r2.globalAlpha=Math.max(0,1-y/RH)*P.refA;r2.drawImage(C,0,sy,CW*RS,2,dx,y,CW*RS,2);}
  const c0=C.getContext('2d');c0.setTransform(1,0,0,1,0,0);c0.filter='blur(1.4px)';c0.drawImage(C2,0,top);c0.filter='none';
  c0.globalAlpha=0.5;c0.fillStyle=ST==='noir'?'#000':P.river;for(let y=top;y<CH*RS;y+=7*RS){c0.fillRect(0,y,CW*RS,1.6*RS);}c0.globalAlpha=1;
  return C;}
function buildFog(){const F=mk(2400,420),c=F.getContext('2d'),r=rng(5);
  for(let i=0;i<70;i++){const x=r()*2400,y=150+r()*200,rx=120+r()*320,ry=40+r()*90,a=0.04+r()*0.07;c.fillStyle=rg(c,x,y,0,x,y,rx,[[0,`rgba(170,196,236,${a})`],[1,'rgba(170,196,236,0)']]);c.save();c.translate(x,y);c.scale(1,ry/rx);c.translate(-x,-y);c.fillRect(x-rx,y-rx,rx*2,rx*2);c.restore();}return F;}
function buildNoise(){const w=135,h=240,n=new Float32Array(w*h),r=rng(19);
  for(const [g,a] of [[6,0.5],[12,0.3],[24,0.2]]){const gw=Math.ceil(w/g)+2,gh=Math.ceil(h/g)+2,v=new Float32Array(gw*gh);for(let i=0;i<v.length;i++)v[i]=r();
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){const fx=x/g,fy=y/g,ix=fx|0,iy=fy|0,tx=sstep(fx-ix),ty=sstep(fy-iy),q=(X,Y)=>v[Y*gw+X];
      n[y*w+x]+=a*lerp(lerp(q(ix,iy),q(ix+1,iy),tx),lerp(q(ix,iy+1),q(ix+1,iy+1),tx),ty);}}
  return n;}

/* мир → кадр: точка мира (wx,wy) встаёт в (fx,fy), масштаб s */
function city(c,wx,wy,s,fx,fy){c.drawImage(CITY,fx-wx*s,fy-wy*s,CW*s,CH*s);}
function inWorld(c,wx,wy,s,fx,fy,fn){c.save();c.translate(fx-wx*s,fy-wy*s);c.scale(s,s);fn();c.restore();}
function lights(c,t){ // огни на крышах, машины, туман — в координатах мира
  const G=glowSprite();
  for(const [x,y,ph] of AV){const k=0.5+0.5*Math.sin((t*1.3+ph)*TAU),a=0.35+0.65*k*k;
    c.globalCompositeOperation='lighter';c.globalAlpha=a*0.9;c.drawImage(G,x-18,y-18,36,36);c.globalAlpha=1;c.globalCompositeOperation='source-over';
    c.fillStyle=`rgba(255,${ST==='noir'?40:70},${ST==='noir'?40:60},${0.5+0.5*a})`;ell(c,x,y,2.6,2.6);c.fill();}
  const r=rng(11);c.globalCompositeOperation='lighter';c.lineCap='round';
  for(let i=0;i<34;i++){const lane=i%2,v=(130+r()*150)*(lane?-1:1),L=24+r()*40,x0=r()*2300,x=((x0+v*t)%2300+2300)%2300-200,y=GY-5+lane*3,col=P.car[lane];
    c.strokeStyle=`rgba(${col},0.9)`;c.lineWidth=2.4;c.beginPath();c.moveTo(x,y);c.lineTo(x-Math.sign(v)*L,y);c.stroke();
    c.strokeStyle=`rgba(${col},0.18)`;c.lineWidth=3;c.beginPath();c.moveTo(x,GY+8);c.lineTo(x,GY+70+r()*40);c.stroke();}
  c.globalCompositeOperation='source-over';c.lineCap='butt';
  if(ST!=='noir'){for(const [y,sp,a,sc] of [[960,22,0.75,1],[1050,-14,0.9,1.2],[640,9,0.35,1.4]]){const off=((t*sp)%2400+2400)%2400;c.globalAlpha=a;for(const dx of [-2400,0])c.drawImage(FOGC,dx+off-200,y-210*sc,2400,420*sc);}c.globalAlpha=1;}
}
function rain(c,t,n,seed,o){const r=rng(seed);c.save();c.strokeStyle=o.col||'#fff';c.lineCap='round';
  for(let i=0;i<n;i++){const L=lerp(o.l0,o.l1,r()),v=lerp(o.v0,o.v1,r()),w=lerp(o.w0,o.w1,r()),x0=r()*1500-260,y0=r()*2400,a=o.a*(0.35+0.65*r());
    const y=((y0+v*t)%2400+2400)%2400-240,x=x0+y*0.27;c.globalAlpha=a;c.lineWidth=w;c.beginPath();c.moveTo(x,y);c.lineTo(x-L*0.26,y-L);c.stroke();}
  c.restore();}

/* человек со спины, по плечи (рисуем вокруг точки (0,0) = середина низа) */
function manPath(c){c.beginPath();c.moveTo(-360,40);c.lineTo(-348,-420);c.bezierCurveTo(-338,-520,-252,-575,-150,-600);c.bezierCurveTo(-110,-612,-92,-640,-90,-680);c.lineTo(-93,-722);
  c.bezierCurveTo(-112,-735,-131,-760,-128,-802);c.bezierCurveTo(-141,-882,-121,-962,-40,-990);c.bezierCurveTo(40,-1016,111,-976,116,-900);c.bezierCurveTo(121,-840,96,-770,70,-735);
  c.lineTo(72,-680);c.bezierCurveTo(80,-640,110,-615,170,-600);c.bezierCurveTo(290,-575,382,-540,424,-470);c.lineTo(444,40);c.closePath();}
function man(c,x,y,s,body,rim,rw,line){c.save();c.translate(x,y);c.scale(s,s);manPath(c);c.fillStyle=rim;c.fill();c.save();manPath(c);c.clip();c.translate(rw,rw*0.45);manPath(c);c.fillStyle=body;c.fill();c.restore();
  c.save();manPath(c);c.clip();c.strokeStyle=line;c.lineCap='round';c.lineWidth=4;c.beginPath();c.moveTo(-96,-668);c.quadraticCurveTo(-10,-640,74,-664);c.stroke();
  c.lineWidth=3.2;c.beginPath();c.moveTo(-160,-598);c.quadraticCurveTo(-60,-560,8,-572);c.quadraticCurveTo(90,-560,182,-598);c.stroke();c.beginPath();c.moveTo(8,-572);c.lineTo(14,-300);c.stroke();
  c.lineWidth=3;c.beginPath();c.moveTo(-128,-808);c.quadraticCurveTo(-150,-790,-136,-758);c.stroke();c.restore();c.restore();}

/* ===================== сцены ===================== */
const WIN={y0:170,y1:1452,m:[360,744]};
function shotA(c,t){ // окно пентхауса, он у окна спиной
  const u=inv(4.1,CUT,t),s=0.86*(1+0.035*u),wx=905-30*u,fx=470,fy=890,sh={x:3*sn(t*0.6,1),y:2.4*sn(t*0.6+3,2)};
  c.fillStyle=ST==='noir'?'#000':'#02050c';c.fillRect(0,0,W,H);
  c.save();c.translate(sh.x*0.4,sh.y*0.4);c.beginPath();c.rect(0,WIN.y0,W,WIN.y1-WIN.y0);c.clip();
  city(c,wx,860,s,fx,fy);inWorld(c,wx,860,s,fx,fy,()=>lights(c,t));
  if(ST==='noir')rain(c,t,260,3,{l0:40,l1:110,v0:1400,v1:2300,w0:1,w1:2.2,a:0.55});
  c.restore();
  // пол: отражение окна
  c.save();c.translate(sh.x*0.6,sh.y*0.6);c.beginPath();c.rect(0,WIN.y1,W,H-WIN.y1);c.clip();c.globalAlpha=ST==='noir'?0.17:0.22;c.translate(0,2*WIN.y1);c.scale(1,-1);city(c,wx,860,s,fx,fy);c.restore();
  c.fillStyle=lg(c,0,WIN.y1,0,H,[[0,'rgba(0,0,0,0.15)'],[1,'rgba(0,0,0,0.85)']]);c.fillRect(0,WIN.y1,W,H-WIN.y1);
  // рама
  const fr=ST==='noir'?'#000':'#03060d',hl=ST==='noir'?'rgba(255,255,255,0.75)':'rgba(150,180,240,0.25)';
  c.save();c.translate(sh.x*0.7,sh.y*0.7);c.fillStyle=fr;c.fillRect(-20,0,W+40,WIN.y0);c.fillRect(-20,WIN.y1-6,W+40,26);
  for(const mx of WIN.m){c.fillStyle=fr;c.fillRect(mx-9,WIN.y0,18,WIN.y1-WIN.y0);c.fillStyle=hl;c.fillRect(mx-9,WIN.y0,1.6,WIN.y1-WIN.y0);}
  c.fillStyle=hl;c.fillRect(-20,WIN.y0-2,W+40,1.6);c.fillRect(-20,WIN.y1-6,W+40,1.6);c.restore();
  // он
  const ms=1.0+0.05*E.ioS(u);
  man(c,930+sh.x,1915+sh.y,ms,ST==='noir'?'#000':'#02050b',ST==='noir'?'#ffffff':'rgba(255,176,92,0.85)',ST==='noir'?6:5,ST==='noir'?'rgba(255,255,255,0.55)':'rgba(255,176,92,0.18)');
}
function shotB(c,t){ // вид из окна на Сити
  const u=inv(CUT,10,t),s=1.2*(1+0.06*u),wx=950-40*u,wy=760,fx=540,fy=930,sh={x:3*sn(t*0.6+9,1),y:2.4*sn(t*0.6+5,2)};
  c.fillStyle='#000';c.fillRect(0,0,W,H);
  c.save();c.translate(sh.x,sh.y);city(c,wx,wy,s,fx,fy);inWorld(c,wx,wy,s,fx,fy,()=>lights(c,t));c.restore();
  if(ST==='noir'){rain(c,t,240,8,{l0:30,l1:80,v0:1200,v1:1800,w0:0.8,w1:1.5,a:0.4});rain(c,t,90,9,{l0:120,l1:260,v0:2600,v1:3600,w0:2,w1:3.6,a:0.75});}
}
function titlesNoir(c,t){
  if(t>=4.6&&t<CUT)capBox(c,[[['ТЕБЕ ','#000'],['28.','#000']]],72,300,86,(t-4.72)*22,inv(4.6,4.72,t),-1.2*DEG);
  if(t>=CUT+0.08)capBox(c,[[['ТЫ ДУМАЛ, ЧТО КУПИЛ','#000']],[['ЭТОТ ','#000'],['ГОРОД.','#d40000']]],64,1210,66,(t-CUT-0.2)*22,inv(CUT+0.08,CUT+0.2,t),0.8*DEG);
}
function capBox(c,lines,x,y,fs,shown,a,rot){c.save();c.font=`bold ${fs}px FreeMono`;const lh=fs*1.2,pad=fs*0.42;let wm=0;
  for(const L of lines)wm=Math.max(wm,c.measureText(L.map(s=>s[0]).join('')).width);const bw=wm+pad*2,bh=lines.length*lh+pad*1.1;
  c.translate(x,y);c.rotate(rot);const sc=0.94+0.06*E.outB(a);c.scale(sc,sc);c.globalAlpha=clamp(a*1.4);
  c.fillStyle='#000';c.fillRect(11,11,bw,bh);c.fillStyle='#fff';c.fillRect(0,0,bw,bh);c.lineWidth=5;c.strokeStyle='#000';c.strokeRect(0,0,bw,bh);
  c.textBaseline='alphabetic';c.textAlign='left';let left=Math.floor(shown);
  lines.forEach((L,li)=>{let xx=pad;const yy=pad*0.55+lh*(li+0.8);for(const [s,col] of L){const v=s.slice(0,Math.max(0,left));left-=s.length;c.fillStyle=col;c.fillText(v,xx,yy);xx+=c.measureText(s).width;}});
  c.restore();}
function hud(c,t){const on=(Math.floor(t*2)%2)===0;txt(c,on?'03:14':'03 14',1000,236,{font:'700 76px JBM',align:'right',fill:'#ff2d2d',shadow:'rgba(255,20,20,0.95)',sb:24});}
function titlesCine(c,t){
  if(t>=4.62&&t<CUT){const a=E.outC(inv(4.62,5.25,t))*(1-inv(6.75,CUT,t));txt(c,'ТЕБЕ 28.',540,1330+22*(1-E.outC(inv(4.62,5.25,t))),{font:'800 108px Man',ls:lerp(26,8,E.outC(inv(4.62,5.5,t))),a,shadow:'rgba(0,0,0,0.65)',sb:26});}
  if(t>=CUT+0.1){const L=[['ТЫ','ДУМАЛ,','ЧТО','КУПИЛ'],['ЭТОТ','ГОРОД.']];let k=0;
    L.forEach((ws,li)=>{const font='700 62px Man',sp=tw(c,' ',font,3),full=ws.map(w=>tw(c,w,font,3)).reduce((a,b)=>a+b)+sp*(ws.length-1);let x=540-full/2;
      for(const w of ws){const t0=CUT+0.12+k*0.16,a=E.outC(inv(t0,t0+0.35,t));if(a>0)txt(c,w,x,1290+li*86+14*(1-a),{font,ls:3,align:'left',a,shadow:'rgba(0,0,0,0.7)',sb:22,fill:w==='ГОРОД.'?'#ffd79a':'#fff'});x+=tw(c,w,font,3)+sp;k++;}});}
}

/* ===================== интерфейс (ui) ===================== */
const BEATS=[3.95,4.77,5.59,6.41,7.23,8.1,9.05],AMP=[1,1,1,1,0.85,0.55,0.28];
function ecg(tt){let y=0;for(let k=0;k<BEATS.length;k++){const d=tt-BEATS[k],A=AMP[k];if(d<-0.3||d>0.5)continue;
  const g=(m,w)=>Math.exp(-Math.pow((d-m)/w,2));y+=A*(0.12*g(-0.16,0.025)-0.15*g(-0.03,0.008)+g(0,0.012)-0.25*g(0.03,0.01)+0.25*g(0.22,0.045));}return y;}
function tabNum(c,s,x,y,font,cell){c.save();c.font=font;c.textBaseline='middle';c.textAlign='center';let tot=0;const ws=[...s].map(ch=>/\d/.test(ch)?cell:c.measureText(ch).width);tot=ws.reduce((a,b)=>a+b,0);let xx=x-tot/2;[...s].forEach((ch,i)=>{c.fillStyle='#fff';c.fillText(ch,xx+ws[i]/2,y);xx+=ws[i];});c.restore();}
function uiScene(c,t){
  const u=inv(4.15,10,t),wx=930+30*u,wy=760,s=1.25*(1+0.05*u),ww=W/s,wh=H/s;
  c.fillStyle='#000';c.fillRect(0,0,W,H);reset(SBX);SBX.clearRect(0,0,270,480);SBX.filter='blur(4px) brightness(0.85) saturate(0.45)';
  SBX.drawImage(CITY,(wx-ww/2)*RS,(wy-wh/2)*RS,ww*RS,wh*RS,0,0,270,480);SBX.filter='none';c.drawImage(SB,0,0,W,H);
  c.fillStyle=lg(c,0,0,0,H,[[0,'rgba(0,0,0,0.6)'],[0.3,'rgba(0,0,0,0.25)'],[0.7,'rgba(0,0,0,0.3)'],[1,'rgba(0,0,0,0.75)']]);c.fillRect(0,0,W,H);
  const A=(a,b)=>E.outC(inv(a,b,t)),Y=(a,b)=>18*(1-E.outC(inv(a,b,t)));
  txt(c,'ПЯТНИЦА',540,232+Y(4.4,4.9),{font:'600 32px Inter',ls:8,a:0.7*A(4.4,4.9)});
  txt(c,'03:14',540,390+Y(4.45,5),{font:'200 250px "Inter Display"',ls:-6,a:A(4.45,5)});
  txt(c,'ТЕБЕ 28.',540,662+Y(4.75,5.2),{font:'800 120px Inter',a:A(4.75,5.2)});
  const ba=A(5,5.35);if(ba>0){txt(c,'БАЛАНС',540,872,{font:'600 32px Inter',ls:8,a:0.65*ba});c.save();c.globalAlpha=ba;
    const v=4200000*E.outE(inv(5.05,6.6,t));tabNum(c,'+'+fmt(v)+' ₽',540,968,'700 100px Inter',61);c.restore();
    const k=E.ioS(inv(5.05,6.6,t));c.save();c.strokeStyle='rgba(255,255,255,0.8)';c.lineWidth=3;c.lineJoin='round';c.beginPath();
    for(let i=0;i<=60*k;i++){const x=160+760*i/60,y=1092-60*Math.pow(i/60,1.6)-8*Math.sin(i*0.9)*(1-i/60);i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();c.restore();}
  if(t>=CUT+0.1){const L=[['ТЫ','ДУМАЛ,','ЧТО','КУПИЛ'],['ЭТОТ','ГОРОД.']];let k=0;
    L.forEach((ws,li)=>{const font='700 62px Inter',sp=tw(c,' ',font),full=ws.map(w=>tw(c,w,font)).reduce((a,b)=>a+b)+sp*(ws.length-1);let x=540-full/2;
      for(const w of ws){const t0=CUT+0.12+k*0.15,a=E.outC(inv(t0,t0+0.3,t));if(a>0)txt(c,w,x,1236+li*82+12*(1-a),{font,align:'left',a});x+=tw(c,w,font)+sp;k++;}});}
  const pa=A(4.6,5.1);if(pa>0){c.save();c.globalAlpha=pa;txt(c,'ПУЛЬС',150,1452,{font:'600 30px Inter',ls:6,align:'left',a:0.65});
    const bpm=t<7.4?73:t<9.3?Math.round(lerp(73,28,inv(7.4,9.2,t))):0;txt(c,String(bpm),930,1452,{font:'700 44px Inter',align:'right'});
    const x0=150,x1=930,win=2.2,base=1556;c.strokeStyle='#fff';c.lineWidth=3.2;c.lineJoin='round';c.beginPath();
    for(let x=x0;x<=x1;x+=3){const tt=t-(x1-x)/(x1-x0)*win,y=base-ecg(tt)*92;x===x0?c.moveTo(x,y):c.lineTo(x,y);}
    const fade=c.createLinearGradient(x0,0,x1,0);fade.addColorStop(0,'rgba(255,255,255,0)');fade.addColorStop(0.35,'rgba(255,255,255,0.9)');fade.addColorStop(1,'#fff');c.strokeStyle=fade;c.stroke();
    const hy=base-ecg(t)*92;c.fillStyle='#fff';c.shadowColor='#fff';c.shadowBlur=18;ell(c,x1,hy,7,7);c.fill();c.restore();}
}
function shadowDissolve(c,u){ // тень наползает от краёв по шуму
  const w=135,h=240,id=SBX.createImageData(w,h),d=id.data;if(!window.SDT){window.SDT=mk(w,h);window.SDB=mk(270,480);}
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const ex=Math.abs(x/w-0.5)*2,ey=Math.abs(y/h-0.45)*1.6,edge=clamp(Math.max(ex,ey)),f=0.58*NOISE[y*w+x]+0.42*(1-edge),a=clamp((u*1.35-f)/0.22);const j=(y*w+x)*4;d[j]=d[j+1]=d[j+2]=0;d[j+3]=a*255;}
  SDT.getContext('2d').putImageData(id,0,0);const bx=SDB.getContext('2d');reset(bx);bx.clearRect(0,0,270,480);bx.filter='blur(3px)';bx.drawImage(SDT,0,0,270,480);bx.filter='none';c.save();c.imageSmoothingQuality='high';c.drawImage(SDB,0,0,W,H);c.restore();}

/* ===================== кадр ===================== */
const LAYER=mk(),LX=LAYER.getContext('2d');
CLIP.init=async function(){await DC.init();CITY=buildCity();FOGC=buildFog();NOISE=buildNoise();};
CLIP.draw=function(c,t,i){
  if(t<DC.T0){DC.draw(c,t);grain(c,i,0.035);return;}const tt=t;t=DC.map(t);
  if(ST==='ui'){
    if(t<4.15){const g=E.ioS(inv(3.5,3.85,t));DC.video(c,0,tt,{flt:`grayscale(${g}) brightness(${1-0.4*g})`,capA:1-inv(3.5,3.7,t)});DC.dots(c,2,1-inv(3.5,3.65,t));shadowDissolve(c,inv(3.62,4.15,t));grain(c,i,0.04);return;}
    uiScene(c,t);const fi=1-E.outQ(inv(4.15,4.62,t));if(fi>0){c.fillStyle=`rgba(0,0,0,${fi})`;c.fillRect(0,0,W,H);}grain(c,i,0.05);vig(c,0.35);return;}
  const col=ST==='noir'?'255,255,255':'255,234,200';
  if(t<4.1){ // наезд в лампу на фото 2, свет заливает кадр
    const u=inv(3.5,4.1,t),z=Math.exp(Math.log(10)*E.inC(u)),L=DC.zpt(),Pp=[lerp(L[0],540,E.ioS(u)),lerp(L[1],900,E.ioS(u))];
    c.save();c.translate(Pp[0],Pp[1]);c.scale(z,z);c.translate(-L[0],-L[1]);DC.video(c,0,tt,{flt:ST==='noir'?`grayscale(${E.ioS(inv(3.55,3.95,t))}) contrast(${1+0.4*inv(3.55,3.95,t)})`:'',capA:1-inv(3.5,3.68,t)});c.restore();DC.dots(c,2,1-inv(3.5,3.65,t));
    const g=inv(3.6,4.1,t),R=60+1800*E.inQ(g);c.fillStyle=rg(c,Pp[0],Pp[1],0,Pp[0],Pp[1],R,[[0,`rgba(${col},${E.inQ(g)})`],[0.4,`rgba(${col},${0.8*E.inQ(g)})`],[1,`rgba(${col},0)`]]);c.fillRect(0,0,W,H);
    c.fillStyle=`rgba(${col},${E.inC(g)})`;c.fillRect(0,0,W,H);grain(c,i,0.05);return;}
  reset(LX);LX.clearRect(0,0,W,H);
  const v=inv(4.1,4.8,t),zb=1+1.25*(1-E.outC(v)),Qp=[455,800];
  LX.save();LX.translate(Qp[0],Qp[1]);LX.scale(zb,zb);LX.translate(-Qp[0],-Qp[1]);if(t<CUT)shotA(LX,t);else shotB(LX,t);LX.restore();
  c.drawImage(LAYER,0,0);
  if(ST==='cine'){bloom(c,LAYER,0.55,'brightness(0.85) contrast(2.4) blur(7px)');c.fillStyle='rgba(10,30,70,0.12)';c.globalCompositeOperation='screen';c.fillRect(0,0,W,H);c.globalCompositeOperation='source-over';}
  else bloom(c,LAYER,0.25,'brightness(0.9) contrast(3) blur(5px)');
  const ga=1-E.outQ(inv(4.1,4.68,t));if(ga>0){const R=lerp(1900,90,E.outQ(inv(4.1,4.68,t)));c.fillStyle=rg(c,Qp[0],Qp[1],0,Qp[0],Qp[1],R,[[0,`rgba(${col},${ga})`],[0.45,`rgba(${col},${0.85*ga})`],[1,`rgba(${col},0)`]]);c.fillRect(0,0,W,H);c.fillStyle=`rgba(${col},${ga*ga*ga})`;c.fillRect(0,0,W,H);}
  if(ST==='noir'){titlesNoir(c,t);if(t>=4.4)hud(c,t);grain(c,i,0.15);vig(c,0.62);}
  else{titlesCine(c,t);grain(c,i,0.11);vig(c,0.5);}
};
})();
