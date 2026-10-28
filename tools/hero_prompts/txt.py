# Промты героев простым текстом — для iPhone (html на 1,5 МБ с картинками там не открывается).
#   python3 tools/hero_prompts/txt.py  →  tools/hero_prompts/hero-prompts.txt  (из уже собранного hero-prompts.html)
import re, html, json, os
D = os.path.dirname(os.path.abspath(__file__))
s = open(os.path.join(D, 'hero-prompts.html'), encoding='utf8').read()
neg = json.loads(re.search(r'const NEG=(".*?");', s).group(1))
tx = lambda h: html.unescape(re.sub(r'<[^>]+>', '', h)).strip()
out = ['ПРОМТЫ ГЕРОЕВ DEADLOCK — оживить арт (Flow / Veo / Gemini)',
       'Как: берёшь кадр 16:9 героя, вставляешь «Полный» промт (или единственный «Промт»). Откажет — «Запасной». Негатив — в поле «что не делать» (если его нет — в конец промта).',
       'Петля: в Flow «Кадры в видео», первый и последний кадр — один и тот же арт. Готовый ролик кидай мне — склею петлю.', '',
       '=== НЕГАТИВ (для всех героев) ===', neg, '']
for m in re.finditer(r'<article class="c[^"]*" data-k="([a-z0-9-]+)"(.*?)</article>', s, re.S):
    k, a = m.group(1), m.group(2)
    h = re.search(r'<h2>(.*?)</h2>', a, re.S)
    out.append('=' * 60)
    out.append('### ' + (tx(h.group(1)) if h else k))
    w = re.search(r'<p class="why">(.*?)</p>', a, re.S)
    if w and tx(w.group(1)): out.append('Что важно: ' + tx(w.group(1)))
    lab = 'ПОЛНЫЙ' if len(re.findall(r'<p class="pr">', a)) > 1 else 'ПРОМТ (один, короткий — вставляй его)'
    for p in re.finditer(r'<p class="(pr|alt|vb)">(.*?)</p>', a, re.S):
        c, t = p.group(1), tx(p.group(2))
        if c == 'pr':
            out += ['', '--- ' + lab + ' ---', t]; lab = 'ЕЩЁ ВАРИАНТ'
        else:
            lab = t.upper()
    out.append('')
open(os.path.join(D, 'hero-prompts.txt'), 'w', encoding='utf8').write('\n'.join(out) + '\n')
print('hero-prompts.txt', len(out), 'строк')
