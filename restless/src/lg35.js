// ===================== lg35 (07.11) — «Оверлей → В игре» заново: все функции мода 0.37 на кадре игры и по пунктам =====================
// Андрей: «чтобы на сайте были все функции и на скрине показывалось, что они делают; если со скрином заёб — по пунктам максимально понятно».
// Было: 50 пунктов-хотелок из QoL (половина «скоро»), кадр маленький. Теперь — только то, что в моде есть, у каждой функции номер:
// тот же номер стоит на кадре там, где она появляется в игре, и рядом нарисовано, как она выглядит. Нажал на функцию — она подсвечена на кадре.
// Статус честный: «работает» — видели в матче; «проверь в матче» — сделано по файлам игры, в матче ещё не подтверждено; «пока не работает».
// [ключ, название, что делает, набор, статус, группа: g — на экране игры, m — в меню и магазине]
const F35 = [
  ['hk', 'Ctrl+Alt+H — окно Restless', 'Окно сайта: лайв-матч, профиль, герои, патчи. То же окно — кнопкой «САЙТ» в окне RESTLESS. Закрыть — снова Ctrl+Alt+H, × или Esc', 'всегда', 'chk', 'g'],
  ['lva', 'LIVE · 12 в меню Esc', 'Открыл Esc в матче — сбоку все 12 игроков: ранг, винрейт на герое, метки', 'Lite', 'ok', 'g'],
  ['ult', 'КД ульты в верхней панели', 'Секунды до ульты под портретом каждого игрока', 'Lite', 'ok', 'g'],
  ['rank', 'Ранги игроков', 'Значок ранга под портретом каждого', 'Lite', 'chk', 'g'],
  ['lrk', 'Средний ранг команд', 'Под часами — средний ранг своей команды и врагов', 'Lite', 'chk', 'g'],
  ['evt', 'Напоминания о событиях', 'За 10 с до лагерей, ящиков и статуй — плашка под часами', 'Lite', 'chk', 'g'],
  ['camp', 'Таймеры лагерей', 'Лагерь зачистили (кто угодно) — на мини-карте отсчёт до возрождения: 1:25 / 4:50 / 5:35', 'Lite', 'chk', 'g'],
  ['ultw', 'КД ульты над героем', 'Секунды до ульты над полоской здоровья героя в мире', 'Lite', 'no', 'g'],
  ['miss', 'Пропавшие враги', 'Портрет врага темнеет, пока его не видно', 'Medium', 'chk', 'g'],
  ['thp', 'Здоровье на портретах', 'Кольцо на портрете: жёлтое ниже 75 %, оранжевое ниже 65 %, красное ниже 25 %', 'Medium', 'chk', 'g'],
  ['rift', 'Урна, разлом, мост', 'Под счётом: когда урна, разлом и бафф на мосту. За 2 мин — всегда, раньше — по Alt', 'Medium', 'chk', 'g'],
  ['cmb', '«В бою»', '«В БОЮ» под прицелом, вышел из боя — «ВНЕ БОЯ» на 2 с', 'Medium', 'chk', 'g'],
  ['ammo', 'Патроны у прицела', 'Сколько патронов осталось — рядом с прицелом, мало — красным', 'Medium', 'chk', 'g'],
  ['rld', 'Перезарядка у прицела', '«ПЕРЕЗАРЯДКА» под прицелом, пока идёт', 'Medium', 'chk', 'g'],
  ['ait', 'Активные предметы у прицела', 'Готов — ярко, на перезарядке — тускло с секундами', 'Medium', 'chk', 'g'],
  ['uns', 'Незащищённые души', 'Сколько душ потеряешь при смерти — крупно над умениями', 'Medium', 'chk', 'g'],
  ['rbuy', 'Кто что купил', 'Новая покупка врага — справа на 8 с: кто и какой предмет', 'Medium', 'chk', 'g'],
  ['zip', 'Буст на канате', 'Готов ли буст и сколько до него', 'Enchanted', 'chk', 'g'],
  ['spd', 'Скорость', 'Спидометр самой игры — скорость героя', 'Enchanted', 'chk', 'g'],
  ['perf', 'Нагрузка мода', 'Сколько миллисекунд в секунду ест мод', 'Enchanted', 'chk', 'g'],
  ['alt', 'Мелочи — только по Alt', 'Буст, нагрузка, урна и разлом заранее — видно, пока зажат Alt', 'Lite', 'chk', 'g'],
  ['box', 'Где могут быть ящики', 'Точки на мини-карте, где ящики могут появиться. Не все появляются — игра не говорит какие, поэтому выключено', 'выкл.', 'chk', 'g'],
  ['sbx', 'Меню песочницы в укрытии', 'В укрытии: добавить врага, союзника, крипов', 'Lite', 'chk', 'g'],
  ['set', 'Окно RESTLESS в меню Esc', 'Наборы Lite / Medium / Enchanted, переключатели, «Что видит мод»', 'всегда', 'ok', 'm'],
  ['mark', 'Надпись RESTLESS в главном меню', 'Видно, что мод загружен и какая версия', 'всегда', 'ok', 'm'],
  ['news', 'Новости и Песочница в главном меню', 'Две кнопки в главном меню игры', 'всегда', 'chk', 'm'],
  ['bld', 'Сборка одной кнопкой', 'Магазин → Сборки → ★ RESTLESS: лучшая сборка на твоего героя', 'всегда', 'chk', 'm'],
  ['lane', 'Линия «с пати» сама', 'В окне пати сразу стоит «С пати»', 'всегда', 'chk', 'm']];
const F35S = {ok: ['работает', 'видели в матче'], chk: ['проверь в матче', 'сделано по файлам игры'], no: ['пока не работает', 'ищем, как достать']};
const F35P = ['всегда', 'Lite', 'Medium', 'Enchanted', 'выкл.'];
// место номера на кадре, %
const F35XY = {hk: [24.5, 20], lva: [33.5, 24], ult: [29.4, 7.4], rank: [29.4, 10.4], lrk: [39.6, 7.6], evt: [41.4, 18.6], camp: [82.4, 77], ultw: [42.8, 46.6], miss: [70.4, 3.4], thp: [29.4, 3.4],
  rift: [38.6, 12.4], cmb: [46.4, 55], ammo: [56.6, 50], rld: [42.6, 59.2], ait: [45.4, 63.6], uns: [37.4, 77], rbuy: [82.4, 31.4], zip: [86.6, 24.6], spd: [7.6, 89.4], perf: [11.6, 2.8], alt: [12.4, 7.6], box: [82.4, 90], sbx: [20.2, 42]};
let F35SEL = '', F35F = '';
function f35Port(i, side) {
  const x = side ? 51.6 + i * 3 : 31 + i * 3;
  return `<i class="z35-pt${side ? ' e' : ''}" style="left:${x}%"></i>`;
}
function f35Stage() {
  const P = [0, 1, 2, 3, 4, 5].map(i => f35Port(i, 0)).join('') + [0, 1, 2, 3, 4, 5].map(i => f35Port(i, 1)).join('');
  const ultN = ['42', '', '1:10', '', '8', ''], ult = ultN.map((v, i) => v ? `<b class="z35-ul" style="left:${31 + i * 3}%">${v}</b>` : '').join('');
  const rk = [0, 1, 2, 3, 4, 5].map(i => `<i class="z35-rk" style="left:${31.6 + i * 3}%"></i><i class="z35-rk" style="left:${52.2 + i * 3}%"></i>`).join('');
  return `<div class="z35-f" id="z35f">
    <img src="ovs-game.webp" alt="" class="z35-bg">
    <div class="z35-ui" aria-hidden="true">
      <div class="z35-m" data-m="miss thp ult rank">${P}<b class="z35-clk">12:34</b></div>
      <div class="z35-m" data-m="ult">${ult}</div>
      <div class="z35-m" data-m="rank">${rk}</div>
      <div class="z35-m" data-m="thp"><i class="z35-ring" style="left:34%"></i></div>
      <div class="z35-m" data-m="miss"><i class="z35-dark" style="left:63.6%"></i><i class="z35-dark" style="left:66.6%"></i></div>
      <div class="z35-m z35-chip" data-m="lrk" style="left:50%;top:7.6%">свои <b>Ритуалист</b> · враги <b>Эмиссар</b></div>
      <div class="z35-m z35-chip" data-m="rift" style="left:50%;top:12.4%">урна 1:40 · разлом ≈19:00 · мост 0:45</div>
      <div class="z35-m z35-chip a" data-m="evt" style="left:50%;top:18.6%">Через 10 с: средние лагеря</div>
      <div class="z35-m z35-ultw" data-m="ultw" style="left:47%;top:46.6%"><i></i><b>0:38</b></div>
      <i class="z35-cross" style="left:50%;top:50%"></i>
      <div class="z35-m z35-txt" data-m="ammo" style="left:54.2%;top:50%">24</div>
      <div class="z35-m z35-txt r" data-m="cmb" style="left:50%;top:55%">В БОЮ</div>
      <div class="z35-m z35-txt a" data-m="rld" style="left:50%;top:59.2%">ПЕРЕЗАРЯДКА</div>
      <div class="z35-m z35-its" data-m="ait" style="left:50%;top:63.6%"><i></i><i class="cd">12</i><i></i></div>
      <div class="z35-m z35-chip o" data-m="uns" style="left:50%;top:77%">Незащищённые души 1 240</div>
      <div class="z35-ab"><i></i><i></i><i></i><i></i></div>
      <div class="z35-hp"><i></i></div>
      <div class="z35-m z35-txt" data-m="spd" style="left:12%;top:89.4%">7,4 м/с</div>
      <div class="z35-mm"><div class="z35-m" data-m="camp"><b style="left:22%;top:30%">1:25</b><b style="left:62%;top:58%">4:50</b><b style="left:38%;top:72%">12</b></div>
        <div class="z35-m z35-dots" data-m="box">${Array.from({length: 18}, (_, i) => `<i style="left:${8 + (i * 37) % 84}%;top:${10 + (i * 53) % 80}%"></i>`).join('')}</div></div>
      <div class="z35-m z35-chip" data-m="zip" style="left:91%;top:24.6%">буст 2:10</div>
      <div class="z35-m z35-chip" data-m="rbuy" style="left:91%;top:31.4%"><b>Venator</b> купил Toxic Bullets</div>
      <div class="z35-m z35-chip" data-m="perf" style="left:1.5%;top:2.8%;transform:translateY(-50%)">мод 1,2 мс</div>
      <div class="z35-m z35-chip" data-m="alt" style="left:1.5%;top:7.6%;transform:translateY(-50%)">Alt — видно всё</div>
      <div class="z35-m z35-win s" data-m="sbx" style="left:1.5%;top:40%;width:17%;height:22%"><b>Песочница</b><span>Добавить врага</span><span>Добавить союзника</span><span>Крипы</span></div>
      <div class="z35-m z35-win" data-m="lva" style="left:1.5%;top:22%;width:30%;height:56%"><b>RESTLESS · LIVE</b>${Array.from({length: 6}, (_, i) => `<span><i></i>Игрок ${i + 1} · ранг · 54 %</span>`).join('')}</div>
      <div class="z35-m z35-win" data-m="hk" style="left:26%;top:18%;width:48%;height:62%"><b>RESTLESS <em>Лайв-матч · Профиль · Герои · Патчи</em></b>${Array.from({length: 5}, () => '<span><i></i><u></u></span>').join('')}<small>Ctrl+Alt+H</small></div>
    </div>
    <div class="z35-pins">${F35.filter(f => F35XY[f[0]]).map(f => `<button type="button" class="z35-pin s-${f[4]}" data-k="${f[0]}" style="left:${F35XY[f[0]][0]}%;top:${F35XY[f[0]][1]}%" title="${esc(f[1])}">${F35.indexOf(f) + 1}</button>`).join('')}</div>
  </div>`;
}
function f35List() {
  const L = F35.filter(f => !F35F || f[4] === F35F);
  const row = f => { const i = F35.indexOf(f) + 1, st = F35S[f[4]];
    return `<button type="button" class="z35-r s-${f[4]}${F35SEL === f[0] ? ' on' : ''}" data-k="${f[0]}"><span class="z35-n">${i}</span>
      <span class="z35-t"><b>${esc(f[1])}</b><small>${esc(f[2])}</small></span>
      <span class="z35-st"><em>${st[0]}</em><i>${esc(f[3] === 'выкл.' ? 'выключено' : f[3] === 'всегда' ? 'всегда' : 'набор ' + f[3])}</i></span></button>`; };
  const grp = (t, A) => A.length ? `<h3 class="z35-h">${t}</h3><div class="z35-l">${A.map(row).join('')}</div>` : '';
  const n = k => F35.filter(f => f[4] === k).length, fb = (k, t, m) => `<button type="button" data-ff="${k}" class="${F35F === k ? 'on' : ''}">${t}<b>${m}</b></button>`;
  return `<div class="z35-ff">${fb('', 'Все', F35.length)}${fb('ok', 'Работают', n('ok'))}${fb('chk', 'Проверь в матче', n('chk'))}${fb('no', 'Пока нет', n('no'))}</div>
    ${grp('На экране игры', L.filter(f => f[5] === 'g'))}${grp('В меню и магазине', L.filter(f => f[5] === 'm'))}`;
}
function f35View() {
  return `<section class="z35">
    <div class="z35-key"><b>Ctrl+Alt+H</b><span>окно Restless прямо в игре — без программы</span><b>Esc → RESTLESS</b><span>наборы и переключатели</span></div>
    ${f35Stage()}
    <div class="z35-side" id="z35s">${f35List()}</div>
  </section>`;
}
function f35Sel(k, scroll) {
  F35SEL = F35SEL === k ? '' : k;
  const f = $('#z35f'); if (!f) return;
  f.classList.toggle('sel', !!F35SEL);
  $$('.z35-m', f).forEach(m => m.classList.toggle('z35-hi', !!F35SEL && m.dataset.m.split(' ').includes(F35SEL)));
  $$('.z35-pin', f).forEach(p => p.classList.toggle('z35-hi', p.dataset.k === F35SEL));
  $$('.z35-r').forEach(r => r.classList.toggle('on', r.dataset.k === F35SEL));
  if (scroll && F35SEL) f.scrollIntoView({behavior: 'smooth', block: 'nearest'});
}
function f35Bind() {
  const s = $('.z35'); if (!s) return;
  s.addEventListener('click', e => {
    const ff = e.target.closest('[data-ff]'); if (ff) { F35F = ff.dataset.ff; $('#z35s').innerHTML = f35List(); if (F35SEL) f35Sel(F35SEL), f35Sel(F35SEL); return; }
    const p = e.target.closest('.z35-pin'); if (p) { f35Sel(p.dataset.k); const r = $(`.z35-r[data-k="${p.dataset.k}"]`); if (r && F35SEL) r.scrollIntoView({behavior: 'smooth', block: 'nearest'}); return; }
    const r = e.target.closest('.z35-r'); if (r) f35Sel(r.dataset.k, true);
  });
}
{ const VO35 = viewOvs;
  viewOvs = function () {
    if (u30Tab() !== 'game') return VO35.apply(this, arguments);
    vNew(); document.body.classList.remove('ovm'); try { clearInterval(OV.timer); clearInterval(OV.clk); } catch (e) {}
    $$('#tabs a').forEach(x => x.classList.toggle('on', x.dataset.t === 'ovs'));
    V(`<section class="ovs u30"><header class="ovs-h"><h1>Оверлей</h1></header>${u30Bar('game')}<div class="ovs-st" id="ovsst"></div>${f35View()}</section>`);
    try { ovsPaint(); } catch (e) {}
    f35Bind();
    const sec = $('.ovs'); if (sec) sec.classList.add('u30-in');
    u30Slide('game');
  }; }
