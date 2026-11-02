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
  const L = OV.L || [], me = ME && L.find(p => p.id === ME.id), mt = me ? me.team : 0;
  const row = p => { const wr = p.hm ? Math.round(100 * p.hw / p.hm) : null, t = (p.tags || []).slice(0, 2);
    return `<div class="ov-p${me && p.id === me.id ? ' me' : ''}${OV.sel === p.id ? ' on' : ''}" data-ovp="${p.id}" tabindex="0">
      <img class="hi" src="${esc(hero(p.hid).i)}" alt="" title="${esc(hero(p.hid).n)}"><span class="nm"><b>${esc(p.name)}</b><small>${esc(hero(p.hid).n)}</small></span>
      <span class="rk" title="${esc(rankOf(p.badge).name)}">${p.badge ? rankImg(p.badge, 'rk') : ''}</span>
      <span class="st"><b class="${wr == null ? '' : wr >= 52 ? 'win' : wr <= 46 ? 'loss' : ''}">${wr == null ? '—' : wr + '%'}</b><small>${p.hm ? games(p.hm) : 'нет игр'}</small></span>
      <span class="tg">${t.map(x => `<i class="${x[0]}" title="${esc(x[2])}">${esc(x[1])}</i>`).join('')}</span>
      ${OV.sel === p.id ? ovMore(p) : ''}</div>`; };
  const team = (k, nm) => `<div class="ov-t"><div class="ov-th"><i style="background:${k ? 'var(--q-sp)' : 'var(--q-am)'}"></i>${nm}</div>${L.filter(p => p.team === k).map(row).join('')}</div>`;
  const b = $('#ovb'); if (b) b.innerHTML = team(mt, me ? 'Твоя команда' : 'Янтарная рука') + team(1 - mt, me ? 'Противники' : 'Сапфировое пламя');
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
  $('#ovb').onclick = e => { const r = e.target.closest('[data-ovp]'); if (!r || e.target.closest('a')) return; const id = +r.dataset.ovp; OV.sel = OV.sel === id ? 0 : id; ovDraw(); };
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
