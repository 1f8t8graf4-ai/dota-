/* ================= v11 · Игры (26.10, отзыв на v9 — заново, на максимуме) ================= */
Object.assign(ICO,{
 map11:'<path d="M3 6.5l6-2.5 6 2.5 6-2.5v13.5l-6 2.5-6-2.5-6 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
 cube11:'<path d="M12 2.8l8 4.6v9.2l-8 4.6-8-4.6V7.4z"/><path d="M4 7.4l8 4.6 8-4.6M12 12v9.2"/>',
 book11:'<path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5z"/><path d="M12 6.5v13"/>',
 deep11:'<path d="M12 3.2l8.5 4.6-8.5 4.6-8.5-4.6z"/><path d="M3.5 12.2l8.5 4.6 8.5-4.6"/><path d="M3.5 16.6l8.5 4.6 8.5-4.6"/>',
 starf:'<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z" fill="currentColor"/>',
 users11:'<circle cx="9" cy="8.5" r="3.3"/><path d="M3 19.5c.8-3.3 3.2-5.2 6-5.2s5.2 1.9 6 5.2"/><path d="M15.5 5.3a3.3 3.3 0 0 1 0 6.4M17.6 14.6c1.6.8 2.6 2.5 3 4.9"/>',
 film11:'<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3 9h18M8 5l1.5 4M14 5l1.5 4"/>',
 mute11:'<path d="M4 9.5h4l5-4v13l-5-4H4z"/><path d="M17 9.5l4 5M21 9.5l-4 5"/>'});

/* --- голоса героев: настоящие реплики из игры (те же mp3, что в R2), в макете — вшиты --- */
const AU11={'venator-07':'ven-not-merciful','venator-17':'ven-no-hide'};
const DUR11={'rat-king-14':2.95,'rat-king-15':2.41,'rat-king-18':3.35,'rat-king-19':2.38,'rat-king-21':2.41,'rat-king-23':2.7,'rk-hail-marys':2.88,'rk-holier':2.77,'rk-king-here':2.99,'rk-priest-vs-king':2.59,'rk-sewers':4.82,'rk-took-down':1.8,'ven-die-monster':1.84,'ven-evil-dies':2.34,'ven-evil-stirs':4.5,'ven-no-hide':2.34,'ven-not-merciful':3.56,'ven-will-find':1.44,'venator-08':3.46,'venator-09':3.02,'venator-14':1.44,'venator-21':1.66};
const AUU={};
function aurl(k){k=AU11[k]||k;if(AUU[k])return AUU[k];const s=A.A&&A.A[k];if(!s)return null;try{const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);AUU[k]=URL.createObjectURL(new Blob([u],{type:'audio/mpeg'}))}catch(e){AUU[k]='data:audio/mpeg;base64,'+s}return AUU[k]}
let AUcur=null;
// играет реплику; mute — только «волна» (демо без касания не шумит); end — по окончании
function voice11(ctx,k,o){o=o||{};k=AU11[k]||k;if(AUcur){try{AUcur.pause()}catch(e){}AUcur=null}const d=(DUR11[k]||2.4)*1000;let done=false;const fin=()=>{if(done)return;done=true;o.end&&o.end()};
 const u=aurl(k);if(u&&!o.mute){const a=new Audio(u);a.volume=.95;AUcur=a;a.onended=fin;const p=a.play();if(p&&p.catch)p.catch(()=>{});ctx.add(()=>{try{a.pause()}catch(e){}})}
 ctx.t(fin,d+150);return d}
const wv11=(n,cl)=>`<span class="g11-wv${cl?' '+cl:''}">${Array.from({length:n},(_,i)=>`<i style="--h:${(.3+.7*Math.abs(Math.sin(i*1.9+.6))).toFixed(2)};animation-delay:${(-i*.07).toFixed(2)}s"></i>`).join('')}</span>`;
// кнопка ▶ с волной: тап — голос, волна бежит, пока звучит
function voiceBtn11(ctx,btn,k,R){ctx.on(btn,'click',e=>{e.stopPropagation();const w=btn.closest('[data-vw]')||btn;w.classList.add('spk');an(btn,[{transform:'scale(.82)'},{transform:'none'}],{sp:SPb});voice11(ctx,k,{end(){w.classList.remove('spk')}})})}

/* --- данные: главы комиксов у героев, фразы с голосом --- */
const G11H={venator:{v:'hv_venator2',pos:'50% 30%',lv:2,xp:340,nx:500,tag:'Священник-охотник Ватикана',ph:25,ac:'#E23A4E'},rat:{v:'hv_rat3',pos:'50% 34%',lv:1,xp:180,nx:300,tag:'Крысиный босс мафии',ph:21,ac:'#8FCB4F'}};
const G11CH={
 venator:[{t:'Охота объявлена',w:'rat',ab:'Ватикан послал Венатора в канализацию за Крысиным королём.',n:5,st:'done',min:1},
  {t:'Проповедь свинца',w:'rat',ab:'Драка: Венатор читает проповедь и стреляет, Король дразнит его молитвами.',n:7,st:'chk',min:1},
  {t:'Тяжела корона',w:'rat',ab:'Король жалуется, как тяжело быть королём крыс. Венатор зовёт его на бой.',n:5,st:'new',min:1},
  {t:'Добрый пастырь',w:'rem',ab:'Рэм не верит, что поп может быть добрым.',n:8,st:'lock'}],
 rat:[{t:'Охота объявлена',w:'venator',ab:'В туннели Короля спустился поп с ружьём.',n:5,st:'done',min:1},
  {t:'Проповедь свинца',w:'venator',ab:'Король дразнит Венатора молитвами и хвастается, что уложил охотника.',n:7,st:'chk',min:1},
  {t:'Тяжела корона',w:'venator',ab:'Быть королём крыс — это работа. Важные дела! Крысиные!',n:5,st:'new',min:1},
  {t:'Знакомься, это Валери',w:'victor',ab:'Король сватает Виктору свою крысу.',n:8,st:'lock'}]};
const G11PH={venator:[['ven-not-merciful','The Lord is merciful... I am not.','Господь милосерден… а вот я — нет.','подкол'],['venator-09','God forgives. I do not.','Бог прощает. Я — нет.','угроза'],['venator-14','Picked the wrong fight!','Не на того нарвался!','подкол'],['ven-no-hide',"You can't hide from a Venator.",'От Венатора не спрячешься.','угроза'],['venator-21',"The work doesn't come cheap.",'Такая работа дёшево не стоит.','идиома'],['venator-08','Today... nine Commandments will have to do.','Сегодня обойдёмся девятью заповедями.','шутка']],
 rat:[['rat-king-14','We do this on my time, ya crumbum.','Делаем это, когда я скажу, мелюзга.','подкол'],['rat-king-15','No one rushes the king.','Короля не торопят.','подкол'],['rat-king-18',"Who's exterminating who now!",'Ну и кто теперь кого травит?!','игра слов'],['rat-king-19','Get outta my face, pal!','Сгинь с глаз моих, приятель!','идиома'],['rat-king-21','Eat dirt, crumbum.','Жри землю, мелюзга.','подкол'],['rat-king-23',"How's your streak lookin' now, pal?",'Ну и как там твоя серия, приятель?','шутка']]};
// настоящие голоса вместо синтеза браузера: если реплика записана — играет запись (во всех версиях комикса)
const n11=t=>String(t).toLowerCase().replace(/[^a-z' ]/g,' ').replace(/\s+/g,' ').trim();
const AUTX={};
const INS11={venator:'Венатором',rat:'Королём',rem:'Рэмом',victor:'Виктором',talon:'Талоном',celeste:'Селестой'},GEN11={venator:'Венатора',rat:'Короля',rem:'Рэма',victor:'Виктора',talon:'Талона',celeste:'Селесты'};
const G11TAG={'подкол':'#F2C14E','угроза':'#FF6B6B','идиома':'#2EE6C5','шутка':'#B38CFF','игра слов':'#6FB7FF'};
[['ven-evil-stirs','Evil stirs in New York... and so the Vatican has called on me.'],['rk-sewers',"I thought I said you weren't supposed to show your face in the sewers again?!"],['ven-no-hide',"You can't hide from a Venator."],['rk-priest-vs-king',"What's a priest gonna do to a king?!"],['ven-will-find','I will find you.'],['ven-not-merciful','The Lord is merciful... I am not.'],['rk-holier','Holier than thou, crumbum!'],['ven-die-monster','Die, monster!'],['rk-hail-marys',"Go do some Hail Marys or somethin'."],['ven-evil-dies','Evil dies today.'],['rk-took-down','Took down the Venatah!'],['rk-king-here','The rat king is here!']]
 .concat(...Object.values(G11PH).map(L=>L.map(p=>[p[0],p[1]]))).forEach(([k,x])=>{AUTX[n11(x)]=k});
{const say0=say;say=function(x,o){o=o||{};const k=AUTX[n11(x)];if(k&&aurl(k)){try{speechSynthesis.cancel()}catch(e){}voice11({t:(f,ms)=>setTimeout(f,ms),add(){}},k,{end:o.end});return true}return say0(x,o)}}

/* --- живые фоны героев v11: тот же рисунок, движение заметно, но лайтово (только сдвиг и прозрачность) --- */
function heroBg11(k){let s=heroBg(k);const h=HERO[k]||HERO.rem,g=h.c2,c=h.c1;let x='';
 if(k==='venator'){s=s.replace(`<g fill="none" stroke="${g}" stroke-width="1.1" opacity=".5">`,`<g class="h11-rose" fill="none" stroke="${g}" stroke-width="1.1" opacity=".5">`);
  x=`<g class="h11-rays">${[-16,0,16].map((a,i)=>`<path d="M90 96 L${(90+Math.sin((a-7)*Math.PI/180)*440).toFixed(0)} ${(96+Math.cos((a-7)*Math.PI/180)*440).toFixed(0)} L${(90+Math.sin((a+7)*Math.PI/180)*440).toFixed(0)} ${(96+Math.cos((a+7)*Math.PI/180)*440).toFixed(0)}Z" fill="${g}" style="animation-delay:${-i*2.3}s"/>`).join('')}</g>
  <g class="h11-du" fill="${g}">${Array.from({length:16},(_,i)=>`<circle cx="${(30+(i*47)%120)}" cy="${(170+(i*61)%220)}" r="${(.7+(i%3)*.45).toFixed(2)}" style="animation-delay:${(-i*.9).toFixed(1)}s;animation-duration:${(6+(i%4)*1.6).toFixed(1)}s"/>`).join('')}</g>
  <g class="h11-cn" fill="#FFB547">${[[16,392],[164,392]].map(([cx,cy],i)=>`<ellipse cx="${cx}" cy="${cy}" rx="3" ry="7" style="animation-delay:${-i*.4}s"/>`).join('')}</g>`}
 else if(k==='rat')x=`<g class="h11-w1" fill="none" stroke="${g}" stroke-width="1.3" opacity=".42"><path d="${WV9(360,400,334,3,12,1)}"/><path d="${WV9(360,400,362,2.2,16,1)}" opacity=".7"/></g>
  <g class="h11-w2" fill="none" stroke="${g}" stroke-width=".9" opacity=".3"><path d="${WV9(360,400,348,2.6,14,1)}"/><path d="${WV9(360,400,378,2,18,1)}"/></g>
  <g class="h11-dp" fill="${g}">${[[46,'0s'],[104,'-1.9s'],[140,'-3.1s']].map(([x0,dl])=>`<g style="animation-delay:${dl}"><path class="dr" d="M${x0} 108 q2.6 5.4 0 7.6 q-2.6 -2.2 0 -7.6z" style="animation-delay:${dl}"/><ellipse class="rp" cx="${x0}" cy="340" rx="13" ry="3.2" fill="none" stroke="${g}" stroke-width="1" style="animation-delay:${dl}"/><ellipse class="rp b" cx="${x0}" cy="340" rx="13" ry="3.2" fill="none" stroke="${g}" stroke-width=".7" style="animation-delay:${dl}"/></g>`).join('')}</g>
  <ellipse class="h11-hz" cx="90" cy="300" rx="120" ry="40" fill="${c}" opacity=".16"/>`;
 else if(k==='talon'){let tn=0;s=s.replace(/<g fill="([^"]+)" opacity="(\.25|\.45|\.9)">/g,(m,f,o)=>{tn++;return `<g class="h11-tr" fill="${f}" opacity="${o}" style="animation-delay:${(-tn*1.7).toFixed(1)}s;animation-duration:${(6+tn*1.3).toFixed(1)}s">`});
  x=`<circle class="h11-mh" cx="60" cy="90" r="40" fill="${g}" opacity=".12"/>
  <g class="h11-br l" fill="${c}"><path d="M-12 -4 Q44 28 32 74 Q22 42 -12 48Z" opacity=".85"/>${[0,1,2,3,4,5].map(i=>`<ellipse cx="${4+i*7}" cy="${16+i*9}" rx="9" ry="3.6" transform="rotate(${28+i*8} ${4+i*7} ${16+i*9})"/>`).join('')}</g>
  <g class="h11-br r" fill="${c}"><path d="M192 6 Q138 40 150 88 Q160 54 192 60Z" opacity=".85"/>${[0,1,2,3,4,5].map(i=>`<ellipse cx="${176-i*6}" cy="${26+i*10}" rx="9" ry="3.6" transform="rotate(${-28-i*8} ${176-i*6} ${26+i*10})"/>`).join('')}</g>
  <g class="h11-lf" fill="${g}">${[24,70,112,150,48,132].map((x0,i)=>`<path d="M${x0} -12 q4 -5.5 9 0 q-5 5.5 -9 0z" style="animation-delay:${(-i*1.6).toFixed(1)}s;animation-duration:${(7.5+i%3*2.2).toFixed(1)}s"/>`).join('')}</g>
  <g class="h11-ff" fill="#E9F98A">${[[30,270],[150,250],[96,300],[60,220],[132,320]].map(([cx,cy],i)=>`<circle cx="${cx}" cy="${cy}" r="1.6" style="animation-delay:${(-i*1.1).toFixed(1)}s"/>`).join('')}</g>`}
 else if(k==='rem')x=`<g class="h11-cl a" fill="${c}" opacity=".28"><path d="M-40 300 q24 -20 50 -6 q20 -22 46 -4 q24 -10 40 8 v40 h-136z"/><path d="M110 270 q20 -16 42 -4 q18 -18 40 0 q20 -6 30 10 v40 h-112z"/></g>
  <g class="h11-cl b" fill="${g}" opacity=".08"><path d="M-20 160 q30 -18 60 -2 q26 -16 52 0 v24 h-112z"/><path d="M100 120 q22 -14 46 -2 q20 -12 40 4 v20 h-86z"/></g>
  <g class="h11-zz" fill="${g}" font-family="Caveat,cursive">${[[54,150,20],[120,210,15],[40,260,13]].map(([zx,zy,fs],i)=>`<text x="${zx}" y="${zy}" font-size="${fs}" style="animation-delay:${(-i*1.7).toFixed(1)}s">z</text>`).join('')}</g>`;
 else x=`<g class="h11-sl" fill="${g}"><path d="M30 400 L70 0 L104 0Z" opacity=".1"/><path class="b" d="M150 400 L96 0 L128 0Z" opacity=".08"/></g>
  <g class="h11-cf">${Array.from({length:14},(_,i)=>`<rect x="${(10+(i*29)%160)}" y="-8" width="3" height="5" fill="${[g,c,'#fff'][i%3]}" style="animation-delay:${(-i*.8).toFixed(1)}s;animation-duration:${(7+(i%4)*1.5).toFixed(1)}s"/>`).join('')}</g>`;
 return s.replace('</svg>',x+'</svg>').replace('class="hbg-s','class="hbg-s h11')}

/* --- город ночью для карточки игры: здания ар-деко (ступени, шпили), окна мигают --- */
function sky11(W,H,o){let s=o.seed||7;const r=()=>(s=(s*16807)%2147483647)/2147483647,f=v=>Math.round(v*10)/10;let x=-3,b='',w='';
 while(x<W+3){const mid=o.mid?1-Math.abs((x/W)-.5)*o.mid:1,bw=o.w[0]+r()*(o.w[1]-o.w[0]),bh=(o.h[0]+r()*(o.h[1]-o.h[0]))*mid,y=H-bh,t=r();
  let p=`M${f(x)} ${H}V${f(y)}`;
  if(t<.26){const a=bw*.18,h1=Math.min(9,bh*.07);p+=`H${f(x+a)}V${f(y-h1)}H${f(x+a*2)}V${f(y-h1*2)}H${f(x+bw-a*2)}V${f(y-h1)}H${f(x+bw-a)}V${f(y)}`}
  else if(t<.42)p+=`H${f(x+bw*.4)}L${f(x+bw/2)} ${f(y-bh*.32)}L${f(x+bw*.6)} ${f(y)}`;
  else if(t<.55)p+=`L${f(x+bw/2)} ${f(y-bw*.46)}`;
  else if(t<.64)p+=`H${f(x+bw*.47)}V${f(y-bh*.2)}H${f(x+bw*.53)}V${f(y)}`;
  p+=`H${f(x+bw)}V${H}Z`;b+=p;
  if(o.win){const cw=6.2,rh=8.4,cols=Math.max(1,Math.floor((bw-4)/cw)),rows=Math.max(0,Math.floor((bh-10)/rh));for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){const q=r();if(q<o.win)w+=`<rect x="${f(x+2.5+i*cw)}" y="${f(y+7+j*rh)}" width="2.2" height="3.2"${q<o.win*.24?` class="tw" style="animation-delay:${f(-r()*8)}s;animation-duration:${f(4+r()*6)}s"`:''}/>`}}
  x+=bw+(o.gap||0)}
 return `<svg class="g11-sk ${o.cls||''}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><path d="${b}" fill="${o.fill}"/>${w?`<g fill="${o.wc||'#FFD58A'}" opacity="${o.wo||.85}">${w}</g>`:''}</svg>`}
// дождь на canvas: косые капли, брызги внизу; alive() — рисовать ли сейчас
function rain11(ctx,cv,o){o=o||{};const g=cv.getContext('2d'),dpr=Math.min(2,window.devicePixelRatio||1);const b=cv.getBoundingClientRect();const W=Math.max(10,b.width/SCALE),H=Math.max(10,b.height/SCALE);cv.width=W*dpr;cv.height=H*dpr;g.setTransform(dpr,0,0,dpr,0,0);
 const D=[],S=[];for(let i=0;i<(o.n||56);i++)D.push({x:Math.random()*W*1.25,y:Math.random()*H,l:6+Math.random()*11,v:6.5+Math.random()*6,a:.1+Math.random()*.22});
 ctx.loop((n,dt)=>{if(o.alive&&!o.alive())return;const k=dt/16.7;g.clearRect(0,0,W,H);g.lineWidth=1;g.lineCap='round';
  for(const d of D){d.y+=d.v*k;d.x-=d.v*.24*k;if(d.y>H){if(o.splash&&Math.random()<.4)S.push({x:d.x,y:H-2-Math.random()*8,r:0,a:.32});d.y=-d.l-Math.random()*40;d.x=Math.random()*W*1.25}
   g.strokeStyle=`rgba(196,220,255,${d.a})`;g.beginPath();g.moveTo(d.x,d.y);g.lineTo(d.x+d.l*.24,d.y-d.l);g.stroke()}
  for(let i=S.length-1;i>=0;i--){const q=S[i];q.r+=.32*k;q.a-=.018*k;if(q.a<=0){S.splice(i,1);continue}g.strokeStyle=`rgba(196,220,255,${q.a.toFixed(3)})`;g.beginPath();g.ellipse(q.x,q.y,q.r*1.7,q.r*.4,0,0,6.3);g.stroke()}})}
// неоновая надпись: буквы-трубки, загораются с миганием, иногда одна моргает
const neon11=(t,cl)=>`<b class="g11-ne${cl?' '+cl:''}" aria-label="${t}">${[...t].map(c=>`<i>${c}<span>${c}</span></i>`).join('')}</b>`;
function neonOn11(ctx,el,dl){const L=$$('i>span',el);L.forEach((s,i)=>{s.style.opacity='0';ctx.t(()=>{an(s,[{opacity:0},{opacity:.9,offset:.12},{opacity:.08,offset:.24},{opacity:1,offset:.4},{opacity:.3,offset:.52},{opacity:1,offset:.66},{opacity:1}],{d:520+Math.random()*320,e:'steps(1,end)'});s.style.opacity='1'},dl+i*55+Math.random()*380)})}
function neonLife11(ctx,el,alive){const go=()=>{if(!ctx.alive)return;if(!alive||alive()){const L=$$('i>span',el),s=L[(Math.random()*L.length)|0];if(s)an(s,[{opacity:1},{opacity:.15,offset:.2},{opacity:1,offset:.4},{opacity:.35,offset:.6},{opacity:1}],{d:300,e:'steps(1,end)'})}ctx.t(go,2400+Math.random()*3200)};ctx.t(go,3600)}
const rdr11=n=>`<span class="g11-rd"><i class="sw"></i><i class="ri"></i><i class="bp a"></i><i class="bp b"></i>${n?`<em>${n}</em>`:''}</span>`;
// молния: вспышка и город на миг светлее
function bolt11(ctx,fl,sky,alive){const go=()=>{if(!ctx.alive)return;if(!alive||alive()){an(fl,[{opacity:0},{opacity:.55,offset:.06},{opacity:.05,offset:.18},{opacity:.38,offset:.28},{opacity:0}],{d:620,e:'linear'});if(sky)an(sky,[{opacity:1},{opacity:1.6,offset:.08},{opacity:1}],{d:620})}ctx.t(go,6500+Math.random()*4500)};ctx.t(go,2300)}

/* --- вкладка «Игры»: карточка Deadlock большой или строчкой; включается, как экран --- */
function g11Tab(R,ctx,o){o=o||{};const C=!!o.compact;R.className='scr v8 g11'+(C?' g11-cmp':'');
 const W=316,SH=C?124:236;
 const sky=`<span class="g11-sky">
   ${sky11(W,SH,{seed:3,w:[16,30],h:[SH*.42,SH*.82],fill:'#161d3a',cls:'l1',mid:.6})}
   <i class="g11-bm a"></i><i class="g11-bm b"></i>
   ${sky11(W,SH,{seed:11,w:[14,26],h:[SH*.26,SH*.6],fill:'#0e1430',win:.15,cls:'l2',wo:.8})}
   <span class="g11-brg"><i class="g11-trn"><svg viewBox="0 0 230 14"><rect x="0" y="2" width="222" height="9" rx="2.5" fill="#05070f"/>${Array.from({length:19},(_,i)=>`<rect x="${6+i*11.4}" y="4.4" width="6.2" height="3.6" rx=".8" fill="#FFD58A" opacity="${i%6?'.95':'.25'}"/>`).join('')}<path d="M222 2 l7 4.5 -7 4.5z" fill="#05070f"/></svg></i></span>
   ${sky11(W,SH,{seed:29,w:[18,34],h:[SH*.12,SH*.34],fill:'#05070f',win:.05,cls:'l3',wo:.55})}</span>`;
 const duo=C?`<span class="g11-scr"><video muted loop playsinline data-hv="hv_venator2" poster="${IMG.hv_venator2}"></video><video class="b" muted loop playsinline data-hv="hv_rat3" poster="${IMG.hv_rat3}"></video><i class="gl a"></i><i class="gl b"></i><i class="gl c"></i><i class="ln"></i></span>`
  :`<span class="g11-duo"><span class="hv l"><video muted loop playsinline data-hv="hv_venator2" poster="${IMG.hv_venator2}"></video></span><span class="hv r"><video muted loop playsinline data-hv="hv_rat3" poster="${IMG.hv_rat3}"></video></span><b class="g11-vs"><i>V</i><i>S</i></b></span>`;
 R.innerHTML=`${SB(0)}<div class="g11-pg"><div class="g11-hd"><b>Игры</b><small>учишь язык, пока играешь</small></div>
  <button class="g11-card${C?' row':''}" aria-label="Открыть Deadlock"><span class="g11-crt"><i class="g11-glow"></i>${sky}${duo}<canvas class="g11-rain"></canvas><i class="g11-fl"></i>
   <span class="g11-tx"><small>ИГРА · ДИАЛОГИ ГЕРОЕВ</small>${neon11('DEADLOCK')}<span class="g11-ln">${C?'Versus · Радар · 9 героев':'Versus с другом · Радар · комиксы героев'}</span></span>
   ${C?'':`<span class="g11-ft"><span class="ms">${['venator','rat','rem','talon','celeste'].map((k,i)=>`<i class="g11-mi" style="--i:${i}">${mini8(k)}</i>`).join('')}<em>+4</em></span><span class="g11-go">Играть ${ic('chev')}</span></span>`}
   <span class="g11-chip">${rdr11(2)}<b>2 перехвата</b></span><i class="g11-gl"></i></span><i class="g11-on"></i></button>
  <div class="g11-sec"><b>Сейчас</b><small>новое — раз в 8 часов</small></div>
  <div class="g11-feed">
   <button class="g11-fi" data-go="radar"><span class="ic">${rdr11(0)}</span><span class="tx"><b>2 перехвата ждут</b><small>Туннели · Король и Венатор · ×2 опыта</small></span><em class="tm">5:12:40</em></button>
   <button class="g11-fi" data-go="check"><span class="ic bk">${ic('book11')}</span><span class="tx"><b>Глава ждёт проверки</b><small>«Проповедь свинца» · 3 вопроса · ≈ 30 с</small></span>${ic('chev')}</button>
   <button class="g11-fi" data-go="vs"><span class="ic mm">${mini8('rat')}${mini8('venator')}</span><span class="tx"><b>Боря зовёт в Versus</b><small>ставка 50 · 2 ч назад</small></span><em class="ok">Принять</em></button></div>
  <div class="g11-sec"><b>С друзьями</b><small>по сценам из кино</small></div>
  <button class="g11-duel" data-t="Дуэль по сцене — та же, что сейчас в «Сценах»">${ic('film11')}<span><b>Дуэль по сцене</b><small>кто быстрее ответит · ссылкой в Telegram</small></span>${ic('chev')}</button></div>
  ${TB5('v3-tb w4b-tb m6-tb m7-tb v8-tb g11-tb',2)}<canvas class="fx"></canvas><i class="hb"></i>`;
 const fx=FX(ctx,$('.fx',R)),card=$('.g11-card',R),crt=$('.g11-crt',R);let touched=false,hub=false;const vis=()=>!hub;
 $$('video[data-hv]',R).forEach(v=>{v.src=vurl(v.dataset.hv);v.muted=true;const p=v.play();if(p&&p.catch)p.catch(()=>{})});
 ctx.on(R,'pointerdown',()=>{touched=true},{capture:true});
 // включение: полоса развёртки → экран раскрывается по высоте → слои города поднимаются → неон мигает и загорается
 an($('.g11-on',R),[{opacity:1,transform:'translateY(-50%) scaleX(.05)'},{opacity:1,transform:'translateY(-50%) scaleX(1)',offset:.45},{opacity:0,transform:'translateY(-50%) scaleX(1)'}],{d:620,e:EO,dl:80,f:'forwards'});
 an(crt,[{transform:'scaleY(.012)',opacity:.4},{transform:'scaleY(1)',opacity:1}],{d:480,e:'cubic-bezier(.2,.9,.25,1)',dl:260});
 an(card,[{opacity:0},{opacity:1}],{d:120,dl:60});
 $$('.g11-sk',R).forEach((s,i)=>an(s,[{transform:`translateY(${26+i*14}px)`},{transform:'none'}],{sp:SPs,dl:520+i*90}));
 neonOn11(ctx,$('.g11-ne',R),760);neonLife11(ctx,$('.g11-ne',R),vis);
 if(!C){an($('.g11-duo .l',R),[{transform:'translateX(-60%)',opacity:0},{transform:'none',opacity:1}],{sp:SPs,dl:1180});an($('.g11-duo .r',R),[{transform:'translateX(60%)',opacity:0},{transform:'none',opacity:1}],{sp:SPs,dl:1180});
  $$('.g11-vs i',R).forEach((x,i)=>an(x,[{opacity:0,transform:`translate(${i?30:-30}px,0) scale(2.2)`},{opacity:1,transform:'none'}],{sp:SPb,dl:1520+i*70}));
  ctx.t(()=>{const r=rel($('.g11-vs',R),R);fx.burst(r.x+r.w/2,r.y+r.h/2,{n:34,c:['#F6D488','#fff','#FF8A4C'],v:6,g:.05,s:2.4,l:38});an(card,[{transform:'none'},{transform:'translate(-2px,1px)'},{transform:'translate(2px,-1px)'},{transform:'none'}],{d:220})},1640);
  $$('.g11-mi',R).forEach((m,i)=>an(m,[{opacity:0,transform:'translateY(12px) scale(.4)'},{opacity:1,transform:'none'}],{sp:SPb,dl:1700+i*60}))}
 else{an($('.g11-scr',R),[{opacity:0,transform:'scale(.6) rotate(-6deg)'},{opacity:1,transform:'none'}],{sp:SPb,dl:900})}
 an($('.g11-chip',R),[{opacity:0,transform:'translateY(10px) scale(.8)'},{opacity:1,transform:'none'}],{sp:SPb,dl:C?1100:1900});
 ctx.t(()=>{const r=rel($('.g11-chip',R),R);fx.burst(r.x+16,r.y+r.h/2,{n:18,c:['#2EE6C5','#fff'],v:2.8,g:0,s:1.8,l:30})},C?1300:2100);
 $$('.g11-sec,.g11-fi,.g11-duel',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:(C?900:1500)+i*70}));
 ctx.t(()=>rain11(ctx,$('.g11-rain',R),{n:C?34:60,splash:!C,alive:vis}),700);
 bolt11(ctx,$('.g11-fl',R),$('.g11-sk.l1',R),vis);
 // строчка: на «экране» герои сменяют друг друга через помеху
 if(C){const sc=$('.g11-scr',R),Vb=$('video.b',sc);let b=false;const sw=()=>{if(!ctx.alive)return;if(vis()){b=!b;sc.classList.add('gz');ctx.t(()=>{Vb.style.opacity=b?'1':'0'},120);ctx.t(()=>sc.classList.remove('gz'),360)}ctx.t(sw,3600)};ctx.t(sw,3200)}
 // наклон к пальцу: слои города едут с разной глубиной, по стеклу бежит блик
 const L1=$('.g11-sk.l1',R),L2=$('.g11-sk.l2',R),L3=$('.g11-sk.l3',R),DU=$('.g11-duo',R)||$('.g11-scr',R),GL=$('.g11-gl',R);
 ctx.on(card,'pointermove',e=>{const b=card.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;card.style.transform=`perspective(800px) rotateY(${(x*9).toFixed(1)}deg) rotateX(${(-y*7).toFixed(1)}deg)`;
  L1.style.transform=`translateX(${(-x*5).toFixed(1)}px)`;L2.style.transform=`translateX(${(-x*11).toFixed(1)}px)`;L3.style.transform=`translateX(${(-x*18).toFixed(1)}px)`;if(DU)DU.style.translate=`${(x*8).toFixed(1)}px 0`;GL.style.opacity='1';GL.style.transform=`translateX(${(x*140).toFixed(0)}%)`});
 ctx.on(card,'pointerleave',()=>{card.style.transform='';[L1,L2,L3].forEach(l=>l.style.transform='');if(DU)DU.style.translate='';GL.style.opacity=''});
 const openHub=()=>{if(hub)return;hub=true;an(card,[{transform:'scale(.97)'},{transform:'scale(1.015)'},{transform:'none'}],{d:300,e:EO});const r=rel(card,R);fx.burst(r.x+r.w/2,r.y+r.h/2,{n:34,c:['#2EE6C5','#F6D488','#fff'],v:5,g:0,s:2.2,l:40});
  ctx.t(()=>g11Hub(R,ctx,card,{onClose(){hub=false}}),140)};
 ctx.on(card,'click',()=>{touched=true;openHub()});
 ctx.on(R,'click',e=>{const f=e.target.closest('.g11-fi,.g11-duel');if(!f)return;touched=true;an(f,[{transform:'scale(.96)'},{transform:'none'}],{sp:SPb});
  if(f.dataset.t){toast(R,f.dataset.t);return}const go=f.dataset.go;
  if(go==='radar'&&typeof radar11==='function')g11Over(R,ctx,(pv,c,cl)=>radar11(pv,c,'relief',{demo:false,onBack:cl}),null,f);
  else if(go==='check')g11Over(R,ctx,(pv,c)=>k11Comic(pv,c,{mode:'check',demo:false}),'Игры',f);
  else if(go==='vs'&&typeof vs11==='function')g11Over(R,ctx,(pv,c,cl)=>vs11(pv,c,{demo:false,onBack:cl}),null,f)});
 if(o.auto!==false)ctx.t(()=>{if(!touched)openHub()},C?3400:4200)}

// любой экран игр поверх текущего, с кнопкой «назад»: растёт из точки нажатия
function g11Over(R,ctx,mount,back,from){const pv=document.createElement('div');pv.className='scr g11-ov';pv.style.cssText='position:absolute;inset:0;z-index:90;border-radius:0';R.appendChild(pv);const c=sub(ctx);let closed=false;
 const close=()=>{if(closed)return;closed=true;c.kill();if(AUcur){try{AUcur.pause()}catch(e){}}const z=an(pv,[{opacity:1},{opacity:0,transform:'scale(.96)'}],{d:240,e:EI,f:'forwards'});if(z)z.onfinish=()=>pv.remove();else pv.remove()};
 mount(pv,c,close);pv.classList.add('g11-ov');
 if(back){pv.insertAdjacentHTML('beforeend',`<button class="g11-x" aria-label="Назад: ${back}">${ic('back')}</button>`);c.on($('.g11-x',pv),'click',close)}
 if(from){const q=rel(from,R);an(pv,[{clipPath:`inset(${q.y}px ${344-q.x-q.w}px ${754-q.y-q.h}px ${q.x}px round 18px)`},{clipPath:'inset(0 0 0 0 round 0)'}],{d:520,e:EO})}
 else an(pv,[{opacity:0,transform:'scale(1.05)'},{opacity:1,transform:'none'}],{d:380,e:EO});
 return {pv,c,close}}

/* --- Deadlock: шапка, Versus, Радар, герои (комиксы — внутри героя) --- */
function g11Hub(R,ctx,from,o){o=o||{};let ov=$('.g11-hub',R);if(ov)ov.remove();ov=document.createElement('div');ov.className='g11-hub';
 const H2=['venator','rat'],SOON=['rem','talon','celeste','doorman','seven','victor','danny'];
 const cnt=k=>{const L=G11CH[k]||[];return {n:L.filter(x=>x.st==='new').length,c:L.filter(x=>x.st==='chk').length,all:L.length}};
 ov.innerHTML=`<div class="g11-hh"><i class="img" style="background-image:url(${IMG.dl_cover})"></i><i class="sh"></i><button class="g11-bk" aria-label="Назад">${ic('back')}</button>
   <div class="tx"><small>ИГРА · ДИАЛОГИ ГЕРОЕВ</small>${neon11('DEADLOCK','hh')}<span>9 героев · 6 комиксов · голоса из игры</span></div></div>
  <div class="g11-stk"><div class="in"><button class="g11-bk s">${ic('back')}</button><b>DEADLOCK</b><span class="g11-gap"></span><em>${rdr11(2)}</em></div></div>
  <button class="g11-vsb"><span class="hv l"><video muted loop playsinline data-hv="hv_venator2" poster="${IMG.hv_venator2}"></video></span><span class="hv r"><video muted loop playsinline data-hv="hv_rat3" poster="${IMG.hv_rat3}"></video></span><i class="vsl"></i><b class="vs">VS</b>
   <span class="tx"><small>${ic('sword')}VERSUS С ДРУГОМ</small><b>Кто лучше поймёт героев?</b><em>3 раунда · урон — твои очки · ставка билетами</em></span><span class="cta">Позвать друга ${ic('chev')}</span></button>
  <div class="g11-rdb"><button class="mp" data-rd="relief"><canvas class="g11-rmini"></canvas><i class="sw"></i><i class="bp a"></i><i class="bp b"></i></button>
   <div class="tx"><b>Радар</b><small>2 перехвата ждут · ×2 опыта</small><em class="tm">новые через 5:12:40</em><span class="ab"><button data-rd="relief">${ic('map11')}Рельеф</button><button data-rd="city">${ic('cube11')}3D-город</button></span></div></div>
  <div class="g11-sec"><b>Герои</b><small>нажми — там его комиксы</small></div>
  <div class="g11-hs">${H2.map(k=>{const h=HERO[k],g=G11H[k],q=cnt(k);return `<button class="g11-hc" data-k="${k}" style="--ac:${g.ac}"><span class="bg">${heroBg11(k)}</span><video muted loop playsinline data-hv="${g.v}" poster="${IMG[g.v]}" style="object-position:${g.pos}"></video><i class="dm"></i>
     <span class="tp"><em class="hlv">ур. ${g.lv}</em>${q.n?`<em class="nw">${q.n} новая</em>`:''}</span>
     <span class="bt"><b>${h.n}</b><small>${h.ru}</small><span class="cm">${ic('book11')}${q.all} главы${q.c?` · <i>${q.c} ждёт проверки</i>`:''}</span><i class="xp"><i style="width:${Math.round(g.xp/g.nx*100)}%"></i></i></span></button>`}).join('')}</div>
  <div class="g11-sn"><small>Скоро · портреты делаем</small><div>${SOON.map(k=>{const d=DL8.find(x=>x.k===k);return `<button data-k="${k}">${mini8(k)}<span>${d?d.n.split(' ').pop():k}</span></button>`}).join('')}</div></div>
  <p class="g11-nt">${ic('book11')} Комиксы — в карточке героя. Ещё их ловит Радар.</p>`;
 R.appendChild(ov);$$('video[data-hv]',ov).forEach(v=>{v.src=vurl(v.dataset.hv);v.muted=true;const p=v.play();if(p&&p.catch)p.catch(()=>{})});
 const c=sub(ctx);
 // вход: Deadlock раскрывается из карточки/строчки
 if(from){const q=rel(from,R);an(ov,[{clipPath:`inset(${q.y}px ${344-q.x-q.w}px ${754-q.y-q.h}px ${q.x}px round 24px)`},{clipPath:'inset(0 0 0 0 round 0)'}],{d:560,e:EO})}else an(ov,[{opacity:0},{opacity:1}],{d:300});
 neonOn11(c,$('.g11-ne.hh',ov),260);neonLife11(c,$('.g11-ne.hh',ov));
 an($('.g11-hh .img',ov),[{transform:'scale(1.25)'},{transform:'scale(1.08)'}],{d:1400,e:EO});
 an($('.g11-vsb .l',ov),[{transform:'translateX(-50%)',opacity:0},{transform:'none',opacity:1}],{sp:SPs,dl:380});an($('.g11-vsb .r',ov),[{transform:'translateX(50%)',opacity:0},{transform:'none',opacity:1}],{sp:SPs,dl:380});
 an($('.g11-vsb .vs',ov),[{opacity:0,transform:'translate(-50%,-50%) scale(2.6) rotate(-12deg)'},{opacity:1,transform:'translate(-50%,-50%) rotate(-6deg)'}],{sp:SPb,dl:640});
 $$('.g11-rdb,.g11-sec,.g11-hc,.g11-sn,.g11-nt',ov).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(22px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:520+i*80}));
 g11MiniMap(c,$('.g11-rmini',ov));
 // шапка уезжает, сверху остаётся строка с названием
 const stk=$('.g11-stk .in',ov),hi=$('.g11-hh .img',ov);c.on(ov,'scroll',()=>{const s=ov.scrollTop;hi.style.translate=`0 ${(s*.4).toFixed(0)}px`;stk.classList.toggle('on',s>170)},{passive:true});
 let touched=false;c.on(ov,'pointerdown',()=>{touched=true},{capture:true});
 // наклон карточек героев
 $$('.g11-hc',ov).forEach(b=>{c.on(b,'pointermove',e=>{const r=b.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;b.style.transform=`perspective(600px) rotateY(${(x*10).toFixed(1)}deg) rotateX(${(-y*8).toFixed(1)}deg)`});c.on(b,'pointerleave',()=>{b.style.transform=''})});
 const close=()=>{c.kill();const z=an(ov,[{opacity:1,transform:'none'},{opacity:0,transform:'translateX(40px)'}],{d:240,e:EI,f:'forwards'});const f=()=>{ov.remove();o.onClose&&o.onClose()};if(z)z.onfinish=f;else f()};
 c.on(ov,'click',e=>{const t=e.target;
  if(t.closest('.g11-bk')){close();return}
  const h=t.closest('.g11-hc');if(h){touched=true;g11Hero(R,c,h.dataset.k,h);return}
  const sn=t.closest('.g11-sn button');if(sn){touched=true;an(sn,[{transform:'scale(.9)'},{transform:'none'}],{sp:SPb});const d=DL8.find(x=>x.k===sn.dataset.k);toast(R,`${d?d.ru:'Герой'}: портрет ещё делаем`);return}
  if(t.closest('.g11-vsb')){touched=true;if(typeof vs11==='function')g11Over(R,c,(pv,cc,cl)=>vs11(pv,cc,{demo:false,onBack:cl}),null,$('.g11-vsb',ov));return}
  const rd=t.closest('[data-rd]');if(rd){touched=true;if(typeof radar11==='function')g11Over(R,c,(pv,cc,cl)=>radar11(pv,cc,rd.dataset.rd,{demo:false,onBack:cl}),null,rd.closest('.g11-rdb'));return}});
 if(o.demo!==false)c.t(()=>{if(!touched){const h=$('.g11-hc[data-k="venator"]',ov);an(h,[{transform:'scale(.96)'},{transform:'none'}],{sp:SPb});g11Hero(R,c,'venator',h,{demo:true})}},3000);
 return ov}

// мини-рельеф в карточке Радара (та же карта, что в Радаре, маленькая)
function g11MiniMap(ctx,cv){if(!cv)return;const b=cv.getBoundingClientRect(),W=Math.round(b.width/SCALE)||96,H=Math.round(b.height/SCALE)||96,dpr=Math.min(2,window.devicePixelRatio||1);cv.width=W*dpr;cv.height=H*dpr;
 const g=cv.getContext('2d');if(typeof relief11==='function'){const im=relief11(W*dpr,H*dpr,{mini:1});g.putImageData(im,0,0)}else{g.fillStyle='#10241c';g.fillRect(0,0,cv.width,cv.height)}}

/* --- карточка героя: живой портрет на живом фоне, уровень, Versus за него; комиксы — главами, фразы — с голосом --- */
function g11Hero(R,ctx,k,from,o){o=o||{};const h=HERO[k]||HERO.venator,g=G11H[k]||G11H.venator,CH=(G11CH[k]||[]).map(x=>Object.assign({},x)),PH=G11PH[k]||[];
 const ov=document.createElement('div');ov.className='g11-hp';ov.style.setProperty('--ac',g.ac);
 const chHTML=(x,j)=>{const w=HERO[x.w],wd=DL8.find(y=>y.k===x.w),st={new:['Новая','nw'],chk:['Проверка ждёт · 3 вопроса','ck'],done:['Закреплено · 3 из 3','dn'],deep:['Углублено','dp'],lock:['Нужен портрет '+(GEN11[x.w]||''),'lk']}[x.st];
  return `<button class="g11-ch s-${x.st}" data-j="${j}"><span class="pg"><i class="p a" style="background-image:url(${MINI(k)})"></i><i class="p b" style="background-image:url(${MINI(x.w)})"></i><i class="p c" style="background-image:url(${MINI(k)})"></i><i class="bb a"></i><i class="bb b"></i><b>${j+1}</b></span>
   <span class="tx"><small>ГЛАВА ${j+1} · С ${(INS11[x.w]||'').toUpperCase()}</small><b>${x.t}</b><em>${x.ab}</em><span class="st ${st[1]}">${x.st==='done'||x.st==='deep'?ic('check'):x.st==='lock'?ic('lock'):x.st==='chk'?ic('book11'):'<i class="dt"></i>'}${st[0]}${x.st==='deep'?` <i class="sf">${ic('starf')}</i>`:''}</span></span>
   ${x.st==='done'?`<span class="dg" data-deep="${j}">${ic('deep11')}<b>Углубить</b><small>+6 заданий</small></span>`:x.st==='lock'?'':`<i class="go">${ic('chev')}</i>`}</button>`};
 const paintCh=()=>{$('.g11-chs',ov).innerHTML=CH.map(chHTML).join('')};
 ov.innerHTML=`<div class="g11-st"><span class="bg">${heroBg11(k)}</span><video muted loop playsinline data-hv="${g.v}" poster="${IMG[g.v]}" style="object-position:${g.pos}"></video><i class="dm"></i><button class="g11-bk" aria-label="Назад">${ic('back')}</button>
   <div class="nm"><small>${g.tag.toUpperCase()}</small><b>${h.n}</b><span class="slv"><span class="ring"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" class="t"/><circle cx="20" cy="20" r="16" class="p" pathLength="100"/></svg><em>${g.lv}</em></span><span class="xp"><span><b>ур. ${g.lv}</b><small>${g.xp} / ${g.nx} опыта</small></span><i><i></i></i><small>ещё ${g.nx-g.xp} до ур. ${g.lv+1} — за комиксы и Versus</small></span></span></div></div>
  <div class="g11-hb"><div class="in"><button class="g11-bk s">${ic('back')}</button>${mini8(k)}<b>${h.n}</b><em>ур. ${g.lv}</em></div></div>
  <div class="g11-bd">
   <div class="g11-acts"><button class="g11-vsgo">${ic('sword')}<span><b>Versus за ${h.ru==='Крысиный король'?'Короля':h.ru+'а'}</b><small>3 раунда с другом · ставка</small></span></button><button class="g11-vo" data-vw aria-label="Голос героя">${ic('play')}${wv11(9)}</button></div>
   <div class="g11-sec"><b>Комиксы</b><small>${CH.length} главы · ещё ловит Радар</small></div>
   <div class="g11-chs"></div>
   <div class="g11-sec"><b>Фразы ${h.ru==='Крысиный король'?'Короля':h.ru+'а'}</b><small>${g.ph} · голос из игры</small></div>
   <div class="g11-phs">${PH.map(p=>`<div class="g11-ph" data-vw><button class="pl" data-a="${p[0]}">${ic('play')}</button><span><b>${p[1]}</b><small>${p[2]}</small></span><em style="--tc:${G11TAG[p[3]]||'#2EE6C5'}">${p[3]}</em>${wv11(7,'r')}</div>`).join('')}</div>
   <p class="g11-mo">ещё ${g.ph-PH.length} фраз откроются в комиксах</p></div>`;
 R.appendChild(ov);paintCh();$$('video[data-hv]',ov).forEach(v=>{v.src=vurl(v.dataset.hv);v.muted=true;const p=v.play();if(p&&p.catch)p.catch(()=>{})});
 const c=sub(ctx);
 // вход: карточка растёт из плитки героя
 const r=from?rel(from,R):{x:100,y:420,w:144,h:230};
 an(ov,[{clipPath:`inset(${r.y}px ${344-r.x-r.w}px ${754-r.y-r.h}px ${r.x}px round 22px)`},{clipPath:'inset(0px 0px 0px 0px round 0px)'}],{d:600,e:EO});
 an($('.g11-st video',ov),[{transform:'scale(1.25)'},{transform:'scale(1.04)'}],{d:1200,e:EO});
 $$('.g11-st .nm>*,.g11-acts,.g11-sec,.g11-ch,.g11-ph',ov).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:280+Math.min(i,12)*55}));
 const ring=$('.ring .p',ov),bar=$('.xp>i>i',ov);ring.style.strokeDashoffset='100';bar.style.transform='scaleX(0)';
 c.t(()=>{ring.style.strokeDashoffset=String(100-Math.round(g.xp/g.nx*100));bar.style.transform=`scaleX(${(g.xp/g.nx).toFixed(3)})`},420);
 // прокрутка: портрет уезжает медленнее, сверху — компактная строка
 const stv=$('.g11-st video',ov),hb=$('.g11-hb .in',ov);c.on(ov,'scroll',()=>{const s=ov.scrollTop;stv.style.translate=`0 ${(s*.35).toFixed(0)}px`;hb.classList.toggle('on',s>300)},{passive:true});
 voiceBtn11(c,$('.g11-vo',ov),PH.length?PH[(Math.random()*PH.length)|0][0]:'ven-no-hide',R);
 $$('.g11-ph .pl',ov).forEach(b=>voiceBtn11(c,b,b.dataset.a,R));
 let touched=false;c.on(ov,'pointerdown',()=>{touched=true},{capture:true});
 const close=()=>{c.kill();if(AUcur){try{AUcur.pause()}catch(e){}}const z=an(ov,[{opacity:1,transform:'none'},{opacity:0,transform:'scale(.95)'}],{d:240,e:EI,f:'forwards'});if(z)z.onfinish=()=>ov.remove();else ov.remove()};
 const openC=(j,mode,el)=>{const x=CH[j];const {pv,c:cc}=g11Over(R,c,(p,c2)=>k11Comic(p,c2,{mode,demo:!touched,hero:k,title:x.t,onDone(res){if(res==='deep'){x.st='deep'}else if(res==='done'&&(x.st==='new'||x.st==='chk'))x.st='done';paintCh();const nb=$(`.g11-ch[data-j="${j}"]`,ov);if(nb)an(nb,[{boxShadow:'0 0 0 2px rgba(242,193,78,.9)'},{boxShadow:'0 0 0 0 rgba(242,193,78,0)'}],{d:1400})}}),h.n,el)};
 c.on(ov,'click',e=>{const t=e.target;if(t.closest('.g11-bk')){close();return}
  if(t.closest('.g11-vsgo')){touched=true;if(typeof vs11==='function')g11Over(R,c,(pv,cc,cl)=>vs11(pv,cc,{demo:false,me:k,onBack:cl}),null,$('.g11-vsgo',ov));return}
  const dg=t.closest('[data-deep]');if(dg){touched=true;e.stopPropagation();openC(+dg.dataset.deep,'deep',dg.closest('.g11-ch'));return}
  const ch=t.closest('.g11-ch');if(ch){touched=true;const x=CH[+ch.dataset.j];if(x.st==='lock'){shake(ch,5,300);toast(R,'Откроется, когда у обоих героев будет портрет');return}openC(+ch.dataset.j,x.st==='chk'?'check':x.st==='new'?'read':'reread',ch)}});
 // демо: открыть главу «Тяжела корона» (новая), если не трогали
 if(o.demo)c.t(()=>{if(!touched){const j=CH.findIndex(x=>x.st==='new');const ch=$(`.g11-ch[data-j="${j}"]`,ov);if(ch){ov.scrollTo({top:Math.max(0,ch.offsetTop-260),behavior:'smooth'});c.t(()=>{if(!touched){an(ch,[{transform:'scale(.97)'},{transform:'none'}],{sp:SPb});openC(j,'read',ch)}},900)}}},2600);
 return ov}

/* --- комикс v11: читать → проверка главы (3, чтобы засчиталась) → «глубже?» по желанию → углублённая (6) --- */
// задания углублённой — по настоящим репликам главы «Охота объявлена»
const KT11=[{k:'НА СЛУХ',a:'ven-evil-stirs',ctx:'Evil ▢▢▢▢▢ in New York… and so the Vatican has called on me.',q:'Какое слово прозвучало?',o:['stirs','stares','stays'],r:0,why:'stir — «шевелиться, просыпаться»: зло просыпается. stares — «пялится», stays — «остаётся»: звучат похоже.'},
 {k:'ФРАЗА',ctx:'…and so the Vatican has <u>called on</u> me.',q:'Что значит «called on» тут?',o:['призвал меня','позвонил мне','зашёл ко мне в гости','назвал меня'],r:0,why:'call on — «призвать, обратиться за помощью». Ловушки: call — «звонить», а call on кого-то бывает и «зайти в гости» — но не тут.'},
 {k:'СОБЕРИ',t:'tiles',a:'ven-no-hide',ru:'От Венатора не спрячешься.',ans:["You","can't","hide","from","a","Venator"],ex:['run','find'],q:'Собери, что сказал Венатор',why:"can't hide from — «не спрятаться от». Лишние: run (бежать), find (найти)."},
 {k:'СЛОВО',ctx:"…show your face in the <u>sewers</u> again?!",q:'Что такое «sewers»?',o:['канализация','швеи','подвалы','туннели метро'],r:0,why:'sewer — сточная труба, канализация. Ловушка: sewer [соуэр] — «швея» пишется так же!'},
 {k:'НА СЛУХ',a:'rk-priest-vs-king',ctx:"What's a priest ▢▢▢▢▢ do to a king?!",q:'Какое слово прозвучало?',o:['gonna','going','wanna'],r:0,why:'gonna = going to — «собирается». wanna = want to — «хочет».'},
 {k:'ФРАЗА',ctx:'I <u>will find</u> you.',q:'Как это по-русски?',o:['Я тебя найду','Я тебя нашёл','Я тебя ищу','Найди меня'],r:0,why:'will + глагол — будущее: «найду». «Нашёл» — found, «ищу» — I\'m looking for.'}];
const KT11c=[{k:'СЛОВО',ctx:"…weren't supposed to <u>show your face</u> in the sewers…",q:'Что значит «show your face» в этой реплике?',o:['появляться, соваться','показывать лицо','прятать лицо'],r:0,why:'show your face — «показываться, соваться куда-то». Дословное «показать лицо» тут не подходит.'},
 {k:'СЛОВО',ctx:"What's a <u>priest</u> gonna do to a king?!",q:'Кто такой «priest»?',o:['священник','принц','пират'],r:0,why:'priest — священник. Король дразнит Венатора «попом».'},
 {k:'ФРАЗА',ctx:"I thought I said you <u>weren't supposed to</u>…",q:'Что значит «weren\'t supposed to»?',o:['тебе нельзя было','ты не собирался','ты не предполагал'],r:0,why:'be supposed to — «должен, положено». Ловушка — suppose «предполагать».'}];
function quiz11(R,ctx,T,o){const el=document.createElement('div');el.className='g11-q';R.appendChild(el);let i=0,got=0,first=true;const fx=o.fx;
 const show=()=>{const t=T[i];first=true;el._t=t;
  const body=t.t==='tiles'?`<p class="ru">${t.ru}</p><div class="qsl">${t.ans.map(()=>'<i></i>').join('')}</div><div class="tl">${t.ans.concat(t.ex).sort(()=>Math.random()-.5).map(w=>`<button>${w}</button>`).join('')}</div><button class="ckb" disabled>Проверить</button>`
   :`<div class="op">${t.o.map((x,j)=>`<button data-j="${j}">${x}</button>`).join('')}</div>`;
  el.innerHTML=`<div class="in"><div class="hd"><small>${o.title} · ${i+1} из ${T.length}</small><span class="qsg">${T.map((x,j)=>`<i class="${j<i?'f':j===i?'c':''}"></i>`).join('')}</span></div>
   <em class="kk">${t.k}</em>${t.a||t.tts?`<button class="ear" data-vw>${ic('play')}${wv11(16)}<small>ещё раз</small></button>`:''}${t.ctx?`<p class="cx">${t.ctx}</p>`:''}<b class="qq">${t.q}</b>${body}<p class="why"></p>
   <div class="ft"><small class="nt">${o.note||''}</small><button class="nx" hidden>${i<T.length-1?'Дальше':'Готово'} ${ic('chev')}</button></div></div>`;
  if(!t.t){const O=$$('.op button',el);[...O].sort(()=>Math.random()-.5).forEach(b=>$('.op',el).appendChild(b))}
  an($('.in',el),i===0?[{transform:'translateY(110%)'},{transform:'none'}]:[{opacity:0,transform:'translateX(44px)'},{opacity:1,transform:'none'}],{sp:SPs});
  $$('.in>*',el).forEach((x,j)=>an(x,[{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:80+j*40}));
  if(t.a||t.tts){const ea=$('.ear',el);const play=m=>{ea.classList.add('spk');const end=()=>ea.classList.remove('spk');if(t.a)voice11(ctx,t.a,{mute:m,end});else if(!m){if(!say(t.tts,{end}))ctx.t(end,1800)}else ctx.t(end,1800)};ctx.on(ea,'click',()=>play(false));ctx.t(()=>play(!o.loud),420)}
  const fin=(ok,why)=>{if(ok&&first)got++;$('.why',el).textContent=why;an($('.why',el),[{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{sp:SPs});$('.nt',el).hidden=true;$('.nx',el).hidden=false;an($('.nx',el),[{transform:'scale(.8)'},{transform:'none'}],{sp:SPb})};
  if(t.t==='tiles'){const SL=$$('.qsl i',el),TB=$$('.tl button',el),ck=$('.ckb',el);let pk=[];
   const put=b=>{if(pk.length>=SL.length||b.disabled)return;const s=SL[pk.length];pk.push(b);const a=rel(b,R),z=rel(s,R);b.disabled=true;s.textContent=b.textContent;s.className='f';an(s,[{transform:`translate(${a.x-z.x}px,${a.y-z.y}px)`},{transform:'none'}],{sp:SPs});ck.disabled=pk.length<SL.length};
   TB.forEach(b=>ctx.on(b,'click',()=>put(b)));
   ctx.on(ck,'click',()=>{const ok=pk.map(b=>b.textContent).join(' ')===t.ans.join(' ');if(!ok){first=false;shake($('.qsl',el),6,360);SL.forEach((s,j)=>{if(s.textContent!==t.ans[j])s.classList.add('bad')});ctx.t(()=>{pk=[];SL.forEach(s=>{s.textContent='';s.className=''});TB.forEach(b=>b.disabled=false);ck.disabled=true},800);return}
    ck.hidden=true;SL.forEach((s,j)=>{s.classList.add('ok');an(s,[{transform:'none'},{transform:'translateY(-7px)'},{transform:'none'}],{sp:SPb,dl:j*55})});const r=rel($('.qsl',el),R);fx&&fx.burst(r.x+r.w/2,r.y+r.h/2,{n:30,c:['#F2D35B','#fff','#4FD18B'],v:5,g:.1,s:3,l:40});fin(true,t.why)})}
  else{const O=$$('.op button',el);O.forEach(b=>ctx.on(b,'click',()=>{const j=+b.dataset.j,ok=j===t.r;O.forEach(x=>{x.disabled=true;const q=+x.dataset.j;x.classList.toggle('ok',q===t.r);x.classList.toggle('bad',q===j&&!ok)});
   const r=rel(b,R);if(ok)fx&&fx.burst(r.x+r.w/2,r.y+r.h/2,{n:30,c:['#F2D35B','#fff','#4FD18B'],v:5,g:.1,s:3,l:40});else{first=false;shake(b,5,300)}fin(ok,t.why)}))}
  ctx.on($('.nx',el),'click',()=>{i++;if(i<T.length)show();else{const z=an(el,[{opacity:1},{opacity:0}],{d:200,f:'forwards'});const f=()=>{el.remove();o.onDone&&o.onDone(got)};if(z)z.onfinish=f;else f()}})};
 show();return el}
// демо: само отвечает на задания (комикс, углублённая), пока не тронули
async function q11Demo(R,ctx,tch){for(let n=0;n<80;n++){await ctx.wait(1150);if(tch())return;
  const dp=$('.g11-dp .go',R);if(dp){dp.click();continue}if($('.g11-md',R))return;
  const q=$('.g11-q',R)||$('.k9-ck',R);if(!q)continue;const nx=$('.nx:not([hidden])',q);if(nx){nx.click();continue}const t=q._t;
  if(t&&t.t==='tiles'){for(let k=$$('.qsl i',q).filter(s=>s.textContent).length;k<t.ans.length;k++){const b=$$('.tl button',q).find(x=>!x.disabled&&x.textContent===t.ans[k]);if(b)b.click();await ctx.wait(260);if(tch())return}const ck=$('.ckb',q);if(ck&&!ck.disabled&&!ck.hidden)ck.click();continue}
  const op=$(`.op button[data-j="${t?t.r:0}"]:not([disabled])`,q);if(op)op.click()}}
// предложение углубить: не навязываем — «Хватит» ничего не отнимает
function deep11(R,ctx,o){const el=document.createElement('div');el.className='g11-dp';
 el.innerHTML=`<div class="in"><span class="md">${ic('deep11')}</span><small>${o.eb}</small><b>${o.t}</b><p>${o.p}</p><div class="cs">${o.chips.map(c=>`<span>${c}</span>`).join('')}</div><div class="bt"><button class="no">Хватит</button><button class="go">Углубить ${ic('chev')}</button></div><em class="ps">Не обязательно · можно потом из карточки героя</em></div>`;
 R.appendChild(el);an(el,[{opacity:0},{opacity:1}],{d:220});an($('.in',el),[{transform:'translateY(70px) scale(.96)',opacity:0},{transform:'none',opacity:1}],{sp:SPs});
 $$('.cs span',el).forEach((s,j)=>an(s,[{opacity:0,transform:'translateY(8px) scale(.9)'},{opacity:1,transform:'none'}],{sp:SPb,dl:220+j*70}));
 const close=f=>{const z=an(el,[{opacity:1},{opacity:0}],{d:200,f:'forwards'});const g=()=>{el.remove();f&&f()};if(z)z.onfinish=g;else g()};
 ctx.on($('.no',el),'click',()=>close(o.onNo));ctx.on($('.go',el),'click',()=>close(o.onGo));return el}
// медаль «углублено»: опыт герою, слова в словарь
function medal11(R,ctx,fx,got,n,hero,onClose){const el=document.createElement('div');el.className='g11-md';const h=HERO[hero]||HERO.venator,g=G11H[hero]||G11H.venator;const W=['stir','call on','sewer','gonna','will find'];
 el.innerHTML=`<div class="in"><span class="mdl"><i class="rays"></i><span class="cn">${ic('starf')}</span></span><small>УГЛУБЛЕНО · ${got} ИЗ ${n}</small><b>Глава закреплена на ★</b>
  <div class="xpr">${mini8(hero)}<span><b>${h.n} · +${got*5+20} опыта</b><i><i></i></i><small>${g.xp} → ${g.xp+got*5+20} из ${g.nx}</small></span></div>
  <div class="wd"><small>+${W.length} слов в «Мои слова»</small><div>${W.map(w=>`<span>${w}</span>`).join('')}</div></div><button class="ok">К герою</button></div>`;
 R.appendChild(el);an(el,[{opacity:0},{opacity:1}],{d:240});const mdl=$('.mdl',el);an(mdl,[{transform:'scale(0) rotate(-160deg)'},{transform:'scale(1.15) rotate(8deg)',offset:.7},{transform:'none'}],{d:760,e:EO,dl:120});
 ctx.t(()=>{const r=rel(mdl,R);fx&&fx.burst(r.x+r.w/2,r.y+r.h/2,{n:80,c:['#F2D35B','#fff','#E8B34B'],v:7.5,g:.1,s:3,l:62})},620);
 $$('.in>*:not(.mdl)',el).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:500+i*90}));
 const bi=$('.xpr i>i',el);bi.style.transform=`scaleX(${(g.xp/g.nx).toFixed(3)})`;ctx.t(()=>{bi.style.transform=`scaleX(${Math.min(1,(g.xp+got*5+20)/g.nx).toFixed(3)})`},900);
 $$('.wd span',el).forEach((s,i)=>an(s,[{opacity:0,transform:'translateY(10px) scale(.6)'},{opacity:1,transform:'none'}],{sp:SPb,dl:1100+i*90}));
 ctx.on($('.ok',el),'click',()=>{const z=an(el,[{opacity:1},{opacity:0}],{d:200,f:'forwards'});const f=()=>{el.remove();onClose&&onClose()};if(z)z.onfinish=f;else f()});return el}
// режимы: read — читать с начала (проверка в конце), check — сразу проверка (глава прочитана раньше), deep — сразу углублённая, reread — перечитать без проверки
function k11Comic(R,ctx,o){o=o||{};const mode=o.mode||'read',hero=o.hero||'venator';let fx=null;
 const offer=got=>{fx=fx||FX(ctx,$('.k8-fx',R)||(()=>{R.insertAdjacentHTML('beforeend','<canvas class="fx k8-fx"></canvas>');return $('.k8-fx',R)})());
  ctx.t(()=>deep11(R,ctx,{eb:'ГЛАВА ПРОЙДЕНА · '+got+' ИЗ 3',t:'Хочешь глубже?',p:'Ещё 6 коротких заданий по этой главе: на слух, слова, собрать фразу. Глава уже засчитана — это по желанию.',chips:['+6 заданий','+5 слов','≈ 1,5 мин','+50 опыта'],
   onNo(){toast(R,'Глава засчитана. «Углубить» — в карточке героя');o.onDone&&o.onDone('done')},onGo(){deep()}}),1500)};
 const deep=()=>{fx=fx||FX(ctx,$('.k8-fx',R));quiz11(R,ctx,KT11,{fx,title:'УГЛУБЛЁННАЯ',note:'по желанию',loud:o.loud,onDone(g){medal11(R,ctx,fx,g,KT11.length,hero,()=>{o.onDone&&o.onDone('deep')})}})};
 if(mode==='read'){k9Comic(R,ctx,{demo:o.demo,onDone(got){offer(got)}});
  if(o.demo!==false){let touched=false;ctx.on(R,'pointerdown',()=>{touched=true},{capture:true});ctx.t(()=>q11Demo(R,ctx,()=>touched),9000)}
  return}
 // глава прочитана раньше: комикс на последней странице, поверх — проверка или углублённая
 const KB=V.find(v=>v.id==='kb');KB.mount(R,ctx);R.classList.add('k8','k9','g11-kd');$$('button.hv,.k6-lh',R).forEach(x=>x.remove());R.insertAdjacentHTML('beforeend','<canvas class="fx k8-fx"></canvas>');fx=FX(ctx,$('.k8-fx',R));
 if(mode==='reread'){toast(R,'Перечитываешь — без проверки');return}
 if(o.demo){let touched=false;ctx.on(R,'pointerdown',()=>{touched=true},{capture:true});ctx.t(()=>q11Demo(R,ctx,()=>touched),1200)}
 if(mode==='deep'){ctx.t(deep,500);return}
 ctx.t(()=>quiz11(R,ctx,KT11c,{fx,title:'ПРОВЕРКА ГЛАВЫ',note:'чтобы глава засчиталась',onDone(got){const st=$('.k3-stamp',R);if(st){st.style.visibility='';st.innerHTML=`ГЛАВА ПРОЙДЕНА<small>${got} ИЗ 3 · +${got*10} ОПЫТА</small>`;st.classList.add('on');an(st,[{transform:'translate(-50%,-50%) rotate(-12deg) scale(2.6)',opacity:0},{transform:'translate(-50%,-50%) rotate(-12deg) scale(1)',opacity:1}],{d:480,e:EO})}fx.burst(172,330,{n:70,c:['#F2D35B','#fff','#E8B34B'],v:7,g:.12,s:3,l:60});offer(got)}}),500)}

V.push({g:'g11',id:'g11t',n:'Игры · вкладка (большая карточка)',
 idea:'Вкладка «Игры» — как запуск игры. Карточка Deadlock «включается», как старый экран: полоса развёртки, кадр раскрывается по высоте, город поднимается тремя слоями, неон DEADLOCK загорается с миганием. Дальше живое: идёт дождь, бьёт молния (город на миг светлее), по мосту едет поезд, ходят прожекторы, в окнах мигает свет, на переднем плане — живые Венатор и Король друг против друга. Пальцем — карточка наклоняется, слои города едут с разной глубиной, по стеклу бежит блик. Ниже — «Сейчас в Deadlock»: что ждёт тебя прямо сейчас (перехват на радаре, глава ждёт проверки, друг зовёт в Versus). Всё нажимается — открывает то, что написано.',
 moves:['включение: полоса → кадр раскрывается → город поднимается → неон мигает и горит','дождь с брызгами, молния каждые 7–11 с, поезд по мосту, прожекторы, окна','герои выезжают с краёв, «VS» бьёт с искрами — карточка вздрагивает','нажал — Deadlock раскрывается из карточки на весь экран'],
 from:'Твой отзыв на v9: «вкладка игры и в мини-версии строчка прикольная — улучши ещё анимации сильно».',
 minus:'Дождь и видео — нагрузка: на слабом телефоне оставим город и неон, а дождь и героев выключим.',
 mount(R,ctx){g11Tab(R,ctx,{})}});
V.push({g:'g11',id:'g11c',n:'Игры · строчкой',
 idea:'Та же вкладка, но Deadlock — строчкой (тебе понравилась мини-версия). В строчке — маленький живой «экран», на котором герои сменяют друг друга через помеху, неон DEADLOCK, мини-радар с «2». Сзади — тот же город, дождь и прожектор. Строчка «включается», как экран, и наклоняется за пальцем. Ниже — «Сейчас в Deadlock» и дуэль по сцене, чтобы вкладка не была пустой.',
 moves:['включение экрана: полоса развёртки → строчка раскрывается → неон мигает','на «экране» каждые 3–4 с помеха — Венатор сменяется Королём и обратно','дождь и прожектор за строчкой, радар крутится'],
 from:'Твой отзыв на v9: «вкладка игры и в мини-версии строчка прикольная — улучши ещё анимации сильно».',
 minus:'В строчке мелко — героев видно только на «экране». Если игр станет больше, строчки встанут списком — и это плюс.',
 mount(R,ctx){g11Tab(R,ctx,{compact:1})}});
V.push({g:'g11',id:'g11h',n:'Deadlock → герой → его комиксы',
 idea:'Вкладки «Комиксы» в Deadlock нет. Внутри: шапка, Versus с другом (живые герои друг против друга), Радар, и герои — крупными живыми карточками. На карточке — уровень, «1 новая» глава, «1 ждёт проверки». Нажал на героя — карточка растёт на весь экран: живой портрет на его фоне, кольцо уровня и опыт, «Versus за Венатора», голос героя ▶ и его комиксы главами — у каждой главы своё состояние: «Новая», «Проверка ждёт», «Закреплено» (+ «Углубить»), «Углублено ★», «нужен портрет Рэма». Ниже — его фразы с настоящим голосом из игры (▶ играет). Моё мнение — как ты сказал: комиксы лучше искать через героя, который нравится. Второй путь — Радар.',
 moves:['Deadlock раскрывается из карточки, неон загорается, герои Versus выезжают, «VS» бьёт','карточки героев наклоняются за пальцем, за портретом — живой фон','герой растёт из своей плитки, кольцо уровня и опыт заполняются','прокрутка: портрет уезжает медленнее, сверху остаётся строка с именем'],
 from:'Твой отзыв на v9: «вкладки комиксы не должно быть в ДД — именно при нажатии персонажа, ну васян должен сам их искать будто… или нет? че думаешь — будто логично».',
 minus:'Кто не нажмёт на героя, найдёт комиксы только Радаром. Поэтому на карточке героя — «1 новая» и «1 ждёт проверки», а на вкладке «Игры» — «Глава ждёт проверки».',
 mount(R,ctx){g11Tab(R,ctx,{compact:1,auto:false});ctx.t(()=>{const card=$('.g11-card',R);g11Hub(R,ctx,card)},400)}});
V.push({g:'g11',id:'g11k',n:'Комикс · «глубже?» по желанию',
 idea:'Как было: читаешь главу свободно, в конце — проверка из 3 заданий (чтобы глава засчиталась), печать «Глава пройдена». Новое — после неё карточка «Хочешь глубже?»: ещё 6 заданий по этой главе — на слух (с настоящим голосом), слово, фраза, собрать реплику. Ловушки настоящие: «sewer» — и «канализация», и «швея». Две кнопки: «Хватит» и «Углубить». «Хватит» ничего не отнимает — глава уже засчитана; «Углубить» можно потом с карточки героя (у главы — кнопка «Углубить»). В конце — медаль «Углублено ★», опыт герою и 5 слов в «Мои слова». В первый раз — только обязательные 3, дальше — как захочешь.',
 moves:['после «Готово» печать падает, снизу выезжает «Хочешь глубже?», плашки — по одной','на слух — волна бежит, пока звучит голос; «ещё раз» — повтор','собрать реплику — кубики летят в клетки, верно — подпрыгивают','медаль: вращается и встаёт, искры, опыт героя заполняется, слова выпрыгивают'],
 from:'Твой отзыв на v9: «комикс проверка после главы в целом норм, но добавь возможность, если васян хочет сделать углублённую проверку — больше слов, больше заданий… ты его не заставляешь, первый раз ток это».',
 minus:'Шесть заданий — потолок: дальше это уже урок, а не комикс.',
 mount(R,ctx){k11Comic(R,ctx,{mode:'read',hero:'venator'})}});
