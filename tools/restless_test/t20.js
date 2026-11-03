// lg20: лайв-матч строками, «≈ ранг», без «ещё N игр», рейтинг через jsDelivr, если raw закрыт.
// node tools/restless_test/t20.js <папка hr (из ветки hr-data)> <папка скринов> <match_id активного матча>   (сервер 8095 в корне)
const {chromium} = require('playwright'); const {execFileSync} = require('child_process'); const fs = require('fs');
const HR = process.argv[2], O = process.argv[3], MID = process.argv[4]; let ok = true; const chk = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); ok = ok && c; };
(async () => { const b = await chromium.launch(); let rawHits = 0, altHits = 0;
  for (const [n, w, h] of [['pc', 1440, 900], ['ph', 390, 844]]) {
    const p = await b.newPage({viewport: {width: w, height: h}}); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.route('https://raw.githubusercontent.com/**', r => { rawHits++; r.abort(); });   // как в России: raw закрыт
    await p.route('https://cdn.jsdelivr.net/gh/1f8t8graf4-ai/**', r => { altHits++; const f = HR + '/hr/' + r.request().url().split('/hr/')[1]; fs.existsSync(f) ? r.fulfill({status: 200, contentType: 'application/json', headers: {'access-control-allow-origin': '*'}, body: fs.readFileSync(f)}) : r.fulfill({status: 404, body: ''}); });
    await p.route('https://api.deadlock-api.com/**', async r => { try { const out = execFileSync('curl', ['-sS', '-m', '90', r.request().url()], {maxBuffer: 256 << 20}); r.fulfill({status: 200, contentType: 'application/json', headers: {'access-control-allow-origin': '*'}, body: out}); } catch (e) { r.fulfill({status: 502, body: 'x'}); } });
    await p.route(/assets-bucket|avatars|fonts\.|steamstatic|restless\.1f8t8graf4|workers\.dev/, r => r.abort());
    await p.goto(`http://localhost:8095/restless/?dev=vasyan2026#live/m${MID}`);
    await p.waitForSelector('.l20-r', {timeout: 90000}).catch(() => {});
    const R = await p.$$eval('.l20-r', L => L.map(x => ({h: x.getBoundingClientRect().height, tags: x.querySelectorAll('.l20-tg .tag').length})));
    chk(R.length >= 10, `${n}: игроки строками (${R.length})`);
    if (n === 'pc') chk(R.every(x => x.h <= 92), `${n}: строка не выше 92 px (${Math.max(...R.map(x => x.h))})`);
    chk(R.reduce((a, x) => a + x.tags, 0) / Math.max(1, R.length) >= 1.5, `${n}: меток в среднем ${(R.reduce((a, x) => a + x.tags, 0) / Math.max(1, R.length)).toFixed(1)}`);
    await p.waitForFunction(() => !document.querySelector('.l20-rk.est') || document.querySelector('.l20-rk.est.on') || [...document.querySelectorAll('.l20-rk.est')].every(x => x.dataset.ok), null, {timeout: 90000}).catch(() => {});
    await p.waitForTimeout(n === 'pc' ? 20000 : 3000);
    const est = await p.$$eval('.l20-rk.est', L => [L.length, L.filter(x => x.classList.contains('on')).length, (L.find(x => x.classList.contains('on')) || {}).textContent || '']);
    chk(!est[0] || est[1] > 0, `${n}: без ранга — «≈ ранг» по соперникам: ${est[1]} из ${est[0]} ${est[2]}`);
    const txt = await p.evaluate(() => document.body.innerText);
    chk(!/ещё \d+ игр/.test(txt), `${n}: нет «ещё N игр»`);
    const sw = await p.evaluate(() => document.documentElement.scrollWidth); chk(sw <= w, `${n}: не едет вбок (${sw})`);
    await p.screenshot({path: `${O}/t20-live-${n}.png`, fullPage: n === 'pc'});
    // профиль Андрея: место на Rat King через jsDelivr, без «ещё N игр» и «Пока вне рейтинга»
    await p.goto('http://localhost:8095/restless/?id=930626915&dev=vasyan2026#home');
    await p.waitForSelector('#p11hl', {timeout: 90000}).catch(() => {});
    const pos = await p.evaluate(() => heroRating(84, 930626915).then(r => r && r.pos ? (r.apx ? '~#' : '#') + r.pos : 'нет'));
    chk(pos !== 'нет', `${n}: место на Rat King через jsDelivr: ${pos}`);
    await p.waitForTimeout(4000);
    const t2 = await p.evaluate(() => document.body.innerText);
    chk(!/ещё \d+ игр/.test(t2) && !/Пока вне рейтинга/.test(t2), `${n}: в профиле нет «ещё N игр» и «Пока вне рейтинга»`);
    await p.screenshot({path: `${O}/t20-prof-${n}.png`});
    chk(!errs.length, `${n}: без ошибок (${errs.slice(0, 2)})`);
    await p.close();
  }
  chk(rawHits > 0 && altHits > 0, `raw закрыт → брали jsDelivr (${rawHits} / ${altHits})`);
  await b.close(); process.exit(ok ? 0 : 1);
})();
