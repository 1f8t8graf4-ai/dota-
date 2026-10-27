// ===== v13 · патчноут-разбор Deadlock (27.10, Андрей: «сделай патчноут — что нового и кто в мете по статистике, добавь в v13») =====
// Изменения — deadlock.wiki (Update: 14, 16, 20, 21, 22 октября 2026); статистика — api.deadlock-api.com/v1/analytics/hero-stats,
// все ранги: «до» — 6.10–14.10, «сейчас» — после патча 22.10 (598 тыс. матчей), «высокие ранги» — min_average_badge=101.
// Два вида: «В приложении» (экран внутри Deadlock) и «Пост в канал» (готовый текст, кнопка «Скопировать»).
const PN13={date:'27 октября',n:'598 тыс.',
 news:[{t:'nerf',h:'Бабу ослабили',d:'14.10',p:'Щит 100 → 90, рост щита от духа 1,2 → 0,7, перезарядки дольше на 2 с, −7 % защиты от пуль.',r:['52,7 %','53,7 %'],rn:'побед: до патча → сейчас',v:'Ослабили, а побеждать стала чаще. На высоких рангах — 58,4 %.'},
  {t:'buff',k:'danny',h:'Дэдмена Дэнни усилили',d:'14.10',p:'Здоровье 680 → 730, урон пули 12 → 15, Strix Salvo перезаряжается 25 с вместо 30.',r:['38,4 %','50,9 %'],rn:'побед: первые сутки → сейчас',v:'Из самых слабых — в середину таблицы.'},
  {t:'new',h:'Два новых героя',d:'16 и 20.10',p:'Violet и Nurse Harrow. Харроу есть в двух матчах из трёх — самый частый выбор.',r:['52,0 %','51,7 %'],rn:'побед: Violet · Харроу'},
  {t:'fix',k:'doorman',h:'Фиксы',d:'21–22.10',p:'Дормену починили двери, Варден в Last Stand не боится страха Харроу, Виктор больше не умирает в Shocking Reanimation.'}],
 top:[['Graves',57.4,45],['Rat King',55.7,55,'rat'],['Paige',54.9,28],['Victor',54.4,31,'victor'],['Seven',54.0,33,'seven']],
 low:[['Rem',44.9,30,'rem'],['Mirage',44.7,10],['Pocket',44.4,16],['Mina',44.4,39],['Sinclair',44.4,10]],
 ours:[['rat','Крысиный король',2,55.7],['victor','Виктор',4,54.4],['seven','Севен',5,54.0],['danny','Дэдмен Дэнни',17,50.9],['celeste','Селеста',25,48.4],['venator','Венатор',30,47.1],['talon','Грей Талон',31,46.6],['doorman','Дормен',39,45.4],['rem','Рэм',40,44.9]],
 words:[['nerf','ослабить','Baba got nerfed.','Бабу ослабили.'],['buff','усилить','Danny got a big buff.','Дэнни сильно усилили.'],['cooldown','перезарядка','The cooldown went from 26 to 28 seconds.','Перезарядка выросла с 26 до 28 секунд.'],
  ['win rate','процент побед','Graves has the highest win rate.','У Graves самый высокий процент побед.'],['pick rate','как часто берут','Nurse Harrow has a huge pick rate.','Харроу берут очень часто.'],['bug fix','исправление ошибки','Victor got a bug fix.','Виктору исправили ошибку.']]};
const PN13T={nerf:['▼','Ослабили'],buff:['▲','Усилили'],new:['✦','Новое'],fix:['✓','Фиксы']};
const PN13POST=`⚡️ Deadlock: что нового и кто в мете (${PN13.date})

Последний баланс-патч — 14 октября, потом два новых героя и фиксы. Считал по ${PN13.n} матчей после 22.10.

🔻 Бабу ослабили: щит 100→90, перезарядки дольше. А побед стало больше: 52,7% → 53,7%, на высоких рангах — 58,4%.
🔺 Дэдмену Дэнни подняли почти всё: здоровье 680→730, урон пули 12→15. В первые сутки — 38% побед, сейчас — 51%.
🆕 Nurse Harrow есть в двух матчах из трёх — самый частый выбор. Violet — 52% побед.
🔧 Варден в Last Stand больше не боится страха Харроу, Виктор не умирает в Shocking Reanimation.

🏆 Топ по победам: Graves 57,4% · Rat King 55,7% · Paige 54,9% · Victor 54,4% · Seven 54,0%
📉 Хуже всех: Sinclair, Mina, Pocket — по 44,4%

📚 Слово дня: nerf — ослабить. «Baba got nerfed, but she still wins.» — «Бабу ослабили, а она всё равно побеждает».

Рейтинговый сезон 1 — до 5 ноября.`;
function pn13(R,ctx,o){o=o||{};let mode=o.mode||'app';R.className='scr v8 pn13';
 const av=(k,n)=>k&&MINI(k)?mini8(k,'pn13-av'):`<i class="pn13-av pn13-lt">${n[0]}</i>`;
 const bar=(x,i,cl)=>`<div class="pn13-br ${cl}" data-i="${i}">${av(x[3],x[0])}<span><b>${x[0]}</b><small>есть в ${x[2]} % матчей</small></span><em>${x[1].toFixed(1).replace('.',',')} %</em><i style="--w:${Math.max(.06,(x[1]-42)/16)}"></i></div>`;
 const app=()=>`<div class="pn13-hd"><i class="img" style="background-image:url(${IMG.dl_cover})"></i><i class="sh"></i>
   <span><small>DEADLOCK · ПАТЧНОУТ</small><b>Что нового<br>и кто в мете</b><em>${PN13.date} · последний баланс-патч 14.10</em></span><i class="pn13-n"><b>${PN13.n}</b>матчей после 22.10</i></div>
  <h4 class="pn13-h">Главное за две недели</h4>
  ${PN13.news.map((x,i)=>`<div class="pn13-c ${x.t}" data-i="${i}"><header><i class="pn13-tg">${PN13T[x.t][0]} ${PN13T[x.t][1]}</i>${x.k?mini8(x.k,'pn13-av sm'):''}<small>${x.d}</small></header><b>${x.h}</b><p>${x.p}</p>
   ${x.r?`<div class="pn13-r"><span>${x.r[0]}</span><i>${ic('chev')}</i><span class="nw">${x.r[1]}</span><small>${x.rn}</small></div>`:''}${x.v?`<p class="pn13-v">${x.v}</p>`:''}</div>`).join('')}
  <h4 class="pn13-h">Кто в мете · процент побед</h4>
  <div class="pn13-bl">${PN13.top.map((x,i)=>bar(x,i,'up')).join('')}</div>
  <h4 class="pn13-h">Слабее всех</h4>
  <div class="pn13-bl">${PN13.low.map((x,i)=>bar(x,i,'dn')).join('')}</div>
  <h4 class="pn13-h">Наши герои · место из 44</h4>
  <div class="pn13-our">${PN13.ours.map(x=>`<button data-k="${x[0]}">${mini8(x[0],'pn13-av')}<b>${x[2]}</b><small>${x[1]}</small><em>${x[3].toFixed(1).replace('.',',')} %</em></button>`).join('')}</div>
  <h4 class="pn13-h">Слова из патча · нажми</h4>
  <div class="pn13-w">${PN13.words.map((x,i)=>`<button data-w="${i}"><b>${x[0]}</b><small>${x[1]}</small></button>`).join('')}</div>
  <p class="pn13-src">Изменения — deadlock.wiki, обновления 14–22.10. Статистика — deadlock-api.com: ${PN13.n} матчей с 22 по 27.10, все ранги; «до» — 6–14.10. Цифры округлены.</p>`;
 const post=()=>`<div class="pn13-tg2"><header><i class="pn13-ch">D</i><span><b>Твой канал</b><small>предпросмотр поста</small></span></header>
  <div class="pn13-pic" style="background-image:url(${IMG.dl_cover})"><span>ПАТЧНОУТ · ${PN13.date.toUpperCase()}</span></div>
  <div class="pn13-txt">${PN13POST.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/^(.*)$/m,'<b>$1</b>')}</div></div>
  <button class="pn13-cp">Скопировать пост</button><p class="pn13-src">Текст готов для Telegram: эмодзи и строки как в посте. Картинка — обложка, в канале поставишь свою.</p>`;
 const draw=()=>{R.innerHTML=`${SB(0)}<div class="pn13-sw"><button data-m="app" class="${mode==='app'?'on':''}">В приложении</button><button data-m="post" class="${mode==='post'?'on':''}">Пост в канал</button><i></i></div><div class="pn13-bd">${mode==='app'?app():post()}</div><canvas class="fx"></canvas>`;
  const fx=FX(ctx,$('.fx',R));R.classList.toggle('pm',mode==='post');
  if(mode==='app'){$$('.pn13-c',R).forEach((c,i)=>an(c,[{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:120+i*90}));
   $$('.pn13-br',R).forEach((b,i)=>{const w=b.lastElementChild;an(w,[{transform:'scaleX(0)'},{transform:`scaleX(${getComputedStyle(w).getPropertyValue('--w')})`}],{d:900,dl:300+i*70,e:'cubic-bezier(.2,.8,.2,1)',f:'forwards'})});
   $$('.pn13-our button',R).forEach((b,i)=>an(b,[{opacity:0,transform:'scale(.8)'},{opacity:1,transform:'none'}],{sp:SPb,dl:200+i*40}));
   const nw=$('.pn13-c.buff .nw',R);if(nw)ctx.t(()=>{const r=rel(nw,R);fx.burst(r.x+r.w/2,r.y+r.h/2,{n:18,c:['#4FD18B','#fff'],v:3,g:0,s:1.8,l:30})},900)}
  else{an($('.pn13-tg2',R),[{opacity:0,transform:'translateY(24px) scale(.97)'},{opacity:1,transform:'none'}],{sp:SPs})}};
 draw();
 ctx.on(R,'click',e=>{const m=e.target.closest('[data-m]');if(m&&m.dataset.m!==mode){mode=m.dataset.m;draw();$('.pn13-bd',R).scrollTop=0;return}
  const w=e.target.closest('[data-w]');if(w){const x=PN13.words[+w.dataset.w];an(w,[{transform:'scale(1.1)'},{transform:'none'}],{sp:SPb});toast(R,`${x[2]} — ${x[3]}`);return}
  const h=e.target.closest('.pn13-our [data-k]');if(h){const x=PN13.ours.find(y=>y[0]===h.dataset.k);an(h,[{transform:'scale(1.08)'},{transform:'none'}],{sp:SPb});toast(R,`${x[1]}: ${x[2]}-е место из 44, ${x[3].toFixed(1).replace('.',',')} % побед`);return}
  if(e.target.closest('.pn13-cp')){const t=PN13POST,ok=()=>toast(R,'Скопировал — вставь в канал'),sel=()=>{const el=$('.pn13-txt',R),rg=document.createRange();rg.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(rg);toast(R,'Текст выделен — скопируй')};
   try{navigator.clipboard.writeText(t).then(ok,sel)}catch(er){sel()}}});
}
