// Restless 0.18.
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
// Настройки держатся до выхода из игры.
(function () {
	var VER = '0.18';
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
	function set(k, v) {
		v = String(v); MEM[k] = v;
		try { if (ROOT.SetAttributeString) ROOT.SetAttributeString('RESTLESS_' + k, v); } catch (e) {}
	}
	// 0.17: новые функции Medium по умолчанию выключены (набор Lite)
	var DEF = { MISS: '0', THP: '0', CMB: '0', UNS: '0' };
	function on(k) { return get(k, DEF[k] || '1') === '1'; }
	function lang() { return get('LANG', 'ru') === 'en' ? 'en' : 'ru'; }

	var TX = {
		ru: {
			mark: 'RESTLESS ' + VER + ' · работает', markMenu: ' · кнопка в Esc',
			settings: 'настройки мода · ' + VER, inGame: 'В ИГРЕ',
			ultT: 'КД ульты в верхней панели', ultS: 'секунды поверх значка ульты у каждого игрока — в матче',
			markT: 'Надпись RESTLESS', markS: 'слева сверху — видно, что мод работает',
			evtT: 'Напоминания о событиях', evtS: 'за 15 с до лагерей, ящиков и статуй — по часам матча',
			evIn: 'Через ', evSec: ' с: ', evNow: 'Появились: ',
			ev1: 'малые лагеря', ev2: 'ящики и золотые статуи', ev3: 'средние лагеря · ящики в тоннелях и на Колокольне', ev4: 'большие лагеря', ev5: 'ящики и статуи под Times Square',
			linkT: 'Связь с программой Restless', linkS: 'кто в матче — в окно поверх игры; ID берёт из профилей, пока открыто Esc',
			lk: 'Программа: ', lkN: 'отправлено ', lkP: ' · игроков ', lkI: ' · с ID ', lkH: ' · с героем ', lk0: 'Программа: в укрытии не отправляю — зайди в матч', lkOff: 'Программа: связь выключена',
			yes: 'ВКЛ', no: 'ВЫКЛ', lang: 'Язык мода', soon: 'СКОРО',
			s1: 'Сборки с винрейтом прямо в магазине', s2: 'Кто в матче и сборки — прямо в окне мода', s3: 'Двуязычные субтитры реплик героев',
			site: 'Мой Restless — разбор матчей', bot: 'Бот', close: 'Закрыть', note: 'Настройки держатся до выхода из игры.',
			seeH: 'ЧТО ВИДИТ МОД', souls: 'Души: ', pl: 'Игроков в верхней панели: ', plU: ' · КД ульты в секундах: ',
			shop: 'Магазин: ячеек ', shop0: 'Магазин: пусто — открой магазин, потом снова Esc → RESTLESS', first: ' · первые: ',
			camp: 'Лагеря на миникарте: ', campOn: ' · сейчас живы: ', camp0: 'Лагеря на миникарте: не нашёл',
			rankT: 'Ранги игроков', lrkT: 'Средний ранг команд', campT: 'Таймеры лагерей', missT: 'Пропавшие враги', thpT: 'Здоровье на портретах',
			cmbT: '«В бою»', unsT: 'Незащищённые души', ultwT: 'КД ульты над героем', sUw: 'Ульта над героями: полос ', sUwN: ' · с секундами ', pre: 'Набор', cmbOn: 'В БОЮ', cmbOff: 'ВНЕ БОЯ', unsL: 'Незащищённые души: ',
			sRank: 'Ранги: показано ', sLrk: ' · средний ранг: свои ', sLrkE: ', враги ', sCamp: ' · таймеров лагерей: ', sHp: 'Здоровье читается у ', sMiss: ' · пропавших врагов: ',
			sCmb: ' · «в бою»: ', sCmbY: 'да', sCmbN: 'нет', sCmb0: 'не нашёл', sUns: ' · незащищённых: '
		},
		en: {
			mark: 'RESTLESS ' + VER + ' · running', markMenu: ' · Esc button',
			settings: 'mod settings · ' + VER, inGame: 'IN GAME',
			ultT: 'Ult cooldown in the top bar', ultS: 'seconds over every player\'s ult icon — in a match',
			markT: 'RESTLESS label', markS: 'top left — shows the mod is running',
			evtT: 'Event reminders', evtS: '15 s before camps, crates and statues — by the match clock',
			evIn: 'In ', evSec: ' s: ', evNow: 'Spawned: ',
			ev1: 'small camps', ev2: 'crates and golden statues', ev3: 'medium camps · tunnel and Bell Tower crates', ev4: 'large camps', ev5: 'Times Square crates and statues',
			linkT: 'Link to the Restless app', linkS: 'who is in the match — to the window over the game; IDs come from profiles while Esc is open',
			lk: 'App: ', lkN: 'sent ', lkP: ' · players ', lkI: ' · with ID ', lkH: ' · with hero ', lk0: 'App: not sending in the hideout — join a match', lkOff: 'App: link is off',
			yes: 'ON', no: 'OFF', lang: 'Mod language', soon: 'COMING SOON',
			s1: 'Builds with win rate right in the shop', s2: 'Who\'s in the match and builds — right in this window', s3: 'Bilingual hero voice-line subtitles',
			site: 'My Restless — match breakdowns', bot: 'Bot', close: 'Close', note: 'Settings last until you quit the game.',
			seeH: 'WHAT THE MOD SEES', souls: 'Souls: ', pl: 'Players in the top bar: ', plU: ' · ult cooldown in seconds: ',
			shop: 'Shop: cells ', shop0: 'Shop: empty — open the shop, then Esc → RESTLESS again', first: ' · first: ',
			camp: 'Camps on the minimap: ', campOn: ' · alive now: ', camp0: 'Camps on the minimap: not found',
			rankT: 'Player ranks', lrkT: 'Team average rank', campT: 'Camp timers', missT: 'Missing enemies', thpT: 'Health on portraits',
			cmbT: '"In combat"', unsT: 'Unsecured souls', ultwT: 'Ult cooldown over heroes', sUw: 'Ult over heroes: bars ', sUwN: ' · with seconds ', pre: 'Preset', cmbOn: 'IN COMBAT', cmbOff: 'OUT OF COMBAT', unsL: 'Unsecured souls: ',
			sRank: 'Ranks: shown ', sLrk: ' · average rank: allies ', sLrkE: ', enemies ', sCamp: ' · camp timers: ', sHp: 'Health readable for ', sMiss: ' · missing enemies: ',
			sCmb: ' · "in combat": ', sCmbY: 'yes', sCmbN: 'no', sCmb0: 'not found', sUns: ' · unsecured: '
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

	// ---------- окно настроек ----------
	function build() {
		SHADE = mk('Button', EM, 'RestlessShade', { width: '100%', height: '100%', backgroundColor: '#000000b4', zIndex: '4900', visibility: 'collapse' });
		SHADE.SetPanelEvent('onactivate', function () { show(false); });
		WIN = mk('Panel', EM, 'RestlessWindow', {
			width: '780px', flowChildren: 'down', padding: '24px 30px 22px 30px', horizontalAlign: 'center', verticalAlign: 'center',
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
		P.grid = mk('Panel', WIN, '', { width: '100%', flowChildren: 'right-wrap' });
		for (var ti = 0; ti < TG.length; ti++) toggle(TG[ti][0]);

		var lr = mk('Panel', WIN, '', { width: '100%', flowChildren: 'right', padding: '12px 0px 12px 0px' });
		P.lang = lab(lr, '', { width: 'fill-parent-flow(1.0)', verticalAlign: 'center', fontSize: '19px', color: INK });
		P.ru = pill(lr, 'Русский', function () { set('LANG', 'ru'); paint(); });
		P.en = pill(lr, 'English', function () { set('LANG', 'en'); paint(); });
		mk('Panel', WIN, '', { width: '100%', height: '1px', backgroundColor: OFF });


		P.seeH = lab(WIN, '', { fontSize: '13px', fontWeight: 'bold', color: A, letterSpacing: '1px', marginTop: '16px', marginBottom: '2px' });
		P.see = [];
		for (var q = 0; q < 9; q++) P.see.push(lab(WIN, '', { fontSize: '14px', color: INK, marginTop: '3px' }));

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
	// 0.17: переключатели в две колонки; порядок создания прежний (старые сначала), новые — в конце
	var TG = [['ULT', 'ultT'], ['MARK', 'markT'], ['LINK', 'linkT'], ['EVT', 'evtT'], ['RANK', 'rankT'], ['LRK', 'lrkT'], ['CAMP', 'campT'],
		['MISS', 'missT'], ['THP', 'thpT'], ['CMB', 'cmbT'], ['UNS', 'unsT'], ['ULTW', 'ultwT']];
	// наборы как на сайте («Оверлей»): Lite — главное и почти не грузит, Medium — ещё подсказки. Надпись и связь не трогаем.
	var PRE = { lite: ['ULT', 'ULTW', 'EVT', 'RANK', 'LRK', 'CAMP'], mid: ['ULT', 'ULTW', 'EVT', 'RANK', 'LRK', 'CAMP', 'MISS', 'THP', 'CMB', 'UNS'] };
	var PREK = ['ULT', 'ULTW', 'EVT', 'RANK', 'LRK', 'CAMP', 'MISS', 'THP', 'CMB', 'UNS'];
	function preset(n) { for (var i = 0; i < PREK.length; i++) set(PREK[i], PRE[n].indexOf(PREK[i]) >= 0 ? '1' : '0'); paint(); }
	function presetNow() {
		for (var n in PRE) { var okp = true; for (var i = 0; i < PREK.length; i++) if (on(PREK[i]) !== (PRE[n].indexOf(PREK[i]) >= 0)) { okp = false; break; } if (okp) return n; }
		return '';
	}
	function toggle(key) {
		var cell = mk('Panel', P.grid, '', { width: '50%', flowChildren: 'down' });
		var r = mk('Panel', cell, '', { width: '100%', flowChildren: 'right', padding: '9px 14px 9px 0px' });
		var c = mk('Panel', r, '', { width: 'fill-parent-flow(1.0)', flowChildren: 'down', verticalAlign: 'center' });
		var t = lab(c, '', { fontSize: '17px', color: INK });
		var b = mk('Button', r, '', { width: '104px', height: '36px', borderRadius: '18px', verticalAlign: 'center' });
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
		setText(P.pre, T('pre'));
		P.lite.b.style.backgroundColor = pn === 'lite' ? A : OFF; P.lite.l.style.color = pn === 'lite' ? DARK : INK;
		P.mid.b.style.backgroundColor = pn === 'mid' ? A : OFF; P.mid.l.style.color = pn === 'mid' ? DARK : INK;
		var ru = lang() === 'ru';
		P.ru.b.style.backgroundColor = ru ? A : OFF; P.ru.l.style.color = ru ? DARK : INK;
		P.en.b.style.backgroundColor = ru ? OFF : A; P.en.l.style.color = ru ? INK : DARK;
	}
	function show(v) {
		if (v && !ok(WIN)) {
			// окно могла построить прошлая копия скрипта — убираем и строим своё (ссылки на подписи нужны этой копии)
			try { var o1 = EM.FindChildTraverse('RestlessWindow'), o2 = EM.FindChildTraverse('RestlessShade'); if (ok(o1)) o1.DeleteAsync(0); if (ok(o2)) o2.DeleteAsync(0); } catch (e) {}
			build();
		}
		if (!ok(WIN)) return;
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
		var nb = HUD.FindChildrenWithClassTraverse ? HUD.FindChildrenWithClassTraverse('neutral') : [], camps = 0, alive = 0;
		for (var k = 0; k < nb.length; k++) if (nb[k].BHasClass && nb[k].BHasClass('map_button')) { camps++; if (nb[k].BHasClass('active')) alive++; }
		out.push(camps ? T('camp') + camps + T('campOn') + alive : T('camp0'));
		out.push(T('sRank') + RKN + T('sLrk') + LRKN[0] + T('sLrkE') + LRKN[1] + T('sCamp') + CMN);
		out.push(T('sHp') + HPN + T('sMiss') + MISSN + T('sCmb') + (CMBF < 0 ? '—' : !CMBF ? T('sCmb0') : CMBW ? T('sCmbY') : T('sCmbN')) + T('sUns') + UNV);
		out.push(T('sUw') + UW.n + T('sUwN') + UW.on + (ok(UW.box) ? '' : ' · ищу'));
		out.push(!on('LINK') ? T('lkOff') : LK.hide ? T('lk0') : T('lk') + T('lkN') + LK.sent + T('lkP') + LK.n + T('lkI') + LK.ids + T('lkH') + LK.hs);
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
	var EV = [[120, 'ev1'], [180, 'ev2'], [300, 'ev3'], [480, 'ev4'], [600, 'ev5']], EVL = null, EVS = -1, EVF = 0;
	function evtTick() {
		var lb = ok(EVL) ? EVL : null;   // свою надпись помним; ищем по HUD, только когда надо показать
		if (!on('EVT')) { if (ok(lb)) setVis(lb, false); return; }
		if (!ok(GT)) { if (EVF-- > 0) return; EVF = 40; GT = HUD.FindChildTraverse('GameTime'); if (!ok(GT)) { if (ok(lb)) setVis(lb, false); return; } }
		var m = /(-?)(\d+):(\d\d)/.exec(txt(GT) || ''), s = m ? (m[1] ? -1 : 1) * (+m[2] * 60 + +m[3]) : -1;
		if (s === EVS) return;
		EVS = s;
		var msg = '';
		for (var i = 0; i < EV.length && !msg; i++) {
			var d = EV[i][0] - s;
			if (d > 0 && d <= 15) msg = T('evIn') + d + T('evSec') + T(EV[i][1]);
			else if (d <= 0 && d > -5) msg = T('evNow') + T(EV[i][1]);
		}
		if (!ok(lb)) {
			if (!msg) return;
			lb = EVL = HUD.FindChildTraverse('RestlessEvt');
			if (!ok(lb)) lb = EVL = lab(HUD, 'RestlessEvt', { horizontalAlign: 'center', verticalAlign: 'top', marginTop: '124px', padding: '8px 18px 8px 18px',
				backgroundColor: '#121014e6', border: '1px solid #ffc83d73', borderRadius: '10px', fontSize: '20px', fontWeight: 'bold', color: A, zIndex: '60' });
		}
		setText(lb, msg); setVis(lb, !!msg);
	}

	// ---------- 0.17: функции из наборов Lite / Medium ----------
	// Всё по найденным панелям: игроки верхней панели — раз в 4 с, лагеря миникарты — раз в 10 с; дальше только классы и размеры.
	// Выключенная функция ничего не ищет и прячет своё.
	var HIDE = true, NT = 0, CLK = -1, CLKT = -1;
	function hideTick() { if (!ok(TB)) TB = HUD.FindChildTraverse('TopBar'); HIDE = !ok(TB) || !!(TB.BHasClass && TB.BHasClass('InHideout')); NT++; }
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
		if (!ok(MM)) { if (MMF-- > 0) return; MMF = 40 * Math.min(6, ++MMM); MM = HUD.FindChildTraverse('hud_minimap'); if (!ok(MM)) { campHide(); return; } }
		if (CMS-- <= 0 || !CMP.length) {
			CMS = 40;
			var old = CMP, L = [];
			try { L = MM.FindChildrenWithClassTraverse('neutral') || []; } catch (e) {}
			CMP = [];
			for (var i = 0; i < L.length; i++) {
				var b = L[i]; if (!b.BHasClass('map_button')) continue;
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
		if (!on('CMB') || HIDE) { if (ok(CMB)) setVis(CMB, false); CMBW = false; return; }
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
		if (!on('UNS') || HIDE) { if (ok(UNL)) setVis(UNL, false); return; }
		if (!ok(DG)) { if (DGF-- > 0) return; DGF = 40 * Math.min(6, ++DGM); DG = HUD.FindChildTraverse('hudDeathGoldLabel'); if (!ok(DG)) return; }
		var t = txt(DG).replace(/[^0-9]/g, ''); UNV = t ? +t : 0;
		if (!(UNV > 0)) { if (ok(UNL)) setVis(UNL, false); return; }
		if (!ok(UNL)) UNL = HUD.FindChildTraverse('RestlessUns');
		if (!ok(UNL)) UNL = lab(HUD, 'RestlessUns', { horizontalAlign: 'center', verticalAlign: 'bottom', marginBottom: '200px', padding: '6px 16px 6px 16px',
			backgroundColor: '#121014d0', borderRadius: '8px', fontSize: '22px', fontWeight: 'bold', color: '#ff9a3b', zIndex: '40' });
		setText(UNL, T('unsL') + txt(DG)); setVis(UNL, true);
	}
	// ---------- 0.18: КД ульты над героем в мире ----------
	// Над каждым героем игра рисует полосу здоровья (unit_status_overlay_v2: подпись name и значок «ульта готова» в unit_info_bg).
	// Пока ульта на перезарядке, значка нет — в его место ставим секунды из верхней панели (та же переменная ult_cooldown).
	// Полосы ищем раз в 4 с (сначала по всему интерфейсу, потом только в их общей панели), подписи меняем раз в 0,5 с.
	var UW = { c: [], scan: 0, miss: 0, box: null, n: 0, on: 0 };
	function uwHide() { for (var i = 0; i < UW.c.length; i++) if (ok(UW.c[i].lb)) setVis(UW.c[i].lb, false); }
	function uwScan() {
		var from = ok(UW.box) ? UW.box : ROOT, L = [];
		try { L = from.FindChildrenWithClassTraverse('WindowRoot') || []; } catch (e) {}
		var old = UW.c; UW.c = [];
		for (var i = 0; i < L.length; i++) {
			var w = L[i], info = kid(w, 'unit_info_bg'), nl = kid(w, 'name');
			if (!ok(info) || !ok(nl)) continue;
			var x = null; for (var j = 0; j < old.length; j++) if (old[j].w === w) x = old[j];
			UW.c.push(x || { w: w, info: info, nl: nl, lb: kid(info, 'RestlessUltW') });
		}
		// общая панель всех полос — чтобы дальше не обходить весь интерфейс
		if (!ok(UW.box) && UW.c.length >= 2) {
			var a = [], p = UW.c[0].w; while (ok(p)) { a.push(p); p = p.GetParent(); }
			var q = UW.c[1].w; while (ok(q) && a.indexOf(q) < 0) q = q.GetParent();
			if (ok(q) && q !== ROOT) UW.box = q;
		}
	}
	function uwTick() {
		UW.n = 0; UW.on = 0;
		if (!on('ULTW') || HIDE) { uwHide(); return; }
		if (UW.scan-- <= 0) { UW.scan = UW.c.length ? 8 : (UW.miss++ < 15 ? 8 : 40); uwScan(); }
		if (!UW.c.length) return;
		var V = {};
		for (var i = 0; i < ULT.length; i++) {
			var u = ULT[i]; if (!u.pl || !ok(u.src)) continue;
			var x = null; for (var j = 0; j < PLY.length; j++) if (PLY[j].pl === u.pl) { x = PLY[j]; break; }
			if (!x) continue;
			var v = ultVal(u), r = u.pl.BHasClass && u.pl.BHasClass('UltimateCooldownReady'), s = v && v !== '0' && !r ? v : '';
			V[x.k] = s; if (x.h) V[lc(x.h)] = s;
		}
		for (var k = 0; k < UW.c.length; k++) {
			var c = UW.c[k];
			if (!ok(c.w) || !ok(c.info)) { UW.scan = 0; continue; }
			var nm = lc(txt(c.nl)), sv = nm && nm.indexOf('{') < 0 && V.hasOwnProperty(nm) ? V[nm] : null;
			if (sv === null) { if (ok(c.lb)) setVis(c.lb, false); continue; }
			UW.n++;
			if (!sv) { if (ok(c.lb)) setVis(c.lb, false); continue; }
			if (!ok(c.lb)) c.lb = lab(c.info, 'RestlessUltW', { horizontalAlign: 'center', verticalAlign: 'center', fontSize: '15px', fontWeight: 'bold',
				color: '#ffffff', textShadow: '0px 0px 3px 2.0 #000000', zIndex: '10' });
			var fz = sv.length > 2 ? '11px' : '15px'; if (c.fz !== fz) { c.fz = fz; try { c.lb.style.fontSize = fz; } catch (e) {} }
			setText(c.lb, sv); setVis(c.lb, true); UW.on++;
		}
	}

	function f17Tick() {
		plyScan();
		if (NT % 2 === 0) { plyIds(); portTick(); cmbTick(); unsTick(); uwTick(); }
		if (NT % 4 === 1) { rankTick(); campTick(); }
		if (NT % 8 === 3) lrkTick();
	}

	// ---------- общий такт ----------
	function tick() {
		if (!ok(ctx)) return;
		if (mine()) {
			try { hideTick(); } catch (e) { $.Msg('[Restless] укрытие: ' + e); }
			try { markTick(); } catch (e) { $.Msg('[Restless] надпись: ' + e); }
			try { menuTick(); } catch (e) { $.Msg('[Restless] меню: ' + e); }
			try { winTick(); } catch (e) { $.Msg('[Restless] окно: ' + e); }
			try { ultTick(); } catch (e) { $.Msg('[Restless] ульта: ' + e); }
			try { evtTick(); } catch (e) { $.Msg('[Restless] события: ' + e); }
			try { lkTick(); } catch (e) { $.Msg('[Restless] связь: ' + e); }
			try { lkProbe(); } catch (e) { $.Msg('[Restless] профили: ' + e); }
			try { oldTick(); } catch (e) { $.Msg('[Restless] старое: ' + e); }
			try { f17Tick(); } catch (e) { $.Msg('[Restless] 0.17: ' + e); }
			try { seeTick(false); } catch (e) { $.Msg('[Restless] проверка: ' + e); }
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
                                                                                                                                                                                                                                                                                                                                                                 