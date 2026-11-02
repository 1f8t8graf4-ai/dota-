// ===================== lg11 — 04.11, третьи скрины: оверлей как Porofessor, больше меток, разбор без «воды» =====================

// ---------- Оверлей: ?ov=1#ov — компактная панель матча для Steam-оверлея (Shift+Tab → Веб-браузер) или второго монитора ----------
// Каждые 20 с проверяет, в матче ли игрок. Нашёлся матч — все 12: герой, ранг, винрейт на герое, метки; нажал — подробнее и профиль.
// Матч кончился — ссылка на разбор. #ov/demo — пример на любом идущем сейчас матче.
const OV = {mid: 0, t: 0, sel: 0, L: null, timer: 0, clk: 0, demo: false};
function ovStatus(s) { const el = $('#ovst'); if (el) el.textContent = s; }
function ovMore(p) {
  const per = (nm, o) => `<span><small>${nm}</small><b class="${o && o.m ? (o.w / o.m >= .52 ? 'win' : o.w / o.m <= .46 ? 'loss' : '') : ''}">${o && o.m ? Math.round(100 * o.w / o.m) + '%' : '—'}</b><em>${o && o.m ? games(o.m) : 'не играл'}</em></span>`;
  return `<div class="ov-m">${per('12 ч', p.p12)}${per('30 дн', p.p30)}<span><small>всего</small><b>${p.tm ? pc(p.tw, p.tm) + '%' : '—'}</b><em>${p.tm ? games(p.tm) : ''}</em></span>
    ${p.rc && p.rc.length ? `<div class="ov-rc">${p.rc.slice(0, 6).map(r => `<img class="${r.w ? 'w' : 'l'}" src="${esc(hero(r.hid).i)}" alt="" title="${esc(hero(r.hid).n)} · ${r.w ? 'победа' : 'поражение'}">`).join('')}</div>` : ''}
    ${(p.tags || []).length > 2 ? `<div class="ov-tg2">${p.tags.slice(2).map(x => `<i class="${x[0]}" title="${esc(x[2])}">${esc(x[1])}</i>`).join('')}</div>` : ''}
    ${p.id ? `<a class="ov-pf" href="?id=${p.id}#home" target="_blank" rel="noopener">Открыть профиль ↗</a>` : ''}</div>`;
}
function ovDraw() {
  const L = OV.L || [], me = ME && L.find(p => p.id === ME.id), mt = me ? me.team : 0, en = L.filter(p => p.team !== mt), us = L.filter(p => p.team === mt);
  const thr = en.slice().sort((a, b) => b.threat - a.threat)[0];
  const team = (P, k, isEn) => `<div class="q-team"><div class="q-th"><i style="background:${k ? 'var(--q-sp)' : 'var(--q-am)'}"></i><b>${k ? 'Сапфировое пламя' : 'Янтарная рука'}</b><small>${me ? (isEn ? 'противники' : 'твоя команда') : ''}</small></div><div class="q-lob">${P.map(p => pCard(p, isEn, isEn && p === thr, me ? me.id : 0)).join('')}</div></div>`;
  const b = $('#ovb'); if (!b) return;
  b.innerHTML = `<div id="lvb">${team(us, mt, false)}${team(en, 1 - mt, true)}</div>`;
  $$('#ovb a[href^="?id="]').forEach(a => { a.target = '_blank'; a.rel = 'noopener'; });
  LVL = L; try { pBuilds(VQ, L); } catch (e) {}
}
function ovToggle() { const o = $('#ov'); if (!o) return; o.classList.toggle('min'); const x = $('#ovx'); if (x) x.textContent = o.classList.contains('min') ? '+' : '–'; }
async function viewOv() {
  const n = vNew(); clearInterval(OV.timer); clearInterval(OV.clk); document.body.classList.add('ovm');
  OV.demo = /^#ov\/demo/.test(location.hash); OV.mid = 0; OV.L = null; OV.sel = 0;
  const link = `${location.origin}${location.pathname}?id=${ME ? ME.id : 'ТВОЙ_ID'}&ov=1#ov`;
  V(`<div class="ov" id="ov"><header class="ov-h"><b class="ov-lg">RESTLESS</b><span class="ov-st" id="ovst">…</span>${OV.demo ? '<span class="ov-dm">пример</span>' : ''}<button class="ov-x" id="ovx" type="button" title="Скрыть / показать (H)" aria-label="Скрыть или показать">–</button></header>
    <div class="ov-b" id="ovb"><div class="load">Проверяю матч…</div></div>
    <details class="ov-how"><summary>Как открыть поверх игры</summary><ol>
      <li>В Deadlock нажми <b>Shift+Tab</b> — откроется оверлей Steam.</li>
      <li>Нажми <b>Веб-браузер</b> и вставь ссылку:<code id="ovln">${esc(link)}</code><button class="btn s g" id="ovcp" type="button">Скопировать</button></li>
      <li>Нажми на булавку окна — оно останется поверх игры. <b>H</b> — скрыть и показать.</li>
      <li>Или просто открой ссылку на втором мониторе.</li></ol></details></div>`);
  $('#ovx').onclick = ovToggle;
  $('#ovcp').onclick = e => { const b = e.currentTarget; if (navigator.clipboard) navigator.clipboard.writeText(link).then(() => { b.textContent = 'Скопировано ✓'; }).catch(() => {}); };
  $('#ovb').onclick = e => { const pr = e.target.closest('[data-per]'); if (pr) { const p = LVL.find(x => String(x.id) === pr.dataset.acc); if (p) qPop(pr, perHTML(p, pr.dataset.per)); return; }
    const pb = e.target.closest('[data-pb]'); if (pb) { qPop(pb, pbHTML(pb.dataset.pb)); pbNamed(pb.dataset.pb); } };
  if (!ME && !OV.demo) { ovStatus('нет профиля'); put(n, '#ovb', '<div class="ov-e">Найди себя в поиске сверху на сайте — оверлей запомнит профиль и сам найдёт твой матч.<a class="btn" href="#ov/demo">Показать на примере</a></div>'); return; }
  const check = async () => {
    if (n !== VQ) { clearInterval(OV.timer); return; }
    let m = null, ok = true;
    try { const A = await live(OV.demo ? 'matches/active' : `matches/active?account_id=${ME.id}`); m = OV.demo ? ((OV.mid && (A || []).find(x => x.match_id === OV.mid)) || (A || [])[0] || null) : (A || [])[0] || null; } catch (e) { ok = false; }
    if (n !== VQ) return;
    if (!ok) { ovStatus('нет связи · повторю через 20 с'); return; }
    if (!m) {
      if (OV.mid && !OV.demo) { const mid = OV.mid; OV.mid = 0; OV.L = null; clearInterval(OV.clk); ovStatus('матч закончился'); put(n, '#ovb', `<div class="ov-e">Матч закончился.<a class="btn" href="#m/${mid}/co" target="_blank" rel="noopener">Разбор матча ↗</a></div>`); return; }
      ovStatus('жду матч · проверяю каждые 20 с');
      if (!OV.L) put(n, '#ovb', `<div class="ov-e">Сейчас ты не в матче. Как только найдётся — здесь появятся все 12 игроков.${OV.demo ? '' : '<a class="btn g" href="#ov/demo">Показать на примере</a>'}</div>`);
      return;
    }
    if (m.match_id !== OV.mid) {
      OV.mid = m.match_id; OV.t = m.start_time; OV.L = null; OV.sel = 0; ovStatus('матч найден · смотрю игроков…');
      put(n, '#ovb', '<div class="load">Смотрю ранги, героев и серии всех 12…</div>');
      const L = await scout2(m.players, {mid: m.match_id}).catch(() => null); if (n !== VQ) return;
      if (!L) { put(n, '#ovb', '<div class="ov-e">Не вышло загрузить игроков. Попробую ещё раз через 20 с.</div>'); OV.mid = 0; return; }
      OV.L = L; ovDraw();
      clearInterval(OV.clk); const tickT = () => { if (n !== VQ) return clearInterval(OV.clk); if (OV.t) ovStatus(`${OV.demo ? 'идёт матч' : 'ты в матче'} · ${mmss(Math.max(0, now() - OV.t))}`); }; tickT(); OV.clk = setInterval(tickT, 1000);
    }
  };
  check(); OV.timer = setInterval(check, 20000);
}
addEventListener('keydown', e => { if (!document.body.classList.contains('ovm') || /INPUT|TEXTAREA/.test((e.target || {}).tagName || '')) return; if (e.key === 'h' || e.key === 'H' || e.key === 'р' || e.key === 'Р') ovToggle(); });
{ const R0 = route; route = function () { if (/^#ov(\/|$)/.test(location.hash)) return viewOv(); document.body.classList.remove('ovm'); clearInterval(OV.timer); clearInterval(OV.clk); return R0.apply(this, arguments); }; }
// кнопка оверлея на лайв-матче
{ const VL0 = viewLive; viewLive = async function () { const r = await VL0.apply(this, arguments); const h = $('.q-lvh'); if (h && !$('#lvov', h)) h.insertAdjacentHTML('beforeend', '<a class="btn g s" id="lvov" href="?ov=1#ov" target="_blank" rel="noopener" title="Компактная панель матча поверх игры">Оверлей ↗</a>'); return r; }; }

// ---------- больше меток: профиль, строка матча ----------
{ const PT0 = profTags; profTags = function (H, HS, HA) {
  const T = PT0(H, HS, HA) || [], L = (H || []).slice(0, 60);
  if (L.length >= 20) {
    const hr = m => new Date(m.start_time * 1000).getHours(), night = L.filter(m => { const h = hr(m); return h >= 0 && h < 6; }).length;
    if (night / L.length >= .35) T.push(['Ночной игрок', 'b', `${Math.round(100 * night / L.length)}% игр — с полуночи до 6 утра`]);
    const days = new Set(L.filter(m => m.start_time > now() - 7 * 86400).map(m => new Date(m.start_time * 1000).toDateString()));
    if (days.size >= 6) T.push(['Каждый день', 'b', `играл ${days.size} из последних 7 дней`]);
    const byDay = {}; L.filter(m => m.start_time > now() - 30 * 86400).forEach(m => { const k = new Date(m.start_time * 1000).toDateString(); byDay[k] = (byDay[k] || 0) + 1; });
    const dv = Object.values(byDay); if (dv.length >= 4 && dv.reduce((a, x) => a + x, 0) / dv.length >= 6) T.push(['Длинные сессии', 'b', `в среднем ${f1(dv.reduce((a, x) => a + x, 0) / dv.length)} игр за день, когда играет`]);
    const rk = L.filter(m => /ранг/i.test(MODE(m))).length;
    if (rk / L.length >= .7) T.push(['Играет ранговые', 'a', `${Math.round(100 * rk / L.length)}% последних игр — ранговые`]);
    else if (rk === 0) T.push(['Только обычные', '', 'в последних играх ни одной ранговой']);
    const lastW = L.slice(0, 10).filter(m => m.player_team === m.match_result).length;
    if (L.length >= 10 && lastW >= 7) T.push(['Горячая рука', 'g', `${lastW} побед в последних 10`]);
  }
  return T; }; }
{ const MT0 = mMiniTags; mMiniTags = function (m, CNT) {
  const T = (MT0(m, CNT) || []).slice(), dur = (m.match_duration_s || 0) / 60;
  if (m.player_kills >= 12) T.push(['Много убийств', 'g', `${m.player_kills} убийств`]);
  if (m.player_assists >= 20) T.push(['Командный', 'g', `${m.player_assists} помощи`]);
  if (dur >= 45) T.push(['Долгая игра', 'b', `${Math.round(dur)} минут`]);
  else if (dur && dur < 22) T.push(['Быстрая игра', 'b', `${Math.round(dur)} минут`]);
  return T; }; }

// ---------- разбор без «воды»: убираем фразы-лозунги, оставляем факты и советы ----------
const CO11_FLUFF = [/^Каждая такая минута[^.]*\.?$/i, /^Это сохрани\.?$/i, /\s*—?\s*это хорошо, не теряй это\.?/i, /\s*Это сохрани\.?/i, /\s*Увидел угрозу — вышел\.?/i];
{ const CF0 = co10Fix; co10Fix = function (html) {
  const out = CF0(html), t = document.createElement('template'); t.innerHTML = out;
  t.content.querySelectorAll('.co10-r li').forEach(li => { let h = li.innerHTML; CO11_FLUFF.forEach(re => { h = h.replace(re, ''); }); h = h.trim(); if (!h.replace(/<[^>]+>/g, '').trim()) li.remove(); else li.innerHTML = h; });
  t.content.querySelectorAll('.co10-r').forEach(ul => { if (!ul.children.length) { const p = ul.previousElementSibling; if (p && p.classList.contains('co10-h')) p.remove(); ul.remove(); } });
  t.content.querySelectorAll('.co2-why, .co-nt').forEach(x => x.remove());
  return t.innerHTML; }; }

// ===================== lg11 · вторая часть (04.11, четвёртые скрины) =====================
// ---------- метки игрока в разборе матча: считаем против всех 12 и своей команды ----------
function mTags(X, p) {
  const P = X.P, mine = P.filter(q => teamOf(q.team) === teamOf(p.team)), won = teamOf(p.team) === X.win, ls = q => mLS(q), dur = X.dur / 60, T = [];
  const v = (q, k) => k === 'nw' ? (q.net_worth || 0) : k === 'k' ? (q.kills || 0) : k === 'd' ? (q.deaths || 0) : k === 'a' ? (q.assists || 0) : (ls(q)[k] || 0);
  const top = (L, k) => L.every(q => q === p || v(q, k) <= v(p, k)) && v(p, k) > 0, low = (L, k) => L.every(q => q === p || v(q, k) >= v(p, k));
  const tk = mine.reduce((s, q) => s + v(q, 'k'), 0), kp = tk ? Math.round(100 * (v(p, 'k') + v(p, 'a')) / tk) : 0, kda = (v(p, 'k') + v(p, 'a')) / Math.max(1, v(p, 'd'));
  if (top(P, 'nw')) T.push(['Больше всех душ', 'a', `самый богатый в матче: ${kfm(v(p, 'nw'))}`]);
  else if (top(mine, 'nw')) T.push(['Самый богатый в команде', 'a', `${kfm(v(p, 'nw'))} душ`]);
  if (top(P, 'player_damage')) T.push(['Больше всех урона', 'a', `${kfm(v(p, 'player_damage'))} урона по героям — больше всех`]);
  if (top(P, 'boss_damage')) T.push(['Ломал объекты', 'b', `${kfm(v(p, 'boss_damage'))} урона по объектам — больше всех`]);
  if (top(P, 'player_healing') && v(p, 'player_healing') > 2000) T.push(['Лучший лекарь', 'g', `${kfm(v(p, 'player_healing'))} лечения — больше всех`]);
  if (top(P, 'player_damage_taken')) T.push(['Танк матча', 'b', `${kfm(v(p, 'player_damage_taken'))} урона принял — больше всех`]);
  if (top(P, 'k')) T.push(['Главный убийца', 'g', `${v(p, 'k')} убийств — больше всех`]);
  if (top(P, 'a')) T.push(['Лучший помощник', 'g', `${v(p, 'a')} помощи — больше всех`]);
  if (top(P, 'denies') && v(p, 'denies') >= 10) T.push(['Денаил', 'b', `${v(p, 'denies')} денаев — больше всех`]);
  if (kp >= 70) T.push(['В каждой драке', 'g', `участие в убийствах команды — ${kp}%`]);
  else if (tk >= 10 && kp <= 30) T.push(['Почти не дрался', 'r', `участие в убийствах команды — ${kp}%`]);
  if (!v(p, 'd') && dur >= 15) T.push(['Без смертей', 'g', `ни одной смерти за ${Math.round(dur)} минут`]);
  else if (P.every(q => q === p || v(q, 'd') <= v(p, 'd')) && v(p, 'd') >= 8) T.push(['Больше всех смертей', 'r', `${v(p, 'd')} смертей — больше всех в матче`]);
  if (kda >= 6 && v(p, 'd')) T.push(['Высокий KDA', 'g', `(убийства + помощь) / смерти = ${f1(kda)}`]);
  if (dur >= 20 && low(mine, 'player_damage')) T.push(['Мало урона', 'r', 'меньше всех урона по героям в команде']);
  const opp = P.filter(q => q.assigned_lane === p.assigned_lane && teamOf(q.team) !== teamOf(p.team)), mate = P.filter(q => q.assigned_lane === p.assigned_lane && teamOf(q.team) === teamOf(p.team));
  if (opp.length && X.dur > 600) { const d10 = mate.reduce((s, q) => s + mAt(q, 600), 0) - opp.reduce((s, q) => s + mAt(q, 600), 0);
    if (d10 >= 1200) T.push(['Выиграл линию', 'g', `+${nf(Math.round(d10))} душ к 10-й минуте`]); else if (d10 <= -1200) T.push(['Проиграл линию', 'r', `${nf(Math.round(d10))} душ к 10-й минуте`]); }
  if (!won && top(mine, 'nw')) T.push(['Тащил проигранную', 'g', 'самый богатый в проигравшей команде']);
  if (won && low(mine, 'nw') && dur >= 20) T.push(['Затащили', 'b', 'победа при самых малых душах в команде']);
  if (dur >= 15 && v(p, 'creep_kills') / dur >= 9) T.push(['Фармила', 'g', `${f1(v(p, 'creep_kills') / dur)} крипов в минуту`]);
  const rk = k => 1 + P.filter(q => v(q, k) > v(p, k)).length, avgD = P.reduce((s2, q) => s2 + v(q, 'd'), 0) / P.length;
  if (!top(P, 'player_damage') && rk('player_damage') <= 3) T.push(['Топ-3 по урону', 'g', `${rk('player_damage')}-й по урону из ${P.length}`]);
  if (!top(P, 'nw') && !top(mine, 'nw') && rk('nw') <= 3) T.push(['Топ-3 по душам', 'a', `${rk('nw')}-й по душам из ${P.length}`]);
  if (low(P, 'nw') && dur >= 15) T.push(['Меньше всех душ', 'r', 'самый бедный в матче']);
  if (!v(p, 'k') && dur >= 15) T.push(['Без убийств', 'r', `0 убийств за ${Math.round(dur)} минут`]);
  if (v(p, 'a') >= 8 && v(p, 'a') >= 3 * Math.max(1, v(p, 'k'))) T.push(['Играл от помощи', 'b', `${v(p, 'a')} помощи при ${v(p, 'k')} убийствах`]);
  if (dur >= 20 && v(p, 'd') > 0 && v(p, 'd') <= 2) T.push(['Мало смертей', 'g', `всего ${v(p, 'd')} за игру`]);
  else if (v(p, 'd') >= 6 && v(p, 'd') >= 1.4 * avgD && !T.some(t => t[0] === 'Больше всех смертей')) T.push(['Много смертей', 'r', `${v(p, 'd')} смертей — в среднем в матче ${f1(avgD)}`]);
  return T;
}
const mTagsHTML = (X, p) => { const T = mTags(X, p); return T.length ? `<div class="r11-tg">${T.slice(0, 10).map(([s, c, h]) => `<span class="tag ${c}" title="${esc(h)}">${esc(s)}</span>`).join('')}</div>` : ''; };
{ const R10 = r10Sum; r10Sum = function (X, p) { return mTagsHTML(X, p) + R10(X, p); }; }

// ---------- больше меток в строке матча (до 20 правил), показываем до 3 ----------
{ const MT1 = mMiniTags; mMiniTags = function (m, CNT) {
  const T = (MT1(m, CNT) || []).slice(), dur = (m.match_duration_s || 0) / 60, k = m.player_kills || 0, d = m.player_deaths || 0, a = m.player_assists || 0;
  if (dur >= 20 && d > 0 && d <= 2) T.push(['Мало смертей', 'g', `всего ${d} за ${Math.round(dur)} минут`]);
  if (dur >= 20 && !k) T.push(['Без убийств', 'r', `0 убийств за ${Math.round(dur)} минут`]);
  if (dur >= 25 && a <= 3) T.push(['Мало помощи', 'r', `всего ${a} помощи`]);
  if (k + a >= 25) T.push(['Тащил', 'g', `${k + a} убийств и помощи`]);
  if (dur >= 15 && (m.last_hits || 0) / dur >= 9) T.push(['Фармил крипов', 'g', `${f1(m.last_hits / dur)} добиваний в минуту`]);
  if ((m.denies || 0) >= 25) T.push(['Денаил', 'b', `${m.denies} денаев`]);
  if (m.ranked_delta > 0) T.push(['Поднял ранг', 'g', `+${m.ranked_delta} очков ранга`]);
  else if (m.ranked_delta < 0) T.push(['Потерял ранг', 'r', `${m.ranked_delta} очков ранга`]);
  if (m.ranked_calibration_match) T.push(['Калибровка', 'b', 'матч калибровки ранга']);
  if (m.ranked_used_demotion_protection) T.push(['Спасла защита', 'r', 'сработала защита от понижения ранга']);
  if (m.abandoned_time_s) T.push(['Вышел из игры', 'r', `покинул матч на ${mmss(m.abandoned_time_s)}`]);
  return T; }; }
// ---------- повтор матча: файл .dem из Valve (ссылку даёт API) ----------
async function rpOpen(btn, mid) {
  qPop(btn, '<div class="load" style="padding:8px">Ищу файл повтора…</div>');
  let s = null; try { s = await api('matches/' + mid + '/salts'); } catch (e) {}
  const url = s && s.demo_url ? s.demo_url.replace(/^http:/, 'https:') : '';
  qPop(btn, url ? `<div class="rp"><b>Повтор матча № ${mid}</b>
    <a class="btn" href="${esc(url)}" target="_blank" rel="noopener">Скачать повтор (.dem.bz2) ↗</a>
    <ol><li>Распакуй архив (7-Zip или WinRAR) — получится файл <code>.dem</code>.</li><li>Положи его в <code>Steam\\steamapps\\common\\Deadlock\\game\\citadel\\replays\\</code></li><li>В игре открой консоль и введи <code>playdemo replays/${mid}_…</code> (имя файла без .dem).</li></ol>
    <small>2D-повтор прямо на сайте — вкладка «Карта».</small></div>`
    : `<div class="rp"><b>Повтора пока нет</b><small>Valve отдаёт файл не для всех матчей. Попробуй через час. 2D-повтор — вкладка «Карта».</small></div>`);
}
{ const MO11 = mOv; mOv = function () { return MO11().replace('<div class="r9-pb">', `<div class="r9-pb"><button type="button" class="btn g" data-rp="${MX.mid}">Повтор матча ⬇</button>`); }; }
document.addEventListener('click', e => { const b = e.target.closest('[data-rp]'); if (!b) return; e.preventDefault(); e.stopPropagation(); rpOpen(b, b.dataset.rp); }, true);

// ---------- профиль: «Что знать» — наверх над играми; слева — средние за 20 игр и лучший матч ----------
function p13Side(H) {
  const L = (H || []).slice(0, 20); if (L.length < 5) return '';
  const n = L.length, s = f => L.reduce((a, m) => a + f(m), 0) / n, mins = m => Math.max(1, (m.match_duration_s || 0) / 60);
  const k = s(m => m.player_kills), d = s(m => m.player_deaths), a = s(m => m.player_assists), spm = s(m => m.net_worth / mins(m)), lh = s(m => (m.last_hits || 0) / mins(m)), dur = s(m => mins(m));
  const best = L.slice().sort((x, y) => (y.player_kills + y.player_assists) / Math.max(1, y.player_deaths) - (x.player_kills + x.player_assists) / Math.max(1, x.player_deaths))[0], bw = best.player_team === best.match_result;
  return `<section class="q-box p13-av"><div class="r9-h2"><b>Средние</b><small>последние ${n}</small></div>
    <div class="p13-g"><span><small>K / D / A</small><b><i class="k">${f1(k)}</i> / <i class="d">${f1(d)}</i> / <i class="a">${f1(a)}</i></b></span><span><small>KDA</small><b>${f2((k + a) / Math.max(.5, d))}</b></span>
    <span><small>Души в минуту</small><b>${nf(Math.round(spm))}</b></span><span><small>Крипы в минуту</small><b>${f1(lh)}</b></span>
    <span><small>Длина игры</small><b>${Math.round(dur)} мин</b></span><span><small>Смертей за игру</small><b class="${d >= 7 ? 'loss' : d <= 4 ? 'win' : ''}">${f1(d)}</b></span></div></section>
    <a class="q-box p13-best" href="#m/${best.match_id}"><small>Лучший матч · последние ${n}</small><span>${face(best.hero_id, bw ? 'g' : 'c', 'm')}<span><b>${esc(hero(best.hero_id).n)}</b><em><i class="k">${best.player_kills}</i> / <i class="d">${best.player_deaths}</i> / <i class="a">${best.player_assists}</i> · <span class="${bw ? 'win' : 'loss'}">${bw ? 'победа' : 'поражение'}</span></em></span><i class="go">›</i></span></a>`;
}
