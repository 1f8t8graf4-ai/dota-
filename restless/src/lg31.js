// ===================== lg31 — 05.11: новый дизайн — бегущая полоска под вкладками, вход страницы, каскад блоков =====================
document.documentElement.classList.add('r31');
{ // полоска под активной вкладкой: едет к нажатой
  let ind = null;
  const put = () => {
    const bar = document.getElementById('tabs'); if (!bar) return;
    if (!ind || !ind.isConnected) { ind = document.createElement('i'); ind.className = 'r31-ind'; ind.setAttribute('aria-hidden', 'true'); bar.appendChild(ind); }
    const a = bar.querySelector('a.on');
    if (!a) { if (ind.classList.contains('on')) ind.classList.remove('on'); return; }
    const w = Math.max(18, a.offsetWidth - 24);
    ind.style.width = w + 'px';
    ind.style.setProperty('--x', (a.offsetLeft + (a.offsetWidth - w) / 2) + 'px');
    if (!ind.classList.contains('on')) ind.classList.add('on');
  };
  const bar = document.getElementById('tabs');
  if (bar) new MutationObserver(ms => { if (ms.some(m => m.target !== ind)) put(); }).observe(bar, {subtree: true, attributes: true, attributeFilter: ['class']});
  addEventListener('resize', put); addEventListener('hashchange', () => setTimeout(put, 30));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(put);
  setTimeout(put, 60);
}
{ // смена страницы — мягкий вход; тихое обновление тех же данных — без анимации
  let last = '';
  const key = () => (location.hash || '#home').split(/[?&]/)[0].replace(/\/(\d+|m\d+|p\d+)$/, '');
  const V31 = V;
  V = function (html) {
    V31.apply(this, arguments);
    const k = key(), v = document.getElementById('v');
    if (!v || k === last) return;
    last = k;
    v.classList.remove('r31-go'); void v.offsetWidth; v.classList.add('r31-go');
  };
}
