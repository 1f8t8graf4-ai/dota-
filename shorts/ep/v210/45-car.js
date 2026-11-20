  // ================= мир D — ночная машина, вид с заднего сиденья (строки 5–6) =================
  // Держатель лежит в подстаканнике между сиденьями. «куртка не пахнет» — куртка на спинке пассажирского сиденья, «пепла нет» — пепельница пустая,
  // «прямо в машине» — белая фигурка за рулём, к потолку тает облачко пара (устройства у рта не показываем). За стеклом — ночной город и фары (#158).
  // «Это айкос…» — на экране машины идёт японское шоу; камера ныряет в экран — это телевизор в магазине (мир F).
  let TD4 = null, KD = null, NDF = null;
  const MCAR = 1.6, HD = { x: 540, y: 1310 }, SCR = { x: 540, y: 860, w: 300 }, WSH = [70, 780, 1010, 780, 930, 170, 150, 170];
  function carInit() {
    const w5 = (q, n) => Ws('s5', q, n), w6 = (q, n) => Ws('s6', q, n);
    TD4 = { j: TC4.jCD, kurt: w5('куртка'), pep: w5('пепла'), zat: w5('затянуться'), mash: w5('машине'), aik: w6('айкос'), shest: w6('шестнадцатом'), rash: w6('расхвалили'),
      kom: w6('комики'), shou: w6('шоу') };
    const a = TD4; a.jDF = a.kom + .95;
    KD = [KY(a.kurt + .25, 610, 1230, 1.45), KY(a.pep + .25, 560, 1380, 1.55), KY(a.mash + .05, 400, 1040, 1.22), KY(a.aik + .25, 540, 905, 1.5), KY(a.shest + .55, 540, 862, 3.6),
      KY(a.kom + .3, 540, 862, 4.3), KY(a.jDF, 540, 862, 12.5)];
    const m = SCR.w / TVF.w; NDF = { x: SCR.x - (TVF.x - 540) * m, y: SCR.y - (TVF.y - 960) * m, m };   // телевизор магазина = экран машины
  }
  function cityFar(c, t) {   // ночной город за лобовым стеклом
    ['#0E1230', '#151A40', '#1E2150', '#2B2558'].forEach((col, i) => { c.fillStyle = col; c.fillRect(-1500, -200 + i * 230, 4200, 232) });
    for (let i = 0; i < 18; i++) { const x = -500 + i * 130 + H1(i) * 40, h = 240 + H1(i * 3.3) * 380, w = 90 + H1(i * 5.1) * 60; c.fillStyle = i % 2 ? '#161A3A' : '#1B2046'; c.fillRect(x, 820 - h, w, h);
      c.fillStyle = 'rgba(247,203,120,.6)'; for (let r = 0; r < h / 40 - 1; r++) for (let k = 0; k < w / 30 - 1; k++) if (H1(i * 31 + r * 7 + k) > .62) c.fillRect(x + 12 + k * 30, 820 - h + 18 + r * 40, 12, 16) }
    c.fillStyle = '#0B0D22'; c.fillRect(-1500, 790, 4200, 400);
    for (let i = 0; i < 6; i++) { const x = ((i * 420 - t * 260) % 2520 + 2520) % 2520 - 700; c.fillStyle = '#2A2F55'; c.fillRect(x, 560, 8, 240); circ(c, x + 4, 556, 18, '#FFE2A0'); glow(c, x + 4, 556, 90, '#FFD27A', .35) }
    for (let i = 0; i < 4; i++) { const u = ((t * .35 + i * .27) % 1), x = lp(1500, -500, u), y = 770 + (i % 2) * 14; circ(c, x, y, 9, '#FFF2C8'); circ(c, x + 40, y, 9, '#FFF2C8'); glow(c, x + 20, y, 80, '#FFE6B8', .35) }   // фары встречных
  }
  function navDraw(c, t, cx, cy, w) {   // экран машины до шоу: ночной навигатор — тёмная карта, дороги, стрелка
    const h = w * 9 / 16, x0 = cx - w / 2, y0 = cy - h / 2; c.fillStyle = '#10142C'; c.fillRect(x0, y0, w, h);
    c.strokeStyle = 'rgba(126,150,220,.35)'; c.lineWidth = 3; c.beginPath();
    for (let i = 0; i < 5; i++) { const yy = y0 + h * (.15 + i * .18) + ((t * 18) % (h * .18)); c.moveTo(x0, yy); c.lineTo(x0 + w, yy - h * .12) } for (let i = 0; i < 4; i++) { const xx = x0 + w * (.12 + i * .26); c.moveTo(xx, y0); c.lineTo(xx + w * .05, y0 + h) } c.stroke();
    c.strokeStyle = '#4FA3FF'; c.lineWidth = 7; c.beginPath(); c.moveTo(cx, y0 + h); c.lineTo(cx, cy + 6); c.lineTo(cx + w * .2, cy - h * .3); c.stroke();
    poly(c, [cx, cy - 16, cx + 13, cy + 14, cx, cy + 6, cx - 13, cy + 14]); fill(c, '#FFFFFF');
  }
  function carInterior(c, t) {
    c.save(); c.beginPath(); c.rect(-3000, -3000, 7000, 7000); poly(c, WSH); c.fillStyle = '#14162A'; c.fill('evenodd'); c.restore();
    poly(c, WSH); lnB(c, 10, '#0C0E1E'); c.save(); poly(c, WSH); c.clip(); glint(c, 70, 170, 940, 610, .05); c.restore();
    rr(c, 480, 210, 120, 46, 12); fill(c, '#0C0E1E'); c.fillStyle = 'rgba(160,180,230,.25)'; c.fillRect(490, 218, 100, 8);   // зеркало
    rr(c, -300, 760, 1680, 200, 40); fill(c, '#1B1E33'); c.fillStyle = 'rgba(126,150,220,.18)'; c.fillRect(-300, 768, 1680, 6);   // панель
    for (const x of [120, 960]) { rr(c, x - 50, 820, 100, 40, 10); fill(c, '#0F1124') }
    glow(c, SCR.x, SCR.y, 260, '#7EA6FF', .12);   // свечение экрана — под ним, на сам экран не ложится (стык с телевизором магазина)
    rr(c, SCR.x - SCR.w / 2 - 14, SCR.y - SCR.w * 9 / 32 - 14, SCR.w + 28, SCR.w * 9 / 16 + 28, 16); fill(c, '#0B0C18');
    c.save(); c.beginPath(); c.rect(SCR.x - SCR.w / 2, SCR.y - SCR.w * 9 / 32, SCR.w, SCR.w * 9 / 16); c.clip(); const ks = TD4 ? at(t, TD4.aik - .45, TD4.aik - .05) : 1;
    if (ks < 1) navDraw(c, t, SCR.x, SCR.y, SCR.w); if (ks > 0) A(c, ks, () => showDraw(c, t, SCR.x, SCR.y, SCR.w)); c.restore();   // v21.1: шоу — с «Это айкос», до этого навигатор
    c.beginPath(); c.arc(255, 940, 170, 0, TAU); lnB(c, 30, '#0E1022'); c.beginPath(); c.arc(255, 940, 170, Math.PI * 1.1, Math.PI * 1.6); lnB(c, 6, 'rgba(160,180,230,.25)');   // руль
  }
  function driver(c, t) { c.save(); circ(c, 250, 1000, 64, '#F4F1EA'); c.fillStyle = shd('#F4F1EA', .25); c.beginPath(); c.arc(250, 1000, 64, -.6, 1.2); c.lineTo(250, 1000); c.fill();
    rr(c, 125, 1068, 250, 220, 90); fill(c, '#F4F1EA'); c.fillStyle = shd('#F4F1EA', .25); c.fillRect(300, 1080, 70, 200); c.restore() }
  function seats(c, t) {
    rr(c, 80, 1180, 340, 520, 60); cel(c, 80, 1180, 340, 520, '#262A45', { sw: .22, ha: .12 }); rr(c, 150, 1150, 200, 70, 30); fill(c, '#262A45');   // спинка водителя
    rr(c, 660, 1080, 340, 620, 60); cel(c, 660, 1080, 340, 620, '#262A45', { sw: .22, ha: .12 }); rr(c, 760, 980, 150, 110, 30); cel(c, 760, 980, 150, 110, '#2C3150', { sw: .25, ha: .12 });   // спинка пассажира и подголовник
    c.save(); c.translate(830, 1090); poly(c, [-200, -30, 190, -40, 210, 120, 150, 330, 60, 300, -40, 340, -140, 300, -210, 150]); cel(c, -210, -40, 420, 380, '#6B6A3E', { sw: .3, hx: .12 });   // куртка через спинку
    poly(c, [-60, -34, 60, -38, 30, 30, -30, 30]); fill(c, '#55542F'); c.fillStyle = 'rgba(30,30,16,.35)'; c.fillRect(-4, 0, 8, 320); circ(c, -14, 80, 7, '#C9A24A'); circ(c, -14, 170, 7, '#C9A24A'); c.restore();
  }
  function console4(c, t) {
    const a = TD4; rr(c, 330, 1240, 420, 460, 30); cel(c, 330, 1240, 420, 460, '#1E2138', { sw: .2, ha: .1 }); rr(c, 340, 1262, 400, 96, 22); fill(c, '#111326');   // подстаканник
    iqos4(c, HD.x, HD.y, HC.L / MCAR, { left: true, stick: 1, name: true, shadow: false });
    const op = eio(at(t, a.pep - .2, a.pep + .2)), ax = 540, ay = 1470;   // пепельница: крышка откидывается — внутри пусто и чисто
    rr(c, ax - 110, ay - 50, 220, 100, 14); fill(c, '#0F1124'); rr(c, ax - 96, ay - 36, 192, 72, 10); cel(c, ax - 96, ay - 36, 192, 72, '#9AA1B3', { sw: .3, ha: .4 });
    c.save(); c.translate(ax, ay - 50); c.scale(1, Math.cos(op * 2.4)); rr(c, -110, 0, 220, 100, 14); fill(c, op < .5 ? '#2A2E4A' : '#3A3F5E'); c.restore();
  }
  function carPuff(c, t) {   // облачко пара тает под потолком
    const a = TD4, k = at(t, a.mash - .35, a.mash + 1.4); if (k <= 0 || k >= 1) return; const y = lp(960, 560, eo(k)), r = lp(30, 120, eo(k)), al = .55 * Math.sin(Math.PI * k);
    for (let i = 0; i < 5; i++) { const px = 250 + Math.sin(i * 2.1 + t) * r * .6, py = y - i * r * .25, rr0 = r * (.7 + H1(i) * .5), g = c.createRadialGradient(px, py, 0, px, py, rr0); g.addColorStop(0, `rgba(244,241,234,${al * .45})`); g.addColorStop(.6, `rgba(244,241,234,${al * .25})`); g.addColorStop(1, 'rgba(244,241,234,0)'); c.fillStyle = g; c.fillRect(px - rr0, py - rr0, rr0 * 2, rr0 * 2) }
  }
  function sweepLight(c, t) {   // свет фонарей пробегает по салону
    const u = (t * .42) % 1; if (u > .45) return; const x = lp(1500, -600, u / .45); c.save(); c.globalAlpha *= .07 * Math.sin(Math.PI * u / .45);
    poly(c, [x, -400, x + 260, -400, x - 200, 2400, x - 460, 2400]); fill(c, '#FFE6B8'); c.restore();
  }
  function carWorld(c, t, q) {
    layerRel(c, q, { x: 540, y: 960, z: 1, r: 0 }, .35, cc => cityFar(cc, t));
    layer(c, q, 1, cc => { carInterior(cc, t); driver(cc, t); seats(cc, t); console4(cc, t); carPuff(cc, t) });
    layerRel(c, q, { x: 540, y: 960, z: 1, r: 0 }, 1.2, cc => A(cc, 1 - at(Math.log(q.z), .7, 1.3), () => sweepLight(cc, t)));   // при нырке в экран свет фонарей не бежит
  }
  function carShot(c, t) { const q = camObj(camAt(KD, t)); carWorld(c, t, q) }
