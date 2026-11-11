#!/usr/bin/env python3
"""v16.1 (11.11): голос — та же старая запись v14.5, только бесплатные вырезки (новых генераций нет, ждём одобрения картинки).
  1) [6]  «…спрятали в архив на двадцать пять лет» → «…спрятали в архив» (соль у R.J. Reynolds — 1979, не 1973);
  2) [9]  «…та самая соль 1973 года» → «…та самая соль»;
  3) [12] «Старый план сработал идеально: вы презирали сигареты, но всё равно платите им дань» → «Старый план сработал идеально»;
  4) конец — сразу после «затянуться?»: реплика [14] уходит в отдельный файл концовки. Режем в самом тихом месте
     до «А» из [14] — в v16 вставленная пауза разрезала это «А», и обрубок звучал после «затянуться?»;
  5) демонический слой — как в v16, только на «затянуться?».
На месте каждой вырезки — короткая пауза (тишина) и плавные края по 15 мс.
python3 v161_voice.py [ep=v161-ru]  → out/<ep>/voice.wav, voice.dry.wav, timeline.json"""
import json, os, re, subprocess, sys
import numpy as np, soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__)); SR = 44100; FPS = 30
SRC = os.path.join(HERE, 'out', 'v145m-ru')
DEMON = 'asetrate=44100*0.72,aresample=44100,atempo=1.388,lowpass=f=900,aecho=0.8:0.88:40:0.4,volume=0.9'
nw = lambda s: re.sub(r'[«»"“”.,?!…:;]', '', str(s)).lower()


def find(S, i, q, n=0):
    """индекс слова q (n-е вхождение) в предложении i"""
    k = 0
    for j, w in enumerate(S[i]['words']):
        if nw(w['d']) == q:
            if k == n: return j
            k += 1
    raise SystemExit(f'нет слова «{q}» в [{i}]')


def quiet(y, a, b):
    """самая тихая точка (окно 20 мс) между a и b"""
    i0, i1, w = int(a * SR), int(b * SR), int(.02 * SR)
    e = [np.sqrt(np.mean(y[k:k + w] ** 2)) for k in range(i0, i1 - w, int(.005 * SR))]
    return (i0 + int(np.argmin(e)) * int(.005 * SR) + w // 2) / SR


def main(ep):
    out = os.path.join(HERE, 'out', ep); os.makedirs(out, exist_ok=True)
    T = json.load(open(os.path.join(SRC, 'timeline.raw.json'))); y, sr = sf.read(os.path.join(SRC, 'voice.clean.wav'), dtype='float32'); assert sr == SR
    S = T['sent']
    i13 = next(i for i, s in enumerate(S) if s['scene'] == 's9') - 1
    assert nw(S[i13]['words'][-1]['d']) == 'затянуться'
    # вырезки: (предложение, первое убираемое слово, пауза вместо них)
    plan = [(6, find(S, 6, 'на', 0), .32), (9, find(S, 9, '1973'), .30), (12, find(S, 12, 'вы'), .45)]
    cuts = []   # (t0, t1, gap) — время исходной записи
    for i, j, gap in plan:
        W = S[i]['words']; t0 = (W[j - 1]['b'] + W[j]['a']) / 2; t1 = W[-1]['b'] + .02
        cuts.append((t0, t1, gap, i, j))
    tend = quiet(y, S[i13]['words'][-1]['b'] - .25, S[i13 + 1]['words'][0]['a'])   # до «А» из [14]
    TAIL = 2.2
    # собираем звук
    F = int(.015 * SR); parts = []; pos = 0.
    for t0, t1, gap, *_ in cuts:
        seg = y[int(pos * SR):int(t0 * SR)].copy(); seg[-F:] *= np.linspace(1, 0, F)
        if pos > 0: seg[:F] *= np.linspace(0, 1, F)
        parts += [seg, np.zeros(int(gap * SR), np.float32)]; pos = t1
    seg = y[int(pos * SR):int(tend * SR)].copy(); seg[:F] *= np.linspace(0, 1, F); seg[-F:] *= np.linspace(1, 0, F)
    parts += [seg, np.zeros(int(TAIL * SR), np.float32)]
    z = np.concatenate(parts)
    # время: исходное → новое
    def mapt(t):
        sh = 0.
        for t0, t1, gap, *_ in cuts:
            if t >= t1: sh += (t1 - t0) - gap
            elif t > t0: return t0 - sh   # внутри вырезки — к её началу
        return t - sh
    sent = []
    for i, s in enumerate(S[:i13 + 1]):
        W = [dict(w) for w in s['words']]
        cut = next((j for ii, j in [(c[3], c[4]) for c in cuts] if ii == i), None)
        if cut is not None: W = W[:cut]; W[-1]['d'] = re.sub(r'[,:;]$', '', W[-1]['d']) + '.'
        for w in W: w['a'] = round(mapt(w['a']), 3); w['b'] = round(mapt(w['b']), 3)
        s2 = dict(s, words=W, a=W[0]['a'], b=W[-1]['b'], text=' '.join(w['d'] for w in W))
        sent.append(s2)
    T['sent'] = sent; T['dur'] = round(len(z) / SR, 3); T['ep'] = ep
    env = T['env']; E = []; pos = 0.
    for t0, t1, gap, *_ in cuts:
        E += env[int(pos * FPS):int(t0 * FPS)] + [0.] * int(round(gap * FPS)); pos = t1
    E += env[int(pos * FPS):int(tend * FPS)] + [0.] * int(round(TAIL * FPS)); T['env'] = E
    v = os.path.join(out, 'voice.dry.wav'); sf.write(v, z, SR)
    # демон — только «затянуться?»
    W = sent[-1]['words'][-1]; t0 = max(0., W['a'] - .03); t1 = W['b'] + .4
    fg = (f"[0:a]asplit=2[m][d];[d]atrim={t0:.3f}:{t1:.3f},asetpts=PTS-STARTPTS,{DEMON},afade=t=in:st=0:d=0.03,afade=t=out:st={max(0, t1 - t0 - .25):.3f}:d=0.25,"
          f"adelay={int(t0 * 1000)}|{int(t0 * 1000)}[dl];[m][dl]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.95[o]")
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', v, '-filter_complex', fg, '-map', '[o]', '-ar', str(SR), '-ac', '1', os.path.join(out, 'voice.wav')], check=True)
    json.dump(T, open(os.path.join(out, 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
    for t0, t1, gap, i, j in cuts: print(f'[{i}] вырезано {t1 - t0:.2f} с с «{S[i]["words"][j]["d"]}», пауза {gap:.2f} с')
    print(ep, f'конец голоса — {tend:.2f} с исходной записи (до «А» из [14]); длина {T["dur"]} с')


if __name__ == '__main__':
    a = sys.argv[1:]
    main(a[0] if a and not a[0].startswith('-') else 'v161-ru')
