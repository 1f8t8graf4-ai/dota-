
/* ================= v14 (27.10, вечер, облако): канал, разбор патча, карта «было/стало», мод в Deadlock ================= */
/* Данные — настоящие из PN13 (deadlock.wiki + deadlock-api.com на 27.10) и файлов игры (SteamDatabase/GameTracking-Deadlock, 16–26.10). Карта и цифры мода — пример, подписано на экране. */
const C14H={rat:'Крысиный король',victor:'Виктор',seven:'Севен',danny:'Дэдмен Дэнни',celeste:'Селеста',venator:'Венатор',talon:'Грей Талон',doorman:'Дормен',rem:'Рэм',warden:'Варден',baba:'Баба',harrow:'Харроу',violet:'Вайолет'};
const C14AV=k=>{const u=typeof MINI==='function'?MINI(k):null;return u?`<i class="c4av" style="background-image:url(${u})"></i>`:`<i class="c4av t">${(C14H[k]||k)[0]}</i>`};
const C14CH=[
 {k:'baba',t:'nerf',ty:'hero',h:'Бабу ослабили',d:'14.10',rows:[['Щит','100','90'],['Рост щита от духа','1,2','0,7'],['Перезарядки','—','+2 с'],['Защита от пуль','—','−7 %']],win:['52,7 %','53,7 %'],you:'Ослабили, а побеждать стала чаще. На высоких рангах — 58,4 %. Брать можно.',w:['nerf','ослабить']},
 {k:'danny',t:'buff',ty:'hero',h:'Дэдмена Дэнни усилили',d:'14.10',rows:[['Здоровье','680','730'],['Урон пули','12','15'],['Strix Salvo, перезарядка','30 с','25 с']],win:['38,4 %','50,9 %'],you:'Из самых слабых — в середину таблицы. Если бросил его — пора вернуться.',w:['buff','усилить']},
 {k:'harrow',t:'new',ty:'new',h:'Новый герой — Медсестра Харроу',d:'20.10',rows:[['Leech Therapy','—','пиявки лечат'],['Lurking Terrors','—','страх'],['Healing Needles','—','шприцы'],['Wretched Vapors','—','ядовитый пар']],win:['—','51,7 %'],you:'Её берут в двух матчах из трёх. Учись играть против страха.',w:['leech','пиявка']},
 {k:'violet',t:'new',ty:'new',h:'Новая героиня — Вайолет',d:'16.10',rows:[['Living Ink','—','оживлённая краска'],['Flow State','—','поток'],['Still Life','—','натюрморт'],['Abstract Landscape','—','абстрактный пейзаж']],win:['—','52,0 %'],you:'Оружие называется «Creative Solutions». Пока 52 % побед.',w:['still life','натюрморт']},
 {k:'warden',t:'fix',ty:'fix',h:'Варден не боится страха в ульте',d:'22.10',rows:[['Last Stand + страх Харроу','боялся','иммунитет']],you:'Ульта больше не сбивается страхом Харроу.',w:['immune','неуязвимый']},
 {k:'doorman',t:'fix',ty:'fix',h:'Дормену починили двери',d:'21.10',rows:[['Двери','баг','работают']],you:'Если двери вели себя странно — это был баг, а не ты.',w:['bug fix','исправление']},
 {k:'victor',t:'fix',ty:'fix',h:'Виктор не умирает в Shocking Reanimation',d:'22.10',rows:[['Shocking Reanimation','мог умереть','не умирает']],you:'Ульту снова можно жать без страха.',w:['reanimation','оживление']},
 {k:'item',t:'new',ty:'item',h:'Два предмета: срабатывают по любым героям',d:'20.10',rows:[['Tech Overflow','по вражеским героям','по любым героям'],['Reinforcing Casings','по вражеским героям','по любым героям']],you:'Изменён текст предметов в файлах игры. Цифры пока не трогали.',w:['overflow','переполнение']}];
const C14T={nerf:['▼','Ослабили','#ff6b5b'],buff:['▲','Усилили','#5fd38a'],new:['✦','Новое','#FFD23F'],fix:['✓','Фикс','#8ab4ff']};
const C14CSS=`<style>
.c14{background:#0f0e0c;color:#efe9de;font:14px/1.4 Inter,system-ui,sans-serif}
.c14 .c4b{position:absolute;top:44px;left:0;right:0;bottom:0;overflow-y:auto;padding:10px 12px 40px;scrollbar-width:none}.c14 .c4b::-webkit-scrollbar{display:none}
.c14 h3{margin:4px 0 2px;font:800 21px/1.15 Inter,sans-serif}.c14 .c4s{color:#a59d8f;font-size:12.5px;margin-bottom:10px}
.c14 .c4av{display:inline-block;width:30px;height:30px;border-radius:50%;background:#2a2620 center/cover;flex:none;vertical-align:middle;box-shadow:0 0 0 1.5px #0007}
.c14 .c4av.t{display:inline-grid;place-items:center;font:800 13px/1 Inter;color:#111;background:#c9b48a;font-style:normal}
.c14 .seg{display:flex;background:#1d1b17;border-radius:12px;padding:3px;gap:3px;margin:6px 0 10px}.c14 .seg button{flex:1;border:0;border-radius:9px;padding:9px 4px;background:none;color:#a59d8f;font:700 12.5px/1 Inter}.c14 .seg button.on{background:#FFD23F;color:#111}
.c14 .chips{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;margin:0 -12px 8px;padding:0 12px}.c14 .chips::-webkit-scrollbar{display:none}
.c14 .chip{flex:none;border:1px solid #39342c;background:#1a1814;color:#d9d1c3;border-radius:16px;padding:6px 11px;font:700 12px/1 Inter;display:flex;align-items:center;gap:6px}.c14 .chip.on{background:#efe9de;color:#111;border-color:#efe9de}
.c14 .chip .c4av{width:20px;height:20px}
.c14 .card{background:#1a1814;border-radius:16px;padding:11px 12px;margin-bottom:8px;box-shadow:inset 0 0 0 1px #2b2721}
</style>`;

/* 1. Пост в канал — три подачи одной новости */
const C14P={
 news:{n:'Новости',t:`<b>⚡ Deadlock: что поменяли и кто в мете</b>

🔻 <b>Бабу ослабили</b>: щит 100→90, перезарядки дольше. А побед стало больше: 52,7% → 53,7%, на высоких рангах — 58,4%.
🔺 <b>Дэдмену Дэнни подняли почти всё</b>: здоровье 680→730, урон пули 12→15. Был 38% побед, сейчас 51%.
🆕 <b>Харроу</b> — в двух матчах из трёх. <b>Вайолет</b> — 52% побед.
🔧 Варден в ульте больше не боится страха Харроу.

📚 <b>nerf</b> — ослабить. «Baba got nerfed, but she still wins.»`},
 rofl:{n:'По рофлу',t:`<b>‼️ БАБУ ОСЛАБИЛИ. ОНА СТАЛА СИЛЬНЕЕ</b>

Valve порезали ей щит и перезарядки. Итог: побед было 52,7%, стало 53,7%. На высоких рангах — 58,4%.

Лучший нерф в истории. Понерфите меня так же, пожалуйста 🙏

Дэдмена Дэнни, наоборот, усилили — и он из бомжа поднялся в средний класс: 38% → 51% за неделю.

📚 nerf — ослабить. Valve сегодня, видимо, не знают, что это значит`},
 meme:{n:'Мем',meme:1,t:`Почему так?

📚 nerf — ослабить`}};
function c14p(R,ctx){let cur='rofl';
 R.className='scr v8 c14 c14p';
 R.innerHTML=C14CSS+`<style>
.c14p .tg{background:#0E1621}.c14p .c4b{background:#0E1621 linear-gradient(160deg,#0E1621,#132233)}
.c14p .chh{display:flex;align-items:center;gap:10px;padding:2px 2px 10px}.c14p .chh .lg{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#C9A45A,#7A5A1E);display:grid;place-items:center;font:800 14px/1 Inter;color:#fff}.c14p .chh b{display:block;font:700 15px/1.2 Inter}.c14p .chh small{color:#7F91A4;font-size:12px}
.c14p .post{background:#182533;border-radius:14px;padding:10px 12px 8px;font-size:13.5px;line-height:1.42;white-space:pre-wrap;animation:c4in .35s ease both}
@keyframes c4in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.c14p .ft{display:flex;align-items:center;gap:6px;margin-top:8px;color:#7F91A4;font-size:11px}.c14p .ft span.r{background:#22384D;border-radius:12px;padding:3px 7px;color:#E8EDF2}
.c14p .mm{display:grid;grid-template-columns:1fr 1fr;gap:4px;margin:-2px -4px 8px;border-radius:12px;overflow:hidden}
.c14p .mm div{background:#2a2f38;padding:10px 8px;min-height:120px;display:flex;flex-direction:column;justify-content:space-between;font:800 13px/1.2 Inter}
.c14p .mm div:last-child{background:#3a2d12;color:#FFD23F}.c14p .mm small{display:block;font:600 10.5px/1.25 Inter;color:#aab}
.c14p .mm .big{font:900 34px/1 Inter;color:#fff}.c14p .mm div:last-child .big{color:#FFD23F}
.c14p .why{margin-top:10px;background:#1a2532;border-radius:12px;padding:9px 11px;color:#9fb0c2;font-size:12px;line-height:1.4}.c14p .why b{color:#e8edf2}
</style>${SB(0)}<div class="c4b"><div class="chh"><span class="lg">D</span><div><b>Deadlock по-русски</b><small>канал · пример поста</small></div></div>
<div class="seg">${Object.entries(C14P).map(([k,x])=>`<button data-k="${k}">${x.n}</button>`).join('')}</div><div id="c4p"></div><div class="why" id="c4w"></div></div>`;
 const box=R.querySelector('#c4p'),why=R.querySelector('#c4w');
 const WHY={news:'<b>Новости</b> — по делу, цифры, одно слово в конце. Для тех, кто подписался ради инфы.',rofl:'<b>По рофлу</b> — подача Киберцыгана: капс-заголовок, суть 1–2 абзаца, в конце плевок от себя. Без наездов на людей — шутим над патчем.',meme:'<b>Мем</b> — картинка + 2 слова, как у «Бутылки». Картинку бот рисует сам по цифрам патча.'};
 const draw=()=>{R.querySelectorAll('.seg button').forEach(b=>b.classList.toggle('on',b.dataset.k===cur));const x=C14P[cur];
  box.innerHTML=`<div class="post">${x.meme?`<div class="mm"><div><small>Valve</small>ослабляет Бабу<span class="big">−10</span><small>щит</small></div><div><small>Баба на высоких рангах</small>побеждает<span class="big">58%</span><small>процент побед</small></div></div>`:''}${x.t}<div class="ft"><span class="r">🔥 ${cur==='rofl'?'1,2K':'640'}</span><span class="r">🤣 ${cur==='news'?'88':'930'}</span><span class="r">👍 ${cur==='news'?'410':'150'}</span><span style="margin-left:auto">👁 ${cur==='news'?'9,8K':'14,1K'}</span></div></div>`;why.innerHTML=WHY[cur]};
 R.querySelectorAll('.seg button').forEach(b=>ctx.on(b,'click',()=>{cur=b.dataset.k;draw()}));
 draw()}

/* 2. Разбор патча — найди своё, но можно прочитать всё */
function c14r(R,ctx){let my=[];try{my=JSON.parse(localStorage.getItem('c14my')||'["doorman","victor"]')}catch(e){my=['doorman','victor']}
 let ty='all',q='',onlyMy=true,openI=-1;
 R.className='scr v8 c14 c14r';
 R.innerHTML=C14CSS+`<style>
.c14r .sum{background:linear-gradient(135deg,#2c2414,#1a1814);border-radius:16px;padding:11px 12px;margin-bottom:10px;box-shadow:inset 0 0 0 1px #4a3c1e}
.c14r .sum b{display:block;font:800 12px/1 Inter;letter-spacing:.06em;color:#FFD23F;margin-bottom:7px}.c14r .sum li{margin:0 0 4px 16px;font-size:13px}
.c14r .srch{display:flex;align-items:center;gap:8px;background:#1a1814;border-radius:12px;padding:8px 10px;margin-bottom:8px;box-shadow:inset 0 0 0 1px #2b2721}.c14r .srch input{flex:1;background:none;border:0;color:#efe9de;font:14px Inter;outline:0}
.c14r .lbl{font:800 11px/1 Inter;letter-spacing:.07em;color:#8c8475;margin:10px 0 6px;display:flex;justify-content:space-between}.c14r .lbl a{color:#FFD23F;letter-spacing:0;font-weight:700;font-size:12px;cursor:pointer}
.c14r .card{cursor:pointer;transition:transform .15s}.c14r .card:active{transform:scale(.985)}
.c14r .hd{display:flex;align-items:center;gap:9px}.c14r .hd b{flex:1;font:700 14px/1.25 Inter}.c14r .tg{font:800 10.5px/1 Inter;border-radius:8px;padding:4px 6px;white-space:nowrap}
.c14r .rw{display:grid;grid-template-columns:1fr auto auto auto;gap:4px 8px;margin-top:9px;font-size:12.5px;align-items:center}.c14r .rw s{color:#8c8475}.c14r .rw em{font-style:normal;font-weight:800}.c14r .rw i{color:#6f685c;font-style:normal}
.c14r .more{display:none;margin-top:9px;border-top:1px solid #2b2721;padding-top:8px;font-size:13px;color:#d9d1c3}.c14r .card.op .more{display:block;animation:c4in .3s ease}
.c14r .wl{display:inline-block;margin-top:7px;background:#2c2414;color:#FFD23F;border-radius:8px;padding:4px 8px;font:700 12px/1 Inter}
.c14r .wn{display:flex;align-items:center;gap:6px;margin-top:8px;font-size:12px;color:#a59d8f}.c14r .wn b{color:#efe9de}
.c14r .emp{color:#8c8475;text-align:center;padding:18px 6px;font-size:13px}
@keyframes c4in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
</style>${SB(0)}<div class="c4b"><h3>Патч · 14–22 октября</h3><div class="c4s">8 изменений · 598 тыс. матчей · deadlock-api.com</div>
<div class="sum"><b>ГЛАВНОЕ ЗА 30 СЕКУНД</b><ul style="margin:0;padding:0"><li>Бабу ослабили — а побеждает чаще (58 % на высоких рангах).</li><li>Дэнни усилили: 38 % → 51 % побед.</li><li>Два новых героя: Харроу (её берут чаще всех) и Вайолет.</li></ul></div>
<div class="lbl">МОИ ГЕРОИ <a id="c4mm">${onlyMy?'показать всё':'только мои'}</a></div><div class="chips" id="c4h"></div>
<div class="srch">🔎<input id="c4q" placeholder="Поиск: герой, предмет, слово…"></div>
<div class="chips" id="c4t"></div><div id="c4l"></div></div>`;
 const H=R.querySelector('#c4h'),T=R.querySelector('#c4t'),Lb=R.querySelector('#c4l'),mm=R.querySelector('#c4mm');
 const heroes=['doorman','victor','rat','seven','danny','celeste','venator','talon','rem','warden'];
 const TY=[['all','Всё'],['hero','Баланс'],['new','Новое'],['item','Предметы'],['fix','Фиксы'],['map','Карта']];
 const save=()=>{try{localStorage.setItem('c14my',JSON.stringify(my))}catch(e){}};
 const draw=()=>{
  H.innerHTML=heroes.map(k=>`<button class="chip ${my.includes(k)?'on':''}" data-h="${k}">${C14AV(k)}${C14H[k]}</button>`).join('');
  T.innerHTML=TY.map(([k,n])=>`<button class="chip ${ty===k?'on':''}" data-t="${k}">${n}</button>`).join('');
  mm.textContent=onlyMy&&my.length?'показать всё':'только мои';
  const ql=q.trim().toLowerCase();
  let L=C14CH.map((c,i)=>Object.assign({i},c)).filter(c=>(ty==='all'||c.ty===ty)&&(!ql||JSON.stringify(c).toLowerCase().includes(ql)||(C14H[c.k]||'').toLowerCase().includes(ql)));
  const mine=L.filter(c=>my.includes(c.k)),rest=L.filter(c=>!my.includes(c.k));
  const card=c=>{const tg=C14T[c.t];return `<div class="card ${openI===c.i?'op':''}" data-i="${c.i}"><div class="hd">${c.k==='item'?'<i class="c4av t">⚙</i>':C14AV(c.k)}<b>${c.h}</b><span class="tg" style="background:${tg[2]}22;color:${tg[2]}">${tg[0]} ${tg[1]}</span></div>
<div class="rw">${c.rows.map(r=>`<span>${r[0]}</span><s>${r[1]}</s><i>→</i><em>${r[2]}</em>`).join('')}</div>
<div class="more">${c.win?`<div class="wn">Побед: <s>${c.win[0]}</s> → <b>${c.win[1]}</b></div>`:''}<div style="margin-top:6px">${c.you}</div><span class="wl">📚 ${c.w[0]} — ${c.w[1]}</span><div style="margin-top:6px;color:#6f685c;font-size:11px">${c.d} · нажми ещё раз, чтобы свернуть</div></div></div>`};
  let h='';
  if(ty==='map')h='<div class="emp">В этом патче карту не меняли. Когда поменяют — тут будет «было / стало» шторкой (пример — в соседнем варианте).</div>';
  else if(onlyMy&&my.length){h+=`<div class="lbl">ДЛЯ ТВОИХ ГЕРОЕВ · ${mine.length}</div>`+(mine.length?mine.map(card).join(''):'<div class="emp">Твоих героев в этом патче не трогали 👌</div>')+`<div class="lbl">ОСТАЛЬНОЕ · ${rest.length} <a data-all>читать всё</a></div>`+rest.slice(0,2).map(card).join('')+(rest.length>2?`<button class="chip" data-all style="width:100%;justify-content:center;margin-top:2px">Ещё ${rest.length-2} изменения</button>`:'')}
  else h+=(L.length?L.map(card).join(''):'<div class="emp">Ничего не нашлось</div>');
  Lb.innerHTML=h;
 };
 ctx.on(H,'click',e=>{const b=e.target.closest('[data-h]');if(!b)return;const k=b.dataset.h;my=my.includes(k)?my.filter(x=>x!==k):my.concat(k);save();onlyMy=true;draw()});
 ctx.on(T,'click',e=>{const b=e.target.closest('[data-t]');if(!b)return;ty=b.dataset.t;draw()});
 ctx.on(mm,'click',()=>{onlyMy=!onlyMy;draw()});
 ctx.on(Lb,'click',e=>{if(e.target.closest('[data-all]')){onlyMy=false;draw();return}const c=e.target.closest('.card');if(!c)return;const i=+c.dataset.i;openI=openI===i?-1:i;draw()});
 ctx.on(R.querySelector('#c4q'),'input',e=>{q=e.target.value;draw()});
 draw()}

/* 3. Карта: было / стало — шторка, как в патчноутах Доты */
function c14mapSVG(nw){const st=nw?'#FFD23F':'#8c8475';
 const lane=(d,c,w)=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w||7}" stroke-linecap="round" stroke-linejoin="round"/>`;
 let s=`<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="300" fill="${nw?'#16231c':'#1b1d1a'}"/>`;
 s+=`<g opacity=".18" fill="#fff">${Array.from({length:40},(_,i)=>`<rect x="${(i*53)%290}" y="${(i*97)%290}" width="${14+(i*7)%22}" height="${10+(i*11)%18}" rx="2"/>`).join('')}</g>`;
 s+=lane('M150 280 L150 20','#c46a5a')+lane('M150 280 C60 230 50 90 150 20','#5a8fc4')+lane('M150 280 C240 230 250 90 150 20','#7ac45a');
 if(nw)s+=lane('M78 150 L222 150','#FFD23F',5)+`<circle cx="150" cy="150" r="17" fill="#2a2414" stroke="#FFD23F" stroke-width="3"/>`;else s+=`<rect x="85" y="140" width="40" height="20" rx="3" fill="#3a3a36"/><rect x="175" y="140" width="40" height="20" rx="3" fill="#3a3a36"/><circle cx="150" cy="150" r="13" fill="#2b2b28" stroke="#8c8475" stroke-width="2"/>`;
 s+=`<circle cx="150" cy="276" r="11" fill="#5a8fc4"/><circle cx="150" cy="24" r="11" fill="#c46a5a"/>`;
 s+=`<circle cx="${nw?232:70}" cy="${nw?205:95}" r="9" fill="${st}"/></svg>`;return s}
function c14m(R,ctx){let x=.5,act=-1;
 const P=[{x:150,y:150,h:'Через центр — новый проход',d:'Раньше центр перекрывали две стены — теперь можно срезать между боковыми линиями.'},{x:232,y:205,h:'Лагерь перенесли',d:'Лагерь нейтралов справа снизу, а не слева сверху: ближе к твоей базе.'},{x:150,y:150,h:'Средний босс',d:'Арена босса шире — сложнее застрять в углу.'}];
 R.className='scr v8 c14 c14m';
 R.innerHTML=C14CSS+`<style>
.c14m .mw{position:relative;width:100%;aspect-ratio:1;border-radius:16px;overflow:hidden;touch-action:none;user-select:none;box-shadow:0 10px 30px #0008}
.c14m .mw svg{position:absolute;inset:0;width:100%;height:100%}.c14m .nw{clip-path:inset(0 0 0 50%)}
.c14m .hd{position:absolute;top:0;bottom:0;left:50%;width:3px;margin-left:-1.5px;background:#FFD23F;box-shadow:0 0 12px #FFD23F}.c14m .hd i{position:absolute;top:50%;left:50%;width:34px;height:34px;margin:-17px;border-radius:50%;background:#FFD23F;color:#111;display:grid;place-items:center;font:900 14px/1 Inter;font-style:normal}
.c14m .tl{position:absolute;top:8px;font:800 11px/1 Inter;background:#000a;border-radius:8px;padding:5px 7px}.c14m .tl.a{left:8px;color:#d9d1c3}.c14m .tl.b{right:8px;color:#FFD23F}
.c14m .pin{position:absolute;width:24px;height:24px;margin:-12px;border-radius:50%;background:#FFD23F;color:#111;font:900 12px/24px Inter;text-align:center;border:0;box-shadow:0 0 0 4px #FFD23F44;animation:c4p 1.6s ease-in-out infinite}
@keyframes c4p{50%{box-shadow:0 0 0 9px #FFD23F11}}
.c14m .ex{margin:8px 0 10px;background:#3a2d12;color:#FFD23F;border-radius:10px;padding:7px 10px;font:700 12px/1.35 Inter}
.c14m .pl{margin-top:10px}.c14m .pl .card{display:flex;gap:9px;align-items:flex-start;cursor:pointer}.c14m .pl .card.on{box-shadow:inset 0 0 0 1.5px #FFD23F}.c14m .pl b{display:block;font:700 13.5px/1.3 Inter}.c14m .pl small{color:#a59d8f;font-size:12.5px}
.c14m .pl .n{flex:none;width:22px;height:22px;border-radius:50%;background:#FFD23F;color:#111;font:900 12px/22px Inter;text-align:center}
</style>${SB(0)}<div class="c4b"><h3>Карта · было / стало</h3><div class="c4s">Тяни жёлтую ручку — как в патчноутах Доты</div>
<div class="ex">ПРИМЕР — в этом патче карту не меняли. Схема нарисована кодом; в приложении — настоящая мини-карта из файлов игры.</div>
<div class="mw" id="c4mw"><div class="ol">${c14mapSVG(0)}</div><div class="nw">${c14mapSVG(1)}</div>${P.map((p,i)=>i===2?'':`<button class="pin" data-p="${i}" style="left:${p.x/3}%;top:${p.y/3}%">${i+1}</button>`).join('')}<span class="tl a">БЫЛО</span><span class="tl b">СТАЛО</span><div class="hd"><i>⇆</i></div></div>
<div class="pl">${P.slice(0,2).map((p,i)=>`<div class="card" data-p="${i}"><span class="n">${i+1}</span><div><b>${p.h}</b><small>${p.d}</small></div></div>`).join('')}</div></div>`;
 const mw=R.querySelector('#c4mw'),nw=mw.querySelector('.nw'),hd=mw.querySelector('.hd');
 const set=v=>{x=Math.max(0,Math.min(1,v));nw.style.clipPath=`inset(0 0 0 ${x*100}%)`;hd.style.left=x*100+'%'};
 const fromEv=e=>{const r=mw.getBoundingClientRect();const cx=(e.touches?e.touches[0]:e).clientX;return(cx-r.left)/r.width};
 let dn=false;
 ctx.on(mw,'pointerdown',e=>{if(e.target.closest('.pin'))return;dn=true;set(fromEv(e));try{mw.setPointerCapture(e.pointerId)}catch(_){}});
 ctx.on(mw,'pointermove',e=>{if(dn)set(fromEv(e))});ctx.on(mw,'pointerup',()=>{dn=false});ctx.on(mw,'pointercancel',()=>{dn=false});
 const pick=i=>{act=i;R.querySelectorAll('.pl .card').forEach(c=>c.classList.toggle('on',+c.dataset.p===i));const p=P[i];let t=0;const from=x,to=Math.min(.92,Math.max(.08,p.x/300-.15));const sl=ctx.loop((n,dt)=>{t=Math.min(1,t+dt/450);set(from+(to-from)*(1-Math.pow(1-t,3)));if(t>=1)sl()})};
 R.querySelectorAll('[data-p]').forEach(b=>ctx.on(b,'click',()=>pick(+b.dataset.p)));
 // подсказка: ручка сама проезжает
 let t0=0;const st=ctx.loop((n,dt)=>{if(dn||act>=0){st();return}t0+=dt;set(.5+.32*Math.sin(t0/900));if(t0>5600){st();set(.5)}});
 set(.5)}

/* 4. Бот 24/7 — как это работает */
function c14b(R,ctx){let game='dl';
 const G={dl:{n:'Deadlock',src:[['ok','Файлы игры','каждая сборка Steam · github.com/SteamDatabase · сливы видны первыми'],['dom','Патчноуты и форум','forums.playdeadlock.com — тут пишет Йоши'],['dom','Статистика','deadlock-api.com — кто в мете, проценты'],['dom','Reddit','r/DeadlockTheGame — что обсуждают'],['dc','Discord Deadlock','канал объявлений → «Подписаться» в твой сервер → бот читает там'],['no','Twitter / X','только платный доступ — не берём']]},
  dota:{n:'Dota 2',src:[['ok','Файлы игры','github.com/SteamDatabase/GameTracking-Dota2 — тот же способ'],['dom','Патчноуты','dota2.com/patches — каждый патч с цифрами'],['dom','Статистика','OpenDota / Stratz — открытые данные'],['dom','Reddit','r/DotA2']]},
  ow:{n:'Overwatch',src:[['dom','Патчноуты','overwatch.blizzard.com — официальные'],['dom','Форум Blizzard','объявления разработчиков'],['dom','Reddit','r/Overwatch'],['no','Файлы игры','у Blizzard нет открытого трекера — сливов из файлов не будет']]}};
 const ST={ok:['работает уже сейчас','#5fd38a'],dom:['нужно разрешить домен','#FFD23F'],dc:['через «Подписаться»','#8ab4ff'],no:['нет','#ff6b5b']};
 R.className='scr v8 c14 c14b';
 R.innerHTML=C14CSS+`<style>
.c14b .fl{position:relative;padding-left:26px;margin:4px 0 12px}.c14b .fl:before{content:'';position:absolute;left:10px;top:8px;bottom:8px;width:2px;background:#39342c}
.c14b .st{position:relative;margin-bottom:9px}.c14b .st:before{content:'';position:absolute;left:-21px;top:4px;width:12px;height:12px;border-radius:50%;background:#2b2721;box-shadow:0 0 0 2px #39342c;transition:.3s}.c14b .st.on:before{background:#FFD23F;box-shadow:0 0 0 2px #FFD23F,0 0 12px #FFD23F}
.c14b .st b{display:block;font:700 13.5px/1.3 Inter}.c14b .st small{color:#a59d8f;font-size:12px}
.c14b .src .card{display:flex;gap:9px;align-items:flex-start;padding:9px 11px}.c14b .src b{display:block;font:700 13px/1.3 Inter}.c14b .src small{color:#a59d8f;font-size:12px;display:block}.c14b .src .d{flex:none;width:9px;height:9px;border-radius:50%;margin-top:5px}.c14b .src em{font-style:normal;font:700 10.5px/1 Inter}
.c14b .msg{background:#182533;border-radius:14px 14px 14px 4px;padding:9px 11px;font-size:12.5px;margin:4px 0 12px;color:#E8EDF2;animation:c4in .4s ease both}.c14b .msg small{display:block;color:#7F91A4;font-size:11px;margin-bottom:3px}
.c14b .kb{display:flex;gap:5px;margin-top:7px}.c14b .kb span{flex:1;text-align:center;background:#22384D;border-radius:8px;padding:7px 2px;font:700 11px/1 Inter}.c14b .kb span:first-child{background:#2B83D6}
@keyframes c4in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
</style>${SB(0)}<div class="c4b"><h3>Бот 24/7 · как работает</h3><div class="c4s">Да, это реально: облако проверяет источники само, тебе только «да / нет»</div>
<div class="fl" id="c4f">${[['Раз в час','облако Claude проверяет источники по расписанию — без тебя и без включённого компа'],['Нашёл новое','сравнивает с прошлой проверкой: что добавили, что поменяли'],['Пишет тебе в личку','что нашёл + черновик поста в нужной подаче'],['Ты жмёшь кнопку','«В канал» — пост уходит в канал и рассылкой в бота приложения']].map((s,i)=>`<div class="st" data-s="${i}"><b>${s[0]}</b><small>${s[1]}</small></div>`).join('')}</div>
<div class="msg" id="c4msg" style="opacity:0"><small>Deadlock · радар · 14:00</small>🔎 В файлах игры: у Вайолет новый навык — «Still Life». Черновик готов ↓<div class="kb"><span>📣 В канал</span><span>✏️ Короче</span><span>🗑 Нет</span></div></div>
<div class="seg">${Object.entries(G).map(([k,g])=>`<button data-g="${k}">${g.n}</button>`).join('')}</div><div class="src" id="c4s"></div>
<div class="card" style="font-size:12.5px;color:#d9d1c3"><b style="display:block;margin-bottom:4px">Что нужно от тебя один раз</b>1) канал и бот в нём админом; 2) токен бота — в секреты окружения (не в чат); 3) разрешить домены из жёлтых строк; 4) решить: бот постит сам или сначала тебе.</div></div>`;
 const src=R.querySelector('#c4s');
 const draw=()=>{R.querySelectorAll('.seg button').forEach(b=>b.classList.toggle('on',b.dataset.g===game));src.innerHTML=G[game].src.map(s=>`<div class="card"><span class="d" style="background:${ST[s[0]][1]}"></span><div><b>${s[1]} <em style="color:${ST[s[0]][1]}">· ${ST[s[0]][0]}</em></b><small>${s[2]}</small></div></div>`).join('')};
 R.querySelectorAll('.seg button').forEach(b=>ctx.on(b,'click',()=>{game=b.dataset.g;draw()}));draw();
 const steps=[...R.querySelectorAll('.st')];let i=0;const tick=()=>{steps.forEach((s,j)=>s.classList.toggle('on',j<=i));if(i===2)R.querySelector('#c4msg').style.opacity=1;i=(i+1)%5;if(i===0){steps.forEach(s=>s.classList.remove('on'));R.querySelector('#c4msg').style.opacity=0}ctx.t(tick,1100)};ctx.t(tick,400)}

/* 5–6. Мод в Deadlock (как в Deadlock Mod Manager) + приложение-компаньон с премиумом */
const M14F=[['ok','Конфиги FPS','пресеты «слабый ПК / средний / максимум» — обычные настройки игры (autoexec)'],['ok','Свой интерфейс','перекрасить и подвинуть HUD — так делают HUD-моды на GameBanana'],['chk','Подсказки в магазине','процент побед предмета и «что берут на твоём герое» — данные зашиты в мод, обновляются с каждым патчем'],['chk','Таймеры объектов','только то, что появляется по расписанию игры (часы матча). Надо проверить, пускает ли игра скрипты в моде'],['no','Таймеры чужих способностей, предметы врага сквозь туман','это чтение памяти игры = чит. Не делаем никогда']];
const M14S={ok:['можно','#5fd38a'],chk:['проверить за вечер','#FFD23F'],no:['нельзя — чит','#ff6b5b']};
function m14h(R,ctx){
 R.className='scr v8 c14 m14h';
 R.innerHTML=C14CSS+`<style>
.m14h .pc{position:relative;width:100%;aspect-ratio:16/10;border-radius:12px;overflow:hidden;background:radial-gradient(120% 90% at 30% 70%,#3b5a3a,#17221a 60%,#0c120d);box-shadow:0 0 0 6px #222,0 0 0 7px #444,0 14px 30px #000a;margin:6px 0 16px}
.m14h .pc:after{content:'';position:absolute;left:0;right:0;bottom:0;height:22%;background:linear-gradient(transparent,#0009)}
.m14h .tm{position:absolute;top:6px;left:50%;transform:translateX(-50%);display:flex;gap:4px;z-index:2}.m14h .tm span{background:#000b;border-radius:6px;padding:3px 6px;font:800 8.5px/1 Inter;color:#fff;white-space:nowrap}.m14h .tm span.y{color:#111;background:#FFD23F}
.m14h .sh{position:absolute;right:6px;top:22px;bottom:8px;width:44%;background:#0d0c0bdd;border-radius:7px;padding:5px;z-index:2;box-shadow:inset 0 0 0 1px #FFD23F55}
.m14h .sh b{display:block;font:800 8px/1 Inter;color:#FFD23F;letter-spacing:.05em;margin-bottom:4px}.m14h .it{display:flex;align-items:center;gap:4px;background:#1e1b17;border-radius:5px;padding:3px 4px;margin-bottom:3px;font:700 7.5px/1.15 Inter}
.m14h .it i{width:13px;height:13px;border-radius:3px;flex:none}.m14h .it em{margin-left:auto;font-style:normal;color:#5fd38a}.m14h .it.hl{box-shadow:0 0 0 1px #FFD23F;animation:m4p 1.4s ease-in-out infinite}
@keyframes m4p{50%{box-shadow:0 0 0 2px #FFD23F,0 0 8px #FFD23F88}}
.m14h .me{position:absolute;left:8px;bottom:7px;z-index:2;font:800 8px/1 Inter;color:#fff;background:#000a;border-radius:6px;padding:4px 6px}.m14h .bd{position:absolute;left:8px;top:8px;z-index:2;font:900 7.5px/1 Inter;color:#111;background:#FFD23F;border-radius:5px;padding:3px 5px}
.m14h .fe .card{display:flex;gap:9px;align-items:flex-start;padding:9px 11px}.m14h .fe b{display:block;font:700 13px/1.3 Inter}.m14h .fe small{color:#a59d8f;font-size:12px;display:block}.m14h .fe .d{flex:none;width:9px;height:9px;border-radius:50%;margin-top:5px}.m14h .fe em{font-style:normal;font:700 10.5px/1 Inter}
</style>${SB(0)}<div class="c4b"><h3>Quality Deadlock · в игре</h3><div class="c4s">Так мод выглядит на ПК. Ставится через Deadlock Mod Manager, как обычный мод</div>
<div class="pc"><span class="bd">QD</span><div class="tm"><span>⏱ 12:40</span><span class="y">Средний босс · 2:10</span><span>Урны · 0:45</span></div>
<div class="sh"><b>МАГАЗИН · ДОРМЕН</b>${[['Tech Overflow','53 %','#7a5ab8',1],['Reinforcing Casings','51 %','#5a8fc4'],['Extra Spirit','50 %','#c4a35a'],['Mystic Reach','49 %','#c45a8f']].map(x=>`<div class="it ${x[3]?'hl':''}"><i style="background:${x[2]}"></i>${x[0]}<em>${x[1]}</em></div>`).join('')}<div style="font:700 7px/1.2 Inter;color:#a59d8f;margin-top:3px">% — побед с предметом на Дормене</div></div>
<span class="me">Подсказка: Харроу у врагов → бери анти-страх</span></div>
<div class="fe">${M14F.map(f=>`<div class="card"><span class="d" style="background:${M14S[f[0]][1]}"></span><div><b>${f[1]} <em style="color:${M14S[f[0]][1]}">· ${M14S[f[0]][0]}</em></b><small>${f[2]}</small></div></div>`).join('')}</div></div>`}
function m14p(R,ctx){let pr=false;
 R.className='scr v8 c14 m14p';
 R.innerHTML=C14CSS+`<style>
.m14p .hh{display:flex;align-items:center;gap:10px;margin:2px 0 10px}.m14p .hh .c4av{width:46px;height:46px}.m14p .hh b{display:block;font:800 18px/1.1 Inter}.m14p .hh small{color:#a59d8f;font-size:12px}
.m14p .lbl{font:800 11px/1 Inter;letter-spacing:.07em;color:#8c8475;margin:12px 0 6px}
.m14p .bar{display:flex;align-items:center;gap:8px;margin-bottom:6px;font-size:12.5px}.m14p .bar span{width:118px;flex:none}.m14p .bar i{flex:1;height:8px;border-radius:5px;background:#2b2721;overflow:hidden;position:relative}.m14p .bar i:after{content:'';position:absolute;inset:0;width:var(--w);background:#5fd38a;border-radius:5px;transform-origin:left;animation:m4g .8s ease both}.m14p .bar em{font-style:normal;font-weight:800;width:38px;text-align:right}
@keyframes m4g{from{transform:scaleX(0)}}
.m14p .m4bl{position:relative}.m14p .m4bl .card{filter:blur(4px);opacity:.6}.m14p.pr .m4bl .card{filter:none;opacity:1}
.m14p .m4lk{position:absolute;inset:0;display:grid;place-items:center;text-align:center}.m14p.pr .m4lk{display:none}.m14p .m4lk button{border:0;border-radius:14px;padding:11px 16px;background:#FFD23F;color:#111;font:800 13px/1.2 Inter}
.m14p .pg{display:flex;gap:6px}.m14p .pg span{flex:1;text-align:center;background:#1a1814;border-radius:10px;padding:9px 4px;font:700 12px/1.2 Inter;box-shadow:inset 0 0 0 1px #2b2721}.m14p .pg span.on{box-shadow:inset 0 0 0 1.5px #FFD23F;color:#FFD23F}
.m14p .ex{margin:4px 0 0;color:#8c8475;font-size:11.5px}
</style>${SB(0)}<div class="c4b"><div class="hh">${C14AV('doorman')}<div><b>Дормен</b><small>45,4 % побед · 39 место · после 22.10</small></div></div>
<div class="lbl">ПРЕДМЕТЫ · ПРОЦЕНТ ПОБЕД (ПРИМЕР)</div>${[['Tech Overflow',53],['Reinforcing Casings',51],['Extra Spirit',50],['Mystic Reach',49]].map(x=>`<div class="bar"><span>${x[0]}</span><i style="--w:${(x[1]-40)*5}%"></i><em>${x[1]} %</em></div>`).join('')}
<div class="lbl">БИЛДЫ ПРО-ИГРОКОВ · ПРЕМИУМ</div><div class="m4bl">${['Билд №1 · топ-100 · 58 % побед','Билд №2 · через Spirit · 55 %'].map(t=>`<div class="card"><b>${t}</b><div style="color:#a59d8f;font-size:12px;margin-top:3px">6 предметов по минутам · навыки по уровням · в игру одной кнопкой</div></div>`).join('')}<div class="m4lk"><div><button id="m4pr">Премиум · вместе с «Языками по кино»</button><div style="color:#a59d8f;font-size:11.5px;margin-top:6px">одна подписка на оба приложения</div></div></div></div>
<div class="lbl">НАСТРОЙКИ · FPS</div><div class="pg"><span>Слабый ПК</span><span class="on">Средний</span><span>Максимум</span></div>
<div class="ex">Цифры предметов — пример. Настоящие — из deadlock-api.com, раз в день. Мод ставится и удаляется в один клик через Mod Manager.</div></div>`;
 ctx.on(R.querySelector('#m4pr'),'click',()=>{pr=true;R.classList.add('pr')});
 R.querySelectorAll('.pg span').forEach(s=>ctx.on(s,'click',()=>{R.querySelectorAll('.pg span').forEach(x=>x.classList.toggle('on',x===s))}))}

V.push({g:'c14',id:'c14p',n:'Пост · три подачи',
 idea:'Одна новость — три подачи на выбор: «Новости» (по делу, цифры), «По рофлу» (подача Киберцыгана — капс-заголовок, суть, плевок в конце, но шутим над патчем, не над людьми), «Мем» (картинка + два слова, как у «Бутылки»). Внизу — зачем каждая. Данные — настоящие на 27.10.',
 moves:['переключатель подачи — пост перерисовывается','реакции — как в настоящем канале'],
 from:'Твоё: «сделай пару вариков, как ты бы писал посты по рофлу и нормально» + экспорт Киберцыгана (3 246 постов).',
 minus:'Числа реакций и просмотров — для вида. Мем-картинку в приложении рисует бот по цифрам патча.',
 mount(R,ctx){c14p(R,ctx)}});
V.push({g:'c14',id:'c14r',n:'Разбор патча · найди своё',
 idea:'Сверху «Главное за 30 секунд». Дальше — «Мои герои»: отметил своих — сверху то, что касается их («Дормену починили двери»), ниже остальное и «читать всё». Фильтры: баланс, новое, предметы, фиксы, карта. Поиск по всему. Тап по карточке — что это значит для тебя, проценты побед до → после и слово из патча.',
 moves:['отметил героя — список перестраивается','карточка раскрывается','поиск фильтрует на лету'],
 from:'Твоё: «чел должен иметь возможность найти изменения, которые ему интересны или интересны для его героя, но и прочитать всё».',
 minus:'Изменения — настоящие (14–22.10), но их 8. В большом патче будет 100+ строк — фильтр как раз для этого.',
 mount(R,ctx){c14r(R,ctx)}});
V.push({g:'c14',id:'c14m',n:'Карта · было / стало',
 idea:'Как в патчноутах Доты: тянешь жёлтую ручку — слева старая карта, справа новая. Точки 1, 2 — что поменяли; тап по точке или по строке — ручка сама едет к месту.',
 moves:['ручка сама проезжает — подсказка','тап по точке — шторка едет к ней'],
 from:'Твоё: «если меняется мапа, то можно ли в боте как в доте — увидеть старую версию и новую (ты уже делал в макетах, мышкой вёл по версусу)».',
 minus:'ПРИМЕР: в этом патче карту не меняли, схема нарисована кодом. В приложении — настоящая мини-карта из файлов игры, старая и новая.',
 mount(R,ctx){c14m(R,ctx)}});
V.push({g:'c14',id:'c14b',n:'Бот 24/7 · как работает',
 idea:'Ответ на «не верю»: облако проверяет источники раз в час само, без твоего компа. Нашло новое — пишет тебе в личку с кнопками, ты жмёшь «В канал». Ниже — источники по играм: что работает уже сейчас, что ждёт разрешения домена, что нельзя. Deadlock, Dota 2 и Overwatch — переключателем.',
 moves:['шаги загораются по очереди','сообщение от бота появляется на 3-м шаге'],
 from:'Твоё: «ты правда можешь сделать бота, который будет 24/7 мониторить дд и постить сам? не верю; по доте и оверу так же?»',
 minus:'У Overwatch нет открытых файлов игры — только официальные новости, сливов не будет.',
 mount(R,ctx){c14b(R,ctx)}});
V.push({g:'m14',id:'m14h',n:'Мод · в игре',
 idea:'Quality Deadlock: мод через Deadlock Mod Manager. В игре: таймер ближайшего объекта по часам матча, в магазине — процент побед предмета на твоём герое, подсказка против героев врага. Ниже — честно, что можно, что проверить и что нельзя (чит).',
 moves:['подсвеченный предмет пульсирует'],
 from:'Твоё: «сделай мод, который ставится в дедлок… таймеры, какие айтемы дают сколько процентов, подсказки, конфиги фпс; чтобы не как чит, а как мод в мод-менеджере».',
 minus:'Подсказки и таймеры зависят от того, пускает ли игра скрипты в моде — проверяется за вечер на ПК. Всё, что читает память игры, — чит, не делаем.',
 mount(R,ctx){m14h(R,ctx)}});
V.push({g:'m14',id:'m14p',n:'Мод · приложение и премиум',
 idea:'Как HSReplay: страница героя — проценты побед предметов, билды про-игроков (премиум), пресеты FPS. Премиум — одна подписка с «Языками по кино». Нажми «Премиум» — билды откроются.',
 moves:['полоски процентов растут','премиум снимает размытие'],
 from:'Твоё: «премиум… как hs replay, автобилды про-игроков только в премиуме; решим это на изи».',
 minus:'Цифры предметов — пример; настоящие — deadlock-api.com раз в день.',
 mount(R,ctx){m14p(R,ctx)}});
V.push({g:'c14',id:'c14t',n:'Ролик · Дормен и Грей Талон',
 idea:'Настоящий разговор из игры 1 в 1: Дормен вежливо лезет Грей Талону в больное про месть и семью, тот — «Заткнись», Дормен — «Забылся, прошу прощения». Голоса — с вики (собрала Зетка), арты героев «дышат», пока нет петель. Переключатель внизу — прошлые ролики.',
 moves:['ульта Дормена с настоящим звуком','смена говорящего — косой срез','слова загораются по голосу'],
 from:'Твоё: «давай Дормена добавим, как я говорил — в тт супер ахуенно получилось».',
 minus:'Время слов — по громкости голоса (распознавание из облака закрыто), может чуть плыть. Разговора Дормена с Айви, где он закидывает её в отель, у Зетки пока нет — она ищет его на вики.',
 mount(R,ctx){ttk13(R,ctx)}});
