// ===================== lg38 (07.11) — «12 ч» в лайв-матче: игры берём из истории игрока =====================
// Андрей: на плитке «12 ч · 80 % · 5 игр», а во всплывашке «Игр за 12 часов нет». Цифра на плитке — из статистики героев
// (там все игры), а список — из базы разобранных матчей, которая отстаёт на часы. Если списка нет, а игры есть —
// берём их из истории матчей игрока (players/<id>/match-history: она полная и свежая).
{ const PH1 = perHTML; perHTML = function (p, k) {
    const out = String(PH1.apply(this, arguments));
    if (k !== '12' || !p || !p.id || p._l38 || !(p.p12 && p.p12.m) || out.indexOf('Игр за 12 часов нет') < 0) return out;
    setTimeout(() => l38Fill(p), 0);
    return `<div class="q-poh"><b>${esc(p.name)}</b><small>за 12 часов · ${games(p.p12.m)}</small></div><div class="sub" data-l38="${p.id}">Загружаю игры…</div>`;
  }; }
async function l38Fill(p) {
  const H = await api('players/' + p.id + '/match-history').catch(() => []);
  const t12 = now() - 12 * 3600, have = new Set((p.rc || []).map(x => x.mid));
  const add = (H || []).filter(m => (m.start_time || 0) >= t12 && !have.has(m.match_id)).map(m => ({mid: m.match_id, hid: m.hero_id,
    w: m.player_team === m.match_result, kda: `${m.player_kills || 0}/${m.player_deaths || 0}/${m.player_assists || 0}`, t: m.start_time || 0, d: m.match_duration_s || 0}));
  p.rc = (p.rc || []).concat(add).sort((a, b) => (b.t || 0) - (a.t || 0));
  p._l38 = 1;
  const html = perHTML(p, '12');
  document.querySelectorAll(`[data-l38="${p.id}"]`).forEach(el => {
    const box = el.parentElement; if (!box) return;
    const head = box.querySelector('.q-poh'); if (head) head.remove();
    el.outerHTML = html;
  });
}
