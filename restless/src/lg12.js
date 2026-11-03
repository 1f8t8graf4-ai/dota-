// ===================== lg12 — 03.11: оверлей берёт матч из игры (мод Restless 0.13 → программа), а не из API топ-матчей =====================
// Открытый API (matches/active) знает только ~150 матчей с высоким рейтингом — обычный матч там не появляется никогда,
// поэтому панель вечно «ждала матч». Теперь кто в матче, говорит сама игра: мод шлёт программе на 127.0.0.1 ник, героя и ID
// каждого из 12, программа зовёт window.rlGame(g). ID нет — ищем игрока по нику (players/steam-search).
// Без программы (обычный браузер) — как было: только топ-матчи из API.
const RL_APP = /[?&]app=1/.test(location.search);
if (RL_APP) document.documentElement.classList.add('rl-app');
const OVHRU = {1:'Инфернус',2:'Семь',3:'Виндикта',4:'Леди Гайст',6:'Абрамс',7:'Тень',8:'Макгиннис',10:'Парадокс',11:'Динамо',12:'Кельвин',13:'Пелена',14:'Холлидей',15:'Бибоп',16:'Калико',17:'Серый Коготь',18:'Мо и Мелкий',19:'Заточка',20:'Плющик',25:'Дозорный',27:'Ямато',31:'Хлыст',35:'Вязкус',50:'Карман',52:'Мираж',58:'Гадюка',60:'Синклер',63:'Мина',64:'Скиталец',65:'Венатор',66:'Виктор',67:'Пейдж',69:'Швейцар',72:'Билли',76:'Грейвс',77:'Аполлон',78:'Дохлый Дэнни',79:'Дрём',80:'Сильвер',81:'Селеста',84:'Крысиный король',85:'Соломон',86:'Виолетта',87:'Сестра Хэрроу',88:'Буся'};
const ovlc = s => String(s || '').replace(/\s+/g, ' ').trim().toLowerCase().replace(/ё/g, 'е');
let OVHN = null;
function heroByName(s) {
  if (!OVHN) { OVHN = {}; Object.entries(D.heroes || {}).forEach(([id, h]) => { OVHN[ovlc(h.n)] = +id; }); Object.entries(OVHRU).forEach(([id, n]) => { OVHN[ovlc(n)] = +id; }); }
  return OVHN[ovlc(s)] || 0;
}
// ник → ID: память браузера на 30 дней, иначе поиск Steam (точное совпадение ника)
const OVNMK = 'rl-nm';
async function idByName(name) {
  const k = ovlc(name); if (!k) return {id: 0};
  if (ME && ME.name && ovlc(ME.name) === k) return {id: ME.id};
  let M = {}; try { M = JSON.parse(localStorage.getItem(OVNMK) || '{}'); } catch (e) {}
  if (M[k] && Date.now() - M[k][1] < 30 * 86400e3) return {id: M[k][0], guess: !!M[k][2]};
  try {
    const L = await api('players/steam-search?limit=8&search_query=' + encodeURIComponent(name));
    const ex = (L || []).filter(x => ovlc(x.personaname) === k);
    if (!ex.length) return {id: 0};
    M[k] = [ex[0].account_id, Date.now(), ex.length > 1 ? 1 : 0];
    try { localStorage.setItem(OVNMK, JSON.stringify(M)); } catch (e) {}
    return {id: ex[0].account_id, guess: ex.length > 1};
  } catch (e) { return {id: 0}; }
}
// состояние программы: мод поставлен? клавиши? связь с игрой?
OV.app = null; OV.G = null; OV.gk = ''; OV.was = 0;
window.rlApp = s => { OV.app = s; ovAppLine(); };
window.rlGame = g => { const k = g && g.s === 'm' ? (g.players || []).map(p => p.t + p.n + (p.hid || p.h) + (p.a || '')).join('|') : g ? g.s : ''; const ch = k !== OV.gk2; OV.gk2 = k; OV.G = g; if (ch && OV.kick) OV.kick(); else ovAppLine(); };
const gameLive = () => OV.G && Date.now() - OV.G.at < 45000;
function ovAppLine() {
  const el = $('#ovapp'); if (!el) return;
  const a = OV.app || {}, m = a.mod || {}, g = gameLive() ? OV.G : null;
  const mod = {installed: 'мод поставлен ✓ — перезапусти игру', cleaned: 'мод на месте ✓ · старые файлы убраны', ok: 'мод на месте ✓', busy: 'мод поставлю, когда закроешь игру', nogame: 'не нашёл Deadlock — поставь мод вручную', error: 'мод: ошибка ' + (m.err || ''), wait: 'проверяю мод…'}[m.status] || '';
  const link = g ? (g.s === 'm' ? `игра на связи · игроков ${g.players.length}` : 'игра на связи · укрытие') : a.proc ? 'игра запущена, мод молчит — Esc → RESTLESS: «Связь с программой» ВКЛ' : 'жду игру';
  el.innerHTML = `<span class="${g ? 'on' : ''}">${esc(link)}</span>${mod ? `<span>${esc(mod)}</span>` : ''}${a.keys && a.keys[0] ? `<span>${esc(a.keys[0])} — скрыть</span>` : ''}`;
}
async function ovFromGame(n) {
  if (!gameLive() || OV.G.s !== 'm' || !(OV.G.players || []).length) {
    if (OV.was && gameLive() && OV.G.s === 'h') { OV.was = 0; OV.gk = ''; OV.L = null; clearInterval(OV.clk); ovStatus('матч закончился');
      put(n, '#ovb', `<div class="ov-e">Матч закончился. Через пару минут он появится в профиле — там разбор.${ME ? `<a class="btn" href="?id=${ME.id}#home" target="_blank" rel="noopener">Открыть профиль ↗</a>` : ''}</div>`); return true; }
    return false;
  }
  const g = OV.G, key = OV.gk2;
  clearInterval(OV.clk); OV.mid = 0;   // часы матча из API (если он был) не перебивают время из игры
  ovStatus(`ты в матче${g.gt ? ' · ' + g.gt : ''}`);
  if (key === OV.gk && OV.L) return true;
  const first = !OV.L || !OV.was; OV.gk = key; OV.was = 1;
  if (first) put(n, '#ovb', '<div class="load">Игроки из игры: смотрю ранги, героев и серии всех 12…</div>');
  const R = await Promise.all(g.players.map(async p => p.a ? {id: p.a} : idByName(p.n)));
  if (n !== VQ || OV.gk !== key) return true;
  const P = g.players.map((p, i) => ({account_id: R[i].id || 0, hero_id: p.hid || heroByName(p.h), team: p.t === 'f' ? 0 : 1, gname: p.n, guess: R[i].guess}));
  const L = await scout2(P, {mid: 0}).catch(() => null);
  if (n !== VQ || OV.gk !== key) return true;
  if (!L) { put(n, '#ovb', '<div class="ov-e">Не вышло загрузить игроков. Попробую ещё раз через 5 с.</div>'); OV.gk = ''; return true; }
  L.forEach((x, i) => { if (!x.id || x.name === 'Скрытый игрок') x.name = P[i].gname; if (P[i].guess) x.name += ' ?'; if (!x.id) x.tags = [['', 'Профиль не найден', 'ника нет в открытых данных — поиск по нику не нашёл, ID из профиля в игре мод не дал']].concat(x.tags || []); });
  OV.L = L; OV.mid = 0; ovDraw();
  return true;
}
// проверка по API (как раньше) — только если игра молчит
async function ovFromApi(n) {
  let m = null, ok = true;
  try { const A = await live(OV.demo ? 'matches/active' : `matches/active?account_id=${ME.id}`); m = OV.demo ? ((OV.mid && (A || []).find(x => x.match_id === OV.mid)) || (A || [])[0] || null) : (A || [])[0] || null; } catch (e) { ok = false; }
  if (n !== VQ) return;
  if (!ok) { ovStatus('нет связи · повторю через 5 с'); return; }
  if (!m) {
    if (OV.mid && !OV.demo) { const mid = OV.mid; OV.mid = 0; OV.L = null; clearInterval(OV.clk); ovStatus('матч закончился'); put(n, '#ovb', `<div class="ov-e">Матч закончился.<a class="btn" href="#m/${mid}/co" target="_blank" rel="noopener">Разбор матча ↗</a></div>`); return; }
    ovStatus(RL_APP ? 'жду матч из игры' : 'жду матч · проверяю каждые 20 с');
    if (!OV.L) put(n, '#ovb', `<div class="ov-e"><b style="color:var(--tx)">Сейчас ты не в матче</b>${RL_APP ? `<ul class="ov-why"><li>Матч начнётся — здесь появятся все 12 игроков. Их передаёт мод Restless из игры.</li><li>Программа ставит мод сама. Проверка в игре: Esc → <b>RESTLESS</b> → «Связь с программой» ВКЛ.</li><li>Открытый API видит только топ-матчи, поэтому без мода обычный матч не найти.</li></ul>` : 'Как только найдётся — здесь появятся все 12 игроков.'}${OV.demo ? '' : '<a class="btn g" href="#ov/demo">Показать на примере</a>'}</div>`);
    return;
  }
  if (m.match_id !== OV.mid) {
    OV.mid = m.match_id; OV.t = m.start_time; OV.L = null; ovStatus('матч найден · смотрю игроков…');
    put(n, '#ovb', '<div class="load">Смотрю ранги, героев и серии всех 12…</div>');
    const L = await scout2(m.players, {mid: m.match_id}).catch(() => null); if (n !== VQ) return;
    if (!L) { put(n, '#ovb', '<div class="ov-e">Не вышло загрузить игроков. Попробую ещё раз.</div>'); OV.mid = 0; return; }
    OV.L = L; ovDraw();
    clearInterval(OV.clk); const tickT = () => { if (n !== VQ) return clearInterval(OV.clk); if (OV.t) ovStatus(`${OV.demo ? 'идёт матч' : 'ты в матче'} · ${mmss(Math.max(0, now() - OV.t))}`); }; tickT(); OV.clk = setInterval(tickT, 1000);
  }
}
{ const VO0 = viewOv; viewOv = async function () {
    const r = await VO0.apply(this, arguments);
    const n = VQ;
    if ($('#ov') && !$('#ovapp') && RL_APP) $('#ov .ov-h').insertAdjacentHTML('afterend', '<div class="ov-app" id="ovapp"></div>');
    ovAppLine();
    if (!ME && !OV.demo) return r;   // сначала «кто ты?» — форма поиска из lg11
    clearInterval(OV.timer);
    let busy = false;
    const t = async () => { if (n !== VQ) { clearInterval(OV.timer); OV.kick = null; return; } if (busy) return; busy = true;
      try { ovAppLine(); if (!OV.demo && await ovFromGame(n)) return; if (!gameLive() || OV.demo) await ovFromApi(n); } finally { busy = false; } };
    OV.kick = t; t(); OV.timer = setInterval(t, RL_APP ? 5000 : 20000);
    return r; }; }
