  // ================= v23.1: сцена обоих прологов — студия, предметы глав, капля никотина; конец — как v23.0 (кадр 0 главы 1) =================
  const PL = (c, p, col) => { poly(c, p); fill(c, col) };
  const S0 = .32, DEV0 = { x: 540, y: 980 }, DEVC = { x: 540, y: 800 }, PY = 1250;   // корпус одноразки на сцене (кадр главы 1 в миниатюре), верх подиума
  // ---------- предметы глав картинками (node v231_spr.mjs) ----------
  const SPRN = ['cig', 'pod', 'ice', 'heat', 'tin'], SPRI = {};
  const SCORE = { cig: [.42, .62], pod: [.5, .1], ice: [.5, .62], heat: [.5, .16], tin: [.5, .42] };   // где внутри никотин (доли картинки): табак, под, жидкость, стик, пакетики
  // v23.3: обрезки картинок — у «Джула» снизу и у айкоса справа были растровые тени (предмет «висел», тень двоилась); pack — пачка без сигареты (врезка «упаковка»)
  const CROP = { pod: ['pod', 0, 0, 266, 2116], heat: ['heat', 0, 0, 356, 2304], pack: ['cig', 335, 0, 1029, 1274] };
  function sprLoad() {
    return Promise.all(SPRN.map(n => new Promise(r => { const im = new Image(); im.onload = () => { SPRI[n] = im; r() }; im.onerror = () => { if (LANG === 'ru' && !im.__f) { im.__f = 1; im.src = 'ep/v231/spr/' + n + '.png' } else r() }; im.src = (LANG === 'ru' ? 'ep/v231/spr-ru/' : 'ep/v231/spr/') + n + '.png' }))).then(() => {   // 24.11: у русского пролога надписи на предметах по-русски
      for (const k in CROP) { const [n, x, y, w, h] = CROP[k], im = SPRI[n]; if (!im) continue; const cv = mk(w, h); cv.getContext('2d').drawImage(im, x, y, w, h, 0, 0, w, h); SPRI[k] = cv }
    });
  }
  function fitWH(n, mw, mh) { const im = SPRI[n]; if (!im) return [mw, mh]; const k = Math.min(mw / im.width, mh / im.height); return [im.width * k, im.height * k] }
  let TMP = null;
  // предмет стоит на (x, yb); o: mw, mh — рамка; th — поворот вокруг вертикали (рад); sq — сплющивание (удар); dk — темнее; fl — проход блика 0..1; rim — янтарный контровой
  function obj(c, n, x, yb, o = {}) {
    const im = SPRI[n]; if (!im) return; const [w, h] = fitWH(n, o.mw || 600, o.mh || 560), a = o.a ?? 1; if (a <= 0) return;
    const ct = Math.cos(o.th || 0), sx = Math.max(.04, Math.abs(ct)) * (1 + (o.sq || 0) * .12), sy = 1 - (o.sq || 0) * .14;
    if (o.sh !== false) { c.save(); c.globalAlpha *= a * .55; c.beginPath(); c.ellipse(x + 10, yb + 4, w * .55 * sx, 16 + w * .03, 0, 0, TAU); fill(c, 'rgba(0,0,0,.7)'); c.restore() }   // тень на подиуме
    const W = Math.ceil(w), H = Math.ceil(h); if (!TMP || TMP.width < W + 2 || TMP.height < H + 2) TMP = mk(Math.max(W + 2, TMP ? TMP.width : 0), Math.max(H + 2, TMP ? TMP.height : 0));
    const g = TMP.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.clearRect(0, 0, W + 2, H + 2); g.drawImage(im, 0, 0, W, H);
    g.globalCompositeOperation = 'source-atop';
    const dk = Math.min(.85, (o.dk || 0) + .55 * (1 - Math.abs(ct)));   // повёрнутый боком — темнее (объём)
    if (dk > 0) { g.fillStyle = `rgba(6,8,22,${dk})`; g.fillRect(0, 0, W, H) }
    if (o.xr > 0) { g.fillStyle = `rgba(150,190,255,${o.xr})`; g.fillRect(0, 0, W, H) }   // v23.2: оболочка «рентгеном»
    if (o.fl > 0 && o.fl < 1) { const u = lp(-.4, 1.4, o.fl) * (W + H), gr = g.createLinearGradient(u - 110, 0, u + 110, H * .6); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(.5, `rgba(255,255,255,${o.fa ?? .5})`); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H) }   // блик проходит по предмету
    if (o.rim > 0) { const gr = g.createLinearGradient(0, 0, W, 0); gr.addColorStop(0, `rgba(255,190,110,${.55 * o.rim})`); gr.addColorStop(.18, 'rgba(255,190,110,0)'); gr.addColorStop(.82, 'rgba(255,190,110,0)'); gr.addColorStop(1, `rgba(255,190,110,${.55 * o.rim})`); g.fillStyle = gr; g.fillRect(0, 0, W, H) }
    c.save(); c.globalAlpha *= a; c.translate(x, yb); c.scale(sx, sy); c.drawImage(TMP, 0, 0, W, H, -w / 2, -h, w, h); c.restore();
  }
  const corePt = (n, x, yb, o = {}) => { const [w, h] = fitWH(n, o.mw || 600, o.mh || 560), q = SCORE[n]; return [x + (q[0] - .5) * w, yb - h + q[1] * h] };
  // ---------- студия: тёмный фон, конус света сверху, подиум, туман слоями, пылинки ----------
  const DUST = [...Array(30)].map((_, i) => ({ x: 300 + 480 * H1(i * 3.7), y: 1400 * H1(i * 5.3), s: .7 + 1.5 * H1(i * 7.1), v: 7 + 13 * H1(i * 2.9), ph: H1(i * 9.3) * TAU }));
  function fogTex() { return blurLayer('fog', 720, 640, 26, g => { for (let i = 0; i < 26; i++) { const x = 720 * H1(i * 4.1), y = 160 + 380 * H1(i * 6.7), r = 60 + 120 * H1(i * 2.3); g.fillStyle = `rgba(190,205,235,${.18 + .2 * H1(i * 8.9)})`; g.beginPath(); g.ellipse(x, y, r * 1.8, r * .55, 0, 0, TAU); g.fill(); g.beginPath(); g.ellipse(x - 720, y, r * 1.8, r * .55, 0, 0, TAU); g.fill(); g.beginPath(); g.ellipse(x + 720, y, r * 1.8, r * .55, 0, 0, TAU); g.fill() } }) }
  function fog(c, t, a) {   // два слоя тумана едут в разные стороны (тянутся по кругу, без шва)
    if (a <= 0) return; const F = fogTex();
    for (const [y, s, v, al] of [[880, 2.3, 11, .12], [1200, 2.8, -7, .2]]) {
      const w = 720 * s, off = ((t * v) % w + w) % w; c.save(); c.globalAlpha *= a * al;
      if (window.WIDE) { c.globalAlpha *= .5; for (let k = -2; k <= 2; k++) for (const h of [0, .5]) c.drawImage(F, -w + off + (k + h) * w + 540 - w / 2, y - 320 * s * .5, w, 640 * s * .5) }   // 24.11: в 16:9 плитки тумана внахлёст — без тёмных полос на стыках
      else for (let k = -1; k <= 1; k++) c.drawImage(F, -w + off + k * w + 540 - w / 2, y - 320 * s * .5, w, 640 * s * .5); c.restore();
    }
  }
  function podium(c, rx, lit) {
    const y = PY + 12, ry = rx * .17;
    c.save(); c.beginPath(); c.ellipse(540, y, rx, ry, 0, 0, Math.PI); c.lineTo(540 - rx, y + 46); c.ellipse(540, y + 46, rx, ry, 0, Math.PI, 0, true); c.closePath(); fill(c, '#10131c'); c.restore();   // бок
    const g = c.createRadialGradient(540, y - ry * .2, 10, 540, y, rx); g.addColorStop(0, mixc('#262b3a', '#3a3f52', lit)); g.addColorStop(1, '#14171f'); c.beginPath(); c.ellipse(540, y, rx, ry, 0, 0, TAU); c.fillStyle = g; c.fill();   // верх
    c.beginPath(); c.ellipse(540, y, rx, ry, 0, Math.PI * 1.05, Math.PI * 1.95); lnB(c, 2.5, `rgba(232,239,255,${.25 + .25 * lit})`);   // кромка в свете
  }
  function studio(c, t, o = {}) {
    const lit = o.lit ?? 1;
    c.fillStyle = '#0A0D13'; c.fillRect(-3000, -3000, 7080, 7920);
    glow(c, 540, 820, 980, '#2a3350', .45 * lit);   // стена чуть светлее в середине
    const sw = .02 * Math.sin(TAU * t / 7.3) + .007 * Math.sin(TAU * t / 3.1);
    c.save(); c.translate(540, -170); c.rotate(sw); c.translate(-540, 170);
    beam(c, 540, -170, 540, 1600, 50, 520, '#eef3ff', (.07 + .02 * (o.boost || 0)) * lit); beam(c, 540, -170, 540, 1300, 22, 240, '#eef3ff', .06 * lit);
    c.restore();
    podium(c, o.rx || 360, lit);
    glow(c, 540, PY + 6, (o.rx || 360) * 1.05, '#f4efe2', .12 * lit);   // пятно света на подиуме
    fog(c, t, lit);
    for (const d of DUST) {
      const yy = (((d.y - d.v * t) % 1500) + 1500) % 1500 + 40, xx = d.x + Math.sin(t * .6 + d.ph) * 12, half = 50 + (yy + 170) * .3, k = 1 - Math.abs(xx - 540) / half;
      if (k > 0) circ(c, xx, yy, d.s * 1.7, `rgba(236,242,255,${.3 * k * lit * (.55 + .45 * Math.sin(t * 2.1 + d.ph))})`);
    }
  }
  function slotSpot(c, x, a) { if (a <= 0) return; beam(c, x, -120, x, PY + 20, 14, 120, '#fff4de', .16 * a); glow(c, x, PY + 8, 150, '#fff4de', .22 * a) }
  // ---------- капля никотина: стекло, янтарь внутри, бьётся как сердце ----------
  const CORE_R = 30, BEAT = .95;
  function beatAt(t) {
    if (t < K.beat0 - .02) return 0;
    const u = (t - K.beat0) / BEAT, ph = (u - Math.floor(u)) * BEAT, q = ph - .19;
    const b1 = ph < .045 ? ph / .045 : Math.exp(-(ph - .045) / .11), b2 = q < 0 ? 0 : q < .045 ? .55 * q / .045 : .55 * Math.exp(-(q - .045) / .12);
    return Math.max(b1, b2);
  }
  function beats() { const o = []; for (let tb = K.beat0; tb < K.suck0; tb += BEAT) o.push(tb); return o }
  function dropPath(c, x, y, R) { c.beginPath(); c.moveTo(x, y - R * 1.95); c.bezierCurveTo(x + R * .35, y - R * 1.3, x + R, y - R * .75, x + R, y); c.arc(x, y, R, 0, Math.PI); c.bezierCurveTo(x - R, y - R * .75, x - R * .35, y - R * 1.3, x, y - R * 1.95); c.closePath() }
  function drop(c, x, y, r, hb, fl, gl = 1) {   // y — центр круглой части; gl — насколько видно стекло (блики, кромка)
    if (r <= .4) return; const R = r * (1 + .1 * hb + .25 * fl);
    glow(c, x, y - R * .4, R * (4.6 + 1.4 * hb + 5 * fl), '#f2a33a', Math.min(.9, .22 + .16 * hb + .5 * fl));
    glow(c, x, y - R * .3, R * 2, '#ffc46a', Math.min(1, .42 + .25 * hb + .3 * fl));
    dropPath(c, x, y, R); fill(c, '#f2a33a');
    c.save(); dropPath(c, x, y, R); c.clip(); circ(c, x + R * .7, y + R * .1, R * 1.1, '#d97a06'); c.beginPath(); c.ellipse(x, y + R * .55, R * .9, R * .35, 0, 0, TAU); fill(c, 'rgba(255,214,140,.35)');
    if (gl > 0) { c.globalAlpha *= gl; c.beginPath(); c.ellipse(x - R * .42, y - R * .55, R * .16, R * .5, -.35, 0, TAU); fill(c, 'rgba(255,248,230,.85)'); circ(c, x + R * .38, y + R * .38, R * .1, 'rgba(255,248,230,.6)') }
    c.restore();
    dropPath(c, x, y, R); lnB(c, Math.max(1.5, R * .05), `rgba(255,232,190,${.55 + .35 * gl})`);
  }
  // ---------- титул: Manrope 800, 82 px (как в финале), строки — y 440 / 544 (ТЗ: 400–580) ----------
  function title(c, t, tIn, tOut) {
    const L = TITLE_L[LANG] || TITLE_L.ru, out = at(t, tOut - .12, tOut + .3); if (out >= 1) return;
    const o = { f: 'M', w: 800, s: 82, ls: 2 }; let wi = 0;
    L.forEach((ws, li) => {
      const line = ws.join(' '), W0 = tw(c, line, o), oo = { ...o, s: W0 > 980 ? o.s * 980 / W0 : o.s }, x0 = 540 - tw(c, line, oo) / 2, y = 440 + li * 104 - 30 * eio(out);
      ws.forEach((w, j) => {
        const ta = tIn[Math.min(wi++, tIn.length - 1)], k = ta <= 0 ? 1 : eo(at(t, ta - .06, ta + .2)); if (k <= 0) return;
        const x = x0 + (j ? tw(c, ws.slice(0, j).join(' ') + ' ', oo) + oo.ls : 0);
        tx(c, w, x, y + 14 * (1 - k), { ...oo, al: 'left', c: '#F4F1EA', a: k * (1 - out) });
      });
    });
  }
  function dots(c, t, n, a) {   // шкала из пяти точек (ТЗ: y ≈ 1340) — без цифр и лет
    if (a <= 0) return;
    for (let i = 0; i < 5; i++) {
      const t5 = K.five ?? K.form[0] - .2, x = 540 + (i - 2) * 58, y = 1378, ap = spr(at(t, t5 + i * .05, t5 + .45 + i * .05)) * a; if (ap <= 0) continue;
      const on = at(t, K.form[i] + .15, K.form[i] + .3), pg = t - (K.form[i] + .15);
      c.save(); c.globalAlpha *= a; ring(c, x, y, 10 * ap, 'rgba(238,241,248,.45)', 2.5);
      if (on > 0) { glow(c, x, y, 36, '#f2a33a', .5 * on); circ(c, x, y, 10 * spr(on), '#f2a33a') }
      if (pg > 0 && pg < .5) ring(c, x, y, 10 + 32 * eo(pg / .5), `rgba(242,163,58,${.6 * (1 - pg / .5)})`, 2);
      c.restore();
    }
  }
  function label(c, t) {   // плашка врезки; v23.3: в кадре экрана (не едет с наездом), строго по центру на одной высоте — под предметом, над субтитрами;
    // тёмная полупрозрачная с тонкой золотой обводкой и белым текстом — не сливается ни с пачкой, ни с листом; ширина одна на все три слова
    const M = K.mac; if (t < M[0] || t >= K.dark) return;
    const i = t < M[1] ? 0 : t < M[2] ? 1 : 2, k = spr(at(t, M[0] + .04, M[0] + .3)), out = 1 - at(t, K.dark - .12, K.dark); if (k <= 0 || out <= 0) return;
    const L = LAB_L[LANG] || LAB_L.ru, o = { s: 44, ls: 6, w: 800, f: 'M' }, w = Math.max(...L.map(s => tw(c, s, o))) + o.s * 1.6, h = o.s * 1.85, sw = i ? eo(at(t, M[i], M[i] + .18)) : 1;
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = out; c.translate(CX, LABY); c.scale(k, k);
    rr(c, -w / 2, -h / 2, w, h, h * .28); fill(c, 'rgba(8,10,18,.66)'); rr(c, -w / 2 + 1, -h / 2 + 1, w - 2, h - 2, h * .28); lnB(c, 2, 'rgba(234,194,122,.9)');
    if (i && sw < 1) tx(c, L[i - 1], 0, o.s * .04 - 14 * sw, { ...o, c: '#fff', a: 1 - sw });
    tx(c, L[i], 0, o.s * .04 + 14 * (1 - sw), { ...o, c: '#fff', a: sw });
    c.restore();
  }
  const LABY = window.WIDE ? 1488 : 1560;   // 24.11: в 16:9 плашка выше — не прижата к низу кадра   // центр плашки: низ предметов врезок — до ~1420, плашка субтитров — 1678–1762
  // ================= A: по ТЗ Gemini + список (v23.2) =================
  const SLOT = i => 152 + 194 * i, LW = 178, LH = 380, LWT = 214;   // ряд из пяти (B — весь ролик)
  const AW = 184, AH = 440, AWT = 220;                               // A: рамка предмета в ряду
  // v23.3: ряд в A собирается слева направо и всегда стоит по центру: новый предмет выходит крупно справа от уже стоящих, они уступают ему место
  // (крупный никого не накрывает); в конце — все пять в ряд, на 10 % мельче и плотнее (с полями ≥ 100 px)
  const RS = .9, RG = 44, RM = 80;
  function lay(k, big) {   // k предметов (0…k−1), big — какой из них крупно (−1 — никакой) → [{x, mw, mh, yb}]
    const fr = [], ws = [];
    for (let j = 0; j < k; j++) { fr.push(j === big ? null : [(ORDA[j] === 'tin' ? AWT : AW) * RS, AH * RS]); ws.push(fr[j] ? fitWH(ORDA[j], fr[j][0], fr[j][1])[0] : 0) }
    if (big >= 0) { const used = ws.reduce((a, b) => a + b, 0) + RG * (k - 1), mw = Math.min(600, WW - 2 * RM - used); fr[big] = [mw, 560]; ws[big] = fitWH(ORDA[big], mw, 560)[0] }
    const tot = ws.reduce((a, b) => a + b, 0) + RG * (k - 1); let x = CX - tot / 2;
    return ws.map((w, j) => { const o = { x: x + w / 2, mw: fr[j][0], mh: fr[j][1], yb: j === big ? PY + 26 : PY }; x += w + RG; return o });
  }
  const LAY = {}; const layC = (k, big) => LAY[k + ':' + big] || (LAY[k + ':' + big] = lay(k, big));
  const L5 = (a, b, v) => ({ x: lp(a.x, b.x, v), mw: lp(a.mw, b.mw, v), mh: lp(a.mh, b.mh, v), yb: lp(a.yb, b.yb, v) });
  // предмет i в момент t: на своё слово въезжает справа крупно; на слово следующего уменьшается и сдвигается влево; после «Снюс» — весь ряд мелко
  function itemA(t, i) {
    const n = ORDA[i], tf = K.form[i], u = at(t, tf - .14, tf + .42);
    const seg = j => eio(at(t, (j < 5 ? K.form[j] : K.row) - .2, (j < 5 ? K.form[j] : K.row) + .22));   // переход к раскладке j-го шага (5 — весь ряд): прежний уступает место чуть раньше
    let P = layC(i + 1, i)[i];
    for (let j = i + 1; j <= 5; j++) { const v = seg(j); if (v <= 0) break; P = L5(P, j < 5 ? layC(j + 1, j)[i] : layC(5, -1)[i], v) }
    const e = 1 - Math.pow(1 - u, 4), th = 1.35 * (1 - eo(at(t, tf - .14, tf + .3))), x = P.x + 1250 * (1 - e);   // без перелёта за место — не заезжает на соседа
    return { i, n, tf, x, th, mw: P.mw, mh: P.mh, yb: P.yb, v: i < 4 ? seg(i + 1) : seg(5) };
  }
  function dropInA(t) {   // капля падает в луч с первого кадра и садится с отскоком
    if (t < .42) { const k = at(t, 0, .42); return lp(760, 1000, k * k) - 1000 }
    return 30 * Math.exp(-(t - .42) / .1) * Math.sin((t - .42) * 26);
  }
  function sceneA(c, t, hb, fl) {
    const pre = t < K.mac[0];
    if (pre) {
      const W5 = eio(at(t, K.form[0] - .3, K.form[0] + .2));
      studio(c, t, { rx: lp(360, 480, W5), boost: hb * .5 });
      // капля: в луче с первого кадра; на «Сигареты» уходит — дальше её свет только в контровом у предметов (за предметами не торчит)
      const dy = dropInA(t) + 6 * Math.sin(TAU * t / 3.3), dA = 1 - eio(at(t, K.form[0] - .25, K.form[0] + .05));
      if (dA > 0) drop(c, 540, 1000 + dy, 72 * dA * (1 + .25 * Math.exp(-Math.max(0, t - .42) / .12) * at(t, .4, .43)), hb, 0, 1);
      const lu = (t - .42) / .5; if (lu > 0 && lu < 1) ring(c, 540, 1000, 60 + 260 * eo(lu), `rgba(255,214,150,${.5 * (1 - lu)})`, 5 - 3 * lu);   // волна, когда капля села
      const IT = []; for (let i = 0; i < 5; i++) if (t > K.form[i] - .14) IT.push(itemA(t, i));
      const all = Math.sin(Math.PI * at(t, K.row + .1, K.row + .9));
      for (const o of IT) {   // слева направо — новый (крупный, справа) поверх соседей
        slotSpot(c, o.x, o.i === IT.length - 1 && t < K.row ? Math.sin(Math.PI * at(t, o.tf, o.tf + .9)) : all);
        const f1 = at(t, o.tf + .12, o.tf + .55), f2 = at(t, K.row + .15 + o.i * .08, K.row + .55 + o.i * .08);
        obj(c, o.n, o.x, o.yb, { mw: o.mw, mh: o.mh, th: o.th, fl: f2 > 0 ? f2 : f1, rim: lp(1, .6, o.v) });
      }
      dots(c, t, 5, 1 - at(t, K.mac[0] - .2, K.mac[0]));
      return;
    }
    if (t < K.dark) { macro(c, t); return }
    // «— но не суть»: резко темнота, одна капля, формула; на «суть» — вспышка и волна
    c.fillStyle = '#05060A'; c.fillRect(-3000, -3000, 7080, 7920);
    glow(c, 540, 900, 900, '#3a2410', .25 + .3 * fl);
    formula(c, t);
    shockA(c, t);
    if (t < K.grow - .06) drop(c, 540, 980 + 4 * Math.sin(TAU * t / 3.3), lp(46, CORE_R, eio(at(t, K.flare + .1, K.grow - .1))), hb, fl, 1 - at(t, K.flare, K.grow));
  }
  function shockA(c, t) { const u = (t - K.flare) / .62; if (u <= 0 || u >= 1) return; ring(c, 540, 960, 40 + 620 * eo(u), `rgba(255,214,150,${.55 * (1 - u)})`, 7 - 5 * u) }
  // никотин: пиридин (шестиугольник) + пирролидин (пятиугольник) с N и метилом — тонкими янтарными линиями вокруг капли
  function formula(c, t) {
    const k = at(t, K.dark + .05, K.dark + .45), out = at(t, K.grow - .3, K.grow + .1); if (k <= 0 || out >= 1) return;
    const fl = Math.exp(-Math.max(0, t - K.flare) / .25) * at(t, K.flare - .02, K.flare + .04);
    c.save(); c.translate(540, 760); c.globalAlpha *= (1 - out) * (.75 + .25 * fl); c.strokeStyle = mixc('#f2a33a', '#fff3da', fl); c.lineWidth = 4; c.lineCap = 'round'; c.lineJoin = 'round';
    const R = 92, hx = -96, hy = 0, P6 = [...Array(6)].map((_, i) => [hx + R * Math.cos(Math.PI / 6 + i * Math.PI / 3), hy + R * Math.sin(Math.PI / 6 + i * Math.PI / 3)]);
    const a0 = P6[0], R5 = 66, cx5 = a0[0] + R5 * 1.1, cy5 = a0[1] - 20, P5 = [...Array(5)].map((_, i) => [cx5 + R5 * Math.cos(Math.PI + .3 + i * TAU / 5), cy5 + R5 * Math.sin(Math.PI + .3 + i * TAU / 5)]);
    const seg = (pts, closed) => { c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); if (closed) c.closePath() };
    c.setLineDash([1400 * k, 3000]); seg(P6, true); c.stroke(); seg([a0, P5[0]]); c.stroke(); seg(P5, true); c.stroke();
    c.setLineDash([]);
    if (k > .6) { const a = at(k, .6, 1); c.globalAlpha *= a;   // двойные связи пиридина, азоты, метил
      [[1, 2], [3, 4], [5, 0]].forEach(([i, j]) => { const m = [(P6[i][0] + P6[j][0]) / 2, (P6[i][1] + P6[j][1]) / 2], q = [hx + (m[0] - hx) * .72, hy + (m[1] - hy) * .72], d = [(P6[j][0] - P6[i][0]) * .3, (P6[j][1] - P6[i][1]) * .3]; c.beginPath(); c.moveTo(q[0] - d[0], q[1] - d[1]); c.lineTo(q[0] + d[0], q[1] + d[1]); c.stroke() });
      const n6 = P6[3], n5 = P5[1]; tx(c, 'N', n6[0], n6[1], { f: 'M', w: 800, s: 38, c: '#ffd9a0' }); tx(c, 'N', n5[0], n5[1], { f: 'M', w: 800, s: 38, c: '#ffd9a0' });
      c.beginPath(); c.moveTo(n5[0] + 18, n5[1] - 22); c.lineTo(n5[0] + 54, n5[1] - 70); c.stroke() }
    c.restore();
  }
  // три врезки крупным планом: упаковка (крышка пачки щёлкает, золотой блик), вкус (манго, мята, лёд), обещания (бланк, зелёная галочка, печать с бликом)
  function macro(c, t) {
    const M = K.mac, i = t < M[1] ? 0 : t < M[2] ? 1 : 2, t0 = M[i], u = t - t0, z = 1 + .06 * u + .07 * (1 - eo(at(t, t0, t0 + .28)));   // v23.2: вход — короткий наезд вместо белой вспышки
    c.save(); c.translate(540, 900); c.scale(z, z); c.translate(-540, -900);
    if (i === 0) {
      c.fillStyle = '#150709'; c.fillRect(-500, -500, 2080, 2920); glow(c, 540, 700, 900, '#7a1222', .55);
      const sn = 1 - spr(at(t, t0, t0 + .35)); c.save(); c.translate(540, 960); c.rotate(-.06 * sn); c.scale(1 + .05 * sn, 1 + .05 * sn); c.translate(-540, -960);
      obj(c, 'pack', 540, 1320, { mw: 600, mh: 740, fl: lp(.2, 1, at(t, t0 + .15, t0 + .85)), fa: .13, sh: false }); c.restore();   // v23.3: пачка без сигареты, по центру, блик слабый (не засвечивает «PM» и надпись)
    } else if (i === 1) {
      c.fillStyle = '#0f1408'; c.fillRect(-500, -500, 2080, 2920); glow(c, 540, 900, 900, '#4a5a18', .5); glow(c, 380, 800, 520, '#a2560e', .45);
      flavors(c, t, t0);
    } else {
      c.fillStyle = '#0b1016'; c.fillRect(-500, -500, 2080, 2920); glow(c, 540, 860, 900, '#2b3e52', .55);
      promise(c, t, t0);
    }
    c.restore();
  }
  function popK(t, t0) { return spr(at(t, t0, t0 + .32)) }
  function flavors(c, t, t0) {
    // манго «ёжиком», два листа мяты, кубик льда — 3 тона, как предметы глав
    const k1 = popK(t, t0), k2 = popK(t, t0 + .07), k3 = popK(t, t0 + .14);
    if (k1 > 0) { c.save(); c.translate(390, 960); c.scale(k1, k1); c.rotate(-.28);   // v23.2: манго — целый плод (Gemini: «ёжик» читался как вафля), 3 тона, черенок и лист
      const body = () => { c.beginPath(); c.moveTo(-40, -190); c.bezierCurveTo(120, -210, 220, -60, 200, 60); c.bezierCurveTo(180, 180, 40, 230, -60, 190); c.bezierCurveTo(-170, 150, -200, 20, -160, -80); c.bezierCurveTo(-140, -150, -100, -185, -40, -190); c.closePath() };
      body(); const gm = c.createLinearGradient(-180, -180, 200, 200); gm.addColorStop(0, '#86c34a'); gm.addColorStop(.42, '#f6c33a'); gm.addColorStop(1, '#ee6a2a'); c.fillStyle = gm; c.fill();
      c.save(); body(); c.clip(); c.beginPath(); c.ellipse(130, 120, 210, 170, -.5, 0, TAU); fill(c, 'rgba(160,45,8,.3)'); c.beginPath(); c.ellipse(-92, -78, 46, 104, -.6, 0, TAU); fill(c, 'rgba(255,255,235,.4)'); c.restore();
      c.beginPath(); c.moveTo(-46, -186); c.lineTo(-56, -228); lnB(c, 10, '#5a3a1c');
      c.beginPath(); c.moveTo(-56, -224); c.quadraticCurveTo(14, -306, 118, -262); c.quadraticCurveTo(24, -226, -56, -224); c.closePath(); fill(c, '#3f9a4a'); c.beginPath(); c.moveTo(-50, -226); c.quadraticCurveTo(30, -262, 110, -262); lnB(c, 3, 'rgba(220,255,220,.6)');
      c.restore() }
    if (k2 > 0) for (const [x, y, r, s] of [[690, 820, -.6, 1], [770, 960, .35, .8]]) { c.save(); c.translate(x, y); c.scale(k2 * s, k2 * s); c.rotate(r);   // мята
      c.beginPath(); c.moveTo(-150, 0); c.quadraticCurveTo(-40, -110, 150, 0); c.quadraticCurveTo(-40, 110, -150, 0); c.closePath(); fill(c, '#5ed39b');
      c.save(); c.clip(); c.fillStyle = '#3ba873'; c.fillRect(-160, 8, 320, 120); c.restore(); c.beginPath(); c.moveTo(-150, 0); c.lineTo(140, 0); for (let j = -3; j <= 3; j++) { c.moveTo(j * 36, 0); c.lineTo(j * 36 + 34, j % 2 ? 40 : -40) } lnB(c, 3, 'rgba(230,255,240,.7)'); c.restore() }
    if (k3 > 0) { c.save(); c.translate(560, 1150); c.scale(k3, k3); c.rotate(.12);   // лёд
      PL(c, [-110, -60, 40, -110, 140, -50, -10, 0], 'rgba(220,245,255,.85)'); PL(c, [-110, -60, -10, 0, -10, 150, -110, 90], 'rgba(150,205,235,.85)'); PL(c, [-10, 0, 140, -50, 140, 100, -10, 150], 'rgba(110,175,215,.85)');
      poly(c, [-110, -60, 40, -110, 140, -50, 140, 100, -10, 150, -110, 90]); lnB(c, 3, 'rgba(255,255,255,.8)'); c.beginPath(); c.ellipse(-60, 30, 12, 34, -.3, 0, TAU); fill(c, 'rgba(255,255,255,.55)'); c.restore() }
    for (let i = 0; i < 10; i++) { const u = at(t, t0 + .05 + i * .02, t0 + .5 + i * .02); if (u <= 0 || u >= 1) continue; const an = i * 2.4, rr2 = 180 + 380 * eo(u); circ(c, 540 + Math.cos(an) * rr2, 960 + Math.sin(an) * rr2 * .8, 7 * (1 - u), 'rgba(220,245,255,.8)') }   // брызги
  }
  function promise(c, t, t0) {
    const k = popK(t, t0); if (k <= 0) return;
    c.save(); c.translate(540, 930); c.rotate(-.07); c.scale(k, k);
    rr(c, -300 + 14, -400 + 18, 600, 800, 10); fill(c, 'rgba(0,0,0,.4)'); rr(c, -300, -400, 600, 800, 10); fill(c, '#f2efe6');
    c.fillStyle = '#1c2230'; c.fillRect(-250, -340, 500, 44); for (let i = 0; i < 9; i++) { c.fillStyle = 'rgba(40,46,60,.28)'; c.fillRect(-250, -250 + i * 46, i % 3 === 2 ? 300 : 500, 16) }   // заголовок и строки — без слов
    const ck = at(t, t0 + .12, t0 + .42); if (ck > 0) { c.beginPath(); c.moveTo(-150, 130); c.lineTo(-40, 250); c.lineTo(200, -10); c.setLineDash([700 * ck, 1400]); lnB(c, 34, '#17b26a'); c.setLineDash([]) }   // зелёная галочка рисуется сама
    const sk = spr(at(t, t0 + .32, t0 + .6)); if (sk > 0) { c.save(); c.translate(150, 250); c.rotate(-.25); c.scale(1.6 - .6 * sk, 1.6 - .6 * sk); c.globalAlpha *= sk; ring(c, 0, 0, 96, '#17b26a', 10); ring(c, 0, 0, 74, '#17b26a', 4); tx(c, '✓', 0, 4, { f: 'M', w: 800, s: 80, c: '#17b26a' }); c.restore() }   // печать
    const gl = at(t, t0 + .55, t0 + .95); if (gl > 0 && gl < 1) { c.save(); rr(c, -300, -400, 600, 800, 10); c.clip(); const x = lp(-500, 500, gl), g = c.createLinearGradient(x - 120, -400, x + 120, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,.7)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(-300, -400, 600, 800); c.restore() }
    c.restore();
  }
  // ================= B: моя =================
  function stampT() { return VAR === 'B' ? [0, 1, 2, 3, 4].map(i => K.stamp + i * .26) : [] }
  function sceneB(c, t, hb, fl) {
    const back = eo(at(t, K.back - .1, K.back + .35)), off = at(t, K.flare - .05, K.flare + .35);
    if (t < K.flare + .4) {
      A(c, 1 - off, () => {
        studio(c, t, { rx: 480, lit: 1 - .8 * back });
        backlight(c, t, back);
        silhouette(c, t);
        const pull = eio(at(t, K.pull - .05, K.flare)), ST = stampT();
        for (let i = 0; i < 5; i++) {
          const tf = K.form[i]; if (t < tf - .28) continue;
          const u = at(t, tf - .28, tf + .02), land = t > tf + .02, sq = land ? Math.exp(-(t - tf - .02) / .08) * Math.cos((t - tf - .02) * 40) : 0;
          let x = SLOT(i), yb = PY - (1 - ei(u)) * 1000;
          const mw = lp(i === 4 ? LWT : LW, 40, pull), mh = lp(LH, 40, pull); x = lp(x, 540, pull); yb = lp(yb, 1080, pull);
          slotSpot(c, SLOT(i), at(t, tf, tf + .12) * (1 - back));
          if (land && t < tf + .45) dust(c, SLOT(i), PY, (t - tf - .02) / .43);
          obj(c, SPRN[i], x, yb, { mw, mh, sq: Math.max(0, sq), dk: .55 * back, rim: back, fl: at(t, tf + .05, tf + .5), a: 1 - at(pull, .85, 1) });
          stampOn(c, t, ST[i], x, yb - mh * (i % 2 ? .62 : .3), 1 - at(t, K.back, K.back + .3));   // через один выше-ниже — штампы не налезают
        }
      });
    }
    if (t >= K.flare - .1) {   // пятёрка стянулась в каплю: вспышка, волна; дальше — темнота и одна капля
      glow(c, 540, 900, 900, '#3a2410', .2 * off + .3 * fl); shockA(c, t);
      const r = lp(0, 50, spr(at(t, K.flare - .08, K.flare + .25))), r2 = lp(r, CORE_R, eio(at(t, K.flare + .35, K.grow - .1)));
      if (t < K.grow - .06) drop(c, 540, 1000 + 4 * Math.sin(TAU * t / 3.3), r2, hb, fl, 1 - at(t, K.flare + .3, K.grow));
    }
  }
  function dust(c, x, y, u) { if (u <= 0 || u >= 1) return; for (let i = 0; i < 9; i++) { const s = i % 2 ? 1 : -1, d = (40 + 90 * H1(i * 3.1)) * eo(u); glow(c, x + s * d, y - 10 - 26 * eo(u) * H1(i), 26 + 30 * u, '#c9cfdd', .35 * (1 - u)) } }
  function stampOn(c, t, ts, x, y, a) {   // красный штамп «СПОСОБ БРОСИТЬ» поверх предмета
    const k = at(t, ts - .06, ts + .04); if (k <= 0 || a <= 0) return;
    const s = lp(1.7, 1, eo(k)), W = 184, H = 92, S = STAMP_L[LANG] || STAMP_L.ru, sp = S.indexOf(' ');
    c.save(); c.translate(x, y); c.rotate(-.21); c.scale(s, s); c.globalAlpha *= a * Math.min(1, k * 1.5);
    rr(c, -W / 2, -H / 2, W, H, 10); fill(c, 'rgba(10,10,20,.35)'); rr(c, -W / 2, -H / 2, W, H, 10); lnB(c, 6, '#e23a4a'); rr(c, -W / 2 + 9, -H / 2 + 9, W - 18, H - 18, 6); lnB(c, 2, '#e23a4a');
    const l1 = sp > 0 ? S.slice(0, sp) : S, l2 = sp > 0 ? S.slice(sp + 1) : '';
    tx(c, l1, 0, l2 ? -17 : 0, { f: 'M', w: 800, s: 28, ls: 2, c: '#ff5a66', mw: W - 26 }); if (l2) tx(c, l2, 0, 18, { f: 'M', w: 800, s: 28, ls: 2, c: '#ff5a66', mw: W - 26 });
    c.restore();
  }
  function backlight(c, t, k) {   // контровой свет на задней стене: тёплый круг
    if (k <= 0) return; glow(c, 540, 720, 760, '#c2461f', .55 * k); glow(c, 540, 700, 430, '#ffb36b', .45 * k);
  }
  function silhouette(c, t) {   // «кто стоит за…» — фигура в костюме против света, без лица; поднимается из-за подиума
    const k = eio(at(t, K.who - .1, K.stand + .35)), out = at(t, K.flare - .05, K.flare + .3); if (k <= 0 || out >= 1) return;
    const y0 = lp(1400, 0, k), sw = Math.sin(t * 1.3) * 5, br = 1 + .006 * Math.sin(t * 2.2);
    const body = () => { c.beginPath(); c.moveTo(-58, 520); c.lineTo(58, 520); c.lineTo(66, 585); c.bezierCurveTo(200, 600, 300, 640, 330, 760); c.lineTo(380, 2300); c.lineTo(-380, 2300); c.lineTo(-330, 760); c.bezierCurveTo(-300, 640, -200, 600, -66, 585); c.closePath() };
    c.save(); c.globalAlpha *= 1 - out; c.translate(540 + sw, y0); c.scale(br, br);
    c.fillStyle = '#040507'; c.beginPath(); c.ellipse(0, 420, 92, 112, 0, 0, TAU); c.fill(); body(); c.fill();   // голова, плечи, пиджак
    c.beginPath(); c.moveTo(-70, 590); c.lineTo(0, 760); c.lineTo(70, 590); c.strokeStyle = 'rgba(255,170,110,.18)'; c.lineWidth = 3; c.stroke();   // лацканы
    c.strokeStyle = 'rgba(255,175,115,.55)'; c.lineWidth = 3.5; c.beginPath(); c.ellipse(0, 420, 92, 112, 0, Math.PI * 1.08, Math.PI * 1.92); c.stroke();   // кромка контрового света
    c.beginPath(); c.moveTo(-330, 760); c.bezierCurveTo(-300, 640, -200, 600, -66, 585); c.moveTo(330, 760); c.bezierCurveTo(300, 640, 200, 600, 66, 585); c.stroke();
    c.restore();
  }
  // ---------- конец обоих: вокруг капли вырастает корпус одноразки = кадр 0 главы 1 в миниатюре (как v23.0) ----------
  // v23.3: корпус одноразки выпрыгивает вокруг капли сразу целиком — с мундштуком нужной высоты (без «роста» мундштука); окно капсулы уже закрыто
  // кольцом, как в кадре 0 главы 1 (видна только тёмная щель с кольцом); капля сама поднимается к щели и втягивается в неё — диод вспыхивает (затяжка);
  // окно не открывается и не схлопывается: открывает его уже глава 1
  const SLIT = () => DEV0.y + S0 * (V1RY0 - DEVC.y);
  function deviceShot(c, t, t1, hb) {
    const pop = lp(.12, 1, spr(at(t, K.grow - .06, K.grow + .32)));
    const rs = 1 + .3 * Math.sin(Math.PI * at(t, K.suck1 - .05, K.suck1 + .22)), fl = Math.sin(Math.PI * at(t, K.suck1 - .04, K.suck1 + .5));
    c.save(); c.translate(DEV0.x, DEV0.y); c.scale(S0, S0); c.translate(-DEVC.x, -DEVC.y);
    if (pop < 1) { c.translate(DEVC.x, DEVC.y); c.scale(pop, pop); c.translate(-DEVC.x, -DEVC.y) }
    device1(c, t1, { g: 1, m: 1, lv: .15, rev: V1RY0 + 4, ry: V1RY0, rs, ra: 1, fl });
    c.restore();
    const u = eio(at(t, K.suck0, K.suck1)), y = lp(DEV0.y, SLIT(), u), sp = Math.sin(Math.PI * at(t, K.suck0, K.suck1));
    const r = CORE_R * (1 - .3 * eo(at(t, K.grow - .05, K.grow + .2))) * (1 - eio(at(t, K.suck1 - .24, K.suck1)));
    if (r > .4) { c.save(); c.translate(DEV0.x, y); c.scale(1 - .16 * sp, 1 + .34 * sp); drop(c, 0, 0, r, hb, 0, 0); c.restore() }   // тянется вверх кончиком
  }
  // ---------- v23.4, фильм на YouTube: капля выдыхает пар и сжимается в золотую точку — это точка в титре «01 · ОДНОРАЗКИ»; дымка, темнота ----------
  function vapor(c, t, x, y) {   // пар уходит вверх от капли, пока она сжимается; потом — тонкая дымка поперёк кадра
    for (let i = 0; i < 11; i++) {   // много слабых клубов — тянутся вверх и расходятся (один яркий читался серым шаром)
      const t0 = K.grow + .05 + i * .08, u = (t - t0) / 2.3; if (u <= 0 || u >= 1) continue;
      const e = eo(u), px = x + (i % 2 ? 1 : -1) * (20 + 9 * i) * e + 26 * Math.sin(i * 1.7 + u * 3), py = y - 20 - (260 + 14 * i) * e;
      glow(c, px, py, 30 + (150 + 8 * i) * e, '#dfe7f2', .055 * Math.sin(Math.PI * Math.min(1, u * 1.4)) * (1 - u));
    }
    const hz = at(t, K.ttl, K.ttl + 1.2); if (hz <= 0) return;
    for (let i = 0; i < 5; i++) {   // дымка едет вбок — её подхватит наплыв в ночной город
      const xx = 540 + ((i * 260 + 70 * t + i * i * 40) % 1400) - 700, yy = 760 + 170 * i + 30 * Math.sin(t * .7 + i);
      glow(c, xx, yy, 300 + 60 * (i % 3), '#cfd9e8', .055 * hz);
    }
  }
  // v23.6, фильм на YouTube (Андрей: «верни начало „Что вы знаете об одноразках?“»; Gemini: капля не исчезает, а заливается в окошко вейпа):
  // на «знакомого…» капля летит вверх в капсулу главы 1 и на низком ударе втягивается в неё; из капсулы растекается розовый фон главы —
  // последний кадр = кадр главы 1 за 1/30 с до её кадра 0 (её рисовка, ch1Frame), дальше сразу её вопрос. Без черноты и титра.
  let SC_L1 = null;   // преобразование живой камеры главы 1 (ставит scene) — в нём координаты кадра главы 1
  const CAPC = { x: V1Z.x, y: V1Z.top + 26 };   // середина видимой верхушки капсулы в кадре 0 главы 1
  function filmEnd(c, t, hb) {   // внутри камеры пролога: пар и капля до вылета; дальше каплю ведёт filmIris (в координатах главы 1)
    const cy = 980 + 4 * Math.sin(TAU * t / 3.3);
    vapor(c, t, 540, cy);
    if (t >= K.mor0 || !SC_L1) { if (SC_L1) { const M = SC_L1.inverse().multiply(c.getTransform()), p = M.transformPoint(new DOMPoint(540, cy)); DROPS = { x: p.x, y: p.y, s: Math.hypot(M.a, M.b) } } return }
    drop(c, 540, cy, CORE_R, hb, 0, 1);
  }
  let DROPS = { x: 540, y: 980, s: 1 };
  function filmIris(c, t, hb) {   // в координатах кадра главы 1 (после liveCam1, до камеры пролога)
    const u = at(t, K.mor0, K.mor1), e = u * u * (3 - 2 * u), q = eio(at(t, K.ir0, K.TE1)), wob = t * 1.6;
    if (q > 0) {   // розовый фон главы растекается из капсулы мягкой «жидкой» кромкой
      const R = lp(30, 1900, q);
      c.save(); c.beginPath();
      for (let i = 0; i <= 64; i++) { const a = i / 64 * TAU, rr = R * (1 + (.03 * Math.sin(a * 3 + wob) + .018 * Math.sin(a * 5 - wob * 1.3)) * (1 - q)); i ? c.lineTo(CAPC.x + Math.cos(a) * rr, CAPC.y + Math.sin(a) * rr) : c.moveTo(CAPC.x + Math.cos(a) * rr, CAPC.y + Math.sin(a) * rr) }
      c.closePath(); c.clip();
      band1(c); capsule1(c, t - K.TE, V1Z.x, V1Z.top, V1Z.bot, V1Z.w, V1RY0 + 4, 1, V1Z.w / 2, 0);
      c.restore();
    }
    const ca = eio(at(t, K.mor1 - .35, K.mor1));   // капсула проступает там, куда летит капля (на тёмном — до розового)
    if (ca > 0 && q < 1) { c.save(); c.globalAlpha *= ca * (1 - q); capsule1(c, t - K.TE, V1Z.x, V1Z.top, V1Z.bot, V1Z.w, V1RY0 + 4, 1, V1Z.w / 2, 0); c.restore() }
    if (t >= K.ir0) ring1(c, V1Z.x, V1RY0, 24, eio(at(t, K.ir0, K.ir0 + .25)), 8);   // кольцо-застёжка, как в кадре 0 главы
    if (u <= 0 || t >= K.mor1 + .12) return;
    const x = lp(DROPS.x, CAPC.x, e), y = lp(DROPS.y, CAPC.y + 6, e) - 120 * Math.sin(Math.PI * u) * (1 - u);   // по дуге вверх
    const r = CORE_R * DROPS.s * lp(1, .55, e) * (1 - eio(at(t, K.mor1 - .1, K.mor1 + .1)));   // у капсулы втягивается
    const st = Math.sin(Math.PI * u);
    if (r > .4) { c.save(); c.translate(x, y); c.scale(1 - .14 * st, 1 + .3 * st); drop(c, 0, 0, r, hb, 0, 1 - .5 * e); c.restore() }   // тянется кончиком вверх по ходу
  }
  // ---------- камера (как v23.0): медленный наезд, в конце — нырок в корпус = кадр главы 1 ----------
  const ZS1 = 1 / S0, P1 = { x: DEV0.x + S0 * (CX - DEVC.x), y: DEV0.y + S0 * (CY - DEVC.y) };
  const FZ = { x: (CX - ZS1 * P1.x) / (1 - ZS1), y: (CY - ZS1 * P1.y) / (1 - ZS1) }, VS = .004;
  function camZ(t) { return VS * t + (Math.log(ZS1) - VS * K.TE1) * eio(at(t, K.dive0, K.TE1)) }   // v23.7: и в фильме — нырок в корпус
  function shutters() {   // окна размытия движения: въезды и падения предметов, ряд, стягивание в каплю
    const o = [];
    if (VAR === 'A') { o.push([0, .45]); K.form.forEach(tf => o.push([tf - .16, tf + .32])); o.push([K.row - .1, K.row + .35]) }
    else { K.form.forEach(tf => o.push([tf - .2, tf + .06])); o.push([K.pull - .05, K.flare + .05]) }
    return o;
  }
  function scene(c, t) {
    const t1 = t - K.TE, hb = beatAt(t), fl = t > K.flare - .02 ? Math.exp(-Math.max(0, t - K.flare) / .3) * at(t, K.flare - .02, K.flare + .05) : 0;
    const s = Math.exp(camZ(t)), px = FZ.x - (FZ.x - CX) / s, py = FZ.y - (FZ.y - CY) / s;
    c.save(); liveCam1(c, t1); SC_L1 = c.getTransform();
    c.save(); cam(c, s, px, py);
    if (VAR === 'A') sceneA(c, t, hb, fl); else sceneB(c, t, hb, fl);
    if (t >= K.grow - .06) deviceShot(c, t, t1, hb);   // v23.7: и в фильме (Андрей: «верни 1 в 1 связку из утверждённого RU-интро»); filmEnd / filmIris (v23.4–23.6) не зовутся
    c.restore();
    title(c, t, [-1], VAR === 'A' ? K.s2 : K.back);   // титул чёткий с первого кадра (ТЗ: «без чёрного экрана с точкой» — сразу крючок)
    c.restore();
  }
