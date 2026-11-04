// ===================== lg24 — 04.11 (ночь 3): «Оверлей» — что в моде уже работает, а что ещё нет =====================
// Андрей: «можешь в оверлее как-то отмечать, какие функции работают уже, а какие нет?»
// Список: у каждой функции «работает» (зелёным) или «скоро» (серым, строка бледнее); вверху фильтр «Все · Работают · Скоро».
// Экран игры: у зоны «M/N» — сколько работает из включённых в наборе; работающие — с ✓ и первыми, остальные бледные.
// «Работает» = функция есть в моде: поле 7 в O18 (ставят lg18 и lg23 по версиям мода).
let O18S = '';
const o18Ok = f => !!f[7];
o18Stage = function (o) {
  const on = o18On(o);
  return `<div class="ovp-sch" aria-hidden="true"><i class="tb">${'<u></u>'.repeat(6)}<b>12:34</b>${'<u></u>'.repeat(6)}</i><i class="hp"><s></s></i><i class="ab">${'<u></u>'.repeat(4)}</i><i class="it">${'<u></u>'.repeat(5)}</i><i class="mm"></i><i class="cr"></i><i class="fg"></i></div>
    ${Object.entries(O18Z).map(([z, [nm, x, y, w, h]]) => {
      const L = O18.filter(f => f[2] === z && on.has(f[0])).sort((a, b) => o18Ok(b) - o18Ok(a)), k = L.filter(o18Ok).length;
      return `<button type="button" class="o18-z${L.length ? ' on' : ''}" data-z="${z}" style="left:${x}%;top:${y}%;width:${w}%;height:${h}%" aria-label="${esc(nm)}: работает ${k} из ${L.length}"><b>${esc(nm)}<em class="${k === L.length ? 'all' : ''}">${L.length ? k + '/' + L.length : ''}</em></b>${L.slice(0, 4).map(f => `<span class="${o18Ok(f) ? 'ok' : 'no'}">${esc(f[1])}</span>`).join('')}${L.length > 4 ? `<span class="m">ещё ${L.length - 4}</span>` : ''}</button>`; }).join('')}`;
};
o18Side = function (o, zf) {
  const my = o.p === 'my', on = o18On(o);
  const base = O18.filter(f => (my || f[3] > 0) && (!zf || f[2] === zf)), L = base.filter(f => !O18S || (O18S === 'ok') === o18Ok(f));
  const sel = O18.filter(f => f[3] > 0 && on.has(f[0])), n = sel.length, nk = sel.filter(o18Ok).length;
  const load = o18Load(new Set(sel.map(f => f[0]))), bk = base.filter(o18Ok).length;
  const row = f => { const v = !f[3], c = on.has(f[0]), ok = o18Ok(f);
    return `<li class="${c ? 'on' : ''}${v ? ' vw' : ''} ${ok ? 'w-ok' : 'w-no'}">${my ? `<label><input type="checkbox" data-t="${f[0]}"${c ? ' checked' : ''}><span>${esc(f[1])}</span></label>` : `<i>${c ? '✓' : '—'}</i><span>${esc(f[1])}</span>`}
      <small>${esc(f[6])}${f[5] === 'kl' ? ' · как в Lite — легче' : ''}</small><em class="o18-c c${f[4]}" title="Нагрузка">${v ? 'вид' : O18L[f[4]]}</em><em class="o18-w ${ok ? 'ok' : 'no'}">${ok ? 'работает' : 'скоро'}</em></li>`; };
  const zs = zf ? [zf] : Object.keys(O18Z), sb = (k, t, m) => `<button type="button" data-sf="${k}" aria-pressed="${O18S === k}">${t}<b>${m}</b></button>`;
  return `<p class="ovp-d"><b>${O18P[o.p][0]}</b> — ${O18P[o.p][1]} · работает <b class="o18-k">${nk} из ${n}</b> · нагрузка ${load <= 16 ? 'низкая' : load <= 34 ? 'средняя' : 'выше'}${zf ? ` · <button type="button" class="lnk" id="o18all">все зоны</button>` : ''}</p>
    <div class="o18-sf" role="group" aria-label="Показать">${sb('', 'Все', base.length)}${sb('ok', 'Работают', bk)}${sb('no', 'Скоро', base.length - bk)}</div>
    ${zs.map(z => { const R = L.filter(f => f[2] === z); return R.length ? `<h4 class="o18-h">${esc(O18Z[z][0])}</h4><ul class="ovp-l o18-l">${R.map(row).join('')}</ul>` : ''; }).join('')}
    ${my ? `<div class="ovp-b"><button class="btn s g" type="button" id="o18sh">Поделиться кодом</button><button class="btn s g" type="button" id="o18im">Вставить код</button></div><p class="ovp-msg" id="o18msg" aria-live="polite"></p>`
      : `<button class="btn s g" type="button" id="o18cp">Сделать свой на основе «${O18P[o.p][0]}»</button>`}`;
};
{ const B24 = o18Bind; o18Bind = function () { B24.apply(this, arguments); const sd = $('#ovpside'); if (sd) sd.addEventListener('click', e => { const b = e.target.closest('[data-sf]'); if (!b) return; O18S = b.dataset.sf; o18Draw(); }); }; }
