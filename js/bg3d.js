/* =====================================================================================
   9.2 — 3D-ФОН. У приложения свой кинозал, у каждого фильма — своя сцена:
   Сопрано — стол в итальянском ресторане, Таксист — ночная улица под дождём, Волк — офис над городом,
   Психопат — визитки в холодной квартире, Бункер — бетон и лампа над картой, клип — клуб.
   Рисуем не чаще 30 кадров в секунду, замираем, пока идёт видео или вкладка скрыта.
   Если устройство не тянет (кадр дольше ~45 мс) — 3D выключается само, остаётся размытая картинка сцены.
   Three.js лежит локально (js/vendor/three.min.js) и грузится после старта приложения.
   ===================================================================================== */
(function(){
  const BG={on:false,ready:false,want:'app',paused:false,failed:false};window.BG3D=BG;
  let T,R,canvas,cur=null,raf=0,last=0,acc=0,frames=0,slow=0,startT=0;const built={};
  const saved=()=>{try{const s=JSON.parse(localStorage.getItem('dota_quiz_v4')||'{}');return s.bg3d===true;}catch(e){return true;}};
  function load(){if(window.THREE){init();return;}const s=document.createElement('script');s.src='js/vendor/three.min.js?v=9.2';s.onload=init;s.onerror=()=>{BG.failed=true;};document.head.appendChild(s);}
  function init(){T=window.THREE;if(!T)return;
    try{canvas=document.createElement('canvas');canvas.id='bg3d';canvas.setAttribute('aria-hidden','true');document.body.prepend(canvas);
      R=new T.WebGLRenderer({canvas,antialias:false,alpha:false,powerPreference:'low-power'});}
    catch(e){BG.failed=true;if(canvas)canvas.remove();return;}
    R.setPixelRatio(Math.min(window.devicePixelRatio||1,innerWidth<700?1.5:1.25));R.outputEncoding=T.sRGBEncoding;
    size();addEventListener('resize',size);
    document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else go();});
    BG.ready=true;BG.set(BG.want);}
  function size(){if(!R)return;R.setSize(innerWidth,innerHeight,false);for(const k in built){const c=built[k].cam;c.aspect=innerWidth/innerHeight;c.updateProjectionMatrix();}}
  function go(){if(!BG.ready||!BG.on||BG.paused||raf||document.hidden||!cur)return;last=performance.now();raf=requestAnimationFrame(loop);}
  function stop(){if(raf)cancelAnimationFrame(raf);raf=0;}
  function loop(now){raf=requestAnimationFrame(loop);const dt=now-last;if(dt<31)return;last=now;
    const t=(now-startT)/1000;try{cur.update(t,Math.min(dt,100)/1000);R.render(cur.scene,cur.cam);}catch(e){fail();return;}
    // проверка скорости: первые ~3 секунды
    if(frames<90){frames++;if(dt>48)slow++;if(frames===90&&slow>45&&!window.__bgKeep)fail();}}
  function fail(){stop();BG.failed=true;BG.on=false;document.body.classList.remove('has3d');if(canvas)canvas.style.display='none';}
  BG.set=function(theme){BG.want=theme||'app';if(!BG.ready||!BG.on)return;const k=MK[BG.want]?BG.want:'app';
    if(!built[k]){try{built[k]=MK[k]();const c=built[k].cam;c.aspect=innerWidth/innerHeight;c.updateProjectionMatrix();}catch(e){console.warn('bg3d',e);fail();return;}}
    if(cur!==built[k]){cur=built[k];startT=performance.now()-Math.random()*20000;R.render(cur.scene,cur.cam);}
    document.body.classList.add('has3d');canvas.style.display='';go();};
  BG.pause=function(p){BG.paused=!!p;if(p)stop();else go();};
  BG.enable=function(v){BG.on=!!v&&!BG.failed;if(!BG.on){stop();document.body.classList.remove('has3d');if(canvas)canvas.style.display='none';return;}
    if(!BG.ready){load();return;}BG.set(BG.want);};

  /* ---------- общие заготовки ---------- */
  const rnd=(a,b)=>a+Math.random()*(b-a);
  function tex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');draw(g,w,h);const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return t;}
  const glowTex=()=>tex(64,64,(g)=>{const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.35,'rgba(255,255,255,.35)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,64,64);});
  let GLOW=null;const glow=()=>GLOW||(GLOW=glowTex());
  function sprite(color,size,op){const m=new T.SpriteMaterial({map:glow(),color,transparent:true,opacity:op==null?1:op,depthWrite:false,blending:T.AdditiveBlending});const s=new T.Sprite(m);s.scale.set(size,size,1);return s;}
  function dust(n,box,color,size){const g=new T.BufferGeometry(),p=new Float32Array(n*3);for(let i=0;i<n;i++){p[i*3]=rnd(-box[0],box[0]);p[i*3+1]=rnd(0,box[1]);p[i*3+2]=rnd(-box[2],box[2]);}
    g.setAttribute('position',new T.BufferAttribute(p,3));const m=new T.PointsMaterial({color,size,map:glow(),transparent:true,opacity:.7,depthWrite:false,blending:T.AdditiveBlending});const pts=new T.Points(g,m);pts.userData.box=box;return pts;}
  function drift(pts,dt,vy){const a=pts.geometry.attributes.position,b=pts.userData.box;for(let i=0;i<a.count;i++){let y=a.getY(i)+vy*dt;if(y>b[1])y=0;if(y<0)y=b[1];a.setY(i,y);a.setX(i,a.getX(i)+Math.sin(y*2+i)*dt*.05);}a.needsUpdate=true;}
  function windows(w,h,cols,rows,on,lit){return tex(w,h,(g)=>{g.fillStyle='#0b0d12';g.fillRect(0,0,w,h);const cw=w/cols,rh=h/rows;
    for(let x=0;x<cols;x++)for(let y=0;y<rows;y++){if(Math.random()<on){g.fillStyle=lit[Math.floor(Math.random()*lit.length)];g.globalAlpha=rnd(.55,1);g.fillRect(x*cw+cw*.2,y*rh+rh*.25,cw*.6,rh*.5);}}g.globalAlpha=1;});}
  function base(bg,fogN,fogF){const scene=new T.Scene();scene.background=new T.Color(bg);scene.fog=new T.Fog(bg,fogN,fogF);const cam=new T.PerspectiveCamera(50,1,.1,200);return {scene,cam};}
  const lambert=(color,o)=>new T.MeshLambertMaterial(Object.assign({color},o||{}));
  const phong=(color,o)=>new T.MeshPhongMaterial(Object.assign({color,shininess:60},o||{}));
  function lathe(pts,mat,seg){return new T.Mesh(new T.LatheGeometry(pts.map(p=>new T.Vector2(p[0],p[1])),seg||24),mat);}

  /* ---------- сцены ---------- */
  const MK={};
  // приложение: тёмный кинозал, светящийся экран, луч проектора и пыль в нём
  MK.app=function(){const {scene,cam}=base(0x0b0b0e,8,40);
    scene.add(new T.AmbientLight(0x404058,.6));
    const scrT=tex(512,256,(g,w,h)=>{const r=g.createLinearGradient(0,0,w,h);r.addColorStop(0,'#2a3a6a');r.addColorStop(.5,'#c89a4a');r.addColorStop(1,'#6a2a3a');g.fillStyle=r;g.fillRect(0,0,w,h);});
    const scr=new T.Mesh(new T.PlaneGeometry(16,7),new T.MeshBasicMaterial({map:scrT,toneMapped:false}));scr.position.set(0,4.2,-18);scene.add(scr);
    const sl=new T.PointLight(0xd8b070,1.6,30);sl.position.set(0,4,-15);scene.add(sl);
    const seatG=new T.BoxGeometry(.8,1,.7),seatM=lambert(0x5a1218),rows=7,per=14,seats=new T.InstancedMesh(seatG,seatM,rows*per),m=new T.Matrix4();let n=0;
    for(let r=0;r<rows;r++)for(let i=0;i<per;i++){m.makeTranslation((i-(per-1)/2)*1.05,.5+r*.35,-3-r*1.6);seats.setMatrixAt(n++,m);}scene.add(seats);
    const beam=new T.Mesh(new T.ConeGeometry(3.2,22,24,1,true),new T.MeshBasicMaterial({color:0xfff0c8,transparent:true,opacity:.05,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide}));
    beam.rotation.x=Math.PI/2;beam.position.set(0,5.2,-7);scene.add(beam);
    const d=dust(260,[5,9,12],0xffe6b0,.09);d.position.set(0,0,-6);scene.add(d);
    const proj=sprite(0xfff0d0,2.2,.9);proj.position.set(0,5.4,4);scene.add(proj);
    return {scene,cam,update(t,dt){cam.position.set(Math.sin(t*.07)*1.2,3.6+Math.sin(t*.11)*.25,7);cam.lookAt(0,3.4,-12);
      scrT.offset.x=Math.sin(t*.05)*.08;sl.intensity=1.4+Math.sin(t*3.1)*.08+Math.sin(t*7.3)*.05;drift(d,dt,.08);}};};

  // Клан Сопрано: стол в итальянском ресторане — скатерть в клетку, вино, свеча, тарелка
  MK.noir=function(){const {scene,cam}=base(0x120a08,6,22);
    scene.add(new T.AmbientLight(0x6a4a3a,.45));
    const check=tex(256,256,(g,w)=>{const s=w/8;for(let x=0;x<8;x++)for(let y=0;y<8;y++){g.fillStyle=(x+y)%2?'#efe6d6':'#a3161c';g.fillRect(x*s,y*s,s,s);}});check.wrapS=check.wrapT=T.RepeatWrapping;check.repeat.set(3,3);
    const table=new T.Mesh(new T.BoxGeometry(6,.12,6),lambert(0xffffff,{map:check}));scene.add(table);
    const drape=new T.Mesh(new T.CylinderGeometry(4.25,4.25,1.6,4,1,true),lambert(0xffffff,{map:check,side:T.DoubleSide}));drape.rotation.y=Math.PI/4;drape.position.y=-.8;scene.add(drape);
    const bottle=lathe([[0,0],[.34,0],[.36,.1],[.36,1.1],[.3,1.3],[.12,1.55],[.11,2.05],[.13,2.1],[0,2.1]],phong(0x123a1e,{shininess:120,specular:0x557755}));bottle.position.set(-.9,.06,-.5);scene.add(bottle);
    const label=new T.Mesh(new T.CylinderGeometry(.365,.365,.5,24,1,true),lambert(0xe8dcc0));label.position.set(-.9,.7,-.5);scene.add(label);
    const glassM=phong(0xffffff,{transparent:true,opacity:.28,shininess:140,specular:0xffffff,side:T.DoubleSide});
    [[.4,-.9],[1.2,.1]].forEach(([x,z])=>{const gl=lathe([[0,0],[.22,0],[.03,.04],[.03,.5],[.2,.62],[.24,.85],[.22,1.05]],glassM);gl.position.set(x,.06,z);scene.add(gl);
      const wine=lathe([[0,0],[.18,0],[.21,.18],[0,.18]],phong(0x5a0a14,{transparent:true,opacity:.85}));wine.position.set(x,.68,z);scene.add(wine);});
    const plate=new T.Mesh(new T.CylinderGeometry(.9,.7,.06,40),phong(0xf4f1ea,{shininess:90}));plate.position.set(.3,.09,.9);scene.add(plate);
    const pasta=new T.Mesh(new T.TorusKnotGeometry(.22,.07,60,8,3,5),lambert(0xe2b860));pasta.position.set(.3,.25,.9);pasta.scale.set(1,.45,1);scene.add(pasta);
    const candle=new T.Mesh(new T.CylinderGeometry(.11,.11,.7,16),lambert(0xf2e6c8));candle.position.set(-.2,.41,-1.3);scene.add(candle);
    const flame=sprite(0xffb050,.7);flame.position.set(-.2,.88,-1.3);scene.add(flame);
    const cl=new T.PointLight(0xffa050,2.4,9,1.6);cl.position.set(-.2,1.1,-1.3);scene.add(cl);
    const key=new T.SpotLight(0xffd0a0,.9,30,.5,.6);key.position.set(3,8,4);scene.add(key);
    for(let i=0;i<14;i++){const b=sprite([0xffb060,0xff7040,0xffe0a0][i%3],rnd(.8,2.2),rnd(.08,.22));b.position.set(rnd(-10,10),rnd(1,5),rnd(-14,-7));scene.add(b);}
    return {scene,cam,update(t){const a=t*.06;cam.position.set(Math.sin(a)*4.6,2.1+Math.sin(t*.13)*.2,Math.cos(a)*4.6);cam.lookAt(0,.5,0);
      const f=1+Math.sin(t*9)*.08+Math.sin(t*23)*.05;cl.intensity=2.3*f;flame.scale.set(.55*f,.8*f,1);}};};

  // Таксист: ночная улица, дождь, жёлтое такси, неон
  MK.taxi=function(){const {scene,cam}=base(0x07080d,6,48);
    scene.add(new T.AmbientLight(0x3a4060,.55));
    const road=new T.Mesh(new T.PlaneGeometry(60,200),phong(0x0c0d12,{shininess:110,specular:0x445066}));road.rotation.x=-Math.PI/2;scene.add(road);
    const lines=new T.InstancedMesh(new T.PlaneGeometry(.18,2.2),new T.MeshBasicMaterial({color:0xb09030}),30),m=new T.Matrix4(),q=new T.Quaternion().setFromEuler(new T.Euler(-Math.PI/2,0,0));
    for(let i=0;i<30;i++){m.compose(new T.Vector3(0,.01,-i*5),q,new T.Vector3(1,1,1));lines.setMatrixAt(i,m);}scene.add(lines);
    const wt=[windows(128,256,6,14,.35,['#ffcf7a','#ffe3a8','#9fc6ff']),windows(128,256,5,12,.45,['#ffb45a','#ffd890']),windows(128,256,7,16,.3,['#ffe9b8','#ff9a6a'])];
    for(let side of[-1,1])for(let i=0;i<12;i++){const h=rnd(10,26),w=rnd(5,8),b=new T.Mesh(new T.BoxGeometry(w,h,6),[lambert(0x0d0f16),lambert(0x0d0f16),lambert(0x0d0f16),lambert(0x0d0f16),new T.MeshBasicMaterial({map:wt[i%3]}),lambert(0x0d0f16)]);
      b.position.set(side*(9+w/2),h/2,-i*8-4);b.rotation.y=side>0?-Math.PI/2:Math.PI/2;b.material[4]=new T.MeshBasicMaterial({map:wt[(i+side+3)%3]});scene.add(b);}
    const cab=new T.Group(),yel=phong(0xf2c200,{shininess:90}),blk=lambert(0x111111);
    const body=new T.Mesh(new T.BoxGeometry(2,.7,4.6),yel);body.position.y=.65;cab.add(body);
    const top=new T.Mesh(new T.BoxGeometry(1.7,.6,2.2),yel);top.position.set(0,1.25,-.2);cab.add(top);
    const glass=new T.Mesh(new T.BoxGeometry(1.72,.42,2.0),phong(0x223344,{shininess:120}));glass.position.set(0,1.27,-.2);cab.add(glass);
    const sign=new T.Mesh(new T.BoxGeometry(.7,.22,.3),new T.MeshBasicMaterial({color:0xfff2b0}));sign.position.set(0,1.67,-.2);cab.add(sign);
    for(const [x,z] of[[-1,1.4],[1,1.4],[-1,-1.5],[1,-1.5]]){const w=new T.Mesh(new T.CylinderGeometry(.36,.36,.3,16),blk);w.rotation.z=Math.PI/2;w.position.set(x,.36,z);cab.add(w);}
    [-.65,.65].forEach(x=>{const hl=sprite(0xfff4d0,1.2,.9);hl.position.set(x,.7,-2.35);cab.add(hl);const tl=sprite(0xff2a2a,.7,.8);tl.position.set(x,.7,2.33);cab.add(tl);});
    cab.position.set(-2.2,0,-9);scene.add(cab);
    const neonT=tex(256,96,(g,w,h)=>{g.fillStyle='#000';g.fillRect(0,0,w,h);g.font='bold 64px Georgia,serif';g.textAlign='center';g.textBaseline='middle';g.shadowColor='#ff3d8a';g.shadowBlur=18;g.fillStyle='#ff7ab0';g.fillText('BAR',w/2,h/2+4);});
    const neon=new T.Mesh(new T.PlaneGeometry(3.4,1.3),new T.MeshBasicMaterial({map:neonT,blending:T.AdditiveBlending,transparent:true}));neon.position.set(8.9,5,-14);neon.rotation.y=-Math.PI/2;scene.add(neon);
    const nl=new T.PointLight(0xff3d8a,2.2,16);nl.position.set(7.5,5,-14);scene.add(nl);
    const sl=new T.PointLight(0x9fc6ff,1.2,26);sl.position.set(-6,8,-24);scene.add(sl);
    for(let i=0;i<8;i++){const lamp=sprite(0xffcf7a,1.6,.8);lamp.position.set(i%2?7:-7,6.5,-i*12-6);scene.add(lamp);}
    const N=900,rg=new T.BufferGeometry(),rp=new Float32Array(N*6);for(let i=0;i<N;i++){const x=rnd(-14,14),y=rnd(0,16),z=rnd(-40,6);rp.set([x,y,z,x+.03,y-.55,z],i*6);}
    rg.setAttribute('position',new T.BufferAttribute(rp,3));const rain=new T.LineSegments(rg,new T.LineBasicMaterial({color:0x8aa0c8,transparent:true,opacity:.35}));scene.add(rain);
    return {scene,cam,update(t,dt){cam.position.set(1.6+Math.sin(t*.05)*.8,2.4,4+Math.sin(t*.07)*.6);cam.lookAt(-1,1.6,-14);
      const a=rain.geometry.attributes.position;for(let i=0;i<a.count;i+=2){let y=a.getY(i)-dt*18;if(y<0)y+=16;a.setY(i,y);a.setY(i+1,y-.55);}a.needsUpdate=true;
      nl.intensity=Math.sin(t*1.7)>-.92?2.2:.2;neon.material.opacity=nl.intensity>1?1:.25;cab.position.z=-9+Math.sin(t*.09)*1.2;}};};

  // Волк с Уолл-стрит: офис над ночным городом, пачки денег, бегущая строка котировок
  MK.wolf=function(){const {scene,cam}=base(0x060b0a,8,60);
    scene.add(new T.AmbientLight(0x406050,.5));
    const wt=windows(128,256,6,16,.5,['#ffd98a','#fff0c0','#bfe0ff']);
    for(let i=0;i<34;i++){const h=rnd(8,34),w=rnd(3,6),b=new T.Mesh(new T.BoxGeometry(w,h,w),new T.MeshBasicMaterial({map:wt,color:0xb0b0b0}));b.position.set(rnd(-40,40),h/2-6,rnd(-60,-26));scene.add(b);}
    const desk=new T.Mesh(new T.BoxGeometry(8,.25,3.4),phong(0x2a170c,{shininess:80}));desk.position.set(0,0,0);scene.add(desk);
    const cash=lambert(0x5f8f5a),band=lambert(0xe8dcb0);
    for(let i=0;i<9;i++){const g=new T.Group(),h=rnd(.2,.9);const st=new T.Mesh(new T.BoxGeometry(.9,h,.42),cash);st.position.y=h/2;g.add(st);const bd=new T.Mesh(new T.BoxGeometry(.2,h+.01,.43),band);bd.position.y=h/2;g.add(bd);
      g.position.set(-2.8+(i%5)*.95+rnd(-.1,.1),.13,-.7+Math.floor(i/5)*.7);g.rotation.y=rnd(-.2,.2);scene.add(g);}
    const phone=new T.Mesh(new T.BoxGeometry(.7,.25,1),lambert(0x121212));phone.position.set(2.4,.25,.2);scene.add(phone);
    const tickT=tex(1024,64,(g,w,h)=>{g.fillStyle='#03130b';g.fillRect(0,0,w,h);g.font='bold 34px "PT Mono",monospace';g.textBaseline='middle';const L=['STRT +4.20','DOW 2722 ▲','IBM 122 ▼','GE +1.15','XRX -0.80','BRK 3450 ▲','AAPL +0.45','GM -1.10'];let x=10;
      for(const s of L){g.fillStyle=/▼|-/.test(s)?'#ff5a4a':'#5aff8a';g.fillText(s,x,h/2);x+=g.measureText(s).width+40;}});tickT.wrapS=T.RepeatWrapping;tickT.repeat.set(2,1);
    const tick=new T.Mesh(new T.PlaneGeometry(24,.9),new T.MeshBasicMaterial({map:tickT}));tick.position.set(0,4.4,-6);scene.add(tick);
    const gl=new T.PointLight(0xffc860,1.6,14);gl.position.set(0,3,1.5);scene.add(gl);
    const lamp=sprite(0xffd890,1.4,.85);lamp.position.set(3.4,1.6,-.8);scene.add(lamp);
    return {scene,cam,update(t){cam.position.set(Math.sin(t*.05)*2.2,2.2+Math.sin(t*.09)*.2,5.4);cam.lookAt(0,1.2,-6);tickT.offset.x=(t*.04)%1;}};};

  // Американский психопат: холодная белая квартира, визитки цвета «кость» парят над стеклянным столом
  MK.bone=function(){const {scene,cam}=base(0x0e0f11,7,30);
    scene.add(new T.AmbientLight(0x8890a0,.55));
    const floor=new T.Mesh(new T.PlaneGeometry(40,40),phong(0x1a1c20,{shininess:120,specular:0x333840}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.4;scene.add(floor);
    const table=new T.Mesh(new T.BoxGeometry(5,.08,2.6),phong(0x9fb8c8,{transparent:true,opacity:.22,shininess:150,specular:0xffffff}));scene.add(table);
    [[-2.3,-1.1],[2.3,-1.1],[-2.3,1.1],[2.3,1.1]].forEach(([x,z])=>{const l=new T.Mesh(new T.CylinderGeometry(.04,.04,1.4,8),phong(0xc0c4cc));l.position.set(x,-.7,z);scene.add(l);});
    const cardT=tex(256,146,(g,w,h)=>{g.fillStyle='#ece4d2';g.fillRect(0,0,w,h);g.fillStyle='#2a2620';g.textAlign='center';g.font='600 15px Georgia,serif';g.fillText('VICE PRESIDENT',w/2,h*.58);g.font='11px Georgia,serif';g.fillText('MERGERS  &  ACQUISITIONS',w/2,h*.72);g.font='10px Georgia,serif';g.textAlign='left';g.fillText('212  555  6342',12,18);});
    const cm=[new T.MeshLambertMaterial({color:0xe6dfcf}),new T.MeshLambertMaterial({color:0xe6dfcf}),new T.MeshLambertMaterial({map:cardT}),new T.MeshLambertMaterial({color:0xd8d0c0}),new T.MeshLambertMaterial({color:0xe6dfcf}),new T.MeshLambertMaterial({color:0xe6dfcf})];
    const cards=[];for(let i=0;i<7;i++){const c=new T.Mesh(new T.BoxGeometry(1.75,.012,1),cm);c.position.set(rnd(-2,2),rnd(.4,2.4),rnd(-1.4,1));c.rotation.set(rnd(-.3,.3),rnd(-1,1),rnd(-.2,.2));c.userData={y:c.position.y,s:rnd(.3,.7),p:rnd(0,6)};cards.push(c);scene.add(c);}
    const key=new T.DirectionalLight(0xdfe8ff,.9);key.position.set(-4,8,5);scene.add(key);
    const rim=new T.PointLight(0x8fb0ff,1.2,20);rim.position.set(5,3,-4);scene.add(rim);
    const red=sprite(0xc0302a,3,.12);red.position.set(-6,3,-9);scene.add(red);
    const win=new T.Mesh(new T.PlaneGeometry(14,6),new T.MeshBasicMaterial({map:windows(256,128,14,6,.35,['#ffe6b0','#cfe0ff']),color:0x9aa0a8}));win.position.set(0,2.5,-10);scene.add(win);
    return {scene,cam,update(t){cam.position.set(Math.sin(t*.05)*4.2,2.2,Math.cos(t*.05)*4.2+1);cam.lookAt(0,1,0);
      for(const c of cards){const u=c.userData;c.position.y=u.y+Math.sin(t*u.s+u.p)*.18;c.rotation.y+=.0015*u.s;}}};};

  // Бункер: бетонная комната, лампа на проводе качается над картой
  MK.bunker=function(){const {scene,cam}=base(0x0b0c0a,5,22);
    scene.add(new T.AmbientLight(0x404838,.5));
    const conc=tex(256,256,(g,w,h)=>{g.fillStyle='#4a4b45';g.fillRect(0,0,w,h);for(let i=0;i<5000;i++){const v=Math.floor(rnd(50,110));g.fillStyle=`rgba(${v},${v},${v-6},.25)`;g.fillRect(rnd(0,w),rnd(0,h),2,2);}g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=2;for(let y=0;y<h;y+=64){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();}});
    conc.wrapS=conc.wrapT=T.RepeatWrapping;conc.repeat.set(3,2);
    const room=new T.Mesh(new T.BoxGeometry(16,7,16),lambert(0xffffff,{map:conc,side:T.BackSide}));room.position.y=2.5;scene.add(room);
    const table=new T.Mesh(new T.BoxGeometry(5,.15,3),lambert(0x3a2e20));table.position.y=-.2;scene.add(table);
    const mapT=tex(512,320,(g,w,h)=>{g.fillStyle='#cbbf98';g.fillRect(0,0,w,h);g.strokeStyle='rgba(60,50,30,.35)';for(let x=0;x<w;x+=32){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke();}for(let y=0;y<h;y+=32){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();}
      g.strokeStyle='#5a7aa0';g.lineWidth=6;g.beginPath();g.moveTo(0,200);g.bezierCurveTo(140,150,260,260,512,180);g.stroke();
      g.fillStyle='rgba(120,40,30,.55)';g.beginPath();g.arc(300,170,46,0,7);g.fill();g.strokeStyle='#8a1a14';g.lineWidth=5;
      [[120,80,250,150],[420,90,330,150],[200,290,280,200]].forEach(([a,b,c,d])=>{g.beginPath();g.moveTo(a,b);g.lineTo(c,d);g.stroke();g.beginPath();g.arc(c,d,6,0,7);g.fillStyle='#8a1a14';g.fill();});});
    const map=new T.Mesh(new T.PlaneGeometry(4.4,2.6),lambert(0xffffff,{map:mapT}));map.rotation.x=-Math.PI/2;map.position.y=-.11;scene.add(map);
    const pins=[];for(let i=0;i<6;i++){const p=new T.Mesh(new T.ConeGeometry(.06,.25,8),lambert(i%2?0x8a1a14:0x2a3a5a));p.position.set(rnd(-1.8,1.8),.02,rnd(-1,1));scene.add(p);pins.push(p);}
    const pend=new T.Group();pend.position.set(0,5.9,0);scene.add(pend);
    const wire=new T.Mesh(new T.CylinderGeometry(.01,.01,3,4),lambert(0x111111));wire.position.y=-1.5;pend.add(wire);
    const shade=new T.Mesh(new T.ConeGeometry(.5,.4,20,1,true),lambert(0x2f3a2a,{side:T.DoubleSide}));shade.position.y=-3.1;pend.add(shade);
    const bulb=sprite(0xffe2a0,1.1);bulb.position.y=-3.3;pend.add(bulb);
    const bl=new T.PointLight(0xffd890,2.6,12,1.4);bl.position.y=-3.35;pend.add(bl);
    const d=dust(220,[6,6,6],0xd8cfa8,.05);d.position.y=-.5;scene.add(d);
    return {scene,cam,update(t,dt){cam.position.set(Math.sin(t*.04)*3.6,2.6,4.6);cam.lookAt(0,.2,0);pend.rotation.z=Math.sin(t*.8)*.09;pend.rotation.x=Math.sin(t*.53)*.05;
      bl.intensity=2.5+(Math.random()<.015?-1.8:0);drift(d,dt,.04);}};};

  // клип: клуб — диско-шар, цветные лучи, конфетти
  MK.pump=function(){const {scene,cam}=base(0x07040a,6,30);
    scene.add(new T.AmbientLight(0x302040,.6));
    const floor=new T.Mesh(new T.PlaneGeometry(40,40),phong(0x120a18,{shininess:90}));floor.rotation.x=-Math.PI/2;scene.add(floor);
    const ball=new T.Mesh(new T.IcosahedronGeometry(1.1,2),new T.MeshPhongMaterial({color:0xcfd4e0,shininess:150,specular:0xffffff,flatShading:true}));ball.position.y=5;scene.add(ball);
    const cols=[0xff4fa0,0x4fd0ff,0xffd84f,0x9a5bff],beams=[],lights=[];
    cols.forEach((c,i)=>{const b=new T.Mesh(new T.ConeGeometry(1.4,10,20,1,true),new T.MeshBasicMaterial({color:c,transparent:true,opacity:.09,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide}));
      b.position.set((i-1.5)*3,5,-4);b.geometry.translate(0,-5,0);scene.add(b);beams.push(b);const l=new T.PointLight(c,1.4,14);l.position.set((i-1.5)*3,1,-4);scene.add(l);lights.push(l);});
    const d=dust(300,[10,8,8],0xffffff,.08);scene.add(d);
    return {scene,cam,update(t,dt){cam.position.set(Math.sin(t*.06)*6,2.2,8);cam.lookAt(0,3,-2);ball.rotation.y=t*.4;
      beams.forEach((b,i)=>{b.rotation.z=Math.sin(t*.7+i)*.6;b.rotation.x=Math.cos(t*.5+i*1.7)*.4;});lights.forEach((l,i)=>l.intensity=1+Math.sin(t*2+i)*.6);drift(d,dt,-.3);}};};

  // старт: после загрузки приложения, чтобы не мешать первому экрану
  function boot(){BG.enable(saved());}
  if(document.readyState==='complete')setTimeout(boot,400);else addEventListener('load',()=>setTimeout(boot,400));
})();
