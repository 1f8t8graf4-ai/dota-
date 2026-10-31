// Restless — свой сервер перед открытым API Deadlock (api.deadlock-api.com).
// Зачем: API на первом запросе истории игрока собирает её из Steam — 10–20 секунд. Сервер держит у себя
// последние ответы по игрокам (D1) и отдаёт их сразу, а свежие тянет в фоне. Раз в 5 минут (cron) сам
// обновляет историю и ранг тех, кто заходил за неделю, — поэтому и первый заход на любом устройстве быстрый.
//
// Как включить (Cloudflare, один раз):
//  1) Workers & Pages → Create → Worker, имя `restless` → Deploy → Edit code → вставить этот файл → Deploy.
//  2) Storage & Databases → D1 → Create, имя `restless`.
//  3) Воркер restless → Settings → Bindings → Add → D1 database: имя переменной `DB`, база `restless`.
//  4) Settings → Triggers → Cron Triggers → Add: `*/5 * * * *`.
//  Проверка: https://restless.<поддомен>.workers.dev/health → {"ok":true,...}. Сайт найдёт сервер сам.
//
// Ходит только в api.deadlock-api.com и только за данными игроков (белый список ниже). Ключей и секретов нет.

const UP = 'https://api.deadlock-api.com/v1/';
// что проксируем и сколько секунд ответ считается свежим (старше — отдаём сразу, свежее тянем в фоне)
const RULES = [
  [/^players\/\d+\/match-history$/, 120],
  [/^players\/\d+\/rank$/, 120],
  [/^players\/hero-stats\?account_ids=[\d,]+$/, 600],
  [/^players\/rank\?account_ids=[\d,]+$/, 300],
  [/^players\/steam\?account_ids=[\d,]+$/, 6 * 3600],
  [/^players\/\d+\/(mate|enemy)-stats\?min_matches_played=\d+$/, 3600],
  [/^matches\/active\?account_id=\d+$/, 20],
];
const KEEP = 14 * 86400; // дольше не храним
const CORS = {'access-control-allow-origin': '*', 'access-control-expose-headers': 'x-rl, x-rl-age', 'access-control-allow-methods': 'GET, OPTIONS', 'access-control-max-age': '86400'};
const now = () => Math.floor(Date.now() / 1000);
const ruleOf = p => (RULES.find(r => r[0].test(p)) || [])[1] || 0;

let READY = null;
function ready(db) {
  if (!READY) READY = db.batch([
    db.prepare('CREATE TABLE IF NOT EXISTS blob (k TEXT PRIMARY KEY, t INTEGER NOT NULL, z BLOB NOT NULL)'),
    db.prepare('CREATE TABLE IF NOT EXISTS track (id INTEGER PRIMARY KEY, seen INTEGER NOT NULL, ref INTEGER NOT NULL DEFAULT 0)'),
    db.prepare('CREATE INDEX IF NOT EXISTS track_ref ON track (ref)'),
  ]).catch(e => { READY = null; throw e; });
  return READY;
}
async function gz(data) { const s = new Blob([data]).stream().pipeThrough(new CompressionStream('gzip')); return new Uint8Array(await new Response(s).arrayBuffer()); }
async function gunz(buf) { const s = new Blob([buf]).stream().pipeThrough(new DecompressionStream('gzip')); return new Response(s).text(); }

// ответ сверху берём сжатым как есть (не распаковываем — бережём 10 мс процессора бесплатного плана);
// если пришёл несжатым — жмём сами. Храним и отдаём gzip.
const isGz = b => b.length > 2 && b[0] === 0x1f && b[1] === 0x8b;
async function upstream(p) {
  const r = await fetch(UP + p, {headers: {'user-agent': 'restless-cache (github.com/1f8t8graf4-ai/dota-)', accept: 'application/json', 'accept-encoding': 'gzip'}, encodeResponseBody: 'manual'});
  const b = new Uint8Array(await r.arrayBuffer());
  if (!r.ok) { const e = new Error('upstream ' + r.status); e.status = r.status; e.body = (isGz(b) ? await gunz(b) : new TextDecoder().decode(b)).slice(0, 300); throw e; }
  return isGz(b) ? b : gz(b);
}
async function store(db, p, z) {
  if (db && z.length < 1.9e6) await db.prepare('INSERT INTO blob (k, t, z) VALUES (?1, ?2, ?3) ON CONFLICT(k) DO UPDATE SET t = ?2, z = ?3').bind(p, now(), z).run();
}
async function refresh(db, p) { const z = await upstream(p); await store(db, p, z); return z; }
const IN_FLIGHT = new Map(); // один запрос наверх на ключ внутри одного воркера
function once(db, p) { if (!IN_FLIGHT.has(p)) { const pr = refresh(db, p).finally(() => IN_FLIGHT.delete(p)); IN_FLIGHT.set(p, pr); } return IN_FLIGHT.get(p); }

function gzResp(z, extra) { return new Response(z, {headers: {'content-type': 'application/json; charset=utf-8', 'content-encoding': 'gzip', 'cache-control': 'no-store', vary: 'accept-encoding', ...CORS, ...(extra || {})}, encodeBody: 'manual'}); }
function json(body, extra) { return new Response(body, {headers: {'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...CORS, ...(extra || {})}}); }

async function handle(req, env, ctx) {
  const url = new URL(req.url);
  if (req.method === 'OPTIONS') return new Response(null, {headers: CORS});
  if (req.method !== 'GET') return new Response('GET only', {status: 405, headers: CORS});
  const db = env.DB || null;
  if (url.pathname === '/' || url.pathname === '/health') {
    let n = null, tr = null;
    if (db) { try { await ready(db); n = (await db.prepare('SELECT COUNT(*) c FROM blob').first()).c; tr = (await db.prepare('SELECT COUNT(*) c FROM track WHERE seen > ?').bind(now() - 7 * 86400).first()).c; } catch (e) { n = 'ошибка базы: ' + e.message; } }
    return json(JSON.stringify({ok: true, name: 'restless', db: !!db, stored: n, tracked7d: tr, rules: RULES.length}));
  }
  if (!url.pathname.startsWith('/v1/')) return new Response('not found', {status: 404, headers: CORS});
  const p = url.pathname.slice(4) + url.search;
  const fresh = ruleOf(p);
  if (!fresh) return new Response('not allowed', {status: 404, headers: CORS});
  if (db) ctx.waitUntil(ready(db).then(() => track(db, p)).catch(() => {}));
  // из базы: свежее — сразу; старое — сразу и обновить в фоне
  if (db) {
    try {
      await ready(db);
      const row = await db.prepare('SELECT t, z FROM blob WHERE k = ?').bind(p).first();
      if (row) {
        const age = now() - row.t;
        if (age >= fresh) ctx.waitUntil(once(db, p).catch(() => {}));
        return gzResp(new Uint8Array(row.z), {'x-rl-age': String(age), 'x-rl': age >= fresh ? 'stale' : 'hit'});
      }
    } catch (e) { /* база недоступна — идём наверх */ }
  }
  try { const z = await once(db, p); return gzResp(z, {'x-rl': 'miss'}); }
  catch (e) { return new Response(e.body || e.message, {status: e.status || 502, headers: {'content-type': 'application/json', ...CORS}}); }
}
// кого обновлять заранее: тех, чью историю открывали за неделю
async function track(db, p) {
  const m = p.match(/^players\/(\d+)\/match-history$/); if (!m) return;
  await db.prepare('INSERT INTO track (id, seen, ref) VALUES (?1, ?2, ?2) ON CONFLICT(id) DO UPDATE SET seen = ?2').bind(+m[1], now()).run();
}
async function cron(env) {
  const db = env.DB; if (!db) return;
  await ready(db);
  // 12 игроков за раз (по 2 запроса — история и ранг) — в лимит 50 подзапросов бесплатного плана с запасом
  const L = (await db.prepare('SELECT id FROM track WHERE seen > ?1 AND ref < ?2 ORDER BY ref ASC LIMIT 12').bind(now() - 7 * 86400, now() - 240).all()).results || [];
  await Promise.all(L.map(async ({id}) => {
    await Promise.all([refresh(db, `players/${id}/match-history`).catch(() => {}), refresh(db, `players/${id}/rank`).catch(() => {})]);
    await db.prepare('UPDATE track SET ref = ? WHERE id = ?').bind(now(), id).run();
  }));
  // уборка раз в час
  if (new Date().getUTCMinutes() < 5) {
    await db.prepare('DELETE FROM blob WHERE t < ?').bind(now() - KEEP).run();
    await db.prepare('DELETE FROM track WHERE seen < ?').bind(now() - 30 * 86400).run();
  }
}

export default {
  fetch: (req, env, ctx) => handle(req, env, ctx),
  scheduled: (ev, env, ctx) => ctx.waitUntil(cron(env)),
};
