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
async function u10View(sel) {
  const n = vNew(); U10.wr = {};
  V(`<div class="u10"><div class="u10-hd"><h1 class="h1">Пат<em>чи</em></h1><div class="seg" id="utab"><button data-t="p" class="${U10.tab === 'p' ? 'on' : ''}">Патчи</button><button data-t="n" class="${U10.tab === 'n' ? 'on' : ''}">Новости</button></div></div><div id="upw"><div class="load">Загружаю патчноуты…</div></div></div>`);
  let P;
  try { P = U10.P || await apiU(API2 + 'patches'); } catch (e) { put(n, '#upw', `<div class="err">Не вышло: ${esc(e.message)}</div>`); return; }
  if (n !== VQ) return;
  P = U10.P = (P || []).slice().sort((a, b) => Date.parse(b.pub_date) - Date.parse(a.pub_date)).slice(0, 30);
  const idx = P.map((p, i) => i), isP = i => parsePatch(P[i]).patch;
  if (sel != null && sel !== '' && P[+sel]) U10.tab = isP(+sel) ? 'p' : 'n';
  const list = idx.filter(i => U10.tab === 'p' ? isP(i) : !isP(i)).slice(0, 12);
  if (!list.length) { put(n, '#upw', '<div class="empty">Пусто.</div>'); return; }
  let i = sel != null && sel !== '' && list.includes(+sel) ? +sel : list[0];
  const p = P[i], X = U10.X = parsePatch(p), t = Math.floor(Date.parse(p.pub_date) / 1000);
  const chips = `<div class="u10-pk">${list.map(k => `<a class="${k === i ? 'on' : ''}" href="#upd/${k}"><small>${esc(dmy(Math.floor(Date.parse(P[k].pub_date) / 1000)))}</small><b>${esc(upTr(P[k].title) || P[k].title || 'Без названия')}</b></a>`).join('')}</div>`;
  const ttl = upTr(p.title) || p.title || 'Обновление';
  if (!X.patch) {
    const paras = X.out.map(x => x.t === 'h' ? `<h3>${esc(upTr(x.s) || x.s)}</h3>` : `<p>${esc(upTr(x.s) || x.s)}</p>`).join('');
    put(n, '#upw', `${chips}<article class="q-box u10-art"><header><small>${esc(dmy(t))}</small><h2>${esc(ttl)}</h2></header>${X.imgs[0] ? `<img src="${esc(X.imgs[0])}" alt="" loading="lazy">` : ''}<div class="u10-tx">${paras}</div></article>`);
    $('#utab').onclick = u10Tab; return;
  }
  const G = u10Group(X), nh = Object.keys(G.H).length, ni = Object.keys(G.I).length;
  const cnt = M => { const o = {u: 0, d: 0, a: 0}; Object.values(M).forEach(L => o[u10Kind(L)]++); return o; }, CH = cnt(G.H);
  const draw = () => {
    put(n, '#upw', `${chips}<div class="u10-ph"><div><small>${esc(dmy(t))} · ${p.source === 'forum' ? 'форум разработчиков' : 'новости Steam'}</small><h2>${esc(ttl)}</h2></div>
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
function u10Tab(e) { const b = e.target.closest('[data-t]'); if (!b) return; U10.tab = b.dataset.t; const P = U10.P || []; const k = P.findIndex(p => (U10.tab === 'p') === !!parsePatch(p).patch); location.hash = '#upd/' + Math.max(0, k); }
viewUpd = async function (sel) { await upLoad(); return u10View(sel); };

// ---------- лайв-матч: карточки компактнее, больше меток; игры за 12 ч / 30 дней и его сборка — по наведению ----------
function pCard(p, en, thr, meId) {
  const wr = pc(p.hw, p.hm), per = (k, nm, o) => { const w = o && o.m ? Math.round(100 * o.w / o.m) : null;
    return `<button class="l10-pr${w == null ? ' off' : ''}" type="button" data-per="${k}" data-acc="${p.id}"${w == null ? ' disabled' : ''}><small>${nm}</small><b class="${w == null ? '' : w >= 50 ? 'win' : 'loss'}">${w == null ? '—' : w + '%'}</b><i>${o && o.m ? games(o.m) : 'не играл'}</i></button>`; };
  const tags = [thr ? ['h', 'Главная угроза', 'самый опасный по рангу и игре на герое'] : null, p.cn ? ['r', `Контрит тебя · ${p.cn}%`, 'твой герой против него побеждает реже'] : null, ...p.tags].filter(Boolean);
  return `<div class="q-pc l10${p.id === meId ? ' mine' : ''}${thr ? ' thr' : ''}">
    <div class="top"><img class="f" src="${esc(faceUrl(p.hid, p.mood))}" alt="" loading="lazy" onerror="this.onerror=null;this.src='${esc(hero(p.hid).i)}'"><span class="hn">${esc(hero(p.hid).n)}</span>${p.party ? `<i class="pty" style="background:${p.party.c}" title="друзья в Steam в одной команде — возможно, пати"></i>` : ''}
      <span class="l10-rk" title="${esc(rankOf(p.badge).name)}">${p.badge ? rankImg(p.badge, 'rk') : ''}</span></div>
    <div class="q-pb">${p.id ? `<a class="q-pc-n" href="?id=${p.id}#home"><span class="q-pnm">${esc(p.name)}</span></a>` : `<span class="q-pnm">${esc(p.name)}</span>`}<span class="l10-rn">${esc(rankOf(p.badge).name)}</span>
      <div class="l10-st"><span><small>на герое</small><b>${p.hm ? nf(p.hm) : '0'}${p.hm ? ` · <em class="${wrC(wr, p.hm)}">${wr}%</em>` : ''}</b></span><span><small>всего</small><b>${p.tm ? `${nf(p.tm)} · ${pc(p.tw, p.tm)}%` : '—'}</b></span></div>
      <div class="l10-per">${per('12', '12 ч', p.p12)}${per('30', '30 дн', p.p30)}</div>
      ${p.rc && p.rc.length ? `<div class="l10-rc">${p.rc.slice(0, 6).map(r => `<a href="#m/${r.mid}" class="${r.w ? 'w' : 'l'}" title="${esc(hero(r.hid).n)} · ${r.w ? 'победа' : 'поражение'} · ${r.kda}"><img src="${esc(hero(r.hid).i)}" alt="" loading="lazy" onerror="${noimg}"></a>`).join('')}</div>` : ''}
      <div class="q-pbld" id="pb-${p.id}"></div>
      <div class="tg">${tags.map(t => `<span class="tag ${t[0]}" title="${esc(t[2])}">${esc(t[1])}</span>`).join('')}</div></div></div>`;
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
        <small>${s < 10 ? 'редкая ветка — мало кто так играет' : `${c.L.length} ${pl(c.L.length, ['сборка', 'сборки', 'сборок'])}`}</small><span class="ic">${b0.items.slice(0, 6).map(id => `<img src="${esc(item(id).i)}" alt="" loading="lazy" onerror="${noimg}">`).join('')}</span></button>`; }).join('')}</div>
    ${share(cur) < 10 ? `<div class="b10-warn"><b>${CATI[HBC]} собирают только ${share(cur)}% игроков</b><span>Сборок мало, винрейт может врать — смотри с осторожностью.</span></div>` : ''}
    <div class="b10-rec c-${HBC}"><div class="b10-rl"><span>★ Рекомендуем</span><small>${rst ? `лучший винрейт среди популярных: <b>${f1(rwr)}%</b> на ${nf(rst.matches)} ${pl(rst.matches, ['игре', 'играх', 'играх'])}` : 'лучшая по винрейту'}</small></div>${bCard(rec, '')}</div>
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
    if (!top || !box || $('.p10-t.pty', box)) return;
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
        return `<${x.one ? `a href="?id=${x.one}#home"` : 'div'} class="lb10-pd p${k + 1}" style="--md:${medal[k]};--i:${k}">${h ? `<i class="bg" style="background-image:url('art/${h}.webp')"></i>` : '<i class="bg none"></i>'}<span class="pl">${k + 1}</span>
          <span class="lb10-pi"><b>${esc(x.e.account_name || 'Скрытый игрок')}</b><span class="rkc" data-acc="${x.one || ''}">${x.one ? '…' : '<span class="sub">аккаунт скрыт</span>'}</span><span class="his">${(x.e.top_hero_ids || []).slice(0, 3).map(h2 => face(h2, '', 's', hero(h2).n)).join('')}</span></span></${x.one ? 'a' : 'div'}>`; }).join('')}</div>` : '';
      const rows = (q ? F2 : F2.slice(3)).slice(0, LB2.n), more = (q ? F2 : F2.slice(3)).length - rows.length;
      put(n, '#lbb', `${pod}<div class="q-box lb10-l">${rows.map((x, j) => `<${x.one ? `a href="?id=${x.one}#home"` : 'div'} id="lb2-${x.i}" class="lb10-r${x.i === myI ? ' mine' : ''}${x.one ? '' : ' x'}" style="--i:${Math.min(j, 20)}"><span class="lb10-n${x.i < 10 ? ' t10' : ''}">${x.i + 1}</span>
          <span class="lb10-nm"><b>${esc(x.e.account_name || 'Скрытый игрок')}</b>${x.i === myI ? '<em>это ты</em>' : ''}</span>
          <span class="rkc" data-acc="${x.one || ''}">${x.one ? '<span class="sub">…</span>' : '<span class="sub">аккаунт скрыт</span>'}</span>
          <span class="his">${(x.e.top_hero_ids || []).slice(0, 4).map(h => face(h, '', 's', hero(h).n)).join('')}</span><span class="r9-go">${x.one ? '›' : ''}</span></${x.one ? 'a' : 'div'}>`).join('') || '<div class="empty">Никого не нашлось.</div>'}</div>
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
