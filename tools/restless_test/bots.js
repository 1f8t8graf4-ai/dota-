// Лобби с ботами не считается матчем (программа 0.4.3, bridge.js): бот зовётся как его герой — два таких и больше → s='b'.
// node tools/restless_test/bots.js
const b = require('../../restless/app/bridge.js');
const u = p => '/rl.png?v=0.16&s=m&p=' + p.map(x => x.map(encodeURIComponent).join('~')).join('|');
let ok = true; const chk = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); ok = ok && c; };
const real = b.parse(u([['f', 'Ленин', 'Селеста', 50, 1], ['e', 'Васян', 'Абрамс', 6, 2], ['e', 'Петя', 'Инфернус', 1, 3]]));
const one = b.parse(u([['f', 'Ленин', 'Селеста', 50, 1], ['e', 'Рэм', 'Рэм', 79, 2]]));
const bot = b.parse(u([['f', 'Ленин', 'Селеста', 50, 1], ['f', 'Инфернус', 'Инфернус', 1, 0], ['e', 'Абрамс', 'Абрамс', 6, 0], ['e', 'Рэм', 'Рэм', 79, 0]]));
chk(real.s === 'm', 'обычный матч — матч');
chk(one.s === 'm', 'один игрок с ником как у героя — всё равно матч');
chk(bot.s === 'b' && bot.bots === 3, 'лобби с ботами — не матч (' + bot.bots + ' ботов)');
process.exit(ok ? 0 : 1);
