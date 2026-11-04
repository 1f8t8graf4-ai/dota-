// ===================== lg27 — 04.11 (ночь 6): без пояснений на сайте =====================
// Андрей: «убери в срочном порядке все эти надписи как в League of Graphs и т. д.» (правило: на сайте — без пояснений).
// Прячем подписи-пояснения под заголовками, «как считаем», сноски; из подсказок при наведении убираем ссылки на чужие сайты.
const U27RX = /(League of Graphs|LoG\b|Porofessor|Deadlock Labs|ResoAI|нажми|Нажми|наведи|Наведи|как считаем|Как считаем|столбик —|▲ —|— из файлов игры|открытые данные|данные игры через)/;
const U27T = /,?\s*(как|Как) (в )?(League of Graphs|Porofessor|Deadlock Labs|LoG)[^.;)]*[.;)]?/g;
function u27Sweep(root) {
  (root || document).querySelectorAll('small, p.note, p.sub, .note, .q-pop p, details.l16-how').forEach(el => {
    if (el.dataset.u27) return; el.dataset.u27 = 1;
    if (el.matches('details.l16-how') || U27RX.test(el.textContent || '')) el.style.display = 'none';
  });
  (root || document).querySelectorAll('[title]').forEach(el => { const t = el.getAttribute('title'); if (t && U27T.test(t)) el.setAttribute('title', t.replace(U27T, '').replace(/\s{2,}/g, ' ').trim()); U27T.lastIndex = 0; });
}
{ let tm = 0; new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(() => u27Sweep(), 60); }).observe(document.body, {childList: true, subtree: true}); u27Sweep(); }

// 04.11, ночь 6 (второй заход; Андрей: «зачем ты пишешь везде объяснение — убери или при наведении»):
// подпись-пояснение у заголовка блока прячем, а её текст — подсказкой при наведении на заголовок.
const U27H = '.qs-bh, .qs-h, .q-sec, .q-bh, .u10-bh, .r9-bh, .qs-top, .hrk-h';
const U27K = /(сравнение|по поминутным|кольцо —|зелёный —|красный —|меньше —|больше —|макс\. —|50 —|как типичн|сколько|участие в|меньше смертей|добитые|убийств тебя|за игру против|лучший из|сравниваем|считаем|считается)/i;
function u27Hover(root) {
  (root || document).querySelectorAll(U27H).forEach(h => h.querySelectorAll(':scope > small, :scope > .sub, :scope > span.sub').forEach(el => {
    if (el.dataset.u27h) return; el.dataset.u27h = 1;
    const t = (el.textContent || '').trim(); if (!t) return;
    const words = t.split(/\s+/).length, num = /\d/.test(t);
    if (U27K.test(t) || (!num && words >= 3)) { const b = h.querySelector('b, h2, h3') || h; if (!b.title) b.title = t; b.classList.add('u27-tip'); el.style.display = 'none'; }
  }));
  (root || document).querySelectorAll('small, span, em').forEach(el => {
    if (el.dataset.u27k || el.children.length) return; const t = (el.textContent || '').trim();
    if (t.length < 60 && /^·?\s*(меньше|больше) — лучше$/.test(t)) { el.dataset.u27k = 1; el.style.display = 'none'; }
  });
  document.querySelectorAll('p.ft').forEach(p => { p.style.display = 'none'; });
}
{ let tm = 0; new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(() => u27Hover(), 80); }).observe(document.body, {childList: true, subtree: true}); u27Hover(); }

// вкладка снова «Оверлей», иконка — экран игры с окном поверх
const U27IC = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M8 21h8M12 17v4"/><rect x="11" y="7" width="8" height="6" rx="1.2" fill="currentColor" fill-opacity=".25"/><circle cx="7" cy="10.5" r="1.6"/></svg>';
{ const fix2 = () => { const a = document.querySelector('#tabs [data-t="ovs"]'); if (!a || a.dataset.u27 === '2') return; a.dataset.u27 = '2'; a.title = 'Оверлей поверх игры'; a.innerHTML = U27IC + ' Оверлей';
    const h = document.querySelector('.u26-lb .ovs-h h1'); if (h) h.textContent = 'Оверлей'; };
  new MutationObserver(() => { fix2(); const h = document.querySelector('.u26-lb .ovs-h h1'); if (h && h.textContent !== 'Оверлей') h.textContent = 'Оверлей'; }).observe(document.body, {childList: true, subtree: true}); fix2(); }

// «Герои»: рейтинг героя не вываливаем сразу — виден топ-1 игрок, остальное — по кнопке (Андрей: «покажи топ-1 васяна, хочет — больше»)
document.addEventListener('click', e => { const b = e.target.closest('#l14all'); if (!b) return; const s = b.closest('.l14-lad'); if (s) s.classList.add('u27-open'); b.remove(); });
{ const fix3 = () => { const lb = document.getElementById('l14lb'); if (!lb || lb.dataset.u27 || !lb.querySelector('.l14-r')) return; lb.dataset.u27 = 1;
    const s = lb.closest('.l14-lad'); if (s) { s.classList.add('u27-one'); lb.insertAdjacentHTML('beforeend', '<button type="button" class="l14-more" id="l14all">Весь рейтинг ›</button>'); } };
  new MutationObserver(fix3).observe(document.body, {childList: true, subtree: true}); }

// Фраза героя: каждое слово нажимается — перевод слова (словарик бота data/glossary.json), а не только целая фраза
let U27G = null, U27GP = null;
const u27Gloss = () => U27GP || (U27GP = fetch('../data/glossary.json').then(r => r.json()).then(j => (U27G = j.GLOSS_EN || {})).catch(() => (U27G = {})));
function u27Find(w) {
  const G = U27G || {}, k = w.toLowerCase().replace(/[’']/g, "'").replace(/^'+|'+$/g, '');
  const C = [k, k.replace(/'s$/, ''), k.replace(/n't$/, ''), k.replace(/'(ll|re|ve|d|m)$/, ''), k.replace(/ies$/, 'y'), k.replace(/es$/, ''), k.replace(/s$/, ''), k.replace(/ed$/, ''), k.replace(/ed$/, 'e'), k.replace(/ing$/, ''), k.replace(/ing$/, 'e'), k.replace(/(.)\1ing$/, '$1'), k.replace(/(.)\1ed$/, '$1'), k.replace(/ly$/, '')];
  for (const c of C) if (c && G[c]) return [c, G[c]];
  return null;
}
function u27Wrap(all) {
  if (!all || all.dataset.u27w) return; all.dataset.u27w = 1;
  const tw = document.createTreeWalker(all, NodeFilter.SHOW_TEXT), T = []; let n; while ((n = tw.nextNode())) if (!n.parentElement.closest('u')) T.push(n);
  T.forEach(t => { const f = document.createDocumentFragment(); t.textContent.split(/([A-Za-z][A-Za-z'’]*)/).forEach((p, i) => { if (!p) return; if (i % 2) { const e = document.createElement('i'); e.className = 'u27-w'; e.textContent = p; f.append(e); } else f.append(p); }); t.replaceWith(f); });
  all.querySelectorAll('u').forEach(u => u.classList.add('u27-w'));
}
function u27WordPop(el) {
  document.querySelectorAll('.u27-wp').forEach(x => x.remove());
  const w = (el.textContent || '').trim().replace(/[^A-Za-z'’ -]+/g, '').trim(), hit = u27Find(w), kw = el.dataset.t ? el.dataset.t.split(' — ') : null;
  const tr = kw && kw[1] ? kw[1] : hit ? hit[1] : '';
  const p = document.createElement('div'); p.className = 'u27-wp';
  p.innerHTML = `<b>${esc(w)}</b>${hit && hit[0] !== w.toLowerCase() ? `<small>${esc(hit[0])}</small>` : ''}<span>${esc(tr || 'нет в словарике')}</span>`;
  document.body.append(p);
  const r = el.getBoundingClientRect(), pw = p.offsetWidth;
  p.style.left = Math.max(8, Math.min(innerWidth - pw - 8, r.left + r.width / 2 - pw / 2)) + 'px';
  p.style.top = (r.top - p.offsetHeight - 8 < 8 ? r.bottom + 8 : r.top - p.offsetHeight - 8) + 'px';
  requestAnimationFrame(() => p.classList.add('on'));
}
document.addEventListener('click', e => {
  const w = e.target.closest('.q-sy-cap .u27-w');
  if (!w) { if (!e.target.closest('.u27-wp')) document.querySelectorAll('.u27-wp').forEach(x => x.remove()); return; }
  e.preventDefault(); e.stopPropagation();
  document.querySelectorAll('.u27-w.on').forEach(x => x.classList.remove('on')); w.classList.add('on');
  u27Gloss().then(() => u27WordPop(w));
}, true);
addEventListener('hashchange', () => document.querySelectorAll('.u27-wp').forEach(x => x.remove()));
{ const fix4 = () => document.querySelectorAll('.q-sy-cap .all').forEach(a => { if (!a.dataset.u27w && a.textContent.trim()) { u27Gloss(); u27Wrap(a); } });
  new MutationObserver(fix4).observe(document.body, {childList: true, subtree: true}); }
