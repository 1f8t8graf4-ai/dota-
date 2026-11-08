"""Сценарии роликов-образцов (русский, без голоса). Каждый ролик — функция, возвращает {'style', 'beats'}.

Beat: cap — субтитр, hl — слова цветом, hud — плашка сверху, vis(g, p, lt) — картинка
(p — доля фразы 0…1, lt — секунды от начала фразы), live — перерисовывать каждый кадр,
key — одинаковый у соседних фраз: картинка не въезжает заново.
Факты сверены: см. tools/tt_demo_facts.md.
"""
import math, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from tt_demo import (G, fig, phone, laptop, bed, clock, heart, brain, capsule, tablet, bag, cup, liver, drop, bottle,
                     thermo, calendar, bigtxt, check, cross, door, building, bubble, graph, ecg, bars, card, light,
                     people, handle_card, eo, back, cl, lerp, F)


def B(cap, vis, hud='', hl=(), live=False, key=None, d=None, z=1.35):
    return dict(cap=cap, vis=vis, hud=hud, hl=list(hl), live=live, key=key, d=d, z=z)


# ── мелкие значки, которых нет в движке ──
def moon(g, x, y, r=50):
    g.circ(x, y, r, fill=g.FL('acc'), out=None if g.st.flat else 'acc')
    g.circ(x + r * .45, y - r * .3, r * .85, fill=g.st.headfill if not g.st.flat else '#121a3d', out=None)


def crown(g, x, y, k=1):
    pts = [(x - 90 * k, y + 40 * k), (x - 90 * k, y - 40 * k), (x - 45 * k, y), (x, y - 60 * k), (x + 45 * k, y), (x + 90 * k, y - 40 * k), (x + 90 * k, y + 40 * k)]
    g.poly(pts, fill=g.FL('acc'), out=g.O or 'acc')


def pause(g, x, y, k=1, a=255):
    for dx in (-48, 48): g.rect(x + dx * k - 26 * k, y - 110 * k, x + dx * k + 26 * k, y + 110 * k, fill='acc', out=None, rad=10, a=a)


def lock(g, x, y, k=1):
    g.arc(x, y - 40 * k, 34 * k, 180, 360, 'acc', 10 * k)
    g.line([(x - 34 * k, y - 40 * k), (x - 34 * k, y - 20 * k)], 'acc', 10 * k); g.line([(x + 34 * k, y - 40 * k), (x + 34 * k, y - 20 * k)], 'acc', 10 * k)
    g.rect(x - 52 * k, y - 22 * k, x + 52 * k, y + 56 * k, fill='acc', out=None, rad=10 * k)


def arrow(g, x0, y0, x1, y1, col='acc', w=8):
    g.line([(x0, y0), (x1, y1)], col, w)
    a = math.atan2(y1 - y0, x1 - x0)
    for s in (-1, 1): g.line([(x1, y1), (x1 - 34 * math.cos(a + s * .5), y1 - 34 * math.sin(a + s * .5))], col, w)


def strip(g, x, y, k=1, lines=0):
    g.rect(x - 70 * k, y - 190 * k, x + 70 * k, y + 190 * k, fill=g.FL('#ffffff'), out=g.O or 'fg', rad=20 * k)
    g.rect(x - 40 * k, y - 60 * k, x + 40 * k, y + 60 * k, fill=g.FL('#e9eef8'), out=g.O or 'mute', w=3, rad=8 * k)
    g.circ(x, y + 125 * k, 24 * k, fill=g.FL('#e9eef8'), out=g.O or 'mute', w=3)
    for i in range(lines): g.line([(x - 24 * k, y - 30 * k + i * 40 * k), (x + 24 * k, y - 30 * k + i * 40 * k)], 'acc2', 7)


def timeline(g, y, marks, p=1.):
    x0, x1 = 120, 960
    g.line([(x0, y), (lerp(x0, x1, eo(p)), y)], 'fg', 6)
    for (u, top, bot, c) in marks:
        x = lerp(x0, x1, u)
        if u <= eo(p) + .01:
            g.circ(x, y, 18, fill=c, out=None)
            g.text(x, y - 70, top, 'sans', 44, c); g.text(x, y + 66, bot, 'sans', 34, 'mute')


def share(g, x, y, k=1):
    for (dx, dy) in ((-60, 0), (50, -60), (50, 60)): g.circ(x + dx * k, y + dy * k, 30 * k, fill='acc', out=None)
    g.line([(x - 60 * k, y), (x + 50 * k, y - 60 * k)], 'acc', 8); g.line([(x - 60 * k, y), (x + 50 * k, y + 60 * k)], 'acc', 8)


def step(g, n, sub=None):
    kind = {'stick': 'hand', 'dark': 'cond', 'flat': 'sans', 'yellow': 'wide'}[g.st.name]
    g.circ(540, 400, 170, out='acc', w=9)
    g.text(540, 410, str(n), kind, 230, 'acc')
    if sub: g.text(540, 690, sub, kind, 76, 'fg')


def qmark(g, x, y, size=300, col='acc'):
    kind = {'stick': 'hand', 'dark': 'cond', 'flat': 'sans', 'yellow': 'wide'}[g.st.name]
    g.text(x, y, '?', kind, size, col)


GROUND = 870


# ═════════════════════ 1. Порно — человечек на чёрном ═════════════════════
def porno():
    def bedscene(g, p, lt, late=False):
        bed(g, 560, GROUND)
        fig(g, 560, GROUND - 74, 1, 'lie', mood='sad' if late else 'ok')
        phone(g, 480, GROUND - 210, .5, glow=True)
        moon(g, 800, 260)
        if late:
            clock(g, 290, 290, 85, 3, 0)
            g.text(290, 425, '03:00', 'hand', 64, 'acc')

    def graphv(kind, p0=0., p1=1., labels=()):
        return lambda g, p, lt: graph(g, 150, 230, 780, 560, kind, lerp(p0, p1, eo(lt / 1.6)), labels)

    def triggers(g, p, lt):
        n = 1 + int(cl(lt / .9) * 2.99)
        if n >= 1: clock(g, 230, 470, 110, 10, 30); g.text(230, 640, 'вечер', 'hand', 64, 'acc')
        if n >= 2: bed(g, 560, 560, .55); g.text(560, 640, 'кровать', 'hand', 64, 'acc')
        if n >= 3: phone(g, 860, 470, .8, glow=True); g.text(860, 640, 'телефон', 'hand', 64, 'acc')

    def move_phone(g, p, lt):
        laptop(g, 250, 760, 1); lock(g, 250, 650, .8)
        door(g, 760, 900)
        x = lerp(560, 900, eo(lt / 2.2))
        phone(g, x, 560, .6, glow=False)
        arrow(g, 560, 420, 860, 420, 'acc')

    def push(g, p, lt):
        dy = (math.sin(lt * 5) * .5 + .5) * 26
        fig(g, 520, GROUND - dy, 1.2, 'push', mood='ok')
        g.line([(140, GROUND + 4), (940, GROUND + 4)], 'mute', 4)
        g.text(540, 260, str(min(20, int(lt * 1.6) + 1)), 'hand', 160, 'acc')

    def cal(n_ok, n_x, big=None):
        def v(g, p, lt):
            k = int(cl(lt / 1.8) * 30)
            marks = ['ok'] * n_ok + ['x'] * n_x
            order = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
            mm = [None] * 30
            xs = {5, 11, 12, 19, 25, 28}
            oi = 0
            for i in range(30):
                if i < k: mm[i] = 'x' if i in xs else 'ok'
            calendar(g, 540, 560, 1, mm, title='НОЯБРЬ')
            if big and k >= 30: bigtxt(g, 540, 160, big, 120, 'acc', pop=eo((lt - 1.8) / .4))
        return v

    def bot(g, p, lt):
        phone(g, 540, 470, 1.6, glow=True, lines=[("I'm fine.", '#0b0b0d', 26), ('Really.', '#0b0b0d', 26), ('Я в норме. Правда.', '#0b0b0d', 11)])

    return dict(style='stick', beats=[
        B('Макс думал, что просто смотрит видео перед сном.', lambda g, p, lt: bedscene(g, p, lt), hl=['перед', 'сном'], key='bed'),
        B('Через год он не мог уснуть без этого.', lambda g, p, lt: bedscene(g, p, lt, True), hl=['без', 'этого'], key='bed'),
        B('Это не слабость. Это дофамин.', lambda g, p, lt: brain(g, 540, 520, 1.6, glow=.4 + .3 * math.sin(lt * 4)), hl=['дофамин']),
        B('Каждый раз мозг получает резкий всплеск…', graphv('peak', 0, 1, [(.1, .5, 'норма', 'mute')]), hl=['всплеск'], key='gr', z=1),
        B('…а потом проваливается ниже нормы.', graphv('drop', .3, 1, [(.1, .5, 'норма', 'mute')]), hl=['ниже', 'нормы'], key='gr', z=1),
        B('Внизу — скука, тревога и «ничего не хочется».', graphv('drop', 1, 1, [(.1, .5, 'норма', 'mute'), (.55, .92, 'скука, тревога', 'acc2')]), hl=['ничего', 'не', 'хочется'], key='gr', z=1),
        B('И мозг ищет кнопку, которая вернёт всплеск.', lambda g, p, lt: (fig(g, 380, GROUND, 1.2, arms='reach', mood='sad'), phone(g, 720, 600, .8, glow=True)), hl=['кнопку']),
        B('Шаг 1. Знай свой триггер.', lambda g, p, lt: step(g, 1, 'триггер'), hl=['Шаг', '1.']),
        B('У Макса это всегда одно и то же: вечер, кровать, телефон.', triggers, hl=['вечер,', 'кровать,', 'телефон.'], z=1.1),
        B('Шаг 2. Убери кнопку.', lambda g, p, lt: step(g, 2, 'убери кнопку'), hl=['Шаг', '2.']),
        B('Телефон — на зарядку в другой комнате. На ноутбук — блокировщик.', move_phone, hl=['в', 'другой', 'комнате.', 'блокировщик.'], z=1.15),
        B('Шаг 3. Пережди волну.', lambda g, p, lt: step(g, 3, 'пережди волну'), hl=['Шаг', '3.']),
        B('Тяга накатывает волной и обычно спадает за 20–30 минут.', lambda g, p, lt: graph(g, 150, 230, 780, 560, 'wave', eo(lt / 2.4),
          [(.06, 1.08, '0 мин', 'mute'), (.95, 1.08, '30 мин', 'mute'), (.35, -.06, 'тяга', 'acc2')]), hl=['20–30', 'минут.'], z=1),
        B('20 отжиманий, холодная вода, улица — что угодно, только не лежать с телефоном.', push, hl=['что', 'угодно,']),
        B('Шаг 4. Срыв — это не ноль.', lambda g, p, lt: step(g, 4, 'срыв ≠ ноль'), hl=['не', 'ноль.']),
        B('Считай не «серию», а сколько дней в месяце ты свободен.', cal(24, 6), hl=['сколько', 'дней'], key='cal', z=1.15),
        B('Через месяц у Макса 24 дня из 30.', cal(24, 6, '24 / 30'), hl=['24', 'дня', 'из', '30.'], key='cal2', z=1.15),
        B('Мозг перестраивается не за день. Но перестраивается.', lambda g, p, lt: (brain(g, 540, 380, 1.1), fig(g, 540, GROUND, 1, arms='up', mood='happy')), hl=['перестраивается.']),
        B('Только пустое время надо чем-то занять.', lambda g, p, lt: (fig(g, 400, GROUND, 1.2, arms='hips', mood='ok'), qmark(g, 760, 520, 320)), hl=['пустое', 'время']),
        B('Макс поставил вместо ленты 5 минут сцены из фильма на английском.', bot, hl=['5', 'минут', 'сцены']),
        B('Бот — в профиле. А ты бы смог 30 дней?', lambda g, p, lt: (handle_card(g, 540, 330), fig(g, 540, GROUND, 1, arms='wave', mood='happy')), hl=['30', 'дней?'], z=1.15),
    ])


# ═════════════════════ 2. Кокаин — тёмная инфографика ═════════════════════
def cocaine():
    def club(g, p, lt, crowd=True):
        sw = math.sin(lt * 1.3) * 18
        light(g, 230, -40, 14 + sw, 'acc', 34, 1000, 70); light(g, 850, -40, -14 - sw, 'acc2', 30, 1000, 70); light(g, 540, -40, sw * .5, '#ffffff', 14, 1000, 90)
        if crowd: people(g, 540, GROUND + 40, 7, .42, 120)

    def myth(n, body, stamp=False, then=None):
        def v(g, p, lt):
            card(g, 540, 470 if not then else 330, 860, 420, f'МИФ {n}', body, 60, stamp=eo(lt / .35) if stamp else 0)
            if then: then(g, p, lt)
        return v

    def x24(g, p, lt):
        heart(g, 300, 420, 1.4, fill='acc', pulse=math.sin(lt * 14))
        bigtxt(g, 730, 430, '×24', 230, 'acc', pop=eo(lt / .5))
        ecg(g, 120, 800, 840, lt, 1.8)

    def ce(g, p, lt):
        liver(g, 260, 480, 1.2)
        arrow(g, 430, 480, 640, 480, 'fg', 7)
        heart(g, 820, 480, 1.2, fill='acc', pulse=math.sin(lt * 12))
        g.text(540, 690, 'КОКАЭТИЛЕН', 'mono', 58, 'acc')
        g.text(260, 640, 'печень', 'mono', 36, 'mute'); g.text(820, 640, 'сердце', 'mono', 36, 'mute')

    def fent(g, p, lt):
        bag(g, 540, 420, 1.6)
        for i, (dx, dy) in enumerate(((-220, -80), (230, -40), (-180, 160), (210, 190))):
            qmark(g, 540 + dx, 420 + dy, 110, 'mute')
        bigtxt(g, 540, 780, '2 мг', 150, 'acc', pop=eo((lt - .6) / .5))

    def drain(g, p, lt):
        bars(g, 230, 640, 9, lerp(1, .15, eo(lt / 2.6)), 'acc')
        g.text(540, 330, 'ЭФФЕКТ', 'mono', 52, 'fg')

    def night(g, p, lt):
        h = lerp(2, 6, eo(lt / 3)); clock(g, 540, 380, 170, int(h), int((h % 1) * 60))
        n = 1 + int(cl(lt / 2.6) * 3.99)
        for i in range(n): bag(g, 300 + i * 160, 760, .75)

    def ecg2(g, p, lt):
        heart(g, 540, 360, 1.5, fill='acc', pulse=math.sin(lt * 16))
        ecg(g, 80, 760, 920, lt, 2.2)

    return dict(style='dark', beats=[
        B('Представь: пятница, клуб, тебе 22.', lambda g, p, lt: (club(g, p, lt), fig(g, 540, 780, 1.1)), hud='ПЯТНИЦА · 01:40', hl=['22.'], live=True, key='club'),
        B('Друг протягивает пакетик: «Попробуй, просто чтобы не спать».', lambda g, p, lt: (club(g, p, lt, False), fig(g, 340, 820, 1.1, arms='give'), bag(g, 505, 610, .5), fig(g, 740, 820, 1.1, mood='shock')),
          hud='ПЯТНИЦА · 01:40', hl=['пакетик:'], live=True, key='club'),
        B('Через несколько минут ты — король вечеринки.', lambda g, p, lt: (club(g, p, lt), fig(g, 540, 780, 1.1, arms='up', mood='happy'), crown(g, 540, 420 - 10 * math.sin(lt * 3), .9)),
          hud='ПЯТНИЦА · 01:46', hl=['король', 'вечеринки.'], live=True, key='club'),
        B('Стоп. Пока ты у стойки — три мифа.', lambda g, p, lt: (fig(g, 540, 820, 1.1, arms='up', mood='happy', col='mute'), pause(g, 540, 420, 1.2, a=int(255 * eo(lt / .4)))),
          hud='ПАУЗА', hl=['три', 'мифа.'], live=True),
        B('«Это просто бодрость, как кофе».', myth(1, '«Просто бодрость, как кофе»'), hud='МИФ 1', key='m1', z=1),
        B('ЛОЖЬ. Сосуды сужаются, пульс и давление летят вверх.', myth(1, '«Просто бодрость, как кофе»', True), hud='МИФ 1', hl=['ЛОЖЬ.'], live=True, key='m1', z=1),
        B('В первый час после дозы риск инфаркта выше примерно в 24 раза.', x24, hud='МИФ 1', hl=['в', '24', 'раза.'], live=True, z=1.1),
        B('«С алкоголем будет мягче».', myth(2, '«С алкоголем мягче»'), hud='МИФ 2', key='m2', z=1),
        B('ЛОЖЬ. В печени из них получается кокаэтилен.', myth(2, '«С алкоголем мягче»', True), hud='МИФ 2', hl=['ЛОЖЬ.', 'кокаэтилен.'], live=True, key='m2', z=1),
        B('Он бьёт по сердцу сильнее и держится дольше.', ce, hud='МИФ 2', hl=['сильнее', 'дольше.'], live=True, z=1.15),
        B('«В пакетике — чистый кокаин».', myth(3, '«Там чистый кокаин»'), hud='МИФ 3', key='m3', z=1),
        B('ЛОЖЬ. Его бодяжат — находят даже лекарство от глистов для скота.', myth(3, '«Там чистый кокаин»', True), hud='МИФ 3', hl=['ЛОЖЬ.', 'от', 'глистов', 'для', 'скота.'], live=True, key='m3', z=1),
        B('А иногда — фентанил. Пары миллиграммов хватает, чтобы остановилось дыхание.', fent, hud='МИФ 3', hl=['фентанил.'], live=True),
        B('Через 15–30 минут эффект уходит.', drain, hud='02:10', hl=['15–30', 'минут'], live=True),
        B('Пусто, тревожно — и хочется ещё.', lambda g, p, lt: (fig(g, 540, 820, 1.2, arms='head', mood='sad'), bars(g, 230, 330, 9, .15, 'acc')), hud='02:15', hl=['хочется', 'ещё.']),
        B('Так «ещё одна» повторяется до утра.', night, hud='05:50', hl=['до', 'утра.'], live=True),
        B('Сердце не спрашивает, первый раз или сотый.', ecg2, hud='06:10', hl=['первый', 'раз', 'или', 'сотый.'], live=True, z=1.1),
        B('Боль в груди, судороги, жар — сразу 112.', lambda g, p, lt: phone(g, 540, 500, 1.7, glow=True, lines=[('', 'fg', 10), ('112', '#05060a', 90)]), hud='ЕСЛИ ПЛОХО', hl=['112.']),
        B('Ты знал про кокаэтилен? Пиши в комментариях.', lambda g, p, lt: (qmark(g, 540, 470, 420), heart(g, 540, 820, .6, fill='acc', pulse=math.sin(lt * 10))), hl=['кокаэтилен?'], live=True),
    ])


# ═════════════════════ 3. ВИЧ — плоская история ═════════════════════
def hiv():
    KIR = dict(jacket='#e9a23b', hair='#3a2618')
    ANA = dict(jacket='#f59ab5', hair='#6b3b2a')

    def party(g, p, lt):
        g.rect(700, 140, 960, 400, fill='#121a3d', out='#c9a24a', w=4, rad=8)
        moon(g, 880, 230, 44)
        fig(g, 380, GROUND, 1.2, mood='happy', **KIR); fig(g, 640, GROUND, 1.2, mood='happy', **ANA)
        heart(g, 510, 420 - 12 * math.sin(lt * 3), .7, fill='acc2')

    def msg(g, p, lt):
        phone(g, 330, 560, 1.6)
        bubble(g, 700, 420, 520, 230, 'Сдай тест.\nУ меня ВИЧ.', 50, fill='#2b3a7a', tail=-1)
        g.text(700, 580, '09:24', 'mono', 32, 'mute')

    def timer(g, p, lt):
        sec = 72 * 3600 - int(lt * 37)
        h, m, s = sec // 3600, sec // 60 % 60, sec % 60
        bigtxt(g, 540, 470, f'{h:02d}:{m:02d}:{s:02d}', 150, 'acc', pop=eo(lt / .4))
        g.text(540, 640, 'осталось', 'sans', 48, 'mute')

    def pills(g, p, lt):
        n = int(cl(lt / 1.6) * 28)
        g.rect(150, 260, 930, 800, fill='#22305f', out='#c9a24a', w=4, rad=24)
        for i in range(n):
            capsule(g, 240 + (i % 7) * 100, 340 + (i // 7) * 120, .55, 'acc', '#ffffff', -35)
        g.text(540, 860, '28 дней', 'sans', 54, 'acc')

    def cal28(g, p, lt):
        k = int(cl(lt / 2.2) * 28)
        calendar(g, 540, 560, 1, ['ok'] * k, n=28, cols=7, title='ПКП · 28 ДНЕЙ')

    def walk(g, p, lt):
        building(g, 760, GROUND, 1, 'СПИД-центр')
        x = lerp(120, 470, eo(lt / 2.6))
        fig(g, x, GROUND, 1.1, 'walk', **KIR)

    def flu(g, p, lt, nothing=False):
        thermo(g, 380, 620, 1.3, lerp(.2, .8, eo(lt / 2)), '38,5°')
        fig(g, 700, GROUND, 1.1, mood='sad', **KIR)

    def test(g, p, lt):
        strip(g, 540, 520, 1.3, 0)
        bigtxt(g, 820, 360, '?', 200, 'acc')

    def tl(g, p, lt):
        timeline(g, 520, [(0, 'сегодня', 'контакт', 'fg'), (.33, '72 ч', 'ПКП', 'acc2'), (.66, '2–6 нед', 'анализ', 'acc'), (1, '3 мес', 'повтор', 'acc')], cl(lt / 2.4))

    def myths(g, p, lt):
        items = [('поцелуй', lambda x, y: heart(g, x, y - 10, .55, fill='acc2')), ('комар', lambda x, y: g.text(x, y, '🦟' if False else 'ком', 'sans', 1, 'fg')),
                 ('кружка', lambda x, y: cup(g, x, y, .7))]
        for i, (name, ic) in enumerate(items):
            x = 220 + i * 320
            if lt > i * .6:
                if name == 'комар':
                    g.circ(x, 470, 26, fill='#2b3352', out=None); g.line([(x - 70, 430), (x - 10, 460)], '#cfd6ff', 6); g.line([(x + 70, 430), (x + 10, 460)], '#cfd6ff', 6)
                    g.line([(x + 20, 480), (x + 60, 510)], '#2b3352', 5)
                else:
                    ic(x, 470)
                cross(g, x + 70, 560, .45)
                g.text(x, 680, name, 'sans', 46, 'fg')

    def result(g, p, lt):
        phone(g, 540, 520, 1.6)
        for i in range(3):
            on = int(lt * 3) % 3 == i
            g.circ(480 + i * 60, 520, 16, fill='acc' if on else 'mute', out=None)

    return dict(style='flat', beats=[
        B('Кирилл, 24. Вечеринка, новая знакомая, без презерватива.', party, hud='СУББОТА · 02:40', hl=['без', 'презерватива.'], live=True),
        B('Утром сообщение: «Сдай тест. У меня ВИЧ».', msg, hud='ВОСКРЕСЕНЬЕ · 09:24', hl=['У', 'меня', 'ВИЧ».']),
        B('Большинство ждут симптомов. Это главная ошибка.', lambda g, p, lt: (fig(g, 540, GROUND, 1.25, arms='head', mood='shock', **KIR), clock(g, 860, 300, 90, 9, 30)),
          hud='ВОСКРЕСЕНЬЕ · 09:30', hl=['главная', 'ошибка.']),
        B('Правило 1: у тебя 72 часа.', timer, hud='ПРАВИЛО 1', hl=['72', 'часа.'], live=True, z=1.1),
        B('Есть таблетки ПКП — постконтактная профилактика.', pills, hud='ПРАВИЛО 1', hl=['ПКП'], live=True, z=1),
        B('28 дней — и вирус может не закрепиться. Начать лучше в первые часы.', cal28, hud='ПРАВИЛО 1', hl=['28', 'дней', 'в', 'первые', 'часы.'], live=True, z=1.15),
        B('Кирилл едет в СПИД-центр в тот же день.', walk, hud='ВОСКРЕСЕНЬЕ · 11:00', hl=['в', 'тот', 'же', 'день.'], live=True, z=1.1),
        B('Правило 2: не верь симптомам.', lambda g, p, lt: (thermo(g, 400, 620, 1.3, .3), bigtxt(g, 720, 470, '?', 260, 'acc')), hud='ПРАВИЛО 2', hl=['не', 'верь']),
        B('Через 2–4 недели может быть «грипп»: жар, горло, сыпь. А может не быть ничего.', flu, hud='ПРАВИЛО 2', hl=['ничего.'], live=True),
        B('Правило 3: тест — не на следующий день.', test, hud='ПРАВИЛО 3', hl=['не', 'на', 'следующий']),
        B('Анализ из вены ловит вирус через 2–6 недель. Для точности — повтор через 3 месяца.', tl, hud='ПРАВИЛО 3', hl=['2–6', 'недель.', '3', 'месяца.'], live=True, z=1),
        B('Через поцелуй — нет. Через комара — нет. Через общую кружку — нет.', myths, hud='МИФЫ', hl=['нет.'], live=True, z=1.1),
        B('Через три месяца Кирилл открывает результат.', result, hud='ДЕНЬ 90', hl=['результат.'], live=True),
        B('Отрицательный. ПКП сработала.', lambda g, p, lt: (check(g, 540, 330, 1.3), fig(g, 540, GROUND, 1.15, arms='up', mood='happy', **KIR)), hud='ДЕНЬ 90', hl=['Отрицательный.']),
        B('Но даже если бы нет — с ВИЧ сегодня живут долгую жизнь.', lambda g, p, lt: (fig(g, 380, GROUND, 1.1, mood='happy', **KIR), fig(g, 600, GROUND, 1.1, mood='happy', **ANA),
          fig(g, 790, GROUND, .8, mood='happy', jacket='#3ddc97')), hl=['долгую', 'жизнь.']),
        B('Таблетки опускают вирус до «не определяется» — и он не передаётся партнёру.', lambda g, p, lt: graph(g, 150, 230, 780, 560, 'zero', eo(lt / 2.2),
          [(.12, -.06, 'вирус', 'acc2'), (.72, .8, 'не определяется', 'acc')]), hl=['не', 'передаётся'], live=True, z=1),
        B('Перешли другу. 72 часа могут спасти.', lambda g, p, lt: (share(g, 540, 380, 1.6), g.text(540, 700, '72:00:00', 'mono', 90, 'acc')), hl=['72', 'часа']),
    ])


# ═════════════════════ 4. Таблетка в клубе — жёлтые карточки ═════════════════════
def pill():
    def give(g, p, lt):
        fig(g, 330, GROUND, 1, arms='give', mood='happy', jacket='#3d6fe0')
        tablet(g, 490, 640, 26, '#f59ab5')
        fig(g, 760, GROUND, 1, mood='ok', jacket='#ffffff')

    def unknown(g, p, lt):
        tablet(g, 540, 500, 120, '#f59ab5')
        for i, (dx, dy) in enumerate(((-260, -150), (250, -170), (-250, 170), (260, 150))):
            if lt > i * .25: qmark(g, 540 + dx, 500 + dy, 120, 'acc')

    def love(g, p, lt):
        fig(g, 540, GROUND, 1.1, arms='up', mood='happy', jacket='#3d6fe0')
        for i, (dx, dy) in enumerate(((-260, -360), (240, -400), (-300, -150), (290, -170))):
            heart(g, 540 + dx, GROUND + dy - 10 * math.sin(lt * 3 + i), .45, fill='acc')

    def sero(g, p, lt):
        brain(g, 540, 470, 1.5)
        for i in range(14):
            a = i / 14 * 2 * math.pi; r = 200 + (lt * 260 + i * 37) % 260
            g.circ(540 + math.cos(a) * r, 470 + math.sin(a) * r * .8, 14, fill='acc2', out='fg', w=4)

    def hot(g, p, lt, full=False):
        lv = .95 if full else lerp(.35, .85, eo(lt / 2.4))
        t = 37 + lv * 4
        thermo(g, 360, 640, 1.4, lv, f'{t:.1f}°'.replace('.', ','))
        fig(g, 760, GROUND, 1, arms='up' if not full else 'head', mood='happy' if not full else 'shock', jacket='#3d6fe0')
        for i in range(3): drop(g, 690 + i * 70, 470 + (lt * 120 + i * 40) % 140, .35, '#3d6fe0')
        if full: bigtxt(g, 540, 200, '40°+', 140, 'acc', pop=eo(lt / .4))

    def water(g, p, lt):
        n = 1 + int(cl(lt / 1.8) * 4.99)
        for i in range(n): bottle(g, 200 + i * 170, 600, 1.1)

    def natr(g, p, lt):
        brain(g, 540, 430, 1.4 + .06 * math.sin(lt * 6))
        drop(g, 260, 760, .9, '#3d6fe0'); g.text(560, 780, 'натрий ↓', 'wide', 64, 'acc')

    def two(g, p, lt):
        tablet(g, 420, 500, 90, '#f59ab5'); tablet(g, 660, 520, 90, '#9ad0ff')
        g.text(540, 720, '+1', 'wide', 110, 'acc')

    def pmma(g, p, lt):
        tablet(g, 330, 470, 110, '#9ad0ff'); g.text(330, 650, 'PMMA', 'wide', 64, 'acc')
        clock(g, 760, 470, 130, 3, int(lt * 6) % 60)
        g.text(760, 650, 'медленно', 'sans', 46, 'fg')

    def morning(g, p, lt):
        bed(g, 560, GROUND, 1)
        fig(g, 560, GROUND - 74, .95, 'lie', mood='shock', jacket='#3d6fe0')
        g.circ(880, 210, 60, fill='#ffffff', out='fg')

    return dict(style='yellow', beats=[
        B('Тебе протягивают таблетку в клубе: «Это экстази, всё норм».', give, hud='00:00', hl=['таблетку']),
        B('Главного ты не знаешь: что в ней на самом деле.', unknown, hud='00:00', hl=['на', 'самом', 'деле.'], live=True),
        B('Накрывает: тепло, всех любишь, хочется танцевать.', love, hud='00:40', hl=['всех', 'любишь,'], live=True),
        B('Мозг выбрасывает огромную порцию серотонина — разом.', sero, hud='00:40', hl=['серотонина'], live=True),
        B('Жарко. Духота, танцы — температура тела ползёт вверх.', hot, hud='01:30', hl=['температура'], live=True, key='hot'),
        B('Перегрев — одна из главных причин смертей от экстази.', lambda g, p, lt: hot(g, p, lt, True), hud='01:30', hl=['Перегрев'], live=True, key='hot'),
        B('Ты пьёшь воду литрами, чтобы остыть.', water, hud='02:30', hl=['литрами,'], live=True),
        B('Тоже опасно: натрий в крови падает, мозг отекает.', natr, hud='02:30', hl=['натрий', 'отекает.'], live=True),
        B('Не накрыло второй раз? Друг предлагает ещё одну.', two, hud='03:00', hl=['ещё', 'одну.']),
        B('Если в ней не MDMA, а PMMA, она действует медленнее. Человек добавляет — и передозирует.', pmma, hud='03:00', hl=['PMMA,', 'передозирует.'], live=True),
        B('Утро. Челюсть сводит, сна нет.', morning, hud='06:00', hl=['сна', 'нет.']),
        B('Через 2–3 дня — тоска и пустота.', lambda g, p, lt: (fig(g, 380, GROUND, 1.1, arms='head', mood='sad', jacket='#3d6fe0'), bars(g, 600, 560, 5, .15, 'acc'),
          g.text(740, 640, 'серотонин', 'sans', 44, 'fg')), hud='ВТОРНИК', hl=['тоска']),
        B('Другу жарко, он путается или его трясёт — сразу 112.', lambda g, p, lt: phone(g, 540, 500, 1.7, lines=[('', 'fg', 10), ('112', 'acc', 96)]), hud='ЕСЛИ ПЛОХО', hl=['112.']),
        B('И не оставляй его одного.', lambda g, p, lt: (fig(g, 420, GROUND, 1, arms='reach', mood='ok', jacket='#3bb273'), fig(g, 650, GROUND, 1, arms='head', mood='sad', jacket='#3d6fe0')),
          hud='ЕСЛИ ПЛОХО', hl=['одного.']),
        B('Ты бы взял таблетку у незнакомца? Пиши в комментариях.', lambda g, p, lt: (tablet(g, 380, 520, 110, '#f59ab5'), qmark(g, 720, 520, 360)), hl=['у', 'незнакомца?']),
    ])


VIDEOS = {'porno': porno, 'cocaine': cocaine, 'hiv': hiv, 'pill': pill}
