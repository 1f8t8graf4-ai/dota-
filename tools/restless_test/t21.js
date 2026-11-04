// lg21: «Лайв-матч» в программе — из игры (мод → программа → rlGame), а не прошлый матч из API; игры в профиле не пропадают.
// node tools/restless_test/t21.js <папка скринов>   (сервер 8095 в корне; API — через curl)
const {chromium} = require('playwright'); const {execFileSync} = require('child_process');
const O = process.argv[2]; let ok = true; const chk = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); ok = ok && c; };
const ME = 930626915, MID = 130008912;
(async () => {
  const P = JSON.parse(execFileSync('curl', ['-sS', '-m', '90', '-G', 'https://api.deadlock-api.com/v1/sql', '--data-urlencode',
    `query=SELECT mp.account_id a, mp.hero_id h, mp.team t, coalesce(p.personaname,'') n FROM match_player mp LEFT JOIN steam_profiles p ON p.account_id=mp.account_id WHERE mp.match_id=${MID}`]).toString());
  const mine = P.find(x => x.a === ME), players = P.map(x => ({a: x.a, hid: x.h, n: x.n, t: x.t === mine.t ? 'f' : 'e'}));
  const b = await chromium.launch(); let drop = 0;
  for (const [n, w, h] of [['pc', 1440, 900], ['ph', 390, 844]]) {
    const ctx = await b.newContext({viewport: {width: w, height: h}}); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.route('https://api.deadlock-api.com/**', async r => { try { let body = execFileSync('curl', ['-sS', '-m', '90', r.request().url()], {maxBuffer: 256 << 20}).toString();
      // второй заход: API «потерял» 2 последние игры (как у Андрея)
      if (drop && /\/players\/\d+\/match-history/.test(r.request().url())) { const L = JSON.parse(body); body = JSON.stringify(L.slice(drop)); }
      r.fulfill({status: 200, contentType: 'application/json', headers: {'access-control-allow-origin': '*'}, body}); } catch (e) { r.abort(); } });
    await p.route(/assets-bucket|avatars|fonts\.|steamstatic|restless\.1f8t8graf4|workers\.dev|raw\.githubusercontent|jsdelivr/, r => r.abort());
    // ---- программа: идёт матч, мод прислал 12 игроков ----
    await p.goto(`http://localhost:8095/restless/?app=1&id=${ME}&dev=vasyan2026#live`);
    await p.waitForFunction(() => typeof window.rlGame === 'function', null, {timeout: 30000});
    await p.waitForTimeout(1500);
    const game = s => p.evaluate(([s, pl]) => { window.rlApp({ver: '0.4.6', live: s === 'm', proc: true, keys: ['Ctrl+Alt+H']}); window.rlGame(s ? {s, at: Date.now(), gt: '27:11', players: s === 'm' ? pl : []} : null); }, [s, players]);
    await game('m');
    await p.waitForSelector('#ovb .q-pc', {timeout: 90000}).catch(() => {});
    const R = await p.$$eval('#ovb .q-pc', L => L.length);
    const head = await p.evaluate(() => (document.querySelector('.q-mh') || {}).innerText || '');
    chk(R >= 12, `${n}: «Лайв-матч» — игроки из игры строками (${R})`);
    chk(/идёт матч/.test(head) && !/последний матч/i.test(head), `${n}: шапка «идёт матч», не «последний матч» (${head.replace(/\s+/g, ' ').slice(0, 60)})`);
    const tab = await p.evaluate(() => { const a = document.querySelector('#tabs [data-t="live"]'); return a ? a.classList.contains('live') : null; });
    chk(tab === true, `${n}: вкладка «Лайв-матч» горит LIVE`);
    await p.screenshot({path: `${O}/t21-game-${n}.png`});
    // ---- #ov (авто-открытие на матч) → та же вкладка ----
    await p.evaluate(() => { location.hash = '#ov'; }); await p.waitForTimeout(1500);
    const hs = await p.evaluate(() => location.hash);
    chk(hs === '#live' && await p.$('#ovb .q-pc') !== null, `${n}: #ov в программе → «Лайв-матч» (${hs})`);
    const lv = await p.evaluate(() => (document.querySelector('.rl-live') || {}).getAttribute ? document.querySelector('.rl-live').getAttribute('href') : '');
    chk(lv === '#live', `${n}: «● LIVE» в полосе окна ведёт на «Лайв-матч» (${lv})`);
    // ---- матч кончился: «Матч закончился», а не прошлый матч ----
    await game('h'); await p.waitForTimeout(7000);
    const t1 = await p.evaluate(() => document.querySelector('#ovb') ? document.querySelector('#ovb').innerText : document.body.innerText.slice(0, 300));
    chk(/Матч закончился/.test(t1), `${n}: матч кончился — «Матч закончился» держится`);
    // ---- игра закрыта — обычный лайв (последний матч из API) ----
    await p.evaluate(() => { window.rlGame({s: 'h', at: Date.now() - 60000, players: []}); }); await p.waitForTimeout(7000);
    await p.waitForSelector('.q-mh .tag', {timeout: 60000}).catch(() => {});
    const t2 = await p.evaluate(() => document.body.innerText);
    chk(/последний матч/i.test(t2), `${n}: игра закрыта — обычный лайв`);
    // ---- матч снова начался, пока открыт обычный лайв ----
    await game('m'); await p.waitForSelector('#ovb .q-pc', {timeout: 60000}).catch(() => {});
    chk(await p.$('#ovb .q-pc') !== null, `${n}: матч начался — «Лайв-матч» сам переключился на игру`);
    // ---- обычный браузер (не программа): лайв как раньше ----
    const p2 = await ctx.newPage(); await p2.route('https://api.deadlock-api.com/**', r => { try { r.fulfill({status: 200, contentType: 'application/json', headers: {'access-control-allow-origin': '*'}, body: execFileSync('curl', ['-sS', '-m', '90', r.request().url()], {maxBuffer: 256 << 20}).toString()}); } catch (e) { r.abort(); } });
    await p2.route(/assets-bucket|avatars|fonts\.|steamstatic|restless\.1f8t8graf4|workers\.dev|raw\.githubusercontent|jsdelivr/, r => r.abort());
    await p2.goto(`http://localhost:8095/restless/?id=${ME}&dev=vasyan2026#ov`); await p2.waitForTimeout(2500);
    chk(await p2.evaluate(() => location.hash) === '#ov', `${n}: в браузере #ov остаётся оверлеем`); await p2.close();
    // ---- история: API потерял 2 последние игры — в профиле они остаются ----
    drop = 0;
    await p.goto(`http://localhost:8095/restless/?id=${ME}&dev=vasyan2026#home`);
    await p.waitForFunction(mid => document.body.innerHTML.includes(String(mid)), MID, {timeout: 90000}).catch(() => {});
    chk(await p.evaluate(mid => document.body.innerHTML.includes(String(mid)), MID), `${n}: профиль — последняя игра ${MID} есть`);
    await p.evaluate(() => caches.delete('rl-api-1')); drop = 2;
    await p.goto(`http://localhost:8095/restless/?id=${ME}&dev=vasyan2026&r=2#home`);
    await p.waitForFunction(() => /Последние игры/.test(document.body.innerText), null, {timeout: 90000}).catch(() => {}); await p.waitForTimeout(4000);
    const kept = await p.evaluate(mid => document.body.innerHTML.includes(String(mid)), MID);
    chk(kept, `${n}: API отдал историю без 2 последних игр — они остались`);
    const st = await p.evaluate(() => { const S = JSON.parse(localStorage.getItem('rl-mh') || '{}'); return Object.keys(S).map(k => k + ':' + S[k].L.length).join(','); });
    chk(/930626915:40/.test(st), `${n}: память истории (${st})`);
    await p.screenshot({path: `${O}/t21-prof-${n}.png`});
    drop = 0;
    chk(!errs.length, `${n}: без ошибок (${errs.slice(0, 2)})`);
    await ctx.close();
  }
  await b.close(); process.exit(ok ? 0 : 1);
})();
