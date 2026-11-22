  // ================= v23.1 (22.11): предметы глав 3–5 картинками для пролога (ep/v231spr.js — только для v231_spr.mjs) =================
  // Пачка Marlboro (pack3) и сигарета (cig3) — глава 3/4, айкос (iqos4) — глава 4, «Джул» (juul5) и баночка снюса (tin5) — глава 5.
  // Одноразка «манго-лёд» — как vapeBody главы 2 (ep/v191/10-b1.js), без надписи.
  setLang('ru');
  function iceVape(c, x0, y0, w, h) {   // глава 2: корпус манго, ледяной косой срез, тёмный мундштук с инеем
    const x1 = x0 + w, y1 = y0 + h, r = 46, mt = y0 - h * .2;
    poly(c, [x0 + w * .16, y0 + 2, x1 - w * .16, y0 + 2, x1 - w * .3, mt, x0 + w * .3, mt]); cel(c, x0 + w * .16, mt, w * .68, y0 - mt, '#2a2f55', { hw: .08 });
    poly(c, [x0 + w * .16, y0 + 2, x1 - w * .16, y0 + 2, x1 - w * .3, mt, x0 + w * .3, mt]); lnB(c, 4);
    c.beginPath(); c.moveTo(x0 + w * .28, mt + 4); for (let i = 0; i <= 10; i++) { const xx = lp(x0 + w * .28, x1 - w * .28, i / 10); c.lineTo(xx, mt - 6 - (10 + 8 * Math.sin(i * 1.9))) } c.lineTo(x1 - w * .28, mt + 4); c.closePath(); fill(c, '#f4fbff');
    rr(c, x0, y0, w, h, r); c.save(); c.fillStyle = B2.mango; c.fill(); c.clip();
    poly(c, [x0 - 10, y0 + h * .48, x1 + 10, y0 + h * .26, x1 + 10, y1 + 10, x0 - 10, y1 + 10]); fill(c, B2.ice2);
    for (let i = 0; i < 14; i++) ring(c, x0 + 24 + H1(i * 3.3) * (w - 48), y0 + h * (.42 + .5 * H1(i * 7.7)), 3 + H1(i) * 7, 'rgba(255,255,255,.55)', 2);
    c.fillStyle = 'rgba(20,23,51,.28)'; c.fillRect(x0 + w * .75, y0 - 4, w * .25 + 8, h + 8);
    rr(c, x0 + w * .08, y0 + h * .08, Math.max(6, w * .1), h * .8, 20); fill(c, 'rgba(255,255,255,.35)');
    c.restore(); rr(c, x0, y0, w, h, r); lnB(c, 4);
    circ(c, x0 + w / 2, y1 - h * .1, 7, '#fff6ee');
  }
  function stick(c, x, y0, y1, r) {   // стик: белая бумага, коричневый фильтр сверху
    rr(c, x - r, y0, r * 2, y1 - y0, r * .3); cel(c, x - r, y0, r * 2, y1 - y0, '#f5f1e8', { sw: .3 }); rr(c, x - r, y0, r * 2, (y1 - y0) * .4, r * .3); cel(c, x - r, y0, r * 2, (y1 - y0) * .4, '#d6a96e', { sw: .3 });
    rr(c, x - r, y0, r * 2, y1 - y0, r * .3); lnB(c, 2.5, 'rgba(20,23,51,.35)');
  }
  const SPRD = {   // [ширина, высота, рисовка в рамке (0,0)–(w,h)]
    cig: [560, 700, c => { pack3(c, 140, 150, 250, 380, { d: 96, ang: 24, shadow: false }); cig3(c, 30, 640, 470, 586, 19, { tip: '#d9a35a', tl: .24, ring: '#e8c56a' }) }],
    pod: [260, 760, c => { c.save(); c.translate(130, 700); c.scale(2.3, 2.3); juul5(c, 0, 0, 1, 0); c.restore() }],
    ice: [360, 760, c => { iceVape(c, 70, 180, 220, 540) }],
    heat: [300, 820, c => { stick(c, 150, 40, 260, 30); c.save(); c.translate(150, 520); c.rotate(-Math.PI / 2); iqos4(c, 0, 0, 560, { name: true, leds: 3 }); c.restore() }],
    tin: [640, 520, c => { tin5(c, 320, 210, 250, .55, 1, { n: 9, h: .5, shadow: false }) }],
  };
  window.SPR = { list: Object.keys(SPRD), draw(name, S = 3) { const [w, h, f] = SPRD[name], cv = mk(w * S, h * S), g = cv.getContext('2d'); g.scale(S, S); f(g); return cv.toDataURL('image/png') } };
})();
