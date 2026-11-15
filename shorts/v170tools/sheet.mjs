// лист кадров ролика: node sheet.mjs <ep> <t1,t2,…> <out.jpg> [колонок=5] [ширина кадра=360] [флаги через запятую]
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path';
const require = createRequire(import.meta.url);
const { chromium } = require(require.resolve('playwright', { paths: [...(process.env.NODE_PATH || '').split(path.delimiter).filter(Boolean), '/opt/node-tools/node_modules'] }));
const here = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const [ep, ts, out, colsA, wA, fl] = process.argv.slice(2);
const TL = JSON.parse(fs.readFileSync(path.join(here, 'out', ep, 'timeline.json'), 'utf8'));
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()) });
await p.goto('file://' + path.join(here, 'stage.html'));
await p.evaluate(f => { for (const k of (f || '').split(',').filter(Boolean)) window[k] = true }, fl);
await p.evaluate(ep => window.loadEp(ep), ep.replace(/-(en|ru)$/, ''));
await p.evaluate(async () => { for (const f of ['600 10px M', '800 10px M', '500 10px O', '700 10px O', '700 10px U', '800 10px U']) await document.fonts.load(f, 'aя'); await document.fonts.ready });
await p.evaluate(tl => window.init(tl), TL);
const T = ts.split(',').map(Number), cols = Number(colsA || 5), w = Number(wA || 360), h = Math.round(w * 1920 / 1080);
const url = await p.evaluate(([T, cols, w, h]) => {
  const rows = Math.ceil(T.length / cols), S = document.createElement('canvas'); S.width = cols * w; S.height = rows * h;
  const g = S.getContext('2d'); g.fillStyle = '#222'; g.fillRect(0, 0, S.width, S.height);
  T.forEach((t, i) => {
    window.render(t); const cv = document.querySelector('canvas');
    const x = (i % cols) * w, y = Math.floor(i / cols) * h; g.drawImage(cv, x, y, w, h);
    g.font = '700 22px sans-serif'; g.fillStyle = '#000'; g.fillRect(x, y, 86, 30); g.fillStyle = '#ff0'; g.fillText(t.toFixed(2), x + 6, y + 22);
  });
  return S.toDataURL('image/jpeg', .86);
}, [T, cols, w, h]);
fs.writeFileSync(out, Buffer.from(url.split(',')[1], 'base64')); console.log('ok', out, errs.length ? 'ERR ' + errs.slice(0, 5).join(' | ') : '');
await b.close();
