#!/usr/bin/env python3
"""v22.0 (20.11): глава 5 «2022 · Снюс» — дубль Макса (voice/v220, 841 кредит) + строки 16–17 главы 4 (voice/v210) → голос и таймлайны фильма и шортса.
  python3 v220_tl.py   → out/v220y-ru/{voice.wav,timeline.json}, out/v220s-ru/{voice.wav,timeline.json}, копии таймлайнов в tl/
Фильм (y): 0,5 с тишины (маркер на карточке 2022 осыпается — по разбору Gemini голос стартует на 0:00,5), b1–b2 (строки 16–17
  главы 4: «А в Америку…», «В ней нет даже… табака»), строки 1–12 текста 1, финал Б (f1–f4), потом 2,6 с: название и кольцо змеи.
Шортс (s): b1–b2, строки 1–11, вопрос «Угадаете, что окажется на обороте этой доски?», потом 1,9 с: доска на ребро,
  «Целиком — на YouTube», нырок в карточку 2022 = кадр 0 (петля).
Голос в дубле читал строки встык и проглотил многоточия — паузы добавлены здесь (PAD, INNER), из шума самой записи.
Вопрос шортса главы 3 (q3) — в этом же дубле, его берёт мостик 3 → 4.
v22.4 (21.11, ФИНАЛЬНОЕ ТЗ мейн, Андрей: «я андрей и я даю добро»): дубль v224 (voice/v224, 106 кредитов) — мостик фильма b0
  «Но после провала с айкосом…» (поверх нити 2014 → 2022 и волны), новая f3 «Потяните за любую нить…» и вопрос шортса q.
  Фильм: b0 → пауза (волна накрывает кадр) → b1 на входе в океан; s12 вырезана — после s11 вода, фото 2022, отъезд на доску (PF1);
  перед f3 — пауза под молчаливый переворот доски (PFLIP); f4 — без «Змея кусает свой хвост:», перед ней — нити в кольцо и 0,5 с вращения (PF4)."""
import json, os
import numpy as np
import v200_tl as V

HERE = os.path.dirname(os.path.abspath(__file__)); SR = V.SR


def src(ep):
    tl = json.load(open(os.path.join(HERE, 'out', ep, 'timeline.json')))
    y = V.load(os.path.join(HERE, 'out', ep, 'voice.wav'))
    return tl['sent'], y, V.quiet_spans(y)


def main():
    S, y, Q = src('v220-ru'); S4, y4, Q4 = src('v210-ru')
    by = {s['scene']: s for s in S}; by4 = {s['scene']: s for s in S4}
    first = lambda d, sc: d[sc]['words'][0]['a']; last = lambda d, sc: d[sc]['words'][-1]['b']
    order = [s['scene'] for s in S]
    cut = {a: V.cut_between(Q, last(by, a), first(by, b)) for a, b in zip(order, order[1:])}
    cut[order[-1]] = min(len(y) / SR, last(by, order[-1]) + .35)
    beg = {b: cut[a] for a, b in zip(order, order[1:])}; beg[order[0]] = max(0, first(by, order[0]) - .12)
    # шум для пауз — самая тихая настоящая пауза дубля
    cand = [q for q in Q if q[1] - q[0] >= .14 and q[0] > first(by, 's1') and q[1] < first(by, 'q3')]
    rms = lambda q: float(np.sqrt(np.mean(y[int((q[0] + .03) * SR):int((q[1] - .03) * SR)] ** 2)))
    rs = min(cand, key=rms); room = y[int((rs[0] + .03) * SR):int((rs[1] - .03) * SR)]
    print('шум для пауз:', rs, f'{20 * np.log10(rms(rs) + 1e-12):.1f} dBFS')
    # строки 16–17 главы 4 = b1, b2 (переименованы, чтобы не путать со строками главы 5)
    b1a = V.cut_between(Q4, last(by4, 's15'), first(by4, 's16')); b1b = V.cut_between(Q4, last(by4, 's16'), first(by4, 's17'))
    b2b = V.cut_between(Q4, last(by4, 's17'), first(by4, 'q'))
    w17 = by4['s17']['words']; k = next(j for j, w in enumerate(w17) if w['d'].startswith('табака'))
    b2m = V.cut_between(Q4, w17[k - 1]['b'], w17[k]['a'])          # пауза «даже… | табака»
    ren = lambda s, n: dict(s, scene=n)
    PAD = {'s1': .3, 's3': .2, 's5': .15, 's6': .2, 's7': .2, 's8': .2, 's9': .25, 's10': .3, 's11': .25, 's12': .4,
           'f1': .9, 'f2': .4, 'f3': .4, 'f4': .3, 'q': .35}                 # пауза перед строкой
    INNER = {'s4': ('из', .35), 's9': ('«Зин', .22), 's12': ('Осталось', .25)}   # пауза внутри строки перед словом

    def line(tr, sc):
        if sc in PAD: tr.pad(room, PAD[sc])
        a, b = beg[sc], cut[sc]
        if sc in INNER:
            tok, d = INNER[sc]; W = by[sc]['words']; j = next(i for i, w in enumerate(W) if w['d'].startswith(tok))
            m = V.cut_between(Q, W[j - 1]['b'], W[j]['a']); tr.add(y, a, m, S); tr.pad(room, d); tr.add(y, m, b, S)
        else:
            tr.add(y, a, b, S)

    def bridge(tr):
        tr.add(y4, b1a, b1b, [ren(by4['s16'], 'b1')]); tr.pad(room, .25)
        tr.add(y4, b1b, b2m, [ren(by4['s17'], 'b2')]); tr.pad(room, .35); tr.add(y4, b2m, b2b, [ren(by4['s17'], 'b2')])

    # v22.4: дубль v224 — b0, f3, q (каждая строка — кусок между тишинами)
    S24, y24, Q24 = src('v224-ru'); by24 = {s['scene']: s for s in S24}; o24 = [s['scene'] for s in S24]
    cut24 = {a: V.cut_between(Q24, last(by24, a), first(by24, b)) for a, b in zip(o24, o24[1:])}; cut24[o24[-1]] = min(len(y24) / SR, last(by24, o24[-1]) + .35)
    beg24 = {b: cut24[a] for a, b in zip(o24, o24[1:])}; beg24[o24[0]] = max(0, first(by24, o24[0]) - .12)
    line24 = lambda tr, sc: tr.add(y24, beg24[sc], cut24[sc], [by24[sc]])
    # f4 без «Змея кусает свой хвост:» — с «вы» (с заглавной)
    W4 = by['f4']['words']; kv = next(j for j, w in enumerate(W4) if w['d'].lower().startswith('вы'))
    f4a = V.cut_between(Q, W4[kv - 1]['b'], W4[kv]['a'])
    f4s = dict(by['f4'], text='Вы бросаете одно — вам продают следующее.', words=[dict(w, d='Вы') if j == kv else w for j, w in enumerate(W4)])
    ch5 = [f's{i}' for i in range(1, 12)]
    # ---- фильм ----
    PB1, PF1, PFLIP, PF4 = .45, 2.8, 1.55, 1.45   # пауза b0 → b1 (волна), s11 → «Так» f1 (вода, фото, доска), f2 → f3 (переворот), f3 → f4 (кольцо + 0,5 с)
    F = V.Track(); F.pad(room, .35); line24(F, 'b0'); F.pad(room, PB1); bridge(F)
    for sc in ch5: line(F, sc)
    shB = F.sent[-1]['words'][-1]['b']; fin = F.t()
    F.pad(room, max(.3, shB + PF1 - (first(by, 'f1') - beg['f1']) - F.t())); F.add(y, beg['f1'], cut['f1'], S)
    line(F, 'f2'); f2b = F.sent[-1]['words'][-1]['b']
    F.pad(room, max(.3, f2b + PFLIP - (first(by24, 'f3') - beg24['f3']) - F.t())); line24(F, 'f3'); f3b = F.sent[-1]['words'][-1]['b']
    F.pad(room, max(.3, f3b + PF4 - (W4[kv]['a'] - f4a) - F.t())); F.add(y, f4a, cut['f4'], [f4s])
    vend = F.t(); F.silence(2.6)
    V.write('v220y-ru', F, {'vEnd': round(vend, 3), 'fin': round(fin, 3)})
    # ---- шортс ----
    Sh = V.Track(); Sh.pad(room, .1); bridge(Sh)
    for sc in ch5: line(Sh, sc)
    Sh.pad(room, .35); line24(Sh, 'q'); qend = Sh.t(); Sh.silence(1.9)
    V.write('v220s-ru', Sh, {'vEnd': round(qend, 3), 'b0': round(qend - .1, 3)})
    for ep in ('v220y-ru', 'v220s-ru'):
        T = json.load(open(os.path.join(HERE, 'out', ep, 'timeline.json'))); print(ep, f"{T['dur']:.2f} с:", ' '.join(f"{x['scene']} {x['a']:.2f}" for x in T['sent']))

if __name__ == '__main__':
    main()
