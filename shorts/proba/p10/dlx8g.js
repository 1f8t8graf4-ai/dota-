"use strict";
/* «Духless» RU · 4 ролика по сюжетам Gemini (27.11): g1 реализм (Майк, в начале — голос Макса из фильма), g2 «Чистая Династия» (васян),
   g3 «Взрослая Династия» — нуар (васян), g4 грязные 35 мм + один красный (Майк). Движок, миры, HUD и субтитры — dlx8.js.
   N=<кадров> P10A=<папка с g1..g4.words.json> node render.mjs dlx8g g1|g2|g3|g4 out.mp4 */

/* ---------- стоп-кадр 26.11 как мир: без HUD, подписей и цветокора ---------- */
const STUB=['hudTop','hudBot','subLine','corners','fin','hudReal','subThin','hudNoir','subSerif','hudCorp','hudDyn','hudPulse','hudTaxi','subType','tag','bigNum','grain','vignette'];
W8.stl=(c,t,o)=>{const keep={};for(const k of STUB){keep[k]=window[k];window[k]=()=>{};}
  try{SC[o.sc](c,t);}finally{for(const k of STUB)window[k]=keep[k];}
  if(o.live)o.live(c,t);};

/* ---------- дверь туалета: бас за стеной ---------- */
W8.door=(c,t,o)=>{tiles(c,0,0,WW,HH,{base:'#b9c4cb'});c.fillStyle='rgba(8,14,20,.6)';c.fillRect(0,0,WW,HH);
  const b=Math.pow(Math.max(0,Math.cos(t*TAU*105.5/60)),6),dx=270,dy=330,dw=540,dh=1300,j=b*3*Math.sin(t*80);
  glowDot(c,540,dy+dh/2,760,'#ff2f8e',.18+.3*b);
  c.fillStyle='#0a0c10';c.fillRect(dx-40,dy-40,dw+80,dh+40);
  c.fillStyle=rgba('#ff2f8e',.6+.4*b);c.fillRect(dx-6,dy+dh-6,dw+12,16);c.fillRect(dx-12,dy,10,dh);c.fillRect(dx+dw+2,dy,10,dh);
  c.save();c.translate(j,0);c.fillStyle=LG(c,dx,0,dx+dw,0,[[0,'#2b3138'],[.5,'#3d454e'],[1,'#22272d']]);c.fillRect(dx,dy,dw,dh);
  c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=4;c.strokeRect(dx+40,dy+60,dw-80,dh/2-90);c.strokeRect(dx+40,dy+dh/2+30,dw-80,dh/2-90);
  c.fillStyle=LG(c,0,dy+dh/2-60,0,dy+dh/2+60,[[0,'#cfd5db'],[1,'#7d858d']]);rr(c,dx+dw-140,dy+dh/2-70,90,140,8);c.fill();
  c.fillStyle='rgba(255,255,255,.07)';c.fillRect(dx+8,dy,6,dh);c.restore();
  c.fillStyle=LG(c,0,dy+dh,0,HH,[[0,rgba('#ff2f8e',.35*(.5+b))],[1,'rgba(0,0,0,0)']]);c.fillRect(0,dy+dh,WW,HH-dy-dh);
  fgBlur(c,10,g=>{g.fillStyle='#07090c';g.fillRect(-40,0,150,HH);g.fillRect(WW-110,0,150,HH);});};

/* ---------- телефон: «Вадим — автоответчик» ---------- */
W8.phone=(c,t,o)=>{blurred(c,14,g=>W8.stl(g,t,{sc:'b2'}));c.fillStyle='rgba(30,36,44,.45)';c.fillRect(0,0,WW,HH);
  const lt=o.lt||0;c.save();c.translate(540,980);c.rotate(-.05);
  c.fillStyle='rgba(0,0,0,.5)';rr(c,-250,-470,520,980,60);c.fill();c.fillStyle='#050507';rr(c,-270,-500,540,1000,64);c.fill();
  c.fillStyle=LG(c,0,-470,0,470,[[0,'#1d2433'],[1,'#0b0f17']]);rr(c,-244,-472,488,944,46);c.fill();
  c.fillStyle='#050507';rr(c,-60,-462,120,30,15);c.fill();
  c.fillStyle='#3a4358';c.beginPath();c.arc(0,-250,96,0,TAU);c.fill();tx(c,'В',0,-215,{f:'M',w:700,s:96,c:'#c7cfdd'});
  tx(c,'Вадим',0,-90,{f:'M',w:700,s:64,c:'#fff'});
  const st=lt<.9?'вызов'+'.'.repeat(1+Math.floor(lt*4)%3):'автоответчик';tx(c,st,0,-30,{f:'M',w:500,s:36,c:lt<.9?'rgba(255,255,255,.65)':'#ff8a80'});
  if(lt>.9){tx(c,'00:0'+Math.min(9,Math.floor((lt-.9)*3)),0,30,{f:'J',w:500,s:30,c:'rgba(255,255,255,.5)'});}
  const k=1+.08*Math.sin(t*9);c.fillStyle='#ff3b30';c.beginPath();c.arc(0,320,62*k,0,TAU);c.fill();c.save();c.translate(0,320);c.rotate(2.36);c.strokeStyle='#fff';c.lineWidth=12;c.lineCap='round';
  c.beginPath();c.arc(0,0,26,-1,1);c.stroke();c.restore();glowDot(c,0,320,160,'#ff3b30',.35);
  c.restore();glowDot(c,540,900,520,'#6f8cff',.18);};

/* ---------- стол с папкой «Рай миллионеров» ---------- */
W8.deskf=(c,t,o)=>{W8.desk(c,t,{title:false});const k=eo(cl(o.fold||0));
  c.save();c.translate(540,lp(-700,1000,k));c.rotate(lp(.25,-.05,k));c.fillStyle='rgba(0,0,0,.5)';c.fillRect(-380,-500,780,1060);
  c.fillStyle=LG(c,-400,0,400,0,[[0,'#3a2418'],[.5,'#5a3a26'],[1,'#2e1c12']]);rr(c,-400,-520,800,1060,18);c.fill();
  c.strokeStyle='rgba(0,0,0,.4)';c.lineWidth=6;rr(c,-370,-490,740,1000,12);c.stroke();
  c.fillStyle='#d9c08a';rr(c,-260,-170,520,180,8);c.fill();c.strokeStyle='#8a6a32';c.lineWidth=3;rr(c,-246,-156,492,152,6);c.stroke();
  tx(c,'ПРОЕКТ',0,-100,{f:'M',w:800,s:30,ls:8,c:'#3a2a18'});tx(c,'«РАЙ МИЛЛИОНЕРОВ»',0,-40,{f:'P',w:700,s:46,c:'#2a1c10'});
  c.restore();if(k>.95)glowDot(c,540,900,400,'#ffd9a0',.15);};

/* ---------- накладки ---------- */
function crack(c,k,seed=3){if(k<=0)return;const P=[[540,700]],r=rng(seed);for(let i=0;i<14;i++){const p=P[P.length-1];P.push([p[0]+(r()-.5)*170,p[1]+60+r()*70]);}
  const n=Math.max(2,Math.floor(P.length*k));c.save();c.lineJoin='miter';c.strokeStyle='rgba(255,255,255,.95)';c.shadowColor='#ffd9a0';c.shadowBlur=18;c.lineWidth=5;
  c.beginPath();c.moveTo(P[0][0],P[0][1]);for(let i=1;i<n;i++)c.lineTo(P[i][0],P[i][1]);c.stroke();
  c.lineWidth=2;for(let i=2;i<n;i+=3){const p=P[i],a=(r()-.5)*2.4;c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(p[0]+Math.cos(a)*160,p[1]+Math.sin(a)*90);c.stroke();}
  c.beginPath();for(let i=n-1;i>=0;i--)c.lineTo(P[i][0],P[i][1]);c.restore();}
function rewind(c,t,lt){c.save();for(let i=0;i<9;i++){const y=((t*900*(1+i*.13)+i*317)%HH+HH)%HH,h=10+H1(i)*40;
  const g=TB.getContext('2d');c.globalAlpha=.55;c.drawImage(c.canvas,0,y,WW,h,-40+H1(i*3)*80,y,WW,h);c.globalAlpha=.2;c.fillStyle='#fff';c.fillRect(0,y,WW,2);}
  c.globalAlpha=1;c.fillStyle='rgba(255,255,255,.06)';for(let y=0;y<HH;y+=6)c.fillRect(0,y,WW,2);
  tx(c,'◀◀',540,760,{f:'M',w:800,s:220,c:'rgba(255,255,255,.9)',glow:'#f5a623',gb:30});tx(c,'ПЕРЕМОТКА',540,880,{f:'J',w:700,s:44,ls:10,c:'#f5a623'});c.restore();}
function words3(c,t,list,o={}){for(let i=0;i<list.length;i++){const [t0,s]=list[i];if(t<t0)continue;slamNum(c,t,t0,s,{key:'w3'+s,s:o.s||170,y:(o.y||560)+i*(o.dy||190),d:14,face:o.face,side:o.side});}}

/* ---------- пост-обработка кадра ---------- */
function post(c,mode,t,i){
  if(mode==='grey'){c.save();c.globalCompositeOperation='saturation';c.fillStyle='rgba(128,128,128,.85)';c.fillRect(0,0,WW,HH);c.globalCompositeOperation='soft-light';c.fillStyle='rgba(150,170,195,.55)';c.fillRect(0,0,WW,HH);c.restore();}
  else if(mode==='noir'){c.save();c.globalCompositeOperation='saturation';c.fillStyle='rgba(128,128,128,.6)';c.fillRect(0,0,WW,HH);c.globalCompositeOperation='soft-light';c.fillStyle='rgba(0,0,0,.35)';c.fillRect(0,0,WW,HH);c.restore();texOver(c,.14,'nzc');}
  else if(mode==='mono'){const im=c.getImageData(0,0,WW,HH),d=im.data;
    for(let p=0;p<d.length;p+=4){const r=d[p],g=d[p+1],b=d[p+2];
      if(r>90&&r>g*1.7&&r>b*1.45){d[p]=Math.min(255,r*1.15+25);d[p+1]=g*.22;d[p+2]=b*.28;}
      else{let v=.3*r+.59*g+.11*b;v=(v-118)*1.45+112;v=v<0?0:v>255?255:v;d[p]=d[p+1]=d[p+2]=v;}}
    c.putImageData(im,0,0);}}

/* ================= раскадровка ================= */
const PLANG={};
PLANG.g1=S=>{let t=0;const nx=(b,o)=>{o.a=t;o.b=b;t=b;o.hh=1;S.push(o);return o;};QT.a=.2;
  nx(wa(0)-.05,{w:'toilet',o:(T)=>({mouth:T>QT.a+.02&&T<QT.a+1.35?flap(T,1.3):'flat'}),hi:2,cam:[[0,540,800,1.7],[1,540,780,1.86]],hud:['МОСКВА · КЛУБ · 03:12']});
  nx(wa(3)-.05,{w:'toilet',o:{flick:1},tin:'cut',cam:[[0,540,1000,1.05],[1,540,960,1.13]],hud:['МОСКВА · КЛУБ · ТУАЛЕТ']});
  nx(wa(9)-.06,{w:'toilet',o:{flick:1},hi:2,tin:'cut',cam:[[0,540,240,2.3],[1,540,320,2.0]],hud:['МОСКВА · КЛУБ · ТУАЛЕТ']});
  nx(wa(18)-.06,{w:'stl',o:{sc:'g1a'},tin:'whipv',cam:[[0,560,1250,1.25],[1,600,1330,1.42]],hud:['МОСКВА · КЛУБ · ТУАЛЕТ']});
  nx(wa(22)-.06,{w:'door',tin:'cut',shake:1,cam:[[0,540,980,1.05],[1,540,960,1.2]],hud:['МОСКВА · КЛУБ · 03:14']});
  nx(wa(28)-.06,{w:'crowd',o:(T,lt,u)=>({k:eio(u),blur:.03}),tin:'push',cam:[[0,540,960,1.05],[1,540,940,1.1]],hud:['МОСКВА · КЛУБ · ТАНЦПОЛ']});
  nx(wa(31)-.06,{w:'entry',o:(T,lt,u)=>({pov:1,rope:eo(u*1.4),door:.4}),tin:'whip',cam:[[0,640,880,1.35],[1,700,860,1.5]],hud:['МОСКВА · КЛУБ · ВХОД']});
  nx(wa(34)-.06,{w:'office',tin:'cut',cam:[[0,620,900,1.02],[1,640,860,1.16]],hud:['МЕГАПОЛИС · 42 ЭТАЖ']});
  nx(wa(42)-.06,{w:'bank',o:{smile:0},hi:2,tin:'whip',cam:[[0,540,980,1.02],[1,540,960,1.14]],hud:['МЕГАПОЛИС · КАБИНЕТ'],ov:(c,T)=>chip(c,T,wa(37)-.05,'€ ?00 000 · В ГОД',540,620)});
  nx(wa(46)-.06,{w:'stl',o:{sc:'g1b'},tin:'cut',cam:[[0,520,960,1.04],[1,580,940,1.14]],hud:['МОСКВА · ЗА СТЕКЛОМ']});
  nx(wa(53)-.06,{w:'moscow',o:(T,lt)=>({cz:300+lt*500,blur:.01}),tin:'cut',cam:[[0,540,900,1.04],[1,540,880,1.1]],hud:['МОСКВА · 03:40']});
  ENDT=wb(65)+.4;DUR=ENDT+1.5;
  nx(DUR,{w:'deskf',o:(T)=>({fold:inv(wa(57),wa(57)+.65,T)}),hi:2,tin:'flash',cam:[[0,540,1000,1.05],[.6,540,960,1.1],[1,540,900,1.3]],hud:['МЕГАПОЛИС · 08:00']});
};
PLANG.g2=S=>{let t=0;const nx=(b,o)=>{o.a=t;o.b=b;t=b;S.push(o);return o;};const GOLD={face:['#fff4c8','#ffd055','#ff9d1c']};
  nx(wa(3)-.06,{w:'city',post:'grey',cam:[[0,540,960,1.02],[1,540,930,1.12]]});
  nx(wa(8)-.05,{w:'office',post:'grey',tin:'whip',cam:[[0,640,900,1.12],[1,640,860,1.24]]});
  nx(wa(16)-.06,{w:'phone',o:(T,lt)=>({lt}),post:'grey',tin:'cut',cam:[[0,540,980,1.02],[1,540,960,1.12]]});
  nx(wa(23)-.06,{w:'bank',post:'grey',hi:2,tin:'whip',cam:[[0,540,980,1.04],[1,540,900,1.22]]});
  nx(wa(26)-.06,{w:'numbg',tin:'cut',cam:[[0,540,960,1.0],[1,540,940,1.06]],ov:(c,T)=>words3(c,T,[[wa(23)-.03,'ВЫ'],[wa(24)-.03,'УВОЛЕНЫ,'],[wa(25)-.03,'МАКС']],{s:170,y:520,dy:200})});
  nx(wa(30)-.06,{w:'city',tin:'cut',cam:[[0,540,960,1.15],[1,540,960,1.0]],ov:(c,T,lt)=>rewind(c,T,lt)});
  nx(wa(39)-.06,{w:'city',tin:'flash',cam:[[0,540,960,1.0],[1,540,920,1.12]],ov:(c,T)=>{slamNum(c,T,wa(33)-.1,'2012',{s:330,y:560,d:26});}});
  nx(wa(42)-.06,{w:'bank',o:{smile:1},hi:2,tin:'whip',cam:[[0,540,960,1.02],[1,540,980,1.14]]});
  nx(wa(48)-.06,{w:'numbg',tin:'whip',cam:[[0,540,960,1.0],[1,540,950,1.06]],dive:()=>[540,760],ov:(c,T)=>zerosNum(c,T,{t0:wa(44),t1:wb(45),te:wa(47),tag:'В ГОД'})});
  nx(wa(54)-.06,{w:'girls',hi:2,tin:'dive',cam:[[0,540,1000,1.05],[1,540,1020,1.14]],o:{seed:4}});
  nx(wa(61)-.06,{w:'club',tin:'whip',cam:[[0,540,1000,1.05],[1,540,960,1.18]]});
  nx(wa(67)-.06,{w:'club',tin:'cut',cam:[[0,540,960,1.18],[1,540,960,1.22]],ov:(c,T)=>crack(c,inv(wa(61),wb(66),T))});
  ENDT=wb(78)+.4;DUR=ENDT+1.5;
  nx(DUR,{w:'desk',o:(T)=>({sig:inv(wa(74),wb(74)+.25,T)}),hi:2,tin:'cut',cam:[[0,540,1100,1.05],[1,500,1330,1.4]],ov:(c,T)=>crack(c,inv(wa(77),wb(78),T),9)});
};
PLANG.g3=S=>{let t=0;const nx=(b,o)=>{o.a=t;o.b=b;t=b;S.push(o);return o;};
  nx(wa(9)-.06,{w:'stl',o:{sc:'h3a'},hi:2,cam:[[0,540,960,1.0],[1,530,860,1.22]]});
  nx(wa(18)-.06,{w:'steel',tin:'whip',cam:[[0,420,700,1.22],[1,660,680,1.3]],ov:(c,T)=>chip(c,T,wa(14)-.05,'ДОХОД: € ?00 000',540,1000)});
  nx(wa(30)-.06,{w:'desk',o:(T)=>({sig:inv(wa(20),wb(24),T),dark:1}),hi:2,tin:'whipv',cam:[[0,540,1060,1.05],[1,480,1320,1.42]]});
  nx(wa(35)-.06,{w:'stl',o:{sc:'h3a'},hi:2,tin:'cut',cam:[[0,520,860,2.1],[1,520,850,2.35]]});
  nx(wa(41)-.06,{w:'meeting',o:{smile:1,fg:false},hi:2,tin:'whip',cam:[[0,540,760,1.9],[1,540,740,2.1]],ov:(c)=>{c.save();c.globalCompositeOperation='multiply';c.fillStyle='rgba(120,130,145,1)';c.fillRect(0,0,WW,HH);c.restore();}});
  nx(wa(45)-.06,{w:'champ',o:{pop:wa(42)},tin:'cut',cam:[[0,560,980,1.0],[1,560,950,1.08]]});
  nx(wa(52)-.06,{w:'club',tin:'whip',cam:[[0,540,1000,1.04],[1,540,980,1.14]]});
  nx(wa(64)-.06,{w:'stl',o:{sc:'h3b'},hi:2,tin:'cut',burn:0,cam:[[0,540,1200,1.0],[.55,520,1300,1.3],[1,420,1400,1.6]]});
  ENDT=wb(68)+.4;DUR=ENDT+1.5;
  nx(DUR,{w:'stl',o:{sc:'h3a'},hi:2,tin:'cut',cam:[[0,520,850,2.0],[1,520,840,2.5]]});
};
PLANG.g4=S=>{let t=0;const nx=(b,o)=>{o.a=t;o.b=b;t=b;o.hh=1;S.push(o);return o;};
  nx(wa(4)-.06,{w:'club',cam:[[0,540,1000,1.05],[1,540,980,1.12]],hud:['04:15']});
  nx(wa(8)-.06,{w:'club',hi:2,tin:'cut',burn:1,cam:[[0,540,420,1.7],[1,540,460,1.9]],hud:['04:15']});
  nx(wa(10)-.06,{w:'vip',hi:2,tin:'cut',cam:[[0,520,1360,3.0],[1,520,1360,3.3]],hud:['04:16']});
  nx(wa(14)-.06,{w:'vip',o:{maxBrow:'flat'},hi:2,tin:'cut',cam:[[0,760,1050,2.4],[1,760,1045,2.7]],hud:['04:16']});
  nx(wa(18)-.06,{w:'numbg',tin:'cut',burn:-1,cam:[[0,540,960,1.0],[1,540,940,1.06]],hud:['04:17'],ov:(c,T,lt)=>{zerosNum(c,T,{t0:wa(14),t1:wb(15),te:wa(17)});post(c,'mono',T,0);}});
  nx(wa(22)-.06,{w:'girls',hi:2,tin:'cut',cam:[[0,540,1000,1.08],[1,540,1020,1.16]],o:{seed:7},hud:['04:18']});
  nx(wa(26)-.06,{w:'stl',o:{sc:'g1a'},tin:'cut',cam:[[0,560,1300,1.3],[1,600,1350,1.45]],hud:['04:19']});
  nx(wa(33)-.06,{w:'city',tin:'cut',burn:1,cam:[[0,540,980,1.04],[1,540,940,1.14]],hud:['04:24']});
  nx(wa(45)-.06,{w:'stl',o:{sc:'h4a'},hi:2,tin:'cut',cam:[[0,540,900,1.12],[1,540,820,1.35]],hud:['07:30']});
  nx(wa(47)-.06,{w:'stl',o:{sc:'h4a'},hi:2,tin:'cut',cam:[[0,540,760,1.9],[1,540,760,1.95]],hud:['07:30']});
  nx(wa(49)-.06,{w:'stl',o:{sc:'h4a'},hi:2,tin:'cut',cam:[[0,540,740,2.9],[1,540,740,3.0]],hud:['07:30']});
  nx(wa(51)-.06,{w:'club',tin:'cut',burn:-1,cam:[[0,540,960,1.0],[1,540,960,1.04]],hud:['04:15']});
  nx(wa(58)-.06,{w:'office',tin:'cut',cam:[[0,640,900,1.04],[1,640,860,1.16]],hud:['08:10']});
  ENDT=wb(72)+.4;DUR=ENDT+1.5;
  nx(DUR,{w:'stl',o:{sc:'h4b'},hi:2,tin:'cut',burn:1,cam:[[0,540,1000,1.0],[1,540,1080,1.35]],hud:['13:20']});
};
Object.assign(KW,{g1:'ночи лампа режет глаза мрамор дорожки бас плечом толпа кивает двадцать девять мегаполисе нулей евро москва поводке шеф папку рай миллионеров',
  g2:'представь серое утро работы статуса трубку уволены макс недавно двенадцатого ног мегаполис нулями евро вечеринки вспышки взломал жизнь рухнуло трещина подписал быстро',
  g3:'хищник мегаполисе нулей евро подпись рай миллионеров вторую мелочи улыбается плечу шампанское нужен полигон химоружия крайним тебя',
  g4:'клуб орёт глаза пуст ничего нулей евро улыбки полоски москва зеркало злости радости шум мёртвым девчонку девятнадцать лучше'});
