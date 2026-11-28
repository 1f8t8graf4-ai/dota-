"use strict";
/* «Духless» · «Твоими глазами» v7 (28.11) — тот же голос и звук v6, картинка заново: места pv11.js (настоящая перспектива,
   свет по глубине, дымка — как архив v15). Движок — dlx8.js, план и HUD — отсюда (перекрывают pov10.js).
   N=<кадров> P10A=<папка с pov10.words.json> node render.mjs pov11 pov10 out.mp4 */

/* ===== миры: каждое место рисует себя целиком со своей 3D-камерой; 2D-камера движка почти не двигается ===== */
const LERP3=(a,b,k)=>[lp(a[0],b[0],k),lp(a[1],b[1],k),lp(a[2],b[2],k)];
const C1=[[0,540,960,1],[1,540,960,1.035]],C2=[[0,540,960,1.02],[1,540,960,1.07]];
for(const k of ['meet','maq','desk','lift','tver','vip','wc','mir','yulia','action','run','car','costume','hwc','vok','boss','empty','vadim','phone','far','icu','give','alone','club','doc','bag'])
  W8['q_'+k]=(c,t,o)=>P11[k](c,t,o||{});
// вокзал крупно: Юля по пояс на перроне
W8.q_vokc=(c,t,o)=>{P11.vok(c,t,{noY:1,E:[150,-165,200],T:[90,-170,1600]});const s=o.s??2.3;
  personA(c,{f:'yulia',x:540,y:o.cy??940,s,L:1,light:'#ffcf8a',la:.32,e:o.e||'sad',look:o.look||[0,0],cloth:{k:'parka'},sw:122,bt:560});
  c.save();c.globalCompositeOperation='screen';c.fillStyle=RG(c,180,800,40,700,[[0,'rgba(120,180,255,.2)'],[1,'rgba(120,180,255,0)']]);c.fillRect(0,0,WW,HH);c.restore();};
// ночь: клуб в стробоскопе, чужие лица, всё плывёт
W8.q_night=(c,t,o)=>{const k=o.k||0;P11.club(c,t,{E:[Math.sin(t*1.7)*60,-170,lp(0,500,k)],T:[Math.sin(t)*300,-260,2200],roll:Math.sin(t*1.3)*.12});
  const g=TB.getContext('2d');reset(g);g.clearRect(0,0,WW,HH);g.filter='blur(10px)';g.drawImage(c.canvas,0,0,c.canvas.width,c.canvas.height,0,0,WW,HH);g.filter='none';c.save();reset(c);c.globalAlpha=.55;c.drawImage(TB,0,0,WW,HH,0,0,c.canvas.width,c.canvas.height);c.restore();
  const F=[['st1',220,620,1.25,'#ff2f8e'],['woman',860,760,1.35,'#3fd6ff'],['st2',300,1260,1.6,'#ffd25a'],['clerk',820,1350,1.5,'#ff2f8e']];
  F.forEach(([f,x,y,s,col],i)=>{const a=cl(Math.sin(t*2.1+i*1.7)*.5+.5);if(a<.15)return;c.save();c.globalAlpha=.75*a;personA(c,{f,x:x+Math.sin(t+i)*30,y,s,L:i%2?1:-1,light:col,la:.55,e:i%2?'smile':'smirk',cloth:{k:'shirt',shirt:'#1a1a1f'},sw:120,bt:420});c.restore();});
  const st=Math.max(0,Math.sin(t*TAU*4))**8;c.save();c.globalCompositeOperation='screen';c.fillStyle=`rgba(255,255,255,${.35*st})`;c.fillRect(0,0,WW,HH);c.restore();};
// утро: та же сумка, холодный свет из окна полосами жалюзи
W8.q_morning=(c,t,o)=>{P11.bag(c,t,{});c.save();reset(c);c.globalCompositeOperation='multiply';c.fillStyle='rgba(150,175,210,1)';c.fillRect(0,0,WW,HH);c.restore();
  c.save();c.globalCompositeOperation='screen';for(let i=0;i<10;i++){c.fillStyle='rgba(200,220,255,.07)';c.beginPath();c.moveTo(0,300+i*120);c.lineTo(WW,120+i*120);c.lineTo(WW,170+i*120);c.lineTo(0,350+i*120);c.fill();}c.restore();};
// карта и подпись в кабинете шефа
W8.q_bmap=(c,t,o)=>P11.boss(c,t,{...o,view:'map'});W8.q_bsig=(c,t,o)=>P11.boss(c,t,{...o,view:'sig'});
W8.q_hmir=(c,t,o)=>P11.hwc(c,t,{...o,view:'mirror'});
W8.q_pen=(c,t,o)=>P11.doc(c,t,o);
W8.q_ebag=(c,t,o)=>P11.empty(c,t,{...o,view:'bag'});

/* ===== наложения ===== */
// воспоминание: лицо Лёши проступает над сумкой
function memLyosha(c,a){if(a<=0)return;c.save();c.globalAlpha=a*.6;c.filter='blur(1.5px)';headA(c,{f:{...AX.lyosha,mask:0},x:540,y:640,s:1.6,L:1,light:'#cfe9ff',la:.4,e:'smile'});c.restore();
  c.save();c.globalCompositeOperation='screen';c.fillStyle=RG(c,540,640,40,600,[[0,`rgba(180,220,255,${.25*a})`],[1,'rgba(180,220,255,0)']]);c.fillRect(0,0,WW,HH);c.restore();}
// трещины по кадру: от точки удара, расходятся; кадр чуть разъезжается по трещине
function cracks(c,k,cx=560,cy=880){if(k<=0)return;const n=11;c.save();c.strokeStyle='rgba(255,255,255,.85)';c.lineCap='round';c.shadowColor='rgba(255,255,255,.6)';c.shadowBlur=6;
  for(let i=0;i<n;i++){let x=cx,y=cy,a=i/n*TAU+H1(i)*.4;const L=(500+700*H1(i*3))*eo(k);c.lineWidth=3.5;c.beginPath();c.moveTo(x,y);for(let s=0;s<L;s+=60){a+=(H1(i*7+s)-.5)*.5;x+=Math.cos(a)*60;y+=Math.sin(a)*60;c.lineTo(x,y);}c.stroke();}
  c.lineWidth=2;for(let r=1;r<4;r++){c.beginPath();for(let i=0;i<=n;i++){const a=i/n*TAU,rr=r*120*eo(k)*(1+.2*H1(i*r));const x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr;i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();}
  c.restore();if(k>.6){c.save();c.globalCompositeOperation='multiply';c.fillStyle=`rgba(140,140,150,${(k-.6)*1.5})`;c.fillRect(0,0,WW,HH);c.restore();}}
function fadeBlack(c,k){if(k<=0)return;c.save();c.fillStyle=`rgba(0,0,0,${eio(cl(k))})`;c.fillRect(0,0,WW,HH);c.restore();}

/* ===== субтитры выше (в TikTok низ закрывают подпись и кнопки), без углов-рамок, HUD крупнее ===== */
const SUBY=1290;
subs=function(c,t){for(const S of SUBS){if(t<S.a||t>=S.b||t>ENDT)continue;if(t>QM.a-.1&&t<QM.b+.3)continue;const lt=t-S.a,sc=1+.08*Math.exp(-lt*22),a=cl(lt/.05);
  c.save();c.globalAlpha=a;c.translate(540,SUBY);c.scale(sc,sc);c.translate(-540,-SUBY);subLine(c,S.ws.map(w=>[w.t,w.acc]),{x:540,y:SUBY,s:96,max:960});c.restore();}};
corners=function(){};
maxQuote=function(c,t){if(t<QM.a-.05||t>QM.b+.35)return;const a=cl((t-QM.a+.05)/.12)*cl((QM.b+.35-t)/.2),two=t>QM.a+.98;c.save();c.globalAlpha=a;font(c,{f:'P',w:700,it:1,s:72});c.textAlign='center';c.textBaseline='middle';
  c.shadowColor='rgba(0,0,0,.95)';c.shadowBlur=26;c.fillStyle='#fff';if(!two)c.fillText(T10('maxq1','«Я всего добился сам.'),540,SUBY);else{c.fillText(T10('maxq2','«Я не виноват, что я'),540,SUBY-40);c.fillText(T10('maxq3','не инвалид и не урод»'),540,SUBY+45);}
  tx(c,T10('maxn','МАКС · ИЗ ФИЛЬМА'),540,SUBY-130,{f:'J',w:700,s:26,ls:6,c:'#ffb13b'});c.restore();};
const HLB={pass:'РАБОТА',club:'КЛУБ',friend:'ДРУГ',cam:'ЮЛЯ'};
hud=function(c,t,S){if(S.nohud)return;c.save();c.shadowColor='rgba(0,0,0,.85)';c.shadowBlur=12;if(S.hud&&S.hud[0]){c.fillStyle='#ff5a36';c.beginPath();c.arc(64,128,8,0,TAU);c.fill();
  tx(c,S.hud[0],84,138,{f:'J',w:700,s:28,ls:3,al:'left',c:'rgba(255,255,255,.95)'});}c.restore();
  const K=['pass','club','friend','cam'];K.forEach((k,i)=>{const [st,pop]=hudState(t,i);if(st===0)return;const x=WW-78-(3-i)*92,y=134;icon10(c,k,x,y,1.12,st,pop);
    tx(c,HLB[k],x,y+52,{f:'J',w:700,s:17,ls:2,c:st>=2?'#ff4a5a':'rgba(255,255,255,.85)'});
    if(st>=2){const kk=cl(st-2);c.save();c.translate(x,y);c.strokeStyle='#ff2a3a';c.lineWidth=9;c.lineCap='round';c.shadowColor='rgba(255,40,60,.8)';c.shadowBlur=14;c.beginPath();c.moveTo(-38,38);c.lineTo(lp(-38,38,kk),lp(38,-38,kk));c.stroke();c.restore();}});};

/* ===== план: те же слова голоса v6 ===== */
PLANG.pov10=S=>{let t=0;const nx=(b,o)=>{o.a=t;o.b=b;t=b;o.hh=1;S.push(o);return o;};const H=k=>[T10('hud.'+k)],A=i=>wa(i)-.05,B=i=>wb(i),iv=(a,b,T)=>inv(a,b,T);
  HST.length=0;HST.push(['pass',wa(22),wa(198)],['club',wa(60),wa(212)],['friend',wa(69),wa(245)],['cam',wa(88),wa(175)]);
  const mv=(E0,E1,T0,T1)=>(T,lt,u)=>({E:LERP3(E0,E1,eio(u)),T:LERP3(T0,T1||T0,eio(u))});
  // 1. глаза открываются: переговорная
  nx(A(11),{w:'q_meet',o:mv([0,-135,0],[0,-133,90],[0,-105,700]),cam:C1,hud:H('meet'),ov:(c,T,lt)=>blink(c,lt)});
  nx(A(16),{w:'q_meet',o:(T,lt,u)=>({E:LERP3([0,-133,120],[0,-128,300],eio(u)),T:[0,-140,700],bossE:'neutral'}),tin:'push',cam:C1,hud:H('meet')});
  nx(A(21),{w:'q_maq',o:(T,lt,u)=>({u:eio(u)}),tin:'cut',cam:C1,hud:H('meet')});
  nx(A(23),{w:'q_meet',o:(T,lt,u)=>{const n=Math.sin(Math.PI*cl(u*1.6))*(u<.62?1:0);return {E:[0,-130,250],T:[0,-140+n*160,700]};},tin:'cut',cam:C1,hud:H('meet')});
  nx(A(30),{w:'q_desk',o:(T,lt,u)=>({u:eio(u)}),tin:'whipv',cam:C1,hud:H('meet')});
  nx(A(35),{w:'q_desk',o:(T,lt,u)=>({u:1,mark:eio(iv(wa(31),wb(34),T)),E:LERP3([0,-80,-10],[5,-62,5],eio(u)),T:[-6,0,70]}),tin:'push',cam:C1,hud:H('meet'),
    ov:(c,T)=>zerosNum(c,T,{t0:wa(31),t1:wb(32),te:wa(34),y:520,s:200})});
  // вниз — Тверская — клуб
  nx(A(36),{w:'q_lift',o:(T,lt,u)=>({k:eio(cl(u*1.15)),open:eio(cl((u-.7)*3.3))}),tin:'cut',cam:C1,hud:H('lift')});
  nx(A(37),{w:'q_tver',o:mv([1050,-175,0],[1080,-175,700],[200,-1500,16000]),tin:'push',cam:C1,hud:H('tver')});
  nx(A(38),{w:'q_tver',o:mv([1250,-170,1300],[1380,-168,1850],[1650,-220,2800],[1690,-200,2800]),tin:'cut',cam:C1,hud:H('club'),dive:()=>[600,900]});
  nx(A(42),{w:'q_vip',o:mv([0,-120,-40],[0,-120,0],[0,-100,260]),tin:'dive',cam:C1,hud:H('vip')});
  nx(A(52),{w:'q_vip',o:(T,lt,u)=>({E:LERP3([-20,-118,0],[-28,-118,60],eio(u)),T:[-30,-112,300]}),tin:'cut',cam:C1,hud:H('vip'),ov:(c,T)=>slamNum(c,T,wa(50),'600 000 $',{y:520,s:190,tag:T10('vip.tag','ПАРТНЁР УКРАЛ У МИШИ')})});
  nx(A(57),{w:'q_vip',o:{E:[-30,-117,90],T:[-30,-114,300],mishaE:'smirk'},tin:'cut',cam:C2,hud:H('vip')});
  nx(A(63),{w:'q_pen',o:(T,lt,u)=>({sig:iv(wb(62)-.25,wb(62)+.55,T),E:LERP3([30,-70,0],[24,-60,8],eio(u))}),tin:'cut',cam:C1,hud:H('vip')});
  nx(A(70),{w:'q_vip',o:(T,lt,u)=>({E:LERP3([0,-120,0],[40,-118,40],eio(u)),T:[60,-112,300],vadE:T>wa(67)?'smile':'neutral'}),tin:'whip',cam:C1,hud:H('vip')});
  // туалет и зеркало
  nx(A(77),{w:'q_wc',o:(T,lt,u)=>({u:eio(u),flick:(Math.sin(T*23)>.7&&Math.sin(T*7)>0)?.25:1}),tin:'flash',cam:C1,hud:H('wc')});
  nx(A(85),{w:'q_mir',o:(T)=>({maxE:T>wa(83)?'smirk':'neutral'}),tin:'cut',cam:[[0,540,900,1.0],[1,540,880,1.12]],hud:H('wc')});
  // Юля
  nx(A(100),{w:'q_yulia',o:(T,lt,u)=>({e:'smile',s:lp(2.4,2.6,u)}),tin:'push',cam:C1,hud:H('yulia')});
  nx(A(108),{w:'q_action',o:mv([-40,-165,300],[-30,-165,420],[200,-190,1100]),tin:'whip',cam:C1,hud:H('action'),ov:(c,T)=>viewfinder(c,T,.7)});
  nx(A(111),{w:'q_action',o:mv([60,-150,560],[80,-150,620],[220,-140,900]),tin:'cut',cam:C1,hud:H('action'),ov:(c,T)=>viewfinder(c,T,.7)});
  nx(A(113),{w:'q_action',o:(T,lt,u)=>({E:[-40,-165,420],T:[200,-190,1100],pol:eio(cl(u*2))}),tin:'flash',shake:1,cam:C2,hud:H('action'),ov:(c,T)=>viewfinder(c,T,.5)});
  nx(A(117),{w:'q_run',o:(T,lt,u)=>({u}),tin:'whip',roll:1,shake:1,cam:C1,hud:H('run')});
  nx(A(125),{w:'q_yulia',o:(T)=>({e:T<wa(123)?'neutral':'sad',s:3.1,cy:930}),tin:'cut',cam:C2,hud:H('yulia')});
  nx(A(130),{w:'q_yulia',o:{e:'sad',s:3.1,cy:930},post:'grey',cam:[[0,540,960,1.07],[1,540,960,1.0]],hud:H('yulia')});
  nx(A(137),{w:'q_car',o:(T,lt,u)=>({hosp:eio(u)}),tin:'push',cam:C1,hud:H('car')});
  nx(A(142),{w:'q_costume',o:(T,lt,u)=>({k:eio(u),nose:iv(wb(141)-.35,wb(141)+.15,T)}),tin:'cut',cam:C1,hud:H('hosp')});
  // больничный туалет, Лёша, клоун в зеркале
  nx(A(150),{w:'q_hwc',o:{lyE:'neutral'},tin:'cut',cam:C1,hud:H('hwc')});
  nx(A(158),{w:'q_hwc',o:{lyE:'smile'},tin:'cut',cam:[[0,600,860,1.25],[1,600,850,1.4]],hud:H('hwc')});
  nx(A(162),{w:'q_hmir',o:{clE:'sad'},tin:'cut',cam:C1,hud:H('hwc')});
  // вокзал: Юля, голос Макса, «калека»
  nx(A(171),{w:'q_vok',o:mv([120,-165,0],[130,-165,200],[40,-175,1600]),tin:'whip',cam:C1,hud:H('station')});
  nx(VO.maxq.a-.02,{w:'q_vokc',o:{e:'sad',s:2.3},tin:'cut',cam:C1,hud:H('station')});
  nx(A(174),{w:'q_vokc',o:{e:'scared',s:2.5,cy:960},tin:'cut',shake:1,cam:C2,hud:H('station'),ov:(c,T)=>maxQuote(c,T)});
  nx(A(179),{w:'q_vokc',o:{e:'neutral',s:2.7,cy:990},tin:'cut',cam:C2,hud:H('station')});
  // всё рушится
  nx(A(187),{w:'q_vokc',o:{e:'neutral',s:2.7,cy:990},shake:1,cam:[[0,540,960,1.07],[1,540,960,1.0]],hud:H('station'),ov:(c,T)=>cracks(c,iv(wa(181),wb(186)+.2,T))});
  // кабинет шефа: карта, подпись, уволен
  nx(A(194),{w:'q_bmap',o:(T)=>({zone:eio(iv(wa(192),wb(193),T))}),tin:'cut',cam:C1,hud:H('boss')});
  nx(A(198),{w:'q_bsig',o:(T)=>({circle:eio(iv(wa(197),wb(197)+.3,T))}),tin:'whip',cam:C1,hud:H('boss')});
  nx(A(201),{w:'q_boss',o:{bossE:'neutral'},tin:'cut',cam:[[0,540,900,1.05],[1,540,880,1.2]],hud:H('boss')});
  // пустой клуб Миши
  nx(A(205),{w:'q_empty',o:(T,lt,u)=>({E:LERP3([0,-160,40],[0,-160,240],eio(u)),mishaE:'neutral'}),tin:'push',cam:C1,hud:H('empty')});
  nx(A(214),{w:'q_empty',o:{mishaE:'smirk',E:[20,-155,400],T:[30,-150,800]},tin:'cut',cam:C2,hud:H('empty')});
  nx(A(223),{w:'q_empty',o:{mishaE:'scared',E:[20,-155,420],T:[30,-150,800]},tin:'cut',shake:1,cam:C2,hud:H('empty')});
  nx(A(230),{w:'q_vadim',o:{e:'shout'},tin:'whip',shake:1,cam:C2,hud:H('vadim')});
  // звонок: гудки, тишина, хлопок, экран гаснет
  nx(A(240),{w:'q_phone',o:(T)=>({st:T>wa(237)?1:0}),tin:'cut',cam:C1,hud:H('phone')});
  nx(A(242),{w:'q_phone',o:(T,lt,u)=>({st:1,off:eio(u)}),cam:C1,hud:H('phone')});
  nx(A(245),{w:'q_far',o:(T)=>({k:iv(wa(244),wa(244)+1.2,T)}),tin:'cut',cam:C1,hud:['']});
  nx(A(251),{w:'q_phone',o:{st:1,off:.94},tin:'cut',cam:C1,hud:H('phone')});
  // сумка, Лёша, ночь, провал, утро
  nx(A(257),{w:'q_bag',tin:'cut',cam:[[0,540,960,1.0],[1,540,980,1.1]],hud:H('car')});
  nx(A(266),{w:'q_bag',cam:[[0,540,980,1.1],[1,540,990,1.16]],hud:H('car'),ov:(c,T)=>memLyosha(c,Math.sin(Math.PI*cl(iv(wa(262),wb(265)+.3,T)))*.95)});
  nx(A(274),{w:'q_night',o:(T,lt,u)=>({k:u}),tin:'whip',shake:1,cam:C1,hud:H('club'),ov:(c,T,lt)=>{const k=iv(wa(273),wb(273)+.1,T);if(k>0)blink(c,1-k);}});
  nx(A(279),{w:'q_morning',tin:'cut',cam:[[0,540,960,1.0],[1,560,1000,1.12]],hud:H('morning')});
  // реанимация
  nx(A(287),{w:'q_icu',o:(T)=>({lamp:T<wa(286)+.25?1:0}),tin:'cut',cam:[[0,540,940,1.0],[1,540,900,1.18]],hud:H('icu')});
  nx(A(299),{w:'q_give',o:(T,lt,u)=>({k:eio(cl(u*2)),e:T<wa(295)?'scared':'smile'}),tin:'push',cam:C1,hud:H('give')});
  // финал: один у окна
  ENDT=DUR+5;DUR=wb(320)+2.6;
  nx(DUR,{w:'q_alone',o:{nose:1},tin:'cut',cam:[[0,540,900,1.0],[.6,560,1060,1.25],[1,620,1180,1.6]],hud:[''],ov:(c,T)=>fadeBlack(c,(T-wa(315))/1.6)});
  ENDT=DUR+5;
};
