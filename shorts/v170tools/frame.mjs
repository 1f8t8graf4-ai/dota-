// один кадр в PNG без сжатия: node frame.mjs <ep> <t> <out.png>
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path';
const require = createRequire(import.meta.url);
const { chromium } = require(require.resolve('playwright', { paths: [...(process.env.NODE_PATH || '').split(path.delimiter).filter(Boolean), '/opt/node-tools/node_modules'] }));
const here = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const [ep, ts, out] = process.argv.slice(2);
const TL = JSON.parse(fs.readFileSync(path.join(here, 'out', ep, 'timeline.json'), 'utf8'));
const b = await chromium.launch({ args: ['--allow-file-access-from-files'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + path.join(here, 'stage.html'));
await p.evaluate(ep => window.loadEp(ep), ep.replace(/-(en|ru|de)$/, ''));
await p.evaluate(async () => { for (const f of ['600 10px M', '800 10px M', '500 10px O', '700 10px O']) await document.fonts.load(f, 'aя'); await document.fonts.ready });
await p.evaluate(tl => window.init(tl), TL);
const url = await p.evaluate(t => { window.render(t); return document.querySelector('canvas').toDataURL('image/png') }, Number(ts));
fs.writeFileSync(out, Buffer.from(url.split(',')[1], 'base64')); console.log('ok', out); await b.close();
