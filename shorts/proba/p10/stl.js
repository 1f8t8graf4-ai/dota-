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
function toiletScene(c,o={}){
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
}
SC.a2=(c,t)=>{toiletScene(c);
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

/* ================= ТЗ Gemini: 4 стиля × 2 кадра ================= */
// мрамор: тёмный с белыми прожилками
function marbleTex(){return cache('marble',1024,1024,(g,w,h)=>{const t=mkc(w,h),x=t.getContext('2d'),im=x.createImageData(w,h),d=im.data;
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const v=fbm(i/200,j/200,5),m=Math.abs(Math.sin((i*.008+j*.004+v*5)*1.2)),m2=Math.abs(Math.sin((i*.003-j*.009+v*7)*1.7)),vein=Math.pow(1-m,14)*.55+Math.pow(1-m2,30)*.35,b=20+v*30+vein*120,p=(j*w+i)*4;d[p]=b*.96;d[p+1]=b*.98;d[p+2]=b*1.05;d[p+3]=255;}
  x.putImageData(im,0,0);g.filter='blur(1.2px)';g.drawImage(t,0,0);});}// текст «как в кино»: тонкий гротеск, мягкая тень
function subThin(c,lines,o={}){c.save();font(c,{f:'M',w:o.w||600,s:o.s||50,ls:.5});c.textAlign='center';c.textBaseline='middle';
  lines.forEach((l,i)=>{c.shadowColor='rgba(0,0,0,.85)';c.shadowBlur=18;c.shadowOffsetY=2;c.fillStyle=o.col||'#f2f2f2';c.fillText(l,540,(o.y||1600)+i*(o.lh||66));});c.restore();}
function hudReal(c,left,right,o={}){c.save();c.shadowColor='rgba(0,0,0,.7)';c.shadowBlur=8;tx(c,left,70,118,{f:'M',w:600,s:24,ls:4,al:'left',c:'rgba(255,255,255,.88)'});
  tx(c,right,WW-70,118,{f:'M',w:700,s:26,ls:3,al:'right',c:o.rc||'#ffffff'});
  if(o.k!=null){c.fillStyle='rgba(255,255,255,.2)';c.fillRect(WW-290,134,220,4);c.fillStyle=o.rc||'#fff';c.fillRect(WW-290,134,220*o.k,4);}c.restore();}
const OFF=mkc(WW,HH);
function blurred(c,px,fn,a=1){const g=OFF.getContext('2d');reset(g);g.clearRect(0,0,WW,HH);fn(g);c.save();c.globalAlpha=a;c.filter=`blur(${px}px)`;c.drawImage(OFF,0,0);c.restore();}

/* ---- 1. «Около реализма» · Духless · туалет клуба: мрамор, карта, лампа ---- */
SC.g1a=(c,t)=>{
  const cam=cam3({...lookAt([0,-250,-60],[0,0,430],1050),cy:900});
  // задний план: плитка + запотевшее зеркало, размыто
  blurred(c,4,g=>{tiles(g,0,0,WW,1100,{base:'#c9d2d8',w:110,h:54,grout:'rgba(60,70,76,.55)'});g.fillStyle='rgba(12,16,22,.35)';g.fillRect(0,0,WW,1100);
    g.save();rr(g,120,150,840,820,10);g.clip();tiles(g,0,0,WW,1100,{base:'#8b979f',w:80,h:40,grout:'rgba(40,48,54,.5)'});
    for(const [x,w] of [[90,230],[350,230],[610,230],[870,230]]){g.fillStyle='#2f363d';g.fillRect(x,330,w-20,700);g.fillStyle='rgba(255,255,255,.08)';g.fillRect(x,330,5,700);g.fillStyle='#9aa0a6';g.fillRect(x+w-56,620,10,36);}
    g.fillStyle='rgba(220,236,250,.18)';g.fillRect(120,150,840,820);g.fillStyle='rgba(8,10,14,.85)';g.beginPath();g.ellipse(560,560,120,150,0,0,TAU);g.fill();g.beginPath();g.ellipse(560,900,280,190,0,0,TAU);g.fill();
    g.fillStyle=RG(g,540,560,100,600,[[0,'rgba(255,255,255,0)'],[1,'rgba(235,242,248,.35)']]);g.fillRect(120,150,840,820);g.restore();
    g.strokeStyle='#1a1f24';g.lineWidth=16;rr(g,120,150,840,820,10);g.stroke();});
  // столешница: мрамор в перспективе
  texPlane(c,cam,marbleTex(),[-900,0,-120],[1800,0,0],[0,0,1100],12,12);
  {const fe=cam.P(0,0,980);c.fillStyle='rgba(255,255,255,.22)';c.fillRect(0,fe[1]-2,WW,3);}
  // мокрый блик от лампы
  {const p=cam.P(40,0,520);pool(c,p[0],p[1],460,170,'#d6ecff',.5);}
  // карта и две дорожки (на плоскости)
  const quad=(pts,fill)=>{const q=pts.map(v=>cam.P(v[0],v[1],v[2]));c.beginPath();c.moveTo(q[0][0],q[0][1]);for(const v of q)c.lineTo(v[0],v[1]);c.closePath();c.fillStyle=fill;c.fill();return q;};
  const rot=(x,z,a,cx,cz)=>[cx+x*Math.cos(a)-z*Math.sin(a),0,cz+x*Math.sin(a)+z*Math.cos(a)];
  const card=(dx,dy)=>[[-86,-54],[86,-54],[86,54],[-86,54]].map(([x,z])=>{const r=rot(x,z,-.32,110+dx,300+dy);return r;});
  c.save();c.filter='blur(10px)';quad(card(14,-16),'rgba(0,0,0,.65)');c.restore();
  {const ct=cache('card',344,216,(g,w,h)=>{g.fillStyle=LG(g,0,0,w,h,[[0,'#16161a'],[.5,'#08080a'],[1,'#121216']]);rr(g,0,0,w,h,16);g.fill();
      g.fillStyle=LG(g,40,70,90,110,[[0,'#d9b45a'],[1,'#8a6a24']]);rr(g,36,72,54,42,6);g.fill();g.strokeStyle='rgba(60,40,10,.6)';g.lineWidth=1;g.strokeRect(48,80,30,26);
      g.font='600 22px Man';g.fillStyle='rgba(200,200,205,.7)';g.letterSpacing='4px';g.fillText('4276  ••••  ••••  0912',36,160);g.font='700 18px Man';g.fillText('MEGAPOLIS',36,44);g.fillText('M. ANDREEV',36,196);});
    const c0=card(0,0);texPlane(c,cam,ct,c0[3],[c0[2][0]-c0[3][0],0,c0[2][2]-c0[3][2]],[c0[0][0]-c0[3][0],0,c0[0][2]-c0[3][2]],4,4);}
  {const q=card(0,0).map(v=>cam.P(v[0],v[1],v[2]));c.save();c.beginPath();c.moveTo(q[0][0],q[0][1]);for(const v of q)c.lineTo(v[0],v[1]);c.closePath();c.clip();
    c.fillStyle=LG(c,q[0][0],q[0][1],q[2][0],q[2][1],[[0,'rgba(255,255,255,0)'],[.45,'rgba(220,235,255,.22)'],[.55,'rgba(255,255,255,0)']]);c.fillRect(0,0,WW,HH);c.restore();}
  c.save();c.filter='blur(1.5px)';for(const dz of [-16,16]){quad([rot(-40,dz-2.5,-.1,-40,330),rot(40,dz-2.5,-.1,-40,330),rot(40,dz+2.5,-.1,-40,330),rot(-40,dz+2.5,-.1,-40,330)],'rgba(236,238,242,.85)');}c.restore();
  for(let i=0;i<40;i++){const v=cam.P(-40+(H1(i)-.5)*100,0,330+(H1(i*3)-.5)*50);c.fillStyle='rgba(240,240,240,.5)';c.fillRect(v[0],v[1],2,2);}
  // лампа сверху: жёсткий конус
  c.fillStyle='#f4fbff';rr(c,330,0,420,22,8);c.fill();glowDot(c,540,10,380,'#c8e0ff',.7);beam(c,540,10,0,1.0,1500,'#c8e0ff',.75);
  // передний план: косяк двери, размыт
  blurred(c,12,g=>{g.fillStyle=LG(g,0,0,200,0,[[0,'#050506'],[.7,'#15161a'],[1,'#2a2c31']]);g.fillRect(-40,0,180,HH);g.fillStyle='rgba(220,235,255,.35)';g.fillRect(132,0,6,HH);
    g.fillStyle='#08080a';g.fillRect(960,1300,200,700);});
  fin(c,0,{warm:'#d8ecff',cool:'#1e2a38',ga:.2,vig:.8,gr:.09});
  hudReal(c,'МОСКВА · КЛУБ · 03:12','ПУСТОТА: 82%',{k:.82,rc:'#b7d4ff'});
  subThin(c,['Чёрная карта ложится на мрамор,','рядом — две ровные дорожки.'],{y:1610});
};

/* ---- 1. «Около реализма» · Духless · ночная Москва за тонированным стеклом машины ---- */
SC.g1b=(c,t)=>{
  c.fillStyle=LG(c,0,0,0,400,[[0,'#121214'],[1,'#060607']]);c.fillRect(0,0,WW,HH);
  blurred(c,6,g=>{g.fillStyle='#1c1c20';rr(g,420,170,260,60,30);g.fill();g.fillStyle='#08080a';rr(g,445,185,210,30,15);g.fill();});
  const win=new Path2D();win.moveTo(70,1180);win.lineTo(70,560);win.bezierCurveTo(70,470,130,420,240,400);win.lineTo(1010,330);win.lineTo(1010,1180);win.closePath();
  c.save();c.clip(win);
  // улица и Сити за стеклом — размыто
  blurred(c,5,g=>{g.fillStyle=LG(g,0,300,0,1200,[[0,'#0a1028'],[.6,'#2a2550'],[1,'#7a3a40']]);g.fillRect(0,300,WW,900);
    moscowCity(g,620,1060,.85,{lite:.55});stalinka(g,180,1080,.36,'#3c3352');cityFar(g,1090,{col:'#0d0f1c',h:40,n:260});
    g.fillStyle='#0a0a10';g.fillRect(0,1090,WW,120);cars(g,1100,{n:60});});
  c.drawImage(bokeh('g1b',WW,HH,46,['#ffb870','#ff5a4e','#9fc8ff','#ffe0b0'],14,60,4,2),0,0);
  // тонировка
  c.fillStyle='rgba(8,14,12,.32)';c.fillRect(0,0,WW,HH);
  // отражение лица в стекле
  {const g=OFF.getContext('2d');reset(g);g.clearRect(0,0,WW,HH);head(g,{x:780,y:760,s:1.8,skin:SKINS.b,hairC:'#3a2a20',beard:1,L:-1,turn:.35,look:[-.6,0],mouth:'flat',tired:.5,rimA:0});
   c.save();c.globalAlpha=.22;c.filter='grayscale(1) brightness(.55) blur(1.5px)';c.globalCompositeOperation='screen';c.drawImage(OFF,0,0);c.restore();}
  // блик фар по стеклу
  c.save();c.globalCompositeOperation='screen';c.fillStyle=LG(c,0,0,WW,0,[[0,'rgba(255,230,200,0)'],[.45,'rgba(255,230,200,.0)'],[.58,'rgba(255,236,210,.3)'],[.7,'rgba(255,230,200,0)']]);
  c.beginPath();c.moveTo(380,330);c.lineTo(700,330);c.lineTo(520,1180);c.lineTo(200,1180);c.closePath();c.fill();
  c.fillStyle=LG(c,0,870,0,910,[[0,'rgba(255,240,220,0)'],[.5,'rgba(255,240,220,.35)'],[1,'rgba(255,240,220,0)']]);c.fillRect(0,870,WW,40);c.restore();
  // капли
  for(let i=0;i<50;i++){const x=80+H1(i*3)*920,y=420+H1(i*7)*740,r=3+H1(i*5)*7;c.fillStyle='rgba(200,220,255,.18)';c.beginPath();c.ellipse(x,y,r*.8,r,0,0,TAU);c.fill();c.fillStyle='rgba(255,255,255,.35)';c.fillRect(x-r*.3,y-r*.5,1.5,2);}
  c.restore();
  // рамка окна, стойка, дверная карта (кожа)
  c.lineWidth=26;c.strokeStyle='#0c0c0e';c.stroke(win);c.strokeStyle='rgba(255,255,255,.08)';c.lineWidth=2;c.stroke(win);
  blurred(c,7,g=>{g.fillStyle=LG(g,0,1180,0,HH,[[0,'#1a1a1d'],[1,'#060607']]);g.fillRect(0,1180,WW,HH-1180);
    g.fillStyle='rgba(255,255,255,.05)';for(let i=0;i<30;i++)g.fillRect(0,1240+i*22,WW,1);
    g.strokeStyle='rgba(180,150,110,.35)';g.setLineDash([10,8]);g.lineWidth=2;g.beginPath();g.moveTo(0,1300);g.lineTo(WW,1300);g.stroke();g.setLineDash([]);
    g.fillStyle=LG(g,600,0,900,0,[[0,'#8a8d93'],[.5,'#e6e8eb'],[1,'#6a6d73']]);rr(g,620,1360,300,46,22);g.fill();
    g.fillStyle='#0d0d10';rr(g,140,1340,240,90,14);g.fill();g.fillStyle='rgba(255,255,255,.2)';g.fillRect(170,1370,60,30);g.fillRect(260,1370,60,30);});
  fin(c,0,{warm:'#ffcc9a',cool:'#14303a',ga:.2,vig:.8,gr:.09});
  hudReal(c,'МОСКВА · САДОВОЕ · 03:48','ПУСТОТА: 82%',{k:.82,rc:'#b7d4ff'});
  subThin(c,['Кажется, ты держишь этот город','на поводке.'],{y:1610});
};

/* ---- 2. «Чистая Династия» · Волк с Уолл-стрит · торговый зал-арена ---- */
function tradeHall(c,o={}){const AM='#f5a623';
  c.fillStyle=LG(c,0,0,0,HH,[[0,'#05070d'],[.45,'#0e1626'],[1,'#070a12']]);c.fillRect(0,0,WW,HH);
  // табло с котировками на задней стене
  c.fillStyle='#04060b';c.fillRect(60,360,960,260);c.strokeStyle='rgba(245,166,35,.35)';c.lineWidth=3;c.strokeRect(60,360,960,260);
  const TK=['STRT +4.2','ABCD +12.5','PNX −1.3','DNCN +8.9','SKYE +3.1','ZRX −0.7','BRM +21.0','KLMR +6.6'];
  for(let r=0;r<3;r++)for(let i=0;i<4;i++){const s=TK[(r*4+i)%TK.length],up=!s.includes('−');tx(c,s,170+i*228,420+r*72,{f:'J',w:700,s:28,c:up?'#3ddc84':'#ff4d4d'});}
  c.fillStyle='rgba(245,166,35,.12)';c.fillRect(60,360,960,260);
  // фермы и софиты
  c.strokeStyle='#1a2233';c.lineWidth=6;for(const y of [150,210]){c.beginPath();c.moveTo(0,y);c.lineTo(WW,y);c.stroke();}
  for(let x=0;x<WW;x+=60){c.beginPath();c.moveTo(x,150);c.lineTo(x+60,210);c.moveTo(x+60,150);c.lineTo(x,210);c.lineWidth=3;c.stroke();}
  for(const [x,a,col] of [[160,.35,AM],[380,.12,'#ffffff'],[700,-.12,'#ffffff'],[920,-.35,AM]]){c.fillStyle='#0b0f17';rr(c,x-26,205,52,40,8);c.fill();beam(c,x,240,a,.32,1500,col,.85);glowDot(c,x,240,40,col,.9);}
  fog(c,0,760,{n:14,sp:0,h:260,r:520,a:.2,seed:13});
  // сцена-возвышение с героем
  c.fillStyle=LG(c,0,760,0,830,[[0,'#2a2f3d'],[1,'#10131b']]);c.fillRect(350,770,380,60);c.fillStyle='rgba(245,166,35,.55)';c.fillRect(350,768,380,4);
  glowDot(c,540,640,330,AM,.55);
  person(c,{x:540,y:600,s:.42,skin:SKINS.a,hairC:'#c9a15a',L:-1,suit:'#1d2533',tie:'#7a1e2a',mouth:'open',brow:'up',rim:AM,R:1,rimA:1});
  c.strokeStyle='#0b0b0d';c.lineWidth=6;c.beginPath();c.moveTo(580,640);c.lineTo(560,612);c.stroke();c.fillStyle='#1a1a1e';c.beginPath();c.arc(560,610,7,0,TAU);c.fill();
  // ряды столов с мониторами и брокеры — 3 плана
  const rows=[[880,.36,'#0d1320'],[1040,.55,'#0a0f19'],[1260,.82,'#070b13']];
  rows.forEach(([y,s,col],ri)=>{
    for(let i=0;i<9;i++){const x=(i+.5)*WW/9+(H1(i*3+ri)-.5)*40;sil(c,x,y-150*s,s*1.05,{col,up:H1(i*5+ri)>.62?.7+.3*H1(i):0,both:H1(i*9+ri)>.92,side:H1(i+ri)>.5?1:-1,rim:AM,ra:.35+ri*.2});}
    c.fillStyle=sh(col,.06);c.fillRect(0,y,WW,40*s+20);c.fillStyle='rgba(245,166,35,.25)';c.fillRect(0,y,WW,2);
    for(let i=0;i<12;i++){const x=40+i*92+(ri%2)*40,w=70*s+20,h=46*s+14;c.fillStyle='#0b0e14';c.fillRect(x,y-h-4,w,h+4);c.fillStyle=H1(i+ri)>.3?'rgba(61,220,132,.55)':'rgba(245,166,35,.6)';c.fillRect(x+4,y-h,w-8,h-6);}
  });
  blurred(c,3,g=>{for(let i=0;i<5;i++){const x=110+i*215+(H1(i*13)-.5)*40;sil(g,x,1500+(H1(i*7)-.5)*50,1.15,{col:'#04060a',up:i===1||i===4?.9:0,side:i===1?1:-1,rim:'#f5a623',ra:.8});}});
}
function bills(c,n,seed,blur){blurred(c,blur||8,g=>{for(let i=0;i<n;i++){const x=H1(seed+i*3.1)*WW,y=H1(seed+i*7.3)*HH,a=H1(seed+i*5.7)*TAU,s=.6+H1(seed+i)*1.2;
  g.save();g.translate(x,y);g.rotate(a);g.scale(s*.7,s*.7*(.4+.6*Math.abs(Math.sin(a*3))));g.fillStyle='#8fb58a';g.fillRect(-70,-30,140,60);g.strokeStyle='#4f7a4c';g.lineWidth=4;g.strokeRect(-62,-22,124,44);g.fillStyle='#5f8a5c';g.beginPath();g.ellipse(0,0,16,18,0,0,TAU);g.fill();g.restore();}});}
SC.g2a=(c,t)=>{tradeHall(c);bills(c,7,3,9);
  fin(c,0,{warm:'#f5a623',cool:'#0b1a3a',ga:.22,vig:.65});corners(c,.3);
  hudTop(c,'ЛОНГ-АЙЛЕНД · STRATTON OAKMONT','',{});
  {c.save();c.shadowColor='rgba(0,0,0,.8)';c.shadowBlur=10;tx(c,'ДОХОД: $49 000 000',WW-66,160,{f:'J',w:700,s:26,ls:2,al:'right',c:'#f5a623'});c.restore();}
  subLine(c,[['СОТНИ',0],['БРОКЕРОВ',1],['ПО',0],['ТВОЕМУ',0],['ЩЕЛЧКУ',1]],{y:1620,s:96,acc:'#f5a623'});
  hudBot(c,'01 / 07 · СТРАТТОН',.12,'00:00:11',{col:'#f5a623'});
};
SC.g2b=(c,t)=>{tradeHall(c);
  {const g=TB.getContext('2d');reset(g);g.clearRect(0,0,WW,HH);g.drawImage(c.canvas,0,0);c.save();c.filter='blur(9px) brightness(.55)';c.drawImage(TB,0,0);c.restore();}
  glowDot(c,540,860,600,'#f5a623',.35);
  bigNum(c,'g2b','$49 000 000',540,820,{s:170,d:22});
  tag(c,'ЗА ОДИН ГОД · ТЕБЕ 26',540,960,{bc:'rgba(245,166,35,.8)'});
  bills(c,9,21,6);
  fin(c,0,{warm:'#f5a623',cool:'#0b1a3a',ga:.22,vig:.65});corners(c,.3);
  hudTop(c,'ЛОНГ-АЙЛЕНД · STRATTON OAKMONT','');
  {c.save();c.shadowColor='rgba(0,0,0,.8)';c.shadowBlur=10;tx(c,'ДОХОД: $49 000 000',WW-66,160,{f:'J',w:700,s:26,ls:2,al:'right',c:'#f5a623'});c.restore();}
  subLine(c,[['СОРОК',1],['ДЕВЯТЬ',1],['МИЛЛИОНОВ',0]],{y:1620,s:104,acc:'#f5a623'});
  hudBot(c,'01 / 07 · СТРАТТОН',.05,'00:00:03',{col:'#f5a623'});
};

/* ---- 3. «Взрослая Династия» · Клан Сопрано: рубленый нуар, жёсткие тени, фактура ---- */
function noirPerson(c,o,cut){const g=OFF.getContext('2d');reset(g);g.clearRect(0,0,WW,HH);person(g,o);
  g.globalCompositeOperation='source-atop';g.fillStyle='rgba(4,3,3,.93)';g.beginPath();g.moveTo(cut[0][0],cut[0][1]);for(const p of cut)g.lineTo(p[0],p[1]);g.closePath();g.fill();
  c.drawImage(OFF,0,0);}
function texOver(c,a=.12,key='nz1'){c.save();c.globalCompositeOperation='overlay';c.globalAlpha=a;const n=noiseTex(key,540,960,6,4);c.drawImage(n,0,0,WW,HH);c.restore();}
function woodPanel(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(x,y,w,h);c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
  for(let i=0;i<w;i+=6){c.strokeStyle=`rgba(0,0,0,${.06+.1*H1(i*.37+x)})`;c.lineWidth=2;c.beginPath();c.moveTo(x+i,y);for(let k=0;k<=h;k+=40)c.lineTo(x+i+Math.sin(k*.02+i)*3,y+k);c.stroke();}
  c.strokeStyle='rgba(0,0,0,.45)';c.lineWidth=6;for(let k=0;k<w;k+=180){c.strokeRect(x+k+18,y+18,144,h-36);}c.restore();}
function hudNoir(c,left,right,k){c.save();c.shadowColor='rgba(0,0,0,.8)';c.shadowBlur=8;tx(c,left,70,118,{f:'M',w:700,s:24,ls:5,al:'left',c:'#e3c9a0'});
  tx(c,right,WW-70,118,{f:'M',w:800,s:26,ls:3,al:'right',c:'#c0414f'});c.fillStyle='rgba(255,255,255,.15)';c.fillRect(WW-300,134,230,5);c.fillStyle='#9c2a38';c.fillRect(WW-300,134,230*k,5);c.restore();}
function subSerif(c,lines,o={}){c.save();font(c,{f:'P',w:700,s:o.s||58});c.textAlign='center';c.textBaseline='middle';
  lines.forEach((l,i)=>{c.shadowColor='rgba(0,0,0,.9)';c.shadowBlur=20;c.fillStyle=o.col||'#f1e6d2';c.fillText(l,540,(o.y||1600)+i*(o.lh||74));});c.restore();}
SC.g3a=(c,t)=>{
  // стена: деревянные панели, книжные полки
  woodPanel(c,0,0,WW,1300,'#3a2618');
  for(let r=0;r<4;r++){c.fillStyle='#1a100a';c.fillRect(620,180+r*180,460,16);for(let i=0;i<16;i++){const h=90+H1(i+r*16)*60,w=18+H1(i*3+r)*16;c.fillStyle=['#5a2a22','#2c3b2a','#6b5a3a','#262a36','#7a3a2a'][(i+r)%5];c.fillRect(640+i*27,180+r*180-h,w,h);}}
  // окно с жалюзи слева, полосы света на стене
  c.fillStyle='#e9c98f';c.fillRect(60,160,380,620);for(let i=0;i<24;i++){c.fillStyle='#5a4030';c.fillRect(60,160+i*26,380,14);}
  c.save();for(let i=0;i<18;i++){c.fillStyle='rgba(255,200,120,.16)';c.beginPath();const y=300+i*60;c.moveTo(440,y);c.lineTo(1080,y+190);c.lineTo(1080,y+222);c.lineTo(440,y+26);c.closePath();c.fill();}c.restore();
  // кресло Тони (рубленое, кожа)
  c.fillStyle='#2a140f';c.beginPath();c.moveTo(400,820);c.lineTo(900,800);c.lineTo(960,1500);c.lineTo(340,1520);c.closePath();c.fill();
  c.fillStyle='#3d1d14';c.beginPath();c.moveTo(330,1150);c.lineTo(440,1120);c.lineTo(460,1540);c.lineTo(320,1560);c.closePath();c.fill();c.beginPath();c.moveTo(860,1110);c.lineTo(980,1140);c.lineTo(990,1550);c.lineTo(850,1540);c.closePath();c.fill();
  // Тони: тяжёлый, залысины, половина лица в тени
  noirPerson(c,{x:650,y:860,s:1.25,skin:SKINS.c,hair:'bald',hairC:'#2a1e18',hw:72,jaw:1.18,L:-1,turn:-.25,look:[-.7,.1],suit:'#1c1d22',shirt:'#d8d2c6',open:true,skinC:SKINS.c.b,mouth:'flat',brow:'frown',tired:.4,rim:'#ffc27a',R:-1,rimA:.9},
    [[655,540],[1080,540],[1080,1900],[700,1900],[690,1200],[672,1010],[680,930],[662,850],[668,760]]);
  // полосы жалюзи поверх Тони
  c.save();c.globalCompositeOperation='overlay';for(let i=0;i<10;i++){c.fillStyle='rgba(255,190,110,.35)';c.beginPath();const y=700+i*70;c.moveTo(300,y);c.lineTo(1000,y+200);c.lineTo(1000,y+226);c.lineTo(300,y+26);c.closePath();c.fill();}c.restore();
  // пол
  c.fillStyle=LG(c,0,1500,0,HH,[[0,'#1d120c'],[1,'#080504']]);c.fillRect(0,1500,WW,HH-1500);
  // передний план: спинка кресла доктора — размыта
  blurred(c,12,g=>{g.fillStyle='#120c09';g.beginPath();g.moveTo(-60,1100);g.quadraticCurveTo(260,980,330,1300);g.lineTo(360,HH);g.lineTo(-60,HH);g.closePath();g.fill();g.strokeStyle='rgba(255,190,110,.35)';g.lineWidth=6;g.beginPath();g.moveTo(-40,1104);g.quadraticCurveTo(250,990,318,1290);g.stroke();});
  texOver(c,.18,'nzs');fin(c,0,{warm:'#d9a35a',cool:'#1a1410',ga:.25,vig:.8,gr:.1});
  hudNoir(c,'НЬЮ-ДЖЕРСИ · КАБИНЕТ','ПАРАНОЙЯ: 64%',.64);
  subSerif(c,['По бумагам ты —','консультант по вывозу мусора.'],{y:1620,s:56});
};
SC.g3b=(c,t)=>{
  // кирпич
  c.fillStyle='#2a1a14';c.fillRect(0,0,WW,HH);
  for(let j=0;j<60;j++)for(let i=-1;i<10;i++){const x=i*120+(j%2)*60,y=j*34,r=H2(i+20,j);c.fillStyle=`rgb(${70+r*30|0},${38+r*14|0},${28+r*10|0})`;c.fillRect(x+3,y+3,114,28);}
  c.fillStyle='rgba(8,5,4,.55)';c.fillRect(0,0,WW,HH);
  // приоткрытая дверь в клуб: красный неон
  c.fillStyle='#0b0606';c.fillRect(760,300,260,820);c.fillStyle=LG(c,760,0,1020,0,[[0,'rgba(255,40,70,.7)'],[1,'rgba(255,40,70,.15)']]);c.fillRect(800,300,220,820);
  c.save();c.translate(925,430);c.rotate(-.04);tx(c,'BADA',0,0,{f:'P',w:700,it:1,s:56,c:'#ff4a6a',glow:'#ff2a50'});tx(c,'BING!',0,64,{f:'P',w:700,it:1,s:56,c:'#ff4a6a',glow:'#ff2a50'});c.restore();glowDot(c,900,460,260,'#ff2a50',.55);
  c.fillStyle='#120807';c.beginPath();c.moveTo(760,300);c.lineTo(820,280);c.lineTo(820,1140);c.lineTo(760,1120);c.closePath();c.fill();
  // лампа над столом
  c.strokeStyle='#0a0606';c.lineWidth=4;c.beginPath();c.moveTo(470,0);c.lineTo(470,560);c.stroke();c.fillStyle='#16301f';c.beginPath();c.moveTo(380,610);c.lineTo(560,610);c.lineTo(510,555);c.lineTo(430,555);c.closePath();c.fill();
  beam(c,470,600,0,1.05,1100,'#ffcf86',1);glowDot(c,470,610,90,'#ffd690',.9);
  // люди вокруг стола (рубленые, полутень)
  noirPerson(c,{x:200,y:930,s:.85,skin:SKINS.b,hair:'short',hairC:'#141010',hw:66,jaw:1.1,L:1,turn:.4,look:[.7,.4],suit:'#1a1a1f',shirt:'#2b2b30',mouth:'flat',brow:'frown',rim:'#ffcf86',R:1,rimA:.9},[[0,500],[200,500],[190,1500],[0,1500]]);
  noirPerson(c,{x:740,y:960,s:.85,skin:SKINS.c,hair:'grey',hairC:'#6a6a6a',hw:64,L:-1,turn:-.4,look:[-.7,.4],suit:'#22201c',shirt:'#e0d8c8',tie:'#4a1a22',mouth:'neutral',brow:'flat',rim:'#ff4a6a',R:1,rimA:.9},[[748,500],[1080,500],[1080,1500],[748,1500]]);
  noirPerson(c,{x:470,y:880,s:.7,skin:SKINS.c,hair:'bald',hairC:'#2a1e18',hw:72,jaw:1.18,L:-1,look:[0,.6],suit:'#1c1d22',shirt:'#d8d2c6',open:true,skinC:SKINS.c.b,mouth:'flat',brow:'frown',rim:'#ffcf86',R:-1,rimA:.5},[[474,600],[1080,600],[1080,1300],[478,1300]]);
  // стол с зелёным сукном, деньги, пепельница
  c.fillStyle='#0d2a1a';c.beginPath();c.moveTo(120,1130);c.lineTo(820,1130);c.lineTo(1000,1440);c.lineTo(-60,1440);c.closePath();c.fill();
  pool(c,470,1250,520,170,'#ffd690',.7);c.fillStyle='#1a0e08';c.fillRect(-60,1440,1100,60);
  for(const [x,y,n] of [[330,1230,5],[560,1260,4],[440,1330,6]])for(let k=0;k<n;k++){c.fillStyle=k%2?'#7f9f78':'#8fb58a';c.fillRect(x-60,y-k*8,120,9);c.fillStyle='#d8c49a';c.fillRect(x-8,y-k*8,16,9);}
  c.fillStyle='#2a2a2e';c.beginPath();c.ellipse(700,1290,50,16,0,0,TAU);c.fill();c.fillStyle='#8a3a1a';c.fillRect(690,1270,46,10);glowDot(c,738,1274,16,'#ff7a30',1);
  fog(c,0,760,{n:10,sp:0,h:300,r:300,a:.35,seed:21});
  c.fillStyle=LG(c,0,1500,0,HH,[[0,'#0d0807'],[1,'#040303']]);c.fillRect(0,1500,WW,HH-1500);
  texOver(c,.2,'nzb');fin(c,0,{warm:'#d9a35a',cool:'#1a1410',ga:.25,vig:.82,gr:.1});
  hudNoir(c,'НЬЮ-ДЖЕРСИ · «БАДА БИНГ»','ПАРАНОЙЯ: 71%',.71);
  subSerif(c,['Вечером делишь деньги','в задней комнате «Бада Бинг».'],{y:1640,s:54});
};

/* ---- 4. «Грязный 35 мм нуар» · Таксист: ч/б + один красный ---- */
const REDL=mkc(WW,HH);
function mono(c,draw,red,o={}){const g=OFF.getContext('2d');reset(g);g.clearRect(0,0,WW,HH);draw(g);
  c.save();c.filter=`grayscale(1) contrast(${o.ct||1.55}) brightness(${o.br||.92})`;c.drawImage(OFF,0,0);c.restore();
  const r=REDL.getContext('2d');reset(r);r.clearRect(0,0,WW,HH);red(r);
  c.save();c.globalCompositeOperation='screen';c.globalAlpha=.55;c.drawImage(REDL,-4,0);c.globalAlpha=1;c.drawImage(REDL,0,0);c.restore();}
function filmDirt(c,seed){c.save();for(let i=0;i<7;i++){const x=H1(seed+i*3)*WW;c.fillStyle=`rgba(230,230,230,${.05+.1*H1(seed+i)})`;c.fillRect(x,0,1+H1(i+seed)*1.5,HH);}
  for(let i=0;i<40;i++){c.fillStyle=`rgba(${H1(i+seed)>.5?240:0},${H1(i+seed)>.5?240:0},${H1(i+seed)>.5?240:0},.35)`;c.beginPath();c.arc(H1(seed+i*7)*WW,H1(seed+i*11)*HH,.6+H1(i*3)*2.2,0,TAU);c.fill();}c.restore();}
function hudTaxi(c,left,right){c.save();c.shadowColor='rgba(0,0,0,.9)';c.shadowBlur=8;tx(c,left,70,118,{f:'J',w:700,s:26,ls:3,al:'left',c:'#e9e9e9'});tx(c,right,WW-70,118,{f:'J',w:700,s:26,ls:2,al:'right',c:'#ff1e32',glow:'#ff1e32'});c.restore();}
function subType(c,lines,o={}){c.save();font(c,{f:'J',w:500,s:o.s||46});c.textAlign='center';c.textBaseline='middle';
  lines.forEach((l,i)=>{c.shadowColor='rgba(0,0,0,.95)';c.shadowBlur=14;c.fillStyle='#ececec';c.fillText(l,540,(o.y||1620)+i*(o.lh||62));});c.restore();}
function nycStreet(g,o={}){const HZ=o.hz||900;
  g.fillStyle=LG(g,0,0,0,HZ,[[0,'#2a2d33'],[1,'#8e939b']]);g.fillRect(0,0,WW,HZ);
  // дома по бокам в перспективе
  for(const sd of [-1,1])for(let k=0;k<7;k++){const z0=1+k*.9,z1=z0+.8,x0=540+sd*260/z0*2.2,x1=540+sd*260/z1*2.2,ht=(1400+H1(k+sd*7)*900);
    const y0=HZ+120/z0,y1=HZ+120/z1;g.fillStyle=`rgb(${48+k*12},${50+k*12},${56+k*12})`;g.beginPath();g.moveTo(x0,y0);g.lineTo(x0,y0-ht/z0);g.lineTo(x1,y1-ht/z1);g.lineTo(x1,y1);g.closePath();g.fill();
    for(let w=0;w<14;w++)for(let f=0;f<10;f++){if(H2(w+k*20+sd*3,f)>.3)continue;const u=w/14,zz=lp(z0,z1,u),xx=540+sd*260/zz*2.2,yy=HZ+120/zz-(f*120+80)/zz;g.fillStyle='rgba(230,220,190,.8)';g.fillRect(xx,yy,Math.max(2,14/zz),Math.max(2,22/zz));}}
  g.fillStyle=RG(g,540,HZ,20,520,[[0,'rgba(200,205,212,.75)'],[1,'rgba(200,205,212,0)']]);g.fillRect(0,0,WW,HH);
  // мокрый асфальт и отражения
  g.fillStyle=LG(g,0,HZ,0,HH,[[0,'#5a5f66'],[1,'#16181b']]);g.fillRect(0,HZ,WW,HH-HZ);
  for(let i=0;i<40;i++){const x=H1(i*3)*WW,y=HZ+20+H1(i*5)*500;g.fillStyle=`rgba(230,230,230,${.08+.15*H1(i)})`;g.fillRect(x,y,2+H1(i*7)*4,40+H1(i*9)*160);}
  // пар из люка
  fog(g,0,HZ+60,{n:8,sp:0,h:120,r:260,a:.55,seed:31});
  // такси впереди
  g.fillStyle='#bdbdbd';rr(g,420,HZ-10,240,90,20);g.fill();g.fillStyle='#1b1b1b';rr(g,452,HZ-50,176,52,12);g.fill();g.fillStyle='#e0e0e0';g.fillRect(500,HZ-70,80,20);}
SC.g4a=(c,t)=>{const HZ=900;
  mono(c,g=>{nycStreet(g,{hz:HZ});
    // стекло: капли и подтёки, след дворника
    for(let i=0;i<140;i++){const x=H1(i*3.3)*WW,y=H1(i*7.7)*1500,r=3+H1(i*5.1)*9;g.fillStyle='rgba(255,255,255,.22)';g.beginPath();g.ellipse(x,y,r*.8,r,0,0,TAU);g.fill();g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(x+1,y+2,r*.6,r*.7,0,0,TAU);g.fill();}
    for(let i=0;i<30;i++){const x=H1(i*9)*WW,y=H1(i*13)*900;g.strokeStyle='rgba(255,255,255,.18)';g.lineWidth=2;g.beginPath();g.moveTo(x,y);g.lineTo(x+(H1(i)-.5)*20,y+120+H1(i*3)*200);g.stroke();}
    // дворник
    g.save();g.translate(300,1430);g.rotate(.62);g.fillStyle='#0a0a0a';g.fillRect(-9,-980,18,980);g.fillRect(-16,-960,32,560);g.fillStyle='rgba(220,220,220,.35)';g.fillRect(-16,-960,3,560);g.restore();
    // стойки, зеркало, панель, руль
    g.fillStyle='#050505';g.beginPath();g.moveTo(0,0);g.lineTo(150,0);g.lineTo(-40,1500);g.lineTo(-40,0);g.closePath();g.fill();g.beginPath();g.moveTo(WW,0);g.lineTo(WW-150,0);g.lineTo(WW+40,1500);g.closePath();g.fill();
    g.fillRect(0,0,WW,70);g.fillStyle='#0b0b0b';rr(g,380,80,320,96,14);g.fill();g.fillStyle='#262626';rr(g,392,90,296,76,10);g.fill();g.fillRect(530,40,20,50);
    g.fillStyle=LG(g,0,1380,0,HH,[[0,'#121212'],[1,'#020202']]);g.beginPath();g.moveTo(0,1420);g.quadraticCurveTo(540,1340,WW,1420);g.lineTo(WW,HH);g.lineTo(0,HH);g.closePath();g.fill();
    g.strokeStyle='#060606';g.lineWidth=46;g.beginPath();g.ellipse(250,1700,330,230,0,Math.PI*1.05,Math.PI*1.95);g.stroke();g.strokeStyle='rgba(200,200,200,.35)';g.lineWidth=4;g.beginPath();g.ellipse(250,1700,352,252,0,Math.PI*1.12,Math.PI*1.88);g.stroke();
    g.strokeStyle='rgba(220,220,220,.3)';g.lineWidth=3;g.beginPath();g.moveTo(0,1420);g.quadraticCurveTo(540,1340,WW,1420);g.stroke();
    g.fillStyle='#1d1d1d';rr(g,700,1480,200,90,10);g.fill();},
  r=>{ // красное: вывеска, стоп-сигналы, отражения
    r.save();r.translate(880,520);tx(r,'H',0,0,{f:'P',w:700,s:70,c:'#ff1e32',glow:'#ff1e32'});tx(r,'O',0,80,{f:'P',w:700,s:70,c:'#ff1e32',glow:'#ff1e32'});tx(r,'T',0,160,{f:'P',w:700,s:70,c:'#ff1e32',glow:'#ff1e32'});tx(r,'E',0,240,{f:'P',w:700,s:70,c:'#ff1e32',glow:'#ff1e32'});tx(r,'L',0,320,{f:'P',w:700,s:70,c:'#ff1e32',glow:'#ff1e32'});r.restore();
    glowDot(r,880,700,300,'#ff1e32',.6);r.fillStyle=LG(r,0,HZ+40,0,HZ+460,[[0,'rgba(255,30,50,.4)'],[1,'rgba(255,30,50,0)']]);r.fillRect(850,HZ+40,60,420);
    for(const x of [440,640]){glowDot(r,x,HZ+20,60,'#ff1e32',1);r.fillStyle='rgba(255,30,50,.3)';r.fillRect(x-10,HZ+40,20,300);}});
  filmDirt(c,3);grain(c,0,.16);vignette(c,.85);
  hudTaxi(c,'МАНХЭТТЕН · 04:15','БЕССОННИЦА: 74 ЧАСА');
  subType(c,['Четыре утра. Дождь заливает','лобовое стекло.'],{y:1600});
};
SC.g4b=(c,t)=>{
  mono(c,g=>{nycStreet(g,{hz:1100});const g2=g;
    g2.save();g2.filter='blur(10px)';g2.drawImage(g2.canvas,0,0);g2.restore();g2.fillStyle='rgba(0,0,0,.2)';g2.fillRect(0,0,WW,HH);
    for(let i=0;i<90;i++){const x=H1(i*3.3)*WW,y=H1(i*7.7)*HH,r=4+H1(i*5.1)*10;g2.fillStyle='rgba(255,255,255,.18)';g2.beginPath();g2.ellipse(x,y,r*.8,r,0,0,TAU);g2.fill();}
    // зеркало заднего вида крупно
    g2.fillStyle='#050505';rr(g2,40,520,1000,420,46);g2.fill();g2.fillRect(510,300,60,230);g2.strokeStyle='rgba(220,220,220,.45)';g2.lineWidth=4;rr(g2,40,520,1000,420,46);g2.stroke();
    g2.save();rr(g2,64,544,952,372,34);g2.clip();g2.fillStyle='#2a2a2a';g2.fillRect(0,0,WW,HH);
    head(g2,{x:540,y:775,s:5.2,skin:SKINS.a,hairC:'#3a2a20',L:-1,look:[0,0],mouth:'flat',brow:'frown',tired:.55,rimA:0});
    g2.fillStyle=LG(g2,0,544,0,916,[[0,'rgba(0,0,0,.55)'],[.35,'rgba(0,0,0,0)'],[.7,'rgba(0,0,0,0)'],[1,'rgba(0,0,0,.6)']]);g2.fillRect(64,544,952,372);
    g2.fillStyle=LG(g2,64,0,1016,0,[[0,'rgba(255,255,255,0)'],[.15,'rgba(255,255,255,.12)'],[.22,'rgba(255,255,255,0)']]);g2.fillRect(64,544,952,372);g2.restore();},
  r=>{ // красный отблеск неона в глазах и полосой по зеркалу
    r.save();rr(r,64,544,952,372,34);r.clip();r.fillStyle=LG(r,0,600,0,760,[[0,'rgba(255,30,50,0)'],[.5,'rgba(255,30,50,.28)'],[1,'rgba(255,30,50,0)']]);r.fillRect(64,544,952,372);
    for(const ex of [540-25*5.2,540+25*5.2]){glowDot(r,ex+10,775-8*5.2-12,40,'#ff1e32',1);r.fillStyle='#ff4050';r.beginPath();r.arc(ex+10,775-8*5.2-12,6,0,TAU);r.fill();}r.restore();});
  filmDirt(c,9);grain(c,0,.16);vignette(c,.85);
  hudTaxi(c,'МАНХЭТТЕН · 04:40','БЕССОННИЦА: 75 ЧАСОВ');
  subType(c,['Однажды пойдёт настоящий дождь','и смоет всю эту грязь.'],{y:1560});
};

/* ================= ТЗ Gemini v2: все 4 стиля — только «Духless» ================= */
/* ---- 2. «Чистая Династия» · кольцо с перемоткой ---- */
function hudDyn(c){hudTop(c,'ГЛАВА 01 · МОСКВА, 2012','');c.save();c.shadowColor='rgba(0,0,0,.8)';c.shadowBlur=10;tx(c,'БАЛАНС: €100 000+',WW-66,160,{f:'J',w:700,s:26,ls:2,al:'right',c:'#f5a623'});c.restore();}
SC.h2a=(c,t)=>{clubHall(c,{ac:'#f5a623',ac2:'#4a8dff'});
  // фермы под потолком
  c.strokeStyle='#1a2233';c.lineWidth=6;for(const y of [160,220]){c.beginPath();c.moveTo(0,y);c.lineTo(WW,y);c.stroke();}
  c.lineWidth=3;for(let x=0;x<WW;x+=60){c.beginPath();c.moveTo(x,160);c.lineTo(x+60,220);c.moveTo(x+60,160);c.lineTo(x,220);c.stroke();}
  // Макс в центре толпы — в золотом контровом
  glowDot(c,540,1000,360,'#f5a623',.45);
  person(c,{x:540,y:1010,s:.78,skin:SKINS.b,hairC:'#1d140f',beard:1,L:-1,look:[0,.1],suit:'#0b0d13',open:true,skinC:SKINS.b.b,mouth:'smile',rim:'#f5a623',R:1,rimA:1});
  c.save();c.translate(540,1010);c.scale(.78,.78);rimStroke(c,[headPath({})],'#4a8dff',.8,7,-1,90);c.restore();
  // передний план: спины толпы
  blurred(c,4,g=>{for(let i=0;i<6;i++){const x=60+i*195+(H1(i*13)-.5)*40;sil(g,x,1420+(H1(i*7)-.5)*60,1.05,{col:'#05060a',up:i===1||i===4?.9:0,both:i===4,side:i===1?1:-1,rim:i%2?'#f5a623':'#4a8dff',ra:.8});}});
  fin(c,0,{warm:'#f5a623',cool:'#0b1a3a',ga:.2,vig:.65});corners(c,.3);hudDyn(c);
  subLine(c,[['ТЫ',0],['ВЗЛОМАЛ',1],['ЭТУ',0],['ЖИЗНЬ',1]],{y:1640,s:100,acc:'#f5a623'});
  hudBot(c,'01 / 07 · ВЗЛЁТ',.2,'00:00:16',{col:'#f5a623'});
};
SC.h2b=(c,t)=>{
  c.fillStyle=LG(c,0,0,0,1300,[[0,'#060b1c'],[.5,'#13204a'],[.85,'#4a2f50'],[1,'#c0623a']]);c.fillRect(0,0,WW,1300);
  for(let i=0;i<60;i++){c.fillStyle=`rgba(255,255,255,${.2+.5*H1(i*7.1)})`;c.fillRect(H1(i*3.3)*WW,H1(i*5.9)*500,2,2);}
  // три плана с дымкой
  cityFar(c,1060,{col:'#2a2546',h:70,n:200,seed:3});c.fillStyle='rgba(120,90,140,.28)';c.fillRect(0,900,WW,200);
  stalinka(c,840,1120,.55,'#3c3352');moscowCity(c,330,1140,.8,{lite:.45});
  c.fillStyle='rgba(60,50,90,.25)';c.fillRect(0,950,WW,260);
  cityFar(c,1200,{col:'#0c0e1a',h:46,n:260,seed:17});river(c,1200,1330,{});cars(c,1196,{n:50});
  c.fillStyle=LG(c,0,1330,0,HH,[[0,'#0a0d18'],[1,'#04050a']]);c.fillRect(0,1330,WW,HH-1330);
  fog(c,0,1150,{n:12,sp:0,h:120,r:520,a:.2,seed:5});
  bigNum(c,'h2b','2012',540,560,{s:330,d:26});
  tag(c,'◀◀  ПЕРЕМОТКА',540,760,{bc:'rgba(245,166,35,.85)'});
  fin(c,0,{warm:'#f5a623',cool:'#0b1a3a',ga:.2,vig:.65});corners(c,.3);hudDyn(c);
  subLine(c,[['МОСКВА',0],['У',0],['ТВОИХ',1],['НОГ',1]],{y:1560,s:104,acc:'#f5a623'});
  hudBot(c,'01 / 07 · ВЗЛЁТ',.08,'00:00:10',{col:'#f5a623'});
};

/* ---- 3. «Взрослая Династия» · корпоративный триллер ---- */
function hudCorp(c,k){c.save();c.shadowColor='rgba(0,0,0,.8)';c.shadowBlur=8;tx(c,'МОСКВА · БАНК «МЕГАПОЛИС»',70,118,{f:'M',w:700,s:24,ls:4,al:'left',c:'#cfd8e2'});
  tx(c,`КОНТРОЛЬ: ${Math.round(k*100)}%`,WW-70,118,{f:'M',w:800,s:26,ls:3,al:'right',c:k<.7?'#e0485a':'#c9963b'});c.fillStyle='rgba(255,255,255,.15)';c.fillRect(WW-300,134,230,5);c.fillStyle=k<.7?'#9c2a38':'#c9963b';c.fillRect(WW-300,134,230*k,5);c.restore();}
function steelOffice(c){
  // стеклянная стена: Сити днём, холодно
  c.fillStyle=LG(c,0,0,0,1150,[[0,'#56677a'],[1,'#a8b6c4']]);c.fillRect(0,0,WW,1150);
  cityFar(c,1000,{col:'#6c7c8e',h:60,n:0});moscowCity(c,700,1050,.75,{lite:0});
  c.fillStyle='rgba(20,30,40,.35)';c.fillRect(0,0,WW,1150);
  // жалюзи наполовину опущены
  for(let i=0;i<20;i++){c.fillStyle='#1f2a36';c.fillRect(0,i*24,WW,14);}
  c.fillStyle='#0d1014';for(const x of [0,360,720,1066])c.fillRect(x-7,0,14,1150);c.fillRect(0,1140,WW,14);
  // пол, полосы света
  c.fillStyle=LG(c,0,1150,0,HH,[[0,'#1a2129'],[1,'#07090c']]);c.fillRect(0,1150,WW,HH-1150);
  c.save();c.globalCompositeOperation='overlay';for(let i=0;i<12;i++){c.fillStyle='rgba(200,220,240,.25)';c.beginPath();const y=1160+i*52;c.moveTo(0,y);c.lineTo(WW,y+120);c.lineTo(WW,y+142);c.lineTo(0,y+22);c.closePath();c.fill();}c.restore();}
function contract(c,x,y,a,s,title){c.save();c.translate(x,y);c.rotate(a);c.scale(s,s);c.fillStyle='rgba(0,0,0,.45)';c.fillRect(-150,-190,320,400);
  c.fillStyle='#e9e6df';c.fillRect(-160,-200,320,400);c.fillStyle='rgba(0,0,0,.08)';c.fillRect(-160,-200,320,40);
  tx(c,'КРЕДИТНЫЙ ДОГОВОР',0,-150,{f:'M',w:800,s:18,ls:2,c:'#1b1f26'});tx(c,title,0,-118,{f:'P',w:700,s:24,c:'#1b1f26'});
  for(let k=0;k<11;k++){c.fillStyle='rgba(30,34,40,.28)';c.fillRect(-130,-80+k*20,260-(k%3)*40,5);}
  tx(c,'€',90,150,{f:'M',w:800,s:26,c:'#c9963b'});c.strokeStyle='#1b1f26';c.lineWidth=1.5;c.beginPath();c.moveTo(-130,170);c.lineTo(20,170);c.stroke();
  c.strokeStyle='#1f3b8a';c.lineWidth=3;c.beginPath();c.moveTo(-120,166);c.bezierCurveTo(-90,140,-70,190,-40,160);c.bezierCurveTo(-20,145,0,175,14,158);c.stroke();c.restore();}
SC.h3a=(c,t)=>{steelOffice(c);
  // Макс за столом: половина лица в тени
  noirPerson(c,{x:520,y:860,s:1.0,skin:SKINS.b,hairC:'#1d140f',beard:1,L:-1,turn:.12,look:[0,.9],suit:'#14181e',shirt:'#dfe3e8',tie:'#3a1a22',mouth:'flat',brow:'flat',rim:'#c9963b',R:-1,rimA:.9},
    [[525,520],[1080,520],[1080,1600],[560,1600],[548,1060],[532,940],[538,840]]);
  // стол: большая плита в перспективе
  c.fillStyle=LG(c,0,1110,0,1500,[[0,'#2a3948'],[1,'#121820']]);c.beginPath();c.moveTo(120,1110);c.lineTo(960,1100);c.lineTo(1180,1500);c.lineTo(-100,1520);c.closePath();c.fill();
  c.fillStyle='rgba(201,150,59,.55)';c.beginPath();c.moveTo(120,1110);c.lineTo(960,1100);c.lineTo(962,1105);c.lineTo(118,1115);c.closePath();c.fill();
  c.fillStyle='#0b0e12';c.beginPath();c.moveTo(-100,1520);c.lineTo(1180,1500);c.lineTo(1180,1560);c.lineTo(-100,1580);c.closePath();c.fill();
  // договор лежит на столе
  c.save();c.translate(540,1300);c.scale(1,.52);contract(c,0,0,-.12,.78,'«РАЙ МИЛЛИОНЕРОВ»');c.restore();
  c.save();c.translate(690,1330);c.rotate(-1.15);c.fillStyle='rgba(0,0,0,.4)';c.fillRect(-4,-96,12,200);c.fillStyle='#0b0b0d';c.fillRect(-7,-100,13,200);c.fillStyle='#c9963b';c.fillRect(-7,-100,13,24);c.restore();
  c.save();c.translate(230,1180);c.scale(1,.7);c.fillStyle='#1a1f26';rr(c,-90,-24,180,48,6);c.fill();c.restore();tx(c,'М. АНДРЕЕВ',230,1188,{f:'M',w:700,s:16,ls:2,c:'#c9963b'});
  // передний план: угол монитора и рама — размыто
  blurred(c,12,g=>{g.fillStyle='#07090c';g.beginPath();g.moveTo(880,1000);g.lineTo(WW+40,960);g.lineTo(WW+40,1500);g.lineTo(860,1480);g.closePath();g.fill();g.fillStyle='rgba(120,170,220,.25)';g.fillRect(900,1010,200,10);g.fillStyle='#0a0c10';g.fillRect(-40,0,90,HH);});
  texOver(c,.16,'nzc');fin(c,0,{warm:'#c9963b',cool:'#1a2a3a',ga:.25,vig:.8,gr:.1});hudCorp(c,.94);
  subSerif(c,['Ты подписываешь,','не открывая вторую страницу.'],{y:1620,s:54,col:'#e6ebf0'});
};
SC.h3b=(c,t)=>{
  // стол сверху-наискосок, комната за ним размыта
  blurred(c,8,g=>{steelOffice(g);g.fillStyle='#0e1217';g.fillRect(380,700,320,500);g.fillStyle='#1a222b';rr(g,360,640,360,140,40);g.fill();});
  c.fillStyle=LG(c,0,900,0,HH,[[0,'#2a3948'],[1,'#10151b']]);c.beginPath();c.moveTo(0,980);c.lineTo(WW,940);c.lineTo(WW,HH);c.lineTo(0,HH);c.closePath();c.fill();
  c.fillStyle='rgba(201,150,59,.5)';c.fillRect(0,972,WW,5);
  // папка с картой и штампом
  c.save();c.translate(540,1330);c.rotate(.05);c.fillStyle='rgba(0,0,0,.5)';c.fillRect(-400,-300,820,620);c.fillStyle='#3a2f22';c.fillRect(-420,-320,840,640);
  c.fillStyle='#d9d4c4';c.fillRect(-390,-290,780,580);
  // карта: рельеф, изолинии, дорога, речка
  c.save();c.beginPath();c.rect(-390,-290,780,580);c.clip();c.fillStyle='#c4ccb0';c.fillRect(-390,-290,780,580);
  c.strokeStyle='rgba(90,100,70,.45)';c.lineWidth=2;for(let k=0;k<14;k++){c.beginPath();for(let a=0;a<=TAU+.1;a+=.2){const r=40+k*26+Math.sin(a*3+k)*10;const px=60+Math.cos(a)*r*1.3,py=20+Math.sin(a)*r*.8;a===0?c.moveTo(px,py):c.lineTo(px,py);}c.stroke();}
  c.strokeStyle='#6a8db0';c.lineWidth=6;c.beginPath();c.moveTo(-390,200);c.bezierCurveTo(-200,120,-100,260,120,200);c.bezierCurveTo(260,160,300,260,390,220);c.stroke();
  c.strokeStyle='#8a6a3a';c.lineWidth=5;c.setLineDash([16,10]);c.beginPath();c.moveTo(-390,-200);c.lineTo(390,-120);c.stroke();c.setLineDash([]);
  // участок посёлка — красный контур
  c.strokeStyle='#b8202e';c.lineWidth=5;c.setLineDash([12,8]);c.beginPath();c.moveTo(-120,-120);c.lineTo(220,-150);c.lineTo(260,110);c.lineTo(-90,140);c.closePath();c.stroke();c.setLineDash([]);
  c.fillStyle='rgba(184,32,46,.12)';c.fill();
  tx(c,'РАЙ МИЛЛИОНЕРОВ',70,-160,{f:'M',w:800,s:20,ls:2,c:'#1b1f26'});c.restore();
  // штамп
  c.save();c.translate(-130,170);c.rotate(-.18);c.strokeStyle='rgba(176,24,36,.92)';c.lineWidth=7;rr(c,-210,-62,420,124,10);c.stroke();c.lineWidth=2.5;rr(c,-196,-50,392,100,8);c.stroke();
  tx(c,'СЕКРЕТНО · 1930-е',0,-14,{f:'M',w:800,s:22,ls:3,c:'rgba(176,24,36,.92)'});tx(c,'ПОЛИГОН ХИМОРУЖИЯ',0,26,{f:'M',w:800,s:30,ls:1,c:'rgba(176,24,36,.95)'});c.restore();
  c.restore();
  contract(c,860,1010,.35,.42,'«РАЙ МИЛЛИОНЕРОВ»');
  // полосы жалюзи по столу
  c.save();c.globalCompositeOperation='overlay';for(let i=0;i<14;i++){c.fillStyle='rgba(220,230,245,.35)';c.beginPath();const y=960+i*70;c.moveTo(0,y);c.lineTo(WW,y-90);c.lineTo(WW,y-64);c.lineTo(0,y+26);c.closePath();c.fill();}c.restore();
  texOver(c,.18,'nzd');fin(c,0,{warm:'#c9963b',cool:'#1a2a3a',ga:.25,vig:.8,gr:.1});hudCorp(c,.61);
  subSerif(c,['Под «Раем миллионеров» —','полигон химических боеприпасов.'],{y:500,s:52,col:'#f0e6d6'});
};

/* ---- 4. «Грязный 35 мм» · мёртвый внутри / Юля ---- */
function hudPulse(c,time){c.save();c.shadowColor='rgba(0,0,0,.9)';c.shadowBlur=8;tx(c,`МОСКВА · ${time}`,70,118,{f:'J',w:700,s:26,ls:3,al:'left',c:'#e9e9e9'});tx(c,'ПУЛЬС: 52',WW-70,118,{f:'J',w:700,s:28,ls:2,al:'right',c:'#ff1e32',glow:'#ff1e32'});c.restore();}
SC.h4a=(c,t)=>{
  mono(c,g=>toiletScene(g),r=>{ // алая полоса неона из-за двери в отражении и на мраморе
    r.save();r.beginPath();r.rect(150,300,780,930);r.clip();r.fillStyle='#ff1e32';r.fillRect(722,560,14,640);glowDot(r,729,880,220,'#ff1e32',.7);r.restore();
    r.fillStyle=LG(r,0,1280,0,1520,[[0,'rgba(255,30,50,.4)'],[1,'rgba(255,30,50,0)']]);r.fillRect(700,1280,60,240);},{ct:1.6,br:.9});
  filmDirt(c,5);grain(c,0,.17);vignette(c,.85);hudPulse(c,'04:15');
  subType(c,['Каждое утро ты не узнаёшь','человека напротив.'],{y:1680});
};
SC.h4b=(c,t)=>{const HZ=820;
  mono(c,g=>{g.fillStyle=LG(g,0,0,0,HZ,[[0,'#9aa0a8'],[1,'#c8ccd2']]);g.fillRect(0,0,WW,HZ);
    // сталинские дома вдоль улицы
    for(const sd of [-1,1])for(let k=0;k<6;k++){const z0=1+k*.85,z1=z0+.75,x0=540+sd*300/z0*1.9,x1=540+sd*300/z1*1.9,ht=1600+H1(k+sd)*500,y0=HZ+160/z0,y1=HZ+160/z1;
      g.fillStyle=`rgb(${78+k*14},${80+k*14},${86+k*14})`;g.beginPath();g.moveTo(x0,y0);g.lineTo(x0,y0-ht/z0);g.lineTo(x1,y1-ht/z1);g.lineTo(x1,y1);g.closePath();g.fill();
      for(let w=0;w<10;w++)for(let f=0;f<9;f++){const u=(w+.3)/10,zz=lp(z0,z1,u),xx=540+sd*300/zz*1.9,yy=HZ+160/zz-(f*150+120)/zz;g.fillStyle='rgba(30,32,36,.75)';g.fillRect(xx-sd*8/zz,yy,Math.max(2,20/zz),Math.max(3,36/zz));}}
    stalinka(g,540,HZ+30,.5,'#8a8e96');
    g.fillStyle=LG(g,0,HZ,0,HH,[[0,'#6a6e75'],[1,'#2a2c30']]);g.fillRect(0,HZ,WW,HH-HZ);
    fog(g,0,HZ,{n:10,sp:0,h:140,r:480,a:.35,seed:41});
    // серая толпа: силуэты в 3 плана
    for(let row=0;row<3;row++){const y=HZ+140+row*260,s=.45+row*.32;for(let i=0;i<9;i++){if(row===1&&(i===4))continue;const x=(i+.5)*WW/9+(H1(i*3+row*7)-.5)*70;
      g.save();g.globalAlpha=.95;sil(g,x,y+(H1(i*5+row)-.5)*40,s,{col:`rgb(${40+row*-8},${42+row*-8},${46+row*-8})`});g.restore();}}
    // Юля в середине — та же серая, цвет добавим отдельно
    person(g,{x:540,y:1090,s:.62,skin:SKINS.a,hair:'long',hairC:'#3a2416',L:-1,look:[0,0],suit:'#8a1d26',shirt:'#e9e4dc',mouth:'neutral',rimA:0});
    for(let i=0;i<5;i++){const x=80+i*230+(H1(i*17)-.5)*40;sil(g,x,1600+(H1(i*9)-.5)*60,1.2,{col:'#16171a'});}},
  r=>{});
  // куртка Юли — единственный цвет
  {const g=REDL.getContext('2d');reset(g);g.clearRect(0,0,WW,HH);bust(g,{x:540,y:1090,s:.62,suit:'#d8202e',shirt:'#d8202e',L:-1,rimA:0});
   g.globalCompositeOperation='destination-out';g.save();g.translate(540,1090);g.scale(.62,.62);g.fillStyle='#000';g.beginPath();g.moveTo(-36,90);g.lineTo(0,170);g.lineTo(36,90);g.closePath();g.fill();g.restore();
   for(let i=0;i<5;i++){const x=80+i*230+(H1(i*17)-.5)*40;sil(g,x,1600+(H1(i*9)-.5)*60,1.2,{col:'#000'});}
   c.save();c.globalAlpha=.92;c.drawImage(REDL,0,0);c.restore();glowDot(c,540,1260,160,'#ff1e32',.25);}
  filmDirt(c,13);grain(c,0,.17);vignette(c,.8);hudPulse(c,'13:20');
  subType(c,['Ей девятнадцать. Она верит,','что может сделать мир лучше.'],{y:1700});
};
