/* «Духless» EN · тест 15 с, v3 (25.11): как у «Династии» — объёмные сцены (three.js r147): фигурки без лиц, свет, туман, блики, свечение.
   Карусель (DC) 0–5,0 → обрыв → удар → 6 сцен под голос Brock. Сверху — HUD, субтитры, зерно, виньетка, хлыст-переходы (как dlx.js). */
(function(){
CLIP.fonts=['600 82px Man','800 96px Mont','600 26px JBM','800 300px Mont','700 40px JBM','800 120px Mont'];
const V0=5.25,TEND=V0+10.06+0.3;
const WD=[[0.0,0.24,'Imagine'],[0.24,0.54,'this.'],[0.76,0.84,"You're"],[0.84,1.24,'29.'],[1.56,1.92,'Moscow.'],[2.12,2.28,"You're"],[2.28,2.38,'a'],[2.38,2.56,'top'],[2.56,2.96,'executive.'],[3.18,3.34,'By'],[3.34,3.6,'day,'],[3.72,3.84,'you'],[3.84,4.1,'sign'],[4.1,4.44,'million'],[4.44,4.66,'-dollar'],[4.66,4.98,'deals.'],[5.18,5.3,'By'],[5.3,5.56,'night,'],[5.72,5.98,'clubs'],[5.98,6.12,'where'],[6.12,6.22,'the'],[6.22,6.54,'bouncers'],[6.54,6.7,'know'],[6.7,6.84,'your'],[6.84,7.14,'face.'],[7.7,8.06,'Champagne,'],[8.06,8.42,'girls,'],[8.62,8.74,'and'],[8.74,8.84,'a'],[8.84,9.02,'white'],[9.02,9.26,'line'],[9.26,9.38,'in'],[9.38,9.46,'a'],[9.46,9.74,'bathroom'],[9.74,10.06,'stall.']];
const SUB=[[0,1],[2,3],[4,4],[5,6],[7,8],[9,10],[11,12],[13,14],[15,15],[16,17],[18,18],[19,21],[22,24],[25,25],[26,26],[27,28],[29,30],[31,34]];
const ACC=new Set([3,4,7,8,13,14,18,24,25,26,29,30]);
const SC=[['city',0],['win',2.12],['desk',3.18],['club',5.18],['champ',7.5],['line',8.55]];
const scStart=i=>V0+SC[i][1],scEnd=i=>i+1<SC.length?scStart(i+1):TEND;
const T3=THREE;

/* ===================== 2D-текстуры ===================== */
function ctex(w,h,fn,enc){const c=mk(w,h),x=c.getContext('2d');fn(x,w,h);const t=new T3.CanvasTexture(c);t.encoding=enc===false?T3.LinearEncoding:T3.sRGBEncoding;t.anisotropy=4;return t;}
function winTex(seed,warm){return ctex(256,1024,(x,w,h)=>{const r=rng(seed);x.fillStyle='#000';x.fillRect(0,0,w,h);const cols=warm?['#ffcf86','#ffb45c','#ffe2b0','#ff9e45']:['#c4d8ff','#9fc0ff','#e6eeff'];
  for(let y=4;y<h;y+=16){const on=r()<0.55;for(let X=4;X<w;X+=12){if(r()<(on?0.78:0.06)){x.globalAlpha=0.45+0.55*r();x.fillStyle=cols[(r()*cols.length)|0];x.fillRect(X,y,8,10);}}}x.globalAlpha=1;});}
function bricks(){return ctex(1024,1024,(x,w,h)=>{const r=rng(61);x.fillStyle='#120812';x.fillRect(0,0,w,h);for(let y=0;y<h;y+=48){const o=(y/48)%2?50:0;for(let X=-100+o;X<w;X+=100){const v=26+r()*22;x.fillStyle=`rgb(${v+14},${v*0.45},${v*0.8})`;x.fillRect(X+3,y+3,94,42);}}});}
function wood(){return ctex(1024,1024,(x,w,h)=>{const r=rng(23);x.fillStyle='#2a140a';x.fillRect(0,0,w,h);for(let i=0;i<220;i++){const y=r()*h;x.fillStyle=`rgba(${70+r()*40},${34+r()*20},${16+r()*10},${0.25+r()*0.3})`;x.fillRect(0,y,w,2+r()*7);}});}
let PAPER=null,PAPC=null;
function paperTex(){PAPC=mk(512,724);const x=PAPC.getContext('2d');x.fillStyle='#efe9dc';x.fillRect(0,0,512,724);x.fillStyle='#2a2a2a';x.font='700 30px JBM';x.fillText('LOAN AGREEMENT',40,70);
  const r=rng(41);for(let i=0;i<19;i++){x.fillStyle='rgba(40,40,40,0.4)';x.fillRect(40,110+i*26,lerp(240,430,r()),6);}x.fillStyle='rgba(40,40,40,0.65)';x.fillRect(40,640,280,2);x.font='600 16px JBM';x.fillText('SIGNATURE',40,664);
  PAPER=new T3.CanvasTexture(PAPC);PAPER.encoding=T3.sRGBEncoding;PAPER.anisotropy=4;return PAPER;}
function cashTex(){return ctex(512,256,(x,w,h)=>{x.fillStyle='#3d5a3a';x.fillRect(0,0,w,h);x.strokeStyle='#9fbf8f';x.lineWidth=6;x.strokeRect(14,14,w-28,h-28);x.fillStyle='#c9dcb8';x.font='800 90px Mont';x.textAlign='center';x.textBaseline='middle';x.fillText('100',w/2,h/2);});}
function neonTex(){return ctex(1024,256,(x,w,h)=>{x.clearRect(0,0,w,h);x.font='800 170px Mont';x.textAlign='center';x.textBaseline='middle';x.shadowColor='#ff2aa8';x.shadowBlur=40;x.fillStyle='#ffd6f0';x.fillText('VELVET',w/2,h/2+8);x.shadowBlur=14;x.fillText('VELVET',w/2,h/2+8);});}
function glowTex(){return ctex(128,128,(x,w,h)=>{const g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(0.55,'rgba(255,255,255,0.6)');g.addColorStop(0.8,'rgba(255,255,255,0.2)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,w,h);});}

/* ===================== фигурка (без лица, как у «Династии») ===================== */
function M(col,o){o=o||{};return new T3.MeshStandardMaterial(Object.assign({color:col,roughness:0.72,metalness:0.0,envMapIntensity:0.35},o));}
function figure(o){o=Object.assign({suit:'#161c2a',skin:'#c69c80',hair:'#1e1612',shirt:'#e8e6e0',tie:'#0c0c10',wide:1,bald:false,glasses:false},o);const g=new T3.Group();
  const add=(geo,mat,x,y,z,sx,sy,sz,rx,rz)=>{const m=new T3.Mesh(geo,mat);m.position.set(x,y,z);if(sx)m.scale.set(sx,sy,sz);if(rx)m.rotation.x=rx;if(rz)m.rotation.z=rz;m.castShadow=true;m.receiveShadow=true;g.add(m);return m;};
  const suit=M(o.suit,{roughness:0.62}),skin=M(o.skin,{roughness:0.55}),hair=M(o.hair,{roughness:0.9});
  const leg=new T3.CapsuleGeometry(0.085,0.78,6,14);for(const sx of [-0.11,0.11]){add(leg,suit,sx,0.48,0);add(new T3.RoundedBoxGeometry(0.13,0.08,0.3,3,0.03),M('#08080a',{roughness:0.3,metalness:0.4}),sx,0.04,0.05);}
  add(new T3.RoundedBoxGeometry(0.46*o.wide,0.26,0.27,4,0.08),suit,0,0.98,0);
  add(new T3.CapsuleGeometry(0.2,0.42,8,18),suit,0,1.24,0,1.28*o.wide,1,0.74);
  add(new T3.BoxGeometry(0.12,0.2,0.02),M(o.shirt),0,1.44,0.145);add(new T3.BoxGeometry(0.035,0.3,0.02),M(o.tie,{roughness:0.4}),0,1.36,0.16);
  const arm=new T3.CapsuleGeometry(0.066,0.56,6,14);for(const s of [-1,1]){add(arm,suit,s*0.3*o.wide,1.17,0,1,1,1,0,s*0.07);add(new T3.SphereGeometry(0.056,14,12),skin,s*0.33*o.wide,0.86,0.01);}
  add(new T3.CylinderGeometry(0.058,0.064,0.12,14),skin,0,1.58,0);
  add(new T3.SphereGeometry(0.13,24,20),skin,0,1.74,0,0.94,1.06,1);
  if(!o.bald)add(new T3.SphereGeometry(0.137,24,20,0,TAU,0,1.75),hair,0,1.755,-0.008,0.96,0.95,1.02);
  if(o.glasses)add(new T3.BoxGeometry(0.22,0.045,0.03),M('#030303',{roughness:0.15,metalness:0.6}),0,1.75,0.12);
  return g;}

/* ===================== рендер ===================== */
let R=null,COMP=null,RP=null,BLOOM=null,GL=null;const S={};
const FinalShader={uniforms:{tDiffuse:{value:null},exposure:{value:1.0}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
  fragmentShader:'uniform sampler2D tDiffuse;uniform float exposure;varying vec2 vUv;vec3 aces(vec3 x){x*=exposure;return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14),0.0,1.0);}void main(){vec4 c=texture2D(tDiffuse,vUv);gl_FragColor=vec4(pow(aces(c.rgb),vec3(1.0/2.2)),1.0);}'};
function cam(fov){const c=new T3.PerspectiveCamera(fov||40,W/H,0.05,400);return c;}
function spot(col,inten,pos,tgt,ang,pen,shadow){const l=new T3.SpotLight(col,inten,0,ang||0.5,pen===undefined?0.6:pen,2);l.position.set(...pos);l.target.position.set(...tgt);if(shadow){l.castShadow=true;l.shadow.mapSize.set(1024,1024);l.shadow.bias=-0.0004;l.shadow.radius=4;}return l;}

/* — 1: Сити снизу и «29» — */
function buildCity(FONT){const s=new T3.Scene();s.background=new T3.Color('#02040b');s.fog=new T3.FogExp2('#06102a',0.018);
  s.add(new T3.AmbientLight('#2a3a66',0.55));const moon=new T3.DirectionalLight('#9fb6ff',0.9);moon.position.set(-10,30,10);s.add(moon);
  const gnd=new T3.Mesh(new T3.PlaneGeometry(400,400),M('#04060c',{roughness:0.22,metalness:0.6}));gnd.rotation.x=-Math.PI/2;s.add(gnd);
  const tw=[[-7,-34,6,30,0],[-2.5,-40,7,52,1],[3.4,-36,6.5,44,2],[8.5,-44,7,38,3],[-12,-48,8,26,4],[13,-52,8,30,5],[0.5,-58,9,62,6],[-6,-64,8,40,7],[7,-66,9,34,8]];
  const towers=[];for(const [x,z,w,h,k] of tw){const tx=winTex(100+k,k%3!==1);tx.wrapS=tx.wrapT=T3.RepeatWrapping;tx.repeat.set(w/6,h/24);
    const m=new T3.Mesh(new T3.BoxGeometry(w,h,w*0.9),M('#060a14',{roughness:0.3,metalness:0.55,emissive:'#ffffff',emissiveMap:tx,emissiveIntensity:1.35}));m.position.set(x,h/2,z);m.rotation.y=k*0.21;s.add(m);towers.push(m);
    const top=new T3.Mesh(new T3.SphereGeometry(0.28,10,8),new T3.MeshBasicMaterial({color:'#ff3a2a'}));top.position.set(x,h+0.6,z);s.add(top);towers.push(top);}
  const spire=new T3.Mesh(new T3.CylinderGeometry(0.06,0.25,9,8),M('#9fb6ff',{emissive:'#9fb6ff',emissiveIntensity:0.4}));spire.position.set(0.5,62+4.5,-58);s.add(spire);
  const geo=new T3.TextGeometry('29',{font:FONT,size:4.0,height:1.1,curveSegments:8,bevelEnabled:true,bevelThickness:0.22,bevelSize:0.14,bevelSegments:4});geo.center();
  const n=new T3.Mesh(geo,[M('#ffd28a',{emissive:'#ff9a3c',emissiveIntensity:0.85,roughness:0.28,metalness:0.35}),M('#8a4a14',{emissive:'#ff7a1a',emissiveIntensity:0.35,roughness:0.4,metalness:0.4})]);
  n.position.set(0,15,-10);s.add(n);const pl=new T3.PointLight('#ff9a3c',3.2,40,2);pl.position.set(0,15,-4);s.add(pl);
  const c=cam(42);S.city={s,c,n,pl,towers};}
function upCity(u,t){const o=S.city,d=scEnd(0)-scStart(0),k=E.ioS(u/d);o.c.position.set(0.6*Math.sin(t*0.4),lerp(1.2,6.5,k),lerp(16,11,k));o.c.lookAt(0,lerp(16,19,k),-30);
  const a=inv(0.78,1.0,u),p=E.outB(inv(0.78,1.3,u),1.5);o.n.visible=a>0;o.n.scale.setScalar(Math.max(0.001,lerp(0.2,1,p)));o.n.rotation.y=0.25*Math.sin(t*1.3)*(0.4+0.6*(1-p));o.n.position.y=15+0.3*Math.sin(t*1.7);o.pl.intensity=3.2*a;
  for(let i=1;i<o.towers.length;i+=2)o.towers[i].material.color.setRGB(1,0.2+0.15*Math.sin(t*4+i),0.15);}

/* — 2: у панорамного окна — */
function buildWin(CITYT){const s=new T3.Scene();s.background=new T3.Color('#03050b');
  s.add(new T3.AmbientLight('#1a2440',0.6));
  const floor=new T3.Mesh(new T3.PlaneGeometry(30,30),M('#0b0e16',{roughness:0.28,metalness:0.4}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;s.add(floor);
  const out=new T3.Mesh(new T3.PlaneGeometry(36,22),new T3.MeshBasicMaterial({map:CITYT}));out.position.set(0,6,-14);s.add(out);
  const fr=M('#05070c',{roughness:0.5,metalness:0.5});for(const x of [-3.3,-1.1,1.1,3.3]){const b=new T3.Mesh(new T3.BoxGeometry(0.12,5,0.18),fr);b.position.set(x,2.5,-3);b.castShadow=true;s.add(b);}
  const top=new T3.Mesh(new T3.BoxGeometry(12,0.5,0.4),fr);top.position.set(0,5.1,-3);s.add(top);const bot=new T3.Mesh(new T3.BoxGeometry(12,0.14,0.3),fr);bot.position.set(0,0.07,-3);s.add(bot);
  const wall=new T3.Mesh(new T3.PlaneGeometry(30,10),M('#06080e'));wall.position.set(0,10.2,-3.05);s.add(wall);
  const rim=new T3.DirectionalLight('#ffb36a',2.2);rim.position.set(2,3.5,-10);rim.target.position.set(0.5,1,0);rim.castShadow=true;rim.shadow.mapSize.set(1024,1024);rim.shadow.camera.left=-6;rim.shadow.camera.right=6;rim.shadow.camera.top=6;rim.shadow.camera.bottom=-6;rim.shadow.bias=-0.0005;s.add(rim);s.add(rim.target);
  const fill=new T3.PointLight('#4466aa',0.6,12,2);fill.position.set(-1,2.5,4);s.add(fill);
  const man=figure({});man.position.set(0.7,0,-1.6);man.rotation.y=Math.PI;s.add(man);
  S.win={s,c:cam(38),man};}
function upWin(u,t){const o=S.win,k=E.outE(u/0.75);o.c.position.set(lerp(0.9,0.4,k)+0.03*Math.sin(t*2),lerp(1.65,1.55,k),lerp(0.2,4.2,k));o.c.lookAt(0.5,lerp(1.6,1.9,k),-3);o.man.position.y=0.004*Math.sin(t*2.2);}

/* — 3: стол сверху, контракт и подпись — */
const SIG=[];for(let i=0;i<=80;i++){const q=i/80;SIG.push([lerp(-0.55,0.35,q),0.7*(1-q)*0.0+0.08*Math.sin(q*TAU*1.6)*(1-q*0.4)+0.05*Math.sin(q*TAU*3.3)]);}
function buildDesk(){const s=new T3.Scene();s.background=new T3.Color('#070403');s.add(new T3.AmbientLight('#3a2416',0.5));
  const dt=wood();dt.wrapS=dt.wrapT=T3.RepeatWrapping;dt.repeat.set(2,2);const desk=new T3.Mesh(new T3.PlaneGeometry(12,16),M('#ffffff',{map:dt,roughness:0.45,metalness:0.1}));desk.rotation.x=-Math.PI/2;desk.receiveShadow=true;s.add(desk);
  const pap=new T3.Mesh(new T3.PlaneGeometry(2.1,2.97),M('#ffffff',{map:paperTex(),roughness:0.85}));pap.rotation.x=-Math.PI/2;pap.rotation.z=0.14;pap.position.set(0.1,0.012,0.3);pap.receiveShadow=true;pap.castShadow=true;s.add(pap);
  const ink=new T3.Mesh(new T3.BufferGeometry(),M('#0d1b4d',{roughness:0.3}));s.add(ink);
  const pen=new T3.Group();const bar=new T3.Mesh(new T3.CylinderGeometry(0.055,0.06,1.5,20),M('#0b0b0d',{roughness:0.18,metalness:0.7}));bar.rotation.z=Math.PI/2;bar.position.x=0.85;bar.castShadow=true;pen.add(bar);
  const gold=M('#d9b35a',{roughness:0.25,metalness:1});for(const x of [0.35,1.45]){const r=new T3.Mesh(new T3.CylinderGeometry(0.064,0.064,0.07,20),gold);r.rotation.z=Math.PI/2;r.position.x=x;pen.add(r);}
  const nib=new T3.Mesh(new T3.ConeGeometry(0.05,0.18,16),gold);nib.rotation.z=Math.PI/2;nib.position.x=0.03;pen.add(nib);pen.position.y=0.12;s.add(pen);
  const ct=cashTex();for(let i=0;i<4;i++){const b=new T3.Mesh(new T3.BoxGeometry(1.5,0.09,0.66),[M('#3d5a3a'),M('#3d5a3a'),M('#ffffff',{map:ct}),M('#3d5a3a'),M('#3d5a3a'),M('#3d5a3a')]);b.position.set(-1.55+0.04*i,0.05+i*0.092,-2.0);b.rotation.y=0.25+0.06*i;b.castShadow=true;b.receiveShadow=true;s.add(b);}
  const glass=new T3.Mesh(new T3.CylinderGeometry(0.42,0.38,0.9,32,1,true),new T3.MeshStandardMaterial({color:'#ffffff',transparent:true,opacity:0.2,roughness:0.05,side:T3.DoubleSide}));glass.position.set(1.7,0.45,-2.3);s.add(glass);
  const liq=new T3.Mesh(new T3.CylinderGeometry(0.39,0.36,0.42,32),M('#b5651d',{emissive:'#7a3a10',emissiveIntensity:0.5,transparent:true,opacity:0.85,roughness:0.1}));liq.position.set(1.7,0.22,-2.3);s.add(liq);
  const L=spot('#ffcf9a',22,[1.6,6.5,1.8],[0,0,0],0.62,0.7,true);s.add(L);s.add(L.target);
  S.desk={s,c:cam(40),pap,ink,pen};}
function upDesk(u,t){const o=S.desk,d=scEnd(2)-scStart(2),k=E.outC(u/d);o.c.position.set(0.15*Math.sin(t*0.5),lerp(6.2,5.4,k),0.6);o.c.up.set(Math.sin(lerp(-0.12,0,k)),0,-Math.cos(lerp(-0.12,0,k)));o.c.lookAt(0,0,0);
  const sp=inv(0.1,0.95,u),n=Math.max(2,Math.floor(sp*80)),pts=[];const ca=Math.cos(0.14),sa=Math.sin(0.14);
  for(let i=0;i<=n;i++){const [x,z]=SIG[Math.min(i,80)];const X=x,Z=1.05+z;pts.push(new T3.Vector3(0.1+X*ca+Z*sa,0.02,0.3-(-X*sa+Z*ca)+0.0));}
  o.ink.geometry.dispose();o.ink.geometry=sp>0.02?new T3.TubeGeometry(new T3.CatmullRomCurve3(pts),Math.max(8,n*2),0.012,6,false):new T3.BufferGeometry();
  const p=pts[pts.length-1];o.pen.position.set(p.x,0.1,p.z);o.pen.rotation.set(0,-0.7,0.35);}

/* — 4: вход в клуб — */
function rope(a,b,sag){return new T3.TubeGeometry(new T3.QuadraticBezierCurve3(a,new T3.Vector3((a.x+b.x)/2,Math.min(a.y,b.y)-sag,(a.z+b.z)/2),b),40,0.045,10,false);}
function buildClub(){const s=new T3.Scene();s.background=new T3.Color('#07030a');s.fog=new T3.FogExp2('#14061c',0.05);
  s.add(new T3.AmbientLight('#2a1030',0.7));
  const bt=bricks();bt.wrapS=bt.wrapT=T3.RepeatWrapping;bt.repeat.set(3,2);const wall=new T3.Mesh(new T3.PlaneGeometry(14,9),M('#ffffff',{map:bt,roughness:0.85}));wall.position.set(0,4.5,0);wall.receiveShadow=true;s.add(wall);
  const gnd=new T3.Mesh(new T3.PlaneGeometry(40,40),M('#0b0610',{roughness:0.16,metalness:0.55}));gnd.rotation.x=-Math.PI/2;gnd.receiveShadow=true;s.add(gnd);
  const door=new T3.Mesh(new T3.BoxGeometry(1.5,2.5,0.3),M('#020102'));door.position.set(0.3,1.25,0.02);s.add(door);
  const glowIn=new T3.Mesh(new T3.PlaneGeometry(1.3,2.3),new T3.MeshBasicMaterial({color:'#ff3ab0'}));glowIn.position.set(0.3,1.2,0.18);s.add(glowIn);
  const sign=new T3.Mesh(new T3.PlaneGeometry(3.2,0.8),new T3.MeshBasicMaterial({map:neonTex(),transparent:true}));sign.position.set(0.3,3.15,0.08);s.add(sign);
  const pl=new T3.PointLight('#ff3ab0',7,9,2);pl.position.set(0.3,1.6,1.1);pl.castShadow=true;pl.shadow.mapSize.set(512,512);s.add(pl);
  const pn=new T3.PointLight('#ff4fc0',3,7,2);pn.position.set(0.3,3.0,1.2);s.add(pn);
  const gold=M('#e2b866',{roughness:0.28,metalness:1});const posts=[[-1.3,1.5],[1.9,1.5]];for(const [x,z] of posts){const p=new T3.Mesh(new T3.CylinderGeometry(0.045,0.05,0.95,16),gold);p.position.set(x,0.48,z);p.castShadow=true;s.add(p);const b=new T3.Mesh(new T3.SphereGeometry(0.08,16,12),gold);b.position.set(x,0.98,z);s.add(b);const base=new T3.Mesh(new T3.CylinderGeometry(0.2,0.22,0.04,24),gold);base.position.set(x,0.02,z);s.add(base);}
  const rp=new T3.Mesh(rope(new T3.Vector3(-1.3,0.92,1.5),new T3.Vector3(1.9,0.92,1.5),0.32),M('#9a0d26',{roughness:0.9}));rp.castShadow=true;s.add(rp);
  const boun=figure({suit:'#08080a',skin:'#6d4c3c',wide:1.35,bald:true,glasses:true,tie:'#000'});boun.scale.setScalar(1.12);boun.position.set(1.85,0,0.75);boun.rotation.y=-0.35;s.add(boun);
  const man=figure({});man.position.set(-0.75,0,3.2);man.rotation.y=Math.PI;s.add(man);
  S.club={s,c:cam(42),rp,pl,pn,glowIn,sign,boun};}
function upClub(u,t){const o=S.club,d=scEnd(3)-scStart(3),k=E.ioS(u/d),fl=(Math.sin(t*37)>0.93?0.45:1)*(0.92+0.08*Math.sin(t*9));
  o.c.position.set(lerp(-0.7,-0.45,k)+0.03*Math.sin(t*1.7),lerp(1.62,1.55,k),lerp(6.6,5.2,k));o.c.lookAt(0.35,1.45,0);
  const op=inv(1.3,1.9,u);o.pl.intensity=lerp(5,11,op)*fl;o.pn.intensity=3*fl;o.glowIn.material.color.setRGB(1*lerp(0.55,1,op),0.23*lerp(0.55,1,op),0.69*lerp(0.55,1,op));o.sign.material.opacity=fl;
  const dr=E.inQ(inv(1.4,1.85,u));o.rp.geometry.dispose();o.rp.geometry=rope(new T3.Vector3(-1.3,0.92,1.5),new T3.Vector3(lerp(1.9,1.6,dr),lerp(0.92,0.06,dr),lerp(1.5,1.7,dr)),lerp(0.32,0.05,dr));
  o.boun.rotation.y=lerp(-0.35,-0.75,inv(1.3,1.8,u));}

/* — 5: шампанское — */
function buildChamp(){const s=new T3.Scene();s.background=new T3.Color('#040205');s.add(new T3.AmbientLight('#301a20',0.6));
  const G=glowTex(),bk=[];const r=rng(71);for(let i=0;i<34;i++){const col=['#ffbe5a','#ff5ab0','#ffe6b8'][(r()*3)|0],sp=new T3.Sprite(new T3.SpriteMaterial({map:G,color:col,transparent:true,opacity:0.22+0.25*r(),blending:T3.AdditiveBlending,depthWrite:false}));const sc=0.6+r()*1.6;sp.scale.set(sc,sc,1);sp.position.set((r()-0.5)*9,(r()-0.2)*9,-5-r()*5);s.add(sp);bk.push(sp);}
  const prof=[[0.0,0.0],[0.06,0.03],[0.14,0.18],[0.22,0.45],[0.27,0.8],[0.3,1.2],[0.31,1.62]].map(p=>new T3.Vector2(p[0],p[1]));
  const glass=new T3.Mesh(new T3.LatheGeometry(prof,48),new T3.MeshStandardMaterial({color:'#ffffff',transparent:true,opacity:0.16,roughness:0.04,metalness:0.1,side:T3.DoubleSide,envMapIntensity:1.2}));glass.position.y=0.9;s.add(glass);
  const lp=[[0.0,0.03],[0.05,0.05],[0.125,0.19],[0.205,0.46],[0.255,0.8],[0.282,1.12]].map(p=>new T3.Vector2(p[0],p[1]));
  const liq=new T3.Mesh(new T3.LatheGeometry(lp,48),M('#ffcf70',{emissive:'#e8a030',emissiveIntensity:0.65,transparent:true,opacity:0.9,roughness:0.15}));liq.position.y=0.9;s.add(liq);
  const surf=new T3.Mesh(new T3.CircleGeometry(0.282,48),M('#fff1c8',{emissive:'#ffd27a',emissiveIntensity:0.5,transparent:true,opacity:0.95}));surf.rotation.x=-Math.PI/2;surf.position.y=0.9+1.12;s.add(surf);
  const rim=new T3.Mesh(new T3.TorusGeometry(0.31,0.006,8,64),new T3.MeshBasicMaterial({color:'#ffffff'}));rim.rotation.x=Math.PI/2;rim.position.y=0.9+1.62;s.add(rim);
  const stem=new T3.Mesh(new T3.CylinderGeometry(0.018,0.022,0.9,16),new T3.MeshStandardMaterial({color:'#ffffff',transparent:true,opacity:0.35,roughness:0.05}));stem.position.y=0.45;s.add(stem);
  const base=new T3.Mesh(new T3.CylinderGeometry(0.28,0.3,0.02,48),new T3.MeshStandardMaterial({color:'#ffffff',transparent:true,opacity:0.35,roughness:0.05}));base.position.y=0.01;s.add(base);
  const lips=new T3.Mesh(new T3.SphereGeometry(0.05,16,10),M('#c0102e',{roughness:0.35}));lips.scale.set(1.3,0.35,0.35);lips.position.set(-0.24,0.9+1.6,0.2);s.add(lips);
  const bub=new T3.InstancedMesh(new T3.SphereGeometry(1,8,6),new T3.MeshBasicMaterial({color:'#fffbe8'}),90);s.add(bub);
  const k1=new T3.PointLight('#ff6ac0',2.2,8,2);k1.position.set(-1.6,2.6,-1.2);s.add(k1);const k2=new T3.PointLight('#ffc070',2.6,8,2);k2.position.set(1.8,2.2,-0.8);s.add(k2);const k3=new T3.PointLight('#ffffff',1.2,10,2);k3.position.set(1.2,2.8,3);s.add(k3);
  S.champ={s,c:cam(30),bub,bk};}
const DM=new T3.Object3D();
function upChamp(u,t){const o=S.champ,d=scEnd(4)-scStart(4),k=E.ioS(u/d);o.c.position.set(lerp(0.5,0.25,k),lerp(2.3,2.15,k),lerp(2.9,2.4,k));o.c.lookAt(0,1.85,0);
  const r=rng(81);for(let i=0;i<90;i++){const a=r()*TAU,rr=0.04+r()*0.17,sp=0.25+r()*0.5,ph=r();const h=(ph+sp*t)%1;const y=0.9+0.06+h*1.0,R=0.004+r()*0.007;DM.position.set(Math.cos(a)*rr*(0.55+0.45*h)+0.006*Math.sin(t*6+i),y,Math.sin(a)*rr*(0.55+0.45*h));DM.scale.setScalar(R);DM.updateMatrix();o.bub.setMatrixAt(i,DM.matrix);}
  o.bub.instanceMatrix.needsUpdate=true;for(let i=0;i<o.bk.length;i++){o.bk[i].position.x+=0;}}

/* — 6: чёрное стекло, дорожка и карта — */
function buildLine(){const s=new T3.Scene();s.background=new T3.Color('#020203');s.add(new T3.AmbientLight('#1a1a24',0.4));
  const tab=new T3.Mesh(new T3.PlaneGeometry(12,12),M('#060608',{roughness:0.12,metalness:0.85}));tab.rotation.x=-Math.PI/2;tab.receiveShadow=true;s.add(tab);
  const N=1600,pw=new T3.InstancedMesh(new T3.BoxGeometry(1,1,1),M('#ffffff',{emissive:'#ffffff',emissiveIntensity:0.18,roughness:0.9}),N);const r=rng(91);
  for(let i=0;i<N;i++){const q=r();DM.position.set(lerp(-1.3,1.3,q),0.006,(r()-0.5)*lerp(0.07,0.04,Math.abs(q-0.5)*2)+(r()<0.03?(r()-0.5)*0.2:0));DM.rotation.set(r()*3,r()*3,r()*3);DM.scale.setScalar(0.006+0.014*r()*r());DM.updateMatrix();pw.setMatrixAt(i,DM.matrix);}
  pw.rotation.y=0.35;pw.receiveShadow=true;s.add(pw);
  const card=new T3.Group();const cb=new T3.Mesh(new T3.RoundedBoxGeometry(1.0,0.018,0.63,3,0.045),M('#0c0c10',{roughness:0.35,metalness:0.4}));cb.castShadow=true;card.add(cb);
  const chip=new T3.Mesh(new T3.BoxGeometry(0.16,0.004,0.12),M('#d9c48a',{roughness:0.3,metalness:1}));chip.position.set(-0.28,0.012,-0.08);card.add(chip);card.rotation.y=0.35+0.1;s.add(card);
  const a=new T3.PointLight('#ff2a9a',3.5,8,2);a.position.set(-2.2,0.7,-1.4);s.add(a);const b=new T3.PointLight('#2a8cff',3,8,2);b.position.set(2.4,0.6,1.6);s.add(b);
  const L=spot('#e8ecff',9,[0.6,3.5,0.8],[0,0,0],0.55,0.8,true);s.add(L);s.add(L.target);
  S.line={s,c:cam(36),card};}
function upLine(u,t){const o=S.line,d=scEnd(5)-scStart(5),k=E.outC(u/d);o.c.position.set(0.1*Math.sin(t*0.9),lerp(3.3,2.75,k),0.9+0.04*Math.sin(t*1.3));o.c.lookAt(0,0,0.05);
  const cu=E.ioS(inv(0.2,1.25,u)),x=lerp(1.9,-0.6,cu);o.card.position.set(x*Math.cos(0.35),0.012,-x*Math.sin(0.35)+0.42);}

const UP={city:upCity,win:upWin,desk:upDesk,club:upClub,champ:upChamp,line:upLine};
function render3(c,i,t){const k=SC[i][0],o=S[k];UP[k](t-scStart(i),t);RP.scene=o.s;RP.camera=o.c;COMP.render();c.drawImage(GL,0,0,W,H);}

/* ===================== 2D поверх ===================== */
function counter(c,u){if(u<0.5)return;const cu=inv(0.92,1.55,u),v=Math.round(1e6*E.outC(cu)),s='$'+v.toString().replace(/\B(?=(\d{3})+(?!\d))/g,','),pop=1+0.08*Math.max(0,1-Math.abs(u-1.55)/0.12);
  c.save();c.translate(540,330);c.scale(pop,pop);txt(c,s,0,0,{font:'800 138px Mont',fill:'#fff',shadow:'rgba(255,170,60,0.7)',sb:36});c.restore();}
function drawScene(c,i,t){reset(c);c.fillStyle='#000';c.fillRect(0,0,W,H);render3(c,i,t);if(SC[i][0]==='desk')counter(c,t-scStart(i));
  if(SC[i][0]==='line'){const d=scEnd(5)-scStart(5),dk=inv(d-0.45,d,t-scStart(i));if(dk>0){c.fillStyle=`rgba(0,0,0,${0.7*dk})`;c.fillRect(0,0,W,H);}}}
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
  c.restore();c.save();c.globalAlpha=0.16*k;c.fillStyle='#fff';c.fillRect(0,0,W,H);c.restore();}

/* ===================== город для окна (2D-панорама как текстура) ===================== */
function skylineTex(){return ctex(2048,1280,(x,w,h)=>{x.fillStyle=lg(x,0,0,0,h,[[0,'#01030a'],[0.6,'#0a1a3a'],[1,'#1c3866']]);x.fillRect(0,0,w,h);
  const r=rng(9),gy=h*0.86;let X=-20;while(X<w){const bw=40+r()*120,bh=60+r()*260;x.fillStyle='#050a16';x.fillRect(X,gy-bh,bw,bh);for(let y=gy-bh+6;y<gy-6;y+=12)for(let xx=X+4;xx<X+bw-6;xx+=10)if(r()<0.33){x.fillStyle=['#ffcf86','#ffb45c','#c4d8ff'][(r()*3)|0];x.globalAlpha=0.5+0.5*r();x.fillRect(xx,y,6,7);x.globalAlpha=1;}X+=bw+r()*8;}
  for(const [cx,bw,bh] of [[880,110,820],[1010,130,1020],[1150,100,760],[1260,120,880],[760,90,640]]){x.fillStyle='#060b18';x.fillRect(cx-bw/2,gy-bh,bw,bh);for(let y=gy-bh+8;y<gy-6;y+=14)for(let xx=cx-bw/2+5;xx<cx+bw/2-6;xx+=11)if(r()<0.45){x.fillStyle=['#ffcf86','#ffe2b0','#9fc0ff'][(r()*3)|0];x.globalAlpha=0.55+0.45*r();x.fillRect(xx,y,7,8);x.globalAlpha=1;}
    x.fillStyle='#ff3a2a';x.beginPath();x.arc(cx,gy-bh-6,5,0,TAU);x.fill();}
  x.fillStyle='#02040a';x.fillRect(0,gy,w,h-gy);});}

CLIP.init=async()=>{await DC.init();
  GL=document.createElement('canvas');GL.width=W;GL.height=H;
  R=new T3.WebGLRenderer({canvas:GL,antialias:true,preserveDrawingBuffer:true});R.setPixelRatio(1);R.setSize(W,H,false);R.outputEncoding=T3.sRGBEncoding;R.shadowMap.enabled=true;R.shadowMap.type=T3.PCFSoftShadowMap;
  const pm=new T3.PMREMGenerator(R),ENV=pm.fromScene(new T3.RoomEnvironment(),0.04).texture;
  const FONT=new T3.FontLoader().parse(await (await fetch('/s/vendor/three147/helvetiker_bold.typeface.json')).json());
  buildCity(FONT);buildWin(skylineTex());buildDesk();buildClub();buildChamp();buildLine();
  for(const k of ['win','desk','club','champ','line'])S[k].s.environment=ENV;
  COMP=new T3.EffectComposer(R);RP=new T3.RenderPass(S.city.s,S.city.c);COMP.addPass(RP);BLOOM=new T3.UnrealBloomPass(new T3.Vector2(540,960),0.85,0.55,0.62);COMP.addPass(BLOOM);COMP.addPass(new T3.ShaderPass(FinalShader));};
CLIP.draw=(c,t,i)=>{
  if(t<5.0){DC.draw(c,t);grain(c,i,0.05);return;}
  if(t<V0){c.fillStyle='#000';c.fillRect(0,0,W,H);return;}
  const s=sceneAt(t);whip(c,s,t);
  vig(c,0.6,0.27);grain(c,i,0.07);
  const fk=inv(V0+0.1,V0,t);if(fk>0){c.save();reset(c);c.globalAlpha=0.85*fk;c.fillStyle='#fff';c.fillRect(0,0,W,H);c.restore();}
  hud(c,t);subs(c,t);
};
})();
