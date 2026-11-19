// v20.3 (19.11): проверка камеры доски главы 3 — закрытые 2014 и 2022 не попадают в кадр на 1:12–1:22; плюс кадры PNG.
//   node ref/v203_chk.mjs v200y-ru 72.0 82.25          → «нарушений: 0»
//   node ref/v203_chk.mjs v200s-ru 0 0 93.5,94.6,0 <папка> → кадры (стык пачки и петля шортса)
// проверка камеры доски (закрытые карточки не в кадре) и петли шортса: node chk.mjs <ep> <t0> <t1> [frames t1,t2,...]
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path';
const require = createRequire(import.meta.url);
const { chromium } = require(require.resolve('playwright', { paths: ['/opt/node-tools/node_modules'] }));
const here = '/home/user/dota-/shorts';
const [ep, t0, t1, ts, outd] = process.argv.slice(2);
const TL = JSON.parse(fs.readFileSync(path.join(here, 'out', ep, 'timeline.json'), 'utf8'));
const b = await chromium.launch({ args: ['--allow-file-access-from-files'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()) });
await p.goto('file://' + path.join(here, 'stage.html'));
await p.evaluate(ep => window.loadEp(ep), ep.replace(/-(en|ru)$/, ''));
await p.evaluate(async () => { for (const f of ['600 10px M', '800 10px M', '500 10px O', '700 10px O', '700 10px U', '800 10px U']) await document.fonts.load(f, 'aя'); await document.fonts.ready });
await p.evaluate(tl => window.init(tl), TL);
if (ep.startsWith('v200y')) {
  const res = await p.evaluate(([a, b]) => {
    const D = window.__dbg, m = 3, Z = [[95, 365, 625, 955, '2014'], [103, 373, 637, 967, '2014т'], [220, 242, 619, 643, '2014б'], [715, 985, 625, 955, '2022'], [723, 993, 637, 967, '2022т'], [840, 862, 619, 643, '2022б']].map(([a, b, c, d, n]) => [a - m, b + m, c - m, d + m, n]), bad = [];
    for (let t = a; t <= b; t += 1 / 60) { const v = D.camAt(D.K12, t), z = Math.exp(v[2]), x0 = v[0] - 540 / z, x1 = v[0] + 540 / z, y0 = v[1] - 960 / z, y1 = v[1] + 960 / z;
      for (const [zx0, zx1, zy0, zy1, n] of Z) { const ox = Math.min(x1, zx1) - Math.max(x0, zx0), oy = Math.min(y1, zy1) - Math.max(y0, zy0); if (ox > 0 && oy > 0) bad.push([+t.toFixed(3), n, +ox.toFixed(1), +oy.toFixed(1), v.map(q => +q.toFixed(2))]) } }
    return bad }, [Number(t0), Number(t1)]);
  console.log('нарушений:', res.length); res.slice(0, 40).forEach(r => console.log(JSON.stringify(r)));
}
if (ts) { fs.mkdirSync(outd, { recursive: true });
  for (const t of ts.split(',')) {
    const url = await p.evaluate(t => { window.render(t); const cs = [...document.querySelectorAll('canvas')].filter(c => c.isConnected && c.style.display !== 'none'); return cs[cs.length - 1].toDataURL('image/png') }, Number(t));
    fs.writeFileSync(path.join(outd, `${ep}_${t}.png`), Buffer.from(url.split(',')[1], 'base64')) } }
console.log('ошибки:', errs.length ? errs.slice(0, 5) : 'нет');
await b.close();
