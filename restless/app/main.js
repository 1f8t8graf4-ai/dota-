// Restless Overlay 0.5.0 — Ctrl+Alt+H теперь у мода (окно Restless прямо в игре): программа её не берёт (своя — Ctrl+Shift+H) и сама на матче не открывается —
// у Андрея на Ctrl+Alt+H вылезали два окна сразу, программа — со старым матчем, и грузила систему.
// Restless Overlay 0.4.9 — мод проверяется каждые 20 мин и сразу после выхода из игры; Restless новее нашего в папке модов не заменяем старым.
// Restless Overlay 0.4.8 — настройки мода с сайта («Оверлей» → мод в игре через 127.0.0.1/cfg.html) и «Моды рядом» (настройки модов с протоколом UMM).
// 0.4.7 — окно шире (1600×960, на маленьком экране — почти во весь), чтобы команда стояла в один ряд, а обе команды — на экране.
// Restless Overlay 0.4.6 — сайт в окне всегда свежий (без старого кэша), матч нашёлся — окно на «Лайв-матче» (игроки из игры).
// Restless Overlay 0.4.5 — мод обновляется сам (pak42 с сайта); о новой программе — подсказка в трее.
// Restless Overlay 0.3.1 — твой профиль Restless поверх Deadlock (как Porofessor).
// Одна клавиша — Ctrl+Alt+H (Андрей, 03.11: «зачем Ctrl+X, если всё на Ctrl+H»): открыть / закрыть окно, и в игре, и без неё.
// В окне сайт целиком — профиль, лайв-матч, герои, вкладка «Оверлей». Нашёлся матч — окно само на 12 игроках, значок в трее «оживает» (LIVE).
// Закрыть — та же клавиша, ✕ сверху или Esc.
// Кто в матче, говорит сама игра: мод Restless шлёт игроков на 127.0.0.1:27515 (bridge.js). Мод программа ставит сама (install.js).
// Игра должна быть в режиме «Оконный без рамки»: поверх полноэкранного режима Windows ничего не рисует.
const {app, BrowserWindow, Tray, Menu, globalShortcut, screen, nativeImage, shell, ipcMain} = require('electron');
const {exec} = require('child_process');
const path = require('path'), fs = require('fs');
const bridge = require('./bridge'), inst = require('./install');
const VER = '0.5.0';
const SITE = 'https://1f8t8graf4-ai.github.io/dota-/restless/';
const URL0 = SITE + '?app=1&dev=vasyan2026#home';   // сайт пока закрыт замком разработки — ключ открывает его в окне программы
// одна клавиша, всегда (Ctrl+X не берём: в других программах это «вырезать», в Deadlock — присесть + второй предмет)
const KEY_OPTS = ['Control+Shift+H', 'Control+Shift+F10'];   // 0.5.0: Ctrl+Alt+H — у мода
const THRU_KEYS = ['Control+Alt+T', 'Control+Shift+F11'];   // клики сквозь окно
const CFG = path.join(app.getPath('userData'), 'restless.json');
// v 4 (0.4.7): окно шире — старый размер окна сбрасывается один раз
let cfg = {v: 5, x: null, y: null, w: 1600, h: 960, auto: false, through: false, seen: false, key: 'Control+Shift+H', fps: 'off', mod: null};
let UMR = null;   // последний отчёт мода: его настройки, моды рядом
try { const c = JSON.parse(fs.readFileSync(CFG, 'utf8')); if (!c.v || c.v < 4) { delete c.x; delete c.y; delete c.w; delete c.h; c.v = 4; } if (c.v < 5) { c.auto = false; c.key = 'Control+Shift+H'; c.v = 5; } Object.assign(cfg, c); } catch (e) {}
if (!KEY_OPTS.includes(cfg.key)) cfg.key = 'Control+Shift+H';   // 0.3 ставила Ctrl+X, до 0.5 — Ctrl+Alt+H (теперь у мода)
const save = () => { try { fs.writeFileSync(CFG, JSON.stringify(cfg)); } catch (e) {} };
const nice = k => String(k || '').replace(/Control/g, 'Ctrl');
const TEST_PROC = process.env.RL_TEST_PROC === '1';   // проверка без Windows: «игра запущена»
let win = null, tray = null, proc = TEST_PROC, userHidden = false, G = null, MOD = {status: 'wait'}, bridgeErr = '';
const K = {show: '', showAcc: '', thru: '', thruAcc: ''};

const isLive = () => !!(G && G.s === 'm' && Date.now() - G.at < 45000);
const IC = {};
function icons() {
  const im = f => nativeImage.createFromPath(path.join(__dirname, 'ic', f));
  IC.idle = im('idle.png'); IC.on = im('tray.png'); IC.live = [0, 1, 2, 3, 4, 5].map(i => im(`live${i}.png`));
}

function create() {
  const wa = screen.getPrimaryDisplay().workArea;
  const w = Math.min(cfg.w, wa.width - 40), h = Math.min(cfg.h, wa.height - 40);
  win = new BrowserWindow({
    width: w, height: h, x: cfg.x ?? Math.round(wa.x + (wa.width - w) / 2), y: cfg.y ?? Math.round(wa.y + (wa.height - h) / 2),
    minWidth: 420, minHeight: 360, frame: false, alwaysOnTop: true, skipTaskbar: true, resizable: true, show: false, backgroundColor: '#0b0c10',
    title: 'Restless', icon: path.join(__dirname, 'icon.png'),
    webPreferences: {contextIsolation: true, sandbox: true, preload: path.join(__dirname, 'preload.js')}
  });
  win.setAlwaysOnTop(true, 'screen-saver'); win.setVisibleOnAllWorkspaces(true);
  // 0.4.6: старый кэш сайта не держим — у Андрея окно показывало версию сайта трёхчасовой давности
  const ses = win.webContents.session;
  (ses && ses.clearCache ? ses.clearCache() : Promise.resolve()).catch(() => {}).finally(() => win.loadURL(URL0, {extraHeaders: 'pragma: no-cache\ncache-control: no-cache\n'}));
  // свой сайт — в этом окне; профиль другого игрока и всё чужое — в обычном браузере (иначе сайт запомнит его как «тебя»)
  win.webContents.setWindowOpenHandler(({url}) => { shell.openExternal(url); return {action: 'deny'}; });
  win.webContents.on('will-navigate', (e, url) => { if (!url.startsWith(SITE)) { e.preventDefault(); shell.openExternal(url); } });
  win.webContents.on('did-finish-load', push);
  const keep = () => { const b = win.getBounds(); cfg.x = b.x; cfg.y = b.y; cfg.w = b.width; cfg.h = b.height; save(); };
  win.on('moved', keep); win.on('resized', keep);
  win.on('show', menu); win.on('hide', menu);
  win.on('close', e => { if (!app.quitting) { e.preventDefault(); hide(true); } });
  setThrough(cfg.through);
  // первый запуск — окно сразу; дальше — по клавише и само, когда начнётся матч
  win.once('ready-to-show', () => { if (!cfg.seen) { open(true); cfg.seen = true; save(); } });
}
// состояние программы и данные игры — в страницу (сайт ?app=1: вкладка «Оверлей», LIVE, 12 игроков)
function state() {
  return {ver: VER, mod: MOD, keys: [K.show, K.thru], bridge: bridgeErr, proc, live: isLive(), auto: cfg.auto, through: cfg.through,
    hk: {show: K.show, cur: cfg.key, opts: KEY_OPTS.map(k => [k, nice(k)])},
    modcfg: UMR ? {c: UMR.c, v: UMR.v, at: UMR.at, mods: UMR.m, others: UMR.o} : null, modsent: cfg.mod ? cfg.mod.v : ''};
}
function push() {
  if (!win) return;
  const js = `window.rlApp&&window.rlApp(${JSON.stringify(state())});` + (G ? `window.rlGame&&window.rlGame(${JSON.stringify(G)});` : '');
  win.webContents.executeJavaScript(js).catch(() => {});
}
function setThrough(on) { cfg.through = on; save(); if (win) win.setIgnoreMouseEvents(on, {forward: true}); menu(); push(); }
// focus: по клавише — окно получает клавиатуру (можно листать, искать); само на матч — без фокуса, игра не теряет управление
function open(focus) {
  if (!win) return;
  if (focus) { win.show(); win.focus(); } else win.showInactive();
  win.setAlwaysOnTop(true, 'screen-saver'); userHidden = false; menu();
}
function hide(byUser) { if (!win) return; win.hide(); if (byUser) userHidden = true; menu(); }
function toggle() { if (!win) return; if (win.isVisible()) hide(true); else open(true); }
function goLive() { if (win) win.webContents.executeJavaScript(`if(!/^#live\\/?$/.test(location.hash))location.hash='#live'`).catch(() => {}); }

// ---------- клавиши: «открыть / скрыть» — одна, всегда; занята — берём следующую из списка ----------
function regKeys() {
  [K.showAcc, K.thruAcc].forEach(a => { if (a) try { globalShortcut.unregister(a); } catch (e) {} });
  K.show = K.showAcc = K.thru = K.thruAcc = '';
  const L = [cfg.key].concat(KEY_OPTS.filter(k => k !== cfg.key));
  for (const a of L) { try { if (globalShortcut.register(a, toggle)) { K.show = nice(a); K.showAcc = a; break; } } catch (e) {} }
  for (const a of THRU_KEYS) { try { if (globalShortcut.register(a, () => setThrough(!cfg.through))) { K.thru = nice(a); K.thruAcc = a; break; } } catch (e) {} }
}

// ---------- значок в трее: серый — игры нет, обычный — игра запущена, живой с красной точкой — LIVE (мод шлёт матч) ----------
let liveT = null, fr = 0, lastIc = '';
function iconTick() {
  if (!tray) return;
  if (isLive()) {
    if (!liveT) { liveT = setInterval(() => { tray.setImage(IC.live[fr++ % IC.live.length]); }, 170); lastIc = 'live'; menu(); push(); }
    return;
  }
  if (liveT) { clearInterval(liveT); liveT = null; menu(); push(); }
  const k = proc ? 'on' : 'idle';
  if (k !== lastIc) { tray.setImage(IC[k]); lastIc = k; }
}

const MODTXT = {wait: 'Мод: проверяю…', nogame: 'Мод: не нашёл Deadlock', busy: 'Мод: поставлю, когда закроешь игру', error: 'Мод: ошибка — ', installed: 'Мод: поставлен ✓', cleaned: 'Мод: на месте ✓, старые убраны', ok: 'Мод: на месте ✓'};
function menu() {
  if (!tray) return;
  const live = isLive(), recent = G && Date.now() - G.at < 45000;
  const kOpen = K.show || 'клавиша занята';
  tray.setToolTip('Restless' + (live ? ' · LIVE — матч, игроков ' + G.players.length : recent ? ' · игра на связи' : proc ? ' · игра запущена' : ' · жду игру'));
  tray.setContextMenu(Menu.buildFromTemplate([
    {label: win && win.isVisible() ? `Скрыть Restless (${kOpen})` : `Открыть профиль (${kOpen})`, click: toggle},
    {label: live ? '● LIVE — открыть матч' : 'Матча нет', enabled: live, click: () => { goLive(); open(true); }},
    {label: 'Открывать само, когда нашёлся матч', type: 'checkbox', checked: cfg.auto, click: i => { cfg.auto = i.checked; save(); push(); }},
    {label: `Клики сквозь окно (${K.thru || '—'})`, type: 'checkbox', checked: cfg.through, click: i => setThrough(i.checked)},
    {type: 'separator'},
    {label: 'Клавиша', submenu: KEY_OPTS.map(k => ({label: nice(k), type: 'radio', checked: cfg.key === k, click: () => { cfg.key = k; save(); regKeys(); menu(); push(); }}))},
    {label: (MODTXT[MOD.status] || MOD.status) + (MOD.status === 'error' ? (MOD.err || '') : MOD.file ? ' · ' + MOD.file : ''), enabled: false},
    {label: recent ? (G.s === 'm' ? `Игра на связи: матч, игроков ${G.players.length}` : G.s === 'b' ? 'Игра на связи: матч с ботами — не показываю' : 'Игра на связи: укрытие') : bridgeErr ? 'Связь с игрой: ' + bridgeErr : 'Связь с игрой: жду (нужен мод 0.13+)', enabled: false},
    ...(NEWVER ? [{label: `Скачать новую версию (${NEWVER})`, click: () => shell.openExternal(REL_URL)}] : []),
    {label: 'Поставить мод заново', click: () => setupMod(true)},
    {label: 'FPS в игре', submenu: [['off', 'Как в игре'], ['light', 'Лёгкий'], ['mid', 'Средний'], ['max', 'Максимум']].map(([k, nm]) => ({label: nm, type: 'radio', checked: cfg.fps === k, click: () => setFps(k)}))},
    {label: 'Открыть папку модов', enabled: !!MOD.dir, click: () => MOD.dir && shell.openPath(path.join(MOD.dir, 'game', 'citadel', 'addons'))},
    {type: 'separator'},
    {label: 'Настройки оверлея', click: () => { if (win) win.webContents.executeJavaScript(`location.hash='#ovs'`).catch(() => {}); open(true); }},
    {label: 'Открыть сайт в браузере', click: () => shell.openExternal(SITE)},
    {label: 'Обновить окно', click: () => win && win.reload()},
    {type: 'separator'},
    {label: `Выйти (версия ${VER})`, click: () => { app.quitting = true; app.quit(); }}
  ]));
}
// 0.4.5: мод обновляется сам — свежий pak42 берём с сайта (тот же файл, что в репо), новую программу качать не нужно.
// Скачанный кладём в папку программы; ставим тот, у которого версия мода выше (скачанный или встроенный).
const PAK_URL = SITE + 'app/pak42_dir.vpk', PKG_URL = SITE + 'app/package.json', REL_URL = 'https://github.com/1f8t8graf4-ai/dota-/releases/tag/overlay-latest';
const PAK_FILE = path.join(app.getPath('userData'), 'pak42_dir.vpk');
let NEWVER = '';
const isPak = b => b && b.length > 1000 && b.length < 20e6 && b.readUInt32LE(0) === 0x55AA1234;
const pakVer = b => { const m = /var VER = '([\d.]+)'/.exec(b.toString('latin1')); return m ? m[1] : '0'; };
const newer = (a, b) => { const x = String(a).split('.').map(Number), y = String(b).split('.').map(Number); for (let i = 0; i < Math.max(x.length, y.length); i++) { if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); } return false; };
function pakBuf() {
  let own = null, dl = null;
  try { own = fs.readFileSync(path.join(__dirname, 'pak42_dir.vpk')); } catch (e) {}
  try { dl = fs.readFileSync(PAK_FILE); } catch (e) {}
  if (!isPak(dl)) return own;
  if (!isPak(own)) return dl;
  return newer(pakVer(dl), pakVer(own)) ? dl : own;
}
async function pakUpdate() {
  try {
    const r = await fetch(PAK_URL + '?t=' + Date.now(), {cache: 'no-store'});
    if (r.ok) { const b = Buffer.from(await r.arrayBuffer()); let cur = null; try { cur = fs.readFileSync(PAK_FILE); } catch (e) {}
      if (isPak(b) && !(cur && cur.equals(b))) { fs.writeFileSync(PAK_FILE, b); setupMod();
        if (proc && !TEST_PROC) tray && tray.displayBalloon && tray.displayBalloon({title: 'Restless', content: `Скачал мод ${pakVer(b)} — закрой игру, поставлю сам. Новый мод заработает со следующего запуска игры.`}); } }
  } catch (e) {}
  try {
    const r = await fetch(PKG_URL + '?t=' + Date.now(), {cache: 'no-store'});
    if (r.ok) { const j = await r.json(); if (j && j.version && newer(j.version, VER) && NEWVER !== j.version) { NEWVER = j.version; menu();
      tray && tray.displayBalloon && tray.displayBalloon({title: 'Restless', content: `Есть программа ${NEWVER} — меню в трее → «Скачать новую версию».`}); } }
  } catch (e) {}
}
// мод: найти игру, включить папку модов, убрать старые паки Restless, положить свежий
function setupMod(force) {
  if (proc && !force && !TEST_PROC) { MOD = Object.assign({}, MOD, {status: 'busy'}); menu(); push(); return; }
  let buf = null;
  try { buf = pakBuf(); if (!buf) throw new Error('нет pak'); } catch (e) { MOD = {status: 'error', err: 'нет pak в программе'}; menu(); return; }
  MOD = inst.install(inst.findDeadlock(), buf, {fps: inst.FPS_LEVELS.includes(cfg.fps) ? cfg.fps : 'off'});
  if (MOD.status === 'installed' || MOD.status === 'cleaned') tray && tray.displayBalloon && tray.displayBalloon({title: 'Restless', content: MOD.status === 'installed' ? `Мод Restless поставлен (${MOD.file}). Запусти игру.` : `Старые файлы Restless убраны: ${MOD.moved.join(', ')}`});
  if (MOD.status === 'nogame') tray && tray.displayBalloon && tray.displayBalloon({title: 'Restless', content: 'Не нашёл Deadlock. Положи pak42_dir.vpk в game/citadel/addons вручную.'});
  menu(); push();
}
// Deadlock запущен? Процесс игры — project8.exe (у некоторых сборок deadlock.exe), раз в 5 секунд
function watchGame() {
  if (process.platform === 'win32') setInterval(() => exec('tasklist /FO CSV /NH', {windowsHide: true, maxBuffer: 4 * 1024 * 1024}, (err, out) => {
    const on = !err && /"(project8|deadlock)\.exe"/i.test(out || '');
    if (on === proc) return; proc = on;
    if (!on) { pakUpdate().then(() => setupMod()); userHidden = false; if (cfg.auto && win) win.hide(); }
    iconTick(); menu(); push();
  }), 5000);
  // окно поверх игры: Windows иногда кладёт игру выше — поднимаем раз в 3 с
  setInterval(() => { if (win && win.isVisible()) { win.setAlwaysOnTop(true, 'screen-saver'); win.moveTop(); } }, 3000);
}
function onGame(g) {
  const was = isLive();
  G = g;
  // нашёлся матч — окно открывается само на 12 игроках (даже если в прошлом матче его закрыли)
  if (g.s === 'm' && !was) {
    if (cfg.auto) { goLive(); open(false); }
    tray && tray.displayBalloon && tray.displayBalloon({title: 'Restless · LIVE', content: `Матч найден — игроков ${g.players.length}. ${K.show} — открыть / скрыть.`});
  }
  iconTick(); push(); menu();
}
function setFps(k) { if (!inst.FPS_LEVELS.includes(k)) return; cfg.fps = k; save(); setupMod(true); }
// ---------- страница → программа (preload.js) ----------
ipcMain.on('rl', (e, cmd, val) => {
  const u = e.senderFrame && e.senderFrame.url || '';
  if (!String(u).startsWith(SITE)) return;
  if (cmd === 'hide') hide(true);
  else if (cmd === 'key' && KEY_OPTS.includes(val)) { cfg.key = val; save(); regKeys(); menu(); push(); }
  else if (cmd === 'auto') { cfg.auto = !!val; save(); menu(); push(); }
  else if (cmd === 'through') setThrough(!!val);
  else if (cmd === 'mod') setupMod(true);
  else if (cmd === 'fps') setFps(String(val || ''));
  // настройки мода с сайта: ULT=1;MARK=0;U.<мод>.<настройка>=3 — мод заберёт со страницы cfg.html (метка — чтобы применил один раз)
  else if (cmd === 'modcfg' && typeof val === 'string' && val.length < 1500 && /^[\w.=;-]*$/.test(val)) { cfg.mod = {s: Date.now().toString(36), v: val}; save(); push(); }
});

if (!app.requestSingleInstanceLock()) app.quit();
app.on('second-instance', () => open(true));
app.whenReady().then(() => {
  icons();
  create();
  tray = new Tray(IC.idle);
  tray.on('click', toggle);
  regKeys();
  bridge.start(onGame, e => { bridgeErr = e.code === 'EADDRINUSE' ? 'порт 27515 занят (второй экземпляр?)' : e.message; menu(); push(); },
    {um: r => { const ch = !UMR || UMR.c !== r.c || JSON.stringify(UMR.m) !== JSON.stringify(r.m) || UMR.o.join() !== r.o.join(); UMR = r; if (ch) push(); }, cfg: () => cfg.mod});
  iconTick(); menu();
  setInterval(iconTick, 1000);
  setTimeout(() => setupMod(), 1500);
  setTimeout(pakUpdate, 6000); setInterval(pakUpdate, 20 * 60e3);
  watchGame();
});
app.on('will-quit', () => globalShortcut.unregisterAll());
app.on('window-all-closed', e => e.preventDefault());
