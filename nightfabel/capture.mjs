// Кадры stage.html → ffmpeg. node capture.mjs shots t1,t2,…  |  node capture.mjs video out.mp4 [fps]
import { createRequire } from 'module';
import { spawn } from 'child_process';
import fs from 'fs'; import path from 'path'; import url from 'url';
const require = createRequire(import.meta.url);
const { chromium } = require(require.resolve('playwright', { paths: [process.env.NODE_PATH || '/opt/node-tools/node_modules', ...((process.env.NODE_PATH || '').split(':'))] }));
const here = path.dirname(url.fileURLToPath(import.meta.url));
const TL = JSON.parse(fs.readFileSync(path.join(here, 'out/timeline.json'), 'utf8'));
const [mode, arg, fpsArg] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()) });
await p.goto('file://' + path.join(here, 'stage.html'));
await p.evaluate(tl => window.init(tl), TL);
// прогрев шрифтов: все начертания и эмодзи
await p.evaluate(async () => { const d = document.createElement('div'); d.style.cssText = 'position:absolute;left:-9999px';
  d.innerHTML = '<span style="font-family:P;font-weight:700">a</span><span style="font-family:P;font-weight:800">a</span><span style="font-family:P;font-weight:900">a</span><span style="font-family:N;font-weight:800">a</span><span style="font-family:N;font-weight:900">a</span>🍔🍟🍩🍕🌮🍪🐭🍺⚡🤔👇⏱🐴';
  document.body.appendChild(d); await document.fonts.ready; for (const f of ['700 10px P','800 10px P','900 10px P','800 10px N','900 10px N']) await document.fonts.load(f); });
if (mode === 'shots') {
  fs.mkdirSync(path.join(here, 'shots'), { recursive: true });
  for (const t of arg.split(',').map(Number)) {
    await p.evaluate(t => window.render(t), t);
    await p.screenshot({ path: path.join(here, 'shots', `f${t.toFixed(2).padStart(6, '0')}.png`) });
  }
} else {
  const fps = Number(fpsArg || 30), N = Math.ceil(TL.dur * fps);
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17',
    '-pix_fmt', 'yuv420p', '-r', String(fps), arg], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let i = 0; i < N; i++) {
    await p.evaluate(t => window.render(t), i / fps);
    const buf = await p.screenshot({ type: 'jpeg', quality: 93 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 300 === 0) console.log(`кадр ${i}/${N}  ${((Date.now() - t0) / 1000).toFixed(0)} с`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
}
if (errs.length) console.log('ОШИБКИ:', errs.slice(0, 10).join('\n'));
await b.close();
