#!/usr/bin/env python3
"""v23.6 (23.11): русский шортс главы 1 (`v170a-ru`) заново — его делали 16.11 в другой сессии, в контейнере ролика не было
(Андрей: «пересобирай»). Без трат: голос уже записан.
  тело — голос главы 1 фильма (`out/v170e-ru/voice.wav` = stems/v170e-ru/voice.flac, правки v19.2: «Бумажная сигарета…» выровнена,
         паузы без цифрового нуля) до конца эха демона после «затянуться?»;
  концовка — дубль v164e (voice/v164/v164e-ru.*, «Захотите бросить…» и «Так… о чём это я? А, точно!») на тех же местах, что в шортсе
         16.11 (tl/v170a-ru.json — в нём всё после «Бумажной сигареты» на 0,67 с позже: до правки v19.2), обработка — как в v164_voice.py;
  паузы — шум самой записи.
Сначала: out/v164e-ru из voice/v164 (`el13.py build v164e-ru`). Потом картинка и звук — как у EN/DE (кусками, подложка «Льда», loopfix).
python3 v236_ch1_short.py   → out/v170a-ru/{voice.wav, timeline.json}, tl/v170a-ru.json"""
import json, math, os, shutil
import numpy as np, soundfile as sf
from v164_voice import DENSE, ff, fade, quiet, speech_rms
from v225_voice import onset, noise, xjoin
HERE = os.path.dirname(os.path.abspath(__file__)); SR = 44100; FPS = 30; B0 = .62
OUT = lambda ep: os.path.join(HERE, 'out', ep)


def main():
    y, sr = sf.read(os.path.join(OUT('v170e-ru'), 'voice.wav'), dtype='float32'); assert sr == SR
    Te = json.load(open(os.path.join(OUT('v170e-ru'), 'timeline.json')))
    old = json.load(open(os.path.join(HERE, 'tl', 'v170a-ru.json')))
    if old.get('v236'): old = json.load(open(os.path.join(HERE, 'tl', 'v170a-ru.v18.json')))
    else: shutil.copy(os.path.join(HERE, 'tl', 'v170a-ru.json'), os.path.join(HERE, 'tl', 'v170a-ru.v18.json'))   # шортс 16.11 — для сверки
    E, sr = sf.read(os.path.join(OUT('v164e-ru'), 'voice.wav'), dtype='float32'); assert sr == SR
    TE = json.load(open(os.path.join(OUT('v164e-ru'), 'timeline.json')))
    S = Te['sent']; kz = next(i for i, s in enumerate(S) if s['words'][-1]['d'].lower().startswith('затянуться')); wz = S[kz]['words'][-1]
    dragE = Te['dragE']; assert abs(dragE - wz['b']) < .01, (dragE, wz['b'])
    shift = round(old['dragE'] - dragE, 3); print(f'«затянуться?» кончается {dragE:.3f} с (в шортсе 16.11 — {old["dragE"]:.3f}, сдвиг {shift} с)')
    br = S[kz + 1]['words'][0]['a']                                         # мостик фильма «Но «Джул»…» — его в шортсе нет
    tc = onset(y, br - .45, br + .2) - .05; room = y[int((tc - .12) * SR):int((tc - .02) * SR)]
    print(f'тело — до {tc:.3f} с (мостик с {br:.3f}), шум записи {20 * math.log10(float(np.sqrt(np.mean(room ** 2))) + 1e-12):.0f} дБ')

    E2 = ff(E, DENSE); E2 *= speech_rms(y[:int(dragE * SR)]) / speech_rms(E2)
    OB, OT = old['sent'][-2], old['sent'][-1]; WB, WT = TE['sent'][0]['words'], TE['sent'][1]['words']
    assert [w['d'] for w in OB['words']] == [w['d'] for w in WB] and [w['d'] for w in OT['words']] == [w['d'] for w in WT]
    dB = OB['words'][0]['a'] - shift - WB[0]['a']; dT = OT['words'][0]['a'] - shift - WT[0]['a']   # время в дубле → в ролике
    e_a = max(0., WB[0]['a'] - .14); ct, lct = quiet(E, WB[-1]['b'] - .1, WT[0]['a'] + .02); t_e = WT[-1]['b'] + .3
    print(f'концовка: «Захотите» {WB[0]["a"] + dB:.3f} с, «Так» {WT[0]["a"] + dT:.3f} с, разрез в дубле {ct:.3f} ({lct:.0f} дБ)')

    v = y[:int(tc * SR)].copy()
    for a, b, d in ((e_a, ct, dB), (ct, t_e, dT)):
        t0 = a + d; v = np.concatenate([v, noise(room, max(0, int(round(t0 * SR)) - len(v)))])
        seg = fade(E2[int(a * SR):int(b * SR)]); v = xjoin(v, (seg + noise(room, len(seg)) * .7).astype(np.float32))

    endT = round(old['endT'] - shift, 3); dur = round((math.ceil(endT * FPS - 1e-6) + 1) / FPS, 4); N = int(round(dur * SR))
    v = np.concatenate([v, noise(room, max(0, N - len(v)))])[:N].astype(np.float32)
    sh = lambda w, d: dict(w, a=round(w['a'] + d, 3), b=round(w['b'] + d, 3))
    sent = [dict(s) for s in S[:kz + 1]]
    for s, d in ((OB, -shift), (OT, -shift)):
        sent.append(dict(s, a=round(s['a'] + d, 3), b=round(s['b'] + d, 3), words=[sh(w, d) for w in s['words']]))
    for i, s in enumerate(sent): s['i'] = i
    hop = SR // FPS; env = [float(np.sqrt(np.mean(v[k:k + hop] ** 2))) for k in range(0, len(v), hop)]; mx = max(env) or 1
    T = {k: Te[k] for k in ('lang', 'fps', 'voice', 'natural')}
    T.update(ep='v170a-ru', dur=dur, sent=sent, env=[round(min(1, e / mx * 1.8), 3) for e in env], dragE=dragE, b0=round(dragE + B0, 3), endT=endT, v236=1)
    os.makedirs(OUT('v170a-ru'), exist_ok=True); sf.write(os.path.join(OUT('v170a-ru'), 'voice.wav'), v, SR)
    json.dump(T, open(os.path.join(OUT('v170a-ru'), 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
    shutil.copy(os.path.join(OUT('v170a-ru'), 'timeline.json'), os.path.join(HERE, 'tl', 'v170a-ru.json'))
    print(f'длина {dur} с ({int(round(dur * FPS))} кадров), доска {T["b0"]}, конец {endT}; пик {np.abs(v).max():.2f}')
    for s in sent[-4:]: print(f'  {s["i"]:02d} {s["scene"]:6s} {s["a"]:7.2f}–{s["b"]:7.2f} {s["text"][:60]}')


if __name__ == '__main__':
    main()
