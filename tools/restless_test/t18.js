// Вкладка «Оверлей» (lg18: пресеты зонами, Custom, FPS) и рейтинг героя из таблиц конвейера (lg17).
// node tools/restless_test/t18.js <папка с hr/*.json от tools/hr_build.py> <папка скринов>   (сервер: python3 -m http.server 8095 в корне)
// быстрый прогон: #ovs (пресеты зонами, FPS) и рейтинг из таблиц (raw → локальные файлы)
const {chromium} = require('playwright'); const {execFileSync} = require('child_process'); const fs = require('fs');
const HR = process.argv[2], O = process.argv[3]; let ok = true; const chk = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); ok = ok && c; };
(async () => { const b = await chromium.launch();
  for (const [n, w, h] of [['pc', 1440, 900], ['ph', 390, 844]]) {
    const p = await b.newPage({viewport: {width: w, height: h}}); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.route('https://raw.githubusercontent.com/**', r => { const f = HR + '/hr/' + r.request().url().split('/hr/')[1]; fs.existsSync(f) ? r.fulfill({status: 200, contentType: 'application/json', headers: {'access-control-allow-origin': '*'}, body: fs.readFileSync(f)}) : r.fulfill({status: 404, body: ''}); });
    await p.route('https://api.deadlock-api.com/**', async r => { try { const out = execFileSync('curl', ['-sS', '-m', '90', r.request().url()], {maxBuffer: 256 << 20}); r.fulfill({status: 200, contentType: 'application/json', headers: {'access-control-allow-origin': '*'}, body: out}); } catch (e) { r.fulfill({status: 502, body: 'x'}); } });
    await p.route(/assets-bucket|avatars|fonts\.|steamstatic|restless\.1f8t8graf4|workers\.dev/, r => r.abort());
    await p.goto('http://localhost:8095/restless/?dev=vasyan2026#ovs'); await p.waitForSelector('.o18-z', {timeout: 30000}); await p.waitForTimeout(500);
    const tb = await p.$$eval('#ovptabs button', L => L.map(x => x.querySelector('b').textContent + (x.getAttribute('aria-selected') === 'true' ? '*' : '')));
    chk(tb.join(',') === 'Lite*,Medium,Enchanted,Custom', `${n}: 4 пресета, по умолчанию Lite (${tb})`);
    const cnt = async () => p.$$eval('#ovpside .ovp-l li.on', L => L.length);
    const c1 = await cnt(); await p.click('#ovptabs [data-p="mid"]'); await p.waitForTimeout(200); const c2 = await cnt();
    await p.click('#ovptabs [data-p="ench"]'); await p.waitForTimeout(200); const c3 = await cnt();
    chk(c1 > 8 && c1 < c2 && c2 < c3, `${n}: Lite ${c1} < Medium ${c2} < Enchanted ${c3}`);
    const zones = await p.$$eval('.o18-z.on', L => L.length); chk(zones >= 8, `${n}: зоны экрана подсвечены (${zones})`);
    await p.screenshot({path: `${O}/ovs-ench-${n}.png`});
    await p.click('.o18-z[data-z="map"]'); await p.waitForTimeout(200);
    const h4 = await p.$$eval('#ovpside .o18-h', L => L.map(x => x.textContent)); chk(h4.length === 1 && h4[0] === 'Мини-карта', `${n}: нажал зону — только её функции (${h4})`);
    await p.click('#o18all'); await p.click('#ovptabs [data-p="lite"]'); await p.click('#o18cp'); await p.waitForTimeout(200);
    chk(await p.$eval('#ovptabs [data-p="my"]', e => e.getAttribute('aria-selected')) === 'true' && (await cnt()) === c1, `${n}: «Сделать свой» — Custom с набором Lite`);
    await p.check('#ovpside [data-t="kbd"]'); await p.check('#ovpside [data-t="tbl"]'); await p.waitForTimeout(200);
    const sv = await p.evaluate(() => JSON.parse(localStorage.getItem('rl-ovp2')));
    chk(sv.my.on.includes('kbd') && sv.my.vw.includes('tbl') && sv.p === 'my', `${n}: Custom: функция и настройка вида сохранились`);
    await p.click('#o18fps [data-f="mid"]'); chk(await p.evaluate(() => localStorage.getItem('rl-fps')) === 'mid', `${n}: FPS — выбор запомнился`);
    const sw = await p.evaluate(() => document.documentElement.scrollWidth); chk(sw <= w, `${n}: страница не едет вбок (${sw})`);
    await p.screenshot({path: `${O}/ovs-my-${n}.png`, fullPage: n === 'ph'});
    // рейтинг из таблицы
    const r = await p.evaluate(async () => { const a = await heroRating(84, 1543350624), x = await heroRating(84, 930626915), L = await hlRows(84, 1, 3), t = await heroTotal(84); return {a, x, L, t}; });
    chk(r.a.lg && r.a.pos > 0 && r.a.sc && r.a.sc.et > 0, `${n}: место из таблицы #${r.a.pos} · ${r.a.v} очков · враги тир ${r.a.sc.et}`);
    chk(!r.x.pos && ['few', 'idle', 'soon'].includes(r.x.why), `${n}: не в таблице — почему: ${r.x.why}, ${r.x.m} игр`);
    chk(r.L.length === 3 && r.L[0].rank === 1 && r.L[0].R >= r.L[1].R && r.t > 1000, `${n}: топ из таблицы, всего ${r.t}`);
    await p.goto('http://localhost:8095/restless/?dev=vasyan2026#h/84'); await p.waitForSelector('#l14lb .l16-r', {timeout: 90000}).catch(() => {});
    await p.waitForTimeout(1500); const rows = await p.$$eval('#l14lb .l16-r', L => L.length), how = await p.$eval('.l16-how', e => e.textContent).catch(() => '');
    chk(rows >= 5 && /средний ранг врагов/.test(how) && /раз в сутки/.test(how), `${n}: страница героя — топ ${rows} строк, «Как считаем» про ранг врагов`);
    await p.screenshot({path: `${O}/hero-${n}.png`});
    chk(!errs.length, `${n}: консоль чистая ${errs.slice(0, 2).join(' | ')}`);
    await p.close();
  }
  await b.close(); console.log(ok ? '\nвсё PASS' : '\nЕСТЬ FAIL'); process.exit(ok ? 0 : 1);
})();
