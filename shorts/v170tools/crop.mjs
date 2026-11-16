// кадры с вырезом: node crop.mjs <ep> <t1,t2,…> <x,y,w,h> <out.jpg> [масштаб=1]
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path';
const require = createRequire(import.meta.url);
const { chromium } = require(require.resolve('playwright', { paths: [...(process.env.NODE_PATH || '').split(path.delimiter).filter(Boolean), '/opt/node-tools/node_modules'] }));
const here = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const [ep, ts, box, out, scA] = process.argv.slice(2);
const TL = JSON.parse(fs.readFileSync(path.join(here, 'out', ep, 'timeline.json'), 'utf8'));
const b = await chromium.launch({ args: ['--allow-file-access-from-files'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
const errs = []; p.on('pageerror', e => errs.push(String(e)));
await p.goto('file://' + path.join(here, 'stage.html'));
await p.evaluate(ep => window.loadEp(ep), ep.replace(/-(en|ru)$/, ''));
await p.evaluate(async () => { for (const f of ['600 10px M', '800 10px M', '500 10px O', '700 10px O', '700 10px U', '800 10px U']) await document.fonts.load(f, 'aя'); await document.fonts.ready });
await p.evaluate(tl => window.init(tl), TL);
const [x, y, w, h] = box.split(',').map(Number), T = ts.split(',').map(Number), sc = Number(scA || 1);
const url = await p.evaluate(([T, x, y, w, h, sc]) => {
  const S = document.createElement('canvas'); S.width = T.length * w * sc; S.height = h * sc; const g = S.getContext('2d');
  T.forEach((t, i) => { window.render(t); const cv = document.querySelector('canvas'); g.drawImage(cv, x, y, w, h, i * w * sc, 0, w * sc, h * sc); g.font = '700 20px sans-serif'; g.fillStyle = '#000'; g.fillRect(i * w * sc, 0, 70, 26); g.fillStyle = '#ff0'; g.fillText(t.toFixed(2), i * w * sc + 5, 20) });
  return S.toDataURL('image/jpeg', .9);
}, [T, x, y, w, h, sc]);
fs.writeFileSync(out, Buffer.from(url.split(',')[1], 'base64')); console.log('ok', out, errs.length ? 'ERR ' + errs.join(' | ') : '');
await b.close();
