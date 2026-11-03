// lg22: лайв-матч снова карточками — вся команда (6) в один ряд, обе команды на экране окна программы.
// node tools/restless_test/t22.js <папка скринов>   (сервер 8095 в корне; API — через curl)
const {chromium} = require('playwright'); const {execFileSync} = require('child_process');
const O = process.argv[2]; let ok = true; const chk = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); ok = ok && c; };
const ME = 930626915, MID = 130008912;
(async () => {
  const P = JSON.parse(execFileSync('curl', ['-sS', '-m', '90', '-G', 'https://api.deadlock-api.com/v1/sql', '--data-urlencode',
    `query=SELECT mp.account_id a, mp.hero_id h, mp.team t, coalesce(p.personaname,'') n FROM match_player mp LEFT JOIN steam_profiles p ON p.account_id=mp.account_id WHERE mp.match_id=${MID}`]).toString());
  const mine = P.find(x => x.a === ME), players = P.map(x => ({a: x.a, hid: x.h, n: x.n, t: x.t === mine.t ? 'f' : 'e'}));
  const b = await chromium.launch();
  // окно программы: 0.4.7 по умолчанию 1600×960; 1240×650 — экран 1080p с масштабом 150 %; 1180×820 — старое окно; телефон
  for (const [n, w, h, full] of [['win', 1600, 960, 1], ['w150', 1240, 650, 0], ['old', 1180, 820, 0], ['ph', 390, 844, 0]]) {
    const ctx = await b.newContext({viewport: {width: w, height: h}}); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.route('https://api.deadlock-api.com/**', r => { try { r.fulfill({status: 200, contentType: 'application/json', headers: {'access-control-allow-origin': '*'}, body: execFileSync('curl', ['-sS', '-m', '90', r.request().url()], {maxBuffer: 256 << 20}).toString()}); } catch (e) { r.abort(); } });
    await p.route(/assets-bucket|avatars|fonts\.|steamstatic|restless\.1f8t8graf4|workers\.dev|raw\.githubusercontent|jsdelivr/, r => r.abort());
    await p.goto(`http://localhost:8095/restless/?app=1&id=${ME}&dev=vasyan2026#live`);
    await p.waitForFunction(() => typeof window.rlGame === 'function', null, {timeout: 30000}); await p.waitForTimeout(1200);
    // игра шлёт сигнал раз в ~15 с — без него через 45 с матч «кончается»
    await p.evaluate(pl => { window.rlApp({ver: '0.4.7', live: true, proc: true, keys: ['Ctrl+Alt+H']}); window.__hb = () => window.rlGame({s: 'm', at: Date.now(), gt: '27:11', players: pl}); window.__hb(); window.__hbi = setInterval(window.__hb, 10000); }, players);
    await p.waitForFunction(() => document.querySelectorAll('#ovb .q-pc').length >= 12, null, {timeout: 120000}).catch(() => {});
    await p.waitForTimeout(4000);
    const M = await p.evaluate(() => { const C = [...document.querySelectorAll('#ovb .q-pc')]; const tops = C.map(c => Math.round(c.getBoundingClientRect().top));
      const row1 = tops.filter(t => t === tops[0]).length, hs = C.map(c => c.getBoundingClientRect().height);
      const last = C[C.length - 1].getBoundingClientRect(), first = C[0].getBoundingClientRect();
      return {n: C.length, row1, hmax: Math.round(Math.max(...hs)), span: Math.round(last.bottom - first.top), sw: document.documentElement.scrollWidth,
        rows: C.some(c => c.classList.contains('l20-r')), est: document.querySelectorAll('#ovb .l10-rn.est.on').length, noest: document.querySelectorAll('#ovb .l10-rn.est').length,
        clip: C.filter(c => c.querySelector('.l10-rc') && c.querySelector('.l10-rc').scrollWidth > c.querySelector('.l10-rc').clientWidth + 1).length}; });
    chk(M.n === 12 && !M.rows, `${n}: 12 карточек, строк lg20 нет`);
    if (w >= 900) chk(M.row1 === 6, `${n}: команда в один ряд (${M.row1})`);
    else chk(M.row1 >= 2, `${n}: в ряд ${M.row1}`);
    console.log(`  ${n}: высота карточки ${M.hmax}, обе команды ${M.span} px из ${h}`);
    if (full) chk(M.span <= h - 230, `${n}: обе команды помещаются под шапкой окна (${M.span} ≤ ${h - 230})`);
    chk(M.sw <= w, `${n}: не едет вбок (${M.sw})`);
    chk(!M.clip, `${n}: значки последних игр не вылезают`);
    chk(!M.noest || M.est > 0, `${n}: «≈ ранг» у тех, у кого нет ранга (${M.est} из ${M.noest})`);
    await p.evaluate(() => { const t = document.querySelector('#ovb'); if (t) t.scrollIntoView({block: 'start'}); window.scrollBy(0, -90); });
    await p.screenshot({path: `${O}/t22-${n}.png`});
    // обычный лайв (без игры) — тоже карточки
    if (n === 'win') { await p.evaluate(() => { clearInterval(window.__hbi); window.rlGame({s: 'h', at: Date.now() - 60000, players: []}); }); await p.waitForTimeout(6000);
      await p.waitForSelector('#lvb .q-pc', {timeout: 90000}).catch(() => {});
      chk(await p.$$eval('#lvb .q-pc', L => L.length) >= 12, `${n}: обычный лайв — карточки`); await p.screenshot({path: `${O}/t22-${n}-api.png`}); }
    // лобби с ботами (старая программа шлёт его как матч): бот зовётся как герой
    if (n === 'win') {
      const bots = [{a: ME, hid: 7, n: 'БилБаб', h: 'Тень', t: 'f'}, {a: 0, hid: 1, n: 'Инфернус', h: 'Инфернус', t: 'f'}, {a: 0, hid: 6, n: 'Абрамс', h: 'Абрамс', t: 'e'}];
      await p.evaluate(pl => { window.rlApp({ver: '0.3.1', live: true, proc: true, keys: ['Ctrl+Alt+H']}); window.__hb = () => window.rlGame({s: 'm', at: Date.now(), gt: '0:31', players: pl}); window.__hb(); window.__hbi = setInterval(window.__hb, 10000); }, bots);
      await p.waitForTimeout(5000);
      const B = await p.evaluate(() => ({cards: document.querySelectorAll('.q-pc').length, txt: document.body.innerText, lv: document.querySelector('#tabs [data-t="live"]').classList.contains('live'), s: OV.G && OV.G.s}));
      chk(B.s === 'b' && !B.cards && /Матч с ботами/.test(B.txt), `${n}: лобби с ботами — не матч (${B.s}, карточек ${B.cards})`);
      chk(!B.lv, `${n}: при ботах «Лайв-матч» не горит LIVE`);
      await p.evaluate(() => { location.hash = '#ov'; }); await p.waitForTimeout(1500);
      chk(await p.evaluate(() => location.hash === '#live' && /Матч с ботами/.test(document.body.innerText)), `${n}: #ov старой программы → «Лайв-матч», без компактной панели`);
      const en = [{a: ME, hid: 7, n: 'БилБаб', h: 'Haze', t: 'f'}, {a: 0, hid: 1, n: 'Infernus', h: 'Infernus', t: 'f'}, {a: 0, hid: 6, n: 'Abrams', t: 'e'}];
      chk(await p.evaluate(pl => lgBots({s: 'm', players: pl}), en), `${n}: боты и в английской игре`);
      chk(!(await p.evaluate(pl => lgBots({s: 'm', players: pl}), players)), `${n}: настоящий матч ботами не считается`);
      await p.evaluate(() => clearInterval(window.__hbi));
    }
    chk(!errs.length, `${n}: без ошибок (${errs.slice(0, 2)})`);
    await ctx.close();
  }
  await b.close(); process.exit(ok ? 0 : 1);
})();
