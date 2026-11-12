#!/usr/bin/env python3
"""v16.2 (11.11): концовки и склейки — без новых трат (голос — та же старая запись v14.5).
  a — концовка A (доска, под YouTube): реплика [14] «А вот как создатели «Мальборо»… Ссылка в профиле» (как v161_end_voice.py),
      после голоса 2,0 с (ep/v162.js: keysEnd → endA) — кончается на «Ссылка в профиле»
  b — хвост B (петля в TikTok): голоса нет — субтитры «Так… о чём это я?» / «А, точно!» (озвучим вместе со всем роликом),
      вжух — и начало ролика; длина — целое число кадров (ep/v162.js: keysTail), последний кадр хвоста — за кадр до первого кадра ролика
  t — склейка «ролик + хвост B» для звука (картинка — два готовых видео встык): голос ролика + тишина, таймлайн ролика длиннее
      на хвост, звуки ролика + звуки хвоста со сдвигом
python3 v162_tail.py a|b|t"""
import json, math, os, shutil, sys
import numpy as np, soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__)); FPS = 30
WHIP = (2200 - 600) / 4500                                  # как SLD/SLV в ep/v162.js
TAIL_END = round((.3 + 1.45 + .75 + WHIP) * FPS) / FPS      # keysTail: q1 = .3, q2 = q1 + 1,45, вжух — до конца
TAIL_N = round(TAIL_END * FPS)                              # кадров в хвосте
OUT = lambda ep: os.path.join(HERE, 'out', ep)


def a():
    import v161_end_voice as ev
    ev.AFTER = 2.0
    ev.main(['v162a-ru'])


def b():
    os.makedirs(OUT('v162b-ru'), exist_ok=True)
    dur = round(TAIL_END - .001, 4)
    T = dict(ep='v162b-ru', lang='ru', dur=dur, fps=FPS, sent=[dict(scene='tail', a=0, b=0, text='', words=[])], env=[0.] * TAIL_N)
    json.dump(T, open(os.path.join(OUT('v162b-ru'), 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
    print('v162b-ru: хвост', TAIL_N, 'кадров,', dur, 'с')


def t():
    M = json.load(open(os.path.join(OUT('v162-ru'), 'timeline.json')))
    n0 = math.ceil(M['dur'] * FPS); T0 = n0 / FPS; dur = round(T0 + TAIL_N / FPS, 4)   # видео ролика — n0 кадров, хвост — сразу за ним
    o = OUT('v162t-ru'); os.makedirs(o, exist_ok=True)
    T = dict(M, ep='v162t-ru', dur=dur, tail0=T0); T['env'] = list(M['env']) + [0.] * (int(round(dur * FPS)) - len(M['env']))
    json.dump(T, open(os.path.join(o, 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
    for f in ('voice.wav', 'voice.dry.wav'):
        y, sr = sf.read(os.path.join(OUT('v162-ru'), f), dtype='float32')
        z = np.zeros((int(round(dur * sr)),) + y.shape[1:], np.float32); z[:min(len(y), len(z))] = y[:len(z)]
        sf.write(os.path.join(o, f), z, sr)
    C = [q for q in json.load(open(os.path.join(OUT('v162-ru'), 'cues.json'))) if q[0] < M['dur']]
    C += [[round(q[0] + T0, 3)] + q[1:] for q in json.load(open(os.path.join(OUT('v162b-ru'), 'cues.json')))]
    json.dump(sorted(C), open(os.path.join(o, 'cues.json'), 'w'))
    print(f'v162t-ru: ролик {n0} кадров ({T0:.3f} с) + хвост {TAIL_N} кадров = {dur} с, звуков {len(C)}')


if __name__ == '__main__':
    {'a': a, 'b': b, 't': t}[sys.argv[1]]()
