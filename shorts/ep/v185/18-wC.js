  // ================= v18.5: МИР C (≈43…64 с) — «не просто вкусы» → WS-23 → рецепторы → картридж = пачка → одноразка 13 мл → 16 картриджей =================
  // Камера ныряет в жидкость большого столбика — это бак картриджа в разрезе. Капли вкусов плавают, сверху падает кристалл WS-23,
  // жидкость леденеет, холодный пар поднимается по каналу мундштука и летит к панели «рецепторы горла» (холод — на максимум,
  // жжение — замерзает). Отъезд: картридж стоит рядом с пачкой сигарет («=»), справа вырастает одноразка (13 мл, двойная сетка,
  // 5000 затяжек), рядом сыплются 16 маленьких картриджей. В пузырь в баке одноразки камера ныряет в мир D.
  const WC = { liq: '#3fb7e3', liqI: '#b9ecfb', ink: '#1e2340', ln: '#eef2f7', plast: '#c7ccda', bg: '#262a40', red: '#e8445a', ice: '#e6f7ff', mint: '#22c55e' };
  const CD = { x: 1900, base: 1800 };   // одноразка: центр и низ
  const BUB = { x: 1900, y: -3500, r: 300 };   // пузырь в баке одноразки — окно в мир D
  let W3 = null;
  function w3Words() {
    const w = Wd; W3 = {
      eto: w('это'), prosto: w('просто', 1), vkusy: w('вкусы', 1), zhid: w('жидкость'), dob: w('добавили'), sint: w('синтетический'), hol: w('холодок'), ws: w('ws-23'),
      obm: w('обманывает'), rec: w('рецепторы'), gorlo: w('горло'), chuv: w('чувствует'), led: w('лёд'), deret: w('дерёт'), nik: w('никотин'),
      pomn: w('помните'), odin: w('один'), kart: w('картридж'), zam: w('заменял'), pach: w('пачку'), potom: w('потом', 1), odn: w('одноразки', 1), razr: w('разрослись'),
      t13: w('тринадцать'), ml: w('миллилитров'), dv: w('двойная'), set: w('сетка'), tys: w('тысячи'), zat: w('затяжек'), ponik: w('никотину'), x16: w('шестнадцать'), kart16: w('картриджей'),
    };
  }
  const frostK = t => eo(at(t, W3.sint - .05, W3.hol + .5));
  function liquidC(c, t, x0, x1, y0, y1) {   // жидкость: цвет, капли вкусов, пузырьки; после WS-23 — ледяная
    const fk = frostK(t);
    c.fillStyle = mixc(WC.liq, '#7fd3f2', fk); c.fillRect(x0, y0, x1 - x0, y1 - y0);
    c.save(); c.globalAlpha = .18; dotsRect(c, x0, y0, x1 - x0, y1 - y0, 28, 3, '#0b4f75'); c.restore();
    const drops = [['#f97316', -170, -900], ['#ec4899', 160, -420], ['#eab308', -120, 120], ['#22c55e', 190, 620], ['#a855f7', -200, 1040], ['#f97316', 150, 1300], ['#ec4899', -60, -1250], ['#eab308', 230, -1100]];
    drops.forEach(([col, x, y], i) => { const dx = x + Math.sin(t * .7 + i * 2) * 60, dy = y + Math.cos(t * .5 + i) * 50, r = 70 + 30 * H1(i * 3);
      if (dy < y0 - r || dy > y1 + r) return;
      c.beginPath(); c.ellipse(dx, dy, r * 1.1, r, Math.sin(t + i) * .3, 0, TAU); fill(c, col); c.beginPath(); c.ellipse(dx, dy, r * 1.1, r, Math.sin(t + i) * .3, 0, TAU); lnW(c, 6 + 6 * fk, mixc(WC.ink, '#ffffff', fk));
      circ(c, dx - r * .35, dy - r * .35, r * .22, 'rgba(255,255,255,.55)') });
    for (let i = 0; i < 26; i++) { const x = -320 + H1(i * 1.7) * 640, ph = (t * (.12 + H1(i) * .1) + H1(i * 9)) % 1, y = lp(1500, -1500, ph); if (y < y0 || y > y1) continue; ring(c, x + Math.sin(t * 2 + i) * 14, y, 10 + H1(i * 4) * 16, 'rgba(255,255,255,.6)', 4) }
  }
  function ws23C(c, t) {   // кристалл WS-23: падает сверху, на «холодок» — взрыв инея
    const k = W3, kd = at(t, k.zhid - .1, k.sint + .05); if (kd <= 0) return;
    const y = lp(-1750, -260, eio(kd)), rot = t * .8, kb = at(t, k.sint, k.hol + .6);
    if (kb > 0 && kb < 1) { ring(c, 0, y, 140 + 1500 * eo(kb), rgba('#ffffff', .9 * (1 - kb)), 30 * (1 - kb)); ring(c, 0, y, 80 + 1000 * eo(kb), rgba('#e0f7ff', .7 * (1 - kb)), 16 * (1 - kb)) }
    glow(c, 0, y, 380, '#e0f7ff', .35 + .25 * kb);
    c.save(); c.translate(0, y); c.rotate(rot);
    poly(c, [0, -130, 113, -65, 113, 65, 0, 130, -113, 65, -113, -65]); fill(c, '#f4fbff'); poly(c, [0, -130, 113, -65, 113, 65, 0, 130, -113, 65, -113, -65]); lnW(c, 8, '#2b6cb0');
    for (let i = 0; i < 3; i++) { c.rotate(Math.PI / 3); c.beginPath(); c.moveTo(-80, 0); c.lineTo(80, 0); lnW(c, 7, '#60a5fa') }
    circ(c, 0, 0, 22, '#2b6cb0'); c.restore();
    const kl = spr(at(t, k.ws - .1, k.ws + .4)); if (kl > 0) plate(c, 'WS-23', 0, y + 240, kl, { s: 54, bg: '#2b6cb0', c: '#fff' });
    const ks = eo(at(t, k.sint, k.hol + .2)); if (ks > 0) plate(c, 'СИНТЕТИЧЕСКИЙ ХОЛОДОК', 0, y - 250, ks, { s: 40, bg: '#f4fbff', c: '#1e3a8a' });
  }
  function frostWalls(c, t, x0, x1, y0, y1) {   // иней растёт по стенкам бака
    const fk = frostK(t); if (fk <= 0) return;
    for (let i = 0; i < 18; i++) { const y = y0 + (i + .5) * (y1 - y0) / 18, L = (60 + 80 * H1(i * 5)) * fk;
      [x0, x1].forEach((x, s) => { const d = s ? -1 : 1; poly(c, [x, y - 40, x + d * L, y, x, y + 40]); fill(c, rgba('#f4fbff', .9)) }) }
  }
  function podC(c, t, cut) {   // большой картридж «Джула» в разрезе (бак — жидкость, канал мундштука)
    const I = WC.ink;
    c.beginPath(); c.roundRect(-450 + 40, -1700 + 50, 900, 3560, 60); fill(c, 'rgba(8,10,24,.35)');
    c.beginPath(); c.roundRect(-330, -2520, 660, 900, [140, 140, 20, 20]); fill(c, '#f97316'); lnW(c, 10, I);   // мундштук
    c.beginPath(); c.rect(-110, -2525, 220, 980); fill(c, '#33395c'); c.beginPath(); c.moveTo(-110, -2525); c.lineTo(-110, -1550); c.moveTo(110, -2525); c.lineTo(110, -1550); lnW(c, 8, I);
    c.beginPath(); c.roundRect(-450, -1700, 900, 3560, 60); c.moveTo(-350, -1550); c.roundRect(-350, -1550, 700, 3100, 20); fill(c, WC.plast);   // стенки с окном бака
    c.beginPath(); c.roundRect(-450, -1700, 900, 3560, 60); lnW(c, 10, I); c.beginPath(); c.roundRect(-350, -1550, 700, 3100, 20); lnW(c, 8, I);
    [-180, 0, 180].forEach(x => circ(c, x, 1800, 26, '#eab308'));
  }
  function panelC(c, t) {   // панель «рецепторы горла»: холод — на максимум, жжение — замерзает
    const k = W3, ka = bo(at(t, k.rec - .3, k.rec + .25)), kg = ei(at(t, k.razr - 1.2, k.razr - .5)); if (ka <= 0 || kg >= 1) return;
    c.save(); c.translate(1160 + 2600 * kg, -2300 - 1400 * kg); c.scale(ka, ka); c.rotate(-.03);
    c.beginPath(); c.roundRect(-420 + 24, -330 + 30, 840, 660, 40); fill(c, 'rgba(8,10,24,.4)');
    c.beginPath(); c.roundRect(-420, -330, 840, 660, 40); fill(c, '#1b2138'); lnW(c, 8, WC.ln);
    tx(c, 'РЕЦЕПТОРЫ ГОРЛА', 0, -250, { f: 'U', w: 800, s: 44, c: '#fff' });
    const cold = eio(at(t, k.chuv - .2, k.led + .2)), burn = .55 - .5 * eio(at(t, k.deret - .2, k.nik + .2)) + .04 * Math.sin(t * 9) * (1 - at(t, k.deret, k.nik));
    const dial = (x, lab, col, v, frozen) => {
      c.beginPath(); c.arc(x, 40, 160, Math.PI, 0); lnW(c, 26, '#33395c'); c.beginPath(); c.arc(x, 40, 160, Math.PI, Math.PI + Math.PI * v); lnW(c, 26, col);
      const a = Math.PI + Math.PI * v; c.beginPath(); c.moveTo(x, 40); c.lineTo(x + Math.cos(a) * 130, 40 + Math.sin(a) * 130); lnW(c, 10, '#fff'); circ(c, x, 40, 20, '#fff');
      tx(c, lab, x, 130, { f: 'U', w: 800, s: 38, c: col });
      if (frozen > 0) { A(c, frozen, () => { c.save(); c.beginPath(); c.arc(x, 40, 200, Math.PI, 0); c.lineTo(x + 200, 170); c.lineTo(x - 200, 170); c.closePath(); c.clip();
        c.fillStyle = 'rgba(224,247,255,.55)'; c.fillRect(x - 210, -170, 420, 350); for (let i = 0; i < 9; i++) { const fx = x - 180 + i * 45; poly(c, [fx, 170, fx + 22, 170 - 60 - 50 * H1(i), fx + 44, 170]); fill(c, '#f4fbff') } c.restore() }) }
    };
    dial(-200, 'ХОЛОД', '#60a5fa', .12 + .86 * cold, 0);
    dial(200, 'ЖЖЕНИЕ', WC.red, cl(burn), at(t, k.deret, k.nik + .3));
    const kl = spr(at(t, k.led - .1, k.led + .4)); if (kl > 0) plate(c, 'ЛЁД', -200, -110, kl, { s: 46, bg: '#60a5fa', c: '#fff' });
    const kn = spr(at(t, k.nik - .05, k.nik + .45)); if (kn > 0) plate(c, 'НЕ ЧУВСТВУЕТ', 200, -110, kn, { s: 30, bg: WC.red, c: '#fff' });
    c.restore();
  }
  function vaporC(c, t) {   // холодный пар: из бака по каналу вверх, из мундштука — к панели; красные «колючки» никотина
    const k = W3, t0 = k.obm - .4; if (t < t0) return;
    for (let i = 0; i < 34; i++) {
      const age = (t - t0) * .42 - i / 34; if (age < 0) continue; const ph = age % 1, red = i % 4 === 0;
      let x, y; if (ph < .45) { const q = ph / .45; x = Math.sin(i * 3 + q * 9) * 60; y = lp(-1500, -2560, q) } else { const q = (ph - .45) / .55; x = lp(0, 1000, eo(q)) + Math.sin(i + q * 7) * 50; y = lp(-2560, -2330, q) - Math.sin(Math.PI * q) * 260 + (H1(i) - .5) * 120 }
      const r = 30 + 26 * H1(i * 2), a = ph > .92 ? (1 - ph) / .08 : 1;
      if (red) A(c, a, () => { c.save(); c.translate(x, y); c.rotate(t * 2 + i); poly(c, [0, -r, r * .3, -r * .3, r, 0, r * .3, r * .3, 0, r, -r * .3, r * .3, -r, 0, -r * .3, -r * .3]); fill(c, WC.red); c.restore() });
      else { ring(c, x, y, r, rgba('#e0f7ff', .85 * a), 7); circ(c, x, y, r * .6, rgba('#e0f7ff', .25 * a)) }
    }
  }
  function packC(c, t) {   // пачка сигарет слева и «=»
    const k = W3, ka = bo(at(t, k.zam - .35, k.zam + .2)); if (ka <= 0) return;
    c.save(); c.translate(-1650, CD.base); c.scale(ka, ka);
    c.beginPath(); c.rect(-650 + 40, -2000 + 50, 1300, 2000); fill(c, 'rgba(8,10,24,.35)');
    c.beginPath(); c.rect(-650, -2000, 1300, 2000); fill(c, '#f4efe4'); lnW(c, 10, WC.ink);
    c.beginPath(); c.rect(-650, -2000, 1300, 620); fill(c, WC.red); lnW(c, 10, WC.ink); c.beginPath(); c.moveTo(-650, -1600); c.lineTo(650, -1600); lnW(c, 6, '#9b1c2e');
    for (let i = 0; i < 6; i++) { c.beginPath(); c.roundRect(-560 + i * 190, -2200, 150, 240, [60, 60, 0, 0]); fill(c, '#f4efe4'); lnW(c, 8, WC.ink); c.fillStyle = '#d6a06a'; c.fillRect(-560 + i * 190, -2200 + 160, 150, 80) }
    c.beginPath(); c.rect(-650, -2000, 1300, 2000); lnW(c, 10, WC.ink);
    tx(c, 'СИГАРЕТЫ', 0, -980, { f: 'U', w: 800, s: 120, c: WC.ink }); tx(c, '20 ШТ.', 0, -800, { f: 'M', w: 800, s: 90, c: '#7b8098' });
    c.restore();
    const ke = spr(at(t, k.zam, k.pach + .1)); if (ke > 0) { c.save(); c.translate(-830, 400); c.scale(ke, ke); c.fillStyle = '#fff'; c.fillRect(-160, -90, 320, 60); c.fillRect(-160, 30, 320, 60); c.restore() }
    const kl = eo(at(t, k.pach - .2, k.pach + .3)); if (kl > 0) { tx(c, '1 ПАЧКА', -1650, CD.base + 220, { f: 'U', w: 800, s: 110, c: '#fff', a: kl }); tx(c, '1 КАРТРИДЖ', 0, CD.base + 220, { f: 'U', w: 800, s: 110, c: '#fff', a: kl }) }
  }
  function dispC(c, t) {   // одноразка: вырастает, окно бака 13 мл, разрез с двойной сеткой, счётчик затяжек, пузырь-окно в мир D
    const k = W3, kg = bo(at(t, k.odn - .2, k.razr + .45)); if (kg <= 0) return;
    const gw = lp(900, 1700, eo(at(t, k.razr - .1, k.razr + .7))), gh = lp(3400, 8000, eo(at(t, k.razr - .1, k.razr + .7))), x = CD.x, b = CD.base, top = b - gh * kg, w = gw * kg;
    const I = WC.ink;
    c.beginPath(); c.roundRect(x - w / 2 + 50, top + 60, w, gh * kg, 160 * kg); fill(c, 'rgba(8,10,24,.35)');
    c.beginPath(); c.roundRect(x - w / 2, top, w, gh * kg, 160 * kg); fill(c, '#3b5d9a'); lnW(c, 12, I);
    c.save(); c.beginPath(); c.roundRect(x - w / 2, top, w, gh * kg, 160 * kg); c.clip(); c.fillStyle = '#2c4a80'; c.fillRect(x + w * .22, top, w * .3, gh * kg); dotsRect(c, x + w * .22, top, w * .3, gh * kg, 40, 5, 'rgba(8,10,24,.25)'); c.restore();
    c.beginPath(); c.roundRect(x - w * .3, top - 700 * kg, w * .6, 760 * kg, [200 * kg, 200 * kg, 10, 10]); fill(c, '#1e2340'); lnW(c, 12, I);
    // окно бака
    const wx0 = x - w * .32, wx1 = x + w * .32, wy0 = top + gh * kg * .12, wy1 = top + gh * kg * .55, lv = lp(.2, .86, eio(at(t, k.t13 - .2, k.ml + .2)));
    c.beginPath(); c.roundRect(wx0, wy0, wx1 - wx0, wy1 - wy0, 40); fill(c, '#1b2138');
    c.save(); c.beginPath(); c.roundRect(wx0, wy0, wx1 - wx0, wy1 - wy0, 40); c.clip(); const ly = wy1 - (wy1 - wy0) * lv;
    c.fillStyle = mixc(WC.liq, '#7fd3f2', frostK(t)); c.fillRect(wx0, ly, wx1 - wx0, wy1 - ly);
    c.beginPath(); for (let xx = wx0; xx <= wx1; xx += 20) c.lineTo(xx, ly + 14 * Math.sin(xx / 60 + t * 4)); lnW(c, 10, '#e0f7ff');
    for (let i = 0; i < 12; i++) { const ph = (t * .2 + H1(i * 5)) % 1; ring(c, lp(wx0 + 60, wx1 - 60, H1(i * 2)), lp(wy1 - 40, ly + 40, ph), 16 + 10 * H1(i), 'rgba(255,255,255,.5)', 5) }
    bubbleC(c, t); c.restore();
    c.beginPath(); c.roundRect(wx0, wy0, wx1 - wx0, wy1 - wy0, 40); lnW(c, 12, WC.ln);
    const km = spr(at(t, k.t13 - .1, k.ml + .3)); if (km > 0) plate(c, '13 МЛ', x, wy0 - 200 * kg, km * kg, { s: 260, bg: '#fff', c: I });
    // разрез: двойная сетка
    const kx = eio(at(t, k.dv - .3, k.dv + .25)); if (kx > 0) {
      const cy0 = top + gh * kg * .67, cy1 = b - 300 * kg, cw = w * .78 * kx;
      c.beginPath(); c.roundRect(x - cw / 2, cy0, cw, cy1 - cy0, 40); fill(c, '#14182c'); c.beginPath(); c.roundRect(x - cw / 2, cy0, cw, cy1 - cy0, 40); lnW(c, 10, WC.ln);
      c.save(); c.beginPath(); c.roundRect(x - cw / 2, cy0, cw, cy1 - cy0, 40); c.clip();
      const hot = .5 + .5 * Math.sin(t * 6);
      [-.22, .22].forEach((dx, i) => { const mx = x + dx * w, my = cy0 + (cy1 - cy0) * .42, mr = w * .2, ks = spr(at(t, k.set - .25 + i * .12, k.set + .2 + i * .12)); if (ks <= 0) return;
        c.save(); c.translate(mx, my); c.scale(ks, ks); glow(c, 0, 0, mr * 2.2, '#fb923c', .45 + .25 * hot); c.beginPath(); c.roundRect(-mr, -mr * 1.5, mr * 2, mr * 3, 30); fill(c, '#3f3f46');
        c.save(); c.beginPath(); c.roundRect(-mr, -mr * 1.5, mr * 2, mr * 3, 30); c.clip(); for (let j = -8; j <= 8; j++) { c.beginPath(); c.moveTo(-mr * 2, j * 40 - mr); c.lineTo(mr * 2, j * 40 + mr); c.moveTo(-mr * 2, j * 40 + mr); c.lineTo(mr * 2, j * 40 - mr); lnW(c, 12, mixc('#fdba74', '#f97316', hot)) } c.restore();
        c.beginPath(); c.roundRect(-mr, -mr * 1.5, mr * 2, mr * 3, 30); lnW(c, 10, WC.ln); c.restore() });
      c.restore();
      const kl = spr(at(t, k.set - .1, k.set + .4)); if (kl > 0) plate(c, 'ДВОЙНАЯ СЕТКА', x, cy0 - 110, kl, { s: 100, bg: '#fb923c', c: '#fff' });
    }
    // счётчик затяжек
    const kc = eo(at(t, k.tys - .3, k.zat + .2)); if (kc > 0) {
      const dy = top + gh * kg * .58, n = Math.round(5000 * eo(at(t, k.tys - .1, k.zat + .5)) / 10) * 10;
      c.save(); c.translate(x, dy); c.scale(kc, kc); c.beginPath(); c.roundRect(-520, -150, 1040, 300, 40); fill(c, '#0b1020'); lnW(c, 10, WC.ln);
      num(c, String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '), -60, 0, { f: 'J', w: 700, s: 190, c: '#7ee787' }); tx(c, 'ЗАТЯЖЕК', 380, 0, { f: 'U', w: 800, s: 54, c: '#7ee787', mw: 220 }); c.restore();
    }
  }
  function bubbleC(c, t) {   // большой пузырь в баке одноразки: в нём уже видна колба мира D
    const k = W3, kb = eo(at(t, k.x16 - .3, k.kart16 + .3)); if (kb <= 0) return;
    const r = BUB.r * kb, by = BUB.y;
    c.save(); c.beginPath(); c.arc(BUB.x, by, r, 0, TAU); c.clip();
    const n = NEST.D; c.save(); c.translate(n.ox, n.oy); c.scale(n.s, n.s); drawD(c, t, { x0: -650, x1: 650, y0: -650, y1: 650 }); c.restore(); c.restore();
    ring(c, BUB.x, by, r, '#e0f7ff', 12); c.beginPath(); c.arc(BUB.x, by, r * .82, Math.PI * 1.15, Math.PI * 1.45); lnW(c, 14, 'rgba(255,255,255,.7)');
  }
  function pods16C(c, t) {   // 16 маленьких картриджей вылетают из большого и встают сеткой 4×4 справа от одноразки
    const k = W3; if (t < k.ponik - .3) return;
    for (let i = 0; i < 16; i++) { const r = Math.floor(i / 4), q = i % 4, tx0 = k.ponik - .2 + i * .07, e = at(t, tx0, tx0 + .55); if (e <= 0) continue;
      const gx = 3200 + q * 360, gy = -1700 + r * 1080, sx = 0, sy = -400, ee = eio(e);
      const x = lp(sx, gx, ee), y = lp(sy, gy, ee) - Math.sin(Math.PI * ee) * 900, s = lp(1, .34, ee);
      c.save(); c.translate(x, y); c.scale(s, s); c.rotate((1 - ee) * (q - 1.5) * .4);
      c.beginPath(); c.roundRect(-330, -1100, 660, 900, [140, 140, 20, 20]); fill(c, '#f97316'); lnW(c, 18, WC.ink);
      c.beginPath(); c.roundRect(-450, -300, 900, 2100, 60); fill(c, WC.plast); lnW(c, 18, WC.ink); c.beginPath(); c.roundRect(-330, -150, 660, 1500, 20); fill(c, WC.liq); lnW(c, 14, WC.ink);
      c.restore(); }
    const kl = spr(at(t, k.kart16 - .2, k.kart16 + .3)); if (kl > 0) plate(c, '= 16 КАРТРИДЖЕЙ', 3740, -2500, kl, { s: 130, bg: WC.red, c: '#fff' });
  }
  function drawC(c, t, v, top) {   // мир C в своих координатах; top — уровень жидкости, если смотрим снаружи (из столбика мира B)
    if (!W3) w3Words();
    const r = v || { x0: -360, x1: 360, y0: top ?? -1560, y1: 1560 };
    if (v) { c.fillStyle = WC.bg; c.fillRect(r.x0 - 20, r.y0 - 20, r.x1 - r.x0 + 40, r.y1 - r.y0 + 40); for (let i = 0; i < 60; i++) circ(c, -4000 + H1(i * 2.2) * 9000, -7000 + H1(i * 3.9) * 9500, 8 + H1(i) * 8, 'rgba(238,242,247,.18)') }
    if (v) { packC(c, t); podC(c, t) }
    c.save(); c.beginPath(); c.rect(-350, -1550, 700, 3100); c.clip(); liquidC(c, t, -350, 350, Math.max(-1550, r.y0), Math.min(1550, r.y1)); frostWalls(c, t, -350, 350, -1550, 1550); ws23C(c, t); c.restore();
    if (v) { vaporC(c, t); panelC(c, t); dispC(c, t); pods16C(c, t) }
  }
  function shotC(c, t) {
    const cm = camIn('C', camW(t)), cm2 = camIn('C', camW(t + 1 / 30)), v = viewRect(cm);
    c.fillStyle = WC.bg; c.fillRect(0, 0, WW, HH);
    layer(c, cm, 1, c => drawC(c, t, v));
    speedLoc(c, cm, cm2, t);
  }
