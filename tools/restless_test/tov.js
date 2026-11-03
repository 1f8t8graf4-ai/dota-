// Оверлей в программе (?ov=1&app=1#ov): матч из игры (мод 0.13 → программа → window.rlGame), а не из API топ-матчей.
// node tools/restless_test/tov.js <папка скринов>   (сервер: python3 -m http.server 8095 в корне репо)
const {chromium}=require('playwright');const {execFileSync}=require('child_process');const fs=require('fs');
const O=process.argv[2]||'.';const col=u=>{let h=0;for(const c of u)h=(h*31+c.charCodeAt(0))>>>0;return `hsl(${h%360},45%,38%)`};
let fail=0;const ok=(c,t)=>{console.log((c?'PASS ':'FAIL ')+t);if(!c)fail++};
(async()=>{
 // 12 настоящих игроков из идущего матча — чтобы API вернул им ранги и героев
 const A=JSON.parse(execFileSync('curl',['-sS','-m','60','https://api.deadlock-api.com/v1/matches/active'],{maxBuffer:64<<20}));
 const m=A.find(x=>(x.players||[]).length===12);const me=m.players[0];
 const P=m.players.map(x=>({t:x.team===me.team?'f':'e',n:'',h:'',hid:x.hero_id,a:x.account_id}));
 const S=JSON.parse(execFileSync('curl',['-sS','-m','60','https://api.deadlock-api.com/v1/players/steam?account_ids='+m.players.map(x=>x.account_id).join(',')],{maxBuffer:64<<20}));
 P.forEach(p=>{const s=S.find(x=>x.account_id===p.a);p.n=s?s.personaname:'Игрок'});
 P[3].a=0;P[3].hid=0;P[3].h='Венатор';       // у одного нет ID и hero_id — ищем по нику, героя — по русскому имени
 P[5].a=0;P[5].n='нет_такого_ника_'+Date.now(); // ник не находится — «Профиль не найден»
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:460,height:900}});const errs=[];p.on('console',x=>{if(x.type()==='error')errs.push(x.text())});p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
 let searches=0,actives=0;
 await p.route('https://api.deadlock-api.com/**',async r=>{const u=r.request().url();if(/steam-search/.test(u))searches++;if(/matches\/active/.test(u))actives++;try{const out=execFileSync('curl',['-sS','-m','90',u],{maxBuffer:256<<20});r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:out})}catch(e){r.fulfill({status:502,body:'x'})}});
 await p.route('https://assets-bucket.deadlock-api.com/**',r=>r.fulfill({status:200,contentType:'image/svg+xml',body:`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><circle cx="32" cy="32" r="24" fill="${col(r.request().url())}"/></svg>`}));
 await p.route(/avatars|fonts\./,r=>r.abort());
 await p.goto(`http://localhost:${process.env.PORT||8095}/restless/?id=930626915&ov=1&app=1&dev=vasyan2026#ov`);
 await p.waitForSelector('#ov',{timeout:60000});await p.waitForTimeout(2500);
 ok(!(await p.$('#rlk')),'замок разработки снят ключом из программы');
 ok(await p.evaluate(()=>document.documentElement.classList.contains('rl-app')),'режим программы: класс rl-app (шапка тянется)');
 await p.evaluate(()=>window.rlApp({mod:{status:'installed',file:'pak42_dir.vpk'},keys:['Ctrl+Alt+H','Ctrl+Alt+T'],proc:true}));
 let t=await p.$eval('#ovapp',e=>e.innerText);ok(/мод поставлен/.test(t)&&/Ctrl\+Alt\+H/.test(t)&&/мод молчит/.test(t),'строка программы: '+t.replace(/\n/g,' | '));
 await p.waitForFunction(()=>/жду матч/.test(document.querySelector('#ovst').textContent),null,{timeout:30000}).catch(()=>{});
 t=await p.$eval('#ovb',e=>e.innerText);ok(/Сейчас ты не в матче/.test(t)&&/топ-матчи/.test(t),'без игры — объясняет, что нужен мод: '+t.slice(0,80).replace(/\n/g,' '));
 await p.screenshot({path:`${O}/ov-wait.png`});
 // игра прислала матч
 const a0=actives;
 await p.evaluate(P=>window.rlGame({v:'0.13',s:'m',gt:'03:12',players:P,at:Date.now()}),P);
 await p.waitForFunction(()=>document.querySelectorAll('#ovb .q-pc').length===12,null,{timeout:150000}).catch(()=>{});
 const n=await p.$$eval('#ovb .q-pc',L=>L.length);ok(n===12,'12 карточек игроков из игры: '+n);
 ok(/ты в матче · 03:12/.test(await p.$eval('#ovst',e=>e.textContent)),'статус: '+await p.$eval('#ovst',e=>e.textContent));
 const names=await p.$$eval('#ovb .q-pc .q-pnm',L=>L.map(e=>e.textContent));
 ok(names.some(x=>x===P[3].n||x===P[3].n+' ?'),'игрок без ID найден по нику: '+P[3].n);
 ok(names.some(x=>x.startsWith('нет_такого_ника')),'ник не нашёлся — подписан ником из игры');
 ok(searches>=2,'поиск по нику — для тех, у кого нет ID: '+searches);
 ok(await p.$$eval('#ovb .q-pc .hn',L=>L.some(e=>e.textContent==='Venator')),'герой по русскому имени «Венатор» → Venator');
 ok(await p.$$eval('#ovb .q-team',L=>L.length===2),'две команды');
 ok(/укрытие|игроков 12/.test(await p.$eval('#ovapp',e=>e.innerText)),'строка программы: игра на связи');
 await p.screenshot({path:`${O}/ov-match.png`,fullPage:true});
 // тот же матч ещё раз (сигнал раз в 15 с) — не перерисовывает
 const s0=searches;await p.evaluate(P=>window.rlGame({v:'0.13',s:'m',gt:'03:27',players:P,at:Date.now()}),P);await p.waitForTimeout(6000);
 ok(searches===s0&&await p.$$eval('#ovb .q-pc',L=>L.length)===12,'«живой» сигнал того же матча — без повторной загрузки');
 ok(actives===a0||actives<=a0+1,'пока игра на связи — API топ-матчей не дёргаем: '+(actives-a0));
 // матч кончился
 await p.evaluate(()=>window.rlGame({v:'0.13',s:'h',gt:'',players:[],at:Date.now()}));await p.waitForTimeout(6000);
 ok(/Матч закончился/.test(await p.$eval('#ovb',e=>e.innerText)),'вернулся в укрытие — «Матч закончился» и профиль');
 await p.screenshot({path:`${O}/ov-end.png`});
 console.log('вбок:',await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));
 const E=errs.filter(e=>!/Failed to load resource|ERR_FAILED/.test(e));ok(!E.length,'консоль: '+(E.join(' / ')||'чисто'));
 await b.close();console.log(fail?'\nКРАСНЫХ: '+fail:'\nвсё PASS');process.exit(fail?1:0)})();
