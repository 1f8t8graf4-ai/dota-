/* «Духless» EN · 4 варианта (26.11): ?style=claude|pov|side|fly — по разбору Андрея («вторая жизнь.txt») и ТЗ Gemini.
   Объём, свет, перспектива, люди, буквально то, что говорит диктор. Рук нет (правило Андрея): ручка без руки уходит за край кадра. Набор рисовки — dlx5a.js, сцены — dlx5b/c/d.js.
   pov  — ТЗ Gemini как есть: от первого лица (ручка подписывает, охранник открывает ленту перед камерой).
   side — то же со стороны: герой со спины у окна на Кремль, пропуск на пиджаке, подпись через плечо, герой идёт к двери клуба.
   fly  — то же одним пролётом камеры: склеек нет, переходы — пролёт вперёд и проезд.
   claude — мой: полароид Козловского с «29» маркером, глитч-переходы как у Династии, в HUD — где мы сейчас.
   0–4,66 — карусель Zara drip → Money drip → Moscow drip; 4,66–5,3 — переход в нарисованный мир без чёрного; 5,2 — удар и «Кашалот».
   Голос Brock ×1,10 без «Imagine this» (запись обрезана с 0,78 с). Рендер: N=529 P10A=<папка> node render.mjs dlx5 <стиль> out.mp4 */
(function(){'use strict';
CLIP.fonts=['700 104px Osw','700 180px Osw','900 330px Mont','800 84px Play','700 34px Play','800 58px Man','600 26px Man','300 34px Man','500 26px JBM','600 54px JBM','700 230px Cav'];
const ST=Q.get('style')||'pov';
const V0=5.2,CUT=.78;
const WD0=[[0,0.26,'Imagine'],[0.26,0.64,'this.'],[0.84,1.04,"You're"],[1.04,1.5,'29.'],[1.88,2.32,'Moscow.'],[2.6,2.8,"You're"],[2.8,2.9,'a'],[2.9,3.16,'top'],[3.16,3.62,'executive.'],[3.92,4.08,'By'],[4.08,4.4,'day,'],[4.56,4.72,'you'],[4.72,5.04,'sign'],[5.04,5.44,'million'],[5.44,5.7,'-dollar'],[5.7,6.12,'deals.'],[6.36,6.52,'By'],[6.52,6.84,'night,'],[7.04,7.36,'clubs'],[7.36,7.54,'where'],[7.54,7.66,'the'],[7.66,8.04,'bouncers'],[8.04,8.24,'know'],[8.24,8.4,'your'],[8.4,8.8,'face.'],[9.24,9.68,'Champagne,'],[9.94,10.36,'girls,'],[10.54,10.76,'and'],[10.76,10.88,'a'],[10.88,11.1,'white'],[11.1,11.4,'line'],[11.4,11.54,'in'],[11.54,11.62,'a'],[11.62,12.0,'bathroom'],[12.0,12.4,'stall.']];
const WD=WD0.slice(2).map(w=>[+(w[0]-CUT).toFixed(2),+(w[1]-CUT).toFixed(2),w[2]]);
const wa=k=>V0+WD[k][0],wb=k=>V0+WD[k][1],TEND=wb(WD.length-1)+.8;
const SUB=[[0,1],[2,2],[3,4],[5,6],[7,8],[9,10],[11,12],[13,13],[14,15],[16,16],[17,19],[20,22],[23,23],[24,24],[25,26],[27,28],[29,30],[31,32]];
const ACC=new Set([1,2,5,6,11,12,16,22,23,24,27,28,32]);
window.MEDIA={};
const HITS=[],SH=[],CLK=[],LOC=[];
const sh=(a,tr,f,clk,loc)=>{SH.push({a,tr,f});CLK.push([a,clk]);LOC.push([a,loc]);};

function build(){
  const A1=wa(3)-.1,A2=wa(7)-.1,A3=wa(14)-.1,A4=wa(23)-.12,A5=wa(24)-.08,A6=wa(25)-.1,A7=wa(31)-.14;
  const n29=[wa(1)-.04,wa(2)-.1],sig=[wa(10)-.02,wa(10)+.52],gold=[wa(11)-.02],app=[wa(9)-.3,wa(10)-.02];
  const nod=[wa(20)-.05],open=[wa(20)+.05,wa(22)+.2],pour=[A4+.04,A5-.02],n0=A5+.03,step=.13,sweep=[A6+.04,A7-.12],click=wa(32);
  HITS.push(V0,click);
  if(ST==='pov'){
    sh(5.0,'cut',(c,t,u)=>moscow(c,t,u,{Z:u*300,Y:-u*170,n29}),'22:47:12','MOSCOW · 2012');
    sh(A1,'whip',(c,t,u)=>badgeScene(c,t,u,{}),'09:14:40','MOSCOW · 2012');
    sh(A2,'punch',(c,t,u)=>signScene(c,t,u,{sig,gold,app}),'11:42:05','MOSCOW · 2012');
    sh(A3,'zoom',(c,t,u)=>clubScene(c,t,u,{nod,open}),'23:41:07','MOSCOW · 2012');
    sh(A4,'flash',(c,t,u)=>champScene(c,t,u,{pour}),'01:17:20','MOSCOW · 2012');
    sh(A5,'whip',(c,t,u)=>phoneScene(c,t,u,{n0,step}),'02:03:51','MOSCOW · 2012');
    sh(A6,'punch',(c,t,u)=>lineScene(c,t,u,{sweep}),'03:12:09','MOSCOW · 2012');
    sh(A7,'cut',(c,t,u)=>stallScene(c,t,u,{click}),'03:14:26','MOSCOW · 2012');}
  else if(ST==='side'){
    sh(5.0,'cut',(c,t,u)=>windowHero(c,t,u,{Z:u*180,Y:-u*90,n29}),'22:47:12','MOSCOW · 2012');
    sh(A1,'whip',(c,t,u)=>chestScene(c,t,u,{}),'09:14:40','MOSCOW · 2012');
    sh(A2,'punch',(c,t,u)=>{signScene(c,t,u,{sig,gold,app});shoulderFG(c,t,.95);},'11:42:05','MOSCOW · 2012');
    sh(A3,'zoom',(c,t,u)=>clubScene(c,t,u,{nod,open,hero:1}),'23:41:07','MOSCOW · 2012');
    sh(A4,'flash',(c,t,u)=>champScene(c,t,u,{pour}),'01:17:20','MOSCOW · 2012');
    sh(A5,'whip',(c,t,u)=>phoneScene(c,t,u,{n0,step}),'02:03:51','MOSCOW · 2012');
    sh(A6,'punch',(c,t,u)=>lineScene(c,t,u,{sweep}),'03:12:09','MOSCOW · 2012');
    sh(A7,'cut',(c,t,u)=>stallScene(c,t,u,{click}),'03:14:26','MOSCOW · 2012');}
  else if(ST==='fly'){
    sh(5.0,'cut',(c,t,u)=>moscow(c,t,u,{Z:u*460,Y:-u*240,X:u*60,n29}),'22:47:12','MOSCOW · 2012');
    sh(A1,'zoom',(c,t,u)=>badgeScene(c,t,u,{}),'09:14:40','MOSCOW · 2012');
    sh(A2,'swipeUp',(c,t,u)=>signScene(c,t,u,{sig,gold,app}),'11:42:05','MOSCOW · 2012');
    sh(A3,'zoom',(c,t,u)=>clubScene(c,t,u,{nod,open}),'23:41:07','MOSCOW · 2012');
    sh(A4,'zoom',(c,t,u)=>champScene(c,t,u,{pour}),'01:17:20','MOSCOW · 2012');
    sh(A5,'swipeUp',(c,t,u)=>phoneScene(c,t,u,{n0,step}),'02:03:51','MOSCOW · 2012');
    sh(A6,'zoom',(c,t,u)=>lineScene(c,t,u,{sweep}),'03:12:09','MOSCOW · 2012');
    sh(A7,'swipeUp',(c,t,u)=>stallScene(c,t,u,{click}),'03:14:26','MOSCOW · 2012');}
  else{ // claude
    const M=wa(2)-.12;
    sh(5.0,'cut',(c,t,u)=>polaroidScene(c,t,u,{mark:[wa(1)-.04,wa(1)+.34]}),'22:47:12','MOSCOW · 2012');
    sh(M,'glitch',(c,t,u)=>moscow(c,t,u,{Z:u*260,Y:-u*140}),'22:47:18','MOSCOW · KREMLIN');
    sh(A1,'whip',(c,t,u)=>badgeScene(c,t,u,{}),'09:14:40','MOSCOW-CITY · 62 FL');
    sh(A2,'punch',(c,t,u)=>signScene(c,t,u,{sig,gold,app}),'11:42:05','MEGAPOLIS BANK');
    sh(A3,'glitch',(c,t,u)=>clubScene(c,t,u,{nod,open}),'23:41:07','TVERSKAYA ST.');
    sh(A4,'flash',(c,t,u)=>champScene(c,t,u,{pour}),'01:17:20','PARADISE · VIP');
    sh(A5,'whip',(c,t,u)=>phoneScene(c,t,u,{n0,step}),'02:03:51','PARADISE · VIP');
    sh(A6,'glitch',(c,t,u)=>lineScene(c,t,u,{sweep}),'03:12:09','PARADISE · WC');
    sh(A7,'cut',(c,t,u)=>stallScene(c,t,u,{click}),'03:14:26','PARADISE · WC');}
  window.DLX5={ST,V0,TEND,N:Math.ceil(TEND*30),cuts:SH.slice(1).map(s=>+s.a.toFixed(3)),hits:HITS.slice(),
    sfx:[`scratch@${(sig[0]).toFixed(2)}:0.5`,`ding@${(gold[0]+.04).toFixed(2)}`,`click@${(open[0]+.02).toFixed(2)}`,`pop@${(A4+.02).toFixed(2)}`,
      ...[0,1,2,3].map(i=>`ding@${(n0+i*step).toFixed(2)}`),`swish@${(sweep[0]+.1).toFixed(2)}`,`click@${click.toFixed(2)}`].concat(ST==='claude'?['click@5.02']:[])};}
function clockAt(t){let k=CLK[0];for(const q of CLK)if(t>=q[0])k=q;const [h,m,s]=k[1].split(':').map(Number);const S=(h*3600+m*60+s+Math.floor(Math.max(0,t-k[0])))%86400;return [Math.floor(S/3600),Math.floor(S/60)%60].map(v=>String(v).padStart(2,'0')).join(':');}
function locAt(t){let k=LOC[0];for(const q of LOC)if(t>=q[0])k=q;return k[1];}

// переход из карусели: пролёт вперёд (pov, side, fly) или глитч (claude), без чёрного кадра
function intro(c,t){const T0=4.66,T1=5.0,T2=5.3;
  if(t<T0){DC.draw(c,t);return;}
  const a=TA.getContext('2d'),b=TB.getContext('2d');
  if(ST==='claude'){
    if(t<T1){reset(a);DC.draw(a,t);c.drawImage(TA,0,0);glitch(c,TA,ss(T0,T1,t),31);}
    else{reset(b);drawShot(b,SH[0],t);c.drawImage(TB,0,0);glitch(c,TB,1-ss(T1,T2,t),37);}}
  else{
    if(t<T1){reset(a);DC.draw(a,t);const e=ei((t-T0)/(T1-T0)),[zx,zy]=DC.zpt();zoomBlur(c,TA,zx,zy,1+2.2*e,.5*e,8);}
    else{reset(b);drawShot(b,SH[0],t);const e=eo((t-T1)/(T2-T1));zoomBlur(c,TB,WW/2,HH*.45,lp(.55,1,e),.32*(1-e),8);}}
  const fl=Math.max(0,1-Math.abs(t-T1)/.1);if(fl>0){c.save();c.globalCompositeOperation='screen';c.fillStyle=RG(c,WW/2,HH*.45,0,1100,[[0,`rgba(255,246,232,${.85*fl})`],[1,'rgba(255,246,232,0)']]);c.fillRect(0,0,WW,HH);c.restore();}}

CLIP.init=async()=>{await DC.init();DC.CAP[2]='Moscow drip';MEDIA.kz=await loadImg('/a/kz.jpg');smokeSprites();mKremTex();mCityTex();mReflTex();build();};
CLIP.draw=(c,t,i)=>{
  if(t<5.3)intro(c,t);
  else{const [dx,dy]=shakeAt(HITS,t);c.save();c.translate(dx,dy);playShots(c,SH,t);c.restore();}
  reset(c);
  if(t>=4.95){bloom(c,CV,.08);hudLine(c,t,cl((t-V0)/.25),locAt(t),clockAt(t));subsDraw(c,t,V0,WD,SUB,ACC,{y:1190});}
  grain(c,i,t<5?.05:.06);};
})();
