  // ================= мир CH (конец фразы 6): ночной Чикаго. v20.2 — по разбору Gemini: сигареты больше не проходят сквозь крышу лавки.
  // Мир CH вложен в пробку самой высокой сигареты (NCH, считается в wcInit): камера ныряет в пробку — это золотая корона небоскрёба; отъезд —
  // четыре белые башни среди ночных домов и луна; справа въезжает дом Бёрнетта в разрезе (WoT #076): освещённые этажи с фигурами, в одном — его кабинет (мир 7).
  let KCH = null;
  const TWM = .283, TWW = 120, TWT = 3, TWR = [{ x: 240, top: 820 }, { x: 440, top: 640 }, { x: 640, top: 760 }, { x: 840, top: 560 }];   // башни в мире CH; TWT — в чью пробку ныряем
  const CORK = 44 / TWM;   // пробка сигареты = полоса короны башни
  const BUR = { x0: 1180, x1: 1780, top: 380, cut: [1780, 760, 1300, 1860], slabs: [760, 980, 1200, 1420, 1640, 1860] };   // дом Бёрнетта; разрез — треугольник у правого края
  const ROOM = { x: 1635, y: 1530, w: 270, h: 200, m: 270 / 1500 };   // кабинет Бёрнетта (этаж 1420…1640): мир 7 вложен сюда
  function chInit() {
    const a = TC;
    KCH = [KY(a.rekl + .42, 760, 860, 1.22), KY(a.leo + .02, 800, 1020, .68), KY(a.bern - .03, 1470, 1430, .8), KY(a.end - .32, ROOM.x, ROOM.y, 3.4), KY(a.end, ROOM.x, ROOM.y, 1.96 / ROOM.m)];
  }
  function burX(t) { const a = TC; return (1 - eo(at(t, a.leo - .55, a.bern))) * 1400 }   // дом въезжает справа
  function cutX(y) { const [x0, y0, x1, y1] = BUR.cut; return lp(x0, x1, (y - y0) / (y1 - y0)) }
  function sitter(c, x, y, s, col, o = {}) {   // фигура за столом сбоку (смотрит вправо): стул, тело, рука к машинке / доске
    c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = col;
    c.fillRect(-34, -64, 8, 64); c.fillRect(-34, -64, 40, 8);   // стул
    rr(c, -26, -150, 44, 92, 14); c.fill(); circ(c, 0, -172, 20, col); if (o.hat) { c.fillRect(-26, -192, 52, 7); rr(c, -16, -212, 32, 22, 6); c.fill() }
    limb(c, [[6, -132], [40, -104], [70, -110]], [12, 10, 9], col); limb(c, [[-6, -64], [30, -60], [34, 0]], [16, 14, 12], col);
    if (o.desk !== false) { c.fillRect(56, -86, 110, 10); c.fillRect(150, -76, 8, 76); rr(c, 76, -112, 54, 26, 5); c.fill(); c.fillStyle = 'rgba(255,255,255,.85)'; c.fillRect(88, -134, 30, 24) }   // стол и машинка с листом
    c.restore();
  }
  function burnettB(c, t) {
    const { x0, x1, top, slabs } = BUR, dx = burX(t), [cxa, cya, cxb, cyb] = BUR.cut; c.save(); c.translate(dx, 0);
    c.fillStyle = '#1C2352'; c.fillRect(x0 + 70, top - 130, x1 - x0 - 140, 140); c.fillRect(x0 + 170, top - 230, x1 - x0 - 340, 110); c.fillRect(x0 + 292, top - 420, 16, 200);   // ступени ар-деко и шпиль
    c.fillStyle = '#20285A'; c.fillRect(x0, top, x1 - x0, 3200); c.fillStyle = '#171D47'; c.fillRect(x1 - 90, top, 90, 3200);
    for (let k = 0; k < 24; k++) for (let m = 0; m < 5; m++) { const wx = x0 + 34 + m * 104, wy = top + 50 + k * 110; if (wx + 70 > cutX(wy) && wy > cya - 40 && wy < cyb) continue;
      c.fillStyle = H1(k * 7 + m * 3) > .55 ? 'rgba(253,230,138,.55)' : '#141A3E'; c.fillRect(wx, wy, 70, 56) }
    c.save(); poly(c, [cxa, cya, cxa, cyb, cxb, cyb]); c.clip();   // разрез: этажи изнутри
    for (let f = 0; f < slabs.length - 1; f++) { const fy0 = slabs[f], fy1 = slabs[f + 1]; c.fillStyle = ['#E3BE7E', '#EBCB8C', '#E5C384', '#F0D29A', '#E8C688'][f]; c.fillRect(x0, fy0, x1 - x0, fy1 - fy0);
      c.fillStyle = 'rgba(120,70,30,.18)'; c.fillRect(x0, fy1 - 46, x1 - x0, 28) }   // плинтус
    const ink = '#2A2238';
    sitter(c, 1600, 1420 - 18, .95, ink, { hat: true }); sitter(c, 1380, 1860 - 18, 1, ink); sitter(c, 1580, 1860 - 18, 1, ink, { hat: true });
    c.fillStyle = ink; c.fillRect(1660, 1200 - 18 - 150, 70, 150); c.fillRect(1668, 1200 - 18 - 120, 54, 4); c.fillRect(1668, 1200 - 18 - 70, 54, 4);   // картотека
    c.save(); c.translate(1700, 980 - 18); c.fillRect(-4, -90, 8, 90); poly(c, [-26, -90, 26, -90, 14, -120, -14, -120]); c.fill(); c.restore();   // лампа
    c.save(); poly(c, [cutX(slabs[3]), slabs[3], x1, slabs[3], x1, slabs[4] - 18, cutX(slabs[4] - 18), slabs[4] - 18]); c.clip();   // кабинет Бёрнетта — мир 7
    inNest(c, NC7(), cc => officeW7(cc, t)); c.restore();   // та же вложенность, что у камеры (linkK) — на стыке кадры совпадают
    c.fillStyle = '#3A3050'; slabs.forEach(sy => c.fillRect(x0, sy - 18, x1 - x0, 18));   // перекрытия
    c.restore();
    c.beginPath(); c.moveTo(cxa, cya); c.lineTo(cxb, cyb); lnB(c, 14, '#DCD3BE'); c.strokeStyle = '#2C356E'; c.lineWidth = 4; c.beginPath(); c.moveTo(cxa - 10, cya + 4); c.lineTo(cxb - 10, cyb + 4); c.stroke();   // край разреза: толщина стены
    c.restore();
  }
  function tower(c, i, t) {   // белая башня = сигарета: тело с окнами, полоса короны = пробка (совпадает с ней при стыке), ступени и шпиль ар-деко
    const { x, top } = TWR[i], L = x - TWW / 2, s = 1 / TWM;
    rr(c, L, top, TWW, 3600 - top, 6 * s); fill(c, C3.white);
    c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(x + 4 * s, top, 13 * s, 3600 - top);   // тень — как у сигареты
    c.fillStyle = 'rgba(253,230,138,.9)'; for (let r = 0; r < 60; r++) for (let m = 0; m < 4; m++) if (H1(i * 41 + r * 3 + m) > .42) c.fillRect(L + 12 + m * 26, top + CORK + 36 + r * 52, 16, 26);
    c.fillStyle = C3.cork; c.fillRect(L, top, TWW, CORK); c.fillStyle = 'rgba(120,70,30,.35)'; for (let k = 0; k < 3; k++) c.fillRect(L, top + (8 + k * 12) * s, TWW, 3 * s);
    PL(c, [L + 14, top, L + 30, top - 50, L + TWW - 30, top - 50, L + TWW - 14, top], C3.cork); PL(c, [x - 26, top - 50, x - 16, top - 100, x + 16, top - 100, x + 26, top - 50], '#D9B888');
    PL(c, [x - 7, top - 100, x, top - 210 - i * 16, x + 7, top - 100], C3.cork); c.fillStyle = 'rgba(120,70,30,.3)'; c.fillRect(L + 22, top - 30, TWW - 44, 6);
  }
  function chWorld(c, t, q) {
    c.fillStyle = '#0D1230'; c.fillRect(-3000, -5000, 8000, 9000); c.fillStyle = '#121845'; c.fillRect(-3000, 1300, 8000, 500); c.fillStyle = '#18204F'; c.fillRect(-3000, 1800, 8000, 3000);
    starsS(c, t, .9);
    circ(c, 190, 300, 110, '#F3EBDD'); circ(c, 150, 270, 22, '#DCD3BE'); circ(c, 222, 342, 15, '#DCD3BE'); circ(c, 230, 262, 9, '#DCD3BE');   // луна
    for (let i = 0; i < 34; i++) { const bx = -900 + i * 104, h = 520 + H1(i * 2.7) * 720, by = 2500 - h; c.fillStyle = i % 2 ? '#141A3E' : '#1A2150'; c.fillRect(bx, by, 96, h + 1200);
      c.fillStyle = 'rgba(253,230,138,.45)'; for (let k = 0; k < h / 60; k++) for (let m = 0; m < 3; m++) if (H1(i * 31 + k * 7 + m) > .62) c.fillRect(bx + 12 + m * 28, by + 26 + k * 60, 16, 22) }   // дальние дома
    for (let i = 0; i < TWR.length; i++) tower(c, i, t);
    burnettB(c, t);
    for (let i = 0; i < 22; i++) { const bx = -1000 + i * 160, h = 260 + H1(i * 5.3) * 300; c.fillStyle = '#0A0E26'; c.fillRect(bx, 2560 - h, 150, h + 1400);
      c.fillStyle = 'rgba(253,230,138,.35)'; for (let k = 0; k < h / 70; k++) if (H1(i * 13 + k) > .5) c.fillRect(bx + 30 + (k % 2) * 60, 2600 - h + k * 70, 22, 26) }   // ближние дома закрывают низ башен
  }
  function chShot(c, t) { const q = camObj(camAt(KCH, t)); layer(c, q, 1, cc => chWorld(cc, t, q)) }
