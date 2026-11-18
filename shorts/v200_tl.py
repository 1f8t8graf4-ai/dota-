#!/usr/bin/env python3
"""v20.0 (18.11): глава 3 «1924 · Мальборо» — один дубль Макса (voice/v200) → голос и таймлайны фильма и шортса.
  python3 v200_tl.py   → out/v200y-ru/{voice.wav,timeline.json}, out/v200s-ru/{voice.wav,timeline.json}, копии таймлайнов в tl/
Фильм (y): фразы 1–14. Пауза перед последним «Мальборо» — 0,5 с (в дубле 0,15), перед «Вот только» — на 0,2 с дольше.
  После голоса — 3,6 с финала: витрина → карточка 1924 → нить к закрытой карточке 2014.
Шортс (s): крючок — последняя фраза «Льда» без «Ведь» (stems/v191y-ru, уже записана), фразы 1–11, 13, 14 и вопрос
  «Без огня — значит, без вреда?», потом 1,7 с «Часть 4 →» и петля в кадр 0.
Резы — посреди настоящих пауз записи, склейки с наплывом 15 мс; добавленные паузы — шум самой записи, не цифровой ноль."""
import json, os, re, subprocess
import numpy as np, soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__)); SR = 44100
SRC = os.path.join(HERE, 'out', 'v200-ru')
XF = int(.015 * SR)


def load(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).astype(np.float64)


def quiet_spans(y, thr_db=-38, min_len=.08):
    """тишина по огибающей 10 мс: [(начало, конец), …] в секундах"""
    hop = int(.01 * SR); fr = np.sqrt(np.convolve(y ** 2, np.ones(hop) / hop, 'same')[::hop] + 1e-12)
    ref = np.max(fr); q = 20 * np.log10(fr / ref + 1e-12) < thr_db; out, s = [], None
    for k, v in enumerate(q):
        if v and s is None: s = k
        if not v and s is not None:
            if (k - s) * .01 >= min_len: out.append((s * .01, k * .01))
            s = None
    return out


def cut_between(Q, b, a):
    """точка реза между концом слова b и началом следующего a: середина тишины, которая лежит между ними"""
    best = None
    for s0, s1 in Q:
        lo, hi = max(s0, b - .25), min(s1, a + .05)
        if hi - lo > .03 and (best is None or hi - lo > best[1] - best[0]): best = (lo, hi)
    return (best[0] + best[1]) / 2 if best else (b + a) / 2


class Track:
    """склейка кусков записи; время каждого слова переносится вместе с куском"""
    def __init__(self):
        self.y = np.zeros(0); self.sent = []

    def t(self):
        return len(self.y) / SR

    def add(self, y, t0, t1, sents):
        seg = y[int(t0 * SR):int(t1 * SR)].copy(); off = self.t() - t0
        if len(self.y) >= XF and len(seg) >= XF:   # наплыв равной мощности 15 мс
            k = np.linspace(0, np.pi / 2, XF); self.y[-XF:] = self.y[-XF:] * np.cos(k) + seg[:XF] * np.sin(k); seg = seg[XF:]; off -= XF / SR
        self.y = np.concatenate([self.y, seg])
        for s in sents:
            W = [dict(w, a=round(w['a'] + off, 3), b=round(w['b'] + off, 3)) for w in s['words'] if t0 - .01 <= w['a'] < t1]
            if not W: continue
            if self.sent and self.sent[-1]['scene'] == s['scene']: self.sent[-1]['words'] += W
            else: self.sent.append({'scene': s['scene'], 'text': s['text'], 'words': W})

    def pad(self, room, d):
        """пауза длиной d из шума записи (кусок room повторяется с наплывами)"""
        out = np.zeros(0)
        while len(out) < d * SR + XF:
            r = room.copy()
            if len(out) >= XF:
                k = np.linspace(0, np.pi / 2, XF); out[-XF:] = out[-XF:] * np.cos(k) + r[:XF] * np.sin(k); r = r[XF:]
            out = np.concatenate([out, r])
        out = out[:int(d * SR)]
        if len(self.y) >= XF:
            k = np.linspace(0, np.pi / 2, XF); self.y[-XF:] = self.y[-XF:] * np.cos(k) + out[:XF] * np.sin(k); out = out[XF:]
        self.y = np.concatenate([self.y, out])

    def silence(self, d):
        n = int(d * SR); f = min(len(self.y), int(.03 * SR))
        if f: self.y[-f:] *= np.linspace(1, 0, f)
        self.y = np.concatenate([self.y, np.zeros(n)])


def write(ep, tr, extra):
    o = os.path.join(HERE, 'out', ep); os.makedirs(o, exist_ok=True); y = tr.y
    sf.write(os.path.join(o, 'voice.wav'), (y / (np.max(np.abs(y)) or 1) * .9).astype(np.float32), SR)
    T = []
    for i, s in enumerate(tr.sent):
        W = s['words']; T.append({'i': i, 'scene': s['scene'], 'a': round(W[0]['a'] - .03, 3), 'b': round(W[-1]['b'] + .05, 3), 'q': 1, 'text': s['text'], 'words': W})
    hop = SR // 30; env = [float(np.sqrt(np.mean(y[k:k + hop] ** 2))) for k in range(0, len(y), hop)]; mx = max(env) or 1
    tl = {'ep': ep, 'lang': 'ru', 'dur': round(len(y) / SR, 3), 'fps': 30, 'voice': 'own', 'natural': True, 'sent': T,
          'env': [round(min(1, e / mx * 1.8), 3) for e in env], **extra}
    for p in (os.path.join(o, 'timeline.json'), os.path.join(HERE, 'tl', ep + '.json')): json.dump(tl, open(p, 'w'), ensure_ascii=False, indent=1)
    n = sum(len(s['words']) for s in T); print(f"{ep}: {tl['dur']:.2f} с, фраз {len(T)}, слов {n}, {extra}")
    for s in T: print(f"  {s['scene']:5s} {s['a']:6.2f}–{s['b']:6.2f} {s['text'][:58]}")


def main():
    tl = json.load(open(os.path.join(SRC, 'timeline.json'))); y = load(os.path.join(SRC, 'voice.wav')); S = tl['sent']
    Q = quiet_spans(y); by = {s['scene']: s for s in S}
    first = lambda sc: by[sc]['words'][0]['a']; last = lambda sc: by[sc]['words'][-1]['b']
    order = [s['scene'] for s in S]
    cut = {}   # точка реза после фразы
    for a, b in zip(order, order[1:]): cut[a] = cut_between(Q, last(a), first(b))
    cut[order[-1]] = min(len(y) / SR, last(order[-1]) + .35)
    w14 = by['s14']['words']; k = next(j for j, w in enumerate(w14) if 'Мальборо' in w['d'])
    mid14 = cut_between(Q, w14[k - 1]['b'], w14[k]['a'])   # пауза «назывались… | «Мальборо»»
    cand = [q for q in Q if q[1] - q[0] >= .2 and q[1] < first('q') and q[0] > first('s1')]   # самая тихая пауза записи — её шум для вставок
    rms = lambda q: float(np.sqrt(np.mean(y[int((q[0] + .03) * SR):int((q[1] - .03) * SR)] ** 2)))
    rs = min(cand, key=rms); room = y[int((rs[0] + .03) * SR):int((rs[1] - .03) * SR)]; print('шум для пауз:', rs, f'{20 * np.log10(rms(rs) + 1e-12):.1f} dBFS')
    start = max(0, first('s1') - .12)

    def body(tr, scenes, gap8=.2, gap14=.35):
        prev = None; t0 = start if scenes[0] == 's1' else None
        for sc in scenes:
            a = t0 if t0 is not None else cut[order[order.index(sc) - 1]]; t0 = None
            if sc == 's9' and prev == 's8': tr.pad(room, gap8)
            if sc == 's14':
                tr.add(y, a, mid14, S); tr.pad(room, gap14); tr.add(y, mid14, cut[sc], S)
            else: tr.add(y, a, cut[sc], S)
            prev = sc

    # ---- фильм ----
    F = Track(); body(F, order[:14]); vend = F.t(); F.silence(3.6)
    write('v200y-ru', F, {'vEnd': round(vend, 3), 'b0': round(vend - .1, 3)})
    # ---- шортс ----
    hs = json.load(open(os.path.join(HERE, 'tl', 'v191y-ru.json')))['sent'][-1]; hw = [w for w in hs['words'] if w['d'] != 'Ведь']
    hy = load(os.path.join(HERE, 'stems', 'v191y-ru', 'voice.flac')); ha, hb = hw[0]['a'] - .06, hw[-1]['b'] + .22
    hook = {'scene': 'hook', 'text': re.sub(r'^Ведь главный', 'Главный', hs['text']), 'words': [dict(w, d=('Главный' if w['d'] == 'главный' else w['d'])) for w in hw]}
    Sh = Track(); Sh.add(hy, ha, hb, [hook]); Sh.pad(room, .3)
    body(Sh, ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11'])
    Sh.add(y, cut['s12'], cut['s13'], S); Sh.add(y, cut['s13'], mid14, S); Sh.pad(room, .35); Sh.add(y, mid14, cut['s14'], S)
    Sh.pad(room, .25); Sh.add(y, cut['s14'], cut['q'], S); qend = Sh.t(); Sh.silence(1.7)
    write('v200s-ru', Sh, {'vEnd': round(qend, 3), 'b0': round(qend - .1, 3), 'hookEnd': round(hb - ha, 3)})


if __name__ == '__main__':
    main()
