// ===================== lg28 — 04.11 (ночь 7): лайв-матч внутри игры, без программы =====================
// Мод 0.23 открывает эту страницу во встроенном браузере игры: ?app=1&embed=1#g=<кто в матче>. Формат #g= — как у программы
// (v=…&s=m|h&gt=…&p=f~ник~герой~hero_id~account_id|e~…). Новый состав — мод меняет только #…, страница не перезагружается.
const RL_EMBED = /[?&]embed=1/.test(location.search);
if (RL_EMBED) document.documentElement.classList.add('rl-embed');
function u28Parse(h) {
  let q; try { q = new URLSearchParams(decodeURIComponent(h.replace(/^#g=/, ''))); } catch (e) { return null; }
  const dec = v => { try { return decodeURIComponent(v || ''); } catch (e) { return v || ''; } };
  const players = (q.get('p') || '').split('|').filter(Boolean).map(x => { const [t, n, hh, hid, a] = x.split('~');
    return {t: t === 'e' ? 'e' : 'f', n: dec(n).slice(0, 64), h: dec(hh).slice(0, 48), hid: +hid > 0 && +hid < 1000 ? +hid : 0, a: /^\d{3,10}$/.test(a || '') ? +a : 0}; }).slice(0, 16);
  const bots = players.filter(p => p.n && p.h && p.n.trim().toLowerCase() === p.h.trim().toLowerCase()).length;
  const s = q.get('s') !== 'm' || !players.length ? 'h' : bots >= 2 ? 'b' : 'm';
  return {v: (q.get('v') || '').slice(0, 12), s, bots, gt: (q.get('gt') || '').slice(0, 12), players, at: Date.now()};
}
function u28Take() {
  if (!/^#g=/.test(location.hash)) return false;
  const g = u28Parse(location.hash), k0 = OV.gk2; if (g && window.rlGame) window.rlGame(g);
  if (OV.gk2 !== k0) OV.L = null;   // новый состав — заново, иначе новая страница покажет старых игроков
  history.replaceState(null, '', location.pathname + location.search + '#live');
  return true;
}
{ const R28 = route; route = function () { u28Take(); return R28.apply(this, arguments); }; }
u28Take();
// игра не шлёт ничего, пока состав тот же — держим «свежим», чтобы лайв не решил, что матч кончился
if (RL_EMBED) setInterval(() => { if (OV.G) OV.G.at = Date.now(); }, 10000);
