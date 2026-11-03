// ===================== lg21 — 04.11 (ночь): «Лайв-матч» в программе — из игры; игры в профиле больше не пропадают =====================
// Андрей: «почему лайв-матч прошлый показывается?» — вкладка брала из API последний матч, а игроков из игры (мод → программа)
// показывала только страница #ov. Теперь в программе, пока идёт матч, «Лайв-матч» = 12 игроков из игры.
// «куда мои игры пропали? сегодня играл — показывались, сейчас опять нет» — API Deadlock иногда отдаёт историю без свежих игр
// (только то, что успел сохранить у себя). Теперь матч, который сайт однажды видел, остаётся в истории (память браузера, 30 дней).

// ---------- лайв-матч из игры ----------
const lgOwn = arg => !arg || (ME && +arg === ME.id);
const lgGame = () => !!(RL_APP && gameLive() && OV.G.s === 'm' && (OV.G.players || []).length);
async function viewLiveGame(arg) {
  const n = vNew(); clearInterval(LVT); clearInterval(OV.timer); clearInterval(OV.clk);
  V(`<div class="q-lvh"><h1 class="h1">Лайв-<em>матч</em></h1></div>
    <div class="q-mh l21-mh"><span class="live">идёт матч</span><span id="ovst"></span></div>
    <div id="ovb"><div class="load">Смотрю ранги, героев и серии всех 12…</div></div>`);
  $('#ovb').onclick = e => { const pr = e.target.closest('[data-per]'); if (pr) { const p = LVL.find(x => String(x.id) === pr.dataset.acc); if (p) qPop(pr, perHTML(p, pr.dataset.per)); return; }
    const pb = e.target.closest('[data-pb]'); if (pb) { qPop(pb, pbHTML(pb.dataset.pb)); pbNamed(pb.dataset.pb); } };
  if (OV.L && OV.gk && OV.gk === OV.gk2) { ovDraw(); ovStatus(OV.G.gt || ''); } else OV.gk = '';
  let busy = false;
  const t = async () => {
    if (n !== VQ) { clearInterval(OV.timer); if (OV.kick === t) OV.kick = null; return; }
    if (busy) return; busy = true;
    try {
      const shown = await ovFromGame(n);
      // матч кончился, игра на связи (в укрытии) — «Матч закончился» остаётся, а не прошлый матч из API
      if (!shown && n === VQ && gameLive() && OV.G.s === 'h' && $('#ovb .ov-e')) return;
      if (!shown && n === VQ) { clearInterval(OV.timer); OV.kick = null; viewLive(arg); }
    } finally { busy = false; }
  };
  OV.kick = t; t(); OV.timer = setInterval(t, 5000);
}
{ const VL21 = viewLive; viewLive = async function (arg) {
    if (lgGame() && lgOwn(arg)) return viewLiveGame(arg);
    const pr = VL21.apply(this, arguments);
    // в программе: матч начался, пока открыт (или ещё грузится) обычный лайв — сразу показать игроков из игры
    if (RL_APP && lgOwn(arg)) { const n = VQ, k = () => { if (n !== VQ) { clearInterval(iv); return; } if (lgGame()) { clearInterval(iv); viewLiveGame(arg); } }, iv = setInterval(k, 3000); OV.kick = k; }
    return pr; }; }
// в программе #ov (авто-открытие на матч, «● LIVE» в полосе окна) — та же вкладка «Лайв-матч»
if (RL_APP && !/[?&]ov=1/.test(location.search)) {
  const R21 = route; route = function () { if (/^#ov\/?$/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search + '#live'); return R21.apply(this, arguments); };
  const a = $('.rl-live'); if (a) a.setAttribute('href', '#live');
}

// ---------- история матчей: что сайт видел однажды, не пропадает ----------
const MHK = 'rl-mh';
function mhMerge(id, L) {
  if (!Array.isArray(L)) return L;
  let S = {}; try { S = JSON.parse(localStorage.getItem(MHK) || '{}') || {}; } catch (e) {}
  const old = (S[id] && S[id].L) || [], have = new Set(L.map(x => x.match_id)), lim = now() - 30 * 86400;
  const add = old.filter(x => x && x.match_id && !have.has(x.match_id) && x.start_time > lim);
  const out = add.length ? L.concat(add).sort((a, b) => b.start_time - a.start_time) : L;
  S[id] = {t: Date.now(), L: out.slice(0, 40)};
  Object.keys(S).sort((a, b) => S[b].t - S[a].t).slice(6).forEach(k => { delete S[k]; });
  try { localStorage.setItem(MHK, JSON.stringify(S)); } catch (e) {}
  return out;
}
{ const api21 = api; api = function (p) {
    const pr = api21(p), m = /^players\/(\d+)\/match-history$/.exec(p);
    if (!m || !ME || +m[1] !== ME.id) return pr;
    return pr.then(L => mhMerge(+m[1], L));
  }; }
