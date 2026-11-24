// Крючок на первые 3 секунды шортса (TikTok / Shorts): прозрачные PNG 1080×1920 с крупным текстом.
// node tt_hook.mjs <папка вывода>  → hook_<язык>_<часть>.png; вшивает их tt_hook.sh (ffmpeg).
// Почему: в TikTok почти все листали дальше на 0:01 — первый кадр пустой (24.11).
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module';
const require = createRequire(import.meta.url); let pw; try { pw = require('playwright') } catch { pw = require('/opt/node-tools/node_modules/playwright') } const { chromium } = pw;
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true });
const F = 'file://' + path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'fonts') + '/';
const TAG = { en: n => `PART ${n}/5`, de: n => `TEIL ${n}/5`, ru: n => `ЧАСТЬ ${n}/5` };
const H = {
  en: ["What's really in your <b>vape?</b>", 'The <b>loophole</b> behind the vape boom', 'Marlboro was made for <b>women</b>',
       'The tobacco giant that <b>“quit”</b> cigarettes', 'A tiny pouch worth <b>$16 billion</b>'],
  de: ['Was steckt wirklich in deiner <b>Einweg-Vape?</b>', 'Die <b>Lücke</b> hinter dem Vape-Boom', 'Marlboro war für <b>Frauen</b> gedacht',
       'Der Tabakriese, der <b>„aufhörte“</b>', 'Ein Beutel für <b>16 Milliarden Dollar</b>'],
  ru: ['Что на самом деле в твоей <b>одноразке?</b>', '<b>Лазейка</b>, из-за которой одноразки повсюду', '«Мальборо» делали для <b>женщин</b>',
       'Табачный гигант, который <b>«бросил курить»</b>', 'Пакетик за <b>16 миллиардов долларов</b>'],
};
const css = `@font-face{font-family:MV;font-weight:200 800;src:url(${F}manrope-var-latin.woff2) format('woff2');unicode-range:U+0000-00FF,U+2000-206F}
@font-face{font-family:MV;font-weight:200 800;src:url(${F}manrope-var-latin-ext.woff2) format('woff2');unicode-range:U+0100-02FF}
@font-face{font-family:MV;font-weight:200 800;src:url(${F}manrope-var-cyrillic.woff2) format('woff2');unicode-range:U+0400-045F}
*{margin:0;padding:0;box-sizing:border-box}html,body{width:1080px;height:1920px;background:transparent}
.b{position:absolute;left:70px;right:70px;top:300px;padding:34px 40px 40px;border-radius:34px;background:rgba(8,10,20,.72);text-align:center;font-family:MV,sans-serif}
.t{display:inline-block;font-weight:800;font-size:40px;letter-spacing:.12em;color:#111;background:#FFB21E;padding:9px 22px;border-radius:12px;margin-bottom:22px}
.h{font-weight:800;font-size:108px;line-height:1.04;letter-spacing:-.02em;color:#fff}.h b{color:#FFB21E}`;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
for (const L of Object.keys(H)) for (let i = 0; i < 5; i++) {
  const f = path.join(OUT, 'tmp.html');
  fs.writeFileSync(f, `<!doctype html><meta charset=utf-8><style>${css}</style><div class=b><div class=t>${TAG[L](i + 1)}</div><div class=h>${H[L][i]}</div></div>`);
  await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => { const h = document.querySelector('.h'); let s = 108; while (s > 50 && (h.scrollHeight > 3.3 * s * 1.04 || h.scrollWidth > h.clientWidth)) { s -= 2; h.style.fontSize = s + 'px' } });
  await p.screenshot({ path: path.join(OUT, `hook_${L}_${i + 1}.png`), omitBackground: true }); fs.unlinkSync(f);
}
await b.close(); console.log('ok');
