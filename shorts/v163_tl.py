#!/usr/bin/env python3
"""v16.3 (12.11): таймлайны двух версий из голоса v163_voice.py (out/v163-ru), без новых трат.
  v163-ru  — шортс: ролик + концовка с доской (пар → доска → маркер → штамп → «Так… о чём это я? А, точно!» → вжух в кадр 0).
             Голоса доски ещё нет — строки идут субтитрами (ep/v163.js), время — END от конца «затянуться?»; запишем после «брат это пизда».
  v163f-ru — глава 1 фильма: голос до «идеально», дальше — отъезд на доску и нить ко 2-й карточке (FILM_END от «идеально»).
Правки субтитров (пульт v16.3: «запятые и двоеточия», «режется по запятой»): «Рейнольдс», …Winston, …проблема: …горло, школьники.
python3 v163_tl.py   → out/v163-ru/timeline.json (длина), out/v163f-ru/{timeline.json, voice.wav, voice.dry.wav}"""
import json, math, os, re, shutil
import numpy as np, soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__)); FPS = 30
END_END, FILM_END = 11.2, 4.3            # как END.end и FILM_END в ep/v163.js
OUT = lambda ep: os.path.join(HERE, 'out', ep)
nw = lambda s: re.sub(r'[«»"“”.,?!…:;]', '', str(s)).lower()
PUNCT = [(2, 'рейнольдс', 0, ','), (2, 'winston', 0, ','), (4, 'проблема', 0, ':'), (10, 'горло', 0, ',')]


def fix_punct(T):
    for i, q, n, p in PUNCT:
        W = T['sent'][i]['words']; k = 0
        for w in W:
            if nw(w['d']) == q:
                if k == n:
                    if not w['d'].endswith(p): w['d'] = w['d'] + p
                    break
                k += 1
        T['sent'][i]['text'] = ' '.join(w['d'] for w in W)


def fit(path, dur, cut=None, fade=.12):
    y, sr = sf.read(path, dtype='float32'); n = int(round(dur * sr))
    if cut is not None:
        c = int(cut * sr); y = y.copy(); f = int(fade * sr); y[c - f:c] *= np.linspace(1, 0, f) if y.ndim == 1 else np.linspace(1, 0, f)[:, None]; y[c:] = 0
    z = np.zeros((n,) + y.shape[1:], np.float32); z[:min(n, len(y))] = y[:n]
    return z, sr


def frames_dur(t):   # длина ролика: последний кадр — ровно на t (кадр 0 петли)
    return round((math.ceil(t * FPS - 1e-6) + 1) / FPS, 4)


def main():
    T = json.load(open(os.path.join(OUT('v163-ru'), 'timeline.json')))
    fix_punct(T)
    dragE = T['sent'][-1]['words'][-1]['b']
    assert nw(T['sent'][-1]['words'][-1]['d']) == 'затянуться'
    dur = frames_dur(dragE + END_END)
    T['dur'] = dur; T['env'] = (list(T['env']) + [0.] * int(dur * FPS + 2))[:int(math.ceil(dur * FPS)) + 1]
    for f in ('voice.wav', 'voice.dry.wav'):
        z, sr = fit(os.path.join(OUT('v163-ru'), f), dur); sf.write(os.path.join(OUT('v163-ru'), f), z, sr)
    json.dump(T, open(os.path.join(OUT('v163-ru'), 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
    print(f'v163-ru: «затянуться?» кончается на {dragE:.2f} с, концовка с доской до {dragE + END_END:.2f} с, длина {dur} с')
    # глава фильма
    o = OUT('v163f-ru'); os.makedirs(o, exist_ok=True)
    i12 = next(i for i, s in enumerate(T['sent']) if any(nw(w['d']) == 'идеально' for w in s['words']))
    F = dict(T, ep='v163f-ru', sent=T['sent'][:i12 + 1])
    wk = next(w for w in F['sent'][-1]['words'] if nw(w['d']) == 'идеально')
    adm = T['sent'][i12 + 1]['words'][0]['a']
    cut = min(wk['b'] + .25, adm - .05)
    fdur = frames_dur(wk['a'] + FILM_END)
    F['dur'] = fdur; F['env'] = F['env'][:int(math.ceil(fdur * FPS)) + 1]
    for f in ('voice.wav', 'voice.dry.wav'):
        z, sr = fit(os.path.join(OUT('v163-ru'), f), fdur, cut=cut); sf.write(os.path.join(o, f), z, sr)
    json.dump(F, open(os.path.join(o, 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
    print(f'v163f-ru: голос до «идеально» (обрез {cut:.2f} с), доска до {wk["a"] + FILM_END:.2f} с, длина {fdur} с')


if __name__ == '__main__':
    main()
