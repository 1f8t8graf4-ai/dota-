// Кадры stage.html → ffmpeg.
//   node capture.mjs <ep> shots 1.5,10,20      → out/<ep>/shots/*.png
//   node capture.mjs <ep> video [fps] [tabs]   → out/<ep>/video.mp4
// Основа — nightfabel/capture.mjs; здесь несколько вкладок рисуют кадры параллельно.
import { createRequire } from 'module';
import { spawn } from 'child_process';
import fs from 'fs'; import path from 'path'; import url from 'url';
const require = createRequire(import.meta.url);
const { chromium } = require(require.resolve('playwright', { paths: [process.env.NODE_PATH || '/opt/node-tools/node_modules', ...((process.env.NODE_PATH || '').split(':'))] }));
const here = path.dirname(url.fileURLToPath(import.meta.url));
const [ep, mode, arg, tabsArg] = process.argv.slice(2);
const OUT = path.join(here, 'out', ep);
const TL = JSON.parse(fs.readFileSync(path.join(OUT, 'timeline.json'), 'utf8'));
const b = await chromium.launch();
const errs = [];
async function page() {
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()) });
  await p.goto('file://' + path.join(here, 'stage.html'));
  await p.evaluate(ep => window.loadEp(ep), ep);
  await p.evaluate(tl => window.init(tl), TL);
  await p.evaluate(async () => {
    const d = document.createElement('div'); d.style.cssText = 'position:absolute;left:-9999px';
    d.innerHTML = '<span style="font-family:P;font-weight:700">a</span><span style="font-family:P;font-weight:800">a</span><span style="font-family:P;font-weight:900">a$1</span><span style="font-family:N;font-weight:900">a</span>';
    document.body.appendChild(d); await document.fonts.ready;
    for (const f of ['700 10px P', '800 10px P', '900 10px P', '800 10px N', '900 10px N']) await document.fonts.load(f);
  });
  return p
}
if (mode === 'shots') {
  const p = await page();
  const dir = path.join(OUT, 'shots'); fs.mkdirSync(dir, { recursive: true });
  for (const t of arg.split(',').map(Number)) {
    await p.evaluate(t => window.render(t), t);
    await p.screenshot({ path: path.join(dir, `f${t.toFixed(2).padStart(6, '0')}.png`) });
  }
} else {
  const fps = Number(arg || 30), N = Math.ceil(TL.dur * fps), K = Number(tabsArg || 4);
  const P = await Promise.all([...Array(K)].map(page));
  const outf = path.join(OUT, 'video.mp4');
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
    '-pix_fmt', 'yuv420p', '-r', String(fps), outf], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  // окно кадров: K вкладок рисуют i, i+1 … параллельно, пишем по порядку
  for (let i = 0; i < N; i += K) {
    const bufs = await Promise.all(P.map(async (p, j) => {
      const f = i + j; if (f >= N) return null;
      await p.evaluate(t => window.render(t), f / fps);
      return p.screenshot({ type: 'jpeg', quality: 92 })
    }));
    for (const buf of bufs) if (buf && !ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 300 < K) console.log(`${ep}: кадр ${i}/${N}  ${((Date.now() - t0) / 1000).toFixed(0)} с`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
}
if (errs.length) console.log('ОШИБКИ:', [...new Set(errs)].slice(0, 10).join('\n'));
await b.close();
