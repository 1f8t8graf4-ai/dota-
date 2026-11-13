// кадр ролика в png с флажками отладки: node fshot.mjs <ep> <t> <out.png> [флаги через запятую: __RIGOFF,__POSTOFF]
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const here = path.dirname(new URL(import.meta.url).pathname), [ep, ts, out, fl] = process.argv.slice(2);
const TL = JSON.parse(fs.readFileSync(path.join(here, 'out', ep, 'timeline.json'), 'utf8'));
const b = await chromium.launch(); const p = await b.newPage();
await p.goto('file://' + path.join(here, 'stage.html'));
await p.evaluate(f => { for (const k of (f || '').split(',').filter(Boolean)) window[k] = true }, fl);
await p.evaluate(ep => window.loadEp(ep), ep.replace(/-(en|ru)$/, ''));
await p.evaluate(tl => window.init(tl), TL);
const url = await p.evaluate(t => { const k = Object.keys(window.EP.D)[0]; window.EP.D[k](t); return document.querySelector('canvas').toDataURL('image/png') }, +ts);
fs.writeFileSync(out, Buffer.from(url.split(',')[1], 'base64')); console.log('ok', out);
await b.close();
