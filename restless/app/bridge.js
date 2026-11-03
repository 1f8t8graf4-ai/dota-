// Restless — приём данных от мода. Мод в игре «грузит картинку» http://127.0.0.1:27515/rl.png?…: в адресе команда, ник, герой
// и ID каждого из 12 игроков (так же QoL Lock переводит чат через 127.0.0.1:8765). Отвечаем прозрачной картинкой 1×1.
// Слушаем только 127.0.0.1 — с других компьютеров сюда не достучаться.
const http = require('http');
const PORT = 27515;
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');

// v=0.13&s=m|h&p=f~ник~герой~hero_id~account_id|e~…&gt=12:34&n=7
function parse(url) {
  const u = new URL(url, 'http://127.0.0.1');
  const q = k => u.searchParams.get(k) || '';
  const players = q('p').split('|').filter(Boolean).map(x => {
    const [t, n, h, hid, a] = x.split('~');
    return {t: t === 'e' ? 'e' : 'f', n: dec(n).slice(0, 64), h: dec(h).slice(0, 48), hid: +hid > 0 && +hid < 1000 ? +hid : 0, a: /^\d{3,10}$/.test(a || '') ? +a : 0};
  }).slice(0, 16);
  // лобби с ботами (Андрей, 04.11: «находит матч, когда мы в лобби с ботом»): бот зовётся как его герой — два таких и больше → не матч
  const bots = players.filter(p => p.n && p.h && p.n.trim().toLowerCase() === p.h.trim().toLowerCase()).length;
  const s = q('s') !== 'm' ? 'h' : bots >= 2 ? 'b' : 'm';
  return {v: q('v').slice(0, 12), s, bots, gt: q('gt').slice(0, 12), n: +q('n') || 0, players, at: Date.now()};
}
function dec(s) { try { return decodeURIComponent(s || ''); } catch (e) { return String(s || ''); } }

// onData(g) — на каждый запрос мода. Возвращает сервер (или null, если порт занят — тогда onErr).
function start(onData, onErr) {
  const srv = http.createServer((req, res) => {
    if (req.url.startsWith('/rl.png')) {
      try { onData(parse(req.url)); } catch (e) {}
      res.writeHead(200, {'Content-Type': 'image/png', 'Content-Length': PNG.length, 'Cache-Control': 'no-store'});
      return res.end(PNG);
    }
    if (req.url === '/ping') { res.writeHead(200, {'Content-Type': 'text/plain'}); return res.end('restless'); }
    res.writeHead(404); res.end();
  });
  srv.on('error', e => onErr && onErr(e));
  srv.listen(PORT, '127.0.0.1');
  return srv;
}

module.exports = {PORT, parse, start};
