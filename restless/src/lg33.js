// ===================== lg33 — 05.11: лайв-матч — игры за 12 ч, 45 дней вместо 30, метки «как играет на этом герое» =====================
// Андрей: «нажимаешь игры за 12 часов — должны показываться счёт, его оценка и итог: победа или поражение»;
// «за 30 дней — да, так, только сделай 45»; «почему так мало тегов в лайве? пиши „Миллионер на Rat King“, „Rat King с высоким уроном“,
// „высокий KDA“ — именно как васян отыгрывает на этом герое, по его средним против обычного игрока на герое».
const L33 = {base: null, bp: null, h45: new Map()};
const D45 = 45 * 86400;
// обычный игрок на каждом герое: средние за матч за 30 дней (кэш api — 3 ч)
function l33Base() {
  if (L33.base) return Promise.resolve(L33.base);
  if (L33.bp) return L33.bp;
  return (L33.bp = api(`analytics/hero-stats?min_unix_timestamp=${now() - 30 * 86400 - (now() % 3600)}`).catch(() => []).then(S => {
    const T = {};
    (S || []).forEach(x => { const n = x.matches || 0; if (n < 300) return;
      T[x.hero_id] = {nw: x.total_net_worth / n, dmg: x.total_player_damage / n, k: x.total_kills / n, d: x.total_deaths / n, a: x.total_assists / n,
        lh: x.total_last_hits / n, obj: x.total_boss_damage / n, tk: x.total_player_damage_taken / n,
        acc: x.total_shots_hit / Math.max(1, x.total_shots_hit + x.total_shots_missed)}; });
    return (L33.base = T);
  }));
}
// его средние на герое за матч (вся открытая история)
function l33Me(h) {
  const m = h.matches_played || 0; if (!m) return null;
  const mins = (h.time_played || 0) / 60 / m;
  return {m, nw: (h.networth_per_min || 0) * mins, dmg: (h.total_player_damage || 0) / m, k: (h.kills || 0) / m, d: (h.deaths || 0) / m, a: (h.assists || 0) / m,
    lh: (h.last_hits_per_min || 0) * mins, obj: (h.total_boss_damage || 0) / m, tk: (h.total_player_damage_taken || 0) / m, acc: h.accuracy || 0};
}
function l33Tags(p, me, b) {
  if (!me || !b || me.m < 8) return [];
  const H = hero(p.hid).n, out = [], pct = (x, y) => Math.round(100 * (x / y - 1)), r = (x, y) => y > 0 ? x / y : 1;
  const nw = r(me.nw, b.nw), dmg = r(me.dmg, b.dmg), kda = r((me.k + me.a) / Math.max(.5, me.d), (b.k + b.a) / Math.max(.5, b.d)), dd = r(me.d, b.d);
  if (nw >= 1.15) out.push(['g', `Миллионер на ${H}`, `душ за матч на ${pct(me.nw, b.nw)}% больше, чем обычно на ${H}`]);
  else if (nw <= .85) out.push(['r', `Мало душ на ${H}`, `душ за матч на ${-pct(me.nw, b.nw)}% меньше, чем обычно на ${H}`]);
  if (dmg >= 1.2) out.push(['g', `${H} с высоким уроном`, `урона по героям на ${pct(me.dmg, b.dmg)}% больше обычного`]);
  else if (dmg <= .8) out.push(['r', `${H} с низким уроном`, `урона по героям на ${-pct(me.dmg, b.dmg)}% меньше обычного`]);
  if (kda >= 1.3) out.push(['g', `Высокий KDA на ${H}`, `KDA ${f1((me.k + me.a) / Math.max(1, me.d))} — обычно ${f1((b.k + b.a) / Math.max(1, b.d))}`]);
  else if (kda <= .7) out.push(['r', `Низкий KDA на ${H}`, `KDA ${f1((me.k + me.a) / Math.max(1, me.d))} — обычно ${f1((b.k + b.a) / Math.max(1, b.d))}`]);
  if (dd <= .75) out.push(['g', 'Редко умирает', `${f1(me.d)} смертей за матч — обычно ${f1(b.d)}`]);
  else if (dd >= 1.3) out.push(['r', 'Часто умирает', `${f1(me.d)} смертей за матч — обычно ${f1(b.d)}`]);
  if (me.acc && b.acc && me.acc - b.acc >= .05) out.push(['g', 'Меткий', `точность ${Math.round(100 * me.acc)}% — обычно ${Math.round(100 * b.acc)}%`]);
  if (r(me.obj, b.obj) >= 1.4) out.push(['b', 'Сносит башни', `урона по строениям и боссам на ${pct(me.obj, b.obj)}% больше обычного`]);
  if (r(me.lh, b.lh) >= 1.2) out.push(['b', 'Фармит крипов', `добиваний на ${pct(me.lh, b.lh)}% больше обычного`]);
  if (r(me.tk, b.tk) >= 1.25 && dd <= 1) out.push(['b', 'Танкует', `принимает на ${pct(me.tk, b.tk)}% больше урона и не умирает чаще`]);
  return out;
}
{ const S0 = scout2; scout2 = async function (players, ctx) {
    const L = await S0(players, ctx);
    if (!L || !L.length) return L;
    try {
      const ids = L.map(p => p.id).filter(Boolean), q = 'account_ids=' + ids.join(','), t45 = now() - D45 - (now() % 3600);
      const [b, hs, h45] = await Promise.all([l33Base(), ids.length ? api('players/hero-stats?' + q).catch(() => []) : [], ids.length ? api(`players/hero-stats?${q}&min_unix_timestamp=${t45}`).catch(() => []) : []]);
      const H = {}, P45 = {};
      (hs || []).forEach(h => { (H[h.account_id] = H[h.account_id] || {})[h.hero_id] = h; });
      (h45 || []).forEach(h => { const x = P45[h.account_id] = P45[h.account_id] || {m: 0, w: 0, hs: []}; x.m += h.matches_played || 0; x.w += h.wins || 0;
        if (h.matches_played) x.hs.push({hid: h.hero_id, m: h.matches_played, w: h.wins || 0}); });
      L.forEach(p => {
        if (!p.id) return;
        // 45 дней вместо 30 — в кнопке, всплывашке и оверлее
        p.p30 = P45[p.id] || {m: 0, w: 0, hs: []}; p.p45 = 1;
        // метки по его игре на этом герое — первыми, чтобы не срезались в карточке
        const T = l33Tags(p, l33Me((H[p.id] || {})[p.hid] || {}), b[p.hid]);
        if (T.length) {
          const tg = (p.tags || []).filter(t => !/^(Высокий KDA|Низкий KDA)$/.test(String(t[1])));
          const lead = tg.filter(t => /^(Мейн героя|OTP|Первый раз на герое)/.test(String(t[1])));
          p.tags = lead.concat(T, tg.filter(t => lead.indexOf(t) < 0));
        }
      });
    } catch (e) { console.warn('[lg33]', e); }
    return L;
  }; }
// подписи 30 → 45 дней
{ const PC0 = pCard; pCard = function () { return String(PC0.apply(this, arguments)).replace('<small>30 дн</small>', '<small>45 дн</small>'); }; }
{ const O0 = ovMore; ovMore = function () { return String(O0.apply(this, arguments)).replace('<small>30 дн</small>', '<small>45 дн</small>'); }; }
try { U26L.forEach(x => { if (x[0] === 'per') x[1] = 'Форма 12 ч / 45 дн'; }); } catch (e) {}
// всплывашка: «12 ч» — каждая игра: герой, счёт, оценка, итог; «45 дн» — герои, как раньше
{ const PH0 = perHTML; perHTML = function (p, k) {
    if (k !== '12') return String(PH0.apply(this, arguments)).replace('за 30 дней', 'за 45 дней');
    const t12 = now() - 12 * 3600, L = (p.rc || []).filter(x => (x.t || 0) >= t12);
    if (!L.length) return `<div class="q-poh"><b>${esc(p.name)}</b><small>за 12 часов</small></div><div class="sub">Игр за 12 часов нет.</div>`;
    const w = L.filter(x => x.w).length;
    setTimeout(() => l33Fill(p.id, L.map(x => x.mid)), 0);
    return `<div class="q-poh"><b>${esc(p.name)}</b><small>за 12 часов · ${games(L.length)} · ${w} – ${L.length - w}</small></div>
      <div class="l33-g">${L.map(x => { const [k1, d1, a1] = String(x.kda || '0/0/0').split('/');
        return `<a class="l33-r ${x.w ? 'w' : 'l'}" href="#m/${x.mid}">${face(x.hid, '', 's', hero(x.hid).n)}<span class="l33-h"><b>${esc(hero(x.hid).n)}</b><small>${x.t ? ago(x.t) : ''}${x.d ? ' · ' + Math.round(x.d / 60) + ' мин' : ''}</small></span>
          <span class="l33-k" title="убийства / смерти / помощь"><b>${k1}</b> / <i>${d1}</i> / <b>${a1}</b></span>
          <span class="grd q-grd l33-gr" data-l33="${x.mid}:${p.id}">…</span>
          <span class="l33-res">${x.w ? 'Победа' : 'Поражение'}</span></a>`; }).join('')}</div>`;
  }; }
async function l33Fill(aid, mids) {
  try { await bulkMeta(mids); } catch (e) {}
  $$('.l33-gr[data-l33]').forEach(el => {
    const [mid, a] = el.dataset.l33.split(':').map(Number), r = typeof u26Score === 'function' ? u26Score(mid, a) : null;
    if (!r) { el.textContent = '—'; el.title = 'нет данных матча'; return; }
    el.textContent = r.g; el.style.setProperty('--gc', gradeCol(r.g)); el.title = `Оценка ${r.g}: ${r.s} из 100 против 11 других игроков матча`; el.classList.add('u26-pop');
  });
}
