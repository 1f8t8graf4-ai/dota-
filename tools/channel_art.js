// Фирменный пакет NightFabel для YouTube и TikTok (22.11, ТЗ Андрея: «как дорогая документальная студия — Fern / Lemmino / Vox»):
// только типографика, фактура, свет и микро-геометрия — без нейрокартинок, шаров, лучей-конусов и реквизита.
//   node tools/channel_art.js [папка] → shorts/out/channel/ (в git нет):
//   avatar_EN|DE|RU.png 800×800 (YouTube и TikTok) · watermark_EN|DE|RU.png 150×150 · banner_EN|DE|RU.png 2560×1440 · preview.png
// Шрифт — Manrope variable (OFL, shorts/fonts/manrope-var-*.woff2: латиница с ü/ß, кириллица), веса 500 / 700 / 800.
// Акцент языка — фирменная точка и оттенок верхнего свечения: EN янтарь, DE стальной синий, RU приглушённый алый.
// Знак — «N.»: N и круглая точка в цвете языка (у Manrope точка квадратная, поэтому круг того же размера рисуем сами);
// в названии точка над «ı» — та же, на месте настоящей точки буквы i (положение меряется по пикселям шрифта).
// Шапка: всё, что видно, — внутри 1546×423 по центру (только её видно на телефоне), угловые метки — по 1420×340.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..'), FONTS = 'file://' + path.join(ROOT, 'shorts', 'fonts') + '/';
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'shorts', 'out', 'channel'));
fs.mkdirSync(OUT, { recursive: true });

const INK = '#F3F4F6';
const LANG = {
  EN: { acc: '#F59E0B', slogan: 'STORIES ABOUT THINGS YOU THINK YOU KNOW' },
  DE: { acc: '#38BDF8', slogan: 'GESCHICHTEN ÜBER DINGE, DIE IHR ZU KENNEN GLAUBT' },
  RU: { acc: '#EF4444', slogan: 'ИСТОРИИ О ТОМ, ЧТО ВЫ, КАЖЕТСЯ, ЗНАЕТЕ' },
};
const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)).join(',');

const FONT_CSS = [
  ['latin', 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD'],
  ['latin-ext', 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF'],
  ['cyrillic', 'U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116'],
].map(([s, r]) => `@font-face{font-family:MV;font-style:normal;font-weight:200 800;font-display:block;src:url(${FONTS}manrope-var-${s}.woff2) format('woff2');unicode-range:${r}}`).join('');

// фон: матовый графит #07090D, к центру сверху — #0F141E, сверху мягкое рассеянное свечение (чуть в цвет языка), SVG-зерно .035.
// Градиенты — с частыми плавными остановками, шум зерна растянут на весь диапазон: на тёмном не видно колец-ступенек.
const EASE = [[1, 0], [.95, 10], [.84, 22], [.68, 34], [.5, 46], [.32, 58], [.17, 70], [.07, 81], [.02, 90], [.003, 96], [0, 100]];
function bgHTML(W, H, acc) {
  const u = Math.min(W, H);
  return `<div style="position:absolute;inset:0;background:#07090D;overflow:hidden">
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse ${Math.round(W * .62)}px ${Math.round(H * .66)}px at 50% 30%, #0F141E 0%, rgba(15,20,30,.86) 18%, rgba(15,20,30,.62) 36%, rgba(15,20,30,.38) 54%, rgba(15,20,30,.18) 70%, rgba(15,20,30,.06) 85%, rgba(15,20,30,0) 100%)"></div>
  <div style="position:absolute;inset:0;background:
     radial-gradient(ellipse ${Math.round(W * .52)}px ${Math.round(H * .9)}px at 50% -14%, ${EASE.map(([a, p]) => `rgba(${rgb(acc)},${(a * .12).toFixed(4)}) ${p}%`).join(',')}),
     radial-gradient(ellipse ${Math.round(W * .62)}px ${Math.round(H * .95)}px at 50% -16%, ${EASE.map(([a, p]) => `rgba(226,232,240,${(a * .07).toFixed(4)}) ${p}%`).join(',')})"></div>
  <svg width="${W}" height="${H}" style="position:absolute;left:0;top:0"><filter id="g" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="11" stitchTiles="stitch"/>
    <feColorMatrix type="matrix" values=".33 .33 .33 0 0  .33 .33 .33 0 0  .33 .33 .33 0 0  0 0 0 0 1"/>
    <feComponentTransfer><feFuncR type="linear" slope="3.2" intercept="-1.1"/><feFuncG type="linear" slope="3.2" intercept="-1.1"/><feFuncB type="linear" slope="3.2" intercept="-1.1"/></feComponentTransfer></filter>
    <rect width="100%" height="100%" filter="url(#g)" opacity=".035"/></svg></div>`;
}

// общий скрипт страницы: знак рисуется на canvas поверх фона; все размеры — по пикселям шрифта (чернила), а не по коробке строки
const PAGE_JS = `
const INK='${INK}';
function inkBox(w,h,draw){ // рамка «чернил» (альфа > 110) того, что нарисовал draw
  const c=document.createElement('canvas'); c.width=w; c.height=h; const x=c.getContext('2d'); x.textBaseline='alphabetic'; draw(x);
  const d=x.getImageData(0,0,w,h).data; let x0=w,y0=h,x1=-1,y1=-1;
  for(let y=0;y<h;y++) for(let i=0;i<w;i++) if(d[(y*w+i)*4+3]>110){ if(i<x0)x0=i; if(i>x1)x1=i; if(y<y0)y0=y; if(y>y1)y1=y; }
  return {x0,y0,x1:x1+1,y1:y1+1,w:x1+1-x0,h:y1+1-y0,c};
}
function dotOfI(F,weight){ // точка буквы i: центр — от начала буквы и от базовой линии, диаметр
  const P=Math.ceil(F*.5), B=Math.ceil(F*1.2), w=Math.ceil(F*1.2), h=Math.ceil(F*1.6);
  const stem=inkBox(w,h,x=>{x.font=weight+' '+F+'px MV';x.fillText('ı',P,B)});
  const t=inkBox(w,stem.y0-1,x=>{x.font=weight+' '+F+'px MV';x.fillText('i',P,B)}); // всё, что выше ножки, — точка
  return {cx:(t.x0+t.x1)/2-P, cy:(t.y0+t.y1)/2-B, d:Math.max(t.w,t.h)};
}
function dot(x,cx,cy,d,acc,glow){ // круглая точка в цвете языка с тонким мягким ореолом
  x.save(); x.fillStyle=acc;
  if(glow){ x.shadowColor='rgba('+glow.rgb+','+glow.a1+')'; x.shadowBlur=glow.b1; x.beginPath(); x.arc(cx,cy,d/2,0,7); x.fill();
            x.shadowColor='rgba('+glow.rgb+','+glow.a2+')'; x.shadowBlur=glow.b2; x.beginPath(); x.arc(cx,cy,d/2,0,7); x.fill(); }
  x.shadowColor='transparent'; x.shadowBlur=0; x.beginPath(); x.arc(cx,cy,d/2,0,7); x.fill(); x.restore();
}
// знак «N.»: N (800) и круглая точка на месте точки-знака препинания; группа вписана в box×box, стоит строго по центру (cx, cy)
function markN(x,cx,cy,box,acc,rgbs,glowK){
  const F0=400, W0=900, H0=700, P=150, B=560, f='800 '+F0+'px MV';
  const n=inkBox(W0,H0,c=>{c.font=f;c.fillText('N',P,B)});
  const pb=inkBox(W0,H0,c=>{c.font=f;c.fillText('N.',P,B);c.clearRect(0,0,n.x1+2,H0)}); // точка — всё правее N
  const d0=pb.w*1.08, dcx0=(pb.x0+pb.x1)/2, dcy0=B-d0/2+F0*.004;   // круг чуть крупнее квадрата, стоит на базовой линии
  const gx0=n.x0, gx1=Math.max(n.x1,dcx0+d0/2), gy0=n.y0, gy1=B;
  const k=box/Math.max(gx1-gx0,gy1-gy0), F=F0*k;
  const ox=cx-((gx0+gx1)/2-P)*k, by=cy+(gy1-gy0)*k/2;               // начало строки и базовая линия
  x.save(); x.font='800 '+F+'px MV'; x.fillStyle=INK; x.fillText('N',ox,by); x.restore();
  const d=d0*k; dot(x,ox+(dcx0-P)*k,by+(dcy0-B)*k,d,acc,glowK?{rgb:rgbs,a1:.55,b1:d*glowK,a2:.22,b2:d*glowK*3.2}:null);
  return {F:+F.toFixed(1),dot:+d.toFixed(1),box:[Math.round(cx-(gx1-gx0)*k/2),Math.round(cy-(gy1-gy0)*k/2),Math.round((gx1-gx0)*k),Math.round((gy1-gy0)*k)]};
}
`;

function pageHTML(W, H, acc, body, noBg) {
  return `<!doctype html><meta charset=utf-8><style>${FONT_CSS}
  html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden;background:transparent}
  canvas#c{position:absolute;left:0;top:0}</style>
  ${noBg ? '' : bgHTML(W, H, acc)}<canvas id=c width=${W} height=${H}></canvas>
  <script>${PAGE_JS}
  window.__draw=async function(){
    await Promise.all(['500','700','800'].map(w=>document.fonts.load(w+' 40px MV','NıghtFabel ÜÄß ИСТОРИИ')));
    const x=document.getElementById('c').getContext('2d'); x.textBaseline='alphabetic';
    ${body}
  }</script>`;
}

// 1. аватарка 800×800: «N.» по центру, группа — 50 % стороны (поля ≥ 24 % со всех сторон: круг YouTube и TikTok ничего не срежет)
const avatarHTML = L => pageHTML(800, 800, LANG[L].acc, `window.__info=markN(x,400,400,400,'${LANG[L].acc}','${rgb(LANG[L].acc)}',.55);`);

// водяной знак 150×150: тот же «N.» на полупрозрачном тёмном скруглённом квадрате (как кнопка подписки)
const watermarkHTML = L => pageHTML(150, 150, LANG[L].acc, `
  x.fillStyle='rgba(7,9,13,.78)'; x.beginPath(); x.roundRect(0,0,150,150,30); x.fill();
  x.strokeStyle='rgba(255,255,255,.07)'; x.lineWidth=1; x.beginPath(); x.roundRect(.5,.5,149,149,29.5); x.stroke();
  window.__info=markN(x,75,75,74,'${LANG[L].acc}','${rgb(LANG[L].acc)}',.45);`, true);

// 2. шапка 2560×1440: NightFabel (700, −0.02em, точка над ı в цвете языка) · линия 48×1 цвета языка (.5) · слоган капсом (500, .22em, .58)
function bannerHTML(L) {
  const { acc, slogan } = LANG[L], W = 2560, H = 1440;
  return pageHTML(W, H, acc, `
    const F=196, cx=${W / 2}, cy=${H / 2};
    // название: «NıghtFabel» (ı без точки), чернила — ровно по центру
    const P=Math.ceil(F*.6), B=Math.ceil(F*1.25), CW=Math.ceil(F*7.2), CH=Math.ceil(F*1.8);
    const lf=c=>{c.font='700 '+F+'px MV'; c.letterSpacing=(-.02*F)+'px'; c.fontKerning='normal'};
    const lb=inkBox(CW,CH,c=>{lf(c); c.fillStyle=INK; c.fillText('NıghtFabel',P,B)});
    const ox=cx-(lb.x0+lb.x1)/2+P;
    // слоган: кегль — чтобы был чуть шире названия (×1,04), но не мельче 26 px и не шире 1400
    const SL=${JSON.stringify(slogan)};
    const sl=S=>c=>{c.font='500 '+S+'px MV'; c.letterSpacing=(.22*S)+'px'; c.fontKerning='normal'; c.fillStyle='rgba(243,244,246,.58)'; c.fillText(SL,Math.ceil(S),Math.ceil(S*1.6))};
    const s100=inkBox(Math.ceil(100*SL.length)+400,260,sl(100));
    let S=Math.max(26,Math.min(42,lb.w*1.04/s100.w*100)); if(s100.w*S/100>1400) S=1400/s100.w*100;
    const sb=inkBox(Math.ceil(S*SL.length)+4*Math.ceil(S),Math.ceil(S*2.6),sl(S));
    const capS=inkBox(Math.ceil(S*3),Math.ceil(S*2.6),c=>{c.font='500 '+S+'px MV';c.fillText('H',Math.ceil(S),Math.ceil(S*1.6))}).h;
    // вертикаль: блок [верх названия … низ заглавных слогана] — по центру; линия — под хвостом «g», с воздухом
    const asc=B-lb.y0, desc=lb.y1-B, gR=desc+Math.round(F*.17), gS=Math.round(F*.17);
    const top=-asc, bot=gR+gS+capS, by=Math.round(cy-(top+bot)/2);
    x.drawImage(lb.c,ox-P,by-B);
    const m=document.createElement('canvas').getContext('2d'); lf(m);
    const t=dotOfI(F,700), iX=ox+m.measureText('Nı').width-m.measureText('ı').width;   // где начинается «ı»
    dot(x,iX+t.cx,by+t.cy,t.d*1.04,'${acc}',{rgb:'${rgb(acc)}',a1:.6,b1:t.d*.5,a2:.22,b2:t.d*1.8});
    x.fillStyle='rgba(${rgb(acc)},.5)'; x.fillRect(cx-24,by+gR,48,1);
    const sBase=by+gR+gS+capS;                              // заглавные слогана стоят на этой линии
    x.drawImage(sb.c,Math.round(cx-(sb.x0+sb.x1)/2),Math.round(sBase-Math.ceil(S*1.6)));
    // угловые метки видоискателя: 1 px, белый .12, по углам 1420×340
    x.fillStyle='rgba(255,255,255,.12)'; const mw=1420,mh=340,a=26,X0=cx-mw/2,X1=cx+mw/2-1,Y0=cy-mh/2,Y1=cy+mh/2-1;
    for(const [px,py,sx,sy] of [[X0,Y0,1,1],[X1,Y0,-1,1],[X0,Y1,1,-1],[X1,Y1,-1,-1]]){ x.fillRect(sx>0?px:px-a+1,py,a,1); x.fillRect(px,sy>0?py:py-a+1,1,a); }
    window.__info={F,S:+S.toFixed(1),logo:[Math.round(cx-lb.w/2),by-asc,lb.w,asc+desc],slogan:[Math.round(cx-sb.w/2),sBase-capS,sb.w,capS],dot:+t.d.toFixed(1)};`);
}

(async () => {
  const b = await chromium.launch();
  const page = await b.newPage({ deviceScaleFactor: 1 });
  async function shot(html, W, H, file) {
    const f = path.join(OUT, '_' + path.basename(file, '.png') + '.html'); fs.writeFileSync(f, html);
    await page.setViewportSize({ width: W, height: H });
    await page.goto('file://' + f); await page.evaluate(() => window.__draw());
    const ok = await page.evaluate(() => [...document.fonts].filter(x => x.family === 'MV' && x.status === 'loaded').length);
    if (!ok) throw new Error('Manrope не загрузился');
    await page.screenshot({ path: path.join(OUT, file), omitBackground: true });
    const info = await page.evaluate(() => window.__info || '');
    fs.unlinkSync(f);
    console.log(file, (fs.statSync(path.join(OUT, file)).size / 1048576).toFixed(2) + ' МБ', info ? JSON.stringify(info) : '');
  }
  for (const L of Object.keys(LANG)) {
    await shot(avatarHTML(L), 800, 800, `avatar_${L}.png`);
    await shot(watermarkHTML(L), 150, 150, `watermark_${L}.png`);
    await shot(bannerHTML(L), 2560, 1440, `banner_${L}.png`);
  }

  // превью: аватарки кругом (как на YouTube) в 4 размерах, водяные знаки, шапки целиком с пунктиром мобильной зоны 1546×423
  const im = f => 'data:image/png;base64,' + fs.readFileSync(path.join(OUT, f)).toString('base64');
  const BW = 1800, k = BW / 2560;
  const prev = `<!doctype html><meta charset=utf-8><style>${FONT_CSS}
  body{margin:0;background:#15181e;color:#cfd3da;font:500 22px/1.35 MV,sans-serif;width:${BW + 120}px;padding:40px 60px 60px;box-sizing:border-box}
  h2{font:700 30px/1.2 MV;color:#F3F4F6;margin:0 0 26px;letter-spacing:-.01em} h3{font:600 21px/1.3 MV;color:#9aa1ad;margin:34px 0 12px}
  .avs{display:flex;gap:56px} .av{display:flex;align-items:flex-end;gap:18px}
  .c{border-radius:50%;background-size:cover;background-position:center;box-shadow:0 0 0 1px rgba(255,255,255,.06)}
  .lb{font:700 20px MV;color:#F3F4F6;margin-bottom:10px} .lb i{font-style:normal;font-weight:500;color:#8b93a1;margin-left:8px}
  .wm{width:150px;height:150px}
  .bn{position:relative;width:${BW}px;height:${Math.round(1440 * k)}px;background-size:cover;border-radius:6px;overflow:hidden}
  .z{position:absolute;left:${((2560 - 1546) / 2 * k).toFixed(1)}px;top:${((1440 - 423) / 2 * k).toFixed(1)}px;width:${(1546 * k).toFixed(1)}px;height:${(423 * k).toFixed(1)}px;
     box-sizing:border-box;border:2px dashed rgba(255,255,255,.5)}
  .z b{position:absolute;left:0;top:-30px;font:600 17px MV;color:rgba(255,255,255,.7);white-space:nowrap}
  </style><h2>NightFabel · YouTube и TikTok</h2>
  <h3>Аватарки в круге, как на YouTube и TikTok — 240 · 88 · 48 · 32 px</h3>
  <div class=avs>${Object.keys(LANG).map(L => `<div><div class=lb>${L}<i>${LANG[L].acc}</i></div><div class=av>
    ${[240, 88, 48, 32].map(s => `<div class=c style="width:${s}px;height:${s}px;background-image:url(${im(`avatar_${L}.png`)})"></div>`).join('')}</div></div>`).join('')}</div>
  <h3>Водяные знаки 150×150 на светлом и тёмном кадре</h3>
  <div class=avs>${Object.keys(LANG).map(L => `<div style="display:flex;gap:18px">
    <div class=wm style="background:url(${im(`watermark_${L}.png`)}),linear-gradient(135deg,#8a95a3,#e3e7ec)"></div>
    <div class=wm style="background:url(${im(`watermark_${L}.png`)}),linear-gradient(135deg,#1d2430,#3a4252)"></div></div>`).join('')}</div>
  ${Object.keys(LANG).map(L => `<h3>Шапка ${L} · 2560×1440 — пунктир: мобильная зона 1546×423, всё внутри</h3>
    <div class=bn style="background-image:url(${im(`banner_${L}.png`)})"><div class=z><b>1546×423</b></div></div>`).join('')}`;
  const pf = path.join(OUT, '_preview.html'); fs.writeFileSync(pf, prev);
  await page.setViewportSize({ width: BW + 120, height: 900 }); await page.goto('file://' + pf); await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(OUT, 'preview.png'), fullPage: true }); fs.unlinkSync(pf);
  console.log('preview.png'); await b.close();
})().catch(e => { console.error(e); process.exit(1) });
