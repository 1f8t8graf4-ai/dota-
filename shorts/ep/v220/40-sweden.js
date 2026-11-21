  // ================= мир 2: за иллюминатором — облака расходятся, внизу Швеция (строка 3, начало) =================
  // Вложен в иллюминатор салона (N2). Облака закрывают кадр, на нырке расходятся в стороны; ниже — лес, озёра, красные домики (вид сверху наискосок).
  // Камера летит к домику с горящим окном и влетает в окно: за ним мир 3 — деревянный стол (N3).
  let T2 = null, K2 = null;
  const HOUSE = { x: 560, y: 2350 }, N3 = { x: 560, y: 2350, m: 1 / 40 };   // v22.2: окно крупнее (30 × 52) — домик растёт вокруг окна, без «красной шторки»
  function swedenInit() {
    const a = T1; T2 = { dive: a.dive, jw: a.dive + 1.7 };   // v22.2: подлёт 1,7 с — облака, лес, домик; последние полсекунды камера уже в центре окна
    K2 = [KY(T2.dive + .3, 548, 1260, 1.12), KY(T2.dive + .8, 556, 1960, 2.0), KY(T2.dive + 1.22, N3.x, N3.y - 4, 5.2), KY(T2.jw, N3.x, N3.y, 1 / N3.m)];
    linkK(K1, K2, N2, true);
  }
  function cloud5(c, x, y, s, a = 1) { if (a <= 0) return; c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(s, s);
    [[-90, 10, 70], [-30, -20, 90], [50, -5, 80], [110, 20, 55], [0, 30, 80]].forEach(([dx, dy, r]) => circ(c, dx + 6, dy + 14, r, 'rgba(120,150,190,.35)'));
    [[-90, 10, 70], [-30, -20, 90], [50, -5, 80], [110, 20, 55], [0, 30, 80]].forEach(([dx, dy, r]) => circ(c, dx, dy, r, '#FFFFFF'));
    c.fillStyle = 'rgba(200,220,240,.6)'; c.fillRect(-160, 40, 320, 50); c.restore() }
  function tree5(c, x, y, s, dark) { poly(c, [x, y - 34 * s, x - 14 * s, y, x + 14 * s, y]); fill(c, dark ? C5.forestD : C5.forest); c.fillStyle = 'rgba(0,0,0,.18)'; poly(c, [x, y - 34 * s, x + 3 * s, y, x + 14 * s, y]); c.fill() }
  function house5(c, x, y, s, lit) {
    c.save(); c.translate(x, y); c.scale(s, s);
    c.fillStyle = 'rgba(10,30,20,.3)'; c.fillRect(-46, 26, 100, 10);
    poly(c, [-50, -20, 0, -62, 50, -20]); fill(c, '#3B2A2A'); c.fillStyle = C5.red; c.fillRect(-44, -20, 88, 50); c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(22, -20, 22, 50);
    c.strokeStyle = '#F4F1EA'; c.lineWidth = 3; c.strokeRect(-44, -20, 88, 50);
    c.fillStyle = '#F4F1EA'; c.fillRect(-36, -8, 18, 22); c.fillStyle = lit ? '#FFE7B0' : '#2B3A5A'; c.fillRect(-33, -5, 12, 16);
    c.restore();
  }
  function houseBig(c, t, x, y) {   // ближний домик (фасадом к камере): красные доски, белые углы, большое окно с тёплым светом — за стеклом стол (мир 3)
    c.save(); c.fillStyle = 'rgba(10,30,20,.35)'; c.fillRect(x - 70, y + 44, 150, 12);
    poly(c, [x - 74, y - 56, x, y - 108, x + 74, y - 56]); fill(c, '#3B2A2A'); poly(c, [x - 74, y - 56, x, y - 108, x + 74, y - 56]); lnB(c, 3, '#F4F1EA');
    c.fillStyle = '#4A3434'; c.fillRect(x + 30, y - 104, 14, 30);
    c.fillStyle = '#A8352B'; c.fillRect(x - 64, y - 56, 128, 102); c.fillStyle = 'rgba(0,0,0,.12)'; for (let xx = x - 60; xx < x + 64; xx += 8) c.fillRect(xx, y - 56, 1.4, 102);
    c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(x + 40, y - 56, 24, 102); c.fillStyle = '#F4F1EA'; c.fillRect(x - 66, y - 56, 6, 102); c.fillRect(x + 60, y - 56, 6, 102);
    c.fillStyle = '#F4F1EA'; c.fillRect(x + 36, y - 8, 20, 54); c.fillStyle = '#2E3A4E'; c.fillRect(x + 39, y - 5, 14, 51);   // дверь
    glow(c, x, y, 70, '#FFE7B0', .4);
    c.fillStyle = '#F4F1EA'; c.fillRect(x - 21, y - 32, 42, 64); c.fillRect(x - 25, y + 30, 50, 5);   // рама и подоконник
    c.save(); c.beginPath(); c.rect(x - 15, y - 26, 30, 52); c.clip(); c.fillStyle = '#FFE7B0'; c.fillRect(x - 15, y - 26, 30, 52); inNest(c, N3, cc => tableWorld(cc, t)); c.restore();
    c.restore();
  }
  function swedenWorld(c, t, inPort) {
    const a = T2 || { dive: 1e9, jw: 1e9 }, part = eio(at(t, a.dive - .1, a.dive + .55));
    vgrad(c, -2000, -1500, 5200, 2800, ['#6FA3DA', '#A9CDEE', '#DCEBF7']);
    // земля: лес, озёра, красные домики (с высоты, наискосок)
    c.fillStyle = '#3E6B45'; c.fillRect(-2000, 1300, 5200, 3000);
    const V = c.getTransform ? null : null;
    for (let i = 0; i < 9; i++) { const lx = -600 + H1(i * 3.3) * 2400, ly = 1450 + H1(i * 5.1) * 1300; c.beginPath(); c.ellipse(lx, ly, 120 + H1(i) * 160, 40 + H1(i * 2) * 50, 0, 0, TAU); fill(c, C5.lake);
      c.beginPath(); c.ellipse(lx - 20, ly - 8, 60, 10, 0, 0, TAU); fill(c, 'rgba(255,255,255,.3)') }
    for (let r = 0; r < 26; r++) for (let i = 0; i < 30; i++) { const x = -700 + i * 80 + (r % 2) * 40 + (H1(r * 31 + i) - .5) * 30, y = 1330 + r * 70 + (H1(r + i * 7) - .5) * 20;
      if (Math.abs(x - HOUSE.x) < 190 && Math.abs(y - HOUSE.y) < 150) continue; if (H1(r * 13.7 + i * 2.1) < .82) tree5(c, x, y, .9 + .02 * r, H1(i + r) > .5) }
    [[-120, 1720, .9], [900, 1600, .8], [260, 2050, 1], [1180, 2240, 1.1], [-260, 2520, 1.1], [980, 2700, 1.2]].forEach(([x, y, s]) => house5(c, x, y, s, false));
    houseBig(c, t, HOUSE.x, HOUSE.y);   // окно домика: за ним мир 3 (стол), он виден, когда камера подлетает
    // облака: закрывают кадр за иллюминатором, на нырке расходятся
    [[-140, 760, 1.6, -1], [360, 640, 2.0, -1], [820, 800, 1.7, 1], [1240, 680, 1.9, 1], [140, 1080, 2.2, -1], [700, 1150, 2.4, 1], [1100, 1240, 1.8, 1], [-300, 1240, 1.9, -1], [420, 900, 2.6, 1]].forEach(([x, y, s, d], i) =>
      cloud5(c, x + d * 900 * part + Math.sin(t * .3 + i) * 12, y + 160 * part, s * (1 + .3 * part), 1));
  }
  function swedenShot(c, t) { const q = camObj(camAt(K2, t)); layer(c, q, 1, cc => swedenWorld(cc, t, false)) }
