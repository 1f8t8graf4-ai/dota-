/* «Эссекс» 1820 · 10 с, один отрывок в четырёх видах: ?style=claude | irl | hybrid | adhd.
   Ритм (у claude/irl/hybrid): 0–2,5 океан и дата · 2,5–5 кит 26 м · 5–7,5 удар, дважды · 7,5–10 20 человек, 3 шлюпки, 90 дней.
   Факты: длина «Эссекса» 26,7 м и место 0°41′ ю. ш. 118° з. д., ≈3 700 км до Южной Америки — Википедия; кит 85 футов ≈ 26 м — Чейз (по National Geographic);
   20 человек в трёх шлюпках — Smithsonian; 90 дней — шлюпка Чейза, 20.11.1820 → 18.02.1821. Титул книги Чейза 1821 — текст первого издания. */
(function(){
const ST=Q.get('style')||'claude';
CLIP.fonts=['800 90px Man','700 60px Man','600 30px JBM','700 40px JBM','900 120px Mont','800 80px Mont','700 40px FreeSerif','bold 40px FreeSerif','700 50px Osw'];
const SEG={ship:96,deck:47,tow:89,look:36,shout:38,smash:84,boat:96,surf:48,harp:47,eye:39},FT={},FW={eye:[1280,720]};
let WH=null,SK=null,BM=null,BMJ=null,NT=null,NTJ=null,PAPER=null;
const GRADE='sepia(0.35) saturate(0.55) contrast(1.18) brightness(0.8)';

/* ---------- кадры фильма 1922 ---------- */
const BAND=mk(),BX=BAND.getContext('2d'),MASK=mk();
(function(){const m=MASK.getContext('2d');m.fillStyle=lg(m,0,0,0,H,[[0,'rgba(0,0,0,0)'],[0.13,'rgba(0,0,0,0)'],[0.2,'#000'],[0.8,'#000'],[0.87,'rgba(0,0,0,0)'],[1,'rgba(0,0,0,0)']]);m.fillRect(0,0,W,H);})();
function fdim(seg){return FW[seg]||[634,480];}
function frameOf(seg,tt){const A=FT[seg];return A[clamp(Math.floor(tt*30),0,A.length-1)];}
function foot(c,seg,tt,o){o=o||{};const f=frameOf(seg,tt),z=o.z||1,fx=o.fx===undefined?0.5:o.fx,fy=o.fy===undefined?0.5:o.fy,gr=o.grade===undefined?GRADE:o.grade;
  const [fw,fh]=fdim(seg);if(o.full){c.save();c.filter=gr;const k=Math.max(W/fw,H/fh)*z,w=fw*k,h=fh*k;let x=W/2-fx*w,y=H/2-fy*h;x=Math.min(0,Math.max(W-w,x));y=Math.min(0,Math.max(H-h,y));c.drawImage(f,x+(o.ox||0),y+(o.oy||0),w,h);c.restore();return;}
  reset(SBX);SBX.clearRect(0,0,270,480);SBX.filter=`${gr} blur(5px) brightness(0.55)`;SBX.drawImage(f,(270-634)/2,0,634,480);SBX.filter='none';c.drawImage(SB,0,0,W,H);
  reset(BX);BX.clearRect(0,0,W,H);BX.filter=gr;const k=(o.fit?W/634:1400/480)*z,w=634*k,h=480*k;let x=W/2-fx*w;x=Math.min(0,Math.max(W-w,x));BX.drawImage(f,x+(o.ox||0),H/2-fy*h+(o.oy||0),w,h);BX.filter='none';
  BX.globalCompositeOperation='destination-in';BX.drawImage(MASK,0,0);BX.globalCompositeOperation='source-over';c.drawImage(BAND,0,0);}
function photo(c,img,s,fx,fy,gr){c.save();c.filter=gr||GRADE;kb(c,img,s,fx,fy);c.restore();}
function sketch(c,t,u,o){o=o||{};const w=1000,h=w*SK.height/SK.width,s=(o.s||1)*(1+0.06*u),x=540,y=o.y||900;c.save();c.translate(x,y);c.rotate((o.r||-1.2)*DEG);c.scale(s,s);
  c.fillStyle='rgba(0,0,0,0.5)';c.fillRect(-w/2+14,-h/2+18,w+40,h+40);c.fillStyle='#d8ccb0';c.fillRect(-w/2-20,-h/2-20,w+40,h+40);
  c.filter='sepia(0.3) contrast(1.1) brightness(0.95)';c.drawImage(SK,-w/2,-h/2,w,h);c.filter='none';c.restore();}

/* ---------- карта (Blue Marble NASA, тайлы EOX, Меркатор) ---------- */
function bmXY(J,la,lo){const n=256*Math.pow(2,J.z);const x=(lo+180)/360*n-J.x0*256,y=(1-Math.log(Math.tan((45+la/2)*DEG))/Math.PI)/2*n-J.y0*256;return [x,y];}
const ROUTE=[[41.28,-70.1],[30,-50],[5,-28],[-22,-36],[-44,-58],[-56.6,-67.3],[-48,-78],[-30,-74],[-12,-80],[-1,-90.5],[-0.683,-118]],SINK=[-0.683,-118];
function mapShot(c,t,u,o){o=o||{};const P=bmXY(BMJ,SINK[0],SINK[1]),N=bmXY(BMJ,41.28,-70.1),s=lerp(o.s0||1.32,o.s1||1.95,E.ioS(u)),cx=lerp(o.cx0||900,P[0]+90,E.ioS(u)),cy=lerp(o.cy0||1180,P[1],E.ioS(u));
  c.save();c.translate(540,940);c.scale(s,s);c.translate(-cx,-cy);c.filter='brightness(0.62) contrast(1.15) saturate(0.85)';c.drawImage(BM,0,0);c.filter='none';
  // путь «Эссекса»
  const pts=ROUTE.map(p=>bmXY(BMJ,p[0],p[1])),k=E.outC(inv(o.r0===undefined?0.15:o.r0,o.r1===undefined?0.75:o.r1,u));let L=0;const seg=[];for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seg.push(d);L+=d;}
  c.strokeStyle='rgba(255,70,60,0.95)';c.lineWidth=3/s*1.6;c.setLineDash([10/s*1.6,7/s*1.6]);c.lineCap='round';c.beginPath();c.moveTo(pts[0][0],pts[0][1]);let acc=0;
  for(let i=1;i<pts.length;i++){const d=seg[i-1];if(acc+d>L*k){const f=(L*k-acc)/d;c.lineTo(lerp(pts[i-1][0],pts[i][0],f),lerp(pts[i-1][1],pts[i][1],f));break;}c.lineTo(pts[i][0],pts[i][1]);acc+=d;}c.stroke();c.setLineDash([]);
  c.fillStyle='#fff';ell(c,N[0],N[1],4/s*1.6,4/s*1.6);c.fill();
  if(k>0.98){const pu=(t*1.4)%1;c.strokeStyle=`rgba(255,70,60,${1-pu})`;c.lineWidth=2.5/s*1.6;ell(c,P[0],P[1],(6+40*pu)/s*1.6,(6+40*pu)/s*1.6);c.stroke();c.fillStyle='#ff463c';ell(c,P[0],P[1],6/s*1.6,6/s*1.6);c.fill();}
  c.restore();return {P,N,s,cx,cy};}
function mapPt(m,p){return [540+(p[0]-m.cx)*m.s,940+(p[1]-m.cy)*m.s];}

/* ---------- титры ---------- */
function tIRL(c,big,small,t0,t1,t,y){const a=E.outC(inv(t0,t0+0.35,t))*(1-inv(t1-0.18,t1,t));if(a<=0)return;const dy=26*(1-E.outC(inv(t0,t0+0.45,t)));
  txt(c,big,540,(y||900)+dy,{font:'800 104px Man',a,shadow:'rgba(0,0,0,0.7)',sb:30,ls:2});if(small)txt(c,small,540,(y||900)+96+dy,{font:'700 50px Man',a:a*0.92,ls:6,shadow:'rgba(0,0,0,0.7)',sb:24});}
function tLow(c,lines,t0,t1,t,y){const a=E.outC(inv(t0,t0+0.3,t))*(1-inv(t1-0.15,t1,t));if(a<=0)return;lines.forEach((L,i)=>txt(c,L,540,(y||1330)+i*74+18*(1-a),{font:'800 64px Man',a,shadow:'rgba(0,0,0,0.75)',sb:24,ls:1}));}
function hudT(c,s,x,y,o){o=o||{};txt(c,s,x,y,{font:o.font||'600 30px JBM',align:o.align||'left',fill:o.fill||'rgba(235,245,255,0.92)',a:o.a===undefined?1:o.a,ls:o.ls===undefined?2:o.ls,shadow:'rgba(0,0,0,0.8)',sb:8});}
function corners(c,a){c.save();c.globalAlpha=a;c.strokeStyle='rgba(235,245,255,0.75)';c.lineWidth=2.4;const m=56,L=60;for(const [x,y,dx,dy] of [[m,210,1,1],[W-m,210,-1,1],[m,H-330,1,-1],[W-m,H-330,-1,-1]]){c.beginPath();c.moveTo(x,y+dy*L);c.lineTo(x,y);c.lineTo(x+dx*L,y);c.stroke();}c.restore();}

/* ---------- книга Чейза 1821 (титул набран кодом, бумага шумом) ---------- */
const TITLE=[['NARRATIVE',44,1],['OF THE',20,0],['MOST EXTRAORDINARY AND DISTRESSING',22,1],['SHIPWRECK',40,1],['OF THE',20,0],['WHALE-SHIP ESSEX,',34,1],['OF NANTUCKET;',22,0],['WHICH WAS ATTACKED AND FINALLY',23,1,1],['DESTROYED BY A LARGE',23,1,1],['SPERMACETI-WHALE,',30,1,1],['IN THE PACIFIC OCEAN;',22,0],['WITH AN ACCOUNT OF THE UNPARALLELED SUFFERINGS',15,0],['OF THE CAPTAIN AND CREW DURING A SPACE OF',15,0],['NINETY-THREE DAYS AT SEA, IN OPEN BOATS,',15,0],['IN THE YEARS 1819 & 1820.',15,0],['—',18,0],['BY OWEN CHASE,',24,1],['OF NANTUCKET, FIRST MATE OF SAID VESSEL.',15,0],['—',18,0],['NEW-YORK:',18,1],['PRINTED BY W. B. GILLEY, NO. 92 BROADWAY.',14,0],['1821.',20,1]];
function buildPaper(){const P=mk(700,1000),c=P.getContext('2d'),r=rng(77);c.fillStyle='#e8dcc0';c.fillRect(0,0,700,1000);
  const id=c.getImageData(0,0,700,1000),d=id.data;for(let i=0;i<d.length;i+=4){const n=(r()-0.5)*22;d[i]+=n;d[i+1]+=n;d[i+2]+=n*0.8;}c.putImageData(id,0,0);
  for(let i=0;i<26;i++){const x=r()*700,y=r()*1000,rad=4+r()*22;c.fillStyle=rg(c,x,y,0,x,y,rad,[[0,'rgba(150,110,60,0.18)'],[1,'rgba(150,110,60,0)']]);c.fillRect(x-rad,y-rad,rad*2,rad*2);}
  c.fillStyle=rg(c,350,500,300,350,500,720,[[0,'rgba(120,90,50,0)'],[1,'rgba(120,90,50,0.35)']]);c.fillRect(0,0,700,1000);
  c.textAlign='center';c.textBaseline='alphabetic';let y=96;const lines=[];
  for(const [s,fs,b,mk1] of TITLE){y+=fs*1.28;c.font=`${b?'bold ':''}${fs}px FreeSerif`;c.fillStyle='#1c150e';c.fillText(s,350,y);if(mk1)lines.push([350-c.measureText(s).width/2,y-fs*0.86,c.measureText(s).width,fs*1.08]);y+=fs*0.35;}
  P.mk=lines;return P;}
function chaseCard(c,t,t0,o){o=o||{};const a=E.outB(inv(t0,t0+0.4,t),1.4),sc=lerp(0.6,o.s||0.9,a);if(a<=0)return;const x=o.x||540,y=o.y||900;
  c.save();c.translate(x,y);c.rotate((o.r===undefined?-3:o.r)*DEG);c.scale(sc,sc);c.globalAlpha=clamp(a*1.5);
  c.fillStyle='rgba(0,0,0,0.55)';c.fillRect(-350+16,-500+22,700,1000);c.drawImage(PAPER,-350,-500);
  const mkk=inv(t0+(o.md||0.45),t0+(o.md||0.45)+(o.mdur||0.8),t);c.globalCompositeOperation='multiply';
  PAPER.mk.forEach((m,i)=>{const kk=clamp(mkk*PAPER.mk.length-i);if(kk<=0)return;c.fillStyle='rgba(255,224,40,0.85)';c.fillRect(-350+m[0]-6,-500+m[1]-2,(m[2]+12)*E.outQ(kk),m[3]+6);});
  c.restore();}

/* ---------- рисовка кодом (claude) ---------- */
function whalePath(c){c.beginPath();c.moveTo(2,-70);c.bezierCurveTo(0,-108,14,-126,48,-127);c.bezierCurveTo(140,-131,230,-129,298,-124);c.bezierCurveTo(352,-120,394,-100,446,-90);c.bezierCurveTo(520,-80,580,-80,620,-88);c.lineTo(648,-96);c.bezierCurveTo(664,-86,676,-80,694,-79);c.quadraticCurveTo(708,-85,722,-75);c.quadraticCurveTo(737,-79,752,-69);c.quadraticCurveTo(767,-72,782,-62);c.bezierCurveTo(832,-47,874,-30,906,-21);c.bezierCurveTo(934,-33,968,-56,1020,-66);c.bezierCurveTo(1008,-42,1000,-22,998,-6);c.lineTo(988,0);c.lineTo(998,6);c.bezierCurveTo(1000,22,1008,42,1020,66);c.bezierCurveTo(968,56,934,33,906,21);c.bezierCurveTo(862,34,782,60,690,84);c.bezierCurveTo(600,108,500,118,420,112);c.bezierCurveTo(360,108,322,98,292,90);c.lineTo(64,74);c.bezierCurveTo(24,72,4,52,2,22);c.closePath();}
function whaleSil(c,x,y,s,r,fill,rim,flip){c.save();c.translate(x,y);c.rotate(r||0);c.scale(s*(flip?-1:1),s);c.translate(-500,0);whalePath(c);c.fillStyle=fill;c.fill();if(rim){c.strokeStyle=rim;c.lineWidth=3/s;c.stroke();}
  c.fillStyle='rgba(0,0,0,0.5)';ell(c,266,60,7.5,5);c.fill();c.restore();}
function shipSide(c,x,y,s,col,sail,t){c.save();c.translate(x,y);c.rotate(0.03*Math.sin(t*1.3));c.scale(s,s);
  c.fillStyle=col;c.beginPath();c.moveTo(-320,-40);c.lineTo(330,-46);c.lineTo(390,-70);c.lineTo(300,30);c.quadraticCurveTo(0,58,-280,30);c.closePath();c.fill();
  c.strokeStyle=col;c.lineWidth=7;c.beginPath();c.moveTo(380,-66);c.lineTo(520,-120);c.stroke();
  for(const [mx,mh] of [[-190,500],[20,560],[220,470]]){c.lineWidth=9;c.beginPath();c.moveTo(mx,-40);c.lineTo(mx,-40-mh);c.stroke();
    for(let k=0;k<3;k++){const yy=-40-mh*(0.33+0.24*k),hw=110-k*24,hh=mh*0.2;c.fillStyle=sail;c.beginPath();c.moveTo(mx-hw,yy-hh);c.lineTo(mx+hw,yy-hh);c.quadraticCurveTo(mx+hw*1.12,yy,mx+hw*1.05,yy+4);c.lineTo(mx-hw*1.05,yy+4);c.quadraticCurveTo(mx-hw*1.12,yy,mx-hw,yy-hh);c.fill();c.lineWidth=5;c.beginPath();c.moveTo(mx-hw-8,yy-hh);c.lineTo(mx+hw+8,yy-hh);c.stroke();}}
  c.lineWidth=2.5;c.globalAlpha=0.6;for(const [a,b] of [[[-190,-540],[-320,-44]],[[-190,-540],[20,-600]],[[20,-600],[220,-510]],[[220,-510],[520,-120]],[[20,-600],[330,-50]]]){c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}c.globalAlpha=1;
  c.restore();}
function sea(c,t,y0,col0,col1,hl){c.fillStyle=lg(c,0,y0,0,H,[[0,col0],[1,col1]]);c.fillRect(0,y0,W,H-y0);c.save();c.strokeStyle=hl;c.lineCap='round';
  for(let i=0;i<46;i++){const yy=y0+Math.pow(i/46,1.7)*(H-y0),amp=2+i*0.55,ph=t*(1.2+i*0.03)+i*1.7;c.globalAlpha=0.08+0.32*(1-i/46)*0.5+0.12*(i%3===0);c.lineWidth=1+i*0.06;c.beginPath();
    for(let x=-20;x<=W+20;x+=24){const y=yy+Math.sin(x*0.012+ph)*amp+Math.sin(x*0.031-ph*1.3)*amp*0.5;x<0?c.moveTo(x,y):c.lineTo(x,y);}c.stroke();}c.restore();}
function snow(c,t,n,seed,a){const r=rng(seed);c.save();c.fillStyle='#cfe8ff';for(let i=0;i<n;i++){const x=(r()*W+Math.sin(t*0.5+i)*12)%W,y=(r()*H-t*(10+r()*30)+H*4)%H,s=0.8+r()*2.4;c.globalAlpha=a*(0.2+0.6*r());c.fillRect(x,y,s,s);}c.restore();}
function rays(c,t,x0,a){c.save();c.globalCompositeOperation='lighter';for(let i=0;i<7;i++){const x=x0-460+i*150+40*Math.sin(t*0.4+i),w=60+30*Math.sin(i*2.1),g=lg(c,0,0,0,H*0.8,[[0,`rgba(140,210,255,${0.16*a})`],[1,'rgba(140,210,255,0)']]);
  c.fillStyle=g;c.beginPath();c.moveTo(x-w,0);c.lineTo(x+w,0);c.lineTo(x+w*3+160,H*0.8);c.lineTo(x-w*1.4+160,H*0.8);c.closePath();c.fill();}c.restore();}
function hudClaude(c,t,lines){c.save();corners(c,0.8);hudT(c,'20.11.1820',72,262,{font:'600 30px JBM'});hudT(c,'0°41′ S  118° W',W-72,262,{align:'right'});lines.forEach((s,i)=>hudT(c,s,72,H-382+i*40,{a:0.9}));c.restore();}
function claudeShot(c,t){
  if(t<2.5){const u=t/2.5;c.fillStyle=lg(c,0,0,0,1080,[[0,'#050b12'],[0.7,'#102535'],[1,'#1d3a4d']]);c.fillRect(0,0,W,1080);
    c.fillStyle=rg(c,820,330,0,820,330,420,[[0,'rgba(230,240,255,0.35)'],[0.12,'rgba(230,240,255,0.12)'],[1,'rgba(230,240,255,0)']]);c.fillRect(0,0,W,1080);c.fillStyle='#eef4ff';ell(c,820,330,46,46);c.fill();
    sea(c,t,1080,'#0d2333','#02070c','#9cc7e6');c.save();c.globalCompositeOperation='lighter';for(let i=0;i<40;i++){const y=1100+i*18,w=30+i*7;c.fillStyle=`rgba(210,230,255,${0.12*(1-i/40)})`;c.fillRect(820-w/2+Math.sin(t*3+i)*12,y,w,3);}c.restore();
    c.save();const s=1+0.05*u;c.translate(540,960);c.scale(s,s);c.translate(-540,-960);shipSide(c,430,1110+6*Math.sin(t*1.6),0.92,'#03080d','#253645',t);c.fillStyle='rgba(255,190,110,0.9)';ell(c,140,1078+6*Math.sin(t*1.6),5,5);c.fill();c.restore();
    hudClaude(c,t,['ДО БЕРЕГА ≈3 700 КМ']);return;}
  if(t<5){const u=(t-2.5)/2.5;c.fillStyle=lg(c,0,0,0,H,[[0,'#2a6a86'],[0.18,'#0c3347'],[0.6,'#04131d'],[1,'#010407']]);c.fillRect(0,0,W,H);rays(c,t,540,1);
    c.save();c.globalAlpha=0.9;c.fillStyle='#bfe6ff';for(let x=0;x<W;x+=6){const y=150+8*Math.sin(x*0.02+t*2)+5*Math.sin(x*0.05-t*3);c.globalAlpha=0.2+0.2*Math.sin(x*0.07+t*4);c.fillRect(x,y,6,3);}c.restore();
    c.fillStyle='#02070b';c.beginPath();c.ellipse(560,168,330,46,0,0,Math.PI);c.fill();c.fillRect(250,150,620,20);c.strokeStyle='#02070b';c.lineWidth=10;c.beginPath();c.moveTo(250,175);c.lineTo(880,180);c.stroke();
    snow(c,t,140,5,0.8);const wy=lerp(1700,900,E.outC(u)),ws=lerp(0.9,1.25,u);whaleSil(c,540,wy,ws,-1.2,'rgba(2,10,16,0.92)','rgba(120,190,230,0.35)');
    c.save();c.globalAlpha=E.outC(inv(0.3,0.6,u));c.strokeStyle='rgba(235,245,255,0.8)';c.lineWidth=2.4;const p0=[540-Math.cos(1.2)*500*ws,wy+Math.sin(1.2)*500*ws],p1=[540+Math.cos(1.2)*520*ws,wy-Math.sin(1.2)*520*ws];
    c.beginPath();c.moveTo(p0[0]-120,p0[1]);c.lineTo(p1[0]-120,p1[1]);c.stroke();for(const p of [p0,p1]){c.beginPath();c.moveTo(p[0]-140,p[1]);c.lineTo(p[0]-100,p[1]);c.stroke();}hudT(c,'26 М',Math.min(p0[0],p1[0])-150,(p0[1]+p1[1])/2,{font:'700 44px JBM',align:'right'});c.restore();
    hudClaude(c,t,['ДЛИНА КИТА ≈26 М','ДЛИНА «ЭССЕКСА» 26,7 М']);return;}
  if(t<7.5){const u=(t-5)/2.5,h1=5.55,h2=6.75,kick=Math.max(...[h1,h2].map(h=>t>=h?Math.exp(-(t-h)*7):0)),sh={x:26*kick*Math.sin(t*90),y:18*kick*Math.cos(t*77)};
    c.save();c.translate(sh.x,sh.y);c.fillStyle=lg(c,0,0,0,860,[[0,'#08131c'],[1,'#1b3446']]);c.fillRect(-40,-40,W+80,900);c.fillStyle=lg(c,0,860,0,H,[[0,'#0b3346'],[1,'#02080d']]);c.fillRect(-40,860,W+80,H);
    rays(c,t,700,0.5);c.fillStyle='rgba(190,230,255,0.55)';for(let x=-40;x<W+40;x+=8){c.fillRect(x,858+6*Math.sin(x*0.03+t*3),8,3);}
    c.save();c.translate(0,-60);c.beginPath();c.rect(-40,-40,W+80,960);c.clip();shipSide(c,560,920,1.05,'#03080d','#24323c',t);c.restore();
    c.fillStyle='#03080d';c.beginPath();c.moveTo(170,860);c.lineTo(950,860);c.quadraticCurveTo(840,1010,560,1000);c.quadraticCurveTo(300,990,170,860);c.fill();
    const run=t<h1?E.inQ(inv(5,h1,t)):t<h2-0.5?1-0.6*E.outQ(inv(h1,h1+0.6,t)):t<h2?lerp(0.4,1,E.inQ(inv(h2-0.5,h2,t))):1-0.15*E.outQ(inv(h2,h2+0.5,t));
    whaleSil(c,lerp(-700,170,run)+500*0.95,1050,0.95,-0.08,'rgba(3,12,18,0.96)','rgba(140,200,240,0.4)');
    snow(c,t,90,9,0.6);for(const h of [h1,h2]){if(t<h||t>h+1.2)continue;const v=(t-h)/1.2,r=rng(Math.round(h*10));c.save();for(let i=0;i<40;i++){const a=r()*TAU,d=40+v*(200+r()*420),x=640+Math.cos(a)*d,y=930+Math.sin(a)*d*0.7-v*v*120;c.globalAlpha=(1-v)*0.9;c.fillStyle=i%3?'#8a6a48':'#d8e8f2';c.fillRect(x,y,4+r()*10,2+r()*5);}c.restore();
      const fl=Math.exp(-(t-h)*10);if(fl>0.02){c.fillStyle=`rgba(255,255,255,${0.55*fl})`;c.fillRect(-40,-40,W+80,H+80);}}
    c.restore();hudClaude(c,t,[t<h2?'УДАР 1':'УДАР 2 — ГОЛОВОЙ']);return;}
  const u=(t-7.5)/2.5,s=lerp(1.25,0.8,E.ioS(u));c.fillStyle='#062030';c.fillRect(0,0,W,H);c.save();c.translate(540,900);c.scale(s,s);c.translate(-540,-900);
  for(let i=0;i<70;i++){const y=-600+i*45,ph=t*0.8+i;c.strokeStyle=`rgba(120,190,220,${0.08+0.05*Math.sin(i)})`;c.lineWidth=2;c.beginPath();for(let x=-700;x<=1800;x+=30){const yy=y+Math.sin(x*0.01+ph)*10;x<-690?c.moveTo(x,yy):c.lineTo(x,yy);}c.stroke();}
  c.save();c.translate(560,860);c.rotate(0.5);c.strokeStyle='rgba(220,240,250,0.45)';c.lineWidth=7;ell(c,0,0,250+u*90,70+u*30);c.stroke();c.lineWidth=3;ell(c,0,0,300+u*140,95+u*40);c.globalAlpha=0.5;c.stroke();c.globalAlpha=1;
  c.fillStyle='#5a4330';c.beginPath();c.moveTo(-230,0);c.quadraticCurveTo(-200,-56,0,-60);c.quadraticCurveTo(190,-58,250,0);c.quadraticCurveTo(190,58,0,60);c.quadraticCurveTo(-200,56,-230,0);c.fill();
  c.strokeStyle='rgba(30,20,12,0.6)';c.lineWidth=2;for(let k=-3;k<=3;k++){c.beginPath();c.moveTo(-200,k*14);c.lineTo(220,k*14);c.stroke();}c.fillStyle='#2a1c12';for(const mx of [-110,20,140]){ell(c,mx,0,10,10);c.fill();c.strokeStyle='#2a1c12';c.lineWidth=6;c.beginPath();c.moveTo(mx,-90);c.lineTo(mx+18,90);c.stroke();}
  c.fillStyle=`rgba(6,32,48,${0.25+0.6*u})`;c.beginPath();c.ellipse(-20+60*u,10,260,72,0,0,TAU);c.fill();c.restore();
  const BT=[[-2.5,0],[-1.25,1],[-0.15,2]];c.save();
  for(const [a0,j] of BT){const a=a0+u*0.15,d=250+u*300+j*30,x=560+Math.cos(a)*d,y=860+Math.sin(a)*d*0.8;
    c.save();c.translate(x,y);c.rotate(a);for(const sg of [-1,1]){const g=lg(c,-60,0,-150,0,[[0,'rgba(225,240,250,0.6)'],[1,'rgba(225,240,250,0)']]);c.strokeStyle=g;c.lineWidth=4;c.beginPath();c.moveTo(-58,sg*5);c.lineTo(-150,sg*26);c.stroke();}
      c.fillStyle='#efe4cc';c.beginPath();c.moveTo(-64,0);c.quadraticCurveTo(0,-19,64,0);c.quadraticCurveTo(0,19,-64,0);c.fill();c.fillStyle='#7d6a52';c.beginPath();c.moveTo(-50,0);c.quadraticCurveTo(0,-12,50,0);c.quadraticCurveTo(0,12,-50,0);c.fill();
      c.strokeStyle='#efe4cc';c.lineWidth=2.4;for(let o=-2;o<=2;o++){const sw=0.5*Math.sin(t*7+j*2);c.beginPath();c.moveTo(o*16,-12);c.lineTo(o*16-16*Math.sin(sw),-58);c.moveTo(o*16,12);c.lineTo(o*16-16*Math.sin(sw),58);c.stroke();}c.restore();}
  c.restore();
  c.restore();hudClaude(c,t,['20 ЧЕЛОВЕК · 3 ШЛЮПКИ','ДО БЕРЕГА ≈3 700 КМ']);}

/* ---------- кадр ---------- */
CLIP.init=async function(){
  const segs=ST==='claude'?[]:(ST==='irl'?['ship','tow','boat','smash']:ST==='hybrid'?['tow','boat']:['ship','tow','look','shout','smash','boat','eye']);
  for(const s of segs){FT[s]=await Promise.all(Array.from({length:SEG[s]},(_,i)=>loadImg(`/a/ess/${s}/f${String(i+1).padStart(3,'0')}.jpg`)));}
  WH=await loadImg('/a/ess/whale1.jpg');SK=await loadImg('/a/ess/essex_sketch.jpg');BM=await loadImg('/a/ess/bm4.jpg');BMJ=await (await fetch('/a/ess/bm4.json')).json();
  NT=await loadImg('/a/ess/nantucket12.jpg');PAPER=buildPaper();};
const LAY=mk(),LX=LAY.getContext('2d');
function irl(c,t){
  if(t<2.5){foot(c,'ship',t,{z:1+0.06*t/2.5,fx:0.42});tIRL(c,'1820','ТИХИЙ ОКЕАН',0.25,2.5,t,880);}
  else if(t<5){foot(c,'tow',t-2.5,{z:1.05+0.05*(t-2.5)/2.5,fx:0.5});tIRL(c,'КИТ — 26 М','ДЛИНОЙ — КАК САМ КОРАБЛЬ',2.6,5,t,880);}
  else if(t<7.5){const u=(t-5)/2.5;c.fillStyle='#0b0907';c.fillRect(0,0,W,H);sketch(c,t,u,{y:860,s:1.02});tIRL(c,'ДВА УДАРА','И «ЭССЕКС» ИДЁТ КО ДНУ',5.1,7.5,t,1420);}
  else{foot(c,'boat',t-7.5,{z:1+0.08*(t-7.5)/2.5,fx:0.32});tIRL(c,'90 ДНЕЙ','20 ЧЕЛОВЕК · 3 ШЛЮПКИ',7.6,10.2,t,880);}}
function hybrid(c,t){
  if(t<2.5){const u=t/2.5,m=mapShot(c,t,u,{s0:1.3,s1:1.75,r0:0,r1:0.7});
    const ca=E.outB(inv(0.1,0.45,t),1.3);if(ca>0){c.save();c.globalAlpha=clamp(ca*1.4);const x=70,y=300,w=340,h=250;c.fillStyle='rgba(0,0,0,0.6)';c.fillRect(x+8,y+10,w,h);kbr(c,NT,x,y,w,h,1.15,0.62,0.72);c.strokeStyle='#fff';c.lineWidth=3;c.strokeRect(x,y,w,h);
      hudT(c,'НАНТАКЕТ · 1819',x,y+h+34,{font:'700 28px JBM'});hudT(c,'SENTINEL-2',x,y+h+66,{font:'600 22px JBM',a:0.7});
      const N=mapPt(m,m.N);c.strokeStyle='rgba(255,255,255,0.7)';c.lineWidth=2;c.setLineDash([6,6]);c.beginPath();c.moveTo(x+w,y+h/2);c.lineTo(N[0],N[1]);c.stroke();c.setLineDash([]);c.restore();}
    if(t>1.6){const P=mapPt(m,m.P),a=E.outC(inv(1.6,1.9,t));hudT(c,'0°41′ S  118° W',P[0]-26,P[1]-40,{align:'right',font:'700 30px JBM',a});hudT(c,'≈3 700 КМ ДО БЕРЕГА',P[0]-26,P[1]+44,{align:'right',font:'600 26px JBM',a});}
    corners(c,0.7);tLow(c,['20 НОЯБРЯ 1820','ТИХИЙ ОКЕАН'],0.3,2.5,t,1380);hudT(c,'NASA BLUE MARBLE · SENTINEL-2 CLOUDLESS 2016 (EOX)',72,H-342,{font:'600 18px JBM',a:0.55,ls:1});}
  else if(t<5){const u=(t-2.5)/2.5;foot(c,'tow',t-2.5,{z:1.08+0.04*u,grade:GRADE+' brightness(0.82)'});corners(c,0.7);hudT(c,'«DOWN TO THE SEA IN SHIPS», 1922',72,262,{font:'600 22px JBM',a:0.7});
    const a=E.outB(inv(2.65,3.0,t),1.2);if(a>0){c.save();c.globalAlpha=clamp(a*1.4);const x=600,y=300,w=410,h=230;c.fillStyle='rgba(4,10,14,0.78)';rr(c,x,y,w,h,14);c.fill();c.strokeStyle='rgba(255,255,255,0.35)';c.lineWidth=2;rr(c,x,y,w,h,14);c.stroke();
      const g=E.outC(inv(2.9,3.6,t));whaleSil(c,x+30+68,y+56,0.135,0,'#cfe6f2');
      c.fillStyle='rgba(207,230,242,0.95)';c.fillRect(x+30,y+100,350*g*(26/26.7),12);hudT(c,'КИТ ≈26 М',x+30,y+134,{font:'700 26px JBM'});
      c.fillStyle='#ffb14a';c.fillRect(x+30,y+170,350*g,12);hudT(c,'«ЭССЕКС» 26,7 М',x+30,y+204,{font:'700 26px JBM',fill:'#ffd08a'});c.restore();}
    tLow(c,['КИТ ДЛИНОЙ С КОРАБЛЬ'],2.6,5,t,1400);}
  else if(t<7.5){const u=(t-5)/2.5;c.fillStyle='#0d0b09';c.fillRect(0,0,W,H);sketch(c,t,u,{y:900,s:1.02,r:0});
    const sx=540,sy=900,sw=1000*1.02*(1+0.06*u),sh2=sw*SK.height/SK.width;
    for(const [k,px,py,lab] of [[5.5,0.62,0.58,'УДАР 1'],[6.4,0.58,0.66,'УДАР 2']]){const a=E.outC(inv(k,k+0.35,t));if(a<=0)continue;const x=sx-sw/2+px*sw,y=sy-sh2/2+py*sh2;c.save();c.strokeStyle='#ff3b30';c.lineWidth=7;c.beginPath();c.arc(x,y,70,-Math.PI/2,-Math.PI/2+TAU*a);c.stroke();c.restore();hudT(c,lab,x+86,y-70,{font:'700 34px JBM',fill:'#ff6b60',a});}
    hudT(c,'РИСУНОК ТОМАСА НИКЕРСОНА, ЮНГИ «ЭССЕКСА»',72,H-342,{font:'600 22px JBM',a:0.7});corners(c,0.7);tLow(c,['ОН ТАРАНИТ «ЭССЕКС»','ДВАЖДЫ'],5.1,7.5,t,1440);}
  else{foot(c,'boat',t-7.5,{z:1.05,grade:GRADE+' brightness(0.6)'});chaseCard(c,t,7.6,{x:540,y:880,s:0.95,r:-2.5});corners(c,0.7);hudT(c,'ОУЭН ЧЕЙЗ · СТАРПОМ · КНИГА 1821',72,262,{font:'700 26px JBM'});
    tLow(c,['20 ЧЕЛОВЕК · 3 ШЛЮПКИ','90 ДНЕЙ В ОКЕАНЕ'],8.05,10.2,t,1470);}}
/* СДВГ: событие каждые ~1 с, панч-зумы, вспышки, слова по 1–2 */
const EV=[[0,'ship',0.2,'1820'],[1,'map',0,'ТИХИЙ|ОКЕАН'],[2,'eye',0.0,'КИТ!'],[3,'tow',0.4,'26|МЕТРОВ'],[4,'look',0,'ПРЯМО|НА НАС'],[5,'shout',0.1,'УДАР!'],[6,'smash',0.8,'ЕЩЁ|РАЗ'],[7,'sketch',0,'КОРАБЛЬ|ТОНЕТ'],[8,'boat',0.6,'20|ЧЕЛОВЕК'],[9,'book',0,'90|ДНЕЙ']];
function kin(c,word,t0,t,acc){const a=inv(t0,t0+0.18,t);if(a<=0)return;const sc=lerp(1.6,1,E.outB(inv(t0,t0+0.22,t),2.2));const ws=word.split('|');c.save();c.translate(540,1020);c.scale(sc,sc);
  ws.forEach((w,i)=>{const y=(i-(ws.length-1)/2)*150;txt(c,w,0,y,{font:'900 132px Mont',fill:(i===ws.length-1&&acc)?'#FFD400':'#fff',stroke:'#000',sw:22,shadow:'rgba(0,0,0,0.5)',sb:12,sy:6});});c.restore();}
function adhd(c,t){
  const k=Math.min(9,Math.floor(t)),[t0,what,off,word]=EV[k],lt=t-t0,pz=1+0.18*E.outB(inv(0,0.26,lt),2.6)-0.1*inv(0.26,1,lt),shk=Math.exp(-lt*9)*(k===5||k===6?1:0.35);
  c.save();c.translate(540+22*shk*Math.sin(t*95),960+16*shk*Math.cos(t*83));c.scale(pz,pz);c.translate(-540,-960);
  if(what==='map'){mapShot(c,t,0.55+lt*0.45,{s0:1.4,s1:2.6,r0:0,r1:0.3});const a=E.outC(inv(0.1,0.5,lt));c.strokeStyle='#ff3b30';c.lineWidth=8;c.beginPath();c.arc(540,940,120,-Math.PI/2,-Math.PI/2+TAU*a);c.stroke();}
  else if(what==='sketch'){c.fillStyle='#0d0b09';c.fillRect(0,0,W,H);sketch(c,t,lt,{y:880,s:1.1,r:2});}
  else if(what==='book'){foot(c,'boat',lt+1,{full:1,z:1.1,grade:GRADE+' brightness(0.5)'});chaseCard(c,t,9.0,{x:540,y:830,s:0.92,r:4,md:0.12,mdur:0.4});}
  else if(what==='look')foot(c,'look',lt,{fit:1,z:1.0});
  else if(what==='eye')foot(c,'eye',lt+off,{full:1,z:1.05,fx:0.3,fy:0.45,grade:'saturate(0.75) contrast(1.12) brightness(0.85)'});
  else foot(c,what,lt+off,{full:1,z:1.06,fx:what==='tow'?0.5:0.45});
  if(what==='tow'){const a=E.outC(inv(0.1,0.45,lt));c.save();c.strokeStyle='#ff3b30';c.lineWidth=10;c.lineCap='round';const x0=420,y0=1300,x1=lerp(420,760,a),y1=lerp(1300,1560,a);c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.stroke();c.beginPath();c.moveTo(x1,y1);c.lineTo(x1-40*a,y1-6);c.moveTo(x1,y1);c.lineTo(x1-10,y1-40*a);c.stroke();c.restore();}
  c.restore();
  const fl=Math.exp(-lt*14);if(fl>0.03&&k>0){c.fillStyle=`rgba(255,255,255,${0.75*fl})`;c.fillRect(0,0,W,H);}
  kin(c,word,t0+0.04,t,true);}

CLIP.draw=function(c,t,i){
  reset(LX);LX.clearRect(0,0,W,H);
  if(ST==='claude')claudeShot(LX,t);else if(ST==='irl')irl(LX,t);else if(ST==='hybrid')hybrid(LX,t);else adhd(LX,t);
  c.drawImage(LAY,0,0);
  if(ST==='claude'){bloom(c,LAYER2(LAY),0.3);const tl=[['20 НОЯБРЯ 1820','ТИХИЙ ОКЕАН'],['ПОД КИЛЕМ — КИТ','26 МЕТРОВ'],['ОН ТАРАНИТ «ЭССЕКС»','ДВАЖДЫ'],['20 ЧЕЛОВЕК · 3 ШЛЮПКИ','90 ДНЕЙ']];const k=Math.min(3,Math.floor(t/2.5));tLow(c,tl[k],k*2.5+0.15,k*2.5+2.5,t,1330);}
  const fl=[2.5,5,7.5].map(b=>t>=b&&t<b+0.12?1-(t-b)/0.12:0).reduce((a,b)=>Math.max(a,b),0);if(ST!=='adhd'&&fl>0){c.fillStyle=`rgba(0,0,0,${0.6*fl})`;c.fillRect(0,0,W,H);}
  grain(c,i,ST==='adhd'?0.07:0.11);vig(c,ST==='adhd'?0.35:0.55);
};
function LAYER2(x){return x;}
})();
