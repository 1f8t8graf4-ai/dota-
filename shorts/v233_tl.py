#!/usr/bin/env python3
"""v23.3 (22.11): таймлайн пролога A (v231y-ru) по голосу Макса (voice/v233, 107 кредитов; Андрей: «даю добро и на озвучку тоже»).
Время слов — из ответа ElevenLabs (out/v233-ru/timeline.json), уточнённое по самой записи: начало слова после паузы — по началу звука,
остальные — со сдвигом, который получился у таких слов (у v4 буквы отстают на ≈ 0,1 с). Паузы:
  перед первым словом — капля успевает упасть в луч; после «Снюс.» — пятёрка стоит в ряд до «Менялись» (там врезка «упаковка»);
  после «суть.» — вспышка и волна успевают отзвучать. Вставка — шумом той же записи из паузы (без цифрового нуля).
  python3 v233_tl.py   (нужен out/v233-ru: python3 -c "import el13; el13.build('v233-ru')" — без трат, из voice/v233)
  → out/v231y-ru/voice.wav, tl/v231y-ru.json"""
import json, math, os
import numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)); SR = 44100
SRC = os.path.join(HERE, 'out', 'v233-ru')   # v23.6: немецкий — out/v233-de (v236_de_prolog.py, голос Alexander)
LEAD = .5                                  # где начинается «Что»
ADD = {('s3', 4): .38, ('s4', 7): .36}     # (фраза, № слова) → сколько добавить к паузе после него
ADD_L = {'ru': ADD, 'de': {('s3', 4): .38, ('s4', 8): .36}}   # de: после «Nikotinbeutel.» и «blieb.»
DASH = {'ru': ('обещания', '—'), 'de': ('sich', '–')}   # тире — к слову (на нём субтитр кончается)
TAIL = .55                                 # от конца «знакомого…» до кадра 0 главы 1
FILM_TAIL = .75                            # v23.6, фильм на YouTube: капля влетает в капсулу главы 1, розовый растекается — дальше её кадр 0 (было 1,47: титр и темнота)


def env_db(y, hop):
    n = len(y) // hop; e = np.sqrt((y[:n * hop].reshape(n, hop) ** 2).mean(1)); return 20 * np.log10(e + 1e-9)


def silences(y, thr=-45, mn=.08):
    hop = int(.01 * SR); q = env_db(y, hop) < thr; out, i = [], 0
    while i < len(q):
        if q[i]:
            j = i
            while j < len(q) and q[j]: j += 1
            if (j - i) * .01 >= mn: out.append((i * .01, j * .01))
            i = j
        else: i += 1
    return out


def room(y, a, b, n):   # шум записи из тихого места паузы, по кругу с наплывами
    seg = y[int((a + .03) * SR):int((b - .03) * SR)].astype(np.float64)
    if len(seg) < int(.06 * SR): return np.zeros(n)
    f = int(.02 * SR); out = np.zeros(n + len(seg)); p = 0; w = np.linspace(0, 1, f)
    while p < n:
        s = seg.copy(); s[:f] *= w; s[-f:] *= w[::-1]; out[p:p + len(s)] += s; p += len(s) - f
    return out[:n]


def main(lang='ru'):
    global SRC, ADD
    SRC = os.path.join(HERE, 'out', f'v233-{lang}'); ADD = ADD_L[lang]
    y, sr = sf.read(os.path.join(SRC, 'voice.wav'), dtype='float32'); assert sr == SR; y = y if y.ndim == 1 else y.mean(1)
    T = json.load(open(os.path.join(SRC, 'timeline.json'))); S = T['sent']
    sil = silences(y); on = [b for a, b in sil]; off = [a for a, b in sil]
    W = [(s['scene'], j, w) for s in S for j, w in enumerate(s['words'])]
    da, db = [], []
    for _, _, w in W:
        c = [x for x in on if w['a'] - .3 <= x <= w['a'] + .08]
        if c: da.append(min(c, key=lambda x: abs(x - w['a'])) - w['a'])
        c = [x for x in off if w['b'] - .4 <= x <= w['b'] + .1]
        if c: db.append(min(c, key=lambda x: abs(x - w['b'])) - w['b'])
    ma, mb = float(np.median(da)), float(np.median(db)); print(f'сдвиг начала {ma:+.3f} с ({len(da)} слов), конца {mb:+.3f} с ({len(db)})')
    P = '.,:;?!…—–»'
    for k, (_, _, w) in enumerate(W):   # по паузам — только начало фразы/после знака и конец слова со знаком; остальные — общим сдвигом
        pa = k == 0 or W[k - 1][2]['d'][-1] in P or W[k][1] == 0; pb = w['d'][-1] in P
        c = [x for x in on if w['a'] - .3 <= x <= w['a'] + .08] if pa else [x for x in on if w['a'] + ma - .05 <= x <= w['a'] + ma + .15]
        w['a'] = (min(c, key=lambda x: abs(x - w['a'] - ma)) if c else w['a'] + ma) - .02
        c = [x for x in off if w['b'] - .4 <= x <= w['b'] + .1] if pb else [x for x in off if w['b'] + mb - .15 <= x <= w['b'] + mb + .05]
        w['b'] = (min(c, key=lambda x: abs(x - w['b'] - mb)) if c else w['b'] + mb) + .02
        w['b'] = max(w['b'], w['a'] + .08)
    # склейка: начало — LEAD, вставки пауз, хвост
    sp0 = on[0] if sil and sil[0][0] < .01 else 0.
    parts, shift, cur = [room(y, *sil[1], int(round((LEAD - .02) * SR)))], LEAD - .02 - sp0, sp0   # «Что» — на LEAD
    cuts = []
    for (sc, j), add in ADD.items():
        w = next(x for s_, j_, x in W if s_ == sc and j_ == j); gap = next((a, b) for a, b in sil if a >= w['b'] - .1 - .02)
        cuts.append(((gap[0] + gap[1]) / 2, add, gap))
    cuts.sort(); last_end = W[-1][2]['b']
    for t_cut, add, gap in cuts:
        parts.append(y[int(cur * SR):int(t_cut * SR)].astype(np.float64)); parts.append(room(y, *gap, int(add * SR))); cur = t_cut
    parts.append(y[int(cur * SR):int((last_end + .12) * SR)].astype(np.float64))
    v = np.concatenate(parts)
    for (sc, j, w) in W:
        d = shift + sum(add for t_cut, add, _ in cuts if w['a'] > t_cut)
        w['a'], w['b'] = round(w['a'] + d, 3), round(w['b'] + d, 3)
    f = int(.04 * SR); v[-f:] *= np.linspace(1, 0, f)
    v0 = v
    for ep, tail in ((f'v231y-{lang}', TAIL), (f'v231f-{lang}', FILM_TAIL)):   # v23.4: v231f — пролог для фильма на YouTube (дольше: титр, дымка, темнота)
        N = math.ceil((W[-1][2]['b'] + tail) * 30); dur = N / 30
        v = np.concatenate([v0, np.zeros(max(0, int(round(dur * SR)) - len(v0)))])[:int(round(dur * SR))]
        o = os.path.join(HERE, 'out', ep); os.makedirs(o, exist_ok=True); sf.write(os.path.join(o, 'voice.wav'), v.astype(np.float32), SR)
        write(ep, S, N, dur, lang)


def write(ep, S, N, dur, lang='ru'):
    sent = []
    for s in S:
        ws = [dict(d=w['d'], a=w['a'], b=w['b'], c='') for w in s['words']]
        if s['scene'] == 's4':   # тире — к слову (на нём субтитр кончается, buildChunks)
            dw, dc = DASH[lang]; k = next(i for i, w in enumerate(ws) if w['d'].startswith(dw)); ws[k]['d'] += dc
        sent.append({'i': s['i'], 'scene': s['scene'], 'a': round(ws[0]['a'] - .03, 3), 'b': round(ws[-1]['b'] + .03, 3), 'text': s['text'], 'words': ws})
    R = {'ep': ep, 'lang': lang, 'dur': round(dur, 6), 'fps': 30, 'voice': 'v233' if lang == 'ru' else 'de/prolog', 'natural': True, 'endT': round(dur, 6), 'frames': N, 'sent': sent}
    json.dump(R, open(os.path.join(HERE, 'tl', ep + '.json'), 'w'), ensure_ascii=False, indent=1)
    if ep.startswith('v231y'):
        for s in sent: print(s['scene'], ' '.join(f"{w['d']}@{w['a']:.2f}-{w['b']:.2f}" for w in s['words']))
    print(f'{ep}: {dur:.3f} с, {N} кадров')


if __name__ == '__main__':
    import sys
    main(sys.argv[1] if len(sys.argv) > 1 else 'ru')
