#!/usr/bin/env python3
"""v18 (15.11, ночь): голос выпуска 1 + доозвучка (voice/v18/v18x-ru.mp3, 91 кредит, тот же Макс):
  фраза «Бумажная сигарета ушла в прошлое…» — сразу после «Старый план сработал идеально.» (всё дальше сдвигается);
  v170a — шортс (доска, «Захотите бросить…», «Так… о чём это я? А, точно!», петля через ноутбук);
  v170e — мостик в выпуск 2 (после «затянуться?» доска и «Но «Джул» — только первая карточка… холоднее», зум в карточку 2020).
Берёт out/v170a-ru/voice.wav + tl/v170a-ru.0.json (голос v16.4 до вставки) и out/v18x-ru (el13.py build v18x-ru).
python3 v18_ep1_voice.py"""
import json, math, os, shutil
import numpy as np, soundfile as sf
from v164_voice import DENSE, ff, fade, quiet, speech_rms
HERE = os.path.dirname(os.path.abspath(__file__)); SR = 44100; FPS = 30
OUT = lambda ep: os.path.join(HERE, 'out', ep)
G1, G2, GB, AFTER_B = .3, .45, .75, 1.5


def main():
    src = os.path.join(OUT('v170a-ru'), 'voice.v164.wav')
    if not os.path.exists(src): shutil.copy(os.path.join(OUT('v170a-ru'), 'voice.wav'), src)
    T0f = os.path.join(HERE, 'tl', 'v170a-ru.0.json')
    if not os.path.exists(T0f): shutil.copy(os.path.join(HERE, 'tl', 'v170a-ru.json'), T0f)
    A, sr = sf.read(src, dtype='float32'); assert sr == SR
    TA = json.load(open(T0f)); S = TA['sent']
    X, _ = sf.read(os.path.join(OUT('v18x-ru'), 'voice.wav'), dtype='float32'); TX = json.load(open(os.path.join(OUT('v18x-ru'), 'timeline.json')))
    Xw = ff(X, DENSE); Xw *= speech_rms(A) / speech_rms(Xw)
    cx, lx = quiet(X, TX['sent'][0]['words'][-1]['b'] - .45, TX['sent'][1]['words'][0]['a'] + .02)
    p1a = max(0, TX['sent'][0]['words'][0]['a'] - .25); p2a = cx; p2b = min(len(X) / SR, TX['sent'][1]['words'][-1]['b'] + .35)
    i13 = [s['text'] for s in S].index('Старый план сработал идеально.')
    cut, lc = quiet(A, S[i13]['words'][-1]['b'] - .4, S[i13 + 1]['words'][0]['a'] + .02)
    print(f'вставка после «идеально»: {cut:.3f} с ({lc:.1f} дБ); разрез доозвучки {cx:.3f} ({lx:.1f} дБ)')
    P1 = fade(Xw[int(p1a * SR):int(cx * SR)]); P2 = fade(Xw[int(p2a * SR):int(p2b * SR)])
    z = lambda s: np.zeros(int(round(s * SR)), np.float32)
    d1 = G1 - p1a                                        # время в дубле доозвучки → в ролике: + cut + d1
    ins = np.concatenate([z(G1), P1, z(G2)]); D = len(ins) / SR
    mv = lambda w, d: dict(w, a=round(w['a'] + d, 3), b=round(w['b'] + d, 3))
    snt = lambda s, W, **o: dict(s, words=W, a=round(W[0]['a'] - .03, 3), b=round(W[-1]['b'] + .05, 3), **o)
    s_p1 = snt(TX['sent'][0], [mv(w, cut + d1) for w in TX['sent'][0]['words']], scene='s8')
    for ep in ('v170a-ru', 'v170e-ru'):
        if ep == 'v170a-ru':
            y = np.concatenate([A[:int(cut * SR)], ins, A[int(cut * SR):]])
            sent = [s for s in S[:i13 + 1]] + [s_p1] + [snt(s, [mv(w, D) for w in s['words']]) for s in S[i13 + 1:]]
            extra = {k: round(TA[k] + D, 3) for k in ('dragE', 'b0', 'endT')}
        else:
            i14 = i13 + 1; wz = S[i14]['words'][-1]
            ce, le = quiet(A, TA['b0'] - .5, TA['b0'] - .05)   # хвост эха демона уже затих
            print(f'мостик: конец основного голоса {ce:.3f} ({le:.1f} дБ)')
            y = np.concatenate([A[:int(cut * SR)], ins, A[int(cut * SR):int(ce * SR)], z(GB), P2])
            dB = cut + D + (ce - cut) + GB - p2a
            s_p2 = snt(TX['sent'][1], [mv(w, dB) for w in TX['sent'][1]['words']], scene='bridge', v='end')
            sent = [s for s in S[:i13 + 1]] + [s_p1] + [snt(s, [mv(w, D) for w in s['words']]) for s in S[i13 + 1:i14 + 1]] + [s_p2]
            extra = {'dragE': round(TA['dragE'] + D, 3), 'b0': round(ce + D + .2, 3), 'endT': round(s_p2['words'][-1]['b'] + AFTER_B, 3)}
        for i, s in enumerate(sent): s['i'] = i
        dur = round((math.ceil(extra['endT'] * FPS - 1e-6) + 1) / FPS, 4)
        N = int(round(dur * SR)); y = np.concatenate([y, np.zeros(max(0, N - len(y)), np.float32)])[:N]
        os.makedirs(OUT(ep), exist_ok=True); sf.write(os.path.join(OUT(ep), 'voice.wav'), y, SR)
        hop = SR // FPS; env = [float(np.sqrt(np.mean(y[k:k + hop] ** 2))) for k in range(0, len(y), hop)]; mx = max(env) or 1
        tl = dict(TA, ep=ep, dur=dur, sent=sent, **extra, env=[round(min(1, e / mx * 1.8), 3) for e in env])
        json.dump(tl, open(os.path.join(OUT(ep), 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
        shutil.copy(os.path.join(OUT(ep), 'timeline.json'), os.path.join(HERE, 'tl', ep + '.json'))
        print(ep, 'длина', dur, extra, 'вставка', round(D, 2), 'с')


if __name__ == '__main__':
    main()
