  // ================= проба 20.11, часть 3: баночка из Blender в наших 3 тонах =================
  // Blender считает форму (нормали, материалы), цвета красим сами — proba/tin_blender.py → out/vpr-tin/c/0001.png… (RGBA 760×950, 30 к/с).
  // Здесь кадры баночки ставятся в ролик картинкой; длинная растровая тень 35° — от её же силуэта, точки мельчают к концу (как castDots).
  const TIN = [], TIN_N = 165, TIN_FPS = 30, TIN_S = 1.5, TIN_X = -81, TIN_Y = 369;
  function tinLoad() {
    if (TIN.length) return Promise.resolve();
    const ps = [];
    for (let i = 1; i <= TIN_N; i++) { const im = new Image(); TIN.push(im); ps.push(new Promise(r => { im.onload = im.onerror = r })); im.src = 'out/vpr-tin/c/' + String(i).padStart(4, '0') + '.png' }
    return Promise.all(ps);
  }
  let SHC = null, SHT = null; const DOTP = {};
  function dotPat(g, r) {   // растр: шаг 14 px, точки радиуса r (в шахматку)
    const k = Math.round(r * 4); if (!DOTP[k]) { const d = mk(14, 14), q = d.getContext('2d'); q.fillStyle = '#000'; q.beginPath(); q.arc(3.5, 3.5, r, 0, TAU); q.arc(10.5, 10.5, r, 0, TAU); q.fill(); DOTP[k] = d }
    return g.createPattern(DOTP[k], 'repeat');
  }
  function tinShadow(c, im, x, y, w, h, L) {   // тень тянется вправо-вниз: дальние полосы — мелкие точки, ближние — крупные поверх
    if (!SHC) { SHC = mk(WW, HH); SHT = mk(WW, HH) }
    const g = SHC.getContext('2d'), q = SHT.getContext('2d'), n = 6, dx = Math.cos(35 * Math.PI / 180), dy = Math.sin(35 * Math.PI / 180);
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, WW, HH);
    for (let i = n; i >= 1; i--) {
      const d = L * i / n, r = 5 * Math.pow(1 - (i - 1) / n, .8);
      q.setTransform(1, 0, 0, 1, 0, 0); q.globalCompositeOperation = 'source-over'; q.clearRect(0, 0, WW, HH); q.drawImage(im, x + dx * d, y + dy * d, w, h);
      q.globalCompositeOperation = 'source-in'; q.fillStyle = dotPat(q, r); q.fillRect(0, 0, WW, HH);
      g.drawImage(SHT, 0, 0);
    }
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha *= .55; c.drawImage(SHC, 0, 0); c.restore();
  }
  // кадры части 3: t от 0 (5,6 с)
  function tinPart(c, t) {
    bgSplit(c, B2.bg, B2.bg2, 540, 1460, -.3);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); dotsField(c, 0, 1700, WW, 220, 22, 'rgba(6,8,24,.3)', 3); c.restore();
    const im = TIN[Math.min(TIN_N - 1, Math.max(0, Math.round(t * TIN_FPS)))]; if (!im || !im.naturalWidth) return;
    const w = im.naturalWidth * TIN_S, h = im.naturalHeight * TIN_S, app = eo(at(t, 0, .35));
    c.save(); c.globalAlpha *= app;
    tinShadow(c, im, TIN_X, TIN_Y, w, h, 130);
    c.drawImage(im, TIN_X, TIN_Y, w, h);
    c.restore();
    label(c, t < 2.7 ? 'объём из Blender: камера облетает сама' : 'а цвета наши: 3 тона, как у рисованных', 540, 1560, at(t, .3, .6));
  }
