// ===================== lg13 — 03.11: окно программы = весь сайт, «Оверлей» — настройки, LIVE — на «Лайв-матче» =====================
// Андрей (03.11, вечер): «выделяться должен Лайв-матч, а не Оверлей, и только когда матч идёт»; «оверлей перегружен»;
// «зачем Ctrl+X, если всё на Ctrl+H» — одна клавиша; «12 ч — покажи сами игры: Грейвс 21/1/14, поражение, оценка, переход в матч»;
// «показывай рейтинг васянов»; «курсор как будто выделяешь текст». Программа 0.3.1 грузит сайт ?app=1#home, window.rlHost — preload.js.
const OVS_DL = 'https://github.com/1f8t8graf4-ai/dota-/releases/download/overlay-latest/Restless-Overlay.exe';
const RLH = window.rlHost || null;
const ovLive = () => !!(OV.app && OV.app.live) || (gameLive() && OV.G && OV.G.s === 'm');

// ---------- вкладки: «Оверлей» — тихо справа; «Лайв-матч» горит красным с LIVE, только пока идёт матч ----------
(() => {
  const t = $('#tabs'); if (!t || $('#tabs [data-t="ovs"]')) return;
  t.insertAdjacentHTML('beforeend', `<a href="#ovs" data-t="ovs" class="q-ovt" title="Оверлей поверх игры: настройки"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2"/><rect x="12" y="7" width="6" height="7" rx="1"/><path d="M8 21h8"/></svg><span>Оверлей</span></a>`);
  const lv = $('#tabs [data-t="live"]'); if (lv && !$('.q-lvb', lv)) lv.insertAdjacentHTML('beforeend', '<b class="q-lvb">LIVE</b>');
})();
function ovTabLive() {
  const on = ovLive(), a = $('#tabs [data-t="live"]'); if (a) a.classList.toggle('live', on);
  const b = $('#rlbar'); if (b) b.classList.toggle('live', on);
}

// ---------- полоса окна программы: тянуть окно, ‹ назад, LIVE, клавиша, ✕ ----------
if (RL_APP) {
  document.body.insertAdjacentHTML('afterbegin', `<div class="rl-bar" id="rlbar"><button type="button" class="rl-bk" id="rlbk" title="Назад" aria-label="Назад">‹</button><b class="rl-lg">RESTLESS</b><a class="rl-live" href="#ov" title="Открыть матч">● LIVE</a><span class="rl-k" id="rlkey"></span><button type="button" class="rl-x" id="rlx" title="Скрыть (Esc)" aria-label="Скрыть">✕</button></div>`);
  $('#rlbk').onclick = () => history.back();
  $('#rlx').onclick = () => RLH && RLH.hide();
  // Esc — спрятать окно, если не открыто ничего своего (подсказка, окно патча, рейтинг…) — их Esc закрывает сам
  addEventListener('keydown', e => {
    if (e.key !== 'Escape' || !RLH) return;
    if (document.querySelector('.q-pop, [class$="-ov"], [class*="-ov "], [role="dialog"], .dd:not(.hide)')) return;
    RLH.hide();
  });
}
const rlKey = () => { const a = OV.app || {}, h = a.hk || {}; return h.show || (a.keys && a.keys[0]) || 'Ctrl+Alt+H'; };
function rlKeyLine() { const el = $('#rlkey'); if (el) el.textContent = OV.app ? `${rlKey()} — скрыть` : ''; }
{ const A0 = window.rlApp; window.rlApp = s => { A0(s); ovTabLive(); rlKeyLine(); if (/^#ovs/.test(location.hash)) ovsPaint(); }; }
{ const G0 = window.rlGame; window.rlGame = g => { G0(g); ovTabLive(); if (/^#ovs/.test(location.hash)) ovsPaint(); }; }
setInterval(ovTabLive, 5000);

// ---------- страница «Оверлей» (#ovs): слева — как это выглядит, справа — статус и одна настройка ----------
function ovsPaint() {
  const b = $('#ovsst'); if (!b) return;
  const a = OV.app, live = ovLive(), g = gameLive() ? OV.G : null, m = a && a.mod || {};
  if (!a) {
    b.innerHTML = `<p class="ovs-t1">Нужна программа <b>Restless Overlay</b> — она открывает сайт поверх игры и сама показывает матч.</p>
      <a class="btn ovs-dlb" href="${OVS_DL}">Скачать для Windows</a><small class="ovs-n">Без установки. Игра — в режиме «Оконный без рамки».</small>`;
    return;
  }
  const modOk = /^(ok|cleaned|installed)$/.test(m.status), modTx = {installed: 'поставлен — перезапусти игру', cleaned: 'на месте', ok: 'на месте', busy: 'поставлю, когда закроешь игру', nogame: 'не нашёл Deadlock', error: 'ошибка', wait: 'проверяю…'}[m.status] || '—';
  const row = (k, v, st) => `<div class="ovs-r"><i class="${st}"></i><small>${k}</small><b>${v}</b></div>`;
  b.innerHTML = `${row('Игра', live ? 'LIVE · матч' + (g ? ', игроков ' + g.players.length : '') : g ? 'на связи · укрытие' : a.proc ? 'запущена · жду матч' : 'не запущена', live ? 'live' : g || a.proc ? 'ok' : '')}
    ${row('Мод', esc(modTx), modOk ? 'ok' : m.status === 'error' || m.status === 'nogame' ? 'bad' : '')}
    ${row('Клавиша', esc(rlKey()), 'ok')}
    ${live ? '<a class="btn ovs-go" href="#ov">Открыть матч ›</a>' : ''}
    <label class="ovs-sw"><input type="checkbox" id="ovsau"${a.auto ? ' checked' : ''}${RLH ? '' : ' disabled'}><span class="tr"></span><span>Открывать само, когда нашёлся матч</span></label>`;
  const au = $('#ovsau'); if (au) au.onchange = () => RLH && RLH.setAuto(au.checked);
}
function viewOvs() {
  vNew(); document.body.classList.remove('ovm'); clearInterval(OV.timer); clearInterval(OV.clk);
  $$('#tabs a').forEach(x => x.classList.toggle('on', x.dataset.t === 'ovs'));
  window.scrollTo(0, 0);
  const pl6 = Array.from({length: 6}, (_, i) => `<i style="--d:${i * 60}ms"><u></u><s></s><em></em></i>`).join('');
  V(`<section class="ovs">
    <header class="ovs-h"><h1>Оверлей</h1><p>Restless поверх игры: профиль по клавише, матч — сам.</p></header>
    <div class="ovs-main">
      <div class="ovs-pv" aria-label="Как это выглядит в игре">
        <div class="ovs-scr"><div class="ovs-tb">${'<u></u>'.repeat(6)}<b></b>${'<u></u>'.repeat(6)}</div><div class="ovs-win"><div class="ovs-wh"><b>RESTLESS</b><span>LIVE</span></div><div class="ovs-wl">${pl6}</div><div class="ovs-wl e">${pl6}</div></div></div>
        <small>Нашёлся матч — окно с 12 игроками появляется само. Закрыть — ${esc(rlKey())}, Esc или ✕.</small></div>
      <div class="ovs-st" id="ovsst"></div>
    </div>
    <p class="ovs-soon">Скоро здесь: что показывать в лобби и в игре, где окно и какого размера.</p>
  </section>`);
  ovsPaint();
}
{ const R1 = route; route = function () { if (/^#ovs(\/|$)/.test(location.hash)) return viewOvs(); return R1.apply(this, arguments); }; }

// ---------- «12 ч» на карточке игрока — сами игры: герой, K/D/A, итог, оценка, переход в матч ----------
{ const PH0 = perHTML; perHTML = function (p, k) {
    if (k !== '12') return PH0(p, k);
    const t12 = now() - 12 * 3600, L = (p.rc || []).filter(r => r.t && r.t >= t12);
    if (!L.length) return PH0(p, k);
    const w = L.filter(r => r.w).length;
    setTimeout(() => l13Grades(p), 0);
    return `<div class="q-poh"><b>${esc(p.name)}</b><small>за 12 часов · ${games(L.length)} · ${w} ${pl(w, ['победа', 'победы', 'побед'])}, ${L.length - w} ${pl(L.length - w, ['поражение', 'поражения', 'поражений'])}</small></div>
      <div class="l13-gl">${L.map(r => { const [k1, d1, a1] = String(r.kda).split('/');
        return `<a class="l13-g ${r.w ? 'w' : 'l'}" href="#m/${r.mid}" title="Разбор матча">${face(r.hid, r.w ? 'g' : 'c', 's')}<span class="n"><b>${esc(hero(r.hid).n)}</b><small>${ago(r.t)}${r.d ? ' · ' + mmss(r.d) : ''}</small></span><span class="k">${k1}<i>/</i><em>${d1}</em><i>/</i>${a1}</span><span class="r">${r.w ? 'Победа' : 'Поражение'}</span><span class="gr" data-g="${r.mid}"><i class="l13-sk"></i></span><span class="go">›</span></a>`; }).join('')}</div>`;
  }; }
// оценка S+…D− — по истории матчей игрока (души, добивания, длина матча есть только там)
async function l13Grades(p) {
  if (!p.id) return;
  const H = await api(`players/${p.id}/match-history`).catch(() => null);
  const M = {}; (H || []).forEach(m => { M[m.match_id] = m; });
  $$('.q-pop [data-g]').forEach(c => { const m = M[+c.dataset.g]; c.innerHTML = m ? grdHTML(m) : '<span class="l13-ng" title="Матча ещё нет в истории игрока">—</span>'; });
}

// ---------- место на герое у каждого игрока на карточке (как «Рейтинг на герое» в профиле) ----------
let HRQ = false;
async function l13Ratings() {
  if (HRQ) return; HRQ = true;
  try {
    for (;;) {
      const L = $$('[data-hr]:not([data-ok])').slice(0, 2); if (!L.length) break;
      await Promise.all(L.map(async c => {
        c.dataset.ok = '1'; const [hid, id] = c.dataset.hr.split('|').map(Number);
        const r = await heroRating(hid, id).catch(() => null);
        $$(`[data-hr="${hid}|${id}"]`).forEach(x => { x.dataset.ok = '1';
          if (r && r.pos) { x.textContent = `#${nf(r.pos)} в мире`; x.classList.toggle('top', r.pos <= 1000); x.title = `Место в мире среди всех игроков на ${hero(hid).n} по числу побед: ${nf(r.v)} ${pl(r.v, ['победа', 'победы', 'побед'])} на нём`; }
          else x.remove(); });
      }));
    }
  } finally { HRQ = false; }
}
{ let tm = 0; new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(() => { if ($('[data-hr]:not([data-ok])')) l13Ratings(); }, 400); }).observe(document.body, {childList: true, subtree: true}); }

ovTabLive();
