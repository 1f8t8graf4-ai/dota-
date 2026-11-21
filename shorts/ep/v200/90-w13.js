  // ================= концовка шортса (v20.6, 21.11 — новая концовка главы 3 по ТЗ Андрея: айкос целиком в главе 4) =================
  // Строк 13–14 (нагреватель, стики «Мальборо») больше нет. Фильм кончается на доске (80-w12.js: нить к 2014, маркер осыпается,
  // нырок в фото кофейни = кадр 0 главы 4). Шортс: после строки 11 дым → витрина: мягкая пачка 1920-х, Flip-Top 1950-х и «?» на месте
  // третьей (что дальше — в части 4); вопрос «А знаете, что производитель «Мальборо» однажды пообещал?» (q3), «Часть 4 →»,
  // камера ныряет во Flip-Top — это та же пачка, что на плакате у трассы, она раскрывается в щит кадра 0 (петля, как в v20.3).
  let T13 = null, K13 = null, TSM = 1e9, KL = null, TL0 = 0;
  const SHOW = { x0: 90, x1: 990, y0: 600, y1: 1250, shelf: 1190 };
  function w13Init() {
    if (MODE !== 's' || SA('q3') === null) { T13 = null; TSM = 1e9; return }
    const w = q => Ws('q3', q);
    T13 = { q: SA('q3'), qEnd: SB('q3'), marl: w('мальборо'), poob: w('пообещал'), vEnd: TLX.vEnd, endT: TLX.endT };
    const a = T13; TSM = T9.end;   // дым закрывает кадр — стык ночной сцены и витрины
    a.ts = a.qEnd + .95; TL0 = TLX.endT + 1 / 30; const NPK = { x: 445 - (BB.x + 676) + 540, y: SHOW.shelf - 282 - (BB.y + 176) + 960, m: 1 };
    K13 = [KY(TSM, 560, 930, .74), KY(a.q + .2, 546, 912, .84), KY(a.marl + .1, 540, 930, .9), KY(a.qEnd - .05, 540, 1020, 1.06), KY(a.ts, 540, SHOW.shelf - 141, 7.6)];
    KL = [KY(TL0, 540, 960, 1)]; linkK(K13, KL, NPK, true);   // наезд до пачки во весь кадр → отъезд к кадру 0
  }
  function graphite(c, t) {
    c.fillStyle = '#2B2E36'; c.fillRect(-6000, -6000, 12000, 12000); poly(c, [-6000, 2600, 6000, -3400, 6000, -2600, -6000, 3400]); fill(c, '#343844');
    c.strokeStyle = 'rgba(180,200,230,.07)'; c.lineWidth = 2; c.beginPath(); for (let x = -1200; x < 2400; x += 90) { c.moveTo(x, -900); c.lineTo(x, 2900) } for (let y = -900; y < 2900; y += 90) { c.moveTo(-1200, y); c.lineTo(2400, y) } c.stroke();
    c.fillStyle = '#23262D'; c.fillRect(-6000, 1460, 12000, 3000);
  }
  function qSlot(c, t, x, shelf, gl) {   // место третьей пачки — тёмная ниша с «?»: что будет дальше, расскажет часть 4
    const w = 150, h = 230, x0 = x - w / 2, y0 = shelf - h, bob = Math.sin(t * 2.4) * 4 * gl;
    rr(c, x0, y0, w, h, 14); fill(c, 'rgba(10,12,18,.55)'); c.setLineDash([12, 10]); rr(c, x0, y0, w, h, 14); lnB(c, 3, rgba('#F4F1EA', .35 + .4 * gl)); c.setLineDash([]);
    if (gl > 0) glow(c, x, y0 + h / 2, 150, '#FFD23F', .35 * gl);
    tx(c, '?', x, y0 + h / 2 + 44 + bob, { f: 'M', w: 800, s: 150, c: mixc('#8A8E9A', '#FFD23F', gl) });
  }
  function showcase(c, t) {
    const a = T13, k = eio(at(t, TSM - .1, TSM + .55)); if (k <= 0) return; const { x0, x1, y0, y1, shelf } = SHOW;
    rr(c, x0 - 20, y0 - 20, x1 - x0 + 40, y1 - y0 + 40, 14); fill(c, '#1B1D23'); rr(c, x0, y0, x1 - x0, y1 - y0, 8); fill(c, '#3A3E4A');
    c.fillStyle = '#4A4F5C'; c.fillRect(x0, shelf, x1 - x0, 24);
    const kd = eio(at(t, a.qEnd - .05, a.ts - .3));   // на нырке имена гаснут и блики стекла уходят — пачка как на плакате
    const gl = i => eo(at(t, a.marl - .05 + i * .22, a.marl + .2 + i * .22)) * (1 - kd);
    softPack(c, 160, shelf - 300, 200, 300, 30, { glow: gl(0), shc: 'rgba(0,0,0,.3)' });
    mPack(c, 445, shelf - 282, 190, 282, 34, { glow: gl(1), shc: 'rgba(0,0,0,.3)' });
    c.save(); c.globalAlpha *= 1 - kd; qSlot(c, t, 830, shelf, eo(at(t, a.poob - .1, a.poob + .3))); c.restore();
    c.save(); rr(c, x0, y0, x1 - x0, y1 - y0, 8); c.clip(); c.globalAlpha *= 1 - kd;   // стекло: блики и отражение четырёх шляп с забора
    poly(c, [x0 + 80, y1, x0 + 200, y1, x0 + 520, y0, x0 + 400, y0]); fill(c, 'rgba(255,255,255,.07)'); poly(c, [x0 + 600, y1, x0 + 640, y1, x0 + 960, y0, x0 + 920, y0]); fill(c, 'rgba(255,255,255,.06)');
    { const u = at(t, a.marl - .3, a.marl + .8), gxx = lp(x0 - 300, x1 + 300, eio(u)); if (u > 0 && u < 1) { poly(c, [gxx - 60, y1, gxx + 60, y1, gxx + 380, y0, gxx + 260, y0]); fill(c, 'rgba(255,255,255,.13)') } }   // блик бежит по стеклу, пока имена загораются
    c.globalAlpha *= .16; for (let i = 0; i < 4; i++) cHat(c, x0 + 170 + i * 190, y0 + 110 + Math.sin(t * 1.3 + i) * 3, 1.6, '#F4F1EA'); c.restore();
    c.save(); c.globalAlpha *= k; rr(c, x0, y0, x1 - x0, y1 - y0, 8); lnB(c, 4, 'rgba(255,255,255,.35)'); c.restore();
  }
  function w13World(c, t) {
    const a = T13; graphite(c, t); showcase(c, t);
    const kp = at(t, a.poob + .25, a.poob + .65); if (kp > 0) tx(c, 'Часть 4 →', 540, 1330, { f: 'M', w: 800, s: 70 * bo(kp), c: '#F4F1EA', a: Math.min(1, kp * 2) * (1 - at(t, a.ts - .5, a.ts - .2)) });
  }
  function w13Shot(c, t) {
    if (!T13) return;
    if (KL && t >= T13.ts) { w1World(c, t - TL0, camObj(camAt(KL, t))); return }   // пачка раскрылась в щит у трассы; мир 1 подходит к своему кадру 0 (петля без повтора кадра)
    const q = camObj(camAt(K13, t)); layer(c, q, 1, cc => w13World(cc, t));
  }
