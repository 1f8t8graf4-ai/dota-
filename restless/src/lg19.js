// ===================== lg19 — 04.11: эмблемы рангов от Зетки, петли Селесты и Дэнни =====================
// Эмблемы: restless/rk/<тир>-<ступень>.webp (256 px, обрезаны по значку) и @64 для мелких мест —
// вместо картинок API 404×324 с пустыми полями (rankImg зовёт rankOf — подменяем только его). Источник — файлы игры (ветка zai/rank-icons).
{ const RO = rankOf; rankOf = function (badge) {
    const r = RO(badge);
    if (r.t >= 1 && r.t <= 11 && r.s >= 1 && r.s <= 6) r.img = `rk/${r.t}-${r.s}.webp`;
    return r;
  }; }
// живые портреты: Селеста и Дэнни (ветка zai/hero-loops, лицо — по fx Зетки), лежат рядом с сайтом
LOOP[81] = ['celeste', .56, 'loops/'];
LOOP[78] = ['deadman-danny', .41, 'loops/'];
// 04.11, партия №2 Зетки (zai/hero-loops 18d0d07): швы проверены — шов не больше двух обычных шагов кадра
LOOP[58] = ['vyper', .47, 'loops/'];
LOOP[7] = ['wraith', .50, 'loops/'];
LOOP[64] = ['drifter', .53, 'loops/'];
LOOP[76] = ['graves', .53, 'loops/'];
LOOP[11] = ['dynamo', .60, 'loops/'];
{ const AH = artHTML; artHTML = function (hid) {
    const L = LOOP[hid]; if (!L || !L[2]) return AH(hid);
    const h = hero(hid);
    return `<video src="${L[2]}${L[0]}.mp4" poster="art/${hid}.webp" muted loop playsinline autoplay preload="auto" style="object-position:${Math.round(L[1] * 100)}% 50%" aria-label="${esc(h.n)}"></video>`;
  }; }
