// Кадры stage.html → ffmpeg (shorts v2). <ep> = mrbeast-en, nicotine-ru …
//   node capture.mjs <ep> shots 1.5,10,20      → out/<ep>/shots/*.png
//   node capture.mjs <ep> video [fps] [tabs]   → out/<ep>/video.mp4
// Основа — nightfabel/capture.mjs; здесь несколько вкладок рисуют кадры параллельно.
import { createRequire } from 'module';
import { spawn } from 'child_process';
import fs from 'fs'; import path from 'path'; import url from 'url';
const require = createRequire(import.meta.url);
const here = path.dirname(url.fileURLToPath(import.meta.url));
// playwright: из shorts/node_modules (ПК), из NODE_PATH или /opt/node-tools (облако)
const { chromium } = require(require.resolve('playwright', { paths: [here, ...(process.env.NODE_PATH || '').split(path.delimiter).filter(Boolean), '/opt/node-tools/node_modules'] }));
const [ep, mode, arg, tabsArg] = process.argv.slice(2);
const OUT = path.join(here, 'out', ep);
// out/ не в git: тайминги ролика лежат в tl/<ролик>.json — при первом запуске копируем в out/<ролик>/
if (!fs.existsSync(path.join(OUT, 'timeline.json')) && fs.existsSync(path.join(here, 'tl', ep + '.json'))) { fs.mkdirSync(OUT, { recursive: true }); fs.copyFileSync(path.join(here, 'tl', ep + '.json'), path.join(OUT, 'timeline.json')) }
const TL = JSON.parse(fs.readFileSync(path.join(OUT, 'timeline.json'), 'utf8'));
// ПК с видеокартой: GPU=1 — рисовать на видюхе; CH=chromium — полный Chromium вместо headless shell; HEADFUL=1 — с окном браузера (видюха есть всегда); FFMPEG — путь к ffmpeg
const GPU = !!process.env.GPU, HEADFUL = !!process.env.HEADFUL, FF = process.env.FFMPEG || 'ffmpeg';
const b = await chromium.launch(GPU ? {
  channel: process.env.CH || undefined, headless: !HEADFUL,
  args: ['--ignore-gpu-blocklist', '--enable-gpu', '--enable-gpu-rasterization', ...(process.platform === 'win32' ? ['--use-angle=d3d11'] : []),
    '--disable-features=CalculateNativeWinOcclusion', '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding', '--disable-background-timer-throttling']
} : {});
const glName = p => p.evaluate(() => { const c = document.createElement('canvas'), gl = c.getContext('webgl2') || c.getContext('webgl'); if (!gl) return 'нет WebGL'; const d = gl.getExtension('WEBGL_debug_renderer_info'); return d ? gl.getParameter(d.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER) });
const soft = s => /swiftshader|llvmpipe|software|basic render/i.test(s);
const errs = [];
async function page() {
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()) });
  await p.goto(url.pathToFileURL(path.join(here, 'stage.html')).href);
  await p.evaluate(f => { window.FMT = f }, process.env.FMT || '');   // формат кадра: FMT=9x16 — вертикаль, иначе как задано в ролике
  await p.evaluate(ep => window.loadEp(ep), ep.replace(/-(en|ru)$/, ''));
  await p.evaluate(async () => {
    for (const f of ['600 10px M', '800 10px M', '500 10px O', '700 10px O', '700 10px U', '800 10px U']) { await document.fonts.load(f, 'aя'); }
    await document.fonts.ready;
  });
  await p.evaluate(tl => window.init(tl), TL);
  const sz = await p.evaluate(() => window.EP.size || null); if (sz) await p.setViewportSize({ width: sz[0], height: sz[1] });  // горизонтальный кадр
  return p
}
if (mode === 'cues') {
  // звуки по событиям: пройти все кадры без снимков (быстро) и собрать cue() → out/<ep>/cues.json
  const p = await page(), fps = Number(arg || 20), N = Math.ceil(TL.dur * fps);
  const cues = await p.evaluate(([N, fps]) => { for (let i = 0; i <= N; i++) window.render(i / fps); return Object.values(window.CUES || {}).sort((a, b) => a[0] - b[0]) }, [N, fps]);
  fs.writeFileSync(path.join(OUT, 'cues.json'), JSON.stringify(cues));
  console.log(ep, 'звуков по событиям:', cues.length);
} else if (mode === 'shots') {
  const p = await page();
  const dir = path.join(OUT, 'shots'); fs.mkdirSync(dir, { recursive: true });
  for (const t of arg.split(',').map(Number)) {
    await p.evaluate(t => window.render(t), t);
    await p.screenshot({ path: path.join(dir, `f${t.toFixed(2).padStart(6, '0')}.png`), timeout: 240000 });
  }
} else if (mode === 'gpu') {
  // проверка ПК: на чём рисует WebGL и сколько секунд уходит на кадр
  const p = await page(), g = await glName(p);
  console.log('WebGL рисует:', g, soft(g) ? '— ПРОГРАММНО, видюха НЕ работает' : '— видюха работает');
  await p.evaluate(t => window.render(t), 50); await p.screenshot({ type: 'jpeg', quality: 92, timeout: 240000 });
  const n = 12, t0 = Date.now();
  for (let i = 1; i <= n; i++) { await p.evaluate(t => window.render(t), 50 + i / 30); await p.screenshot({ type: 'jpeg', quality: 92, timeout: 240000 }) }
  const s = (Date.now() - t0) / 1000 / n, NF = Math.ceil(TL.dur * 30);
  console.log(`кадр ≈ ${s.toFixed(2)} с на вкладку; весь ролик (${NF} кадров) на одной вкладке ≈ ${(s * NF / 60).toFixed(1)} мин`);
} else {
  // v16.6: RANGE='44.9-55.4,73.6-88.9' — только эти отрезки подряд (пробы), иначе весь ролик
  const fps = Number(arg || 30), TS = process.env.RANGE ? process.env.RANGE.split(',').flatMap(r => { const [a, b] = r.split('-').map(Number), o = []; for (let i = Math.round(a * fps); i < Math.round(b * fps); i++) o.push(i / fps); return o }) : null;
  const N = TS ? TS.length : Math.ceil(TL.dur * fps), K = Number(tabsArg || (HEADFUL ? 1 : 4));
  const P = await Promise.all([...Array(K)].map(page));
  const g = await glName(P[0]); console.log('WebGL рисует:', g, soft(g) ? '(программно)' : '(видюха)');
  const outf = process.env.OUTF ? path.join(OUT, process.env.OUTF) : path.join(OUT, `video${process.env.FMT ? '-' + process.env.FMT : ''}${TS ? '-range' : ''}.mp4`);   // OUTF — своё имя (куски рендера)
  const ff = spawn(FF, ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
    '-pix_fmt', 'yuv420p', '-r', String(fps), outf], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  // окно кадров: K вкладок рисуют i, i+1 … параллельно, пишем по порядку
  for (let i = 0; i < N; i += K) {
    const bufs = await Promise.all(P.map(async (p, j) => {
      const f = i + j; if (f >= N) return null;
      await p.evaluate(t => window.render(t), TS ? TS[f] : f / fps);
      return p.screenshot({ type: 'jpeg', quality: 92, timeout: 240000 })
    }));
    for (const buf of bufs) if (buf && !ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 300 < K) console.log(`${ep}: кадр ${i}/${N}  ${((Date.now() - t0) / 1000).toFixed(0)} с`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  if (process.env.AUDIO) {
    // AUDIO=путь к звуку (звук-A.m4a или Проба-A.mp4): video.mp4 → video-zvuk.mp4
    const outz = outf.replace(/\.mp4$/, '-zvuk.mp4');
    const fa = spawn(FF, ['-y', '-v', 'error', '-i', outf, '-i', process.env.AUDIO, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', outz], { stdio: 'inherit' });
    await new Promise(r => fa.on('close', r)); console.log('Готово со звуком:', outz);
  }
}
if (errs.length) console.log('ОШИБКИ:', [...new Set(errs)].slice(0, 10).join('\n'));
await b.close();
