#!/usr/bin/env python3
"""v21.0 (19.11): глава 4 «2014 · Нагреватели» — один дубль Макса (voice/v210, 830 кредитов) → голос и таймлайны фильма и шортса.
  python3 v210_tl.py   → out/v210y-ru/{voice.wav,timeline.json}, out/v210s-ru/{voice.wav,timeline.json}, копии таймлайнов в tl/
Фильм (y): строки 1–15 (v21.1: строки 16–17 «А в Америку… табака» переехали в начало главы 5). Добавленные паузы: после вопроса
  «Без огня — значит, без вреда?» +0,25 с, перед «Бросают они…» +0,3 с. После голоса — 3,8 с финала: кадр кофейни сжимается
  в фото карточки 2014 → доска → нить к закрытой 2022.
Шортс (s): строки 1–15, пауза 0,3 с, вопрос «Угадаете, с чем они всё-таки вернулись в Америку?», потом 1,9 с «Часть 5 →»
  и петля в кадр 0 (на стол ложится свежая газета).
Резы — посреди настоящих пауз записи (v200_tl.cut_between), склейки с наплывом 15 мс, паузы — шум самой записи."""
import json, os
import numpy as np
import v200_tl as V

HERE = os.path.dirname(os.path.abspath(__file__)); SR = V.SR
SRC = os.path.join(HERE, 'out', 'v210-ru')


def main():
    tl = json.load(open(os.path.join(SRC, 'timeline.json'))); y = V.load(os.path.join(SRC, 'voice.wav')); S = tl['sent']
    Q = V.quiet_spans(y); by = {s['scene']: s for s in S}
    first = lambda sc: by[sc]['words'][0]['a']; last = lambda sc: by[sc]['words'][-1]['b']
    order = [s['scene'] for s in S]
    cut = {}
    for a, b in zip(order, order[1:]): cut[a] = V.cut_between(Q, last(a), first(b))
    cut[order[-1]] = min(len(y) / SR, last(order[-1]) + .35)
    w17 = by['s17']['words']; k = next(j for j, w in enumerate(w17) if w['d'].startswith('табака'))
    mid17 = V.cut_between(Q, w17[k - 1]['b'], w17[k]['a'])          # пауза «даже… | табака»
    cand = [q for q in Q if q[1] - q[0] >= .18 and q[1] < first('q') and q[0] > first('s1')]
    rms = lambda q: float(np.sqrt(np.mean(y[int((q[0] + .03) * SR):int((q[1] - .03) * SR)] ** 2)))
    rs = min(cand, key=rms); room = y[int((rs[0] + .03) * SR):int((rs[1] - .03) * SR)]
    print('шум для пауз:', rs, f'{20 * np.log10(rms(rs) + 1e-12):.1f} dBFS')
    start = max(0, first('s1') - .12)
    PAD = {'s8': .25, 's15': .3, 's16': .35}                         # пауза перед строкой

    def body(tr, scenes):
        for n, sc in enumerate(scenes):
            a = start if n == 0 else cut[order[order.index(sc) - 1]]
            if sc in PAD and n: tr.pad(room, PAD[sc])
            if sc == 's17':
                tr.add(y, a, mid17, S); tr.pad(room, .35); tr.add(y, mid17, cut[sc], S)
            else:
                tr.add(y, a, cut[sc], S)

    # ---- фильм ----
    F = V.Track(); body(F, order[:15]); vend = F.t(); F.silence(2.0)   # v21.2: хвост 2 с (разбор Gemini: на стыке 4 → 5 была пауза 2,5 с)   # v21.1: без строк 16–17 (переехали в начало главы 5) — после «как и вы» сразу доска
    V.write('v210y-ru', F, {'vEnd': round(vend, 3), 'b0': round(vend - .1, 3)})
    # ---- шортс ----
    Sh = V.Track(); body(Sh, order[:15]); Sh.pad(room, .3); Sh.add(y, cut['s17'], cut['q'], S)
    qend = Sh.t(); Sh.silence(1.9)
    V.write('v210s-ru', Sh, {'vEnd': round(qend, 3), 'b0': round(qend - .1, 3)})


if __name__ == '__main__':
    main()
