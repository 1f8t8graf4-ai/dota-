// Вертикальная обложка шортса / TikTok 1080×1920: node tt_cover.mjs <папка с f_<язык>.png (кадр 2560×1440 из 16:9 фильма)> [en,ru,de]
// Пишет <папка>/Cover_Part1_<ЯЗЫК>.jpg. Текст — в T ниже, кадр — окно 1000×1440 с x=780, сдвиг вниз 560 (текст сверху, вне кнопок TikTok и сетки 3:4).
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module';
const require = createRequire(import.meta.url); let pw; try { pw = require('playwright') } catch { pw = require('/opt/node-tools/node_modules/playwright') } const { chromium } = pw;
const D = process.argv[2]; const F = 'file://' + path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'fonts') + '/'; const ACC = '#FFB21E';
const T = { en: { tag: 'PART 1 · DISPOSABLES', h: ['WHAT DO YOU KNOW', 'ABOUT <b>NICOTINE?</b>'] },
            ru: { tag: 'ЧАСТЬ 1 · ОДНОРАЗКИ', h: ['ЧТО ВЫ ЗНАЕТЕ', 'О <b>НИКОТИНЕ?</b>'] },
            de: { tag: 'TEIL 1 · EINWEG-VAPES', h: ['WAS WISST IHR', 'ÜBER <b>NIKOTIN?</b>'] } };
const css = `@font-face{font-family:MV;font-weight:200 800;src:url(${F}manrope-var-latin.woff2) format('woff2');unicode-range:U+0000-00FF,U+2000-206F}
@font-face{font-family:MV;font-weight:200 800;src:url(${F}manrope-var-cyrillic.woff2) format('woff2');unicode-range:U+0400-045F}
*{margin:0;padding:0;box-sizing:border-box}html,body{width:1080px;height:1920px;overflow:hidden;background:#080a1c}
.w{position:relative;width:1080px;height:1920px;overflow:hidden;font-family:MV,sans-serif;color:#fff}
img{position:absolute;max-width:none}
.g{position:absolute;left:0;right:0;top:0;height:1000px;background:linear-gradient(180deg,#080a1c 0%,#080a1c 60%,rgba(8,10,28,.55) 75%,rgba(8,10,28,0) 100%)}
.t{position:absolute;left:60px;right:60px;top:255px;text-align:center}
.tg{display:inline-block;font-weight:800;font-size:38px;letter-spacing:.12em;color:#111;background:${ACC};padding:12px 26px;border-radius:14px;margin-bottom:34px}
.h{font-weight:800;line-height:1.0;letter-spacing:-.02em;text-shadow:0 6px 0 rgba(0,0,0,.5),0 10px 40px rgba(0,0,0,.8)}
.h span{display:inline-block;white-space:nowrap}.h b{color:${ACC}}`;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
for (const L of (process.argv[3] || 'en,ru').split(',')) {
  // кадр 2560×1440: окно 1000×1440 по центру → ширина 1080 (k=1.08), сверху 560
  const k = 1.08, x0 = 780, y = 560;
  const html = `<!doctype html><meta charset=utf-8><style>${css}</style><div class=w>
  <img src="file://${path.join(D, 'f_' + L + '.png')}" style="width:${2560 * k}px;left:${-x0 * k}px;top:${y}px">
  <div class=g></div><div class=t><div class=tg>${T[L].tag}</div>
  <div class=h style="font-size:130px">${T[L].h.map(s => '<span>' + s + '</span>').join('<br>')}</div></div></div>`;
  const f = path.join(D, 'tmp.html'); fs.writeFileSync(f, html); await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => { const h = document.querySelector('.h'); let s = 130;
    while (s > 50 && Math.max(...[...h.querySelectorAll('span')].map(x => x.getBoundingClientRect().width)) > 960) { s -= 2; h.style.fontSize = s + 'px' } });
  const o = path.join(D, `Cover_Part1_${L.toUpperCase()}.jpg`); await p.screenshot({ path: o, type: 'jpeg', quality: 94 }); fs.unlinkSync(f); console.log(o, fs.statSync(o).size >> 10, 'KB');
}
await b.close();
