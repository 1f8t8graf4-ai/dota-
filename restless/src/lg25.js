// ===================== lg25 — 04.11: «Оверлей» управляет модом, кадр показывает функции, моды рядом; лайв без старого матча; рекомендованный билд =====================
// Андрей: «управление не работает через сам оверлей — только через настройки RESTLESS» → набор с сайта уходит программе (0.4.8),
// программа отдаёт его моду (0.21) страницей 127.0.0.1:27515/cfg.html; мод присылает, что у него включено и какие моды рядом.
// «на скрине, который ты показываешь, не видно функций — просто скрин по приколу» → на кадре нарисованы сами функции, как в игре.
// «показывает старый матч в лайве — если не видит, не показывает» → свой «Лайв-матч» без живого матча: пусто, без прошлого матча.
// «кент взял героя впервые и не знал, что брать» → в лайве у своего героя — «Рекомендованный билд» с ID для поиска в игре.

// какие ключи мода у функции сайта
const L25K = {ult: ['ULT', 'ULTW'], rank: ['RANK'], lrk: ['LRK'], miss: ['MISS'], thp: ['THP'], cmb: ['CMB'], uns: ['UNS'], levt: ['EVT'], mmt: ['CAMP'],
  odmg: ['OBJ'], zip: ['ZIP'], cmp: ['SPD'], perf: ['PERF'], ammo: ['AMMO'], rld: ['RLD'], omap: ['OMAP'], rbuy: ['RBUY'], rift: ['RIFT'], lmmo: ['BOX']};
O18.forEach(f => {
  if (f[0] === 'rift') { f[1] = 'Урна, разлом, мост'; f[6] = 'урна: через сколько и у кого · разлом: точный отсчёт 20 с · бафф на мосту'; f[7] = 1; }
  if (f[0] === 'lmmo') { f[1] = 'Ящики и статуи'; f[6] = 'где стоят ящики и золотые статуи — точками на мини-карте'; f[7] = 1; }
  if (f[0] === 'ammo') f[6] = 'родное число патронов игры у прицела — без дубля';
});
function l25Cfg(o) { const on = o18On(o), a = []; Object.entries(L25K).forEach(([id, ks]) => ks.forEach(k => a.push(k + '=' + (on.has(id) ? 1 : 0)))); return a; }
function l25Merge(base, adds) {
  const M = new Map();
  String(base || '').split(';').concat(adds).forEach(p => { const i = p.indexOf('='); if (i > 0) M.set(p.slice(0, i), p.slice(i + 1)); });
  return [...M].map(([k, v]) => k + '=' + v).join(';');
}
const l25Host = () => !!(window.rlHost && rlHost.setModCfg);
function l25Send(adds) {
  if (!l25Host()) { l25Note('Настройки уходят в игру из программы Restless'); return false; }
  const v = l25Merge((OV.app && OV.app.modsent) || '', adds);
  rlHost.setModCfg(v); if (OV.app) OV.app.modsent = v;
  l25Note('Отправлено в игру'); return true;
}
function l25Note(t) { const m = $('#l25msg'); if (!m) return; m.textContent = t; clearTimeout(m._t); m._t = setTimeout(() => { m.textContent = ''; }, 4000); }

// ---------- сайт → мод: выбор набора и галочки «Custom» ----------
{ const B25 = o18Bind; o18Bind = function () { B25.apply(this, arguments);
    const go = () => setTimeout(() => l25Send(l25Cfg(o18State())), 0);
    $('#ovptabs').addEventListener('click', e => { if (e.target.closest('[data-p]')) go(); });
    $('#ovpside').addEventListener('change', e => { if (e.target.closest('[data-t]')) go(); });
    $('#ovpside').addEventListener('click', e => { if (e.target.id === 'o18cp' || e.target.id === 'o18im') go(); });
    $('#ovpst').addEventListener('click', e => { const b = e.target.closest('[data-l25v]'); if (!b) return; e.stopPropagation(); L25V = L25V === 'look' ? 'zones' : 'look'; o18Draw(); }, true);
  }; }

// ---------- кадр: как выглядит в игре ----------
let L25V = 'look';
const L25C = '83,321;119,343;149,726;199,771;209,404;227,567;244,748;266,416;275,812;279,395;289,351;307,555;323,245;329,521;344,353;356,621;368,254;387,552;416,660;433,519;443,423;456,334;475,390;488,589;498,544;505,296;525,691;544,575;556,577;566,710;584,626;614,312;625,647;639,353;647,388;673,532;677,450;689,328;705,316;716,243;728,438;735,581;749,400;784,374;791,237;837,252;879,595'.split(';').map(p => p.split(',').map(Number));
const L25G = '68,363;151,346;229,595;254,431;280,405;296,592;305,381;329,464;343,381;354,561;386,274;421,279;462,604;491,489;505,505;525,630;584,607;634,562;644,613;647,696;675,528;694,361;704,408;722,347;737,775;756,563;806,500;880,624'.split(';').map(p => p.split(',').map(Number));
const L25MM = 'https://assets-bucket.deadlock-api.com/assets-api-res/images/maps/minimap_midtown_mid.png';
const L25H = [65, 6, 13, 63, 69, 84, 1, 2, 3, 4, 7, 8];
function l25Look(o) {
  const on = o18On(o), h = id => on.has(id), H = window.RL_DATA ? RL_DATA.heroes : {}, im = k => (H[k] || {}).i || '';
  const items = window.RL_DATA ? Object.values(RL_DATA.items) : [], buy = (items.find(x => x.n === 'Mystic Shot') || items[0] || {}).i || '';
  const rk = (a, b) => `<img class="rk" src="rk/${a}-${b}@64.webp" alt="">`;
  const port = (k, i) => {
    const en = i >= 6, cls = [en ? 'e' : 'f', h('miss') && i === 9 ? 'miss' : '', h('thp') && (i === 2 || i === 10) ? (i === 2 ? 'hp65' : 'hp25') : ''].join(' ');
    return `<span class="l25-p ${cls}"><img src="${esc(im(k))}" alt="" onerror="${noimg}">
      ${h('ult') && [1, 4, 8, 11].includes(i) ? `<em class="u">${[37, 12, 104, 58][[1, 4, 8, 11].indexOf(i)]}</em>` : ''}
      ${h('rank') ? rk([7, 9, 8, 6, 10, 7, 9, 8, 11, 7, 6, 9][i], 1 + i % 6) : ''}
      ${h('odmg') && (i === 0 || i === 7) ? `<em class="od">${i ? '830' : '12.5k'}</em>` : ''}
      ${h('rbuy') && i === 7 && buy ? `<img class="by" src="${esc(buy)}" alt="">` : ''}</span>`;
  };
  const mm = `<span class="l25-mm"><img class="map" src="${L25MM}" alt="" onerror="this.remove()">
      ${h('lmmo') ? L25C.map(([x, y]) => `<i class="c" style="left:${x / 10}%;top:${y / 10}%"></i>`).join('') + L25G.map(([x, y]) => `<i class="g" style="left:${x / 10}%;top:${y / 10}%"></i>`).join('') : ''}
      ${h('mmt') ? `<b class="t" style="left:28%;top:41%">1:12</b><b class="t" style="left:66%;top:63%">3:40</b>` : ''}</span>`;
  return `<div class="l25-fx" aria-hidden="true">
    <div class="l25-tb">${L25H.slice(0, 6).map(port).join('')}<b class="clk">12:34</b>${L25H.slice(6).map((k, i) => port(k, i + 6)).join('')}</div>
    ${h('lrk') ? `<div class="l25-lrk">${rk(8, 3)}${rk(9, 1)}</div>` : ''}
    ${h('omap') ? `<div class="l25-om">${'<u></u>'.repeat(5)}<s></s>${'<u class="x"></u>'.repeat(2)}${'<u></u>'.repeat(3)}</div>` : ''}
    ${h('rift') ? '<div class="l25-pill rift">Урна через 3:20 · Разлом ~11:20–13:20 · Мост ~1:40</div>' : ''}
    ${h('levt') ? '<div class="l25-pill evt">Через 12 с: ящики и золотые статуи</div>' : ''}
    ${h('perf') ? '<div class="l25-perf">Restless: 0.4 мс в секунду</div>' : ''}
    ${h('zip') ? '<div class="l25-pill zip">Буст на канате · готов</div>' : ''}
    <i class="l25-cr"></i>
    ${h('ammo') ? '<div class="l25-am">23 <small>/ 40</small></div>' : ''}
    ${h('rld') ? '<div class="l25-rl">ПЕРЕЗАРЯДКА</div>' : ''}
    ${h('cmb') ? '<div class="l25-cmb">В БОЮ</div>' : ''}
    ${h('uns') ? '<div class="l25-pill uns">Незащищённые души: 1 240</div>' : ''}
    ${h('cmp') ? '<div class="l25-spd">7.4 m/s</div>' : ''}
    <div class="l25-hp"><s></s></div><div class="l25-ab">${'<u></u>'.repeat(4)}</div>
    ${mm}
  </div><button type="button" class="l25-vw" data-l25v="1">${L25V === 'look' ? 'Зоны' : 'Как в игре'}</button>`;
}
{ const S25 = o18Stage; o18Stage = function (o) { return S25.apply(this, arguments) + l25Look(o); }; }
{ const D25 = o18Draw; o18Draw = function () { D25.apply(this, arguments); const st = $('#ovpst'); if (st) st.classList.toggle('l25-look', L25V === 'look'); }; }

// ---------- «В игре»: что у мода сейчас и моды рядом ----------
const L25ON = c => { const M = {}; String(c || '').split(';').forEach(p => { const i = p.indexOf('='); if (i > 0) M[p.slice(0, i)] = p.slice(i + 1); }); return M; };
function l25ModHTML() {
  const a = OV.app || null, mc = a && a.modcfg, fresh = mc && Date.now() - mc.at < 90000;
  if (!l25Host()) return '';
  const M = L25ON(mc && mc.c), k = Object.values(L25K).flat(), n = k.filter(x => M[x] === '1').length;
  const st = !mc ? '<span class="tag">мод не на связи — зайди в игру</span>' : `<span class="tag ${fresh ? 'g' : ''}">мод ${esc(mc.v || '')} ${fresh ? 'на связи' : 'был на связи'}</span><span class="sub">включено ${n} из ${k.length}</span>`;
  const mods = (mc && mc.mods) || [], oth = (mc && mc.others) || [];
  const row = (m, s) => { const [key, t, lb, v, mn, mx] = s, onv = t === 't' ? v === 1 : true;
    return `<li><span>${esc(lb)}</span>${t === 't' ? `<button type="button" class="l25-tg${onv ? ' on' : ''}" data-um="${esc(m.id)}" data-k="${esc(key)}" data-v="${onv ? 0 : 1}">${onv ? 'ВКЛ' : 'ВЫКЛ'}</button>`
      : `<span class="l25-sl"><button type="button" data-um="${esc(m.id)}" data-k="${esc(key)}" data-v="${Math.max(mn, v - (s[6] || 1))}">−</button><b>${v}</b><button type="button" data-um="${esc(m.id)}" data-k="${esc(key)}" data-v="${Math.min(mx, v + (s[6] || 1))}">+</button></span>`}</li>`; };
  return `<div class="l25-mod"><div class="q-sec"><b>В игре</b>${st}</div>
    ${mods.length || oth.length ? `<div class="q-sec"><b>Моды рядом</b></div><div class="l25-ml">${mods.map(m => `<div class="q-box"><b>${esc(m.n)}</b><ul>${m.s.map(s => row(m, s)).join('')}</ul></div>`).join('')}
      ${oth.map(x => `<div class="q-box"><b>${esc(x)}</b><small>${x === 'Deadlock Utils' ? 'урна, разлом и мост — у него, Restless не дублирует' : 'стоит рядом'}</small></div>`).join('')}</div>` : ''}
    <p class="ovp-msg" id="l25msg" aria-live="polite"></p></div>`;
}
function l25ModPaint() { const el = $('#l25mod'); if (el) el.innerHTML = l25ModHTML(); }
{ const VO25 = viewOvs; viewOvs = function () { VO25.apply(this, arguments);
    const p = $('.ovs .ovp'); if (!p) return;
    p.insertAdjacentHTML('afterend', '<div id="l25mod"></div>'); l25ModPaint();
    $('#l25mod').onclick = e => { const b = e.target.closest('[data-um]'); if (!b) return;
      const id = b.dataset.um, k = b.dataset.k, v = +b.dataset.v, mc = OV.app && OV.app.modcfg;
      if (!/^[a-z0-9_]{1,32}$/.test(id) || !/^[a-z0-9_]{1,32}$/.test(k)) return;
      if (l25Send(['U.' + id + '.' + k + '=' + v]) && mc) { (mc.mods || []).forEach(m => { if (m.id === id) m.s.forEach(s => { if (s[0] === k) s[3] = v; }); }); l25ModPaint(); l25Note('Отправлено в игру'); } };
  }; }
{ const A25 = window.rlApp; window.rlApp = s => { A25(s); if ($('#l25mod')) l25ModPaint(); }; }

// ---------- свой «Лайв-матч» без живого матча — пусто, без прошлого матча ----------
{ const VL25 = viewLive; viewLive = async function (arg) {
    const own = ME && (!arg || +arg === ME.id);
    if (!own) return VL25.apply(this, arguments);
    if (RL_APP && gameLive() && OV.G && (OV.G.s === 'm' || OV.G.s === 'b')) return VL25.apply(this, arguments);
    const n = vNew(); clearInterval(LVT); clearInterval(OV.timer);
    V(`<div class="q-lvh"><h1 class="h1">Лайв-<em>матч</em></h1></div><div id="lvb"><div class="load">Ищу живой матч…</div></div><div id="lvl"></div>`);
    const act = await live(`matches/active?account_id=${ME.id}`).catch(() => []); if (n !== VQ) return;
    if (act && act.length) return VL25.apply(this, arguments);
    put(n, '#lvb', `<div class="empty l25-none"><b>Сейчас ты не в матче</b>${RL_APP ? '<span>Матч начнётся — здесь появятся все 12 игроков</span>' : ''}</div>`);
    liveList(n, 'Идут прямо сейчас');
    if (RL_APP) { const k = () => { if (n !== VQ) { clearInterval(iv); return; } if (gameLive() && OV.G && OV.G.s === 'm') { clearInterval(iv); viewLive(arg); } }, iv = setInterval(k, 3000); OV.kick = k; }
  }; }

// ---------- рекомендованный билд на своего героя ----------
const L25R = {};
async function l25Rec(n, hid, host, after) {
  if (!hid || !host) return;
  host.insertAdjacentHTML(after ? 'afterend' : 'beforeend', `<div id="l25rec"><div class="q-sec"><b>Рекомендованный билд · ${esc(hero(hid).n)}</b></div><div class="q-box l25-rec"><div class="load" style="padding:6px 0">…</div></div></div>`);
  try {
    let r = L25R[hid];
    if (!r) {
      const S = await api(`analytics/hero-build-stats/${hid}?min_unix_timestamp=${t30()}&min_matches=30`).catch(() => []);
      const top = S.slice().sort((a, b) => b.matches - a.matches).slice(0, 12).sort((a, b) => wil(b.wins, b.matches) - wil(a.wins, a.matches))[0];
      const b = top ? await api(`builds?build_id=${top.hero_build_id}&only_latest=true`).then(x => x && x[0]).catch(() => null) : null;
      r = L25R[hid] = b ? {id: top.hero_build_id, name: b.hero_build.name || 'Сборка #' + top.hero_build_id, m: top.matches, wr: 100 * top.wins / top.matches, cat: bldCat(b),
        ph: ((b.hero_build.details || {}).mod_categories || []).filter(c => (c.mods || []).some(y => item(y.ability_id))).slice(0, 3)} : {none: 1};
    }
    if (n !== VQ) return;
    const box = $('#l25rec .l25-rec'); if (!box) return;
    if (r.none) { $('#l25rec').remove(); return; }
    box.innerHTML = `<div class="l25-rh"><span class="tag q-ct c-${r.cat}">${CATI[r.cat]}</span><b>${esc(r.name)}</b><small>${nf(r.m)} игр · ${f1(r.wr)}% побед</small></div>
      ${r.ph.map((c, k) => `<div class="q-ph"><span>${esc(shelfName(c, k))}</span><div>${(c.mods || []).filter(y => item(y.ability_id)).slice(0, 7).map(y => phIco(y.ability_id)).join('')}</div></div>`).join('')}
      <div class="l25-rb"><button type="button" class="btn s" data-l25cp="${r.id}">ID ${r.id} · скопировать</button><span>Магазин → Сборки → поиск по ID</span></div>`;
    box.onclick = e => { const b = e.target.closest('[data-l25cp]'); if (!b) return; const v = b.dataset.l25cp;
      (navigator.clipboard ? navigator.clipboard.writeText(v) : Promise.reject()).then(() => { b.textContent = 'ID скопирован ✓'; }).catch(() => { b.textContent = v; }); };
  } catch (e) { const el = $('#l25rec'); if (el) el.remove(); }
}
{ const HP25 = heroPhaseBuild; heroPhaseBuild = async function (n, hid) {
    const el = $('#lvbld'); if (el && !$('#l25rec')) l25Rec(n, hid, el.previousElementSibling || el, false).catch(() => {});
    return HP25.apply(this, arguments); }; }
// игроки из игры (программа): свой герой — по ID или нику
{ const OD25 = ovDraw; ovDraw = function () { OD25.apply(this, arguments);
    const L = OV.L || [], me = ME && L.find(p => p.id === ME.id), b = $('#ovb');
    if (me && me.hid && b && !$('#l25rec', b)) l25Rec(VQ, me.hid, b, false).catch(() => {}); }; }
