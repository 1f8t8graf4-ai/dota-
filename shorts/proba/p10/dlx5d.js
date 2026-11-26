"use strict";
/* «Духless» v5 · сцены 7–8: дорожка на чёрном стекле (чёрная карта с золотым чипом ровняет короткую дорожку), защёлка кабинки
   (металл, глубокие тени, холодный блик, ручка поворачивается в 3D, окошко VACANT → OCCUPIED). Плюс стол клуба. */

function clubTableTex(){return cache('clbT',650,800,(x,w,h)=>{x.fillStyle=LG(x,0,0,w,h,[[0,'#0c0b10'],[1,'#07060a']]);x.fillRect(0,0,w,h);
  const r=rng(41);x.lineCap='round';for(let i=0;i<14;i++){let px=r()*w,pz=r()*h;x.strokeStyle=`rgba(${r()<.5?'210,170,90':'150,150,170'},${.12+.18*r()})`;x.lineWidth=.6+r()*1.6;x.beginPath();x.moveTo(px,pz);for(let j=0;j<40;j++){px+=(r()-.4)*22;pz+=(r()-.5)*22;x.lineTo(px,pz);}x.stroke();}
  x.globalAlpha=.2;x.globalCompositeOperation='overlay';x.drawImage(noiseTex('mar',256,256,10,4),0,0,w,h);});}

/* ================= 7. ДОРОЖКА ================= */
// мир: единица = 0,25 мм; стекло — плоскость y=0; дорожка вдоль x на z=LN.z
const LN={x0:-190,x1:190,z:430,w:12};
function glassTex(){return cache('glass',600,500,(x,w,h)=>{// x −600…600, z 0…1000
  x.fillStyle=LG(x,0,0,0,h,[[0,'#020203'],[1,'#07080b']]);x.fillRect(0,0,w,h);
  x.fillStyle=LG(x,0,0,w,0,[[0,'rgba(180,200,230,0)'],[.45,'rgba(180,200,230,.10)'],[.5,'rgba(220,235,255,.22)'],[.56,'rgba(180,200,230,.08)'],[1,'rgba(180,200,230,0)']]);x.save();x.translate(w/2,h/2);x.rotate(-.35);x.fillRect(-w,-60,2*w,120);x.restore();
  const r=rng(9);x.strokeStyle='rgba(255,255,255,.05)';x.lineWidth=.8;for(let i=0;i<60;i++){const px=r()*w,py=r()*h,l=10+r()*60,a=r()*TAU;x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.cos(a)*l,py+Math.sin(a)*l);x.stroke();}
  x.fillStyle='rgba(255,255,255,.05)';for(let i=0;i<220;i++)x.fillRect(r()*w,r()*h,1,1);});}
// крупинки: целевая точка на дорожке и стартовая (разбросано)
const GRN5=(()=>{const r=rng(55),a=[];for(let i=0;i<620;i++){const gx=lp(LN.x0,LN.x1,r()),gz=LN.z+(r()-.5)*LN.w*(.4+.6*r()),sx=gx+(r()-.5)*16,sz=LN.z+14+Math.pow(r(),1.6)*60,s=.8+r()*1.5;a.push([gx,gz,sx,sz,s]);}return a;})();
// чёрная металлическая карта (текстура 860×544)
function cardTex(){return cache('card',860,544,(x,w,h)=>{RR(x,0,0,w,h,44);x.clip();
  x.fillStyle=LG(x,0,0,w,h,[[0,'#1a1b1f'],[.5,'#0b0b0d'],[1,'#141519']]);x.fillRect(0,0,w,h);
  x.globalAlpha=.08;x.strokeStyle='#fff';for(let i=-h;i<w;i+=4){x.beginPath();x.moveTo(i,0);x.lineTo(i+h,h);x.stroke();}x.globalAlpha=1;
  const gold=LG(x,0,60,0,120,[[0,'#fff0c0'],[.5,'#d8ac50'],[1,'#8a6420']]);x.fillStyle=gold;x.font='800 46px Man';x.letterSpacing='10px';x.textAlign='left';x.textBaseline='alphabetic';x.fillText('MEGAPOLIS',64,108);
  x.font='600 22px Man';x.letterSpacing='14px';x.fillStyle='rgba(230,210,160,.8)';x.fillText('PRIVATE BANKING',66,146);x.letterSpacing='0px';
  // чип
  x.fillStyle=LG(x,96,200,196,280,[[0,'#fff2c4'],[.5,'#d6a64a'],[1,'#8a6420']]);RR(x,96,200,116,88,14);x.fill();x.strokeStyle='rgba(90,60,10,.7)';x.lineWidth=2;for(const yy of [229,259])x.beginPath(),x.moveTo(96,yy),x.lineTo(212,yy),x.stroke();x.beginPath();x.moveTo(154,200);x.lineTo(154,288);x.stroke();RR(x,132,226,44,36,8);x.stroke();
  // бесконтакт
  x.strokeStyle='rgba(220,220,230,.6)';x.lineWidth=4;for(let i=0;i<3;i++){x.beginPath();x.arc(250,244,14+i*12,-.8,.8);x.stroke();}
  // выпуклые цифры: светлый верх, тёмный низ
  const num='5536  9137  2012  0418';x.font='600 54px JBM';x.fillStyle='rgba(0,0,0,.8)';x.fillText(num,66,392);x.fillStyle='#d9dbe2';x.fillText(num,64,388);
  x.font='600 26px JBM';x.fillStyle='#c9ccd4';x.fillText('VALID THRU 04/16',64,446);x.font='700 30px Man';x.letterSpacing='6px';x.fillText('BLACK',64,500);x.letterSpacing='0px';
  // сеть: два серых круга
  x.globalAlpha=.85;x.fillStyle='#5a5c64';x.beginPath();x.arc(700,470,40,0,TAU);x.fill();x.fillStyle='#8a8c94';x.beginPath();x.arc(752,470,40,0,TAU);x.fill();x.globalAlpha=1;
  x.fillStyle=LG(x,0,0,w,h,[[0,'rgba(255,255,255,.08)'],[.4,'rgba(255,255,255,0)'],[1,'rgba(255,255,255,.04)']]);x.fillRect(0,0,w,h);});}
// сцена «дорожка». o: {sweep:[t0,t1] — карта проходит, hand}
function lineScene(c,t,u,o={}){o={hand:false,...o};
  const cam=cam3(camKeys([[0,lookAt([40,-470,80],[0,0,440],1500,-.03)],[1.4,lookAt([10,-430,140],[0,0,440],1500,-.01)]],u,eo));
  c.fillStyle='#000';c.fillRect(0,0,WW,HH);texPlane(c,cam,glassTex(),[-600,0,1000],[1200,0,0],[0,0,-1000],6,6);
  const sw=o.sweep||[0,1],k=eio(cl((t-sw[0])/(sw[1]-sw[0]))),cz=lp(LN.z+130,LN.z+LN.w*.7,k),tilt=1.15;
  // дорожка: ровная полоса там, где карта уже прошла, впереди — горка порошка
  const lineK=cl(k*1.15);c.save();const q=[cam.P(LN.x0,-1,LN.z-LN.w/2),cam.P(LN.x1,-1,LN.z-LN.w/2),cam.P(LN.x1,-1,LN.z+LN.w/2),cam.P(LN.x0,-1,LN.z+LN.w/2)];
  c.globalAlpha=lineK;c.fillStyle='rgba(0,0,0,.6)';c.filter='blur(3px)';PP(c,q.map(p=>[p[0]+4,p[1]+5]));c.fill();c.filter='none';c.fillStyle=LG(c,0,q[0][1],0,q[2][1],[[0,'#ffffff'],[.6,'#e9ebf0'],[1,'#b9bcc6']]);PP(c,q);c.fill();c.globalAlpha=1;
  for(const [gx,gz,sx,sz,s0] of GRN5){const done=sz>cz;if(done&&H1(gx*3.1)>.25)continue;const px=done?gx:sx,pz=done?gz:Math.min(sz,cz-2);const p=cam.P(px,-1,pz),r=s0*p[3]*1.05;c.fillStyle='rgba(0,0,0,.45)';c.fillRect(p[0]+r*.4,p[1]+r*.4,r*1.3,r*1.3);c.fillStyle='#f2f3f6';c.fillRect(p[0]-r/2,p[1]-r/2,r*1.2,r*1.2);}
  c.restore();
  // отражение карты в стекле и сама карта (наклонена к камере, ребро вдоль дорожки)
  const cw=342,chh=216,O=[-cw/2+lp(0,30,k),-Math.sin(tilt)*chh,cz+Math.cos(tilt)*chh],U=[cw,0,0],V=[0,Math.sin(tilt)*chh,-Math.cos(tilt)*chh];
  c.save();c.globalAlpha=.28;const Or=[O[0],-O[1],O[2]],Vr=[0,-V[1],V[2]];texPlane(c,cam,cardTex(),Or,U,Vr,4,3);c.restore();
  // ребро карты (толщина)
  const e0=cam.P(O[0],0,cz),e1=cam.P(O[0]+cw,0,cz);c.strokeStyle='#3a3b42';c.lineWidth=5*e0[3];c.beginPath();c.moveTo(e0[0],e0[1]+2);c.lineTo(e1[0],e1[1]+2);c.stroke();
  texPlane(c,cam,cardTex(),O,U,V,5,4);
  const T=[cam.P(O[0],O[1],O[2]),cam.P(O[0]+cw,O[1],O[2]),cam.P(O[0]+cw,0,cz),cam.P(O[0],0,cz)];sheen(c,T,lp(.1,.9,k),.3,.7,.1);
  // большой палец держит карту сверху справа (рука — за краем кадра)
  if(o.hand!==false){const a=cam.P(O[0]+cw*.86,O[1]+34,O[2]-12),s=a[3],L=[-.5,-.86];
    tube(c,[[a[0]+340*s,a[1]-300*s],[a[0]+150*s,a[1]-110*s],[a[0]+20*s,a[1]+10*s]],92*s,70*s,L,{nail:{side:-1,k:.82},joints:[1]});}
  // холодный свет сверху
  c.save();c.globalCompositeOperation='screen';c.fillStyle=RG(c,560,700,0,900,[[0,'rgba(170,200,255,.16)'],[1,'rgba(170,200,255,0)']]);c.fillRect(0,0,WW,HH);c.restore();
  dof(c,{px:14,top:1,m0:.28,m1:.78,bot:.5});vignette(c,.75);}

/* ================= 8. ЗАЩЁЛКА ================= */
function doorTex(){return cache('door',700,1300,(x,w,h)=>{x.fillStyle=LG(x,0,0,0,h,[[0,'#8a9098'],[1,'#5a6068']]);x.fillRect(0,0,w,h);
  x.globalAlpha=.25;x.globalCompositeOperation='overlay';x.drawImage(noiseTex('lam',256,256,6,4),0,0,w,h);x.globalAlpha=1;x.globalCompositeOperation='source-over';
  const r=rng(12);x.strokeStyle='rgba(255,255,255,.12)';x.lineWidth=1;for(let i=0;i<80;i++){const px=r()*w,py=r()*h,l=8+r()*50,a=r()*TAU;x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.cos(a)*l,py+Math.sin(a)*l);x.stroke();}
  x.fillStyle='rgba(20,20,30,.35)';x.font='700 40px Cav';x.save();x.translate(110,260);x.rotate(-.12);x.fillText('K + D 2011',0,0);x.restore();x.save();x.translate(420,1120);x.rotate(.08);x.font='700 34px Cav';x.fillText('call me',0,0);x.restore();});}
// защёлка: центр (cx,cy) на экране, R — радиус розетки, ang — поворот ручки (0 — вертикально, π/2 — горизонтально), occ — 0..1 барабан окошка
function latch(c,cx,cy,R,ang,occ,t){c.save();
  // тень розетки на двери
  c.save();c.filter='blur(14px)';c.fillStyle='rgba(0,0,0,.55)';c.beginPath();c.arc(cx+R*.12,cy+R*.18,R*1.05,0,TAU);c.fill();c.restore();
  // розетка: шлифованная сталь
  c.fillStyle=RG(c,cx-R*.3,cy-R*.35,R*.1,R*1.1,[[0,'#f4f6fa'],[.45,'#aab0ba'],[.8,'#6a707a'],[1,'#3a3e46']]);c.beginPath();c.arc(cx,cy,R,0,TAU);c.fill();
  c.save();c.beginPath();c.arc(cx,cy,R,0,TAU);c.clip();c.globalAlpha=.18;c.strokeStyle='#fff';c.lineWidth=1;for(let r=8;r<R;r+=3){c.beginPath();c.arc(cx,cy,r,0,TAU);c.stroke();}c.restore();
  c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=R*.03;c.beginPath();c.arc(cx,cy,R*.97,Math.PI*1.05,Math.PI*1.65);c.stroke();c.strokeStyle='rgba(0,0,0,.45)';c.beginPath();c.arc(cx,cy,R*.97,Math.PI*.05,Math.PI*.7);c.stroke();
  for(const a of [Math.PI*.25,Math.PI*1.25]){const sx=cx+Math.cos(a)*R*.74,sy=cy+Math.sin(a)*R*.74;c.fillStyle=RG(c,sx-2,sy-2,1,R*.09,[[0,'#fff'],[1,'#5a5e66']]);c.beginPath();c.arc(sx,sy,R*.08,0,TAU);c.fill();c.strokeStyle='#3a3e46';c.lineWidth=R*.02;c.beginPath();c.moveTo(sx-R*.06,sy);c.lineTo(sx+R*.06,sy);c.stroke();}
  // окошко с барабаном над ручкой
  const wx=cx-R*.5,wy=cy-R*.78,ww=R,wh=R*.32;c.fillStyle='#14161a';RR(c,wx-6,wy-6,ww+12,wh+12,10);c.fill();
  c.save();RR(c,wx,wy,ww,wh,6);c.clip();const off=occ*wh;
  c.fillStyle='#e8f1ea';c.fillRect(wx,wy-off,ww,wh);c.fillStyle='#1f8a4a';c.font=`800 ${wh*.52}px Man`;c.textAlign='center';c.textBaseline='middle';c.fillText('VACANT',cx,wy-off+wh/2);
  c.fillStyle='#d8262a';c.fillRect(wx,wy+wh-off,ww,wh);c.fillStyle='#fff';c.fillText('OCCUPIED',cx,wy+wh-off+wh/2);
  c.fillStyle=LG(c,0,wy,0,wy+wh,[[0,'rgba(0,0,0,.45)'],[.3,'rgba(0,0,0,0)'],[.7,'rgba(0,0,0,0)'],[1,'rgba(0,0,0,.45)']]);c.fillRect(wx,wy,ww,wh);c.restore();
  c.fillStyle='rgba(255,255,255,.22)';c.fillRect(wx+4,wy+3,ww-8,3);
  // ручка-барашек: тень, торец (толщина), лицевая грань
  const hl=R*1.3,hw=R*.36,dx=R*.11,dy=R*.2;
  const bar=(ox,oy)=>{c.save();c.translate(cx+ox,cy+oy);c.rotate(ang);RR(c,-hw/2,-hl/2,hw,hl,hw/2);c.restore();};
  c.save();c.filter='blur(8px)';c.fillStyle='rgba(0,0,0,.6)';bar(R*.16,R*.24);c.fill();c.restore();
  c.fillStyle='#2e3238';bar(dx,dy);c.fill();
  c.save();c.translate(cx,cy);c.rotate(ang);RR(c,-hw/2,-hl/2,hw,hl,hw/2);const la=-ang-Math.PI*.7;c.fillStyle=LG(c,Math.cos(la)*hw,Math.sin(la)*hw,-Math.cos(la)*hw,-Math.sin(la)*hw,[[0,'#ffffff'],[.4,'#b8bec8'],[1,'#4a4f58']]);c.fill();
  c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=R*.025;c.stroke();c.fillStyle='rgba(255,255,255,.55)';RR(c,-hw*.22,-hl*.42,hw*.14,hl*.84,hw*.07);c.fill();c.restore();
  c.fillStyle=RG(c,cx-3,cy-3,1,R*.16,[[0,'#fff'],[1,'#7a808a']]);c.beginPath();c.arc(cx,cy,R*.13,0,TAU);c.fill();
  c.restore();}
// сцена «кабинка». o: {click — время щелчка, hand}
function stallScene(c,t,u,o={}){o={hand:false,...o};const ck=o.click??99,a=cl((t-ck+.16)/.16),ang=lp(0,Math.PI/2,a<1?ei(a):1)+(t>ck?Math.sin((t-ck)*40)*Math.exp(-(t-ck)*12)*.08:0),occ=ss(.2,1,a);
  const cam=cam3(lookAt([-90,-20,-560],[0,0,0],1500,.02));
  c.fillStyle='#1a1d22';c.fillRect(0,0,WW,HH);texPlane(c,cam,doorTex(),[-350,-650,0],[700,0,0],[0,1300,0],5,8);
  const z=lp(1,1.1,eo(cl(u/1.6))),cp=cam.P(0,0,0);c.save();c.translate(cp[0],cp[1]);c.scale(z,z);c.translate(-cp[0],-cp[1]);
  latch(c,cp[0],cp[1],250,ang,occ,t);
  // кончики большого и указательного пальцев зажимают ручку (рука — за краем кадра)
  if(o.hand!==false){const L=[-.5,-.86],hl=250*1.3,e1=[cp[0]+Math.sin(ang)*hl*.36,cp[1]-Math.cos(ang)*hl*.36],e2=[cp[0]-Math.sin(ang)*hl*.36,cp[1]+Math.cos(ang)*hl*.36];
    tube(c,[[cp[0]+560,cp[1]+700],[lp(cp[0]+420,e2[0],.55),lp(cp[1]+560,e2[1],.55)],[e2[0]+30,e2[1]+18]],120,92,L,{nail:{side:-1,k:.84},joints:[1]});
    tube(c,[[cp[0]+640,cp[1]+420],[lp(cp[0]+520,e1[0],.5),lp(cp[1]+260,e1[1],.5)],[e1[0]+34,e1[1]+14]],112,86,L,{nail:{side:1,k:.84},joints:[1]});}
  c.restore();
  // холодный свет сверху, мигание лампы при щелчке
  const fl=t>ck&&t<ck+.25?(Math.sin((t-ck)*90)>0?.15:0):0;c.save();c.globalCompositeOperation='screen';c.fillStyle=LG(c,0,0,0,HH,[[0,`rgba(190,215,255,${.22+fl})`],[.5,'rgba(190,215,255,0)']]);c.fillRect(0,0,WW,HH);c.restore();
  c.save();c.globalCompositeOperation='multiply';c.fillStyle=LG(c,0,0,0,HH,[[0,'rgb(230,236,246)'],[1,'rgb(90,96,110)']]);c.fillRect(0,0,WW,HH);c.restore();
  vignette(c,.7);}

/* ================= сцены вариантов ================= */
// полароид Козловского с «29» красным маркером (вариант Claude): падает на стол, маркер пишет
function polaroidBase(){return cache('polB',700,840,(x,w,h)=>{x.fillStyle='#f3efe6';x.fillRect(0,0,w,h);x.globalAlpha=.1;x.drawImage(noiseTex('pap',256,256,6,3),0,0,w,h);x.globalAlpha=1;
  x.fillStyle='#111';x.fillRect(48,48,604,604);const K=MEDIA.kz;if(K){x.save();x.beginPath();x.rect(48,48,604,604);x.clip();x.filter='contrast(1.08) saturate(.9) sepia(.12)';const k=Math.max(604/K.width,604/K.height);x.drawImage(K,350-K.width*k/2,350-K.height*k/2+40,K.width*k,K.height*k);x.restore();x.filter='none';}
  x.fillStyle=LG(x,48,48,652,652,[[0,'rgba(255,240,220,.14)'],[.5,'rgba(0,0,0,0)'],[1,'rgba(0,0,0,.18)']]);x.fillRect(48,48,604,604);});}
function polaroidScene(c,t,u,o={}){const cam=cam3(camKeys([[0,lookAt([30,-700,560],[0,0,900],1500,-.06)],[1.6,lookAt([10,-620,640],[0,0,905],1500,-.03)]],u,eo));
  c.fillStyle='#0b0806';c.fillRect(0,0,WW,HH);deskDraw(c,cam,false);
  const land=eo(cl(u/.32)),mk=o.mark?cl((t-o.mark[0])/(o.mark[1]-o.mark[0])):1;
  const tx=mkcOnce('polT',700,840),x=tx.getContext('2d');reset(x);x.drawImage(polaroidBase(),0,0);
  if(mk>0){x.save();x.beginPath();x.rect(0,660,140+460*mk,180);x.clip();x.fillStyle='#c8141e';x.font='700 190px Cav';x.textAlign='center';x.textBaseline='middle';x.save();x.translate(350,752);x.rotate(-.06);x.fillText('29',0,0);x.restore();x.restore();}
  const pd={x:lp(140,0,land),z:lp(1150,905,land),w:350,d:420,h:2,r:4,a:lp(.5,-.08,land),top:tx,side0:'#cfcabe',side1:'#f3efe6',shOff:[20,0,-24],nx:5,ny:6};
  slabShadow(c,cam,pd,14,.55*land);const T=slab(c,cam,pd);sheen(c,T,ss(.1,1.4,u),.3,1.1,.12);
  const fl=Math.max(0,1-u/.12);if(fl>0){c.fillStyle=`rgba(255,252,245,${.75*fl})`;c.fillRect(0,0,WW,HH);}
  c.save();c.globalCompositeOperation='multiply';c.fillStyle=RG(c,540,900,120,1100,[[0,'rgb(255,246,236)'],[1,'rgb(70,60,54)']]);c.fillRect(0,0,WW,HH);c.restore();
  dof(c,{px:16,top:1,m0:.25,m1:.75,bot:.6});vignette(c,.6);}
// герой у панорамного окна в Москва-Сити: вид на Кремль, фигура со спины (вариант «со стороны»)
function windowHero(c,t,u,o={}){moscow(c,t,u,{Z:o.Z||0,X:o.X||0,Y:o.Y||0,n29:o.n29});
  c.save();c.globalCompositeOperation='screen';c.fillStyle=LG(c,0,0,WW,HH,[[0,'rgba(120,140,190,.10)'],[.5,'rgba(0,0,0,0)'],[1,'rgba(255,170,110,.08)']]);c.fillRect(0,0,WW,HH);c.restore();
  // рама окна: стойки и ригель, в перспективе
  c.save();c.fillStyle='#07080c';for(const [x0,x1] of [[-40,34],[520,548],[1046,1120]]){c.beginPath();c.moveTo(x0,0);c.lineTo(x1,0);c.lineTo(x1+(x1>540?18:-18),HH);c.lineTo(x0+(x0>540?18:-18),HH);c.closePath();c.fill();}
  c.fillRect(0,1560,WW,26);c.fillStyle='rgba(255,200,150,.18)';c.fillRect(0,1556,WW,4);c.restore();
  // отражение комнаты в стекле: тёплые точки ламп
  for(let i=0;i<6;i++)glowDot(c,140+i*170,300+(i%2)*90,40,'#ffcf9a',.18);
  // герой со спины, контровой свет от города
  const sw=Math.sin(t*1.1)*3;manBack(c,330+sw,1420,1.55,{rim:'#ffc890',light:1});
  c.save();c.fillStyle=LG(c,0,1586,0,HH,[[0,'#0a090c'],[1,'#030304']]);c.fillRect(0,1586,WW,HH-1586);c.restore();
  vignette(c,.6);}
// пропуск на лацкане пиджака (вариант «со стороны»): грудь героя крупно, лицо за кадром
function chestScene(c,t,u,o={}){if(!KZ)KZ=MEDIA.kz;const z=lp(1,1.08,eo(cl(u/1.5)));
  c.fillStyle=LG(c,0,0,0,HH,[[0,'#2a2018'],[1,'#0c0907']]);c.fillRect(0,0,WW,HH);c.drawImage(bokeh('off1',WW,HH,40,['#ffd9a0','#fff1d0','#9ab8ff'],20,80,9,10),0,0);
  c.save();c.translate(540,960);c.scale(z,z);c.translate(-540,-960);
  // пиджак: два борта, плечи
  c.fillStyle=LG(c,0,0,WW,0,[[0,'#0b0f1c'],[.5,'#1a2236'],[1,'#080b14']]);c.beginPath();c.moveTo(-80,HH+40);c.lineTo(-60,420);c.quadraticCurveTo(80,250,330,210);c.lineTo(750,210);c.quadraticCurveTo(1000,250,1140,420);c.lineTo(1160,HH+40);c.closePath();c.fill();
  // рубашка и галстук
  c.fillStyle=LG(c,420,0,660,0,[[0,'#cfd4dc'],[.5,'#f4f6fa'],[1,'#c4c9d2']]);c.beginPath();c.moveTo(390,200);c.lineTo(690,200);c.lineTo(600,980);c.lineTo(480,980);c.closePath();c.fill();
  c.fillStyle=LG(c,500,0,580,0,[[0,'#4a0c14'],[.5,'#8a1a28'],[1,'#3a0810']]);c.beginPath();c.moveTo(510,240);c.lineTo(570,240);c.lineTo(592,330);c.lineTo(606,900);c.lineTo(540,990);c.lineTo(474,900);c.lineTo(488,330);c.closePath();c.fill();
  c.save();c.clip();c.strokeStyle='rgba(255,200,150,.18)';c.lineWidth=6;for(let i=-10;i<20;i++){c.beginPath();c.moveTo(440,240+i*60);c.lineTo(640,340+i*60);c.stroke();}c.restore();
  c.fillStyle='#8a1a28';c.beginPath();c.moveTo(500,200);c.lineTo(580,200);c.lineTo(572,250);c.lineTo(508,250);c.closePath();c.fill();
  // лацканы
  for(const sg of [-1,1]){c.fillStyle=LG(c,540+sg*120,0,540+sg*360,0,[[0,'#26304a'],[1,'#0c1120']]);c.beginPath();c.moveTo(540+sg*150,200);c.lineTo(540+sg*80,1000);c.lineTo(540+sg*170,1100);c.lineTo(540+sg*340,560);c.lineTo(540+sg*300,400);c.closePath();c.fill();c.strokeStyle='rgba(255,220,180,.14)';c.lineWidth=3;c.stroke();}
  // пропуск на ленте: висит, чуть качается
  const sway=Math.sin(t*2.2)*.05,cam=cam3(lookAt([0,0,-900],[0,0,0],1500,0));
  c.strokeStyle='#14244a';c.lineWidth=26;c.beginPath();c.moveTo(330,210);c.quadraticCurveTo(420,620,560,880);c.moveTo(750,210);c.quadraticCurveTo(700,620,580,880);c.stroke();
  c.save();c.translate(570,890);c.rotate(sway);c.translate(-570,-890);
  const bw=250,bh=398,O=[-bw/2+20,-40,0];const tex=badgeTex();c.save();c.shadowColor='rgba(0,0,0,.6)';c.shadowBlur=30;c.shadowOffsetY=20;texPlane(c,cam3(lookAt([0,-60,-900],[0,0,0],1500,.04)),tex,[-bw/2+20,-30,-10],[bw,0,0],[0,bh,30],4,6);c.restore();
  c.fillStyle=LG(c,540,860,600,900,[[0,'#9aa0aa'],[.5,'#f4f6fa'],[1,'#6a707a']]);RR(c,548,862,44,40,8);c.fill();
  c.restore();
  c.restore();
  c.save();c.globalCompositeOperation='screen';c.fillStyle=RG(c,300,400,0,900,[[0,'rgba(255,214,160,.22)'],[1,'rgba(255,214,160,0)']]);c.fillRect(0,0,WW,HH);c.restore();
  vignette(c,.6);}
// плечо и затылок героя на переднем плане (через плечо), размыто
function shoulderFG(c,t,a=1){c.save();c.globalAlpha=a;c.filter='blur(7px)';c.translate(-80,1500);c.scale(2.2,2.2);
  c.fillStyle='#08080c';c.beginPath();c.moveTo(-40,300);c.lineTo(-30,60);c.quadraticCurveTo(-10,-20,90,-40);c.lineTo(170,-60);c.quadraticCurveTo(250,-50,300,10);c.lineTo(330,300);c.closePath();c.fill();
  c.beginPath();c.ellipse(150,-130,64,80,.15,0,TAU);c.fill();
  c.globalCompositeOperation='screen';c.strokeStyle='rgba(255,190,130,.55)';c.lineWidth=10;c.beginPath();c.ellipse(150,-130,64,80,.15,Math.PI*1.2,Math.PI*1.9);c.stroke();c.beginPath();c.moveTo(170,-60);c.quadraticCurveTo(250,-50,300,10);c.stroke();
  c.restore();}
