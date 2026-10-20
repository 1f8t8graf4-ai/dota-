// 13.9.21: звуки из файлов — наборы «Кино» (по умолчанию) и «Как в iPhone».
// Набор грузится лениво на первом касании и только выбранный; играет буфером с первого не-тихого сэмпла; пока не готов — синтез «cs» (тишины нет);
// звук выключен — тишина; магазин (бесплатно, ▶ не подменяет выбранный), старый выбор игрока остаётся, билеты звенят «coin»;
// админка → «Анимации» → «Звуки»; громкость новых — рядом с прежними (рендер в OfflineAudioContext через ту же цепочку MASTER → компрессор)
const {open}=require('./st');const {chromium}=require('playwright');
const dev=process.argv[2]||'ph';
let fails=0;const ok=(n,c,d)=>{if(!c)fails++;console.log(c?'PASS':'FAIL',n,d===undefined?'':typeof d==='string'?d:JSON.stringify(d));};
const init=([st,fl])=>{if(!sessionStorage.getItem('__seeded')){sessionStorage.setItem('__seeded','1');localStorage.setItem('dota_quiz_v4',JSON.stringify(st));localStorage.setItem('dota_flags_v1',JSON.stringify(fl));}
  // шпион: какие буферы запущены (с какого места и с какой скоростью) и сколько генераторов синтеза создано
  const P=(window.BaseAudioContext||window.AudioContext||{}).prototype;if(!P)return;const cb=P.createBufferSource,co=P.createOscillator;window.__bs=[];window.__bb=[];window.__os=0;
  P.createBufferSource=function(){const s=cb.call(this);if(this instanceof OfflineAudioContext)return s;const st=s.start.bind(s);
    s.start=(...a)=>{window.__bs.push({d:s.buffer?+s.buffer.duration.toFixed(3):0,off:+(a[1]||0).toFixed(4),r:+s.playbackRate.value.toFixed(4)});window.__bb.push(s.buffer);return st(...a);};return s;};
  P.createOscillator=function(){if(!(this instanceof OfflineAudioContext))window.__os++;return co.call(this);};};
const base={onboarded:true,introV:1,unl:1,snd:true,fx:false,knWin:'full'};
(async()=>{const b=await chromium.launch();const vp=dev==='pc'?{width:1440,height:900}:{width:390,height:844};
  const go=async(st,fl)=>open({browser:b,uid:111,platform:dev==='pc'?'tdesktop':'ios',touch:dev!=='pc',ctx:{viewport:vp},wait:2200,init,initArg:[st,fl||{admin:false,flags:{}}]});
  const {page:P,errs}=await go(base);
  const last=()=>P.evaluate(()=>window.__bs[window.__bs.length-1]||null);
  const isBuf=(k,n)=>P.evaluate(([k,n])=>{const b=window.__bb[window.__bb.length-1];return !!(b&&SFXB[k]&&SFXB[k][n]&&SFXB[k][n].buf===b);},[k,n]);
  // 1. до первого касания ничего не грузится
  let r=await P.evaluate(()=>({d:!!window.SFXD,tag:!!document.querySelector('script[src*="sfx-"]'),cur:sfxCur()}));
  ok('до первого касания файлы звуков не грузятся; набор по умолчанию — «Кино»',!r.d&&!r.tag&&r.cur==='kino',r);
  // 2. первое касание — грузится только «Кино», 20 событий декодированы
  if(dev==='pc')await P.mouse.click(8,vp.height-8);else await P.touchscreen.tap(8,vp.height/2);
  await P.waitForFunction(()=>window.SFXB&&SFXB.kino,null,{timeout:6000}).catch(()=>{});
  r=await P.evaluate(()=>{const B=SFXB.kino||{},E=SFX_EV.filter(e=>B[e]);return {n:E.length,ios:!!(window.SFXD&&SFXD.ios),src:(document.querySelector('script[src*="sfx-kino"]')||{}).getAttribute?document.querySelector('script[src*="sfx-kino"]').getAttribute('src'):'',
    dur:Object.fromEntries(E.map(e=>[e,+(B[e].buf.duration-B[e].off).toFixed(3)])),off:Object.fromEntries(E.map(e=>[e,+B[e].off.toFixed(4)]))};});
  ok('первое касание: загружен только набор «Кино» (с версией в адресе), все 20 событий декодированы',r.n===20&&!r.ios&&/sfx-kino\.js\?v=13\.9\.\d+/.test(r.src),{n:r.n,ios:r.ios,src:r.src});
  const LIM={tap:.4,sel:.4,whoosh:.4,tick:.4,hint:.4,page:.4,reel:.4,nope:.4,match:.4,good:.8,bad:.8,learn:.8,coin:.8,announce:.8,firstblood:.8,roshan:.8,win:1.2,lose:1.2,reward:1.2,unlock:1.2};
  const over=Object.entries(r.dur).filter(([e,d])=>d>LIM[e]+.08);
  ok('длины: интерфейс ≤ 0,4 с, ответы ≤ 0,8, награды ≤ 1,2 (+ хвост mp3)',!over.length,over.length?over:{tap:r.dur.tap,good:r.dur.good,reward:r.dur.reward});
  const offs=Object.values(r.off);ok('тишина кодера в начале срезана: старт с 2–60 мс у всех',offs.every(x=>x>.002&&x<.06),{min:Math.min(...offs),max:Math.max(...offs)});
  // 3. играет буфер, с вычисленного места, тап — с разбросом высоты
  await P.evaluate(()=>{window.__bs.length=0;window.__bb.length=0;window.__os=0;});
  for(let i=0;i<10;i++)await P.evaluate(()=>sfx('tap'));
  r=await P.evaluate(()=>({n:window.__bs.length,os:window.__os,rates:window.__bs.map(x=>x.r),off:window.__bs[0]&&window.__bs[0].off,want:+SFXB.kino.tap.off.toFixed(4)}));
  ok('тап: играет файл «Кино», без синтеза, с места после тишины',r.n===10&&r.os===0&&r.off===r.want&&await isBuf('kino','tap'),{n:r.n,os:r.os,off:r.off,want:r.want});
  const rs=r.rates;ok('тап: высота гуляет ±3 % (не «пулемёт»)',rs.every(x=>x>=.969&&x<=1.031)&&new Set(rs).size>5,rs);
  await P.evaluate(()=>sfx('good'));r=await last();ok('«верно» — файл «Кино», скорость 1',(await isBuf('kino','good'))&&r.r===1,r);
  // 4. звук выключен — тишина
  r=await P.evaluate(()=>{store.snd=false;const a=window.__bs.length,o=window.__os;['tap','good','win','coin','reward'].forEach(n=>sfx(n));const res={bs:window.__bs.length-a,os:window.__os-o};store.snd=true;return res;});
  ok('звук выключен в настройках — ни файлов, ни синтеза',r.bs===0&&r.os===0,r);
  // 5. «Как в iPhone»: пока не загружен — синтез (не тишина), потом файл
  // у синтеза шум — тоже буфер (NOISE), поэтому «файлом» считаем только буферы наборов
  const fileN=(a)=>`window.__bb.slice(${a}).filter(b=>Object.values(SFXB).some(B=>Object.values(B).some(x=>x.buf===b))).length`;
  r=await P.evaluate(f=>{shopS().use.snd='ios';save();shopApply();const a=window.__bb.length,o=window.__os;sfx('tap');return {file:eval(f.replace('A',a)),os:window.__os-o,cur:sfxCur()};},fileN('A'));
  ok('выбрал «Как в iPhone»: первый звук — запасной синтез, пока набор грузится (тишины нет)',r.cur==='ios'&&r.file===0&&r.os>0,r);
  await P.waitForFunction(()=>SFXB.ios,null,{timeout:6000}).catch(()=>{});
  await P.evaluate(()=>sfx('tap'));ok('…через миг — уже файл «iPhone»',await isBuf('ios','tap'));
  await P.evaluate(()=>sfx('bad'));ok('ошибка в «iPhone» — свой файл',await isBuf('ios','bad'));
  // 6. «Прежние» — синтез, без файлов
  r=await P.evaluate(f=>{shopS().use.snd='cs';save();shopApply();const a=window.__bb.length,o=window.__os;sfx('tap');sfx('good');return {file:eval(f.replace('A',a)),os:window.__os-o};},fileN('A'));
  ok('«Прежние» — старый синтез, файлов нет',r.file===0&&r.os>0,r);
  // 7. магазин: три бесплатных набора первыми, ▶ не подменяет выбранный
  await P.evaluate(()=>{shopS().use.snd='ios';save();shopApply();renderShop('snd');});await P.waitForTimeout(700);
  r=await P.evaluate(()=>[...document.querySelectorAll('.shp')].slice(0,3).map(t=>({n:(t.querySelector('b,h3,.shp-n')||t).textContent.trim().slice(0,30),buy:!!t.querySelector('[data-buy]'),on:!!t.querySelector('.shp-b.on')})));
  ok('магазин → Звуки: «Кино», «Как в iPhone», «Прежние» — первыми и бесплатно',r.length===3&&/Кино/.test(r[0].n)&&/iPhone/.test(r[1].n)&&/Прежние/.test(r[2].n)&&r.every(x=>!x.buy)&&r[1].on,r);
  await P.evaluate(()=>{window.__bs.length=0;window.__bb.length=0;});
  await P.click('.shp [data-try="kino"]');await P.waitForTimeout(1900);
  r=await P.evaluate(()=>({n:window.__bs.length,kino:window.__bb.filter(b=>Object.values(SFXB.kino).some(x=>x.buf===b)).length,cur:sfxCur()}));
  ok('▶ у «Кино» играет «Кино» (4 звука), выбранный «iPhone» не трогает',r.kino>=4&&r.cur==='ios',r);
  await P.evaluate(()=>sfx('good'));ok('после ▶ звучит по-прежнему выбранный «iPhone»',await isBuf('ios','good'));
  await P.click('.shp [data-use="kino"]');await P.waitForTimeout(400);
  r=await P.evaluate(()=>({cur:sfxCur(),use:store.shop.use.snd}));ok('«Выбрать» «Кино» — выбор сохранён',r.cur==='kino'&&r.use==='kino',r);
  // 8. билеты: последний прилетевший — «coin»
  await P.evaluate(()=>{renderTab('learn');window.__bs.length=0;window.__bb.length=0;store.gold=(store.gold||0)+25;goldFX(25);});await P.waitForTimeout(300);
  ok('билеты (без анимаций): звенит «coin»',await isBuf('kino','coin'));
  await P.evaluate(()=>{store.fx=true;window.__bs.length=0;window.__bb.length=0;store.gold=(store.gold||0)+25;goldFX(25);});await P.waitForTimeout(2600);
  r=await P.evaluate(()=>({n:window.__bb.length,tick:window.__bb.filter(b=>b===SFXB.kino.tick.buf).length,lastCoin:window.__bb[window.__bb.length-1]===SFXB.kino.coin.buf}));
  await P.evaluate(()=>{store.fx=false;});
  ok('билеты с анимацией: тики по прилёту, последний — «coin»',r.tick>=2&&r.lastCoin,r);
  // 9. громкость: новые наборы рядом с прежним синтезом (та же цепочка MASTER → компрессор, офлайн-рендер)
  const L=await P.evaluate(async()=>{const EV=['tap','sel','tick','page','good','bad','nope','coin','win','reward'];const out={};
    const meas=async fn=>{const oc=new OfflineAudioContext(1,44100*1.6,44100);oc.resume=()=>Promise.resolve();const keep=[AC,MASTER];
      AC=oc;MASTER=oc.createGain();MASTER.gain.value=.9;const cp=oc.createDynamicsCompressor();MASTER.connect(cp);cp.connect(oc.destination);
      try{fn();}catch(e){}AC=keep[0];MASTER=keep[1];const bf=await oc.startRendering(),d=bf.getChannelData(0);let pk=0;for(const v of d)pk=Math.max(pk,Math.abs(v));
      const w=441,fr=[];for(let i=0;i+w<=d.length;i+=w){let s=0;for(let j=i;j<i+w;j++)s+=d[j]*d[j];fr.push(Math.sqrt(s/w));}const mx=Math.max(...fr),act=fr.filter(x=>x>mx*.0316);
      const rms=Math.sqrt(act.reduce((a,x)=>a+x*x,0)/(act.length||1));return {pk:+(20*Math.log10(pk||1e-9)).toFixed(1),rms:+(20*Math.log10(rms||1e-9)).toFixed(1)};};
    for(const n of EV){out[n]={};for(const k of ['cs','kino','ios']){const P=sfxPack(k);out[n][k]=await meas(()=>P[n]());}}return out;});
  const rows=Object.entries(L).map(([n,v])=>`${n}: cs ${v.cs.rms}/${v.cs.pk} · kino ${v.kino.rms}/${v.kino.pk} · ios ${v.ios.rms}/${v.ios.pk}`);console.log('  громкость RMS/пик, dBFS:\n   '+rows.join('\n   '));
  // громкость после канала файлов: щелчки тихо (−42…−28), ответы (−35…−24), награды (−33…−21), пики не выше −5 dBFS
  const CL={tap:[-42,-28],sel:[-42,-28],tick:[-42,-28],page:[-42,-28],nope:[-42,-28],good:[-35,-24],bad:[-35,-24],coin:[-35,-24],win:[-33,-21],reward:[-33,-21]};
  const bad=[];Object.entries(L).forEach(([n,v])=>['kino','ios'].forEach(k=>{const [lo,hi]=CL[n];if(v[k].rms<lo||v[k].rms>hi||v[k].pk>-5)bad.push(k+':'+n+' '+v[k].rms+'/'+v[k].pk);}));
  ok('громкость новых: щелчки тихие, ответы и награды заметнее, без перегруза',!bad.length,bad);
  // 10. (13.9.42: раздел админки «Анимации» со звуками удалён — наборы слушать в Магазине → Звуки)
  // 11. старый игрок с купленным «8-бит» остаётся на нём
  const O=await go(Object.assign({},base,{shop:{own:{'snd:arcade':Date.now()},use:{snd:'arcade'}},gold:0}));
  r=await O.page.evaluate(()=>sfxCur());ok('игрок, который купил «8-бит», остаётся на нём',r==='arcade',r);
  ok('консоль чистая',!errs.length&&!A.errs.length&&!O.errs.length,[...errs,...A.errs,...O.errs].slice(0,5));
  console.log(fails?`ИТОГ ${dev}: FAIL ${fails}`:`ИТОГ ${dev}: всё PASS`);await b.close();process.exit(fails?1:0);})();
