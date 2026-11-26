"use strict";
/* Стоп-кадры вариантов (26.11): node render.mjs stl <сцена> <папка> shots 0 */
CLIP.fonts=['700 40px Osw','500 40px Osw','500 40px JBM','700 40px Play','italic 700 40px Play','600 40px Man','800 40px Man'];
const SC={};
CLIP.init=async()=>{};
CLIP.draw=(c,t)=>{const f=SC[Q.get('style')];if(f)f(c,t);};
SC.faces=(c,t)=>{c.fillStyle=LG(c,0,0,0,HH,[[0,'#2b3445'],[1,'#0c0f16']]);c.fillRect(0,0,WW,HH);
  person(c,{x:270,y:420,s:1.6,skin:SKINS.a,hairC:'#2a1c15',beard:1,L:-1,rim:'#ffd9a0',suit:'#1b1f2a',open:true,skinC:SKINS.a.b});
  person(c,{x:800,y:420,s:1.6,skin:SKINS.o,hair:'grey',hairC:'#9a9da3',glasses:true,L:1,rim:'#9fd0ff',turn:-.4,look:[-.6,0],suit:'#2a2c33',tie:'#5a1b22',mouth:'flat'});
  person(c,{x:270,y:1180,s:1.6,skin:SKINS.b,hair:'curly',hairC:'#1d140f',beard:2,L:1,turn:.35,look:[.5,0],suit:'#4a2a5a',shirt:'#c7364a',mouth:'smile',hw:68,jaw:1.08});
  person(c,{x:800,y:1180,s:1.6,skin:SKINS.c,hair:'long',hairC:'#3b2414',L:-1,turn:.2,suit:'#0f1117',shirt:'#0f1117',mouth:'neutral',brow:'up'});
};
SC.ftest=(c,t)=>{c.fillStyle='#223';c.fillRect(0,0,WW,HH);
  head(c,{x:270,y:400,s:2,rimA:0});
  head(c,{x:800,y:400,s:2});
  c.save();c.translate(540,1200);c.scale(2,2);c.fillStyle='#c9a';c.fill(headPath({}));rimStroke(c,[headPath({})],'#ffd9a0',.8,7,1,140);c.restore();};

/* общий финиш кадра */
function fin(c,i,o={}){if(o.grade!==false)grade(c,o.warm||'#ff9a3c',o.cool||'#1b3b6b',o.ga??.2);vignette(c,o.vig??.7);grain(c,i||0,o.gr??.06);}
// размытый передний план: рисуем в холст, размываем
const FG=mkc(WW,HH);
function fgBlur(c,px,fn){const g=FG.getContext('2d');reset(g);g.clearRect(0,0,WW,HH);fn(g);c.save();c.filter=`blur(${px}px)`;c.drawImage(FG,0,0);c.restore();}

/* ===== Копия Дины · 1: кабинет в «Мегаполисе», ночь, Сити за стеклом ===== */
SC.d1=(c,t)=>{
  // небо
  c.fillStyle=LG(c,0,0,0,1250,[[0,'#060b1c'],[.45,'#13204a'],[.78,'#3a2b5e'],[1,'#c0623a']]);c.fillRect(0,0,WW,1300);
  c.fillStyle=RG(c,720,1180,20,700,[[0,'rgba(255,150,80,.55)'],[1,'rgba(255,120,60,0)']]);c.fillRect(0,400,WW,900);
  for(let i=0;i<70;i++){c.fillStyle=`rgba(255,255,255,${.2+.5*H1(i*7.1)})`;c.fillRect(H1(i*3.3)*WW,H1(i*5.9)*520,2,2);}
  // дальний город, высотка, Сити
  cityFar(c,1150,{col:'#1b1830',h:50,n:300});
  stalinka(c,190,1150,.62,'#3c3352');
  moscowCity(c,700,1170,1.0,{lite:.42});
  cityFar(c,1185,{col:'#0d0f1c',h:26,n:200,seed:11});
  river(c,1185,1300,{});cars(c,1180,{n:46});
  fog(c,0,1120,{n:10,sp:0,h:80,r:420,a:.18,seed:3});
  // стекло: отражение интерьера, рамы
  c.save();c.globalCompositeOperation='screen';c.fillStyle=LG(c,0,0,WW,HH,[[0,'rgba(120,160,220,.08)'],[.5,'rgba(255,255,255,0)'],[.62,'rgba(255,220,180,.07)'],[1,'rgba(0,0,0,0)']]);c.fillRect(0,0,WW,1300);c.restore();
  c.fillStyle='#07080c';for(const mx of [40,560,1050])c.fillRect(mx-14,0,28,1320);c.fillRect(0,1288,WW,34);
  c.fillStyle='rgba(255,210,150,.15)';for(const mx of [40,560,1050])c.fillRect(mx+10,0,3,1300);
  // пол кабинета
  c.fillStyle=LG(c,0,1320,0,HH,[[0,'#16120f'],[1,'#070605']]);c.fillRect(0,1320,WW,HH-1320);
  c.save();c.globalCompositeOperation='screen';c.globalAlpha=.25;c.translate(0,2640);c.scale(1,-1);c.filter='blur(10px)';c.drawImage(c.canvas,0,1000,WW,320,0,1320,WW,320);c.restore();
  // Макс у окна, со спины
  backMan(c,{x:640,y:820,s:1.35,hairC:'#1d140f',suit:'#05060a',neck:'#9a6248',rim:'#ffb27a',R:1,rimA:.95});
  c.save();c.translate(640,820);c.scale(1.35,1.35);rimStroke(c,[headPath({hw:60})],'#8fb8ff',.8,7,-1,90);c.restore();
  c.save();c.globalCompositeOperation='screen';pool(c,640,1500,340,60,'#ffb27a',.25);c.restore();
  // передний план: край стола, лампа, стакан — размыты
  fgBlur(c,9,g=>{g.fillStyle=LG(g,0,1480,0,HH,[[0,'#3a2416'],[1,'#120a06']]);g.beginPath();g.moveTo(-40,1500);g.lineTo(520,1560);g.lineTo(560,HH);g.lineTo(-40,HH);g.closePath();g.fill();
    g.fillStyle='rgba(255,200,140,.25)';g.fillRect(-40,1500,600,10);
    g.fillStyle=RG(g,120,1420,10,260,[[0,'rgba(255,190,110,.9)'],[1,'rgba(255,190,110,0)']]);g.fillRect(-140,1160,520,520);
    g.fillStyle='rgba(220,150,70,.75)';g.beginPath();g.moveTo(380,1560);g.lineTo(470,1560);g.lineTo(462,1660);g.lineTo(388,1660);g.closePath();g.fill();
    g.fillStyle='rgba(255,255,255,.35)';g.fillRect(384,1560,6,96);});
  fin(c,0,{ga:.18,vig:.62});corners(c,.3);
  hudTop(c,'МЕГАПОЛИС · КРЕДИТНЫЙ ОТДЕЛ','2012');
  subLine(c,[['ТЫ',0],['УЖЕ',0],['ХОЗЯИН',1],['ЖИЗНИ',1]],{y:1640,s:104});
  hudBot(c,'01 / 07 · ХОЗЯИН ЖИЗНИ',.07,'00:00:09');
};

/* ===== Копия Дины · 2: клуб, VIP, Миша, 600 000 $ ===== */
function clubHall(c,o={}){const ac=o.ac||'#ff2f8e',ac2=o.ac2||'#38d6ff';
  c.fillStyle=LG(c,0,0,0,HH,[[0,'#07040d'],[.5,'#140820'],[1,'#05030a']]);c.fillRect(0,0,WW,HH);
  // задняя стена со светодиодными полосами
  for(let i=0;i<14;i++){const x=40+i*76;c.fillStyle=LG(c,0,300,0,900,[[0,rgba(i%2?ac:ac2,.0)],[.5,rgba(i%2?ac:ac2,.55)],[1,rgba(i%2?ac:ac2,0)]]);c.fillRect(x,300,8,600);}
  c.fillStyle=LG(c,0,240,0,960,[[0,'rgba(7,4,13,1)'],[.25,'rgba(7,4,13,.55)'],[.75,'rgba(7,4,13,.55)'],[1,'rgba(7,4,13,1)']]);c.fillRect(0,240,WW,720);
  // диджей-пульт вдали
  c.fillStyle='#0b0612';c.fillRect(380,820,320,70);c.fillStyle=rgba(ac2,.7);c.fillRect(380,818,320,4);glowDot(c,540,820,160,ac2,.35);
  // лучи
  const B=[[200,-20,.35,ac],[420,-20,.12,ac2],[660,-20,-.1,ac],[880,-20,-.35,ac2],[540,-20,0,'#ffffff']];
  for(const [x,y,a,col] of B)beam(c,x,y,a,.22,1300,col,.9);
  fog(c,0,900,{n:16,sp:0,h:300,r:520,a:.22,seed:5});
  // танцпол: толпа в 3 ряда
  for(let row=0;row<3;row++){const y=880+row*90,s=.38+row*.14;for(let i=0;i<16;i++){const x=(i+.5)*WW/16+(H1(i*3+row)-.5)*50;
    sil(c,x,y+(H1(i*7+row)-.5)*30,s,{col:row===2?'#06040a':'#0c0714',up:H1(i*5+row)>.5?.6+.4*H1(i):0,both:H1(i*9+row)>.75,side:H1(i+row*3)>.5?1:-1,rim:H1(i)>.5?ac:ac2,ra:.45+row*.15});}}
}
SC.d2=(c,t)=>{clubHall(c);
  // VIP: диван, стол
  c.fillStyle=LG(c,0,1080,0,1500,[[0,'#5a0d1e'],[1,'#22040b']]);rr(c,60,1060,960,330,90);c.fill();
  c.fillStyle='rgba(255,90,140,.18)';rr(c,60,1060,960,24,12);c.fill();
  for(let i=0;i<6;i++){c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=4;c.beginPath();c.moveTo(150+i*156,1080);c.lineTo(150+i*156,1380);c.stroke();}
  // Миша и Макс
  person(c,{x:420,y:1010,s:.95,skin:SKINS.b,hair:'curly',hairC:'#1a120d',beard:2,L:1,turn:.25,look:[.6,0],suit:'#2b1838',shirt:'#9c2a44',mouth:'open',brow:'up',hw:68,jaw:1.1,rim:'#ff4fa0',R:-1,rimA:.9});
  person(c,{x:760,y:1030,s:.9,skin:SKINS.b,hairC:'#1d140f',beard:1,L:-1,turn:-.28,look:[-.8,0],suit:'#0b0d13',open:true,skinC:SKINS.a.b,mouth:'flat',rim:'#46d6ff',R:1,rimA:.6});
  // стол со стеклом, ведро, бутылки
  c.fillStyle=LG(c,0,1400,0,1520,[[0,'#2a2230'],[1,'#0b0910']]);c.beginPath();c.moveTo(120,1420);c.lineTo(960,1420);c.lineTo(1040,1530);c.lineTo(40,1530);c.closePath();c.fill();
  c.fillStyle='rgba(255,255,255,.18)';c.fillRect(120,1420,840,4);
  const bottle=(x,y,s,col)=>{c.save();c.translate(x,y);c.scale(s,s);c.fillStyle=col;c.beginPath();c.moveTo(-26,0);c.lineTo(-26,-120);c.quadraticCurveTo(-26,-150,-10,-165);c.lineTo(-10,-215);c.lineTo(10,-215);c.lineTo(10,-165);c.quadraticCurveTo(26,-150,26,-120);c.lineTo(26,0);c.closePath();c.fill();
    c.fillStyle='#d8b04a';c.fillRect(-11,-228,22,40);c.fillStyle='rgba(255,255,255,.35)';c.fillRect(-18,-130,6,110);c.fillStyle='#e9e2d2';c.fillRect(-20,-90,40,40);c.restore();};
  c.fillStyle=LG(c,250,0,390,0,[[0,'#7d8594'],[.5,'#d9dee6'],[1,'#5d6470']]);c.beginPath();c.moveTo(250,1310);c.lineTo(390,1310);c.lineTo(370,1430);c.lineTo(270,1430);c.closePath();c.fill();
  bottle(300,1330,.8,'#0f2b18');bottle(345,1335,.72,'#1a1a22');bottle(700,1500,.75,'#0f2b18');
  for(const gx of [500,560,820,880]){c.fillStyle='rgba(255,230,170,.55)';c.beginPath();c.moveTo(gx-14,1340);c.lineTo(gx+14,1340);c.lineTo(gx+8,1400);c.lineTo(gx-8,1400);c.closePath();c.fill();c.fillStyle='rgba(255,255,255,.6)';c.fillRect(gx-1,1400,2,24);c.fillRect(gx-10,1424,20,3);}
  // передний план: головы толпы, размыты
  fgBlur(c,12,g=>{for(const [x,y,s] of [[90,1760,1.6],[330,1820,1.3],[980,1740,1.7],[720,1860,1.2]])sil(g,x,y,s,{col:'#030205',rim:'#ff2f8e',ra:.7});});
  fin(c,0,{warm:'#ff3f8e',cool:'#1b2a6b',ga:.22,vig:.6});corners(c,.3);
  bigNum(c,'d2n','600 000 $',540,470,{s:190});tag(c,'ПАРТНЁР УКРАЛ У МИШИ',540,600);
  hudTop(c,'КЛУБ · VIP','02:14');
  subLine(c,[['ДЫРА',0],['В',0],['ШЕСТЬСОТ',1],['ТЫСЯЧ',1]],{y:1640,s:104});
  hudBot(c,'03 / 07 · МИША',.36,'00:00:41');
};

/* ===== А «Твоими глазами» · 1: переговорная, все смотрят в камеру, шеф двигает макет ===== */
function village(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);
  // доска макета в перспективе
  c.fillStyle='#e9e4da';c.beginPath();c.moveTo(-230,-60);c.lineTo(230,-60);c.lineTo(300,80);c.lineTo(-300,80);c.closePath();c.fill();
  c.fillStyle='#5f8a4a';c.beginPath();c.moveTo(-220,-54);c.lineTo(220,-54);c.lineTo(286,72);c.lineTo(-286,72);c.closePath();c.fill();
  c.fillStyle='#4a7038';for(let i=0;i<14;i++){c.beginPath();c.ellipse(-250+i*38+(i%2)*10,60-(i%3)*40,14,9,0,0,TAU);c.fill();}
  c.strokeStyle='#cfc7b8';c.lineWidth=8;c.beginPath();c.moveTo(-20,-54);c.quadraticCurveTo(10,10,-40,72);c.stroke();
  const house=(hx,hy,k)=>{c.save();c.translate(hx,hy);c.scale(k,k);c.fillStyle='#f6f3ee';c.fillRect(-22,-26,44,30);c.fillStyle='#d9d3c8';c.fillRect(22,-24,12,28);
    c.fillStyle='#a83c2c';c.beginPath();c.moveTo(-28,-24);c.lineTo(0,-46);c.lineTo(28,-24);c.closePath();c.fill();c.fillStyle='#7d2a1f';c.beginPath();c.moveTo(28,-24);c.lineTo(0,-46);c.lineTo(38,-22);c.closePath();c.fill();
    c.fillStyle='#8fb3d6';c.fillRect(-14,-16,10,10);c.fillRect(4,-16,10,10);c.restore();};
  for(const [hx,hy,k] of [[-150,-30,.8],[-80,-36,.75],[80,-34,.75],[150,-28,.8],[-190,20,1],[-110,30,1.05],[90,26,1.05],[180,22,1],[-230,70,1.2],[230,66,1.2]])house(hx,hy,k);
  // табличка
  c.fillStyle='#1b1d22';rr(c,-120,82,240,40,6);c.fill();tx(c,'РАЙ МИЛЛИОНЕРОВ',0,110,{f:'M',w:800,s:22,ls:2,c:'#e9c46a'});
  c.restore();}
SC.a1=(c,t)=>{const vx=540,vy=760;
  // стены и потолок в перспективе
  c.fillStyle=LG(c,0,0,0,HH,[[0,'#cfd6df'],[1,'#8c96a3']]);c.fillRect(0,0,WW,HH);
  c.fillStyle='#e8ecf1';c.beginPath();c.moveTo(0,0);c.lineTo(WW,0);c.lineTo(860,380);c.lineTo(220,380);c.closePath();c.fill();
  for(let i=-4;i<=4;i++){c.strokeStyle='rgba(255,255,255,.9)';c.lineWidth=10;c.beginPath();c.moveTo(vx+i*150,0);c.lineTo(vx+i*35,380);c.stroke();}
  c.fillStyle='#b3bcc7';c.beginPath();c.moveTo(0,0);c.lineTo(220,380);c.lineTo(220,920);c.lineTo(0,HH);c.closePath();c.fill();
  c.fillStyle='#a2abb7';c.beginPath();c.moveTo(WW,0);c.lineTo(860,380);c.lineTo(860,920);c.lineTo(WW,HH);c.closePath();c.fill();
  // окно за шефом: дневной Сити
  c.save();c.beginPath();c.rect(220,380,640,540);c.clip();
  c.fillStyle=LG(c,0,380,0,920,[[0,'#9fc3e6'],[1,'#e6eef4']]);c.fillRect(220,380,640,540);
  cityFar(c,860,{col:'#8b9db2',h:40,n:0});moscowCity(c,600,880,.55,{lite:0});
  c.fillStyle='rgba(230,240,250,.35)';c.fillRect(220,380,640,540);c.restore();
  c.fillStyle='#2d333c';for(const mx of [220,433,646,860])c.fillRect(mx-6,380,12,540);c.fillRect(220,374,640,12);
  // шеф во главе стола
  person(c,{x:540,y:730,s:.58,skin:SKINS.o,hair:'grey',hairC:'#a5a8ae',glasses:true,L:-1,look:[0,.4],suit:'#2a2c33',tie:'#5a1b22',mouth:'flat',brow:'frown',rim:'#ffffff',rimA:.6});
  // коллеги по бокам — смотрят в камеру
  const P=[[388,812,.56,1,SKINS.a,'short','#3b2a1e','#1d2330'],[692,812,.56,-1,SKINS.c,'long','#2a1810','#3a2232'],[268,880,.8,1,SKINS.b,'bald','#2a2a2a','#20242c'],
    [812,880,.8,-1,SKINS.a,'short','#5a3a22','#262a33'],[90,1000,1.2,1,SKINS.c,'short','#151010','#1a1d24'],[990,1000,1.2,-1,SKINS.o,'long','#8a5a32','#2c2030']];
  for(const [x,y,s,sd,sk,hr,hc,su] of P)person(c,{x,y,s,skin:sk,hair:hr,hairC:hc,turn:sd*.32,look:[sd*.8,.5],L:-1,suit:su,shirt:hr==='long'?'#e9e2dc':'#e6e6e2',mouth:H1(x)>.5?'flat':'neutral',rimA:.35,rim:'#ffffff',beard:hr==='bald'?1:0});
  // стол
  c.fillStyle=LG(c,0,900,0,HH,[[0,'#3b2a20'],[1,'#1a110c']]);c.beginPath();c.moveTo(400,900);c.lineTo(680,900);c.lineTo(1500,HH);c.lineTo(-420,HH);c.closePath();c.fill();
  c.fillStyle=LG(c,0,900,0,HH,[[0,'rgba(255,255,255,.25)'],[.4,'rgba(255,255,255,.05)'],[1,'rgba(255,255,255,0)']]);c.beginPath();c.moveTo(500,900);c.lineTo(580,900);c.lineTo(760,HH);c.lineTo(320,HH);c.closePath();c.fill();
  // бумаги, стаканы на столе
  for(const [x,y,s,a] of [[470,960,.4,-.1],[640,965,.4,.12],[300,1100,.7,-.2],[800,1110,.7,.2]]){c.save();c.translate(x,y);c.rotate(a);c.scale(s,s);c.fillStyle='#f4f2ec';c.fillRect(-60,-40,120,80);c.fillStyle='rgba(0,0,0,.25)';for(let k=0;k<5;k++)c.fillRect(-48,-28+k*13,90-(k%2)*30,3);c.restore();}
  // макет посёлка едет к камере
  village(c,540,1300,1.15);
  // свой блокнот и ручка — размыты (передний план)
  fgBlur(c,10,g=>{g.save();g.translate(300,1780);g.rotate(-.12);g.fillStyle='#1d2a3a';g.fillRect(-200,-90,420,240);g.fillStyle='#f1efe9';g.fillRect(-180,-80,380,220);g.restore();
    g.save();g.translate(760,1800);g.rotate(.5);g.fillStyle='#0d0d10';g.fillRect(-12,-150,24,300);g.fillStyle='#c9a24a';g.fillRect(-12,-150,24,30);g.restore();});
  fin(c,0,{warm:'#ffd2a0',cool:'#5a7fb0',ga:.15,vig:.5,gr:.05});corners(c,.3);
  c.fillStyle='rgba(10,14,22,.55)';rr(c,46,80,WW-92,56,12);c.fill();hudTop(c,'МЕГАПОЛИС · ПЕРЕГОВОРНАЯ','10:00',{rs:30});
  subLine(c,[['ПОСЛЕДНИЙ',0],['ПРОЕКТ',1],['ПЕРЕД',0],['ПЕНСИЕЙ',1]],{y:1640,s:96});
};

/* ===== А «Твоими глазами» · 2: туалет клуба, зеркало — впервые видим лицо ===== */
function tiles(c,x0,y0,x1,y1,o={}){c.fillStyle=o.base||'#d9dde0';c.fillRect(x0,y0,x1-x0,y1-y0);const tw=o.w||80,th=o.h||40;
  c.strokeStyle=o.grout||'rgba(60,70,75,.55)';c.lineWidth=3;for(let j=0;y0+j*th<y1;j++){const off=(j%2)*tw/2;c.beginPath();c.moveTo(x0,y0+j*th);c.lineTo(x1,y0+j*th);c.stroke();
    for(let i=-1;x0+i*tw+off<x1;i++){c.beginPath();c.moveTo(x0+i*tw+off,y0+j*th);c.lineTo(x0+i*tw+off,y0+(j+1)*th);c.stroke();
      if(H2(i+11,j)>.82){c.fillStyle=`rgba(${o.dirt||'90,80,60'},${.08+.12*H2(i,j)})`;c.fillRect(x0+i*tw+off+3,y0+j*th+3,tw-6,th-6);}}}}
SC.a2=(c,t)=>{
  // стена с плиткой, холодный свет
  tiles(c,0,0,WW,HH,{base:'#c9d2d8'});
  c.fillStyle=LG(c,0,0,0,HH,[[0,'rgba(10,20,30,.15)'],[.5,'rgba(10,20,30,.35)'],[1,'rgba(5,8,12,.8)']]);c.fillRect(0,0,WW,HH);
  // зеркало
  const mx=150,my=300,mw=780,mh=930;c.fillStyle='#1c2126';rr(c,mx-22,my-22,mw+44,mh+44,26);c.fill();
  c.save();rr(c,mx,my,mw,mh,14);c.clip();
  // отражение: противоположная стена, кабинки, лампа
  c.fillStyle=LG(c,0,my,0,my+mh,[[0,'#7e8e98'],[1,'#2a3238']]);c.fillRect(mx,my,mw,mh);
  tiles(c,mx,my,mx+mw,my+mh,{base:'#9aa7af',w:60,h:30,grout:'rgba(40,50,55,.5)'});
  c.fillStyle='rgba(20,28,34,.45)';c.fillRect(mx,my,mw,mh);
  for(const [sx,w] of [[mx-30,250],[mx+250,240],[mx+520,260]]){c.fillStyle='#2b3138';c.fillRect(sx,my+260,w-16,mh);c.fillStyle='rgba(255,255,255,.06)';c.fillRect(sx,my+260,6,mh);c.fillStyle='#8a9096';c.fillRect(sx+w-50,my+560,10,40);}
  c.fillStyle='#e8f6ff';c.fillRect(mx+180,my+40,420,18);glowDot(c,mx+390,my+50,300,'#c8e0ff',.6);
  // лицо Макса
  person(c,{x:540,y:760,s:2.3,skin:SKINS.b,hairC:'#1d140f',beard:1,L:1,look:[0,0],suit:'#0b0d13',open:true,skinC:SKINS.b.b,mouth:'flat',brow:'frown',tired:.8,rim:'#c8e0ff',R:-1,rimA:.25});
  // мутное стекло, разводы
  c.fillStyle=RG(c,mx+mw/2,my+mh/2,mw*.35,mw*.8,[[0,'rgba(255,255,255,0)'],[1,'rgba(220,235,245,.28)']]);c.fillRect(mx,my,mw,mh);
  c.globalCompositeOperation='screen';c.fillStyle=LG(c,mx,my,mx+mw,my+mh,[[0,'rgba(255,255,255,0)'],[.35,'rgba(255,255,255,.07)'],[.4,'rgba(255,255,255,0)'],[.6,'rgba(255,255,255,0)'],[.66,'rgba(255,255,255,.05)'],[.7,'rgba(255,255,255,0)']]);c.fillRect(mx,my,mw,mh);
  c.restore();
  // лампа над зеркалом (настоящая) и её конус
  c.fillStyle='#f2fbff';rr(c,240,150,600,26,13);c.fill();glowDot(c,540,163,420,'#c8e0ff',.8);beam(c,540,170,0,.9,1500,'#c8e0ff',.55);
  // раковина: чёрный мрамор
  c.fillStyle=LG(c,0,1270,0,1520,[[0,'#2a2c31'],[1,'#0c0d10']]);c.beginPath();c.moveTo(60,1270);c.lineTo(1020,1270);c.lineTo(1080,1540);c.lineTo(0,1540);c.closePath();c.fill();
  c.strokeStyle='rgba(230,235,240,.22)';c.lineWidth=2;for(let i=0;i<9;i++){c.beginPath();let x=H1(i*3)*WW,y=1280;c.moveTo(x,y);for(let k=0;k<6;k++){x+=(H1(i*7+k)-.5)*120;y+=45;c.lineTo(x,y);}c.stroke();}
  c.fillStyle='rgba(255,255,255,.14)';c.fillRect(60,1270,960,5);
  c.fillStyle='#e9eef1';c.beginPath();c.ellipse(540,1390,250,70,0,0,TAU);c.fill();c.fillStyle=LG(c,0,1330,0,1450,[[0,'#9aa5ad'],[1,'#eef3f6']]);c.beginPath();c.ellipse(540,1395,220,55,0,0,TAU);c.fill();
  c.fillStyle='#b9c2c9';c.fillRect(528,1250,24,90);c.beginPath();c.ellipse(540,1250,46,12,0,0,TAU);c.fill();c.fillStyle='#eef4f7';c.fillRect(531,1252,6,80);
  // чёрная карта на мраморе
  c.save();c.translate(830,1460);c.rotate(-.18);c.fillStyle='#08080a';rr(c,-95,-58,190,116,12);c.fill();c.fillStyle='rgba(255,255,255,.12)';c.fillRect(-80,-20,50,30);tx(c,'MEGAPOLIS',30,40,{f:'M',w:700,s:14,ls:3,c:'rgba(210,210,215,.6)'});c.restore();
  c.fillStyle=LG(c,0,1540,0,HH,[[0,'#0b0d10'],[1,'#030405']]);c.fillRect(0,1540,WW,HH-1540);
  fin(c,0,{warm:'#cfe6ff',cool:'#203040',ga:.18,vig:.75,gr:.07});corners(c,.3);
  hudTop(c,'КЛУБ · ТУАЛЕТ','03:12',{rs:30});
  subLine(c,[['ТЫ',0],['ПОДНИМАЕШЬ',0],['ГЛАЗА…',1]],{y:1690,s:92});
};

/* ===== Б «Без остановки» · 1: полёт низко над Москвой-рекой к Сити ===== */
SC.b1=(c,t)=>{const HZ=820,F=1000,HC=170,P=(X,h,Z)=>[540+X*F/Z,HZ+(HC-h)*F/Z];
  c.fillStyle=LG(c,0,0,0,HZ+40,[[0,'#050914'],[.55,'#1a1f45'],[1,'#8a4a4a']]);c.fillRect(0,0,WW,HZ+40);
  c.fillStyle=RG(c,560,HZ,10,700,[[0,'rgba(255,150,90,.5)'],[1,'rgba(255,120,60,0)']]);c.fillRect(0,0,WW,HZ+300);
  for(let i=0;i<60;i++){c.fillStyle=`rgba(255,255,255,${.15+.4*H1(i*7.1)})`;c.fillRect(H1(i*3.3)*WW,H1(i*5.9)*400,2,2);}
  // Сити впереди и высотка
  moscowCity(c,590,HZ+18,.6,{lite:.5});stalinka(c,330,HZ+14,.3,'#3a3150');
  // вода
  c.fillStyle=LG(c,0,HZ,0,HH,[[0,'#2a2140'],[.25,'#0e1630'],[1,'#03060d']]);c.fillRect(0,HZ,WW,HH-HZ);
  // дома набережных: фасады вдоль реки
  const QD=(pts,fill)=>{c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(const q of pts)c.lineTo(q[0],q[1]);c.closePath();c.fillStyle=fill;c.fill();};
  const blds=[];for(const sd of [-1,1]){let Z=9000;let k=0;while(Z>260){const len=500+H1(k*3.7+sd)*900,h=220+H1(k*5.1+sd*2)*520,Z1=Math.max(240,Z-len);blds.push({sd,Z0:Z1,Z1:Z,h,k,col:['#3b3346','#4a3a3a','#3a3f52','#52443a'][(k+(sd>0?1:0))%4]});Z=Z1-60-H1(k*9+sd)*120;k++;}}
  blds.sort((a,b)=>b.Z1-a.Z1);
  const XB=560;
  for(const B of blds){const X=B.sd*XB,A=P(X,0,B.Z0),Bp=P(X,B.h,B.Z0),C=P(X,B.h,B.Z1),D=P(X,0,B.Z1);
    QD([A,Bp,C,D],LG(c,A[0],0,D[0],0,[[0,sh(B.col,.05)],[1,sh(B.col,-.45)]]));
    // окна
    const nf=Math.floor(B.h/42),nc=Math.floor((B.Z1-B.Z0)/90);
    for(let fi=0;fi<nf;fi++)for(let ci=0;ci<nc;ci++){const r=H2(ci+B.k*13+B.sd*7,fi);if(r>.55)continue;const z0=B.Z0+ci*90+20,z1=z0+46,h0=24+fi*42,h1=h0+22;
      const q=[P(X,h0,z0),P(X,h1,z0),P(X,h1,z1),P(X,h0,z1)];QD(q,r<.42?`rgba(255,${185+(r*120|0)},${100+(r*150|0)},${.55+.4*r})`:`rgba(150,190,240,${.35+.4*r})`);}
    // карниз
    const T0=P(X,B.h+18,B.Z0),T1=P(X,B.h+18,B.Z1);QD([Bp,T0,T1,C],sh(B.col,-.2));}
  // набережные: дорога с фарами
  for(const sd of [-1,1]){c.save();c.lineCap='round';
    for(let k=0;k<2;k++){c.beginPath();for(let Z=250;Z<9000;Z*=1.05){const [sx,sy]=P(sd*(440+k*50),6,Z);Z===250?c.moveTo(sx,sy):c.lineTo(sx,sy);}
      c.strokeStyle=k?'rgba(255,70,60,.75)':'rgba(255,235,205,.85)';c.lineWidth=k?4:5;c.shadowColor=k?'#ff3b30':'#ffe0a0';c.shadowBlur=16;c.stroke();}
    c.beginPath();for(let Z=250;Z<9000;Z*=1.05){const [sx,sy]=P(sd*400,0,Z);Z===250?c.moveTo(sx,sy):c.lineTo(sx,sy);}c.strokeStyle='rgba(20,18,30,.9)';c.lineWidth=6;c.shadowBlur=0;c.stroke();c.restore();
    for(let Z=400;Z<8000;Z*=1.16){const [lx,ly]=P(sd*410,60,Z),[bx,by]=P(sd*410,0,Z);c.strokeStyle='#0b0a12';c.lineWidth=Math.max(1,6*F/Z);c.beginPath();c.moveTo(bx,by);c.lineTo(lx,ly);c.stroke();glowDot(c,lx,ly,Math.max(4,60*F/Z),'#ffc070',.9);}}
  // мост с арками
  {const Z=2400,y0=P(0,0,Z)[1],y1=P(0,70,Z)[1],xl=P(-600,0,Z)[0],xr=P(600,0,Z)[0];c.fillStyle='#0b0a12';c.fillRect(xl,y1,xr-xl,(y0-y1)*.35);
    for(let i=0;i<3;i++){const ax=lp(xl,xr,(i+.5)/3),aw=(xr-xl)/3*.42;c.beginPath();c.moveTo(ax-aw,y0);c.quadraticCurveTo(ax,y1+(y0-y1)*.2,ax+aw,y0);c.lineTo(ax+aw+6,y0);c.lineTo(ax+aw+6,y1+(y0-y1)*.3);c.lineTo(ax-aw-6,y1+(y0-y1)*.3);c.lineTo(ax-aw-6,y0);c.closePath();c.fill();}
    for(let i=0;i<=14;i++)glowDot(c,lp(xl,xr,i/14),y1-4,12,'#ffd27a',.9);}
  // отражение в воде: перевёрнутая верхняя часть, размыта, рябь
  {const g=TB.getContext('2d');reset(g);g.clearRect(0,0,WW,HH);g.drawImage(c.canvas,0,0);
   c.save();c.beginPath();c.rect(0,HZ,WW,HH-HZ);c.clip();c.globalAlpha=.42;c.translate(0,2*HZ+6);c.scale(1,-1.15);c.filter='blur(5px)';c.drawImage(TB,0,0,WW,HZ,0,0,WW,HZ);c.restore();
   c.fillStyle=LG(c,0,HZ,0,HH,[[0,'rgba(3,6,13,0)'],[.5,'rgba(3,6,13,.55)'],[1,'rgba(3,6,13,.92)']]);c.fillRect(0,HZ,WW,HH-HZ);
   c.strokeStyle='rgba(3,6,13,.55)';for(let i=0;i<70;i++){const y=HZ+Math.pow(i/70,1.8)*(HH-HZ),w=2+i*.12;c.lineWidth=w*.5;c.beginPath();c.moveTo(0,y);for(let x=0;x<=WW;x+=60)c.lineTo(x,y+Math.sin(x*.02+i)*w*.6);c.stroke();}}
  // речной трамвай
  {const Z=1500,[bx,by]=P(-160,0,Z),k=F/Z;c.save();c.translate(bx,by);c.scale(k,k);c.fillStyle='#0d0c16';c.beginPath();c.moveTo(-160,0);c.lineTo(170,0);c.lineTo(140,-34);c.lineTo(-150,-34);c.closePath();c.fill();
   c.fillStyle='#e9e4dc';c.fillRect(-120,-70,220,36);for(let i=0;i<9;i++){c.fillStyle='rgba(255,210,140,.95)';c.fillRect(-110+i*24,-62,16,18);}c.fillStyle='#0d0c16';c.fillRect(-120,-76,220,8);c.restore();
   glowDot(c,bx,by-60*k,140*k,'#ffc070',.5);c.save();c.globalCompositeOperation='screen';c.fillStyle='rgba(255,200,130,.25)';c.fillRect(bx-120*k,by+4,240*k,60);c.restore();}
  fog(c,0,HZ-10,{n:12,sp:0,h:60,r:520,a:.2,seed:9});
  {const g=TA.getContext('2d');reset(g);g.clearRect(0,0,WW,HH);g.drawImage(c.canvas,0,0);zoomBlur(c,TA,580,HZ-40,1,.05,7,.9);}
  glowDot(c,600,HZ-232,40,'#ffd27a',1);
  fin(c,0,{warm:'#ff9a5c',cool:'#1b2b6b',ga:.2,vig:.7});corners(c,.3);
  hudTop(c,'МОСКВА · НАБЕРЕЖНАЯ','21:40');
  subLine(c,[['ТВОЯ',0],['ЖИЗНЬ',0],['НЕ',1],['ОСТАНАВЛИВАЕТСЯ',1]],{y:1640,s:96});
};

/* ===== Б «Без остановки» · 2: 06:00, квартира, всё встало ===== */
SC.b2=(c,t)=>{
  // стена и пол
  c.fillStyle=LG(c,0,0,0,1150,[[0,'#2b313b'],[1,'#3c4450']]);c.fillRect(0,0,WW,1150);
  c.fillStyle=LG(c,0,1150,0,HH,[[0,'#2a2622'],[1,'#0f0d0c']]);c.fillRect(0,1150,WW,HH-1150);
  c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=2;for(let i=-12;i<=12;i++){c.beginPath();c.moveTo(540+i*60,1150);c.lineTo(540+i*260,HH);c.stroke();}
  // окно с жалюзи: рассвет, вдали высотка
  const wx=70,wy=200,ww=470,wh=780;c.save();c.beginPath();c.rect(wx,wy,ww,wh);c.clip();
  c.fillStyle=LG(c,0,wy,0,wy+wh,[[0,'#8b9cb4'],[.7,'#c7ccd4'],[1,'#e0c9b4']]);c.fillRect(wx,wy,ww,wh);
  stalinka(c,330,wy+wh-60,.42,'#6d7586');cityFar(c,wy+wh-40,{col:'#6a7282',h:30,n:0});
  for(let i=0;i<30;i++){c.fillStyle='#d6dbe2';c.fillRect(wx,wy+i*26,ww,15);c.fillStyle='rgba(0,0,0,.15)';c.fillRect(wx,wy+i*26+14,ww,2);}
  c.restore();c.fillStyle='#1b1f26';c.fillRect(wx-14,wy-14,ww+28,14);c.fillRect(wx-14,wy+wh,ww+28,18);c.fillRect(wx-14,wy,14,wh);c.fillRect(wx+ww,wy,14,wh);
  // полосы света от жалюзи на стене и полу
  c.save();c.globalCompositeOperation='screen';for(let i=0;i<16;i++){c.fillStyle='rgba(190,205,230,.13)';c.beginPath();const y=260+i*48;c.moveTo(560,y);c.lineTo(1080,y+260);c.lineTo(1080,y+282);c.lineTo(560,y+20);c.closePath();c.fill();}
  for(let i=0;i<10;i++){c.fillStyle='rgba(190,205,230,.08)';c.beginPath();const x=100+i*70;c.moveTo(x,1150);c.lineTo(x+40,1150);c.lineTo(x+360,HH);c.lineTo(x+250,HH);c.closePath();c.fill();}c.restore();
  dust(c,0,300,200,-.9,.5,1400,90,7,.8);
  // часы на тумбе: 06:00
  c.fillStyle='#14161b';c.fillRect(820,800,240,18);c.fillStyle='#0a0b0d';rr(c,860,716,180,84,10);c.fill();
  tx(c,'06:00',950,776,{f:'J',w:700,s:54,c:'#ff3b30',glow:'#ff3b30'});glowDot(c,950,760,130,'#ff3b30',.35);
  // диван и Макс: рубашка, без пиджака, смотрит вниз
  // диван: спинка из двух подушек, подлокотники
  c.fillStyle='#2c2f35';rr(c,170,930,740,330,50);c.fill();
  for(const x of [210,545]){c.fillStyle=LG(c,0,950,0,1220,[[0,'#4a4e57'],[1,'#2a2d33']]);rr(c,x,950,330,250,44);c.fill();c.fillStyle='rgba(255,255,255,.05)';rr(c,x+10,958,310,20,10);c.fill();}
  // Макс: сидит, ссутулился, голова опущена
  const M={x:600,y:930,s:.98,skin:SKINS.b,hairC:'#1d140f',beard:1,L:-1,look:[0,1],suit:'#d9d7d2',shirt:'#d9d7d2',open:true,skinC:SKINS.b.b,mouth:'flat',brow:'frown',tired:1,rim:'#c9d6ea',R:-1,rimA:.6};
  bust(c,M);c.save();c.translate(600,972);c.rotate(-.13);c.translate(-600,-972);head(c,{...M,y:972});c.restore();
  c.fillStyle=LG(c,0,1180,0,1420,[[0,'#41454d'],[1,'#202227']]);rr(c,150,1180,780,290,34);c.fill();c.fillStyle='rgba(255,255,255,.06)';rr(c,150,1180,780,18,9);c.fill();
  for(const x of [120,890]){c.fillStyle=LG(c,x,0,x+80,0,[[0,'#3a3e46'],[1,'#25282e']]);rr(c,x,1060,90,410,36);c.fill();}
  // пол: пиджак, бутылки, телефон
  c.save();c.translate(780,1560);c.rotate(.2);c.fillStyle='#0b0d13';c.beginPath();c.moveTo(-220,-40);c.quadraticCurveTo(-60,-120,160,-60);c.lineTo(230,60);c.quadraticCurveTo(0,120,-200,70);c.closePath();c.fill();
  c.strokeStyle='rgba(255,255,255,.08)';c.lineWidth=3;c.beginPath();c.moveTo(-100,-60);c.lineTo(-20,60);c.stroke();c.restore();
  c.save();c.translate(480,1500);c.rotate(1.35);c.fillStyle='#0f2b18';rr(c,-30,-110,60,170,18);c.fill();c.fillRect(-12,-170,24,70);c.fillStyle='#d8b04a';c.fillRect(-12,-182,24,22);c.fillStyle='rgba(255,255,255,.3)';c.fillRect(-20,-90,6,120);c.restore();
  c.save();c.translate(270,1640);c.rotate(-.25);c.fillStyle='#050507';rr(c,-95,-170,190,340,26);c.fill();c.fillStyle=LG(c,0,-150,0,150,[[0,'#1d2433'],[1,'#0e1219']]);rr(c,-84,-158,168,316,18);c.fill();
  tx(c,'Вадим',0,-40,{f:'M',w:700,s:30,c:'#fff'});tx(c,'автоответчик',0,0,{f:'M',w:500,s:20,c:'rgba(255,255,255,.6)'});
  c.fillStyle='#ff3b30';c.beginPath();c.arc(0,100,26,0,TAU);c.fill();c.strokeStyle='#fff';c.lineWidth=4;c.beginPath();c.moveTo(-10,100);c.lineTo(10,100);c.stroke();c.restore();
  glowDot(c,270,1640,260,'#6f8cff',.25);
  fin(c,0,{warm:'#d9c0a8',cool:'#3a5070',ga:.22,vig:.75,gr:.07});corners(c,.3);
  hudTop(c,'КВАРТИРА · УТРО','06:00',{rc:'#ff5a4e'});
  subLine(c,[['ВЫ',0],['УВОЛЕНЫ,',1],['МАКС',0]],{y:1300,s:104});
};
