// ===================== lg18 — 04.11: пресеты оверлея по ответам Андрея (страница QoL: 64 «да», 5 «потом», 5 «нет») =====================
// Lite — только главное и почти без нагрузки; Medium — больше; Enchanted — всё; Custom — свой набор и вид.
// Если функция есть и в QoL Lite, и в QoL Lock, берём, как сделано в Lite: он легче для процессора.
// На экране игры подсвечены зоны, в каждой — что включено. Вид элементов (прозрачность, сдвиг, масштаб) — только в Custom.
// Нагрузка: 1 — по событию или раз в секунду, 2 — несколько раз в секунду, 3 — каждый кадр или много панелей.
// [id, название, зона, пресет 1/2/3 (0 — настройка вида, только Custom), нагрузка, откуда, что делает, есть ли уже в моде]
const O18 = [
  ['ult', 'КД ультов', 'top', 1, 1, 'k', 'секунды до ульты на портрете каждого — и над полосой здоровья героя', 1],
  ['rank', 'Ранги игроков', 'top', 1, 1, 'kl', 'значок ранга у каждого сверху и в списке по Esc', 1],
  ['lrk', 'Перевес по рангам', 'top', 1, 1, 'l', 'у какой команды ранги выше', 1],
  ['miss', 'Пропавшие герои', 'top', 2, 1, 'k', 'портрет бледнеет, когда героя не видно', 1],
  ['thp', 'Здоровье на портретах', 'top', 2, 2, 'k', 'портрет меняет цвет на 75 / 65 / 25 %', 1],
  ['rift', 'Урна и разлом', 'top', 2, 1, 'kl', 'под счётом: урна скоро / у кого, разлом — отсчёт', 0],
  ['urnd', 'Разница урн', 'top', 3, 1, 'k', 'сколько урн сдала каждая команда', 0],
  ['spm', 'Души в минуту', 'top', 3, 2, 'k', 'у команды и у каждого игрока', 0],
  ['unsp', 'Непотраченные души', 'top', 3, 2, 'k', 'сколько душ лежит у игрока', 0],
  ['omap', 'Карта строений', 'top', 3, 2, 'k', 'какие башни и стражи живы', 0],
  ['odmg', 'Урон по строениям', 'top', 3, 2, 'k', 'кто сколько нанёс по строениям', 0],
  ['blur', 'Без размытия под никами', 'top', 1, 1, 'k', 'размытие убираем — игре даже легче', 0],
  ['tbl', 'Верхняя панель: вид', 'top', 0, 1, 'k', 'прозрачность, масштаб, сдвиг', 0],
  ['sig', 'Вспышка умения на КД', 'cross', 1, 1, 'k', 'значок вспыхивает, если жмёшь умение на перезарядке', 0],
  ['ammo', 'Патроны у прицела', 'cross', 2, 2, 'k', 'патроны рядом с прицелом', 0],
  ['rld', 'Перезарядка у прицела', 'cross', 2, 2, 'k', 'круг перезарядки возле прицела', 0],
  ['cmb', '«В бою»', 'cross', 2, 1, 'k', '«В БОЮ» у прицела, вышел — «ВНЕ БОЯ»', 1],
  ['xst', 'Баффы у прицела', 'cross', 3, 3, 'k', 'скорострельность, замедления строкой у прицела', 0],
  ['imp', 'Эффект попадания', 'cross', 0, 1, 'k', 'размер и прозрачность вспышки', 0],
  ['stam', 'Выносливость', 'cross', 0, 1, 'k', 'угол и цвет зарядов', 0],
  ['hpc', 'Цвет здоровья по порогам', 'hp', 2, 1, 'k', 'полоса меняет цвет на 75 / 65 / 25 %', 0],
  ['hpt', 'Вид полосы здоровья', 'hp', 0, 1, 'k', 'стили, размер, цвет', 0],
  ['lpas', 'Пассивки всегда видны', 'bot', 1, 1, 'l', 'значки пассивок и активок не прячутся', 0],
  ['abi', 'Простые значки умений', 'bot', 1, 1, 'k', 'без косметики и лишних стаков', 0],
  ['lmag', 'Подсветка патронов при баффе', 'bot', 2, 1, 'l', 'пока бафф на пули', 0],
  ['uns', 'Незащищённые души', 'bot', 2, 1, 'k', 'число крупно над умениями', 1],
  ['stb', 'Бонусы статуй', 'bot', 2, 1, 'k', 'что дали золотые статуи', 0],
  ['bbar', 'Нижняя панель: вид', 'bot', 0, 1, 'k', 'масштаб, сдвиг, цвет', 0],
  ['itm', 'Предметы: вид', 'bot', 0, 1, 'k', 'прозрачность, сдвиг, цвет', 0],
  ['sls', 'Души: вид', 'bot', 0, 1, 'k', 'прозрачность и сдвиг счётчика', 0],
  ['stp', 'Статы: место', 'bot', 0, 1, 'k', 'слева или справа', 0],
  ['lfw', 'HUD во всю ширину', 'bot', 0, 1, 'l', 'для широкого экрана', 0],
  ['asp', 'Экраны 16:10, 4:3, 21:9', 'bot', 0, 1, 'k', 'HUD под свой экран', 0],
  ['levt', 'Напоминания о событиях', 'map', 1, 1, 'l', 'за 15 с: лагеря 2:00 / 5:00 / 8:00, ящики и статуи 3:00 / 5:00 / 10:00', 1],
  ['mmt', 'Таймеры на мини-карте', 'map', 1, 1, 'kl', 'лагеря: отсчёт до возрождения над меткой', 1],
  ['rjv', 'Бафф и Rejuv', 'map', 1, 1, 'kl', 'отсчёт и у кого бафф', 0],
  ['lurn', 'Урна на карте', 'map', 1, 1, 'l', 'кольцо и отсчёт до посадки', 0],
  ['lmmo', 'Ящики, статуи, яблоки', 'map', 2, 2, 'l', 'на мини-карте, с таймером', 0],
  ['mmz', 'Мини-карта: вид и зум', 'map', 0, 1, 'kl', 'размер, прозрачность, значки', 0],
  ['vox', 'Голос: напоминания', 'map', 3, 1, 'k', 'голосом — только не роботом (см. ниже)', 0],
  ['qbuy', 'Очередь покупок', 'shop', 1, 1, 'kl', 'следующие предметы видно в игре', 0],
  ['rbuy', 'Кто что купил', 'shop', 2, 1, 'kl', 'можно только свою линию и важные предметы', 0],
  ['shop', 'Магазин: вид', 'shop', 0, 1, 'k', 'минимализм, без 3D-героя', 0],
  ['bid', 'ID сборки на экране', 'shop', 3, 1, 'k', 'для стрима', 0],
  ['cimg', 'Картинки в чате', 'chat', 3, 1, 'k', 'ссылка на картинку видна в чате', 0],
  ['ctr', 'Перевод чата', 'chat', 3, 1, 'k', 'через программу на компьютере', 0],
  ['kbd', 'Клавиатура на экране', 'over', 3, 3, 'k', 'для стрима и обучения', 0],
  ['zip', 'Буст на канате', 'over', 3, 1, 'k', 'готов ли и сколько до него', 0],
  ['cmp', 'Компас и скорость', 'over', 3, 2, 'k', 'стороны света и скорость', 0],
  ['cur', 'Свой курсор', 'over', 0, 1, 'k', 'выбираешь сам', 0],
  ['stat', 'Кнопка Restless в профиле', 'menu', 1, 1, 'kl', 'в профиле любого игрока → его страница у нас', 1],
  ['lfr', 'Ранги друзей', 'menu', 1, 1, 'l', 'значок ранга в списке друзей', 0],
  ['lane', 'Линия «с пати» сама', 'menu', 1, 1, 'k', 'при поиске матча', 0],
  ['llb', 'Поиск в таблице лидеров', 'menu', 2, 1, 'l', 'поле поиска по нику', 0],
  ['lcom', 'Похвала в одно нажатие', 'menu', 2, 1, 'l', 'после матча', 0],
  ['lmute', 'Кто замьючен', 'menu', 2, 1, 'l', 'видно в меню', 0],
  ['lpg', 'Экран после матча: вид', 'menu', 3, 1, 'l', 'аккуратнее итоги и профиль', 0],
  ['arc', 'Мини-игры, пока мёртв', 'menu', 3, 2, 'k', 'сапёр, блэкджек и др.', 0],
  ['perf', 'Счётчик нагрузки', 'menu', 3, 1, 'k', 'FPS и сколько ест мод', 0],
  ['loff', 'Выключил — не грузит', 'win', 1, 1, 'l', 'выключенная функция не работает вовсе', 1],
  ['srch', 'Поиск по настройкам', 'win', 1, 1, 'k', 'и пометка «влияет ли на FPS»', 0],
  ['prv', 'Предпросмотр', 'win', 1, 1, 'k', 'видно сразу, пока двигаешь ползунок', 0],
  ['thm', 'Темы окна', 'win', 0, 1, 'k', 'русский и английский уже есть', 1],
  ['pos', 'Свои сдвиги и масштаб', 'win', 0, 1, 'k', 'у каждого элемента', 0]];
// «потом» и «нет» — показываем внизу, чтобы было видно, что не забыто
const O18_LATER = [['icd', 'КД предметов у прицела'], ['lmir', 'Большая карта за Миража'], ['nick', 'Ники над портретами'], ['pre', 'Настройка лобби (боты, предметы)'], ['tst', 'Тестовые инструменты']];
const O18_NO = ['Меню Esc по центру', 'Числа урона', 'Метки целей', 'Отчёт об уроне после смерти', 'Без «не удалось применить»'];
const O18Z = {top: ['Верхняя панель', 25, 1, 50, 19], cross: ['Прицел', 39, 40, 22, 22], hp: ['Здоровье', 2, 76, 26, 13], bot: ['Нижняя панель', 30, 78, 38, 20],
  map: ['Мини-карта', 82, 64, 17, 34], shop: ['Магазин', 2, 24, 22, 26], chat: ['Чат', 2, 54, 22, 18], over: ['Поверх игры', 77, 2, 22, 20], menu: ['Меню · профиль', 74, 40, 25, 22], win: ['Окно Restless', 26, 22, 22, 17]};
const O18P = {lite: ['Lite', 'только главное — почти не грузит'], mid: ['Medium', 'главное и больше подсказок'], ench: ['Enchanted', 'всё, что выбрал'], my: ['Custom', 'свой набор и вид']};
const O18L = ['', 'почти не грузит', 'немного', 'заметно'];
const o18Set = p => O18.filter(x => p === 'lite' ? x[3] === 1 : p === 'mid' ? x[3] >= 1 && x[3] <= 2 : x[3] >= 1).map(x => x[0]);
const o18Get = () => { try { return JSON.parse(localStorage.getItem('rl-ovp2') || 'null') || {p: 'lite'}; } catch (e) { return {p: 'lite'}; } };
const o18Put = o => { try { localStorage.setItem('rl-ovp2', JSON.stringify(o)); } catch (e) {} };
function o18State() { const o = o18Get(); if (!O18P[o.p]) o.p = 'lite'; o.my = o.my || {on: o18Set('lite'), vw: []}; return o; }
const o18On = o => new Set(o.p === 'my' ? o.my.on.concat(o.my.vw || []) : o18Set(o.p));
const o18Load = on => O18.filter(x => on.has(x[0])).reduce((a, x) => a + x[4], 0);
function o18Stage(o) {
  const on = o18On(o);
  return `<div class="ovp-sch" aria-hidden="true"><i class="tb">${'<u></u>'.repeat(6)}<b>12:34</b>${'<u></u>'.repeat(6)}</i><i class="hp"><s></s></i><i class="ab">${'<u></u>'.repeat(4)}</i><i class="it">${'<u></u>'.repeat(5)}</i><i class="mm"></i><i class="cr"></i><i class="fg"></i></div>
    ${Object.entries(O18Z).map(([z, [nm, x, y, w, h]]) => { const L = O18.filter(f => f[2] === z && on.has(f[0]));
      return `<button type="button" class="o18-z${L.length ? ' on' : ''}" data-z="${z}" style="left:${x}%;top:${y}%;width:${w}%;height:${h}%" aria-label="${esc(nm)}: ${L.length}"><b>${esc(nm)}<em>${L.length || ''}</em></b>${L.slice(0, 4).map(f => `<span>${esc(f[1])}</span>`).join('')}${L.length > 4 ? `<span class="m">ещё ${L.length - 4}</span>` : ''}</button>`; }).join('')}`;
}
function o18Side(o, zf) {
  const my = o.p === 'my', on = o18On(o), L = O18.filter(f => (my || f[3] > 0) && (!zf || f[2] === zf));
  const load = o18Load(new Set([...on].filter(id => (O18.find(f => f[0] === id) || [])[3] > 0))), n = O18.filter(f => f[3] > 0 && on.has(f[0])).length;
  const row = f => { const v = !f[3], c = on.has(f[0]);
    return `<li class="${c ? 'on' : ''}${v ? ' vw' : ''}">${my ? `<label><input type="checkbox" data-t="${f[0]}"${c ? ' checked' : ''}><span>${esc(f[1])}</span></label>` : `<i>${c ? '✓' : '—'}</i><span>${esc(f[1])}</span>`}
      <small>${esc(f[6])}${f[5] === 'kl' ? ' · как в Lite — легче' : ''}</small><em class="o18-c c${f[4]}" title="Нагрузка">${v ? 'вид' : O18L[f[4]]}</em>${f[7] ? '<em class="o18-y">есть</em>' : ''}</li>`; };
  const zs = zf ? [zf] : Object.keys(O18Z);
  return `<p class="ovp-d"><b>${O18P[o.p][0]}</b> — ${O18P[o.p][1]} · ${n} ${pl(n, ['функция', 'функции', 'функций'])} · нагрузка ${load <= 16 ? 'низкая' : load <= 34 ? 'средняя' : 'выше'}${zf ? ` · <button type="button" class="lnk" id="o18all">все зоны</button>` : ''}</p>
    ${zs.map(z => { const R = L.filter(f => f[2] === z); return R.length ? `<h4 class="o18-h">${esc(O18Z[z][0])}</h4><ul class="ovp-l o18-l">${R.map(row).join('')}</ul>` : ''; }).join('')}
    ${my ? `<div class="ovp-b"><button class="btn s g" type="button" id="o18sh">Поделиться кодом</button><button class="btn s g" type="button" id="o18im">Вставить код</button></div><p class="ovp-msg" id="o18msg" aria-live="polite"></p>`
      : `<button class="btn s g" type="button" id="o18cp">Сделать свой на основе «${O18P[o.p][0]}»</button>`}`;
}
let O18F = '';
function o18Draw() {
  const o = o18State(), st = $('#ovpst'), sd = $('#ovpside'); if (!st || !sd) return;
  $$('#ovptabs button').forEach(b => b.setAttribute('aria-selected', b.dataset.p === o.p));
  st.innerHTML = o18Stage(o); sd.innerHTML = o18Side(o, O18F);
  $$('.o18-z', st).forEach(z => z.classList.toggle('sel', z.dataset.z === O18F));
}
function o18Bind() {
  $('#ovptabs').onclick = e => { const b = e.target.closest('[data-p]'); if (!b) return; const o = o18State(); o.p = b.dataset.p; o18Put(o); o18Draw(); };
  $('#ovpst').onclick = e => { const z = e.target.closest('[data-z]'); if (!z) return; O18F = O18F === z.dataset.z ? '' : z.dataset.z; o18Draw(); };
  $('#ovpside').onclick = e => {
    const o = o18State(), msg = t => { const m = $('#o18msg'); if (m) m.textContent = t; };
    if (e.target.id === 'o18all') { O18F = ''; o18Draw(); return; }
    if (e.target.id === 'o18cp') { o.my = {on: o18Set(o.p), vw: (o.my && o.my.vw) || []}; o.p = 'my'; o18Put(o); o18Draw(); return; }
    if (e.target.id === 'o18sh') { const code = 'RL2-' + btoa(unescape(encodeURIComponent(JSON.stringify(o.my)))); (navigator.clipboard ? navigator.clipboard.writeText(code) : Promise.reject()).then(() => msg('Код скопирован — кинь другу, он вставит у себя.')).catch(() => msg(code)); return; }
    if (e.target.id === 'o18im') { const c = prompt('Вставь код пресета (начинается с RL2-)'); if (!c) return;
      try { const my = JSON.parse(decodeURIComponent(escape(atob(c.trim().replace(/^RL2-/, ''))))); if (!my || !Array.isArray(my.on)) throw 0; const ok = id => O18.some(x => x[0] === id); my.on = my.on.filter(ok); my.vw = (my.vw || []).filter(ok); o.my = my; o.p = 'my'; o18Put(o); o18Draw(); msg('Пресет вставлен.'); } catch (er) { msg('Код не подошёл.'); } }
  };
  $('#ovpside').onchange = e => { const t = e.target.closest('[data-t]'); if (!t) return; const o = o18State(), f = O18.find(x => x[0] === t.dataset.t), k = f[3] ? 'on' : 'vw', S = new Set(o.my[k] || []); t.checked ? S.add(f[0]) : S.delete(f[0]); o.my[k] = O18.map(x => x[0]).filter(id => S.has(id)); o18Put(o); o18Draw(); };
}
viewOvs = function () {
  vNew(); document.body.classList.remove('ovm'); clearInterval(OV.timer); clearInterval(OV.clk);
  $$('#tabs a').forEach(x => x.classList.toggle('on', x.dataset.t === 'ovs'));
  window.scrollTo(0, 0); O18F = '';
  V(`<section class="ovs">
    <header class="ovs-h"><h1>Оверлей</h1></header>
    <div class="ovs-st" id="ovsst"></div>
    <div class="ovp">
      <div class="ovp-tabs" id="ovptabs" role="tablist">${Object.entries(O18P).map(([k, [nm, d]]) => `<button type="button" role="tab" data-p="${k}"><b>${nm}</b><small>${d}</small></button>`).join('')}</div>
      <div class="ovp-main"><div class="ovp-stage o18-st" id="ovpst" aria-label="Экран игры: где что покажет Restless"></div><div class="ovp-side" id="ovpside"></div></div>
    </div>
    ${o18Fps()}
  </section>`);
  ovsPaint(); o18Draw(); o18Bind(); o18FpsBind();
};
// ---------- FPS: настройки движка в gameinfo.gi — ставит программа (в мод их не встроить: игра читает их только из gameinfo.gi) ----------
const O18FPS = [['off', 'Как в игре', 'ничего не меняем'], ['light', 'Лёгкий', 'картинка почти та же: без брызг, искр, размытия фона'], ['mid', 'Средний', '+ проще тени, без затенения углов и трупов'], ['max', 'Максимум', '+ без теней и части света — карта плоская, FPS выше всего']];
const o18FpsCur = () => { try { return localStorage.getItem('rl-fps') || 'off'; } catch (e) { return 'off'; } };
function o18Fps() {
  const c = o18FpsCur(), host = !!(window.rlHost && rlHost.setFps);
  return `<section class="o18-fps"><div class="q-sec"><b>FPS в игре</b></div>
    <div class="o18-fb" id="o18fps">${O18FPS.map(([k, nm, d]) => `<button type="button" data-f="${k}" aria-pressed="${c === k}"><b>${nm}</b><small>${d}</small></button>`).join('')}</div>
    <p class="sub" id="o18fm"></p></section>`;
}
function o18FpsBind() {
  const el = $('#o18fps'); if (!el) return;
  el.onclick = e => { const b = e.target.closest('[data-f]'); if (!b) return; const f = b.dataset.f; try { localStorage.setItem('rl-fps', f); } catch (er) {}
    $$('[data-f]', el).forEach(x => x.setAttribute('aria-pressed', x === b)); const m = $('#o18fm');
    if (window.rlHost && rlHost.setFps) { rlHost.setFps(f); if (m) m.textContent = 'Готово — перезапусти игру. Если игра открыта, программа поставит после выхода.'; }
    else if (m) m.textContent = 'Запомнил. Поставит программа Restless, когда она запущена.'; };
}
