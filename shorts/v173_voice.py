#!/usr/bin/env python3
"""v17.3 (15.11, «го» Андрея на озвучку): голос 1-й и 2-й части из оплаченных дублей ElevenLabs (voice/v180, README там же).
  1-я часть: голос v17.0 (out/v170a-ru/voice.wav) + фраза «Бумажная сигарета ушла в прошлое…» после «идеально» (v172p, строка 0).
    v173s-ru — шортс (дальше как было: «Признайтесь…», доска, «Так… о чём это я?»);
    v173y-ru — YouTube-мостик: после «затянуться?» вместо концовки шортса — «Но «Джул» — только первая карточка…» (v172p, строка 1).
  2-я часть: v180 (весь текст) + концовка: v180s-ru — шортс (v180a, петля в «Почему ваша одноразка…»), v180y-ru — мостик (v180b).
  Режем только в паузах (самая тихая точка), края 12 мс, вставки — та же обработка DENSE и та же громкость речи, что у основного дубля.
python3 v173_voice.py → out/<ролик>/{voice.wav, timeline.json}"""
import json, os, copy
import numpy as np, soundfile as sf
from v164_voice import SR, OUT, ff, DENSE, speech_rms, fade, quiet, nw

def load(ep, f='voice.wav'):
    y, sr = sf.read(os.path.join(OUT(ep), f), dtype='float32'); assert sr == SR
    if y.ndim > 1: y = y.mean(1)
    return y, json.load(open(os.path.join(OUT(ep), 'timeline.json')))

def words(T): return [w for s in T['sent'] for w in s['words']]

def piece(y, T, si, pre=.12, post=.2):
    s = T['sent'][si]; a = max(0, s['words'][0]['a'] - pre); b = s['words'][-1]['b'] + post
    return fade(y[int(a * SR):int(b * SR)]), s, a

def shift_sent(s, d, scene=None):
    s = copy.deepcopy(s)
    for w in s['words']: w['a'] = round(w['a'] + d, 3); w['b'] = round(w['b'] + d, 3)
    s['a'] = round(s['a'] + d, 3); s['b'] = round(s['b'] + d, 3)
    if scene: s['scene'] = scene
    return s

def env(y):
    hop = SR // 30; e = [float(np.sqrt(np.mean(y[k:k + hop] ** 2))) for k in range(0, len(y), hop)]; mx = max(e) or 1
    return [round(min(1, x / mx * 1.8), 3) for x in e]

def save(ep, y, T):
    os.makedirs(OUT(ep), exist_ok=True); sf.write(os.path.join(OUT(ep), 'voice.wav'), y.astype(np.float32), SR)
    T = dict(T, ep=ep, dur=round(len(y) / SR, 3), env=env(y)); json.dump(T, open(os.path.join(OUT(ep), 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
    print(ep, 'длина', T['dur'], 'с; b0', T.get('b0'), 'endT', T.get('endT'))

def sil(t): return np.zeros(int(t * SR), np.float32)

def ep1():
    A, TA = load('v170a-ru'); P, TP = load('v172p-ru'); P2 = ff(P, DENSE); P2 *= speech_rms(A) / speech_rms(P2)
    W = words(TA); i = next(k for k, w in enumerate(W) if nw(w['d']) == 'идеально')
    c, lv = quiet(A, W[i]['b'] - .02, W[i + 1]['a'] + .01); print('разрез после «идеально»', round(c, 3), 'с,', round(lv, 1), 'дБ')
    p1, s1, a1 = piece(P2, TP, 0)
    pre, post = max(0, .5 - (c - W[i]['b'])), .45                                        # пауза до фразы ~0,5 с, после ~0,45 с
    ins = np.concatenate([sil(pre), p1, sil(post)]); D = len(ins) / SR; k = int(c * SR)
    y = np.concatenate([A[:k], ins, A[k:]])
    si = next(n for n, s in enumerate(TA['sent']) if any(nw(w['d']) == 'идеально' for w in s['words']))
    T = copy.deepcopy(TA); new = shift_sent(s1, c + pre - a1, 'plan')
    T['sent'] = TA['sent'][:si + 1] + [new] + [shift_sent(s, D) for s in TA['sent'][si + 1:]]
    for n, s in enumerate(T['sent']): s['i'] = n
    for key in ('dragE', 'b0', 'endT'): T[key] = round(TA[key] + D, 3)
    save('v173s-ru', y, T)
    # мостик: всё до «затянуться?» (с хвостом демона) + пауза + фраза мостика
    dE = T['dragE']; Ws = words(T); j = next(n for n, w in enumerate(Ws) if w['a'] > dE + .2)   # первое слово концовки шортса («Захотите»)
    c2, _ = quiet(y, dE + .35, Ws[j]['a'] - .02); y2 = y[:int(c2 * SR)].copy(); y2[-int(.03 * SR):] *= np.linspace(1, 0, int(.03 * SR))
    p2, s2, a2 = piece(P2, TP, 1); start = dE + 1.47                                         # как «Захотите» у шортса
    y2 = np.concatenate([y2, sil(max(0, start - .12 - len(y2) / SR)), p2])
    T2 = copy.deepcopy(T); keep = [s for s in T['sent'] if s['words'][0]['a'] < dE + .2]
    nb = shift_sent(s2, start - .12 - a2, 'bridge'); T2['sent'] = keep + [nb]
    for n, s in enumerate(T2['sent']): s['i'] = n
    T2['endT'] = round(nb['words'][-1]['b'] + 2.4, 3); y2 = np.concatenate([y2, sil(T2['endT'] + .1 - len(y2) / SR)])
    save('v173y-ru', y2, T2)

def ep2():
    M, TM = load('v180-ru'); M2 = ff(M, DENSE); r = speech_rms(M2)
    for ep, src, gap, tailT in (('v180s-ru', 'v180a-ru', .75, .55), ('v180y-ru', 'v180b-ru', .75, 2.6)):
        E, TE = load(src); E2 = ff(E, DENSE); E2 *= r / speech_rms(E2)
        e8 = TM['sent'][-1]['words'][-1]['b']; y = M2[:int((e8 + .25) * SR)].copy(); y[-int(.03 * SR):] *= np.linspace(1, 0, int(.03 * SR))
        T = copy.deepcopy(TM); b0 = e8 + .35                                                  # доска (отъезд от общежития) — сразу после «пробирки»
        start = e8 + gap + .9; e0 = TE['sent'][0]['words'][0]['a']
        seg = E2[int(max(0, e0 - .12) * SR):]; y = np.concatenate([y, sil(start - .12 - len(y) / SR), fade(seg)])
        T['sent'] = TM['sent'] + [shift_sent(s, start - e0, s['scene']) for s in TE['sent']]
        for n, s in enumerate(T['sent']): s['i'] = n
        last = T['sent'][-1]['words'][-1]['b']; T['b0'] = round(b0, 3); T['endT'] = round(last + tailT, 3); T['e8'] = round(e8, 3)
        y = np.concatenate([y, sil(max(0, T['endT'] + .1 - len(y) / SR))])[:int((T['endT'] + .1) * SR)]
        save(ep, y, T)

if __name__ == '__main__':
    ep1(); ep2()
