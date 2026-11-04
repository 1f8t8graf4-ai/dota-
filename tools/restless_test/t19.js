// lg19: эмблемы рангов из restless/rk (Зетка) и петли Селесты / Дэнни.  node tools/restless_test/t19.js <папка скринов>  (сервер 8095 в корне)
const {chromium} = require('playwright'); const {execFileSync} = require('child_process');
const O = process.argv[2]; let ok = true; const chk = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); ok = ok && c; };
(async () => { const b = await chromium.launch();
  for (const [n, w, h] of [['pc', 1440, 900], ['ph', 390, 844]]) {
    const p = await b.newPage({viewport: {width: w, height: h}}); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.route('https://api.deadlock-api.com/**', async r => { try { const out = execFileSync('curl', ['-sS', '-m', '90', r.request().url()], {maxBuffer: 256 << 20}); r.fulfill({status: 200, contentType: 'application/json', headers: {'access-control-allow-origin': '*'}, body: out}); } catch (e) { r.fulfill({status: 502, body: 'x'}); } });
    await p.route(/assets-bucket|avatars|fonts\.|steamstatic|restless\.1f8t8graf4|workers\.dev|raw\.githubusercontent/, r => r.abort());
    await p.goto('http://localhost:8095/restless/?dev=vasyan2026#h/81'); await p.waitForSelector('.q-art video', {timeout: 30000});
    const r = await p.evaluate(() => [rankOf(75).img, rankOf(116).img, rankOf(0).img === rankOf(0).img]);
    chk(r[0] === 'rk/7-5.webp' && r[1] === 'rk/11-6.webp', `${n}: ранг → эмблема Зетки (${r})`);
    const im = await p.evaluate(async () => { const d = document.createElement('div'); d.innerHTML = rankImg(75, 'rk') + rankImg(104, 'ri'); document.body.append(d);
      d.querySelectorAll('img').forEach(i => i.loading = 'eager'); await Promise.all([...d.querySelectorAll('img')].map(i => i.decode().catch(() => 0))); return [...d.querySelectorAll('img')].map(i => i.naturalWidth); });
    chk(im.length === 2 && im.every(x => x === 256), `${n}: эмблемы грузятся (${im})`);
    const v = await p.$eval('.q-art video', e => e.getAttribute('src')); chk(v === 'loops/celeste.mp4', `${n}: Селеста — петля (${v})`);
    await p.waitForFunction(() => document.querySelector('.q-art video').readyState >= 2, null, {timeout: 15000}).then(() => chk(true, `${n}: петля играет`), () => chk(false, `${n}: петля не загрузилась`));
    await p.screenshot({path: `${O}/t19-celeste-${n}.png`});
    await p.goto('http://localhost:8095/restless/?dev=vasyan2026#h/78'); await p.waitForSelector('.q-art video', {timeout: 30000});
    chk(await p.$eval('.q-art video', e => e.getAttribute('src')) === 'loops/deadman-danny.mp4', `${n}: Дэнни — петля`);
    await p.goto('http://localhost:8095/restless/?dev=vasyan2026#h/65'); await p.waitForSelector('.q-art video', {timeout: 30000});
    chk(/venator-2\.mp4$/.test(await p.$eval('.q-art video', e => e.getAttribute('src'))), `${n}: Венатор — как был (R2)`);
    chk(!errs.length, `${n}: без ошибок (${errs.slice(0, 2)})`);
    await p.close();
  }
  await b.close(); process.exit(ok ? 0 : 1);
})();
