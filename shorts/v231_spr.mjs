// v23.1 (22.11): предметы глав 3–5 картинками для прологов v231/v232 — из их же кода (ep/v220 + набор глав 3–4) → ep/v231/spr/<имя>.png
// node v231_spr.mjs   (кадр обрезается по непрозрачным пикселям, поле 8 px)
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path'; import url from 'url';
const require = createRequire(import.meta.url); const { chromium } = require('playwright');
const here = path.dirname(url.fileURLToPath(import.meta.url));
const B = ['ep/v220/00-core.js', 'ep/v200/05-kit.js', 'ep/v200/12-cam.js', 'ep/v200/15-props.js', 'ep/v220/10-text.js', 'ep/v220/15-tools.js', 'ep/v220/20-ocean.js', 'ep/v220/60-fda.js', 'ep/v231/spr-end.js'];
fs.writeFileSync(path.join(here, 'ep/v231spr.js'), B.map(f => fs.readFileSync(path.join(here, f), 'utf8')).join('\n'));
const br = await chromium.launch(); const p = await br.newPage({ viewport: { width: 1080, height: 1920 } }); const errs = [];
p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()) });
await p.goto(url.pathToFileURL(path.join(here, 'stage.html')).href);
await p.addScriptTag({ path: path.join(here, 'vendor/flubber-0.4.2.min.js') }); await p.addScriptTag({ path: path.join(here, 'ep/v231spr.js') });
await p.evaluate(() => Promise.all(['700 20px P', '800 20px M', '600 20px M', 'italic 700 20px P'].map(f => document.fonts.load(f, 'MarlboroIQOS'))));
const names = await p.evaluate(() => window.SPR ? SPR.list : null); if (!names) { console.log('нет SPR', errs); process.exit(1) }
const OUTD = process.env.SPR_OUT || 'ep/v231/spr';   // 24.11: SPR_OUT=ep/v231/spr-ru — надписи на предметах по-русски (пролог RU)
fs.mkdirSync(path.join(here, OUTD), { recursive: true });
for (const n of names) {
  const d = await p.evaluate(n => { const u = SPR.draw(n), im = new Image(); return new Promise(r => { im.onload = () => { const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
    const a = g.getImageData(0, 0, c.width, c.height).data; let x0 = c.width, y0 = c.height, x1 = 0, y1 = 0; for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) if (a[(y * c.width + x) * 4 + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y }
    const m = 8, o = document.createElement('canvas'); o.width = x1 - x0 + 1 + 2 * m; o.height = y1 - y0 + 1 + 2 * m; o.getContext('2d').drawImage(c, x0 - m, y0 - m, o.width, o.height, 0, 0, o.width, o.height); r(o.toDataURL('image/png')) }; im.src = u }) }, n);
  fs.writeFileSync(path.join(here, `${OUTD}/${n}.png`), Buffer.from(d.split(',')[1], 'base64')); console.log(n, 'ok');
}
if (errs.length) console.log('ОШИБКИ:', errs.slice(0, 5)); await br.close();
