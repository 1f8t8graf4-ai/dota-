// ===================== lg30 — 04.11 (ночь 8): «Оверлей» тремя вкладками =====================
// Андрей: «не врубаюсь, че за меню оверлея, куда пропал скрин; че за настройки лобби — показывай, что происходит».
// #ovs/game — «В игре»: кадр игры с функциями мода (то, что было до lg26: зоны, Lite / Medium / Enchanted, «работает / скоро»);
// #ovs/lobby — «Лобби · LIVE 12»: переключатели + живая карточка-пример — щёлкнул, и на карточке пропало / появилось;
// #ovs/fps — FPS в игре. Последняя открытая вкладка запоминается (rl-ovt).
const U30I = {
  game: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 21h8M12 18v3"/><circle cx="12" cy="11" r="2.5"/><path d="M12 6.5v2M12 13.5v2M7.5 11h2M14.5 11h2"/></svg>',
  lobby: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2.5 20c.6-3.3 2.8-5 5.5-5s4.9 1.7 5.5 5M14 15.2c.9-.5 1.9-.7 3-.7 2.3 0 4 1.4 4.5 4.5"/></svg>',
  fps: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16a8 8 0 1 1 16 0"/><path d="M12 16l4.5-5"/><circle cx="12" cy="16" r="1.2"/></svg>'
};
const U30T = [['game', 'В игре'], ['lobby', 'Лобби · LIVE 12'], ['fps', 'FPS']];
function u30Tab() {
  const m = /^#ovs\/(game|lobby|fps)/.exec(location.hash);
  if (m) { try { localStorage.setItem('rl-ovt', m[1]); } catch (e) {} return m[1]; }
  let t = ''; try { t = localStorage.getItem('rl-ovt') || ''; } catch (e) {}
  return /^(game|lobby|fps)$/.test(t) ? t : 'game';
}
function u30Bar(t) {
  return `<nav class="u30-tabs" id="u30t">${U30T.map(([k, nm]) => `<a href="#ovs/${k}" data-k="${k}" class="${k === t ? 'on' : ''}">${U30I[k]}<b>${nm}</b></a>`).join('')}<i class="u30-th"></i></nav>`;
}
function u30Slide(t) {
  const bar = $('#u30t'); if (!bar) return;
  const on = bar.querySelector('.on'), th = bar.querySelector('.u30-th'); if (!on || !th) return;
  const from = U30.last && bar.querySelector(`[data-k="${U30.last}"]`) || on;
  const at = a => { th.style.transform = `translateX(${a.offsetLeft}px)`; th.style.width = a.offsetWidth + 'px'; };
  at(from);
  if (from !== on) requestAnimationFrame(() => requestAnimationFrame(() => { th.classList.add('go'); at(on); })); else th.classList.add('go');
  U30.last = t;
}
const U30 = {last: ''};
// карточка-пример: тот же pCard, что в лайв-матче, на выдуманном игроке
function u30Sample() {
  const now = Math.floor(Date.now() / 1000);
  const p = {id: 0, hid: 65, name: 'Пример · Venator', badge: 112, hm: 64, hw: 37, hk: 3.1, tm: 1180, tw: 612, p12: {m: 4, w: 3}, p30: {m: 71, w: 40},
    rc: [{mid: 1, hid: 65, w: 1, kda: '9/2/11'}, {mid: 2, hid: 65, w: 1, kda: '7/4/9'}, {mid: 3, hid: 2, w: 0, kda: '3/6/5'}, {mid: 4, hid: 65, w: 1, kda: '12/1/8'}, {mid: 5, hid: 65, w: 0, kda: '4/5/6'}],
    tags: [['g', 'Мейн героя', ''], ['g', 'В ударе', ''], ['h', 'Опасный', '']], t: now};
  let h = '';
  try { h = pCard(p, true, false, 0); } catch (e) { h = '<div class="empty">—</div>'; }
  return h.replace('<div class="q-pbld" id="pb-0"></div>', '<div class="q-pbld u30-bld"><span class="q-ct c-gun">Ган</span><small>сборка игрока</small></div>');
}
function u30Lobby() {
  const o = u26LGet();
  return `<section class="u30-lb">
    <div class="u30-lbl">
      <div class="u26-lbg u30-lbg" id="u26lb">${U26L.map(([k, nm]) => `<label class="u26-sw"><input type="checkbox" data-k="${k}"${o[k] === 0 ? '' : ' checked'}><span class="tr"></span><b>${nm}</b></label>`).join('')}
        <label class="u26-sw"><input type="checkbox" data-k="cmp"${o.cmp ? ' checked' : ''}><span class="tr"></span><b>Компактнее</b></label></div>
      <p class="u26-gm">В игре — <b>Esc → LIVE · 12</b> · настройки — <b>Esc → RESTLESS → Лобби</b></p>
    </div>
    <div class="u30-pv"><div class="q-sec"><b>Так выглядит игрок в LIVE · 12</b></div><div id="lvb" class="u30-pvc"><div class="q-lob">${u30Sample()}</div></div></div>
  </section>`;
}
{ const VO30 = viewOvs;   // lg26: «Лобби» + FPS одной страницей — больше не открывается сама
  viewOvs = function () {
    const t = u30Tab();
    if (t === 'game') {
      VO_PRE26.apply(this, arguments);
      const h = $('.ovs-h'); if (h) h.insertAdjacentHTML('afterend', u30Bar(t)); else $('#view').insertAdjacentHTML('afterbegin', u30Bar(t));
    } else {
      vNew(); document.body.classList.remove('ovm'); clearInterval(OV.timer); clearInterval(OV.clk);
      $$('#tabs a').forEach(x => x.classList.toggle('on', x.dataset.t === 'ovs'));
      V(`<section class="ovs u30">
        <header class="ovs-h"><h1>Оверлей</h1></header>
        ${u30Bar(t)}
        <div class="ovs-st" id="ovsst"></div>
        ${t === 'lobby' ? u30Lobby() : o18Fps()}
      </section>`);
      try { ovsPaint(); } catch (e) {}
      if (t === 'fps') o18FpsBind();
      else $('#u26lb').onchange = e => { const c = e.target.closest('[data-k]'); if (!c) return; const s = u26LGet(); s[c.dataset.k] = c.checked ? (c.dataset.k === 'cmp' ? 1 : undefined) : 0;
        if (c.dataset.k === 'cmp' && !c.checked) delete s.cmp; try { localStorage.setItem('rl-lobby', JSON.stringify(s)); } catch (er) {} u26LApply();
        const card = $('.u30-pvc .q-pc'); if (card) { card.classList.remove('u30-blink'); void card.offsetWidth; card.classList.add('u30-blink'); } };
    }
    const sec = $('.ovs') || $('#view'); if (sec) sec.classList.add('u30-in');
    u30Slide(t);
  };
  void VO30; }
// функции мода 0.24 в кадре «В игре»: карты строений и урона по строениям больше нет; «Линия с пати» и «Мелочи — по Alt» работают
{ ['omap', 'odmg'].forEach(id => { const i = O18.findIndex(f => f[0] === id); if (i >= 0) O18.splice(i, 1); });
  delete L25K.omap; delete L25K.odmg; L25K.alt = ['ALTM'];
  O18.forEach(f => {
    if (f[0] === 'lane') { f[1] = 'Линия «с пати» сама'; f[6] = 'в окне пати сразу стоит «С пати»'; f[7] = 1; }
    if (f[0] === 'rift') { f[6] = 'под счётом: за 2 мин до появления — всегда, раньше — по Alt'; }
    if (f[0] === 'zip') f[6] = 'по Alt: готов ли и сколько до него';
  });
  O18.push(['alt', 'Мелочи — только по Alt', 'over', 1, 1, 'k', 'буст, нагрузка, урна и разлом раньше 2 мин — пока зажат Alt', 1]); }
