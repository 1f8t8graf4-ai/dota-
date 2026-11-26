"use strict";
/* «Духless» EN · «Вещи на столе» (dlx7, 26.11). Формат Gemini «Сделка / вещи героя»: тёмный матовый стол, вещи героя падают в бит,
   название фильма — только в конце. Свет: тёплое золото → строб клуба → мёртвый синий 06:00 → золотая карточка SOULLESS → петля.
   Без голоса. Факты — по субтитрам фильма: Макс, 29, топ-менеджер русско-французского банка «Мегаполис»; годовой доход — «сумма в евро
   с пятью нулями» (4:21); кредит на посёлок «Рай миллионеров» — на месте секретного полигона химических боеприпасов (1:04:38);
   «Вы уволены, Макс» (1:05:13); Вадим — автоответчик, Юля не хочет говорить.
   Спутник: Sentinel-2 cloudless 2016 by EOX (CC BY 4.0) — подпись на фото.
   Рендер: N=855 P10A=<папка с sat/> node render.mjs dlx7 - out.mp4 */
CLIP.fonts=['700 40px Play','italic 700 40px Play','700 40px Osw','500 40px Osw','500 40px Man','600 40px Man','800 40px Man','600 40px Cav','500 40px JBM','700 40px JBM'];
const TEND=28.5,BEAT=60/105.47,T0=.2,tb=n=>T0+n*BEAT;
const P1E=tb(27),P2E=22.3,PCE=24.9;     // конец клуба (обрыв музыки), конец 06:00, конец «города»
let SAT=null,CEN=null;

/* ================= основа: шум, бумага, стол ================= */
function vnt(x,y,P){const m=a=>((a%P)+P)%P,xi=Math.floor(x),yi=Math.floor(y),u=x-xi,v=y-yi,su=u*u*(3-2*u),sv=v*v*(3-2*v);
  return lp(lp(H2(m(xi),m(yi)),H2(m(xi+1),m(yi)),su),lp(H2(m(xi),m(yi+1)),H2(m(xi+1),m(yi+1)),su),sv);}
function fbmt(x,y,P,o){let s=0,a=.5;for(let i=0;i<o;i++){s+=a*vnt(x,y,P);x*=2;y*=2;P*=2;a*=.5;}return s;}
const P2X=(key,w,h,fn)=>cache(key,w*2,h*2,g=>{g.scale(2,2);fn(g,w,h);});
function tableTile(){return cache('table',1024,1024,(g,w,h)=>{const im=g.createImageData(w,h),d=im.data;
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const v=fbmt(i/1024*5,j/1024*5,5,3),f=H2(i*.37,j*.91),b=15+v*13+f*6,p=(j*w+i)*4;d[p]=b*1.1;d[p+1]=b*.99;d[p+2]=b*.86;d[p+3]=255;}
  g.putImageData(im,0,0);g.lineCap='round';
  for(let k=0;k<70;k++){const x=60+H1(k*3.1)*900,y=60+H1(k*5.7)*900,a=H1(k*2.3)*TAU,l=20+H1(k*7.1)*120;g.strokeStyle=`rgba(255,235,210,${.02+.035*H1(k*9.3)})`;g.lineWidth=.6+H1(k)*.8;g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+Math.cos(a)*l*.5+6,y+Math.sin(a)*l*.5,x+Math.cos(a)*l,y+Math.sin(a)*l);g.stroke();}});}
function paperTile(){return cache('paper',512,512,(g,w,h)=>{const im=g.createImageData(w,h),d=im.data;
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const v=fbmt(i/512*24,j/512*24,24,2)*.6+fbmt(i/512*3,j/512*90,3,1)*.4,f=H2(i,j*1.3),b=226+v*22+f*8,p=(j*w+i)*4;d[p]=d[p+1]=d[p+2]=Math.min(255,b);d[p+3]=255;}
  g.putImageData(im,0,0);});}
function paper(g,w,h,col,na=.5){g.fillStyle=col;g.fillRect(0,0,w,h);g.save();g.globalCompositeOperation='multiply';g.globalAlpha=na;g.drawImage(paperTile(),0,0,w,h);g.restore();
  g.fillStyle=LG(g,0,0,w,h,[[0,'rgba(255,255,255,.05)'],[.6,'rgba(0,0,0,0)'],[1,'rgba(0,0,0,.06)']]);g.fillRect(0,0,w,h);}
function redact(g,x,y,w,h){g.fillStyle='#0d0d0e';g.beginPath();g.roundRect(x,y,w,h,1.5);g.fill();g.fillStyle='rgba(255,255,255,.05)';g.fillRect(x+2,y+1,w-4,1);}
function wrap(g,s,x,y,mw,lh,o){font(g,o);const ws=s.split(' ');let ln='',yy=y;g.fillStyle=o.c;g.textAlign='left';g.textBaseline='alphabetic';
  for(const w of ws){const tt=ln?ln+' '+w:w;if(g.measureText(tt).width>mw&&ln){g.fillText(ln,x,yy);ln=w;yy+=lh;}else ln=tt;}if(ln)g.fillText(ln,x,yy);return yy+lh;}
function tCirc(g,s,cx,cy,r,o){font(g,o);g.fillStyle=o.c;g.textAlign='center';g.textBaseline='middle';const n=s.length;
  for(let i=0;i<n;i++){const a=-Math.PI/2+(i/n)*TAU;g.save();g.translate(cx+Math.cos(a)*r,cy+Math.sin(a)*r);g.rotate(a+Math.PI/2);g.fillText(s[i],0,0);g.restore();}}
// пятна чернил у штампа: дырки шумом
function inkWear(g,w,h,seed,amt=.35){g.save();g.globalCompositeOperation='destination-out';for(let k=0;k<420;k++){const x=H1(seed+k*3.3)*w,y=H1(seed+k*7.1)*h,r=.6+H1(seed+k*1.7)**3*5;g.globalAlpha=amt*H1(seed+k*5.9);g.beginPath();g.arc(x,y,r,0,TAU);g.fill();}g.restore();}

/* ================= предметы (холсты 2×) ================= */
const INK='#23211d',GREY='#6c665d';
const LET={w:760,h:1075};
function letterCv(){return P2X('letter',LET.w,LET.h,(g,w,h)=>{paper(g,w,h,'#f2eee5');
  tx(g,'MEGAPOLIS',w/2,112,{f:'P',w:700,s:50,ls:14,c:INK});
  tx(g,'RUSSIAN–FRENCH BANK  ·  MOSCOW',w/2,146,{f:'M',w:600,s:14,ls:5,c:GREY});
  g.fillStyle=INK;g.fillRect(80,170,w-160,1.4);g.fillRect(80,175,w-160,.6);
  tx(g,'Moscow · 2012',w-80,222,{f:'J',w:500,s:15,al:'right',c:GREY});
  tx(g,'EMPLOYMENT OFFER',80,290,{f:'P',w:700,s:34,ls:3,al:'left',c:INK});
  font(g,{f:'M',w:500,s:17});g.fillStyle='#3a3631';g.textAlign='left';g.fillText('Dear Mr.',80,350);redact(g,158,334,92,21);redact(g,258,334,128,21);g.fillText(',',388,350);
  let y=wrap(g,'We are pleased to confirm your appointment as Top Manager of Megapolis, a Russian–French bank. Your compensation package is set out below and takes effect immediately.',80,392,w-160,27,{f:'M',w:500,s:17,c:'#3a3631'});
  tx(g,'ANNUAL COMPENSATION',w/2,y+40,{f:'M',w:800,s:14,ls:5,c:GREY});
  // сумма: € █00 000
  font(g,{f:'P',w:700,s:84});const s1='€ ',s2='00 000',w1=g.measureText(s1).width,w2=g.measureText(s2).width,wb=46,tot=w1+wb+8+w2,x0=w/2-tot/2,yb=y+140;
  g.fillStyle=INK;g.textAlign='left';g.textBaseline='alphabetic';g.fillText(s1,x0,yb);redact(g,x0+w1,yb-62,wb,64);g.fillStyle=INK;g.fillText(s2,x0+w1+wb+8,yb);
  LET.num={x:x0+w1+wb+8+w2/2,y:yb-30,rx:w2/2+36,ry:62};
  tx(g,'net, per year',w/2,yb+38,{f:'M',w:500,s:15,ls:2,c:GREY});
  y=wrap(g,'Please sign both copies and return one to the Human Resources department. We look forward to a long and successful partnership.',80,yb+100,w-160,27,{f:'M',w:500,s:17,c:'#3a3631'});
  g.fillStyle=INK;g.fillRect(80,h-118,300,1.2);g.fillRect(w-300,h-118,220,1.2);
  tx(g,'Signature',80,h-92,{f:'M',w:600,s:13,ls:3,al:'left',c:GREY});tx(g,'Date',w-300,h-92,{f:'M',w:600,s:13,ls:3,al:'left',c:GREY});
  LET.sig={x:230,y:h-128};});}
function folderCv(){return P2X('folder',880,1205,(g,w,h)=>{g.fillStyle=LG(g,0,0,w,h,[[0,'#2a211b'],[1,'#120d0a']]);g.beginPath();g.roundRect(0,0,w,h,18);g.fill();
  g.save();g.clip();g.globalCompositeOperation='overlay';g.globalAlpha=.5;g.drawImage(paperTile(),0,0,w,h);g.restore();
  g.setLineDash([9,7]);g.strokeStyle='rgba(190,160,120,.45)';g.lineWidth=1.6;g.beginPath();g.roundRect(20,20,w-40,h-40,10);g.stroke();g.setLineDash([]);
  tx(g,'M',w/2,h-46,{f:'P',w:700,s:40,c:'rgba(214,176,104,.55)'});});}
const SATP={w:700,h:870};
function satCv(dead){return P2X(dead?'satD':'sat',SATP.w,SATP.h,(g,w,h)=>{paper(g,w,h,'#f5f2eb',.35);
  const ce=CEN[15],S=780;g.save();g.beginPath();g.rect(30,30,640,640);g.clip();g.filter=dead?'grayscale(1) brightness(.55) contrast(1.15)':'contrast(1.3) saturate(1.25) brightness(1.15)';
  g.drawImage(SAT,ce[0]-S/2,ce[1]-S/2,S,S,30,30,640,640);g.filter='none';
  if(dead){g.globalCompositeOperation='multiply';g.fillStyle='#7d97b8';g.fillRect(30,30,640,640);g.globalCompositeOperation='source-over';}
  g.fillStyle=LG(g,30,30,670,670,[[0,'rgba(255,255,255,.10)'],[.45,'rgba(255,255,255,0)'],[1,'rgba(0,0,0,.18)']]);g.fillRect(30,30,640,640);g.restore();
  tx(g,'Moscow, 2012',w/2+10,782,{f:'C',w:600,s:66,c:'#1f3a7a',a:.92});
  tx(g,'Sentinel-2 cloudless 2016 by EOX (CC BY 4.0)',w/2,846,{f:'J',w:500,s:12,c:'#8c867c'});});}
const PASS={w:520,h:800};
function passCv(){return P2X('pass',PASS.w,PASS.h,(g,w,h)=>{g.save();g.beginPath();g.roundRect(0,0,w,h,30);g.clip();
  g.fillStyle='#f4f4f2';g.fillRect(0,0,w,h);g.fillStyle=LG(g,0,0,w,0,[[0,'#171b21'],[1,'#262c35']]);g.fillRect(0,0,w,250);
  g.fillStyle='#b8202c';g.fillRect(0,250,w,8);
  g.fillStyle='#e9e9e6';g.beginPath();g.roundRect(w/2-52,26,104,22,11);g.fill();g.fillStyle='#0b0d10';g.beginPath();g.roundRect(w/2-44,31,88,12,6);g.fill();
  tx(g,'MEGAPOLIS',w/2,138,{f:'P',w:700,s:52,ls:10,c:'#f2efe8'});tx(g,'RUSSIAN–FRENCH BANK',w/2,178,{f:'M',w:600,s:14,ls:5,c:'rgba(242,239,232,.6)'});
  // фото без лица
  g.fillStyle=LG(g,0,300,0,600,[[0,'#8c9bb0'],[1,'#56637a']]);g.fillRect(44,300,200,250);
  g.fillStyle='#1b2028';g.beginPath();g.ellipse(144,410,44,54,0,0,TAU);g.fill();g.beginPath();g.moveTo(54,550);g.bezierCurveTo(60,470,100,462,144,462);g.bezierCurveTo(188,462,228,470,234,550);g.closePath();g.fill();
  g.fillStyle='#e6e6e6';g.beginPath();g.moveTo(124,470);g.lineTo(164,470);g.lineTo(144,505);g.closePath();g.fill();g.fillStyle='#8a1a22';g.beginPath();g.moveTo(140,478);g.lineTo(148,478);g.lineTo(152,520);g.lineTo(144,532);g.lineTo(136,520);g.closePath();g.fill();
  redact(g,272,318,64,22);redact(g,346,318,128,22);
  tx(g,'TOP MANAGER',272,384,{f:'M',w:800,s:24,ls:2,al:'left',c:'#16191e'});
  tx(g,'Corporate lending',272,414,{f:'M',w:500,s:16,al:'left',c:'#5a5f66'});
  g.fillStyle='#b8202c';g.beginPath();g.roundRect(272,452,204,40,8);g.fill();tx(g,'ACCESS · ALL FLOORS',374,478,{f:'M',w:800,s:13,ls:2,c:'#fff'});
  g.fillStyle=LG(g,272,510,320,550,[[0,'#d9b764'],[1,'#8e6a22']]);g.beginPath();g.roundRect(272,512,56,42,7);g.fill();g.strokeStyle='rgba(60,40,10,.5)';g.lineWidth=1;g.strokeRect(285,520,30,26);
  g.fillStyle='#16191e';for(let i=0;i<58;i++){const bw=1+((H1(i*3.7)*3)|0);g.fillRect(56+i*7,618,bw,92);}
  tx(g,'ID 2012 · 0029',w/2,744,{f:'J',w:500,s:16,ls:3,c:'#5a5f66'});g.restore();});}
const AGR={w:780,h:1100};
function sigPt(u){if(u<.84){const v=u/.84;return [262+318*v+24*Math.sin(v*TAU*5.3),AGR.h-176-30*Math.sin(v*TAU*5.3+.6)*Math.exp(-v*1.1)-16*Math.sin(v*TAU*1.05)];}
  const v=(u-.84)/.16;return [lp(585,236,eio(v)),AGR.h-140+10*Math.sin(v*Math.PI)];}
function agrCv(){return P2X('agr',AGR.w,AGR.h,(g,w,h)=>{paper(g,w,h,'#f1ede3');
  tx(g,'MEGAPOLIS',80,98,{f:'P',w:700,s:30,ls:8,al:'left',c:INK});tx(g,'No. 1147 / 2012',w-80,98,{f:'J',w:500,s:15,al:'right',c:GREY});
  g.fillStyle=INK;g.fillRect(80,120,w-160,1.2);
  tx(g,'LOAN AGREEMENT',w/2,214,{f:'P',w:700,s:52,ls:4,c:INK});
  tx(g,'PROJECT',80,300,{f:'M',w:800,s:13,ls:4,al:'left',c:GREY});tx(g,'“Millionaires’ Paradise”',80,352,{f:'P',w:700,s:44,al:'left',it:1,c:INK});
  tx(g,'Cottage village · residential construction',80,388,{f:'M',w:500,s:16,al:'left',c:'#3a3631'});
  tx(g,'AMOUNT',80,456,{f:'M',w:800,s:13,ls:4,al:'left',c:GREY});font(g,{f:'P',w:700,s:40});g.fillStyle=INK;g.textAlign='left';g.fillText('€',80,508);redact(g,112,474,66,36);redact(g,188,474,96,36);g.fillText('000 000',294,508);
  let y=wrap(g,'The Bank agrees to finance the construction of the Project on the land plot described in Annex 1. The Borrower confirms that the land is free of any restrictions, encumbrances or hazards.',80,580,w-160,27,{f:'M',w:500,s:17,c:'#3a3631'});
  wrap(g,'This Agreement enters into force upon signature by an authorised officer of the Bank.',80,y+14,w-160,27,{f:'M',w:500,s:17,c:'#3a3631'});
  // печать банка
  g.save();g.translate(w-190,h-250);g.rotate(-.2);g.strokeStyle='rgba(40,70,160,.75)';g.lineWidth=3;g.beginPath();g.arc(0,0,92,0,TAU);g.stroke();g.lineWidth=1.5;g.beginPath();g.arc(0,0,66,0,TAU);g.stroke();
  tCirc(g,'MEGAPOLIS · MOSCOW · 2012 · ',0,0,79,{f:'M',w:800,s:13,c:'rgba(40,70,160,.8)'});tx(g,'M',0,14,{f:'P',w:700,s:44,c:'rgba(40,70,160,.8)'});g.restore();inkWear(g,w,h,5,.12);
  g.fillStyle=INK;g.fillRect(236,h-128,360,1.2);tx(g,'Approved by',236,h-100,{f:'M',w:600,s:13,ls:3,al:'left',c:GREY});});}
const ENV={w:820,h:700};   // верх 150 — торчащая карточка
function envCv(){return P2X('env',ENV.w,ENV.h,(g,w,h)=>{
  g.fillStyle=LG(g,0,0,0,180,[[0,'#f0dca4'],[1,'#b8913f']]);g.beginPath();g.roundRect(90,8,w-180,240,8);g.fill();
  tx(g,'INVITATION',w/2,70,{f:'M',w:800,s:18,ls:8,c:'#3a2a0c'});tx(g,'Table 4 · 19:00',w/2,118,{f:'P',w:700,s:36,it:1,c:'#2a1d06'});
  g.fillStyle=LG(g,0,150,0,h,[[0,'#151517'],[1,'#09090a']]);g.beginPath();g.roundRect(0,150,w,h-150,10);g.fill();
  g.save();g.beginPath();g.roundRect(0,150,w,h-150,10);g.clip();g.globalCompositeOperation='overlay';g.globalAlpha=.35;g.drawImage(paperTile(),0,150,w,h-150);g.restore();
  const gold=LG(g,0,150,w,h,[[0,'#8a6a2a'],[.45,'#f2d488'],[.6,'#b48a36'],[1,'#e8c46a']]);
  g.strokeStyle=gold;g.lineWidth=2;g.strokeRect(22,172,w-44,h-194);g.lineWidth=.8;g.strokeRect(30,180,w-60,h-210);
  g.strokeStyle='rgba(0,0,0,.55)';g.lineWidth=2;g.beginPath();g.moveTo(0,152);g.lineTo(w/2,h-250);g.lineTo(w,152);g.stroke();
  g.strokeStyle='rgba(242,212,136,.25)';g.lineWidth=1;g.beginPath();g.moveTo(4,154);g.lineTo(w/2,h-248);g.lineTo(w-4,154);g.stroke();
  font(g,{f:'P',w:700,s:150,ls:18});g.textAlign='center';g.textBaseline='alphabetic';g.fillStyle=gold;g.fillText('VIP',w/2+9,h-70);
  tx(g,'MOSCOW  ·  NIGHT',w/2,h-36,{f:'M',w:600,s:14,ls:8,c:'rgba(232,196,106,.7)'});});}
const RCP={w:300};
function rcpCv(id,rows,hgt){return P2X('rcp'+id,RCP.w,hgt,(g,w,h)=>{g.beginPath();g.moveTo(0,0);g.lineTo(w,0);g.lineTo(w,h-14);for(let i=0;i<=15;i++)g.lineTo(w-i*w/15,h-(i%2?0:14));g.closePath();g.save();g.clip();
  paper(g,w,h,'#f6f6f1',.3);g.fillStyle=LG(g,0,0,w,0,[[0,'rgba(0,0,0,.10)'],[.12,'rgba(0,0,0,0)'],[.88,'rgba(0,0,0,0)'],[1,'rgba(0,0,0,.12)']]);g.fillRect(0,0,w,h);
  let y=58;for(const r of rows){if(r==='-'){g.setLineDash([4,4]);g.strokeStyle='#777';g.lineWidth=1;g.beginPath();g.moveTo(22,y-12);g.lineTo(w-22,y-12);g.stroke();g.setLineDash([]);y+=22;continue;}
    const [a,b,big]=Array.isArray(r)?r:[r];tx(g,a,b===undefined?w/2:22,y,{f:'J',w:big?700:500,s:big?20:15,al:b===undefined?'center':'left',c:'#2b2b2b'});if(b)tx(g,b,w-22,y,{f:'J',w:big?700:500,s:big?20:15,al:'right',c:'#2b2b2b'});y+=big?40:30;}
  g.restore();});}
const R1=['TABLE 4  ·  VIP','02:47','-',['CHAMPAGNE x6','4 800.00'],['VODKA x2','900.00'],['FRUIT PLATE','350.00'],['SERVICE 15%','907.50'],'-',['TOTAL EUR','6 957.50',1],'-','PAID · CARD **** 2012','THANK YOU'];
const R2=['TABLE 4  ·  VIP','03:31','-',['CHAMPAGNE x4','3 200.00'],['SERVICE 15%','480.00'],'-',['TOTAL EUR','3 680.00',1],'-','PAID · CARD **** 2012'];
const CARD={w:560,h:353};
function cardCv(){return P2X('card',CARD.w,CARD.h,(g,w,h)=>{g.save();g.beginPath();g.roundRect(0,0,w,h,28);g.clip();g.fillStyle=LG(g,0,0,w,h,[[0,'#1d1d20'],[1,'#070708']]);g.fillRect(0,0,w,h);
  g.globalAlpha=.06;for(let i=-h;i<w;i+=6){g.strokeStyle='#fff';g.lineWidth=1;g.beginPath();g.moveTo(i,0);g.lineTo(i+h,h);g.stroke();}g.globalAlpha=1;
  tx(g,'MEGAPOLIS',40,62,{f:'P',w:700,s:26,ls:8,al:'left',c:'#d8d4cc'});
  g.fillStyle=LG(g,50,110,120,170,[[0,'#f0d68c'],[1,'#9c7428']]);g.beginPath();g.roundRect(50,112,78,58,9);g.fill();g.strokeStyle='rgba(60,40,10,.6)';g.lineWidth=1;g.beginPath();g.moveTo(50,141);g.lineTo(128,141);g.moveTo(89,112);g.lineTo(89,170);g.stroke();
  tx(g,'••••  ••••  ••••  2012',40,248,{f:'J',w:700,s:30,ls:2,al:'left',c:'#a9a6a0'});redact(g,40,282,190,24);g.fillStyle='rgba(255,255,255,.08)';g.fillRect(40,282,190,24);
  tx(g,'BLACK',w-40,310,{f:'M',w:800,s:18,ls:8,al:'right',c:'#c9c4b8'});g.restore();});}
const CORK={w:200,h:120};
function corkCv(){return P2X('cork',CORK.w,CORK.h,(g,w,h)=>{g.fillStyle=LG(g,0,30,0,92,[[0,'#d9b783'],[.5,'#b48850'],[1,'#7a5830']]);g.beginPath();g.roundRect(92,30,100,60,12);g.fill();
  g.fillStyle=LG(g,0,8,0,112,[[0,'#dcbb88'],[.5,'#a87d47'],[1,'#6a4b26']]);g.beginPath();g.moveTo(104,22);g.bezierCurveTo(70,4,30,8,22,30);g.lineTo(22,90);g.bezierCurveTo(30,112,70,116,104,98);g.closePath();g.fill();
  g.fillStyle=LG(g,0,14,0,106,[[0,'#f2efe8'],[.5,'#a8a49a'],[1,'#615d55']]);g.beginPath();g.ellipse(22,60,9,38,0,0,TAU);g.fill();
  g.fillStyle='rgba(60,38,16,.35)';for(let i=0;i<90;i++){const x=30+H1(i*1.7)*160,y=20+H1(i*3.1)*80;g.fillRect(x,y,1.6+H1(i)*2,1.6);}
  g.strokeStyle='rgba(70,40,20,.5)';g.lineWidth=2;g.beginPath();g.moveTo(150,36);g.lineTo(150,84);g.stroke();});}
const BTL={w:1100,h:300};
function bottleCv(){return P2X('btl',BTL.w,BTL.h,(g,w,h)=>{const cy=h/2;
  g.beginPath();g.moveTo(0,cy-50);g.lineTo(330,cy-56);g.bezierCurveTo(420,cy-60,440,cy-128,560,cy-130);g.lineTo(w-14,cy-130);g.quadraticCurveTo(w,cy-130,w,cy-110);g.lineTo(w,cy+110);g.quadraticCurveTo(w,cy+130,w-14,cy+130);g.lineTo(560,cy+130);g.bezierCurveTo(440,cy+128,420,cy+60,330,cy+56);g.lineTo(0,cy+50);g.closePath();
  g.fillStyle=LG(g,0,cy-130,0,cy+130,[[0,'#0a1a12'],[.22,'#2f5a40'],[.3,'#123323'],[.7,'#06110b'],[1,'#020604']]);g.fill();g.save();g.clip();
  g.fillStyle=LG(g,0,cy-120,0,cy-60,[[0,'rgba(255,255,255,0)'],[.5,'rgba(220,255,235,.35)'],[1,'rgba(255,255,255,0)']]);g.fillRect(560,cy-125,w-600,70);
  // фольга на горлышке
  g.fillStyle=LG(g,0,cy-60,0,cy+60,[[0,'#7a5a20'],[.25,'#f6dc92'],[.45,'#c89c44'],[1,'#5a3e10']]);g.beginPath();g.moveTo(0,cy-52);g.lineTo(330,cy-58);g.bezierCurveTo(380,cy-60,400,cy-80,420,cy-96);g.lineTo(420,cy+96);g.bezierCurveTo(400,cy+80,380,cy+60,330,cy+58);g.lineTo(0,cy+52);g.closePath();g.fill();
  g.strokeStyle='rgba(60,40,10,.35)';g.lineWidth=1.2;for(let i=0;i<26;i++){const x=10+H1(i*2.3)*400;g.beginPath();g.moveTo(x,cy-50);g.lineTo(x+(H1(i)-.5)*40,cy+50);g.stroke();}
  // этикетка
  g.fillStyle='#efe6cf';g.beginPath();g.roundRect(640,cy-104,300,208,10);g.fill();g.strokeStyle='#b8933f';g.lineWidth=3;g.strokeRect(654,cy-90,272,180);
  tx(g,'BRUT',790,cy+14,{f:'P',w:700,s:58,ls:10,c:'#2a2a22'});tx(g,'RÉSERVE  ·  2004',790,cy+52,{f:'M',w:700,s:14,ls:4,c:'#7a6a40'});g.restore();});}
const CLK={w:400,h:240};
function clockCase(){return P2X('clk',CLK.w,CLK.h,(g,w,h)=>{g.fillStyle=LG(g,0,0,0,h,[[0,'#2c2c30'],[1,'#0d0d0f']]);g.beginPath();g.roundRect(0,0,w,h,34);g.fill();
  g.strokeStyle='rgba(255,255,255,.12)';g.lineWidth=2;g.beginPath();g.roundRect(3,3,w-6,h-6,31);g.stroke();
  for(const x of [28,212]){g.fillStyle='#050506';g.beginPath();g.roundRect(x,30,160,170,14);g.fill();}
  g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.arc(w/2,98,5,0,TAU);g.arc(w/2,132,5,0,TAU);g.fill();});}
// цифры циферблата: окно (x) с двумя цифрами s, flip k (0..1) от old к s
function clockDigits(c,x,s,old,k){const fy=36,fh=158,mid=fy+fh/2,fw=148;const dg=(str,clipTop)=>{c.save();c.beginPath();clipTop?c.rect(x+6,fy,148,fh/2-1):c.rect(x+6,mid+1,148,fh/2-1);c.clip();
    c.fillStyle=clipTop?'#202024':'#1a1a1d';c.beginPath();c.roundRect(x+6,fy,148,fh,12);c.fill();tx(c,str,x+80,mid+46,{f:'O',w:700,s:128,c:'#ece9e2'});c.restore();};
  if(k<=0||k>=1||old===s){dg(s,1);dg(s,0);}
  else{dg(s,1);dg(old,0);
    if(k<.5){const e=Math.cos(k*Math.PI);c.save();c.translate(0,mid);c.scale(1,e);c.translate(0,-mid);dg(old,1);c.restore();}
    else{const e=-Math.cos(k*Math.PI);c.save();c.translate(0,mid);c.scale(1,e);c.translate(0,-mid);dg(s,0);c.restore();}}
  c.fillStyle='rgba(0,0,0,.85)';c.fillRect(x+6,mid-1,148,2);}
const CLKSEQ=[[0,'19','00'],[9.30,'20','00'],[9.44,'21','15'],[9.57,'22','40'],[9.69,'23','50'],[9.80,'00','30'],[9.91,'01','20'],[10.02,'02','30']];
function clockOver(c,t,fix){let i=0;if(!fix)while(i<CLKSEQ.length-1&&t>=CLKSEQ[i+1][0])i++;const cur=fix||CLKSEQ[i],old=fix?fix:CLKSEQ[Math.max(0,i-1)],k=fix?1:cl((t-cur[0])/.1);
  clockDigits(c,28,cur[1],old[1],old[1]===cur[1]?1:k);clockDigits(c,212,cur[2],old[2],old[2]===cur[2]?1:k);}
const BRO={w:760,h:1000};
function broCv(){return P2X('bro',BRO.w,BRO.h,(g,w,h)=>{g.fillStyle='#fbfaf6';g.fillRect(0,0,w,h);
  const ph=560;g.save();g.beginPath();g.rect(0,0,w,ph);g.clip();g.fillStyle=LG(g,0,0,0,ph,[[0,'#8fb8e0'],[.55,'#f3d6c0'],[.62,'#a9cf8a'],[1,'#5f9a4a']]);g.fillRect(0,0,w,ph);
  g.fillStyle=RG(g,560,250,0,180,[[0,'rgba(255,246,220,.95)'],[1,'rgba(255,246,220,0)']]);g.fillRect(0,0,w,ph);
  g.fillStyle='#f7f5f0';g.fillRect(150,230,380,150);g.fillRect(330,180,230,60);g.fillStyle='#c9c4ba';g.fillRect(150,375,380,8);
  g.fillStyle='#3a4d5c';for(let i=0;i<5;i++)g.fillRect(172+i*70,262,46,90);g.fillRect(352,192,60,40);g.fillRect(432,192,60,40);
  g.fillStyle='#57b8d6';g.beginPath();g.moveTo(120,440);g.lineTo(420,440);g.lineTo(470,500);g.lineTo(80,500);g.closePath();g.fill();g.fillStyle='rgba(255,255,255,.35)';g.fillRect(150,452,200,6);
  g.fillStyle='#2e5a32';for(const [x,y0] of [[90,170],[600,190],[650,210]]){g.beginPath();g.ellipse(x,y0+110,26,110,0,0,TAU);g.fill();}g.restore();
  tx(g,'MILLIONAIRES’',w/2,660,{f:'P',w:700,s:58,ls:6,c:'#1c2a22'});tx(g,'PARADISE',w/2,730,{f:'P',w:700,s:70,ls:14,c:'#9a7a32'});
  tx(g,'A private village for those who have everything',w/2,786,{f:'P',w:700,s:22,it:1,c:'#4a544c'});
  g.fillStyle='#d9d4c8';g.fillRect(80,830,w-160,1);tx(g,'Villas · Lake · Golf · 24/7 security',w/2,880,{f:'M',w:600,s:16,ls:4,c:'#6a7068'});
  tx(g,'Financed by Megapolis Bank',w/2,940,{f:'M',w:500,s:14,ls:2,c:'#8a8f88'});
  g.fillStyle=LG(g,0,0,w,h,[[0,'rgba(255,255,255,.18)'],[.4,'rgba(255,255,255,0)'],[1,'rgba(0,0,0,.08)']]);g.fillRect(0,0,w,h);});}
function stampCv(key,lines,w,h,col,seed){return P2X('st'+key,w,h,(g)=>{g.strokeStyle=col;g.lineWidth=7;g.beginPath();g.roundRect(8,8,w-16,h-16,10);g.stroke();g.lineWidth=2.5;g.beginPath();g.roundRect(20,20,w-40,h-40,6);g.stroke();
  const tot=lines.reduce((a,l)=>a+l[1]*1.12,0);let y=h/2-tot/2;for(const l of lines){y+=l[1]*1.12;tx(g,l[0],w/2,y-l[1]*.2,{f:'O',w:700,s:l[1],ls:4,c:col});}inkWear(g,w,h,seed,.55);});}
const PHN={w:470,h:920};
function phoneCv(){return P2X('phone',PHN.w,PHN.h,(g,w,h)=>{g.fillStyle=LG(g,0,0,w,h,[[0,'#2a2b2f'],[.5,'#0b0b0c'],[1,'#1b1c1f']]);g.beginPath();g.roundRect(0,0,w,h,66);g.fill();
  g.strokeStyle='rgba(210,214,222,.55)';g.lineWidth=5;g.beginPath();g.roundRect(3,3,w-6,h-6,63);g.stroke();
  g.fillStyle='#050505';g.beginPath();g.roundRect(14,14,w-28,h-28,56);g.fill();
  g.fillStyle='#1d1e21';g.beginPath();g.roundRect(w/2-46,64,92,10,5);g.fill();g.fillStyle='#0f1622';g.beginPath();g.arc(w/2-80,69,8,0,TAU);g.fill();
  g.strokeStyle='rgba(255,255,255,.18)';g.lineWidth=3;g.beginPath();g.arc(w/2,h-74,30,0,TAU);g.stroke();g.beginPath();g.roundRect(w/2-10,h-84,20,20,4);g.stroke();});}
const SCR={x:35,y:128,w:400,h:610};
function phoneScreen(c,t){const {x,y,w,h}=SCR;c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
  const v=t<21.15,ended=v?t>=20.85:t>=21.95,name=v?'Vadim':'Julia';
  c.fillStyle=LG(c,0,y,0,y+h,[[0,'#3a4250'],[1,'#141821']]);c.fillRect(x,y,w,h);
  c.fillStyle='rgba(0,0,0,.55)';c.fillRect(x,y,w,26);tx(c,'06:12',x+w/2,y+19,{f:'M',w:800,s:15,c:'#fff'});c.fillStyle='#fff';for(let i=0;i<4;i++)c.fillRect(x+12+i*7,y+18-i*3-2,4,i*3+3);
  tx(c,name,x+w/2,y+150,{f:'M',w:500,s:54,c:'#fff'});
  const st=ended?(v?'voicemail':'call ended'):'calling'+'.'.repeat(1+Math.floor(t*3)%3);
  tx(c,st,x+w/2,y+196,{f:'M',w:600,s:24,c:ended?'#ff6a5e':'rgba(255,255,255,.75)'});
  for(let i=0;i<6;i++){const bx=x+44+(i%3)*112,by=y+268+Math.floor(i/3)*104;c.strokeStyle='rgba(255,255,255,.22)';c.lineWidth=2;c.beginPath();c.arc(bx+44,by+36,32,0,TAU);c.stroke();}
  c.fillStyle=ended?'#5a2a2a':'#d8352b';c.beginPath();c.roundRect(x+40,y+h-104,w-80,72,14);c.fill();tx(c,'End',x+w/2,y+h-58,{f:'M',w:800,s:28,c:'#fff'});
  c.fillStyle=LG(c,x,y,x+w,y+h,[[0,'rgba(255,255,255,.10)'],[.35,'rgba(255,255,255,0)']]);c.fillRect(x,y,w,h);c.restore();}
const SOUL={w:860,h:500};
function soulCv(){return P2X('soul',SOUL.w,SOUL.h,(g,w,h)=>{const gold=LG(g,0,0,w,h,[[0,'#7a5a22'],[.3,'#e9c878'],[.5,'#fff0bf'],[.62,'#c49a44'],[1,'#8a6628']]);
  g.fillStyle=gold;g.beginPath();g.roundRect(0,0,w,h,14);g.fill();g.save();g.clip();g.globalAlpha=.05;for(let y=0;y<h;y+=1){g.fillStyle=H1(y*1.37)>.5?'#fff':'#000';g.fillRect(0,y,w,1);}g.restore();
  g.strokeStyle='rgba(60,40,10,.45)';g.lineWidth=1.5;g.strokeRect(24,24,w-48,h-48);
  font(g,{f:'P',w:700,s:132,ls:12});const s='SOULLESS',tw2=g.measureText(s).width;g.textAlign='left';g.textBaseline='alphabetic';const x0=w/2-tw2/2,yb=h/2+48;
  g.fillStyle='rgba(255,248,220,.55)';g.fillText(s,x0+2,yb+3);g.fillStyle='#4a3410';g.fillText(s,x0,yb);
  SOUL.cut=x0+g.measureText('SOUL').width+6;
  tx(g,'MOSCOW  ·  2012',w/2,h-62,{f:'M',w:800,s:16,ls:10,c:'rgba(60,40,10,.75)'});});}

/* ================= сцена: объекты, тени, камера ================= */
const rectPath=(g,w,h,r=4)=>{g.beginPath();g.roundRect(0,0,w,h,r);};
function shSpr(o,bl){return cache('sh'+o.id+'_'+bl,o.w+bl*6,o.h+bl*6,g=>{g.filter=`blur(${bl}px)`;g.translate(bl*3,bl*3);(o.path||((g,w,h)=>rectPath(g,w,h,o.r||4)))(g,o.w,o.h);g.fillStyle='#000';g.fill();});}
function hOf(o,t){const st=o.ti-o.fall;if(t<st)return null;const k=(t-st)/o.fall;if(k<1)return 1-k*k;const d=t-o.ti;return (o.bnc??.03)*Math.exp(-d*13)*Math.abs(Math.sin(d*30));}
function objDraw(c,o,t){const h=hOf(o,t);if(h===null)return;const st=o.ti-o.fall,s=1+(o.lift??.55)*h,a=c.globalAlpha*cl((t-st)/.05),rot=o.rot+(o.spin??.12)*h,x=o.x+(o.fx??0)*h,y=o.y+(o.fy??-140)*h;
  if(o.sh!==0){const sp=shSpr(o,22),sp2=shSpr(o,5),sh=o.sh??1;
    c.save();c.translate(x+(10+80*h)*sh,y+(16+120*h)*sh);c.rotate(rot);c.scale(s*(1+.06*h),s*(1+.06*h));c.globalAlpha=a*.7*(1-.55*h)*sh;c.drawImage(sp,-sp.width/2,-sp.height/2);c.restore();
    const ka=cl(1-h*5);if(ka>0){c.save();c.translate(x+4*sh,y+7*sh);c.rotate(rot);c.scale(s,s);c.globalAlpha=a*.6*ka*sh;c.drawImage(sp2,-sp2.width/2,-sp2.height/2);c.restore();}}
  c.save();c.translate(x,y);c.rotate(rot);c.scale(s,s);c.globalAlpha=a;if(o.under)o.under(c,t,h);
  if(o.cv)c.drawImage(o.cv(),-o.w/2,-o.h/2,o.w,o.h);
  if(o.over){c.save();c.translate(-o.w/2,-o.h/2);o.over(c,t,h);c.restore();}
  c.restore();}
// пыль от удара по краям предмета
function puffs(c,o,t){const d=t-o.ti;if(d<0||d>.75||o.dust===0)return;const g=glowSprite(),e=eo(d/.75);c.save();c.globalCompositeOperation='screen';
  const cs=Math.cos(o.rot),sn=Math.sin(o.rot);
  for(let i=0;i<26;i++){const u=H1(i*3.3+o.ti),side=i%4;let lx,ly,nx,ny;
    if(side===0){lx=(u-.5)*o.w;ly=-o.h/2;nx=0;ny=-1;}else if(side===1){lx=o.w/2;ly=(u-.5)*o.h;nx=1;ny=0;}else if(side===2){lx=(u-.5)*o.w;ly=o.h/2;nx=0;ny=1;}else{lx=-o.w/2;ly=(u-.5)*o.h;nx=-1;ny=0;}
    const r=(18+34*H1(i*5.1))*(1+e*.8),dd=(12+70*H1(i*7.7))*e,px=lx+nx*dd,py=ly+ny*dd;
    c.globalAlpha=.16*(1-d/.75)*(o.dust??1);c.drawImage(g,o.x+px*cs-py*sn-r,o.y+px*sn+py*cs-r,2*r,2*r);}
  c.restore();}
function camApply(c,K){c.translate(WW/2,HH/2);c.rotate(K.r||0);c.scale(K.z,K.z);c.translate(-K.x,-K.y);}
function table(c,K,tint){const R=1150/K.z,p=c.createPattern(tableTile(),'repeat');p.setTransform(new DOMMatrix().scale(1.5));c.fillStyle=p;c.fillRect(K.x-R,K.y-R*1.75,2*R,3.5*R);
  if(tint){c.save();c.globalCompositeOperation=tint[0];c.globalAlpha=tint[2];c.fillStyle=tint[1];c.fillRect(K.x-R,K.y-R*1.75,2*R,3.5*R);c.restore();}}
function shakeOf(L,t){let sx=0,sy=0;for(const o of L){const d=t-o.ti;if(d>=0&&d<.24){const k=(1-d/.24)**2*(o.shk??10);sx+=n1(t*47+o.ti*9)*k;sy+=n1(t*53+o.ti*5+7)*k;}}return [sx,sy];}
function scene(c,K,t,L,tint){c.save();camApply(c,K);table(c,K,tint);for(const o of L)objDraw(c,o,t);for(const o of L)puffs(c,o,t);c.restore();}
// размытие движения камеры: если кадр сдвинулся заметно — несколько подкадров
function renderMB(c,t,camFn,drawFn){const K=camFn(t),K2=camFn(t-1/60);const dx=(K.x-K2.x)*K.z,dy=(K.y-K2.y)*K.z,dz=Math.abs(K.z-K2.z)/K.z*900,dr=Math.abs(K.r-K2.r)*900,disp=Math.hypot(dx,dy)+dz+dr;
  if(disp<10){drawFn(c,K,t);return;}const n=Math.min(14,Math.ceil(disp/6)),a=TA.getContext('2d');
  for(let j=0;j<n;j++){const tj=t-(j/(n))*(1/60);reset(a);a.fillStyle='#000';a.fillRect(0,0,WW,HH);drawFn(a,camFn(tj),tj);c.save();reset(c);c.globalAlpha=1/(j+1);c.drawImage(TA,0,0);c.restore();}}

/* ================= свет ================= */
function light(c,cx,cy,r1,stops,glow){c.save();reset(c);c.globalCompositeOperation='multiply';c.fillStyle=RG(c,cx,cy,90,r1,stops);c.fillRect(0,0,WW,HH);
  if(glow){c.globalCompositeOperation='screen';c.globalAlpha=glow[1];c.fillStyle=RG(c,cx,cy,0,r1*.55,[[0,glow[0]],[1,'rgba(0,0,0,0)']]);c.fillRect(0,0,WW,HH);}c.restore();}
const LGOLD=[[0,'#fff6e8'],[.38,'#e9cfa8'],[.72,'#6e5236'],[1,'#120b06']];
const LBLUE=[[0,'#e8f1ff'],[.4,'#a9bdd6'],[.75,'#34455c'],[1,'#03060b']];
let BLD=null;
function blinds(c,t,a){if(!BLD){BLD=mkc(WW/4,HH/4);const g=BLD.getContext('2d');g.filter='blur(5px)';g.translate(WW/8,HH/8);g.rotate(-.42);g.fillStyle='rgba(170,200,255,1)';for(let i=-8;i<8;i++)g.fillRect(-500,i*46,1000,24);}
  c.save();reset(c);c.globalCompositeOperation='screen';c.globalAlpha=a;c.drawImage(BLD,-240+(t*6)%120,-60,WW+480,HH+120);c.restore();}

/* ================= фаза 1: тёплое золото → клуб ================= */
const O1=[
  {id:'fold',x:-8,y:6,w:880,h:1205,rot:.02,ti:tb(0),fall:.3,cv:folderCv,r:18,shk:0,dust:.6},
  {id:'let',x:0,y:0,w:LET.w,h:LET.h,rot:-.025,ti:tb(0),fall:.3,cv:letterCv,shk:16,over:letterOver},
  {id:'sat',x:980,y:-780,w:SATP.w,h:SATP.h,rot:.12,ti:tb(6),fall:.3,cv:()=>satCv(0),fx:-60,over:sheenOver(tb(6.2),tb(8),.3,SATP.w,SATP.h)},
  {id:'pass',x:-760,y:-1120,w:PASS.w,h:PASS.h,rot:-.16,ti:tb(8),fall:.28,cv:passCv,r:30,under:lanyard,over:sheenOver(tb(8.2),tb(10),.3,PASS.w,PASS.h,30)},
  {id:'agr',x:120,y:-2060,w:AGR.w,h:AGR.h,rot:.03,ti:tb(10),fall:.3,cv:agrCv,over:agrOver},
  {id:'env',x:-820,y:-2950,w:ENV.w,h:ENV.h,rot:-.1,ti:tb(14),fall:.3,cv:envCv,r:10,over:sheenOver(tb(14.2),tb(16),.22,ENV.w,ENV.h,10),path:(g,w,h)=>{g.beginPath();g.roundRect(90,8,w-180,240,8);g.roundRect(0,150,w,h-150,10);}},
  {id:'clk',x:-660,y:-2500,w:CLK.w,h:CLK.h,rot:.07,ti:tb(15),fall:.26,cv:clockCase,r:34,over:(c,t)=>clockOver(c,t)},
  {id:'btl',x:760,y:-4330,w:BTL.w,h:BTL.h,rot:-.55,ti:tb(18),fall:.3,cv:bottleCv,r:120,shk:18,dust:1.3,fy:-200},
  {id:'r1',x:150,y:-3760,w:RCP.w,h:900,rot:.17,ti:tb(19),fall:.26,cv:()=>rcpCv(1,R1,900),fy:-80},
  {id:'r2',x:560,y:-3640,w:RCP.w,h:620,rot:-.22,ti:tb(21),fall:.26,cv:()=>rcpCv(2,R2,620),fy:-80},
  {id:'card',x:330,y:-3990,w:CARD.w,h:CARD.h,rot:-.34,ti:tb(20),fall:.24,cv:cardCv,r:28,shk:14,over:sheenOver(tb(19.2),tb(22),.35,CARD.w,CARD.h,28)},
  {id:'cork',x:300,y:-4210,w:CORK.w*1.2,h:CORK.h*1.2,rot:.5,ti:tb(18.5),fall:.24,cv:corkCv,r:50,lift:.9,spin:2.2,shk:6,dust:.5},
];
function sheenOver(t0,t1,a,w,h,r=0){return (c,t)=>{const k=(t-t0)/(t1-t0);if(k<=0||k>=1)return;c.save();c.beginPath();c.roundRect(0,0,w,h,r);c.clip();c.globalCompositeOperation='screen';
  const cx=lp(-w*.5,w*1.5,eio(k));c.fillStyle=LG(c,cx-160,0,cx+160,h*.5,[[0,'rgba(255,255,255,0)'],[.5,`rgba(255,248,232,${a})`],[1,'rgba(255,255,255,0)']]);c.fillRect(0,0,w,h);c.restore();};}
function letterOver(c,t){const N=LET.num;if(!N)return;const k=cl((t-tb(3))/.42);if(k<=0)return;
  c.save();c.strokeStyle='rgba(200,24,30,.88)';c.lineCap='round';c.lineWidth=7;c.globalCompositeOperation='multiply';
  for(let p=0;p<2;p++){c.beginPath();const n=60,a0=-2.3+p*.25,span=(TAU+.5)*k;for(let i=0;i<=n;i++){const a=a0+span*i/n,wob=1+.04*Math.sin(a*3+p);const x=N.x+Math.cos(a)*N.rx*wob+p*5,y=N.y+Math.sin(a)*N.ry*wob-p*3;i?c.lineTo(x,y):c.moveTo(x,y);}c.globalAlpha=p?.5:1;c.stroke();}
  c.restore();
  // поверх в фазе 2 — штамп FIRED
}
function lanyard(c,t,h){c.save();c.translate(-PASS.w/2,-PASS.h/2);const L=LG(c,0,0,60,0,[[0,'#6e1219'],[.5,'#b8202c'],[1,'#5e0f15']]);
  for(const s of [-1,1]){c.fillStyle=L;c.beginPath();const x0=PASS.w/2+s*14;c.moveTo(x0-16,40);c.bezierCurveTo(x0+s*30-80,-160,x0+s*60-420,-360,x0+s*40-760,-520);c.lineTo(x0+s*40-760+20,-520+30);c.bezierCurveTo(x0+s*60-420+30,-330,x0+s*30-80+34,-140,x0+18,40);c.closePath();c.fill();
    c.save();c.clip();for(let k=0;k<4;k++)tx(c,'MEGAPOLIS',x0-120-k*170+s*10,-90-k*110,{f:'M',w:800,s:11,ls:3,c:'rgba(255,255,255,.4)'});c.restore();}
  c.fillStyle=LG(c,0,0,0,60,[[0,'#e8e8ea'],[1,'#8c8f96']]);c.beginPath();c.roundRect(PASS.w/2-30,2,60,44,10);c.fill();c.restore();}
// подпись и ручка (без руки) на договоре
const SG0=tb(11)+.1,SG1=tb(12)+.45;
function agrOver(c,t){const k=cl((t-SG0)/(SG1-SG0));
  if(k>0){c.save();c.strokeStyle='#1b2a6b';c.lineCap='round';c.lineJoin='round';c.lineWidth=3.4;c.beginPath();const n=Math.floor(220*k);for(let i=0;i<=n;i++){const p=sigPt(i/220);i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}c.stroke();c.restore();}
  // ручка: падает на tb(11), кончик — в начало подписи, ведёт подпись, потом лежит
  const tP=tb(11);if(t<tP-.28)return;const kk=(t-(tP-.28))/.28,h=kk<1?1-kk*kk:0;let tip=sigPt(cl(k)*.999);if(k<=0)tip=sigPt(0);
  const after=t>SG1+.15?eo((t-SG1-.15)/.35):0;const px=tip[0]+after*60,py=tip[1]+after*40,ang=-.72-after*.3,s=1+.8*h;
  c.save();c.translate(px+14+60*h,py+20+90*h);c.rotate(ang);c.scale(s,s);c.globalAlpha=.45*(1-.5*h);c.filter='blur(6px)';c.fillStyle='#000';c.beginPath();c.roundRect(0,-9,480,20,9);c.fill();c.restore();
  c.save();c.translate(px,py-(after?6:0));c.rotate(ang);c.scale(s,s);
  c.fillStyle=LG(c,0,-11,0,11,[[0,'#3a3a40'],[.35,'#0c0c0e'],[1,'#000']]);c.beginPath();c.roundRect(44,-11,430,22,10);c.fill();
  c.fillStyle=LG(c,0,-9,0,9,[[0,'#f4dc9a'],[.5,'#b8913f'],[1,'#6e5216']]);c.beginPath();c.moveTo(0,0);c.lineTo(46,-9);c.lineTo(46,9);c.closePath();c.fill();c.fillRect(150,-11,10,22);c.fillRect(290,-12,6,24);
  c.fillRect(300,-15,150,5);c.fillStyle='rgba(255,255,255,.35)';c.fillRect(60,-8,400,2);c.restore();}
// камера фазы 1 (мир): ключи [время, {x,y,z,r}]
let CK1=null;
function wpt(o,lx,ly){const dx=lx-o.w/2,dy=ly-o.h/2,c=Math.cos(o.rot),sn=Math.sin(o.rot);return [o.x+dx*c-dy*sn,o.y+dx*sn+dy*c];}
function buildCK1(){const O=id=>O1.find(o=>o.id===id),N=wpt(O('let'),LET.num.x,LET.num.y),S=wpt(O('agr'),420,AGR.h-160),C=O('clk');
  CK1=[[0,{x:0,y:-150,z:.86,r:0}],[tb(2.6),{x:0,y:-110,z:.9,r:-.01}],[tb(3.2),{x:N[0],y:N[1]+20,z:1.62,r:-.035}],[tb(5.6),{x:N[0]+4,y:N[1]+26,z:1.72,r:-.04}],
  [tb(6.05),{x:975,y:-780,z:1.06,r:.06}],[tb(7.6),{x:985,y:-790,z:1.12,r:.075}],[tb(8.05),{x:-755,y:-1110,z:1.1,r:-.08}],[tb(9.6),{x:-750,y:-1120,z:1.16,r:-.09}],
  [tb(10.05),{x:118,y:-2050,z:.97,r:.02}],[tb(11.0),{x:122,y:-2030,z:1.0,r:.02}],[tb(11.6),{x:S[0],y:S[1],z:1.42,r:.035}],[tb(13.6),{x:S[0]+5,y:S[1]+8,z:1.5,r:.035}],
  [tb(14.05),{x:-800,y:-2880,z:1.0,r:-.07}],[tb(15.4),{x:-780,y:-2780,z:1.06,r:-.05}],[tb(15.9),{x:C.x,y:C.y,z:1.6,r:.05}],[tb(17.6),{x:C.x,y:C.y+4,z:1.68,r:.055}],
  [tb(18.05),{x:430,y:-4150,z:1.45,r:.08}],[tb(19.3),{x:400,y:-3960,z:.98,r:.04}],[tb(27),{x:375,y:-3910,z:1.12,r:.02}]];}
const UP=150;   // вещи выше середины: низ кадра — под титры
function cam1(t){const K={...camKeys(CK1,t)};K.y+=UP/K.z;const [sx,sy]=shakeOf(O1,t);K.x+=sx/K.z;K.y+=sy/K.z;
  K.x+=n1(t*.9)*5;K.y+=n1(t*.8+3)*5;
  if(t>=tb(18)){const b=Math.floor((t-T0)/BEAT),d=t-tb(b);K.z*=1+.04*Math.exp(-d/.11);K.r+=n1(t*1.7)*.012;K.x+=n1(t*2.3+5)*10/K.z;K.y+=n1(t*2.1+9)*10/K.z;}
  return K;}
function phase1(c,t){renderMB(c,t,cam1,(g,K,tt)=>{scene(g,K,tt,O1);confetti(g,K,tt);});
  if(t<tb(18)){light(c,540,800,1250,LGOLD,['rgba(255,214,150,1)',.08]);}
  else clubLight(c,t);}
// конфетти в клубе
function confetti(c,K,t){if(t<tb(18))return;c.save();camApply(c,K);for(let i=0;i<70;i++){const ti=tb(18)+H1(i*3.1)*4.2,d=t-ti;if(d<0)continue;const h=d<.35?1-(d/.35)**2:0,x=40+H1(i*7.3)*760,y=-4400+H1(i*5.7)*900,r=H1(i*9.1)*TAU+h*4;
  c.save();c.translate(x,y-h*90);c.rotate(r);c.scale(1+h,1+h);c.fillStyle=i%5?'#e8c066':'#f4e7c4';c.globalAlpha=.9;c.fillRect(-8,-3.5,16,7);c.restore();}c.restore();}
// блик по глянцевым вещам (проходит медленно)
function clubLight(c,t){const b=Math.floor((t-T0)/BEAT),d=t-tb(b),dead=t>=tb(24.6);const f=dead?0:Math.exp(-d/.08)*(b%2?0.8:1);
  const sw=dead?0:(b%2?1:-1)*lp(230,60,eo(d/BEAT)),cen=mixc('#e09a9e','#ffffff',f),mid=mixc('#5a1018','#a0a0a0',f);light(c,540+sw,820,1150,[[0,cen],[.38,mid],[1,'#040102']]);
  if(f>.02){c.save();reset(c);c.globalCompositeOperation='screen';c.globalAlpha=.22*f;c.fillStyle='#fff';c.fillRect(0,0,WW,HH);c.restore();}
  if(dead){c.save();reset(c);c.globalCompositeOperation='multiply';c.globalAlpha=ss(tb(24.6),tb(25.6),t)*.5;c.fillStyle='#202030';c.fillRect(0,0,WW,HH);c.restore();}}
// огромные слова под строб
const BIG=[[tb(22),'POWER'],[tb(23),'NOISE'],[tb(24),'NUMB']];
function bigWords(c,t){let k=-1;for(let i=0;i<BIG.length;i++)if(t>=BIG[i][0])k=i;if(k<0||t>=tb(25))return;const [t0,s]=BIG[k],d=t-t0,pop=1+.1*Math.exp(-d/.06),fade=k===2?1-ss(tb(24.6),tb(25),t):1;
  c.save();reset(c);font(c,{f:'O',w:700,s:340,ls:8});const w=c.measureText(s).width,sc=Math.min(1,920/w)*pop;c.translate(540,880);c.scale(sc,sc);c.textAlign='center';c.textBaseline='alphabetic';
  c.globalAlpha=fade;c.shadowColor='rgba(0,0,0,.7)';c.shadowBlur=40;c.fillStyle=k===2?'#d8d8dc':'#ffffff';c.fillText(s,0,120);c.shadowBlur=0;
  c.globalCompositeOperation='screen';c.globalAlpha=fade*.5;c.fillStyle='#ff2a3a';c.fillText(s,-8,120);c.restore();}

/* ================= фаза 2: 06:00, синий ================= */
const O2={clk:{id:'clk2',x:0,y:0,w:CLK.w,h:CLK.h,rot:.06,ti:-9,fall:.1,cv:clockCase,r:34,over:c=>clockOver(c,0,[0,'06','00'])},
  cork:{id:'cork2',x:330,y:250,w:CORK.w,h:CORK.h,rot:2.4,ti:-9,fall:.1,cv:corkCv,r:50},
  r1:{id:'r12',x:-420,y:-150,w:RCP.w,h:900,rot:-.5,ti:-9,fall:.1,cv:()=>rcpCv(1,R1,900)},
  bro:{id:'bro',x:0,y:-1500,w:BRO.w,h:BRO.h,rot:-.05,ti:17.0,fall:.42,cv:broCv,lift:.08,fx:0,fy:-520,spin:0,bnc:0,shk:0,dust:.3,over:stampOver('chem',17.55,BRO.w/2+10,BRO.h*.42,-.2,[['SECRET',40],['CHEMICAL WEAPONS',54],['TEST SITE',66]],620,270,9)},
  let:{id:'let2',x:0,y:-3000,w:LET.w,h:LET.h,rot:-.03,ti:-9,fall:.1,cv:letterCv,over:(c,t)=>{letterOver(c,99);stampOver('fired',19.15,LET.w/2,LET.h*.46,-.24,[['FIRED',170]],560,250,3)(c,t);}},
  ph:{id:'ph',x:0,y:-4500,w:PHN.w,h:PHN.h,rot:.08,ti:-9,fall:.1,cv:phoneCv,r:66,over:(c,t)=>phoneScreen(c,t)}};
function stampOver(key,t0,cx,cy,rot,lines,w,h,seed){return (c,t)=>{const d=t-t0;if(d<0)return;const s=1+.5*Math.exp(-d/.045)*(d<.12?1:0),a=cl(d/.03);const cv=stampCv(key,lines,w,h,'#c8222c',seed);
  c.save();c.translate(cx,cy);c.rotate(rot);c.scale(s,s);c.globalAlpha=.88*a;c.globalCompositeOperation='multiply';c.drawImage(cv,-w/2,-h/2,w,h);c.restore();};}
const SH2=[[15.56,'clk',{x:0,y:30,z:1.62,r:.0},{x:-10,y:20,z:1.78,r:.02}],[17.0,'bro',{x:0,y:-1460,z:1.0,r:-.02},{x:0,y:-1480,z:1.1,r:-.03}],
  [18.9,'let',{x:10,y:-3000,z:.93,r:.0},{x:8,y:-3005,z:1.0,r:.01}],[20.0,'ph',{x:0,y:-4470,z:1.2,r:.02},{x:0,y:-4480,z:1.32,r:.03}]];
function phase2(c,t){let k=0;while(k<SH2.length-1&&t>=SH2[k+1][0])k++;const [a,key,A,B]=SH2[k],b=k+1<SH2.length?SH2[k+1][0]:P2E,u=(t-a)/(b-a),K=camLerp(A,B,eio(u));
  K.y+=UP/K.z;const L=key==='clk'?[O2.r1,O2.clk,O2.cork]:[O2[key]];const [sx,sy]=key==='bro'||key==='let'?shake2(t):[0,0];K.x+=sx/K.z;K.y+=sy/K.z;
  scene(c,K,t,L,['multiply','#7f93b0',.6]);
  light(c,540,800,1250,LBLUE,['rgba(170,200,255,1)',.06]);blinds(c,t,.09);
  if(key==='ph'){const p=SCR;c.save();camApply(c,K);c.translate(O2.ph.x,O2.ph.y);c.rotate(O2.ph.rot);c.globalCompositeOperation='screen';c.fillStyle=RG(c,0,0,0,620,[[0,'rgba(120,150,210,.22)'],[1,'rgba(0,0,0,0)']]);c.fillRect(-700,-700,1400,1400);c.restore();}}
function shake2(t){let sx=0,sy=0;for(const t0 of [17.55,19.15]){const d=t-t0;if(d>=0&&d<.25){const k=(1-d/.25)**2*14;sx+=n1(t*47)*k;sy+=n1(t*53+7)*k;}}return [sx,sy];}

/* ================= «город»: фото Москвы гаснет ================= */
function phaseCity(c,t){const u=(t-P2E)/(PCE-P2E),K={x:-20,y:40,z:lp(1.14,1.36,eio(u)),r:lp(.04,.06,u)};K.y+=UP/K.z;
  const o={id:'satc',x:0,y:0,w:SATP.w,h:SATP.h,rot:.08,ti:-9,fall:.1,cv:()=>satCv(0)},od={...o,id:'satcd',cv:()=>satCv(1),sh:0};
  c.save();camApply(c,K);table(c,K,['multiply','#7f93b0',.6]);objDraw(c,o,t);const k=ss(23.55,24.4,t);if(k>0){c.save();c.globalAlpha=k;objDraw(c,od,t);c.restore();}c.restore();
  light(c,540,800,1200,LBLUE);blinds(c,t,.07);}

/* ================= финал: SOULLESS → SOUL / LESS ================= */
const SPL=25.75;
function phase3(c,t){const u=(t-PCE)/(TEND-PCE),K={x:0,y:0,z:lp(.86,.96,eio(u)),r:lp(-.02,0,u)};const [sx,sy]=(()=>{const d=t-(PCE+.4);if(d>=0&&d<.3){const k=(1-d/.3)**2*22;return [n1(t*47)*k,n1(t*53+7)*k];}const d2=t-SPL;if(d2>=0&&d2<.3){const k=(1-d2/.3)**2*12;return [n1(t*41)*k,n1(t*37+3)*k];}return [0,0];})();
  K.x+=sx/K.z;K.y+=sy/K.z+UP/K.z;
  const o={id:'soul',x:0,y:0,w:SOUL.w,h:SOUL.h,rot:-.03,ti:PCE+.4,fall:.4,cv:soulCv,r:14,lift:.7,spin:.15,shk:0,dust:1.2};
  c.save();camApply(c,K);table(c,K,['multiply','#5a4a3a',.5]);
  const sp=ss(SPL,SPL+.5,t);
  if(sp<=0){objDraw(c,o,t);puffs(c,o,t);}
  else{const cv=soulCv(),cut=SOUL.cut;for(const side of [0,1]){const dx=(side?1:-1)*46*sp,dy=(side?1:-1)*20*sp,dr=(side?1:-1)*.045*sp;
      c.save();c.translate(o.x+dx,o.y+dy);c.rotate(o.rot+dr);const x0=side?cut:0,x1=side?SOUL.w:cut;
      c.save();c.translate(8,12);c.globalAlpha=.6;c.filter='blur(10px)';c.fillStyle='#000';c.fillRect(-SOUL.w/2+x0,-SOUL.h/2,x1-x0,SOUL.h);c.restore();
      c.beginPath();c.rect(-SOUL.w/2+x0,-SOUL.h/2,x1-x0,SOUL.h);c.clip();c.drawImage(cv,-SOUL.w/2,-SOUL.h/2,SOUL.w,SOUL.h);c.restore();}
    puffs(c,o,t);}
  c.restore();
  light(c,540,810,1000,[[0,'#dcc39c'],[.3,'#a08259'],[.62,'#2a1d10'],[1,'#000']],['rgba(255,220,150,1)',.05]);
  // луч режет карточку
  const bk=(t-(SPL-.32))/.36;if(bk>0&&bk<1.6){const a=bk<1?1:1-(bk-1)/.6,yy=lp(560,1100,eio(cl(bk)));const p=K;const sx2=WW/2+(SOUL.cut-SOUL.w/2)*p.z*Math.cos(p.r),c0=c;
    c0.save();reset(c0);c0.globalCompositeOperation='screen';c0.globalAlpha=a;c0.fillStyle=LG(c0,sx2-30,0,sx2+30,0,[[0,'rgba(255,240,200,0)'],[.5,'rgba(255,250,235,1)'],[1,'rgba(255,240,200,0)']]);c0.fillRect(sx2-30,520,60,yy-520);
    glowDot(c0,sx2,yy,120,'#fff1c8',1.2);c0.restore();}
  bloom(c,c.canvas,.12);}

/* ================= титры ================= */
const CAP=[
  [tb(2.5),tb(5),['You’re *29.*']],
  [tb(5),tb(6),['Five zeros a year.',['In *euros.*',tb(5.6)]]],
  [tb(6),tb(8),['Moscow is *yours.*']],
  [tb(8),tb(10),['Top manager.',['Russian–French *bank.*',tb(8.6)]]],
  [tb(10),tb(12),['One *signature* —']],
  [tb(12),tb(14),['a loan for',['*“Millionaires’ Paradise.”*',tb(12.3)]]],
  [tb(14),tb(16),['Every door *opens*']],
  [tb(16),tb(18),['before you *knock.*']],
  [tb(18),tb(20),['Champagne at *3 a.m.*']],
  [tb(20),tb(22),['Everyone wants *your table.*']],
  [tb(25),P1E,['Nobody knows *you.*']],
  [P1E,17.0,['*6:00* a.m.']],
  [17.0,18.9,['“Paradise”?',['A secret *chemical weapons* test site.',17.55]]],
  [18.9,20.0,['You’re *fired.*']],
  [20.0,21.15,['You call everyone.']],
  [21.15,P2E,['Nobody wants to *talk.*']],
  [P2E,23.6,['You didn’t win the city.']],
  [23.6,PCE,['It *bought* you.']],
  [26.0,27.4,['This is *“Soulless”* (2012).']],
  [27.4,TEND+1,['Now tell me —']],
];
function richW(c,s){let w=0;for(const p of s.split('*'))w+=c.measureText(p).width;return w;}
function richDraw(c,s,x,y,col,acc){let xx=x;s.split('*').forEach((p,i)=>{c.fillStyle=i%2?acc:col;c.fillText(p,xx,y);xx+=c.measureText(p).width;});}
function captions(c,t){for(const [a,b,L] of CAP){if(t<a||t>=b)continue;const acc=t<P1E?'#f3c868':t<PCE?'#ff4d48':'#f3c868';
  const lines=L.map(l=>Array.isArray(l)?l:[l,a]),n=lines.length;c.save();reset(c);font(c,{f:'P',w:700,s:76,it:1});c.textAlign='left';c.textBaseline='alphabetic';
  for(let i=0;i<n;i++){const [s,ta]=lines[i];if(t<ta)continue;const e=eo((t-ta)/.22),y=1405+(i-(n-1)/2)*92+(1-e)*24;let w=richW(c,s);const sc=Math.min(1,860/w);
    c.save();c.translate(540,y);c.scale(sc,sc);c.globalAlpha=e;
    c.fillStyle=RG(c,0,-26,0,w*.62,[[0,'rgba(0,0,0,.5)'],[1,'rgba(0,0,0,0)']]);c.save();c.scale(1,.32);c.fillRect(-w*.7,-260,w*1.4,520);c.restore();
    c.shadowColor='rgba(0,0,0,.85)';c.shadowBlur=22;c.shadowOffsetY=3;richDraw(c,s,-w/2,0,'#f7f3ea',acc);c.restore();}
  c.restore();}}
function hook(c,t){if(t>=tb(2.5))return;const a=1-ss(tb(2.1),tb(2.5),t),d=t-T0,pop=d<0?1.12:1+.12*Math.exp(-d/.07);
  c.save();reset(c);c.globalAlpha=a;c.fillStyle=LG(c,0,80,0,560,[[0,'rgba(0,0,0,.7)'],[.7,'rgba(0,0,0,.45)'],[1,'rgba(0,0,0,0)']]);c.fillRect(0,80,WW,480);
  c.translate(540,300);c.scale(pop,pop);c.textAlign='center';c.textBaseline='alphabetic';c.shadowColor='rgba(0,0,0,.9)';c.shadowBlur=34;
  font(c,{f:'O',w:700,s:104,ls:10});c.fillStyle='#f4efe4';c.fillText('WOULD YOU',0,-75);font(c,{f:'O',w:700,s:196,ls:6});c.fillStyle='#f3c868';c.fillText('SIGN?',0,105);c.restore();}

/* ================= кадр ================= */
CLIP.init=async function(){CEN=await (await fetch('/a/sat/centers.json')).json();SAT=await loadImg('/a/sat/n15.jpg');
  tableTile();paperTile();letterCv();agrCv();buildCK1();};
CLIP.draw=function(c,t,i){t=t%TEND;c.fillStyle='#000';c.fillRect(0,0,WW,HH);
  if(t<P1E){phase1(c,t);if(t>=tb(18))bloom(c,c.canvas,.22);bigWords(c,t);hook(c,t);}
  else if(t<P2E)phase2(c,t);else if(t<PCE)phaseCity(c,t);else phase3(c,t);
  captions(c,t);
  vignette(c,.55);grain(c,i,.07);};
window.DLX7={TEND,BEAT,T0,P1E,P2E,PCE,SPL,tb};
