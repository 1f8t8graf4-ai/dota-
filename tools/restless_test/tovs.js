// Вкладка «Оверлей» (#ovs) и окно программы 0.3.1 (?app=1): «Лайв-матч» горит только в матче, «Оверлей» тихий, одна клавиша,
// полоса окна, Esc / ✕, матч с вкладками; «12 ч» — сами игры с оценкой и ссылкой; место на герое на карточке; курсор.
// node tools/restless_test/tovs.js <папка скринов>   (сервер: python3 -m http.server 8095 в корне репо)
const {chromium} = require('playwright'); const {execFileSync} = require('child_process');
const O = process.argv[2] || '.';
let fail = 0; const ok = (c, t) => { console.log((c ? 'PASS ' : 'FAIL ') + t); if (!c) fail++; };
const BASE = `http://localhost:${process.env.PORT || 8095}/restless/`;
const ST = o => Object.assign({ver: '0.3.1', mod: {status: 'ok', file: 'pak42_dir.vpk'}, keys: ['Ctrl+Alt+H', 'Ctrl+Alt+T'], bridge: '', proc: true, live: false, auto: true, through: false,
  hk: {show: 'Ctrl+Alt+H', cur: 'Control+Alt+H', opts: []}}, o || {});
async function page(b, w, h, app) {
  const p = await b.newPage({viewport: {width: w, height: h}}); const errs = [];
  p.on('console', x => { if (x.type() === 'error' && !/ERR_FAILED|Failed to load resource/.test(x.text())) errs.push(x.text()); }); p.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  await p.route('https://api.deadlock-api.com/**', async r => { try { const out = execFileSync('curl', ['-sS', '-m', '90', r.request().url()], {maxBuffer: 256 << 20}); r.fulfill({status: 200, contentType: 'application/json', headers: {'access-control-allow-origin': '*'}, body: out}); } catch (e) { r.fulfill({status: 502, body: 'x'}); } });
  await p.route(/assets-bucket|avatars|fonts\.|steamstatic|restless\.1f8t8graf4/, r => r.abort());
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
    const r = await p.evaluate(() => { const a = document.querySelector('#tabs a.q-ovt'), c = getComputedStyle(a);
      return {on: a.classList.contains('on'), last: [...document.querySelectorAll('#tabs a')].pop().dataset.t, pill: c.borderTopWidth !== '0px' && c.borderTopStyle !== 'none',
        live: document.querySelector('#tabs a[data-t="live"]').classList.contains('live'), dl: !!document.querySelector('.ovs-dlb[href$="Restless-Overlay.exe"]'),
        sw: document.documentElement.scrollWidth, blocks: document.querySelectorAll('.ovs > *').length}; });
    ok(r.on && r.last === 'ovs', `${n}: вкладка «Оверлей» последней и выбрана`);
    ok(!r.pill, `${n}: «Оверлей» — тихая вкладка, без рамки-пилюли`);
    ok(!r.live, `${n}: матча нет — «Лайв-матч» не горит`);
    ok(r.dl, `${n}: в браузере — «Скачать для Windows»`);
    ok(r.blocks <= 3, `${n}: страница короткая — заголовок, одна карточка, строка «скоро» (${r.blocks})`);
    ok(r.sw <= w, `${n}: страница не едет вбок (${r.sw})`);
    const cur = await p.evaluate(() => ({tab: getComputedStyle(document.querySelector('#tabs a')).cursor, txt: getComputedStyle(document.querySelector('.ovs-h p')).cursor, inp: getComputedStyle(document.querySelector('#sq')).cursor}));
    ok(cur.tab === 'pointer' && cur.txt === 'default' && cur.inp === 'text', `${n}: курсор — рука на вкладках, стрелка на тексте, «палка» только в поле (${cur.tab}/${cur.txt}/${cur.inp})`);
    await p.screenshot({path: `${O}/ovs-${n}.png`});
    ok(!p.errs.length, `${n}: консоль чистая ` + p.errs.slice(0, 3).join(' | '));
    await p.close();
  }
  // --- окно программы
  const p = await page(b, 1180, 820, true);
  await p.goto(BASE + '?app=1&dev=vasyan2026#ovs'); await p.waitForSelector('.ovs', {timeout: 30000}); await p.waitForTimeout(800);
  ok(await p.evaluate(() => getComputedStyle(document.querySelector('#rlbar')).display === 'flex'), 'программа: полоса окна сверху (тянуть, назад, ✕)');
  await p.evaluate(s => window.rlApp(s), ST());
  let t = await p.$eval('#ovsst', e => e.innerText);
  ok(/запущена · жду матч/.test(t) && /на месте/.test(t) && /Ctrl\+Alt\+H/.test(t) && !/Ctrl\+X/.test(t), 'статус: игра, мод, одна клавиша Ctrl+Alt+H — ' + t.replace(/\n/g, ' | '));
  ok(await p.$eval('#rlkey', e => e.textContent) === 'Ctrl+Alt+H — скрыть', 'в полосе: «Ctrl+Alt+H — скрыть»');
  ok(!(await p.$('#ovsk')), 'выбора клавиш на странице нет (меню трея)');
  await p.click('.ovs-sw'); ok(await p.evaluate(() => window.__au) === false, '«Открывать само» (переключатель) → программе');
  await p.screenshot({path: `${O}/ovs-app.png`});
  // LIVE
  await p.evaluate(s => window.rlApp(s), ST({live: true}));
  await p.evaluate(() => window.rlGame({v: '0.14', s: 'm', gt: '02:00', players: Array.from({length: 12}, (_, i) => ({t: i < 6 ? 'f' : 'e', n: 'P' + i, h: '', hid: 0, a: 0})), at: Date.now()}));
  await p.waitForTimeout(300);
  const lv = await p.evaluate(() => ({tab: document.querySelector('#tabs a[data-t="live"]').classList.contains('live'), lb: getComputedStyle(document.querySelector('#tabs a[data-t="live"] .q-lvb')).display,
    ovt: document.querySelector('#tabs a.q-ovt').classList.contains('live'), bar: document.querySelector('#rlbar').classList.contains('live'), go: !!document.querySelector('.ovs-go')}));
  ok(lv.tab && lv.lb !== 'none' && !lv.ovt, 'матч идёт — горит «Лайв-матч» (LIVE), «Оверлей» нет');
  ok(lv.bar && lv.go, 'LIVE в полосе окна и «Открыть матч» на странице');
  await p.screenshot({path: `${O}/ovs-app-live.png`});
  await p.evaluate(s => window.rlApp(s), ST({live: false})); await p.evaluate(() => { OV.G = null; ovTabLive(); });
  ok(!(await p.evaluate(() => document.querySelector('#tabs a[data-t="live"]').classList.contains('live'))), 'матч кончился — «Лайв-матч» снова обычный');
  // Esc / ✕
  await p.evaluate(() => { const d = document.createElement('div'); d.className = 'hrk-ov'; d.id = 'tmpov'; document.body.appendChild(d); });
  await p.keyboard.press('Escape'); ok(!(await p.evaluate(() => window.__hid)), 'Esc при открытом окошке сайта — окно программы не прячется');
  await p.evaluate(() => document.getElementById('tmpov').remove());
  await p.keyboard.press('Escape'); ok(await p.evaluate(() => window.__hid) === 1, 'Esc — окно программы спрятано');
  await p.click('#rlx'); ok(await p.evaluate(() => window.__hid) === 2, '✕ в полосе — спрятано');
  // «12 ч» — сами игры
  const H = JSON.parse(execFileSync('curl', ['-sS', '-m', '90', 'https://api.deadlock-api.com/v1/players/930626915/match-history'], {maxBuffer: 64 << 20}));
  const m0 = H[0];
  const html = await p.evaluate(m0 => { const t = now(); const P = {id: 930626915, name: 'БилБаб', p12: {m: 2, w: 1, hs: []},
    rc: [{mid: m0.match_id, hid: m0.hero_id, w: false, kda: `${m0.player_kills}/${m0.player_deaths}/${m0.player_assists}`, t: t - 3600, d: m0.match_duration_s}, {mid: 1, hid: 65, w: true, kda: '21/1/14', t: t - 7200, d: 1700}, {mid: 2, hid: 65, w: true, kda: '1/1/1', t: t - 20 * 3600, d: 1700}]};
    const a = document.createElement('button'); a.id = 'anc'; document.body.appendChild(a); qPop(a, perHTML(P, '12')); return document.querySelector('.q-pop').innerHTML; }, m0);
  ok(/21<i>\/<\/i><em>1<\/em><i>\/<\/i>14/.test(html) && /Поражение/.test(html) && /Победа/.test(html), '12 ч: K/D/A, победа / поражение у каждой игры');
  ok((html.match(/class="l13-g /g) || []).length === 2, '12 ч: только игры за 12 часов (третья — 20 ч назад — не попала)');
  ok(html.includes(`href="#m/${m0.match_id}"`), '12 ч: игра — ссылка на разбор матча');
  await p.waitForFunction(id => { const c = document.querySelector(`.q-pop [data-g="${id}"]`); return c && !c.querySelector('.l13-sk'); }, m0.match_id, {timeout: 90000}).catch(() => {});
  const gr = await p.evaluate(id => (document.querySelector(`.q-pop [data-g="${id}"] .grd`) || {}).textContent || '', m0.match_id);
  ok(/^[SABCDE][+−]?$/.test(gr), '12 ч: оценка матча из истории — ' + gr);
  await p.screenshot({path: `${O}/ovs-12h.png`});
  await p.click(`.q-pop a[href="#m/${m0.match_id}"]`); await p.waitForTimeout(500);
  ok((await p.evaluate(() => location.hash)).startsWith('#m/' + m0.match_id) && !(await p.$('.q-pop')), '12 ч: нажал — разбор матча, всплывашка закрылась');
  // место на герое на карточке
  await p.evaluate(h => { const c = document.createElement('small'); c.className = 'l13-hr'; c.dataset.hr = `${h}|930626915`; c.id = 'hrt'; document.querySelector('#v').appendChild(c); }, m0.hero_id);
  await p.waitForFunction(() => { const c = document.getElementById('hrt'); return !c || /в мире/.test(c.textContent); }, null, {timeout: 120000}).catch(() => {});
  const hr = await p.evaluate(() => (document.getElementById('hrt') || {}).textContent || 'убрано');
  ok(/^#[\d\s]+ в мире$/.test(hr.replace(/ /g, ' ')), 'место на герое на карточке: ' + hr);
  // матч (#ov) в программе — шапка и вкладки на месте
  await p.evaluate(() => { location.hash = '#ov'; }); await p.waitForSelector('#ov', {timeout: 30000}); await p.waitForTimeout(600);
  ok(await p.evaluate(() => getComputedStyle(document.querySelector('#tabs')).display === 'flex' && getComputedStyle(document.querySelector('.q-nav')).display !== 'none'), 'матч в программе: шапка и вкладки остаются');
  await p.click('#tabs a[data-t="home"]'); await p.waitForTimeout(1500);
  await p.click('#rlbk'); await p.waitForTimeout(800);
  ok(/^#ov/.test(await p.evaluate(() => location.hash)), '‹ в полосе — назад к матчу');
  ok(!p.errs.length, 'программа: консоль чистая ' + p.errs.slice(0, 3).join(' | '));
  await b.close();
  console.log(fail ? `\n${fail} FAIL` : '\nвсё PASS'); process.exit(fail ? 1 : 0);
})();
