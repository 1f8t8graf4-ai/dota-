#!/usr/bin/env python3
"""v22.0 (20.11): глава 5 «2022 · Снюс» — дубль Макса (voice/v220, 841 кредит) + строки 16–17 главы 4 (voice/v210) → голос и таймлайны фильма и шортса.
  python3 v220_tl.py   → out/v220y-ru/{voice.wav,timeline.json}, out/v220s-ru/{voice.wav,timeline.json}, копии таймлайнов в tl/
Фильм (y): 0,5 с тишины (маркер на карточке 2022 осыпается — по разбору Gemini голос стартует на 0:00,5), b1–b2 (строки 16–17
  главы 4: «А в Америку…», «В ней нет даже… табака»), строки 1–12 текста 1, финал Б (f1–f4), потом 2,6 с: название и кольцо змеи.
Шортс (s): b1–b2, строки 1–11, вопрос «Угадаете, что окажется на обороте этой доски?», потом 1,9 с: доска на ребро,
  «Целиком — на YouTube», нырок в карточку 2022 = кадр 0 (петля).
Голос в дубле читал строки встык и проглотил многоточия — паузы добавлены здесь (PAD, INNER), из шума самой записи.
Вопрос шортса главы 3 (q3) — в этом же дубле, его берёт мостик 3 → 4."""
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

    ch5 = [f's{i}' for i in range(1, 13)]
    # ---- фильм ----
    F = V.Track(); F.pad(room, .5); bridge(F)
    for sc in ch5: line(F, sc)
    fin = F.t()
    for sc in ('f1', 'f2', 'f3', 'f4'): line(F, sc)
    vend = F.t(); F.silence(2.6)
    V.write('v220y-ru', F, {'vEnd': round(vend, 3), 'fin': round(fin, 3)})
    # ---- шортс ----
    Sh = V.Track(); Sh.pad(room, .1); bridge(Sh)
    for sc in ch5[:11]: line(Sh, sc)
    line(Sh, 'q'); qend = Sh.t(); Sh.silence(1.9)
    V.write('v220s-ru', Sh, {'vEnd': round(qend, 3), 'b0': round(qend - .1, 3)})


if __name__ == '__main__':
    main()
