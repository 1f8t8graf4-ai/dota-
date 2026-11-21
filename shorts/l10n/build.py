#!/usr/bin/env python3
"""21.11 — сборка локализации глав 1–3 (EN/DE) без новой записи голоса.

  python3 l10n/build.py            → tl/<ролик>-en.json и -de.json (таймлайн русского голоса + субтитры перевода `subs`),
                                      ep/l10n-dict.js (надписи в кадре RU → EN/DE), l10n/тексты-EN-DE.md (тексты для озвучки и проверки)
  python3 l10n/build.py --missing  → чего нет в словаре: строки, которые ролик EN/DE всё ещё рисует по-русски
                                      (сначала `node capture.mjs <ролик>-en texts` → out/<ролик>-en/texts.json)

Субтитры перевода: фраза перевода режется на куски по 1–4 слова (≤ 22–24 знака, не через знак препинания), куски встают на время
русских слов той же фразы — по доле текста; «|» в переводе — пауза русского голоса (если пауз столько же — куски идут по ним).
"""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); sys.path.insert(0, HERE)
from data import SENT, STR, RULES

EPS = ['v170a', 'v170e', 'v191s', 'v191y', 'v200s', 'v200y']
LANGS = ['en', 'de']
FW = {
    'en': {'a', 'an', 'the', 'of', 'to', 'in', 'on', 'at', 'for', 'and', 'or', 'but', 'with', 'by', 'from', 'as', 'that', 'its', 'their', 'our',
           'your', 'his', 'her', 'into', 'than', 'so', 'if', 'it', 'is', 'was', 'were', 'be', 'not', 'no', 'one', 'who', 'what', 'how', 'just'},
    'de': {'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einen', 'einem', 'einer', 'und', 'oder', 'aber', 'mit', 'von', 'vom', 'zu', 'zum',
           'zur', 'im', 'in', 'am', 'an', 'auf', 'für', 'aus', 'bei', 'nach', 'als', 'dass', 'wie', 'um', 'ins', 'es', 'sie', 'ihr', 'sich', 'nur',
           'noch', 'schon', 'kein', 'keine', 'man', 'was', 'wer', 'so', 'ist', 'war', 'wird'},
}
MAXC = {'en': 22, 'de': 24}
PAUSE = .28
END = re.compile(r'[.,!?…:;—–]$')


def bare(w):
    return re.sub(r'[«»"“”„.,?!…:;—–]', '', w).lower()


ABBR = re.compile(r'^([A-Z]\.)+$')   # R.J. — не конец фразы


def cost(ws, lang, final=False):
    s = ' '.join(ws); n = len(re.sub(r'[\s.,;:—–]+$', '', s)); c = 10
    if n > MAXC[lang]: c += (n - MAXC[lang]) * 15
    if n < 7: c += (7 - n) * 4
    if n < 11: c += (11 - n) * 1.5   # короткие куски мелькают
    if len(ws) == 1: c += 6 if n > 5 else 30   # одно слово — только если иначе никак (короткое — почти никогда)
    if len(ws) > 4: c += 60
    if len(ws) > 1 and not final and bare(ws[-1]) in FW[lang]: c += 25   # кусок не кончается служебным словом (в конце фразы — можно: «…Fließbänder an»)
    return c


def split_phrase(ws, lang):
    """фраза (между знаками препинания) → куски с наименьшей «стоимостью»: не длиннее MAXC, не кончаются служебным словом, без огрызков"""
    n = len(ws); best = [0] + [1e9] * n; prev = [0] * (n + 1)
    for e in range(1, n + 1):
        for b in range(max(0, e - 6), e):
            c = best[b] + cost(ws[b:e], lang, e == n)
            if c < best[e]: best[e], prev[e] = c, b
    out, e = [], n
    while e > 0: out.insert(0, ws[prev[e]:e]); e = prev[e]
    return out


def chunks(text, lang):
    """фраза перевода → список кусков (строк) по правилам субтитров главы"""
    words = []
    for w in text.split():   # тире — к предыдущему слову (кусок кончается на тире, само тире потом уходит)
        if w in ('—', '–') and words: words[-1] += ' ' + w
        else: words.append(w)
    phrases, cur = [], []
    for w in words:
        cur.append(w)
        if END.search(w) and not ABBR.match(w): phrases.append(cur); cur = []
    if cur: phrases.append(cur)
    res = []
    for ph in phrases:
        for c in split_phrase(ph, lang):
            s = ' '.join(c).replace('...', '…')
            s = re.sub(r'[\s.,;:—–]+$', '', s) if not ABBR.match(c[-1]) else s; s = re.sub(r'^[—–]\s*', '', s)
            if s: res.append(s)
    return res


def ru_segments(words):
    seg, out = [], []
    for i, w in enumerate(words):
        seg.append(w)
        if i + 1 < len(words) and words[i + 1]['a'] - w['b'] > PAUSE: out.append(seg); seg = []
    if seg: out.append(seg)
    return out


def wlen(s):
    """«длина» текста для расстановки по времени: цифра звучит долго (≈ 4,5 буквы)"""
    return sum(4.5 if ch.isdigit() else 1 for ch in s)


def place(seg_words, pieces):
    """куски перевода → время на русских словах сегмента: доля текста перевода = доля русского текста (внутри слова — по его длительности),
    начало куска — на начало русского слова, если оно ближе 0,15 с"""
    P, x = [], 0
    for w in seg_words: L = max(1, wlen(w['d'])); P.append((x, x + L, w['a'], w['b'])); x += L + 1
    tot = max(1, x - 1)
    def tmap(r):
        for i, (p0, p1, a, b) in enumerate(P):
            if r <= p1: return a + (b - a) * max(0, r - p0) / max(1, p1 - p0) if r >= p0 else (P[i - 1][3] + (a - P[i - 1][3]) * (r - P[i - 1][1]) / max(1e-6, p0 - P[i - 1][1]) if i else a)
        return P[-1][3]
    epos, m = [], 0
    for p in pieces: epos.append(m); m += wlen(p) + 1
    etot = max(1, m - 1); res = []
    for j, p in enumerate(pieces):
        a = seg_words[0]['a'] if j == 0 else tmap(epos[j] / etot * tot)
        near = min((w['a'] for w in seg_words), key=lambda v: abs(v - a))
        if abs(near - a) < .15: a = near
        if res and a < res[-1]['a'] + .3: a = res[-1]['a'] + .3
        res.append({'a': round(a, 3), 's': p})
    end = seg_words[-1]['b']
    for j in range(1, len(res)):   # кусок на экране не меньше 0,5 с: сдвигаем начало следующего, пока хватает места до конца сегмента
        need = res[j - 1]['a'] + .5; room = end - .5 * (len(res) - j)
        if res[j]['a'] < need: res[j]['a'] = round(min(need, max(res[j]['a'], room)), 3)
    for j, c in enumerate(res):
        c['b'] = round(res[j + 1]['a'] - .02, 3) if j + 1 < len(res) else end
        if c['b'] <= c['a']: c['b'] = round(c['a'] + .3, 3)
    return res


def subs_for(sent, lang):
    tr = SENT.get(sent['text'])
    if not tr: raise SystemExit('нет перевода реплики: ' + sent['text'])
    text = tr[0 if lang == 'en' else 1]
    parts = [p.strip() for p in text.split('|')]
    segs = ru_segments(sent['words'])
    if len(parts) != len(segs): parts, segs = [' '.join(parts)], [sent['words']]
    out = []
    for p, sw in zip(parts, segs): out += place(sw, chunks(p, lang))
    return out


def build_tl():
    for ep in EPS:
        src = os.path.join(ROOT, 'tl', ep + '-ru.json'); T = json.load(open(src))
        for lang in LANGS:
            t = dict(T); t['lang'] = lang; t['ep'] = ep + '-' + lang
            t['subs'] = [c for s in T['sent'] for c in subs_for(s, lang)]
            for p in (os.path.join(ROOT, 'tl', ep + '-' + lang + '.json'), os.path.join(ROOT, 'out', ep + '-' + lang, 'timeline.json')):
                if 'out' in p and not os.path.isdir(os.path.dirname(p)): continue
                json.dump(t, open(p, 'w'), ensure_ascii=False)
            print(ep + '-' + lang, 'субтитров:', len(t['subs']), 'длина', t['dur'])


def build_dict():
    D = {}
    for li, lang in enumerate(LANGS):
        D[lang] = {'strings': {k: v[li] for k, v in STR.items() if v[li] is not None}, 'rules': RULES.get(lang, [])}
    with open(os.path.join(ROOT, 'ep', 'l10n-dict.js'), 'w') as f:
        f.write('// 21.11 — надписи в кадре глав 1–3: RU → EN / DE. Собирается из l10n/data.py: python3 l10n/build.py\n')
        f.write('window.L10N_DICT = ' + json.dumps(D, ensure_ascii=False, indent=0) + ';\n')
    print('ep/l10n-dict.js: строк', len(STR))


def build_md():
    names = {'v170a': 'Глава 1 «Боб» — шортс', 'v170e': 'Глава 1 «Боб» — фильм (мостик в главу 2)', 'v191s': 'Глава 2 «Лёд» — шортс',
             'v191y': 'Глава 2 «Лёд» — фильм (мостик в главу 3)', 'v200s': 'Глава 3 «Мальборо» — шортс', 'v200y': 'Глава 3 «Мальборо» — фильм'}
    L = ['# Главы 1–3 на английском и немецком — тексты', '', 'Собрано `python3 l10n/build.py` из `l10n/data.py`. Годятся и для озвучки, и для проверки.', '']
    for ep in EPS:
        T = json.load(open(os.path.join(ROOT, 'tl', ep + '-ru.json')))
        L += ['## ' + names[ep], '']
        for lang, col in (('en', 0), ('de', 1)):
            L += ['**' + lang.upper() + '**', '']
            L += ['- ' + SENT[s['text']][col].replace(' | ', ' ').replace('|', '') for s in T['sent']]
            L.append('')
    open(os.path.join(HERE, 'тексты-EN-DE.md'), 'w').write('\n'.join(L))


def build_srt():
    """субтитры по фразам (.srt) — для загрузки на YouTube отдельной дорожкой: out/deliver-l10n/<Глава>_<ЯЗ>.srt"""
    NM = {'v170e': 'Ch1_Bob_Film', 'v191s': 'Ch2_Ice_Shorts', 'v191y': 'Ch2_Ice_Film', 'v200s': 'Ch3_Marlboro_Shorts', 'v200y': 'Ch3_Marlboro_Film'}
    od = os.path.join(ROOT, 'out', 'deliver-l10n'); os.makedirs(od, exist_ok=True)
    ts = lambda x: '%02d:%02d:%02d,%03d' % (int(x // 3600), int(x % 3600 // 60), int(x % 60), int(round(x % 1 * 1000)) % 1000)
    for ep, nm in NM.items():
        T = json.load(open(os.path.join(ROOT, 'tl', ep + '-ru.json')))
        for li, lang in enumerate(LANGS):
            L = []
            for k, snt in enumerate(T['sent']):
                txt = SENT[snt['text']][li].replace(' | ', ' ').replace('|', '')
                nx = T['sent'][k + 1]['a'] - .02 if k + 1 < len(T['sent']) else snt['b'] + .8
                L += [str(k + 1), ts(snt['a']) + ' --> ' + ts(min(snt['b'] + .3, nx)), txt, '']
            open(os.path.join(od, nm + '_' + lang.upper() + '.srt'), 'w').write('\n'.join(L))


def missing():
    bad = {}
    for ep in EPS:
        for lang in LANGS:
            p = os.path.join(ROOT, 'out', ep + '-' + lang, 'texts.json')
            if not os.path.exists(p): continue
            for s, (t0, t1, n, drawn) in json.load(open(p)).items():
                if re.search('[А-Яа-яЁё]', drawn): bad.setdefault(s, []).append('%s-%s %.1f–%.1f' % (ep, lang, t0, t1))
    for s, w in sorted(bad.items(), key=lambda x: x[1][0]): print(repr(s), '|', ', '.join(w[:3]))
    print('без перевода:', len(bad))


if __name__ == '__main__':
    if '--missing' in sys.argv: missing()
    else: build_tl(); build_dict(); build_md(); build_srt()
