/* «Духless» EN · мой вариант (26.11): игрушечный бумажный театр на three.js, ~55 с, без голоса.
   Одна сцена с порталом и занавесом; декорации — плоские бумажные вырезки с белой кромкой, выезжают из кулис и опускаются сверху,
   свет — один ведущий прожектор с мягкими тенями на заднике (как в театре теней), без блеска, фигурок и рук.
   Референсы пульта: x4b47x-034026 (театр теней из бумаги 9:16), lemo halftone-dossier, visual-investigation, briefing-board, spy-titles.
   Сюжет — по субтитрам фильма: Макс, 29, топ-менеджер русско-французского банка «Мегаполис», пять нулей в евро,
   кредит на посёлок «Рай миллионеров» (бывший полигон химоружия) → уволен; клуб с другом — «там нет клуба»; акция активистов
   «Каждый день вы смываете свою жизнь в унитаз»; друзья не берут трубку; Юля: «Можешь забрать меня?» — «Я буду там».
   Имя героя — Макс Андреев (Данила Козловский). Рендер: N=1650 P10A=<папка с mv/> node render.mjs dlx6c - out.mp4 */
(function(){'use strict';
CLIP.fonts=['900 120px Mont','800 90px Mont','700 60px JBM','800 54px JBM','700 90px Play','italic 700 80px Play','700 80px Osw','600 40px Man'];
const T3=THREE,TEND=55.0;
let R,GL,SC,CAM,KEY,RIM,HEMI;
const SETS=[];

/* ---------- бумага ---------- */
let GRN=null;
function grainCv(){if(GRN)return GRN;GRN=mk(256,256);const g=GRN.getContext('2d'),d=g.createImageData(256,256),r=rng(17);
  for(let i=0;i<d.data.length;i+=4){const v=r()<.5?255:0;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=(r()*26)|0;}g.putImageData(d,0,0);
  g.globalAlpha=.08;g.strokeStyle='#7a6a50';for(let i=0;i<60;i++){g.beginPath();const x=r()*256,y=r()*256;g.moveTo(x,y);g.lineTo(x+r()*30-15,y+r()*30-15);g.stroke();}return GRN;}
function paperize(g,w,h,a=1){g.save();g.globalCompositeOperation='source-atop';g.globalAlpha=a;g.fillStyle=g.createPattern(grainCv(),'repeat');g.fillRect(0,0,w,h);g.restore();}
function ftex(cv){const t=new T3.CanvasTexture(cv);t.encoding=T3.sRGBEncoding;t.anisotropy=8;return t;}
// плоская вырезка: w×h в единицах сцены, draw(g,W,H,u) рисует в пикселях (u — пикселей на единицу)
function flat(w,h,draw,o={}){const u=o.px||300,cv=mk(Math.round(w*u),Math.round(h*u)),g=cv.getContext('2d');draw(g,cv.width,cv.height,u);if(o.paper!==false)paperize(g,cv.width,cv.height);
  const tex=ftex(cv),M=o.basic?new T3.MeshBasicMaterial({map:tex,alphaTest:o.transparent?0:.4,side:T3.DoubleSide,transparent:!!o.transparent,depthWrite:!o.transparent,blending:o.add?T3.AdditiveBlending:T3.NormalBlending}):
    new T3.MeshLambertMaterial({map:tex,alphaTest:.4,side:o.side||T3.DoubleSide,emissive:o.em?0xffffff:0x000000,emissiveMap:o.em?ftex(o.em(cv)):null,emissiveIntensity:o.ei??1});
  const m=new T3.Mesh(new T3.PlaneGeometry(w,h),M);m.castShadow=o.cast!==false&&!o.basic;m.receiveShadow=!o.basic;
  if(!o.basic)m.customDepthMaterial=new T3.MeshDepthMaterial({depthPacking:T3.RGBADepthPacking,map:tex,alphaTest:.4});
  m.userData={cv,g,tex,draw,u};return m;}
function redraw(m,fn){const {cv,g,tex,u}=m.userData;g.clearRect(0,0,cv.width,cv.height);fn(g,cv.width,cv.height,u);paperize(g,cv.width,cv.height);tex.needsUpdate=true;}
// вырезка по контуру с белой кромкой
function cut(g,path,fill,edge='#f2ead8',ew=10){g.save();g.lineJoin='round';g.lineCap='round';path(g);g.strokeStyle=edge;g.lineWidth=ew*2;g.stroke();g.fillStyle=edge;g.fill();path(g);g.fillStyle=fill;g.fill();g.restore();}
const box=(x,y,w,h)=>g=>{g.beginPath();g.rect(x,y,w,h);};
function txc(g,s,x,y,f,col,al='center',ls=0){g.save();g.font=f;g.letterSpacing=ls+'px';g.textAlign=al;g.textBaseline='alphabetic';g.fillStyle=col;g.fillText(s,x,y);g.restore();}
function halftoneRect(g,x0,y0,w,h,cell,fn,ink){g.fillStyle=ink;for(let y=y0;y<y0+h;y+=cell)for(let x=x0;x<x0+w;x+=cell){const v=fn((x-x0)/w,(y-y0)/h);const r=cell*.55*Math.sqrt(cl(v));if(r>.3){g.beginPath();g.arc(x+cell/2,y+cell/2,r,0,TAU);g.fill();}}}
function addTo(grp,m,x,y,z,ry=0,rx=0){m.position.set(x,y,z);m.rotation.y=ry;m.rotation.x=rx;grp.add(m);return m;}

/* ---------- театр: пол, портал, занавес ---------- */
let CURL,CURR,ARCH;
function buildTheatre(){
  const floor=flat(7,5,(g,W,H)=>{g.fillStyle='#3a2a1c';g.fillRect(0,0,W,H);const r=rng(3);for(let i=0;i<14;i++){g.fillStyle=`rgba(${60+r()*30},${40+r()*20},${24+r()*10},.9)`;g.fillRect(i*W/14+2,0,W/14-4,H);}
    g.fillStyle='rgba(0,0,0,.25)';for(let i=0;i<14;i++)g.fillRect(i*W/14,0,3,H);},{px:120,cast:false});
  floor.rotation.x=-Math.PI/2;floor.position.set(0,0,0);SC.add(floor);
  // задняя стена за всеми задниками
  const wall=new T3.Mesh(new T3.PlaneGeometry(14,10),new T3.MeshLambertMaterial({color:0x0b0a0d}));wall.position.set(0,4,-3.2);wall.receiveShadow=true;SC.add(wall);
  // портал
  ARCH=flat(5.6,6.4,(g,W,H,u)=>{g.fillStyle='#1a0d10';g.fillRect(0,0,W,H);
    const ox=W/2,oy=H*.92,hw=1.2*u,top=H*.92-4.6*u;g.save();g.globalCompositeOperation='destination-out';g.beginPath();g.moveTo(ox-hw,oy);g.lineTo(ox-hw,top+.6*u);g.quadraticCurveTo(ox,top-.35*u,ox+hw,top+.6*u);g.lineTo(ox+hw,oy);g.closePath();g.fill();g.restore();
    g.strokeStyle='#c9a24e';g.lineWidth=.07*u;g.beginPath();g.moveTo(ox-hw-.06*u,oy);g.lineTo(ox-hw-.06*u,top+.6*u);g.quadraticCurveTo(ox,top-.43*u,ox+hw+.06*u,top+.6*u);g.lineTo(ox+hw+.06*u,oy);g.stroke();
    g.fillStyle='#c9a24e';for(let i=0;i<9;i++){const a=Math.PI*(.15+.7*i/8);g.beginPath();g.arc(ox+Math.cos(a)*1.6*u,top-.05*u-Math.sin(a)*.25*u+.35*u,.07*u,0,TAU);g.fill();}
    txc(g,'TEATRO · MOSCOW',ox,top-.02*u,`700 ${.17*u}px JBM`,'#c9a24e','center',.04*u);
    g.fillStyle='#2a1218';g.fillRect(0,oy,W,H-oy);g.fillStyle='#c9a24e';g.fillRect(0,oy,W,.04*u);},{px:220,cast:false});
  ARCH.position.set(0,6.4/2-.45,2.0);SC.add(ARCH);
  // занавес: две половины
  const curtain=side=>flat(1.75,5.1,(g,W,H,u)=>{const r=rng(side>0?5:9);g.fillStyle='#6d0f18';g.fillRect(0,0,W,H);
    for(let i=0;i<9;i++){const x=i/8*W;g.fillStyle=LG(g,x-W/16,0,x+W/16,0,[[0,'rgba(0,0,0,.35)'],[.5,'rgba(255,120,120,.18)'],[1,'rgba(0,0,0,.35)']]);g.fillRect(x-W/16,0,W/8,H);}
    g.fillStyle='#c9a24e';for(let x=0;x<W;x+=.12*u){g.beginPath();g.moveTo(x,H-.02*u);g.lineTo(x+.06*u,H-.13*u);g.lineTo(x+.12*u,H-.02*u);g.fill();}},{px:160});
  CURL=curtain(-1);CURR=curtain(1);CURL.position.set(-2.4,2.55,1.75);CURR.position.set(2.4,2.55,1.75);SC.add(CURL,CURR);
  // рампа: маленькие лампочки
  for(let i=0;i<9;i++){const b=flat(.14,.14,(g,W,H)=>{g.fillStyle=RG(g,W/2,H/2,0,W/2,[[0,'#fff6d8'],[.5,'rgba(255,200,120,.8)'],[1,'rgba(255,170,80,0)']]);g.fillRect(0,0,W,H);},{px:200,basic:true,transparent:true,add:true,paper:false});b.position.set(-1.6+i*.4,.08,1.9);SC.add(b);}
}

/* ---------- декорации ---------- */
// сет: группа + когда въезжает/уезжает и откуда
function set(name,inT,outT,mode='right'){const g=new T3.Group();g.name=name;SC.add(g);const S={g,inT,outT,mode,parts:{}};SETS.push(S);return S;}
function setPose(S,t){const [a0,a1]=S.inT,[b0,b1]=S.outT,ki=eio(cl((t-a0)/(a1-a0))),ko=eio(cl((t-b0)/(b1-b0)));const g=S.g;
  g.visible=t>a0-.01&&t<b1+.01;let x=0,y=0;
  if(S.mode==='right'){x=lp(4.6,0,ki)+lp(0,-4.6,ko);}else if(S.mode==='left'){x=lp(-4.6,0,ki)+lp(0,4.6,ko);}else if(S.mode==='top'){y=lp(6.5,0,ki)+lp(0,6.5,ko);}else if(S.mode==='fade'){}
  g.position.set(x,y,0);}

let PHOTO,DOSB,REDACT,SIGN,PEN,STAMP,BILL,HAZ,DOOR,ROPE,BOUN,PHONE,SOUL,LESS,TITLE,COUNTER=[],CONF=[],FLY=[],MOON,NEON,DESK,DOS2,RED2,GLASSES=[];
let FRZ=null,MV0=null;
function buildSets(){
  /* S1: фото из карусели → оборот: досье */
  const s1=set('photo',[-1,0],[8.6,9.3],'right');
  const bk1=flat(4.4,5.6,(g,W,H,u)=>{g.fillStyle=LG(g,0,0,0,H,[[0,'#0b1430'],[1,'#1e2c52']]);g.fillRect(0,0,W,H);const r=rng(4);g.fillStyle='#f2ead8';for(let i=0;i<70;i++){g.globalAlpha=.3+r()*.7;g.beginPath();g.arc(r()*W,r()*H*.7,1+r()*3,0,TAU);g.fill();}g.globalAlpha=1;},{px:160,cast:false});
  addTo(s1.g,bk1,0,2.6,-2.2);
  PHOTO=new T3.Group();const front=flat(1.6,2.844,(g,W,H)=>{g.fillStyle='#fff';g.fillRect(0,0,W,H);g.drawImage(FRZ,0,0,W,H);},{px:675,paper:false,side:T3.FrontSide});
  DOSB=flat(1.6,2.844,(g,W,H,u)=>dossier(g,W,H,u,false),{px:500,side:T3.FrontSide});DOSB.rotation.y=Math.PI;DOSB.position.z=-.004;
  PHOTO.add(front,DOSB);PHOTO.position.set(0,2.42,.8);s1.g.add(PHOTO);
  const easel=flat(.9,1.2,(g,W,H)=>{g.strokeStyle='#3b2a1a';g.lineWidth=18;g.beginPath();g.moveTo(W*.2,H);g.lineTo(W*.5,0);g.lineTo(W*.8,H);g.stroke();},{px:200});addTo(s1.g,easel,0,.6,.55);

  /* S2: Москва-Сити слоями, банк, пять нулей */
  const s2=set('city',[8.6,9.3],[14.8,15.5],'right');
  addTo(s2.g,flat(4.6,5.8,(g,W,H)=>{g.fillStyle=LG(g,0,0,0,H,[[0,'#05081a'],[.7,'#14214a'],[1,'#2b3c70']]);g.fillRect(0,0,W,H);const r=rng(6);g.fillStyle='#f2ead8';for(let i=0;i<60;i++){g.globalAlpha=.25+r()*.6;g.beginPath();g.arc(r()*W,r()*H*.6,1+r()*2.5,0,TAU);g.fill();}g.globalAlpha=1;},{px:150,cast:false}),0,2.7,-2.4);
  MOON=flat(.7,.7,(g,W,H)=>{cut(g,x=>{x.beginPath();x.arc(W/2,H/2,W*.42,0,TAU);},'#f1e3b8');g.save();g.globalCompositeOperation='destination-out';g.beginPath();g.arc(W*.66,H*.38,W*.34,0,TAU);g.fill();g.restore();},{px:300});
  addTo(s2.g,MOON,1.0,4.3,-1.6);
  const thr=new T3.Mesh(new T3.PlaneGeometry(.008,2),new T3.MeshBasicMaterial({color:0xcfc6b0}));thr.position.set(1.0,5.6,-1.6);s2.g.add(thr);
  const towers=(seed,col,win,hMin,hMax,spire)=> (g,W,H,u)=>{const r=rng(seed);let x=0;while(x<W){const bw=(.25+r()*.4)*u,bh=(hMin+r()*(hMax-hMin))*u,y=H-bh;
      cut(g,q=>{q.beginPath();q.moveTo(x,H);q.lineTo(x,y+(spire?.12*u:0));if(spire&&r()<.6){q.lineTo(x+bw/2,y-.25*u);}q.lineTo(x+bw,y+(spire?.12*u:0));q.lineTo(x+bw,H);q.closePath();},col,'#f2ead8',3);
      g.fillStyle=win;for(let yy=y+.2*u;yy<H-.1*u;yy+=.09*u)for(let xx=x+.05*u;xx<x+bw-.05*u;xx+=.07*u)if(r()<.38)g.fillRect(xx,yy,.035*u,.045*u);x+=bw+r()*.05*u;}};
  const winEm=col=>cv=>{const e=mk(cv.width,cv.height),q=e.getContext('2d'),d=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data,im=q.createImageData(cv.width,cv.height);
    for(let i=0;i<d.length;i+=4){const warm=d[i]>200&&d[i+1]>150&&d[i+2]<170;if(warm){im.data[i]=255;im.data[i+1]=200;im.data[i+2]=120;im.data[i+3]=255;}else im.data[i+3]=255;}q.putImageData(im,0,0);return e;};
  addTo(s2.g,flat(4.6,3.2,towers(11,'#1b2547','#ffd27a',1.2,2.9,true),{px:160,em:winEm(),ei:.8}),0,1.6,-1.9);
  addTo(s2.g,flat(4.2,2.6,towers(12,'#26304f','#ffcf86',.8,2.2,true),{px:180,em:winEm(),ei:.9}),.2,1.3,-1.1);
  // фасад банка
  const bank=flat(2.6,2.0,(g,W,H,u)=>{cut(g,q=>{q.beginPath();q.rect(.08*u,.35*u,W-.16*u,H-.35*u);},'#d9d2c2');
    g.fillStyle='#a79e8a';for(let i=0;i<6;i++)g.fillRect(.25*u+i*.4*u,.75*u,.14*u,H-.8*u);g.fillStyle='#14213d';g.fillRect(.08*u,.35*u,W-.16*u,.36*u);
    txc(g,'MEGAPOLIS',W/2,.62*u,`700 ${.26*u}px Osw`,'#f3d27a','center',.05*u);txc(g,'BANK · RU / FR',W/2,1.02*u,`700 ${.11*u}px JBM`,'#3a3630','center',.02*u);},{px:220});
  addTo(s2.g,bank,-.6,1.0,-.2);
  // пять нулей: «€» и пять дисков на стойках
  for(let i=0;i<6;i++){const gold=i===0,dw=.38,z=flat(dw,1.6,(g,W,H)=>{g.fillStyle='#d8cfb8';g.fillRect(W/2-1.5,0,3,H-W*.9);cut(g,q=>{q.beginPath();q.arc(W/2,H-W*.5,W*.44,0,TAU);},gold?'#c9a24e':'#f1e3b8');
      txc(g,gold?'€':'0',W/2,H-W*.5+W*.22,gold?`700 ${W*.6}px Play`:`900 ${W*.6}px Mont`,'#2a1a08');},{px:300});
    z.userData.k={i,x:-1.05+i*.42};addTo(s2.g,z,-1.05+i*.42,6.5,.5);COUNTER.push(z);}

  /* S3: сделка — щит «Рай миллионеров», стол, договор, ручка (без руки) */
  const s3=set('deal',[14.8,15.5],[20.6,21.3],'top');
  addTo(s3.g,flat(4.6,5.8,(g,W,H)=>{g.fillStyle=LG(g,0,0,0,H,[[0,'#8fb7d6'],[.65,'#e7dcc0'],[1,'#d1c29b']]);g.fillRect(0,0,W,H);
    const r=rng(8);g.fillStyle='rgba(255,255,255,.8)';for(let i=0;i<6;i++){const x=r()*W,y=r()*H*.4;for(let j=0;j<4;j++){g.beginPath();g.arc(x+j*40,y+(j%2)*10,34,0,TAU);g.fill();}}},{px:150,cast:false}),0,2.7,-2.4);
  BILL=new T3.Group();const billF=flat(2.9,1.7,(g,W,H,u)=>billboard(g,W,H,u),{px:260,side:T3.FrontSide});
  HAZ=flat(2.9,1.7,(g,W,H,u)=>hazard(g,W,H,u),{px:260,side:T3.FrontSide});HAZ.rotation.x=Math.PI;HAZ.position.z=-.004;
  BILL.add(billF,HAZ);BILL.position.set(0,3.25,-1.2);s3.g.add(BILL);
  addTo(s3.g,flat(.12,2.4,(g,W,H)=>{g.fillStyle='#3b2a1a';g.fillRect(0,0,W,H);},{px:200}),-.9,1.2,-1.25);addTo(s3.g,flat(.12,2.4,(g,W,H)=>{g.fillStyle='#3b2a1a';g.fillRect(0,0,W,H);},{px:200}),.9,1.2,-1.25);
  DESK=new T3.Group();DESK.position.set(0,.9,.9);s3.g.add(DESK);
  const top=flat(2.6,1.1,(g,W,H)=>{g.fillStyle='#4a2c18';g.fillRect(0,0,W,H);const r=rng(21);for(let i=0;i<40;i++){g.fillStyle=`rgba(${80+r()*30},${46+r()*16},${24},.5)`;g.fillRect(0,r()*H,W,2+r()*5);}},{px:200,cast:false});
  top.rotation.x=-Math.PI/2+.42;DESK.add(top);
  const front3=flat(2.6,.9,(g,W,H)=>{g.fillStyle='#3a2212';g.fillRect(0,0,W,H);g.fillStyle='rgba(0,0,0,.3)';g.fillRect(0,0,W,6);},{px:200});front3.position.set(0,-.674,.50);DESK.add(front3);
  SIGN=flat(1.0,1.36,(g,W,H,u)=>contract(g,W,H,u,0,0),{px:600});SIGN.rotation.x=-Math.PI/2+.42;SIGN.position.set(-.15,.02,.02);SIGN.rotation.z=.05;DESK.add(SIGN);
  PEN=flat(.95,.09,(g,W,H)=>{g.fillStyle=LG(g,0,0,0,H,[[0,'#2b2b33'],[.5,'#5a5a66'],[1,'#121217']]);g.beginPath();g.moveTo(0,H/2);g.lineTo(H*1.6,0);g.lineTo(W,0);g.lineTo(W,H);g.lineTo(H*1.6,H);g.closePath();g.fill();g.fillStyle='#d7b766';g.fillRect(W*.35,0,W*.05,H);g.fillRect(W*.9,0,W*.03,H);},{px:500});
  PEN.rotation.x=-Math.PI/2+.42;DESK.add(PEN);

  /* S4: клуб — дверь, вышибалы-силуэты, канат, неон, конфетти, бокалы */
  const s4=set('club',[20.6,21.3],[28.6,29.3],'right');
  addTo(s4.g,flat(4.6,5.8,(g,W,H)=>{g.fillStyle='#08060c';g.fillRect(0,0,W,H);g.fillStyle='#120c18';for(let y=0;y<H;y+=40)for(let x=(y/40%2)*40;x<W;x+=80)g.fillRect(x+2,y+2,76,36);},{px:150,cast:false}),0,2.7,-2.4);
  NEON=flat(1.6,.6,(g,W,H)=>{g.save();g.shadowColor='#ff3e9a';g.shadowBlur=30;g.font=`900 ${H*.62}px Mont`;g.textAlign='center';g.textBaseline='middle';g.strokeStyle='#ffd0ea';g.lineWidth=8;g.strokeText('VIP',W/2,H/2);g.restore();},{px:300,basic:true,transparent:true,add:true,paper:false});
  addTo(s4.g,NEON,0,4.15,-1.5);
  DOOR=new T3.Group();DOOR.position.set(0,0,-.9);s4.g.add(DOOR);
  const doorF=flat(1.5,2.6,(g,W,H,u)=>{cut(g,q=>{q.beginPath();q.rect(0,0,W,H);},'#2a1a22');g.save();g.globalCompositeOperation='destination-out';g.fillRect(.25*u,.35*u,W-.5*u,H-.35*u);g.restore();
    g.strokeStyle='#f2ead8';g.lineWidth=6;g.strokeRect(.25*u,.35*u,W-.5*u,H-.35*u+10);
    g.fillStyle='#c9a24e';g.fillRect(.2*u,.28*u,W-.4*u,.05*u);},{px:220});doorF.position.set(0,1.3,0);
  doorF.geometry.translate(0,1.3,0);doorF.position.set(0,0,0);DOOR.add(doorF);
  const glow=flat(1.0,2.25,(g,W,H)=>{g.fillStyle=LG(g,0,0,0,H,[[0,'#ffe3b0'],[1,'#ff9a50']]);g.fillRect(0,0,W,H);},{basic:true,paper:false,px:100});glow.geometry.translate(0,1.125,0);glow.position.set(0,0,-.05);DOOR.add(glow);
  const bouncer=flip=>flat(.9,2.2,(g,W,H,u)=>{const s=flip?-1:1;g.save();if(flip){g.translate(W,0);g.scale(-1,1);}
    g.fillStyle='#050407';g.beginPath();g.ellipse(W*.5,H*.14,W*.15,H*.085,0,0,TAU);g.fill();
    g.beginPath();g.moveTo(W*.08,H);g.lineTo(W*.06,H*.42);g.quadraticCurveTo(W*.08,H*.25,W*.3,H*.23);g.lineTo(W*.7,H*.23);g.quadraticCurveTo(W*.92,H*.25,W*.94,H*.42);g.lineTo(W*.92,H);g.closePath();g.fill();
    g.fillStyle='rgba(255,62,154,.55)';g.fillRect(W*.07,H*.4,3,H*.55);g.restore();},{px:240});
  BOUN=[bouncer(false),bouncer(true)];addTo(s4.g,BOUN[0],-1.0,1.1,-.4);addTo(s4.g,BOUN[1],1.0,1.1,-.4);
  for(const x of [-.75,.75])addTo(s4.g,flat(.12,.95,(g,W,H)=>{g.fillStyle=LG(g,0,0,W,0,[[0,'#6b4a12'],[.5,'#f2d684'],[1,'#6b4a12']]);g.fillRect(W*.25,H*.1,W*.5,H*.9);g.beginPath();g.arc(W/2,H*.1,W*.45,0,TAU);g.fill();},{px:300}),x,.48,.6);
  ROPE=flat(1.5,.36,(g,W,H)=>{g.strokeStyle='#7a0f1c';g.lineWidth=H*.22;g.lineCap='round';g.beginPath();g.moveTo(H*.15,H*.2);g.quadraticCurveTo(W/2,H*1.3,W-H*.15,H*.2);g.stroke();},{px:300});
  ROPE.geometry.translate(.75,0,0);addTo(s4.g,ROPE,-.75,.86,.6);
  for(let i=0;i<3;i++){const gl=flat(.42,.95,(g,W,H)=>{g.strokeStyle='#f2ead8';g.lineWidth=7;g.beginPath();g.moveTo(W*.2,4);g.lineTo(W*.25,H*.5);g.quadraticCurveTo(W*.5,H*.62,W*.75,H*.5);g.lineTo(W*.8,4);g.stroke();g.beginPath();g.moveTo(W*.5,H*.58);g.lineTo(W*.5,H*.92);g.moveTo(W*.25,H*.95);g.lineTo(W*.75,H*.95);g.stroke();
      g.fillStyle='rgba(243,210,122,.85)';g.beginPath();g.moveTo(W*.22,H*.18);g.lineTo(W*.25,H*.5);g.quadraticCurveTo(W*.5,H*.62,W*.75,H*.5);g.lineTo(W*.78,H*.18);g.fill();},{px:300});
    addTo(s4.g,gl,-.8+i*.8,-1.2,1.2);GLASSES.push(gl);}
  const r=rng(33),CC=['#ff3e9a','#2fe6ff','#f3d27a','#f2ead8'];
  for(let i=0;i<70;i++){const col=CC[i%4],p=flat(.06,.1,(g,W,H)=>{g.fillStyle=col;g.fillRect(0,0,W,H);},{px:200,paper:false,cast:false});p.userData.c={x:(r()-.5)*3.2,z:(r()-.5)*2-.2,s:.6+r()*.8,ph:r()*TAU,d:r()*1.2};p.visible=false;s4.g.add(p);CONF.push(p);}
  const plan=flat(1.5,1.1,(g,W,H,u)=>{g.fillStyle='#1f4f8a';g.fillRect(0,0,W,H);g.strokeStyle='rgba(220,235,255,.85)';g.lineWidth=3;g.strokeRect(.08*u,.08*u,W-.16*u,H-.16*u);
    g.strokeRect(.25*u,.35*u,.6*u,.45*u);g.strokeRect(.95*u,.35*u,.35*u,.25*u);g.beginPath();g.arc(1.12*u,.85*u,.12*u,0,TAU);g.stroke();txc(g,'YOUR CLUB',W/2,.25*u,`700 ${.12*u}px JBM`,'#e6f0ff','center',.02*u);txc(g,'50 / 50 · WITH A FRIEND',W/2,H-.13*u,`600 ${.07*u}px JBM`,'#e6f0ff');},{px:300});
  s4.parts.plan=addTo(s4.g,plan,0,5.6,.2);

  /* S5: акция активистов — баннер падает сверху, листовки */
  const s5=set('act',[28.6,29.3],[33.3,34.0],'right');
  addTo(s5.g,flat(4.6,5.8,(g,W,H)=>{g.fillStyle=LG(g,0,0,0,H,[[0,'#c9c7c2'],[1,'#8f8c86']]);g.fillRect(0,0,W,H);g.fillStyle='rgba(0,0,0,.08)';for(let y=0;y<H;y+=60)g.fillRect(0,y,W,3);},{px:150,cast:false}),0,2.7,-2.4);
  const ban=flat(2.7,1.6,(g,W,H,u)=>{cut(g,q=>{q.beginPath();q.moveTo(0,0);q.lineTo(W,0);q.lineTo(W,H*.9);q.lineTo(W*.75,H);q.lineTo(W*.5,H*.9);q.lineTo(W*.25,H);q.lineTo(0,H*.9);q.closePath();},'#f2efe6');
    const L=['EVERY DAY','YOU FLUSH','YOUR LIFE','DOWN THE','TOILET'];L.forEach((s,i)=>txc(g,s,W/2,(.32+i*.25)*u,`900 ${.2*u}px Mont`,i===2?'#c81e2a':'#16161a','center',.01*u));},{px:280});
  s5.parts.ban=addTo(s5.g,ban,0,3.2,-.6);
  for(let i=0;i<26;i++){const p=flat(.22,.3,(g,W,H)=>{g.fillStyle='#f2efe6';g.fillRect(0,0,W,H);g.fillStyle='#c81e2a';g.fillRect(W*.1,H*.1,W*.8,H*.12);g.fillStyle='rgba(20,20,20,.6)';for(let j=0;j<5;j++)g.fillRect(W*.1,H*(.32+j*.12),W*(.5+((i+j)%3)*.13),H*.05);},{px:260});
    const sd=i%2?1:-1,bh=i%3===0;p.userData.c={x:bh?(r()-.5)*2.4:sd*(1.05+r()*.6),z:bh?-1.1-r()*.4:(r()-.5)*1.2+.5,s:.5+r()*.6,ph:r()*TAU,d:r()*1.5};s5.g.add(p);FLY.push(p);}

  /* S6: развязка — тот же щит и стол (S3) и дверь клуба (S4) возвращаются; сами объекты — общие */
  /* S7: телефон в темноте */
  const s7=set('phone',[39.5,40.2],[47.0,47.6],'top');
  PHONE=flat(.95,1.9,(g,W,H,u)=>phoneDraw(g,W,H,u,'',''),{px:420,em:cv=>phoneEm(cv)});addTo(s7.g,PHONE,0,2.3,.4);
  addTo(s7.g,flat(.06,3,(g,W,H)=>{g.fillStyle='#3b2a1a';g.fillRect(0,0,W,H);},{px:200}),0,.0,.36);
  for(let i=0;i<40;i++){const p=flat(.012,.5,(g,W,H)=>{g.fillStyle='rgba(200,215,235,.7)';g.fillRect(0,0,W,H);},{px:200,basic:true,transparent:true,paper:false});p.userData.c={x:(r()-.5)*3.4,z:(r()-.5)*2,s:2.4+r(),ph:r()*6};s7.g.add(p);FLY.push(p);p.userData.rain=1;}

  /* S8: развязка — досье, лента, вывеска SOULLESS рвётся */
  const s8=set('rev',[47.0,47.7],[60,61],'right');
  addTo(s8.g,flat(4.6,5.8,(g,W,H)=>{g.fillStyle=LG(g,0,0,0,H,[[0,'#0b1430'],[1,'#1e2c52']]);g.fillRect(0,0,W,H);const r=rng(4);g.fillStyle='#f2ead8';for(let i=0;i<70;i++){g.globalAlpha=.3+r()*.7;g.beginPath();g.arc(r()*W,r()*H*.7,1+r()*3,0,TAU);g.fill();}g.globalAlpha=1;},{px:160,cast:false}),0,2.7,-2.2);
  DOS2=flat(1.6,2.2,(g,W,H,u)=>dossier(g,W,H,u,true),{px:500});addTo(s8.g,DOS2,-.15,1.55,.3,0,0);
  RED2=flat(1.05,.17,(g,W,H)=>{g.fillStyle='#0b0b0d';g.fillRect(0,0,W,H);g.fillStyle='rgba(255,255,255,.07)';g.fillRect(0,0,W,H*.3);},{px:500});RED2.geometry.translate(.525,0,0);addTo(s8.g,RED2,-.49,1.125,.31);
  TITLE=new T3.Group();TITLE.position.set(0,4.05,-.2);s8.g.add(TITLE);
  const tw=2.6,th=.7,tear=g=>{const r=rng(55),pts=[];for(let i=0;i<=12;i++)pts.push([.5+(r()-.5)*.06,i/12]);return pts;};const TP=tear();
  const half=(side)=>flat(tw/2+.1,th,(g,W,H,u)=>{const fullW=tw*u;g.save();if(side>0)g.translate(-(tw/2-.1)*u,0);
      g.beginPath();if(side<0){g.moveTo(0,0);for(const p of TP)g.lineTo(p[0]*fullW,p[1]*H);g.lineTo(0,H);}else{g.moveTo(fullW,0);for(const p of TP)g.lineTo(p[0]*fullW,p[1]*H);g.lineTo(fullW,H);}g.closePath();g.clip();
      g.fillStyle='#f1e7cf';g.fillRect(0,0,fullW,H);g.fillStyle='#c9a24e';g.fillRect(0,H*.08,fullW,H*.04);g.fillRect(0,H*.88,fullW,H*.04);
      txc(g,'SOULLESS',fullW/2,H*.73,`900 ${H*.58}px Mont`,'#1a1208','center',2);g.restore();},{px:400});
  SOUL=half(-1);LESS=half(1);SOUL.geometry.translate((tw/2+.1)/2,0,0);LESS.geometry.translate(-(tw/2+.1)/2,0,0);SOUL.position.x=-tw/2;LESS.position.x=tw/2;TITLE.add(SOUL,LESS);
  for(const x of [-1.1,1.1]){const s=new T3.Mesh(new T3.PlaneGeometry(.008,3),new T3.MeshBasicMaterial({color:0xcfc6b0}));s.position.set(x,1.85,0);TITLE.add(s);}
}

/* ---------- рисунки на бумаге ---------- */
function dossier(g,W,H,u,named){g.fillStyle='#ebe3cf';g.fillRect(0,0,W,H);g.fillStyle='#c8bfa8';g.fillRect(0,0,W,.06*u);
  txc(g,'CASE FILE',.12*u,.3*u,`800 ${.13*u}px JBM`,'#1c1c22','left',.02*u);g.fillStyle='#1c1c22';g.fillRect(.12*u,.36*u,W-.24*u,4);
  // «фото» в растре — силуэт без лица
  g.fillStyle='#d8cfb8';g.fillRect(.12*u,.5*u,.62*u,.78*u);halftoneRect(g,.12*u,.5*u,.62*u,.78*u,10,(x,y)=>{const dx=(x-.5)/.28,dy=(y-.36)/.22,head=dx*dx+dy*dy<1?.9:0,body=y>.62&&Math.abs(x-.5)<.42-(.9-y)*.2?.85:0;return Math.max(head,body,.08);},'#25252b');
  const rows=[['NAME',named?'MAX ANDREEV':''],['AGE','29'],['JOB','TOP MANAGER'],['BANK','MEGAPOLIS'],['CITY','MOSCOW 2012']];
  rows.forEach(([a,b],i)=>{const y=(1.55+i*.17)*u;txc(g,a,.12*u,y,`500 ${.07*u}px JBM`,'#6a645a','left',.01*u);txc(g,b,.5*u,y,`800 ${.085*u}px JBM`,'#16161c','left');});
  if(!named){g.fillStyle='#0b0b0d';g.fillRect(.48*u,1.47*u,.95*u,.11*u);}
  g.save();g.translate(1.18*u,.82*u);g.rotate(-.2);g.strokeStyle='#c81e2a';g.lineWidth=.02*u;RR(g,-.36*u,-.1*u,.72*u,.2*u,.02*u);g.stroke();txc(g,'CONFIDENTIAL',0,.035*u,`800 ${.075*u}px JBM`,'#c81e2a','center',.01*u);g.restore();}
function billboard(g,W,H,u){g.fillStyle='#f2efe6';g.fillRect(0,0,W,H);g.fillStyle=LG(g,0,0,0,H*.7,[[0,'#8ec6e8'],[1,'#dff0f7']]);g.fillRect(.06*u,.06*u,W-.12*u,H*.62);
  g.fillStyle='#f6d36a';g.beginPath();g.arc(W*.8,.38*u,.18*u,0,TAU);g.fill();g.fillStyle='#6aa35a';g.fillRect(.06*u,H*.55,W-.12*u,H*.13);
  for(let i=0;i<4;i++){const x=(.3+i*.65)*u,y=H*.56;g.fillStyle='#fdf8ee';g.fillRect(x,y-.28*u,.4*u,.28*u);g.fillStyle='#b5423a';g.beginPath();g.moveTo(x-.05*u,y-.28*u);g.lineTo(x+.2*u,y-.46*u);g.lineTo(x+.45*u,y-.28*u);g.fill();g.fillStyle='#7aa6c9';g.fillRect(x+.08*u,y-.2*u,.1*u,.08*u);}
  txc(g,"MILLIONAIRES'",W/2,H*.83,`900 ${.2*u}px Mont`,'#1a1208','center',.01*u);txc(g,'PARADISE',W/2,H*.96,`700 ${.15*u}px Play`,'#a8791f','center',.06*u);}
function hazard(g,W,H,u){g.fillStyle='#f0c419';g.fillRect(0,0,W,H);g.fillStyle='#16161a';for(let x=-H;x<W;x+=.3*u){g.beginPath();g.moveTo(x,0);g.lineTo(x+.15*u,0);g.lineTo(x+.15*u+H*.12,H*.12);g.lineTo(x+H*.12,H*.12);g.fill();g.beginPath();g.moveTo(x,H*.88);g.lineTo(x+.15*u,H*.88);g.lineTo(x+.15*u+H*.12,H);g.lineTo(x+H*.12,H);g.fill();}
  const cx=.62*u,cy=H/2,R=.34*u;g.fillStyle='#16161a';g.beginPath();g.arc(cx,cy,R,0,TAU);g.fill();g.fillStyle='#f0c419';for(let i=0;i<3;i++){g.beginPath();g.moveTo(cx,cy);g.arc(cx,cy,R*.88,-Math.PI/2+i*TAU/3-.5,-Math.PI/2+i*TAU/3+.5);g.closePath();g.fill();}
  g.fillStyle='#16161a';g.beginPath();g.arc(cx,cy,R*.22,0,TAU);g.fill();g.fillStyle='#f0c419';g.beginPath();g.arc(cx,cy,R*.12,0,TAU);g.fill();
  txc(g,'CHEMICAL',1.85*u,H*.42,`900 ${.2*u}px Mont`,'#16161a');txc(g,'WEAPONS',1.85*u,H*.58,`900 ${.2*u}px Mont`,'#16161a');txc(g,'TEST SITE',1.85*u,H*.74,`800 ${.13*u}px JBM`,'#16161a','center',.02*u);}
const SG=(()=>{const P=[];for(let i=0;i<=90;i++){const v=i/90;P.push([.12+.62*v,.0+Math.sin(v*TAU*2.4)*.035*Math.sin(v*Math.PI)+Math.sin(v*TAU*6)*.008]);}return P;})();
function contract(g,W,H,u,sk,fired){g.fillStyle='#f4efe2';g.fillRect(0,0,W,H);txc(g,'LOAN AGREEMENT',W/2,.16*u,`800 ${.075*u}px JBM`,'#1c1c22','center',.01*u);txc(g,"MILLIONAIRES' PARADISE",W/2,.26*u,`600 ${.05*u}px JBM`,'#6a645a','center',.01*u);
  const r=rng(41);g.fillStyle='rgba(40,40,40,.45)';for(let i=0;i<16;i++)g.fillRect(.1*u,(.38+i*.05)*u,(.45+r()*.35)*u,.012*u);
  g.fillStyle='rgba(30,30,30,.7)';g.fillRect(.1*u,1.15*u,.6*u,2);txc(g,'SIGNATURE',.1*u,1.21*u,`600 ${.035*u}px JBM`,'#6a645a','left');
  if(sk>0){g.strokeStyle='#14204a';g.lineWidth=.012*u;g.lineCap='round';g.lineJoin='round';g.beginPath();const n=Math.max(2,Math.floor(SG.length*sk));for(let i=0;i<n;i++){const x=SG[i][0]*u,y=(1.1+SG[i][1])*u;i?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();}
  if(fired>0){g.save();g.translate(W*.55,H*.55);g.rotate(-.3);g.globalAlpha=Math.min(1,fired);g.strokeStyle='#c81e2a';g.lineWidth=.025*u;RR(g,-.38*u,-.13*u,.76*u,.26*u,.03*u);g.stroke();txc(g,'FIRED',0,.07*u,`900 ${.18*u}px Mont`,'#c81e2a','center',.02*u);g.restore();}}
function sigTip(sk){const i=Math.min(SG.length-1,Math.floor(SG.length*sk));return SG[i];}
function phoneDraw(g,W,H,u,top,name,ring){cut(g,q=>{q.beginPath();q.roundRect(0,0,W,H,.12*u);},'#18181c','#f2ead8',8);g.fillStyle='#050507';g.beginPath();g.roundRect(.06*u,.12*u,W-.12*u,H-.3*u,.05*u);g.fill();
  if(name){txc(g,top,W/2,.55*u,`600 ${.07*u}px JBM`,top==='VOICEMAIL'||top==='DECLINED'?'#ff4b55':'#9aa0a8','center',.015*u);txc(g,name,W/2,.75*u,`800 ${.14*u}px Mont`,'#f2f2f2');
    g.fillStyle='#2a2b30';g.beginPath();g.arc(W/2,1.08*u,.17*u,0,TAU);g.fill();txc(g,name[0],W/2,1.14*u,`800 ${.16*u}px Mont`,'#bfc3c9');
    g.fillStyle=ring?'#2fbf5a':'#d42a32';g.beginPath();g.arc(W/2,1.45*u,.1*u,0,TAU);g.fill();}}
function phoneEm(cv){const e=mk(cv.width,cv.height),q=e.getContext('2d'),u=420;q.fillStyle='#000';q.fillRect(0,0,e.width,e.height);q.save();q.beginPath();q.roundRect(.06*u,.12*u,cv.width-.12*u,cv.height-.3*u,.05*u);q.clip();q.globalAlpha=.95;q.drawImage(cv,0,0);q.restore();return e;}

/* ---------- свет и камера по времени ---------- */
// ключи прожектора: t, позиция, цвет, сила, угол
const LK=[[0,[-1.5,6.5,6],'#ffe2b8',2.2,.55],[8.6,[-1.5,6.5,6],'#ffe2b8',2.2,.55],[9.4,[1.6,6.8,5.5],'#c9d8ff',1.6,.6],[14.8,[1.6,6.8,5.5],'#c9d8ff',1.6,.6],
  [15.5,[-2,7,5],'#fff1d6',2.4,.65],[20.6,[-2,7,5],'#fff1d6',2.4,.65],[21.3,[1.8,6.2,5],'#ff6fb8',3.2,.55],[28.6,[1.8,6.2,5],'#ff6fb8',3.2,.55],
  [29.3,[-1,7,6],'#ffffff',2.0,.7],[33.3,[-1,7,6],'#ffffff',2.0,.7],[34.0,[-2,7,5],'#ffd9a8',2.1,.6],[37.0,[-2,7,5],'#ffd9a8',2.1,.6],[37.6,[1.8,6.2,5],'#ff5fae',1.8,.55],
  [39.4,[1.8,6.2,5],'#ff5fae',1.2,.55],[40.2,[0,7,5],'#bcd0ff',1.6,.22],[43.4,[0,7,5],'#bcd0ff',1.4,.18],[44.6,[0,7,5],'#bcd0ff',.9,.14],[47.0,[0,7,5],'#bcd0ff',.9,.14],
  [47.8,[-1.4,6.6,6],'#ffe2b8',2.3,.55],[55,[-1.4,6.6,6],'#ffe2b8',2.3,.55]];
function lightAt(t){let i=0;while(i<LK.length-2&&t>=LK[i+1][0])i++;const a=LK[i],b=LK[i+1],k=eio(cl((t-a[0])/(b[0]-a[0]||1)));
  KEY.position.set(lp(a[1][0],b[1][0],k),lp(a[1][1],b[1][1],k),lp(a[1][2],b[1][2],k));KEY.color.set(a[2]).lerp(new T3.Color(b[2]),k);KEY.intensity=lp(a[3],b[3],k);KEY.angle=lp(a[4],b[4],k);
  const club=(t>21&&t<29)||(t>37.3&&t<40);RIM.intensity=club?2.4:0;HEMI.intensity=t>40.2&&t<47.4?.12:club?.32:.45;}
// камера: t, [x,y,z], цель [x,y,z]
const PZ=.8,PH=2.42,FOV=34,DFIT=1.422/Math.tan(FOV/2*Math.PI/180);
const CK=[[4.05,[0,PH,PZ+DFIT],[0,PH,PZ]],[4.25,[0,PH,PZ+DFIT],[0,PH,PZ]],[6.0,[0,2.55,11.6],[0,2.4,0]],[6.3,[0,2.55,11.6],[0,2.4,0]],[8.4,[0,2.45,6.2],[0,2.42,.8]],
  [9.6,[.4,2.6,9.4],[0,2.5,0]],[14.6,[-.3,2.4,8.0],[0,2.3,0]],[15.6,[0,2.6,9.0],[0,2.4,0]],[17.2,[0,2.6,8.6],[0,2.4,0]],[18.0,[-.1,1.75,4.2],[-.1,.9,.9]],[19.8,[-.1,1.7,3.9],[-.1,.9,.9]],[20.8,[0,2.6,9.2],[0,2.4,0]],
  [22.5,[.3,2.3,8.2],[0,2.0,0]],[24.0,[0,2.0,7.0],[0,1.6,0]],[26.2,[0,2.6,9.0],[0,2.6,0]],[28.4,[0,2.7,8.4],[0,2.8,0]],[29.4,[0,2.7,9.2],[0,2.6,0]],[33.2,[.2,2.7,8.4],[0,2.8,0]],
  [34.2,[0,3.0,7.6],[0,3.1,-1.2]],[35.6,[0,3.0,7.2],[0,3.1,-1.2]],[36.2,[-.1,1.75,4.3],[-.1,.9,.9]],[37.2,[-.1,1.75,4.0],[-.1,.9,.9]],[38.0,[0,2.4,8.6],[0,2.0,0]],[39.4,[0,2.4,8.8],[0,2.0,0]],
  [40.6,[0,2.4,6.6],[0,2.3,.4]],[44.4,[0,2.35,5.2],[0,2.3,.4]],[46.8,[0,2.32,4.8],[0,2.3,.4]],[47.8,[0,2.5,8.8],[0,2.4,0]],[49.0,[-.05,1.35,4.9],[-.05,1.12,.3]],[50.0,[-.05,1.35,4.8],[-.05,1.12,.3]],[51.0,[0,3.1,10.2],[0,3.2,0]],[53.4,[0,2.7,10.4],[0,2.6,0]],[55,[0,2.6,10.2],[0,2.5,0]]];
function camAt(t){let i=0;while(i<CK.length-2&&t>=CK[i+1][0])i++;const a=CK[i],b=CK[i+1],k=eio(cl((t-a[0])/(b[0]-a[0])));
  const p=a[1].map((v,j)=>lp(v,b[1][j],k)),q=a[2].map((v,j)=>lp(v,b[2][j],k));
  const sw=t>4.6?.03:0;CAM.position.set(p[0]+Math.sin(t*.7)*sw,p[1]+Math.sin(t*.53)*sw*.6,p[2]);CAM.lookAt(q[0],q[1],q[2]);}

/* ---------- анимации предметов ---------- */
function animate(t){for(const S of SETS)setPose(S,t);
  // S3 и S4 возвращаются в развязке
  const s3=SETS[2],s4=SETS[3];
  if(t>33.3&&t<38.2){const ki=eio(cl((t-33.3)/.7)),ko=eio(cl((t-37.0)/.6));s3.g.visible=true;s3.g.position.set(0,lp(6.5,0,ki)+lp(0,6.5,ko),0);}
  if(t>37.0&&t<40.3){const ki=eio(cl((t-37.0)/.6)),ko=eio(cl((t-39.5)/.7));s4.g.visible=true;s4.g.position.set(lp(4.6,0,ki)+lp(0,-4.6,ko),0,0);}
  // фото → досье
  const fk=eio(cl((t-6.35)/.7));PHOTO.rotation.y=Math.PI*fk;PHOTO.position.z=.8+Math.sin(fk*Math.PI)*.35;
  // пять нулей встают по одному
  COUNTER.forEach((m,i)=>{const k=spr(cl((t-(i?11.55:11.3)-i*.2)/.7));m.position.y=lp(6.6,4.25,k);m.rotation.z=Math.sin(t*1.3+i)*.04*(1-cl(k-.6));});
  MOON.rotation.z=Math.sin(t*.8)*.06;MOON.position.y=4.3+Math.sin(t*.6)*.04;
  // подпись: 17.6–19.0, ручка ведёт линию (без руки) и уходит
  const sk=cl((t-17.6)/1.4),fired=t>35.95?cl((t-35.95)/.12):0;
  if(!SIGN.userData.last||SIGN.userData.last[0]!==Math.round(sk*90)||SIGN.userData.last[1]!==fired){redraw(SIGN,(g,W,H,u)=>contract(g,W,H,u,sk,fired));SIGN.userData.last=[Math.round(sk*90),fired];}
  {const th=-Math.PI/2+.42,ct=Math.cos(th),st=Math.sin(th),tp=sigTip(sk),out=eo(cl((t-19.05)/.5)),inn=eo(cl((t-17.0)/.6)),z=.35;
    let A=-.15+(tp[0]-.5)+out*1.2+(1-inn)*1.0,B=.68-(1.1+tp[1])+(1-inn)*.3+out*.3;const ca=A+.475*Math.cos(z),cb=B+.475*Math.sin(z);
    PEN.rotation.set(th,0,z+Math.sin(t*9)*.03*(sk>0&&sk<1));PEN.position.set(ca,.02+cb*ct-.03*st,.02+cb*st+.03*ct);PEN.visible=t>16.9&&t<19.7;}
  // щит переворачивается: рай → полигон химоружия
  BILL.rotation.x=Math.PI*eio(cl((t-34.0)/.7));
  // клуб: канат открывается, вышибалы отходят в развязке, дверь падает
  ROPE.rotation.z=-1.35*eio(cl((t-23.2)/.5));
  const fall=t>37.0?ei(cl((t-38.0)/.55)):0;DOOR.rotation.x=-Math.PI/2*fall;BOUN.forEach((b,i)=>{b.position.x=(i?1:-1)*(1.0+2.6*eio(cl((t-37.7)/.6))*(t>37.0?1:0));});
  NEON.visible=!(t>38.0&&t<40.3)||((t*14|0)%3===0&&t<38.4);NEON.material.opacity=1;
  // бокалы и конфетти 24.4–27
  GLASSES.forEach((m,i)=>{const k=spr(cl((t-24.3-i*.15)/.7));m.position.y=lp(-1.2,.9+(i%2)*.18,k);m.rotation.z=Math.sin(t*2+i)*.05;});
  CONF.forEach(p=>{const c=p.userData.c,v=t-24.4-c.d;p.visible=v>0&&v<4;if(!p.visible)return;p.position.set(c.x+Math.sin(v*2+c.ph)*.2,5.2-v*c.s*1.3,c.z);p.rotation.set(v*3+c.ph,v*2,v*4);});
  const plan=SETS[3].parts.plan,pk=spr(cl((t-26.3)/.9));const pf=ei(cl((t-38.9)/.5));plan.position.y=lp(5.8,2.55,pk)-pf*2.4;plan.rotation.z=Math.sin(t*1.4)*.03+pf*.6;plan.visible=pf<.99;
  // баннер падает и качается, листовки
  const ban=SETS[4].parts.ban,bk=spr(cl((t-29.8)/.9));ban.position.y=lp(6.6,3.25,bk);ban.rotation.z=Math.sin(t*1.7)*.02*(1-cl((t-31)/2));
  FLY.forEach(p=>{const c=p.userData.c;if(p.userData.rain){const v=((t*c.s+c.ph)%6);p.position.set(c.x,5.2-v,c.z);return;}const v=t-30.2-c.d;p.visible=v>0&&v<5&&t<34.2;if(!p.visible)return;p.position.set(c.x+Math.sin(v*1.6+c.ph)*.35,5.4-v*c.s*1.1,c.z);p.rotation.set(Math.sin(v*2+c.ph)*.8,v*1.4,Math.sin(v*1.1)*.6);});
  // телефон: звонки
  const ph=t<41.0?['','']:t<42.1?['CALLING…','VADIM']:t<43.2?['VOICEMAIL','VADIM']:t<44.1?['CALLING…','MISHA']:t<44.8?['VOICEMAIL','MISHA']:t<45.0?['','']:['INCOMING','JULIA'];
  const key=ph.join('|')+(t>45&&((t*3)|0)%2);if(PHONE.userData.key!==key){redraw(PHONE,(g,W,H,u)=>phoneDraw(g,W,H,u,ph[0],ph[1],ph[0]==='INCOMING'));PHONE.material.emissiveMap.image=phoneEm(PHONE.userData.cv);PHONE.material.emissiveMap.needsUpdate=true;PHONE.userData.key=key;}
  PHONE.rotation.z=t>45?Math.sin(t*40)*.03*(((t*3)|0)%2):0;
  // лента с имени снимается, вывеска рвётся
  const rk=eio(cl((t-48.4)/.6));RED2.rotation.z=-rk*1.2;RED2.position.set(-.49+rk*.1,1.125-rk*.25,.31+rk*.25);RED2.visible=rk<.98;
  const tk=eo(cl((t-50.6)/.9));SOUL.position.set(-1.3-tk*.18,tk*.14,0);SOUL.rotation.z=tk*.14;LESS.position.set(1.3+tk*.18,-tk*.3,0);LESS.rotation.z=-tk*.2;
  // занавес: открыт, закрывается в конце
  const cc=eio(cl((t-53.3)/1.0));CURL.position.x=lp(-2.4,-.88,cc);CURR.position.x=lp(2.4,.88,cc);}

/* ---------- подписи: полоски бумаги ---------- */
const CAP=[[4.6,'Meet the subject.',''],[6.9,'29. Moscow, 2012.','29.'],[9.7,'Top manager. Megapolis bank.','top'],[11.6,'Five zeros a year —','zeros'],[12.9,'in euros.','euros.'],
  [15.7,'Your deal: a loan',''],[16.6,"for “Millionaires' Paradise”.",'paradise'],[17.8,'You sign.','sign.'],
  [21.6,'Night. Clubs where','night.'],[22.5,'the bouncers know your face.','face.'],[24.5,'Champagne. VIP.','vip.'],[26.4,'A friend sells you a dream:','dream:'],[27.4,'a club of your own.','own.'],
  [29.6,'Then — activists.','activists.'],[32.0,'One of them is Julia.','julia.'],
  [34.3,"Paradise was a chemical weapons test site.",'chemical weapons'],[36.0,"You're fired.",'fired.'],[38.0,'The club?','club?'],[38.9,'There is no club.','no club.'],
  [40.6,'You call everyone.','everyone.'],[42.2,'Voicemail.','voicemail.'],[43.6,'Voicemail.','voicemail.'],[45.4,'“Max, hi… can you pick me up?”','pick me up?'],[46.8,'“I’ll be there.”','there.'],
  [48.4,'Your name is Max Andreev.','max andreev.'],[50.7,'Soulless, 2012.','soulless,'],[52.2,'Would you have answered?','answered?']];
const nrm=s=>s.toLowerCase().replace(/[^a-z0-9']/g,'');
function caption(c,t){let k=-1;for(let i=0;i<CAP.length;i++)if(t>=CAP[i][0])k=i;if(k<0||t>53.9)return;const [t0,s,acc]=CAP[k],nx=CAP[k+1],end=nx?nx[0]:54;
  if(t>end-.05)return;const A=new Set(acc.split(' ').map(nrm).filter(Boolean));
  const o={f:'J',w:800,s:58},words=s.split(' ');let L=[[]],w=0;const sp=tm(c,' ',o);for(const wd of words){const ww=tm(c,wd,o);if(L[L.length-1].length&&w+sp+ww>820){L.push([]);w=0;}L[L.length-1].push([wd,ww]);w+=(L[L.length-1].length>1?sp:0)+ww;}
  const lh=74,y0=1500-(L.length-1)*lh/2,ki=eo(cl((t-t0)/.22)),r=H1(k*7.3)*.05-.025;
  c.save();c.translate(540,y0+lh*(L.length-1)/2-18);c.rotate(r);c.translate(0,(1-ki)*40);c.globalAlpha=ki;
  const bw=Math.max(...L.map(l=>l.reduce((a,b)=>a+b[1],0)+sp*(l.length-1)))+70,bh=L.length*lh+34;
  c.fillStyle='rgba(0,0,0,.35)';c.fillRect(-bw/2+8,-bh/2+10,bw,bh);c.fillStyle='#efe6d0';c.beginPath();const jr=rng(k+3);c.moveTo(-bw/2,-bh/2);
  for(let x=-bw/2;x<=bw/2;x+=18)c.lineTo(x,-bh/2+(jr()-.5)*6);for(let y=-bh/2;y<=bh/2;y+=18)c.lineTo(bw/2+(jr()-.5)*6,y);for(let x=bw/2;x>=-bw/2;x-=18)c.lineTo(x,bh/2+(jr()-.5)*6);for(let y=bh/2;y>=-bh/2;y-=18)c.lineTo(-bw/2+(jr()-.5)*6,y);c.fill();
  c.restore();
  c.save();c.translate(540,y0+lh*(L.length-1)/2-18);c.rotate(r);c.translate(-540,-(y0+lh*(L.length-1)/2-18)+(1-ki)*40);let j=0;
  L.forEach((ln,li)=>{const W0=ln.reduce((a,b)=>a+b[1],0)+sp*(ln.length-1);let x=540-W0/2;const y=y0+li*lh;for(const [wd,ww] of ln){const kw=cl((t-t0-.08-j*.06)/.12);j++;if(kw>0){
      const ac=A.has(nrm(wd));if(ac){c.fillStyle='rgba(200,30,42,.9)';c.fillRect(x-4,y+8,(ww+8)*eo(cl((t-t0-.25-j*.06)/.25)),7);}
      font(c,o);c.globalAlpha=kw;c.textAlign='left';c.fillStyle=ac?'#b0141f':'#17161a';c.fillText(wd,x,y);c.globalAlpha=1;}x+=ww+sp;}});
  c.restore();}

/* ---------- запуск ---------- */
CLIP.init=async()=>{await DC.init();DC.CAP[2]='Moscow drip';FRZ=mk(1080,1920);DC.draw(FRZ.getContext('2d'),4.0);
  GL=document.createElement('canvas');GL.width=WW;GL.height=HH;
  R=new T3.WebGLRenderer({canvas:GL,antialias:true,preserveDrawingBuffer:true});R.setPixelRatio(1);R.setSize(WW,HH,false);R.outputEncoding=T3.sRGBEncoding;R.shadowMap.enabled=true;R.shadowMap.type=T3.PCFSoftShadowMap;
  SC=new T3.Scene();SC.background=new T3.Color('#070609');SC.fog=new T3.Fog(0x070609,14,30);
  CAM=new T3.PerspectiveCamera(FOV,WW/HH,.05,60);
  HEMI=new T3.HemisphereLight(0xd8d0ff,0x2a1a10,.45);SC.add(HEMI);
  KEY=new T3.SpotLight(0xffe2b8,2.2,30,.55,.55,1);KEY.castShadow=true;KEY.shadow.mapSize.set(2048,2048);KEY.shadow.bias=-.0004;KEY.shadow.normalBias=.02;KEY.shadow.camera.near=1;KEY.shadow.camera.far=30;KEY.target.position.set(0,2.2,0);SC.add(KEY,KEY.target);
  RIM=new T3.SpotLight(0x2fe6ff,0,30,.6,.6,1);RIM.position.set(-2.5,5,4);RIM.castShadow=true;RIM.shadow.mapSize.set(1024,1024);RIM.shadow.bias=-.0004;RIM.target.position.set(0,1.5,0);SC.add(RIM,RIM.target);
  buildTheatre();buildSets();window.DLX6C={TEND,N:Math.round(TEND*30),CAP};};
const SWP=mk(WW,HH);
CLIP.draw=(c,t,i)=>{
  if(t<4.05){DC.draw(c,t);grain(c,i,.05);return;}
  if(t>54.45){const k=eio(cl((t-54.45)/.55));draw3(c,54.45,i);c.save();c.translate(WW*(1-k),0);DC.draw(c,.02);c.restore();grain(c,i,.05);return;}
  draw3(c,t,i);caption(c,t);grain(c,i,.06);};
function draw3(c,t,i){animate(t);lightAt(t);camAt(t);R.render(SC,CAM);c.drawImage(GL,0,0);
  // мягкая глубина: края кадра чуть размыты (без бликов)
  const fl=t<4.3?1-cl((t-4.05)/.25):0;if(fl>0){c.save();c.globalAlpha=fl;c.drawImage(FRZ,0,0);c.restore();}
  vig(c,.55,.3);}
})();
