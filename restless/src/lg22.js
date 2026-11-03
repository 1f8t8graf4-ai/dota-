// ===================== lg22 — 04.11 (ночь 2): лайв-матч снова карточками (lg10), вся команда — в один ряд =====================
// Андрей на строки lg20: «че за бред, верни как было, но чтобы умещались 5 героев в одной строчке, а лучше сразу 10».
// Карточки — прежние (pCard из lg10), ниже ростом: 6 в ряд от 900 px, обе команды — на одном экране окна программы (0.4.7: окно шире).

// ---------- лобби с ботами — не лайв-матч (Андрей: «энивей кидает лайв матч бота»). Программа 0.4.3+ отсекает их сама,
// а у старой (0.3) — отсекает сайт: бот зовётся как его герой («Инфернус» на Инфернусе) — два таких и больше → не матч ----------
const lgBot = p => { const n = ovlc(p && p.n).replace(/\s*\?$/, ''); if (!n) return false; if (p.h && n === ovlc(p.h)) return true;
  const k = heroByName(n); return !!k && k === (p.hid || heroByName(p.h)); };
const lgBots = g => !!(g && g.s === 'm' && (g.players || []).filter(lgBot).length >= 2);
const lgBotOff = () => { if (OV.app && OV.G && OV.G.s === 'b') OV.app.live = false; };
{ const G22 = window.rlGame; window.rlGame = g => { G22(lgBots(g) ? Object.assign({}, g, {s: 'b'}) : g); lgBotOff(); if (typeof ovTabLive === 'function') ovTabLive();
    // открыт свой «Лайв-матч» (последний матч из API), а пришло лобби с ботами — показать «Матч с ботами»
    if (RL_APP && OV.G && OV.G.s === 'b' && /^#live\/?$/.test(location.hash) && !document.querySelector('.l22-bot')) route(); }; }
{ const A22 = window.rlApp; window.rlApp = s => { A22(s); lgBotOff(); if (typeof ovTabLive === 'function') ovTabLive(); }; }
{ const VL22 = viewLive; viewLive = async function (arg) {
    if (!(RL_APP && lgOwn(arg) && gameLive() && OV.G.s === 'b')) return VL22.apply(this, arguments);
    const n = vNew(); clearInterval(LVT); clearInterval(OV.timer);
    V(`<div class="q-lvh"><h1 class="h1">Лайв-<em>матч</em></h1></div><div class="empty l22-bot">Матч с ботами</div>`);
    const k = () => { if (n !== VQ) { clearInterval(iv); return; } if (!(gameLive() && OV.G.s === 'b')) { clearInterval(iv); viewLive(arg); } }, iv = setInterval(k, 3000);
    OV.kick = k; }; }
