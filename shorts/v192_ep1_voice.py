#!/usr/bin/env python3
"""v19.2 (17.11, отзыв Андрея: «странная пауза в аудио после «Старый план сработал идеально»»): голос мостика выпуска 1 (v170e).
  — доозвучка «Бумажная сигарета…» (P1, предложение 14) была на 2,5–4 дБ ярче основной записи и без низа (−6 дБ на 63 Гц) — выровнена по полосам;
    в v19.1 выравнивание по ошибке стояло на соседнем «Старый план сработал идеально» (предложение 13) — разница только росла;
  — пауза перед P1 (0,7 с) и после неё (0,57 с) — по ~0,33 с, всё, что дальше, сдвинуто раньше: и голос, и слова в tl/v170e-ru.json;
  — цифрового нуля в паузах больше нет: под паузой — шум той же записи.
Запуск один раз, на голосе v19.1:  python3 v192_ep1_voice.py
  → stems/v170e-ru/voice.flac и out/v170e-ru/voice.wav — новый голос, tl/v170e-ru.json и out/v170e-ru/timeline.json — сдвинутые слова (поле cut192).
Второй раз не запускается (в таймлайне уже есть cut192): голос в stems уже новый."""
import json, os, subprocess, sys
import numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__))
TL, ST, O = os.path.join(HERE, 'tl', 'v170e-ru.json'), os.path.join(HERE, 'stems', 'v170e-ru', 'voice.flac'), os.path.join(HERE, 'out', 'v170e-ru')
EQ = 'volume=-2.8dB,bass=g=9:f=160:w=0.6,equalizer=f=630:t=q:w=1.2:g=-1.3'   # P1 → тембр основной записи (замер по полосам: см. bands())
GAP = {14: .34, 15: .30}   # пауза перед предложением → сколько оставить, с


def db(x):
    return 20 * np.log10(np.sqrt(np.mean(np.square(x))) + 1e-12)


def bands(v, sr, T, idx):
    """средний спектр речи по полосам (дБ) — для проверки выравнивания"""
    fr = np.fft.rfftfreq(2048, 1 / sr); out = []
    for i in idx:
        s = T['sent'][i]; x = v[int(s['a'] * sr):int(s['b'] * sr)]
        P = [np.abs(np.fft.rfft(x[k:k + 2048] * np.hanning(2048))) ** 2 for k in range(0, len(x) - 2048, 1024) if db(x[k:k + 2048]) > -40]
        out.append(np.mean(P, 0))
    S = np.mean(out, 0)
    return np.array([10 * np.log10(S[(fr >= c / 2 ** .5) & (fr < c * 2 ** .5)].mean() + 1e-20) for c in (63, 100, 160, 250, 400, 630, 1000, 1600, 2500, 4000, 6300, 10000)])


def ffx(seg, sr, af):
    a, b = os.path.join(O, '_eq_a.wav'), os.path.join(O, '_eq_b.wav'); sf.write(a, seg, sr)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', a, '-af', af, b], check=True)
    q, _ = sf.read(b, dtype='float32'); os.remove(a); os.remove(b)
    return q[:len(seg)]


def zero_runs(v, sr, mn=.01):
    z = np.concatenate([[False], v == 0, [False]]); d = np.diff(z.astype(np.int8)); a, b = np.nonzero(d == 1)[0], np.nonzero(d == -1)[0]
    return [(x, y) for x, y in zip(a, b) if y - x >= mn * sr]


def main():
    T = json.load(open(TL))
    if 'cut192' in T: sys.exit('уже сделано (в таймлайне есть cut192) — голос в stems уже новый')
    S = T['sent']; assert S[14]['text'].startswith('Бумажная') and S[13]['text'].startswith('Старый план') and S[15]['text'].startswith('Признайтесь'), [s['text'][:12] for s in S[13:16]]
    v, sr = sf.read(ST, dtype='float32'); v = v if v.ndim == 1 else v.mean(1)
    print('до:   P1 − основная по полосам', np.round(bands(v, sr, T, [14]) - bands(v, sr, T, [11, 12, 13, 15]), 1))
    # 1. P1 — тембр основной записи
    a, b = int((S[14]['a'] - .12) * sr), int((S[14]['b'] + .25) * sr); q = ffx(v[a:b], sr, EQ); n = int(.04 * sr)
    w = np.ones(len(q), np.float32); w[:n] = np.linspace(0, 1, n); w[-n:] = np.linspace(1, 0, n); v[a:a + len(q)] = v[a:a + len(q)] * (1 - w) + q * w
    print('после: P1 − основная по полосам', np.round(bands(v, sr, T, [14]) - bands(v, sr, T, [11, 12, 13, 15]), 1))
    # 2. шум записи — тихий кусок без нуля (хвост перед «Но «Джул»»)
    tone = None
    w10 = int(.01 * sr)
    for t in np.arange(100.5, 101.0, .005):   # у синтезированного голоса «тишина» — шум в 1–2 младших разряда: часть отсчётов нулевые, но не сплошь; без начала слова
        x = v[int(t * sr):int((t + .08) * sr)]
        if np.mean(x == 0) < .3 and -100 < db(x) < -70 and max(db(x[k:k + w10]) for k in range(0, len(x) - w10 + 1, w10)) < -84: tone = x.copy(); break
    assert tone is not None, 'не нашёл шум записи'
    print(f'шум записи: {db(tone):.0f} дБ, {len(tone) / sr:.2f} с')
    # 3. паузы: режем середину цифрового нуля так, чтобы от конца слова до начала следующего осталось GAP
    cuts = []
    for i, keep in GAP.items():
        t0, t1 = S[i - 1]['b'] - .5, S[i]['a'] + .25; x = v[int(t0 * sr):int(t1 * sr)]; w10 = int(.01 * sr)
        loud = [k for k in range(0, len(x) - w10, w10) if db(x[k:k + w10]) > -45]
        gaps = [(loud[j], loud[j + 1]) for j in range(len(loud) - 1) if loud[j + 1] - loud[j] > .25 * sr]
        e0, s1 = gaps[-1]; e0 = t0 + (e0 + w10) / sr; s1 = t0 + s1 / sr   # конец речи / начало речи
        Z = [(za / sr, zb / sr) for za, zb in zero_runs(v, sr) if e0 - .05 < za / sr < s1]
        assert Z, f'нет нуля в паузе перед {i}'
        za, zb = max(Z, key=lambda r: r[1] - r[0]); d = min((s1 - e0) - keep, (zb - za) - .04)
        if d <= .02: continue
        c0 = (za + zb) / 2 - d / 2
        cuts.append((round(c0, 4), round(d, 4))); print(f'пауза перед {i}: {s1 - e0:.2f} с → {s1 - e0 - d:.2f} с (вырезано {d:.3f} с в {c0:.2f})')
    for c0, d in sorted(cuts, reverse=True):
        v = np.concatenate([v[:int(c0 * sr)], v[int((c0 + d) * sr):]])
    # 4. цифровой ноль → шум записи (с наплывом 8 мс)
    f = int(.008 * sr)
    for za, zb in zero_runs(v, sr):
        n = zb - za; r = np.tile(tone, n // len(tone) + 1)[:n].copy(); k = min(f, n // 2)
        if k: r[:k] *= np.linspace(0, 1, k); r[-k:] *= np.linspace(1, 0, k)
        v[za:zb] = r
    print('нулей длиннее 10 мс осталось:', len(zero_runs(v, sr)))
    # 5. таймлайн: всё после выреза — раньше
    def sh(t):
        return round(t - sum(d for c0, d in cuts if t >= c0 + d / 2), 4)
    for s in S:
        s['a'], s['b'] = sh(s['a']), sh(s['b'])
        for wd in s['words']: wd['a'], wd['b'] = sh(wd['a']), sh(wd['b'])
    for k in ('dragE', 'b0', 'endT'):
        if k in T: T[k] = sh(T[k])
    tot = sum(d for _, d in cuts); T['dur'] = round(T['dur'] - tot, 4)
    env = T['env']
    for c0, d in sorted(cuts, reverse=True):
        i0 = int(round(c0 * 30)); del env[i0:i0 + int(round(d * 30))]
    T['cut192'] = [list(c) for c in cuts]
    v = v[:int(T['dur'] * sr) + int(.5 * sr)]
    sf.write(ST, v, sr, format='FLAC'); os.makedirs(O, exist_ok=True); sf.write(os.path.join(O, 'voice.wav'), v, sr)
    for p in (TL, os.path.join(O, 'timeline.json')): json.dump(T, open(p, 'w'), ensure_ascii=False, indent=1)
    print(f'вырезано всего {tot:.3f} с, dur {T["dur"]}')


if __name__ == '__main__':
    main()
