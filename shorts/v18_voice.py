#!/usr/bin/env python3
"""v18 (15.11, ночь): голос выпуска 2 «2020 · Лазейка одноразок» из одного оплаченного дубля (voice/v18/v18-ru.mp3, 851 кредит)
→ две дорожки: v18a (шортс: тело s1–s8 + концовка endA «…спросите себя…» → петля в кадр 0) и v18b (мостик: тело + endB «…для леди» → зум
в сигарету 3-й главы). Обработка — как у выпуска 1 (v164_voice.DENSE), режем только в паузах (quiet), края плавные.
Время в timeline.json: b0 — начало концовки, endT — последний кадр (у шортса = кадр 0 петли).
python3 v18_voice.py   (нужен out/v18-ru/voice.wav + timeline.json: el13.py build v18-ru — без новых трат, из voice/v18)"""
import json, math, os, shutil
import numpy as np, soundfile as sf
from v164_voice import DENSE, ff, fade, quiet, speech_rms
HERE = os.path.dirname(os.path.abspath(__file__)); SR = 44100; FPS = 30
OUT = lambda ep: os.path.join(HERE, 'out', ep)
GAP_A, GAP_B, AFTER_A, AFTER_B = .3, .45, .62, 1.45


def main():
    y, sr = sf.read(os.path.join(OUT('v18-ru'), 'voice.wav'), dtype='float32'); assert sr == SR
    T = json.load(open(os.path.join(OUT('v18-ru'), 'timeline.json'))); S = T['sent']
    wet = ff(y, DENSE)
    keys = [s['scene'] for s in S]; iA, iB = keys.index('endA'), keys.index('endB')
    cut_body, l1 = quiet(y, S[iA - 1]['words'][-1]['b'] - .45, S[iA]['words'][0]['a'] + .01)
    cut_ab, l2 = quiet(y, S[iB - 1]['words'][-1]['b'] - .45, S[iB]['words'][0]['a'] + .01)
    print(f'разрез тело|A {cut_body:.3f} ({l1:.1f} дБ), A|B {cut_ab:.3f} ({l2:.1f} дБ)')
    end_B = S[-1]['words'][-1]['b'] + .3
    for ep, seg, gap, after in (('v18a-ru', (cut_body, cut_ab), GAP_A, AFTER_A), ('v18b-ru', (cut_ab, min(end_B, len(y) / SR)), GAP_B, AFTER_B)):
        body = fade(wet[:int(cut_body * SR)]); z = np.zeros(int(gap * SR), np.float32); tail = fade(wet[int(seg[0] * SR):int(seg[1] * SR)])
        sh = cut_body + gap - seg[0]   # сдвиг времени концовки
        sent = []
        for s in S:
            if s['scene'] in ('endA', 'endB') and not (seg[0] <= s['words'][0]['a'] < seg[1]): continue
            d = sh if s['scene'] in ('endA', 'endB') else 0
            W = [dict(w, a=round(w['a'] + d, 3), b=round(w['b'] + d, 3)) for w in s['words']]
            sent.append(dict(s, words=W, a=round(W[0]['a'] - .03, 3), b=round(W[-1]['b'] + .05, 3), **({'v': 'end'} if d else {})))
        for i, s in enumerate(sent): s['i'] = i
        b0 = sent[[s.get('v') for s in sent].index('end')]['words'][0]['a']
        endT = round(sent[-1]['words'][-1]['b'] + after, 3)
        dur = round((math.ceil(endT * FPS - 1e-6) + 1) / FPS, 4)
        v = np.concatenate([body, z, tail]); N = int(round(dur * SR)); v = np.concatenate([v, np.zeros(max(0, N - len(v)), np.float32)])[:N]
        v = v / (np.max(np.abs(v)) or 1) * .9
        os.makedirs(OUT(ep), exist_ok=True); sf.write(os.path.join(OUT(ep), 'voice.wav'), v, SR)
        hop = SR // FPS; env = [float(np.sqrt(np.mean(v[k:k + hop] ** 2))) for k in range(0, len(v), hop)]; mx = max(env) or 1
        tl = dict(T, ep=ep, dur=dur, sent=sent, b0=round(b0, 3), endT=endT, env=[round(min(1, e / mx * 1.8), 3) for e in env])
        json.dump(tl, open(os.path.join(OUT(ep), 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
        shutil.copy(os.path.join(OUT(ep), 'timeline.json'), os.path.join(HERE, 'tl', ep + '.json'))
        print(ep, 'длина', dur, 'с; концовка с', round(b0, 2), '; последний кадр', endT, '; речь', round(20 * math.log10(speech_rms(v)), 1), 'дБ')


if __name__ == '__main__':
    main()
