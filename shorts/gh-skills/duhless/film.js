// «Духless» EN · A/B-тест «только GitHub-скиллы» (26.11).
// Стиль — lemo-opuscar «60s Spy Title Sequence» (бумага, 4 краски, силуэты, титры как декорации, склейки на ударах меди).
// Модули бумаги, букв и силуэтов — код демо spy-titles (MIT), переложенный в 1080×1920: paper9.js, glyph9.js, chars9.js.
// Кинетическая типографика — huashu-art-motion, грамматика y5: главное слово «падает» 1.7→1 недодемпфированной пружиной
//   1−e^(−10t)·cos(2π·2.2t), второстепенное поднимается из прорези (expoOut 0.3 с), цифры выскакивают (backOut).
// Хореография — Emil Kowalski «choreograph»: один ведущий элемент на удар, задержки неравномерные.
// Правило bang-motion: видео, а не слайды — двигается мир и камера, не больше двух уровней текста в кадре.
// Палитра — ui-ux-pro-max «Luxury/Premium» (чёрный #1C1917 + золото #CA8A04) + бумага и красный lemo (4 краски).
// Подпись на договоре — Rough.js (рисованная кривая).
import { g, C, W, H, clear, piece, rough, roughC, rectP, circP, ellP, smooth, xf, S, label, setG } from './paper9.js';
import { layout, drawLine } from './glyph9.js';
import { agentSide, courierSide, AGENT_POSE, COURIER_POSE, walkPose, runPose } from './chars9.js';
import { clamp, lerp, hash } from '/core/lib.js';

export const VO = 1.5;                       // голос входит на 1,5 с
export const DUR = 16.8;
const WD0 = [[0.84,1.04,"You're"],[1.04,1.5,'29.'],[1.88,2.32,'Moscow.'],[2.6,2.8,"You're"],[2.8,2.9,'a'],[2.9,3.16,'top'],[3.16,3.62,'executive.'],[3.92,4.08,'By'],[4.08,4.4,'day,'],[4.56,4.72,'you'],[4.72,5.04,'sign'],[5.04,5.44,'million'],[5.44,5.7,'-dollar'],[5.7,6.12,'deals.'],[6.36,6.52,'By'],[6.52,6.84,'night,'],[7.04,7.36,'clubs'],[7.36,7.54,'where'],[7.54,7.66,'the'],[7.66,8.04,'bouncers'],[8.04,8.24,'know'],[8.24,8.4,'your'],[8.4,8.8,'face.'],[9.24,9.68,'Champagne,'],[9.94,10.36,'girls,'],[10.54,10.76,'and'],[10.76,10.88,'a'],[10.88,11.1,'white'],[11.1,11.4,'line'],[11.4,11.54,'in'],[11.54,11.62,'a'],[11.62,12.0,'bathroom'],[12.0,12.4,'stall.']];
export const WD = WD0.map(([a, b, w]) => [a - .78 + VO, b - .78 + VO, w]);   // запись обрезана с 0,78 с
const wa = i => WD[i][0], wb = i => WD[i][1];

// ── сцены и удары (склейки на ударах меди) ──
export const T = {
  split: 1.40, s29: wa(1), moscow: wa(2) - .04, exec: wa(3) - .06, execPan: wa(6), day: wa(7) - .06,
  sign: wa(10), mil: wa(11), dollar: wa(12), deals: wa(13), night: wa(14) - .06, clubs: wa(16), know: wa(20),
  face: wa(22), champ: wa(23) - .04, girls: wa(24) - .02, line: wa(25) - .1, card: wa(28) + .05, stall: wa(31) - .06,
  lock: wa(32) + .02, stop: wb(32) + .06, shatter: wb(32) + .62, title: wb(32) + .92,
};
export const SUBS = [
  [wa(0), T.moscow, "You're 29."], [T.moscow, T.exec, 'Moscow.'], [T.exec, T.day, "You're a top executive."],
  [T.day, T.mil, 'By day, you sign'], [T.mil, T.night, 'million-dollar deals.'], [T.night, wa(17), 'By night, clubs'],
  [wa(17), wa(20), 'where the bouncers'], [wa(20), T.champ, 'know your face.'], [T.champ, T.line, 'Champagne, girls,'],
  [T.line, wa(29), 'and a white line'], [wa(29), T.shatter, 'in a bathroom stall.'],
];

// ── движение: huashu y5 + Emil ──
const E = Math.E;
const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const expoOut = u => u >= 1 ? 1 : 1 - Math.pow(2, -10 * u);
const expoIn = u => u <= 0 ? 0 : Math.pow(2, 10 * (u - 1));
const backOut = (u, s = 2.7) => { u = clamp(u, 0, 1) - 1; return 1 + u * u * ((s + 1) * u + s); };
const springU = u => u <= 0 ? 0 : 1 - Math.exp(-10 * u) * Math.cos(2 * Math.PI * 2.2 * u);   // перелёт ≈ 8 %, стоит ≈ 0,35 с
const slam = (t, t0) => t < t0 ? null : { s: 1.7 + (1 - 1.7) * springU(t - t0), a: clamp((t - t0) / .06, 0, 1) };
const twos = t => Math.floor(t * 12) / 12;   // куклы и буквы «на двойках» (12 к/с), камера — на каждом кадре

function cam(cx = W / 2, cy = H / 2, s = 1, r = 0) {
  g.setTransform(1, 0, 0, 1, 0, 0); g.translate(W / 2, H / 2); g.rotate(r); g.scale(s, s); g.translate(-cx, -cy);
}
// буква/слово, вырезанные из бумаги: центр по x, база по y
function word(str, size, x, y, col, opt = {}) {
  const lay = layout(str, size, { track: opt.track ?? .03 });
  drawLine(lay, x - lay.width / 2, y, { col, seed: opt.seed || str.length * 7, jit: opt.jit ?? 1, each: opt.each, amp: opt.amp ?? 2 });
  return lay;
}
function scaled(x, y, s, fn) { g.save(); g.translate(x, y); g.scale(s, s); g.translate(-x, -y); fn(); g.restore(); }

// ── субтитры: бумажная полоска внизу слева (lemo §4), выше зоны интерфейса TikTok (низ 22 %) ──
function subStrip(text, u, dark) {
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  g.font = '600 52px LSpartan'; g.letterSpacing = '0.5px';
  const tw = g.measureText(text).width, h = 84, w = tw + 120;
  g.translate(64 + (1 - u) * -70, 1395); g.rotate(-1 * Math.PI / 180);
  const strip = rough([[0, -h / 2], [w, -h / 2 + 2], [w - 16, h / 2], [-10, h / 2 - 1]], 777 + text.length, 1.1, 10);
  piece(strip, dark ? C.ink : C.paper, { gap: 0, shA: .35 });
  // значок-«дорожка»: короткая косая белая полоска (знак фильма вместо замочной скважины демо)
  g.save(); g.translate(42, 0); g.rotate(-Math.PI / 6);
  piece(rough(rectP(-18, -4, 36, 8), 91, .7, 6), dark ? C.paper : C.red, { gap: 0, shadow: false });
  g.restore();
  g.fillStyle = dark ? C.paper : C.ink; g.textBaseline = 'middle'; g.fillText(text, 80, 3);
  g.restore();
}
const DARK = new Set(['Moscow.', 'By day, you sign', 'million-dollar deals.', 'Champagne, girls,']);
function drawSubs(t) {
  for (const [a, b, s] of SUBS) if (t >= a && t < b) subStrip(s, expoOut(seg(t, a, a + .18)), DARK.has(s));
}

// ═══════════ S0: холодное начало — одна белая полоса на чёрном, потом разрез по диагонали ═══════════
const ANG = -30 * Math.PI / 180;
function lineStrip(len, w = 22, seed = 3) { return rough(rectP(-len / 2, -w / 2, len, w), seed, 1.6, 10); }
function s0(t) {
  clear(C.ink);
  cam(W / 2, H / 2, 1 + .04 * t);
  const u = expoOut(seg(t, .15, .8));
  g.save(); g.translate(W / 2, H / 2); g.rotate(ANG);
  piece(lineStrip(2600 * u + 1), C.paper, { gap: 0 });
  g.restore();
}
// разрез: под чёрными половинками уже стоит следующая сцена (передний план сам становится переходом)
function splitOver(t, under) {
  under(t);
  const u = expoIn(seg(t, T.split, T.split + .22));
  const d = u * 1200, nx = -Math.sin(ANG), ny = Math.cos(ANG);
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  for (const sg of [-1, 1]) {
    g.save(); g.translate(W / 2 + nx * d * sg, H / 2 + ny * d * sg); g.rotate(ANG);
    const half = rough(rectP(-1800, sg < 0 ? -2200 : 11, 3600, 2189), 40 + sg, 2.2, 12);
    piece(half, C.ink, { gap: 0, shA: .45, shB: 14 });
    g.restore();
  }
  g.restore();
}

// ═══════════ S1: «29» на красном, герой стоит на девятке ═══════════
function s1(t) {
  clear(C.red);
  cam(W / 2, H / 2 + 40 - 40 * seg(t, T.split, T.moscow), 1.02 + .05 * seg(t, T.split, T.moscow));
  // большой круг-«солнце» за цифрами — «силуэт против огромного круга»
  piece(roughC('sun29', () => circP(540, 760, 420, 90), 5, 2, 12), C.redD, { gap: 0, shadow: false });
  const sl = slam(t, T.s29);
  const y = 1240;
  const draw = () => word('29', 1050, 540, y, C.ink, { seed: 29, track: .02 });
  if (sl) { g.save(); g.globalAlpha = sl.a; scaled(540, y - 380, sl.s, draw); g.restore(); }
  // герой: стоит на цифрах, голова повёрнута к нам — появляется до цифр (ведущий), цифры падают под ним
  const by = sl ? y - 790 : y - 790 + 40 * (1 - expoOut(seg(t, T.split, T.split + .3)));
  agentSide(660, by, .6, { ...AGENT_POSE.stand, tie: .25 + .2 * Math.sin(twos(t) * 6), tph: twos(t) * 5 });
}

// ═══════════ S2: «MOSCOW» — буквы встают из земли башнями Сити, на верхней — золотая звезда ═══════════
const MOS_H = [520, 760, 430, 980, 640, 470];    // высоты башен Сити над буквами: неравные (Emil — без метронома)
const MOS_D = [.12, 0, .2, .05, .16, .09];        // задержки: неравные
function star(x, y, r, col) {
  const p = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .42 : r; p.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
  piece(rough(p, 55, 1.2, 8), col);
}
function s2(t) {
  clear(C.paper);
  const k = seg(t, T.moscow, T.exec);
  cam(W / 2, H / 2 - 40 * k, 1.04 - .04 * k);
  const lay = layout('MOSCOW', 370, { track: .04 }), x0 = 540 - lay.width / 2, base = 1290;
  // башни Сити: тёмные полосы за буквами встают из земли (буквы — их основания: «шрифт — декорация»)
  g.save(); g.beginPath(); g.rect(-400, -2000, 2000, base + 2000); g.clip();
  for (const L of lay.letters) {
    const u = expoOut(seg(t, T.moscow + .12 + MOS_D[L.i], T.moscow + .5 + MOS_D[L.i]));
    const cx = x0 + L.x + (L.x0 + L.x1) / 2, w = (L.x1 - L.x0) * .78, h = MOS_H[L.i] * u;
    if (h > 2) piece(rough(rectP(cx - w / 2, base - h, w, h + 10), 610 + L.i, 1.8, 12), C.paperD, { gap: 0, shadow: false });
  }
  for (const L of lay.letters) {
    const u = backOut(seg(t, T.moscow + MOS_D[L.i], T.moscow + MOS_D[L.i] + .32), 1.6);
    g.save(); g.translate(0, (1 - u) * 420);
    drawLine({ letters: [L], width: lay.width }, x0, base, { col: C.ink, seed: 300, jit: .8, amp: 2 });
    g.restore();
  }
  g.restore();
  piece(roughC('river', () => rectP(-200, 1290, 1480, 900), 9, 2.5, 14), C.ink, { gap: 0 });
  // звезда на самой высокой башне (над C) — приходит последней, с отскоком
  const L3 = lay.letters[3], sx = x0 + L3.x + (L3.x0 + L3.x1) / 2, top = base - MOS_H[3];
  const su = backOut(seg(t, T.moscow + .62, T.moscow + .9), 3);
  if (su > 0) { g.save(); g.translate(sx, top - 60); g.scale(su, su); g.rotate((1 - su) * .6); star(0, 0, 58, C.red); g.restore(); }
}

// ═══════════ S3: «TOP EXECUTIVE» — колонна букв-этажей, камера едет вниз ═══════════
const EX = 'EXECUTIVE', EX_S = 250, EX_STEP = 214, EX_TOP = 560;
function s3(t) {
  clear(C.mus);
  const pan = expoOut(seg(t, T.execPan - .05, T.day - .05));
  const cy = lerp(700, EX_TOP + EX_STEP * 8 - 260, pan);
  cam(W / 2, cy, 1, 0);
  // башня: чёрный ствол, буквы — светлые окна-этажи
  piece(roughC('tower', () => rectP(330, EX_TOP - 120, 420, EX_STEP * 9 + 600), 12, 2.5, 14), C.ink);
  piece(roughC('roof', () => rectP(300, EX_TOP - 150, 480, 40), 13, 1.6, 10), C.ink);
  for (let i = 0; i < EX.length; i++) {
    const t0 = T.execPan + i * .035 + (i % 3) * .012;
    const u = expoOut(seg(t, t0, t0 + .3));
    if (u <= 0) continue;
    g.save(); g.globalAlpha = u;
    word(EX[i], EX_S, 540, EX_TOP + 150 + i * EX_STEP + (1 - u) * 60, C.paper, { seed: 900 + i, jit: 1.4 });
    g.restore();
  }
  // табличка TOP на крыше — красная, падает пружиной на слово «top»
  const sl = slam(t, wa(5));
  if (sl) { g.save(); g.globalAlpha = sl.a; scaled(540, EX_TOP - 260, sl.s, () => {
    piece(rough(rectP(395, EX_TOP - 370, 290, 200), 77, 1.6, 10), C.red);
    word('TOP', 190, 540, EX_TOP - 205, C.paper, { seed: 61 });
  }); g.restore(); }
  // герой на крыше
  agentSide(775, EX_TOP - 150, .5, { ...AGENT_POSE.stand, head: -.05, tie: .45 + .25 * Math.sin(twos(t) * 7), tph: twos(t) * 6 }, { flip: true });
}

// ═══════════ S4: «BY DAY … MILLION-DOLLAR DEALS» — договор, перо, подпись Rough.js, цифры ═══════════
let RC = null;
const SIGP = [[262, 1228], [300, 1170], [330, 1240], [372, 1166], [404, 1232], [452, 1160], [470, 1220], [520, 1182], [560, 1220], [610, 1190], [660, 1210], [720, 1182]];
function sigCurve(u) {   // рисованная подпись, проявляется по длине
  if (!RC) RC = window.rough.canvas(document.getElementById('c'));
  const n = Math.max(2, Math.ceil(u * SIGP.length));
  const pts = SIGP.slice(0, n);
  RC.ctx = g;
  RC.curve(pts, { stroke: C.red, strokeWidth: 7, roughness: 1.4, bowing: 2, seed: 7 });
}
function pen(x, y) {   // перо без руки: уходит за край кадра (правило: руки кодом не рисуем)
  g.save(); g.translate(x, y); g.rotate(-1.02);
  piece(rough([[0, 0], [16, -46], [-16, -46]], 41, .6, 6), C.mus);                    // золотое перо
  piece(rough(rectP(-24, -330, 48, 286), 42, 1.1, 9), C.ink);                          // корпус
  piece(rough(rectP(-26, -120, 52, 22), 43, .8, 8), C.mus);                            // золотое кольцо
  piece(rough(rectP(-22, -1400, 44, 1080), 44, 1.2, 10), C.ink);                       // колпачок уходит за край
  g.restore();
}
function s4(t) {
  clear(C.paper);
  const k = seg(t, T.day, T.night);
  cam(...S4CAM(k));
  // лист договора: въезжает снизу и останавливается намертво на ударе
  const u = expoOut(seg(t, T.day, T.day + .32));
  g.save(); g.translate(0, (1 - u) * 900); g.translate(540, 1080); g.rotate(-.07); g.translate(-540, -1080);
  piece(roughC('sheet', () => rectP(170, 860, 740, 760), 21, 2, 12), C.paperD);
  for (let i = 0; i < 5; i++) piece(roughC('ln' + i, () => rectP(240, 930 + i * 44, i % 3 === 2 ? 420 : 600, 12), 30 + i, .8, 8), C.inkL, { gap: 0, shadow: false });
  piece(roughC('sigl', () => rectP(240, 1262, 520, 8), 40, .6, 8), C.ink, { gap: 0, shadow: false });
  if (t > T.sign) sigCurve(seg(t, T.sign, T.mil - .05));
  const pu = seg(t, T.sign, T.mil - .05), pi = Math.min(SIGP.length - 1, Math.floor(pu * (SIGP.length - 1)));
  const lift = t < T.sign ? 1 - expoOut(seg(t, T.day + .2, T.sign)) : t > T.mil ? expoIn(seg(t, T.mil - .1, T.mil + .12)) : 0;
  if (lift < 1) pen(SIGP[pi][0] - lift * 1900 * .852, SIGP[pi][1] - 10 - lift * 1900 * .523);   // перо входит и уходит вдоль своей оси, за край
  g.restore();
  // «$1» падает, шесть нулей выскакивают (huashu: цифры — backOut), задержки неравные (Emil)
  const sl = slam(t, T.mil);
  if (sl) { g.save(); g.globalAlpha = sl.a; scaled(540, 400, sl.s, () => word('$1', 330, 540, 530, C.ink, { seed: 12 })); g.restore(); }
  ZX.forEach((x, i) => {
    const t0 = T.dollar + ZD[i], z = backOut(seg(t, t0, t0 + .3), 2.8); if (z <= 0) return;
    g.save(); g.translate(x, ZY); g.scale(z, z); word('0', ZS, 0, 0, i === 5 ? C.mus : C.ink, { seed: 70 + i }); g.restore();
  });
}
const ZX = [175, 280, 385, 625, 730, 835], ZD = [0, .06, .13, .24, .29, .37], ZY = 800, ZS = 230;
const S4CAM = k => [W / 2 - 30 * k, H / 2 + 20 - 50 * k, 1.03 + .05 * k];
// координаты последнего нуля → луна в следующей сцене (графическая рифма: та же форма, то же место)
let MOON = null;
function moonGeom() {   // размер и место последнего нуля
  if (!MOON) { const L = layout('0', ZS, { track: .03 }).letters[0]; const w = L.x1 - L.x0, h = -L.top;
    MOON = { x: ZX[5], y: ZY - h / 2, rx: w / 2, ry: h / 2, r: Math.max(w, h) * .42 }; }
  return MOON;
}

// ═══════════ S5: «BY NIGHT, CLUBS … KNOW YOUR FACE» — фасад из букв CLUB, вышибала, канат ═══════════
function stanchion(x, y) {
  piece(rough(rectP(x - 9, y - 190, 18, 190), x, .8, 8), C.mus);
  piece(rough(circP(x, y - 196, 18, 16), x + 1, .8, 6), C.mus);
  piece(rough(rectP(x - 34, y - 12, 68, 14), x + 2, .7, 8), C.mus);
}
function rope(x1, y1, x2, y2, sag, w = 16) {
  const top = [], bot = [];
  for (let i = 0; i <= 16; i++) { const u = i / 16, x = lerp(x1, x2, u), y = lerp(y1, y2, u) + Math.sin(u * Math.PI) * sag; top.push([x, y - w / 2]); bot.push([x, y + w / 2]); }
  piece(rough(top.concat(bot.reverse()), 88, .8, 7), C.red);
}
function s5(t) {
  clear(C.ink);
  const k = seg(t, T.night, T.champ);
  // камера: из луны (рифма) отъезжает к фасаду и ведёт героя вправо
  const M = moonGeom(), C0 = S4CAM(1);
  const pull = expoOut(seg(t, T.night + .05, T.night + .75));
  const cx = lerp(C0[0], 560 + 120 * seg(t, T.clubs + .3, T.face + .3), pull), cy = lerp(C0[1], 980, pull), s = lerp(C0[2], .92, pull);
  cam(cx, cy, s);
  const mr = expoOut(seg(t, T.night, T.night + .35));
  const mg = 1 + 1.3 * expoOut(seg(t, T.night + .1, T.night + .9));   // луна растёт, пока камера отъезжает
  piece(rough(ellP(M.x, M.y, lerp(M.rx, M.r, mr) * mg, lerp(M.ry, M.r, mr) * mg, 60), 15, 1.6, 10), C.paper, { gap: 0 });
  // земля и фасад: CLUB, вход — в «U»
  piece(roughC('street', () => rectP(-600, 1330, 2400, 900), 16, 2.2, 14), C.inkL, { gap: 0 });
  const cu = expoOut(seg(t, T.clubs - .08, T.clubs + .25));
  g.save(); g.beginPath(); g.rect(-600, -1000, 2400, 2330); g.clip();
  const lay = word('CLUB', 500, 520, 1330 + (1 - cu) * 500, C.red, { seed: 501, track: .05 });
  g.restore();
  // свет в двери (внутри «U»)
  const U = lay.letters[2], ux = 520 - lay.width / 2 + U.x + (U.x0 + U.x1) / 2;
  if (cu > .6) piece(rough(rectP(ux - 40, 1330 - 230, 80, 230), 18, .8, 8), C.mus, { gap: 0, shadow: false });
  // канат: на «know» вышибала снимает крюк, конец падает
  const drop = expoIn(seg(t, T.know, T.know + .22)), sw = Math.sin(twos(t) * 9) * 18 * seg(t, T.know + .22, T.know + .8) * (1 - seg(t, T.know + .8, T.champ));
  stanchion(ux - 200, 1330); stanchion(ux + 120, 1330);
  if (drop < 1) rope(ux - 200, 1140, ux + 120 - drop * 40, 1140 + drop * 160, 60 * (1 - drop) + 20);
  else rope(ux - 200, 1140, ux - 200 + 60 + sw, 1300, 30);
  // вышибала справа, смотрит на героя; на «face» узнаёт — кивок
  const nod = t > T.face ? Math.sin(seg(t, T.face, T.face + .5) * Math.PI) * .12 : 0;
  courierSide(ux + 200, 1330, .56, { ...COURIER_POSE.stand, head: nod }, { flip: true });
  // герой идёт к двери (шаг на «двойках»), на «face» проходит за канат
  const hx = lerp(-80, ux - 20, expoOut(seg(t, T.clubs - .2, T.face + .25)) * .78 + .22 * seg(t, T.face, T.champ));
  const walking = t < T.face + .3;
  agentSide(hx, 1330, .5, walking ? walkPose(twos(t) * 1.1) : { ...AGENT_POSE.stand, tie: .3 });
}

// ═══════════ S6: «CHAMPAGNE, GIRLS» — склейки всё чаще ═══════════
function coupe(x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s);
  piece(rough([[-150, 0], [150, 0], [120, 70], [40, 108], [-40, 108], [-120, 70]], 61, 1.2, 8), C.ink);        // чаша
  piece(rough([[-128, 14], [128, 14], [104, 64], [36, 94], [-36, 94], [-104, 64]], 62, 1, 8), C.mus, { gap: 0, shadow: false });   // шампанское
  piece(rough(rectP(-9, 104, 18, 220), 63, .7, 8), C.ink);
  piece(rough(ellP(0, 330, 96, 20, 30), 64, .8, 8), C.ink);
  g.restore();
}
function lips(x, y, s, r, seed) {
  g.save(); g.translate(x, y); g.rotate(r); g.scale(s, s);
  const up = smooth([[-130, 6], [-70, -40], [-24, -46], [0, -26], [24, -46], [70, -40], [130, 6], [60, 0], [0, 10], [-60, 0]], 2);
  const lo = smooth([[-130, 10], [-60, 16], [0, 22], [60, 16], [130, 10], [80, 58], [0, 76], [-80, 58]], 2);
  piece(rough(up, seed, 1.4, 8), C.red); piece(rough(lo, seed + 1, 1.4, 8), C.red);
  g.restore();
}
function s6(t) {
  if (t < T.girls) {
    clear(C.red);
    cam(W / 2, H / 2, 1 + .06 * seg(t, T.champ, T.girls));
    piece(roughC('sunC', () => circP(540, 880, 400, 90), 66, 2, 12), C.paper, { gap: 0 });
    const sl = slam(t, T.champ + .04);
    if (sl) scaled(540, 820, sl.s, () => coupe(540, 760, 1.25));
    for (let i = 0; i < 9; i++) {   // пузырьки — кружки на двойках, поднимаются
      const tt = twos(t) - T.champ - i * .07; if (tt < 0) continue;
      const bx = 470 + hash(i * 3.1) * 140, by = 800 - tt * 520 - hash(i * 7.7) * 80;
      if (by < 520) continue;
      piece(circP(bx, by, 6 + hash(i) * 7, 12), C.paper, { gap: 0, shadow: false });
    }
  } else {
    clear(C.paper);
    cam(W / 2, H / 2, 1.02);
    const L = [[T.girls, 430, 720, 1.15, -.25], [T.girls + .2, 640, 1010, .95, .2], [T.girls + .33, 430, 1230, .8, -.1]];
    L.forEach(([t0, x, y, s, r], i) => { const sl = slam(t, t0); if (sl) { g.save(); g.globalAlpha = sl.a; lips(x, y, s * sl.s, r, 120 + i * 9); g.restore(); } });
  }
}

// ═══════════ S7: «AND A WHITE LINE IN A BATHROOM STALL» — полоса, чёрная карта, защёлка ═══════════
function card(x, y, r) {
  g.save(); g.translate(x, y); g.rotate(r);
  const cp = smooth(rectP(-270, -170, 540, 340), 1);
  piece(rough(cp, 71, 1.2, 9), C.inkL, { gapCol: C.mus, gap: 3 });           // чёрная карта (чуть светлее фона) с золотой кромкой
  piece(rough(rectP(-200, -70, 84, 64), 72, .8, 6), C.mus, { gap: 0, shadow: false });   // чип
  g.restore();
}
function s7(t) {
  if (t < T.stall) {
    clear(C.ink);
    cam(W / 2, H / 2, 1 + .05 * seg(t, T.line, T.stall));
    const u = expoOut(seg(t, T.line, T.line + .4));
    g.save(); g.translate(W / 2, H / 2 + 40); g.rotate(ANG);
    g.save(); g.beginPath(); g.rect(-1600, -400, 3200 * u, 800); g.clip();
    piece(lineStrip(2600, 30, 7), C.paper, { gap: 0 });
    g.restore();
    // карта выравнивает полосу: едет вдоль неё
    const cu = expoOut(seg(t, T.card, T.stall - .05));
    if (t > T.card - .25) card(lerp(-900, 120, cu), -190, 0);
    g.restore();
  } else {
    // дверь кабинки: панели, круглая защёлка, красный флажок OCCUPIED на ударе
    clear(C.inkL);
    const k = seg(t, T.stall, T.stop);
    cam(W / 2, H / 2, 1.06 + .05 * k);
    for (let i = 0; i < 4; i++) piece(roughC('slat' + i, () => rectP(110, 260 + i * 370, 860, 330), 80 + i, 2, 12), C.ink);
    piece(roughC('plate', () => circP(540, 960, 190, 60), 85, 1.6, 10), C.paper);
    const lu = t > T.lock ? backOut(seg(t, T.lock, T.lock + .2), 3) : 0;
    piece(rough(rectP(430 + lu * 40, 930, 220, 60), 86, 1, 8), C.ink);    // засов
    if (lu > 0) { g.save(); g.translate(540, 760); g.scale(lu, lu);
      piece(rough(rectP(-190, -60, 380, 110), 87, 1.4, 9), C.red);
      word('OCCUPIED', 92, 0, 32, C.paper, { seed: 91, track: .08 });
      g.restore(); }
  }
}

// ═══════════ S8: стоп-кадр → кадр режется на косые полосы → собирается название ═══════════
let FZ = null;
function frozen() {   // стоп-кадр рисуется один раз в свой холст
  if (!FZ) { FZ = document.createElement('canvas'); FZ.width = W; FZ.height = H; const prev = g; setG(FZ.getContext('2d')); s7(T.stop - 1 / 24); g.setTransform(1, 0, 0, 1, 0, 0); setG(prev); }
  return FZ;
}
function s8(t) {
  // полосы стоп-кадра разъезжаются вдоль диагонали (lemo: shattering)
  clear(C.red);
  cam(W / 2, H / 2, 1);
  const k = seg(t, T.title, DUR);
  // название SOUL / LESS: буквы прилетают по одной на ударах (неравные задержки)
  const D1 = [0, .07, .17, .22], D2 = [.38, .44, .55, .6];
  const line = (str, y, col, D, seed) => {
    const lay = layout(str, 500, { track: .03 }), x0 = 540 - lay.width / 2;
    drawLine(lay, x0, y, { col, seed, jit: 1.6, amp: 2.4, each: (L, i) => {
      const u = expoOut(seg(t, T.title + D[i], T.title + D[i] + .28));
      return u <= 0 ? { hide: true } : { dy: (1 - u) * (i % 2 ? -900 : 900), rot: (1 - u) * (i % 2 ? .5 : -.5), s: 1 + .03 * k };
    } });
  };
  line('SOUL', 900, C.ink, D1, 401);
  line('LESS', 1320, C.paper, D2, 433);
  const cu = expoOut(seg(t, T.title + 1.1, T.title + 1.5));
  if (cu > 0) { g.save(); g.globalAlpha = cu; g.font = '600 44px LSpartan'; g.letterSpacing = '6px'; g.fillStyle = C.paper; g.textAlign = 'center'; g.fillText('MOSCOW · 2012', 540, 1440 + (1 - cu) * 30); g.restore(); }
  // полосы стоп-кадра поверх, уезжают
  const su = expoIn(seg(t, T.shatter, T.title + .1));
  if (su < 1) {
    for (let i = -6; i <= 6; i++) {
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
      g.translate(W / 2, H / 2); g.rotate(ANG);
      const off = su * 2600 * (i % 2 ? 1 : -1);
      g.beginPath(); g.rect(-2000, i * 180 - 90, 4000, 180); g.clip();
      g.translate(off, 0); g.rotate(-ANG); g.translate(-W / 2, -H / 2);
      g.drawImage(frozen(), 0, 0);
      g.restore();
    }
  }
}

// ═══════════ таймлайн ═══════════
export function renderFilm(t, opt = {}) {
  if (t < T.split) s0(t);
  else if (t < T.split + .22) splitOver(t, s1);
  else if (t < T.moscow) s1(t);
  else if (t < T.exec) s2(t);
  else if (t < T.day) s3(t);
  else if (t < T.night) s4(t);
  else if (t < T.champ) s5(t);
  else if (t < T.line) s6(t);
  else if (t < T.stop) s7(t);
  else if (t < T.shatter) s7(T.stop - 1 / 24);                 // стоп-время: кадр замер, тишина
  else s8(t);
  g.setTransform(1, 0, 0, 1, 0, 0);
  if (!opt.nosub && t < T.shatter) drawSubs(t < T.stop ? t : T.stop - .01);
}

// ═══════════ события для звука (lemo: окно EV → микшер) ═══════════
export function events() {
  const E = [];
  const add = (t, type, o = {}) => E.push({ t: +t.toFixed(4), type, ...o });
  add(.15, 'paper_slide', { g: .7 });
  add(T.split, 'stab', { ch: 'Em7' }); add(T.split - .02, 'scissor');
  add(T.s29, 'card_slap'); add(T.moscow, 'stab', { ch: 'C7s11' });
  MOS_D.forEach(d => add(T.moscow + d, 'paper_slide', { g: .35 })); add(T.moscow + .62, 'ding', { g: .5 });
  add(T.exec, 'stab', { ch: 'B7s9' }); add(wa(5), 'card_slap'); add(T.execPan, 'paper_whoosh');
  add(T.day, 'stab', { ch: 'Em7' }); add(T.day, 'paper_slide');
  add(T.sign, 'pen'); add(T.mil, 'card_slap'); [0, .09, .21].forEach(d => add(T.dollar + d, 'pop', { g: .6 }));
  add(T.night, 'stab', { ch: 'Fm6' }); add(T.clubs - .08, 'paper_slide');
  for (let t = T.clubs - .2; t < T.face + .2; t += .42) add(t, 'step', { g: .45 });
  add(T.know, 'chain'); add(T.face + .05, 'step', { g: .4 });
  add(T.champ, 'stab', { ch: 'C7s11' }); add(T.champ + .04, 'clink');
  add(T.girls, 'stab', { ch: 'B7s9', short: 1 }); add(T.girls + .2, 'card_slap', { g: .5 }); add(T.girls + .33, 'card_slap', { g: .45 });
  add(T.line, 'stab', { ch: 'Em7' }); add(T.line, 'paper_whoosh'); add(T.card, 'paper_slide', { g: .8 });
  add(T.stall, 'stab', { ch: 'Fm6' }); add(T.lock, 'latch');
  add(T.stop, 'silence'); add(T.shatter, 'shatter'); add(T.title, 'title', { ch: 'Em69' });
  [0, .07, .17, .22, .38, .44, .55, .6].forEach(d => add(T.title + d + .2, 'card_slap', { g: .4 }));
  return E;
}
export function texts(t) {
  const o = [];
  for (const [a, b, s] of SUBS) if (t >= a && t < b) o.push({ id: s, text: s, x0: 64, y0: 1357, x1: 1000, y1: 1433 });
  return o;
}
