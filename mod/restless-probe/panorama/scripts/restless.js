// Restless 0.7 — пробник мода.
// Меню по Esc (hud_escape_menu): кнопка RESTLESS под «Сменить героя», окно настроек объявлено в разметке меню
// (по центру, тёмная подложка ловит клики — сквозь окно в меню не нажать).
// HUD (верхняя панель): надпись RESTLESS и плашка с таймером — слушаются настроек.
// Меню и HUD — разные экраны со своими скриптами. Настройки между ними — атрибутами корневой панели
// (SetAttributeString / GetAttributeString), как у модов QoL. Держатся до выхода из игры.
// Память игры не читает, ничего не отправляет.
(function () {
	var VER = '0.7';
	var IMG = 'https://dota.1f8t8graf4.workers.dev/m/scenes/games/deadlock/icon-venator.png';
	var BOT = 'https://t.me/languagegamesbot';
	var A = '#ffc83d', INK = '#f3ebdd', DARK = '#1a1408', OFF = '#ffffff14';
	var ctx = $.GetContextPanel();
	if (!ctx) return;
	var hud = !!ctx.FindChildTraverse('GameTime');
	var esc = !!ctx.FindChildTraverse('EscapeBackground');
	var where = hud ? 'HUD' : (esc ? 'Esc-меню' : 'другой экран');
	var ROOT = ctx;
	try { while (ROOT.GetParent && ROOT.GetParent()) ROOT = ROOT.GetParent(); } catch (e) {}
	$.Msg('[Restless] ' + VER + ' скрипт запущен: ' + where);

	// ---------- общие настройки ----------
	var MEM = {};
	function cfgObj() {
		try { if (typeof GameUI !== 'undefined' && GameUI && typeof GameUI.CustomUIConfig === 'function') return GameUI.CustomUIConfig() || null; } catch (e) {}
		return null;
	}
	function get(k, def) {
		var v = '';
		try { if (ROOT && ROOT.GetAttributeString) v = ROOT.GetAttributeString('RESTLESS_' + k, '') || ''; } catch (e) { v = ''; }
		if (!v) { var o = cfgObj(); try { if (o && o.__restless7 && o.__restless7[k]) v = o.__restless7[k]; } catch (e) {} }
		if (!v && MEM[k]) v = MEM[k];
		return v ? String(v) : def;
	}
	function set(k, v) {
		v = String(v); MEM[k] = v;
		try { if (ROOT && ROOT.SetAttributeString) ROOT.SetAttributeString('RESTLESS_' + k, v); } catch (e) {}
		var o = cfgObj();
		try { if (o) { if (!o.__restless7) o.__restless7 = {}; o.__restless7[k] = v; } } catch (e) {}
	}
	function on(k) { return get(k, '1') === '1'; }
	function lang() { return get('LANG', 'ru') === 'en' ? 'en' : 'ru'; }

	var TX = {
		ru: {
			on: 'Restless работает', sub: 'мод загружен · картинка — из интернета', timer: 'таймер: ', sec: ' с',
			mark: 'RESTLESS ' + VER + ' · работает', markEsc: ' · меню на связи',
			settings: 'настройки мода · ' + VER, inGame: 'В ИГРЕ',
			markT: 'Надпись RESTLESS', markS: 'в верхней панели, рядом с часами',
			cardT: 'Плашка справа', cardS: 'арт героя и таймер — проверка, что мод живой',
			yes: 'ВКЛ', no: 'ВЫКЛ', lang: 'Язык мода', soon: 'СКОРО',
			s1: 'Сборки с винрейтом прямо в магазине', s2: 'Разбор матча — кнопка после игры', s3: 'Двуязычные субтитры реплик героев',
			hudOk: 'HUD на связи — переключатели срабатывают сразу, смотри за меню.',
			hudNo: 'HUD пока не отозвался — зайди в укрытие или матч и открой окно снова.',
			bot: 'Открыть бота', close: 'Закрыть', note: 'Настройки держатся до выхода из игры.'
		},
		en: {
			on: 'Restless is on', sub: 'mod loaded · image from the web', timer: 'timer: ', sec: ' s',
			mark: 'RESTLESS ' + VER + ' · running', markEsc: ' · menu linked',
			settings: 'mod settings · ' + VER, inGame: 'IN GAME',
			markT: 'RESTLESS label', markS: 'in the top bar, next to the clock',
			cardT: 'Corner card', cardS: 'hero art and timer — shows the mod is alive',
			yes: 'ON', no: 'OFF', lang: 'Mod language', soon: 'COMING SOON',
			s1: 'Builds with win rate right in the shop', s2: 'Match breakdown — button after the game', s3: 'Bilingual hero voice-line subtitles',
			hudOk: 'HUD is linked — toggles apply instantly, look behind the menu.',
			hudNo: 'HUD has not answered yet — enter the hideout or a match and reopen.',
			bot: 'Open the bot', close: 'Close', note: 'Settings last until you quit the game.'
		}
	};
	function T(k) { return (TX[lang()] || TX.ru)[k]; }
	function setText(l, v) { if (l && l.text !== v) l.text = v; }
	function setVis(p, v) { var s = v ? 'visible' : 'collapse'; if (p && p.__v !== s) { p.style.visibility = s; p.__v = s; } }
	function mk(type, parent, id, st) {
		var p = $.CreatePanel(type, parent, id || '');
		for (var k in st) { try { p.style[k] = st[k]; } catch (e) { $.Msg('[Restless] стиль ' + k + ': ' + e); } }
		return p;
	}
	function lab(parent, st) { var l = mk('Label', parent, '', st); l.hittest = false; return l; }

	// ---------- HUD ----------
	if (hud) {
		set('HUD', '1');
		var mark = ctx.FindChildTraverse('RestlessMark');
		var ID = 'RestlessProbeHud';
		if (ROOT.FindChildTraverse(ID)) return;
		try {
			var card = mk('Panel', ROOT, ID, {
				ignoreParentFlow: 'true', horizontalAlign: 'right', verticalAlign: 'top',
				marginTop: '200px', marginRight: '40px', zIndex: '1000',
				flowChildren: 'right', padding: '12px 16px 12px 12px',
				backgroundColor: 'rgba(13, 11, 8, 0.92)', borderRadius: '8px',
				border: '1px solid rgba(255, 200, 61, 0.55)'
			});
			card.hittest = false;
			mk('Panel', card, '', { width: '4px', height: '80px', marginRight: '12px', backgroundColor: A, borderRadius: '2px' }).hittest = false;
			var pic = mk('Image', card, '', { width: '48px', height: '80px', marginRight: '12px', borderRadius: '4px', backgroundColor: '#222222' });
			pic.hittest = false;
			pic.SetImage(IMG);
			var col = mk('Panel', card, '', { flowChildren: 'down', verticalAlign: 'center' });
			col.hittest = false;
			var t1 = lab(col, { fontSize: '22px', fontWeight: 'bold', color: A });
			var t2 = lab(col, { fontSize: '15px', color: INK, marginTop: '4px' });
			var t3 = lab(col, { fontSize: '14px', color: '#a89f90', marginTop: '4px' });
			var n = 0;
			(function tick() {
				if (!card.IsValid()) return;
				var c = on('CARD');
				setVis(card, c);
				if (mark && mark.IsValid()) { setVis(mark, on('MARK')); setText(mark, T('mark') + (get('ESC', '') === '1' ? T('markEsc') : '')); }
				if (c) {
					setText(t1, T('on') + ' · HUD');
					setText(t2, T('sub'));
					setText(t3, T('timer') + Math.floor(n / 2) + T('sec'));
				}
				n++;
				$.Schedule(0.5, tick);
			})();
			$.Msg('[Restless] HUD готов');
		} catch (e) {
			$.Msg('[Restless] ошибка HUD: ' + e);
			try { if (mark) mark.text = 'RESTLESS ' + VER + ' · ошибка: ' + e; } catch (e2) {}
		}
		return;
	}

	// ---------- меню по Esc ----------
	if (!esc) { $.Msg('[Restless] здесь окна нет: ' + where); return; }
	function F(id) { return ctx.FindChildTraverse(id); }
	var win = F('RestlessWindow'), shade = F('RestlessShade'), btn = F('RestlessMenuBtn');
	if (!win || !btn) { $.Msg('[Restless] в разметке меню нет окна или кнопки'); return; }
	set('ESC', '1');
	var open = false, seen = false, timer = 0;

	function menuShown() {
		var p = ctx;
		try { while (p) { if (p.BHasClass && p.BHasClass('ShowEscapeMenu')) return true; p = p.GetParent ? p.GetParent() : null; } } catch (e) {}
		return false;
	}
	function paintToggle(key) {
		var b = F('Restless' + key + 'Btn'), l = F('Restless' + key + 'L'), v = on(key.toUpperCase());
		if (b) b.style.backgroundColor = v ? A : OFF;
		if (l) { setText(l, v ? T('yes') : T('no')); l.style.color = v ? DARK : INK; }
	}
	function paintPill(id, v) {
		var b = F(id), l = F(id + 'L');
		if (b) b.style.backgroundColor = v ? A : OFF;
		if (l) l.style.color = v ? DARK : INK;
	}
	function paint() {
		var L = [['RestlessSub', 'settings'], ['RestlessSecGame', 'inGame'], ['RestlessMarkT', 'markT'], ['RestlessMarkS', 'markS'],
			['RestlessCardT', 'cardT'], ['RestlessCardS', 'cardS'], ['RestlessLangT', 'lang'], ['RestlessSecSoon', 'soon'],
			['RestlessBotL', 'bot'], ['RestlessCloseL', 'close'], ['RestlessNote', 'note']];
		for (var i = 0; i < L.length; i++) setText(F(L[i][0]), T(L[i][1]));
		for (var j = 1; j <= 3; j++) setText(F('RestlessSoon' + j), '·  ' + T('s' + j));
		paintToggle('Mark'); paintToggle('Card');
		paintPill('RestlessLangRu', lang() === 'ru'); paintPill('RestlessLangEn', lang() === 'en');
		setText(F('RestlessStatus'), get('HUD', '') === '1' ? T('hudOk') : T('hudNo'));
	}
	function show(v) {
		open = v;
		setVis(win, v); setVis(shade, v);
		timer++;
		if (!v) return;
		paint();
		seen = menuShown();
		var my = timer;
		(function watch() {
			if (!open || my !== timer || !win.IsValid()) return;
			// меню закрыли (Esc, «Продолжить») — закрываем и окно, чтобы оно не висело при следующем открытии
			if (seen && !menuShown()) { show(false); return; }
			setText(F('RestlessStatus'), get('HUD', '') === '1' ? T('hudOk') : T('hudNo'));
			$.Schedule(0.3, watch);
		})();
	}
	function flip(k) { set(k, on(k) ? '0' : '1'); paint(); }
	function bind(id, fn) {
		var p = F(id);
		if (!p) { $.Msg('[Restless] нет ' + id); return; }
		p.SetPanelEvent('onactivate', function () { try { fn(); } catch (e) { $.Msg('[Restless] ' + id + ': ' + e); } });
	}

	$.RestlessToggle = function () { show(!open); };
	$.RestlessClose = function () { show(false); };
	$.RestlessIsOpen = function () { return open; };

	try {
		bind('RestlessMenuBtn', function () { show(!open); });
		bind('RestlessShade', function () { show(false); });
		bind('RestlessX', function () { show(false); });
		bind('RestlessClose', function () { show(false); });
		bind('RestlessMarkBtn', function () { flip('MARK'); });
		bind('RestlessCardBtn', function () { flip('CARD'); });
		bind('RestlessLangRu', function () { set('LANG', 'ru'); paint(); });
		bind('RestlessLangEn', function () { set('LANG', 'en'); paint(); });
		bind('RestlessBot', function () {
			if (typeof SteamOverlayAPI !== 'undefined' && SteamOverlayAPI && SteamOverlayAPI.OpenURL) SteamOverlayAPI.OpenURL(BOT);
		});
		show(false);
		$.Msg('[Restless] кнопка и окно готовы');
	} catch (e) {
		$.Msg('[Restless] ошибка меню: ' + e);
	}
})();
