/* рисовалка по точкам (28.11): гладкие контуры, мягкие тени — для v9s.js */
// рисовалка по точкам: гладкие контуры (катмулл-ром), мягкие тени
const L={};const BS=c=>Math.hypot(c.getTransform().a,c.getTransform().b);
L.path=(c,P,closed=true,t=.5)=>{const n=P.length;c.beginPath();c.moveTo(P[0][0],P[0][1]);
 const g=i=>P[closed?(i+n)%n:Math.max(0,Math.min(n-1,i))];
 for(let i=0;i<(closed?n:n-1);i++){const p0=g(i-1),p1=g(i),p2=g(i+1),p3=g(i+2);
  c.bezierCurveTo(p1[0]+(p2[0]-p0[0])*t/3,p1[1]+(p2[1]-p0[1])*t/3,p2[0]-(p3[0]-p1[0])*t/3,p2[1]-(p3[1]-p1[1])*t/3,p2[0],p2[1]);}
 if(closed)c.closePath();};
L.fill=(c,P,f,o={})=>{c.save();if(o.blur)c.filter=`blur(${o.blur*BS(c)}px)`;if(o.a!=null)c.globalAlpha=o.a;if(o.op)c.globalCompositeOperation=o.op;
 if(o.clip){L.path(c,o.clip);c.clip();}c.fillStyle=f;L.path(c,P,true,o.t??.5);c.fill();c.restore();};
L.line=(c,P,col,w,o={})=>{c.save();if(o.blur)c.filter=`blur(${o.blur*BS(c)}px)`;if(o.a!=null)c.globalAlpha=o.a;if(o.clip){L.path(c,o.clip);c.clip();}
 c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.lineJoin='round';L.path(c,P,false);c.stroke();c.restore();};
// сужающийся штрих (бровь, веко): точки + толщина в середине
L.taper=(c,P,w,col,o={})=>{const n=P.length,up=[],dn=[];
 for(let i=0;i<n;i++){const a=P[Math.max(0,i-1)],b=P[Math.min(n-1,i+1)];let dx=b[0]-a[0],dy=b[1]-a[1];const d=Math.hypot(dx,dy)||1;
  const k=Math.sin(Math.PI*(o.skew?Math.pow(i/(n-1),o.skew):i/(n-1)))*w/2+(o.min||0);up.push([P[i][0]-dy/d*k,P[i][1]+dx/d*k]);dn.push([P[i][0]+dy/d*k,P[i][1]-dx/d*k]);}
 L.fill(c,up.concat(dn.reverse()),col,o);};
L.lg=(c,x0,y0,x1,y1,st)=>{const g=c.createLinearGradient(x0,y0,x1,y1);st.forEach(([o,col])=>g.addColorStop(o,col));return g;};
L.rg=(c,x,y,r0,r1,st)=>{const g=c.createRadialGradient(x,y,r0,x,y,r1);st.forEach(([o,col])=>g.addColorStop(o,col));return g;};
L.ell=(c,x,y,rx,ry,f,o={})=>{c.save();if(o.blur)c.filter=`blur(${o.blur*BS(c)}px)`;if(o.a!=null)c.globalAlpha=o.a;if(o.clip){L.path(c,o.clip);c.clip();}c.fillStyle=f;c.beginPath();c.ellipse(x,y,rx,ry,o.rot||0,0,7);c.fill();c.restore();};
window.L=L;
