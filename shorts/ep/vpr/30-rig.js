  // ================= проба 20.11, часть 2: «скелет» у белых фигурок (как Duik в After Effects) =================
  // Кости: таз → корпус → шея → голова; плечо → локоть → кисть; бедро → колено → стопа. Ноги — обратной кинематикой:
  // стопа стоит на полу, пока на неё опираются (не скользит), колено гнётся само. Руки качаются в противофазе ногам.
  const RG = { torso: 128, neck: 18, head: 36, uarm: 82, farm: 76, thigh: 100, shin: 98, foot: 38 };
  const add2 = (a, b) => [a[0] + b[0], a[1] + b[1]], dir = (a, L) => [Math.sin(a) * L, Math.cos(a) * L];   // угол от «вниз», плюс — вперёд (по +x)
  // нога: бедро в hip, стопа (лодыжка) в ank — колено вперёд
  function ik2(hip, ank, a, b) {
    let dx = ank[0] - hip[0], dy = ank[1] - hip[1], d = Math.hypot(dx, dy); const dm = (a + b) * .999;
    if (d > dm) { dx *= dm / d; dy *= dm / d; d = dm; ank = [hip[0] + dx, hip[1] + dy] }
    const th0 = Math.atan2(dx, dy), al = Math.acos(cl((a * a + d * d - b * b) / (2 * a * d), -1, 1));
    const knee = add2(hip, dir(th0 + al, a)); return [knee, ank];
  }
  // одна фигурка: pose = { pel:[x,y], lean, neck, shL, elL, shR, elR, ankL, ankR, ftL, ftR, s }; L — дальняя сторона (темнее)
  function drawRig(c, P, o = {}) {
    const s = P.s, base = o.col || '#F4F1EA', far = shd(base, .32), near = base;
    const top = add2(P.pel, dir(Math.PI - P.lean, RG.torso * s)), shoulder = add2(P.pel, dir(Math.PI - P.lean, (RG.torso - 14) * s));
    const head = add2(top, dir(Math.PI - P.lean - P.neck, (RG.neck + RG.head) * s));
    const legs = side => { const ank = side ? P.ankR : P.ankL, [kn, an] = ik2(P.pel, ank, RG.thigh * s, RG.shin * s); return { kn, an, ft: add2(an, [Math.cos(side ? P.ftR : P.ftL) * RG.foot * s, -Math.sin(side ? P.ftR : P.ftL) * RG.foot * s]) } };
    const arm = (sh, el) => { const e = add2(shoulder, dir(sh, RG.uarm * s)); return { e, w: add2(e, dir(sh + el, RG.farm * s)) } };
    const lL = legs(0), lR = legs(1), aL = arm(P.shL, P.elL), aR = arm(P.shR, P.elR);
    const leg = (l, col) => { limb(c, [P.pel, l.kn, l.an], [34 * s, 27 * s, 20 * s], col); limb(c, [l.an, l.ft], [18 * s, 14 * s], col) };
    const armD = (a, col) => limb(c, [shoulder, a.e, a.w], [24 * s, 19 * s, 16 * s], col);
    // дальние рука и нога — темнее (как тень), ближние — светлые
    leg(lL, far); armD(aL, far);
    // корпус: капсула от таза к плечам, 3 тона
    const bw = 66 * s, tw = 78 * s, a = Math.atan2(top[0] - P.pel[0], -(top[1] - P.pel[1])), L = Math.hypot(top[0] - P.pel[0], top[1] - P.pel[1]);
    c.save(); c.translate(P.pel[0], P.pel[1]); c.rotate(a);
    const torso = () => { c.beginPath(); c.moveTo(-bw / 2, 10 * s); c.lineTo(bw / 2, 10 * s); c.quadraticCurveTo(tw / 2 + 6 * s, -L * .55, tw / 2, -L + 14 * s); c.quadraticCurveTo(tw / 2, -L - 6 * s, tw / 2 - 18 * s, -L - 6 * s);
      c.lineTo(-tw / 2 + 18 * s, -L - 6 * s); c.quadraticCurveTo(-tw / 2, -L - 6 * s, -tw / 2, -L + 14 * s); c.quadraticCurveTo(-tw / 2 - 4 * s, -L * .55, -bw / 2, 10 * s); c.closePath() };
    torso(); cel(c, -tw / 2, -L - 8 * s, tw, L + 20 * s, near, { sw: .3, ha: .35 }); c.restore();
    limb(c, [top, add2(top, dir(Math.PI - P.lean - P.neck, RG.neck * s * .9))], [26 * s, 24 * s], near);
    // голова: круг, тень справа серпом
    c.save(); c.beginPath(); c.arc(head[0], head[1], RG.head * s, 0, TAU); fill(c, near); c.clip();
    c.beginPath(); c.arc(head[0] - 12 * s, head[1] - 4 * s, RG.head * s * 1.02, 0, TAU); c.rect(head[0] - 200, head[1] - 200, 400, 400); c.fillStyle = shd(near, .3); c.fill('evenodd');
    rr(c, head[0] - RG.head * s * .62, head[1] - RG.head * s * .55, RG.head * s * .18, RG.head * s * .7, 4); fill(c, 'rgba(255,255,255,.45)'); c.restore();
    leg(lR, near); armD(aR, near);
  }
  // ходьба без скольжения стоп: каждая стопа стоит на полу полпериода, потом дугой переносится вперёд на v·T
  function walker(t, o) {   // o: x0, v (px/с), T (период шага), floor, s, t0 (старт); по желанию lean, lift, arm, el, bob, crouch
    const s = o.s, T = o.T, v = o.v, x = o.x0 + v * (t - o.t0), legH = (RG.thigh + RG.shin) * s, FY = o.floor - 10 * s;
    const foot = ph0 => {
      const ph = ((t - o.t0) / T + ph0) % 1, n = Math.floor((t - o.t0) / T + ph0);
      const mid = k => o.x0 + v * ((k - ph0) * T + T / 4);   // стопа под тазом — в середине опоры
      if (ph < .5) return [[mid(n), FY], 0, ph];
      const u = (ph - .5) / .5, e = u * u * (3 - 2 * u); return [[lp(mid(n), mid(n + 1), e), FY - (o.lift || 34) * s * Math.sin(Math.PI * u)], -.35 * Math.sin(Math.PI * u), ph];
    };
    const [aL, fL, pL] = foot(0), [aR, fR, pR] = foot(.5);
    const w = TAU * ((t - o.t0) / T), bob = (o.bob ?? 7) * s * Math.cos(2 * w);
    const pel = [x, o.floor - legH * (o.crouch ?? .955) - bob];
    const armA = o.arm ?? .48, sw = ph => armA * Math.sin(TAU * (ph - .25));
    return { pel, lean: o.lean ?? .06, neck: -.04, shL: sw(pL), elL: (o.el ?? .3) + .25 * Math.max(0, sw(pL) / armA), shR: sw(pR), elR: (o.el ?? .3) + .25 * Math.max(0, sw(pR) / armA),
      ankL: aL, ankR: aR, ftL: fL, ftR: fR, s };
  }
  // кадры части 2: t от 0 (6,4 с)
  const FLOOR = 1300, CHAIR = { x: 800, seat: 1185 };
  function chair(c) {   // стул смотрит влево: спинка справа
    const W = B2.wood;
    shp(c, RRp(CHAIR.x + 78, 860, 26, FLOOR - 860, 10), CHAIR.x + 78, 860, 26, FLOOR - 860, W, { lw: 3 });   // спинка
    shp(c, RRp(CHAIR.x - 112, CHAIR.seat - 4, 216, 30, 10), CHAIR.x - 112, CHAIR.seat - 4, 216, 30, lit(W, .12), { lw: 3 });   // сиденье
    shp(c, RRp(CHAIR.x - 100, CHAIR.seat + 26, 20, FLOOR - CHAIR.seat - 26, 8), CHAIR.x - 100, CHAIR.seat + 26, 20, FLOOR - CHAIR.seat - 26, shd(W, .2), { lw: 3 });
  }
  const mirrorX = (c, axis, fn) => { c.save(); c.translate(axis * 2, 0); c.scale(-1, 1); fn(); c.restore() };   // фигурка смотрит влево: та же поза, зеркально
  function rigPart(c, t) {
    bgSplit(c, B2.bg, B2.bg2, 540, 520, .12);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
    c.fillStyle = B2.bg2; c.fillRect(0, FLOOR, WW, HH - FLOOR); c.fillStyle = B2.dim; c.fillRect(0, FLOOR - 3, WW, 6);
    dotsField(c, 0, FLOOR + 6, WW, 200, 22, 'rgba(6,8,24,.35)', 2);
    c.restore();
    const zc = 1.02 + .03 * t / 6.4; c.save(); cam(c, zc, 540, 1000);
    // в глубине бегут трое (последние 2 с): та же фигурка, бег — другой ритм тех же костей
    if (t > 4.25) for (let i = 0; i < 3; i++) {
      const P = walker(t - 4.25, { x0: -180 - i * 120, v: 600, T: .5, floor: 1196, s: .7, lean: .3, lift: 62, arm: .95, el: 1.35, bob: 10, crouch: .9, t0: i * .05 });
      mirrorX(c, 540, () => drawRig(c, P, { col: '#C9C5D6' }));
    }
    chair(c);
    if (t < 1.75) {   // «было»: старая фигурка едет целиком, ноги не двигаются
      const k = eio(at(t, .1, 1.3)), x = lp(60, 430, k), a = 1 - at(t, 1.45, 1.75);
      A(c, a, () => { castDots(c, x - 40, FLOOR - 16, 80, 16, 120, {}); fig(c, x, FLOOR, 2.05, { m: 1, col: '#F4F1EA' }) });
      label(c, 'было: фигурка едет целиком', 540, 1520, a);
    } else {   // «стало»: идёт к стулу, разворачивается, садится, машет
      const S = 1.25, tw0 = 1.75, V = 360, AX = CHAIR.x - 170, X0 = 40, tStop = tw0 + (AX - X0) / V;
      const wk = { x0: X0, v: V, T: 1.0, floor: FLOOR, s: S, t0: tw0, lift: 36, crouch: .98 }, FY = FLOOR - 10 * S, standY = FLOOR - (RG.thigh + RG.shin) * S * .975;
      let P, sx = 1;
      if (t < tStop) P = walker(t, wk);
      else {
        const P0 = walker(tStop, wk), k = eio(at(t, tStop, tStop + .3));   // встал ровно, стопы рядом
        const stand = { s: S, pel: [lp(P0.pel[0], AX, k), lp(P0.pel[1], standY, k)], lean: lp(P0.lean, .02, k), neck: -.04, shL: lp(P0.shL, .05, k), elL: lp(P0.elL, .2, k), shR: lp(P0.shR, .05, k), elR: lp(P0.elR, .2, k),
          ankL: [lp(P0.ankL[0], AX - 14, k), lp(P0.ankL[1], FY, k)], ankR: [lp(P0.ankR[0], AX + 14, k), lp(P0.ankR[1], FY, k)], ftL: lp(P0.ftL, 0, k), ftR: lp(P0.ftR, 0, k) };
        const tf0 = tStop + .32, tf1 = tf0 + .26;   // разворот: сжимается по ширине и выходит зеркально
        if (t < tf1) { P = stand; sx = Math.cos(Math.PI * eio(at(t, tf0, tf1))) }
        else {   // дальше — в своей системе: «вперёд» = влево по экрану, стул сзади
          const ks = eio(at(t, tf1 + .05, tf1 + .85)), wave = eio(at(t, tf1 + 1.0, tf1 + 1.35)), wv = Math.sin((t - tf1 - 1.0) * 11);
          const seat = [AX - 170, CHAIR.seat - 20], dip = Math.sin(Math.PI * ks);
          P = { s: S, pel: [lp(AX, seat[0], ks), lp(standY, seat[1], ks) + 22 * dip], lean: lp(.02, -.05, ks) + .42 * dip,
            neck: -.04 + .1 * Math.sin((t - tf1 - 1.0) * 6) * wave,
            shL: lp(.05, .5, ks), elL: lp(.2, .95, ks), shR: lp(lp(.05, .45, ks), 2.6, wave), elR: lp(lp(.2, .9, ks), .35 + .4 * wv, wave),
            ankL: [lp(AX - 14, AX - 52, ks), FY], ankR: [lp(AX + 14, AX - 30, ks), FY], ftL: 0, ftR: 0 };
          sx = -1;
        }
      }
      const px = P.pel[0], draw = () => { castDots(c, px - 50, FLOOR - 14, 100, 14, 140, {}); drawRig(c, P) };
      if (sx === -1) mirrorX(c, AX, draw);
      else { c.save(); c.translate(px, 0); c.scale(Math.abs(sx) < .02 ? .02 : sx, 1); c.translate(-px, 0); draw(); c.restore() }
      label(c, t < 4.25 ? 'стало: скелет — колени и локти гнутся сами' : 'бег — те же кости, другой ритм', 540, 1520, at(t, 1.8, 2.1));
    }
    c.restore();
  }
