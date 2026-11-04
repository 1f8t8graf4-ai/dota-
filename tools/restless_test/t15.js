// Герой (lg15): все реплики с переводом, слова загораются по времени звука, живой фон (петля у Венатора/Крысы/Виктора, у остальных арт «дышит»).
// node tools/restless_test/t15.js <папка скринов> <тон.mp3>   (сервер: python3 -m http.server 8095 в корне репо)
// Звук реплик с deadlock.wiki из облака закрыт — подменяется тоном <тон.mp3> (2,5 с).
const {chromium} = require('playwright'); const {execFileSync} = require('child_process'); const fs = require('fs');
const O = process.argv[2] || '.', TONE = fs.readFileSync(process.argv[3]);
let fail = 0; const ok = (c, t) => { console.log((c ? 'PASS ' : 'FAIL ') + t); if (!c) fail++; };
const BASE = `http://localhost:${process.env.PORT || 8095}/restless/`;
const ULT = JSON.parse(fs.readFileSync(__dirname + '/../../data/dd-ult.json', 'utf8'));
(async () => {
  const b = await chromium.launch({args: ['--autoplay-policy=no-user-gesture-required']});
  for (const [w, h, n] of [[1440, 900, 'pc'], [390, 844, 'ph']]) {
    const p = await b.newPage({viewport: {width: w, height: h}}); const errs = [];
    p.on('console', x => { if (x.type() === 'error' && !/ERR_FAILED|Failed to load resource/.test(x.text())) errs.push(x.text()); }); p.on('pageerror', e => errs.push('PAGEERR ' + e.message));
    await p.route('https://api.deadlock-api.com/**', async r => { try { const out = execFileSync('curl', ['-sS', '-m', '90', r.request().url()], {maxBuffer: 256 << 20}); r.fulfill({status: 200, contentType: 'application/json', headers: {'access-control-allow-origin': '*'}, body: out}); } catch (e) { r.fulfill({status: 502, body: 'x'}); } });
    await p.route(/deadlock\.wiki/, r => r.fulfill({status: 200, contentType: 'audio/mpeg', body: TONE}));
    await p.route(/assets-bucket|avatars|fonts\.|steamstatic|restless\.1f8t8graf4|workers\.dev/, r => r.abort());
    await p.addInitScript(() => { try { localStorage.removeItem('rl-id'); localStorage.setItem('rl-vo', 'off'); } catch (e) {} });
    // Рэм: все реплики
    await p.goto(BASE + '?dev=vasyan2026#h/79'); await p.waitForSelector('#l15ln', {timeout: 60000}).catch(() => {});
    const want = (ULT.rem || []).length;
    const c = await p.evaluate(() => ({n: document.querySelectorAll('#l15ln .l15-r').length, sum: document.querySelector('#l15ln summary b').textContent, g: [...document.querySelectorAll('#l15ln h4')].map(x => x.textContent),
      ru: [...document.querySelectorAll('#l15ln .l15-ru')].every(x => x.textContent.trim().length > 0)}));
    ok(c.n === want && c.sum.includes(String(want)), `${n}: «Все реплики» — ${c.n} из ${want}, группы: ${c.g.join(' · ')}`);
    ok(c.ru, `${n}: у каждой реплики перевод`);
    await p.click('#l15ln summary'); await p.waitForTimeout(200);
    const row = '#l15ln .l15-r:nth-of-type(1)';
    const words = await p.$$eval('#l15ln .l15-r .l15-en', L => L[0].querySelectorAll('i').length);
    await p.click('#l15ln .l15-pl');
    await p.waitForTimeout(700); const mid = await p.$$eval('#l15ln .l15-r.on .l15-en i', L => L.map(x => x.className));
    await p.waitForTimeout(2600); const end = await p.$$eval('#l15ln .l15-r.on .l15-en i', L => L.map(x => x.className));
    ok(mid.length === words && mid.includes('now') && (words < 3 || mid[mid.length - 1] === ''), `${n}: ▶ — слова загораются по ходу звука (через 0,7 с: ${mid.join(',')})`);
    ok(end.length === 0 || end.every(x => x === 'done' || x === 'now'), `${n}: к концу звука — вся фраза (${end.join(',') || 'строка уже закрылась'})`);
    await p.screenshot({path: `${O}/t15-lines-${n}.png`});
    // тайминг: по слогам и паузам, монотонно, внутри длины звука
    const S = await p.evaluate(() => sayTimes({a: 'x'}, 'Well, I never. Sleep tight little ones'.split(' '), {duration: 3}));
    const mono = S.every((v, i) => !i || v > S[i - 1]), gap = (S[1] - S[0]) / (S[2] - S[1]);
    ok(mono && S[0] > 0 && S[S.length - 1] < 3, `тайминг: слова по порядку, внутри звука (${S.map(v => v.toFixed(2)).join(' ')})`);
    ok(gap > 1 && (S[3] - S[2]) > (S[5] - S[4]), `тайминг: после запятой и точки — пауза (${gap.toFixed(2)})`);
    // главный «говорит»: ▶ на портрете — слова по одному
    await p.evaluate(() => scrollTo(0, 0)); await p.waitForSelector('#hsay .q-sy-pl', {timeout: 20000});
    await p.click('#hsay .q-sy-pl'); await p.waitForTimeout(500);
    const w1 = await p.evaluate(() => { const b = document.querySelector('#hsay .q-sy-cap .w1'); return b ? b.textContent : ''; });
    await p.waitForTimeout(2800);
    const all = await p.evaluate(() => !!document.querySelector('#hsay .q-sy-cap .all'));
    ok(!!w1 && all, `${n}: портрет говорит — слово «${w1}», потом вся фраза`);
    // живой фон: Рэм — арт с наездом; Виктор — петля из R2
    const kb = await p.evaluate(() => getComputedStyle(document.querySelector('.q-art img')).animationName);
    ok(kb === 'l15kb', `${n}: у Рэм арт «дышит» (${kb})`);
    await p.goto(BASE + '?dev=vasyan2026#h/66'); await p.waitForSelector('.q-art', {timeout: 30000});
    const vs = await p.evaluate(() => (document.querySelector('.q-art video') || {}).src || '');
    ok(/scenes\/games\/deadlock\/victor\.mp4$/.test(vs), `${n}: Виктор — живая петля (${vs.split('/').pop()})`);
    ok(await p.evaluate(() => document.documentElement.scrollWidth) <= w, `${n}: не едет вбок`);
    ok(!errs.length, `${n}: консоль чистая ` + errs.slice(0, 3).join(' | '));
    await p.close();
  }
  await b.close(); console.log(fail ? `\n${fail} FAIL` : '\nвсё PASS'); process.exit(fail ? 1 : 0);
})();
