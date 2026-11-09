// Никотин v6-1 — «Что вы знаете о…» шизо-версия: заговор тли (как «Coca-Cola = 666» в оригинале). Все факты настоящие,
// связки — шутка (подпись в конце: «это шутка · факты настоящие»). Доска с красными нитками, полароиды, тля в очках.
(function () {
  const C = { bg: '#1E1B2E', bg2: '#2A2540', bg3: '#3A3358', ink: '#15121F', paper: '#F4EFE3', paper2: '#E6DCC6', line: '#F4EFE3',
    a1: '#FFD23F', a2: '#E23B3B', a3: '#7FC48A', cork: '#C68B59', aph: '#A6D86B', aph2: '#7FB84A', leaf: '#5E9E5A', leaf2: '#3F7A45',
    mango: '#FFB238', eu: '#2F56A6', star: '#FFD23F', skin: '#E9B48F', sky: '#F28C5B', sky2: '#F7B267', sea: '#2E4A73', grass: '#9ED073' };
  P = C;
  const D = {};
  const MOT = [C.a1, C.paper, C.a3];
  const cw = (t, k = 1) => cork(260 * k + t * 18, 140 * k + t * 6);  // доска чуть едет
  // ---------- предметы шизо-версии ----------
  // тля-значок для толпы (символ в defs — сотни штук дёшево)
  const APH = '<g id="aphS"><path d="M-92 20C-110 -40 -60 -92 6 -90C60 -88 96 -50 90 6C84 44 40 56 -10 56C-56 56 -84 46 -92 20Z" fill="#A6D86B" stroke="#15121F" stroke-width="7"/><path d="M-92 20C-110 -40 -60 -92 6 -90C-30 -70 -60 -20 -50 52C-74 48 -86 38 -92 20Z" fill="#7FB84A"/><path d="M66 -40C78 -70 118 -74 132 -46C146 -18 128 10 100 12C80 12 62 -10 66 -40Z" fill="#A6D86B" stroke="#15121F" stroke-width="7"/><ellipse cx="108" cy="-36" rx="11" ry="13" fill="#15121F"/><circle cx="112" cy="-41" r="4" fill="#fff"/><path d="M120 -64C130 -96 160 -108 180 -100M-78 -50L-104 -84" stroke="#15121F" stroke-width="6" fill="none" stroke-linecap="round"/></g>' +
    '<g id="wingS"><path d="M0 0C40 -60 150 -110 210 -90C240 -60 170 -10 0 0Z" fill="#E8F4FF" stroke="#15121F" stroke-width="6"/></g>';
  const aphU = (x, y, s, r = 0, fl = false) => `<use href="#aphS" transform="translate(${R(x)} ${R(y)}) rotate(${R(r)}) scale(${fl ? -s : s} ${s})"/>`;
  const wingU = (x, y, s, r) => `<use href="#wingS" transform="translate(${R(x)} ${R(y)}) rotate(${R(r)}) scale(${s})"/>`;
  // арбуз (долька) и сахарная вата
  const melon = (x, y, s = 1) => g(sh('M-120 0A120 120 0 0 0 120 0Z', '#5E9E5A', { c: C.ink, w: 6 }) + sh('M-100 0A100 100 0 0 0 100 0Z', '#F4EFE3') + sh('M-88 0A88 88 0 0 0 88 0Z', '#E2574C') + line('M-120 0H120', 1, { c: C.ink, w: 6 }) + [[-40, 26], [0, 46], [40, 26], [-20, 60], [24, 64]].map(([a, b]) => sh(D_.ell(a, b, 6, 9), C.ink)).join(''), at(x, y, s, 180));
  const candy = (x, y, s = 1) => g(line('M0 40L0 200', 1, { c: C.paper, w: 14 }) + line('M0 40L0 200', 1, { c: C.ink, w: 4 }) + cloud(0, -20, .62, { f: '#F7A8C8', c: C.ink, w: 9 }) + cloud(-30, -60, .4, { f: '#FBC4DA', c: C.ink, w: 12 }), at(x, y, s));
  // одноразка-фото со вкусом: фон цвета вкуса, фрукт
  const vapeShot = (f, f2, fruit, label) => sh(D_.rr(-200, -200, 400, 400, 0), f2) + g(vape(0, { f, f2, label, fruit: false, c: C.ink }), at(-50, 10, .52, -8)) + g(fruit, at(90, 30, 1));
  // ведро-ведёрко
  const pail = (gold = 0) => line('M-60 -60C-60 -130 60 -130 60 -60', 1, { c: C.ink, w: 7 }) + sh('M-70 -60L-54 60H54L70 -60Z', '#9AA6B8', { c: C.ink, w: 6 }) + sh('M20 -60L30 60H54L70 -60Z', '#7E8A9C') + (gold ? sh(D_.ell(0, -60, 70 * gold, 14 * gold), '#FFC93C', { c: C.ink, w: 4 }) : '');
  // ноутбук
  function laptop(t, o = {}) {
    let s = sh('M-300 -300H300V60H-300Z', '#2B2F3A', { c: C.ink, w: 7 }) + sh('M-270 -272H270V34H-270Z', o.scr || '#3A3358');
    s += sh('M-360 60H360L330 100H-330Z', '#4B5160', { c: C.ink, w: 7 });
    if (o.inner) s += clip('M-270 -272H270V34H-270Z', o.inner);
    return g(s, at(o.x || 0, o.y || 0, o.s || 1, o.r || 0))
  }
  // мусорка
  const trash = (x, y, s = 1, lid = 0) => g(sh('M-70 -40L-56 110H56L70 -40Z', '#9AA6B8', { c: C.ink, w: 6 }) + line('M-30 -10L-24 80M0 -10V80M30 -10L24 80', 1, { c: C.ink, w: 5, op: .6 }) + g(sh(D_.rr(-84, -64, 168, 26, 8), '#7E8A9C', { c: C.ink, w: 6 }) + sh(D_.rr(-22, -84, 44, 22, 8), '#7E8A9C', { c: C.ink, w: 5 }), `rotate(${R(-lid * 35)} -84 -50)`), at(x, y, s));
  // конфетти: плотные прямоугольнички (без прозрачности)
  function confetti(t, t0, o = {}) {
    if (t < t0) return ''; let s = '';
    for (let i = 0; i < (o.n || 40); i++) { const k = (t - t0) * (.5 + rnd(i) * .5), x = rnd(i + 3) * 1080 + Math.sin(t * 3 + i) * 30, y = -60 + k * (500 + rnd(i + 7) * 500); if (y > 1960) continue; s += sh(D_.rr(-12, -6, 24, 12, 3), [C.a1, C.a2, C.a3, C.paper, C.mango][i % 5], { tr: `translate(${R(x)} ${R(y)}) rotate(${R(t * 300 * (rnd(i + 1) - .5) + i * 40)})` }) }
    return s
  }
  // табличка «НЕ КУРИТЬ»
  const noSmoke = (x, y, s = 1) => g(sh(D_.circ(0, 0, 120), '#FFFFFF', { c: C.ink, w: 7 }) + g(cigarette(0, { len: 170, h: 30, c: C.ink, ember: 1 }), at(0, 0, 1)) + `<circle r="100" fill="none" stroke="${C.a2}" stroke-width="20"/><path d="M-70 -70L70 70" stroke="${C.a2}" stroke-width="20" stroke-linecap="round"/>`, at(x, y, s));
  // карта-лист для «войны»
  const mapLeaf = () => leafT({ len: 1500, w: 620, c: C.ink, ow: 8, vw: 6, dots: false, f: '#8CC66A', f2: '#76B254' });

  // ===== 1. на доску прикалывают лист: «ЧТО ВЫ ЗНАЕТЕ О» печатается, «НИКОТИНЕ?» — красным =====
  D.title = (t, S, T) => {
    let s = cw(t);
    s += thread(820, 620, 1300, 300, E(t, .9, .5, 'o5'), { sag: 50 }) + thread(260, 640, -200, 1100, E(t, 1.0, .5, 'o5'), { sag: 40 });
    s += pop(sh(D_.rr(-470, -230, 940, 460, 6), 'rgba(0,0,0,.25)', { tr: 'translate(14 16)' }) + sh(D_.rr(-470, -230, 940, 460, 6), C.paper, { c: C.ink, w: 5 }) + line('M-410 -120H410M-410 140H410', 1, { c: '#D9CBB0', w: 3 }), 540, CY - 40, t, .02, { s: 1, r: -3, r0: 10, from: 1.3, f: 'back', snd: 'pin' });
    s += g(typeCap('Что вы знаете о', 540, CY - 120, t, .15, { c: C.ink, s: 36, ls: 9, d: .35 }) + dropWord('НИКОТИНЕ?', 540, CY + 40, t, .35, { s: 94, c: C.a2 }), about(540, CY, 1, -3));
    s += pop(pushpin(0, 0, C.a2, 1.6), 540, CY - 250, t, .12, { snd: false });
    return g(s, drift(t, T, .05))
  };

  // ===== 2. «Что он есть в сигаретах и в каждой одноразке?»: стикер НИКОТИН, два полароида, нитки =====
  D.common = (t, S, T) => {
    const tc = T.c('сигаретах') - .2, tv = T.c('одноразке') - .2;
    let s = cw(t, 2);
    s += thread(540, 420, 300, 840, E(t, tc + .2, .4, 'o5'), { sag: 30 }) + thread(540, 420, 780, 880, E(t, tv + .2, .4, 'o5'), { sag: 30 });
    s += pop(sticky(['НИКОТИН'], 0, 0, { sz: 50, w: 320 }), 540, 420, t, T.a, { r: -4, snd: 'pin' });
    s += pop(polaroid(g(cigarette(t, { len: 300, h: 50, c: C.ink }), at(0, 0, 1, -18)) + curl(120, -40, t, 120, C.paper, 5), 0, 0, { bg: '#3A3358', cap: 'сигареты' }), 300, 900, t, tc, { r: -7, snd: 'pin' });
    s += pop(polaroid(g(vape(t, { c: C.ink }), at(0, 10, .55, 10)), 0, 0, { bg: '#3A3358', cap: 'одноразки' }), 780, 940, t, tv, { r: 6, snd: 'pin' });
    return g(s, drift(t, T, .05, 540, 700))
  };

  // ===== 3. «А знаете ли вы, что одноразки придумала тля?»: чертёж рисуется, автор — тля в очках =====
  D.claim = (t, S, T) => {
    const tp = T.c('придумала') - .2, ta = T.c('тля') - .15;
    let s = BG('#1E4E8C') + blueprint(-40, -40, 1160, 2000);
    const VP = D_.rr(-130, -340, 260, 680, 90), MP = 'M-90 -340L-70 -470H70L90 -340', WIN = D_.rr(-90, -200, 180, 290, 24);
    s += g(line(VP, E(t, T.a, .9, 'o'), { c: '#EAF2FF', w: 7 }) + line(MP, E(t, T.a + .3, .5, 'o'), { c: '#EAF2FF', w: 7 }) + line(WIN, E(t, T.a + .5, .6, 'o'), { c: '#EAF2FF', w: 5 }) + line(D_.circ(0, 230, 22), E(t, T.a + .7, .4), { c: '#EAF2FF', w: 5 }) +
      dimLine(-230, -340, -230, 340, '68 мм', E(t, T.a + .6, .4, 'o')) + dimLine(-130, 420, 130, 420, '26 мм', E(t, T.a + .8, .4, 'o'), { ly: 40 }), at(470, 760, 1, -4));
    cue(T.a + .1, 'draw', .6);
    // штамп-рамка внизу справа
    s += g(sh(D_.rr(-230, -90, 460, 180, 0), '#1E4E8C', { c: '#EAF2FF', w: 5 }) + line('M-230 -20H230M-60 -90V-20', 1, { c: '#EAF2FF', w: 4 }) + tx('ОДНОРАЗКА', -145, -42, { f: 'O', w: 500, s: 30, c: '#EAF2FF' }) + tx('ЧЕРТЁЖ', 85, -42, { f: 'O', w: 500, s: 30, c: '#EAF2FF' }) + typeCap('Автор:', -200, 52, t, tp, { c: '#EAF2FF', s: 34, ls: 3, a: 'start', d: .3 }), at(760, 1170, 1, -4));
    // тля выглядывает снизу, поправляет очки
    const kA = P01(t, ta, .55), ay = lerp(1900, 1130, EZ.back(kA));
    if (kA > 0) s += aphidX(t, { x: 280, y: ay, s: 2.2, glasses: true, smirk: t > ta + .5, lid: t > ta + .8 ? .35 : 0, c: C.ink, r: -6 });
    if (t > ta + .35) s += g(tx('Тля', 0, 0, { f: 'U', w: 800, s: 70, c: C.a1 }), at(780, 1236, EZ.back(P01(t, ta + .35, .4)), -6)) + line('M680 1255Q760 1290 860 1250', E(t, ta + .45, .3, 'o'), { c: C.a1, w: 7 });
    s += flashF(t, T.a + .03, C.paper);
    return g(s, drift(t, T, .04))
  };

  // ===== 4. «Триста лет люди травили тлю никотином»: карта-лист, войска тли, лейка поливает, годы бегут =====
  const TROOPS = []; for (let r = 0; r < 5; r++) for (let c0 = 0; c0 < 6; c0++) TROOPS.push([240 + c0 * 120 + (r % 2) * 60, 760 + r * 110]);
  function warMap(t, T, y0, y1, killAt, o = {}) {
    let s = BG('#2F4A3A') + stripes('#34503F', 26, 90, 0, 0) + g(mapLeaf(), at(540, 1500, 1, 0));
    // красные стрелки атаки
    s += line('M180 420C300 500 340 620 330 720', E(t, T.a + .2, .5, 'o5'), { c: C.a2, w: 14 }) + line('M300 690L330 728L366 694', E(t, T.a + .6, .2), { c: C.a2, w: 14 });
    if (!o.hide) TROOPS.forEach(([x, y], i) => { const kk = P01(t, killAt + i * .045, .4); s += kk > 0 ? g(aphidX(t, { s: .3, helmet: true, c: C.ink, mood: 'o' }), `translate(${x} ${R(y + kk * 30)}) rotate(${R(kk * 180)} 0 -10)`) : aphidX(t, { x, y: y + bob(t, 3, 1.2, i * .3), s: .3, helmet: true, c: C.ink }) });
    if (o.can !== false) { const cr = o.canR ?? 28; s += g(line('M-120 -120C-130 -230 60 -240 70 -120', 1, { c: C.ink, w: 12 }) + sh('M70 -40L250 -150L262 -132L96 0Z', '#5B6F86', { c: C.ink, w: 6 }) + sh('M-140 -120H100L110 120H-150Z', '#6E86A3', { c: C.ink, w: 7 }) + sh('M-140 -60H104V40H-144Z', C.paper, { c: C.ink, w: 4 }) + tx('NICOTINE', -20, 6, { f: 'O', w: 700, s: 36, c: C.a2 }), at(o.canX ?? 250, o.canY ?? 420, 1, cr)); if (o.drip !== 0) for (let i = 0; i < 10; i++) { const ph = (t * 1.5 + i / 10) % 1; s += sh(D_.drop(470 + ph * 120 + Math.sin(i) * 20, 330 + ph * 520, 14), '#8A5C2E', { c: C.ink, w: 3, op: o.drip ?? 1 }) } }
    s += g(sh(D_.rr(-170, -78, 340, 156, 12), C.paper, { c: C.ink, w: 6 }) + odo(lerp(y0, y1, o.yk ?? 0), 0, 46, { s: 104, c: C.ink, sep: '' }), at(820, 300, 1, 4));
    return s
  }
  D.war = (t, S, T) => {
    const t3 = T.c('Триста') - .1;
    return g(warMap(t, T, 1690, 1990, T.a + 1.0, { yk: E(t, t3, T.b - t3 + .4, 'io') }), drift(t, T, .05))
  };
  // ===== 5. «В 2009 Евросоюз запретил никотин как пестицид. Тля победила.» =====
  D.ban = (t, S, T) => {
    const tY = T.c('2009') - .2, tE = T.c('Евросоюз') - .25, tB = T.c('запретил') - .1, tw0 = T.c('победила') - .3;
    const hit = P01(t, tE + .45, .6), rollX = lerp(1400, 420, EZ.o(P01(t, tE, .55)));
    let s = warMap(t, T, 1990, 2009, -9, { yk: E(t, tY, .7, 'io'), canX: 250 - hit * 600, canY: 420 - Math.sin(hit * PI) * 200, canR: 28 - hit * 200, drip: 1 - clamp(hit * 4), hide: t > tw0 });
    if (P01(t, tE, .1) > 0) { s += euDisc(rollX, 560, 150, 1, { f: C.eu, sc: C.star, rot: -lerp(0, 600, EZ.o(P01(t, tE, .55))) }); cue(tE, 'roll', .7) }
    s += stamp('ЗАПРЕЩЕНО', 540, 360, t, tB, { c: C.a2, s: 84, r: -10 });
    if (t > tw0) {
      [[300, 900, -1], [540, 860, 1], [780, 920, -1], [420, 1070, 1], [660, 1080, -1]].forEach(([x, y, d], i) => { const jp = Math.abs(Math.sin((t - tw0) * 7 + i)) * 50; s += pop(aphidX(t, { s: 1, helmet: true, mood: 'smile', flag: [C.a1, C.a2, C.paper][i % 3], c: C.ink, flipX: d < 0 }), x, y - jp, t, tw0 + i * .06, { s: .62, snd: i ? false : 'pop' }) });
      s += confetti(t, tw0, { n: 50 }); cue(tw0, 'cheer', .7);
    }
    return g(s, `translate(${R(shake(t, tB + .15, 16))} 0)`)
  };

  // ===== 6. «Но не простила»: тля медленно поворачивается, прищур; на фото человека — красный крест =====
  D.grudge = (t, S, T) => {
    const tp = T.c('простила') - .2, z = 1 + .22 * E(t, T.a, T.b - T.a + .3, 'io');
    let s = BG(C.bg) + g(rays(540, 820, 16, C.bg2, 0), about(540, 820, 2 - z * .8)) + g(sh(D_.circ(540, 820, 520), C.bg2), about(540, 820, 2 - z * .8));
    s += polaroid(g(person1(0, 40, 2.4, C.paper), at(0, 0, 1)), 820, 470, { bg: '#5B6F86', cap: 'люди', r: 8, s: .9 });
    if (t > tp) { s += line('M700 330L940 560', E(t, tp, .2, 'o'), { c: C.a2, w: 20 }) + line('M940 330L700 560', E(t, tp + .15, .2, 'o'), { c: C.a2, w: 20 }); cue(tp, 'marker', .8) }
    s += g(aphidX(t, { s: 1, lid: .5, brow: 1, c: C.ink, marker: t > tp - .3 ? -30 : null }), `translate(470 1060) scale(${R(2.9 * z * 1000) / 1000})`);
    cue(T.a, 'dun', .9);
    return s
  };

  // ===== 7. «Тля рождается уже беременной. Внутри её дочек сидят внучки»: матрёшка, камера влетает внутрь =====
  function nest(t, lvl, o = {}) {
    let s = aphidX(t, { c: C.ink, mood: lvl ? 'calm' : 'calm', blink: lvl ? 1 : undefined });
    if (lvl < 3) { s += sh(D_.ell(-6, -14, 70, 56), '#E4F5CF', { c: C.ink, w: 6 }); s += g(nest(t, lvl + 1), `translate(-10 -6) scale(.32)`) }
    return s
  }
  D.born = (t, S, T) => {
    const td = T.c('дочек') - .2, tv = T.c('внучки') - .2;
    const e1 = E(t, td - .6, 1.3, 'io'), e2 = E(t, tv - .45, 1.0, 'io'), z = Math.pow(1 / .32, e1 + e2);
    let s = BG('#CFE6B5') + rays(540, CY, 18, '#C2DEA3', t * 8);
    // мать в (540, 920) ×3.2; дочка — в её животе (≈ −10,−9), внучка — в животе дочки; камера влетает туда
    const M = [540, 920], Dd = [540 - 10 * 3.2, 920 - 9 * 3.2], Gg = [540 - 13.2 * 3.2, 920 - 8.9 * 3.2];
    const fx = lerp(lerp(M[0], Dd[0], e1), Gg[0], e2), fy = lerp(lerp(M[1], Dd[1], e1), Gg[1], e2);
    s += g(g(nest(t, 0), at(540, 920, 3.2)), `translate(540 ${CY}) scale(${R(z * 1000) / 1000}) translate(${R(-fx)} ${R(-fy)})`);
    s += pop(pill('БЕРЕМЕННА', 0, 0, { f: C.a2, s: 46 }), 540, 330, t, T.c('беременной') - .2, { r: -5, out: td - .2 });
    s += pop(pill('ДОЧКА', 0, 0, { f: C.a2, s: 46 }), 540, 330, t, td + .3, { r: 4, out: tv - .1 });
    s += pop(pill('ВНУЧКА', 0, 0, { f: C.a2, s: 46 }), 540, 330, t, tv + .2, { r: -4 });
    return s
  };

  // ===== 8. «За одно лето одна тля в теории даёт миллиарды потомков»: удвоение, камера отъезжает =====
  D.army = (t, S, T) => {
    const t1 = T.c('одна') - .2, tb = T.c('миллиарды') - .2;
    const gen = clamp((t - t1 - .4) / 1.6) * 10, n = Math.min(1024, Math.floor(Math.pow(2, gen)));
    const z = 1 / Math.pow(1.36, Math.min(10, gen));
    let s = BG('#CFE6B5') + stripes('#C2DEA3', 40, 120, 20, t * 30);
    let w = '';
    const side = Math.ceil(Math.sqrt(n)), sp = 250;
    for (let i = 0; i < n; i++) { const r = Math.floor(i / side), c0 = i % side, x = (c0 - (side - 1) / 2) * sp, y = (r - (Math.ceil(n / side) - 1) / 2) * sp * .8; w += aphU(x, y, 1, (rnd(i) - .5) * 20, rnd(i + 5) < .5) }
    for (let i = 1; i < 10; i++) cue(t1 + .4 + i * .16, 'pop', .45, (rnd(i) - .5));
    s += g(w, `translate(540 ${CY}) scale(${R(z * 1.9 * 1000) / 1000})`);
    s += g(sh(D_.rr(-380, -90, 760, 180, 20), C.paper, { c: C.ink, w: 7 }) + odo(lerp(1, 1e9, Math.pow(E(t, tb - .3, 1.2, 'i'), 3)), 0, 50, { s: 110, c: C.ink, sep: ' ', post: '+' }), at(540, 330, 1, -3), E(t, t1 + .2, .3));
    return s
  };

  // ===== 9. «А когда им тесно, у них вырастают крылья. Армия готова»: толпа жмётся, крылья, взлёт клином =====
  D.wings = (t, S, T) => {
    const tt = T.c('тесно') - .2, tw0 = T.c('крылья') - .25, tg = T.c('Армия') - .2;
    const fly = E(t, tg, 1.6, 'io');
    let s = BG(lerp(0, 1, fly) > .5 ? C.sky2 : '#CFE6B5');
    s += sh(D_.rr(-100, -100, 1280, 2120, 0), '#F7B267', { op: fly }) + sh(D_.circ(540, 1500 - fly * 300, 380), '#F28C5B', { op: fly });
    let w = '';
    const N = 40, sq = t > tt ? Math.sin((t - tt) * 30) * 4 * (1 - fly) : 0;
    for (let i = 0; i < N; i++) {
      const r = Math.floor(i / 8), c0 = i % 8, bx = (c0 - 3.5) * 120 + (r % 2) * 40, by = (r - 2) * 105;
      const j = Math.floor(i / 2) + 1, sd = i % 2 ? 1 : -1, vx = sd * j * 52 - (i === 0 ? 52 : 0), vy = j * 46 - 1150;  // клин в небе
      const k = clamp(fly * 1.4 - rnd(i) * .4), x = lerp(bx, vx, EZ.io(k)) + rnd(i) * sq, y = lerp(by, vy, EZ.io(k)) + rnd(i + 2) * sq;
      const kw = P01(t, tw0 + rnd(i + 4) * .5, .25);
      if (kw > 0) { const fl = Math.sin(t * 30 + i) * 22; w += wingU(x - 20, y - 70, .5 * EZ.back(kw), -150 - fl) }
      w += aphU(x, y, .5, k * -20);
      if (kw > 0) { const fl = Math.sin(t * 30 + i) * 22; w += wingU(x - 20, y - 70, .5 * EZ.back(kw), -130 + fl) }
      if (i === 0 && kw > 0) cue(tw0, 'flutter', .8);
    }
    s += g(w, `translate(540 ${R(lerp(1000, 1500, fly))}) scale(${R(lerp(1.3, .9, fly) * 1000) / 1000})`);
    if (fly > 0) cue(tg, 'whoosh', .8);
    s += pop(stamp('АРМИЯ ГОТОВА', 0, 0, t, tg + .3, { c: C.a2, s: 70, r: -8 }), 540, 400, t, tg + .3, { snd: false });
    return s
  };

  // ===== 10. «Муравьи пасут тлю, как коров. И доят — ради сладких капель» =====
  D.ants = (t, S, T) => {
    const tk = T.c('коров') - .2, td = T.c('доят') - .2, tc = T.c('капель') - .3;
    let s = BG('#BFE3F2') + sh(D_.circ(860, 330, 110), '#FFE08A', { c: C.ink, w: 6 }) + cloud(250, 300, .7, { c: C.ink, w: 9 }) + sh('M-100 860Q300 760 700 840T1200 820V2000H-100Z', C.grass, { c: C.ink, w: 7 }) + sh('M-100 1060Q400 980 1200 1080V2000H-100Z', '#8CC66A');
    // забор
    for (let i = 0; i < 6; i++) s += sh(D_.rr(40 + i * 190, 720, 26, 170, 6), '#B57A45', { c: C.ink, w: 5 });
    s += sh(D_.rr(0, 760, 1080, 22, 6), '#B57A45', { c: C.ink, w: 5 }) + sh(D_.rr(0, 820, 1080, 22, 6), '#B57A45', { c: C.ink, w: 5 });
    // тля-«коровы» с колокольчиками
    [[300, 1010, .9, 0], [780, 960, .8, 1], [520, 1180, 1.05, 2]].forEach(([x, y, sc, i]) => { const gr = Math.sin(t * 3 + i) * 4; s += aphidX(t, { x, y, s: sc, c: C.ink, r: gr, mood: t > td && i === 2 ? 'relief' : 'calm' }) + g(sh('M-16 0H16L22 34H-22Z', C.a1, { c: C.ink, w: 4 }) + sh(D_.circ(0, 40, 6), C.ink), at(x + 90 * sc, y + 10 * sc, sc, Math.sin(t * 6 + i) * 14)) });
    if (t > tk) cue(tk + .1, 'cowbell', .8);
    // муравей в шляпе с ведром
    const kx = E(t, T.a, 1.0, 'o5'), mx = lerp(1300, 820, kx);
    s += ant(t, { x: mx, y: 1230, s: 1.25, hat: true, walk: kx < 1, c: C.ink, flipX: true });
    s += g(pail(E(t, tc + .3, .5)), at(mx - 260, 1240, .8));
    // доит: усик гладит тлю, капля падает в ведро
    if (t > td) { const k = ((t - td) % 1.1) / 1.1; s += sh(D_.drop(0, 0, 30), '#FFC93C', { c: C.ink, w: 5, tr: `translate(${R(lerp(640, mx - 260, k))} ${R(lerp(1150, 1180, k) - Math.sin(k * PI) * 120)})` }); if (k < .05) cue(t - k * 1.1, 'drip', .6) }
    s += pop(pill('СЛАДКИЕ КАПЛИ', 0, 0, { f: '#FFC93C', tc: C.ink, s: 44 }), 540, 470, t, tc, { r: -4 });
    return g(s, drift(t, T, .04))
  };

  // ===== 11. «Тля давно поняла: за сладкое сделают всё»: тля в очках пишет стикер и прикалывает =====
  D.sweet = (t, S, T) => {
    const tn = T.c('поняла') - .2, ts = T.c('сладкое') - .2;
    let s = cw(t, 3);
    s += pop(polaroid(g(ant(t, { s: .8, hat: true, c: C.ink, flipX: true }), at(80, 120, 1)) + g(pail(1), at(-100, 110, .5)), 0, 0, { bg: '#BFE3F2', cap: 'муравьи' }), 300, 520, t, T.a, { r: -6 });
    s += thread(300, 340, 740, 420, E(t, ts + .4, .4, 'o5'), { sag: 50 });
    const kw = P01(t, tn, .4);
    s += pop(sticky(['СЛАДКОЕ', '= ВЛАСТЬ'], 0, 0, { sz: 50, w: 360 }), 740, 560, t, ts, { r: 5, snd: 'pin' });
    s += aphidX(t, { x: 560, y: lerp(1500, 1180, EZ.back(kw)), s: 2.1, glasses: true, lid: .3, smirk: true, c: C.ink, marker: -50 + Math.sin(t * 12) * 8 });
    if (t > tn) cue(tn, 'marker', .5);
    return g(s, drift(t, T, .05))
  };

  // ===== 12. «Теперь посмотрите на вкусы одноразок. Манго. Арбуз. Сладкая вата» =====
  D.flavor = (t, S, T) => {
    const tm = T.c('Манго') - .15, ta = T.c('Арбуз') - .15, tv = T.c('Сладкая') - .15;
    let s = cw(t, 4);
    s += pop(sticky(['СЛАДКОЕ'], 0, 0, { sz: 50, w: 300 }), 540, 330, t, T.a, { r: -3 });
    const shots = [[tm, 250, 770, -7, vapeShot(C.mango, '#F7D9A8', mango(0, 0, .6, { c: C.ink }), 'МАНГО'), 'манго'], [ta, 800, 820, 6, vapeShot('#E2574C', '#F6C1BB', melon(0, 0, .7), 'АРБУЗ'), 'арбуз'], [tv, 520, 1150, -3, vapeShot('#F28DB2', '#FBD9E7', candy(0, -20, .8), 'ВАТА'), 'сладкая вата']];
    shots.forEach(([t0, x, y, r, inner, capt]) => { s += thread(540, 400, x, y - 210, E(t, t0 + .2, .4, 'o5'), { sag: 40 }) + pop(polaroid(inner, 0, 0, { cap: capt, bg: '#3A3358' }), x, y, t, t0, { r, s: .82, snd: 'pin' }) });
    // лупа: въезжает на «посмотрите» и перебегает к каждой фотке
    const tl = T.c('посмотрите') - .2, kl = E(t, tl, .5, 'o5');
    if (kl > 0) {
      const K = [[tl, 1300, 1500], [tl + .5, 640, 980], [tm, 250, 800], [ta, 800, 850], [tv, 520, 1180]];
      let i = 0; while (i < K.length - 1 && t >= K[i + 1][0]) i++;
      const a = K[i], b = K[Math.min(i + 1, K.length - 1)], k = b[0] > a[0] ? E(t, a[0], .35, 'io5') : 1;
      const mx = lerp(a[1], b[1], i < K.length - 1 && t > b[0] - .35 ? E(t, b[0] - .35, .35, 'io5') : 0), my = lerp(a[2], b[2], i < K.length - 1 && t > b[0] - .35 ? E(t, b[0] - .35, .35, 'io5') : 0);
      s += g(line('M100 100L230 230', 1, { c: C.ink, w: 40 }) + line('M100 100L230 230', 1, { c: '#6B3A1E', w: 26 }) + `<circle r="130" fill="none" stroke="${C.ink}" stroke-width="40"/><circle r="130" fill="none" stroke="#2B2F3A" stroke-width="24"/>` + `<path d="M-80 -40A90 90 0 0 1 -20 -96" stroke="#fff" stroke-width="12" stroke-linecap="round" fill="none" opacity=".7"/>`, at(mx + 30, my + 40, 1, -10));
    }
    return g(s, drift(t, T, .05, 540, 760))
  };

  // ===== 13. «Никотином травили тлю. Теперь его, сладкий, вдыхаете вы»: яд → одноразка, человек выдыхает манго, тля показывает на вас =====
  const BOT = 'M-90 -60C-90 -120 -50 -140 -40 -170V-230H40V-170C50 -140 90 -120 90 -60V220C90 250 70 266 40 266H-40C-70 266 -90 250 -90 220Z', VP2 = D_.tf(D_.rrp(170, 440, 58), 0, 0, 0);
  D.revenge = (t, S, T) => {
    const tn = T.c('Теперь') - .2, tv = T.c('вдыхаете') - .2, ty = T.c('вы.') - .1;
    const km = E(t, tn, .5, 'io');
    let s = BG(C.bg) + rays(540, 700, 18, C.bg2, t * 9);
    let obj;
    if (km <= 0) obj = g(sh(BOT, '#6B3A1E', { c: C.ink, w: 7 }) + sh(D_.rr(-74, -10, 148, 190, 12), C.paper, { c: C.ink, w: 5 }) + sh(D_.circ(0, 60, 34), C.ink) + tx('ЯД', 0, 30, { f: 'O', w: 700, s: 34, c: C.a2 }), '');
    else if (km < 1) { cue(tn, 'morph', .7); obj = sh(morph(BOT, VP2, km), km < .5 ? '#6B3A1E' : C.mango, { c: C.ink, w: 7 }) }
    else obj = vape(t, { c: C.ink });
    s += g(obj, at(lerp(540, 300, E(t, tv - .3, .6, 'io')), 640, lerp(1.4, .9, E(t, tv - .3, .6, 'io')), Math.sin(t * 3) * 3));
    if (km <= 0) s += aphidX(t, { x: 820, y: 1060, s: 1.2, mood: 'o', sweat: (t * .8) % 1, c: C.ink, flipX: true });
    const kf = P01(t, tv - .2, .5);
    if (kf > 0) { s += pop(face2(t, { s: 1, puff: Math.sin(clamp((t - tv) / 1.2) * PI), c: C.ink }), 640, 860, t, tv - .2, { s: 1.05, snd: false }); const kc = P01(t, tv + .1, 1.2); if (kc > 0 && kc < 1) s += g(cloud(0, 0, 1, { f: C.mango, c: C.ink, w: 8 }), at(lerp(900, 980, kc), lerp(1000, 760, EZ.o(kc)), .25 + kc * .4)) }
    if (t > ty) s += pop(aphidX(t, { glasses: true, lid: .35, smirk: true, c: C.ink }) + sh('M150 -40L250 -64L246 -40L150 -16Z', C.aph, { c: C.ink, w: 5 }), 200, 1220, t, ty, { s: 1.2, r: -8 });
    return g(s, drift(t, T, .04))
  };

  // ===== 14. «Совпадение? Не думаю.»: камера отъезжает — вся доска, всё связано нитками =====
  const BOARD = [[540, 900, 'aph'], [180, 560, 'cig'], [900, 560, 'vape'], [180, 1280, 'eu'], [900, 1260, 'ant'], [540, 1500, 'mango'], [540, 330, 'sweet'], [140, 920, 'melon'], [940, 920, 'candy']];
  function boardItem(t, k) {
    if (k === 'aph') return polaroid(aphidX(t, { x: 20, y: 80, s: 1.15, glasses: true, lid: .35, smirk: true, c: C.ink }), 0, 0, { bg: '#CFE6B5', cap: 'ТЛЯ', pinC: C.a2 });
    if (k === 'cig') return polaroid(g(cigarette(t, { len: 300, h: 50, c: C.ink }), at(0, 0, 1, -18)), 0, 0, { bg: '#3A3358', r: -6 });
    if (k === 'vape') return polaroid(g(vape(t, { c: C.ink }), at(0, 10, .55, 10)), 0, 0, { bg: '#3A3358', r: 5 });
    if (k === 'eu') return polaroid(euDisc(0, 0, 120, 1, { f: C.eu, sc: C.star }), 0, 0, { bg: '#2F4A3A', cap: '2009', r: 4 });
    if (k === 'ant') return polaroid(g(ant(t, { s: .8, hat: true, c: C.ink, flipX: true }), at(80, 120, 1)), 0, 0, { bg: '#BFE3F2', r: -5 });
    if (k === 'mango') return polaroid(mango(0, 0, 1.2, { c: C.ink }), 0, 0, { bg: '#F7D9A8', r: 3 });
    if (k === 'sweet') return sticky(['СЛАДКОЕ', '= ВЛАСТЬ'], 0, 0, { sz: 46, w: 320 });
    if (k === 'melon') return polaroid(melon(0, 40, 1.1), 0, 0, { bg: '#F6C1BB', r: -4 });
    if (k === 'candy') return polaroid(candy(0, -10, 1.1), 0, 0, { bg: '#FBD9E7', r: 6 });
    return ''
  }
  D.coinc = (t, S, T) => {
    const tn = T.c('Не') - .15, z = lerp(2.6, .8, E(t, T.a - .1, 1.3, 'io5'));
    let s = cork(0, 0);
    let w = '';
    BOARD.slice(1).forEach(([x, y], i) => { w += thread(540, 760, x, y - 180, 1, { sag: 30 }) });
    BOARD.forEach(([x, y, k], i) => { w += g(boardItem(t, k), at(x, y, .8)) });
    s += g(w, `translate(540 ${CY + 40}) scale(${R(z * 1000) / 1000}) translate(-540 -930)`);
    s += pop(sticky(['СОВПАДЕНИЕ?'], 0, 0, { sz: 54, w: 520, f: '#FFFFFF' }), 540, 360, t, T.a + .1, { r: -4, snd: 'pin' });
    s += stamp('НЕ ДУМАЮ', 540, 1150, t, tn, { c: C.a2, s: 92, r: -9 });
    return s
  };

  // ===== 15. «Каждый год табак убивает больше 7 миллионов человек» — серьёзно, без шуток =====
  D.toll = (t, S, T) => {
    const t7 = T.c('7') - .2, z = lerp(2.3, .62, E(t, T.a, T.b - T.a + .3, 'io'));
    let s = BG('#121020');
    const cols = 15, rows = 22;
    let w = '';
    for (let r = 0; r < rows; r++) for (let c0 = 0; c0 < cols; c0++) {
      const i = r * cols + c0, x = c0 * 92 - (cols - 1) * 46, y = r * 104 - (rows - 1) * 52, dd = Math.hypot(x, y), k = P01(t, T.a + dd / 2600, .35), dead = t > t7 + .3 + rnd(i) * 1.8 && rnd(i + 9) < .45;
      if (k > 0) w += g(person1(0, 0, 1, dead ? '#4A2A38' : C.paper), at(x, y, .9 * EZ.back(k)));
    }
    s += g(w, `translate(540 ${CY - 40}) scale(${R(z * 1000) / 1000})`);
    s += sh(D_.rr(0, 1110, 1080, 220, 0), '#121020');
    s += g(odo(7000000 * E(t, t7, 1.1, 'o5'), 540, 1260, { s: 130, c: C.a2, post: '+', sep: ' ' }), '', E(t, t7 - .25, .3));
    if (t > t7) cue(t7, 'count', .6);
    return s
  };

  // ===== 16. «Тля не курит»: сок с трубочкой, табличка «не курить», моргает =====
  D.nosmoke = (t, S, T) => {
    const tk = T.c('курит') - .2;
    let s = BG('#CFE6B5') + rays(540, 900, 18, '#C2DEA3', t * 6) + sh(D_.circ(540, 900, 380), '#BEDDA0');
    s += g(leafT({ len: 900, w: 340, c: C.ink, ow: 6, vw: 5, f: '#8CC66A', f2: '#6FAF55', dots: false }), at(300, 1560, 1, 62));
    s += aphidX(t, { x: 470, y: 1020, s: 2.4, juice: true, mood: 'calm', c: C.ink, lid: t > tk + .3 ? .5 : 0 });
    s += pop(noSmoke(0, 0, 1), 760, 430, t, T.a + .05, { r: 8 });
    if (t > tk) cue(tk + .3, 'slurp', .7);
    return g(s, drift(t, T, .05, 540, 900))
  };

  // ===== 17. «Подписывайтесь, пока тля не удалила это видео»: тля за ноутбуком тащит ролик в корзину =====
  D.end = (t, S, T) => {
    const tp = T.c('пока') - .2, td = T.c('удалила') - .2;
    let s = BG(C.bg) + rays(540, 700, 18, C.bg2, t * 6);
    const pr = clamp((t - td) / 2.2);
    const inner = cork(80, 40, { f: '#C68B59' }) + g(polaroid(aphidX(t, { x: 20, y: 80, s: 1.1, glasses: true, c: C.ink }), 0, 0, { bg: '#CFE6B5' }), at(0, -120, .62)) + sh(D_.rr(-240, -40, 480, 50, 25), C.ink) + sh(D_.rr(-236, -36, 472 * pr + 1, 42, 21), C.a2) + tx(pr > 0 ? 'Удаляю видео… ' + Math.floor(pr * 100) + '%' : '▶ Что вы знаете о никотине?', 0, -64, { f: 'M', w: 800, s: 28, c: C.ink });
    s += laptop(t, { x: 540, y: 720, s: 1.2, inner: g(inner, 'translate(0 -100)') });
    s += trash(980, 700, 1, E(t, td, .3, 'o5'));
    s += aphidX(t, { x: 300, y: 1170, s: 1.6, glasses: true, lid: .35, smirk: true, c: C.ink, flipX: false, r: -4 });
    if (t > td) cue(td, 'click', .7);
    const kf = P01(t, tp, .5);
    if (kf > 0) { s += g(sh(D_.rr(-260, -60, 520, 120, 60), C.a2, { c: C.ink, w: 6 }) + tx('ПОДПИСАТЬСЯ', 0, 15, { f: 'M', w: 800, s: 42, c: C.paper, ls: 4 }), at(540, 280, EZ.back(kf) * (1 + .04 * Math.sin(t * 8)))); cue(tp, 'pop', .8) }
    s += cap('это шутка · факты настоящие', 540, 1270, { c: '#A9A3C8', s: 26, ls: 4, op: E(t, T.b - 1.6, .4) });
    return s
  };

  window.EP = {
    P: C, D, clean: true, lead: .2, defs: () => APH,
    tr: { title: 'whip', common: 'thru', claim: 'whip', war: 'cut', ban: 'zc', grudge: 'thru', born: 'zc', army: 'cut', wings: 'band', ants: 'whipL', sweet: 'whip', flavor: 'zc', revenge: 'out', coinc: 'zc', toll: 'fade', nosmoke: 'whipU' },
    trAt: { common: [780, 900], ban: [540, 860], grudge: [500, 1000], born: [540, CY], flavor: [520, 1150], revenge: [200, 1200], coinc: [540, 1150] },
    trR: { common: 150, grudge: 110 },
    trBg: { common: '#1E4E8C', grudge: '#CFE6B5' },
    trCol: { common: C.ink, ban: C.bg, grudge: C.ink, born: '#CFE6B5', wings: C.a2, flavor: C.bg, revenge: C.paper, coinc: '#121020' },
    trCol2: { wings: C.a1 },
    cap: { hi: C.a1, st: C.ink },
  };
})();
