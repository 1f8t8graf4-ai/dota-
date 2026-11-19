// v20.4 (19.11): кадры главы 3 в листы — проверка правок по разбору Gemini.
//   node ref/v204_frames.mjs <ep> <папка> t1,t2,...   → <папка>/<ep>_<t>.png и <папка>/sheet.jpg (по 6 в ряд, 270×480)
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path'; import { execFileSync } from 'child_process';
const require = createRequire(import.meta.url);
const { chromium } = require(require.resolve('playwright', { paths: ['/opt/node-tools/node_modules'] }));
const here = '/home/user/dota-/shorts';
const [ep, outd, ts] = process.argv.slice(2);
const TL = JSON.parse(fs.readFileSync(path.join(here, 'out', ep, 'timeline.json'), 'utf8'));
const b = await chromium.launch({ args: ['--allow-file-access-from-files'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()) });
await p.goto('file://' + path.join(here, 'stage.html'));
await p.evaluate(ep => window.loadEp(ep), ep.replace(/-(en|ru)$/, ''));
await p.evaluate(async () => { for (const f of ['600 10px M', '800 10px M', '500 10px O', '700 10px O', '700 10px U', '800 10px U']) await document.fonts.load(f, 'aя'); await document.fonts.ready });
await p.evaluate(tl => window.init(tl), TL);
fs.mkdirSync(outd, { recursive: true }); const files = [];
for (const t of ts.split(',')) {
  const url = await p.evaluate(t => { window.render(t); const cs = [...document.querySelectorAll('canvas')].filter(c => c.isConnected && c.style.display !== 'none'); return cs[cs.length - 1].toDataURL('image/png') }, Number(t));
  const f = path.join(outd, `${ep}_${t}.png`); fs.writeFileSync(f, Buffer.from(url.split(',')[1], 'base64')); files.push([f, t]) }
console.log('ошибки:', errs.length ? errs.slice(0, 5) : 'нет');
await b.close();
execFileSync('python3', ['-c', `
import sys
from PIL import Image, ImageDraw
fs = sys.argv[2:]; out = sys.argv[1]; W, H = 270, 480; n = len(fs) // 2; cols = min(n, 6); rows = (n + cols - 1) // cols
S = Image.new('RGB', (cols * W, rows * H), (40, 40, 40))
for i in range(n):
    im = Image.open(fs[2 * i]).convert('RGB').resize((W, H)); d = ImageDraw.Draw(im); d.rectangle([0, 0, 70, 18], fill=(0, 0, 0)); d.text((4, 3), fs[2 * i + 1], fill=(255, 255, 0)); S.paste(im, ((i % cols) * W, (i // cols) * H))
S.save(out, quality=88)`, path.join(outd, 'sheet.jpg'), ...files.flatMap(([f, t]) => [f, String(t)])]);
