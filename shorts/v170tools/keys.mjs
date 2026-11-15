// тайминги ролика: node keys.mjs <ep> [выражение с K, напр. "[K.qt, K.qEnd]"] — без выражения печатает все K по времени
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path';
const require = createRequire(import.meta.url);
const { chromium } = require(require.resolve('playwright', { paths: [...(process.env.NODE_PATH || '').split(path.delimiter).filter(Boolean), '/opt/node-tools/node_modules'] }));
const here = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const [ep, expr] = process.argv.slice(2);
const TL = JSON.parse(fs.readFileSync(path.join(here, 'out', ep, 'timeline.json'), 'utf8'));
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + path.join(here, 'stage.html'));
await p.evaluate(ep => window.loadEp(ep), ep.replace(/-(en|ru)$/, ''));
await p.evaluate(tl => window.init(tl), TL);
const r = await p.evaluate(e => { const K = window.__K; if (!e) return Object.entries(K).filter(([, v]) => typeof v === 'number').sort((a, b) => a[1] - b[1]).map(([k, v]) => k + '=' + v.toFixed(2)).join('  '); return JSON.stringify(eval(e)) }, expr || '');
console.log(r); await b.close();
