#!/usr/bin/env python3
"""Пульт решений v16.3 (страница с выбором для Андрея). python3 build163.py → pult-v16-3.html (кадры из img/ внутри страницы)."""
import base64, html, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
E = lambda s: html.escape(str(s), quote=True)

# ── данные ────────────────────────────────────────────────────────────────────────────────────────────
import sys
sys.path.insert(0, HERE)
from data163 import SCENES, FACTS, FLOW

# ── разметка ──────────────────────────────────────────────────────────────────────────────────────────
def fig(k, cap, alt, cls='shot'):
    return (f'<figure class="{cls}" tabindex="0" role="button" aria-label="Открыть кадр крупно: {E(alt)}">'
            f'<img src="{{{{img:{k}}}}}" width="960" height="540" alt="{E(alt)}">'
            f'<figcaption>{E(cap)}</figcaption></figure>')


def q_html(q):
    g = 'q_' + q['id']; imgs = q.get('imgs', [])
    figs = f'<div class="figs n{len(imgs)}">' + ''.join(fig(*x) for x in imgs) + '</div>' if imgs else ''
    why = f'<p class="q-why">{q["why"]}</p>' if q.get('why') else ''
    top = (f'<div class="q-top{" has-fig" if imgs else ""}">{figs}<div class="q-txt">'
           f'<div class="kick">{E(q["kick"])}</div><h3 class="q-title" id="t_{q["id"]}">{E(q["title"])}</h3>{why}</div></div>')
    opts = ''
    for o in q['opts']:
        text = o['h'] + (' — ' + o['s'] if o['s'] else '')
        sw = f'<i class="sw" style="background:{o["sw"]}"></i>' if o.get('sw') else ''
        attrs = f' data-text="{E(text)}"' + (' data-rec="1"' if o.get('rec') else '') + (f' data-cost="{o["cost"]}"' if o.get('cost') else '')
        typ = 'checkbox' if q.get('multi') else 'radio'
        opts += (f'<label class="opt{" rec" if o.get("rec") else ""}"><input type="{typ}" class="{"mo" if q.get("multi") else "ro"}" name="{g}" id="{o["id"]}"{attrs}>'
                 f'<span class="o-txt"><b>{sw}{E(o["h"])}</b>' + (f'<small>{E(o["s"])}</small>' if o['s'] else '') + '</span>'
                 + ('<em class="badge">совет</em>' if o.get('rec') else '') + '</label>')
    foot = f'<p class="q-foot">{E(q["foot"])}</p>' if q.get('foot') else ''
    ph = q.get('ph', 'Комментарий — необязательно')
    note = f'<input type="text" class="note" id="n_{q["id"]}" placeholder="{E(ph)}" aria-label="Комментарий: {E(q["label"])}">'
    return (f'<article class="q" data-g="{g}" data-label="{E(q["label"])}">{top}'
            f'<div class="opts n{min(len(q["opts"]), 3)}" role="{"group" if q.get("multi") else "radiogroup"}" aria-labelledby="t_{q["id"]}">{opts}</div>{foot}{note}</article>')


def fixes_html(sc):
    fx = sc.get('fixes') or []
    if not fx: return ''
    th = ''.join(fig(*x, cls='shot') for x in sc.get('fiximgs', []))
    items = ''
    for it in fx:
        i, t = it[0], it[1]
        if len(it) > 2:
            d = it[2]
            old = f'<s>Было: {E(d["old"])}</s>' if d['old'] != '—' else '<s>Было: —</s>'
            body = (f'<span class="tx"><em>{E(d["head"])}</em>{old}<ins>Стало: {E(d["new"])}</ins><small>{E(d["why"])}</small></span>')
        else:
            body = f'<span>{E(t)}</span>'
        items += f'<label class="fix"><input type="checkbox" class="fx" id="{i}" data-text="{E(t)}" checked>{body}</label>'
    head, hint = sc.get('fx_head', 'Делаю без вопросов'), sc.get('fx_hint', 'сними галочку, если не надо')
    la, lb = sc.get('fx_all', 'Без вопросов: делай всё'), sc.get('fx_but', 'Без вопросов: делай, кроме')
    return (f'<div class="fixes" data-all="{E(la)}" data-but="{E(lb)}"><div class="fx-head"><b>{E(head)} · {len(fx)}</b><span>{E(hint)}</span></div>'
            + (f'<div class="fx-thumbs">{th}</div>' if th else '') + f'<div class="fx-list">{items}</div></div>')


PAY = ('<div class="pay"><label class="pay-row"><input type="checkbox" id="chk_pay">'
       '<span><b>Даю «да» на трату: до <span id="cost">0</span> кредитов</b>'
       '<small>Сумма — по выбору выше. Трачу только после «брат это пизда» по картинке v16.3, точную сумму назову перед запуском. '
       'ElevenLabs к этой сессии не подключён — после «да» появится защищённая форма для ключа, в чат его не присылай.</small></span></label>'
       '<input type="text" class="note" id="n_limit" placeholder="Свой лимит или условие — необязательно" aria-label="Свой лимит или условие"></div>')


def scene_html(sc):
    tc = f'<span class="tc">{E(sc["tc"])}</span>' if sc.get('tc') else ''
    lead = f'<p class="sc-lead">{E(sc["lead"])}</p>' if sc.get('lead') else ''
    body = ''.join(q_html(q) for q in sc['qs']) + fixes_html(sc) + (PAY if sc.get('pay') else '')
    return (f'<section class="scene" id="{sc["id"]}" role="tabpanel" data-name="{E(sc["name"])}" data-tc="{E(sc.get("tc", ""))}" aria-labelledby="h_{sc["id"]}">'
            f'<div class="sc-head"><h2 id="h_{sc["id"]}">{E(sc["name"])}</h2>{tc}</div>{lead}{body}{pager_html(sc["id"])}</section>')


ORDER = [s['id'] for s in SCENES] + ['s11']
SHORT = {**{s['id']: s['short'] for s in SCENES}, 's11': 'Ещё'}


def tabs_html():
    # Не ссылки-якоря: просмотрщик Claude может перехватывать нажатия на <a href="#…"> — «вкладка не открывается».
    # Вкладка = скрытый переключатель + подпись: раздел показывает CSS (:has), даже если код страницы не запустился.
    b = ''
    for s in SCENES + [{'id': 's11', 'short': 'Ещё', 'qs': None}]:
        cnt = f' <i>0/{len(s["qs"])}</i>' if s['qs'] else ''
        chk = ' checked' if s['id'] == ORDER[0] else ''
        b += (f'<input type="radio" class="tabr" name="pult_tab" id="tr_{s["id"]}" value="{s["id"]}"{chk}>'
              f'<label class="tab" for="tr_{s["id"]}" data-s="{s["id"]}">{E(s["short"])}{cnt}</label>')
    return f'<div id="tabsTop"></div><div class="tabs" role="radiogroup" aria-label="Разделы пульта">{b}</div>'


def tabs_css():
    show = ',\n'.join(f'.wrap:has(#tr_{i}:checked) #{i}' for i in ORDER)
    return ('.wrap:has(.tabr:checked) section.scene { display: none; }\n'
            f'{show} {{ display: grid; }}\n')


def pager_html(sid):
    k = ORDER.index(sid); out = ''
    if k > 0:
        out += f'<button type="button" class="btn-alt pg-prev" data-go="{ORDER[k - 1]}">← {E(SHORT[ORDER[k - 1]])}</button>'
    if k + 1 < len(ORDER):
        out += f'<button type="button" class="btn-alt pg-next" data-go="{ORDER[k + 1]}">Дальше: {E(SHORT[ORDER[k + 1]])} →</button>'
    else:
        out += '<button type="button" class="btn-main pg-next" data-act="save">Сохранить ответы</button>'
    return f'<div class="pager">{out}</div>'


CSS = r'''
:root {
  --bg: #EDF0F5; --card: #FFFFFF; --line: #D3DAE7; --fg: #121A33; --muted: #56627F;
  --accent: #9A6200; --accent-fill: #F2B53A; --on-accent: #1B1405;
  --rec: #8A5A00; --rec-bg: #FFF1CF;
  --opt: #F5F7FB; --opt-on: #FFF3D6; --opt-on-line: #D9952A;
  --bar: #FFFFFF; --ok: #1F7A4D; --err: #B42318; --chip: #E3E8F2; --shot: #0C1226; --scrim: rgba(8, 12, 28, .88);
  --f-display: "Unbounded", "Golos Text", system-ui, sans-serif;
  --f-body: "Golos Text", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --f-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #0C1226; --card: #141C38; --line: #273360; --fg: #EEF2FF; --muted: #9EA9C9;
    --accent: #F2B53A; --accent-fill: #F2B53A; --on-accent: #1B1405;
    --rec: #F2C46A; --rec-bg: #2B2511;
    --opt: #101833; --opt-on: #2B2511; --opt-on-line: #F2B53A;
    --bar: #0F1730; --ok: #5BD69A; --err: #FF8A80; --chip: #1B2547; --shot: #070B18;
    color-scheme: dark;
  }
}
:root[data-theme="dark"] {
  --bg: #0C1226; --card: #141C38; --line: #273360; --fg: #EEF2FF; --muted: #9EA9C9;
  --accent: #F2B53A; --accent-fill: #F2B53A; --on-accent: #1B1405;
  --rec: #F2C46A; --rec-bg: #2B2511;
  --opt: #101833; --opt-on: #2B2511; --opt-on-line: #F2B53A;
  --bar: #0F1730; --ok: #5BD69A; --err: #FF8A80; --chip: #1B2547; --shot: #070B18;
  color-scheme: dark;
}
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body {
  margin: 0; background: var(--bg); color: var(--fg);
  font-family: var(--f-body); font-size: 15px; line-height: 1.5;
  padding-top: 20px;
  padding-bottom: calc(160px + env(safe-area-inset-bottom, 0px));
  padding-left: max(16px, env(safe-area-inset-left, 0px));
  padding-right: max(16px, env(safe-area-inset-right, 0px));
}
.wrap { max-width: 980px; margin: 0 auto; display: grid; gap: 14px; min-width: 0; }
header { display: grid; gap: 12px; }
.eyebrow { font-family: var(--f-mono); font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
h1 { font-family: var(--f-display); font-weight: 700; font-size: clamp(28px, 7vw, 40px); line-height: 1.08; margin: 0; }
.lead { margin: 0; color: var(--muted); max-width: 68ch; }
.flow-w { display: grid; gap: 4px; }
.flow-k { font-family: var(--f-mono); font-size: 11px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
.flow { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; row-gap: 2px; font-size: 13px; color: var(--muted); }
.flow li + li::before { content: "→"; margin: 0 7px; }
.flow li.fl-pay { color: var(--rec); font-weight: 700; }
.head-act { display: flex; flex-wrap: wrap; gap: 8px 12px; align-items: center; }
.head-act .hint { color: var(--muted); font-size: 13px; }
#tabsTop { height: 0; scroll-margin-top: env(safe-area-inset-top, 0px); }
.tabs { position: relative; display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 0 10px; background: var(--bg); border-bottom: 1px solid var(--line); }
.tabr { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; pointer-events: none; }
@media (min-width: 760px) {
  .tabs { position: sticky; top: env(safe-area-inset-top, 0px); z-index: 4; margin-inline: calc(-1 * max(16px, env(safe-area-inset-left, 0px))); padding: 8px max(16px, env(safe-area-inset-left, 0px)) 10px; }
}
body::before { content: ""; position: fixed; inset: 0 0 auto; height: env(safe-area-inset-top, 0px); z-index: 10; background: var(--bg); }
.tab { display: inline-flex; align-items: center; gap: 6px; min-height: 40px; padding: 6px 12px; border-radius: 99px; border: 1px solid var(--line); background: var(--card); color: var(--fg); font-size: 13.5px; font-weight: 600; line-height: 1.2; cursor: pointer; user-select: none; -webkit-user-select: none; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
.tab i { font-style: normal; font-family: var(--f-mono); font-size: 11px; font-weight: 500; color: var(--muted); }
.tab.done { border-color: var(--ok); }
.tab.done i { color: var(--ok); }
.tab.on, .tabr:checked + .tab { background: var(--accent-fill); border-color: var(--accent-fill); color: var(--on-accent); }
.tab.on i, .tabr:checked + .tab i { color: var(--on-accent); }
.tabr:focus-visible + .tab { outline: 2px solid var(--accent); outline-offset: 2px; }
.scene { display: grid; gap: 12px; min-width: 0; }
.scene[hidden] { display: none !important; }
.sc-head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 12px; margin-top: 4px; }
.sc-head h2 { font-family: var(--f-display); font-weight: 500; font-size: 21px; line-height: 1.2; margin: 0; }
.tc { font-family: var(--f-mono); font-size: 12px; color: var(--muted); }
.sc-lead { margin: 0; color: var(--muted); font-size: 14px; max-width: 70ch; }
.q { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 14px; display: grid; gap: 12px; min-width: 0; }
.q.answered { border-color: var(--opt-on-line); }
.q-top { display: grid; gap: 12px; min-width: 0; }
@media (min-width: 760px) { .q-top.has-fig { grid-template-columns: minmax(0, 300px) minmax(0, 1fr); align-items: start; } }
.q-txt { min-width: 0; }
.figs { display: grid; gap: 8px; min-width: 0; }
.figs.n2 { grid-template-columns: 1fr 1fr; }
@media (min-width: 760px) { .figs.n2 { grid-template-columns: 1fr; } }
.shot { margin: 0; position: relative; min-width: 0; border-radius: 10px; overflow: hidden; border: 1px solid var(--line); background: var(--shot); cursor: zoom-in; }
.shot img { display: block; width: 100%; height: auto; aspect-ratio: 16 / 9; object-fit: cover; }
.shot figcaption { position: absolute; left: 6px; bottom: 6px; max-width: calc(100% - 12px); font-family: var(--f-mono); font-size: 10.5px; line-height: 1.3; padding: 2px 6px; border-radius: 6px; background: rgba(5, 8, 20, .74); color: #fff; }
.kick { font-family: var(--f-mono); font-size: 11.5px; letter-spacing: .04em; text-transform: uppercase; color: var(--accent); }
.q-title { margin: 3px 0 0; font-size: 16.5px; line-height: 1.35; font-weight: 700; text-wrap: balance; }
.q-why { margin: 8px 0 0; color: var(--muted); font-size: 13.5px; }
.q-why b { color: var(--fg); }
.opts { display: grid; gap: 8px; min-width: 0; }
@media (min-width: 760px) {
  .opts.n2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .opts.n3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
.opt { position: relative; display: flex; gap: 10px; align-items: flex-start; min-width: 0; padding: 12px; border-radius: 11px; border: 1px solid var(--line); background: var(--opt); cursor: pointer; }
.opt.rec { padding-top: 14px; }
.opt.on { background: var(--opt-on); border-color: var(--opt-on-line); box-shadow: inset 0 0 0 1px var(--opt-on-line); }
.opt input { flex: none; width: 18px; height: 18px; margin: 2px 0 0; accent-color: var(--opt-on-line); }
.o-txt { min-width: 0; display: grid; gap: 3px; }
.o-txt b { font-size: 14.5px; line-height: 1.3; }
.o-txt small { color: var(--muted); font-size: 12.8px; line-height: 1.42; }
.badge { position: absolute; top: -9px; right: 10px; font-style: normal; font-family: var(--f-mono); font-size: 10.5px; letter-spacing: .05em; text-transform: uppercase; padding: 1px 7px; border-radius: 99px; background: var(--rec-bg); color: var(--rec); border: 1px solid var(--opt-on-line); }
.sw { display: inline-block; width: 14px; height: 14px; margin-right: 7px; border-radius: 4px; border: 1px solid var(--line); vertical-align: -2px; }
.q-foot { margin: 0; color: var(--muted); font-size: 12.8px; border-left: 3px solid var(--line); padding: 2px 0 2px 10px; }
.note { width: 100%; padding: 10px 12px; border-radius: 10px; border: 1px solid var(--line); background: var(--opt); color: var(--fg); font: inherit; font-size: 14px; }
.note::placeholder { color: var(--muted); }
textarea.note { min-height: 104px; resize: vertical; }
.fixes { display: grid; gap: 10px; padding: 12px 14px; border: 1px dashed var(--line); border-radius: 14px; min-width: 0; }
.fx-head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px 10px; }
.fx-head b { font-size: 14.5px; }
.fx-head span { color: var(--muted); font-size: 12.5px; }
.fx-thumbs { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px; }
.fx-list { display: grid; gap: 2px; }
.fix { display: flex; gap: 10px; align-items: flex-start; padding: 6px 4px; border-radius: 8px; cursor: pointer; font-size: 14px; }
.fix input { flex: none; width: 18px; height: 18px; margin: 2px 0 0; accent-color: var(--ok); }
.fix.off span { color: var(--muted); text-decoration: line-through; }
.fix .tx { display: grid; gap: 3px; min-width: 0; }
.fix .tx em { font-style: normal; font-family: var(--f-mono); font-size: 11.5px; letter-spacing: .04em; text-transform: uppercase; color: var(--accent); }
.fix .tx s { color: var(--muted); }
.fix .tx ins { text-decoration: none; font-weight: 700; }
.fix .tx small { color: var(--muted); font-size: 12.8px; }
.fix.off .tx em, .fix.off .tx ins, .fix.off .tx small { color: var(--muted); text-decoration: line-through; }
.fx-list .fix + .fix { border-top: 1px solid var(--line); border-radius: 0; }
.pay { display: grid; gap: 10px; padding: 14px; border-radius: 14px; border: 1px solid var(--opt-on-line); background: var(--rec-bg); }
.pay-row { display: flex; gap: 10px; align-items: flex-start; cursor: pointer; }
.pay-row input { flex: none; width: 20px; height: 20px; margin: 2px 0 0; accent-color: var(--opt-on-line); }
.pay-row b { font-size: 15.5px; }
.pay-row small { display: block; margin-top: 3px; color: var(--muted); font-size: 13px; }
#cost { font-family: var(--f-mono); }
.pager { display: flex; gap: 8px; margin-top: 2px; }
.pager > * { flex: 1 1 0; min-width: 0; }
.pg-next.btn-alt { border-color: var(--opt-on-line); color: var(--fg); background: var(--card); }
.facts { display: grid; gap: 4px; padding: 12px 14px; border-radius: 14px; border: 1px solid var(--line); background: var(--card); }
.facts b { font-size: 14.5px; }
.facts span { color: var(--muted); font-size: 12.5px; }
.facts ul { margin: 6px 0 0; padding-left: 20px; display: grid; gap: 4px; font-size: 14px; }
details.box { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 12px 14px; }
details.box summary { cursor: pointer; font-weight: 700; }
details.box ul { margin: 10px 0 0; padding-left: 20px; display: grid; gap: 4px; font-size: 14px; }
textarea.out { display: block; width: 100%; min-height: 280px; margin-top: 10px; padding: 12px; border-radius: 12px; border: 1px solid var(--line); background: var(--opt); color: var(--fg); font-family: var(--f-mono); font-size: 12.5px; line-height: 1.5; resize: vertical; }
.bar {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 5; background: var(--bar); border-top: 1px solid var(--line);
  padding-top: 10px; padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
  padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px));
}
.bar-in { max-width: 980px; margin: 0 auto; display: grid; gap: 8px; }
.bar-top { display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px 12px; font-size: 13px; min-width: 0; }
#prog { font-weight: 700; white-space: nowrap; }
.status { flex: 1 1 200px; min-width: 0; color: var(--muted); }
.status.ok { color: var(--ok); }
.status.err { color: var(--err); }
.btns { display: flex; gap: 8px; }
.btns button { flex: 1 1 0; }
@media (min-width: 760px) { .bar-in { grid-template-columns: minmax(0, 1fr) auto; align-items: center; } .btns button { flex: none; } }
button { font: inherit; font-weight: 700; font-size: 14.5px; line-height: 1.2; min-height: 44px; padding: 10px 14px; border-radius: 10px; cursor: pointer; border: 1px solid transparent; }
.btn-main { background: var(--accent-fill); color: var(--on-accent); }
.btn-main[disabled] { opacity: .55; cursor: default; }
.btn-alt { background: transparent; color: var(--fg); border-color: var(--line); }
dialog#lb { width: 100%; max-width: min(1200px, 94vw); padding: 0; border: 0; background: transparent; color: #fff; }
dialog#lb::backdrop { background: var(--scrim); }
#lb img { display: block; width: 100%; height: auto; border-radius: 12px; }
#lb p { margin: 8px 2px 0; font-family: var(--f-mono); font-size: 12.5px; }
input:focus-visible, button:focus-visible, textarea:focus-visible, summary:focus-visible, .shot:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
@media (prefers-reduced-motion: no-preference) {
  .opt, .q, .tab { transition: background-color .15s, border-color .15s, box-shadow .15s; }
}
'''

JS = r'''
(function () {
  "use strict";
  var DOC_PATH = "answers/v16-3", DRAFT_KEY = "pult-v16-3-draft";
  var $ = function (id) { return document.getElementById(id); };
  var qs = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var db = null, saving = false;
  var GROUPS = qs(".q[data-g]").map(function (q) { return q.getAttribute("data-g"); });
  var NOTES = qs("input.note, textarea.note").map(function (el) { return el.id; });
  var CHECKS = qs("input[type=checkbox]").map(function (el) { return el.id; });

  function checked(g) { return document.querySelector('input[name="' + g + '"]:checked'); }
  function nbsp(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
  function plural(n) { var a = n % 10, b = n % 100; if (a === 1 && b !== 11) return ""; if (a >= 2 && a <= 4 && (b < 10 || b >= 20)) return "а"; return "ов"; }

  function readState() {
    var s = { radios: {}, notes: {}, checks: {} };
    GROUPS.forEach(function (g) { var el = checked(g); s.radios[g] = el ? el.id : ""; });
    NOTES.forEach(function (id) { s.notes[id] = $(id).value.trim(); });
    CHECKS.forEach(function (id) { s.checks[id] = $(id).checked; });
    return s;
  }
  function applyState(s) {
    if (!s) return;
    GROUPS.forEach(function (g) {
      if (!s.radios || !(g in s.radios)) return;
      qs('input[name="' + g + '"]').forEach(function (el) { el.checked = el.id === s.radios[g]; });
    });
    Object.keys(s.notes || {}).forEach(function (id) { if ($(id)) $(id).value = s.notes[id] || ""; });
    Object.keys(s.checks || {}).forEach(function (id) { var el = $(id); if (el && el.type === "checkbox") el.checked = !!s.checks[id]; });
  }

  function cost() {
    var n = 0;
    qs("input[type=radio][data-cost]").forEach(function (el) { if (el.checked) n += +el.getAttribute("data-cost") || 0; });
    return n;
  }

  function progress() {
    var done = 0;
    GROUPS.forEach(function (g) { if (checked(g)) done++; });
    $("prog").textContent = "Выбрано " + done + " из " + GROUPS.length;
    qs(".tab[data-s]").forEach(function (t) {
      var i = t.querySelector("i"); if (!i) return;
      var gs = qs(".q[data-g]", $(t.getAttribute("data-s")));
      var d = gs.filter(function (q) { return checked(q.getAttribute("data-g")); }).length;
      i.textContent = d + "/" + gs.length;
      t.classList.toggle("done", d === gs.length);
    });
    qs(".q[data-g]").forEach(function (q) { q.classList.toggle("answered", !!checked(q.getAttribute("data-g"))); });
    qs(".opt").forEach(function (l) { l.classList.toggle("on", l.querySelector("input").checked); });
    qs(".fix").forEach(function (l) { l.classList.toggle("off", !l.querySelector("input").checked); });
    $("cost").textContent = nbsp(cost());
    return done;
  }

  function buildText() {
    var L = ["Пульт v16.3 — мои ответы", ""];
    qs("section.scene").forEach(function (sc) {
      var lines = [];
      qs(".q", sc).forEach(function (q) {
        var g = q.getAttribute("data-g"), n = q.querySelector(".note"), v = n ? n.value.trim() : "";
        var all = qs('input[name="' + g + '"]:checked').map(function (x) { return x.getAttribute("data-text"); });
        lines.push("- " + q.getAttribute("data-label") + ": " + (all.length ? all.join("; ") : "не выбрано") + (v ? " | коммент: " + v : ""));
      });
      var fx = qs("input.fx", sc), fb = sc.querySelector(".fixes");
      if (fx.length) {
        var la = (fb && fb.getAttribute("data-all")) || "Без вопросов: делай всё", lb2 = (fb && fb.getAttribute("data-but")) || "Без вопросов: делай, кроме";
        var off = fx.filter(function (x) { return !x.checked; }).map(function (x) { return "«" + x.getAttribute("data-text") + "»"; });
        lines.push(off.length ? "- " + lb2 + " " + off.join("; ") : "- " + la + " (" + fx.length + ")");
      }
      if (sc.querySelector("#chk_pay")) {
        lines.push($("chk_pay").checked ? "- Трата: даю «да» — до " + nbsp(cost()) + " кредитов, только после «брат это пизда» по картинке" : "- Трата: пока не даю");
        var lim = $("n_limit").value.trim(); if (lim) lines.push("- Лимит / условие: " + lim);
      }
      qs("textarea.note", sc).forEach(function (t) { if (t.value.trim()) lines.push(t.value.trim()); });
      if (!lines.length) return;
      var tc = sc.getAttribute("data-tc");
      L.push("## " + sc.getAttribute("data-name") + (tc ? " · " + tc : ""));
      L.push.apply(L, lines); L.push("");
    });
    return L.join("\n").trim();
  }

  function setStatus(text, kind) { var el = $("status"); el.textContent = text; el.className = "status" + (kind ? " " + kind : ""); }
  function fmtTime(iso) { try { return new Date(iso).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }); } catch (e) { return iso; } }
  function withTimeout(p, ms) {
    return new Promise(function (res, rej) {
      var t = setTimeout(function () { rej({ code: "timeout" }); }, ms);
      p.then(function (v) { clearTimeout(t); res(v); }, function (e) { clearTimeout(t); rej(e); });
    });
  }

  function refresh(user) {
    progress();
    $("output").value = buildText();
    if (user) {
      try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ t: Date.now(), s: readState() })); } catch (e) {}
      if (db) setStatus("Есть несохранённые изменения.");
    }
  }

  function fillRec() {
    var n = 0;
    GROUPS.forEach(function (g) {
      if (checked(g)) return;
      var els = qs('input[name="' + g + '"][data-rec]');
      if (els.length && els[0].type === "radio") els = els.slice(0, 1);
      els.forEach(function (el) { el.checked = true; });
      if (els.length) n++;
    });
    refresh(true);
    setStatus(n ? "Поставил советы в " + n + " пункт" + plural(n) + ". Проверь и нажми «Сохранить»." : "Все пункты уже выбраны.", n ? "" : "ok");
  }

  function save() {
    if (saving) return;
    refresh(false);
    if (!db) { setStatus("Сохранение тут недоступно — нажми «Текстом» и пришли текст в чат.", "err"); return; }
    saving = true; $("btnSave").disabled = true; setStatus("Сохраняю…");
    var payload = { state: readState(), text: buildText(), answered: progress(), total: GROUPS.length, savedAt: new Date().toISOString(), v: 1 };
    withTimeout(db.doc(DOC_PATH).set(payload), 15000).then(function () {
      setStatus("Сохранено " + fmtTime(payload.savedAt) + " — Claude прочитает сам.", "ok");
    }, function (e) {
      setStatus("Не сохранилось (" + ((e && e.code) || "ошибка") + "). Нажми «Текстом» и пришли текст в чат.", "err");
    }).then(function () { saving = false; $("btnSave").disabled = false; });
  }

  function copy() {
    var box = $("output"); box.value = buildText();
    var done = function () { setStatus("Текст скопирован — вставь его в чат.", "ok"); };
    var manual = function () { $("outbox").open = true; box.focus(); box.select(); setStatus("Само не скопировалось — текст выделен внизу, скопируй вручную.", "err"); };
    try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(box.value).then(done, manual); else manual(); } catch (e) { manual(); }
  }

  var lb = $("lb");
  function openShot(f) {
    if (!lb || typeof lb.showModal !== "function") return;
    var img = f.querySelector("img"), cap = f.querySelector("figcaption");
    $("lbImg").src = img.currentSrc || img.src; $("lbImg").alt = img.alt; $("lbCap").textContent = cap ? cap.textContent : "";
    lb.showModal();
  }
  if (lb) lb.addEventListener("click", function () { lb.close(); });
  qs("figure.shot").forEach(function (f) {
    f.addEventListener("click", function () { openShot(f); });
    f.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openShot(f); } });
  });

  var draft = null;
  try { draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null"); } catch (e) {}
  if (draft && draft.s) applyState(draft.s);
  refresh(false);

  document.addEventListener("change", function (e) { if (e.target.matches("input") && !e.target.classList.contains("tabr")) refresh(true); });
  document.addEventListener("input", function (e) { if (e.target.matches(".note")) refresh(true); });
  $("btnRec").addEventListener("click", fillRec);
  $("btnRecTop").addEventListener("click", fillRec);
  $("btnSave").addEventListener("click", save);
  $("btnCopy").addEventListener("click", copy);

  // Вкладки: открыт один раздел. Без ссылок-якорей и без прокрутки к якорю — работает в любом просмотрщике.
  var TAB_KEY = "pult-v16-3-tab", tabs = qs(".tab[data-s]"), panels = qs("section.scene"), cur = "";
  function bringTop(force) {
    var el = $("tabsTop"); if (!el) return;
    if (!force && el.getBoundingClientRect().top >= 0) return;
    try { el.scrollIntoView({ block: "start", inline: "nearest" }); } catch (e) { try { el.scrollIntoView(true); } catch (e2) {} }
  }
  function show(id, force) {
    if (!panels.some(function (p) { return p.id === id; })) id = panels[0].id;
    cur = id;
    var r = $("tr_" + id); if (r && !r.checked) r.checked = true;
    panels.forEach(function (p) { p.hidden = p.id !== id; });
    tabs.forEach(function (t) { t.classList.toggle("on", t.getAttribute("data-s") === id); });
    try { localStorage.setItem(TAB_KEY, id); } catch (e) {}
    bringTop(force);
  }
  qs(".tabr").forEach(function (r) { r.addEventListener("change", function () { if (r.checked) show(r.value, true); }); });
  tabs.forEach(function (t) { t.addEventListener("click", function () { if (t.getAttribute("data-s") === cur) bringTop(true); }); });
  qs("[data-go]").forEach(function (b) { b.addEventListener("click", function () { show(b.getAttribute("data-go"), true); }); });
  qs("[data-act=save]").forEach(function (b) { b.addEventListener("click", save); });
  var last = ""; try { last = localStorage.getItem(TAB_KEY) || ""; } catch (e) {}
  show(last || panels[0].id, false);

  setStatus("Подключаю сохранение…");
  var useP = (window.claude && typeof window.claude.use === "function") ? window.claude.use("db") : Promise.resolve(null);
  withTimeout(useP, 12000).then(function (ns) {
    db = ns;
    if (!db) { setStatus("Сохранение тут недоступно — выбирай и жми «Текстом», пришлёшь текст в чат."); return; }
    setStatus("Загружаю сохранённое…");
    return withTimeout(db.doc(DOC_PATH).get(), 10000).then(function (snap) {
      var saved = snap && snap.exists ? snap.data() : null;
      if (saved && saved.state) {
        var st = Date.parse(saved.savedAt || "") || 0;
        if (!draft || !draft.t || st >= draft.t) { applyState(saved.state); refresh(false); }
        setStatus("Последнее сохранение: " + fmtTime(saved.savedAt) + ".", "ok");
      } else {
        setStatus("Ещё не сохранено. Отметь варианты и нажми «Сохранить».");
      }
    }, function () { setStatus("Сохранённое не загрузилось. Сохранить всё равно можно."); });
  }, function () { setStatus("Сохранение тут недоступно — нажми «Текстом» и пришли текст в чат."); });
})();
'''


def page():
    flow = ''.join(('<li class="fl-' + c + '">' if c else '<li>') + E(t) + '</li>' for t, c in FLOW)
    facts = ''.join(f'<li>{E(f)}</li>' for f in FACTS)
    nq = sum(len(s['qs']) for s in SCENES)
    body = (
        '<div class="wrap">'
        '<header>'
        '<div class="eyebrow">«Что вы знаете об одноразках?» · v16.2 → v16.3 и большой ролик · версия 5</div>'
        '<h1>Пульт v16.3</h1>'
        f'<p class="lead">{nq} пункт{("" if nq % 10 == 1 and nq % 100 != 11 else "а" if 2 <= nq % 10 <= 4 and not 12 <= nq % 100 <= 14 else "ов")}: картинка v16.2, текст голоса, голос и звуки, площадки и большой ролик. Разделы — вкладками, внизу каждого — «Дальше». '
        '«Совет» — мой выбор, кадр нажми — откроется крупно. Отметь своё и нажми «Сохранить» — я прочитаю сам.</p>'
        f'<div class="flow-w"><span class="flow-k">Порядок</span><ol class="flow" aria-label="Порядок работы">{flow}</ol></div>'
        '<div class="head-act"><button type="button" class="btn-alt" id="btnRecTop">Поставить мои советы во все пустые пункты</button>'
        '<span class="hint">Твои выборы не трогает.</span></div>'
        '</header>'
        f'{tabs_html()}'
        + ''.join(scene_html(s) for s in SCENES) +
        '<section class="scene" id="s11" role="tabpanel" data-name="Ещё" data-tc="" aria-labelledby="h_s11">'
        '<div class="sc-head"><h2 id="h_s11">Ещё</h2></div>'
        '<textarea class="note" id="n_extra" placeholder="Что ещё поправить или добавить — необязательно" aria-label="Что ещё поправить или добавить"></textarea>'
        f'<div class="facts"><b>Где Gemini неточен · {len(FACTS)}</b><span>для справки, выбирать тут ничего не надо</span><ul>{facts}</ul></div>'
        f'{pager_html("s11")}'
        '</section>'
        '<details class="box" id="outbox"><summary>Текст ответов</summary><textarea class="out" id="output" readonly aria-label="Текст ответов"></textarea></details>'
        '</div>'
        '<div class="bar"><div class="bar-in">'
        '<div class="bar-top"><span id="prog">Выбрано 0</span><span class="status" id="status" role="status" aria-live="polite"></span></div>'
        '<div class="btns"><button type="button" class="btn-alt" id="btnRec">Советы</button>'
        '<button type="button" class="btn-main" id="btnSave">Сохранить</button>'
        '<button type="button" class="btn-alt" id="btnCopy">Текстом</button></div>'
        '</div></div>'
        '<dialog id="lb" aria-label="Кадр крупно"><img id="lbImg" alt=""><p id="lbCap"></p></dialog>'
    )
    doc = ('<title>Пульт v16.3</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n'
           '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700&family=Unbounded:wght@500;700&family=JetBrains+Mono:wght@500&display=swap">\n'
           f'<style>{CSS}{tabs_css()}</style>\n{body}\n<script>{JS}</script>\n')
    def img(m):
        p = os.path.join(HERE, 'img', m.group(1) + '.jpg')
        return 'data:image/jpeg;base64,' + base64.b64encode(open(p, 'rb').read()).decode()
    return re.sub(r'\{\{img:([a-z0-9_]+)\}\}', img, doc)


if __name__ == '__main__':
    out = os.path.join(HERE, 'pult-v16-3.html'); s = page()
    open(out, 'w', encoding='utf-8').write(s)
    ids = re.findall(r' id="([^"]+)"', s); dup = {i for i in ids if ids.count(i) > 1}
    assert not dup, dup
    print(out, len(s) // 1024, 'КБ;', sum(len(x['qs']) for x in SCENES), 'пунктов;',
          sum(len(x.get('fixes') or []) for x in SCENES), 'правок без вопросов')
