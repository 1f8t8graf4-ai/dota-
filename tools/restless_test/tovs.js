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
    ok(r.blocks <= 4, `${n}: страница короткая — заголовок, статус, пресеты, строка «макет» (${r.blocks})`);
    // пресеты: Лайт · Медиум · Энчантед · Свой — на скриншоте видно, что меняется
    const on = () => p.$$eval('#ovpst .ovp-m.on', L => L.map(x => x.dataset.m));
    const tb = await p.$$eval('#ovptabs button', L => L.map(x => x.querySelector('b').textContent + (x.getAttribute('aria-selected') === 'true' ? '*' : '')));
    ok(tb.join(',') === 'Lite,Medium*,Enchanted,Custom', `${n}: 4 пресета, по умолчанию Medium (${tb})`);
    ok((await on()).length === 6, `${n}: «Медиум» — 6 значков на экране игры`);
    await p.click('#ovptabs [data-p="lite"]'); await p.waitForTimeout(450);
    const L1 = await on(); ok(L1.join() === 'ult,tmr', `${n}: Lite — только КД ультов и таймеры (${L1})`);
    const hid = await p.$eval('#ovpst .ovp-m[data-m="rnk"]', e => +getComputedStyle(e).opacity); ok(hid < .05, `${n}: выключенный значок спрятан (${hid})`);
    await p.click('#ovptabs [data-p="ench"]'); await p.waitForTimeout(450); ok((await on()).length === 10, `${n}: Enchanted — все 10`);
    const inside = await p.evaluate(() => { const s = document.querySelector('#ovpst').getBoundingClientRect(); return [...document.querySelectorAll('#ovpst .ovp-m.on')].every(m => { const r = m.getBoundingClientRect(); return r.left >= s.left - 1 && r.right <= s.right + 1 && r.top >= s.top - 1 && r.bottom <= s.bottom + 1; }); });
    ok(inside, `${n}: значки не вылезают за скриншот`);
    await p.screenshot({path: `${O}/ovs-ench-${n}.png`});
    await p.click('#ovpcp'); await p.waitForTimeout(450);
    ok(await p.$eval('#ovpst', e => e.classList.contains('edit')) && (await on()).length === 10, `${n}: «Сделать свой на основе» → Custom, те же 10, можно двигать`);
    await p.click('#ovpside [data-t="adv"]'); await p.waitForTimeout(350);
    ok(!(await on()).includes('adv'), `${n}: Custom: снял галочку — значок пропал`);
    await p.$eval('#ovpst', e => e.scrollIntoView({block: 'center'})); await p.waitForTimeout(200);
    const m = await p.$('#ovpst .ovp-m[data-m="ult"]'), bb = await m.boundingBox(), sb = await (await p.$('#ovpst')).boundingBox();
    await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.mouse.down(); await p.mouse.move(sb.x + sb.width * .2, sb.y + sb.height * .3, {steps: 6}); await p.mouse.up();
    const sv = await p.evaluate(() => JSON.parse(localStorage.getItem('rl-ovp')));
    ok(sv.p === 'my' && sv.my.pos.ult && Math.abs(sv.my.pos.ult[0] - 20) < 3 && Math.abs(sv.my.pos.ult[1] - 30) < 3 && !sv.my.on.includes('adv'), `${n}: перетащил «КД ультов» — место запомнилось (${sv.my.pos.ult})`);
    await p.reload(); await p.waitForSelector('#ovpst .ovp-m', {timeout: 30000}); await p.waitForTimeout(500);
    const left = await p.$eval('#ovpst .ovp-m[data-m="ult"]', e => e.style.left);
    ok(left === sv.my.pos.ult[0] + '%' && (await p.$eval('#ovptabs [data-p="my"]', e => e.getAttribute('aria-selected'))) === 'true', `${n}: после перезагрузки — Custom, значок на своём месте (${left})`);
    await p.screenshot({path: `${O}/ovs-my-${n}.png`});
    // поделиться кодом → вставить у «друга»
    const code = await p.evaluate(() => 'RL1-' + btoa(unescape(encodeURIComponent(JSON.stringify(JSON.parse(localStorage.getItem('rl-ovp')).my)))));
    await p.evaluate(() => localStorage.removeItem('rl-ovp')); await p.reload(); await p.waitForSelector('#ovpst .ovp-m', {timeout: 30000});
    await p.click('#ovptabs [data-p="my"]'); await p.waitForTimeout(300);
    p.once('dialog', d => d.accept(code)); await p.click('#ovpim'); await p.waitForTimeout(450);
    const L2 = await on(), left2 = await p.$eval('#ovpst .ovp-m[data-m="ult"]', e => e.style.left);
    ok(L2.length === 9 && !L2.includes('adv') && left2 === left && /вставлен/.test(await p.$eval('#ovpmsg', e => e.textContent)), `${n}: код вставил — тот же пресет у друга (${L2.length} значков, ult ${left2})`);
    p.once('dialog', d => d.accept('мусор')); await p.click('#ovpim'); await p.waitForTimeout(200);
    ok(/не подошёл/.test(await p.$eval('#ovpmsg', e => e.textContent)), `${n}: кривой код — «Код не подошёл»`);
    await p.evaluate(() => localStorage.removeItem('rl-ovp'));
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
    const a = document.createElement('button'); a.id = 'anc'; a.style.cssText = 'position:fixed;top:70px;left:40px'; document.body.appendChild(a); scrollTo(0, 0); qPop(a, perHTML(P, '12')); return document.querySelector('.q-pop').innerHTML; }, m0);
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
  await p.waitForFunction(() => { const c = document.getElementById('hrt'); return !c || c.textContent.trim(); }, null, {timeout: 120000}).catch(() => {});
  const hr = await p.evaluate(() => (document.getElementById('hrt') || {}).textContent || 'убрано');
  ok(/^((#|топ )[\d\s ,%]+ \S.*|вне рейтинга|нет ранга|ещё \d+ игр\S*|не играл 30 дн\.)$/.test(hr) && await p.$eval('#hrt', e => /Рейтинг героя/.test(e.title)), 'рейтинг героя на карточке: ' + hr + ' — ' + await p.$eval('#hrt', e => e.title));
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
