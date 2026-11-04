// ===================== lg26 — 04.11 (ночь 5): одна оценка везде, разбор сводкой, ник → профиль, живой герой, «Лобби» =====================
// Андрей: «в таблице пишет C, перехожу — там A−»; «нажал на ник — должно перекидывать в профиль»; «смерти короче: от кого и сколько лежал,
// потом итог и сколько лежат в среднем»; «разбор в целом — сводкой»; «в Героях слева — живой аватар, а лучше как в Marvel Snap»;
// «настройки оверлея на сайте не работают — убери вкладку, сделай настройки лобби».

// ---------- 1. одна оценка: против 11 других игроков этого матча (как в разборе), а не против «типичного игрока» ----------
// В строках профиля раньше была оценка из истории (души/KDA против среднего на герое), в матче — против лобби: отсюда C и A−.
// Теперь везде — лобби (mAnalyze по метаданным матча). Пока метаданные не пришли — старая оценка серым, потом заменяется.
const U26G = new Map();
function u26Score(mid, aid) {
  const k = mid + ':' + aid; if (U26G.has(k)) return U26G.get(k);
  const M = MD.get(mid); if (!M || !M.players || !M.players.length) return null;
  const P = M.players.map(p => p.stats ? p : Object.assign({}, p, {stats: [p.final_stats || {}]}));
  const me = P.find(p => p.account_id === aid); if (!me) return null;
  let A; try { A = mAnalyze({players: P, duration_s: M.duration_s || 0, winning_team: M.winning_team}); } catch (e) { return null; }
  const a = A.get(me); if (!a) return null;
  const r = {s: a.score, g: gradeOf(a.score)}; U26G.set(k, r); return r;
}
{ const G0 = grdHTML; grdHTML = function (m) {
    const aid = m.account_id || (PROF && PROF.id) || (ME && ME.id) || 0, dur = Math.max(300, m.match_duration_s || 600);
    if (m.abandoned_time_s && m.abandoned_time_s < dur - 60) return G0(m);
    const r = aid ? u26Score(m.match_id, aid) : null;
    if (!r) return G0(m).replace('class="grd q-grd"', `class="grd q-grd u26-wait" data-gm="${m.match_id}" data-ga="${aid}"`);
    return `<span class="grd q-grd" style="--gc:${gradeCol(r.g)}" title="Оценка ${r.g}: ${r.s} из 100 против 11 других игроков матча (50 — средний)">${r.g}</span>`;
  }; }
function u26Fill() {
  $$('.u26-wait[data-gm]').forEach(el => { const r = u26Score(+el.dataset.gm, +el.dataset.ga); if (!r) return;
    el.classList.remove('u26-wait'); el.removeAttribute('data-gm'); el.textContent = r.g; el.style.setProperty('--gc', gradeCol(r.g));
    el.title = `Оценка ${r.g}: ${r.s} из 100 против 11 других игроков матча (50 — средний)`; el.classList.add('u26-pop'); });
}
{ const B0 = bulkMeta; bulkMeta = async function () { const r = await B0.apply(this, arguments); try { u26Fill(); } catch (e) {} return r; }; }
// разбор: вместо «5 из 10» — та же буква, что в таблице и в «Обзоре»
{ const C0 = mCo; mCo = function () {
    let h = C0();
    try { const X = MX, p = mSel(), a = X.A.get(p) || {score: 50}, g = gradeOf(a.score);
      h = h.replace(/<div class="co-g" style="--g:\d+"><b>\d+<\/b><small>из 10<\/small><\/div>/, `<div class="u26-g" style="--gc:${gradeCol(g)}" title="${a.score} из 100 против 11 других игроков матча"><b>${g}</b><small>${a.score}/100</small></div>`);
      h = h.replace(/(<li>)?(Победа|Поражение), \d+\/10\.(<\/li>)?/, ''); } catch (e) {}
    return u26Co(h);
  }; }

// ---------- 2. «Обзор»: ник — ссылка на профиль; без подписи-пояснения ----------
document.addEventListener('click', e => {
  const nm = e.target.closest('.r9-pc .r9-pn b'); if (!nm) return;
  const c = nm.closest('.r9-pc'), p = MX && MX.P ? MX.P.find(q => String(q.player_slot) === c.dataset.sl) : null;
  if (!p || !p.account_id) return;
  e.preventDefault(); e.stopPropagation(); location.href = `?id=${p.account_id}#home`;
}, true);
{ const B9 = r9Board; r9Board = function (X) { return B9(X).replace(/<p class="r9-bf">[\s\S]*?<\/p>/, '')
    .replace(/<span class="r9-pn"><b>/g, '<span class="r9-pn"><b class="u26-nm" title="Профиль игрока">'); }; }

// ---------- 3. разбор сводкой: плитки сверху, смерти коротко (кто, сколько лежал, итог, среднее), остальное — по делу ----------
function u26Deaths(X, p) {
  const DL = (p.death_details || []).map(d => ({t: d.game_time_s || 0, u: d.death_duration_s || 0, k: X.P.find(q => q.player_slot === d.killer_player_slot)})).sort((a, b) => a.t - b.t);
  if (!DL.length) return `<h4 class="co10-h">Смерти</h4><div class="u26-ds g"><b>Ни разу не умер</b></div>`;
  let C = []; try { C = coDeathCtx(X, p, coFacts(p)); } catch (e) {}
  const ctx = t => C.find(c => Math.abs(c.t - t) < 1) || {};
  const sum = DL.reduce((s, d) => s + d.u, 0), pct = Math.round(100 * sum / Math.max(60, X.dur));
  const O = X.P.filter(q => q !== p), avg = O.reduce((s, q) => s + (q.death_details || []).reduce((a, d) => a + (d.death_duration_s || 0), 0), 0) / Math.max(1, O.length);
  const badge = Math.round(((X.mi.average_badge_team0 || 0) + (X.mi.average_badge_team1 || 0)) / ((X.mi.average_badge_team0 ? 1 : 0) + (X.mi.average_badge_team1 ? 1 : 0) || 1));
  const rk = badge ? rankOf(badge).name : '';
  const by = new Map(); DL.forEach(d => { if (d.k) by.set(d.k, (by.get(d.k) || 0) + 1); });
  const kl = [...by].sort((a, b) => b[1] - a[1]);
  const diff = sum - avg, dc = diff > 30 ? 'r' : diff < -30 ? 'g' : '';
  const rows = DL.map(d => { const c = ctx(d.t), tg = [];
    if (c.mates === 0) tg.push('один'); if (c.fo && c.fo.first && c.fo.n >= 3) tg.push('первым в драке'); if (c.ttk != null && c.ttk < 3) tg.push('врасплох');
    return `<div class="u26-d"><time>${mmss(d.t)}</time><span class="k">${d.k ? face(d.k.hero_id, 'g', 's') + `<b>${esc(hero(d.k.hero_id).n)}</b>` : '<b>—</b>'}</span>
      <span class="w">${tg.map(x => `<i>${x}</i>`).join('')}</span><span class="u" title="сколько лежал мёртвым">${mmss(d.u)}</span></div>`; }).join('');
  return `<h4 class="co10-h">Смерти · ${DL.length}</h4>
    <div class="u26-dl">${rows}</div>
    <div class="u26-ds ${dc}">
      <span><small>мёртвым</small><b>${mmss(sum)}</b><em>${pct}% матча</em></span>
      <span><small>в среднем${rk ? ' · ' + esc(rk) : ''}</small><b>${mmss(avg)}</b><em>у 11 других в этом матче</em></span>
      <span><small>разница</small><b class="${dc}">${diff >= 0 ? '+' : '−'}${mmss(Math.abs(diff))}</b><em>${diff > 30 ? 'лежал дольше' : diff < -30 ? 'лежал меньше' : 'как все'}</em></span>
      ${kl.length ? `<span class="kl"><small>убивали</small><b>${kl.slice(0, 3).map(([q, n]) => `${esc(hero(q.hero_id).n)}${n > 1 ? ' ×' + n : ''}`).join(' · ')}</b></span>` : ''}
    </div>`;
}
function u26Co(html) {
  const X = MX, p = mSel(); if (!X || !p) return html;
  const t = document.createElement('template'); t.innerHTML = html; const R = t.content, art = R.querySelector('.co2-txt'); if (!art) return html;
  // заголовок — вердикт, а не случайная строка из текста
  const a = X.A.get(p) || {score: 50}, vd = a.score >= 65 ? 'Отыграл отлично' : a.score >= 54 ? 'Отыграл хорошо' : a.score >= 44 ? 'Отыграл средне' : 'Отыграл слабо';
  const h3 = R.querySelector('.co-ht h3'); if (h3) h3.textContent = vd;
  // смерти: старые «моменты» и «Посчитай время» → одна короткая таблица
  const hs = [...art.querySelectorAll('h4.co10-h')], dh = hs.find(h => /^Смерти/.test(h.textContent));
  const mo = art.querySelector('.co2-mo'); if (mo) mo.remove();
  art.querySelectorAll('.co10-c.r').forEach(x => x.remove());
  const box = document.createElement('div'); box.className = 'u26-dw'; box.innerHTML = u26Deaths(X, p);
  if (dh) { dh.replaceWith(box); } else art.prepend(box);
  // «Картина игры» + «Как это происходит» → «Главное», не больше 4 строк
  const pic = hs.find(h => /Картина игры/.test(h.textContent)), how = hs.find(h => /Как это происходит/.test(h.textContent));
  const li = []; [pic, how].forEach(h => { if (!h) return; const u = h.nextElementSibling; if (u && u.tagName === 'UL') { li.push(...u.querySelectorAll('li')); u.remove(); } h.remove(); });
  const keep = li.map(x => x.innerHTML.trim()).filter(x => x && !/^(Победа|Поражение)[,.]/.test(x.replace(/<[^>]+>/g, ''))).slice(0, 4);
  const main = document.createElement('div'); main.className = 'u26-main';
  main.innerHTML = `<div class="u26-sum">${r10Sum(X, p).replace(/<div class="r10-vd[^"]*">[\s\S]*?<\/div>/, '')}</div>${keep.length ? `<h4 class="co10-h">Главное</h4><ul class="co10-r">${keep.map(x => `<li>${x}</li>`).join('')}</ul>` : ''}`;
  art.prepend(main);
  // «Почему так» и прочие длинные абзацы — под «Подробнее»
  const long = [...art.querySelectorAll('h4.co10-h')].filter(h => /Почему так/.test(h.textContent));
  long.forEach(h => { const u = h.nextElementSibling; const d = document.createElement('details'); d.className = 'u26-more'; d.innerHTML = `<summary>${h.textContent}</summary>`; if (u) d.append(u); h.replaceWith(d); });
  art.querySelectorAll('.co-nt').forEach(x => x.remove());
  R.querySelectorAll('.co-nt').forEach(x => x.remove());
  return t.innerHTML;
}

// ---------- 4. «Герои»: слева — живой герой (петля), как карта в Marvel Snap: наклон за мышью, слои на разной глубине, блик ----------
const U26HV = matchMedia('(hover:hover) and (pointer:fine)');
function u26Pv(box) {
  if (!box || box.dataset.u26 === String(HM.hov)) return;
  box.dataset.u26 = String(HM.hov);
  const id = HM.hov, img = box.querySelector('.hm-art');
  if (img && LOOP[id]) { const w = document.createElement('div'); w.className = 'hm-art u26-live'; w.innerHTML = artHTML(id); img.replaceWith(w); const v = w.querySelector('video'); if (v) { v.muted = true; v.play && v.play().catch(() => {}); } }
  if (!box.querySelector('.u26-gl')) box.insertAdjacentHTML('beforeend', '<i class="u26-gl" aria-hidden="true"></i>');
  box.classList.add('u26-card');
  if (box.__u26) return; box.__u26 = 1;
  let raf = 0, tx = 0, ty = 0;
  const go = () => { raf = 0; box.style.setProperty('--rx', (ty * -7).toFixed(2) + 'deg'); box.style.setProperty('--ry', (tx * 9).toFixed(2) + 'deg'); box.style.setProperty('--px', tx.toFixed(3)); box.style.setProperty('--py', ty.toFixed(3)); box.style.setProperty('--gx', (50 + tx * 40).toFixed(1) + '%'); box.style.setProperty('--gy', (50 + ty * 40).toFixed(1) + '%'); };
  box.addEventListener('pointermove', e => { if (!U26HV.matches) return; const r = box.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - .5; ty = (e.clientY - r.top) / r.height - .5; box.classList.add('tilt'); if (!raf) raf = requestAnimationFrame(go); });
  box.addEventListener('pointerleave', () => { tx = ty = 0; box.classList.remove('tilt'); if (!raf) raf = requestAnimationFrame(go); });
}
new MutationObserver(() => { const b = document.getElementById('hmpv'); if (b && b.querySelector('.hm-art')) u26Pv(b); }).observe(document.body, {childList: true, subtree: true});

// ---------- 5. «Оверлей» → «Лобби»: что показывать на карточках лайв-матча (настройки мода — в игре, Esc → RESTLESS) ----------
const U26L = [['rank', 'Ранг', '.l10-rk,.l10-rn'], ['hr', 'Место на герое', '.l13-hr'], ['st', 'Игры и винрейт', '.l10-st'], ['per', 'Форма 12 ч / 30 дн', '.l10-per'],
  ['rc', 'Последние матчи', '.l10-rc'], ['bld', 'Сборка игрока', '.q-pbld'], ['tg', 'Метки', '.q-pc .tg']];
const u26LGet = () => { try { return JSON.parse(localStorage.getItem('rl-lobby') || '{}') || {}; } catch (e) { return {}; } };
function u26LApply() {
  const o = u26LGet(); let css = '';
  U26L.forEach(([k, , sel]) => { if (o[k] === 0) css += sel.split(',').map(s => '#lvb ' + s.trim()).join(',') + '{display:none!important}'; });
  if (o.cmp) css += '#lvb .q-pc{padding:8px 10px}#lvb .q-pc .f{width:44px;height:44px}';
  let st = document.getElementById('u26ls'); if (!st) { st = document.createElement('style'); st.id = 'u26ls'; document.head.appendChild(st); }
  st.textContent = css;
}
u26LApply();
viewOvs = function () {
  vNew(); document.body.classList.remove('ovm'); clearInterval(OV.timer); clearInterval(OV.clk);
  $$('#tabs a').forEach(x => x.classList.toggle('on', x.dataset.t === 'ovs'));
  window.scrollTo(0, 0);
  const o = u26LGet();
  V(`<section class="ovs u26-lb">
    <header class="ovs-h"><h1>Оверлей</h1></header>
    <div class="ovs-st" id="ovsst"></div>
    <section class="u26-lbs"><div class="q-sec"><b>Лобби · карточки игроков</b></div>
      <div class="u26-lbg" id="u26lb">${U26L.map(([k, nm]) => `<label class="u26-sw"><input type="checkbox" data-k="${k}"${o[k] === 0 ? '' : ' checked'}><span class="tr"></span><b>${nm}</b></label>`).join('')}
        <label class="u26-sw"><input type="checkbox" data-k="cmp"${o.cmp ? ' checked' : ''}><span class="tr"></span><b>Компактнее</b></label></div>
      <p class="u26-gm">Мод в игре — <b>Esc → RESTLESS</b></p></section>
    ${o18Fps()}
  </section>`);
  ovsPaint(); o18FpsBind();
  $('#u26lb').onchange = e => { const c = e.target.closest('[data-k]'); if (!c) return; const s = u26LGet(); s[c.dataset.k] = c.checked ? (c.dataset.k === 'cmp' ? 1 : undefined) : 0;
    if (c.dataset.k === 'cmp' && !c.checked) delete s.cmp; try { localStorage.setItem('rl-lobby', JSON.stringify(s)); } catch (er) {} u26LApply(); };
};
// подпись вкладки
{ const fix = () => { const a = document.querySelector('#tabs [data-t="ovs"]'); if (a && !a.dataset.u26) { a.dataset.u26 = 1; } };
  new MutationObserver(fix).observe(document.body, {childList: true, subtree: true}); fix(); }
