#!/usr/bin/env python3
"""21.11: озвучка глав на английском и немецком (ElevenLabs) и таймлайн под новый голос.
Картинка глав привязана к времени русских слов (Ws('s3', 'табак'), Wd('губу') …) — кадры не растягиваем, а переносим время
каждого русского слова на слова перевода: начало и конец фразы — точно, пары слов из l10n/anchors.py — точно, остальные слова —
по доле текста между соседними парами. События, камера и звуки по событиям сами встают под новый голос, движение не замедляется.
Паузы между фразами — как в русском ролике, паузы — шум самой записи.
  python3 l10n/dub.py rec <глава 1–5> <en|de>   записать голос главы (платно, один раз — готовое не перезаписывает) → voice/<язык>/ch<N>.*
  python3 l10n/dub.py fix <глава> <язык> <фраза…>  дозаписать фразы, текст которых поправлен (платно; заменяют фразы основной записи)
  python3 l10n/dub.py check <глава> <язык>      распознать запись (Vosk) и сравнить с текстом: пропущенные и лишние слова
  python3 l10n/dub.py pairs <ролик> <язык>      фразы RU ↔ перевод по словам; ★ — слово, на которое завязана картинка (для anchors.py)
  python3 l10n/dub.py tl <ролик> <язык>         голос и таймлайн → out/<ролик>-<язык>-vo/{voice.wav,timeline.json}, tl/<ролик>-<язык>-vo.json
  python3 l10n/dub.py render <ролик> <язык>     рендер кусками по 12 с, звуки по событиям, звук → out/<ролик>-<язык>-vo/final.mp4
Ролик — как у русского: v170e v170a (глава 1), v191y v191s (2), v200y v200s (3), v210y v210s (4), v220y v220s (5 и финал)."""
import base64, glob, json, os, re, subprocess, sys
import numpy as np, requests, soundfile as sf
L = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(L)
sys.path.insert(0, L); sys.path.insert(0, ROOT)
import data, data45
import v200_tl as V

API = 'https://api.elevenlabs.io'; H = {'xi-api-key': 'proxy-injected'}   # ключ подставляет прокси окружения
VOICE = {'en': 'lWDDHwXsJXJM7nv2YgHY',   # Nathan — Natural Narrator (Андрей, 21.11: «англ 100%»)
         'de': 'kkJxCnlRCckmfFvzDW5Q'}  # Alexander — пробник №3 (Андрей, 22.11: «немецкий беру 3»); записывать — только после его «да» с суммой
MODEL = 'eleven_v4'; VSET = {'stability': .4, 'similarity_boost': .75, 'style': .25, 'speed': 1.0}   # как у Макса
CH = {1: ['v170e', 'v170a'], 2: ['v191y', 'v191s'], 3: ['v200y', 'v200s'], 4: ['v210y', 'v210s'], 5: ['v220y', 'v220s']}
CH_OF = {ep: c for c, eps in CH.items() for ep in eps}
LI = {'en': 0, 'de': 1}
SR = V.SR; XF = V.XF
EXTRA = {data45.CH3_Q[0]: data45.CH3_Q[1]}   # вопрос шортса главы 3 (новая концовка)
SKIP = {}   # глава → ключи фраз, которых больше нет в ролике (не записываем)
ADD = {3: [data45.CH3_Q[0]]}   # глава → русские фразы, которых ещё нет в русском таймлайне (глава 3: вопрос шортса новой концовки)
def _ch3_skip():   # глава 3, новая концовка (ТЗ 21.11): строк 13–14 (нагреватель, стики) и вопроса «Без огня…» больше нет
    T = json.load(open(os.path.join(ROOT, 'tl', 'v200s-ru.json')))
    return {s['text'] for s in T['sent'] if s['scene'] in ('s13', 's14', 'q')}
SOUND = {5: 'v220_sound.py', 4: 'v210_sound.py', 3: 'v200_sound.py'}
# главы 1–2 написаны до «всё от слов»: у них ключи камеры и события и по абсолютному времени (KY(1.7…), KO2(9.0…)) — переносить
# время слов мало. Там картинка рендерится в русском времени, а время каждого кадра — плавная кривая по парам слов (WARP)
WARP = {1, 2}


def pchip(x, y):   # монотонная кубическая (Фритч — Карлсон): скорость картинки меняется плавно
    x, y = np.asarray(x, float), np.asarray(y, float); h = np.diff(x); d = np.diff(y) / h; m = np.zeros_like(y)
    m[0], m[-1] = d[0], d[-1]
    for k in range(1, len(x) - 1):
        if d[k - 1] * d[k] > 0:
            w1, w2 = 2 * h[k] + h[k - 1], h[k] + 2 * h[k - 1]; m[k] = (w1 + w2) / (w1 / d[k - 1] + w2 / d[k])
    def f(t):
        t = np.asarray(t, float); k = np.clip(np.searchsorted(x, t) - 1, 0, len(x) - 2); hk = h[k]; u = (t - x[k]) / hk
        r = (2 * u ** 3 - 3 * u ** 2 + 1) * y[k] + (u ** 3 - 2 * u ** 2 + u) * hk * m[k] + (-2 * u ** 3 + 3 * u ** 2) * y[k + 1] + (u ** 3 - u ** 2) * hk * m[k + 1]
        return np.where(t < x[0], y[0] + (t - x[0]) * m[0], np.where(t > x[-1], y[-1] + (t - x[-1]) * m[-1], r))
    return f
BUNDLE = {'v210': 'ep/v210/00-core.js ep/v200/05-kit.js ep/v200/12-cam.js ep/v200/15-props.js ep/v210/[1-9]*.js',
          'v220': 'ep/v220/00-core.js ep/v200/05-kit.js ep/v200/12-cam.js ep/v200/15-props.js ep/v220/[1-9]*.js'}


def tl_ru(ep): return json.load(open(os.path.join(ROOT, 'tl', ep + '-ru.json')))
def key_of(ch, s): return s['text'] if ch <= 3 else s['scene']
def clean(t): return re.sub(r'\s+', ' ', t.replace('|', ' ')).strip()


def tr_of(ch, s):
    if ch <= 3: return data.SENT.get(s['text']) or EXTRA.get(s['text'])
    if ch == 4: return data45.CH4.get(s['scene'])
    return data45.CH5.get(s['scene']) or data45.FIN.get(s['scene'])


def items(ch, lang):
    seen, out = set(), []
    for ep in CH[ch]:
        for s in tl_ru(ep)['sent']:
            k = key_of(ch, s)
            if k in seen or k in SKIP.get(ch, ()) or (ch == 3 and k in _ch3_skip()): continue
            t = tr_of(ch, s)
            if not t: raise SystemExit(f'нет перевода фразы {ep} {s.get("scene")}: {s["text"]}')
            seen.add(k); out.append({'key': k, 'scene': s.get('scene'), 'text': clean(t[LI[lang]])})
    for k in ADD.get(ch, []):
        if k not in seen: seen.add(k); out.append({'key': k, 'scene': None, 'text': clean(EXTRA[k][LI[lang]])})
    return out


def base(ch, lang): return os.path.join(ROOT, 'voice', lang, f'ch{ch}')


def rec(ch, lang):
    b = base(ch, lang); os.makedirs(os.path.dirname(b), exist_ok=True)
    if os.path.exists(b + '.json'): print('уже записано:', b); return
    it = items(ch, lang); text = ''
    for x in it:
        if text: text += '\n\n'
        x['off'] = len(text); text += x['text']; x['len'] = len(x['text'])
    body = {'text': text, 'model_id': MODEL, 'language_code': lang, 'voice_settings': VSET}
    print(f'глава {ch}, {lang}: фраз {len(it)}, знаков {len(text)} — пишу…')
    r = requests.post(f'{API}/v1/text-to-speech/{VOICE[lang]}/with-timestamps?output_format=mp3_44100_128', headers=H, json=body, timeout=1200)
    if r.status_code != 200: raise SystemExit(f'ElevenLabs {r.status_code}: {r.text[:400]}')
    j = r.json(); open(b + '.mp3', 'wb').write(base64.b64decode(j['audio_base64']))
    json.dump(j['alignment'], open(b + '.align.json', 'w'), ensure_ascii=False)
    json.dump({'voice': VOICE[lang], 'model': MODEL, 'settings': VSET, 'text': text, 'items': it}, open(b + '.json', 'w'), ensure_ascii=False, indent=1)
    print('записано:', b + '.mp3')


def rec_fix(ch, lang, keys):
    """дозапись отдельных фраз главы (текст поправлен в data/data45) → voice/<язык>/ch<N>.fix<k>.*; в таймлайне они заменяют фразы основной записи"""
    b = base(ch, lang); k = 1
    while os.path.exists(f'{b}.fix{k}.json'): k += 1
    it = [x for x in items(ch, lang) if x['scene'] in keys or any(x['key'].startswith(k) for k in keys)]   # фраза — по сцене (главы 4–5) или по началу русского текста (1–3)
    if not it: raise SystemExit('нет таких фраз: ' + ', '.join(keys))
    text = ''
    for x in it:
        if text: text += '\n\n'
        x['off'] = len(text); text += x['text']; x['len'] = len(x['text'])
    body = {'text': text, 'model_id': MODEL, 'language_code': lang, 'voice_settings': VSET}
    r = requests.post(f'{API}/v1/text-to-speech/{VOICE[lang]}/with-timestamps?output_format=mp3_44100_128', headers=H, json=body, timeout=1200)
    if r.status_code != 200: raise SystemExit(f'ElevenLabs {r.status_code}: {r.text[:400]}')
    j = r.json(); f = f'{b}.fix{k}'; open(f + '.mp3', 'wb').write(base64.b64decode(j['audio_base64']))
    json.dump(j['alignment'], open(f + '.align.json', 'w'), ensure_ascii=False)
    json.dump({'voice': VOICE[lang], 'model': MODEL, 'settings': VSET, 'text': text, 'items': it}, open(f + '.json', 'w'), ensure_ascii=False, indent=1)
    print('дозаписано:', f + '.mp3', '·', len(text), 'знаков')


def rec_load(ch, lang):
    b = base(ch, lang); y, Q, by, order = rec_load1(b)
    k = 1
    while os.path.exists(f'{b}.fix{k}.json'):   # дозаписи — поверх
        y2, Q2, by2, _ = rec_load1(f'{b}.fix{k}'); by.update(by2); k += 1
    return y, Q, by, order


def rec_load1(b):
    meta = json.load(open(b + '.json')); al = json.load(open(b + '.align.json'))
    C, A, B = al['characters'], al['character_start_times_seconds'], al['character_end_times_seconds']
    if ''.join(C) != meta['text']: raise SystemExit('время букв не совпадает с текстом записи')
    by, order = {}, []
    for x in meta['items']:
        W = []
        for m in re.finditer(r'\S+', x['text']):
            k0, k1 = x['off'] + m.start(), x['off'] + m.end(); al_ = [k for k in range(k0, k1) if C[k].isalnum()]
            if al_: W.append({'w': m.group(), 'a': A[al_[0]], 'b': B[al_[-1]]})
        by[x['key']] = {'text': x['text'], 'words': W}; order.append(x['key'])
    y = V.load(b + '.mp3'); Q = V.quiet_spans(y)
    for i, k in enumerate(order):   # резы посреди тишины записи между фразами
        W = by[k]['words']; pb = by[order[i - 1]]['words'][-1]['b'] if i else 0; na = by[order[i + 1]]['words'][0]['a'] if i + 1 < len(order) else len(y) / SR
        by[k]['c0'] = V.cut_between(Q, pb, W[0]['a']) if i else max(0, W[0]['a'] - .12)
        by[k]['c1'] = V.cut_between(Q, W[-1]['b'], na) if i + 1 < len(order) else min(len(y) / SR, W[-1]['b'] + .35)
        by[k]['y'] = y
    return y, Q, by, order


# ---------- слова: русские ↔ перевод ----------
def norm(w): return re.sub(r"[^\w'’-]", '', w.lower().replace('ё', 'е'), flags=re.U).strip("-'’")


def find(seq, tok, i0, where):   # короткое слово (до 3 букв) — целиком, длинное — по началу
    t = norm(tok)
    for k in range(i0, len(seq)):
        x = norm(seq[k])
        if x == t or (len(t) >= 4 and x.startswith(t)): return k
    raise SystemExit(f'{where}: нет слова «{tok}» после №{i0}: {" ".join(seq)}')


def akey(ch, s): return s['scene'] if ch >= 4 else ' '.join([x for x in (norm(w) for w in s['text'].split()) if x][:3])


def anchors(lang, bun, scene, ru, tg):
    """пары (№ русского слова, № слова перевода): начало фразы, пары из anchors.py, конец фразы.
    Русские — строго по порядку, слова перевода — не назад (два русских слова могут встать на одно: «Через два» = «Two»)."""
    import anchors as AN
    spec = AN.A.get(lang, {}).get(bun, {}).get(scene, '')
    P = [(0, 0)]; i = j = 0; where = f'{bun} {scene}'
    for p in spec.split():
        r, t = p.split('=')
        i = find([w['d'] for w in ru], r, i, where + ' RU'); j = find([w['w'] for w in tg], t, j, where + ' ' + lang)
        if i == 0 and len(P) == 1: P[0] = (0, j)
        elif i > P[-1][0] and j >= P[-1][1]: P.append((i, j))
        else: print(f'  {where}: пара {p} не по порядку — пропущена')
        i += 1
    auto = P[-1][0] < len(ru) - 1
    if auto: P.append((len(ru) - 1, len(tg) - 1))
    return P, auto


def remap(ru, tg, P, auto=False):
    """время русских слов по словам перевода (время перевода — в секундах записи): пары P точно, остальное — по доле текста;
    auto — последняя пара добавлена сама: у последнего русского слова точно только конец (конец фразы)"""
    def cum(ws, f):
        pos, x = [], 0
        for w in ws: n = max(1, len(norm(f(w)))); pos.append((x, x + n)); x += n + 1
        return pos
    rp, tp = cum(ru, lambda w: w['d']), cum(tg, lambda w: w['w'])
    xs, ys = [], []
    for k, w in enumerate(tg): xs += [tp[k][0], tp[k][1]]; ys += [w['a'], w['b']]
    T = lambda p: float(np.interp(p, xs, ys))
    out = [None] * len(ru)
    for (r0, t0), (r1, t1) in zip(P, P[1:]):
        last = r1 == len(ru) - 1
        R0, R1 = rp[r0][0], (rp[r1][1] if last else rp[r1][0]); G0, G1 = tp[t0][0], (tp[t1][1] if last else tp[t1][0])
        for i in range(r0, r1 + (1 if last else 0)):
            u0, u1 = (rp[i][0] - R0) / max(1, R1 - R0), (rp[i][1] - R0) / max(1, R1 - R0)
            out[i] = [T(G0 + u0 * (G1 - G0)), T(G0 + u1 * (G1 - G0))]
    if len(P) == 1: out = [[tg[0]['a'], tg[-1]['b']]]
    for n, (i, j) in enumerate(P):
        if auto and n == len(P) - 1: out[i][1] = tg[j]['b']
        else: out[i] = [tg[j]['a'], tg[j]['b']]
    for k in range(len(out)):
        if k and out[k][0] < out[k - 1][0] + .02: out[k][0] = out[k - 1][0] + .02   # строго по порядку: одинаковое время у двух ключей камеры — деление на ноль
        out[k][1] = max(out[k][1], out[k][0] + .04)
    return out


def used_words(bun):
    fs = sorted(glob.glob(os.path.join(ROOT, 'ep', bun, '*.js'))) or [os.path.join(ROOT, 'ep', bun + '.js')]
    src = ''.join(open(f).read() for f in fs).lower()
    return set(norm(x) for x in re.findall(r"'([а-яё«»\-]+)'", src))


def pairs(ep, lang):
    ch = CH_OF[ep]; bun = ep[:4]; y, Q, by, order = rec_load(ch, lang); U = used_words(bun)
    import anchors as AN
    for s in tl_ru(ep)['sent']:
        x = by[key_of(ch, s)]
        print(f"\n[{akey(ch, s)}] " + ' '.join(('★' if norm(w['d']) in U else '') + w['d'] for w in s['words']))
        print('      ' + ' '.join(w['w'] for w in x['words']))
        sp = AN.A.get(lang, {}).get(bun, {}).get(akey(ch, s))
        if sp: print('      пары:', sp)


# ---------- таймлайн ----------
class Track(V.Track):
    def put(self, y, t0, t1):
        """кусок записи [t0, t1) в конец дорожки; вернуть сдвиг «время записи → время ролика»"""
        seg = y[int(t0 * SR):int(t1 * SR)].copy(); off = self.t() - t0
        if len(self.y) >= XF and len(seg) >= XF:
            k = np.linspace(0, np.pi / 2, XF); self.y[-XF:] = self.y[-XF:] * np.cos(k) + seg[:XF] * np.sin(k); seg = seg[XF:]; off -= XF / SR
        self.y = np.concatenate([self.y, seg]); return off


def chunk_times(text, lang, words):
    from build import chunks
    out, p, ws = [], 0, [norm(w['w']) for w in words]
    for c in chunks(text, lang):
        cw = [norm(x) for x in c.split() if norm(x)]
        if not cw: continue
        k0 = None
        for x in cw:
            p = next((k for k in range(p, len(ws)) if ws[k] == x or ws[k].startswith(x) or x.startswith(ws[k])), None)
            if p is None: raise SystemExit(f'субтитр «{c}»: нет слова «{x}» в записи')
            k0 = p if k0 is None else k0; p += 1
        out.append({'a': words[k0]['a'], 's': c, 'b': words[p - 1]['b']})
    return out


def build(ep, lang):
    ch = CH_OF[ep]; bun = ep[:4]; T = tl_ru(ep); y, Q, by, order = rec_load(ch, lang)
    cand = [q for q in Q if q[1] - q[0] >= .14]
    rms = lambda q: float(np.sqrt(np.mean(y[int((q[0] + .03) * SR):int((q[1] - .03) * SR)] ** 2)))
    rs = min(cand, key=rms); room = y[int((rs[0] + .03) * SR):int((rs[1] - .03) * SR)]
    tr = Track(); S2, subs, prev_out, prev_ru, prev_la, prev_rla, PP = [], [], 0.0, 0.0, 0.0, 0.0, []
    for i, s in enumerate(T['sent']):
        x = by[key_of(ch, s)]; W = x['words']; ru = s['words']
        # начало фразы — не раньше трёх отметок (как в русском ролике): пауза после прошлой фразы; время от начала её последнего слова
        # (в коде ключи камеры от последнего слова фразы); конец фразы — не раньше, чем в русском от конца прошлой (цепочки в коде от конца фразы)
        dur_en = W[-1]['b'] - W[0]['a']
        want = ru[0]['a'] if not i else prev_out + (ru[0]['a'] - prev_ru) if ch in WARP else max(prev_out + (ru[0]['a'] - prev_ru),
                                            prev_la + (ru[0]['a'] - prev_rla), prev_out + (ru[-1]['b'] - prev_ru) - dur_en)
        c0, c1 = x['c0'], x['c1']; lead = W[0]['a'] - c0
        if want - lead < tr.t(): c0 = min(W[0]['a'] - .03, c0 + (tr.t() - (want - lead))); lead = W[0]['a'] - c0
        pad = want - lead - tr.t()
        if pad > .03: tr.pad(room, pad)   # меньше 30 мс — без паузы (наплыв склейки 15 мс)
        off = tr.put(x['y'], c0, c1)
        P, auto = anchors(lang, bun, akey(ch, s), ru, W); M = remap(ru, W, P, auto); PP.append((P, W[0]['a'] + off, W[-1]['b'] + off))
        nw = [dict(w, a=round(m[0] + off, 3), b=round(m[1] + off, 3)) for w, m in zip(ru, M)]
        S2.append({'i': i, 'scene': s['scene'], 'a': round(nw[0]['a'] - .03, 3), 'b': round(nw[-1]['b'] + .05, 3), 'q': 1, 'text': s['text'], 'words': nw})
        subs += [dict(c, a=round(c['a'] + off, 3), b=round(c['b'] + off, 3)) for c in chunk_times(x['text'], lang, W)]
        prev_out, prev_ru, prev_la, prev_rla = W[-1]['b'] + off, ru[-1]['b'], nw[-1]['a'], ru[-1]['a']
    tail = T['dur'] - prev_ru; tr.silence(tail)
    for a, b in zip(subs, subs[1:]): a['b'] = round(min(a['b'], b['a'] - .02), 3)
    # время из таймлайна (конец голоса, начало финала, доска …) — по словам: русское время → новое
    ra = [0.0] + [w[k] for s in T['sent'] for w in s['words'] for k in ('a', 'b')] + [T['dur']]
    na = [0.0] + [w[k] for s in S2 for w in s['words'] for k in ('a', 'b')] + [tr.t()]
    keep = {k: round(float(np.interp(v, ra, na)), 3) for k, v in T.items() if k not in ('dur', 'fps') and isinstance(v, (int, float)) and not isinstance(v, bool)}
    o = os.path.join(ROOT, 'out', f'{ep}-{lang}-vo'); os.makedirs(o, exist_ok=True); yy = tr.y
    sf.write(os.path.join(o, 'voice.wav'), (yy / (np.max(np.abs(yy)) or 1) * .9).astype(np.float32), SR)
    hop = SR // 30; env = [float(np.sqrt(np.mean(yy[k:k + hop] ** 2))) for k in range(0, len(yy), hop)]; mx = max(env) or 1
    tl = dict(T, ep=f'{ep}-{lang}', lang=lang, dur=round(len(yy) / SR, 3), sent=S2, subs=subs, env=[round(min(1, e / mx * 1.8), 3) for e in env], **keep)
    if ch in WARP:   # картинка в русском времени: кривая «время ролика → русское время» по парам слов, субтитры — туда же
        K = [(0.0, 0.0)]
        for s, s2, (P, e0, e1) in zip(T['sent'], S2, PP):   # фраза: от первого до последнего английского слова = от первого до последнего русского;
            k0 = [(e0, s['words'][0]['a'])]                    # пары внутри — не чаще одной на 1,2 с (иначе скорость картинки скачет)
            for i, j in P[1:]:
                if s2['words'][i]['a'] - k0[-1][0] >= 1.2 and e1 - s2['words'][i]['a'] >= .8: k0.append((s2['words'][i]['a'], s['words'][i]['a']))
            K += k0 + [(e1, s['words'][-1]['b'])]
        K.append((len(yy) / SR, T['dur'])); K.sort(); K2 = [K[0]]
        for k in K[1:]:
            if k[0] > K2[-1][0] + .05 and k[1] > K2[-1][1] + .02: K2.append(k)
        # скорость картинки по парам рвётся (слова разной длины) — сглаживаю её окном ~0,5 с и интегрирую обратно: кривая монотонная,
        # у пар — отклонение в доли секунды (печатается), скорость меняется плавно
        D = len(yy) / SR; dt = 1 / 120; g = np.arange(0, D + dt, dt); raw = np.interp(g, [k[0] for k in K2], [k[1] for k in K2])
        v = np.diff(raw) / dt; sg = int(.4 / dt); ker = np.exp(-.5 * (np.arange(-3 * sg, 3 * sg + 1) / sg) ** 2); ker /= ker.sum()
        vs = np.convolve(np.pad(v, 3 * sg, mode='edge'), ker, 'valid'); sm = np.concatenate([[0], np.cumsum(vs) * dt])
        sm += (raw[-1] - sm[-1]) * g / g[-1]
        f = lambda t: np.interp(t, g, sm); to = np.arange(int(np.ceil(D * 30))) / 30; ts = f(to); sp = np.diff(ts) * 30
        err = max(abs(float(f(k[0])) - k[1]) for k in K2)
        print(f'  кадры по русскому времени: пар {len(K2)}, скорость картинки {sp.min():.2f}…{sp.max():.2f}, отклонение у пар до {err:.2f} с')
        json.dump([round(float(x), 4) for x in ts], open(os.path.join(o, 'tmap.json'), 'w'))
        tl = dict(T, ep=f'{ep}-{lang}', lang=lang, subs=[dict(c, a=round(float(f(c['a'])), 3), b=round(float(f(c['b'])), 3)) for c in subs], vo_dur=tl['dur'], warp=1)
    for p in (os.path.join(o, 'timeline.json'), os.path.join(ROOT, 'tl', f'{ep}-{lang}-vo.json')): json.dump(tl, open(p, 'w'), ensure_ascii=False, indent=1)
    print(f"{ep}-{lang}-vo: {tl['dur']:.2f} с (русский {T['dur']:.2f}), фраз {len(S2)}, субтитров {len(subs)}, {keep}")


def render(ep, lang):
    bun = ep[:4]; name = f'{ep}-{lang}-vo'; o = os.path.join(ROOT, 'out', name); d = os.path.join(o, 'parts'); os.makedirs(d, exist_ok=True)
    if bun in ('v191', 'v200'): subprocess.run(f'cat ep/{bun}/*.js > ep/{bun}.js && node -e "new Function(require(\'fs\').readFileSync(\'ep/{bun}.js\',\'utf8\'))"', shell=True, cwd=ROOT, check=True)
    if bun in BUNDLE:
        tmp = os.path.join(ROOT, 'ep', bun + '.js.tmp')
        subprocess.run(f'cat {BUNDLE[bun]} > {tmp} && node -e "new Function(require(\'fs\').readFileSync(\'{tmp}\',\'utf8\'))" && mv {tmp} ep/{bun}.js', shell=True, cwd=ROOT, check=True)
    T = json.load(open(os.path.join(o, 'timeline.json'))); dur = np.ceil(T.get('vo_dur', T['dur']) * 30) / 30; n = int(np.ceil(dur / 12))
    env = dict(os.environ); env.setdefault('NODE_PATH', subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True).stdout.strip())
    TM = json.load(open(os.path.join(o, 'tmap.json'))) if T.get('warp') else None
    for k in range(n):
        if os.path.exists(os.path.join(d, f'p{k}.done')): continue
        a, b = k * 12, min((k + 1) * 12, dur); e2 = dict(env, OUTF=f'parts/p{k}.mp4')
        if TM: f = os.path.join(d, f'tmap{k}.json'); json.dump(TM[k * 360:(k + 1) * 360], open(f, 'w')); e2['TMAP'] = f
        else: e2['RANGE'] = f'{a}-{b}'
        subprocess.run(['node', 'capture.mjs', name, 'video', '30', '3'], cwd=ROOT, env=e2, check=True)
        open(os.path.join(d, f'p{k}.done'), 'w').close()
    open(os.path.join(d, 'list.txt'), 'w').write(''.join(f"file 'p{k}.mp4'\n" for k in range(n)))
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', os.path.join(d, 'list.txt'), '-c', 'copy', os.path.join(o, 'video.mp4')], check=True)
    subprocess.run(['node', 'capture.mjs', name, 'cues', '1'], cwd=ROOT, env=env, check=True)
    if TM:   # звуки по событиям — из русского времени во время ролика
        cf = os.path.join(o, 'cues.json'); C = json.load(open(cf)); src = np.array(TM); outt = np.arange(len(TM)) / 30
        json.dump([[round(float(np.interp(c[0], src, outt)), 3)] + c[1:] for c in C if c[0] <= src[-1]], open(cf, 'w'))
    if CH_OF[ep] in SOUND: subprocess.run(['python3', SOUND[CH_OF[ep]], name], cwd=ROOT, check=True)
    else: sound(name, ep)


def sound(name, ep):
    """звук глав 1–2 (у русских — сведение с треком Кашалота у Андрея): голос + звуки по событиям + подложка «Льда»
    (тот же грув Кашалота, из неё собраны главы 3–5) — как v210_sound.py, тактов сколько нужно"""
    import mix193 as M, v165_sound as VS, tt_audio, v210_sound as V2
    from v180_sound import sfx_track
    o = os.path.join(ROOT, 'out', name); od = os.path.join(o, 'snd'); os.makedirs(od, exist_ok=True); sh = ep[4] in 'as'
    T = json.load(open(os.path.join(o, 'timeline.json'))); dur = np.ceil(T.get('vo_dur', T['dur']) * 30) / 30; n = int(round(dur * M.SR)); voice = os.path.join(o, 'voice.wav')
    sw = os.path.join(od, 'sfx.wav'); VS.wav(sfx_track(json.load(open(os.path.join(o, 'cues.json'))), dur), sw)
    tail = .25 if sh else 1.4; seq = list(range(40))
    while len(seq) < int(np.ceil(dur / M.BAR)) + 1: seq += list(range(20, 40))
    b = V2.bed_from(V2.old_bed(), dur, tail, seq)
    tmp = os.path.join(od, 'bed_raw.wav'); VS.wav(b, tmp); Lv, _ = tt_audio._lufs(voice); Lm, _ = tt_audio._lufs(tmp); os.remove(tmp)
    env, sp, last = M.duck(voice, n); b = b * 10 ** ((Lv - 5.5 - Lm) / 20) * env
    if not sh: b *= 10 ** (4 * np.clip((np.arange(n) / M.SR - last) / .5, 0, 1) / 20)[:, None]
    else: import loopfix; b = loopfix.fix_start(b, M.dec(voice), M.SR)   # v23.6: шортс — без «удара» музыки до первого слова (петля)
    bw = os.path.join(od, 'bed.wav'); VS.wav(b, bw); M.final(voice, sw, bw, os.path.join(od, 'mix.wav'), dur)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', os.path.join(o, 'video.mp4'), '-i', os.path.join(od, 'mix.wav'), '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac',
                    '-b:a', '192k', '-t', f'{dur:.4f}', '-movflags', '+faststart', os.path.join(o, 'final.mp4')], check=True)
    print('готово:', os.path.join(o, 'final.mp4'))


if __name__ == '__main__':
    cmd, a, lang = sys.argv[1], sys.argv[2], sys.argv[3]
    if cmd == 'rec': rec(int(a), lang)
    elif cmd == 'pairs': pairs(a, lang)
    elif cmd == 'tl': build(a, lang)
    elif cmd == 'render': render(a, lang)
    elif cmd == 'fix': rec_fix(int(a), lang, sys.argv[4:])
    elif cmd == 'check':
        import dub_check; dub_check.run(base(int(a), lang), lang)
