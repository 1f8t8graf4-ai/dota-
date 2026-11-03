// Рейтинг героя (lg14): топ мира на странице героя, страница игрока с его сборкой, подсказка на эмблеме ранга, цель в профиле.
// node tools/restless_test/t14.js <папка скринов> [hero_id=79 (Рэм)]   (сервер: python3 -m http.server 8095 в корне репо)
const {chromium} = require('playwright'); const {execFileSync} = require('child_process');
const O = process.argv[2] || '.', HID = +(process.argv[3] || 79);
let fail = 0; const ok = (c, t) => { console.log((c ? 'PASS ' : 'FAIL ') + t); if (!c) fail++; };
const BASE = `http://localhost:${process.env.PORT || 8095}/restless/`;
const get = u => JSON.parse(execFileSync('curl', ['-sS', '-m', '90', 'https://api.deadlock-api.com/v1/' + u], {maxBuffer: 64 << 20}));
async function page(b, w, h, id) {
  const ctx = await b.newContext({viewport: {width: w, height: h}, permissions: ['clipboard-read', 'clipboard-write']});
  const p = await ctx.newPage(); const errs = [];
  p.on('console', x => { if (x.type() === 'error' && !/ERR_FAILED|Failed to load resource/.test(x.text())) errs.push(x.text()); }); p.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  await p.route('https://api.deadlock-api.com/**', async r => { try { const out = execFileSync('curl', ['-sS', '-m', '90', r.request().url()], {maxBuffer: 256 << 20}); r.fulfill({status: 200, contentType: 'application/json', headers: {'access-control-allow-origin': '*'}, body: out}); } catch (e) { r.fulfill({status: 502, body: 'x'}); } });
  // эмблемы и аватарки — заглушка-картинка (CDN из облака закрыт), чтобы на них можно было навести
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
  await p.route(/assets-bucket|avatars|steamstatic/, r => r.fulfill({status: 200, contentType: 'image/png', body: png}));
  await p.route(/fonts\.|restless\.1f8t8graf4/, r => r.abort());
  await p.addInitScript(id => { try { if (id) localStorage.setItem('rl-id', String(id)); else localStorage.removeItem('rl-id'); } catch (e) {} }, id);
  p.errs = errs; return p;
}
(async () => {
  const t90 = Math.floor(Date.now() / 1000) - 90 * 86400 - Math.floor(Date.now() / 1000) % 86400;
  const TOP = get(`analytics/scoreboards/players?hero_id=${HID}&sort_by=rank&min_matches=20&min_unix_timestamp=${t90}&start=1&limit=10`);
  ok(TOP.length >= 5 && TOP.every(x => x.matches >= 20 && x.badge >= 10), `API: топ героя — только с рангом и 20+ играми (${TOP.length}, ранги ${TOP.map(x => x.badge).join(',')})`);
  const b = await chromium.launch();
  for (const [w, h, n] of [[1440, 900, 'pc'], [390, 844, 'ph']]) {
    const p = await page(b, w, h, 930626915);
    await p.goto(BASE + `?dev=vasyan2026#h/${HID}`);
    await p.waitForSelector('#l14lb .l14-r', {timeout: 120000}).catch(() => {});
    const L = await p.$$eval('#l14lb .l14-r', R => R.map(r => ({h: r.getAttribute('href'), b: r.querySelector('b').textContent, rk: !!r.querySelector('.l14-rk img'), n: r.querySelector('.l14-n').textContent})));
    ok(L.length === Math.min(10, TOP.length) && L[0].h === `#h/${HID}/p${TOP[0].account_id}`, `${n}: топ мира на странице героя — ${L.length} строк, №1 ведёт на его страницу (${L[0] && L[0].h})`);
    ok(L.every(x => x.rk) && L[0].n === '🥇', `${n}: у каждого эмблема ранга, у первых трёх медали`);
    const vis = async () => p.$$eval('#l14lb .l14-r', R => R.filter(r => r.offsetParent).length);
    const v0 = await vis(); const top = await p.$eval('#l14lb', e => e.closest('section').previousElementSibling && e.closest('section').previousElementSibling.id);
    ok(v0 <= 6 && top === 'hst', `${n}: топ стоит сразу под цифрами героя, видно ${v0}`);
    if (L.length > 5) { await p.click('#l14more'); ok(await vis() === L.length, `${n}: «Ещё 5» — весь топ-10`); }
    await p.waitForFunction(() => { const m = document.querySelector('#l14me'); return !m || !/считаю/.test(m.textContent); }, null, {timeout: 150000}).catch(() => {});
    const me = await p.evaluate(() => (document.querySelector('#l14me') || {}).textContent || '');
    ok(/^Ты · (вне рейтинга|#)/.test(me), `${n}: строка «Ты» под топом — ${me}`);
    // эмблема: наведение — название ранга и доля игроков
    const im = await p.$('#l14lb .l14-r .l14-rk img'); await im.scrollIntoViewIfNeeded(); await im.hover();
    await p.waitForFunction(() => /(выше, чем у|топ) [\d,]+ % игроков/.test(document.querySelector('#l14lb .l14-r .l14-rk img').title), null, {timeout: 60000}).catch(() => {});
    const tt = await p.$eval('#l14lb .l14-r .l14-rk img', e => e.title); ok(/^\S.* · (выше, чем у|топ) [\d,]+ % игроков · на этом ранге [\d,]+ %$/.test(tt), `${n}: эмблема при наведении — «${tt}»`);
    await p.screenshot({path: `${O}/t14-ladder-${n}.png`, fullPage: false});
    // страница игрока — его сборка
    await p.click('#l14lb .l14-r'); await p.waitForSelector('#l14pl .l14-ph', {timeout: 150000}).catch(() => {});
    await p.waitForFunction(() => document.querySelector('#l14pl') && !/Смотрю игрока/.test(document.querySelector('#l14pl').textContent), null, {timeout: 150000}).catch(() => {});
    const pl = await p.evaluate(() => { const e = document.querySelector('#l14pl'); return e ? {t: e.innerText, pl: (e.querySelector('.l14-pl2') || {}).textContent, card: !!e.querySelector('.q-bc, [data-cp]'), cp: (e.querySelector('[data-cp]') || {}).dataset} : null; });
    ok(pl && /^#1 /.test(pl.pl || ''), `${n}: страница игрока — «${pl && pl.pl}»`);
    ok(pl && /Его сборка/i.test(pl.t) && (pl.card || /сборк/i.test(pl.t)), `${n}: «Его сборка» — ${pl && pl.card ? 'карточка с ID' : (pl && pl.t.split(/Его сборка/i)[1] || '').slice(0, 90).replace(/\n/g, ' ')}`);
    if (pl && pl.cp && pl.cp.cp) {
      await p.click('#l14pl [data-cp]'); await p.waitForTimeout(300);
      const clip = await p.evaluate(() => navigator.clipboard.readText()).catch(() => '');
      ok(clip === pl.cp.cp, `${n}: «ID» — скопирован ${clip}`);
    }
    await p.screenshot({path: `${O}/t14-player-${n}.png`, fullPage: false});
    ok(await p.evaluate(() => document.documentElement.scrollWidth) <= w, `${n}: страница не едет вбок`);
    ok(!p.errs.length, `${n}: консоль чистая ` + p.errs.slice(0, 3).join(' | '));
    await p.close();
  }
  // профиль: цель — рейтинг героя (у топ-1 — «#1 …», у игрока без ранга — «Пока вне рейтинга»)
  for (const [id, want, nm] of [[TOP[0].account_id, /^Рейтинг героя · лучшее место#1 /i, 'топ-1'], [930626915, /Пока вне рейтинга/, 'без ранга']]) {
    const p = await page(b, 1440, 900, id);
    await p.goto(BASE + '?dev=vasyan2026#home'); await p.waitForSelector('#l14goal', {timeout: 200000}).catch(() => {});
    const g = await p.evaluate(() => (document.querySelector('#l14goal') || {}).innerText || '');
    ok(want.test(g.replace(/\n/g, '')), `профиль (${nm}): цель — ${g.replace(/\n/g, ' · ')}`);
    await p.screenshot({path: `${O}/t14-goal-${nm.replace(/\s/g, '')}.png`});
    ok(!p.errs.length, `профиль (${nm}): консоль чистая ` + p.errs.slice(0, 3).join(' | '));
    await p.close();
  }
  await b.close();
  console.log(fail ? `\n${fail} FAIL` : '\nвсё PASS'); process.exit(fail ? 1 : 0);
})();
