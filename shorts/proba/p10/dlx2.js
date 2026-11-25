/* «Духless» EN · тест 15 с, v2 (25.11): то же, что dlx.js, но под голос — кадры из фильма (начало: будильник, Макс, окно, Москва, BMW, сигарета)
   и клип с коксом из карусели. Кадры — /a/max/<кусок>/NNN.jpg (456×812, 9:16, вырезаны из 1080p), клип — кадры DC. */
(function(){
CLIP.fonts=['600 82px Man','800 96px Mont','600 26px JBM','800 300px Mont'];
const V0=5.25;
const WDB=[[0.0,0.24,'Imagine'],[0.24,0.54,'this.'],[0.76,0.84,"You're"],[0.84,1.24,'29.'],[1.56,1.92,'Moscow.'],[2.12,2.28,"You're"],[2.28,2.38,'a'],[2.38,2.56,'top'],[2.56,2.96,'executive.'],[3.18,3.34,'By'],[3.34,3.6,'day,'],[3.72,3.84,'you'],[3.84,4.1,'sign'],[4.1,4.44,'million'],[4.44,4.66,'-dollar'],[4.66,4.98,'deals.'],[5.18,5.3,'By'],[5.3,5.56,'night,'],[5.72,5.98,'clubs'],[5.98,6.12,'where'],[6.12,6.22,'the'],[6.22,6.54,'bouncers'],[6.54,6.7,'know'],[6.7,6.84,'your'],[6.84,7.14,'face.'],[7.7,8.06,'Champagne,'],[8.06,8.42,'girls,'],[8.62,8.74,'and'],[8.74,8.84,'a'],[8.84,9.02,'white'],[9.02,9.26,'line'],[9.26,9.38,'in'],[9.38,9.46,'a'],[9.46,9.74,'bathroom'],[9.74,10.06,'stall.']];
const WDJ=[[0.0,0.24,'Imagine'],[0.24,0.52,'this.'],[0.66,0.8,"You're"],[0.8,1.18,'29.'],[1.48,1.82,'Moscow.'],[2.0,2.16,"You're"],[2.16,2.26,'a'],[2.26,2.42,'top'],[2.42,2.8,'executive.'],[3.04,3.18,'By'],[3.18,3.4,'day,'],[3.54,3.66,'you'],[3.66,3.9,'sign'],[3.9,4.22,'million'],[4.22,4.42,'-dollar'],[4.42,4.72,'deals.'],[4.94,5.08,'By'],[5.08,5.28,'night,'],[5.42,5.66,'clubs'],[5.66,5.8,'where'],[5.8,5.88,'the'],[5.88,6.18,'bouncers'],[6.18,6.34,'know'],[6.34,6.48,'your'],[6.48,6.78,'face.'],[7.1,7.44,'Champagne,'],[7.6,7.92,'girls,'],[8.08,8.22,'and'],[8.22,8.3,'a'],[8.3,8.46,'white'],[8.46,8.68,'line'],[8.68,8.8,'in'],[8.8,8.86,'a'],[8.86,9.12,'bathroom'],[9.12,9.42,'stall.']];
/* голос: ?style=jason — Jason, иначе Brock (оба ускорены, vo25) */
const WD=Q.get('style')==='jason'?WDJ:WDB,TEND=V0+WD[WD.length-1][1]+0.3;
const SUB=[[0,1],[2,3],[4,4],[5,6],[7,8],[9,10],[11,12],[13,14],[15,15],[16,17],[18,18],[19,21],[22,24],[25,25],[26,26],[27,28],[29,30],[31,34]];
const ACC=new Set([3,4,7,8,13,14,18,24,25,26,29,30]);
/* кадры: ['f', кусок фильма] или ['m', [с, по] — кадры клипа с коксом], начало по голосу */
const SC=[['f','alarm',0],['f','wake',2],['f','pano',4],['f','suit',5],['f','bmw',9],['m',[31,55],16],['f','smoke',19],['f','exhale',25],['m',[1,45],27]];
const NFR={alarm:30,wake:33,pano:27,suit:39,bmw:69,smoke:54,exhale:39},FR={};
const stw=k=>k===0?0:WD[k][0]-0.08,scStart=i=>V0+stw(SC[i][2]),scEnd=i=>i+1<SC.length?scStart(i+1):TEND;
const sh=(t,k,a)=>({x:a*sn(t*0.7,k),y:a*0.8*sn(t*0.7+3,k+1)});
function lightPool(c,x,y,r,col,a){c.save();c.globalCompositeOperation='lighter';c.globalAlpha=a;c.fillStyle=rg(c,x,y,0,x,y,r,[[0,col],[1,'rgba(0,0,0,0)']]);c.fillRect(x-r,y-r,r*2,r*2);c.restore();}

/* кусок фильма на весь экран: медленный наезд, лёгкая ручная камера, цвет чуть плотнее */
function foot(c,i,u,t){const k=SC[i][1],L=FR[k],d=scEnd(i)-scStart(i),im=L[clamp(Math.floor(u*30),0,L.length-1)],j=sh(t,i*3+1,4);
  const z=lerp(1.0,1.06,E.ioS(u/d)),s=Math.max(W/456,H/812)*z,w=456*s,h=812*s;
  c.fillStyle='#000';c.fillRect(0,0,W,H);c.save();c.filter='contrast(1.08) saturate(0.88) brightness(0.95)';c.imageSmoothingQuality='high';c.drawImage(im,(W-w)/2+j.x,(H-h)/2+j.y,w,h);c.restore();
  c.save();c.globalCompositeOperation='soft-light';c.fillStyle=lg(c,0,0,0,H,[[0,'rgba(20,60,110,0.55)'],[0.5,'rgba(0,0,0,0)'],[1,'rgba(255,140,60,0.35)']]);c.fillRect(0,0,W,H);c.restore();}
/* клип с коксом — полосой, как в карусели */
function clipBand(c,i,u){const [a,b]=SC[i][1],n=clamp(Math.floor(u*30),0,b-a);DC.video(c,0,2.12+(a-1+n)/30,{capA:0});}

/* «29» над Максом */
function n29(c,u,t){const a=inv(0.06,0.2,u);if(a<=0)return;const p=E.outB(inv(0.06,0.5,u),1.6),sc=lerp(1.8,1,p),cy=470+6*Math.sin(t*1.6);
  c.save();c.globalAlpha=a;c.translate(540,cy);c.scale(sc,sc);c.rotate(-0.04*(1-p));c.font='800 380px Mont';c.textAlign='center';c.textBaseline='middle';
  for(let L=18;L>0;L--){c.fillStyle=`rgb(${70-L*2},${40-L},14)`;c.fillText('29',L*1.3,L*1.9);}
  c.shadowColor='rgba(255,170,70,0.85)';c.shadowBlur=50;c.fillStyle=lg(c,0,-170,0,170,[[0,'#fff6e2'],[0.55,'#ffcf86'],[1,'#ff9a3c']]);c.fillText('29',0,0);c.restore();
  lightPool(c,540,470,440,'rgba(255,150,60,0.3)',a*0.8);}
/* счётчик сделки */
function counter(c,u){if(u<0.5)return;const cu=inv(0.92,1.55,u),v=Math.round(1e6*E.outC(cu)),s='$'+v.toString().replace(/\B(?=(\d{3})+(?!\d))/g,','),pop=1+0.08*Math.max(0,1-Math.abs(u-1.55)/0.12);
  c.save();c.translate(540,360);c.scale(pop,pop);txt(c,s,0,0,{font:'800 138px Mont',fill:'#fff',shadow:'rgba(0,0,0,0.75)',sb:30});c.restore();}

function drawScene(c,i,t){reset(c);const u=t-scStart(i);
  if(SC[i][0]==='f')foot(c,i,u,t);else clipBand(c,i,u);
  if(SC[i][1]==='bmw')counter(c,u);}

/* ===================== HUD, субтитры, переходы (как в dlx.js) ===================== */
function hud(c,t){const a=inv(V0,V0+0.4,t);if(a<=0)return;c.save();c.globalAlpha=a*0.85;
  c.font='600 26px JBM';c.textBaseline='middle';c.textAlign='left';c.fillStyle='#ff3b30';ell(c,64,140,7,7);c.fill();c.fillStyle='rgba(255,255,255,0.86)';c.fillText('MOSCOW · 2012',82,141);
  const s=13+Math.floor(t-V0),mm=47+Math.floor(s/60),ss=s%60;c.textAlign='right';c.fillText(`02:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`,1016,141);
  c.fillStyle='rgba(255,255,255,0.25)';c.fillRect(64,168,952,1.5);c.restore();}
function subs(c,t){const v=t-V0;if(v<0)return;let cur=null;
  for(let k=0;k<SUB.length;k++){const [a,b]=SUB[k],ta=WD[a][0],nx=k+1<SUB.length?WD[SUB[k+1][0]][0]:99,tb=nx-WD[b][1]<0.6?nx:WD[b][1]+0.3;if(v>=ta&&v<tb){cur=[a,b,ta];break;}}
  if(!cur)return;const [a,b,ta]=cur,age=v-ta,pop=1+0.1*Math.max(0,1-age/0.09);
  c.save();c.fillStyle=rg(c,540,1200,0,540,1200,520,[[0,'rgba(0,0,0,0.5)'],[0.55,'rgba(0,0,0,0.28)'],[1,'rgba(0,0,0,0)']]);c.translate(540,1200);c.scale(1,0.36);c.translate(-540,-1200);c.fillRect(0,680,W,1040);c.restore();
  const words=[];for(let i=a;i<=b;i++)words.push([WD[i][2].replace(/^-/,'').toUpperCase(),ACC.has(i)]);
  c.save();c.font='800 96px Mont';c.letterSpacing='-1px';const sp=c.measureText(' ').width;let tot=0;const ws=words.map(w=>{const m=c.measureText(w[0]).width;tot+=m;return m;});tot+=sp*(words.length-1);
  const sc=Math.min(1,820/tot)*pop;c.translate(540,1200);c.scale(sc,sc);let x=-tot/2;
  for(let i=0;i<words.length;i++){c.textAlign='left';c.textBaseline='middle';c.shadowColor='rgba(0,0,0,0.7)';c.shadowBlur=24;c.shadowOffsetY=4;
    c.fillStyle=words[i][1]?'#FF8A1E':'#FFFFFF';c.fillText(words[i][0],x,0);x+=ws[i]+sp;}
  c.restore();}
const OFF=mk(),OX=OFF.getContext('2d');
function sceneAt(t){for(let i=SC.length-1;i>=0;i--)if(t>=scStart(i))return i;return -1;}
function whip(c,i,t){const u=t-scStart(i),D=0.2;
  if(u>=D||i===0){drawScene(c,i,t);return;}
  const k=1-E.outC(u/D);reset(OX);OX.clearRect(0,0,W,H);drawScene(OX,i,t);
  c.save();reset(c);
  if(i%2===1){const s0=1+0.42*k;for(let n=0;n<6;n++){const s=s0*(1+0.05*n*k);c.globalAlpha=n===0?1:0.32*(1-n/7);c.drawImage(OFF,540-540*s,960-960*s,W*s,H*s);}}
  else{const dir=i%4===0?1:-1;for(let n=0;n<7;n++){const dx=dir*(260*k+n*45*k);c.globalAlpha=n===0?1:0.3*(1-n/8);c.drawImage(OFF,dx,0);}}
  c.restore();
  c.save();c.globalAlpha=0.16*k;c.fillStyle='#fff';c.fillRect(0,0,W,H);c.restore();}

CLIP.init=async()=>{await DC.init();
  for(const k of Object.keys(NFR)){FR[k]=await Promise.all(Array.from({length:NFR[k]},(_,i)=>loadImg(`/a/max/${k}/${String(i+1).padStart(3,'0')}.jpg`)));if(FR[k].some(v=>!v))throw new Error('нет кадров '+k);}};
CLIP.draw=(c,t,i)=>{
  if(t<5.0){DC.draw(c,t);grain(c,i,0.05);return;}
  if(t<V0){c.fillStyle='#000';c.fillRect(0,0,W,H);return;}
  const s=sceneAt(t);whip(c,s,t);
  vig(c,0.55,0.28);bloom(c,CV,0.14);grain(c,i,0.07);
  const fk=inv(V0+0.1,V0,t);if(fk>0){c.save();reset(c);c.globalAlpha=0.85*fk;c.fillStyle='#fff';c.fillRect(0,0,W,H);c.restore();}
  hud(c,t);subs(c,t);
};
})();
