  // ================= кофейня, часть 2 (строки 14–15; шортс — вопрос и петля; фильм — строки 16–17 на карте) =================
  // Отъезд из карты: она лежит на столе той же кофейни. Комок-обещание вкатывается слева; из белых фигурок растёт столбик (32 млн),
  // из пачки Marlboro — красная башня сигарет (617 млрд, +0,6 %). «Бросают…» — комок скатывается в урну к таким же; на столе IQOS и пачка.
  // Шортс: на карте «?», «Часть 5 →», сверху ложится свежая газета — кадр 0 (петля). Фильм: камера наезжает на карту — баночка, ныряем в подушечку.
  let KAE = null, TL0 = 0;
  const IQC = { x: 561, y: 1392, L: 112, r: Math.PI / 2 + .07 };   // IQOS на столе кофейни — у края карты, под газетой кадра 0 (v21.1: меньше — был с пол-Америки)
  const BALLY = 1546;
  const Hc = (x, y) => [N_HA.x + (x - 540) * N_HA.m, N_HA.y + (y - 960) * N_HA.m];   // точка карты (мир H) → кофейня
  const binBall = i => [BIN.x - BIN.w * .32 + (i % 4) * BIN.w * .21 + (i > 3 ? BIN.w * .1 : 0), BIN.y - BIN.h + 8 - (i > 3 ? 46 : 14) - H1(i) * 12, 40 + H1(i * 3) * 8, i * 1.3];
  function cafe2Init() {
    const a = TM; a.jHA = TH.jHA; a.roll0 = a.jHA + .3; a.rest = a.roll0 + 1.6; a.edge = a.brosaj + .8; a.inBin = a.edge + .48;
    TL0 = TLX.endT + 1 / 30;
    KA2 = [KY(a.jHA + .95, 640, 1300, 1.7), KY(a.chet + .3, 470, 1195, 1.18), KY(a.tri + .4, 390, 1150, 1.1), KY(a.sig + .5, 330, 1060, 1.0), KY(a.shest + .6, 350, 1000, .95),
      KY(a.bol + .3, 390, 1060, 1.0), KY(a.brosaj + .3, WDE ? 1250 : 830, 1440, 1.15), KY(a.rovno + .25, WDE ? 1820 : 1070, 1610, 1.35), KY(a.vy + .35, 470, 1220, 1.0)];   // v21.2: на «как и вы» — общий план стола: башня пачек и толпа ниже плашки года
    if (MODE === 'y') KAE = KA2.slice();   // v21.1: фильм кончается на «как и вы» — дальше кадр кофейни становится фото карточки 2014 на доске (80-board.js)
    else {
      const [qx, qy] = Hc(QM[0], QM[1]);
      KAE = KA2.concat([KY(a.ugad + .4, qx - 30, qy - 4, 2.4), KY(a.amerQ + .05, 700, 1290, 1.9), KY(TL0, 540, 1000, 1.0)]);
      KAE[KAE.length - 1].v = KA1[0].v;   // петля: в кадр 0 — с той же скоростью, что у кадра 0
    }
  }
  function ballA2(t) {   // [x, y, поворот, R] — комок вкатывается, лежит, скатывается в урну
    const a = TM; if (t < a.roll0) return null;
    if (t < a.brosaj) { const k = eo(at(t, a.roll0, a.rest)); return [lp(-140, 440, k), BALLY, lp(-7, 0, k), BALL_R] }
    if (t < a.edge) { const k = eio(at(t, a.brosaj, a.edge)); return [lp(440, TEND + 14, k), BALLY, lp(0, 7.4, k), BALL_R] }
    const k = at(t, a.edge, a.inBin); if (k >= 1) return null; const [bx, by, br, rot] = binBall(7);
    return [lp(TEND + 14, bx, k), lp(BALLY, by, k * k) - Math.sin(Math.PI * k) * 70, lp(7.4, rot, k), lp(BALL_R, br, k)];
  }
  function newsDrop(c, t) {   // шортс: свежая сложенная газета падает на стол — это кадр 0
    const a = TM; if (!a.amerQ) return; const k = at(t, a.amerQ + .1, a.amerQ + .48); if (k <= 0) return;
    const f = ei(k), cx = PG.sx + PG.w / 2, cy = PG.y + PG.h / 2, s = lp(1.45, 1, f), r = lp(-.14, 0, f), dy = lp(-420, 0, f);
    c.save(); c.translate(cx, cy + dy); c.rotate(r); c.scale(s, s); c.translate(-cx, -cy); newspaper(c, t, 0, 0, 0); c.restore();
  }
  function cafe2After(c, t) {
    iqos4(c, IQC.x, IQC.y, IQC.L, { ang: IQC.r, stick: 1, name: true });
    towers(c, t);
    const b = ballA2(t); if (b) paperBall(c, b[0], b[1], b[3], b[2], { shadow: b[1] < EDGEY });
    newsDrop(c, t);
  }
  function cafe2Plates(c, t) {   // поверх кадра: счётчики строки 14, «Часть 5 →», ценник и «БЕЗ ТАБАКА» (фильм)
    const a = TM, S = fn => { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); fn(); c.restore() };
    const k1 = at(t, a.tri - .05, a.tri + .25) * (1 - at(t, a.sig - .3, a.sig)); if (k1 > 0) S(() => { const v = Math.round(32 * eio(at(FT, a.tri, a.tri + 1.1))); drum4(c, TEXT.fUsers(v), 540, 330, k1, { s: 72, w: 400, lab: TEXT.usersL }) });
    const k2 = at(t, a.sig - .05, a.sig + .25) * (1 - at(t, a.brosaj - .45, a.brosaj - .15)); if (k2 > 0) S(() => { const v = Math.round(617 * eio(at(FT, a.sig + .15, a.shest + .9))); drum4(c, TEXT.fCigs(v), 540, 330, k2, { s: 72, w: 470, lab: TEXT.cigsL }) });
    const k3 = at(t, a.bol - .1, a.bol + .2) * (1 - at(t, a.brosaj - .45, a.brosaj - .15)); if (k3 > 0) S(() => { const s = bo(k3); c.save(); c.translate(430, 500); c.scale(s, s);
      poly(c, [0, -46, 30, -8, 12, -8, 12, 40, -12, 40, -12, -8, -30, -8]); fill(c, C4.red); c.restore(); plate(c, TEXT.pct, 590, 500, s, { s: 50, bg: '#F4F1EA', c: C4.red, ls: 2 }); plate(c, TEXT.pctL, 590, 578, s, { s: 26, bg: '#141733', c: '#F4F1EA', ls: 3 }) });   // v21.1: «за год»
    if (a.amerQ) { const kp = at(t, a.amerQ - .12, a.amerQ + .15), out = ei(at(t, TL0 - 1.2, TL0 - .75)); if (kp > 0 && out < 1) S(() => plate(c, TEXT.part5, 330, 520 - 680 * out, bo(kp), { s: 58, bg: C4.red, c: '#FFFFFF', ls: 2 })) }   // v21.2: «Часть 5 →» ниже и левее — не закрывает циферблат Биг-Бена
    if (a.shestn) { const kd = at(t, a.shestn - .1, a.shestn + .2) * (1 - at(t, a.net - .3, a.net)); if (kd > 0) S(() => { const v = Math.round(16 * eio(at(t, a.shestn, a.shestn + .9))); drum4(c, v >= 16 ? TEXT.price : '$' + v + ' МЛРД', 540, 330, kd, { s: 72, w: 440 }) });
      capS(c, TEXT.notob, 540, 330, at(t, a.tab + .05, a.tab + .3) * (1 - at(t, a.jAJ - .32, a.jAJ - .08)), { s: 56 }) }
  }
  const cafe2St = t => ({ paper: false, binN: t >= TM.inBin ? 8 : 7, map: cc => inNest(cc, N_HA, c2 => usMapWorld(c2, t, false)), after: cc => cafe2After(cc, t) });
  function cafe2Shot(c, t) {
    cafeShot(c, t, KAE, t - TL0, cafe2St(t)); cafe2Plates(c, t);
  }
