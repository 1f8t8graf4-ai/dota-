#!/usr/bin/env python3
"""24.11: субтитры фильма для YouTube (.srt) — в 16:9 вшитых субтитров нет (ТЗ Андрея).
Реплики глав из out/<глава>/timeline.json (слова со временем голоса), начала глав — из out/film-<язык>/film.json.
Подпись — до 84 знаков, не больше двух строк по 42, режем по словам (лучше — после знака препинания).
  python3 film_srt.py ru  → out/film-ru/film.srt"""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__)); MAXC, LINE = 84, 42


def ts(t): t = max(0, t); h, m, s = int(t // 3600), int(t % 3600 // 60), t % 60; return f'{h:02d}:{m:02d}:{int(s):02d},{int(round((s - int(s)) * 1000)) % 1000:03d}'


def lines(txt):
    if len(txt) <= LINE: return txt
    w = txt.split(); best = None
    for i in range(1, len(w)):
        a, b = ' '.join(w[:i]), ' '.join(w[i:]); sc = max(len(a), len(b))
        if best is None or sc < best[0]: best = (sc, a + '\n' + b)
    return best[1]


def chunks(words):
    out, cur = [], []
    for k, w in enumerate(words):
        cur.append(w); txt = ' '.join(x['d'] for x in cur); nxt = words[k + 1]['d'] if k + 1 < len(words) else None
        if nxt is None: out.append(cur); break
        full = len(txt + ' ' + nxt) > MAXC; punct = txt[-1] in ',.:;!?—»' and len(txt) > 30
        if full or (punct and len(txt) > 55): out.append(cur); cur = []
    return [c for c in out if c]


def dub_sents(ep, T):
    """24.11: у глав EN/DE в sent — русские слова (по ним встаёт картинка), текст озвучки — в subs (куски по 1–4 слова со временем
    голоса). Фразы озвучки собираются заново: текст — из записи (voice/<язык>/ch*.json, со знаками препинания), время — из subs;
    у глав 1–2 (warp) время subs — русское, в время ролика переводит обратный tmap.json."""
    import numpy as np
    sys.path.insert(0, os.path.join(HERE, 'l10n')); import dub; from build import chunks as cks
    lang = T['lang']; base = ep[:-len('-' + lang + '-vo')]; ch = dub.CH_OF[base]; R = dub.tl_ru(base); _, _, by, _ = dub.rec_load(ch, lang)
    sub = T['subs']; k = 0; out = []
    if T.get('warp'):
        tm = np.maximum.accumulate(np.array(json.load(open(os.path.join(HERE, 'out', ep, 'tmap.json')))))
        back = lambda t: float(np.interp(t, tm, np.arange(len(tm)) / 30))
    else: back = lambda t: t
    for s in R['sent']:
        x = by[dub.key_of(ch, s)]; cs = [c for c in cks(x['text'], lang) if any(dub.norm(w) for w in c.split())]
        toks = x['text'].split(); p = 0; ws = []
        for c in cs:
            if sub[k]['s'] != c: raise SystemExit(f'{ep}: кусок {k} «{sub[k]["s"]}» ≠ «{c}»')
            tg = ''.join(dub.norm(w) for w in c.split()); acc, got = '', []
            while p < len(toks) and (acc != tg or not dub.norm(toks[p])):
                if acc == tg and dub.norm(toks[p]): break
                acc += dub.norm(toks[p]); got.append(toks[p]); p += 1
                if len(acc) > len(tg) and not tg.startswith(acc): raise SystemExit(f'{ep}: «{c}» не нашёлся в «{x["text"]}»')
            ws.append({'d': ' '.join(got), 'a': back(sub[k]['a']), 'b': back(sub[k]['b'])}); k += 1
        if p < len(toks): ws[-1]['d'] += ' ' + ' '.join(toks[p:])
        out.append({'words': ws})
    if k != len(sub): raise SystemExit(f'{ep}: кусков субтитров {len(sub)}, собрано {k}')
    return out


def main(lang):
    F = os.path.join(HERE, 'out', f'film-{lang}'); J = json.load(open(os.path.join(F, 'film.json'))); S = []
    for ep, off in zip(J['seg'], J['off']):
        T = json.load(open(os.path.join(HERE, 'out', ep, 'timeline.json')))
        for s in (dub_sents(ep, T) if lang != 'ru' and T.get('subs') else T.get('sent', [])):
            ws = [w for w in s.get('words', []) if w.get('d')]
            if not ws: continue
            for c in chunks(ws): S.append([off + c[0]['a'], off + c[-1]['b'], re.sub(r'(?<=\w)—', ' —', ' '.join(w['d'] for w in c))])
    S.sort(); res = []
    for i, (a, b, t) in enumerate(S):
        b = max(b + .25, a + 1.0)
        if i + 1 < len(S): b = min(b, S[i + 1][0] - .04)
        res.append(f'{len(res) + 1}\n{ts(a)} --> {ts(b)}\n{lines(t)}\n')
    p = os.path.join(F, 'film.srt'); open(p, 'w', encoding='utf-8').write('\n'.join(res)); print(p, len(res), 'подписей')


if __name__ == '__main__':
    for l in sys.argv[1:] or ['ru']: main(l)
