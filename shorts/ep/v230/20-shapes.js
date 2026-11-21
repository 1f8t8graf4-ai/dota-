  // ================= пять оболочек без марок: контуры (по часовой стрелке), превращения — flubber (vendor/, MIT) =================
  // Координаты оболочки: (0, 0) — точка ядра на сцене (540, 980). Одноразка — ровно силуэт корпуса из конца пролога (кадр 0 главы 1 в миниатюре, S0).
  const FLB = window.flubber, MCACHE = {};
  function morphF(key, a, b) { return MCACHE[key] || (MCACHE[key] = FLB.interpolate(a, b, { string: false, maxSegmentLength: 5 })) }
  const S0 = .32, DEV0 = { x: 540, y: 980 }, DEVC = { x: 540, y: 800 };   // корпус на сцене: точка (540, 800) кадра главы 1 (середина капсулы) — в ядре
  const toSh = (x, y) => [(x - DEVC.x) * S0, (y - DEVC.y) * S0];
  function arcPts(o, cx, cy, rx, ry, a0, a1, n) { for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; o.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]) } return o }
  function rrPts(x0, y0, x1, y1, r, n = 10) {   // скруглённый прямоугольник, начало — верхний левый угол после дуги
    const o = [], P = Math.PI;
    arcPts(o, x1 - r, y0 + r, r, r, -P / 2, 0, n); arcPts(o, x1 - r, y1 - r, r, r, 0, P / 2, n); arcPts(o, x0 + r, y1 - r, r, r, P / 2, P, n); arcPts(o, x0 + r, y0 + r, r, r, P, P * 1.5, n);
    return o;
  }
  const P2 = Math.PI / 2;
  const SH = {
    cig: rrPts(-46, -315, 46, 315, 10),                                                     // 1924: сигарета стоя, фильтр снизу
    heat: (() => {                                                                          // 2014: держатель-«ручка», сверху торчит стик
      const o = [], R = 75, cy = -105, a = Math.asin(27 / R);
      o.push([-27, -175 + 0], [-27, -314]); arcPts(o, -21, -314, 6, 6, Math.PI, Math.PI * 1.5, 4); arcPts(o, 21, -314, 6, 6, -P2, 0, 4); o.push([27, cy - R * Math.cos(a)]);
      arcPts(o, 0, cy, R, R, -P2 + a, 0, 12); o.push([R, 265]); arcPts(o, 0, 265, R, R, 0, Math.PI, 20); o.push([-R, cy]); arcPts(o, 0, cy, R, R, Math.PI, Math.PI * 1.5 - a, 12);
      return o;
    })(),
    pod: (() => {                                                                           // 2015: плоский под, мундштук сужается
      const o = []; o.push([-22, -240], [-18, -322]); arcPts(o, -10, -322, 8, 8, Math.PI, Math.PI * 1.5, 4); arcPts(o, 10, -322, 8, 8, -P2, 0, 4); o.push([22, -240]);
      arcPts(o, 24, -204, 36, 36, -P2, 0, 8); arcPts(o, 24, 284, 36, 36, 0, P2, 8); arcPts(o, -24, 284, 36, 36, P2, Math.PI, 8); arcPts(o, -24, -204, 36, 36, Math.PI, Math.PI * 1.5, 8);
      return o;
    })(),
    disp: (() => {                                                                          // 2020: одноразка — корпус и мундштук из ep/v230/30-ch1.js (BODY, mouthPath)
      const o = [], b = [-60, -240, 1140, 2160], r = 170, P = Math.PI, q = (x0, y0, cx, cy, x1, y1, n) => { for (let i = 1; i <= n; i++) { const u = i / n, v = 1 - u; o.push(toSh(v * v * x0 + 2 * v * u * cx + u * u * x1, v * v * y0 + 2 * v * u * cy + u * u * y1)) } };
      const A = (cx, cy, a0, a1) => { for (let i = 0; i <= 10; i++) { const a = a0 + (a1 - a0) * i / 10; o.push(toSh(cx + Math.cos(a) * r, cy + Math.sin(a) * r)) } };
      o.push(toSh(330, -240), toSh(362, -458)); q(362, -458, 372, -510, 420, -510, 5); o.push(toSh(660, -510)); q(660, -510, 708, -510, 718, -458, 5); o.push(toSh(750, -240));
      A(b[2] - r, b[1] + r, -P / 2, 0); A(b[2] - r, b[3] - r, 0, P / 2); A(b[0] + r, b[3] - r, P / 2, P); A(b[0] + r, b[1] + r, P, P * 1.5);
      return o;
    })(),
    can: (() => {                                                                           // 2022: баночка с пакетиками, вид в три четверти
      const o = []; arcPts(o, 0, -70, 220, 64, Math.PI, Math.PI * 2, 30); o.push([220, 90]); arcPts(o, 0, 90, 220, 64, 0, Math.PI, 30); return o;
    })(),
  };
  const FORMS = ['cig', 'heat', 'pod', 'disp', 'can'];
  const FTINT = { cig: '#f5f1e8', heat: '#a9b3cf', pod: '#8792b4', disp: '#ef5668', can: '#eef4f7' };
  const FCORE = { cig: [0, -40], heat: [0, -150], pod: [0, -150], disp: [0, 0], can: [0, 22] };   // где ядро внутри каждой оболочки (никотин: табак, стик, под, капсула, пакетик)
  function shPath(c, pts) { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath() }
  function shBox(pts) { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) } return [x0, y0, x1 - x0, y1 - y0] }
  // детали внутри оболочки (тонкие светлые линии «рентгена»); a — вес формы во время превращения
  function shDetail(c, f, a) {
    if (a <= .01) return; c.save(); c.globalAlpha *= a; c.strokeStyle = 'rgba(238,241,248,.55)'; c.lineWidth = 3; c.lineCap = 'round';
    if (f === 'cig') { c.fillStyle = 'rgba(242,184,75,.2)'; c.fillRect(-46, 150, 92, 165); c.beginPath(); c.moveTo(-46, 150); c.lineTo(46, 150); c.stroke(); c.beginPath(); c.moveTo(-46, 172); c.lineTo(46, 172); c.globalAlpha *= .5; c.stroke() }
    else if (f === 'heat') {   // стик: белая бумага, светло-коричневый фильтр сверху; ниже — внутри держателя (пунктир), лезвие нагревателя
      rr(c, -27, -320, 54, 142, 6); c.fillStyle = 'rgba(250,246,238,.42)'; c.fill(); rr(c, -27, -320, 54, 46, 6); c.fillStyle = 'rgba(214,170,110,.55)'; c.fill();
      c.beginPath(); c.moveTo(-27, -274); c.lineTo(27, -274); c.stroke();
      c.setLineDash([10, 9]); rr(c, -21, -176, 42, 150, 5); c.stroke(); c.setLineDash([]); c.beginPath(); c.moveTo(0, -130); c.lineTo(0, -40); c.stroke(); ring(c, 0, 150, 12, 'rgba(238,241,248,.55)', 3);
    }
    else if (f === 'pod') {   // под: тёмный мундштук, окошко с жидкостью, шов, диод
      c.save(); c.beginPath(); c.rect(-70, -340, 140, 100); c.clip(); shPath(c, SH.pod); c.fillStyle = 'rgba(20,23,51,.5)'; c.fill(); c.restore();
      c.beginPath(); c.moveTo(-60, -40); c.lineTo(60, -40); c.stroke(); rr(c, -30, -222, 60, 150, 14); c.stroke(); circ(c, 0, 268, 6, 'rgba(238,241,248,.6)');
    }
    else if (f === 'disp') { const [x0, y0] = toSh(460, 300), [x1, y1] = toSh(620, 1300); rr(c, x0, y0, x1 - x0, y1 - y0, (x1 - x0) / 2); c.stroke(); const [, ym] = toSh(0, -240); c.beginPath(); c.moveTo(-67, ym); c.lineTo(67, ym); c.stroke() }
    else if (f === 'can') {
      c.beginPath(); c.ellipse(0, -70, 220, 64, 0, 0, Math.PI); c.stroke();
      for (const [x, y, w, h, r, k] of [[-118, 30, 150, 64, -.16, .35], [118, 34, 150, 64, .14, .35], [0, 22, 168, 74, -.02, .6]]) { c.save(); c.translate(x, y); c.rotate(r); rr(c, -w / 2, -h / 2, w, h, h * .42); c.fillStyle = `rgba(250,248,242,${k * .5})`; c.fill(); c.strokeStyle = `rgba(250,248,242,${k})`; c.stroke(); c.restore() }   // белые пакетики
    }
    c.restore();
  }
  // оболочка-«рентген»: заливка просвечивает, тень справа, блик слева, тонкий светлый контур (наши 3 тона; ядро — внутри)
  function shellBack(c, pts, tint, op) { shPath(c, pts); c.save(); c.globalAlpha *= op; c.fillStyle = tint; c.fill(); c.restore() }
  function shellFront(c, pts, tint, op, a = 1) {
    const [x, y, w, h] = shBox(pts), g0 = c.globalAlpha;
    c.save(); shPath(c, pts); c.clip();
    c.globalAlpha = g0 * a * (.18 + .1 * op); c.fillStyle = op > 0 ? mixc(shd(tint, .55), '#141733', op) : shd(tint, .55); c.fillRect(x + w * .74, y - 4, w * .26 + 8, h + 8);   // тень справа (у непрозрачного «лица» — тёмная, а не серая)
    c.globalAlpha = g0 * a * (.22 + .2 * op); rr(c, x + w * .1, y + h * .08, Math.max(5, w * .085), h * .84, 6); fill(c, '#ffffff');   // блик полосой слева
    c.restore();
    c.save(); c.globalAlpha *= a; shPath(c, pts); lnB(c, 4, 'rgba(238,241,248,.92)'); c.restore();
  }
