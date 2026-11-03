// ===================== lg15 — 03.11, ночь: герой — все реплики с переводом, живой фон у всех =====================
// Андрей: «не правильный тайминг показа фраз, плюс не все фразы показываются, чтобы почекать перевод; не везде стоит анимированный фон».
// Тайминг — в lg2 (sayTimes: по currentTime звука, точное время слов — data/dd-ult-wt.json от Зетки, иначе по слогам).

// живые петли из R2: Венатор, Крысиный король, Виктор. Остальные — арт «дышит» (медленный наезд и свет, слой lg15.css)
LOOP[66] = ['victor', .5];

// ---------- все реплики героя: по группам (ульта, убийство…), английский + перевод, ▶ — слова загораются по голосу ----------
{ const VH15 = viewHero; viewHero = function (hid, mode) { const r = VH15(hid, mode), n = VQ; hid = +hid; if (D.heroes[hid]) l15Lines(n, hid); return r; }; }
let L15A = null;
function l15Stop() { if (L15A) { L15A.pause(); L15A = null; } $$('.l15-r.on').forEach(r => { r.classList.remove('on'); $$('.l15-en i', r).forEach(w => w.className = ''); }); }
addEventListener('hashchange', l15Stop);
async function l15Lines(n, hid) {
  const h = hero(hid), U = await ultLines(); if (n !== VQ) return;
  const L = U[hSlug(h)] || []; if (!L.length || $('#l15ln')) return;
  const at = $('.q-g2'); if (!at) return;
  const G = []; L.forEach((x, i) => { const t = x.tag || 'реплика'; let g = G.find(z => z[0] === t); if (!g) G.push(g = [t, []]); g[1].push([x, i]); });
  const nz = t => String(t).toLowerCase().replace(/[^a-z' ]/g, '').trim(), kwOf = x => (x.kw || []).filter(z => nz(z[0]) !== nz(x.en)); // слово = вся фраза — не повторяем
  const wd = (w, x) => { const c = w.toLowerCase().replace(/[^a-z']/g, ''), kw = kwOf(x).find(z => z[0].toLowerCase().split(/\s+/).map(v => v.replace(/[^a-z']/g, '')).includes(c)); return `<i${kw ? ` data-k="1" title="${esc(kw[0])} — ${esc(kw[1])}"` : ''}>${esc(w)}</i>`; };
  at.insertAdjacentHTML('beforebegin', `<details class="l15-ln" id="l15ln"><summary><b>Все реплики · ${L.length}</b><small>английский и перевод — ▶ послушать, слова загораются по голосу</small><span class="l15-ch" aria-hidden="true">▾</span></summary>
    <div class="l15-gs">${G.map(([t, R]) => `<section class="l15-g"><h4>${esc(t)} <small>${R.length}</small></h4>${R.map(([x, i]) => `<div class="l15-r" data-i="${i}">
      <button type="button" class="l15-pl" aria-label="Послушать">▶</button><div class="l15-tx"><p class="l15-en" lang="en">${x.en.split(/\s+/).map(w => wd(w, x)).join(' ')}</p><p class="l15-ru">${esc(x.ru)}</p>
      ${kwOf(x).length ? `<p class="l15-kw">${kwOf(x).map(z => `<span><b>${esc(z[0])}</b> — ${esc(z[1])}</span>`).join('')}</p>` : ''}</div></div>`).join('')}</section>`).join('')}</div>
    <p class="l15-nt">Нашёл кривой перевод — напиши, поправим. Время слов пока по слогам; точное по голосу — от Зетки.</p></details>`);
  $('#l15ln').addEventListener('click', e => {
    const b = e.target.closest('.l15-pl'); if (!b) return;
    const row = b.closest('.l15-r'), x = L[+row.dataset.i];
    if (row.classList.contains('on')) { l15Stop(); return; }
    l15Stop(); if (SAY) SAY();
    const a = new Audio(x.a); L15A = a; row.classList.add('on');
    const W = $$('.l15-en i', row);
    a.addEventListener('playing', () => sayTimes(x, W.map(w => w.textContent), a).then(S => {
      const tick = () => { if (L15A !== a) return; const t = a.currentTime; W.forEach((w, j) => { w.className = t >= S[j] ? (j + 1 < S.length && t < S[j + 1] ? 'now' : 'done') : ''; }); if (!a.ended) requestAnimationFrame(tick); };
      tick(); }), {once: true});
    a.addEventListener('ended', () => setTimeout(() => { if (L15A === a) l15Stop(); }, 400), {once: true});
    a.play().catch(() => { if (L15A === a) l15Stop(); });
  });
}
