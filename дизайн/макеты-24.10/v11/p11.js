/* ================= v11 · Сцена · путь: последняя полировка перед релизом ================= */
function p11(R,ctx,k){p10(R,ctx,k);R.classList.add('p11','p11-'+k);
 // шторка эпизода — только по нажатию (в v10 выезжала сама и закрывала путь)
 try{R.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))}catch(e){}
 const T=PT8[k],s=SC4[T.s],N=s.eps.length,NB=$$('.p8-n',R),ar=$('.p8-ar',R),rd=$('.p8-rd',R),rw=$('.p8-rw',R),deco=$('.p8-deco',R);
 // кадр эпизода в кружке — сразу видно, что за момент
 NB.forEach((n,j)=>{const fr=s.eps[j][3];if(fr)n.insertAdjacentHTML('afterbegin',`<i class="p11-fr" style="background-image:url(${IMG[fr]})"></i>`)});
 // «ты здесь» над текущим эпизодом
 const here=document.createElement('span');here.className='p11-here';here.innerHTML=`${ic('play')}ты здесь`;ar.appendChild(here);
 const place=a=>{const j=NB.findIndex(n=>n.classList.contains('cur'));if(j<0){here.style.opacity='0';return}const n=NB[j];here.style.opacity='1';here.style.left=(parseFloat(n.style.left)+28)+'px';here.style.top=(parseFloat(n.style.top)-30)+'px';if(a)an(here,[{transform:'translate(-50%,-10px) scale(.6)',opacity:0},{transform:'translate(-50%,0)',opacity:1}],{sp:SPb})};
 place();an(here,[{opacity:0},{opacity:1}],{d:300,dl:1400});ctx.on($('.p8-go',R),'click',()=>ctx.t(()=>place(true),80));
 // награда: не тусклый кружок, а карточка фона — что получишь и сколько осталось
 const done0=()=>NB.filter(n=>n.classList.contains('dn')).length;
 const rwT=()=>{const d=done0(),left=N-d;return `<span class="p11-rwt"><small>${left>0?'ФОН ЗА СЦЕНУ':'ФОН ТВОЙ'}</small><b>${T.rwn.replace('Фон ','')}</b><em>${left>0?`ещё ${left} ${left===1?'эпизод':left<5?'эпизода':'эпизодов'}`:'лежит в «Коллекции»'}</em></span><i class="p11-pr"><i style="width:${Math.round(d/N*100)}%"></i></i>`};
 rw.insertAdjacentHTML('beforeend',`<i class="p11-lk">${ic('lock')}</i><span class="p11-rwb">${rwT()}</span>`);
 ctx.on($('.p8-go',R),'click',()=>ctx.t(()=>{$('.p11-rwb',rw).innerHTML=rwT();rw.classList.toggle('p11-got',done0()>=N);an(rw,[{transform:'scale(1)'},{transform:'scale(1.06)'},{transform:'scale(1)'}],{d:420})},120));
 // пунктир от последнего эпизода к награде
 const L=NB[N-1],lx=parseFloat(L.style.left)+28,ly=parseFloat(L.style.top)+28,rx=158,ry=k==='sopranos'?88:88;
 rd.insertAdjacentHTML('afterbegin',`<path class="p11-cn" d="M${lx} ${ly} C${lx} ${(ly+ry)/2} ${rx} ${(ly+ry)/2+20} ${rx} ${ry}"/>`);
 // у «Во все тяжкие» путь короткий (2 эпизода) — фон не пустой: плитки элементов и голубые кристаллы
 if(k==='bb')deco.insertAdjacentHTML('beforeend',`<div class="p11-pt">${[['Br',35,'bromine'],['Ba',56,'barium'],['Li',3,'lithium'],['Cs',55,'caesium'],['C',6,'carbon'],['H',1,'hydrogen'],['N',7,'nitrogen'],['Hg',80,'mercury']].map(([sy,n,nm],i)=>`<i style="left:${[18,212,236,20,120,250,60,160][i]}px;top:${[150,120,250,300,60,380,410,250][i]}px;animation-delay:${(-i*1.7).toFixed(1)}s"><small>${n}</small><b>${sy}</b><em>${nm}</em></i>`).join('')}</div><div class="p11-cr">${Array.from({length:12},(_,i)=>`<i style="left:${(8+(i*29)%300)}px;animation-delay:${(-i*1.3).toFixed(1)}s;animation-duration:${(9+(i%4)*2)}s"></i>`).join('')}</div>`);
 // у «Сопрано» — ручка «дописывает» маршрут; у «Волка» — котировки мигают; у «Титаника» — пузырьки в воде
 if(k==='titanic'){const w=$('.p9-wt',R);if(w)w.insertAdjacentHTML('beforeend',`<div class="p11-bub">${Array.from({length:9},(_,i)=>`<i style="left:${(6+(i*37)%300)}px;animation-delay:${(-i*.9).toFixed(1)}s;animation-duration:${(4+(i%3)*1.5)}s"></i>`).join('')}</div>`)}
 // вход: награда выезжает сверху, пунктир прорисовывается
 const cn=$('.p11-cn',R);an(cn,[{opacity:0},{opacity:1}],{d:600,dl:1200});
 an(rw,[{opacity:0,transform:'translateY(-20px) scale(.9)'},{opacity:1,transform:'none'}],{sp:SPs,dl:900});
 // демо: подсветить «ты здесь», потом показать, как открывается эпизод (и закрыть сразу)
 let touched=false;ctx.t(()=>{ctx.on(R,'pointerdown',()=>{touched=true},{capture:true})},50);
 (async()=>{for(let n=0;n<6;n++){await ctx.wait(n?4200:2600);if(touched)return;const j=NB.findIndex(x=>x.classList.contains('cur'));if(j<0)return;an(here,[{transform:'translate(-50%,0)'},{transform:'translate(-50%,-8px)'},{transform:'translate(-50%,0)'}],{d:520,e:EO})}})()}
const P11IDEA='Путь — тот, что ты одобрил, последняя полировка перед релизом: 1) шторка эпизода больше не выезжает сама и не закрывает путь — только по нажатию; 2) в кружках эпизодов — кадр этого эпизода (у фильмов, где кадры есть), кружки крупнее; 3) над текущим — «ты здесь»; 4) награда наверху — не тусклый кружок, а карточка фона: что получишь, замок и «ещё N эпизодов», от последнего эпизода к ней — пунктир; 5) у «Во все тяжкие» путь короткий — на фоне плитки элементов и падающие голубые кристаллы, у «Титаника» — пузырьки в воде. Дальше — переношу путь в приложение: сначала только у тебя (админа), проверишь — включу всем.';
[['titanic','Титаник'],['wolf','Волк'],['sopranos','Сопрано · блокнот Мелфи'],['bb','Во все тяжкие']].forEach(([k,n])=>V.push({g:'p11',id:'p11'+k[0],n,idea:P11IDEA,
 moves:['путь дорисовывается, эпизоды выскакивают, у награды — блик','«ты здесь» подпрыгивает над текущим эпизодом','тап по эпизоду — шторка «Фразы · Слова» (сама больше не выезжает)','«Смотреть» — эпизод засчитан: «ты здесь» переезжает, у награды «ещё N» меняется'],
 from:'Твой отзыв на v9: «сцены путь ахуенно, просто чуть улучши всё, что есть, и можем релизить».',
 minus:'У «Сопрано» и «Во все тяжкие» кадров эпизодов в макете нет — в кружке номер. В приложении кадры есть у всех сцен (NN-k.jpg).',
 mount(R,ctx){p11(R,ctx,k)}}));
