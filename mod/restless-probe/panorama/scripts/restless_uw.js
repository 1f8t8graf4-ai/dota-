// Restless 0.24 — КД ульты над героем (над моделькой, рядом со значком «ульта готова» игры).
// Скрипт подключён к полосе здоровья над юнитом (копия unit_status_overlay_v2.xml). Полоса живёт не в дереве HUD,
// поэтому секунды ей шлёт главный скрипт Restless событием ClientUI_FireOutput: {rl:1, t:'ultw', v:{ник или герой (строчными): секунды или ''}}.
// 0.22 ждал класс player только у корня полосы — в игре его, видимо, нет (в окне было «полос 0»). Теперь:
// - класс ищем у корня, у WindowRoot и у родителя (player / hero / enemy / friendly — что найдётся);
// - слушаем у каждой полосы с именем: чужие ключи ничего не делают, а крипов отсекаем быстрым поиском имени в строке до разбора;
// - один раз сообщаем о себе {rl:1, t:'uwhi', c:'классы', n:'имя'} — в «Что видит мод» видно, сколько полос вообще есть и какие у них классы.
(function () {
	var c = $.GetContextPanel();
	if (!c) return;
	var tries = 0, info = null, nl = null, lb = null, ack = 0, cur = '', hi = false;
	function ok(p) { try { return !!(p && p.IsValid && p.IsValid()); } catch (e) { return false; } }
	function low(p) { try { return String(p.text || '').replace(/\s+/g, ' ').trim().toLowerCase(); } catch (e) { return ''; } }
	function cls(p) {
		var out = [];
		['player', 'hero', 'enemy', 'friendly', 'ally', 'neutral', 'npc', 'trooper', 'building', 'boss'].forEach(function (k) { try { if (ok(p) && p.BHasClass(k)) out.push(k); } catch (e) {} });
		return out;
	}
	function show(v) {
		if (cur === v) return;
		cur = v;
		if (!v) { if (ok(lb)) lb.style.visibility = 'collapse'; return; }
		if (!ok(lb)) {
			lb = $.CreatePanel('Label', info, 'RestlessUltW', { hittest: 'false' });
			lb.style.horizontalAlign = 'center'; lb.style.verticalAlign = 'center'; lb.style.fontWeight = 'bold';
			lb.style.color = '#ffffff'; lb.style.textShadow = '0px 0px 3px 2.0 #000000'; lb.style.zIndex = '10';
		}
		lb.style.fontSize = v.length > 2 ? '11px' : '15px';
		lb.text = v;
		lb.style.visibility = 'visible';
	}
	function hit(payload) {
		if (typeof payload !== 'string' || payload.indexOf('"ultw"') < 0 || !ok(c) || !ok(info)) return;
		var k = low(nl);
		if (!k || k.indexOf('{') >= 0 || payload.toLowerCase().indexOf(JSON.stringify(k)) < 0) { if (cur) show(''); return; }
		var o = null; try { o = JSON.parse(payload); } catch (e) { return; }
		if (!o || o.rl !== 1 || o.t !== 'ultw' || !o.v || !Object.prototype.hasOwnProperty.call(o.v, k)) { show(''); return; }
		show(String(o.v[k] || ''));
		var now = Date.now();
		if (now - ack > 4000) { ack = now; try { $.DispatchEvent('ClientUI_FireOutput', JSON.stringify({ rl: 1, t: 'uwack', n: k })); } catch (e) {} }
	}
	function check() {
		if (!ok(c)) return;
		var root = null; try { root = c.GetChild(0); } catch (e) {}
		var par = null; try { par = c.GetParent(); } catch (e) {}
		info = c.FindChildTraverse('unit_info_bg'); nl = c.FindChildTraverse('name');
		var k = ok(nl) ? low(nl) : '';
		if (ok(info) && k && k.indexOf('{') < 0) {
			try { $.RegisterForUnhandledEvent('ClientUI_FireOutput', hit); } catch (e) {}
			if (!hi) {
				hi = true;
				var cc = cls(c).concat(cls(root).map(function (x) { return 'r.' + x; }), cls(par).map(function (x) { return 'p.' + x; }));
				try { $.DispatchEvent('ClientUI_FireOutput', JSON.stringify({ rl: 1, t: 'uwhi', c: cc.join(' ') || '-', n: k.slice(0, 24) })); } catch (e) {}
			}
			return;
		}
		if (++tries < 15) $.Schedule(2.0, check);
	}
	$.Schedule(0.5, check);
})();
