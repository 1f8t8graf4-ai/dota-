// Restless 0.22 — КД ульты над героем. Этот скрипт подключён к полосе здоровья над юнитом (unit_status_overlay_v2.xml).
// Полоса живёт не в дереве HUD, поэтому секунды ей шлёт главный скрипт Restless событием ClientUI_FireOutput:
// {rl:1, t:'ultw', v:{ник или герой (строчными): секунды или ''}}. Нашли своего героя — отвечаем {rl:1, t:'uwack', n}.
// Крипы, лагеря, строения — ничего не делаем: ждём класс player до 30 с и выходим.
(function () {
	var c = $.GetContextPanel();
	if (!c) return;
	var tries = 0, info = null, nl = null, lb = null, icon = null, ack = 0, cur = '';
	function ok(p) { try { return !!(p && p.IsValid && p.IsValid()); } catch (e) { return false; } }
	function low(p) { try { return String(p.text || '').replace(/\s+/g, ' ').trim().toLowerCase(); } catch (e) { return ''; } }
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
		var o = null; try { o = JSON.parse(payload); } catch (e) { return; }
		if (!o || o.rl !== 1 || o.t !== 'ultw' || !o.v) return;
		var k = low(nl);
		if (!k || k.indexOf('{') >= 0 || !Object.prototype.hasOwnProperty.call(o.v, k)) { show(''); return; }
		show(String(o.v[k] || ''));
		var now = Date.now();
		if (now - ack > 4000) { ack = now; try { $.DispatchEvent('ClientUI_FireOutput', JSON.stringify({ rl: 1, t: 'uwack', n: k })); } catch (e) {} }
	}
	function check() {
		if (!ok(c)) return;
		if (c.BHasClass('player')) {
			info = c.FindChildTraverse('unit_info_bg'); nl = c.FindChildTraverse('name');
			if (ok(info) && ok(nl)) { try { $.RegisterForUnhandledEvent('ClientUI_FireOutput', hit); } catch (e) {} return; }
		}
		if (++tries < 15) $.Schedule(2.0, check);
	}
	$.Schedule(0.5, check);
})();
