/* «Духless» EN · вариант Gemini (26.11): 6 сцен, ~48 с, без голоса — текст на экране по черновому таймингу.
   Сквозной приём — смена стиля на каждом повороте (референс emollick-019567): металл → досье → ар-деко → неон → монохром → золото и сталь.
   1 фейк-карусель трескается и рассыпается, слова собирают экран (Gdgtify, Texture-Swatch Kinetic) ·
   2 спутник на ночную Москву → доска с делом, подпись пером (satellite-briefing, briefing-board, halftone-dossier) ·
   3 ар-деко: доход, счётчик, часы выходят из рамки (art-deco, dataviz, pankajkumar_dev) ·
   4 клуб: канат, фары, неон, силуэты, таймер 03:00 → 05:59 (neon-tubes, silhouette-rhythm, countdown, signalz_jp) ·
   5 06:00: монохром, узкая полоса, царапины, график в ноль, красная тушь (scratch-film, ascii-glitch, KamStudioLabs) ·
   6 SOULLESS разрезается лучом на SOUL / LESS, петля в начало (spy-titles, art-deco).
   Факты — по субтитрам фильма: Макс, 29, банк «Мегаполис» (русско-французский), доход — пять нулей в евро, уволен, клуба нет, друзья не берут трубку.
   Спутник — Sentinel-2 cloudless 2016, EOX (CC BY 4.0), подпись в кадре. Рук и лиц нет.
   Рендер: N=1440 P10A=<папка с sat/ и mv/> node render.mjs dlx6g - out.mp4 */
(function(){'use strict';
CLIP.fonts=['900 150px Mont','800 90px Mont','700 110px Osw','600 40px JBM','800 54px JBM','700 120px Play','italic 700 96px Play','700 60px Man','800 200px Mont'];
const TEND=48.0;
const T={crack:4.05,shat:4.42,s1:4.66,s2:8.8,brd:12.1,s3:16.0,s4:23.0,club:25.9,s5:31.0,s6:39.4,loop:47.35};
const IMP=[540,820];
let SAT={},MV0=null,CEN=null;

/* ---------- фактуры ---------- */
function goldTex(){return cache('gold',512,512,(g,w,h)=>{g.fillStyle=LG(g,0,0,0,h,[[0,'#6b4a12'],[.18,'#f7e08a'],[.34,'#b8862b'],[.5,'#fff3b8'],[.66,'#a9761f'],[.82,'#f1cf6c'],[1,'#5e3f0e']]);g.fillRect(0,0,w,h);
  const r=rng(5);for(let i=0;i<900;i++){g.fillStyle=`rgba(${r()<.5?'255,250,220':'60,35,5'},${(r()*.09).toFixed(3)})`;g.fillRect(0,r()*h,w,r()*1.6);}});}
function steelTex(){return cache('steel',512,512,(g,w,h)=>{g.fillStyle=LG(g,0,0,0,h,[[0,'#3a4350'],[.25,'#c9d3df'],[.45,'#6f7a88'],[.6,'#eef3f8'],[.8,'#59636f'],[1,'#a9b4c1']]);g.fillRect(0,0,w,h);
  const r=rng(9);for(let i=0;i<1100;i++){g.fillStyle=`rgba(${r()<.5?'255,255,255':'10,14,20'},${(r()*.1).toFixed(3)})`;g.fillRect(0,r()*h,w,r()*1.4);}});}
function paperTex(){return cache('paper',512,512,(g,w,h)=>{g.fillStyle='#e9e1cf';g.fillRect(0,0,w,h);const d=g.getImageData(0,0,w,h),r=rng(3);
  for(let i=0;i<d.data.length;i+=4){const v=(fbm((i/4%w)/40,Math.floor(i/4/w)/40,3)-.5)*26+(r()-.5)*14;d.data[i]+=v;d.data[i+1]+=v;d.data[i+2]+=v*.9;}g.putImageData(d,0,0);});}
function feltTex(){return cache('felt',540,540,(g,w,h)=>{const d=g.createImageData(w,h),r=rng(11);
  for(let i=0;i<d.data.length;i+=4){const x=i/4%w,y=Math.floor(i/4/w),v=22+fbm(x/30,y/30,4)*22+(r()-.5)*10;d.data[i]=v*.92;d.data[i+1]=v*.95;d.data[i+2]=v*1.08;d.data[i+3]=255;}g.putImageData(d,0,0);});}
const pat=(c,cv)=>c.createPattern(cv,'repeat');

/* ---------- текст: слова собирают кадр ---------- */
function wrap(c,words,o,maxW){const L=[[]];let w=0;const sp=tm(c,' ',o);
  for(const wd of words){const ww=tm(c,wd,o);if(L[L.length-1].length&&w+sp+ww>maxW){L.push([]);w=0;}L[L.length-1].push([wd,ww]);w+=(L[L.length-1].length>1?sp:0)+ww;}return {L,sp};}
const norm=s=>s.toLowerCase().replace(/[^a-z0-9€']/g,'');
function line(c,t,item,st,yc,dim){const [t0,str,acc]=item,o={f:st.f,w:st.w,s:st.s*(dim?.6:1),it:st.it,ls:st.ls||0};
  const words=str.split(' '),A=new Set((acc||'').split(' ').map(norm).filter(Boolean));
  const {L,sp}=wrap(c,words,o,st.maxW||860),lh=o.s*(st.lh||1.08),H0=L.length*lh;let j=0;const y0=yc-H0/2+lh*.78;
  L.forEach((ln,li)=>{const W0=ln.reduce((a,b)=>a+b[1],0)+sp*(ln.length-1);let x=(st.cx||520)-W0/2;
    for(const [wd,ww] of ln){const tw=t0+j*(st.stag??.075),k=dim?1:cl((t-tw)/.16);j++;if(k<=0){x+=ww+sp;continue;}
      const e=eo(k),sc=1+(st.pop??.32)*(1-e),y=y0+li*lh,ac=A.has(norm(wd));
      c.save();const ga=c.globalAlpha;c.translate(x+ww/2,y-o.s*.3);c.scale(sc,sc);c.translate(-(x+ww/2),-(y-o.s*.3));c.globalAlpha=ga*e*(dim?.42:1);
      if(ac&&st.mark&&!dim){const mk2=cl((t-tw-.12)/.28);c.fillStyle=st.mark;c.globalAlpha=ga*e*.85;c.beginPath();
        c.moveTo(x-8,y+o.s*.12);c.lineTo(x-8+(ww+16)*eo(mk2),y+o.s*.08);c.lineTo(x-8+(ww+16)*eo(mk2),y+o.s*.2);c.lineTo(x-8,y+o.s*.24);c.fill();c.globalAlpha=ga*e;}
      font(c,o);c.textAlign='left';c.textBaseline='alphabetic';
      if(st.shadow){c.shadowColor=st.shadow;c.shadowBlur=st.sb||22;}
      c.fillStyle=ac?(st.accFill?st.accFill(c):st.acc):(st.fill?st.fill(c):st.col);c.fillText(wd,x,y);c.restore();x+=ww+sp;}});
  return H0;}
function caps(c,t,list,st){let k=-1;for(let i=0;i<list.length;i++)if(t>=list[i][0])k=i;if(k<0)return;
  const H0=line(c,t,list[k],st,st.y,false);
  if(k>0&&st.prev!==false){const p=list[k-1],a=1-cl((t-list[k][0]-1.4)/.4);if(a>0){c.save();c.globalAlpha=a;line(c,t,p,st,st.y-H0/2-st.s*.62,true);c.restore();}}}

/* ---------- 1. карусель трескается ---------- */
let CR=null;
function crackGeo(){if(CR)return CR;const r=rng(77),R=[],N=11;
  for(let i=0;i<N;i++){const a0=i/N*TAU+(r()-.5)*.35,pts=[[0,0]];let rad=0,a=a0;while(rad<1500){rad+=60+r()*120;a+=(r()-.5)*.22;pts.push([Math.cos(a)*rad,Math.sin(a)*rad]);}R.push(pts);}
  const rings=[140,330,620].map(rr=>R.map(p=>{let q=p[0];for(const v of p)if(Math.hypot(v[0],v[1])<=rr)q=v;return q;}));
  const SHD=[];for(let i=0;i<N;i++){const j=(i+1)%N,rs=[0,140,330,620,1600];
    for(let k=0;k<rs.length-1;k++){const ring=(rad)=>[R[i],R[j]].map(p=>{let q=p[p.length-1];for(const v of p)if(Math.hypot(v[0],v[1])>=rad){q=v;break;}return q;});
      const a=ring(rs[k]),b=ring(rs[k+1]),poly=[a[0],b[0],b[1],a[1]],cx=poly.reduce((s,p)=>s+p[0],0)/4,cy=poly.reduce((s,p)=>s+p[1],0)/4;
      SHD.push({poly,cx,cy,vx:cx*(1.2+r()*1.4),vy:cy*(1.2+r()*1.4)-300*r(),rot:(r()-.5)*2.6,d:r()*.08});}}
  CR={R,rings,SHD};return CR;}
let F0=null;
function frozen(){if(F0)return F0;F0=mkc(WW,HH);const g=F0.getContext('2d');DC.draw(g,T.crack);return F0;}
function crack(c,t){const g=crackGeo(),k=eo(cl((t-T.crack)/.26));c.drawImage(frozen(),0,0);
  c.save();c.translate(IMP[0],IMP[1]);c.lineCap='round';c.lineJoin='round';
  for(const p of g.R){const n=Math.max(1,Math.floor(p.length*k));c.beginPath();c.moveTo(p[0][0],p[0][1]);for(let i=1;i<n;i++)c.lineTo(p[i][0],p[i][1]);
    c.strokeStyle='rgba(0,0,0,.55)';c.lineWidth=7;c.stroke();c.strokeStyle='rgba(255,255,255,.9)';c.lineWidth=2.4;c.stroke();}
  if(k>.5)for(const ring of g.rings){c.beginPath();ring.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.closePath();c.strokeStyle=`rgba(255,255,255,${(.7*(k-.5)*2).toFixed(2)})`;c.lineWidth=1.6;c.stroke();}
  c.fillStyle=RG(c,0,0,0,90,[[0,'rgba(255,255,255,.9)'],[1,'rgba(255,255,255,0)']]);c.globalAlpha=k;c.fillRect(-90,-90,180,180);c.restore();}
function shatter(c,t){const g=crackGeo(),u=t-T.shat;for(const s of g.SHD){const v=Math.max(0,u-s.d);if(v>1.1)continue;
  c.save();c.globalAlpha=cl(1-v/1.1);c.translate(IMP[0]+s.cx+s.vx*v*.9,IMP[1]+s.cy+s.vy*v*.9+900*v*v);c.rotate(s.rot*v);c.translate(-s.cx,-s.cy);
  c.beginPath();s.poly.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.clip();c.drawImage(frozen(),-IMP[0],-IMP[1]);
  c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=2;c.stroke();c.restore();}}

function darkPaper(c,tint){c.fillStyle='#08080a';c.fillRect(0,0,WW,HH);c.save();c.globalAlpha=.09;c.fillStyle=pat(c,paperTex());c.fillRect(0,0,WW,HH);c.restore();
  if(tint){c.fillStyle=RG(c,WW/2,HH*.42,0,HH*.7,[[0,tint],[1,'rgba(0,0,0,0)']]);c.fillRect(0,0,WW,HH);}}
function typo1(c,t,u){darkPaper(c,'rgba(120,130,150,.10)');
  const met=g=>pat(g,steelTex()),gld=g=>pat(g,goldTex());
  if(t<6.25){const S={f:'T',w:900,s:150,col:'#fff',fill:met,acc:'#f3d27a',accFill:gld,y:880,pop:.5,stag:.16,lh:1.02,maxW:900,cx:540,prev:false};
    caps(c,t,[[4.72,'YOU THINK THIS IS YOUR LIFE?','life?']],S);}
  else if(t<7.2){const k=cl((t-6.25)/.95),z=1+.9*ei(cl((k-.55)/.45));c.save();c.translate(540,900);c.scale(z,z);c.translate(-540,-900);
    caps(c,t,[[6.3,'LOOK CLOSER.','closer.']],{f:'T',w:900,s:190,col:'#fff',fill:met,acc:'#f3d27a',accFill:gld,y:900,pop:.6,stag:.2,cx:540,prev:false});c.restore();}
  else if(t<8.0){const k=cl((t-7.2)/.3);tx(c,'MOSCOW · 2012',540,900,{f:'O',w:700,s:118,ls:14,c:'#f0ece4',a:eo(k)});
    c.fillStyle=rgba('#f3d27a',.85*eo(k));c.fillRect(540-380*eo(k),940,760*eo(k),3);c.fillRect(540-380*eo(k),790,760*eo(k),3);
    tx(c,'55.7495° N · 37.5370° E',540,1010,{f:'J',w:500,s:30,ls:4,c:'#9aa3b0',a:cl((t-7.45)/.3)});}
  else{caps(c,t,[[8.02,"YOU'RE THE MAIN CHARACTER.",'main character.']],{f:'T',w:900,s:128,col:'#fff',fill:met,acc:'#f3d27a',accFill:gld,mark:'rgba(214,32,40,.9)',y:900,pop:.45,stag:.11,cx:540,maxW:940,prev:false});}
  vignette(c,.7);}

/* ---------- 2. спутник → доска ---------- */
function satView(c,Z){c.fillStyle='#03050a';c.fillRect(0,0,WW,HH);const P=[540,860];
  for(const L of [11,13,15]){const k=Math.pow(2,Z-L)*1.5,im=SAT[L],ce=CEN[L];if(!im)continue;
    let a=1;if(L===13)a=ss(12.05,12.75,Z);if(L===15)a=ss(14.05,14.75,Z);if(a<=0)continue;
    c.save();c.globalAlpha=a;c.imageSmoothingQuality='high';c.drawImage(im,P[0]-ce[0]*k,P[1]-ce[1]*k,1280*k,1280*k);c.restore();}}
const ZT=t=>lp(11.2,15.35,eio(cl((t-T.s2)/3.25)));
function satHud(c,t,Z){const a=Math.min(cl((t-T.s2-.2)/.4),1-cl((t-T.brd+.35)/.3));if(a<=0)return;c.save();c.globalAlpha=a;
  c.strokeStyle='rgba(150,220,255,.10)';c.lineWidth=1;for(let x=60;x<WW;x+=120){c.beginPath();c.moveTo(x,0);c.lineTo(x,HH);c.stroke();}for(let y=40;y<HH;y+=120){c.beginPath();c.moveTo(0,y);c.lineTo(WW,y);c.stroke();}
  const R=lp(260,120,cl((Z-11)/4.4));c.strokeStyle='rgba(255,214,120,.9)';c.lineWidth=2.5;const P=[540,860];
  for(const [sx,sy] of [[-1,-1],[1,-1],[1,1],[-1,1]]){c.beginPath();c.moveTo(P[0]+sx*R,P[1]+sy*(R-34));c.lineTo(P[0]+sx*R,P[1]+sy*R);c.lineTo(P[0]+sx*(R-34),P[1]+sy*R);c.stroke();}
  c.beginPath();c.moveTo(P[0]-18,P[1]);c.lineTo(P[0]+18,P[1]);c.moveTo(P[0],P[1]-18);c.lineTo(P[0],P[1]+18);c.stroke();
  const alt=400/Math.pow(2,Z-11);const L=[['ORBITAL VIEW','#ffd678'],['55.7495° N','#d8e6f0'],['37.5370° E','#d8e6f0'],[`ALT ${alt.toFixed(1)} KM`,'#d8e6f0'],[Z>14.3?'TARGET: MOSCOW-CITY':'SCANNING…','#ffd678']];
  L.forEach(([s,col],i)=>tx(c,s,70,300+i*46,{f:'J',w:i?500:700,s:32,ls:3,al:'left',c:col}));
  tx(c,'Sentinel-2 cloudless 2016 by EOX · CC BY 4.0',540,1555,{f:'J',w:400,s:19,c:'rgba(220,230,240,.55)'});c.restore();}
function halftone(key,src,sw,sh,cell,ink){return cache(key,sw,sh,(g,w,h)=>{const t=mkc(w/cell|0,h/cell|0),tg=t.getContext('2d');tg.drawImage(src,0,0,t.width,t.height);
  const d=tg.getImageData(0,0,t.width,t.height).data;g.fillStyle='#e9e1cf';g.fillRect(0,0,w,h);g.fillStyle=ink;
  for(let y=0;y<t.height;y++)for(let x=0;x<t.width;x++){const i=(y*t.width+x)*4,L=(d[i]*.3+d[i+1]*.59+d[i+2]*.11)/255,r=cell*.62*Math.sqrt(1-L);if(r>.4){g.beginPath();g.arc(x*cell+cell/2,y*cell+cell/2,r,0,TAU);g.fill();}}});}
function satCrop(){return cache('satcrop',640,800,(g)=>{const im=SAT.d||SAT[15],ce=CEN[15];g.drawImage(im,ce[0]-320,ce[1]-400,640,800,0,0,640,800);});}
function card(c,x,y,w,h,rot,fn,pin){c.save();c.translate(x,y);c.rotate(rot);c.fillStyle='rgba(0,0,0,.45)';c.filter='blur(10px)';c.fillRect(-w/2+14,-h/2+20,w,h);c.filter='none';
  c.fillStyle=pat(c,paperTex());c.fillRect(-w/2,-h/2,w,h);fn(c,w,h);if(pin){c.fillStyle=RG(c,-2,-h/2+18,0,14,[[0,'#ff8a8a'],[.6,'#c81e2a'],[1,'#5c0a10']]);c.beginPath();c.arc(0,-h/2+18,12,0,TAU);c.fill();}c.restore();}
function pen(c,x,y,ang){c.save();c.translate(x,y);c.rotate(ang);c.fillStyle='rgba(0,0,0,.35)';c.filter='blur(6px)';c.fillRect(10,18,420,26);c.filter='none';
  c.fillStyle=LG(c,0,-14,0,14,[[0,'#2b2b33'],[.45,'#70707c'],[1,'#121217']]);RR(c,40,-13,380,26,13);c.fill();
  c.fillStyle=LG(c,0,-10,0,10,[[0,'#8d6a24'],[.5,'#f2d684'],[1,'#7a5818']]);c.fillRect(150,-13,22,26);c.fillRect(380,-13,12,26);
  c.fillStyle='#16161a';c.beginPath();c.moveTo(40,-11);c.lineTo(0,0);c.lineTo(40,11);c.closePath();c.fill();c.fillStyle='#d7b766';c.beginPath();c.moveTo(14,-4);c.lineTo(0,0);c.lineTo(14,4);c.fill();c.restore();}
const SIG=(()=>{const P=[];for(let i=0;i<=120;i++){const u=i/120,x=-150+300*u,y=Math.sin(u*TAU*2.6)*26*Math.sin(u*Math.PI)+(u<.18?-40*Math.sin(u/.18*Math.PI):0)+Math.sin(u*TAU*7)*6;P.push([x,y]);}return P;})();
function pinAt(x,y,h,r){const ly=-h/2+18;return [x-ly*Math.sin(r),y+ly*Math.cos(r)];}
function pinHead(c,p){c.fillStyle='rgba(0,0,0,.4)';c.beginPath();c.arc(p[0]+4,p[1]+6,13,0,TAU);c.fill();c.fillStyle=RG(c,p[0]-3,p[1]-3,0,14,[[0,'#ff9a9a'],[.55,'#c81e2a'],[1,'#5c0a10']]);c.beginPath();c.arc(p[0],p[1],12,0,TAU);c.fill();}
function mvCrop(){return cache('mvcrop',480,576,g=>g.drawImage(MV0,48,0,480,576,0,0,480,576));}
let SATF=null;
function board(c,t,u){if(!SATF){SATF=mkc(WW,HH);satView(SATF.getContext('2d'),ZT(T.brd));}
  c.fillStyle=pat(c,feltTex());c.fillRect(0,0,WW,HH);c.fillStyle=RG(c,540,800,100,1300,[[0,'rgba(255,220,170,.10)'],[1,'rgba(0,0,0,.6)']]);c.fillRect(0,0,WW,HH);
  const sh=eio(cl((t-T.brd)/.85)),cam=1+.05*eio(cl((t-T.brd-.9)/5));c.save();c.translate(540,960);c.scale(cam,cam);c.translate(-540,-960);
  const C1=[300,500,470,580,-.05],C2=[805,840,380,470,.06],C3=[560,1150,560,430,-.02];
  if(MV0&&sh>.2)card(c,C2[0],C2[1],C2[2],C2[3],C2[4],(g,w,h)=>{g.globalAlpha=cl((sh-.2)*2);g.drawImage(halftone('htmv',mvCrop(),480,576,6,'#1b1d24'),-w/2+14,-h/2+14,w-28,h-64);tx(g,'NIGHT · 03:12',0,h/2-18,{f:'J',w:600,s:18,ls:2,c:'#2a2a30'});g.globalAlpha=1;});
  if(sh>.35)card(c,C3[0],C3[1],C3[2],C3[3],C3[4],(g,w,h)=>{g.globalAlpha=cl((sh-.35)*2.5);
    tx(g,'CASE FILE 29/12',-w/2+34,-h/2+62,{f:'J',w:800,s:30,ls:2,al:'left',c:'#1c1c22'});g.fillStyle='#1c1c22';g.fillRect(-w/2+34,-h/2+78,w-68,2);
    [['SUBJECT','MAX'],['AGE','29'],['JOB','TOP MANAGER'],['BANK','MEGAPOLIS RU/FR'],['CITY','MOSCOW 2012']].forEach(([a,b],i)=>{tx(g,a,-w/2+34,-h/2+128+i*50,{f:'J',w:500,s:22,ls:2,al:'left',c:'#6a645a'});tx(g,b,-w/2+214,-h/2+128+i*50,{f:'J',w:800,s:28,al:'left',c:'#16161c'});});
    const ul=cl((t-14.35)/.35);if(ul>0){g.strokeStyle='rgba(200,30,40,.9)';g.lineWidth=4;g.lineCap='round';g.beginPath();g.moveTo(-w/2+210,-h/2+186);g.lineTo(-w/2+210+48*eo(ul),-h/2+188);g.stroke();}
    g.save();g.translate(150,-h/2+120);g.rotate(-.18);g.globalAlpha*=.8;g.strokeStyle='#c81e2a';g.lineWidth=4;RR(g,-110,-30,220,60,6);g.stroke();tx(g,'CONFIDENTIAL',0,10,{f:'J',w:800,s:24,ls:2,c:'#c81e2a'});g.restore();
    const sg=cl((t-13.3)/.9);if(sg>0){const n=Math.max(2,Math.floor(SIG.length*eo(sg)));g.save();g.translate(90,h/2-70);g.strokeStyle='#14204a';g.lineWidth=4;g.lineCap='round';g.lineJoin='round';g.beginPath();for(let i=0;i<n;i++)i?g.lineTo(SIG[i][0]*.7,SIG[i][1]*.7):g.moveTo(SIG[i][0]*.7,SIG[i][1]*.7);g.stroke();
      const pk=t-13.3;if(pk<1.25){const q=SIG[n-1],off=eo(cl((pk-.95)/.3));pen(g,q[0]*.7+off*260,q[1]*.7-off*170,-.55+.05*Math.sin(t*9));}g.restore();}
    g.globalAlpha=1;});
  card(c,lp(540,C1[0],sh),lp(960,C1[1],sh),lp(WW,C1[2],sh),lp(HH,C1[3],sh),lp(0,C1[4],sh),(g,w,h)=>{if(sh<.97)g.drawImage(SATF,-w/2,-h/2,w,h);
    g.globalAlpha=sh;g.drawImage(halftone('htsat',satCrop(),640,800,7,'#1b1d24'),-w/2+14,-h/2+14,w-28,h-64);
    tx(g,'MOSCOW-CITY · 2012',0,h/2-18,{f:'J',w:600,s:20,ls:2,c:'#2a2a30'});g.globalAlpha=1;});
  if(sh>.95){const P=[pinAt(...C1.slice(0,2),C1[3],C1[4]),pinAt(C2[0],C2[1],C2[3],C2[4]),pinAt(C3[0],C3[1],C3[3],C3[4])],sa=cl((t-T.brd-.9)/.7);
    c.strokeStyle='rgba(200,30,40,.9)';c.lineWidth=3.5;c.lineCap='round';
    [[0,1],[1,2],[0,2]].forEach(([a,b],i)=>{const q=eo(cl(sa*1.8-i*.35));if(q<=0)return;const A=P[a],B=P[b],mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2+40;c.beginPath();c.moveTo(A[0],A[1]);
      for(let j=1;j<=20;j++){const v=j/20*q,x=(1-v)*(1-v)*A[0]+2*(1-v)*v*mx+v*v*B[0],y=(1-v)*(1-v)*A[1]+2*(1-v)*v*my+v*v*B[1];c.lineTo(x,y);}c.stroke();});
    P.forEach(p=>pinHead(c,p));}
  c.restore();
  const fx=eo(cl((t-T.brd-.3)/.9));objPass(c,lp(1240,890,fx),1720,-.22,t);objKeys(c,lp(-200,160,fx),1770,.3);}
function objPass(c,x,y,rot,t){c.save();c.translate(x,y);c.rotate(rot);c.fillStyle='rgba(0,0,0,.5)';c.filter='blur(14px)';RR(c,-150,-90,330,220,22);c.fill();c.filter='none';
  c.strokeStyle='#1d3557';c.lineWidth=14;c.beginPath();c.moveTo(-40,-120);c.bezierCurveTo(-60,-300,120,-320,100,-560);c.stroke();
  c.fillStyle=LG(c,-160,-110,160,110,[[0,'#f4f6f8'],[1,'#c9d0d8']]);RR(c,-160,-105,320,210,20);c.fill();c.fillStyle='#14213d';RR(c,-160,-105,320,56,[20,20,0,0]);c.fill();
  tx(c,'MEGAPOLIS',0,-66,{f:'O',w:700,s:30,ls:6,c:'#f3d27a'});c.fillStyle='#b9c2cc';RR(c,-130,-30,96,112,8);c.fill();c.fillStyle='#8a939e';c.beginPath();c.arc(-82,8,22,0,TAU);c.fill();RR(c,-112,40,60,40,10);c.fill();
  tx(c,'TOP MANAGER',30,0,{f:'J',w:800,s:20,al:'left',c:'#14213d'});tx(c,'CREDIT DEPT.',30,30,{f:'J',w:500,s:18,al:'left',c:'#4a5560'});c.fillStyle='#c9a54a';RR(c,30,52,70,32,6);c.fill();
  c.fillStyle='rgba(255,255,255,.35)';c.beginPath();c.moveTo(-160,-105);c.lineTo(-40,-105);c.lineTo(-160,60);c.fill();c.restore();}
function objKeys(c,x,y,rot){c.save();c.translate(x,y);c.rotate(rot);c.fillStyle='rgba(0,0,0,.5)';c.filter='blur(12px)';c.beginPath();c.ellipse(20,30,150,60,0,0,TAU);c.fill();c.filter='none';
  c.strokeStyle=LG(c,-40,-40,40,40,[[0,'#f2f2f2'],[1,'#7d7d84']]);c.lineWidth=9;c.beginPath();c.arc(0,0,44,0,TAU);c.stroke();
  c.fillStyle=LG(c,0,-30,0,30,[[0,'#2a2a30'],[.5,'#55555f'],[1,'#141418']]);RR(c,30,-36,150,72,30);c.fill();c.fillStyle='rgba(255,255,255,.18)';RR(c,40,-30,120,22,11);c.fill();
  c.fillStyle='#9aa0a8';c.save();c.rotate(-.9);RR(c,30,-10,170,20,4);c.fill();for(let i=0;i<6;i++)c.fillRect(120+i*12,10,8,8+(i%2)*6);c.restore();c.restore();}
function sat2(c,t,u){if(t<T.brd){const Z=ZT(t);satView(c,Z);satHud(c,t,Z);}else board(c,t,u);
  caps(c,t,[[9.3,"You're 29.",'29.'],[10.5,'Top manager at a Russian-French bank.','bank.'],[12.95,'Moscow 2012 is yours on paper —','paper'],[14.55,'and dead inside.','dead inside.']],
    {f:'J',w:800,s:66,col:'#f4efe4',acc:'#ff4b55',y:t<T.brd?1330:1545,shadow:'rgba(0,0,0,.9)',sb:18,maxW:880,stag:.05,pop:.18});
  vignette(c,.62);}

/* ---------- 3. ар-деко ---------- */
function deco(c,t,u){c.fillStyle='#050404';c.fillRect(0,0,WW,HH);
  c.save();c.translate(540,2150);const rot=t*.02;for(let i=0;i<64;i++){const a=-Math.PI+i/64*Math.PI+rot%(Math.PI/64);c.strokeStyle=`rgba(243,210,122,${(.10+.08*Math.sin(i*1.7+t*2)).toFixed(3)})`;c.lineWidth=2;c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(a)*2600,Math.sin(a)*2600);c.stroke();}c.restore();
  const fa=eo(cl((t-T.s3)/.6)),F=[150,330,930,1190];// рамка
  c.save();c.globalAlpha=fa;c.strokeStyle=pat(c,goldTex());for(const [d,lw] of [[0,6],[18,2],[30,2]]){const x0=F[0]+d,y0=F[1]+d,x1=F[2]-d,y1=F[3]-d,s=46;c.lineWidth=lw;c.beginPath();
    c.moveTo(x0+s,y0);c.lineTo(x1-s,y0);c.lineTo(x1-s,y0+s*.4);c.lineTo(x1,y0+s*.4);c.lineTo(x1,y1-s*.4);c.lineTo(x1-s,y1-s*.4);c.lineTo(x1-s,y1);c.lineTo(x0+s,y1);c.lineTo(x0+s,y1-s*.4);c.lineTo(x0,y1-s*.4);c.lineTo(x0,y0+s*.4);c.lineTo(x0+s,y0+s*.4);c.closePath();c.stroke();}
  c.fillStyle=pat(c,goldTex());for(let i=0;i<5;i++){const w=60-i*10;c.fillRect(540-w,F[1]-14-i*9,w*2,4);}c.restore();
  // счётчик
  const ck=cl((t-16.55)/1.3);tx(c,'ANNUAL INCOME',540,F[1]+96,{f:'O',w:700,s:30,ls:10,c:'#c9a54a',a:fa});
  const val=Math.round(100000*eo5(ck)),s=('€ '+fmt(val)).padStart(9,' ');c.save();c.globalAlpha=fa;tx(c,s,540,F[1]+210,{f:'P',w:700,s:110,c:'#f3d27a',glow:'rgba(243,190,80,.45)',gb:24});c.restore();
  // график
  const gk=cl((t-16.4)/1.4),X0=F[0]+70,X1=F[2]-70,Y0=F[3]-80,Y1=F[1]+300;c.save();c.globalAlpha=fa;c.strokeStyle='rgba(243,210,122,.35)';c.lineWidth=1.5;for(let i=0;i<5;i++){const y=lp(Y0,Y1,i/4);c.beginPath();c.moveTo(X0,y);c.lineTo(X1,y);c.stroke();}
  const pts=[];for(let i=0;i<=40;i++){const v=i/40,h=(.08+.92*Math.pow(v,1.7)+.04*Math.sin(v*23))*spr(cl(gk*1.4-v*.4));pts.push([lp(X0,X1,v),lp(Y0,Y1,cl(h))]);}
  c.beginPath();c.moveTo(X0,Y0);for(const p of pts)c.lineTo(p[0],p[1]);c.lineTo(X1,Y0);c.closePath();c.fillStyle=LG(c,0,Y1,0,Y0,[[0,'rgba(243,210,122,.45)'],[1,'rgba(243,210,122,0)']]);c.fill();
  c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.strokeStyle='#ffe7a0';c.lineWidth=5;c.shadowColor='rgba(255,210,120,.8)';c.shadowBlur=16;c.stroke();c.restore();
  // часы выходят из рамки
  const wk=cl((t-18.3)/1.6),we=eio(wk),out=t>19.15;if(wk>0){const sc=lp(.5,1.2,we),x=lp(640,520,we),y=lp(860,900,we);
    c.save();if(!out){c.beginPath();c.rect(F[0]+30,F[1]+30,F[2]-F[0]-60,F[3]-F[1]-60);c.clip();}
    if(out){c.fillStyle='rgba(0,0,0,.55)';c.filter='blur(30px)';c.beginPath();c.ellipse(x+60,y+120,230*sc,120*sc,0,0,TAU);c.fill();c.filter='none';}
    watch(c,x,y,sc,t);c.restore();
    const tg=cl((t-19.9)/1.2);if(tg>0)tag(c,x+190*sc,y-60*sc,t,tg);}
  caps(c,t,[[16.55,'Five zeros a year.','five zeros'],[18.15,'In euros.','euros.'],[19.95,'Every problem','problem'],[20.95,'has a price tag.','price tag.']],
    {f:'P',w:700,it:true,s:92,col:'#f4ead2',acc:'#f3d27a',accFill:g=>pat(g,goldTex()),y:1420,shadow:'rgba(0,0,0,.9)',maxW:900,stag:.09,pop:.25});
  vignette(c,.55);}
function watch(c,x,y,s,t){c.save();c.translate(x,y);c.scale(s,s);c.rotate(-.12);
  c.fillStyle=LG(c,-60,-330,60,330,[[0,'#1a1a1a'],[.5,'#3a3a3a'],[1,'#121212']]);RR(c,-74,-215,148,430,40);c.fill();
  c.fillStyle='rgba(255,255,255,.06)';for(let i=0;i<9;i++)c.fillRect(-74,-200+i*48,148,3);
  c.fillStyle=LG(c,-150,-150,150,150,[[0,'#fff1b3'],[.35,'#c89a32'],[.6,'#f7dc86'],[1,'#7a5518']]);c.beginPath();c.arc(0,0,158,0,TAU);c.fill();
  c.fillStyle='#0b0b0d';c.beginPath();c.arc(0,0,128,0,TAU);c.fill();
  for(let i=0;i<12;i++){const a=i/12*TAU;c.save();c.rotate(a);c.fillStyle='#f0d27a';c.fillRect(-4,-118,8,i%3?18:30);c.restore();}
  const h=(t*.4)%TAU,m=(t*2.2)%TAU;c.strokeStyle='#f3dd95';c.lineCap='round';c.lineWidth=8;c.beginPath();c.moveTo(0,0);c.lineTo(Math.sin(h)*60,-Math.cos(h)*60);c.stroke();c.lineWidth=5;c.beginPath();c.moveTo(0,0);c.lineTo(Math.sin(m)*96,-Math.cos(m)*96);c.stroke();
  c.fillStyle='#f3dd95';c.beginPath();c.arc(0,0,9,0,TAU);c.fill();c.fillStyle='rgba(255,255,255,.16)';c.beginPath();c.ellipse(-40,-50,90,40,-.6,0,TAU);c.fill();
  c.fillStyle='#d8b65a';RR(c,150,-18,30,36,6);c.fill();c.restore();}
function tag(c,x,y,t,k){const sw=Math.sin(t*3.1)*.22*(1-k*.4)+.1;c.save();c.translate(x,y);c.rotate(sw);c.globalAlpha=eo(k);
  c.strokeStyle='#d8c9a8';c.lineWidth=3;c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(10,60,0,120);c.stroke();c.translate(0,120);
  c.fillStyle='rgba(0,0,0,.4)';c.filter='blur(8px)';c.fillRect(-60,10,140,220);c.filter='none';c.fillStyle=pat(c,paperTex());c.beginPath();c.moveTo(-70,30);c.lineTo(0,-10);c.lineTo(70,30);c.lineTo(70,230);c.lineTo(-70,230);c.closePath();c.fill();
  c.fillStyle='#0d0d10';c.beginPath();c.arc(0,16,10,0,TAU);c.fill();tx(c,'PRICE',0,96,{f:'O',w:700,s:34,ls:6,c:'#1a1a1e'});c.fillStyle='#c81e2a';c.fillRect(-46,118,92,4);tx(c,'€',0,190,{f:'P',w:700,s:64,c:'#1a1a1e'});c.restore();}

/* ---------- 4. клуб ---------- */
const BEAT=60/105.47,KST=8.8;  // «Кашалот» (speed up) ≈ 105,5 BPM, дроп (21,03 с трека) стоит на 8,8 с ролика
const beatAfter=t=>KST+Math.ceil((t-KST)/BEAT)*BEAT;
function neonLine(c,pts,col,w=6,a=1){c.save();c.globalAlpha=a;c.lineCap='round';c.lineJoin='round';c.strokeStyle=col;c.shadowColor=col;c.shadowBlur=26;c.lineWidth=w;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();c.shadowBlur=0;c.strokeStyle='rgba(255,255,255,.85)';c.lineWidth=w*.35;c.stroke();c.restore();}
function club(c,t,u,inside){c.fillStyle=LG(c,0,0,0,HH,[[0,'#04030a'],[.6,'#0b0718'],[1,'#020204']]);c.fillRect(0,0,WW,HH);
  const z=inside?1:lp(1,1.5,ei(cl((t-T.s4-1.6)/1.3)));
  c.save();c.translate(540,980);c.scale(z,z);c.translate(-540,-980);
  if(!inside){// город неоном на горизонте
    for(let i=0;i<22;i++){const x=i*52-20,h=180+((i*37)%5)*70;c.fillStyle='#07060e';c.fillRect(x,760-h,48,h+400);
      if(i%3===0)neonLine(c,[[x+4,760-h+20],[x+44,760-h+20]],i%2?'#ff3e9a':'#2fe6ff',3,.7);}
    neonLine(c,[[0,770],[1080,770]],'#2fe6ff',3,.55);
    // дверь с тёплым светом
    c.fillStyle=RG(c,540,900,20,520,[[0,'rgba(255,190,120,.85)'],[.5,'rgba(255,120,60,.25)'],[1,'rgba(0,0,0,0)']]);c.fillRect(0,400,WW,1000);
    c.fillStyle='#ffd9a0';c.fillRect(440,700,200,420);c.fillStyle='#08070c';c.fillRect(420,680,20,460);c.fillRect(640,680,20,460);c.fillRect(420,660,240,26);
    neonLine(c,[[470,612],[610,612]],'#ff3e9a',7);tx(c,'VIP',540,598,{f:'O',w:700,s:46,ls:12,c:'#ffd0ea',glow:'#ff3e9a',gb:24});
    // фары
    const hk=cl((t-T.s4)/1.6);if(hk>0&&hk<1){const a=Math.sin(hk*Math.PI);for(const s of [-1,1]){c.save();c.globalCompositeOperation='screen';c.translate(lp(-300,700,hk)+s*90,1700);c.rotate(-.65+hk*.5);
      c.fillStyle=LG(c,0,0,0,-1400,[[0,`rgba(255,250,230,${(.55*a).toFixed(2)})`],[1,'rgba(255,250,230,0)']]);c.beginPath();c.moveTo(-20,0);c.lineTo(-260,-1400);c.lineTo(260,-1400);c.lineTo(20,0);c.fill();c.restore();}}
    // столбики и канат
    for(const x of [300,780]){c.fillStyle=LG(c,x-18,0,x+18,0,[[0,'#3a2a10'],[.5,'#f2d684'],[1,'#3a2a10']]);RR(c,x-16,1080,32,300,8);c.fill();c.beginPath();c.arc(x,1072,26,0,TAU);c.fill();c.fillStyle='#120c04';RR(c,x-46,1376,92,20,6);c.fill();}
    const op=ss(T.s4+1.4,T.s4+1.9,t),sag=lp(110,260,op);c.strokeStyle='#7a0f1c';c.lineWidth=22;c.lineCap='round';c.beginPath();c.moveTo(300,1100);c.quadraticCurveTo(540-op*160,1100+sag,lp(780,560,op),lp(1100,1330,op));c.stroke();
    c.strokeStyle='rgba(255,120,140,.25)';c.lineWidth=6;c.stroke();}
  else{// внутри: силуэты в ритм, лазеры
    const b=(((t-KST)/BEAT)%1+1)%1,pulse=Math.pow(1-b,3);
    for(let i=0;i<7;i++){const a=-.9+i*.3+Math.sin(t*1.3+i)*.08;neonLine(c,[[540,-80],[540+Math.sin(a)*2400,-80+Math.cos(a)*2400]],i%2?'#ff3e9a':'#2fe6ff',3,.25+.35*pulse);}
    c.fillStyle=RG(c,540,900,0,900,[[0,`rgba(255,62,154,${(.18+.25*pulse).toFixed(2)})`],[1,'rgba(0,0,0,0)']]);c.fillRect(0,0,WW,HH);
    const L=[];for(let i=0;i<9;i++){const bb=Math.abs(Math.sin((t-KST)/BEAT*Math.PI+i*1.3))*24;L.push([i*130-10,1360-bb-(i%2)*40,1.05+(i%3)*.12,i%2?1:-1]);}
    crowd(c,L,'#050307','#ff3e9a');
    // предметы ночи на долю
    flyers(c,t);}
  c.restore();
  // таймер
  const tk=cl((t-T.s4)/(T.s5-T.s4-.2)),mins=Math.floor(eio(tk)*179),hh=3+Math.floor(mins/60),mm=mins%60;
  c.save();c.globalAlpha=cl((t-T.s4-.2)/.3);RR(c,370,290,340,96,14);c.fillStyle='rgba(8,12,20,.65)';c.fill();c.strokeStyle='rgba(140,220,255,.5)';c.lineWidth=2;c.stroke();
  tx(c,`0${hh}:${String(mm).padStart(2,'0')}`,520,364,{f:'J',w:800,s:64,ls:4,c:'#d8f3ff',glow:'rgba(120,220,255,.8)',gb:16});tx(c,'AM',650,360,{f:'J',w:600,s:24,c:'#8fd8ff'});c.restore();
  caps(c,t,[[23.45,'03:00 AM.','03:00'],[24.45,"Face control doesn't even look at you —",'look'],[26.15,'they already know your name.','name.'],[27.55,'Champagne. VIP.','vip.'],[28.75,'Everybody wants your table.','table.'],[30.0,'Nobody knows you.','nobody']],
    {f:'O',w:700,s:84,ls:2,col:'#ffffff',acc:'#2fe6ff',y:1440,shadow:'rgba(255,62,154,.55)',sb:24,maxW:900,stag:.06,pop:.3});
  vignette(c,.6);}
function flyers(c,t){const t0=beatAfter(T.club+.1);for(let n=0;n<10;n++){const ta=t0+n*BEAT*2,v=(t-ta)/.75;if(v<0||v>1)continue;const kind=n%3,dir=n%2?1:-1;
  for(let g=4;g>=0;g--){const vv=cl(v-g*.025),x=lp(540-dir*760,540+dir*760,vv),y=lp(1050+n%3*90,820-n%2*120,vv)+Math.sin(vv*Math.PI)*-120;
    c.save();c.globalAlpha=g?.12:1;c.translate(x,y);c.scale(1.6,1.6);c.rotate((vv-.5)*dir*1.4);
    if(kind===0){c.fillStyle=pat(c,paperTex());c.fillRect(-60,-150,120,300);['TABLE 4 · VIP','MOËT ×6','VODKA ×2','€ 4 800'].forEach((s,i)=>tx(c,s,0,-100+i*58,{f:'J',w:700,s:16,c:'#222'}));}
    else if(kind===1){c.strokeStyle='#2fe6ff';c.shadowColor='#2fe6ff';c.shadowBlur=20;c.lineWidth=26;c.beginPath();c.ellipse(0,0,110,46,0,0,TAU);c.stroke();c.shadowBlur=0;tx(c,'VIP',0,12,{f:'O',w:700,s:30,ls:6,c:'#eaffff'});}
    else{c.strokeStyle='rgba(255,255,255,.85)';c.lineWidth=5;c.beginPath();c.moveTo(-40,-120);c.lineTo(-34,40);c.quadraticCurveTo(0,70,34,40);c.lineTo(40,-120);c.stroke();c.beginPath();c.moveTo(0,64);c.lineTo(0,150);c.moveTo(-40,150);c.lineTo(40,150);c.stroke();
      c.fillStyle='rgba(243,210,122,.55)';c.beginPath();c.moveTo(-37,-40);c.lineTo(-34,40);c.quadraticCurveTo(0,70,34,40);c.lineTo(37,-40);c.fill();}
    c.restore();}}}

/* ---------- 5. 06:00 ---------- */
function crashScene(c,t,u){c.fillStyle='#000';c.fillRect(0,0,WW,HH);const B0=560,B1=1300,jit=Math.sin(t*37)*2;c.save();c.beginPath();c.rect(0,B0,WW,B1-B0);c.clip();c.translate(jit,0);
  c.fillStyle='#16171a';c.fillRect(0,B0,WW,B1-B0);c.globalAlpha=.08;c.fillStyle=pat(c,paperTex());c.fillRect(0,B0,WW,B1-B0);c.globalAlpha=1;
  // график в ноль
  const X0=90,X1=990,Y0=B1-90,Y1=B0+110,ck=cl((t-31.75)/.5);c.strokeStyle='rgba(220,220,220,.18)';c.lineWidth=1.5;for(let i=0;i<4;i++){const y=lp(Y0,Y1,i/3);c.beginPath();c.moveTo(X0,y);c.lineTo(X1,y);c.stroke();}
  const pts=[];for(let i=0;i<=40;i++){const v=i/40;let h=.08+.92*Math.pow(v,1.7)+.04*Math.sin(v*23);if(v>.8)h=lp(h,0,eo(cl(ck*1.2-(v-.8)*2)));pts.push([lp(X0,X1,v),lp(Y0,Y1,cl(h))]);}
  const ga=1-cl((t-33.4)/.4);c.globalAlpha=ga;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.strokeStyle='#d9d9d9';c.lineWidth=5;c.stroke();
  if(ck>.6){c.fillStyle='#e0282f';c.beginPath();c.arc(X1,Y0,10,0,TAU);c.fill();tx(c,'0',X1-30,Y0-24,{f:'J',w:800,s:44,c:'#e0282f'});}c.globalAlpha=1;
  // список успеха и тушь
  const lk=cl((t-33.5)/.3);if(lk>0&&t<35.7){c.globalAlpha=eo(lk)*(1-cl((t-35.4)/.3));['ZARA','VIP','MONEY'].forEach((s,i)=>{const y=B0+200+i*170;tx(c,s,540,y,{f:'J',w:800,s:120,ls:12,c:'#ececec'});
      for(const [d,sg] of [[0,1],[.12,-1]]){const q=cl((t-34.25-i*.22-d)/.22);if(q<=0)continue;c.save();c.strokeStyle='rgba(205,24,32,.92)';c.lineWidth=26;c.lineCap='round';c.beginPath();
        const ax=200,bx=880,ay=y-42-22*sg,by=y-42+22*sg;c.moveTo(ax,ay);for(let j=1;j<=12;j++){const v=j/12*eo(q);c.lineTo(lp(ax,bx,v),lp(ay,by,v)+Math.sin(j*2.1+i)*5);}c.stroke();c.restore();}});c.globalAlpha=1;}
  // телефон: звонки
  if(t>=35.7){const pk=eo(cl((t-35.7)/.35));phoneCalls(c,540,B0+(B1-B0)/2+lp(500,0,pk),t);}
  // царапины и пыль
  const r=rng(Math.floor(t*24));for(let i=0;i<3;i++){c.fillStyle=`rgba(255,255,255,${(.08+r()*.12).toFixed(2)})`;c.fillRect(r()*WW,B0,1+r()*2,B1-B0);}
  for(let i=0;i<14;i++){c.fillStyle=`rgba(${r()<.5?'255,255,255':'0,0,0'},${(.2+r()*.4).toFixed(2)})`;c.beginPath();c.arc(r()*WW,B0+r()*(B1-B0),1+r()*3,0,TAU);c.fill();}
  c.restore();
  tx(c,'06:00',960,B0-30,{f:'J',w:800,s:40,ls:4,al:'right',c:'#bdbdbd'});
  caps(c,t,[[31.45,'06:00 AM.','06:00'],[32.55,'Fired.','fired.'],[33.7,'The club was a scam.','scam.'],[35.8,'You call everyone.','everyone.'],[37.35,'Not one picks up.','not one']],
    {f:'J',w:800,s:68,col:'#e8e8e8',acc:'#ff3b42',y:1460,maxW:900,stag:.05,pop:.12});}
function phoneCalls(c,x,y,t){c.save();c.translate(x,y);c.fillStyle='rgba(0,0,0,.6)';c.filter='blur(16px)';RR(c,-150,-300,320,620,50);c.fill();c.filter='none';
  c.fillStyle=LG(c,-160,0,160,0,[[0,'#1e1f23'],[.5,'#3a3b40'],[1,'#151518']]);RR(c,-160,-320,320,640,52);c.fill();c.fillStyle='#050506';RR(c,-146,-306,292,612,42);c.fill();
  const calls=[[35.95,'VADIM','VOICEMAIL'],[37.35,'JULIA','DECLINED']];let cur=null;for(const q of calls)if(t>=q[0])cur=q;
  if(cur){const st=t-cur[0],end=st>.95;tx(c,end?cur[2]:'CALLING…',0,-150,{f:'J',w:600,s:24,ls:4,c:end?'#ff4b55':'#9aa0a8'});tx(c,cur[1],0,-90,{f:'T',w:800,s:46,c:'#f2f2f2'});
    c.fillStyle='#2a2b30';c.beginPath();c.arc(0,30,70,0,TAU);c.fill();tx(c,cur[1][0],0,52,{f:'T',w:800,s:64,c:'#bfc3c9'});
    if(!end){const p=(st*2)%1;c.strokeStyle=`rgba(255,255,255,${(.5*(1-p)).toFixed(2)})`;c.lineWidth=3;c.beginPath();c.arc(0,30,70+p*60,0,TAU);c.stroke();}
    c.fillStyle='#d42a32';c.beginPath();c.arc(0,210,44,0,TAU);c.fill();c.save();c.translate(0,210);c.rotate(2.3);c.strokeStyle='#fff';c.lineWidth=9;c.lineCap='round';c.beginPath();c.arc(0,0,20,-1,1);c.stroke();c.restore();}
  c.restore();}

/* ---------- 6. SOUL / LESS ---------- */
const WCA=mkc(WW,460),WCB=mkc(WW,460),WBY=300;
function word(cv,fill,o,sw){const g=cv.getContext('2d');reset(g);g.clearRect(0,0,cv.width,cv.height);font(g,o);g.textAlign='center';g.textBaseline='alphabetic';g.fillStyle=fill(g);g.fillText('SOULLESS',540,WBY);
  if(sw>0&&sw<1){const W0=tm(g,'SOULLESS',o),xs=540-W0/2+W0*sw;g.globalCompositeOperation='source-atop';g.fillStyle=LG(g,xs-150,0,xs+150,0,[[0,'rgba(255,255,255,0)'],[.5,'rgba(255,255,255,.8)'],[1,'rgba(255,255,255,0)']]);g.fillRect(0,0,cv.width,cv.height);g.globalCompositeOperation='source-over';}
  return cv;}
function soul(c,t,u){c.fillStyle='#030303';c.fillRect(0,0,WW,HH);c.fillStyle=RG(c,540,820,0,900,[[0,'rgba(80,60,20,.22)'],[1,'rgba(0,0,0,0)']]);c.fillRect(0,0,WW,HH);
  const z=lp(1,1.09,cl((t-T.s6)/(T.loop-T.s6)));c.save();c.translate(540,820);c.scale(z,z);c.translate(-540,-820);
  const o={f:'T',w:900,s:196,ls:4};o.s=Math.min(196,196*860/tm(c,'SOULLESS',o));
  const W0=tm(c,'SOULLESS',o),x0=540-W0/2,ws=tm(c,'SOUL',o)+o.ls/2,y=880;
  const ak=cl((t-T.s6-.15)/.6),cut=T.s6+1.75,ck=eo(cl((t-cut)/.55)),sw=cl((t-T.s6-.35)/.9);
  const A=word(WCA,g=>pat(g,goldTex()),o,sw),B=t<cut?A:word(WCB,g=>pat(g,steelTex()),o,0);
  const cx=x0+ws,cy=y-o.s*.36,ang=-1.35,dx=Math.cos(ang),dy=Math.sin(ang),L=2200;
  const half=(side,cv,glw)=>{c.save();c.translate(side<0?-55*ck:55*ck,side<0?-50*ck:50*ck);const nx=-dy*side,ny=dx*side;c.beginPath();c.moveTo(cx-dx*L,cy-dy*L);c.lineTo(cx+dx*L,cy+dy*L);c.lineTo(cx+dx*L+nx*L,cy+dy*L+ny*L);c.lineTo(cx-dx*L+nx*L,cy-dy*L+ny*L);c.closePath();c.clip();
    c.globalAlpha*=eo(ak);c.shadowColor=glw;c.shadowBlur=34;c.drawImage(cv,0,y-WBY);c.restore();};
  half(-1,A,'rgba(243,190,80,.5)');half(1,B,t<cut?'rgba(243,190,80,.5)':'rgba(140,190,255,.38)');
  // луч режет слово
  const bk=cl((t-cut+.3)/.4);if(bk>0){const a=bk<1?1:Math.max(0,1-(t-cut-.1)*1.1),len=eo(bk)*2*L;c.save();c.globalCompositeOperation='screen';
    c.strokeStyle=`rgba(255,240,205,${a.toFixed(2)})`;c.shadowColor='rgba(255,215,140,1)';c.shadowBlur=34;c.lineWidth=lp(6,2.5,ck);c.lineCap='round';
    c.beginPath();c.moveTo(cx-dx*L,cy-dy*L);c.lineTo(cx-dx*L+dx*len,cy-dy*L+dy*len);c.stroke();c.restore();}
  if(t>cut){const sa=.55*cl((t-cut)/.4)*(.8+.2*Math.sin(t*3)),R=230;c.save();c.globalCompositeOperation='screen';c.strokeStyle=LG(c,cx-dx*R,cy-dy*R,cx+dx*R,cy+dy*R,[[0,'rgba(255,230,180,0)'],[.5,`rgba(255,230,180,${sa.toFixed(2)})`],[1,'rgba(255,230,180,0)']]);c.lineWidth=2.5;c.shadowColor='rgba(255,210,140,.9)';c.shadowBlur=18;c.beginPath();c.moveTo(cx-dx*R,cy-dy*R);c.lineTo(cx+dx*R,cy+dy*R);c.stroke();c.restore();}
  tx(c,'MOSCOW · 2012',540,1070,{f:'O',w:700,s:44,ls:16,c:'#cfc6b2',a:cl((t-cut-.4)/.5)});
  c.restore();
  caps(c,t,[[42.25,"You didn't sell your soul for millions.",'soul'],[44.15,'You traded it for a role.','role.'],[45.75,'Would you keep the money —','money'],[46.6,'or walk away?','walk away?']],
    {f:'P',w:700,it:true,s:78,col:'#f2ead8',acc:'#f3d27a',y:1430,shadow:'rgba(0,0,0,.9)',maxW:900,stag:.07,pop:.2});
  if(t>T.loop){const k=eio(cl((t-T.loop)/(TEND-T.loop)));c.save();c.translate(WW*(1-k),0);DC.draw(c,.02);c.restore();}
  vignette(c,.5);}

/* ---------- монтаж ---------- */
const SH=[];
function build(){SH.length=0;
  SH.push({a:T.s1,tr:'cut',f:(c,t,u)=>typo1(c,t,u)});
  SH.push({a:T.s2,tr:'zoom',f:(c,t,u)=>sat2(c,t,u)});
  SH.push({a:T.s3,tr:'flash',f:(c,t,u)=>deco(c,t,u)});
  SH.push({a:T.s4,tr:'whip',f:(c,t,u)=>club(c,t,u,false)});
  SH.push({a:T.club,tr:'zoom',f:(c,t,u)=>club(c,t,u,true)});
  SH.push({a:T.s5,tr:'glitch',f:(c,t,u)=>crashScene(c,t,u)});
  SH.push({a:T.s6,tr:'blur',f:(c,t,u)=>soul(c,t,u)});
  window.DLX6={TEND,N:Math.round(TEND*30),T,
    sfx:['crack@4.05','shatter@4.42','slam@4.72','slam@6.3','slam@8.02','whoosh@8.6','scan@9.0','pin@12.6','scratch@13.3:0.9','stamp@14.35','hit@16.0','tick@16.55:1.3','whoosh@18.3','click@19.9','car@23.0','click@24.4','whoosh@25.7','glitch@31.0','stamp@32.55','ink@34.25:1.2','dial@35.95:0.9','vm@36.9','dial@37.35:0.9','decl@38.3','brass@41.15','beam@40.8']};}
CLIP.init=async()=>{await DC.init();DC.CAP[2]='Moscow drip';
  CEN=await (await fetch('/a/sat/centers.json')).json();for(const z of [11,13,15])SAT[z]=await loadImg(`/a/sat/n${z}.jpg`);SAT.d=await loadImg('/a/sat/m15.jpg');
  try{MV0=await loadImg('/a/mv/v060.jpg');}catch(e){MV0=null;}build();};
CLIP.draw=(c,t,i)=>{
  if(t<T.crack)DC.draw(c,t);
  else if(t<T.shat){const sh=Math.sin(t*90)*6*(1-cl((t-T.crack)/.37));c.save();c.translate(sh,0);crack(c,t);c.restore();}
  else{const tt=Math.max(t,T.s1);playShots(c,SH,tt);if(t<T.shat+1.2)shatter(c,t);}
  reset(c);if(t>=T.crack)bloom(c,CV,.07);grain(c,i,.055);};
})();
