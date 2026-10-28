// Restless 0.9.1.
// 0.9.1: КД ульты то появлялся, то пропадал. Копий скрипта несколько, хозяин между ними переходит, а «показано / спрятано»
// каждая копия запоминала у себя — и не трогала число, которое другая копия спрятала. Теперь видимость сверяем с самой панелью,
// число всегда видно (прячем пустым текстом), секунды читаем свежими через $.Localize у самой подписи, а не ждём, пока она обновится.
// 0.8 не запускался: скрипт сразу искал меню Esc, а игра запускает скрипт файла раньше, чем вставляет его панель в HUD, —
// скрипт решал «это не HUD» и выключался насовсем. Теперь ждём: ищем корень каждые 0,25 с, потом раз в секунду.
// Меню по Esc не подменяем (его подменяют QoL Lock, QoL Lite, Torfus Voice — остаётся одна копия): кнопку RESTLESS
// и окно ставит этот скрипт — в то меню, какое загрузилось, строкой перед «Настройками», классом кнопок игры.
// Скрипт подключён к нескольким файлам: HUD — субтитры, скорость, чат; главное меню — dashboard (надпись «работает»).
// Работает одна копия — «хозяин» отмечается в атрибуте корневой панели; вторая ждёт и подхватит, если хозяин пропал.
// КД ульты: игра сама кладёт секунды в верхнюю панель ({i:ult_cooldown}), но не показывает — выводим их поверх значка.
// Память игры не читает, ничего не отправляет. Настройки держатся до выхода из игры.
(function () {
	var VER = '0.9.1';
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
	function on(k) { return get(k, '1') === '1'; }
	function lang() { return get('LANG', 'ru') === 'en' ? 'en' : 'ru'; }

	var TX = {
		ru: {
			mark: 'RESTLESS ' + VER + ' · работает', markMenu: ' · кнопка в Esc',
			settings: 'настройки мода · ' + VER, inGame: 'В ИГРЕ',
			ultT: 'КД ульты в верхней панели', ultS: 'секунды поверх значка ульты у каждого игрока — в матче',
			markT: 'Надпись RESTLESS', markS: 'слева сверху — видно, что мод работает',
			yes: 'ВКЛ', no: 'ВЫКЛ', lang: 'Язык мода', soon: 'СКОРО',
			s1: 'Сборки с винрейтом прямо в магазине', s2: 'Кто в матче и сборки — прямо в окне мода', s3: 'Двуязычные субтитры реплик героев',
			site: 'Мой Restless — разбор матчей', bot: 'Бот', close: 'Закрыть', note: 'Настройки держатся до выхода из игры.'
		},
		en: {
			mark: 'RESTLESS ' + VER + ' · running', markMenu: ' · Esc button',
			settings: 'mod settings · ' + VER, inGame: 'IN GAME',
			ultT: 'Ult cooldown in the top bar', ultS: 'seconds over every player\'s ult icon — in a match',
			markT: 'RESTLESS label', markS: 'top left — shows the mod is running',
			yes: 'ON', no: 'OFF', lang: 'Mod language', soon: 'COMING SOON',
			s1: 'Builds with win rate right in the shop', s2: 'Who\'s in the match and builds — right in this window', s3: 'Bilingual hero voice-line subtitles',
			site: 'My Restless — match breakdowns', bot: 'Bot', close: 'Close', note: 'Settings last until you quit the game.'
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
	function markTick() {
		var m = HUD.FindChildTraverse('RestlessMark');
		if (!ok(m)) {
			m = lab(HUD, 'RestlessMark', { horizontalAlign: 'left', verticalAlign: 'top', marginLeft: '24px', marginTop: '8px',
				fontSize: '20px', fontWeight: 'bold', color: A, zIndex: '50' });
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
		var sub = EM.FindChildTraverse('SubOptions');
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
		var ch = EM.FindChildTraverse('changehero'), menu = ch && ch.GetParent ? ch.GetParent() : null;
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
			width: '640px', flowChildren: 'down', padding: '26px 30px 24px 30px', horizontalAlign: 'center', verticalAlign: 'center',
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
		toggle('ULT');
		toggle('MARK');

		var lr = mk('Panel', WIN, '', { width: '100%', flowChildren: 'right', padding: '12px 0px 12px 0px' });
		P.lang = lab(lr, '', { width: 'fill-parent-flow(1.0)', verticalAlign: 'center', fontSize: '19px', color: INK });
		P.ru = pill(lr, 'Русский', function () { set('LANG', 'ru'); paint(); });
		P.en = pill(lr, 'English', function () { set('LANG', 'en'); paint(); });
		mk('Panel', WIN, '', { width: '100%', height: '1px', backgroundColor: OFF });

		P.secSoon = lab(WIN, '', { fontSize: '13px', fontWeight: 'bold', color: MUTED, letterSpacing: '1px', marginTop: '16px', marginBottom: '4px' });
		P.s = [];
		for (var j = 1; j <= 3; j++) P.s.push(lab(WIN, '', { fontSize: '15px', color: '#f3ebdd8c', marginTop: '4px' }));

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

		P.note = lab(WIN, '', { fontSize: '13px', color: MUTED, marginTop: '14px' });
		P.diag = lab(WIN, '', { fontSize: '11px', color: '#a89f9099', marginTop: '6px' });
	}
	function toggle(key) {
		var r = mk('Panel', WIN, '', { width: '100%', flowChildren: 'right', padding: '12px 0px 12px 0px' });
		var c = mk('Panel', r, '', { width: 'fill-parent-flow(1.0)', flowChildren: 'down', verticalAlign: 'center' });
		var t = lab(c, '', { fontSize: '19px', color: INK });
		var s = lab(c, '', { fontSize: '14px', color: MUTED, marginTop: '2px' });
		var b = mk('Button', r, '', { width: '104px', height: '38px', borderRadius: '19px', verticalAlign: 'center' });
		var bl = lab(b, '', { horizontalAlign: 'center', verticalAlign: 'center', fontSize: '16px', fontWeight: 'bold' });
		b.SetPanelEvent('onactivate', function () { set(key, on(key) ? '0' : '1'); paint(); markTick(); });
		mk('Panel', WIN, '', { width: '100%', height: '1px', backgroundColor: OFF });
		P[key] = { t: t, s: s, b: b, l: bl };
	}
	function pill(parent, text, fn) {
		var b = mk('Button', parent, '', { padding: '8px 18px 8px 18px', marginLeft: '8px', borderRadius: '17px', verticalAlign: 'center', backgroundColor: OFF });
		var l = lab(b, '', { fontSize: '16px', fontWeight: 'bold', color: INK });
		setText(l, text);
		b.SetPanelEvent('onactivate', fn);
		return { b: b, l: l };
	}
	function paint() {
		setText(P.sub, T('settings')); setText(P.secGame, T('inGame')); setText(P.lang, T('lang')); setText(P.secSoon, T('soon'));
		setText(P.site, T('site')); setText(P.bot, T('bot')); setText(P.close, T('close')); setText(P.note, T('note'));
		for (var j = 0; j < 3; j++) setText(P.s[j], '·  ' + T('s' + (j + 1)));
		var keys = [['ULT', 'ultT', 'ultS'], ['MARK', 'markT', 'markS']];
		for (var i = 0; i < keys.length; i++) {
			var q = P[keys[i][0]], v = on(keys[i][0]);
			setText(q.t, T(keys[i][1])); setText(q.s, T(keys[i][2])); setText(q.l, v ? T('yes') : T('no'));
			q.b.style.backgroundColor = v ? A : OFF; q.l.style.color = v ? DARK : INK;
		}
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
			ultScan = 4;
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
		}
	}

	// ---------- общий такт ----------
	function tick() {
		if (!ok(ctx)) return;
		if (mine()) {
			try { markTick(); } catch (e) { $.Msg('[Restless] надпись: ' + e); }
			try { menuTick(); } catch (e) { $.Msg('[Restless] меню: ' + e); }
			try { winTick(); } catch (e) { $.Msg('[Restless] окно: ' + e); }
			try { ultTick(); } catch (e) { $.Msg('[Restless] ульта: ' + e); }
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
