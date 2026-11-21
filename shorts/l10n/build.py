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
    """22.11: один файл на проверку — текст диктора глав 1–5 и финала (RU / EN / DE по строкам) и все надписи в кадре по главам"""
    import subprocess
    from data45 import CH3_Q, CH4, CH5, FIN
    tl = lambda ep: json.load(open(os.path.join(ROOT, 'tl', ep + '-ru.json')))['sent']
    def rows(ep, drop=(), only=None, tr=None):
        out = []
        for s_ in tl(ep):
            sc = s_['scene']
            if sc in drop or (only and sc not in only): continue
            en, de = (tr[sc] if tr else SENT[s_['text']])
            out.append((s_['text'], en.replace(' | ', ' ').replace('|', ''), de.replace(' | ', ' ').replace('|', '')))
        return out
    CH = [
        ('Глава 1 «Боб» · 1979 · Соль', rows('v170e'), rows('v170a'), ''),
        ('Глава 2 «Лёд» · 2020 · Лазейка одноразок', rows('v191y'), rows('v191s'), ''),
        ('Глава 3 «Мальборо» · 1924', rows('v200y', drop=('s13', 's14')), rows('v200s', drop=('s13', 's14', 'q')) + [(CH3_Q[0],) + CH3_Q[1]],
         'Новая концовка (22.11): строк 13–14 про «третью жизнь» и нагреватель больше нет — фильм кончается строкой 12 и уходит на доску к карточке 2014, '
         'шортс — вопросом про обещание (голос уже записан). Ролики главы 3 (RU, EN, DE) под новую концовку ещё не пересобраны.'),
        ('Глава 4 «Айкос» · 2014 · Нагреватели', rows('v210y', tr=CH4), rows('v210s', tr=CH4), ''),
        ('Глава 5 «Снюс» · 2022', rows('v220y', drop=('f1', 'f2', 'f3', 'f4'), tr=CH5), rows('v220s', tr=CH5),
         'Строка 3 адаптирована: «у нас» (в России) → «многие».'),
    ]
    L = ['# Главы 1–5 и финал на английском и немецком — тексты на проверку', '',
         'Собрано `python3 l10n/build.py`: голос глав 1–3 — `l10n/data.py`, глав 4–5 и финала — `l10n/data45.py`, надписи — словари роликов.',
         'Голос EN и DE ещё не записан: сначала проверка.', '',
         '- **Часть 1** — текст диктора: фильм целиком по строкам (RU → EN → DE), у шортса — только то, чем он отличается.',
         '- **Часть 2** — все надписи в кадре по главам: RU → EN → DE.',
         '- Немецкий — на «ihr», кавычки „…“, тире –. Правки проверки 22.11 внесены, Kartusche → Pod.', '',
         '# Часть 1. Текст диктора', '']
    def block(n, r):
        return ['**%s.** %s' % (n, r[0]), '', '- EN: ' + r[1], '- DE: ' + r[2], '']
    for name, film, short, note in CH:
        L += ['## ' + name, '']
        if note: L += ['> ' + note, '']
        L += ['### Фильм', '']
        fset = {r[0] for r in film}; sset = {r[0] for r in short}
        for n, r in enumerate(film, 1):
            b = block(n, r)
            if r[0] not in sset: b[0] += ' *(только в фильме)*'
            L += b
        common = [i for i, r in enumerate(short) if r[0] in fset]
        head = [r for i, r in enumerate(short) if r[0] not in fset and (not common or i < common[0])]
        tail = [r for i, r in enumerate(short) if r[0] not in fset and common and i > common[-1]]
        L += ['### Шортс — отличия от фильма', '']
        if not head and not tail: L += ['Тот же текст, что в фильме, без строк *только в фильме*.', '']
        if head:
            L += ['**Начало шортса:**', '']
            for n, r in enumerate(head, 1): L += block('Ш' + str(n), r)
        if tail:
            L += ['**Концовка шортса** (после строки «%s»):' % short[common[-1]][0], '']
            for n, r in enumerate(tail, 1): L += block('Ш' + str(len(head) + n), r)
    L += ['## Финал фильма (после главы 5)', '']
    for n, r in enumerate(rows('v220y', only=('f1', 'f2', 'f3', 'f4'), tr=FIN), 1): L += block(n, r)
    # ---------- надписи ----------
    L += ['# Часть 2. Надписи в кадре', '', 'Названия марок и изданий (Marlboro, Philip Morris, JUUL, IQOS, ZYN, FDA, The Times…) — латиницей во всех языках, их тут нет.', '']
    def table(rs):
        return ['| RU | EN | DE |', '|---|---|---|'] + ['| %s | %s | %s |' % tuple(x.replace('|', '/') for x in r) for r in rs] + ['']
    seen = set()
    for name, eps in (('Глава 1 «Боб»', ['v170e']), ('Глава 2 «Лёд»', ['v191s', 'v191y']), ('Глава 3 «Мальборо»', ['v200s', 'v200y'])):
        rs = []
        for ep in eps:
            pth = os.path.join(ROOT, 'out', ep + '-en', 'texts.json')
            if not os.path.exists(pth): continue
            for k in json.load(open(pth)):
                if k in STR and k not in seen and STR[k][0] is not None: seen.add(k); rs.append((k,) + tuple(STR[k]))
        L += ['## ' + name, '', 'Повторы из прошлых глав не дублирую.', ''] + table(rs)
    D = json.loads(subprocess.check_output(['node', os.path.join(HERE, 'dicts45.js')]))
    for name, ch in (('Глава 4 «Айкос»', 'ch4'), ('Глава 5 «Снюс» и финал', 'ch5')):
        t = [(r['ru'], r['en'], r['de']) for r in D[ch]['rows'] if r['src'] == 'TEXT']
        o = [(r['ru'], r['en'], r['de']) for r in D[ch]['rows'] if r['src'] == 'OBJ']
        L += ['## ' + name, '', '**Плашки и подписи:**', ''] + table(t)
        if o: L += ['**Надписи на предметах** (газета, журнал, патент, карта):', ''] + table(o)
    open(os.path.join(HERE, 'тексты-EN-DE.md'), 'w').write('\n'.join(L))
    print('l10n/тексты-EN-DE.md: строк', len(L))


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
