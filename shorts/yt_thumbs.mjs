// v23.6 (23.11): превью YouTube для фильма «Что вы знаете о никотине?» — RU / EN / DE, 1280×720 (Андрей: «мне нужны превью на ютуб»).
// Без нейрокартинок: справа — настоящий кадр фильма (квадрат 1080×1080 из out/thumbs/src, готовит python-кроп из кадров film.mp4 / video.mp4),
// слева — крупный текст (Manrope 800 из shorts/fonts), одно слово акцентом. Правый нижний угол пустой — там YouTube ставит длительность.
// Варианты: row — пять продуктов в ряд (пролог), board — доска с нитями (финал), ring — змея вокруг башен табачных гигантов (финал).
//   node yt_thumbs.mjs   → out/thumbs/<вариант>_<язык>.jpg и out/thumbs/all.png (все девять листом)
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module';
const require = createRequire(import.meta.url); const { chromium } = require('playwright');
const HERE = path.dirname(new URL(import.meta.url).pathname), OUT = path.join(HERE, 'out', 'thumbs'), SRC = path.join(OUT, 'src');
const F = 'file://' + path.join(HERE, 'fonts') + '/';
const ACC = '#FFB21E';
// текст: строки; *слово* — акцентом
const V = {
  row:   { top: 1, img: () => 'row.jpg', tag: { ru: 'СИГАРЕТЫ · ВЕЙПЫ · АЙКОС · СНЮС', en: 'CIGARETTES · VAPES · IQOS · POUCHES', de: 'ZIGARETTEN · VAPES · IQOS · BEUTEL' },
           t: { ru: ['ОДНИ', 'И ТЕ ЖЕ', '*ЛЮДИ*'], en: ['THE', 'SAME', '*PEOPLE*'], de: ['DIESELBEN', '*LEUTE*'] } },
  board: { img: l => `board_${l}.jpg`, tag: { ru: '5 УЛИК · 100 ЛЕТ', en: '5 CLUES · 100 YEARS', de: '5 INDIZIEN · 100 JAHRE' },
           t: { ru: ['КТО', 'ЗА ЭТИМ', '*СТОИТ?*'], en: ["WHO'S", 'BEHIND', '*IT?*'], de: ['WER', 'STECKT', '*DAHINTER?*'] } },
  ring:  { img: l => `ring_${l}.jpg`, tag: { ru: 'ДОКУМЕНТАЛЬНЫЙ РАЗБОР', en: 'A DOCUMENTARY', de: 'EINE DOKU' },
           t: { ru: ['ЧТО ВЫ', 'ЗНАЕТЕ', 'О *НИКОТИНЕ?*'], en: ['WHAT DO', 'YOU KNOW', 'ABOUT', '*NICOTINE?*'], de: ['WAS WISST', 'IHR ÜBER', '*NIKOTIN?*'] } },
};
const css = `
@font-face{font-family:MV;font-weight:200 800;src:url(${F}manrope-var-latin.woff2) format('woff2');unicode-range:U+0000-00FF,U+2000-206F}
@font-face{font-family:MV;font-weight:200 800;src:url(${F}manrope-var-latin-ext.woff2) format('woff2');unicode-range:U+0100-02FF}
@font-face{font-family:MV;font-weight:200 800;src:url(${F}manrope-var-cyrillic.woff2) format('woff2');unicode-range:U+0400-045F}
*{margin:0;padding:0;box-sizing:border-box} html,body{width:1280px;height:720px;overflow:hidden;background:#07090D}
.w{position:relative;width:1280px;height:720px;font-family:MV,sans-serif;color:#F5F3EE}
.im{position:absolute;right:0;top:0;width:720px;height:720px;background-size:cover;background-position:center}
.fd{position:absolute;right:420px;top:0;width:300px;height:720px;background:linear-gradient(90deg,#07090D 0%,rgba(7,9,13,.85) 35%,rgba(7,9,13,0) 100%)}
.gl{position:absolute;left:-200px;top:-260px;width:900px;height:700px;background:radial-gradient(closest-side,rgba(255,178,30,.13),rgba(255,178,30,0))}
.tx{position:absolute;left:64px;top:0;bottom:0;width:640px;display:flex;flex-direction:column;justify-content:center}
.tg{font-weight:700;font-size:21px;letter-spacing:.18em;color:rgba(245,243,238,.62);margin-bottom:26px;display:flex;align-items:center;gap:14px}
.tg i{display:inline-block;width:12px;height:12px;border-radius:50%;background:${ACC};box-shadow:0 0 14px rgba(255,178,30,.7)}
.h{font-weight:800;line-height:.98;letter-spacing:-.02em;text-transform:uppercase;text-shadow:0 4px 24px rgba(0,0,0,.6)}
.h b{color:${ACC};font-weight:800} .h span{display:inline-block;white-space:nowrap}
.ln{margin-top:30px;width:84px;height:6px;border-radius:3px;background:${ACC}}`;
const html = (v, l) => {
  const lines = V[v].t[l], n = lines.length, longest = Math.max(...lines.map(s => s.replace(/\*/g, '').length));
  const fs = Math.min(n >= 4 ? 96 : 118, Math.floor(600 / (longest * .62)));
  const h = lines.map(s => '<span>' + s.replace(/\*(.+?)\*/g, '<b>$1</b>') + '</span>').join('<br>');
  const img = 'file://' + path.join(SRC, V[v].img(l));
  if (V[v].top) return `<!doctype html><meta charset=utf-8><style>${css}
  .w{background:radial-gradient(120% 90% at 50% 70%,#1b2029 0%,#0b0d12 55%,#07090D 100%)}
  .rw{position:absolute;left:50%;top:200px;width:1000px;height:520px;transform:translateX(-50%);background:url('${img}') center 62%/cover no-repeat;
      -webkit-mask:radial-gradient(60% 62% at 50% 60%,#000 62%,transparent 100%);mask:radial-gradient(60% 62% at 50% 60%,#000 62%,transparent 100%)}
  .tt{position:absolute;left:0;right:0;top:44px;text-align:center} .tt .tg{justify-content:center;margin-bottom:14px}</style>
  <div class=w><div class=rw></div><div class=gl></div><div class=tt><div class=tg><i></i>${V[v].tag[l]}</div>
  <div class=h data-w=1160 style="font-size:104px">${lines.map(s => '<span>' + s.replace(/\*(.+?)\*/g, '<b>$1</b>') + '</span>').join(' ')}</div></div></div>`;
  return `<!doctype html><meta charset=utf-8><style>${css}</style><div class=w><div class=im style="background-image:url('${img}')"></div><div class=fd></div><div class=gl></div>
  <div class=tx><div class=tg><i></i>${V[v].tag[l]}</div><div class=h data-w=500 style="font-size:${fs}px">${h}</div><div class=ln></div></div></div>`;
};
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
const shots = [];
for (const v of Object.keys(V)) for (const l of ['ru', 'en', 'de']) {
  const f = path.join(OUT, `tmp_${v}_${l}.html`); fs.writeFileSync(f, html(v, l));
  await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => { const h = document.querySelector('.h'), W = +h.dataset.w; let f = parseFloat(h.style.fontSize);
    while (f > 40 && Math.max(...[...h.querySelectorAll('span')].map(x => x.getBoundingClientRect().width)) > W) { f -= 2; h.style.fontSize = f + 'px' } });
  const o = path.join(OUT, `${v}_${l}.jpg`); await p.screenshot({ path: o, type: 'jpeg', quality: 92 }); fs.unlinkSync(f); shots.push(o);
  console.log(o, (fs.statSync(o).size / 1024).toFixed(0) + ' КБ');
}
await b.close();
