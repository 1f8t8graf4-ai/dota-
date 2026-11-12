#!/usr/bin/env python3
"""v16.3 (12.11): голос — та же старая запись v14.5 (бесплатные вырезки, как v161_voice.py), новых генераций нет.
Что нового против v16.1/v16.2:
  1) обрубки вырезок убраны («в архив на-», «соль с-», «идеально вы-», нашёл Gemini, подтвердил Vosk):
     у ElevenLabs время слов в этих местах запаздывает на 0,1–0,2 с, и середина между словами попадала в начало следующего слова.
     Теперь место разреза ищется по самому звуку: [6] — тишина между «архив» и «на», [9] — конец «ль» перед свистящим «с»
     (растут высокие частоты), [12] — тишина после «идеально»;
  2) демон на «затянуться?» (пульт v16.3: «обработкой, бесплатно») — громче, грубее, с хрипом и средними частотами,
     чтобы было слышно и в телефоне: тон ниже на 5,7 полутона, полоса 140–3200 Гц, лёгкий перегруз, шёпот-хрип (случайная фаза).
python3 v163_voice.py [ep=v163-ru]  → out/<ep>/voice.wav, voice.dry.wav, timeline.json"""
import json, os, re, subprocess, sys
import numpy as np, soundfile as sf
from numpy.fft import rfft, rfftfreq

HERE = os.path.dirname(os.path.abspath(__file__)); SR = 44100; FPS = 30
SRC = os.path.join(HERE, 'out', 'v145m-ru')
PITCH = 'asetrate=44100*0.72,aresample=44100,atempo=1.388'
GROWL = 'highpass=f=140,lowpass=f=3200,acrusher=bits=10:mix=0.35:mode=log:aa=1,equalizer=f=900:t=q:w=1.2:g=6,volume=1.5'
HOARSE = ("afftfilt=real='hypot(re,im)*cos((random(0)*2-1)*2*3.14)':imag='hypot(re,im)*sin((random(1)*2-1)*2*3.14)':win_size=512:overlap=0.75,"
          'highpass=f=400,lowpass=f=5000,volume=0.9')
nw = lambda s: re.sub(r'[«»"“”.,?!…:;]', '', str(s)).lower()


def find(S, i, q, n=0):
    k = 0
    for j, w in enumerate(S[i]['words']):
        if nw(w['d']) == q:
            if k == n: return j
            k += 1
    raise SystemExit(f'нет слова «{q}» в [{i}]')


def rms(y, t, w=.01):
    k = int(t * SR); return float(np.sqrt(np.mean(y[k:k + int(w * SR)] ** 2)) + 1e-9)


def quiet(y, a, b, w=.01):
    """самая тихая точка (окно w) между a и b, шаг 2,5 мс"""
    ts = np.arange(a, b - w, .0025); e = [rms(y, t, w) for t in ts]
    return float(ts[int(np.argmin(e))] + w / 2)


def hf_onset(y, a, b, thr=.03):
    """начало свистящего звука: первая точка после a, где доля 4–9 кГц выше thr (окно 10 мс, шаг 2,5 мс)"""
    w = int(.01 * SR); f = rfftfreq(w, 1 / SR); band = (f > 4000) & (f < 9000)
    for t in np.arange(a, b, .0025):
        k = int(t * SR); X = np.abs(rfft(y[k:k + w] * np.hanning(w))) ** 2
        if X[band].sum() / (X.sum() + 1e-12) > thr: return float(t)
    return b


def cut_start(y, S, i, j):
    """где резать: конец слова j-1 по звуку (не по времени ElevenLabs)"""
    p, c = S[i]['words'][j - 1], S[i]['words'][j]
    if i == 9:   # «соль» → «семьдесят»: паузы нет, режем перед «с» (минимум громкости до роста высоких частот)
        on = hf_onset(y, p['b'] - .18, c['a'] + .05)
        return quiet(y, on - .03, on + .004, .005)
    return quiet(y, p['b'] - .25, c['a'] + .02)   # пауза между словами — самая тихая точка рядом


def main(ep):
    out = os.path.join(HERE, 'out', ep); os.makedirs(out, exist_ok=True)
    T = json.load(open(os.path.join(SRC, 'timeline.raw.json'))); y, sr = sf.read(os.path.join(SRC, 'voice.clean.wav'), dtype='float32'); assert sr == SR
    S = T['sent']
    i13 = next(i for i, s in enumerate(S) if s['scene'] == 's9') - 1
    assert nw(S[i13]['words'][-1]['d']) == 'затянуться'
    plan = [(6, find(S, 6, 'на', 0), .32), (9, find(S, 9, '1973'), .30), (12, find(S, 12, 'вы'), .45)]
    cuts = []
    for i, j, gap in plan:
        W = S[i]['words']; t0 = cut_start(y, S, i, j); t1 = W[-1]['b'] + .02
        cuts.append((t0, t1, gap, i, j))
    tend = quiet(y, S[i13]['words'][-1]['b'] - .25, S[i13 + 1]['words'][0]['a'], .02)   # до «А» из [14]
    TAIL = 2.2
    F = int(.012 * SR); parts = []; pos = 0.
    for t0, t1, gap, *_ in cuts:
        seg = y[int(pos * SR):int(t0 * SR)].copy(); seg[-F:] *= np.linspace(1, 0, F)
        if pos > 0: seg[:F] *= np.linspace(0, 1, F)
        parts += [seg, np.zeros(int(gap * SR), np.float32)]; pos = t1
    seg = y[int(pos * SR):int(tend * SR)].copy(); seg[:F] *= np.linspace(0, 1, F); seg[-F:] *= np.linspace(1, 0, F)
    parts += [seg, np.zeros(int(TAIL * SR), np.float32)]
    z = np.concatenate(parts)

    def mapt(t):
        sh = 0.
        for t0, t1, gap, *_ in cuts:
            if t >= t1: sh += (t1 - t0) - gap
            elif t > t0: return t0 - sh
        return t - sh
    sent = []
    for i, s in enumerate(S[:i13 + 1]):
        W = [dict(w) for w in s['words']]
        cut = next((j for ii, j in [(c[3], c[4]) for c in cuts] if ii == i), None)
        if cut is not None: W = W[:cut]; W[-1]['d'] = re.sub(r'[,:;]$', '', W[-1]['d']) + '.'
        for w in W: w['a'] = round(mapt(w['a']), 3); w['b'] = round(mapt(w['b']), 3)
        sent.append(dict(s, words=W, a=W[0]['a'], b=W[-1]['b'], text=' '.join(w['d'] for w in W)))
    T['sent'] = sent; T['dur'] = round(len(z) / SR, 3); T['ep'] = ep
    env = T['env']; E = []; pos = 0.
    for t0, t1, gap, *_ in cuts:
        E += env[int(pos * FPS):int(t0 * FPS)] + [0.] * int(round(gap * FPS)); pos = t1
    E += env[int(pos * FPS):int(tend * FPS)] + [0.] * int(round(TAIL * FPS)); T['env'] = E
    v = os.path.join(out, 'voice.dry.wav'); sf.write(v, z, SR)
    # демон — только «затянуться?»: рычание (середина, перегруз) + хрип (шёпот того же тона), сухой голос на слове чуть тише
    W = sent[-1]['words'][-1]; t0 = max(0., W['a'] - .03); t1 = W['b'] + .45; d = int(t0 * 1000); L = t1 - t0
    fg = (f"[0:a]asplit=2[m][d];[d]atrim={t0:.3f}:{t1:.3f},asetpts=PTS-STARTPTS,{PITCH},asplit=2[p1][p2];"
          f"[p1]{GROWL}[g];[p2]{HOARSE}[h];[g][h]amix=inputs=2:duration=first:normalize=0,"
          f"afade=t=in:st=0:d=0.03,afade=t=out:st={max(0, L - .3):.3f}:d=0.3,adelay={d}|{d}[dl];"
          f"[m]volume=enable='between(t,{t0:.3f},{t1:.3f})':volume=0.8[m2];"
          f"[m2][dl]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.95[o]")
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', v, '-filter_complex', fg, '-map', '[o]', '-ar', str(SR), '-ac', '1', os.path.join(out, 'voice.wav')], check=True)
    json.dump(T, open(os.path.join(out, 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
    for t0, t1, gap, i, j in cuts:
        p = S[i]['words'][j - 1]
        print(f'[{i}] режу с {t0:.3f} (конец «{p["d"]}» по ElevenLabs {p["b"]:.3f}), вырезано {t1 - t0:.2f} с с «{S[i]["words"][j]["d"]}», пауза {gap:.2f} с')
    print(ep, f'конец голоса — {tend:.2f} с исходной записи; длина {T["dur"]} с')


if __name__ == '__main__':
    a = sys.argv[1:]
    main(a[0] if a and not a[0].startswith('-') else 'v163-ru')
