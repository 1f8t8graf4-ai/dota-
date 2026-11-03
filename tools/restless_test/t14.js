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
    const L = await p.$$eval('#l14lb .l14-r', R => R.map(r => ({h: r.getAttribute('href'), b: r.querySelector('b').textContent, rk: !!r.querySelector('.l14-rk img'), n: r.querySelector('.l14-n').textContent,
      pt: +(r.querySelector('.l16-pt') || {textContent: '0'}).textContent.replace(/\D/g, ''), wr: (r.querySelector('.l16-st b') || {}).textContent || ''})));
    ok(L.length === Math.min(10, TOP.length) && /^#h\/\d+\/p\d+$/.test(L[0].h), `${n}: топ мира на странице героя — ${L.length} строк, №1 ведёт на его страницу (${L[0] && L[0].h})`);
    ok(L.every((x, i) => !i || x.pt <= L[i - 1].pt) && L[0].pt > 0 && L.every(x => /%$/.test(x.wr)), `${n}: как League of Graphs — по очкам рейтинга, у каждого винрейт и KDA (${L.slice(0, 3).map(x => x.pt + ' ' + x.wr).join(' · ')})`);
    ok(await p.$('#l14lb').then(e => e.evaluate(x => !!x.closest('section').querySelector('.l16-how'))), `${n}: «Как считаем — как League of Graphs»`);
    ok(L.every(x => x.rk) && L[0].n === '🥇', `${n}: у каждого эмблема ранга, у первых трёх медали`);
    const vis = async () => p.$$eval('#l14lb .l14-r', R => R.filter(r => r.offsetParent).length);
    const v0 = await vis(); const top = await p.$eval('#l14lb', e => e.closest('section').previousElementSibling && e.closest('section').previousElementSibling.id);
    ok(v0 <= 6 && top === 'hst', `${n}: топ стоит сразу под цифрами героя, видно ${v0}`);
    if (L.length > 5) { await p.click('#l14more'); ok(await vis() === L.length, `${n}: «Ещё 5» — весь топ-10`); }
    await p.waitForFunction(() => { const m = document.querySelector('#l14me'); return !m || !/считаю/.test(m.textContent); }, null, {timeout: 150000}).catch(() => {});
    const me = await p.evaluate(() => (document.querySelector('#l14me') || {}).textContent || '');
    ok(/^Ты · (вне рейтинга|#|топ )/.test(me) && /(ещё \d+ игр|нет ранга|не играл|топ [\d,]+ % в рейтинге|в рейтинге героя|лучший в мире)/.test(me), `${n}: строка «Ты» под топом — место или что сделать: ${me}`);
    // эмблема: наведение — название ранга и доля игроков
    const im = await p.$('#l14lb .l14-r .l14-rk img'); await im.scrollIntoViewIfNeeded(); await im.hover();
    await p.waitForFunction(() => /(выше, чем у|топ) [\d,]+ % игроков/.test(document.querySelector('#l14lb .l14-r .l14-rk img').title), null, {timeout: 60000}).catch(() => {});
    const tt = await p.$eval('#l14lb .l14-r .l14-rk img', e => e.title); ok(/^\S.* (· [\d\s ]+ очков ранга )?· (выше, чем у|топ) [\d,]+ % игроков · на этом ранге [\d,]+ %$/.test(tt), `${n}: эмблема при наведении — «${tt}»`);
    ok(/[\d\s ]+ очков ранга/.test(tt), `${n}: у игрока из топа — очки ранга Valve в подсказке`);
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
  // показ места: номер у всех, рядом «топ X % в рейтинге героя», цели «до топ-100» нет; «что сделать»
  { const p = await page(b, 1440, 900, 930626915); await p.goto(BASE + '?dev=vasyan2026#heroes'); await p.waitForTimeout(1500);
    const u = await p.evaluate(() => ({a: hrBig({pos: 37, lg: 1}), b: hrBig({pos: 640, lg: 1}), c: hrBig({pos: 1500, ap: 1, tot: 9533}), d: hrBig({pos: 300, ap: 1, tot: 9533}), e: hrBig({pos: 40, lg: 1, tot: 9533}),
      n1: hrNext({pos: 640, lg: 1, tot: 9533}), n2: hrNext({pos: 40, ap: 1, tot: 9533}), n3: hrNext({pos: 1, lg: 1}), w1: hrWhy({m: 16}), w2: hrWhy({why: 'rank'}), w3: hrWhy({why: 'idle'}), s1: hrShort({m: 16})}));
    ok(u.a.t === '#37' && u.a.top && u.b.t === '#640' && u.b.hi && !u.b.top, `номер в топ-1000: ${u.a.t}, ${u.b.t}`);
    ok(u.c.t.replace(/\s/g, ' ') === '#1 500' && !u.c.hi && u.d.t === '#300', `и дальше — номер: ${u.c.t}; место не по очкам — тоже номер: ${u.d.t}`);
    ok(u.n1 === 'топ 7 % в рейтинге героя' && u.n2 === 'топ 0,4 % в рейтинге героя' && u.n3 === 'лучший в мире', `вместо цели — доля: «${u.n1}», «${u.n2}», «${u.n3}»`);
    ok(/^ещё 4 игры/.test(u.w1) && /сыграй ранговые/.test(u.w2) && /сыграй, и место вернётся/.test(u.w3) && u.s1 === 'ещё 4 игры', `что сделать: «${u.w1}» · «${u.w2}» · «${u.w3}» · коротко «${u.s1}»`);
    // настоящие игроки Rat King: из топ-500 по рангу — номер, из 1200-х — номер или процент, дальше — процент
    const API = id => p.evaluate(async id => { const o = await hrkGet(84, id, ''); const b = hrBig(o.w, o.tot); return {t: b && b.t, ex: b && b.ex, nx: hrNext(o.w), lg: !!(o.w && o.w.lg)}; }, id);
    const r1 = await API(1543350624), r2 = await API(1048576787);
    ok(r1.lg && /^#\d/.test(r1.t), `топ-500 по рангу на Rat King — точное место по очкам: ${r1.t} · ${r1.nx}`);
    ok(/^#\d/.test(r2.t) && /% в рейтинге героя/.test(r2.nx), `1200-й по рангу — тоже номер: ${r2.t} · ${r2.nx}`);
    ok(!p.errs.length, 'показ места: консоль чистая ' + p.errs.slice(0, 3).join(' | '));
    await p.close(); }
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
