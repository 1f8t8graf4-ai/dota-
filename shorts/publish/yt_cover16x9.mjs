// Превью 16:9 для YouTube из кадров фильма (варианты row / memo / ring): node yt_cover16x9.mjs <папка с row.png memo.png ring.png> <папка вывода> <en|de|ru>
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module';
const require = createRequire(import.meta.url); let pw; try { pw = require('playwright') } catch { pw = require('/opt/node-tools/node_modules/playwright') } const { chromium } = pw;
const [SRC, OUT, L] = process.argv.slice(2); fs.mkdirSync(OUT, { recursive: true });
const F = 'file://' + path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'fonts') + '/';
const ACC = '#FFB21E';
const T = {
  row:  { en: ['THE SAME *PEOPLE*'], de: ['DIESELBEN *LEUTE*'], ru: ['ОДНИ И ТЕ ЖЕ *ЛЮДИ*'] },
  memo: { en: ['THEY', 'PLANNED IT', 'IN *1973*'], de: ['GEPLANT', 'SCHON', '*1973*'], ru: ['ОНИ', 'ЭТО ПЛАНИРОВАЛИ', 'В *1973*'] },
  ring: { en: ["WHO'S", '*BEHIND*', 'IT?'], de: ['WER', 'STECKT', '*DAHINTER?*'], ru: ['КТО', 'ЗА ЭТИМ', '*СТОИТ?*'] },
};
// кадр: файл, левый край, верх, ширина окна в пикселях кадра 2560×1440
const C = { row: ['row.png', 693, 430, 1200], memo: ['memo.png', 120, 205, 1500], ring: ['ring.png', 83, 377, 1760] };
const css = `
@font-face{font-family:MV;font-weight:200 800;src:url(${F}manrope-var-latin.woff2) format('woff2');unicode-range:U+0000-00FF,U+2000-206F}
@font-face{font-family:MV;font-weight:200 800;src:url(${F}manrope-var-latin-ext.woff2) format('woff2');unicode-range:U+0100-02FF}
@font-face{font-family:MV;font-weight:200 800;src:url(${F}manrope-var-cyrillic.woff2) format('woff2');unicode-range:U+0400-045F}
*{margin:0;padding:0;box-sizing:border-box} html,body{width:1280px;height:720px;overflow:hidden;background:#07090D}
.w{position:relative;width:1280px;height:720px;overflow:hidden;font-family:MV,sans-serif;color:#fff}
img.bg{position:absolute;max-width:none}
.sh{position:absolute;inset:0}
.h{position:absolute;font-weight:800;line-height:.95;letter-spacing:-.025em;text-transform:uppercase;
   text-shadow:0 6px 0 rgba(0,0,0,.55),0 10px 40px rgba(0,0,0,.8);-webkit-text-stroke:2px rgba(0,0,0,.35);paint-order:stroke fill}
.h b{color:${ACC}} .h span{display:inline-block;white-space:nowrap}`;
const html = (v) => {
  const [f, x0, y0, w] = C[v], k = 1280 / w;
  const img = `<img class=bg src="file://${path.join(SRC, f)}" style="width:${2560 * k}px;left:${-x0 * k}px;top:${-y0 * k}px">`;
  const lines = T[v][L].map(s => '<span>' + s.replace(/\*(.+?)\*/g, '<b>$1</b>') + '</span>').join(v === 'row' ? '<br>' : '');
  if (v === 'row') return `<style>${css}.sh{background:linear-gradient(180deg,rgba(5,7,10,.85) 0%,rgba(5,7,10,.35) 38%,rgba(0,0,0,0) 55%)}
   .h{left:0;right:0;top:40px;text-align:center}</style><div class=w>${img}<div class=sh></div><div class=h data-w=1180 style="font-size:150px">${lines}</div></div>`;
  return `<style>${css}.sh{background:linear-gradient(90deg,rgba(5,7,10,.92) 0%,rgba(5,7,10,.75) 34%,rgba(5,7,10,0) 52%)}
   .h{left:56px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;align-items:flex-start}</style>
   <div class=w>${img}<div class=sh></div><div class=h data-w=${v === 'memo' ? 540 : 540} style="font-size:150px">${lines}</div></div>`;
};
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
for (const v of Object.keys(C)) {
  const f = path.join(OUT, `tmp_${v}.html`); fs.writeFileSync(f, '<!doctype html><meta charset=utf-8>' + html(v));
  await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => { const h = document.querySelector('.h'), W = +h.dataset.w; let s = parseFloat(h.style.fontSize);
    while (s > 40 && Math.max(...[...h.querySelectorAll('span')].map(x => x.getBoundingClientRect().width)) > W) { s -= 2; h.style.fontSize = s + 'px' } });
  const o = path.join(OUT, `${v}_${L}.jpg`); await p.screenshot({ path: o, type: 'jpeg', quality: 95 }); fs.unlinkSync(f);
  console.log(o, (fs.statSync(o).size / 1024 | 0) + ' KB');
}
await b.close();
