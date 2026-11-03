// ===================== lg17 — 04.11: рейтинг героя из готовых таблиц (как League of Graphs) =====================
// Считает конвейер раз в сутки (tools/hr_build.py, GitHub Actions → ветка hr-data): тир каждой игры — средний ранг ВРАГОВ
// (ранговая — по рангам в матче, обычная — по рангам врагов на их аккаунтах), обычная игра = 0,4, 20+ игр, игра за 14 дней.
// Сайт только читает таблицу героя: место у всех в рейтинге, без «считаю…». Таблицы нет (GitHub недоступен) — старый расчёт (lg16).
const HRD_URL = 'https://raw.githubusercontent.com/1f8t8graf4-ai/dota-/hr-data/hr/', HRD = {};
const HR_LD = 45, HR_SD = 14;        // окна конвейера: «всё, что есть в базе» (около месяца) и последние 14 дней
function hrData(hid) {
  if (HRD[hid]) return HRD[hid];
  return (HRD[hid] = fetch(HRD_URL + hid + '.json').then(r => r.ok ? r.json() : null).then(d => {
    if (!d || !Array.isArray(d.id) || !d.id.length) return null;
    d.at = new Map(d.id.map((a, i) => [a, i])); HRD[hid].v = d; return d;
  }).catch(() => null));
}
const hrRow = (d, i) => ({pos: i + 1, v: d.p[i], m: Math.round(d.g[i]), badge: d.b[i], lg: 1, tot: d.n, dt: d.t,
  sc: {R: d.p[i], wr: d.wr[i], kda: d.kda[i], et: d.et[i], r: d.r[i], g: d.g[i]}});
// не в таблице — почему: давно не играл / мало игр / ещё не пересчитали
async function hrMiss(hid, id) {
  const day = now() - (now() % 86400), q = (t, rk) => SBQ(`hero_id=${hid}&sort_by=matches&min_matches=1&min_unix_timestamp=${t}&account_ids=${id}${rk ? '&match_mode=ranked' : ''}`).then(L => ((L || [])[0] || {}).matches || 0).catch(() => 0);
  const [g, r, s] = await Promise.all([q(day - HR_LD * 86400), q(day - HR_LD * 86400, 1), q(day - HR_SD * 86400)]);
  const gw = r + .4 * Math.max(0, g - r);
  if (!g) return {pos: 0, why: 'few', m: 0, ld: 1};
  if (!s) return {pos: 0, why: 'idle', m: g, sd: HR_SD};
  if (gw < HL_MIN) return {pos: 0, why: 'few', m: Math.floor(gw), ld: 1};
  return {pos: 0, why: 'soon', m: Math.floor(gw)};
}
{ const HR1 = heroRating; heroRating = function (hid, id) {
    const k = 'd' + hid + '|' + id; if (HRL[k]) return HRL[k];
    return (HRL[k] = (async () => {
      const d = await hrData(hid); if (!d) return HR1(hid, id);
      const i = d.at.get(+id);
      return i != null ? hrRow(d, i) : hrMiss(hid, id);
    })());
  }; }
{ const HL1 = hlRows; hlRows = async function (hid, start, n) {
    const d = await hrData(hid); if (!d) return HL1(hid, start, n);
    const L = []; for (let i = start - 1; i < Math.min(d.n, start - 1 + n); i++) L.push({rank: i + 1, account_id: d.id[i], matches: Math.round(d.g[i]), badge: d.b[i], R: d.p[i], wr: d.wr[i], kda: d.kda[i]});
    return L;
  }; }
{ const HT1 = heroTotal; heroTotal = hid => hrData(hid).then(d => d ? d.n : HT1(hid)); }
// как считаем — по правилам League of Graphs, с датой пересчёта
hlHow = function (hid) {
  return `<details class="l16-how"><summary>Как считаем — как League of Graphs</summary><ul>
    <li><b>Ранг игры</b> — средний ранг врагов в этом матче. Тир выше = ×5 к очкам</li>
    <li>В обычной игре ранга нет — берём ранги врагов с их аккаунтов. Обычная игра = 0,4 ранговой</li>
    <li><b>Винрейт</b> на ${esc(hero(hid).n)} в 1,5 раза выше среднего = ×2</li>
    <li><b>KDA</b> вдвое выше среднего = ×3</li>
    <li>Чем ниже ранг, тем меньше весят винрейт и KDA: каждый тир ниже Eternus — ×0,6</li>
    <li>Нужно 20+ игр за месяц и хоть одна за ${HR_SD} дней. До 80 игр — небольшой штраф; меньше 5 за ${HR_SD} дней — ×0,5 за каждую</li>
    <li>Два счёта: за месяц и за ${HR_SD} дней, месяц весит 3/4</li>
    <li class="sub">Пересчёт раз в сутки${hrDate(hid)}</li></ul></details>`;
};
function hrDate(hid) { const d = HRD[hid] && HRD[hid].v; return d && d.t ? ' · последний — ' + new Date(d.t * 1000).toLocaleString('ru-RU', {day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'}) : ''; }
