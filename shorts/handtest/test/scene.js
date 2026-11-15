// Тест «передача папки в архив»: тайминг и руки — из референса Google 0:32–0:42,5, стопка «СОЛЬ 1979», 1080×1920.
// Всё рисуется в координатах референса (1920×1080) и переводится в кадр 9:16 камерой: X = 540 + S·(x − Cx), Y = 960 + S·(y − Cy).
(() => {
  const cv = document.getElementById('cv'), c = cv.getContext('2d');
  const TR = window.TR, HD = window.HANDS, S = TR.S, CY = TR.Cy, FPS = TR.fps, KY = TR.KY, XC0 = TR.XC0;
  const R = Math.PI / 180, lerp = (a, b, u) => a + (b - a) * u, clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const ss = (a, b, x) => { const u = clamp((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u) };
  const at = (arr, t) => { const f = t * FPS, i = Math.floor(f), u = f - i, n = arr.length - 1; return lerp(arr[clamp(i, 0, n)], arr[clamp(i + 1, 0, n)], u) };
  const rrect = (x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r) };
  const poly = pts => { const p = new Path2D(); pts.forEach(([x, y], i) => i ? p.lineTo(x, y) : p.moveTo(x, y)); p.closePath(); return p };

  // ---------- руки: слои из векторизации (hand_vec.py) ----------
  function prep(h) {
    const [x0, y0, x1, y1] = h.box;
    const layers = h.layers.filter(L => L.paths.length).map(L => {
      const main = new Path2D(); let ext = null;
      L.paths.forEach((p, i) => {
        const isExt = L.name === 'sleeve' && i === L.paths.length - 1, P = isExt ? (ext = new Path2D()) : main;
        p.forEach(([x, y], j) => j ? P.lineTo(x, y) : P.moveTo(x, y)); P.closePath();
      });
      let fill = L.c;
      if (!fill) { fill = c.createLinearGradient(...L.g); fill.addColorStop(0, L.c0); fill.addColorStop(1, L.c1) }
      return { name: L.name, main, ext, fill };
    });
    return { bw: x1 - x0, bh: y1 - y0, layers };
  }
  const HAND1 = prep(HD.hand1), HAND1O = prep(HD.hand1open), HAND2 = prep(HD.hand2);
  // рука №1 держит стопку щипком: большой палец и ладонь — над бумагой, остальные пальцы — под ней (как в референсе)
  const H1_UNDER = poly([[-60, 352], [88, 352], [88, 228], [420, 228], [420, 760], [-60, 760]]);
  const H1_TOP = poly([[-60, -1100], [420, -1100], [420, 228], [88, 228], [88, 352], [-60, 352]]);

  const SHD = document.createElement('canvas'); SHD.width = 1080; SHD.height = 1920; const sg = SHD.getContext('2d');
  function handShadow(hp, x, y, a, clip, alpha) {
    // силуэт (с обрезкой) — в отдельный холст, потом размываем целиком: у тени нет жёсткого края по линии обрезки
    const T = c.getTransform(); sg.setTransform(1, 0, 0, 1, 0, 0); sg.clearRect(0, 0, 1080, 1920);
    sg.setTransform(T); sg.translate(x, y); sg.rotate(a * R); sg.translate(-hp.bw / 2, -hp.bh / 2);
    if (clip) sg.clip(clip);
    sg.fillStyle = '#05070b';
    for (const L of hp.layers) { if (L.name === 'skinShadow' || L.name === 'skinLight') continue; sg.fill(L.main, 'evenodd'); if (L.ext) sg.fill(L.ext) }
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.filter = 'blur(9px)'; c.globalAlpha *= .3 * alpha; c.drawImage(SHD, 11 * S, 16 * S); c.restore();
  }
  function hand(hp, x, y, a, alpha = 1, clip = null) {
    if (alpha <= 0) return;
    handShadow(hp, x, y, a, clip, alpha);
    c.save(); c.translate(x, y); c.rotate(a * R); c.translate(-hp.bw / 2, -hp.bh / 2);
    if (clip) c.clip(clip);
    c.globalAlpha *= alpha;
    for (const L of hp.layers) { c.fillStyle = L.fill; c.fill(L.main, 'evenodd'); if (L.ext) c.fill(L.ext) }
    c.restore();
  }

  // ---------- стол: градиент как в референсе + линии древесины (изолинии гладкого поля) ----------
  const TB = { x0: 73, x1: 1890, y0: -250, y1: 1360 };
  const GRAIN = (() => {
    const blobs = [[330, 120, 1, 470, 150, -24], [1080, 260, -.9, 520, 170, -30], [640, 860, 1.1, 560, 190, -22], [1520, 1010, -1, 430, 160, -34],
      [260, 1180, -.8, 380, 140, -18], [1680, 250, .9, 360, 140, -40], [1180, 640, .7, 300, 120, -28], [880, -120, -.7, 420, 150, -20]];
    const f = (x, y) => {
      let v = 0.00042 * (x * .55 + y * .9) - .55;
      for (const [cx, cy, A, sx, sy, an] of blobs) {
        const ca = Math.cos(an * R), sa = Math.sin(an * R), dx = x - cx, dy = y - cy, u = dx * ca + dy * sa, w = -dx * sa + dy * ca;
        v += A * Math.exp(-(u * u) / (2 * sx * sx) - (w * w) / (2 * sy * sy));
      }
      return v;
    };
    const st = 9, nx = Math.ceil((TB.x1 - TB.x0) / st) + 1, ny = Math.ceil((TB.y1 - TB.y0) / st) + 1, F = new Float32Array(nx * ny);
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) F[j * nx + i] = f(TB.x0 + i * st, TB.y0 + j * st);
    const p = new Path2D();
    for (const lv of [-.62, -.38, -.16, .08, .3, .52, .74, .95]) {
      for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
        const a = F[j * nx + i] - lv, b = F[j * nx + i + 1] - lv, cc = F[(j + 1) * nx + i + 1] - lv, d = F[(j + 1) * nx + i] - lv;
        const X = TB.x0 + i * st, Y = TB.y0 + j * st, pts = [];
        if ((a > 0) !== (b > 0)) pts.push([X + st * a / (a - b), Y]);
        if ((b > 0) !== (cc > 0)) pts.push([X + st, Y + st * b / (b - cc)]);
        if ((d > 0) !== (cc > 0)) pts.push([X + st * d / (d - cc), Y + st]);
        if ((a > 0) !== (d > 0)) pts.push([X, Y + st * a / (a - d)]);
        if (pts.length >= 2) { p.moveTo(...pts[0]); p.lineTo(...pts[1]); if (pts.length === 4) { p.moveTo(...pts[2]); p.lineTo(...pts[3]) } }
      }
    }
    return p;
  })();
  function table(Wx, L, Rr) {
    const x0 = TB.x0 + Wx, x1 = TB.x1 + Wx;
    if (x1 < L - 40 || x0 > Rr + 40) return;
    c.save();
    // мягкая тень стола на стене
    c.filter = 'blur(18px)'; c.fillStyle = 'rgba(0,0,0,.45)'; rrect(x0 + 10, TB.y0 + 18, x1 - x0, TB.y1 - TB.y0, 28); c.fill(); c.filter = 'none';
    const g = c.createLinearGradient(x0, 0, x1, 0);
    g.addColorStop(0, '#6f6668'); g.addColorStop(.3, '#61626a'); g.addColorStop(.6, '#4b535f'); g.addColorStop(.86, '#343c48'); g.addColorStop(1, '#283039');
    rrect(x0, TB.y0, x1 - x0, TB.y1 - TB.y0, 26); c.fillStyle = g; c.fill();
    c.save(); c.clip(); c.translate(Wx, 0); c.strokeStyle = 'rgba(20,24,32,.36)'; c.lineWidth = 1.6; c.stroke(GRAIN); c.restore();
    // кромка: светлая сверху-слева, тёмная справа-снизу
    c.lineWidth = 2; c.strokeStyle = 'rgba(255,255,255,.07)'; rrect(x0 + 1, TB.y0 + 1, x1 - x0 - 2, TB.y1 - TB.y0 - 2, 25); c.stroke();
    c.restore();
  }

  // ---------- стопка «СОЛЬ 1979» ----------
  const SHEETS = [[-8, 10, -1.5, '#e6d9c9'], [9, 6, 1.7, '#ece1d3'], [-4, -5, -.7, '#f1e8dd'], [6, 12, .9, '#e9ded0']];
  function cordLine(x0, y0, x1, y1) {
    c.lineCap = 'round';
    c.strokeStyle = '#6c788d'; c.lineWidth = 7.5; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
    c.strokeStyle = '#c3cad6'; c.lineWidth = 2.4; c.beginPath(); c.moveTo(x0 - .8, y0 - .8); c.lineTo(x1 - .8, y1 - .8); c.stroke();
    const L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L;     // скрутка бечёвки
    c.strokeStyle = 'rgba(70,80,98,.55)'; c.lineWidth = 1.1; c.beginPath();
    for (let s = 6; s < L - 4; s += 8) { const x = x0 + ux * s, y = y0 + uy * s; c.moveTo(x - uy * 3.4 - ux * 2.4, y + ux * 3.4 - uy * 2.4); c.lineTo(x + uy * 3.4 + ux * 2.4, y - ux * 3.4 + uy * 2.4) }
    c.stroke();
  }
  function knot(x, y) {
    c.save(); c.translate(x, y); c.lineCap = 'round';
    for (const s of [-1, 1]) {
      c.save(); c.rotate(s * -.5);
      c.strokeStyle = '#6c788d'; c.lineWidth = 5.5; c.beginPath(); c.ellipse(s * 15, -2, 15, 7.5, 0, 0, Math.PI * 2); c.stroke();
      c.strokeStyle = '#c3cad6'; c.lineWidth = 1.8; c.beginPath(); c.ellipse(s * 15 - .8, -2.8, 15, 7.5, 0, Math.PI * 1.05, Math.PI * 1.95); c.stroke();
      c.restore();
    }
    c.strokeStyle = '#6c788d'; c.lineWidth = 5; c.beginPath(); c.moveTo(-3, 4); c.quadraticCurveTo(-10, 18, -20, 26); c.moveTo(3, 4); c.quadraticCurveTo(9, 20, 6, 32); c.stroke();
    c.strokeStyle = '#c3cad6'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(-4, 5); c.quadraticCurveTo(-11, 17, -19, 24); c.stroke();
    c.fillStyle = '#5f6b80'; c.beginPath(); c.arc(0, 0, 7.5, 0, Math.PI * 2); c.fill(); c.fillStyle = '#9aa4b5'; c.beginPath(); c.arc(-2, -2, 3, 0, Math.PI * 2); c.fill();
    c.restore();
  }
  const INK = '#363e50';
  function topSheet() {
    const g = c.createLinearGradient(-202, -235, 202, 235); g.addColorStop(0, '#ffffff'); g.addColorStop(.55, '#fbf3ec'); g.addColorStop(1, '#f2dccb');
    rrect(-202, -235, 404, 470, 4); c.fillStyle = g; c.fill(); c.strokeStyle = 'rgba(150,135,120,.55)'; c.lineWidth = 1.2; c.stroke();
    c.strokeStyle = INK; c.lineWidth = 1.6; c.strokeRect(-188, -221, 376, 442);
    c.fillStyle = '#7b8291'; c.font = '600 13px M'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.letterSpacing = '3px';
    c.fillText('R.J. REYNOLDS LAB', 0, -203); c.letterSpacing = '0px';
    c.lineWidth = 2.2; c.strokeRect(-176, -188, 352, 84);
    c.fillStyle = '#2c3446'; c.textBaseline = 'alphabetic';
    c.font = '800 60px M'; c.letterSpacing = '4px'; const w1 = c.measureText('СОЛЬ').width; c.font = '600 42px M'; c.letterSpacing = '2px'; const w2 = c.measureText('1979').width;
    const x0 = -(w1 + 22 + w2) / 2; c.textAlign = 'left';
    c.font = '800 60px M'; c.letterSpacing = '4px'; c.fillText('СОЛЬ', x0, -124); c.font = '600 42px M'; c.letterSpacing = '2px'; c.fillText('1979', x0 + w1 + 22, -124); c.letterSpacing = '0px';
    c.lineWidth = 1.4; c.beginPath(); c.moveTo(-188, -94); c.lineTo(188, -94); c.moveTo(-188, -88); c.lineTo(188, -88); c.stroke();
    // колба
    c.lineWidth = 2; c.lineJoin = 'round'; c.beginPath();
    c.moveTo(-114, -64); c.lineTo(-72, -64); c.moveTo(-106, -64); c.lineTo(-106, -18); c.lineTo(-148, 106); c.quadraticCurveTo(-153, 120, -139, 120); c.lineTo(-45, 120); c.quadraticCurveTo(-31, 120, -36, 106); c.lineTo(-78, -18); c.lineTo(-78, -64); c.stroke();
    c.lineWidth = 1.5; c.beginPath(); c.moveTo(-131, 60); c.bezierCurveTo(-112, 52, -100, 68, -84, 60); c.bezierCurveTo(-72, 54, -62, 62, -54, 60); c.stroke();
    for (const [x, y, r] of [[-100, 86, 4.5], [-86, 76, 3], [-116, 98, 3.5], [-70, 96, 2.5]]) { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.stroke() }
    c.lineWidth = 1.3; c.beginPath(); for (const y of [-6, 14, 34]) { c.moveTo(-84 + (y + 18) * .33, y); c.lineTo(-74 + (y + 18) * .33, y) } c.stroke();
    c.font = '600 15px M'; c.textAlign = 'center'; c.fillStyle = INK; c.fillText('C₁₀H₁₄N₂', -92, 144);
    // решётка соли
    const F0 = [[28, -14], [116, -14], [116, 74], [28, 74]], B0 = F0.map(([x, y]) => [x + 32, y - 30]);
    c.lineWidth = 1.8; c.beginPath();
    for (const Q of [F0, B0]) { Q.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath() }
    for (let i = 0; i < 4; i++) { c.moveTo(...F0[i]); c.lineTo(...B0[i]) }
    const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const mF = [mid(F0[0], F0[1]), mid(F0[1], F0[2]), mid(F0[2], F0[3]), mid(F0[3], F0[0])];
    c.moveTo(...mF[0]); c.lineTo(...mF[2]); c.moveTo(...mF[1]); c.lineTo(...mF[3]); c.stroke();
    const nodes = [...F0.map(p => [p, 1]), ...B0.map(p => [p, 0]), ...mF.map(p => [p, 0]), [mid(mF[0], mF[2]), 1], [mid(F0[0], B0[0]), 0], [mid(F0[1], B0[1]), 1], [mid(F0[2], B0[2]), 0]];
    for (const [[x, y], k] of nodes) { c.beginPath(); c.arc(x, y, k ? 7 : 6, 0, Math.PI * 2); c.fillStyle = k ? INK : '#fff8f0'; c.fill(); c.lineWidth = 1.6; c.stroke() }
    c.fillStyle = INK; c.fillText('СОЛЬ НИКОТИНА', 86, 112);
    // низ листа
    c.lineWidth = 1.4; c.beginPath(); c.moveTo(-188, 152); c.lineTo(188, 152); c.moveTo(-188, 158); c.lineTo(188, 158); c.stroke();
    c.fillStyle = 'rgba(54,62,80,.28)';
    for (const [y, w] of [[174, 236], [190, 182], [206, 262]]) { rrect(-172, y - 3, w, 6, 3); c.fill() }
    c.strokeStyle = INK; c.lineWidth = 1.4; c.strokeRect(108, 168, 66, 44); c.font = '600 13px M'; c.fillStyle = INK; c.fillText('№ 7', 141, 195);
  }
  function stack(x, y, a, sc = 1, alpha = 1) {
    c.save(); c.translate(x, y); c.rotate(a * R); c.scale(sc, sc); c.globalAlpha *= alpha;
    // тень на столе — смещение по кадру (свет сверху-слева)
    c.save(); const ox = 12 / sc, oy = 17 / sc, ca = Math.cos(-a * R), sa = Math.sin(-a * R); c.translate(ox * ca - oy * sa, ox * sa + oy * ca);
    c.filter = 'blur(11px)'; c.fillStyle = 'rgba(4,6,10,.34)'; rrect(-212, -246, 424, 492, 8); c.fill(); c.restore();
    for (const [dx, dy, r, col] of SHEETS) {
      c.save(); c.translate(dx, dy); c.rotate(r * R); rrect(-202, -235, 404, 470, 4); c.fillStyle = col; c.fill(); c.strokeStyle = 'rgba(140,124,108,.6)'; c.lineWidth = 1.2; c.stroke(); c.restore();
    }
    topSheet();
    cordLine(10, -243, 17, 243); cordLine(-209, 34, 209, 43); knot(14, 39);
    c.restore();
  }

  // ---------- архив: стена с точками, полка, 7 папок ----------
  const DOT = { sx: 153, sy: 87 };
  function dots(Wx, dy, L, Rr, T0, B0) {
    c.fillStyle = 'rgba(74,98,132,.33)';
    const j0 = Math.floor((T0 - dy - 20) / DOT.sy) - 1, j1 = Math.ceil((B0 - dy - 20) / DOT.sy) + 1;
    for (let j = j0; j <= j1; j++) {
      const off = (j & 1) ? DOT.sx / 2 : 0, y = j * DOT.sy + 20 + dy;
      const i0 = Math.floor((L - Wx - off) / DOT.sx) - 1, i1 = Math.ceil((Rr - Wx - off) / DOT.sx) + 1;
      for (let i = i0; i <= i1; i++) { c.beginPath(); c.arc(i * DOT.sx + off + Wx, y, 3.3, 0, Math.PI * 2); c.fill() }
    }
  }
  const FOLD = (() => {                    // задние папки: шаг перспективы 0.86, чем дальше — тем темнее
    const out = []; let R1 = -116;
    const covers = ['#1a508a', '#184672', '#173d63', '#163454', '#152c46', '#14253a'], pages = ['#9b9ea6', '#868a93', '#737882', '#636872', '#555a64', '#494e57'];
    for (let k = 0; k < 6; k++) {
      const s = Math.pow(.86, k + 1), U = 108 * s, Lk = R1 - U + 6, h = 734 * s;
      out.push({ s, L: Lk, R: R1, top: 910 - h, cover: covers[k], page: pages[k], a: 1 - k * .1 }); R1 = Lk;
    }
    return out;
  })();
  function archiveBack(xC, dy) {
    c.save(); c.translate(xC, dy);
    // полка
    const sg = c.createLinearGradient(-820, 0, 560, 0);
    sg.addColorStop(0, 'rgba(26,31,40,0)'); sg.addColorStop(.3, '#232932'); sg.addColorStop(.62, '#3b414b'); sg.addColorStop(1, '#6d6566');
    c.save(); c.filter = 'blur(14px)'; c.fillStyle = 'rgba(0,0,0,.5)'; rrect(-800, 930, 1370, 92, 18); c.fill(); c.restore();
    rrect(-820, 908, 1380, 94, 16); c.fillStyle = sg; c.fill();
    c.strokeStyle = 'rgba(255,255,255,.08)'; c.lineWidth = 2; c.beginPath(); c.moveTo(-600, 910); c.lineTo(550, 910); c.stroke();
    c.strokeStyle = 'rgba(20,24,32,.35)'; c.lineWidth = 1.4; c.beginPath();
    for (const x of [-40, 120, 300, 470]) { c.moveTo(x, 910); c.lineTo(x + 60, 1000) } c.stroke();
    // задние папки (от дальней к ближней)
    for (let k = FOLD.length - 1; k >= 0; k--) {
      const f = FOLD[k], s = f.s, U = f.R - f.L; c.save(); c.globalAlpha = f.a;
      rrect(f.L, f.top + 10 * s, U * .2, 910 - f.top - 10 * s, [9 * s, 0, 0, 0]); c.fillStyle = f.cover; c.fill();                 // задняя крышка
      for (let p = 0; p < 3; p++) { const px = f.L + U * (.14 + p * .1); rrect(px, f.top + (14 + p * 3) * s, U * .42, 905 - f.top - (14 + p * 3) * s, 0); c.fillStyle = f.page; c.fill(); c.strokeStyle = 'rgba(0,0,0,.18)'; c.lineWidth = 1; c.stroke() }
      const cg = c.createLinearGradient(f.L + U * .5, 0, f.R + 30, 0); cg.addColorStop(0, f.cover); cg.addColorStop(1, '#0f1b2b');
      rrect(f.L + U * .5, f.top, f.R + 26 - (f.L + U * .5), 910 - f.top, [10 * s, 10 * s, 0, 0]); c.fillStyle = cg; c.fill();     // передняя крышка (правый край — под соседом)
      c.restore();
    }
    // ближняя папка: задняя крышка и листы
    const bg = c.createLinearGradient(-116, 0, 0, 0); bg.addColorStop(0, '#0d7ae0'); bg.addColorStop(1, '#0858a8');
    rrect(-118, 186, 120, 724, [12, 0, 0, 0]); c.fillStyle = bg; c.fill();
    for (let p = 0; p < 3; p++) {
      const px = -94 + p * 24, pg = c.createLinearGradient(px, 0, 0, 0); pg.addColorStop(0, '#ffffff'); pg.addColorStop(.55, '#f1efee'); pg.addColorStop(1, '#a9a7a8');
      rrect(px, 194 + p * 4, 120, 714 - p * 4, 2); c.fillStyle = pg; c.fill(); c.strokeStyle = 'rgba(120,118,122,.55)'; c.lineWidth = 1; c.stroke();
    }
    c.restore();
  }
  function emblem() {                       // табачный лист и корона — тиснение на обложке
    const cx = 262, path = () => {
      c.beginPath();
      // корона
      c.moveTo(214, 238); c.lineTo(310, 238); c.moveTo(214, 238); c.lineTo(222, 196); c.lineTo(243, 220); c.lineTo(262, 186); c.lineTo(281, 220); c.lineTo(302, 196); c.lineTo(310, 238);
      // лист
      c.moveTo(cx, 262); c.bezierCurveTo(cx - 86, 318, cx - 98, 452, cx, 522); c.bezierCurveTo(cx + 98, 452, cx + 86, 318, cx, 262);
      c.moveTo(cx, 272); c.lineTo(cx, 552);
      for (const y of [316, 364, 412, 460]) { const w = 70 * Math.sin(Math.PI * (y - 250) / 290); c.moveTo(cx, y); c.quadraticCurveTo(cx - w * .5, y - 12, cx - w * .86, y - 40); c.moveTo(cx, y); c.quadraticCurveTo(cx + w * .5, y - 12, cx + w * .86, y - 40) }
      c.moveTo(cx + 168, 384); c.arc(cx, 384, 168, 0, Math.PI * 2);
    };
    c.save(); c.lineJoin = 'round'; c.lineCap = 'round';
    c.translate(2, 2); path(); c.strokeStyle = 'rgba(70,160,255,.35)'; c.lineWidth = 3; c.stroke();
    c.translate(-2, -2); path(); c.strokeStyle = 'rgba(4,52,110,.78)'; c.lineWidth = 5.5; c.stroke();
    for (const [x, y] of [[222, 196], [262, 186], [302, 196]]) { c.beginPath(); c.arc(x, y - 7, 6, 0, Math.PI * 2); c.fillStyle = 'rgba(4,52,110,.78)'; c.fill() }
    c.restore();
  }
  function archiveFront(xC, dy) {
    c.save(); c.translate(xC, dy);
    c.save(); c.filter = 'blur(16px)'; c.fillStyle = 'rgba(0,0,0,.45)'; rrect(14, 196, 520, 720, 16); c.fill(); c.restore();
    const g = c.createLinearGradient(0, 176, 520, 910); g.addColorStop(0, '#3d95ec'); g.addColorStop(.42, '#0969da'); g.addColorStop(1, '#0750a0');
    rrect(0, 176, 520, 734, [16, 16, 4, 4]); c.fillStyle = g; c.fill();
    const sh = c.createLinearGradient(330, 0, 520, 0); sh.addColorStop(0, 'rgba(8,30,60,0)'); sh.addColorStop(1, 'rgba(8,30,60,.55)'); c.fillStyle = sh; c.fill();
    c.strokeStyle = 'rgba(160,210,255,.45)'; c.lineWidth = 3; c.beginPath(); c.moveTo(2, 196); c.lineTo(2, 906); c.stroke();
    c.save(); c.translate(0, 176); emblem(); c.restore();
    // скоба справа
    c.fillStyle = 'rgba(4,28,58,.5)'; rrect(436, 306, 22, 470, 11); c.fill();
    for (const y of [318, 764]) { c.beginPath(); c.arc(447, y, 17, 0, Math.PI * 2); c.fillStyle = 'rgba(4,28,58,.62)'; c.fill(); c.beginPath(); c.arc(444, y - 4, 6, 0, Math.PI * 2); c.fillStyle = 'rgba(150,200,255,.25)'; c.fill() }
    c.restore();
  }

  // ---------- шум и виньетка ----------
  const NOISE = (() => { const n = document.createElement('canvas'); n.width = n.height = 256; const g = n.getContext('2d'), d = g.createImageData(256, 256); let s = 7;
    for (let i = 0; i < d.data.length; i += 4) { s = (s * 16807) % 2147483647; const v = 128 + ((s % 1000) / 1000 - .5) * 140; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255 } g.putImageData(d, 0, 0); return n })();

  const XEND = 300, YEND = 935;
  function render(t) {
    const Cx = at(TR.C, t), W0 = at(TR.W, t), Wy = at(TR.Wy, t), dy = KY * Wy, xC = XC0 + W0;
    const L = Cx - 540 / S, Rr = Cx + 540 / S, T0 = CY - 960 / S, B0 = CY + 960 / S;
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.filter = 'none'; c.globalCompositeOperation = 'source-over';
    c.fillStyle = '#111822'; c.fillRect(0, 0, 1080, 1920);
    c.setTransform(S, 0, 0, S, 540 - S * Cx, 960 - S * CY);
    dots(W0, dy, L, Rr, T0, B0);
    table(W0, L, Rr);
    const archive = xC - 900 < Rr + 50;
    if (archive) archiveBack(xC, dy);

    // стопка
    let sx = at(TR.stack.map(s => s[0]), t), sy = at(TR.stack.map(s => s[1]), t), sa = at(TR.stack.map(s => s[2]), t), sc = 1, free = false;
    if (t >= 8.6) {                                            // конец: вылет из папки, в координатах кадра
      const p = at(TR.endP, t), q = at(TR.endQ, t), e = Math.sqrt(p);
      const X0 = 540 + S * (1300 - at(TR.C, 8.6)), Y0 = 960 + S * (597 - CY), tilt = dy * S;
      const X = lerp(X0, XEND, p), Y = (Y0 + tilt) * (1 - e) + YEND * e;
      sx = Cx + (X - 540) / S; sy = CY + (Y - 960) / S; sa = -350.3 - 404.7 * q; sc = 1 - .16 * p;
      const hw = (202 * Math.abs(Math.cos(sa * R)) + 235 * Math.abs(Math.sin(sa * R))) * sc + 14;
      free = sx + hw < xC;
    }
    // рука №1: держит (большой палец сверху), затем открытая ладонь
    const h1 = TR.h1hold, h1o = TR.h1open, h1i = TR.h1in, xf = t >= 3.0 ? 1 : 0, xi = t >= 1.44 ? 1 : 0;   // смена рисунка руки — в один кадр, как в референсе
    const h1on = t >= 1.44 && t < 3.0, h1oon = t >= 3.0 && t <= h1o.t1, h1ion = t >= h1i.t0 && t < 1.44;
    if (h1ion) hand(HAND1O, at(h1i.x, t), at(h1i.y, t), at(h1i.a, t), 1 - xi);   // подлёт: раскрытая кисть
    if (h1on) hand(HAND1, at(h1.x, t), at(h1.y, t), at(h1.a, t), xi * (1 - xf), H1_UNDER);
    if (!free) stack(sx, sy, sa, sc);
    if (archive) archiveFront(xC, dy);
    if (h1on) hand(HAND1, at(h1.x, t), at(h1.y, t), at(h1.a, t), xi * (1 - xf), H1_TOP);
    if (h1oon) hand(HAND1O, at(h1o.x, t), at(h1o.y, t), at(h1o.a, t), xf);
    const h2 = TR.h2; if (t >= h2.t0 && t <= h2.t1) hand(HAND2, at(h2.x, t), at(h2.y, t), at(h2.a, t));
    if (free) stack(sx, sy, sa, sc);

    // «1979» сверху едет вместе со стеной и загорается
    if (t > 9.2) {
      const y = -862 + dy, x = XC0 - 2869 + 343;
      const lit = ss(9.86, 10.06, t), glow = lit * (1 - .45 * ss(10.08, 10.42, t));
      c.save(); c.font = '800 196px M'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.letterSpacing = '4px';
      c.lineJoin = 'round'; c.lineWidth = 16; c.strokeStyle = '#0c1a2b'; c.strokeText('1979', x, y);
      c.shadowColor = `rgba(40,140,255,${.9 * glow})`; c.shadowBlur = 60 * glow;
      const r = Math.round(lerp(22, 36, lit)), g = Math.round(lerp(88, 142, lit)), b = Math.round(lerp(150, 238, lit));
      c.fillStyle = `rgb(${r},${g},${b})`; c.fillText('1979', x, y); c.shadowBlur = 0;
      c.restore();
    }

    // кадр: свет сверху-слева, виньетка, зерно, вход из чёрного
    c.setTransform(1, 0, 0, 1, 0, 0);
    const kl = c.createRadialGradient(260, 420, 60, 260, 420, 1250); kl.addColorStop(0, 'rgba(255,236,214,.07)'); kl.addColorStop(1, 'rgba(255,236,214,0)');
    c.fillStyle = kl; c.fillRect(0, 0, 1080, 1920);
    const vg = c.createRadialGradient(540, 930, 420, 540, 930, 1320); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.46)');
    c.fillStyle = vg; c.fillRect(0, 0, 1080, 1920);
    c.globalCompositeOperation = 'overlay'; c.globalAlpha = .07; const fr = Math.round(t * FPS);
    c.fillStyle = c.createPattern(NOISE, 'repeat'); c.save(); c.translate((fr * 97) % 256, (fr * 61) % 256); c.fillRect(-256, -256, 1080 + 512, 1920 + 512); c.restore();
    c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
    const fade = 1 - ss(0, .3, t); if (fade > 0) { c.fillStyle = `rgba(0,0,0,${fade})`; c.fillRect(0, 0, 1080, 1920) }
  }
  window.render = render;
  window.ready = document.fonts.ready.then(() => document.fonts.load('800 60px M', 'СОЛЬ 1979')).then(() => document.fonts.load('600 13px M', 'R.J. №'));
})();
