// ==================== 02.11 · доделки сайта: вид сайта — в настройках, коуч в профиле, задание проверяется само ====================

// 1. Вид сайта больше не висит плашкой поверх страниц — он в «Настройках» (шестерёнка). ?skin= в адресе работает как раньше.
{
  const SH0 = settingsHTML;
  settingsHTML = function () {
    let cur = ''; try { cur = localStorage.getItem('rl-skin') || ''; } catch (e) {}
    const blk = `<div class="set set-skin"><div><b>Вид сайта</b><small>раскладка та же, меняется оформление</small></div>
      <div class="seg" id="skseg">${SKINS.map(([id, n]) => `<button type="button" data-sk="${id}" class="${id === cur ? 'on' : ''}">${n}</button>`).join('')}</div></div>`;
    const s = SH0(); const i = s.indexOf('<p class="note">');
    return i > 0 ? s.slice(0, i) + blk + s.slice(i) : s;
  };
  document.addEventListener('click', e => { const b = e.target.closest('#skseg [data-sk]'); if (!b) return; skinSet(b.dataset.sk); $$('#skseg [data-sk]').forEach(x => x.classList.toggle('on', x === b)); });
}

// 2. Разбор матча без открытия страницы матча: собрать то же, что viewMatch2 кладёт в MX
function coBuildX(md, mid) {
  const mi = md.match_info, P = mi.players.slice().sort((a, b) => teamOf(a.team) - teamOf(b.team) || a.player_slot - b.player_slot);
  const X = {n: 0, mid: +mid, mi, P, A: mAnalyze(mi), dur: mi.duration_s || 0, win: teamOf(mi.winning_team), meP: null, M: new Map(), PT: mPaths(mi), IS: {}};
  P.forEach(p => X.M.set(p, mMet(X, p)));
  return X;
}
function coWith(X, f) { const keep = MX; MX = X; try { return f(); } finally { MX = keep; } }

// 3. Коуч в профиле: задание и его проверка по следующим трём матчам — сама, без открытия каждого матча
const COP = {busy: 0};
function coProfHTML(id, H) {
  const T = coTask(), mine = T && T.aid === id ? T : null, last = H[0];
  const lastW = last && last.player_team === last.match_result;
  const lastRow = last ? `<a class="qkc-last" href="#m/${last.match_id}"><span>${heroImg ? heroImg(last.hero_id) : ''}</span><span><b>Разбор последнего матча</b><small>${esc(hero(last.hero_id).n)} · <span class="${lastW ? 'win' : 'loss'}">${lastW ? 'победа' : 'поражение'}</span> · ${last.player_kills}/${last.player_deaths}/${last.player_assists} · ${esc(ago(last.start_time))}</small></span><em>Коуч ›</em></a>` : '';
  if (!mine) return `<section class="q-box qkc"><div class="qk-h">Коуч Restless</div>${lastRow}
    <p class="qkc-t">Открой разбор своего матча, возьми задание на 3 игры — здесь будет видно, получается ли. Проверка идёт сама по следующим матчам.</p></section>`;
  const g = Object.values(mine.g || {}).slice(0, 3), ok = g.filter(Boolean).length, done = g.length >= 3;
  const cells = [0, 1, 2].map(i => g[i] == null ? `<span${i === g.length && COP.busy ? ' class="run"' : ''}>игра ${i + 1}${i === g.length && COP.busy ? ' · проверяю…' : ''}</span>` : `<span class="${g[i] ? 'ok' : 'no'}">игра ${i + 1} ${g[i] ? '✓' : '✗'}</span>`).join('');
  const verdict = done ? (ok >= 2 ? `Получилось в ${ok} из 3 игр — привычка закрепляется. Можно брать следующее задание в новом разборе.` : `Получилось в ${ok} из 3. Не страшно: возьми это же задание ещё раз — с первого раза мало у кого выходит.`) : `Сыграно ${g.length} из 3. Следующие матчи проверю сам.`;
  return `<section class="q-box qkc"><div class="qk-h">Коуч Restless · твоё задание</div>
    <div class="qkc-task"><b>${esc(mine.n)}</b><div class="co-gs">${cells}</div><p class="qkc-t">${verdict}</p>
    <div class="qkc-b">${done ? '<button class="co-tb alt" data-qkc="drop">Убрать задание</button>' : '<button class="co-tb alt" data-qkc="drop">Отказаться</button>'}</div></div>${lastRow}</section>`;
}
async function coProfCheck(id, H) {
  const T = coTask(); if (!T || T.aid !== id || COP.busy) return;
  T.g = T.g || {};
  const todo = H.filter(m => m.start_time > T.since && !(m.match_id in T.g)).sort((a, b) => a.start_time - b.start_time);
  const need = 3 - Object.keys(T.g).length; if (need <= 0 || !todo.length) return;
  COP.busy = 1; coProfDraw(id, H);
  for (const m of todo.slice(0, need)) {
    let md = null; try { md = await api('matches/' + m.match_id + '/metadata'); } catch (e) { break; }
    if (!md || !md.match_info) continue;
    const X = coBuildX(md, m.match_id), p = X.P.find(q => q.account_id === id); if (!p) continue;
    const r = coWith(X, () => { const F = coFacts(p), P = coProblems(F).find(x => x.k === T.k); return P ? !!P.chk(F) : coTaskChk(T.k, F, T.h); });
    const T2 = coTask(); if (!T2 || T2.aid !== id) break; T2.g = T2.g || {}; T2.g[m.match_id] = r; coTaskSave(T2); Object.assign(T, T2);
    coProfDraw(id, H);
  }
  COP.busy = 0; coProfDraw(id, H);
}
function coProfDraw(id, H) {
  const el = $('#qkco'); if (!el) return;
  el.innerHTML = coProfHTML(id, H);
}
{
  const VH0 = viewHome;
  viewHome = async function () {
    await VH0.apply(this, arguments);
    if (!PROF || !PROF.H || !PROF.H.length || !$('.qk')) return;
    const id = PROF.id, H = PROF.H, box = document.createElement('div'); box.id = 'qkco';
    const qk = $('.qk'); qk.parentNode.insertBefore(box, qk.nextSibling);
    coProfDraw(id, H);
    box.addEventListener('click', e => { const b = e.target.closest('[data-qkc]'); if (!b) return; if (b.dataset.qkc === 'drop') { coTaskSave(null); coProfDraw(id, H); } });
    coProfCheck(id, H);
  };
}
