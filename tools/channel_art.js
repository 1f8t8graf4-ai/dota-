// Оформление YouTube-канала NightFabel (22.11): шапка RU / EN / DE, аватарка, водяной знак, превью «как видно на устройствах».
// Знак канала — «стебель и янтарная точка»: точка над «ı» в NightFabel и над правой ножкой «N» — то же янтарное ядро, что в прологе фильма.
// Шрифты — свои (shorts/fonts, OFL): Manrope 800 (как титул фильма), Playfair Display italic (слоган).
//   node tools/channel_art.js [папка]        → shorts/out/channel/: banner-ru|en|de.png, avatar.png, watermark.png, preview.png
// Размеры — по справке YouTube: шапка 2048×1152, всё важное в середине 1235×338 (только её видно на телефоне), до 6 МБ;
// аватарка 800×800 (обрежется в круг); водяной знак 150×150, прозрачный фон.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..'), FONTS = 'file://' + path.join(ROOT, 'shorts', 'fonts') + '/';
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'shorts', 'out', 'channel'));
fs.mkdirSync(OUT, { recursive: true });

const SLOGAN = {
  ru: 'Истории о том, что вы, кажется, знаете',
  en: 'Stories about things you think you know',
  de: 'Geschichten über Dinge, die ihr zu kennen glaubt',
};
const C = { bg: '#0b0d12', ink: '#f3efe6', sub: '#c8c1b3', amber: '#f2a33a', glow: '#ffc46a' };

const fontsCSS = ['latin', 'cyrillic'].map(s => `
  @font-face{font-family:M;font-weight:800;src:url(${FONTS}manrope-${s}-800-normal.woff2) format('woff2')}
  @font-face{font-family:M;font-weight:600;src:url(${FONTS}manrope-${s}-600-normal.woff2) format('woff2')}
  @font-face{font-family:P;font-style:italic;font-weight:400;src:url(${FONTS}playfair-${s}-400-italic.woff2) format('woff2')}`).join('');

// общие слои: луч сверху, пылинки в луче, зерно (без него на тёмном градиенте видны полосы)
const layersJS = (W, H, beamTop, beamBot, beamH, dust, seed) => `
  (function(){
    let s=${seed}; const R=()=>(s=(s*16807)%2147483647)/2147483647;
    const cv=document.getElementById('fx'), c=cv.getContext('2d'); cv.width=${W}; cv.height=${H};
    // луч: трапеция от верхнего края, мягкие края — размытием
    const cx=${W}/2, t=${beamTop}, b=${beamBot}, h=${beamH};
    c.save(); c.filter='blur(${Math.round(W / 90)}px)';
    const g=c.createLinearGradient(0,0,0,h); g.addColorStop(0,'rgba(255,236,205,.20)'); g.addColorStop(.55,'rgba(255,230,190,.07)'); g.addColorStop(1,'rgba(255,230,190,0)');
    c.fillStyle=g; c.beginPath(); c.moveTo(cx-t/2,-20); c.lineTo(cx+t/2,-20); c.lineTo(cx+b/2,h); c.lineTo(cx-b/2,h); c.closePath(); c.fill(); c.restore();
    // пылинки: гуще в луче, у его оси ярче
    for(let i=0;i<${dust};i++){
      const v=R(), y=Math.pow(R(),1.25)*h*.95, half=(t+(b-t)*y/h)/2, x=cx+(R()*2-1)*half*.92;
      const r=(R()<.07? 2.2+R()*3.2 : .7+R()*1.5)*${W / 2048}, a=(.12+.55*R())*(1-y/h*.85)*(1-Math.abs(x-cx)/half*.6);
      c.beginPath(); c.arc(x,y,r,0,Math.PI*2); c.fillStyle='rgba(255,240,215,'+a.toFixed(3)+')'; c.fill();
    }
    // зерно
    const gn=document.getElementById('gr'), q=gn.getContext('2d'); gn.width=${W}; gn.height=${H};
    const im=q.createImageData(${W},${H}), d=im.data;
    for(let i=0;i<d.length;i+=4){ const n=(R()-.5)*255; d[i]=d[i+1]=d[i+2]=128+n; d[i+3]=255 }
    q.putImageData(im,0,0);
  })();`;

function bannerHTML(lang) {
  const W = 2048, H = 1152;
  return `<!doctype html><meta charset=utf-8><style>${fontsCSS}
  html,body{margin:0;width:${W}px;height:${H}px;background:${C.bg};overflow:hidden}
  .base{position:absolute;inset:0;background:
     radial-gradient(1100px 520px at 50% 52%, #171b28 0%, #10131c 45%, rgba(11,13,18,0) 75%),
     radial-gradient(1500px 900px at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.55) 100%), ${C.bg}}
  canvas{position:absolute;inset:0}
  #gr{opacity:.045;mix-blend-mode:overlay}
  .floor{position:absolute;left:50%;top:640px;width:900px;height:140px;margin-left:-450px;border-radius:50%;
     background:radial-gradient(closest-side, rgba(242,163,58,.10), rgba(242,163,58,0))}
  .mark{position:absolute;left:0;right:0;top:${H / 2}px;transform:translateY(-50%);text-align:center}
  .w{font:800 158px/1 M, sans-serif;color:${C.ink};letter-spacing:-.012em;display:inline-block;position:relative}
  .i{position:relative;display:inline-block}
  .i:after{content:'';position:absolute;left:50%;top:-.025em;width:.19em;height:.19em;margin-left:-.095em;border-radius:50%;
     background:radial-gradient(circle at 38% 34%, #ffe0a8 0%, ${C.glow} 30%, ${C.amber} 70%, #d97a06 100%);
     box-shadow:0 0 .12em ${C.glow}, 0 0 .45em rgba(255,180,74,.75), 0 0 1.2em rgba(242,163,58,.45)}
  .s{font:italic 400 54px/1.2 P, serif;color:${C.sub};margin-top:30px;letter-spacing:.005em}
  </style>
  <div class=base></div><canvas id=fx></canvas><div class=floor></div>
  <div class=mark><div class=w>N<span class=i>ı</span>ghtFabel</div><div class=s>${SLOGAN[lang]}</div></div>
  <canvas id=gr></canvas>
  <script>${layersJS(W, H, 260, 1150, 900, 260, 20261122)}</script>`;
}

// монограмма: «N» и янтарная точка над правой ножкой — тот же приём, что точка над «ı»
function monoCSS(size) {
  return `.n{position:relative;display:inline-block;font:800 ${size}px/1 M, sans-serif;color:${C.ink};letter-spacing:0}
  .n:after{content:'';position:absolute;right:.035em;top:-.29em;width:.205em;height:.205em;border-radius:50%;
     background:radial-gradient(circle at 38% 34%, #ffe0a8 0%, ${C.glow} 30%, ${C.amber} 70%, #d97a06 100%);
     box-shadow:0 0 .1em ${C.glow}, 0 0 .38em rgba(255,180,74,.8), 0 0 1em rgba(242,163,58,.45)}`;
}

function avatarHTML() {
  const W = 800, H = 800;
  return `<!doctype html><meta charset=utf-8><style>${fontsCSS}${monoCSS(430)}
  html,body{margin:0;width:${W}px;height:${H}px;background:${C.bg};overflow:hidden}
  .base{position:absolute;inset:0;background:radial-gradient(520px 520px at 50% 56%, #1a1f2d 0%, #10131c 55%, ${C.bg} 100%)}
  canvas{position:absolute;inset:0} #gr{opacity:.05;mix-blend-mode:overlay}
  .wrap{position:absolute;left:0;right:0;top:0;bottom:0;display:flex;align-items:center;justify-content:center;padding-top:66px;box-sizing:border-box}
  </style><div class=base></div><canvas id=fx></canvas>
  <div class=wrap><div class=n>N</div></div><canvas id=gr></canvas>
  <script>${layersJS(W, H, 120, 520, 620, 70, 7)}</script>`;
}

function watermarkHTML() {   // прозрачный фон; лёгкая тень — чтобы знак читался и на светлом кадре
  return `<!doctype html><meta charset=utf-8><style>${fontsCSS}${monoCSS(92)}
  html,body{margin:0;width:150px;height:150px;background:transparent;overflow:hidden}
  .wrap{width:150px;height:150px;display:flex;align-items:center;justify-content:center;padding-top:20px;box-sizing:border-box}
  .n{text-shadow:0 2px 10px rgba(0,0,0,.55)}
  </style><div class=wrap><div class=n>N</div></div>`;
}

(async () => {
  const b = await chromium.launch();
  const page = await b.newPage({ deviceScaleFactor: 1 });
  async function shot(html, W, H, file, transparent) {
    const f = path.join(OUT, '_' + path.basename(file, '.png') + '.html'); fs.writeFileSync(f, html);
    await page.setViewportSize({ width: W, height: H });
    await page.goto('file://' + f); await page.evaluate(() => document.fonts.ready);
    const fam = await page.evaluate(() => [...document.fonts].filter(x => x.status === 'loaded').map(x => x.family + ' ' + x.weight + ' ' + x.style));
    if (!fam.some(x => x.startsWith('M '))) throw new Error('Manrope не загрузился: ' + fam.join(', '));
    await page.screenshot({ path: path.join(OUT, file), omitBackground: !!transparent });
    fs.unlinkSync(f);
    console.log(file, (fs.statSync(path.join(OUT, file)).size / 1048576).toFixed(2) + ' МБ');
  }
  for (const L of ['ru', 'en', 'de']) await shot(bannerHTML(L), 2048, 1152, `banner-${L}.png`);
  await shot(avatarHTML(), 800, 800, 'avatar.png');
  await shot(watermarkHTML(), 150, 150, 'watermark.png', true);

  // превью: ТВ (весь кадр), ПК (полоса 2048×338 по центру), телефон (1235×338), аватарка кругом
  const im = f => 'data:image/png;base64,' + fs.readFileSync(path.join(OUT, f)).toString('base64');
  const prev = `<!doctype html><meta charset=utf-8><style>${fontsCSS}
  body{margin:0;background:#1c1f26;color:#ddd;font:600 22px/1.3 M,sans-serif;width:1600px;padding:28px;box-sizing:border-box}
  h3{margin:18px 0 8px;font-size:22px;color:#aab}
  .tv{width:1544px;height:868px;background:url(${im('banner-ru.png')}) center/cover;border-radius:8px}
  .pc{width:1544px;height:${Math.round(1544 * 338 / 2048)}px;background:url(${im('banner-ru.png')}) center/2048px 1152px;background-size:1544px ${Math.round(1544 * 1152 / 2048)}px;border-radius:6px}
  .row{display:flex;gap:28px;align-items:center}
  .ph{width:600px;height:${Math.round(600 * 338 / 1235)}px;background:url(${im('banner-ru.png')}) center;background-size:${Math.round(600 * 2048 / 1235)}px ${Math.round(600 * 1152 / 1235)}px;border-radius:6px}
  .av{width:180px;height:180px;border-radius:50%;background:url(${im('avatar.png')}) center/cover}
  .av2{width:48px;height:48px;border-radius:50%;background:url(${im('avatar.png')}) center/cover}
  .wm{width:150px;height:150px;background:url(${im('watermark.png')}),linear-gradient(135deg,#7d8796,#c9ced6)}
  </style>
  <h3>Телевизор — весь кадр</h3><div class=tv></div>
  <h3>Компьютер — полоса по центру</h3><div class=pc></div>
  <h3>Телефон — середина 1235×338 · аватарка · водяной знак на светлом кадре</h3>
  <div class=row><div class=ph></div><div class=av></div><div class=av2></div><div class=wm></div></div>`;
  const pf = path.join(OUT, '_preview.html'); fs.writeFileSync(pf, prev);
  await page.setViewportSize({ width: 1600, height: 900 }); await page.goto('file://' + pf); await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(OUT, 'preview.png'), fullPage: true }); fs.unlinkSync(pf);
  console.log('preview.png'); await b.close();
})().catch(e => { console.error(e); process.exit(1) });
