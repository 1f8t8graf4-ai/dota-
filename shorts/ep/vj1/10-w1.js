  // ================= мир 1: ночной кампус Стэнфорда → огонёк сигареты → в нём табло из будущего =================
  const E1 = { x: 776, y: 1267 }; let W1K = null, TAB = 0, T1 = {};
  function w1Init() {
    const p = PH; TAB = p[1].b + .06;
    T1 = { pan0: Wd('знаешь') - .25, on: Wd('станешь') - .2, off: TAB - .22 };
    W1K = [KY(0, 520, 900, .78), KY(1.6, 575, 1020, 1.04), KY(p[0].b, 625, 1090, 1.32), KY(T1.pan0 + .25, 700, 1180, 2.6), KY(T1.pan0 + .8, 772, 1262, 24), KY(T1.pan0 + 1.25, 775.6, 1266.6, 70), KY(TAB - .32, 776, 1267, 92), KY(TAB, 776, 1267, 200)];
  }
  function palm(c, x, y, h, lean, t) {
    c.beginPath(); c.moveTo(x - 9, y); c.quadraticCurveTo(x + lean * .5, y - h * .5, x + lean, y - h); c.lineTo(x + lean + 8, y - h); c.quadraticCurveTo(x + lean * .5 + 12, y - h * .5, x + 9, y); c.closePath(); fill(c, '#141830');
    for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * .48 + Math.sin(t * 1.3 + i) * .03, L = 130 + (i % 2) * 30;
      c.beginPath(); c.moveTo(x + lean + 4, y - h); c.quadraticCurveTo(x + lean + Math.cos(a) * L * .6, y - h + Math.sin(a) * L * .6 - 40, x + lean + Math.cos(a) * L, y - h + Math.sin(a) * L + 20); lnW(c, 18, '#141830') }
  }
  function tower(c, x, t) {   // башня с куполом (силуэт), окна наверху светятся
    c.fillStyle = '#171b34'; c.fillRect(x - 60, 560, 120, 640); c.fillRect(x - 72, 540, 144, 34);
    c.beginPath(); c.moveTo(x - 54, 540); c.quadraticCurveTo(x, 400, x + 54, 540); c.closePath(); fill(c, '#171b34');
    c.fillRect(x - 6, 380, 12, 50); circ(c, x, 376, 10, '#171b34');
    for (let i = 0; i < 3; i++) { rr(c, x - 44 + i * 32, 590, 24, 70, 10); fill(c, rgba('#ffd479', .55 + .2 * Math.sin(t * 2 + i))) }
    for (let r = 0; r < 6; r++) { c.fillStyle = 'rgba(255,212,121,.16)'; c.fillRect(x - 40, 720 + r * 74, 14, 30); c.fillRect(x + 26, 720 + r * 74, 14, 30) }
  }
  function quad(c) {   // корпус с арками и черепичной крышей
    c.fillStyle = '#1b2040'; c.fillRect(-700, 1010, 2500, 220);
    c.fillStyle = '#4a2430'; poly(c, [-720, 1012, 1820, 1012, 1790, 965, -690, 965]); c.fill();
    for (let i = 0; i < 26; i++) { const x = -640 + i * 96; c.beginPath(); c.moveTo(x, 1230); c.lineTo(x, 1100); c.arc(x + 34, 1100, 34, Math.PI, 0); c.lineTo(x + 68, 1230); c.closePath(); fill(c, '#0f1228');
      if (i % 4 === 1) { c.beginPath(); c.arc(x + 34, 1100, 26, Math.PI, 0); c.closePath(); fill(c, 'rgba(255,212,121,.18)') } }
  }
  function hero(c, t) {   // силуэт со спины: голова, плечи; лунный контровой свет справа
    const sway = Math.sin(t * 1.1) * 3;
    c.save(); c.translate(sway, 0);
    c.beginPath(); c.moveTo(330, 1960); c.bezierCurveTo(340, 1600, 420, 1470, 540, 1420); c.lineTo(560, 1360); c.lineTo(650, 1360); c.lineTo(668, 1420);
    c.bezierCurveTo(800, 1470, 880, 1600, 900, 1960); c.closePath(); fill(c, '#070912');
    c.beginPath(); c.ellipse(606, 1262, 92, 106, 0, 0, TAU); fill(c, '#070912');
    c.beginPath(); c.ellipse(606, 1262, 92, 106, 0, -1.25, .55); lnW(c, 5, 'rgba(159,220,247,.55)');
    c.beginPath(); c.moveTo(668, 1420); c.bezierCurveTo(800, 1470, 880, 1600, 900, 1960); lnW(c, 5, 'rgba(159,220,247,.4)');
    // сигарета из-за головы, огонёк — отдельно (ember)
    c.save(); c.translate(690, 1286); c.rotate(-.24); rr(c, 0, -6, 80, 12, 4); fill(c, '#f4f1ea'); c.restore();
    c.restore();
  }
  function drawW1(c, t, q) {
    const g = c.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#0b1124'); g.addColorStop(.62, '#1c2547'); g.addColorStop(1, '#2a2f55'); c.fillStyle = g; c.fillRect(0, 0, WW, HH);
    lay(c, q, .3, 540, 990, c => { for (let i = 0; i < 70; i++) { const x = -300 + H1(i * 3.1) * 1700, y = -200 + H1(i * 5.7) * 1100; circ(c, x, y, 1.5 + H1(i) * 2.5, rgba('#eef2f7', .35 + .4 * Math.abs(Math.sin(t * (1 + H1(i * 2)) + i)))) }
      glow(c, 860, 330, 260, '#cfe8ff', .18); circ(c, 860, 330, 64, '#eef2f7'); circ(c, 880, 318, 12, 'rgba(160,170,190,.35)'); circ(c, 842, 346, 8, 'rgba(160,170,190,.3)') });
    lay(c, q, .6, 540, 990, c => { tower(c, 250, t); palm(c, 90, 1200, 430, 40, t); palm(c, 980, 1200, 380, -30, t); quad(c) });
    applyCam(c, q);
    c.fillStyle = '#121633'; c.fillRect(-600, 1225, 2300, 900);
    hero(c, t);
    const fl = .82 + .18 * Math.sin(t * 9) * Math.sin(t * 3.7);
    glow(c, E1.x, E1.y, 46, '#fb923c', .55 * fl); ember(c, E1.x, E1.y, 7, t, fl);
  }
  function shotW1(c, t) {
    if (!W1K) w1Init(); const q = camOf(W1K, t); c.save(); drawW1(c, t, q); c.restore();
    // табло из будущего — в огоньке (экранные координаты)
    const kon = at(t, T1.on, T1.on + .16), koff = at(t, T1.off, T1.off + .16);
    if (kon > 0 && koff < 1) { const [sx, sy] = toScr(q, E1.x, E1.y), w = 9.6 * q.z;
      c.save(); c.setTransform(1, 0, 0, 1, 0, 0); const sy2 = kon < 1 ? lp(.03, 1, eo(kon)) : lp(1, .02, ei(koff)); c.globalAlpha = koff < 1 ? 1 - at(koff, .7, 1) : 1;
      moneyPanel(c, sx, sy, w, 38e9, { lab: 'ТВОЁ БУДУЩЕЕ', sy: sy2 }); c.restore() }
  }
