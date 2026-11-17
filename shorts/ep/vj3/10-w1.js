  // ================= мир 1: ночной кампус Стэнфорда → огонёк сигареты → в нём табло из будущего =================
  const E1 = { x: 850, y: 1250 }; let W1K = null, TAB = 0, T1 = {};   // v3: огонёк дальше от головы — видно бумагу, ободок и пепел
  function w1Init() {
    const p = PH; TAB = p[1].b + .06;
    T1 = { pan0: Wd('знаешь') - .25, on: Wd('станешь') - .2, off: TAB - .5, adam: Wd('адам') - .1 };   // v3: табло — в дыму над сигаретой, нырок в огонёк — только в конце (без оранжевой пустоты)
    W1K = [KY(0, 520, 900, .78), KY(1.6, 575, 1020, 1.04), KY(p[0].b, 625, 1090, 1.32), KY(T1.pan0 + .25, E1.x - 90, E1.y - 70, 2.6), KY(T1.on + .3, E1.x - 50, E1.y - 115, 3.0), KY(TAB - .45, E1.x - 30, E1.y - 80, 3.3), KY(TAB - .12, E1.x - 2, E1.y - 4, 30), KY(TAB, E1.x, E1.y, 200)];
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
      if (i % 4 === 1) { c.beginPath(); c.arc(x + 34, 1100, 26, Math.PI, 0); c.closePath(); fill(c, 'rgba(255,212,121,.18)') }
      if (i % 3 === 1) { c.beginPath(); c.moveTo(x + 34, 1066); c.lineTo(x + 34, 1100); lnW(c, 2, '#4a3a2a'); glow(c, x + 34, 1112, 46, '#ffd479', .45); rr(c, x + 24, 1100, 20, 26, 5); fill(c, '#ffd479'); lnW(c, 2, '#4a3a2a') } }   // v2: тёплые фонари в арках
  }
  function hero(c, t) {   // силуэт со спины: голова, плечи; лунный контровой свет справа
    const sway = Math.sin(t * 1.1) * 3;
    c.save(); c.translate(sway, 0);
    c.beginPath(); c.moveTo(330, 1960); c.bezierCurveTo(340, 1600, 420, 1470, 540, 1420); c.lineTo(560, 1360); c.lineTo(650, 1360); c.lineTo(668, 1420);
    c.bezierCurveTo(800, 1470, 880, 1600, 900, 1960); c.closePath(); fill(c, '#070912');
    cig1(c, t);   // v3: сигарета детально — из-за головы торчит бумага, пепел, огонёк; дым струйкой
    c.beginPath(); c.ellipse(606, 1252, 122, 132, 0, 0, TAU); fill(c, '#0b0e1c'); c.beginPath(); c.ellipse(606, 1252, 122, 132, 0, -1.3, .7); lnW(c, 5, 'rgba(159,220,247,.45)');   // v2: капюшон худи
    c.beginPath(); c.ellipse(606, 1262, 92, 106, 0, 0, TAU); fill(c, '#070912');
    c.beginPath(); c.ellipse(606, 1262, 92, 106, 0, -1.25, .55); lnW(c, 5, 'rgba(159,220,247,.55)');
    c.beginPath(); c.moveTo(668, 1420); c.bezierCurveTo(800, 1470, 880, 1600, 900, 1960); lnW(c, 5, 'rgba(159,220,247,.4)');
    // v3: волосы торчат над капюшоном, ухо справа, шнурки капюшона
    c.beginPath(); c.moveTo(528, 1196); for (let i = 0; i <= 9; i++) { const a = Math.PI * (1.08 + i * .09), r = 98 + (i % 2 ? 16 : 0); c.lineTo(606 + Math.cos(a) * r, 1250 + Math.sin(a) * r * 1.05) } c.closePath(); fill(c, '#070912');
    c.beginPath(); c.ellipse(694, 1272, 14, 26, .15, 0, TAU); fill(c, '#070912'); c.beginPath(); c.ellipse(694, 1272, 14, 26, .15, -1.4, 1.2); lnW(c, 4, 'rgba(159,220,247,.5)');
    c.beginPath(); c.moveTo(574, 1400); c.lineTo(566, 1478); c.moveTo(640, 1400); c.lineTo(648, 1484); lnW(c, 5, 'rgba(159,220,247,.35)');
    c.restore();
  }
  function cig1(c, t) {   // сигарета: фильтр у рта (за головой), золотой ободок, бумага, пепел, огонёк в E1; струйка дыма
    const a = -.24, L = 170, sx = E1.x - Math.cos(a) * L, sy = E1.y - Math.sin(a) * L;
    c.save(); c.translate(sx, sy); c.rotate(a);
    rr(c, 0, -9, 46, 18, 6); cel(c, 0, -9, 46, 18, '#d99a4e', { hw: .1, hy: .05, hh: .3 }); for (let i = 0; i < 6; i++) circ(c, 6 + H1(i) * 34, -5 + H1(i * 3) * 10, 1.6, 'rgba(120,70,20,.5)');
    c.fillStyle = '#e8c26a'; c.fillRect(46, -9, 6, 18);
    rr(c, 52, -9, L - 80, 18, 2); cel(c, 52, -9, L - 80, 18, '#f4f1ea', { hw: .1, hy: .05, hh: .3 }); c.fillStyle = 'rgba(30,35,64,.12)'; c.fillRect(52, 3, L - 80, 6);
    rr(c, L - 28, -9, 20, 18, 3); fill(c, '#8f8a86'); for (let i = 0; i < 5; i++) circ(c, L - 26 + H1(i * 7) * 16, -6 + H1(i * 5) * 12, 2, '#4b4744');
    c.beginPath(); c.rect(0, -9, L - 8, 18); lnW(c, 3, '#0b0e1c');
    c.restore();
    for (let j = 0; j < 3; j++) { const ph = (t * .32 + j / 3) % 1; c.save(); c.globalAlpha *= .4 * Math.sin(Math.PI * ph); c.beginPath(); c.moveTo(E1.x, E1.y - 6);
      for (let i = 1; i <= 12; i++) { const u = i / 12; c.lineTo(E1.x + Math.sin(u * 5 + t * 1.6 + j * 2) * 26 * u + 30 * u * ph, E1.y - 6 - u * 420 * (.35 + ph)) } lnW(c, 7 - 2 * j, '#d7dde8'); c.restore() }
  }
  function namePlate(c, t, t0, t1, who, name, sub) {   // плашка героя, как у dynastixxx: слева сверху, въезжает и уезжает влево
    const ki = spr(at(t, t0, t0 + .5)), ko = ei(at(t, t1, t1 + .3)); if (ki <= 0 || ko >= 1) return;
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.translate(-560 * (1 - ki) - 700 * ko, 0);
    rr(c, 56, 214, 560, 160, 18); fill(c, 'rgba(5,8,20,.82)'); c.fillStyle = '#fb923c'; c.fillRect(56, 214, 12, 160); rr(c, 56, 214, 560, 160, 18); lnW(c, 3, 'rgba(238,242,247,.35)');
    tx(c, who, 96, 248, { f: 'U', w: 800, s: 26, c: '#fb923c', al: 'left', ls: 4 }); tx(c, name, 96, 298, { f: 'U', w: 800, s: 52, c: '#ffffff', al: 'left', mw: 500 }); tx(c, sub, 96, 346, { f: 'M', w: 800, s: 24, c: '#9fdcf7', al: 'left', ls: 2 });
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
    if (kon > 0 && koff < 1) { const [sx, sy] = toScr(q, E1.x - 40, E1.y - 230), w = 360;   // v3: табло вспыхивает в дыму над сигаретой
      c.save(); c.setTransform(1, 0, 0, 1, 0, 0); const sy2 = kon < 1 ? lp(.03, 1, eo(kon)) : lp(1, .02, ei(koff));
      moneyPanel(c, sx, sy, w, 38e9, { lab: 'ТВОЁ БУДУЩЕЕ', sy: sy2 }); c.restore() }
    namePlate(c, t, T1.adam, TAB - .9, 'ТЫ', 'АДАМ БОУЭН', 'СТУДЕНТ СТЭНФОРДА');
  }
