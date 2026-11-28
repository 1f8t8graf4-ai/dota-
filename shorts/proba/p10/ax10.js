"use strict";
/* Герои Духless по кадрам фильма (28.11): лист «кадр — рисунок». Фото только для сверки, в git их нет.
   node render.mjs ax10 cast <папка> shots 1  (P10A=<папка с misha_max.png, vadim.png, boss.png, lyosha.png, kz.jpg, vokzal.png>) */
const IM={};
CLIP.init=async()=>{for(const k of ['misha_max.png','vadim.png','boss.png','lyosha.png','kz.jpg','vokzal.png'])try{IM[k]=await loadImg('/a/'+k);}catch(e){}};
function refCrop(c,im,sx,sy,sw,sh,x,y,w,h){if(!im)return;c.save();c.beginPath();c.rect(x,y,w,h);c.clip();const k=Math.max(w/sw,h/sh);c.drawImage(im,sx,sy,sw,sh,x+(w-sw*k)/2,y+(h-sh*k)/2,sw*k,sh*k);c.restore();
  c.strokeStyle='rgba(255,255,255,.4)';c.lineWidth=2;c.strokeRect(x,y,w,h);}
const CAST=[
 {n:'МИША',ref:['misha_max.png',95,40,190,230],f:'misha',e:'smirk',cloth:{k:'shirt',shirt:'#eef4f3'},bg:['#9ec2c4','#2c4448'],light:'#e8fbff'},
 {n:'МАКС',ref:['kz.jpg',0,0,0,0],f:'max',e:'smirk',cloth:{k:'suit',jacket:'#1c1e25',shirt:'#e9e6e0',tie:null},bg:['#5b4a6a','#151018'],light:'#ffc27a'},
 {n:'ВАДИМ',ref:['vadim.png',140,0,230,254],f:'vadim',e:'neutral',cloth:{k:'suit',jacket:'#262a33',shirt:'#dfe6f0',tie:'#2c3e66'},bg:['#8f99a3','#22282f'],light:'#dbe8ff'},
 {n:'ШЕФ',ref:['boss.png',0,0,260,284],f:'boss',e:'neutral',cloth:{k:'suit',jacket:'#2a2a2e',shirt:'#e8eaee',tie:'#5a1e22'},bg:['#c9b08a','#2a1e14'],light:'#fff1d8'},
 {n:'ЛЁША',ref:['lyosha.png',130,20,330,420],f:'lyosha',e:'neutral',cloth:{k:'flannel'},bg:['#dfe7e6','#5e6e6e'],light:'#ffffff'},
 {n:'ЮЛЯ',ref:['vokzal.png',0,0,0,0],f:'yulia',e:'neutral',cloth:{k:'parka',col:'#6e7c4a'},bg:['#5a2230','#170a10'],light:'#ffb0c0'}];
CLIP.draw=(c,t)=>{c.fillStyle='#0b0c10';c.fillRect(0,0,WW,HH);
  CAST.forEach((h,i)=>{const col=i%2,row=Math.floor(i/2),x0=col*540,y0=row*640;
    c.fillStyle=LG(c,0,y0,0,y0+640,[[0,h.bg[0]],[1,h.bg[1]]]);c.fillRect(x0,y0,540,640);
    const im=IM[h.ref[0]];if(im){const [k,sx,sy,sw,sh]=h.ref;refCrop(c,im,sx,sy,sw||im.width,sh||im.height,x0+12,y0+12,170,210);}
    personA(c,{f:h.f,x:x0+330,y:y0+300,s:1.05,L:-1,light:h.light,la:.25,e:h.e,cloth:h.cloth,sw:124,bt:420});
    c.fillStyle='#fff';c.font='700 34px Osw';c.fillText(h.n,x0+20,y0+610);});};
