#!/usr/bin/env python3
"""v18.2 (16.11): правка факта в голосе моего выпуска 2 без новых трат.
Фраза «И когда продажи одноразок перевалили за десять миллиардов долларов, на этот рынок тут же зашли…» — неправда
(одноразки в США ≈ 3 млрд $ в год, Circana/IRI; Vuse Go — 2022, NJOY куплен Altria в 2023). Тот же голос (Макс, eleven_v4,
stab .4, style .25) уже сказал верную фразу в дубле другой сессии (voice/v180/v180-ru, S['v180'] s7):
«И когда одноразки стали приносить миллиарды долларов в год, на этот рынок зашли и сами старые табачные корпорации.»
Вырезаю её из out/v180-ru и вставляю вместо своей в out/v18-ru (режу в паузах, громкость — как у соседних фраз), сдвигаю время слов.
Порядок: el13.py build v18-ru и v180-ru (из voice/, без трат) → python3 v18_fix.py → python3 v18_voice.py."""
import json, os, shutil
import numpy as np, soundfile as sf
from v164_voice import quiet, speech_rms, fade
HERE = os.path.dirname(os.path.abspath(__file__)); SR = 44100
OUT = lambda ep: os.path.join(HERE, 'out', ep)


def load(ep):
    y, sr = sf.read(os.path.join(OUT(ep), 'voice.wav'), dtype='float32'); assert sr == SR
    return y, json.load(open(os.path.join(OUT(ep), 'timeline.json')))


def find(S, word):
    for i, s in enumerate(S):
        if any(word in w['d'].lower() for w in s['words']): return i
    raise SystemExit('нет фразы со словом ' + word)


def cut(y, S, i):   # границы фразы i по самым тихим местам в паузах до и после неё
    a, _ = quiet(y, S[i - 1]['words'][-1]['b'] - .05, S[i]['words'][0]['a'] + .01)
    b, _ = quiet(y, S[i]['words'][-1]['b'] - .02, S[i + 1]['words'][0]['a'] + .01) if i + 1 < len(S) else (min(len(y) / SR, S[i]['words'][-1]['b'] + .3), 0)
    return a, b


def main():
    vw, tl = os.path.join(OUT('v18-ru'), 'voice.wav'), os.path.join(OUT('v18-ru'), 'timeline.json')
    for f in (vw, tl):   # исходник беречь: повторный запуск берёт его, а не уже исправленный
        o = f.replace('.wav', '.orig.wav').replace('.json', '.orig.json')
        if not os.path.exists(o): shutil.copy(f, o)
    y, sr = sf.read(vw.replace('.wav', '.orig.wav'), dtype='float32'); T = json.load(open(tl.replace('.json', '.orig.json'))); S = T['sent']
    x, U = load('v180-ru'); X = U['sent']
    i, j = find(S, 'перевалили'), find(X, 'приносить')
    a0, a1 = cut(y, S, i); b0, b1 = cut(x, X, j)
    seg = x[int(b0 * SR):int(b1 * SR)].copy()
    seg *= speech_rms(y[int(a0 * SR):int(a1 * SR)]) / speech_rms(seg)   # громкость как у моей фразы
    out = np.concatenate([fade(y[:int(a0 * SR)]), fade(seg), fade(y[int(a1 * SR):])])
    d_in, d_after = a0 - b0, (b1 - b0) - (a1 - a0)
    new = dict(X[j], scene=S[i]['scene']); new['words'] = [dict(w, a=round(w['a'] + d_in, 3), b=round(w['b'] + d_in, 3)) for w in X[j]['words']]
    new['a'], new['b'] = round(new['words'][0]['a'] - .03, 3), round(new['words'][-1]['b'] + .05, 3)
    for k in ('v',):
        if k in S[i]: new[k] = S[i][k]
        else: new.pop(k, None)
    S2 = S[:i] + [new] + [dict(s, a=round(s['a'] + d_after, 3), b=round(s['b'] + d_after, 3), words=[dict(w, a=round(w['a'] + d_after, 3), b=round(w['b'] + d_after, 3)) for w in s['words']]) for s in S[i + 1:]]
    for n, s in enumerate(S2): s['i'] = n
    T2 = dict(T, sent=S2, dur=round(T['dur'] + d_after, 4))
    for k in ('b0', 'endT', 'dragE'):
        if T.get(k): T2[k] = round(T[k] + d_after, 3)
    sf.write(vw, out, SR); json.dump(T2, open(tl, 'w'), ensure_ascii=False, indent=1)
    print(f'моя фраза {a0:.2f}–{a1:.2f} → вставка {b1 - b0:.2f} с из v180 ({b0:.2f}–{b1:.2f}); всё после сдвинуто на {d_after:+.2f} с')
    print('было:', ' '.join(w['d'] for w in S[i]['words'])); print('стало:', ' '.join(w['d'] for w in new['words']))


if __name__ == '__main__':
    main()
