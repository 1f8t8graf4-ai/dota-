// Restless 0.23.
// 0.23: лайв-матч без программы (Андрей: «12 игроков — кор-фича, QoL же делает»). В меню Esc — кнопка «LIVE · 12 ИГРОКОВ»:
//       окно поверх меню, в нём встроенный браузер игры (CitadelHTMLPanel, как у store.html) с нашей страницей лайв-матча;
//       кто в матче (команда, ник, герой, ID) — в адресе после #g=, как программе. Состав поменялся — меняем только #…, страница
//       не перезагружается. Браузер живёт, только пока окно открыто (закрыл — удаляем, ничего не грузит).
// Restless 0.22.
// 0.22: по скринам Андрея (FPS, «урон по строениям убери», «ящики не меняются», «КД ульты над самой моделькой»):
//       урона по строениям больше нет; ящики — значками игры по типам (обычные / крепкие / статуи, обычные по умолчанию выключены:
//       их 423 — это и тянуло FPS) или только временем до появления; КД ульты над героем — свой скрипт в полосе здоровья
//       (unit_status_overlay_v2: полосы живут не в дереве HUD, поэтому 0.18 их не находил), секунды ему шлём событием;
//       у урны, разлома, моста, буста и напоминаний — значки самой игры; напоминание — за 10 с, плашкой; «~» в игре рисовался
//       как минус — теперь «через» и «в»; набор (Lite / Medium / Enchanted) подсвечивает, какие переключатели он поменял.
// 0.21: по скринам Андрея: лагеря ищем по всему интерфейсу (мини-карта не всегда внутри Hud), в «Что видит мод» — какие метки есть на мини-карте;
//       урон по строениям — плашкой внутри портрета; покупка — иконкой предмета на портрете того, кто купил; урна и разлом —
//       строкой под часами; пока открыто меню Esc, надписи по центру не видны; настройки с сайта («Оверлей») приходят через программу.
//       Патроны — свои цифры не рисуем (Андрей: «пишешь патроны и под прицелом, и на месте, где они были»): число у прицела — родное
//       ammo_panel игры, мы только держим его видимым (и переносим к прицелу, если HUD поставил его в другое место).
//       Ящики и золотые статуи — слоем на мини-карте (позиции deadlock-api, как у Deadlock Utils: слой — ребёнок hud_minimap,
//       820 px и pre-transform-scale2d под её размер). Урна, разлом, бафф на мосту — по классам игры (PlayerIsHoldingIdol,
//       koth_warning = 20 с, KothCashInMeter, powerup_spawn), остальное — оценка «~». Deadlock Utils рядом — урну и разлом не дублируем.
//       Моды рядом (Андрей: «интеграции их в наш оверлей»): моды с протоколом UMM (Enhanced Quickbuy) регистрируют настройки событием
//       ClientUI_FireOutput — их переключатели в окне RESTLESS и на сайте, значения храним в своей памяти и раздаём при каждом запуске.
// 0.20: ещё функции из наборов (Андрей: «там же больше гораздо функций»): патроны и перезарядка у прицела, карта строений
//       (своя карта игры в верхней панели — игра её прячет), «кто что купил» — из списка покупок магазина игры. Окно — в три колонки.
// 0.19: настройки сохраняются (Андрей: «нажал не показывать — после перезахода опять показывает»): как QoL Lock — скрытая страница
//       браузера игры (CitadelHTMLPanel) с нашего сайта, restless/store.html, держит их в localStorage игры на этом компьютере.
//       Набор Enchanted: урон по строениям под портретами, буст на канате, скорость (спидометр самой игры), нагрузка мода.
//       Души в минуту и непотраченные души — нет: модераторы GameBanana запретили их QoL Lock.
// 0.18: КД ульты над героем в мире — секунды на месте значка «ульта готова» над полосой здоровья; таймеры лагерей сами
//       запоминают настоящее время возрождения (первое увиденное, дальше — самое короткое): в вики 1:25, у Андрея «вроде 2 минуты».
// 0.17: функции из пресетов Lite / Medium (сайт → «Оверлей»): ранги игроков под портретами, средний ранг команд, таймеры лагерей
//       на мини-карте, пропавшие враги, цвет здоровья на портретах, «В бою», незащищённые души; в окне — набор Lite / Medium.
//       Ранг — картинкой с api.deadlock-api.com по ID игрока (как ранги друзей у QoL Lite): только чтение, в API ничего не шлём, кроме ID.
// 0.16: в окне RESTLESS без пояснений (Андрей, 04.11: «убери объяснения»): нет подписей под переключателями, «Скоро» и строки про настройки.
// 0.15: напоминания о событиях по часам матча (лагеря 2:00 / 5:00 / 8:00, ящики и статуи 3:00 / 5:00 / 10:00 — по deadlock.wiki):
//       за 15 с — «Через N с: …», потом 5 с — «Появились: …». Часы матча читаем раз в секунду, панель ищем раз в 2 с.
// 0.13: связь с программой Restless (оверлей поверх игры): кто в матче — картинкой на 127.0.0.1, как QoL Lock переводит чат;
//       ID игроков — из профилей в меню Esc; старые плашки пробника 27.10 (Венатор с таймером) убираем.
// 0.12: копию меню Esc из пака убрали — кнопку ставит скрипт в любое меню.
// 0.11: 3-значные КД (100+ с) рисуем сами, мельче двузначных.
// 0.10: в окне RESTLESS — блок «Что видит мод»: души, игроки и ульты, ячейки магазина, лагеря.
// 0.9.1: видимость и число КД держим у самой подписи на каждом такте.
// 0.8 не запускался: скрипт сразу искал меню Esc, а игра запускает скрипт файла раньше, чем вставляет его панель в HUD, —
// скрипт решал «это не HUD» и выключался насовсем. Теперь ждём: ищем корень каждые 0,25 с, потом раз в секунду.
// Меню по Esc не подменяем (его подменяют QoL Lock, QoL Lite, Torfus Voice — остаётся одна копия): кнопку RESTLESS
// и окно ставит этот скрипт — в то меню, какое загрузилось, строкой перед «Настройками», классом кнопок игры.
// Скрипт подключён к нескольким файлам: HUD — субтитры, скорость, чат; главное меню — dashboard (надпись «работает»).
// Работает одна копия — «хозяин» отмечается в атрибуте корневой панели; вторая ждёт и подхватит, если хозяин пропал.
// КД ульты: игра сама кладёт секунды в верхнюю панель ({i:ult_cooldown}), но не показывает — выводим их поверх значка.
// Память игры не читает. В интернет ничего не отправляет: кто в матче — только своей программе Restless на этом же компьютере (127.0.0.1).
// Настройки — в localStorage браузера игры (страница store.html нашего сайта): только наши переключатели, язык и время лагерей.
(function () {
	var VER = '0.25';
	var BOT = 'https://t.me/languagegamesbot', SITE = 'https://1f8t8graf4-ai.github.io/dota-/restless/';
	var A = '#ffc83d', INK = '#f3ebdd', MUTED = '#a89f90', DARK = '#1a1408', OFF = '#ffffff14';
	var ctx = $.GetContextPanel();
	if (!ctx) return;
	var HOOK = String(ctx.paneltype || ctx.id || '?').replace(/^Citadel(Hud)?/, '');
	var ROOT = null, HUD = null;
	$.Msg('[Restless] ' + VER + ' файл загружен: ' + HOOK);

	// ---------- общие настройки: атрибуты корневой панели (меню и HUD видят одно и то же) ----------
	var MEM = {};
	function get(k, def) {
		var v = '';
		try { if (ROOT.GetAttributeString) v = ROOT.GetAttributeString('RESTLESS_' + k, '') || ''; } catch (e) { v = ''; }
		if (!v && MEM[k]) v = MEM[k];
		return v ? String(v) : def;
	}
	// quiet — из памяти (store.html): сохранять не надо
	function set(k, v, quiet) {
		v = String(v); MEM[k] = v;
		try { if (ROOT.SetAttributeString) ROOT.SetAttributeString('RESTLESS_' + k, v); } catch (e) {}
		if (!quiet && keep(k)) stDirty(k);
	}
	// 0.17: функции Medium и Enchanted по умолчанию выключены (набор Lite)
	var DEF = { MISS: '0', THP: '0', CMB: '0', UNS: '0', OBJ: '0', ZIP: '0', SPD: '0', PERF: '0', AMMO: '0', RLD: '0', OMAP: '0', RBUY: '0', RIFT: '0', BOX: '0', BXC: '0', BXT: '1', BXG: '1', ALTM: '1', AIT: '0', SBX: '1',
		LBR: '1', LBH: '1', LBS: '1', LBP: '1', LBC: '1', LBB: '1', LBT: '1', LBK: '0' };
	function on(k) { return get(k, DEF[k] || '1') === '1'; }
	function lang() { return get('LANG', 'ru') === 'en' ? 'en' : 'ru'; }

	var TX = {
		ru: {
			mark: 'RESTLESS ' + VER + ' · работает', markMenu: ' · кнопка в Esc',
			settings: 'настройки мода · ' + VER, inGame: 'В ИГРЕ',
			ultT: 'КД ульты в верхней панели', ultS: 'секунды поверх значка ульты у каждого игрока — в матче',
			markT: 'Надпись RESTLESS', markS: 'слева сверху — видно, что мод работает',
			evtT: 'Напоминания о событиях', evtS: 'за 15 с до лагерей, ящиков и статуй — по часам матча',
			evIn: 'через ', evSec: ' с', evNow: 'появились',
			ev1: 'малые лагеря', ev2: 'ящики и золотые статуи', ev3: 'средние лагеря · ящики в тоннелях и на Колокольне', ev4: 'большие лагеря', ev5: 'ящики и статуи под Times Square',
			linkT: 'Связь с программой Restless', linkS: 'кто в матче — в окно поверх игры; ID берёт из профилей, пока открыто Esc',
			lk: 'Программа: ', lkN: 'отправлено ', lkP: ' · игроков ', lkI: ' · с ID ', lkH: ' · с героем ', lk0: 'Программа: в укрытии не отправляю — зайди в матч', lkOff: 'Программа: связь выключена',
			yes: 'ВКЛ', no: 'ВЫКЛ', lang: 'Язык мода', soon: 'СКОРО',
			s1: 'Сборки с винрейтом прямо в магазине', s2: 'Кто в матче и сборки — прямо в окне мода', s3: 'Двуязычные субтитры реплик героев',
			site: 'Мой Restless — разбор матчей', bot: 'Бот', close: 'Закрыть',
			seeH: 'ЧТО ВИДИТ МОД', souls: 'Души: ', pl: 'Игроков в верхней панели: ', plU: ' · КД ульты в секундах: ',
			shop: 'Магазин: ячеек ', shop0: 'Магазин: пусто — открой магазин, потом снова Esc → RESTLESS', first: ' · первые: ',
			camp: 'Лагеря на миникарте: ', campOn: ' · сейчас живы: ', camp0: 'Лагеря на миникарте: не нашёл',
			rankT: 'Ранги игроков', lrkT: 'Средний ранг команд', campT: 'Таймеры лагерей', missT: 'Пропавшие враги', thpT: 'Здоровье на портретах',
			cmbT: '«В бою»', unsT: 'Незащищённые души', ultwT: 'КД ульты над героем', sUw: 'Ульта над героями: полос ', sUwN: ' · с секундами ', pre: 'Набор', cmbOn: 'В БОЮ', cmbOff: 'ВНЕ БОЯ', unsL: 'Незащищённые души: ',
			sRank: 'Ранги: показано ', sLrk: ' · средний ранг: свои ', sLrkE: ', враги ', sCamp: ' · таймеров лагерей: ', sHp: 'Здоровье читается у ', sMiss: ' · пропавших врагов: ',
			sCmb: ' · «в бою»: ', sCmbY: 'да', sCmbN: 'нет', sCmb0: 'не нашёл', sUns: ' · незащищённых: ',
			objT: 'Урон по строениям', altmT: 'Мелочи — только по Alt', lbH: 'ЛОББИ · LIVE 12 — ЧТО ПОКАЗЫВАТЬ У ИГРОКОВ', seeBtn: 'Что видит мод ▸', seeHide: 'Скрыть ▾',
			lbR: 'Ранг', lbHr: 'Место на герое', lbS: 'Игры и винрейт', lbP: 'Форма 12 ч / 30 дн', lbC: 'Последние матчи', lbB: 'Сборка', lbT: 'Метки', lbK: 'Компактнее', sAlt: 'Alt: ', altOn: 'зажат', altOff: 'отпущен', altNo: 'не нашёл', uwSaw: ' · полосы ответили: ', zipT: 'Буст на канате', spdT: 'Скорость', perfT: 'Нагрузка мода',
			zip: '', zipR: 'готов', zipA: 'идёт ', sec: ' с', perf: 'Restless: ', ms: ' мс в секунду', mx: ' · самый долгий такт ',
			sObj: 'Урон по строениям: у ', sZip: ' · буст: ', sZip0: 'не нашёл', sSpd: ' · скорость: ', sPerf: ' · нагрузка: ',
			boxT: 'Ящики и статуи на мини-карте', ummH: 'МОДЫ РЯДОМ', ummN: 'настроек у мода нет', sUm: 'Моды рядом: ', sUm0: 'других модов не вижу', sBox: ' · на мини-карте точек ', duNo: 'урна и разлом — у Deadlock Utils',
			brOn: 'на мосту', brAt: 'через ', riftIn: 'откроется через ', urnAt: 'примерно через ', bxV: 'Ящики на мини-карте', bxIco: 'Значки', bxTm: 'Время', bxC: 'Обычные', bxT: 'Крепкие', bxG: 'Статуи', bxIn: 'Ящики через ', bxNow: 'Ящики на карте', changed: ' · изменено: ', sCampH: ' — меток лагерей игра не дала (в песочнице их нет), проверь в матче с ботами', uwW: ' · жду полосы', amG: 'у прицела (игра)', amM: 'перенесены к прицелу', amV: ', держим видимыми',
			riftT: 'Урна, разлом, мост', urnIn: 'через ', urnOn: 'на карте', urnEn: 'несут враги', urnFr: 'несут свои', riftAt: 'в ', riftSoon: 'через 20 с', riftOn: 'открыт',
			sMm: 'Мини-карта: меток ', sMmC: ' · лагерей ', sMmK: ' · есть: ', sMm0: 'Мини-карта: не нашёл', sBuyP: ' · на портрете ', sSet: ' · с сайта: ', sSetY: 'на связи', sSetN: 'нет связи', sSetA: ', применено ',
			aitT: 'Активные предметы у прицела', bldB: '★ RESTLESS · лучшая сборка', bldP: '★ RESTLESS · сборка с сайта', bldW: '★ RESTLESS · ищу…', bldN: '★ RESTLESS · сборки нет',  sbxT: 'Меню песочницы в укрытии', sbNo: 'меню песочницы: нет (не укрытие)', sbOn: 'меню песочницы: показано', sbOff: 'меню песочницы: выключено', sbMatch: 'меню песочницы: в матче не трогаем', ammoT: 'Патроны у прицела', rldT: 'Перезарядка у прицела', omapT: 'Карта строений', rbuyT: 'Кто что купил', rld: 'ПЕРЕЗАРЯДКА', buy: 'Купили: ',
			sAm: 'Патроны: ', sAm0: 'не нашёл', sOm: ' · карта строений: ', sOmY: 'показана', sOm0: 'не нашёл', sRb: ' · покупок в магазине: ',
			mem: 'Память настроек: ', memOk: 'загружена', memN: ' · своих настроек ', memS: ' · сохранено ', memW: 'жду страницу', memE: 'нет связи со страницей — настройки до выхода из игры'
		},
		en: {
			mark: 'RESTLESS ' + VER + ' · running', markMenu: ' · Esc button',
			settings: 'mod settings · ' + VER, inGame: 'IN GAME',
			ultT: 'Ult cooldown in the top bar', ultS: 'seconds over every player\'s ult icon — in a match',
			markT: 'RESTLESS label', markS: 'top left — shows the mod is running',
			evtT: 'Event reminders', evtS: '15 s before camps, crates and statues — by the match clock',
			evIn: 'in ', evSec: ' s', evNow: 'spawned',
			ev1: 'small camps', ev2: 'crates and golden statues', ev3: 'medium camps · tunnel and Bell Tower crates', ev4: 'large camps', ev5: 'Times Square crates and statues',
			linkT: 'Link to the Restless app', linkS: 'who is in the match — to the window over the game; IDs come from profiles while Esc is open',
			lk: 'App: ', lkN: 'sent ', lkP: ' · players ', lkI: ' · with ID ', lkH: ' · with hero ', lk0: 'App: not sending in the hideout — join a match', lkOff: 'App: link is off',
			yes: 'ON', no: 'OFF', lang: 'Mod language', soon: 'COMING SOON',
			s1: 'Builds with win rate right in the shop', s2: 'Who\'s in the match and builds — right in this window', s3: 'Bilingual hero voice-line subtitles',
			site: 'My Restless — match breakdowns', bot: 'Bot', close: 'Close',
			seeH: 'WHAT THE MOD SEES', souls: 'Souls: ', pl: 'Players in the top bar: ', plU: ' · ult cooldown in seconds: ',
			shop: 'Shop: cells ', shop0: 'Shop: empty — open the shop, then Esc → RESTLESS again', first: ' · first: ',
			camp: 'Camps on the minimap: ', campOn: ' · alive now: ', camp0: 'Camps on the minimap: not found',
			rankT: 'Player ranks', lrkT: 'Team average rank', campT: 'Camp timers', missT: 'Missing enemies', thpT: 'Health on portraits',
			cmbT: '"In combat"', unsT: 'Unsecured souls', ultwT: 'Ult cooldown over heroes', sUw: 'Ult over heroes: bars ', sUwN: ' · with seconds ', pre: 'Preset', cmbOn: 'IN COMBAT', cmbOff: 'OUT OF COMBAT', unsL: 'Unsecured souls: ',
			sRank: 'Ranks: shown ', sLrk: ' · average rank: allies ', sLrkE: ', enemies ', sCamp: ' · camp timers: ', sHp: 'Health readable for ', sMiss: ' · missing enemies: ',
			sCmb: ' · "in combat": ', sCmbY: 'yes', sCmbN: 'no', sCmb0: 'not found', sUns: ' · unsecured: ',
			objT: 'Objective damage', altmT: 'Small info — only on Alt', lbH: 'LOBBY · LIVE 12 — WHAT TO SHOW FOR PLAYERS', seeBtn: 'What the mod sees ▸', seeHide: 'Hide ▾',
			lbR: 'Rank', lbHr: 'Hero rating', lbS: 'Games & winrate', lbP: 'Form 12h / 30d', lbC: 'Last matches', lbB: 'Build', lbT: 'Tags', lbK: 'Compact', sAlt: 'Alt: ', altOn: 'held', altOff: 'released', altNo: 'not found', uwSaw: ' · bars answered: ', zipT: 'Zipline boost', spdT: 'Speedometer', perfT: 'Mod load',
			zip: '', zipR: 'ready', zipA: 'active ', sec: ' s', perf: 'Restless: ', ms: ' ms per second', mx: ' · longest tick ',
			sObj: 'Objective damage: for ', sZip: ' · boost: ', sZip0: 'not found', sSpd: ' · speed: ', sPerf: ' · load: ',
			boxT: 'Crates and statues on the minimap', ummH: 'MODS NEARBY', ummN: 'this mod has no settings', sUm: 'Mods nearby: ', sUm0: 'no other mods seen', sBox: ' · minimap dots ', duNo: 'urn and rift — by Deadlock Utils',
			brOn: 'on the bridge', brAt: 'in ', riftIn: 'opens in ', urnAt: 'about ', bxV: 'Crates on the minimap', bxIco: 'Icons', bxTm: 'Timer', bxC: 'Normal', bxT: 'Tough', bxG: 'Statues', bxIn: 'Crates in ', bxNow: 'Crates are up', changed: ' · changed: ', sCampH: ' — the game gave no camp markers (none in the sandbox), check in a bot match', uwW: ' · waiting for bars', amG: 'at the crosshair (game)', amM: 'moved to the crosshair', amV: ', kept visible',
			riftT: 'Urn, rift, bridge', urnIn: 'in ', urnOn: 'on the map', urnEn: 'enemies carry it', urnFr: 'allies carry it', riftAt: 'at ', riftSoon: 'in 20 s', riftOn: 'open',
			sMm: 'Minimap: markers ', sMmC: ' · camps ', sMmK: ' · has: ', sMm0: 'Minimap: not found', sBuyP: ' · on portrait ', sSet: ' · from site: ', sSetY: 'linked', sSetN: 'no link', sSetA: ', applied ',
			aitT: 'Active items at crosshair', bldB: '★ RESTLESS · best build', bldP: '★ RESTLESS · build from the site', bldW: '★ RESTLESS · looking…', bldN: '★ RESTLESS · no build',  sbxT: 'Sandbox menu in the hideout', sbNo: 'sandbox menu: none (not the hideout)', sbOn: 'sandbox menu: shown', sbOff: 'sandbox menu: off', sbMatch: 'sandbox menu: left to the game in a match', ammoT: 'Ammo at crosshair', rldT: 'Reload at crosshair', omapT: 'Objectives map', rbuyT: 'Who bought what', rld: 'RELOADING', buy: 'Bought: ',
			sAm: 'Ammo: ', sAm0: 'not found', sOm: ' · objectives map: ', sOmY: 'shown', sOm0: 'not found', sRb: ' · shop purchases: ',
			mem: 'Settings memory: ', memOk: 'loaded', memN: ' · saved settings ', memS: ' · saves ', memW: 'waiting for the page', memE: 'no link to the page — settings last until you quit'
		}
	};
	function T(k) { return (TX[lang()] || TX.ru)[k]; }
	function setText(l, v) { if (l && l.text !== v) l.text = v; }
	// без запоминания в копии скрипта: панель могла поменять другая копия
	function setVis(p, v) { if (!p) return; var s = v ? 'visible' : 'collapse', c = ''; try { c = String(p.style.visibility || ''); } catch (e) {} if (c !== s) p.style.visibility = s; }
	function url(u) {
		try { $.DispatchEvent('ExternalBrowserGoToURL', u); return; } catch (e) { $.Msg('[Restless] ссылка: ' + e); }
		try { if (typeof SteamOverlayAPI !== 'undefined' && SteamOverlayAPI && SteamOverlayAPI.OpenURL) SteamOverlayAPI.OpenURL(u); } catch (e) {}
	}
	function ok(p) { try { return !!(p && p.IsValid && p.IsValid()); } catch (e) { return false; } }
	function sty(p, st) { for (var k in st) { try { p.style[k] = st[k]; } catch (e) { $.Msg('[Restless] стиль ' + k + ': ' + e); } } return p; }
	function mk(type, parent, id, st, props) { return sty($.CreatePanel(type, parent, id || '', props || {}), st || {}); }
	function lab(parent, id, st) { return mk('Label', parent, id, st, { hittest: 'false' }); }

	// ---------- хозяин: работает одна копия скрипта ----------
	var TOKEN = Math.floor(Math.random() * 1e9).toString(36);
	function mine() {
		var o = get('OWN', ''), i = o.indexOf(':'), tk = i > 0 ? o.slice(0, i) : '', ts = i > 0 ? (+o.slice(i + 1) || 0) : 0;
		if (tk === TOKEN || !o || Date.now() - ts > 3000) { set('OWN', TOKEN + ':' + Date.now()); return true; }
		return false;
	}

	// ---------- надпись RESTLESS ----------
	// 0.14 (как QoL Lite): найденные панели помним и проверяем ok(), по всему HUD ищем, только если панель пропала
	var MARK = null, SUB = null, CH = null, GT = null;
	function markTick() {
		var m = ok(MARK) ? MARK : (MARK = HUD.FindChildTraverse('RestlessMark'));
		if (!ok(m)) {
			m = lab(HUD, 'RestlessMark', { horizontalAlign: 'left', verticalAlign: 'top', marginLeft: '24px', marginTop: '8px',
				fontSize: '20px', fontWeight: 'bold', color: A, zIndex: '50' });
			MARK = m;
		}
		setVis(m, on('MARK'));
		setText(m, T('mark') + (get('BTN', '') === '1' ? T('markMenu') : ''));
	}

	// ---------- кнопка в меню по Esc ----------
	var EM = null, ROW = null, BTN = null, WIN = null, SHADE = null, P = {}, open = false, seen = false;
	function menuShown() {
		var p = EM;
		try { while (p) { if (p.BHasClass && p.BHasClass('ShowEscapeMenu')) return true; p = p.GetParent ? p.GetParent() : null; } } catch (e) {}
		return false;
	}
	function menuTick() {
		if (!ok(EM)) EM = ROOT.FindChildTraverse('EscapeMenu');
		if (!ok(EM)) return;
		var sub = ok(SUB) ? SUB : (SUB = EM.FindChildTraverse('SubOptions'));
		if (!ok(sub)) return;
		if (!ok(BTN)) {
			BTN = EM.FindChildTraverse('RestlessMenuBtn');
			if (!ok(BTN)) {
				ROW = $.CreatePanel('Panel', sub, 'RestlessRow');
				ROW.AddClass('SettingsRow');
				BTN = $.CreatePanel('Button', ROW, 'RestlessMenuBtn');
				BTN.AddClass('nav_menu_item');
				BTN.AddClass('minor');
				var l = $.CreatePanel('Label', BTN, '', { text: 'RESTLESS' });
				l.AddClass('menuButtonLabel');
				var st = EM.FindChildTraverse('settings'), stRow = st && st.GetParent ? st.GetParent() : null;
				try { if (ok(stRow) && stRow.GetParent() === sub && sub.MoveChildBefore) sub.MoveChildBefore(ROW, stRow); } catch (e) { $.Msg('[Restless] место кнопки: ' + e); }
				$.Msg('[Restless] кнопка в меню поставлена');
			} else ROW = BTN.GetParent();
			BTN.SetPanelEvent('onactivate', function () { try { show(!open); } catch (e) { $.Msg('[Restless] окно: ' + e); } });
			set('BTN', '1');
		}
		if (!ok(LV.btn)) {
			LV.btn = EM.FindChildTraverse('RestlessLiveBtn');
			if (!ok(LV.btn) && ok(ROW)) {
				var lr = $.CreatePanel('Panel', sub, 'RestlessLiveRow'); lr.AddClass('SettingsRow');
				LV.btn = $.CreatePanel('Button', lr, 'RestlessLiveBtn'); LV.btn.AddClass('nav_menu_item'); LV.btn.AddClass('minor');
				LV.lb = $.CreatePanel('Label', LV.btn, '', { text: 'LIVE · 12' }); LV.lb.AddClass('menuButtonLabel');
				try { if (sub.MoveChildBefore) sub.MoveChildBefore(lr, ROW); } catch (e) {}
			}
			if (ok(LV.btn)) LV.btn.SetPanelEvent('onactivate', function () { try { liveShow(!LV.open); } catch (e) { $.Msg('[Restless] лайв: ' + e); } });
		}
		if (menuShown()) fitHero(sub);
	}
	// «Сменить героя» стоит на своём отступе снизу, столбик под ним растёт вверх. Наша строка его подняла бы —
	// если «Сменить героя» налезает на столбик, поднимаем её на столько, сколько не хватает (в экранных px → в px разметки).
	function fitHero(sub) {
		var ch = ok(CH) ? CH : (CH = EM.FindChildTraverse('changehero')), menu = ch && ch.GetParent ? ch.GetParent() : null;
		if (!ok(ch) || !ok(menu) || !(ch.actuallayoutheight > 0) || !(sub.actuallayoutheight > 0)) return;
		var sc = EM.actualuiscale_y > 0 ? EM.actualuiscale_y : 1;
		var bottom = ch.actualyoffset + ch.actuallayoutheight, gap = sub.actualyoffset - bottom, need = 6 * sc;
		if (gap >= need) return;
		var cur = menu.actuallayoutheight - bottom;
		ch.style.marginBottom = Math.round((cur + need - gap) / sc) + 'px';
		$.Msg('[Restless] «Сменить героя» поднята: ' + Math.round((need - gap) / sc) + ' px');
	}

	// ---------- 0.23: лайв-матч в игре ----------
	var LV = { btn: null, lb: null, win: null, html: null, open: false, base: '', hash: '' };
	var LIVE_URL = SITE + '?app=1&embed=1&dev=vasyan2026';
	function liveHash() {
		var L = LK.hide ? [] : lkPlayers();
		var enc = function (v) { return encodeURIComponent(String(v || '').replace(/[~|]/g, ' ')); };
		var gt = ''; try { if (!ok(GT)) GT = HUD.FindChildTraverse('GameTime'); gt = ok(GT) ? txt(GT) : ''; } catch (e) {}
		var lb = []; for (var k in LBMAP) lb.push(LBMAP[k] + ':' + (on(k) ? 1 : 0));
		return '#g=' + encodeURIComponent('v=' + VER + '&lb=' + lb.join(',') + '&s=' + (LK.hide || !L.length ? 'h' : 'm') + '&gt=' + enc(gt) + '&p=' +
			L.map(function (x) { return [x.t, enc(x.n), enc(x.h), x.hid, x.a].join('~'); }).join('|'));
	}
	function liveShow(v) {
		LV.open = v;
		if (!v) { if (ok(LV.win)) LV.win.DeleteAsync(0); LV.win = LV.html = null; return; }
		if (open) show(false);
		var o = EM.FindChildTraverse('RestlessLive'); if (ok(o)) o.DeleteAsync(0);
		LV.win = mk('Panel', EM, 'RestlessLive', { width: '92%', height: '88%', flowChildren: 'down', horizontalAlign: 'center', verticalAlign: 'center',
			backgroundColor: '#0b0d12fc', border: '1px solid #ffc83d73', borderRadius: '12px', zIndex: '5100' }, { hittest: 'true' });
		var head = mk('Panel', LV.win, '', { width: '100%', height: '48px', flowChildren: 'right', padding: '8px 14px 0px 18px' });
		setText(lab(head, '', { width: 'fill-parent-flow(1.0)', verticalAlign: 'center', fontSize: '20px', fontWeight: 'bold', color: A, letterSpacing: '2px' }), 'RESTLESS · LIVE');
		var x = mk('Button', head, '', { width: '36px', height: '36px', borderRadius: '18px', verticalAlign: 'center', backgroundColor: OFF });
		setText(lab(x, '', { horizontalAlign: 'center', verticalAlign: 'center', fontSize: '22px', color: INK }), '×');
		x.SetPanelEvent('onactivate', function () { liveShow(false); });
		try { LV.html = mk('CitadelHTMLPanel', LV.win, 'RestlessLiveWeb', { width: '100%', height: 'fill-parent-flow(1.0)', margin: '6px 8px 8px 8px' }); } catch (e) { LV.html = null; }
		LV.hash = liveHash();
		if (ok(LV.html)) { try { LV.html.SetURL(LIVE_URL + LV.hash); } catch (e) { $.Msg('[Restless] лайв: ' + e); } }
		$.Msg('[Restless] лайв-матч открыт: ' + LV.hash.length + ' символов');
	}
	function liveTick() {
		if (ok(LV.lb)) { var n = LK.hide ? 0 : PLY.length; setText(LV.lb, n ? 'LIVE · ' + n : 'LIVE'); }
		if (!LV.open) return;
		if (!ok(LV.win) || !menuShown()) { liveShow(false); return; }
		if (NT % 8) return;
		var h = liveHash();
		if (h !== LV.hash && ok(LV.html)) { LV.hash = h; try { LV.html.SetURL(LIVE_URL + h); } catch (e) {} }
	}

	// ---------- окно настроек ----------
	function build() {
		SHADE = mk('Button', EM, 'RestlessShade', { width: '100%', height: '100%', backgroundColor: '#000000b4', zIndex: '4900', visibility: 'collapse' });
		SHADE.SetPanelEvent('onactivate', function () { show(false); });
		WIN = mk('Panel', EM, 'RestlessWindow', {
			width: '980px', flowChildren: 'down', padding: '24px 30px 22px 30px', horizontalAlign: 'center', verticalAlign: 'center',
			backgroundColor: '#121014fa', border: '1px solid #ffc83d73', borderRadius: '12px', zIndex: '5000', visibility: 'collapse'
		}, { hittest: 'true' });
		WIN.SetPanelEvent('onactivate', function () {});

		var head = mk('Panel', WIN, '', { width: '100%', flowChildren: 'right', marginBottom: '12px' });
		mk('Panel', head, '', { width: '5px', height: '46px', backgroundColor: A, borderRadius: '2px', marginRight: '14px', verticalAlign: 'center' });
		var hc = mk('Panel', head, '', { width: 'fill-parent-flow(1.0)', flowChildren: 'down', verticalAlign: 'center' });
		setText(lab(hc, '', { fontSize: '32px', fontWeight: 'bold', color: A, letterSpacing: '2px' }), 'RESTLESS');
		P.sub = lab(hc, '', { fontSize: '15px', color: MUTED });
		var x = mk('Button', head, '', { width: '44px', height: '44px', borderRadius: '22px', verticalAlign: 'center', backgroundColor: OFF });
		setText(lab(x, '', { horizontalAlign: 'center', verticalAlign: 'center', fontSize: '26px', color: INK }), '×');
		x.SetPanelEvent('onactivate', function () { show(false); });

		P.secGame = lab(WIN, '', { fontSize: '13px', fontWeight: 'bold', color: MUTED, letterSpacing: '1px', marginTop: '4px' });
		var pr = mk('Panel', WIN, '', { width: '100%', flowChildren: 'right', padding: '6px 0px 8px 0px' });
		P.pre = lab(pr, '', { width: 'fill-parent-flow(1.0)', verticalAlign: 'center', fontSize: '17px', color: MUTED });
		P.lite = pill(pr, 'Lite', function () { preset('lite'); }, '16px');
		P.mid = pill(pr, 'Medium', function () { preset('mid'); }, '16px');
		P.ench = pill(pr, 'Enchanted', function () { preset('ench'); }, '16px');
		P.grid = mk('Panel', WIN, '', { width: '100%', flowChildren: 'right-wrap' });
		for (var ti = 0; ti < TG.length; ti++) toggle(TG[ti][0]);

		var lr = mk('Panel', WIN, '', { width: '100%', flowChildren: 'right', padding: '12px 0px 12px 0px' });
		P.lang = lab(lr, '', { width: 'fill-parent-flow(1.0)', verticalAlign: 'center', fontSize: '19px', color: INK });
		P.ru = pill(lr, 'Русский', function () { set('LANG', 'ru'); paint(); });
		P.en = pill(lr, 'English', function () { set('LANG', 'en'); paint(); });
		var br = mk('Panel', WIN, '', { width: '100%', flowChildren: 'right', padding: '0px 0px 12px 0px' });
		P.bxV = lab(br, '', { width: 'fill-parent-flow(1.0)', verticalAlign: 'center', fontSize: '19px', color: INK });
		P.bxIco = pill(br, '', function () { set('BOXV', 'ico'); paint(); });
		P.bxTm = pill(br, '', function () { set('BOXV', 'tm'); paint(); });
		mk('Panel', br, '', { width: '18px', height: '4px' });
		['BXC', 'BXT', 'BXG'].forEach(function (k) { P['p' + k] = pill(br, '', function () { set(k, on(k) ? '0' : '1'); paint(); }); });
		mk('Panel', WIN, '', { width: '100%', height: '1px', backgroundColor: OFF });

		P.umH = lab(WIN, '', { fontSize: '13px', fontWeight: 'bold', color: MUTED, letterSpacing: '1px', marginTop: '12px', visibility: 'collapse' });
		P.umBox = mk('Panel', WIN, '', { width: '100%', flowChildren: 'right-wrap', visibility: 'collapse' });
		UM.sig = '';

		// 0.24: лобби (что видно у 12 игроков в LIVE · 12) — прямо здесь, как остальные переключатели
		setText(lab(WIN, '', { fontSize: '13px', fontWeight: 'bold', color: MUTED, letterSpacing: '1px', marginTop: '12px' }), T('lbH'));
		var lbr = mk('Panel', WIN, '', { width: '100%', flowChildren: 'right-wrap', padding: '6px 0px 4px 0px' });
		LBX.forEach(function (x) { var q = pill(lbr, '', function () { set(x[0], on(x[0]) ? '0' : '1'); paint(); }, '16px'); q.b.style.marginLeft = '0px'; q.b.style.marginRight = '8px'; q.b.style.marginBottom = '8px'; P['p' + x[0]] = q; });
		// 0.24: «Что видит мод» свёрнуто (Андрей: «хуй сломит, что где»), открывается кнопкой
		var sr = mk('Panel', WIN, '', { width: '100%', flowChildren: 'right', marginTop: '8px' });
		P.seeB = pill(sr, '', function () { SEEO = !SEEO; for (var i = 0; i < P.see.length; i++) setVis(P.see[i], SEEO); setVis(P.seeH, SEEO); paint(); if (SEEO) { SEE = 0; seeTick(true); } }, '8px');
		P.seeB.b.style.marginLeft = '0px';
		P.seeH = lab(WIN, '', { fontSize: '13px', fontWeight: 'bold', color: A, letterSpacing: '1px', marginTop: '10px', marginBottom: '2px', visibility: SEEO ? 'visible' : 'collapse' });
		P.see = [];
		for (var q = 0; q < 14; q++) P.see.push(lab(WIN, '', { fontSize: '14px', color: INK, marginTop: '3px', visibility: SEEO ? 'visible' : 'collapse' }));

		var f = mk('Panel', WIN, '', { width: '100%', flowChildren: 'right', marginTop: '22px' });
		var site = mk('Button', f, 'RestlessSiteBtn', { padding: '11px 22px 11px 22px', borderRadius: '8px', backgroundColor: A });
		P.site = lab(site, '', { fontSize: '16px', fontWeight: 'bold', color: DARK });
		site.SetPanelEvent('onactivate', function () { url(SITE); });
		var bot = mk('Button', f, 'RestlessBotBtn', { padding: '11px 22px 11px 22px', marginLeft: '10px', borderRadius: '8px', backgroundColor: OFF });
		P.bot = lab(bot, '', { fontSize: '16px', fontWeight: 'bold', color: INK });
		bot.SetPanelEvent('onactivate', function () { url(BOT); });
		var cl = mk('Button', f, '', { padding: '11px 22px 11px 22px', marginLeft: '10px', borderRadius: '8px', backgroundColor: OFF });
		P.close = lab(cl, '', { fontSize: '16px', color: INK });
		cl.SetPanelEvent('onactivate', function () { show(false); });

		P.diag = lab(WIN, '', { fontSize: '11px', color: '#a89f9099', marginTop: '6px' });
	}
	// 0.22: значки самой игры (пути — из hud_minimap.css и ability-иконок датамайна)
	var IMG = 's2r://panorama/images/', ICO = { CAMP: IMG + 'minimap/neutral_medium_psd.vtex', BOX: IMG + 'minimap/item_crate_spawn_psd.vtex',
		RIFT: IMG + 'minimap/minimap_icon_koth_png.vtex', ZIP: SITE + 'mm/zip.png?v=1', EVT: IMG + 'minimap/gold_crate_marker_psd.vtex' };
	var I_URN = IMG + 'minimap/soul_jar_marker_psd.vtex', I_BR = IMG + 'minimap/powerup_souls_png.vtex', I_CR = ICO.BOX, I_ST = ICO.EVT,
		I_CS = IMG + 'minimap/neutral_small_psd.vtex', I_CL = IMG + 'minimap/neutral_large_psd.vtex';
	// 0.17: переключатели в две колонки; порядок создания прежний (старые сначала), новые — в конце
	var TG = [['ULT', 'ultT'], ['MARK', 'markT'], ['LINK', 'linkT'], ['EVT', 'evtT'], ['RANK', 'rankT'], ['LRK', 'lrkT'], ['CAMP', 'campT'],
		['MISS', 'missT'], ['THP', 'thpT'], ['CMB', 'cmbT'], ['UNS', 'unsT'], ['ULTW', 'ultwT'],
		['ZIP', 'zipT'], ['SPD', 'spdT'], ['PERF', 'perfT'], ['AMMO', 'ammoT'], ['RLD', 'rldT'], ['RBUY', 'rbuyT'], ['RIFT', 'riftT'], ['BOX', 'boxT'], ['AIT', 'aitT'], ['SBX', 'sbxT'], ['ALTM', 'altmT']];
	// наборы как на сайте («Оверлей»): Lite — главное и почти не грузит, Medium — ещё подсказки, Enchanted — всё. Надпись и связь не трогаем.
	var LITE = ['ULT', 'ULTW', 'EVT', 'RANK', 'LRK', 'CAMP', 'SBX'], MID = LITE.concat(['MISS', 'THP', 'CMB', 'UNS', 'AMMO', 'RLD', 'RBUY', 'RIFT', 'BOX', 'AIT']);
	var PRE = { lite: LITE, mid: MID, ench: MID.concat(['ZIP', 'SPD', 'PERF']) };
	var PREK = PRE.ench;
	function preset(n) {
		var ch = [];
		for (var i = 0; i < PREK.length; i++) { var v = PRE[n].indexOf(PREK[i]) >= 0; if (on(PREK[i]) !== v) ch.push(PREK[i]); set(PREK[i], v ? '1' : '0'); }
		paint(); flash(ch);
	}
	// 0.22: набор подсвечивает, что он поменял (Андрей: «не всегда видно, что изменилось») — рамкой на 1,6 с и числом рядом с «Набор»
	var FL = 0, SEEO = false;
	var LBX = [['LBR', 'lbR'], ['LBH', 'lbHr'], ['LBS', 'lbS'], ['LBP', 'lbP'], ['LBC', 'lbC'], ['LBB', 'lbB'], ['LBT', 'lbT'], ['LBK', 'lbK']];
	// ключи сайта (rl-lobby): rank hr st per rc bld tg cmp
	var LBMAP = { LBR: 'rank', LBH: 'hr', LBS: 'st', LBP: 'per', LBC: 'rc', LBB: 'bld', LBT: 'tg', LBK: 'cmp' };
	function flash(ch) {
		var id = ++FL;
		for (var i = 0; i < ch.length; i++) { var q = P[ch[i]]; if (q && ok(q.b)) try { q.b.style.border = '2px solid #ffffff'; q.t.style.color = A; } catch (e) {} }
		setText(P.pre, T('pre') + (ch.length ? T('changed') + ch.length : ''));
		$.Schedule(1.6, function () {
			if (id !== FL) return;
			for (var i = 0; i < ch.length; i++) { var q = P[ch[i]]; if (q && ok(q.b)) try { q.b.style.border = '0px solid #00000000'; q.t.style.color = INK; } catch (e) {} }
			if (ok(P.pre)) setText(P.pre, T('pre'));
		});
	}
	function presetNow() {
		for (var n in PRE) { var okp = true; for (var i = 0; i < PREK.length; i++) if (on(PREK[i]) !== (PRE[n].indexOf(PREK[i]) >= 0)) { okp = false; break; } if (okp) return n; }
		return '';
	}
	function toggle(key) {
		var cell = mk('Panel', P.grid, '', { width: '33.3%', flowChildren: 'down' });
		var r = mk('Panel', cell, '', { width: '100%', flowChildren: 'right', padding: '6px 14px 6px 0px' });
		if (ICO[key]) mk('Image', r, '', { width: '22px', height: '22px', marginRight: '8px', verticalAlign: 'center' }, { src: ICO[key], hittest: 'false', scaling: 'stretch-to-fit-preserve-aspect' });
		var c = mk('Panel', r, '', { width: 'fill-parent-flow(1.0)', flowChildren: 'down', verticalAlign: 'center' });
		var t = lab(c, '', { fontSize: '17px', color: INK });
		var b = mk('Button', r, '', { width: '104px', height: '32px', borderRadius: '16px', verticalAlign: 'center' });
		var bl = lab(b, '', { horizontalAlign: 'center', verticalAlign: 'center', fontSize: '15px', fontWeight: 'bold' });
		b.SetPanelEvent('onactivate', function () { set(key, on(key) ? '0' : '1'); paint(); markTick(); });
		mk('Panel', cell, '', { width: '96%', height: '1px', backgroundColor: OFF });
		P[key] = { t: t, b: b, l: bl };
	}
	function pill(parent, text, fn, rad) {
		var b = mk('Button', parent, '', { padding: '8px 18px 8px 18px', marginLeft: '8px', borderRadius: rad || '17px', verticalAlign: 'center', backgroundColor: OFF });
		var l = lab(b, '', { fontSize: '16px', fontWeight: 'bold', color: INK });
		setText(l, text);
		b.SetPanelEvent('onactivate', fn);
		return { b: b, l: l };
	}
	function paint() {
		setText(P.sub, T('settings')); setText(P.secGame, T('inGame')); setText(P.lang, T('lang'));
		setText(P.site, T('site')); setText(P.bot, T('bot')); setText(P.close, T('close'));
		setText(P.seeH, T('seeH'));
		for (var i = 0; i < TG.length; i++) {
			var q = P[TG[i][0]], v = on(TG[i][0]);
			setText(q.t, T(TG[i][1])); setText(q.l, v ? T('yes') : T('no'));
			q.b.style.backgroundColor = v ? A : OFF; q.l.style.color = v ? DARK : INK;
		}
		var pn = presetNow();
		if (!FL || P.pre.text.indexOf('·') < 0) setText(P.pre, T('pre'));
		['lite', 'mid', 'ench'].forEach(function (n) { var q = P[n]; q.b.style.backgroundColor = pn === n ? A : OFF; q.l.style.color = pn === n ? DARK : INK; });
		var bv = get('BOXV', 'ico') === 'tm';
		setText(P.bxV, T('bxV')); setText(P.bxIco.l, T('bxIco')); setText(P.bxTm.l, T('bxTm'));
		P.bxIco.b.style.backgroundColor = bv ? OFF : A; P.bxIco.l.style.color = bv ? INK : DARK;
		P.bxTm.b.style.backgroundColor = bv ? A : OFF; P.bxTm.l.style.color = bv ? DARK : INK;
		['BXC', 'BXT', 'BXG'].forEach(function (k) { var q = P['p' + k], v = on(k); setText(q.l, T('bx' + k.charAt(2))); var w = v && !bv; q.b.style.backgroundColor = w ? '#3b3527' : '#24221f'; q.b.style.border = w ? '1px solid ' + A : '1px solid #24221f'; q.l.style.color = w ? A : MUTED; });
		LBX.forEach(function (x) { var q = P['p' + x[0]], v = on(x[0]); if (!q) return; setText(q.l, T(x[1])); q.b.style.backgroundColor = v ? A : '#24221f'; q.l.style.color = v ? DARK : MUTED; });
		if (ok(P.seeB)) setText(P.seeB.l, SEEO ? T('seeHide') : T('seeBtn'));
		var ru = lang() === 'ru';
		P.ru.b.style.backgroundColor = ru ? A : OFF; P.ru.l.style.color = ru ? DARK : INK;
		P.en.b.style.backgroundColor = ru ? OFF : A; P.en.l.style.color = ru ? INK : DARK;
		try { umPaint(); } catch (e) { $.Msg('[Restless] моды рядом: ' + e); }
	}
	function show(v) {
		if (v && !ok(WIN)) {
			// окно могла построить прошлая копия скрипта — убираем и строим своё (ссылки на подписи нужны этой копии)
			try { var o1 = EM.FindChildTraverse('RestlessWindow'), o2 = EM.FindChildTraverse('RestlessShade'); if (ok(o1)) o1.DeleteAsync(0); if (ok(o2)) o2.DeleteAsync(0); } catch (e) {}
			build();
		}
		if (!ok(WIN)) return;
		if (v && LV.open) liveShow(false);
		open = v;
		setVis(WIN, v); setVis(SHADE, v);
		if (!v) return;
		paint();
		seen = menuShown();
		WIN.__fix = 0;
		try { SEE = 0; seeTick(true); } catch (e) { $.Msg('[Restless] проверка: ' + e); }
	}
	// Окно должно стоять по центру, подложка — на весь экран. Если разметка поставила иначе — ставим по пикселям.
	function winTick() {
		if (!ok(WIN)) { open = false; return; }
		if (!open) return;
		if (seen && !menuShown()) { show(false); return; }
		var W = EM.actuallayoutwidth, H = EM.actuallayoutheight, w = WIN.actuallayoutwidth, h = WIN.actuallayoutheight;
		if (!(W > 0) || !(w > 0)) return;
		var sx = EM.actualuiscale_x > 0 ? EM.actualuiscale_x : 1, sy = EM.actualuiscale_y > 0 ? EM.actualuiscale_y : 1;
		var cx = (W - w) / 2, cy = (H - h) / 2, dx = Math.abs(WIN.actualxoffset - cx), dy = Math.abs(WIN.actualyoffset - cy);
		if ((dx > 24 || dy > 24) && WIN.__fix < 3) {
			sty(WIN, { horizontalAlign: 'left', verticalAlign: 'top', align: 'left top', x: Math.round(cx / sx) + 'px', y: Math.round(cy / sy) + 'px' });
			WIN.__fix++;
		}
		if (ok(SHADE) && SHADE.actuallayoutwidth < W * 0.9) sty(SHADE, { width: Math.round(W / sx) + 'px', height: Math.round(H / sy) + 'px', align: 'left top', x: '0px', y: '0px' });
		setText(P.diag, 'окно ' + Math.round(w) + '×' + Math.round(h) + ' · экран ' + Math.round(W) + '×' + Math.round(H) +
			(dx > 24 || dy > 24 ? ' · не по центру, поправлено ' + WIN.__fix : ' · по центру') + ' · ' + HOOK +
			' · ульт ' + ULT.length + (ULT_SRC ? ' (' + ULT_SRC + ')' : ''));
	}

	// ---------- КД ульты в верхней панели ----------
	// Игра кладёт секунды в переменную ult_cooldown панели игрока. Скрытая подпись {i:ult_cooldown} — запасной путь,
	// главный — $.Localize у этой подписи на каждом такте (свежее значение, а не то, что подпись успела показать).
	var ULT = [], ultScan = 0, ULT_SRC = '', TB = null;
	function digits(v) { v = String(v == null ? '' : v).trim(); return /^\d+$/.test(v) ? v : ''; }
	function ultVal(u) {
		var v = '';
		try { v = digits($.Localize('{i:ult_cooldown}', u.src)); if (v) { ULT_SRC = 'localize'; return v; } } catch (e) {}
		if (u.pl) try { v = digits($.Localize('{i:ult_cooldown}', u.pl)); if (v) { ULT_SRC = 'localize·игрок'; return v; } } catch (e) {}
		v = digits(u.src.text); if (v) ULT_SRC = 'подпись';
		return v;
	}
	function ultClear() { for (var i = 0; i < ULT.length; i++) if (ok(ULT[i].txt)) setText(ULT[i].txt, ''); }
	function ultTick() {
		if (!ok(TB)) TB = HUD.FindChildTraverse('TopBar');
		var tb = TB;
		var want = on('ULT') && ok(tb) && !(tb.BHasClass && tb.BHasClass('InHideout'));
		if (!want) { ultClear(); return; }
		if (ultScan-- <= 0 || !ULT.length) {
			ultScan = 16;
			ULT = [];
			var n = tb.FindChildrenWithClassTraverse ? tb.FindChildrenWithClassTraverse('UltimateStatus') : [];
			for (var j = 0; j < n.length; j++) {
				var us = n[j];
				if (!ok(us)) continue;
				var bg = us.FindChildTraverse('UltimateStatusBG') || us;
				var src = us.FindChildTraverse('RestlessUltSrc');
				if (!ok(src)) { src = $.CreatePanel('Label', bg, 'RestlessUltSrc', { text: '{i:ult_cooldown}', hittest: 'false' }); src.style.visibility = 'collapse'; }
				var txt = us.FindChildTraverse('RestlessUltTxt');
				if (!ok(txt)) txt = lab(us, 'RestlessUltTxt', { horizontalAlign: 'center', verticalAlign: 'center', fontSize: '17px', fontWeight: 'bold',
					color: '#ffffff', textShadow: '0px 0px 4px 2.0 #000000', zIndex: '10' });
				var pl = us, d = 0;
				while (ok(pl) && d < 8 && pl.paneltype !== 'CitadelHudTopBarPlayer') { pl = pl.GetParent(); d++; }
				ULT.push({ src: src, txt: txt, pl: ok(pl) && pl.paneltype === 'CitadelHudTopBarPlayer' ? pl : null });
			}
		}
		for (var k = 0; k < ULT.length; k++) {
			var u = ULT[k];
			if (!ok(u.src) || !ok(u.txt)) { ultScan = 0; continue; }
			var v = ultVal(u);
			var ready = u.pl && u.pl.BHasClass && u.pl.BHasClass('UltimateCooldownReady');
			setVis(u.txt, true);
			setText(u.txt, v && v !== '0' && !ready ? v : '');
			// 0.11: 3-значные КД (100+ с) игра сама не показывает — рисуем их мельче
			var fz = v.length > 3 ? '10px' : v.length > 2 ? '12px' : '17px';
			if (u.fz !== fz) { u.fz = fz; try { u.txt.style.fontSize = fz; } catch (e) {} }
		}
	}

	// ---------- что видит мод: проверка перед магазином и лагерями ----------
	// Ячейка магазина — панель класса mod_view (CitadelShopMod), название предмета — в её подписи modName.
	// Лагерь на миникарте — map_button neutral, класс active = лагерь жив (игра так его и показывает).
	var SEE = 0;
	function txt(p) { try { return String(p.text || '').replace(/\s+/g, ' ').trim(); } catch (e) { return ''; } }
	function seeTick(log) {
		if (!open || !P.see || !P.see.length) return;
		if (SEE-- > 0 && !log) return;
		SEE = 3;
		var out = [];
		var g = HUD.FindChildTraverse('hudCurGoldLabel');
		out.push(T('souls') + (ok(g) && txt(g) ? txt(g) : '—'));
		var withSec = 0;
		for (var i = 0; i < ULT.length; i++) if (ok(ULT[i].src) && ultVal(ULT[i])) withSec++;
		out.push(T('pl') + ULT.length + T('plU') + withSec + (ULT_SRC ? ' (' + ULT_SRC + ')' : ''));
		var sh = HUD.FindChildTraverse('Shop'), cells = ok(sh) && sh.FindChildrenWithClassTraverse ? sh.FindChildrenWithClassTraverse('mod_view') : [], names = [];
		for (var c = 0; c < cells.length && names.length < 3; c++) {
			var nl = cells[c].FindChildrenWithClassTraverse ? cells[c].FindChildrenWithClassTraverse('modName') : [];
			var nm = nl.length ? txt(nl[0]) : '';
			if (nm && nm.indexOf('{') < 0) names.push(nm);
		}
		out.push(cells.length ? T('shop') + cells.length + (names.length ? T('first') + names.join(', ') : '') : T('shop0'));
		mmScan(true);
		var alive = 0; for (var k = 0; k < CMP.length; k++) if (ok(CMP[k].b) && CMP[k].b.BHasClass('active')) alive++;
		out.push(!ok(MM) ? T('sMm0') : T('sMm') + MMS.n + T('sMmC') + CMP.length + (CMP.length ? T('campOn') + alive : T('sCampH')) + (MMS.cls ? T('sMmK') + MMS.cls : ''));
		out.push(T('sRank') + RKN + T('sLrk') + LRKN[0] + T('sLrkE') + LRKN[1] + T('sCamp') + CMN);
		out.push(T('sHp') + HPN + T('sMiss') + MISSN + T('sCmb') + (CMBF < 0 ? '—' : !CMBF ? T('sCmb0') : CMBW ? T('sCmbY') : T('sCmbN')) + T('sUns') + UNV);
		out.push(T('sUw') + UW.n + T('sUwN') + UW.on + (UW.n ? '' : T('uwW')) + T('uwSaw') + UW.hn + (UW.hc ? ' (' + UW.hc + ')' : '') + ' · ' + T('sAlt') + (ALT.found ? (ALT.on ? T('altOn') : T('altOff')) : T('altNo')));
		out.push((lang() === 'en' ? 'Active items: ' : 'Активные предметы: ') + (AI.st || '—') + ' · ' + (SB.st || '—') + ' · ' + (lang() === 'en' ? 'build: ' : 'сборка: ') + (BL.st || (BL.id ? BL.id + (BL.hid ? ' / ' + BL.hid : '') : BL.hid ? '…' : '—')));
		out.push(!on('LINK') ? T('lkOff') : LK.hide ? T('lk0') : T('lk') + T('lkN') + LK.sent + T('lkP') + LK.n + T('lkI') + LK.ids + T('lkH') + LK.hs);
		out.push(T('zipT') + ': ' + (ZB.st || T('sZip0')) + T('sSpd') + (SPDV || '—') + T('sPerf') + PF.v.toFixed(1) + T('ms'));
		out.push(T('sAm') + (AM.st || T('sAm0')) + T('sOm') + (OM.st || T('sOm0')) + T('sRb') + RB.n + T('sBuyP') + RB.pn);
		out.push(T('mem') + (ST.ok ? T('memOk') + T('memN') + ST.n + T('memS') + ST.saved : ST.tries >= 4 || ST.err ? T('memE') + (ST.err ? ' (' + ST.err + ')' : '') : T('memW')) +
			T('sSet') + (SS.got ? T('sSetY') + T('sSetA') + SS.ap : T('sSetN')));
		var oth = umOthers(), um = UM.ord.map(function (id) { return UM.m[id].name; }).concat(oth);
		out.push(T('sUm') + (um.length ? um.join(', ') : T('sUm0')) + T('sBox') + (ok(BX.lay) && BX.lay.visible !== false ? BX.n : 0) + (RU.st ? ' · ' + RU.st : ''));
		for (var j = 0; j < P.see.length; j++) setText(P.see[j], out[j] || '');
		if (log) $.Msg('[Restless] видит: ' + out.join(' | '));
	}

	// ---------- 0.13: связь с программой Restless (оверлей поверх игры) ----------
	// Открытый API знает только ~150 топ-матчей — обычного матча там нет. Кто в матче, говорит сама игра: мод «грузит картинку»
	// с http://127.0.0.1:27515/rl.png, в адресе — команда, ник, герой и ID каждого из 12. Программа Restless на этом же компьютере
	// отвечает пустой картинкой и рисует карточки игроков. Так же QoL Lock переводит чат (127.0.0.1:8765).
	// Отправляем, когда что-то поменялось (не чаще раза в 2 с), иначе раз в 15 с — программа видит, что игра идёт.
	// ID: переменная account_id у панели игрока, если игра её даёт; иначе — из профиля игрока (Esc → список игроков):
	// пока открыто меню Esc, мод сам открывает профили по очереди и запоминает «ник → ID», как QoL Lock показывает ранги.
	var LK = { url: 'http://127.0.0.1:27515/rl.png?', img: null, last: '', at: 0, seq: 0, sent: 0, n: 0, ids: 0, hs: 0, hide: true,
		acc: {}, hero: {}, tried: {}, pr: null, skip: 0, wait: 0 };
	function lc(s) { return String(s || '').replace(/\s+/g, ' ').trim().toLowerCase(); }
	function num(v, a, b) { v = String(v == null ? '' : v).replace(/[^0-9]/g, ''); return v.length >= a && v.length <= b && +v > 0 ? v : ''; }
	function up(p, type) { var d = 0; try { while (ok(p) && d < 12 && p.paneltype !== type) { p = p.GetParent(); d++; } } catch (e) { return null; } return ok(p) && p.paneltype === type ? p : null; }
	function dv(p, k, a, b) { try { return num($.Localize('{d:' + k + '}', p), a, b); } catch (e) { return ''; } }
	// текст панели или первой подписи внутри (CitadelUserName — не подпись, ник у неё внутри)
	function ptxt(p) {
		var q = [p], i = 0;
		while (i < q.length && i < 40) { var c = q[i++]; var t = ok(c) ? txt(c) : ''; if (t && t.indexOf('{') < 0) return t;
			try { for (var j = 0; j < c.GetChildCount(); j++) q.push(c.GetChild(j)); } catch (e) {} }
		return '';
	}
	// открытые сейчас профили игроков: ник → ID («Account ID: 123…» у подписи AccountID в карточке)
	function lkCards() {
		var L = []; try { L = ROOT.FindChildrenWithClassTraverse('AccountID') || []; } catch (e) {}
		for (var i = 0; i < L.length; i++) {
			var id = num(txt(L[i]), 3, 10), c = up(L[i], 'CitadelProfileCard'); if (!id || !c) continue;
			var nm = lc(ptxt(c.FindChildTraverse('UserName')));
			if (nm) LK.acc[nm] = id;
		}
	}
	function lkDismiss() {
		try { if (typeof DismissAllContextMenus === 'function') DismissAllContextMenus(); else $.DispatchEvent('DismissAllContextMenus'); } catch (e) {}
	}
	// меню Esc открыто: список игроков — ник, герой (hero_id), ID (account_id); у кого ID не нашёлся — открываем его профиль
	function lkProbe() {
		if (!(on('LINK') || on('RANK') || on('LRK')) || LK.hide || !ok(EM) || !menuShown() || open) { if (LK.pr) { lkDismiss(); LK.pr = null; } return; }
		if (LK.wait-- > 0) return;
		LK.wait = 1;
		var rows = []; try { rows = EM.FindChildrenWithClassTraverse('PlayerName') || []; } catch (e) {}
		var E = [];
		for (var i = 0; i < rows.length; i++) {
			var e = up(rows[i], 'CitadelPlayersListEntry'), nm = lc(txt(rows[i]));
			if (!e || !nm) continue;
			var h = dv(e, 'hero_id', 1, 3), a = dv(e, 'account_id', 3, 10);
			if (h) LK.hero[nm] = h;
			E.push({ e: e, nm: nm, a: a });
		}
		// одинаковый account_id у всех — это ID из общей панели (обычно свой), ему не верим
		var same = E.length > 1 && E.every(function (x) { return x.a && x.a === E[0].a; });
		E.forEach(function (x) { if (x.a && !same) LK.acc[x.nm] = x.a; });
		if (LK.pr) lkCards();
		if (LK.pr) {
			if (LK.acc[LK.pr] || Date.now() - LK.prT > 2500) { if (!LK.acc[LK.pr]) LK.tried[LK.pr] = (LK.tried[LK.pr] || 0) + 1; lkDismiss(); LK.pr = null; }
			return;
		}
		for (var k = 0; k < E.length; k++) {
			var x = E[k];
			if (LK.acc[x.nm] || (LK.tried[x.nm] || 0) >= 2) continue;
			var mc = x.e.FindChildTraverse('MainContents') || x.e;
			lkDismiss();
			try { $.DispatchEvent('Activated', mc, 'mouse'); } catch (er) { LK.tried[x.nm] = 9; continue; }
			LK.pr = x.nm; LK.prT = Date.now();
			return;
		}
		LK.wait = 7;   // открывать больше некого — следующая проверка через 2 с
	}
	// 12 игроков из верхней панели: своя команда / враги, ник, герой, ID (0.17: из общего списка PLY — верхнюю панель обходим один раз)
	function lkPlayers() {
		plyScan(); plyIds();
		return PLY.map(function (x) { return { t: x.t, n: x.n, k: x.k, h: x.h, hid: x.hid || LK.hero[x.k] || '', a: x.a }; });
	}
	function lkTick() {
		if (!ok(TB)) TB = HUD.FindChildTraverse('TopBar');
		LK.hide = !ok(TB) || !!(TB.BHasClass && TB.BHasClass('InHideout'));
		if (!on('LINK')) return;
		if (LK.skip-- > 0) return;
		LK.skip = 7;
		var L = LK.hide ? [] : lkPlayers();
		LK.n = L.length; LK.ids = 0; LK.hs = 0;
		var enc = function (v) { return encodeURIComponent(String(v || '').replace(/[~|]/g, ' ')); };
		var ps = L.map(function (x) { if (x.a) LK.ids++; if (x.hid || x.h) LK.hs++; return [x.t, enc(x.n), enc(x.h), x.hid, x.a].join('~'); }).join('|');
		var q = 'v=' + VER + '&s=' + (LK.hide ? 'h' : 'm') + '&p=' + ps;
		var now = Date.now();
		if (q === LK.last && now - LK.at < 15000) return;
		if (q !== LK.last && now - LK.at < 2000) return;
		var gt = ''; try { if (!ok(GT)) GT = HUD.FindChildTraverse('GameTime'); gt = ok(GT) ? txt(GT) : ''; } catch (e) {}
		if (!ok(LK.img)) {
			LK.img = HUD.FindChildTraverse('RestlessLink');
			if (!ok(LK.img)) LK.img = mk('Image', HUD, 'RestlessLink', { width: '2px', height: '2px', opacity: '0.02', horizontalAlign: 'left', verticalAlign: 'bottom' }, { hittest: 'false' });
		}
		LK.last = q; LK.at = now; LK.seq++;
		try { LK.img.SetImage(LK.url + q + '&gt=' + enc(gt) + '&n=' + LK.seq); LK.sent++; } catch (e) { $.Msg('[Restless] связь: ' + e); }
		if (LK.seq === 1 || q.length !== (LK.lenLog || 0)) { LK.lenLog = q.length; $.Msg('[Restless] программе: ' + (LK.hide ? 'укрытие' : 'игроков ' + LK.n + ', с ID ' + LK.ids + ', с героем ' + LK.hs)); }
	}
	// плашка пробника 27.10 («Restless работает · картинка из интернета · таймер идёт») — от старого файла, если он ещё стоит
	var OLD = 0, OLDN = 0;
	function oldTick() {
		if (OLD-- > 0) return;
		OLD = (OLDN++ < 30) ? 8 : 40;
		['RestlessProbe', 'RestlessProbeHud', 'RestlessProbeMenu'].forEach(function (id) {
			var p = null; try { p = ROOT.FindChildTraverse(id); } catch (e) {}
			if (ok(p)) { try { p.DeleteAsync(0); $.Msg('[Restless] убрал старую плашку пробника: ' + id); } catch (e) {} }
		});
	}

	// ---------- напоминания о событиях (0.15): только первые появления по часам матча — их время одно и то же в каждом матче ----------
	// Повторы (лагерь, ящик) считаются от того, когда их убили или разбили, — этого по часам не узнать, поэтому их нет.
	// 0.22: за 10 с (Андрей: «не за 15, а за 10»), плашкой со значком игры: сверху что, снизу когда
	var EV = [[120, 'ev1', 'minimap/neutral_small_psd.vtex'], [180, 'ev2', 'minimap/item_crate_spawn_psd.vtex'], [300, 'ev3', 'minimap/neutral_medium_psd.vtex'],
		[480, 'ev4', 'minimap/neutral_large_psd.vtex'], [600, 'ev5', 'minimap/gold_crate_marker_psd.vtex']], EVL = null, EVS = -1;
	// плашка «значок игры + текст» (урна, разлом, мост, буст)
	function chip(parent, id, img, fz, st) {
		var o = { flowChildren: 'right', padding: '4px 12px 4px 8px', backgroundColor: '#121014d0', borderRadius: '8px' };
		for (var k in st || {}) o[k] = st[k];
		var p = mk('Panel', parent, id, o, { hittest: 'false' });
		var im = mk('Image', p, '', { width: (fz + 6) + 'px', height: (fz + 6) + 'px', verticalAlign: 'center', marginRight: '6px' }, { hittest: 'false', scaling: 'stretch-to-fit-preserve-aspect' });
		try { im.SetImage(img); } catch (e) {}
		var l = lab(p, '', { fontSize: fz + 'px', fontWeight: 'bold', color: INK, verticalAlign: 'center' });
		return { p: p, im: im, l: l, col: '' };
	}
	function chipSet(c, text, col) { if (!c) return; setText(c.l, text); if (col && c.col !== col) { c.col = col; try { c.l.style.color = col; } catch (e) {} } setVis(c.p, !!text); }
	function evtTick() {
		var has = EVL && ok(EVL.p);
		if (!on('EVT') || MENU) { if (has) setVis(EVL.p, false); return; }
		var s = clock();
		if (s === EVS) return;
		EVS = s;
		var hit = null, sub = '';
		for (var i = 0; i < EV.length && !hit; i++) {
			var d = EV[i][0] - s;
			if (s < 0) break;
			if (d > 0 && d <= 10) { hit = EV[i]; sub = T('evIn') + d + T('evSec'); }
			else if (d <= 0 && d > -5) { hit = EV[i]; sub = T('evNow'); }
		}
		if (!hit) { if (has) setVis(EVL.p, false); return; }
		if (!has) {
			var old = HUD.FindChildTraverse('RestlessEvt'); if (ok(old)) old.DeleteAsync(0);
			var p = mk('Panel', HUD, 'RestlessEvt', { horizontalAlign: 'center', verticalAlign: 'top', marginTop: '156px', padding: '8px 22px 8px 12px', flowChildren: 'right',
				backgroundColor: 'gradient( linear, 0% 0%, 100% 0%, from( #2b1f08f0 ), to( #121014e8 ) )', border: '1px solid #ffc83d80', borderRadius: '12px', zIndex: '60' }, { hittest: 'false' });
			var im = mk('Image', p, '', { width: '36px', height: '36px', verticalAlign: 'center', marginRight: '12px' }, { hittest: 'false', scaling: 'stretch-to-fit-preserve-aspect' });
			var cl = mk('Panel', p, '', { flowChildren: 'down', verticalAlign: 'center' });
			EVL = { p: p, im: im, img: '', t: lab(cl, '', { fontSize: '13px', fontWeight: 'bold', color: A, letterSpacing: '1px' }), b: lab(cl, '', { fontSize: '22px', fontWeight: 'bold', color: INK }) };
		}
		if (EVL.img !== hit[2]) { EVL.img = hit[2]; try { EVL.im.SetImage(IMG + hit[2]); } catch (e) {} }
		setText(EVL.t, String(T(hit[1])).toUpperCase()); setText(EVL.b, sub); setVis(EVL.p, true);
	}

	// ---------- 0.17: функции из наборов Lite / Medium ----------
	// Всё по найденным панелям: игроки верхней панели — раз в 4 с, лагеря миникарты — раз в 10 с; дальше только классы и размеры.
	// Выключенная функция ничего не ищет и прячет своё.
	var HIDE = true, MENU = false, HM = true, NT = 0, CLK = -1, CLKT = -1;
	// HM — «не рисовать поверх»: укрытие или открыто меню Esc (0.21: «9 / 9» и «В БОЮ» висели поверх окна RESTLESS)
	function hideTick() { if (!ok(TB)) TB = HUD.FindChildTraverse('TopBar'); HIDE = !ok(TB) || !!(TB.BHasClass && TB.BHasClass('InHideout')); MENU = ok(EM) && menuShown(); HM = HIDE || MENU; NT++; }
	// часы матча в секундах (один раз за такт; GameTime ищем раз в 10 с, если пропал)
	var GTF = 0;
	function clock() {
		if (CLKT === NT) return CLK;
		CLKT = NT;
		if (!ok(GT)) { if (GTF-- > 0) return (CLK = -1); GTF = 40; GT = HUD.FindChildTraverse('GameTime'); if (!ok(GT)) return (CLK = -1); }
		var m = /(-?)(\d+):(\d\d)/.exec(txt(GT) || '');
		return (CLK = m ? (m[1] ? -1 : 1) * (+m[2] * 60 + +m[3]) : -1);
	}
	function kid(p, id) { try { return ok(p) ? p.FindChildTraverse(id) : null; } catch (e) { return null; } }

	// игроки верхней панели: команда, ник, ID, панели портрета (HeroImageArea, HealthBar…)
	var PLY = [], PLS = 0;
	function plyScan() {
		if (PLS-- > 0 && PLY.length) return;
		PLS = 16;
		var keep = {}; for (var o = 0; o < PLY.length; o++) if (ok(PLY[o].pl)) keep[PLY[o].k] = PLY[o];
		PLY = [];
		var T2 = [['f', 'TeamFriendly'], ['e', 'TeamEnemy']];
		for (var t = 0; t < 2; t++) {
			var tp = kid(TB, T2[t][1]); if (!ok(tp)) continue;
			var ls = []; try { ls = tp.FindChildrenWithClassTraverse('PlayerName') || []; } catch (e) {}
			for (var i = 0; i < ls.length; i++) {
				var pl = up(ls[i], 'CitadelHudTopBarPlayer'), k = lc(txt(ls[i]));
				if (!pl || !k || k.indexOf('{') >= 0) continue;
				var x = keep[k] && keep[k].pl === pl ? keep[k] : { pl: pl, k: k };
				x.t = T2[t][0]; x.n = txt(ls[i]); x.da = dv(pl, 'account_id', 3, 10);
				if (!x.h) { var hl = []; try { hl = pl.FindChildrenWithClassTraverse('HeroName') || []; } catch (e) {} x.h = hl.length ? txt(hl[0]) : ''; if (x.h.indexOf('{') >= 0) x.h = ''; }
				if (!x.hid) x.hid = dv(pl, 'hero_id', 1, 3);
				if (!ok(x.area)) x.area = kid(pl, 'HeroImageArea') || pl;
				if (!ok(x.hb)) { x.hb = kid(pl, 'HealthBar'); x.hc = kid(pl, 'HealthBar_Contents'); x.hf = kid(pl, 'HealthBar_Fill'); }
				PLY.push(x);
			}
		}
		// одинаковый account_id у всех — общая панель (свой ID), не верим; иначе — из профилей в Esc
		var same = PLY.length > 1 && PLY.every(function (y) { return y.da && y.da === PLY[0].da; });
		PLY.forEach(function (y) { y.a = (!same && y.da) || LK.acc[y.k] || ''; });
	}
	function plyIds() { for (var i = 0; i < PLY.length; i++) if (!PLY[i].a && LK.acc[PLY[i].k]) PLY[i].a = LK.acc[PLY[i].k]; }

	// ранги игроков: значок под портретом — картинка с api.deadlock-api.com по ID (как ранги друзей у QoL Lite)
	var RK_URL = 'https://api.deadlock-api.com/v1/players/', RKN = 0;
	function rankTick() {
		var want = on('RANK') && !HIDE; RKN = 0;
		for (var i = 0; i < PLY.length; i++) {
			var x = PLY[i], im = ok(x.rk) ? x.rk : null;
			if (!want || !x.a) { if (im) setVis(im, false); continue; }
			if (!im) {
				im = kid(x.area, 'RestlessRank');
				if (!ok(im)) im = mk('Image', x.area, 'RestlessRank', { width: '30px', height: '24px', horizontalAlign: 'right', verticalAlign: 'bottom',
					marginRight: '-8px', marginBottom: '-6px', zIndex: '20' }, { hittest: 'false', scaling: 'stretch-to-fit-preserve-aspect' });
				x.rk = im; x.rid = '';
			}
			if (x.rid !== x.a) { x.rid = x.a; try { im.SetImage(RK_URL + x.a + '/rank/image'); } catch (e) { $.Msg('[Restless] ранг: ' + e); } }
			setVis(im, true); RKN++;
		}
	}
	// средний ранг команд: два значка под часами (у кого ID нашлись — от 2 в каждой команде)
	var LRK = null, LRKF = '', LRKE = '', LRKN = [0, 0];
	function lrkTick() {
		var f = [], e = [];
		for (var i = 0; i < PLY.length; i++) if (PLY[i].a) (PLY[i].t === 'f' ? f : e).push(PLY[i].a);
		LRKN = [f.length, e.length];
		var want = on('LRK') && !HIDE && f.length >= 2 && e.length >= 2;
		if (!want) { if (ok(LRK)) setVis(LRK, false); return; }
		if (!ok(LRK)) {
			LRK = HUD.FindChildTraverse('RestlessLrk');
			if (!ok(LRK)) {
				LRK = mk('Panel', HUD, 'RestlessLrk', { horizontalAlign: 'center', verticalAlign: 'top', marginTop: '84px', flowChildren: 'right', zIndex: '55' }, { hittest: 'false' });
				var st = { width: '40px', height: '32px', margin: '0px 70px 0px 70px' };
				mk('Image', LRK, 'RestlessLrkF', st, { hittest: 'false', scaling: 'stretch-to-fit-preserve-aspect' });
				mk('Image', LRK, 'RestlessLrkE', st, { hittest: 'false', scaling: 'stretch-to-fit-preserve-aspect' });
			}
			LRKF = LRKE = '';
		}
		var fs = f.slice(0, 6).join(','), es = e.slice(0, 6).join(',');
		try {
			if (fs !== LRKF) { LRKF = fs; LRK.FindChildTraverse('RestlessLrkF').SetImage(RK_URL + 'rank/image?account_ids=' + fs); }
			if (es !== LRKE) { LRKE = es; LRK.FindChildTraverse('RestlessLrkE').SetImage(RK_URL + 'rank/image?account_ids=' + es); }
		} catch (er) { $.Msg('[Restless] средний ранг: ' + er); }
		setVis(LRK, true);
	}

	// таймеры лагерей: метка лагеря на миникарте гаснет (класс active) — лагерь убит; возрождение — от смерти последнего
	// монстра (deadlock.wiki, данные Зетки zai/map): малый 1:25, средний 4:50, большой 5:35. Отсчёт — над меткой.
	var MM = null, MMF = 0, MMM = 0, CMP = [], CMS = 0, CMN = 0, CRS = { neutral_weak: 85, neutral_medium: 290, neutral_large: 335 };
	// своё время возрождения: первое увиденное заменяет число из вики, дальше берём самое короткое (метку могли увидеть позже)
	function campRs(cl) { var v = +get('CRS_' + cl, '0'); return v > 30 && v < 900 ? v : CRS[cl] || 0; }
	function campLearn(cl, d) {
		if (!cl || !(d > 30 && d < 900)) return;
		var cur = +get('CRS_' + cl, '0');
		if (!(cur > 0) || d < cur) { set('CRS_' + cl, String(Math.round(d))); $.Msg('[Restless] лагерь ' + cl + ': возрождение ' + Math.round(d) + ' с'); }
	}
	function campHide() { for (var i = 0; i < CMP.length; i++) if (ok(CMP[i].lb)) setVis(CMP[i].lb, false); }
	function campTick() {
		CMN = 0;
		if (!on('CAMP') || HIDE) { campHide(); return; }
		if (!mmEnsure()) { campHide(); return; }
		if (CMS-- <= 0 || !CMP.length) {
			CMS = 40;
			var old = CMP, L = mmScan(false);
			CMP = [];
			for (var i = 0; i < L.length; i++) {
				var b = L[i]; if (!ok(b) || !b.BHasClass('neutral')) continue;
				var rs = 0; for (var c in CRS) if (b.BHasClass(c)) rs = campRs(c);
				if (!rs) continue;
				var x = null; for (var j = 0; j < old.length; j++) if (old[j].b === b) x = old[j];
				var cl = ''; for (var c2 in CRS) if (b.BHasClass(c2)) cl = c2;
				CMP.push(x || { b: b, cl: cl, rs: rs, was: b.BHasClass('active'), dead: -1, lb: null });
			}
			for (var k = 0; k < old.length; k++) if (CMP.indexOf(old[k]) < 0 && ok(old[k].lb)) old[k].lb.DeleteAsync(0);
		}
		var s = clock();
		for (var n = 0; n < CMP.length; n++) {
			var q = CMP[n];
			if (!ok(q.b)) { CMS = 0; continue; }
			var act = q.b.BHasClass('active');
			if (q.was && !act && s >= 0) q.dead = s;
			if (act && q.dead >= 0 && s > q.dead) campLearn(q.cl, s - q.dead);
			if (act) q.dead = -1;
			q.was = act;
			var left = q.dead >= 0 && s >= 0 ? q.dead + campRs(q.cl) - s : -1;
			if (left <= 0) { if (ok(q.lb)) setVis(q.lb, false); continue; }
			var par = q.b.GetParent();
			if (!ok(q.lb)) q.lb = lab(par, '', { width: '44px', textAlign: 'center', align: 'left top', fontSize: '13px', fontWeight: 'bold', color: '#ffffff',
				textShadow: '0px 0px 3px 2.0 #000000', zIndex: '30' });
			var sx = q.b.actualuiscale_x > 0 ? q.b.actualuiscale_x : 1, sy = q.b.actualuiscale_y > 0 ? q.b.actualuiscale_y : 1;
			var px = Math.round((q.b.actualxoffset + q.b.actuallayoutwidth / 2) / sx - 22) + 'px', py = Math.round((q.b.actualyoffset + q.b.actuallayoutheight / 2) / sy - 9) + 'px';
			if (q.px !== px || q.py !== py) { q.px = px; q.py = py; sty(q.lb, { x: px, y: py }); }
			var inv = ok(MM) && MM.BHasClass('invert_map');
			if (q.inv !== inv) { q.inv = inv; try { q.lb.style.transform = inv ? 'scaleY(-1) scaleX(-1)' : 'none'; } catch (e) {} }
			setText(q.lb, Math.floor(left / 60) + ':' + ('0' + (left % 60)).slice(-2));
			setVis(q.lb, true); CMN++;
		}
	}

	// пропавшие враги (портрет темнеет, пока героя не видно — у панели нет HealthVisible) и цвет здоровья: 75 / 65 / 25 %
	var MISSN = 0, HPN = 0;
	function hpOf(x) {
		var h = ok(x.hb) ? x.hb.actuallayoutheight : 0;
		if (!(h > 0)) return -1;
		var r = 1;
		if (ok(x.hf) && x.hf.actuallayoutheight >= 0) r = Math.min(r, x.hf.actuallayoutheight / h);
		if (ok(x.hc) && x.hc.actuallayoutheight >= 0) r = Math.min(r, x.hc.actuallayoutheight / h);
		return r;
	}
	function portTick() {
		MISSN = 0; HPN = 0;
		var wm = on('MISS') && !HIDE, wh = on('THP') && !HIDE;
		for (var i = 0; i < PLY.length; i++) {
			var x = PLY[i], pl = x.pl;
			if (!ok(pl)) continue;
			var dead = pl.BHasClass('Dead'), seen = pl.BHasClass('HealthVisible');
			var miss = wm && x.t === 'e' && !dead && !seen;
			if (miss || ok(x.ms)) {
				if (!ok(x.ms)) x.ms = mk('Panel', x.area, 'RestlessMiss', { width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#000000b0', zIndex: '15' }, { hittest: 'false' });
				setVis(x.ms, miss);
			}
			if (miss) MISSN++;
			var r = wh && !dead && (x.t === 'f' || seen) ? hpOf(x) : -1;
			if (r >= 0 && r < 0.98) HPN++;
			var col = r < 0 || r >= 0.75 ? '' : r < 0.25 ? '#ff3b3b' : r < 0.65 ? '#ff9a3b' : '#ffd23b';
			if (col || ok(x.hr)) {
				if (!ok(x.hr)) { x.hr = mk('Panel', x.area, 'RestlessHp', { width: '100%', height: '100%', borderRadius: '50%', zIndex: '16' }, { hittest: 'false' }); x.hcol = ''; }
				if (col && x.hcol !== col) { x.hcol = col; x.hr.style.border = '3px solid ' + col; }
				setVis(x.hr, !!col);
			}
		}
	}

	// «В бою»: глобальный класс gInCombat у объявлений HUD (игра так подсвечивает баффы в бою); вышел — «ВНЕ БОЯ» на 2 с
	var GA = null, GAF = 0, GAM = 0, CMB = null, CMBW = false, CMBX = 0, CMBF = -1;
	function cmbTick() {
		if (!on('CMB') || HM) { if (ok(CMB)) setVis(CMB, false); CMBW = false; return; }
		if (!ok(GA)) { if (GAF-- > 0) return; GAF = 40 * Math.min(6, ++GAM); GA = HUD.FindChildTraverse('CitadelHudGameAnnouncements'); CMBF = ok(GA) ? 1 : 0; if (!ok(GA)) return; }
		var inC = GA.BHasClass('gInCombat');
		if (CMBW && !inC) CMBX = 4;
		CMBW = inC;
		var msg = inC ? T('cmbOn') : CMBX-- > 0 ? T('cmbOff') : '';
		if (!msg) { if (ok(CMB)) setVis(CMB, false); return; }
		if (!ok(CMB)) CMB = HUD.FindChildTraverse('RestlessCmb');
		if (!ok(CMB)) CMB = lab(HUD, 'RestlessCmb', { horizontalAlign: 'center', verticalAlign: 'center', marginTop: '170px', fontSize: '15px', fontWeight: 'bold',
			letterSpacing: '1px', textShadow: '0px 0px 4px 2.0 #000000', zIndex: '40' });
		setText(CMB, msg); CMB.style.color = inC ? '#ff6b5b' : '#5be08a'; setVis(CMB, true);
	}
	// незащищённые души: число игры ({i:hud_death_gold_penalty}) крупно над умениями, пока оно больше нуля
	var DG = null, DGF = 0, DGM = 0, UNL = null, UNV = 0;
	function unsTick() {
		UNV = 0;
		if (!on('UNS') || HM) { if (ok(UNL)) setVis(UNL, false); return; }
		if (!ok(DG)) { if (DGF-- > 0) return; DGF = 40 * Math.min(6, ++DGM); DG = HUD.FindChildTraverse('hudDeathGoldLabel'); if (!ok(DG)) return; }
		var t = txt(DG).replace(/[^0-9]/g, ''); UNV = t ? +t : 0;
		if (!(UNV > 0)) { if (ok(UNL)) setVis(UNL, false); return; }
		if (!ok(UNL)) UNL = HUD.FindChildTraverse('RestlessUns');
		if (!ok(UNL)) UNL = lab(HUD, 'RestlessUns', { horizontalAlign: 'center', verticalAlign: 'bottom', marginBottom: '200px', padding: '6px 16px 6px 16px',
			backgroundColor: '#121014d0', borderRadius: '8px', fontSize: '22px', fontWeight: 'bold', color: '#ff9a3b', zIndex: '40' });
		setText(UNL, T('unsL') + txt(DG)); setVis(UNL, true);
	}
	// ---------- 0.22: КД ульты над героем в мире ----------
	// Полосы здоровья над героями (unit_status_overlay_v2) живут не в дереве HUD — 0.18 искал их здесь и не находил («полос 0»).
	// Теперь у полосы свой маленький скрипт (restless_uw.js, подключён к копии unit_status_overlay_v2.xml): он слушает событие
	// ClientUI_FireOutput, а мы раз в 0,5 с шлём {rl:1, t:'ultw', v:{ник или герой: секунды}} (пусто — ульта готова).
	// Полоса, нашедшая своего героя, отвечает {rl:1, t:'uwack', n} — так видно, сколько полос нас слышат.
	var UW = { last: '', at: 0, n: 0, on: 0, ack: {}, reg: false, hn: 0, hc: '' };
	function uwAck(payload) {
		if (typeof payload !== 'string' || (payload.indexOf('"uwack"') < 0 && payload.indexOf('"uwhi"') < 0)) return;
		try {
			var o = JSON.parse(payload); if (!o || o.rl !== 1) return;
			if (o.t === 'uwack' && o.n) UW.ack[String(o.n).slice(0, 40)] = Date.now();
			// 0.24: каждая полоса с именем один раз говорит о себе — сколько их и какие классы (чтобы понять, почему «полос 0»)
			if (o.t === 'uwhi') { UW.hn++; var c = String(o.c || '-').slice(0, 40); if (UW.hc.indexOf(c) < 0 && UW.hc.length < 60) UW.hc += (UW.hc ? '; ' : '') + c; }
		} catch (e) {}
	}
	function uwTick() {
		if (!UW.reg) { UW.reg = true; try { $.RegisterForUnhandledEvent('ClientUI_FireOutput', uwAck); } catch (e) {} }
		var want = on('ULTW') && !HIDE, V = {}, n = 0, now = Date.now();
		if (want) for (var i = 0; i < ULT.length; i++) {
			var u = ULT[i]; if (!u.pl || !ok(u.src)) continue;
			var x = null; for (var j = 0; j < PLY.length; j++) if (PLY[j].pl === u.pl) { x = PLY[j]; break; }
			if (!x) continue;
			var v = ultVal(u), r = u.pl.BHasClass && u.pl.BHasClass('UltimateCooldownReady'), sv = v && v !== '0' && !r ? v : '';
			V[x.k] = sv; if (x.h) V[lc(x.h)] = sv; if (sv) n++;
		}
		var js = JSON.stringify({ rl: 1, t: 'ultw', v: V });
		if (js !== UW.last || now - UW.at > 3000) { UW.last = js; UW.at = now; try { $.DispatchEvent('ClientUI_FireOutput', js); } catch (e) {} }
		UW.on = n; UW.n = 0;
		for (var k in UW.ack) { if (now - UW.ack[k] < 8000) UW.n++; else delete UW.ack[k]; }
	}

	// 0.24: Alt. Пока Alt зажат, игра ставит глобальный класс gDetailView всем GlobalClassListener (подписи умений, мини-карта).
	// Свой слушатель — в нашей копии citadel_hud_subtitles.xml (RestlessGCL), запасной — minimap_persp из hud.xml.
	// «Мелочи — только по Alt» (ALTM): буст на канате, нагрузка мода и урна / разлом / мост, пока до них больше 2 минут.
	var ALT = { L: [], f: 0, on: false, found: false, shop: false };
	function altTick() {
		if (ALT.f-- <= 0 && ALT.L.length < 2) { ALT.f = 40; ALT.L = []; ['RestlessGCL', 'minimap_persp'].forEach(function (id) { var x = HUD.FindChildTraverse(id); if (ok(x)) ALT.L.push(x); }); ALT.found = ALT.L.length > 0; }
		// GlobalClassListener ставит класс своему РОДИТЕЛЮ (CitadelZiplineBoostIcon.gDetailView, .gShopOpen.hud_hero_testing_root) — смотрим и туда
		var v = false, sh = false;
		for (var i = 0; i < ALT.L.length; i++) { var x = ALT.L[i]; if (!ok(x)) continue; var pp = null; try { pp = x.GetParent(); } catch (e) {}
			try { if (x.BHasClass('gDetailView') || (ok(pp) && pp.BHasClass('gDetailView'))) v = true; if (x.BHasClass('gShopOpen') || (ok(pp) && pp.BHasClass('gShopOpen'))) sh = true; } catch (e) {} }
		ALT.on = v; ALT.shop = sh;
	}
	function quiet() { return on('ALTM') && !ALT.on; }
	// 0.25: меню песочницы в укрытии (как QoL Lite; Андрей: «настройки лобби — добавить врага, союзника»). Меню игры CitadelHudHeroTesting
	// в укрытии есть, но стиль игры его прячет (.connectedToHideout .hud_hero_testing_root { collapse }). Показываем стилем на самой панели;
	// открыт магазин — прячем (у меню свой слушатель gShopOpen). Выключено или вышли в матч — отдаём игре.
	var SB = { p: null, f: 0, set: false, st: '' };
	function sbxTick() {
		if (HIDE && !SB.h) SB.f = 0;   // зашли в укрытие — искать сразу
		SB.h = HIDE;
		if (!HIDE && !SB.set) { SB.st = T('sbMatch'); return; }   // меню песочницы бывает только в укрытии — в матче не ищем
		if (!ok(SB.p) && SB.f-- <= 0) { SB.f = 20; var L = []; try { L = HUD.FindChildrenWithClassTraverse('hud_hero_testing_root') || []; } catch (e) {} SB.p = L[0] || null; }
		if (!ok(SB.p)) { SB.st = T('sbNo'); return; }
		var shop = false; try { shop = SB.p.BHasClass('gShopOpen'); } catch (e) {}
		var want = on('SBX') && HIDE && !shop;
		SB.st = want ? T('sbOn') : HIDE ? T('sbOff') : T('sbMatch');
		if (want) { try { SB.p.style.visibility = 'visible'; } catch (e) {} SB.set = true; }
		else if (SB.set) { try { SB.p.style.visibility = null; } catch (e) {} SB.set = false; }
	}
	// 0.25: активные предметы у прицела (Андрей: «активные предметы по центру — лучше даже когда в КД?» — да, всегда).
	// Кнопки предметов — CitadelHudAbilityButton в #ActiveAbilitiesMenu (слоты item_1…4), id = имя предмета + «_» (как у буста на канате).
	// На перезарядке у кнопки класс inCooldown, секунды — {s:cooldown_sec}. Картинка — из файлов игры по таблице AIT (deadlock-api, 53 активных).
	// Готов — ярко с жёлтой рамкой, на перезарядке — тускло с секундами.
	var AIT = {"upgrade_non_player_bonus_sacrifice":"w/cultist_sacrifice","upgrade_capacitor":"w/capacitor","upgrade_dps_aura":"w/heroic_aura","upgrade_targeted_silence":"s/silence_glyph","upgrade_haunting_scream":"b/haunting_scream","upgrade_silencer":"w/silencer","upgrade_reduce_debuff_duration":"v/debuff_remover","upgrade_metal_skin":"v/metal_skin","upgrade_grit":"v/grit","upgrade_return_fire":"v/return_fire","upgrade_shadow_step":"b/shadow_step","upgrade_containment":"s/slowing_hex","upgrade_spirit_sap":"s/spirit_sap","upgrade_focus_lens":"s/focus_lens","upgrade_withering_whip":"s/rusted_barrel","upgrade_greater_withering_whip":"s/disarming_hex","upgrade_rescue_beam":"v/rescue_beam","upgrade_rupture":"s/decay","upgrade_discord":"s/scourge","upgrade_target_stun":"s/knockdown","upgrade_phantom_strike":"v/phantom_strike","upgrade_warp_stone":"v/warp_stone","upgrade_aoe_root":"s/vortex_web","upgrade_ability_refresher":"s/refresher","upgrade_ability_power_shard":"s/echo_shard","upgrade_cloaking_device_active":"w/shadow_weave","upgrade_rocket_booster":"v/majestic_leap","upgrade_health_nova":"v/healing_nova","upgrade_restorative_locket":"v/restorative_locket","upgrade_health_stimpak":"v/healing_rite","upgrade_shrink_ray":"b/shrink_ray","upgrade_infuser":"v/infuser","upgrade_guardian_ward":"v/guardian_ward","upgrade_divine_barrier":"v/divine_barrier","upgrade_thermal_detonator":"w/alchemical_fire","upgrade_blood_tribute":"w/blood_tribute","upgrade_fleetfoot_boots":"w/fleetfoot","upgrade_unstoppable":"v/unstoppable","upgrade_colossus":"v/colossus","upgrade_cold_front":"s/cold_front","upgrade_arctic_blast":"s/arctic_blast","upgrade_self_bubble":"s/ethereal_shift","upgrade_glitch":"s/curse","upgrade_fury_trance":"v/fury_trance","upgrade_surging_power":"v/vampiric_burst","upgrade_split_shot":"w/split_shot","upgrade_magic_carpet":"s/magic_carpet","upgrade_mystical_piano":"b/mystical_piano","upgrade_nullification_aura":"b/nullification_aura","upgrade_celestial_guidance":"b/celestial_guidance","upgrade_prism_blast":"b/prism_blast","upgrade_unstable_concoction":"b/unstable_concoction","upgrade_goose_egg":"s/goose_egg"};
	var AI = { menu: null, f: 0, B: [], sig: '', row: null, cells: [], st: '' };
	function aitFind() {
		if (!ok(AI.menu)) AI.menu = HUD.FindChildTraverse('ActiveAbilitiesMenu');
		var L = [], walk = function (p, d) { if (!ok(p) || d > 4) return; var n = 0; try { n = p.GetChildCount(); } catch (e) {} for (var i = 0; i < n; i++) { var c = p.GetChild(i); if (!ok(c)) continue; if (c.paneltype === 'CitadelHudAbilityButton') L.push(c); else walk(c, d + 1); } };
		walk(AI.menu, 0);
		AI.B = L;
	}
	function aitKey(b) {
		var id = String(b.id || '').replace(/_+$/, '');
		if (AIT[id]) return id;
		for (var k in AIT) try { if (b.BHasClass(k)) return k; } catch (e) {}
		return '';
	}
	function aitTick() {
		if (!on('AIT') || HM) { if (ok(AI.row)) setVis(AI.row, false); AI.st = ''; return; }
		if (AI.f-- <= 0) { AI.f = 8; aitFind(); }
		var L = [];
		for (var i = 0; i < AI.B.length; i++) { var b = AI.B[i]; if (!ok(b)) continue; var k = aitKey(b); if (!k) continue;
			var cd = false; try { cd = b.BHasClass('inCooldown'); } catch (e) {}
			var sec = ''; if (cd) { try { sec = $.Localize('{s:cooldown_sec}', b); } catch (e) {} if (!sec || sec.indexOf('{') >= 0) { var cl = null; try { cl = (b.FindChildrenWithClassTraverse('cooldownSeconds') || [])[0]; } catch (e) {} sec = cl ? txt(cl) : ''; } }
			L.push({ k: k, cd: cd, sec: String(sec || '').replace(/[^0-9.:]/g, '').replace(/\.\d+$/, '') }); }
		AI.st = L.length + (L.length ? ' (' + L.map(function (x) { return x.cd ? x.sec || 'КД' : '✓'; }).join(' ') + ')' : '');
		if (!L.length) { if (ok(AI.row)) setVis(AI.row, false); return; }
		var sig = L.map(function (x) { return x.k; }).join(',');
		if (!ok(AI.row) || sig !== AI.sig) {
			var o = HUD.FindChildTraverse('RestlessAit'); if (ok(o)) o.DeleteAsync(0);
			AI.row = mk('Panel', HUD, 'RestlessAit', { horizontalAlign: 'center', verticalAlign: 'center', marginTop: '170px', flowChildren: 'right', zIndex: '40' }, { hittest: 'false', hittestchildren: 'false' });
			AI.cells = L.map(function (x) {
				var c = mk('Panel', AI.row, '', { width: '36px', height: '36px', marginLeft: '3px', marginRight: '3px', borderRadius: '7px', border: '2px solid #00000000', backgroundColor: '#121014c0' });
				var im = mk('Image', c, '', { width: '100%', height: '100%' }, { hittest: 'false', scaling: 'stretch-to-fit-preserve-aspect' });
				var it = AIT[x.k]; try { im.SetImage(IMG + 'items/' + ITF[it.charAt(0)] + '/' + it.slice(2) + '_psd.vtex'); } catch (e) {}
				var l = lab(c, '', { horizontalAlign: 'center', verticalAlign: 'center', fontSize: '15px', fontWeight: 'bold', color: '#ffffff', textShadow: '0px 0px 3px 2.0 #000000' });
				return { c: c, im: im, l: l, cd: null };
			});
			AI.sig = sig;
		}
		for (var j = 0; j < L.length; j++) { var q = AI.cells[j], x = L[j]; if (!q) continue;
			if (q.cd !== x.cd) { q.cd = x.cd; q.im.style.opacity = x.cd ? '0.38' : '1'; q.c.style.border = x.cd ? '2px solid #00000000' : '2px solid ' + A; }
			setText(q.l, x.cd ? x.sec : ''); }
		setVis(AI.row, true);
	}
	// 0.25: сборка одной кнопкой (Андрей: «чтобы чел нажимал 1 кнопку и у него билд сразу выбирался, а не код копировать»).
	// В окне сборок игры (citadel_ui_build_selector: поле SearchTextEntry, кнопка RefreshButton) — наша кнопка «★ RESTLESS».
	// Нажал — номер лучшей сборки на своего героя (свой — CitadelHudTopBarPlayer.LocalPlayer) вписывается в поиск игры и поиск запускается.
	// Номер даёт страница сайта bld.html (скрытый CitadelHTMLPanel, ответ заголовком RL_BLD:<герой>:<номер>[:p]): сначала сборка,
	// выбранная на сайте внутри игры (LIVE · 12), иначе — как «Рекомендованный билд» на сайте.
	var BL = { se: null, rb: null, btn: null, lb: null, p: null, hid: '', id: '', fromSite: false, want: false, f: 0, st: '', n: 0 };
	function bldHero() { for (var i = 0; i < PLY.length; i++) try { if (ok(PLY[i].pl) && PLY[i].pl.BHasClass('LocalPlayer')) return String(PLY[i].hid || LK.hero[PLY[i].k] || PLY[i].h || ''); } catch (e) {} return ''; }
	function bldTitle(a, b) {
		var t = typeof b === 'string' ? b : typeof a === 'string' ? a : '', m = /^RL_BLD:(\d+):(\d+)(:p)?$/.exec(t);
		if (!m) return;
		BL.id = m[2] !== '0' ? m[2] : ''; BL.fromSite = !!m[3];
		bldPaint();
		if (BL.want) bldApply();
	}
	function bldLoad(h) {
		if (!h) return;
		if (!ok(BL.p)) { try { BL.p = mk('CitadelHTMLPanel', HUD, 'RestlessBld' + TOKEN, { width: '2px', height: '2px', opacity: '0.01', horizontalAlign: 'left', verticalAlign: 'bottom' });
			$.RegisterEventHandler('HTMLTitle', BL.p, bldTitle); } catch (e) { BL.p = null; return; } }
		BL.hid = h; BL.id = ''; BL.n++;
		try { BL.p.SetURL(SITE + 'bld.html?h=' + encodeURIComponent(h) + '&n=' + BL.n); } catch (e) {}
	}
	function bldApply() {
		if (!BL.id || !ok(BL.se)) return;
		BL.want = false;
		try { BL.se.text = BL.id; } catch (e) {}
		try { $.DispatchEvent('Activated', ok(BL.rb) ? BL.rb : BL.se, 'mouse'); } catch (e) {}
		BL.st = (lang() === 'en' ? 'build ' : 'сборка ') + BL.id + (BL.fromSite ? (lang() === 'en' ? ' (from the site)' : ' (с сайта)') : '');
		$.Msg('[Restless] сборка в поиске: ' + BL.id);
	}
	function bldPaint() { if (ok(BL.lb)) setText(BL.lb, BL.want && !BL.id ? T('bldW') : BL.id ? (BL.fromSite ? T('bldP') : T('bldB')) : BL.hid ? T('bldN') : T('bldB')); }
	function bldTick() {
		var h0 = bldHero(); if (h0 && h0 !== BL.hid) bldLoad(h0);
		if (!ALT.shop) return;   // окно сборок бывает только в магазине — иначе не ищем
		if (!ok(BL.se) && BL.f-- <= 0) { BL.f = 2; BL.se = HUD.FindChildTraverse('SearchTextEntry'); BL.rb = ok(BL.se) ? (function () { var c = BL.se.GetParent(); for (var i = 0; i < 3 && ok(c); i++, c = c.GetParent()) { var r = kid(c, 'RefreshButton'); if (ok(r)) return r; } return null; })() : null; }
		if (!ok(BL.se)) return;
		var box = BL.se.GetParent(); if (!ok(box)) return;
		var host = box.GetParent() || box;
		if (!ok(BL.btn)) {
			var o = host.FindChildTraverse('RestlessBldBtn'); if (ok(o)) o.DeleteAsync(0);
			BL.btn = mk('Button', host, 'RestlessBldBtn', { padding: '6px 14px 6px 14px', marginLeft: '8px', borderRadius: '6px', backgroundColor: A, verticalAlign: 'center' });
			BL.lb = lab(BL.btn, '', { fontSize: '14px', fontWeight: 'bold', color: DARK });
			BL.btn.SetPanelEvent('onactivate', function () { BL.want = true; if (BL.id) bldApply(); else { bldLoad(bldHero() || BL.hid); } bldPaint(); });
		}
		bldPaint();
	}
	function f17Tick() {
		altTick();
		if (NT % 4 === 3) { try { bldTick(); } catch (e) { $.Msg('[Restless] сборка: ' + e); } }
		if (NT % 4 === 2) sbxTick();
		plyScan();
		amTick();
		if (NT % 2 === 0) { plyIds(); portTick(); cmbTick(); unsTick(); uwTick(); zipTick(); rbTick(); riftTick(); aitTick(); }
		if (NT % 4 === 1) { rankTick(); campTick(); spdTick(); omapTick(); boxTick(); }
		if (NT % 8 === 3) lrkTick();
	}

	// ---------- 0.19: набор Enchanted ----------
	// Буст на канате: значок умения citadel_ability_zipline_boost (классы on_cooldown / in_use, секунды — в context_label) и бафф в StatusEffects.
	// Секунд нет — считаем сами, как QoL Lock: бафф 32 с, перезарядка 6 минут с начала.
	var ZB = { c: null, src: null, se: null, f: 0, fm: 0, lb: null, use: false, end: 0, cd: 0, st: '' };
	function zipFind() {
		var gh = HUD.FindChildTraverse('gameplay_hud') || HUD, s = gh.FindChildTraverse('citadel_ability_zipline_boost_') || gh.FindChildTraverse('citadel_ability_zipline_boost');
		if (!ok(s)) { var L = []; try { L = gh.FindChildrenWithClassTraverse('citadel_ability_zipline_boost') || []; } catch (e) {} s = L[0] || null; }
		ZB.src = ok(s) ? s : null;
		if (!ok(ZB.se)) ZB.se = gh.FindChildTraverse('StatusEffects');
	}
	function zipSec(p) {
		var L = [p], c = kid(p, 'context_label'); if (ok(c)) L.unshift(c);
		for (var i = 0; i < L.length; i++) { var m = /(\d{1,3})(?:\.\d+)?/.exec(txt(L[i])); if (m && +m[1] > 0 && +m[1] <= 600) return +m[1]; }
		return 0;
	}
	function zipTick() {
		if (!on('ZIP') || HM) { if (ZB.c) setVis(ZB.c.p, false); ZB.st = ''; return; }
		if (!ok(ZB.src) && ZB.f-- <= 0) { ZB.f = 12 * Math.min(10, ++ZB.fm); zipFind(); }
		var now = Date.now(), s = ZB.src, cls = function (c) { try { return !!(s && s.BHasClass(c)); } catch (e) { return false; } };
		var buff = ok(ZB.se) ? ok(kid(ZB.se, 'status_citadel_ability_zipline_boost')) : false;
		var use = buff || cls('in_use'), cd = cls('on_cooldown') || cls('cooling_down');
		if (use && !ZB.use) { ZB.end = now + 32000; ZB.cd = now + 360000; }
		ZB.use = use;
		if (cd) { var sec = zipSec(s); if (sec) ZB.cd = now + sec * 1000; else if (ZB.cd <= now) ZB.cd = now + 360000; }
		else if (!use && cls('active')) ZB.cd = 0;
		var msg = '', col = '#5be08a';
		if (use) { msg = T('zipA') + Math.max(0, Math.ceil((ZB.end - now) / 1000)) + T('sec'); col = A; }
		else if (ZB.cd > now) { var l = Math.ceil((ZB.cd - now) / 1000); msg = Math.floor(l / 60) + ':' + ('0' + l % 60).slice(-2); col = MUTED; }
		else if (s) msg = T('zipR');
		ZB.st = msg;
		if (!msg || (quiet() && !use)) { if (ZB.c) setVis(ZB.c.p, false); return; }
		if (!ZB.c || !ok(ZB.c.p)) { var o = HUD.FindChildTraverse('RestlessZip'); if (ok(o)) o.DeleteAsync(0);
			ZB.c = chip(HUD, 'RestlessZip', ICO.ZIP, 15, { horizontalAlign: 'right', verticalAlign: 'top', marginTop: '230px', marginRight: '26px', zIndex: '40' }); }
		chipSet(ZB.c, msg, col);
	}
	// Скорость: у игры есть свой спидометр (hud_movement_speed: класс SpeedometerEnabled у родителя показывает число без графика) — включаем его.
	var SP = null, SPF = 0, SPON = false, SPDV = '';
	function spdTick() {
		if (!ok(SP)) { if (SPF-- > 0) return; SPF = 10; SP = HUD.FindChildTraverse('MovementSpeedPanel'); if (!ok(SP)) { SPDV = ''; return; } SPON = false; }
		var par = SP.GetParent(), want = on('SPD');
		if (ok(par) && want !== SPON) { try { if (want) par.AddClass('SpeedometerEnabled'); else par.RemoveClass('SpeedometerEnabled'); } catch (e) {} SPON = want; }
		var v = ''; try { v = $.Localize('{s:movement_speed}', SP); } catch (e) {}
		if (!v || v.indexOf('{') >= 0) { var l = kid(SP, 'MovementSpeedLabel'); v = l ? txt(l) : ''; }
		SPDV = want && v && v.indexOf('{') < 0 ? v.replace(/<[^>]*>/g, '').trim() : '';
	}
	// Нагрузка мода: сколько миллисекунд в секунду занимает такт скрипта (замер Date.now вокруг такта), раз в 4 с — в углу под надписью.
	var PF = { ms: 0, mx: 0, t0: 0, v: 0, m: 0, lb: null };
	function perfTick() {
		var now = Date.now();
		if (!PF.t0) PF.t0 = now;
		if (now - PF.t0 >= 4000) { PF.v = PF.ms * 1000 / (now - PF.t0); PF.m = PF.mx; PF.ms = 0; PF.mx = 0; PF.t0 = now; }
		if (!on('PERF') || MENU || quiet()) { if (ok(PF.lb)) setVis(PF.lb, false); return; }
		if (!ok(PF.lb)) PF.lb = HUD.FindChildTraverse('RestlessPerf');
		if (!ok(PF.lb)) PF.lb = lab(HUD, 'RestlessPerf', { horizontalAlign: 'left', verticalAlign: 'top', marginLeft: '24px', marginTop: '34px', fontSize: '13px', color: '#a89f90', zIndex: '50' });
		setText(PF.lb, T('perf') + PF.v.toFixed(1) + T('ms') + T('mx') + PF.m + ' ' + (lang() === 'en' ? 'ms' : 'мс')); setVis(PF.lb, true);
	}

	// ---------- 0.20: патроны и перезарядка у прицела, карта строений, кто что купил ----------
	// Патроны: числа самой игры weapon_ammo / weapon_ammo_max в ammo_panel (как у QoL Lock); перезарядка — у attack_delayed_progress_bar
	// (в reticle_status) класс has_active_reload. Подпись под прицелом; сами панели ищем раз в 2 с, пока не нашли, дальше реже.
	// 0.21: своих цифр нет. Число у прицела — родное ammo_panel игры (element_gun: по центру, y 80px). Включено — держим его видимым
	// (игра прячет его классом hide_clip_ammo) и, если HUD поставил панель далеко от центра, переносим к прицелу сдвигом; выключено — как решит игра.
	var AM = { gh: null, ap: null, rb: null, f: 0, fm: 0, lb: null, st: '', col: '', mv: '', vis: false, W: 0, H: 0, chk: 0, near: false };
	function amFind(wa, wr) {
		if (!ok(AM.gh)) AM.gh = HUD.FindChildTraverse('gameplay_hud') || HUD;
		var gh = AM.gh;
		if (wa && !ok(AM.ap)) { AM.ap = gh.FindChildTraverse('ammo_panel'); AM.mv = ''; AM.vis = false; AM.W = 0; }
		if (wr && !ok(AM.rb)) { var rs = gh.FindChildTraverse('reticle_status'); AM.rb = ok(rs) ? rs.FindChildTraverse('attack_delayed_progress_bar') : null; }
	}
	function amPos(p) {
		try { var r = p.GetPositionWithinWindow(); if (r && isFinite(r.x) && isFinite(r.y)) return r; } catch (e) {}
		var x = 0, y = 0, q = p, d = 0;
		try { while (ok(q) && d < 40) { x += +q.actualxoffset || 0; y += +q.actualyoffset || 0; q = q.GetParent(); d++; } } catch (e) {}
		return { x: x, y: y };
	}
	function amMove(want) {
		var p = AM.ap; if (!ok(p)) return;
		if (!want) {
			if (AM.mv) { try { p.style.transform = 'none'; } catch (e) {} AM.mv = ''; }
			if (AM.vis) { try { p.style.visibility = null; } catch (e) {} AM.vis = false; }
			return;
		}
		if (!AM.vis) { try { p.style.visibility = 'visible'; } catch (e) {} AM.vis = true; }
		var W = HUD.actuallayoutwidth, H = HUD.actuallayoutheight;
		if (!(W > 0) || !(p.actuallayoutwidth > 0)) return;
		if (AM.chk-- > 0) return;
		AM.chk = 8;
		if (AM.mv) { if (W === AM.W && H === AM.H) return; try { p.style.transform = 'none'; } catch (e) {} AM.mv = ''; return; }
		AM.W = W; AM.H = H;
		var pos = amPos(p), cx = pos.x + p.actuallayoutwidth / 2, cy = pos.y + p.actuallayoutheight / 2;
		AM.near = Math.abs(cx - W / 2) < W * 0.12 && Math.abs(cy - H / 2) < H * 0.2;
		if (AM.near) return;
		var sx = HUD.actualuiscale_x > 0 ? HUD.actualuiscale_x : 1, sy = HUD.actualuiscale_y > 0 ? HUD.actualuiscale_y : 1;
		var tr = 'translate3d(' + Math.round((W / 2 - cx) / sx) + 'px, ' + Math.round((H / 2 + 80 * sy - cy) / sy) + 'px, 0px)';
		try { p.style.transform = tr; AM.mv = tr; $.Msg('[Restless] патроны перенесены к прицелу: ' + tr); } catch (e) {}
	}
	function amTick() {
		var wa = on('AMMO') && !HIDE, wr = on('RLD') && !HM;
		if (((wa && !ok(AM.ap)) || (wr && !ok(AM.rb))) && AM.f-- <= 0) { AM.f = 16 * Math.min(8, ++AM.fm); amFind(wa, wr); }
		amMove(wa);
		var rel = false; try { rel = wr && ok(AM.rb) && AM.rb.BHasClass('has_active_reload'); } catch (e) {}
		AM.st = !wa ? '' : !ok(AM.ap) ? '' : (AM.mv ? T('amM') : T('amG')) + (AM.vis ? T('amV') : '');
		if (rel) AM.st += (AM.st ? ' · ' : '') + T('rld');
		if (!rel) { if (ok(AM.lb)) setVis(AM.lb, false); return; }
		if (!ok(AM.lb)) AM.lb = HUD.FindChildTraverse('RestlessAmmo');
		if (!ok(AM.lb)) AM.lb = lab(HUD, 'RestlessAmmo', { horizontalAlign: 'center', verticalAlign: 'center', marginTop: '118px', fontSize: '15px', fontWeight: 'bold',
			letterSpacing: '1px', color: A, textShadow: '0px 0px 4px 2.0 #000000', zIndex: '40' });
		setText(AM.lb, T('rld')); setVis(AM.lb, true);
	}
	// Карта строений: у верхней панели игры есть своя ObjectivesMap (башни и стражи), в матче стиль её прячет — показываем.
	var OM = { p: null, f: 0, on: false, st: '' };
	function omapTick() {
		var want = false;   // 0.24: карту строений убрали (Андрей: «убери её»), прежнее показанное — вернуть игре
		if (!ok(OM.p)) { OM.st = ''; if (!want || OM.f-- > 0) return; OM.f = 10; OM.p = ok(TB) ? kid(TB, 'ObjectivesMap') : null; if (!ok(OM.p)) return; OM.on = false; }
		OM.st = want ? T('sOmY') : '';
		if (want === OM.on) return;
		OM.on = want;
		var L = [OM.p]; try { L = L.concat(OM.p.FindChildrenWithClassTraverse('ObjectiveCtn') || []); } catch (e) {}
		for (var i = 0; i < L.length; i++) try { L[i].style.visibility = want ? 'visible' : null; } catch (e) {}
	}
	// Кто что купил: строки «последних покупок» в магазине игры (RecentPurchasesContainer: время, предмет, ступень; цвет — команда).
	// Новая строка — 8 с справа, до трёх сразу. Обновляет ли игра список при закрытом магазине — видно в «Что видит мод».
	var RB = { box: null, f: 0, fm: 0, seen: null, L: [], p: null, n: 0, pn: 0 };
	// 0.21 (Андрей: «надпись — в 100 раз лучше показывай иконку на васяне, который что-то купил»): иконка предмета — картинка самой игры
	// s2r://panorama/images/items/<папка>/<файл>_psd.vtex; название 	 файл — из deadlock-api (русские и английские названия).
	var ITM = {"увеличенный магазин":"w/basic_magazine","extended magazine":"w/basic_magazine","чудовищные патроны":"w/monster_rounds","monster rounds":"w/monster_rounds","жертвенный ритуал":"w/cultist_sacrifice","cultist sacrifice":"w/cultist_sacrifice","тесла-пули":"w/tesla_bullets","tesla bullets":"w/tesla_bullets","конденсатор":"w/capacitor","capacitor":"w/capacitor","разрывник":"w/hollow_point","hollow point":"w/hollow_point","вскрывающие патроны":"w/opening_rounds","opening rounds":"w/opening_rounds","скоростные патроны":"w/high_velocity_rounds","high-velocity rounds":"w/high_velocity_rounds","ударная кража здоровья":"v/melee_lifesteal","melee lifesteal":"v/melee_lifesteal","отпор":"v/rebuttal","rebuttal":"v/rebuttal","контрчары":"v/counterspell","counterspell":"v/counterspell","утяжелённые выстрелы":"w/weighted_shots","weighted shots":"w/weighted_shots","ближняя дистанция":"w/close_quarters","close quarters":"w/close_quarters","дальняя дистанция":"w/long_range","long range":"w/long_range","замедляющие пули":"w/slowing_bullets","slowing bullets":"w/slowing_bullets","ограничитель":"v/inhibitor","inhibitor":"v/inhibitor","душегубные пули":"w/spirit_shredder_bullets","spirit shredder":"w/spirit_shredder_bullets","героическая аура":"w/heroic_aura","heroic aura":"w/heroic_aura","волна безмолвия":"s/silence_glyph","silence wave":"s/silence_glyph","глушитель":"w/silencer","silencer":"w/silencer","берсерк":"w/berserker","berserker":"w/berserker","ярость":"w/frenzy","frenzy":"w/frenzy","вытягивающие пули":"v/siphon_bullets","siphon bullets":"v/siphon_bullets","усилитель выстрелов в голову":"w/headshot_booster","headshot booster":"w/headshot_booster","ослабляющий выстрел в голову":"w/weakening_headshot","weakening headshot":"w/weakening_headshot","прицельная стрельба":"w/sharp_shooter","sharpshooter":"w/sharp_shooter","охотник за головами":"w/headhunter","headhunter":"w/headhunter","спиритический разрыв":"w/spellslinger_headshots","spirit rend":"w/spellslinger_headshots","калечащий выстрел в голову":"w/crippling_headshot","crippling headshot":"w/crippling_headshot","мистический выстрел":"w/mystic_shot","mystic shot":"w/mystic_shot","удачный выстрел":"w/lucky_shot","lucky shot":"w/lucky_shot","стрельба в упор":"w/point_blank","point blank":"w/point_blank","токсичные пули":"w/toxic_bullets","toxic bullets":"w/toxic_bullets","рикошет":"w/ricochet","ricochet":"w/ricochet","добавочное здоровье":"v/extra_health","extra health":"v/extra_health","пулевая кража здоровья":"v/bullet_lifesteal","bullet lifesteal":"v/bullet_lifesteal","уменьшитель эффектов":"v/debuff_reducer","debuff reducer":"v/debuff_reducer","развеивание магии":"v/debuff_remover","dispel magic":"v/debuff_remover","спиритическая стойкость":"v/spirit_resilience","spirit resilience":"v/spirit_resilience","пулевая стойкость":"v/bullet_resilience","bullet resilience":"v/bullet_resilience","металлическая кожа":"v/metal_skin","metal skin":"v/metal_skin","усилитель лечения":"v/healing_booster","healing booster":"v/healing_booster","выдержка":"v/fortitude","fortitude":"v/fortitude","кровопийца":"v/leech","leech":"v/leech","беговые ботинки":"v/sprint_boots","sprint boots":"v/sprint_boots","собиратель трофеев":"v/trophy_collector","trophy collector":"v/trophy_collector","скоростная стойкость":"v/enduring_speed","enduring speed":"v/enduring_speed","превосходная выносливость":"v/stamina_mastery","stamina mastery":"v/stamina_mastery","спешная стрельба":"w/rapid_rounds","rapid rounds":"w/rapid_rounds","добавочная выносливость":"v/extra_stamina","extra stamina":"v/extra_stamina","аура охотника":"w/hunters_aura","hunter's aura":"w/hunters_aura","крепость":"v/grit","grit":"v/grit","оружейная защита":"v/weapon_shielding","weapon shielding":"v/weapon_shielding","спиритическая защита":"v/spirit_shielding","spirit shielding":"v/spirit_shielding","боевой жилет":"v/battle_vest","battle vest":"v/battle_vest","эмблема заклинателя":"v/enchanters_emblem","enchanter's emblem":"v/enchanters_emblem","добавочный спиритизм":"s/extra_spirit","extra spirit":"s/extra_spirit","мистическое восстановление":"s/mystic_regen","mystic regeneration":"s/mystic_regen","улучшенный спиритизм":"s/improved_spirit","improved spirit":"s/improved_spirit","спиритическое переполнение":"w/spiritual_overflow","spiritual overflow":"w/spiritual_overflow","обратный огонь":"v/return_fire","return fire":"v/return_fire","усиленное расширение":"s/greater_expansion","greater expansion":"s/greater_expansion","мистическое расширение":"s/mystic_reach","mystic expansion":"s/mystic_reach","добавочные заряды":"s/extra_charge","extra charge":"s/extra_charge","спиритическая кража здоровья":"v/spirit_lifesteal","spirit lifesteal":"v/spirit_lifesteal","измельчитель пулестойкости":"s/bullet_resist_shredder","bullet resist shredder":"s/bullet_resist_shredder","мистический отзвук":"s/mystic_reverb","mystic reverb":"s/mystic_reverb","мистический импульс":"s/mystic_burst","mystic burst":"s/mystic_burst","гроза танков":"s/tankbuster","tankbuster":"s/tankbuster","мистическая уязвимость":"s/mystic_vulnerability","mystic vulnerability":"s/mystic_vulnerability","гроза целителей":"v/healbane","healbane":"v/healbane","мистическое замедление":"s/mystic_slow","mystic slow":"s/mystic_slow","растущее воздействие":"s/escalating_exposure","escalating exposure":"s/escalating_exposure","спешные заряды":"s/rapid_recharge","rapid recharge":"s/rapid_recharge","всезарядная печать":"b/omnicharge_pendant","omnicharge signet":"b/omnicharge_pendant","сжатая перезарядка умения":"s/improved_cooldown","compress cooldown":"s/improved_cooldown","превосходная перезарядка умений":"s/superior_cooldown","superior cooldown":"s/superior_cooldown","трансцендентная перезарядка":"s/transcendent_cooldown","transcendent cooldown":"s/transcendent_cooldown","замедляющие чары":"s/slowing_hex","slowing hex":"s/slowing_hex","спиритическое истощение":"s/spirit_sap","spirit sap":"s/spirit_sap","фокусная линза":"s/focus_lens","focus lens":"s/focus_lens","ржавый ствол":"s/rusted_barrel","rusted barrel":"s/rusted_barrel","чары обезоруживания":"s/disarming_hex","disarming hex":"s/disarming_hex","спасательный луч":"v/rescue_beam","rescue beam":"v/rescue_beam","разложение":"s/decay","decay":"s/decay","кара":"s/scourge","scourge":"s/scourge","нокдаун":"s/knockdown","knockdown":"s/knockdown","фантомный удар":"v/phantom_strike","phantom strike":"v/phantom_strike","камень переноса":"v/warp_stone","warp stone":"v/warp_stone","паутинный вихрь":"s/vortex_web","vortex web":"s/vortex_web","обновитель":"s/refresher","refresher":"s/refresher","осколок эха":"s/echo_shard","echo shard":"s/echo_shard","терзающий пульс":"s/torment_pulse","torment pulse":"s/torment_pulse","обман смерти":"v/cheat_death","cheat death":"v/cheat_death","сплетение теней":"w/shadow_weave","shadow weave":"w/shadow_weave","грациозный скачок":"v/majestic_leap","majestic leap":"v/majestic_leap","вспышка исцеления":"v/healing_nova","healing nova":"v/healing_nova","живительный медальон":"v/restorative_locket","restorative locket":"v/restorative_locket","обряд лечения":"v/healing_rite","healing rite":"v/healing_rite","луч уменьшения":"b/shrink_ray","shrink ray":"b/shrink_ray","насытитель":"v/infuser","infuser":"v/infuser","заслон стража":"v/guardian_ward","guardian ward":"v/guardian_ward","божественный барьер":"v/divine_barrier","divine barrier":"v/divine_barrier","алхимический огонь":"w/alchemical_fire","alchemical fire":"w/alchemical_fire","кровавая дань":"w/blood_tribute","blood tribute":"w/blood_tribute","проворная поступь":"w/fleetfoot","fleetfoot":"w/fleetfoot","кинетический рывок":"w/kinetic_dash","kinetic dash":"w/kinetic_dash","колдовской порыв":"s/arcane_surge","arcane surge":"s/arcane_surge","неудержимость":"v/unstoppable","unstoppable":"v/unstoppable","колосс":"v/colossus","colossus":"v/colossus","холодный фронт":"s/cold_front","cold front":"s/cold_front","арктический взрыв":"s/arctic_blast","arctic blast":"s/arctic_blast","развоплощение":"s/ethereal_shift","ethereal shift":"s/ethereal_shift","проклятая реликвия":"s/curse","cursed relic":"s/curse","увеличитель длительности":"s/duration_extender","duration extender":"s/duration_extender","превосходная длительность":"s/superior_duration","superior duration":"s/superior_duration","стеклянная пушка":"w/glass_cannon","glass cannon":"w/glass_cannon","яростный экстаз":"v/fury_trance","fury trance":"v/fury_trance","порыв вампиризма":"v/vampiric_burst","vampiric burst":"v/vampiric_burst","витальный удар":"v/lifestrike","lifestrike":"v/lifestrike","спиритический удар":"s/spirit_strike","spirit strike":"s/spirit_strike","похищение спиритизма":"s/spirit_snatch","spirit snatch":"s/spirit_snatch","удар с зарядом":"w/melee_charge","melee charge":"w/melee_charge","сокрушительные кулаки":"w/crushing_fists","crushing fists":"w/crushing_fists","доспех прорицателя":"v/diviners_kevlar","diviner's kevlar":"v/diviners_kevlar","сияющее восстановление":"s/radiant_regeneration","radiant regeneration":"s/radiant_regeneration","безграничный спиритизм":"s/boundless_spirit","boundless spirit":"s/boundless_spirit","шквальный огонь":"w/burst_fire","burst fire":"w/burst_fire","добавочное восстановление":"v/extra_regen","extra regen":"v/extra_regen","прилив мощи":"s/surge_of_power","surge of power":"s/surge_of_power","подавитель":"s/suppressor","suppressor":"s/suppressor","ртутная перезарядка":"s/quicksilver_reload","quicksilver reload":"s/quicksilver_reload","ртутный магнум":"s/mercurial_magnum","mercurial magnum":"s/mercurial_magnum","усиливающий магазин":"w/intensifying_magazine","intensifying magazine":"w/intensifying_magazine","растущая стойкость":"w/escalating_resilience","escalating resilience":"w/escalating_resilience","быстрый стрелок":"w/swift_striker","swift striker":"w/swift_striker","незримый покров":"v/veil_walker","veil walker":"v/veil_walker","барьерная реакция":"v/reactive_barrier","reactive barrier":"v/reactive_barrier","непреклонность":"v/indomitable","indomitable":"v/indomitable","живительный выстрел":"w/restorative_shot","restorative shot":"w/restorative_shot","титанический магазин":"w/titanic_magazine","titanic magazine":"w/titanic_magazine","веерный выстрел":"w/split_shot","split shot":"w/split_shot","активная перезарядка":"w/active_reload","active reload":"w/active_reload","ковёр-самолёт":"s/magic_carpet","magic carpet":"s/magic_carpet","спиритический ожог":"s/spirit_burn","spirit burn":"s/spirit_burn","свиток молнии":"s/lightning_scroll","lightning scroll":"s/lightning_scroll","ведьмовской доспех":"v/witchmail","witchmail":"v/witchmail","целебный темп":"v/healing_tempo","healing tempo":"v/healing_tempo","бронебой":"w/armor_piercing_rounds","armor piercer":"w/armor_piercing_rounds","бесконечные патроны":"b/infinite_rounds","infinite rounds":"b/infinite_rounds","латная броня":"v/plated_armor","plated armor":"v/plated_armor","разрушитель чар":"v/spellbreaker","spellbreaker":"v/spellbreaker","громила":"v/juggernaut","juggernaut":"v/juggernaut","метатель чар":"w/spell_slinger","spellslinger":"w/spell_slinger","преследователь":"w/backstabber","stalker":"w/backstabber","экспресс-выстрел":"w/express_shot","express shot":"w/express_shot","крылья серафима":"b/icarus_wings","seraphim wings":"b/icarus_wings","мистическое фортепиано":"b/mystical_piano","mystical piano":"b/mystical_piano","обнуляющий импульс":"b/nullification_aura","nullification burst":"b/nullification_aura","небесное благословение":"b/celestial_guidance","celestial blessing":"b/celestial_guidance","вечный дар":"b/eternal_gift","eternal gift":"b/eternal_gift","мистическая связь":"b/patrons_blessing","mystic conduit":"b/patrons_blessing","терзающий выстрел":"b/eldritch_shot","haunting shot":"b/eldritch_shot","плащ возможностей":"b/cloak_of_opportunity","cloak of opportunity":"b/cloak_of_opportunity","рунные рукавицы":"b/runed_gauntlets","runed gauntlets":"b/runed_gauntlets","электротапки":"b/electric_slippers","electric slippers":"b/electric_slippers","призматический взрыв":"b/prism_blast","prism blast":"b/prism_blast","нестабильный отвар":"b/unstable_concoction","unstable concoction":"b/unstable_concoction","морозящий амулет":"b/frostbite","frostbite charm":"b/frostbite","теневой удар":"b/shadow_strike","shadow strike":"b/shadow_strike","баллистические чары":"w/alchemical_seal","ballistic enchantment":"w/alchemical_seal","прилив зарядов":"w/recharging_rounds","recharging rush":"w/recharging_rounds","золотое гусиное яйцо":"s/goose_egg","golden goose egg":"s/goose_egg"}, ITF = { w: 'weapon', v: 'vitality', s: 'spirit', b: 'brawl' };
	var HNM = {"инфернус":1,"семь":2,"виндикта":3,"леди гайст":4,"абрамс":6,"тень":7,"макгиннис":8,"парадокс":10,"динамо":11,"кельвин":12,"пелена":13,"холлидей":14,"бибоп":15,"калико":16,"серый коготь":17,"мо и мелкий":18,"заточка":19,"плющик":20,"дозорный":25,"ямато":27,"хлыст":31,"вязкус":35,"карман":50,"мираж":52,"гадюка":58,"синклер":60,"мина":63,"скиталец":64,"венатор":65,"виктор":66,"пейдж":67,"швейцар":69,"билли":72,"грейвс":76,"аполлон":77,"дохлый дэнни":78,"дрём":79,"сильвер":80,"селеста":81,"крысиный король":84,"соломон":85,"виолетта":86,"сестра хэрроу":87,"буся":88,"infernus":1,"seven":2,"vindicta":3,"lady geist":4,"abrams":6,"wraith":7,"mcginnis":8,"paradox":10,"dynamo":11,"kelvin":12,"haze":13,"holliday":14,"bebop":15,"calico":16,"grey talon":17,"mo & krill":18,"shiv":19,"ivy":20,"warden":25,"yamato":27,"lash":31,"viscous":35,"pocket":50,"mirage":52,"vyper":58,"sinclair":60,"mina":63,"drifter":64,"venator":65,"victor":66,"paige":67,"the doorman":69,"billy":72,"graves":76,"apollo":77,"deadman danny":78,"rem":79,"silver":80,"celeste":81,"rat king":84,"solomon":85,"violet":86,"nurse harrow":87,"baba":88};
	function itIcon(nm) { var v = ITM[lc(nm)]; return v ? 's2r://panorama/images/items/' + ITF[v.charAt(0)] + '/' + v.slice(2) + '_psd.vtex' : ''; }
	function rbRow(r) {
		var t = function (c) { var a = []; try { a = r.FindChildrenWithClassTraverse(c) || []; } catch (e) {} return a.length ? txt(a[0]) : ''; };
		var nm = t('recentModPurchaseName'), tr = t('recentModTierCost');
		var col = r.BHasClass('isTeam1Purchase') ? '#ffb630' : r.BHasClass('isTeam2Purchase') ? '#6fa8ff' : INK;
		if (!nm || nm.indexOf('{') >= 0) return null;
		// кто купил: у картинки героя в строке — hero_id; запасной путь — имя героя (подпись строки или переменная)
		var hid = '', hn = '';
		try { var im = r.FindChildTraverse('RecentPurchaseHeroImage'); if (ok(im) && +im.heroid > 0) hid = String(im.heroid); } catch (e) {}
		if (!hid) hid = dv(r, 'hero_id', 1, 3);
		hn = lc(t('recentModPurchaserHero') || t('HeroName'));
		if (!hid && hn && HNM[hn]) hid = String(HNM[hn]);
		return { s: T('buy') + nm + (tr && tr.indexOf('{') < 0 ? ' · ' + tr : ''), c: col, t: Date.now(), ic: itIcon(nm), hid: hid, hn: hn };
	}
	// на портрет игрока в верхней панели: иконка 6 с (свежая покупка заменяет прошлую)
	function rbPort(e) {
		if (!e.ic) return false;
		var x = null;
		for (var i = 0; i < PLY.length && !x; i++) { var y = PLY[i]; if ((e.hid && String(y.hid || LK.hero[y.k] || '') === e.hid) || (e.hn && y.h && lc(y.h) === e.hn)) x = y; }
		if (!x || !ok(x.area)) return false;
		if (!ok(x.bi)) { x.bi = kid(x.area, 'RestlessBuyIc'); if (!ok(x.bi)) x.bi = mk('Image', x.area, 'RestlessBuyIc', { width: '38px', height: '38px', horizontalAlign: 'center', verticalAlign: 'top', marginTop: '-4px',
			border: '2px solid #ffc83d', borderRadius: '7px', backgroundColor: '#121014', zIndex: '30' }, { hittest: 'false', scaling: 'stretch-to-fit-preserve-aspect' }); }
		try { x.bi.SetImage(e.ic); } catch (er) { return false; }
		if (x.bic !== e.c) { x.bic = e.c; try { x.bi.style.border = '2px solid ' + e.c; } catch (er) {} }
		x.bt = Date.now() + 6000; setVis(x.bi, true); RB.pn++;
		return true;
	}
	function rbTick() {
		var want = on('RBUY') && !HIDE, now0 = Date.now();
		for (var z = 0; z < PLY.length; z++) if (ok(PLY[z].bi) && (!want || now0 > (PLY[z].bt || 0))) setVis(PLY[z].bi, false);
		if (!want || MENU) { if (ok(RB.p)) setVis(RB.p, false); if (!want) { RB.seen = null; RB.L = []; } return; }
		if (!ok(RB.box)) { if (RB.f-- > 0) return; RB.f = 10 * Math.min(8, ++RB.fm); RB.box = HUD.FindChildTraverse('RecentPurchasesContainer'); if (!ok(RB.box)) return; RB.seen = null; }
		var K = [], n = RB.box.GetChildCount();
		for (var i = 0; i < n; i++) K.push(RB.box.GetChild(i));
		RB.n = n;
		if (RB.seen) for (var j = 0; j < K.length; j++) if (RB.seen.indexOf(K[j]) < 0) { var e = rbRow(K[j]); if (e && !rbPort(e)) RB.L.unshift(e); }
		RB.seen = K;
		var now = Date.now();
		RB.L = RB.L.filter(function (x) { return now - x.t < 8000; }).slice(0, 3);
		if (!RB.L.length) { if (ok(RB.p)) setVis(RB.p, false); return; }
		if (!ok(RB.p)) RB.p = HUD.FindChildTraverse('RestlessBuy');
		if (!ok(RB.p)) {
			RB.p = mk('Panel', HUD, 'RestlessBuy', { horizontalAlign: 'right', verticalAlign: 'top', marginTop: '272px', marginRight: '26px', flowChildren: 'down', zIndex: '40' }, { hittest: 'false' });
			for (var q = 0; q < 3; q++) { var rw = mk('Panel', RB.p, '', { horizontalAlign: 'right', marginTop: '4px', padding: '3px 10px 3px 4px', backgroundColor: '#121014c8', borderRadius: '7px', flowChildren: 'right' }, { hittest: 'false' });
				mk('Image', rw, '', { width: '26px', height: '26px', marginRight: '6px', verticalAlign: 'center' }, { hittest: 'false', scaling: 'stretch-to-fit-preserve-aspect' });
				lab(rw, '', { verticalAlign: 'center', fontSize: '14px', fontWeight: 'bold' }); }
		}
		for (var k = 0; k < 3; k++) { var rw2 = RB.p.GetChild(k), x = RB.L[k]; if (!ok(rw2)) continue; setVis(rw2, !!x); if (!x) continue;
			var im2 = rw2.GetChild(0), l = rw2.GetChild(1);
			if (ok(im2)) { if (im2.__s !== x.ic) { im2.__s = x.ic; try { if (x.ic) im2.SetImage(x.ic); } catch (er) {} } setVis(im2, !!x.ic); }
			if (ok(l)) { setText(l, x.s); if (l.__c !== x.c) { l.__c = x.c; l.style.color = x.c; } } }
		setVis(RB.p, true);
	}

	// ---------- 0.21: мини-карта — общий поиск; урна и разлом; настройки с сайта ----------
	// Мини-карту ищем по всему интерфейсу (ROOT), как QoL Lock: у Андрея лагеря «не нашлись» — HUD-поиск мог её не видеть.
	var MMI = ['hud_minimap', 'minimap_persp', 'minimap_container', 'HudMinimap'], MMS = { n: 0, cls: '', L: [], t: 0 };
	function mmEnsure() {
		if (ok(MM)) return true;
		if (MMF-- > 0) return false;
		MMF = 40 * Math.min(6, ++MMM);
		for (var i = 0; i < MMI.length && !ok(MM); i++) { try { MM = ROOT.FindChildTraverse(MMI[i]); } catch (e) { MM = null; } }
		return ok(MM);
	}
	// все метки мини-карты (map_button) — раз в 2 с; diag — какие классы есть (для проверки по скрину)
	function mmScan(diag) {
		if (!ok(MM)) return [];
		var now = Date.now();
		if (now - MMS.t < 2000 && !diag) return MMS.L;
		MMS.t = now;
		// 0.21: внутри мини-карты лежат и наши ~670 точек ящиков — обходим всю карту раз в 20 с, в остальное время — только
		// панели, в которых метки игры нашлись (их дети)
		var L = [];
		if (diag || !MMS.par || now - MMS.full > 20000) {
			try { L = MM.FindChildrenWithClassTraverse('map_button') || []; } catch (e) {}
			MMS.full = now; MMS.par = [];
			for (var pi = 0; pi < L.length; pi++) { var pa = L[pi].GetParent(); if (ok(pa) && MMS.par.indexOf(pa) < 0) MMS.par.push(pa); }
		} else {
			for (var pj = 0; pj < MMS.par.length; pj++) { var q = MMS.par[pj]; if (!ok(q)) { MMS.par = null; break; }
				var n = q.GetChildCount(); for (var c = 0; c < n; c++) { var ch = q.GetChild(c); if (ch && ch.BHasClass('map_button')) L.push(ch); } }
		}
		MMS.L = L; MMS.n = L.length;
		if (diag) {
			var seen = {}, out = [];
			for (var i = 0; i < L.length && out.length < 8; i++) {
				['neutral', 'neutral_weak', 'neutral_medium', 'neutral_large', 'capture_point', 'koth_warning', 'idol_spawn', 'idol_return_friendly', 'idol_return_enemy', 'idol_dropping', 'powerup_spawn', 'mid_boss', 'boss', 'player'].forEach(function (c) {
					if (!seen[c] && L[i].BHasClass(c)) { seen[c] = 1; out.push(c); } });
			}
			MMS.cls = out.join(', ');
		}
		return L;
	}
	// Урна: idol_spawn на мини-карте — лежит; у метки игрока класс PlayerIsHoldingIdol — несут (enemy — враги); idol_return_* — тоже несут.
	// Первая — в 10:00 (deadlock.wiki), после сдачи — следующая через ~5 мин (оценка, как у Deadlock Utils).
	// Разлом (koth): capture_point с koth_warning — откроется через 20 с; идёт, пока у KothCashInMeter классы capturing / contested / captured.
	// Иначе — оценка, как у QoL Lock: первый ≈ 12:20 ± 1:00, дальше каждые 7:00. Бафф на мосту: powerup_spawn с классом баффа; иначе ~5:00 / каждые 5:00.
	// Deadlock Utils рядом (атрибут DeadlockUtils_Instancia у HUD) — у него эти таймеры в верхней панели, мы не дублируем.
	var RU = { row: null, c: null, lb: null, st: '', col: '', du: false, duT: 0, inPlay: false, end: -1, kw: -1, km: null, kmf: 0 };
	var BUFFS = ['powerup_gun', 'powerup_casting', 'powerup_survival', 'powerup_movement', 'powerup_souls'];
	function mmss(v) { v = Math.max(0, Math.round(v)); return Math.floor(v / 60) + ':' + ('0' + v % 60).slice(-2); }
	function attr(p, k) { try { return ok(p) ? String(p.GetAttributeString(k, '') || '') : ''; } catch (e) { return ''; } }
	function duHere() {
		var now = Date.now();
		if (now - RU.duT < 5000) return RU.du;
		RU.duT = now;
		return (RU.du = !!(attr(HUD, 'DeadlockUtils_Instancia') || attr(ROOT, 'DeadlockUtils_Instancia')));
	}
	function cycle(s, first, every) { if (s < first) return first - s; return every - ((s - first) % every); }
	function riftTick() {
		RU.st = '';
		if (!on('RIFT') || HM || duHere()) { if (ok(RU.row)) setVis(RU.row, false); if (duHere()) RU.st = T('duNo'); return; }
		var s = clock(), L = mmEnsure() ? mmScan(false) : [], cp = null, sp = false, fr = false, en = false, bf = false;
		for (var i = 0; i < L.length; i++) { var b = L[i]; if (!ok(b)) continue;
			if (b.BHasClass('capture_point')) cp = b;
			if (b.BHasClass('idol_spawn')) sp = true;
			if (b.BHasClass('idol_return_friendly')) fr = true;
			if (b.BHasClass('idol_return_enemy')) en = true;
			if (b.BHasClass('PlayerIsHoldingIdol')) { if (b.BHasClass('enemy')) en = true; else fr = true; }
			if (!bf && b.BHasClass('powerup_spawn')) for (var k = 0; k < BUFFS.length; k++) if (b.BHasClass(BUFFS[k])) bf = true; }
		var inPlay = sp || fr || en;
		if (RU.inPlay && !inPlay && s >= 0) RU.end = s;
		RU.inPlay = inPlay;
		var uS = s < 0 ? 1e9 : s < 600 ? 600 - s : RU.end >= 0 && RU.end + 300 > s ? RU.end + 300 - s : cycle(s, 600, 300);
		var u = en ? T('urnEn') : fr ? T('urnFr') : sp ? T('urnOn') : s >= 0 && s < 600 ? T('urnIn') + mmss(600 - s) :
			s >= 0 ? T('urnAt') + mmss(uS) : '';
		var uNow = en || fr || sp || uS <= 120, rNow = false, gNow = false;
		if (!ok(RU.km) && RU.kmf-- <= 0) { RU.kmf = 40; RU.km = HUD.FindChildTraverse('KothCashInMeter'); }
		var disp = false; if (ok(RU.km)) for (var c = 0; c < 3; c++) if (RU.km.BHasClass(['capturing', 'contested', 'captured'][c])) disp = true;
		var r = '';
		if (cp && cp.BHasClass('koth_warning')) { if (RU.kw < 0) RU.kw = s; r = T('riftIn') + mmss(20 - (s - RU.kw)); rNow = true; }
		else {
			RU.kw = -1;
			if (disp) { rNow = true; var pr = ''; try { var a1 = digits(txt(kid(RU.km, 'KothCashInTeamLabel1'))), a2 = digits(txt(kid(RU.km, 'KothCashInTeamLabel2'))); if (a1 || a2) pr = ' · ' + Math.max(+a1 || 0, +a2 || 0) + '%'; } catch (e) {} r = T('riftOn') + pr; }
			else if (s >= 0) { var I = 740, R = 420, nx = s < I ? I : I + Math.ceil((s - I) / R) * R; if (nx - s < 1) nx += R; r = T('riftAt') + mmss(nx - 60) + '–' + mmss(nx + 60); rNow = nx - 60 - s <= 120; }
		}
		var g = bf ? T('brOn') : s >= 0 ? T('brAt') + mmss(cycle(s, 300, 300)) : '';
		gNow = bf || (s >= 0 && cycle(s, 300, 300) <= 120);
		RU.st = [u && 'урна ' + u, r && 'разлом ' + r, g && 'мост ' + g].filter(Boolean).join(' · ');
		// 0.24: за 2 минуты до появления (и пока идёт) — всегда; раньше — только по Alt
		if (quiet()) { if (!uNow) u = ''; if (!rNow) r = ''; if (!gNow) g = ''; }
		if (!u && !r && !g) { if (ok(RU.row)) setVis(RU.row, false); return; }
		if (!ok(RU.row)) {
			var o = HUD.FindChildTraverse('RestlessRift'); if (ok(o)) o.DeleteAsync(0);
			RU.row = mk('Panel', HUD, 'RestlessRift', { horizontalAlign: 'center', verticalAlign: 'top', marginTop: '92px', flowChildren: 'right', zIndex: '45' }, { hittest: 'false' });
			RU.c = [chip(RU.row, '', I_URN, 14, { marginRight: '6px' }), chip(RU.row, '', ICO.RIFT, 14, { marginRight: '6px' }), chip(RU.row, '', I_BR, 14, {})];
		}
		chipSet(RU.c[0], u, en ? '#ff6b5b' : fr ? '#5be08a' : sp ? A : INK);
		chipSet(RU.c[1], r, disp || (cp && cp.BHasClass('koth_warning')) ? A : INK);
		chipSet(RU.c[2], g, bf ? A : INK);
		setVis(RU.row, true);
	}
	// Ящики и золотые статуи на мини-карте. Разбит ящик или нет, игра интерфейсу не говорит — показываем, где они стоят (с 2:45; первые — в 3:00).
	// Позиции — deadlock-api /v1/assets/map (x, y ×1000 от размера картинки мини-карты). Слой — ребёнок hud_minimap: размер и переворот
	// (invert_map) у него общие с картой; 820 px и pre-transform-scale2d под настоящий размер — как у Deadlock Utils.
	var BXD = { c: '83,321;86,321;87,566;87,562;88,544;88,540;103,674;107,674;119,347;119,343;122,392;130,378;130,382;139,420;146,298;146,294;146,290;149,731;149,726;151,406;151,644;154,389;155,645;162,263;165,263;184,603;184,599;199,771;199,775;202,608;202,508;202,493;204,608;205,443;205,439;206,404;209,404;216,590;216,588;217,625;217,621;218,671;218,696;225,595;227,568;227,567;227,565;227,217;230,217;233,595;240,771;240,768;242,626;243,753;244,748;246,626;246,652;251,653;253,345;254,653;257,345;260,548;260,544;266,416;266,412;266,434;267,430;272,306;272,207;273,579;273,577;274,532;275,812;275,395;275,306;275,207;277,405;277,395;278,532;278,816;278,324;279,395;284,685;284,682;284,405;284,322;286,351;286,675;288,592;289,225;289,351;290,675;291,227;293,592;294,629;294,625;296,512;298,512;307,559;307,555;308,629;310,448;313,448;315,558;316,474;317,558;319,558;320,243;323,245;323,468;324,607;324,604;325,715;325,167;326,516;326,522;327,468;329,521;330,269;332,558;334,558;335,558;337,453;338,521;338,384;338,378;344,353;345,408;350,614;350,600;352,621;353,648;353,614;353,601;353,587;356,621;362,250;362,707;362,703;366,249;366,408;368,287;368,284;368,258;368,254;369,353;371,254;372,408;373,574;373,579;374,635;379,445;381,445;387,552;389,353;389,552;396,587;400,587;403,523;414,444;415,663;415,662;416,660;416,444;419,570;421,325;421,318;423,573;425,575;428,280;429,480;433,519;434,481;436,481;436,268;436,272;438,370;438,366;440,632;443,631;443,423;447,423;449,607;451,539;452,607;455,539;455,473;456,607;456,426;456,334;457,450;458,450;460,426;463,694;466,694;472,509;473,312;475,394;475,390;475,373;475,365;476,301;476,312;479,549;485,329;486,590;488,332;488,589;488,422;490,571;490,590;490,423;492,571;492,343;495,664;498,567;498,544;498,456;500,567;501,296;501,567;502,544;502,456;503,437;504,437;505,296;506,438;506,336;507,658;513,667;514,694;517,667;518,694;524,699;525,691;525,633;525,627;525,610;525,606;527,491;529,691;530,306;534,307;544,575;544,394;546,527;548,575;548,394;549,463;551,394;552,430;553,463;556,577;558,577;562,368;563,577;564,340;564,519;564,338;565,366;566,519;566,710;567,577;568,664;568,571;570,571;572,715;573,519;579,430;582,426;584,626;585,614;588,741;588,624;589,614;600,413;604,413;606,616;606,608;614,312;614,308;618,434;620,434;622,557;622,748;624,557;625,554;625,552;625,647;629,730;629,743;632,457;634,616;634,457;634,388;638,391;638,386;639,353;640,605;641,568;643,341;644,664;646,605;646,258;647,568;647,401;647,388;650,258;650,402;654,427;663,547;663,438;664,673;665,438;671,315;673,532;673,450;673,369;673,482;674,531;675,315;676,396;676,393;677,532;677,450;680,368;682,585;683,341;684,772;684,768;686,341;688,640;689,659;689,328;690,386;691,465;697,386;700,465;701,474;702,182;704,179;705,771;705,316;707,408;707,316;709,596;709,594;709,592;712,408;712,241;715,609;716,243;718,662;718,610;721,306;724,439;725,306;727,594;727,597;727,591;728,438;730,636;731,463;733,769;734,427;734,598;735,792;735,772;735,585;735,581;737,452;737,427;738,350;738,792;739,564;740,368;744,294;746,283;749,400;757,400;759,411;760,587;762,411;765,389;769,389;784,370;784,484;784,374;784,345;785,522;785,559;785,555;785,472;785,222;785,216;789,471;791,237;800,437;800,433;810,385;810,382;820,725;820,768;820,764;824,725;837,252;837,248;845,683;846,677;858,585;860,671;860,626;864,671;864,626;879,595;888,699;888,695;908,461;908,457;913,438;913,434;914,679;917,679', t: '53,472;64,526;68,360;95,604;150,319;166,763;219,664;223,541;234,412;244,608;250,557;262,675;266,390;285,526;296,696;304,192;318,455;322,282;326,530;330,433;331,635;347,595;350,560;358,408;363,353;364,614;375,353;380,408;382,699;383,465;389,744;410,255;413,529;426,332;464,533;470,683;472,486;472,516;475,370;476,456;478,544;487,468;513,533;520,456;524,544;525,630;528,484;528,514;529,320;536,467;577,589;594,472;604,735;629,255;638,613;638,562;650,613;650,562;658,726;662,448;674,570;682,546;688,715;703,316;708,640;717,347;721,316;740,425;749,297;751,361;759,778;769,587;779,459;793,351;908,396;917,645;924,522;927,476', g: '68,363;92,605;109,510;109,490;131,307;150,399;151,346;161,763;174,500;178,601;208,447;212,588;229,595;238,555;240,604;243,756;250,344;250,553;254,431;260,552;263,390;266,542;272,539;277,446;280,405;283,676;287,665;287,651;287,620;293,351;296,592;296,693;299,567;302,635;302,574;304,433;305,381;306,448;314,532;322,518;323,612;328,170;329,464;329,461;330,266;333,521;339,381;341,560;343,381;344,595;344,558;344,248;348,714;353,583;354,561;357,614;359,291;362,435;369,409;370,635;386,274;392,602;406,390;406,372;416,570;421,322;421,279;426,329;436,275;439,394;442,500;457,331;462,604;471,556;475,369;481,528;484,311;489,545;491,489;491,511;493,422;495,496;500,530;500,470;505,505;509,489;509,511;511,455;511,694;519,472;525,630;536,398;558,501;569,713;572,576;583,430;584,607;603,414;606,612;621,732;629,748;630,726;634,562;638,382;640,356;643,755;643,606;643,388;644,613;644,567;644,562;644,696;646,383;647,341;647,696;648,664;658,311;662,726;666,461;670,537;675,528;677,368;677,388;685,464;687,615;694,386;694,361;696,464;696,567;698,423;700,591;701,429;704,408;704,609;706,217;713,610;713,294;714,466;722,347;723,638;724,539;728,576;734,638;734,452;737,775;738,341;739,341;740,429;741,365;753,400;756,563;772,389;781,554;785,219;791,406;795,241;806,500;807,410;821,761;845,680;859,594;870,688;880,624;891,510;891,490;900,708;905,396;916,641' };
	// 0.22: вместо ~670 панелей (они и тянули FPS — мини-карта перерисовывается каждый кадр) — по одной картинке на тип:
	// restless/mm/c.png · t.png · g.png нашего сайта (tools/rl_mm_icons.py, те же позиции), как ранги — картинкой по ссылке.
	// Обычные ящики (их 423) по умолчанию выключены. «Время» — без значков: до 3:00 над мини-картой «Ящики через 0:42».
	var BX = { lay: null, mm: null, key: '', n: 0, typ: '', im: {}, tl: null }, BXT = 820, BXU = SITE + 'mm/', BXN = { c: 423, t: 78, g: 168 };
	function boxTick() {
		var s = clock(), tm = get('BOXV', 'ico') === 'tm', base = on('BOX') && !HIDE && mmEnsure();
		var typ = ['c', 't', 'g'].filter(function (k) { return on('BX' + k.toUpperCase()); }).join('');
		var want = base && !tm && typ && (s < 0 || s >= 165);
		// время до появления (оба режима: в «Значках» — пока значков ещё нет)
		var tl = base && s >= 0 && s < 190 && (tm || s < 165) ? (s < 180 ? T('bxIn') + mmss(180 - s) : T('bxNow')) : '';
		if (tl || ok(BX.tl)) {
			if (!ok(BX.tl) && tl) BX.tl = lab(MM, 'RestlessBoxT', { horizontalAlign: 'center', verticalAlign: 'top', marginTop: '6px', padding: '2px 8px 2px 8px',
				backgroundColor: '#121014d0', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', color: A, zIndex: '5' });
			if (ok(BX.tl)) { setText(BX.tl, tl); setVis(BX.tl, !!tl); }
		}
		if (!want) { if (ok(BX.lay)) setVis(BX.lay, false); BX.n = 0; return; }
		if (!ok(BX.lay) || BX.mm !== MM) {
			var old = kid(MM, 'RestlessBoxes'); if (ok(old)) old.DeleteAsync(0);
			BX.lay = mk('Panel', MM, 'RestlessBoxes', { width: BXT + 'px', height: BXT + 'px', zIndex: '2' }, { hittest: 'false', hittestchildren: 'false' });
			BX.mm = MM; BX.key = ''; BX.typ = ''; BX.im = {};
		}
		if (BX.typ !== typ) {
			BX.typ = typ; BX.n = 0;
			['c', 't', 'g'].forEach(function (k) {
				var w = typ.indexOf(k) >= 0;
				if (w && !ok(BX.im[k])) { BX.im[k] = mk('Image', BX.lay, '', { width: BXT + 'px', height: BXT + 'px' }, { hittest: 'false', scaling: 'stretch-to-fit-preserve-aspect' });
					try { BX.im[k].SetImage(BXU + k + '.png?v=1'); } catch (e) { $.Msg('[Restless] ящики: ' + e); } }
				if (ok(BX.im[k])) setVis(BX.im[k], w);
				if (w) BX.n += BXN[k];
			});
		}
		var sx = MM.actualuiscale_x > 0 ? MM.actualuiscale_x : 1, sy = MM.actualuiscale_y > 0 ? MM.actualuiscale_y : 1;
		var w = MM.actuallayoutwidth / sx, h = MM.actuallayoutheight / sy;
		if (!(w > 50)) return;
		var e = Math.round(w / BXT * 1000) / 1000, key = e + '|' + Math.round(h);
		if (key !== BX.key) { BX.key = key; sty(BX.lay, { position: Math.round((w - BXT) / 2) + 'px ' + Math.round((h - BXT) / 2) + 'px 0px', preTransformScale2d: String(e) }); }
		setVis(BX.lay, true);
	}

	// ---------- 0.21: моды рядом ----------
	// Моды с протоколом UMM (Enhanced Quickbuy и др.) шлют событие ClientUI_FireOutput: {umm:1, t:'register', id, name, settings:[…]};
	// на {umm:1, t:'hello'} отвечают тем же, {umm:1, t:'set', id, key, value} — меняет настройку. Мы — пульт: их переключатели в окне RESTLESS
	// и на сайте («Оверлей»), значения храним у себя (U.<мод>.<настройка>) и раздаём каждый раз, когда мод зарегистрировался.
	// Что ещё стоит рядом: Deadlock Utils (атрибут DeadlockUtils_Instancia), QoL Lock (Deadlock_Mod_Settings_v1) — только видим.
	var UMRX = /^U\.([a-z0-9_]{1,32})\.([a-z0-9_]{1,32})$/;
	var UM = { m: {}, ord: [], known: [], reg: false, hi: 0, hiN: 0, dirty: 1, img: null, sent: '', at: 0, seq: 0, sig: '' };
	function umKey(id, k) { return 'U.' + id + '.' + k; }
	function umRemember(k) { if (UM.known.indexOf(k) < 0) UM.known.push(k); }
	function umKeys() {
		var a = UM.known.slice();
		for (var i = 0; i < UM.ord.length; i++) { var m = UM.m[UM.ord[i]]; for (var j = 0; j < m.s.length; j++) { var k = umKey(m.id, m.s[j].id); if (a.indexOf(k) < 0) a.push(k); } }
		return a;
	}
	function umDef(s) { return s.type === 'toggle' ? (s.def === false ? 0 : 1) : (isFinite(+s.def) ? +s.def : s.min); }
	function umVal(id, s) { var v = get(umKey(id, s.id), ''); return v === '' ? umDef(s) : +v; }
	function umSet(id, k, v) { try { $.DispatchEvent('ClientUI_FireOutput', JSON.stringify({ umm: 1, t: 'set', id: id, key: k, value: v })); } catch (e) { $.Msg('[Restless] мод рядом: ' + e); } }
	function umSendK(id, k) {
		var m = UM.m[id]; if (!m) return;
		for (var i = 0; i < m.s.length; i++) if (m.s[i].id === k) umSet(id, k, m.s[i].type === 'toggle' ? umVal(id, m.s[i]) === 1 : umVal(id, m.s[i]));
	}
	function umApply(id) { var m = UM.m[id]; if (!m) return; for (var i = 0; i < m.s.length; i++) if (get(umKey(id, m.s[i].id), '') !== '') umSendK(id, m.s[i].id); }
	function umOn(payload) {
		if (typeof payload !== 'string' || payload.indexOf('"umm"') < 0) return;
		var o = null; try { o = JSON.parse(payload); } catch (e) { return; }
		if (!o || o.umm !== 1 || o.t !== 'register' || !/^[a-z0-9_]{1,32}$/.test(String(o.id || '')) || o.id === 'restless') return;
		var S = [];
		(o.settings || []).forEach(function (x) {
			if (!x || !/^[a-z0-9_]{1,32}$/.test(String(x.id || '')) || (x.type !== 'toggle' && x.type !== 'slider')) return;
			S.push({ id: x.id, type: x.type, label: String(x.label || x.id).slice(0, 40), def: x['default'], min: isFinite(+x.min) ? +x.min : 0, max: isFinite(+x.max) ? +x.max : 1, step: +x.step > 0 ? +x.step : 1 });
		});
		var fresh = !UM.m[o.id];
		UM.m[o.id] = { id: o.id, name: String(o.name || o.id).slice(0, 40), s: S.slice(0, 16) };
		if (UM.ord.indexOf(o.id) < 0) UM.ord.push(o.id);
		umApply(o.id); UM.dirty = 1;
		if (fresh) $.Msg('[Restless] мод рядом: ' + UM.m[o.id].name + ' · настроек ' + S.length);
		try { if (open) umPaint(); } catch (e) {}
	}
	function umInit() {
		if (UM.reg) return;
		UM.reg = true;
		try { $.RegisterForUnhandledEvent('ClientUI_FireOutput', umOn); } catch (e) { $.Msg('[Restless] моды рядом: ' + e); }
	}
	function umOthers() {
		var a = [];
		if (duHere()) a.push('Deadlock Utils');
		if (attr(HUD, 'Deadlock_Mod_Settings_v1') || attr(ROOT, 'Deadlock_Mod_Settings_v1')) a.push('QoL Lock');
		return a;
	}
	// hello: через 2 с, 15 с, 60 с после запуска, дальше раз в 5 минут (мод мог загрузиться позже нас)
	function umTick() {
		umInit();
		var now = Date.now();
		if (!UM.hi) UM.hi = now + 2000;
		if (now >= UM.hi) {
			UM.hiN++; UM.hi = now + (UM.hiN === 1 ? 13000 : UM.hiN === 2 ? 45000 : 300000);
			try { $.DispatchEvent('ClientUI_FireOutput', JSON.stringify({ umm: 1, t: 'hello', from: 'restless' })); } catch (e) {}
		}
		umReport(now);
	}
	// программе Restless (сайт → «Оверлей»): наши настройки, моды рядом и их настройки — картинкой на 127.0.0.1, как кто в матче
	function umReport(now) {
		var mods = UM.ord.map(function (id) { var m = UM.m[id]; return { id: id, n: m.name, s: m.s.map(function (x) { return [x.id, x.type === 'toggle' ? 't' : 's', x.label, umVal(id, x), x.min, x.max, x.step]; }) }; });
		var q = 'v=' + VER + '&c=' + encodeURIComponent(stStr()) + '&m=' + encodeURIComponent(JSON.stringify(mods)) + '&o=' + encodeURIComponent(umOthers().join('|'));
		if (q === UM.sent && now - UM.at < 30000) return;
		if (now - UM.at < 1500) return;
		if (!ok(UM.img)) {
			UM.img = HUD.FindChildTraverse('RestlessUm');
			if (!ok(UM.img)) UM.img = mk('Image', HUD, 'RestlessUm', { width: '2px', height: '2px', opacity: '0.02', horizontalAlign: 'left', verticalAlign: 'bottom' }, { hittest: 'false' });
		}
		UM.sent = q; UM.at = now; UM.seq++;
		try { UM.img.SetImage('http://127.0.0.1:27515/um.png?' + q + '&n=' + UM.seq); } catch (e) {}
	}
	// окно RESTLESS: «МОДЫ РЯДОМ» — у каждого мода его переключатели (как наши), у ползунка — значение по кругу min…max
	function umPaint() {
		if (!ok(P.umBox)) return;
		var oth = umOthers(), sig = UM.ord.map(function (id) { return id + ':' + UM.m[id].s.length; }).join(',') + '|' + oth.join(',');
		if (sig !== UM.sig) {
			UM.sig = sig;
			try { P.umBox.RemoveAndDeleteChildren(); } catch (e) {}
			P.um = [];
			UM.ord.forEach(function (id) {
				var m = UM.m[id];
				setText(lab(P.umBox, '', { width: '100%', fontSize: '15px', fontWeight: 'bold', color: INK, marginTop: '6px' }), m.name);
				if (!m.s.length) { P.um.push({ none: lab(P.umBox, '', { width: '100%', fontSize: '13px', color: MUTED }) }); return; }
				m.s.forEach(function (x) {
					var cell = mk('Panel', P.umBox, '', { width: '33.3%', flowChildren: 'right', padding: '4px 14px 4px 0px' });
					var t = lab(cell, '', { width: 'fill-parent-flow(1.0)', verticalAlign: 'center', fontSize: '15px', color: INK });
					setText(t, x.label);
					var b = mk('Button', cell, '', { width: '92px', height: '30px', borderRadius: '15px', verticalAlign: 'center' });
					var bl = lab(b, '', { horizontalAlign: 'center', verticalAlign: 'center', fontSize: '14px', fontWeight: 'bold' });
					b.SetPanelEvent('onactivate', function () {
						var v = umVal(id, x), nv = x.type === 'toggle' ? (v === 1 ? 0 : 1) : (v + x.step > x.max ? x.min : v + x.step);
						set(umKey(id, x.id), String(nv)); umSendK(id, x.id); UM.dirty = 1; umPaint();
					});
					P.um.push({ id: id, x: x, b: b, l: bl });
				});
			});
			if (oth.length) setText(lab(P.umBox, '', { width: '100%', fontSize: '13px', color: MUTED, marginTop: '6px' }), oth.join(' · '));
		}
		setVis(P.umH, !!(UM.ord.length || oth.length)); setVis(P.umBox, !!(UM.ord.length || oth.length));
		setText(P.umH, T('ummH'));
		for (var i = 0; i < P.um.length; i++) {
			var q = P.um[i];
			if (q.none) { setText(q.none, T('ummN')); continue; }
			var v = umVal(q.id, q.x), onv = q.x.type === 'toggle' ? v === 1 : true;
			setText(q.l, q.x.type === 'toggle' ? (onv ? T('yes') : T('no')) : String(v));
			q.b.style.backgroundColor = onv ? A : OFF; q.l.style.color = onv ? DARK : INK;
		}
	}
	// Настройки с сайта: вкладка «Оверлей» (в программе Restless) отдаёт набор программе, программа — на http://127.0.0.1:27515/cfg.html
	// заголовком RL_SET:<метка>:<настройки>. Мод раз в 8 с открывает эту страницу скрытым CitadelHTMLPanel; новая метка — применить и сохранить.
	var SS = { p: null, n: 0, got: 0, ap: 0, miss: 0, wait: 0 };
	var SET_URL = 'http://127.0.0.1:27515/cfg.html';
	function spTitle(a, b) {
		var t = typeof b === 'string' ? b : typeof a === 'string' ? a : '';
		var m = /^RL_SET:([0-9a-z]{1,12}):(.*)$/.exec(t);
		if (!m) return;
		SS.got++; SS.miss = 0;
		if (m[1] === '0' || m[1] === get('SETS', '')) return;
		var v = ''; try { v = decodeURIComponent(m[2] || ''); } catch (e) { return; }
		var L = v.split(';'), n = 0;
		for (var i = 0; i < L.length; i++) { var j = L[i].indexOf('='); if (j < 1) continue; var k = L[i].slice(0, j), w = L[i].slice(j + 1);
			var u = UMRX.exec(k);
			if (u && /^-?\d{1,4}$/.test(w)) { if (get(k, '') !== w) { set(k, w); umSendK(u[1], u[2]); n++; } continue; }
			if (keep(k) && k !== 'LANG' && k !== 'SETS' && /^[01]$/.test(w)) { set(k, w); n++; } }
		set('SETS', m[1]); SS.ap++; UM.dirty = 1;
		$.Msg('[Restless] настройки с сайта: ' + n);
		try { if (open) paint(); markTick(); } catch (e) {}
	}
	function setTick() {
		if (SS.wait-- > 0) return;
		SS.wait = SS.miss > 3 ? 120 : 32;
		if (!ok(SS.p)) {
			try { SS.p = mk('CitadelHTMLPanel', HUD, 'RestlessSet' + TOKEN, { width: '2px', height: '2px', opacity: '0.01', horizontalAlign: 'left', verticalAlign: 'bottom', visibility: 'visible' });
				$.RegisterEventHandler('HTMLTitle', SS.p, spTitle); } catch (e) { SS.p = null; return; }
		}
		SS.miss++; SS.n++;
		try { SS.p.SetURL(SET_URL + '?n=' + SS.n); } catch (e) {}
	}

	// ---------- 0.19: память настроек ----------
	// У модов Deadlock нет своего хранилища. Как QoL Lock: скрытая страница браузера игры (CitadelHTMLPanel) — restless/store.html на нашем сайте;
	// она держит настройки в localStorage этого браузера (на этом компьютере) и отвечает заголовком страницы: RL_CFG:…:<настройки> при загрузке,
	// RL_OK:<номер> после записи. Пишем, сменив только #… адреса (страница не перезагружается). Храним только свои переключатели, язык, время лагерей.
	// Что поменял до загрузки памяти, пока страница грузилась, — не затираем (список в RESTLESS_DIRTY). Нет связи — всё как в 0.18, до выхода из игры.
	var STORE = SITE + 'store.html?v=1';
	var KEEPK = ['ULT', 'ULTW', 'MARK', 'LINK', 'EVT', 'RANK', 'LRK', 'CAMP', 'MISS', 'THP', 'CMB', 'UNS', 'ZIP', 'SPD', 'PERF', 'AMMO', 'RLD', 'OMAP', 'RBUY', 'RIFT', 'BOX', 'BOXV', 'BXC', 'BXT', 'BXG', 'ALTM', 'AIT', 'SBX', 'LBR', 'LBH', 'LBS', 'LBP', 'LBC', 'LBB', 'LBT', 'LBK', 'LANG', 'SETS',
		'CRS_neutral_weak', 'CRS_neutral_medium', 'CRS_neutral_large'];
	function keep(k) { return KEEPK.indexOf(k) >= 0 || UMRX.test(k); }
	var ST = { p: null, at: 0, tries: 0, ok: false, n: 0, q: 0, dirty: 0, sent: 0, sentQ: 0, sentFor: 0, saved: 0, err: '' };
	function stDirty(k) {
		var d = get('DIRTY', '');
		if ((',' + d + ',').indexOf(',' + k + ',') < 0) set('DIRTY', d ? d + ',' + k : k, true);
		ST.dirty = Date.now();
	}
	function stLoad(raw) {
		var s = ''; try { s = decodeURIComponent(raw || ''); } catch (e) { s = ''; }
		var d = ',' + get('DIRTY', '') + ',', n = 0, L = s.split(';');
		for (var i = 0; i < L.length; i++) {
			var j = L[i].indexOf('='); if (j < 1) continue;
			var k = L[i].slice(0, j), v = L[i].slice(j + 1);
			if (!keep(k) || !/^[\w.-]{1,12}$/.test(v)) continue;
			n++;
			if (UMRX.test(k)) umRemember(k);
			if (d.indexOf(',' + k + ',') < 0) set(k, v, true);
		}
		ST.ok = true; ST.n = n; ST.err = '';
		if (d !== ',,') ST.dirty = Date.now();
		$.Msg('[Restless] память настроек: загружено ' + n);
		for (var mi = 0; mi < UM.ord.length; mi++) umApply(UM.ord[mi]);
		try { if (open) paint(); } catch (e) {}
	}
	function stTitle(a, b) {
		var t = typeof b === 'string' ? b : typeof a === 'string' ? a : '';
		var m = /^RL_CFG:[^:]*:(.*)$/.exec(t);
		if (m) { if (!ST.ok) stLoad(m[1]); return; }
		m = /^RL_OK:(\d+)/.exec(t);
		if (m) { if (+m[1] === ST.sentQ && ST.sentFor) { ST.saved++; if (ST.sentFor === ST.dirty) { ST.dirty = 0; set('DIRTY', '', true); } ST.sentFor = 0; } return; }
		if (/^RL_ERR/.test(t)) ST.err = t.slice(7, 60);
	}
	function stStr() { var a = [], K = KEEPK.concat(umKeys()); for (var i = 0; i < K.length; i++) { var v = get(K[i], ''); if (v) a.push(K[i] + '=' + v); } return a.join(';'); }
	function storeTick(parent) {
		var now = Date.now();
		if (!ok(ST.p)) {
			if (ST.at && now - ST.at < 5000) return;
			ST.at = now; ST.ok = false;
			try { var o = get('STP', ''); o = o ? ROOT.FindChildTraverse(o) : null; if (ok(o)) o.DeleteAsync(0); } catch (e) {}
			try {
				var id = 'RestlessStore' + TOKEN;
				ST.p = mk('CitadelHTMLPanel', parent, id, { width: '2px', height: '2px', opacity: '0.01', horizontalAlign: 'left', verticalAlign: 'bottom', visibility: 'visible' });
				set('STP', id, true);
				$.RegisterEventHandler('HTMLTitle', ST.p, stTitle);
				ST.p.SetURL(STORE);
			} catch (e) { ST.err = String(e).slice(0, 60); $.Msg('[Restless] память настроек: ' + e); }
			return;
		}
		if (!ST.ok) {
			if (now - ST.at > 12000 && ST.tries < 4) { ST.tries++; ST.at = now; try { ST.p.SetURL(STORE); } catch (e) {} }
			return;
		}
		if (ST.dirty && now - ST.dirty >= 800 && (ST.sentFor !== ST.dirty || now - ST.sent > 5000)) {
			ST.q++; ST.sentQ = ST.q; ST.sentFor = ST.dirty; ST.sent = now;
			try { ST.p.SetURL(STORE + '#' + encodeURIComponent(JSON.stringify({ q: ST.q, f: 'set', v: stStr() }))); } catch (e) { ST.err = String(e).slice(0, 60); }
		}
	}

	// ---------- общий такт ----------
	function tick() {
		if (!ok(ctx)) return;
		if (mine()) {
			var t0 = Date.now();
			try { storeTick(HUD); } catch (e) { $.Msg('[Restless] память: ' + e); }
			try { setTick(); } catch (e) { $.Msg('[Restless] сайт: ' + e); }
			try { umTick(); } catch (e) { $.Msg('[Restless] моды рядом: ' + e); }
			try { hideTick(); } catch (e) { $.Msg('[Restless] укрытие: ' + e); }
			try { markTick(); } catch (e) { $.Msg('[Restless] надпись: ' + e); }
			try { menuTick(); } catch (e) { $.Msg('[Restless] меню: ' + e); }
			try { liveTick(); } catch (e) { $.Msg('[Restless] лайв: ' + e); }
			try { winTick(); } catch (e) { $.Msg('[Restless] окно: ' + e); }
			try { ultTick(); } catch (e) { $.Msg('[Restless] ульта: ' + e); }
			try { evtTick(); } catch (e) { $.Msg('[Restless] события: ' + e); }
			try { lkTick(); } catch (e) { $.Msg('[Restless] связь: ' + e); }
			try { lkProbe(); } catch (e) { $.Msg('[Restless] профили: ' + e); }
			try { oldTick(); } catch (e) { $.Msg('[Restless] старое: ' + e); }
			try { f17Tick(); } catch (e) { $.Msg('[Restless] 0.17: ' + e); }
			try { seeTick(false); } catch (e) { $.Msg('[Restless] проверка: ' + e); }
			try { perfTick(); } catch (e) { $.Msg('[Restless] нагрузка: ' + e); }
			var dt = Date.now() - t0; PF.ms += dt; if (dt > PF.mx) PF.mx = dt;
			$.Schedule(0.25, tick);
		} else {
			$.Schedule(1.0, tick);
		}
	}

	// ---------- главное меню: только надпись, что мод загружен ----------
	function menuMarkTick(r) {
		if (!ok(ctx)) return;
		try {
			var m = r.FindChildTraverse('RestlessMenuMark');
			if (!ok(m)) {
				m = lab(r, 'RestlessMenuMark', { horizontalAlign: 'left', verticalAlign: 'bottom', marginLeft: '28px', marginBottom: '22px',
					fontSize: '18px', fontWeight: 'bold', color: A, zIndex: '50' });
				$.Msg('[Restless] надпись в главном меню');
			}
			storeTick(r);
			setVis(m, on('MARK'));
			setText(m, lang() === 'en' ? 'RESTLESS ' + VER + ' · running · Esc button is in a match' : 'RESTLESS ' + VER + ' · работает · кнопка — в матче по Esc');
		} catch (e) { $.Msg('[Restless] надпись меню: ' + e); }
		$.Schedule(2.0, function () { menuMarkTick(r); });
	}

	// ---------- запуск: ждём, пока панель окажется в HUD или в главном меню ----------
	var tries = 0, menuOn = false;
	function climb() { var r = ctx; try { while (r.GetParent && r.GetParent()) r = r.GetParent(); } catch (e) {} return r; }
	function boot() {
		if (!ok(ctx)) return;
		var r = climb(), em = null, dash = null;
		try { em = r.FindChildTraverse('EscapeMenu'); } catch (e) {}
		if (ok(em)) {
			ROOT = r;
			HUD = (r.id === 'Hud' || r.paneltype === 'CitadelHud') ? r : (r.FindChildTraverse('Hud') || r);
			$.Msg('[Restless] ' + VER + ' запущен в HUD через ' + HOOK + ' (попытка ' + tries + ')');
			tick();
			return;
		}
		// главное меню: этот файл — сам dashboard (корень CitadelDB) или стоит внутри него
		var p = ctx, inDash = false;
		try { while (p) { if (p.paneltype === 'CitadelDB') { inDash = true; break; } p = p.GetParent ? p.GetParent() : null; } } catch (e) {}
		if (inDash) {
			if (ctx.paneltype === 'CitadelDB' && !menuOn) {
				menuOn = true; ROOT = ctx;
				$.Msg('[Restless] ' + VER + ' главное меню');
				menuMarkTick(ctx);
			}
			return;
		}
		tries++;
		if (tries < 2400) $.Schedule(tries < 40 ? 0.25 : 1.0, boot);
		else $.Msg('[Restless] ' + VER + ' HUD так и не найден: ' + HOOK);
	}
	boot();
})();
                                                                                                                                                                                                                                                                                                                                                                 