// Бонус — «как нейросеть делает ролик»: текст → код → кадры → музыка → рендер → «го». v5, RU, без голоса.
// Настоящие кадры ролика «Я — никотин» — img/howto/*.jpg (вырезаются из готового видео, см. README).
(function () {
  const C = { bg: '#0F1220', bg2: '#171B2E', bg3: '#232946', ink: '#0A0C16', paper: '#F4F1EA', line: '#F4F1EA', a1: '#FFD447', a2: '#FF4F8B', a3: '#3DE0D0', a4: '#8B7CFF', mute: '#7D86A8' };
  P = C;
  const D = {};
  const MOT = [C.a4, C.a3, C.a1];
  const FPS = 15, NV = 90; // кадры для «телефона»: img/howto/p001…p090.jpg (6 с, 15 к/с)
  const vframe = (t, t0) => 'img/howto/p' + String(1 + Math.floor(((Math.max(0, t - t0) * FPS) % NV))).padStart(3, '0') + '.jpg';
  function phoneV(t, t0, x, y, s = 1, o = {}) {
    const w0 = 460, h0 = 820, scr = D_.rr(-w0 / 2 + 18, -h0 / 2 + 18, w0 - 36, h0 - 36, 40);
    const img = `<image href="${vframe(t, t0)}" x="${-w0 / 2 + 18}" y="${-h0 / 2 + 18}" width="${w0 - 36}" height="${h0 - 36}" preserveAspectRatio="xMidYMid slice"/>`;
    return g(sh(D_.rr(-w0 / 2, -h0 / 2, w0, h0, 56), '#1B1F33', { c: C.ink, w: 8 }) + clip(scr, img) + sh(D_.rr(-50, -h0 / 2 + 26, 100, 22, 11), C.ink), at(x, y, s, o.r || 0), o.op ?? 1)
  }
  // окно редактора
  function editor(title, inner, x, y, w0, h0, o = {}) {
    let s = sh(D_.rr(-w0 / 2, -h0 / 2, w0, h0, 26), C.bg2, { c: C.bg3, w: 4 }) + sh(D_.rr(-w0 / 2, -h0 / 2, w0, 64, 26), C.bg3) + sh(D_.rr(-w0 / 2, -h0 / 2 + 40, w0, 24, 0), C.bg3);
    s += [C.a2, C.a1, C.a3].map((c, i) => sh(D_.circ(-w0 / 2 + 40 + i * 34, -h0 / 2 + 32, 10), c)).join('') + tx(title, 0, -h0 / 2 + 42, { f: 'M', w: 600, s: 26, c: C.mute });
    s += clip(D_.rr(-w0 / 2, -h0 / 2 + 64, w0, h0 - 64, 0), inner);
    return g(s, at(x, y, o.s || 1, o.r || 0), o.op ?? 1)
  }
  const mono = (str, x, y, c, sz = 30) => `<text x="${R(x)}" y="${R(y)}" font-family="DejaVu Sans Mono, monospace" font-size="${sz}" fill="${c}" xml:space="preserve">${esc(str)}</text>`;
  const SCRIPT = ['Я — никотин. Мне нужно 10 секунд,', 'чтобы залезть тебе в голову.', 'Засекай.', 'Лёгкие. Сотни миллионов', 'крошечных пузырьков.', 'Кровь. Сердце само толкает', 'меня наверх.'];
  const CODE = [
    ['// молекула никотина: шестиугольник + пятиугольник', C.mute],
    ['function molecule(t, o) {', C.a4],
    ['  const hex = poly(6, 70), pent = poly(5, 56);', C.paper],
    ['  let s = shape(pent, PINK2) + shape(hex, PINK);', C.paper],
    ['  const blink = blinkAt(t);   // моргает сам', C.a3],
    ['  s += eyes(blink, o.look) + mouth(o.mood);', C.paper],
    ['  return group(s, at(o.x, o.y, o.s));', C.paper],
    ['}', C.a4],
    ['', C.paper],
    ['D.hook = (t, S, T) => {     // сцена = f(t)', C.a1],
    ['  const k = pop(t, T.c("никотин"));', C.paper],
    ['  return bg(PLUM) + molecule(t, { s: 2.1 * k });', C.paper],
    ['};', C.a1],
  ];

  // ===== 1. «Этот ролик целиком сделала нейросеть. Вот как» =====
  D.hook = (t, S, T) => {
    const tn = T.c(L('AI', 'нейросеть')) - .2, tv = T.c(L('how', 'вот')) - .2;
    let s = bg(C.bg) + sh(D_.circ(540, 820, 460), C.bg2) + motes(t, MOT, 12);
    const kv = E(t, tv, .6, 'io5');
    s += phoneV(t, 0, 540, lerp(820, 760, kv), lerp(1.12, .9, kv), { r: lerp(0, -4, kv) });
    s += stamp(L('MADE BY AI', 'СДЕЛАНО НЕЙРОСЕТЬЮ'), 540, 1250 - kv * 40, t, tn, { c: C.a1, s: 54, r: -6 });
    return g(s, drift(t, T, .03))
  };
  // ===== 2. «Шаг первый: текст. Каждый факт — с источником» =====
  D.text = (t, S, T) => {
    const ts = T.c(L('source', 'источником')) - .2;
    let s = bg(C.bg) + motes(t, MOT, 8) + pill(L('STEP 1 · TEXT', 'ШАГ 1 · ТЕКСТ'), 540, 330, { f: C.a4, s: 40 });
    const n = Math.floor(E(t, T.a + .1, 2.2, 'l') * SCRIPT.join('').length);
    let inner = '', used = 0;
    SCRIPT.forEach((l, i) => { const k = Math.max(0, Math.min(l.length, n - used)); used += l.length; if (k > 0) inner += tx(l.slice(0, k) + (k < l.length ? '▌' : ''), -380, -230 + i * 66, { f: 'M', w: 600, s: 38, c: C.paper, a: 'start' }) });
    s += editor('nicme.txt', inner, 540, 760, 860, 640);
    const kc = P01(t, ts, .45);
    if (kc > 0) s += g(sh(D_.rr(-330, -56, 660, 112, 56), C.a3, { c: C.ink, w: 5 }) + tx(L('WHO · NIDA · HSE ✓', 'ВОЗ · NIDA · HSE ✓'), 0, 18, { f: 'O', w: 700, s: 48, c: C.ink, ls: 2 }), at(540, 1180, EZ.back(kc), lerp(-10, -3, kc)));
    return g(s, drift(t, T, .03))
  };
  // ===== 3. «Шаг второй: рисую кодом. Каждая сцена — функция от времени» =====
  D.code = (t, S, T) => {
    const tc = T.c(L('code', 'кодом')) - .3, tf = T.c(L('function', 'функция')) - .2;
    let s = bg(C.bg) + motes(t, MOT, 8) + pill(L('STEP 2 · CODE', 'ШАГ 2 · КОД'), 540, 330, { f: C.a4, s: 40 });
    const nl = Math.floor(E(t, T.a, 2.4, 'l') * CODE.length + 1);
    let inner = '';
    CODE.slice(0, nl).forEach(([l, c], i) => { inner += mono(String(i + 1).padStart(2, ' '), -400, -150 + i * 40, '#4A5378', 26) + mono(l, -350, -150 + i * 40, c, 26) });
    s += editor('nicme.js', inner, 540, 700, 900, 600);
    // справа внизу — то, что рисует этот код
    const km = P01(t, tc + .3, .6), tt = t - tf;
    if (km > 0) s += g(molecule(t, { f: C.a2, f2: '#D93370', c: C.ink, mood: 'sly', look: tt > 0 ? Math.sin(tt * 3) : 0 }), at(470, 1180 + (tt > 0 ? Math.sin(tt * 4) * 18 : 0), 1.15 * EZ.back(km)));
    if (t > tf) { const v = (t - tf) * 1.0; s += g(tx('render(t)', 0, 0, { f: 'O', w: 700, s: 56, c: C.a1 }) + tx(`t = ${v.toFixed(2)}`, 0, 64, { f: 'M', w: 800, s: 36, c: C.paper }), at(810, 1140, EZ.back(P01(t, tf, .4)))) }
    return g(s, drift(t, T, .03))
  };
  // ===== 4. «Шаг третий: камера, переходы, анимация. Тысяча пятьсот кадров» =====
  D.frames = (t, S, T) => {
    const tk = T.c(L('thousand', 'тысяча')) - .2;
    let s = bg(C.bg) + pill(L('STEP 3 · FRAMES', 'ШАГ 3 · КАДРЫ'), 540, 330, { f: C.a4, s: 40 });
    for (let i = 0; i < 12; i++) {
      const c0 = i % 4, r0 = Math.floor(i / 4), x = 180 + c0 * 240, y = 560 + r0 * 330, k = P01(t, T.a + .1 + i * .12, .5);
      if (k > 0) s += g(sh(D_.rr(-104, -184, 208, 368, 18), C.bg3) + clip(D_.rr(-100, -180, 200, 360, 16), `<image href="img/howto/g${String(i + 1).padStart(2, '0')}.jpg" x="-100" y="-180" width="200" height="360" preserveAspectRatio="xMidYMid slice"/>`), at(x, y + (1 - EZ.o(k)) * 300, EZ.back(k) * .84, (1 - EZ.o(k)) * (i % 2 ? 20 : -20)));
    }
    const kn = P01(t, tk, .8);
    if (kn > 0) s += g(sh(D_.rr(-300, -70, 600, 140, 70), C.a1, { c: C.ink, w: 6 }) + odo(1521 * EZ.o(kn), 0, 30, { s: 84, c: C.ink, sep: ' ', post: L(' frames', ' кадр') , ps: .5 }), at(540, 890, EZ.back(clamp(kn * 2))));
    return g(s, drift(t, T, .03))
  };
  // ===== 5. «Шаг четвёртый: музыку и звуки тоже пишу сама» =====
  D.music = (t, S, T) => {
    let s = bg(C.bg) + motes(t, MOT, 10) + pill(L('STEP 4 · MUSIC', 'ШАГ 4 · МУЗЫКА'), 540, 330, { f: C.a4, s: 40 });
    const k = E(t, T.a, .6, 'o5');
    for (let i = 0; i < 26; i++) { const h = (40 + 260 * Math.abs(Math.sin(t * 5.3 + i * .7) * Math.sin(t * 2.1 + i * .31))) * k; s += sh(D_.rr(130 + i * 32, 820 - h / 2, 20, h, 10), [C.a4, C.a3, C.a2][i % 3]) }
    for (let i = 0; i < 9; i++) { const x = ((i * 140 - (t - T.a) * 260) % 1260 + 1260) % 1260 - 90, y = 1080 + [0, -40, -80, -40, 0, 40, -60, -20, 20][i]; s += sh(D_.rr(x, y, 110, 26, 13), C.a1, { op: k }) }
    s += line('M60 1150H1020', 1, { c: C.bg3, w: 4 });
    s += cap(L('synth · no samples', 'синтез · без чужих прав'), 540, 1240, { c: C.mute, s: 28, op: k });
    return g(s, drift(t, T, .03))
  };
  // ===== 6. «Рендер — одна минута» =====
  D.render = (t, S, T) => {
    let s = bg(C.bg) + motes(t, MOT, 8);
    const k = E(t, T.a + .1, T.b - T.a - .1, 'io');
    s += sh(D_.rr(140, 820, 800, 60, 30), C.bg3) + sh(D_.rr(140, 820, Math.max(60, 800 * k), 60, 30), C.a3);
    s += tx(`${Math.floor(k * 1521)} / 1521`, 540, 760, { f: 'O', w: 700, s: 90, c: C.paper });
    s += cap(L('frames rendered', 'кадров готово'), 540, 960, { c: C.mute, s: 30 });
    return s
  };
  // ===== 7. «А человек написал мне одно слово: «го»» =====
  D.done = (t, S, T) => {
    const tg = T.c(L('go', '«го».')) - .3;
    let s = bg('#17212B') + motes(t, MOT, 8);
    const kb = P01(t, T.a + .1, .5);
    s += g(sh(D_.circ(0, 0, 44), '#5B8DEF') + tx('A', 0, 16, { f: 'U', w: 800, s: 40, c: '#fff' }), at(150, 1040, EZ.back(kb)));
    const kg = P01(t, tg, .5);
    if (kg > 0) s += g(sh('M0 0H220Q260 0 260 40V90Q260 130 220 130H20L-14 150L0 110Z', '#2B5278') + tx(L('go', 'го'), 120, 92, { f: 'U', w: 800, s: 72, c: '#fff' }) + tx('18:40 ✓✓', 210, 122, { f: 'M', w: 600, s: 18, c: '#8FB3D9', a: 'end' }), at(220, 970, EZ.back(kg)));
    s += phoneV(t, T.a, 780, 700, .75 * E(t, T.a + .2, .6, 'back'), { r: 4 });
    return g(s, drift(t, T, .03))
  };

  window.EP = {
    P: C, D, clean: true, lead: .2,
    init() { // все кадры заранее, иначе на скриншоте пустые окна
      const L0 = [...Array(NV)].map((_, i) => 'img/howto/p' + String(i + 1).padStart(3, '0') + '.jpg').concat([...Array(12)].map((_, i) => 'img/howto/g' + String(i + 1).padStart(2, '0') + '.jpg'));
      window._keep = L0.map(u => { const im = new Image(); im.src = u; return im });
      return Promise.all(window._keep.map(im => im.decode().catch(() => 0)));
    },
    tr: { hook: 'slide', text: 'slide', code: 'zc', frames: 'slide', music: 'zc', render: 'slide' },
    trAt: { code: [470, 1180], music: [540, 820] },
    trCol: { code: C.bg, music: C.bg },
    cap: { hi: C.a1, st: C.ink },
  };
})();
