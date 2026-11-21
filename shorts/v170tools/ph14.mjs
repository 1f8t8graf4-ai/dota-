// фото карточки 2014 из последнего кадра главы 4 (v22.2): node v170tools/ph14.mjs v210y-ru <N> <out.png>
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path';
const require = createRequire(import.meta.url);
const { chromium } = require(require.resolve('playwright', { paths: [...(process.env.NODE_PATH || '').split(path.delimiter).filter(Boolean), '/opt/node-tools/node_modules'] }));
const here = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const [ep, N, out] = process.argv.slice(2);
const TL = JSON.parse(fs.readFileSync(path.join(here, 'out', ep, 'timeline.json'), 'utf8'));
const b = await chromium.launch({ args: ['--allow-file-access-from-files'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + path.join(here, 'stage.html'));
await p.evaluate(ep => window.loadEp(ep), ep.replace(/-(en|ru|de)(-vo)?$/, ''));
await p.evaluate(async () => { for (const f of ['600 10px M', '800 10px M', '500 10px O', '700 10px O', '700 10px P', 'italic 700 10px P']) await document.fonts.load(f, 'aя'); await document.fonts.ready });
await p.evaluate(tl => window.init(tl), TL);
const endT = (Math.ceil(TL.dur * 30) - 1) / 30;
const url = await p.evaluate(([t, n]) => { window.render(t); return window.__ph14(t, n) }, [endT, Number(N)]);
fs.writeFileSync(out, Buffer.from(url.split(',')[1], 'base64')); console.log('ok', out, 't', endT); await b.close();
