// лист кадров теста: node sheet.mjs <t1,t2,…> <out.jpg> [колонок=5] [ширина=300]
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url); const { chromium } = require('/opt/node-tools/node_modules/playwright');
const here = path.dirname(fileURLToPath(import.meta.url)); const [ts, out, colsA, wA] = process.argv.slice(2);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()) });
await p.goto('file://' + path.join(here, 'scene.html')); await p.evaluate(() => window.ready);
const T = ts.split(',').map(Number), cols = Number(colsA || 5), w = Number(wA || 300), h = Math.round(w * 1920 / 1080);
const url = await p.evaluate(([T, cols, w, h]) => {
  const rows = Math.ceil(T.length / cols), S = document.createElement('canvas'); S.width = cols * w; S.height = rows * h; const g = S.getContext('2d'); g.fillStyle = '#222'; g.fillRect(0, 0, S.width, S.height);
  T.forEach((t, i) => { window.render(t); const cv = document.getElementById('cv'); const x = (i % cols) * w, y = Math.floor(i / cols) * h; g.drawImage(cv, x, y, w, h);
    g.font = '700 20px sans-serif'; g.fillStyle = '#000'; g.fillRect(x, y, 70, 26); g.fillStyle = '#ff0'; g.fillText(t.toFixed(2), x + 5, y + 20) });
  return S.toDataURL('image/jpeg', .88);
}, [T, cols, w, h]);
fs.writeFileSync(out, Buffer.from(url.split(',')[1], 'base64')); console.log('ok', out, errs.length ? 'ERR ' + errs.slice(0, 5).join(' | ') : '');
await b.close();
