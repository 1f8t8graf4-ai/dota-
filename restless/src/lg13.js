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
// ---------- пресеты оверлея (макет): Лайт · Медиум · Энчантед · Свой. Скриншот игры, поверх — значки того, что показывает Restless ----------
// Андрей: «на скриншоте показывается, что меняется; кастомный — Васян сам выбирает, двигает значки, создаёт свой пресет и делится им».
// Что войдёт в оверлей — решит Андрей (страница QoL), пока набор-заглушка. Настоящий скрин: положить файл и вписать путь в OVS_SHOT.
const OVS_SHOT = '';
const OVE = [
  ['ult', 'КД ультов', 'секунды до ульты на портретах', 50, 13, '⏱'],
  ['tmr', 'Таймеры событий', 'лагеря, баффы на мосту, урна', 70, 8, '⌛'],
  ['rnk', 'Ранги игроков', 'значок ранга у каждого сверху', 30, 8, '◆'],
  ['ntf', 'Напоминания', 'надпись и звук заранее', 50, 28, '!'],
  ['lob', 'Окно Restless', '12 игроков: ранги, угрозы', 84, 42, 'R'],
  ['buy', 'Очередь покупок', 'следующие предметы видно в игре', 50, 74, '$'],
  ['amm', 'Подсветка патронов', 'пока бафф на пули', 57, 54, '•'],
  ['urn', 'Урна на карте', 'куда упадёт и когда', 90, 80, 'U'],
  ['box', 'Ящики и статуи', 'на мини-карте', 84, 88, '▣'],
  ['adv', 'Перевес по рангам', 'у какой команды ранги выше', 50, 3, '⇅']];
const OVP = {lite: ['ult', 'tmr'], mid: ['ult', 'tmr', 'rnk', 'ntf', 'lob', 'buy'], ench: OVE.map(x => x[0])};
const OVPN = {lite: ['Lite', 'только главное — почти не грузит'], mid: ['Medium', 'главное + кто в матче и покупки'], ench: ['Enchanted', 'всё, что умеет Restless'], my: ['Custom', 'выбираешь и двигаешь сам']};
const ovpT = y => `clamp(12px,${y}%,calc(100% - 12px))`; // по высоте значок не уходит за край маленького скриншота (телефон)
const ovpGet = () => { try { return JSON.parse(localStorage.getItem('rl-ovp') || 'null') || {p: 'mid'}; } catch (e) { return {p: 'mid'}; } };
const ovpSet = o => { try { localStorage.setItem('rl-ovp', JSON.stringify(o)); } catch (e) {} };
function ovpState() { const o = ovpGet(); o.my = o.my || {on: OVP.mid.slice(), pos: {}}; return o; }
function ovpStage(o) {
  const on = new Set(o.p === 'my' ? o.my.on : OVP[o.p]), pos = id => (o.p === 'my' && o.my.pos[id]) || null;
  const scr = OVS_SHOT ? `<img class="ovp-shot" src="${esc(OVS_SHOT)}" alt="">` : `<div class="ovp-sch" aria-hidden="true"><i class="tb">${'<u></u>'.repeat(6)}<b>12:34</b>${'<u></u>'.repeat(6)}</i><i class="hp"><s></s></i><i class="ab">${'<u></u>'.repeat(4)}</i><i class="it">${'<u></u>'.repeat(5)}</i><i class="mm"></i><i class="cr"></i><i class="fg"></i></div>`;
  return `${scr}${OVE.map(([id, nm, , x, y, ic]) => { const p = pos(id) || [x, y]; return `<button type="button" class="ovp-m${on.has(id) ? ' on' : ''}" data-m="${id}" style="left:${p[0]}%;top:${ovpT(p[1])}" title="${esc(nm)}" tabindex="${on.has(id) ? 0 : -1}"><i>${ic}</i><span>${esc(nm)}</span></button>`; }).join('')}`;
}
function ovpSide(o) {
  const my = o.p === 'my', on = new Set(my ? o.my.on : OVP[o.p]);
  return `<p class="ovp-d"><b>${OVPN[o.p][0]}</b> — ${OVPN[o.p][1]}${my ? '. Тяни значки на скриншоте, куда удобно.' : ''}</p>
    <ul class="ovp-l">${OVE.map(([id, nm, d]) => `<li class="${on.has(id) ? 'on' : ''}">${my ? `<label><input type="checkbox" data-t="${id}"${on.has(id) ? ' checked' : ''}><span>${esc(nm)}</span></label>` : `<i>${on.has(id) ? '✓' : '—'}</i><span>${esc(nm)}</span>`}<small>${esc(d)}</small></li>`).join('')}</ul>
    ${my ? `<div class="ovp-b"><button class="btn s" type="button" id="ovpsv">Сохранить</button><button class="btn s g" type="button" id="ovpsh">Поделиться кодом</button><button class="btn s g" type="button" id="ovpim">Вставить код</button></div><p class="ovp-msg" id="ovpmsg" aria-live="polite"></p>`
      : `<button class="btn s g" type="button" id="ovpcp">Сделать свой на основе «${OVPN[o.p][0]}»</button>`}`;
}
function ovpDraw(anim) {
  const o = ovpState(), st = $('#ovpst'), sd = $('#ovpside'); if (!st || !sd) return;
  $$('#ovptabs button').forEach(b => b.setAttribute('aria-selected', b.dataset.p === o.p));
  if (anim) { const on = new Set(o.p === 'my' ? o.my.on : OVP[o.p]); $$('.ovp-m', st).forEach(m => { const id = m.dataset.m, p = (o.p === 'my' && o.my.pos[id]) || OVE.find(x => x[0] === id).slice(3, 5); m.classList.toggle('on', on.has(id)); m.tabIndex = on.has(id) ? 0 : -1; m.style.left = p[0] + '%'; m.style.top = ovpT(p[1]); }); }
  else st.innerHTML = ovpStage(o);
  st.classList.toggle('edit', o.p === 'my');
  sd.innerHTML = ovpSide(o);
}
function ovpBind() {
  $('#ovptabs').onclick = e => { const b = e.target.closest('[data-p]'); if (!b) return; const o = ovpState(); o.p = b.dataset.p; ovpSet(o); ovpDraw(true); };
  $('#ovpside').onclick = e => {
    const o = ovpState(), msg = t => { const m = $('#ovpmsg'); if (m) m.textContent = t; };
    if (e.target.id === 'ovpcp') { o.my = {on: OVP[o.p].slice(), pos: {}}; o.p = 'my'; ovpSet(o); ovpDraw(true); return; }
    if (e.target.id === 'ovpsv') { ovpSet(o); msg('Сохранено — твой пресет Custom.'); return; }
    if (e.target.id === 'ovpsh') { const code = 'RL1-' + btoa(unescape(encodeURIComponent(JSON.stringify(o.my)))); (navigator.clipboard ? navigator.clipboard.writeText(code) : Promise.reject()).then(() => msg('Код скопирован — кинь другу, он вставит у себя.')).catch(() => msg(code)); return; }
    if (e.target.id === 'ovpim') { const c = prompt('Вставь код пресета (начинается с RL1-)'); if (!c) return;
      try { const my = JSON.parse(decodeURIComponent(escape(atob(c.trim().replace(/^RL1-/, ''))))); if (!my || !Array.isArray(my.on)) throw 0; my.on = my.on.filter(id => OVE.some(x => x[0] === id)); my.pos = my.pos || {}; o.my = my; o.p = 'my'; ovpSet(o); ovpDraw(true); msg('Пресет вставлен.'); } catch (er) { msg('Код не подошёл.'); } }
  };
  $('#ovpside').onchange = e => { const t = e.target.closest('[data-t]'); if (!t) return; const o = ovpState(), S = new Set(o.my.on); t.checked ? S.add(t.dataset.t) : S.delete(t.dataset.t); o.my.on = OVE.map(x => x[0]).filter(id => S.has(id)); ovpSet(o); ovpDraw(true); };
  // «Свой»: значок тянется мышью или пальцем, место запоминается в процентах от скриншота
  const st = $('#ovpst'); let drag = null;
  st.addEventListener('pointerdown', e => { const m = e.target.closest('.ovp-m.on'); if (!m || !st.classList.contains('edit')) return; drag = {m, r: st.getBoundingClientRect()}; m.setPointerCapture(e.pointerId); m.classList.add('drag'); e.preventDefault(); });
  st.addEventListener('pointermove', e => { if (!drag) return; const x = Math.min(97, Math.max(3, 100 * (e.clientX - drag.r.left) / drag.r.width)), y = Math.min(95, Math.max(3, 100 * (e.clientY - drag.r.top) / drag.r.height)); drag.m.style.left = x + '%'; drag.m.style.top = ovpT(y); drag.x = x; drag.y = y; });
  const end = () => { if (!drag) return; drag.m.classList.remove('drag'); if (drag.x != null) { const o = ovpState(); o.my.pos[drag.m.dataset.m] = [Math.round(drag.x * 10) / 10, Math.round(drag.y * 10) / 10]; ovpSet(o); } drag = null; };
  st.addEventListener('pointerup', end); st.addEventListener('pointercancel', end);
}
function viewOvs() {
  vNew(); document.body.classList.remove('ovm'); clearInterval(OV.timer); clearInterval(OV.clk);
  $$('#tabs a').forEach(x => x.classList.toggle('on', x.dataset.t === 'ovs'));
  window.scrollTo(0, 0);
  V(`<section class="ovs">
    <header class="ovs-h"><h1>Оверлей</h1><p>Restless поверх игры: профиль по клавише, матч — сам. Выбери, сколько показывать.</p></header>
    <div class="ovs-st" id="ovsst"></div>
    <div class="ovp">
      <div class="ovp-tabs" id="ovptabs" role="tablist">${Object.entries(OVPN).map(([k, [nm, d]]) => `<button type="button" role="tab" data-p="${k}"><b>${nm}</b><small>${d}</small></button>`).join('')}</div>
      <div class="ovp-main"><div class="ovp-stage" id="ovpst" aria-label="Экран игры с тем, что покажет Restless"></div><div class="ovp-side" id="ovpside"></div></div>
    </div>
    <p class="ovs-soon">Макет: что войдёт в каждый пресет, решаем сейчас — набор поменяется.</p>
  </section>`);
  ovsPaint(); ovpDraw(false); ovpBind();
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

// ---------- рейтинг героя у каждого игрока на карточке: «#100 в мире · EU #2» (честный — по рангу, см. heroRating) ----------
let HRQ = false;
async function l13Ratings() {
  if (HRQ) return; HRQ = true;
  try {
    for (;;) {
      const L = $$('[data-hr]:not([data-ok])').slice(0, 2); if (!L.length) break;
      await Promise.all(L.map(async c => {
        c.dataset.ok = '1'; const [hid, id] = c.dataset.hr.split('|').map(Number), nm = c.dataset.nm || '';
        const o = await hrkGet(hid, id, nm).catch(() => null), w = o && o.w;
        $$(`[data-hr="${hid}|${id}"]`).forEach(x => { x.dataset.ok = '1';
          if (w && w.pos) {
            x.innerHTML = `#${nf(w.pos)} <i>${esc(hero(hid).n)}</i>${o.r ? ` <em>${esc(RGS[o.rg] || o.rg)} #${o.r.pos}</em>` : ''}`;
            x.classList.toggle('top', w.pos <= 100); x.classList.toggle('hi', w.pos > 100 && w.pos <= 1000);
            x.title = `Рейтинг героя: #${nf(w.pos)} в мире${o.tot ? ' из ' + nf(o.tot) : ''} — по очкам рейтинга: ранг, винрейт и KDA на ${hero(hid).n}, как в League of Graphs (${HL_MIN}+ игр за ${HL_DAYS} дней).${o.r ? ` ${RGS[o.rg] || o.rg} #${o.r.pos} — официальный топ героя в регионе.` : ''}`;
          } else { x.textContent = 'вне рейтинга'; x.classList.add('no'); x.title = 'Рейтинг героя: ' + hrWhy(w); }
        });
      }));
    }
  } finally { HRQ = false; }
}
{ let tm = 0; new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(() => { if ($('[data-hr]:not([data-ok])')) l13Ratings(); }, 400); }).observe(document.body, {childList: true, subtree: true}); }

ovTabLive();
