#!/usr/bin/env python3
"""v16.1 (11.11): концовка — отдельный файл. Голос — реплика [14] из той же старой записи v14.5 (новых генераций нет):
«А вот как создатели «Мальборо» превратили дамские сигареты в главный наркотик века… Ссылка в профиле».
Начало — в самом тихом месте перед «А» (там же, где кончается основной ролик, v161_voice.py), спереди 0,6 с тишины —
доска въезжает. Дальше без голоса: «Так… о чём это я?» и «А, точно!» — пока субтитрами (озвучим вместе со всем роликом,
когда Андрей одобрит картинку), вжух — и первый кадр ролика. Время этих строк считает ep/v161.js (keysEnd) от конца голоса.
python3 v161_end_voice.py [ep=v161e1-ru …]  → out/<ep>/voice.wav, voice.dry.wav, timeline.json"""
import json, os, re, shutil, sys
import numpy as np, soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__)); SR = 44100; FPS = 30
SRC = os.path.join(HERE, 'out', 'v145m-ru')
LEAD = .6                         # тишина до голоса — доска въезжает
AFTER = .45 + 1.45 + .75 + .42 + .93   # от конца голоса: «о чём это я?» → «А, точно!» → вжух → первый кадр (как keysEnd в ep/v161.js)
nw = lambda s: re.sub(r'[«»"“”.,?!…:;]', '', str(s)).lower()


def quiet(y, a, b):
    i0, i1, w = int(a * SR), int(b * SR), int(.02 * SR)
    e = [np.sqrt(np.mean(y[k:k + w] ** 2)) for k in range(i0, i1 - w, int(.005 * SR))]
    return (i0 + int(np.argmin(e)) * int(.005 * SR) + w // 2) / SR


def main(eps):
    T0 = json.load(open(os.path.join(SRC, 'timeline.raw.json'))); y, sr = sf.read(os.path.join(SRC, 'voice.clean.wav'), dtype='float32'); assert sr == SR
    S = T0['sent']; i14 = next(i for i, s in enumerate(S) if s['scene'] == 's9')
    assert nw(S[i14]['words'][0]['d']) == 'а' and nw(S[i14]['words'][-1]['d']) == 'профиле'
    t0 = quiet(y, S[i14 - 1]['words'][-1]['b'] - .25, S[i14]['words'][0]['a'])          # та же точка, где кончается основной ролик
    b = S[i14]['words'][-1]['b']; t1 = quiet(y, b + .05, min(len(y) / SR - .05, b + .5))
    F = int(.015 * SR); seg = y[int(t0 * SR):int(t1 * SR)].copy(); seg[:F] *= np.linspace(0, 1, F); seg[-F:] *= np.linspace(1, 0, F)
    W = [dict(w, a=round(w['a'] - t0 + LEAD, 3), b=round(w['b'] - t0 + LEAD, 3)) for w in S[i14]['words']]
    e = W[-1]['b']; dur = round(e + AFTER, 3)
    z = np.concatenate([np.zeros(int(LEAD * SR), np.float32), seg]); z = np.concatenate([z, np.zeros(max(0, int(dur * SR) - len(z)), np.float32)])
    env = T0['env']; E = [0.] * int(round(LEAD * FPS)) + env[int(t0 * FPS):int(t1 * FPS)]; E += [0.] * max(0, int(round(dur * FPS)) - len(E))
    for ep in eps:
        out = os.path.join(HERE, 'out', ep); os.makedirs(out, exist_ok=True)
        T = dict(T0, ep=ep, dur=dur, env=E, sent=[dict(S[i14], words=W, a=W[0]['a'], b=e, text=' '.join(w['d'] for w in W))])
        sf.write(os.path.join(out, 'voice.dry.wav'), z, SR); shutil.copyfile(os.path.join(out, 'voice.dry.wav'), os.path.join(out, 'voice.wav'))
        json.dump(T, open(os.path.join(out, 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
        print(ep, f'голос {t0:.2f}–{t1:.2f} с исходной записи → {LEAD:.2f}–{e:.2f} с; длина {dur} с')


if __name__ == '__main__':
    a = [x for x in sys.argv[1:] if not x.startswith('-')]
    main(a or ['v161e1-ru', 'v161e2-ru'])
