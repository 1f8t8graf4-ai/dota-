// Restless — пробник мода. Подключён к главному меню (dashboard) и к верхней панели HUD (top bar):
// проверяем, что игра грузит наш скрипт, что работает таймер ($.Schedule) и что картинка по ссылке
// из интернета показывается. Память игры не читает, ничего не отправляет. Тап по плашке — скрыть.
(function () {
	var IMG = 'https://dota.1f8t8graf4.workers.dev/m/scenes/games/deadlock/icon-venator.png';
	var ctx = $.GetContextPanel();
	if (!ctx) return;
	var hud = !!ctx.FindChildTraverse('GameTime');
	var where = hud ? 'HUD' : 'меню';
	var ID = 'RestlessProbe' + (hud ? 'Hud' : 'Menu');
	// Плашку вешаем на самую верхнюю панель — она на весь экран, ничего не обрежет.
	var root = ctx;
	while (root.GetParent && root.GetParent()) root = root.GetParent();
	if (root.FindChildTraverse(ID)) return;
	$.Msg('[Restless] скрипт запущен: ' + where);

	function mk(type, parent, id, st) {
		var p = $.CreatePanel(type, parent, id || '');
		for (var k in st) {
			try { p.style[k] = st[k]; } catch (e) { $.Msg('[Restless] стиль ' + k + ': ' + e); }
		}
		return p;
	}

	try {
		var card = mk('Panel', root, ID, {
			ignoreParentFlow: 'true', horizontalAlign: 'right', verticalAlign: 'top',
			marginTop: hud ? '200px' : '90px', marginRight: '40px', zIndex: '1000',
			flowChildren: 'right', padding: '12px 16px 12px 12px',
			backgroundColor: 'rgba(13, 11, 8, 0.92)', borderRadius: '8px',
			border: '1px solid rgba(255, 200, 61, 0.55)'
		});
		mk('Panel', card, '', { width: '4px', height: '80px', marginRight: '12px', backgroundColor: '#ffc83d', borderRadius: '2px' });
		var pic = mk('Image', card, '', {
			width: '48px', height: '80px', marginRight: '12px', borderRadius: '4px',
			backgroundColor: '#222222'
		});
		pic.SetImage(IMG);

		var col = mk('Panel', card, '', { flowChildren: 'down', verticalAlign: 'center' });
		var t = mk('Label', col, '', { fontSize: '22px', fontWeight: 'bold', color: '#ffc83d' });
		t.text = 'Restless работает · ' + where;
		var s = mk('Label', col, '', { fontSize: '15px', color: '#f3ebdd', marginTop: '4px' });
		s.text = 'мод загружен · картинка — из интернета';
		var c = mk('Label', col, '', { fontSize: '14px', color: '#a89f90', marginTop: '4px' });

		var n = 0;
		(function tick() {
			if (!card.IsValid()) return;
			c.text = 'таймер идёт: ' + n + ' с · нажми, чтобы скрыть';
			n++;
			$.Schedule(1, tick);
		})();

		card.SetPanelEvent('onactivate', function () { card.style.visibility = 'collapse'; });
		$.Msg('[Restless] плашка создана: ' + where);
	} catch (e) {
		$.Msg('[Restless] ошибка: ' + e);
	}
})();
