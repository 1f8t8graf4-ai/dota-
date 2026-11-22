#!/usr/bin/env python3
"""v22.6 (22.11): глава 4, строка s14 «А обещание бросить?» → «Ну а как же обещание бросить?» (voice/v226, Макс, 18 кредитов;
Андрей: «должно звучать с вопросом, типа «ну а как же…»», «сделай ту фразу»). После вопроса — пауза PAUSE (было 0,04 с — строка
сливалась с «В двадцать четвёртом…» в одно предложение). Голос до строки и после неё — прежний байт в байт; всё после строки сдвигается.
Прежние голос и таймлайн — out/<ролик>/voice.v225.wav, timeline.v225.json (повторный запуск берёт их).
  python3 v226_voice.py      (нужен out/v226-ru: el13.py build v226-ru — без трат, из voice/v226)"""
import json, math, os, shutil
import numpy as np, soundfile as sf
from v164_voice import DENSE, ff, quiet, speech_rms
from v225_voice import onset, noise, xjoin, db
HERE = os.path.dirname(os.path.abspath(__file__)); SR = 44100
OUT = lambda ep: os.path.join(HERE, 'out', ep)
PAUSE = .38       # от конца «бросить?» до «В двадцать…»
NOLD = 3          # слов прежнего начала строки: «А обещание бросить?»


def load(ep):
    o = OUT(ep); v0, t0 = os.path.join(o, 'voice.v225.wav'), os.path.join(o, 'timeline.v225.json')
    if not os.path.exists(v0): shutil.copy(os.path.join(o, 'voice.wav'), v0); shutil.copy(os.path.join(o, 'timeline.json'), t0)
    y, sr = sf.read(v0, dtype='float32'); assert sr == SR
    return (y if y.ndim == 1 else y.mean(1)), json.load(open(t0))


def save(ep, y, T):
    o = OUT(ep); sf.write(os.path.join(o, 'voice.wav'), y, SR)
    hop = SR // 30; env = [float(np.sqrt(np.mean(y[k:k + hop] ** 2))) for k in range(0, len(y), hop)]; mx = max(env) or 1
    T['env'] = [round(min(1, e / mx * 1.8), 3) for e in env]
    json.dump(T, open(os.path.join(o, 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
    shutil.copy(os.path.join(o, 'timeline.json'), os.path.join(HERE, 'tl', ep + '.json'))


def sh(w, d): return dict(w, a=round(w['a'] + d, 3), b=round(w['b'] + d, 3))


def main():
    X, _ = sf.read(os.path.join(OUT('v226-ru'), 'voice.wav'), dtype='float32'); TX = json.load(open(os.path.join(OUT('v226-ru'), 'timeline.json')))
    NW = TX['sent'][0]['words']; Xw = ff(X, DENSE)
    n0 = onset(X, NW[0]['a'] - .3, NW[0]['a'] + .1); n1 = min(len(X) / SR - 1.2 - .01, NW[-1]['b'] + .2)
    print(f'новый дубль: {n0:.3f}–{n1:.3f}')
    for ep in ('v210y-ru', 'v210s-ru'):
        y, T = load(ep); S = T['sent']; k = next(i for i, s in enumerate(S) if s['scene'] == 's14'); s = S[k]; W = s['words']
        assert [w['d'] for w in W[:NOLD]] == ['А', 'обещание', 'бросить?'], [w['d'] for w in W[:NOLD]]
        pb = S[k - 1]['words'][-1]['b']; q0, _ = quiet(y, pb - .35, W[0]['a'] + .02)   # тишина между «…Америки.» и «А» (время слов в таймлайне примерное)
        o0 = onset(y, q0, W[0]['a'] + .2); tc = o0 - .06
        qt, lq = quiet(y, W[NOLD - 1]['b'] - .02, W[NOLD]['a'] + .02)   # разрез перед «В» — в самом тихом месте
        g = speech_rms(y[int(W[0]['a'] * SR):int(W[NOLD - 1]['b'] * SR)]) / speech_rms(Xw[int(NW[0]['a'] * SR):int(NW[-1]['b'] * SR)])
        seg = Xw[int((n0 - .06) * SR):int(n1 * SR)] * g; f = int(.03 * SR); seg[-f:] *= np.linspace(1, 0, f)
        d1 = tc - (n0 - .06); nw = [sh(w, d1) for w in NW]
        t_next = nw[-1]['b'] + PAUSE - (W[NOLD]['a'] - qt)   # где начнётся прежний кусок с «В двадцать…»
        room = y[int((q0 - .05) * SR):int((q0 + .05) * SR)]   # шум записи — из тишины перед строкой (без хвостов слов)
        v = xjoin(y[:int(tc * SR)], seg.astype(np.float32)); v = np.concatenate([v, noise(room, max(0, int(t_next * SR) - len(v)))])[:int(t_next * SR)]
        v = xjoin(v, y[int(qt * SR):])
        d2 = t_next - qt
        s2 = dict(s, words=nw + [sh(w, d2) for w in W[NOLD:]], text='Ну а как же обещание бросить?' + s['text'][len('А обещание бросить?'):])
        s2['a'] = round(s2['words'][0]['a'] - .03, 3); s2['b'] = round(s['b'] + d2, 3)
        S2 = S[:k] + [s2] + [dict(x, a=round(x['a'] + d2, 3), b=round(x['b'] + d2, 3), words=[sh(w, d2) for w in x['words']]) for x in S[k + 1:]]
        T2 = dict(T, sent=S2, v226=1)
        for key in ('dur', 'vEnd', 'b0', 'endT'):
            if key in T: T2[key] = round(T[key] + d2, 4)
        N = int(round(T2['dur'] * SR)); v = np.concatenate([v, np.zeros(max(0, N - len(v)), np.float32)])[:N]
        save(ep, v, T2)
        print(f"{ep}: разрез {qt:.3f} ({lq:.0f} дБ), «Ну» {W[0]['a']:.3f} → {nw[0]['a']:.3f}, «бросить?» {W[NOLD-1]['b']:.3f} → {nw[-1]['b']:.3f}, "
              f"«В» {W[NOLD]['a']:.3f} → {W[NOLD]['a'] + d2:.3f}, сдвиг {d2:+.3f}, длина {T['dur']} → {T2['dur']}, громкость ×{g:.2f}")


if __name__ == '__main__':
    main()
