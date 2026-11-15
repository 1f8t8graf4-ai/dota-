// отдельные кадры теста в PNG: node frames.mjs <t1,t2,…> <папка>
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url); const { chromium } = require('/opt/node-tools/node_modules/playwright');
const here = path.dirname(fileURLToPath(import.meta.url)); const [ts, dir] = process.argv.slice(2); fs.mkdirSync(dir, { recursive: true });
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
const errs = []; p.on('pageerror', e => errs.push(String(e)));
await p.goto('file://' + path.join(here, 'scene.html')); await p.evaluate(() => window.ready);
for (const t of ts.split(',').map(Number)) {
  const url = await p.evaluate(t => { window.render(t); return document.getElementById('cv').toDataURL('image/png') }, t);
  fs.writeFileSync(path.join(dir, 'f' + t.toFixed(2) + '.png'), Buffer.from(url.split(',')[1], 'base64'));
}
console.log('ok', errs.join(' | ')); await b.close();
