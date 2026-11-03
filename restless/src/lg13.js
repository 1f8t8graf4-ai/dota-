// ===================== lg13 — 03.11: вкладка «Оверлей», окно программы = весь сайт (профиль по Ctrl+X), LIVE =====================
// Андрей: «Ctrl+X — открывается твой профиль, можно полазить как на сайте; есть вкладка оверлея, где всё настраивается — в лобби
// и в игре; нашёлся матч — оверлей сам открывается и показывает всех; закрывается легко». Программа 0.3 грузит сайт ?app=1#home,
// window.rlHost (preload.js) — спрятать окно, сменить клавишу, «открывать само». В браузере вкладка тоже есть — со ссылкой на программу.
const OVS_DL = 'https://github.com/1f8t8graf4-ai/dota-/releases/download/overlay-latest/Restless-Overlay.exe';
const RLH = window.rlHost || null;
const ovLive = () => !!(OV.app && OV.app.live) || (gameLive() && OV.G && OV.G.s === 'm');

// ---------- вкладка «Оверлей» — отдельно от остальных, справа, с точкой LIVE ----------
(() => {
  const t = $('#tabs'); if (!t || $('#tabs [data-t="ovs"]')) return;
  t.insertAdjacentHTML('beforeend', `<a href="#ovs" data-t="ovs" class="q-ovt" title="Оверлей поверх игры: настройки и матч"><i class="q-ovd" aria-hidden="true"></i><span>Оверлей</span><b class="q-ovl">LIVE</b></a>`);
})();
function ovTabLive() { const a = $('#tabs [data-t="ovs"]'); if (a) a.classList.toggle('live', ovLive()); const b = $('#rlbar'); if (b) b.classList.toggle('live', ovLive()); }

// ---------- полоса окна программы: тянуть окно, ‹ назад, LIVE, подсказка клавиши, ✕ ----------
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
function rlKeyLine() {
  const a = OV.app || {}, h = a.hk || {}, el = $('#rlkey'); if (!el) return;
  const k = a.proc ? (h.game || '') : (h.show || '');
  el.textContent = k ? `${k} — скрыть` : '';
}
{ const A0 = window.rlApp; window.rlApp = s => { A0(s); ovTabLive(); rlKeyLine(); if (/^#ovs/.test(location.hash)) ovsPaint(); }; }
{ const G0 = window.rlGame; window.rlGame = g => { G0(g); ovTabLive(); if (/^#ovs/.test(location.hash)) ovsPaint(); }; }
setInterval(ovTabLive, 5000);

// ---------- страница «Оверлей» (#ovs) ----------
function ovsPaint() {
  const b = $('#ovsst'); if (!b) return;
  const a = OV.app, live = ovLive(), g = gameLive() ? OV.G : null, m = a && a.mod || {};
  const modTxt = {installed: 'поставлен ✓ — перезапусти игру', cleaned: 'на месте ✓', ok: 'на месте ✓', busy: 'поставлю, когда закроешь игру', nogame: 'не нашёл Deadlock', error: 'ошибка', wait: 'проверяю…'}[m.status] || '—';
  const row = (k, v, cls) => `<div class="ovs-r ${cls || ''}"><small>${k}</small><b>${v}</b></div>`;
  b.innerHTML = !a ? `<div class="ovs-dl"><div><b>Нужна программа Restless Overlay</b><small>Она открывает этот сайт поверх игры по клавише и сама показывает матч. Windows, без установки.</small></div><a class="btn" href="${OVS_DL}">Скачать .exe</a></div>`
    : `<div class="ovs-rows">${row('Игра', live ? '● LIVE — матч, игроков ' + (g ? g.players.length : 12) : g ? 'на связи · укрытие' : a.proc ? 'запущена · жду матч' : 'не запущена', live ? 'live' : '')}
       ${row('Мод', esc(modTxt))}${row('Клавиша', esc(a.proc ? (a.hk && a.hk.game || (a.hk && a.hk.gameErr ? 'занята — выбери другую' : '—')) : (a.hk && a.hk.cur ? a.hk.cur.replace(/Control/g, 'Ctrl') + ' — заработает, когда запустишь игру' : '—')))}${row('Версия программы', esc(a.ver || '0.2'))}</div>
       ${live ? '<a class="btn ovs-go" href="#ov">Открыть матч — все 12 игроков ›</a>' : ''}`;
  // клавиша и «само»
  const k = $('#ovsk'); if (k && a && a.hk) {
    k.innerHTML = a.hk.opts.map(([v, t]) => `<button type="button" data-k="${esc(v)}" class="${a.hk.cur === v ? 'on' : ''}">${esc(t)}</button>`).join('');
    k.onclick = e => { const x = e.target.closest('[data-k]'); if (x && RLH) RLH.setKey(x.dataset.k); };
  }
  const au = $('#ovsau'); if (au && a) { au.checked = !!a.auto; au.disabled = !RLH; au.onchange = () => RLH && RLH.setAuto(au.checked); }
  const lk = $('#ovslk'); if (lk) lk.hidden = !!a;
}
function viewOvs() {
  vNew(); document.body.classList.remove('ovm'); clearInterval(OV.timer); clearInterval(OV.clk);
  $$('#tabs a').forEach(x => x.classList.toggle('on', x.dataset.t === 'ovs'));
  window.scrollTo(0, 0);
  const soon = L => `<ul class="ovs-l">${L.map(x => `<li><span>${x}</span><em>скоро</em></li>`).join('')}</ul>`;
  V(`<section class="ovs">
    <header class="ovs-h"><div><h1>Оверлей</h1><p>Restless поверх игры: твой профиль по клавише, матч — сам, когда он нашёлся.</p></div></header>
    <div class="ovs-st" id="ovsst"></div>
    <div class="ovs-how">
      <div><b>1</b><span><kbd>Ctrl</kbd>+<kbd>X</kbd> в игре — открыть свой профиль. Тут всё как на сайте.</span></div>
      <div><b>2</b><span>Нашёлся матч — окно открывается само: все 12 игроков, ранги, угрозы. Игра не теряет управление. Значок в трее загорается <i class="ovs-lv">LIVE</i>.</span></div>
      <div><b>3</b><span>Закрыть — та же клавиша, <kbd>Esc</kbd> или ✕ сверху.</span></div>
    </div>
    <div class="ovs-g">
      <div class="ovs-c"><h2>Клавиша</h2>
        <div class="ovs-keys" id="ovsk"><span class="ovs-off" id="ovslk">Выбирается в программе Restless Overlay.</span></div>
        <p class="ovs-n">Работает, пока запущен Deadlock — в других программах <kbd>Ctrl</kbd>+<kbd>X</kbd> вырезает как обычно. В Deadlock <kbd>Ctrl</kbd> — присесть, <kbd>X</kbd> — второй предмет: если мешает, возьми <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>X</kbd>.</p>
        <label class="ovs-t"><input type="checkbox" id="ovsau" checked disabled><span>Открывать само, когда нашёлся матч</span></label></div>
      <div class="ovs-c"><h2>Наглядно</h2>
        <div class="ovs-pv" aria-label="Где что на экране игры">
          <div class="ovs-scr"><i class="ovs-tb">${'<u></u>'.repeat(12)}</i><i class="ovs-pn"><s></s><s></s><s></s><s></s></i><i class="ovs-cr"></i></div>
          <ul><li><i class="d1"></i>верхняя панель — секунды до ульт (мод)</li><li><i class="d2"></i>окно Restless — поверх игры, сбоку или где поставишь</li></ul>
        </div></div>
    </div>
    <div class="ovs-g">
      <div class="ovs-c"><h2>В лобби <small>пока ищется и грузится матч</small></h2>${soon(['Кто в матче: ранги, винрейт, мейны', 'Главная угроза и кто тебя контрит', 'Сборка против их состава'])}</div>
      <div class="ovs-c"><h2>В игре <small>поверх матча</small></h2>${soon(['Что показывать в окне матча', 'Где окно и какого размера', 'Таймеры лагерей и событий карты'])}</div>
    </div>
  </section>`);
  ovsPaint();
}
{ const R1 = route; route = function () { if (/^#ovs(\/|$)/.test(location.hash)) return viewOvs(); return R1.apply(this, arguments); }; }
ovTabLive();
