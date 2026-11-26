/* «Духless»: общая карусель для всех вариантов. Zara drip → Money drip → Moscow vibe (клип из фильма Андрея, 91 кадр, /a/mv/v001.jpg…).
   До DC.T0 рисует карусель; дальше клип варианта получает «старое» время DC.map(t): 3,5 → 10 растягивается на T0 → 10. */
const DC=(function(){
  const PH=[null,null],VF=[],NV=91,CAP=['Zara drip','Money drip','Moscow vibe'];
  const S1=0.9,S2=1.9,SWD=0.22,V0=S2+SWD,VEND=V0+NV/30,T0=VEND-0.3;   // клип 2,12–5,15; переход начинается за 0,3 с до его конца
  const VY=458,VH=1005,CROP=536;                                         // квадрат 576×576 без полосы с водяным знаком снизу
  const sS=t=>1.02+0.035*clamp(t/VEND);
  function photo(c,i,x,t){const im=PH[i],k=Math.max(W/im.width,H/im.height)*sS(t),w=im.width*k,h=im.height*k,jx=2.2*sn(t*0.8+i*5,1),jy=2*sn(t*0.8+i*5+3,2);
    c.drawImage(im,x+(W-w)/2+jx,(H-h)/2+jy,w,h);txt(c,CAP[i],x+W/2,330,{font:'600 82px Man',shadow:'rgba(0,0,0,0.55)',sb:14,sy:3});}
  function vf(t){return VF[clamp(Math.round((t-V0)*30),0,NV-1)];}
  function video(c,x,t,o){o=o||{};const f=vf(t);c.save();
    reset(SBX);SBX.clearRect(0,0,270,480);SBX.filter='blur(7px) brightness(0.5) saturate(0.85)';SBX.drawImage(f,0,0,CROP,CROP,-105,0,480,480);SBX.filter='none';
    if(o.flt)c.filter=o.flt;c.drawImage(SB,x,0,W,H);c.imageSmoothingQuality='high';c.drawImage(f,0,0,576,CROP,x,VY,W,VH);c.filter='none';
    c.strokeStyle='rgba(255,255,255,0.08)';c.lineWidth=2;c.strokeRect(x+1,VY,W-2,VH);c.restore();
    const ca=o.capA===undefined?1:o.capA;if(ca>0)txt(c,CAP[2],x+W/2,330,{font:'600 82px Man',shadow:'rgba(0,0,0,0.55)',sb:14,sy:3,a:ca});}
  function dots(c,act,al){if(al<=0)return;c.save();c.globalAlpha=al;for(let i=0;i<3;i++){c.fillStyle=i===act?'#FFFFFF':'rgba(255,255,255,0.42)';ell(c,W/2-26+i*26,1590,7,7);c.fill();}c.restore();}
  function draw(c,t){
    if(t<S1){photo(c,0,0,t);dots(c,0,1);return;}
    if(t<S1+SWD){const k=E.outC((t-S1)/SWD);photo(c,0,-W*k,t);photo(c,1,W*(1-k),t);dots(c,k>0.5?1:0,1);return;}
    if(t<S2){photo(c,1,0,t);dots(c,1,1);return;}
    if(t<V0){const k=E.outC((t-S2)/SWD);photo(c,1,-W*k,t);video(c,W*(1-k),V0);dots(c,k>0.5?2:1,1);return;}
    video(c,0,t);dots(c,2,1);}
  async function init(){PH[0]=await loadImg('/s/proba/dl_open/_media/p1.webp');PH[1]=await loadImg('/s/proba/dl_open/_media/p2.webp');
    const L=await Promise.all(Array.from({length:NV},(_,i)=>loadImg(`/a/mv/v${String(i+1).padStart(3,'0')}.jpg`)));L.forEach((im,i)=>VF[i]=im);
    if(VF.some(v=>!v))throw new Error('нет кадров клипа /a/mv');}
  return {CAP,init,draw,video,dots,T0,VEND,zpt:()=>[330*W/576,VY+330*VH/CROP],map:t=>3.5+(t-T0)*6.5/(10-T0)};
})();
