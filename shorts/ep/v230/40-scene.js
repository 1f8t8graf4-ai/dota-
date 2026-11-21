  // ================= сцена пролога: один мир, одна камера (нырок в корпус = кадр главы 1) =================
  const CORE_R = 30, BEAT = .95;
  function beatAt(t) {   // «тук-тук» ядра раз в 0,95 с — с последнего слова титула
    if (t < K.beat0 - .02) return 0;
    const u = (t - K.beat0) / BEAT, ph = (u - Math.floor(u)) * BEAT, q = ph - .19;
    const b1 = ph < .045 ? ph / .045 : Math.exp(-(ph - .045) / .11), b2 = q < 0 ? 0 : q < .045 ? .55 * q / .045 : .55 * Math.exp(-(q - .045) / .12);
    return Math.max(b1, b2);
  }
  function beats() { const o = []; for (let tb = K.beat0; tb < K.pour[0]; tb += BEAT) o.push(tb); return o }
  function coreDraw(c, x, y, r, hb, fl) {   // янтарное ядро никотина: 3 тона, свечение — на сцене
    if (r <= .4) return;
    const R = r * (1 + .12 * hb + .3 * fl);
    glow(c, x, y, R * (5 + 1.6 * hb + 5 * fl), '#f2a33a', Math.min(.9, .24 + .16 * hb + .5 * fl));
    glow(c, x, y, R * 2.1, '#ffc46a', Math.min(1, .5 + .25 * hb + .3 * fl));
    circ(c, x, y, R, '#f2a33a');
    c.save(); c.beginPath(); c.arc(x, y, R, 0, TAU); c.clip(); circ(c, x + R * .62, y + R * .25, R * .95, '#d97a06'); circ(c, x - R * .34, y - R * .36, R * .3, 'rgba(255,241,206,.9)'); c.restore();
    ring(c, x, y, R, 'rgba(255,227,174,.85)', 2.4);
  }
  const DUST = [...Array(28)].map((_, i) => ({ x: 340 + 400 * H1(i * 3.7), y: 1400 * H1(i * 5.3), s: .7 + 1.5 * H1(i * 7.1), v: 7 + 13 * H1(i * 2.9), ph: H1(i * 9.3) * TAU }));
  function stage(c, t, lit) {   // тёмная сцена, конус света сверху, пылинки в луче (частицы — только там, где их видно в свете)
    c.fillStyle = '#0B0D12'; c.fillRect(-3000, -3000, 7080, 7920);
    const g = c.createRadialGradient(540, 1010, 60, 540, 1010, 900); g.addColorStop(0, `rgba(242,163,58,${.07 + .05 * lit})`); g.addColorStop(1, 'rgba(242,163,58,0)'); c.fillStyle = g; c.fillRect(-360, 110, 1800, 1800);   // ядро подсвечивает сцену
    const sw = .022 * Math.sin(TAU * t / 7.3) + .008 * Math.sin(TAU * t / 3.1);   // луч чуть качается — сцена не стоит
    c.save(); c.translate(540, -170); c.rotate(sw); c.translate(-540, 170);
    beam(c, 540, -170, 540, 1660, 58, 540, '#fff1dc', .075 + .03 * lit);
    beam(c, 540, -170, 540, 1300, 26, 250, '#fff1dc', .06 + .02 * lit);
    c.restore();
    for (const d of DUST) {
      const yy = (((d.y - d.v * t) % 1500) + 1500) % 1500 + 40, xx = d.x + Math.sin(t * .6 + d.ph) * 12, half = 58 + (yy + 170) * .264, k = 1 - Math.abs(xx - 540) / half;
      if (k > 0) circ(c, xx, yy, d.s * 1.7, `rgba(255,236,206,${.32 * k * (.55 + .45 * Math.sin(t * 2.1 + d.ph))})`);
    }
  }
  function title(c, t) {   // титул как в финале: Manrope 800, 82 px, y 360 / 464 — слова встают по голосу
    const L = TITLE_L[LANG] || TITLE_L.ru, out = at(t, K.s2 - .12, K.s2 + .3); if (out >= 1) return;
    const o = { f: 'M', w: 800, s: 82, ls: 2 }; let wi = 0;
    L.forEach((ws, li) => {
      const line = ws.join(' '), W0 = tw(c, line, o), oo = { ...o, s: W0 > 980 ? o.s * 980 / W0 : o.s }, W = tw(c, line, oo), x0 = 540 - W / 2, y = 360 + li * 104 - 26 * eio(out);
      ws.forEach((w, j) => {
        const ta = K.tw[Math.min(wi++, K.tw.length - 1)], k = eo(at(t, ta - .06, ta + .2)); if (k <= 0) return;
        const x = x0 + (j ? tw(c, ws.slice(0, j).join(' ') + ' ', oo) + oo.ls : 0);
        tx(c, w, x, y + 14 * (1 - k), { ...oo, al: 'left', c: '#F4F1EA', a: k * (1 - out) });
      });
    });
  }
  function counter(c, t) {   // пять точек: сколько раз сменилась форма (без цифр и лет)
    const t0 = K.form[0] - .12; if (t < t0) return;
    for (let i = 0; i < 5; i++) {
      const x = 540 + (i - 2) * 58, ap = spr(at(t, t0 + i * .05, t0 + i * .05 + .42)); if (ap <= 0) continue;
      const ft = t - (K.crack + .12 + i * .045), fy = ft > 0 ? 2500 * ft * ft - 70 * ft : 0; if (fy > 900) continue;
      const y = 1505 + fy, on = at(t, K.form[i] + .2, K.form[i] + .36), pg = t - (K.form[i] + .2);
      ring(c, x, y, 10 * ap, 'rgba(238,241,248,.45)', 2.5);
      if (on > 0) { glow(c, x, y, 36, '#f2a33a', .5 * on); circ(c, x, y, 10 * spr(on), '#f2a33a') }
      if (pg > 0 && pg < .5) ring(c, x, y, 10 + 32 * eo(pg / .5), `rgba(242,163,58,${.6 * (1 - pg / .5)})`, 2);
    }
  }
  // ---------- оболочки ----------
  function shellState(t) {
    const T = K.form; if (t < T[0] - .1) return null;
    let i = 0; while (i < 4 && t >= T[i + 1] - .05) i++;
    if (i === 0) return { pts: SH.cig, a: 'cig', b: 'cig', k: 1, build: at(t, T[0] - .1, T[0] + .5) };
    const k = eio(at(t, T[i] - .05, T[i] + .37)), a = FORMS[i - 1], b = FORMS[i];
    return { pts: k >= 1 ? SH[b] : morphF(a + b, SH[a], SH[b])(k), a, b, k, build: 1 };
  }
  function corePos(t) {   // где ядро: в своей оболочке, после трещины — снова в центре
    const S = shellState(t); let p = [0, 0];
    if (S) { const A = FCORE[S.a], B = FCORE[S.b]; p = [lp(A[0], B[0], S.k), lp(A[1], B[1], S.k) * eo(S.build)] }
    const back = eio(at(t, K.crack + .1, K.flare + .25)); return [p[0] * (1 - back), p[1] * (1 - back)];
  }
  function skinAt(t) { const F = K.face; let s = -1; for (let i = 0; i < 3; i++) if (t >= F[i] - .06) s = i; return s < 0 ? null : { s, w: eo(at(t, F[s] - .06, F[s] + .16)) } }
  const canSide = c => { c.beginPath(); c.moveTo(-220, -70); c.lineTo(220, -70); c.lineTo(220, 90); c.ellipse(0, 90, 220, 64, 0, 0, Math.PI); c.closePath() };
  const canLid = c => { c.beginPath(); c.ellipse(0, -70, 220, 64, 0, 0, TAU) };
  function spark(c, x, y, r, a) { if (a <= 0) return; c.save(); c.globalAlpha *= a; c.beginPath(); for (let i = 0; i < 8; i++) { const an = i * Math.PI / 4, rr2 = i % 2 ? r * .22 : r; c.lineTo(x + Math.cos(an) * rr2, y + Math.sin(an) * rr2) } c.closePath(); fill(c, '#ffffff'); c.restore() }
  function canSkin(c, s, t) {   // три «лица» оболочки: упаковка (красно-белая), вкус (манго и мята), обещания (холодное «чистое»)
    if (s === 0) { canSide(c); fill(c, '#f6f2ea'); c.save(); canSide(c); c.clip(); c.fillStyle = '#d6334d'; c.fillRect(-240, 0, 480, 46); c.fillStyle = '#b8283e'; c.fillRect(-240, 46, 480, 8); c.restore(); canLid(c); fill(c, '#d6334d'); c.save(); canLid(c); c.clip(); c.beginPath(); c.ellipse(0, -70, 150, 40, 0, 0, TAU); c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 6; c.stroke(); c.restore() }
    else if (s === 1) { canSide(c); fill(c, '#5ed39b'); c.save(); canSide(c); c.clip(); poly(c, [-240, -80, 60, -80, -120, 170, -240, 170]); fill(c, '#f6a03a'); c.restore(); canLid(c); fill(c, '#f6a03a'); c.save(); canLid(c); c.clip(); poly(c, [40, -150, 240, -150, 240, 0, -60, 0]); fill(c, '#5ed39b'); c.restore() }
    else { canSide(c); const g = c.createLinearGradient(0, -70, 0, 160); g.addColorStop(0, '#f2fafd'); g.addColorStop(1, '#a8daee'); c.fillStyle = g; c.fill(); canLid(c); fill(c, '#f7fcfe');
      [[-120, 10, 26, 0], [96, 48, 20, 1.3], [138, -86, 16, 2.1], [-60, -88, 12, 2.9]].forEach(([x, y, r, ph]) => spark(c, x, y, r, .5 + .5 * Math.sin(t * 7 + ph))) }
  }
  function canOpaque(c, t, S) {   // непрозрачная банка (после первого «лица»): слои «лиц» сменяются шторкой слева направо
    const sk = skinAt(t); if (!sk) return 0;
    if (sk.s > 0) canSkin(c, sk.s - 1, t);
    c.save(); if (sk.w < 1) { c.beginPath(); c.rect(-260, -200, 520 * sk.w, 420); c.clip() } canSkin(c, sk.s, t); c.restore();
    return sk.s === 0 ? sk.w : 1;
  }
  const CRACK = [[0, -140], [14, -86], [-9, -34], [13, 18], [-7, 72], [8, 162]];
  function halfClip(c, sd) { c.beginPath(); c.moveTo(0, -420); CRACK.forEach(p => c.lineTo(p[0], p[1])); c.lineTo(8, 420); c.lineTo(sd * 700, 420); c.lineTo(sd * 700, -420); c.closePath() }
  function floatT(c, t) {   // оболочка с ядром парит в луче: чуть вверх-вниз и наклон; к росту корпуса затихает (ядро встаёт ровно в капсулу)
    const a = 1 - at(t, K.flare + .3, K.grow - .12); if (a <= 0) return;
    c.translate(0, a * (9 * Math.sin(TAU * t / 3.3) + 3 * Math.sin(TAU * t / 1.7 + 1))); c.rotate(a * .028 * Math.sin(TAU * t / 4.4 + 1));
  }
  function shells(c, t, hb, fl, withCore) {   // оболочка + ядро внутри (координаты оболочки: ядро — (0, 0) мира 540, 980)
    const S = shellState(t), [cx, cy] = corePos(t), tf = t - (K.crack + .14);
    const core = () => { if (withCore) coreDraw(c, cx, cy, CORE_R * (1 - .3 * eo(at(t, K.grow - .05, K.grow + .2))), hb, fl) };
    if (!S || tf > 1.3) { core(); return }
    const tint = mixc(FTINT[S.a], FTINT[S.b], S.k), opq = S.b === 'can' && S.k >= 1 ? 1 : 0;
    const whole = (sh = true) => {   // целая банка/оболочка, с «лицом», если оно уже есть
      if (opq) { const w = canOpaque(c, t, S); shellFront(c, S.pts, '#eef4f7', w, 1); return w }
      shellFront(c, S.pts, tint, 0, S.build); return 0;
    };
    if (tf < 0) {   // до трещины: задняя заливка, ядро, передняя «стеклянная» часть
      const b = S.build, sk = skinAt(t), op = sk ? (sk.s === 0 ? sk.w : 1) : 0;
      shellBack(c, S.pts, tint, .17 * b * (1 - op));
      core();
      if (op <= 0) shDetail(c, S.a, 1 - eio(at(S.k, 0, .5))), shDetail(c, S.b, S.a === S.b ? eo(b) : eio(at(S.k, .5, 1)));
      if (b < 1) { c.save(); shPath(c, S.pts); c.setLineDash([1500 * b, 3000]); lnB(c, 4, 'rgba(238,241,248,.92)'); c.restore(); if (b > .3) shellFront(c, S.pts, tint, 0, at(b, .3, 1)) }
      else whole();
      const kc = at(t, K.crack - .02, K.crack + .1); if (kc > 0) { c.save(); c.beginPath(); CRACK.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.setLineDash([340 * kc, 600]); lnB(c, 5, '#ffffff'); c.restore() }
      return;
    }
    core();
    for (const sd of [-1, 1]) {   // половинки падают (сила тяжести), поворачиваясь от середины
      const dx = sd * (150 * tf + 70 * tf * tf), dy = -50 * tf + 2400 * tf * tf, rot = sd * (1.1 * tf + .5 * tf * tf), px = sd * 110, py = 10;
      c.save(); c.translate(px + dx, py + dy); c.rotate(rot); c.translate(-px, -py); halfClip(c, sd); c.clip(); whole(); c.restore();
    }
  }
  function shock(c, t) { const u = (t - K.flare) / .6; if (u <= 0 || u >= 1) return; ring(c, 0, 0, 30 + 560 * eo(u), `rgba(255,214,150,${.55 * (1 - u)})`, 6 - 4.5 * u) }
  // ---------- корпус одноразки = кадр 0 главы 1 в миниатюре ----------
  function puff(c, t) {   // затяжка: облачко манго-мяты из мундштука уходит вверх
    const u = t - K.zipE - .04; if (u <= 0 || u > 1) return;
    for (let i = 0; i < 4; i++) { const v = u - i * .07; if (v <= 0) continue; const e = eo(v / .9); glow(c, 540 + (i - 1.5) * 60 * v, -560 - 760 * e, 70 + 280 * e, i % 2 ? '#c8f3e0' : '#ffd9a8', .55 * (1 - v / .9)) }
  }
  function deviceShot(c, t, t1, hb) {
    const pop = lp(.12, 1, spr(at(t, K.grow - .06, K.grow + .32))), g = eio(at(t, K.grow + .08, K.grow + .55)), m = eo(at(t, K.grow + .38, K.grow + .7));
    const lv = lp(1.06, .15, eio(at(t, K.pour[0], K.pour[1]))), zk = at(t, K.zip, K.zipE), ry = zk > 0 ? lp(V1Z.bot, V1RY0, eio(zk)) : V1Z.bot;
    const rs = spr(at(t, K.zip - .08, K.zip + .22)) * (1 + .3 * Math.sin(Math.PI * at(t, K.zipE, K.zipE + .25))), fl = Math.sin(Math.PI * at(t, K.zipE - .02, K.zipE + .45));
    c.save(); c.translate(DEV0.x, DEV0.y); c.scale(S0, S0); c.translate(-DEVC.x, -DEVC.y);
    if (pop < 1) { c.translate(DEVC.x, DEVC.y); c.scale(pop, pop); c.translate(-DEVC.x, -DEVC.y) }
    device1(c, t1, { g, m, lv, rev: zk > 0 ? ry + 4 : 1e4, ry, rs, ra: t >= K.zip - .08 ? 1 : 0, fl });
    puff(c, t);
    c.restore();
    const r = CORE_R * (1 - .3 * eo(at(t, K.grow - .05, K.grow + .2))) * (1 - eio(at(t, K.pour[0], K.pour[1])));   // ядро стекает в капсулу
    if (r > .4) coreDraw(c, DEV0.x, DEV0.y, r, hb, 0);
  }
  // ---------- камера: медленный наезд на ядро, в конце — нырок в корпус (точка зума F рассчитана так, что в конце корпус = кадр главы 1) ----------
  const ZS1 = 1 / S0, P1 = { x: DEV0.x + S0 * (CX - DEVC.x), y: DEV0.y + S0 * (CY - DEVC.y) };
  const FZ = { x: (CX - ZS1 * P1.x) / (1 - ZS1), y: (CY - ZS1 * P1.y) / (1 - ZS1) }, VS = .004;
  function camZ(t) { return VS * t + (Math.log(ZS1) - VS * K.TE1) * eio(at(t, K.dive0, K.TE1)) }
  function scene(c, t) {
    const t1 = t - K.TE, hb = beatAt(t), fl = t > K.flare - .02 ? Math.exp(-Math.max(0, t - K.flare) / .3) * at(t, K.flare - .02, K.flare + .05) : 0;
    const s = Math.exp(camZ(t)), px = FZ.x - (FZ.x - CX) / s, py = FZ.y - (FZ.y - CY) / s;
    c.save(); liveCam1(c, t1);   // живая камера главы 1 на весь пролог: кадр всё время чуть плывёт, а в конце она же продолжается в главе 1
    c.save(); cam(c, s, px, py);
    stage(c, t, hb * .6 + fl);
    counter(c, t);
    c.save(); c.translate(DEV0.x, DEV0.y); floatT(c, t); if (t < K.grow - .06 || t - (K.crack + .14) < 1.3) shells(c, t, hb, fl, t < K.grow - .06); shock(c, t); c.restore();
    if (t >= K.grow - .06) deviceShot(c, t, t1, hb);
    c.restore();
    title(c, t);
    c.restore();
  }
