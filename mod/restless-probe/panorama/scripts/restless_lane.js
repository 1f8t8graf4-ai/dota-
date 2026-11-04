// Restless 0.24 — линия «с пати» выбирается сама (Андрей: «автовыбор игры вместе на линии добавь обязательно»; в QoL Lock это «Lane with party»).
// Окно пати игры (popup_join_or_create_party) каждый раз открывается с «Сбалансированные линии». Когда окно открылось, ставим
// «С пати» (lanepreference_1) — один раз за открытие. Сменил сам на «Сбалансированные» — не трогаем, пока окно открыто.
(function () {
	var c = $.GetContextPanel(), tries = 0, done = false;
	function ok(p) { try { return !!(p && p.IsValid && p.IsValid()); } catch (e) { return false; } }
	function step() {
		if (done || !ok(c)) return;
		var d = c.FindChildTraverse('LanePreferenceSelector');
		if (ok(d) && d.SetSelected) {
			var cur = ''; try { var s = d.GetSelected(); cur = s ? s.id : ''; } catch (e) {}
			if (cur !== 'lanepreference_1') { try { d.SetSelected('lanepreference_1'); $.Msg('[Restless] линия: с пати'); } catch (e) { $.Msg('[Restless] линия: ' + e); } }
			done = true;
			return;
		}
		if (++tries < 20) $.Schedule(0.15, step);
	}
	$.Schedule(0.1, step);
})();
