// Набросок кадра 0 главы 3: щит «Marlboro Country» у трассы на закате. 1080×1920.
// drawF0(canvas, {guides:true, only:'horse'|'packs'}) — 'packs': эталон трёх пачек, холст 1080×600
function drawF0(cv, o) {
  o = o || {};
  var W = 1080, H = 1920, k = cv.width / W, c = cv.getContext('2d');
  c.setTransform(k, 0, 0, k, 0, 0);
  c.clearRect(0, 0, W, H);
  var SERIF = o.serif || '"Playfair Display", Georgia, "Times New Roman", serif';
  var MONO = o.mono || '"IBM Plex Mono", ui-monospace, monospace';
  var BODY = o.body || '"Golos Text", system-ui, sans-serif';
  var TAU = Math.PI * 2;
  function R(x, y, w, h, f) { c.fillStyle = f; c.fillRect(x, y, w, h); }
  function P(p, f) { c.beginPath(); c.moveTo(p[0], p[1]); for (var i = 2; i < p.length; i += 2) c.lineTo(p[i], p[i + 1]); c.closePath(); c.fillStyle = f; c.fill(); }
  function C(x, y, r, f) { c.beginPath(); c.arc(x, y, r, 0, TAU); c.fillStyle = f; c.fill(); }
  function EL(x, y, rx, ry, f, a) { c.beginPath(); c.ellipse(x, y, rx, ry, a || 0, 0, TAU); c.fillStyle = f; c.fill(); }
  function LN(p, col, w) {
    c.beginPath(); c.moveTo(p[0], p[1]); for (var i = 2; i < p.length; i += 2) c.lineTo(p[i], p[i + 1]);
    c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke();
  }
  // нога / рука: сегменты с толщиной в узлах
  function limb(pts, ws, col) {
    c.fillStyle = col;
    for (var i = 0; i < pts.length - 1; i++) {
      var a = pts[i], b = pts[i + 1], wa = ws[i] / 2, wb = ws[i + 1] / 2;
      var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
      c.beginPath(); c.moveTo(a[0] + nx * wa, a[1] + ny * wa); c.lineTo(b[0] + nx * wb, b[1] + ny * wb);
      c.lineTo(b[0] - nx * wb, b[1] - ny * wb); c.lineTo(a[0] - nx * wa, a[1] - ny * wa); c.closePath(); c.fill();
    }
    for (var j = 0; j < pts.length; j++) { c.beginPath(); c.arc(pts[j][0], pts[j][1], ws[j] / 2, 0, TAU); c.fill(); }
  }
  // растровая тень под 35°: точки внутри многоугольника
  function raster(poly, col, step, r) {
    c.save(); c.beginPath(); c.moveTo(poly[0], poly[1]);
    for (var i = 2; i < poly.length; i += 2) c.lineTo(poly[i], poly[i + 1]);
    c.closePath(); c.clip();
    var xs = poly.filter(function (_, i) { return i % 2 === 0; }), ys = poly.filter(function (_, i) { return i % 2 === 1; });
    var x0 = Math.min.apply(0, xs) - step, x1 = Math.max.apply(0, xs) + step, y0 = Math.min.apply(0, ys) - step, y1 = Math.max.apply(0, ys) + step;
    var ca = Math.cos(0.61), sa = Math.sin(0.61);
    c.fillStyle = col;
    var cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, rr = Math.hypot(x1 - x0, y1 - y0) / 2 + step;
    for (var u = -rr; u < rr; u += step) for (var v = -rr; v < rr; v += step) {
      var px = cx + u * ca - v * sa, py = cy + u * sa + v * ca;
      if (px < x0 || px > x1 || py < y0 || py > y1) continue;
      c.beginPath(); c.arc(px, py, r, 0, TAU); c.fill();
    }
    c.restore();
  }

  // ---------- конь и всадник (смотрят вправо, на пачку). Земля — y 0, вверх — минус ----------
  function horse(x, y, s, T) {
    c.save(); c.translate(x, y); c.scale(s, s);
    function hoofAt(p, col) { P([p[0] - 8, p[1] - 5, p[0] + 9, p[1] - 5, p[0] + 11, p[1] + 4, p[0] - 9, p[1] + 4], col); }
    // дальние ноги — тоном темнее
    var ff = [[42, -86], [40, -47], [38, -15], [41, -4]];
    limb(ff, [20, 13, 10, 10], T.d); hoofAt([42, 0], T.hoof);
    var fh = [[-62, -100], [-92, -54], [-86, -16], [-82, -4]];
    limb(fh, [34, 14, 10, 10], T.d); hoofAt([-81, 0], T.hoof);
    // хвост
    c.beginPath(); c.moveTo(-126, -146);
    c.bezierCurveTo(-156, -140, -170, -110, -166, -70);
    c.bezierCurveTo(-164, -52, -170, -40, -176, -30);
    c.bezierCurveTo(-158, -36, -148, -56, -146, -78);
    c.bezierCurveTo(-144, -104, -136, -122, -118, -128);
    c.closePath(); c.fillStyle = T.d; c.fill();
    // туловище: грудь, бочка, круп
    EL(-24, -114, 96, 36, T.b);
    C(50, -114, 34, T.b);
    C(-98, -121, 36, T.b);
    // ляжка задней ноги
    c.beginPath(); c.moveTo(-134, -124); c.bezierCurveTo(-137, -100, -130, -74, -118, -56);
    c.lineTo(-96, -64); c.bezierCurveTo(-84, -86, -76, -104, -72, -122); c.closePath(); c.fillStyle = T.b; c.fill();
    // шея и голова одним контуром
    c.beginPath();
    c.moveTo(18, -144);
    c.bezierCurveTo(30, -178, 64, -212, 100, -208);          // гребень шеи дугой до затылка
    c.lineTo(99, -229); c.lineTo(108, -211);                   // ухо 1
    c.lineTo(112, -227); c.lineTo(118, -206);                  // ухо 2
    c.bezierCurveTo(127, -203, 133, -197, 139, -187);          // лоб
    c.bezierCurveTo(149, -171, 158, -158, 166, -146);          // переносица
    c.quadraticCurveTo(174, -136, 166, -129);                  // нос
    c.lineTo(156, -128); c.quadraticCurveTo(150, -128, 149, -134);   // губа и подбородок
    c.bezierCurveTo(140, -138, 131, -145, 125, -152);          // низ головы
    c.bezierCurveTo(115, -158, 110, -166, 111, -175);          // ганаш
    c.bezierCurveTo(98, -160, 88, -136, 86, -106);             // горло к груди, вогнуто
    c.quadraticCurveTo(86, -86, 66, -80); c.lineTo(40, -84); c.closePath();
    c.fillStyle = T.b; c.fill();
    // ближние ноги: передняя шагает, задняя стоит
    var nf = [[60, -88], [78, -50], [67, -24], [74, -12]];
    limb(nf, [22, 14, 10, 10], T.b);
    c.save(); c.translate(76, -8); c.rotate(-0.55); P([-8, -5, 9, -5, 11, 4, -9, 4], T.hoof); c.restore();
    var nh = [[-96, -100], [-116, -52], [-110, -16], [-106, -4]];
    limb(nh, [38, 15, 11, 11], T.b); hoofAt([-105, 0], T.hoof);
    // грива — лентой по гребню, чёлка между ушами
    c.beginPath(); c.moveTo(102, -210);
    c.bezierCurveTo(64, -214, 30, -180, 16, -146);
    c.bezierCurveTo(24, -150, 28, -154, 32, -160);
    c.bezierCurveTo(36, -158, 40, -160, 44, -168);
    c.bezierCurveTo(50, -168, 54, -172, 58, -180);
    c.bezierCurveTo(64, -181, 70, -186, 74, -192);
    c.bezierCurveTo(82, -194, 88, -198, 92, -202);
    c.bezierCurveTo(96, -201, 100, -202, 102, -210); c.closePath();
    c.fillStyle = T.d; c.fill();
    P([116, -206, 132, -199, 125, -190], T.d);
    // свет: тонкие светлые линии по верху
    c.lineCap = 'round';
    LN([-130, -146, -104, -157, -72, -150, -40, -146, -14, -148], T.l, 3);
    c.beginPath(); c.moveTo(100, -210); c.bezierCurveTo(66, -214, 36, -186, 26, -160); c.strokeStyle = T.l; c.lineWidth = 3; c.stroke();
    LN([120, -204, 134, -196, 148, -172, 162, -152], T.l, 3);
    LN([-150, -130, -165, -92], T.l, 2.5);
    // глаз
    C(130, -184, 3.2, T.l);
    // ноздря
    C(160, -138, 2.6, T.d);
    // попона и седло
    P([-30, -150, 24, -150, 28, -108, -26, -108], T.blank);
    R(-28, -126, 54, 7, T.blank2); R(-27, -116, 52, 4, T.blank2);
    c.beginPath(); c.moveTo(-26, -150); c.bezierCurveTo(-20, -164, -8, -160, 4, -156);
    c.bezierCurveTo(14, -154, 20, -160, 24, -170); c.lineTo(30, -166);
    c.bezierCurveTo(28, -152, 24, -146, 20, -142); c.lineTo(-24, -142); c.closePath();
    c.fillStyle = T.sad; c.fill();
    // повод: от руки к трензелю
    LN([46, -176, 102, -160, 150, -136], T.d, 2.4);
    // ---------- всадник ----------
    // ближняя нога: бедро вперёд, голень вниз, сапог в стремени
    limb([[4, -158], [28, -134], [24, -96]], [24, 16, 13], T.rid);
    P([14, -102, 36, -100, 44, -90, 14, -90], T.boot);
    R(16, -90, 26, 3, T.d);
    // корпус: спина, плечо, грудь, талия
    c.beginPath(); c.moveTo(-6, -160);
    c.bezierCurveTo(-10, -178, -8, -196, -2, -208);
    c.quadraticCurveTo(6, -216, 16, -214);
    c.lineTo(24, -211);
    c.bezierCurveTo(31, -204, 32, -192, 28, -180);
    c.bezierCurveTo(24, -172, 22, -166, 20, -160); c.closePath();
    c.fillStyle = T.rid; c.fill();
    // платок
    P([8, -214, 27, -212, 20, -200], T.scarf);
    // голова в профиль: затылок, лоб, нос, губы, подбородок
    c.beginPath(); c.moveTo(9, -213);
    c.bezierCurveTo(3, -219, 3, -230, 8, -236);
    c.lineTo(25, -236); c.lineTo(27, -231);
    c.lineTo(32, -226); c.lineTo(28, -224);
    c.lineTo(29, -220); c.lineTo(27, -216);
    c.bezierCurveTo(23, -213, 18, -213, 15, -210); c.closePath();
    c.fillStyle = T.rid; c.fill();
    // шляпа: тулья с ложбинкой, широкие поля с загибом
    c.beginPath(); c.moveTo(4, -236);
    c.bezierCurveTo(4, -250, 6, -256, 10, -258);
    c.quadraticCurveTo(17, -252, 24, -258);
    c.bezierCurveTo(28, -256, 30, -250, 30, -236); c.closePath();
    c.fillStyle = T.hat; c.fill();
    c.beginPath(); c.moveTo(-14, -240);
    c.quadraticCurveTo(-8, -234, 4, -236); c.lineTo(30, -236);
    c.quadraticCurveTo(42, -234, 48, -242);
    c.quadraticCurveTo(44, -230, 30, -230); c.lineTo(4, -230);
    c.quadraticCurveTo(-10, -230, -14, -240); c.closePath();
    c.fillStyle = T.hat; c.fill();
    R(4, -240, 26, 4, T.band);
    // рука с поводом
    limb([[14, -205], [25, -184], [45, -176]], [11, 9, 8], T.rid);
    // сигарета у рта, огонёк
    LN([29, -222, 38, -219], T.cig, 2.6);
    C(39, -219, 2.2, T.ember);
    // свет по силуэту всадника
    LN([28, -204, 27, -184, 21, -164], T.l, 2.2);
    LN([30, -236, 4, -236], T.l, 1.6);
    c.restore();
  }

  // ---------- пачка Marlboro: лицо + левый бок, крыша-шеврон, герб, надпись ----------
  function pack(x, y, w, h, side, T, sub) {   // x,y — левый верх лица; sub — надпись под Marlboro
    var dz = side, sy = h * 0.04;
    // тень растром вправо-вниз
    raster([x + w, y + h * 0.1, x + w + h * 0.15, y + h * 0.2, x + w + h * 0.15, y + h * 1.08, x + w * 0.2, y + h * 1.08, x, y + h], T.sh, 8, 2.3);
    // бок (на тон темнее)
    P([x - dz, y + sy, x, y, x, y + h, x - dz, y + h - sy], T.side);
    // крыша на боку
    P([x - dz, y + sy, x, y, x, y + h * 0.36, x - dz, y + h * 0.36 - sy * 0.4], T.redD);
    // лицо
    R(x, y, w, h, T.white);
    // крыша-шеврон: с боков ниже, в середине белое поднимается мысом
    P([x, y, x + w, y, x + w, y + h * 0.36, x + w / 2, y + h * 0.13, x, y + h * 0.36], T.red);
    // шов крышки Flip-Top
    LN([x, y + h * 0.2, x + w * 0.18, y + h * 0.2], 'rgba(0,0,0,.12)', 2);
    LN([x + w * 0.82, y + h * 0.2, x + w, y + h * 0.2], 'rgba(0,0,0,.12)', 2);
    LN([x - dz, y + h * 0.2 + sy * 0.6, x, y + h * 0.2], 'rgba(0,0,0,.25)', 2);
    // герб: золотой овал с двумя штрихами по бокам, на стыке красного и белого
    var gx = x + w / 2, gy = y + h * 0.17;
    EL(gx, gy, w * 0.1, w * 0.12, T.gold);
    EL(gx, gy, w * 0.065, w * 0.085, T.white);
    c.fillStyle = T.red; c.font = '700 ' + Math.round(w * 0.07) + 'px ' + SERIF; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('PM', gx, gy + 1);
    LN([gx - w * 0.12, gy + w * 0.05, gx - w * 0.17, gy - w * 0.06], T.gold, 3);
    LN([gx + w * 0.12, gy + w * 0.05, gx + w * 0.17, gy - w * 0.06], T.gold, 3);
    // надпись
    c.fillStyle = T.ink; c.textBaseline = 'alphabetic';
    c.save(); c.translate(gx, y + h * 0.56); c.scale(1, 1.18);
    c.font = '700 ' + Math.round(w * 0.2) + 'px ' + SERIF; c.fillText('Marlboro', 0, 0); c.restore();
    c.font = '600 ' + Math.round(w * 0.055) + 'px ' + BODY; c.fillStyle = T.ink;
    c.fillText(sub || 'FILTER CIGARETTES', gx, y + h * 0.67);
    // тонкая светлая линия по ребру
    LN([x, y + 2, x, y + h - 2], 'rgba(255,255,255,.7)', 2);
  }


  // ---------- мягкая пачка 1920-х: кремовая, Marlboro курсивом, Mild as May, сверху сигареты с красным кончиком ----------
  function softPack(x, y, w, h, side, T) {
    var dz = side;
    raster([x + w, y + h * 0.1, x + w + h * 0.15, y + h * 0.2, x + w + h * 0.15, y + h * 1.06, x + w * 0.2, y + h * 1.06, x, y + h], T.sh, 8, 2.3);
    // сигареты из открытого верха: белые, кончик красный
    [0.3, 0.5, 0.7].forEach(function (u, i) {
      var cx = x + w * u, top = y - 34 + i % 2 * 12;
      R(cx - 9, top, 18, 60, T.white); R(cx - 9, top, 18, 12, T.red);
      LN([cx - 9, top + 1, cx - 9, top + 58], 'rgba(0,0,0,.12)', 2);
    });
    // бок и лицо, верх мягкий — рваная фольга
    P([x - dz, y + 8, x, y + 2, x, y + h, x - dz, y + h - 8], T.creamD);
    c.beginPath(); c.moveTo(x, y + 6);
    c.lineTo(x + w * 0.18, y); c.lineTo(x + w * 0.3, y + 10); c.lineTo(x + w * 0.46, y + 2); c.lineTo(x + w * 0.62, y + 12);
    c.lineTo(x + w * 0.8, y + 3); c.lineTo(x + w, y + 8); c.lineTo(x + w, y + h); c.lineTo(x, y + h); c.closePath();
    c.fillStyle = T.cream; c.fill();
    R(x, y + 14, w, 10, T.foil);
    // тонкая золотая рамка и веер ар-деко
    c.strokeStyle = T.gold; c.lineWidth = 2.5; c.strokeRect(x + 12, y + 34, w - 24, h - 48);
    for (var q = 0; q < 3; q++) { c.beginPath(); c.arc(x + w / 2, y + h * 0.36, 16 + q * 12, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); }
    c.fillStyle = T.ink; c.textAlign = 'center'; c.textBaseline = 'alphabetic';
    c.font = 'italic 700 ' + Math.round(w * 0.2) + 'px ' + SERIF; c.fillText('Marlboro', x + w / 2, y + h * 0.58);
    c.font = 'italic 400 ' + Math.round(w * 0.1) + 'px ' + SERIF; c.fillText('Mild as May', x + w / 2, y + h * 0.7);
    LN([x, y + 8, x, y + h - 2], 'rgba(255,255,255,.6)', 2);
  }
  // ---------- пачка стиков 2014: та же крыша, ниже и уже, HeatSticks ----------
  function stickPack(x, y, w, h, side, T) {
    pack(x, y, w, h, side, T, 'HeatSticks');
  }

  var T = {
    b: '#3A1E14', d: '#24120C', l: 'rgba(255,214,150,.85)', hoof: '#140A06',
    sad: '#7A3E1E', blank: '#E9D8B4', blank2: '#B3141C',
    rid: '#2B1A14', boot: '#1C0F0A', hat: '#1F120D', band: '#8C5A2B', scarf: '#C8102E', cig: '#F4EEE2', ember: '#FF6A2A',
    red: '#C8102E', redD: '#93091F', white: '#FBFAF7', side: '#D8D2C8', gold: '#C9A24A', ink: '#141010', sh: 'rgba(70,30,18,.45)',
    cream: '#EFE4CC', creamD: '#D2C4A4', foil: '#D9D2C2'
  };

  if (o.only === 'packs') {   // эталон: три пачки на полке витрины (фраза 14)
    T.sh = 'rgba(0,0,0,.42)';
    R(0, 0, W, 600, '#241816');
    R(0, 300, W, 170, '#2C1E1B');
    // отражение четырёх шляп в стекле — едва видно
    [190, 360, 720, 890].forEach(function (hx) {
      c.fillStyle = 'rgba(255,236,214,.07)';
      c.beginPath(); c.ellipse(hx, 86, 70, 10, 0, 0, TAU); c.fill();
      c.beginPath(); c.moveTo(hx - 34, 84); c.bezierCurveTo(hx - 34, 54, hx - 20, 44, hx - 12, 44);
      c.quadraticCurveTo(hx, 52, hx + 12, 44); c.bezierCurveTo(hx + 20, 44, hx + 34, 54, hx + 34, 84); c.closePath(); c.fill();
    });
    softPack(140, 186, 190, 284, 28, T);
    pack(470, 188, 190, 282, 34, T);
    stickPack(796, 232, 168, 238, 30, T);
    // полка
    R(0, 470, W, 30, '#7A4E2C'); R(0, 470, W, 4, '#A8734A'); R(0, 500, W, 22, '#4E2F1A');
    // блики стекла
    P([600, 0, 690, 0, 420, 600, 330, 600], 'rgba(255,255,255,.07)');
    P([730, 0, 760, 0, 490, 600, 460, 600], 'rgba(255,255,255,.05)');
    c.fillStyle = '#C9BDB4'; c.font = '500 26px ' + MONO; c.textAlign = 'center'; c.textBaseline = 'alphabetic';
    c.fillText('1920-е · мягкая', 220, 566); c.fillText('1950-е · Flip-Top', 548, 566); c.fillText('2014 · стики', 866, 566);
    return;
  }
  if (o.only === 'horse') {   // отладка: конь крупно
    R(0, 0, W, H, '#F3E6CB');
    horse(560, 1300, 3.0, T);
    LN([40, 1300, 1040, 1300], '#999', 2);
    return;
  }

  // ===== дальний план: небо полосами, облака лентами, одно солнце, столовые горы =====
  R(0, 0, W, 470, '#4E1622'); R(0, 470, W, 360, '#7C2426'); R(0, 830, W, 290, '#AE3A2A'); R(0, 1120, W, 230, '#D2582F');
  R(70, 128, 420, 14, '#6A2232'); R(170, 162, 260, 9, '#6A2232'); R(640, 210, 380, 12, '#6A2232'); R(560, 1060, 300, 10, '#C24A2C');
  c.beginPath(); c.arc(540, 1350, 236, Math.PI, 0); c.fillStyle = '#F2B45A'; c.fill();
  c.beginPath(); c.arc(540, 1350, 168, Math.PI, 0); c.fillStyle = '#F7CB78'; c.fill();
  P([0, 1350, 0, 1196, 110, 1196, 150, 1240, 250, 1240, 296, 1350], '#47201A');
  P([800, 1350, 836, 1262, 880, 1262, 904, 1222, 1080, 1222, 1080, 1350], '#47201A');
  // ===== земля, трасса =====
  R(0, 1350, W, H - 1350, '#3A1C12');
  R(0, 1376, W, 64, '#2A1612'); R(0, 1376, W, 4, '#5A3020'); R(0, 1436, W, 4, '#5A3020');
  for (var dx = 20; dx < W; dx += 120) R(dx, 1406, 64, 5, '#E8B26A');
  R(0, 1440, W, H - 1440, '#4A2416');
  // ===== средний план: стойки щита, тень к нам (солнце за щитом), забор =====
  raster([210, 1380, 870, 1380, 700, 1700, 40, 1700], 'rgba(18,8,5,.38)', 19, 4.8);
  var ST = '#1E0E0A';
  R(286, 1000, 24, 378, ST); R(770, 1000, 24, 378, ST);
  LN([298, 1070, 240, 1004], ST, 8); LN([298, 1070, 356, 1004], ST, 8);
  LN([782, 1070, 724, 1004], ST, 8); LN([782, 1070, 840, 1004], ST, 8);
  R(286, 1214, 508, 8, ST);
  for (var fx = 6; fx < 260; fx += 50) R(fx, 1300, 11, 80, '#2C130C');
  R(0, 1316, 266, 5, '#2C130C'); R(0, 1344, 266, 5, '#2C130C');
  // ===== щит =====
  var BX = 56, BY = 360, BW = 968, BH = 630;
  R(BX - 12, BY - 12, BW + 24, BH + 24, ST);
  c.save(); c.beginPath(); c.rect(BX, BY, BW, BH); c.clip();
  // плакат: небо дня, красные скалы, пустыня — свой мир, без второго солнца
  R(BX, BY, BW, BH, '#F3E6CB');
  R(BX, BY + BH * 0.58, BW, BH * 0.42, '#E3A866');
  P([BX, BY + BH * 0.58, BX, BY + BH * 0.42, BX + 120, BY + BH * 0.42, BX + 150, BY + BH * 0.5, BX + 330, BY + BH * 0.5, BX + 370, BY + BH * 0.58], '#C2603A');
  P([BX + 500, BY + BH * 0.58, BX + 540, BY + BH * 0.47, BX + 620, BY + BH * 0.47, BX + 648, BY + BH * 0.4, BX + 760, BY + BH * 0.4, BX + 820, BY + BH * 0.58], '#C2603A');
  R(BX, BY + BH * 0.8, BW, BH * 0.2, '#C9824C');
  c.fillStyle = '#2B1A14'; c.textAlign = 'left'; c.textBaseline = 'alphabetic';
  c.font = 'italic 700 66px ' + SERIF; c.fillText('Marlboro Country', BX + 40, BY + 92);
  horse(BX + 290, BY + BH * 0.94, 1.5, T);
  pack(BX + 676, BY + 176, 190, 282, 34, T);
  // отогнутый угол: под ним розовый слой ар-деко с золотыми дугами
  var cx0 = BX + BW, cy0 = BY + BH, sz = 210;
  P([cx0, cy0, cx0, cy0 - sz, cx0 - sz, cy0], '#E7A9B6');
  c.save(); c.beginPath(); c.moveTo(cx0, cy0); c.lineTo(cx0, cy0 - sz); c.lineTo(cx0 - sz, cy0); c.closePath(); c.clip();
  c.strokeStyle = '#C9A24A'; c.lineWidth = 3;
  for (var q = 0; q < 5; q++) { c.beginPath(); c.arc(cx0, cy0, 40 + q * 40, Math.PI, Math.PI * 1.5); c.stroke(); }
  c.restore();
  P([cx0, cy0 - sz, cx0 - sz, cy0, cx0 - sz * 0.74, cy0 - sz * 0.62], '#EFE3CC');
  P([cx0, cy0 - sz, cx0 - sz * 0.74, cy0 - sz * 0.62, cx0 - sz * 0.6, cy0 - sz * 0.66], 'rgba(0,0,0,.16)');
  c.restore();
  // ===== площадка и лампы над щитом (ночью свет — сцена 9) =====
  R(BX - 12, BY + BH + 12, BW + 24, 10, ST);
  [BX + 180, BX + 480, BX + 780].forEach(function (lx) {
    LN([lx, BY - 12, lx + 10, BY - 60, lx + 54, BY - 78], ST, 6);
    P([lx + 40, BY - 92, lx + 80, BY - 82, lx + 72, BY - 62, lx + 34, BY - 72], ST);
    P([lx + 36, BY - 72, lx + 72, BY - 62, lx + 70, BY - 58, lx + 36, BY - 67], '#5A3020');
  });
  // ===== передний план: перекати-поле, песок по ветру =====
  c.strokeStyle = '#8A4A2A'; c.lineWidth = 4;
  for (var t = 0; t < 14; t++) { c.beginPath(); c.arc(900 + ((t * 13) % 21) - 10, 1530 + ((t * 7) % 17) - 8, 26 + ((t * 11) % 22), t * 0.9, t * 0.9 + 2.1); c.stroke(); }
  c.strokeStyle = 'rgba(242,180,90,.5)'; c.lineWidth = 3;
  [[90, 1500], [270, 1560], [500, 1510], [690, 1590], [210, 1650], [620, 1680], [960, 1640]].forEach(function (p) {
    c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(p[0] + 80, p[1] - 16); c.stroke();
  });
  if (o.guides === false) return;
  // ===== разметка кадра =====
  c.setLineDash([18, 14]); c.lineWidth = 3; c.strokeStyle = 'rgba(255,255,255,.75)';
  c.beginPath(); c.moveTo(0, 1480); c.lineTo(W, 1480); c.stroke();
  c.beginPath(); c.moveTo(0, 1720); c.lineTo(W, 1720); c.stroke(); c.setLineDash([]);
  c.fillStyle = 'rgba(255,255,255,.88)'; c.font = '500 28px ' + MONO; c.textAlign = 'left';
  c.fillText('Y 1480 · важное выше', 24, 1468); c.fillText('Y 1720 · субтитры', 24, 1708);
  c.textAlign = 'center'; c.font = '700 50px ' + BODY; c.lineWidth = 10; c.strokeStyle = '#120806'; c.lineJoin = 'round';
  c.strokeText('Это «Мальборо», и до', 540, 1800); c.fillStyle = '#FFFFFF'; c.fillText('Это «Мальборо», и до', 540, 1800);
}
if (typeof module !== 'undefined') module.exports = drawF0;
