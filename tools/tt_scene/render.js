// Ролик из HTML-сцены: страница рисует кадр по времени (window.R(t)), Playwright снимает кадры, ffmpeg склеивает.
// node tools/tt_scene/render.js <сцена.html> <выход.mp4>            — весь ролик
// node tools/tt_scene/render.js <сцена.html> <папка> --t 1,5.5,9    — кадры PNG на проверку
// У страницы: window.DUR (секунды), window.R(t). Размер 1080×1920, 30 к/с.
const {chromium} = require('playwright');
const {spawn} = require('child_process');
const path = require('path');
const fs = require('fs');

(async () => {
  const a = process.argv.slice(2);
  const html = a[0], out = a[1];
  const ti = a.indexOf('--t');
  const shots = ti >= 0 ? a[ti + 1].split(',').map(Number) : null;
  const FPS = 30;
  const b = await chromium.launch();
  const p = await b.newPage({viewport: {width: 1080, height: 1920}});
  const errs = [];
  p.on('pageerror', e => errs.push(String(e)));
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + path.resolve(html));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  if (errs.length) { console.error(errs.join('\n')); process.exit(1); }
  if (shots) {
    fs.mkdirSync(out, {recursive: true});
    for (const t of shots) {
      await p.evaluate(t => window.R(t), t);
      await p.screenshot({path: path.join(out, `t${String(t).replace('.', '_')}.png`)});
    }
    console.log('кадры:', shots.length, '→', out);
    await b.close();
    return;
  }
  const dur = await p.evaluate(() => window.DUR);
  const n = Math.round(dur * FPS);
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', '-preset', 'medium', '-tune', 'animation',
    '-movflags', '+faststart', out], {stdio: ['pipe', 'inherit', 'inherit']});
  const t0 = Date.now();
  // несколько вкладок параллельно, кадры уходят в ffmpeg по порядку
  const N = Math.max(1, Math.min(6, require('os').cpus().length));
  const pages = [p];
  for (let i = 1; i < N; i++) {
    const q = await b.newPage({viewport: {width: 1080, height: 1920}});
    q.on('pageerror', e => errs.push(String(e)));
    await q.goto('file://' + path.resolve(html));
    await q.evaluate(() => document.fonts.ready);
    pages.push(q);
  }
  const done = new Map(); let next = 0, made = 0;
  const flush = async () => {
    while (done.has(next)) {
      const buf = done.get(next); done.delete(next); next++;
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
  };
  let lock = Promise.resolve();
  await Promise.all(pages.map(async (q, w) => {
    for (let i = w; i < n; i += N) {
      while (i - next > 4 * N) await new Promise(r => setTimeout(r, 20));
      await q.evaluate(t => window.R(t), i / FPS);
      done.set(i, await q.screenshot({type: 'jpeg', quality: 94}));
      if (++made % 60 === 0) process.stdout.write(`\r${made}/${n}`);
      lock = lock.then(flush); await lock;
    }
  }));
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await b.close();
  if (errs.length) console.error('\n' + errs.join('\n'));
  console.log(`\r${n}/${n} кадров за ${((Date.now() - t0) / 1000).toFixed(0)} с → ${out}`);
})();
