#!/usr/bin/env python3
"""v22.5 (22.11): новые строки Макса (voice/v225, 97 кредитов) вместо записанных строк с «доской» и «карточкой» (правило финального ТЗ:
рассказчик не говорит «доска», «карточка», «змея» в концах глав и в финале). Андрей, 22.11: «Даю добро на перезапись Макса».
  v170e — конец главы 1 в фильме: «Но «Джул» — только первая из пяти улик. Дальше история становится... холоднее.»
  v191s — конец шортса главы 2: «Так лазейка 2020 года стала второй из пяти улик. А разбор остальных трёх уже ждёт вас на YouTube.»
          (хвост «Так что в следующий раз…» — из прежней записи, как был).
Голос до строки — байт в байт прежний; строка — новая: тот же тембр (v164_voice.DENSE), громкость речи — как у прежней строки,
начало слова — там же, где было (картинка до строки не сдвигается). Паузы — шум записи, не цифровой ноль.
Прежние голос и таймлайн — out/<ролик>/voice.v224.wav, timeline.v224.json (повторный запуск берёт их, а не уже заменённые).
  python3 v225_voice.py      (нужен out/v225-ru: el13.py build v225-ru — без новых трат, из voice/v225)"""
import json, math, os, shutil
import numpy as np, soundfile as sf
from v164_voice import DENSE, ff, quiet, speech_rms
HERE = os.path.dirname(os.path.abspath(__file__)); SR = 44100; FPS = 30
OUT = lambda ep: os.path.join(HERE, 'out', ep)
AFTER_B = 1.5       # v170e: от конца «холоднее» до последнего кадра (как в v18_ep1_voice.py)
GAP_TAIL = .26      # v191s: от конца «YouTube» до «Так что…» (в прежнем дубле было 0,18 — подряд в одной записи; тут склейка — чуть свободнее)


def db(x): return 20 * math.log10(float(np.sqrt(np.mean(np.square(x)))) + 1e-12)


def onset(y, t0, t1, th=-45.0, w=.01):   # первое место, где речь громче th дБ
    for t in np.arange(t0, t1, w / 2):
        if db(y[int(t * SR):int((t + w) * SR)]) > th: return float(t)
    raise SystemExit(f'нет начала речи на {t0:.2f}–{t1:.2f}')


def noise(src, n):   # шум записи нужной длины (кусок тишины по кругу, стыки — наплывом)
    out = np.zeros(n, np.float32); k = 0; f = int(.02 * SR)
    while k < n:
        m = min(len(src), n - k); seg = src[:m].copy()
        if k and m > 2 * f: seg[:f] *= np.linspace(0, 1, f); out[k - f:k] *= np.linspace(1, 0, f)
        out[k:k + m] += seg; k += m - (f if m > 2 * f else 0)
    return out


def xjoin(a, b, f=int(.012 * SR)):   # склейка наплывом равной мощности
    u = np.linspace(0, np.pi / 2, f); a = a.copy(); a[-f:] = a[-f:] * np.cos(u) + b[:f] * np.sin(u)
    return np.concatenate([a, b[f:]])


def load(ep):
    o = OUT(ep); v0, t0 = os.path.join(o, 'voice.v224.wav'), os.path.join(o, 'timeline.v224.json')
    if not os.path.exists(v0): shutil.copy(os.path.join(o, 'voice.wav'), v0); shutil.copy(os.path.join(o, 'timeline.json'), t0)
    y, sr = sf.read(v0, dtype='float32'); assert sr == SR
    return (y if y.ndim == 1 else y.mean(1)), json.load(open(t0))


def save(ep, y, T):
    o = OUT(ep); sf.write(os.path.join(o, 'voice.wav'), y, SR)
    hop = SR // FPS; env = [float(np.sqrt(np.mean(y[k:k + hop] ** 2))) for k in range(0, len(y), hop)]; mx = max(env) or 1
    T['env'] = [round(min(1, e / mx * 1.8), 3) for e in env]
    json.dump(T, open(os.path.join(o, 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
    shutil.copy(os.path.join(o, 'timeline.json'), os.path.join(HERE, 'tl', ep + '.json'))


def mv(s, d, **o):
    W = [dict(w, a=round(w['a'] + d, 3), b=round(w['b'] + d, 3)) for w in s['words']]
    return dict(s, words=W, a=round(W[0]['a'] - .03, 3), b=round(W[-1]['b'] + .05, 3), **o)


def main():
    X, _ = sf.read(os.path.join(OUT('v225-ru'), 'voice.wav'), dtype='float32'); TX = json.load(open(os.path.join(OUT('v225-ru'), 'timeline.json')))
    NB, NS = TX['sent']; Xw = ff(X, DENSE)
    nb0 = onset(X, NB['words'][0]['a'] - .3, NB['words'][0]['a'] + .1); nb1, l1 = quiet(X, NB['words'][-1]['b'] + .05, NS['words'][0]['a'] - .12)
    ns0 = onset(X, NS['words'][0]['a'] - .3, NS['words'][0]['a'] + .1); ns1 = min(len(X) / SR - 1.2 - .01, NS['words'][-1]['b'] + .3)   # el13 дописывает 1,2 с нуля после записи
    print(f'новый дубль: мостик {nb0:.3f}–{nb1:.3f} (разрез {l1:.0f} дБ), конец шортса {ns0:.3f}–{ns1:.3f}')

    # ---------- v170e: мостик главы 1 → 2 ----------
    y, T = load('v170e-ru'); S = T['sent']; ob = S[-1]; assert ob['scene'] == 'bridge' and 'карточка' in ob['text'], ob['text']
    o0 = onset(y, ob['words'][0]['a'] - .4, ob['words'][0]['a'] + .1); tc = o0 - .06
    g = speech_rms(y[int(ob['a'] * SR):int(ob['b'] * SR)]) / speech_rms(Xw[int(NB['a'] * SR):int(NB['b'] * SR)])
    seg = Xw[int((nb0 - .06) * SR):int(nb1 * SR)] * g; f = int(.03 * SR); seg[-f:] *= np.linspace(1, 0, f)
    sh = tc - (nb0 - .06); nb = mv(NB, sh, scene='bridge', v='end', i=ob['i'])
    endT = round(nb['words'][-1]['b'] + AFTER_B, 3); dur = round((math.ceil(endT * FPS - 1e-6) + 1) / FPS, 4); N = int(round(dur * SR))
    room = y[int((ob['words'][-1]['b'] + .3) * SR):int((T['dur'] - .05) * SR)]   # тишина после прежней строки — шум записи
    v = xjoin(y[:int(tc * SR)], seg.astype(np.float32)); v = np.concatenate([v, noise(room, max(0, N - len(v)))])[:N]
    T2 = dict(T, sent=S[:-1] + [nb], endT=endT, dur=dur, v225=1)
    save('v170e-ru', v, T2)
    print(f"v170e: «Но» {ob['words'][0]['a']:.3f} → {nb['words'][0]['a']:.3f}, «холоднее» {ob['words'][-1]['a']:.3f} → {nb['words'][-1]['a']:.3f}, "
          f"последний кадр {T['endT']} → {endT}, длина {T['dur']} → {dur}, громкость ×{g:.2f}")

    # ---------- v191s: конец шортса главы 2 ----------
    y, T = load('v191s-ru'); S = T['sent']; ob, ot = S[-2], S[-1]; assert ob['scene'] == 'board' and 'карточку' in ob['text'] and ot['scene'] == 'tail'
    o0 = onset(y, ob['words'][0]['a'] - .4, ob['words'][0]['a'] + .1); tc = o0 - .06
    qt, lq = quiet(y, ob['words'][-1]['b'] - .02, ot['words'][0]['a'] - .03)   # разрез перед хвостом «Так что…» — в самом тихом месте
    g = speech_rms(y[int(ob['a'] * SR):int(ob['b'] * SR)]) / speech_rms(Xw[int(NS['a'] * SR):int(NS['b'] * SR)])
    seg = Xw[int((ns0 - .06) * SR):int(ns1 * SR)] * g; f = int(.03 * SR); seg[-f:] *= np.linspace(1, 0, f)
    sh = tc - (ns0 - .06); nb = mv(NS, sh, scene='board', v=ob.get('v'), i=ob['i'])
    t_tail = nb['words'][-1]['b'] + GAP_TAIL - (ot['words'][0]['a'] - qt)   # где в ролике начнётся кусок с хвостом
    room = y[int((qt - .06) * SR):int((qt + .02) * SR)]   # шум той же записи у разреза (в паузе перед строкой у шортса цифровой ноль)
    print(f'  шум паузы: {db(room):.0f} дБ')
    v = xjoin(y[:int(tc * SR)], seg.astype(np.float32)); v = np.concatenate([v, noise(room, max(0, int(t_tail * SR) - len(v)))])[:int(t_tail * SR)]
    v = xjoin(v, y[int(qt * SR):])
    d2 = (t_tail - qt); nt = mv(ot, d2, i=ot['i'])
    endT = round(T['endT'] + d2, 3); dur = round(T['dur'] + d2, 4); N = int(round(dur * SR)); v = np.concatenate([v, np.zeros(max(0, N - len(v)), np.float32)])[:N]
    T2 = dict(T, sent=S[:-2] + [nb, nt], endT=endT, dur=dur, v225=1)
    save('v191s-ru', v, T2)
    print(f"v191s: разрез перед хвостом {qt:.3f} ({lq:.0f} дБ); «Так» {ob['words'][0]['a']:.3f} → {nb['words'][0]['a']:.3f}, «YouTube» {ob['words'][-1]['a']:.3f} → "
          f"{nb['words'][-1]['a']:.3f}, хвост {ot['words'][0]['a']:.3f} → {nt['words'][0]['a']:.3f}, последний кадр {T['endT']} → {endT}, длина {T['dur']} → {dur}, громкость ×{g:.2f}")


if __name__ == '__main__':
    main()
