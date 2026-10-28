/* --- Настройки v13 (Андрей на v11: «настройки уёбищно выглядят — что у админа, что обычные, по дизайну не подходят под приложение»).
   Теперь та же «кожа», что у Главной: тёмно-синий фон, заголовки с засечками, карточки как «Что посмотреть», золото — только на выбранном,
   внизу те же вкладки. Каждая настройка показывает, что изменится, прямо на превью. Админка — в той же оболочке, только с пометкой ADMIN. --- */
const sw13=(on,k)=>`<button class="st13-tg${on?' on':''}" data-t="${k}" aria-label="вкл/выкл"><i></i></button>`;
const sg13=(k,L,on)=>`<span class="st13-sg" data-s="${k}" style="--n:${L.length};--i:${on}">${L.map((x,i)=>`<button class="${i===on?'on':''}" data-i="${i}">${x}</button>`).join('')}<i></i></span>`;
function set13(R,ctx){R.className='scr v8 st13';const S={sz:1,pz:true,tr:true,ty:false,gl:2,ic:icMode(),vo:true,bed:.35,fx:true,rm:true,tm:1,a18:false};
 R.innerHTML=`${SB(0)}<div class="st13-m">
  <div class="st13-hd"><button class="bk">${ic('back')}</button><b>Настройки</b></div>
  <button class="st13-me"><i class="img" style="background-image:url(${IMG.bd_titanic})"></i><i class="sh"></i><span class="av">А</span><span class="tx"><b>Андрей</b><small><i class="lb">${'<i></i>'.repeat(5)}</i>Средний · 6 дней подряд</small></span><em>фон профиля: Титаник ${ic('chev')}</em></button>
  <label class="st13-q">${ic('search')}<input placeholder="Найти настройку"></label>
  <h3 class="st13-h" data-g="view">Просмотр<small>как идёт эпизод</small></h3>
  <div class="st13-c pvw"><span class="fr"><i class="img" style="background-image:url(${IMG.v_titanic})"></i><span class="sub"><b>No, you have to go, now.</b><small>Нет, ты должна ехать. Сейчас же.</small></span><i class="pz">${ic('play')}пауза: полезная фраза</i></span>
   <span class="rw"><span class="t"><b>Размер субтитров</b><small>как на видео в эпизоде</small></span>${sg13('sz',['S','M','L','XL'],1)}</span>
   <span class="rw"><span class="t"><b>Паузы на полезных фразах</b><small>видео встаёт и показывает фразу</small></span>${sw13(true,'pz')}</span>
   <span class="rw"><span class="t"><b>Перевод под оригиналом</b></span>${sw13(true,'tr')}</span></div>
  <h3 class="st13-h" data-g="learn">Обучение<small>сколько и как</small></h3>
  <div class="st13-c lr"><span class="rw"><span class="t"><b>Твой уровень</b><small>растёт сам по ответам</small></span><span class="lvb13"><i class="lb on3">${'<i></i>'.repeat(5)}</i><b>Средний</b></span></span>
   <span class="rw gl"><span class="ring"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" class="rt"/><circle cx="20" cy="20" r="16" class="rp" pathLength="100"/></svg><b>10</b><small>мин</small></span><span class="t"><b>Цель на день</b><small>≈ 20 ответов · 200 билетов за цель</small></span>${sg13('gl',['5','10','15','20'],1)}</span>
   <span class="rw"><span class="t"><b>Писать самому</b><small>вместо кубиков — клавиатура</small></span>${sw13(false,'ty')}</span></div>
  <h3 class="st13-h" data-g="games">Игры<small>как выглядят герои</small></h3>
  <div class="st13-c icn13"><button class="op${S.ic==='e'?' on':''}" data-ic="e"><span class="rw13">${['venator','rat','rem','talon','celeste'].map(k=>`<i class="m8 em">${emb(k,40)}</i>`).join('')}</span><b>Гербы</b><small>свои, одним стилем</small><i class="ck">${ic('check')}</i></button>
   <button class="op${S.ic==='g'?' on':''}" data-ic="g"><span class="rw13">${['venator','rat','rem','talon','celeste'].map(k=>mini8(k)).join('')}</span><b>Арт из игры</b><small>мини-портреты</small><i class="ck">${ic('check')}</i></button></div>
  <h3 class="st13-h" data-g="snd">Звук<small>голос и сопровождение</small></h3>
  <div class="st13-c sd"><span class="rw"><span class="t"><b>Голоса героев</b><small>реплики из игры</small></span>${sw13(true,'vo')}</span>
   <span class="rw bv"><span class="t"><b>Фон под репликами</b><small class="bvt">еле слышно</small></span><input type="range" min="0" max="100" value="35"><button class="pl">${ic('play')}</button></span>
   <span class="rw"><span class="t"><b>Анимации</b><small>частицы, полёты, конфетти</small></span>${sw13(true,'fx')}</span></div>
  <h3 class="st13-h" data-g="rem">Напоминания<small>бот в Telegram</small></h3>
  <div class="st13-c rmd"><span class="tg"><span class="bot">K</span><span class="bb"><b>Языки по кино</b><span>🎬 Фраза дня · «Титаник»</span><em>No, you have to go, now.</em><i class="t">12:00</i></span></span>
   <span class="rw"><span class="t"><b>Фраза дня</b><small>кусок твоего эпизода</small></span>${sw13(true,'rm')}</span>
   <span class="rw"><span class="t"><b>Во сколько</b></span>${sg13('tm',['9:00','12:00','19:00'],1)}</span></div>
  <h3 class="st13-h">Ещё</h3>
  <div class="st13-c ls"><span class="rw"><span class="t"><b>Язык фильмов</b></span><em class="v">English ${ic('chev')}</em></span>
   <span class="rw"><span class="t"><b>Сцены 18+</b><small>откровенные интервью</small></span>${sw13(false,'a18')}</span>
   <span class="rw"><span class="t"><b>Как тут всё устроено</b><small>короткий тур</small></span><em class="v">${ic('chev')}</em></span>
   <span class="rw"><span class="t"><b>Пройти первый запуск заново</b></span><em class="v">${ic('chev')}</em></span></div>
  <p class="st13-v">Языки по кино · 13.9.76</p></div>
  ${TB5('v3-tb w4b-tb m6-tb m7-tb v8-tb g11-tb',4)}<i class="hb"></i>`;
 const M=$('.st13-m',R),P=$('.st13-c.pvw',R);let touched=false;ctx.on(R,'pointerdown',()=>{touched=true},{capture:true});
 $$('.st13-me,.st13-q,.st13-h,.st13-c',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:80+Math.min(i,10)*55}));
 $$('.st13-sg',R).forEach(s=>{const n=+s.style.getPropertyValue('--n');s.style.setProperty('--n',n)});
 const ring=$('.lr .ring .rp',R);ring.style.strokeDashoffset='100';ctx.t(()=>{ring.style.strokeDashoffset='45'},500);
 const apply=()=>{P.dataset.sz=S.sz;P.classList.toggle('nopz',!S.pz);P.classList.toggle('notr',!S.tr);$('.lr .ring b',R).textContent=['5','10','15','20'][S.gl];ring.style.strokeDashoffset=String(100-[25,55,70,90][S.gl]);
  const b=S.bed;$('.bvt',R).textContent=b<.02?'выкл — голос сухо':b<.3?'еле слышно':b<.6?'тихо, под голосом':'заметно';R.classList.toggle('nofx13',!S.fx)};apply();
 ctx.on(M,'click',e=>{const t=e.target;
  const g=t.closest('.st13-sg button');if(g){const s=g.closest('.st13-sg'),i=+g.dataset.i;s.style.setProperty('--i',i);$$('button',s).forEach(x=>x.classList.toggle('on',x===g));S[s.dataset.s]=i;apply();
   if(s.dataset.s==='sz')an($('.sub',P),[{transform:'scale(.92)'},{transform:'none'}],{sp:SPb});return}
  const w=t.closest('.st13-tg');if(w){w.classList.toggle('on');S[w.dataset.t]=w.classList.contains('on');apply();if(w.dataset.t==='pz'&&S.pz)an($('.pz',P),[{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{sp:SPs});return}
  const op=t.closest('.st13-c.icn13 .op');if(op){$$('.st13-c.icn13 .op',R).forEach(x=>x.classList.toggle('on',x===op));try{localStorage.setItem('kd-ic',op.dataset.ic)}catch(x){}an(op,[{transform:'scale(.96)'},{transform:'none'}],{sp:SPb});$$('.rw13>i',op).forEach((x,i)=>an(x,[{transform:'translateY(6px) scale(.8)',opacity:.4},{transform:'none',opacity:1}],{sp:SPb,dl:i*50}));toast(R,op.dataset.ic==='g'?'Герои — артом из игры: в играх, комиксах, Радаре':'Герои — гербами');return}
  if(t.closest('.bv .pl')){S13.bed('cathedral',S.bed);say13(ctx,'ven-not-merciful',{echo:.3,end(){ctx.t(()=>S13.bedOff(),1400)}});return}
  if(t.closest('.st13-me')){toast(R,'Фон профиля меняется в «Коллекции»');return}
  const r=t.closest('.rw');if(r&&$('.v',r)){an(r,[{background:'rgba(246,212,136,.1)'},{background:'transparent'}],{d:600});toast(R,$('b',r).textContent)}});
 ctx.on($('.bv input',R),'input',e=>{S.bed=e.target.value/100;apply();S13.bedVol(S.bed)});
 ctx.on($('.st13-hd .bk',R),'click',()=>toast(R,'← в Профиль'));
 ctx.on($('.st13-q input',R),'input',e=>{const q=e.target.value.trim().toLowerCase();$$('.st13-c .rw,.st13-c .op',R).forEach(x=>{const m=!q||x.textContent.toLowerCase().includes(q);x.classList.toggle('hl',!!q&&m);x.style.opacity=!q||m?'':'.3'})});
 ctx.add(()=>S13.stop());
 // без касания: размер субтитров меняется на превью, потом листает вниз
 ctx.t(()=>{if(touched)return;const b=$('.st13-sg[data-s="sz"] button[data-i="2"]',R);if(b)b.click();ctx.t(()=>{if(touched)return;const c=$('.st13-sg[data-s="sz"] button[data-i="1"]',R);if(c)c.click();ctx.t(()=>{if(!touched)M.scrollTo({top:470,behavior:'smooth'})},900)},1300)},1800)}

/* --- Админка v13: та же оболочка, что у приложения; отличие — пометка ADMIN и цифры. 5 разделов, как в приложении --- */
function adm13(R,ctx){R.className='scr v8 st13 ad13';
 const FL=[['Игры (Deadlock)','тестерам','tt'],['Дизайн «Новый»','всем','on'],['Премиум','выкл','off'],['Сцены 18+','по вопросу','tt']];
 const PL=[['Б','Боря','@borya_dl','5 мин назад','src_tiktok'],['М','Маша','@mashaa','1 ч назад','src_friend'],['К','Кирилл','—','вчера','']];
 const FN=[['Зашли',412,100],['Выбрали сцену',301,73],['Посмотрели эпизод',236,57],['Дошли до проверки',171,42],['Повторение',88,21]];
 R.innerHTML=`${SB(0)}<div class="st13-m">
  <div class="st13-hd"><button class="bk">${ic('back')}</button><b>Админка</b><em class="ad">ADMIN · 876754050</em></div>
  <div class="ad13-n">${[['1 284','игроков'],['+37','новых за сутки'],['412','заходили сегодня']].map(([v,t],i)=>`<span><b data-v="${v}">${v}</b><small>${t}</small><svg viewBox="0 0 60 18"><path d="${['M0 14 L10 12 L20 13 L30 9 L40 10 L50 6 L60 4','M0 12 L10 14 L20 9 L30 11 L40 7 L50 9 L60 5','M0 10 L10 8 L20 12 L30 6 L40 9 L50 5 L60 7'][i]}"/></svg></span>`).join('')}</div>
  <h3 class="st13-h">Игроки<small>кто открывал приложение</small></h3>
  <div class="st13-c pl"><label class="st13-q in">${ic('search')}<input placeholder="ID, имя или @ник"></label>${PL.map(([a,n,u,w,s])=>`<span class="rw"><span class="av">${a}</span><span class="t"><b>${n}</b><small>${u} · был ${w}</small></span>${s?`<em class="src">${s}</em>`:''}${ic('chev')}</span>`).join('')}<span class="rw mo"><b>Все игроки · 1 284</b>${ic('chev')}</span></div>
  <h3 class="st13-h">Статистика<small>за 7 дней</small></h3>
  <div class="st13-c fn">${FN.map(([t,n,p])=>`<span class="br"><b>${t}</b><i><i style="--p:${p/100}"></i></i><em>${n} · ${p} %</em></span>`).join('')}<span class="md"><b>14 с</b><small>время на задание · медиана</small></span></div>
  <h3 class="st13-h">Доступ<small>нажми — сменить</small></h3>
  <div class="st13-c fl">${FL.map(([t,v,c])=>`<span class="rw"><span class="t"><b>${t}</b></span><em class="pl13 ${c}">${v}</em></span>`).join('')}</div>
  <h3 class="st13-h">Премиум</h3>
  <div class="st13-c pm"><span class="rw"><span class="t"><b>Режим</b><small>что платное</small></span>${sg13('pm',['выкл','функции','+ сцены'],0)}</span><span class="rw"><span class="t"><b>Звёзд за 30 дней</b></span><em class="v">4 250 ★</em></span></div>
  <h3 class="st13-h">Я как игрок</h3>
  <div class="st13-c me"><span class="rw"><span class="t"><b>Смотрю как игрок</b><small>замки, премиум, 18+ — как у всех</small></span>${sw13(false,'pl')}</span>
   <span class="bt"><button>${ic('ticket')}+1000 билетов</button><button>Проверка установки</button></span><button class="rs">Сбросить мой прогресс</button></div>
  <p class="st13-v">13.9.76 · воркер 13.9.34 — передеплой нужен</p></div>
  ${TB5('v3-tb w4b-tb m6-tb m7-tb v8-tb g11-tb',4)}<i class="hb"></i>`;
 const M=$('.st13-m',R);$$('.ad13-n>span,.st13-h,.st13-c',R).forEach((x,i)=>an(x,[{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'none'}],{sp:SPs,dl:80+Math.min(i,10)*55}));
 $$('.ad13-n b',R).forEach(b=>{const v=+b.dataset.v.replace(/\D/g,'');const pre=b.dataset.v.startsWith('+')?'+':'';countUp(ctx,b,v,900);if(pre)ctx.t(()=>{b.textContent=pre+b.textContent},950)});
 $$('.fn .br i>i',R).forEach((x,i)=>an(x,[{transform:'scaleX(0)'},{transform:'scaleX(var(--p))'}],{d:900,e:EO,f:'forwards',dl:400+i*90}));
 const CY={tt:['тестерам','on'],on:['всем','off'],off:['выкл','tt']};
 ctx.on(M,'click',e=>{const t=e.target,p=t.closest('.pl13');if(p){const c=[...p.classList].find(x=>CY[x]);const [,nx]=CY[c];p.classList.replace(c,nx);p.textContent=CY[nx][0];an(p,[{transform:'scale(.8)'},{transform:'none'}],{sp:SPb});toast(R,'Сохранится по «Сохранить» внизу');return}
  const g=t.closest('.st13-sg button');if(g){const s=g.closest('.st13-sg');s.style.setProperty('--i',g.dataset.i);$$('button',s).forEach(x=>x.classList.toggle('on',x===g));return}
  const w=t.closest('.st13-tg');if(w){w.classList.toggle('on');return}
  const b=t.closest('button,.rw');if(b&&!t.closest('input')){an(b,[{transform:'scale(.97)'},{transform:'none'}],{sp:SPb});const tx=($('b',b)||b).textContent.trim();if(tx)toast(R,tx)}});
 ctx.on($('.st13-hd .bk',R),'click',()=>toast(R,'← в Профиль'))}
