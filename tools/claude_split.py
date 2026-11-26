#!/usr/bin/env python3
"""Разгрузка CLAUDE.md (26.11, разовый скрипт: номера строк — под CLAUDE.md коммита 93d3cc5): старый файл режется на блоки, каждый блок дословно уходит ровно в один новый файл.

  python3 tools/claude_split.py plan  <старый CLAUDE.md>     # что куда, без записи
  python3 tools/claude_split.py write <старый CLAUDE.md>     # записать файлы журналов
  python3 tools/claude_split.py check <старый CLAUDE.md>     # каждая строка старого — ровно в одном новом файле

Блок — абзац с жирного заголовка `**…` в начале строки, раздел `## ` / `### `,
а в хвосте (облако, Restless, мод) — каждый пункт верхнего уровня `- **…`.
Пустые строки не считаются. Ядро CLAUDE.md пишется руками; блоки с назначением CORE
из старого файла переносятся в него дословно (команда write печатает их в _core_moved.md).
"""
import collections, os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
CORE = 'CLAUDE.md'
DEST = {
    'core': CORE,
    'hist': 'docs/app/history.md',
    'data': 'docs/app/data.md',
    'hand': 'docs/handoffs.md',
    'duh': 'shorts/log/duhless.md',
    'kash': 'shorts/log/kashalot.md',
    'dyn': 'shorts/log/dynasty.md',
    'hero': 'shorts/log/heroes.md',
    'nic': 'shorts/log/nicotine.md',
    'dl': 'shorts/log/deadlock.md',
    'demo': 'shorts/log/demo-08.11.md',
    'rl': 'restless/log.md',
}
TITLE = {
    'hist': '# «Языки по кино» — история версий и макетов\n\nПеренесено из CLAUDE.md 26.11 дословно. Свежее — в CLAUDE.md (ядро) и в разделах ниже по датам.\n',
    'data': '# «Языки по кино» — данные сцен, обучение, видео\n\nПеренесено из CLAUDE.md 26.11 дословно.\n',
    'hand': '# Передачи между чатами и Claude\n\nПеренесено из CLAUDE.md 26.11 дословно: с какого файла начинать в новом чате по каждой теме.\n',
    'duh': '# Ролик «Духless» — журнал\n\nПеренесено из CLAUDE.md 26.11 дословно, свежее сверху.\n',
    'kash': '# Ролики «Кашалот» / «Эссекс» — журнал\n\nПеренесено из CLAUDE.md 26.11 дословно.\n',
    'dyn': '# Разбор «Династии» (dynastixxx) — журнал\n\nПеренесено из CLAUDE.md 26.11 дословно.\n',
    'hero': '# Формат «Ты — герой фильма» и канал NightFabel — журнал\n\nПеренесено из CLAUDE.md 26.11 дословно.\n',
    'nic': '# «Что вы знаете о никотине?» и первые пробы роликов (08–24.11) — журнал\n\nПеренесено из CLAUDE.md 26.11 дословно, свежее сверху.\n',
    'dl': '# Ролики по Deadlock (TikTok, диалоги героев) — журнал\n\nПеренесено из CLAUDE.md 26.11 дословно.\n',
    'demo': '# Ролики-образцы 08.11 (порно, кокаин, ВИЧ, таблетка) — журнал\n\nПеренесено из CLAUDE.md 26.11 дословно.\n',
    'rl': '# Restless (сайт, мод, программа) — журнал\n\nПеренесено из CLAUDE.md 26.11 дословно. Подробности: `mod/README.md`, `restless/src/README.md`, `restless/app/README.md`.\n',
}
LAST_H = ['']
TAIL = 2392  # с этой строки старого файла блоки режутся по пунктам «- **»


def units(lines):
    starts = []
    for i, l in enumerate(lines, 1):
        if l.startswith('**') or l.startswith('## ') or l.startswith('### ') or l.startswith('# '):
            starts.append(i)
        elif i >= TAIL and l.startswith('- '):
            starts.append(i)
    starts = sorted(set(starts))
    out = []
    for k, s in enumerate(starts):
        e = (starts[k + 1] - 1) if k + 1 < len(starts) else len(lines)
        out.append((s, e))
    if starts and starts[0] > 1:
        out.insert(0, (1, starts[0] - 1))
    return out


def classify(s, e, lines):
    h = lines[s - 1]
    t = ''.join(lines[s - 1:e])
    if s <= 5:
        return 'hist'
    if s < 1006:
        if re.match(r'\*\*(Новый чат по роликам|Ролики — другому Claude|Ролики ради денег|Другому Claude|Следующему Claude|Новому Claude|Передача 25\.10|Свежее состояние|Новому боту)', h):
            return 'hand'
        if 'Духless' in h or h.startswith('**Ролики, 25.11 (вечер) — пробники стиля'):
            return 'duh'
        if '«Кашалот»' in h and s < 101:
            return 'kash'
        if ('Династи' in h and s < 101) or 'разбор dynastixxx' in h:
            return 'dyn'
        if 'NightFabel' in h or 'первые цифры, решение по никотину' in h:
            return 'hero'
        return 'nic'
    if s < TAIL:
        if re.match(r'## (Кто автор|Что это|Архитектура|Где что лежит|ЖЁСТКИЕ ПРАВИЛА|Проверка перед сдачей)', h):
            return 'core'
        if re.match(r'## (Данные сцен|Как устроено обучение|Видео$)', h.strip()):
            return 'data'
        return 'hist'
    # хвост: облако 27.10 → Restless, мод, макеты, ролики Deadlock
    if h.startswith('### Передача в облако') or (h.startswith('- ') and LAST_H[0].startswith('### Передача в облако')):
        return 'hand'
    key = h[:160]
    if not h.startswith('- **') and h.startswith('- '):
        if re.search(r'Ролик|tt_chat|tt_guest', key):
            return 'dl'
        if re.search(r'макет|Макет|ArtifactData list notes|27″ мышью|Ответы Андрея на v15|Страница макетов', key):
            return 'hist'
    if h.startswith('- **Договорились о словах'):
        return 'hist'
    if re.search(r'Макеты|Ветки Зетки по ТЗ v12|Под каждым вариантом|Три дизайна|Приложение из макетов|Промт Крысиного', key):
        return 'hist'
    if re.search(r'Пробный ролик|Отзыв Андрея на пробу|Оба ролика|Зетке\*\* — `ТЗ-ZAI-tiktok|Диалог в пробном|Ролик Дормен|Ролики без тишины|партия №2 петель|Сеть облака', key):
        return 'dl'
    if h.startswith('### Облако, 27.10 — пробный ролик'):
        return 'dl'
    if h.startswith('### Облако, 27.10 вечер — v14'):
        return 'hist'
    if h.startswith('### Облако, 27.10 ночь — v15') or h.startswith('### Облако, 27.10 вечер — «Уже готово»'):
        return 'hist'
    return 'rl'


# дословные куски внутри больших блоков хвоста, которые по смыслу — в другие журналы (строка → куда)
SPLIT_LINES = {}


def plan(path):
    lines = open(path, encoding='utf8').read().split('\n')
    if lines and lines[-1] == '':
        lines = lines[:-1]
    lines = [l + '\n' for l in lines]
    res = []
    for s, e in units(lines):
        if lines[s - 1].startswith('#'):
            LAST_H[0] = lines[s - 1]
        res.append((s, e, classify(s, e, lines)))
    # внутри последнего пункта «Зетке — вводная…» — подпункты про ролики уходят в журналы роликов
    fix = []
    for s, e, d in res:
        if d != 'rl' or e - s < 3:
            fix.append((s, e, d)); continue
        cur, cs = d, s
        for i in range(s, e + 1):
            l = lines[i - 1]
            nd = None
            if i > s and re.match(r'  - \*\*07\.11, вечер — ролики', l):
                nd = 'dl'
            elif i > s and re.match(r'  - \*\*08\.11 — ролики-образцы', l):
                nd = 'demo'
            elif i > s and cur in ('dl', 'demo') and re.match(r'  - \*\*', l):
                nd = 'rl'
            if nd and nd != cur:
                fix.append((cs, i - 1, cur)); cur, cs = nd, i
        fix.append((cs, e, cur))
    return lines, fix


def main():
    cmd, path = sys.argv[1], sys.argv[2]
    lines, res = plan(path)
    if cmd == 'plan':
        for s, e, d in res:
            print(f'{s:5d}-{e:<5d} {d:5s} {lines[s - 1][:90].rstrip()}')
        c = collections.Counter()
        for s, e, d in res:
            c[d] += sum(1 for l in lines[s - 1:e] if l.strip())
        print(dict(c))
        return
    if cmd == 'write':
        buf = collections.defaultdict(list)
        for s, e, d in res:
            buf[d].append(''.join(lines[s - 1:e]).rstrip('\n') + '\n')
        for d, parts in buf.items():
            if d == 'core':
                with open(os.path.join(ROOT, '_core_moved.md'), 'w', encoding='utf8') as f:
                    f.write('\n'.join(parts))
                continue
            p = os.path.join(ROOT, DEST[d])
            os.makedirs(os.path.dirname(p), exist_ok=True)
            with open(p, 'w', encoding='utf8') as f:
                f.write(TITLE[d] + '\n' + '\n'.join(parts))
            print('написан', DEST[d], len(parts), 'блоков')
        return
    if cmd == 'check':
        files = {DEST[d]: open(os.path.join(ROOT, DEST[d]), encoding='utf8').read().split('\n') for d in DEST
                 if os.path.exists(os.path.join(ROOT, DEST[d]))}
        cnt = collections.Counter()
        where = collections.defaultdict(set)
        for f, ls in files.items():
            for l in ls:
                if l.strip():
                    cnt[l] += 1; where[l].add(f)
        need = collections.Counter(l.rstrip('\n') for l in lines if l.strip())
        lost = [l for l in need if cnt[l] < need[l]]
        dup = [l for l in need if cnt[l] > need[l]]
        print(f'строк в старом: {sum(need.values())}; не найдено: {len(lost)}; лишних повторов: {len(dup)}')
        for l in lost[:10]:
            print('  НЕТ:', l[:120])
        for l in dup[:10]:
            print('  ДВАЖДЫ:', l[:80], sorted(where[l]))
        sys.exit(1 if lost or dup else 0)


if __name__ == '__main__':
    main()
