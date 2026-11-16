// v18 (15.11, ночь) — выпуск 2 «2020 · Лазейка одноразок» по ТЗ Андрея и Gemini (текст утверждён, голос ElevenLabs — Макс, как выпуск 1).
// Ролики: v18a — шортс (доска → штамп «ТОЛЬКО НА YOUTUBE» → ноутбук → последний кадр = кадр 0), v18b — мостик в главу 3 (криптекс 1924 →
// футляр помады → маркер стёрт → зум в сигарету с красным кончиком = кадр 0 главы 3). Тело 0:00–1:22,7 общее. 1080×1920, 30 к/с.
// Правила ТЗ: субтитры — плашка по центру X = 540, Y = 1640, ширина ≤ 920; всё важное — в Y 220…1450; метка года — (70, 80), 180×68;
// никаких переходов через чёрный/белый экран и «кашу» прозрачностей — предмет в предмет; без лиц, рук, крови, ничего во рту.
// Приёмы пульта: #011 крышка «?» → крыша, #136 конфетти, #137 фасад на пружине, #151 блики стекла, #042 шторка грузовиком (#158 фары),
// #127 гильотина (сок вместо крови), #112 два валика, #005 крест → шлейф → конвейер (#182 ролики), #007 волна (#134 кораблик по касательной),
// #109 кружки → столбики, #002 капля в бак (#132 двухслойная волна), #054/#055 пакеты и анализатор (#159 качание), #019 переворот 180°,
// #067 чертежи + краны на цепях (#164 сетка), #003 поворот торцом с точечной тенью, #009 холм → лампочка, #010 капля по змеевику,
// #012 + #138 касса и лента чека, #076 общежитие в разрезе, #064 криптекс, #150 штамп, #071 силуэт у ноутбука.
// Факты: FDA 02.01.2020 — запрет картриджей со вкусами (кроме табака и ментола), одноразки не упомянуты; NYTS 2020 — доля одноразок
// у старшеклассников 2,4 % → 26,5 %; WS-23 — синтетический охладитель (Йель, 2022); Elf Bar BC5000 — 13 мл, 5 %, 650 мА·ч ≈ 16 картриджей
// Juul по никотину (13 × 50 мг / ≈ 40 мг); синтетический никотин — Puff Bar с 2021, лазейку закрыли в 2022; Vuse Go (BAT), NJOY (Altria);
// «Мальборо» с 1924 — женские сигареты «Mild as May», красный кончик «Beauty Tip».
(function () {
  'use strict';
  const WW = 1080, HH = 1920, CX = WW / 2, CY = HH / 2, TAU = Math.PI * 2;
  const cl = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x, lp = (a, b, k) => a + (b - a) * k;
  const at = (t, a, b) => cl((t - a) / (b - a));
  const ss = (a, b, x) => { const k = cl((x - a) / (b - a)); return k * k * (3 - 2 * k) };
  const eo = k => 1 - Math.pow(1 - cl(k), 3), ei = k => Math.pow(cl(k), 3);
  const eio = k => { k = cl(k); return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2 };
  const bo = k => { k = cl(k); const s = 2.2; return 1 + (s + 1) * Math.pow(k - 1, 3) + s * Math.pow(k - 1, 2) };   // easeOutBack
  const spr = k => k <= 0 ? 0 : k >= 1 ? 1 : 1 - Math.exp(-6.2 * k) * Math.cos(10.5 * k);
  const H1 = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) };
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mixc = (a, b, k) => { const A = hex(a), B = hex(b); return 'rgb(' + A.map((v, i) => Math.round(lp(v, B[i], cl(k)))).join(',') + ')' };
  const rgba = (h, a) => { const [r, g, b] = hex(h); return `rgba(${r},${g},${b},${a})` };
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c };
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r) };
  const poly = (c, p) => { c.beginPath(); c.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) c.lineTo(p[i], p[i + 1]); c.closePath() };
  const fill = (c, col) => { c.fillStyle = col; c.fill() };
  const stroke = (c, col, w) => { c.strokeStyle = col; c.lineWidth = w; c.stroke() };
  const circ = (c, x, y, r, col) => { if (r <= 0) return; c.beginPath(); c.arc(x, y, r, 0, TAU); fill(c, col) };
  const rot = (x, y, r) => [x * Math.cos(r) - y * Math.sin(r), x * Math.sin(r) + y * Math.cos(r)];
  const FNT = o => `${o.w || 800} ${o.s || 40}px ${o.f || 'M'}`;
  function tw(c, s, o = {}) { c.save(); c.font = FNT(o); c.letterSpacing = (o.ls || 0) + 'px'; const w = c.measureText(s).width - (o.ls || 0); c.restore(); return w }
  function tx(c, s, x, y, o = {}) {
    if ((o.a ?? 1) <= 0) return;
    c.save(); c.font = FNT(o); c.letterSpacing = (o.ls || 0) + 'px'; c.textAlign = o.al || 'center'; c.textBaseline = 'middle'; c.globalAlpha *= o.a ?? 1;
    let sx = 1; if (o.max) { const w = c.measureText(s).width; if (w > o.max) sx = o.max / w }
    c.translate(x, y); c.scale(sx, 1);
    if (o.st) { c.lineJoin = 'round'; c.strokeStyle = o.st; c.lineWidth = o.sw || 8; c.strokeText(s, 0, 0) }
    c.fillStyle = o.c || '#fff'; c.fillText(s, 0, 0); c.restore();
  }
  const shadow = (c, col, b, dx, dy) => { c.shadowColor = col; c.shadowBlur = b; c.shadowOffsetX = dx; c.shadowOffsetY = dy };
  const noShadow = c => { c.shadowColor = 'transparent'; c.shadowBlur = 0; c.shadowOffsetX = c.shadowOffsetY = 0 };
  function glow(c, x, y, r, col, a) { if (a <= 0 || r <= 0) return; const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.fillRect(x - r, y - r, 2 * r, 2 * r) }
  function vignette(c, a) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); const g = c.createRadialGradient(CX, CY * .9, 380, CX, CY, 1250); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`); c.fillStyle = g; c.fillRect(0, 0, WW, HH); c.restore() }
  const C = {
    navy: '#0f172a', navy2: '#1e293b', deep: '#090d16', ink: '#0b1020', white: '#f8fafc', ice: '#38bdf8', ice2: '#bae6fd', ice3: '#e0f2fe',
    mango: '#f59e0b', cyan: '#06b6d4', red: '#ef4444', red2: '#b91c1c', pink: '#ec4899', yel: '#eab308', mint: '#10b981', slate: '#64748b', gold: '#e9b949',
    paper: '#f6efe0', blue: '#1d4ed8', blueD: '#1e3a8a',
  };

  // ---------- таймлайн: ключевые моменты — по словам голоса ----------
  let cv = null, X = null, K = null, TLW = [], TLX = {}, EPN = 'v18a', BR = false, CHUNKS = [];
  const CUES = window.CUES = window.CUES || {};
  const cue = (t0, name, gain = 1, pan = 0) => { if (!(t0 >= 0) || !name) return; const k = name + '@' + Math.round(t0 * 40); if (!(k in CUES)) CUES[k] = [Math.round(t0 * 1000) / 1000, name, gain, pan] };
  const nw = s => String(s).toLowerCase().replace(/[«»"“”.,?!…:;]/g, '');
  function W(q, n = 0) { let k = 0; for (const w of TLW) if (nw(w.d) === q) { if (k++ === n) return w.a } throw new Error('v18: нет слова «' + q + '» #' + n) }
  function WB(q, n = 0) { let k = 0; for (const w of TLW) if (nw(w.d) === q) { if (k++ === n) return w.b } throw new Error('v18: нет слова «' + q + '» #' + n) }
  function keys() {
    const k = {};
    k.q1 = W('ледяная'); k.all = W('всё'); k.law = W('закон'); k.jan = W('январь'); k.chop = W('рубят'); k.fl = ['манго', 'фрукты', 'десерты', 'мята'].map(q => W(q)); k.knife = W('нож');
    k.unroll = W('разверните'); k.cart = W('сменными'); k.cartE = WB('картриджами'); k.whole = W('цельные'); k.notm = W('упомянуты'); k.juul = W('джул'); k.took = W('убирал');
    k.shen = W('шэньчжэне'); k.conv = W('конвейеры'); k.puff = W('puff'); k.hqd = W('hqd'); k.elf = W('elf'); k.wave = W('волной'); k.year = W('всего'); k.teens = W('старшеклассников');
    k.grew = W('выросла'); k.x11 = W('одиннадцать'); k.flav = W('это'); k.flavE = WB('вкусы'); k.liq = W('жидкость'); k.synth = W('синтетический'); k.ws = W('ws-23'); k.fool = W('обманывает');
    k.ice = W('лёд'); k.tear = W('дерёт'); k.rem = W('помните'); k.pack = W('пачку'); k.grow2 = W('разрослись'); k.ml = W('тринадцать'); k.mesh = W('двойная'); k.puffs = W('тысячи');
    k.nic = W('никотину'); k.n16 = W('шестнадцать'); k.bypass = W('обойти'); k.tube = W('пробирке'); k.noleaf = W('без'); k.tabak = W('табака'); k.sales = W('стали');   // v18.2: «И когда одноразки стали приносить миллиарды долларов в год…» (вставка из дубля v18.1)
    k.ten = W('приносить'); k.bil = W('миллиарды'); k.corp = W('зашли'); k.old = W('старые'); k.corpE = WB('корпорации'); k.ban = W('запретом'); k.icepar = W('ледяной');
    k.tanks = W('гигантские'); k.endE = WB('пробирки');
    k.b0 = TLX.b0; k.endT = TLX.endT;
    if (!BR) { k.card2 = W('вторую'); k.three = W('трёх'); k.yt = W('youtube'); k.next = W('следующий'); k.ask = W('спросите'); k.askE = WB('себя') }
    else { k.rules = W('правила'); k.lead = W('ведь'); k.brut = W('брутальности'); k.ago = W('век'); k.mkt = W('рынок'); k.soft = W('нежные'); k.lady = W('леди'); k.ladyE = WB('леди') }
    return k;
  }

  // ---------- субтитры (ТЗ: X = 540, Y = 1640, ширина ≤ 920), по 1–4 слова, слова со звёздочкой — жёлтым ----------
  function buildChunks() {
    const out = [];
    for (const s of window.__TL.sent) {
      let cur = [];
      const flush = () => { if (cur.length) out.push({ a: cur[0].a, b: cur[cur.length - 1].b, w: cur }); cur = [] };
      for (const w of s.words) {
        const len = cur.reduce((n, x) => n + x.d.length + 1, 0) + w.d.length;
        if (cur.length >= 4 || (cur.length && len > 24)) flush();
        cur.push(w); if (/[.?!…:]$/.test(w.d)) flush();
      }
      flush();
    }
    out.forEach((ch, i) => { ch.e = i < out.length - 1 ? Math.min(out[i + 1].a, ch.b + .7) : ch.b + .6 });
    return out;
  }
  const SUBY = 1640;
  function subs(c, t) {
    const ch = CHUNKS.find(x => t >= x.a - .05 && t < x.e); if (!ch) return;
    const endK = !BR ? 1 - ss(K.askE + .05, K.askE + .3, t) : 1 - ss(K.ladyE + .1, K.ladyE + .35, t); if (endK <= 0) return;
    const o = { f: 'M', w: 800, s: 54 }, parts = ch.w.map(w => w.d), sp = tw(c, ' ', o);
    let wsum = parts.reduce((n, p) => n + tw(c, p, o), 0) + sp * (parts.length - 1); const sc = Math.min(1, 860 / wsum), w = wsum * sc + 60, h = 86;
    const k = eo(at(t, ch.a - .05, ch.a + .1)) * endK;
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = k; c.translate(0, (1 - k) * 10);
    rr(c, CX - w / 2, SUBY - h / 2, w, h, 22); fill(c, 'rgba(11,16,40,.86)');
    let x = CX - wsum * sc / 2; c.translate(x, SUBY + 2); c.scale(sc, 1); x = 0;
    ch.w.forEach((wd, i) => { const ww = tw(c, wd.d, o); tx(c, wd.d, x + ww / 2, 0, { ...o, c: wd.c === 'y' && t >= wd.a - .05 ? '#fde047' : C.white }); x += ww + sp });
    c.restore();
  }

  // ---------- метка года (ТЗ: (70, 80), 180×68, тёмно-синяя таблетка без рамки, белые цифры 38 px) ----------
  function yearPlate(c, t, a, yr0, yr1, k) {
    if (a <= 0) return;
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = a;
    rr(c, 70, 80, 180, 68, 18); fill(c, 'rgba(15,23,42,.88)');
    c.beginPath(); c.rect(70, 80, 180, 68); c.clip();
    if (!yr1 || k <= 0) tx(c, yr0, 160, 116, { s: 38, w: 800, ls: 2 });
    else { const e = eio(k); tx(c, yr0, 160, 116 - 68 * e, { s: 38, w: 800, ls: 2 }); tx(c, yr1, 160, 116 + 68 * (1 - e), { s: 38, w: 800, ls: 2 }) }
    c.restore();
  }
  function yearV(c, t) {
    if (t >= K.b0 - .4) { const a = 1 - ss(K.b0 - .4, K.b0, t); if (a > 0) yearPlate(c, t, a, '2022'); return }
    if (t < K.liq) return yearPlate(c, t, 1, '2020');
    if (t < K.sales) return yearPlate(c, t, 1, '2020', '2021', at(t, K.liq, K.liq + .35));
    return yearPlate(c, t, 1, '2021', '2022', at(t, K.sales, K.sales + .35));
  }

  // ---------- живая камера и зерно (последний кадр шортса — фаза кадра 0) ----------
  function liveCam(c, t) {
    const dx = 10 * Math.sin(TAU * t / 6.1) + 5 * Math.sin(TAU * t / 2.9 + 1), dy = 7 * Math.sin(TAU * t / 7.7 + 2) + 3 * Math.sin(TAU * t / 3.3);
    const z = 1.03 + .01 * Math.sin(TAU * t / 9.5), r = .003 * Math.sin(TAU * t / 8.3);
    c.translate(CX, CY); c.rotate(r); c.scale(z, z); c.translate(-CX + dx, -CY + dy);
  }
  let GR = null;
  function post(c, t) {
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
    if (!GR) { GR = mk(256, 256); const x = GR.getContext('2d'), im = x.createImageData(256, 256), d = im.data; for (let i = 0; i < 65536; i++) { const v = 128 + (H1(i * 1.37 + 5) - .5) * 200; d[4 * i] = d[4 * i + 1] = d[4 * i + 2] = v; d[4 * i + 3] = 255 } x.putImageData(im, 0, 0) }
    const f = (!BR && t >= K.endT) ? 0 : Math.floor(t * 30), ox = Math.floor(H1(f * 3.1) * 256), oy = Math.floor(H1(f * 7.7) * 256);
    c.globalCompositeOperation = 'overlay'; c.globalAlpha = .05; c.translate(-ox, -oy); c.fillStyle = c.createPattern(GR, 'repeat'); c.fillRect(0, 0, WW + 256, HH + 256);
    c.restore(); vignette(c, .3);
  }

  // ================= предметы =================
  // одноразка «манго-лёд»: (x, y) — центр корпуса; w×h — корпус; иней по краям; плашка MANGO ICE
  function disp(c, x, y, w = 180, h = 460, o = {}) {
    c.save(); c.translate(x, y);
    shadow(c, 'rgba(0,0,0,.45)', 40, 14, 22);
    const g = c.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, o.c0 || C.mango); g.addColorStop(1, o.c1 || C.cyan);
    rr(c, -w / 2, -h / 2, w, h, 36 * w / 180); fill(c, g); noShadow(c);
    const hl = c.createLinearGradient(-w / 2, 0, w / 2, 0); hl.addColorStop(0, 'rgba(255,255,255,.28)'); hl.addColorStop(.25, 'rgba(255,255,255,0)'); hl.addColorStop(.8, 'rgba(0,0,0,0)'); hl.addColorStop(1, 'rgba(0,0,0,.22)');
    rr(c, -w / 2, -h / 2, w, h, 36 * w / 180); fill(c, hl);
    rr(c, -w * .36, -h * .02, w * .72, h * .2, 10 * w / 180); fill(c, 'rgba(255,255,255,.95)');
    tx(c, o.label || 'МАНГО-ЛЁД', 0, h * .08, { s: 26 * w / 180, w: 800, ls: 2, c: C.ink, max: w * .66 });
    rr(c, -w * .12, -h * .38, w * .24, h * .26, 12 * w / 180); fill(c, 'rgba(255,255,255,.22)');   // окошко жидкости
    if (o.frost !== false) {   // 6 кристаллов инея по краям
      const P = [[-.5, -.36], [.5, -.18], [-.5, .12], [.5, .3], [-.42, .44], [.44, -.44]];
      P.forEach(([u, v], i) => frostStar(c, u * w, v * h, (14 + 8 * H1(i * 3.3)) * w / 180, i * .7, .75));
    }
    c.restore();
  }
  function frostStar(c, x, y, r, a, al = .8) {
    c.save(); c.translate(x, y); c.rotate(a); c.globalAlpha *= al; c.strokeStyle = '#ffffff'; c.lineWidth = Math.max(1.5, r * .16); c.lineCap = 'round';
    for (let i = 0; i < 6; i++) { const an = i * TAU / 6, ex = Math.cos(an) * r, ey = Math.sin(an) * r; c.beginPath(); c.moveTo(0, 0); c.lineTo(ex, ey); c.moveTo(ex * .55, ey * .55); c.lineTo(ex * .55 + Math.cos(an + .7) * r * .3, ey * .55 + Math.sin(an + .7) * r * .3); c.moveTo(ex * .55, ey * .55); c.lineTo(ex * .55 + Math.cos(an - .7) * r * .3, ey * .55 + Math.sin(an - .7) * r * .3); c.stroke() }
    c.restore();
  }
  // колпачок-мундштук: трапеция со скруглённым верхом, w×h, центр (x, y); на роли крыши — шире, со снегом и сосульками (k → 1)
  function capShape(c, x, y, w, h, roof = 0) {
    c.save(); c.translate(x, y);
    shadow(c, 'rgba(56,189,248,.45)', 24, 0, 10);
    const tw2 = w * lp(.62, .96, roof);
    c.beginPath(); c.moveTo(-w / 2, h / 2); c.lineTo(-tw2 / 2, -h / 2 + 18); c.quadraticCurveTo(-tw2 / 2, -h / 2, -tw2 / 2 + 18, -h / 2); c.lineTo(tw2 / 2 - 18, -h / 2); c.quadraticCurveTo(tw2 / 2, -h / 2, tw2 / 2, -h / 2 + 18); c.lineTo(w / 2, h / 2); c.closePath();
    fill(c, C.white); noShadow(c);
    c.save(); c.clip(); c.fillStyle = C.ice2; c.fillRect(-w / 2, h / 2 - h * .22, w, h * .22); c.fillStyle = 'rgba(186,230,253,.5)'; c.fillRect(w * .18, -h / 2, w * .1, h); c.restore();
    if (roof > 0) {
      c.save(); c.globalAlpha *= roof;
      c.fillStyle = '#ffffff'; for (let i = 0; i < 9; i++) { const sx = -tw2 / 2 + 30 + i * (tw2 - 60) / 8; c.beginPath(); c.ellipse(sx, -h / 2 + 2, 52, 22, 0, Math.PI, 0); c.fill() }   // снег на крыше
      c.fillStyle = C.ice3; for (let i = 0; i < 14; i++) { const sx = -w / 2 + 30 + i * (w - 60) / 13, L = 18 + 30 * H1(i * 2.7); poly(c, [sx - 9, h / 2, sx + 9, h / 2, sx, h / 2 + L]); c.fill() }   // сосульки
      c.restore();
    }
    c.restore();
  }
  function confettiShape(c, kind, s) {
    if (kind === 0) { poly(c, [0, -s, s * .7, 0, 0, s, -s * .7, 0]); fill(c, C.ice3) }
    else if (kind === 1) { c.beginPath(); for (let i = 0; i < 6; i++) { const a = i * TAU / 6; i ? c.lineTo(Math.cos(a) * s, Math.sin(a) * s) : c.moveTo(Math.cos(a) * s, Math.sin(a) * s) } c.closePath(); fill(c, C.ice) }
    else { c.fillStyle = '#ffffff'; c.fillRect(-s, -s * .22, 2 * s, s * .44); c.fillRect(-s * .22, -s, s * .44, 2 * s) }
  }
  // фон ночной улицы: небо, снег, далёкие дома, тротуар
  function nightBg(c, t, a = 1) {
    const g = c.createRadialGradient(CX, 860, 40, CX, 860, 1300); g.addColorStop(0, C.navy2); g.addColorStop(1, C.navy);
    c.fillStyle = g; c.fillRect(-400, -400, WW + 800, HH + 800);
    if (a <= 0) return;
    c.save(); c.globalAlpha *= a;
    c.fillStyle = 'rgba(30,41,59,.85)'; for (let i = 0; i < 14; i++) { const bx = -120 + i * 96, bh = 160 + 260 * H1(i * 5.1); c.fillRect(bx, 1310 - bh, 84, bh); }
    c.fillStyle = 'rgba(253,230,138,.25)'; for (let i = 0; i < 14; i++) for (let r = 0; r < 5; r++) if (H1(i * 9 + r) > .6) c.fillRect(-100 + i * 96 + 14 + 30 * (r % 2), 1310 - 60 - r * 46, 16, 20);
    c.fillStyle = '#1e2a44'; c.fillRect(-400, 1310, WW + 800, 140); c.fillStyle = '#2a3a5c'; c.fillRect(-400, 1310, WW + 800, 8);
    c.fillStyle = '#121b2e'; c.fillRect(-400, 1450, WW + 800, 900);
    for (let i = 0; i < 40; i++) { const ph = (t * (.05 + .05 * H1(i)) + H1(i * 3.3)) % 1, x = (H1(i * 7.1) * 1200 + Math.sin(t * .8 + i) * 30) - 60, y = lp(-40, 1460, ph); circ(c, x, y, 2 + 3 * H1(i * 1.9), 'rgba(255,255,255,.6)') }
    c.restore();
  }
  // вейп-шоп «VAPE 24/7»: фасад 740×520 (Y 790…1310), k — насколько выпрыгнул (пружина), roof — крыша нарисована отдельно
  const BOXC = ['#f472b6', '#fb923c', '#34d399', '#a78bfa', '#38bdf8', '#facc15', '#f87171', '#2dd4bf'];
  function shop(c, t, k) {
    if (k <= 0) return;
    const s = bo(k), H = 520 * s, top = 1310 - H;
    c.save();
    shadow(c, 'rgba(0,0,0,.5)', 30, 0, 18); rr(c, CX - 370, top, 740, H, 8); fill(c, '#1b2540'); noShadow(c);
    c.beginPath(); c.rect(CX - 370, top, 740, H); c.clip(); c.translate(0, top - 790);
    rr(c, CX - 300, 812, 600, 70, 14); fill(c, '#0b1324');   // вывеска
    const fl = .82 + .18 * Math.sin(t * 9) * Math.sin(t * 2.3);
    glow(c, CX, 846, 260, '#2dd4bf', .35 * fl); tx(c, 'ВЕЙПЫ 24/7', CX, 848, { s: 58, w: 800, ls: 6, c: '#5eead4', st: rgba('#14b8a6', .6 * fl), sw: 10 });
    rr(c, CX - 320, 904, 640, 340, 10); fill(c, '#0c1a2e');   // окно
    for (let r = 0; r < 3; r++) for (let q = 0; q < 8; q++) {
      const bx = CX - 320 + 22 + q * 75, by = 904 + 14 + r * 108; c.fillStyle = 'rgba(255,255,255,.08)'; c.fillRect(bx - 6, by + 95, 70, 6);
      rr(c, bx, by, 55, 95, 6); fill(c, BOXC[(q + r * 3) % 8]); rr(c, bx + 8, by + 40, 39, 24, 4); fill(c, 'rgba(255,255,255,.85)');
    }
    c.save(); c.globalAlpha = .35; c.strokeStyle = '#ffffff'; c.lineWidth = 16; for (const [x0, w0] of [[-260, 16], [-200, 6], [120, 14], [170, 5]]) { c.lineWidth = w0; c.beginPath(); c.moveTo(CX + x0, 1244); c.lineTo(CX + x0 + 150, 904); c.stroke() } c.restore();   // блики стекла (#151)
    rr(c, CX - 330, 894, 660, 360, 12); stroke(c, '#334155', 10);
    c.restore();
  }
  function bush(c, x, y, k) {
    if (k <= 0) return; const s = bo(k);
    c.save(); c.translate(x, y); c.scale(s, s);
    [[-50, -30, 60], [10, -60, 70], [60, -26, 56], [-10, -10, 64]].forEach(([dx, dy, r], i) => circ(c, dx, dy, r, i % 2 ? '#1f6f6a' : '#2a8a7f'));
    [[-40, -66], [20, -110], [70, -60]].forEach(([dx, dy], i) => { circ(c, dx, dy, 22, '#e0f2fe'); frostStar(c, dx + 10, dy + 30, 12, i, .7) });
    c.restore();
  }

  // ================= сцена 1 (0:00–0:08,6) · #011 колпачок «?» → крыша ночного вейп-шопа =================
  const CAP0 = { x: 540, y: 585, w: 140, h: 95 };
  function s1(c, t) {
    const kd = eio(at(t, 3.0, 3.7));   // «?» и корпус уходят вниз
    nightBg(c, t, ss(3.4, 4.4, t));
    glow(c, CX, 860, 520, '#1e293b', .5);
    // корпус
    if (kd < 1) disp(c, 540, 860 + kd * 1400, 180, 460);
    // колпачок: подпрыгивает на 340 (пружина), висит, падает на 680 и расширяется в 5,5 раза → крыша
    const kj = at(t, .5, 1.05), kf = eio(at(t, 3.1, 3.75));
    let cy = CAP0.y; if (kj > 0) cy = lp(CAP0.y, 340, bo(kj)); cy += Math.sin(TAU * t * .9) * 8 * ss(1.1, 1.4, t) * (1 - kf);
    cy = lp(cy, 680, kf); const cw = lp(CAP0.w, 780, kf), ch = lp(CAP0.h, 110, kf);
    // фасад магазина выпрыгивает из-под крыши (#137), кусты по бокам
    shop(c, t, at(t, 3.65, 4.25));
    bush(c, 120, 1312, at(t, 4.1, 4.6)); bush(c, 960, 1312, at(t, 4.25, 4.75));
    capShape(c, CX, cy, cw, ch, ss(.55, 1, kf));
    // «?» из щели и снежинки-конфетти (#136)
    const kq = at(t, .55, 1.25); if (kq > 0 && kd < 1) {
      const e = eo(kq), qy = lp(640, 470, e) + kd * 1400, qs = lp(.2, 1, bo(kq));
      c.save(); c.translate(CX + 40 * Math.sin(e * 2), qy); c.rotate(lp(-.6, .12, e) + Math.sin(t * 2.2) * .05 * e); c.scale(qs, qs); tx(c, '?', 0, 0, { s: 180, w: 800, c: C.ice, st: '#ffffff', sw: 14 }); c.restore();
    }
    for (let i = 0; i < 18; i++) {
      const t0 = .6 + .03 * (i % 6), u = t - t0; if (u <= 0 || u > 2.6) continue;
      const a = -Math.PI / 2 + (H1(i * 3.7) - .5) * 2.6, v = 820 + 500 * H1(i * 1.3), x = CX + Math.cos(a) * v * u, y = 600 + Math.sin(a) * v * u + 900 * u * u + kd * 1400;
      c.save(); c.translate(x, y); c.rotate(u * (3 + 4 * H1(i))); c.globalAlpha *= 1 - ss(2.0, 2.6, u); confettiShape(c, i % 3, 12 + 10 * H1(i * 2.1)); c.restore();
    }
  }

  // ================= сцена 2 (0:08,6–0:20,9) · #042 шторка грузовиком + #127 гильотина с соком =================
  const TRK = { w: 1150, top: 450, bot: 1430 };
  const truckX = t => lp(1400, -1400, at(t, K.all + .1, K.all + 2.9));   // центр
  function truck(c, x) {
    const L = x - TRK.w / 2, R = x + TRK.w / 2, T = TRK.top, B = TRK.bot;
    c.save();
    const g = c.createLinearGradient(L - 700, 0, L, 0); g.addColorStop(0, 'rgba(253,224,71,0)'); g.addColorStop(1, 'rgba(253,224,71,.42)');
    c.fillStyle = g; poly(c, [L + 10, B - 210, L - 760, B - 320, L - 760, B - 30, L + 10, B - 150]); c.fill(); poly(c, [L + 10, B - 120, L - 620, B - 140, L - 620, B + 60, L + 10, B - 70]); c.fill();
    c.fillStyle = '#090d16';
    rr(c, L, B - 520, 300, 430, [60, 20, 0, 0]); c.fill();   // кабина слева (едет влево)
    rr(c, L + 290, T, TRK.w - 290, B - T - 90, 10); c.fill();   // прицеп
    c.fillStyle = '#131a2a'; for (let i = 0; i < 6; i++) c.fillRect(L + 330 + i * 140, T + 30, 8, B - T - 150);
    for (const wx of [L + 120, L + 470, L + 900, L + 1030]) { circ(c, wx, B - 70, 74, '#05070c'); circ(c, wx, B - 70, 30, '#1f2937') }
    circ(c, L + 18, B - 190, 16, '#fde047'); glow(c, L + 18, B - 190, 70, '#fde047', .8);
    c.fillStyle = 'rgba(148,163,184,.25)'; rr(c, L + 30, B - 480, 170, 150, [40, 8, 0, 0]); c.fill();
    c.restore();
  }
  const GL = { x: 540, top: 300, bot: 1360, w: 680 };
  const CART = [[300, C.mango, 'МАНГО'], [460, C.pink, 'ФРУКТЫ'], [620, C.yel, 'ДЕСЕРТ'], [780, C.mint, 'МЯТА']];
  function cartridge(c, x, y, w, h, col, label, cut = 0, top = 0) {   // (x, y) — центр; cut — верх отрублен и улетел (top — смещение куска)
    c.save(); c.translate(x, y);
    const draw = (clipTop) => {
      rr(c, -w * .3, -h / 2, w * .6, h * .2, [10, 10, 0, 0]); fill(c, '#111827');   // мундштук
      rr(c, -w / 2, -h * .32, w, h * .82, [6, 6, 16, 16]); fill(c, 'rgba(226,232,240,.92)');
      c.save(); rr(c, -w / 2, -h * .32, w, h * .82, [6, 6, 16, 16]); c.clip(); c.fillStyle = col; c.fillRect(-w / 2, -h * .2, w, h); c.fillStyle = 'rgba(255,255,255,.3)'; c.fillRect(-w / 2 + 10, -h * .3, 10, h * .76); c.restore();
      rr(c, -w / 2, h * .38, w, h * .12, [0, 0, 16, 16]); fill(c, '#1f2937');
    };
    if (cut <= 0) draw();
    else {
      c.save(); c.beginPath(); c.rect(-w, -4, 2 * w, h); c.clip(); draw(); c.restore();   // низ — в колодке
      c.save(); c.translate(top * .35, -top); c.rotate(top * .002); c.beginPath(); c.rect(-w, -h, 2 * w, h - 4); c.clip(); draw(); c.restore();
    }
    c.restore();
  }
  function guillotine(c, t) {
    const G = GL;
    // бланк между стойками
    shadow(c, 'rgba(0,0,0,.5)', 40, 0, 20); rr(c, G.x - G.w / 2, G.top, G.w, G.bot - G.top, 14); fill(c, '#e8dcc0'); noShadow(c);
    c.fillStyle = 'rgba(120,100,70,.18)'; for (let y = 790; y < 1020; y += 34) c.fillRect(G.x - 250, y, 500, 3);
    // стойки и перекладина (дерево со сталью)
    for (const sx of [-1, 1]) { const x = G.x + sx * (G.w / 2 - 40); rr(c, x - 40, G.top - 20, 80, G.bot - G.top + 40, 8); fill(c, '#5b3418'); c.fillStyle = '#7c4a24'; c.fillRect(x - 40, G.top - 20, 14, G.bot - G.top + 40); c.fillStyle = '#94a3b8'; c.fillRect(x + (sx < 0 ? 24 : -32), G.top, 8, G.bot - G.top) }
    rr(c, G.x - G.w / 2 - 20, G.top - 40, G.w + 40, 90, 10); fill(c, '#4a2a12');
    circ(c, G.x, G.top + 4, 62, '#b8862b'); circ(c, G.x, G.top + 4, 52, C.gold); c.save(); c.strokeStyle = '#8a6420'; c.lineWidth = 3; c.setLineDash([6, 5]); c.beginPath(); c.arc(G.x, G.top + 4, 44, 0, TAU); c.stroke(); c.restore();
    tx(c, 'FDA', G.x, G.top - 6, { s: 30, w: 800, c: '#3b2a0a' }); tx(c, 'США', G.x, G.top + 24, { s: 16, w: 800, ls: 2, c: '#3b2a0a' });
    tx(c, 'FDA · 2 ЯНВАРЯ 2020', G.x, 700, { s: 34, w: 800, ls: 3, c: '#1e293b' });   // ниже лезвия — не закрывается
    tx(c, 'ПРИОРИТЕТЫ ЗАПРЕТА', G.x, 748, { s: 22, w: 800, ls: 4, c: '#7c2d12' });
  }
  function stock(c, t, cutT) {   // колодка с 4 вырезами + картриджи; после удара верхушки улетают с соком
    const y0 = 1050, kc = cutT == null ? 0 : at(t, cutT, cutT + 1.6);
    CART.forEach(([x, col, lab], i) => { const up = kc > 0 ? (900 * eo(kc) * (.8 + .4 * H1(i)) + 300 * kc * kc) : 0; cartridge(c, x, 990, 110, 210, col, lab, kc > 0 ? 1 : 0, up) });
    rr(c, GL.x - GL.w / 2 + 20, y0, GL.w - 40, 92, 8); fill(c, '#6b3b1a'); c.fillStyle = '#86502a'; c.fillRect(GL.x - GL.w / 2 + 20, y0, GL.w - 40, 12);
    CART.forEach(([x, col, lab], i) => {
      c.beginPath(); c.arc(x, y0 + 2, 60, 0, Math.PI); fill(c, '#3b200d');
      const hi = Math.max(...K.fl.map((f, j) => j === i ? Math.sin(Math.PI * at(t, f - .05, f + .45)) : 0));
      tx(c, lab, x, y0 + 72, { s: 22, w: 800, ls: 1, c: mixc('#fde68a', '#ffffff', hi) }); if (hi > 0) glow(c, x, y0 + 72, 90, col, .5 * hi);
    });
  }
  function greyCart(c, x, y, lab) {
    c.save(); c.translate(x, y); rr(c, -24, -80, 48, 34, [8, 8, 0, 0]); fill(c, '#334155'); rr(c, -40, -48, 80, 128, [6, 6, 14, 14]); fill(c, '#64748b'); c.restore();
    tx(c, lab, x, y + 110, { s: 22, w: 800, ls: 1, c: '#cbd5e1' });
    circ(c, x + 34, y - 82, 22, '#16a34a'); c.save(); c.strokeStyle = '#fff'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(x + 24, y - 82); c.lineTo(x + 32, y - 74); c.lineTo(x + 45, y - 92); c.stroke(); c.restore();
    tx(c, 'РАЗРЕШЕНО', x, y + 140, { s: 15, w: 800, ls: 1, c: '#4ade80' });
  }
  function blade(c, t, by) {   // by — верх лезвия; скос 35°, белая кромка, надпись
    const L = GL.x - 310, R = GL.x + 310, H = 280, d = Math.tan(35 * Math.PI / 180) * 0 + 140;
    c.save(); shadow(c, 'rgba(0,0,0,.45)', 20, 0, 12);
    poly(c, [L, by, R, by, R, by + H - d, L, by + H]); fill(c, '#94a3b8'); noShadow(c);
    poly(c, [L, by + H - 26, R, by + H - d - 26, R, by + H - d, L, by + H]); fill(c, '#f1f5f9');
    c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(L, by, 620, 14);
    circ(c, GL.x, by + 50, 14, '#475569');
    tx(c, 'ЗАПРЕТ ВКУСОВ', GL.x, by + 112, { s: 40, w: 800, ls: 3, c: '#1e293b' });
    c.restore();
    c.strokeStyle = '#334155'; c.lineWidth = 6; c.beginPath(); c.moveTo(GL.x, GL.top + 40); c.lineTo(GL.x, by + 50); c.stroke();
  }
  function juice(c, t, t0) {   // 24 скруглённые полосы и капли сока веером вверх (без крови)
    const u = t - t0; if (u <= 0 || u > 2.4) return;
    for (let i = 0; i < 24; i++) {
      const j = i % 4, col = CART[j][1], x0 = CART[j][0], a = -Math.PI / 2 + (H1(i * 2.9) - .5) * 1.9, v = 900 + 700 * H1(i * 4.3), x = x0 + Math.cos(a) * v * u, y = 980 + Math.sin(a) * v * u + 1500 * u * u;
      c.save(); c.globalAlpha *= 1 - ss(1.6, 2.4, u); c.translate(x, y);
      if (i % 3) { c.rotate(Math.atan2(Math.sin(a) * v + 3000 * u, Math.cos(a) * v) + Math.PI / 2); rr(c, -9, -38, 18, 76, 9); fill(c, col) } else circ(c, 0, 0, 12 + 8 * H1(i), col);
      c.restore();
    }
  }
  function s2(c, t) {
    nightBg(c, t, 1);
    const Tc = K.chop, fall = at(t, Tc, Tc + 5 / 30), by = lp(330, 768, ei(fall)) - (t > K.knife ? 26 * Math.sin(Math.PI * at(t, K.knife, K.knife + .5)) : 0);
    guillotine(c, t);
    greyCart(c, 110, 1140, 'ТАБАК'); greyCart(c, 970, 1140, 'МЕНТОЛ');
    stock(c, t, t >= Tc + 5 / 30 ? Tc + 5 / 30 : null);
    blade(c, t, by);
    juice(c, t, Tc + 5 / 30);
    if (t > K.knife) { const g = Math.sin(Math.PI * at(t, K.knife + .1, K.knife + .5)); if (g > 0) glow(c, GL.x + 240, by + 230, 120, '#ffffff', .8 * g) }
  }
  // шторка: прицеп грузовика — граница маски; за задним краем уже гильотина
  function s1to2(c, t) {
    const x = truckX(t), rear = x + TRK.w / 2;
    c.save(); c.beginPath(); c.rect(-400, -400, rear + 400, HH + 800); c.clip(); s1(c, t); c.restore();
    c.save(); c.beginPath(); c.rect(rear, -400, WW + 800, HH + 800); c.clip(); s2(c, t); c.restore();
    truck(c, x);
  }

  // ================= сцена 3 (0:20,9–0:33,6) · #112 два валика → дыра в законе → #005 крест → конвейер =================
  function rollerPair(c, y, r, sep) {   // два валика (860×75) с жёлтыми ручками; sep — половина расстояния между ними
    for (const sd of [-1, 1]) {
      const yy = y + sd * sep; c.save(); c.translate(CX, yy); c.rotate(r);
      shadow(c, 'rgba(0,0,0,.45)', 24, 0, 14);
      const g = c.createLinearGradient(0, -37, 0, 37); g.addColorStop(0, '#cbd5e1'); g.addColorStop(.5, '#94a3b8'); g.addColorStop(1, '#475569');
      rr(c, -430, -37, 860, 75, 36); fill(c, g); noShadow(c);
      for (const hx of [-1, 1]) { rr(c, hx * 430 - (hx > 0 ? 0 : 60), -18, 60, 36, 10); fill(c, '#facc15'); rr(c, hx * 490 - 20, -30, 40, 60, 14); fill(c, '#eab308') }
      c.restore();
    }
  }
  const HOLE = { x: 540, y: 960, w: 160, h: 380 };
  function holePath(c) {   // форма одноразки: корпус + мундштук
    const { x, y, w, h } = HOLE; c.beginPath(); c.roundRect(x - w / 2, y - h / 2 + 50, w, h - 50, 34); c.roundRect(x - w * .3, y - h / 2, w * .6, 70, [24, 24, 6, 6]);
  }
  function scroll(c, t, top, bot) {   // кремовый свиток закона между валиками
    c.save(); c.beginPath(); c.rect(CX - 410, top, 820, bot - top); c.clip();
    c.fillStyle = C.paper; c.fillRect(CX - 410, 220, 820, 1260);
    c.fillStyle = 'rgba(160,130,90,.12)'; for (let y = 300; y < 1400; y += 44) c.fillRect(CX - 360, y, 720, 2);
    tx(c, 'УКАЗ FDA · ЯНВАРЬ 2020', CX, 380, { f: 'J', s: 34, w: 700, ls: 3, c: '#1e293b' });
    c.fillStyle = '#1e293b'; c.fillRect(CX - 330, 412, 660, 4);
    for (let i = 0; i < 4; i++) { c.fillStyle = 'rgba(30,41,59,.28)'; c.fillRect(CX - 330, 450 + i * 34, i === 3 ? 400 : 660, 12) }
    tx(c, 'ЗАПРЕТ РАСПРОСТРАНЯЕТСЯ ТОЛЬКО НА:', CX, 640, { s: 34, w: 800, ls: 1, c: '#0f172a', max: 720 });
    const km = eio(at(t, K.cart - .05, K.cartE + .1)); if (km > 0) { c.fillStyle = '#fef08a'; c.fillRect(CX - 360, 706, 720 * km, 52) }
    tx(c, '• УСТРОЙСТВА СО СМЕННЫМИ КАРТРИДЖАМИ', CX, 732, { s: 31, w: 800, c: '#0f172a', max: 720 });
    // дыра в бумаге: красный пунктир по форме одноразки, внутри — глубина
    const kh = at(t, K.whole - .1, K.whole + .5);
    if (kh > 0) {
      c.save(); holePath(c); c.clip(); c.fillStyle = C.deep; c.fillRect(0, 0, WW, HH); const g = c.createRadialGradient(HOLE.x, HOLE.y, 10, HOLE.x, HOLE.y, 220); g.addColorStop(0, `rgba(30,58,138,${.5 * kh})`); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, WW, HH);
      if (kh < 1) { c.globalAlpha = 1 - eo(kh); c.fillStyle = C.paper; c.fillRect(0, 0, WW, HH) } c.restore();
      const pu = .7 + .3 * Math.sin(t * 7); c.save(); c.setLineDash([16, 12]); c.lineDashOffset = -t * 40; holePath(c); c.strokeStyle = rgba('#dc2626', Math.min(1, kh * 2) * pu); c.lineWidth = 6; c.stroke(); c.restore();
      glow(c, HOLE.x, HOLE.y, 260, '#ef4444', .18 * kh * pu);
      tx(c, '[ ЦЕЛЬНЫЕ ОДНОРАЗОВЫЕ — НЕ УПОМЯНУТЫ ]', CX, 1210, { s: 28, w: 800, c: '#b91c1c', a: ss(K.whole + .2, K.whole + .6, t), max: 740 });
    }
    c.restore();
  }
  function s3scroll(c, t, noBg) {
    if (!noBg) nightBg(c, t, 0);
    const kf = eo(at(t, K.unroll - .1, K.unroll + .55)), ka = eio(at(t, K.unroll + .45, K.unroll + 1.5));
    const y = lp(-260, 820, kf), r = lp(-.31, 0, eo(at(t, K.unroll - .1, K.unroll + .65)));   // −18°
    const sep = lp(42, 540, ka), top = y - sep, bot = y + sep;
    if (ka > 0) { c.save(); shadow(c, 'rgba(0,0,0,.4)', 40, 0, 20); c.fillStyle = C.paper; c.fillRect(CX - 410, top, 820, bot - top); c.restore(); scroll(c, t, top, bot) }
    rollerPair(c, y, r, sep);
  }
  // за дырой: табличка JUUL, крест падает и сбивает её, шлейф застывает первой одноразкой, конвейер Шэньчжэня
  const BELT = { y: 1220, h: 120 };
  function boxDisp(c, x, y, i, lit = 1) {   // коробка одноразки 150×360, низ — y
    const cols = [['#fb923c', '#f43f5e'], ['#38bdf8', '#6366f1'], ['#a3e635', '#14b8a6'], ['#f472b6', '#a855f7'], ['#facc15', '#f97316']][i % 5], labs = ['МАНГО-ЛЁД', 'ЧЕРНИКА', 'МЯТА-ЛЁД', 'ВИНОГРАД', 'БАНАН-ЛЁД'];
    c.save(); c.translate(x, y - 180);
    shadow(c, 'rgba(0,0,0,.5)', 26, 10, 16); const g = c.createLinearGradient(0, -180, 0, 180); g.addColorStop(0, cols[0]); g.addColorStop(1, cols[1]); rr(c, -75, -180, 150, 360, 12); fill(c, g); noShadow(c);
    rr(c, -24, -150, 48, 150, 18); fill(c, 'rgba(255,255,255,.22)'); rr(c, -14, -168, 28, 30, 8); fill(c, 'rgba(255,255,255,.35)');
    rr(c, -60, 30, 120, 70, 8); fill(c, 'rgba(255,255,255,.92)'); tx(c, labs[i % 5], 0, 52, { s: 17, w: 800, c: C.ink, max: 108 }); tx(c, '5000 ЗАТЯЖЕК', 0, 80, { f: 'J', s: 13, w: 700, c: '#475569' });
    rr(c, -60, 116, 120, 44, 6); stroke(c, 'rgba(255,255,255,.7)', 3); tx(c, 'ВНИМАНИЕ', 0, 138, { s: 14, w: 800, c: '#fff' });
    if (lit < 1) { c.fillStyle = `rgba(9,13,22,${.55 * (1 - lit)})`; rr(c, -75, -180, 150, 360, 12); c.fill() }
    c.restore();
  }
  function belt(c, t, run) {
    const y = BELT.y; c.fillStyle = '#1e293b'; c.fillRect(-400, y, WW + 800, BELT.h); c.fillStyle = '#334155'; c.fillRect(-400, y, WW + 800, 10);
    c.fillStyle = '#0b1220'; c.fillRect(-400, y + BELT.h, WW + 800, 30);
    for (let i = -1; i < 10; i++) { const x = ((i * 140 + run) % 1400 + 1400) % 1400 - 140, a = run / 28; c.save(); c.translate(x, y + 64); circ(c, 0, 0, 28, '#94a3b8'); c.rotate(a); c.fillStyle = '#475569'; c.fillRect(-26, -4, 52, 8); c.restore() }
  }
  function factoryBg(c, t) {
    c.fillStyle = '#0b1324'; c.fillRect(-400, -400, WW + 800, HH + 800);
    c.fillStyle = 'rgba(30,41,59,.9)'; for (let i = 0; i < 7; i++) c.fillRect(-60 + i * 180, 300, 120, 860);
    c.fillStyle = 'rgba(56,189,248,.06)'; for (let i = 0; i < 6; i++) c.fillRect(30 + i * 180, 340, 60, 760);
  }
  function inside(c, t) {   // мир за дырой — в экранных координатах
    const T0 = K.took, kx = at(t, T0, T0 + .32), hit = T0 + .32, kfall = at(t, hit, hit + .6), kfz = eio(at(t, hit + .55, hit + 1.0)), kc = eo(at(t, K.shen - .3, K.shen + .3));
    c.fillStyle = C.deep; c.fillRect(-400, -400, WW + 800, HH + 800);
    if (kc > 0) { c.save(); c.globalAlpha *= kc; factoryBg(c, t); c.restore() }
    const run = Math.max(0, t - (K.shen + .5)) * 180;
    if (kc > 0) {
      belt(c, t, run);
      for (let j = -2; j <= 2; j++) if (j) { const bx = 540 + j * 210 + run - (run > 0 ? 0 : 0), xx = ((bx + 600) % 1260 + 1260) % 1260 - 600; c.save(); c.globalAlpha *= kc; boxDisp(c, xx, BELT.y, j + 2, .25); c.restore() }
    }
    // табличка JUUL на цепях
    const py = 600 + (kfall > 0 ? 900 * kfall * kfall : 0);
    if (kfall < 1) {
      c.save(); c.strokeStyle = '#64748b'; c.lineWidth = 5; c.setLineDash([10, 6]); c.beginPath(); c.moveTo(380, -50); c.lineTo(380, py - 70); c.moveTo(700, -50); c.lineTo(700, py - 70); c.stroke(); c.restore();
      c.save(); c.translate(540, py); c.rotate(kfall * .5); rr(c, -260, -70, 520, 140, 16); fill(c, '#111827'); rr(c, -260, -70, 520, 140, 16); stroke(c, '#334155', 6);
      tx(c, 'JUUL', -120, 0, { s: 60, w: 800, ls: 6 }); tx(c, 'КАРТРИДЖИ', 90, 0, { s: 34, w: 800, ls: 2, c: '#cbd5e1' }); c.restore();
    }
    // шлейф падения (розово-голубой), застывает и становится первой одноразкой
    if (kfall > 0) {
      const top = 350, bot = lp(600, 1220, eo(kfall)), fz = kfz;
      const W2 = lp(150, 150, fz), x0 = 540 - W2 / 2;
      if (fz < 1) { const g = c.createLinearGradient(x0, 0, x0 + W2, 0); g.addColorStop(0, '#f472b6'); g.addColorStop(.5, '#f9a8d4'); g.addColorStop(.5, '#7dd3fc'); g.addColorStop(1, '#38bdf8'); c.save(); c.globalAlpha *= 1 - fz; rr(c, x0, lp(top, 860, fz), W2, bot - lp(top, 860, fz), 40); fill(c, g); c.restore() }
      if (fz > 0) { const kl = ss(K.shen - .2, K.shen + .3, t); if (kl > 0) { c.save(); c.globalAlpha *= kl; const g = c.createLinearGradient(540, 240, 540, 1240); g.addColorStop(0, 'rgba(255,248,220,0)'); g.addColorStop(1, 'rgba(255,248,220,.35)'); poly(c, [500, 220, 580, 220, 700, 1230, 380, 1230]); c.fillStyle = g; c.fill(); c.restore() }
        c.save(); c.globalAlpha *= fz; boxDisp(c, 540 + run, BELT.y, 0, 1); c.restore();
        const kt = spr(at(t, K.shen, K.shen + .45)); if (kt > 0) { c.save(); c.translate(540 + run, 820); c.scale(kt, kt); rr(c, -170, -34, 340, 68, 34); fill(c, '#0b1324'); rr(c, -170, -34, 340, 68, 34); stroke(c, '#f472b6', 4); glow(c, 0, 0, 200, '#f472b6', .3); tx(c, 'ШЭНЬЧЖЭНЬ · ЭКСПОРТ', 0, 2, { s: 24, w: 800, ls: 2, c: '#fbcfe8' }); c.restore() }
      }
    }
    // объёмный крест сверху с искрами (#005)
    if (kx > 0 && kfall < 1) {
      const y = lp(-200, 520, ei(kx)), r = lp(-.8, .1, kx) + (t > hit ? .3 * eo(kfall) : 0), xo = t > hit ? 260 * eo(kfall) : 0, yo = t > hit ? -200 * eo(kfall) + 900 * kfall * kfall : 0;
      c.save(); c.translate(540 + xo, y + yo); c.rotate(r + Math.PI / 4);
      for (const [dx, dy, col] of [[10, 12, '#1e3a8a'], [0, 0, null]]) { const g = c.createLinearGradient(-120, 0, 120, 0); g.addColorStop(0, '#2563eb'); g.addColorStop(.5, '#60a5fa'); g.addColorStop(1, '#dc2626'); c.fillStyle = col || g; c.fillRect(-120 + dx, -36 + dy, 240, 72); c.fillRect(-36 + dx, -120 + dy, 72, 240) }
      c.restore();
      if (t > hit && t < hit + .5) for (let i = 0; i < 14; i++) { const a = H1(i * 4.4) * TAU, u = (t - hit) / .5, d = 260 * eo(u); circ(c, 540 + Math.cos(a) * d, 560 + Math.sin(a) * d * .6, 6 * (1 - u), '#fde047') }
    }
  }
  function s3(c, t) {
    const T = K.juul - .15, kz = eio(at(t, T, T + .55));
    if (kz <= 0) { s3scroll(c, t); return }
    const base = c.getTransform(), z = Math.pow(1080 * 1.35 / HOLE.w, kz);
    c.save(); c.translate(lp(HOLE.x, CX, kz), lp(HOLE.y, CY, kz)); c.scale(z, z); c.translate(-HOLE.x, -HOLE.y); s3scroll(c, t);
    holePath(c); c.setTransform(base); c.save(); c.clip(); inside(c, t); c.restore(); c.restore();
  }

  // ================= сцена 4 (0:33,6–0:42,9) · #007 лента конвейера → волна с контейнеровозом (#134) → #109 кружки в столбики =================
  const waveY = (x, t, base, A, ph) => base - A * (.62 * Math.sin(x * .0062 - ph) + .38 * Math.sin(x * .0131 + ph * 1.7));
  function shipDraw(c, x, y, r, t) {   // контейнеровоз 340×160 с тремя контейнерами PUFF / HQD / ELF
    c.save(); c.translate(x, y); c.rotate(r);
    poly(c, [-170, -10, 170, -10, 140, 60, -150, 60]); fill(c, '#0f172a'); c.fillStyle = '#ef4444'; c.fillRect(-160, 30, 310, 14);
    rr(c, 96, -86, 52, 76, 6); fill(c, '#e2e8f0'); c.fillStyle = '#0f172a'; c.fillRect(104, -74, 36, 12);
    const L = [['PUFF', '#f472b6', K.puff], ['HQD', '#38bdf8', K.hqd], ['ELF', '#facc15', K.elf]];
    L.forEach(([s, col, tk], i) => { const kx = 1 + .18 * Math.sin(Math.PI * at(t, tk - .05, tk + .35)); c.save(); c.translate(-118 + i * 100, -44); c.scale(kx, kx); rr(c, -47, -32, 95, 65, 5); fill(c, col); c.fillStyle = 'rgba(0,0,0,.18)'; for (let q = -36; q < 40; q += 12) c.fillRect(q, -28, 4, 58); tx(c, s, 0, 2, { s: 26, w: 800, c: '#0b1020' }); c.restore() });
    c.restore();
  }
  function waveScene(c, t) {
    const k = at(t, K.conv + .25, K.puff + .9), ka = eio(k), base = lp(1220, 1010, ka), A = lp(0, 380, ka), ph = t * 2.2;
    const ks = eio(at(t, K.year - .1, K.year + .5));   // выпрямляется в шапку отчёта
    const g = c.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#0b1324'); g.addColorStop(1, '#13203a'); c.fillStyle = g; c.fillRect(-400, -400, WW + 800, HH + 800);
    for (let i = 0; i < 30; i++) circ(c, 1100 * H1(i * 3.1) - 10, 900 * H1(i * 5.7), 2 + 2 * H1(i), 'rgba(255,255,255,.35)');
    const A2 = A * (1 - ks), base2 = lp(base, 320, ks), L = lp(-300, CX - 420, ks), R = lp(WW + 300, CX + 420, ks), bot = lp(2300, 410, ks), red = lp(70, 45, ks);   // шапка 840×90: сверху красная, снизу синяя
    const P = []; for (let x = L; x <= R + .1; x += (R - L) / 90) P.push([x, waveY(x, t, base2, A2, ph)]);
    c.beginPath(); P.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.lineTo(R, bot); c.lineTo(L, bot); c.closePath(); fill(c, C.blue);
    c.save(); c.clip(); c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 4; c.setLineDash([18, 14]); c.lineDashOffset = -t * 60;
    for (let j = 1; j < 6; j++) { c.beginPath(); P.forEach(([x, y], i) => { const yy = y + j * 120 + 18 * Math.sin(x * .01 + j); i ? c.lineTo(x, yy) : c.moveTo(x, yy) }); c.stroke() } c.restore();
    c.beginPath(); P.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); for (let i = P.length - 1; i >= 0; i--) c.lineTo(P[i][0], P[i][1] + red); c.closePath(); fill(c, C.red);
    if (ks <= 0) {   // кораблик по гребню, наклон — по касательной
      const sx = lp(160, 900, eio(at(t, K.puff - .1, K.wave + .4))), sy = waveY(sx, t, base, A, ph), sy2 = waveY(sx + 4, t, base, A, ph), r = Math.atan2(sy2 - sy, 4);
      if (ka > .3) shipDraw(c, sx, sy - 52, r, t);
      if (k < 1) { c.save(); c.globalAlpha *= 1 - ka; belt(c, t, (t - (K.shen + .5)) * 180); c.restore() }   // лента ещё видна, пока не стала волной
    }
  }
  function report(c, t) {   // лист отчёта под шапкой: два кружка тянут столбики
    const ks = eio(at(t, K.year + .2, K.year + .75));
    c.fillStyle = '#0f172a'; c.fillRect(-400, 410, WW + 800, HH);
    if (ks <= 0) return;
    c.save(); c.translate(CX, 410); c.rotate(-.052 * ks); c.scale(1, ks);
    shadow(c, 'rgba(0,0,0,.5)', 40, 10, 20); c.fillStyle = '#ffffff'; c.fillRect(-420, 0, 840, 1020); noShadow(c);
    c.fillStyle = 'rgba(15,23,42,.12)'; for (let i = 0; i < 3; i++) c.fillRect(-360, 40 + i * 26, i === 2 ? 380 : 720, 10);
    c.restore();
    tx(c, 'ОПРОС ШКОЛЬНИКОВ США', CX, 365, { s: 30, w: 800, ls: 2, c: '#fff', a: ss(.6, 1, ks), max: 800 });
    if (ks < 1) return;
    c.save(); c.translate(CX, 410); c.rotate(-.052); c.translate(-CX, -410);
    c.fillStyle = '#0f172a'; c.fillRect(220, 1180, 640, 6);
    const bar = (x, H, col, lab, k, sub) => {
      const h = H * bo(k), cy = 1180 - h;
      if (h > 1) { rr(c, x - 80, cy, 160, h, [12, 12, 0, 0]); fill(c, col) }
      circ(c, x, cy, 48, col); circ(c, x, cy, 40, '#ffffff'); tx(c, sub, x, cy + 2, { s: 26, w: 800, c: col });
      if (k > .6) tx(c, lab, x, cy - 84, { s: 40, w: 800, c: col, a: ss(.6, 1, k) });
    };
    const k19 = at(t, K.teens, K.teens + .45), k20 = at(t, K.grew, K.grew + .6);
    bar(360, 75, C.slate, '2,4%', k19 > 0 ? k19 : 0, '2019'); bar(720, 720, C.red, '', k20, '2020');
    const kc = spr(at(t, K.x11 - .05, K.x11 + .4)); if (kc > 0) { c.save(); c.translate(450, 560); c.scale(kc, kc); rr(c, -200, -44, 400, 88, 18); fill(c, '#0f172a'); tx(c, '26,5%  (РОСТ ×11)', 0, 2, { s: 34, w: 800, c: '#fde047' }); c.restore() }
    c.restore();
  }
  function s4(c, t) { waveScene(c, t); if (t > K.year) report(c, t) }

  // ================= сцена 5 (0:42,9–0:52,8) · #002 капля в бак → #054/#055 пакеты и анализатор → #019 переворот медальона =================
  function tank(c, t) {   // бак одноразки в разрезе 420×680 (Y 520…1200): двухслойная волна манго / лёд, листья мяты
    const x = CX - 210, y = 520, w = 420, h = 680;
    nightBg(c, t, 0);
    shadow(c, 'rgba(0,0,0,.4)', 40, 0, 20); rr(c, x, y, w, h, 60); fill(c, 'rgba(186,230,253,.12)'); noShadow(c);
    c.save(); rr(c, x, y, w, h, 60); c.clip();
    const lev = 760, ph = t * 3.1, wy = (xx, a, p) => a * Math.sin(xx * .022 + p);
    c.beginPath(); c.moveTo(x, lev + wy(x, 18, ph)); for (let xx = x; xx <= x + w; xx += 6) c.lineTo(xx, lev + wy(xx, 18, ph)); c.lineTo(x + w, y + h); c.lineTo(x, y + h); c.closePath(); fill(c, C.mango);
    const l2 = 980; c.beginPath(); c.moveTo(x, l2 + wy(x, 16, -ph)); for (let xx = x; xx <= x + w; xx += 6) c.lineTo(xx, l2 + wy(xx, 16, -ph)); c.lineTo(x + w, y + h); c.lineTo(x, y + h); c.closePath(); fill(c, C.cyan);   // в противофазе (#132)
    for (let i = 0; i < 5; i++) { const cx = x + 70 + i * 70, cy = l2 + 70 + 30 * Math.sin(t * 2 + i) + (i % 2) * 60; c.save(); c.translate(cx, cy); c.rotate(.4 * Math.sin(t + i)); rr(c, -26, -26, 52, 52, 10); fill(c, 'rgba(224,242,254,.85)'); rr(c, -26, -26, 52, 52, 10); stroke(c, '#ffffff', 3); c.restore() }
    c.fillStyle = 'rgba(255,255,255,.3)'; c.fillRect(x + 40, y + 40, 16, h - 80);
    c.restore();
    rr(c, x, y, w, h, 60); stroke(c, 'rgba(255,255,255,.75)', 6);
    tx(c, 'МАНГО', CX, 860, { s: 42, w: 800, ls: 4, c: '#7c2d12', a: .8 }); tx(c, 'ЛЁД', CX, 1090, { s: 42, w: 800, ls: 4, c: '#083344', a: .8 });
    const kl = eo(at(t, K.flav + .9, K.flav + 1.6));   // мята выезжает по дуге
    for (const sd of [-1, 1]) if (kl > 0) { c.save(); c.translate(CX + sd * lp(120, 300, kl), lp(1000, 840, kl)); c.rotate(sd * lp(.2, .9, kl)); leaf(c, 0, 0, 120 * kl, sd); c.restore() }
  }
  function leaf(c, x, y, L, sd = 1) {
    c.save(); c.translate(x, y); c.scale(sd, 1); c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(L * .5, -L * .45, L, 0); c.quadraticCurveTo(L * .5, L * .45, 0, 0); fill(c, C.mint);
    c.strokeStyle = 'rgba(255,255,255,.6)'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(L * .9, 0); for (let i = 1; i < 4; i++) { c.moveTo(L * i * .22, 0); c.lineTo(L * (i * .22 + .12), -L * .14); c.moveTo(L * i * .22, 0); c.lineTo(L * (i * .22 + .12), L * .14) } c.stroke(); c.restore();
  }
  const BAGS = [['МАНГО', '#f59e0b'], ['АРБУЗ', '#f43f5e'], ['ХЛАДАГЕНТ WS-23', '#38bdf8'], ['КОЛА', '#7c2d12'], ['СОЛЬ 50 МГ', '#e2e8f0']];
  const MOLA = [[0, 0, 'C'], [-70, -40, 'C'], [70, -40, 'C'], [0, 80, 'C'], [-140, 0, 'C'], [-70, -120, 'C'], [140, 0, 'C'], [140, 80, 'O'], [210, -40, 'N'], [280, 0, 'C'], [70, 120, 'C'], [-70, 120, 'C']];
  const MOLB = [[0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [2, 6], [6, 7], [6, 8], [8, 9], [3, 10], [3, 11]];
  function bagsScene(c, t) {
    const g = c.createLinearGradient(0, 0, 0, HH); g.addColorStop(0, '#0f172a'); g.addColorStop(1, '#172036'); c.fillStyle = g; c.fillRect(-400, -400, WW + 800, HH + 800);
    c.fillStyle = '#475569'; c.fillRect(-400, 240, WW + 800, 40); c.fillStyle = '#94a3b8'; c.fillRect(-400, 240, WW + 800, 6);
    const sw = Math.exp(-(t - K.liq) * 1.2) * .16;
    BAGS.forEach(([lab, col], i) => {
      const x = CX + (i - 2) * 195, a = Math.sin(t * 3.1 + i * 1.4) * sw * (i === 2 ? .5 : 1);
      c.save(); c.translate(x, 280); c.rotate(a);
      c.strokeStyle = '#cbd5e1'; c.lineWidth = 6; c.beginPath(); c.arc(0, 16, 14, Math.PI, 0); c.stroke(); c.beginPath(); c.moveTo(0, 30); c.lineTo(0, 40); c.stroke();
      rr(c, -77, 40, 155, 230, 28); fill(c, 'rgba(226,232,240,.18)'); c.save(); rr(c, -77, 40, 155, 230, 28); c.clip(); c.fillStyle = rgba(col, i === 2 ? .85 : .7); c.fillRect(-77, 100, 155, 200); c.restore();
      rr(c, -77, 40, 155, 230, 28); stroke(c, 'rgba(255,255,255,.7)', 4); rr(c, -14, 266, 28, 22, 4); fill(c, '#cbd5e1');
      rr(c, -64, 140, 128, 54, 8); fill(c, '#ffffff'); tx(c, lab, 0, 168, { s: i === 2 ? 15 : 20, w: 800, c: '#0f172a', max: 116 });
      if (i === 2) glow(c, 0, 160, 160, '#38bdf8', .35 + .15 * Math.sin(t * 6));
      c.restore();
    });
    // трубка и струйка
    rr(c, CX - 12, 568, 24, 352, 12); fill(c, 'rgba(226,232,240,.2)'); rr(c, CX - 12, 568, 24, 352, 12); stroke(c, 'rgba(255,255,255,.6)', 3);
    const kst = at(t, K.synth - .1, K.synth + .6); if (kst > 0) { const yb = lp(568, 920, eo(kst)); rr(c, CX - 6, 570, 12, yb - 570, 6); fill(c, '#38bdf8'); c.save(); c.setLineDash([10, 18]); c.lineDashOffset = -t * 200; c.strokeStyle = '#e0f2fe'; c.lineWidth = 4; c.beginPath(); c.moveTo(CX, 570); c.lineTo(CX, yb); c.stroke(); c.restore() }
    analyzer(c, t);
  }
  function analyzer(c, t) {   // анализатор 680×420 (Y 920…1340): тумблеры, шкала, красный экран — атомы собираются в молекулу
    const x = CX - 340, y = 920;
    shadow(c, 'rgba(0,0,0,.5)', 30, 0, 16); rr(c, x, y, 680, 420, 28); fill(c, '#1d4ed8'); noShadow(c);
    rr(c, x, y, 680, 40, [28, 28, 0, 0]); fill(c, '#1e40af'); rr(c, CX - 40, y - 20, 80, 30, 8); fill(c, '#94a3b8');
    rr(c, x + 40, y + 70, 440, 300, 18); fill(c, '#991b1b'); rr(c, x + 40, y + 70, 440, 300, 18); stroke(c, '#0b1020', 8);
    for (let i = 0; i < 3; i++) { rr(c, x + 530, y + 90 + i * 90, 100, 50, 25); fill(c, '#0b1020'); circ(c, x + (t > K.ws + i * .2 ? 605 : 555), y + 115 + i * 90, 20, '#e2e8f0') }
    const km = at(t, K.synth + .55, K.ws + .3);
    c.save(); c.translate(x + 240, y + 210); c.scale(.62, .62);
    MOLB.forEach(([a, b], i) => { const kb = ss(i / MOLB.length, i / MOLB.length + .15, km); if (kb <= 0) return; const [x1, y1] = MOLA[a], [x2, y2] = MOLA[b]; c.strokeStyle = '#0b1020'; c.lineWidth = 12; c.beginPath(); c.moveTo(x1, y1); c.lineTo(lp(x1, x2, kb), lp(y1, y2, kb)); c.stroke() });
    MOLA.forEach(([ax, ay, el], i) => { const ka = spr(ss(i / MOLA.length * .8, i / MOLA.length * .8 + .2, km)); if (ka <= 0) return; circ(c, ax, ay, 26 * ka, el === 'O' ? '#fca5a5' : el === 'N' ? '#93c5fd' : '#ffffff'); if (el !== 'C') tx(c, el, ax, ay + 2, { s: 26, w: 800, c: '#0b1020', a: ka }) });
    c.restore();
    tx(c, 'WS-23', x + 260, y + 340, { f: 'J', s: 30, w: 700, ls: 4, c: '#fecaca', a: ss(K.ws - .1, K.ws + .3, t) });
  }
  function medallion(c, t) {   // #019: зелёный медальон «ПРИРОДНАЯ МЯТА» переворачивается на 180° — лист становится ледяной снежинкой WS-23
    const k = eio(at(t, K.ice - .6, K.ice + .15)), R = 240, mx = CX, my = 820;
    c.fillStyle = '#7f1d1d'; c.fillRect(-400, -400, WW + 800, HH + 800);   // экран анализатора (после наезда)
    c.fillStyle = 'rgba(0,0,0,.18)'; for (let y = -400; y < HH + 400; y += 8) c.fillRect(-400, y, WW + 800, 3);
    c.save(); c.translate(mx, my); c.rotate(Math.PI * k);
    shadow(c, 'rgba(0,0,0,.45)', 40, 0, 18); circ(c, 0, 0, R, mixc('#10b981', '#0284c7', k)); noShadow(c);
    circ(c, 0, 0, R - 18, mixc('#059669', '#0369a1', k)); c.strokeStyle = '#ffffff'; c.lineWidth = 8; c.beginPath(); c.arc(0, 0, R - 34, 0, TAU); c.stroke();
    // лист → снежинка: контур сжимается в 6 острых лучей
    c.strokeStyle = '#ffffff'; c.lineWidth = 9; c.lineCap = 'round'; c.lineJoin = 'round';
    const L = 150;
    if (k < .5) { const s = 1 - k * 2 * .4; c.save(); c.scale(s, s); c.beginPath(); c.moveTo(-L, 0); c.quadraticCurveTo(0, -L * .8, L, 0); c.quadraticCurveTo(0, L * .8, -L, 0); c.stroke(); c.beginPath(); c.moveTo(-L, 0); c.lineTo(L * .8, 0); for (let i = -2; i <= 2; i++) if (i) { c.moveTo(i * 40, 0); c.lineTo(i * 40 + 34, -48 * (1 - k)); c.moveTo(i * 40, 0); c.lineTo(i * 40 + 34, 48 * (1 - k)) } c.stroke(); c.restore() }
    else { const s = lp(.6, 1, (k - .5) * 2); for (let i = 0; i < 6; i++) { const a = i * TAU / 6, ex = Math.cos(a) * L * s, ey = Math.sin(a) * L * s; c.beginPath(); c.moveTo(0, 0); c.lineTo(ex, ey); c.moveTo(ex * .55, ey * .55); c.lineTo(ex * .55 + Math.cos(a + .6) * 40 * s, ey * .55 + Math.sin(a + .6) * 40 * s); c.moveTo(ex * .55, ey * .55); c.lineTo(ex * .55 + Math.cos(a - .6) * 40 * s, ey * .55 + Math.sin(a - .6) * 40 * s); c.stroke() } }
    c.restore();
    const ka = 1 - ss(.35, .5, k), kb = ss(.5, .7, k);
    if (ka > 0) tx(c, 'ПРИРОДНАЯ МЯТА', CX, 1130, { s: 40, w: 800, ls: 3, c: '#bbf7d0', a: ka });
    if (kb > 0) { tx(c, 'СИНТЕТИЧЕСКИЙ ЛЁД', CX, 1112, { s: 40, w: 800, ls: 3, c: '#e0f2fe', a: kb }); tx(c, 'WS-23', CX, 1162, { f: 'J', s: 30, w: 700, ls: 6, c: '#7dd3fc', a: kb }) }
    const g1 = ss(K.ice - .1, K.ice + .4, t), g2 = ss(K.tear - .05, K.tear + .4, t);
    gauge(c, 1250, 'ОЩУЩЕНИЕ ХОЛОДА', lp(.15, 1, g1), '#38bdf8', '▲', Math.round(lp(15, 100, g1)));
    gauge(c, 1350, 'СПАЗМ ГОРЛА', lp(.8, 0, g2), '#4ade80', '▼', Math.round(lp(80, 0, g2)));
  }
  function gauge(c, y, lab, v, col, ar, n) {
    rr(c, 150, y - 34, 780, 68, 34); fill(c, 'rgba(11,16,32,.75)'); rr(c, 160, y - 24, 760 * Math.max(.02, v), 48, 24); fill(c, col);
    tx(c, `${lab}: ${n}% ${ar}`, CX, y + 2, { s: 28, w: 800, c: '#ffffff', st: 'rgba(0,0,0,.35)', sw: 6, max: 720 });
  }
  function s5(c, t) {
    const pA = eio(at(t, K.flav + .05, K.flav + .7)), pB = eio(at(t, K.liq - .05, K.liq + .55)), zM = eio(at(t, K.fool - .4, K.fool + .15));
    if (pB <= 0) {   // отчёт уходит вверх — бак приходит сверху; капля падает в бак
      c.save(); c.translate(0, -HH * pA); s4(c, t); c.restore();
      c.save(); c.translate(0, HH * (1 - pA)); tank(c, t); c.restore();
      const kd = at(t, K.flav, K.flav + 1.0); if (kd > 0 && kd < 1) { const x = lp(720, CX, eo(at(t, K.flav, K.flav + .4))), y = lp(460 - HH * pA, 740, ei(kd)); circ(c, x, y, 26, C.red); circ(c, x - 8, y - 8, 7, 'rgba(255,255,255,.6)') }
      const ks = at(t, K.flav + 1.0, K.flav + 1.5); if (ks > 0 && ks < 1) { c.save(); c.globalAlpha = 1 - ks; c.strokeStyle = '#ffffff'; c.lineWidth = 6; c.beginPath(); c.ellipse(CX, 750, 40 + 160 * ks, 10 + 30 * ks, 0, 0, TAU); c.stroke(); c.restore() }
      return;
    }
    if (zM <= 0) { c.save(); c.translate(0, HH * pB); tank(c, t); c.restore(); c.save(); c.translate(0, -HH * (1 - pB)); bagsScene(c, t); c.restore(); return }
    // наезд в экран анализатора: экран растёт до кадра, на нём медальон
    const sx = CX - 340 + 40 + 220, sy = 920 + 70 + 150, z = Math.pow(4.6, zM);
    c.save(); c.translate(lp(sx, CX, zM), lp(sy, CY, zM)); c.scale(z, z); c.translate(-sx, -sy); bagsScene(c, t); c.restore();
    if (zM > .6) { c.save(); const base = c.getTransform(); const sc = z / 4.6, w = 440 * z, h = 300 * z; c.beginPath(); c.rect(lp(sx, CX, zM) - w / 2, lp(sy, CY, zM) - h / 2, w, h); c.clip(); c.setTransform(base); medallion(c, t); c.restore() }
  }

  // ================= сцена 6 (0:52,8–1:03,3) · #067 чертежи + краны на цепях → #003 поворот торцом, 16 картриджей =================
  function bpGrid(c) {
    c.fillStyle = C.blueD; c.fillRect(-400, -400, WW + 800, HH + 800);
    c.strokeStyle = 'rgba(255,255,255,.12)'; c.lineWidth = 2; c.beginPath(); for (let x = -40; x <= WW + 40; x += 40) { c.moveTo(x, -400); c.lineTo(x, HH + 400) } for (let y = -40; y <= HH + 40; y += 40) { c.moveTo(-400, y); c.lineTo(WW + 400, y) } c.stroke();
    c.strokeStyle = 'rgba(255,255,255,.22)'; c.lineWidth = 3; c.beginPath(); for (let x = -40; x <= WW + 40; x += 200) { c.moveTo(x, -400); c.lineTo(x, HH + 400) } for (let y = -40; y <= HH + 40; y += 200) { c.moveTo(-400, y); c.lineTo(WW + 400, y) } c.stroke();
  }
  function bpPod(c, x, y, s) {   // картридж Juul линией + пачка: «1 картридж = 1 пачка»
    c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = '#ffffff'; c.lineWidth = 5;
    rr(c, -230, -110, 90, 220, 14); c.stroke(); rr(c, -215, -150, 60, 44, 10); c.stroke(); c.fillStyle = rgba('#fb923c', .8); c.fillRect(-222, -40, 74, 140);
    tx(c, '=', 0, 0, { s: 90, w: 800 });
    rr(c, 130, -110, 160, 220, 8); c.stroke(); c.beginPath(); c.moveTo(130, -40); c.lineTo(290, -40); c.stroke(); for (let i = 0; i < 5; i++) { rr(c, 146 + i * 28, -150, 20, 44, 4); c.stroke() }
    c.restore();
    tx(c, '1 КАРТРИДЖ = 1 ПАЧКА', x, y + 190 * s, { s: 36, w: 800, ls: 2, c: '#e0f2fe' });
  }
  const SHEETS = ['БАК: 13 МЛ (В 18 РАЗ БОЛЬШЕ JUUL)', '2 СЕТКИ НАГРЕВА', 'АККУМУЛЯТОР 650 мА·ч'];
  function sheetDraw(c, i, t) {   // лист 760×680, центр (0, 0): разрез огромной одноразки и подпись
    shadow(c, 'rgba(0,0,0,.4)', 30, 10, 16); c.fillStyle = '#f8fafc'; c.fillRect(-380, -340, 760, 680); noShadow(c);
    c.strokeStyle = 'rgba(29,78,216,.15)'; c.lineWidth = 2; c.beginPath(); for (let x = -360; x <= 360; x += 30) { c.moveTo(x, -320); c.lineTo(x, 320) } for (let y = -320; y <= 320; y += 30) { c.moveTo(-360, y); c.lineTo(360, y) } c.stroke();
    c.strokeStyle = '#1d4ed8'; c.lineWidth = 5; rr(c, -110, -260, 220, 470, 44); c.stroke(); rr(c, -50, -300, 100, 50, 16); c.stroke();
    if (i === 0) { c.fillStyle = 'rgba(56,189,248,.35)'; rr(c, -96, -200, 192, 250, 30); c.fill(); c.strokeStyle = '#1d4ed8'; rr(c, -96, -200, 192, 250, 30); c.stroke(); tx(c, '13 МЛ', 0, -80, { s: 48, w: 800, c: '#1d4ed8' }) }
    if (i === 1) { for (const dx of [-44, 44]) { c.save(); c.translate(dx, -40); c.strokeStyle = '#1d4ed8'; c.lineWidth = 3; rr(c, -34, -110, 68, 220, 10); c.stroke(); c.beginPath(); for (let q = -100; q <= 100; q += 14) { c.moveTo(-30, q); c.lineTo(30, q + 12) } for (let q = -100; q <= 100; q += 14) { c.moveTo(30, q); c.lineTo(-30, q + 12) } c.stroke(); c.restore() } }
    if (i === 2) { rr(c, -80, -40, 160, 220, 16); c.fillStyle = 'rgba(74,222,128,.3)'; c.fill(); c.strokeStyle = '#1d4ed8'; rr(c, -80, -40, 160, 220, 16); c.stroke(); rr(c, -24, -60, 48, 22, 6); c.stroke(); tx(c, '+', 0, 30, { s: 60, w: 800, c: '#1d4ed8' }); tx(c, '650', 0, 110, { s: 40, w: 800, c: '#1d4ed8' }) }
    c.strokeStyle = '#1d4ed8'; c.lineWidth = 3; c.beginPath(); c.moveTo(120, -120); c.lineTo(200, -180); c.lineTo(330, -180); c.stroke();
    tx(c, SHEETS[i], 0, 270, { s: 30, w: 800, c: '#1e3a8a', max: 700 });
  }
  function hoists(c, t) {   // жёлто-чёрная балка (Y 240…580) и 3 лебёдки с паллетами одноразок
    c.save(); c.beginPath(); c.rect(-400, 230, WW + 800, 30); c.clip(); for (let i = -20; i < 40; i++) { c.fillStyle = i % 2 ? '#facc15' : '#111827'; poly(c, [i * 60, 230, i * 60 + 60, 230, i * 60 + 30, 260, i * 60 - 30, 260]); c.fill() } c.restore();
    for (let j = 0; j < 3; j++) {
      const x = ((t - K.grow2) * 150 + j * 420) % 1260 - 90;
      c.fillStyle = '#334155'; c.fillRect(x - 30, 260, 60, 30); c.save(); c.strokeStyle = '#94a3b8'; c.lineWidth = 4; c.setLineDash([10, 6]); c.beginPath(); c.moveTo(x - 20, 290); c.lineTo(x - 70, 400); c.moveTo(x + 20, 290); c.lineTo(x + 70, 400); c.stroke(); c.restore();
      rr(c, x - 130, 400, 260, 150, 10); fill(c, '#1d4ed8'); for (let q = 0; q < 6; q++) { rr(c, x - 112 + q * 38, 418, 28, 70, 8); fill(c, BOXC[(q + j) % 8]) }
      tx(c, '5000 ЗАТЯЖЕК', x, 524, { s: 22, w: 800, ls: 1, c: '#ffffff' });
    }
  }
  function s6(c, t) {
    const kx = eio(at(t, K.rem - .2, K.rem + .45)), R = lp(240, 1300, kx);
    // синий круг снежинки раскрывается в миллиметровку
    c.fillStyle = '#7f1d1d'; c.fillRect(-400, -400, WW + 800, HH + 800);
    c.save(); c.beginPath(); c.arc(CX, 820, R, 0, TAU); c.clip(); bpGrid(c);
    const kp = 1 - eio(at(t, K.grow2 - .3, K.grow2 + .2));
    if (kp > 0) { c.save(); c.translate(-900 * (1 - kp), 0); bpPod(c, CX, 800, 1.2 * spr(at(t, K.rem + .1, K.rem + .6))); c.restore() }
    const kb = eo(at(t, K.grow2 - .1, K.grow2 + .5)), kt = eio(at(t, K.nic - .15, K.nic + .45));
    if (kb > 0 && kt < 1) {
      c.save(); c.translate(0, -400 * kt); c.translate((1 - kb) * -1200, 0); hoists(c, t); c.restore();
      const f1 = eio(at(t, K.mesh - .2, K.mesh + .25)), f2 = eio(at(t, K.puffs - .2, K.puffs + .25)), fl = [f1, f2, 0];
      for (let i = 2; i >= 0; i--) {
        const f = fl[i]; if (f >= 1) continue;
        c.save(); c.translate(CX + (2 - i) * 10 * (1 - kt), 1000 + i * 8 + (1 - kb) * 1200); const sx = lp(1, .29, kt), sy = lp(1, .76, kt); c.scale(sx, sy);
        if (f > 0) { c.translate(-380, 0); c.scale(Math.cos(f * Math.PI / 2), 1); c.transform(1, f * .2, 0, 1, 0, 0); c.translate(380, 0) }   // лист перелистывается справа налево вокруг левого края
        sheetDraw(c, i, t); c.restore();
      }
    }
    c.restore();
    if (kt > 0) turn(c, t, kt);
  }
  function turn(c, t, kt) {   // #003: корпус поворачивается торцом к зрителю, точечная тень вправо-вниз, 16 картриджей по орбите
    const ka = eio(at(t, K.nic + .35, K.nic + .95)), x = CX, y = 860, w = 220, h = 520 * (1 - ka), r = lp(110, 230, ka), ry = lp(22, 230, ka);
    if (ka > .05) {   // полутоновая тень (#003)
      c.save(); c.globalAlpha *= ss(.05, .6, ka); c.fillStyle = 'rgba(8,14,40,.55)';
      for (let i = 0; i < 26; i++) for (let j = 0; j < 7; j++) { const u = i / 26, d = (j - 3) / 3, px = x + Math.cos(.61) * u * 700 - Math.sin(.61) * d * r, py = y + 60 + Math.sin(.61) * u * 700 + Math.cos(.61) * d * r; circ(c, px, py, 9 * (1 - u) * (1 - Math.abs(d) * .4), 'rgba(8,14,40,.55)') }
      c.restore();
    }
    c.save(); c.globalAlpha *= ss(0, .25, kt);
    shadow(c, 'rgba(0,0,0,.4)', 30, 0, 14);
    const g = c.createLinearGradient(x - r, 0, x + r, 0); g.addColorStop(0, '#0e7490'); g.addColorStop(.35, C.cyan); g.addColorStop(.7, C.mango); g.addColorStop(1, '#b45309');
    c.beginPath(); c.ellipse(x, y + h / 2, r, ry, 0, 0, Math.PI); c.lineTo(x - r, y - h / 2); c.ellipse(x, y - h / 2, r, ry, 0, Math.PI, 0, true); c.closePath(); fill(c, g); noShadow(c);
    c.beginPath(); c.ellipse(x, y - h / 2, r, ry, 0, 0, TAU); fill(c, '#1f2937');   // торец: двойная сетка
    c.save(); c.beginPath(); c.ellipse(x, y - h / 2, r * .86, ry * .86, 0, 0, TAU); c.clip(); c.strokeStyle = 'rgba(148,163,184,.55)'; c.lineWidth = 3; c.beginPath(); for (let q = -r; q <= r; q += 18) { c.moveTo(x + q, y - h / 2 - ry); c.lineTo(x + q + ry * .4, y - h / 2 + ry) } c.stroke(); c.restore();
    c.restore();
    const kc = at(t, K.n16 - .1, K.n16 + .7);
    for (let i = 0; i < 16; i++) {
      const k = spr(at(kc, i / 16 * .8, i / 16 * .8 + .2)); if (k <= 0) continue;
      const a = -Math.PI / 2 + i * TAU / 16, px = x + Math.cos(a) * 310, py = y - h / 2 + Math.sin(a) * 310 * (ry / r);
      c.save(); c.translate(px, py); c.rotate(a + Math.PI / 2); c.scale(k, k); rr(c, -18, -36, 36, 72, 8); fill(c, '#fb923c'); rr(c, -12, -46, 24, 16, 5); fill(c, '#111827'); c.restore();
    }
    const kn = spr(at(t, K.n16 + .4, K.n16 + .8)); if (kn > 0 && ka > .8) { c.save(); c.translate(x, y - h / 2); c.scale(kn, kn); tx(c, '1 ОДНОРАЗКА', 0, -46, { s: 34, w: 800, c: '#ffffff' }); tx(c, '=', 0, 0, { s: 40, w: 800, c: '#fde047' }); tx(c, '16 КАРТРИДЖЕЙ JUUL', 0, 48, { s: 30, w: 800, c: '#fde047', max: 380 }); c.restore() }
  }

  // ================= сцена 7 (1:03,3–1:16,1) · #009 холм → колба-лампочка, #010 капля по змеевику, #012 + #138 касса и чек =================
  const BULB = { x: 540, y: 420, r: 85 };
  function tobaccoBush(c, x, y0, yTop, k, kf, seed) {   // стебель + изумрудные листья + красный бутон; kf — листья опадают
    const yy = lp(y0, yTop, eo(k)); if (k <= 0) return;
    c.strokeStyle = '#166534'; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y0); c.quadraticCurveTo(x + 18 * Math.sin(seed), (y0 + yy) / 2, x, yy); c.stroke();
    for (let i = 0; i < 4; i++) {
      const u = .3 + i * .17, ly = lp(y0, yy, u), sd = i % 2 ? 1 : -1, lk = ss(u * .8, u * .8 + .25, k); if (lk <= 0) continue;
      const fall = kf > 0 ? eo(at(kf, i * .12, i * .12 + .6)) : 0;
      c.save(); c.translate(x + sd * 6 + sd * 60 * fall, ly + 700 * fall * fall); c.rotate(sd * (.5 + 1.6 * fall)); c.globalAlpha *= 1 - ss(.6, 1, fall);
      c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(sd * 70 * lk, -60 * lk, sd * 150 * lk, 0); c.quadraticCurveTo(sd * 70 * lk, 50 * lk, 0, 0); fill(c, i % 2 ? '#10b981' : '#059669');
      c.strokeStyle = 'rgba(255,255,255,.4)'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 0); c.lineTo(sd * 130 * lk, 0); c.stroke(); c.restore();
    }
    return yy;
  }
  function bulbDraw(c, x, y, r, k, t) {   // стеклянная колба-лампочка с золотым свечением, снизу — носик
    if (k <= 0) return;
    glow(c, x, y, r * 3.2, '#fbbf24', .55 * k * (.85 + .15 * Math.sin(t * 8)));
    c.save(); c.translate(x, y); c.scale(lp(.4, 1, spr(k)), lp(.4, 1, spr(k)));
    c.beginPath(); c.arc(0, 0, r, 0, TAU); fill(c, 'rgba(254,243,199,.35)'); c.beginPath(); c.arc(0, 0, r, 0, TAU); stroke(c, '#ffffff', 6);
    circ(c, 0, 10, r * .45, rgba('#fbbf24', .9)); circ(c, -r * .35, -r * .35, r * .18, 'rgba(255,255,255,.8)');
    rr(c, -18, r - 6, 36, 40, 6); fill(c, 'rgba(255,255,255,.8)'); rr(c, -8, r + 30, 16, 26, 4); fill(c, 'rgba(255,255,255,.6)');
    c.restore();
  }
  function hillScene(c, t, kin, under) {   // торец опускается и становится белым холмом; кусты табака; на «без единого листа табака» листья опадают, бутон → лампочка
    if (!under) nightBg(c, t, 0);
    const hy = lp(860, 1280, eio(kin)), R = lp(230, 420, eio(kin));
    c.beginPath(); c.arc(CX, hy + R * .1, R, Math.PI, 0); c.lineTo(CX + R, HH + 400); c.lineTo(CX - R, HH + 400); c.closePath(); fill(c, mixc('#1f2937', '#f1f5f9', eio(kin)));
    if (kin < 1) for (let i = 0; i < 16; i++) {   // 16 картриджей разлетаются за кадр, торец опускается
      const a = -Math.PI / 2 + i * TAU / 16, d = lp(310, 1500, eo(kin)), px = CX + Math.cos(a) * d, py = 860 + Math.sin(a) * d;
      c.save(); c.translate(px, py); c.rotate(a + Math.PI / 2 + kin * 3); rr(c, -18, -36, 36, 72, 8); fill(c, '#fb923c'); rr(c, -12, -46, 24, 16, 5); fill(c, '#111827'); c.restore();
    }
    const kg = at(t, K.bypass + .4, K.bypass + 1.6), kf = at(t, K.noleaf, K.noleaf + 1.0);
    const tops = [[400, 640, 1.3], [540, BULB.y + 60, 0], [680, 660, 2.1]].map(([x, yT, sd], i) => tobaccoBush(c, x, hy - R * .9 + Math.abs(x - CX) * .5, yT, at(kg, i * .12, i * .12 + .8), kf, sd));
    const kb = ss(K.noleaf + .1, K.noleaf + .45, t);
    [[400, tops[0]], [680, tops[2]]].forEach(([x, y]) => { if (y) { c.save(); c.globalAlpha *= 1 - kf; circ(c, x, y - 14, 22 * ss(.6, 1, kg), '#dc2626'); c.restore() } });
    if (tops[1] && !under) { if (kb < 1) circ(c, CX, BULB.y + 40, 30 * ss(.7, 1, kg) * (1 - kb), '#dc2626'); bulbDraw(c, BULB.x, BULB.y, BULB.r, kb, t) }
    const kp = spr(at(t, K.tabak - .2, K.tabak + .3)) * (under ? 0 : 1); if (kp > 0) { c.save(); c.translate(CX, 240); c.scale(kp, kp); rr(c, -360, -40, 720, 80, 20); fill(c, '#0b1324'); rr(c, -360, -40, 720, 80, 20); stroke(c, '#fbbf24', 4); tx(c, 'СИНТЕТИЧЕСКИЙ НИКОТИН · БЕЗ ТАБАКА', 0, 2, { s: 28, w: 800, c: '#fde68a', max: 680 }); c.restore() }
  }
  const COIL = { x: 540, r: 160, y0: 520, y1: 1180, n: 5 };
  const helix = u => { const a = u * TAU * COIL.n; return [COIL.x + COIL.r * Math.sin(a), lp(COIL.y0, COIL.y1, u) + 18 * Math.cos(a), Math.cos(a)] };
  function coilScene(c, t, kc) {   // стеклянный змеевик 5 витков под колбой, спиртовка; золотая капля бежит по всем виткам
    nightBg(c, t, 0);
    bulbDraw(c, BULB.x, BULB.y, BULB.r, 1, t);
    const kd = at(t, K.sales - .2, K.sales + .3), N = 200, P = []; for (let i = 0; i <= N; i++) P.push(helix(i / N));
    const draw = (front) => { for (let i = 0; i < N; i++) { const [x1, y1, z1] = P[i], [x2, y2] = P[i + 1]; if ((z1 > 0) !== front || i / N > eo(kd)) continue; c.strokeStyle = front ? 'rgba(255,255,255,.95)' : 'rgba(255,255,255,.35)'; c.lineWidth = 28; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); c.strokeStyle = front ? 'rgba(186,230,253,.35)' : 'rgba(30,41,59,.9)'; c.lineWidth = 16; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke() } };
    c.lineCap = 'round'; c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 28; c.beginPath(); c.moveTo(CX, BULB.y + BULB.r + 50); c.lineTo(P[0][0], P[0][1]); c.stroke();
    draw(false);
    // капля и её светящийся след
    const ku = at(t, K.sales + .25, K.ten - .15), iu = Math.floor(ku * N);
    if (ku > 0 && ku < 1) { for (let j = Math.max(0, iu - 24); j < iu; j++) { const [x1, y1, z1] = P[j], [x2, y2] = P[j + 1]; c.strokeStyle = rgba('#fbbf24', .25 + .6 * (j - iu + 24) / 24); c.lineWidth = 12; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke() }
      const [dx, dy] = helix(ku); glow(c, dx, dy, 70, '#fbbf24', .7); circ(c, dx, dy, 16, '#fbbf24'); circ(c, dx - 5, dy - 5, 5, '#fff7d6') }
    draw(true);
    // спиртовка
    rr(c, CX - 90, 1250, 180, 110, 24); fill(c, 'rgba(186,230,253,.25)'); rr(c, CX - 90, 1250, 180, 110, 24); stroke(c, '#e0f2fe', 4); rr(c, CX - 18, 1222, 36, 30, 6); fill(c, '#94a3b8');
    const fl = .9 + .1 * Math.sin(t * 17); c.save(); c.translate(CX, 1222); c.scale(fl, 1 / fl); c.beginPath(); c.moveTo(0, -90); c.quadraticCurveTo(34, -30, 0, 0); c.quadraticCurveTo(-34, -30, 0, -90); fill(c, '#60a5fa'); c.beginPath(); c.moveTo(0, -56); c.quadraticCurveTo(16, -20, 0, 0); c.quadraticCurveTo(-16, -20, 0, -56); fill(c, '#e0f2fe'); c.restore();
  }
  const REG = { x: 540, y: 980, w: 580, h: 480 };   // касса: центр (540, 980), табло — у верхней кромки (Y ≈ 760)
  function register(c, t) {
    const { x, y, w, h } = REG, top = y - h / 2;
    shadow(c, 'rgba(0,0,0,.5)', 40, 0, 22);
    poly(c, [x - w / 2, y + h / 2, x + w / 2, y + h / 2, x + w / 2 - 30, top + 120, x - w / 2 + 30, top + 120]); fill(c, '#0e7490'); noShadow(c);
    rr(c, x - w / 2 + 40, top, w - 80, 140, [24, 24, 6, 6]); fill(c, '#155e75');
    rr(c, x - 220, top + 22, 440, 96, 14); fill(c, '#0b1020');
    const kn = at(t, K.ten - .05, K.bil + .55), v = Math.round(3.2e9 * eo(kn) / 1e6) * 1e6, s = '$' + String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    if (kn > 0) { glow(c, x, top + 70, 300, '#f97316', .35 * ss(0, .3, kn)); tx(c, s, x, top + 72, { f: 'J', s: 50, w: 700, c: '#fb923c', st: rgba('#f97316', .35), sw: 8, max: 410 }); tx(c, 'ОДНОРАЗКИ · США · ЗА ГОД', x, top + 138, { s: 20, w: 800, ls: 2, c: '#a5f3fc', a: ss(.6, 1, kn) }) }
    c.fillStyle = 'rgba(255,255,255,.06)'; for (let r = 0; r < 4; r++) for (let q = 0; q < 6; q++) { rr(c, x - 220 + q * 76, top + 190 + r * 56, 60, 40, 8); c.fill() }
    for (let r = 0; r < 4; r++) for (let q = 0; q < 6; q++) { rr(c, x - 220 + q * 76, top + 184 + r * 56, 60, 40, 8); fill(c, r === 3 && q > 3 ? '#f59e0b' : '#e2e8f0') }
    rr(c, x - w / 2 + 10, y + h / 2 - 60, w - 20, 60, 8); fill(c, '#164e63'); rr(c, x - 50, y + h / 2 - 40, 100, 14, 7); fill(c, '#0b1020');
    rr(c, x - 150, top - 18, 300, 22, 6); fill(c, '#0b1020');   // щель для чека
  }
  function receipt(c, t) {   // длинная лента чека S-волной вверх (#138), строки печатаются
    const k = at(t, K.bil + .6, K.corp + .2), L = lp(0, 820, eo(k)); if (L <= 0) return;
    const top = REG.y - REG.h / 2 - 8, N = 40;
    const P = []; for (let i = 0; i <= N; i++) { const u = i / N, yy = top - u * L; P.push([REG.x + 34 * Math.sin(u * 5 + t * 2) * u, yy]) }
    c.save(); shadow(c, 'rgba(0,0,0,.35)', 18, 6, 8); c.beginPath(); P.forEach(([px, py], i) => i ? c.lineTo(px - 130, py) : c.moveTo(px - 130, py)); for (let i = N; i >= 0; i--) c.lineTo(P[i][0] + 130, P[i][1]); c.closePath(); fill(c, '#fbfaf6'); noShadow(c); c.restore();
    const lines = [['• VUSE GO — BAT', K.corp], ['• NJOY — ALTRIA («МАЛЬБОРО»)', K.old], ['• РЫНОК ОДНОРАЗОК', K.corpE - .2]];
    lines.forEach(([s, tk], i) => { const yy = top - 90 - i * 90, ka = ss(tk - .1, tk + .2, t); if (top - yy > L - 30 || ka <= 0) return; const u = (top - yy) / Math.max(1, L), px = REG.x + 34 * Math.sin(u * 5 + t * 2) * u; tx(c, s, px, yy, { f: 'J', s: 26, w: 700, c: '#0f172a', a: ka, max: 240 }) });
  }
  function regScene(c, t) {
    nightBg(c, t, 0);
    register(c, t); receipt(c, t);
    const kc = ss(K.ten - .3, K.ten, t); if (kc > 0) { c.save(); c.globalAlpha *= kc; circ(c, REG.x + 230, REG.y - REG.h / 2 + 70, 26, '#fbbf24'); tx(c, '$', REG.x + 230, REG.y - REG.h / 2 + 72, { s: 30, w: 800, c: '#7c2d12' }); c.restore() }   // капля → золотая монета-кнопка
  }
  function s7(c, t) {
    const kin = at(t, K.bypass - .5, K.bypass + .3), kcoil = eio(at(t, K.sales - .35, K.sales + .2)), kreg = eio(at(t, K.ten - .7, K.ten - .15));
    if (kcoil <= 0) { hillScene(c, t, kin); return }
    if (kreg <= 0) {   // холм уходит вниз, змеевик — на месте холма
      coilScene(c, t, 1); c.save(); c.translate(0, 1400 * kcoil); hillScene(c, t, 1, true); c.restore(); return   // колба на месте, холм уходит вниз, змеевик растёт из носика
    }
    // змеевик уходит вверх, касса приходит снизу; капля падает с кончика змеевика на кассу
    c.save(); c.translate(0, -1500 * kreg); coilScene(c, t, 1); c.restore();
    const kz = eio(at(t, K.corpE - .9, K.corpE + .5)), ty = REG.y - REG.h / 2 + 70;   // голландский наклон, наезд в табло
    c.save(); c.translate(0, 1500 * (1 - kreg)); if (kz > 0) { const z = Math.pow(3.2, kz); c.translate(lp(REG.x, CX, kz), lp(ty, CY, kz)); c.rotate(-.1 * kz); c.scale(z, z); c.translate(-REG.x, -ty) } regScene(c, t); c.restore();
    const kd = at(t, K.ten - .55, K.ten - .3); if (kd > 0 && kd < 1) { const y = lp(1180 - 1500 * kreg, REG.y - REG.h / 2 + 70, ei(kd)); circ(c, REG.x + 230 * kd, y, 16, '#fbbf24') }
  }

  // ================= сцена 8 (1:16,1–1:22,7) · #076 «0» табло → Луна; общежитие в косом разрезе =================
  function dormScene(c, t) {
    c.fillStyle = '#0b1020'; c.fillRect(-400, -400, WW + 800, HH + 800);   // тёмное табло стало ночным небом
    const km = eio(at(t, K.ban - .1, K.ban + .7)), mx = lp(CX + 120, 230, km), my = lp(CY, 340, km), mr = lp(40, 95, km);
    for (let i = 0; i < 40; i++) circ(c, 1100 * H1(i * 2.3) - 10, 1300 * H1(i * 4.9), 1.5 + 2 * H1(i), `rgba(255,255,255,${.3 * km})`);
    glow(c, mx, my, mr * 3.4, '#f8fafc', .25 * km); circ(c, mx, my, mr, '#f8fafc'); circ(c, mx + mr * .3, my - mr * .2, mr * .18, 'rgba(203,213,225,.7)');
    // город
    const kc = eo(at(t, K.ban + .2, K.ban + .9)); c.save(); c.translate(0, (1 - kc) * 500); c.fillStyle = '#131c33'; for (let i = 0; i < 12; i++) { const bx = -100 + i * 100, bh = 260 + 300 * H1(i * 3.3); c.fillRect(bx, 1420 - bh, 88, bh) } c.fillStyle = '#0a0f1e'; c.fillRect(-400, 1400, WW + 800, 700); c.restore();
    // общежитие в косом разрезе (#076): выезжает справа
    const kb = eo(at(t, K.ban + .4, K.ban + 1.3)), bx = lp(1100 + 320, 620, kb), L = bx - 320, R = bx + 320, T = 360, B = 1400, fh = (B - T) / 4;
    c.save(); shadow(c, 'rgba(0,0,0,.6)', 40, -10, 20); rr(c, L, T, 640, B - T, 6); fill(c, '#1e293b'); noShadow(c);
    c.beginPath(); c.moveTo(L + 30, T + fh); c.lineTo(R - 30, T + fh); c.lineTo(R - 30, B - 30); c.lineTo(L + 30, B - 30); c.closePath(); c.clip();
    for (let f = 1; f < 4; f++) {
      const y0 = T + f * fh; c.fillStyle = f % 2 ? '#fde68a' : '#fcd34d'; c.fillRect(L, y0, 640, fh - 18); c.fillStyle = '#7c5a10'; c.fillRect(L, y0 + fh - 18, 640, 18);
      c.strokeStyle = 'rgba(124,90,16,.6)'; c.lineWidth = 10; c.beginPath(); c.moveTo(L + 60, y0 + fh - 20); c.lineTo(L + 170, y0 + 20); c.stroke();   // лестница
      for (let rm = 0; rm < 2; rm++) {
        const sx = L + 260 + rm * 200, sy = y0 + fh - 18;
        c.fillStyle = '#7c4a1c'; c.fillRect(sx - 10, sy - 70, 120, 12); c.fillRect(sx + 90, sy - 70, 10, 70);   // стол
        c.fillStyle = '#0b1020'; c.beginPath(); c.ellipse(sx - 8, sy - 132, 26, 30, 0, 0, TAU); c.fill(); rr(c, sx - 36, sy - 104, 56, 86, 18); c.fill(); c.fillRect(sx - 30, sy - 26, 70, 14);   // силуэт в профиль, без лица
        const ph = (t * 1.3 + f * .4 + rm * .7) % 1, on = t > K.icepar - .2 ? 1 : .35 + .25 * Math.sin(t * 5 + f + rm);
        circ(c, sx + 26, sy - 92, 7, rgba('#38bdf8', on)); glow(c, sx + 26, sy - 92, 40, '#38bdf8', .5 * on);
        if (t > K.icepar - .2) for (let q = 0; q < 3; q++) { const u = (ph + q / 3) % 1; c.save(); c.globalAlpha = (1 - u) * .7; circ(c, sx + 36 + u * 60, sy - 110 - u * 70, 10 + 26 * u, '#e0f2fe'); c.restore() }   // облачка ледяного пара
      }
      c.save(); c.globalAlpha = .55; frostStar(c, R - 70, y0 + 40, 26, f, .9); frostStar(c, R - 50, y0 + fh - 60, 18, f + 2, .8); c.restore();
    }
    c.restore();
    c.fillStyle = '#334155'; poly(c, [L, T, R, T, R, T + fh * 1.1, L, T + fh * .2]); c.fill();   // срез фасада по диагонали
    poly(c, [L, T + fh * .2, L + 30, T + fh * .2, L + 30, B - 30, L, B]); c.fill(); c.fillStyle = '#273449'; poly(c, [R - 30, T + fh * 1.1, R, T + fh * 1.1, R, B, R - 30, B]); c.fill();
    c.strokeStyle = '#0b1020'; c.lineWidth = 6; c.beginPath(); c.moveTo(L, T + fh * .2); c.lineTo(R, T + fh * 1.1); c.stroke();
    for (let q = 0; q < 4; q++) { rr(c, L + 60 + q * 140, T + 40, 90, 70, 6); fill(c, 'rgba(147,197,253,.25)'); frostStar(c, L + 105 + q * 140, T + 75, 20, q, .6) }
  }
  function s8(c, t) {   // наезд в табло продолжается: ноль поднимается Луной
    const kx = eio(at(t, K.ban - .25, K.ban + .25));
    if (kx < 1) { const ty = REG.y - REG.h / 2 + 70, z = Math.pow(3.2, 1 + .6 * kx); c.save(); c.translate(CX, CY); c.rotate(-.1 * (1 - kx)); c.scale(z, z); c.translate(-REG.x, -ty); regScene(c, t); c.restore();
      const w = lp(440 * 3.2, 1400, kx), h = lp(96 * 3.2, 2100, kx); c.save(); c.beginPath(); c.rect(CX - w / 2, CY - h / 2, w, h); c.clip(); dormScene(c, t); c.restore(); return }
    dormScene(c, t);
  }

  // ================= доска расследования (1:22,7–конец): 5 одинаковых карточек-полароидов, нити от булавки к булавке =================
  const BC = [
    { x: 355, y: 430, r: -.03, yr: '1979', cap: 'СОЛЬ' }, { x: 725, y: 430, r: .025, yr: '2020', cap: 'ЛАЗЕЙКА ОДНОРАЗОК' },
    { x: 540, y: 880, r: -.02, yr: '1924', cap: '«МАЛЬБОРО»' }, { x: 200, y: 880, r: .03, yr: '2014', cap: 'НАГРЕВАТЕЛИ' }, { x: 880, y: 880, r: -.025, yr: '2022', cap: 'ШАЙБЫ' },
  ];
  const PH = { x: -115, y: -150, w: 230, h: 230 };   // фото в карточке (локально)
  const cardPt = (i, lx, ly) => { const B = BC[i], [a, b] = rot(lx, ly, B.r); return [B.x + a, B.y + b] };
  const pinPt = i => cardPt(i, 0, -165 + 18);
  function cork(c) {
    c.fillStyle = '#8a5a2b'; c.fillRect(-400, -400, WW + 800, HH + 800);
    for (let i = 0; i < 900; i++) { const x = 1880 * H1(i * 1.7) - 400, y = 2720 * H1(i * 2.9) - 400; c.fillStyle = i % 3 ? 'rgba(60,35,10,.25)' : 'rgba(200,150,90,.22)'; c.fillRect(x, y, 4 + 6 * H1(i), 3 + 4 * H1(i * 3)) }
    c.strokeStyle = '#3b2410'; c.lineWidth = 40; c.strokeRect(20, 200, WW - 40, 1000);
  }
  function photoArt(c, i, t) {   // рисунки внутри фото (локальные координаты фото)
    if (i === 0) { c.fillStyle = '#0f172a'; c.fillRect(PH.x, PH.y, PH.w, PH.h); c.save(); c.translate(-30, -30); c.strokeStyle = '#e0f2fe'; c.lineWidth = 5; c.beginPath(); c.moveTo(-14, -60); c.lineTo(-14, -20); c.lineTo(-50, 50); c.lineTo(50, 50); c.lineTo(14, -20); c.lineTo(14, -60); c.stroke(); poly(c, [-40, 34, 40, 34, 48, 50, -48, 50]); fill(c, '#f59e0b'); c.restore(); c.save(); c.translate(60, 30); poly(c, [0, -46, 34, -10, 20, 40, -20, 40, -34, -10]); fill(c, '#38bdf8'); poly(c, [0, -46, 34, -10, 0, 0]); fill(c, '#7dd3fc'); c.restore() }
  }
  function silhouette(c, i) {   // закрытые карточки: тёмный силуэт предмета
    c.fillStyle = '#1f1d24';
    if (i === 2) { c.fillRect(-50, -60, 100, 120); poly(c, [-50, -60, 50, -60, 62, -100, -38, -100]); c.fill() }
    else if (i === 3) { rr(c, -28, -70, 56, 130, 22); c.fill(); rr(c, -8, -110, 16, 50, 5); c.fill() }
    else { c.beginPath(); c.ellipse(0, 18, 80, 26, 0, 0, TAU); c.fill(); c.fillRect(-80, -12, 160, 30); c.beginPath(); c.ellipse(0, -12, 80, 26, 0, 0, TAU); c.fill() }
  }
  function marker(c, i, erase) {   // фактурные мазки чёрного маркера крест-накрест; erase(c) — стёртая часть (клип)
    c.save(); c.beginPath(); c.rect(PH.x - 4, PH.y - 4, PH.w + 8, PH.h + 8); c.clip(); if (erase) erase(c);
    c.lineCap = 'round';
    const m = (ax, ay, bx, by, wd, sd) => { c.strokeStyle = '#08070a'; c.lineWidth = wd; c.beginPath(); for (let q = 0; q <= 16; q++) { const u = q / 16, x = lp(ax, bx, u) + Math.sin(u * 9 + sd) * 4, y = lp(ay, by, u) + Math.cos(u * 7 + sd) * 4; q ? c.lineTo(x, y) : c.moveTo(x, y) } c.stroke() };
    m(PH.x - 20, PH.y + PH.h + 10, PH.x + PH.w + 20, PH.y - 10, 58, i); m(PH.x - 20, PH.y - 10, PH.x + PH.w + 20, PH.y + PH.h + 10, 58, i + 3); m(PH.x, PH.y + PH.h * .5, PH.x + PH.w * .5, PH.y - 10, 30, i + 5);
    c.restore();
  }
  // f — что в фото: функция (c) в координатах кадра 1080×1920 (вписывается по высоте); closed — маркер; erase — стёртая помадой часть
  function card(c, t, i, o = {}) {
    const B = BC[i]; c.save(); c.translate(B.x, B.y); c.rotate(B.r);
    shadow(c, 'rgba(10,4,0,.6)', 24, 8, 14); c.fillStyle = '#f4efe4'; c.fillRect(-135, -165, 270, 330); noShadow(c);
    c.save(); c.beginPath(); c.rect(PH.x, PH.y, PH.w, PH.h); c.clip(); c.fillStyle = '#5a554c'; c.fillRect(PH.x, PH.y, PH.w, PH.h);
    if (o.f) { const s = PH.h / HH; c.translate(0, PH.y + PH.h / 2); c.scale(s, s); c.translate(-CX, -CY); o.f(c) } else if (i < 2) photoArt(c, i, t); else silhouette(c, i);
    c.restore();
    if (i >= 2 && o.closed !== false) marker(c, i, o.erase);
    c.strokeStyle = 'rgba(0,0,0,.2)'; c.lineWidth = 2; c.strokeRect(PH.x, PH.y, PH.w, PH.h);
    const c2 = o.cap2 ? (o.cap2a ?? 1) : 0;
    tx(c, B.yr, 0, 112, { f: 'J', s: 36, w: 700, ls: 3, c: '#0f172a' }); tx(c, B.cap, 0, 146, { s: B.cap.length > 12 ? 18 : 22, w: 800, ls: 1, c: '#1e293b', max: 250, a: 1 - c2 });
    if (c2 > 0) tx(c, o.cap2, 0, 146, { s: 20, w: 800, ls: 2, c: '#b8862b', a: c2, max: 250 });
    c.restore();
  }
  function pin(c, i, o = {}) { const [x, y] = pinPt(i); c.save(); shadow(c, 'rgba(0,0,0,.6)', 6, 5, 8); circ(c, x, y, 14, '#dc2626'); noShadow(c); circ(c, x - 4, y - 4, 4, '#fecaca'); c.restore() }
  function thread(c, a, b, k) {
    if (k <= 0) return; const [x1, y1] = pinPt(a), [x2, y2] = pinPt(b), P = [];
    for (let i = 0; i <= 20; i++) { const u = i / 20; P.push([lp(x1, x2, u), lp(y1, y2, u) + Math.sin(Math.PI * u) * 26]) }
    const n = Math.max(1, Math.round(20 * cl(k)));
    c.save(); c.lineCap = 'round'; shadow(c, 'rgba(0,0,0,.5)', 5, 5, 8); c.strokeStyle = '#b91c1c'; c.lineWidth = 5; c.beginPath(); for (let i = 0; i <= n; i++) i ? c.lineTo(P[i][0], P[i][1]) : c.moveTo(P[i][0], P[i][1]); c.stroke(); c.restore();
  }
  // кадр 0 выпуска 2 (в любых координатах: рисуется в своих 1080×1920) и кадр 0 главы 3
  function plateLocal(c, s) { rr(c, 70, 80, 180, 68, 18); fill(c, 'rgba(15,23,42,.88)'); tx(c, s, 160, 116, { s: 38, w: 800, ls: 2 }) }
  function frame0(c) { s1(c, 0); plateLocal(c, '2020') }
  function ch3Frame0(c) {   // глава 3 «1924 · Мальборо»: на тёмно-синем по центру стоит белая сигарета с красным кончиком «Beauty Tip»
    const g = c.createRadialGradient(CX, 860, 40, CX, 860, 1300); g.addColorStop(0, C.navy2); g.addColorStop(1, C.navy); c.fillStyle = g; c.fillRect(-400, -400, WW + 800, HH + 800);
    glow(c, CX, 860, 420, '#1e293b', .5);
    c.save(); c.translate(CX, 860); shadow(c, 'rgba(0,0,0,.45)', 36, 14, 22);
    rr(c, -37, -320, 74, 640, 10); fill(c, '#f8fafc'); noShadow(c);
    rr(c, -37, 180, 74, 140, [0, 0, 10, 10]); fill(c, '#e11d48'); c.fillStyle = '#e9b949'; c.fillRect(-37, 174, 74, 6);
    c.fillStyle = 'rgba(0,0,0,.08)'; c.fillRect(14, -320, 23, 640); c.fillStyle = 'rgba(255,255,255,.6)'; c.fillRect(-28, -310, 8, 480);
    c.restore();
    plateLocal(c, '1924');
  }
  // отъезд: ночной дом — фото на карточке 2020 (фото вписано по высоте кадра; начало — фото во весь кадр, без поворота)
  function boardCam(c, t, kz, focus, Z) {
    const B = BC[focus], [px, py] = cardPt(focus, 0, PH.y + PH.h / 2), Z0 = HH / PH.h, z = lp(Z0, Z, kz);
    c.translate(lp(CX, CX, kz), lp(CY, CY, kz)); c.rotate(-B.r * (1 - kz)); c.scale(z, z); c.translate(-lp(px, focus === 1 ? CX : px, 0), -py);
    return [px, py];
  }
  function board(c, t, o) {   // o.f2 — фото карточки 2020, o.a — опции карточек
    cork(c);
    thread(c, 0, 1, 1);
    BC.forEach((B, i) => card(c, t, i, (o.cards || {})[i] || (i === 1 ? { f: o.f2 } : {})));
    (o.threads || []).forEach(([a, b, k]) => thread(c, a, b, k));
    BC.forEach((B, i) => { if (!(o.noPin || []).includes(i)) pin(c, i) });
  }
  // общий план доски: камера z = 1 центрируется на доске (Y 250…1120 → середина 685)
  function boardView(c, t, kz) {   // kz: 0 — фото 2020 во весь кадр, 1 — вся доска
    const B = BC[1], [px, py] = cardPt(1, 0, PH.y + PH.h / 2), Z0 = HH / PH.h;
    const z = Math.pow(Z0, 1 - kz), cx = lp(px, CX, kz), cy = lp(py, CY, kz), r = -B.r * (1 - kz);   // доска: карточки Y 250…1120 на экране
    c.translate(CX, CY); c.rotate(r); c.scale(z, z); c.translate(-cx, -cy);
  }
  function endA(c, t) {   // шортс: нити к трём закрытым, криптекс щёлкает (не открывает), штамп YouTube, вниз к ноутбуку, наезд в кадр 0
    const kz = eio(at(t, K.b0 - .4, K.b0 + .7)), kp = eio(at(t, K.next - .1, K.next + .9)), pan = 1700 * kp, ez = eio(at(t, K.ask - .15, K.endT));
    const V = { x: CX, y: 1112, h: 332 }; V.w = V.h * WW / HH;
    c.save();
    if (ez > 0) { const vy = V.y + 1920 - pan, m = Math.pow(HH / V.h, ez); c.translate(lp(V.x, CX, ez), lp(vy, CY, ez)); c.scale(m, m); c.translate(-V.x, -vy) }
    c.save(); c.translate(0, -pan); c.save(); boardView(c, t, kz);
    const kt = at(t, K.card2 - .1, K.card2 + .9);
    board(c, t, { f2: cc => dormScene(cc, K.b0 - .4), threads: [[1, 2, kt], [1, 3, at(kt, .15, 1)], [1, 4, at(kt, .3, 1)]], cards: { 2: { closed: true } } });
    cryptex(c, t, K.three - .2, K.three + .9, false);
    c.restore();
    const ks = at(t, K.yt - .05, K.yt + .25); if (ks > 0) stampYT(c, ks);
    c.restore();
    c.save(); c.translate(0, 1920 - pan); desk(c, t, V); c.restore();
    c.restore();
  }
  function stampYT(c, k) {   // #150: штамп с упругим ударом, над зоной субтитров (Y = 1140)
    const e = ei(cl(k * 1.4)), sq = Math.sin(Math.PI * at(k, .7, 1)) * .12;
    c.save(); c.translate(CX, 1140); c.rotate(-.05); c.scale(lp(2.4, 1, e) * (1 + sq), lp(2.4, 1, e) * (1 - sq)); c.globalAlpha *= lp(.2, 1, e);
    rr(c, -300, -58, 600, 116, 14); fill(c, 'rgba(255,245,240,.92)'); rr(c, -300, -58, 600, 116, 14); stroke(c, '#dc2626', 10);
    poly(c, [-250, -26, -250, 26, -206, 0]); fill(c, '#dc2626'); tx(c, 'ТОЛЬКО НА YOUTUBE', 30, 2, { s: 44, w: 800, ls: 3, c: '#dc2626', max: 470 });
    c.restore();
  }
  function desk(c, t, V) {   // стол под доской: лампа, силуэт со спины (#071), ноутбук с плеером — в окне кадр 0
    const lean = eio(at(t, K.ask - .1, K.ask + .4));
    { const g = c.createLinearGradient(0, 0, 0, 1400); g.addColorStop(0, '#1a130e'); g.addColorStop(1, '#0d0907'); c.fillStyle = g; c.fillRect(-400, -60, WW + 800, 1500) }
    c.fillStyle = '#3b2a1c'; c.fillRect(-400, -24, WW + 800, 30);
    { const g = c.createLinearGradient(0, 1392, 0, 1960); g.addColorStop(0, '#4a3220'); g.addColorStop(1, '#22160d'); c.fillStyle = g; c.fillRect(-400, 1392, WW + 800, 700) }
    const hx = 790, hy = 960; c.save(); c.globalAlpha = .5; poly(c, [hx - 40, hy + 40, hx + 40, hy + 30, 980, 1920, 260, 1920]); { const g = c.createLinearGradient(0, hy, 0, 1920); g.addColorStop(0, 'rgba(255,214,140,.55)'); g.addColorStop(1, 'rgba(255,214,140,0)'); c.fillStyle = g; c.fill() } c.restore();
    c.strokeStyle = '#2b2e3a'; c.lineWidth = 16; c.lineCap = 'round'; c.beginPath(); c.moveTo(900, 1390); c.lineTo(940, 1140); c.lineTo(hx + 30, hy - 20); c.stroke();
    c.save(); c.translate(hx, hy); c.rotate(.45); poly(c, [-70, 40, 70, 40, 40, -40, -40, -40]); fill(c, '#33374a'); c.beginPath(); c.ellipse(0, 40, 70, 14, 0, 0, TAU); fill(c, '#fff4d6'); c.restore();
    poly(c, [176, 1420, 904, 1420, 860, 1372, 220, 1372]); fill(c, '#a9adb8');
    rr(c, 214, 904, 652, 470, 22); fill(c, '#2a2d38'); rr(c, 230, 920, 620, 438, 12); fill(c, '#0f0f12');
    c.save(); rr(c, 230, 920, 620, 438, 12); c.clip(); c.fillStyle = 'rgba(255,255,255,.07)'; for (let i = 0; i < 5; i++) { rr(c, 252, 960 + i * 54, 150, 12, 6); c.fill() } for (let i = 0; i < 4; i++) circ(c, 700, 1010 + i * 78, 22, 'rgba(255,255,255,.12)'); c.restore();
    c.save(); c.beginPath(); c.rect(V.x - V.w / 2, V.y - V.h / 2, V.w, V.h); c.clip(); c.translate(V.x - V.w / 2, V.y - V.h / 2); c.scale(V.w / WW, V.h / HH); frame0(c); c.restore();
    const pb = 1 - ss(K.ask - .1, K.ask + .3, t); if (pb > 0) { c.save(); c.globalAlpha *= pb; c.translate(0, 60 * (1 - pb)); rr(c, V.x - V.w / 2, V.y + V.h / 2 + 10, V.w, 5, 2); fill(c, 'rgba(255,255,255,.25)'); rr(c, V.x - V.w / 2, V.y + V.h / 2 + 10, 30, 5, 2); fill(c, '#ff1f2e'); circ(c, V.x - V.w / 2 + 30, V.y + V.h / 2 + 12, 6, '#ff1f2e'); c.restore() }
    c.save(); c.translate(-92 + 28 * lean, -20 * lean);
    c.beginPath(); c.moveTo(70, 1960); c.bezierCurveTo(80, 1520, 150, 1400, 250, 1376); c.quadraticCurveTo(330, 1356, 410, 1376); c.bezierCurveTo(520, 1404, 580, 1540, 590, 1960); c.closePath(); fill(c, '#07060a');
    rr(c, 296, 1300, 72, 90, 24); fill(c, '#07060a'); c.beginPath(); c.ellipse(330, 1236, 78, 92, -.08, 0, TAU); fill(c, '#07060a');
    for (let i = 0; i < 7; i++) circ(c, 276 + i * 18, 1160 + 6 * Math.sin(i * 1.7), 24, '#07060a');
    c.strokeStyle = 'rgba(125,211,252,.35)'; c.lineWidth = 4; c.beginPath(); c.ellipse(330, 1236, 78, 92, -.08, -.9, .5); c.stroke();
    c.restore();
  }
  // #064: булавка 1924 поворачивается, пристыковывается вторая шляпка, растёт золотой криптекс; кольца 2·0·2·0 → 1·9·2·4
  function cryptex(c, t, t0, t1, open) {
    const k = at(t, t0, t1); if (k <= 0) return { k: 0 };
    const [x, y] = pinPt(2), kg = eo(at(k, 0, .3)), ksp = at(k, .25, .85), shake = !open && k > .85 ? Math.sin((k - .85) * 80) * 6 * (1 - k) : 0;
    const W = 360 * kg, Hh = 95;
    c.save(); c.translate(x + shake, y); c.rotate(BC[2].r);
    shadow(c, 'rgba(0,0,0,.45)', 16, 6, 10);
    const g = c.createLinearGradient(0, -Hh / 2, 0, Hh / 2); g.addColorStop(0, '#fde68a'); g.addColorStop(.45, '#e9b949'); g.addColorStop(1, '#8a6420');
    rr(c, -W / 2, -Hh / 2, W, Hh, 18); fill(c, g); noShadow(c);
    for (const sd of [-1, 1]) { c.beginPath(); c.ellipse(sd * W / 2, 0, 22 * kg, Hh / 2 + 8, 0, 0, TAU); fill(c, '#dc2626'); circ(c, sd * W / 2 - 4, -12, 6 * kg, '#fecaca') }
    if (kg > .6) {
      const fromD = [2, 0, 2, 0], toD = [1, 9, 2, 4];
      for (let i = 0; i < 4; i++) {
        const cx = -96 + i * 64, kk = ss(i * .12, i * .12 + .5, ksp), roll = kk >= 1 ? 0 : (kk * 9 * (i + 2)) % 1, d = kk >= 1 ? toD[i] : Math.floor(lp(fromD[i], fromD[i] + 10 * (i + 1), kk)) % 10;
        rr(c, cx - 28, -38, 56, 76, 8); fill(c, '#0f172a'); c.save(); c.beginPath(); c.rect(cx - 28, -38, 56, 76); c.clip();
        tx(c, String(d), cx, 2 - roll * 76, { f: 'J', s: 50, w: 700, c: '#fde68a' }); tx(c, String((d + 1) % 10), cx, 78 - roll * 76, { f: 'J', s: 50, w: 700, c: '#fde68a' }); c.restore();
      }
    }
    c.restore();
    return { k, x, y };
  }
  function endB(c, t) {   // мостик: наезд на 1924, криптекс открывается → футляр помады → помада стирает маркер → зум в фото = кадр 0 главы 3
    const kz = eio(at(t, K.b0 - .4, K.b0 + .7)), kp = eio(at(t, K.b0 + .3, K.b0 + 1.4)), kf = eio(at(t, K.soft - .1, K.endT));
    const B = BC[2], [px, py] = cardPt(2, 0, PH.y + PH.h / 2), Zf = HH / PH.h;
    c.save();
    // камера: общий план → наезд на 1924 (×2) → зум в фото до кадра
    const z1 = lp(1, 2.1, kp), zf = Math.pow(Zf / 2.1, kf);
    if (kp <= 0) boardView(c, t, kz);
    else { c.translate(CX, lp(lp(CY, CY + 40, kp), CY, kf)); c.rotate(-B.r * kf); c.scale(z1 * zf, z1 * zf); c.translate(-lp(lp(CX, px, kp), px, kf), -lp(lp(CY, py - 40, kp), py, kf)) }
    // помада: стёрто то, что левее-выше линии мазка
    const ksw = eio(at(t, K.ago - .1, K.ago + .8)), lip = at(t, K.brut - .15, K.brut + .45);
    const erase = ksw > 0 ? (cc => { const d = lp(-260, 260, ksw); cc.beginPath(); cc.moveTo(-1000, -1000); cc.lineTo(d + 1000, -1000); cc.lineTo(d - 1000, 1000); cc.lineTo(-1000, 1000); cc.closePath(); cc.rect(-1000, -1000, 2000, 2000); cc.clip('evenodd') }) : null;
    board(c, t, { f2: cc => dormScene(cc, K.b0 - .4), noPin: t > K.lead - .9 ? [2] : [], cards: { 2: { f: ksw > 0 ? ch3Frame0 : null, erase, cap2: 'МЯГКИЕ, КАК МАЙ · 1924', cap2a: ss(.6, 1, ksw) } } });
    const fa = 1 - ss(0, .25, kf); if (ksw > 0 && fa > 0) { c.save(); c.translate(B.x, B.y); c.rotate(B.r); c.save(); c.beginPath(); c.rect(PH.x, PH.y, PH.w, PH.h); c.clip(); c.globalAlpha *= fa; c.strokeStyle = 'rgba(225,29,72,.85)'; c.lineWidth = 16; c.lineCap = 'round'; const d = lp(-260, 260, ksw); c.beginPath(); c.moveTo(PH.x - 10, lp(PH.y + 40, PH.y + PH.h + 40, 0)); c.lineTo(Math.min(d, 240) * .5, Math.min(d, 240) * .5); c.stroke(); c.restore(); c.restore() }   // росчерк помады гаснет до зума — последний кадр = кадр 0 главы 3
    // криптекс → футляр помады
    const t0 = K.lead - .9, open = t >= K.brut - .3;
    if (!open) cryptex(c, t, t0, K.brut - .3, true);
    else {
      const [x, y] = pinPt(2), kr = eio(at(t, K.brut - .3, K.brut + .1)), kc = eio(at(t, K.brut + .1, K.brut + .4)), ko = eo(at(t, K.brut + .35, K.ago - .1));
      const sx = ksw > 0 ? lp(PH.x + 20, PH.x + PH.w + 120, ksw) : 0, sy = ksw > 0 ? lp(PH.y + 10, PH.y + PH.h + 110, ksw) : 0, out = kf;
      c.save(); c.translate(lp(x, B.x + sx, ss(0, .2, ksw)) + 900 * out, lp(y, B.y + sy, ss(0, .2, ksw)) + 300 * out); c.rotate(B.r + lp(0, Math.PI / 2, kr) - (ksw > 0 ? .6 : 0));
      shadow(c, 'rgba(0,0,0,.45)', 16, 6, 10);
      const g = c.createLinearGradient(-47, 0, 47, 0); g.addColorStop(0, '#8a6420'); g.addColorStop(.5, '#fde68a'); g.addColorStop(1, '#8a6420');
      const L = lp(360, 220, kr); rr(c, -47, -L / 2, 94, L, 16); fill(c, g); noShadow(c);
      c.fillStyle = 'rgba(138,100,32,.6)'; for (let i = -2; i <= 2; i++) c.fillRect(-47, i * 18 - 4, 94, 4);
      if (ko > 0) { const lh = 120 * ko; rr(c, -30, -L / 2 - lh, 60, lh + 8, [26, 8, 0, 0]); fill(c, '#e11d48'); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(-20, -L / 2 - lh + 14, 8, lh - 10) }
      c.restore();
      if (kc > 0 && kc < 1) { c.save(); c.translate(x + 80 * kc, y - 200 * kc); c.rotate(B.r + Math.PI / 2 + kc * 2); rr(c, -50, -60, 100, 120, 18); fill(c, '#e9b949'); c.restore() }   // колпачок слетает
    }
    c.restore();
  }

  // ================= кадр =================
  function frameV(c, t) {
    if (t < K.all + .1) s1(c, t);
    else if (t < K.all + 2.95) s1to2(c, t);
    else if (t < K.unroll - .15) s2(c, t);
    else if (t < K.unroll + .55) { const k = eio(at(t, K.unroll - .15, K.unroll + .55)); c.save(); c.translate(0, HH * k); s2(c, t); c.restore(); c.save(); c.translate(0, -HH * (1 - k)); nightBg(c, t, 0); c.restore(); s3scroll(c, t, true) }
    else if (t < K.conv + .25) s3(c, t);
    else if (t < K.flav + .05) s4(c, t);
    else if (t < K.rem - .2) s5(c, t);
    else if (t < K.bypass - .5) s6(c, t);
    else if (t < K.ban - .25) s7(c, t);
    else if (t < K.b0 - .4) s8(c, t);
    else if (t < K.b0 + .7) { const kz = eio(at(t, K.b0 - .4, K.b0 + .7)); if (BR) endB(c, t); else endA(c, t) }
    else if (BR) endB(c, t); else endA(c, t);
  }
  function frame(t) {
    const c = X; c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.fillStyle = '#000'; c.fillRect(0, 0, WW, HH);
    liveCam(c, !BR && t > K.b0 ? t - K.endT : t);
    frameV(c, t);
    yearV(c, t);
    post(c, t);
    subs(c, t);
  }

  // ---------- звуки (cues → cues.json → v18_mix.py) ----------
  function cues() {
    for (const k in CUES) delete CUES[k];
    const Q = cue;
    Q(.5, 'pop', .8); Q(.6, 'icewind', .6); Q(3.1, 'whoosh', .5); Q(3.72, 'thud', .45); Q(3.7, 'deep', .4); Q(4.2, 'glass', .3);
    Q(K.all + .1, 'truck', .8);
    Q(K.chop - .05, 'blade', 1); Q(K.chop + .17, 'impact', .55); Q(K.chop + .2, 'splash', .9); K.fl.forEach(f => Q(f, 'splash', .35));
    Q(K.unroll - .1, 'scroll', .9); Q(K.unroll + .4, 'thud', .4); Q(K.cart, 'marker', .5); Q(K.whole, 'papers', .5); Q(K.juul - .15, 'dive', .6);
    Q(K.took, 'whoosh', .5); Q(K.took + .32, 'impact', .7); Q(K.shen - .2, 'conveyor', .7);
    Q(K.conv + .3, 'wave', .9); Q(K.year - .05, 'papers', .5); Q(K.teens, 'pop', .4); Q(K.grew, 'pop', .5); Q(K.x11, 'stamp', .7);
    Q(K.flav + .05, 'drip', .8); Q(K.flav + 1.0, 'splash', .4); Q(K.liq - .05, 'whoosh', .45); Q(K.synth, 'bubble', .6); Q(K.ws, 'glass', .4);
    Q(K.fool - .4, 'dive', .5); Q(K.ice - .6, 'icewind', .7); Q(K.ice, 'frost', .6); Q(K.tear, 'thud', .3);
    Q(K.rem - .2, 'deep', .5); Q(K.grow2, 'conveyor', .35); Q(K.mesh - .2, 'papers', .4); Q(K.puffs - .2, 'papers', .4); Q(K.nic + .35, 'whoosh', .5); Q(K.n16, 'coins', .5);
    Q(K.bypass - .5, 'deep', .4); Q(K.noleaf, 'papers', .3); Q(K.noleaf + .1, 'glass', .5); Q(K.sales - .35, 'whoosh', .4); Q(K.sales + .25, 'drip', .5);
    Q(K.ten - .55, 'drip', .5); Q(K.ten, 'register', .9); Q(K.bil + .6, 'papers', .4); Q(K.corpE - .9, 'dive', .5);
    Q(K.ban - .2, 'deep', .5); Q(K.ban + .4, 'whoosh', .4); Q(K.icepar, 'puff', .5);
    Q(K.b0 - .4, 'whoosh', .5);
    if (!BR) { Q(K.card2 - .1, 'papers', .3); Q(K.three - .2, 'cryptex:0.9', .6); Q(K.yt - .05, 'stamp', 1); Q(K.yt, 'thud', .5); Q(K.next - .1, 'whoosh', .4); Q(K.ask, 'keys', .3); Q(K.ask + .1, 'dive', .6) }
    else { Q(K.b0 + .3, 'whoosh', .4); Q(K.lead - .9, 'cryptex', .8); Q(K.brut + .1, 'lipstick', .7); Q(K.ago - .1, 'marker', .5); Q(K.soft - .1, 'dive', .6) }
  }

  window.EP = {
    P: { bg: C.navy, paper: C.white, ink: C.ink, line: C.white, a1: C.mango, a2: C.red }, D: {}, clean: true, noCap: true, lead: 0, tr: {}, trDef: 'cut', size: [WW, HH],
    init(tl, SC) {
      window.__TL = tl; TLW = tl.sent.flatMap(s => s.words); TLX = { b0: tl.b0, endT: tl.endT };
      EPN = String(tl.ep || '').replace(/-(ru|en|de)$/, ''); BR = /^v18b$/.test(EPN);
      K = keys(); window.__K = K; cues(); CHUNKS = buildChunks();
      SC.forEach(S => { window.EP.D[S.key] = t => { frame(t); return '' } });
      if (!document.getElementById('v162')) { const st = document.createElement('style'); st.id = 'v162'; st.textContent = [500, 700].map(w => `@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-latin-${w}-normal.woff2)}@font-face{font-family:J;font-weight:${w};src:url(fonts/jetbrains-mono-cyrillic-${w}-normal.woff2);unicode-range:U+0400-04FF,U+2116}`).join(''); document.head.appendChild(st) }
      cv = mk(WW, HH); cv.style.cssText = `position:absolute;left:0;top:0;width:${WW}px;height:${HH}px`; document.body.insertBefore(cv, document.getElementById('grain'));
      X = cv.getContext('2d');
      return Promise.all(['500 20px J', '700 20px J', '600 20px M', '800 20px M', '500 20px O', '700 20px O'].map(f => document.fonts.load(f, 'АЯaz09'))).then(() => 0);
    },
  };
})();
