"use strict";
/* «Духless» v8 «чисто Династия» (28.11) — голос и звук v6, картинка 2D по их ролику про Александра (dy12.js).
   N=3748 P10A=<папка с pov10.words.json> node render.mjs pov12 pov10 out.mp4 */
const ZC=(z0=1,z1=1.06,y0=960,y1=950)=>[[0,540,y0,z0],[1,540,y1,z1]];
for(const k of Object.keys(P12))W8['z_'+k]=(c,t,o)=>{P12[k](c,t,o||{});dyFin(c,t,null);};
W8.z_night=(c,t,o)=>{P12.club(c,t,{});const F=[['st1',220,620,1.25,'#ff2f8e'],['woman',860,760,1.35,'#3fd6ff'],['st2',300,1260,1.6,'#ffd25a'],['clerk',820,1350,1.5,'#ff2f8e']];
  F.forEach(([f,x,y,s,col],i)=>{const a=cl(Math.sin(t*2.1+i*1.7)*.5+.5);if(a<.15)return;c.save();c.globalAlpha=.8*a;personA(c,{f,x:x+Math.sin(t+i)*30,y,s,L:i%2?1:-1,light:col,la:.55,e:i%2?'smile':'smirk',cloth:{k:'shirt',shirt:'#1a1a1f'},sw:120,bt:420});c.restore();});
  const st=Math.max(0,Math.sin(t*TAU*4))**8;c.save();c.globalCompositeOperation='screen';c.fillStyle=`rgba(255,255,255,${.35*st})`;c.fillRect(0,0,WW,HH);c.restore();dyFin(c,t,null);};
W8.z_morning=(c,t,o)=>{P12.bag(c,t,{});c.save();reset(c);c.globalCompositeOperation='multiply';c.fillStyle='rgba(150,175,210,1)';c.fillRect(0,0,WW,HH);c.restore();
  c.save();c.globalCompositeOperation='screen';for(let i=0;i<10;i++){c.fillStyle='rgba(200,220,255,.07)';c.beginPath();c.moveTo(0,300+i*120);c.lineTo(WW,120+i*120);c.lineTo(WW,170+i*120);c.lineTo(0,350+i*120);c.fill();}c.restore();dyFin(c,t,null);};
W8.z_far=(c,t,o)=>{P11.far(c,t,o||{});dyFin(c,t,null);};

/* наложения из v7: воспоминание о Лёше, трещины, уход в чёрное */
function memL(c,a){if(a<=0)return;c.save();c.globalAlpha=a*.6;headA(c,{f:{...AX.lyosha,mask:0},x:540,y:640,s:1.7,L:1,light:'#cfe9ff',la:.4,e:'smile'});c.restore();
  c.save();c.globalCompositeOperation='screen';c.fillStyle=RG(c,540,640,40,600,[[0,`rgba(180,220,255,${.25*a})`],[1,'rgba(180,220,255,0)']]);c.fillRect(0,0,WW,HH);c.restore();}
function crk(c,k,cx=560,cy=880){if(k<=0)return;const n=11;c.save();c.strokeStyle='rgba(255,255,255,.85)';c.lineCap='round';c.shadowColor='rgba(255,255,255,.6)';c.shadowBlur=6;
  for(let i=0;i<n;i++){let x=cx,y=cy,a=i/n*TAU+H1(i)*.4;const L=(500+700*H1(i*3))*eo(k);c.lineWidth=3.5;c.beginPath();c.moveTo(x,y);for(let s=0;s<L;s+=60){a+=(H1(i*7+s)-.5)*.5;x+=Math.cos(a)*60;y+=Math.sin(a)*60;c.lineTo(x,y);}c.stroke();}c.restore();
  if(k>.6){c.save();c.globalCompositeOperation='multiply';c.fillStyle=`rgba(140,140,150,${(k-.6)*1.5})`;c.fillRect(0,0,WW,HH);c.restore();}}
function toBlack(c,k){if(k<=0)return;c.save();c.fillStyle=`rgba(0,0,0,${eio(cl(k))})`;c.fillRect(0,0,WW,HH);c.restore();}

/* язык Династии поверх движка: HUD, субтитры-караоке по словам голоса, без уголков движка */
corners=function(){};
hud=function(c,t,S){if(S.nohud)return;dyHud(c,t,S.hl||'',S.yr||'2012',S.ch||'',t/DUR,'00:'+String(Math.floor(t/60)).padStart(2,'0')+':'+String(Math.floor(t%60)).padStart(2,'0'));};
subs=function(c,t){for(const S of SUBS){if(t<S.a||t>=S.b||t>ENDT)continue;if(t>QM.a-.1&&t<QM.b+.3)continue;dySub(c,S.ws.map(w=>({t:w.t,acc:w.acc,on:t>=w.a-.03})),{y:1230});}};
maxQuote=function(c,t){if(t<QM.a-.05||t>QM.b+.35)return;const a=cl((t-QM.a+.05)/.12)*cl((QM.b+.35-t)/.2),two=t>QM.a+.98;c.save();c.globalAlpha=a;
  if(!two)dySub(c,[{t:'«Я',on:1},{t:'ВСЕГО',on:1},{t:'ДОБИЛСЯ',on:1},{t:'САМ»',on:1,acc:1}],{y:1230,s:86});else{dySub(c,[{t:'«Я',on:1},{t:'НЕ',on:1},{t:'ВИНОВАТ…',on:1}],{y:1180,s:86});dySub(c,[{t:'НЕ',on:1},{t:'ИНВАЛИД',on:1,acc:1},{t:'И',on:1},{t:'НЕ',on:1},{t:'УРОД»',on:1,acc:1}],{y:1290,s:86});}
  tx(c,'МАКС · ИЗ ФИЛЬМА',540,1080,{f:'J',w:700,s:24,ls:6,c:'#ffb13b'});c.restore();};
GRADE.pov10=['#ffc890','#22406c',.08];

/* план: слова голоса v6 */
PLANG.pov10=S=>{let t=0;const nx=(b,o)=>{o.a=t;o.b=b;t=b;o.hh=1;S.push(o);return o;};const A=i=>wa(i)-.05,iv=(a,b,T)=>inv(a,b,T);
  HST.length=0;HST.push(['pass',wa(22),wa(198)],['club',wa(60),wa(212)],['friend',wa(69),wa(245)],['cam',wa(88),wa(175)]);
  const C1='01 / 07 · МЕГАПОЛИС',C2='02 / 07 · КЛУБ',C3='03 / 07 · ЮЛЯ',C4='04 / 07 · ВОКЗАЛ',C5='05 / 07 · ОБВАЛ',C6='06 / 07 · НОЧЬ',C7='07 / 07 · ОДИН';
  nx(A(11),{w:'z_city',cam:ZC(1,1.08),hl:'10:00 · МОСКВА',ch:C1,ov:(c,T,lt)=>blink(c,lt)});
  nx(A(16),{w:'z_boss',tin:'push',cam:ZC(1.02,1.1,960,930),hl:'10:05 · ПЕРЕГОВОРНАЯ',ch:C1});
  nx(A(21),{w:'z_maq',tin:'cut',cam:ZC(1,1.07),hl:'10:05 · ПЕРЕГОВОРНАЯ',ch:C1});
  nx(A(23),{w:'z_boss',o:{e:'smile'},tin:'cut',cam:ZC(1.1,1.16,930,920),hl:'10:06 · ПЕРЕГОВОРНАЯ',ch:C1});
  nx(A(30),{w:'z_desk',tin:'whipv',cam:ZC(1,1.06),hl:'10:10 · КРЕДИТНЫЙ ОТДЕЛ',ch:C1});
  nx(A(35),{w:'z_num',tin:'push',cam:ZC(1,1.05),hl:'ДОХОД · В ЕВРО',ch:C1,ov:(c,T)=>{}});
  nx(A(36),{w:'z_lift',o:(T,lt,u)=>({k:eio(cl(u*1.15)),open:eio(cl((u-.7)*3.3))}),tin:'cut',cam:ZC(1,1.03),hl:'23:30 · ЛИФТ',ch:C1});
  nx(A(37),{w:'z_tver',tin:'push',cam:ZC(1,1.1,960,940),hl:'23:40 · ТВЕРСКАЯ',ch:C2});
  nx(A(38),{w:'z_entry',tin:'cut',cam:ZC(1,1.08,960,1000),hl:'23:45 · КЛУБ VELVET',ch:C2,dive:()=>[540,980]});
  nx(A(42),{w:'z_vipw',tin:'dive',cam:ZC(1,1.05),hl:'01:50 · VIP',ch:C2});
  nx(A(52),{w:'z_misha',tin:'cut',cam:ZC(1,1.06),hl:'01:50 · VIP',ch:C2});
  nx(A(57),{w:'z_misha',o:{e:'smirk'},tin:'cut',cam:ZC(1.12,1.18,900,890),hl:'01:51 · VIP',ch:C2});
  nx(A(63),{w:'z_pen',o:(T)=>({sig:iv(wb(62)-.25,wb(62)+.55,T)}),tin:'cut',cam:ZC(1,1.08,960,1100),hl:'01:52 · VIP',ch:C2});
  nx(A(70),{w:'z_vadim',o:{e:'smile'},tin:'whip',cam:ZC(1,1.06),hl:'01:53 · VIP',ch:C2});
  nx(A(77),{w:'z_wc',o:(T)=>({flick:(Math.sin(T*23)>.7&&Math.sin(T*7)>0)?.3:1}),tin:'flash',cam:ZC(1,1.08),hl:'02:31 · ТУАЛЕТ',ch:C2});
  nx(A(85),{w:'z_mirror',o:(T)=>({e:T>wa(83)?'smirk':'neutral'}),tin:'cut',cam:ZC(1,1.1,920,900),hl:'02:31 · ТУАЛЕТ',ch:C2});
  nx(A(100),{w:'z_yulia',tin:'push',cam:ZC(1,1.06),hl:'00:40 · УЛИЦА',ch:C3});
  nx(A(108),{w:'z_action',tin:'whip',cam:ZC(1,1.05),hl:'01:00 · КУТУЗОВСКИЙ',ch:C3,ov:(c,T)=>viewfinder(c,T,.6)});
  nx(A(111),{w:'z_action',tin:'cut',cam:ZC(1.12,1.18,1100,1120),hl:'01:00 · КУТУЗОВСКИЙ',ch:C3,ov:(c,T)=>viewfinder(c,T,.6)});
  nx(A(113),{w:'z_action',o:(T,lt,u)=>({pol:eio(cl(u*2))}),tin:'flash',shake:1,cam:ZC(1,1.06),hl:'01:02 · КУТУЗОВСКИЙ',ch:C3});
  nx(A(117),{w:'z_run',tin:'whip',roll:1,shake:1,cam:ZC(1,1.04),hl:'01:03 · ПОДВОРОТНЯ',ch:C3});
  nx(A(125),{w:'z_yulia',o:(T)=>({e:T<wa(123)?'neutral':'sad'}),tin:'cut',cam:ZC(1.1,1.18,900,880),hl:'01:20 · УЛИЦА',ch:C3});
  nx(A(130),{w:'z_yulia',o:{e:'sad'},post:'grey',cam:ZC(1.18,1.1,880,900),hl:'01:21 · УЛИЦА',ch:C3});
  nx(A(137),{w:'z_car',o:(T,lt,u)=>({hosp:eio(u)}),tin:'push',cam:ZC(1,1.04),hl:'12:00 · ДОРОГА',ch:C3});
  nx(A(142),{w:'z_costume',o:(T)=>({nose:iv(wb(141)-.35,wb(141)+.15,T)}),tin:'cut',cam:ZC(1,1.08),hl:'12:30 · ДЕТСКАЯ БОЛЬНИЦА',ch:C3});
  nx(A(150),{w:'z_hosp',o:{e:'neutral'},tin:'cut',cam:ZC(1,1.06),hl:'12:40 · БОЛЬНИЦА · ТУАЛЕТ',ch:C3});
  nx(A(158),{w:'z_hosp',o:{e:'smile'},tin:'cut',cam:ZC(1.25,1.35,880,860),hl:'12:41 · БОЛЬНИЦА · ТУАЛЕТ',ch:C3});
  nx(A(162),{w:'z_clown',tin:'cut',cam:ZC(1,1.07),hl:'12:42 · БОЛЬНИЦА · ТУАЛЕТ',ch:C3});
  nx(A(171),{w:'z_vok',tin:'whip',cam:ZC(1,1.06),hl:'23:30 · ВОКЗАЛ',ch:C4});
  nx(VO.maxq.a-.02,{w:'z_yvok',o:{e:'sad'},tin:'cut',cam:ZC(1,1.05),hl:'23:31 · ВОКЗАЛ',ch:C4});
  nx(A(174),{w:'z_yvok',o:{e:'scared',s:2.8},tin:'cut',shake:1,cam:ZC(1.04,1.1),hl:'23:31 · ВОКЗАЛ',ch:C4,ov:(c,T)=>maxQuote(c,T)});
  nx(A(179),{w:'z_yvok',o:{e:'neutral',s:3.0,cy:990},tin:'cut',cam:ZC(1.06,1.1),hl:'23:32 · ВОКЗАЛ',ch:C4});
  nx(A(187),{w:'z_yvok',o:{e:'neutral',s:3.0,cy:990},shake:1,cam:ZC(1.1,1.0),hl:'23:32 · ВОКЗАЛ',ch:C5,ov:(c,T)=>crk(c,iv(wa(181),wb(186)+.2,T))});
  nx(A(194),{w:'z_map',o:(T)=>({zone:eio(iv(wa(192),wb(193),T))}),tin:'cut',cam:ZC(1,1.06),hl:'09:00 · КАБИНЕТ ШЕФА',ch:C5});
  nx(A(198),{w:'z_sig',o:(T)=>({circle:eio(iv(wa(197),wb(197)+.3,T))}),tin:'whip',cam:ZC(1,1.06,960,1050),hl:'09:01 · КАБИНЕТ ШЕФА',ch:C5});
  nx(A(201),{w:'z_office',tin:'cut',cam:ZC(1,1.12,940,900),hl:'09:02 · КАБИНЕТ ШЕФА',ch:C5});
  nx(A(205),{w:'z_empty',o:{e:'neutral'},tin:'push',cam:ZC(1,1.06),hl:'11:00 · КЛУБ МИШИ',ch:C5});
  nx(A(214),{w:'z_empty',o:{e:'smirk'},tin:'cut',cam:ZC(1.2,1.28,960,940),hl:'11:01 · КЛУБ МИШИ',ch:C5});
  nx(A(223),{w:'z_empty',o:{e:'scared'},tin:'cut',shake:1,cam:ZC(1.25,1.3,960,950),hl:'04:00 · КЛУБ МИШИ',ch:C5});
  nx(A(230),{w:'z_vadim',o:{e:'shout',shout:1},tin:'whip',shake:1,cam:ZC(1.02,1.1),hl:'04:10 · ЗВОНОК',ch:C5});
  nx(A(240),{w:'z_phone',o:(T)=>({st:T>wa(237)?1:0}),tin:'cut',cam:ZC(1,1.06),hl:'05:30 · ЗВОНОК',ch:C5});
  nx(A(242),{w:'z_phone',o:(T,lt,u)=>({st:1,off:eio(u)}),cam:ZC(1.06,1.1),hl:'05:31 · ЗВОНОК',ch:C5});
  nx(A(245),{w:'z_far',o:(T)=>({k:iv(wa(244),wa(244)+1.2,T)}),tin:'cut',cam:ZC(1,1.04),hl:'05:32 · МОСКВА',ch:C5});
  nx(A(251),{w:'z_phone',o:{st:1,off:.94},tin:'cut',cam:ZC(1.1,1.12),hl:'05:33 · ЗВОНОК',ch:C5});
  nx(A(257),{w:'z_bag',tin:'cut',cam:ZC(1,1.08),hl:'06:00 · В МАШИНЕ',ch:C6});
  nx(A(266),{w:'z_bag',cam:ZC(1.08,1.14),hl:'06:01 · В МАШИНЕ',ch:C6,ov:(c,T)=>memL(c,Math.sin(Math.PI*cl(iv(wa(262),wb(265)+.3,T)))*.95)});
  nx(A(274),{w:'z_night',tin:'whip',shake:1,cam:ZC(1,1.06),hl:'03:00 · КЛУБ',ch:C6,ov:(c,T,lt)=>{const k=iv(wa(273),wb(273)+.1,T);if(k>0)blink(c,1-k);}});
  nx(A(279),{w:'z_morning',tin:'cut',cam:ZC(1,1.1,960,1000),hl:'11:00 · УТРО',ch:C6});
  nx(A(287),{w:'z_icu',o:(T)=>({lamp:T<wa(286)+.25?1:0}),tin:'cut',cam:ZC(1,1.12,960,930),hl:'12:00 · РЕАНИМАЦИЯ',ch:C7});
  nx(A(299),{w:'z_give',o:(T,lt,u)=>({k:eio(cl(u*2)),e:T<wa(295)?'scared':'smile'}),tin:'push',cam:ZC(1,1.06),hl:'12:30 · ПРИЁМНЫЙ ПОКОЙ',ch:C7});
  ENDT=DUR+5;DUR=wb(320)+2.6;
  nx(DUR,{w:'z_alone',tin:'cut',cam:[[0,540,900,1.0],[.6,560,1000,1.2],[1,620,1120,1.5]],hl:'04:00 · ДОМ',ch:C7,ov:(c,T)=>toBlack(c,(T-wa(315))/1.6)});
  ENDT=DUR+5;
};
