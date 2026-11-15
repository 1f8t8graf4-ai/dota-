// полный рендер теста: node render.mjs <папка кадров> [fps=30] [dur=10.5]
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url); const { chromium } = require('/opt/node-tools/node_modules/playwright');
const here = path.dirname(fileURLToPath(import.meta.url)); const [dir, fpsA, durA] = process.argv.slice(2); const fps = Number(fpsA || 30), dur = Number(durA || 10.5);
fs.mkdirSync(dir, { recursive: true });
const N = Math.round(dur * fps), W = 3, per = Math.ceil(N / W); const b = await chromium.launch();
const errs = [];
await Promise.all([...Array(W).keys()].map(async w => {
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.join(here, 'scene.html')); await p.evaluate(() => window.ready);
  for (let n = w * per; n < Math.min(N, (w + 1) * per); n++) {
    const url = await p.evaluate(t => { window.render(t); return document.getElementById('cv').toDataURL('image/jpeg', .95) }, n / fps);
    fs.writeFileSync(path.join(dir, String(n).padStart(4, '0') + '.jpg'), Buffer.from(url.split(',')[1], 'base64'));
  }
}));
console.log('frames', N, errs.length ? 'ERR ' + errs.slice(0, 3).join(' | ') : 'ok'); await b.close();
