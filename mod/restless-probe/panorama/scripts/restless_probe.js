// Restless 0.4 — пробник мода.
// Меню по Esc (dashboard): кнопка «Restless» рядом с «Обучением» → окно настроек.
// HUD (верхняя панель): надпись RESTLESS и плашка с таймером — слушаются настроек.
// Память игры не читает, ничего не отправляет. Настройки живут до выхода из игры
// ($.persistentStorage в Deadlock нет — сохранение после перезапуска будет через нашу страницу).
(function () {
	var VER = '0.4';
	var IMG = 'https://dota.1f8t8graf4.workers.dev/m/scenes/games/deadlock/icon-venator.png';
	var BOT = 'https://t.me/languagegamesbot';
	var ctx = $.GetContextPanel();
	if (!ctx) return;
	var hud = !!ctx.FindChildTraverse('GameTime');
	var where = hud ? 'HUD' : 'меню';
	var root = ctx;
	while (root.GetParent && root.GetParent()) root = root.GetParent();
	$.Msg('[Restless] ' + VER + ' скрипт запущен: ' + where);

	// Общие настройки меню и HUD: GameUI.CustomUIConfig(), иначе сам объект $ (так делают моды QoL).
	function S() {
		var t = null;
		try { if (typeof GameUI !== 'undefined' && GameUI && typeof GameUI.CustomUIConfig === 'function') t = GameUI.CustomUIConfig(); } catch (e) { t = null; }
		if (!t) t = $;
		if (!t.__restless) t.__restless = { card: true, mark: true, lang: 'ru' };
		return t.__restless;
	}

	var TX = {
		ru: {
			on: 'Restless работает', sub: 'мод загружен · картинка — из интернета', timer: 'таймер: ', sec: ' с',
			mark: 'RESTLESS: мод загружен', settings: 'настройки мода', inGame: 'В ИГРЕ',
			card: 'Плашка справа', cardSub: 'арт героя и таймер — проверка, что мод живой',
			markT: 'Надпись RESTLESS', markSub: 'в верхней панели, рядом с часами',
			lang: 'Язык мода', soon: 'СКОРО',
			s1: 'Сборки с винрейтом прямо в магазине', s2: 'Разбор матча — кнопка после игры', s3: 'Двуязычные субтитры реплик героев',
			bot: 'Открыть бота', close: 'Закрыть',
			note: 'Настройки держатся до выхода из игры. Сохранение после перезапуска — в следующей версии.'
		},
		en: {
			on: 'Restless is on', sub: 'mod loaded · image from the web', timer: 'timer: ', sec: ' s',
			mark: 'RESTLESS: mod loaded', settings: 'mod settings', inGame: 'IN GAME',
			card: 'Corner card', cardSub: 'hero art and timer — shows the mod is alive',
			markT: 'RESTLESS label', markSub: 'in the top bar, next to the clock',
			lang: 'Mod language', soon: 'COMING SOON',
			s1: 'Builds with win rate right in the shop', s2: 'Match breakdown — button after the game', s3: 'Bilingual hero voice-line subtitles',
			bot: 'Open the bot', close: 'Close',
			note: 'Settings last until you quit the game. Saving across restarts comes next.'
		}
	};
	function T(k) { var l = TX[S().lang] || TX.ru; return l[k]; }

	function mk(type, parent, id, st) {
		var p = $.CreatePanel(type, parent, id || '');
		for (var k in st) {
			try { p.style[k] = st[k]; } catch (e) { $.Msg('[Restless] стиль ' + k + ': ' + e); }
		}
		return p;
	}
	function lab(parent, text, st) { var l = mk('Label', parent, '', st); l.text = text; return l; }

	// ---------- HUD ----------
	if (hud) {
		var mark = ctx.FindChildTraverse('RestlessMark');
		var ID = 'RestlessProbeHud';
		if (root.FindChildTraverse(ID)) return;
		try {
			var card = mk('Panel', root, ID, {
				ignoreParentFlow: 'true', horizontalAlign: 'right', verticalAlign: 'top',
				marginTop: '200px', marginRight: '40px', zIndex: '1000',
				flowChildren: 'right', padding: '12px 16px 12px 12px',
				backgroundColor: 'rgba(13, 11, 8, 0.92)', borderRadius: '8px',
				border: '1px solid rgba(255, 200, 61, 0.55)'
			});
			card.hittest = false;
			mk('Panel', card, '', { width: '4px', height: '80px', marginRight: '12px', backgroundColor: '#ffc83d', borderRadius: '2px' });
			var pic = mk('Image', card, '', { width: '48px', height: '80px', marginRight: '12px', borderRadius: '4px', backgroundColor: '#222222' });
			pic.SetImage(IMG);
			var col = mk('Panel', card, '', { flowChildren: 'down', verticalAlign: 'center' });
			var t1 = lab(col, '', { fontSize: '22px', fontWeight: 'bold', color: '#ffc83d' });
			var t2 = lab(col, '', { fontSize: '15px', color: '#f3ebdd', marginTop: '4px' });
			var t3 = lab(col, '', { fontSize: '14px', color: '#a89f90', marginTop: '4px' });
			var n = 0;
			(function tick() {
				if (!card.IsValid()) return;
				var s = S();
				card.style.visibility = s.card ? 'visible' : 'collapse';
				if (mark && mark.IsValid()) { mark.style.visibility = s.mark ? 'visible' : 'collapse'; mark.text = T('mark'); }
				t1.text = T('on') + ' · HUD';
				t2.text = T('sub');
				t3.text = T('timer') + Math.floor(n / 2) + T('sec');
				n++;
				$.Schedule(0.5, tick);
			})();
			$.Msg('[Restless] HUD готов');
		} catch (e) {
			$.Msg('[Restless] ошибка HUD: ' + e);
		}
		return;
	}

	// ---------- Меню: кнопка и окно настроек ----------
	var OV = 'RestlessSettings';
	var A = '#ffc83d', INK = '#f3ebdd', MUTED = '#a89f90';

	function sw(parent, on) {
		var tr = mk('Panel', parent, '', {
			width: '52px', height: '28px', borderRadius: '14px', horizontalAlign: 'right', verticalAlign: 'center',
			backgroundColor: on ? A : '#3a3540'
		});
		tr.hittest = false;
		var kn = mk('Panel', tr, '', {
			width: '22px', height: '22px', borderRadius: '11px', verticalAlign: 'center',
			horizontalAlign: on ? 'right' : 'left', margin: '0px 3px 0px 3px', backgroundColor: on ? '#1a1408' : '#d8d2c8'
		});
		kn.hittest = false;
	}

	function row(parent, key, title, sub) {
		var b = mk('Button', parent, '', { width: '100%', flowChildren: 'right', padding: '12px 4px 12px 4px' });
		var c = mk('Panel', b, '', { flowChildren: 'down', width: 'fill-parent-flow(1.0)', verticalAlign: 'center' });
		c.hittest = false;
		lab(c, title, { fontSize: '18px', color: INK }).hittest = false;
		lab(c, sub, { fontSize: '13px', color: MUTED, marginTop: '2px' }).hittest = false;
		sw(b, !!S()[key]);
		b.SetPanelEvent('onactivate', function () { S()[key] = !S()[key]; build(); });
		mk('Panel', parent, '', { width: '100%', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)' });
	}

	function pill(parent, text, on, fn) {
		var b = mk('Button', parent, '', {
			padding: '8px 16px 8px 16px', marginLeft: '8px', borderRadius: '16px',
			backgroundColor: on ? A : 'rgba(255, 255, 255, 0.08)'
		});
		lab(b, text, { fontSize: '15px', fontWeight: 'bold', color: on ? '#1a1408' : INK }).hittest = false;
		b.SetPanelEvent('onactivate', fn);
		return b;
	}

	function build() {
		var ov = root.FindChildTraverse(OV);
		if (!ov) {
			ov = mk('Panel', root, OV, { width: '100%', height: '100%', zIndex: '2000', ignoreParentFlow: 'true' });
			var back = mk('Button', ov, '', { width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.62)' });
			back.SetPanelEvent('onactivate', close);
			mk('Panel', ov, 'RestlessWin', {
				width: '600px', flowChildren: 'down', padding: '26px 30px 22px 30px',
				horizontalAlign: 'center', verticalAlign: 'center',
				backgroundColor: 'rgba(18, 16, 20, 0.98)', borderRadius: '12px',
				border: '1px solid rgba(255, 200, 61, 0.45)'
			});
		}
		ov.style.visibility = 'visible';
		var w = ov.FindChildTraverse('RestlessWin');
		w.RemoveAndDeleteChildren();
		var s = S();

		var head = mk('Panel', w, '', { width: '100%', flowChildren: 'right', marginBottom: '14px' });
		mk('Panel', head, '', { width: '5px', height: '40px', backgroundColor: A, borderRadius: '2px', marginRight: '14px', verticalAlign: 'center' });
		var hc = mk('Panel', head, '', { flowChildren: 'down', width: 'fill-parent-flow(1.0)', verticalAlign: 'center' });
		lab(hc, 'RESTLESS', { fontSize: '30px', fontWeight: 'bold', color: A, letterSpacing: '2px' });
		lab(hc, T('settings') + ' · ' + VER, { fontSize: '14px', color: MUTED });
		var x = mk('Button', head, '', { width: '40px', height: '40px', borderRadius: '20px', backgroundColor: 'rgba(255, 255, 255, 0.08)', verticalAlign: 'center' });
		lab(x, '×', { fontSize: '18px', color: INK, horizontalAlign: 'center', verticalAlign: 'center' }).hittest = false;
		x.SetPanelEvent('onactivate', close);

		lab(w, T('inGame'), { fontSize: '12px', fontWeight: 'bold', color: MUTED, letterSpacing: '1px', marginTop: '6px' });
		row(w, 'card', T('card'), T('cardSub'));
		row(w, 'mark', T('markT'), T('markSub'));

		var lr = mk('Panel', w, '', { width: '100%', flowChildren: 'right', padding: '14px 4px 14px 4px' });
		lab(lr, T('lang'), { fontSize: '18px', color: INK, width: 'fill-parent-flow(1.0)', verticalAlign: 'center' });
		pill(lr, 'Русский', s.lang === 'ru', function () { S().lang = 'ru'; build(); });
		pill(lr, 'English', s.lang === 'en', function () { S().lang = 'en'; build(); });
		mk('Panel', w, '', { width: '100%', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)' });

		lab(w, T('soon'), { fontSize: '12px', fontWeight: 'bold', color: MUTED, letterSpacing: '1px', marginTop: '16px', marginBottom: '6px' });
		['s1', 's2', 's3'].forEach(function (k) { lab(w, '·  ' + T(k), { fontSize: '15px', color: 'rgba(243, 235, 221, 0.55)', marginTop: '4px' }); });

		var f = mk('Panel', w, '', { width: '100%', flowChildren: 'right', marginTop: '22px' });
		var bot = mk('Button', f, '', { padding: '11px 22px 11px 22px', borderRadius: '8px', backgroundColor: A });
		lab(bot, T('bot'), { fontSize: '16px', fontWeight: 'bold', color: '#1a1408' }).hittest = false;
		bot.SetPanelEvent('onactivate', function () {
			try { if (typeof SteamOverlayAPI !== 'undefined' && SteamOverlayAPI && SteamOverlayAPI.OpenURL) SteamOverlayAPI.OpenURL(BOT); } catch (e) { $.Msg('[Restless] ссылка: ' + e); }
		});
		var cl = mk('Button', f, '', { padding: '11px 22px 11px 22px', marginLeft: '10px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.08)' });
		lab(cl, T('close'), { fontSize: '16px', color: INK }).hittest = false;
		cl.SetPanelEvent('onactivate', close);

		lab(w, T('note'), { fontSize: '12px', color: MUTED, marginTop: '16px' });
	}

	function close() {
		var ov = root.FindChildTraverse(OV);
		if (ov) ov.style.visibility = 'collapse';
	}

	try {
		var btn = ctx.FindChildTraverse('RestlessMenuBtn');
		if (btn) {
			btn.SetPanelEvent('onactivate', function () {
				try { build(); } catch (e) { $.Msg('[Restless] окно: ' + e); }
			});
			$.Msg('[Restless] кнопка в меню готова');
		} else {
			$.Msg('[Restless] кнопки в меню нет');
		}
	} catch (e) {
		$.Msg('[Restless] ошибка меню: ' + e);
	}
})();
