  // ================= блок 4 (38,8–53,4 с): волна успокаивается → из воды столбики 2,4 % → 26,5 % (×11, выноска от края) → нырок в верх столбика:
  // в баке двухслойная волна (манго + лёд, Кола #002) → по рельсу едут 5 пакетов (Instagram #054), из ХЛАДАГЕНТ WS-23 падает кристалл →
  // пар по каналу к панели РЕЦЕПТОРЫ ГОРЛА: лист мяты поворачивается на 180° (#019) в ледяную фрезу, лёд ложится на шкалу, ЖЖЕНИЕ видно подо льдом =================
  // Кадр T (бак) лежит в столбике: точка T (x, y) = O (4300 + x·TS, 500 + (y − 1000)·TS); верх жидкости в T — y 1000.
  let T4 = null; const TS4 = 200 / 1080, BARB = { x0: 4300, x1: 4500, top: 500 }, BARA = { x0: 4060, x1: 4220 }, LVL4 = 1220;
  const KT4 = (t, x, y, z) => KH(t, 4300 + x * TS4, 500 + (y - 1000) * TS4, z / TS4);   // v19.1: бак лежит в мире H
  const BAG4 = [['АРОМАТ', B2.blue], ['ГЛИЦЕРИН', '#b3263d'], ['ХЛАДАГЕНТ WS-23', B2.ice2], ['ПГ', '#b3263d'], ['НИКОТИН', B2.blue]];
  function b4Words() {
    const w = Wd; T4 = { vsego: w('всего'), par: w('парящих'), vyr: w('выросла'), x11: w('одиннадцать'), eto: w('это'), vk: w('вкусы'), zh: w('жидкость'), sint: w('синтетический'), hol: w('холодок'), ws: w('ws-23'),
      on: w('он'), obm: w('обманывает'), rec: w('рецепторы'), gor: w('горло'), led: w('лёд'), der: w('дерёт'), nik: w('никотин', 1), end: w('помните') + .22 };
    T4.dive = T4.eto - .1; T2.fin = T4.end;
  }
  function b4Keys() {
    if (!T4) b4Words();
    return [KH(39.6, 4285, 900, 1.0), KH(T4.x11 - .05, 4300, 845, 1.02), KH(T4.x11 + .2, 4300, 845, 1.02), KH(T4.dive - .05, 4330, 800, 1.06),
      KH(T4.dive + .45, 4396, 520, 2.4), KT4(T4.dive + .95, 540, 960, 1), KT4(T4.ws - .4, 540, 930, 1.04), KT4(T4.ws + .2, 540, 920, 1.05), KT4(T4.obm - .55, 540, 880, 1.05),
      KT4(T4.rec + .55, 540, -720, 1.0), KT4(T4.led - .1, 540, -740, 1.02), KT4(T4.led + .15, 540, -740, 1.02), KT4(T4.end - .6, 540, -800, 1.06), KT4(T4.end, 540, -1080 + 60 / 13.44, 13.44)];   // v19.1: камера плавно ведёт за ледяным пузырьком вверх по трубке, без смаза
  }
  // поверхность жидкости — две волны со сдвигом фазы (задняя — манго, передняя — лёд)
  function liquid2(c, x0, x1, y, A, t, yb, tilt = 0) {
    const sf = (x, ph, a) => y + a * Math.sin((x - x0) / (x1 - x0) * TAU * 1.2 + t * 2.4 + ph) + tilt * (x - (x0 + x1) / 2);
    c.beginPath(); c.moveTo(x0, yb); for (let i = 0; i <= 40; i++) { const x = lp(x0, x1, i / 40); c.lineTo(x, sf(x, 0, A) - A * .6) } c.lineTo(x1, yb); c.closePath(); fill(c, B2.mango);
    c.beginPath(); c.moveTo(x0, yb); for (let i = 0; i <= 40; i++) { const x = lp(x0, x1, i / 40); c.lineTo(x, sf(x, 2.2, A) + A * .5) } c.lineTo(x1, yb); c.closePath(); fill(c, B2.ice2);
    c.beginPath(); for (let i = 0; i <= 40; i++) { const x = lp(x0, x1, i / 40); c.lineTo(x, sf(x, 2.2, A) + A * .5) } lnB(c, Math.max(2, A * .12), '#ffffff');
  }
  function chart4(c, t) {
    const ka = bo(at(t, T4.vsego + .3, T4.vsego + .7)), kb = at(t, T4.par, T4.x11 + .2), vb = lp(2.4, 26.5, eio(at(Math.round(t * 30) / 30, T4.vyr - .1, T4.x11 + .4)));   // цифры — по кадру, без двоения от затвора
    const kt = eo(at(t, T4.vsego - .2, T4.vsego + .4)), out = ei(at(t, T4.dive - .3, T4.dive + .1));
    if (out < 1) A(c, kt, () => { tx(c, 'ДОЛЯ ОДНОРАЗОК У ПАРЯЩИХ', 4290, 240 - 700 * out, { f: 'U', w: 800, s: 44, c: B2.cream, mw: 900 }); tx(c, 'ШКОЛЬНИКОВ США', 4290, 300 - 700 * out, { f: 'U', w: 800, s: 44, c: B2.cream }) });   // v19.1: заголовок выше плашки 26,5 %
    const ha = 70 * ka; if (ka > 0) { rr(c, BARA.x0, LVL4 - ha, 160, ha + 120, 8); cel(c, BARA.x0, LVL4 - ha, 160, ha + 120, B2.mango, { hw: .1 }); rr(c, BARA.x0, LVL4 - ha, 160, ha + 120, 8); lnB(c, 4);
      plate(c, '2019 · 2,4 %', 4140, LVL4 - ha - 60 - 400 * out, ka * (1 - out), { s: 30, bg: B2.cream, c: B2.ink }) }
    if (kb > 0) {
      const top = lp(LVL4 - 70, BARB.top, eio(at(t, T4.vyr - .1, T4.x11 + .4))) - 30 * (1 - eo(at(t, T4.par, T4.par + .5)));
      c.save(); rr(c, BARB.x0, top - 20, 200, LVL4 + 120 - top + 20, 8); c.clip(); c.fillStyle = B2.ice2; c.fillRect(BARB.x0, top - 40, 200, 2000);
      liquid2(c, BARB.x0, BARB.x1, top, 9, t, LVL4 + 200); c.fillStyle = 'rgba(20,23,51,.25)'; c.fillRect(BARB.x1 - 50, top - 40, 50, 2000); c.fillStyle = 'rgba(255,255,255,.3)'; c.fillRect(BARB.x0 + 16, top + 20, 18, 2000); c.restore();
      c.beginPath(); c.moveTo(BARB.x0, top - 20); c.lineTo(BARB.x0, LVL4 + 120); c.moveTo(BARB.x1, top - 20); c.lineTo(BARB.x1, LVL4 + 120); lnB(c, 4);
      plate(c, '2020 · ' + vb.toFixed(1).replace('.', ',') + ' %', 4400, top - 70 - 400 * out, (1 - out) * eo(at(t, T4.par, T4.par + .3)), { s: 34, bg: B2.red, c: '#fff' });
      const kx = at(t, T4.x11 - .1, T4.x11 + .02); if (kx > 0 && out < 1) { const s = lp(2.2, 1, eo(kx)); c.save(); c.translate(4160 + 600 * out, 760); c.rotate(-.1); c.scale(s, s); c.globalAlpha *= cl(kx * 3) * (1 - out);
        rr(c, -110, -70, 220, 140, 16); fill(c, B2.red); rr(c, -110, -70, 220, 140, 16); lnB(c, 5); tx(c, '×11', 0, 6, { f: 'U', w: 800, s: 92, c: '#fff' }); c.restore();
        c.save(); c.globalAlpha *= 1 - out; c.setLineDash([16, 12]); c.beginPath(); c.moveTo(4150, LVL4 - 120); c.quadraticCurveTo(4170, 620, BARB.x0 - 20, top + 30); lnB(c, 5, B2.red); c.restore() }
    }
  }
  // ---------- бак (кадр T) ----------
  function bag4(c, x, y, lab, col, t, i) {
    const sw = .09 * Math.sin(t * 2.6 + i * 1.3) * (1 - .6 * at(t, T4.ws, T4.ws + 1));
    c.save(); c.translate(x, y); c.rotate(sw); c.beginPath(); c.moveTo(0, -40); c.lineTo(0, 0); lnB(c, 6, B2.steel);
    rr(c, -80, 0, 160, 240, 34); cel(c, -80, 0, 160, 240, col, { hw: .1 }); rr(c, -80, 0, 160, 240, 34); lnB(c, 6, lit(col, .4));
    rr(c, -70, 30, 140, 120, 8); fill(c, B2.cream); rr(c, -70, 30, 140, 120, 8); lnB(c, 3, B2.ink);   // v19.1: бирка и шрифт крупнее (×1,8)
    const L2 = lab.split(' '); if (L2.length > 1) { tx(c, L2[0], 0, 70, { f: 'U', w: 800, s: 30, c: B2.ink, mw: 124 }); tx(c, L2[1], 0, 110, { f: 'U', w: 800, s: 34, c: B2.ink, mw: 124 }) }
    else tx(c, lab, 0, 90, { f: 'U', w: 800, s: 36, c: B2.ink, mw: 124 });
    rr(c, -12, 240, 24, 34, 6); fill(c, '#2d3142'); c.restore();
  }
  function tank4(c, t) {
    if (t < T4.dive - .2) return;
    // рельс и пакеты (Instagram #054): въезжают слева, качаются
    const kr = eio(at(t, T4.zh - .35, T4.zh + .6));
    if (kr > 0) { c.fillStyle = '#2c3048'; c.fillRect(-600, 120, 2300, 26); c.beginPath(); c.moveTo(-600, 120); c.lineTo(1700, 120); c.moveTo(-600, 146); c.lineTo(1700, 146); lnB(c, 3);
      BAG4.forEach(([lab, col], i) => bag4(c, 160 + i * 190 + (kr - 1) * 1400 + 1500 * ei(at(t, T4.obm + .3, T4.obm + 1.1)), 186, lab, col, t, i)) }
    // кристалл WS-23 падает из центрального пакета
    const kc = at(t, T4.ws - .25, T4.ws + .25); if (kc > 0 && t < T4.ws + .9) { const x = 540, y = 470 + 560 * ei(kc), r = t > T4.ws + .25 ? 0 : 1;
      if (r) { c.save(); c.translate(x, y); c.rotate(t * 4); poly(c, [0, -46, 40, 0, 0, 46, -40, 0]); cel(c, -40, -46, 80, 92, '#dff6ff', { hw: .2 }); poly(c, [0, -46, 40, 0, 0, 46, -40, 0]); lnB(c, 4); c.restore() }
      else { const u = t - T4.ws - .25; for (let j = 0; j < 9; j++) { const a = -Math.PI / 2 + (j - 4) * .3; drop(c, x + Math.cos(a) * 300 * u, 1000 + Math.sin(a) * 420 * u + 900 * u * u, 14, B2.ice, a + Math.PI / 2) } } }
    const kp = bo(at(t, T4.ws - .05, T4.ws + .3)); if (kp > 0) { c.save(); c.translate(540, 830); c.scale(kp, kp); rr(c, -200, -50, 400, 100, 16); fill(c, B2.ink); rr(c, -200, -50, 400, 100, 16); lnB(c, 4, B2.ice);
      tx(c, 'WS-23', -10, -8, { f: 'U', w: 800, s: 50, c: B2.ice }); tx(c, 'синтетический холодок', 0, 30, { f: 'M', w: 600, s: 22, c: B2.cream }); c.restore() }
    // иней на стенках бака после кристалла
    const kf = eo(at(t, T4.ws + .3, T4.ws + 1.3)); if (kf > 0) [[0, 1], [1080, -1]].forEach(([x, s]) => { c.beginPath(); c.moveTo(x, 1000); for (let i = 0; i <= 10; i++) c.lineTo(x + s * (30 + 26 * H1(i * 3)) * kf, 1000 + i * 80); c.lineTo(x, 1800); c.closePath(); fill(c, 'rgba(223,246,255,.85)') });
    // канал пара к панели
    const kv = at(t, T4.obm - .4, T4.obm + .2); if (kv > 0) { c.beginPath(); c.moveTo(500, 1000); c.lineTo(500, -60); c.moveTo(580, 1000); c.lineTo(580, -60); lnB(c, 5, rgba('#eef1f8', kv));
      for (let i = 0; i < 8; i++) { const u = ((t * .9 + i / 8) % 1); ring(c, 540 + Math.sin(u * 9 + i) * 10, lp(980, -40, u), 18 + 10 * Math.sin(i), rgba('#e0f2fe', .8 * kv * (1 - u)), 4) }
      const kb = eio(at(t, T4.obm - .5, T4.rec + .5)); if (kb > 0 && kb < 1) { const by = lp(980, -700, kb) + 150 * Math.sin(Math.PI * kb), bx = 540 + 8 * Math.sin(t * 7);   // ведущий пузырёк — за ним идёт камера
        circ(c, bx, by, 34, 'rgba(224,242,254,.35)'); ring(c, bx, by, 34, '#ffffff', 5); poly(c, [bx - 10, by - 14, bx + 4, by - 20, bx + 12, by - 6]); fill(c, '#ffffff') } }
    panel4(c, t);
  }
  function panel4(c, t) {
    const k = eo(at(t, T4.obm - .3, T4.obm + .3)); if (k <= 0) return;
    c.save(); c.translate(0, 300 * (1 - k));
    castDots(c, 100, -1560, 880, 1500, 120, { st: 18 });
    rr(c, 100, -1560, 880, 1500, 26); cel(c, 100, -1560, 880, 1500, '#2a2f55', { hw: .03, sw: .1 }); rr(c, 100, -1560, 880, 1500, 26); lnB(c, 5);
    tx(c, 'РЕЦЕПТОРЫ ГОРЛА', 540, -1430, { f: 'U', w: 800, s: 54, c: B2.cream, mw: 780 });
    // шкала спазма: холод → жжение; стрелка уходит в холод, когда ложится лёд
    const sx0 = 190, sx1 = 890, sy = -820; rr(c, sx0, sy - 40, sx1 - sx0, 80, 40); c.save(); c.clip();
    const g = c.createLinearGradient(sx0, 0, sx1, 0); g.addColorStop(0, B2.ice2); g.addColorStop(.5, '#f2d24b'); g.addColorStop(1, B2.red); c.fillStyle = g; c.fillRect(sx0, sy - 40, sx1 - sx0, 80);
    const ki = eo(at(t, T4.gor + .2, T4.led + .5)); if (ki > 0) { c.fillStyle = 'rgba(223,246,255,.62)'; c.fillRect(sx0, sy - 40, (sx1 - sx0) * ki, 80); for (let i = 0; i < 9; i++) if (i / 9 < ki) { c.beginPath(); c.moveTo(sx0 + i * 78, sy - 40); c.lineTo(sx0 + i * 78 + 40, sy + 40); lnB(c, 3, '#ffffff') } }
    c.restore(); rr(c, sx0, sy - 40, sx1 - sx0, 80, 40); lnB(c, 5);
    tx(c, 'СПАЗМ', 540, sy - 90, { f: 'M', w: 800, s: 30, c: '#c9cde0', ls: 4 });
    tx(c, 'ХОЛОД', sx0 + 70, sy + 84, { f: 'M', w: 800, s: 30, c: B2.ice }); tx(c, 'ЖЖЕНИЕ', sx1 - 100, sy + 84, { f: 'U', w: 800, s: 38, c: mixc('#ff8a8a', '#c9cde0', ki * .4) });
    const nv = lp(.9, .12, eio(at(t, T4.led - .2, T4.led + .5))) + .03 * Math.sin(t * 9) * (1 - ki), nx = lp(sx0 + 30, sx1 - 30, nv);
    poly(c, [nx, sy - 52, nx - 22, sy - 92, nx + 22, sy - 92]); fill(c, '#ffffff');
    // лист мяты → поворот на 180° в плоскости → ледяная фреза
    const kr = eio(at(t, T4.rec, T4.gor)), kd = eo(at(t, T4.gor - .1, T4.led - .2));
    c.save(); c.translate(lp(300, sx0 + (sx1 - sx0) * .5, kd), lp(-1150, sy - 260, kd)); c.rotate(Math.PI * kr + t * 6 * at(t, T4.gor, T4.gor + .3) * (1 - at(t, T4.end - .9, T4.end - .6)) + Math.PI * eio(at(t, T4.end - .55, T4.end - .05)));   // v19.1: снежинка поворачивается на 180° (Starbucks #019) и становится диском весов
    if (kr < .5) { c.save(); c.scale(1 - kr * 2 * .6, 1 - kr * 2 * .6); c.beginPath(); c.moveTo(0, -120); c.bezierCurveTo(90, -60, 90, 60, 0, 120); c.bezierCurveTo(-90, 60, -90, -60, 0, -120); c.closePath();
      cel(c, -90, -120, 180, 240, B2.mint, { hw: .12 }); c.beginPath(); c.moveTo(0, -110); c.lineTo(0, 110); for (let i = 1; i < 4; i++) { c.moveTo(0, -80 + i * 45); c.lineTo(50, -110 + i * 45); c.moveTo(0, -80 + i * 45); c.lineTo(-50, -110 + i * 45) } lnB(c, 4, '#2f7d5a'); c.restore() }
    else { const s = (.4 + (kr - .5) * 1.2) * .8; c.scale(s, s); const kt = eio(at(t, T4.end - 1.0, T4.end - .6)); c.beginPath(); for (let i = 0; i < 24; i++) { const a = i * TAU / 24, r = i % 2 ? lp(130, 102, kt) : lp(96, 102, kt); c.lineTo(Math.cos(a) * r, Math.sin(a) * r) } c.closePath(); cel(c, -130, -130, 260, 260, mixc('#dff6ff', B2.ice2, at(t, T4.end - .5, T4.end - .1)), { hw: .12 }); c.beginPath(); for (let i = 0; i < 24; i++) { const a = i * TAU / 24, r = i % 2 ? lp(130, 102, kt) : lp(96, 102, kt); c.lineTo(Math.cos(a) * r, Math.sin(a) * r) } c.closePath(); lnB(c, 4); circ(c, 0, 0, 40, mixc(B2.ice2, '#f5f1e8', at(t, T4.end - .5, T4.end - .1))); const kfl = 1 - at(t, T4.end - .15, T4.end - .02); if (kfl > 0) flake(c, 0, 0, 34 * kfl, '#ffffff', 4) }   // v19.1: зубья фрезы убираются — дальше ровный диск, без «голубой горы»
    c.restore();
    c.restore();
  }
