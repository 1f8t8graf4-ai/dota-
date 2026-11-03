// ==================== 03.11 · Restless: патчи иконками, лайв компактно, сборки с рекомендацией, профиль, лидеры, про, логотип ====================
// Андрей: «никогда не давай кучу инфы текстом — всегда разграничивай». Здесь каждая мысль — своя строка или плитка.

// ---------- патчи: кто усилен, кто ослаблен — иконками; нажал на героя — что поменяли ----------
const U10 = {P: null, tab: 'p', X: null, wr: {}, my: null, idx: 0};
const u10Txt = x => upTr(x.s) || x.s;
const u10Kind = L => { const u = L.filter(x => x.k === 'u').length, d = L.filter(x => x.k === 'd').length; return u > d ? 'u' : d > u ? 'd' : 'a'; };
const U10K = {u: ['Усилены', '▲'], d: ['Ослаблены', '▼'], a: ['Изменены', '≈']};
function u10Group(X) {
  const H = {}, I = {}, G = [];
  X.out.filter(x => x.t === 'l').forEach(x => { if (x.h) (H[x.h] = H[x.h] || []).push(x); else if (x.i) (I[x.i] = I[x.i] || []).push(x); else G.push(x); });
  return {H, I, G};
}
// одна строка изменения: иконка умения (если узнали), что поменяли, оригинал мелко
function u10Rows(L, hid) {
  const h = hid ? hero(hid) : null, AB = (h && h.ab) || [];
  const rows = L.map(x => {
    let t = u10Txt(x), o = t !== x.s ? x.s : '';
    if (h) { const nm = (x.hn || h.n).replace(/[.*+?^${}()|[\]\\&]/g, '\\$&'); t = t.replace(new RegExp('^' + nm + '\\s*:?\\s*', 'i'), ''); o = o.replace(new RegExp('^' + nm + '\\s*:?\\s*', 'i'), ''); }
    const lt = t.toLowerCase(), ab = AB.slice().sort((a, b) => b.n.length - a.n.length).find(a => lt.startsWith(a.n.toLowerCase()));
    let name = '', body = t;
    if (ab) { name = ab.n; body = t.slice(ab.n.length).replace(/^\s*[—:-]\s*/, ''); }
    else { const m = t.match(/^(.{2,40}?)\s+—\s+(.+)$/); if (m) { name = m[1]; body = m[2]; } }
    return {k: x.k || '', name, body: body.charAt(0).toUpperCase() + body.slice(1), o, ab};
  });
  const out = []; rows.forEach(r => { const last = out[out.length - 1]; if (last && r.name && last.name === r.name) last.L.push(r); else out.push({name: r.name, ab: r.ab, L: [r]}); });
  return out.map(g => `<div class="u10-g">${g.name ? `<div class="u10-gh">${g.ab && g.ab.i ? `<img src="${esc(g.ab.i)}" alt="" loading="lazy">` : '<i></i>'}<b>${esc(g.name)}</b></div>` : ''}
    ${g.L.map(r => `<div class="u10-r ${r.k}"><span class="u10-ri">${r.k === 'u' ? '▲' : r.k === 'd' ? '▼' : r.k === 'f' ? '✓' : '•'}</span><div><p>${esc(r.body)}</p>${r.o ? `<small>${esc(r.o)}</small>` : ''}</div></div>`).join('')}</div>`).join('');
}
function u10Tile(id, L, isItem, j) {
  const k = u10Kind(L), u = L.filter(x => x.k === 'u').length, d = L.filter(x => x.k === 'd').length, mine = U10.my && (isItem ? U10.my.items.has(+id) : U10.my.heroes.has(+id));
  const w = !isItem && U10.wr[id] != null ? U10.wr[id] : null;
  const pic = isItem ? `<span class="u10-ti"><img src="${esc(item(id).i)}" alt="" loading="lazy" onerror="${noimg}"></span>` : `<span class="u10-tf"><img src="${esc(faceUrl(+id, k === 'u' ? 'g' : k === 'd' ? 'c' : ''))}" alt="" loading="lazy" style="object-position:${FACEP[id] || '50% 12%'}" onerror="this.onerror=null;this.src='${esc(hero(id).i)}'"></span>`;
  return `<button type="button" class="u10-t ${k}${isItem ? ' it' : ''}${mine ? ' mine' : ''}" data-u${isItem ? 'i' : 'h'}="${id}" style="--i:${j || 0}" title="${esc(isItem ? item(id).n : hero(id).n)} — что поменяли">${pic}
    <b>${esc(isItem ? item(id).n : hero(id).n)}</b><em>${u ? `<span class="up">▲${u}</span>` : ''}${d ? `<span class="dn">▼${d}</span>` : ''}${!u && !d ? `<span>${L.length}</span>` : ''}</em>${w != null ? `<i class="u10-wr ${w >= 0 ? 'up' : 'dn'}" title="винрейт до и после патча">${w >= 0 ? '+' : '−'}${f1(Math.abs(w))}%</i>` : ''}${mine ? '<s>твой</s>' : ''}</button>`;
}
function u10Sec(map, isItem) {
  const B = {u: [], d: [], a: []};
  Object.entries(map).forEach(([id, L]) => B[u10Kind(L)].push([id, L]));
  const mine = id => U10.my && (isItem ? U10.my.items.has(+id) : U10.my.heroes.has(+id));
  return ['u', 'd', 'a'].filter(k => B[k].length).map(k => `<section class="u10-sec ${k}"><div class="u10-sh"><span class="u10-sk">${U10K[k][1]}</span><b>${U10K[k][0]}</b><small>${B[k].length}</small></div>
    <div class="u10-grid${isItem ? ' it' : ''}">${B[k].sort((a, b) => (mine(b[0]) - mine(a[0])) || b[1].length - a[1].length).map(([id, L], j) => u10Tile(id, L, isItem, j)).join('')}</div></section>`).join('');
}
function u10Open(id, isItem) {
  const X = U10.X, G = u10Group(X), L = (isItem ? G.I : G.H)[id]; if (!L) return;
  const k = u10Kind(L), u = L.filter(x => x.k === 'u').length, d = L.filter(x => x.k === 'd').length, w = !isItem ? U10.wr[id] : null;
  const head = isItem ? `<span class="u10-mi"><img src="${esc(item(id).i)}" alt=""></span><div><small>Предмет${item(id).p ? ' · ' + nf(item(id).p) + ' душ' : ''}</small><b>${esc(item(id).n)}</b></div>`
    : `${face(+id, k === 'u' ? 'g' : k === 'd' ? 'c' : '', 'xl')}<div><small>${esc(TYPE_RU[hero(id).ty] || 'Герой')}</small><b>${esc(hero(id).n)}</b></div>`;
  const ov = document.createElement('div'); ov.className = 'u10-ov';
  ov.innerHTML = `<div class="u10-md ${k}" role="dialog" aria-label="Что поменяли">${!isItem ? `<i class="u10-bg" style="background-image:url('art/${id}.webp')"></i>` : ''}
    <header class="u10-mh">${head}<button type="button" class="u10-x" aria-label="Закрыть">✕</button></header>
    <div class="u10-ms"><span class="u10-tag ${k}">${U10K[k][1]} ${U10K[k][0].replace(/ы$/, '')}</span>${u ? `<span class="up">▲ ${u} ${pl(u, ['усиление', 'усиления', 'усилений'])}</span>` : ''}${d ? `<span class="dn">▼ ${d} ${pl(d, ['ослабление', 'ослабления', 'ослаблений'])}</span>` : ''}${w != null ? `<span class="${w >= 0 ? 'up' : 'dn'}">винрейт ${w >= 0 ? '+' : '−'}${f1(Math.abs(w))}% после патча</span>` : ''}</div>
    <div class="u10-ml">${u10Rows(L, isItem ? 0 : +id)}</div>
    ${!isItem ? `<a class="u10-go" href="#h/${id}">Страница героя и сборки ›</a>` : ''}</div>`;
  document.body.appendChild(ov);
  requestAnimationFrame(() => ov.classList.add('on'));
  const close = () => { ov.classList.remove('on'); setTimeout(() => ov.remove(), 220); removeEventListener('keydown', esc1); removeEventListener('hashchange', close); };
  const esc1 = e => { if (e.key === 'Escape') close(); };
  ov.onclick = e => { if (e.target === ov || e.target.closest('.u10-x') || e.target.closest('.u10-go')) close(); };
  addEventListener('keydown', esc1); addEventListener('hashchange', close);
}
// вид записи: Большое обновление / Обновление / Мелкое / Хотфикс; null — не патч (новость, итоги события)
const PK = {};
function pKind(p) {
  const key = p.pub_date + '|' + p.title; if (key in PK) return PK[key];
  const X = parsePatch(p), G = u10Group(X), nh = Object.keys(G.H).length, ni = Object.keys(G.I).length, t = String(p.title || '');
  let k = null;
  if (!nh && !ni && (X.nL < 4 || !/update|patch|hotfix|обновлен/i.test(t))) k = null;
  else if (/hotfix/i.test(t)) k = ['hot', 'Хотфикс'];
  else if (/minor/i.test(t) || (nh + ni <= 3 && X.nL <= 10)) k = nh + ni <= 3 && X.nL <= 6 ? ['hot', 'Хотфикс'] : ['min', 'Мелкое обновление'];
  else if (nh >= 18 || X.nL >= 120 || /gameplay update/i.test(t)) k = ['big', 'Большое обновление'];
  else k = ['upd', 'Обновление'];
  return (PK[key] = k);
}
async function u10View(sel) {
  const n = vNew(); U10.wr = {};
  V(`<div class="u10"><div class="u10-hd"><h1 class="h1">Пат<em>чи</em></h1><div class="seg" id="utab"><button data-t="p" class="${U10.tab === 'p' ? 'on' : ''}">Патчи</button><button data-t="n" class="${U10.tab === 'n' ? 'on' : ''}">Новости</button></div></div><div id="upw"><div class="load">Загружаю патчноуты…</div></div></div>`);
  let P;
  try { P = U10.P || await apiU(API2 + 'patches'); } catch (e) { put(n, '#upw', `<div class="err">Не вышло: ${esc(e.message)}</div>`); return; }
  if (n !== VQ) return;
  P = U10.P = (P || []).slice().sort((a, b) => Date.parse(b.pub_date) - Date.parse(a.pub_date)).slice(0, 30);
  const idx = P.map((p, i) => i), isP = i => !!pKind(P[i]);
  if (sel != null && sel !== '' && P[+sel]) U10.tab = isP(+sel) ? 'p' : 'n';
  const list = idx.filter(i => U10.tab === 'p' ? isP(i) : !isP(i)).slice(0, 12);
  if (!list.length) { put(n, '#upw', '<div class="empty">Пусто.</div>'); return; }
  let i = sel != null && sel !== '' && list.includes(+sel) ? +sel : list[0];
  const p = P[i], X = U10.X = parsePatch(p), t = Math.floor(Date.parse(p.pub_date) / 1000);
  const chips = `<div class="u10-pk">${list.map(k => `<a class="${k === i ? 'on' : ''}" href="#upd/${k}"><small>${esc(dmy(Math.floor(Date.parse(P[k].pub_date) / 1000)))}${pKind(P[k]) ? ` · <i class="pk-${pKind(P[k])[0]}">${pKind(P[k])[1]}</i>` : ''}</small><b>${esc(upTr(P[k].title) || P[k].title || 'Без названия')}</b></a>`).join('')}</div>`;
  const ttl = upTr(p.title) || p.title || 'Обновление';
  if (!pKind(p)) {
    const paras = X.out.map(x => x.t === 'h' ? `<h3>${esc(upTr(x.s) || x.s)}</h3>` : `<p>${esc(upTr(x.s) || x.s)}</p>`).join('');
    put(n, '#upw', `${chips}<article class="q-box u10-art"><header><small>${esc(dmy(t))}</small><h2>${esc(ttl)}</h2></header>${X.imgs[0] ? `<img src="${esc(X.imgs[0])}" alt="" loading="lazy">` : ''}<div class="u10-tx">${paras}</div></article>`);
    $('#utab').onclick = u10Tab; return;
  }
  const G = u10Group(X), nh = Object.keys(G.H).length, ni = Object.keys(G.I).length;
  const cnt = M => { const o = {u: 0, d: 0, a: 0}; Object.values(M).forEach(L => o[u10Kind(L)]++); return o; }, CH = cnt(G.H);
  const draw = () => {
    put(n, '#upw', `${chips}<div class="u10-ph"><div><small>${pKind(p) ? `<i class="u11-pk pk-${pKind(p)[0]}">${pKind(p)[1]}</i>` : ''}${esc(dmy(t))} · ${p.source === 'forum' ? 'форум разработчиков' : 'новости Steam'}</small><h2>${esc(ttl)}</h2></div>
      <div class="u10-sum"><span class="up"><b>${CH.u}</b>усилены</span><span class="dn"><b>${CH.d}</b>ослаблены</span><span class="a"><b>${CH.a}</b>изменены</span>${ni ? `<span><b>${ni}</b>предметов</span>` : ''}</div>
      <div class="u10-lg" id="uplang"><button data-l="ru" class="${upLang() === 'ru' ? 'on' : ''}">RU</button><button data-l="en" class="${upLang() === 'en' ? 'on' : ''}">EN</button></div></div>
      ${nh ? `<div class="u10-blk"><div class="u10-bh">Герои<small>нажми на героя — что именно поменяли</small></div>${u10Sec(G.H, false)}</div>` : ''}
      ${ni ? `<div class="u10-blk"><div class="u10-bh">Предметы</div>${u10Sec(G.I, true)}</div>` : ''}
      ${G.G.length ? `<details class="q-box u10-gen"><summary>Общие изменения<small>${G.G.length}</small></summary><div class="u10-ml">${u10Rows(G.G, 0)}</div></details>` : ''}`);
    $('#utab').onclick = u10Tab;
  };
  draw();
  $('#upw').onclick = e => {
    const h = e.target.closest('[data-uh]'); if (h) { u10Open(h.dataset.uh, false); return; }
    const it = e.target.closest('[data-ui]'); if (it) { u10Open(it.dataset.ui, true); return; }
    const lg = e.target.closest('#uplang [data-l]'); if (lg) { try { localStorage.setItem('rl-plang', lg.dataset.l); } catch (er) {} upLoad().then(draw); }
  };
  if (ME) myStuff().then(M => { if (n !== VQ || !M) return; U10.my = M; draw(); }).catch(() => {});
  if (nh && now() - t > 12 * 3600) {
    const h0 = t - (t % 3600), hb = h0 - 7 * 86400, ha = Math.min(now() - (now() % 3600), h0 + 7 * 86400);
    Promise.all([api(`analytics/hero-stats?min_unix_timestamp=${hb}&max_unix_timestamp=${h0}`), api(`analytics/hero-stats?min_unix_timestamp=${h0}&max_unix_timestamp=${ha}`)]).then(([B, A]) => {
      if (n !== VQ) return; const bb = {}, aa = {}; B.forEach(x => bb[x.hero_id] = x); A.forEach(x => aa[x.hero_id] = x); U10.wr = {};
      Object.keys(G.H).forEach(h => { const b = bb[h], a = aa[h]; if (b && a && b.matches > 200 && a.matches > 200) U10.wr[h] = 100 * (a.wins / a.matches - b.wins / b.matches); });
      draw();
    }).catch(() => {});
  }
}
function u10Tab(e) { const b = e.target.closest('[data-t]'); if (!b) return; U10.tab = b.dataset.t; const P = U10.P || []; const k = P.findIndex(p => (U10.tab === 'p') === !!pKind(p)); location.hash = '#upd/' + Math.max(0, k); }
viewUpd = async function (sel) { await upLoad(); return u10View(sel); };

// ---------- лайв-матч: карточки компактнее, больше меток; игры за 12 ч / 30 дней и его сборка — по наведению ----------
function pCard(p, en, thr, meId) {
  const wr = pc(p.hw, p.hm), per = (k, nm, o) => { const w = o && o.m ? Math.round(100 * o.w / o.m) : null;
    return `<button class="l10-pr${w == null ? ' off' : ''}" type="button" data-per="${k}" data-acc="${p.id}"${w == null ? ' disabled' : ''}><small>${nm}</small><b class="${w == null ? '' : w >= 50 ? 'win' : 'loss'}">${w == null ? '—' : w + '%'}</b><i>${o && o.m ? games(o.m) : 'не играл'}</i></button>`; };
  const tags = [thr ? ['h', 'Главная угроза', 'самый опасный по рангу и игре на герое'] : null, p.cn ? ['r', `Контрит тебя · ${p.cn}%`, 'твой герой против него побеждает реже'] : null, ...p.tags].filter(Boolean);
  return `<div class="q-pc l10${p.id === meId ? ' mine' : ''}${thr ? ' thr' : ''}">
    <div class="top"><img class="f u11-pf" src="${esc(hero(p.hid).v || hero(p.hid).c || hero(p.hid).i)}" alt="" loading="lazy" onerror="this.onerror=null;this.src='${esc(hero(p.hid).i)}'"><span class="hn">${esc(hero(p.hid).n)}${p.id && p.hm ? `<small class="l13-hr" data-hr="${p.hid}|${p.id}" data-nm="${esc(p.name || '')}" title="Место в мире среди всех игроков на ${esc(hero(p.hid).n)} — по числу побед на нём">место на герое…</small>` : ''}</span>${p.party ? `<i class="pty" style="background:${p.party.c}" title="друзья в Steam в одной команде — возможно, пати"></i>` : ''}
      <span class="l10-rk" data-aid="${p.id || ''}" title="${esc(rankOf(p.badge).name)}">${p.badge ? rankImg(p.badge, 'rk') : ''}</span></div>
    <div class="q-pb">${p.id ? `<a class="q-pc-n" href="?id=${p.id}#home"><span class="q-pnm">${esc(p.name)}</span></a>` : `<span class="q-pnm">${esc(p.name)}</span>`}<span class="l10-rn">${esc(rankOf(p.badge).name)}</span>
      <div class="l10-st"><span><small>на герое</small><b>${p.hm ? nf(p.hm) : '0'}${p.hm ? ` · <em class="${wrC(wr, p.hm)}">${wr}%</em>` : ''}</b></span><span><small>всего</small><b>${p.tm ? `${nf(p.tm)} · ${pc(p.tw, p.tm)}%` : '—'}</b></span></div>
      <div class="l10-per">${per('12', '12 ч', p.p12)}${per('30', '30 дн', p.p30)}</div>
      ${p.rc && p.rc.length ? `<div class="l10-rc">${p.rc.slice(0, 6).map(r => `<a href="#m/${r.mid}" class="${r.w ? 'w' : 'l'}" title="${esc(hero(r.hid).n)} · ${r.w ? 'победа' : 'поражение'} · ${r.kda}"><img src="${esc(hero(r.hid).i)}" alt="" loading="lazy" onerror="${noimg}"></a>`).join('')}</div>` : ''}
      <div class="q-pbld" id="pb-${p.id}"></div>
      <div class="tg">${tags.slice(0, 8).map(t => `<span class="tag ${t[0]}" title="${esc(t[2])}">${esc(t[1])}</span>`).join('')}</div></div></div>`;
}
// наведение мышью открывает ту же всплывашку, что и нажатие (на телефоне — нажатие)
{
  const HOV = matchMedia('(hover:hover) and (pointer:fine)');
  let tmr = 0, cur = null;
  document.addEventListener('mouseover', e => {
    if (!HOV.matches) return;
    const a = e.target.closest('#lvb [data-per]:not([disabled]), #lvb [data-pb]');
    if (a) { clearTimeout(tmr); if (a === cur && $('.q-pop')) return; tmr = setTimeout(() => {
      cur = a;
      if (a.dataset.per) { const p = LVL.find(x => String(x.id) === a.dataset.acc); if (p) qPop(a, perHTML(p, a.dataset.per)); }
      else { qPop(a, pbHTML(a.dataset.pb)); pbNamed(a.dataset.pb); }
      const d = $('.q-pop'); if (d) d.classList.add('hov');
    }, 140); return; }
    if (e.target.closest('.q-pop')) { clearTimeout(tmr); return; }
    if (cur && $('.q-pop.hov')) { clearTimeout(tmr); tmr = setTimeout(() => { if ($('.q-pop.hov')) qPopClose(); cur = null; }, 260); }
  });
}

// ---------- сборки героя: одна рекомендуемая сверху, доля ветки (ган/спирит/микс), 6 сборок и «показать ещё» ----------
let HBM = 6;
function drawBuilds2(hid) {
  const el = $('#hbl'), X = HB2[hid]; if (!el || !X) return;
  const {L, RL, me} = X, withSt = L.filter(x => x.m >= 10 || x.pm >= 10), tot = withSt.reduce((a, x) => a + x.m, 0) || 1;
  const cats = ['gun', 'spirit', 'mix'].map(c => { const CL = withSt.filter(x => x.cat === c); return {c, L: CL, m: CL.reduce((a, x) => a + x.m, 0)}; }).filter(x => x.L.length);
  let html = '';
  if (me) {
    const cur = L.filter(x => x.sr).sort((a, b) => b.sr.matches - a.sr.matches)[0] || L.filter(x => x.sm).sort((a, b) => b.sm.matches - a.sm.matches)[0];
    const made = L.filter(x => x.made && x !== cur);
    if (cur || made.length) html += `<div class="b10-h">Твои сборки</div><div class="q-bcs b10-g">${cur ? bCard(cur, cur.sr ? 'cur' : 'me') : ''}${made.slice(0, 3).map(x => bCard(x, 'made')).join('')}</div>`;
  }
  if (!cats.length) {
    html += `<div class="empty">Сборок с нормальной выборкой за 30 дней нет.</div>${RL ? `<div class="q-bcs b10-g">${rlCard(hid, RL, '')}</div>` : ''}`;
    el.innerHTML = html; bindB(hid); return;
  }
  if (!HBC || !cats.some(x => x.c === HBC)) HBC = cats.slice().sort((a, b) => b.m - a.m)[0].c;
  const cur = cats.find(x => x.c === HBC), share = c => Math.round(100 * c.m / tot);
  const SRT = {pop: (a, b) => b.m - a.m || b.pm - a.pm, wr: (a, b) => (b.wl || b.pwl) - (a.wl || a.pwl), pro: (a, b) => b.pm - a.pm || b.pwl - a.pwl};
  const pool = cur.L.filter(x => x.m >= Math.max(40, .04 * cur.m)), rec = (pool.length ? pool : cur.L).slice().sort((a, b) => (b.wl || b.pwl) - (a.wl || a.pwl))[0];
  const CL = cur.L.filter(x => x !== rec && (HBS !== 'pro' || x.pm >= 10)).sort(SRT[HBS] || SRT.pop), shown = CL.slice(0, HBM);
  const rst = rec.st || rec.sp, rwr = rst ? 100 * rst.wins / rst.matches : 0;
  html += `<div class="b10-cats">${cats.map(c => { const s = share(c), b0 = c.L.slice().sort((a, b) => (b.wl || b.pwl) - (a.wl || a.pwl))[0];
      return `<button type="button" class="b10-cat c-${c.c}${HBC === c.c ? ' on' : ''}" data-c="${c.c}"><span class="b10-cn"><b>${CATI[c.c]}</b><em>${s}%</em></span><i class="b10-bar"><i style="width:${Math.max(3, s)}%"></i></i>
        ${(() => { const cw = c.L.reduce((o, x) => { const st = x.st || x.sp; if (st && st.matches) { o.w += st.wins; o.m += st.matches; } return o; }, {w: 0, m: 0}), wr = cw.m ? 100 * cw.w / cw.m : null;
          return `<span class="b10-cs"><span><small>пикрейт</small><b>${s}%</b></span><span><small>винрейт</small><b class="${wr == null ? '' : wr >= 52 ? 'win' : wr <= 48 ? 'loss' : ''}">${wr == null ? '—' : f1(wr) + '%'}</b></span><span><small>сборок</small><b>${c.L.length}</b></span></span>`; })()}
        ${s < 10 ? '<small>редкая ветка — мало кто так играет</small>' : ''}<span class="ic">${b0.items.slice(0, 6).map(id => `<img src="${esc(item(id).i)}" alt="" loading="lazy" onerror="${noimg}">`).join('')}</span></button>`; }).join('')}</div>
    ${share(cur) < 10 ? `<div class="b10-warn"><b>${CATI[HBC]} собирают только ${share(cur)}% игроков</b><span>Сборок мало, винрейт может врать — смотри с осторожностью.</span></div>` : ''}
    <div class="b10-rec c-${HBC}"><div class="b10-rl"><span>★ Рекомендуем</span><small>${rst ? `лучший винрейт среди популярных: <b>${f1(rwr)}%</b> на ${nf(rst.matches)} ${pl(rst.matches, ['игре', 'играх', 'играх'])}` : 'лучшая по винрейту'}</small></div>${bCard(rec, '')}</div>
    ${RL ? `<div class="b10-rs"><div class="b10-rl"><span>◆ Restless-сборка</span><small>собрал сайт сам: в каждой фазе — предметы с лучшим винрейтом на этом герое</small></div><div class="q-bcs b10-g">${rlCard(hid, RL, '')}</div></div>` : ''}
    <div class="b10-tb"><div class="b10-h">Другие ${CATI[HBC].toLowerCase()}-сборки<small>${CL.length}</small></div><div class="seg" id="hbs">${[['pop', 'Популярные'], ['wr', 'Винрейт'], ['pro', 'У прошников']].map(([k, nm]) => `<button data-s="${k}" class="${HBS === k ? 'on' : ''}">${nm}</button>`).join('')}</div></div>
    <div class="q-bcs b10-g">${shown.map(x => bCard(x, HBS === 'pro' ? 'pro' : '')).join('') || '<div class="empty">Других нет.</div>'}</div>
    ${CL.length > HBM ? `<button type="button" class="btn g q-more b10-more" data-bmore="1">Показать ещё ${Math.min(6, CL.length - HBM)} из ${CL.length - HBM}</button>` : ''}`;
  el.innerHTML = html; bindB(hid);
  if (!el._b10) { el._b10 = 1; el.addEventListener('click', e => { if (e.target.closest('[data-bmore]')) { HBM += 6; drawBuilds2(hid); } else if (e.target.closest('[data-c]')) HBM = 6; }, true); }
}
{ const VH10 = viewHero; viewHero = async function (hid, mode) { HBM = 6; return VH10(hid, mode); }; }

// ---------- профиль: напарник по пати — тоже метка «что знать» ----------
{
  const QM10 = qkMates;
  qkMates = async function (n, id) {
    await QM10(n, id);
    const M = await api(`players/${id}/mate-stats?min_matches_played=3`).catch(() => []); if (n !== VQ) return;
    const top = (M || []).filter(x => x.matches_played >= 40).sort((a, b) => b.matches_played - a.matches_played)[0], box = $('#p10kn');
    return; // пати-метку убрали (04.11): Андрей — «эта инфа тут не нужна»
    const nm = (SN[top.mate_id] || {}).n || 'другом', wr = Math.round(100 * top.wins / Math.max(1, top.matches_played));
    box.insertAdjacentHTML('beforeend', `<a class="p10-t b pty" href="?id=${top.mate_id}#home" style="--i:8"><b>Играет в пати · ${esc(nm)}</b><small>${nf(top.matches_played)} ${pl(top.matches_played, ['игра', 'игры', 'игр'])} вместе · ${wr}% побед</small></a>`);
  };
}

// ---------- про-игры: кто из топов играет сейчас, топ-матчи мира, последние матчи топов ----------
const PR10 = {h: 0, MM: [], PRO: {}};
async function viewPro() {
  const n = vNew();
  V(`<div class="pr10"><div class="u10-hd"><h1 class="h1">Про-<em>игры</em></h1></div>
    <div class="p10-h">Топ Европы<small>кто сейчас в игре</small><a href="#lb">весь топ ›</a></div><div class="pr10-top" id="prt"><div class="load">Загружаю топ…</div></div>
    <div class="p10-h">Идут прямо сейчас<small>самые высокие матчи мира</small></div><div class="pr10-live" id="prl"><div class="load">Смотрю, кто играет…</div></div>
    <div class="p10-h">Последние матчи топов<span id="prf" style="margin-left:auto"></span></div><div id="prm"><div class="load">Тяну матчи топов…</div></div></div>`);
  let L, A;
  try { [L, A] = await Promise.all([api('leaderboard/Europe'), live('matches/active').catch(() => [])]); } catch (e) { put(n, '#prt', `<div class="err">${esc(e.message)}</div>`); return; }
  if (n !== VQ) return;
  const E = (L.entries || []), PRO = {}; E.slice(0, 200).forEach((e, k) => { if ((e.possible_account_ids || []).length === 1) PRO[e.possible_account_ids[0]] = {k: k + 1, nm: e.account_name}; });
  const inGame = {}; (A || []).forEach(m => (m.players || []).forEach(p => { if (PRO[p.account_id]) inGame[p.account_id] = {m, hid: p.hero_id}; }));
  put(n, '#prt', E.slice(0, 12).map((e, i) => { const one = (e.possible_account_ids || []).length === 1 ? e.possible_account_ids[0] : null, g = one && inGame[one], h = g ? g.hid : (e.top_hero_ids || [])[0];
    return `<a class="pr10-p${g ? ' on' : ''}${one ? '' : ' x'}" ${one ? `href="${g ? `#live/m${g.m.match_id}` : `?id=${one}#home`}"` : ''} style="--i:${i}">${h ? face(h, '', 'm') : '<span class="q-fc m"></span>'}<span><b>#${i + 1} ${esc(e.account_name || 'Скрытый')}</b><small>${g ? `<i></i>в игре · ${esc(hero(g.hid).n)}` : one ? 'не в игре' : 'аккаунт скрыт'}</small></span></a>`; }).join(''));
  const top = (A || []).filter(m => (m.players || []).length >= 12 && /citadel|normal/i.test(m.game_mode_parsed || '') && !/street/i.test(m.game_mode_parsed || '')).sort((a, b) => (b.match_score || 0) - (a.match_score || 0)).slice(0, 6);
  put(n, '#prl', top.length ? top.map((m, i) => { const P = m.players, pros = P.filter(p => PRO[p.account_id]);
    const tm = k => `<span class="pr10-tm t${k}">${P.filter(p => teamOf(p.team) === k).map(p => `<img src="${esc(hero(p.hero_id).i)}" alt="" title="${esc(hero(p.hero_id).n)}" loading="lazy" onerror="${noimg}"${PRO[p.account_id] ? ' class="pro"' : ''}>`).join('')}</span>`;
    return `<a class="pr10-lv" href="#live/m${m.match_id}" style="--i:${i}"><div class="pr10-lh"><span class="live">LIVE</span><b>${mmss(now() - m.start_time)}</b><small>${m.match_mode_parsed === 'Ranked' ? 'ранговый' : 'обычный'} · зрителей ${m.spectators || 0}</small></div>
      ${tm(0)}<i class="pr10-vs">VS</i>${tm(1)}<div class="pr10-pp">${pros.slice(0, 3).map(p => `<span>#${PRO[p.account_id].k} ${esc(PRO[p.account_id].nm || '')}</span>`).join('') || '<small>топов из Европы нет</small>'}</div></a>`; }).join('') : '<div class="empty">Сейчас топ-матчей нет.</div>');
  const six = E.filter(e => (e.possible_account_ids || []).length === 1).slice(0, 8);
  const HS2 = await Promise.all(six.map(e => api('players/' + e.possible_account_ids[0] + '/match-history').catch(() => []))); if (n !== VQ) return;
  const rows = []; HS2.forEach(H => (H || []).slice(0, 4).forEach(m => rows.push(m)));
  rows.sort((a, b) => b.start_time - a.start_time);
  const seen = new Set(), U = rows.filter(m => !seen.has(m.match_id) && seen.add(m.match_id)).slice(0, 14);
  await metaLite(U.map(m => m.match_id)); if (n !== VQ) return;
  PR10.MM = U.map(m => ML.get(m.match_id)).filter(Boolean); PR10.PRO = PRO;
  await steamNames(PR10.MM.flatMap(m => m.players.map(p => p.account_id))); if (n !== VQ) return;
  pr10Draw(n);
}
function pr10Draw(n) {
  const X = PR10, hs = [...new Set(X.MM.flatMap(m => m.players.filter(p => X.PRO[p.account_id]).map(p => p.hero_id)))].filter(h => D.heroes[h]).sort((a, b) => hero(a).n.localeCompare(hero(b).n));
  put(n, '#prf', `<select class="q-sel" id="prh" aria-label="Герой"><option value="0">Все герои</option>${hs.map(h => `<option value="${h}"${X.h === h ? ' selected' : ''}>${esc(hero(h).n)}</option>`).join('')}</select>`);
  const L = X.MM.filter(m => !X.h || m.players.some(p => X.PRO[p.account_id] && p.hero_id === X.h));
  put(n, '#prm', `<div class="q-box pr10-ml">${L.map((m, i) => { const pros = m.players.filter(p => X.PRO[p.account_id]).sort((a, b) => X.PRO[a.account_id].k - X.PRO[b.account_id].k), w = teamOf(m.winning_team);
    const tm = k => `<span class="pr10-tm t${k}${w === k ? ' w' : ''}">${m.players.filter(p => teamOf(p.team) === k).map(p => `<img src="${esc(hero(p.hero_id).i)}" alt="" title="${esc((SN[p.account_id] || {}).n || 'Игрок')} · ${esc(hero(p.hero_id).n)}" loading="lazy" onerror="${noimg}"${X.PRO[p.account_id] ? ' class="pro"' : ''}>`).join('')}</span>`;
    return `<a class="pr10-m" href="#m/${m.match_id}" style="--i:${i}"><span class="pr10-who">${pros.slice(0, 2).map(p => { const won = teamOf(p.team) === w; return `<span class="pr10-pw">${face(p.hero_id, won ? 'g' : 'c', 's')}<span><b>#${X.PRO[p.account_id].k} ${esc(X.PRO[p.account_id].nm || '')}</b><small class="${won ? 'win' : 'loss'}">${won ? 'победа' : 'поражение'} · ${p.kills || 0}/${p.deaths || 0}/${p.assists || 0}</small></span></span>`; }).join('')}</span>
      ${tm(0)}${tm(1)}<span class="pr10-mt"><b>${mmss(m.duration_s || 0)}</b><small>${esc(ago(tsOf(m.start_time)))}</small></span><span class="r9-go">›</span></a>`; }).join('') || '<div class="empty">Матчей нет.</div>'}</div>`);
  const sel = $('#prh'); if (sel) sel.onchange = e => { X.h = +e.target.value; pr10Draw(n); };
}

// ---------- лидеры: подиум, строки-карточки, скрытые аккаунты — тише ----------
async function viewLb2() {
  const n = vNew();
  const opts = Object.entries(D.heroes).map(([id, h]) => [+id, h.n]).sort((a, b) => a[1].localeCompare(b[1]));
  V(`<div class="lb10"><div class="u10-hd"><h1 class="h1">Лиде<em>ры</em></h1><div class="seg" id="lbrg">${Object.entries(REGN).map(([k, v]) => `<button data-r="${k}" class="${LB2.rg === k ? 'on' : ''}">${v}</button>`).join('')}</div></div>
    <div class="lb10-f"><select class="q-sel" id="lbh" aria-label="Герой"><option value="0">Все герои</option>${opts.map(([id, nm]) => `<option value="${id}"${LB2.h === id ? ' selected' : ''}>${esc(nm)}</option>`).join('')}</select>
      <input id="lbf2" class="inp q-lbq" placeholder="Найти по нику…" aria-label="Найти по нику" value="${esc(LB2.q)}">${ME ? '<button class="btn s" id="lbme2" type="button">Где я?</button>' : ''}</div>
    <div id="lbb"><div class="load">Загружаю…</div></div></div>`);
  if (LB2.n > 50 && !LB2.keep) LB2.n = 50;
  const draw = async () => {
    put(n, '#lbb', '<div class="load">Загружаю…</div>');
    try {
      const E = ((await api('leaderboard/' + LB2.rg + (LB2.h ? '/' + LB2.h : ''))).entries || []).map((e, i) => ({e, i, one: (e.possible_account_ids || []).length === 1 ? e.possible_account_ids[0] : null})); if (n !== VQ) return;
      const myI = ME ? E.findIndex(x => lbHit(x.e, ME.id, ME.name)) : -1, q = LB2.q.toLowerCase(), F2 = E.filter(x => !q || String(x.e.account_name || '').toLowerCase().includes(q));
      const medal = ['#ffcf4a', '#c9d3df', '#e09b5e'];
      const pod = !q && E.length >= 3 ? `<div class="lb10-pod">${[1, 0, 2].map(k => { const x = E[k], h = (x.e.top_hero_ids || [])[0] || LB2.h;
        return `<${x.one ? `a href="?id=${x.one}#home"` : 'div'} class="lb10-pd p${k + 1}" style="--md:${medal[k]};--i:${k}">${h ? `<i class="bg" style="background-image:url('art/${h}.webp')"></i>` : `<i class="bg none">${rankImg(116, 'lbx')}</i>`}<span class="pl">${k + 1}</span>
          <span class="lb10-pi"><b>${esc(x.e.account_name || 'Скрытый игрок')}</b><span class="rkc" data-acc="${x.one || ''}">${x.one ? '…' : '<span class="sub">аккаунт скрыт</span>'}</span><span class="his">${(x.e.top_hero_ids || []).slice(0, 3).map(h2 => face(h2, '', 's', hero(h2).n)).join('')}</span></span></${x.one ? 'a' : 'div'}>`; }).join('')}</div>` : '';
      const rows = (q ? F2 : F2.slice(3)).slice(0, LB2.n), more = (q ? F2 : F2.slice(3)).length - rows.length;
      put(n, '#lbb', `${pod}<div class="q-box lb10-l">${rows.map((x, j) => `<${x.one ? `a href="?id=${x.one}#home"` : 'div'} id="lb2-${x.i}" class="lb10-r${x.i === myI ? ' mine' : ''}${x.one ? '' : ' x'}" style="--i:${Math.min(j, 20)}"><span class="lb10-n${x.i < 10 ? ' t10' : ''}">${x.i + 1}</span>
          <span class="lb10-nm"><b>${esc(x.e.account_name || 'Скрытый игрок')}</b>${x.i === myI ? '<em>это ты</em>' : ''}</span>
          <span class="rkc" data-acc="${x.one || ''}">${x.one ? '<span class="sub">…</span>' : '<span class="sub">аккаунт скрыт</span>'}</span>
          <span class="his">${(x.e.top_hero_ids || []).slice(0, 4).map(h => face(h, '', 'm', hero(h).n)).join('')}</span><span class="r9-go">${x.one ? '›' : ''}</span></${x.one ? 'a' : 'div'}>`).join('') || '<div class="empty">Никого не нашлось.</div>'}</div>
        ${more > 0 ? `<button class="btn g q-more" id="lbmore" type="button">Показать ещё ${Math.min(50, more)}</button>` : ''}`);
      lbRanks();
      const mb = $('#lbmore'); if (mb) mb.onclick = () => { LB2.n += 50; LB2.keep = 1; draw(); };
      const me2 = $('#lbme2'); if (me2) me2.onclick = () => { if (myI < 0) { alertBox(`Тебя нет в топе: ${esc(REGN[LB2.rg])}${LB2.h ? ' на этом герое' : ''}.`); return; } if (myI >= LB2.n + 3) { LB2.n = myI + 20; LB2.keep = 1; draw().then(() => { const r = $('#lb2-' + myI); if (r) r.scrollIntoView({block: 'center', behavior: 'smooth'}); }); return; } const r = $('#lb2-' + myI); if (r) r.scrollIntoView({block: 'center', behavior: 'smooth'}); };
    } catch (err) { put(n, '#lbb', `<div class="err">${esc(err.message)}</div>`); }
  };
  $$('#lbrg button').forEach(b => b.onclick = () => { $$('#lbrg button').forEach(x => x.classList.toggle('on', x === b)); LB2.rg = b.dataset.r; LB2.n = 50; draw(); });
  $('#lbh').onchange = e => { LB2.h = +e.target.value; LB2.n = 50; draw(); };
  $('#lbf2').oninput = e => { LB2.q = e.target.value.trim(); clearTimeout(LB2.t); LB2.t = setTimeout(draw, 250); };
  draw();
}

// ---------- VIP: логотип градиентом. Пока включается ссылкой ?vip=1 (выключить — ?vip=0), запоминается ----------
{
  try { const v = new URLSearchParams(location.search).get('vip'); if (v === '1') localStorage.setItem('rl-vip', '1'); if (v === '0') localStorage.removeItem('rl-vip'); } catch (e) {}
  let vip = false; try { vip = localStorage.getItem('rl-vip') === '1'; } catch (e) {}
  document.body.classList.toggle('vip', vip);
  const w = $('.q-lw'); if (w) w.title = vip ? 'Restless VIP' : 'Restless';
}

// ---------- фраза героя: навёл — разбор слов и кнопка «Разобрать в боте» (бот сразу открывает этого героя) ----------
const BOT_APP = 'https://t.me/languagegamesbot/languagedota2';
const botLink = h => `${BOT_APP}?startapp=dl_${hSlug(h)}`;
function sayPop(box, h) {
  let pop = $('.q10-sp'); if (pop && pop._box === box) return pop;
  if (pop) pop.remove();
  const en = ($('.q-sy-cap .all', box) || {}).textContent || '', ru = ($('.q-sy-ru', box) || {}).textContent || '';
  if (!en.trim()) return null;
  const kw = [...new Map($$('.q-sy-cap u[data-t]', box).map(u => u.dataset.t.split(' — ')).filter(x => x[1]).map(x => [x[0].toLowerCase(), x])).values()];
  pop = document.createElement('div'); pop.className = 'q10-sp'; pop._box = box;
  pop.innerHTML = `<small>Перевод</small>${ru ? `<p class="ru">${esc(ru)}</p>` : ''}
    ${kw.length ? `<small>В этой фразе</small><div class="q10-kw">${kw.map(([a, b]) => `<span><b>${esc(a)}</b><i>${esc(b)}</i></span>`).join('')}</div>` : ''}
    <a class="q10-bt" href="${esc(botLink(h))}" target="_blank" rel="noopener"><span>Больше — в боте</span><em>›</em></a>`;
  document.body.appendChild(pop);
  const r = box.getBoundingClientRect(), w = pop.offsetWidth, hh = pop.offsetHeight;
  let x, y;
  if (innerWidth - r.right >= w + 24) { x = r.right + 12; y = Math.max(8, Math.min(innerHeight - hh - 8, r.bottom - hh)); }
  else { x = Math.max(8, Math.min(innerWidth - w - 8, r.left)); y = r.top - hh - 8; if (y < 8) y = Math.min(innerHeight - hh - 8, r.bottom + 8); }
  pop.style.left = x + 'px'; pop.style.top = y + 'px';
  requestAnimationFrame(() => pop.classList.add('on'));
  return pop;
}
const sayPopClose = () => { const p = $('.q10-sp'); if (p) { p.classList.remove('on'); setTimeout(() => p.remove(), 160); } };
{
  const HS10 = heroSay;
  heroSay = async function (n, h) {
    await HS10(n, h);
    const box = $('#hsay'); if (!box || box._b10) return; box._b10 = 1;
    const fix = () => { const a = $('.q-sy-lb', box); if (a && !a.dataset.bot) { a.dataset.bot = 1; a.href = botLink(h); a.textContent = 'Больше — в боте ›'; } $$('.q-sy-cap u[title]', box).forEach(u => { u.dataset.t = u.title; u.removeAttribute('title'); }); };
    fix(); new MutationObserver(fix).observe(box, {childList: true, subtree: true});
    const HOV = matchMedia('(hover:hover) and (pointer:fine)');
    let t = 0;
    box.addEventListener('mouseover', e => { if (!HOV.matches || !e.target.closest('.q-sy-cap .all, .q-sy-ru')) return; clearTimeout(t); t = setTimeout(() => sayPop(box, h), 120); });
    box.addEventListener('mouseout', e => { if (!HOV.matches) return; clearTimeout(t); t = setTimeout(() => { if (!$('.q10-sp:hover')) sayPopClose(); }, 300); });
    box.addEventListener('click', e => { if (!e.target.closest('.q-sy-cap .all, .q-sy-ru')) return; if ($('.q10-sp')) sayPopClose(); else sayPop(box, h); });
  };
  document.addEventListener('mouseout', e => { const p = e.target.closest && e.target.closest('.q10-sp'); if (p && !p.contains(e.relatedTarget) && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('#hsay'))) setTimeout(() => { if (!$('.q10-sp:hover')) sayPopClose(); }, 250); });
  document.addEventListener('click', e => { if ($('.q10-sp') && !e.target.closest('.q10-sp') && !e.target.closest('#hsay')) sayPopClose(); });
  addEventListener('hashchange', sayPopClose);
  addEventListener('scroll', () => { if ($('.q10-sp')) sayPopClose(); }, {passive: true});
}

// ---------- «Обзор» матча: сводка — как отыграл (вердикт, плитки, лучшие моменты), без простыни текста ----------
function r10Sum(X, p) {
  const a = X.A.get(p) || {score: 50}, m = X.M.get(p) || mMet(X, p), mine = q => teamOf(q.team) === teamOf(p.team), T = X.P.filter(mine), rk = f => 1 + T.filter(q => f(q) > f(p)).length;
  const dead = (p.death_details || []).reduce((s, d) => s + (d.death_duration_s || 0), 0);
  const kt = X.P.filter(q => !mine(q)).flatMap(q => (q.death_details || []).filter(d => d.killer_player_slot === p.player_slot).map(d => d.game_time_s)).sort((x, y) => x - y);
  let best = kt.length ? 1 : 0, bt = kt[0] || 0, cur = 1;
  for (let i = 1; i < kt.length; i++) { if (kt[i] - kt[i - 1] <= 12) { cur++; if (cur > best) { best = cur; bt = kt[i - cur + 1]; } } else cur = 1; }
  const dt = (p.death_details || []).map(d => d.game_time_s).sort((x, y) => x - y); let spree = 0, c = 0, j = 0;
  kt.forEach(t => { while (j < dt.length && dt[j] < t) { j++; c = 0; } c++; spree = Math.max(spree, c); });
  const allD = X.P.flatMap(q => (q.death_details || []).map(d => ({t: d.game_time_s, k: d.killer_player_slot}))).sort((x, y) => x.t - y.t);
  const fb = allD[0] && allD[0].k === p.player_slot ? allD[0].t : null;
  const opp = mOpp(p), lane = opp ? mAt(p, 600) - mAt(opp, 600) : null;
  const tile = (k, v, note, cls) => `<div class="r10-t ${cls || ''}"><small>${k}</small><b>${v}</b><span>${note}</span></div>`;
  const rkC = r => r <= 2 ? 'g' : r >= 5 ? 'r' : '';
  const nwR = rk(q => q.net_worth || 0), dmR = rk(q => (X.M.get(q) || mMet(X, q)).dmg), obR = rk(q => (X.M.get(q) || mMet(X, q)).obj), kpR = rk(q => (X.M.get(q) || mMet(X, q)).kp);
  const deadPct = Math.round(100 * dead / Math.max(60, X.dur));
  const tiles = [
    lane != null ? tile('Линия к 10:00', `${lane >= 0 ? '+' : '−'}${nf(Math.abs(lane))}`, `душ против ${esc(hero(opp.hero_id).n)}`, lane >= 0 ? 'g' : 'r') : '',
    tile('Души', `${nwR}-й`, `в команде · ${nf(Math.round(m.spm))}/мин`, rkC(nwR)),
    tile('Урон по героям', `${dmR}-й`, `${kFmt(m.dmg)} за матч`, rkC(dmR)),
    tile('Драки', `${Math.round(100 * m.kp)}%`, `участие · ${kpR}-й в команде`, rkC(kpR)),
    tile('Смерти', `${p.deaths || 0}`, `мёртвым ${mmss(dead)} · ${deadPct}% матча`, deadPct >= 15 ? 'r' : deadPct <= 6 ? 'g' : ''),
    tile('Объекты', `${obR}-й`, `${kFmt(m.obj)} урона по стражам`, rkC(obR))].filter(Boolean);
  const MK = {2: 'Двойное убийство', 3: 'Тройное убийство', 4: 'Четыре за раз', 5: 'Пять за раз', 6: 'Вся команда'};
  const hl = [];
  if (best >= 2) hl.push(['g', `${MK[Math.min(6, best)]}`, mmss(bt)]);
  if (spree >= 4) hl.push(['g', `${spree} убийств без смерти`, 'серия']);
  if (fb != null) hl.push(['a', 'Первая кровь', mmss(fb)]);
  if (deadPct >= 15) hl.push(['r', `Лежал мёртвым ${mmss(dead)}`, `${deadPct}% матча`]);
  if (!(p.deaths || 0)) hl.push(['g', 'Ни разу не умер', '']);
  const S = [['линия', lane != null ? (lane >= 0 ? 1 : 6) : 3.5], ['фарм', nwR], ['урон', dmR], ['драки', kpR], ['объекты', obR]];
  const good = S.filter(x => x[1] <= 2).map(x => x[0]), bad = S.filter(x => x[1] >= 5).map(x => x[0]);
  const vd = a.score >= 65 ? ['Отыграл отлично', 'g'] : a.score >= 54 ? ['Отыграл хорошо', 'g'] : a.score >= 44 ? ['Отыграл средне', 'a'] : ['Отыграл слабо', 'r'];
  return `<div class="r10-vd ${vd[1]}"><b>${vd[0]}</b>${good.length ? `<span class="g">сильно: ${good.join(', ')}</span>` : ''}${bad.length ? `<span class="r">слабо: ${bad.join(', ')}</span>` : ''}</div>
    <div class="r10-ts">${tiles.join('')}</div>${hl.length ? `<div class="r10-hl">${hl.map(([c2, t, s]) => `<span class="${c2}"><b>${t}</b>${s ? `<i>${s}</i>` : ''}</span>`).join('')}</div>` : ''}`;
}
function mOv() {
  const X = MX, p = mSel(), a = X.A.get(p) || {score: 50}, g = gradeOf(a.score), won = teamOf(p.team) === X.win, me = p === X.meP;
  return `<div class="r9-ov">${r9Board(X)}
    <section class="q-box r9-pl"><div class="r9-plh">${face(p.hero_id, won ? 'g' : 'c', 'm')}<div><small>${me ? 'Твоя игра' : 'Игра игрока'} · <span class="${won ? 'win' : 'loss'}">${won ? 'победа' : 'поражение'}</span></small><b>${esc(pname(p))}</b><span>${esc(hero(p.hero_id).n)} · ${p.kills || 0}/${p.deaths || 0}/${p.assists || 0}</span></div>
      <span class="r9-pg big" style="--gc:${gradeCol(g)}" title="оценка ${a.score} из 100 против лобби">${g}</span></div>
      ${r10Sum(X, p)}<p class="r10-late" id="qmlate" hidden></p>
      <div class="r9-its">${finalItems(p).map(itIco).join('') || '<span class="sub">Предметов нет в данных.</span>'}</div>
      <div class="r9-pb"><button type="button" class="btn s" data-mt="co">Подробный разбор ›</button><button type="button" class="btn g" data-mt="pl">Сборка по минутам</button>${p.account_id && !me ? `<a class="btn g" href="?id=${p.account_id}#home">Профиль</a>` : ''}</div></section></div>`;
}

// ---------- матч по номеру: в поиске и в профиле; свой матч, открытый по номеру, остаётся в истории профиля ----------
const XM_KEY = 'rl-xm';
const xmAll = () => { try { return JSON.parse(localStorage.getItem(XM_KEY) || '{}') || {}; } catch (e) { return {}; } };
function xmSave(aid, X) {
  const p = X.P.find(q => q.account_id === aid); if (!p) return;
  const mi = X.mi, row = {match_id: X.mid, start_time: tsOf(mi.start_time) || now(), hero_id: p.hero_id, player_team: teamOf(p.team), match_result: teamOf(mi.winning_team),
    player_kills: p.kills || 0, player_deaths: p.deaths || 0, player_assists: p.assists || 0, net_worth: p.net_worth || 0, match_duration_s: mi.duration_s || 0, match_mode: mi.match_mode, hero_level: p.level || 0, last_hits: p.last_hits || 0, denies: p.denies || 0, xm: 1};
  const A = xmAll(), L = (A[aid] || []).filter(r => r.match_id !== row.match_id && r.start_time > now() - 21 * 86400);
  A[aid] = [row, ...L].slice(0, 30); try { localStorage.setItem(XM_KEY, JSON.stringify(A)); } catch (e) {}
}
function xmMerge(aid, H) {
  const L = (xmAll()[aid] || []).filter(r => !H.some(m => m.match_id === r.match_id));
  return L.length ? L.concat(H).sort((a, b) => b.start_time - a.start_time) : H;
}
{
  const VM10 = viewMatch2;
  viewMatch2 = async function (mid, tab) { await VM10(mid, tab); try { if (MX && MX.mid === +mid && ME && MX.P.some(p => p.account_id === ME.id)) xmSave(ME.id, MX); } catch (e) {} };
}
const xmGo = mid => { const v = String(mid || '').replace(/\D/g, ''); if (v.length >= 5) location.hash = '#m/' + v; };
// шапка: просто число — спросить, это матч или игрок; «матч 123…» — сразу матч
{
  const sq = $('#sq'), dd = $('#sd');
  const isNum = q => /^\d{6,11}$/.test(q), isM = q => /^(матч|match|m|#m\/)\s*№?\s*(\d{5,11})$/i.exec(q);
  const choice = q => { dd.classList.remove('hide'); dd.innerHTML = `<button type="button" data-mid="${q}"><span class="x10-ic">⚔</span><span><b>Матч № ${q}</b><small>открыть разбор этого матча</small></span></button><button type="button" data-id="${q}"><span class="x10-ic">👤</span><span><b>Игрок с ID ${q}</b><small>открыть профиль</small></span></button>`; };
  if (sq && dd) {
    sq.addEventListener('input', () => { const q = sq.value.trim(); if (isNum(q)) choice(q); else if (isM(q)) choice(isM(q)[2]); });
    document.addEventListener('submit', e => { if (!e.target || e.target.id !== 'sf') return; const q = sq.value.trim(), m = isM(q);
      if (m) { e.preventDefault(); e.stopPropagation(); sq.value = ''; dd.classList.add('hide'); xmGo(m[2]); return; }
      if (isNum(q)) { e.preventDefault(); e.stopPropagation(); choice(q); } }, true);
    dd.addEventListener('click', e => { const b = e.target.closest('[data-mid]'); if (!b) return; e.stopPropagation(); dd.classList.add('hide'); sq.value = ''; xmGo(b.dataset.mid); }, true);
  }
}
// профиль: «Матч по номеру» в шапке списка матчей
{
  const VH10 = viewHome;
  viewHome = async function () {
    await VH10.apply(this, arguments);
    const h = $('#hist .r9-h2'); if (!h || $('#xmB', h)) return;
    h.insertAdjacentHTML('beforeend', `<button type="button" class="btn g x10-b" id="xmB" title="Только что сыграл, а матча нет? Вставь номер матча из игры">＋ Матч по номеру</button>`);
    $('#xmB').onclick = () => {
      if ($('#xmF')) { $('#xmF').remove(); return; }
      h.insertAdjacentHTML('afterend', `<form class="x10-f" id="xmF" autocomplete="off"><input id="xmQ" inputmode="numeric" placeholder="Номер матча из игры, например 129303386" aria-label="Номер матча"><button class="btn s" type="submit">Открыть</button></form>`);
      $('#xmQ').focus();
      $('#xmF').onsubmit = e => { e.preventDefault(); xmGo($('#xmQ').value); };
    };
  };
}

// ---------- слово фразы героя: навёл — сразу перевод над словом (вместо «знака вопроса») ----------
{
  let tip = null;
  const show = u => { if (!tip) { tip = document.createElement('div'); tip.className = 'q10-wt'; document.body.appendChild(tip); }
    const [a, b] = (u.dataset.t || '').split(' — '); tip.innerHTML = `<b>${esc(a || '')}</b>${b ? `<span>${esc(b)}</span>` : ''}`;
    const r = u.getBoundingClientRect(); tip.style.left = Math.max(8, Math.min(innerWidth - tip.offsetWidth - 8, r.left + r.width / 2 - tip.offsetWidth / 2)) + 'px'; tip.style.top = Math.max(8, r.top - tip.offsetHeight - 8) + 'px'; tip.classList.add('on'); };
  document.addEventListener('mouseover', e => { const u = e.target.closest && e.target.closest('#hsay u[data-t]'); if (u) show(u); else if (tip) tip.classList.remove('on'); });
  addEventListener('scroll', () => { if (tip) tip.classList.remove('on'); }, {passive: true});
}

// ---------- профиль заново, как League of Graphs: слева ранг, форма, метки, напарники; справа герои за период и 10 последних игр ----------
const P11 = {per: ''};
function p11Heroes(H, HS, per) {
  const won = m => m.player_team === m.match_result;
  if (per === 'all') return HS.filter(x => D.heroes[x.hero_id] && x.matches_played).sort((a, b) => b.matches_played - a.matches_played).map(x => ({hid: x.hero_id, g: x.matches_played, w: x.wins, k: x.kills / x.matches_played, d: x.deaths / x.matches_played, a: x.assists / x.matches_played}));
  const t = now() - (per === '90' ? 90 : 30) * 86400, R = {};
  H.filter(m => m.start_time >= t).forEach(m => { const o = R[m.hero_id] = R[m.hero_id] || {m: 0, w: 0, k: 0, d: 0, a: 0}; o.m++; if (won(m)) o.w++; o.k += m.player_kills; o.d += m.player_deaths; o.a += m.player_assists; });
  return Object.entries(R).filter(([h]) => D.heroes[h]).sort((a, b) => b[1].m - a[1].m).map(([h, o]) => ({hid: +h, g: o.m, w: o.w, k: o.k / o.m, d: o.d / o.m, a: o.a / o.m}));
}
function p11HeroRows(L) {
  if (!L.length) return '<div class="empty">За этот период игр нет.</div>';
  return L.slice(0, 8).map((x, i) => { const wr = 100 * x.w / Math.max(1, x.g), o = HRR[PHF.id + '|' + x.hid];
    return `<a class="p12-h" href="#h/${x.hid}/me" style="--i:${i}">${face(x.hid, '', 'm')}<span class="n"><b>${esc(hero(x.hid).n)}</b><small><i class="k">${f1(x.k)}</i> / <i class="d">${f1(x.d)}</i> / <i class="a">${f1(x.a)}</i></small></span>
      <span class="g"><b class="${wr >= 52 ? 'win' : wr <= 47 ? 'loss' : ''}">${f1(wr)}%</b><small>${games(x.g)}</small></span>
      <span class="p11-pl" data-hrk="${x.hid}" role="button" title="Место на герое — нажми, покажу таблицу">${o ? hrkCell(o) : i < 4 ? '<small>считаю место…</small>' : '<small class="lk">узнать место ›</small>'}</span></a>`; }).join('');
}
async function viewHome() {
  if (!ME) return viewLanding();
  const n = vNew(), id = ME.id;
  if (PHF.id !== id) { PHF.hero = 0; PHF.mode = ''; PHF.id = id; HN = 10; P11.per = ''; }
  PHF.view = 'full';
  V('<div class="load">Собираю профиль…</div>');
  let H, HS, R, SS, HSt, ST;
  try {
    [H, HS, R, SS, HSt, ST] = await Promise.all([api('players/' + id + '/match-history'), api('players/hero-stats?account_ids=' + id).catch(() => []), api('players/' + id + '/rank').catch(() => null),
      api('assets/ranked-seasons').catch(() => []), api('analytics/hero-stats?' + fq()).catch(() => []), api('players/steam?account_ids=' + id).catch(() => [])]);
  } catch (e) { if (n === VQ) V(`<div class="err">Не вышло загрузить профиль: ${esc(e.message)}</div>`); return; }
  if (n !== VQ) return;
  H = xmMerge(id, H);
  const won = m => m.player_team === m.match_result, badge = (R && R.badge) || 0, st = (ST || [])[0] || {};
  const c60 = {}; H.filter(m => m.start_time >= now() - 60 * 86400).forEach(m => c60[m.hero_id] = (c60[m.hero_id] || 0) + 1);
  const pool = HS.slice().sort((a, b) => b.matches_played - a.matches_played);
  const main = +((Object.entries(c60).sort((a, b) => b[1] - a[1])[0] || [])[0]) || (pool[0] || {}).hero_id || 0;
  const ws = R && R.last_match && R.last_match.start_time > now() - 3 * 86400 ? R.last_match.player_rank_initial_win_streak || 0 : 0;
  PBAN = banHTML({name: ME.name, av: ME.avatar, badge, main: D.heroes[main] ? main : 0, games: H.length, cc: st.countrycode, ws}); PBAN_ID = id;
  if (!H.length) { V(`${ptabsHTML('home')}<div class="empty">У этого игрока нет матчей в открытых данных.</div>`); return; }
  GD = (H.slice(0, 50).reduce((a, m) => a + Math.max(300, m.match_duration_s || 0), 0) / Math.max(1, Math.min(50, H.length))) || 1800;
  const HA = {}, HTOT = HSt.reduce((a, x) => a + x.matches, 0) / 12 || 1;
  HSt.forEach(x => { const k = Math.max(1, x.matches); HA[x.hero_id] = {spm: x.total_net_worth / k, dpm: x.total_deaths / k, kpm: x.total_kills / k, apm: x.total_assists / k, lhm: x.total_last_hits / k, den: (x.total_denies || 0) / k, pr: 100 * x.matches / HTOT}; });
  const CNT = {}; H.filter(m => m.start_time >= now() - 30 * 86400).forEach(m => CNT[m.hero_id] = (CNT[m.hero_id] || 0) + 1);
  { const L = H.slice(0, 50); CNT._avg = {spm: L.reduce((x, m) => x + m.net_worth / (Math.max(300, m.match_duration_s) / 60), 0) / Math.max(1, L.length), d: L.reduce((x, m) => x + m.player_deaths, 0) / Math.max(1, L.length)}; }
  const MS = {}; HS.forEach(x => { MS[x.hero_id] = {g: x.matches_played, wr: pc(x.wins, x.matches_played), sc: mstyScore(x)}; });
  PROF = {id, H, HS, CNT, MS, badge};

  const ses = curSeason(SS), SH = H.filter(m => m.match_mode === 4 && m.start_time >= ses.start), sw = SH.filter(won).length, rk = rankOf(badge);
  const F = qkForm(H), A = qkAct(H), wr20 = Math.round(100 * F.w / Math.max(1, F.L.length));
  const rank = `<section class="q-box p11-rk"><div class="p11-rkm" data-aid="${id}">${badge ? rankImg(badge, 'rk') : '<i class="p11-nr">?</i>'}<div><small>Ранг сейчас</small><b style="${badge ? `color:${esc(rk.color)}` : ''}">${badge ? esc(rk.name) : 'Без ранга'}</b>
      <span id="rtop">${badge ? 'считаю место…' : ''}</span>${SH.length ? `<span>Сезон: <i class="win">${sw}</i> — <i class="loss">${SH.length - sw}</i> · <b class="${wrC(100 * sw / SH.length, SH.length)}">${Math.round(100 * sw / SH.length)}%</b></span>` : '<span>ранговых в этом сезоне нет</span>'}</div></div>
    <div class="p11-en"><small>Средний ранг врагов · последние 10</small><div id="enr" class="q-en"><span class="sub">считаю…</span></div></div></section>`;
  const form = `<section class="q-box p11-fm"><div class="r9-h2"><b>Форма</b><small>последние ${F.L.length}</small></div>
    <div class="p11-fr"><b class="${wrC(wr20, F.L.length)}">${wr20}%</b><span><i class="win">${F.w}В</i> <i class="loss">${F.L.length - F.w}П</i></span><em class="${F.st >= 2 ? (F.r0 ? 'win' : 'loss') : ''}">${F.st >= 2 ? `${F.st} ${F.r0 ? pl(F.st, ['победа', 'победы', 'побед']) : pl(F.st, ['поражение', 'поражения', 'поражений'])} подряд` : ''}</em></div>
    <i class="r9-dots">${F.L.map(m => `<i class="${won(m) ? 'w' : 'l'}"></i>`).join('')}</i>
    <div class="p11-act"><span>${A.g7} за неделю</span><span>последний — ${esc(ago(A.last))}</span><a href="#live/${id}">лайв ›</a></div></section>`;
  const T = profTags(H, HS, HA), P2x = patterns2(H), lg = P2x.find(x => /долгих/.test(x.n));
  if (lg && lg.d <= -8) T.splice(1, 0, ['Сливает долгие игры', 'r', `игры 35+ мин выигрывает в ${Math.round(lg.wr)}%`]); else if (lg && lg.d >= 8) T.splice(1, 0, ['Тащит долгие игры', 'g', `игры 35+ мин выигрывает в ${Math.round(lg.wr)}%`]);
  const know = T.length ? `<section class="q-box p11-kn"><div class="r9-h2"><b>Что знать</b></div><div class="p11-tg" id="p10kn">${T.slice(0, 8).map(([s2, c, h2], i) => `<div class="p10-t ${c || 'n'}" style="--i:${i}"><b>${esc(s2)}</b><small>${esc(h2)}</small></div>`).join('')}</div></section>` : '';
  const mates = `<section class="q-box r9-hs"><div class="r9-h2"><b>Чаще всего с</b><a href="#form/habits">привычки ›</a></div><div id="qkmate"><span class="sub">Считаю…</span></div></section>`;
  if (!P11.per) { const c30 = H.filter(m => m.start_time >= now() - 30 * 86400).length, c90 = H.filter(m => m.start_time >= now() - 90 * 86400).length; P11.per = c30 >= 10 ? '30' : c90 >= 10 ? '90' : 'all'; }
  const heroes = `<section class="q-box p11-hs"><div class="r9-h2"><b>Часто играет</b><div class="seg" id="p11per">${[['30', '30 дней'], ['90', '3 месяца'], ['all', 'Всё время']].map(([k, v]) => `<button type="button" data-p="${k}" class="${P11.per === k ? 'on' : ''}">${v}</button>`).join('')}</div><a href="#mine">все ›</a></div><div id="p11hl">${p11HeroRows(p11Heroes(H, HS, P11.per))}</div></section>`;
  const hlist = [...new Set(H.slice(0, 300).map(m => m.hero_id))].filter(h => D.heroes[h]).sort((a, b) => hero(a).n.localeCompare(hero(b).n));
  const hist = `<section class="q-box r9-hi" id="hist"><div class="r9-h2"><b>Последние игры</b><span id="hsum" hidden></span><span class="sp" style="flex:1"></span>
      <div class="seg r9-md" id="hfm2">${[['', 'Все'], ['r', 'Ранговые'], ['u', 'Обычные']].map(([k, nm]) => `<button type="button" data-md="${k}" class="${(PHF.mode || '') === k ? 'on' : ''}">${nm}</button>`).join('')}</div>
      <select class="q-sel" id="hfh" aria-label="Герой"><option value="0">Все герои</option>${hlist.map(h => `<option value="${h}"${PHF.hero === h ? ' selected' : ''}>${esc(hero(h).n)}</option>`).join('')}</select></div>
    <div id="hrows"></div><button class="btn g q-more" id="hmore" type="button">Показать ещё 10</button></section>`;
  V(`${ptabsHTML('home')}<div class="p11 p12"><aside class="p11-l">${rank}${form}${typeof p13Side === 'function' ? p13Side(H) : ''}${mates}<div id="qkco"></div></aside><div class="p11-c">${know}${hist}</div><aside class="p11-r">${heroes}</aside></div>
    <div id="mybw" hidden><div class="q-box"><div class="q-bh"><b>Сохранённые сборки</b></div><div class="pad" id="myb"></div></div></div>`);
  $('#p11per').onclick = e => { const b = e.target.closest('[data-p]'); if (!b) return; P11.per = b.dataset.p; $$('#p11per button').forEach(x => x.classList.toggle('on', x === b)); put(n, '#p11hl', p11HeroRows(p11Heroes(H, HS, P11.per))); p11Rk(n, id, ME.name); };
  p11Rk(n, id, ME.name);
  $('#p11hl').addEventListener('click', e => { const c = e.target.closest('[data-hrk]'); if (!c) return; e.preventDefault(); e.stopPropagation(); hrkOpen(+c.dataset.hrk, id, ME.name); }, true);
  qkMates(n, id);
  coProfDraw(id, H); const co = $('#qkco');
  if (co) co.addEventListener('click', e => { const b = e.target.closest('[data-qkc]'); if (b && b.dataset.qkc === 'drop') { coTaskSave(null); coProfDraw(id, H); } });
  coProfCheck(id, H);
  $('#hfh').onchange = e => { PHF.hero = +e.target.value; HN = 10; drawHist(n); };
  $$('#hfm2 button').forEach(b => b.onclick = () => { PHF.mode = b.dataset.md; HN = 10; $$('#hfm2 button').forEach(x => x.classList.toggle('on', x === b)); drawHist(n); });
  $('#hmore').onclick = () => { HN += 10; drawHist(n); };
  const rows = $('#hrows');
  rows.onclick = e => { if (e.target.closest('a')) return; const r = e.target.closest('[data-m]'); if (r) location.hash = '#m/' + r.dataset.m; };
  rows.onkeydown = e => { if (e.key !== 'Enter' || e.target.closest('a')) return; const r = e.target.closest('[data-m]'); if (r) location.hash = '#m/' + r.dataset.m; };
  drawHist(n);
  gradeBase(badge).then(T2 => { if (n !== VQ) return; GT = T2; drawRows(n); });
  if (badge) api('players/rank/distribution').then(Dd => { if (n !== VQ) return; const tot = Dd.reduce((a, x) => a + (x.players || 0), 0), up = Dd.filter(x => x.badge >= badge).reduce((a, x) => a + (x.players || 0), 0); const el = $('#rtop'); if (el && tot) el.innerHTML = `Топ <b>${f1(Math.max(.1, 100 * up / tot))}%</b> игроков`; }).catch(() => {});
  topPlaces(n, id, ME.name, st.countrycode, pool);
  renderMyBuilds().then(() => { const b = $('#myb'), w = $('#mybw'); if (n === VQ && b && w && b.querySelector('a,img,.bch,.myc')) w.hidden = false; }).catch(() => {});
}

// ---------- разбор (коуч) блоками: каждая мысль — своя строка, разделы с заголовками ----------
function co10Fix(html) {
  const t = document.createElement('template'); t.innerHTML = html; const R = t.content, art = R.querySelector('.co2-txt'); if (!art) return html;
  const split = h => h.split(/(?<=[.!?])\s+(?=[А-ЯЁA-Z«<])/).map(x => x.trim()).filter(Boolean).reduce((a, x) => { if (a.length && x.replace(/<[^>]+>/g, '').length < 30) a[a.length - 1] += ' ' + x; else a.push(x); return a; }, []);
  const rows = (h, cls) => `<ul class="co10-r${cls ? ' ' + cls : ''}">${split(h).map(x => `<li>${x}</li>`).join('')}</ul>`;
  const P = [...art.children].filter(el => el.tagName === 'P' && !el.id);
  const head = R.querySelector('.co-ht h3');
  if (P[0]) { const S = split(P[0].innerHTML), last = S.length > 2 ? S.pop() : ''; if (last && head) head.innerHTML = last.replace(/<[^>]+>/g, '');
    P[0].outerHTML = `<h4 class="co10-h">Картина игры</h4><ul class="co10-r">${S.map(x => `<li>${x}</li>`).join('')}</ul>`; }
  if (P[1]) P[1].outerHTML = `<h4 class="co10-h">Как это происходит</h4>${rows(P[1].innerHTML)}`;
  const mo = art.querySelector('.co2-mo'); if (mo) mo.insertAdjacentHTML('beforebegin', '<h4 class="co10-h">Смерти</h4>');
  P.slice(2).forEach(p => { if (!p.parentNode) return; const pv = p.previousElementSibling; if (pv && pv.tagName === 'H4' && !pv.classList.contains('co10-h')) return; const h = p.innerHTML;
    if (/Посчитай время/.test(h)) p.outerHTML = `<div class="co10-c r">${rows(h)}</div>`;
    else p.outerHTML = `<h4 class="co10-h">Почему так</h4>${rows(h)}`; });
  art.querySelectorAll('h4:not(.co10-h)').forEach(h => { h.classList.add('co10-h'); const nx = h.nextElementSibling; if (nx && nx.tagName === 'P') nx.outerHTML = rows(nx.innerHTML, /Честно/.test(h.textContent) ? 'ok' : ''); if (/Честно/.test(h.textContent)) h.textContent = 'Что получилось'; });
  const late = art.querySelector('#colate'); if (late) late.insertAdjacentHTML('beforebegin', '<h4 class="co10-h">Предметы</h4>');
  return t.innerHTML;
}
function co10Late(el) {
  if (!el || !el.parentNode) return;
  const h = el.innerHTML.replace(/^\s*Вторая вещь — предметы\.\s*/, '').replace(/\s*Сравнение — с игроками[^.]*\.\s*$/, '');
  const S = h.split(/(?<=[.!?)])\s+(?=[А-ЯЁA-Z«<])/).map(x => x.trim()).filter(Boolean);
  el.outerHTML = `<ul class="co10-r">${S.map(x => `<li>${x}</li>`).join('')}</ul><small class="co10-n">сравнение — с игроками высокого ранга за 30 дней</small>`;
}
{ const M7 = mCo; mCo = function () { return co10Fix(M7()); }; }

// ---------- раздел «Герои»: вкладки «Герои» (как выбор героя в игре) и «Мета» (тир-лист, дуо, контрпики, предметы) ----------
const HM = {tab: 'heroes', sub: 'tier', hov: 0};
const HM_SUB = [['tier', 'Тир-лист'], ['duo', 'Сильные дуо'], ['counter', 'Контрпики'], ['items', 'Предметы']];
function hmTabs() { return `<div class="hm-hd"><div class="hm-tabs"><a href="#heroes" class="${HM.tab === 'heroes' ? 'on' : ''}">Герои</a><a href="#meta/${HM.sub}" class="${HM.tab === 'meta' ? 'on' : ''}">Мета</a></div><span class="sp" style="flex:1"></span>${fltHTML()}</div>`; }
viewHeroes = async function () {
  HM.tab = 'heroes'; const n = vNew();
  V(`${hmTabs()}<div class="hm-sel"><div class="hm-pv" id="hmpv"></div><div class="hm-grid" id="hmg"><div class="load">Собираю героев…</div></div></div>`);
  fltBind(viewHeroes);
  let M = {}; try { M = await heroStats(); } catch (e) {}
  if (n !== VQ) return;
  const ids = Object.keys(D.heroes).map(Number).filter(id => D.heroes[id].v || D.heroes[id].c).sort((a, b) => hero(a).n.localeCompare(hero(b).n));
  const pv = id => { const h = hero(id), x = M[id] || {}; HM.hov = id; const box = $('#hmpv'); if (!box) return;
    box.style.setProperty('--hc', h.col || '#ffb020');
    box.innerHTML = `<i class="hm-bg" style="background-image:url('${esc(h.bg || '')}')"></i><img class="hm-art" src="art/${id}.webp" alt="" onerror="this.src='${esc(h.v || h.c)}'">
      <div class="hm-inf"><small>${esc(TYPE_RU[h.ty] || 'Герой')}${h.cx ? ' · сложность ' + h.cx + ' из 3' : ''}</small><b>${esc(h.n)}</b>
      <div class="hm-st">${x.wr != null ? `<span><i class="${wrC(x.wr)}">${f1(x.wr)}%</i><small>побед</small></span><span><i>${f1(x.pr)}%</i><small>берут</small></span><span><i>${f2(x.kda)}</i><small>KDA</small></span>` : ''}</div>
      <a class="btn" href="#h/${id}">Сборки и всё о герое ›</a></div>`;
    box.classList.remove('in'); void box.offsetWidth; box.classList.add('in'); };
  put(n, '#hmg', ids.map((id, i) => { const h = hero(id), x = M[id] || {};
    return `<a class="hm-c" href="#h/${id}" data-h2="${id}" style="--hc:${esc(h.col || '#ffb020')};--i:${i}"><span class="hm-ci"><img src="${esc(h.v || h.c)}" alt="" loading="lazy" onerror="this.src='${esc(h.c || h.i)}'"></span><b>${esc(h.n)}</b>${x.wr != null ? `<em class="${wrC(x.wr)}">${f1(x.wr)}%</em>` : ''}</a>`; }).join(''));
  const g = $('#hmg'); if (!g) return;
  g.addEventListener('mouseover', e => { const c = e.target.closest('[data-h2]'); if (c && +c.dataset.h2 !== HM.hov) pv(+c.dataset.h2); });
  g.addEventListener('focusin', e => { const c = e.target.closest('[data-h2]'); if (c) pv(+c.dataset.h2); });
  const best = Object.values(M).sort((a, b) => b.wr - a.wr)[0]; pv(best ? best.id : ids[0]);
};
viewMeta = async function () {
  setTimeout(() => $$('#tabs a').forEach(x => x.classList.toggle('on', x.dataset.t === 'mt')), 0);
  HM.tab = 'meta'; const sub = (location.hash.split('/')[1] || HM.sub); HM.sub = HM_SUB.some(x => x[0] === sub) ? sub : 'tier';
  const n = vNew();
  V(`${hmTabs()}<nav class="hm-sub">${HM_SUB.map(([k, v]) => `<a href="#meta/${k}" class="${HM.sub === k ? 'on' : ''}">${v}</a>`).join('')}</nav><div id="hmb"><div class="load">Считаю…</div></div>`);
  fltBind(viewMeta);
  try { await ({tier: hmTier, duo: hmDuo, counter: hmCounter, items: hmItems})[HM.sub](n); } catch (e) { put(n, '#hmb', `<div class="err">${esc(e.message)}</div>`); }
};
const hmFace = (id, sub) => `<a class="hm-f" href="#h/${id}" style="--hc:${esc(hero(id).col || '#ffb020')}" title="${esc(hero(id).n)}"><img src="${esc(hero(id).c || hero(id).i)}" alt="" loading="lazy" onerror="${noimg}"><b>${esc(hero(id).n)}</b>${sub || ''}</a>`;
async function hmTier(n) {
  const M = await heroStats(); if (n !== VQ) return; const all = Object.values(M);
  put(n, '#hmb', `<div class="hm-tier">${MT.map(([t, lo, col], i) => { const hi = i ? MT[i - 1][1] : 999, L = all.filter(h => h.wr >= lo && h.wr < hi).sort((a, b) => b.wr - a.wr); if (!L.length) return '';
    return `<div class="hm-tr" style="--tc:${col};--i:${i}"><div class="hm-tt">${t}</div><div class="hm-th">${L.map(h => hmFace(h.id, `<em class="${wrC(h.wr)}">${f1(h.wr)}%</em>`)).join('')}</div></div>`; }).join('')}</div>`);
}
async function hmDuo(n) {
  const L = await api('analytics/hero-synergy-stats?' + fq()); if (n !== VQ) return;
  const R = (L || []).filter(x => D.heroes[x.hero_id1] && D.heroes[x.hero_id2] && x.matches_played >= 200).map(x => ({a: x.hero_id1, b: x.hero_id2, m: x.matches_played, wr: 100 * x.wins / x.matches_played})).sort((a, b) => b.wr - a.wr);
  const cnt = {}; const R2 = R.filter(x => { if ((cnt[x.a] || 0) >= 2 || (cnt[x.b] || 0) >= 2) return false; cnt[x.a] = (cnt[x.a] || 0) + 1; cnt[x.b] = (cnt[x.b] || 0) + 1; return true; }).slice(0, 24); R.length = 0; R.push(...R2);
  put(n, '#hmb', R.length ? `<div class="hm-duo">${R.map((x, i) => `<div class="hm-d" style="--i:${i}"><span class="hm-dn">${i + 1}</span>${hmFace(x.a)}<i class="hm-plus">+</i>${hmFace(x.b)}<span class="hm-dv"><b class="${wrC(x.wr)}">${f1(x.wr)}%</b><small>${nf(x.m)} игр вместе</small></span></div>`).join('')}</div>` : '<div class="empty">Мало данных за этот период.</div>');
}
async function hmCounter(n) {
  const L = await counterStats(); if (n !== VQ) return;
  const by = {}; (L || []).forEach(x => { if (!D.heroes[x.hero_id] || !D.heroes[x.enemy_hero_id] || x.matches_played < 150) return; (by[x.hero_id] = by[x.hero_id] || []).push({e: x.enemy_hero_id, wr: 100 * x.wins / x.matches_played, m: x.matches_played}); });
  const ids = Object.keys(by).map(Number).sort((a, b) => hero(a).n.localeCompare(hero(b).n));
  put(n, '#hmb', `<div class="hm-cnt">${ids.map((id, i) => { const S = by[id].slice().sort((a, b) => a.wr - b.wr), bad = S.slice(0, 2), good = S.slice(-2).reverse();
    return `<div class="hm-cr" style="--i:${Math.min(i, 30)}">${hmFace(id)}<div class="hm-cv"><small>тяжело против</small>${bad.map(x => `<a href="#h/${x.e}" class="hm-mu loss" title="${esc(hero(x.e).n)}"><img src="${esc(hero(x.e).i)}" alt="" loading="lazy"><b>${f1(x.wr)}%</b></a>`).join('')}</div>
      <div class="hm-cv"><small>легко против</small>${good.map(x => `<a href="#h/${x.e}" class="hm-mu win" title="${esc(hero(x.e).n)}"><img src="${esc(hero(x.e).i)}" alt="" loading="lazy"><b>${f1(x.wr)}%</b></a>`).join('')}</div></div>`; }).join('')}</div>`);
}
async function hmItems(n) {
  const L = await api('analytics/item-stats?' + fq()); if (n !== VQ) return;
  const S = (L || []).filter(x => item(x.item_id) && x.matches >= 2000).map(x => ({id: x.item_id, wr: 100 * x.wins / x.matches, m: x.matches}));
  const G = [['weapon', 'Оружие', '#ff9a3d'], ['vitality', 'Живучесть', '#5fd17f'], ['spirit', 'Дух', '#a07cff']];
  put(n, '#hmb', `<div class="hm-items">${G.map(([k, nm, col]) => { const X = S.filter(x => item(x.id).s === k).sort((a, b) => b.wr - a.wr).slice(0, 8);
    return `<section class="q-box hm-ig" style="--tc:${col}"><div class="r9-h2"><b style="color:${col}">${nm}</b><small>лучший винрейт</small></div>${X.map((x, i) => `<div class="hm-ir" style="--i:${i}"><img src="${esc(item(x.id).i)}" alt="" loading="lazy"><span><b>${esc(item(x.id).n)}</b><small>${nf(item(x.id).p || 0)} душ · ${nf(x.m)} покупок</small></span><em class="${wrC(x.wr)}">${f1(x.wr)}%</em></div>`).join('')}</section>`; }).join('')}</div>`);
}


// ---------- место на герое в профиле: «#2 100 · мир · #12 EU», нажал — таблица с соседями выше и ниже ----------
const RGS = {Europe: 'EU', NAmerica: 'NA', SAmerica: 'SA', Asia: 'Asia', Oceania: 'OCE'}, HRR = {};
const pctTop = (pos, tot) => { const p = 100 * pos / Math.max(1, tot); return 'топ ' + (p < .1 ? String(+p.toPrecision(1)).replace('.', ',') : p < 1 ? p.toFixed(1).replace('.', ',') : Math.max(1, Math.ceil(p))) + '%'; };
const hrkCell = o => { const b = o && hrBig(o.w, o.tot); return b ? `<b>${b.t}</b><small>${b.ex ? 'в мире' : 'на герое'}</small><em class="${o.r ? '' : 'no'}">${RGS[o.rg] || o.rg} ${o.r ? '#' + o.r.pos : '— вне топ-1000'}</em><i class="go">›</i>` : ''; };
// сколько всего игроков на герое (для «топ N%»): ищем последнюю строку таблицы вилкой, кэш на сутки
const HTOT = {};
function heroTotal(hid) {
  if (HTOT[hid]) return HTOT[hid];
  return (HTOT[hid] = (async () => {
    try { const c = JSON.parse(localStorage.getItem('rl-ht2') || '{}'); if (c[hid] && c[hid].t > Date.now() - 864e5) return c[hid].n; } catch (e) {}
    const has = async st => { const r = await SBQ(`${HLQ(hid)}&start=${st}&limit=1`).catch(() => null); return !!(r && r.length); };
    let lo = 0, hi = 4000; while (await has(hi) && hi < 8e6) { lo = hi; hi *= 2; }
    while (hi - lo > 40) { const m = Math.floor((lo + hi) / 2); if (await has(m)) lo = m; else hi = m; }
    try { const c = JSON.parse(localStorage.getItem('rl-ht2') || '{}'); c[hid] = {n: lo, t: Date.now()}; localStorage.setItem('rl-ht2', JSON.stringify(c)); } catch (e) {}
    return lo;
  })().catch(() => 0));
}
async function hrkGet(hid, id, name) {
  const k = id + '|' + hid; if (HRR[k]) return HRR[k];
  const rg = await myReg(id).catch(() => 'Europe');
  const [w, E, tot] = await Promise.all([heroRating(hid, id).catch(() => null), api(`leaderboard/${rg}/${hid}`).then(L => L.entries || []).catch(() => []), heroTotal(hid)]);
  const i = E.findIndex(e => lbHit(e, id, name));
  return (HRR[k] = {w, r: i < 0 ? null : {pos: i + 1, n: E.length}, rg, E, i, tot});
}
async function p11Rk(n, id, name) {
  for (const c of $$('#p11hl [data-hrk]').slice(0, 4)) {
    const o = await hrkGet(+c.dataset.hrk, id, name).catch(() => null); if (n !== VQ) return;
    if (o && c.isConnected) c.innerHTML = hrkCell(o);
  }
}
async function hrkOpen(hid, id, name) {
  const ov = document.createElement('div'); ov.className = 'hrk-ov';
  ov.innerHTML = `<div class="hrk"><header>${face(hid, '', 'm')}<div><b>${esc(hero(hid).n)} · рейтинг</b><small>${esc(name || '')}</small></div><button class="hrk-x" type="button" aria-label="Закрыть">✕</button></header>
    <div class="seg" id="hrks"><button data-s="w" class="on" type="button">Мир</button><button data-s="r" type="button">Мой регион</button></div><div id="hrkb"><div class="load">Считаю место…</div></div></div>`;
  document.body.appendChild(ov); requestAnimationFrame(() => ov.classList.add('on'));
  const close = () => { ov.classList.remove('on'); setTimeout(() => ov.remove(), 200); removeEventListener('keydown', k1); removeEventListener('hashchange', close); };
  const k1 = e => { if (e.key === 'Escape') close(); };
  addEventListener('keydown', k1); addEventListener('hashchange', close);
  let mode = 'w', off = 0;
  const row = (rank, aid, nm, av, sub, mine, bg) => `<${aid ? `a href="${bg != null ? `#h/${hid}/p${aid}` : `?id=${aid}#home`}"` : 'div'} class="hrk-r${mine ? ' mine' : ''}${aid ? '' : ' x'}" data-aid="${aid || ''}"><span class="n">${nf(rank)}</span>${av ? `<img src="${esc(av)}" alt="" loading="lazy">` : '<i></i>'}<b>${esc(nm || 'Скрытый игрок')}</b><small>${bg ? rankImg(bg, 'rk hrk-rk') : ''}${sub}</small><span class="go">${aid ? '›' : ''}</span></${aid ? 'a' : 'div'}>`;
  const draw = async () => {
    const b = $('#hrkb', ov); if (!b) return; b.innerHTML = '<div class="load">Загружаю…</div>';
    const o = await hrkGet(hid, id, name).catch(() => null); if (!ov.isConnected) return;
    $$('#hrks button', ov).forEach(x => { x.classList.toggle('on', x.dataset.s === mode); if (x.dataset.s === 'r' && o) x.textContent = REGN[o.rg] || o.rg; });
    let html = '';
    if (mode === 'w') {
      const me = o && o.w && o.w.pos ? o.w.pos : 1, st = Math.max(1, me - 7 + off);
      const L = await hlRows(hid, st, 15).catch(() => []);
      const S = L.length ? await api('players/steam?account_ids=' + L.map(x => x.account_id).join(',')).catch(() => []) : [], SM = {};
      (S || []).forEach(x => SM[x.account_id] = x);
      const hb = o && hrBig(o.w, o.tot);
      html = `<p class="hrk-h">${hb ? `<b>${hb.t}</b> ${hb.ex ? 'в мире' : 'на герое'}${o.tot ? ` · в рейтинге ${nf(o.tot)}` : ''} · ${esc(hrNext(o.w))}` : esc(hrWhy(o && o.w) || 'Пока не в рейтинге героя.')}<br><small>Как в League of Graphs: ранг, винрейт и KDA на герое; ${HL_MIN}+ игр за ${HL_DAYS} дней и хоть одна за 30 дней. Нажми на игрока — его сборка.</small></p>
        ${L.map(x => row(x.rank, x.account_id, (SM[x.account_id] || {}).personaname || '#' + x.account_id, (SM[x.account_id] || {}).avatar, `${esc(rankOf(x.badge).name)} · ${nf(x.matches)} ${pl(x.matches, ['игра', 'игры', 'игр'])}${x.wr != null ? ` · ${f1(x.wr)}% · KDA ${f1(x.kda)}` : ''}${x.R ? ` · ${nf(x.R)} очков` : ''}`, x.account_id === id, x.badge)).join('')}`;
    } else {
      const E = o ? o.E : [], c = o && o.i >= 0 ? o.i : 0, a = Math.max(0, c - 7 + off);
      html = `<p class="hrk-h">${o && o.r ? `<b>#${o.r.pos}</b> в ${esc(REGN[o.rg] || o.rg)} на этом герое<br><small>Официальная таблица игры: топ-1000 региона.</small>` : `${esc(name || 'Игрока')} пока нет в топ-1000 ${esc(REGN[o ? o.rg : 'Europe'] || '')} на этом герое<br><small>Ниже — начало таблицы региона.</small>`}</p>
        ${E.slice(a, a + 15).map((e, j) => { const one = (e.possible_account_ids || []).length === 1 ? e.possible_account_ids[0] : 0; return row(a + j + 1, one, e.account_name, '', one ? '' : 'аккаунт скрыт', a + j === (o ? o.i : -1)); }).join('') || '<div class="empty">Таблица пустая.</div>'}`;
    }
    b.innerHTML = `${html}<div class="hrk-nav"><button type="button" data-o="-15">▲ Выше</button><button type="button" data-o="0">К себе</button><button type="button" data-o="15">▼ Ниже</button></div>`;
  };
  ov.onclick = e => {
    if (e.target === ov || e.target.closest('.hrk-x')) return close();
    const s2 = e.target.closest('#hrks [data-s]'); if (s2) { mode = s2.dataset.s; off = 0; return draw(); }
    const nv = e.target.closest('.hrk-nav [data-o]'); if (nv) { off = +nv.dataset.o ? off + +nv.dataset.o : 0; return draw(); }
  };
  draw();
}

// ---------- графики: наведение (на телефоне — касание) показывает время и цифры ----------
let QCW = null;
function qcwHide() { if (!QCW) return; $$('.qm-cur,.qm-tip', QCW).forEach(x => x.hidden = true); QCW = null; }
addEventListener('pointermove', e => {
  const w = e.target.closest && e.target.closest('.qm-chw'); if (QCW && QCW !== w) qcwHide(); if (!w) return; QCW = w;
  const r = w.getBoundingClientRect(), fx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), cur = $('.qm-cur', w), tip = $('.qm-tip', w); if (!cur || !tip) return;
  let html = '';
  if (w.dataset.ld) { const o = w._d || (w._d = JSON.parse(w.dataset.ld)), t = Math.max(0, (fx - .03) / .94) * o.d, q = o.p.reduce((a, x) => Math.abs(x[0] - t) < Math.abs(a[0] - t) ? x : a, o.p[0]);
    html = `<small>${mmss(q[0])}</small>${q[1] ? `<b class="${q[1] > 0 ? 't0' : 't1'}">${esc(TEAMN[q[1] > 0 ? 0 : 1])} +${nf(Math.abs(q[1]))}</b>` : '<b>ровно</b>'}`; }
  else { const o = w._d || (w._d = JSON.parse(w.dataset.st)), t = Math.max(0, (fx * 1000 - 30) / 940) * o.d, q = o.r.reduce((a, x) => Math.abs(x[0] - t) < Math.abs(a[0] - t) ? x : a, o.r[0]);
    html = `<small>${mmss(q[0])} · душ в минуту</small>${o.g.map((g, i) => `<span><i style="background:${g[1]}"></i>${esc(g[0])}<b>${nf(q[i + 1])}</b></span>`).join('')}<span class="sum">Всего<b>${nf(q.slice(1).reduce((a, x) => a + x, 0))}</b></span>`; }
  cur.hidden = false; cur.style.left = (100 * fx) + '%'; tip.hidden = false; tip.innerHTML = html;
  tip.style.left = fx > .6 ? 'auto' : `calc(${(100 * fx).toFixed(1)}% + 12px)`; tip.style.right = fx > .6 ? `calc(${(100 - 100 * fx).toFixed(1)}% + 12px)` : 'auto';
}, {passive: true});
addEventListener('pointerleave', qcwHide);
