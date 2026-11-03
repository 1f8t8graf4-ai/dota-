// ===================== lg20 — 04.11 (ночь): лайв-матч строками, «≈ ранг» у тех, у кого ранга нет, сайт сам обновляется =====================
// Андрей: «супер неудобный лайв-матч», «почему нет почти тегов», «почему нет ранга нигде», «пишется ещё 18 игр».

// ---------- таблицы рейтинга героя: raw.githubusercontent бывает закрыт (Россия) — тот же файл через jsDelivr ----------
const HRD_ALT = 'https://cdn.jsdelivr.net/gh/1f8t8graf4-ai/dota-@hr-data/hr/';
const fetchT = (u, ms, o) => { const c = new AbortController(), t = setTimeout(() => c.abort(), ms); return fetch(u, Object.assign({signal: c.signal}, o || {})).finally(() => clearTimeout(t)); };
hrData = function (hid) {
  if (HRD[hid]) return HRD[hid];
  const get = u => fetchT(u + hid + '.json', 7000).then(r => r.ok ? r.json() : null).catch(() => null);
  return (HRD[hid] = get(HRD_URL).then(d => d && Array.isArray(d.id) ? d : get(HRD_ALT)).then(d => {
    if (!d || !Array.isArray(d.id) || !d.id.length) return null;
    d.at = new Map(d.id.map((a, i) => [a, i])); HRD[hid].v = d; return d;
  }));
};

// ---------- «≈ ранг»: у кого ранга нет (не играет ранговые) — уровень его игр по рангам соперников за 45 дней ----------
// ранговая — ранги соперников в самом матче, обычная — их последний ранг; одним SQL на всех (~15 с), помним 12 ч
const EST = {};
const estSql = ids => `WITH m AS (SELECT account_id a, match_id, team FROM match_player WHERE start_time > now() - INTERVAL 45 DAY AND account_id IN (${ids.join(',')}) AND match_mode IN ('Ranked','Unranked')),
o AS (SELECT match_id, team, account_id, player_rank_initial_display_rank r FROM match_player WHERE start_time > now() - INTERVAL 45 DAY AND match_id IN (SELECT match_id FROM m)),
R AS (SELECT account_id, arg_max(player_rank_initial_display_rank, start_time) rk FROM match_player WHERE start_time > now() - INTERVAL 60 DAY AND match_mode='Ranked' AND player_rank_initial_display_rank > 0 AND account_id IN (SELECT account_id FROM o WHERE coalesce(r, 0) = 0) GROUP BY 1),
e AS (SELECT m.a a, coalesce(nullif(o.r, 0), R.rk) b FROM m JOIN o ON o.match_id = m.match_id AND o.team <> m.team LEFT JOIN R ON R.account_id = o.account_id)
SELECT a, avg(floor(b/10) + (b%10 - 1)/6.0) t, count(*) n FROM e WHERE b > 0 GROUP BY 1`;
const tierBadge = t => { const k = Math.max(1, Math.min(11, Math.floor(t))); return k * 10 + Math.max(1, Math.min(6, Math.round((t - k) * 6) + 1)); };
let ESTQ = null;
function estRanks(ids) {
  const out = {}, need = [];
  ids.filter(Boolean).map(Number).forEach(id => {
    if (EST[id] !== undefined) { out[id] = EST[id]; return; }
    try { const c = JSON.parse(localStorage.getItem('rl-est-' + id) || 'null'); if (c && c.t > Date.now() - 12 * 3600e3) { out[id] = EST[id] = c.b; return; } } catch (e) {}
    need.push(id);
  });
  if (!need.length) return Promise.resolve(out);
  const run = () => fetchT(API + 'sql?query=' + encodeURIComponent(estSql(need.slice(0, 24))), 70000).then(r => r.ok ? r.json() : null).catch(() => null);
  return (ESTQ = (ESTQ || Promise.resolve()).then(run).then(L => {
    if (!Array.isArray(L)) return out;   // не ответил — не запоминаем, спросим в следующий раз
    const by = {}; L.forEach(x => { if (x.n >= 8) by[x.a] = tierBadge(x.t); });
    need.slice(0, 24).forEach(id => { EST[id] = by[id] || 0; out[id] = EST[id]; try { localStorage.setItem('rl-est-' + id, JSON.stringify({t: Date.now(), b: EST[id]})); } catch (e) {} });
    return out;
  }));
}
const estTitle = 'Без ранга: уровень его игр по рангам соперников за 45 дней';
function estFill() {
  const L = $$('[data-est]:not([data-ok])'), P = $$('.p11-rkm[data-aid]:not([data-est-ok])').filter(x => x.querySelector('.p11-nr'));
  const ids = [...new Set(L.map(x => +x.dataset.est).concat(P.map(x => +x.dataset.aid)).filter(Boolean))];
  if (!ids.length) return;
  L.forEach(x => x.dataset.ok = '1'); P.forEach(x => x.dataset.estOk = '1');
  estRanks(ids).then(E => {
    L.forEach(x => { const b = E[+x.dataset.est]; if (!b) return; x.classList.add('on'); x.title = estTitle; x.innerHTML = `${rankImg(b, 'rk')}<b>≈ ${esc(rankOf(b).name)}</b>`; });
    P.forEach(x => { const b = E[+x.dataset.aid]; if (!b) return; const nr = x.querySelector('.p11-nr'); if (nr) nr.outerHTML = rankImg(b, 'rk l20-est');
      const t = x.querySelector('b'), s = x.querySelector('small'); if (t) { t.textContent = '≈ ' + rankOf(b).name; t.style.color = rankOf(b).color; } if (s) s.textContent = 'Без ранга · уровень игр'; x.title = estTitle; });
  });
}
{ let tm = 0; new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(estFill, 500); }).observe(document.body, {childList: true, subtree: true}); }

// ---------- метки: мягче пороги и новые, чтобы у обычного игрока было что сказать ----------
function moreTags(p) {
  const T = p.tags || (p.tags = []), has = s => T.some(t => String(t[1]).startsWith(s)), add = (c, s, d) => { if (!has(s)) T.push([c, s, d]); };
  const wr = p.hm ? p.hw / p.hm : 0, p30 = p.p30 || {m: 0, w: 0, hs: []}, p12 = p.p12 || {m: 0, w: 0}, w30 = p30.m ? p30.w / p30.m : 0, nh = (p30.hs || []).length;
  if (p.hm >= 10 && p.hm < 20 && p.tm && p.hm / p.tm >= .3) add('a', 'Мейн героя', `${pc(p.hm, p.tm)}% всех его игр — на этом герое`);
  if (p.hm >= 8 && wr >= .65) add('g', 'Сильный на герое', `${pc(p.hw, p.hm)}% побед на герое`);
  if (p.hm >= 8 && wr <= .35) add('r', 'Слабый на герое', `${pc(p.hw, p.hm)}% побед на герое`);
  if (p.hm >= 5 && p.kda >= 4.5) add('g', 'Высокий KDA', `KDA ${f1(p.kda)} на герое`);
  if (p.hm >= 5 && p.kda > 0 && p.kda <= 1.5) add('r', 'Низкий KDA', `KDA ${f1(p.kda)} на герое`);
  if (p.hm >= 1 && p.hm <= 5 && p.tm >= 10 && !has('Почти не играл') && !has('Первый раз')) add('r', 'Учит героя', `${games(p.hm)} на герое`);
  if (p30.m >= 10 && p30.m < 20 && w30 >= .65) add('g', 'В форме', `${pc(p30.w, p30.m)}% побед за 30 дней`);
  if (p30.m >= 10 && p30.m < 20 && w30 <= .35) add('r', 'Не в форме', `${pc(p30.w, p30.m)}% побед за 30 дней`);
  if (p12.m >= 3 && p12.w / p12.m >= .75) add('g', 'Сегодня в ударе', `${p12.w} из ${games(p12.m)} за 12 часов`);
  if (nh >= 8) add('b', 'Много героев', `${nh} героев за 30 дней`);
  else if (p30.m >= 15 && nh && nh <= 2) add('a', 'Узкий пул', `${nh === 1 ? 'один герой' : 'два героя'} за 30 дней`);
  if (p.tm >= 1500) add('b', 'Ветеран', `${nf(p.tm)} игр всего`);
}
{ const S0 = scout2; scout2 = async function (players, ctx) { const L = await S0(players, ctx); (L || []).forEach(p => { try { moreTags(p); } catch (e) {} }); return L; }; }

// ---------- лайв-матч: одна строка на игрока, все 12 на одном экране ----------
pCard = function (p, en, thr, meId) {
  const h = hero(p.hid), wr = pc(p.hw, p.hm);
  const per = (k, nm, o) => { const w = o && o.m ? Math.round(100 * o.w / o.m) : null;
    return `<button class="l20-pr${w == null ? ' off' : ''}" type="button" data-per="${k}" data-acc="${p.id}"${w == null ? ' disabled' : ''}><small>${nm}</small><b class="${w == null ? '' : w >= 50 ? 'win' : 'loss'}">${w == null ? '—' : w + '%'}</b><i>${o && o.m ? nf(o.m) : ''}</i></button>`; };
  const tags = [thr ? ['h', 'Главная угроза', 'самый опасный по рангу и игре на герое'] : null, p.cn ? ['r', `Контрит тебя · ${p.cn}%`, 'твой герой против него побеждает реже'] : null, ...(p.tags || [])].filter(Boolean);
  const rk = p.badge ? `<span class="l20-rk" title="${esc(rankOf(p.badge).name)}">${rankImg(p.badge, 'rk')}<b>${esc(rankOf(p.badge).name)}</b></span>`
    : p.id ? `<span class="l20-rk est" data-est="${p.id}"><b>без ранга</b></span>` : '<span class="l20-rk"><b>нет профиля</b></span>';
  return `<div class="l20-r${p.id === meId ? ' mine' : ''}${thr ? ' thr' : ''}">
    <div class="l20-h"><img class="f" src="${esc(faceUrl(p.hid, p.mood))}" alt="" loading="lazy" onerror="this.onerror=null;this.src='${esc(h.i)}'">${p.party ? `<i class="pty" style="background:${p.party.c}" title="друзья в Steam в одной команде — возможно, пати"></i>` : ''}
      <span><b>${esc(h.n)}</b>${p.id && p.hm ? `<small class="l13-hr" data-hr="${p.hid}|${p.id}" data-nm="${esc(p.name || '')}"></small>` : ''}</span></div>
    <div class="l20-n">${p.id ? `<a href="?id=${p.id}#home">${esc(p.name)}</a>` : `<span>${esc(p.name)}</span>`}${rk}</div>
    <div class="l20-hs"><small>на герое</small><b>${p.hm ? `${nf(p.hm)} · <em class="${wrC(wr, p.hm)}">${wr}%</em>` : '0'}</b><i>${p.hm ? 'KDA ' + f1(p.kda) : ''}</i></div>
    ${per('30', '30 дн', p.p30)}${per('12', '12 ч', p.p12)}
    <div class="l20-rc">${(p.rc || []).slice(0, 6).map(r => `<a href="#m/${r.mid}" class="${r.w ? 'w' : 'l'}" title="${esc(hero(r.hid).n)} · ${r.w ? 'победа' : 'поражение'} · ${r.kda}"><img src="${esc(hero(r.hid).i)}" alt="" loading="lazy" onerror="${noimg}"></a>`).join('')}</div>
    <div class="l20-tg">${tags.slice(0, 6).map(t => `<span class="tag ${t[0]}" title="${esc(t[2])}">${esc(t[1])}</span>`).join('')}<div class="q-pbld" id="pb-${p.id}"></div></div></div>`;
};

// ---------- сайт сам обновляется: вышла новая версия — перезагрузить (окно программы живёт часами) ----------
{ let tag0 = null;
  const head = () => fetchT(location.pathname + '?v=' + Date.now(), 8000, {method: 'HEAD', cache: 'no-store'}).then(r => r.ok ? (r.headers.get('etag') || r.headers.get('last-modified') || '') : '').catch(() => '');
  const busy = () => { const a = document.activeElement; return document.visibilityState === 'visible' && a && /INPUT|TEXTAREA|SELECT/.test(a.tagName); };
  const chk = async () => {
    if (!/^https?:/.test(location.protocol)) return;
    const t = await head(); if (!t) return;
    if (tag0 == null) { tag0 = t; return; }
    if (t !== tag0 && !busy()) location.reload();
  };
  setTimeout(chk, 5000); setInterval(chk, 10 * 60e3);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') chk(); });
}
