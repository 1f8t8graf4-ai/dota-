// ===================== lg29 — 04.11 (ночь 7): «Патчи · Новости» крупным переключателем, новости — большими карточками =====================
// #upd/n — сетка новостей (картинка, дата, заголовок, первые строки). Нажал — та же статья, что раньше (#upd/<номер>), сверху «‹ Все новости».
function u29Seg() {
  const s = $('#utab'); if (!s || s.dataset.u29) return; s.dataset.u29 = 1; s.classList.add('u29-sw');
  s.querySelectorAll('[data-t]').forEach(b => { b.innerHTML = `<i class="u29-ic">${b.dataset.t === 'p' ? U29IC.p : U29IC.n}</i>${b.textContent}`; });
  s.insertAdjacentHTML('afterbegin', '<span class="u29-th" aria-hidden="true"></span>');
  const th = s.querySelector('.u29-th'), on = s.querySelector('.on'), was = s.querySelector(`[data-t="${U29.last}"]`) || on;
  const at = b => { th.style.transform = `translateX(${b.offsetLeft - 4}px)`; th.style.width = b.offsetWidth + 'px'; };
  if (on) { at(was); if (was !== on) requestAnimationFrame(() => requestAnimationFrame(() => { th.classList.add('go'); at(on); })); else th.classList.add('go'); U29.last = on.dataset.t; }
}
const U29 = {last: ''};
const U29IC = {
  p: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h10M4 12h16M4 17h7"/><path d="M17 4l3 3-3 3"/></svg>',
  n: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h6M7 16h8"/></svg>'
};
function u29Lead(X) { const p = X.out.find(x => x.t === 'p' && x.s.length > 40); return p ? (upTr(p.s) || p.s) : ''; }
async function u29News() {
  const n = vNew(); U10.tab = 'n';
  V(`<div class="u10 u29"><div class="u10-hd"><h1 class="h1">Пат<em>чи</em></h1><div class="seg" id="utab"><button data-t="p">Патчи</button><button data-t="n" class="on">Новости</button></div></div><div id="upw"><div class="load">Загружаю новости…</div></div></div>`);
  u29Seg(); $('#utab').onclick = u10Tab;
  let P;
  try { P = U10.P || await apiU(API2 + 'patches'); } catch (e) { put(n, '#upw', `<div class="err">Не вышло: ${esc(e.message)}</div>`); return; }
  if (n !== VQ) return;
  P = U10.P = (P || []).slice().sort((a, b) => Date.parse(b.pub_date) - Date.parse(a.pub_date)).slice(0, 30);
  const L = P.map((p, i) => i).filter(i => !pKind(P[i])).slice(0, 12);
  if (!L.length) { put(n, '#upw', '<div class="empty">Пусто.</div>'); return; }
  const card = (i, k) => { const p = P[i], X = parsePatch(p), t = Math.floor(Date.parse(p.pub_date) / 1000), img = X.imgs[0];
    return `<a class="u29-c${k === 0 ? ' big' : ''}" href="#upd/${i}" style="--d:${Math.min(k, 8) * 60}ms">
      <span class="u29-im">${img ? `<img src="${esc(img)}" alt="" loading="lazy" onerror="this.parentNode.classList.add('no');this.remove()">` : ''}<span class="u29-gl"></span></span>
      <span class="u29-tx"><small>${esc(dmy(t))} · ${p.source === 'forum' ? 'форум' : 'Steam'}</small><b>${esc(upTr(p.title) || p.title || 'Без названия')}</b><span>${esc(u29Lead(X).slice(0, 180))}</span></span></a>`; };
  put(n, '#upw', `<div class="u29-g">${L.map(card).join('')}</div>`);
}
{ const UV29 = u10View; u10View = async function (sel) {
    if (sel === 'n') return u29News();
    const r = await UV29.apply(this, arguments); u29Seg();
    const p = U10.P && sel != null && sel !== '' && U10.P[+sel];
    if (p && !pKind(p) && $('.u10-art') && !$('.u29-bk')) {
      $('.u10-art').insertAdjacentHTML('beforebegin', '<a class="u29-bk" href="#upd/n">‹ Все новости</a>'); $('.u10-art').classList.add('u29-art');
      const ch = $('#upw .u10-pk'); if (ch) ch.remove();
    }
    return r; }; }
u10Tab = function (e) { const b = e.target.closest('[data-t]'); if (!b || b.classList.contains('on')) return; U10.tab = b.dataset.t;
  if (U10.tab === 'n') { location.hash = '#upd/n'; return; }
  const P = U10.P || []; const k = P.findIndex(p => !!pKind(p)); location.hash = '#upd/' + Math.max(0, k); };
