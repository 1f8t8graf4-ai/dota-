#!/usr/bin/env python3
"""v16.4 (12.11, ночь): голос из трёх оплаченных дублей ElevenLabs (shorts/voice/v164, README там же) → один голос шортса.
  Гайд Андрея и Gemini:
    п. 4 — лаборатория медленнее: паузы +0,45 с перед «Тогда химики…», +0,35 с на запятой «соль,», +0,6 с после «…убойной дозе.»;
    п. 8 — основной текст — плотный дикторский (эквалайзер + компрессия), цитата записки «Мы должны получить свою долю молодёжного
           рынка» — документальной цитатой: дубль другого голоса (Alex Bell) вместо цитаты Макса, полоса как у архивной записи
           и короткая комната (машинка — звуком в сведении, по событиям картинки).
  «Убери все артефакты в звуке»: ни одной вырезки внутри слова — режем только в паузах (самая тихая точка, проверка уровня),
  края — плавные (12 мс); демон на «затянуться?» — без цифрового хруста (было: acrusher и случайная фаза): тон ниже на 5 полутонов,
  мягкое насыщение tanh, середина, шёпот — шум по огибающей голоса (вокодер), короткий хвост.
  Концовка шортса (дубль v164e) — после «затянуться?»: «Захотите» — через 1,47 с после конца слова (доска уже на экране),
  перед «Так…» — +0,6 с неловкой паузы; конец ролика — через 0,55 с после «точно!» (вжух в кадр 0). Время — в timeline.json
  (`endT`, `b0`), JS и музыка берут его оттуда, а не из своих констант.
python3 v164_voice.py   → out/v164a-ru/{voice.wav, voice.dry.wav, timeline.json} и та же копия в out/v164b-ru"""
import json, math, os, re, shutil, subprocess
import numpy as np, soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__)); SR = 44100; FPS = 30
OUT = lambda ep: os.path.join(HERE, 'out', ep)
nw = lambda s: re.sub(r'[«»"“”.,?!…:;—-]', '', str(s)).lower()
B0, L1, PRE_TAIL, AFTER = .62, 1.47, .6, .55
LAB = [('подросткам', 'тогда', .45), ('соль', 'которая', .35), ('дозе', 'но', .6)]   # (слово до, слово после, + пауза), п. 4 гайда
Q_BEFORE, Q_AFTER = .25, .45                                                         # пауза до и после цитаты записки


def load(ep):
    y, sr = sf.read(os.path.join(OUT(ep), 'voice.wav'), dtype='float32'); assert sr == SR
    if y.ndim > 1: y = y.mean(1)
    return y, json.load(open(os.path.join(OUT(ep), 'timeline.json')))


def rms(y, t, w=.01):
    k = max(0, int(t * SR)); return float(np.sqrt(np.mean(y[k:k + int(w * SR)] ** 2)) + 1e-9)


def quiet(y, a, b, w=.012):
    ts = np.arange(a, max(a + .003, b - w), .0025); e = [rms(y, t, w) for t in ts]; i = int(np.argmin(e))
    return float(ts[i] + w / 2), 20 * math.log10(e[i])


def ff(y, chain):
    """прогнать моно-сигнал через фильтры ffmpeg"""
    r = subprocess.run(['ffmpeg', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-af', chain, '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-'],
                       input=np.asarray(y, np.float32).tobytes(), capture_output=True, check=True)
    z = np.frombuffer(r.stdout, np.float32).copy()
    return np.concatenate([z, np.zeros(max(0, len(y) - len(z)), np.float32)])[:len(y)]


def speech_rms(y):
    w = int(.05 * SR); n = len(y) // w; e = np.sqrt(np.mean(y[:n * w].reshape(n, w) ** 2, 1)); e = e[e > 10 ** (-38 / 20)]
    return float(np.sqrt(np.mean(e ** 2))) if len(e) else 1e-3


def fade(x, n=int(.012 * SR)):
    x = x.copy(); n = min(n, len(x) // 2)
    if n: x[:n] *= np.linspace(0, 1, n); x[-n:] *= np.linspace(1, 0, n)
    return x


# плотный дикторский: срез гула, грудь, меньше «бубнения», присутствие, мягче шипящие, компрессия с запасом (без перегруза)
DENSE = ('highpass=f=75,equalizer=f=130:t=q:w=0.9:g=2,equalizer=f=380:t=q:w=1.3:g=-1.5,equalizer=f=3100:t=q:w=1.1:g=2.2,'
         'equalizer=f=7200:t=q:w=1.6:g=-2,acompressor=threshold=-21dB:ratio=3:attack=6:release=110:knee=6:makeup=3dB')
# документальная цитата: полоса как у архивной плёнки, тёплая середина, короткая комната (без металла: малые задержки и спады)
DOC = ('highpass=f=190,lowpass=f=5600,equalizer=f=1250:t=q:w=1.1:g=2.5,acompressor=threshold=-20dB:ratio=3.5:attack=5:release=90:makeup=3dB,'
       'aecho=0.85:0.9:21|37:0.16|0.1')


def vocode_whisper(x, n=1024, hop=256, sm=7, seed=3):
    """шёпот по огибающей голоса: спектр шума × сглаженная по частоте амплитуда голоса (STFT, окно Ханна, 75 % перекрытие)"""
    rng = np.random.default_rng(seed); win = np.hanning(n).astype(np.float32); pad = np.concatenate([np.zeros(n), x, np.zeros(n)])
    out = np.zeros(len(pad)); norm = np.zeros(len(pad)); k = np.ones(sm) / sm
    for i in range(0, len(pad) - n, hop):
        X = np.fft.rfft(pad[i:i + n] * win); mag = np.convolve(np.abs(X), k, 'same')
        N = np.fft.rfft(rng.standard_normal(n) * win); N /= (np.abs(N) + 1e-9)
        out[i:i + n] += np.fft.irfft(mag * N, n) * win; norm[i:i + n] += win ** 2
    return (out / np.maximum(norm, 1e-3))[n:n + len(x)].astype(np.float32)


def demon(seg, target):
    """«затянуться?»: сухой голос 0,8 + слой на 5 полутонов ниже (насыщение tanh, середина) + шёпот того же тона + короткий тёмный хвост.
    Макс говорит это слово почти шёпотом (−32 дБ при речи −19): громкость слоя — до target (пульт v16.3: «громче»)."""
    low = ff(seg, 'asetrate=44100*0.7491,aresample=44100,atempo=1.3349')
    low = low / (np.max(np.abs(low)) or 1); low = np.tanh(2.0 * low) / np.tanh(2.0)
    low = ff(low, 'highpass=f=110,lowpass=f=3400,equalizer=f=900:t=q:w=1.2:g=4')
    wh = ff(vocode_whisper(low), 'highpass=f=450,lowpass=f=5500')
    r = speech_rms(seg) or 1e-3
    low *= r / (speech_rms(low) or 1e-3); wh *= r / (speech_rms(wh) or 1e-3)
    mix = .8 * seg + .95 * low + .32 * wh; mix *= target / (float(np.sqrt(np.mean(mix ** 2))) or 1e-3)   # громкость всего слова — как у речи −2,5 дБ
    tail = ff(np.concatenate([mix, np.zeros(int(.6 * SR), np.float32)]), 'aecho=0.8:0.6:70|125:0.22|0.14,lowpass=f=4200')
    return tail * target / (float(np.sqrt(np.mean(tail[:len(seg)] ** 2))) or 1e-3)   # эхо (in 0,8 × out 0,6) съедало 6 дБ — возвращаем


def main():
    A, TA = load('v164-ru'); Qv, TQ = load('v164q-ru'); E, TE = load('v164e-ru')
    WA = [(i, j, w) for i, s in enumerate(TA['sent']) for j, w in enumerate(s['words'])]

    def find(q, n=0, i=None):
        k = 0
        for si, j, w in WA:
            if nw(w['d']) == q and (i is None or si == i):
                if k == n: return si, j, w
                k += 1
        raise SystemExit(f'нет слова «{q}» #{n}')

    # плотная обработка — до склейки (одинаково для обоих дублей Макса), цитата — своей цепочкой
    A2, E2, Q2 = ff(A, DENSE), ff(E, DENSE), ff(Qv, DOC)
    E2 *= speech_rms(A2) / speech_rms(E2); Q2 *= .92 * speech_rms(A2) / speech_rms(Q2)

    # куски: (источник, начало, конец) — режем только в паузах
    si3, j_my, w_my = find('мы'); _, j_pr, w_pr = find('прямо', 0)
    si_no, _, w_no = find('но', 0)                       # «Но вот проблема»
    _, _, w_ry = find('рынка')
    c1, l1 = quiet(A, w_pr['b'] - .1, w_my['a'] + .02); c2, l2 = quiet(A, w_ry['b'] - .1, w_no['a'] + .02)
    qa = max(0., TQ['sent'][0]['words'][0]['a'] - .14); qb = TQ['sent'][0]['words'][-1]['b'] + .22
    cuts = [(c1, l1, 'до цитаты'), (c2, l2, 'после цитаты')]
    lab = []
    for q0, q1, gap in LAB:
        a0 = find(q0)[2]; a1 = find(q1, 1 if q1 == 'но' else 0)[2]   # «Но электронных сигарет…» — второе «но»
        t, lv = quiet(A, a0['b'] - .1, a1['a'] + .02); lab.append((t, gap, lv, q0, q1))
    for t, lv, what in cuts: print(f'разрез {what}: {t:.3f} с, уровень {lv:.1f} дБ')
    for t, gap, lv, q0, q1 in lab: print(f'пауза «{q0}» → «{q1}»: {t:.3f} с, уровень {lv:.1f} дБ, +{gap} с' + ('' if lv < -42 else '  — ГРОМКО, пропускаю'))
    lab = [x for x in lab if x[2] < -42]
    # последнее слово ролика и демон
    wz = TA['sent'][-1]['words'][-1]; assert nw(wz['d']) == 'затянуться'
    t_end_main = quiet(A, wz['b'] + .15, min(len(A) / SR - .02, wz['b'] + .9))[0]

    plan = [('A', 0., c1), ('Z', Q_BEFORE), ('Q', qa, qb), ('Z', Q_AFTER)]
    pos = c2
    for t, gap, *_ in sorted(lab):
        plan += [('A', pos, t), ('Z', gap)]; pos = t
    plan += [('A', pos, t_end_main)]
    SRC = {'A': (A, A2), 'Q': (Qv, Q2), 'E': (E, E2)}
    dry, wet, segs, tcur = [], [], [], 0.
    for p in plan:
        if p[0] == 'Z':
            n = int(round(p[1] * SR)); dry.append(np.zeros(n, np.float32)); wet.append(np.zeros(n, np.float32)); tcur += n / SR; continue
        src, s0, s1 = p; i0, i1 = int(round(s0 * SR)), int(round(s1 * SR))
        dry.append(fade(SRC[src][0][i0:i1])); wet.append(fade(SRC[src][1][i0:i1])); segs.append((src, s0, s1, tcur)); tcur += (i1 - i0) / SR

    def mapt(src, t):
        """время в дубле → время в ролике: кусок, где s0 ≤ t < s1 (разрезы — в паузах между словами)"""
        mine = [x for x in segs if x[0] == src]
        for s, s0, s1, t0 in mine:
            if s0 - 1e-6 <= t < s1: return round(t0 + (t - s0), 3)
        s, s0, s1, t0 = mine[-1]
        if t >= s1 - 1e-6: return round(t0 + (t - s0), 3)
        raise SystemExit(f'время {t:.3f} ({src}) вне кусков')

    def mapw(src, w):   # конец слова — от его начала (слово не режется: разрезы только в паузах)
        a = mapt(src, w['a']); return dict(w, a=a, b=round(a + (w['b'] - w['a']), 3))

    dragE = mapw('A', wz)['b']
    # концовка: «Захотите» — через L1 после конца «затянуться?», перед «Так…» — PRE_TAIL, конец — AFTER после «точно!»
    we0 = TE['sent'][0]['words'][0]; wt0 = TE['sent'][1]['words'][0]; wtE = TE['sent'][1]['words'][-1]
    e_a = max(0., we0['a'] - .14); ct, lct = quiet(E, TE['sent'][0]['words'][-1]['b'] - .1, wt0['a'] + .02)
    print(f'концовка: разрез перед «Так» {ct:.3f} с, уровень {lct:.1f} дБ')
    t_on = dragE + L1 - (we0['a'] - e_a)
    n = int(round((t_on - tcur) * SR)); assert n > 0, n
    dry.append(np.zeros(n, np.float32)); wet.append(np.zeros(n, np.float32)); tcur += n / SR
    i0, i1 = int(round(e_a * SR)), int(round(ct * SR)); dry.append(fade(E[i0:i1])); wet.append(fade(E2[i0:i1])); segs.append(('E', e_a, ct, tcur)); tcur += (i1 - i0) / SR
    n = int(round(PRE_TAIL * SR)); dry.append(np.zeros(n, np.float32)); wet.append(np.zeros(n, np.float32)); tcur += n / SR
    t_e_end = wtE['b'] + .3; i0, i1 = int(round(ct * SR)), int(round(t_e_end * SR))
    dry.append(fade(E[i0:i1])); wet.append(fade(E2[i0:i1])); segs.append(('E2', ct, t_e_end, tcur)); tcur += (i1 - i0) / SR

    def mapE(t):
        for s, s0, s1, t0 in segs:
            if s in ('E', 'E2') and s0 - 1e-6 <= t < s1: return round(t0 + (t - s0), 3)
        raise SystemExit(f'время концовки {t:.3f} вне кусков')

    def mapwE(w):
        a = mapE(w['a']); return dict(w, a=a, b=round(a + (w['b'] - w['a']), 3))

    endT = mapwE(wtE)['b'] + AFTER
    dur = round((math.ceil(endT * FPS - 1e-6) + 1) / FPS, 4)   # последний кадр — ровно на endT (кадр 0 петли)
    D, Wt = np.concatenate(dry), np.concatenate(wet)
    N = int(round(dur * SR)); D = np.concatenate([D, np.zeros(max(0, N - len(D)), np.float32)])[:N]; Wt = np.concatenate([Wt, np.zeros(max(0, N - len(Wt)), np.float32)])[:N]

    # демон — на обработанном голосе, только «затянуться?»
    za, zb = mapw('A', wz)['a'] - .03, dragE + .02; ia, ib = int(za * SR), int(zb * SR)
    dm = demon(Wt[ia:ib], speech_rms(Wt) * 10 ** (-2.5 / 20)); L = ib - ia; tail_n = min(len(dm) - L, N - ib)
    Wt[ia:ib] = dm[:L]; Wt[ib:ib + tail_n] += dm[L:L + tail_n]   # хвост эха — в тишину перед концовкой
    pk = np.max(np.abs(Wt)); Wt = Wt / pk * .9; D = D / (np.max(np.abs(D)) or 1) * .9

    # таймлайн: слова → новое время; предложение 3 делится на «…звучала прямо:» и цитату (слова — из дубля Alex Bell, вид — из текста с «»)
    sent = []
    for i, s in enumerate(TA['sent']):
        if i == si3:
            W0 = [mapw('A', w) for w in s['words'][:j_my]]
            sent.append(dict(s, words=W0, a=W0[0]['a'] - .03, b=W0[-1]['b'] + .05, text=' '.join(w['d'] for w in W0)))
            WQ = [dict(mapw('Q', wq), d=wd['d'], c=wd['c']) for wd, wq in zip(s['words'][j_my:], TQ['sent'][0]['words'])]
            assert [nw(w['d']) for w in WQ] == [nw(w['d']) for w in TQ['sent'][0]['words']]
            sent.append(dict(s, words=WQ, a=WQ[0]['a'] - .03, b=WQ[-1]['b'] + .05, text=' '.join(w['d'] for w in WQ), v='quote'))
            continue
        W = [mapw('A', w) for w in s['words']]
        sent.append(dict(s, words=W, a=W[0]['a'] - .03, b=W[-1]['b'] + .05, text=' '.join(w['d'] for w in W)))
    for s in TE['sent']:
        W = [mapwE(w) for w in s['words']]
        sent.append(dict(s, words=W, a=W[0]['a'] - .03, b=W[-1]['b'] + .05, text=' '.join(w['d'] for w in W), v='end'))
    for i, s in enumerate(sent): s['i'] = i
    hop = SR // FPS; env = [float(np.sqrt(np.mean(Wt[k:k + hop] ** 2))) for k in range(0, len(Wt), hop)]; mx = max(env) or 1
    T = {'ep': 'v164a-ru', 'lang': 'ru', 'dur': dur, 'fps': FPS, 'voice': 'own', 'natural': True, 'sent': sent,
         'env': [round(min(1, e / mx * 1.8), 3) for e in env], 'dragE': dragE, 'b0': round(dragE + B0, 3), 'endT': round(endT, 3)}
    for ep in ('v164a-ru', 'v164b-ru'):
        o = OUT(ep); os.makedirs(o, exist_ok=True)
        sf.write(os.path.join(o, 'voice.wav'), Wt, SR); sf.write(os.path.join(o, 'voice.dry.wav'), D, SR)
        json.dump(dict(T, ep=ep), open(os.path.join(o, 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
    print(f'«затянуться?» кончается {dragE:.2f} с, доска {dragE + B0:.2f}, «Захотите» {sent[-2]["words"][0]["a"]:.2f}, «точно!» {sent[-1]["words"][-1]["b"]:.2f}, '
          f'конец {endT:.2f} с, длина {dur} с ({int(round(dur * FPS))} кадров)')
    for s in sent: print(f'{s["i"]:02d} {s["scene"]:6s} {s["a"]:6.2f}–{s["b"]:6.2f} {s.get("v", ""):5s} {s["text"][:70]}')


if __name__ == '__main__':
    main()
