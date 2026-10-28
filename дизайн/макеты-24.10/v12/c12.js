/* --- Комикс v12: настоящие реплики главы 1; без подписей-спойлеров («последнее слово — за Венатором»); иконки — как у игрока в интерфейсе --- */
const CM12=[{w:'venator',a:'ven-evil-stirs',en:'Evil <u>stirs</u> in New York... and so the Vatican has <u>called on</u> me.',ru:'В Нью-Йорке пробуждается зло… и Ватикан призвал меня.'},
 {w:'rat',a:'rk-sewers',en:"I thought I said you weren't <u>supposed to</u> <u>show your face</u> in the sewers again?!",ru:'Кажется, я велел тебе больше не совать морду в канализацию?!'},
 {w:'venator',a:'ven-no-hide',en:"You can't <u>hide</u> from a Venator.",ru:'От Венатора не спрячешься.'},
 {w:'rat',a:'rk-priest-vs-king',en:"What's a priest <u>gonna</u> do to a king?!",ru:'И что поп сделает королю?!'},
 {w:'venator',a:'ven-will-find',en:'I will <u>find</u> you.',ru:'Я тебя найду.'}];
const CMW12={'stirs':'шевелится, пробуждается','called on':'призвал, позвал на помощь','supposed to':'должен был (велели)','show your face':'показываться, совать нос','hide':'прятаться','gonna':'= going to, собирается','find':'найти'};
const CQ12=[{q:'Что значит «show your face» у Короля?',o:['показываться, совать нос','умыться','сделать фото'],r:0,why:'show your face (somewhere) — появляться там, где тебя не ждут.'},
 {q:'Какое слово прозвучало?',l:"You can't ▢▢▢▢ from a Venator.",a:'ven-no-hide',o:['hide','hate','head'],r:0,why:'hide from — прятаться от.'},
 {q:'«What\'s a priest gonna do?» — gonna это…',o:['going to — собирается','gone — ушёл','want to — хочет'],r:0,why:'gonna = going to: «что поп собирается сделать?»'}];
function comic12(R,ctx,style,o){o=o||{};const NE=style==='neutral',SP=style==='split';R.className='scr v8 k12 k12s-'+style;let i=-1,touched=false,loud=false,bedOn=true;
 const nm=k=>NE?'':H12[k].n;
 const head=SP?'':`<div class="k12-hd"><button class="bk">${ic('back')}</button><span class="tt"><small>DEADLOCK · ГЛАВА 1</small><b>${NE?'Глава 1':'Охота объявлена'}</b></span>${NE?'':'<button class="ict" aria-label="Иконки"></button>'}</div>
  ${NE?'':`<div class="k12-who"><span class="st">Начал${ic('chev')}</span>${hic12('venator')}<b>Venator</b><i></i><small>Туннели под собором · ночь</small></div>`}
  <div class="k12-pr">${CM12.map(x=>`<i class="${NE?'':x.w}">${NE?'':hic12(x.w)}</i>`).join('')}</div>`;
 const mem=`<div class="k12-mem"><span><b>3</b> фразы — в повторение</span><span class="dp">${ic('deep11')}углубить: ещё <b>6</b></span></div>`;
 R.innerHTML=`${SB(0)}${head}
  ${SP?`<div class="k12-sp"><div class="hf t" data-k="rat"><span class="hbg">${heroBg11('rat')}</span><video muted loop playsinline data-hv="hv_rat3" poster="${IMG.hv_rat3}"></video><i class="dm"></i><span class="kbl"></span></div>
    <div class="mid"><button class="bk">${ic('back')}</button><span class="kdots">${CM12.map(()=>'<i></i>').join('')}</span><button class="snd on">${ic('snd')}</button></div>
    <div class="hf b" data-k="venator"><span class="hbg">${heroBg11('venator')}</span><video muted loop playsinline data-hv="hv_venator2" poster="${IMG.hv_venator2}"></video><i class="dm"></i><span class="kbl"></span></div></div>`
   :`<div class="k12-pnl"><div class="fr"><div class="in"></div></div></div><div class="k12-ru"></div>${NE?'':mem}`}
  ${SP?'':`<div class="k12-ft"><button class="kpv">${ic('back')}</button><button class="pl">${ic('play')}<span>Слушать</span></button><button class="nx">${ic('chev')}</button></div><button class="k12-snd on">${ic('snd')}<span>фон</span></button>`}
  <div class="k12-end" hidden></div><canvas class="fx"></canvas><i class="hb"></i>`;
 playV12(R);const fx=FX(ctx,$('.fx',R));ctx.on(R,'pointerdown',()=>{touched=true;loud=true},{capture:true});
 const icb=$('.ict',R);if(icb)icToggle(R,ctx,icb,()=>{$$('.k12-pr i',R).forEach((x,j)=>{x.innerHTML=hic12(CM12[j].w)});const w=$('.k12-who',R);if(w){const m=$('.m8',w);if(m)m.outerHTML=hic12('venator')}if(i>=0)show(i,true)});
 const sndB=$('.k12-snd',R)||$('.k12-sp .snd',R);ctx.on(sndB,'click',e=>{e.stopPropagation();bedOn=!bedOn;sndB.classList.toggle('on',bedOn);if(!bedOn)SND12.bedStop();toast(R,bedOn?'Фон туннелей под репликами: вкл':'Фон выкл — как сейчас, сухо')});
 const wrap=t=>t.replace(/<u>(.*?)<\/u>/g,(m,w)=>`<button class="kw" data-w="${w}">${w}</button>`);
 function voice(x,b){if(!b)return;b.classList.add('say');say12(ctx,x.a,{loud,bed:bedOn?'sewer':null,dry:!bedOn,end(){b.classList.remove('say')}})}
 function show(n,re){if(n>=CM12.length){end();return}i=n;const x=CM12[n],side=x.w==='venator'?'l':'r';
  if(SP){$$('.k12-sp .hf',R).forEach(h=>{const on=h.dataset.k===x.w;h.classList.toggle('on',on);h.classList.toggle('off',!on);$('.kbl',h).innerHTML=''});
   const h=$(`.k12-sp .hf[data-k="${x.w}"]`,R),bl=$('.kbl',h);bl.innerHTML=`<div class="bq"><span class="tx">${wrap(x.en)}</span><small>${x.ru}</small><button class="pl">${ic('play')}</button></div>`;
   an($('.bq',bl),[{opacity:0,transform:`translateY(${x.w==='rat'?14:-14}px) scale(.94)`},{opacity:1,transform:'none'}],{sp:SPs});
   $$('.k12-sp .kdots i',R).forEach((d,j)=>d.classList.toggle('on',j<=n));voice(x,$('.bq',bl));ctx.on($('.bq .pl',bl),'click',e=>{e.stopPropagation();voice(x,$('.bq',bl))});return}
  const IN=$('.k12-pnl .in',R);const por=NE?`<span class="sil ${side}"></span>`:`<span class="por ${side}"><span class="hbg">${heroBg11(x.w)}</span><video muted loop playsinline data-hv="${H12[x.w].v}" poster="${IMG[H12[x.w].v]}" style="object-position:${H12[x.w].pos}"></video><i class="dm"></i></span>`;
  IN.innerHTML=`${por}<div class="bb ${side}"><span class="tx">${wrap(x.en)}</span><button class="pl">${ic('play')}</button></div>${NE?'':`<span class="tag ${side}">${hic12(x.w)}<b>${x.w==='venator'?'Venator':'Rat King'}</b></span>`}`;
  playV12(IN);an(IN,[{opacity:0,transform:`translateX(${side==='l'?-26:26}px)`},{opacity:1,transform:'none'}],{sp:SPs});an($('.bb',IN),[{opacity:0,transform:'scale(.8)'},{opacity:1,transform:'none'}],{sp:SPb,dl:160});
  $('.k12-ru',R).innerHTML=`${NE?'':`<b>${x.w==='venator'?'VENATOR':'RAT KING'}</b>`}<span>${x.ru}</span>`;
  $$('.k12-pr i',R).forEach((d,j)=>{d.classList.toggle('on',j===n);d.classList.toggle('dn',j<n)});
  if(!re)voice(x,$('.bb',IN));ctx.on($('.bb .pl',IN),'click',e=>{e.stopPropagation();voice(x,$('.bb',IN))})}
 ctx.on(R,'click',e=>{const k=e.target.closest('.kw');if(k){e.stopPropagation();toast(R,`${k.dataset.w} — ${CMW12[k.dataset.w]||''}`);an(k,[{transform:'scale(1.15)'},{transform:'none'}],{sp:SPb});return}
  const b=e.target.closest('.k12-ft button');if(b){an(b,[{transform:'scale(.9)'},{transform:'none'}],{sp:SPb});if(b.classList.contains('nx'))show(i+1);else if(b.classList.contains('kpv'))show(Math.max(0,i-1));else{const x=CM12[i];if(x)voice(x,$('.bb',R))}return}
  if(SP&&e.target.closest('.k12-sp .hf')&&!$('.k12-end',R).hidden===false)show(i+1);
  if(e.target.closest('.bk')){if(o.onBack)o.onBack();else toast(R,'← назад в Deadlock')}});
 // конец главы: кто начал, кто последний, как запомнится; проверка — 3 вопроса, «углубить» — по желанию
 function end(){const E=$('.k12-end',R);E.hidden=false;
  E.innerHTML=`<div class="cd">${NE?`<div class="rv"><span class="p l"><video muted loop playsinline data-hv="hv_venator2" poster="${IMG.hv_venator2}"></video></span><span class="p r"><video muted loop playsinline data-hv="hv_rat3" poster="${IMG.hv_rat3}"></video></span></div><small>ЭТО БЫЛИ</small><b>Venator и Rat King</b><em>Глава 1 · «Охота объявлена»</em>`
    :SP?`<small>ГЛАВА 1</small><b>Охота объявлена</b><em>Venator и Rat King · 5 реплик</em>`:`<small>ГЛАВА ПРОЧИТАНА</small><b>Охота объявлена</b><em>начал ${hic12('venator')} Venator · последнее слово — тоже за ним</em>`}
   <div class="hw"><small>Как запомнится</small><span>${ic('check')}<b>3 фразы</b> — проверка сейчас, потом завтра в повторение</span><span>${ic('deep11')}<b>ещё 6 слов главы</b> — по желанию: stirs, called on, gonna…</span><span>${ic('star')}<b>опыт Венатора</b> — +30, ×2 за углубление</span></div>
   <button class="go">${ic('check')}Проверка · 3 вопроса · ≈ 30 с</button><button class="ls">Позже — следующая глава открыта</button></div>`;
  playV12(E);an($('.cd',E),[{opacity:0,transform:'translateY(40px) scale(.94)'},{opacity:1,transform:'none'}],{sp:SPs});$$('.cd>*',E).forEach((x,j)=>an(x,[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:120+j*60}));
  if(NE){an($('.rv .l',E),[{transform:'rotateY(90deg)'},{transform:'none'}],{sp:SPs,dl:300});an($('.rv .r',E),[{transform:'rotateY(-90deg)'},{transform:'none'}],{sp:SPs,dl:420})}
  ctx.on($('.go',E),'click',()=>check(E));ctx.on($('.ls',E),'click',()=>toast(R,'На герое — значок «1 глава ждёт проверки»'))}
 function check(E){let n=0,ok=0;const step=()=>{if(n>=CQ12.length){done();return}const q=CQ12[n];
   E.innerHTML=`<div class="cd ck"><div class="csg">${CQ12.map((_,j)=>`<i class="${j<n?'f':j===n?'c':''}"></i>`).join('')}</div><small>ПРОВЕРКА ГЛАВЫ · ${n+1} ИЗ 3</small><b class="q">${q.q}</b>${q.l?`<button class="ln">${ic('play')}<span>${q.l}</span></button>`:''}<div class="op">${q.o.map((x,j)=>`<button data-j="${j}">${x}</button>`).join('')}</div><p class="why" hidden>${q.why}</p></div>`;
   an($('.cd',E),[{opacity:0,transform:'translateX(30px)'},{opacity:1,transform:'none'}],{sp:SPs});const l=$('.ln',E);if(l)ctx.on(l,'click',()=>voice({a:q.a},l));
   $$('.op button',E).forEach(b=>ctx.on(b,'click',()=>{$$('.op button',E).forEach(x=>{x.disabled=true;x.classList.toggle('ok',+x.dataset.j===q.r)});if(+b.dataset.j!==q.r){b.classList.add('bad');shake(b,5,300)}else ok++;$('.why',E).hidden=false;ctx.t(()=>{n++;step()},1500)}))};step();
  function done(){E.innerHTML=`<div class="cd dn"><i class="stp">ГЛАВА<br>ЗАКРЕПЛЕНА<small>${ok} из 3 · +30 опыта</small></i><div class="hw"><span>${ic('check')}<b>${ok} фразы</b> — завтра вернутся в повторение</span></div>
    <div class="dp"><small>ПО ЖЕЛАНИЮ</small><b>Углубить главу · ещё 6 слов</b><em>≈ 1 мин · ×2 опыта Венатора</em><div class="bt"><button class="pri">Углубить</button><button>Хватит — дальше</button></div></div></div>`;
   an($('.stp',E),[{opacity:0,transform:'scale(2.2) rotate(-14deg)'},{opacity:1,transform:'rotate(-8deg)'}],{d:420,e:EO});fx.burst(172,300,{n:50,c:['#F6D488','#fff','#E23A4E'],v:6,g:.1,s:2.6,l:50});
   $$('.dp .bt button',E).forEach(b=>ctx.on(b,'click',()=>toast(R,b.classList.contains('pri')?'6 заданий: stirs, called on, supposed to…':'Следующая глава — «Проповедь свинца»')))}}
 if(o.start==='check'){i=CM12.length-1;end();return}
 ctx.t(()=>show(0),SP?900:700);
 // без касания — листает сам (молча)
 const auto=()=>{if(touched||!$('.k12-end',R).hidden)return;show(i+1);if(i<CM12.length)ctx.t(auto,3400)};ctx.t(auto,4200)}

/* --- Обучение v12: «додрочить» любую сцену — по желанию. Посмотрел, знаешь 31 из 100 — хватит? иди дальше. Хочешь ещё 30 или все 100 — без проблем, за это награды и респект --- */
function dots12(n,known,add){let s='';for(let j=0;j<n;j++)s+=`<i class="${j<known?'k':j<known+add?'a':''}" style="--j:${j}"></i>`;return s}
function deep12(R,ctx,kind){R.className='scr v8 dp12 dp12-'+kind;let touched=false;ctx.on(R,'pointerdown',()=>{touched=true},{capture:true});
 if(kind==='scene'){R.innerHTML=`${SB(0)}<div class="dp12-top"><i class="img" style="background-image:url(${IMG.bd_psycho})"></i><i class="sh"></i><small>АМЕРИКАНСКИЙ ПСИХОПАТ · ЭП. 1 ПРОЙДЕН</small><b>Ты знаешь <em class="n">31</em> из 100 слов сцены</b></div>
   <div class="dp12-grid">${dots12(100,31,0)}</div>
   <p class="dp12-q">Хватит — норм. Хочешь ещё — без проблем.</p>
   <div class="dp12-ch"><button class="dc0" data-a="0"><b>Дальше смотреть</b><small>эпизод 2 · прогресс останется</small></button>
    <button class="dc1" data-a="30"><span class="tg">УГЛУБЛЁННОЕ</span><b>Ещё 30 слов</b><small>≈ 6 мин · двумя подходами</small><em>${ic('star')}кадр «Офис» в рамке</em></button>
    <button class="dc2" data-a="69"><span class="tg">ПОЛНОЕ</span><b>Все 100</b><small>≈ 20 мин · частями, когда хочешь</small><em>${ic('starf')}золотой фон сцены + «Знаток сцены»</em></button></div>
   <p class="dp12-nt">Никто не заставляет. Ушёл — вернёшься с 32-го слова.</p><canvas class="fx"></canvas><i class="hb"></i>`;
  const G=$$('.dp12-grid i',R),N=$('.dp12-top .n',R),fx=FX(ctx,$('.fx',R));
  G.forEach((d,j)=>an(d,[{opacity:0,transform:'scale(.2)'},{opacity:1,transform:'none'}],{d:300,dl:200+j*7,e:EO}));countUp(ctx,N,31,1100);
  $$('.dp12-ch button',R).forEach((b,j)=>an(b,[{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:900+j*80}));
  const prev=a=>{G.forEach((d,j)=>{d.classList.toggle('a',j>=31&&j<31+a)});N.textContent=31+a;N.classList.toggle('up',a>0)};
  $$('.dp12-ch button',R).forEach(b=>{ctx.on(b,'pointerenter',()=>prev(+b.dataset.a));ctx.on(b,'pointerleave',()=>prev(0));
   ctx.on(b,'click',()=>{touched=true;const a=+b.dataset.a;an(b,[{transform:'scale(.96)'},{transform:'none'}],{sp:SPb});if(!a){toast(R,'Эпизод 2 — поехали. 31 из 100 сохранено');return}prev(a);
    const r=rel($('.dp12-grid',R),R);fx.burst(r.x+r.w/2,r.y+r.h/2,{n:40,c:a>30?['#F6D488','#fff','#E8B34B']:['#2EE6C5','#fff'],v:5,g:.05,s:2.2,l:44});toast(R,a>30?'Полное: 10 слов за подход, можно бросить в любой момент':'Углублённое: 15 слов сейчас, 15 — когда захочешь')})});
  ctx.t(()=>{if(!touched){prev(30);$('.dc1',R).classList.add('hv');ctx.t(()=>{if(touched)return;prev(69);$('.dc1',R).classList.remove('hv');$('.dc2',R).classList.add('hv');ctx.t(()=>{if(!touched){prev(0);$('.dc2',R).classList.remove('hv')}},1800)},1800)}},2600);return}
 if(kind==='full'){const M=[[50,'рамка кадра','got'],[75,'живой фон сцены',''],[100,'«Знаток сцены» в профиле','']];
  R.innerHTML=`${SB(0)}<div class="dp12-fh"><small>ПОЛНОЕ ОБУЧЕНИЕ · «ОФИС»</small><b>64 из 100</b><span>осталось ≈ 7 мин · 4 подхода по 10 слов</span></div>
   <div class="dp12-ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" class="bg"/><circle cx="60" cy="60" r="52" class="fg" style="--p:.64"/>${M.map(([p])=>{const a=(p/100)*Math.PI*2-Math.PI/2;return `<circle cx="${(60+Math.cos(a)*52).toFixed(1)}" cy="${(60+Math.sin(a)*52).toFixed(1)}" r="4.6" class="ms${p<=64?' got':''}"/>`}).join('')}</svg><b>64<small>%</small></b></div>
   <div class="dp12-ms">${M.map(([p,n,g])=>`<span class="${p<=64?'got':''}"><b>${p}</b><em>${n}</em><i>${p<=64?ic('check'):ic('star')}</i></span>`).join('')}</div>
   <div class="dp12-nx"><small>СЛЕДУЮЩИЙ ПОДХОД</small><span>${['sculpted','tan','reservation','lunch','partner','merger'].map(w=>`<i>${w}</i>`).join('')}<i class="m">+4</i></span><button class="pri">Продолжить с 65-го слова</button><button>Передохнуть — прогресс не сгорит</button></div><canvas class="fx"></canvas><i class="hb"></i>`;
  const fg=$('.dp12-ring .fg',R);an(fg,[{strokeDashoffset:'326.7'},{strokeDashoffset:String(326.7*(1-.64))}],{d:1300,e:EO,f:'forwards'});countUp(ctx,$('.dp12-ring b',R).firstChild,64,1300);
  $$('.dp12-ms span,.dp12-nx>*',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:500+i*70}));
  $$('.dp12-nx button',R).forEach(b=>ctx.on(b,'click',()=>{an(b,[{transform:'scale(.96)'},{transform:'none'}],{sp:SPb});toast(R,b.classList.contains('pri')?'10 слов · ≈ 2 мин':'Ок — продолжишь, когда захочешь')}));return}
 // комикс Deadlock: те же уровни; прокачка в комиксе видна в Versus — иконка героя получше
 R.innerHTML=`${SB(0)}<div class="dp12-ch2"><span class="dhc">${hic12('venator','big')}<span><small>VENATOR · ГЛАВА 1</small><b>Закреплено 3 из 3</b></span></span>
   <div class="dxp"><i style="--p:.68"></i><span>ур. 2 · 340 / 500</span></div></div>
  <p class="dp12-q">Дальше — как хочешь.</p>
  <div class="dp12-ch"><button class="dc0"><b>Следующая глава</b><small>«Проповедь свинца» · 7 реплик</small></button>
   <button class="dc1"><span class="tg">УГЛУБЛЁННОЕ</span><b>Ещё 6 слов главы</b><small>≈ 1 мин · ×2 опыта</small><em>${ic('star')}+60 опыта Венатора</em></button>
   <button class="dc2"><span class="tg">ВЕСЬ ВЕНАТОР</span><b>Все 25 его фраз</b><small>≈ 6 мин · частями</small><em>${ic('starf')}золотая иконка — видно в Versus</em></button></div>
  <div class="dp12-ico"><small>Что даёт уровень героя в Versus</small><div class="irow">${['ур. 1','ур. 3','все фразы'].map((n,j)=>`<span class="ti${j}"><i class="ic12">${hic12('venator')}</i><em>${n}</em></span>`).join('')}</div><p>Силы не даёт — честно для всех. Это вид: рамка иконки, вход героя в бой, его реплика победы.</p></div><i class="hb"></i>`;
 $$('.dp12-ch button,.dp12-ico',R).forEach((b,j)=>an(b,[{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:300+j*80}));an($('.dp12-ch2 .dxp i',R),[{transform:'scaleX(0)'},{transform:'scaleX(var(--p))'}],{d:1100,e:EO,f:'forwards',dl:200});
 $$('.dp12-ch button',R).forEach(b=>ctx.on(b,'click',()=>{an(b,[{transform:'scale(.96)'},{transform:'none'}],{sp:SPb});toast(R,$('b',b).textContent)}))}

/* --- «Понимаешь %»: как считаю до и после (Андрей: «не понятно, как ты будешь понимать, сколько Васян понимает после диалога») --- */
function pct12(R,ctx,o){o=o||{};const dd=o.dd;R.className='scr v8 pc12';
 const IT=dd?[['evil stirs',1],['called on',0],['supposed to',1],['show your face',0],['hide from',1],['gonna',1],['priest',1],['find you',0],['king',1],['sewers',0],['crumbum',0],['merciful',1]]
  :[['Nice tan',1],['reservation',1],['I have to return some videotapes',0],['sculpted',0],['Is that Patrick?',1],['merger',1],['partner',1],['lunch',1],['Dorsia',0],['business card',1],['impressive',0],['nice try',1]];
 const known=IT.filter(x=>x[1]).length,N=IT.length,AFT=dd?[1,3]:[3,8],pct=v=>Math.round(v/N*100);
 R.innerHTML=`${SB(0)}<div class="pc12-hd"><small>${dd?'DEADLOCK · ГЛАВА 1':'АМЕРИКАНСКИЙ ПСИХОПАТ · ЭП. 1'}</small><b>Как считаю «понимаешь %»</b></div>
  <div class="pc12-big"><span class="b"><em>до</em><b class="v0">${pct(known)}</b><small>%</small></span><i class="ar">${ic('chev')}</i><span class="a"><em>после</em><b class="v1">${pct(known)}</b><small>%</small></span></div>
  <p class="pc12-f">В ${dd?'главе':'сцене'} <b>${N} ключевых</b> слов и фраз (их размечает Зетка). <b>Знаешь</b> — если хоть раз ответил верно с первой попытки и повторение не просрочено, здесь или в другой сцене.</p>
  <div class="pc12-it">${IT.map((x,j)=>`<span class="${x[1]?'k':''}" data-j="${j}">${x[0]}</span>`).join('')}</div>
  <div class="pc12-st"><span><b>${known}</b> из ${N} знал до</span><span class="p"><b>+${AFT.length}</b> ответил верно сейчас</span></div>
  <p class="pc12-n">Ошибся — процент не падает. Вместо «−3 %» пишу «2 слова просят повторения».</p><canvas class="fx"></canvas><i class="hb"></i>`;
 const fx=FX(ctx,$('.fx',R));$$('.pc12-it span',R).forEach((x,i)=>an(x,[{opacity:0,transform:'scale(.7)'},{opacity:1,transform:'none'}],{sp:SPb,dl:200+i*40}));
 const go=()=>{AFT.forEach((j,n)=>ctx.t(()=>{const s=$(`.pc12-it [data-j="${j}"]`,R);s.classList.add('k','nw');an(s,[{transform:'scale(1.3)'},{transform:'none'}],{sp:SPb});const r=rel(s,R);fx.burst(r.x+r.w/2,r.y+r.h/2,{n:16,c:['#4FD18B','#fff'],v:3,g:0,s:1.8,l:28});
  if(n===AFT.length-1){countUp(ctx,$('.v1',R),pct(known+AFT.length),700,pct(known));$('.pc12-big .a',R).classList.add('up')}},n*700))};ctx.t(go,1600);
 ctx.on(R,'click',e=>{if(e.target.closest('.pc12-it,.pc12-big')){$$('.pc12-it .nw',R).forEach(s=>s.classList.remove('k','nw'));$('.v1',R).textContent=pct(known);$('.pc12-big .a',R).classList.remove('up');ctx.t(go,300)}})}

/* --- Мнения ChatGPT, Gemini и Зетки об обучении — Андрей проверит и ответит; ответы помнит браузер, «Скопировать» — текстом в чат --- */
const OP12=[['g','ChatGPT',[['g1','После эпизода две равные кнопки: «Закрепить 3 · ~1 мин» и «Смотреть дальше». Тест сам не открывается.'],['g2','3 пункта по умолчанию, максимум 5. Беден эпизод — 1–2, не добивать до нормы.'],['g3','Процент — по ключевым выражениям сцены, не по всем словам субтитров.'],['g4','Почему ошибка — одна строка у выбранного; остальное по кнопке «Почему другие нет?».'],['g5','Комикс: статусы «Прочитано» и «Закреплено», следующую главу не закрываем.'],['g6','Ошибся — ещё раз в конце этой же сессии, а завтра обычный повтор.'],['g7','Пропустил день — не наказывать.'],['g8','Нажатые слова — в повторение только по «Сохранить».']]],
 ['m','Gemini',[['m1','Первый вопрос — прямо на экране конца эпизода, «Пропустить» — мелко.'],['m2','В каждом задании и в повторении звучит оригинальная реплика из фильма.'],['m3','«На слух» — звучит вся фраза, угадываешь слово в ней.'],['m4','Собрать — из 2–4 крупных кусков, перевод фразы показан.'],['m5','В разборе всей сцены — «Уже знаю» смахиванием: процент растёт.'],['m6','Без счётчика долгов: «3 вопроса — разогрев», а не «Повторить 45».'],['m7','Бот присылает вопрос из вчерашнего эпизода с кнопками ответа прямо в чате.'],['m8','Комикс: проверка как в игре — портрет, реплика с пропуском, 4 варианта; строго обязательно.'],['m9','Серия: заморозка, если пропустил день.']]],
 ['z','Зетка',[['z1','Прогресс до и после: «понимаешь 71 %» до эпизода — цель, «71 → 74 %» после — маленькая победа.','Не совсем понятно, как ты будешь понимать, сколько Васян понимает после диалога.','Показал на экране «Как считаю %»: у сцены или главы ~40 (у главы ~12) ключевых слов и фраз, их размечает Зетка. «Знаешь» = хоть раз ответил верно с первой попытки и повторение не просрочено, в любой сцене. После эпизода или главы прибавляются только те, на что ответил верно сейчас. Ошибка процент не роняет.'],
   ['z2','Падение — не процентом: вместо «−3 %» — «2 слова просят повторения».'],['z3','Приоритет нажатых: нажал в двух сценах — учим первым, дальше разметка, потом нажатое один раз.'],['z4','Комикс с клапаном: 3 задания после главы, можно «позже» — значок «2 главы ждут проверки», следующую не блокируем.'],['z5','Разбор всей сцены: «Продолжить с 12-й реплики», «осталось ~4 мин», вопрос раз в ~9 реплик, финал без субтитров.'],['z6','Пятый тип задания: твоё слово в новой реплике этой же сцены — «я это знаю!».'],['z7','Помнить выбор «Слова · Фразы · Всё», не спрашивать каждый раз.'],['z8','Замер: медиана «Закрепить» не дольше 90 с, уползла — режем порцию.'],['z9','Все нажатые слова — в завтрашнее повторение.'],
   ['z10','«Не разливай уровень героя дальше комикса».','Хз, что в Versus будет давать уровень? Он же там не нужен. Или анимации другие, иконка? Прокачал в комиксе — в Versus иконка получше.','Да, так: уровень силы не даёт (иначе нечестно). Он меняет вид — рамку иконки (ур. 1 → 3 → «все фразы» золотая), вход героя в бой и его реплику победы. Показал на экране «Комикс · углубить».'],
   ['z11','Push-уведомления с содержанием.','Можно попробовать: приходит фрагмент, и можно перейти в приложение на нужный тайминг.','Беру так: одно сообщение в день — «Фраза дня» становится куском из твоего же эпизода. Кнопка открывает эпизод ровно на этой секунде. Второго сообщения в день нет.'],
   ['z12','Заморозка серии и восстановление за 3 задания.']]]];
function ops12(R,ctx){R.className='scr v8 op12';let S={};try{S=JSON.parse(localStorage.getItem('kd12-op')||'{}')}catch(e){}
 const save=()=>{try{localStorage.setItem('kd12-op',JSON.stringify(S))}catch(e){}};
 const cnt=()=>{let a=0,n=0;OP12.forEach(([,,L])=>L.forEach(x=>{n++;if(x[2]||S[x[0]])a++}));return [a,n]};
 R.innerHTML=`${SB(0)}<div class="op12-hd"><b>Обучение: мнения нейронок</b><small>отметь, что берём — я сделаю. Отметки помнит браузер.</small><em class="ct"></em></div>
  <div class="op12-ls">${OP12.map(([c,n,L])=>`<div class="op12-g ${c}"><b class="gh">${n}<small>${L.length}</small></b>${L.map(x=>`<div class="op12-i${x[2]?' ans':''}" data-id="${x[0]}"><p>${x[1]}</p>${x[2]?`<div class="yo"><small>ТЫ</small>${x[2]}</div><div class="me"><small>Я</small>${x[3]}</div>`:`<div class="bt">${[['y','Беру'],['n','Нет'],['l','Потом']].map(([v,t])=>`<button data-v="${v}" class="${S[x[0]]===v?'on':''}">${t}</button>`).join('')}</div>`}</div>`).join('')}</div>`).join('')}</div>
  <div class="op12-ft"><button class="cp">Скопировать ответы</button></div><i class="hb"></i>`;
 const ct=()=>{const [a,n]=cnt();$('.op12-hd .ct',R).textContent=`${a} из ${n}`};ct();
 $$('.op12-g',R).forEach((g,i)=>an(g,[{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:120+i*90}));
 ctx.on($('.op12-ls',R),'click',e=>{const b=e.target.closest('.bt button');if(!b)return;const it=b.closest('.op12-i'),id=it.dataset.id;S[id]=S[id]===b.dataset.v?'':b.dataset.v;save();$$('.bt button',it).forEach(x=>x.classList.toggle('on',S[id]===x.dataset.v));an(b,[{transform:'scale(.9)'},{transform:'none'}],{sp:SPb});ct()});
 ctx.on($('.cp',R),'click',()=>{const T={y:'беру',n:'нет',l:'потом'};let t='Мнения об обучении — мои ответы:\n';OP12.forEach(([,n,L])=>{t+=`\n${n}:\n`;L.forEach(x=>{if(x[2])return;t+=`${x[0]}. ${x[1]} — ${S[x[0]]?T[S[x[0]]]:'?'}\n`})});
  const ok=()=>toast(R,'Скопировал — вставь мне в чат');try{navigator.clipboard.writeText(t).then(ok,()=>{prompt('Скопируй:',t)})}catch(e){prompt('Скопируй:',t)}})}
