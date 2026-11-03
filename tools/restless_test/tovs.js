// Вкладка «Оверлей» (#ovs) и окно программы 0.3 (?app=1): полоса окна, LIVE, клавиша и «само» → программе, Esc прячет, матч с вкладками.
// node tools/restless_test/tovs.js <папка скринов>   (сервер: python3 -m http.server 8095 в корне репо)
const {chromium} = require('playwright'); const {execFileSync} = require('child_process');
const O = process.argv[2] || '.';
let fail = 0; const ok = (c, t) => { console.log((c ? 'PASS ' : 'FAIL ') + t); if (!c) fail++; };
const BASE = `http://localhost:${process.env.PORT || 8095}/restless/`;
const OPTS = [['Control+X', 'Ctrl+X'], ['Control+Shift+X', 'Ctrl+Shift+X'], ['Control+Alt+X', 'Ctrl+Alt+X'], ['Alt+X', 'Alt+X'], ['Control+Alt+H', 'Ctrl+Alt+H']];
const ST = o => Object.assign({ver: '0.3', mod: {status: 'ok', file: 'pak42_dir.vpk'}, keys: ['Ctrl+X', 'Ctrl+Alt+T'], bridge: '', proc: true, live: false, auto: true, through: false,
  hk: {show: 'Ctrl+Alt+H', game: 'Ctrl+X', gameErr: '', cur: 'Control+X', opts: OPTS}}, o || {});
async function page(b, w, h, app) {
  const p = await b.newPage({viewport: {width: w, height: h}}); const errs = [];
  p.on('console', x => { if (x.type() === 'error' && !/ERR_FAILED|Failed to load resource/.test(x.text())) errs.push(x.text()); }); p.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  await p.route('https://api.deadlock-api.com/**', async r => { try { const out = execFileSync('curl', ['-sS', '-m', '90', r.request().url()], {maxBuffer: 256 << 20}); r.fulfill({status: 200, contentType: 'application/json', headers: {'access-control-allow-origin': '*'}, body: out}); } catch (e) { r.fulfill({status: 502, body: 'x'}); } });
  await p.route(/assets-bucket|avatars|fonts\.|steamstatic/, r => r.abort());
  await p.addInitScript(app => { try { localStorage.setItem('rl-id', '930626915'); } catch (e) {}
    if (app) window.rlHost = {hide: () => { window.__hid = (window.__hid || 0) + 1; }, setKey: k => { window.__k = k; }, setAuto: v => { window.__au = v; }, setThrough: () => {}, reinstall: () => {}}; }, app);
  p.errs = errs; return p;
}
(async () => {
  const b = await chromium.launch();
  // --- обычный браузер
  for (const [w, h, n] of [[1440, 900, 'pc'], [390, 844, 'ph']]) {
    const p = await page(b, w, h, false);
    await p.goto(BASE + '?dev=vasyan2026#ovs'); await p.waitForSelector('.ovs', {timeout: 30000}); await p.waitForTimeout(800);
    const r = await p.evaluate(() => ({tab: !!document.querySelector('#tabs a.q-ovt.on'), dl: !!document.querySelector('.ovs-dl a[href$="Restless-Overlay.exe"]'), bar: getComputedStyle(document.querySelector('#rlbar') || document.body).display, sw: document.documentElement.scrollWidth, last: [...document.querySelectorAll('#tabs a')].pop().dataset.t}));
    ok(r.tab && r.last === 'ovs', `${n}: вкладка «Оверлей» последней и выбрана`);
    ok(r.dl, `${n}: в браузере — «Скачать .exe» программы`);
    ok(r.bar !== 'flex', `${n}: полосы окна программы в браузере нет`);
    ok(r.sw <= w, `${n}: страница не едет вбок (${r.sw})`);
    const tb = await p.evaluate(() => { const a = document.querySelector('#tabs a.q-ovt'), c = getComputedStyle(a); return {bc: c.borderTopColor, r: c.borderRadius}; });
    ok(tb.r !== '0px' && tb.bc !== 'rgba(0, 0, 0, 0)', `${n}: вкладка выделяется — рамка-пилюля (${tb.bc})`);
    await p.screenshot({path: `${O}/ovs-${n}.png`});
    await p.click('#tabs a[data-t="home"]'); await p.waitForTimeout(400);
    ok(!(await p.$('.ovs')) && !(await p.$('#tabs a.q-ovt.on')), `${n}: ушёл в профиль — вкладка «Оверлей» не выбрана`);
    ok(!p.errs.length, `${n}: консоль чистая ` + p.errs.slice(0, 3).join(' | '));
    await p.close();
  }
  // --- окно программы
  const p = await page(b, 1180, 820, true);
  await p.goto(BASE + '?app=1&dev=vasyan2026#ovs'); await p.waitForSelector('.ovs', {timeout: 30000}); await p.waitForTimeout(800);
  ok(await p.evaluate(() => getComputedStyle(document.querySelector('#rlbar')).display === 'flex'), 'программа: полоса окна сверху (тянуть, назад, ✕)');
  await p.evaluate(s => window.rlApp(s), ST());
  let t = await p.$eval('#ovsst', e => e.innerText);
  ok(/запущена · жду матч/.test(t) && /на месте/.test(t) && /Ctrl\+X/.test(t) && /0\.3/.test(t), 'статус: игра, мод, клавиша, версия — ' + t.replace(/\n/g, ' | '));
  ok(await p.$eval('#rlkey', e => e.textContent) === 'Ctrl+X — скрыть', 'в полосе: «Ctrl+X — скрыть»');
  ok(await p.$$eval('#ovsk button', L => L.length === 5 && L[0].classList.contains('on')), '5 клавиш на выбор, выбрана Ctrl+X');
  await p.click('#ovsk [data-k="Control+Shift+X"]');
  ok(await p.evaluate(() => window.__k) === 'Control+Shift+X', 'выбрал Ctrl+Shift+X → ушло в программу');
  await p.click('#ovsau'); ok(await p.evaluate(() => window.__au) === false, '«Открывать само» → программе');
  await p.evaluate(s => window.rlApp(s), ST({hk: {show: 'Ctrl+Alt+H', game: '', gameErr: 'занята другой программой', cur: 'Control+Alt+X', opts: OPTS}}));
  ok(/занята — выбери другую/.test(await p.$eval('#ovsst', e => e.innerText)), 'клавиша занята — так и пишет');
  // LIVE
  await p.evaluate(s => window.rlApp(s), ST({live: true}));
  await p.evaluate(() => window.rlGame({v: '0.14', s: 'm', gt: '02:00', players: Array.from({length: 12}, (_, i) => ({t: i < 6 ? 'f' : 'e', n: 'P' + i, h: '', hid: 0, a: 0})), at: Date.now()}));
  await p.waitForTimeout(300);
  const lv = await p.evaluate(() => ({tab: document.querySelector('#tabs a.q-ovt').classList.contains('live'), lb: getComputedStyle(document.querySelector('#tabs .q-ovl')).display, bar: document.querySelector('#rlbar').classList.contains('live'), go: !!document.querySelector('.ovs-go'), row: document.querySelector('.ovs-r.live') && document.querySelector('.ovs-r.live').innerText}));
  ok(lv.tab && lv.lb !== 'none' && lv.bar, 'LIVE: на вкладке «Оверлей» и в полосе окна');
  ok(lv.go && /LIVE/.test(lv.row || ''), 'LIVE: «Открыть матч — все 12 игроков» — ' + lv.row);
  await p.screenshot({path: `${O}/ovs-app-live.png`});
  // Esc: есть своё окно (подсказка) — не прячем; нет — прячем
  await p.evaluate(() => { const d = document.createElement('div'); d.className = 'hrk-ov'; d.id = 'tmpov'; document.body.appendChild(d); });
  await p.keyboard.press('Escape'); ok(!(await p.evaluate(() => window.__hid)), 'Esc при открытом окошке сайта — окно программы не прячется');
  await p.evaluate(() => document.getElementById('tmpov').remove());
  await p.keyboard.press('Escape'); ok(await p.evaluate(() => window.__hid) === 1, 'Esc — окно программы спрятано');
  await p.click('#rlx'); ok(await p.evaluate(() => window.__hid) === 2, '✕ в полосе — спрятано');
  // матч (#ov) в программе — шапка и вкладки на месте
  await p.click('.ovs-go'); await p.waitForSelector('#ov', {timeout: 30000}); await p.waitForTimeout(600);
  ok(await p.evaluate(() => getComputedStyle(document.querySelector('#tabs')).display === 'flex' && getComputedStyle(document.querySelector('.q-nav')).display !== 'none'), 'матч в программе: шапка и вкладки остаются — можно уйти в профиль');
  await p.screenshot({path: `${O}/ovs-app-match.png`});
  await p.click('#tabs a[data-t="home"]'); await p.waitForTimeout(1500);
  ok(!(await p.$('#ov')) && await p.evaluate(() => !document.body.classList.contains('ovm')), 'из матча — в профиль');
  await p.click('#rlbk'); await p.waitForTimeout(800);
  ok(/^#ov/.test(await p.evaluate(() => location.hash)), '‹ в полосе — назад к матчу');
  ok(!p.errs.length, 'программа: консоль чистая ' + p.errs.slice(0, 3).join(' | '));
  await b.close();
  console.log(fail ? `\n${fail} FAIL` : '\nвсё PASS'); process.exit(fail ? 1 : 0);
})();
