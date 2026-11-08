// Общее для сцен tools/tt_scene/*.html: помощники, фильтры, человек (взрослые пропорции), субтитры, склейка кадров.
const W=1080,H=1920;
const cl=x=>x<0?0:x>1?1:x, sm=x=>{x=cl(x);return x*x*(3-2*x)}, mix=(a,b,k)=>a+(b-a)*k;
const ease=x=>{x=cl(x);return 1-Math.pow(1-x,3)}, easeIn=x=>{x=cl(x);return x*x*x};
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x)}
function camT(fx,fy,cx,cy,s){return `translate(${cx},${cy}) scale(${s}) translate(${-fx},${-fy})`}
const blinkAt=(t,s)=>((t+s)%3.4)<0.12, breath=(t,s)=>Math.sin((t+s)*2.3)*.5+.5;

function rimF(id,a,b,d){return `<filter id="${id}" x="-15%" y="-10%" width="130%" height="120%"><feFlood flood-color="${a}"/><feComposite in2="SourceAlpha" operator="in"/><feOffset dx="${-d}" dy="-2"/><feGaussianBlur stdDeviation="1.3" result="a"/>`+
  `<feFlood flood-color="${b}"/><feComposite in2="SourceAlpha" operator="in"/><feOffset dx="${d}" dy="-2"/><feGaussianBlur stdDeviation="1.3" result="b"/><feMerge><feMergeNode in="a"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`}
const DEFS0=`
 <linearGradient id="low" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05040a" stop-opacity="0"/><stop offset=".45" stop-color="#05040a" stop-opacity=".88"/><stop offset="1" stop-color="#05040a" stop-opacity="1"/></linearGradient>
 <radialGradient id="vig" cx=".5" cy=".42" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".7"/></radialGradient>
 <radialGradient id="redv" cx=".5" cy=".4" r=".7"><stop offset=".35" stop-color="#ff0a2a" stop-opacity="0"/><stop offset="1" stop-color="#ff0a2a" stop-opacity=".75"/></radialGradient>
 <radialGradient id="heartG" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#ff7a86"/><stop offset=".45" stop-color="#e3243d"/><stop offset="1" stop-color="#7a0a1c"/></radialGradient>
 <filter id="b2" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2"/></filter>
 <filter id="b3" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter>
 <filter id="b8" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="8"/></filter>
 <filter id="b16" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="16"/></filter>
 <filter id="b30" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="30"/></filter>
 <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
 <filter id="ink" x="-10%" y="-10%" width="120%" height="120%"><feMorphology in="SourceAlpha" operator="dilate" radius="5" result="d"/><feFlood flood-color="#14110f"/><feComposite in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
 <filter id="ink2" x="-10%" y="-10%" width="120%" height="120%"><feMorphology in="SourceAlpha" operator="dilate" radius="2.2" result="d"/><feFlood flood-color="#14110f"/><feComposite in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
 <filter id="cam" x="0" y="0" width="100%" height="100%"><feGaussianBlur id="camb" stdDeviation="0"/></filter>
 <filter id="dof" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="14"/></filter>`;

// ---------- человек: ноги в (0,0), рост ~770, голова ~1/7 ----------
// o: x,y,s, skin,skin2,hair,top,top2,pants,shoe, look(-1..1), mood n|s|w|t, pose stand|reach|chest|up, k(0..1 позы), bag, blink, br, sweat,
//    sil (цвет силуэта — без лица и теней), ink (контур), rim (id фильтра), flip
function person(o){
  const S=o.sil, col=v=>S||v, k=o.k==null?1:o.k, pose=o.pose||'stand';
  const ink=o.ink?` stroke="#14110f" stroke-width="${o.ink}" stroke-linejoin="round" stroke-linecap="round"`:'';
  const shade=(d,op)=>S?'':`<path d="${d}" fill="#000" opacity="${op}"/>`;
  let s=`<g transform="translate(${o.x},${o.y}) scale(${(o.flip?-1:1)*o.s},${o.s})">`;
  if(!o.noShadow)s+=`<ellipse cx="0" cy="0" rx="110" ry="18" fill="#000" opacity="${o.shOp||.5}" filter="url(#b8)"/>`;
  s+=`<g ${o.rim?`filter="url(#${o.rim})"`:o.ink?`filter="url(#${o.inkF||'ink'})"`:''}>`;
  // ноги
  const legL='M-60,-364 C-62,-250 -56,-150 -50,-40 L-14,-40 C-12,-150 -8,-262 -3,-364 Z', legR='M3,-364 C8,-262 12,-150 14,-40 L50,-40 C56,-150 62,-250 60,-364 Z';
  s+=`<path d="${legL}" fill="${col(o.pants)}"${ink}/><path d="${legR}" fill="${col(o.pants)}"${ink}/>`+shade(legR,.22)+shade('M-30,-364 L-3,-364 C-8,-262 -12,-150 -14,-40 L-26,-40 Z',.12);
  s+=`<path d="M-74,-44 h58 a14,14 0 0 1 14,14 v16 a14,14 0 0 1 -14,14 h-62 a10,10 0 0 1 -8,-14 z" fill="${col(o.shoe)}"${ink}/><path d="M16,-44 h58 a12,12 0 0 1 10,16 l-4,14 a14,14 0 0 1 -14,14 h-50 a14,14 0 0 1 -14,-14 v-16 a14,14 0 0 1 14,-14 z" fill="${col(o.shoe)}"${ink}/>`;
  if(!S)s+=`<rect x="-80" y="-10" width="76" height="8" rx="4" fill="#000" opacity=".18"/><rect x="4" y="-10" width="76" height="8" rx="4" fill="#000" opacity=".25"/>`;
  // верх тела (дышит)
  s+=`<g transform="translate(0,${-(o.br||0)*5})">`;
  const torso='M-74,-602 C-84,-598 -92,-586 -92,-566 L-84,-374 C-84,-360 -74,-352 -60,-352 L60,-352 C74,-352 84,-360 84,-374 L92,-566 C92,-586 84,-598 74,-602 C52,-612 28,-616 0,-616 C-28,-616 -52,-612 -74,-602 Z';
  const arm=(pts,shd)=>{const d='M'+pts.map(p=>p.join(',')).join(' L');
    return `<path d="${d}" stroke="${col(o.top)}" stroke-width="34" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`+
      (o.ink?`<path d="${d}" stroke="#14110f" stroke-width="${34+o.ink*2}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>`:'')+
      (shd&&!S?`<path d="${d}" stroke="#000" stroke-opacity=".2" stroke-width="34" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`:'');};
  const hand=(x,y,r)=>`<ellipse cx="${x}" cy="${y}" rx="13" ry="16" transform="rotate(${r||0} ${x} ${y})" fill="${col(o.skin)}"${ink}/>`;
  // руки позади торса (поднятые)
  let front='';
  const L0=[-78,-588], R0=[78,-588];
  const Lst=[[-78,-588],[-96,-476],[-92,-382]], Rst=[[78,-588],[96,-476],[92,-382]];
  const lerpP=(a,b)=>a.map((p,i)=>[mix(p[0],b[i][0],k),mix(p[1],b[i][1],k)]);
  let L=Lst, R=Rst, LH=null, RH=null;
  if(pose==='reach'){L=lerpP(Lst,[[-78,-588],[-150,-500],[-226,-520]]);}
  if(pose==='chest'){R=lerpP(Rst,[[78,-588],[104,-486],[22,-528]]);}
  if(pose==='up'){const w=(o.wave||0)*14;L=lerpP(Lst,[[-78,-588],[-128,-690],[-110+w,-810]]);R=lerpP(Rst,[[78,-588],[128,-690],[110-w,-810]]);}
  if(pose==='up')s+=arm(L,false)+hand(L[2][0],L[2][1]-10)+arm(R,true)+hand(R[2][0],R[2][1]-10);
  s+=`<ellipse cx="0" cy="-606" rx="54" ry="16" fill="${col(o.top2)}"/>`;
  s+=`<path d="${torso}" fill="${col(o.top)}"${ink}/>`;
  if(!S){s+=`<clipPath id="tc${o.id}"><path d="${torso}"/></clipPath><g clip-path="url(#tc${o.id})"><rect x="34" y="-620" width="70" height="280" fill="#000" opacity=".2"/>`+
     `<rect x="-90" y="-620" width="22" height="280" fill="#fff" opacity=".06"/><rect x="-90" y="-378" width="190" height="26" fill="#000" opacity=".18"/>`+
     `<path d="M-48,-470 L48,-470 L56,-410 L-56,-410 Z" fill="#000" opacity=".12"/></g>`;
    s+=`<path d="M-14,-600 L-17,-548 M14,-600 L17,-548" stroke="#ecebf2" stroke-width="3.5" stroke-linecap="round"/>`;}
  if(pose!=='up'){
    if(pose==='reach'){front+=arm(L,false); if(o.bag&&k>.6)front+=bagS(L[2][0]-18,L[2][1]-20,-10,.62); front+=hand(L[2][0],L[2][1],-60);}
    else s+=arm(L,false)+hand(L[2][0],L[2][1]+12);
    if(pose==='chest')front+=arm(R,true)+hand(R[2][0],R[2][1],50); else s+=arm(R,true)+hand(R[2][0],R[2][1]+12);
  }
  // шея и голова
  s+=`<rect x="-15" y="-646" width="30" height="46" rx="8" fill="${col(o.skin2)}"/>`;
  const head='M0,-748 C30,-748 47,-724 47,-693 C47,-664 35,-640 19,-632 C10,-627 -10,-627 -19,-632 C-35,-640 -47,-664 -47,-693 C-47,-724 -30,-748 0,-748 Z';
  s+=`<ellipse cx="-46" cy="-688" rx="7" ry="11" fill="${col(o.skin2)}"/><ellipse cx="46" cy="-688" rx="7" ry="11" fill="${col(o.skin2)}"/>`;
  s+=`<path d="${head}" fill="${col(o.skin)}"${ink}/>`;
  if(!S){s+=`<clipPath id="hc${o.id}"><path d="${head}"/></clipPath><g clip-path="url(#hc${o.id})"><ellipse cx="40" cy="-690" rx="26" ry="70" fill="#000" opacity=".1"/></g>`;}
  s+=`<path d="${o.hairD||'M-51,-690 C-56,-742 -24,-768 8,-766 C44,-764 62,-736 52,-690 C48,-712 40,-724 24,-728 C10,-716 -18,-714 -36,-724 C-42,-712 -47,-702 -51,-690 Z'}" fill="${col(o.hair)}"${ink}/>`;
  if(!S){
    const lk=(o.look||0)*3.2, md=o.mood||'n';
    if(o.sweat)s+=`<g opacity="${o.sweat}" fill="#cfeeff" stroke="#8cc3e4" stroke-width="1.5"><path d="M40,-724 q6,11 0,16 q-6,-5 0,-16z"/><path d="M-42,-712 q5,9 0,13 q-5,-4 0,-13z"/></g>`;
    const by=md==='w'?[[-8,-710,-27,-704],[8,-710,27,-704]]:md==='t'?[[-8,-702,-27,-709],[8,-702,27,-709]]:[[-8,-706,-27,-705],[8,-706,27,-705]];
    for(const b of by)s+=`<path d="M${b[0]},${b[1]} L${b[2]},${b[3]}" stroke="${o.hair}" stroke-width="4" stroke-linecap="round"/>`;
    for(const ex of [-17,17]){
      if(o.blink){s+=`<path d="M${ex-8},-690 Q${ex},-685 ${ex+8},-690" stroke="#1b1720" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;continue}
      const pr=o.pup||4.2;
      s+=`<ellipse cx="${ex}" cy="-691" rx="8" ry="6.6" fill="#fff"/><circle cx="${ex+lk}" cy="-690.5" r="${pr}" fill="#1b1720"/><circle cx="${ex+lk-1.4}" cy="-692" r="1.3" fill="#fff"/>`+
         `<path d="M${ex-8.5},-692 Q${ex},-699 ${ex+8.5},-692" stroke="#1b1720" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    }
    s+=`<path d="M1,-688 Q6,-676 -1,-672" stroke="${o.skin2}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    s+=`<circle cx="-27" cy="-671" r="6.5" fill="#ff7a8c" opacity=".22"/><circle cx="27" cy="-671" r="6.5" fill="#ff7a8c" opacity=".22"/>`;
    const mc='#6b2a2e';
    if(md==='s')s+=`<path d="M-11,-660 Q0,-650 11,-660" stroke="${mc}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;
    else if(md==='w')s+=`<path d="M-9,-655 Q-4,-659 0,-656 Q5,-653 9,-657" stroke="${mc}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    else if(md==='t')s+=`<rect x="-11" y="-662" width="22" height="9" rx="3" fill="#fff" stroke="${mc}" stroke-width="2"/><path d="M-11,-657.5 H11" stroke="${mc}" stroke-width="1.3"/>`;
    else if(md==='o')s+=`<ellipse cx="0" cy="-656" rx="5" ry="6" fill="${mc}"/>`;
    else s+=`<path d="M-8,-657 Q0,-655 8,-657" stroke="${mc}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  }
  s+=front;
  return s+'</g></g></g>';
}
function bagS(x,y,r,s){
  return `<g transform="translate(${x},${y}) rotate(${r}) scale(${s})"><rect x="-58" y="-74" width="116" height="140" rx="10" fill="#ffffff" opacity=".9"/>`+
   `<rect x="-58" y="-74" width="116" height="18" rx="6" fill="#ff4f7a"/><path d="M-46,30 Q-10,0 46,28 L46,54 L-46,54 Z" fill="#f2eef6"/>`+
   `<rect x="-58" y="-74" width="116" height="140" rx="10" fill="none" stroke="#cfc8da" stroke-width="5"/><path d="M-42,-46 L-36,40" stroke="#fff" stroke-width="7" opacity=".7" stroke-linecap="round"/></g>`;
}
const HEART='M0,90 C-40,30 -150,20 -150,-60 C-150,-130 -90,-170 -40,-160 C-15,-155 0,-135 0,-115 C0,-135 15,-155 40,-160 C90,-170 150,-130 150,-60 C150,20 40,30 0,90 Z';

// ---------- субтитры ----------
function capHTML(b,k){
  const ws=b.cap.split(' '), n=ws.length, shown=Math.min(n,Math.floor(k*n/0.62)+1);
  return ws.map((w,i)=>{let c='';if(/^\*.*\*[,.:?]?$/.test(w)){c='y';w=w.replace(/\*/g,'')}else if(/^!.*![,.:?]?$/.test(w)){c='r';w=w.replace(/!/g,'')}
    return `<i class="${i<shown?'on ':''}${c}">${w}</i>`}).join(' ');
}
const wordK=(b,i)=>i*0.62/b.cap.split(' ').length;

// ---------- склейка: BEATS = [{d, cap, clock, bpm:[a,b], f(t,lt,k,d), tin, tout}] ----------
const FX={};
function run(BEATS,opt){
  opt=opt||{};
  let acc=0; for(const b of BEATS){b.t0=acc; acc+=b.d}
  window.DUR=acc+0.3;
  const sv=document.getElementById('sv'), cap=document.getElementById('cap'), clock=document.getElementById('clock'),
    bpmEl=document.getElementById('bpm'), pulse=document.getElementById('pulse'), card=document.getElementById('card');
  let lastCap='';
  window.R=function(tt){
    let bi=BEATS.length-1; for(let i=0;i<BEATS.length;i++)if(tt<BEATS[i].t0+BEATS[i].d){bi=i;break}
    const b=BEATS[bi], lt=tt-b.t0, k=cl(lt/b.d);
    FX.blur=0; FX.red=0; FX.over='';
    const body=b.f(tt,lt,k,b.d);
    const tin=b.tin||'blur', tout=b.tout||(bi<BEATS.length-1?(BEATS[bi+1].tin||'blur'):'none');
    const inA=1-ease(cl(lt/.26)), outA=ease(cl((lt-(b.d-.3))/.3));
    const bIn=tin==='blur'&&bi>0?18*(1-cl(lt/.16)):0, bOut=tout==='blur'?18*(1-cl((b.d-lt)/.14)):0;
    const pop=tin==='blur'&&bi>0?1+.05*(1-ease(cl(lt/.16))):1;
    let over=FX.over;
    const fl=Math.max(tin==='flash'?inA:0, tout==='flash'?cl((lt-(b.d-.18))/.18):0);
    if(fl>0)over+=`<rect width="1080" height="1920" fill="${opt.flash||'#fff'}" opacity="${fl}"/>`;
    const rd=Math.max(FX.red, tin==='red'?inA*.9:0, tout==='red'?outA*.9:0); if(rd>0)over+=`<rect width="1080" height="1920" fill="#ff1030" opacity="${rd}" style="mix-blend-mode:screen"/>`;
    sv.innerHTML=`<defs>${DEFS0}${opt.defs||''}</defs><g filter="url(#cam)"><g transform="translate(540,960) scale(${pop}) translate(-540,-960)">${body}</g></g>`+over+(opt.top?opt.top(bi,tt):'');
    document.getElementById('camb').setAttribute('stdDeviation',Math.min(18,Math.max(FX.blur,bIn,bOut)).toFixed(1));
    const c=capHTML(b,k); if(c!==lastCap){cap.innerHTML=c;lastCap=c}
    const capIn=ease(cl(lt/.18)); cap.style.transform=`translateY(${(1-capIn)*30}px) scale(${.96+.04*capIn})`; cap.style.opacity=capIn*cl((window.DUR-tt)/.3);
    if(clock)clock.textContent=b.clock;
    if(bpmEl){const v=Math.round(mix(b.bpm[0],b.bpm[1],sm(k))); bpmEl.textContent=v; pulse.classList.toggle('hot',v>=100);}
    if(card){const ci=bi===0?ease(cl((tt-.7)/.35)):0, co=bi===0?cl((b.d-.45-lt)/.2):0;
      card.style.opacity=ci*co; card.style.transform=`translateX(${(1-ci)*-60}px) rotate(${(1-ci)*-4-1.5}deg)`;}
  };
  window.R(0);
}

// ---------- герои и общий сценарий для сравнения стилей ----------
const DIMA={id:'d',skin:'#f0c4a0',skin2:'#d49e7c',hair:'#2e1f19',top:'#3e59b5',top2:'#2a3f85',pants:'#232838',shoe:'#eceaf2'};
const DRUG={id:'f',skin:'#dcae88',skin2:'#bf8c69',hair:'#141215',top:'#b8394a',top2:'#83242f',pants:'#2b2a31',shoe:'#2f2d36',
  hairD:'M-51,-692 C-54,-746 -20,-770 10,-768 C42,-766 60,-742 52,-692 C50,-716 42,-736 8,-736 C-26,-736 -44,-716 -51,-692 Z'};
const SCRIPT=[
  {d:3.4, cap:'Диме 23. Сегодня он впервые попробует *кокаин.*', clock:'ПЯТНИЦА · 23:12', bpm:[70,72]},
  {d:3.4, cap:'Друг суёт *пакетик:* «Да один раз».', clock:'ПЯТНИЦА · 23:41', bpm:[74,78]},
  {d:3.0, cap:'Но !сердце! уже колотится.', clock:'ПЯТНИЦА · 23:49', bpm:[110,131]},
  {d:3.6, cap:'В первый час риск !инфаркта! выше в !24! раза.', clock:'СУББОТА · 00:40', bpm:[134,138]},
];
function beats(shots,extra){return SCRIPT.map((b,i)=>Object.assign({},b,{f:shots[i]},(extra||[])[i]||{}))}
const rain=(t,n,col,op,sp)=>{let s='';for(let i=0;i<n;i++){const x=(rnd(i+500)*1400-160+t*-260)%1400, y=(rnd(i+600)*2000+t*(sp||1500))%2000-80, L=36+rnd(i+700)*30;
  s+=`<path d="M${(x+1400)%1400-160},${y} l${-L*.22},${L}" stroke="${col}" stroke-width="${1.5+rnd(i+800)*1.5}" opacity="${op*(.6+rnd(i+900)*.6)}"/>`;}return s};
